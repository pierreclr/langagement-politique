# -*- coding: utf-8 -*-
"""Index des fiches pratiques de service-public.gouv.fr (flux DILA « vosdroits », schéma 3.5).

Usage : python3 -I index_service_public.py <dossier_x_particuliers> <dossier_x_pro> <sortie.csv>
Extrait, pour chaque fiche F*.xml : identifiant, titre, guichets « Où s'adresser » (local / national),
« Qui peut m'aider » (dont France Services), services en ligne et formulaires Cerfa, textes de référence.
Fonctions pures + petite fonction main ; bibliothèque standard seulement. Données : licence Etalab 2.0 (DILA).
"""
import csv
import os
import re
import sys
import xml.etree.ElementTree as ET


def texte(e):
    return re.sub(r"\s+", " ", "".join(e.itertext())).strip() if e is not None else ""


def lire_fiche(chemin):
    racine = ET.parse(chemin).getroot()
    ns = {"dc": "http://purl.org/dc/elements/1.1/"}
    titre = texte(racine.find("dc:title", ns))
    ou = []
    for o in racine.iter("OuSAdresser"):
        t = texte(o.find("Titre"))
        piv = texte(o.find("PivotLocal"))
        ou.append(f"{t} [{o.get('type', '')}{':' + piv if piv else ''}]")
    aide = []
    for q in racine.iter("QuiPeutMAider"):
        aide.append(texte(q.find("Titre")) + (f" [{texte(q.find('PivotLocal'))}]" if q.find("PivotLocal") is not None else ""))
    services, cerfa = [], []
    for s in racine.iter("ServiceEnLigne"):
        typ = s.get("type", "")
        num = s.get("numerocerfa") or ""
        services.append(f"{texte(s.find('Titre'))} ({typ}{' ' + num if num else ''})")
        if num:
            cerfa.append(num)
    refs = [texte(r.find("Titre")) for r in racine.iter("Reference")]
    return {
        "id": racine.get("ID", ""),
        "titre": titre,
        "date_modif": racine.get("dateDerniereModificationImportante", "")[:10],
        "url": racine.get("spUrl", ""),
        "ou_s_adresser": " | ".join(dict.fromkeys(ou)),
        "qui_peut_aider": " | ".join(dict.fromkeys(aide)),
        "france_services": "oui" if any("france_services" in a for a in aide) else "non",
        "services_en_ligne": " | ".join(dict.fromkeys(services)),
        "cerfa": " | ".join(dict.fromkeys(cerfa)),
        "references": " | ".join(dict.fromkeys(refs)),
    }


def main(argv):
    lignes = []
    for audience, dossier in (("particuliers", argv[1]), ("professionnels", argv[2])):
        for nom in sorted(os.listdir(dossier)):
            if re.fullmatch(r"F\d+\.xml", nom):
                d = lire_fiche(os.path.join(dossier, nom))
                d["audience"] = audience
                lignes.append(d)
    champs = ["audience", "id", "titre", "date_modif", "url", "ou_s_adresser", "qui_peut_aider",
              "france_services", "services_en_ligne", "cerfa", "references"]
    with open(argv[3], "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=champs, delimiter=";")
        w.writeheader()
        w.writerows(lignes)
    print(len(lignes), "fiches")


if __name__ == "__main__":
    main(sys.argv)
