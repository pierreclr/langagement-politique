# -*- coding: utf-8 -*-
"""T57 : « France face à l'UE-27 » : rangs de la France sur les dépenses (COFOG), la fiscalité (Eurostat, DG TAXUD),
la concurrence fiscale sur les sociétés (taux légaux OCDE, profits transférés TWZ) et les infractions au droit de l'UE.
Entrées (téléchargées le 03/11/2026, voir --telecharger) :
  $DONNEES/sources/eurostat/t57c/ : cofog.json (gov_10a_exp, % PIB, S13), taxag.json (gov_10a_taxag), wedge.json (earn_nt_taxwedge)
  $DONNEES/sources/europe/t57c/ : TaxTrends2026_Part2_country_profiles.xlsx (DG TAXUD, « Taxation trends » 2026),
     oecd_cit.csv (OCDE, Corporate Tax Statistics, DF_CIT), TWZ2022.xlsx (Tørsløv-Wier-Zucman, Table 3, données 2015)
  sources/calculs/infractions_ue_2026_resultats.txt (stock de procédures d'infraction ouvertes, déjà calculé)
Rang : 1 = valeur la plus élevée des 27 États membres (sauf mention). L'UE-27 est celle publiée par la source (ou une moyenne simple, dite).
Usage : python3 -I eurostat_synthese_ue.py [--telecharger] [--ecrire]   (--ecrire : écrit eurostat_synthese_ue_resultats.txt)
Aucun module hors bibliothèque standard (lecteur xlsx minimal inclus)."""
import csv, json, os, re, sys, zipfile
from xml.etree import ElementTree as ET

ES = os.path.expandvars("$DONNEES/sources/eurostat/t57c")
EU = os.path.expandvars("$DONNEES/sources/europe/t57c")
ICI = os.path.dirname(os.path.abspath(__file__))
PAYS = {"AT": "Autriche", "BE": "Belgique", "BG": "Bulgarie", "HR": "Croatie", "CY": "Chypre", "CZ": "Tchéquie", "DK": "Danemark",
        "EE": "Estonie", "FI": "Finlande", "FR": "France", "DE": "Allemagne", "EL": "Grèce", "HU": "Hongrie", "IE": "Irlande",
        "IT": "Italie", "LV": "Lettonie", "LT": "Lituanie", "LU": "Luxembourg", "MT": "Malte", "NL": "Pays-Bas", "PL": "Pologne",
        "PT": "Portugal", "RO": "Roumanie", "SK": "Slovaquie", "SI": "Slovénie", "ES": "Espagne", "SE": "Suède"}
ISO3 = {"AT": "AUT", "BE": "BEL", "BG": "BGR", "HR": "HRV", "CY": "CYP", "CZ": "CZE", "DK": "DNK", "EE": "EST", "FI": "FIN", "FR": "FRA",
        "DE": "DEU", "EL": "GRC", "HU": "HUN", "IE": "IRL", "IT": "ITA", "LV": "LVA", "LT": "LTU", "LU": "LUX", "MT": "MLT", "NL": "NLD",
        "PL": "POL", "PT": "PRT", "RO": "ROU", "SK": "SVK", "SI": "SVN", "ES": "ESP", "SE": "SWE"}
B = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data"
G = "&".join("geo=" + g for g in list(PAYS) + ["EU27_2020"])
TELECHARGEMENTS = {
    ES + "/cofog.json": f"{B}/gov_10a_exp?format=JSON&lang=EN&unit=PC_GDP&sector=S13&na_item=TE&{G}&time=2019&time=2023&time=2024",
    ES + "/taxag.json": f"{B}/gov_10a_taxag?format=JSON&lang=EN&unit=PC_GDP&sector=S13&{G}&time=2023&time=2024",
    ES + "/dette.json": f"{B}/gov_10dd_edpt1?format=JSON&lang=EN&unit=PC_GDP&sector=S13&na_item=GD&na_item=B9&{G}&time=2024",
    ES + "/wedge.json": f"{B}/earn_nt_taxwedge?format=JSON&lang=EN&{G}&time=2024&time=2025",
    EU + "/oecd_cit.csv": "https://sdmx.oecd.org/public/rest/data/OECD.CTP.TPS,DSD_TAX_CIT@DF_CIT,1.0/all?startPeriod=2024&endPeriod=2025",
    EU + "/TWZ2022.xlsx": "https://missingprofits.world/wp-content/uploads/2022/04/TWZ2022.xlsx",
    EU + "/TaxTrends2026_Part2_country_profiles.xlsx": "https://taxation-customs.ec.europa.eu/document/download/ff0728c1-9176-4759-b981-8872e0374416_en?filename=Part2_country_profiles.xlsx",
}


def telecharger():
    """Télécharge les jeux (curl sans en-tête truqué). L'OCDE exige l'en-tête Accept SDMX-CSV."""
    import subprocess
    for chemin, url in TELECHARGEMENTS.items():
        os.makedirs(os.path.dirname(chemin), exist_ok=True)
        cmd = ["curl", "-s", "-m", "120", "-L", "-o", chemin, "-w", "%{http_code}"]
        if chemin.endswith(".csv"):
            cmd += ["-H", "Accept: application/vnd.sdmx.data+csv; charset=utf-8"]
        print(os.path.basename(chemin), subprocess.run(cmd + [url], capture_output=True, text=True).stdout)


# --- lecteurs ---------------------------------------------------------------------------------------------------------------
def jsonstat(fichier):
    """JSON-stat Eurostat -> {(valeurs des dimensions dans l'ordre de d['id']): valeur}, avec la liste des identifiants."""
    d = json.load(open(os.path.join(ES, fichier)))
    ids, tailles = d["id"], d["size"]
    cats = []
    for k in ids:
        c = d["dimension"][k]["category"]["index"]
        cats.append(list(c) if isinstance(c, list) else [x for x, _ in sorted(c.items(), key=lambda kv: kv[1])])
    out = {}
    for flat, v in d["value"].items():
        f, pos = int(flat), []
        for t in reversed(tailles):
            pos.append(f % t)
            f //= t
        pos.reverse()
        out[tuple(cats[i][p] for i, p in enumerate(pos))] = v
    return ids, out


NSX = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}


def lignes_xlsx(chemin, feuille):
    """Lecteur xlsx minimal : liste de dicts {lettre de colonne: valeur texte}."""
    z = zipfile.ZipFile(chemin)
    ss = ["".join(t.text or "" for t in si.iter("{%s}t" % NSX["m"])) for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NSX)]
    rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))}
    for s in ET.fromstring(z.read("xl/workbook.xml")).find("m:sheets", NSX):
        if s.get("name") == feuille:
            t = rels[s.get("{%s}id" % NSX["r"])].lstrip("/")
            t = t if t.startswith("xl/") else "xl/" + t
            out = []
            for row in ET.fromstring(z.read(t)).iter("{%s}row" % NSX["m"]):
                r = {}
                for c in row.findall("m:c", NSX):
                    v = c.find("m:v", NSX)
                    if v is not None:
                        r[re.sub(r"\d", "", c.get("r"))] = ss[int(v.text)] if c.get("t") == "s" else v.text
                out.append(r)
            return out
    raise KeyError(feuille)


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


# --- jeux de données --------------------------------------------------------------------------------------------------------
COFOG = [("TOTAL", "Dépenses publiques totales"), ("GF01", "Services généraux"), ("GF0107", "  dont charge de la dette"), ("GF02", "Défense"),
         ("GF03", "Ordre et sécurité"), ("GF04", "Affaires économiques"), ("GF05", "Environnement"), ("GF06", "Logement et équipements collectifs"),
         ("GF07", "Santé"), ("GF08", "Culture, loisirs, cultes"), ("GF09", "Éducation"), ("GF10", "Protection sociale"),
         ("GF1002", "  dont vieillesse"), ("GF1001", "  dont maladie et invalidité"), ("GF1004", "  dont famille et enfants"), ("GF1005", "  dont chômage")]


