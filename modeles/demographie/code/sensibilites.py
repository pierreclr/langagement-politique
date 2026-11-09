# -*- coding: utf-8 -*-
"""Sensibilite du resultat a chaque hypothese (une a la fois, autour du scenario central Insee).
Usage : python3 -I sensibilites.py   -> sorties/sensibilites.csv et sorties/sensibilites.txt"""
import csv
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import projection as P

ICI = os.path.dirname(os.path.abspath(__file__))
B = P.charger_base(os.path.join(ICI, "..", "donnees"))
N = 2070 - B["annee_e0_base"]


def gains(f70, h70):
    return {"gain_e0_femmes": (f70 - B["e0_base"][P.FEMME]) / N, "gain_e0_hommes": (h70 - B["e0_base"][P.HOMME]) / N}


CAS = [
    ("central (Insee 2026)", {}),
    ("fecondite 1,20 des 2030", {"icf_cible": 1.20, "annee_icf": 2030}),
    ("fecondite 1,70 des 2030", {"icf_cible": 1.70, "annee_icf": 2030}),
    ("fecondite 1,80 des 2030", {"icf_cible": 1.80, "annee_icf": 2030}),
    ("fecondite 2,10 des 2035 (remplacement)", {"icf_cible": 2.10, "annee_icf": 2035}),
    ("solde migratoire nul", {"solde_migratoire": 0.0}),
    ("solde migratoire +70 000", {"solde_migratoire": 70000.0}),
    ("solde migratoire +230 000", {"solde_migratoire": 230000.0}),
    ("solde migratoire +400 000", {"solde_migratoire": 400000.0}),
    ("esperance de vie constante", {"gain_e0_femmes": 0.0, "gain_e0_hommes": 0.0}),
    ("esperance de vie 2070 : -3 ans", gains(86.5, 83.7)),
    ("esperance de vie 2070 : +3 ans", gains(92.5, 89.7)),
    ("age de depart 62 ans", {"age_depart": 62}),
    ("age de depart 67 ans", {"age_depart": 67}),
    ("age de depart 70 ans", {"age_depart": 70}),
]
ANNEES = (2026, 2040, 2070)


def calculer():
    lignes = []
    for nom, mod in CAS:
        s = P.par_annee(P.projeter(B, P.parametres(B, **mod)))
        p = P.parametres(B, **mod)
        for an in ANNEES:
            x = s[an]
            lignes.append({
                "cas": nom, "annee": an, "age_depart": p["age_depart"],
                "total_M": x["total"] / 1e6, "20_64_M": x["20_64"] / 1e6, "65_plus_M": x["65_plus"] / 1e6, "75_plus_M": x["75_plus"] / 1e6,
                "dependance_65_20_64_pct": 100 * x["dependance_65_sur_20_64"],
                "retraites_pour_100_actifs": 100 * x["retraites_par_actif"],
                "depenses_pct_pib_pension_constante": x["depenses_retraite_pct_pib_pension_constante"],
            })
    return lignes


if __name__ == "__main__":
    L = calculer()
    cles = list(L[0])
    with open(os.path.join(ICI, "..", "sorties", "sensibilites.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(cles)
        for r in L:
            w.writerow([round(v, 3) if isinstance(v, float) else v for v in r.values()])
    out = ["Sensibilites (une hypothese a la fois, le reste = central Insee 2026) ; indice pensions : pension moyenne constante, taux d'emploi constant",
           "%-40s %5s %8s %8s %8s %8s %8s %9s" % ("cas", "annee", "total M", "20-64 M", "65+ M", "dep.%", "ret/100", "% PIB")]
    for r in L:
        out.append("%-40s %5d %8.2f %8.2f %8.2f %8.1f %8.1f %9.1f" % (r["cas"], r["annee"], r["total_M"], r["20_64_M"], r["65_plus_M"],
                   r["dependance_65_20_64_pct"], r["retraites_pour_100_actifs"], r["depenses_pct_pib_pension_constante"]))
    t = "\n".join(out)
    print(t)
    open(os.path.join(ICI, "..", "sorties", "sensibilites.txt"), "w", encoding="utf-8").write(t + "\n")
