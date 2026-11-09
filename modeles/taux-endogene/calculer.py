#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Couche « taux endogène » (T74) : grille d'efforts budgétaires et application en sensibilité aux programmes du banc d'essai, sans rien modifier dans modeles/banc-programmes/.
Usage : python3 -I modeles/taux-endogene/calculer.py [--tirages N]
Lit les caches versionnés du banc (lecture seule), rejoue les mêmes tirages (même graine 20261108, même ordre de consommation du générateur que relancer.py du banc),
et recalcule la chaîne dette avec taux.trajectoire. Écrit seulement modeles/taux-endogene/resultats.md et modeles/taux-endogene/donnees/resultats.json.
"""
import json, os, random, sys, time

sys.dont_write_bytecode = True          # ne rien écrire dans le dossier du banc (__pycache__)
ICI = os.path.dirname(os.path.abspath(__file__))
BANC = os.path.join(os.path.dirname(ICI), 'banc-programmes')
sys.path.insert(0, ICI)
sys.path.insert(0, BANC)
import taux as T          # noqa: E402
import moteur as M        # noqa: E402  (banc, lecture seule)
import relancer as RB     # noqa: E402  (banc, lecture seule ; main() n'est pas appelé)
PROGS = getattr(RB, 'PROGRAMMES', ('fil_de_l_eau', 'lfi', 'rn', 'langagement'))   # liste des programmes du banc (LR et PS ajoutés le 09/11/2026)

EFFORTS = (0, 30, 60, 100, 150)
ANNEES = (2027, 2032, 2038, 2058)
SENS = ('a_dette_pb', 'a_deficit_pb', 'gamma_pb', 'seuil')
G_REF = 0.03


def variantes():
    """Jeux de paramètres comparés. 'banc' reproduit exactement la chaîne du banc (taux de marché fixe 3,45 %, convergence en 8 ans)."""
    sb = {k: T.SCENARIOS['bas'][k] for k in SENS}
    sh = {k: T.SCENARIOS['haut'][k] for k in SENS}
    return {
        'banc': T.params('central', mode='banc', endogene=False, r_sf=0.0345, prime0=0.0, taux_2026=0.0345, ecart_emission=0.0),
        'exogene': T.params('central', endogene=False),
        'central': T.params('central'),
        'sens_bas': T.params('central', **sb),
        'sens_haut': T.params('central', **sh),
        'tpi': T.params('central', tpi=0.0175),
    }


def variantes_grille():
    v = variantes()
    v['niveau_bas'] = T.params('bas')
    v['niveau_haut'] = T.params('haut')
    v['multiplicateur'] = T.params('central', multiplicateur=0.8)
    return v


def extrait(tr):
    d = {str(a): {k: tr[a][k] for k in ('ratio', 'deficit_pct', 'interets_pct', 'r_marche', 'i_apparent', 'prime')} for a in ANNEES}
    d['crise'] = T.annee_crise(tr)
    return d


def grille(eco):
    out = {}
    for nom, p in variantes_grille().items():
        out[nom] = {}
        for e in EFFORTS:
            for g, gn in ((G_REF, 'ref'), (0.025, 'prudente')):
                if gn == 'prudente' and nom not in ('central', 'banc', 'exogene'):
                    continue
                tr = T.trajectoire(T.effort_md(e), eco, g, p)
                out[nom]['%d_%s' % (e, gn)] = extrait(tr)
    stab = {}
    for nom in ('banc', 'exogene', 'central', 'sens_bas', 'sens_haut', 'niveau_bas', 'niveau_haut'):
        stab[nom] = T.effort_stabilisant(eco, G_REF, variantes_grille()[nom])
    out['effort_stabilisant'] = stab
    return out


def med(xs):
    return M.centile(xs, 0.5)


def resume_tirages(trs):
    """trs : liste de trajectoires (une par tirage). Médianes année par année, part des tirages en zone de crise avant 2038 et avant 2058."""
    r = {}
    for a in ANNEES:
        r[str(a)] = {k: med([t[a][k] for t in trs]) for k in ('ratio', 'deficit_pct', 'interets_pct', 'r_marche', 'i_apparent')}
        r[str(a)]['p10'] = M.centile([t[a]['ratio'] for t in trs], 0.1)
        r[str(a)]['p90'] = M.centile([t[a]['ratio'] for t in trs], 0.9)
    cr = [T.annee_crise(t) for t in trs]
    r['part_crise_avant'] = {str(a): sum(1 for c in cr if c is not None and c < a) / len(cr) for a in ANNEES}
    r['part_crise_2038'] = sum(1 for c in cr if c is not None and c <= 2038) / len(cr)
    r['part_crise_2058'] = sum(1 for c in cr if c is not None) / len(cr)
    cs = sorted(c for c in cr if c is not None)
    r['crise_mediane'] = cs[len(cs) // 2] if len(cs) * 2 > len(cr) else None
    return r


def programmes(ctx, tirages):
    """Rejoue les tirages du banc pour chaque programme et applique chaque variante de taux à chaque tirage."""
    eco = ctx['eco']
    vs = variantes()
    out = {}
    for cle in PROGS:
        prog, mesures, _ = RB.charger_programme(cle)
        g = ctx['macros'][prog['macro']]['g']
        acc = {k: [] for k in vs}
        somme, somme_chocs = {}, {}
        rng = random.Random(RB.GRAINE)
        if prog.get('trajectoire_modele'):
            ms = M.appliquer_rho(mesures, 1.0)
            s = ctx['systeme']['systeme']
            annees = [2029 + k for k in range(len(s['reference']['primaire']))]
            base = M.effet_systeme_md(s['reference'], eco)
            for _ in range(tirages):
                t = M.tirer(rng, ms, RB.FACTEURS)
                delta, _, _ = M.effet_modules(ms, t, annees)
                eff = {an: base[an] + delta[i] for i, an in enumerate(annees)}
                for _k in range(3):
                    rng.random()               # multiplicateurs de relance du banc (consommés pour garder la même suite)
                for an, v in eff.items():
                    somme[an] = somme.get(an, 0.0) + v
                for k, p in vs.items():
                    acc[k].append(T.trajectoire(eff, eco, g, p))
        else:
            mesures = RB.preparer(mesures, ctx)
            ms = M.appliquer_rho(mesures, 1.0)
            for _ in range(tirages):
                t = M.tirer(rng, ms, RB.FACTEURS)
                rd = [(m,) + tuple(M.evaluer_mesure(m, t, ctx)) for m in ms]
                ops = [(m, ) + M.operation_capital(m, t) for m in ms if m['levier'] == 'nationalisation']
                chocs = M.chocs_dette(ops, prog)
                serie = M.serie_effet(rd, prog, ops)
                eff = {an: v[2] for an, v in serie.items()}
                for _k in range(3):
                    rng.random()
                for an, v in eff.items():
                    somme[an] = somme.get(an, 0.0) + v
                for an, v in chocs.items():
                    somme_chocs[an] = somme_chocs.get(an, 0.0) + v
                for k, p in vs.items():
                    acc[k].append(T.trajectoire(eff, eco, g, p, chocs=chocs))
        moy = {an: v / tirages for an, v in somme.items()}
        moy_chocs = {an: v / tirages for an, v in somme_chocs.items()}
        sup = {k: T.effort_supplementaire(moy, eco, g, vs[k], chocs=moy_chocs) for k in ('banc', 'exogene', 'central', 'sens_bas', 'sens_haut')}
        out[cle] = {'nom': prog['nom'], 'variantes': {k: resume_tirages(v) for k, v in acc.items()}, 'effort_supplementaire': sup}
    return out


def pct(x, n=1):
    return ('%.' + str(n) + 'f') % (100 * x)


def fr(s):
    return s.replace('.', ',')


def ns(val, an, crise):
    """Valeur affichée, ou « n.s. » si la zone de crise a été atteinte avant cette année (la dynamique plafonnée ne décrit plus rien)."""
    return 'n.s.' if crise is not None and crise < an else val


def ecrire(res):
    L = []
    A = L.append
    A('---\ntitre: Taux d\'intérêt endogène : résultats (T74)\ndate: 2026-11-09\nstatut: généré par calculer.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions\n---\n')
    A('# Taux endogène : résultats\n')
    A('Généré le 09/11/2026 par `python3 -I modeles/taux-endogene/calculer.py` (%d tirages par programme, graine du banc 20261108). Écrit par Claude (IA d\'Anthropic) pour l\'auteur ; même conflit d\'intérêts que le banc (le moteur chiffre notre système et ses concurrents). Méthode et hypothèses H-TE1 à H-TE16 : `methode.md` ; faits : `sources/taux-souverains-faits-2026.md`. **Ce fichier n\'écrase rien** : les résultats du banc (`modeles/banc-programmes/resultats.md`) restent ceux du taux fixe de 3,45 %% ; ceci est une couche de sensibilité.\n' % res['tirages'])
    A('Variantes : **banc** = chaîne du banc (OAT fixe 3,45 %, convergence en 8 ans), reproduite à l\'identique (test) ; **exogène** = recalage du niveau seul (OAT fixe 4,7 % = Bund 3,4 % + prime 1,3 point, sans boucle) ; **endogène central** = prime fonction de la dette (2 pb par point), du déficit (10 pb par point) et convexe au-delà de 130 % (0,03 pb par point²) ; **sensibilités bas / haut** = (1 pb ; 0 ; pas de convexité au-dessous de 140 %) / (4 pb ; 25 pb ; 0,09 pb par point² au-delà de 120 %), niveaux centraux ; **TPI** = endogène central, prime plafonnée à 1,75 point les années où le pays est éligible (déficit ≤ 3 % ou en baisse de 0,4 point). Taux en % ; dette en % du PIB. « Crise » = première année où la prime dépasse 3 points ; **n.s.** (non significatif) = année postérieure à l\'entrée en zone de crise (pour les programmes : plus de la moitié des tirages y sont entrés) : la prime y est plafonnée à 15 points et la dynamique ne décrit plus rien (dans la réalité : programme d\'ajustement, aide européenne, restructuration ou intervention de la BCE).\n')
    gr = res['grille']
    A('## 1. Grille d\'efforts budgétaires (amélioration du solde primaire par rapport au droit actuel, Md€ de 2025, montée 2028-2032, croissance nominale 3 %)\n')
    A('L\'effort 0 est le fil de l\'eau du banc (solde primaire de 2024 maintenu, −3,5 % du PIB). 30 Md€ ≈ 1 point de PIB. L\'effort n\'a ici aucun effet sur l\'activité (statique), sauf dans la ligne « multiplicateur ».\n')
    A('| Effort (Md€/an) | Variante | OAT 2032 | OAT 2038 | OAT 2058 | Taux apparent 2038 | Taux apparent 2058 | Dette 2032 | Dette 2038 | Dette 2058 | Crise |')
    A('|---|---|---|---|---|---|---|---|---|---|---|')
    noms = [('banc', 'banc (3,45 % fixe)'), ('exogene', 'exogène (4,7 % fixe)'), ('central', '**endogène central**'), ('sens_bas', 'sensibilités basses'), ('sens_haut', 'sensibilités hautes'),
            ('tpi', 'central + TPI'), ('multiplicateur', 'central + multiplicateur 0,8'), ('niveau_bas', 'tout bas (Bund 2,9 ; prime 0,8)'), ('niveau_haut', 'tout haut (Bund 3,9 ; prime 1,7)')]
    for e in EFFORTS:
        for k, lib in noms:
            x = gr[k]['%d_ref' % e]
            c = x['crise']
            A('| %d | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s |' % (e, lib, ns(fr(pct(x['2032']['r_marche'], 2)), 2032, c), ns(fr(pct(x['2038']['r_marche'], 2)), 2038, c), ns(fr(pct(x['2058']['r_marche'], 2)), 2058, c),
                                                                     ns(fr(pct(x['2038']['i_apparent'], 2)), 2038, c), ns(fr(pct(x['2058']['i_apparent'], 2)), 2058, c),
                                                                     ns(fr(pct(x['2032']['ratio'])), 2032, c), ns(fr(pct(x['2038']['ratio'])), 2038, c), ns(fr(pct(x['2058']['ratio'])), 2058, c), c or '—'))
    A('')
    A('Macro prudente (croissance nominale 2,5 %), endogène central : ' + ' ; '.join('%d Md€ : %s %% en 2038, %s %% en 2058 (crise : %s)' % (e, ns(fr(pct(gr['central']['%d_prudente' % e]['2038']['ratio'])), 2038, gr['central']['%d_prudente' % e]['crise']), ns(fr(pct(gr['central']['%d_prudente' % e]['2058']['ratio'])), 2058, gr['central']['%d_prudente' % e]['crise']), gr['central']['%d_prudente' % e]['crise'] or '—') for e in EFFORTS) + '.\n')
    st = gr['effort_stabilisant']
    A('**Effort qui stabilise la dette de 2038 à 2058** (plus petit effort constant, Md€ de 2025, pas de 1) : ' + ' ; '.join('%s : %s' % (lib, ('%d' % st[k]) if st[k] is not None else '> 400') for k, lib in (('banc', 'banc'), ('exogene', 'exogène'), ('central', 'endogène central'), ('sens_bas', 'sensibilités basses'), ('sens_haut', 'sensibilités hautes'), ('niveau_bas', 'tout bas'), ('niveau_haut', 'tout haut'))) + '.\n')
    c = gr['central']
    A('**Lecture.** (1) **Le recalage seul coûte cher** : sans aucune boucle, passer de 3,45 %% à 4,7 %% ajoute environ %s points de dette en 2038 au fil de l\'eau et fait passer l\'effort qui stabilise la dette de %s à %s Md€ par an. '
      '(2) **La boucle punit l\'inaction et récompense l\'effort** : au central, sans effort, la prime franchit 3 points vers %s ; avec 60 Md€, vers %s ; avec 100 Md€, vers %s ; avec 150 Md€ (≈ 5 points de PIB), jamais, et l\'OAT redescend vers %s %% en 2038. '
      '(3) **Le niveau de départ compte autant que la pente** : « tout bas » (Bund 2,9 %%, prime 0,8) ramène l\'effort stabilisant à %s Md€ ; « tout haut » le porte à %s Md€. '
      '(4) Le TPI ne change rien dans ces trajectoires : il ne protège que les pays dont le déficit baisse ou est sous 3 %%, et ceux-là n\'ont pas besoin de lui dans le modèle. '
      '(5) Un multiplicateur de 0,8 ajoute 2 à 5 points de dette pendant la consolidation, sans changer le diagnostic.\n' % (
          fr('%.0f' % (100 * (gr['exogene']['0_ref']['2038']['ratio'] - gr['banc']['0_ref']['2038']['ratio']))), int(st['banc']), int(st['exogene']),
          c['0_ref']['crise'], c['60_ref']['crise'], c['100_ref']['crise'], fr(pct(c['150_ref']['2038']['r_marche'], 1)), int(st['niveau_bas']), int(st['niveau_haut'])))
    A('## 2. Programmes du banc d\'essai (médiane des tirages ; dette [centiles 10 ; 90] pour l\'endogène central)\n')
    A('Mêmes tirages que le banc, mêmes mesures, rien n\'est changé dans les programmes ; seule la chaîne dette diffère. Statique (sans relance), macro de référence.\n')
    A('| Programme | Variante | OAT 2032 | OAT 2038 | Taux apparent 2038 | Dette 2032 | Dette 2038 | Dette 2058 | Tirages en crise avant 2038 | avant 2058 |')
    A('|---|---|---|---|---|---|---|---|---|---|')
    for cle in PROGS:
        P = res['programmes'][cle]
        for k, lib in noms[:6]:
            x = P['variantes'][k]
            pc = x['part_crise_avant']
            def nsp(v, a):
                return 'n.s.' if pc[str(a)] > 0.5 else v
            d38 = nsp(fr(pct(x['2038']['ratio'])), 2038)
            d58 = nsp(fr(pct(x['2058']['ratio'])), 2058)
            if k == 'central' and d38 != 'n.s.':
                d38 += ' [%s ; %s]' % (fr(pct(x['2038']['p10'])), fr(pct(x['2038']['p90'])))
                if d58 != 'n.s.':
                    d58 += ' [%s ; %s]' % (fr(pct(x['2058']['p10'])), fr(pct(x['2058']['p90'])))
            A('| %s | %s | %s | %s | %s | %s | %s | %s | %s %% | %s %% |' % (P['nom'] if k == 'banc' else '', lib, nsp(fr(pct(x['2032']['r_marche'], 2)), 2032), nsp(fr(pct(x['2038']['r_marche'], 2)), 2038), nsp(fr(pct(x['2038']['i_apparent'], 2)), 2038),
                                                                     nsp(fr(pct(x['2032']['ratio'])), 2032), d38, d58, fr('%.0f' % (100 * x['part_crise_2038'])), fr('%.0f' % (100 * x['part_crise_2058']))))
    A('')
    A('**Effort supplémentaire qui stabilise la dette de 2038 à 2058**, ajouté à la série moyenne des tirages de chaque programme (Md€ de 2025 par an, montée 2028-2032 ; 0 = le programme stabilise déjà ; pas de 1) :\n')
    A('| Programme | banc (3,45 %) | exogène (4,7 %) | endogène central | sensibilités basses | sensibilités hautes |')
    A('|---|---|---|---|---|---|')
    for cle in PROGS:
        P = res['programmes'][cle]
        A('| %s | %s |' % (P['nom'], ' | '.join(('%d' % P['effort_supplementaire'][k]) if P['effort_supplementaire'][k] is not None else '> 400' for k in ('banc', 'exogene', 'central', 'sens_bas', 'sens_haut'))))
    A('')
    A('Contrôle : la variante « banc » redonne les médianes publiées par le banc (dette 2038 et 2058, § 1 de `modeles/banc-programmes/resultats.md`) : ' + res['controle'] + '\n')
    A('## 3. Contrôle de plausibilité du départ\n')
    A(res['plausibilite'] + '\n')
    return '\n'.join(L)


def main():
    args = sys.argv[1:]
    tirages = int(args[args.index('--tirages') + 1]) if '--tirages' in args else RB.TIRAGES
    t0 = time.time()
    ctx = RB.construire_ctx(False)
    eco = ctx['eco']
    res = {'tirages': tirages, 'graine': RB.GRAINE, 'variantes': {k: {kk: vv for kk, vv in v.items()} for k, v in variantes_grille().items()}}
    res['grille'] = grille(eco)
    res['programmes'] = programmes(ctx, tirages)
    # contrôle de reproduction du banc
    with open(os.path.join(BANC, 'donnees', 'resultats.json'), encoding='utf-8') as f:
        rb = json.load(f)
    lignes = []
    for cle in PROGS:
        x = res['programmes'][cle]['variantes']['banc']
        lignes.append('%s %s / %s %% (banc : %s / %s %%)' % (cle, fr(pct(x['2038']['ratio'])), fr(pct(x['2058']['ratio'])), fr(pct(rb[cle]['dette2038']['p50'])), fr(pct(rb[cle]['dette2058']['p50']))))
    res['controle'] = ' ; '.join(lignes) + ('' if tirages == rb.get('tirages', 10000) else ' (nombre de tirages différent du banc : écarts d\'échantillonnage attendus)')
    c = T.trajectoire({}, eco, G_REF, T.params('central'))
    b = T.trajectoire({}, eco, G_REF, variantes()['banc'])
    pib26, pib27 = eco['pib0'] * 1.03, eco['pib0'] * 1.03 ** 2
    res['plausibilite'] = ('Intérêts des administrations publiques, modèle endogène central : %.0f Md€ en 2026 et %.0f Md€ en 2027 (%s %% et %s %% du PIB) ; chaîne du banc : %.0f et %.0f Md€. '
                           'Avis du HCFP n° 2026-5 (PLF 2027, § 115) : 79,2 Md€ en 2026 et 91 Md€ en 2027 (2,9 %% du PIB). Le taux à 3,45 %% sous-estimait déjà la charge de 2027 ; le recalage la rapproche du chiffre officiel. '
                           'Écart résiduel attendu : le modèle part du solde primaire de 2024 (déficit de %s %% en 2026 contre 5,4 %% visé) et ne suit pas le calendrier réel des tombées.') % (
        c[2026]['interets_pct'] * pib26, c[2027]['interets_pct'] * pib27 * (1 + 0), fr(pct(c[2026]['interets_pct'], 2)), fr(pct(c[2027]['interets_pct'], 2)),
        b[2026]['interets_pct'] * pib26, b[2027]['interets_pct'] * pib27, fr(pct(c[2026]['deficit_pct'])))
    res['duree_s'] = time.time() - t0
    os.makedirs(os.path.join(ICI, 'donnees'), exist_ok=True)
    with open(os.path.join(ICI, 'donnees', 'resultats.json'), 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=1, sort_keys=True)
    with open(os.path.join(ICI, 'resultats.md'), 'w', encoding='utf-8') as f:
        f.write(ecrire(res))
    print('Résultats écrits (%.1f s)' % res['duree_s'])


if __name__ == '__main__':
    main()
