#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compte des articles et des mots en vigueur des codes fiscaux et sociaux (indicateur de simplicité, chantier 8).

Source : copies codes.droit.org (XML Légifrance/DILA) dans $DONNEES/sources/legi/codes-droit-org/.
Un article est compté s'il a etat="VIGUEUR". Les mots = jetons séparés par des espaces dans le texte de l'article.
Pour le CGI, ventilation par Livre / Partie / Titre (niveaux 0 à 2) et par chapitre du Titre premier de la 1re partie.
Usage : python3 -I sources/calculs/complexite_codes_fiscaux.py
Python 3.9, bibliothèque standard seule. Des ordres de grandeur : la structure des XML est celle de codes.droit.org."""
import sys
import xml.etree.ElementTree as ET
from collections import OrderedDict
from pathlib import Path
from urllib.parse import quote

DOSSIER = Path.home() / "Documents/langagement-donnees/sources/legi/codes-droit-org"
CODES = [
    "Code général des impôts",
    "Code général des impôts, annexe I",
    "Code général des impôts, annexe II",
    "Code général des impôts, annexe III",
    "Code général des impôts, annexe IV",
    "Livre des procédures fiscales",
    "Code de la sécurité sociale",
    "Code des impositions sur les biens et services",
    "Code des douanes",
    "Code général des collectivités territoriales",
]


def compter(noeud, chemin, sortie, prof_max):
    """Parcourt récursivement ; ajoute (articles, mots) à chaque niveau de titre jusqu'à prof_max."""
    na = nm = 0
    for enfant in noeud:
        if enfant.tag == "article":
            if enfant.get("etat") == "VIGUEUR":
                texte = "".join(enfant.itertext())
                na += 1
                nm += len(texte.split())
        elif enfant.tag == "t":
            a, m = compter(enfant, chemin + [enfant.get("title", "")], sortie, prof_max)
            na += a
            nm += m
    if noeud.tag == "t" and len(chemin) <= prof_max:
        sortie[tuple(chemin)] = (na, nm)
    return na, nm


def main():
    print("Articles et mots en vigueur (copies codes.droit.org, lues le 03/11/2026)\n")
    print(f"{'Code':55s} {'articles':>9s} {'mots':>11s}")
    total_a = total_m = 0
    detail_cgi = None
    for nom in CODES:
        f = DOSSIER / (quote(nom, safe=",") + ".xml")
        if not f.exists():
            f = DOSSIER / (quote(nom) + ".xml")
        if not f.exists():
            print(f"{nom:55s} introuvable")
            continue
        racine = ET.parse(f).getroot()
        sortie = OrderedDict()
        a, m = compter(racine, [], sortie, 4)
        print(f"{nom:55s} {a:9d} {m:11d}")
        if nom == "Code général des impôts":
            detail_cgi = sortie
        if not nom.startswith("Code général des collectivités"):
            total_a += a
            total_m += m
    print(f"{'Total hors CGCT':55s} {total_a:9d} {total_m:11d}\n")
    if detail_cgi:
        print("CGI : ventilation (Livre / Partie / Titre / Chapitre), articles en vigueur, mots")
        for ch, (a, m) in detail_cgi.items():
            if 1 <= len(ch) <= 4 and a:
                print(f"{'  ' * (len(ch) - 1)}{' > '.join(c[:60] for c in ch[-1:])}: {a} art., {m} mots")


if __name__ == "__main__":
    sys.exit(main())
