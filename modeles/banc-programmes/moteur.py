#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Moteur commun du banc d'essai des programmes (modeles/banc-programmes/). Fonctions pures : aucune lecture de fichier, aucune écriture, aucun hasard hors de l'objet `random.Random` passé en argument.
Les données des modèles (retraites, OpenFisca, patrimoine, transmissions, trajectoire de notre système) arrivent par le paramètre `ctx`, construit par relancer.py à partir des caches de ponts.py.

Convention : Md€ par an, euros de 2025 (constants : un montant suit le PIB nominal) ; effet sur le solde : positif = améliore. Les scénarios « favorable / central / défavorable » des modèles
sont lus comme les centiles 10 / 50 / 90 d'une loi ; un facteur latent commun « comportement » (réactions des assiettes : érosion, exil, élasticité du revenu imposable) relie tous les modèles.
Des ordres de grandeur sous hypothèses, jamais des prédictions.
"""
import math
from statistics import NormalDist
import leviers2 as L2
import leviers_rn as LRN

N01 = NormalDist()
Z90 = N01.inv_cdf(0.9)
ANNEE_BASE = 2025            # dette de départ : fin 2025 (Insee) ; les années 2026 et suivantes sont simulées
ANNEE_FIN = 2058
PIB_2024 = 2935.0            # Md€, Insee (même base que sources/calculs/bilan_global.py)
PO_2024 = 1253.2             # Md€, prélèvements obligatoires 2024
DEPENSE_2024 = 1672.6        # Md€, dépense publique 2024
HORS_PO_PCT = (DEPENSE_2024 - 169.1 - PO_2024) / PIB_2024   # recettes hors prélèvements obligatoires, en part du PIB (inchangées)
TAUX_RETOUR = 0.45           # part du PIB supplémentaire qui revient en recettes publiques (≈ recettes publiques / PIB) ⚠️ hypothèse (V31008)
ETI_POINTS = [(-Z90, 0.12), (0.0, 0.25), (Z90, 0.40)]   # Saez-Slemrod-Giertz 2012, via modeles/reactions-assiettes : élasticité du revenu imposable, z -> valeur


# ------------------------------------------------------------------ lois
def quantile(dist, u):
    """Quantile de la loi `dist` au rang u (0 < u < 1). Formes : fixe, tri (support bas-haut, mode central), med (support bas-haut, médiane = central), unif (bas-haut), lognorm (centiles 10 et 90 = bas et haut, médiane = central), normale (idem)."""
    f = dist.get('forme', 'tri')
    b, c, h = dist.get('bas'), dist.get('central'), dist.get('haut')
    if f == 'fixe':
        return c
    if f == 'unif':
        return b + (h - b) * u
    if f == 'med':
        # deux pans uniformes : support bas-haut, MÉDIANE = central (u < 0,5 : de bas à central ; u >= 0,5 : de central à haut) ; sert aux économies annoncées, où « haut » = l'annonce du programme
        return b + (c - b) * (u / 0.5) if u < 0.5 else c + (h - c) * ((u - 0.5) / 0.5)
    if f == 'tri':
        if h == b:
            return c
        fc = (c - b) / (h - b)
        if u < fc:
            return b + math.sqrt(u * (h - b) * (c - b))
        return h - math.sqrt((1 - u) * (h - b) * (h - c))
    if f == 'lognorm':
        mu = math.log(c)
        sg = (math.log(h) - math.log(b)) / (2 * Z90)
        return math.exp(mu + sg * N01.inv_cdf(u))
    if f == 'normale':
        sg = (h - b) / (2 * Z90)
        return c + sg * N01.inv_cdf(u)
    raise ValueError('forme inconnue : %r' % f)


def interp_z(points, z):
    """Interpolation linéaire par morceaux de points [(z, valeur)] triés, prolongée linéairement au-delà des extrémités (pente du dernier segment)."""
    if z <= points[0][0]:
        (z0, v0), (z1, v1) = points[0], points[1]
        return v0 + (v1 - v0) * (z - z0) / (z1 - z0)
    for (z0, v0), (z1, v1) in zip(points, points[1:]):
        if z <= z1:
            return v0 + (v1 - v0) * (z - z0) / (z1 - z0)
    (z0, v0), (z1, v1) = points[-2], points[-1]
    return v1 + (v1 - v0) * (z - z1) / (z1 - z0)


def trois_scenarios(vals, z):
    """vals = [favorable, central, défavorable] d'un modèle -> valeur au facteur latent z (favorable = centile 10, défavorable = centile 90)."""
    return interp_z([(-Z90, vals[0]), (0.0, vals[1]), (Z90, vals[2])], z)


