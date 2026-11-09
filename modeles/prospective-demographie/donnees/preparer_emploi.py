# -*- coding: utf-8 -*-
"""Prépare les CSV du module « emploi et cotisants » (T34) à partir des sources ouvertes.
Usage : $DONNEES/.venv/bin/python -I preparer_emploi.py [dossier_sources]
Entrées (défaut $DONNEES/sources/t34-emploi/) : e_lfsa_*.json et e_une_rt_a.json (API Eurostat, enquête sur les forces de travail,
France), fichiers COR du rapport annuel de juin 2026 (xlsx publiés sur cor-retraites.fr : cor_donnees_RA2026_P1/P2/P4, cor_donnees_complementaires_2026,
cor_hyp_sexe_age_2026). Python standard seulement. Voir LISEZMOI.md pour les commandes de téléchargement."""
import csv, json, os, re, sys, zipfile
import xml.etree.ElementTree as ET

ICI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "$DONNEES/sources/t34-emploi")
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


def num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def series_par_ligne(rows, i_entete):
    """Lignes de données sous une ligne d'en-tête d'années : (étiquette, {année: valeur}). Étiquette : colonnes A, B ou C (texte non numérique)."""
    cols = {c: int(v) for c, v in rows[i_entete].items() if re.fullmatch(r"(19|20)\d\d", v)}
    for r in rows[i_entete + 1:]:
        if not r:
            continue
        etiq = next((r[c] for c in ("A", "B", "C") if c in r and num(r[c]) is None), None)
        vals = {a: num(r[c]) for c, a in cols.items() if c in r and num(r[c]) is not None}
        if etiq and vals:
            yield etiq.strip(), vals


