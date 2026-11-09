# -*- coding: utf-8 -*-
"""Génère trajectoires_capi_cohortes.js (constantes embarquées pour capitalisation_cohortes.js, sans dépendance) : pour 2025-2070 et les trois
scénarios démographiques du palier 1 (bas = population_jeune, central, haut = population_agee, jeu Insee 2026, comme demographie.js) :
  - cot[i][x - 15] : cotisants à l'âge x (15 à 74 ans) l'année 2025+i = kappa × emploi par âge (emploi.py, trajectoire du COR, chômage 7 %) ;
  - sv[i][x - 50]  : probabilité de survie d'une personne d'âge x au 1er janvier de 2025+i jusqu'au 1er janvier suivant (x = 50 à 100),
                     = 1 − q[x+1] (indexation H3 de prospective-demographie), sexes pondérés par la population de l'âge x ;
  - cotisants[i], retraites[i] : totaux (cotisants COR et retraités tous régimes, emploi.py), pour le rapport cotisants / retraités.
Même moteur que trajectoires_demo.js et trajectoires_age.js. Usage : python3 generer_capitalisation_cohortes.py (dans ce dossier). Déterministe."""
import json, os, sys
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, "..", "prospective-demographie"))
import modele as m
import emploi as e

CORR = {"bas": "population_jeune", "central": "central", "haut": "population_agee"}
pays = m.charger_pays("FR")
d = e.charger_emploi()
cal = e.calibrage(d, m.projeter_scenario(pays, m.INSEE_2026, m.jeu_combine("central"))[2025]["pop"])
u_fn = e.chemin_chomage(d, 0.07)
out = {}
for cle, sc in CORR.items():
    q_fn, asfr_fn, mig_fn, pop0, profil, pg = m.construire_parametres(pays, m.INSEE_2026, m.jeu_combine(sc))
    etat = m.projeter(pop0, m.ANNEE0, 2070, q_fn, asfr_fn, mig_fn, profil, pg)
    proj = e.projeter_emploi(d, etat, cal)
    cot, sv, tc, tr = [], [], [], []
    for t in range(2025, 2071):
        pop = etat[t]["pop"]
        emp_age = [0.0] * m.AGES
        for s in e.SEXES:
            _, _, emp, _ = e.taux_par_age(d, s, t, "cor", u_fn(t), 0.0)
            for x in range(m.AGES):
                emp_age[x] += pop[s][x] * emp[x] * cal["kappa"]
        tot = sum(emp_age)
        assert abs(tot - proj[t]["cotisants"]) < 1e-6 * tot, (t, tot, proj[t]["cotisants"])
        cot.append([round(emp_age[x]) for x in range(15, 75)])
        qm, qf = q_fn("M", t), q_fn("F", t)
        ligne = []
        for x in range(50, m.AGES):
            k = min(x + 1, m.AGES - 1)
            pm, pf = pop["M"][x], pop["F"][x]
            ligne.append(round(1 - (pm * qm[k] + pf * qf[k]) / (pm + pf), 5))
        sv.append(ligne)
        tc.append(round(proj[t]["cotisants"]))
        tr.append(round(proj[t]["retraites_tous"]))
    out[cle] = {"scenario_insee": sc, "cot": cot, "sv": sv, "cotisants": tc, "retraites": tr}
src = ("/* Généré par generer_capitalisation_cohortes.py (ne pas éditer à la main). Pour l'année 2025+i : cot[i][x-15] = cotisants à l'âge x (15-74 ans) ; "
       "sv[i][x-50] = survie de l'âge x au 1er janvier à x+1 l'année suivante (50-100 ans, sexes pondérés) ; cotisants[i], retraites[i] = totaux (COR, emploi.py). */\n"
       "(function (root) { root.TrajectoiresCapiCohortes = " + json.dumps({"annee0": 2025, "ageCot0": 15, "ageSv0": 50,
           "source": "insee2026, prospective-demographie/modele.py et emploi.py (trajectoire du COR, chômage 7 %)", "scenarios": out},
           ensure_ascii=False, separators=(",", ":")) + "; })(this);\n")
open(os.path.join(ICI, "trajectoires_capi_cohortes.js"), "w", encoding="utf-8").write(src)
print("ok", len(src), "octets")
