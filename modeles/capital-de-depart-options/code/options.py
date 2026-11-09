#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Options du capital de départ face à la foncière (modeles/capital-de-depart-options/). Fonctions pures.

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Hypothèses H-CO1 à H-CO31 : methode.md.
Réutilise sans les modifier : modeles/fonciere-usufruit/code/{usufruit,fonciere,calculer}.py (mensualités, mortalité,
simulation de la foncière en mode « mensualité bancaire » = règle du § 28) et la loi des héritages de
modeles/capital-de-depart/ (exportée par exporter_heritages.js dans donnees/heritages.json).
Des ordres de grandeur sous hypothèses, jamais des prédictions.

Règle de la foncière (§ 28 de la note de conception de la foncière (atelier, non publiée)) : accès de 25 à 35 ans ; mensualité = prêt bancaire
(taux du marché, 25 ans) sur (prix − apport du capital de départ) ; renonciation à la nue-propriété ; contribution sur la
résidence principale payée comme tout propriétaire.
"""
import json, math, os, sys
from statistics import NormalDist

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
FONC = os.path.join(os.path.dirname(RACINE), 'fonciere-usufruit', 'code')
sys.path.insert(0, FONC)
import usufruit as U     # noqa: E402
import fonciere as F     # noqa: E402

ND = NormalDist()
TAUX_BANQUE = 0.0332                 # Banque de France, septembre 2026 (F21 de la foncière)
EFFORT_MAX = 0.35                    # HCSF : taux d'effort maximal (H-CO8)
CONTRIB = U.TAUX_CONTRIBUTION_RP     # 0,25 % de la valeur par an
TRANSACTIONS = 1100000.0             # ventes de logements par an (H-FU28)
ELAST = {'paris': 1.0, 'metropoles': 1.5, 'villes_moyennes': 2.5, 'rural': 4.0}   # H-FU40 (central)
# H-CO3 : revenu net mensuel individuel des 25-34 ans par décile (centre du décile), € de 2026 ⚠️ ordre de grandeur
REVENUS = (900.0, 1200.0, 1400.0, 1550.0, 1750.0, 1950.0, 2200.0, 2500.0, 3000.0, 4000.0)
FACT_AGE = {25: 0.85, 30: 1.0, 35: 1.10}                                         # H-CO5
AGES = ((25, 0.40), (30, 0.40), (35, 0.20))                                      # H-CO11 (= H-FU51)
# H-CO31 : part logement du socle de revenu (chapitre 4) : 250 € par mois à qui paie un loyer ; retirée avec le filet,
# supposée nulle à 1 856 € de revenu (464 € de complément / 25 %) et proportionnelle entre les deux ⚠️ simplification
PART_LOGEMENT = 250.0
SORTIE_FILET = 1856.0
PAR_CONTRAT = 0.75        # contrats par personne : la moitié des entrants achètent en couple (H-CO7)

# Scénarios de recours (bas = recours faible, favorable aux finances et aux prix ; haut = recours fort, défavorable)
SCENARIOS = {
    'bas':     dict(W=0.50, prec=0.7, r_np=0.035, phi=0.15, appel=0.10, t_form=0.25, adh=0.01, alpha=0.2,
                    part_log=0.15, levier=1.0, el=2.0, rho=0.3, p0=0.1, cohorte=830000.0, k_ret=1.2),
    'central': dict(W=0.60, prec=1.0, r_np=0.025, phi=0.10, appel=0.20, t_form=0.40, adh=0.03, alpha=0.3,
                    part_log=0.30, levier=2.0, el=1.0, rho=0.3, p0=0.1, cohorte=830000.0, k_ret=1.0),
    'haut':    dict(W=0.70, prec=1.3, r_np=0.015, phi=0.05, appel=0.30, t_form=0.55, adh=0.05, alpha=0.5,
                    part_log=0.50, levier=3.0, el=0.5, rho=0.3, p0=0.1, cohorte=830000.0, k_ret=0.8),
}
# r_np : taux net (actualisation − hausse des prix) auquel le jeune évalue la nue-propriété à laquelle il renonce ;
# plus il est haut, moins la nue-propriété compte, plus la foncière attire (H-CO12).

# Réglages des options. G : montant maximal ; K : décote e^(−H/K) ; alt : usage hors foncière ; ratio : montant de
# l'alternative / montant foncière ; v_alt : valeur subjective d'un euro de l'alternative (H-CO14).
BASE_OPT = dict(G=40000.0, K=80000.0, taux=TAUX_BANQUE, duree=25, alt=None, ratio=0.0, v_alt=1.0, appel=1.0,
                quota=None, apport_cash=False)
OPTIONS = {
    'A':  dict(),
    'B':  dict(alt='argent', ratio=0.5, v_alt=1.0, apport_cash=True, appel=0.0),
    "B'": dict(alt='argent', ratio=0.5, v_alt=0.85, apport_cash=True, appel=0.0),          # cinq versements, 25-29 ans
    "B'pv": dict(alt='argent', ratio=0.5, v_alt=0.60, apport_cash=False, appel=0.0, libre=False),       # parts à vie (épargne bloquée)
    'C':  dict(alt='formation', ratio=0.5, v_alt=0.40, appel=0.5),
    'sans': dict(G=0.0, fonciere=False, appel=0.0),                                         # ni capital ni foncière
    'D':  dict(alt='tout_argent', ratio=1.0, v_alt=1.0, apport_cash=True, appel=0.0),       # chapitre 3 (référence)
}


def reglage(nom='A', **surcharges):
    o = dict(BASE_OPT)
    o.update(OPTIONS.get(nom, {}))
    o.update(surcharges)
    o['nom'] = nom
    return o


def aide_logement(y):
    """Part logement mensuelle d'un locataire de revenu net y (H-CO31)."""
    return PART_LOGEMENT * max(0.0, 1 - y / SORTIE_FILET)


