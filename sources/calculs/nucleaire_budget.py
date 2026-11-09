# -*- coding: utf-8 -*-
"""Poids budgétaire du programme nucléaire (T-énergie, 06/11/2026). Fonctions pures + tests assert.
Hypothèses numérotées dans sources/nucleaire-ou-alternatives.md § 2. Ordres de grandeur, pas des prédictions."""

# Données lues (cote A/B) : voir le CSV sources/nucleaire-ou-alternatives.csv
DEP_PUB_2024 = 1671.8      # Md€, COFOG total, Eurostat (gov_10a_exp), consolidé APU
PIB_2024 = 2917.6          # Md€, déduit : dépenses / (% du PIB) du même jeu Eurostat
VIEILLESSE_2024 = 392.0    # Md€ GF1002
SANTE_2024 = 261.2         # Md€ GF07
DETTE_2024 = 58.9          # Md€ GF0107 transactions de la dette publique
EPR2_OVERNIGHT_2020 = {"bas": 67.4, "central": 72.8, "haut": 72.8 * 1.4}  # Md€2020, hors financement
PUISSANCE_EPR2_GW = 6 * 1.65
INFLATION_2020_2024 = 1.13  # hypothèse H1 (déflateur ≈ +13 %), à vérifier

def annuel_overnight(total_2020, duree_ans, infl=INFLATION_2020_2024):
    """Md€ 2024 par an, hors financement, dépense lissée sur duree_ans."""
    return total_2020 * infl / duree_ans

def avec_financement(total, taux, duree_moy_ans):
    """Intérêts intercalaires (composés) sur la durée moyenne entre dépense et mise en service."""
    return total * ((1 + taux) ** duree_moy_ans)

def lcoe(capex_kw, taux, duree_vie, idc_ans, fixe_kw_an, var_mwh, cf):
    """€/MWh. capex_kw en €/kW overnight ; IDC composé ; amortissement en annuité constante."""
    cap = capex_kw * (1 + taux) ** idc_ans
    crf = taux / (1 - (1 + taux) ** -duree_vie)
    mwh_kw = 8.76 * cf
    return (cap * crf + fixe_kw_an) / mwh_kw + var_mwh

def subvention_cfd(prix_garanti, prix_marche, twh):
    """Md€/an si le CfD est au plafond et le marché plus bas (prix en €/MWh, énergie en TWh)."""
    return max(prix_garanti - prix_marche, 0) * twh / 1000

if __name__ == "__main__":
    # tests
    assert abs(annuel_overnight(72.8, 16) - 5.14) < 0.01
    assert abs(avec_financement(100, 0.04, 7) / 100 - 1.316) < 0.001
    l4 = lcoe(72.8e9 / (PUISSANCE_EPR2_GW * 1e6) , 0.04, 60, 7, 100, 15, 0.85)
    l7 = lcoe(72.8e9 / (PUISSANCE_EPR2_GW * 1e6) , 0.07, 60, 7, 100, 15, 0.85)
    assert 80 < l4 < 105 and 120 < l7 < 160, (l4, l7)

    capex_kw = 72.8e9 / (PUISSANCE_EPR2_GW * 1e6)
    print(f"capex overnight EPR2 : {capex_kw:.0f} EUR2020/kW")
    for nom, tot in EPR2_OVERNIGHT_2020.items():
        for duree in (16,):
            a = annuel_overnight(tot, duree)
            print(f"{nom}: total {tot:.1f} Md€2020 -> {a:.1f} Md€2024/an sur {duree} ans ; "
                  f"{a/DEP_PUB_2024*100:.2f} % dépenses publiques ; {a/PIB_2024*100:.3f} % PIB ; "
                  f"pointe x1,5 = {1.5*a:.1f} Md€/an ; avec financement 4 %/7 ans : total {avec_financement(tot*INFLATION_2020_2024,0.04,7):.0f} Md€2024")
    print(f"LCOE EPR2 central : 4 % -> {l4:.0f} ; 7 % -> {l7:.0f} EUR/MWh (hyp.: CF 85 %, 60 ans, IDC 7 ans, fixe 100 EUR/kW/an, variable 15 EUR/MWh)")
    twh = PUISSANCE_EPR2_GW * 8.76 * 0.85
    print(f"production EPR2 : {twh:.0f} TWh/an ; subvention CfD si marché 65 : {subvention_cfd(100,65,twh):.1f} Md€/an ; si 50 : {subvention_cfd(100,50,twh):.1f}")
    for nom, ref in (("retraites",VIEILLESSE_2024),("santé",SANTE_2024),("dette",DETTE_2024)):
        print(f"EPR2 central ({annuel_overnight(72.8,16):.1f}) / {nom} {ref} = {annuel_overnight(72.8,16)/ref*100:.1f} %")
    parc = 100.8/22  # grand carénage 2014-2035, Md€ (courants/constants non précisés) par an
    print(f"grand carénage : {parc:.1f} Md€/an ; EPR2 + carénage + SMR 0,35 = {annuel_overnight(72.8,16)+parc+0.35:.1f} Md€/an = {(annuel_overnight(72.8,16)+parc+0.35)/DEP_PUB_2024*100:.2f} % des dépenses, {(annuel_overnight(72.8,16)+parc+0.35)/PIB_2024*100:.2f} % du PIB")
