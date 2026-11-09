#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de outils/droit/registre.py : python3 -I outils/droit/test_registre.py"""
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import registre as r  # noqa: E402

FICHE = """---
id: AN999
titre: Essai
categorie: renvoi mort
gravite: faible
statut: détectée
article: X 1
version: 2026
lien: https://exemple.org
---

# AN999

## Texte et article

a

## Constat vérifiable

b

## Cas concret

c

## Test reproductible

d

## Gravité

e

## Correction proposée

f

## Objection ou interprétation contraire

g
"""


class TestRegistre(unittest.TestCase):
    def ecrire(self, texte, nom="AN999.md"):
        d = Path(tempfile.mkdtemp())
        p = d / nom
        p.write_text(texte, encoding="utf-8")
        return p

    def test_fiche_complete(self):
        self.assertEqual(r.verifier_fiche(r.lire_fiche(self.ecrire(FICHE))), [])

    def test_champ_manquant(self):
        p = self.ecrire(FICHE.replace("gravite: faible\n", ""))
        self.assertTrue(any("gravite" in m for m in r.verifier_fiche(r.lire_fiche(p))))

    def test_section_vide(self):
        p = self.ecrire(FICHE.replace("## Cas concret\n\nc\n", "## Cas concret\n\n"))
        self.assertTrue(any("Cas concret" in m for m in r.verifier_fiche(r.lire_fiche(p))))

    def test_gravite_et_statut_inconnus(self):
        p = self.ecrire(FICHE.replace("faible", "énorme").replace("détectée", "rêvée"))
        pb = " ".join(r.verifier_fiche(r.lire_fiche(p)))
        self.assertIn("gravité inconnue", pb)
        self.assertIn("statut inconnu", pb)

    def test_id_different_du_fichier(self):
        p = self.ecrire(FICHE, nom="AN998.md")
        self.assertTrue(any("id" in m for m in r.verifier_fiche(r.lire_fiche(p))))

    def test_normalisation(self):
        self.assertEqual(r.norm("L’ article  X"), "l' article x")

    def test_index_trie_par_gravite(self):
        f1 = r.lire_fiche(self.ecrire(FICHE))
        f2 = r.lire_fiche(self.ecrire(FICHE.replace("AN999", "AN001").replace("faible", "haute"), "AN001.md"))
        idx = r.construire_index([f1, f2])
        self.assertLess(idx.index("[AN001]"), idx.index("[AN999]"))
        self.assertIn("**2 anomalies actives**", idx)

    def test_classement_par_defaut_anomalie(self):
        self.assertEqual(r.classement(r.lire_fiche(self.ecrire(FICHE))), "anomalie")

    def test_classement_inconnu_ou_sans_motif(self):
        p = self.ecrire(FICHE.replace("statut: détectée\n", "statut: détectée\nclassement: rêvé\n"))
        self.assertIn("classement inconnu", " ".join(r.verifier_fiche(r.lire_fiche(p))))
        p = self.ecrire(FICHE.replace("statut: détectée\n", "statut: détectée\nclassement: écartée\n"))
        self.assertIn("sans motif-classement", " ".join(r.verifier_fiche(r.lire_fiche(p))))

    def test_classement_valide_avec_motif(self):
        for c in ("choix politique", "écartée"):
            p = self.ecrire(FICHE.replace("statut: détectée\n", "statut: détectée\nclassement: %s\nmotif-classement: raison\n" % c))
            self.assertEqual(r.verifier_fiche(r.lire_fiche(p)), [])

    def test_index_et_decomptes_par_classement(self):
        def fiche(i, cl):
            t = FICHE.replace("AN999", i)
            if cl != "anomalie":
                t = t.replace("statut: détectée\n", "statut: détectée\nclassement: %s\nmotif-classement: raison %s\n" % (cl, i))
            return r.lire_fiche(self.ecrire(t, i + ".md"))
        fs = [fiche("AN001", "anomalie"), fiche("AN002", "choix politique"), fiche("AN003", "écartée")]
        idx = r.construire_index(fs)
        self.assertIn("**1 anomalies actives** (hors 1 choix politiques et 1 fiches écartées)", idx)
        self.assertIn("## Choix politiques", idx)
        self.assertNotIn("[AN003]", idx)
        ec = r.construire_ecartees(fs)
        self.assertIn("[AN003]", ec)
        self.assertIn("raison AN003", ec)
        self.assertNotIn("AN002", ec)


if __name__ == "__main__":
    unittest.main()
