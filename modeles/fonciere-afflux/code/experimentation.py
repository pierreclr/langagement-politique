#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Expérimentation « bâtisseurs », clause de sortie et garantie à la génération du lancement (modeles/fonciere-afflux/).
Fonctions pures.

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Hypothèses H-FA70 à H-FA85 : methode.md ; valeurs :
donnees/parametres.json (rubrique « experimentation »). Des ordres de grandeur sous hypothèses, jamais des prédictions.

Décisions de l'auteur (09/11/2026) : expérimenter cinq ans avec des jeunes d'une vingtaine d'années formés aux métiers
de la rénovation, qui rénovent leur propre logement et y entrent dès qu'il est rénové (vers 21 ans) ; critères écrits
d'avance pour généraliser ou arrêter ; en cas d'abandon, règle retenue : le jeune rachète la nue-propriété à un prix fixé
à l'entrée et rembourse son capital de départ ; garantie : tous ceux qui ont 20 ans au lancement y auront droit si la
mesure aboutit.
"""
import math
from statistics import NormalDist
import afflux as A

U = A.U
ND = NormalDist()


def cas_batisseur(e, s, f, taux, duree, capital):
    """Cas type d'un bâtisseur dans le secteur `s` (dict de secteurs.csv) : passoire de `surface` m² achetée avec décote,
    rénovée (matériaux seulement si le jeune fait les travaux), usufruit = f × (prix + travaux), apport = capital.
    `e` : hypothèses de l'expérimentation."""
    P = s['prix_T2'] / s['surf_T2'] * e['surface']
    achat = P * (1 - e['decote'])
    travaux = e['cout_reno_m2'] * e['surface'] * e['part_materiaux']
    X = achat + travaux
    V = f * X
    L = max(0.0, V - capital)
    m = U.mensualite(L, taux, duree)
    contrib = U.TAUX_CONTRIBUTION_RP * X / 12
    return dict(P=P, achat=achat, travaux=travaux, X=X, V=V, L=L, m=m, contrib=contrib,
                effort=(m + contrib) / e['revenu_sortie'], loyer=s['loyer_m2_app12'] * e['surface'])


def couts_experimentation(e, s, n_an, f, taux, duree, capital, i, annees=5):
    """Coûts et dette d'une expérimentation de `annees` ans à `n_an` entrées par an dans le secteur `s`.
    Chaque promotion : formation l'année d'entrée (coût public), achat et travaux pendant le chantier (dette de la
    foncière), entrée dans le logement après `chantier` années, mensualités ensuite. Dette : D_t = D_{t−1}(1 + i) + besoin.
    Renvoie les cumuls (€) et la dette au bout de `annees` ans."""
    c = cas_batisseur(e, s, f, taux, duree, capital)
    dette, cout_formation, cout_capital, cout_gestion, mensualites = 0.0, 0.0, 0.0, 0.0, 0.0
    promos = []
    for t in range(annees):
        promos.append(t)
        besoin = 0.0
        # formation et achat l'année d'entrée ; travaux étalés sur le chantier
        cout_formation += n_an * e['cout_formation']
        besoin += n_an * (c['achat'] * (1 + e['frais_acq']))
        for t0 in promos:
            age = t - t0
            ch = e['chantier']
            if age < ch:
                besoin += n_an * c['travaux'] * min(1.0, ch - age) / ch
            # entrée dans le logement après le chantier : apport du capital (versé par l'État), mensualités ensuite
            if age < ch <= age + 1:
                besoin -= n_an * capital
                cout_capital += n_an * capital
            occ = max(0.0, min(1.0, age + 1 - ch))          # part de l'année passée dans le logement
            if occ > 0:
                annuite = 12 * c['m'] * occ * (1 - e['impayes'])
                mensualites += n_an * annuite
                besoin -= n_an * annuite
            cout_gestion += n_an * e['gestion']
        dette = dette * (1 + i) + besoin
    capital_restant = sum(n_an * U.capital_restant(c['L'], taux, duree, int(12 * max(0.0, annees - t0 - e['chantier']))) for t0 in promos)
    return dict(cas=c, dette=dette, formation=cout_formation, capital=cout_capital, gestion=cout_gestion, mensualites=mensualites,
                cout_public=cout_formation + cout_capital + cout_gestion, logements=n_an * annees, creance=capital_restant)


def effet_detectable(sigma, n_traites, n_temoins, alpha=0.05, puissance=0.8):
    """Plus petit effet détectable (différence de moyennes entre communes traitées et témoins) : (z_{1−α/2} + z_puissance)
    × σ × √(1/n_T + 1/n_C)."""
    z = ND.inv_cdf(1 - alpha / 2) + ND.inv_cdf(puissance)
    return z * sigma * math.sqrt(1 / n_traites + 1 / n_temoins)


def precision_proportion(p, n):
    """Demi-largeur de l'intervalle de confiance à 95 % d'une proportion p observée sur n unités."""
    return 1.96 * math.sqrt(p * (1 - p) / n) if n > 0 else float('inf')


