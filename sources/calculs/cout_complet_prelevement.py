# -*- coding: utf-8 -*-
"""Coût complet du système de prélèvement français (03/11/2026).
Sortie : tableau texte ; avec --ecrire, sources/calculs/cout_complet_prelevement_resultats.txt.
Aucune dépendance : fonctions pures, hypothèses numérotées (H1 à H14) en tête.
Bas / central / haut : ordres de grandeur, jamais des prédictions.
Usage : python3 -I cout_complet_prelevement.py [--ecrire]
Les valeurs « FAIT » viennent de sources lues (voir sources/cout-complet-prelevement.md) ;
les valeurs « HYP » sont des hypothèses de Claude à discuter. ⚠️ = non confirmé.
"""
import os, sys

SC = ("bas", "central", "haut")

# ---------- FAITS (Md€ sauf mention) ----------
PO_2024 = 1254.0            # prélèvements obligatoires 2024, Insee (repris de recherche-inventaire-impots.md)
PIB_2024 = 2935.0           # PIB 2024, Insee (repris de modeles/industrie-complexite/donnees/references_projet.csv)
P156_ACTIONS_FISC = 0.1374 + 1.6385 + 2.0571 + 0.0217   # CP PLF 2026 actions 01+02+03+10, PAP 2026
P156_SOUTIEN = 1.9480       # CP PLF 2026 action 09 Soutien
P156_TOTAL = 8.2299         # CP PLF 2026 programme 156
P156_T2_FISC = 0.1236 + 1.5156 + 1.9305 + 0.0216         # titre 2 des actions fiscales (Md€)
P156_T2 = 6.9641            # titre 2 du programme 156
P156_ETPT = 92115           # ETPT PLF 2026 programme 156
P302_CP = 1.8209            # CP PLF 2026 programme 302 (DGDDI)
P302_ETPT = 16475
P302_ACTION5 = 0.1339       # action 05 fiscalité douanière, énergétique et environnementale
DGFIP_COUT_OCDE_2022 = 3.483  # OCDE TAS 2024, exercice 2022, dépenses de fonctionnement
URSSAF_NET = 1.5706         # charges nettes de gestion, branche recouvrement 2025 (REPSS Fi.2.12)
URSSAF_BRUT = 1.849         # charges de gestion courante brutes 2025
URSSAF_ETP = 15000          # ⚠️ ordre de grandeur (ENSS, non daté)
# base chiffre d'affaires : Insee Analyses n° 101 (05/12/2024), Ésane 2022, 4 911 600 entreprises marchandes non agricoles non financières : 5 012,5 Md€ ; MIC 13,0 % + PME 21,3 % = 34,3 %. Vérifié V5914 le 03/11/2026
CA_ENF_2022 = 5012.5
PART_MIC_PME = 0.343  # 13,0 % + 21,3 % (Insee Analyses n° 101)
# EC / VVA-KPMG 2022 (exercice 2019) : coût moyen UE 14 745 €, dont CIT 3 097 € et TVA 2 853 €
TETCC_UE, TETCC_CIT, TETCC_TVA = 14745.0, 3097.0, 2853.0
# Doing Business 2020 (données 2018, PME type, source arrêtée) : heures/an, paiements/an
HEURES = {"France": 139, "Estonie": 50, "Pays-Bas": 119, "Allemagne": 218}
HEURES_UE27_2018 = 170.37   # moyenne simple UE-27, EP IPOL(2023)642353 tableau 1
# OCDE TAS 2024 (exercice 2022) : coût pour 100 de recettes, part des recettes publiques collectée, cotisations incluses ?
OCDE = {"France": (0.56, 44.4, False), "Estonie": (0.19, 86.3, True),
        "Pays-Bas": (0.75, 76.5, True), "Allemagne": (1.26, 45.0, False)}
