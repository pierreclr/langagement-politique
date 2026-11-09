#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Chiffrage de l'entreprise d'intérêt public et du « pari » : pôles, holding, effet sur la dette avec le modèle de taux endogène (T74).
Usage : python3 -I modeles/entreprise-interet-public/calculer.py
Lit (lecture seule) le cache du banc (modeles/banc-programmes/donnees/cache/systeme.json) et les fonctions de modeles/taux-endogene/taux.py.
Écrit seulement modeles/entreprise-interet-public/resultats.md et donnees/resultats.json.
"""
import csv, json, os, sys

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
MOD = os.path.dirname(ICI)
sys.path.insert(0, ICI)
sys.path.insert(0, os.path.join(MOD, 'taux-endogene'))
import modele as E   # noqa: E402
import taux as T     # noqa: E402

with open(os.path.join(MOD, 'banc-programmes', 'donnees', 'cache', 'systeme.json'), encoding='utf-8') as f:
    _S = json.load(f)
ECO = _S['eco']
G = 0.03
ANNEES = (2033, 2038, 2048, 2058)


def base_systeme():
    """Notre système (trajectoire de référence exportée, Md€ de 2025 sur le solde primaire, 2029-2058), comme moteur.effet_systeme_md du banc."""
    b = ECO['deficit2024'] - ECO['interets0']
    return {2029 + k: x * ECO['pib0'] + b for k, x in enumerate(_S['systeme']['reference']['primaire'])}


def variantes():
    return {
        'banc': T.params('central', mode='banc', endogene=False, r_sf=0.0345, prime0=0.0, taux_2026=0.0345, ecart_emission=0.0),
        'central': T.params('central'),
        'sens_haut': T.params('central', a_dette_pb=4.0, a_deficit_pb=25.0, gamma_pb=0.09, seuil=1.20),
    }


def somme(a, b):
    return {k: a.get(k, 0.0) + b.get(k, 0.0) for k in set(a) | set(b)}


def effet_dette(eff, chocs):
    """Pour chaque variante de taux : base = notre système + effort qui le stabilise (2038-2058) ; on ajoute le pari. Écarts de dette et d'OAT, effort supplémentaire."""
    base0 = base_systeme()
    out = {}
    for nom, p in variantes().items():
        sup0 = T.effort_supplementaire(base0, ECO, G, p)
        base = somme(base0, T.effort_md(sup0 or 0.0))
        tr0 = T.trajectoire(base, ECO, G, p)
        tr1 = T.trajectoire(somme(base, eff), ECO, G, p, chocs=chocs)
        sup1 = T.effort_supplementaire(somme(base0, eff), ECO, G, p, chocs=chocs)
        d = {an: tr1[an]['ratio'] - tr0[an]['ratio'] for an in tr0}
        pic = max(d, key=lambda a: d[a])
        out[nom] = {
            'effort_base': sup0, 'effort_avec_pari': sup1,
            'dette_base': {a: tr0[a]['ratio'] for a in ANNEES}, 'delta_dette_pts': {a: 100 * d[a] for a in ANNEES},
            'delta_oat_pb': {a: 1e4 * (tr1[a]['r_marche'] - tr0[a]['r_marche']) for a in ANNEES},
            'delta_interets_pts': {a: 100 * (tr1[a]['interets_pct'] - tr0[a]['interets_pct']) for a in ANNEES},
            'pic_an': pic, 'pic_pts': 100 * d[pic],
            'crise_base': T.annee_crise(tr0), 'crise_pari': T.annee_crise(tr1),
        }
    return out


