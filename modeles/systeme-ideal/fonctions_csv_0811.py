#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Courbes des trois fonctions du système arrêté du 08/11/2026, en CSV, pour les graphiques du manifeste.

Paramètres : couches DECISIONS0811 et CORRECTION0811 (a = 0,6515 après la correction du double compte du différé, 0,6733 avant ; patrimoine v7.5 ; courbe des pensions k = 0,4179).
Usage : python3 -I modeles/systeme-ideal/fonctions_csv_0811.py
"""
import csv
import math
import os

A, S, M0, K = 0.6515, 412.5, 0.20, 1500.0
SORTIES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sorties")


def contribution_revenus(r):
    """C(R), €/mois : négatif = l'État verse."""
    return A * r - S - (A - M0) * K * (1 - math.exp(-r / K))


def contribution_patrimoine(w):
    """P(W), €/an, part du patrimoine dans la courbe (hors résidence principale sous 1 M€)."""
    return 0.03 * w * w / (w + 400000.0)


def courbe_pensions(p, k=0.4179):
    """C_p(P), €/mois, rien sous 2 000 € nets."""
    x = p - 2000.0
    return 0.0 if x <= 0 else k * (x - K * (1 - math.exp(-x / K)))


def taux_marginal_revenus(r):
    """C'(R) = a - (a - m0) e^(-R/K) : part prélevée sur l'euro suivant."""
    return A - (A - M0) * math.exp(-r / K)


def taux_marginal_patrimoine(w):
    """P'(W) = 3 % (W^2 + 2 K W) / (W + K)^2, K = 400 000 €."""
    return 0.03 * (w * w + 800000.0 * w) / (w + 400000.0) ** 2


def taux_marginal_pensions(p, k=0.4179):
    """C_p'(P) = k (1 - e^(-(P - 2000)/K)), nul sous 2 000 €."""
    x = p - 2000.0
    return 0.0 if x <= 0 else k * (1 - math.exp(-x / K))


ABATTEMENT_TRANSMISSIONS, K_TRANSMISSIONS, PLAFOND_TRANSMISSIONS = 300000.0, 100000.0, 0.50


def contribution_transmissions(cumul):
    """Droits sur le cumul reçu au cours d'une vie : 50 % (x - K ln(1 + x/K)), x = cumul - 300 000 €."""
    x = cumul - ABATTEMENT_TRANSMISSIONS
    return 0.0 if x <= 0 else PLAFOND_TRANSMISSIONS * (x - K_TRANSMISSIONS * math.log(1 + x / K_TRANSMISSIONS))


def taux_marginal_transmissions(cumul):
    """tau(x) = 50 % x / (x + K) au-delà de l'abattement."""
    x = cumul - ABATTEMENT_TRANSMISSIONS
    return 0.0 if x <= 0 else PLAFOND_TRANSMISSIONS * x / (x + K_TRANSMISSIONS)


def pct(x):
    return round(100 * x, 1)


