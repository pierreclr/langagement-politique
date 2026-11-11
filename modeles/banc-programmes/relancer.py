#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Régénère tout le banc d'essai : ponts vers nos modèles (si disponibles), chiffrage de chaque programme, Monte-Carlo, tests, et écrit resultats.md et donnees/resultats.json.
Usage : python3 -I modeles/banc-programmes/relancer.py [--ponts] [--tirages N]
  --ponts : relance d'abord jsc (modèles JS) et OpenFisca (si le venv existe) pour réécrire les caches ; sinon les caches versionnés sont lus.
"""
import importlib.util, json, os, random, sys, time

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
import moteur as M      # noqa: E402
import ponts            # noqa: E402

GRAINE = 20261108
TIRAGES = 10000
FACTEURS = ['comportement', 'cout', 'isf']
IFI_ACTUEL = 2.739       # Md€, 2024 (sources/donnees/impots_inventaire.csv, id 18)
# Multiplicateurs de relance (loi tri : support bas-haut, mode central) ; sources dans resultats.md § relance
M_DEP = {'forme': 'tri', 'bas': 0.3, 'central': 0.8, 'haut': 1.5}
RATIO_REC = {'forme': 'tri', 'bas': 0.3, 'central': 0.5, 'haut': 1.0}
OFFRE = {'forme': 'tri', 'bas': -0.010, 'central': -0.003, 'haut': 0.0}
ANNEES_CLES = (2028, 2032, 2038, 2058)
# Programmes chiffrés. Chaque programme a son propre générateur (même graine) : en ajouter un ne change pas les tirages des autres.
# 'lr' (plan Retailleau du 12/10/2026) et 'ps' (contre-budget 2027 du groupe socialiste, candidat R. Glucksmann) ajoutés le 09/11/2026 ; ils ne sont pas rejoués dans la variante « moins sévère » (§ 10).
# 'gl' (livret climat de R. Glucksmann, 09/11/2026 ; chiffrage partiel, colonne distincte du PS) ajouté le 11/11/2026, même règle.
PROGRAMMES = ('fil_de_l_eau', 'lfi', 'rn', 'langagement', 'lr', 'ps', 'gl')
AJOUTS_0911 = ('lr', 'ps', 'gl')


def charger_programme(cle):
    chemin = os.path.join(ICI, 'programmes', cle, 'mesures.py')
    spec = importlib.util.spec_from_file_location('prog_' + cle, chemin)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.PROGRAMME, [dict(m) for m in mod.MESURES], mod


def construire_ctx(regenerer):
    systeme, s1 = ponts.pont_systeme(regenerer)
    retraites, s2 = ponts.pont_retraites(regenerer)
    ir, s3 = ponts.pont_openfisca(regenerer)
    demo, s4 = ponts.pont_demographie(regenerer)
    smic, s5 = ponts.pont_smic(regenerer)
    rnof, s7 = ponts.pont_rn_openfisca(regenerer)
    pmin, s6 = ponts.pont_pension_min(regenerer)
    ctx = {'systeme': systeme, 'retraites': retraites, 'openfisca': ir, 'demographie': demo, 'smic': smic, 'pension_min': pmin, 'rn_openfisca': rnof, 'ifi_actuel': IFI_ACTUEL, 'eco': systeme['eco'],
           'macros': {'reference': systeme['eco']['macro']['reference'], 'prudente': systeme['eco']['macro']['prudente']}}
    ctx['sources_ponts'] = {'systeme': s1, 'retraites': s2, 'openfisca': s3, 'demographie': s4, 'smic': s5, 'pension_min': s6, 'rn_openfisca': s7}
    return ctx


def preparer(mesures, ctx):
    """Fixe an1_part (part du régime atteinte la 1re année) d'après le montant « an1 » du document du programme et la valeur médiane de notre estimation."""
    for m in mesures:
        if 'montee' in m or 'an1' not in m:
            continue
        r, d = M.mediane_mesure(m, ctx)
        v = abs(r - d)
        m['an1_part'] = 1.0 if v < 1e-9 else max(0.0, min(1.0, m['an1'] / v))
    return mesures


