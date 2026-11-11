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


def ligne_tableau(section, debut):
    return DT.tableau_md(RES_MD, section, debut)


class TestTotaux(unittest.TestCase):
    def test_totaux_egaux_au_tableau_comparatif(self):
        """Le total de chaque page de détail est celui du tableau comparatif (§ 11.1, et § 1 pour LFI et le RN)."""
        entete = ligne_tableau('### 11.1', '')  # première ligne : en-tête
        cells = ligne_tableau('### 11.1', 'Réduction (+) ou aggravation')
        col = {'LR (Retailleau)': 'lr', 'PS et Place publique': 'ps', 'Glucksmann (livret climat, partiel)': 'gl', 'RN': 'rn', 'LFI': 'lfi', 'Notre système': 'langagement', "Fil de l'eau": 'fil_de_l_eau'}
        vus = set()
        for nom, val in zip(entete[1:], cells[1:]):
            cle = col[nom]
            vus.add(cle)
            if cle == 'fil_de_l_eau':
                continue
            self.assertEqual(DT.totaux(cle, D), val, cle)
            self.assertIn('**%s**' % val, PAGES[DT.FICHIERS[cle]], cle)
        self.assertEqual(vus, set(DT.PAGES) | {'fil_de_l_eau'})
        c1 = ligne_tableau('## 1. Tableau comparatif', 'Réduction (+) ou aggravation')
        self.assertEqual(DT.totaux('lfi', D), c1[1])
        self.assertEqual(DT.totaux('rn', D), c1[2])
        self.assertTrue(c1[3].startswith(DT.totaux('langagement', D)))


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
        """Chaque estimation affichée est la médiane [p10 ; p90] de donnees/resultats.json."""
        for cle in DT.PAGES:
            texte = PAGES[DT.FICHIERS[cle]]
            for m in D['progs'][cle][1]:
                self.assertIn('**%s** Md€ par an' % DT.iv(D['R'][cle]['par_mesure'][m['id']], 1), texte, (cle, m['id']))


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
