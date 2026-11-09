# -*- coding: utf-8 -*-
"""Prépare les CSV du modèle démographique à partir des sources ouvertes téléchargées.
Usage : $DONNEES/.venv/bin/python -I preparer_donnees.py [dossier_sources] [pays Eurostat, défaut FR ; les fichiers eu_*.json doivent avoir été téléchargés pour ce pays]
Entrées (dossier_sources, défaut $DONNEES/sources/t34-demo/) : eu_pop_age.json, eu_mort.json,
eu_fert.json, eu_bal.json (API Eurostat proj_23np, proj_23naasmr, proj_23naasfr, proj_23ndbi), ip2108.xlsx (Insee Première 2108, projections 2026),
ip1881.xlsx (Insee Première 1881, projections 2021-2070). Python standard seulement (lecteur xlsx minimal inclus)."""
import csv, json, os, re, sys, zipfile
import xml.etree.ElementTree as ET

ICI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "$DONNEES/sources/t34-demo")
GEO = sys.argv[2] if len(sys.argv) > 2 else "FR"
N = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def lire_xlsx(chemin):
    z = zipfile.ZipFile(chemin)
    ss = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", N):
            ss.append("".join(t.text or "" for t in si.iter("{%s}t" % N["m"])))
    noms = [s.get("name") for s in ET.fromstring(z.read("xl/workbook.xml")).find("m:sheets", N)]
    out = {}
    for i, nom in enumerate(noms, 1):
        rows = []
        for r in ET.fromstring(z.read(f"xl/worksheets/sheet{i}.xml")).iter("{%s}row" % N["m"]):
            row = {}
            for c in r.findall("m:c", N):
                v = c.find("m:v", N)
                if v is None:
                    continue
                col = re.match("[A-Z]+", c.get("r")).group()
                row[col] = ss[int(v.text)] if c.get("t") == "s" else v.text
            rows.append(row)
        out[nom] = rows
    return out