def resumer(xs):
    return {'p10': M.centile(xs, 0.10), 'p50': M.centile(xs, 0.50), 'p90': M.centile(xs, 0.90)}


def simuler(prog, mesures, ctx, tirages, graine, rho=1.0):
    """Monte-Carlo. Retourne des listes par tirage : solde de régime, recettes, dépenses, dette 2038 et 2058 (statique et avec relance), déficit 2038, effets par mesure."""
    ms = M.appliquer_rho(mesures, rho)
    rng = random.Random(graine)
    macro = ctx['macros'][prog['macro']]
    res = {k: [] for k in ('capital', 'solde', 'rec', 'dep', 'dette2032', 'dette2038', 'dette2058', 'deficit2038', 'dette2038_rel', 'dette2058_rel', 'solde_rel', 'deficit2038_rel', 'an1', 'primaire2038', 'interets2038')}
    par_mesure = {m['id']: [] for m in ms}
    for _ in range(tirages):
        t = M.tirer(rng, ms, FACTEURS)
        rd = []
        for m in ms:
            r, d = M.evaluer_mesure(m, t, ctx)
            rd.append((m, r, d))
            par_mesure[m['id']].append(r - d)
        ops = [(m, ) + M.operation_capital(m, t) for m in ms if m['levier'] == 'nationalisation']
        chocs = M.chocs_dette(ops, prog)
        serie = M.serie_effet(rd, prog, ops)
        eff = {an: v[2] for an, v in serie.items()}
        tr = M.trajectoire_dette(eff, ctx['eco'], macro, chocs=chocs)
        rec_reg = sum(r for _, r, _ in rd)
        dep_reg = sum(d for _, _, d in rd)
        res['capital'].append(sum(pr for _, pr, _ in ops))
        res['solde'].append(rec_reg - dep_reg); res['rec'].append(rec_reg); res['dep'].append(dep_reg)
        res['dette2038'].append(tr[2038]['ratio']); res['dette2058'].append(tr[2058]['ratio']); res['deficit2038'].append(tr[2038]['deficit_pct']); res['dette2032'].append(tr[2032]['ratio'])
        res['primaire2038'].append(tr[2038]['primaire_pct']); res['interets2038'].append(tr[2038]['interets_pct'])
        res['an1'].append(eff[prog['debut']])
        # relance : mêmes tirages de mesures, multiplicateurs tirés à part
        md = M.quantile(M_DEP, rng.random()); rr = M.quantile(RATIO_REC, rng.random()); of = M.quantile(OFFRE, rng.random())
        rdp = {an: (v[0], v[1]) for an, v in serie.items()}
        # effet d'offre atteint en régime, linéaire sur la montée
        n = prog['regime'] - prog['debut'] + 1
        ret = {}
        for an, (r_, d_) in rdp.items():
            part = min(1.0, (an - prog['debut'] + 1) / n)
            ret[an] = M.retour_relance({an: (r_, d_)}, md, rr, of * part, ctx['eco'])[an]
        eff2 = {an: eff[an] + ret[an] for an in eff}
        tr2 = M.trajectoire_dette(eff2, ctx['eco'], macro, chocs=chocs)
        res['dette2038_rel'].append(tr2[2038]['ratio']); res['dette2058_rel'].append(tr2[2058]['ratio']); res['solde_rel'].append(eff2[2038]); res['deficit2038_rel'].append(tr2[2038]['deficit_pct'])
    return res, par_mesure


