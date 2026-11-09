#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Chiffres de sources/plan-de-bascule.md, § 3 (recettes pendant la transition, taux de la dette).
Fonctions pures, hypothèses numérotées. Des ordres de grandeur, jamais des prédictions.
Entrées reprises (liens dans le document) : modeles/systeme-ideal/resultats-options-financement.txt, sources/calculs/cout_sortie_ue.py."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from cout_sortie_ue import surcout_interets, DETTE_MAASTRICHT_2025_MD, pib_france_md  # noqa: E402

DEFICIT_2024 = -169.1            # Md€, Insee 2024
PIB_2024 = 2935.0                # Md€, Insee 2024
SOLDE_PALIER1 = {"bas": -119.8, "central": -163.3, "haut": -235.7}      # régime de croisière (options-financement)
SOLDE_AN1_SOCLE250 = {"bas": -14.3, "central": -54.3, "haut": -121.4}   # année 1, socle 250 €, taux 35 %, statique
GAIN_PAR_POINT = {"central": 12.6, "haut": 7.3}                       # taux plat 35 -> 36 % (a1) ; bas non utilisé
GAIN_SOCLE_100E = {"central": 43.5, "haut": 45.6}                     # socle 500 -> 400 € (b2) : +43,5 central ; 235,7-190,1 = 45,6 haut
EMISSIONS_2026 = 310.0           # Md€, ⚠️ non relu (recherche-euro-francais.md)
TAUX_MARGINAL_H = 0.035          # H-B1 : taux d'emprunt marginal supposé (OAT 10 ans ~3,45 % début 2026)

def pct_pib(x):
    return 100 * x / PIB_2024

def main():
    print("== Δ solde par rapport au droit actuel (solde − déficit 2024 de −169,1)")
    for sc, v in SOLDE_PALIER1.items():
        d = v - DEFICIT_2024
        print(f"  croisière {sc:8s}: solde {v:7.1f} Md€ ({pct_pib(v):5.1f} % du PIB) ; Δ = {d:+6.1f} Md€")
    for sc, v in SOLDE_AN1_SOCLE250.items():
        d = v - DEFICIT_2024
        print(f"  année 1 socle 250 € {sc:8s}: solde {v:7.1f} ({pct_pib(v):5.1f} %) ; Δ = {d:+6.1f}")
    print("\n== Écart de taux sur la charge de la dette (dette Maastricht fin 2025, durée moyenne 8 ans ⚠️)")
    for pb in (-50, 50, 100):
        a1, plein = surcout_interets(DETTE_MAASTRICHT_2025_MD, pb, 8)
        print(f"  {pb:+4d} pb : année 1 {a1:+5.1f} Md€ ; régime plein {plein:+6.1f} Md€/an")
    print("\n== Besoin de financement supplémentaire au haut (Δ négatif = dette en plus)")
    d_haut = SOLDE_PALIER1['haut'] - DEFICIT_2024
    print(f"  Δ haut = {d_haut:.1f} Md€/an = {100 * -d_haut / EMISSIONS_2026:.0f} % des émissions 2026 (⚠️ 310)")
    print(f"  intérêts de cette dette supplémentaire à {100 * TAUX_MARGINAL_H:.1f} % : {-d_haut * TAUX_MARGINAL_H:.1f} Md€ la 1re année ; cumul sur 5 ans (sans autre action) : dette +{-5 * d_haut:.0f} Md€, intérêts de la 5e année {-5 * d_haut * TAUX_MARGINAL_H:.1f} Md€")
    print("\n== Leviers de sauvegarde au haut")
    print(f"  taux plat : {GAIN_PAR_POINT['haut']:.1f} Md€ par point au haut -> {-d_haut / GAIN_PAR_POINT['haut']:.1f} points pour fermer Δ")
    print(f"  taux plat : {GAIN_PAR_POINT['central']:.1f} Md€ par point au central")
    eur = -d_haut / GAIN_SOCLE_100E['haut'] * 100
    print(f"  socle : {GAIN_SOCLE_100E['haut']:.1f} Md€ par 100 €/mois au haut -> {eur:.0f} € de baisse (socle ≈ {500 - eur:.0f} €), linéaire ⚠️")
    print("\n== Recette perdue en un an par un choc de confiance")
    for pb in (50, 100):
        a1, plein = surcout_interets(DETTE_MAASTRICHT_2025_MD, pb, 8)
        print(f"  +{pb} pb = {pct_pib(plein):.2f} % du PIB en régime plein ; = {plein / 12.6:.1f} points de taux plat au central")

if __name__ == "__main__":
    main()