def ecrire(nom, entete, lignes):
    with open(os.path.join(ICI, nom), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(entete)
        w.writerows(lignes)
    print(nom, len(lignes), "lignes")


def jsonstat(chemin):
    """Itère (coordonnées {dimension: code}, valeur) d'un fichier JSON-stat Eurostat."""
    d = json.load(open(chemin))
    ids, size = d["id"], d["size"]
    cats = [list(d["dimension"][k]["category"]["index"].items()) for k in ids]
    cats = [[c for c, _ in sorted(x, key=lambda t: t[1])] for x in cats]
    for k, v in d["value"].items():
        k = int(k)
        coord = {}
        for dim, n, cs in zip(reversed(ids), reversed(size), reversed(cats)):
            coord[dim] = cs[k % n]
            k //= n
        yield coord, v


def age_num(a):
    """Âge en années pour les âges simples ; Y_LT1 = 0, Y_GE100 = 100 (ouvert), Y_GE50 = 50 (fécondité). Les agrégats (Y_GE75, Y15-64...) sont ignorés."""
    if a == "Y_LT1":
        return 0
    if a in ("Y_GE100", "Y_GE50"):
        return int(a[4:])
    return int(a[1:]) if re.fullmatch(r"Y\d+", a) else None


def eurostat():
    deb, fin = 2025, 2070
    L = []
    for c, v in jsonstat(os.path.join(SRC, "eu_pop_age.json")):
        if age_num(c["age"]) is None or c["age"] == "Y_LT15" or not deb <= int(c["time"]) <= fin:
            continue
        L.append((c["projection"], c["sex"], age_num(c["age"]), int(c["time"]), int(v)))
    L.sort()
    ecrire(f"europop_{GEO}_population.csv", ["projection", "sexe", "age", "annee", "population_au_1er_janvier"], L)
    L = []
    for c, v in jsonstat(os.path.join(SRC, "eu_mort.json")):
        if age_num(c["age"]) is not None and deb <= int(c["time"]) <= fin:
            L.append((c["sex"], age_num(c["age"]), int(c["time"]), v))
    L.sort()
    ecrire(f"europop_{GEO}_mortalite.csv", ["sexe", "age", "annee", "taux_de_deces"], L)
    L = []
    for c, v in jsonstat(os.path.join(SRC, "eu_fert.json")):
        if age_num(c["age"]) is not None and c["age"] != "Y_LT15" and deb <= int(c["time"]) <= fin:
            L.append((age_num(c["age"]), int(c["time"]), v))
    L.sort()
    ecrire(f"europop_{GEO}_fecondite.csv", ["age", "annee", "taux_de_fecondite"], L)
    L = []
    for c, v in jsonstat(os.path.join(SRC, "eu_bal.json")):
        if c["indic_de"] in ("JAN", "LBIRTH", "DEATH", "NMIGRAT", "OLDDEP3", "PC_Y65_MAX", "PC_Y80_MAX", "PC_Y20_64", "MEDAGEPOP") and 2022 <= int(c["time"]) <= fin:
            L.append((c["projection"], c["indic_de"], int(c["time"]), v))
    L.sort()
    ecrire(f"europop_{GEO}_bilan.csv", ["projection", "indicateur", "annee", "valeur"], L)


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def insee():
    a = lire_xlsx(os.path.join(SRC, "ip2108.xlsx"))
    b = lire_xlsx(os.path.join(SRC, "ip1881.xlsx"))
    # Pyramides : 2026 et 2070 (projections 2026) ; 2021 et 2070 (projections 2021-2070)
    L = []
    for r in a["Figure 4"]:
        if r.get("A", "").strip().isdigit() or "plus" in r.get("A", ""):
            age = int(re.match(r"\d+", r["A"]).group())
            L.append(("2026", age, r["B"], r["C"], r["D"], r["E"]))
    ecrire("insee2026_pyramide.csv", ["serie", "age", "hommes_2026", "hommes_2070", "femmes_2026", "femmes_2070"], L)
    L = []
    for r in b["Figure 4"]:
        if r.get("A", "").strip().isdigit() or "plus" in r.get("A", ""):
            age = int(re.match(r"\d+", r["A"]).group())
            L.append(("2021", age, r["C"], r["D"], r["F"], r["G"]))
    ecrire("insee2021_pyramide.csv", ["serie", "age", "hommes_2021", "hommes_2070", "femmes_2021", "femmes_2070"], L)
    # Population totale par scénario (millions)
    sc26 = ["central", "fecondite_basse", "fecondite_haute", "esperance_vie_basse", "esperance_vie_haute", "migration_basse", "migration_haute", "population_basse", "population_haute"]
    cols = "CDEFGHIJK"
    L = []
    for r in a["Figure 3"]:
        if r.get("A", "").isdigit() and int(r["A"]) >= 2026 and num(r.get("C")) is not None:
            L.append([r["A"]] + [r[c] for c in cols])
    ecrire("insee2026_population_scenarios.csv", ["annee"] + sc26, L)
    L = []
    for r in b["Figure 3"]:
        if r.get("A", "").isdigit() and int(r["A"]) >= 2021 and num(r.get("C")) is not None:
            L.append([r["A"]] + [r[c] for c in cols])
    ecrire("insee2021_population_scenarios.csv", ["annee"] + sc26, L)
    # Structure par âge 2026 (millions) : 0-19, 20-44, 45-64, 65+, 80+
    L = []
    for r in a["Figure 5"]:
        if r.get("A", "").isdigit() and int(r["A"]) >= 2026 and num(r.get("G")) is not None:
            L.append([r["A"]] + [r[c] for c in "GHIJK"])
    ecrire("insee2026_structure_age.csv", ["annee", "moins_20_ans", "20_44", "45_64", "65_plus", "80_plus"], L)
    # Rapport de dépendance (65+ pour 100 personnes de 20-64), 2026
    L = []
    for r in a["Figure 6"]:
        if r.get("A", "").isdigit() and int(r["A"]) >= 2026 and num(r.get("C")) is not None:
            L.append([r["A"]] + [r.get(c, "") for c in "CDEFGH"])
    ecrire("insee2026_dependance.csv", ["annee", "central", "esperance_vie_basse", "esperance_vie_haute", "population_jeune", "population_agee", "esperance_vie_constante"], L)
    L = []
    for r in b["Figure 6"]:
        if r.get("A", "").isdigit() and int(r["A"]) >= 2021 and num(r.get("C")) is not None:
            L.append([r["A"]] + [r.get(c, "") for c in "CDEFGH"])
    ecrire("insee2021_dependance.csv", ["annee", "central", "esperance_vie_basse", "esperance_vie_haute", "population_jeune", "population_agee", "esperance_vie_constante"], L)
    # Naissances, décès, solde migratoire 2026
    L = []
    for r in a["Figure 2"]:
        if r.get("A", "").isdigit() and int(r["A"]) >= 2026 and num(r.get("G")) is not None:
            L.append([r["A"]] + [r[c] for c in "GHIJK"])
    ecrire("insee2026_mouvements.csv", ["annee", "deces", "naissances", "solde_naturel", "solde_migratoire", "variation"], L)
    # 65+ par tranche, 2021 (personnes)
    L = []
    for r in b["Figure 5c"]:
        if r.get("A", "").isdigit() and int(r["A"]) >= 2021:
            L.append([r["A"], r["B"], r["C"], r["D"]])
    ecrire("insee2021_65plus.csv", ["annee", "65_74", "75_84", "85_plus"], L)
    L = []
    for r in b["Figure 5a"]:
        if r.get("A", "").isdigit() and int(r["A"]) >= 2021:
            L.append([r["A"], r["B"], r["C"], r["D"]])
    ecrire("insee2021_structure_pct.csv", ["annee", "0_19", "20_64", "65_plus"], L)


if __name__ == "__main__":
    eurostat()
    if GEO == "FR":
        insee()
