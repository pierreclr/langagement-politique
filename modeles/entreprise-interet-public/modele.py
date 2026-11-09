#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Entreprise d'intérêt public et « pari » (modeles/entreprise-interet-public/). Fonctions pures : aucune lecture ni écriture de fichier, aucun hasard.

Une holding publique à capital commun et quatre pôles (calcul et IA ; petits réacteurs ; robotique des métiers dangereux ; objets du quotidien réparables).
Chaque pôle lance n projets en parallèle, financés par tranches : une tranche 1 (petite équipe), une tranche 2 (démonstrateur) réservée aux projets qui ont
passé le premier jalon (probabilité p1), puis un déploiement en série si au moins un projet passe le second jalon (probabilité p2). Le modèle calcule des
**espérances** (moyennes pondérées par les probabilités de réussite), en Md€ de 2025, de 2029 (année 1 du système) à 2058.
Hypothèses numérotées H-EIP1 à H-EIP24 : methode.md. Des ordres de grandeur sous hypothèses, jamais des prédictions.
"""
import math

AN0 = 2029            # première année du pari (année 1 de notre système dans le banc)
AN_FIN = 2058         # 30 ans
SCENARIOS = ('prudent', 'central', 'ambitieux')
POLES = ('calcul', 'atome', 'robotique', 'objets')
NOMS = {'calcul': 'Calcul et IA', 'atome': 'Énergie atomique (petits réacteurs)', 'robotique': 'Robotique des métiers dangereux (humanoïde, agricole, forestière)',
        'objets': 'Objets du quotidien réparables'}

# --------------------------------------------------------------------------------------------------------------------------------- paramètres
# Unités : Md€ de 2025 ; « unité » = 100 MW de calcul / un réacteur de 300 MWe / 1 000 robots en flotte / une ligne de 100 000 appareils par an.
# n : projets parallèles ; c1, c2 : coût annuel d'un projet en tranche 1 et 2 ; t1, t2 : fin des tranches (années depuis 2029) ; p1, p2 : probabilités de passer les jalons ;
# equipe : équipe permanente après la tranche 2 (Md€/an, si succès) ; capex0 : coût de la première unité ; appr : baisse du coût par doublement du nombre d'unités ;
# rythme : unités lancées par an ; duree : années de lancement ; delai : années de construction (coût réparti) ; renouv : investissement de maintien (part du capital en service par an) ;
# rev : chiffre d'affaires par unité en service et par an ; marge : EBE / chiffre d'affaires ; emplois_unite : emplois d'exploitation par unité en service ; part_dom : part du capex dépensée en France.
PARAMS = {
    'calcul': {   # H-EIP5 à H-EIP8
        'prudent':   dict(n=3, c1=0.04, c2=0.10, t1=1, t2=3, p1=0.6, p2=0.5, equipe=0.10, capex0=3.35, appr=0.0, rythme=0.5, duree=4, delai=1, renouv=0.18, rev=0.67, marge=0.60, emplois_unite=25, part_dom=0.35),
        'central':   dict(n=3, c1=0.05, c2=0.15, t1=1, t2=3, p1=0.7, p2=0.6, equipe=0.20, capex0=3.35, appr=0.0, rythme=1.0, duree=3, delai=1, renouv=0.16, rev=0.86, marge=0.70, emplois_unite=25, part_dom=0.35),
        'ambitieux': dict(n=3, c1=0.06, c2=0.20, t1=1, t2=3, p1=0.8, p2=0.7, equipe=0.40, capex0=3.35, appr=0.0, rythme=2.0, duree=5, delai=1, renouv=0.14, rev=1.07, marge=0.75, emplois_unite=25, part_dom=0.35),
    },
    'atome': {    # H-EIP9 à H-EIP12
        'prudent':   dict(n=2, c1=0.08, c2=0.30, t1=3, t2=9, p1=0.4, p2=0.4, equipe=0.10, capex0=5.1, appr=0.05, rythme=0.5, duree=10, delai=5, renouv=0.015, rev=0.166, marge=0.57, emplois_unite=120, part_dom=0.80),
        'central':   dict(n=3, c1=0.10, c2=0.30, t1=3, t2=8, p1=0.5, p2=0.5, equipe=0.15, capex0=3.9, appr=0.10, rythme=1.0, duree=10, delai=5, renouv=0.015, rev=0.201, marge=0.65, emplois_unite=120, part_dom=0.80),
        'ambitieux': dict(n=3, c1=0.12, c2=0.35, t1=3, t2=7, p1=0.6, p2=0.6, equipe=0.20, capex0=3.0, appr=0.15, rythme=2.0, duree=10, delai=4, renouv=0.015, rev=0.237, marge=0.70, emplois_unite=120, part_dom=0.80),
    },
    'robotique': {  # H-EIP13 à H-EIP16
        'prudent':   dict(n=4, c1=0.04, c2=0.12, t1=2, t2=5, p1=0.4, p2=0.4, equipe=0.10, capex0=0.096, appr=0.10, rythme=0.5, duree=25, delai=1, renouv=0.20, rev=0.011, marge=0.20, emplois_unite=100, part_dom=0.60),
        'central':   dict(n=4, c1=0.05, c2=0.15, t1=2, t2=5, p1=0.5, p2=0.5, equipe=0.20, capex0=0.060, appr=0.15, rythme=2.0, duree=25, delai=1, renouv=0.17, rev=0.018, marge=0.35, emplois_unite=100, part_dom=0.60),
        'ambitieux': dict(n=4, c1=0.06, c2=0.20, t1=2, t2=5, p1=0.6, p2=0.6, equipe=0.40, capex0=0.036, appr=0.20, rythme=8.0, duree=25, delai=1, renouv=0.14, rev=0.027, marge=0.50, emplois_unite=100, part_dom=0.60),
    },
    'objets': {   # H-EIP17 à H-EIP20
        'prudent':   dict(n=3, c1=0.010, c2=0.025, t1=1, t2=3, p1=0.6, p2=0.5, equipe=0.02, capex0=0.050, appr=0.05, rythme=0.5, duree=10, delai=1, renouv=0.07, rev=0.0358, marge=0.00, emplois_unite=180, part_dom=0.70),
        'central':   dict(n=3, c1=0.010, c2=0.030, t1=1, t2=3, p1=0.7, p2=0.6, equipe=0.03, capex0=0.040, appr=0.05, rythme=1.0, duree=10, delai=1, renouv=0.07, rev=0.0500, marge=0.06, emplois_unite=250, part_dom=0.70),
        'ambitieux': dict(n=3, c1=0.015, c2=0.040, t1=1, t2=3, p1=0.8, p2=0.7, equipe=0.05, capex0=0.030, appr=0.05, rythme=3.0, duree=10, delai=1, renouv=0.07, rev=0.0644, marge=0.12, emplois_unite=300, part_dom=0.70),
    },
}

# Holding, épargne, partage des bénéfices (H-EIP21 à H-EIP24)
HOLDING = {
    'prudent':   dict(frais=0.03, epargne=0.2, rendement_parts=0.030, extinction=0.04, part_socle=0.30, part_dette=0.30, emplois_frais=150),
    'central':   dict(frais=0.05, epargne=0.5, rendement_parts=0.030, extinction=0.04, part_socle=0.30, part_dette=0.30, emplois_frais=250),
    'ambitieux': dict(frais=0.08, epargne=1.5, rendement_parts=0.030, extinction=0.04, part_socle=0.30, part_dette=0.30, emplois_frais=400),
}
COUT_EMPLOI_RD = 0.15e-3      # Md€ par emploi et par an (150 k€ chargés) — H-EIP3
COUT_EMPLOI_CHANTIER = 0.20e-3  # Md€ de capex dépensé en France par emploi-année de chantier — H-EIP4


def annees(an0=AN0, an_fin=AN_FIN):
    return list(range(an0, an_fin + 1))


def p_succes(par):
    """Probabilité qu'au moins un des n projets passe les deux jalons (les projets sont supposés indépendants)."""
    return 1.0 - (1.0 - par['p1'] * par['p2']) ** par['n']


