#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Modèle « Éducation » (premier jet, à valider par l'auteur).

Fonctions pures : aucune lecture de fichier, aucun effet de bord. Seul `main`
affiche. Les hypothèses H1... sont numérotées dans methode.md ; les scénarios
bas / central / haut sont des ordres de grandeur, jamais des prédictions.

Usage :  python3 modele.py            (affiche les résultats de resultats.md)
         python3 -m unittest test_modele
"""

# ---------------------------------------------------------------------------
# Hypothèses (voir methode.md § 3). Chaque scénario : (bas, central, haut).
# « bas » désigne le scénario le plus favorable au coût (le moins cher) pour
# les coûts, et le moins favorable à l'effet pour les effets : voir methode.md.
# ---------------------------------------------------------------------------

DONNEES = {
    "die_2025_md": 199.2,           # D, DEPP note 26.42
    "eleves_1er_2025": 6.1549e6,    # D (résumé de recherche), DEPP/RERS 2026
    "eleves_2nd_2025": 5.621e6,     # D (résumé), DEPP note 25-59
    "etudiants": 3.0e6,             # ⚠️ ordre de grandeur (CNOUS : 3 M accompagnés)
    "cout_1er": 9440.0,             # ⚠️ 2025
    "cout_college": 10580.0,        # ⚠️ 2025
    "cout_lgt": 13200.0,            # ⚠️ 2025
    "cout_lp": 14590.0,             # ⚠️ 2025
    "cout_sup": 13350.0,            # D 2025 (DEPP, note 26.42, apprentissage inclus)
    "pisa_maths_fr_2022": 474,      # ⚠️ résumé
    "pisa_maths_ocde_2022": 472,    # ⚠️ résumé
    "pisa_baisse_fr_2018_2022": 21, # ⚠️ résumé
    "timss_cm1_fr_2023": 484,       # ⚠️ résumé
    "timss_cm1_ue_2023": 524,       # ⚠️ résumé
    "baisse_eleves_10_ans": 1.7e6,  # ⚠️ projection DEPP, résumé
}

# H20 : répartition du second degré (collège / lycée GT / lycée pro), en élèves
# D : sommes par établissement, rentrée 2025, public + privé sous contrat (data.education.gouv.fr,
# jeux fr-en-college-/lycee_gt-/lycee_pro-effectifs-niveau-sexe-lv, lus le 03/11/2026) :
# collège 3 393 652, lycée GT 1 611 540, lycée pro 672 660 = 5,68 M (DEPP : 5,621 M, écart de 1 %).
REPARTITION_2ND = (3.394e6, 1.612e6, 0.673e6)

# Tuteur IA (H6-H12)
COUT_LICENCE = (15.0, 60.0, 200.0)        # € par élève et par an
COUT_MATERIEL_NEUF = (0.0, 300.0, 450.0)  # € par élève (bas : équipement existant)
DUREE_MATERIEL = (4.0, 4.0, 3.0)          # ans
ELEVES_PAR_ACCOMPAGNATEUR = (None, 100.0, 50.0)  # None : pas d'accompagnateur en plus
COUT_ACCOMPAGNATEUR = 35000.0             # € chargés par an (H ⚠️)
EFFET_TUTEUR_SD = (0.0, 0.15, 0.30)       # écarts-types, H : voir methode.md
BRUT_MENSUEL_AED = 1801.74                # € brut par mois, AED (page education.gouv.fr « Être assistant d'éducation », rapportée par résumé de recherche, non lue à la source ⚠️)
COEF_CHARGES_AED = 1.40                   # H ⚠️ non sourcée : brut -> coût employeur (contractuel d'État, hors CAS Pensions)
ELEVES_PAR_SURVEILLANT = (200.0, 100.0, 50.0)  # H23 : 1 surveillant pour N élèves (bas = le moins cher)
ECONOMIE_NON_REMPLACEMENT_MD = (2.2, 3.9, 5.5)  # Md€/an à 10 ans, sources/economies-depense-publique.md (hors tuteur)
ELEVES_PAR_ETABLISSEMENT = 500.0          # H ⚠️ ordre de grandeur (3,39 M collégiens, ~ 7 000 collèges)
ICC_ETABLISSEMENT = 0.15                  # H ⚠️ corrélation intra-établissement des scores
R2_ENTRE, R2_DANS = 0.70, 0.50            # H ⚠️ variance expliquée par le score initial (entre / dans les établissements)
COUT_TUTORAT_HUMAIN = 1500.0              # € par élève et par an, ordre de grandeur ⚠️
EFFET_TUTORAT_HUMAIN_SD = 0.29            # D ⚠️ (Nickow et al., version 2024)

# Enseignants (H13-H15)
ENSEIGNANTS_ETP = 756000.0                # D : ETP d'enseignants en établissement, rentrée 2025, public + privé sous contrat : 314,7 k (1er) + 441,1 k (2nd) (data.education.gouv.fr, 03/11/2026)
PART_TEMPS_LIBERE = (0.0, 0.05, 0.15)     # part du temps d'enseignement reprise par le tuteur
TAUX_DEPART = 0.03                        # H, comme H5 de numerus-orientation

# Supérieur (H16-H19)
ENTRANTS_L1 = (250000.0, 300000.0, 350000.0)
TAUX_SORTIE_L1 = 0.26                     # ⚠️ MESR via presse
PART_ENSEIGNEMENT = 0.60                  # H ⚠️ part de l'enseignement dans le coût par étudiant
PART_EN_LIGNE = (0.10, 0.30, 0.50)
REDUCTION_COUT_LIGNE = (0.60, 0.40, 0.20)  # bas = économie forte (favorable au coût)
SURCROIT_ABANDON_LIGNE = (0.0, 0.05, 0.09)  # points ; ⚠️ Bettinger et al. : −9 pts de maintien
PART_CERTIFIES = (0.20, 0.40, 0.60)       # part des étudiants qui passent une certification par an
COUT_EPREUVE = (100.0, 200.0, 400.0)      # € par candidat (surveillée), H ⚠️


# ---------------------------------------------------------------------------
# Bloc A. Dépense d'éducation
# ---------------------------------------------------------------------------

def cout_par_eleve(depense, effectif):
    """Dépense (€) divisée par l'effectif."""
    if effectif <= 0:
        raise ValueError("effectif nul ou négatif")
    return depense / effectif


