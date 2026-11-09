# -*- coding: utf-8 -*-
"""Tests du module heures par hectare. Depuis modeles/agriculture/ :  python3 -m unittest test_heures -v"""
import math
import unittest

import heures as h


class TestDonneesBec(unittest.TestCase):
    def test_remuneration_horaire_recoupe_le_rapport(self):
        # rapport final : 28 651 € = 9,47 €/h (2014 B) ; 25 881 € = 8,54 €/h (2014 H) ; 13 580 € ~ 6,77 €/h (2013 B)
        self.assertAlmostEqual(h.BEC['haut']['marge'], 28651.0, delta=10)
        self.assertAlmostEqual(h.BEC['central']['marge'], 25881.0, delta=10)
        self.assertAlmostEqual(h.marge_par_heure(h.BEC['haut']), 9.47, places=2)

    def test_extrapolation_hectare_multiplie_par_dix(self):
        e = h.ha_equiv(h.BEC['bas'])
        self.assertAlmostEqual(e['heures'], 20060.0)
        self.assertAlmostEqual(e['ca'], 327880.0)
        # 20 060 h / 1 607 h = 12,5 équivalents temps plein
        self.assertAlmostEqual(e['heures'] / h.H_ACTIF, 12.48, places=2)

    def test_marge_par_heure_sous_le_cout_du_travail(self):
        # au coût central de 16 €/h, aucune version du Bec-Hellouin ne paie ses heures
        for s in h.BEC:
            self.assertLess(h.marge_par_heure(h.BEC[s]), h.W_HUMAIN['central'])
            self.assertLess(h.profit_ha(h.ha_equiv(h.BEC[s]), 0.0, 0.0, 16.0), 0.0)


class TestRobot(unittest.TestCase):
    def test_annuite(self):
        self.assertAlmostEqual(h.annuite(1000.0, 0.0, 10), 100.0)
        self.assertAlmostEqual(h.annuite(1000.0, 0.05, 8), 154.72, places=1)

    def test_cout_robot_heure_central(self):
        c = h.cout_robot_heure(U=800.0, k=1.0, phi=0.7)
        self.assertAlmostEqual(c, (h.annuite(86000.0, 0.05, 8) + 4300.0) / 560.0, places=6)
        self.assertGreater(c, 16.0)   # aujourd'hui le robot coûte plus qu'un salarié (central)

    def test_cout_monotone(self):
        base = h.cout_robot_heure()
        self.assertGreater(h.cout_robot_heure(phi=0.5), base)
        self.assertLess(h.cout_robot_heure(U=1200.0), base)
        self.assertLess(h.cout_robot_a(base, 0.06, 5), base)
        self.assertAlmostEqual(h.cout_robot_a(base, 0.0, 5), base)


