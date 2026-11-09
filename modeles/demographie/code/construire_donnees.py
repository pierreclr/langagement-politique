# -*- coding: utf-8 -*-
"""Construit les CSV de donnees/ a partir des fichiers Insee telecharges.

Usage : python3 -I construire_donnees.py <dossier des xlsx Insee> <dossier de sortie>
Les xlsx sont lus par xlsx_min.py (bibliotheque standard). Aucune valeur n'est saisie a la main (sauf le tableau de 5 hypotheses Insee) :
chaque nombre vient d'une cellule du fichier source (fichier et feuille cites dans chaque CSV).
"""
import csv
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import xlsx_min as xl  # noqa: E402

CONSULTE = "2026-11-07"
BASE = "https://www.insee.fr/fr/statistiques/fichier/"
SRC_POP = BASE + "8721185/3_Pop1janv_age.xlsx"
SRC_MORT = BASE + "8721189/6_FR_Table_mortalite_triennale.xlsx"
SRC_FEC = BASE + "8721207/2_Taux_fecondite_femmes.xlsx"
SRC_ICF = BASE + "8721207/3_ICF_age_moyen_femmes.xlsx"
SRC_PROJ = BASE + "9004289/ip2108.xlsx"


def num(x):
    if x is None:
        return None
    x = str(x).strip().replace(" ", "").replace(" ", "")
    try:
        return float(x)
    except ValueError:
        return None


def ecrire(chemin, entete, lignes, commentaires):
    with open(chemin, "w", newline="", encoding="utf-8") as f:
        for c in commentaires:
            f.write("# " + c + "\n")
        w = csv.writer(f)
        w.writerow(entete)
        w.writerows(lignes)
    print("ecrit", chemin, len(lignes), "lignes")


def lire_pyramides(pop):
    """-> {(annee, perimetre): {age: (ensemble, hommes, femmes)}} ; age 105 = 105 ans ou plus (100+ avant 1990 environ)."""
    out = {}
    for nom, lignes in pop.items():
        annee = int(nom)
        entete = None
        for i, r in lignes:
            if i == 4:
                entete = r
        # colonnes : C-E metropole ; F-H France (hors Mayotte avant 2014)
        cols = {"metropole": ("C", "D", "E")}
        if entete and "F" in entete:
            cols["france"] = ("F", "G", "H")
        for per, (c, h, f) in cols.items():
            d = {}
            for i, r in lignes:
                if i < 7:
                    continue
                b = r.get("B")
                if b is None:
                    if r.get("A", "").startswith("Population totale"):
                        break
                    continue
                m = re.match(r"\s*(\d+)", b)
                if not m:
                    continue
                age = int(m.group(1))
                e, hh, ff = num(r.get(c)), num(r.get(h)), num(r.get(f))
                if e is None:
                    continue
                d[age] = (e, hh, ff)
            out[(annee, per)] = d
    return out


def grands_ages(d):
    tot = sum(v[0] for v in d.values())
    def s(a, b):
        return sum(v[0] for k, v in d.items() if a <= k <= b)
    return {
        "total": tot, "0_19": s(0, 19), "20_64": s(20, 64), "60_plus": s(60, 200),
        "65_plus": s(65, 200), "75_plus": s(75, 200), "80_plus": s(80, 200),
    }


