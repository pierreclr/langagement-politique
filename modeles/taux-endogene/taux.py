#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Taux d'intérêt endogène (modeles/taux-endogene/). Fonctions pures : aucune lecture ni écriture de fichier, aucun hasard.

Taux de marché (OAT à 10 ans) = taux sans risque (Bund à 10 ans) + prime de risque fonction de la dette et du déficit de l'année précédente
(option : terme convexe au-delà d'un seuil de dette ; option : plafond de prime « TPI » sous condition d'éligibilité).
Taux apparent de la dette : converge vers le coût d'émission par renouvellement d'une part du stock chaque année, et la dette nouvelle est émise au coût du marché.
Boucle : dette -> prime -> taux -> intérêts -> déficit -> dette.

Conventions reprises du banc d'essai (modeles/banc-programmes/moteur.py, `trajectoire_dette`) : Md€ de 2025 pour les effets (un montant suit le PIB nominal),
dette nominale, dette de départ fin 2025, solde primaire du droit actuel = celui de 2024 maintenu en part du PIB. Hypothèses : methode.md (H-TE1 à H-TE16).
Des ordres de grandeur sous hypothèses, jamais des prédictions.
"""

ANNEE_BASE = 2025       # dette de départ : fin 2025 (Insee)
ANCRE = 2026            # année d'ancrage de la prime : l'état simulé fin 2026 est celui où la prime observée s'applique (H-TE4)
ANNEE_FIN = 2058
PB = 1e-4               # un point de base
SEUIL_CRISE = 0.03      # prime au-delà de laquelle on parle de « zone de crise » (H-TE12)

# Scénarios de paramètres (bas = favorable à la dette, haut = défavorable). Unités : fractions (0.034 = 3,4 %) ; sensibilités en points de base (pb).
SCENARIOS = {
    'bas': {
        'r_sf': 0.029, 'prime0': 0.008, 'taux_2026': 0.039,
        'a_dette_pb': 1.0, 'a_deficit_pb': 0.0, 'gamma_pb': 0.0, 'seuil': 1.40,
        'ecart_emission': -0.004, 'renouvellement': 0.118,
    },
    'central': {
        'r_sf': 0.034, 'prime0': 0.013, 'taux_2026': 0.039,
        'a_dette_pb': 2.0, 'a_deficit_pb': 10.0, 'gamma_pb': 0.03, 'seuil': 1.30,
        'ecart_emission': -0.002, 'renouvellement': 0.13,
    },
    'haut': {
        'r_sf': 0.039, 'prime0': 0.017, 'taux_2026': 0.039,
        'a_dette_pb': 4.0, 'a_deficit_pb': 25.0, 'gamma_pb': 0.09, 'seuil': 1.20,
        'ecart_emission': 0.0, 'renouvellement': 0.14,
    },
}
# Options communes (désactivées par défaut)
OPTIONS = {
    'mode': 'stock',          # 'stock' (renouvellement d'une part du stock + dette nouvelle au marché) ou 'banc' (récursion du banc : ieff += (r - ieff) / durée)
    'duree': 8,               # mode 'banc' seulement
    'tpi': None,              # plafond de prime si éligible (ex. 0.0175), sinon None
    'plafond_prime': 0.15,    # garde-fou numérique : au-delà, le modèle ne décrit plus rien (crise, restructuration, programme d'aide)
    'multiplicateur': 0.0,    # effet de la consolidation sur l'activité (0 = statique, comme le tableau principal du banc)
    'persistance': 0.5,       # persistance de l'écart de production
    'taux_retour': 0.45,      # part du PIB perdu qui manque en recettes (moteur.TAUX_RETOUR)
    'endogene': True,         # False : taux de marché fixé à r_sf + prime0 (recalage exogène, sans boucle)
}


def params(scenario='central', **surcharges):
    """Dictionnaire de paramètres : scénario + options communes + surcharges éventuelles."""
    p = dict(OPTIONS)
    p.update(SCENARIOS[scenario])
    p.update(surcharges)
    return p


def convexe(d, seuil):
    """Terme non linéaire : (max(0, d - seuil))², d et seuil en part du PIB (1.2 = 120 %), résultat en points de PIB au carré."""
    x = max(0.0, d - seuil) * 100.0
    return x * x


def prime_fondamentale(d, deficit, ancre, p):
    """Prime de risque (fraction) pour une dette d et un déficit total (parts du PIB) de l'année précédente.
    Ancrée : vaut p['prime0'] à l'état d'ancrage ancre = (d0, def0) ; varie de a_dette pb par point de dette, de a_deficit pb par point de déficit, plus gamma pb par point² au-delà du seuil.
    Plancher à 0, plafond p['plafond_prime']."""
    d0, def0 = ancre
    x = p['prime0'] + PB * (p['a_dette_pb'] * (d - d0) * 100.0 + p['a_deficit_pb'] * (deficit - def0) * 100.0
                            + p['gamma_pb'] * (convexe(d, p['seuil']) - convexe(d0, p['seuil'])))
    return min(max(0.0, x), p['plafond_prime'])


def eligible_tpi(deficit, deficit_prec):
    """Éligibilité stylisée à l'instrument de protection de la transmission (TPI, BCE, 21/07/2022) : déficit ≤ 3 % du PIB, ou en baisse d'au moins 0,4 point sur un an
    (lecture de « ne pas avoir manqué d'agir » dans une procédure pour déficit excessif ; H-TE11, stylisation, le TPI est discrétionnaire)."""
    if deficit <= 0.03 + 1e-12:
        return True
    return deficit_prec is not None and (deficit_prec - deficit) >= 0.004 - 1e-12


def prime(d, deficit, deficit_prec, ancre, p):
    """Prime effective : prime fondamentale, plafonnée par le TPI si l'option est active et le pays éligible."""
    x = prime_fondamentale(d, deficit, ancre, p)
    if p.get('tpi') is not None and eligible_tpi(deficit, deficit_prec):
        x = min(x, p['tpi'])
    return x


def effort_md(effort, debut=2028, regime=2032, annee_fin=ANNEE_FIN):
    """Série d'amélioration du solde primaire (Md€ de 2025) par rapport au droit actuel : montée linéaire de `debut` à `regime`, puis constante (donc constante en part du PIB)."""
    n = regime - debut + 1
    return {an: effort * min(1.0, (an - debut + 1) / n) for an in range(debut, annee_fin + 1)}


def trajectoire(effet_md, eco, g, p, annee_fin=ANNEE_FIN, chocs=None):
    """Trajectoire de la dette avec taux endogène.
    effet_md : dict année -> amélioration du solde primaire (Md€ de 2025) par rapport au droit actuel ; eco : paramètres du banc (dette0, pib0, interets0, deficit2024) ;
    g : croissance nominale ; p : params() ; chocs : dict année -> variation de dette hors déficit (Md€ de 2025, nationalisations).
    Retourne {année: {ratio, deficit_pct, interets_pct, primaire_pct, r_marche, prime, i_apparent, ecart_prod}}."""
    chocs = chocs or {}
    D = eco['dette0']
    Y0 = eco['pib0']
    C = eco['interets0']                     # masse de coupons (i_apparent x dette), Md€ courants
    ieff = C / D
    base_primaire = -(eco['deficit2024'] - eco['interets0'])
    s = p['renouvellement']
    gap = 0.0
    e_prec = 0.0
    d_prec = D / Y0
    def_prec = def_prec2 = None
    ancre = None
    out = {}
    for an in range(ANNEE_BASE + 1, annee_fin + 1):
        kk = (1 + g) ** (an - ANNEE_BASE)
        Ypot = Y0 * kk
        # 1. taux de marché de l'année (état de fin d'année précédente)
        if an <= ANCRE:
            pr = None
            rm = p['taux_2026']
        elif not p['endogene']:
            pr = p['prime0']
            rm = p['r_sf'] + pr
        else:
            pr = prime(d_prec, def_prec, def_prec2, ancre, p)
            rm = p['r_sf'] + pr
        rem = rm + p['ecart_emission']
        # 2. activité (option multiplicateur) et solde primaire
        e = effet_md.get(an, 0.0)
        gap = p['persistance'] * gap - p['multiplicateur'] * (e - e_prec) / Y0
        e_prec = e
        Y = Ypot * (1 + gap)
        pb = (base_primaire + e) * kk + p['taux_retour'] * gap * Ypot
        choc = chocs.get(an, 0.0) * kk
        # 3. intérêts
        if p['mode'] == 'banc':
            ieff = ieff + (rem - ieff) / p['duree']
            interets = ieff * D
        else:
            C = (1 - s) * C + s * rem * D
            interets = C
        D_new = D - (pb - interets) + choc
        if p['mode'] != 'banc':
            net = D_new - D
            C = C + rem * net if net >= 0 else C * D_new / D
            ieff = C / D_new
        ratio = D_new / Y
        deficit = (D_new - D - choc) / Y
        out[an] = {'ratio': ratio, 'deficit_pct': deficit, 'interets_pct': interets / Y, 'primaire_pct': pb / Y, 'r_marche': rm,
                   'prime': pr, 'i_apparent': interets / D, 'ecart_prod': gap}
        if an == ANCRE:
            ancre = (ratio, deficit)
        def_prec2, def_prec = def_prec, deficit
        d_prec = ratio
        D = D_new
    return out


def annee_crise(tr, seuil=SEUIL_CRISE):
    """Première année où la prime dépasse le seuil de crise (None sinon)."""
    for an in sorted(tr):
        if tr[an]['prime'] is not None and tr[an]['prime'] > seuil:
            return an
    return None


def effort_stabilisant(eco, g, p, annee=2038, horizon=2058, pas=1.0, maxi=400.0, **kw):
    """Plus petit effort constant (Md€ de 2025, montée 2028-2032) tel que la dette / PIB ne monte plus entre `annee` et `horizon` (à 0,1 point près). None si introuvable sous `maxi`."""
    e = 0.0
    while e <= maxi:
        tr = trajectoire(effort_md(e, **kw), eco, g, p)
        if max(tr[a]['ratio'] for a in range(annee, horizon + 1)) <= tr[annee]['ratio'] + 0.001:
            return e
        e += pas
    return None


def effort_supplementaire(base_md, eco, g, p, chocs=None, annee=2038, horizon=2058, pas=1.0, maxi=400.0, debut=2028, regime=2032):
    """Plus petit effort supplémentaire constant (Md€ de 2025, montée de `debut` à `regime`), ajouté à la série `base_md` d'un programme, qui empêche la dette / PIB de monter
    entre `annee` et `horizon` (à 0,1 point près). Retourne 0 si le programme seul suffit, None si introuvable sous `maxi`."""
    e = 0.0
    while e <= maxi:
        sup = effort_md(e, debut, regime)
        eff = {an: base_md.get(an, 0.0) + sup.get(an, 0.0) for an in set(base_md) | set(sup)}
        tr = trajectoire(eff, eco, g, p, chocs=chocs)
        if max(tr[a]['ratio'] for a in range(annee, horizon + 1)) <= tr[annee]['ratio'] + 0.001:
            return e
        e += pas
    return None
