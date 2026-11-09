# -*- coding: utf-8 -*-
"""Chiffrage du système de votation proposé (T69 et suivantes), reproductible.

Lancer : python3 -I sources/calculs/cout_votation.py
Aucune dépendance hors bibliothèque standard. Fonctions pures ; les entrées
sourcées sont dans FAITS (avec leur origine), les hypothèses dans HYPOTHESES.
Unités : millions d'euros (M€) par an sauf mention. Des ordres de grandeur,
jamais des prédictions. Détail et sources : sources/cout-votation.md
"""
import csv
import os
import statistics

# --------------------------------------------------------------------------
# FAITS SOURCÉS (année, périmètre, unité) -- voir sources/cout-votation.md §1
# --------------------------------------------------------------------------
FAITS = {
    # Cour des comptes, « L'organisation des élections » (S2024-1302, 20/11/2024)
    "inscrits_2022_M": 48.8,              # électeurs inscrits au 09/03/2022 (M)
    "p232_action2_M": {2017: 297.8, 2018: 100.7, 2019: 112.3, 2020: 146.4,
                       2021: 290.0, 2022: 414.2},          # CP consommés, M€
    "p232_total_2022_M": 422.3,           # programme 232 hors actions partis, tableau 28
    "etat_total_2022_M": 461.4,           # coût pour l'État, estimation basse (Cour)
    "legislatives_2022_P232_M": 164.41,   # tableau 8 : coût de fonctionnement P232
    "presidentielle_2022_P232_M": 237.33,
    "europeennes_2019_P232_M": 131.39,
    "propagande_legislatives_2022_M": 96.20,
    "propagande_presidentielle_2022_M": 159.45,
    "propagande_presid_commission_M": 47.97,   # mise sous pli (commission de propagande)
    "propagande_presid_acheminement_M": 53.50,  # La Poste
    "frais_assemblee_legislatives_2022_M": 15.33,  # versés par l'État aux communes
    "frais_assemblee_presidentielle_2022_M": 15.51,
    "frais_par_bureau_eur": 44.73,        # par bureau, par tour (inchangé depuis 2006)
    "frais_par_inscrit_eur": 0.10,
    "part_etat_cout_reel_communes": 0.15,  # AMF 2017, cité par la Cour (non vérifié par elle)
    # Sénat, rapport sur le PLF 2026 (mission Pouvoirs publics), M€
    "an_dotation_2026": 607.65, "an_budget_2026": 644.01,
    "senat_dotation_2026": 353.47, "senat_budget_2026": 382.28,
    "chaines_parlementaires_2026": 35.6,
    "senatoriales_2026_P232": 3.7,        # organisation des sénatoriales (renouvellement par moitié, tous les 3 ans)
    "municipales_2026_P232": 193.5,
    # Référendum du 29/05/2005 : réponse du ministre de l'Intérieur (QE n° 70440, JO 11/10/2005)
    "referendum_2005_M": 130.6,
    # Comparateurs numériques et institutions
    "france_identite_cumul_M": 70.0,      # « plus de 70 M€ engagés » (ministre, 19/05/2026)
    "france_identite_entretien_M_an": 12.0,
    "france_identite_dev_M_an": 7.0,      # sur 4 ans
    "cbo_demande_2025_MUSD": 73.5, "cbo_etp_2025": 278,
    "geneve_chvote_dev_MCHF": 4.74, "geneve_chvote_expl_MCHF_an": 3.64,
    "confederation_essais_MCHF": 1.9,     # selon Inside-IT cité par swissinfo (secondaire)
    "estonie_cout_par_vote_eur": {"internet": 2.32, "papier_jour": 4.37,
                                  "anticipe_comté": 6.24, "bureau_local": 20.41},  # municipales 2017
    "suisse_parlement_MCHF": 106, "suisse_elections_votations_MCHF": 54,  # RTS 2019 via Le News (secondaire)
    "illectronisme_2021": 0.154,          # Insee Première n° 1953 (15 ans ou plus)
}