def capital(o, H):
    """Capital de départ pour un héritage reçu ou attendu H : G × e^(−H/K) (chapitre 3 : 40 000 € × e^(−H/80 000 €))."""
    return o['G'] * math.exp(-H / o['K'])


def poids_revenu(u, rho):
    """P(décile de revenu j | rang d'héritage u) : copule gaussienne de corrélation rho (H-CO4)."""
    z = ND.inv_cdf(min(max(u, 1e-9), 1 - 1e-9))
    s = math.sqrt(1 - rho * rho)
    bornes = [-math.inf] + [ND.inv_cdf(k / 10) for k in range(1, 10)] + [math.inf]
    cdf = lambda x: 0.0 if x == -math.inf else 1.0 if x == math.inf else ND.cdf((x - rho * z) / s)
    return [cdf(bornes[j + 1]) - cdf(bornes[j]) for j in range(10)]


def usufruits_perso(table, r):
    """Part d'usufruit (valeur pour le jeune, au taux net r) par âge d'entrée."""
    return {a: U.valeur_usufruit(U.survies(table, a, 2027, 0.01), r) for a, _ in AGES}


def choix(o, h, H, u, j, sect, age, usu):
    """Choix probabilisé d'un jeune (héritage H au rang u, décile de revenu j, secteur, âge d'entrée).
    Renvoie les probabilités des issues et les montants publics versés. Issues : 'F' (foncière), 'banque' (achat
    bancaire), 'argent', 'formation', 'rien' ; 'proprio' = propriétaire ou usufruitier avant 36 ans."""
    C = capital(o, H)
    M = o['ratio'] * C if o['alt'] else 0.0
    P = PAR_CONTRAT * sect['prix_T3']                       # part de logement par personne (H-CO7)
    y = REVENUS[j] * FACT_AGE[age]
    plafond = EFFORT_MAX * y
    contrib = CONTRIB * P / 12
    mF = U.mensualite(max(0.0, P - C), o['taux'], o['duree']) + contrib
    fF = 1.0 if (mF <= plafond and o.get('fonciere', True)) else 0.0   # même norme d'effort (H-CO8)
    # accès au crédit bancaire (H-CO9) : apport de 10 % (famille/épargne, ou capital versé en argent), solvabilité, stabilité
    cash = M if (o['apport_cash'] and o['alt'] in ('argent', 'tout_argent')) else 0.0
    p_apport = 1.0 if cash >= 0.1 * P else min(1.0, 0.15 + 0.75 * u)
    apport = max(0.1 * P, cash)
    solv = 1.0 if U.mensualite(max(0.0, P - apport), TAUX_BANQUE, 25) + contrib <= plafond else 0.0
    prec = (0.30 - 0.25 * j / 9) * h['prec']
    b = solv * p_apport * (1 - prec)
    np_val = P * (1 - usu[age]) + h['phi'] * P             # ce que le jeune abandonne : nue-propriété + liberté de revendre
    gainF = (0.0 if o['alt'] == 'tout_argent' else C) - np_val   # en D, l'apport sert aussi à la banque : la foncière n'ajoute rien
    v_alt = o['v_alt'] * M
    prend_F = 1.0 if gainF >= v_alt else 0.0
    W = h['W']
    r = dict(F=0.0, banque=0.0, argent=0.0, formation=0.0, rien=0.0, proprio=0.0, verse=0.0, verse_F=0.0, libre=0.0,
             add=0.0, cash_log=0.0, F_banque=0.0, aide=0.0)
    # aide au logement que l'État ne verse plus une fois le droit remboursé, à qui serait resté locataire (H-CO31)
    aide_apres = aide_logement(REVENUS[j] * h.get('k_ret', 1.0))

    def alt(poids):
        """Le jeune n'entre pas à la foncière : il prend l'usage alternatif."""
        if o['alt'] in ('argent', 'tout_argent'):
            m = C if o['alt'] == 'tout_argent' else M
            r['argent'] += poids
            r['verse'] += poids * m
            if o.get('libre', True):
                r['libre'] += poids * m
                # une part de l'argent libre finit en apport immobilier, avec un effet de levier (H-CO17, H12-H13)
                r['cash_log'] += poids * m * h['part_log'] * h['levier']
                return m
            return 0.0
        if o['alt'] == 'formation':
            r['formation'] += poids * h['t_form']
            r['rien'] += poids * (1 - h['t_form'])
            r['verse'] += poids * h['t_form'] * M
            return 0.0
        r['rien'] += poids
        return 0.0

    def entre_F(poids, additionnel, banque_ok):
        r['F'] += poids
        r['proprio'] += poids
        r['verse'] += poids * C
        r['verse_F'] += poids * C
        r['add'] += poids * additionnel
        if not banque_ok:
            r['aide'] += poids * aide_apres
        if banque_ok:
            r['F_banque'] += poids

    # W1 : veut se fixer entre 25 et 35 ans (H-CO10)
    # (a) accès bancaire
    pa = W * b
    q = fF * (h['adh'] + (1 - h['adh']) * prend_F)
    entre_F(pa * q, h['alpha'], True)
    reste = pa * (1 - q)
    r['banque'] += reste
    r['proprio'] += reste
    alt(reste)
    # (b) sans accès bancaire : la foncière s'il peut payer, sinon location (et usage alternatif)
    pn = W * (1 - b)
    entre_F(pn * fF, 1.0, False)
    alt(pn * (1 - fF))
    # W0 : ne voulait pas se fixer ; « effet d'appel » pour ne pas perdre le capital (H-CO13)
    p0_ = 1 - W
    if o['alt'] is None:
        e = h['appel'] * o['appel'] * fF
        entre_F(p0_ * e, 1.0, False)
        r['rien'] += p0_ * (1 - e)
    elif o['alt'] == 'formation':
        e = h['appel'] * o['appel'] * fF
        entre_F(p0_ * e, 1.0, False)
        alt(p0_ * (1 - e))
    else:
        alt(p0_)
    r['C'] = C
    r['P'] = P
    r['mF'] = mF
    return r


