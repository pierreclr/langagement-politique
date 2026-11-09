# -*- coding: utf-8 -*-
"""Stress test de la réécriture : on fait tourner l'actuel et le réécrit sur une grille de situations,
on attribue chaque écart à l'option (E1..E5) qui le cause, on compte gagnants et perdants.

Fonctions pures : grille, comparer, attribuer, synthese.  E/S : main (écrit resultats/).
Usage : python3 -I stress_test.py
"""
from __future__ import annotations

import csv
import itertools
import sys
from dataclasses import asdict, replace
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from regles import OPTIONS_DEFAUT, Situation, actuel, reecrit  # noqa: E402

TOUT_OFF = {k: False for k in OPTIONS_DEFAUT}

PROFILS_SALAIRE = {
    "stable_2000": ((2000.0,) * 12, 0.0),
    "hausse_recente": ((2000.0,) * 9 + (2600.0,) * 3, 0.0),
    "prime_annuelle": ((2500.0,) * 11 + (5500.0,), 3000.0),
    "temps_partiel_court": ((1100.0,) * 4, 0.0),
}


def grille() -> list:
    """Environ 14 000 situations types (combinaisons des variables qui changent le résultat)."""
    out = []
    for anc, faute, am, (prof, (sal, prime)), exe, fm, contrat, cat in itertools.product(
            [0, 1, 3, 5, 6, 7, 8, 12, 23, 24, 60, 119, 120, 121, 240, 480],
            ["aucune", "simple", "grave", "lourde"],
            [False, True],
            PROFILS_SALAIRE.items(),
            [True, False],
            ["non", "fm", "sinistre"],
            ["CDI", "CDD"],
            ["", "professeur"]):
        if contrat == "CDD" and (faute != "aucune" or fm != "non" or cat):
            continue
        if cat and not am:
            continue
        if fm != "non" and faute in ("grave", "lourde"):
            continue  # combinaison incohérente : on ne licencie pas pour faute une entreprise détruite
        sal_eff = sal[-min(len(sal), max(1, anc)):] if anc < 12 else sal
        out.append(Situation(contrat=contrat, anciennete_mois=anc, faute=faute, alsace_moselle=am,
                             salaires_12_mois=tuple(sal_eff), primes_annuelles_3_derniers_mois=prime if anc >= 3 else 0.0,
                             preavis_execute=exe, preavis_dispense_par="" if exe else "employeur",
                             force_majeure=fm != "non", sinistre=fm == "sinistre", categorie_locale=cat))
    return out


def valeur(r) -> float:
    """Ce que reçoit la personne en euros (indemnités) ; le préavis exécuté est du salaire, pas un gain."""
    return r.indemnite_preavis + r.indemnite_licenciement


def comparer(s: Situation, options: dict = None) -> dict:
    a, b = actuel(s), reecrit(s, options)
    if a.cle() == b.cle():
        sens = "identique"
    else:
        d = valeur(b) - valeur(a)
        pa, pb = a.preavis_mois, b.preavis_mois
        if abs(d) > 0.005:
            sens = "gagnant" if d > 0 else "perdant"
        elif pa != pb:
            sens = ("préavis chiffré" if pa is None else "gagnant" if (pb or 0) > (pa or 0) else "perdant")
        else:
            sens = "forme"  # seuls les documents changent
    return {"sens": sens, "delta_euros": round(valeur(b) - valeur(a), 2),
            "preavis_actuel": a.preavis_mois, "preavis_reecrit": b.preavis_mois,
            "indemnite_actuelle": round(a.indemnite_licenciement, 2), "indemnite_reecrite": round(b.indemnite_licenciement, 2)}


def attribuer(s: Situation, options: dict = None) -> list:
    """Options qui, activées seules (les autres éteintes), changent le résultat de cette situation."""
    o = dict(OPTIONS_DEFAUT, **(options or {}))
    causes = []
    for k, actif in o.items():
        if actif and reecrit(s, {**TOUT_OFF, k: True}).cle() != actuel(s).cle():
            causes.append(k)
    return causes


def synthese(lignes: list) -> dict:
    out = {}
    for l in lignes:
        d = out.setdefault((l["causes"] or "(aucune)", l["sens"]), {"n": 0, "delta": 0.0})
        d["n"] += 1
        d["delta"] += l["delta_euros"]
    return out


def main() -> int:
    ici = Path(__file__).resolve().parent / "resultats"
    ici.mkdir(exist_ok=True)
    g = grille()
    lignes = []
    fideles = 0
    for s in g:
        fideles += reecrit(s, TOUT_OFF).cle() == actuel(s).cle()
        c = comparer(s)
        c["causes"] = "|".join(attribuer(s))
        d = asdict(s)
        d["salaires_12_mois"] = "/".join(str(int(x)) for x in s.salaires_12_mois)
        lignes.append({**d, **c})
    with open(ici / "stress_test.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(lignes[0].keys()))
        w.writeheader()
        w.writerows(lignes)
    syn = synthese(lignes)
    with open(ici / "stress_test_synthese.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["option", "sens", "situations", "delta_euros_moyen"])
        for (c, sens), d in sorted(syn.items()):
            w.writerow([c, sens, d["n"], round(d["delta"] / d["n"], 2)])
    print(f"situations : {len(g)} ; réécrit sans option = actuel : {fideles}/{len(g)}")
    for (c, sens), d in sorted(syn.items()):
        print(f"  {c:60s} {sens:16s} {d['n']:6d}  delta moyen {d['delta'] / d['n']:9.2f} €")
    return 0


if __name__ == "__main__":
    sys.exit(main())
