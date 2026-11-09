# -*- coding: utf-8 -*-
"""Dossier énergie européen (T57, 03/11/2026) : prix, décomposition, mix, flux, graphique.
Entrées : $DONNEES/sources/europe/energie/ (Eurostat JSON-stat, Ember CSV).
Sortie : tableaux texte (stdout ; fichier sources/calculs/energie_europe_resultats.txt avec --ecrire)
         et graphique $DONNEES/resultats/europe/energie_europe.png (avec --graphique).
Aucune valeur saisie à la main. Python 3 standard + matplotlib (venv langagement-donnees), sans pandas.
Usage : $DONNEES/.venv/bin/python -I energie_europe.py [--ecrire] [--graphique]
"""
import json, os, sys, csv, itertools
from collections import defaultdict

D = os.path.expandvars("$DONNEES/sources/europe/energie")
OUT_PNG = os.path.expandvars("$DONNEES/resultats/europe/energie_europe.png")
GEOS = ["FR", "DE", "IT", "ES", "NL", "PL", "SE", "BE", "DK", "AT", "IE", "EU27_2020"]
NOMS = {"FR": "France", "DE": "Allemagne", "IT": "Italie", "ES": "Espagne", "NL": "Pays-Bas",
        "PL": "Pologne", "SE": "Suède", "BE": "Belgique", "DK": "Danemark", "AT": "Autriche",
        "IE": "Irlande", "EU27_2020": "UE-27"}
EMBER_NOM = {"FR": "France", "DE": "Germany", "IT": "Italy", "ES": "Spain", "NL": "Netherlands",
             "PL": "Poland", "SE": "Sweden", "BE": "Belgium", "DK": "Denmark", "AT": "Austria",
             "IE": "Ireland", "EU27_2020": "EU"}
LIGNES = []


def p(s=""):
    LIGNES.append(s)
    print(s)


def jsonstat(fichier):
    """Renvoie une liste de (dict de dimensions, valeur)."""
    d = json.load(open(os.path.join(D, fichier)))
    ids, tailles = d["id"], d["size"]
    cats = []
    for k in ids:
        idx = d["dimension"][k]["category"]["index"]
        if isinstance(idx, dict):
            idx = sorted(idx, key=idx.get)
        cats.append(idx)
    vals = d["value"]
    res = []
    for pos, combo in enumerate(itertools.product(*[range(t) for t in tailles])):
        v = vals.get(str(pos)) if isinstance(vals, dict) else vals[pos]
        if v is not None:
            res.append(({k: cats[i][c] for i, (k, c) in enumerate(zip(ids, combo))}, v))
    return res


def prix_annuel(fichier, tax):
    """{(geo, année): moyenne simple des deux semestres} en EUR/kWh."""
    acc = defaultdict(list)
    for dim, v in jsonstat(fichier):
        if dim["tax"] == tax:
            acc[(dim["geo"], dim["time"][:4])].append(v)
    return {k: sum(x) / len(x) for k, x in acc.items() if len(x) == 2}


def tableau_prix(titre, fichier, tax, annees, unite="c€/kWh"):
    s = prix_annuel(fichier, tax)
    p(f"### {titre} ({unite}, moyenne simple des deux semestres)")
    p("| Pays | " + " | ".join(annees) + " |")
    p("|---|" + "---:|" * len(annees))
    for g in GEOS:
        cells = []
        for a in annees:
            v = s.get((g, a))
            cells.append("n.d." if v is None else f"{v*100:.1f}")
        p(f"| {NOMS[g]} | " + " | ".join(cells) + " |")
    p()
    return s


def decomposition(titre, fichier, annee, extra=None):
    """Prix décomposé en énergie et fourniture, réseau, taxes et prélèvements, TVA (EUR/kWh annuel)."""
    comp = {}
    for dim, v in jsonstat(fichier):
        if dim["time"] == annee and dim["nrg_prc"] in ("NRG_SUP", "NETC", "TAX_FEE_LEV_CHRG", "VAT"):
            comp[(dim["geo"], dim["nrg_prc"])] = v
    p(f"### {titre} ({annee}, c€/kWh)")
    p("| Pays | Énergie et fourniture | Réseau | Taxes, redevances et prélèvements (TVA incluse) | dont TVA | Total | Part taxes |")
    p("|---|---:|---:|---:|---:|---:|---:|")
    out = {}
    for g in GEOS:
        e, n, t, vat = (comp.get((g, k)) for k in ("NRG_SUP", "NETC", "TAX_FEE_LEV_CHRG", "VAT"))
        if None in (e, n, t):
            p(f"| {NOMS[g]} | n.d. | | | | | |")
            continue
        vat = vat or 0.0
        tot = e + n + t  # la TVA est une sous-composante de TAX_FEE_LEV_CHRG (vérifié : total = prix I_TAX)
        out[g] = (e, n, t - vat, vat)
        p(f"| {NOMS[g]} | {e*100:.1f} | {n*100:.1f} | {t*100:.1f} | {vat*100:.1f} | {tot*100:.1f} | {100*t/tot:.0f} % |")
    p("Note : total = énergie et fourniture + réseau + taxes (TVA incluse), ce qui retrouve le prix toutes taxes comprises de la table semestrielle ; une valeur négative de taxes signale des compensations supérieures aux prélèvements.")
    p()
    return out