def cout_unite(c0, rang, appr):
    """Coût de la rang-ième unité (rang ≥ 1) avec un taux d'apprentissage appr par doublement : c0 × rang^log2(1 − appr)."""
    if appr <= 0:
        return c0
    return c0 * rang ** math.log2(1.0 - appr)


def tranches(par, k):
    """Dépense espérée de R&D et d'équipe (Md€) à l'année k (0 = 2029)."""
    if k < par['t1']:
        return par['n'] * par['c1']
    if k < par['t2']:
        return par['n'] * par['p1'] * par['c2']
    return par['equipe'] * p_succes(par)


def cout_echecs(par):
    """Dépense espérée perdue dans des projets arrêtés (Md€ cumulés) et dépense totale des tranches 1 et 2."""
    ph1 = par['n'] * par['c1'] * par['t1']
    ph2 = par['n'] * par['p1'] * par['c2'] * (par['t2'] - par['t1'])
    perdu = ph1 * (1 - par['p1']) + ph2 * (1 - par['p2'])
    # un projet qui passe les deux jalons mais n'est pas retenu (un seul suffit à lancer la série) n'est pas compté perdu : ses résultats servent la série
    return {'perdu': perdu, 'tranches': ph1 + ph2}


def cout_echec_total(par):
    """Pire cas du financement par tranches : tous les projets passent le premier jalon puis échouent au second (Md€ cumulés)."""
    return par['n'] * par['c1'] * par['t1'] + par['n'] * par['c2'] * (par['t2'] - par['t1'])


