# -*- coding: utf-8 -*-
"""Profil du solde migratoire par age et sexe, estime par residu de cohortes (methode demographique classique).

Pour la transition du 1er janvier t au 1er janvier t+1 :
    m(a+1, sexe) = P(a+1, t+1) - P(a, t) * (1 - q(a, sexe))
q = quotient de mortalite de la table triennale Insee de l'annee t+1 (2025 pour t = 2025).
Le residu contient aussi les erreurs d'estimation et de mortalite : on n'en garde que la FORME (ages 1 a 64),
moyennee sur 2018-2019 et 2022-2025 (on exclut 2014-2017, annees de revisions de perimetre, et 2020-2021, covid),
lissee sur 3 ages, negatifs ramenes a 0, normalisee a 1. Le niveau (150 000 par an) vient de l'hypothese de l'Insee.
Usage : python3 -I profil_migration.py <dossier donnees>
"""
import csv
import os
import sys

ANNEES = (2018, 2019, 2022, 2023, 2024, 2025)


def lire(chemin):
    with open(chemin, encoding="utf-8") as f:
        return list(csv.reader(l for l in f if not l.startswith("#")))


def residus(pyr, q, t):
    """pyr[(annee, age)] = (hommes, femmes) ; q[(annee, age)] = (hommes, femmes) en probabilite."""
    qy = min(t + 1, 2025)
    out = {}
    for a in range(0, 104):
        for s in (0, 1):
            out[(a + 1, s)] = pyr[(t + 1, a + 1)][s] - pyr[(t, a)][s] * (1 - q[(qy, a)][s])
    return out


def profil(pyr, q, annees=ANNEES):
    moy = {(a, s): 0.0 for a in range(1, 105) for s in (0, 1)}
    for t in annees:
        r = residus(pyr, q, t)
        for k, v in r.items():
            moy[k] += v / len(annees)
    lisse = {}
    for s in (0, 1):
        for a in range(1, 65):
            v = [moy[(b, s)] for b in (a - 1, a, a + 1) if 1 <= b <= 104]
            lisse[(a, s)] = max(0.0, sum(v) / len(v))
    tot = sum(lisse.values())
    return moy, {k: v / tot for k, v in lisse.items()}


def main(dossier):
    pyr = {(int(r[0]), int(r[1])): (float(r[2]), float(r[3])) for r in lire(os.path.join(dossier, "pyramides_france_2014_2026.csv"))[1:]}
    q = {(int(r[0]), int(r[1])): (float(r[3]) / 1e5, float(r[2]) / 1e5) for r in lire(os.path.join(dossier, "mortalite_tables_triennales_1999_2025.csv"))[1:]}
    moy, pf = profil(pyr, q)
    with open(os.path.join(dossier, "migration_profil_residuel.csv"), "w", newline="", encoding="utf-8") as f:
        f.write("# profil du solde migratoire par age (age au 1er janvier d'arrivee dans la pyramide) et sexe : parts (somme = 1 sur ages 1-64, deux sexes)\n")
        f.write("# methode : residu de cohortes, voir code/profil_migration.py ; donnees : Insee, pyramides 2014-2026 et tables de mortalite triennales (cote A) ; calcul de Claude (cote B)\n")
        f.write("# annees retenues : 2018, 2019, 2022, 2023, 2024, 2025 ; lissage sur 3 ages ; residus negatifs ramenes a 0 ; ages 0 et 65+ : 0 (residu non fiable)\n")
        f.write("# colonnes brutes : residu moyen annuel en personnes AVANT lissage et normalisation (pour controle)\n")
        w = csv.writer(f)
        w.writerow(["age", "part_hommes", "part_femmes", "residu_moyen_hommes", "residu_moyen_femmes"])
        for a in range(0, 106):
            w.writerow([a, round(pf.get((a, 0), 0.0), 6), round(pf.get((a, 1), 0.0), 6),
                        round(moy.get((a, 0), 0.0)), round(moy.get((a, 1), 0.0))])
    print("residu moyen 2018-19, 2022-25 : total %d par an (ages 1-104)" % sum(moy.values()))
    print("part des 18-34 ans : %.1f %%" % (100 * sum(v for (a, s), v in pf.items() if 18 <= a <= 34)))


if __name__ == "__main__":
    main(sys.argv[1])