# T6 (modeles/industrie-complexite/resultats.md) : industrie de la complexité, au sens large
T6_TOTAL = (26.0, 41.0, 57.0)
T6_EMPLOIS = (270000, 437000, 603000)
T6_DISPARAIT_MD = (10.0, 24.5, 45.0)

# ---------- HYPOTHESES ----------
H1_DGFIP = (DGFIP_COUT_OCDE_2022, P156_ACTIONS_FISC + 0.5 * P156_SOUTIEN * P156_ACTIONS_FISC / (P156_TOTAL - P156_SOUTIEN),
            P156_ACTIONS_FISC + P156_SOUTIEN * P156_ACTIONS_FISC / (P156_TOTAL - P156_SOUTIEN))
# H1 : DGFiP part fiscale. bas = coût OCDE 2022 ; central = actions fiscales + la moitié du soutien au prorata ; haut = soutien entier au prorata.
H2_DGDDI_PART = (P302_ACTION5, 0.40, 0.35 * P302_CP)  # bas = action 05 seule ; central 0,40 (recoupé par l'indicateur 1,1) ; haut = 35 % du programme
H3_URSSAF = (URSSAF_NET, URSSAF_BRUT, URSSAF_BRUT)   # bas = net ; central/haut = brut (coûts facturés aux attributaires inclus)
H4_MSA = (0.06, 0.12, 0.23)          # HYP : recouvrement = 10/15/20 % de ~1,17 Md€ de budget de gestion 2023 (haut) ; bas = 0,3 % de 20 Md€
H5_AGIRC = (0.10, 0.25, 0.45)        # HYP ⚠️ : 0,1 à 0,45 Md€ sur ~98 Md€ ; risque de double compte avec l'Urssaf depuis le transfert
H6_CAISSES = (0.12, 0.20, 0.41)      # HYP : 41 Md€ collectés par les caisses autonomes x 0,3 / 0,5 / 1 %
H7_PETITS = (0.10, 0.20, 0.40)       # HYP : 10 Md€ collectés par ~58 organismes x 1 / 2 / 4 % (petites taxes coûteuses)
H8_COLLECT = (0.05, 0.10, 0.20)      # HYP : services fiscaux des collectivités (taxe de séjour, TLPE...), non publié

# Conformité entreprises : taux (% du CA) appliqués à MIC+PME ; grandes entreprises
H9_TAUX_PME = (1.0 * 139 / HEURES_UE27_2018, 1.5 * 139 / HEURES_UE27_2018, 2.0)  # % du CA ; 1-2 % UE, corrigé 139/170 pour bas et central
H10_TAUX_GE = (0.05, 0.10, 0.20)     # HYP : % du CA des grandes entreprises (ETI incluses)
H11_MENAGES = (0.5, 1.0, 2.0)        # repris de T6 (1/2/4 h par foyer)
# Part évitée du coût de conformité sous prélèvement unique : TVA conservée (le plan garde TVA et accises)
H12_EVITE = {"bas": {"is": 0.50, "tva": 0.00, "autres": 0.30},
             "central": {"is": 0.80, "tva": 0.10, "autres": 0.60},
             "haut": {"is": 0.95, "tva": 0.25, "autres": 0.85}}
# Gain public : écart de ratio de coût à PO. bas = niveau des Pays-Bas (0,75 > France : gain nul) ; haut = Estonie (0,19)
H13_PUBLIC_ECONOMIE = None  # calculé
# Emplois : ratio T6 central (437 000 emplois-équivalents pour 41 Md€)
H14_EMPLOIS_PAR_MD = 437000 / 41.0
RETRAITES = 0.026                    # 2,6 %/an (Métiers 2030, repris de T6 H10)
HORIZON = (15, 10, 5)                # ans, appariement de T6 (bas = lent)
COUT_RECONV = (29000, 10000, 5000)   # € par reconversion (T6 H12, bas/central/haut du coût)


def i(k):
    return SC.index(k)


