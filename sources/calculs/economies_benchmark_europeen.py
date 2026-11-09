# -*- coding: utf-8 -*-
"""Benchmark européen de la dépense publique par fonction COFOG (niveau 2) : France, Allemagne, Pays-Bas, Suède, Italie, médiane UE-27.
Entrées (Eurostat, API de diffusion, téléchargées le 03/11/2026) dans $DONNEES/sources/eurostat/t57d/ :
  cofog_nature_mioeur_27.json : gov_10a_exp, MIO_EUR, S13, 2024, 27 États + UE-27, natures TE, D1, P2, P51G, D3, D4, D62, D632, D7, D9, P31, P32
  pib_mioeur.json (nama_10_gdp, B1GQ, CP_MEUR) ; pib_hab_pps.json (nama_10_pc, B1GQ, CP_PPS_EU27_2020_HAB) ; pop.json (demo_pjan, 1er janvier 2024)
Définitions : fonctionnement F = D1 + P2 + P51G (rémunérations, consommations intermédiaires, investissement) ;
  D632 = achats de soins et services marchands remboursés aux ménages ; F+ = F + D632 (robuste au périmètre public/privé de la production) ;
  transferts aux ménages T = D62 (prestations en espèces) + D632 ; autres = TE - F - D62 - D632 (subventions D3, intérêts D4, transferts courants D7, en capital D9, etc.).
  % du PIB recalculé en divisant les millions d'euros par le PIB (pas d'arrondi à 0,1 point comme dans PC_GDP).
  Dépense par habitant en SPA = % du PIB x PIB par habitant en SPA (approximation : le PIB sert de déflateur).
Usage : python3 -I economies_benchmark_europeen.py [--ecrire]   (--ecrire écrit economies_benchmark_europeen_resultats.txt)
Bibliothèque standard seulement."""
import json, os, statistics, sys

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "donnees-brutes", "eurostat", "t57d")
ICI = os.path.dirname(os.path.abspath(__file__))
BENCH = ["FR", "DE", "NL", "SE", "IT"]
NOMS = {"FR": "France", "DE": "Allemagne", "NL": "Pays-Bas", "SE": "Suède", "IT": "Italie", "MED": "Médiane UE-27", "EU27_2020": "UE-27"}


def jsonstat(f):
    d = json.load(open(os.path.join(D, f)))
    ids, sz, cats = d["id"], d["size"], []
    for k in ids:
        c = d["dimension"][k]["category"]["index"]
        cats.append(list(c) if isinstance(c, list) else [x for x, _ in sorted(c.items(), key=lambda kv: kv[1])])
    out = {}
    for fl, v in d["value"].items():
        f_, pos = int(fl), []
        for t in reversed(sz):
            pos.append(f_ % t); f_ //= t
        pos = pos[::-1]
        out[tuple(cats[i][p] for i, p in enumerate(pos))] = v
    labels = {k: d["dimension"][k]["category"].get("label", {}) for k in ids}
    return out, labels


EXP, LAB = jsonstat("cofog_nature_mioeur_27.json")
GDP = {k[3]: v for k, v in jsonstat("pib_mioeur.json")[0].items() if k[-1] == "2024"}
PPSH = {k[3]: v for k, v in jsonstat("pib_hab_pps.json")[0].items() if k[-1] == "2024"}
POP = {k[4]: v for k, v in jsonstat("pop.json")[0].items()}
GEOS = [g for g in GDP if g != "EU27_2020" and g in POP]
GEOS27 = [g for g in GEOS if g != "EU27_2020"]
assert len(GEOS27) == 27, len(GEOS27)


def val(g, c, n):
    return EXP.get(("A", "MIO_EUR", "S13", c, n, g, "2024"))


def nature(g, c):
    """Décomposition en M€ ; None si le total manque."""
    te = val(g, c, "TE")
    if te is None:
        return None
    z = lambda n: val(g, c, n) or 0.0
    f = z("D1") + z("P2") + z("P51G")
    return {"TE": te, "F": f, "D632": z("D632"), "D62": z("D62"), "AUT": te - f - z("D632") - z("D62"), "D3": z("D3"), "D4": z("D4"),
            "D7": z("D7"), "D9": z("D9"), "D1": z("D1"), "P2": z("P2"), "P51G": z("P51G")}


