# -*- coding: utf-8 -*-
"""Test du squelette. Lancer : python3 -I test_calcul.py (depuis ce dossier ou un autre).

Un bon test vérifie un résultat que l'on peut calculer à la main ou une propriété qui doit toujours tenir,
pas seulement que le code s'exécute.
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import calcul  # noqa: E402


class TestCalcul(unittest.TestCase):
    def test_resultat_a_la_main(self):
        # 2000 personnes, 30 % renoncent : 1400 utilisent ; 1400 x 1500 = 2 100 000 euros
        self.assertAlmostEqual(calcul.cout_annuel(2000, 1500.0, 0.30), 2_100_000.0)

    def test_ordre_des_scenarios(self):
        # le scénario « haut » doit coûter plus que le central, qui coûte plus que le « bas »
        r = calcul.calculer()
        self.assertLess(r["bas"], r["central"])
        self.assertLess(r["central"], r["haut"])

    def test_pas_de_cout_si_tout_le_monde_renonce(self):
        self.assertEqual(calcul.cout_annuel(5000, 1000.0, 1.0), 0.0)

    def test_pure(self):
        # mêmes entrées, mêmes sorties
        self.assertEqual(calcul.calculer(), calcul.calculer())


if __name__ == "__main__":
    unittest.main()
