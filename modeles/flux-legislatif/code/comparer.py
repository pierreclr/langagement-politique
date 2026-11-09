#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Comparaison avec les indicateurs du SGG (édition du 4 mai 2026) : stock codifié, quatre codes, lois et décrets.

Référence : references/sgg_indicateurs_2026.csv, transcrit à la main des graphiques et tableaux du PDF
« Indicateurs de suivi de l'activité normative » (Secrétariat général du Gouvernement, 4 mai 2026, pages 7,
21, 28 à 31, 33 et 35 ; cote A).  Stocks du SGG : à une « date anniversaire » de début d'année ; les nôtres :
au 1er janvier.  Flux du SGG (lois, décrets) : année civile de publication.

Fonctions pures : ecart_relatif, comparer_lignes.  E/S : main -> resultats/comparaison_sgg.csv.
"""
from __future__ import annotations

import csv
import sys
from pathlib import Path

ICI = Path(__file__).resolve().parent.parent


def ecart_relatif(nous: float, reference: float):
    """(nous - référence) / référence, arrondi à 0,1 % ; None si la référence manque ou est nulle."""
    if reference in (None, "", 0):
        return None
    return round(100 * (float(nous) - float(reference)) / float(reference), 1)


def comparer_lignes(stock: dict, codes: dict, jorf: dict, ref: list) -> list:
    """stock / codes : {annee: ligne de stock_annuel.csv / stock_codes_suivis_sgg.csv} ; jorf : {annee: ligne}."""
    out = []
    for r in ref:
        a = r["annee"]
        s, c, j = stock.get(f"{a}-01-01"), codes.get(f"{a}-01-01"), jorf.get(a)
        if not s:
            continue
        l = {"annee": a}
        l["articles_codifies_sgg"] = int(r["codifie_articles_legislatifs"]) + int(r["codifie_articles_reglementaires"])
        l["articles_codifies_nous"] = int(s["articles_total"])
        l["ecart_articles_pct"] = ecart_relatif(l["articles_codifies_nous"], l["articles_codifies_sgg"])
        l["mots_codifies_sgg"] = int(r["codifie_mots_legislatifs"]) + int(r["codifie_mots_reglementaires"])
        l["mots_codifies_nous"] = int(s["mots_total"])
        l["ecart_mots_pct"] = ecart_relatif(l["mots_codifies_nous"], l["mots_codifies_sgg"])
        if c:
            for n in ("CCH", "environnement", "urbanisme", "CGCT"):
                l[f"ecart_articles_{n}_pct"] = ecart_relatif(c[f"articles_{n}"], r[f"articles_{n}"])
                l[f"ecart_mots_{n}_pct"] = ecart_relatif(c[f"mots_{n}"], r[f"mots_{n}"])
        if j and r["lois_hors_art53_promulguees"]:
            l["lois_sgg"] = int(r["lois_hors_art53_promulguees"])
            l["lois_nous"] = int(j["loi"] or 0)
            l["decrets_reglementaires_sgg"] = int(r["decrets_reglementaires_publies"])
            l["decrets_reglementaires_nous"] = int(j["decret_reglementaire"] or 0)
            l["ecart_decrets_pct"] = ecart_relatif(l["decrets_reglementaires_nous"], l["decrets_reglementaires_sgg"])
        out.append(l)
    return out


def _lire(p: Path, cle: str) -> dict:
    with open(p, encoding="utf-8") as f:
        return {r[cle]: r for r in csv.DictReader(f)}


def main() -> int:
    res = ICI / "resultats"
    with open(ICI / "references/sgg_indicateurs_2026.csv", encoding="utf-8") as f:
        ref = list(csv.DictReader(f))
    lignes = comparer_lignes(_lire(res / "stock_annuel.csv", "date"), _lire(res / "stock_codes_suivis_sgg.csv", "date"),
                             _lire(res / "jorf_par_annee.csv", "annee"), ref)
    champs = []
    for l in lignes:
        for k in l:
            if k not in champs:
                champs.append(k)
    with open(res / "comparaison_sgg.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=champs)
        w.writeheader()
        w.writerows(lignes)
    for l in lignes:
        print(l["annee"], l["articles_codifies_nous"], l["articles_codifies_sgg"], l["ecart_articles_pct"],
              l["mots_codifies_nous"], l["mots_codifies_sgg"], l["ecart_mots_pct"],
              l.get("lois_nous"), l.get("lois_sgg"), l.get("decrets_reglementaires_nous"), l.get("decrets_reglementaires_sgg"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
