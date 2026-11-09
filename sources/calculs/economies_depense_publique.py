#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Économies de dépense publique au-delà du modèle (boucle « meilleur système », chantier 3, 03/11/2026).
Convention : bas / central / haut = ampleur de l'économie (bas = prudent). Md€/an, régime de croisière à 10 ans ;
central à 1 an et à 3 ans en plus. Reproduit les tableaux de sources/economies-depense-publique.md.
Usage : python3 economies_depense_publique.py"""

# (id, classe, libellé, (bas, central, haut) à 10 ans, central 3 ans, central 1 an)
MESURES = [
 ("A1", "A", "Collectivités : effectifs (Cour 4,1) + temps de travail (Cour 1,3), recouvrement déduit", (2.2, 4.5, 4.9), 1.8, 0.3),
 ("A2", "A", "Achats des collectivités (Cour : 10 % ≈ 5 Md€)", (2.0, 3.5, 5.0), 1.8, 0.6),
 ("A3", "A", "Logement social (IGF : 1 à 3 Md€)", (1.0, 2.0, 3.0), 1.0, 0.3),
 ("A4", "A", "Sport, jeunesse, vie associative (IGF-IGESR 2025 : 1 à 3 Md€)", (0.5, 1.5, 3.0), 0.8, 0.3),
 ("A5", "A", "CPF : ticket modéré (IGF 2024 : 0,19 Md€)", (0.1, 0.2, 0.2), 0.2, 0.1),
]

def immobilier():
    """B4. Bureaux de l'État : 23,1 M m² SUB, 25,25 m² par poste (2024), cible 16, plafond 18 (Sénat, juin 2026, DPT)."""
    bureaux, ratio = 23.1e6, 25.25
    cas = {  # (ratio visé, part réellement libérée, coût d'occupation évité €/m²/an)
        "bas": (21.0, 0.30, 120), "central": (18.0, 0.50, 200), "haut": (16.0, 0.70, 300)}
    out = {}
    for k, (r, part, cout) in cas.items():
        libre = bureaux * (1 - r / ratio)
        out[k] = round(libre * part * cout / 1e9, 2)
    return out

def education():
    """B5. 109 138 ETP libérés par la démographie (modeles/education/resultats.md). Coût hors CAS Pensions."""
    etp = 109138
    cas = {"bas": (0.5, 41000), "central": (0.8, 45000), "haut": (1.0, 50000)}  # (part économisée, coût par ETP)
    eco = {k: round(etp * p * c / 1e9, 2) for k, (p, c) in cas.items()}
    eleves = 11.78e6
    tuteur = {"bas": (15, 0, 15), "central": (60 + 75, 350, 485), "haut": (200 + 150, 700, 1050)}
    cout_hw = {k: round(eleves * v[0] / 1e9, 2) for k, v in tuteur.items()}
    cout_acc = {k: round(eleves * v[1] / 1e9, 2) for k, v in tuteur.items()}
    couverture = {k: round(etp * cas[k][1] / 1e9, 2) for k in cas}
    return eco, cout_hw, cout_acc, couverture

def niches():
    """Recettes de niches hors assiette (TVA, accises) : PLF 2026, VM tome 2 (accises 5,824 + 1,069 + 0,641)."""
    accises = 5.824 + 1.069 + 0.641
    tva = 2.275 + 2.465
    a = {"bas": 0.20, "central": 0.40, "haut": 0.65}
    t = {"bas": 0.5 * 2.275 * 0.75, "central": 2.275 * 0.75, "haut": tva * 0.75}
    return accises, tva, {k: round(accises * v, 1) for k, v in a.items()}, {k: round(v, 1) for k, v in t.items()}

if __name__ == "__main__":
    im = immobilier()
    mes = list(MESURES) + [
      ("B1", "B", "Gestion devenue inutile (prélèvement unique, socle) : fourchette prudente de T47", (0.3, 1.0, 2.6), 0.4, 0.05),
      ("B2", "B", "Masse salariale d'administration : numérique, départs non remplacés", (0.1, 1.1, 4.6), 0.1, 0.0),
      ("B3", "B", "Dépenses qui interrogent (conseil, France Travail, culture, outre-mer)", (0.5, 1.5, 2.7), 0.9, 0.3),
      ("B4", "B", "Immobilier de bureaux de l'État (densification)", (im["bas"], im["central"], im["haut"]), 0.2, 0.05),
      ("B5", "B", "Achats de l'État et des opérateurs", (0.4, 0.8, 1.5), 0.4, 0.1),
    ]
    print("Mesure | classe | bas / central / haut (10 ans) | central 3 ans | central 1 an")
    for i, c, l, v, y3, y1 in mes:
        print(f"{i} | {c} | {v[0]:.2f} / {v[1]:.2f} / {v[2]:.2f} | {y3} | {y1} | {l}")
    for cl in ("A", "B"):
        s = [sum(m[3][j] for m in mes if m[1] == cl) for j in range(3)]
        y3 = sum(m[4] for m in mes if m[1] == cl); y1 = sum(m[5] for m in mes if m[1] == cl)
        print(f"Total {cl} : {s[0]:.1f} / {s[1]:.1f} / {s[2]:.1f} ; 3 ans {y3:.1f} ; 1 an {y1:.2f}")
    tot = [sum(m[3][j] for m in mes) for j in range(3)]
    y3 = sum(m[4] for m in mes); y1 = sum(m[5] for m in mes)
    print(f"Total A+B : {tot[0]:.1f} / {tot[1]:.1f} / {tot[2]:.1f} ; 3 ans {y3:.1f} ; 1 an {y1:.2f}")
    print(f"Central A+B en points de taux plat (12,7 Md€/pt) : {tot[1]/12.7:.2f} ; en € de socle (0,430 Md€/€) : {tot[1]/0.430:.0f} ; en % du déficit 163,3 : {100*tot[1]/163.3:.1f}")
    print("Ordre du modèle (favorable, central, défavorable) A seul :", [round(sum(m[3][j] for m in mes if m[1]=='A'),1) for j in (2,1,0)])
    print("Ordre du modèle (favorable, central, défavorable) A+B   :", [round(tot[j],1) for j in (2,1,0)])
    eco, hw, acc, cov = education()
    print("Éducation, variante économie (10 ans) :", eco, "; 3 ans central", round(eco['central']*0.3, 2), "; 1 an", round(eco['central']*0.1, 2))
    print("Tuteur : licence+matériel", hw, "; accompagnateurs", acc, "; couverture par les 109 138 ETP", cov)
    ac, tv, a, t = niches()
    print(f"Niches hors assiette : accises {ac:.2f} Md€, TVA ciblée {tv:.2f} Md€ ; retenu accises {a}, TVA {t}")
    print("Surface bureaux libérable (central, Mm²) :", round(23.1 * (1 - 18 / 25.25), 2))
