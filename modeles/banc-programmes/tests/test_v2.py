#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de la version 2 du banc : règle unique de faisabilité (faisabilite.py), élargissement commun des coûts, notre système sous la même règle (relancer_v2.py)."""
import os, sys, unittest

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
BANC = os.path.dirname(ICI)
sys.path.insert(0, BANC)
sys.path.insert(0, os.path.join(os.path.dirname(BANC), 'taux-endogene'))
import moteur as M          # noqa: E402
import relancer as R        # noqa: E402
import faisabilite as F     # noqa: E402
import relancer_v2 as V2    # noqa: E402

CTX = R.construire_ctx(False)


class TestGrille(unittest.TestCase):
    def test_ordre_des_lois(self):
        prev = None
        for s in (0, 1, 2, 3):
            b, c, h = F.GRILLE[s]
            self.assertTrue(0 <= b <= c <= h <= 1)
            if prev:
                self.assertTrue(b >= prev[0] and c > prev[1] - 1e-12 and h >= prev[2])
            prev = (b, c, h)

    def test_score_borne(self):
        self.assertEqual(F.score(1, 1, 1), 3)
        self.assertEqual(F.score(0, -1, 0), 0)
        self.assertEqual(F.score(1, -1, 0), 0)
        self.assertEqual(F.score(0, 1, 1), 2)


class TestRegleUnique(unittest.TestCase):
    def test_toutes_les_recettes_sont_classees(self):
        for cle in ('lfi', 'rn', 'lr', 'ps', 'gl', 'lfi_cb'):
            prog, mesures, _ = R.charger_programme(cle)
            F.appliquer_programme(cle, mesures)          # lève une erreur si une recette n'est ni classée ni exemptée

    def test_meme_score_meme_part_dans_tous_les_programmes(self):
        vus = {}
        for cle in ('lfi', 'rn', 'lr', 'ps', 'gl', 'lfi_cb'):
            prog, mesures, _ = R.charger_programme(cle)
            _, jr = F.appliquer_programme(cle, mesures)
            for e in jr:
                if e[1] == 'cout' or e[2] is None:
                    continue
                s, a, nouv = e[1], e[2], e[4]
                if nouv[0] < 0:
                    continue
                part = (nouv[0] / a, nouv[1] / a, nouv[2] / a)
                self.assertAlmostEqual(part[1], F.GRILLE[s][1], places=9)
                self.assertAlmostEqual(part[2], F.GRILLE[s][2], places=9)
                vus.setdefault(s, set()).add(tuple(round(x, 9) for x in part))
        for s, ens in vus.items():
            self.assertEqual(len(ens), 1, 'score %d : parts différentes %s' % (s, ens))

    def test_services_numeriques_meme_traitement_lfi_ps(self):
        self.assertEqual(F.CLASSEMENT['lfi']['R08'][:3], F.CLASSEMENT['ps']['PS03'][:3])
        self.assertEqual(F.CLASSEMENT['lfi']['R04'][:3], F.CLASSEMENT['ps']['PS01'][:3])
        self.assertEqual(F.CLASSEMENT['rn']['A01'][:3], F.CLASSEMENT['lr']['LR03'][:3])
        self.assertEqual(F.CLASSEMENT['lr']['LR01'][:3], F.CLASSEMENT['langagement']['M-M1'][:3])

    def test_la_part_ne_depasse_jamais_le_montant(self):
        for cle in ('lfi', 'rn', 'lr', 'ps', 'gl', 'lfi_cb'):
            prog, mesures, _ = R.charger_programme(cle)
            _, jr = F.appliquer_programme(cle, mesures)
            for e in jr:
                if e[1] != 'cout' and e[2] is not None:
                    self.assertLessEqual(e[4][2], e[2] + 1e-9)

    def test_recette_de_modele_recoit_la_part_realisable(self):
        prog, mesures, _ = R.charger_programme('lfi')
        ms, _ = F.appliquer_programme('lfi', mesures)
        d = {m['id']: m for m in ms}
        for i in ('R01a', 'R04', 'R05', 'R13'):
            self.assertIn('part_realisable', d[i])
        # part médiane appliquée : 100 % pour l'ISF (score 3), 35 % pour l'impôt plancher (score 1)
        t = {'z': {}, 'zi': {}}
        r1, _ = V2.evaluer_v2(d['R04'], t, CTX)
        r0, _ = M.evaluer_mesure(d['R04'], t, CTX)
        self.assertAlmostEqual(r1, 0.35 * r0, places=9)
        r1, _ = V2.evaluer_v2(d['R01a'], t, CTX)
        r0, _ = M.evaluer_mesure(d['R01a'], t, CTX)
        self.assertAlmostEqual(r1, r0, places=9)