def main(dossier_xlsx, sortie):
    os.makedirs(sortie, exist_ok=True)
    pop = xl.read(os.path.join(dossier_xlsx, "3_Pop1janv_age.xlsx"))
    pyr = lire_pyramides(pop)

    # 1. grands ages 1901-2026
    lignes = []
    for (annee, per) in sorted(pyr):
        g = grands_ages(pyr[(annee, per)])
        lignes.append([annee, per] + [round(g[k]) for k in ("total", "0_19", "20_64", "60_plus", "65_plus", "75_plus", "80_plus")])
    ecrire(os.path.join(sortie, "population_grands_ages_1901_2026.csv"),
           ["annee", "perimetre", "total", "0_19", "20_64", "60_plus", "65_plus", "75_plus", "80_plus"], lignes,
           ["source : Insee, bilan demographique 2025 (resultats provisoires a fin 2025), « Population au 1er janvier par sexe et age detaille », " + SRC_POP,
            "cote A (statistique publique) ; conflits d'interets : aucun connu (institut statistique officiel) ; consulte le " + CONSULTE,
            "unite : personnes au 1er janvier ; perimetre : metropole (1901-2026) ; france = France hors Mayotte (2000-2013) puis France (2014-2026)",
            "avant 1990 environ l'age maximal publie est 100 ou plus ; les sommes 60+, 65+, 75+, 80+ n'en sont pas affectees",
            "annees absentes du fichier source : 1915-1919 (guerre) ; 1975 : le total est un chiffre arrondi (52 600 000) dans le fichier source",
            "calcul : somme des ages revolus ; le fichier ne contient pas la tranche 60+ toute faite"])

    # 2. pyramide 2026 (France)
    d = pyr[(2026, "france")]
    lignes = [[a, round(d[a][1]), round(d[a][2]), round(d[a][0])] for a in sorted(d)]
    ecrire(os.path.join(sortie, "pyramide_2026_france.csv"), ["age_revolu", "hommes", "femmes", "ensemble"], lignes,
           ["source : Insee, bilan demographique 2025, estimation provisoire arretee a fin 2025, " + SRC_POP,
            "cote A ; consulte le " + CONSULTE + " ; unite : personnes au 1er janvier 2026 ; perimetre : France (y compris Mayotte) ; age 105 = 105 ans ou plus"])

    # 2bis. pyramides France 2014-2026 (pour le residu migratoire) : stockees compactes
    lignes = []
    for annee in range(2014, 2027):
        dd = pyr[(annee, "france")]
        for a in sorted(dd):
            lignes.append([annee, a, round(dd[a][1]), round(dd[a][2])])
    ecrire(os.path.join(sortie, "pyramides_france_2014_2026.csv"), ["annee", "age_revolu", "hommes", "femmes"], lignes,
           ["source : Insee, bilan demographique 2025, " + SRC_POP + " ; cote A ; consulte le " + CONSULTE,
            "population au 1er janvier, France ; sert au calcul du profil migratoire par residu"])

    # 3. mortalite : table triennale 2023-2025 + tables des annees precedentes (pour le residu)
    mort = xl.read(os.path.join(dossier_xlsx, "6_FR_Table_mortalite_triennale.xlsx"))
    lignes = []
    for nom in sorted(mort):
        if not re.fullmatch(r"\d{4}", nom):
            continue
        for i, r in mort[nom]:
            if i < 6 or not re.fullmatch(r"\d+", str(r.get("A", ""))):
                continue
            lignes.append([int(nom), int(r["A"]), num(r.get("F")), num(r.get("I")), num(r.get("G")), num(r.get("J")), num(r.get("E")), num(r.get("H"))])
    ecrire(os.path.join(sortie, "mortalite_tables_triennales_1999_2025.csv"),
           ["annee_fin_triennale", "age_revolu", "q_femmes_pour_100000", "q_hommes_pour_100000", "esperance_femmes", "esperance_hommes", "survivantes_100000", "survivants_100000"], lignes,
           ["source : Insee, bilan demographique 2025, tables de mortalite triennales France, " + SRC_MORT,
            "cote A ; consulte le " + CONSULTE + " ; chaque feuille « N » est la table des annees N-2 a N (2025 = 2023-2025, provisoire)",
            "q = probabilite de deces entre l'age exact x et x+1, pour 100 000 survivants a l'age x ; la table s'arrete a 104 ans (Insee)",
            "champ : France inclus Mayotte ; les indicateurs masculins apres 100 ans sont fragiles (effectifs faibles, note Insee)"])

    # 4. fecondite par age
    fec = xl.read(os.path.join(dossier_xlsx, "2_Taux_fecondite_femmes.xlsx"))
    feuille = fec["FR - âge détaillé"]
    entete = None
    for i, r in feuille:
        if i == 4:
            entete = r
    colage = {c: int(re.match(r"\d+", v).group()) for c, v in entete.items()}
    lignes = []
    for i, r in feuille:
        if i < 5:
            continue
        a = str(r.get("A", ""))
        m = re.match(r"(\d{4})", a)
        if not m:
            continue
        for c, age in colage.items():
            v = num(r.get(c))
            if v is not None:
                lignes.append([int(m.group(1)), age, v])
    ecrire(os.path.join(sortie, "fecondite_par_age_1994_2025.csv"), ["annee", "age_atteint", "naissances_pour_10000_femmes"], lignes,
           ["source : Insee, bilan demographique 2025, taux de fecondite des femmes par age detaille (age atteint dans l'annee), France, " + SRC_FEC,
            "cote A ; consulte le " + CONSULTE + " ; 2023-2025 provisoires ; unite : naissances vivantes pour 10 000 femmes de l'age indique ; ICF = somme /10000",
            "perimetre : France hors Mayotte jusqu'en 2013, France a partir de 2014"])

    icf = xl.read(os.path.join(dossier_xlsx, "3_ICF_age_moyen_femmes.xlsx"))["ICF-âge moyen-mères"]
    lignes = []
    for i, r in icf:
        m = re.match(r"(\d{4})", str(r.get("A", "")))
        if i < 5 or not m:
            continue
        lignes.append([int(m.group(1)), num(r.get("B")), num(r.get("C")), num(r.get("D")), num(r.get("E"))])
    ecrire(os.path.join(sortie, "icf_1901_2025.csv"),
           ["annee", "icf_metropole_pour_100_femmes", "age_moyen_metropole", "icf_france_pour_100_femmes", "age_moyen_france"], lignes,
           ["source : Insee, bilan demographique 2025, " + SRC_ICF + " ; cote A ; consulte le " + CONSULTE,
            "ICF en enfants pour 100 femmes (156 = 1,56 enfant par femme en 2025, provisoire) ; nd = non disponible (vide)"])

    # 5. projections officielles Insee 2026 (scenario central et variantes)
    pr = xl.read(os.path.join(dossier_xlsx, "ip2108.xlsx"))
    f3 = pr["Figure 3"]
    noms = ["bilan", "central", "fecondite_basse", "fecondite_haute", "ev_basse", "ev_haute", "migration_basse", "migration_haute", "population_basse", "population_haute"]
    colsf3 = "BCDEFGHIJK"
    lignes = []
    for i, r in f3:
        m = re.fullmatch(r"\d{4}", str(r.get("A", "")))
        if i < 4 or not m:
            continue
        lignes.append([int(r["A"])] + [num(r.get(c)) for c in colsf3])
    ecrire(os.path.join(sortie, "insee_projections_2026_population_scenarios.csv"), ["annee"] + noms, lignes,
           ["source : Insee Premiere n° 2108, « Projections de population a l'horizon 2070 », 08/06/2026, figure 3, " + SRC_PROJ,
            "cote A ; consulte le " + CONSULTE + " ; unite : millions d'habitants au 1er janvier ; champ : France ; 1995-2025 = bilan demographique",
            "ces valeurs sont des projections conditionnelles (hypotheses), pas des previsions ; vide = sans objet"])
    f5, f6 = pr["Figure 5"], pr["Figure 6"]
    lignes = []
    for i, r in f5:
        if i < 5 or not re.fullmatch(r"\d{4}", str(r.get("A", ""))):
            continue
        an = int(r["A"])
        if an >= 2026:
            cols = "GHIJK"
        else:
            cols = "BCDEF"
        dep = None
        for j, r6 in f6:
            if str(r6.get("A")) == str(an):
                dep = {k: num(r6.get(c)) for k, c in zip(["central", "ev_basse", "ev_haute", "pop_jeune", "pop_agee", "ev_constante"], "CDEFGH")}
                dep["bilan"] = num(r6.get("B"))
        v = [num(r.get(c)) for c in cols]
        lignes.append([an] + v + [dep["bilan"] if an < 2026 else dep["central"]] +
                      [dep[k] if an >= 2026 else None for k in ("ev_basse", "ev_haute", "pop_jeune", "pop_agee", "ev_constante")])
    ecrire(os.path.join(sortie, "insee_projections_2026_age_central.csv"),
           ["annee", "moins_20_ans_M", "20_44_M", "45_64_M", "65_plus_M", "80_plus_M", "rapport_dependance_65plus_sur_20_64_pct",
            "dep_ev_basse", "dep_ev_haute", "dep_pop_jeune", "dep_pop_agee", "dep_ev_constante"], lignes,
           ["source : Insee Premiere n° 2108, figures 5 (population par age) et 6 (rapport de dependance), " + SRC_PROJ,
            "cote A ; consulte le " + CONSULTE + " ; unite : millions ; rapport = 65+ pour 100 personnes de 20 a 64 ans ; avant 2026 = bilan demographique ; scenario central apres",
            "champ : France metropolitaine jusqu'en 1994, France hors Mayotte 1995-2013, France ensuite"])
    f4 = pr["Figure 4"]
    lignes = []
    for i, r in f4:
        if i < 5 or not re.fullmatch(r"\d+", str(r.get("A", ""))):
            continue
        lignes.append([int(r["A"]), num(r["B"]), num(r["C"]), num(r["D"]), num(r["E"])])
    ecrire(os.path.join(sortie, "insee_projections_2026_pyramide_2070.csv"),
           ["age", "hommes_2026", "hommes_2070", "femmes_2026", "femmes_2070"], lignes,
           ["source : Insee Premiere n° 2108, figure 4, " + SRC_PROJ + " ; cote A ; consulte le " + CONSULTE,
            "scenario central ; personnes ; sert a valider la pyramide de 2070 du modele"])
    f1 = pr["Figure 2"]
    lignes = []
    for i, r in f1:
        if i < 5 or not re.fullmatch(r"\d{4}", str(r.get("A", ""))):
            continue
        an = int(r["A"])
        cols = "GHIJK" if an >= 2026 else "BCDEF"
        v = [num(r.get(c)) for c in cols]
        lignes.append([an] + v)
    ecrire(os.path.join(sortie, "insee_projections_2026_mouvements_central.csv"),
           ["annee", "deces", "naissances", "solde_naturel", "solde_migratoire", "variation_population"], lignes,
           ["source : Insee Premiere n° 2108, figure 2, " + SRC_PROJ + " ; cote A ; consulte le " + CONSULTE,
            "scenario central a partir de 2026 ; bilan demographique avant ; unite : personnes par an"])
    ecrire(os.path.join(sortie, "insee_projections_2026_hypotheses.csv"),
           ["parametre", "estime_2025", "central", "basse", "haute"],
           [["icf", 1.56, "1,45 a partir de 2028", "1,20 a partir de 2030", "1,70 a partir de 2030"],
            ["age_moyen_accouchement", 31.2, "33,0 en 2050 puis stable", "", ""],
            ["esperance_vie_femmes_2070", 85.9, 89.5, 86.5, 92.5],
            ["esperance_vie_hommes_2070", 80.3, 86.7, 83.7, 89.7],
            ["solde_migratoire_par_an", "176 000 (moyenne 2020-2022 hors Ukraine)", 150000, 70000, 230000]],
           ["source : Insee Premiere n° 2108, tableau complementaire « Hypotheses retenues pour les projections 2026 », " + SRC_PROJ,
            "cote A ; consulte le " + CONSULTE + " ; hypotheses transcrites a la main depuis le tableau complementaire (5 lignes), a relire si la source change"])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