def charger_heritages(chemin=None):
    with open(chemin or os.path.join(RACINE, 'donnees', 'heritages.json'), encoding='utf-8') as f:
        return json.load(f)


def agreger(o, h, her, secteurs, table, usu=None):
    """Agrège les choix d'une génération. Renvoie parts, coûts (Md€/an), profils par décile et par secteur, intrants
    de la simulation de la foncière, demande additionnelle par secteur."""
    qs = her['quantiles'][str(h['p0'])]
    n = len(qs)
    usu = usu or usufruits_perso(table, h['r_np'])
    parts_sect = {k: s['part_ventes'] for k, s in secteurs.items()}
    tot_ps = sum(parts_sect.values())
    cles = ('F', 'banque', 'argent', 'formation', 'rien', 'proprio', 'verse', 'verse_F', 'libre', 'add', 'cash_log', 'F_banque', 'aide')
    g = {k: 0.0 for k in cles}
    dec_h = [{k: 0.0 for k in cles} for _ in range(10)]
    dec_y = [{k: 0.0 for k in cles} for _ in range(10)]
    par_s = {k: {c: 0.0 for c in cles} for k in secteurs}
    ages_F = {a: 0.0 for a, _ in AGES}
    prixF = 0.0
    for i, H in enumerate(qs):
        u = (i + 0.5) / n
        wy = poids_revenu(u, h['rho'])
        for j in range(10):
            for ks, s in secteurs.items():
                for a, pa in AGES:
                    w = (1 / n) * wy[j] * parts_sect[ks] / tot_ps * pa
                    r = choix(o, h, H, u, j, s, a, usu)
                    for c in cles:
                        g[c] += w * r[c]
                        dec_h[min(9, int(u * 10))][c] += w * r[c] * 10
                        dec_y[j][c] += w * r[c] * 10
                        par_s[ks][c] += w * r[c] / (parts_sect[ks] / tot_ps)
                    ages_F[a] += w * r['F']
                    prixF += w * r['F'] * r['P'] / PAR_CONTRAT
    # quota (H-CO25) : au-delà de `quota` (part d'une génération), les entrées sont rationnées à proportion
    k_quota = 1.0
    if o.get('quota') and g['F'] > o['quota']:
        k_quota = o['quota'] / g['F']
    N = h['cohorte']
    res = dict(o=o, parts=g, dec_h=dec_h, dec_y=dec_y, secteurs=par_s, k_quota=k_quota)
    shareF = g['F'] * k_quota
    res['part_F'] = shareF
    # coût public du capital (Md€ par an, euros de 2026) : apports à la foncière + argent + formation
    hors_F = g['verse'] - g['verse_F']
    # les jeunes écartés par le quota reçoivent l'usage alternatif (argent, parts à vie : ratio ; formation : t_form × ratio)
    repli = 0.0
    if o['alt'] in ('argent', 'tout_argent'):
        repli = o['ratio']
    elif o['alt'] == 'formation':
        repli = o['ratio'] * h['t_form']
    res['cout_md'] = N * (g['verse_F'] * (k_quota + (1 - k_quota) * repli) + hors_F) / 1e9
    res['libre_md'] = N * g['libre'] / 1e9
    res['apport_moyen'] = g['verse_F'] / g['F'] if g['F'] > 0 else 0.0
    res['aide_contrat'] = g['aide'] / g['F'] / PAR_CONTRAT if g['F'] > 0 else 0.0   # € par mois et par contrat
    res['prix_contrat'] = prixF / g['F'] if g['F'] > 0 else 0.0
    res['ages_F'] = tuple((a, ages_F[a] / g['F']) for a, _ in AGES) if g['F'] > 0 else AGES
    res['proprio'] = g['proprio'] - g['F'] * (1 - k_quota)
    res['proprio_D15'] = sum(d['proprio'] - d['F'] * (1 - k_quota) for d in dec_h[:5]) / 5
    # demande additionnelle par secteur → effet borné sur les prix (H-CO17, H-CO18)
    res['prix'] = {}
    for ks, s in secteurs.items():
        ps = parts_sect[ks] / tot_ps
        add_contrats = N * ps * par_s[ks]['add'] * k_quota * PAR_CONTRAT
        cash = N * ps * par_s[ks]['cash_log']
        trans = TRANSACTIONS * s['part_ventes']
        valeur = trans * s['prix_moyen_tous']
        dq = add_contrats / trans + cash / valeur
        res['prix'][ks] = dq / (ELAST[ks] * h['el'])
    return res