def ember():
    rows = list(csv.DictReader(open(os.path.join(D, "ember_generation_yearly_global.csv"))))
    idx = {}
    for r in rows:
        if r["Area type"] in ("Country or economy", "Region") or True:
            idx[(r["Area"], r["Year"], r["Electricity source"])] = r
    return idx


def mix(annee):
    e = ember()
    p(f"### Mix électrique {annee} : parts de la production (Ember, TWh et %) et intensité carbone (gCO2e/kWh)")
    p("| Pays | Production (TWh) | Nucléaire | Éolien+solaire | Hydro | Fossiles | Intensité (gCO2e/kWh) | Importations nettes (TWh ; < 0 = exportateur) |")
    p("|---|---:|---:|---:|---:|---:|---:|---:|")
    res = {}
    for g in GEOS:
        a = EMBER_NOM[g]
        def gen(src):
            r = e.get((a, annee, src))
            return float(r["Generation (TWh)"]) if r and r["Generation (TWh)"] else None
        tot = gen("Total generation")
        r = e.get((a, annee, "Total generation"))
        inten = float(r["Emissions intensity (gCO2e/kWh)"]) if r and r["Emissions intensity (gCO2e/kWh)"] else None
        ni = gen("Net imports")
        parts = [gen(s) for s in ("Nuclear", "Wind and solar", "Hydro", "Fossil")]
        if tot is None:
            p(f"| {NOMS[g]} | n.d. |||||||")
            continue
        sh = [("n.d." if x is None else f"{100*x/tot:.0f} %") for x in parts]
        p(f"| {NOMS[g]} | {tot:.0f} | {sh[0]} | {sh[1]} | {sh[2]} | {sh[3]} | "
          f"{'n.d.' if inten is None else f'{inten:.0f}'} | {'n.d.' if ni is None else f'{ni:+.1f}'} |")
        res[g] = (tot, parts, inten, ni)
    p()
    return res


def solde_france():
    imp, exp = {}, {}
    for dim, v in jsonstat("nrg_cb_e_echanges.json"):
        if dim["geo"] == "FR":
            (imp if dim["nrg_bal"] == "IMP" else exp)[dim["time"]] = v
    p("### France : échanges physiques d'électricité (Eurostat nrg_cb_e, TWh)")
    p("| Année | Importations | Exportations | Solde exportateur |")
    p("|---|---:|---:|---:|")
    sol = {}
    for a in map(str, range(2015, 2026)):
        if a in imp and a in exp:
            sol[a] = (exp[a] - imp[a]) / 1000
            p(f"| {a} | {imp[a]/1000:.1f} | {exp[a]/1000:.1f} | {sol[a]:.1f} |")
    p()
    return sol


def prix_gros():
    acc = defaultdict(list)
    for r in csv.DictReader(open(os.path.join(D, "ember_prix_gros_mensuel.csv"))):
        if r["Price (EUR/MWhe)"]:
            acc[(r["Country"], r["Date"][:4])].append(float(r["Price (EUR/MWhe)"]))
    pays = [("France", "France"), ("Germany", "Allemagne"), ("Spain", "Espagne"), ("Italy", "Italie"),
            ("Sweden", "Suède"), ("Poland", "Pologne"), ("Netherlands", "Pays-Bas")]
    annees = list(map(str, range(2015, 2026)))
    p("### Prix de gros day-ahead, moyenne annuelle des moyennes mensuelles (Ember, EUR/MWh)")
    p("| Pays | " + " | ".join(annees) + " |")
    p("|---|" + "---:|" * len(annees))
    res = {}
    for en, fr in pays:
        vals = []
        for a in annees:
            x = acc.get((en, a))
            vals.append(sum(x) / len(x) if x and len(x) == 12 else None)
        res[en] = vals
        p(f"| {fr} | " + " | ".join("n.d." if v is None else f"{v:.0f}" for v in vals) + " |")
    p("Moyenne simple des 12 mois (pas pondérée par la consommation).")
    p()
    return annees, res


