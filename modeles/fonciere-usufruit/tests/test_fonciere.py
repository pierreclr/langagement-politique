#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de modeles/fonciere-usufruit/. Usage : python3 -I modeles/fonciere-usufruit/tests/test_fonciere.py"""
import csv, os, sys, unittest

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, os.path.join(RACINE, 'code'))
import usufruit as U   # noqa: E402
import fonciere as F   # noqa: E402

with open(os.path.join(RACINE, 'donnees', 'table_mortalite_insee.csv'), encoding='utf-8') as f:
    T = U.lire_table(list(csv.DictReader([l for l in f if not l.startswith('"#')])))
Q = T['ensemble']


class TestContrat(unittest.TestCase):
    def test_table_insee(self):
        """Espérance de vie à 25 ans recalculée depuis les quotients ≈ celle publiée par l'Insee (58,57 ans)."""
        self.assertAlmostEqual(U.esperance(U.survies(Q, 25, 2024, 0.0)), 58.57, delta=0.15)
        self.assertAlmostEqual(U.esperance(U.survies(T['femmes'], 0, 2024, 0.0)), 85.75, delta=0.2)

    def test_exemple_de_l_esquisse(self):
        """§ 4 de l'esquisse : 164 000 € sur 25 ans à 4 % = 866 €/mois ; 124 000 € = 655 € ; 200 000 € = 1 056 €."""
        self.assertAlmostEqual(U.mensualite(164000, 0.04, 25), 866, delta=1)
        self.assertAlmostEqual(U.mensualite(124000, 0.04, 25), 655, delta=1)
        self.assertAlmostEqual(U.mensualite(200000, 0.04, 25), 1056, delta=1)
        self.assertAlmostEqual(U.valeur_usufruit_deterministe(58, 0.03), 0.82, delta=0.005)

    def test_bareme_669(self):
        self.assertEqual(U.bareme_fiscal(20), 0.9)
        self.assertEqual(U.bareme_fiscal(25), 0.8)
        self.assertEqual(U.bareme_fiscal(30), 0.8)
        self.assertEqual(U.bareme_fiscal(31), 0.7)
        self.assertEqual(U.bareme_fiscal(95), 0.1)

    def test_usufruit_monotone(self):
        """L'usufruit baisse avec l'âge, monte avec le taux, tend vers 0 à taux nul."""
        for r in (0.01, 0.03):
            v = [U.valeur_usufruit(U.survies(Q, a, 2027, 0.01), r) for a in range(20, 100, 5)]
            self.assertTrue(all(x > y for x, y in zip(v, v[1:])))
        s = U.survies(Q, 40, 2027, 0.01)
        self.assertLess(U.valeur_usufruit(s, 0.01), U.valeur_usufruit(s, 0.03))
        self.assertAlmostEqual(U.valeur_usufruit(s, 0.0), 0.0, places=9)

    def test_couple_reversible(self):
        """Un droit réversible vaut plus qu'un droit sur une seule tête."""
        s1 = U.survies(T['hommes'], 32, 2027, 0.01)
        sc = U.survies_couple(T['femmes'], 32, T['hommes'], 32, 2027, 0.01)
        self.assertGreater(U.esperance(sc), U.esperance(s1))
        self.assertGreater(U.valeur_usufruit(sc, 0.02), U.valeur_usufruit(s1, 0.02))

    def test_amortissement(self):
        self.assertAlmostEqual(U.capital_restant(100000, 0.035, 25, 0), 100000, places=6)
        self.assertAlmostEqual(U.capital_restant(100000, 0.035, 25, 300), 0.0, places=6)
        self.assertAlmostEqual(U.capital_empruntable(U.mensualite(90000, 0.035, 25), 0.035, 25), 90000, places=4)

    def test_echeancier(self):
        plat = [0.035] * 40
        fixe = U.echeancier(100000, plat, 25, 'fixe')
        self.assertAlmostEqual(fixe['duree'], 25.0, places=6)
        self.assertAlmostEqual(fixe['total'], U.mensualite(100000, 0.035, 25) * 300, delta=1)
        # sans choc, les quatre modes coïncident
        for mode in ('variable', 'allongement'):
            r = U.echeancier(100000, plat, 25, mode)
            self.assertAlmostEqual(r['total'], fixe['total'], delta=5)
        choc = [0.035] * 5 + [0.055] * 40
        var = U.echeancier(100000, choc, 25, 'variable')
        cap = U.echeancier(100000, choc, 25, 'variable', 0.01)
        allo = U.echeancier(100000, choc, 25, 'allongement', None, 35)
        self.assertGreater(var['mensualite_max'], cap['mensualite_max'])
        self.assertAlmostEqual(allo['mensualite_max'], fixe['mensualite_max'], places=6)
        self.assertGreater(allo['duree'], 25)
        self.assertLessEqual(allo['duree'], 35 + 1e-9)

    def test_taux_equilibre(self):
        self.assertAlmostEqual(U.taux_equilibre(0.035, 0.025), 1.035 / 1.025 - 1, places=12)