def pct(g, c, k):
    n = nature(g, c)
    return None if n is None else 100.0 * n[k] / GDP[g]


def mediane(c, k):
    v = [pct(g, c, k) for g in GEOS27]
    v = [x for x in v if x is not None]
    return statistics.median(v), len(v)


def hab_pps(g, c, k):
    p = pct(g, c, k)
    return None if p is None else p / 100.0 * PPSH[g]


def ppsfr():
    """Coefficient SPA -> EUR pour la France : PIB (M€) / (PIB par habitant en SPA x population)."""
    return GDP["FR"] * 1e6 / (PPSH["FR"] * POP["FR"])


# --- fonctions de niveau 2 ---------------------------------------------------------------------------------------------------
L1 = [c for c in LAB["cofog99"] if len(c) == 4 and c != "GF0"]
L2 = [c for c in LAB["cofog99"] if len(c) == 6]
NOM = LAB["cofog99"]
# Agrégats d'étude (sommes de codes)
AGREG = {
    "ADM : Services généraux hors dette et transferts entre niveaux": ["GF0101", "GF0102", "GF0103", "GF0104", "GF0105", "GF0106"],
    "ADM : exécutif, législatif, finances, affaires étrangères (GF0101)": ["GF0101"],
    "ADM : services généraux divers (GF0103)": ["GF0103"],
    "ADM : recherche fondamentale (GF0104)": ["GF0104"],
    "Santé : hôpitaux (GF0703)": ["GF0703"],
    "Santé : consultations (GF0702)": ["GF0702"],
    "Santé : gestion (GF0706 n.c.a.) et santé publique (GF0704)": ["GF0704", "GF0706"],
    "Aides aux entreprises (GF04 : base D3 + D9)": None,
}


def somme(g, codes, k):
    tot, ok = 0.0, False
    for c in codes:
        n = nature(g, c)
        if n is not None:
            tot += n[k]; ok = True
    return tot if ok else None


def pct_ag(g, codes, k):
    s = somme(g, codes, k)
    return None if s is None else 100.0 * s / GDP[g]


def f1(x):
    return "  n.d." if x is None else f"{x:6.2f}"


def ligne(nom, getter):
    """Une ligne : valeur pour FR, DE, NL, SE, IT, médiane, UE-27."""
    vals = [getter(g) for g in BENCH]
    m = statistics.median([x for x in (getter(g) for g in GEOS27) if x is not None])
    eu = getter("EU27_2020")
    return nom, vals, m, eu