def detail_nouvelles(mesures, ctx, graine, n=2000):
    """Décomposition des quatre mesures ajoutées le 08/11/2026 (Smic, pension minimale, carburants, nationalisations) : médiane [centiles 10 ; 90] de leurs composantes, tirages propres (graine + 1)."""
    ids = ('S01', 'P01', 'C01', 'N01', 'N02', 'N03', 'N04', 'N05', 'N06')
    sous = [m for m in mesures if m['id'] in ids]
    if not sous:
        return None
    rng = random.Random(graine + 1)
    acc = {}
    for _ in range(n):
        t = M.tirer(rng, sous, FACTEURS)
        for m in sous:
            p = M.parametres_tires(m, t)
            if m['id'] == 'S01':
                d = M.L2.calcul_smic(ctx, p)
                p1 = dict(p, indexation_allegement=1.0)
                p0 = dict(p, indexation_allegement=0.0)
                d1, d0 = M.L2.calcul_smic(ctx, p1), M.L2.calcul_smic(ctx, p0)
                vals = {k: d[k] for k in ('recettes', 'depenses', 'd_recettes_brut', 'd_allegements', 'masse_brute', 'cout_prive', 'emplois_perdus_k', 'perte_emploi_rec', 'perte_emploi_alloc', 'agents', 'finance', 'pec', 'allegement_base')}
                vals['solde'] = d['recettes'] - d['depenses']
                vals['solde_indexe'] = d1['recettes'] - d1['depenses']
                vals['solde_gele'] = d0['recettes'] - d0['depenses']
                vals['emplois_indexe_k'] = d1['emplois_perdus_k']
                vals['emplois_gele_k'] = d0['emplois_perdus_k']
            elif m['id'] == 'P01':
                c, b, ps = M.L2.cout_pension_minimale(ctx, p)
                vals = {'cout_pension': c, 'beneficiaires_m': b, 'part_sous_seuil': ps, 'aspa_net': max(p['aspa_hausse'] - p['aspa_chevauchement'], -c), 'total': c + max(p['aspa_hausse'] - p['aspa_chevauchement'], -c)}
            elif m['id'] == 'C01':
                d = M.L2.calcul_carburant(p)
                vals = {'public': d['public'], 'prive': d['prive'], 'total': d['total'], 'ecart': d['ecart'], 'volume': d['volume']}
            else:
                prix = M.L2.prix_nationalisation(p)
                vals = {'prix': prix, 'flux': M.L2.levier_nationalisation(ctx, p)[0] - M.L2.levier_nationalisation(ctx, p)[1], 'transfert': prix * p.get('part_transfert', 0.0)}
            for k, v in vals.items():
                acc.setdefault(m['id'], {}).setdefault(k, []).append(v)
    return {i: {k: resumer(v) for k, v in d.items()} for i, d in acc.items()}


