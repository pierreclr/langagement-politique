# -*- coding: utf-8 -*-
import math
import unittest
import modele as m


class TestDepense(unittest.TestCase):
    def test_cout_par_eleve(self):
        self.assertEqual(m.cout_par_eleve(1000, 10), 100)
        with self.assertRaises(ValueError):
            m.cout_par_eleve(1, 0)

    def test_niveaux_somme(self):
        d = m.depense_par_niveau()
        self.assertAlmostEqual(d["premier_degre"] + d["second_degre"] + d["superieur"], d["total_reconstitue"])
        self.assertAlmostEqual(d["total_reconstitue"] + d["reste_non_explique"], 199.2)
        self.assertTrue(0 < d["reste_non_explique"] < 60)

    def test_pisa(self):
        self.assertEqual(m.ecart_pisa(474, 472), 2)
        self.assertAlmostEqual(m.points_en_sd(21), 0.21)


class TestSurveillants(unittest.TestCase):
    def test_cout_aed(self):
        self.assertAlmostEqual(m.cout_surveillant_charge(1000, 1.5), 18000)
        self.assertTrue(28000 < m.cout_surveillant_charge() < 33000)

    def test_surveillant_moins_cher_que_enseignant_a_ratio_egal(self):
        for i in range(3):
            self.assertLess(m.bilan_surveillants(i)["cout_national_md"],
                            m.bilan_tuteur(i)["cout_national_md"] if m.ELEVES_PAR_ACCOMPAGNATEUR[i] else 1e9)

    def test_net_et_ordre(self):
        b = [m.bilan_surveillants(i) for i in range(3)]
        self.assertTrue(b[0]["cout_national_md"] < b[1]["cout_national_md"] < b[2]["cout_national_md"])
        for x in b:
            self.assertAlmostEqual(x["economie_nette_md"], x["economie_non_remplacement_md"] - x["cout_national_md"])

    def test_etablissements_par_bras(self):
        self.assertTrue(30 <= m.etablissements_par_bras(0.15) <= 45)
        self.assertGreater(m.etablissements_par_bras(0.10), 2 * m.etablissements_par_bras(0.15))
        with self.assertRaises(ValueError):
            m.etablissements_par_bras(0)


class TestTuteur(unittest.TestCase):
    def test_cout_composantes(self):
        c = m.cout_tuteur_par_eleve(60, 300, 4, 100, 35000)
        self.assertAlmostEqual(c["total"], 60 + 75 + 350)
        self.assertEqual(m.cout_tuteur_par_eleve(15, 0, 4, None)["accompagnateur"], 0.0)

    def test_scenarios_ordonnes(self):
        b = [m.bilan_tuteur(i) for i in range(3)]
        self.assertTrue(b[0]["cout_national_md"] < b[1]["cout_national_md"] < b[2]["cout_national_md"])
        self.assertTrue(b[0]["effet_sd"] < b[1]["effet_sd"] < b[2]["effet_sd"])
        self.assertTrue(b[0]["etp_liberes"] <= b[1]["etp_liberes"] <= b[2]["etp_liberes"])

    def test_effet_nul(self):
        self.assertIsNone(m.cout_par_dixieme_sd(100, 0))
        self.assertIsNone(m.cout_par_dixieme_sd(100, -0.1))
        self.assertAlmostEqual(m.cout_par_dixieme_sd(300, 0.3), 100)

    def test_departs_et_annees(self):
        n = m.annees_pour_absorber(1000, 0.03, 200)
        self.assertAlmostEqual(m.departs_cumules(1000, 0.03, n), 200, places=6)
        self.assertEqual(m.annees_pour_absorber(1000, 0.03, 0), 0.0)
        self.assertEqual(m.annees_pour_absorber(1000, 0.03, 1000), float("inf"))

    def test_demographie(self):
        self.assertAlmostEqual(m.etp_excedentaires_demographie(1000, 100, 1000), 100)

    def test_cout_national(self):
        self.assertAlmostEqual(m.cout_total_national(500, 1e6), 0.5)

    def test_ratio(self):
        self.assertAlmostEqual(m.eleves_par_enseignant(1800, 100), 18)


class TestChoix(unittest.TestCase):
    def test_dissimilarite(self):
        self.assertAlmostEqual(m.indice_dissimilarite([10, 10], [10, 10]), 0.0)
        self.assertAlmostEqual(m.indice_dissimilarite([20, 0], [0, 20]), 1.0)
        self.assertAlmostEqual(m.indice_dissimilarite([30, 10], [10, 30]), 0.5)
        with self.assertRaises(ValueError):
            m.indice_dissimilarite([1], [1, 2])
        with self.assertRaises(ValueError):
            m.indice_dissimilarite([0, 0], [1, 2])

    def test_jours(self):
        self.assertAlmostEqual(m.effet_en_jours(0.1), 18.0)


class TestSuperieur(unittest.TestCase):
    def test_certification(self):
        self.assertAlmostEqual(m.cout_certification(1e6, 0.5, 200), 0.1)

    def test_economie(self):
        self.assertAlmostEqual(m.economie_enseignement_en_ligne(1e6, 10000, 0.6, 0.5, 0.4), 1.2)

    def test_abandons_et_echec(self):
        self.assertAlmostEqual(m.cout_abandons_supplementaires(100000, 0.3, 0.05, 10000), 0.015)
        self.assertAlmostEqual(m.cout_echec_l1(300000, 0.26, 10000), 0.78)

    def test_bilan(self):
        for i in range(3):
            s = m.bilan_superieur(i)
            self.assertAlmostEqual(s["solde_md"], s["economie_ligne_md"] - s["abandons_md"] - s["certification_md"])
        self.assertTrue(m.bilan_superieur(0)["certification_md"] < m.bilan_superieur(2)["certification_md"])


if __name__ == "__main__":
    unittest.main()
