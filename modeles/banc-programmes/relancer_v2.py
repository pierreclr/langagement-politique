#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Banc d'essai, version 2 (11/11/2026) : même règle de faisabilité pour tous les programmes, y compris le nôtre (voir faisabilite.py), taux endogène affiché à côté du taux fixe, année de passage sous 3 % de déficit,
prélèvements obligatoires bruts et nets de notre système. N'écrase RIEN de la version 1 : écrit donnees/resultats-v2.json et resultats-v2.md.
Usage : python3 -I modeles/banc-programmes/relancer_v2.py [--tirages N]
Mêmes tirages que la version 1 (graine 20261108, 10 000), mêmes caches de ponts ; la relance macroéconomique et la variante « moins sévère » ne sont pas rejouées (v1 inchangée).
"""
import json, math, os, random, sys, time

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
sys.path.insert(0, os.path.join(os.path.dirname(ICI), 'taux-endogene'))
import moteur as M          # noqa: E402
import relancer as R        # noqa: E402  (main() n'est pas appelé)
import faisabilite as F     # noqa: E402
import ponts                # noqa: E402
import taux as T            # noqa: E402

ORDRE = ('lr', 'ps', 'gl', 'rn', 'lfi', 'lfi_cb', 'langagement', 'fil_de_l_eau')       # 'gl' (livret climat de Glucksmann, chiffrage partiel) et 'lfi_cb' (sensibilité : contre-budget 2027 de LFI) ajoutés le 11/11/2026
ANNEES_SERIE = list(range(2028, 2046))
TRANSFERTS_NETS_MD = 99.3551        # sources/calculs/bilan_global.py, M['transferts_nets'] : socle + allocation par enfant - prestations remplacées + plancher (convention du modèle, v5.3) ; ⚠️ à recalculer sur la version actuelle
PIB_TRANSFERTS = M.PIB_2024
P_ENDO = T.params('central')


def evaluer_v2(m, t, ctx):
    """Évaluation d'une mesure avec la part réalisable pour les recettes issues d'un modèle (levier ≠ cout_unitaire) : la part est tirée au facteur « cout » (poids 0,5) et à un aléa propre."""
    r, d = M.evaluer_mesure(m, t, ctx)
    if 'part_realisable' in m:
        zf = t['z'].get(F.FACTEUR_PART, 0.0)
        zi = t['zi'].get((m['id'], 'valeur'), 0.0)
        r = r * M.quantile(m['part_realisable'], M._u_param(F.LAMBDA_PART, zf, zi))
    return r, d


def premiere_annee_sous(tr, seuil=0.03, debut=2028):
    for an in range(debut, M.ANNEE_FIN + 1):
        if tr[an]['deficit_pct'] <= seuil:
            return an
    return None


def _res():
    return {k: [] for k in ('solde', 'rec', 'dep', 'po', 'dette_rang5', 'dette2032', 'dette2038', 'dette2058', 'dette2038_pru', 'deficit2038', 'deficit_regime', 'an_sous3', 'an_sous3_endo', 'dette2038_endo', 'dette2032_endo',
                            'dette2058_endo', 'crise', 'serie_eff', 'serie_def', 'solde2038')}


def _stocker(res, tr, endo, eff, prog, trp):
    res['dette_rang5'].append(tr[prog['debut'] + 4]['ratio'])
    res['dette2032'].append(tr[2032]['ratio']); res['dette2038'].append(tr[2038]['ratio']); res['dette2058'].append(tr[2058]['ratio'])
    res['dette2038_pru'].append(trp[2038]['ratio'])
    res['deficit2038'].append(tr[2038]['deficit_pct'])
    res['deficit_regime'].append(tr[prog['regime']]['deficit_pct'])
    res['an_sous3'].append(premiere_annee_sous(tr)); res['an_sous3_endo'].append(premiere_annee_sous(endo))
    res['dette2038_endo'].append(endo[2038]['ratio']); res['dette2032_endo'].append(endo[2032]['ratio']); res['dette2058_endo'].append(endo[2058]['ratio'])
    res['crise'].append(T.annee_crise(endo))
    res['serie_eff'].append([eff.get(a, 0.0) for a in ANNEES_SERIE])
    res['serie_def'].append([tr[a]['deficit_pct'] for a in ANNEES_SERIE])


def simuler_generique(prog, mesures, ctx, tirages, graine):
    ms = M.appliquer_rho(mesures, 1.0)
    rng = random.Random(graine)
    macro = ctx['macros'][prog['macro']]
    pru = ctx['macros']['prudente']
    eco = ctx['eco']
    res = _res()
    par = {m['id']: [] for m in ms}
    for _ in range(tirages):
        t = M.tirer(rng, ms, R.FACTEURS)
        rd = []
        for m in ms:
            r, d = evaluer_v2(m, t, ctx)
            rd.append((m, r, d))
            par[m['id']].append(r - d)
        ops = [(m,) + M.operation_capital(m, t) for m in ms if m['levier'] == 'nationalisation']
        chocs = M.chocs_dette(ops, prog)
        serie = M.serie_effet(rd, prog, ops)
        eff = {an: v[2] for an, v in serie.items()}
        tr = M.trajectoire_dette(eff, eco, macro, chocs=chocs)
        trp = M.trajectoire_dette(eff, eco, pru, chocs=chocs)
        endo = T.trajectoire(eff, eco, macro['g'], P_ENDO, chocs=chocs)
        rr = sum(r for _, r, _ in rd); dd = sum(d for _, _, d in rd)
        res['solde'].append(rr - dd); res['rec'].append(rr); res['dep'].append(dd)
        res['po'].append(M.PO_2024 / M.PIB_2024 + rr / M.PIB_2024)
        _stocker(res, tr, endo, eff, prog, trp)
    return res, par


def effet_modules_v2(mods, tirage, annees):
    """Écart au central de notre système pour un tirage, sous la règle unique : module « filtre » : part tirée x (central + écart du modèle) - central ; module « cout » : écart du modèle (bornes élargies) ;
    module « neutre » : rien. Retourne (delta par année, delta des recettes par année, valeur de chaque module en 2038, parts tirées)."""
    n = len(annees)
    tot = [0.0] * n
    rec = [0.0] * n
    par, parts = {}, {}
    i38 = annees.index(2038)
    zf = tirage['z'].get(F.FACTEUR_PART, 0.0)
    for m in mods:
        k = m['kind']
        if k == 'neutre':
            par[m['id']] = m['c'][i38]
            for i in range(n):
                tot[i] += m['ajust'][i] if 'ajust' in m else 0.0
            continue
        wf, wd = M.poids_module(M.z_module(m, tirage))
        df, dd = m['d_fav'], m['d_def']
        if k == 'filtre':
            s = M.quantile(m['part'], M._u_param(F.LAMBDA_PART, zf, tirage['zi'].get((m['id'], 'part'), 0.0)))
            parts[m['id']] = s
        for i in range(n):
            ci = m['c'][i]
            v = ci + wf * df[i] + wd * dd[i]
            d = (s * v - ci) if k == 'filtre' else wf * df[i] + wd * dd[i]
            aj = m['ajust'][i] if 'ajust' in m else 0.0
            tot[i] += d + aj
            if m['sens'] == 'po':
                rec[i] += d + aj
            if i == i38:
                par[m['id']] = ci + d
    return tot, rec, par, parts


def simuler_systeme_v2(prog, mods, ctx, tirages, graine):
    s = ctx['systeme']['systeme']
    eco = ctx['eco']
    annees = [2029 + k for k in range(len(s['reference']['primaire']))]
    base = M.effet_systeme_md(s['reference'], eco)
    basep = M.effet_systeme_md(s['prudente'], eco)
    macro = ctx['macros'][prog['macro']]
    pru = ctx['macros']['prudente']
    po_c = s['po_pct']
    r_reg = (po_c - M.PO_2024 / M.PIB_2024) * M.PIB_2024
    rng = random.Random(graine)
    ms = M.appliquer_rho(mods, 1.0)
    res = _res()
    res['stable'] = []
    res['po_net'] = []
    par = {m['id']: [] for m in ms}
    i38 = annees.index(2038)
    for _ in range(tirages):
        t = M.tirer(rng, ms, R.FACTEURS)
        delta, drec, p, _parts = effet_modules_v2(ms, t, annees)
        eff = {an: base[an] + delta[i] for i, an in enumerate(annees)}
        tr = M.trajectoire_dette(eff, eco, macro)
        effp = {an: basep[an] + delta[i] for i, an in enumerate(annees)}
        trp = M.trajectoire_dette(effp, eco, pru)
        endo = T.trajectoire(eff, eco, macro['g'], P_ENDO)
        for k, v in p.items():
            par[k].append(v)
        po = po_c + drec[i38] / M.PIB_2024
        rec_reg = r_reg + drec[i38]
        res['solde'].append(eff[2038]); res['rec'].append(rec_reg); res['dep'].append(rec_reg - eff[2038]); res['po'].append(po)
        res['po_net'].append(po - TRANSFERTS_NETS_MD / PIB_TRANSFERTS)
        res['stable'].append(max(tr[a]['ratio'] for a in range(2039, 2059)) <= tr[2038]['ratio'] + 1e-9)
        _stocker(res, tr, endo, eff, prog, trp)
    return res, par


def resumer(xs):
    xs = [x for x in xs if x is not None]
    return {'p10': M.centile(xs, 0.10), 'p50': M.centile(xs, 0.50), 'p90': M.centile(xs, 0.90)} if xs else None


def serie_med(rows):
    return [M.centile([r[i] for r in rows], 0.5) for i in range(len(rows[0]))]


def _moy_et(xs):
    n = len(xs)
    mo = sum(xs) / n
    return {'moyenne': mo, 'ecart_type': math.sqrt(sum((x - mo) ** 2 for x in xs) / n)}


def moments_lignes(res, par):
    """Pour les pages de détail (detail.py) et leur test de cohérence : moyenne et écart-type de chaque ligne et du total, part des tirages où le total aggrave le déficit,
    et le reste « hors lignes » de chaque tirage (total moins somme des lignes). Programmes du banc : reste nul à l'arrondi près (le total d'un tirage est la somme de ses lignes).
    Notre système : reste constant (trajectoire centrale moins somme des centraux des lignes, plus les ajustements fixes), puisque les lignes sont lues en 2038 autour de ce central.
    La médiane du total n'est pas la somme des médianes ; la moyenne, elle, s'additionne : moyenne du total = somme des moyennes des lignes + reste."""
    n = len(res['solde'])
    if not n:
        return {}
    ids = list(par)
    reste = [res['solde'][k] - sum(par[i][k] for i in ids) for k in range(n)]
    return {'moments_par_mesure': {i: _moy_et(par[i]) for i in ids}, 'moments_solde': _moy_et(res['solde']),
            'part_solde_negatif': sum(1 for x in res['solde'] if x < 0) / n,
            'reste_hors_lignes': {'moyenne': sum(reste) / n, 'min': min(reste), 'max': max(reste)}}


def sortie(res, par, prog, tirages):
    n = len(res['solde'])
    sous = [a for a in res['an_sous3'] if a is not None]
    sous_e = [a for a in res['an_sous3_endo'] if a is not None]
    crises = [c for c in res['crise'] if c is not None]
    out = {'nom': prog['nom'], 'n_tirages': tirages,
           'solde_regime': resumer(res['solde']), 'recettes_regime': resumer(res['rec']), 'depenses_regime': resumer(res['dep']), 'po_pct': resumer(res['po']),
           'deficit_regime_pct': resumer(res['deficit_regime']), 'deficit2038_pct': resumer(res['deficit2038']),
           'dette2032': resumer(res['dette2032']), 'dette_rang5': resumer(res['dette_rang5']), 'dette2038': resumer(res['dette2038']), 'dette2058': resumer(res['dette2058']),
           'dette2038_prudente': resumer(res['dette2038_pru']),
           'dette2038_endo': resumer(res['dette2038_endo']), 'dette2032_endo': resumer(res['dette2032_endo']), 'dette2058_endo': resumer(res['dette2058_endo']), 'part_crise_avant_2058': len(crises) / n,
           'part_crise_avant_2038': sum(1 for c in crises if c <= 2038) / n,
           'sous3': {'part': len(sous) / n, 'annee_mediane': (sorted(sous)[len(sous) // 2] if len(sous) * 2 > n else None), 'annee_p10_p90': resumer(sous)},
           'sous3_endo': {'part': len(sous_e) / n, 'annee_mediane': (sorted(sous_e)[len(sous_e) // 2] if len(sous_e) * 2 > n else None), 'annee_p10_p90': resumer(sous_e)},
           'serie_eff_mediane': dict(zip(map(str, ANNEES_SERIE), serie_med(res['serie_eff']))),
           'serie_deficit_mediane': dict(zip(map(str, ANNEES_SERIE), serie_med(res['serie_def']))),
           'par_mesure': {k: resumer(v) for k, v in par.items()}}
    out.update(moments_lignes(res, par))
    if 'po_net' in res:
        out['po_net_pct'] = resumer(res['po_net'])
        out['part_dette_stable_des_2038'] = sum(res['stable']) / n
    return out


def central_systeme(ctx):
    s = ctx['systeme']['systeme']
    eco = ctx['eco']
    annees = [2029 + k for k in range(len(s['reference']['primaire']))]
    base = M.effet_systeme_md(s['reference'], eco)
    return annees, [base[a] for a in annees], s['F']


def preparer_systeme(ctx, **kw):
    inc, _ = ponts.pont_incertitudes(False)
    ser = ponts._lire('incertitudes_serie.json')
    prog, mesures, mod = R.charger_programme('langagement')
    annees, eff_c, Fv = central_systeme(ctx)
    ramp = ponts.pont_modules_moins_severes(False)[0]['base']['ramp']
    mods, jr = F.modules_v2(mesures, ser['c_serie'], {'M-M2': ser['fixe']['M-M2']}, ramp, eff_c, Fv, annees, **kw)
    return prog, mods, jr


def main():
    args = sys.argv[1:]
    tirages = int(args[args.index('--tirages') + 1]) if '--tirages' in args else R.TIRAGES
    grille_v1 = '--grille-v1' in args
    if grille_v1:
        F.GRILLE = dict(F.GRILLE_V1)
    t0 = time.time()
    ctx = R.construire_ctx(False)
    res = {'tirages': tirages, 'graine': R.GRAINE, 'grille': {str(k): v for k, v in F.GRILLE.items()}, 'journal': {}, 'programmes': {}, 'sensibilites': {}}
    for cle in ORDRE:
        prog, mesures, _ = R.charger_programme(cle)
        if cle == 'langagement':
            prog, mods, jr = preparer_systeme(ctx)
            r, p = simuler_systeme_v2(prog, mods, ctx, tirages, R.GRAINE)
            res['journal'][cle] = jr
            res['modules_systeme'] = [{k: m[k] for k in ('id', 'libelle', 'kind', 'sens') if k in m} | {'score': m.get('score_faisabilite'), 'central_2038': m['c'][9], 'central_2029_2058': m['c']} for m in mods]
        else:
            mesures = R.preparer(mesures, ctx)
            mesures, jr = F.appliquer_programme(cle, mesures)
            mesures = R.preparer(mesures, ctx)
            res['journal'][cle] = jr
            r, p = simuler_generique(prog, mesures, ctx, tirages, R.GRAINE)
        res['programmes'][cle] = sortie(r, p, prog, tirages)
    if grille_v1:
        res['duree_s'] = time.time() - t0
        res['sensibilites'] = {}
        with open(os.path.join(ICI, 'donnees', 'resultats-v2-grille-v1.json'), 'w', encoding='utf-8') as f:
            json.dump(res, f, ensure_ascii=False, indent=1, sort_keys=True)
        print('grille v1 écrite')
        return
    # sensibilités de notre système (moins de tirages)
    n_s = min(tirages, 3000)
    prog, _, _ = R.charger_programme('langagement')
    for nom, kw in (('regle_complete', {}), ('M-PAT_classe_2', {'scores_forces': {'M-PAT': 2}}), ('socle_non_filtre', {'sans_socle': True}), ('socle_classe_1', {'score_non_evalue': 1}),
                    ('sans_plancher_de_cout', {'bornes_cout': False}), ('sans_filtre_du_tout', {'sans_socle': True}), ('M-PAT_et_socle_non_filtres', {'sans_socle': True})):
        prog2, mods, _ = preparer_systeme(ctx, **{k: v for k, v in kw.items()})
        if nom == 'sans_filtre_du_tout':
            for m in mods:
                if m['kind'] == 'filtre':
                    m['part'] = {'forme': 'fixe', 'bas': 1.0, 'central': 1.0, 'haut': 1.0}
        if nom == 'M-PAT_et_socle_non_filtres':
            for m in mods:
                if m['id'] == 'M-PAT':
                    m['part'] = {'forme': 'fixe', 'bas': 1.0, 'central': 1.0, 'haut': 1.0}
        r, p = simuler_systeme_v2(prog2, mods, ctx, n_s, R.GRAINE)
        res['sensibilites'][nom] = sortie(r, p, prog2, n_s)
    # poids du dispositif retraites V6 (âge libre + sous-indexation) : module et effet central retirés, tout le reste de la règle inchangé
    prog2, _, _ = R.charger_programme('langagement')
    r, p = _systeme_sans_v6(ctx, n_s)
    res['sensibilites']['sans_M-V6'] = sortie(r, p, prog2, n_s)
    res['duree_s'] = time.time() - t0
    with open(os.path.join(ICI, 'donnees', 'resultats-v2.json'), 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=1, sort_keys=True)
    print('Résultats v2 écrits (%.1f s)' % res['duree_s'])


def _systeme_sans_v6(ctx, tirages):
    """Notre système sans l'effet du dispositif V6 (âge libre et sous-indexation) : la trajectoire centrale est amputée de la série centrale de M-V6, le module est retiré du tirage."""
    inc, _ = ponts.pont_incertitudes(False)
    ser = ponts._lire('incertitudes_serie.json')
    prog, mesures, mod = R.charger_programme('langagement')
    annees, eff_c, Fv = central_systeme(ctx)
    cv6 = ser['c_serie']['M-V6']
    ramp = ponts.pont_modules_moins_severes(False)[0]['base']['ramp']
    eff_sans = [e - c for e, c in zip(eff_c, cv6)]
    mes = [m for m in mesures if m['id'] != 'M-V6']
    ser2 = {k: v for k, v in ser['c_serie'].items() if k != 'M-V6'}
    mods, _ = F.modules_v2(mes, ser2, {'M-M2': ser['fixe']['M-M2']}, ramp, eff_sans, Fv, annees)
    s = ctx['systeme']['systeme']
    ctx2 = dict(ctx)
    sy = dict(ctx['systeme'])
    sys2 = dict(s)
    # trajectoire de base amputée : on reconstruit 'reference' par l'effet, via une surcharge de effet_systeme_md
    base_orig = M.effet_systeme_md
    try:
        cv6d = dict(zip(annees, cv6))
        def amput(serie, eco, _o=base_orig):
            d = _o(serie, eco)
            return {a: v - cv6d.get(a, 0.0) for a, v in d.items()}
        M.effet_systeme_md = amput
        return simuler_systeme_v2(prog, mods, ctx, tirages, R.GRAINE)
    finally:
        M.effet_systeme_md = base_orig


if __name__ == '__main__':
    main()