def simuler_systeme(prog, mesures, ctx, tirages, graine, rho=1.0, macro_nom=None):
    """Monte-Carlo de notre système, même méthode que `simuler` : facteurs latents communs (comportement, coût), aléa propre à chaque module, 10 000 tirages, graine fixe. La trajectoire centrale
    exportée par nos modèles reçoit, chaque année, la somme des écarts des modules tirés (trajectoire du solde primaire linéaire dans ces écarts) ; la chaîne dette est la même que pour LFI et le RN."""
    ms = M.appliquer_rho(mesures, rho)
    s = ctx['systeme']['systeme']
    annees = [2029 + k for k in range(len(s['reference']['primaire']))]
    eco = ctx['eco']
    base = {'reference': M.effet_systeme_md(s['reference'], eco), 'prudente': M.effet_systeme_md(s['prudente'], eco)}
    macro = ctx['macros'][macro_nom or prog['macro']]
    macro_pru = ctx['macros']['prudente']
    po_c = s['po_pct']
    r_reg = (po_c - M.PO_2024 / M.PIB_2024) * M.PIB_2024     # recettes nouvelles en régime au central (Md€)
    rng = random.Random(graine)
    res = {k: [] for k in ('solde', 'solde2041', 'rec', 'dep', 'po', 'dette2032', 'dette2038', 'dette2058', 'deficit2038', 'dette2038_rel', 'dette2058_rel', 'solde_rel', 'deficit2038_rel', 'an1', 'primaire2038', 'interets2038',
                           'dette2038_pru', 'dette2058_pru', 'solde2038_pru', 'stable', 'stable1', 'pic', 'pic_an', 'stable_pru')}
    par_mesure = {m['id']: [] for m in ms}
    i38, i41 = annees.index(2038), annees.index(2041)
    for _ in range(tirages):
        t = M.tirer(rng, ms, FACTEURS)
        delta, drec, par = M.effet_modules(ms, t, annees)
        eff = {an: base['reference'][an] + delta[i] for i, an in enumerate(annees)}
        tr = M.trajectoire_dette(eff, eco, macro)
        effp = {an: base['prudente'][an] + delta[i] for i, an in enumerate(annees)}
        trp = M.trajectoire_dette(effp, eco, macro_pru)
        for k, v in par.items():
            par_mesure[k].append(v)
        apres = [tr[an]['ratio'] for an in range(2039, 2059)]
        res['stable'].append(max(apres) <= tr[2038]['ratio'] + 1e-9); res['stable1'].append(max(apres) <= tr[2038]['ratio'] + 0.01)
        pic = max((tr[an]['ratio'], an) for an in range(2029, 2059)); res['pic'].append(pic[0]); res['pic_an'].append(pic[1])
        res['stable_pru'].append(max(trp[an]['ratio'] for an in range(2039, 2059)) <= trp[2038]['ratio'] + 1e-9)
        po = po_c + drec[i38] / M.PIB_2024
        rec_reg = r_reg + drec[i38]
        res['solde'].append(eff[2038]); res['solde2041'].append(eff[2041]); res['rec'].append(rec_reg); res['dep'].append(rec_reg - eff[2038]); res['po'].append(po)
        res['dette2038'].append(tr[2038]['ratio']); res['dette2058'].append(tr[2058]['ratio']); res['deficit2038'].append(tr[2038]['deficit_pct']); res['dette2032'].append(tr[2032]['ratio'])
        res['primaire2038'].append(tr[2038]['primaire_pct']); res['interets2038'].append(tr[2038]['interets_pct'])
        res['an1'].append(eff[prog['debut']])
        res['dette2038_pru'].append(trp[2038]['ratio']); res['dette2058_pru'].append(trp[2058]['ratio']); res['solde2038_pru'].append(effp[2038])
        # relance : mêmes multiplicateurs que les autres programmes ; recettes nouvelles R(an) = part montée du régime + écarts de recettes, dépenses nouvelles D(an) = R(an) - effet sur le solde (⚠️ convention)
        md = M.quantile(M_DEP, rng.random()); rr = M.quantile(RATIO_REC, rng.random()); of = M.quantile(OFFRE, rng.random())
        n = prog['regime'] - prog['debut'] + 1
        ret = {}
        for i, an in enumerate(annees):
            part = min(1.0, (an - prog['debut'] + 1) / n)
            r_an = r_reg * part + drec[i]
            d_an = r_an - eff[an]
            ret[an] = M.retour_relance({an: (r_an, d_an)}, md, rr, of * part, eco)[an]
        eff2 = {an: eff[an] + ret[an] for an in eff}
        tr2 = M.trajectoire_dette(eff2, eco, macro)
        res['dette2038_rel'].append(tr2[2038]['ratio']); res['dette2058_rel'].append(tr2[2058]['ratio']); res['solde_rel'].append(eff2[2038]); res['deficit2038_rel'].append(tr2[2038]['deficit_pct'])
    return res, par_mesure


