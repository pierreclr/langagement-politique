#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""La foncière d'État sur 30 à 60 ans (modeles/fonciere-usufruit/, T81). Fonctions pures.

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Hypothèses H-FU1 à H-FU30 (v1) et H-FU31 à H-FU45 (v2) : methode.md.
v2 (09/11/2026, soir) : marge de la foncière sur le taux des redevances ; contribution sur la résidence principale payée
par l'occupant (au budget public, ou affectée à la foncière en sensibilité) ; prêt familial de la nue-propriété (remboursé
à la succession des parents, indexé sur l'inflation) ; livret foncier ; ouverture par cercles. Avec les réglages par
défaut (marge nulle, contribution au budget, sans prêt familial ni livret, montée linéaire), la v2 reproduit la v1.
Simulation annuelle, en euros courants, restituée en Md€ de 2026 (déflatés par l'inflation).
Année 0 = 2027. Des ordres de grandeur sous hypothèses, jamais des prédictions.

Chaque année t :
  1. entrées : N_t = primo-accessions × part cible × montée en charge ; répartition par âge ; prix_t = prix_0 (1+g)^t ;
  2. le logement vient d'abord du stock rendu (décès) et vacant, sinon d'un achat ; une part des achats sont des passoires
     achetées avec décote et rénovées ;
  3. l'accédant paie l'usufruit (valeur au taux de tarification) : apport éventuel (capital de départ), puis redevance
     mensuelle sur 25 ans au taux de refinancement du moment + marge de la foncière (v2 ; marge nulle en v1) ;
  4. décès (mortalité « réelle » du scénario) : le droit s'éteint, le capital restant dû est abandonné, le logement revient ;
  5. viagers rachetés (nue-propriété payée comptant) et dations en nue-propriété (sans décaissement ; l'État renonce
     à des droits de succession) ;
  6. la foncière se finance à taux variable (circuit du livret A ou obligations courtes) : dette D_t = D_{t-1}(1+i_t) + besoins nets ;
  7. l'État paie la gestion (choix de l'auteur, § 13) et une dotation initiale ; il renonce aux droits payés par dation.