def calc():
    res = {'scenarios': {}}
    with open(os.path.join(ICI, 'donnees', 'precedents.csv'), encoding='utf-8') as f:
        prec = list(csv.DictReader(f, delimiter=';'))
    res['precedents'] = {'n': len(prec), 'taux': E.taux_reussite([r['issue'] for r in prec])}
    for s in E.SCENARIOS:
        series, hold = E.scenario(s)
        env = E.enveloppe_necessaire(hold)
        eff, chocs = E.effet_md(hold)
        r = {'poles': {}, 'enveloppe_tranches': env['enveloppe']}
        for p in E.POLES:
            se, par = series[p], E.PARAMS[p][s]
            r['poles'][p] = {
                'p_projet': E.p_projet(par), 'p_succes': E.p_succes(par),
                'invest_10': sum(se[a]['capex'] + se[a]['rd'] for a in range(2029, 2039)),
                'invest_30': sum(se[a]['capex'] + se[a]['rd'] for a in se),
                'ca_2038': se[2038]['revenus'], 'ca_2058': se[2058]['revenus'],
                'unites_2058': se[2058]['unites'],
                'emplois_2038': se[2038]['emplois'], 'emplois_2058': se[2058]['emplois'],
                'horizon': E.horizon(se), 'horizon_4': E.horizon(se, 0.04),
                'echecs': E.cout_echecs(par), 'echec_total': E.cout_echec_total(par),
            }
        cout = {a: -v for a, v in eff.items()}
        r['cout_public_10'] = sum(cout[a] for a in range(2029, 2039))
        r['cout_public_30'] = sum(cout.values())
        r['cout_annuel_moyen_10'] = r['cout_public_10'] / 10
        r['cout_max'] = max(cout.values()); r['cout_max_an'] = max(cout, key=lambda a: cout[a])
        r['epargne_10'] = sum(hold[a]['epargne'] for a in range(2029, 2039)); r['epargne_30'] = sum(v['epargne'] for v in hold.values())
        r['encours_parts_2058'] = hold[2058]['encours_parts']
        r['emplois_2038'] = hold[2038]['emplois']; r['emplois_2058'] = hold[2058]['emplois']
        r['ca_2038'] = hold[2038]['revenus']; r['ca_2058'] = hold[2058]['revenus']
        r['socle_2058'] = hold[2058]['socle']; r['desendettement_2058'] = hold[2058]['desendettement']
        r['emprunt_conditionne_10'] = sum(env['emprunt_conditionne'][a] for a in range(2029, 2039))
        r['solde_positif_an'] = next((a for a in sorted(hold) if a > 2031 and hold[a]['solde_apu'] > 0), None)
        r['serie_solde'] = {a: hold[a]['solde_apu'] for a in hold}
        r['dette'] = effet_dette(eff, chocs)
        # tout échoue : seules les tranches sont dépensées
        r['cout_tout_echoue_tranches'] = sum(E.cout_echec_total(E.PARAMS[p][s]) for p in E.POLES)
        # holding hors des administrations publiques
        eh, dh = E.effet_hors_apu(hold, env['enveloppe'])
        r['hors_apu'] = {'cout_public_30': -sum(eh.values()), 'dette_holding_max': max(dh.values()), 'dette_holding_2058': dh[2058],
                         'dette': effet_dette(eh, {})['central']}
        res['scenarios'][s] = r
    return res


def fr(x, n=1):
    if x is None:
        return '—'
    return (('%.' + str(n) + 'f') % x).replace('.', ',').replace('-', '−')


def an(x):
    return '> 2058' if x is None else str(x)