def main():
    # --- Eurostat : enquête emploi (France), taux et effectifs par sexe et tranche d'âge
    lignes = []
    noms = {"lfsa_argan": "taux_activite_pct", "lfsa_ergan": "taux_emploi_pct", "lfsa_urgan": "taux_chomage_pct", "lfsa_agan": "actifs_milliers", "lfsa_egan": "emploi_milliers"}
    for code, nom in noms.items():
        for c, v in jsonstat(os.path.join(SRC, f"e_{code}.json")):
            lignes.append([nom, c["sex"], c["age"], c["time"], v])
    lignes.sort()
    ecrire("eurostat_emploi_FR.csv", ["indicateur", "sexe", "age", "annee", "valeur"], lignes)
    ecrire("eurostat_chomage_FR.csv", ["annee", "taux_chomage_15_74_pct"], sorted([[c["time"], v] for c, v in jsonstat(os.path.join(SRC, "e_une_rt_a.json"))]))

    # --- COR : hypothèses par sexe, tranche d'âge et chômage de long terme (5, 7, 10 %)
    hs = lire_xlsx(os.path.join(SRC, "cor_hyp_sexe_age_2026.xlsx"))
    lignes = []
    for u in (5, 7, 10):
        for grandeur, pre in (("emploi", "Emploi"), ("chomage", "Chômage")):
            rows = hs[f"{pre}_{u}%"]
            ent = next(i for i, r in enumerate(rows) if r.get("A") == "Année")
            noms_c = {c: v for c, v in rows[ent].items() if re.fullmatch(r"[FH]\d\dS", v)}
            for r in rows[ent + 1:]:
                if "A" not in r or num(r["A"]) is None:
                    continue
                for c, nm in noms_c.items():
                    lignes.append([u, grandeur, int(float(r["A"])), nm[0], int(nm[1:3]), round(float(r[c]), 4)])
    ecrire("cor_hypotheses_emploi.csv", ["chomage_long_terme_pct", "grandeur", "annee", "sexe", "age_debut_tranche", "taux_pct"], lignes)

    # --- COR : taux d'activité par âge (figure 1.8)
    p1 = lire_xlsx(os.path.join(SRC, "cor_donnees_RA2026_P1.xlsx"))
    rows, lignes, sexe = p1["Fig 1.8"], [], None
    for r in rows:
        if r.get("A") in ("Femmes", "Hommes"):
            sexe = "F" if r["A"] == "Femmes" else "M"
        if sexe and "B" in r and re.match(r"(\d\d)-(\d\d)|>70", r["B"].strip()) and "D" in r:
            age = 70 if r["B"].strip().startswith(">") else int(r["B"][:2])
            lignes.append([sexe, age] + [round(float(r[c]), 3) for c in "CDEF"])
    ecrire("cor_activite_age.csv", ["sexe", "age_debut_tranche", "1975", "2025", "2050", "2070"], lignes)

    # --- COR : croissance annuelle moyenne de la population active par période (tableau 1.2)
    t12 = p1["Tab 1.2"]
    ent = next(r for r in t12 if r.get("C") == "2012-2022")
    ligne = next(r for r in t12 if r.get("B") == "Population active")
    ecrire("cor_pop_active_decennal.csv", ["periode", "croissance_annuelle_moyenne"], [[ent[c], round(float(ligne[c]), 6)] for c in "CDEFG"])

    # --- COR : séries macro (figures 1.5, 1.11, 1.12, 1.6)
    lignes = []
    for feuille, code in (("Fig 1.5", "ratio_20_64_sur_65_plus"), ("Fig 1.11", "taux_chomage"), ("Fig 1.12", "taux_emploi_15_64"), ("Fig 1.6", "croissance_population_active")):
        rows = p1[feuille]
        ent = next(i for i, r in enumerate(rows) if sum(1 for v in r.values() if re.fullmatch(r"(19|20)\d\d", v)) > 20)
        for etiq, vals in series_par_ligne(rows, ent):
            if etiq.startswith(("Champ", "Note", "Source")):
                continue
            for a, v in sorted(vals.items()):
                lignes.append([code, etiq[:110], a, round(v, 6)])
    ecrire("cor_macro.csv", ["grandeur", "serie", "annee", "valeur"], lignes)

    # --- COR : cotisants, retraités et rapport (données complémentaires)
    cx = lire_xlsx(os.path.join(SRC, "cor_donnees_complementaires_2026.xlsx"))["Cotisants_Retraités"]
    lignes, bloc, grandeur = [], None, None
    blocs = {"Nombre de cotisants en millions": "cotisants_millions", "Rapport cotisants / retraités": "rapport_cotisants_retraites",
             "Nombre de retraités (tous retraités)": "retraites_tous_millions", "Nombre de retraités résidant en France": "retraites_residents_millions"}
    annees = {}
    for r in cx:
        if r.get("D") == "2000":
            annees = {c: int(v) for c, v in r.items() if re.fullmatch(r"20\d\d", v)}
        if "B" in r:
            for k, g in blocs.items():
                if r["B"].startswith(k):
                    grandeur = g
        if grandeur and r.get("C") in ("Obs", "Sc. Ref", "[0,7_C5]", "[0,7_C10]", "[0,4]", "[1,0]"):
            for c, a in annees.items():
                if c in r and num(r[c]) is not None:
                    lignes.append([grandeur, r["C"], a, round(float(r[c]), 6)])
    ecrire("cor_cotisants_retraites.csv", ["grandeur", "serie", "annee", "valeur"], lignes)

    # --- COR : taux de retraités par sexe et âge (droit direct, résidents), 50-70 ans
    tx = lire_xlsx(os.path.join(SRC, "cor_donnees_complementaires_2026.xlsx"))["Tx_retraités_an"]
    lignes, sexe = [], None
    annees = {c: int(v) for c, v in tx[4].items() if re.fullmatch(r"20\d\d", v)}
    for r in tx[5:]:
        if r.get("B") in ("ENSEMBLE", "FEMMES", "HOMMES", "F", "H", "Femmes", "Hommes"):
            sexe = r["B"]
        if sexe and "C" in r and num(r["C"]) is not None:
            for c, a in annees.items():
                if c in r and num(r[c]) is not None:
                    lignes.append([sexe, int(float(r["C"])), a, round(float(r[c]), 5)])
    ecrire("cor_taux_retraites.csv", ["sexe", "age", "annee", "taux"], lignes)

    # --- COR : âge conjoncturel de départ (figure 2.5)
    p2 = lire_xlsx(os.path.join(SRC, "cor_donnees_RA2026_P2.xlsx"))["Fig 2.5"]
    ent = next(i for i, r in enumerate(p2) if r.get("C") == "2000")
    ecrire("cor_age_depart.csv", ["serie", "annee", "age"], [[e, a, round(v, 3)] for e, vals in series_par_ligne(p2, ent) if e in ("Obs", "Tous scénarios") for a, v in sorted(vals.items())])


if __name__ == "__main__":
    main()
