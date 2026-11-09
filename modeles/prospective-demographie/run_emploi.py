# -*- coding: utf-8 -*-
"""Produit trajectoires_emploi.csv, comparaison_cor.csv et la section « Emploi et cotisants » de RESULTATS.md.
Usage : python3 run_emploi.py (dans ce dossier). Déterministe. Prérequis : donnees/preparer_emploi.py exécuté."""
import csv
import os
import emploi as e
import modele as m

ICI = os.path.dirname(os.path.abspath(__file__))
DEBUT, FIN = "<!-- EMPLOI:DEBUT -->", "<!-- EMPLOI:FIN -->"


def v(x, d=1):
    return f"{x:.{d}f}".replace(".", ",")


def main():
    d = e.charger_emploi()
    pays = m.charger_pays("FR")
    pops = {k: m.projeter_scenario(pays, m.INSEE_2026, m.jeu_combine(k)) for k in ("central", "population_basse", "population_haute", "population_agee", "population_jeune")}
    cal = e.calibrage(d, pops["central"][2025]["pop"])
    cot = d["cot"]
    scen = [
        ("reference_cor", {}),
        ("demographie_seule_taux_2025_figes", dict(mode="gel_2025")),
        ("chomage_structurel_5", dict(u_lt=0.05)), ("chomage_structurel_10", dict(u_lt=0.10)),
        ("age_depart_gele_2025", dict(age_depart=("gel_2025", 0))),
        ("age_depart_plus_1_an_2040", dict(age_depart=("rampe", 1.0))), ("age_depart_plus_2_ans_2040", dict(age_depart=("rampe", 2.0))),
        ("robotisation_5_sans_compensation", dict(robot=dict(r_final=0.05))),
        ("robotisation_15_sans_compensation", dict(robot=dict(r_final=0.15))),
        ("robotisation_15_compensation_50", dict(robot=dict(r_final=0.15, compensation=0.5))),
        ("robotisation_30_sans_compensation", dict(robot=dict(r_final=0.30))),
        ("robotisation_30_compensation_50", dict(robot=dict(r_final=0.30, compensation=0.5))),
        ("robotisation_30_comp_50_salaires_plus_15", dict(robot=dict(r_final=0.30, compensation=0.5, hausse_salaire_2070=0.15))),
    ]
    res, lignes = {}, []
    for pk, etat in pops.items():
        for nom, kw in scen:
            if pk != "central" and nom != "reference_cor":
                continue
            r = e.projeter_emploi(d, etat, cal, **kw)
            res[(pk, nom)] = r
            for t in range(e.A0, e.AN + 1):
                i = r[t]
                lignes.append([nom, pk, t, round(i["population"]), round(i["pop_15_64"]), round(i["actifs"]), round(i["emploi"]), round(i["chomeurs"]), round(i["taux_activite_15_64"], 4),
                               round(i["taux_emploi_15_64"], 4), round(i["taux_chomage"], 4), round(i["cotisants"]), round(i["retraites_tous"]), round(i["rapport_cotisants_retraites"], 4),
                               round(i["rapport_masse_retraites"], 4), round(i["delta_age_depart"], 3)])
    with open(os.path.join(ICI, "trajectoires_emploi.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["scenario_emploi", "scenario_population", "annee", "population", "pop_15_64", "population_active", "emploi", "chomeurs", "taux_activite_15_64", "taux_emploi_15_64", "taux_chomage",
                    "cotisants", "retraites_tous_regimes", "rapport_cotisants_retraites", "rapport_masse_salariale_retraites", "ecart_age_depart_vs_cor_ans"])
        w.writerows(lignes)

    # ---- comparaison au COR
    ref = res[("central", "reference_cor")]
    comp = []

    def ajoute(ind, annee, mod, pub, unite):
        comp.append([ind, annee, round(mod, 4), round(pub, 4), round(100 * (mod / pub - 1), 2), unite])

    for t in (2025, 2030, 2040, 2050, 2060, 2070):
        ajoute("cotisants (COR, scénario de référence)", t, ref[t]["cotisants"] / 1e6, cot[("cotisants_millions", "Sc. Ref")][t], "millions")
        ajoute("retraités, tous régimes (COR)", t, ref[t]["retraites_tous"] / 1e6, cot[("retraites_tous_millions", "Sc. Ref")][t], "millions")
        ajoute("rapport cotisants / retraités (COR)", t, ref[t]["rapport_cotisants_retraites"], cot[("rapport_cotisants_retraites", "Sc. Ref")][t], "rapport")
    for t in (2030, 2050, 2070):
        ajoute("20-64 ans par personne de 65+ (Insee via COR, fig. 1.5)", t, m.somme_ages(pops["central"][t]["pop"], 20, 64) / m.somme_ages(pops["central"][t]["pop"], 65),
               d["macro"][("ratio_20_64_sur_65_plus", "projections 2026-2070 - scénario central")][t], "rapport")
    for t in (2025, 2050, 2070):
        ajoute("taux d'emploi 15-64 ans (COR fig. 1.12 ; dénominateurs différents)", t, ref[t]["taux_emploi_15_64"], d["macro"][("taux_emploi_15_64", "Scénario de référence 7%")][t], "fraction")
    p = e.pyramide_insee(2070)
    i = e.calculer(d, p, 2070)
    ajoute("rapport 2070 avec la pyramide Insee 2026 (au lieu de celle du modèle)", 2070, cal["kappa"] * i["emploi"] / (i["retraites_residents"] * cal["lam"]), cot[("rapport_cotisants_retraites", "Sc. Ref")][2070], "rapport")
    eu = sum(d["eu"][("emploi_milliers", s, "Y15-74", 2025)] for s in ("M", "F")) / 1e3
    ajoute("emploi 2025 du modèle contre Eurostat (15-74 ans, enquête Emploi)", 2025, ref[2025]["emploi"] / 1e6, eu, "millions")
    for sc, lib in (("[0,7_C5]", "chômage 5 %"), ("[0,7_C10]", "chômage 10 %")):
        k = "chomage_structurel_" + lib.split()[1]
        ajoute(f"rapport cotisants / retraités 2070, variante COR {lib}", 2070, res[("central", k)][2070]["rapport_cotisants_retraites"], cot[("rapport_cotisants_retraites", sc)][2070], "rapport")
    a = lambda t: ref[t]["actifs"]
    pa = {r["periode"]: float(r["croissance_annuelle_moyenne"]) for r in csv.DictReader(open(os.path.join(e.DONNEES, "cor_pop_active_decennal.csv"), encoding="utf-8"))}
    for (x, y, per) in ((2025, 2033, "2023-2033"), (2033, 2044, "2034-2044"), (2044, 2055, "2045-2055"), (2055, 2066, "2056-2066")):
        g = (a(y) / a(x)) ** (1 / (y - x)) - 1
        comp.append([f"croissance annuelle de la population active, {per} (modèle : {x}-{y})", y, round(100 * g, 3), round(100 * pa[per], 3), round(100 * (g - pa[per]), 3), "% par an (écart en points)"])
    with open(os.path.join(ICI, "comparaison_cor.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["indicateur", "annee", "modele", "cor_ou_publie", "ecart_pct", "unite"])
        w.writerows(comp)

    # ---- RESULTATS.md (section)
    out = [DEBUT, "", "## 6. Emploi et cotisants (module `emploi.py`, T34)", "",
           "Produit par `python3 run_emploi.py` ; détail : [`trajectoires_emploi.csv`](trajectoires_emploi.csv), [`comparaison_cor.csv`](comparaison_cor.csv). Hypothèses H13 à H20 dans [`METHODE.md`](METHODE.md) (section 8). **Ordres de grandeur conditionnels, jamais des prédictions.**", "",
           "### 6.1 Population active, emploi, cotisants et retraités (scénario de référence : population Insee 2026 centrale, hypothèses d'emploi COR à chômage de long terme 7 %)", "",
           "| Année | Population 15-64 (M) | Population active (M) | Emploi (M) | Taux d'emploi 15-64 | Cotisants (M) | Retraités, tous régimes (M) | Cotisants par retraité | Valeur COR (juin 2026) | Écart |", "|---|---|---|---|---|---|---|---|---|---|"]
    for t in (2025, 2030, 2040, 2050, 2060, 2070):
        r = ref[t]
        c = cot[("rapport_cotisants_retraites", "Sc. Ref")][t]
        out.append(f"| {t} | {v(r['pop_15_64'] / 1e6)} | {v(r['actifs'] / 1e6)} | {v(r['emploi'] / 1e6)} | {v(100 * r['taux_emploi_15_64'])} % | {v(r['cotisants'] / 1e6)} | {v(r['retraites_tous'] / 1e6)} | {v(r['rapport_cotisants_retraites'], 2)} | {v(c, 2)} | {v(100 * (r['rapport_cotisants_retraites'] / c - 1))} % |")
    out += ["", "Lecture : le modèle retrouve les cotisants du COR à 1 % près jusqu'en 2050 et à ‑1,1 % en 2070 (28,5 M contre 28,8 M) ; l'écart sur le rapport cotisants/retraités (−2,8 % en 2070 : 1,27 contre 1,30) vient surtout de la population (voir 6.4). Cotisants par retraité : 1,76 en 2025, 1,27 en 2070 : le rapport baisse de 28 %, quand le rapport démographique 20-64 / 65+ baisse de 37 % (2,51 à 1,58) : l'emploi des seniors amortit une partie du choc.", "",
            "### 6.2 Leviers, effets sur 2050 et 2070 (population centrale)", "",
            "| Scénario | Cotisants 2050 (M) | Cotisants 2070 (M) | Retraités 2070 (M) | Cotisants par retraité 2050 | Cotisants par retraité 2070 | Écart à la référence en 2070 |", "|---|---|---|---|---|---|---|"]
    for nom in ("reference_cor", "demographie_seule_taux_2025_figes", "chomage_structurel_5", "chomage_structurel_10", "age_depart_gele_2025", "age_depart_plus_1_an_2040", "age_depart_plus_2_ans_2040"):
        r = res[("central", nom)]
        out.append(f"| {nom.replace('_', ' ')} | {v(r[2050]['cotisants'] / 1e6)} | {v(r[2070]['cotisants'] / 1e6)} | {v(r[2070]['retraites_tous'] / 1e6)} | {v(r[2050]['rapport_cotisants_retraites'], 2)} | {v(r[2070]['rapport_cotisants_retraites'], 2)} | {v(r[2070]['rapport_cotisants_retraites'] - ref[2070]['rapport_cotisants_retraites'], 2)} |")
    out += ["", "Lecture : (i) à taux d'activité et de retraite figés à leur niveau de 2025, le rapport tomberait à 1,13 en 2070 : le relèvement de l'âge de départ et l'emploi des seniors supposés par le COR pèsent environ 0,13 point de rapport ; (ii) chaque point de chômage de long terme pèse environ 0,014 point de rapport en 2070 (1,30 à 5 %, 1,23 à 10 % : écart de 0,07 pour 5 points) ; (iii) un an d'âge effectif de départ en plus (atteint en 2040) vaut environ 0,09 point de rapport en 2070, soit environ six fois l'effet d'un point de chômage ; (iv) le gel de l'âge effectif à son niveau de 2025 (63,1 ans, contre 64,6 dans la trajectoire du COR) retire 0,12 point.", "",
            "### 6.3 Scénarios de population (hypothèses d'emploi du COR inchangées)", "",
            "| Scénario de population (Insee 2026) | Cotisants 2070 (M) | Cotisants par retraité 2050 | Cotisants par retraité 2070 |", "|---|---|---|---|"]
    for pk in pops:
        r = res[(pk, "reference_cor")]
        out.append(f"| {pk.replace('_', ' ')} | {v(r[2070]['cotisants'] / 1e6)} | {v(r[2050]['rapport_cotisants_retraites'], 2)} | {v(r[2070]['rapport_cotisants_retraites'], 2)} |")
    out += ["", "### 6.4 Comparaison avec le COR et explication des écarts", "", "| Indicateur | Année | Modèle | COR ou publié | Écart | Unité |", "|---|---|---|---|---|---|"]
    for r in comp:
        out.append("| " + " | ".join(str(x).replace(".", ",") if k in (2, 3, 4) else str(x) for k, x in enumerate(r)) + " |")
    out += ["", "**Explication des écarts (estimations).** (1) *Population* : avec la pyramide de l'Insee 2070 à la place de celle du modèle, le rapport vaut 1,298 contre 1,305 pour le COR (−0,5 %) : environ 80 % de l'écart de 2070 (−2,8 %) vient donc de la structure par âge du modèle (20-64 ans −2,7 % par rapport à l'Insee, voir `METHODE.md` section 5, profil d'âge des migrants). (2) *Définitions* : les cotisants du COR (30,6 M en 2025) sont des cotisants à au moins un régime, pas des personnes en emploi au sens du BIT (28,9 M dans le modèle, 29,3 M selon Eurostat pour les 15-74 ans) ; le modèle les relie par un coefficient fixe de 1,06 (H16), qui ne tient pas compte d'une évolution du multi-emploi ou du cumul emploi-retraite (le COR publie ses hypothèses de cumul, non reprises ici). (3) *Taux d'emploi 15-64 ans* : 67,3 % dans le modèle en 2025 contre 69,3 % chez le COR, parce que le modèle divise par la population totale résidente et non par celle des ménages ordinaires de l'enquête Emploi (écart de dénominateur, pas d'emploi). (4) *Retraités* : le modèle applique les taux de retraités par âge du COR (50-70 ans, taux de 70 ans étendu au-delà) aux populations du modèle et dépasse le nombre de retraités du COR de 1,7 % en 2070 (retraités résidant en France : 21,4 M contre 20,8 M ; avec la pyramide Insee : 21,5 M). Le surplus ne vient donc pas de la population ; cause non identifiée (hypothèses : l'extension du taux de 70 ans aux âges élevés, l'absence d'effet de génération, et le passage résidents → tous régimes par un coefficient constant de 1,053 alors que le COR le fait varier de 1,053 à 1,075 puis 1,064). Ce surplus de retraités et la sous-estimation des cotisants par la population du modèle jouent dans le même sens sur le rapport, la première pour environ −1,7 point et la seconde pour environ −1,1 point en 2070, partiellement compensées par un excès de cotisants (+1,8 % avec la pyramide Insee). (5) *Lissage par âge* : les taux par tranche de 5 ans sont lissés par âge simple, sans effet de génération. (6) *Population active* : croissance annuelle moyenne proche de celle du COR après 2044 (−0,35 % contre −0,35 %, puis −0,42 % contre −0,44 %), plus faible avant (0,33 % sur 2025-2033 contre 0,49 % sur 2023-2033 ; 0,01 % contre 0,06 % sur 2034-2044) : les trois premières années du COR (2023-2025) sont hors modèle et la population de 15-24 ans du modèle croît moins.", "",
            "### 6.5 Variante « robotisation » (baisse du besoin d'emploi : hypothèse, pas prédiction)", "",
            "Mécanisme : à partir de 2030, une part r des emplois du scénario de référence cesse d'être nécessaire, en rampe logistique jusqu'à r en 2060 ; une part c (compensation) est recréée ailleurs ; la perte nette r(1−c) se répartit pour moitié en chômage, pour moitié en sortie d'activité. Les bornes de r sont des ordres de grandeur issus de `sources/recherche-ia-robotique.md` (Goldman Sachs : 9 % des emplois américains déplacés en 10 ans ⚠️ ; Banque mondiale : 14,2 % d'emplois à risque dans les pays riches ⚠️ ; OIT : 3,3 % dans la catégorie la plus exposée) : 5 %, 15 %, 30 % (le dernier est un test de résistance, hors de ces sources).", "",
            "| Scénario | Emploi 2070 (M) | Taux de chômage 2070 | Cotisants par retraité 2070 | Masse salariale par retraité (indice, mêmes unités) |", "|---|---|---|---|---|"]
    for nom in ("reference_cor", "robotisation_5_sans_compensation", "robotisation_15_sans_compensation", "robotisation_15_compensation_50", "robotisation_30_sans_compensation", "robotisation_30_compensation_50", "robotisation_30_comp_50_salaires_plus_15"):
        r = res[("central", nom)][2070]
        out.append(f"| {nom.replace('_', ' ')} | {v(r['emploi'] / 1e6)} | {v(100 * r['taux_chomage'])} % | {v(r['rapport_cotisants_retraites'], 2)} | {v(r['rapport_masse_retraites'], 2)} |")
    out += ["", "Lecture : le choc démographique fait passer le rapport de 1,76 à 1,27 ; une robotisation nette de 15 % l'amène à 1,08 (−0,19), soit une fois et demie l'effet du gel de l'âge de départ (−0,12) ; elle relève le chômage de 7 % à 15 %. Avec une compensation de moitié, le rapport est 1,17. La variante ne dit rien du *niveau* de la masse salariale : si les salaires par emploi restants montent (dernière ligne : +15 % en 2070), la masse salariale par retraité remonte, mais pas le nombre de cotisants ; le financement d'un régime par répartition dépend de la masse salariale, pas du nombre de têtes. Ces résultats ne tiennent compte ni du financement par d'autres assiettes (capital, valeur ajoutée), ni de la réponse de la fécondité ou des migrations, ni du fait que moins d'emplois peut vouloir dire un âge de départ plus bas.", "", FIN, ""]
    section = "\n".join(out)
    chemin = os.path.join(ICI, "RESULTATS.md")
    txt = open(chemin, encoding="utf-8").read()
    if DEBUT in txt:
        txt = txt[:txt.index(DEBUT)] + section + txt[txt.index(FIN) + len(FIN):].lstrip("\n")
    else:
        txt = txt.rstrip("\n") + "\n\n" + section
    open(chemin, "w", encoding="utf-8").write(txt)
    print("ok", len(lignes), "lignes ;", len(comp), "comparaisons")


if __name__ == "__main__":
    main()