# --------------------------------------------------------------------------
# HYPOTHÈSES (estimations de Claude, à discuter) : bas / central / haut
# « bas » = coûts bas ; « haut » = coûts hauts. Voir cout-votation.md §2.
# --------------------------------------------------------------------------
HYPOTHESES = {
    "plateforme_capex_M":        {"bas": 40,  "central": 100, "haut": 250},
    "amortissement_ans":         5,
    "plateforme_opex_M":         {"bas": 12,  "central": 30,  "haut": 70},
    "edito_M":                   {"bas": 10,  "central": 25,  "haut": 60},
    "securite_audits_M":         {"bas": 3,   "central": 8,   "haut": 20},
    "contre_expertise_M":        {"bas": 20,  "central": 60,  "haut": 120},
    "transparence_M":            {"bas": 5,   "central": 15,  "haut": 30},
    "inclusion_numerique_M":     {"bas": 5,   "central": 15,  "haut": 40},
    "part_papier":               {"bas": 0.10, "central": 0.15, "haut": 0.25},
    "sessions_par_an":           4,
    "cout_courrier_par_elec_eur": {"bas": 1.00, "central": None, "haut": 2.50},  # central calculé (Cour)
    "bureaux_papier":            {"bas": 5000, "central": 15000, "haut": 35000},
    "cout_bureau_session_eur":   {"bas": 500, "central": None, "haut": 1200},    # central calculé (AMF/Cour)
    "part_economie_parlement":   {"bas": 0.50, "central": 0.70, "haut": 0.85},  # des dotations AN + Sénat
    "taux_USD_EUR":              0.92,
    "horizon_cycle_ans":         5,
}


def moyenne_cycle_action2(faits=FAITS):
    """Moyenne annuelle de l'action 2 « Organisation des élections » sur 2018-2022 (cycle complet)."""
    a = faits["p232_action2_M"]
    return sum(a[y] for y in range(2018, 2023)) / 5


def bureaux_de_vote_derives(faits=FAITS):
    """Nombre de bureaux déduit des frais d'assemblée de la présidentielle 2022.
    Hypothèse : deux tours, 48,7 M d'inscrits ; frais = 44,73 €/bureau/tour + 0,10 €/inscrit/tour."""
    par_tour = faits["frais_assemblee_presidentielle_2022_M"] / 2
    variable = faits["frais_par_inscrit_eur"] * 48.7  # M€
    return (par_tour - variable) * 1e6 / faits["frais_par_bureau_eur"]


def cout_reel_bureau_par_tour(faits=FAITS):
    """Coût réel communal d'un bureau et d'un tour : (frais versés par l'État / 15 %) / 2 tours / nb de bureaux."""
    reel_total = faits["frais_assemblee_legislatives_2022_M"] / faits["part_etat_cout_reel_communes"]
    return reel_total / 2 * 1e6 / bureaux_de_vote_derives(faits)


def cout_courrier_par_electeur_et_tour(faits=FAITS):
    """Propagande écrite de la présidentielle 2022, tout compris (impression remboursée, mise sous pli,
    acheminement), par inscrit et par tour. Variante « routage seul » sans l'impression."""
    inscrits = 48.7
    tout = faits["propagande_presidentielle_2022_M"] / (inscrits * 2)
    routage = (faits["propagande_presid_commission_M"] + faits["propagande_presid_acheminement_M"]) / (inscrits * 2)
    return tout, routage


def cout_legislatives_annualise(faits=FAITS, h=HYPOTHESES):
    """Coût annualisé des législatives : État (P232 mis à l'échelle du coût total État) + part communale nette."""
    cycle = h["horizon_cycle_ans"]
    etat = faits["legislatives_2022_P232_M"] * faits["etat_total_2022_M"] / faits["p232_total_2022_M"]
    communes_brut = faits["frais_assemblee_legislatives_2022_M"] / faits["part_etat_cout_reel_communes"]
    communes_net = communes_brut - faits["frais_assemblee_legislatives_2022_M"]
    return {"etat_par_scrutin": etat, "communes_net_par_scrutin": communes_net,
            "annuel": (etat + communes_net) / cycle,
            "annuel_etat": etat / cycle}


def cout_senatoriales_annualise(faits=FAITS):
    return faits["senatoriales_2026_P232"] / 3  # une série tous les 3 ans (renouvellement par moitié)


