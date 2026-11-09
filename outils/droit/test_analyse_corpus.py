# -*- coding: utf-8 -*-
"""Tests de analyse_corpus.py (lancer : python3 -I outils/droit/test_analyse_corpus.py)."""
import datetime as dt
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import analyse_corpus as A  # noqa: E402

LIEN = ('<a href="/affichCodeArticle.do?cidTexte={code}&amp;idArticle={cid}&amp;dateTexte=&amp;categorieLien=cid" '
        'type="article-internal" destinationid="{dest}">article {num}</a>')


def art(id_, num, texte, date="2010-01-01", mod="Loi n°2010-1 du 1 janvier 2010 - art. 1 JORF 2 janvier 2010 en vigueur le 3 janvier 2010", etat="VIGUEUR"):
    return (f'<article id="{id_}" cid="{id_}" num="{num}" etat="{etat}" modTitle="{mod}" date="{date}">{texte}</article>')


def lien(cid, num, code="LEGITEXT1"):
    return LIEN.format(code=code, cid=cid, dest=cid, num=num)


def code_xml(articles, nom="Code test", id_="LEGITEXT1"):
    return (f'<code nom="{nom}" id="{id_}" lastup="2026-01-01"><t niveau="0" title="Partie : A" id="S1" etat="VIGUEUR">'
            + "".join(articles) + "</t></code>")


def charger(xml):
    with tempfile.TemporaryDirectory() as d:
        p = Path(d) / "c.xml"
        p.write_text(xml, encoding="utf8")
        return [a for a in A.iter_articles(p) if not isinstance(a, tuple)]