def interp1(xs, ys, x):
    """Interpolation linéaire sur une grille, prolongée à pente constante."""
    return interp_z(list(zip(xs, ys)), x)


# ------------------------------------------------------------------ leviers branchés sur nos modèles (valeurs = effet sur le solde, + améliore, Md€/an en régime)
def levier_retraites_age(ctx, p):
    """Âge effectif moyen de départ visé p['age_effectif'] -> coût (dépense + recettes perdues) d'un départ avancé, d'après modeles/retraites/age_libre.js (sans décote), recalé sur la taille de la cohorte de 63 ans en 2032 du modèle modeles/demographie/. Retourne (recette, dépense)."""
    g = ctx['retraites']['grille']
    delta = max(0.0, ctx['retraites']['ageBase2032'] - p['age_effectif'])
    xs = [x['delta'] for x in g]
    cout = interp1(xs, [x['depense2032'] + x['recettes2032'] for x in g], delta) * ctx.get('demographie', {}).get('facteur_cohorte_2032', 1.0)
    return 0.0, max(0.0, cout)


def levier_ir(ctx, p, z):
    """Barème à 14 tranches et fin du quotient conjugal : OpenFisca-France sur population stylisée. p : tau_top, rc (rapport de revenu des conjoints), calage ; z : facteur comportement (élasticité du revenu imposable)."""
    gr = ctx['openfisca']['grille']
    taus = [0.60, 0.75, 0.90]
    etis = [0.0, 0.12, 0.25, 0.40]

    def valeur_eti(tau, rc, eti):
        cle = 'tau%.2f_indiv1_rc%.1f' % (tau, rc)
        ys = [gr[cle]['statique'], gr[cle]['eti_0.12'], gr[cle]['eti_0.25'], gr[cle]['eti_0.40']]
        return interp1(etis, ys, eti)

    def valeur(tau, eti):
        v = [interp1([0.4, 0.6, 0.8], [valeur_eti(tau, rc, eti) for rc in (0.4, 0.6, 0.8)], p['rc'])]
        return v[0]
    eti = max(0.0, interp_z(ETI_POINTS, z))
    par_tau = [valeur(t, eti) for t in taus]
    delta_ir = interp1(taus, par_tau, p['tau_top']) * p.get('calage', 1.0)
    return delta_ir, 0.0


def levier_isf(ctx, p, z):
    """ISF rétabli (barème du module grandes_fortunes_0511.varianteB), de « sobre » (p['intensite'] = 0) à « renforcé » (1), net de l'IFI actuel. Retourne (recette nette, 0)."""
    s = ctx['systeme']
    sobre = trois_scenarios([x['recette'] for x in s['isf']['sobre']], z)
    ren = trois_scenarios([x['recette'] for x in s['isf']['renforce']], z)
    brut = sobre + (ren - sobre) * p['intensite']
    return brut - ctx['ifi_actuel'], 0.0


def levier_plancher(ctx, p, z):
    """Impôt plancher de 2 % au-dessus de 100 M€ (complément net de l'ISF et du prélèvement unique), avec érosion et exil du module. Retourne (recette nette, 0)."""
    s = ctx['systeme']
    sobre = trois_scenarios([x['net'] for x in s['plancher']['sobre']], z)
    ren = trois_scenarios([x['net'] for x in s['plancher']['renforce']], z)
    return sobre + (ren - sobre) * p['intensite'], 0.0