def economie_actuelle(scenario_eco, faits=FAITS, h=HYPOTHESES, avec_remplacement=False):
    """Économie annuelle brute : part des dotations AN + Sénat + élections législatives et sénatoriales.
    avec_remplacement=True : l'élection de la liste de gouvernement coûte autant qu'une législative."""
    dotations = faits["an_dotation_2026"] + faits["senat_dotation_2026"]
    parl = dotations * h["part_economie_parlement"][scenario_eco]
    leg = cout_legislatives_annualise(faits, h)["annuel"]
    sen = cout_senatoriales_annualise(faits)
    elections = 0.0 if avec_remplacement else leg
    return {"parlement": parl, "legislatives": elections, "senatoriales": sen,
            "total": parl + elections + sen}


def cout_nouveau_systeme(sc, faits=FAITS, h=HYPOTHESES):
    """Coût annuel (exploitation + capex amorti) pour un scénario de coûts : bas / central / haut."""
    inscrits = faits["inscrits_2022_M"]
    tout, _ = cout_courrier_par_electeur_et_tour(faits)
    unit_courrier = h["cout_courrier_par_elec_eur"][sc] or tout
    unit_bureau = h["cout_bureau_session_eur"][sc] or cout_reel_bureau_par_tour(faits)
    s = h["sessions_par_an"]
    papier_courrier = inscrits * h["part_papier"][sc] * s * unit_courrier
    bureaux = h["bureaux_papier"][sc] * s * unit_bureau / 1e6
    lignes = {
        "plateforme_capex_amorti": h["plateforme_capex_M"][sc] / h["amortissement_ans"],
        "plateforme_exploitation": h["plateforme_opex_M"][sc],
        "redaction_verification": h["edito_M"][sc],
        "securite_audits": h["securite_audits_M"][sc],
        "contre_expertise": h["contre_expertise_M"][sc],
        "instance_transparence": h["transparence_M"][sc],
        "inclusion_numerique": h["inclusion_numerique_M"][sc],
        "courrier_papier": papier_courrier,
        "bureaux_papier": bureaux,
    }
    lignes["total"] = sum(lignes.values())
    return lignes


def solde(sc_cout, sc_eco, avec_remplacement=False):
    """Solde annuel = économies - coûts nouveaux (positif = le système coûte moins cher qu'aujourd'hui)."""
    return economie_actuelle(sc_eco, avec_remplacement=avec_remplacement)["total"] - cout_nouveau_systeme(sc_cout)["total"]


def participation_suisse(chemin=None, depuis=2015):
    """Participation moyenne par objet et par dimanche (Swissvotes, Université de Berne), si le fichier est présent."""
    chemin = chemin or os.path.expandvars("$DONNEES/sources/democratie/swissvotes_dataset.csv")
    if not os.path.exists(chemin):
        return None
    with open(chemin, encoding="utf-8-sig") as f:
        lignes = list(csv.DictReader(f, delimiter=";"))
    par_date = {}
    for l in lignes:
        b = (l.get("bet") or "").strip()
        if b in ("", ".", "None"):
            continue
        d = l["datum"]
        if int(d.split(".")[2]) >= depuis:
            par_date.setdefault(d, float(b.replace(",", ".")))
    return statistics.mean(par_date.values()), len(par_date)


def cout_par_bulletin(sc, participation=0.45, faits=FAITS, h=HYPOTHESES):
    """Coût du nouveau système par bulletin déposé, en €, pour une participation donnée (hypothèse)."""
    total = cout_nouveau_systeme(sc, faits, h)["total"]
    bulletins_par_an = faits["inscrits_2022_M"] * participation * h["sessions_par_an"]
    return total / bulletins_par_an


