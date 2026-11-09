# -*- coding: utf-8 -*-
"""Tests du flux législatif : python3 -I -m unittest discover -s modeles/flux-legislatif/tests"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "code"))
import flux  # noqa: E402
import extraire  # noqa: E402
import comparer  # noqa: E402


def V(id_, num, etat, debut, fin, mots=10, code="C1", versions=None, liens=None):
    return {"id": id_, "num": num, "etat": etat, "debut": debut, "fin": fin, "code_cid": code,
            "code_nom": "Code test", "mots": mots, "versions": versions or [], "liens": liens or []}


class Partie(unittest.TestCase):
    def test_prefixes(self):
        self.assertEqual(flux.partie("L1221-1"), "L")
        self.assertEqual(flux.partie("LO 141"), "L")
        self.assertEqual(flux.partie("R*123-4"), "R")
        self.assertEqual(flux.partie("D. 12"), "D")
        self.assertEqual(flux.partie("A121-1"), "A")
        self.assertEqual(flux.partie("1649 quater"), "autre")
        self.assertEqual(flux.partie("Annexe"), "autre")


class Versions(unittest.TestCase):
    def test_validite(self):
        self.assertTrue(flux.version_valide(V("a", "L1", "VIGUEUR", "2010-01-01", "2999-01-01")))
        self.assertFalse(flux.version_valide(V("a", "L1", "MODIFIE_MORT_NE", "2010-01-01", "2011-01-01")))
        self.assertFalse(flux.version_valide(V("a", "L1", "VIGUEUR", "2999-01-01", "2999-01-01")))
        self.assertFalse(flux.version_valide(V("a", "L1", "MODIFIE", "2010-01-01", "2010-01-01")))

    def test_en_vigueur_bornes(self):
        v = V("a", "L1", "ABROGE", "2010-01-01", "2012-01-01")
        self.assertTrue(flux.en_vigueur(v, "2010-01-01"))
        self.assertTrue(flux.en_vigueur(v, "2011-12-31"))
        self.assertFalse(flux.en_vigueur(v, "2012-01-01"))


VS = [["a1", "MODIFIE", "2005-01-01", "2009-01-01"], ["a2", "ABROGE", "2009-01-01", "2015-06-01"]]


class Evenements(unittest.TestCase):
    def setUp(self):
        self.vs = [V("a1", "L10", "MODIFIE", "2005-01-01", "2009-01-01", 100, versions=VS),
                   V("a2", "L10", "ABROGE", "2009-01-01", "2015-06-01", 130, versions=VS)]

    def test_chaine_et_evenements(self):
        ch = flux.chaines(self.vs)
        self.assertEqual(list(ch), ["a1"])
        ev = flux.evenements(ch["a1"])
        self.assertEqual([e["type"] for e in ev], ["creation", "modification", "abrogation"])
        self.assertEqual([e["mots"] for e in ev], [100, 30, -130])
        self.assertEqual(sum(e["mots"] for e in ev), 0)  # cycle complet : solde nul

    def test_coupure_date(self):
        ch = flux.chaines(self.vs)
        ev = flux.evenements(ch["a1"], jusqua="2010-01-01")
        self.assertEqual([e["type"] for e in ev], ["creation", "modification"])

    def test_mort_ne_ignore(self):
        vs = self.vs + [V("a3", "L10", "MODIFIE_MORT_NE", "2008-01-01", "2008-06-01", versions=VS)]
        self.assertEqual(len(flux.chaines(vs)["a1"]), 2)

    def test_recodification(self):
        """Ancien article abrogé le jour où le nouveau naît, avec lien de concordance : recodification."""
        lien = lambda i: [{"typelien": "CONCORDE", "id": i, "cidtexte": "LEGITEXT1"}]
        vieux = V("LEGIARTIo1", "L121-1", "ABROGE", "1990-01-01", "2008-05-01", 50, versions=[["LEGIARTIo1", "ABROGE", "1990-01-01", "2008-05-01"]], liens=lien("LEGIARTIn1"))
        neuf = V("LEGIARTIn1", "L1221-1", "VIGUEUR", "2008-05-01", "2999-01-01", 50, versions=[["LEGIARTIn1", "VIGUEUR", "2008-05-01", "2999-01-01"]], liens=lien("LEGIARTIo1"))
        ch = flux.chaines([vieux, neuf])
        v2c = {v["id"]: k for k, vs in ch.items() for v in vs}
        ev_n = flux.evenements(ch["LEGIARTIn1"], v2c, ch)
        ev_o = flux.evenements(ch["LEGIARTIo1"], v2c, ch)
        self.assertTrue(ev_n[0]["recodif"])
        self.assertTrue([e for e in ev_o if e["type"] == "abrogation"][0]["recodif"])
        # sans lien : vraie création
        seul = V("x1", "L9", "VIGUEUR", "2008-05-01", "2999-01-01", versions=[["x1", "VIGUEUR", "2008-05-01", "2999-01-01"]])
        ch2 = flux.chaines([seul])
        self.assertFalse(flux.evenements(ch2["x1"], {"x1": "x1"}, ch2)[0]["recodif"])
        # lien CODIFICATION : versement dans le code d'un droit existant (ordonnance de codification)
        cod = V("y1", "R1", "VIGUEUR", "2007-01-01", "2999-01-01", versions=[["y1", "VIGUEUR", "2007-01-01", "2999-01-01"]],
                liens=[{"typelien": "CODIFICATION", "sens": "source", "id": "JORFTEXT9", "cidtexte": "JORFTEXT9"}])
        ch3 = flux.chaines([cod])
        e = flux.evenements(ch3["y1"], {"y1": "y1"}, ch3)[0]
        self.assertTrue(e["recodif"] and e["codif"])


class Codification(unittest.TestCase):
    def test_cas_reels(self):
        cod_cgfp = {"typelien": "CODIFICATION", "texte": "Ordonnance n°2021-1574 du 24 novembre 2021", "cidtexte": "JORFTEXT000044368600"}
        cre_cgfp = {"typelien": "CREATION", "texte": "Ordonnance n°2021-1574 du 24 novembre 2021 - art.", "cidtexte": "JORFTEXT000044368600"}
        self.assertTrue(flux.est_codification([cod_cgfp, cre_cgfp]))
        cod_casf = {"typelien": "CODIFICATION", "texte": "Ordonnance 2000-1249 2000-12-21", "cidtexte": ""}
        cre_loi = {"typelien": "CREATION", "texte": "Loi n°2007-293 du 5 mars 2007 - art. 22", "cidtexte": "JORFTEXT000000823100"}
        self.assertFalse(flux.est_codification([cod_casf, cre_loi]))
        self.assertTrue(flux.est_codification([{"typelien": "CODIFICATION", "texte": "Décret 2004-802 2004-07-29"}]))
        self.assertFalse(flux.est_codification([cre_loi]))


class Mandats(unittest.TestCase):
    def test_bornes(self):
        self.assertEqual(flux.mandat_de("2007-05-15"), "Chirac 2")
        self.assertEqual(flux.mandat_de("2007-05-16"), "Sarkozy")
        self.assertEqual(flux.mandat_de("2022-05-14"), "Macron 2")
        self.assertEqual(flux.mandat_de("2001-01-01"), "")
        self.assertEqual(flux.mandat_de("2027-01-01"), "")


class Agregation(unittest.TestCase):
    def test_solde_stock_egal_flux(self):
        """Le stock final moins le stock initial égale créations - retraits (articles et mots)."""
        vs = [V("a1", "L1", "MODIFIE", "2003-01-01", "2008-01-01", 10, versions=[["a1", "", "2003-01-01", ""], ["a2", "", "2008-01-01", ""]]),
              V("a2", "L1", "ABROGE", "2008-01-01", "2010-01-01", 25, versions=[["a1", "", "2003-01-01", ""], ["a2", "", "2008-01-01", ""]]),
              V("b1", "R1", "VIGUEUR", "2009-01-01", "2999-01-01", 7, versions=[["b1", "", "2009-01-01", ""]]),
              V("c1", "D1", "VIGUEUR", "2001-01-01", "2999-01-01", 3, versions=[["c1", "", "2001-01-01", ""]])]
        ch = flux.chaines(vs)
        evts = [e for k in ch for e in flux.evenements(ch[k])]
        d0, d1 = "2002-06-01", "2012-01-01"
        dans = [e for e in evts if d0 <= e["date"] < d1]
        agg = flux.agreger_evenements(dans, lambda e: "t")["t"]
        s0, s1 = flux.stock(ch, d0)["total"], flux.stock(ch, d1)["total"]
        self.assertEqual(s1["articles"] - s0["articles"],
                         agg.get("creations", 0) - agg.get("abrogations", 0) - agg.get("transferts", 0))
        self.assertEqual(s1["mots"] - s0["mots"],
                         agg.get("mots_crees", 0) + agg.get("mots_modifies", 0) - agg.get("mots_abroges", 0))


class Jorf(unittest.TestCase):
    def test_categories(self):
        self.assertEqual(flux.categorie_jorf("LOI", "LOI n° 2010-1 autorisant l'approbation de l'accord ..."), "loi_art53")
        self.assertEqual(flux.categorie_jorf("LOI", "LOI n° 2016-1088 relative au travail"), "loi")
        self.assertEqual(flux.categorie_jorf("DECRET", "Décret du 3 mai 2010 portant nomination du préfet"), "decret_individuel")
        self.assertEqual(flux.categorie_jorf("DECRET", "Décret n° 2010-1 relatif aux conditions de ..."), "decret_reglementaire")
        self.assertEqual(flux.categorie_jorf("ARRETE", "Arrêté du ..."), "autre")


class Extraction(unittest.TestCase):
    def test_mots(self):
        xml = (b"<ARTICLE><META><META_COMMUN><ID>LEGIARTI1</ID></META_COMMUN></META>"
               b"<BLOC_TEXTUEL>\n<CONTENU>\n<p>Le salari&#233; a droit<br/>\xc3\xa0 un cong\xc3\xa9.</p></CONTENU></BLOC_TEXTUEL></ARTICLE>")
        self.assertEqual(extraire.mots_du_xml(xml), ("LEGIARTI1", 7))

    def test_sans_texte(self):
        self.assertEqual(extraire.mots_du_xml(b"<ARTICLE><ID>X</ID></ARTICLE>"), ("X", 0))

    def test_categorie(self):
        self.assertEqual(extraire.categorie_du_chemin("legi/global/code_et_TNC_en_vigueur/code_en_vigueur/LEGI/TEXT/x.xml"), "code")
        self.assertEqual(extraire.categorie_du_chemin("legi/global/code_et_TNC_non_vigueur/TNC_non_vigueur/JORF/x.xml"), "tnc")

    def test_meta_jorf(self):
        x = b"<TEXTE_VERSION><META><META_COMMUN><ID>JORFTEXT1</ID><NATURE>LOI</NATURE></META_COMMUN><DATE_PUBLI>2016-08-09</DATE_PUBLI><TITREFULL>LOI n\xc2\xb0 2016-1088</TITREFULL>"
        d = extraire.meta_jorf(x)
        self.assertEqual((d["id"], d["nature"], d["date_publi"]), ("JORFTEXT1", "LOI", "2016-08-09"))


class Comparaison(unittest.TestCase):
    def test_ecart(self):
        self.assertEqual(comparer.ecart_relatif(110, 100), 10.0)
        self.assertIsNone(comparer.ecart_relatif(5, 0))
        self.assertIsNone(comparer.ecart_relatif(5, ""))


if __name__ == "__main__":
    unittest.main()