def cofog(annee="2024"):
    ids, v = jsonstat("cofog.json")  # dimensions : freq, unit, sector, cofog99, na_item, geo, time
    return {code: {g: v.get(("A", "PC_GDP", "S13", code, "TE", g, annee)) for g in list(PAYS) + ["EU27_2020"]} for code, _ in COFOG}


def taxag_pib(annee="2024"):
    ids, v = jsonstat("taxag.json")
    return v, ids


def taxtrends():
    """Pour chaque pays : {(section, libellé): valeur 2024} ; sections A (type d'impôt), C (fonction économique), D, E, F (taux implicites)."""
    f = EU + "/TaxTrends2026_Part2_country_profiles.xlsx"
    res = {}
    for g in list(PAYS) + ["EU27_2020"]:
        sect, d = None, {}
        for r in lignes_xlsx(f, g):
            a = r.get("A", "")
            m = re.match(r"^([A-G])\. ", a)
            if m:
                sect = m.group(1)
                continue
            if sect and a and "N" in r:
                d.setdefault((sect, a.strip()), num(r["N"]))
        res[g] = d
    return res


def wedge():
    ids, v = jsonstat("wedge.json")  # freq, unit, geo, time
    return {g: v.get(("A", "RT", g, "2025")) for g in list(PAYS) + ["EU27_2020"]}


def dette():
    """Dette brute (GD) et capacité/besoin de financement (B9), S13, % du PIB, 2024 (gov_10dd_edpt1)."""
    ids, v = jsonstat("dette.json")  # freq, unit, sector, na_item, geo, time
    return ({g: v.get(("A", "PC_GDP", "S13", "GD", g, "2024")) for g in list(PAYS) + ["EU27_2020"]},
            {g: v.get(("A", "PC_GDP", "S13", "B9", g, "2024")) for g in list(PAYS) + ["EU27_2020"]})


def cit_legal():
    """Taux légal combiné (central + local) de l'impôt sur les sociétés, OCDE, mesure CIT_C, ciblage ST (taux de droit commun)."""
    out = {}
    for r in csv.DictReader(open(EU + "/oecd_cit.csv", encoding="utf-8")):
        if r["MEASURE"] == "CIT_C" and r["TARGETING"] == "ST":
            for g, i3 in ISO3.items():
                if r["REF_AREA"] == i3:
                    out.setdefault(g, {})[r["TIME_PERIOD"]] = float(r["OBS_VALUE"])
    return out


TWZ_NOMS = {"Austria": "AT", "Czech Republic": "CZ", "Denmark": "DK", "Estonia": "EE", "Finland": "FI", "France": "FR", "Germany": "DE", "Greece": "EL",
            "Hungary": "HU", "Italy": "IT", "Latvia": "LV", "Poland": "PL", "Portugal": "PT", "Slovakia": "SK", "Slovenia": "SI", "Spain": "ES", "Sweden": "SE"}
TWZ_REFUGES = {"Belgium": "BE", "Ireland": "IE", "Luxembourg": "LU", "Malta": "MT", "Netherlands": "NL"}


def twz():
    """TWZ 2022, Table 2 (profits reçus par les refuges, Md$ 2015) et Table 3 (profits transférés depuis chaque pays, 2015)."""
    f = EU + "/TWZ2022.xlsx"
    refuges = {}
    for r in lignes_xlsx(f, "Table2"):
        if r.get("B") in TWZ_REFUGES:
            refuges[TWZ_REFUGES[r["B"]]] = num(r["C"])
    perdants = {}
    for r in lignes_xlsx(f, "Table3"):
        if r.get("B") in TWZ_NOMS:
            perdants[TWZ_NOMS[r["B"]]] = {"profits_declares": num(r["C"]), "transferes": num(r["F"]), "part_profits": num(r["H"]), "perte_impot": num(r["I"])}
    return refuges, perdants