def sortie_systeme(prog, mesures, ctx, tirages, graine):
    s = ctx['systeme']['systeme']
    eco = ctx['eco']
    po0 = M.PO_2024 / M.PIB_2024
    res, par_mesure = simuler_systeme(prog, mesures, ctx, tirages, graine)
    # valeur centrale du modèle (tous les écarts nuls) : pour le test de validité et pour la comparaison avec la médiane
    macro = ctx['macros'][prog['macro']]
    annees0 = [2029 + k for k in range(len(s['reference']['primaire']))]
    delta0, _, _ = M.effet_modules(mesures, {'z': {}, 'zi': {}}, annees0)       # décalage du central (nul, sauf variante « moins sévère » : d_c des modules)
    eff_c = {an: v + delta0[i] for i, (an, v) in enumerate(M.effet_systeme_md(s['reference'], eco).items())}
    tr_c = M.trajectoire_dette(eff_c, eco, macro)
    eff_p = {an: v + delta0[i] for i, (an, v) in enumerate(M.effet_systeme_md(s['prudente'], eco).items())}
    tr_p = M.trajectoire_dette(eff_p, eco, ctx['macros']['prudente'])
    prim = tr_c[2038]['primaire_pct']
    dep_c = s['po_pct'] + M.HORS_PO_PCT - prim + tr_c[2038]['interets_pct']
    dep_pct = [p + M.HORS_PO_PCT - pr + i for p, pr, i in zip(res['po'], res['primaire2038'], res['interets2038'])]
    # empilement des extrêmes (pour mémoire) : tous les modules au centile 10 (favorable) ou 90 (défavorable)
    annees = [2029 + k for k in range(len(s['reference']['primaire']))]
    def _ext(signe):
        t = {'z': {}, 'zi': {(m['id'], 'valeur'): signe * M.Z90 for m in mesures}}
        mm = [dict(m, **{'lambda': 0.0}) for m in mesures]
        delta, _, _ = M.effet_modules(mm, t, annees)
        eff = {an: eff_c[an] + delta[i] for i, an in enumerate(annees)}
        tr = M.trajectoire_dette(eff, eco, macro)
        return eff[2038], tr[2038]['ratio'], tr[2058]['ratio']
    pf, pd = _ext(-1), _ext(+1)
    sens = {}
    for rho in (0.0, 1.3):
        r2, _ = simuler_systeme(prog, mesures, ctx, min(tirages, 3000), graine, rho)
        sens['rho_%.1f' % rho] = {'solde': resumer(r2['solde']), 'dette2038': resumer(r2['dette2038'])}
    # poids de chaque module dans l'incertitude : part de la variance du solde de régime (corrélation de rang au carré avec le solde), et contribution marginale à l'étendue
    contrib = {}
    sol = res['solde']
    ms_ = sum(sol) / len(sol)
    vs = sum((x - ms_) ** 2 for x in sol) / len(sol)
    for k, v in par_mesure.items():
        mv = sum(v) / len(v)
        cov = sum((a - ms_) * (b - mv) for a, b in zip(sol, v)) / len(sol)
        contrib[k] = cov / vs if vs > 0 else 0.0          # part de la variance du solde portée par le module (somme = 1)
    d58 = res['dette2058']
    md = sum(d58) / len(d58); vd = sum((x - md) ** 2 for x in d58) / len(d58)
    def _r2(v):
        mv = sum(v) / len(v); vv = sum((b - mv) ** 2 for b in v) / len(v)
        return (sum((a - md) * (b - mv) for a, b in zip(d58, v)) / len(d58)) ** 2 / (vd * vv) if vv > 0 and vd > 0 else 0.0
    contrib58 = {k: _r2(v) for k, v in par_mesure.items()}      # carré de la corrélation entre la valeur du module en 2038 et la dette 2058 (non additif)
    r2028 = M.trajectoire_dette({}, eco, macro)[2028]['ratio']      # dette / PIB fin 2028 au droit actuel (début du plan, 123,5 %)
    r2025 = ctx['eco']['dette0'] / ctx['eco']['pib0']
    n_ = len(res['solde'])
    stats = {
        'ratio_fin_2028': r2028, 'ratio_fin_2025': r2025,
        'part_solde_negatif': sum(1 for x in res['solde'] if x < 0) / n_,
        'part_deficit2038_sous_3': sum(1 for x in res['deficit2038'] if x <= 0.03) / n_,
        'part_dette2038_sous_fin2028': sum(1 for x in res['dette2038'] if x <= r2028) / n_,
        'part_dette2038_sous_150': sum(1 for x in res['dette2038'] if x <= 1.5) / n_,
        'part_dette2058_sous_2038': sum(1 for a, b in zip(res['dette2058'], res['dette2038']) if a < b) / n_,
        'part_dette2058_sous_fin2025': sum(1 for x in res['dette2058'] if x <= r2025) / n_,
        'part_dette2058_sous_100': sum(1 for x in res['dette2058'] if x <= 1.0) / n_,
        'part_dette_stable_des_2038': sum(res['stable']) / n_, 'part_dette_stable_1pt': sum(res['stable1']) / n_, 'part_dette_stable_prudente': sum(res['stable_pru']) / n_,
        'pic_dette': resumer(res['pic']), 'pic_annee': resumer(res['pic_an']),
    }
    return {'nom': prog['nom'], 'modele': True, 'avec_tirage': True, 'solde_regime_structurel': eff_c[2041], 'solde_2038': eff_c[2038], 'solde_regime': resumer(res['solde']), 'solde_2041': resumer(res['solde2041']),
            'recettes_regime': resumer(res['rec']), 'depenses_regime': resumer(res['dep']), 'po_pct': resumer(res['po']), 'dep_pct': resumer(dep_pct), 'deficit2038_pct': resumer(res['deficit2038']),
            'dette2032': resumer(res['dette2032']), 'dette2038': resumer(res['dette2038']), 'dette2058': resumer(res['dette2058']), 'dette2038_prudente': M.centile(res['dette2038_pru'], 0.5), 'dette2058_prudente': M.centile(res['dette2058_pru'], 0.5),
            'dette2038_prudente_p': resumer(res['dette2038_pru']), 'dette2058_prudente_p': resumer(res['dette2058_pru']),
            'dette2038_rel': resumer(res['dette2038_rel']), 'dette2058_rel': resumer(res['dette2058_rel']), 'solde_rel': resumer(res['solde_rel']), 'deficit2038_rel': resumer(res['deficit2038_rel']),
            'central': {'solde_2038': eff_c[2038], 'solde_2041': eff_c[2041], 'dette2038': tr_c[2038]['ratio'], 'dette2058': tr_c[2058]['ratio'], 'deficit2038_pct': tr_c[2038]['deficit_pct'], 'po_pct': s['po_pct'], 'dep_pct': dep_c,
                        'dette2038_prudente': tr_p[2038]['ratio'], 'dette2058_prudente': tr_p[2058]['ratio']},
            'dette2038_prudente_central': tr_p[2038]['ratio'], 'dette2058_prudente_central': tr_p[2058]['ratio'],
            'extremes': {'solde_defavorable': pd[0], 'solde_favorable': pf[0], 'dette2038_defavorable': pd[1], 'dette2038_favorable': pf[1], 'dette2058_defavorable': pd[2], 'dette2058_favorable': pf[2]},
            'par_mesure': {k: resumer(v) for k, v in par_mesure.items()}, 'contribution_variance': contrib, 'contribution_variance_dette2058': contrib58, 'sensibilite_rho': sens, 'stats': stats, 'n_tirages': tirages,
            'ensemble2038': ctx_ensemble(), 'an1': resumer(res['an1'])}


