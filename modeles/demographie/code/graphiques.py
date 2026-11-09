# -*- coding: utf-8 -*-
"""Graphiques statiques (matplotlib, non requis par le modele) a partir de sorties/demographie.json.
Usage : $DONNEES/.venv/bin/python code/graphiques.py"""
import json
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ICI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ICI, "..", "sorties", "graphiques")
j = json.load(open(os.path.join(ICI, "..", "sorties", "demographie.json"), encoding="utf-8"))
h = j["histoire"]["metropole"]
S = j["scenarios"]
plt.rcParams.update({"font.size": 10, "axes.spines.top": False, "axes.spines.right": False})

# 1. plus de 60 ans, histoire et projection
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(h["annees"], [v / 1e3 for v in h["60_plus"]], color="#1f4e79", lw=2, label="60 ans ou plus (métropole, observé)")
ax.plot(h["annees"], [v / 1e3 for v in h["total"]], color="#999999", lw=1.5, label="population totale (métropole)")
c = S["central"]
ax.plot(c["annees"], [v / 1e3 for v in c["60_plus_milliers"]], color="#1f4e79", lw=2, ls="--", label="60+ projeté, central (France)")
ax.plot(c["annees"], [v / 1e3 for v in c["total_milliers"]], color="#999999", lw=1.5, ls="--")
ax.axvline(2026, color="#cccccc", lw=1)
ax.set_xlim(1901, 2070)
ax.set_ylabel("millions de personnes")
ax.set_title("Plus de 60 ans : 9,7 M en 1975, 19,2 M en 2026 (métropole)")
ax.legend(frameon=False, loc="upper left", fontsize=8)
fig.text(0.01, 0.01, "Source : Insee (bilan démographique 2025 ; Insee Première 2108) ; calculs : modeles/demographie", fontsize=7, color="#666666")
fig.tight_layout(rect=(0, 0.03, 1, 1))
fig.savefig(os.path.join(OUT, "plus_de_60_ans.png"), dpi=110)

# 2. pyramides 1975 / 2026 / 2070 : on n'a que 2026 et 2050/2070 dans le json
fig, axes = plt.subplots(1, 3, figsize=(10, 4.5), sharey=True)
p26 = j["pyramide_2026"]
for ax, (titre, H, F) in zip(axes, [("2026 (observé)", p26["hommes"], p26["femmes"]),
                                    ("2050 (central)", S["central"]["pyramide_2050"]["hommes"], S["central"]["pyramide_2050"]["femmes"]),
                                    ("2070 (central)", S["central"]["pyramide_2070"]["hommes"], S["central"]["pyramide_2070"]["femmes"])]):
    ages = list(range(len(H)))
    ax.barh(ages, [-v / 1e3 for v in H], color="#2a6f97", height=1)
    ax.barh(ages, [v / 1e3 for v in F], color="#c1666b", height=1)
    ax.set_title(titre)
    ax.set_xlim(-600, 600)
    ax.set_xlabel("milliers")
axes[0].set_ylabel("âge")
fig.tight_layout()
fig.savefig(os.path.join(OUT, "pyramides.png"), dpi=110)

# 3. rapport de dependance
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(h["annees"], [100 * a / b for a, b in zip(h["65_plus"], h["20_64"])], color="#1f4e79", lw=2, label="observé (métropole)")
for nom, col in (("bas", "#999999"), ("central", "#c1666b"), ("haut", "#2a9d8f")):
    ax.plot(S[nom]["annees"], S[nom]["dependance_65_sur_20_64_pct"], color=col, lw=1.8, ls="--", label="projection " + nom)
ax.set_ylabel("personnes de 65 ans ou plus pour 100 de 20 à 64 ans")
ax.set_title("Rapport de dépendance démographique, 1901-2070")
ax.legend(frameon=False)
fig.text(0.01, 0.01, "Source : Insee ; modèle par composantes (modeles/demographie) ; scénarios bas/haut = population basse/haute Insee", fontsize=7, color="#666666")
fig.tight_layout(rect=(0, 0.03, 1, 1))
fig.savefig(os.path.join(OUT, "dependance.png"), dpi=110)
print("ok")
