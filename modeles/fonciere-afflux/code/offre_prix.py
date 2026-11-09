#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Offre des bailleurs sortants et effet net sur les prix (modeles/fonciere-afflux/). Fonctions pures.

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Hypothèses H-FA20 à H-FA35 : methode.md ; valeurs :
donnees/parametres.json. Des ordres de grandeur sous hypothèses, jamais des prédictions.

Lit sans les modifier :
- donnees/parc_dpe_surface.csv (SDES/ONRE : parc locatif privé par classe DPE et par surface au 01/01/2025) ;
- donnees/dpe_classe_surface.csv (flux de DPE ADEME par zone, classe et surface, préparé depuis modeles/loyers-energie) ;
- modeles/loyers-energie/resultats/synthese.csv (part des loyers au-dessus du plafond et baisse par classe et taille,
  scénario central du plafond « énergie comprise », k = 1,2 ; par ville) ;
- modeles/fonciere-usufruit/donnees/secteurs.csv (ventes DVF 2024 par secteur et nombre de pièces).

Trois mondes (demande de l'auteur du 09/11) : (1) réforme locative seule (plafond de loyer + suppression des avantages
fiscaux) ; (2) foncière seule ; (3) les deux. Effet de niveau par an : (demande additionnelle − offre additionnelle)
/ ventes du segment × réponse du prix du secteur (H-FA21), avec diffusion entre tailles (H-FA22).
"""
import csv, math, os

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
MODELES = os.path.dirname(RACINE)
SECT = ('paris', 'metropoles', 'villes_moyennes', 'rural')
SEG = ('T1-T2', 'T3', 'T4+')
CLASSES = 'ABCDEFG'
SURF = ('Moins de 30 m²', 'De 30 à moins de 60 m²', 'De 60 à moins de 100 m²', 'Plus de 100 m²')
# taille de la synthèse de loyers-energie associée à chaque tranche de surface du SDES (H-FA32)
TAILLE_SURF = {'Moins de 30 m²': 'studio', 'De 30 à moins de 60 m²': 'T2', 'De 60 à moins de 100 m²': 'T3', 'Plus de 100 m²': 'T4'}
# segments de prix touchés par une vente de chaque tranche de surface (H-FA32)
SEG_SURF = {'Moins de 30 m²': {'T1-T2': 1.0}, 'De 30 à moins de 60 m²': {'T1-T2': 0.7, 'T3': 0.3},
            'De 60 à moins de 100 m²': {'T3': 0.5, 'T4+': 0.5}, 'Plus de 100 m²': {'T4+': 1.0}}
SEG_TAILLE = {'T2': 'T1-T2', 'T3': 'T3', 'T4': 'T4+'}
# zones des DPE et des plafonds de loyer associées à chaque secteur (H-FA32) : villes témoins, pas des moyennes nationales
ZONES_DPE = {'paris': ('paris',), 'metropoles': ('lyon', 'grenoble'), 'villes_moyennes': ('angers',), 'rural': ('creuse',)}
ZONES_LOYER = {'paris': ('paris',), 'metropoles': ('lyon', 'grenoble'), 'villes_moyennes': ('angers',),
               'rural': ('creuse-appartement', 'creuse-maison')}
DEBUT_INTERDICTION = {'G': 0, 'F': 1, 'E': 7}     # 2027 = année 0 : G interdit depuis 2025, F en 2028, E en 2034


def _lire(chemin):
    with open(chemin, encoding='utf-8') as f:
        return list(csv.DictReader(l for l in f if not l.startswith('#')))


def charger_offre():
    """Charge les données de l'offre (sans calcul)."""
    parc = {}
    for r in _lire(os.path.join(RACINE, 'donnees', 'parc_dpe_surface.csv')):
        if r['rubrique'] == 'Tranche de surface':
            parc[r['modalite']] = {c: float(r[c]) * 1000 for c in CLASSES}
    dpe = _lire(os.path.join(RACINE, 'donnees', 'dpe_classe_surface.csv'))
    synth = {}
    for r in _lire(os.path.join(MODELES, 'loyers-energie', 'resultats', 'synthese.csv')):
        if r['scenario'] != 'central' or r['groupe_type'] != 'classe_taille':
            continue
        cl, ta = r['groupe'].split(' ', 1)
        synth[(r['ville'], cl, ta)] = dict(n=float(r['n']), part=float(r['part_depassant']),
                                          part0=float(r['part_depassant_neutre']), baisse=float(r['baisse_concernes']),
                                          baisse_tous=float(r['baisse_tous']), baisse0=float(r['baisse_neutre']),
                                          marche=float(r['marche_median_moy']))
    return dict(parc=parc, dpe=dpe, synth=synth)


