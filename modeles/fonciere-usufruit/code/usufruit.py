#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Le contrat individuel d'accession à l'usufruit à vie (modeles/fonciere-usufruit/, T81). Fonctions pures.

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Hypothèses H-FU1 à H-FU30 (v1) et H-FU31 à H-FU45 (v2) : methode.md.
Aucune lecture ni écriture de fichier, aucun hasard. Les tables de mortalité sont passées en argument
(listes de quotients annuels, fraction, indexées par l'âge), lues par calculer.py dans
donnees/table_mortalite_insee.csv (Insee, table triennale 2023-2025).
Des ordres de grandeur sous hypothèses, jamais des prédictions.
"""
import math

AGE_MAX = 120
ANNEE_TABLE = 2024          # année centrale de la table 2023-2025 (H-FU3)

# CGI, art. 669, I (Légifrance, version en vigueur au 09/11/2026) : (âge strictement inférieur à, part de l'usufruit)
BAREME_669 = ((21, 0.90), (31, 0.80), (41, 0.70), (51, 0.60), (61, 0.50), (71, 0.40), (81, 0.30), (91, 0.20), (999, 0.10))


def lire_table(lignes):
    """Lignes du CSV (dictionnaires) -> {'ensemble'|'femmes'|'hommes': [q_0, q_1, ...]} (quotients en fraction).
    Au-delà du dernier âge publié, on prolonge par le dernier quotient (fermeture de la table, H-FU3)."""
    cols = {'ensemble': 'quotient_ensemble_pour_100000', 'femmes': 'quotient_femmes', 'hommes': 'quotient_hommes'}
    out = {}
    for k, c in cols.items():
        q = [float(l[c]) / 1e5 for l in lignes]
        q += [q[-1]] * (AGE_MAX + 1 - len(q))
        out[k] = q
    return out


def quotient(q, age, annee, amelioration):
    """Quotient de mortalité à l'âge `age` l'année `annee`, avec une baisse annuelle `amelioration` depuis la table (H-FU4)."""
    if age >= AGE_MAX:
        return 1.0
    return min(1.0, q[min(age, len(q) - 1)] * (1.0 - amelioration) ** max(0, annee - ANNEE_TABLE))


def survies(q, age, annee, amelioration, horizon=None):
    """[S_0 = 1, S_1, ...] : probabilité d'être en vie au début de chaque année du contrat (S_k), jusqu'à l'âge maximal."""
    n = (AGE_MAX - age) if horizon is None else horizon
    s, out = 1.0, [1.0]
    for k in range(n):
        s *= 1.0 - quotient(q, age + k, annee + k, amelioration)
        out.append(s)
    return out


def survies_couple(q1, age1, q2, age2, annee, amelioration):
    """Droit réversible : le contrat court jusqu'au second décès. P(au moins un vivant) = 1 - (1 - S1)(1 - S2)."""
    s1 = survies(q1, age1, annee, amelioration)
    s2 = survies(q2, age2, annee, amelioration)
    n = max(len(s1), len(s2))
    s1 += [0.0] * (n - len(s1))
    s2 += [0.0] * (n - len(s2))
    return [1 - (1 - a) * (1 - b) for a, b in zip(s1, s2)]


def esperance(surv):
    """Durée de vie restante moyenne (années), décès supposés en milieu d'année."""
    return sum((surv[k] + surv[k + 1]) / 2 for k in range(len(surv) - 1))


def valeur_usufruit(surv, taux):
    """Part de la pleine propriété que vaut un usufruit qui dure tant que `surv` > 0, actualisé au taux réel net `taux`.
    Nue-propriété = E[v^T] (le bien revient au décès, T en milieu d'année) ; usufruit = 1 - nue-propriété (H-FU5)."""
    v = 1.0 / (1.0 + taux)
    np_ = sum((surv[k] - surv[k + 1]) * v ** (k + 0.5) for k in range(len(surv) - 1))
    np_ += surv[-1] * v ** (len(surv) - 1)
    return 1.0 - np_


def valeur_usufruit_deterministe(esperance_vie, taux):
    """Version simplifiée de l'esquisse (§ 4) : 1 - (1 + taux)^-e."""
    return 1.0 - (1.0 + taux) ** -esperance_vie


def bareme_fiscal(age):
    """Part de l'usufruit selon le barème de l'article 669 du CGI."""
    for borne, part in BAREME_669:
        if age < borne:
            return part
    return 0.10


def taux_equilibre(taux_financement, croissance_prix):
    """Taux d'actualisation qui équilibre la foncière en moyenne : porter la nue-propriété au coût de l'argent
    coûte (1+i)^T ; le bien rendu vaut (1+g)^T ; équilibre si r = (1+i)/(1+g) - 1 (H-FU6)."""
    return (1.0 + taux_financement) / (1.0 + croissance_prix) - 1.0


def mensualite(capital, taux_annuel, annees):
    """Mensualité d'un prêt amortissable (convention bancaire française : taux mensuel = taux annuel / 12)."""
    if capital <= 0:
        return 0.0
    n = int(round(annees * 12))
    if taux_annuel == 0:
        return capital / n
    r = taux_annuel / 12.0
    return capital * r / (1.0 - (1.0 + r) ** -n)


def capital_restant(capital, taux_annuel, annees, mois_ecoules):
    """Capital restant dû après `mois_ecoules` mensualités."""
    if capital <= 0:
        return 0.0
    n = int(round(annees * 12))
    if mois_ecoules >= n:
        return 0.0
    if taux_annuel == 0:
        return capital * (1 - mois_ecoules / n)
    r = taux_annuel / 12.0
    m = mensualite(capital, taux_annuel, annees)
    return capital * (1 + r) ** mois_ecoules - m * ((1 + r) ** mois_ecoules - 1) / r


def capital_empruntable(mensualite_max, taux_annuel, annees):
    """Inverse de `mensualite` : capital que rembourse une mensualité donnée."""
    if mensualite_max <= 0:
        return 0.0
    n = int(round(annees * 12))
    if taux_annuel == 0:
        return mensualite_max * n
    r = taux_annuel / 12.0
    return mensualite_max * (1.0 - (1.0 + r) ** -n) / r


def echeancier(capital, chemin_taux, duree, mode='fixe', plafond=None, duree_max=35):
    """Simule un contrat face à un chemin de taux annuels (chemin_taux[a] = taux de refinancement de l'année a du contrat).

    Modes (§ 13-14 de l'esquisse, H-FU12) :
      'fixe'        : taux de l'année 0 pour toute la durée ; la foncière porte le risque.
      'variable'    : chaque année, taux = min(chemin[a], taux0 + plafond) (plafond None = sans plafond) ;
                      mensualité recalculée sur la durée restante.
      'allongement' : mensualité gardée au niveau initial ; le taux suit le marché ; la durée s'allonge ;
                      si la durée atteindrait duree_max, la mensualité monte juste assez pour finir à duree_max.
    Renvoie {'mensualites': [mensualité de chaque année], 'duree': années effectives, 'total': somme payée}."""
    if capital <= 0:
        return {'mensualites': [], 'duree': 0.0, 'total': 0.0, 'mensualite_max': 0.0}
    t0 = chemin_taux[0]
    m0 = mensualite(capital, t0, duree)
    solde, mois, total, par_an = capital, 0, 0.0, []
    while solde > 1e-6 and mois < duree_max * 12 + 1200:
        a = mois // 12
        taux_marche = chemin_taux[min(a, len(chemin_taux) - 1)]
        if mode == 'fixe':
            t = t0
        elif mode == 'variable':
            t = taux_marche if plafond is None else min(taux_marche, t0 + plafond)
        else:
            t = taux_marche
        if mois % 12 == 0:
            if mode == 'fixe':
                m = m0
            elif mode == 'variable':
                reste = max(1, duree * 12 - mois)
                m = mensualite(solde, t, reste / 12) if reste > 0 else solde
            else:  # allongement
                reste_max = max(1, duree_max * 12 - mois)
                m = max(m0, mensualite(solde, t, reste_max / 12))
            par_an.append(m)
        interet = solde * t / 12.0
        paiement = min(m, solde + interet)
        solde = solde + interet - paiement
        total += paiement
        mois += 1
    return {'mensualites': par_an, 'duree': mois / 12.0, 'total': total, 'mensualite_max': max(par_an)}


def contrat(prix, surv, taux_prix, taux_contrat, duree=25, apport=0.0):
    """Un contrat type : part de l'usufruit, montant financé, mensualité, coût total (hors charges et taxe foncière)."""
    part = valeur_usufruit(surv, taux_prix)
    valeur = part * prix
    finance = max(0.0, valeur - apport)
    m = mensualite(finance, taux_contrat, duree)
    return {'part_usufruit': part, 'valeur_usufruit': valeur, 'apport': min(apport, valeur), 'finance': finance,
            'mensualite': m, 'duree': duree if finance > 0 else 0, 'total_paye': m * 12 * duree + min(apport, valeur),
            'interets': m * 12 * duree - finance}


def aide_eteinte(aide_mensuelle, surv, duree):
    """Mois d'aide au logement évités après la fin de la redevance (espérance), si l'aide s'éteint une fois le droit
    remboursé (H-FU14) : aide × 12 × somme des probabilités de survie au-delà de la durée. Euros constants, non actualisés."""
    return aide_mensuelle * 12 * sum((surv[k] + surv[k + 1]) / 2 for k in range(duree, len(surv) - 1))


# ---------------------------------------------------------------------------------------------------------------
# v2 (09/11/2026, soir) : marge de la foncière, contribution sur la résidence principale, taux par secteur,
# prêt familial. Hypothèses H-FU31 à H-FU45 (methode.md, § 6).
# ---------------------------------------------------------------------------------------------------------------

TAUX_CONTRIBUTION_RP = 0.0025      # contribution sur la résidence principale (chapitres-v02/03-contribuer.md), H-FU33
PLAFOND_CONTRIBUTION_RP = 1e6


def contribution_rp(valeur, taux=TAUX_CONTRIBUTION_RP, plafond=PLAFOND_CONTRIBUTION_RP):
    """Contribution annuelle sur la résidence principale : 0,25 % × min(valeur, 1 M€). Payée par l'occupant dès l'accession,
    comme tout propriétaire, même pendant la redevance (décision de l'auteur, 09/11)."""
    return taux * min(max(valeur, 0.0), plafond)


def taux_pour_mensualite(capital, mensualite_cible, annees, bas=-0.10, haut=1.0):
    """Taux annuel qui fait qu'un prêt de `capital` sur `annees` coûte `mensualite_cible` par mois (dichotomie).
    Un taux négatif signifie une subvention. None si la cible est hors de [bas, haut]."""
    if capital <= 0 or mensualite_cible <= 0:
        return None
    if not (mensualite(capital, bas, annees) <= mensualite_cible <= mensualite(capital, haut, annees)):
        return None
    for _ in range(100):
        m = (bas + haut) / 2
        if mensualite(capital, m, annees) < mensualite_cible:
            bas = m
        else:
            haut = m
    return (bas + haut) / 2


def duree_pour_mensualite(capital, taux_annuel, mensualite_cible):
    """Durée (années) pour rembourser `capital` avec une mensualité donnée ; None si la mensualité ne couvre pas les intérêts."""
    if capital <= 0:
        return 0.0
    r = taux_annuel / 12.0
    if r == 0:
        return capital / mensualite_cible / 12.0
    if mensualite_cible <= capital * r:
        return None
    return -math.log(1 - capital * r / mensualite_cible) / math.log(1 + r) / 12.0


def pret_familial(montant, surv_parents, inflation, taux_marche):
    """Prêt de la nue-propriété par les parents, remboursé à leur succession (second décès), indexé sur l'inflation (§ 19).
    Renvoie la durée moyenne, la somme espérée versée (euros courants) et le gain espéré pour la foncière, en valeur actuelle
    au taux de marché, par rapport à un emprunt de marché du même montant : montant − E[montant (1+π)^T / (1+i)^T]."""
    duree, verse, va = 0.0, 0.0, 0.0
    for k in range(len(surv_parents) - 1):
        d = surv_parents[k] - surv_parents[k + 1]
        T = k + 0.5
        duree += d * T
        verse += d * montant * (1 + inflation) ** T
        va += d * montant * ((1 + inflation) / (1 + taux_marche)) ** T
    T = len(surv_parents) - 1
    duree += surv_parents[-1] * T
    verse += surv_parents[-1] * montant * (1 + inflation) ** T
    va += surv_parents[-1] * montant * ((1 + inflation) / (1 + taux_marche)) ** T
    return {'duree_moyenne': duree, 'verse': verse, 'gain_foncière': montant - va}
