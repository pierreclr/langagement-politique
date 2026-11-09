#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Payer la contribution sur le patrimoine en nue-propriété (T82) : fonctions pures.

Modèle `modeles/nue-propriete/` (09/11/2026), écrit par Claude (IA d'Anthropic) pour l'auteur.
Hypothèses HNP1 à HNP20 : voir `methode.md`. Unités : euros de 2025 indexés sur le PIB nominal
(convention du banc d'essai : un montant constant garde le même poids dans le PIB), sauf mention.
Des ordres de grandeur sous hypothèses, jamais des prédictions.

Mécanisme chiffré (positions de l'auteur du 09/11/2026) :
  - base de la fonction : W_eff = X + c × D, où X est la part en pleine propriété et D la valeur
    (pleine) des biens dont l'État détient la nue-propriété (coefficient c < 1) ;
  - un participant paie chaque année son dû en cédant la nue-propriété de biens : il cède une valeur
    pleine V = dû / (1 − u(âge)), u = part de l'usufruit (barème de l'art. 669 du CGI) ; X baisse, D monte ;
  - au décès (dernier décès du couple), l'État devient plein propriétaire de D ; les héritiers reçoivent X.
On compare chaque lignée à la même lignée sous la fonction actuelle (v7.5 retenue, report d'encaissement
compris, couche CORRECTION0811). Les lignées qui ne participent pas sont identiques dans les deux mondes.

Tirages : lignées représentatives tirées avec une graine fixe (comme le banc d'essai) ; tout le reste
est déterministe. Aucune lecture ni écriture de fichier ici (voir rapport.py).
"""
import math
import os
import random
import sys
from dataclasses import dataclass, replace

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, "..", "..", "erosion-capital", "code"))
import erosion as ER  # noqa: E402  (fonction des transmissions du système, 08/11/2026)

ANNEE0 = 2029
HORIZON = 60                       # 2029-2088
GRAINE = 20261109

# --- Fonction du patrimoine v7.5 retenue (chapitre 3 ; modeles/systeme-ideal/decisions_0611_v75.js) ---------
T_INF, K_PAT = 0.03, 400_000.0


def p_courbe(w):
    """P(W) = 3 % × W² / (W + 400 000 €), W = part du patrimoine dans la courbe."""
    return 0.0 if w <= 0 else T_INF * w * w / (w + K_PAT)


# --- Barème fiscal de l'usufruit (CGI, art. 669, I) : (âge maximal, part de l'usufruit) -------------------
BAREME_669 = ((20, 0.9), (30, 0.8), (40, 0.7), (50, 0.6), (60, 0.5), (70, 0.4), (80, 0.3), (90, 0.2), (math.inf, 0.1))


def usufruit(age):
    """Part de l'usufruit viager dans la pleine propriété selon l'âge de l'usufruitier (art. 669)."""
    for amax, u in BAREME_669:
        if age <= amax:
            return u
    return 0.1


# --- Mortalité (HNP6, HNP7) ------------------------------------------------------------------------------
GOMPERTZ_B = 0.105


def _survie_indiv(a, x, b=GOMPERTZ_B):
    """S(x) / S(0) pour un aléa de Gompertz mu(x) = a e^(b x)."""
    return math.exp(-a / b * (math.exp(b * x) - 1.0))


def esperance_a(age, a, b=GOMPERTZ_B):
    s0 = _survie_indiv(a, age, b)
    return sum(_survie_indiv(a, age + k + 0.5, b) for k in range(0, 80)) / s0


def calibrer_gompertz(e65=21.6, b=GOMPERTZ_B):
    """Paramètre a tel que l'espérance de vie à 65 ans vaille e65 (moyenne femmes-hommes, HNP6)."""
    lo, hi = 1e-7, 1e-3
    for _ in range(80):
        m = math.sqrt(lo * hi)
        if esperance_a(65, m, b) > e65:
            lo = m
        else:
            hi = m
    return math.sqrt(lo * hi)


def q_menage(age, a_g, part_couples, b=GOMPERTZ_B):
    """Probabilité annuelle que le ménage s'éteigne (dernier survivant pour un couple de même âge)."""
    def s(x):
        si = _survie_indiv(a_g, x, b)
        return part_couples * (1 - (1 - si) ** 2) + (1 - part_couples) * si
    return 1.0 - s(age + 1) / s(age)


# --- Paramètres ------------------------------------------------------------------------------------------
@dataclass(frozen=True)
class Parametres:
    participation: float = 0.20          # part des assujettis (en nombre) qui choisissent la nue-propriété (HNP10)
    coefficient: float = 0.5             # c : poids d'un bien démembré (nue-propriété publique) dans la base (HNP2)
    seuil_assujetti: float = 500_000.0   # patrimoine net à partir duquel on parle d'« assujetti » (HNP9)
    ratio_comportement: float = 0.567    # recette nette / dû statique de la v7.5 (calage 0,567), appliqué aux deux mondes (HNP4)
    perte_differe: float = 0.05          # part du différé jamais recouvrée (v7.4, central)
    duree_differe: float = 12.0          # recouvrement du différé : 1/12 de l'encours par an (HC1)
    e65: float = 21.6                    # espérance de vie à 65 ans (HNP6)
    part_couples: float = 0.6            # ménages assujettis en couple ; usufruit réversible (HNP7)
    sans_heritier: float = 0.15          # ménages sans descendant (HNP8)
    age_heritier: float = 50.0           # âge à l'héritage (HNP8)
    poids_sans_heritier: float = 3.0     # propension relative de choisir la nue-propriété sans héritier (HNP11)
    poids_illiquide: float = 2.0         # propension : 1 + poids × part productive (titres, biens professionnels) (HNP11)
    rendement_etat: float = 0.02         # revenus distribués d'un bien en pleine propriété publique, par an (HNP14)
    transmissions: bool = True           # compter la perte de la fonction des transmissions (HNP13)
    part_transmissions: float = 0.616    # base imposable / cumul reçu après comportements (1 − 0,30) × (1 − 0,12), chapitre 3 (HNP13)
    heritiers: int = 2                   # enfants par succession (HNP13)
    salaries: float = 0.0                # part des participants de 1 M€ et plus qui cèdent d'emblée leur part productive aux salariés (HNP16)
    duree_usufruit_salaries: int = 30    # usufruit à une personne morale : 30 ans au plus (C. civ., art. 619) (HNP16)
    lignees_par_tranche: int = 3000
    graine: int = GRAINE


SCENARIOS_PARTICIPATION = (0.05, 0.20, 0.50)
SCENARIOS_COEFFICIENT = (0.5, 0.3, 0.1)

# Âge de la personne de référence des assujettis : proxy = part de la masse de patrimoine net par âge
# (Insee HVP 2023-2024 ; sources/patrimoine-generations.md § 1), 70 ans et plus découpés 60/40 (HNP5, ⚠️).
TRANCHES_AGE = ((30, 40, 0.093), (40, 50, 0.139), (50, 60, 0.237), (60, 70, 0.228), (70, 80, 0.182), (80, 95, 0.121))

# Composition par tranche de patrimoine net (Insee Focus n° 371, via taxe_patrimoine.js HVP.tranches et PHI) :
# part productive du patrimoine brut = biens professionnels + φ × financier (HNP15).
COMPOSITION = {          # tranche : (part productive du brut, part des emprunts dans le brut)
    '500-750 k€': (0.05 + 0.12 * 0.18, 0.14),
    '750 k€-1 M€': (0.07 + 0.25 * 0.19, 0.12),
    '1-2 M€': (0.14 + 0.40 * 0.25, 0.10),
    '2-5 M€': (0.25 + 0.475 * 0.26, 0.10),      # à cheval sur P95-P99 et le 1 % : moyenne des deux compositions
    '5-20 M€': (0.36 + 0.55 * 0.27, 0.10),
    '20-100 M€': (0.36 + 0.55 * 0.27, 0.10),
    '> 100 M€': (0.36 + 0.55 * 0.27, 0.10),
}
def capital_productif(tranches):
    """Capital productif (titres, biens professionnels) des assujettis dans le modèle (€) : dénominateur cohérent avec les cessions."""
    return sum(t.n * t.w * t.part_productive for t in tranches)


# Pour mémoire (HNP19) : capital productif détenu par les ménages, fin 2024 (Insee Première n° 2081, comptes de patrimoine) :
# actions et participations hors OPC 1 745 + parts d'OPC 409 + actifs produits des entrepreneurs individuels 39 + 18 + 213 (Md€).
CAPITAL_PRODUCTIF_MENAGES = 1745 + 409 + 39 + 18 + 213


# --- Tranches (lecture des agrégats de la v7.5) ---------------------------------------------------------
@dataclass(frozen=True)
class Tranche:
    nom: str
    n: float            # ménages
    net: float          # patrimoine net moyen (€)
    w: float            # part du patrimoine dans la courbe (€) : net − résidence principale sous 1 M€
    echelle: float      # dû statique moyen / P(w) : impôt plancher, composition (s_k)
    part_differe: float # part différée du dû (règle de paiement de la v7.5)
    part_productive: float  # part productive de la courbe


def tranches_depuis_v75(d, seuil=500_000.0):
    """Construit les tranches assujetties depuis l'extraction de la v7.5 (dict lu par rapport.py)."""
    out = []
    for nom, borne, t in zip(d['noms'], d['bornes'], d['tranches']):
        if borne < seuil or t['n'] <= 0 or t['Pp'] <= 0:
            continue
        n, net = t['n'], t['net'] / t['n']
        rp = min(1e6, t['chargeRP'] / n / 0.00255)
        w = max(1.0, net - rp)
        du = t['Pp'] / n
        prod, emp = COMPOSITION[nom]
        brut = net / (1 - emp)
        part_prod = min(0.95, prod * brut / w)
        out.append(Tranche(nom, n, net, w, du / p_courbe(w), t['differe'] / t['Pp'], part_prod))
    return out


def droits_transmission(estate, p):
    """Fonction des transmissions du système, partagée entre p.heritiers, après comportements (HNP13)."""
    if estate <= 0:
        return 0.0
    part = estate / p.heritiers
    base = ER.ABATTEMENT_SYS + max(0.0, part - ER.ABATTEMENT_SYS) * p.part_transmissions
    return p.heritiers * ER.droits_systeme(base)


# --- Choix de la nue-propriété (HNP10, HNP11) -----------------------------------------------------------
def propension(age, sans_her, part_prod, p):
    """Poids relatif de choisir la nue-propriété : âge (part de nue-propriété, art. 669), absence d'héritier, illiquidité."""
    return (1 - usufruit(age)) * (p.poids_sans_heritier if sans_her else 1.0) * (1 + p.poids_illiquide * part_prod)


def calibrer_lambda(lignees, cible):
    """λ tel que la moyenne pondérée (en nombre de ménages) de min(1, λ × propension) au départ vaille la cible."""
    tot = sum(l['poids'] for l in lignees)
    def part(lam):
        return sum(l['poids'] * min(1.0, lam * l['f']) for l in lignees) / tot
    lo, hi = 0.0, 1e3
    for _ in range(100):
        m = (lo + hi) / 2
        if part(m) < cible:
            lo = m
        else:
            hi = m
    return (lo + hi) / 2


def tirer_lignees(tranches, p):
    """Lignées représentatives (graine fixe) : tranche, âge, absence d'héritier, tirages uniformes réutilisés par tous les scénarios."""
    rng = random.Random(p.graine)
    out = []
    cum = []
    s = 0.0
    for a0, a1, w in TRANCHES_AGE:
        s += w
        cum.append((s, a0, a1))
    for k, t in enumerate(tranches):
        for _ in range(p.lignees_par_tranche):
            x = rng.random() * s
            a0, a1 = next((a0, a1) for c, a0, a1 in cum if x <= c)
            age = a0 + rng.random() * (a1 - a0)
            sh = rng.random() < p.sans_heritier
            # tirages : participation au départ, cession aux salariés, puis pour chaque année : décès, absence d'héritier, participation de l'héritier
            u = [rng.random() for _ in range(3 * HORIZON + 2)]
            out.append({'k': k, 'age': age, 'sh': sh, 'u': u, 'poids': t.n / p.lignees_par_tranche,
                        'f': propension(age, sh, t.part_productive, p)})
    return out


# --- Simulation ------------------------------------------------------------------------------------------
def simuler(tranches, p, lignees=None):
    """Trajectoires annuelles (2029-2088) des écarts au monde de référence (Md€ de 2025 indexés sur le PIB).
    Retour : dict de listes de longueur HORIZON + indicateurs de départ."""
    lignees = lignees if lignees is not None else tirer_lignees(tranches, p)
    lam = calibrer_lambda(lignees, p.participation)
    a_g = calibrer_gompertz(p.e65)
    c, R = p.coefficient, p.ratio_comportement
    H = HORIZON
    z = lambda: [0.0] * H  # noqa: E731
    d_comptant, d_flux, d_trans, cede_np, cede_plein, recup, recup_prod, part_n = z(), z(), z(), z(), z(), z(), z(), z()
    stock_d, stock_d_prod, stock_np_val, stock_etat, stock_etat_prod, stock_sal = z(), z(), z(), z(), z(), z()
    du_ref_part = z()
    n_ass = sum(t.n for t in tranches)
    n_part0 = 0.0
    du_part0 = 0.0
    du_tot0 = sum(t.n * t.echelle * p_courbe(t.w) * R for t in tranches)
    age_part0 = 0.0
    sh_part0 = 0.0
    etat_plein = 0.0          # valeur en pleine propriété publique (cumul, € indexés)
    etat_plein_prod = 0.0
    sal_retours = [0.0] * (H + p.duree_usufruit_salaries + 1)
    sal_retours_prod = [0.0] * (H + p.duree_usufruit_salaries + 1)
    for l in lignees:
        t = tranches[l['k']]
        wgt = l['poids']
        W = t.w
        du_ref = t.echelle * p_courbe(W) * R              # dû de référence (net de comportements), constant
        age, sh = l['age'], l['sh']
        part = l['u'][0] < min(1.0, lam * l['f'])
        if part:
            n_part0 += wgt
            du_part0 += wgt * du_ref
            age_part0 += wgt * age
            sh_part0 += wgt * (1.0 if sh else 0.0)
        X, D, Dnp = W, 0.0, 0.0                             # pleine propriété ; démembré (valeur pleine) ; dont part productive
        if part and p.salaries > 0 and t.net >= 1e6 and l['u'][1] < p.salaries:
            v = t.part_productive * W                       # part productive cédée d'emblée : usufruit aux salariés, nue-propriété à l'État
            X -= v
            sal_retours[p.duree_usufruit_salaries] += wgt * v
            sal_retours_prod[p.duree_usufruit_salaries] += wgt * v
            for i in range(min(H, p.duree_usufruit_salaries)):
                stock_sal[i] += wgt * v
        for i in range(H):
            if part:
                du = t.echelle * p_courbe(X + c * D) * R
                np_share = 1 - usufruit(age)
                v = min(X, du / np_share)
                X -= v
                D += v
                Dnp += v * t.part_productive
                cede_np[i] += wgt * v * np_share
                cede_plein[i] += wgt * v
                part_n[i] += wgt
                du_ref_part[i] += wgt * du_ref
                # monde de référence : comptant (1 − part différée) et flux différé
                d_comptant[i] -= wgt * du_ref * (1 - t.part_differe)
                d_flux[i] -= wgt * du_ref * t.part_differe
            else:
                du = t.echelle * p_courbe(X + c * D) * R    # non participant (éventuellement héritier d'une lignée qui a cédé)
                d_comptant[i] += wgt * (du - du_ref) * (1 - t.part_differe)
                d_flux[i] += wgt * (du - du_ref) * t.part_differe
            stock_d[i] += wgt * D
            stock_d_prod[i] += wgt * Dnp
            stock_np_val[i] += wgt * D * (1 - usufruit(age))
            # décès (dernier survivant)
            if l['u'][2 + 3 * i] < q_menage(age, a_g, p.part_couples):
                if D > 0:
                    recup[i] += wgt * D
                    recup_prod[i] += wgt * Dnp
                    if p.transmissions:
                        d_trans[i] -= wgt * (droits_transmission(X + D, p) - droits_transmission(X, p))
                age = p.age_heritier
                sh = l['u'][3 + 3 * i] < p.sans_heritier
                part = l['u'][4 + 3 * i] < min(1.0, lam * propension(age, sh, t.part_productive, p))
                D, Dnp = 0.0, 0.0
            else:
                age += 1
    for i in range(H):
        etat_plein += recup[i] + sal_retours[i]
        etat_plein_prod += recup_prod[i] + sal_retours_prod[i]
        stock_etat[i] = etat_plein
        stock_etat_prod[i] = etat_plein_prod
    # report d'encaissement (HC1) : l'écart de flux différé se recouvre de 1/12 par an, moins la perte
    d_recouv, d_creance = z(), z()
    st = 0.0
    for i in range(H):
        rec = st / p.duree_differe
        d_recouv[i] = rec * (1 - p.perte_differe)
        st = st - rec + d_flux[i]
        d_creance[i] = st * (1 - p.perte_differe)     # écart d'encours de créances différées (actif de l'État), fin d'année
    revenus_etat = [p.rendement_etat * (stock_etat[i - 1] if i > 0 else 0.0) for i in range(H)]
    md = 1e-9
    tresorerie = [(d_comptant[i] + d_recouv[i] + d_trans[i] + revenus_etat[i]) * md for i in range(H)]
    return {
        'lambda': lam, 'a_gompertz': a_g,
        'assujettis': n_ass, 'participants0': n_part0, 'part_du0': du_part0 / du_tot0,
        'age_moyen_participants0': age_part0 / max(n_part0, 1e-9),
        'part_sans_heritier_participants0': sh_part0 / max(n_part0, 1e-9),
        'du_total0': du_tot0 * md,
        'perte_fonction': [(d_comptant[i] + d_recouv[i]) * md for i in range(H)],
        'perte_transmissions': [d_trans[i] * md for i in range(H)],
        'revenus_etat': [x * md for x in revenus_etat],
        'tresorerie': tresorerie,
        'du_reference_participants': [x * md for x in du_ref_part],
        'cede_np': [x * md for x in cede_np], 'cede_plein': [x * md for x in cede_plein],
        'recupere': [x * md for x in recup], 'recupere_productif': [x * md for x in recup_prod],
        'stock_demembre': [x * md for x in stock_d], 'stock_demembre_productif': [x * md for x in stock_d_prod],
        'valeur_np': [x * md for x in stock_np_val],
        'stock_etat': [x * md for x in stock_etat], 'stock_etat_productif': [x * md for x in stock_etat_prod],
        'stock_salaries': [x * md for x in stock_sal],
        'creances_differees': [x * md for x in d_creance],
        'participants': part_n,
    }


def cumul(xs, n):
    return sum(xs[:n])


def actualise(xs, taux):
    return sum(x / (1 + taux) ** i for i, x in enumerate(xs))


# --- Dette (modèle de taux endogène) --------------------------------------------------------------------
def effet_dette(tresorerie, base_md, eco, g, p_taux, T, annee_fin=2058):
    """Trajectoires de dette (taux endogène) avec et sans le mécanisme. base_md : série du système (Md€ de 2025), déjà stabilisée.
    tresorerie : écart de solde (Md€ de 2025 indexés, liste depuis 2029). Renvoie (référence, scénario)."""
    eff = dict(base_md)
    for i, x in enumerate(tresorerie):
        an = ANNEE0 + i
        if an <= annee_fin:
            eff[an] = base_md.get(an, 0.0) + x
    ref = T.trajectoire(base_md, eco, g, p_taux, annee_fin=annee_fin)
    sc = T.trajectoire(eff, eco, g, p_taux, annee_fin=annee_fin)
    return ref, sc


def dette_md(tr, an, eco, g):
    """Dette en Md€ de 2025 indexés (ratio × PIB de 2025)."""
    return tr[an]['ratio'] * eco['pib0']