def serie_pole(par, ans=None, force_succes=None):
    """Séries annuelles espérées d'un pôle : {an: {rd, capex, capex_neuf, revenus, ebe, unites, emplois}}.
    force_succes : remplace la probabilité de succès (0 = tout échoue, 1 = réussite certaine)."""
    ans = ans or annees()
    ps = p_succes(par) if force_succes is None else force_succes
    n_an = len(ans)
    capex_neuf = [0.0] * n_an
    en_service = [0.0] * n_an      # capital en service (Md€)
    unites = [0.0] * n_an
    rang = 0.0
    lancement = par['t2']
    for j in range(par['duree']):
        k0 = lancement + j
        if k0 >= n_an:
            break
        nb = par['rythme']
        # coût moyen des nb unités lancées cette année (rang suivant), apprentissage sur le programme prévu
        c = sum(cout_unite(par['capex0'], rang + i + 1, par['appr']) for i in range(int(math.ceil(nb)))) / max(1, int(math.ceil(nb)))
        rang += nb
        total = nb * c * ps
        for d in range(par['delai']):
            if k0 + d < n_an:
                capex_neuf[k0 + d] += total / par['delai']
        mise = k0 + par['delai']
        for k in range(mise, n_an):
            en_service[k] += total
            unites[k] += nb * ps
    out = {}
    for k, an in enumerate(ans):
        rd = tranches(par, k)
        renouv = par['renouv'] * en_service[k]
        rev = unites[k] * par['rev']
        ebe = rev * par['marge']
        emplois = rd / COUT_EMPLOI_RD + capex_neuf[k] * par['part_dom'] / COUT_EMPLOI_CHANTIER + unites[k] * par['emplois_unite']
        out[an] = {'rd': rd, 'capex_neuf': capex_neuf[k], 'capex': capex_neuf[k] + renouv, 'revenus': rev, 'ebe': ebe, 'unites': unites[k],
                   'emplois': emplois, 'flux': ebe - capex_neuf[k] - renouv - rd}
    return out


def horizon(serie, taux=0.0):
    """Année où le flux cumulé (actualisé au taux donné, base 2029) redevient positif ; None si jamais avant 2058. Et première année de flux annuel positif."""
    cum = 0.0
    an_cum = None
    an_flux = None
    for an in sorted(serie):
        f = serie[an]['flux']
        cum += f / (1 + taux) ** (an - AN0)
        if an_flux is None and f > 0 and an > AN0 + 2:
            an_flux = an
        if an_cum is None and cum > 0 and an > AN0:
            an_cum = an
    return {'flux_positif': an_flux, 'cumul_positif': an_cum, 'cumul_2058': cum}


