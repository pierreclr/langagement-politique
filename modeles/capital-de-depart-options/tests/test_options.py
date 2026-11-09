#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de modeles/capital-de-depart-options/. Usage (racine de l'atelier) : python3 -I modeles/capital-de-depart-options/tests/test_options.py
Prérequis : donnees/heritages.json (node modeles/capital-de-depart-options/code/exporter_heritages.js)."""
import math, os, sys, unittest

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(ICI), 'code'))
import options as O   # noqa: E402
import importlib.util  # noqa: E402
_s = importlib.util.spec_from_file_location('calc_fonciere', os.path.join(O.FONC, 'calculer.py'))
CF = importlib.util.module_from_spec(_s)
_s.loader.exec_module(CF)

T = CF.charger_table()
Q = T['ensemble']
S = CF.charger_secteurs()
HER = O.charger_heritages()
H = O.SCENARIOS['central']
AG = {}


def ag(nom, **kw):
    cle = (nom, tuple(sorted(kw.items())))
    if cle not in AG:
        AG[cle] = O.agreger(O.reglage(nom, **kw), H, HER, S, Q)
    return AG[cle]


class TestOptions(unittest.TestCase):
    def test_capital(self):
        """Chapitre 3 : 40 000 € × e^(−H/80 000 €) ; 50 000 € d'héritage → ≈ 21 400 €."""
        o = O.reglage('A')
        self.assertEqual(O.capital(o, 0), 40000)
        self.assertAlmostEqual(O.capital(o, 50000), 21414, delta=5)

    def test_cout_D_egal_reference(self):
        """D verse le capital à tous : son coût égale celui de modeles/capital-de-depart (continu.js), 14,7 Md€ au central."""
        ref = HER['reference']['cout_exp_K80000'][1]
        self.assertAlmostEqual(ag('D')['cout_md'], ref, delta=0.15)

    def test_issues_coherentes(self):
        """Propriétaires = foncière + banque ; versé ≥ versé à la foncière ; parts dans [0, 1]."""
        for nom in ('sans', 'A', 'B', "B'pv", 'C', 'D'):
            g = ag(nom)['parts']
            self.assertAlmostEqual(g['proprio'], g['F'] + g['banque'], places=9)
            self.assertGreaterEqual(g['verse'] + 1e-9, g['verse_F'])
            for k in ('F', 'banque', 'rien', 'proprio'):
                self.assertTrue(-1e-9 <= g[k] <= 1 + 1e-9, (nom, k, g[k]))

    def test_sans_dispositif(self):
        r = ag('sans')
        self.assertEqual(r['parts']['F'], 0.0)
        self.assertEqual(r['cout_md'], 0.0)

    def test_pas_d_argent_libre(self):
        """A, B' en parts à vie et C ne versent aucun argent libre."""
        for nom in ('A', "B'pv", 'C'):
            self.assertEqual(ag(nom)['libre_md'], 0.0)

    def test_D_fonciere_pour_les_refuses(self):
        """En D, la foncière n'apporte rien à qui obtient un prêt (même apport, nue-propriété perdue) : seuls les adhérents y vont."""
        g = ag('D')['parts']
        self.assertLessEqual(g['F_banque'], H['adh'] * H['W'] + 1e-9)

    def test_A_attire_plus_que_B(self):
        self.assertGreater(ag('A')['part_F'], ag('B')['part_F'])

    def test_quota(self):
        r = ag('A', quota=0.15)
        self.assertAlmostEqual(r['part_F'], 0.15, places=9)
        self.assertLess(max(r['prix'].values()), max(ag('A')['prix'].values()))

    def test_duree_30_ans_ouvre_aux_bas_revenus(self):
        self.assertGreaterEqual(ag('A', duree=30)['dec_y'][1]['F'], ag('A')['dec_y'][1]['F'])

    def test_transition_conservation(self):
        """Servis + non servis = demande ; avec une capacité illimitée et le report, personne n'attend ni ne perd son droit."""
        nF = {25: 40000.0, 30: 40000.0, 35: 20000.0}
        gens, ch = O.transition(nF, 0.9, [1e9] * 40, regle='report')
        for g in gens.values():
            self.assertAlmostEqual(g['servis'] + g['perdus'], g['demande'], delta=1e-6 * max(1, g['demande']))
            self.assertEqual(g['perdus'], 0.0)
        gens, ch = O.transition(nF, 0.9, O.capacite_rampe(100000.0, 10), regle='expire')
        for g in gens.values():
            self.assertLessEqual(g['servis'] + g['perdus'], g['demande'] + 1e-6)
        # une génération née après le lancement (moins de 15 ans) est servie comme en régime
        self.assertAlmostEqual(gens[5]['servis'] / 100000.0, 1.0, places=6)

    def test_chemin_restaure(self):
        orig = O.F.entrants
        r = ag('A')
        O.simuler_chemin(O.params_fonciere(r, H, horizon=12), Q, [1000.0] * 12)
        self.assertIs(O.F.entrants, orig)

    def test_regle_28_passe_le_test(self):
        """Mensualité bancaire (§ 28) : le test des 50 % passe au central (marge implicite), comme dans la v2 de la foncière."""
        b = O.bilan_fonciere(O.F.simuler(O.params_fonciere(ag('A'), H), Q))
        self.assertGreater(b['ratio_min'], 0.5)


if __name__ == '__main__':
    unittest.main(verbosity=1)
