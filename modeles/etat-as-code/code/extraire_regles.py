# -*- coding: utf-8 -*-
"""Extrait des articles de codes depuis les XML locaux de codes.droit.org (base LEGI, Etalab 2.0).

Usage : python3 -I extraire_regles.py <dossier_codes> <liste_articles.csv> <sortie.csv>
liste_articles.csv (« ; ») : id_regle;code_fichier;num;objet
Sortie : id_regle;code;num;legiarti;version_du;modifie_par;etat;objet;nb_caracteres;extrait
L'extrait garde les 700 premiers caractères ; le texte complet reste dans le XML (champ legiarti pour le retrouver).
"""
import csv
import os
import re
import sys
import xml.etree.ElementTree as ET
from urllib.parse import quote


def index_articles(chemin_xml):
    """num -> (element article) pour les articles en vigueur d'un code."""
    racine = ET.parse(chemin_xml).getroot()
    nom = racine.get("nom", "")
    idx = {}
    for a in racine.iter("article"):
        if a.get("etat") == "VIGUEUR":
            idx[a.get("num")] = a
    return nom, idx


def texte_article(a):
    return re.sub(r"\s+", " ", " ".join(a.itertext())).strip()


def main(argv):
    dossier, liste, sortie = argv[1], argv[2], argv[3]
    demandes = list(csv.DictReader(open(liste, encoding="utf-8"), delimiter=";"))
    cache = {}
    lignes = []
    for d in demandes:
        f = d["code_fichier"]
        if f not in cache:
            cache[f] = index_articles(os.path.join(dossier, quote(f, safe="") + ".xml"))
        nom, idx = cache[f]
        a = idx.get(d["num"])
        if a is None:
            lignes.append({"id_regle": d["id_regle"], "code": nom, "num": d["num"], "legiarti": "", "version_du": "",
                           "modifie_par": "", "etat": "non trouvé en vigueur", "objet": d["objet"], "nb_caracteres": 0, "extrait": ""})
            continue
        t = texte_article(a)
        lignes.append({"id_regle": d["id_regle"], "code": nom, "num": d["num"], "legiarti": a.get("id", ""),
                       "version_du": a.get("date", ""), "modifie_par": a.get("modTitle", ""), "etat": "VIGUEUR",
                       "objet": d["objet"], "nb_caracteres": len(t), "extrait": t[:700]})
    champs = ["id_regle", "code", "num", "legiarti", "version_du", "modifie_par", "etat", "objet", "nb_caracteres", "extrait"]
    with open(sortie, "w", newline="", encoding="utf-8") as fo:
        w = csv.DictWriter(fo, fieldnames=champs, delimiter=";")
        w.writeheader()
        w.writerows(lignes)
    print(len(lignes), "articles,", sum(1 for x in lignes if x["etat"] != "VIGUEUR"), "non trouvés")


if __name__ == "__main__":
    main(sys.argv)
