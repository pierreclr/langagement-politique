#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de modeles/fonciere-afflux/. Usage (racine de l'atelier) : python3 -I modeles/fonciere-afflux/tests/test_afflux.py
Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Ils vérifient des invariants (conservation des effectifs, du parc,
cas limites), des chiffres publiés repris des sources et la reproduction exacte d'un résultat de modeles/fonciere-usufruit."""
import json, math, os, sys, unittest

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, os.path.join(RACINE, 'code'))
import afflux as A            # noqa: E402
import offre_prix as OP       # noqa: E402
import finances as FI         # noqa: E402
import experimentation as X   # noqa: E402
import importlib.util         # noqa: E402
_s = importlib.util.spec_from_file_location('calc_fonciere', os.path.join(A.MODELES, 'fonciere-usufruit', 'code', 'calculer.py'))
CF = importlib.util.module_from_spec(_s)
_s.loader.exec_module(CF)

T = CF.charger_table()
Q = T['ensemble']
S = CF.charger_secteurs()
HER = A.O.charger_heritages()
P = A.charger_parametres()
H = A.hypotheses(P)
OFF = OP.charger_offre()
_CACHE = {}


def ag(**kw):
    cle = tuple(sorted(kw.items()))
    if cle not in _CACHE:
        _CACHE[cle] = A.agreger(A.reglage(**kw), H, HER, S, Q)
    return _CACHE[cle]


class TestPopulation(unittest.TestCase):
    def test_conservation_des_effectifs(self):
        """Les cellules couvrent exactement ceux qui ont un emploi stable avant 36 ans, et chacun a une issue."""
        cel = A.cellules(A.reglage(), H, HER, S, Q)
        _, jamais = A.ages_emploi_stable(H)
        self.assertAlmostEqual(sum(c['w'] for c in cel), 1 - jamais, places=9)
        r = ag()
        self.assertAlmostEqual(r['A']['F'] + r['A']['banque'] + r['A']['loue'], 1 - jamais, places=9)
        self.assertAlmostEqual(r['A']['F'], r['A']['F_banque'] + r['A']['F_nb'] + r['A']['F_appel'], places=9)

    def test_conservation_sous_quota(self):
        """Avec un plafond d'entrées, les écartés retombent à la banque ou en location : rien ne se perd."""
        r = ag(quota=0.05)
        _, jamais = A.ages_emploi_stable(H)
        self.assertAlmostEqual(r['A']['F'] + r['A']['banque'] + r['A']['loue'], 1 - jamais, places=9)
        self.assertLessEqual(r['part_F'], 0.05 + 1e-9)

    def test_priorite_aux_moins_dotes(self):
        """Sous le même plafond, servir par héritage croissant donne plus d'accès à la moitié qui hérite le moins."""
        self.assertGreater(ag(quota=0.06)['F_D15'], ag(quota=0.06, priorite='prorata')['F_D15'])

    def test_forfait_plus_haut_moins_d_entrants(self):
        self.assertGreater(ag(f=0.70)['jeunes_F'], ag(f=0.85)['jeunes_F'])
        self.assertGreater(ag(f=0.85)['jeunes_F'], ag(f=0.90)['jeunes_F'])

    def test_contrefactuel_independant_du_reglage(self):
        """La propriété « sans dispositif » ne dépend pas du forfait (c'est la banque seule)."""
        self.assertAlmostEqual(ag(f=0.70)['proprio_sans'], ag(f=0.90)['proprio_sans'], places=12)

    def test_cas_limite_forfait_inabordable(self):
        """Un forfait absurde (usufruit à 1 000 % du prix) : personne n'entre, la propriété retombe au contrefactuel."""
        r = A.agreger(A.reglage(f=10.0), H, HER, S, Q)
        self.assertAlmostEqual(r['part_F'], 0.0, places=12)
        self.assertAlmostEqual(r['proprio'], r['proprio_sans'], places=12)

    def test_revenus_medians(self):
        """La médiane de la loi des revenus est celle qui est posée (1 800 €) : déciles 5 et 6 l'encadrent."""
        d = A.revenus_deciles(H)
        self.assertLess(d[4], H['revenu_median'])
        self.assertGreater(d[5], H['revenu_median'])
        self.assertTrue(all(d[k] <= d[k + 1] for k in range(9)))

    def test_capital_de_depart_du_chapitre_3(self):
        """Le capital vaut 40 000 € sans héritage et 40 000 × e^(−1) pour 80 000 € d'héritage."""
        self.assertAlmostEqual(A.O.capital(A.reglage(), 0.0), 40000.0)
        self.assertAlmostEqual(A.O.capital(A.reglage(), 80000.0), 40000.0 / math.e, places=6)