def depense_par_niveau(d=DONNEES, repartition=REPARTITION_2ND):
    """Reconstitue la dépense (Md€) par niveau à partir de coût × effectif."""
    college, lgt, lp = repartition
    n1 = d["eleves_1er_2025"] * d["cout_1er"] / 1e9
    n2 = (college * d["cout_college"] + lgt * d["cout_lgt"] + lp * d["cout_lp"]) / 1e9
    ns = d["etudiants"] * d["cout_sup"] / 1e9
    total = n1 + n2 + ns
    return {"premier_degre": n1, "second_degre": n2, "superieur": ns,
            "total_reconstitue": total, "die": d["die_2025_md"],
            "reste_non_explique": d["die_2025_md"] - total}


def ecart_pisa(score_france, score_ocde):
    return score_france - score_ocde


def points_en_sd(points, ecart_type=100.0):
    """PISA est calibré à un écart-type d'environ 100 points."""
    return points / ecart_type


# ---------------------------------------------------------------------------
# Bloc B. Tuteur IA : coût, effet, enseignants
# ---------------------------------------------------------------------------

def cout_tuteur_par_eleve(licence, materiel_neuf, duree_materiel,
                          eleves_par_accompagnateur, cout_accompagnateur=COUT_ACCOMPAGNATEUR):
    """Coût annuel (€) par élève : licence + amortissement du matériel + accompagnateur."""
    amort = materiel_neuf / duree_materiel
    humain = 0.0 if eleves_par_accompagnateur is None else cout_accompagnateur / eleves_par_accompagnateur
    return {"licence": licence, "materiel": amort, "accompagnateur": humain,
            "total": licence + amort + humain}


def cout_total_national(cout_par_eleve_, effectif):
    """Md€ par an."""
    return cout_par_eleve_ * effectif / 1e9


def cout_par_dixieme_sd(cout_par_eleve_, effet_sd):
    """€ par élève pour 0,1 écart-type de gain ; None si l'effet est nul ou négatif."""
    if effet_sd <= 0:
        return None
    return cout_par_eleve_ / (effet_sd / 0.1)