class Tests(unittest.TestCase):
    def test_norm_num_et_dates(self):
        self.assertEqual(A.norm_num("L. 123-4 bis"), "l123-4bis")
        self.assertEqual(A.date_fr("JORF x en vigueur le 1er janvier 2001"), dt.date(2001, 1, 1))
        self.assertEqual(A.date_jorf("JORF 16 juin 2000 en vigueur"), dt.date(2000, 6, 16))

    def test_renvoi_mort_et_vivant(self):
        arts = charger(code_xml([
            art("A1", "1", "Voir " + lien("A2", "2") + " et " + lien("ZZ", "9") + "."),
            art("A2", "2", "Texte."),
        ]))
        idx = A.construire_index(arts)
        morts = A.renvois_morts(arts, idx)
        self.assertEqual(len(morts), 1)
        self.assertEqual(morts[0]["cible_cid"], "ZZ")
        self.assertEqual(morts[0]["confiance"], "haute")

    def test_numero_reutilise(self):
        arts = charger(code_xml([art("A1", "1", "Voir " + lien("OLD", "2") + "."), art("A2", "2", "x")]))
        morts = A.renvois_morts(arts, A.construire_index(arts))
        self.assertTrue(morts[0]["numero_reutilise"])
        self.assertNotEqual(morts[0]["confiance"], "haute")

    def test_code_incomplet_ignore(self):
        arts = charger(code_xml([art("A1", "1", "Voir " + lien("X", "60", code="LEGITEXT000006071570") + ".")]))
        idx = A.construire_index(arts)
        idx["codes"]["LEGITEXT000006071570"] = "Code des douanes"
        self.assertEqual(A.renvois_morts(arts, idx), [])

    def test_composantes_et_chaine(self):
        g = {"a": {"b"}, "b": {"a", "c"}, "c": {"d"}, "d": set()}
        comps = A.composantes(g)
        self.assertEqual([sorted(c) for c in comps], [["a", "b"]])
        ch = A.plus_longue_chaine({"x": {"y"}, "y": {"z"}, "z": set(), "w": {"z"}})
        self.assertEqual([n for n, _ in ch[0]], ["x", "y", "z"])

    def test_cycle_de_report(self):
        arts = charger(code_xml([
            art("A1", "1", "Dans les conditions prévues à l'article " + lien("A2", "2") + "."),
            art("A2", "2", "Dans les conditions prévues à l'article " + lien("A1", "1") + "."),
        ]))
        idx = A.construire_index(arts)
        g, derog, differe = A.graphe(arts, idx)
        self.assertEqual(len(A.cycles_de_report(g, differe)), 1)

    def test_derogation_detectee(self):
        arts = charger(code_xml([art("A1", "1", "Par dérogation à l'article " + lien("A2", "2") + ", x."), art("A2", "2", "y")]))
        _, derog, _ = A.graphe(arts, A.construire_index(arts))
        self.assertIn("A2", derog["A1"])

    def test_decret_sans_application(self):
        def sec(i, *a):
            return f'<t niveau="1" title="Chapitre {i} : Titre {i}" id="S{i}" etat="VIGUEUR">' + "".join(a) + "</t>"
        dec = "Un décret en Conseil d'État fixe les conditions d'application du présent article."
        xml = ('<code nom="C" id="LEGITEXT1" lastup="2026-01-01">'
               + sec(1, art("L1", "L111-1", dec)) + sec(2, art("L2", "L222-1", dec)) + sec(3, art("R1", "R222-1", "Règle."))
               + sec(4, art("R0", "R999-1", "Autre.")) + sec(5, art("L3", "L999-1", "Texte.")) + "</code>")
        arts = charger(xml)
        out = A.decrets_sans_application(arts)
        self.assertEqual([o["article"] for o in out], ["L111-1"])

    def test_montants(self):
        arts = charger(code_xml([
            art("A1", "1", "Une amende de 3 750 euros.", date="2005-01-01"),
            art("A2", "2", "Un montant de 2760 francs (420,76 euros).", date="2005-01-01"),
            art("A3", "3", "Lorsque l'article L. 311-1 franchit un seuil.", date="2005-01-01"),
        ]))
        out = A.montants_figes(arts, dt.date(2026, 11, 2))
        types = sorted((o["article"], o["type"]) for o in out)
        self.assertIn(("1", "euro_fige"), types)
        self.assertIn(("2", "franc_en_vigueur"), types)
        self.assertFalse([t for t in types if t[0] == "3"])

    def test_dates(self):
        arts = charger(code_xml([
            art("A1", "1", "x", date="2001-01-05", mod="Loi JORF 5 janvier 2001 en vigueur le 1er janvier 2000"),
            art("A2", "2", "x"),
        ]))
        out = A.dates_incoherentes(arts, dt.date(2026, 11, 2))
        self.assertEqual([o["article"] for o in out], ["1"])
        self.assertEqual(out[0]["motif"], "entree_en_vigueur_avant_publication_JO")

    def test_legi_distingue_faux_mort_abroge_renumerote_inexistant(self):
        """Avec l'index LEGI : vigueur = faux mort (l'article existe, c'est la version citée qui a changé) ; abrogé daté ; renuméroté ; inexistant."""
        import legi_complet as LC
        cible = lambda c, n: lien(c, n, code="LEGITEXT2")
        arts = charger(code_xml([art("A1", "1", " ".join(
            cible(c, "9") for c in ("TRONQUE", "ABR", "REN", "NULLE")) + ".")]))
        idx = A.construire_index(arts)
        v = lambda i, e, d, f, num: dict(id=i, num=num, etat=e, debut=d, fin=f, code_cid="LEGITEXT2", code_nom="Code B",
                                         versions=[[i, e, d, f]], liens=[])
        legi = LC.marquer_renumerotes(LC.agreger_par_cid([
            v("TRONQUE", "VIGUEUR", "2000-01-01", "2999-01-01", "L9"),
            v("ABR", "ABROGE", "2000-01-01", "2015-06-30", "L10"),
            v("REN", "ABROGE", "2000-01-01", "2012-01-01", "L11"),
            v("NOUV", "VIGUEUR", "2012-01-02", "2999-01-01", "L11")]))
        ids = {i: c for c, f in legi.items() for i in f["ids"]}
        stats = {}
        morts = A.renvois_morts(arts, idx, legi, ids, {"LEGITEXT2"}, stats)
        par = {m["cible_cid"]: m for m in morts}
        self.assertNotIn("TRONQUE", par)
        self.assertEqual(stats["faux_morts_vivants_dans_legi"], 1)
        self.assertEqual(par["ABR"]["etat_legi"], "abroge")
        self.assertEqual(par["ABR"]["date_abrogation"], "2015-06-30")
        self.assertEqual(par["REN"]["etat_legi"], "numero_repris")  # sans lien LEGI : numéro repris
        self.assertEqual(par["NULLE"]["etat_legi"], "inexistant")
        self.assertTrue(par["ABR"]["code_cible_tronque"])

    def test_legi_repli_par_numero(self):
        import legi_complet as LC
        arts = charger(code_xml([art("A1", "1", "Voir " + lien("INCONNU", "L10", code="LEGITEXT2") + ".")]))
        idx = A.construire_index(arts)
        legi = LC.marquer_renumerotes(LC.agreger_par_cid([dict(
            id="ABR", num="L10", etat="ABROGE", debut="2000-01-01", fin="2015-06-30", code_cid="LEGITEXT2",
            code_nom="Code B", versions=[["ABR", "ABROGE", "2000-01-01", "2015-06-30"]], liens=[])]))
        ids = {i: c for c, f in legi.items() for i in f["ids"]}
        morts = A.renvois_morts(arts, idx, legi, ids, set(), {}, A.index_par_numero(legi))
        self.assertEqual(morts[0]["etat_legi"], "abroge")
        self.assertEqual(morts[0]["date_abrogation"], "2015-06-30")
        self.assertTrue(morts[0]["via_numero"])

    def test_tableaux_conserves(self):
        """Non-régression 04/11/2026 : l'article garde son tableau, cellules non collées."""
        a = charger(code_xml(['<article id="T1" cid="T1" num="777" date="2000-01-01" etat="VIGUEUR">'
                              '<p>Barème :</p><center><table><tr><td>8 072</td><td>5</td></tr>'
                              '<tr><td>12 109</td><td>20</td></tr></table></center></article>']))[0]
        self.assertEqual(a["mots"], 8)  # « Barème : » 8 072 5 12 109 20
        import xml.etree.ElementTree as ET
        texte, _ = A.aplatir(ET.fromstring('<article><table><tr><td>8 072</td> <td>5</td></tr></table></article>'))
        self.assertNotIn("8 0725", texte)


if __name__ == "__main__":
    unittest.main(verbosity=1)
