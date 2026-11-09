# -*- coding: utf-8 -*-
"""Tests du pilote : python3 -I -m unittest discover -s modeles/flux-legislatif/pilote-licenciement/tests"""
import sys
import unittest
from dataclasses import replace
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from regles import OPTIONS_DEFAUT, Situation, actuel, bareme_indemnite, reecrit, salaire_reference  # noqa: E402
from stress_test import TOUT_OFF, attribuer, comparer, grille  # noqa: E402

BASE = Situation()  # CDI, 24 mois, 2 000 € stables, pas de faute


class DroitActuel(unittest.TestCase):
    """Chaque test cite l'article qu'il vérifie."""

    def test_L1234_1_paliers_preavis(self):
        self.assertIsNone(actuel(replace(BASE, anciennete_mois=5)).preavis_mois)      # 1° renvoi
        self.assertEqual(actuel(replace(BASE, anciennete_mois=6)).preavis_mois, 1.0)  # 2°
        self.assertEqual(actuel(replace(BASE, anciennete_mois=23)).preavis_mois, 1.0)
        self.assertEqual(actuel(replace(BASE, anciennete_mois=24)).preavis_mois, 2.0)  # 3°

    def test_L1234_1_convention_plus_favorable(self):
        self.assertEqual(actuel(replace(BASE, preavis_conventionnel_mois=3.0)).preavis_mois, 3.0)
        self.assertEqual(actuel(replace(BASE, preavis_conventionnel_mois=0.5)).preavis_mois, 2.0)  # L1234-2

    def test_faute_grave_prive_de_preavis_et_indemnite(self):
        r = actuel(replace(BASE, faute="grave", anciennete_mois=120))
        self.assertEqual((r.preavis_mois, r.indemnite_licenciement), (0.0, 0.0))
        self.assertGreater(actuel(replace(BASE, faute="simple", anciennete_mois=120)).indemnite_licenciement, 0)

    def test_L1234_8_suspension_non_comptee(self):
        r = actuel(replace(BASE, anciennete_mois=26, suspension_mois=4))
        self.assertEqual(r.preavis_mois, 1.0)
        r = actuel(replace(BASE, anciennete_mois=26, suspension_mois=4, suspension_elu_local_mois=4))
        self.assertEqual(r.preavis_mois, 2.0)

    def test_L1234_9_seuil_8_mois(self):
        self.assertFalse(actuel(replace(BASE, anciennete_mois=7)).droit_indemnite)
        self.assertTrue(actuel(replace(BASE, anciennete_mois=8)).droit_indemnite)

    def test_R1234_2_bareme(self):
        self.assertAlmostEqual(bareme_indemnite(3000, 120), 7500)          # 10 ans x 1/4
        self.assertAlmostEqual(bareme_indemnite(3000, 144), 7500 + 2000)   # + 2 ans x 1/3
        self.assertAlmostEqual(bareme_indemnite(2400, 18), 900)            # 1,5 an x 1/4
        self.assertAlmostEqual(bareme_indemnite(2400, 18.9), 900)          # R1234-1 : mois complets

    def test_indemnite_compte_le_preavis(self):
        # 24 mois + 2 mois de préavis = 26 mois -> 2000 x 26/12 / 4
        self.assertAlmostEqual(actuel(BASE).indemnite_licenciement, 2000 * 26 / 12 / 4)

    def test_R1234_4_plus_favorable(self):
        s = replace(BASE, salaires_12_mois=(2000.0,) * 9 + (2600.0,) * 3)
        self.assertAlmostEqual(salaire_reference(s), 2600)
        s = replace(BASE, salaires_12_mois=(2500.0,) * 11 + (5500.0,), primes_annuelles_3_derniers_mois=3000)
        self.assertAlmostEqual(salaire_reference(s), 2750)  # 12 mois : 33 000 / 12

    def test_L1234_5_indemnite_compensatrice(self):
        r = actuel(replace(BASE, preavis_execute=False, preavis_dispense_par="employeur"))
        self.assertAlmostEqual(r.indemnite_preavis, 4000)
        self.assertEqual(actuel(BASE).indemnite_preavis, 0)

    def test_L1234_12_13_force_majeure(self):
        r = actuel(replace(BASE, force_majeure=True))
        self.assertEqual((r.preavis_mois, r.indemnite_licenciement), (0.0, 0.0))
        r = actuel(replace(BASE, force_majeure=True, sinistre=True))
        self.assertAlmostEqual(r.indemnite_preavis, 4000)
        self.assertGreater(r.indemnite_licenciement, 0)

    def test_L1234_15_16_alsace_moselle(self):
        r = actuel(replace(BASE, anciennete_mois=3, alsace_moselle=True))
        self.assertEqual(r.preavis_mois, 0.5)  # paie au mois : 15 jours
        r = actuel(replace(BASE, anciennete_mois=12, alsace_moselle=True, categorie_locale="professeur"))
        self.assertAlmostEqual(r.preavis_mois, 42 / 30.4)  # 6 semaines > 1 mois

    def test_documents_et_solde(self):
        r = actuel(BASE)
        self.assertEqual(len(r.documents), 3)
        self.assertEqual(r.delai_denonciation_solde_mois, 6)  # L1234-20

    def test_cdd_hors_champ(self):
        r = actuel(replace(BASE, contrat="CDD"))
        self.assertFalse(r.applicable)


class NonRegression(unittest.TestCase):
    """Le réécrit, toutes options éteintes, doit reproduire l'actuel sur toute la grille ;
    chaque écart avec les options par défaut doit être expliqué par au moins une option."""

    @classmethod
    def setUpClass(cls):
        cls.g = grille()

    def test_fidelite_sans_option(self):
        ecarts = [s for s in self.g if reecrit(s, TOUT_OFF).cle() != actuel(s).cle()]
        self.assertEqual(ecarts, [])

    def test_tout_ecart_a_une_cause(self):
        for s in self.g:
            if reecrit(s).cle() != actuel(s).cle():
                self.assertTrue(attribuer(s), s)

    def test_cas_identiques(self):
        """CDI de 5 ans hors Alsace-Moselle, sans faute : rien ne change (hors forme des documents)."""
        s = replace(BASE, anciennete_mois=60)
        self.assertEqual(reecrit(s, {"E5_document_unique": False}).cle(), actuel(s).cle())

    def test_cas_qui_changent(self):
        # E2 : 5 mois d'ancienneté -> indemnité au prorata (gagnant)
        c = comparer(replace(BASE, anciennete_mois=5))
        self.assertIn(c["sens"], ("gagnant",))
        # E3 : professeur d'Alsace-Moselle à 12 mois -> perd 2 semaines de préavis
        c = comparer(replace(BASE, anciennete_mois=12, alsace_moselle=True, categorie_locale="professeur",
                             preavis_execute=False, preavis_dispense_par="employeur"))
        self.assertEqual(c["sens"], "perdant")
        # E4 activé : hausse récente -> perdant
        s = replace(BASE, anciennete_mois=60, salaires_12_mois=(2000.0,) * 9 + (2600.0,) * 3)
        self.assertEqual(comparer(s, {"E4_salaire_12_mois_seul": True})["sens"], "perdant")


if __name__ == "__main__":
    unittest.main()
