#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ordres de grandeur pour le dossier « coût d'une sortie de l'UE » (sources/recherche-cout-sortie-ue.md).
Fonctions pures, hypothèses numérotées. Des ordres de grandeur, jamais des prédictions."""

# --- Données sourcées (voir le chapitre pour les liens) ---
DETTE_MAASTRICHT_2025_MD = 3460.5   # Md€, Insee/OFGL, fin 2025
DETTE_RATIO_2025 = 1.157            # 115,7 % du PIB (Insee Première 2106, mai 2026)
PSR_UE_2026_MD = 28.8               # Md€, PLF 2026, art. 45 (Sénat)
SOLDE_NET_MD = 7.9                  # Md€, 2024, méthode comptable (jaune PLF 2026 via Sénat), V4171 ; −9,3 Md€ en 2023. Remplace l'ancien 9,5 de presse (décision de l'auteur, 03/11/2026, Q6)
SOLDE_NET_COMMISSION_MD = 5.0       # Md€, 2024, méthode de la Commission (même source)
PART_NON_RESIDENTS = 0.56           # part de la dette négociable de l'État (AFT, fin 2025)
# Rapport Institut Montaigne, mars 2017, « L'Europe dont nous avons besoin », p. 31-32 (relu le 03/11/2026, V4176) :
# dépréciation d'environ 15 % (hors crise de financement), facture supplémentaire d'environ 50 Md€/an pour
# ménages et entreprises, charge de dette de l'État d'environ 30 Md€/an en plus, destruction de valeur
# d'environ 9 points de PIB à terme. Les 2,3 % de la première année, les fourchettes 0,6-3,2 % et 4-13 %
# et les 500 000 emplois ne figurent PAS dans ce rapport (chiffres de presse, non confirmés).
MONTAIGNE_RAPPORT = {"depreciation": 0.15, "facture_menages_entreprises_md": 50.0,
                     "charge_dette_etat_md": 30.0, "lt_pib": 0.09}
OBR_PIB_LT = 0.04
BLOOM_2025 = (0.06, 0.08)
UKICE_PIB = (0.02, 0.06)

def pib_france_md():
    """PIB 2025 déduit : dette / ratio."""
    return DETTE_MAASTRICHT_2025_MD / DETTE_RATIO_2025

def part_pib(montant_md):
    return montant_md / pib_france_md()

def cout_pib(pct, pib_md=None):
    return pct * (pib_md or pib_france_md())

def surcout_interets(dette_md, ecart_pb, duree_moy_ans):
    """Surcoût annuel d'intérêts (Md€) quand un écart de taux (points de base) s'applique
    à la part de dette refinancée. Année 1 : dette/duree ; régime établi : toute la dette.
    Hypothèse : durée de vie moyenne constante, refinancement linéaire."""
    an1 = dette_md / duree_moy_ans * ecart_pb / 1e4
    plein = dette_md * ecart_pb / 1e4
    return an1, plein

def decote_redenomination(dette_md, part_visee, decote):
    """Perte pour les créanciers (Md€) si une part de la dette est relibellée avec une décote de change."""
    return dette_md * part_visee * decote

if __name__ == "__main__":
    pib = pib_france_md()
    print(f"PIB France 2025 déduit : {pib:.0f} Md€ (dette {DETTE_MAASTRICHT_2025_MD} / {DETTE_RATIO_2025})")
    print(f"PSR-UE 2026 : {PSR_UE_2026_MD} Md€ = {100*part_pib(PSR_UE_2026_MD):.2f} % du PIB")
    print(f"Solde net 2024 : {SOLDE_NET_MD} Md€ (méthode comptable) = {100*part_pib(SOLDE_NET_MD):.2f} % du PIB ; {SOLDE_NET_COMMISSION_MD} Md€ (méthode de la Commission) = {100*part_pib(SOLDE_NET_COMMISSION_MD):.2f} %")
    print(f"Sortie de l'UE : économie brute max {PSR_UE_2026_MD} Md€/an, nette ~{SOLDE_NET_MD} Md€/an, avant de remplacer les dépenses (PAC, cohésion, recherche)")
    m = MONTAIGNE_RAPPORT
    print("\nInstitut Montaigne (rapport de mars 2017, p. 31-32), tel que publié :")
    print(f"  dépréciation ~{100*m['depreciation']:.0f} % ; facture supplémentaire ~{m['facture_menages_entreprises_md']:.0f} Md€/an ; charge de dette ~{m['charge_dette_etat_md']:.0f} Md€/an")
    print(f"  destruction de valeur ~{100*m['lt_pib']:.0f} points de PIB à terme, soit {cout_pib(m['lt_pib']):.0f} Md€ appliqués au PIB 2025 (transposition indicative)")
    print("  (les chiffres '2,3 % la première année' et '500 000 emplois' sont de la presse, absents du rapport : non utilisés)")
    print("\nBrexit (UK) en % du PIB : OBR 4 % ; UKICE 2-6 % ; Bloom et al. 6-8 %")
    print("Même pourcentages appliqués au PIB français (analogie seulement, ⚠️ non transposable) :")
    for nom, v in [("OBR 4 %", .04), ("UKICE 2 %", .02), ("UKICE 6 %", .06), ("Bloom 6 %", .06), ("Bloom 8 %", .08)]:
        print(f"  {nom:10s} {cout_pib(v):6.0f} Md€")
    print("\nSurcoût d'intérêts (dette Maastricht, durée moyenne 8 ans [hypothèse ⚠️]) :")
    for pb in (50, 100, 200, 300):
        a, p = surcout_interets(DETTE_MAASTRICHT_2025_MD, pb, 8)
        print(f"  +{pb:3d} pb : année 1 {a:5.1f} Md€ ; régime plein {p:5.1f} Md€/an ({100*part_pib(p):.2f} % du PIB)")
    print("\nCréanciers non résidents (56 % de la dette négociable ; ici appliqué à toute la dette = borne haute) :")
    nr = DETTE_MAASTRICHT_2025_MD * PART_NON_RESIDENTS
    print(f"  stock détenu ~{nr:.0f} Md€")
    for d in (0.10, 0.20, 0.30):
        print(f"  relibellisation avec décote {int(d*100)} % de 97 % de la dette : perte {decote_redenomination(DETTE_MAASTRICHT_2025_MD,0.97,d):.0f} Md€ (dont non-résidents ~{decote_redenomination(nr,0.97,d):.0f} Md€)")
