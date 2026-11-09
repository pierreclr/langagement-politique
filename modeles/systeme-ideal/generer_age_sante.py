# -*- coding: utf-8 -*-
"""Génère trajectoires_age.js (constantes embarquées pour age_sante.js, sans dépendance) : population par âge simple (0 à 100 ans, sexes confondus)
et espérance de vie à 65 ans (moyenne hommes-femmes, table de période) pour 2025-2070, dans les trois scénarios démographiques de demographie.js
(bas = population_jeune, central, haut = population_agee, jeu Insee 2026), produites par ../prospective-demographie/modele.py (même moteur que
trajectoires_demo.js). Usage : python3 generer_age_sante.py (dans ce dossier). Déterministe."""
import json, os, sys
ICI = os.path.dirname(os.path.abspath(__file__))
DEMO = os.path.join(ICI, "..", "prospective-demographie")
sys.path.insert(0, DEMO)
import modele as m

CORR = {"bas": "population_jeune", "central": "central", "haut": "population_agee"}
pays = m.charger_pays("FR")

def e65(q):
    """Espérance de vie à 65 ans d'une table de taux de décès par âge (période, a_x = 0,5 ; âge ouvert 100 : 1/q)."""
    l, e = 1.0, 0.0
    for x in range(65, m.AGES - 1):
        d = l * q[x]
        e += (l - d) + 0.5 * d
        l -= d
    return e + l / max(q[m.AGES - 1], 1e-9)

out = {}
for cle, sc in CORR.items():
    jeu = m.jeu_combine(sc)
    q_fn, asfr_fn, mig_fn, pop0, profil, pg = m.construire_parametres(pays, m.INSEE_2026, jeu)
    etat = m.projeter(pop0, m.ANNEE0, 2070, q_fn, asfr_fn, mig_fn, profil, pg)
    pops, es = [], []
    for t in range(2025, 2071):
        p = etat[t]["pop"]
        pops.append([round(p["M"][x] + p["F"][x]) for x in range(m.AGES)])
        es.append(round((e65(q_fn("M", t)) + e65(q_fn("F", t))) / 2, 3))
    out[cle] = {"scenario_insee": sc, "pop": pops, "e65": es}
src = ("/* Généré par generer_age_sante.py (ne pas éditer à la main). pop[i][x] = population au 1er janvier de l'année 2025+i à l'âge x (0 à 100, 100 = « 100 ans ou plus »), sexes confondus ; "
       "e65[i] = espérance de vie à 65 ans (moyenne hommes-femmes, table de période de l'année 2025+i). */\n"
       "(function (root) { root.TrajectoiresAge = " + json.dumps({"annee0": 2025, "source": "insee2026, moteur prospective-demographie/modele.py", "scenarios": out}, separators=(",", ":")) + "; })(this);\n")
open(os.path.join(ICI, "trajectoires_age.js"), "w", encoding="utf-8").write(src)
print("ok", len(src), "octets")