def facteurs_secteur(off, h):
    """Facteur de sur- ou sous-représentation de chaque classe DPE dans chaque secteur, tiré des flux de DPE des villes
    témoins et normalisé pour que la moyenne pondérée par la taille des secteurs vaille 1 (le total national SDES est
    conservé, test)."""
    part = {}
    for s in SECT:
        n = {c: 0.0 for c in CLASSES}
        for r in off['dpe']:
            if r['zone'] in ZONES_DPE[s]:
                n[r['classe']] += float(r['n_dpe'])
        tot = sum(n.values())
        part[s] = {c: n[c] / tot for c in CLASSES}
    ps = h['part_secteur']
    return {s: {c: part[s][c] / sum(ps[k] * part[k][c] for k in SECT) for c in CLASSES} for s in SECT}


def stock(off, h):
    """Parc locatif privé N[secteur][surface][classe] (logements) : SDES national × part du secteur × facteur de classe."""
    fac = facteurs_secteur(off, h)
    tot_parc = sum(sum(v.values()) for v in off['parc'].values())
    k = h['parc_locatif_prive'] / tot_parc
    return {s: {g: {c: off['parc'][g][c] * k * h['part_secteur'][s] * fac[s][c] for c in CLASSES} for g in SURF} for s in SECT}


def stat_plafond(off, s, cl, taille):
    """Part des loyers au-dessus du plafond et baisses (par logement concerné), moyenne des villes témoins du secteur
    pondérée par le nombre de DPE ; None si aucune ville n'a de données."""
    acc, n = {}, 0.0
    for z in ZONES_LOYER[s]:
        r = off['synth'].get((z, cl, taille))
        if r is None and taille == 'T4':
            r = off['synth'].get((z, cl, 'T5+'))
        if r is None or r['n'] < 5:
            continue
        for k, v in r.items():
            acc[k] = acc.get(k, 0.0) + v * r['n']
        n += r['n']
    return {k: v / n for k, v in acc.items()} if n else None


def proba_vente(h, perte_relative):
    """Probabilité de vendre pour une baisse relative du revenu locatif net (règle linéaire H-FA33)."""
    return min(1.0, max(0.0, h['v_vente'] * perte_relative / 0.15))


def ventes_bailleurs(off, h, horizon=30, facteur=1.0):
    """Ventes annuelles supplémentaires des bailleurs, par année, secteur, segment de prix, avec le détail par classe et
    par surface. Trois sources : 'plafond' (plafond de loyer à la relocation, total et part due à l'énergie),
    'niches' (suppression des avantages fiscaux, étalée sur 5 ans), 'interdiction' (droit actuel : ventes des logements
    interdits à la location, que la réforme supprime). `facteur` multiplie toutes les ventes (sensibilité)."""
    N = stock(off, h)
    rho, rn = h['rotation'], h['rendement_net']
    out = []
    for t in range(horizon):
        an = {src: {s: {sg: 0.0 for sg in SEG} for s in SECT} for src in ('plafond', 'plafond_energie', 'niches', 'interdiction')}
        detail = {'classe': {c: 0.0 for c in CLASSES}, 'surface': {g: 0.0 for g in SURF}}
        reloc = rho * (1 - rho) ** t          # part du parc qui connaît sa première relocation sous la règle l'année t
        for s in SECT:
            for g in SURF:
                ta = TAILLE_SURF[g]
                for c in CLASSES:
                    n = N[s][g][c]
                    st = stat_plafond(off, s, c, ta)
                    if st:
                        p = st['part'] * proba_vente(h, st['baisse'] / (st['marche'] * rn))
                        p0 = st['part0'] * proba_vente(h, (st['baisse0'] / st['part0'] if st['part0'] > 0 else 0.0) / (st['marche'] * rn))
                        v = n * reloc * p * facteur
                        ve = max(0.0, n * reloc * (p - p0) * facteur)
                        for sg, w in SEG_SURF[g].items():
                            an['plafond'][s][sg] += v * w
                            an['plafond_energie'][s][sg] += ve * w
                        detail['classe'][c] += v
                        detail['surface'][g] += v
                    if c in DEBUT_INTERDICTION and t >= DEBUT_INTERDICTION[c]:
                        vi = n * rho * (1 - rho) ** (t - DEBUT_INTERDICTION[c]) * h['s_interdiction'] * facteur
                        for sg, w in SEG_SURF[g].items():
                            an['interdiction'][s][sg] += vi * w
        if t < 5:
            for grp, d in h['niches'].items():
                loyer = h['loyer_annuel_niche'][grp]
                p = proba_vente(h, d['avantage_an'] / (loyer * rn))
                for s in SECT:
                    for sg in SEG:
                        an['niches'][s][sg] += d['logements'] * h['niches_retroactif'] * p / 5 * d['repartition_secteur'][s] * d['repartition_taille'][sg] * facteur
        an['detail'] = detail
        out.append(an)
    return out


def offre_nette(v, monde='reforme'):
    """Offre additionnelle par secteur et segment pour une année de ventes_bailleurs : réforme (plafond + niches) moins
    les ventes que l'interdiction aurait provoquées en droit actuel (supprimées par la réforme)."""
    return {s: {sg: v['plafond'][s][sg] + v['niches'][s][sg] - v['interdiction'][s][sg] for sg in SEG} for s in SECT}


