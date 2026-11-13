#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests des pages de détail (detail.py). Lancer : python3 -I modeles/banc-programmes/tests/test_detail.py   (ou -m unittest)."""
import os
import re
import sys
import unittest

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ICI)
import detail as DT     # noqa: E402

D = DT.charger()
PAGES = DT.generer(D)
RES_MD = open(os.path.join(ICI, 'resultats.md'), encoding='utf-8').read()
RES_V2_MD = open(os.path.join(ICI, 'resultats-v2.md'), encoding='utf-8').read()


def ligne_tableau(section, debut, texte=None):
    return DT.tableau_md(RES_MD if texte is None else texte, section, debut)


class TestTotaux(unittest.TestCase):
    def test_totaux_egaux_au_tableau_comparatif_v2(self):
        """Le total de chaque page de détail est celui du tableau comparatif de la version 2 (§ 1 de resultats-v2.md)."""
        entete = ligne_tableau('## 1. Tableau comparatif v2', '', RES_V2_MD)
        cells = ligne_tableau('## 1. Tableau comparatif v2', 'Effet sur le solde, en régime', RES_V2_MD)
        col = {'LR (Retailleau)': 'lr', 'PS et Place publique': 'ps', 'Glucksmann, livret climat (chiffrage partiel)': 'gl', 'RN': 'rn', 'LFI (programme complet)': 'lfi',
               'LFI, contre-budget 2027 (sensibilité)': 'lfi_cb', 'Notre système': 'langagement', "Fil de l'eau": 'fil_de_l_eau'}
        vus = set()
        for nom, val in zip(entete[1:], cells[1:]):
            cle = col[nom]
            vus.add(cle)
            if cle not in DT.PAGES:
                continue
            self.assertEqual(DT.totaux(cle, D), val, cle)
            self.assertIn('**%s**' % val, PAGES[DT.FICHIERS[cle]], cle)
        self.assertTrue(set(DT.PAGES) <= vus)

    def test_pages_annoncent_la_regle_v2(self):
        for cle in DT.PAGES:
            texte = PAGES[DT.FICHIERS[cle]]
            self.assertIn('**Règle de chiffrage : version 2**', texte, cle)
            self.assertNotIn('`modeles/banc-programmes/resultats.md`. Pages voisines', texte, cle)


class TestCoherenceV2(unittest.TestCase):
    """Les lignes d'une page et son total viennent des mêmes 10 000 tirages de la règle v2.

    Identité exacte : dans chaque tirage, le total est la somme des lignes (relancer_v2.moments_lignes enregistre le reste, total moins somme des lignes, tirage par tirage).
    Donc la moyenne du total est la somme des moyennes des lignes, à l'arrondi flottant près (tolérance 1e-6 Md€).
    La médiane, elle, ne s'additionne pas. Tolérance justifiée pour l'écart « somme des médianes − médiane du total » : pour toute loi, |moyenne − médiane| ≤ écart-type ;
    comme somme des moyennes = moyenne du total, |Σ médianes − médiane du total| ≤ Σ écarts-types des lignes + écart-type du total. Cette borne ne dépend d'aucune hypothèse de forme ;
    on vérifie de plus que la médiane du total est à moins d'un écart-type du total de sa moyenne, et on affiche les écarts restants."""

    def test_reste_nul_tirage_par_tirage(self):
        for cle in DT.PAGES:
            rh = DT.RV(cle, D)['reste_hors_lignes']
            self.assertLess(max(abs(rh['min']), abs(rh['max'])), 1e-9, cle)

    def test_moyenne_du_total_egale_somme_des_moyennes(self):
        for cle in DT.PAGES:
            r = DT.RV(cle, D)
            sm = sum(v['moyenne'] for v in r['moments_par_mesure'].values()) + r['reste_hors_lignes']['moyenne']
            self.assertAlmostEqual(r['moments_solde']['moyenne'], sm, delta=1e-6, msg=cle)

    def test_ecart_somme_des_medianes_borne(self):
        for cle in DT.PAGES:
            r = DT.RV(cle, D)
            pm, mo = r['par_mesure'], r['moments_par_mesure']
            ecart = sum(v['p50'] for v in pm.values()) - r['solde_regime']['p50']
            borne = sum(v['ecart_type'] for v in mo.values()) + r['moments_solde']['ecart_type']
            self.assertLessEqual(abs(ecart), borne, cle)
            self.assertLessEqual(abs(r['solde_regime']['p50'] - r['moments_solde']['moyenne']), r['moments_solde']['ecart_type'], cle)

    def test_toutes_les_lignes_du_tirage_sont_sur_la_page(self):
        """Chaque ligne tirée en v2 a sa médiane sur la page : poste détaillé (ancre) ou, pour notre système, ligne hors modules du tableau du total."""
        for cle in DT.PAGES:
            texte = PAGES[DT.FICHIERS[cle]]
            ids = {m['id'] for m in D['progs'][cle][1]}
            for i, v in DT.RV(cle, D)['par_mesure'].items():
                if i in ids:
                    continue
                self.assertEqual(cle, 'langagement', (cle, i))
                self.assertIn('(%s) | %s |' % (i, DT.iv(v, 1)), texte, i)


