#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Chiffrage de P-042 a P-046 : statut unique, regimes speciaux, intermittence,
micro-entreprise, caisses et regimes multiples.

Reproductible : python3 sources/calculs/chiffrage_statuts_regimes.py
Bibliotheque standard seulement. Md EUR par an, euros 2024-2026, regime de croisiere.

CONVENTION des scenarios : « bas / central / haut » = AMPLEUR de l'effet budgetaire
POUR L'ETAT (bas = le moins favorable aux finances publiques, haut = le plus favorable).
Un effet negatif est un cout. C'est l'ordre de sources/calculs/economies_gestion_simplification.py
(et l'inverse de modeles/systeme-ideal, qui ecrit favorable / central / defavorable
dans le sens du solde : ici bas = defavorable).

Les DONNEES (faits lus) sont en tete avec leur source ; les HYPOTHESES sont numerotees S1 a S12
et listees dans verifications.md (V13100 a V13115). Rien ici n'est une prediction.
Aucun fichier de modeles/systeme-ideal/ n'est lu ni modifie : les valeurs du modele
sont recopiees en constantes (avec leur origine) pour eviter tout double compte.
"""

SC = ("bas", "central", "haut")

# ======================================================================= DONNEES (faits lus)
# --- Regimes speciaux : mission « Regimes sociaux et de retraite », PLF 2026 (credits de paiement, EUR)
# Source : Projet annuel de performances 2026, mission Regimes sociaux et de retraite
# https://www.assemblee-nationale.fr/dyn/contenu/visualisation/1088020/file/PAP2026_BG_Regimes_sociaux_retraite_RB.pdf
# (lu le 05/11/2026 ; projet initial, la LFI 2026 definitive n'est pas relue : V13101)
P198_TRANSPORTS = 4_122_679_786      # dont SNCF 3 225 801 919 ; RATP 885 633 671 ; autres 11 244 196
P198_SNCF = 3_225_801_919
P198_RATP = 885_633_671
P198_AUTRES = 11_244_196
P197_MARINS = 801_946_399
P195_MINES_DIVERS = 1_059_391_129    # mines, SEITA, Comedie-Francaise, Opera de Paris, divers
# IEG : pas de credit budgetaire, financement par la contribution tarifaire d'acheminement (CTA).
# 1,509 Md EUR en 2017 (IFRAP, d'apres le rapport du Senat) : chiffre ANCIEN (V13100)
IEG_CTA_2017 = 1.509
# Effectifs (PAP 2026 pour SNCF, RATP 2023 ; marins 2024 ; COR fiche CNIEG, 2023, pour les IEG : V13102)
COTISANTS = {"SNCF": 110_846, "RATP": 39_956, "IEG": 136_000, "marins": 29_037}
PENSIONNES = {"SNCF": 229_329, "RATP": 46_109, "marins": 102_001}
# Age moyen d'ouverture des droits SNCF, projection du PAP 2026 : 57 a 3 mois (2017) -> 59 a 5 mois (2028)
SNCF_AGE_2028 = 59 + 5 / 12
# Gestion de la caisse SNCF (PAP 2026, indicateur 1.1) : 29,2 M EUR pour 5 540,4 M EUR de prestations
SNCF_GESTION_M = 29.2
SNCF_PRESTATIONS_M = 5540.4
# Engagements hors bilan : subventions d'equilibre des regimes speciaux (CGE 2025 via FIPECO), Md EUR
ENGAGEMENT_REGIMES_SPECIAUX_2025 = 149.0     # dont SNCF 86
# Pension moyenne brute de droit direct, regimes speciaux, fin 2023 (DREES, repris de modeles/retraites/resultats.md)
PENSION_MOYENNE_SPECIAUX_MOIS = 2580.0

# --- Fonction publique d'Etat : CAS Pensions
# Rapport d'information AN n° 3066 (15/07/2026), rapporteur Aurelien Le Coq, commission des finances
# https://www.assemblee-nationale.fr/dyn/17/rapports/cion_fin/l17b3066_rapport-information.pdf (lu le 05/11/2026)
CAS_CONTRIB_EMPLOYEUR_2025 = 54.906          # Md EUR (Cour des comptes, execution 2025)
CAS_PENSIONS_2025 = 65.0                     # dont 54 civiles et 11 militaires
TAUX_EMPLOYEUR = {2024: 74.28, 2025: 78.28, 2026: 82.28}   # % ; retenue agent 11,10 %
TAUX_PRIVE_REFERENCE = 16.58                 # % (jaune PLF 2026 : reference secteur prive)
TAUX_REEL_IPP = 34.0                         # % (IPP, cite par le rapporteur) ; Cour ≈ 44 % (⚠️ V13103)
DESEQUILIBRE_DEMOGRAPHIQUE = (20.0, 22.0)    # Md EUR (rapporteur, 15/07/2026)
AVANTAGES_CATEGORIES_ACTIVES = 4.0           # Md EUR : conditions de depart des categories actives et super-actives (⚠️ V13103)
POSTE_PENSIONS_ORANGE_LAPOSTE = 7.0          # Md EUR : pensions sans cotisations en contrepartie (plus de 7)
# Effectifs : Insee Premiere n° 2094 (02/2026) et fichier chiffres-cles (sources/donnees/depenses_4_effectifs_publics.csv)
AGENTS_PUBLICS_2024 = 5_876_700
FONCTIONNAIRES_Y_C_MILITAIRES_2024 = 4_060_234
CONTRACTUELS_2024 = 1_410_204
MILITAIRES_APPROX = 311_000                  # 5,3 % x 5 876 700 (calcul du depot, sources/donnees)
REMUNERATION_AGENTS_PUBLICS_2024 = 363.0     # Md EUR (Insee, comptes nationaux ; sources/economies-effectifs-publics-ia.md)
VOLUME_TRAVAIL_EQTP_2024 = 5_781_800

# --- Intermittence : Unedic, « Les intermittents du spectacle couverts par l'assurance chomage en 2025 »
# https://www.unedic.org/publications/les-intermittents-du-spectacle-couverts-par-lassurance-chomage-en-2025
UNEDIC_INTERMITTENTS = {
    "couverts": 141_000, "indemnises": 126_500, "droits_ouverts": 146_000,
    "allocations": 1.89, "annexe8": 0.85, "annexe10": 1.10,   # Md EUR (arrondis de la page)
    "contributions": 0.472, "ratio_depenses_contributions": 4.01,
    "allocation_moyenne_an": 13_410.0,        # EUR brut (~1 117 EUR / mois)
}
# Valeurs du modele v5.3 recopiees (modeles/systeme-ideal/resultats-optimum.txt § 17.5 et bilan global D02)
MODELE_CHOMAGE_REMPLACE = 37.1               # Md EUR d'allocations chomage remplacees (Drees CPS 2024)
MODELE_CHOMAGE_COMPLEMENT = 12.6             # Md EUR de complement degressif conserve (deg2)
MODELE_SOCLE_MENSUEL = 1000.0                # EUR par adulte et par mois
# modeles/gagnants-perdants : intermittent type, perte mensuelle (EUR / mois) sous les trois taux testes
GP_INTERMITTENT_PERTE_MOIS = (132.0, 309.0, 387.0)

# --- Micro-entrepreneurs : Urssaf (Stat'Ur n° 409/410, 10/2025 ; lus par resume de recherche : V13105)
MICRO_ACTIFS_FIN_2024 = 2_900_000
MICRO_DECLARANTS_2024 = 2_060_000
MICRO_REVENU_MOYEN_2024 = 7_641.0            # EUR par an et par declarant ; definition a verifier (V13105)
# Taux de cotisations sur le chiffre d'affaires, 2025 (urssaf.fr, taux-cotisations-autoentrepeneur ; V13106)
MICRO_TAUX_CA = {"vente": 12.3, "services_BIC": 21.2, "services_BNC": 24.6}
# Abattements forfaitaires de l'impot (portail autoentrepreneur.urssaf.fr ; V13107 : a reverifier pour 2025)
MICRO_ABATTEMENT = {"vente": 0.71, "services_BIC": 0.50, "services_BNC": 0.34}
PLATEFORMES_TRAVAILLEURS = (160_000, 120_000, 200_000)   # VTC + livreurs ; central, bas, haut (V13108)

# --- Caisses : Agirc-Arrco, chiffres cles 2025 (exercice 2024)
# https://www.agirc-arrco.fr/storage/2025/04/Chiffres-cles_2025.pdf (lu le 05/11/2026)
AA_COTISATIONS = 99.337
AA_ALLOCATIONS = 100.953
AA_GESTION_ET_FONDS_SOCIAL = 1.725           # Md EUR ; inclut l'action sociale (V13109)
AA_COTISANTS = 20_059_700
AA_RETRAITES = 13_906_600
# Valeurs recopiees de sources/calculs/economies_gestion_simplification.py (bases L1c, collecte seule)
L1C_BASE = (0.38, 0.77, 1.49)                # MSA + Agirc-Arrco + caisses + petits collecteurs (collecte)
L1C_COEF = (0.30, 0.60, 0.80)                # part supprimee
L1C_ECONOMIE = (0.11, 0.46, 1.19)            # ce que la v5.3 compte deja (au plafond de 84 % pres, V9952)
ARTISTES_AUTEURS_AFFILIES_2024 = 408_587     # Urssaf, cite par le Senat

# ======================================================================= HYPOTHESES (numerotees)
# S1  carriere type des affilies aux regimes speciaux : 35 ans (rythme des departs = actifs / 35)
CARRIERE_ANS = 35
# S2  ecart entre l'age effectif de depart d'aujourd'hui et celui de la regle alignee : 2 / 4 / 6 ans
ECART_AGE = (2.0, 4.0, 6.0)
# S3  passage de l'age de reference a l'age effectif et substitution (mêmes valeurs que retraites_v6, § 20 du modele)
PASSAGE = (0.33, 0.50, 0.80)                 # defavorable / central / favorable
SUBSTITUTION = (0.30, 0.20, 0.10)            # part des gains perdue en chomage / invalidite / maladie
# S4  part du surcout « categories actives » (4 Md EUR) effectivement supprimee : 25 / 50 / 80 %
PART_ACTIVES_SUPPRIMEE = (0.25, 0.50, 0.80)
# S5  part de gestion hors action sociale dans la dotation de l'Agirc-Arrco : 80 %
AA_PART_GESTION = 0.80
# S6  economie sur la gestion du versement des pensions par fusion des caisses : 10 / 20 / 30 %
FUSION_PENSIONS_ECONOMIE = (0.10, 0.20, 0.30)
# S7  part des allocations d'intermittence compensee par le budget de la culture : 0 / 15 / 50 %
COMPENSATION_CULTURE = (0.0, 0.15, 0.50)
# S8  micro : effondrement ou fuite de la base (cessation, travail non declare) : 30 / 10 / 0 %
MICRO_PERTE_BASE = (0.30, 0.10, 0.0)
# S9  conversion volontaire de statut : adhesion 10 / 5 / 2 % ; prime = 6 mois de cout employeur moyen
CONVERSION_ADHESION = (0.10, 0.05, 0.02)
CONVERSION_PRIME_MOIS = 6
TAUX_UNIQUE = 0.42                           # taux unique v5.3 (modele)


# ======================================================================= fonctions pures
def mission_rsr():
    """Subventions d'equilibre de la mission RSR (PLF 2026), Md EUR."""
    return (P198_TRANSPORTS + P197_MARINS + P195_MINES_DIVERS) / 1e9