def sortie(e, c, k, taux, duree, capital, f, i, g, inflation_revenu, revenu0):
    """Trois variantes de sortie après k années de mensualités, pour un contrat (cas `c` de cas_batisseur).
    Valeurs en euros de l'année k (non actualisées), du point de vue du jeune (comparé à la location du même logement
    pendant k ans) et de la collectivité (foncière + État, comparé à n'avoir rien fait).
    (1) contrat honoré jusqu'au décès ; (2) rachat de la nue-propriété au prix fixé à l'entrée ((1 − f) × X) et
    remboursement du capital de départ ; (2 bis) même rachat étalé sur le reste du contrat ; (3) revente et solde."""
    X, L, m = c['X'], c['L'], c['m']
    Lk = U.capital_restant(L, taux, duree, 12 * k)
    valeur = X * (1 + g) ** k
    paye = 12 * m * k
    principal = L - Lk
    contrib = 12 * c['contrib'] * k
    loyer = 12 * c['loyer'] * sum((1 + g) ** t for t in range(k))
    charges = e['charges'] * X * k
    # dette de portage de la foncière à l'année k : prix payé capitalisé au coût de l'argent, moins l'apport (versé par
    # l'État, compté à part) et les mensualités reçues, capitalisés
    portage = (X - capital) * (1 + i) ** k - sum(12 * m * (1 + i) ** (k - t - 1) for t in range(k))
    np_entree = (1 - f) * X
    out = {}
    # (1) honoré : le jeune reste usufruitier ; la collectivité garde le portage et récupère le bien au décès (non chiffré ici)
    # la collectivité détient la créance restante et la nue-propriété (valeur actuarielle `part_np` du bien)
    out['1'] = dict(jeune=loyer - (paye + contrib + charges), collectivite=Lk + e['part_np'] * valeur - portage - capital)
    # (2) rachat : le jeune paie Lk + nue-propriété fixée à l'entrée + capital ; il devient propriétaire d'un bien qui vaut `valeur`
    rachat = Lk + np_entree + capital
    out['2'] = dict(jeune=valeur - rachat + loyer - (paye + contrib + charges), collectivite=rachat - portage - capital, rachat=rachat,
                    m_etale=U.mensualite(rachat, taux, max(1, duree - k)) if k < duree else None,
                    effort_etale=(U.mensualite(rachat, taux, max(1, duree - k)) + c['contrib'] * (1 + g) ** k) / (revenu0 * (1 + inflation_revenu) ** k) if k < duree else None)
    # (3) revente : la collectivité vend au prix du marché ; le jeune récupère le capital remboursé et la valeur de ses travaux
    rendu = principal + c['travaux'] * e['valeur_travaux']
    out['3'] = dict(jeune=rendu + loyer - (paye + contrib + charges), collectivite=valeur * (1 - e['frais_revente']) - rendu - portage - capital)
    out['k'] = k
    out['valeur'] = valeur
    return out


def part_effort_rachat(cel, reg, h, k, g, inflation_revenu, S):
    """Part des entrants (cellules d'afflux.cellules, pondérées par leur entrée à la foncière) pour qui la mensualité
    du rachat étalé (variante 2 bis) dépasse 35 % du revenu après k ans."""
    tot, dep = 0.0, 0.0
    for cc in cel:
        r = cc['r']
        w = cc['w'] * r['F']
        if w <= 0:
            continue
        X = r['P']
        Lk = U.capital_restant(r['lf'], reg['taux'], reg['duree'], 12 * k)
        rachat = Lk + (1 - reg['f']) * X + r['cap']
        m = U.mensualite(rachat, reg['taux'], max(1, reg['duree'] - k)) + U.TAUX_CONTRIBUTION_RP * X * (1 + g) ** k / 12
        y = r['y'] * (1 + inflation_revenu) ** k
        tot += w
        if m > h['effort_max'] * y:
            dep += w
    return dep / tot if tot else 0.0


def batisseurs_actifs(promos, maintien, departs, horizon):
    """Bâtisseurs en activité dans la filière publique en fin d'année t : chaque promotion (liste d'effectifs par année)
    garde une part `maintien` un an après la formation, puis perd `departs` par an (H5, H14, H15 de batisseurs-et-repas)."""
    out = []
    for t in range(horizon):
        n = 0.0
        for t0, p in enumerate(promos[:t + 1]):
            age = t - t0
            if age >= 1:
                n += p * maintien * (1 - departs) ** (age - 1)
        out.append(n)
    return out


def entrees_permises(actifs, renov_par_an, part_a_renover, contrats_par_jeune):
    """Entrées de jeunes par an que la capacité de rénovation autorise : bâtisseurs × rénovations par an / part des
    logements entrants à rénover / contrats par jeune."""
    return [a * renov_par_an / part_a_renover / contrats_par_jeune for a in actifs]


def promotion_necessaire(part_generation, generation, contrats_par_jeune, part_a_renover, renov_par_an, maintien, departs):
    """Taille de promotion annuelle qui entretient, en régime, la capacité d'ouvrir à `part_generation` d'une génération :
    stock de bâtisseurs B = jeunes × contrats × part à rénover / rénovations par an ; en régime B = P × maintien / départs."""
    B = part_generation * generation * contrats_par_jeune * part_a_renover / renov_par_an
    return dict(stock=B, promotion=B * departs / maintien)


def net_alternant(brut, smic_brut, taux_cotis=0.22):
    """Salaire net d'un apprenti dont le contrat débute après le 01/03/2025 : exonéré de cotisations salariales et de
    CSG-CRDS jusqu'à 50 % du Smic, part au-delà soumise (taux global ≈ 22 %, ⚠️ ordre de grandeur)."""
    seuil = 0.5 * smic_brut
    return min(brut, seuil) + max(0.0, brut - seuil) * (1 - taux_cotis)
