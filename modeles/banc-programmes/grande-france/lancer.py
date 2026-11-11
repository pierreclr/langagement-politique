#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Grande France au banc v2. Usage : python3 -I modeles/banc-programmes/grande-france/lancer.py [--tirages N]
Écrit modeles/banc-programmes/grande-france/resultats-gf.json. Variantes : (A) règle commune ; (B) leurs montants sans filtre ni croissance ; (C) leurs montants avec leur croissance (contrôle de la conversion) ;
(D) règle commune, grille de sensibilité v1 ; (E) règle commune mais leur croissance créditée à moitié de sa valeur avec le score 3 (pour montrer ce qu'elle pèse)."""
import json, os, sys

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
BANC = os.path.dirname(ICI)
sys.path.insert(0, ICI); sys.path.insert(0, BANC); sys.path.insert(0, os.path.join(os.path.dirname(BANC), 'taux-endogene'))
import relancer_v2 as V   # noqa: E402
import relancer as R      # noqa: E402
import faisabilite as F   # noqa: E402
import mesures_gf as GF   # noqa: E402


def lancer(ctx, tirages, sans_filtre=False, avec_croissance=False, echelle_croissance=1.0, score_min=None, echelle_couts=1.0):
    prog, mesures, cl, non = GF.charger(sans_filtre=sans_filtre, avec_croissance=avec_croissance)
    if score_min is not None:
        cl = {i: (v if F.score(*v[:3]) >= score_min else (1, 1, 0, v[3] + ' (relevé au score 2 : variante clémente)')) for i, v in cl.items()}
    if echelle_couts != 1.0:
        for m in mesures:
            if m['sens'] == 'depense':
                m['valeur'] = {k: (x * echelle_couts if k != 'forme' else x) for k, x in m['valeur'].items()}
                m['annonce'] *= echelle_couts
    if avec_croissance and echelle_croissance != 1.0:
        ids = {i for i, (a, b, c, mot) in cl.items() if mot.startswith('effet de croissance')}
        for m in mesures:
            if m['id'] in ids:
                for k in ('bas', 'central', 'haut'):
                    m['valeur'][k] *= echelle_croissance
                m['annonce'] *= echelle_croissance
    jr = []
    if not sans_filtre:
        F.CLASSEMENT['gf'] = cl
        mesures, jr = F.appliquer_programme('gf', mesures)
    r, p = V.simuler_generique(prog, mesures, ctx, tirages, R.GRAINE)
    out = V.sortie(r, p, prog, tirages)
    out['non_comptees'] = non
    out['scores'] = {i: v for i, v in cl.items()}
    out['libelles'] = {m['id']: m['libelle'] for m in mesures}
    out['annonces'] = {m['id']: (m['sens'], m['annonce']) for m in mesures}
    return out


def main():
    a = sys.argv[1:]
    n = int(a[a.index('--tirages') + 1]) if '--tirages' in a else R.TIRAGES
    ctx = R.construire_ctx(False)
    res = {'A_regle': lancer(ctx, n), 'B_brut_sans_croissance': lancer(ctx, max(500, n // 10), sans_filtre=True),
           'C_brut_avec_croissance': lancer(ctx, max(500, n // 10), sans_filtre=True, avec_croissance=True),
           'E_regle_croissance_moitie': lancer(ctx, n, avec_croissance=True, echelle_croissance=0.5)}
    res['F_regle_score_min_2'] = lancer(ctx, n, score_min=2)
    a_ = res['A_regle']
    ann = sum(v[1] for v in a_['annonces'].values() if v[0] == 'recette')
    real = sum(a_['par_mesure'][i]['p50'] for i, v in a_['annonces'].items() if v[0] == 'recette')
    res['G_rendre_ce_qui_est_economise'] = lancer(ctx, n, echelle_couts=real / ann)
    res['G_rendre_ce_qui_est_economise']['echelle_couts'] = real / ann
    g = dict(F.GRILLE); F.GRILLE = dict(F.GRILLE_V1)
    res['D_regle_grille_v1'] = lancer(ctx, n)
    F.GRILLE = g
    with open(os.path.join(ICI, 'resultats-gf.json'), 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=1)
    for k, o in res.items():
        print('%-28s déficit 2032 %5.1f %% (%4.1f-%4.1f) | dette 2032 %4.0f %% | déficit 2038 %5.1f %% | dette 2038 %4.0f %% (%3.0f-%3.0f) | solde régime %+6.0f Md€' % (
            k, 100 * o['deficit_regime_pct']['p50'], 100 * o['deficit_regime_pct']['p10'], 100 * o['deficit_regime_pct']['p90'], 100 * o['dette2032']['p50'],
            100 * o['deficit2038_pct']['p50'], 100 * o['dette2038']['p50'], 100 * o['dette2038']['p10'], 100 * o['dette2038']['p90'], o['solde_regime']['p50']))


if __name__ == '__main__':
    main()