"""
import math
from usufruit import survies, valeur_usufruit, taux_equilibre, mensualite, capital_restant, taux_pour_mensualite, TAUX_CONTRIBUTION_RP

ANNEE0 = 2027
PIB_2025 = 2990.9        # Md€ (banc d'essai, donnees/cache/systeme.json, bloc eco)
G_PIB = 0.03             # croissance nominale du banc

SCENARIOS = {
    # bas = favorable à la foncière ; haut = défavorable (H-FU15 à H-FU27)
    'bas': {'g': 0.030, 'i': 0.025, 'perte': 0.002, 'gestion': 200.0, 'cout_reno': 45000.0, 'amel_reel': 0.010,
            'part_add': 0.3, 'elasticite': 4.0},
    'central': {'g': 0.025, 'i': 0.035, 'perte': 0.005, 'gestion': 300.0, 'cout_reno': 55000.0, 'amel_reel': 0.010,
                'part_add': 0.5, 'elasticite': 2.0},
    'haut': {'g': 0.015, 'i': 0.047, 'perte': 0.010, 'gestion': 400.0, 'cout_reno': 60000.0, 'amel_reel': 0.020,
             'part_add': 0.7, 'elasticite': 1.0},
}

COMMUN = {
    'horizon': 60,
    'primo_par_an': 320000.0,     # H-FU15
    'part_cible': 0.30,           # H-FU16 (10 %, 30 %, 60 %)
    'montee_ans': 10,
    'ages': ((25, 0.45), (35, 0.35), (45, 0.15), (55, 0.05)),   # H-FU17
    'prix0': 220000.0,            # H-FU18, € de 2026
    'pi': 0.02,                   # inflation (H-FU19)
    'duree': 25,
    'part_apport': 0.5,           # part des entrants de 25 ans qui apportent le capital de départ (H-FU20)
    'apport': 40000.0,
    'frais_acq': 0.01,            # émoluments et frais d'acquisition de la foncière, sans droits de mutation (H-FU21)
    'part_passoires': 0.20,       # H-FU22
    'decote_passoire': 0.10,
    'viagers_par_an': 5000.0,     # H-FU23
    'age_viager': 75,
    'dation_md': 0.5,             # Md€ de 2026 de droits payés en nue-propriété chaque année (H-FU24)
    'age_heritier': 55,
    'dotation0': 1.0,             # Md€ (H-FU25)
    'aide_logement': 60.0,        # € par mois et par contrat en moyenne, éteinte après la redevance (H-FU14)
    # Tarification, fixée par la foncière sur ses propres anticipations (H-FU6, H-FU7) :
    'i_prix': 0.035, 'g_prix': 0.025, 'prudence': 0.005, 'amel_prix': 0.010,
    'contrats': 'fixe',           # 'fixe' (la foncière porte le risque de taux) ou 'variable' (répercuté)
    'choc_taux': 0.0, 'choc_debut': 5,   # choc de taux (points) à partir de l'année choc_debut (H-FU27)
    'transactions': 1100000.0,    # ventes de logements par an, anciens et neufs (H-FU28)
    'fonds_propres_np': False,    # variante : l'État apporte en fonds propres la part non couverte par l'usufruit vendu (H-FU30)
    # --- v2 ---
    'redevance': 'marge',         # 'marge' : usufruit actuariel, taux = coût de l'argent + marge (H-FU31) ;
                                  # 'banque' : mensualité d'un prêt bancaire sur (prix - apport) (09/11 ; H-FU46) ;
                                  # 'forfait' : usufruit = `forfait` du prix quel que soit l'âge, au taux bancaire (09/11 ; H-FU48)
    'forfait': 0.70,              # part forfaitaire de la transaction (bien + travaux) vendue comme usufruit (H-FU48)
    'ages_apport': (25,),         # âges d'entrée où une part `part_apport` des entrants apporte le capital de départ
    'taux_banque': 0.0332,        # taux moyen des crédits nouveaux à l'habitat, septembre 2026 (Banque de France ; H-FU46)
    'marge': 0.0,                 # points ajoutés au coût de l'argent dans le taux des redevances (H-FU31)
    'spread': 0.0,                # surcoût de l'argent si la foncière emprunte en son nom, hors APU (H-FU32)
    'contribution': TAUX_CONTRIBUTION_RP,   # contribution sur la résidence principale payée par l'occupant (H-FU33)
    'contribution_affectee': False,          # False : au budget public (base) ; True : affectée à la foncière (sensibilité)
    'part_pret_familial': 0.0,    # part des entrants de 25 ans dont les parents prêtent la nue-propriété (H-FU41)
    'livret_max_md': 0.0,         # encours maximal du livret foncier, Md€ de 2026 (H-FU42)
    'taux_livret': 0.02,          # coût de l'argent du livret foncier, frais compris (H-FU42)
    'montee': 'lineaire',         # 'lineaire' (v1) ou 'cercles' : bâtisseurs, publics prioritaires, tous (H-FU44)
    'batisseurs': 3000.0,         # entrants par an pendant le premier cercle (H-FU44)
    'cercle1_ans': 3,
}


def params(scenario='central', **surcharges):
    p = dict(COMMUN)
    p.update(SCENARIOS[scenario])
    p.update(surcharges)
    return p


def taux_tarif(p):
    """Taux d'actualisation de tarification : équilibre attendu + marge de prudence (H-FU7)."""
    return taux_equilibre(p['i_prix'], p['g_prix']) + p['prudence']


def chemin_taux(p):
    return [p['i'] + (p['choc_taux'] if t >= p['choc_debut'] else 0.0) for t in range(p['horizon'] + 1)]


def entrants(p, t):
    """Entrants de l'année t. Montée linéaire sur `montee_ans` (v1) ; ou par cercles (v2, § 20 de l'esquisse) : bâtisseurs
    seuls pendant `cercle1_ans` ans, puis montée linéaire jusqu'à la part cible à l'année `montee_ans`."""
    cible = p['primo_par_an'] * p['part_cible']
    if p['montee'] == 'cercles':
        if t < p['cercle1_ans']:
            return min(cible, p['batisseurs'])
        f = (t + 1 - p['cercle1_ans']) / max(1, p['montee_ans'] - p['cercle1_ans'])
        return min(cible, p['batisseurs'] + (cible - p['batisseurs']) * min(1.0, f))
    return cible * min(1.0, (t + 1) / p['montee_ans'])