def etp_liberes(etp, part_temps_libere):
    return etp * part_temps_libere


def etp_excedentaires_demographie(etp, baisse_eleves, effectif_total):
    """ETP en trop si le taux d'encadrement est maintenu face à la baisse d'effectifs."""
    return etp * baisse_eleves / effectif_total


def departs_cumules(stock, taux, annees):
    """Départs cumulés en `annees` ans si personne n'est remplacé (stock décroissant)."""
    restant = stock * (1 - taux) ** annees
    return stock - restant


def annees_pour_absorber(stock, taux, a_absorber):
    """Années de non-remplacement pour absorber `a_absorber` ETP sans licenciement."""
    import math
    if a_absorber <= 0:
        return 0.0
    if a_absorber >= stock:
        return float("inf")
    return math.log(1 - a_absorber / stock) / math.log(1 - taux)


def eleves_par_enseignant(effectif_eleves, etp):
    return effectif_eleves / etp


def bilan_tuteur(i, d=DONNEES):
    """Scénario i (0 bas, 1 central, 2 haut) du tuteur IA."""
    c = cout_tuteur_par_eleve(COUT_LICENCE[i], COUT_MATERIEL_NEUF[i], DUREE_MATERIEL[i],
                              ELEVES_PAR_ACCOMPAGNATEUR[i])
    eleves = d["eleves_1er_2025"] + d["eleves_2nd_2025"]
    effet = EFFET_TUTEUR_SD[i]
    libere = etp_liberes(ENSEIGNANTS_ETP, PART_TEMPS_LIBERE[i])
    exces = etp_excedentaires_demographie(ENSEIGNANTS_ETP, d["baisse_eleves_10_ans"], eleves)
    return {
        "cout_par_eleve": c, "cout_national_md": cout_total_national(c["total"], eleves),
        "part_de_la_die": cout_total_national(c["total"], eleves) / d["die_2025_md"],
        "effet_sd": effet, "effet_points_pisa": effet * 100,
        "cout_par_dixieme_sd": cout_par_dixieme_sd(c["total"], effet),
        "etp_liberes": libere, "etp_excedentaires_demographie": exces,
        "etp_a_redeployer": libere + exces,
        "annees_pour_absorber": annees_pour_absorber(ENSEIGNANTS_ETP, TAUX_DEPART, libere + exces),
    }


def bilan_tutorat_humain():
    return {"cout_par_eleve": COUT_TUTORAT_HUMAIN, "effet_sd": EFFET_TUTORAT_HUMAIN_SD,
            "cout_par_dixieme_sd": cout_par_dixieme_sd(COUT_TUTORAT_HUMAIN, EFFET_TUTORAT_HUMAIN_SD)}


# ---------------------------------------------------------------------------
# Bloc C. Choix et autonomie : un indicateur de mixité à publier
# ---------------------------------------------------------------------------

def cout_surveillant_charge(brut_mensuel=BRUT_MENSUEL_AED, coef=COEF_CHARGES_AED):
    """Coût employeur annuel (€) d'un assistant d'éducation : 12 mois de brut × coefficient de charges."""
    return brut_mensuel * 12.0 * coef


def bilan_surveillants(i, d=DONNEES, cout_surveillant=None):
    """Variante « surveillants » : licence et matériel du scénario i, 1 surveillant pour N élèves (H23)."""
    cs = cout_surveillant_charge() if cout_surveillant is None else cout_surveillant
    c = cout_tuteur_par_eleve(COUT_LICENCE[i], COUT_MATERIEL_NEUF[i], DUREE_MATERIEL[i],
                              ELEVES_PAR_SURVEILLANT[i], cs)
    eleves = d["eleves_1er_2025"] + d["eleves_2nd_2025"]
    cout_md = cout_total_national(c["total"], eleves)
    return {"cout_par_eleve": c, "cout_national_md": cout_md,
            "economie_non_remplacement_md": ECONOMIE_NON_REMPLACEMENT_MD[i],
            "economie_nette_md": ECONOMIE_NON_REMPLACEMENT_MD[i] - cout_md}


