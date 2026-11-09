#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de modeles/taux-endogene/taux.py. Usage : python3 -I modeles/taux-endogene/tests/test_taux.py"""
import json, os, sys, unittest

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
TE = os.path.dirname(ICI)
BANC = os.path.join(os.path.dirname(TE), 'banc-programmes')
sys.path.insert(0, TE)
sys.path.insert(0, BANC)
import taux as T      # noqa: E402
import moteur as M    # noqa: E402

with open(os.path.join(BANC, 'donnees', 'cache', 'systeme.json'), encoding='utf-8') as f:
    ECO = json.load(f)['eco']


def banc_params():
    return T.params('central', mode='banc', endogene=False, r_sf=0.0345, prime0=0.0, taux_2026=0.0345, ecart_emission=0.0)


class TestTaux(unittest.TestCase):
    def test_reproduit_le_banc(self):
        """Mode 'banc', taux fixe 3,45 % : identique à moteur.trajectoire_dette, avec et sans effort, avec chocs."""
        for eff, chocs in (({}, None), (T.effort_md(60), None), (T.effort_md(-100), {2028: 40.0, 2029: 40.0})):
            a = M.trajectoire_dette(eff, ECO, {'g': 0.03, 'r': 0.0345}, chocs=chocs)
            b = T.trajectoire(eff, ECO, 0.03, banc_params(), chocs=chocs)
            for an in a:
                self.assertAlmostEqual(a[an]['ratio'], b[an]['ratio'], places=12)
                self.assertAlmostEqual(a[an]['deficit_pct'], b[an]['deficit_pct'], places=12)
        self.assertAlmostEqual(T.trajectoire({}, ECO, 0.03, banc_params())[2038]['ratio'], 1.5712, places=4)   # fil de l'eau du banc : 157,1 %

    def test_prime_ancree(self):
        p = T.params('central')
        anc = (1.18, 0.058)
        self.assertAlmostEqual(T.prime_fondamentale(1.18, 0.058, anc, p), p['prime0'], places=12)
        # +10 points de dette sous le seuil : +20 pb
        self.assertAlmostEqual(T.prime_fondamentale(1.28, 0.058, anc, p) - p['prime0'], 0.0020, places=10)
        # +1 point de déficit : +10 pb
        self.assertAlmostEqual(T.prime_fondamentale(1.18, 0.068, anc, p) - p['prime0'], 0.0010, places=10)
        # convexité : à 150 %, (150 - 130)² x 0,03 pb = 12 pb en plus du linéaire
        self.assertAlmostEqual(T.prime_fondamentale(1.50, 0.058, anc, p) - p['prime0'], 0.0064 + 0.0012, places=10)
        # plancher et plafond
        self.assertEqual(T.prime_fondamentale(0.2, -0.05, anc, p), 0.0)
        self.assertEqual(T.prime_fondamentale(4.0, 0.3, anc, p), p['plafond_prime'])

    def test_prime_croissante(self):
        p = T.params('haut')
        anc = (1.18, 0.058)
        xs = [T.prime_fondamentale(d / 100, 0.06, anc, p) for d in range(100, 200, 5)]
        self.assertTrue(all(b >= a for a, b in zip(xs, xs[1:])))
        # convexe au-delà du seuil : la pente augmente
        pentes = [b - a for a, b in zip(xs, xs[1:])]
        self.assertGreater(pentes[-1], pentes[5])

    def test_tpi(self):
        self.assertTrue(T.eligible_tpi(0.029, None))
        self.assertTrue(T.eligible_tpi(0.05, 0.055))
        self.assertFalse(T.eligible_tpi(0.05, 0.052))
        self.assertFalse(T.eligible_tpi(0.05, None))
        p = T.params('central', tpi=0.0175)
        anc = (1.18, 0.058)
        self.assertEqual(T.prime(2.0, 0.02, 0.03, anc, p), 0.0175)
        self.assertGreater(T.prime(2.0, 0.08, 0.07, anc, p), 0.0175)

    def test_taux_apparent_converge(self):
        """Sans boucle, avec dette stable, le taux apparent tend vers le coût d'émission."""
        p = T.params('central', endogene=False)
        tr = T.trajectoire({}, ECO, 0.03, p, annee_fin=2058)
        cible = p['r_sf'] + p['prime0'] + p['ecart_emission']
        self.assertLess(abs(tr[2058]['i_apparent'] - cible), 0.002)
        ia = [tr[a]['i_apparent'] for a in range(2027, 2059)]
        self.assertTrue(all(b >= a - 1e-12 for a, b in zip(ia, ia[1:])))

    def test_effort_reduit_taux_et_dette(self):
        p = T.params('central')
        prec = None
        for e in (0, 30, 60, 100, 150):
            tr = T.trajectoire(T.effort_md(e), ECO, 0.03, p)
            if prec:
                self.assertLess(tr[2038]['ratio'], prec[2038]['ratio'])
                self.assertLessEqual(tr[2038]['r_marche'], prec[2038]['r_marche'])
            prec = tr

    def test_boucle_amplifie(self):
        """La boucle aggrave une trajectoire qui dérape et allège une trajectoire qui se redresse, par rapport au même niveau de taux sans boucle."""
        pe, px = T.params('central'), T.params('central', endogene=False)
        self.assertGreater(T.trajectoire({}, ECO, 0.03, pe)[2058]['ratio'], T.trajectoire({}, ECO, 0.03, px)[2058]['ratio'])
        self.assertLess(T.trajectoire(T.effort_md(150), ECO, 0.03, pe)[2058]['ratio'], T.trajectoire(T.effort_md(150), ECO, 0.03, px)[2058]['ratio'])

    def test_annee_2027_ancre(self):
        tr = T.trajectoire({}, ECO, 0.03, T.params('central'))
        self.assertAlmostEqual(tr[2027]['r_marche'], 0.034 + 0.013, places=12)
        self.assertAlmostEqual(tr[2026]['r_marche'], 0.039, places=12)

    def test_multiplicateur(self):
        """Avec multiplicateur, un effort pèse davantage sur la dette à court terme, l'écart se résorbe ensuite."""
        p0, p1 = T.params('central'), T.params('central', multiplicateur=0.8)
        a = T.trajectoire(T.effort_md(100), ECO, 0.03, p0)
        b = T.trajectoire(T.effort_md(100), ECO, 0.03, p1)
        self.assertGreater(b[2030]['ratio'], a[2030]['ratio'])
        self.assertLess(abs(b[2045]['ecart_prod']), 1e-5)

    def test_effort_stabilisant(self):
        e = T.effort_stabilisant(ECO, 0.03, T.params('central'))
        self.assertIsNotNone(e)
        tr = T.trajectoire(T.effort_md(e), ECO, 0.03, T.params('central'))
        self.assertLessEqual(max(tr[a]['ratio'] for a in range(2038, 2059)), tr[2038]['ratio'] + 0.001)
        if e >= 1:
            tr2 = T.trajectoire(T.effort_md(e - 1), ECO, 0.03, T.params('central'))
            self.assertGreater(max(tr2[a]['ratio'] for a in range(2038, 2059)), tr2[2038]['ratio'] + 0.001)


if __name__ == '__main__':
    unittest.main()
