# -*- coding: utf-8 -*-
"""Génère trajectoires_age_depart.js (constantes embarquées pour soutenabilite.js) : retraités, emploi et actifs quand l'âge effectif de départ monte de +1 ou +2 ans
par rapport à la trajectoire du COR (rampe linéaire 2027-2040, puis constant ; module emploi.py, H17 de prospective-demographie/METHODE.md), pour les trois scénarios démographiques
du palier 1 (bas = population jeune, central, haut = population âgée). Usage : python3 generer_age_depart.py (dans ce dossier). Déterministe."""
import json, os, sys
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, "..", "prospective-demographie"))
import modele as m
import emploi as e

CORR = {"bas": "population_jeune", "central": "central", "haut": "population_agee"}
pays = m.charger_pays("FR")
d = e.charger_emploi()
cal = e.calibrage(d, m.projeter_scenario(pays, m.INSEE_2026, m.jeu_combine("central"))[2025]["pop"])
out = {}
for cle, sc in CORR.items():
    etat = m.projeter_scenario(pays, m.INSEE_2026, m.jeu_combine(sc))
    out[cle] = {}
    for delta in (0, 1, 2):
        proj = e.projeter_emploi(d, etat, cal, age_depart=("rampe", float(delta)))
        out[cle]["a%d" % delta] = [[t, round(proj[t]["retraites_tous"]), round(proj[t]["emploi"]), round(proj[t]["actifs"])] for t in range(2025, 2071)]
src = ("/* Généré par generer_age_depart.py (ne pas éditer à la main). Colonnes : [année, retraités (COR, tous), emploi, actifs] quand l'âge effectif de départ monte de 0, 1 ou 2 ans (clés a0, a1, a2) par rapport au COR, rampe 2027-2040. */\n"
       "(function (root) { root.TrajectoiresAgeDepart = " + json.dumps({"colonnes": ["annee", "retraites", "emploi", "actifs"], "source": "prospective-demographie/emploi.py, chemin_age_depart('rampe')", "scenarios": out}, ensure_ascii=False, separators=(",", ":")) + "; })(this);\n")
open(os.path.join(ICI, "trajectoires_age_depart.js"), "w", encoding="utf-8").write(src)
print("ok", len(src), "octets")