def transactions(S, h, dmto=False):
    """Ventes annuelles par secteur et segment (DVF 2024 mis à l'échelle de `transactions`) ; avec suppression des droits
    de mutation, les ventes augmentent de `mu_dmto` (H-FA24)."""
    Q = {}
    for s in SECT:
        d = S[s]
        tot = h['transactions'] * d['part_ventes'] / sum(S[k]['part_ventes'] for k in SECT)
        reste = max(0.0, d['ventes'] - d['n_T2'] - d['n_T3'] - d['n_T4'])
        parts = {'T1-T2': (d['n_T2'] + reste * h['part_rest_T1']) / d['ventes'], 'T3': d['n_T3'] / d['ventes'],
                 'T4+': (d['n_T4'] + reste * (1 - h['part_rest_T1'])) / d['ventes']}
        Q[s] = {sg: tot * parts[sg] * (1 + (h['mu_dmto'] if dmto else 0.0)) for sg in SEG}
    return Q


def demande_fonciere(res, echelle=1.0):
    """Demande additionnelle de la foncière par secteur et segment (contrats additionnels par an), d'après afflux.agreger."""
    D = {s: {sg: 0.0 for sg in SEG} for s in SECT}
    for (s, t), v in res['seg'].items():
        D[s][SEG_TAILLE[t]] += v['add'] * echelle
    return D


def contrats_fonciere(res, echelle=1.0):
    C = {s: {sg: 0.0 for sg in SEG} for s in SECT}
    for (s, t), v in res['seg'].items():
        C[s][SEG_TAILLE[t]] += v['contrats'] * echelle
    return C


def zero():
    return {s: {sg: 0.0 for sg in SEG} for s in SECT}


def effet_prix(D, O_, Q, h, dmto=False):
    """Effet de niveau sur les prix par secteur et segment, et moyenne du secteur pondérée par les ventes.
    x = (demande − offre) / ventes ; diffusion : (1 − σ) x_segment + σ x_secteur ; réponse du secteur × (1 ∓ écart de
    taille) ; suppression des droits de mutation : + κ × taux (capitalisation) en plus, et ventes plus nombreuses."""
    out = {}
    sig, e = h['sigma_substitution'], h['ecart_taille']
    mult = {'T1-T2': 1 - e, 'T3': 1.0, 'T4+': 1 + e}
    for s in SECT:
        qs = sum(Q[s].values())
        xs = sum(D[s][sg] - O_[s][sg] for sg in SEG) / qs
        r = {}
        for sg in SEG:
            x = (D[s][sg] - O_[s][sg]) / Q[s][sg]
            r[sg] = h['reponse_prix'][s] * mult[sg] * ((1 - sig) * x + sig * xs)
            if dmto:
                r[sg] += h['kappa_dmto'] * h['taux_dmto']
        r['moyenne'] = sum(r[sg] * Q[s][sg] for sg in SEG) / qs
        out[s] = r
    return out


def semi_elasticite_taux(h, taux=None, duree=25):
    """Recoupement de la semi-élasticité au taux (H-FA25) : baisse de la capacité d'emprunt à mensualité donnée pour un
    point de taux de plus × élasticité du prix au crédit (Labonne et Welter-Nicol). Nombre négatif (−0,055 = −5,5 %)."""
    r0 = h['taux_banque'] if taux is None else taux
    def K(r):
        i = r / 12
        return (1 - (1 + i) ** (-12 * duree)) / i
    return -h['elasticite_credit'] * (1 - K(r0 + 0.01) / K(r0))


def droits_neutres(D_par_entrant, O_, Q, h, bande=0.02):
    """Réglage « neutre en prix » (demande de l'auteur, 09/11) : nombre de droits ouverts par an et par secteur tel que
    l'effet net moyen du secteur vaille exactement `bande`. D_par_entrant[s][segment] : demande additionnelle par entrant.
    L'effet étant linéaire, droits = (bande − effet de l'offre seule) / effet d'un entrant (jamais négatif ; 0 si le
    secteur n'a pas d'entrants)."""
    eo = effet_prix(zero(), O_, Q, h)
    ed = effet_prix(D_par_entrant, zero(), Q, h)
    return {s: (max(0.0, (bande - eo[s]['moyenne']) / ed[s]['moyenne']) if ed[s]['moyenne'] > 0 else 0.0) for s in SECT}


def capitalisation_dmto(h, valeur_ventes):
    """Gain des vendeurs (Md€ par an) si une part κ de la suppression des droits passe dans les prix, et recette perdue."""
    return dict(gain_vendeurs=h['kappa_dmto'] * h['taux_dmto'] * valeur_ventes / 1e9, recette_perdue=h['recette_dmto_md'])


if __name__ == '__main__':
    print('Module de fonctions : lancer calculer.py')
