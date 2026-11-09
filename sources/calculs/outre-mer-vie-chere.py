# -*- coding: utf-8 -*-
"""Ordres de grandeur des coûts annuels pour l'État (outre-mer, vie chère).

Reproduit les chiffres de sources/outre-mer-vie-chere.md. Unités : millions d'euros (M€).
Lancer : python3 -I sources/calculs/outre-mer-vie-chere.py
Les hypothèses marquées HYP ne sont pas des données publiées (voir le texte).
"""

# --- Données publiées -------------------------------------------------------
# Insee Première n° 1958 (juillet 2023), année 2022, indices de Fisher, en %
ECART_ALIM = {"Guadeloupe": 41.8, "Martinique": 40.2, "Guyane": 39.4, "La Réunion": 36.7, "Mayotte": 30.2}
# Insee Première n° 1958 : part de l'alimentation dans le budget des ménages (15 %, Mayotte plus)
PART_ALIM = 0.15
# IEDOM, Rapport annuel 2024 (La Réunion) : consommation des ménages 2022e, M€
CONSO_REUNION_2022 = 13000
# Insee Analyses Martinique n° 79 (sept. 2025) : consommation des ménages 2024, M€
CONSO_MARTINIQUE_2024 = 6141
# IEDOM / Insee : La Réunion 2024, importations de biens non durables (M€) et durables (M€)
IMP_NONDUR_REUNION_2024 = 2253
IMP_DUR_REUNION_2024 = 386
# Insee Analyses Martinique n° 79 : importations totales de biens et services 2024, M€
IMP_TOT_MARTINIQUE_2024 = 3484
# Cour des comptes (mars 2024), recette nette 2022, M€
OM_NET_2022 = 1644
OM_REGIONAL_2022 = 410.7
# Cour des comptes : croissance moyenne annuelle 2014-2022 de la recette
OM_CROISSANCE = 0.0465
# AdC avis 19-A-12 (2019) §306 : fret = environ 50 % des coûts de transport maritime ;
# AdC 2019 : coûts de transport = 7,2 % du coût d'achat (2018, moyenne) ;
# AdC avis 26-A-01 (févr. 2026) : transport maritime = 10,9 % du coût d'achat (Martinique, 2024)
PART_FRET_BAS = 0.5 * 0.072   # 3,6 %
PART_FRET_CENTRAL = 0.52 * 0.109  # 5,7 %
PART_FRET_HAUT = 0.109        # 10,9 %

# --- Hypothèses (HYP) -------------------------------------------------------
# Population approx. (HYP, à vérifier Insee RP 2022) et consommation par habitant (HYP)
POP = {"Guadeloupe": 376_000, "Martinique": 350_000, "Guyane": 290_000,
       "La Réunion": 865_000, "Mayotte": 321_000}
CONSO_HAB_HYP = {"Guadeloupe": 16_000, "Guyane": 16_000, "Mayotte": 8_000}  # euros par habitant
# Contrôles par habitant (euros) : Martinique 2024 et La Réunion 2022e
CONSO_HAB_MARTINIQUE = CONSO_MARTINIQUE_2024 * 1e6 / POP["Martinique"]
CONSO_HAB_REUNION = CONSO_REUNION_2022 * 1e6 / POP["La Réunion"]


def consommation_menages():
    """M€ par territoire (sourcé pour La Réunion 2022 et la Martinique 2024, HYP ailleurs)."""
    c = {"La Réunion": CONSO_REUNION_2022, "Martinique": CONSO_MARTINIQUE_2024}
    for t in ("Guadeloupe", "Guyane", "Mayotte"):
        c[t] = POP[t] * CONSO_HAB_HYP[t] / 1e6  # habitants x euros -> M€
    return c


def scenarios():
    conso = consommation_menages()
    total_conso = sum(conso.values())
    # Ratio importations de biens non durables / consommation des ménages (La Réunion)
    ratio_import = IMP_NONDUR_REUNION_2024 / CONSO_REUNION_2022
    # Contrôle : même ratio appliqué à la Martinique, comparé à la part publiée des non durables
    controle_mq_ratio = ratio_import * CONSO_MARTINIQUE_2024
    controle_mq_part = IMP_TOT_MARTINIQUE_2024 * IMP_NONDUR_REUNION_2024 / 7137
    base_imports = ratio_import * total_conso

    out = {}
    out["total_conso_M"] = total_conso
    out["base_imports_nondur_M"] = base_imports
    out["controle_MQ_ratio_M"] = controle_mq_ratio
    out["controle_MQ_part_M"] = controle_mq_part

    # (a) fret maritime des biens de consommation courante
    out["a_bas"] = PART_FRET_BAS * base_imports
    out["a_central"] = PART_FRET_CENTRAL * base_imports
    out["a_haut"] = PART_FRET_HAUT * base_imports

    # (b) suppression de l'octroi de mer, compensation des collectivités
    out["b_bas"] = OM_NET_2022 - OM_REGIONAL_2022
    out["b_central"] = OM_NET_2022
    out["b_haut"] = OM_NET_2022 * (1 + OM_CROISSANCE) ** 4  # extrapolation 2026

    # (c) ramener les prix alimentaires au niveau métropolitain
    food = {t: PART_ALIM * c for t, c in conso.items()}
    corr = {t: ECART_ALIM[t] / 100 / (1 + ECART_ALIM[t] / 100) for t in food}
    out["c_bas"] = sum(food[t] * ECART_ALIM["Mayotte"] / 100 / (1 + ECART_ALIM["Mayotte"] / 100) for t in food)
    out["c_central"] = sum(food[t] * corr[t] for t in food)
    out["c_haut"] = sum(food[t] * ECART_ALIM[t] / 100 for t in food)  # formule « écart x dépense »
    out["food_total_M"] = sum(food.values())
    out["c_central_reunion"] = food["La Réunion"] * corr["La Réunion"]
    out["c_haut_reunion"] = food["La Réunion"] * ECART_ALIM["La Réunion"] / 100
    out["c_central_martinique"] = food["Martinique"] * corr["Martinique"]
    out["c_haut_martinique"] = food["Martinique"] * ECART_ALIM["Martinique"] / 100
    out["a_bas_reunion"] = PART_FRET_BAS * IMP_NONDUR_REUNION_2024
    out["a_central_reunion"] = PART_FRET_CENTRAL * IMP_NONDUR_REUNION_2024
    out["a_haut_reunion"] = PART_FRET_HAUT * IMP_NONDUR_REUNION_2024
    return out


if __name__ == "__main__":
    s = scenarios()
    for k, v in s.items():
        print(f"{k:28s} {v:,.1f}")