def params_fonciere(res, h, sc_fin='central', **kw):
    """Paramètres de modeles/fonciere-usufruit (mode 'banque' = règle du § 28) pour les entrants de l'option."""
    o = res['o']
    d = dict(redevance='banque', taux_banque=o['taux'], duree=o['duree'], primo_par_an=h['cohorte'] * PAR_CONTRAT,
             part_cible=res['part_F'], ages=res['ages_F'], ages_apport=(25, 30, 35), part_apport=1.0,
             apport=res['apport_moyen'] / PAR_CONTRAT, prix0=res['prix_contrat'], montee_ans=10,
             aide_logement=res['aide_contrat'])   # la foncière compte l'aide évitée après la fin du remboursement (H-FU14)
    d.update(kw)
    return F.params(sc_fin, **d)


def simuler_chemin(p, table, chemin=None):
    """F.simuler, avec un chemin d'entrants imposé (personnes × PAR_CONTRAT par an) si `chemin` est donné.
    Le module fonciere n'est pas modifié : sa fonction `entrants` est remplacée le temps de l'appel."""
    if chemin is None:
        return F.simuler(p, table)
    orig = F.entrants
    try:
        F.entrants = lambda pp, t: chemin[t] if t < len(chemin) else chemin[-1]
        return F.simuler(p, table)
    finally:
        F.entrants = orig