def ratio_demographique(cotisants, pensionnes):
    return cotisants / pensionnes


def regimes_speciaux_alignement():
    """P-043 (a) : gain de croisiere de l'alignement des actifs en place des regimes speciaux subventionnes.

    Methode : departs annuels = actifs / carriere ; un ecart de n annees de depart laisse, a tout instant,
    n cohortes de moins en retraite ; economie brute = n x departs x pension annuelle ;
    puis passage a l'age effectif et substitution (parametres de retraites_v6).
    Retourne (bas, central, haut) en Md EUR par an, a pleine montee en charge (apres ~ une carriere).
    """
    actifs = sum(COTISANTS.values())
    departs = actifs / CARRIERE_ANS
    pension_an = PENSION_MOYENNE_SPECIAUX_MOIS * 12
    out = []
    for i in range(3):
        brut = ECART_AGE[i] * departs * pension_an / 1e9
        out.append(brut * PASSAGE[i] * (1 - SUBSTITUTION[i]))
    return tuple(out)


def categories_actives():
    """P-043 (b) : fonctionnaires des categories actives et super-actives (police, militaires...)."""
    return tuple(AVANTAGES_CATEGORIES_ACTIVES * p for p in PART_ACTIVES_SUPPRIMEE)


def intermittence():
    """P-044. Retourne un dict de Md EUR.

    - allocations supprimees (Unedic 2025) ;
    - deficit du regime = allocations - contributions (calcul, non publie : V13104) ;
    - part du modele : prorata des allocations dans les 37,1 Md EUR remplaces (deja dans D02) ;
    - cout du socle des indemnises (deja dans l'allocation unique du modele) ;
    - effet net budgetaire borne par les pertes des menages (modeles/gagnants-perdants) ;
    - cout NON compte : compensation culturelle (S7).
    """
    u = UNEDIC_INTERMITTENTS
    alloc = u["allocations"]
    deficit = alloc - u["contributions"]
    part_modele = alloc / MODELE_CHOMAGE_REMPLACE
    socle = u["indemnises"] * 12 * MODELE_SOCLE_MENSUEL / 1e9
    perte_menages = tuple(u["indemnises"] * 12 * x / 1e9 for x in GP_INTERMITTENT_PERTE_MOIS)
    compensation = tuple(-alloc * c for c in reversed(COMPENSATION_CULTURE))   # bas = cout le plus lourd
    return {
        "allocations": alloc, "deficit": deficit, "part_dans_chomage_modele": part_modele,
        "socle_indemnises": socle, "gain_brut_apres_socle": alloc - socle,
        "perte_menages_bornes": perte_menages, "compensation_culture": compensation,
    }


