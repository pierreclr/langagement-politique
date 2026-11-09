#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
modeles/gagnants-perdants/donnees/collecte.py — Tâche T14.

Calcule le REVENU DISPONIBLE ACTUEL (législation 2026) de chaque cas type :
  - API web OpenFisca-France (https://api.fr.openfisca.org/latest/calculate) pour l'impôt
    sur le revenu, les salaires nets, le chômage net, le RSA, la prime d'activité, les aides
    au logement, les prestations familiales, l'ASPA et les prélèvements sur le capital ;
  - API du simulateur Urssaf mon-entreprise (https://mon-entreprise.urssaf.fr/api/v1/evaluate)
    pour le coût total employeur (OpenFisca 175.0.45 donne un « salaire super brut » négatif au
    Smic en 2026 : anomalie de la réduction générale, voir methode.md) et pour les cotisations
    d'un micro-entrepreneur ;
  - calcul manuel documenté pour ce qu'OpenFisca ne couvre pas ou couvre mal ici : CSG, CRDS et
    CASA sur les pensions (taux déduits du taux de CSG déductible calculé par OpenFisca),
    allocation chômage d'un cadre (règlement d'assurance chômage), droits de succession.

Usage (depuis la racine du dépôt, réseau requis) :
    python3 -I modeles/gagnants-perdants/donnees/collecte.py
Écrit : donnees/cas_types_actuel.csv, donnees/reponses_api.json, ../cas_types_donnees.js
Consultation des API : 2026-10-25 (OpenFisca-France 175.0.45).
"""
import json, os, urllib.request, urllib.error, csv

ICI = os.path.dirname(os.path.abspath(__file__))
OF = "https://api.fr.openfisca.org/latest/calculate"
URSSAF = "https://mon-entreprise.urssaf.fr/api/v1/evaluate"
ANNEES = ["2024", "2025", "2026"]
MOIS = ["2026-%02d" % i for i in range(1, 13)]
SMIC = 1867.02  # brut mensuel 35 h au 1/6/2026 (service-public.gouv.fr)


def post(url, corps):
    req = urllib.request.Request(url, data=json.dumps(corps).encode(), headers={"Content-Type": "application/json"})
    try:
        return json.load(urllib.request.urlopen(req, timeout=180))
    except urllib.error.HTTPError as e:
        raise RuntimeError(e.read().decode()[:2000])


def cout_employeur(brut, temps_partiel_h=None):
    sit = {"salarié . contrat . salaire brut": "%.2f €/mois" % brut}
    if temps_partiel_h:
        sit["salarié . contrat . temps de travail . temps partiel"] = "oui"
        sit["salarié . contrat . temps de travail . temps partiel . heures par semaine"] = "%s heure/semaine" % temps_partiel_h
    r = post(URSSAF, {"situation": sit, "expressions": ["salarié . coût total employeur",
                                                       "salarié . rémunération . net . à payer avant impôt"]})
    return round(r["evaluate"][0]["nodeValue"], 2), round(r["evaluate"][1]["nodeValue"], 2)


def cotis_micro_liberal(ca):
    sit = {"entreprise . catégorie juridique": "'EI'",
           "entreprise . catégorie juridique . EI . auto-entrepreneur": "oui",
           "entreprise . chiffre d'affaires": "%.0f €/mois" % ca,
           "entreprise . activité . nature": "'libérale'"}
    r = post(URSSAF, {"situation": sit, "expressions": ["dirigeant . auto-entrepreneur . cotisations et contributions"]})
    return round(r["evaluate"][0]["nodeValue"], 2)


# ---------- Hypothèses de logement (hypothèse de Claude, ⚠️) ----------
# Locataire du parc privé en zone APL 2 ; loyer mensuel hors charges : 500 € (1 adulte),
# 650 € (2 adultes), + 75 € par enfant. Les foyers aisés et les retraités sont propriétaires.
def loyer(adultes, enfants):
    return (500 if adultes == 1 else 650) + 75 * enfants


NAISS_ENFANTS = ["2018-05-01", "2015-05-01", "2012-05-01", "2020-05-01"]  # 8, 11, 14, 6 ans en 2026

# ---------- Cas types ----------
# salaires : liste de [brut mensuel, heures/semaine si temps partiel]
CAS = [
    dict(id="sans_emploi_seul", libelle="Personne seule sans emploi (RSA)", adultes=1, enfants=0, logement="locataire"),
    dict(id="temps_partiel", libelle="Salarié seul à mi-temps au Smic", adultes=1, enfants=0, logement="locataire",
         salaires=[[SMIC / 2, 17.5]]),
    dict(id="smic", libelle="Salarié seul au Smic à temps plein", adultes=1, enfants=0, logement="locataire", salaires=[[SMIC]]),
    dict(id="median", libelle="Salarié seul au salaire médian (1,5 Smic brut)", adultes=1, enfants=0, logement="locataire",
         salaires=[[1.5 * SMIC]]),
    dict(id="cadre_2x", libelle="Cadre seul, 2 fois le médian (3 Smic brut)", adultes=1, enfants=0, logement="proprietaire",
         salaires=[[3 * SMIC]]),
    dict(id="cadre_4x", libelle="Cadre seul, 4 fois le médian (6 Smic brut)", adultes=1, enfants=0, logement="proprietaire",
         salaires=[[6 * SMIC]]),
    dict(id="tres_haut_salaire", libelle="Très haut salaire (30 000 € brut par mois)", adultes=1, enfants=0,
         logement="proprietaire", salaires=[[30000]]),
    dict(id="independant", libelle="Indépendant (micro-entrepreneur libéral, 3 000 € de chiffre d'affaires par mois)",
         adultes=1, enfants=0, logement="locataire", micro_ca=3000, charges_reelles_part=0.15),
    dict(id="intermittent", libelle="Intermittent du spectacle (salaires + allocation, moyennes Unédic)", adultes=1,
         enfants=0, logement="locataire", salaires=[[1366, None, "intermittent"]], chomage_brut=1117.5),
    dict(id="cadre_chomage", libelle="Cadre au chômage indemnisé (ancien salaire 3 Smic brut)", adultes=1, enfants=0,
         logement="proprietaire", chomage_ancien_brut=3 * SMIC),
] + [
    dict(id="couple_%d_enfant%s" % (n, "s" if n > 1 else ""),
         libelle="Couple, Smic + salaire médian, %d enfant%s" % (n, "s" if n > 1 else ""),
         adultes=2, enfants=n, logement="locataire", salaires=[[SMIC], [1.5 * SMIC]]) for n in range(0, 5)
] + [
    dict(id="couple_monoactif_2_enfants", libelle="Couple, un seul salaire au Smic, 2 enfants", adultes=2, enfants=2,
         logement="locataire", salaires=[[SMIC], None]),
    dict(id="parent_isole_1_enfant", libelle="Parent isolé au Smic, 1 enfant", adultes=1, enfants=1, logement="locataire",
         salaires=[[SMIC]]),
    dict(id="parent_isole_2_enfants", libelle="Parent isolé au Smic, 2 enfants", adultes=1, enfants=2, logement="locataire",
         salaires=[[SMIC]]),
] + [
    dict(id="retraite_%d" % p, libelle="Retraité seul, pension de %s € brut par mois" % format(p, ",").replace(",", " "),
         adultes=1, enfants=0, logement="proprietaire", pensions=[p]) for p in (800, 1200, 1600, 2500, 4000)
] + [
    dict(id="couple_retraites", libelle="Couple de retraités, pensions de 1 600 € et 800 € brut", adultes=2, enfants=0,
         logement="proprietaire", pensions=[1600, 800]),
    dict(id="proprietaire_bailleur", libelle="Salarié médian propriétaire bailleur (12 000 € de loyers nets par an)",
         adultes=1, enfants=0, logement="proprietaire", salaires=[[1.5 * SMIC]], foncier_annuel=12000),
    dict(id="rentier", libelle="Rentier : 100 000 € de dividendes par an", adultes=1, enfants=0, logement="proprietaire",
         dividendes_annuels=100000),
    dict(id="heritier", libelle="Salarié médian qui hérite de 300 000 € d'un parent", adultes=1, enfants=0,
         logement="locataire", salaires=[[1.5 * SMIC]], heritage=300000),
]


def ans(v):
    return {y: v for y in ANNEES}


def situation(c):
    ind, roles_parents, enfants = {}, [], []
    for i in range(c["adultes"]):
        pid = "a%d" % (i + 1)
        roles_parents.append(pid)
        retraite = bool(c.get("pensions"))
        ind[pid] = {"date_naissance": {"ETERNITY": "1955-01-01" if retraite else "1985-01-01"}}
        sal = (c.get("salaires") or [None] * c["adultes"])
        s = sal[i] if i < len(sal) else None
        if s:
            ind[pid]["salaire_de_base"] = ans(12 * s[0])
            if len(s) > 1 and s[1]:
                ind[pid]["heures_remunerees_volume"] = ans(s[1] * 52)  # volume annuel ≈ 52 semaines
                ind[pid]["contrat_de_travail"] = ans("temps_partiel")
        if i == 0 and c.get("chomage_brut"):
            ind[pid]["chomage_brut"] = ans(12 * c["chomage_brut"])
        if i == 0 and c.get("chomage_ancien_brut"):
            ind[pid]["chomage_brut"] = {"2026": 12 * c["are_brut"]}
            ind[pid]["salaire_de_base"] = {"2024": 12 * c["chomage_ancien_brut"], "2025": 12 * c["chomage_ancien_brut"]}
        if c.get("pensions") and i < len(c["pensions"]):
            ind[pid]["retraite_brute"] = ans(12 * c["pensions"][i])
        for v in ("salaire_net", "chomage_net", "csg_deductible_retraite"):
            ind[pid][v] = {m: None for m in MOIS}
    for k in range(c["enfants"]):
        eid = "e%d" % (k + 1)
        enfants.append(eid)
        ind[eid] = {"date_naissance": {"ETERNITY": NAISS_ENFANTS[k]}}
    famille = {"parents": roles_parents, "enfants": enfants}
    for v in ("rsa", "ppa", "aide_logement", "aspa", "asf", "af"):
        famille[v] = {m: None for m in MOIS}
    famille["prestations_familiales"] = {"2026": None}
    foyer = {"declarants": roles_parents, "personnes_a_charge": enfants, "impot_revenu_restant_a_payer": {"2026": None}}
    if c.get("dividendes_annuels"):
        foyer["f2dc"] = ans(c["dividendes_annuels"])
        foyer["f2op"] = ans(False)
        foyer["prelevements_sociaux_revenus_capital"] = {"2026": None}
    if c.get("foncier_annuel"):
        foyer["f4ba"] = ans(c["foncier_annuel"])
        foyer["prelevements_sociaux_revenus_capital"] = {"2026": None}
    if c["adultes"] == 2:
        for pid in roles_parents:
            ind[pid]["statut_marital"] = ans("marie")
    menage = {"personne_de_reference": [roles_parents[0]], "enfants": enfants, "revenu_disponible": {"2026": None},
              "impots_directs": {"2026": None}}
    if c["adultes"] == 2:
        menage["conjoint"] = [roles_parents[1]]
    if c["logement"] == "locataire":
        menage["statut_occupation_logement"] = ans("locataire_vide")
        menage["loyer"] = ans(12 * loyer(c["adultes"], c["enfants"]))
        menage["zone_apl"] = ans("zone_2")
    else:
        menage["statut_occupation_logement"] = ans("proprietaire")
    if c.get("micro_ca"):
        ind["a1"]["mbnc_impo"] = ans(12 * c["micro_ca"])
    return {"individus": ind, "familles": {"f": famille}, "foyers_fiscaux": {"ff": foyer}, "menages": {"m": menage}}


def somme(d):
    return sum(v for v in d.values() if v is not None)


# Taux de prélèvements sociaux sur les pensions selon le taux de CSG déductible calculé par OpenFisca
# (CSG + CRDS + CASA) : exonéré 0 ; taux réduit 3,8 % déductible → 4,3 % ; médian 4,2 % → 7,4 % ;
# plein 5,9 % → 9,1 % (service-public.gouv.fr, « CSG et CRDS sur les pensions de retraite »).
TAUX_PENSIONS = {0.0: 0.0, 0.038: 0.043, 0.042: 0.074, 0.059: 0.091}


def are_cadre(ancien_brut):
    """Allocation chômage journalière (règlement d'assurance chômage) : max(40,4 % SJR + partie fixe ;
    57 % SJR), plafonnée à 75 % du SJR. Partie fixe 13,18 € au 1/7/2025 (paramètre OpenFisca)."""
    sjr = ancien_brut * 12 / 365
    aj = min(max(0.404 * sjr + 13.18, 0.57 * sjr), 0.75 * sjr)
    return round(aj * 365 / 12, 2), round(sjr, 2), round(aj, 2)


def droits_succession_ligne_directe(montant):
    """Art. 777 et 779 du CGI : abattement de 100 000 € par parent et par enfant, puis barème."""
    base = max(0, montant - 100000)
    tranches = [(8072, 0.05), (12109, 0.10), (15932, 0.15), (552324, 0.20), (902838, 0.30), (1805677, 0.40), (1e18, 0.45)]
    impot, bas = 0.0, 0.0
    for haut, t in tranches:
        if base > bas:
            impot += (min(base, haut) - bas) * t
        bas = haut
    return round(impot, 2)


def main():
    lignes, brut_api = [], {}
    for c in CAS:
        if c.get("chomage_ancien_brut"):
            c["are_brut"], c["sjr"], c["are_journaliere"] = are_cadre(c["chomage_ancien_brut"])
        # coût employeur (Urssaf) des salaires
        couts = []
        for s in (c.get("salaires") or []):
            if not s:
                couts.append(0.0)
                continue
            if len(s) > 2 and s[2] == "intermittent":
                # ⚠️ hypothèse : coût d'un intermittent = brut × (ratio Urssaf à 2 Smic + 5 points de
                # contribution chômage patronale majorée des annexes 8 et 10)
                ce, _ = cout_employeur(2 * SMIC)
                couts.append(round(s[0] * (ce / (2 * SMIC) + 0.05), 2))
            else:
                couts.append(cout_employeur(s[0], s[1] if len(s) > 1 else None)[0])
        c["couts_employeur"] = couts
        r = post(OF, situation(c))
        brut_api[c["id"]] = r
        ind, fam, ff, men = r["individus"], r["familles"]["f"], r["foyers_fiscaux"]["ff"], r["menages"]["m"]
        adultes = ["a%d" % (i + 1) for i in range(c["adultes"])]
        sal_net = sum(somme(ind[a]["salaire_net"]) for a in adultes) / 12
        cho_net = sum(somme(ind[a]["chomage_net"]) for a in adultes) / 12
        if c.get("chomage_ancien_brut"):
            # Participation de 3 % du SJR au financement des retraites complémentaires, retenue sur
            # l'allocation (Unédic) et absente du calcul OpenFisca : on la retire ici.
            cho_net -= 0.03 * c["sjr"] * 365 / 12
        ir = -ff["impot_revenu_restant_a_payer"]["2026"] / 12
        prest = {v: somme(fam[v]) / 12 for v in ("rsa", "ppa", "aide_logement", "aspa", "asf", "af")}
        prest_fam_total = fam["prestations_familiales"]["2026"] / 12
        rd_of = men["revenu_disponible"]["2026"] / 12
        # Pensions : prélèvements sociaux recalculés (anomalie OpenFisca : CSG imposable, CRDS et CASA nulles)
        pens_brut = sum(c.get("pensions") or [0])
        pens_net = 0.0
        for i, p in enumerate(c.get("pensions") or []):
            ded = -somme(ind[adultes[i]]["csg_deductible_retraite"]) / 12
            taux_ded = round(ded / p, 3) if p else 0
            taux = TAUX_PENSIONS.get(taux_ded)
            if taux is None:
                raise RuntimeError("taux de CSG retraite inattendu %s" % taux_ded)
            pens_net += p * (1 - taux)
        ps_capital = -(ff.get("prelevements_sociaux_revenus_capital", {}).get("2026", 0) or 0) / 12
        capital_brut = (c.get("dividendes_annuels", 0) + c.get("foncier_annuel", 0)) / 12
        micro = 0.0
        cotis_micro = 0.0
        if c.get("micro_ca"):
            cotis_micro = cotis_micro_liberal(c["micro_ca"])
            micro = c["micro_ca"] * (1 - c["charges_reelles_part"]) - cotis_micro
        rd = (sal_net + cho_net + pens_net + micro + capital_brut - ps_capital - ir
              + prest["rsa"] + prest["ppa"] + prest["aide_logement"] + prest["aspa"]
              + prest_fam_total)  # prestations_familiales (OpenFisca) inclut AF, CF, ARS, PAJE, ASF
        c["actuel"] = {
            "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
            "salaires_nets": round(sal_net, 2), "chomage_net": round(cho_net, 2), "pensions_nettes": round(pens_net, 2),
            "revenu_independant_net": round(micro, 2), "cotisations_micro": round(cotis_micro, 2),
            "capital_brut": round(capital_brut, 2), "prelevements_sociaux_capital": round(ps_capital, 2),
            "impot_revenu": round(ir, 2),
            "rsa": round(prest["rsa"], 2), "prime_activite": round(prest["ppa"], 2),
            "aides_logement": round(prest["aide_logement"], 2), "aspa": round(prest["aspa"], 2),
            "prestations_familiales": round(prest_fam_total, 2),
            "dont_allocations_familiales": round(prest["af"], 2), "dont_asf": round(prest["asf"], 2),
            "revenu_disponible": round(rd, 2), "revenu_disponible_openfisca_brut": round(rd_of, 2),
        }
        if c.get("heritage"):
            c["actuel"]["droits_succession"] = droits_succession_ligne_directe(c["heritage"])
            c["actuel"]["droits_succession_100k"] = droits_succession_ligne_directe(100000)
            c["actuel"]["droits_succession_1M"] = droits_succession_ligne_directe(1000000)
        print("%-28s RD actuel %9.2f €/mois (OpenFisca brut %9.2f) coûts %s" % (c["id"], rd, rd_of, couts))
        lignes.append(c)
    with open(os.path.join(ICI, "reponses_api.json"), "w") as f:
        json.dump(brut_api, f, ensure_ascii=False, indent=1)
    champs = ["id", "libelle", "adultes", "enfants", "logement", "couts_employeur"] + list(lignes[0]["actuel"].keys())
    with open(os.path.join(ICI, "cas_types_actuel.csv"), "w", newline="") as f:
        f.write("# source: API OpenFisca-France 175.0.45 (législation 2026, consultée le 2026-10-25), API Urssaf mon-entreprise "
                "(coût employeur, cotisations micro), calculs documentés dans collecte.py ; montants en € par mois\n")
        w = csv.writer(f)
        w.writerow(champs)
        for c in lignes:
            w.writerow([c["id"], c["libelle"], c["adultes"], c["enfants"], c["logement"], " ; ".join("%.2f" % x for x in c["couts_employeur"])]
                       + [c["actuel"].get(k, "") for k in champs[6:]])
    sortie = os.path.join(os.path.dirname(ICI), "cas_types_donnees.js")
    with open(sortie, "w") as f:
        f.write("// Généré par donnees/collecte.py le 2026-10-25 : ne pas modifier à la main.\n"
                "// Revenu disponible ACTUEL des cas types (€ par mois, législation 2026) et entrées du système proposé.\n")
        f.write("var CAS_TYPES_DONNEES = " + json.dumps(lignes, ensure_ascii=False, indent=1) + ";\n")
        f.write("if (typeof module !== 'undefined' && module.exports) module.exports = CAS_TYPES_DONNEES;\n")


if __name__ == "__main__":
    main()