def rapport(res):
    L = []
    A = L.append
    A('---\ntitre: Entreprise d\'intérêt public et pari : résultats\ndate: 2026-11-09\nstatut: généré par calculer.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions\n---\n')
    A('# Entreprise d\'intérêt public : premier chiffrage\n')
    A('Généré par `python3 -I modeles/entreprise-interet-public/calculer.py`. Écrit par Claude (IA d\'Anthropic) pour l\'auteur. Méthode et hypothèses H-EIP1 à H-EIP26 : `methode.md`. '
      'Montants en **Md€ de 2025**, **espérances** (pondérées par les probabilités de réussite des projets), pari lancé en 2029. Les trois scénarios mêlent **taille** du programme et **réussite** : le prudent est petit et malchanceux, l\'ambitieux grand et heureux.\n')
    p = res['precedents']
    pp = [E.p_projet(E.PARAMS[q][s]) for q in E.POLES for s in E.SCENARIOS]
    A('**Calibrage sur les précédents** (`donnees/precedents.csv`, %d programmes industriels d\'État français) : réussite nette %s %% ; en comptant les réussites partielles pour moitié, %s %%. '
      'Probabilité qu\'**un** projet passe les deux jalons dans le modèle : %s à %s %% selon le pôle et le scénario ; la série est lancée si **au moins un** des projets parallèles réussit. ⚠️ Échantillon petit et biaisé (on se souvient des grands programmes).\n'
      % (p['n'], fr(100 * p['taux'][0], 0), fr(100 * p['taux'][1], 0), fr(100 * min(pp), 0), fr(100 * max(pp), 0)))
    for s in E.SCENARIOS:
        r = res['scenarios'][s]
        A('## Scénario %s\n' % s)
        A('| Pôle | P(série lancée) | Investissement 2029-2038 | Investissement 2029-2058 | CA 2038 | CA 2058 | Emplois 2038 | Emplois 2058 | 1re année de flux positif | Flux cumulé positif (non actualisé) | Flux cumulé 2058 | Perdu en projets arrêtés | Tout échoue |')
        A('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
        for po in E.POLES:
            x = r['poles'][po]
            A('| %s | %s %% | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s |' % (
                E.NOMS[po], fr(100 * x['p_succes'], 0), fr(x['invest_10']), fr(x['invest_30']), fr(x['ca_2038'], 2), fr(x['ca_2058'], 2),
                fr(x['emplois_2038'], 0), fr(x['emplois_2058'], 0), an(x['horizon']['flux_positif']), an(x['horizon']['cumul_positif']),
                fr(x['horizon']['cumul_2058']), fr(x['echecs']['perdu'], 2), fr(x['echec_total'], 2)))
        A('')
        A('- **Coût public net** (holding consolidée dans les administrations, après ventes, épargne exclue) : %s Md€ sur 2029-2038 (%s Md€/an en moyenne), %s Md€ sur 2029-2058 ; pic %s Md€ en %s ; solde annuel positif à partir de %s.' % (
            fr(r['cout_public_10']), fr(r['cout_annuel_moyen_10'], 2), fr(r['cout_public_30']), fr(r['cout_max'], 2), r['cout_max_an'], an(r['solde_positif_an'])))
        A('- **Enveloppe fixe des tranches** (R&D, équipes, frais de la holding, première décennie) : %s Md€/an ; **emprunt conditionné aux résultats** (capex de série non couvert par l\'enveloppe ni l\'épargne) : %s Md€ cumulés sur 2029-2038.' % (
            fr(r['enveloppe_tranches'], 2), fr(r['emprunt_conditionne_10'])))
        A('- **Épargne en parts viagères** : %s Md€ sur 10 ans, %s Md€ sur 30 ans ; encours %s Md€ en 2058 (les parts s\'éteignent au décès des porteurs).' % (fr(r['epargne_10']), fr(r['epargne_30']), fr(r['encours_parts_2058'])))
        A('- **Ensemble** : CA %s Md€ en 2038, %s Md€ en 2058 ; emplois directs %s en 2038, %s en 2058 ; reversement par le socle %s Md€ en 2058, désendettement %s Md€.' % (
            fr(r['ca_2038'], 1), fr(r['ca_2058'], 1), fr(r['emplois_2038'], 0), fr(r['emplois_2058'], 0), fr(r['socle_2058'], 2), fr(r['desendettement_2058'], 2)))
        A('- **Si tout échoue au second jalon** (pire cas des tranches) : %s Md€ dépensés au total.' % fr(r['cout_tout_echoue_tranches'], 1))
        A('')
        A('**Effet sur la dette** (base : notre système + l\'effort qui le stabilise de 2038 à 2058, croissance nominale 3 %) :\n')
        A('| Taux | Effort stabilisant sans pari (Md€/an) | avec pari | Δ dette 2033 | Δ 2038 | Δ 2048 | Δ 2058 (points de PIB) | Δ OAT 2038 | Δ OAT 2058 (pb) | Pic de Δ dette |')
        A('|---|---|---|---|---|---|---|---|---|---|')
        for v, nom in (('banc', 'banc (3,45 % fixe)'), ('central', 'endogène central'), ('sens_haut', 'sensibilités hautes')):
            d = r['dette'][v]
            A('| %s | %s | %s | %s | %s | %s | %s | %s | %s | %s pt en %s |' % (nom, fr(d['effort_base'], 0), fr(d['effort_avec_pari'], 0),
              fr(d['delta_dette_pts'][2033], 2), fr(d['delta_dette_pts'][2038], 2), fr(d['delta_dette_pts'][2048], 2), fr(d['delta_dette_pts'][2058], 2),
              fr(d['delta_oat_pb'][2038], 1), fr(d['delta_oat_pb'][2058], 1), fr(d['pic_pts'], 2), d['pic_an']))
        h = r['hors_apu']
        A('\nVariante **holding hors des administrations** (unité marchande, H-EIP24) : coût public %s Md€ sur 30 ans ; dette propre de la holding au plus %s Md€ ; Δ dette publique 2038 %s pt, 2058 %s pt (endogène central).\n' % (
            fr(h['cout_public_30']), fr(h['dette_holding_max']), fr(h['dette']['delta_dette_pts'][2038], 2), fr(h['dette']['delta_dette_pts'][2058], 2)))
    A('## Lecture\n')
    A('1. **Les tranches protègent contre l\'échec technique, pas contre l\'échec commercial.** Si tout échoue au second jalon, le pari coûte 7 à 10 Md€ au total ; mais si les séries sont lancées et ne trouvent pas leur marge (calcul au prudent et au central), la perte est le coût complet (29 à 38 Md€ sur 30 ans).')
    A('2. **Le calcul est le poste le plus lourd et le moins sûr** : il ne rapporte que si l\'EBE dépasse son renouvellement (serveurs à 5 ans), ce qui n\'arrive qu\'à l\'ambitieux.')
    A('3. **Les petits réacteurs n\'ont un flux annuel positif qu\'entre 2047 et 2052** et leur flux cumulé reste négatif en 2058 dans les trois scénarios : c\'est un investissement d\'infrastructure à 60 ans, pas un pari rentable sur 30 ans.')
    A('4. **Les objets réparables coûtent peu** (moins de 1,5 Md€ sur 30 ans au central) et créent le plus d\'emplois par euro ; ils ne sont rentables qu\'avec une marge de l\'ordre de 10 %, au-dessus des marges d\'EBIT de 5 à 8 % des grands du secteur (⚠️ de mémoire).')
    A('5. **Effet sur la dette** : de l\'ordre de 0,5 point de PIB en 2038 et 1 à 2 points en 2058 (taux endogène central), soit 1 à 2 Md€ par an d\'effort stabilisant en plus ; davantage si les marchés sont réactifs.')
    return '\n'.join(L) + '\n'


def main():
    res = calc()
    os.makedirs(os.path.join(ICI, 'donnees'), exist_ok=True)
    with open(os.path.join(ICI, 'donnees', 'resultats.json'), 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=1, default=str)
    with open(os.path.join(ICI, 'resultats.md'), 'w', encoding='utf-8') as f:
        f.write(rapport(res))


if __name__ == '__main__':
    main()