def micro():
    """P-045 : taux effectif des cotisations micro rapporte au revenu apres abattement, et effet budgetaire."""
    eff = {k: MICRO_TAUX_CA[k] / 100 / (1 - MICRO_ABATTEMENT[k]) for k in MICRO_TAUX_CA}
    revenu_total = MICRO_DECLARANTS_2024 * MICRO_REVENU_MOYEN_2024 / 1e9
    taux_min, taux_max = min(eff.values()), max(eff.values())
    taux_moyen = sum(eff.values()) / len(eff)
    actuel = revenu_total * taux_moyen
    unique = revenu_total * TAUX_UNIQUE
    ecart_base = unique - actuel                          # a revenu constant
    # bas : taux le plus proche (aucun gain) et perte de base 30 % ; haut : taux le plus bas et aucune perte
    bas = revenu_total * (TAUX_UNIQUE - taux_max) - MICRO_PERTE_BASE[0] * unique
    central = ecart_base - MICRO_PERTE_BASE[1] * unique
    haut = revenu_total * (TAUX_UNIQUE - taux_min) - MICRO_PERTE_BASE[2] * unique
    return {"taux_effectifs": eff, "revenu_total": revenu_total, "cotisations_actuelles": actuel,
            "au_taux_unique": unique, "ecart_a_revenu_constant": ecart_base,
            "scenarios": (bas, central, haut)}


