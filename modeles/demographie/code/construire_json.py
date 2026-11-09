# -*- coding: utf-8 -*-
"""Ecrit sorties/demographie.json : donnees compactes pour refaire la projection dans le navigateur + 3 scenarios precalcules.
Usage : python3 -I construire_json.py"""
import csv
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import projection as P

ICI = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(ICI, "..", "donnees")


def lire(nom):
    with open(os.path.join(D, nom), encoding="utf-8") as f:
        return list(csv.reader(l for l in f if not l.startswith("#")))


def arrondi(v, n=6):
    return [round(x, n) for x in v]


def main():
    b = P.charger_base(D)
    ref = P.reference_pensions(b)

    # historique (milliers, arrondi) : metropole 1901-2026, france 2000-2026
    hist = {"unite": "milliers de personnes au 1er janvier", "metropole": {}, "france": {}}
    cles = ["total", "0_19", "20_64", "60_plus", "65_plus", "75_plus", "80_plus"]
    for per in ("metropole", "france"):
        rows = [r for r in lire("population_grands_ages_1901_2026.csv")[1:] if r[1] == per]
        hist[per]["annees"] = [int(r[0]) for r in rows]
        for i, k in enumerate(cles):
            hist[per][k] = [round(float(r[2 + i]) / 1e3) for r in rows]

    icf = {int(r[0]): (r[1], r[3]) for r in lire("icf_1901_2025.csv")[1:]}
    icf_serie = {"annees": [], "icf_metropole": [], "icf_france": []}
    for an in sorted(icf):
        icf_serie["annees"].append(an)
        icf_serie["icf_metropole"].append(float(icf[an][0]) / 100 if icf[an][0] not in ("", "nd") else None)
        try:
            icf_serie["icf_france"].append(float(icf[an][1]) / 100)
        except ValueError:
            icf_serie["icf_france"].append(None)

    # Insee central (millions) : 65+ et 20-64 apres 2026, pour superposer
    ins = {"annees": [], "total": [], "20_64": [], "65_plus": [], "dependance_pct": []}
    tot = {int(r[0]): r[2] for r in lire("insee_projections_2026_population_scenarios.csv")[1:]}
    for r in lire("insee_projections_2026_age_central.csv")[1:]:
        an = int(r[0])
        if an >= 2026:
            ins["annees"].append(an)
            ins["total"].append(float(tot[an]))
            ins["20_64"].append(round(float(r[2]) + float(r[3]), 3))
            ins["65_plus"].append(float(r[4]))
            ins["dependance_pct"].append(float(r[6]))

    scen = {}
    for nom, src in (("bas", "population_basse"), ("central", "central"), ("haut", "population_haute")):
        p = P.scenario_insee(b, src)
        s = P.projeter(b, p)
        sc = {"definition_insee": src, "parametres": {k: round(v, 5) if isinstance(v, float) else v for k, v in p.items()},
              "annees": [x["annee"] for x in s]}
        for k in ("total", "0_19", "20_64", "60_plus", "65_plus", "75_plus", "80_plus"):
            sc[k + "_milliers"] = [round(x[k] / 1e3) for x in s]
        sc["dependance_65_sur_20_64_pct"] = [round(100 * x["dependance_65_sur_20_64"], 2) for x in s]
        sc["retraites_pour_100_actifs_age_depart_%d" % p["age_depart"]] = [round(100 * x["retraites_par_actif"], 2) for x in s]
        sc["depenses_retraite_pct_pib_pension_constante_age_depart_%d" % p["age_depart"]] = [round(x["depenses_retraite_pct_pib_pension_constante"], 2) for x in s]
        sc["naissances_milliers"] = [round(x["naissances"] / 1e3, 1) if x["naissances"] else None for x in s]
        sc["deces_milliers"] = [round(x["deces"] / 1e3, 1) if x["deces"] else None for x in s]
        for an in (2050, 2070):
            x = [y for y in s if y["annee"] == an][0]
            sc["pyramide_%d" % an] = {"hommes": [round(v) for v in x["pyramide"][P.HOMME]], "femmes": [round(v) for v in x["pyramide"][P.FEMME]]}
        scen[nom] = sc

    out = {
        "meta": {
            "titre": "Demographie de la France : donnees et scenarios pour la page interactive",
            "genere_par": "modeles/demographie/code/construire_json.py (date de consultation des sources : 2026-11-07)",
            "sources": [
                {"id": "pyramides", "nom": "Insee, bilan demographique 2025, population au 1er janvier par sexe et age (1901-2026, 2026 provisoire)",
                 "url": "https://www.insee.fr/fr/statistiques/fichier/8721185/3_Pop1janv_age.xlsx", "cote": "A"},
                {"id": "mortalite", "nom": "Insee, bilan demographique 2025, table de mortalite triennale 2023-2025 (provisoire), France",
                 "url": "https://www.insee.fr/fr/statistiques/fichier/8721189/6_FR_Table_mortalite_triennale.xlsx", "cote": "A"},
                {"id": "fecondite", "nom": "Insee, bilan demographique 2025, taux de fecondite par age (2025 provisoire) et indicateur conjoncturel",
                 "url": "https://www.insee.fr/fr/statistiques/fichier/8721207/2_Taux_fecondite_femmes.xlsx", "cote": "A"},
                {"id": "projections", "nom": "Insee Premiere n° 2108, projections de population a l'horizon 2070 (08/06/2026)",
                 "url": "https://www.insee.fr/fr/statistiques/9004289", "cote": "A"},
                {"id": "migration", "nom": "Profil par age du solde migratoire : calcul de Claude (residu de cohortes sur les pyramides et tables Insee)", "cote": "B"},
                {"id": "pensions", "nom": "COR, rapport annuel juin 2026 : depenses de retraite 14,1 % du PIB en 2025",
                 "url": "https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf", "cote": "B"},
            ],
            "avertissement": "Projections conditionnelles : des hypotheses et des ordres de grandeur, pas des previsions.",
            "scenarios": {
                "bas": "population basse Insee : fecondite 1,20 des 2030, solde +70 000 par an, esperance de vie 2070 de 86,5 (F) et 83,7 (H)",
                "central": "central Insee : fecondite 1,45 des 2028, solde +150 000 par an, esperance de vie 2070 de 89,5 (F) et 86,7 (H)",
                "haut": "population haute Insee : fecondite 1,70 des 2030, solde +230 000 par an, esperance de vie 2070 de 92,5 (F) et 89,7 (H)",
            },
            "algorithme": [
                "Entrees : pyramide[sexe][age] au 1er janvier 2026 (age 0..105, 105 = 105 ans ou plus).",
                "Pour chaque annee t de 2026 a 2069 :",
                "1. mortalite : pour chaque sexe, e0_cible = e0_base + gain*(t+0,5-2024) ; chercher par dichotomie le facteur c tel que l'esperance de vie de la table q' = min(0,999 ; c*q) soit e0_cible (esperance de vie : somme des L(x), L(0) = l0 - 0,9*d0, L(x) = l(x) - 0,5*d(x), fermeture a 105 ans par l/q).",
                "2. vieillissement : P'[s][a+1] = P[s][a]*(1-q'[s][a]) pour a = 0..104 ; P'[s][105] += P[s][105]*(1-q'[s][105]).",
                "3. migration : pour a = 1..64, P'[s][a] += solde * profil_migration[s][a] / somme(profil_migration sur a = 1..64 et deux sexes).",
                "4. fecondite : ICF(t) lineaire de icf_2025 a icf_cible entre 2025 et annee_icf ; decalage d = (age_moyen_cible - age_moyen_2025) * min(1, (t-2025)/(annee_age-2025)) ; taux(x) = ICF * forme(x-d) / somme(forme), forme = taux 2025 interpole lineairement.",
                "5. naissances = somme sur x = 15..49 de taux(x) * (P_F[x-1] + P'_F[x]) / 2 ; P'[garcons][0] = naissances * part_garcons * (1 - q'_H[0]/2) ; P'[filles][0] = naissances * (1-part_garcons) * (1 - q'_F[0]/2).",
                "Indicateurs : dependance = 65+ / 20-64 ; retraites par actif = (age >= age_depart) / (20 <= age < age_depart) ; depenses = 14,1 % * (ce rapport) / (rapport de 2026 a age_depart 62).",
            ],
        },
        "histoire": hist,
        "icf_historique": icf_serie,
        "pyramide_2026": {"unite": "personnes au 1er janvier 2026, France, age 0..105 (105 = 105 ans ou plus)",
                          "hommes": [round(v) for v in b["pyramide"][P.HOMME]], "femmes": [round(v) for v in b["pyramide"][P.FEMME]]},
        "mortalite": {"annee_e0_base": b["annee_e0_base"], "e0_base": {"hommes": b["e0_base"][P.HOMME], "femmes": b["e0_base"][P.FEMME]},
                      "q_hommes": arrondi(b["q"][P.HOMME], 7), "q_femmes": arrondi(b["q"][P.FEMME], 7),
                      "note": "probabilite de deces entre l'age exact x et x+1 (table 2023-2025) ; 105 = quotient de 104 ans reconduit"},
        "fecondite": {"ages": list(range(15, 50)), "taux_2025": [round(b["fecondite_2025"][x], 6) for x in range(15, 50)],
                      "icf_2025": round(b["icf_2025"], 4), "age_moyen_2025": b["age_moyen_2025"], "part_garcons": round(b["part_garcons"], 5)},
        "migration_profil": {"hommes": arrondi(b["profil_migration"][P.HOMME]), "femmes": arrondi(b["profil_migration"][P.FEMME]),
                             "note": "parts du solde annuel par age (1..64) et sexe, somme = 1"},
        "parametres_centraux": {k: (round(v, 5) if isinstance(v, float) else v) for k, v in P.parametres(b).items()},
        "pensions_calage": {"part_pib_2025_pct": ref["part_pib_2025"], "ratio_2026_age62": round(ref["ratio_2026_age62"], 5)},
        "insee_central": ins,
        "scenarios": scen,
    }
    chemin = os.path.join(ICI, "..", "sorties", "demographie.json")
    with open(chemin, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print("ecrit", chemin, os.path.getsize(chemin), "octets")


if __name__ == "__main__":
    main()