def ctx_ensemble():
    import importlib.util
    chemin = os.path.join(ICI, 'programmes', 'langagement', 'mesures.py')
    spec = importlib.util.spec_from_file_location('prog_langagement_ens', chemin)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return {'ensemble2038': mod.ENSEMBLE_2038, 'composition': mod.COMPOSITION, 'fixe': mod.FIXE}


def sortie_programme(prog, mesures, ctx, tirages, graine):
    po0 = M.PO_2024 / M.PIB_2024
    if prog.get('trajectoire_modele'):
        return sortie_systeme(prog, mesures, ctx, tirages, graine)
    ctxp = ctx
    mesures = preparer(mesures, ctxp)
    res, par_mesure = simuler(prog, mesures, ctxp, tirages, graine)
    # prudente : mêmes tirages, macro prudente
    progp = dict(prog, macro='prudente')
    resp, _ = simuler(progp, mesures, ctxp, min(tirages, 3000), graine)
    po = [po0 + r / M.PIB_2024 for r in res['rec']]
    dep_pct = [p + M.HORS_PO_PCT - pr + i for p, pr, i in zip(po, res['primaire2038'], res['interets2038'])]
    ext = M.bornes_extremes(mesures, ctxp, FACTEURS) if mesures else (0.0, 0.0)
    def _cap(signe):
        ops = []
        for m in mesures:
            if m['levier'] == 'nationalisation':
                t = {'z': {f: signe * M.Z90 for f in FACTEURS}, 'zi': M._zi_const(m, signe * M.Z90)}
                ops.append((m,) + M.operation_capital(m, t))
        return ops
    opd, opf = _cap(+1), _cap(-1)
    ex_d = M.trajectoire_dette({an: (ext[0] if an >= prog['regime'] else 0.0) - (M.serie_effet([], prog, opd)[an][1]) for an in range(prog['debut'], M.ANNEE_FIN + 1)}, ctx['eco'], ctx['macros'][prog['macro']], chocs=M.chocs_dette(opd, prog))
    ex_f = M.trajectoire_dette({an: (ext[1] if an >= prog['regime'] else 0.0) - (M.serie_effet([], prog, opf)[an][1]) for an in range(prog['debut'], M.ANNEE_FIN + 1)}, ctx['eco'], ctx['macros'][prog['macro']], chocs=M.chocs_dette(opf, prog))
    sens = {}
    for rho in (0.0, 1.3):
        r2, _ = simuler(prog, mesures, ctxp, min(tirages, 3000), graine, rho)
        sens['rho_%.1f' % rho] = {'solde': resumer(r2['solde']), 'dette2038': resumer(r2['dette2038'])}
    return {'nom': prog['nom'], 'modele': False, 'solde_regime': resumer(res['solde']), 'recettes_regime': resumer(res['rec']), 'depenses_regime': resumer(res['dep']),
            'po_pct': resumer(po), 'dep_pct': resumer(dep_pct), 'deficit2038_pct': resumer(res['deficit2038']), 'dette2032': resumer(res['dette2032']), 'dette2038': resumer(res['dette2038']), 'dette2058': resumer(res['dette2058']),
            'dette2038_prudente': M.centile(resp['dette2038'], 0.5), 'dette2058_prudente': M.centile(resp['dette2058'], 0.5), 'dette2038_prudente_p': resumer(resp['dette2038']),
            'dette2038_rel': resumer(res['dette2038_rel']), 'dette2058_rel': resumer(res['dette2058_rel']), 'solde_rel': resumer(res['solde_rel']), 'deficit2038_rel': resumer(res['deficit2038_rel']),
            'extremes': {'solde_defavorable': ext[0], 'solde_favorable': ext[1], 'dette2038_defavorable': ex_d[2038]['ratio'], 'dette2038_favorable': ex_f[2038]['ratio'],
                         'dette2058_defavorable': ex_d[2058]['ratio'], 'dette2058_favorable': ex_f[2058]['ratio']},
            'detail_nouvelles': detail_nouvelles(mesures, ctx, graine), 'par_mesure': {k: resumer(v) for k, v in par_mesure.items()}, 'capital': resumer(res['capital']), 'an1': resumer(res['an1']), 'sensibilite_rho': sens, 'part_solde_negatif': sum(1 for x in res['solde'] if x < 0) / len(res['solde']), 'n_tirages': tirages}


