#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Afflux vers la foncière (modeles/fonciere-afflux/) : déclencheur, revenus, choix des ménages, agrégation. Fonctions pures.

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Hypothèses H-FA1 à H-FA70 : methode.md ; valeurs : donnees/parametres.json.
Des ordres de grandeur sous hypothèses, jamais des prédictions.

Règle chiffrée (décisions de l'auteur du 09/11/2026, rappelées dans methode.md § 1) : un jeune accède une fois dans sa
vie, à son premier emploi stable et au plus tard à 35 ans ; il achète l'usufruit à vie au prix forfaitaire f × prix
(travaux compris) ; son capital de départ (40 000 € × e^(−héritage / 80 000 €)) est un apport dans cet achat, jamais de
l'argent libre ; le reste est financé par la foncière sur 25 ou 30 ans à un taux proche du taux bancaire ; au-delà d'un
plafond de financement, une banque prête le complément (financement mixte) ; il paie la contribution sur la résidence
principale (0,25 % par an). Qui n'entre pas reçoit la moitié de son capital en parts à vie.

Réutilise sans les modifier : modeles/fonciere-usufruit/code/usufruit.py (mensualités, mortalité, usufruit) et
modeles/capital-de-depart-options/code/options.py (capital(), poids_revenu(), aide_logement(), transition(),
capacite_rampe()).
"""
import json, math, os, sys

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
MODELES = os.path.dirname(RACINE)
for _d in (os.path.join(MODELES, 'fonciere-usufruit', 'code'), os.path.join(MODELES, 'capital-de-depart-options', 'code')):
    if _d not in sys.path:
        sys.path.append(_d)
import usufruit as U    # noqa: E402
import options as O     # noqa: E402

SECT = ('paris', 'metropoles', 'villes_moyennes', 'rural')
TAILLES = ('T2', 'T3', 'T4')
TYPES = ('seul', 'couple', 'famille')
TAILLE_CIBLE = {'seul': 'T2', 'couple': 'T3', 'famille': 'T4'}         # H-FA9
CONTRATS_PAR_PERSONNE = {'seul': 1.0, 'couple': 0.5, 'famille': 0.5}   # un contrat par ménage (H-FA9)
SUIVANTE = {'T2': 'T3', 'T3': 'T4', 'T4': None}


# ------------------------------------------------------------------ paramètres --------------------------------------
def charger_parametres(chemin=None):
    with open(chemin or os.path.join(RACINE, 'donnees', 'parametres.json'), encoding='utf-8') as f:
        return json.load(f)['parametres']


def hypotheses(P, sc='central', **surcharges):
    """Dictionnaire plat {nom: valeur} pour le scénario `sc` ('bas', 'central', 'haut'). Convention de parametres.json :
    'bas' = faible afflux et faible effet prix (favorable), 'haut' = l'inverse."""
    h = {k: (v[sc] if sc in v else v['central']) for k, v in P.items() if not k.startswith('_')}
    h.update(surcharges)
    # réponse du prix à la demande, recalculée depuis les élasticités (H-FA21) pour que les sensibilités s'y propagent
    h['reponse_prix'] = {s: 1 / (h['elasticite_offre'][s] + h['elasticite_demande']) for s in h['elasticite_offre']}
    return h


def reglage(**kw):
    """Réglage du dispositif (ce que l'auteur choisit) : forfait f, durée, taux du contrat, plafond d'entrées, priorité."""
    r = dict(f=0.85, duree=25, taux=0.0332, marge=0.0, quota=None, priorite='heritage', mixte=True, G=40000.0,
             K=80000.0, parts_a_vie=0.5)
    r.update(kw)
    return r


# ------------------------------------------------------------------ déclencheur et revenus --------------------------
def ages_emploi_stable(h):
    """Répartition d'une génération selon l'âge au premier emploi stable (H-FA2) : liste [(âge représentatif, part)] et
    part qui n'y accède pas avant 36 ans. Les parts somment à 1 avec cette dernière (test de conservation)."""
    ages = [(a, w) for a, w in zip(h['ages_groupes'], h['ages_parts'])]
    return ages, 1.0 - sum(w for _, w in ages)


def revenus_deciles(h):
    """Revenu net mensuel au centre de chaque décile (quantiles 5 %, 15 %, ..., 95 %) d'une loi log-normale de médiane
    `revenu_median` et d'écart-type `revenu_sigma`, avec un plancher (H-FA3). Remplace H-CO3."""
    from statistics import NormalDist
    nd = NormalDist()
    return [max(h['revenu_plancher'], h['revenu_median'] * h['k_revenu'] * math.exp(h['revenu_sigma'] * nd.inv_cdf((k + 0.5) / 10)))
            for k in range(10)]


def revenu(h, j, age, _cache={}):
    """Revenu net mensuel individuel au premier emploi stable, décile j (0 à 9), âge `age` (H-FA3, H-FA4)."""
    cle = (h['revenu_median'], h['revenu_sigma'], h['k_revenu'], h['revenu_plancher'])
    if cle not in _cache:
        _cache[cle] = revenus_deciles(h)
    base = _cache[cle][j]
    k = h['revenu_facteur_age']
    x = sorted(float(a) for a in k)
    y = [k[a] for a in sorted(k, key=float)]
    if age <= x[0]:
        return base * y[0]
    for i in range(1, len(x)):
        if age <= x[i]:
            return base * (y[i - 1] + (y[i] - y[i - 1]) * (age - x[i - 1]) / (x[i] - x[i - 1]))
    return base * y[-1]


def types_menage(h, age):
    """Parts seul / couple / famille à l'âge d'entrée (H-FA9), interpolées entre les âges donnés."""
    t = h['types_menage']
    xs = sorted(t.keys(), key=float)
    if age <= float(xs[0]):
        return t[xs[0]]
    for i in range(1, len(xs)):
        a, b = float(xs[i - 1]), float(xs[i])
        if age <= b:
            w = (age - a) / (b - a)
            return [t[xs[i - 1]][k] * (1 - w) + t[xs[i]][k] * w for k in range(3)]
    return t[xs[-1]]


def prix_logement(s, taille):
    return s['prix_' + taille]


def loyer_logement(s, taille):
    """Loyer de marché du même logement (H-FU37 de la foncière, repris en H-FA10)."""
    if taille == 'T2':
        return s['loyer_m2_app12'] * s['surf_T2']
    if taille == 'T3':
        return s['loyer_m2_app3'] * s['surf_T3']
    return (s['loyer_m2_app3'] + s['loyer_m2_mai']) / 2 * s['surf_T4']


# ------------------------------------------------------------------ choix d'un ménage --------------------------------
def financement(reg, h, s, P, cap):
    """Financement mixte (H-FA15) : usufruit V = f × P ; la foncière finance V − apport jusqu'à un plafond égal à
    f × (prix du T3 médian du secteur) ; une banque prête le reste au taux bancaire + écart. Renvoie
    (part foncière, part bancaire, mensualité totale)."""
    V = reg['f'] * P
    besoin = max(0.0, V - cap)
    plafond = reg['f'] * s['prix_T3'] * h['plafond_mixte'] if reg['mixte'] else float('inf')
    lf = min(besoin, plafond)
    lb = besoin - lf
    tf = reg['taux'] + reg['marge']
    m = U.mensualite(lf, tf, reg['duree']) + (U.mensualite(lb, reg['taux'] + h['ecart_banque_usufruit'], reg['duree']) if lb > 0 else 0.0)
    return lf, lb, m


def choix(reg, h, u, j, s, age, typ, cap_p, y_p, usu):
    """Choix d'un ménage au premier emploi stable. u : rang d'héritage ; j : décile de revenu ; s : secteur ; typ : seul,
    couple, famille ; cap_p, y_p : capital et revenu par personne ; usu : part d'usufruit pour le jeune (au taux r_np).
    Renvoie les probabilités (par personne) des issues F (foncière), banque, loue, et les grandeurs utiles."""
    n_pers = 1 if typ == 'seul' else 2
    cap = cap_p * n_pers                                  # le conjoint a un capital du même ordre (H-FA9)
    y = y_p * (1.0 if typ == 'seul' else h['coef_couple'])
    t0 = TAILLE_CIBLE[typ]
    P0 = prix_logement(s, t0)
    contrib = lambda P: U.TAUX_CONTRIBUTION_RP * P / 12
    plafond = h['effort_max'] * y
    lf, lb, m0 = financement(reg, h, s, P0, cap)
    ok0 = (m0 + contrib(P0)) <= plafond
    # montée en gamme (H-FA14) : la taille suivante si elle reste sous un effort de `effort_montee`
    taille, P, lfin, lbank, m = t0, P0, lf, lb, m0
    t1 = SUIVANTE[t0]
    p_up = 0.0
    if ok0 and t1:
        P1 = prix_logement(s, t1)
        lf1, lb1, m1 = financement(reg, h, s, P1, cap)
        if m1 + contrib(P1) <= h['effort_montee'] * y:
            p_up = h['montee']
    # accès au crédit bancaire en pleine propriété (H-FA12, d'après H-CO9 ; précarité réduite par l'emploi stable)
    p_apport = min(1.0, 0.15 + 0.75 * u)
    solv = 1.0 if U.mensualite(0.9 * P0, h['taux_banque'], 25) + contrib(P0) <= plafond else 0.0
    prec = (0.30 - 0.25 * j / 9) * h['prec']
    b = solv * p_apport * (1 - prec)
    # ce que le ménage abandonne (H-FA13, d'après H-CO12) et ce que le forfait lui coûte en plus de la valeur de l'usufruit
    gainF = cap + (1 - reg['f']) * P0 - (1 - usu) * P0 - h['phi'] * P0
    alt = reg['parts_a_vie'] * cap * h['v_parts']        # valeur subjective des parts à vie s'il n'entre pas (H-CO14)
    prendF = 1.0 if gainF >= -alt else 0.0
    loyer = loyer_logement(s, t0)
    cout_F = m0 + contrib(P0) + h['charges'] * P0 / 12
    W = h['W']
    fF = 1.0 if ok0 else 0.0
    # (a) veut se fixer et a accès à la banque : foncière si elle l'emporte, ou par conviction (adhérents)
    qa = fF * (h['adh'] + (1 - h['adh']) * prendF)
    pF_banque = W * b * qa
    p_banque = W * b * (1 - qa)
    # (b) veut se fixer sans accès bancaire : foncière s'il peut payer
    pF_nb = W * (1 - b) * fF
    p_loue = W * (1 - b) * (1 - fF)
    # (c) ne voulait pas se fixer : effet d'appel si la foncière coûte moins que le loyer (H-FA16)
    e = h['appel'] * fF * (1.0 if cout_F <= loyer else 0.0)
    pF_appel = (1 - W) * e
    p_loue += (1 - W) * (1 - e)
    pF = pF_banque + pF_nb + pF_appel
    return dict(F=pF, F_banque=pF_banque, F_nb=pF_nb, F_appel=pF_appel, banque=p_banque, loue=p_loue,
                p_up=p_up, taille=t0, taille_up=t1, cap=cap, cap_p=cap_p, y=y, P=P0, m=m0, lf=lf, lb=lb,
                effort=(m0 + contrib(P0)) / y if y > 0 else float('inf'), loyer=loyer, cout_F=cout_F,
                m_banque=U.mensualite(0.9 * P0, h['taux_banque'], 25), contrats=CONTRATS_PAR_PERSONNE[typ],
                ok=ok0, gainF=gainF, sans=W * b)


# ------------------------------------------------------------------ agrégation --------------------------------------
def groupes_heritage(her, p0, n=40):
    """Regroupe les 200 quantiles de la loi des héritages (H-FA5, `capital-de-depart-options/donnees/heritages.json`)
    en n groupes de rangs ; renvoie [(rang central u, héritage moyen du groupe)]."""
    qs = her['quantiles'][str(p0)]
    k = len(qs) // n
    return [((i * k + k / 2) / len(qs), sum(qs[i * k:(i + 1) * k]) / k) for i in range(n)]


def cellules(reg, h, her, S, table, n_her=40):
    """Toutes les cellules (héritage × revenu × secteur × âge au premier emploi stable × type de ménage) avec leur poids
    dans une génération et le choix associé. Les poids somment à la part qui trouve un emploi stable avant 36 ans."""
    ages, _ = ages_emploi_stable(h)
    parts_s = {k: h['part_secteur'][k] for k in SECT}
    tot = sum(parts_s.values())
    usu = {a: U.valeur_usufruit(U.survies(table, int(round(a)), 2027, 0.01), h['r_np']) for a, _ in ages}
    out = []
    G = groupes_heritage(her, h['p0'], n_her)
    for u, H in G:
        cap_p = reg['G'] * math.exp(-H / reg['K'])
        wy = O.poids_revenu(u, h['rho'])
        for j in range(10):
            for ks in SECT:
                s = S[ks]
                for a, pa in ages:
                    y_p = revenu(h, j, a)
                    tm = types_menage(h, a)
                    for it, typ in enumerate(TYPES):
                        w = (1 / len(G)) * wy[j] * parts_s[ks] / tot * pa * tm[it]
                        if w <= 0:
                            continue
                        r = choix(reg, h, u, j, s, a, typ, cap_p, y_p, usu[a])
                        out.append(dict(w=w, u=u, H=H, j=j, s=ks, a=a, typ=typ, r=r))
    return out


def rationner(cel, reg, cohorte):
    """Plafond d'entrées (H-FA60) : `quota` en part d'une génération (personnes). Priorité 'heritage' : les rangs
    d'héritage les plus bas d'abord (publics prioritaires, § 20 de l'esquisse) ; 'prorata' : à proportion. Renvoie un
    facteur d'accès par rang d'héritage {u: k}."""
    q = reg.get('quota')
    us = sorted({c['u'] for c in cel})
    demande = {u: 0.0 for u in us}
    for c in cel:
        demande[c['u']] += c['w'] * c['r']['F']
    tot = sum(demande.values())
    if not q or tot <= q:
        return {u: 1.0 for u in us}
    if reg.get('priorite') == 'prorata':
        return {u: q / tot for u in us}
    k, reste = {}, q
    for u in us:
        d = demande[u]
        k[u] = 1.0 if d <= reste else (reste / d if d > 0 else 0.0)
        reste = max(0.0, reste - d)
    return k


def agreger(reg, h, her, S, table, n_her=40):
    """Agrège une génération : afflux (personnes, contrats), répartition par secteur et taille, additionnalité,
    paramètres moyens pour la simulation de la foncière, accès par décile, coût public du capital."""
    cel = cellules(reg, h, her, S, table, n_her)
    N = h['cohorte']
    kq = rationner(cel, reg, N)
    ages, jamais = ages_emploi_stable(h)
    A = dict(F=0.0, F_banque=0.0, F_nb=0.0, F_appel=0.0, banque=0.0, loue=0.0, refuses=0.0, sans=0.0)
    seg = {(ks, t): dict(contrats=0.0, add=0.0, valeur=0.0) for ks in SECT for t in TAILLES}
    dec_h = [dict(w=0.0, F=0.0, proprio=0.0, cap=0.0, sans=0.0) for _ in range(10)]
    dec_y = [dict(w=0.0, F=0.0, proprio=0.0, effort=0.0, m=0.0, sans=0.0) for _ in range(10)]
    sect = {ks: dict(w=0.0, F=0.0, proprio=0.0, m=0.0, loyer=0.0, effort=0.0, mb=0.0, sans=0.0, jeunes=0.0) for ks in SECT}
    contrats, prix_c, apport_c, banque_c, lf_c, aide_c = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ages_c = {a: 0.0 for a, _ in ages}
    cap_F, cap_hors = 0.0, 0.0
    up = 0.0
    for c in cel:
        r, w = c['r'], c['w']
        k = kq[c['u']]
        F = r['F'] * k
        refus = r['F'] * (1 - k)
        # les écartés par le quota retombent : à la banque s'ils y avaient accès, sinon en location (H-FA60)
        fb = r['F_banque'] / r['F'] if r['F'] > 0 else 0.0
        A['F'] += w * F
        A['F_banque'] += w * r['F_banque'] * k
        A['F_nb'] += w * r['F_nb'] * k
        A['F_appel'] += w * r['F_appel'] * k
        A['banque'] += w * (r['banque'] + refus * fb)
        A['loue'] += w * (r['loue'] + refus * (1 - fb))
        A['refuses'] += w * refus
        A['sans'] += w * r['sans']       # propriétaire à la banque sans dispositif (contrefactuel)
        nc = w * F * r['contrats']                      # contrats (ménages) par personne de la génération
        contrats += nc
        # taille retenue : montée en gamme avec probabilité p_up
        for t, pt in ((r['taille'], 1 - r['p_up']), (r['taille_up'], r['p_up'])):
            if t is None or pt <= 0:
                continue
            P = S[c['s']]['prix_' + t]
            sg = seg[(c['s'], t)]
            sg['contrats'] += nc * pt
            sg['valeur'] += nc * pt * P
            # additionnalité (H-FA17) : sans accès bancaire ou par effet d'appel, un achat de plus ; avec accès,
            # α (achat avancé) ; la montée en gamme déplace la demande de la taille cible vers la suivante
            add = w * k * r['contrats'] * pt * (r['F_nb'] + r['F_appel'] + h['alpha'] * r['F_banque'])
            sg['add'] += add
            if t != r['taille']:
                cible = seg[(c['s'], r['taille'])]
                cible['add'] -= w * k * r['contrats'] * pt * r['F_banque'] * (1 - h['alpha'])
                sg['add'] += w * k * r['contrats'] * pt * r['F_banque'] * (1 - h['alpha'])
            prix_c += nc * pt * P
            _, lb, _ = financement(reg, h, S[c['s']], P, r['cap'])
            banque_c += nc * pt * lb
        up += nc * r['p_up']
        apport_c += nc * r['cap']
        lf_c += nc * r['lf']
        # aide au logement évitée après remboursement, pour qui serait resté locataire (H-FA45, d'après H-CO31)
        aide_c += nc * (r['F_nb'] + r['F_appel']) / max(r['F'], 1e-12) * O.aide_logement(r['y'] / (1 if c['typ'] == 'seul' else h['coef_couple']) * h['k_ret'])
        ages_c[c['a']] += nc
        cap_F += w * F * r['cap_p']
        cap_hors += w * (1 - F) * r['cap_p'] * reg['parts_a_vie']
        prop = F + r['banque'] + refus * fb
        d = min(9, int(c['u'] * 10))
        dec_h[d]['w'] += w; dec_h[d]['F'] += w * F; dec_h[d]['proprio'] += w * prop; dec_h[d]['cap'] += w * r['cap_p']; dec_h[d]['sans'] += w * r['sans']
        dy = dec_y[c['j']]
        dy['w'] += w; dy['F'] += w * F; dy['proprio'] += w * prop; dy['sans'] += w * r['sans']
        if r['ok']:
            dy['effort'] += w * F * r['effort']; dy['m'] += w * F * r['m']
        st = sect[c['s']]
        st['w'] += w; st['F'] += w * F; st['proprio'] += w * prop
        st['m'] += w * F * r['m']; st['loyer'] += w * F * r['loyer']; st['effort'] += w * F * r['effort']
        st['mb'] += w * F * r['m_banque']; st['sans'] += w * r['sans']; st['jeunes'] += w
    # ceux qui n'ont pas d'emploi stable avant 36 ans : hors dispositif, parts à vie sur leur capital (H-FA2)
    cap_moyen = sum(reg['G'] * math.exp(-Hh / reg['K']) for _, Hh in groupes_heritage(her, h['p0'], n_her)) / n_her
    cap_hors += jamais * cap_moyen * reg['parts_a_vie']
    res = dict(reg=reg, cel_n=len(cel), A=A, seg=seg, jamais=jamais, kq=kq)
    res['part_F'] = A['F']
    res['jeunes_F'] = A['F'] * N
    res['contrats'] = contrats * N
    res['prix_contrat'] = prix_c / contrats if contrats else 0.0
    res['apport_contrat'] = apport_c / contrats if contrats else 0.0
    res['banque_contrat'] = banque_c / contrats if contrats else 0.0
    res['lf_contrat'] = lf_c / contrats if contrats else 0.0
    res['aide_contrat'] = aide_c / contrats if contrats else 0.0
    res['montee'] = up / contrats if contrats else 0.0
    res['ages_contrats'] = tuple((int(round(a)), v / contrats) for a, v in ages_c.items()) if contrats else ((25, 1.0),)
    res['cout_capital_md'] = N * (cap_F + cap_hors) / 1e9
    res['cout_apports_md'] = N * cap_F / 1e9
    res['cout_parts_md'] = N * cap_hors / 1e9
    res['proprio'] = A['F'] + A['banque']
    res['dec_h'] = [{k: (v / d['w'] if k != 'w' and d['w'] else v) for k, v in d.items()} for d in dec_h]
    res['dec_y'] = [dict(w=d['w'], F=d['F'] / d['w'] if d['w'] else 0, proprio=d['proprio'] / d['w'] if d['w'] else 0,
                         effort=d['effort'] / d['F'] if d['F'] else float('nan'), m=d['m'] / d['F'] if d['F'] else float('nan'),
                         sans=d['sans'] / d['w'] if d['w'] else 0)
                    for d in dec_y]
    res['proprio_D15'] = sum(d['proprio'] for d in res['dec_h'][:5]) / 5
    res['sans_D15'] = sum(d['sans'] for d in res['dec_h'][:5]) / 5
    res['proprio_sans'] = A['sans']
    res['F_D15'] = sum(d['F'] for d in res['dec_h'][:5]) / 5
    res['secteurs'] = {ks: dict(F=v['F'] / v['w'], proprio=v['proprio'] / v['w'],
                                m=v['m'] / v['F'] if v['F'] else float('nan'), loyer=v['loyer'] / v['F'] if v['F'] else float('nan'),
                                effort=v['effort'] / v['F'] if v['F'] else float('nan'), mb=v['mb'] / v['F'] if v['F'] else float('nan'),
                                sans=v['sans'] / v['w'], jeunes_F=v['F'] * N)
                       for ks, v in sect.items()}
    for v in seg.values():
        v['contrats'] *= N
        v['add'] *= N
        v['valeur'] *= N
    return res


def poids_total(cel):
    return sum(c['w'] for c in cel)


if __name__ == '__main__':
    print('Module de fonctions : lancer calculer.py')