class TestFonciere(unittest.TestCase):
    def test_echelle_lineaire(self):
        """Sans viager ni dation ni dotation, doubler la part cible double les flux."""
        kw = dict(viagers_par_an=0.0, dation_md=0.0, dotation0=0.0, horizon=30)
        a = F.simuler(F.params('central', part_cible=0.1, **kw), Q)
        b = F.simuler(F.params('central', part_cible=0.2, **kw), Q)
        for k in (5, 15, 29):
            self.assertAlmostEqual(b[k]['dette_md'], 2 * a[k]['dette_md'], delta=1e-6 * abs(b[k]['dette_md']) + 1e-9)

    def test_equilibre_sans_marge(self):
        """Tarif = taux d'équilibre exact, sans impayés, gestion, viager, dation, rénovation ni prudence : le patrimoine net
        reste petit devant la dette (la tarification est neutre en moyenne)."""
        p = F.params('central', prudence=0.0, perte=0.0, gestion=0.0, viagers_par_an=0.0, dation_md=0.0, part_passoires=0.0,
                     frais_acq=0.0, dotation0=0.0, amel_reel=0.01, horizon=40)
        res = F.simuler(p, Q)
        self.assertLess(abs(res[-1]['net_md']), 0.05 * res[-1]['dette_md'])

    def test_risques_dans_le_bon_sens(self):
        base = F.simuler(F.params('central', horizon=40), Q)[-1]['net_md']
        self.assertLess(F.simuler(F.params('central', horizon=40, choc_taux=0.02), Q)[-1]['net_md'], base)
        self.assertLess(F.simuler(F.params('central', horizon=40, g=0.015), Q)[-1]['net_md'], base)
        self.assertLess(F.simuler(F.params('central', horizon=40, amel_reel=0.02), Q)[-1]['net_md'], base)

    def test_fonds_propres_deplace_la_dette(self):
        """En fonds propres, la dette de la foncière baisse et celle de l'État monte ; le total « dans APU » bouge peu."""
        a = F.simuler(F.params('central', horizon=30), Q)[-1]
        b = F.simuler(F.params('central', horizon=30, fonds_propres_np=True), Q)[-1]
        self.assertLess(b['dette_md'], a['dette_md'])
        self.assertGreater(b['etat_md'], a['etat_md'])
        self.assertAlmostEqual(b['dette_publique_dans_apu_pib'], a['dette_publique_dans_apu_pib'], delta=0.02)

    def test_reemploi(self):
        """Les logements rendus au décès sont réemployés : les achats sont inférieurs aux entrées après quelques décennies."""
        r = F.simuler(F.params('central', horizon=60), Q)
        self.assertLess(r[59]['achats'], r[59]['entrants'])
        self.assertGreater(r[59]['reemplois'], 0)


