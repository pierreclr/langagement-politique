#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Produit `resultats.md` (qui fait foi) à partir de `erosion.py`.

Usage, depuis la racine de l'atelier :
  python3 -I modeles/erosion-capital/code/rapport.py > modeles/erosion-capital/resultats.md
"""
import os
import sys
from dataclasses import replace

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from erosion import (REGIMES, SCENARIOS, decomposition, simuler,  # noqa: E402
                     taux_effectif_transmission)

W0_ILLUSTRATIF = 121.2e9   # HER16 : ordre de grandeur, classement Challenges 2026 (fortune familiale)
ENFANTS_G1_ILLUSTRATIF = 5  # HER17 : nombre d'enfants, fait public
G = 6
ORDRE = ["sans_impot", "actuel_commun", "actuel_dutreil", "actuel_dutreil_790",
         "systeme_transmissions", "systeme_complet", "usa_simplifie"]


def pct(x):
    if x == 0:
        return "0"
    if x >= 0.0995:
        return f"{x * 100:,.0f} %".replace(",", " ")
    if x >= 1e-5:
        return f"{x * 100:.2g} %".replace(".", ",")
    return "< 0,001 %"


def md(x):
    """Montant en euros lisible."""
    if x >= 1e9:
        return f"{x / 1e9:,.1f} Md€".replace(",", " ").replace(".", ",")
    if x >= 1e6:
        return f"{x / 1e6:,.0f} M€".replace(",", " ")
    return f"{x / 1e3:,.0f} k€".replace(",", " ")


def params_illustratif(sc):
    return replace(SCENARIOS[sc], enfants_g1=ENFANTS_G1_ILLUSTRATIF)


def main():
    out = []
    w = out.append
    w("# Érosion du capital sur plusieurs générations : résultats")
    w("")
    w("> Produit par `code/rapport.py` (fait foi ; ne pas éditer à la main). Euros constants. "
      "Ordres de grandeur sous les hypothèses HER1 à HER18 de `methode.md`, jamais des prédictions. "
      "Le cas illustratif applique des règles fiscales à un montant public ; il ne dit rien des intentions "
      "ni de l'organisation réelle d'une famille. « bas » = érosion forte, « haut » = persistance forte.")
    w("")

    # 1. Cas illustratif, central, tous régimes
    p = params_illustratif("central")
    w(f"## 1. Cas illustratif, scénario central : {md(W0_ILLUSTRATIF)} transmis à {ENFANTS_G1_ILLUSTRATIF} enfants, "
      f"puis {p.enfants_suite:g} enfants par descendant")
    w("")
    w("Part de la fortune initiale détenue par **un descendant moyen** juste après sa propre succession "
      "(espérance sur les chemins de déclin). Génération 1 = enfants.")
    w("")
    w("| régime | " + " | ".join(f"G{g}" for g in range(1, G + 1)) + " |")
    w("|---|" + "---:|" * G)
    for k in ORDRE:
        res = simuler(W0_ILLUSTRATIF, G, REGIMES[k], p)
        w(f"| {REGIMES[k].nom} | " + " | ".join(pct(x["part_descendant"]) for x in res) + " |")
    w("")
    w("Mêmes résultats en euros constants, par descendant :")
    w("")
    w("| régime | " + " | ".join(f"G{g}" for g in range(1, G + 1)) + " |")
    w("|---|" + "---:|" * G)
    for k in ORDRE:
        res = simuler(W0_ILLUSTRATIF, G, REGIMES[k], p)
        w(f"| {REGIMES[k].nom} | " + " | ".join(md(x["part_descendant"] * W0_ILLUSTRATIF) for x in res) + " |")
    w("")
    res = simuler(W0_ILLUSTRATIF, G, REGIMES["sans_impot"], p)
    w("Nombre de descendants par génération : " + ", ".join(f"G{x['generation']} = {x['descendants']:g}" for x in res) + ".")
    w("")
    w("**Part familiale totale** (somme sur tous les descendants de la génération), central :")
    w("")
    w("| régime | " + " | ".join(f"G{g}" for g in range(1, G + 1)) + " |")
    w("|---|" + "---:|" * G)
    for k in ORDRE:
        res = simuler(W0_ILLUSTRATIF, G, REGIMES[k], p)
        w(f"| {REGIMES[k].nom} | " + " | ".join(pct(x["part_famille"]) for x in res) + " |")
    w("")

    # 2. Bas / central / haut à G4
    w("## 2. Quatrième génération (arrière-petits-enfants), bas / central / haut")
    w("")
    w("| régime | descendant : bas / central / haut | famille : bas / central / haut | descendant, en € (central) | P(descendant ≥ 1 % de W0), central |")
    w("|---|---|---|---:|---:|")
    for k in ORDRE:
        r = {sc: simuler(W0_ILLUSTRATIF, 4, REGIMES[k], params_illustratif(sc))[-1] for sc in SCENARIOS}
        w(f"| {REGIMES[k].nom} | " + " / ".join(pct(r[sc]["part_descendant"]) for sc in ("bas", "central", "haut"))
          + " | " + " / ".join(pct(r[sc]["part_famille"]) for sc in ("bas", "central", "haut"))
          + f" | {md(r['central']['part_descendant'] * W0_ILLUSTRATIF)} | {r['central']['proba_au_moins_1pc'] * 100:.0f} % |")
    w("")
    w("Descendants à G4 : bas 5 × 3³ = 135 ; central 5 × 2³ = 40 ; haut 5 × 1,6³ ≈ 20.")
    w("")

    # 3. Sixième génération bas / central / haut
    w("## 3. Sixième génération (≈ 150 ans après la première transmission), bas / central / haut")
    w("")
    w("| régime | descendant : bas / central / haut | famille : bas / central / haut | descendant en part de l'économie (central) |")
    w("|---|---|---|---:|")
    for k in ORDRE:
        r = {sc: simuler(W0_ILLUSTRATIF, 6, REGIMES[k], params_illustratif(sc))[-1] for sc in SCENARIOS}
        w(f"| {REGIMES[k].nom} | " + " / ".join(pct(r[sc]["part_descendant"]) for sc in ("bas", "central", "haut"))
          + " | " + " / ".join(pct(r[sc]["part_famille"]) for sc in ("bas", "central", "haut"))
          + f" | {pct(r['central']['part_descendant_economie'])} |")
    w("")
    w("« En part de l'économie » : divisé par la croissance réelle cumulée (1,2 %/an, HER15), soit ×6,0 en 150 ans.")
    w("")

    # 4. Décomposition
    w("## 4. Ce qui érode : décomposition à G4 (cas illustratif, central)")
    w("")
    w("| étape | part de W0 par descendant à G4 |")
    w("|---|---:|")
    for nom, v in decomposition(W0_ILLUSTRATIF, 4, params_illustratif("central")):
        w(f"| {nom} | {pct(v)} |")
    w("")

    # 5. Taux effectifs d'une transmission
    w("## 5. Taux effectif d'une transmission (part perdue en droits), central")
    w("")
    w("| patrimoine transmis | enfants | " + " | ".join(REGIMES[k].nom for k in ORDRE[1:]) + " |")
    w("|---:|---:|" + "---:|" * (len(ORDRE) - 1))
    pc = SCENARIOS["central"]
    for pat, n in ((W0_ILLUSTRATIF, 5), (1e9, 2), (100e6, 2), (10e6, 2)):
        w(f"| {md(pat)} | {n} | " + " | ".join(pct(taux_effectif_transmission(pat, n, REGIMES[k], pc)) for k in ORDRE[1:]) + " |")
    w("")
    w(f"Part des titres sous Dutreil au central : {pc.part_entreprise:g} × {pc.part_eligible_dutreil:g} = "
      f"{pc.part_entreprise * pc.part_eligible_dutreil:g} du patrimoine (HER4, HER9)".replace(".", ",") + ".")
    w("")

    # 6. Cas générique
    w("## 6. Cas générique (même nombre d'enfants à chaque génération), G4, bas / central / haut")
    w("")
    w("| régime | descendant | famille |")
    w("|---|---|---|")
    for k in ORDRE:
        r = {sc: simuler(1e9, 4, REGIMES[k], SCENARIOS[sc])[-1] for sc in SCENARIOS}
        w(f"| {REGIMES[k].nom} | " + " / ".join(pct(r[sc]["part_descendant"]) for sc in ("bas", "central", "haut"))
          + " | " + " / ".join(pct(r[sc]["part_famille"]) for sc in ("bas", "central", "haut")) + " |")
    w("")
    w("Fortune initiale de 1 Md€ (les parts dépendent peu du montant au-delà de quelques dizaines de M€).")
    print("\n".join(out))


if __name__ == "__main__":
    main()