def main():
    L = []
    P = L.append
    P("# Benchmark COFOG niveau 2, France contre DE, NL, SE, IT et médiane UE-27 (Eurostat gov_10a_exp, S13, 2024)")
    P(f"PIB 2024 France : {GDP['FR']/1e6:.3f} Md€ ... en M€ : {GDP['FR']:.0f} ; population {POP['FR']:.0f} ; PIB/hab SPA {PPSH['FR']:.0f} ; coefficient EUR par SPA (France) {ppsfr():.4f}")
    P("PIB/hab en SPA (base UE-27 2020, 2024) : " + ", ".join(f"{g} {PPSH[g]:.0f}" for g in BENCH + ["EU27_2020"]))
    P("")
    # 1. niveau 1 : total, F, F+, T
    P("## 1. Niveau 1 (% du PIB) : total, fonctionnement F, F+ (avec D632), prestations en espèces D62, autres")
    P("code | libellé | mesure | " + " | ".join(NOMS[g] for g in BENCH) + " | Médiane | UE-27 | FR - médiane")
    comps = [("TOTAL", "Total des dépenses")] + [(c, NOM[c]) for c in L1]
    for c, nm in comps:
        for k, kn in (("TE", "total"), ("F", "F"), ("D632", "D632"), ("D62", "D62"), ("AUT", "autres")):
            n, vals, m, eu = ligne(nm, lambda g: pct(g, c, k))
            d = None if vals[0] is None else vals[0] - m
            P(f"{c} | {nm[:42]} | {kn} | " + " | ".join(f1(v) for v in vals) + f" | {m:6.2f} | {f1(eu)} | {f1(d)}")
    P("")
    P("## 2. Niveau 2 (% du PIB, total) ")
    P("code | libellé | " + " | ".join(NOMS[g] for g in BENCH) + " | Médiane (n) | UE-27 | FR-méd | dont F | dont D632 | dont D62 | dont autres | hab SPA FR | hab SPA méd")
    for c in L2:
        tot = [pct(g, c, "TE") for g in BENCH]
        med, n = mediane(c, "TE")
        if tot[0] is None:
            continue
        dec = {k: tot_k - mediane(c, k)[0] for k in ("F", "D632", "D62", "AUT") for tot_k in [pct("FR", c, k)]}
        hm = statistics.median([x for x in (hab_pps(g, c, "TE") for g in GEOS27) if x is not None])
        P(f"{c} | {NOM[c][:46]} | " + " | ".join(f1(v) for v in tot) + f" | {med:5.2f} ({n}) | {f1(pct('EU27_2020', c, 'TE'))} | {tot[0]-med:5.2f} | " +
          " | ".join(f"{dec[k]:5.2f}" for k in ("F", "D632", "D62", "AUT")) + f" | {hab_pps('FR', c, 'TE'):7.0f} | {hm:7.0f}")
    P("(dont F, D632, D62, autres : différence France moins médiane de chaque composante ; la médiane de composantes n'est pas additive, la somme peut s'écarter de FR-méd)")
    P("")
    # 3. agrégats
    P("## 3. Agrégats d'étude (% du PIB) : F+ = fonctionnement + D632")
    P("agrégat | mesure | " + " | ".join(NOMS[g] for g in BENCH) + " | Médiane | UE-27")
    for nm, codes in AGREG.items():
        if codes is None:
            for k, kn in (("D3", "subventions D3"), ("D9", "transferts en capital D9")):
                n_, vals, m, eu = ligne(nm, lambda g: pct(g, "GF04", k))
                P(f"{nm} | {kn} | " + " | ".join(f1(v) for v in vals) + f" | {m:6.2f} | {f1(eu)}")
            continue
        for k, kn in (("TE", "total"), ("F", "F"), ("D632", "D632"), ("D62", "D62")):
            n_, vals, m, eu = ligne(nm, lambda g: pct_ag(g, codes, k))
            P(f"{nm} | {kn} | " + " | ".join(f1(v) for v in vals) + f" | {m:6.2f} | {f1(eu)}")
    P("")
    # 3 bis. décomposition additive de l'écart total (niveau 1 + total), par pays, en points de PIB et en Md€
    P("## 3 bis. Écart total France moins X décomposé de façon additive (points de PIB ; Md€ à l'échelle du PIB français) : F, D632, D62, autres")
    P("fonction | X | écart total | F | D632 | D62 | autres | écart total Md€")
    for c, nm in [("TOTAL", "Total")] + [(c, NOM[c]) for c in L1]:
        for g in ["DE", "NL", "SE", "IT"]:
            if pct(g, c, "TE") is None:
                continue
            d = {k: pct("FR", c, k) - pct(g, c, k) for k in ("TE", "F", "D632", "D62", "AUT")}
            P(f"{c} {nm[:24]} | {g} | {d['TE']:5.2f} | {d['F']:5.2f} | {d['D632']:5.2f} | {d['D62']:5.2f} | {d['AUT']:5.2f} | {d['TE']/100*GDP['FR']/1000:6.1f}")
    P("")
    # 4. économies de fonctionnement (F+) niveau 2, base % PIB et base hab SPA
    k_ = ppsfr()
    P("## 4. Si la France dépensait comme X pour le fonctionnement F+ (Md€/an, 2024 ; positif = économie)")
    P("Deux échelles : (a) % du PIB x PIB de la France ; (b) dépense par habitant en SPA x population française x coefficient EUR/SPA.")
    P("Fonctions retenues : niveau 2 hors GF0107 (dette) et GF0108 (transferts entre niveaux), hors défense GF02 (hors périmètre de la mission).")
    P("code | libellé | F+ FR %PIB | " + " | ".join(f"a:{g}" for g in ["DE", "NL", "SE", "IT", "MED"]) + " | " + " | ".join(f"b:{g}" for g in ["DE", "NL", "SE", "IT", "MED"]))
    exclus = {"GF0107", "GF0108"}
    tot_a = {g: 0.0 for g in ["DE", "NL", "SE", "IT", "MED"]}
    tot_b = dict(tot_a)
    tot_a_pos = dict(tot_a)
    tot_b_pos = dict(tot_a)
    LIGNES = {}
    VALS10 = {}
    for c in L2:
        if c in exclus or c.startswith("GF02") or pct("FR", c, "TE") is None:
            continue
        fr = pct("FR", c, "F") + pct("FR", c, "D632")
        frh = hab_pps("FR", c, "F") + hab_pps("FR", c, "D632")
        row_a, row_b = {}, {}
        for g in ["DE", "NL", "SE", "IT", "MED"]:
            if g == "MED":
                xs = [(pct(h, c, "F"), pct(h, c, "D632"), hab_pps(h, c, "F"), hab_pps(h, c, "D632")) for h in GEOS27 if pct(h, c, "TE") is not None]
                x_a = statistics.median([a + b for a, b, _, _ in xs])
                x_b = statistics.median([a + b for _, _, a, b in xs])
            else:
                if pct(g, c, "TE") is None:
                    row_a[g] = row_b[g] = None
                    continue
                x_a = pct(g, c, "F") + pct(g, c, "D632")
                x_b = hab_pps(g, c, "F") + hab_pps(g, c, "D632")
            row_a[g] = (fr - x_a) / 100.0 * GDP["FR"] / 1000.0
            row_b[g] = (frh - x_b) * POP["FR"] * k_ / 1e9
            tot_a[g] += row_a[g]; tot_b[g] += row_b[g]
            tot_a_pos[g] += max(row_a[g], 0); tot_b_pos[g] += max(row_b[g], 0)
        LIGNES[c] = (row_a, row_b)
        VALS10[c] = [x for r in (row_a, row_b) for x in r.values() if x is not None]
        P(f"{c} | {NOM[c][:46]} | {fr:5.2f} | " + " | ".join("  n.d." if row_a[g] is None else f"{row_a[g]:6.1f}" for g in ["DE", "NL", "SE", "IT", "MED"]) + " | " +
          " | ".join("  n.d." if row_b[g] is None else f"{row_b[g]:6.1f}" for g in ["DE", "NL", "SE", "IT", "MED"]))
    P("TOTAL net (somme signée) | | | " + " | ".join(f"{tot_a[g]:6.1f}" for g in ["DE", "NL", "SE", "IT", "MED"]) + " | " + " | ".join(f"{tot_b[g]:6.1f}" for g in ["DE", "NL", "SE", "IT", "MED"]))
    P("TOTAL des seuls écarts positifs (cueillette : biais) | | | " + " | ".join(f"{tot_a_pos[g]:6.1f}" for g in ["DE", "NL", "SE", "IT", "MED"]) + " | " + " | ".join(f"{tot_b_pos[g]:6.1f}" for g in ["DE", "NL", "SE", "IT", "MED"]))
    P("")
    # 4 bis. robustesse : 10 valeurs par fonction (5 comparateurs x 2 échelles)
    P("## 4 bis. Robustesse : par fonction, plancher (min des 10 valeurs), médiane des 10 et maximum ; sommes par groupe, écarts négatifs non compensés (biais haussier, voir note)")
    GROUPES = {"Administration générale (GF01 hors dette)": ["GF0101", "GF0102", "GF0103", "GF0104", "GF0105", "GF0106"],
               "Ordre et sécurité (GF03)": [c for c in L2 if c.startswith("GF03")],
               "Affaires économiques, fonctionnement (GF04)": [c for c in L2 if c.startswith("GF04")],
               "Environnement (GF05)": [c for c in L2 if c.startswith("GF05")],
               "Logement et équipements collectifs, fonctionnement (GF06)": [c for c in L2 if c.startswith("GF06")],
               "Santé (GF07), périmètre incertain : voir section 8": [c for c in L2 if c.startswith("GF07")],
               "Culture et sport (GF08)": [c for c in L2 if c.startswith("GF08")],
               "Enseignement (GF09)": [c for c in L2 if c.startswith("GF09")],
               "Protection sociale, fonctionnement et D632 (GF10)": [c for c in L2 if c.startswith("GF10")]}
    P("groupe | plancher | médiane | maximum | somme nette signée médiane (a, MED)")
    for nm, codes in GROUPES.items():
        fl = sum(max(0.0, min(VALS10[c])) for c in codes if c in VALS10)
        md = sum(max(0.0, statistics.median(VALS10[c])) for c in codes if c in VALS10)
        mx = sum(max(0.0, max(VALS10[c])) for c in codes if c in VALS10)
        net = sum(LIGNES[c][0]["MED"] for c in codes if c in LIGNES)
        P(f"{nm} | {fl:6.1f} | {md:6.1f} | {mx:6.1f} | {net:6.1f}")
    P("Fonctions où l'écart est positif pour les 10 valeurs (plancher > 0) : " + ", ".join(f"{c} ({min(v):.1f})" for c, v in VALS10.items() if min(v) > 0.05))
    P("")
    # 5. par fonction de niveau 1 : économies F+ somme signée, et écart de transferts D62 en Md€
    P("## 5. Niveau 1 : écart France moins X en Md€ (échelle % PIB), fonctionnement F+ et prestations en espèces D62")
    P("code | libellé | mesure | DE | NL | SE | IT | Médiane")
    for c in L1:
        if c == "GF02":
            continue
        for k, kn in (("FP", "F+ (fonct. + D632)"), ("D62", "D62 prestations en espèces"), ("AUT", "autres (D3, D4, D7, D9...)")):
            def g_(g):
                if k == "FP":
                    a, b = pct(g, c, "F"), pct(g, c, "D632")
                    return None if a is None else a + b
                return pct(g, c, k)
            fr = g_("FR")
            out = []
            for g in ["DE", "NL", "SE", "IT"]:
                x = g_(g)
                out.append("  n.d." if x is None else f"{(fr-x)/100*GDP['FR']/1000:6.1f}")
            m = statistics.median([x for x in (g_(h) for h in GEOS27) if x is not None])
            out.append(f"{(fr-m)/100*GDP['FR']/1000:6.1f}")
            P(f"{c} | {NOM[c][:38]} | {kn} | " + " | ".join(out))
    P("")
    # 6. protection sociale par risque : écart FR - médiane en Md€ (total, D62, D632, F, autres)
    P("## 6. Protection sociale par risque : France moins médiane (Md€ à l'échelle du PIB français), et France moins chaque pays (total)")
    P("risque | total FR %PIB | écart total vs médiane | D62 | F+ | autres | vs DE | vs NL | vs SE | vs IT")
    for c in ["GF1001", "GF1002", "GF1003", "GF1004", "GF1005", "GF1006", "GF1007", "GF1009"]:
        fr = pct("FR", c, "TE")
        row = []
        for k in ("TE", "D62"):
            row.append((fr if k == "TE" else pct("FR", c, "D62")) - mediane(c, k)[0])
        fp = pct("FR", c, "F") + pct("FR", c, "D632")
        fpm = statistics.median([pct(h, c, "F") + pct(h, c, "D632") for h in GEOS27 if pct(h, c, "TE") is not None])
        aut = pct("FR", c, "AUT") - mediane(c, "AUT")[0]
        e = lambda x: x / 100 * GDP["FR"] / 1000
        P(f"{c} {NOM[c][:26]} | {fr:5.2f} | {e(row[0]):6.1f} | {e(row[1]):6.1f} | {e(fp-fpm):6.1f} | {e(aut):6.1f} | " +
          " | ".join("n.d." if pct(g, c, 'TE') is None else f"{e(fr-pct(g,c,'TE')):6.1f}" for g in ["DE", "NL", "SE", "IT"]))
    P("")
    # 6 bis. santé : dépenses totales par régime de financement (SHA)
    sha, _ = jsonstat("sha_hf.json")
    P("## 8. Santé (Eurostat hlth_sha11_hf, système de comptes de la santé, 2023) : total, régimes publics et obligatoires (HF1), volontaire (HF2), reste à charge (HF3)")
    P("pays | unité | total | HF1 | HF2 | HF3")
    for g in BENCH + ["EU27_2020"]:
        for u in ("PC_GDP", "PPS_HAB"):
            P(f"{g} | {u} | " + " | ".join(f"{sha.get(('A', u, h, g, '2023'), float('nan')):8.2f}" for h in ("TOT_HF", "HF1", "HF2", "HF3")))
    med = {u: statistics.median([sha[("A", u, "TOT_HF", g, "2023")] for g in GEOS27 if ("A", u, "TOT_HF", g, "2023") in sha]) for u in ("PC_GDP", "PPS_HAB")}
    medh = {u: statistics.median([sha[("A", u, "HF1", g, "2023")] for g in GEOS27 if ("A", u, "HF1", g, "2023") in sha]) for u in ("PC_GDP", "PPS_HAB")}
    P(f"Médiane UE-27 : total {med['PC_GDP']:.2f} % PIB, {med['PPS_HAB']:.0f} SPA/hab ; HF1 {medh['PC_GDP']:.2f} % PIB, {medh['PPS_HAB']:.0f} SPA/hab")
    fr = sha[("A", "PC_GDP", "TOT_HF", "FR", "2023")]
    for g in ["DE", "NL", "SE", "IT"]:
        x = sha[("A", "PC_GDP", "TOT_HF", g, "2023")]
        P(f"Si la France dépensait en santé (tous financeurs) comme {g} : {(fr-x)/100*GDP['FR']/1000:+.1f} Md€ (échelle PIB 2024) ; par habitant en SPA : "
          f"{(sha[('A','PPS_HAB','TOT_HF','FR','2023')]-sha[('A','PPS_HAB','TOT_HF',g,'2023')])*POP['FR']*ppsfr()/1e9:+.1f} Md€")
    P(f"Si la France dépensait comme la médiane : {(fr-med['PC_GDP'])/100*GDP['FR']/1000:+.1f} Md€ ; par habitant en SPA {(sha[('A','PPS_HAB','TOT_HF','FR','2023')]-med['PPS_HAB'])*POP['FR']*ppsfr()/1e9:+.1f} Md€")
    P("")
    # 10. fourchette prudente à 10 ans : base mesurée x coefficient de réalisation, puis recoupement avec ce qui est déjà compté
    P("## 10. Fourchette prudente à 10 ans (Md€/an, régime de croisière) : fonctionnement F+ et aides aux entreprises, hors transferts aux ménages")
    P("Base = médiane des écarts (France moins DE, NL, SE, IT, médiane UE-27) ; on garde la plus petite des deux échelles (% du PIB, par habitant en SPA) ; plancher à zéro.")
    P("Coefficients de réalisation (hypothèses de Claude, non sourcées : part de l'écart que 10 ans de réformes ramènent) : administration et collectivités 15 / 35 / 60 % ; autres fonctions 10 / 25 / 40 % ; aides 10 / 30 / 50 %.")

    def base_groupe(codes):
        res = []
        for echelle in (0, 1):
            xs = []
            for g in ["DE", "NL", "SE", "IT", "MED"]:
                tot = 0.0
                for c in codes:
                    if c in LIGNES and LIGNES[c][echelle][g] is not None:
                        tot += LIGNES[c][echelle][g]
                xs.append(tot)
            res.append(statistics.median(xs))
        return res
    GR = {"Administration générale hors dette (GF01)": (["GF0101", "GF0102", "GF0103", "GF0104", "GF0105", "GF0106"], (0.15, 0.35, 0.60)),
          "Logement et équipements collectifs, fonctionnement (GF06)": ([c for c in L2 if c.startswith("GF06")], (0.15, 0.35, 0.60)),
          "Enseignement (GF09)": ([c for c in L2 if c.startswith("GF09")], (0.10, 0.25, 0.40)),
          "Culture et sport (GF08)": ([c for c in L2 if c.startswith("GF08")], (0.10, 0.25, 0.40)),
          "Ordre et sécurité (GF03)": ([c for c in L2 if c.startswith("GF03")], (0.10, 0.25, 0.40)),
          "Environnement (GF05)": ([c for c in L2 if c.startswith("GF05")], (0.10, 0.25, 0.40)),
          "Santé (GF07)": ([c for c in L2 if c.startswith("GF07")], (0.0, 0.0, 0.0))}
    lignes = []
    for nm, (codes, coef) in GR.items():
        ba, bb = base_groupe(codes)
        base = max(0.0, min(ba, bb))
        lignes.append((nm, ba, bb, base, [base * k for k in coef]))
    # aides : GF04, D3 + D9, écart avec l'Allemagne
    def aides(g, echelle):
        n = pct(g, "GF04", "D3") + pct(g, "GF04", "D9")
        return n if echelle == 0 else n / 100 * PPSH[g]
    fa = (aides("FR", 0) - aides("DE", 0)) / 100 * GDP["FR"] / 1000
    fb = (aides("FR", 1) - aides("DE", 1)) * POP["FR"] * ppsfr() / 1e9 * 1.0
    base_aides = max(0.0, min(fa, fb))
    lignes.append(("Aides aux entreprises (GF04 : D3 + D9), écart avec l'Allemagne", fa, fb, base_aides, [base_aides * k for k in (0.10, 0.30, 0.50)]))
    P("ligne | base (a) | base (b) | base retenue | bas | central | haut")
    for nm, ba, bb, base, r in lignes:
        P(f"{nm} | {ba:6.1f} | {bb:6.1f} | {base:6.1f} | {r[0]:5.1f} | {r[1]:5.1f} | {r[2]:5.1f}")
    brut = [sum(l[4][i] for l in lignes) for i in range(3)]
    P(f"TOTAL brut du benchmark | | | | {brut[0]:5.1f} | {brut[1]:5.1f} | {brut[2]:5.1f}")
    # recoupements avec sources/economies-depense-publique.md (A1, A2, B1, B2, B4, B5 ; E ; A4, B3) et le modèle (e2 4,6 + e3/e4 3,4 pour les aides)
    OVER = {"Administration générale hors dette (GF01)": (5.14, 11.56, 20.4), "Logement et équipements collectifs, fonctionnement (GF06)": (2.0, 3.0, 4.0),
            "Enseignement (GF09)": (2.2, 3.9, 5.5), "Culture et sport (GF08)": (1.0, 3.0, 5.7),
            "Aides aux entreprises (GF04 : D3 + D9), écart avec l'Allemagne": (8.0, 8.0, 8.0)}
    P("Recoupement : déjà compté ailleurs (bas / central / haut) : A1+A2+B1+B2+B4+B5 pour l'administration, A3 pour le logement (recoupe aussi A1-A2), E (non-remplacement) pour l'éducation, A4+B3 pour la culture et le sport, e2 + e3/e4 pour les aides.")
    add = [0.0, 0.0, 0.0]
    P("ligne | brut b/c/h | déjà compté b/c/h | additionnel b/c/h")
    for nm, ba, bb, base, r in lignes:
        o = OVER.get(nm, (0, 0, 0))
        a = [max(0.0, r[i] - o[i]) for i in range(3)]
        for i in range(3):
            add[i] += a[i]
        P(f"{nm} | {r[0]:.1f}/{r[1]:.1f}/{r[2]:.1f} | {o[0]:.1f}/{o[1]:.1f}/{o[2]:.1f} | {a[0]:.1f}/{a[1]:.1f}/{a[2]:.1f}")
    P(f"TOTAL additionnel à A + B (7,2 / 16,8 / 29,3) et au modèle : {add[0]:.1f} / {add[1]:.1f} / {add[2]:.1f}")
    P("")
    # 7. verification de coherence
    P("## 9. Contrôles")
    for g in BENCH:
        s = sum(nature(g, c)["TE"] for c in L1)
        P(f"{g} : somme des 10 fonctions = {s:.0f} M€ ; TOTAL Eurostat = {val(g,'TOTAL','TE'):.0f} M€ ; PIB {GDP[g]:.0f} ; total % PIB {100*val(g,'TOTAL','TE')/GDP[g]:.2f}")
    s = sum(nature("FR", c)["TE"] for c in L2)
    P(f"FR : somme des sous-fonctions niveau 2 = {s:.0f} M€")
    P(f"FR : F total {nature('FR','TOTAL')['F']/1000:.1f} Md€ ({pct('FR','TOTAL','F'):.2f} % PIB) ; D62 {nature('FR','TOTAL')['D62']/1000:.1f} ; D632 {nature('FR','TOTAL')['D632']/1000:.1f} ; autres {nature('FR','TOTAL')['AUT']/1000:.1f}")
    P(f"Médiane UE-27 : F {mediane('TOTAL','F')[0]:.2f} ; D62 {mediane('TOTAL','D62')[0]:.2f} ; D632 {mediane('TOTAL','D632')[0]:.2f} ; autres {mediane('TOTAL','AUT')[0]:.2f}")
    txt = "\n".join(L)
    print(txt)
    if "--ecrire" in sys.argv:
        open(os.path.join(ICI, "economies_benchmark_europeen_resultats.txt"), "w").write(txt + "\n")


main()