class TestV2(unittest.TestCase):
    """v2 (09/11/2026, soir) : marge, contribution, forfait, mensualité bancaire, prêt familial, livret, cercles, secteurs."""

    def test_reglages_par_defaut_reproduisent_la_v1(self):
        """Avec les réglages par défaut, la v2 redonne les chiffres publiés de la v1 (dette an 30 : 508 Md€ ; ratio : 28 %)."""
        r = F.simuler(F.params('central'), Q)
        self.assertAlmostEqual(r[29]['dette_md'], 508.1, delta=0.5)
        self.assertAlmostEqual(r[59]['dette_md'], 1025, delta=1)
        self.assertAlmostEqual(r[29]['ratio_marchand'], 0.275, delta=0.002)

    def test_contribution(self):
        self.assertAlmostEqual(U.contribution_rp(150000), 375.0)
        self.assertAlmostEqual(U.contribution_rp(2e6), 2500.0)

    def test_inverses(self):
        """§ 23 : 400 € par mois sur 50 000 € et 25 ans demandent environ 8,4 %."""
        self.assertAlmostEqual(U.taux_pour_mensualite(50000, 400, 25), 0.0842, delta=0.0005)
        for t in (0.0, 0.02, 0.05):
            m = U.mensualite(80000, t, 20)
            self.assertAlmostEqual(U.taux_pour_mensualite(80000, m, 20), t, delta=1e-6)
            self.assertAlmostEqual(U.duree_pour_mensualite(80000, t, m), 20, delta=1e-6)
        self.assertIsNone(U.duree_pour_mensualite(100000, 0.05, 300))   # ne couvre pas les intérêts

    def test_reperes_du_forfait(self):
        """Repères de l'auteur (09/11) : 150 000 € à 3,2 % sur 25 ans : 727 € ; usufruit à 70 % : 509 € ; avec 40 000 € : 315 €."""
        self.assertAlmostEqual(U.mensualite(150000, 0.032, 25), 727, delta=1)
        self.assertAlmostEqual(U.mensualite(105000, 0.032, 25), 509, delta=1)
        self.assertAlmostEqual(U.mensualite(65000, 0.032, 25), 315, delta=1)

    def test_marge_ameliore_le_ratio(self):
        v = [F.ratio_min(F.simuler(F.params('central', marge=m, horizon=40), Q)) for m in (0.0, 0.01, 0.02, 0.04)]
        self.assertTrue(all(a < b for a, b in zip(v, v[1:])))

    def test_marge_seuil(self):
        p = F.params('central', horizon=40)
        m = F.marge_seuil(p, Q)
        self.assertIsNotNone(m)
        self.assertGreater(F.ratio_min(F.simuler(dict(p, marge=m), Q)), 0.5)
        self.assertLessEqual(F.ratio_min(F.simuler(dict(p, marge=m - 0.002), Q)), 0.5)

    def test_contribution_affectee(self):
        """Affectée à la foncière, la contribution baisse sa dette et creuse d'autant le budget public ; au budget, elle ne change rien."""
        a = F.simuler(F.params('central', horizon=30), Q)[-1]
        b = F.simuler(F.params('central', horizon=30, contribution_affectee=True), Q)[-1]
        c = F.simuler(F.params('central', horizon=30, contribution=0.0), Q)[-1]
        self.assertLess(b['dette_md'], a['dette_md'])
        self.assertGreater(b['etat_md'], a['etat_md'])
        self.assertAlmostEqual(a['dette_md'], c['dette_md'], places=6)
        self.assertGreater(b['ratio_large'], b['ratio_marchand'])

    def test_pret_familial(self):
        s = U.survies_couple(T['femmes'], 55, T['hommes'], 55, 2027, 0.01)
        self.assertAlmostEqual(U.pret_familial(60000, s, 0.035, 0.035)['gain_foncière'], 0.0, places=6)
        g = U.pret_familial(60000, s, 0.02, 0.035)
        self.assertGreater(g['gain_foncière'], 0)
        self.assertGreater(g['duree_moyenne'], 30)
        a = F.simuler(F.params('central', horizon=30), Q, s)[-1]
        b = F.simuler(F.params('central', horizon=30, part_pret_familial=0.25), Q, s)[-1]
        self.assertGreater(b['pret_familial_md'], 0)
        self.assertLess(b['dette_marche_md'], a['dette_marche_md'])
        self.assertLess(b['dette_md'], a['dette_md'])          # l'argent familial coûte l'inflation, moins que le marché

    def test_livret(self):
        a = F.simuler(F.params('central', horizon=30), Q)[-1]
        b = F.simuler(F.params('central', horizon=30, livret_max_md=100.0), Q)[-1]
        self.assertLess(b['dette_md'], a['dette_md'])

    def test_cercles(self):
        p = F.params('central', montee='cercles')
        self.assertEqual([F.entrants(p, t) for t in range(3)], [3000.0] * 3)
        self.assertAlmostEqual(F.entrants(p, 9), 96000.0)
        self.assertTrue(all(F.entrants(p, t) <= F.entrants(p, t + 1) for t in range(12)))

    def test_forfait_et_banque(self):
        """Forfait : l'usufruit vendu vaut 70 % des transactions ; mensualité bancaire : marge implicite, ratio bien plus haut."""
        p = F.params('central', redevance='forfait', horizon=12, part_passoires=0.0, viagers_par_an=0.0, dation_md=0.0)
        r = F.simuler(p, Q)[5]
        prix = p['prix0'] * (1 + p['g']) ** 6
        self.assertAlmostEqual(r['usufruit_vendu_md'] * 1e9 * (1 + p['pi']) ** 6, 0.70 * prix * r['entrants'], delta=1e3)
        base = F.ratio_min(F.simuler(F.params('central', horizon=40), Q))
        banque = F.ratio_min(F.simuler(F.params('central', redevance='banque', horizon=40), Q))
        self.assertGreater(banque, 0.5)
        self.assertGreater(banque, base)

    def test_secteurs(self):
        import preparer_secteurs as P
        self.assertEqual(P.secteur_de('75056', '5'), 'paris')
        self.assertEqual(P.secteur_de('92012', '5'), 'metropoles')
        self.assertEqual(P.secteur_de('49007', '3'), 'villes_moyennes')
        self.assertEqual(P.secteur_de('01002', '0'), 'rural')
        self.assertEqual(P.commune_mere('75112'), '75056')
        self.assertEqual(P.commune_mere('69385'), '69123')
        self.assertEqual(P.commune_mere('13216'), '13055')
        self.assertEqual(P.commune_mere('13217'), '13217')
        self.assertEqual(P.mediane([3, 1, 2]), 2)
        self.assertEqual(P.mediane_ponderee([(1, 1), (2, 1), (10, 5)]), 10)


if __name__ == '__main__':
    unittest.main(verbosity=1)