def bilan_fonciere(sim):
    """Indicateurs : besoin et dette à 10 et 30 ans, test des 50 % (moyenne sur 3 ans, dès l'an 5), gestion."""
    rr = F.max_ratio_sur_3_ans(sim)
    sous = next((sim[k]['annee'] for k in range(4, len(rr)) if rr[k] < 0.5), None)
    return dict(besoin10=sim[9]['besoin_md'], besoin30=sim[29]['besoin_md'], dette10=sim[9]['dette_md'],
                dette30=sim[29]['dette_md'], dette30_pib=sim[29]['dette_pib'], ratio_min=F.ratio_min(sim), ratio10=rr[9],
                ratio_min30=F.ratio_min(sim, a=30), sous_50=sous, gestion30=sim[29]['gestion_md'],
                aide30=sim[29]['aide_evitee_md'], dette_max=max(r['dette_md'] for r in sim),
                aide45=sim[44]['aide_evitee_md'], aide60=sim[59]['aide_evitee_md'], gestion60=sim[59]['gestion_md'],
                net30=sim[29]['net_md'], net60=sim[59]['net_md'], dnet60=sim[59]['net_md'] - sim[58]['net_md'],
                contrib60=sim[59]['contribution_md'])


# ---------------------------------------------------------------- transition ----------------------------------------
def transition(nF_age, q_nb, capacite, regle='report', age_max=35, horizon=80, a0_min=-30, a0_max=45,
               rattrapage=None, ordre='age', age_report=45):
    """Démarrage de la foncière. nF_age : entrants à la foncière par génération en régime, par âge d'entrée {25: n, ...} ;
    q_nb : part de ces entrants sans accès bancaire (eux seuls attendent : les autres ont déjà acheté à la banque s'ils
    ont dépassé leur âge d'entrée au lancement, H-CO27) ; capacite[t] : entrées possibles l'année t (personnes) ;
    regle : 'expire' (droit perdu à 36 ans), 'report' (droit conservé jusqu'à être servi, au plus jusqu'à `age_report` ans),
    'entrantes' (seules les générations qui ont 25 ans ou moins au lancement ont le droit) ;
    rattrapage : None ou dict(age_max=40, fenetre=5) : les 36-40 ans au lancement reçoivent un droit pendant 5 ans.
    Renvoie par génération (âge au lancement a0) : demande, servis, perdus, attente moyenne ; et le chemin des entrées."""
    attente = {}      # a0 -> liste [ (année d'apparition, nombre restant) ]
    gens = {a0: dict(demande=0.0, servis=0.0, perdus=0.0, attente=0.0) for a0 in range(a0_min, a0_max + 1)}
    chemin, file_t = [], []
    lim = {a0: (age_max if a0 <= age_max else None) for a0 in gens}
    for a0 in gens:
        if regle == 'entrantes' and a0 > 25:
            lim[a0] = None
        if rattrapage and age_max < a0 <= rattrapage['age_max']:
            lim[a0] = a0 + rattrapage['fenetre'] - 1
        if regle == 'report' and lim[a0] is not None:
            lim[a0] = max(lim[a0], age_report)
    for t in range(horizon):
        # apparition des demandes (H-CO27)
        for a0, gg in gens.items():
            if lim[a0] is None:
                continue
            for e, n in nF_age.items():
                if a0 > e:
                    # déjà passé l'âge d'entrée au lancement : seuls ceux qui n'ont pas pu acheter à la banque attendent
                    d = n * q_nb if t == 0 else 0.0
                    t_d = 0
                else:
                    d = n if a0 + t == e else 0.0
                    t_d = t
                if d > 0:
                    gg['demande'] += d
                    attente.setdefault(a0, []).append([t_d, d])
        # service
        cap = capacite[t] if t < len(capacite) else capacite[-1]
        # ordre 'age' : les plus âgés d'abord (les plus proches de l'échéance) ; 'fifo' : par date de demande
        items = [(a0, it) for a0 in attente for it in attente[a0]]
        items.sort(key=(lambda z: -z[0]) if ordre == 'age' else (lambda z: (z[1][0], -z[0])))
        servis_t = 0.0
        for a0, item in items:
            if cap <= 0:
                break
            x = min(cap, item[1])
            item[1] -= x
            cap -= x
            servis_t += x
            gens[a0]['servis'] += x
            gens[a0]['attente'] += x * (t - item[0])
        chemin.append(servis_t)
        file_t.append(sum(it[1] for a0 in attente for it in attente[a0]))
        # expiration
        for a0 in list(attente.keys()):
            if a0 + t >= lim[a0]:
                perdu = sum(it[1] for it in attente[a0])
                gens[a0]['perdus'] += perdu
                del attente[a0]
            else:
                attente[a0] = [it for it in attente[a0] if it[1] > 1e-9]
    for gg in gens.values():
        gg['attente'] = gg['attente'] / gg['servis'] if gg['servis'] > 0 else 0.0
    transition.file = file_t      # file d'attente en fin d'année (personnes), lisible après l'appel
    return gens, chemin


def file_attente(nF_age, q_nb, capacite, **kw):
    """File d'attente en fin de chaque année (personnes) pour la même transition."""
    transition(nF_age, q_nb, capacite, **kw)
    return list(transition.file)


def capacite_rampe(n_regime, ans, surcap=0.0, batisseurs=3000.0, cercle1=2, horizon=80, marge=0.05):
    """Capacité d'entrée (personnes par an) : bâtisseurs pendant `cercle1` ans, puis montée linéaire jusqu'à
    (1 + surcap) × régime à l'année `ans` (publics prioritaires puis tous), puis plateau (H-CO26)."""
    cible = n_regime * (1 + max(surcap, marge))    # marge structurelle de 5 % : sans elle, une file ne se résorbe jamais
    out = []
    for t in range(horizon):
        if t < cercle1:
            out.append(min(cible, batisseurs))
        else:
            f = min(1.0, (t + 1 - cercle1) / max(1, ans - cercle1))
            out.append(batisseurs + (cible - batisseurs) * f)
    return out


if __name__ == '__main__':
    print('Module de fonctions : lancer calculer.py')