class TestCouts(unittest.TestCase):
    def test_plancher_commun_des_couts(self):
        for cle in ('lfi', 'rn', 'lr', 'ps', 'gl', 'lfi_cb'):
            prog, mesures, _ = R.charger_programme(cle)
            ms, jr = F.appliquer_programme(cle, mesures)
            for m in ms:
                if m['sens'] == 'depense' and m['levier'] == 'cout_unitaire' and m['valeur'].get('forme') == 'tri':
                    ref = m.get('annonce') if m.get('annonce') is not None else m.get('an1')
                    v = m['valeur']
                    if ref and abs(v['central'] - ref) < 1e-9:
                        self.assertLessEqual(v['bas'], F.COUT_BAS * ref + 1e-9, (cle, m['id']))
                        self.assertGreaterEqual(v['haut'], F.COUT_HAUT * ref - 1e-9, (cle, m['id']))


class TestSysteme(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.prog, cls.mods, cls.jr = V2.preparer_systeme(CTX)
        cls.annees, cls.eff_c, cls.Fv = V2.central_systeme(CTX)

    def test_somme_des_lignes_egale_au_central_sans_echelle(self):
        inc, _ = V2.ponts.pont_incertitudes(False)
        ser = V2.ponts._lire('incertitudes_serie.json')
        prog, mesures, _ = R.charger_programme('langagement')
        ramp = V2.ponts.pont_modules_moins_severes(False)[0]['base']['ramp']
        mods, _ = F.modules_v2(mesures, ser['c_serie'], {'M-M2': ser['fixe']['M-M2']}, ramp, self.eff_c, self.Fv, self.annees, echelles={})
        for i in range(len(self.annees)):
            self.assertAlmostEqual(sum(m['c'][i] + (m['ajust'][i] if 'ajust' in m else 0.0) for m in mods), self.eff_c[i], places=6)

    def test_tirage_median_applique_la_part_mediane(self):
        t = {'z': {}, 'zi': {}}
        delta, rec, par, parts = V2.effet_modules_v2(self.mods, t, self.annees)
        for m in self.mods:
            if m['kind'] == 'filtre':
                self.assertAlmostEqual(parts[m['id']], F.GRILLE[m['score_faisabilite']][1], places=9)
        # M-PAT classé 3 (patrimoine à 1,25 %, 11/11/2026) : part médiane de la grille de 20,889 Md€ en 2038 (avant : classé 1, 35 % de 62,5212)
        self.assertAlmostEqual(par['M-PAT'], F.GRILLE[3][1] * 20.8891, delta=0.01)

    def test_le_filtre_ne_peut_que_baisser_le_central(self):
        t = {'z': {}, 'zi': {}}
        delta, rec, par, parts = V2.effet_modules_v2(self.mods, t, self.annees)
        i38 = self.annees.index(2038)
        self.assertLess(delta[i38], 0)

    def test_parts_degenerees_a_un_redonnent_la_version_1(self):
        mods = [dict(m) for m in self.mods]
        for m in mods:
            if m['kind'] == 'filtre':
                m['part'] = {'forme': 'fixe', 'bas': 1.0, 'central': 1.0, 'haut': 1.0}
            if 'ajust' in m:
                m['ajust'] = [0.0] * len(m['ajust'])
            if m['kind'] == 'cout':
                m['kind'] = 'neutre'
        t = {'z': {}, 'zi': {}}
        delta, rec, par, parts = V2.effet_modules_v2(mods, t, self.annees)
        self.assertTrue(all(abs(x) < 1e-9 for x in delta))

    def test_meme_graine_memes_resultats(self):
        r1, _ = V2.simuler_systeme_v2(self.prog, self.mods, CTX, 200, R.GRAINE)
        r2, _ = V2.simuler_systeme_v2(self.prog, self.mods, CTX, 200, R.GRAINE)
        self.assertEqual(r1['solde'], r2['solde'])


if __name__ == '__main__':
    unittest.main()


class TestDocumentsPrimaires1111(unittest.TestCase):
    """Relecture du 11/11/2026 : RN (dossier p. 11), Glucksmann (livret climat), LFI (contre-budget 2027)."""

    def test_rn_totaux_du_dossier(self):
        """Les lignes du banc reproduisent le tableau du dossier : 137,218 Md€ d'économies et recettes (hors les 0,9 de rapatriés fiscaux, ponctuels), 69,208 Md€ de baisses et dépenses, 3,616 Md€ de mesures du gouvernement retenues."""
        _, ms, _ = R.charger_programme('rn')
        rec = sum(m['an1_rn'] for m in ms if m['sens'] == 'recette' and m['id'] != 'R30')
        dep = sum(m['an1_rn'] for m in ms if m['sens'] == 'depense')
        self.assertAlmostEqual(rec, 137.218 - 0.9, delta=0.05)
        self.assertAlmostEqual(dep, 69.208, delta=0.01)
        r30 = [m for m in ms if m['id'] == 'R30'][0]
        self.assertAlmostEqual(r30['an1_rn'], 3.616, delta=0.02)
        self.assertAlmostEqual(rec + r30['an1_rn'] - dep, 71.626 - 0.9, delta=0.1)      # solde net du dossier : 71,626 Md€, moins la ligne ponctuelle exclue

    def test_rn_lignes_corrigees(self):
        _, ms, _ = R.charger_programme('rn')
        d = {m['id']: m for m in ms}
        self.assertAlmostEqual(d['H06']['an1_rn'], 7.127, places=3)
        self.assertAlmostEqual(d['F04']['an1_rn'], 0.95, places=3)
        self.assertAlmostEqual(d['F07']['an1_rn'], 2.15, places=3)
        self.assertAlmostEqual(d['G03']['an1_rn'], 12.45, places=3)
        self.assertAlmostEqual(d['T04']['an1_rn'], 6.558, places=3)
        for m in ms:
            if m['lien'].endswith('grn-contre-budget-2027-dossier.pdf'):
                self.assertIn('p. 11', m['citation'], m['id'])                 # chaque ligne cite sa page
        for m in ms:
            if m['sens'] == 'recette' and m['levier'] == 'cout_unitaire' and m['valeur'].get('haut') is not None and m['id'] not in ('G03', 'G04'):
                self.assertLessEqual(m['valeur']['haut'], m['annonce'] + 1e-9, m['id'])

    def test_glucksmann_deux_montants_seulement(self):
        prog, ms, mod = R.charger_programme('gl')
        d = {m['id']: m for m in ms}
        self.assertEqual(set(d), {'GL01', 'GL02'})
        self.assertAlmostEqual(d['GL01']['annonce'] * 5, 200.0)                   # 200 Md€ sur le quinquennat
        self.assertEqual(d['GL01']['fin'], 2032)
        self.assertAlmostEqual(d['GL02']['annonce'], 50.0)                         # une seule année
        self.assertEqual(d['GL02']['fin'], 2028)
        self.assertEqual(d['GL02']['montee'], [1.0, 0.0, 0.0, 0.0, 0.0])
        self.assertTrue(len(mod.NON_CHIFFREES) >= 8)                               # les lignes non chiffrées sont listées
        self.assertIn('PARTIEL', mod.__doc__)
        ms2, jr = F.appliquer_programme('gl', ms)
        self.assertEqual(F.score(*F.CLASSEMENT['gl']['GL02'][:3]), 0)
        loi = [m for m in ms2 if m['id'] == 'GL02'][0]['valeur']
        self.assertAlmostEqual(loi['central'], 5.0)                                # 10 % de 50 Md€ (score 0)
        self.assertAlmostEqual(loi['haut'], 25.0)

    def test_glucksmann_effet_nul_apres_le_quinquennat(self):
        prog, ms, _ = R.charger_programme('gl')
        ms, _ = F.appliquer_programme('gl', R.preparer(ms, CTX))
        res, par = V2.simuler_generique(prog, R.preparer(ms, CTX), CTX, 200, R.GRAINE)
        med = lambda xs: sorted(xs)[len(xs) // 2]
        self.assertAlmostEqual(med([x[ANN.index(2038)] for x in res['serie_eff']]), 0.0, places=9)     # rien de chiffré après 2032
        self.assertLess(med([x[ANN.index(2032)] for x in res['serie_eff']]), -35.0)                    # 40 Md€ de dépense nouvelle (fourchette 0,9-1,3)
        self.assertLess(med([x[ANN.index(2029)] for x in res['serie_eff']]), -35.0)                    # la contribution unique n'est plus là en 2029
        self.assertGreater(med([x[ANN.index(2028)] for x in res['serie_eff']]), med([x[ANN.index(2029)] for x in res['serie_eff']]))

    def test_lfi_contre_budget_totaux_du_document(self):
        prog, ms, mod = R.charger_programme('lfi_cb')
        dep = sum(m['annonce'] for m in ms if m['sens'] == 'depense')
        self.assertAlmostEqual(dep, 81.7, places=6)                                # dépenses d'urgence du document
        self.assertAlmostEqual(sum(m['annonce'] for m in ms if m['sens'] == 'depense' and m['id'] in ('B01', 'B02', 'B03', 'B04')), 37.5, places=6)   # relance par les revenus
        _, lfi, _ = R.charger_programme('lfi')
        an1 = {m['id']: m['an1'] for m in lfi if m['sens'] == 'recette'}
        rec = sum(an1[m['id']] for m in ms if m['sens'] == 'recette')
        self.assertAlmostEqual(rec, 106.4, places=6)                               # recettes supplémentaires du document (mêmes lignes que la colonne principale)
        self.assertNotIn('R13', {m['id'] for m in ms})
        self.assertEqual(set(F.CLASSEMENT['lfi_cb']), {m['id'] for m in ms if m['sens'] == 'recette'})
        for i, v in F.CLASSEMENT['lfi_cb'].items():
            self.assertEqual(v, F.CLASSEMENT['lfi'][i])                            # mêmes réponses M, J, E que la colonne principale

    def test_colonne_principale_lfi_inchangee(self):
        import json
        with open(os.path.join(BANC, 'donnees', 'resultats-v2.json'), encoding='utf-8') as fh:
            d = json.load(fh)
        for cle in ('lfi', 'lfi_cb', 'gl', 'rn', 'langagement'):
            self.assertIn(cle, d['programmes'])
        # la sensibilité du contre-budget est bien moins lourde que le programme complet
        self.assertGreater(d['programmes']['lfi_cb']['solde_regime']['p50'], d['programmes']['lfi']['solde_regime']['p50'] + 100)
        self.assertLess(d['programmes']['lfi']['dette2038']['p50'], 2.5)  # valeur de la colonne principale v2 du 11/11/2026 (241 %) : inchangée
        self.assertAlmostEqual(d['programmes']['lfi']['dette2038']['p50'], 2.41, delta=0.02)


ANN = V2.ANNEES_SERIE
