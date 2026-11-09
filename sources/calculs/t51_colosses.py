# -*- coding: utf-8 -*-
"""T51 - Ordres de grandeur du pilier des « colosses » à capital commun (France, euros constants).
Aucune prédiction : des relations arithmétiques entre capital, rendement réel et dividende.
Hypothèses (H1-H6) :
 H1 population France N = 68,6 M (Insee, Bilan démographique 2024, 1er janvier 2025 ; V3340 confirmé le 02/11/2026 ; 69,1 M au 1er janvier 2026, provisoire) ; adultes de 18 ans et plus ≈ 54 M (⚠️ estimation).
 H2 PIB 2025 ≈ 2 990 Md€ (422,2 / 0,141, COR RA 2026 ; voir t48_capitalisation.py).
 H3 rendement réel net de frais et d'impôt du portefeuille r = 3 %, 4 %, 6 % (scénarios ; 3 % = règle norvégienne ; 4,3 % = GPFG 1998-2025 ; 3,8 % = GIC 20 ans).
 H4 naissances 660 787 en 2024 (Insee Focus 357, données définitives ; 663 000 était l'estimation provisoire ; V3341 corrigé le 02/11/2026 ; 645 000 en 2025, provisoire).
 H5 déficit du palier 1 du système idéal ≈ 180 Md€ (resultats.md § 20, central, an 5-10) ; compartiment « intérêt commun » de T48 : 170 à 260 Md€ à 30 ans.
 H6 apports annuels exprimés en part du PIB, rendement constant, pas de risque : majorant de ce qu'un portefeuille concentré peut offrir.
Fonctions pures ; lancer `python3 t51_colosses.py` (affiche les tableaux, exécute les tests)."""
N = 68.6e6
ADULTES = 54e6
PIB = 422.2 / 0.141          # Md€
NAISSANCES = 660_787
DEFICIT_P1 = 180.0           # Md€/an
TAUX = (0.03, 0.04, 0.06)

def capital_necessaire(dividende_mensuel_par_habitant, r, population=N):
    """Capital (Md€) dont le revenu réel r finance un dividende mensuel (€) pour chaque habitant."""
    return dividende_mensuel_par_habitant * 12 * population / r / 1e9

def dividende_mensuel(capital_md, r, population=N):
    """Dividende mensuel (€) par habitant versé par un capital (Md€) au rendement réel r."""
    return capital_md * 1e9 * r / population / 12

def capital_pour_flux(flux_annuel_md, r):
    """Capital (Md€) dont le revenu réel finance un flux annuel de flux_annuel_md Md€."""
    return flux_annuel_md / r

def accumulation(apport_annuel_md, r, annees):
    """Valeur (Md€) après `annees` d'apports annuels constants versés en fin d'année, rendement r."""
    if r == 0:
        return apport_annuel_md * annees
    return apport_annuel_md * ((1 + r) ** annees - 1) / r

def annees_pour_atteindre(cible_md, apport_annuel_md, r, maxi=200):
    """Nombre d'années d'apports pour atteindre la cible (None au-delà de maxi)."""
    for t in range(1, maxi + 1):
        if accumulation(apport_annuel_md, r, t) >= cible_md:
            return t
    return None

def dotation_naissance(montant, r, age=18):
    """(valeur à l'âge `age`, coût annuel d'une cohorte en Md€) d'une dotation `montant` € à la naissance."""
    return montant * (1 + r) ** age, montant * NAISSANCES / 1e9

def tests():
    assert abs(capital_necessaire(100, 0.04) - 2058) < 1                       # 100 €/mois/hab à 4 %
    assert abs(dividende_mensuel(capital_necessaire(250, 0.03), 0.03) - 250) < 1e-6   # aller-retour
    assert abs(capital_necessaire(100, 0.03) / capital_necessaire(100, 0.06) - 2) < 1e-9  # inverse du taux
    assert abs(accumulation(10, 0.0, 5) - 50) < 1e-9
    assert abs(accumulation(10, 0.04, 2) - 20.4) < 1e-9
    assert annees_pour_atteindre(1e9, 1, 0.04, maxi=10) is None
    assert annees_pour_atteindre(20.4, 10, 0.04) == 2
    v, c = dotation_naissance(1000, 0.04)
    assert abs(v - 2025.8) < 0.5 and abs(c - 0.660787) < 1e-9
    assert abs(capital_pour_flux(180, 0.04) - 4500) < 1e-9
    return "tests ok"

if __name__ == "__main__":
    print(tests())
    print(f"PIB ≈ {PIB:.0f} Md€ ; N = {N/1e6:.1f} M ; 1 €/mois/habitant = {12*N/1e9:.2f} Md€/an")
    print("\n[A] Capital nécessaire (Md€ ; % du PIB) pour un dividende réel mensuel par habitant")
    for d in (50, 100, 250, 500):
        print(f"  {d:>4} €/mois | " + " | ".join(f"r={r*100:.0f} % : {capital_necessaire(d, r):>6.0f} Md€ ({capital_necessaire(d, r)/PIB*100:>4.0f} % PIB)" for r in TAUX))
    print("\n[B] Dividende mensuel par habitant de portefeuilles connus (rendement réel r)")
    for nom, cap in (("compartiment T48 bas (170 Md€)", 170), ("compartiment T48 haut (260 Md€)", 260), ("portefeuille APE ≈ 180 Md€ (⚠️ valeur contestée)", 180), ("10 % du PIB (≈ 300 Md€)", 0.10 * PIB), ("100 % du PIB", PIB)):
        print(f"  {nom:<50}| " + " | ".join(f"r={r*100:.0f} % : {dividende_mensuel(cap, r):>5.1f} €/mois" for r in TAUX))
    print("\n[C] Années d'apports annuels (part du PIB) pour constituer le capital d'un dividende de 100 €/mois/habitant")
    for part in (0.005, 0.01, 0.02):
        ap = part * PIB
        print(f"  apport {part*100:.1f} % du PIB ({ap:.0f} Md€/an) | " + " | ".join(f"r={r*100:.0f} % : {annees_pour_atteindre(capital_necessaire(100, r), ap, r)} ans" for r in TAUX))
    print("\n[D] Capital pour couvrir le déficit du palier 1 (180 Md€/an) par le seul revenu du portefeuille")
    print("  " + " | ".join(f"r={r*100:.0f} % : {capital_pour_flux(DEFICIT_P1, r):>5.0f} Md€ ({capital_pour_flux(DEFICIT_P1, r)/PIB*100:>3.0f} % PIB)" for r in TAUX))
    print("\n[E] Dotation à la naissance (valeur à 18 ans ; coût annuel d'une cohorte)")
    for m in (1000, 5000, 10000):
        print(f"  {m:>6} € | coût {m*NAISSANCES/1e9:5.2f} Md€/an ({m*NAISSANCES/1e9/PIB*100:.2f} % PIB) | " + " | ".join(f"r={r*100:.0f} % : {dotation_naissance(m, r)[0]:>7.0f} €" for r in TAUX))