def ecrire(nom, entetes, lignes):
    with open(os.path.join(SORTIES, nom), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(entetes)
        w.writerows(lignes)


if __name__ == "__main__":
    os.makedirs(SORTIES, exist_ok=True)
    ecrire("fonction_revenus_0811.csv", ["revenu", "contribution", "revenu_apres"],
           [(r, round(contribution_revenus(r)), round(r - contribution_revenus(r))) for r in range(0, 15001, 250)])
    ecrire("fonction_patrimoine_0811.csv", ["patrimoine", "contribution_annuelle", "taux_moyen_pct"],
           [(w, round(contribution_patrimoine(w)), round(100 * contribution_patrimoine(w) / w, 2) if w else 0)
            for w in range(0, 5000001, 100000)])
    ecrire("courbe_pensions_0811.csv", ["pension", "contribution", "pension_apres"],
           [(p, round(courbe_pensions(p)), round(p - courbe_pensions(p))) for p in range(1000, 8001, 100)])
    assert round(contribution_revenus(2000)) == 392 and round(contribution_revenus(10000)) == 5426
    assert round(courbe_pensions(3000)) == 113 and round(courbe_pensions(4000)) == 374

    # --- Taux sur l'euro suivant et taux moyens (graphiques de « Comprendre les fonctions ») ---
    ecrire("taux_revenus_0811.csv", ["revenu", "taux_euro_suivant_pct", "taux_moyen_pct"],
           [(r, pct(taux_marginal_revenus(r)), pct(contribution_revenus(r) / r) if contribution_revenus(r) > 0 else "")
            for r in range(0, 15001, 250) if r])  # taux moyen laissé vide tant que l'État verse (il serait négatif)
    ecrire("taux_patrimoine_0811.csv", ["patrimoine", "taux_euro_suivant_pct", "taux_moyen_pct"],
           [(w, round(100 * taux_marginal_patrimoine(w), 2), round(100 * contribution_patrimoine(w) / w, 2))
            for w in range(100000, 5000001, 100000)])
    ecrire("taux_pensions_0811.csv", ["pension", "taux_euro_suivant_pct", "taux_moyen_pct"],
           [(p, pct(taux_marginal_pensions(p)), pct(courbe_pensions(p) / p)) for p in range(2000, 10001, 100)])
    ecrire("taux_transmissions_0811.csv", ["cumul_recu", "taux_euro_suivant_pct", "taux_moyen_pct"],
           [(c, pct(taux_marginal_transmissions(c)), pct(contribution_transmissions(c) / c))
            for c in range(300000, 5000001, 100000)])

    # Valeurs citées dans le texte (chapitre 3, « Comprendre les fonctions »)
    assert pct(taux_marginal_revenus(0)) == 20.0 and pct(taux_marginal_revenus(1000)) == 42.0
    assert pct(taux_marginal_revenus(2000)) == 53.2 and pct(taux_marginal_revenus(5000)) == 63.5
    assert pct(taux_marginal_revenus(10000)) == 65.1
    assert pct(contribution_revenus(2000) / 2000) == 19.6 and pct(contribution_revenus(3000) / 3000) == 31.9
    assert pct(contribution_revenus(10000) / 10000) == 54.3
    assert round(contribution_revenus(1000)) == -91 and round(contribution_revenus(1500)) == 137
    assert round(contribution_revenus(3000)) == 956 and round(contribution_revenus(5000)) == 2192
    assert round(-contribution_revenus(0)) == 412 and round(S + (A - M0) * K) == 1090  # asymptote : C ~ a R - 1 090
    assert round(K * math.log(2)) == 1040 and pct(taux_marginal_revenus(K * math.log(2))) == 42.6
    assert pct(taux_marginal_revenus(K)) == 48.5
    lo, hi = 0.0, 3000.0
    for _ in range(80):
        mid = (lo + hi) / 2
        lo, hi = (lo, mid) if contribution_revenus(mid) > 0 else (mid, hi)
    assert round(hi) == 1208
    assert round(-K * math.log((A - 0.5) / (A - M0))) == 1638  # le taux sur l'euro suivant passe 50 %
    assert round(-K * math.log((A - 0.6) / (A - M0))) == 3256  # puis 60 %

    def c_rev(r, a=A, s=S, m0=M0, k=K):
        return a * r - s - (a - m0) * k * (1 - math.exp(-r / k))
    assert [round(c_rev(r, a=A + 0.01) - c_rev(r)) for r in (2000, 10000)] == [9, 85]
    assert [round(c_rev(r, s=S + 50) - c_rev(r)) for r in (2000, 10000)] == [-50, -50]
    assert [round(c_rev(r, m0=0.25) - c_rev(r)) for r in (2000, 10000)] == [55, 75]
    assert [round(c_rev(r, k=2000.0) - c_rev(r)) for r in (2000, 10000)] == [-72, -221]

    assert round(contribution_patrimoine(300000)) == 3857 and round(100 * contribution_patrimoine(300000) / 300000, 2) == 1.29
    assert round(contribution_patrimoine(1e6)) == 21429 and round(contribution_patrimoine(1e7)) == 288462
    assert round(100 * taux_marginal_patrimoine(100000), 2) == 1.08 and round(100 * taux_marginal_patrimoine(300000), 2) == 2.02
    assert round(100 * taux_marginal_patrimoine(1e6), 2) == 2.76 and round(100 * taux_marginal_patrimoine(1e7), 2) == 3.00
    assert round(100 * contribution_patrimoine(1e5) / 1e5, 2) == 0.60 and round(contribution_patrimoine(2e6)) == 50000

    assert [round(courbe_pensions(p)) for p in (2500, 3000, 4000, 5000, 8000)] == [31, 113, 374, 712, 1892]
    assert [pct(taux_marginal_pensions(p)) for p in (2500, 3000, 4000, 10000)] == [11.8, 20.3, 30.8, 41.6]
    assert pct(courbe_pensions(3000) / 3000) == 3.8 and pct(courbe_pensions(5000) / 5000) == 14.2

    assert round(contribution_transmissions(500000)) == 45069 and round(contribution_transmissions(1e6)) == 246028
    assert round(contribution_transmissions(1e7)) == 4620752 and contribution_transmissions(300000) == 0
    assert pct(taux_marginal_transmissions(400000)) == 25.0 and pct(taux_marginal_transmissions(1e6)) == 43.8
    assert pct(taux_marginal_transmissions(1e7)) == 49.5 and pct(contribution_transmissions(1e6) / 1e6) == 24.6
    assert pct(contribution_transmissions(1e7) / 1e7) == 46.2
    assert pct(courbe_pensions(4000) / 4000) == 9.4 and pct(1 - taux_marginal_revenus(2000)) == 46.8
    assert pct(1 - A) == 34.9 and pct(1 - 0.4179) == 58.2          # ce qu'il reste au moins sur chaque euro de plus
    assert round((A - M0) * 500) == 226                              # écart limite quand K gagne 500 €
    assert round(100 * contribution_patrimoine(400000) / 400000, 2) == 1.5   # moitié de t_inf à W0 = 400 000 €
    assert round((taux_marginal_revenus(K) - M0) / (A - M0), 3) == 0.632     # part de la montée faite à R = K
    # Ordres de grandeur de recette lus dans les résultats (`resultats_correction_0811.txt`, ligne « bornes des nouvelles lignes de la couche 0811 » :
    # F = 29,20 Md€ pour a = 0,6471 ; F = 47,27 Md€ pour a = 0,6670) et dans la courbe des pensions (9,00 Md€ pour k = 0,4179, linéaire en k)
    assert round((47.27 - 29.20) / (0.6670 - 0.6471) / 100, 1) == 9.1        # Md€ par an pour +0,01 de a
    assert round(9.00 * 0.01 / 0.4179, 2) == 0.22 and round(9.00 * (0.50 / 0.4179 - 1), 2) == 1.77  # Md€ pour +0,01 de k ; plafond 0,50
    print("ok")