def levier_succession(ctx, p, z):
    """Successions : exonération de 150 000 € puis taux plat p['taux_plat'] (module transmissions_0611.recette), plus plafond d'héritage p['plafond'] (reprise de l'excédent net des comportements). Retourne (recette nette des droits actuels, 0)."""
    s = ctx['systeme']['succession']
    taux = [0.20, 0.35, 0.45]
    noms = ['plat20', 'plat35', 'plat45']
    vals = [trois_scenarios([x['netActuel'] for x in s[n]], z) for n in noms]
    base = interp1(taux, vals, p['taux_plat'])
    plaf = ctx['systeme']['plafond'][str(int(p['plafond']))] if p.get('plafond') else None
    extra = trois_scenarios([x['net'] for x in plaf], z) if plaf else 0.0
    return base + extra, 0.0


def levier_zucman(ctx, z):
    """Impôt plancher de 2 % au-dessus de 100 M€ sur le droit actuel, SANS ISF (programme du PS, 09/11/2026) : module grandes_fortunes_0511.zucmanSurDroitActuel (cache `zucman_droit_actuel`),
    recette nette de l'impôt déjà payé, avec érosion et exil ; scénarios favorable / central / défavorable lus au facteur « comportement ». Retourne (recette nette, 0)."""
    return trois_scenarios([x['net'] for x in ctx['systeme']['zucman_droit_actuel']], z), 0.0


# ------------------------------------------------------------------ évaluation d'une mesure
def _u_param(lam, z_f, z_i):
    return N01.cdf(lam * z_f + math.sqrt(max(0.0, 1 - lam * lam)) * z_i)


def evaluer_mesure(m, tirage, ctx):
    """Effet en régime d'une mesure pour un tirage. tirage = {'z': {facteur: z}, 'zi': {param: z idiosyncratique}}.
    Retourne (recettes, dépenses) en Md€ (≥ 0 en général ; une recette peut être négative). Effet sur le solde = recettes - dépenses."""
    lev = m['levier']
    z = tirage['z']

    def lam_u(nom_param, dist, facteur=None, lam=None):
        f = facteur if facteur is not None else m.get('facteur')
        l = m.get('lambda', 0.0) if lam is None else lam
        zf = z.get(f, 0.0) if f else 0.0
        zi = tirage['zi'].get((m['id'], nom_param), 0.0)
        return quantile(dist, _u_param(l, zf, zi))

    def params():
        out = {}
        for k, d in m.get('parametres', {}).items():
            out[k] = lam_u(k, d, facteur=d.get('facteur'), lam=d.get('lambda', 0.0)) if isinstance(d, dict) else d
        return out
    if lev == 'cout_unitaire':
        v = lam_u('valeur', m['valeur'])
        return (v, 0.0) if m['sens'] == 'recette' else (0.0, v)
    if lev == 'produit':
        v = 1.0
        for k, d in m['facteurs_produit'].items():
            v *= lam_u(k, d, facteur=d.get('facteur'), lam=d.get('lambda', 0.0))
        v = v / m.get('echelle', 1.0) + m.get('constante', 0.0)
        return (v, 0.0) if m['sens'] == 'recette' else (0.0, v)
    p = params()
    zc = z.get('comportement', 0.0)
    if lev == 'retraites_age':
        return levier_retraites_age(ctx, p)
    if lev == 'ir_openfisca':
        r, d = levier_ir(ctx, p, zc)
        return r, d
    if lev == 'isf':
        return levier_isf(ctx, p, zc)
    if lev == 'plancher':
        return levier_plancher(ctx, p, zc)
    if lev == 'succession':
        return levier_succession(ctx, p, zc)
    if lev == 'smic':
        return L2.levier_smic(ctx, p)
    if lev == 'pension_min':
        return L2.levier_pension_min(ctx, p)
    if lev == 'carburant':
        return L2.levier_carburant(ctx, p)
    if lev == 'nationalisation':
        return L2.levier_nationalisation(ctx, p)
    if lev == 'iff':
        return LRN.levier_iff(ctx, p, zc)
    if lev == 'ir_jeunes':
        return LRN.levier_ir_jeunes(ctx, p)
    if lev == 'zucman':
        return levier_zucman(ctx, zc)
    raise ValueError('levier inconnu : %r' % lev)


