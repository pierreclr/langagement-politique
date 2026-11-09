# -*- coding: utf-8 -*-
"""Sommaire de tous les codes en vigueur (XML codes.droit.org, base LEGI) : une ligne par subdivision
de niveau 0 et 1 (livre, titre, partie), avec le nombre d'articles en vigueur qu'elle contient.
Usage : python3 -I modeles/carte-du-droit/sommaire.py  ->  modeles/carte-du-droit/sommaire.csv"""
import csv, sys, urllib.parse, xml.etree.ElementTree as ET
from pathlib import Path

SOURCE = Path.home() / "Documents/langagement-donnees/sources/legi/codes-droit-org"
SORTIE = Path(__file__).with_name("sommaire.csv")


def articles_en_vigueur(noeud):
    return sum(1 for a in noeud.iter("article") if a.get("etat") == "VIGUEUR")


def lignes_du_code(chemin):
    racine = ET.parse(chemin).getroot()
    code = racine.get("nom") or urllib.parse.unquote(chemin.stem)
    for t0 in racine.findall("t"):
        if t0.get("etat") not in (None, "VIGUEUR"):
            continue
        n0 = articles_en_vigueur(t0)
        if not n0:
            continue
        yield code, t0.get("title", ""), "", n0
        for t1 in t0.findall("t"):
            if t1.get("etat") not in (None, "VIGUEUR"):
                continue
            n1 = articles_en_vigueur(t1)
            if n1:
                yield code, t0.get("title", ""), t1.get("title", ""), n1


def main():
    fichiers = sorted(SOURCE.glob("*.xml"))
    total, n = 0, 0
    with open(SORTIE, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["id", "code", "niveau0", "niveau1", "articles_en_vigueur"])
        for chemin in fichiers:
            for code, a, b, k in lignes_du_code(chemin):
                n += 1
                w.writerow(["CD%05d" % n, code, a, b, k])
                if not b:
                    total += k
    print("%d codes, %d lignes, %d articles en vigueur" % (len(fichiers), n, total), file=sys.stderr)


if __name__ == "__main__":
    main()