def caisses():
    """P-046 : ce que la v5.3 compte deja (L1c, collecte) et la reserve non comptee (versement des pensions)."""
    ratio_aa = AA_GESTION_ET_FONDS_SOCIAL / AA_ALLOCATIONS
    base_gestion = AA_GESTION_ET_FONDS_SOCIAL * AA_PART_GESTION
    reserve = tuple(base_gestion * c for c in FUSION_PENSIONS_ECONOMIE)
    sncf_ratio = SNCF_GESTION_M / SNCF_PRESTATIONS_M
    return {"ratio_aa": ratio_aa, "ratio_sncf": sncf_ratio, "deja_compte": L1C_ECONOMIE, "reserve": reserve}


def statut_unique():
    """P-042 : le statut seul ne change pas la depense ; ordres de grandeur utiles a la decision."""
    taux_ecart = TAUX_EMPLOYEUR[2025] - TAUX_PRIVE_REFERENCE            # points
    un_pour_cent_masse = REMUNERATION_AGENTS_PUBLICS_2024 * 0.01
    cout_eqtp = REMUNERATION_AGENTS_PUBLICS_2024 * 1e9 / VOLUME_TRAVAIL_EQTP_2024
    titulaires_civils = FONCTIONNAIRES_Y_C_MILITAIRES_2024 - MILITAIRES_APPROX
    conversion = tuple(
        titulaires_civils * CONVERSION_ADHESION[i] * cout_eqtp * CONVERSION_PRIME_MOIS / 12 / 1e9
        for i in range(3))                                              # (haut cout, central, bas cout)
    return {"ecart_taux_points": taux_ecart, "un_pour_cent_masse": un_pour_cent_masse,
            "cout_eqtp": cout_eqtp, "titulaires_civils": titulaires_civils,
            "conversion_cout_unique": conversion,
            "contrib_hors_cotisation_reelle": CAS_CONTRIB_EMPLOYEUR_2025 - 11.0}