def parametres_tires(m, tirage):
    """Paramètres d'une mesure pour un tirage (même tirage que evaluer_mesure) : lois tirées, constantes laissées telles quelles."""
    out = {}
    z = tirage['z']
    for k, d in m.get('parametres', {}).items():
        if isinstance(d, dict):
            f = d.get('facteur')
            lam = d.get('lambda', 0.0)
            zf = z.get(f, 0.0) if f else 0.0
            zi = tirage['zi'].get((m['id'], k), 0.0)
            out[k] = quantile(d, _u_param(lam, zf, zi))
        else:
            out[k] = d
    return out


def operation_capital(m, tirage):
    """Opération en capital d'une mesure de nationalisation pour un tirage : (prix total Md€, part transférée gratuitement). Le reste du prix est une opération financière (dette, pas déficit)."""
    if m['levier'] != 'nationalisation':
        return 0.0, 0.0
    p = parametres_tires(m, tirage)
    return L2.prix_nationalisation(p), p.get('part_transfert', 0.0)


def fractions_montee(m, n=5):
    """Part du régime atteinte chaque année depuis le début (n années ; ensuite 1). Champ 'montee' (liste) ou, à défaut, de l'an 1 (champ 'an1_part') à 1 en ligne droite."""
    if 'montee' in m:
        f = list(m['montee'])
        return (f + [1.0] * n)[:n]
    a = m.get('an1_part', 1.0)
    return [a + (1 - a) * i / (n - 1) for i in range(n)]


def serie_effet(m_rd, programme, operations=None):
    """m_rd : liste de (mesure, recettes, dépenses) en régime. operations : liste de (mesure, prix, part transférée) pour les nationalisations.
    Retourne dict année -> (recettes, dépenses, solde) en Md€ de 2025. Un flux s'arrête après l'année m['fin'] si elle est donnée ; un transfert en capital (part_transfert du prix) est une dépense ponctuelle
    étalée selon m['etalement'] (parts par année depuis le début)."""
    debut, regime = programme['debut'], programme['regime']
    n = regime - debut + 1
    out = {}
    for an in range(debut, ANNEE_FIN + 1):
        r_tot = d_tot = 0.0
        for m, r, d in m_rd:
            if m.get('fin') and an > m['fin']:
                continue
            f = fractions_montee(m, n)
            fr = f[an - debut] if an - debut < n else 1.0
            r_tot += r * fr
            d_tot += d * fr
        for m, prix, pt in (operations or []):
            et = m.get('etalement', [1.0])
            if 0 <= an - debut < len(et):
                d_tot += prix * pt * et[an - debut]
        out[an] = (r_tot, d_tot, r_tot - d_tot)
    return out


def chocs_dette(operations, programme):
    """Opérations financières (acquisition de titres, financée par emprunt) : variation de la dette brute, Md€ de 2025 par année : prix x (1 − part transférée) x étalement. Pas d'effet sur le déficit."""
    debut = programme['debut']
    out = {}
    for m, prix, pt in operations:
        for i, part in enumerate(m.get('etalement', [1.0])):
            out[debut + i] = out.get(debut + i, 0.0) + prix * (1.0 - pt) * part
    return out


