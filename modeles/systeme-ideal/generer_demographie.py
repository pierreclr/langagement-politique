# -*- coding: utf-8 -*-
"""Génère trajectoires_demo.js (constantes embarquées pour demographie.js, sans dépendance) à partir de
../prospective-demographie/trajectoires.csv (population par grands âges, Insee 2026) et de ../prospective-demographie/emploi.py
(emploi et retraités calés sur le COR). Usage : python3 generer_demographie.py (dans ce dossier). Déterministe.
Scénarios : favorable = population_jeune, central = central, defavorable = population_agee (jeu Insee 2026)."""
import csv, json, os, sys
ICI = os.path.dirname(os.path.abspath(__file__))
DEMO = os.path.join(ICI, "..", "prospective-demographie")
sys.path.insert(0, DEMO)
import modele as m
import emploi as e

CORR = {"bas": "population_jeune", "central": "central", "haut": "population_agee"}
traj = {}
for r in csv.DictReader(open(os.path.join(DEMO, "trajectoires.csv"), encoding="utf-8")):
    if r["jeu_hypotheses"] == "insee2026":
        traj[(r["scenario"], int(r["annee"]))] = r
pays = m.charger_pays("FR")
d = e.charger_emploi()
cal = e.calibrage(d, m.projeter_scenario(pays, m.INSEE_2026, m.jeu_combine("central"))[2025]["pop"])
out = {}
for cle, sc in CORR.items():
    proj = e.projeter_emploi(d, m.projeter_scenario(pays, m.INSEE_2026, m.jeu_combine(sc)), cal)
    out[cle] = {"scenario_insee": sc, "annees": []}
    for t in range(2025, 2071):
        r = traj[(sc, t)]
        out[cle]["annees"].append([t, int(r["moins_20_ans"]), int(r["20_64_ans"]), int(r["65_ans_plus"]),
                                   round(proj[t]["retraites_tous"]), round(proj[t]["emploi"]), round(proj[t]["actifs"])])
src = ("/* Généré par generer_demographie.py (ne pas éditer à la main). Colonnes : [année, moins de 20 ans, 20-64 ans, 65 ans et plus, retraités (COR, tous), emploi, actifs]. */\n"
       "(function (root) { root.TrajectoiresDemo = " + json.dumps({"colonnes": ["annee", "moins20", "p20_64", "p65plus", "retraites", "emploi", "actifs"], "source": "insee2026 + COR (emploi.py)", "scenarios": out}, ensure_ascii=False, separators=(",", ":")) + "; })(this);\n")
open(os.path.join(ICI, "trajectoires_demo.js"), "w", encoding="utf-8").write(src)
print("ok", len(src), "octets")