def taux_contrat(p, i_t):
    """Taux des redevances = coût de l'argent de la foncière (taux du moment + écart éventuel) + marge (H-FU31)."""
    return i_t + p['spread'] + p['marge']


def simuler(p, table, surv_parents=None):
    """Simule la foncière. `table` = quotients (liste par âge, ensemble des deux sexes) ; `surv_parents` = survie du couple
    de parents de 55 ans (second décès) pour le prêt familial (par défaut : une tête, table ensemble). Liste de dicts annuels."""
    H, pi, g = p['horizon'], p['pi'], p['g']
    taux = chemin_taux(p)
    r_prix = taux_tarif(p)
    cohortes = []     # dicts : n, surv (réelle), age, debut, solde (fonction), taux, type
    dette, etat_cumul, vacants = 0.0, 0.0, 0.0
    prets_fam = []    # cohortes de prêts familiaux : montant (euros courants de l'année du prêt), début
    if surv_parents is None:
        surv_parents = survies(table, 55, ANNEE0, p['amel_reel'])
    cache_part = {}
    out = []

    def part_usufruit(age, annee):
        cle = (age, annee)
        if cle not in cache_part:
            cache_part[cle] = valeur_usufruit(survies(table, age, annee, p['amel_prix']), r_prix)
        return cache_part[cle]

    for t in range(H):
        an = ANNEE0 + t
        defl = (1 + pi) ** (t + 1)          # euros courants -> euros de 2026
        prix = p['prix0'] * (1 + g) ** (t + 1)
        i_t = taux[t]
        pib = PIB_2025 * (1 + G_PIB) ** (t + 2)

        # --- 1. décès de l'année dans les cohortes existantes, encaissements de redevances ---
        rendus, red_interets, red_principal, abandons, pertes, vivants, encours, aide_evitee = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
        valeur_np = 0.0
        contrib = 0.0
        for c in cohortes:
            k = t - c['debut'] - 1        # année de contrat (les entrées de l'année t paient à partir de t + 1, H-FU26)
            if k + 1 >= len(c['surv']):
                continue
            s0, s1 = c['surv'][k], c['surv'][k + 1]
            n0, n1 = c['n'] * s0, c['n'] * s1
            rendus += n0 - n1
            vivants += n1
            if c['type'] == 'accession':
                contrib += n1 * p['contribution'] * prix      # l'occupant paie comme tout propriétaire (H-FU33)
            if c['type'] == 'accession' and c['finance'] > 0 and k < p['duree']:
                b0 = capital_restant(c['finance'], c['taux'], p['duree'], 12 * k)
                b1 = capital_restant(c['finance'], c['taux'], p['duree'], 12 * (k + 1))
                moyen = (n0 + n1) / 2
                # contrat fixe : intérêts = annuité - amortissement ; contrat variable : taux du moment sur le capital dû
                interet = taux_contrat(p, i_t) * b0 if p['contrats'] == 'variable' else 12 * c['m'] - (b0 - b1)
                red_interets += moyen * interet
                red_principal += moyen * (b0 - b1)
                abandons += (n0 - n1) * b1          # capital restant dû des décédés
                pertes += p['perte'] * n0 * b0
            if c['type'] == 'accession' and k >= p['duree']:
                aide_evitee += n1 * p['aide_logement'] * 12 * (1 + pi) ** (t + 1)

        # --- 2. entrées de l'année ---
        N = entrants(p, t)
        stock = vacants + rendus
        reemplois = min(N, stock)
        achats = N - reemplois
        vacants = stock - reemplois
        nb_pass = achats * p['part_passoires']
        cout_achat = achats * prix * (1 + p['frais_acq']) - nb_pass * p['decote_passoire'] * prix
        cout_reno = nb_pass * p['cout_reno'] * (1 + pi) ** (t + 1)
        apports = 0.0
        valeur_usu_vendue = 0.0
        for age, poids in p['ages']:
            n = N * poids
            part = part_usufruit(age, an)
            nb_apport = n * p['part_apport'] if age in p['ages_apport'] else 0.0
            if age <= 30 and p['part_pret_familial'] > 0:
                # les parents prêtent la nue-propriété du logement (§ 19) ; la foncière la leur doit, indexée, à leur succession
                prets_fam.append({'montant': n * p['part_pret_familial'] * prix * (1 - part), 'debut': t})
            apport = p['apport'] * (1 + pi) ** (t + 1)
            for nb, ap in ((nb_apport, apport), (n - nb_apport, 0.0)):
                if nb <= 0:
                    continue
                if p['redevance'] == 'forfait':
                    # 70 % de la valeur totale de la transaction, travaux de rénovation compris (décision de l'auteur, 09/11) :
                    # valeur moyenne d'une transaction = prix - décote des passoires + coût de leur rénovation
                    transaction = prix * (1 - p['part_passoires'] * p['decote_passoire']) \
                        + p['part_passoires'] * p['cout_reno'] * (1 + pi) ** (t + 1)
                    valeur = p['forfait'] * transaction
                else:
                    valeur = part * prix
                fin = max(0.0, valeur - ap)
                apports += nb * min(ap, valeur)
                valeur_usu_vendue += nb * valeur
                if p['redevance'] == 'banque':
                    # mensualité bancaire sur (prix - apport) ; le taux bancaire suit le taux du moment (choc compris) ;
                    # comptablement, prêt de l'usufruit (fin) au taux implicite qui donne cette mensualité
                    m_c = mensualite(max(0.0, prix - ap), p['taux_banque'] + i_t - p['i'], p['duree'])
                    tc = taux_pour_mensualite(fin, m_c, p['duree'], haut=3.0) if fin > 0 else 0.0
                elif p['redevance'] == 'forfait':
                    tc = p['taux_banque'] + i_t - p['i'] + p['marge']   # « un taux proche de celui des banques » (H-FU48)
                    m_c = mensualite(fin, tc, p['duree'])
                else:
                    tc = taux_contrat(p, i_t)
                    m_c = mensualite(fin, tc, p['duree'])
                cohortes.append({'type': 'accession', 'n': nb, 'age': age, 'debut': t, 'finance': fin, 'taux': tc,
                                 'm': m_c,
                                 'surv': survies(table, age, an, p['amel_reel'])})
        # premier encaissement l'année d'entrée : simplification, les redevances commencent l'année suivante (H-FU26)

        # --- 3. viagers et dations ---
        # par cercles, viagers et dations montent au même rythme que les entrées (sinon ils pèsent seuls les premières années)
        rythme = N / (p['primo_par_an'] * p['part_cible']) if p['montee'] == 'cercles' and p['part_cible'] > 0 else 1.0
        nv = p['viagers_par_an'] * rythme
        part_v = part_usufruit(p['age_viager'], an)
        cout_viager = nv * prix * (1 - part_v)
        cohortes.append({'type': 'viager', 'n': nv, 'age': p['age_viager'], 'debut': t, 'finance': 0.0, 'taux': 0.0,
                         'm': 0.0, 'surv': survies(table, p['age_viager'], an, p['amel_reel'])})
        dation = p['dation_md'] * 1e9 * (1 + pi) ** (t + 1) * rythme
        part_h = part_usufruit(p['age_heritier'], an)
        nd = dation / (prix * (1 - part_h))
        cohortes.append({'type': 'dation', 'n': nd, 'age': p['age_heritier'], 'debut': t, 'finance': 0.0, 'taux': 0.0,
                         'm': 0.0, 'surv': survies(table, p['age_heritier'], an, p['amel_reel'])})

        # --- 4. gestion, payée par l'État ---
        contrats_vivants = vivants + N + nv + nd     # vivants : contrats antérieurs encore en cours en fin d'année
        gestion = contrats_vivants * p['gestion'] * (1 + pi) ** (t + 1)

        # --- 5. dette de la foncière (financement à taux variable) ---
        entrees_fam, remb_fam, index_fam, encours_fam = 0.0, 0.0, 0.0, 0.0
        for pf in prets_fam:
            e_ = t - pf['debut']
            if e_ == 0:
                entrees_fam += pf['montant']
            elif e_ < len(surv_parents):
                avant = pf['montant'] * (1 + pi) ** (e_ - 1) * surv_parents[e_ - 1]
                index_fam += pi * avant
                remb_fam += pf['montant'] * (1 + pi) ** e_ * (surv_parents[e_ - 1] - surv_parents[e_])
            if e_ < len(surv_parents):
                encours_fam += pf['montant'] * (1 + pi) ** e_ * surv_parents[e_]
        # intérêts de la dette de marché ; la part financée par le livret foncier coûte taux_livret (H-FU42)
        cout_marche = i_t + p['spread']
        if dette > 0:
            plafond_livret = p['livret_max_md'] * 1e9 * (1 + pi) ** (t + 1)
            interets_payes = min(dette, plafond_livret) * p['taux_livret'] + max(0.0, dette - plafond_livret) * cout_marche
        else:
            interets_payes = i_t * dette          # trésorerie excédentaire placée au taux du moment (intérêt négatif = recette)
        dotation = p['dotation0'] * 1e9 * (1 + pi) if t == 0 else 0.0
        if p['fonds_propres_np']:
            # l'État apporte chaque année ce que l'usufruit vendu ne finance pas (nue-propriété, rénovation, viagers)
            dotation += max(0.0, cout_achat + cout_reno + cout_viager - valeur_usu_vendue)
        contrib_fonciere = contrib if p['contribution_affectee'] else 0.0
        besoin = cout_achat + cout_reno + cout_viager + interets_payes + pertes \
            - apports - red_interets - red_principal - dotation \
            - contrib_fonciere - entrees_fam + remb_fam
        dette = dette + besoin

        # --- 6. côté État (hors foncière) : gestion, dation (droits non encaissés), dotation, intérêts sur ce cumul ---
        # si la contribution est affectée à la foncière, le budget public la perd (H-FU33)
        etat_cumul = etat_cumul * (1 + i_t) + gestion + dation + dotation - aide_evitee + contrib_fonciere

        # --- 7. bilan de fin d'année : encours des redevances et nue-propriété des logements occupés ---
        for c in cohortes:
            e = t - c['debut']
            if e >= len(c['surv']):
                continue
            n_fin = c['n'] * c['surv'][e]
            if n_fin <= 0:
                continue
            if c['type'] == 'accession':
                encours += n_fin * capital_restant(c['finance'], c['taux'], p['duree'], 12 * e)
            valeur_np += n_fin * prix * (1 - part_usufruit(min(c['age'] + e, 110), an + 1))
        actifs = encours + valeur_np + vacants * prix
        # test des 50 % (H-FU29, H-FU34) : ventes = intérêts des redevances (+ intérêts reçus sur la trésorerie) ;
        # coûts = intérêts payés (marché, livret, indexation du prêt familial) + gestion + impayés
        ventes = red_interets + max(0.0, -interets_payes)
        cout_total = max(0.0, interets_payes) + index_fam + gestion + pertes
        ratio = ventes / cout_total if cout_total > 0 else float('nan')
        # lecture large : la contribution affectée compte comme une vente (redevance contractuelle), ce qui est douteux
        ratio_large = (ventes + contrib_fonciere) / cout_total if cout_total > 0 else float('nan')
        dette_totale = dette + encours_fam

        # borne de l'effet prix (H-FU28) : demande additionnelle / transactions / (élasticités offre + demande)
        dq = N * p['part_add'] / p['transactions']
        effet_prix = dq / p['elasticite']

        out.append({
            'annee': an, 't': t, 'entrants': N, 'achats': achats, 'reemplois': reemplois, 'vacants': vacants,
            'vivants': vivants, 'rendus': rendus,
            'acquisitions_md': (cout_achat + cout_reno + cout_viager) / 1e9 / defl,
            'besoin_md': besoin / 1e9 / defl,
            'dette_md': dette_totale / 1e9 / defl, 'dette_pib': dette_totale / 1e9 / pib,
            'dette_marche_md': dette / 1e9 / defl, 'pret_familial_md': encours_fam / 1e9 / defl,
            'entrees_fam_md': entrees_fam / 1e9 / defl, 'remb_fam_md': remb_fam / 1e9 / defl,
            'contribution_md': contrib / 1e9 / defl, 'contribution_fonciere_md': contrib_fonciere / 1e9 / defl,
            'ventes_md': ventes / 1e9 / defl, 'couts_md': cout_total / 1e9 / defl, 'ratio_large': ratio_large,
            'redevances_md': (red_interets + red_principal) / 1e9 / defl,
            'interets_recus_md': red_interets / 1e9 / defl, 'interets_payes_md': interets_payes / 1e9 / defl,
            'pertes_md': pertes / 1e9 / defl, 'abandons_md': abandons / 1e9 / defl,
            'gestion_md': gestion / 1e9 / defl, 'reno_nette_md': (cout_reno - nb_pass * p['decote_passoire'] * prix) / 1e9 / defl,
            'viager_md': cout_viager / 1e9 / defl, 'dation_md': dation / 1e9 / defl, 'aide_evitee_md': aide_evitee / 1e9 / defl,
            'actifs_md': actifs / 1e9 / defl, 'valeur_np_md': valeur_np / 1e9 / defl, 'encours_md': encours / 1e9 / defl,
            'usufruit_vendu_md': valeur_usu_vendue / 1e9 / defl, 'net_md': (actifs - dette_totale) / 1e9 / defl,
            'parc': vivants + vacants + N + nv + nd,
            'ratio_marchand': ratio,
            'etat_md': etat_cumul / 1e9 / defl, 'etat_pib': etat_cumul / 1e9 / pib,
            'dette_publique_hors_apu_pib': etat_cumul / 1e9 / pib,
            'dette_publique_dans_apu_pib': (etat_cumul + dette_totale) / 1e9 / pib,
            'effet_prix': effet_prix,
        })
    return out