class TestOffreEtPrix(unittest.TestCase):
    def test_parc_sdes(self):
        """Le croisement extrait du fichier SDES somme bien à 8,30 millions (publié : 8 301 000) et le stock réparti par
        secteur conserve ce total et le nombre de passoires F-G (1 147 000)."""
        tot = sum(sum(v.values()) for v in OFF['parc'].values())
        self.assertAlmostEqual(tot / 1e6, 8.301, delta=0.001)
        N = OP.stock(OFF, H)
        self.assertAlmostEqual(sum(sum(sum(v.values()) for v in N[s].values()) for s in N), H['parc_locatif_prive'], delta=1.0)
        fg = sum(N[s][g][c] for s in N for g in N[s] for c in 'FG')
        self.assertAlmostEqual(fg / 1e6, 1.147, delta=0.002)

    def test_ventes_bornees(self):
        """Les ventes provoquées par le plafond ne dépassent jamais les relocations de l'année."""
        V = OP.ventes_bailleurs(OFF, H, horizon=3)
        for t in range(3):
            reloc = H['parc_locatif_prive'] * H['rotation'] * (1 - H['rotation']) ** t
            self.assertLessEqual(sum(sum(V[t]['plafond'][s].values()) for s in OP.SECT), reloc)
        self.assertEqual(OP.proba_vente(H, 10.0), 1.0)

    def test_effet_prix_cas_limites(self):
        """Sans demande ni offre : aucun effet ; demande = offre segment par segment : aucun effet ; effet linéaire."""
        Qx = OP.transactions(S, H)
        D = OP.demande_fonciere(ag())
        z = OP.effet_prix(OP.zero(), OP.zero(), Qx, H)
        self.assertTrue(all(abs(z[s]['moyenne']) < 1e-15 for s in OP.SECT))
        eq = OP.effet_prix(D, D, Qx, H)
        self.assertTrue(all(abs(eq[s][g]) < 1e-15 for s in OP.SECT for g in OP.SEG))
        D2 = {s: {g: 2 * D[s][g] for g in OP.SEG} for s in OP.SECT}
        e1, e2 = OP.effet_prix(D, OP.zero(), Qx, H), OP.effet_prix(D2, OP.zero(), Qx, H)
        self.assertAlmostEqual(e2['metropoles']['moyenne'], 2 * e1['metropoles']['moyenne'], places=12)

    def test_reponse_prix_coherente(self):
        """La réponse du prix publiée dans parametres.json est celle que l'on recalcule depuis les élasticités."""
        for sc in ('bas', 'central', 'haut'):
            h = A.hypotheses(P, sc)
            for s in OP.SECT:
                self.assertAlmostEqual(h['reponse_prix'][s], P['reponse_prix'][sc][s], places=3)

    def test_regle_neutre(self):
        """Avec le nombre de droits « neutre », l'effet moyen du secteur vaut exactement la bande (2 %)."""
        r = ag()
        Qx = OP.transactions(S, H)
        V = OP.ventes_bailleurs(OFF, H, horizon=1)
        On = OP.offre_nette(V[0])
        D = OP.demande_fonciere(r)
        Dpe = {s: {g: (D[s][g] / r['secteurs'][s]['jeunes_F'] if s in ('metropoles', 'villes_moyennes') else 0.0) for g in OP.SEG} for s in OP.SECT}
        dn = OP.droits_neutres(Dpe, On, Qx, H)
        self.assertEqual(dn['paris'], 0.0)
        for s in ('metropoles', 'villes_moyennes'):
            k = dn[s] / r['secteurs'][s]['jeunes_F']
            Ds = {ss: {g: (D[ss][g] * k if ss == s else 0.0) for g in OP.SEG} for ss in OP.SECT}
            self.assertAlmostEqual(OP.effet_prix(Ds, On, Qx, H)[s]['moyenne'], 0.02, places=9)

    def test_semi_elasticite_taux(self):
        """Recoupement : un point de taux sur 25 ans réduit la capacité d'emprunt d'environ 10 % ; × 0,55 ≈ −5,5 %."""
        self.assertAlmostEqual(OP.semi_elasticite_taux(dict(H, elasticite_credit=1.0)), -0.10, delta=0.01)