def cout_variante(licence, materiel_neuf, duree, eleves_par_adulte, cout_adulte, effectif):
    """Coût national (Md€) d'une variante : licence + matériel + un adulte pour N élèves."""
    c = cout_tuteur_par_eleve(licence, materiel_neuf, duree, eleves_par_adulte, cout_adulte)
    return cout_total_national(c["total"], effectif)


def etablissements_par_bras(mde_sd, n_eleves=100, icc=ICC_ETABLISSEMENT,
                            r2_entre=R2_ENTRE, r2_dans=R2_DANS, z=2.8):
    """Établissements par bras pour détecter mde_sd (écart-type) entre deux bras, puissance 80 %, seuil 5 %
    (z = 1,96 + 0,84 ≈ 2,8), tirage au sort par établissement, n_eleves testés par établissement.
    MDE = z × √(2 × [ICC(1−R²entre)/J + (1−ICC)(1−R²dans)/(J n)]) -> J en forme fermée."""
    if mde_sd <= 0:
        raise ValueError("mde_sd doit être positif")
    var_par_j = icc * (1 - r2_entre) + (1 - icc) * (1 - r2_dans) / n_eleves
    j = 2.0 * var_par_j * (z / mde_sd) ** 2
    return int(j) + (0 if j == int(j) else 1)


def indice_dissimilarite(groupe_a, groupe_b):
    """Indice de dissimilarité de Duncan entre deux groupes répartis dans des écoles.

    groupe_a, groupe_b : effectifs par école (même ordre). 0 = mixité parfaite,
    1 = séparation totale. C'est l'indicateur à surveiller si l'on élargit le choix.
    """
    if len(groupe_a) != len(groupe_b):
        raise ValueError("listes de longueurs différentes")
    ta, tb = sum(groupe_a), sum(groupe_b)
    if ta == 0 or tb == 0:
        raise ValueError("groupe vide")
    return 0.5 * sum(abs(a / ta - b / tb) for a, b in zip(groupe_a, groupe_b))


def effet_en_jours(effet_sd, jours_par_sd=180.0):
    """Conversion « jours d'apprentissage » (CREDO) : 1 SD ≈ une année scolaire (H, contestée)."""
    return effet_sd * jours_par_sd


# ---------------------------------------------------------------------------
# Bloc D. Supérieur : apprendre librement, certifier exigeant
# ---------------------------------------------------------------------------

def cout_certification(etudiants, part_certifies, cout_epreuve):
    """Md€ par an."""
    return etudiants * part_certifies * cout_epreuve / 1e9


def economie_enseignement_en_ligne(etudiants, cout_etudiant, part_enseignement,
                                   part_en_ligne, reduction_cout):
    """Md€ par an économisés si `part_en_ligne` de l'enseignement passe en ligne."""
    return etudiants * cout_etudiant * part_enseignement * part_en_ligne * reduction_cout / 1e9


def cout_abandons_supplementaires(entrants, part_en_ligne, surcroit_abandon, cout_annee):
    """Md€ par an : années financées pour rien si l'enseignement en ligne accroît les abandons."""
    return entrants * part_en_ligne * surcroit_abandon * cout_annee / 1e9


def cout_echec_l1(entrants, taux_sortie, cout_annee):
    """Md€ par an : coût d'une année de L1 des étudiants qui sortent sans diplôme."""
    return entrants * taux_sortie * cout_annee / 1e9


def bilan_superieur(i, d=DONNEES):
    eco = economie_enseignement_en_ligne(d["etudiants"], d["cout_sup"], PART_ENSEIGNEMENT,
                                         PART_EN_LIGNE[i], REDUCTION_COUT_LIGNE[i])
    aband = cout_abandons_supplementaires(ENTRANTS_L1[i], PART_EN_LIGNE[i],
                                          SURCROIT_ABANDON_LIGNE[i], d["cout_sup"])
    cert = cout_certification(d["etudiants"], PART_CERTIFIES[i], COUT_EPREUVE[i])
    return {"economie_ligne_md": eco, "abandons_md": aband, "certification_md": cert,
            "solde_md": eco - aband - cert,
            "echec_l1_md": cout_echec_l1(ENTRANTS_L1[i], TAUX_SORTIE_L1, d["cout_sup"]),
            "part_du_cout_superieur": (eco - aband - cert) / (d["etudiants"] * d["cout_sup"] / 1e9)}


