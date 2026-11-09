#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Finances de la foncière pour l'afflux modélisé (modeles/fonciere-afflux/). Fonctions pures.

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Hypothèses H-FA40 à H-FA52 : methode.md.
Réutilise SANS LE MODIFIER modeles/fonciere-usufruit/code/fonciere.py en mode 'forfait' (usufruit = f × transaction,
travaux compris, financé au taux bancaire ; H-FU48), avec les entrants calculés par afflux.agreger : nombre de contrats,
âges, prix moyen, apport moyen (capital de départ + part prêtée par une banque dans le financement mixte). Pour un chemin
d'entrées imposé, modeles/capital-de-depart-options/code/options.simuler_chemin remplace F.entrants le temps d'un appel.
"""
import math
import afflux as A
import fonciere as F    # chemin ajouté par afflux

O = A.O


def params_fonciere(res, reg, sc_fin='central', i=None, suivre_banque=False, **kw):
    """Paramètres de fonciere.simuler pour les entrants `res` (afflux.agreger) et le réglage `reg`.
    Les viagers et les dations sont mis à zéro pour isoler l'afflux des jeunes (H-FA42). i : coût de l'argent ;
    suivre_banque : le taux bancaire (donc le taux des contrats) monte avec le coût de l'argent de la foncière."""
    ages = res['ages_contrats']
    d = dict(redevance='forfait', forfait=reg['f'], taux_banque=reg['taux'], marge=reg['marge'], duree=reg['duree'],
             primo_par_an=res['contrats'], part_cible=1.0, ages=ages, ages_apport=tuple(a for a, _ in ages),
             part_apport=1.0, apport=res['apport_contrat'] + res['banque_contrat'], prix0=res['prix_contrat'],
             montee_ans=10, aide_logement=res['aide_contrat'], viagers_par_an=0.0, dation_md=0.0)
    if i is not None:
        d['i'] = i
        if suivre_banque:
            d['taux_banque'] = reg['taux'] + (i - 0.035)
    d.update(kw)
    return F.params(sc_fin, **d)


def simuler(p, table, chemin=None):
    """fonciere.simuler, éventuellement avec un chemin d'entrées (contrats par an) imposé."""
    return O.simuler_chemin(p, table, chemin)


def bilan(sim):
    """Indicateurs de la foncière : ceux de options.bilan_fonciere, plus le plus bas du ratio sur 30 et 60 ans."""
    b = O.bilan_fonciere(sim)
    b['ratio_min30'] = F.ratio_min(sim, a=30)
    b['ratio_min60'] = F.ratio_min(sim)
    b['etat30'] = sim[29]['etat_md']
    b['besoin_max'] = max(r['besoin_md'] for r in sim[:30])
    b['dette60'] = sim[59]['dette_md']
    b['dette_pib30'] = sim[29]['dette_pib']
    return b


def seuils(p, table, a):
    """Forfait, marge de taux ou livret foncier qui gardent le ratio ventes/coûts > 50 % de l'an 5 à l'an `a`
    (fonciere.seuil_parametre, dichotomie ; None si la borne haute n'y suffit pas)."""
    return dict(forfait=F.seuil_parametre(p, table, 'forfait', p['forfait'], 1.0, a=a),
                marge=F.seuil_parametre(p, table, 'marge', 0.0, 0.08, a=a),
                livret=F.seuil_parametre(p, table, 'livret_max_md', 0.0, 3000.0, a=a))


def surpaiement(res, reg, x):
    """Coût annuel (Md€) d'un surpaiement moyen x du prix : la foncière paie (1 − f) de chaque euro, le jeune f (en
    plus de sa mensualité) ; le capital de départ est fixe."""
    v = res['contrats'] * res['prix_contrat'] * x
    return dict(fonciere_md=v * (1 - reg['f']) / 1e9, jeunes_md=v * reg['f'] / 1e9,
                mensualite=O.U.mensualite(res['prix_contrat'] * x * reg['f'], reg['taux'], reg['duree']))


def regle_reference(sigma, tolerance):
    """Règle « la foncière ne finance que jusqu'à la valeur de référence × (1 + tolérance) » : part des transactions
    honnêtes bloquées (prix réel log-normal autour de la référence, écart-type `sigma`) et surévaluation maximale
    finançable (la tolérance)."""
    from statistics import NormalDist
    return dict(bloquees=1 - NormalDist().cdf(math.log(1 + tolerance) / sigma), max_gonflement=tolerance)
