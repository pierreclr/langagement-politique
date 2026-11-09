#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de modeles/entreprise-interet-public/modele.py. Usage : python3 -I modeles/entreprise-interet-public/tests/test_modele.py"""
import os, sys, unittest

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(ICI))
import modele as E  # noqa: E402


class TestModele(unittest.TestCase):
    def test_p_succes(self):
        par = dict(n=3, p1=0.5, p2=0.5)
        self.assertAlmostEqual(E.p_succes(par), 1 - 0.75 ** 3)
        self.assertAlmostEqual(E.p_succes(dict(n=1, p1=1.0, p2=1.0)), 1.0)

    def test_apprentissage(self):
        self.assertAlmostEqual(E.cout_unite(10.0, 1, 0.1), 10.0)
        self.assertAlmostEqual(E.cout_unite(10.0, 2, 0.1), 9.0)
        self.assertAlmostEqual(E.cout_unite(10.0, 4, 0.1), 8.1)
        self.assertAlmostEqual(E.cout_unite(10.0, 8, 0.0), 10.0)

    def test_tranches_et_echecs(self):
        par = E.PARAMS['atome']['central']
        self.assertAlmostEqual(E.tranches(par, 0), par['n'] * par['c1'])
        self.assertAlmostEqual(E.tranches(par, par['t1']), par['n'] * par['p1'] * par['c2'])
        self.assertAlmostEqual(E.tranches(par, par['t2']), par['equipe'] * E.p_succes(par))
        e = E.cout_echecs(par)
        self.assertLess(e['perdu'], e['tranches'])
        self.assertGreaterEqual(E.cout_echec_total(par), e['tranches'])

    def test_tout_echoue_rien_apres_tranches(self):
        for p in E.POLES:
            se = E.serie_pole(E.PARAMS[p]['central'], force_succes=0.0)
            self.assertEqual(sum(v['capex'] + v['revenus'] for v in se.values()), 0.0)

    def test_monotonie_succes(self):
        """Plus de réussite : plus de capex, plus de revenus."""
        for p in E.POLES:
            a = E.serie_pole(E.PARAMS[p]['central'], force_succes=0.5)
            b = E.serie_pole(E.PARAMS[p]['central'], force_succes=1.0)
            self.assertAlmostEqual(sum(v['revenus'] for v in b.values()), 2 * sum(v['revenus'] for v in a.values()), places=9)

    def test_capex_reparti_sur_le_delai(self):
        par = dict(E.PARAMS['atome']['central'], appr=0.0, duree=1, rythme=1.0)
        se = E.serie_pole(par, force_succes=1.0)
        neuf = [se[a]['capex_neuf'] for a in sorted(se)]
        self.assertAlmostEqual(sum(neuf), par['capex0'])
        self.assertEqual(sum(1 for x in neuf if x > 0), par['delai'])
        an_service = E.AN0 + par['t2'] + par['delai']
        self.assertEqual(se[an_service - 1]['revenus'], 0.0)
        self.assertAlmostEqual(se[an_service]['revenus'], par['rev'])

    def test_holding_epargne_plafonnee(self):
        for s in E.SCENARIOS:
            _, h = E.scenario(s)
            for an, v in h.items():
                self.assertLessEqual(v['epargne'], v['besoin'] + 1e-12)
                self.assertLessEqual(v['epargne'], E.HOLDING[s]['epargne'] + 1e-12)
                if v['flux'] <= 0:
                    self.assertEqual(v['socle'], 0.0)
                self.assertAlmostEqual(v['solde_apu'], v['flux'] - v['socle'])

    def test_enveloppe(self):
        _, h = E.scenario('central')
        env = E.enveloppe_necessaire(h)
        self.assertAlmostEqual(env['enveloppe'], max(h[a]['tranches'] for a in range(2029, 2039)))
        self.assertTrue(all(x >= 0 for x in env['emprunt_conditionne'].values()))

    def test_taux_reussite(self):
        self.assertEqual(E.taux_reussite(['reussite', 'echec']), (0.5, 0.5))
        self.assertEqual(E.taux_reussite(['partielle', 'echec']), (0.0, 0.25))

    def test_ordre_scenarios(self):
        """Le programme ambitieux investit plus que le central, qui investit plus que le prudent."""
        inv = {}
        for s in E.SCENARIOS:
            se, _ = E.scenario(s)
            inv[s] = sum(v['capex'] + v['rd'] for p in se for v in se[p].values())
        self.assertLess(inv['prudent'], inv['central'])
        self.assertLess(inv['central'], inv['ambitieux'])


if __name__ == '__main__':
    unittest.main()