def infractions():
    """Stock de procédures d'infraction ouvertes par État (fichier de résultats de infractions_ue_2026.py)."""
    inv = {v: k for k, v in PAYS.items()}
    out = {}
    for ligne in open(os.path.join(ICI, "infractions_ue_2026_resultats.txt"), encoding="utf-8"):
        m = re.match(r"^(\d+) ([^\d{]+?) (\d+) \{", ligne)
        if m and m.group(2) in inv:
            out[inv[m.group(2)]] = int(m.group(3))
    return out


# --- rangs ------------------------------------------------------------------------------------------------------------------
def rang(valeurs, pays="FR"):
    """Rang décroissant (1 = valeur la plus haute) parmi les États membres renseignés ; renvoie (rang, nombre d'États, médiane, minimum, maximum)."""
    v = {g: x for g, x in valeurs.items() if g in PAYS and x is not None}
    tri = sorted(v.items(), key=lambda kv: -kv[1])
    r = [g for g, _ in tri].index(pays) + 1 if pays in v else None
    xs = sorted(v.values())
    med = xs[len(xs) // 2] if len(xs) % 2 else (xs[len(xs) // 2 - 1] + xs[len(xs) // 2]) / 2
    return r, len(v), med, tri[-1], tri[0]


def ligne(nom, valeurs, ue=None, unite="% PIB", pays="FR", dec=1):
    r, n, med, mn, mx = rang(valeurs, pays)
    f = lambda x: f"{x:.{dec}f}".replace(".", ",")
    ues = f(ue) if ue is not None else "n.d."
    return (f"| {nom} | {f(valeurs[pays])} | {ues} | {f(med)} | {r}/{n} | {PAYS[mx[0]]} {f(mx[1])} | {PAYS[mn[0]]} {f(mn[1])} | {unite} |")


ENTETE = "| Indicateur | France | UE-27 | Médiane des 27 | Rang de la France (1 = le plus haut) | Maximum | Minimum | Unité |\n|---|---|---|---|---|---|---|---|"


def rapport():
    out = []
    p = out.append
    c = cofog("2024")
    p("## A. Dépenses publiques par fonction (Eurostat gov_10a_exp, S13, % du PIB, 2024)")
    p(ENTETE)
    for code, nom in COFOG:
        vals = {g: c[code][g] for g in PAYS}
        if vals["FR"] is None:
            continue
        p(ligne(nom, vals, c[code]["EU27_2020"]))
    ids, tv = taxag_pib()
    tt = taxtrends()
    ligs = lambda cle: {g: tt[g].get(cle) for g in PAYS}
    ue = lambda cle: tt["EU27_2020"].get(cle)
    p("")
    p("## B. Fiscalité (DG TAXUD, Taxation trends 2026, % du PIB sauf mention, 2024)")
    p(ENTETE)
    for sect, lab, nom, unite in [("A", "Total", "Prélèvements obligatoires totaux", "% PIB"),
                                  ("A", "Social contributions", "Cotisations sociales", "% PIB"), ("A", "Employers'", "  dont cotisations employeurs", "% PIB"),
                                  ("A", "VAT", "TVA", "% PIB"), ("A", "Personal income taxes", "Impôt sur le revenu des personnes", "% PIB"),
                                  ("A", "Corporate income taxes", "Impôt sur les sociétés", "% PIB"), ("A", "Other taxes on production", "Autres impôts sur la production", "% PIB"),
                                  ("C", "Consumption", "Fiscalité de la consommation (fonction économique)", "% PIB"), ("C", "Labour", "Fiscalité du travail (fonction économique)", "% PIB"),
                                  ("C", "Capital", "Fiscalité du capital (fonction économique)", "% PIB"),
                                  ("E", "Taxes on property", "Impôts sur la propriété", "% PIB"), ("E", "Inheritance and gift taxes", "  dont successions et donations", "% PIB"),
                                  ("D", "Environmental taxes", "Impôts environnementaux", "% PIB"),
                                  ("F", "Consumption", "Taux implicite sur la consommation", "%"), ("F", "Labour", "Taux implicite sur le travail", "%")]:
        vals = ligs((sect, lab))
        if vals["FR"] is None:
            continue
        p(ligne(nom, vals, ue((sect, lab)), unite, dec=2 if "implicite" in nom else 1))
    w = wedge()
    p(ligne("Coin fiscal, bas salaires (Eurostat earn_nt_taxwedge, 2025)", w, w["EU27_2020"], "%"))
    gd, b9 = dette()
    p("")
    p("## B bis. Dette et solde (Eurostat gov_10dd_edpt1, S13, % du PIB, 2024)")
    p(ENTETE)
    p(ligne("Dette brute", gd, gd["EU27_2020"]))
    p(ligne("Solde des administrations publiques (négatif = déficit ; rang 1 = le plus haut excédent)", b9, b9["EU27_2020"]))
    p("")
    p("## C. Concurrence fiscale sur les sociétés")
    p(ENTETE)
    cl = cit_legal()
    for an in ("2024", "2025"):
        p(ligne(f"Taux légal combiné de l'IS, {an} (OCDE)", {g: cl.get(g, {}).get(an) for g in PAYS}, None, "%"))
    refuges, perdants = twz()
    p("")
    p("Profits transférés (Tørsløv-Wier-Zucman 2022, Tables 2 et 3, données 2015, milliards de dollars courants) :")
    p("")
    p("| Pays | Profits transférés hors du pays (Md$) | en % des profits déclarés dans le pays | Perte d'IS en % de l'IS collecté |\n|---|---|---|---|")
    for g, d in sorted(perdants.items(), key=lambda kv: -kv[1]["part_profits"]):
        p(f"| {PAYS[g]} | {d['transferes']:.1f} | {100 * d['part_profits']:.1f} % | {100 * d['perte_impot']:.1f} % |".replace(".", ","))
    rp = rang({g: d["part_profits"] for g, d in perdants.items()})
    rpi = rang({g: d["perte_impot"] for g, d in perdants.items()})
    rt = rang({g: d["transferes"] for g, d in perdants.items()})
    p("")
    p(f"Rang de la France parmi les {rp[1]} États membres tabulés individuellement (hors refuges BE, IE, LU, MT, NL ; BG, HR, CY, LT, RO non tabulés) : "
      f"{rt[0]}e en montant, {rp[0]}e en part des profits déclarés, {rpi[0]}e en perte relative d'IS (rang 1 = le plus touché).")
    p("Profits reçus par les refuges de l'UE (Md$, 2015) : " + ", ".join(f"{PAYS[g]} {v:.0f}" for g, v in sorted(refuges.items(), key=lambda kv: -kv[1])) + f" ; total {sum(refuges.values()):.0f} Md$.")
    p("")
    p("## D. Infractions au droit de l'UE (stock de procédures ouvertes, Commission, état du 03/11/2026)")
    inf = infractions()
    r, n, med, mn, mx = rang(inf)
    p(f"France : {inf['FR']} dossiers actifs, rang {r}/{n} (1 = le plus de dossiers) ; médiane {med:.0f} ; maximum {PAYS[mx[0]]} {mx[1]} ; minimum {PAYS[mn[0]]} {mn[1]}.")
    p("Taille des États : le stock brut n'est pas rapporté à la population ; la France, 3e population de l'UE, est dans la moitié haute sans être en tête.")
    return "\n".join(out)


if __name__ == "__main__":
    if "--telecharger" in sys.argv:
        telecharger()
    txt = rapport()
    print(txt)
    if "--ecrire" in sys.argv:
        open(os.path.join(ICI, "eurostat_synthese_ue_resultats.txt"), "w", encoding="utf-8").write(txt + "\n")