def test_validite(ctx):
    """Test de validité du moteur : retrouve-t-il la dette de notre système (130,4 % en 2038, 124,6 % en 2058, après correction du double compte du différé) et le droit actuel de nos modèles ?"""
    s = ctx['systeme']
    sysx = s['systeme']
    out = {}
    for nom, macro_nom in (('reference', 'reference'), ('prudente', 'prudente')):
        eff = M.effet_systeme_md(sysx[nom], ctx['eco'])
        tr = M.trajectoire_dette(eff, ctx['eco'], ctx['macros'][macro_nom])
        out[nom] = {'moteur_2038': tr[2038]['ratio'], 'modele_2038': sysx[nom]['ratio'][9], 'moteur_2058': tr[2058]['ratio'], 'modele_2058': sysx[nom]['ratio'][29]}
    for nom in ('reference', 'prudente'):
        tr = M.trajectoire_dette({}, ctx['eco'], ctx['macros'][nom])
        out['actuel_' + nom] = {'moteur_2038': tr[2038]['ratio'], 'modele_2038': s['actuel'][nom]['ratio'][9], 'moteur_2058': tr[2058]['ratio'], 'modele_2058': s['actuel'][nom]['ratio'][29]}
    return out


# ------------------------------------------------------------------ variante « modèles moins sévères » (exil, évasion, planification des grandes fortunes), appliquée à TOUS les programmes
def ctx_moins_severe(ctx):
    """Contexte de la variante : les blocs de patrimoine (ISF, plancher, transmissions, plafond d'héritage) lus dans systeme_moins_severe.json (hypothèses de js/prelude_moins_severe.js) ; le reste est inchangé."""
    ms, src = ponts.pont_systeme_moins_severe(False)
    ctx2 = dict(ctx)
    sy = dict(ctx['systeme'])
    for cle in ('isf', 'plancher', 'succession', 'plafond'):
        sy[cle] = ms[cle]
    ctx2['systeme'] = sy
    return ctx2