def cas_types():
    """Cas types de perdants (EUR), sous les hypotheses ci-dessus."""
    pension_an = PENSION_MOYENNE_SPECIAUX_MOIS * 12
    return {
        "agent_regime_special_depart_retarde_4_ans": {"pension_brute_an": pension_an,
            "pensions_non_percues_sans_compensation": 4 * pension_an},
        "intermittent_type": {"allocation_mois": UNEDIC_INTERMITTENTS["allocation_moyenne_an"] / 12,
            "socle": MODELE_SOCLE_MENSUEL, "perte_mois_modele": GP_INTERMITTENT_PERTE_MOIS},
        "micro_revenu_moyen": {"revenu_mois": MICRO_REVENU_MOYEN_2024 / 12,
            "socle": MODELE_SOCLE_MENSUEL},
    }


def synthese():
    """Effet non compte a ajouter au bilan global, par proposition (bas, central, haut), croisiere (~ 35 ans)."""
    a = regimes_speciaux_alignement()
    b = categories_actives()
    i = intermittence()["compensation_culture"]
    r = caisses()["reserve"]
    m = (0.0, 0.0, 0.0)                    # micro : deja compte en agregat ; a ne pas ajouter
    s = (0.0, 0.0, 0.0)                    # statut : effet nul par construction
    totaux = tuple(a[k] + b[k] + i[k] + r[k] + m[k] + s[k] for k in range(3))
    return {"P-043a": a, "P-043b": b, "P-044": i, "P-046": r, "P-045": m, "P-042": s, "total": totaux}


def profil_temporel(plein, debut=10, fin=35):
    """Montee lineaire entre `debut` et `fin` annees (clause du grand-pere) ; retourne {annee: valeur}."""
    out = {}
    for t in (1, 10, 20, 35):
        if t <= debut:
            out[t] = 0.0
        else:
            out[t] = plein * min(1.0, (t - debut) / (fin - debut))
    return out