class TestPostes(unittest.TestCase):
    def test_chaque_mesure_apparait_une_fois(self):
        for cle in DT.PAGES:
            texte = PAGES[DT.FICHIERS[cle]]
            ids = [m['id'] for m in D['progs'][cle][1]]
            self.assertEqual(set(ids), set(DT.AFFECTATION[cle]), cle)   # toutes les mesures, et seulement elles, ont une famille
            for i in ids:
                self.assertEqual(texte.count('{#%s}' % DT.ancre(i)), 1, (cle, i))
                self.assertEqual(len(re.findall(r'^\| \[%s\]\(#' % re.escape(i), texte, re.M)), 1, (cle, i))
            self.assertEqual(len(re.findall(r'^#### ', texte, re.M)), len(ids), cle)

    def test_familles_connues_et_notes(self):
        connues = {f for f, _ in DT.FAMILLES}
        for cle in DT.COLONNES:
            self.assertTrue(set(DT.AFFECTATION[cle].values()) <= connues, cle)
        memes = PAGES[DT.FICHIERS['memes']]
        for f in {f for c in DT.COLONNES for f in DT.AFFECTATION[c].values()}:
            self.assertIn('{#f-%s}' % f, memes, f)
        self.assertIn('{#asymetries}', memes)

    def test_estimations_reprises_des_resultats(self):
        """Chaque estimation affichée est la médiane [p10 ; p90] de la règle v2 (donnees/resultats-v2.json)."""
        for cle in DT.PAGES:
            texte = PAGES[DT.FICHIERS[cle]]
            for m in D['progs'][cle][1]:
                self.assertIn('**%s** Md€ par an' % DT.iv(DT.RV(cle, D)['par_mesure'][m['id']], 1), texte, (cle, m['id']))


class TestMemesModules(unittest.TestCase):
    """Ce que les pages affirment (« même module, mêmes paramètres ») est vérifié dans le code."""

    def mesure(self, cle, i):
        return [m for m in D['progs'][cle][1] if m['id'] == i][0]

    def test_smic_lfi_et_ps(self):
        s01, ps09 = self.mesure('lfi', 'S01'), self.mesure('ps', 'PS09')
        self.assertEqual(s01['levier'], ps09['levier'])
        self.assertEqual(sorted(k for k in set(s01['parametres']) | set(ps09['parametres']) if s01['parametres'].get(k) != ps09['parametres'].get(k)), ['hausse'])

    def test_retraites_lfi_et_rn(self):
        a, b = self.mesure('lfi', 'D05'), self.mesure('rn', 'D01')
        self.assertEqual((a['levier'], b['levier']), ('retraites_age', 'retraites_age'))
        self.assertEqual(DT.comparer(a, b), 'même module ; paramètres propres à la mesure : %s' % DT.LIB_PARAM['age_effectif'])

    def test_constantes_lues_dans_le_code(self):
        J = D['js']
        self.assertEqual(len(J['erosion_gf']), 3)
        self.assertEqual(len(J['trans_d']), 3)
        self.assertTrue(J['erosion_gf'][0] < J['erosion_gf'][1] < J['erosion_gf'][2])
        self.assertGreater(J['remuneration2024'] * 1e9 / J['agents'], 10000)


class TestFichiers(unittest.TestCase):
    def test_fichiers_a_jour(self):
        """Les fichiers du dossier sont exactement la sortie du générateur (aucune retouche à la main)."""
        for nom, texte in PAGES.items():
            with open(os.path.join(ICI, nom), encoding='utf-8') as fh:
                self.assertEqual(fh.read(), texte, nom + ' : relancer detail.py')

    def test_aucun_mot_prive_ni_parole(self):
        sys.path.insert(0, os.path.join(DT.RACINE, 'outils', 'publication'))
        import export_public as ep     # noqa: E402
        import parole_auteur as pa     # noqa: E402
        for nom, texte in PAGES.items():
            propre = ep.nettoyer(texte, '.md')
            for i, l in enumerate(propre.splitlines(), 1):
                self.assertIsNone(ep.mot_interdit(l), (nom, i))
                self.assertEqual(pa.regles(l), [], (nom, i, l[:120]))


if __name__ == '__main__':
    unittest.main()