# ------------------------------------------------------------------ dette : même recursion que modeles/systeme-ideal (variante_dette_stable.js, stress.js, retraites_aisees_0611.trajActuel)
def trajectoire_dette(effet_md, eco, macro, annee_fin=ANNEE_FIN, chocs=None):
    """effet_md : dict année -> amélioration du solde primaire (Md€ de 2025) par rapport au droit actuel. eco : paramètres de modeles/risques/stress.js ECO. macro : {'g', 'r'}.
    Retourne {année: {'ratio', 'deficit_pct', 'interets_pct', 'primaire_pct'}}. Droit actuel : solde primaire de 2024 maintenu en part du PIB (-103,4 Md€ de 2025)."""
    g, rm = macro['g'], macro['r']
    D = eco['dette0']
    ieff = eco['interets0'] / eco['dette0']
    base_primaire = -(eco['deficit2024'] - eco['interets0'])      # Md€ de 2025 (négatif)
    out = {}
    for an in range(ANNEE_BASE + 1, annee_fin + 1):
        kk = (1 + g) ** (an - ANNEE_BASE)
        ieff = ieff + (rm - ieff) / eco['dureeDette']
        interets = ieff * D
        pb = (base_primaire + effet_md.get(an, 0.0)) * kk
        D_new = D - (pb - interets) + (chocs or {}).get(an, 0.0) * kk
        Y = eco['pib0'] * kk
        out[an] = {'ratio': D_new / Y, 'deficit_pct': (D_new - D - (chocs or {}).get(an, 0.0) * kk) / Y, 'interets_pct': interets / Y, 'primaire_pct': pb / Y}
        D = D_new
    return out


# ------------------------------------------------------------------ notre système : modules à bornes favorable / défavorable (programmes/langagement/mesures.py, js/pont_incertitudes.js)
def z_module(m, tirage):
    """Rang normal du module : lambda x facteur latent commun + racine(1 - lambda^2) x aléa propre (même construction que `_u_param`, en restant sur l'échelle normale ; z < 0 : favorable, z > 0 : défavorable)."""
    lam = m.get('lambda', 0.0)
    zf = tirage['z'].get(m.get('facteur'), 0.0) if m.get('facteur') else 0.0
    zi = tirage['zi'].get((m['id'], 'valeur'), 0.0)
    return lam * zf + math.sqrt(max(0.0, 1 - lam * lam)) * zi


def poids_module(z):
    """Poids sur l'écart favorable et sur l'écart défavorable : interpolation linéaire par morceaux entre (-Z90, favorable), (0, central), (Z90, défavorable), prolongée à pente constante (comme `trois_scenarios`)."""
    return max(0.0, -z) / Z90, max(0.0, z) / Z90


def effet_modules(mesures, tirage, annees):
    """Écart au central de notre système pour un tirage : retourne (delta par année, delta des seules recettes par année, valeur de chaque module en 2038 = central + écart). Md€ de 2025, + améliore le solde.
    `annees` : liste des années des tableaux d_fav et d_def (2029 à 2058)."""
    n = len(annees)
    tot = [0.0] * n
    rec = [0.0] * n
    par = {}
    i38 = annees.index(2038)
    for m in mesures:
        wf, wd = poids_module(z_module(m, tirage))
        df, dd = m['d_fav'], m['d_def']
        dc = m.get('d_c')          # décalage du central (variante « moins sévère » : le central du module bouge ; d_fav et d_def sont alors relatifs au nouveau central) ; absent = 0
        sens_po = m['sens'] == 'po'
        for i in range(n):
            v = wf * df[i] + wd * dd[i] + (dc[i] if dc else 0.0)
            tot[i] += v
            if sens_po:
                rec[i] += v
        par[m['id']] = (m.get('central') or 0.0) + wf * df[i38] + wd * dd[i38]   # 'central' est déjà décalé de d_c dans la variante
    return tot, rec, par


def effet_systeme_md(serie, eco):
    """Effet (Md€ de 2025) de notre système sur le solde primaire, déduit de sa trajectoire exportée (primaire en part du PIB) : (primaire + 103,4 / PIB) x PIB. Années 2029 et suivantes."""
    base = (eco['deficit2024'] - eco['interets0'])
    return {2029 + k: serie['primaire'][k] * eco['pib0'] + base for k in range(len(serie['primaire']))}