def ecart_gros(res, annees):
    p("### Écart de prix de gros France moins Allemagne (EUR/MWh ; négatif = France moins chère)")
    p("| " + " | ".join(annees) + " |")
    p("|" + "---:|" * len(annees))
    p("| " + " | ".join(f"{f-d:+.0f}" for f, d in zip(res["France"], res["Germany"])) + " |")
    p()


def valeur_exports(sol, annees, res_g):
    """Ordre de grandeur : solde exportateur x prix de gros français moyen (pas une recette comptable)."""
    p("### France : valeur indicative du solde exportateur (TWh x prix de gros moyen français, Md€)")
    p("| Année | Solde (TWh) | Prix de gros FR (EUR/MWh) | Valeur indicative (Md€) |")
    p("|---|---:|---:|---:|")
    for a, v in zip(annees, res_g["France"]):
        if a in sol and v is not None:
            p(f"| {a} | {sol[a]:.1f} | {v:.0f} | {sol[a]*v/1000:.1f} |")
    p("Méthode : volume net x moyenne simple des prix mensuels ; ne tient pas compte des heures d'export (prix horaires), des contrats, ni des coûts de réseau. Ordre de grandeur seulement.")
    p()


EF_GAZ = 0.202  # tCO2/MWh (PCI), facteur par défaut GIEC 56,1 tCO2/TJ ; hypothèse affichée


def signal_carbone(dec_e, dec_g, mixres):
    """Taxes hors TVA par kWh (électricité vs gaz, ménages, 2025) et prix implicite du carbone."""
    p("### Signal-prix carbone implicite des taxes (ménages, 2025) : hypothèse de lecture, pas une mesure de l'accise seule")
    p("| Pays | Taxes hors TVA, électricité (c€/kWh) | Intensité du mix 2024 (gCO2e/kWh) | Taxes hors TVA, gaz (c€/kWh) | Prix implicite gaz (€/tCO2, hyp. 0,202 t/MWh) |")
    p("|---|---:|---:|---:|---:|")
    for g in ["FR", "DE", "IT", "ES", "NL", "SE", "DK", "AT", "BE", "IE", "EU27_2020"]:
        if g in dec_e and g in dec_g and g in mixres and mixres[g][2]:
            te = dec_e[g][2]
            tg = dec_g[g][2]
            p(f"| {NOMS[g]} | {te*100:.1f} | {mixres[g][2]:.0f} | {tg*100:.1f} | {tg*1000/EF_GAZ:.0f} |")
    p("Limite : les « taxes, redevances et prélèvements » d'Eurostat regroupent accises, taxes sur les renouvelables, taxes de capacité et d'autres prélèvements (hors TVA ici) ; le prix implicite surestime donc le signal carbone strict.")
    p()