# ======================================================================= tests (assert)
def _tests():
    # les trois programmes de la mission RSR : ~ 5,98 Md EUR, comparable aux 6,1 du depot (depenses_inventaire)
    assert abs(mission_rsr() - 5.984) < 0.01
    assert P198_SNCF + P198_RATP + P198_AUTRES == P198_TRANSPORTS
    # ratios demographiques cotisants / pensionnes (PAP 2026 : SNCF ~ 0,57 pondere des reversions, RATP 0,85)
    assert abs(ratio_demographique(COTISANTS["SNCF"], PENSIONNES["SNCF"]) - 0.483) < 0.01   # hors reversion
    assert abs(ratio_demographique(COTISANTS["RATP"], PENSIONNES["RATP"]) - 0.866) < 0.01
    # l'alignement des regimes speciaux : monotone bas < central < haut, ordre de grandeur 0,2 a 1,5 Md EUR
    a = regimes_speciaux_alignement()
    assert a[0] < a[1] < a[2] and 0.1 < a[0] and a[2] < 2.0
    # categories actives : 1,0 / 2,0 / 3,2
    b = categories_actives()
    assert [round(x, 2) for x in b] == [1.0, 2.0, 3.2]
    # intermittence : deficit = 1,89 - 0,472 ; ratio de l'Unedic coherent (1,89 / 0,472 ~ 4,0)
    it = intermittence()
    assert abs(it["deficit"] - 1.418) < 0.001
    assert abs(UNEDIC_INTERMITTENTS["allocations"] / UNEDIC_INTERMITTENTS["contributions"] - 4.01) < 0.02
    assert abs(UNEDIC_INTERMITTENTS["annexe8"] + UNEDIC_INTERMITTENTS["annexe10"] - 1.95) < 0.01   # arrondis de la page
    assert abs(UNEDIC_INTERMITTENTS["allocation_moyenne_an"] / 12 - 1117.5) < 0.1
    # le socle des indemnises (126 500 x 12 x 1 000) absorbe 80 % des allocations supprimees
    assert abs(it["socle_indemnises"] - 1.518) < 0.001
    assert 0.2 < it["gain_brut_apres_socle"] < 0.5
    assert abs(it["part_dans_chomage_modele"] - 0.0509) < 0.001
    # compensation culturelle : bas (cout le plus lourd) < central < haut = 0
    c = it["compensation_culture"]
    assert c[0] < c[1] < c[2] == 0.0 and abs(c[0] + 0.945) < 0.001
    # les pertes des menages, bornes de l'economie nette, encadrent le gain brut apres socle (ordre de grandeur)
    assert it["perte_menages_bornes"][0] < it["perte_menages_bornes"][2]
    # micro : taux effectif rapporte au revenu apres abattement ~ 37 a 42 % : le taux unique de 42 % ne change presque rien
    mi = micro()
    for k, v in mi["taux_effectifs"].items():
        assert 0.36 < v < 0.43, (k, v)
    assert abs(mi["revenu_total"] - 15.74) < 0.01
    assert abs(mi["ecart_a_revenu_constant"]) < 1.0
    bas, ce, ha = mi["scenarios"]
    assert bas < ce < ha
    # caisses : Agirc-Arrco 1,7 % des allocations ; SNCF 0,5 % ; la reserve non comptee reste sous 0,5 Md EUR
    ca = caisses()
    assert abs(ca["ratio_aa"] - 0.01709) < 0.0002 and abs(ca["ratio_sncf"] - 0.00527) < 0.0002
    assert ca["reserve"][0] < ca["reserve"][1] < ca["reserve"][2] < 0.5
    # ce que la v5.3 compte deja pour L1c = base x coefficient (au centime pres)
    for i in range(3):
        assert abs(L1C_BASE[i] * L1C_COEF[i] - L1C_ECONOMIE[i]) < 0.01
    # statut unique : 1 % de la masse salariale = 3,63 Md EUR ; cout employeur moyen ~ 62,8 k EUR par EQTP
    su = statut_unique()
    assert abs(su["un_pour_cent_masse"] - 3.63) < 0.001
    assert abs(su["cout_eqtp"] - 62_780) < 100
    assert abs(su["ecart_taux_points"] - 61.70) < 0.01
    assert su["conversion_cout_unique"][0] > su["conversion_cout_unique"][1] > su["conversion_cout_unique"][2] > 0
    # synthese : total = somme, monotone bas < central < haut
    sy = synthese()
    assert sy["total"][0] < sy["total"][1] < sy["total"][2]
    for k in range(3):
        assert abs(sy["total"][k] - (sy["P-043a"][k] + sy["P-043b"][k] + sy["P-044"][k] + sy["P-046"][k])) < 1e-9
    # profil : rien pendant 10 ans, plein effet a 35 ans
    p = profil_temporel(2.0)
    assert p[1] == 0.0 and p[10] == 0.0 and p[35] == 2.0 and 0 < p[20] < 2.0
    # les effectifs : titulaires + contractuels + autres < agents publics
    assert FONCTIONNAIRES_Y_C_MILITAIRES_2024 + CONTRACTUELS_2024 < AGENTS_PUBLICS_2024
    # coherence CAS : 78,28 % - 16,58 % = ecart de ~ 61,7 points ; contributions 2025 > 11 Md EUR de cotisation recalculee
    assert CAS_CONTRIB_EMPLOYEUR_2025 > 11.0
    return True