def cout_public():
    lignes = []
    dgddi = H2_DGDDI_PART
    t = lambda *x: tuple(sum(v) for v in zip(*x))
    lignes.append(("DGFiP (part fiscale)", H1_DGFIP))
    lignes.append(("DGDDI (part fiscale)", dgddi))
    lignes.append(("Urssaf et réseau Acoss", H3_URSSAF))
    lignes.append(("MSA (recouvrement)", H4_MSA))
    lignes.append(("Agirc-Arrco (recouvrement) ⚠️", H5_AGIRC))
    lignes.append(("Caisses autonomes et régimes spéciaux ⚠️", H6_CAISSES))
    lignes.append(("~58 organismes qui collectent eux-mêmes ⚠️", H7_PETITS))
    lignes.append(("Collectivités (régie) ⚠️", H8_COLLECT))
    total = t(*[l[1] for l in lignes])
    return lignes, total


def cout_prive():
    base_pme = CA_ENF_2022 * PART_MIC_PME
    base_ge = CA_ENF_2022 * (1 - PART_MIC_PME)
    pme = tuple(base_pme * h / 100 for h in H9_TAUX_PME)
    ge = tuple(base_ge * h / 100 for h in H10_TAUX_GE)
    men = H11_MENAGES
    ent = tuple(a + b for a, b in zip(pme, ge))
    total = tuple(a + b for a, b in zip(ent, men))
    return {"pme": pme, "ge": ge, "entreprises": ent, "menages": men, "total": total}


def part_evitee(sc):
    h = H12_EVITE[sc]
    p_is = TETCC_CIT / TETCC_UE
    p_tva = TETCC_TVA / TETCC_UE
    p_aut = 1 - p_is - p_tva
    return p_is * h["is"] + p_tva * h["tva"] + p_aut * h["autres"]


def economie(pub_total, prive):
    res = {}
    ratio = [100 * pub_total[k] / PO_2024 for k in range(3)]
    # public : cible de ratio coût/PO ; bas = 0,75 (NL), central = milieu entre ratio actuel et 0,19, haut = 0,19 (EE)
    ratio_cible = (max(ratio[1], 0.75), (ratio[1] + 0.19) / 2, 0.19)
    ratio_actuel = ratio[1]
    pub_eco = tuple(max(0.0, (ratio_actuel - c) / ratio_actuel) * pub_total[1] for c in ratio_cible)
    pub_part = tuple(e / pub_total[1] for e in pub_eco)
    priv_eco = tuple(prive["total"][k] * part_evitee(SC[k]) for k in range(3))
    return {"pub_eco": pub_eco, "pub_part": pub_part, "priv_eco": priv_eco,
            "priv_part": tuple(part_evitee(s) for s in SC),
            "ratio_cible": ratio_cible}


def emplois(eco_prive, pub_part):
    # privé : ratio T6 ; public : ETPT fiscaux (programme 156 titre 2, 302 x 25 %, Urssaf ~15 000, autres ~3 000)
    etpt_fisc = P156_ETPT * P156_T2_FISC / P156_T2 + 0.25 * P302_ETPT + URSSAF_ETP + 3000
    out = []
    for k in range(3):
        priv = eco_prive[k] * H14_EMPLOIS_PAR_MD
        pub = etpt_fisc * pub_part[k]
        stock_priv = eco_prive[k] / part_evitee(SC[k]) * H14_EMPLOIS_PAR_MD
        ret_priv = RETRAITES * stock_priv * HORIZON[k]
        ret_pub = RETRAITES * etpt_fisc * HORIZON[k]
        reconv_priv = max(0.0, priv - ret_priv)
        reconv_pub = max(0.0, pub - ret_pub)
        reconv = reconv_priv + reconv_pub
        out.append({"priv": priv, "pub": pub, "reconv": reconv, "cout_reconv_md": reconv * COUT_RECONV[k] / 1e9,
                    "etpt_fisc": etpt_fisc})
    return out