def graphique(prix_men, prix_ent, dec, annees_g, res_g, sol):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    plt.rcParams.update({"font.size": 9, "axes.spines.top": False, "axes.spines.right": False})
    fig, ax = plt.subplots(2, 2, figsize=(12, 8.5))
    # a : décomposition ménages 2025
    a = ax[0, 0]
    ordre = sorted(dec, key=lambda g: sum(dec[g]))
    couleurs = ["#1b6ca8", "#8aa6b8", "#d9822b", "#b5b5b5"]
    etiq = ["Énergie et fourniture", "Réseau", "Taxes et prélèvements", "TVA"]
    base = [0] * len(ordre)
    for i in range(4):
        h = [dec[g][i] * 100 for g in ordre]
        a.barh([NOMS[g] for g in ordre], h, left=base, color=couleurs[i], label=etiq[i])
        base = [b + x for b, x in zip(base, h)]
    a.set_title("Électricité, ménages (2 500-4 999 kWh/an), 2025, c€/kWh", loc="left", fontsize=10)
    a.legend(frameon=False, fontsize=8, loc="lower right")
    # b : entreprises hors TVA, 2015-2025
    b = ax[0, 1]
    an = [str(x) for x in range(2015, 2026)]
    for g, c in (("FR", "#1b6ca8"), ("DE", "#d9822b"), ("ES", "#2a9d5c"), ("IT", "#b5473a"), ("SE", "#7a6aa8"), ("EU27_2020", "#555555")):
        b.plot(an, [prix_ent.get((g, x), float("nan")) * 100 for x in an], label=NOMS[g], color=c,
               lw=2.4 if g in ("FR", "DE") else 1.4, ls="--" if g == "EU27_2020" else "-")
    b.set_title("Électricité, entreprises (2-20 GWh/an), hors TVA, c€/kWh", loc="left", fontsize=10)
    b.legend(frameon=False, fontsize=8, ncol=2)
    b.tick_params(axis="x", rotation=45)
    # c : prix de gros
    c = ax[1, 0]
    for en, nom, col in (("France", "France", "#1b6ca8"), ("Germany", "Allemagne", "#d9822b"), ("Spain", "Espagne", "#2a9d5c"), ("Italy", "Italie", "#b5473a")):
        c.plot(annees_g, [v if v is not None else float("nan") for v in res_g[en]], label=nom, color=col, lw=2)
    c.set_title("Prix de gros day-ahead, moyenne annuelle, EUR/MWh", loc="left", fontsize=10)
    c.legend(frameon=False, fontsize=8)
    c.tick_params(axis="x", rotation=45)
    # d : solde exportateur France
    d = ax[1, 1]
    ks = sorted(sol)
    d.bar(ks, [sol[k] for k in ks], color="#1b6ca8")
    for k in ks:
        d.text(k, sol[k] + 1, f"{sol[k]:.0f}", ha="center", fontsize=8)
    d.set_title("France : solde exportateur d'électricité, TWh", loc="left", fontsize=10)
    d.tick_params(axis="x", rotation=45)
    fig.suptitle("Énergie en Europe : prix, taxes et échanges", x=0.01, ha="left", fontsize=13, fontweight="bold")
    fig.text(0.01, 0.005, "Sources : Eurostat (nrg_pc_204_c, nrg_pc_205, nrg_cb_e), Ember (prix de gros, données ouvertes). Traitement : sources/calculs/energie_europe.py", fontsize=7.5, color="#555")
    fig.tight_layout(rect=(0, 0.02, 1, 0.96))
    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    fig.savefig(OUT_PNG, dpi=150)
    print("graphique écrit :", OUT_PNG)


def main():
    an = ["2015", "2019", "2021", "2022", "2023", "2024", "2025"]
    tableau_prix("Électricité, ménages (bande DC 2 500-4 999 kWh/an), toutes taxes comprises", "nrg_pc_204_menage_elec.json", "I_TAX", an)
    tableau_prix("Électricité, ménages, hors taxes et prélèvements (énergie + réseau)", "nrg_pc_204_menage_elec.json", "X_TAX", an)
    tableau_prix("Électricité, entreprises (bande ID 2-20 GWh/an), hors TVA récupérable", "nrg_pc_205_entreprise_elec.json", "X_VAT", an)
    pe = tableau_prix("Électricité, entreprises, hors taxes et prélèvements", "nrg_pc_205_entreprise_elec.json", "X_TAX", an)
    tableau_prix("Gaz, ménages (bande D2 20-199 GJ/an), toutes taxes comprises", "nrg_pc_202_menage_gaz.json", "I_TAX", an)
    tableau_prix("Gaz, entreprises (bande I3 10 000-99 999 GJ/an), hors TVA récupérable", "nrg_pc_203_entreprise_gaz.json", "X_VAT", an)
    pe_vat = prix_annuel("nrg_pc_205_entreprise_elec.json", "X_VAT")
    dec = decomposition("Décomposition, électricité ménages", "nrg_pc_204_c_menage_elec.json", "2025")
    dec_ent = None
    decomposition("Décomposition, électricité entreprises (2-20 GWh)", "nrg_pc_205_c_entreprise_elec.json", "2025")
    dec_gaz = decomposition("Décomposition, gaz ménages (D2)", "nrg_pc_202_c_menage_gaz.json", "2025")
    decomposition("Décomposition, gaz entreprises (I3)", "nrg_pc_203_c_entreprise_gaz.json", "2025")
    mixres = mix("2024")
    sol = solde_france()
    ag, rg = prix_gros()
    ecart_gros(rg, ag)
    valeur_exports(sol, ag, rg)
    signal_carbone(dec, dec_gaz, mixres)
    if "--ecrire" in sys.argv:
        f = os.path.join(os.path.dirname(os.path.abspath(__file__)), "energie_europe_resultats.txt")
        open(f, "w").write("\n".join(LIGNES) + "\n")
        print("résultats écrits :", f)
    if "--graphique" in sys.argv:
        graphique(None, pe_vat, dec, ag, rg, sol)


if __name__ == "__main__":
    main()
