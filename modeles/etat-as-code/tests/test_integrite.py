# -*- coding: utf-8 -*-
"""Intégrité du data package : schéma, clés primaires, clés étrangères, références croisées."""
import unittest

import _chemin  # noqa: F401
import modele as M

m = M.charger()


class Integrite(unittest.TestCase):
    def test_schema_et_cles(self):
        err = M.erreurs_integrite(m)
        self.assertEqual(err, [], "\n".join(err[:30]))

    def test_chaque_competence_actuelle_a_un_acteur(self):
        avec = {a["competence"] for a in m["attributions"] if a["etat"] == "actuel"}
        nouvelles = {"C60", "C61"}
        manquent = [c["id"] for c in m["competences"] if c["id"] not in avec and c["id"] not in nouvelles]
        self.assertEqual(manquent, [])

    def test_regles_toutes_en_vigueur(self):
        self.assertEqual([r["id_regle"] for r in m["regles"] if r["etat"] != "VIGUEUR"], [])

    def test_statuts_declares(self):
        """Chaque attribution dit si elle est un fait, une hypothèse ou à vérifier."""
        self.assertEqual([a for a in m["attributions"] if a["statut"] not in ("fait", "hypothèse", "⚠️")], [])
        self.assertTrue(all(a["statut"] == "hypothèse" for a in m["attributions"] if a["etat"] == "propose"))


if __name__ == "__main__":
    unittest.main()