def comparaison(prive_central_ratio, pub_ratio):
    """Indice illustratif : conformité de la France mise à l'échelle des heures Doing Business."""
    lignes = []
    for p, h in HEURES.items():
        cout, part, ssc = OCDE[p]
        indice = prive_central_ratio * h / HEURES["France"]
        lignes.append((p, cout, part, ssc, h, indice))
    return lignes


def main():
    out = []
    P = out.append
    lignes, tot = cout_public()
    P("A. COÛT PUBLIC DE COLLECTE (Md€/an, budgets 2023-2026)")
    P(f"{'Poste':46s}{'bas':>8s}{'central':>9s}{'haut':>8s}")
    for nom, v in lignes:
        P(f"{nom:46s}{v[0]:8.2f}{v[1]:9.2f}{v[2]:8.2f}")
    P(f"{'TOTAL public':46s}{tot[0]:8.2f}{tot[1]:9.2f}{tot[2]:8.2f}")
    P(f"{'en % des prélèvements obligatoires 2024':46s}" + "".join(f"{100*x/PO_2024:8.2f}%" if j else f"{100*x/PO_2024:7.2f}%" for j, x in enumerate(tot)))
    P("")
    pr = cout_prive()
    P("B. COÛT DE CONFORMITÉ (Md€/an)")
    P(f"Base CA entreprises marchandes non financières : {CA_ENF_2022:,.0f} Md€ ; MIC+PME : {CA_ENF_2022*PART_MIC_PME:,.0f} Md€ (Insee, vérifié)".replace(",", " "))
    P(f"Taux appliqués aux MIC+PME (% du CA) : " + " / ".join(f"{x:.2f}" for x in H9_TAUX_PME) + " ; grandes entreprises : " + " / ".join(f"{x:.2f}" for x in H10_TAUX_GE))
    for nom, k in (("Entreprises MIC+PME", "pme"), ("Grandes entreprises", "ge"), ("Entreprises (total)", "entreprises"), ("Ménages", "menages"), ("TOTAL conformité", "total")):
        v = pr[k]
        P(f"{nom:46s}{v[0]:8.1f}{v[1]:9.1f}{v[2]:8.1f}")
    P(f"{'en % des prélèvements obligatoires 2024':46s}" + "".join(f"{100*x/PO_2024:7.2f}%" for x in pr["total"]))
    P(f"Rappel T6 (industrie de la complexité, sens large) : {T6_TOTAL[0]:.0f} / {T6_TOTAL[1]:.0f} / {T6_TOTAL[2]:.0f} Md€")
    P("")
    P("C. TOTAL (public + conformité, Md€/an)")
    total = tuple(tot[k] + pr["total"][k] for k in range(3))
    P(f"{'Total':46s}{total[0]:8.1f}{total[1]:9.1f}{total[2]:8.1f}")
    P(f"{'en % des prélèvements obligatoires 2024':46s}" + "".join(f"{100*x/PO_2024:7.2f}%" for x in total))
    P(f"{'en % du PIB 2024':46s}" + "".join(f"{100*x/PIB_2024:7.2f}%" for x in total))
    P(f"Part du coût public dans le total (central) : {100*tot[1]/total[1]:.0f} %")
    P("")
    eco = economie(tot, pr)
    P("D. CE QUE LE PRÉLÈVEMENT UNIQUE POURRAIT ÉCONOMISER (Md€/an, régime de croisière)")
    P(f"Cible de ratio public (coût/PO, en %) : " + " / ".join(f"{x:.2f}" for x in eco["ratio_cible"]) + f" ; actuel central {100*tot[1]/PO_2024:.2f}")
    P(f"Part évitée du coût de conformité : " + " / ".join(f"{100*x:.0f} %" for x in eco["priv_part"]))
    eco_tot = tuple(eco["pub_eco"][k] + eco["priv_eco"][k] for k in range(3))
    P(f"{'Économie publique':46s}" + "".join(f"{x:8.2f}" if j == 0 else f"{x:9.2f}" if j == 1 else f"{x:8.2f}" for j, x in enumerate(eco["pub_eco"])))
    P(f"{'Économie de conformité (privé)':46s}" + "".join(f"{x:8.1f}" if j != 1 else f"{x:9.1f}" for j, x in enumerate(eco["priv_eco"])))
    P(f"{'TOTAL économisé':46s}" + "".join(f"{x:8.1f}" if j != 1 else f"{x:9.1f}" for j, x in enumerate(eco_tot)))
    P(f"{'en % du PIB 2024':46s}" + "".join(f"{100*x/PIB_2024:7.2f}%" for x in eco_tot))
    P("Seule l'économie publique est un gain budgétaire ; le reste est un gain de l'économie réelle, conditionné au réemploi.")
    P("")
    emp = emplois(eco["priv_eco"], eco["pub_part"])
    P("E. EMPLOIS ET RECONVERSIONS (équivalents temps plein)")
    P(f"{'':46s}{'bas':>8s}{'central':>9s}{'haut':>8s}")
    P(f"{'Horizon de bascule (ans)':46s}" + "".join(f"{h:8d}" if j != 1 else f"{h:9d}" for j, h in enumerate(HORIZON)))
    P(f"{'Emplois privés concernés':46s}" + "".join(f"{e['priv']:8,.0f}" if j != 1 else f"{e['priv']:9,.0f}" for j, e in enumerate(emp)).replace(",", " "))
    P(f"{'Emplois publics concernés (ETPT)':46s}" + "".join(f"{e['pub']:8,.0f}" if j != 1 else f"{e['pub']:9,.0f}" for j, e in enumerate(emp)).replace(",", " "))
    P(f"{'Personnes à reconvertir (après retraites)':46s}" + "".join(f"{e['reconv']:8,.0f}" if j != 1 else f"{e['reconv']:9,.0f}" for j, e in enumerate(emp)).replace(",", " "))
    P(f"{'Coût ponctuel des reconversions (Md€)':46s}" + "".join(f"{e['cout_reconv_md']:8.2f}" if j != 1 else f"{e['cout_reconv_md']:9.2f}" for j, e in enumerate(emp)))
    P(f"ETPT fiscaux publics retenus : {emp[0]['etpt_fisc']:,.0f}".replace(",", " "))
    P("")
    P("F. COMPARAISON (Estonie, Pays-Bas, Allemagne ; données OCDE 2022 et Doing Business 2020)")
    P(f"{'Pays':12s}{'coût collecte/100':>18s}{'% recettes publ.':>18s}{'cotis. incluses':>17s}{'heures/an':>11s}{'indice conform. % PO':>22s}")
    conf_ratio = 100 * pr["total"][1] / PO_2024
    for p, c, part, ssc, h, ind in comparaison(conf_ratio, None):
        P(f"{p:12s}{c:18.2f}{part:18.1f}{'oui' if ssc else 'non':>17s}{h:11d}{ind:22.2f}")
    fr_pub = 100 * tot[1] / PO_2024
    P(f"France, périmètre complet (public central, % PO) : {fr_pub:.2f}  contre 0,56 au périmètre OCDE (cotisations hors champ)")
    P("L'indice de conformité est une mise à l'échelle des heures de la PME type (France = valeur centrale) : une illustration, pas une mesure.")
    P("")
    P("G. SENSIBILITÉ (scénario central, Md€/an économisés)")
    for h in (0.5, 1.0, 1.5):
        ev = pr["total"][1] * part_evitee("central") * h
        P(f"  part évitée du privé x {h:.1f} : privé {ev:5.1f} + public {eco['pub_eco'][1]:.2f} = {ev+eco['pub_eco'][1]:5.1f}")
    texte = "\n".join(out)
    print(texte)
    if "--ecrire" in sys.argv:
        chemin = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cout_complet_prelevement_resultats.txt")
        with open(chemin, "w", encoding="utf-8") as f:
            f.write(texte + "\n")


if __name__ == "__main__":
    main()
