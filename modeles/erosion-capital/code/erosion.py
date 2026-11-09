#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Érosion d'une grande fortune sur plusieurs générations : fonctions pures.

Modèle `modeles/erosion-capital/` (09/11/2026), écrit par Claude (IA d'Anthropic) pour l'auteur.
Hypothèses HER1 à HER18 : voir `methode.md`. Euros constants. Des ordres de grandeur sous
hypothèses, jamais des prédictions ; aucune affirmation sur une personne réelle.

Chaîne, pour chaque génération g = 1..G :
  1. transmission du patrimoine de la génération g-1 à n_g enfants (droits selon le régime) ;
  2. (si g < G) vie de la génération g pendant T années : rendement réel r, consommation c
     (retirée brute de l'impôt sur les revenus distribués), prélèvement annuel éventuel ;
  3. en fin de vie, déclin éventuel de l'entreprise familiale (probabilité p, perte L sur la part s).
La génération 1 reçoit la fortune initiale W0 sans croissance préalable (W0 = valeur au moment
de la première transmission). Le déclin est commun à toute la branche (même entreprise) :
on énumère les 2^(G-1) chemins exactement, sans tirage aléatoire.
"""
import math
from dataclasses import dataclass, replace
from itertools import product

# --- Droit actuel français (HER8 à HER11) -----------------------------------------------------
# CGI art. 777, tableau I (ligne directe) ; abattement art. 779 I : 100 000 € par parent et par enfant.
BAREME_777 = ((8072, 0.05), (12109, 0.10), (15932, 0.15), (552324, 0.20),
              (902838, 0.30), (1805677, 0.40), (math.inf, 0.45))
ABATTEMENT_LIGNE_DIRECTE = 100_000.0
DUTREIL_EXONERATION = 0.75          # CGI art. 787 B : 75 % de la valeur des titres exonérés
REDUCTION_790 = 0.50                # CGI art. 790 : -50 % des droits, donation en pleine propriété de titres Dutreil, donateur < 70 ans
PRELEVEMENT_DIVIDENDES_ACTUEL = 0.354   # PFU 31,4 % (12,8 + 18,6, LFSS 2026) + CEHR 4 % au sommet (HER12)

# --- Notre système, arrêté du 08/11/2026 (modeles/systeme-ideal/fonctions_csv_0811.py) --------
ABATTEMENT_SYS, K_SYS, PLAFOND_SYS = 300_000.0, 100_000.0, 0.50
PATRIMOINE_T_INF, PATRIMOINE_K = 0.03, 400_000.0
TAUX_MARGINAL_REVENUS_SOMMET = 0.6515   # a de la fonction des revenus (couche CORRECTION0811)

# --- Variante États-Unis, très simplifiée (HER13) ----------------------------------------------
EXEMPTION_USA_EUR = 13e6            # ≈ 15 M$ (exemption fédérale 2026) à ≈ 1,15 $/€ ⚠️
TAUX_USA = 0.40
PRELEVEMENT_DIVIDENDES_USA = 0.238  # 20 % + 3,8 % NIIT (fédéral, hors États)


def bareme_progressif(base, bareme=BAREME_777):
    """Impôt d'un barème par tranches [(plafond, taux)] sur une base >= 0."""
    impot, bas = 0.0, 0.0
    for plafond, taux in bareme:
        if base <= bas:
            break
        impot += (min(base, plafond) - bas) * taux
        bas = plafond
    return impot


def droits_droit_commun(part):
    """Droits de succession en ligne directe, sans régime de faveur, sur la part d'un enfant."""
    return bareme_progressif(max(0.0, part - ABATTEMENT_LIGNE_DIRECTE))


def droits_dutreil(part, part_eligible, reduction_790=False):
    """Droits avec pacte Dutreil sur la fraction `part_eligible` de la part (titres sous engagement).

    Base = 25 % de la fraction éligible + le reste ; réduction de 50 % des droits afférents aux
    titres Dutreil si donation en pleine propriété avant 70 ans (art. 790), au prorata de la base.
    """
    base_elig = part * part_eligible * (1 - DUTREIL_EXONERATION)
    base_autre = part * (1 - part_eligible)
    base = base_elig + base_autre
    droits = bareme_progressif(max(0.0, base - ABATTEMENT_LIGNE_DIRECTE))
    if reduction_790 and base > 0:
        droits -= REDUCTION_790 * droits * base_elig / base
    return droits


def droits_systeme(cumul):
    """Fonction des transmissions du système (08/11/2026) : 50 % (x - K ln(1 + x/K)), x = cumul - 300 000 €."""
    x = cumul - ABATTEMENT_SYS
    return 0.0 if x <= 0 else PLAFOND_SYS * (x - K_SYS * math.log1p(x / K_SYS))


def taux_moyen_patrimoine_systeme(w):
    """P(W)/W de la fonction du patrimoine : 3 % W / (W + 400 000 €)."""
    return 0.0 if w <= 0 else PATRIMOINE_T_INF * w / (w + PATRIMOINE_K)


@dataclass(frozen=True)
class Regime:
    nom: str
    transmission: str            # 'aucun', 'commun', 'dutreil', 'dutreil_790', 'systeme', 'usa'
    prelevement_dividendes: float
    patrimoine_annuel: bool = False


REGIMES = {
    "sans_impot": Regime("Sans impôt", "aucun", 0.0),
    "actuel_commun": Regime("Droit actuel, sans Dutreil", "commun", PRELEVEMENT_DIVIDENDES_ACTUEL),
    "actuel_dutreil": Regime("Droit actuel, Dutreil au décès", "dutreil", PRELEVEMENT_DIVIDENDES_ACTUEL),
    "actuel_dutreil_790": Regime("Droit actuel, Dutreil + donation avant 70 ans", "dutreil_790", PRELEVEMENT_DIVIDENDES_ACTUEL),
    "systeme_transmissions": Regime("Notre système : transmissions seules", "systeme", PRELEVEMENT_DIVIDENDES_ACTUEL),
    "systeme_complet": Regime("Notre système : transmissions + patrimoine + revenus", "systeme", TAUX_MARGINAL_REVENUS_SOMMET, True),
    "usa_simplifie": Regime("États-Unis simplifié (40 %, sans planification)", "usa", PRELEVEMENT_DIVIDENDES_USA),
}


@dataclass(frozen=True)
class Parametres:
    r: float                 # HER2 rendement réel net d'IS, avant impôt personnel
    c: float                 # HER3 consommation nette, part du patrimoine par an
    enfants_g1: float        # HER5 enfants de la première transmission
    enfants_suite: float     # HER6 enfants par descendant ensuite
    p_declin: float          # HER7 probabilité de déclin de l'entreprise par génération
    perte_declin: float      # HER7 perte de valeur de l'entreprise en cas de déclin
    part_entreprise: float   # HER4 part du patrimoine dans l'entreprise familiale
    part_eligible_dutreil: float  # HER9 part des titres éligibles au Dutreil
    duree_generation: int = 30    # HER1
    philanthropie: float = 0.0    # HER14 part donnée à chaque transmission (hors droits)
    croissance_economie: float = 0.012  # HER15 pour exprimer en part de l'économie


SCENARIOS = {
    # 'bas' = érosion forte (défavorable à la fortune) ; 'haut' = persistance forte.
    "bas": Parametres(r=0.03, c=0.02, enfants_g1=3.0, enfants_suite=3.0, p_declin=0.5,
                      perte_declin=0.7, part_entreprise=0.9, part_eligible_dutreil=0.5),
    "central": Parametres(r=0.045, c=0.01, enfants_g1=2.0, enfants_suite=2.0, p_declin=0.3,
                          perte_declin=0.6, part_entreprise=0.7, part_eligible_dutreil=0.8),
    "haut": Parametres(r=0.06, c=0.005, enfants_g1=1.6, enfants_suite=1.6, p_declin=0.15,
                       perte_declin=0.5, part_entreprise=0.5, part_eligible_dutreil=1.0),
}


def part_nette_enfant(patrimoine, n, regime, p):
    """Patrimoine net reçu par chaque enfant quand `patrimoine` est transmis à n enfants."""
    if n <= 0:
        raise ValueError("au moins un enfant")
    transmis = patrimoine * (1 - p.philanthropie)
    if regime.transmission == "usa":
        impot = TAUX_USA * max(0.0, transmis - EXEMPTION_USA_EUR)
        return (transmis - impot) / n
    part = transmis / n
    if regime.transmission == "aucun":
        droits = 0.0
    elif regime.transmission == "commun":
        droits = droits_droit_commun(part)
    elif regime.transmission == "dutreil":
        droits = droits_dutreil(part, p.part_entreprise * p.part_eligible_dutreil)
    elif regime.transmission == "dutreil_790":
        droits = droits_dutreil(part, p.part_entreprise * p.part_eligible_dutreil, reduction_790=True)
    elif regime.transmission == "systeme":
        droits = droits_systeme(part)
    else:
        raise ValueError(regime.transmission)
    return part - droits


def vie_une_generation(w, regime, p):
    """Patrimoine d'un descendant après T années : w (1 + r) - retrait brut de la consommation - prélèvement annuel."""
    retrait_brut = p.c / (1 - regime.prelevement_dividendes)
    for _ in range(p.duree_generation):
        prelev = w * taux_moyen_patrimoine_systeme(w) if regime.patrimoine_annuel else 0.0
        w = max(0.0, w * (1 + p.r) - w * retrait_brut - prelev)
    return w


def facteur_declin(decline, p):
    """Multiplicateur de fin de génération : 1 - L s si l'entreprise a décliné, 1 sinon."""
    return 1 - p.perte_declin * p.part_entreprise if decline else 1.0


def enfants(g, p):
    return p.enfants_g1 if g == 1 else p.enfants_suite


def nombre_descendants(g, p):
    """Nombre de descendants de la génération g (produit des enfants par génération)."""
    return math.prod(enfants(k, p) for k in range(1, g + 1))


def trajectoire(w0, chemin, regime, p):
    """Patrimoine d'un descendant à chaque génération (juste après réception), pour un chemin de déclins.

    chemin[k] = True si l'entreprise décline pendant la vie de la génération k+1 (k = 0..G-2).
    """
    sortie, w = [], w0
    for g in range(1, len(chemin) + 2):
        w = part_nette_enfant(w, enfants(g, p), regime, p)
        sortie.append(w)
        if g <= len(chemin):
            w = vie_une_generation(w, regime, p) * facteur_declin(chemin[g - 1], p)
    return sortie


def simuler(w0, generations, regime, p):
    """Espérance exacte sur les 2^(G-1) chemins de déclin.

    Renvoie une liste de dicts par génération : part moyenne d'un descendant (en part de W0),
    part familiale totale, part d'un descendant en part de l'économie, probabilité qu'un
    descendant ait au moins 1 % de W0.
    """
    n_chemins = generations - 1
    moy = [0.0] * generations
    p_1pc = [0.0] * generations
    for chemin in product((False, True), repeat=n_chemins):
        prob = math.prod(p.p_declin if d else 1 - p.p_declin for d in chemin)
        for i, w in enumerate(trajectoire(w0, chemin, regime, p)):
            moy[i] += prob * w
            p_1pc[i] += prob * (w >= 0.01 * w0)
    res = []
    for i in range(generations):
        g = i + 1
        part = moy[i] / w0
        econ = (1 + p.croissance_economie) ** (p.duree_generation * (g - 1))
        res.append({
            "generation": g,
            "descendants": nombre_descendants(g, p),
            "part_descendant": part,
            "part_famille": part * nombre_descendants(g, p),
            "part_descendant_economie": part / econ,
            "proba_au_moins_1pc": p_1pc[i],
        })
    return res


def taux_effectif_transmission(patrimoine, n, regime, p):
    """Part du patrimoine transmis perdue en droits (hors philanthropie)."""
    net = part_nette_enfant(patrimoine, n, regime, replace(p, philanthropie=0.0)) * n
    return 1 - net / patrimoine


def decomposition(w0, generations, p):
    """Effet cumulé des facteurs, ajoutés un à un (central, droit actuel avec Dutreil à la fin)."""
    neutre = replace(p, r=0.0, c=0.0, p_declin=0.0)
    etapes = [
        ("1. partage seul", neutre, REGIMES["sans_impot"]),
        ("2. + rendement et consommation", replace(p, p_declin=0.0), REGIMES["sans_impot"]),
        ("3. + déclin de l'entreprise", p, REGIMES["sans_impot"]),
        ("4. + droit actuel (Dutreil au décès)", p, REGIMES["actuel_dutreil"]),
        ("5. droit actuel sans Dutreil (au lieu de 4)", p, REGIMES["actuel_commun"]),
        ("6. notre système complet (au lieu de 4)", p, REGIMES["systeme_complet"]),
    ]
    return [(nom, simuler(w0, generations, reg, q)[-1]["part_descendant"]) for nom, q, reg in etapes]
