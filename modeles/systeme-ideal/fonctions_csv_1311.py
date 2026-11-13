# -*- coding: utf-8 -*-
"""Données des graphiques du chapitre 3 avec la fonction unique des revenus (décision du 13/11/2026, μ = 0,38),
personne seule qui paie un loyer (P = 877 €). Écrit sorties/fonction_revenus_1311.csv et sorties/taux_revenus_1311.csv.
Lancer : python3 -I modeles/systeme-ideal/fonctions_csv_1311.py"""
import math
import os

A, S, M0, K, MU, P = 0.6515, 412.5, 0.20, 1500.0, 0.38, 877.0
KP = (S + (A - M0) * K - P) / (A - MU)


def contribution(r):
    return A * r - P - (A - MU) * KP * (1 - math.exp(-r / KP))


def taux(r):
    return A - (A - MU) * math.exp(-r / KP)


def ecrire():
    ici = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sorties")
    revenus = list(range(0, 15001, 250))
    with open(os.path.join(ici, "fonction_revenus_1311.csv"), "w") as f:
        f.write("revenu,contribution,revenu_apres\n")
        for r in revenus:
            c = contribution(r)
            f.write("%d,%d,%d\n" % (r, round(c), round(r - c)))
    with open(os.path.join(ici, "taux_revenus_1311.csv"), "w") as f:
        f.write("revenu,taux_euro_suivant_pct,taux_moyen_pct\n")
        for r in revenus[1:]:
            c = contribution(r)
            f.write("%d,%.1f,%s\n" % (r, 100 * taux(r), ("%.1f" % (100 * c / r)) if c > 0 else ""))


if __name__ == "__main__":
    assert round(contribution(0)) == -877 and abs(taux(0) - 0.38) < 1e-12
    assert all(taux(r + 1) >= taux(r) for r in range(0, 20000, 50))   # le taux ne redescend jamais
    assert abs((contribution(20000) - A * 20000) - (-1090.0)) < 1.0    # même asymptote qu'avant
    ecrire()
    print("ok", round(KP))