def _fmt(t, nd=2):
    return " / ".join(f"{x:+.{nd}f}" for x in t)


def main():
    _tests()
    print("Tests : OK\n")
    print(f"P-043  mission RSR PLF 2026 (subventions d'equilibre) : {mission_rsr():.2f} Md EUR "
          f"(SNCF {P198_SNCF/1e9:.2f} ; RATP {P198_RATP/1e9:.2f} ; marins {P197_MARINS/1e9:.2f} ; mines et divers {P195_MINES_DIVERS/1e9:.2f}) "
          f"+ IEG par la CTA (≈ {IEG_CTA_2017} en 2017, ancien)")
    print(f"       actifs des regimes subventionnes : {sum(COTISANTS.values()):,} ; departs/an ≈ {sum(COTISANTS.values())/CARRIERE_ANS:,.0f}")
    print(f"       (a) alignement des actifs en place : bas / central / haut = {_fmt(regimes_speciaux_alignement())} Md EUR (pleine charge)")
    print(f"       (b) categories actives de la fonction publique : {_fmt(categories_actives())} Md EUR")
    it = intermittence()
    print(f"P-044  allocations {it['allocations']:.2f} ; deficit calcule {it['deficit']:.2f} ; socle des indemnises {it['socle_indemnises']:.2f} ; "
          f"gain brut apres socle {it['gain_brut_apres_socle']:.2f} ; part du poste chomage du modele {it['part_dans_chomage_modele']*100:.1f} %")
    print(f"       pertes des menages (bornes) {_fmt(it['perte_menages_bornes'])} Md EUR ; compensation culture non comptee {_fmt(it['compensation_culture'])}")
    mi = micro()
    print("P-045  taux effectif de cotisation / revenu apres abattement : "
          + " ; ".join(f"{k} {v*100:.1f} %" for k, v in mi["taux_effectifs"].items()))
    print(f"       revenu total declare {mi['revenu_total']:.2f} ; cotisations actuelles ≈ {mi['cotisations_actuelles']:.2f} ; au taux unique {mi['au_taux_unique']:.2f} ; "
          f"ecart a revenu constant {mi['ecart_a_revenu_constant']:+.2f} ; scenarios {_fmt(mi['scenarios'])} (NE PAS AJOUTER : deja en agregat)")
    ca = caisses()
    print(f"P-046  Agirc-Arrco gestion + fonds social {AA_GESTION_ET_FONDS_SOCIAL} = {ca['ratio_aa']*100:.2f} % des allocations ; SNCF {ca['ratio_sncf']*100:.2f} % ; "
          f"deja compte (L1c) {_fmt(ca['deja_compte'])} ; reserve non comptee (versement des pensions) {_fmt(ca['reserve'])}")
    su = statut_unique()
    print(f"P-042  taux employeur CAS 2025 {TAUX_EMPLOYEUR[2025]} % vs prive {TAUX_PRIVE_REFERENCE} % ; 1 % de la masse salariale publique = {su['un_pour_cent_masse']:.2f} Md EUR ; "
          f"cout employeur moyen {su['cout_eqtp']:,.0f} EUR / EQTP ; conversion volontaire payee (cout unique, sans economie) {_fmt(su['conversion_cout_unique'], 1)} Md EUR")
    sy = synthese()
    print("\nSynthese (effet NON compte, bas / central / haut, Md EUR / an, croisiere) :")
    for k, v in sy.items():
        print(f"  {k:7s} {_fmt(v)}")
    print("\nProfil temporel de P-043 (central, clause du grand-pere) :")
    plein = sy["P-043a"][1] + sy["P-043b"][1]
    for t, v in profil_temporel(plein).items():
        print(f"  annee {t:>2} : {v:+.2f} Md EUR")


if __name__ == "__main__":
    main()
