#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Leviers du banc d'essai propres au programme du Rassemblement national : impôt sur la fortune financière (IFF, en remplacement de l'IFI) et exonération d'impôt sur le revenu des actifs de moins de 30 ans.
Fonctions pures : aucune lecture de fichier, aucun hasard. Convention : Md€ par an, euros de 2025 ; retour = (recettes, dépenses) en régime. Ordres de grandeur sous hypothèses, jamais des prédictions.
"""
import math
from statistics import NormalDist

N01 = NormalDist()
SMIC_BRUT_MENSUEL = 1802.0     # Smic brut mensuel de la grille OpenFisca (2025)


def levier_iff(ctx, p, z):
    """IFF (impôt sur la fortune financière) remplaçant l'IFI. Hypothèse d'interprétation : barème « sobre » de notre module d'ISF (seuil 1,3 M€ par foyer, 0,8 / 1,5 / 1,5 %) appliqué à la seule part financière
    (p['part_fin']) du patrimoine imposable, avec l'érosion et l'exil du module ; l'IFI actuel (ctx['ifi_actuel']) disparaît. Retourne (recette nette de l'IFI supprimé, 0)."""
    from moteur import trois_scenarios
    s = ctx['systeme']
    sobre = trois_scenarios([x['recette'] for x in s['isf']['sobre']], z)
    return p['part_fin'] * sobre - ctx['ifi_actuel'], 0.0


def ir_seul(grille, w):
    """IR annuel (€) d'un salarié seul au salaire brut mensuel w : interpolation linéaire sur la grille OpenFisca-France."""
    xs, ys = grille['salaires'], grille['irpp_seul']
    if w <= xs[0]:
        return ys[0]
    if w >= xs[-1]:
        return ys[-1]
    for i in range(len(xs) - 1):
        if w <= xs[i + 1]:
            return ys[i] + (ys[i + 1] - ys[i]) * (w - xs[i]) / (xs[i + 1] - xs[i])
    return ys[-1]


def ir_moyen_jeunes(grille, mediane_smic, sigma, plafond_smic=4.0, n=400):
    """IR moyen par jeune salarié (€ par an) exonéré : salaires lognormaux (médiane en multiples du Smic, écart-type log sigma), plancher au Smic, IR de la grille OpenFisca pour les salaires jusqu'à `plafond_smic` Smic."""
    tot = 0.0
    for k in range(n):
        w = max(SMIC_BRUT_MENSUEL * mediane_smic * math.exp(sigma * N01.inv_cdf((k + 0.5) / n)), SMIC_BRUT_MENSUEL)
        if w <= plafond_smic * SMIC_BRUT_MENSUEL:
            tot += ir_seul(grille, w)
    return tot / n


def levier_ir_jeunes(ctx, p):
    """Exonération d'IR des actifs de moins de 30 ans jusqu'à 4 Smic : coût = effectif x IR moyen (grille OpenFisca, foyers de salariés seuls). p : n_jeunes (salariés de moins de 30 ans, en équivalents temps plein),
    mediane_smic, sigma. Retourne (0, coût en Md€)."""
    ir = ir_moyen_jeunes(ctx['rn_openfisca'], p['mediane_smic'], p['sigma'])
    return 0.0, p['n_jeunes'] * ir / 1e9
