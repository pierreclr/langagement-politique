#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ordres de grandeur pour sources/recherche-immigration-chiffres.md.

Fonctions pures, entrees sourcees (voir la note), hypotheses explicites H1..H5.
Ce ne sont pas des predictions : des ordres de grandeur conditionnels.
Usage : python3 sources/calculs/immigration.py
"""

# --- Entrees sourcees (faits) -------------------------------------------------
OQTF_UE_2025 = 486_705          # Eurostat migr_eiord, ordres de quitter, UE-27, 2025
OQTF_FR_2025 = 137_550          # idem France
RENVOYES_FR_2025 = 18_930       # Eurostat migr_eirtn, pays tiers, France
FORCES_DGEF_2025 = 14_133       # DGEF, depliant juillet 2026 (provisoire)
ELOIGN_DGEF_2025 = 23_549       # idem (A+B+C)
MESURES_2025 = 156_058          # idem, mesures prononcees
COUT_ELOIGN_FORCE = 4_414       # EUR, moyenne, Cour des comptes (janv. 2024)
COUT_POLITIQUE_CDC = 1.8e9      # EUR/an, Cour des comptes 2024
COUT_POLITIQUE_RODWELL = 2.1e9  # EUR/an, rapport Rodwell 2026
AME_DEPENSES_2025 = 1.34e9      # EUR
AME_BENEF = 458_681             # fin septembre 2025, Rapport au Parlement 2025
EMPLOI_NATIFS = 77.2            # % 20-64 ans, Eurostat 2025
EMPLOI_HORS_UE = 63.1
EMPLOI_UE27_HORS_UE = 68.6
RETRAITE_PIB_PAR_80K = 1.1      # points de PIB en 2070, COR 2026 (+/-80 000 migrants/an)
SOLDE_BAS, SOLDE_CENTRAL, SOLDE_HAUT = 70_000, 150_000, 230_000  # Insee 2026
POP20_64_2050 = {"reference": 36.4, "migration_nulle": 34.7}     # M, Eurostat EUROPOP2023
POP20_64_2070 = {"reference": 35.4, "migration_nulle": 33.0}
OCDE_FR_BORNES_PIB_PCT = (-0.53, 1.02)   # % du PIB, reprises de presse (a verifier)
CEPII_BORNES_PIB_PCT = (-0.5, 0.5)       # % du PIB, Chojnicki et al.
OID_MD = (35.0, 40.0)                    # Md EUR/an, estimation contestee

# --- Hypotheses (non sourcees, a faire varier) --------------------------------
PIB_MD = 2_935.2                 # H1 : PIB France 2024 = 2 935,2 Md EUR courants (Eurostat nama_10_gdp B1GQ CP_MEUR, consulte le 03/11/2026 ; Insee, comptes nationaux)
POP_HORS_UE_20_64 = 4.5e6        # H2 : nes hors UE, 20-64 ans (hypothese, a verifier)
GAIN_NET_PAR_EMPLOI = {"bas": 5_000, "central": 10_000, "haut": 15_000}  # H3 : EUR/an net par emploi supplementaire
PART_ECART_COMBLE = {"bas": 0.25, "central": 0.5, "haut": 1.0}           # H4 : part de l'ecart d'emploi comblee
TAUX_EXEC_CIBLE = (0.25, 0.50)   # H5 : taux d'execution vise des ordres de quitter


def pct(a, b):
    return 100.0 * a / b


def eloignements():
    out = {
        "part_FR_ordres_UE_pct": pct(OQTF_FR_2025, OQTF_UE_2025),
        "ratio_renvoyes_ordonnes_pct": pct(RENVOYES_FR_2025, OQTF_FR_2025),
        "forces_sur_mesures_pct": pct(FORCES_DGEF_2025, MESURES_2025),
        "eloignements_sur_mesures_pct": pct(ELOIGN_DGEF_2025, MESURES_2025),
    }
    for t in TAUX_EXEC_CIBLE:
        cible = t * MESURES_2025
        extra = max(0.0, cible - ELOIGN_DGEF_2025)
        out[f"cible_{int(t*100)}pct"] = {
            "eloignements_requis": round(cible),
            "supplementaires": round(extra),
            "cout_marginal_Md_si_cout_constant": round(extra * COUT_ELOIGN_FORCE / 1e9, 2),
            "note": "borne basse : les cas faciles sont deja faits, le cout unitaire monte (laissez-passer consulaires, retention)",
        }
    return out


def ame():
    return {"cout_par_beneficiaire_EUR": round(AME_DEPENSES_2025 / AME_BENEF)}


def emploi():
    ecart_natifs = EMPLOI_NATIFS - EMPLOI_HORS_UE
    ecart_ue = EMPLOI_UE27_HORS_UE - EMPLOI_HORS_UE
    res = {"ecart_vs_natifs_pts": round(ecart_natifs, 1), "ecart_vs_moyenne_UE_pts": round(ecart_ue, 1)}
    for k in ("bas", "central", "haut"):
        emplois = POP_HORS_UE_20_64 * ecart_natifs / 100 * PART_ECART_COMBLE[k]
        gain = emplois * GAIN_NET_PAR_EMPLOI[k] / 1e9
        res[k] = {"emplois_supplementaires": round(emplois), "gain_net_Md_EUR": round(gain, 1),
                  "gain_pct_PIB": round(gain / PIB_MD * 100, 2)}
    return res


def fourchette_budgetaire():
    def md(p):
        return round(p / 100 * PIB_MD, 1)
    return {
        "CEPII_Md": (md(CEPII_BORNES_PIB_PCT[0]), md(CEPII_BORNES_PIB_PCT[1])),
        "OCDE_FR_Md": (md(OCDE_FR_BORNES_PIB_PCT[0]), md(OCDE_FR_BORNES_PIB_PCT[1])),
        "OID_Md": (-OID_MD[1], -OID_MD[0]),
        "OID_pct_PIB_implicite": (round(-OID_MD[0] / PIB_MD * 100, 2), round(-OID_MD[1] / PIB_MD * 100, 2)),
        "amplitude_totale_Md": round(md(OCDE_FR_BORNES_PIB_PCT[1]) + OID_MD[1], 1),
    }


def demographie():
    d50 = POP20_64_2050["reference"] - POP20_64_2050["migration_nulle"]
    d70 = POP20_64_2070["reference"] - POP20_64_2070["migration_nulle"]
    return {
        "actifs_en_moins_2050_M": round(d50, 1),
        "actifs_en_moins_2070_M": round(d70, 1),
        "retraites_pts_PIB_pour_80k": RETRAITE_PIB_PAR_80K,
        "retraites_Md_pour_80k_aujourd_hui_PIB": round(RETRAITE_PIB_PAR_80K / 100 * PIB_MD, 1),
        "retraites_Md_par_tranche_de_10k_migrants": round(RETRAITE_PIB_PAR_80K / 8 / 100 * PIB_MD, 1),
        "note": "effet en 2070, au PIB actuel (illustration) ; suppose le taux d'emploi moyen pour les migrants supplementaires",
    }


def main():
    import json
    for nom, f in [("eloignements", eloignements), ("ame", ame), ("emploi", emploi),
                   ("fourchette_budgetaire", fourchette_budgetaire), ("demographie", demographie)]:
        print(f"== {nom}")
        print(json.dumps(f(), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
