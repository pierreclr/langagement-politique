# -*- coding: utf-8 -*-
"""Tests de l'état actuel. Les invariants du système proposé y sont appliqués : ils échouent,
et c'est attendu (décorateur expectedFailure) ; le message liste les défauts. Les tests « constat »
fixent les ordres de grandeur pour qu'une modification des données soit visible."""
import unittest

import _chemin  # noqa: F401
import modele as M

m = M.charger()


class InvariantsQuiEchouentAujourdhui(unittest.TestCase):
    @unittest.expectedFailure
    def test_une_competence_un_seul_niveau(self):
        ch = M.chevauchements(m, "actuel")
        self.assertEqual(ch, {}, f"{len(ch)} compétences exercées par plusieurs niveaux : " + ", ".join(sorted(ch)))

    @unittest.expectedFailure
    def test_un_seul_interlocuteur_public_par_demarche(self):
        d = {k: v["organismes"] for k, v in M.interlocuteurs(m, "actuel").items() if v["publics_obligatoires"] > 1}
        self.assertEqual(d, {})

    @unittest.expectedFailure
    def test_chaque_euro_a_un_payeur_et_un_receveur(self):
        nr = M.flux_non_rattaches(m)
        self.assertEqual(nr, [], f"{len(nr)} flux, {M.montant(nr):.1f} Md€ sans receveur identifié dans le grand livre")

    @unittest.expectedFailure
    def test_aucun_financement_croise(self):
        self.assertEqual(M.chevauchements_financiers(m), {})


class Constats(unittest.TestCase):
    def test_chevauchements_juridiques(self):
        n = len(M.chevauchements(m, "actuel"))
        total = len({a["competence"] for a in m["attributions"] if a["etat"] == "actuel"})
        print(f"\n[actuel] chevauchements juridiques : {n} compétences sur {total}")
        self.assertGreaterEqual(n, 30)

    def test_competences_partagees_par_la_loi(self):
        """L1111-4 du CGCT partage expressément culture, sport et tourisme entre communes, départements et régions."""
        ch = M.chevauchements(m, "actuel", {"partage"})
        for c in ("C38", "C39", "C40"):
            self.assertIn(c, ch)

    def test_interlocuteurs(self):
        d = M.interlocuteurs(m, "actuel")
        tot = sum(v["obligatoires"] for v in d.values())
        print(f"\n[actuel] {tot} interlocuteurs obligatoires pour {len(d)} démarches")
        self.assertGreater(tot, len(d))

    def test_france_services_ne_couvre_pas_tout(self):
        fs = M.france_services_actuel(m)
        self.assertIn(fs["D05"], ("partiel", "non"))  # MDPH : pas partenaire France services


if __name__ == "__main__":
    unittest.main()
