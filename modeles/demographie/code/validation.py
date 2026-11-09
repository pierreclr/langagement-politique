# -*- coding: utf-8 -*-
"""Compare le modele aux projections officielles Insee 2026 (Insee Premiere 2108) ; ecrit sorties/validation.txt.
Usage : python3 -I validation.py"""
import csv
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import projection as P

ICI = os.path.dirname(os.path.abspath(__file__))
DONNEES = os.path.join(ICI, "..", "donnees")


def _lire(nom):
    with open(os.path.join(DONNEES, nom), encoding="utf-8") as f:
        return list(csv.reader(l for l in f if not l.startswith("#")))


def comparer():
    """Renvoie une liste de lignes (libelle, modele, insee, ecart_pct, tolerance_pct)."""
    b = P.charger_base(DONNEES)
    lignes = []
    sc = _lire("insee_projections_2026_population_scenarios.csv")
    ins = {}
    for r in sc[1:]:
        for k, v in zip(sc[0][1:], r[1:]):
            if v:
                ins[(k, int(r[0]))] = float(v)

    def ligne(lib, m, i, tol):
        lignes.append((lib, m, i, 100 * (m / i - 1), tol))

    res = {}
    for nom in ("central", "fecondite_basse", "fecondite_haute", "migration_basse", "migration_haute", "ev_basse", "ev_haute",
                "population_basse", "population_haute"):
        res[nom] = P.par_annee(P.projeter(b, P.scenario_insee(b, nom)))
        for an in (2040, 2070):
            if (nom, an) in ins:
                ligne("population totale %s %d (M)" % (nom, an), res[nom][an]["total"] / 1e6, ins[(nom, an)], 3.0)
    ag = {int(r[0]): r for r in _lire("insee_projections_2026_age_central.csv")[1:]}
    c = res["central"]
    for an in (2030, 2040, 2050, 2060, 2070):
        i = ag[an]
        ligne("65 ans ou plus central %d (M)" % an, c[an]["65_plus"] / 1e6, float(i[4]), 3.0)
        ligne("moins de 20 ans central %d (M)" % an, c[an]["0_19"] / 1e6, float(i[1]), 3.0)
        ligne("rapport de dependance 65+/20-64 central %d (%%)" % an, 100 * c[an]["dependance_65_sur_20_64"], float(i[6]), 3.5)
        ligne("80 ans ou plus central %d (M)" % an, c[an]["80_plus"] / 1e6, float(i[5]), 8.0)
    # scenarios composes : l'ecart se cumule (trois hypotheses extremes a la fois), tolerance elargie
    for nom, col, tol in (("population_agee", 10, 4.5), ("population_jeune", 9, 3.0), ("ev_constante", 11, 3.0), ("ev_basse", 7, 3.0), ("ev_haute", 8, 3.0)):
        r = P.par_annee(P.projeter(b, P.scenario_insee(b, nom)))
        ligne("rapport de dependance %s 2070 (%%)" % nom, 100 * r[2070]["dependance_65_sur_20_64"], float(ag[2070][col]), tol)
    mv = {int(r[0]): r for r in _lire("insee_projections_2026_mouvements_central.csv")[1:]}
    for an in (2030, 2040, 2050, 2069):
        ligne("naissances central %d (milliers)" % an, c[an]["naissances"] / 1e3, float(mv[an][2]) / 1e3, 4.0)
        ligne("deces central %d (milliers)" % an, c[an]["deces"] / 1e3, abs(float(mv[an][1])) / 1e3, 7.0)
    return lignes


def texte(lignes):
    out = ["Validation : modele par composantes contre Insee Premiere 2108 (projections 2026, scenario central et variantes)",
           "%-62s %10s %10s %8s %6s" % ("indicateur", "modele", "Insee", "ecart %", "tol. %")]
    for lib, m, i, e, t in lignes:
        out.append("%-62s %10.2f %10.2f %+8.1f %6.1f%s" % (lib, m, i, e, t, "" if abs(e) <= t else "  HORS TOLERANCE"))
    return "\n".join(out)


if __name__ == "__main__":
    t = texte(comparer())
    print(t)
    with open(os.path.join(ICI, "..", "sorties", "validation.txt"), "w", encoding="utf-8") as f:
        f.write(t + "\n")
