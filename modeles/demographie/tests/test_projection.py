# -*- coding: utf-8 -*-
"""Tests du modele demographique. Execution : python3 -I tests/test_projection.py"""
import os
import sys
import unittest

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, "..", "code"))
import projection as P  # noqa: E402
import validation as V  # noqa: E402

DONNEES = os.path.join(ICI, "..", "donnees")
BASE = P.charger_base(DONNEES)


class TestModele(unittest.TestCase):
    def test_pyramide_depart(self):
        tot = sum(sum(v) for v in BASE["pyramide"].values())
        self.assertEqual(round(tot), 69081996)  # Insee, France au 1er janvier 2026

    def test_esperance_vie_table(self):
        # le calcul d'e0 retrouve l'e0 publie par l'Insee (table 2023-2025) a 0,05 an pres
        for s in (P.HOMME, P.FEMME):
            self.assertAlmostEqual(P.esperance_vie(BASE["q"][s]), BASE["e0_base"][s], delta=0.05)

    def test_table_pour_esperance(self):
        q = P.table_pour_esperance(BASE["q"][P.FEMME], 90.0)
        self.assertAlmostEqual(P.esperance_vie(q), 90.0, delta=0.001)

    def test_icf_2025(self):
        self.assertAlmostEqual(BASE["icf_2025"], 1.56, delta=0.01)

    def test_conservation(self):
        # variation de population = naissances - deces + migrants, chaque annee
        s = P.projeter(BASE, P.parametres(BASE))
        for a, b in zip(s, s[1:]):
            d = b["total"] - a["total"]
            self.assertAlmostEqual(d, a["naissances"] - a["deces"] + a["migrants"], delta=1.0)

    def test_migration_somme(self):
        s = P.projeter(BASE, P.parametres(BASE, solde_migratoire=100000.0))
        self.assertAlmostEqual(s[0]["migrants"], 100000.0, delta=1.0)

    def test_sans_migration_ni_naissance_la_population_baisse(self):
        s = P.projeter(BASE, P.parametres(BASE, solde_migratoire=0.0, icf_cible=0.0001, annee_icf=2027, horizon=2050))
        self.assertLess(s[-1]["total"], s[0]["total"] * 0.85)

    def test_monotonie(self):
        def pop(**kw):
            return P.par_annee(P.projeter(BASE, P.parametres(BASE, **kw)))[2070]
        self.assertLess(pop(icf_cible=1.2)["total"], pop()["total"])
        self.assertLess(pop()["total"], pop(icf_cible=1.7)["total"])
        self.assertLess(pop(solde_migratoire=0.0)["total"], pop()["total"])
        self.assertLess(pop(gain_e0_femmes=0.0, gain_e0_hommes=0.0)["65_plus"], pop()["65_plus"])

    def test_age_depart_reduit_la_charge(self):
        a = P.par_annee(P.projeter(BASE, P.parametres(BASE, age_depart=62)))[2070]
        b = P.par_annee(P.projeter(BASE, P.parametres(BASE, age_depart=67)))[2070]
        self.assertGreater(a["retraites_par_actif"], b["retraites_par_actif"])

    def test_parametre_inconnu(self):
        with self.assertRaises(KeyError):
            P.parametres(BASE, fecondite=1.5)

    def test_calage_pensions(self):
        r = P.reference_pensions(BASE)
        s = P.projeter(BASE, P.parametres(BASE, age_depart=62))
        self.assertAlmostEqual(s[0]["depenses_retraite_pct_pib_pension_constante"], 14.1, delta=0.001)
        self.assertGreater(r["ratio_2026_age62"], 0.4)


class TestValidationInsee(unittest.TestCase):
    def test_contre_insee(self):
        hors = [(lib, e) for lib, m, i, e, t in V.comparer() if abs(e) > t]
        self.assertEqual(hors, [], "ecarts hors tolerance : %s" % hors)

    def test_points_demandes(self):
        # population totale et 65+ en 2040 et 2070, scenario central, a 3 % pres
        lignes = {lib: e for lib, m, i, e, t in V.comparer()}
        for cle in ("population totale central 2040 (M)", "population totale central 2070 (M)",
                    "65 ans ou plus central 2040 (M)", "65 ans ou plus central 2070 (M)"):
            self.assertLess(abs(lignes[cle]), 3.0, cle)


if __name__ == "__main__":
    unittest.main(verbosity=2)
