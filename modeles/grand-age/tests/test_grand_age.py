# -*- coding: utf-8 -*-
"""Tests du modèle du grand âge. Lancer : python3 -I modeles/grand-age/tests/test_grand_age.py"""
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "code"))
import grand_age as g  # noqa: E402


class TestRegles(unittest.TestCase):
    def setUp(self):
        self.p = g.parametres("central")

    def test_courbe_pension_nulle_en_dessous_du_seuil(self):
        self.assertEqual(g.courbe_pension(2000, self.p), 0.0)
        self.assertEqual(g.courbe_pension(1200, self.p), 0.0)

    def test_courbe_pension_reperes_systeme(self):
        # système en une page : 22 € à 2 500 €, 79 € à 3 000 €, 261 € à 4 000 €
        self.assertAlmostEqual(g.courbe_pension(2500, self.p), 22, delta=1)
        self.assertAlmostEqual(g.courbe_pension(3000, self.p), 79, delta=1)
        self.assertAlmostEqual(g.courbe_pension(4000, self.p), 261, delta=2)

    def test_plancher(self):
        self.assertEqual(g.revenu_resident(300, 0, self.p), 877.0)
        self.assertEqual(g.revenu_resident(1000, 0, self.p), 1000.0)

    def test_prix_public_se_decompose(self):
        px = g.prix_public(self.p)
        self.assertAlmostEqual(px["soin"] + px["dependance"] + px["hebergement"], px["total"], places=6)
        self.assertGreater(px["soin"], 0)

    def test_participation_90_pour_cent_avec_minimum(self):
        # 1 000 € -> garde 10 % = 100 € < minimum 120 € : participation = 880
        self.assertAlmostEqual(g.participation(1000, self.p), 880.0, places=6)
        # 2 000 € -> garde 200 €, participation 1 800
        self.assertAlmostEqual(g.participation(2000, self.p), 1800.0, places=6)

    def test_participation_plafonnee_a_l_hebergement(self):
        px = g.prix_public(self.p)
        self.assertAlmostEqual(g.participation(9000, self.p), px["hebergement"], places=6)

    def test_participation_croissante(self):
        vals = [g.participation(y, self.p) for y in range(877, 6000, 250)]
        self.assertEqual(vals, sorted(vals))

    def test_conjoint_a_domicile_reduit_la_participation(self):
        y = 2000
        self.assertLess(g.participation(y, self.p, conjoint_domicile=True), g.participation(y, self.p))
        # le conjoint sans revenu reçoit le plancher : la participation baisse de 877 au plus
        self.assertAlmostEqual(g.conjoint_a_domicile(2000, 0, self.p), 1800 - 877, places=6)
        self.assertEqual(g.conjoint_a_domicile(2000, 5000, self.p), 1800)

    def test_couple_chacun_selon_ses_revenus(self):
        r = g.couple_entre_ensemble(1000, 3000, 100_000, self.p, 0)
        self.assertAlmostEqual(r["participations"][0], 880.0, places=6)
        self.assertAlmostEqual(r["participations"][1], g.prix_public(self.p)["hebergement"], places=6)

    def test_impot_transmission(self):
        self.assertEqual(g.impot_transmission(0, self.p), 0.0)
        self.assertEqual(g.impot_transmission(-5, self.p), 0.0)
        a, b = g.impot_transmission(100_000, self.p), g.impot_transmission(200_000, self.p)
        self.assertTrue(0 < a < b)
        self.assertLess(b - a, 0.5 * 100_000)  # marginal < 50 %

    def test_reprise_bornee(self):
        self.assertEqual(g.reprise_succession(50_000, 20_000, 0, self.p), 20_000)
        self.assertEqual(g.reprise_succession(50_000, 300_000, 300_000, self.p), 0)
        self.assertEqual(g.reprise_succession(50_000, 500_000, 300_000, self.p), 50_000)


class TestAgregats(unittest.TestCase):
    def test_quantiles_calibres_sur_drees(self):
        q99 = g.calibrer_queue()
        self.assertAlmostEqual(g.moyenne_revenus_2016(2700.0, q99), 1700.0, delta=1.0)
        self.assertAlmostEqual(g.quantile_revenus_2016(0.5, 2700.0, q99), 1400.0, delta=1e-6)
        self.assertAlmostEqual(g.quantile_revenus_2016(0.25, 2700.0, q99), 1100.0, delta=1e-6)

    def test_abattement_plus_haut_moins_de_reprise(self):
        p = g.parametres("central")
        r0 = g.simuler(p, 0, 40, 12)["reprises_annuelles_Md"]
        r1 = g.simuler(p, 100_000, 40, 12)["reprises_annuelles_Md"]
        r3 = g.simuler(p, 300_000, 40, 12)["reprises_annuelles_Md"]
        self.assertGreater(r0, r1)
        self.assertGreater(r1, r3)

    def test_bilan_comptable(self):
        p = g.parametres("central")
        r = g.simuler(p, 100_000, 40, 12)
        self.assertAlmostEqual(r["depense_totale_Md"] - r["recette_participation_Md"],
                               r["depense_publique_brute_Md"], places=6)
        self.assertAlmostEqual(r["depense_publique_brute_Md"] - r["reprises_annuelles_Md"],
                               r["depense_publique_nette_Md"], places=6)

    def test_scenarios_ordonnes(self):
        res = {s: g.simuler(g.parametres(s), 100_000, 40, 12)["depense_publique_nette_Md"]
               for s in ("bas", "central", "haut")}
        self.assertLess(res["bas"], res["central"])
        self.assertLess(res["central"], res["haut"])

    def test_projection_croit_avec_les_80_ans_et_plus(self):
        p = g.parametres("central")
        self.assertGreater(g.residents_en(2040, p), g.residents_en(2028, p))
        self.assertEqual(g.residents_en(2023, p), p["residents_2023"])

    def test_cout_public_actuel_ordre_de_grandeur(self):
        c = g.cout_public_actuel(g.parametres("central"))
        self.assertTrue(15 < c["total"] < 30)

    def test_cas_types_pension_1000_sans_patrimoine(self):
        p = g.parametres("central")
        c = g.cas_type(1000, 0, p, 100_000)
        self.assertEqual(c["prop_reprise_patrimoine"], 0.0)
        self.assertGreater(c["prop_argent_de_poche"], 0)  # il garde de l'argent de poche


class TestCalage(unittest.TestCase):
    def test_recuperations_ash(self):
        p = g.parametres("central")
        self.assertAlmostEqual(g.recuperations_actuelles_ash(p), 1.204 * 1.08 * 0.25 / 0.75, places=3)

    def test_cale_au_dessus_de_zero(self):
        self.assertGreater(g.cout_public_actuel_cale(g.parametres("central")), 10)

    def test_parts_dans_0_1(self):
        r = g.simuler(g.parametres("central"), 100_000, 30, 10)
        for k in ("part_residents_avec_avance", "part_successions_touchees"):
            self.assertTrue(0 <= r[k] <= 1)


if __name__ == "__main__":
    unittest.main()