def main():
    f, h = FAITS, HYPOTHESES
    print("== 1. COÛT ACTUEL ==")
    print(f"Action 2 (organisation des élections), moyenne 2018-2022 : {moyenne_cycle_action2():.1f} M€/an")
    print(f"Coût État 2022 (Cour, estimation basse) : {f['etat_total_2022_M']} M€ ; P232 hors partis : {f['p232_total_2022_M']} M€")
    nb = bureaux_de_vote_derives()
    print(f"Bureaux de vote dérivés des frais d'assemblée : {nb:,.0f} (à comparer ~69 000 non confirmé)")
    print(f"Coût réel communal par bureau et par tour (AMF 15 %) : {cout_reel_bureau_par_tour():.0f} €")
    tout, routage = cout_courrier_par_electeur_et_tour()
    print(f"Courrier propagande présidentielle 2022 par inscrit et par tour : {tout:.2f} € (tout compris), {routage:.2f} € (routage seul)")
    leg = cout_legislatives_annualise()
    print(f"Législatives : État {leg['etat_par_scrutin']:.1f} M€/scrutin + communes net {leg['communes_net_par_scrutin']:.1f} M€ -> {leg['annuel']:.1f} M€/an sur 5 ans")
    print(f"Sénatoriales : {cout_senatoriales_annualise():.2f} M€/an")
    dot = f["an_dotation_2026"] + f["senat_dotation_2026"]
    bud = f["an_budget_2026"] + f["senat_budget_2026"]
    print(f"AN + Sénat : dotations {dot:.1f} M€, budgets complets {bud:.1f} M€ (2026) ; chaînes parlementaires {f['chaines_parlementaires_2026']} M€ non comptées")
    print(f"Référendum 2005 : {f['referendum_2005_M']} M€ (courant 2005)")

    print("\n== 2. NOUVEAU SYSTÈME (M€/an) ==")
    for sc in ("bas", "central", "haut"):
        c = cout_nouveau_systeme(sc)
        print(sc.upper(), {k: round(v, 1) for k, v in c.items()})
        print(f"   par bulletin (participation 45 %) : {cout_par_bulletin(sc):.2f} €")
    p = participation_suisse()
    if p:
        print(f"Participation suisse moyenne par dimanche depuis 2015 : {p[0]:.1f} % ({p[1]} dimanches)")

    print("\n== 3. ÉCONOMIES ET SOLDE (M€/an ; positif = économie nette) ==")
    for eco in ("bas", "central", "haut"):
        e = economie_actuelle(eco)
        e2 = economie_actuelle(eco, avec_remplacement=True)
        print(f"Économies ({eco}) : {e['total']:.0f} (sans élection de remplacement) ; {e2['total']:.0f} (avec élection de la liste de gouvernement au coût d'une législative)")
    print("Matrice solde, variante A (législatives supprimées sans remplacement) : lignes = coûts, colonnes = économies")
    print("          eco_bas  eco_central  eco_haut")
    for cs in ("bas", "central", "haut"):
        print(f"cout_{cs:<7}" + "  ".join(f"{solde(cs, es):9.0f}" for es in ("bas", "central", "haut")))
    print("Variante B (élection de la liste de gouvernement au coût d'une législative) :")
    for cs in ("bas", "central", "haut"):
        print(f"cout_{cs:<7}" + "  ".join(f"{solde(cs, es, True):9.0f}" for es in ("bas", "central", "haut")))
    fav, cen, def_ = solde("bas", "haut"), solde("central", "central"), solde("haut", "bas")
    print(f"Diagonale A : favorable {fav:.0f} ; central {cen:.0f} ; défavorable {def_:.0f}")
    fav, cen, def_ = solde("bas", "haut", True), solde("central", "central", True), solde("haut", "bas", True)
    print(f"Diagonale B : favorable {fav:.0f} ; central {cen:.0f} ; défavorable {def_:.0f}")

    print("\n== COMPARAISONS ==")
    print(f"CBO 2025 : {f['cbo_demande_2025_MUSD']} M$ -> {f['cbo_demande_2025_MUSD'] * h['taux_USD_EUR']:.1f} M€ (taux {h['taux_USD_EUR']}, hypothèse)")
    print(f"Genève CHVote : développement {f['geneve_chvote_dev_MCHF']} MCHF, exploitation {f['geneve_chvote_expl_MCHF_an']} MCHF/an (un canton)")
    print(f"Estonie 2017, coût administratif par vote : {f['estonie_cout_par_vote_eur']}")
    print(f"Poids de la plateforme (central, exploitation + capex amorti) / France Identité (entretien + dév.) : "
          f"{(h['plateforme_opex_M']['central'] + h['plateforme_capex_M']['central']/h['amortissement_ans']):.0f} contre "
          f"{f['france_identite_entretien_M_an'] + f['france_identite_dev_M_an']:.0f} M€/an")
    print("Dématérialisation de la propagande (Cour, cycle) : renonciation 50 % = 250 M€ économisés par cycle (tableau 10)")


if __name__ == "__main__":
    main()
