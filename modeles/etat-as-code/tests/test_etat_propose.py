# -*- coding: utf-8 -*-
"""Tests de l'état proposé (scénario P1). Ils doivent passer ; ce qui reste ouvert est listé
(compétences « à arbitrer » déclarées dans competences.csv, organismes du recensement non rattachés)."""
import unittest

import _chemin  # noqa: F401
import modele as M

m = M.charger()
A_ARBITRER = set(M.a_arbitrer(m))


class Propose(unittest.TestCase):
    def test_une_competence_un_seul_responsable(self):
        orphelines, multiples = M.anomalies_responsables_propose(m)
        self.assertEqual(orphelines, [], "compétences sans responsable")
        self.assertEqual(multiples, {}, "compétences avec plusieurs responsables")

    def test_aucun_chevauchement(self):
        self.assertEqual(M.chevauchements(m, "propose"), {})

    def test_chaque_demarche_a_un_guichet_de_proximite(self):
        self.assertEqual(M.demarches_sans_guichet_proximite(m), [])

    def test_aucun_organisme_sans_competence(self):
        self.assertEqual(M.organismes_presents_sans_competence(m), [])

    def test_organismes_coherents_avec_les_attributions(self):
        self.assertEqual(M.incoherences_organismes(m), [])

    def test_suppressions_sans_competence_orpheline(self):
        orph = M.orphelines_apres_suppression(m)
        non_declarees = [(o, c) for o, c in orph if c not in A_ARBITRER]
        if orph:
            print(f"\n[propose] à arbitrer : {sorted({c for _, c in orph})} (organismes {sorted({o for o, _ in orph})})")
        self.assertEqual(non_declarees, [])

    def test_interlocuteurs_ne_augmentent_pas(self):
        a, p = M.interlocuteurs(m, "actuel"), M.interlocuteurs(m, "propose")
        pires = [d for d in a if p[d]["obligatoires"] > a[d]["obligatoires"]]
        self.assertEqual(pires, [])
        print(f"\n[propose] interlocuteurs obligatoires : {sum(v['obligatoires'] for v in a.values())} -> {sum(v['obligatoires'] for v in p.values())}")

    def test_les_tests_detectent_un_doublon(self):
        """Contrôle du contrôle : un second responsable ajouté à la main doit être détecté."""
        import copy
        m2 = copy.deepcopy(m)
        m2["attributions"].append({"etat": "propose", "competence": "C16", "niveau": "P-REG", "role": "responsable",
                                   "regles": "", "statut": "hypothèse", "source": "test", "note": ""})
        self.assertIn("C16", M.anomalies_responsables_propose(m2)[1])
        self.assertIn("C16", M.chevauchements(m2, "propose"))

    @unittest.expectedFailure
    def test_flux_tous_projetes(self):
        """Ce qui manque : flux dont un côté appartient à un niveau éclaté (département, opérateurs, caisses) ou inconnu."""
        reste = [f for f in M.flux_propose(m) if f["categorie"] in ("a_ventiler", "inconnu")]
        self.assertEqual(reste, [], f"{len(reste)} flux, {M.montant(reste):.1f} Md€ à ventiler ou inconnus")

    @unittest.expectedFailure
    def test_recensement_entierement_rattache(self):
        """Ce qui manque : organismes du recensement (instances.csv) gardés mais sans compétence dans le modèle."""
        manque = M.instances_gardees_sans_competence(m)
        self.assertEqual(manque, [], f"{len(manque)} organismes gardés sans compétence rattachée")


if __name__ == "__main__":
    unittest.main()