def mesures_systeme_moins_severes(mesures):
    """Notre système dans la variante : M-PAT (fonction du patrimoine v7.5) et M-TRANS (transmissions) reçoivent un central décalé (d_c) et de nouvelles bornes, tirés de modules_moins_severes.json (même code,
    mêmes scénarios, hypothèses moins sévères) ; les leviers votés restent fixes (F), les autres modules inchangés. Le modèle de notre système n'est pas modifié."""
    d, _ = ponts.pont_modules_moins_severes(False)
    b, v = d['base'], d['ms']
    n = len(b['annees'])
    ramp = b['ramp']
    out = []
    for m in mesures:
        m = dict(m)
        if m['id'] == 'M-PAT':
            fn_, c0 = b['fonction'], b['ratios'][1]
            vals = [fn_ * (r / c0 - 1.0) for r in v['ratios']]
            a, c = vals[0], vals[2]
            fav, dfv = (a, c) if a >= c else (c, a)           # même règle que pont_incertitudes.js : le plus favorable à la recette est « favorable »
            dc = vals[1]
            m['d_c'] = [dc] * n; m['d_fav'] = [fav - dc] * n; m['d_def'] = [dfv - dc] * n
            m['central'] = (m['central'] or 0.0) + dc
        elif m['id'] == 'M-TRANS':
            t0, t1 = b['trans'], v['trans']
            m['d_c'] = [(t1[1] - t0[1]) * ramp[i] for i in range(n)]
            m['d_fav'] = [(t1[0] - t1[1]) * ramp[i] for i in range(n)]
            m['d_def'] = [(t1[2] - t1[1]) * ramp[i] for i in range(n)]
            m['central'] = (m['central'] or 0.0) + (t1[1] - t0[1])
        out.append(m)
    return out


def main():
    args = sys.argv[1:]
    regenerer = '--ponts' in args
    tirages = TIRAGES
    if '--tirages' in args:
        tirages = int(args[args.index('--tirages') + 1])
    t0 = time.time()
    ctx = construire_ctx(regenerer)
    tv = test_validite(ctx)
    resultats = {'openfisca_part_haut': ctx['openfisca']['part_ir_haut_decile'], 'validite': tv, 'sources_ponts': ctx['sources_ponts'], 'tirages': tirages, 'graine': GRAINE}
    meta = {}
    for cle in PROGRAMMES:
        prog, mesures, mod = charger_programme(cle)
        resultats[cle] = sortie_programme(prog, mesures, ctx, tirages, GRAINE)
        meta[cle] = (prog, mesures, mod)
    # variante « modèles moins sévères » : mêmes programmes, mêmes tirages (même graine), hypothèses d'exil et d'évasion plus basses pour tous
    ctx_ms = ctx_moins_severe(ctx)
    resultats['moins_severe'] = {}
    for cle in ('fil_de_l_eau', 'lfi', 'rn', 'langagement'):
        prog, mesures, mod = charger_programme(cle)
        if cle == 'langagement':
            mesures = mesures_systeme_moins_severes(mesures)
        resultats['moins_severe'][cle] = sortie_programme(prog, mesures, ctx_ms, tirages, GRAINE)
    resultats['duree_s'] = time.time() - t0
    with open(os.path.join(ICI, 'donnees', 'resultats.json'), 'w', encoding='utf-8') as f:
        json.dump(resultats, f, ensure_ascii=False, indent=1, sort_keys=True)
    import rapport
    with open(os.path.join(ICI, 'resultats.md'), 'w', encoding='utf-8') as f:
        f.write(rapport.ecrire(resultats, meta, ctx) + rapport.ecrire_variante(resultats) + rapport.ecrire_ajouts(resultats, meta, ctx, AJOUTS_0911))
    print('Résultats écrits (%.1f s)' % resultats['duree_s'])


if __name__ == '__main__':
    main()