def holding(series, h, ans=None):
    """Consolide les pôles. series : {pole: serie_pole}. h : HOLDING[scénario].
    Épargne : souscriptions annuelles de parts viagères (à partir de 2030), plafonnées au besoin de financement ; rendement servi aux porteurs ; extinction au décès.
    Bénéfice distribuable = EBE − capex − R&D − frais − rendement des parts, s'il est positif : part_socle reversée par le socle, part_dette au désendettement, le reste réinvesti.
    Retourne {an: {...}} avec le solde des administrations publiques (holding consolidée) et la variation de dette hors déficit (épargne en parts)."""
    ans = ans or annees()
    encours = 0.0
    out = {}
    for an in ans:
        ebe = sum(series[p][an]['ebe'] for p in series)
        capex = sum(series[p][an]['capex'] for p in series)
        rd = sum(series[p][an]['rd'] for p in series)
        rev = sum(series[p][an]['revenus'] for p in series)
        emplois = sum(series[p][an]['emplois'] for p in series) + h['emplois_frais']
        servi = h['rendement_parts'] * encours
        flux = ebe - capex - rd - h['frais'] - servi           # flux de trésorerie de la holding avant épargne et distribution
        besoin = max(0.0, -flux)
        sous = min(h['epargne'], besoin) if an > AN0 else 0.0
        socle = max(0.0, flux) * h['part_socle']
        dette = max(0.0, flux) * h['part_dette']
        encours = encours * (1 - h['extinction']) + sous
        out[an] = {'ebe': ebe, 'capex': capex, 'rd': rd, 'revenus': rev, 'frais': h['frais'], 'servi': servi, 'flux': flux, 'besoin': besoin,
                   'epargne': sous, 'encours_parts': encours, 'socle': socle, 'desendettement': dette, 'emplois': emplois,
                   # holding consolidée dans les administrations publiques : le solde primaire bouge du flux moins ce qui sort vers les ménages (socle)
                   'solde_apu': flux - socle, 'choc_dette': -sous,
                   # besoin de tranches (non empruntable avant résultats) : R&D + frais + capex des unités encore en tranche (aucune ici : la série suit le jalon)
                   'tranches': rd + h['frais']}
    return out


def enveloppe_necessaire(hold, an_debut=AN0, an_fin=AN0 + 9):
    """Enveloppe annuelle fixe qui couvre les tranches (R&D, équipes, frais) de la première décennie, et besoin d'emprunt conditionné (capex de série non couvert)."""
    env = max(hold[an]['tranches'] for an in range(an_debut, an_fin + 1))
    emprunt = {an: max(0.0, hold[an]['besoin'] - hold[an]['epargne'] - env) for an in hold}
    return {'enveloppe': env, 'emprunt_conditionne': emprunt}


def effet_md(hold):
    """Séries à injecter dans le modèle de taux : amélioration du solde primaire (Md€ de 2025, négative = coût) et chocs de dette hors déficit."""
    return ({an: v['solde_apu'] for an, v in hold.items()}, {an: v['choc_dette'] for an, v in hold.items()})


def effet_hors_apu(hold, env):
    """Variante : la holding est une unité marchande hors des administrations publiques (H-EIP24). L'État ne verse que l'enveloppe (dotation en capital, comptée en dépense
    tant que la holding perd de l'argent) et reçoit le désendettement ; la holding emprunte le reste à son bilan. Retourne (effet sur le solde, dette propre de la holding)."""
    eff = {}
    dette_h = 0.0
    dette = {}
    for an, v in hold.items():
        apport = min(env, v['besoin']) if v['besoin'] > 0 else 0.0
        eff[an] = -apport + v['desendettement']
        dette_h = max(0.0, dette_h + v['besoin'] - apport - v['epargne'] - max(0.0, v['flux'] - v['socle'] - v['desendettement']))
        dette[an] = dette_h
    return eff, dette


def scenario(nom, force_succes=None):
    """Toutes les séries d'un scénario."""
    series = {p: serie_pole(PARAMS[p][nom], force_succes=force_succes) for p in POLES}
    hold = holding(series, HOLDING[nom])
    return series, hold


def taux_reussite(issues):
    """Taux de réussite des précédents : réussite = 1, partielle = 0,5, échec = 0. Retourne (strict, pondéré)."""
    n = len(issues)
    if n == 0:
        return (0.0, 0.0)
    strict = sum(1 for i in issues if i == 'reussite') / n
    pond = sum({'reussite': 1.0, 'partielle': 0.5}.get(i, 0.0) for i in issues) / n
    return (strict, pond)


def p_projet(par):
    """Probabilité qu'un projet donné passe les deux jalons (à comparer au taux des précédents)."""
    return par['p1'] * par['p2']