# ------------------------------------------------------------------ relance macroéconomique
def retour_relance(rec_dep_par_an, m_dep, ratio_rec, offre_pct, eco, taux_retour=TAUX_RETOUR):
    """Effet de relance (Md€ de 2025, + améliore le solde) : delta PIB / PIB = m_dep x D / PIB - ratio_rec x m_dep x R / PIB + offre ; retour sur le solde = taux_retour x delta PIB.
    rec_dep_par_an : dict année -> (R, D) recettes et dépenses nouvelles (Md€). L'effet d'offre (niveau du PIB, %) est atteint en régime et appliqué linéairement sur la montée."""
    out = {}
    pib = eco['pib0']
    for an, (r, d) in rec_dep_par_an.items():
        dpib = m_dep * d / pib - ratio_rec * m_dep * r / pib
        out[an] = taux_retour * (dpib + offre_pct) * pib
    return out


# ------------------------------------------------------------------ Monte-Carlo
def centile(xs, q):
    """Centile q (0-1) par interpolation linéaire des valeurs triées."""
    s = sorted(xs)
    pos = q * (len(s) - 1)
    i = int(math.floor(pos))
    j = min(i + 1, len(s) - 1)
    return s[i] + (s[j] - s[i]) * (pos - i)


def tirer(rng, mesures, facteurs, rho=1.0):
    """Un tirage : facteurs latents (z ~ N(0,1) ; rho multiplie les corrélations via les 'lambda' des mesures, borné à 0,95) et aléas propres à chaque paramètre."""
    z = {f: rng.gauss(0, 1) for f in facteurs}
    zi = {}
    for m in mesures:
        for k in list(m.get('parametres', {}).keys()) + list(m.get('facteurs_produit', {}).keys()) + ['valeur']:
            zi[(m['id'], k)] = rng.gauss(0, 1)
    return {'z': z, 'zi': zi}


def appliquer_rho(mesures, rho):
    """Copie des mesures avec les 'lambda' multipliés par rho (plafonné à 0,95) : sensibilité aux corrélations (rho = 0 : indépendance)."""
    out = []
    for m in mesures:
        mm = dict(m)
        if 'lambda' in mm:
            mm['lambda'] = min(0.95, mm['lambda'] * rho)
        for cle in ('parametres', 'facteurs_produit'):
            if cle in mm:
                mm[cle] = {k: (dict(d, **{'lambda': min(0.95, d.get('lambda', 0.0) * rho)}) if isinstance(d, dict) else d) for k, d in mm[cle].items()}
        out.append(mm)
    return out


def bornes_extremes(mesures, ctx, facteurs):
    """Empilement des extrêmes pour mémoire : chaque mesure prend son pire (puis son meilleur) résultat parmi les combinaisons de facteurs et de paramètres aux centiles 10 et 90, et on additionne.
    Retourne (défavorable, favorable) du solde de régime, Md€."""
    pire = meilleur = 0.0
    for m in mesures:
        vals = []
        for zf in (-Z90, Z90):
            for zp in (-Z90, Z90):
                t = {'z': {f: zf for f in facteurs}, 'zi': _zi_const(m, zp)}
                r, d = evaluer_mesure(m, t, ctx)
                vals.append(r - d)
        pire += min(vals)
        meilleur += max(vals)
    return pire, meilleur


def _zi_const(m, v):
    zi = {(m['id'], 'valeur'): v}
    for k in list(m.get('parametres', {}).keys()) + list(m.get('facteurs_produit', {}).keys()):
        zi[(m['id'], k)] = v
    return zi


def mediane_mesure(m, ctx):
    """Valeur (recettes, dépenses) au tirage médian (tous les facteurs et aléas à 0)."""
    return evaluer_mesure(m, {'z': {}, 'zi': {}}, ctx)


def deficit_stabilisant_pct(ratio, g):
    return ratio * g / (1 + g)