class TestFonciere(unittest.TestCase):
    def test_reproduit_fonciere_usufruit(self):
        """Le passage par finances.simuler (avec ou sans chemin d'entrées) reproduit exactement le scénario principal
        de fonciere-usufruit (50 % d'une génération) : dette 458,9 Md€ et besoin 89,05 Md€ à l'an 10 (resultats.json)."""
        with open(os.path.join(A.MODELES, 'fonciere-usufruit', 'donnees', 'resultats.json'), encoding='utf-8') as f:
            ref = json.load(f)['v2']['principal']['0.5']['10']
        p = CF.p_principal('central', 0.50)
        sim = FI.simuler(p, Q)
        self.assertAlmostEqual(sim[9]['dette_md'], ref['dette_md'], places=6)
        self.assertAlmostEqual(sim[9]['besoin_md'], ref['besoin_md'], places=6)
        chemin = [FI.F.entrants(p, t) for t in range(p['horizon'])]
        self.assertAlmostEqual(FI.simuler(p, Q, chemin)[9]['dette_md'], ref['dette_md'], places=6)
        self.assertIs(FI.F.entrants.__module__, 'fonciere')     # la fonction d'origine est restaurée

    def test_ratio_croissant_avec_le_forfait(self):
        """La dichotomie des seuils suppose le ratio croissant avec le forfait et la marge."""
        r = ag()
        p = FI.params_fonciere(r, A.reglage())
        v = [FI.F.ratio_min(FI.simuler(dict(p, forfait=f), Q), a=30) for f in (0.80, 0.85, 0.90, 0.95)]
        self.assertTrue(all(v[k] < v[k + 1] for k in range(3)))
        m = [FI.F.ratio_min(FI.simuler(dict(p, marge=x), Q), a=30) for x in (0.0, 0.01, 0.02)]
        self.assertTrue(all(m[k] < m[k + 1] for k in range(2)))

    def test_cout_de_l_argent(self):
        """À taux du contrat égal, une foncière qui paie l'argent 4,7 % s'endette plus et couvre moins ses coûts."""
        r = ag()
        b1 = FI.bilan(FI.simuler(FI.params_fonciere(r, A.reglage()), Q))
        b2 = FI.bilan(FI.simuler(FI.params_fonciere(r, A.reglage(), i=0.047), Q))
        self.assertGreater(b2['dette30'], b1['dette30'])
        self.assertLess(b2['ratio_min30'], b1['ratio_min30'])

    def test_surpaiement(self):
        """Un surpaiement x coûte (1 − f) à la foncière et f au jeune : la somme est x × valeur des achats."""
        r = ag()
        s = FI.surpaiement(r, A.reglage(), 0.03)
        self.assertAlmostEqual((s['fonciere_md'] + s['jeunes_md']) * 1e9, 0.03 * r['contrats'] * r['prix_contrat'], delta=1.0)


class TestExperimentation(unittest.TestCase):
    EX = dict(P['experimentation']['central'], part_np=0.3)

    def test_effet_detectable(self):
        """Formule standard : 2,8 × σ × √(1/n + 1/m) ; plus de communes, effet détectable plus petit."""
        self.assertAlmostEqual(X.effet_detectable(0.06, 10, 20), 2.8016 * 0.06 * math.sqrt(0.15), places=3)
        self.assertLess(X.effet_detectable(0.06, 100, 200), X.effet_detectable(0.06, 10, 20))

    def test_rachat(self):
        """Variante 2 : la somme du rachat = capital restant dû + (1 − f) × transaction + capital de départ ; à k = 0, le
        jeune rembourse tout ce qui a été avancé et la collectivité retrouve sa mise."""
        c = X.cas_batisseur(self.EX, S['villes_moyennes'], 0.85, 0.0332, 25, 30000.0)
        o = X.sortie(self.EX, c, 0, 0.0332, 25, 30000.0, 0.85, 0.035, 0.025, 0.035, 1360.0)
        self.assertAlmostEqual(o['2']['rachat'], c['L'] + 0.15 * c['X'] + 30000.0, places=6)
        self.assertAlmostEqual(o['2']['collectivite'], 0.0, places=6)
        o5 = X.sortie(self.EX, c, 5, 0.0332, 25, 30000.0, 0.85, 0.035, 0.025, 0.035, 1360.0)
        self.assertLess(o5['2']['rachat'], o['2']['rachat'])

    def test_batisseurs_actifs(self):
        """Une seule promotion de 1 000 : 600 actifs un an après (maintien 60 %), puis −8 % par an."""
        a = X.batisseurs_actifs([1000.0] + [0.0] * 4, 0.6, 0.08, 5)
        self.assertAlmostEqual(a[1], 600.0)
        self.assertAlmostEqual(a[3], 600.0 * 0.92 ** 2)
        pr = X.promotion_necessaire(0.10, 830000, 0.77, 0.4, 1 / 0.35, 0.6, 0.08)
        self.assertAlmostEqual(pr['promotion'] * 0.6 / 0.08, pr['stock'], places=6)

    def test_net_alternant(self):
        """Sous 50 % du Smic, le salaire de l'apprenti n'a pas de cotisations (net = brut)."""
        self.assertAlmostEqual(X.net_alternant(800.0, 1867.02), 800.0)
        self.assertLess(X.net_alternant(1200.0, 1867.02), 1200.0)


if __name__ == '__main__':
    unittest.main(verbosity=1)