def resume(res, annees=(10, 20, 30, 45, 60)):
    """Extrait les lignes des années t = a - 1 (a-ième année du dispositif)."""
    return {a: res[a - 1] for a in annees if a - 1 < len(res)}


def premiere_annee(res, cle, seuil, sens='>='):
    for r in res:
        if (r[cle] >= seuil) if sens == '>=' else (r[cle] <= seuil):
            return r['annee']
    return None


def max_ratio_sur_3_ans(res, cle='ratio_marchand'):
    """Le test d'Eurostat s'apprécie sur plusieurs années : moyenne glissante sur 3 ans du ratio (H-FU29)."""
    v = [r[cle] for r in res]
    return [sum(v[k - 2:k + 1]) / 3 if k >= 2 else float('nan') for k in range(len(v))]


def ratio_min(res, cle='ratio_marchand', de=5, a=None):
    """Plus bas de la moyenne glissante sur 3 ans du ratio entre les années de dispositif `de` et `a` (incluses).
    Par défaut, le test commence à la 5e année : les premières années de démarrage sont exclues (H-FU34)."""
    v = max_ratio_sur_3_ans(res, cle)
    a = len(v) if a is None else a
    return min(v[k] for k in range(max(2, de - 1), a))


def seuil_parametre(p, table, nom, bas, haut, seuil=0.5, cle='ratio_marchand', de=5, a=None, surv_parents=None):
    """Plus petite valeur du paramètre `nom` dans [bas, haut] pour laquelle le ratio ventes / coûts (moyenne sur 3 ans)
    reste au-dessus de `seuil` de l'année `de` à l'année `a` ; None si même `haut` n'y suffit pas (dichotomie ; ratio
    supposé croissant avec le paramètre, vérifié par test)."""
    def ok(x):
        return ratio_min(simuler(dict(p, **{nom: x}), table, surv_parents), cle, de, a) > seuil
    if ok(bas):
        return bas
    if not ok(haut):
        return None
    for _ in range(14):
        m = (bas + haut) / 2
        if ok(m):
            haut = m
        else:
            bas = m
    return haut


def marge_seuil(p, table, seuil=0.5, cle='ratio_marchand', de=5, a=None, marge_max=0.10, surv_parents=None):
    """Plus petite marge (points de taux) qui garde le ratio au-dessus de `seuil` ; None au-delà de `marge_max`."""
    return seuil_parametre(p, table, 'marge', 0.0, marge_max, seuil, cle, de, a, surv_parents)


if __name__ == '__main__':
    print('Module de fonctions : lancer calculer.py')
    _ = math
