#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Leviers du banc d'essai pour quatre mesures de LFI jusque-là hors des totaux : Smic à 1 700 € net, pension minimale au Smic, blocage des carburants à 1,70 €, nationalisations.
Fonctions pures : aucune lecture de fichier, aucun hasard (les lois sont tirées par moteur.py). Convention : Md€ par an, euros de 2025 (constants), « recette » et « dépense » = (recettes, dépenses) en régime.
Données (grille OpenFisca du Smic, distributions de pensions de la DREES) reçues par `ctx`. Des ordres de grandeur sous hypothèses, jamais des prédictions.
"""
import math
from statistics import NormalDist

N01 = NormalDist()

# ---------------------------------------------------------------- 1. SMIC
SMIC0 = 1801.80      # Smic brut mensuel, euros de 2025 (décret du 1er janvier 2025 ; inchangé jusqu'au 31/12/2025 : Insee/Journal officiel)
T_MAX = 0.3193       # coefficient maximal de la réduction générale (OpenFisca-France 176.1.10, employeur de 50 salariés ou plus)
SORTIE = 1.6         # point de sortie de la réduction générale, en Smic (droit de 2025 dans OpenFisca-France 176.1.10 ; vérifié sur la grille : allègement nul à 1,6 Smic)
POIDS_TYPES = {'seul': 0.40, 'isole1': 0.12, 'couple1_2enf': 0.20, 'couple2': 0.28}   # ⚠️ H-SMIC-TYPES : ordre de grandeur, à vérifier (Insee, DARES)


def reduction_generale(w, smic):
    """Allègement général mensuel (€) pour un salaire brut mensuel w, Smic mensuel `smic` : w x min(T, (T/0,6) x (1,6 Smic / w − 1)), nul au-delà de 1,6 Smic. Reproduit la grille OpenFisca (test)."""
    if w <= 0:
        return 0.0
    c = (T_MAX / 0.6) * (SORTIE * smic / w - 1.0)
    return w * min(T_MAX, max(0.0, c))


def _interp(xs, ys, x):
    if x <= xs[0]:
        return ys[0]
    if x >= xs[-1]:
        return ys[-1]
    for i in range(1, len(xs)):
        if x <= xs[i]:
            return ys[i - 1] + (ys[i] - ys[i - 1]) * (x - xs[i - 1]) / (xs[i] - xs[i - 1])
    return ys[-1]


def recette_hors_allegement(grille, w):
    """Recette publique annuelle (€) par salarié au salaire brut mensuel w, hors allègement : cotisations salariales et patronales, CSG, CRDS, impôt sur le revenu, moins prime d'activité.
    Moyenne des quatre foyers types pondérée par POIDS_TYPES ; le foyer « couple2 » (deux salaires identiques) est ramené à un salarié (moitié du foyer). Grille OpenFisca-France 2025."""
    tot = 0.0
    for t, pw in POIDS_TYPES.items():
        g = grille[t]
        xs = g['salaires']
        f = 0.5 if t == 'couple2' else 1.0
        ys = [f * (-(g['cotisations_salariales'][i] + g['cotisations_employeur'][i] + g['csg_deductible_salaire'][i] + g['csg_imposable_salaire'][i] + g['crds_salaire'][i]) + g['irpp'][i] - g['ppa'][i]) for i in range(len(xs))]
        tot += pw * _interp(xs, ys, w)
    return tot


def taux_patronal(grille, w):
    g = grille['seul']
    return -_interp(g['salaires'], g['cotisations_employeur'], w) / (12.0 * w)


_CACHE = {}
N_PTS = 160
Z_PTS = [N01.inv_cdf((i + 0.5) / N_PTS) for i in range(N_PTS)]
PAS = 4.0


def _table(grille):
    """Tables précalculées (indépendantes des paramètres) : recette hors allègement par pas de 4 € de salaire brut mensuel, et taux patronal."""
    cle = id(grille)
    if cle not in _CACHE:
        w0 = 1700.0
        n = int((3600.0 - w0) / PAS) + 2
        tab = [recette_hors_allegement(grille, w0 + PAS * i) for i in range(n)]
        _CACHE[cle] = (w0, tab, taux_patronal(grille, 2200.0))
    return _CACHE[cle]


def _rec(tab_, w):
    w0, tab, _ = tab_
    x = (w - w0) / PAS
    if x <= 0:
        return tab[0]
    i = int(x)
    if i >= len(tab) - 1:
        return tab[-1]
    return tab[i] + (tab[i + 1] - tab[i]) * (x - i)


def calcul_smic(ctx, p):
    """Effet du Smic à 1 700 € net (euros constants) sur les finances publiques, en régime. Retourne un dictionnaire détaillé (Md€ ; emplois en milliers).
    p : hausse (relative, du Smic en euros constants), mediane (salaire brut mensuel médian en équivalent temps plein du privé), part_smic (part des salariés au Smic), n_prive (millions de salariés), etp (équivalent temps plein / salariés),
        diffusion (part de la hausse transmise aux salaires de 1 à 1,3 Smic), indexation_allegement (part de la hausse du Smic reprise dans la formule des allègements : 1 = droit actuel, 0 = barème gelé en euros), eps (élasticité de l'emploi au coût des salariés concernés, valeur absolue), allocation (€ par an et par emploi perdu),
        part_agents (part de la masse salariale publique concernée), masse_publique (Md€), deja_point (hausse déjà donnée par le point d'indice : 1,10),
        masse_financee (Md€), part_financee (part de cette masse au voisinage du Smic), part_publique (part financée par la dépense publique), pec (milliers de contrats aidés), cout_pec (€ par an), taux_pec (part payée par l'État)."""
    gr = ctx['smic']['grille']
    s0 = SMIC0
    s1 = s0 * (1.0 + p['hausse'])
    ds = s1 - s0
    sig = math.log(p['mediane'] / s0) / N01.inv_cdf(1.0 - p['part_smic'])
    n = N_PTS
    tb = _table(gr)
    n_etp = p['n_prive'] * p['etp'] * 1e6
    sum_rec = sum_masse = sum_rel = sum_cout = 0.0
    sum_alleg = sum_cot = sum_pa_ir = 0.0
    sum_a0 = 0.0
    n_affectes = 0.0
    for i in range(n):
        x = p['mediane'] * math.exp(sig * Z_PTS[i])
        w0 = max(x, s0)
        w1 = max(w0, s1)
        if w0 >= s1:
            w1 = w0 + p['diffusion'] * ds * max(0.0, 1.0 - (w0 - s1) / (0.3 * s1))
        touche = w1 > w0 + 1e-9
        a0 = reduction_generale(w0, s0) * 12.0
        a1 = reduction_generale(w1, s0 + p.get('indexation_allegement', 1.0) * ds) * 12.0
        r0 = _rec(tb, w0)
        r1 = _rec(tb, w1)
        d_rec = (r1 - r0) - (a1 - a0)
        tp = tb[2]
        c0 = w0 * 12.0 * (1.0 + tp) - a0
        c1 = w1 * 12.0 * (1.0 + tp) - a1
        sum_rec += d_rec / n
        sum_alleg += (a1 - a0) / n
        sum_a0 += a0 / n
        sum_masse += (w1 - w0) * 12.0 / n
        sum_cout += (c1 - c0) / n
        if touche:
            sum_rel += (c1 / c0 - 1.0) / n
            n_affectes += 1.0 / n
    d_recettes = sum_rec * n_etp / 1e9                        # recettes nettes (cotisations, CSG, IR, moins prime d'activité, moins hausse des allègements), Md€
    d_allegements = sum_alleg * n_etp / 1e9
    masse_brute = sum_masse * n_etp / 1e9
    cout_prive = sum_cout * n_etp / 1e9                       # coût supplémentaire pour les employeurs privés, net des allègements (non compté dans le solde)
    emplois_perdus = p['eps'] * sum_rel * n_etp               # emplois (ETP)
    # emploi perdu : recette perdue (au nouveau Smic) + allocations de remplacement
    rec_emploi = _rec(tb, s1) - reduction_generale(s1, s0 + p.get('indexation_allegement', 1.0) * ds) * 12.0
    perte_emploi_rec = emplois_perdus * rec_emploi / 1e9
    perte_emploi_alloc = emplois_perdus * p['allocation'] / 1e9
    hausse_agents = (1.0 + p['hausse']) / p['deja_point'] - 1.0
    d_agents = p['masse_publique'] * p['part_agents'] * max(0.0, hausse_agents)
    d_finance = p['masse_financee'] * p['part_financee'] * p['hausse'] * p['part_publique']
    d_pec = p['pec'] * 1e3 * p['cout_pec'] * p['taux_pec'] * p['hausse'] / 1e9
    recettes = d_recettes - perte_emploi_rec
    depenses = d_agents + d_finance + d_pec + perte_emploi_alloc
    return {'recettes': recettes, 'depenses': depenses, 'd_recettes_brut': d_recettes, 'd_allegements': d_allegements, 'masse_brute': masse_brute, 'cout_prive': cout_prive,
            'emplois_perdus_k': emplois_perdus / 1e3, 'perte_emploi_rec': perte_emploi_rec, 'perte_emploi_alloc': perte_emploi_alloc, 'agents': d_agents, 'finance': d_finance, 'pec': d_pec,
            'part_concernee': n_affectes, 'sigma': sig, 'allegement_base': sum_a0 * n_etp / 1e9}


def levier_smic(ctx, p):
    r = calcul_smic(ctx, p)
    return r['recettes'], r['depenses']


# ---------------------------------------------------------------- 2. PENSION MINIMALE
def cout_pension_minimale(ctx, p):
    """Coût annuel (Md€) d'une pension minimale p['seuil'] (net, €/mois de 2025) pour les retraités à carrière complète résidents en France.
    Distribution : DREES, EIR 2020, pension nette totale, carrière complète (tableau 8), tranches de 100 €, ramenée à 2025 par l'homothétie k du modèle des retraites (H3).
    Coût = effectif x part de carrières complètes x Σ part de tranche x max(0, seuil − pension), pension uniforme dans la tranche. Retourne (coût Md€, nombre de bénéficiaires en millions, part des carrières complètes sous le seuil)."""
    d = ctx['pension_min']
    parts = d['parts_nette_cc']
    tot = sum(parts)
    k = d['k']
    s = p['seuil']
    n_cc = d['retraites_dd_millions'] * d['part_residents'] * p['part_cc']          # millions
    cout = 0.0
    part_sous = 0.0
    L = 100.0 * k
    for i, v in enumerate(parts):
        bas = i * L
        pr = v / tot
        if i == len(parts) - 1:
            continue                                                    # tranche ouverte (> 4 500 €) : au-dessus de tout seuil
        haut = bas + L
        if s <= bas:
            continue
        if s >= haut:
            m = s - (bas + haut) / 2.0
            f = 1.0
        else:
            f = (s - bas) / L
            m = (s - bas) / 2.0
        cout += pr * f * m
        part_sous += pr * f
    cout_md = n_cc * 1e6 * cout * 12.0 / 1e9
    return cout_md, n_cc * part_sous, part_sous


def levier_pension_min(ctx, p):
    cout, _, _ = cout_pension_minimale(ctx, p)
    # interaction avec le minimum vieillesse (ASPA) : minimum vieillesse porté au seuil de pauvreté pour les autres retraités, moins l'ASPA économisée pour les carrières complètes relevées
    ova = p['aspa_hausse'] - p['aspa_chevauchement']
    return 0.0, cout + max(ova, -cout)


# ---------------------------------------------------------------- 3. CARBURANTS
def calcul_carburant(p):
    """Coût public annuel (Md€) du blocage du prix à `plafond` € le litre TTC. Volume V (milliards de litres), prix de marché P (€/l TTC, euros de 2025), marge absorbable par les raffineurs et distributeurs m (€/l) :
    la part du blocage absorbée par les marges est privée ; le reste est une compensation publique (hypothèse : l'État compense pour maintenir l'approvisionnement, comme la remise de 2022). La demande réagit au prix bloqué (élasticité e).
    Retourne un dictionnaire (coût public, coût privé, écart au marché, volume)."""
    ecart = max(0.0, p['prix'] - p['plafond'])
    vol = p['volume'] * p['part_plafonnee'] * (1.0 + p['elasticite'] * ecart / max(p['prix'], 1e-9))
    total = vol * ecart
    absorbe = vol * min(ecart, p['marge'])
    public = total - absorbe
    return {'public': public, 'prive': absorbe, 'ecart': ecart, 'volume': vol, 'total': total}


def levier_carburant(ctx, p):
    return 0.0, calcul_carburant(p)['public']


# ---------------------------------------------------------------- 4. NATIONALISATIONS
def prix_nationalisation(p):
    """Prix d'acquisition (Md€) d'une opération : valeur de marché de la part à racheter x (1 + prime d'offre). Pour une valeur non cotée : prix direct."""
    if 'valeur_marche' in p:
        return p['valeur_marche'] * p['part_rachetee'] * (1.0 + p['prime']) + p.get('autres', 0.0)
    return p['prix']


def levier_nationalisation(ctx, p):
    """Flux annuel en régime : dividendes (ou flux net repris) = rendement x prix + flux fixe (pertes reprises, négatif). Retourne (recette, dépense). Le prix est une opération financière (dette, pas déficit) :
    voir moteur.chocs_dette ; la part cédée gratuitement (transfert en capital) est une dépense, voir moteur.ponctuel."""
    prix = prix_nationalisation(p)
    flux = p.get('rendement', 0.0) * prix + p.get('flux', 0.0)
    return (flux, 0.0) if flux >= 0 else (0.0, -flux)