class TestSeuils(unittest.TestCase):
    def setUp(self):
        self.b = h.ha_equiv(h.BEC['haut'])
        self.m = h.MONO['central']

    def test_seuil_ha_est_le_point_d_egalite(self):
        c = h.seuil_par_ha(self.b, self.m, 0.95, 16.0)
        self.assertIsNotNone(c)
        pc = h.profit_ha(self.b, 0.95, c, 16.0)
        pm = h.profit_ha(self.m, 0.0, 0.0, 16.0)
        self.assertAlmostEqual(pc, pm, places=6)

    def test_seuil_actif_est_le_point_d_egalite(self):
        c = h.seuil_par_actif(self.b, self.m, 0.95)
        self.assertAlmostEqual(h.revenu_actif(self.b, 0.95, c), h.revenu_actif(self.m, 0.0, 0.0), places=4)

    def test_seuil_decroit_quand_la_part_robotisee_baisse(self):
        # robotiser moins d'heures : le robot doit être moins cher, ou c'est impossible
        a = h.seuil_par_ha(self.b, self.m, 0.95, 16.0)
        b = h.seuil_par_ha(self.b, self.m, 0.80, 16.0)
        self.assertTrue(b is None or b < a)

    def test_impossible_si_trop_peu_robotise(self):
        self.assertIsNone(h.seuil_par_ha(self.b, self.m, 0.2, 16.0))
        self.assertIsNone(h.seuil_par_actif(self.b, self.m, 0.7))
        self.assertIsNone(h.seuil_par_ha(self.b, self.m, 0.0, 16.0))

    def test_part_minimale_robot_gratuit(self):
        r = h.part_robotisee_minimale(self.b, self.m, 16.0, 'ha')
        self.assertAlmostEqual(h.profit_ha(self.b, r, 0.0, 16.0), h.profit_ha(self.m, 0.0, 0.0, 16.0), places=6)
        ra = h.part_robotisee_minimale(self.b, self.m, 16.0, 'actif')
        self.assertAlmostEqual(h.revenu_actif(self.b, ra, 0.0), h.revenu_actif(self.m, 0.0, 0.0), places=4)
        self.assertGreater(ra, r)    # le critère par actif est plus exigeant que par hectare

    def test_surface_par_actif(self):
        # monoculture 6 h/ha : 267,8 ha par actif ; revenu = 267,8 × 300 = 80,3 k€
        self.assertAlmostEqual(h.surface_par_actif(self.m, 0.0), 1607.0 / 6.0)
        self.assertAlmostEqual(h.revenu_actif(self.m, 0.0, 0.0), 80350.0, places=0)
        self.assertEqual(h.surface_par_actif(self.b, 1.0), float('inf'))


class TestDates(unittest.TestCase):
    def test_annee_seuil(self):
        self.assertEqual(h.annee_seuil(10.0, 12.0, 0.06), 0.0)
        self.assertIsNone(h.annee_seuil(10.0, None, 0.06))
        self.assertIsNone(h.annee_seuil(10.0, 5.0, 0.0))
        t = h.annee_seuil(32.0, 16.0, 0.10)
        self.assertAlmostEqual(h.cout_robot_a(32.0, 0.10, t), 16.0, places=9)
        self.assertAlmostEqual(t, math.log(0.5) / math.log(0.9), places=9)

    def test_horizon(self):
        self.assertIsNone(h.annee_seuil(1000.0, 1.0, 0.03))   # 227 ans
        self.assertEqual(h.date_seuil(32.0, 16.0, 0.10), 2026 + 7)


class TestContraintes(unittest.TestCase):
    def test_saturation_marche(self):
        # 6,8 Md€ de fruits et légumes à 450 k€/ha : environ 15 000 ha
        s = h.surface_saturation_ha(6.8e9, 450000.0)
        self.assertAlmostEqual(s, 15111.1, places=0)
        self.assertLess(h.part_sau(s), 0.001)

    def test_prix_relatif(self):
        self.assertAlmostEqual(h.prix_relatif(1.0), 1.0)
        self.assertLess(h.prix_relatif(2.0), 0.5)           # demande inélastique : le prix baisse plus que l'offre ne monte
        self.assertAlmostEqual(h.prix_relatif(h.multiple_offre_max(0.2)), 0.8, places=9)

    def test_marge_requise(self):
        self.assertAlmostEqual(h.marge_requise(100.0, 16.0, 200.0), 1800.0)


class TestScenarios(unittest.TestCase):
    def test_trois_scenarios_coherents(self):
        self.assertEqual(set(h.BEC), {'bas', 'central', 'haut'})
        cs = [h.cout_robot_heure(U=h.PARAM_ROBOT[s]['U'], k=h.PARAM_ROBOT[s]['k'], phi=h.PARAM_ROBOT[s]['phi'])
              for s in ('bas', 'central', 'haut')]
        self.assertGreater(cs[0], cs[1])
        self.assertGreater(cs[1], cs[2])


if __name__ == '__main__':
    unittest.main()