# ---------------------------------------------------------------------------

def main():
    noms = ("bas", "central", "haut")
    print("A. Dépense par niveau (Md€)")
    for k, v in depense_par_niveau().items():
        print(f"  {k:22s} {v:8.1f}")
    print(f"  PISA 2022 maths : France − OCDE = {ecart_pisa(474, 472):+d} ; baisse 2018-22 = −21 pts = {points_en_sd(21):.2f} SD")
    print(f"  TIMSS 2023 CM1 : France − UE = {484 - 524:+d} pts")
    print("B. Tuteur IA")
    for i, n in enumerate(noms):
        b = bilan_tuteur(i)
        cd = b["cout_par_dixieme_sd"]
        cds = "n.d. (effet nul)" if cd is None else f"{cd:,.0f} €"
        print(f"  {n:8s} coût/élève {b['cout_par_eleve']['total']:6.0f} € (licence {b['cout_par_eleve']['licence']:.0f}, "
              f"matériel {b['cout_par_eleve']['materiel']:.0f}, accompagnateur {b['cout_par_eleve']['accompagnateur']:.0f}) ; "
              f"national {b['cout_national_md']:5.1f} Md€ ({b['part_de_la_die']*100:.1f} % DIE) ; effet {b['effet_sd']:.2f} SD ; "
              f"€/0,1 SD {cds}")
        print(f"           ETP libérés {b['etp_liberes']:,.0f} + excédent démographique {b['etp_excedentaires_demographie']:,.0f} "
              f"= {b['etp_a_redeployer']:,.0f} ; années de non-remplacement pour absorber : {b['annees_pour_absorber']:.1f}")
    h = bilan_tutorat_humain()
    print(f"  tutorat humain : {h['cout_par_eleve']:.0f} €/élève, {h['effet_sd']} SD, {h['cout_par_dixieme_sd']:.0f} € par 0,1 SD")
    print("B'. Variante « surveillants » (assistants d'éducation)")
    print(f"  coût employeur d'un AED : {cout_surveillant_charge():,.0f} €/an (brut {BRUT_MENSUEL_AED} × 12 × {COEF_CHARGES_AED})")
    for i, n in enumerate(noms):
        b = bilan_surveillants(i)
        print(f"  {n:8s} 1 pour {ELEVES_PAR_SURVEILLANT[i]:.0f} : {b['cout_par_eleve']['total']:5.0f} €/élève "
              f"(surveillant {b['cout_par_eleve']['accompagnateur']:.0f}) ; national {b['cout_national_md']:5.2f} Md€ ; "
              f"non-remplacement +{b['economie_non_remplacement_md']:.1f} ; net {b['economie_nette_md']:+.2f} Md€/an")
    eleves = DONNEES["eleves_1er_2025"] + DONNEES["eleves_2nd_2025"]
    print("  grille de ratios, licence 60 + matériel 75 (central), Md€/an : surveillant (30 269 €) | enseignant (35 000 €)")
    for r in (200.0, 100.0, 50.0):
        cs = cout_variante(60, 300, 4, r, cout_surveillant_charge(), eleves)
        ce = cout_variante(60, 300, 4, r, COUT_ACCOMPAGNATEUR, eleves)
        print(f"    1 pour {r:.0f} : {cs:5.2f} | {ce:5.2f}")
    print(f"  expérimentation : établissements par bras pour MDE 0,15 SD = {etablissements_par_bras(0.15)} ; "
          f"pour 0,10 SD = {etablissements_par_bras(0.10)} ; pour 0,20 SD = {etablissements_par_bras(0.20)}")
    print("D. Supérieur")
    for i, n in enumerate(noms):
        s = bilan_superieur(i)
        print(f"  {n:8s} économie en ligne {s['economie_ligne_md']:.2f} − abandons {s['abandons_md']:.2f} − certification "
              f"{s['certification_md']:.2f} = solde {s['solde_md']:+.2f} Md€ ; coût de l'échec en L1 {s['echec_l1_md']:.2f} Md€")


if __name__ == "__main__":
    main()
