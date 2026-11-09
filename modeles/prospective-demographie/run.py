# -*- coding: utf-8 -*-
"""Produit trajectoires.csv, comparaison.csv, RESULTATS.md. Usage : python3 run.py (dans ce dossier). Déterministe."""
import csv
import os
import modele as m

ICI = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(ICI, "donnees")


def lire(nom, cle="annee"):
    return {r[cle]: r for r in csv.DictReader(open(os.path.join(D, nom), encoding="utf-8"))}


def v(x, d=1):
    return f"{x:.{d}f}".replace(".", ",")


def main():
    pays = m.charger_pays("FR")
    jeux = [("insee2026", m.INSEE_2026, list(m.SCENARIOS_COMBINES)), ("insee2021", m.INSEE_2021, ["central", "population_basse", "population_haute", "population_agee", "population_jeune"])]
    res = {}
    lignes = []
    for nom_jeu, jeu, scs in jeux:
        for sc in scs:
            e = m.projeter_scenario(pays, jeu, m.jeu_combine(sc))
            res[(nom_jeu, sc)] = e
            for t in range(m.ANNEE0, m.ANNEE_FIN + 1):
                i = m.indicateurs(e[t]["pop"], m.age_depart_reforme(t))
                rc = m.nb_retraites(e[t]["pop"], m.age_depart_constant(t))
                mv = e.get(t, {})
                lignes.append([nom_jeu, sc, t, round(i["population"]), round(i["moins_20"]), round(i["20_64"]), round(i["65_plus"]), round(i["75_plus"]), round(i["80_plus"]),
                               round(100 * i["part_65_plus"], 2), round(100 * i["part_75_plus"], 2), round(i["ratio_20_64_sur_65_plus"], 3), round(i["ratio_65_plus_pour_100"], 2),
                               round(i["retraites"]), round(rc), round(mv["naissances"]) if "naissances" in mv else "", round(mv["deces"]) if "deces" in mv else "",
                               round(mv["solde_migratoire"]) if "solde_migratoire" in mv else "", round(mv["icf"], 3) if "icf" in mv else "",
                               round(mv["e0"]["F"], 2) if "e0" in mv else "", round(mv["e0"]["M"], 2) if "e0" in mv else ""])
    with open(os.path.join(ICI, "trajectoires.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["jeu_hypotheses", "scenario", "annee", "population", "moins_20_ans", "20_64_ans", "65_ans_plus", "75_ans_plus", "80_ans_plus", "part_65_plus_pct", "part_75_plus_pct",
                    "ratio_20_64_sur_65_plus", "65_plus_pour_100_20_64", "retraites_age_depart_releve", "retraites_age_depart_constant", "naissances", "deces", "solde_migratoire", "icf", "e0_femmes", "e0_hommes"])
        w.writerows(lignes)

    # Contrôle du moteur : EUROPOP2023 rejoué
    eu = m.projeter_europop(pays)
    b = pays["bilan"]
    comp = []

    def ajoute(source, indicateur, annee, modele_v, publie, unite):
        comp.append([source, indicateur, annee, modele_v, publie, round(100 * (modele_v / publie - 1), 2), unite])

    for y in (2030, 2050, 2070):
        i = m.indicateurs(eu[y]["pop"])
        ajoute("Eurostat EUROPOP2023 (référence)", "population", y, round(i["population"] / 1e6, 2), round(b[("BSL", "JAN", y)] / 1e6, 2), "millions")
        ajoute("Eurostat EUROPOP2023 (référence)", "part des 65+", y, round(100 * i["part_65_plus"], 1), b[("BSL", "PC_Y65_MAX", y)], "%")
        ajoute("Eurostat EUROPOP2023 (référence)", "65+ pour 100 de 20-64", y, round(i["ratio_65_plus_pour_100"], 1), b[("BSL", "OLDDEP3", y)], "pour 100")
    for proj, nm in (("HMIGR", "migration haute"), ("LMIGR", "migration basse")):
        e2 = m.projeter_europop(pays, proj)
        ajoute(f"Eurostat EUROPOP2023 ({nm})", "population", 2070, round(m.indicateurs(e2[2070]["pop"])["population"] / 1e6, 2), round(b[(proj, "JAN", 2070)] / 1e6, 2), "millions")
    # Insee 2026
    sc26, st26, dp26 = lire("insee2026_population_scenarios.csv"), lire("insee2026_structure_age.csv"), lire("insee2026_dependance.csv")
    mv26 = lire("insee2026_mouvements.csv")
    for sc in ("central", "population_basse", "population_haute", "population_agee", "fecondite_basse", "fecondite_haute", "migration_basse", "migration_haute", "esperance_vie_basse", "esperance_vie_haute"):
        for y in (2050, 2070):
            if sc in sc26[str(y)]:
                e = res[("insee2026", sc)]
                ajoute("Insee 2026", f"population ({sc})", y, round(m.indicateurs(e[y]["pop"])["population"] / 1e6, 2), round(float(sc26[str(y)][sc]), 2), "millions")
    ec = res[("insee2026", "central")]
    for y in (2026, 2050, 2070):
        i = m.indicateurs(ec[y]["pop"])
        s = st26[str(y)]
        ajoute("Insee 2026", "moins de 20 ans (central)", y, round(i["moins_20"] / 1e6, 2), round(float(s["moins_20_ans"]), 2), "millions")
        ajoute("Insee 2026", "20-64 ans (central)", y, round(i["20_64"] / 1e6, 2), round(float(s["20_44"]) + float(s["45_64"]), 2), "millions")
        ajoute("Insee 2026", "65 ans ou plus (central)", y, round(i["65_plus"] / 1e6, 2), round(float(s["65_plus"]), 2), "millions")
        ajoute("Insee 2026", "80 ans ou plus (central)", y, round(i["80_plus"] / 1e6, 2), round(float(s["80_plus"]), 2), "millions")
        ajoute("Insee 2026", "65+ pour 100 de 20-64 (central)", y, round(i["ratio_65_plus_pour_100"], 1), round(float(dp26[str(y)]["central"]), 1), "pour 100")
    for sc, col in (("population_agee", "population_agee"), ("population_jeune", "population_jeune")):
        ajoute("Insee 2026", f"65+ pour 100 de 20-64 ({sc})", 2070, round(m.indicateurs(res[("insee2026", sc)][2070]["pop"])["ratio_65_plus_pour_100"], 1), round(float(dp26["2070"][col]), 1), "pour 100")
    for y in (2026, 2050, 2069):
        ajoute("Insee 2026", "naissances (central)", y, round(ec[y]["naissances"]), int(mv26[str(y)]["naissances"]), "personnes")
        ajoute("Insee 2026", "décès (central)", y, round(ec[y]["deces"]), int(mv26[str(y)]["deces"]), "personnes")
    # Insee 2021
    sc21, dp21, p65 = lire("insee2021_population_scenarios.csv"), lire("insee2021_dependance.csv"), lire("insee2021_65plus.csv")
    e21 = res[("insee2021", "central")]
    for sc in ("central", "population_basse", "population_haute", "population_agee", "population_jeune"):
        for y in (2050, 2070):
            if sc in sc21[str(y)]:
                ajoute("Insee 2021-2070", f"population ({sc})", y, round(m.indicateurs(res[("insee2021", sc)][y]["pop"])["population"] / 1e6, 2), round(float(sc21[str(y)][sc]), 2), "millions")
    for y in (2050, 2070):
        i = m.indicateurs(e21[y]["pop"])
        tot65 = sum(int(p65[str(y)][k]) for k in ("65_74", "75_84", "85_plus")) / 1e6
        ajoute("Insee 2021-2070", "65 ans ou plus (central)", y, round(i["65_plus"] / 1e6, 2), round(tot65, 2), "millions")
        ajoute("Insee 2021-2070", "65+ pour 100 de 20-64 (central)", y, round(i["ratio_65_plus_pour_100"], 1), round(float(dp21[str(y)]["central"]), 1), "pour 100")
    with open(os.path.join(ICI, "comparaison.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["source", "indicateur", "annee", "modele", "publie", "ecart_pct", "unite"])
        w.writerows(comp)

    # RESULTATS.md
    out = ["---", "titre: Prospective démographique 2025-2070 (résultats)", "date: 2026-11-01", "version: 1", "statut: brouillon", "---", "",
           "# Prospective démographique : résultats", "",
           "Produit par `python3 run.py` (aucune graine : le modèle est déterministe). Détail : [`trajectoires.csv`](trajectoires.csv), [`comparaison.csv`](comparaison.csv). Méthode et hypothèses : [`METHODE.md`](METHODE.md).", "",
           "> **Ordres de grandeur conditionnels, jamais des prédictions.** Chaque ligne répond à « que donne la démographie *si* la fécondité, la mortalité et le solde migratoire suivent ces hypothèses ? ».", "",
           "## 1. Jeu d'hypothèses de l'Insee 2026 (`[^insee2026]`)", "",
           "| Scénario | Population 2050 (M) | Population 2070 (M) | Part 65+ 2070 | Part 75+ 2070 | 20-64 pour 1 personne de 65+ (2070) | Retraités 2070 (M, âge de départ relevé / constant) |", "|---|---|---|---|---|---|---|"]
    for sc in m.SCENARIOS_COMBINES:
        e = res[("insee2026", sc)]
        i50, i70 = m.indicateurs(e[2050]["pop"]), m.indicateurs(e[2070]["pop"], m.age_depart_reforme(2070))
        rc = m.nb_retraites(e[2070]["pop"], m.age_depart_constant(2070))
        out.append(f"| {sc.replace('_', ' ')} | {v(i50['population'] / 1e6)} | {v(i70['population'] / 1e6)} | {v(100 * i70['part_65_plus'])} % | {v(100 * i70['part_75_plus'])} % | {v(i70['ratio_20_64_sur_65_plus'], 2)} | {v(i70['retraites'] / 1e6)} / {v(rc / 1e6)} |")
    out += ["", "Population en 2025 : 68,9 M (point de départ). Part des 65+ en 2025 : %s %% ; 75+ : %s %% ; 20-64 pour 1 personne de 65+ : %s ; retraités approximatifs : %s M." % tuple(
        [v(100 * m.indicateurs(res[("insee2026", "central")][2025]["pop"])["part_65_plus"]), v(100 * m.indicateurs(res[("insee2026", "central")][2025]["pop"])["part_75_plus"]),
         v(m.indicateurs(res[("insee2026", "central")][2025]["pop"])["ratio_20_64_sur_65_plus"], 2), v(m.indicateurs(res[("insee2026", "central")][2025]["pop"], m.age_depart_reforme(2025))["retraites"] / 1e6)]), ""]
    out += ["## 2. Jeu d'hypothèses de l'Insee 2021-2070 (fécondité 1,8, solde +70 000), appliqué depuis 2025", "",
            "| Scénario | Population 2050 (M) | Population 2070 (M) | Part 65+ 2070 | 20-64 pour 1 personne de 65+ (2070) |", "|---|---|---|---|---|"]
    for sc in ("central", "population_basse", "population_haute", "population_agee", "population_jeune"):
        e = res[("insee2021", sc)]
        i50, i70 = m.indicateurs(e[2050]["pop"]), m.indicateurs(e[2070]["pop"])
        out.append(f"| {sc.replace('_', ' ')} | {v(i50['population'] / 1e6)} | {v(i70['population'] / 1e6)} | {v(100 * i70['part_65_plus'])} % | {v(i70['ratio_20_64_sur_65_plus'], 2)} |")
    out += ["", "L'écart entre les deux tableaux, c'est surtout la fécondité : 1,80 supposé en 2021 contre 1,56 observé en 2025 (`[^insee2026]`). Ce que coûte l'écart de fécondité à lui seul, à solde et mortalité centraux de l'Insee 2026, se lit aux lignes « fécondité basse » et « fécondité haute » du premier tableau.", "",
            "## 3. Comparaison avec les chiffres publiés (écarts du modèle, en % du publié)", "", "| Source | Indicateur | Année | Modèle | Publié | Écart | Unité |", "|---|---|---|---|---|---|---|"]
    for r in comp:
        out.append("| " + " | ".join(str(x).replace(".", ",") if k in (3, 4, 5) else str(x) for k, x in enumerate(r)) + " |")
    out += ["", "## 4. Sensibilité au profil d'âge des migrants (scénario central Insee 2026)", "",
            "| Profil du solde migratoire | Population 2070 (M) | 20-64 ans 2070 (M) | 65+ 2070 (M) | 20-64 pour 1 personne de 65+ (2070) |", "|---|---|---|---|---|"]
    for pm, lib in (("residus", "résidus de la projection Eurostat (défaut)"), ("stylise", "stylisé, concentré à 18-34 ans (hypothèse H8 bis)")):
        e = m.projeter_scenario(pays, m.INSEE_2026, m.jeu_combine("central"), profil_migration=pm)
        i = m.indicateurs(e[2070]["pop"])
        out.append(f"| {lib} | {v(i['population'] / 1e6)} | {v(i['20_64'] / 1e6)} | {v(i['65_plus'] / 1e6)} | {v(i['ratio_20_64_sur_65_plus'], 2)} |")
    out += ["", "## 5. Retraités approximatifs, scénario central Insee 2026 (millions, personnes touchant une pension de droit direct)", "",
            "| Année | Âge moyen de départ relevé (62,5 puis 64,0 en 2032) | Âge moyen de départ constant (62,5) | 20-64 ans par retraité (relevé) | 20-64 ans par retraité (constant) |", "|---|---|---|---|---|"]
    for y in (2025, 2030, 2035, 2040, 2050, 2060, 2070):
        pp = res[("insee2026", "central")][y]["pop"]
        a, c = m.nb_retraites(pp, m.age_depart_reforme(y)), m.nb_retraites(pp, m.age_depart_constant(y))
        t = m.somme_ages(pp, 20, 64)
        out.append(f"| {y} | {v(a / 1e6)} | {v(c / 1e6)} | {v(t / a, 2)} | {v(t / c, 2)} |")
    out += ["", "Lecture : les deux colonnes encadrent l'effet du relèvement de l'âge de départ sur le *nombre* de retraités, pas sur leurs pensions. Les « 20-64 ans par retraité » ne sont pas le « ratio cotisants/retraités » du COR (voir `METHODE.md`, section 5).", "", "Lecture : les écarts sur la population totale restent de l'ordre de 1 à 3 % pour les scénarios centraux, et montent à 5-10 % pour les scénarios extrêmes en 2070. Explications dans [`METHODE.md`](METHODE.md), section 5.", ""]
    chemin = os.path.join(ICI, "RESULTATS.md")
    ancien = open(chemin, encoding="utf-8").read() if os.path.exists(chemin) else ""
    texte = "\n".join(out)
    if "<!-- EMPLOI:DEBUT -->" in ancien:   # section produite par run_emploi.py : on la conserve
        texte += "\n\n" + ancien[ancien.index("<!-- EMPLOI:DEBUT -->"):]
    open(chemin, "w", encoding="utf-8").write(texte)
    print("ok", len(lignes), "lignes ;", len(comp), "comparaisons")


if __name__ == "__main__":
    main()
