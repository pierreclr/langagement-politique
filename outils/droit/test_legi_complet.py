# -*- coding: utf-8 -*-
"""Tests de legi_complet.py (lancer : python3 -I outils/droit/test_legi_complet.py)."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import legi_complet as L  # noqa: E402


def xml(id_, num, etat, debut, fin, versions, code="LEGITEXT1", liens=""):
    vs = "".join(f'<VERSION etat="{e}"><LIEN_ART debut="{d}" etat="{e}" fin="{f}" id="{i}" num="{num}"/></VERSION>'
                 for i, e, d, f in versions)
    return (f'<ARTICLE><META><META_COMMUN><ID>{id_}</ID></META_COMMUN><META_SPEC><META_ARTICLE><NUM>{num}</NUM>'
            f'<ETAT>{etat}</ETAT><DATE_DEBUT>{debut}</DATE_DEBUT><DATE_FIN>{fin}</DATE_FIN></META_ARTICLE></META_SPEC></META>'
            f'<CONTEXTE><TEXTE cid="{code}" nature="CODE"><TITRE_TXT c_titre_court="Code test" id_txt="{code}">Code test</TITRE_TXT></TEXTE></CONTEXTE>'
            f'<VERSIONS>{vs}</VERSIONS><LIENS>{liens}</LIENS></ARTICLE>').encode()


def ligne(id_, num, etat, debut, fin, versions, code="LEGITEXT1", liens=()):
    return {"id": id_, "num": num, "etat": etat, "debut": debut, "fin": fin, "versions": versions,
            "code_cid": code, "code_nom": "Code test", "liens": list(liens)}


class TestParse(unittest.TestCase):
    def test_article_de_code(self):
        a = L.parse_article(xml("A2", "L1", "VIGUEUR", "2010-01-01", "2999-01-01",
                                [("A1", "MODIFIE", "2000-01-01", "2010-01-01"), ("A2", "VIGUEUR", "2010-01-01", "2999-01-01")],
                                liens='<LIEN typelien="CITATION" sens="source" id="X">c</LIEN><LIEN typelien="ABROGATION" sens="source" id="Y" cidtexte="T" num="3">Loi</LIEN>'))
        self.assertEqual(a["num"], "L1")
        self.assertEqual(len(a["versions"]), 2)
        self.assertEqual([l["typelien"] for l in a["liens"]], ["ABROGATION"])  # citations écartées

    def test_hors_code_ignore(self):
        self.assertIsNone(L.parse_article(xml("A", "1", "VIGUEUR", "2010-01-01", "2999-01-01", [], code="JORFTEXT1")))
        self.assertIsNone(L.parse_article(b"<pas du xml"))


class TestIndex(unittest.TestCase):
    def test_cid_plus_ancienne_version(self):
        v = [["B", "VIGUEUR", "2010-01-01", "2999-01-01"], ["A", "MODIFIE", "2000-01-01", "2010-01-01"]]
        self.assertEqual(L.cid_de(v, "B"), "A")
        self.assertEqual(L.cid_de([], "Z"), "Z")

    def test_etat_resume(self):
        e = L.etat_resume
        self.assertEqual(e("VIGUEUR", "2000-01-01", "2999-01-01"), "vigueur")
        self.assertEqual(e("VIGUEUR", "2000-01-01", "2020-01-01"), "abroge")
        self.assertEqual(e("ABROGE", "2000-01-01", "2020-01-01"), "abroge")
        self.assertEqual(e("MODIFIE", "2000-01-01", "2020-01-01"), "modifie")
        self.assertEqual(e("VIGUEUR_DIFF", "2999-01-01", "2999-01-01"), "futur")
        # abrogation programmée : encore en vigueur aujourd'hui (CPP : 2 538 articles « ABROGE_DIFF » au 2029-01-01)
        self.assertEqual(e("ABROGE_DIFF", "2011-08-12", "2029-01-01"), "vigueur")
        self.assertEqual(e("ABROGE", "2000-01-01", "2029-01-01"), "abroge")

    def test_agreger_vigueur_et_abroge(self):
        vig = [ligne("A1", "L1", "MODIFIE", "2000-01-01", "2010-01-01", [["A1", "MODIFIE", "2000-01-01", "2010-01-01"], ["A2", "VIGUEUR", "2010-01-01", "2999-01-01"]]),
               ligne("A2", "L1", "VIGUEUR", "2010-01-01", "2999-01-01", [["A1", "MODIFIE", "2000-01-01", "2010-01-01"], ["A2", "VIGUEUR", "2010-01-01", "2999-01-01"]]),
               ligne("B1", "L2", "ABROGE", "2000-01-01", "2015-06-30", [["B1", "ABROGE", "2000-01-01", "2015-06-30"]])]
        idx = L.agreger_par_cid(vig)
        self.assertEqual(idx["A1"]["statut"], "vigueur")
        self.assertEqual(idx["A1"]["id_vigueur"], "A2")
        self.assertEqual(idx["B1"]["statut"], "abroge")
        self.assertEqual(idx["B1"]["date_abrogation"], "2015-06-30")

    def test_numero_repris_sans_lien(self):
        idx = L.agreger_par_cid([
            ligne("B1", "L2", "ABROGE", "2000-01-01", "2015-06-30", [["B1", "ABROGE", "2000-01-01", "2015-06-30"]]),
            ligne("C1", "L2", "VIGUEUR", "2015-07-01", "2999-01-01", [["C1", "VIGUEUR", "2015-07-01", "2999-01-01"]])])
        L.marquer_renumerotes(idx)
        self.assertEqual(idx["B1"]["statut"], "numero_repris")
        self.assertEqual(idx["B1"]["remplacant_cid"], "C1")
        self.assertEqual(idx["C1"]["statut"], "vigueur")

    def test_lien_legi_meme_numero_vaut_numero_repris(self):
        lien = {"typelien": "CODIFIE", "sens": "cible", "id": "LEGIARTI_N1", "cidtexte": "LEGITEXT1", "num": "L2", "texte": ""}
        idx = L.agreger_par_cid([
            ligne("B1", "L2", "ABROGE", "2000-01-01", "2015-06-30", [["B1", "ABROGE", "2000-01-01", "2015-06-30"]], liens=[lien]),
            ligne("LEGIARTI_N1", "L2", "VIGUEUR", "2015-07-01", "2999-01-01", [["LEGIARTI_N1", "VIGUEUR", "2015-07-01", "2999-01-01"]])])
        L.marquer_renumerotes(idx)
        self.assertEqual(idx["B1"]["statut"], "numero_repris")

    def test_renumerote_par_lien_legi(self):
        lien = {"typelien": "CODIFIE", "sens": "cible", "id": "LEGIARTI_N1", "cidtexte": "LEGITEXT2", "num": "R5", "texte": ""}
        idx = L.agreger_par_cid([
            ligne("B1", "R1", "ABROGE", "2000-01-01", "2015-06-30", [["B1", "ABROGE", "2000-01-01", "2015-06-30"]], liens=[lien]),
            ligne("LEGIARTI_N1", "R5", "VIGUEUR", "2015-07-01", "2999-01-01", [["LEGIARTI_N1", "VIGUEUR", "2015-07-01", "2999-01-01"]], code="LEGITEXT2")])
        L.marquer_renumerotes(idx)
        self.assertEqual(idx["B1"]["statut"], "renumerote")
        self.assertEqual(idx["B1"]["remplacant_cid"], "LEGIARTI_N1")

    def test_classer_cible(self):
        idx = L.agreger_par_cid([ligne("B1", "L2", "ABROGE", "2000-01-01", "2015-06-30", [["B1", "ABROGE", "2000-01-01", "2015-06-30"]])])
        ids = {"B1": "B1"}
        self.assertEqual(L.classer_cible("B1", "B1", "X", idx, ids)["etat"], "abroge")
        self.assertEqual(L.classer_cible("B1", "B1", "X", idx, ids)["date_abrogation"], "2015-06-30")
        self.assertEqual(L.classer_cible("ZZ", "ZZ", "X", idx, ids)["etat"], "inexistant")


class TestComparaison(unittest.TestCase):
    def test_tronque(self):
        c = L.comparer_codes({"C1": 4000, "C2": 100, "C3": 50}, {"C1": 130, "C2": 100})
        t = {l["code_cid"]: l for l in c}
        self.assertTrue(t["C1"]["tronque"])
        self.assertFalse(t["C2"]["tronque"])
        self.assertTrue(t["C3"]["tronque"])  # absent de codes.droit.org
        self.assertEqual(L.codes_tronques(c), {"C1"})  # C3 : absent, pas « tronqué »
        self.assertEqual(c[0]["code_cid"], "C1")  # trié par écart décroissant


if __name__ == "__main__":
    unittest.main()
