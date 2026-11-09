# -*- coding: utf-8 -*-
"""Génère les tables de resultats.md :  python3 rapport.py > resultats-tables.txt"""
import modele as m

F = m.charger_filieres()
NOMS = ['bas', 'central', 'haut']


def r(x, d=0):
    return ('{:,.%df}' % d).format(x).replace(',', ' ').replace('.', ',')


def main():
    cv = m.CV_INTRA
    print('## A. Calibrage')
    print('- Exploitations : %s ; revenu moyen modélisé %s k€ ; subventions moyennes %s k€ (%s %% du revenu)' % (
        r(m.N_EXPLOITATIONS), r(sum(f['part'] * f['rcai'] for f in F), 1),
        r(sum(f['part'] * m.subvention(f) for f in F), 1),
        r(100 * sum(f['part'] * m.subvention(f) for f in F) / sum(f['part'] * f['rcai'] for f in F))))
    print('- Part à revenu négatif avec aides : %s %% ; sans aides : %s %% (fait : 42 %%)' % (
        r(100 * m.part_negative_nationale(F, cv, False, 200), 1), r(100 * m.part_negative_nationale(F, cv, True, 200), 1)))
    print('- Aides sortantes à 100 %% : %s M€ par an (cible base + couplées : 4 066 M€)' % r(m.montant_sortie_meur(F, 10)))
    print()
    trajs = {n: {c: m.trajectoire(F, n, c) for c in ('union', 'france_seule')} for n in NOMS}
    print('## B. Budget net annuel (M€, positif = gain), cadre Union (UE + France consolidés)')
    print('| Année | ' + ' | '.join(NOMS) + ' |')
    print('|---|' + '---|' * 3)
    for t in range(10):
        print('| %d | ' % (t + 1) + ' | '.join(r(trajs[n]['union'][t]['budget']['net_meur']) for n in NOMS) + ' |')
    print('| cumul 10 ans (Md€) | ' + ' | '.join(
        r(sum(x['budget']['net_meur'] for x in trajs[n]['union']) / 1000, 1) for n in NOMS) + ' |')
    print()
    print('## C. Budget net annuel (M€), cadre France seule (aucune économie de fonds européens, PSE sur fonds nationaux)')
    print('| Année | ' + ' | '.join(NOMS) + ' |')
    print('|---|' + '---|' * 3)
    for t in range(10):
        print('| %d | ' % (t + 1) + ' | '.join(r(trajs[n]['france_seule'][t]['budget']['net_meur']) for n in NOMS) + ' |')
    print('| cumul 10 ans (Md€) | ' + ' | '.join(
        r(sum(x['budget']['net_meur'] for x in trajs[n]['france_seule']) / 1000, 1) for n in NOMS) + ' |')
    print()
    print('## D. Décomposition de l\'année 10 (M€, cadre Union, scénario central)')
    b = trajs['central']['union'][-1]['budget']
    for k in ('sortie_meur', 'pse_meur', 'admin_meur', 'fonds_meur', 'taxes_meur', 'restitution_meur', 'net_meur'):
        print('- %s : %s' % (k, r(b[k])))
    print()
    print('## E. Exploitations touchées par filière, année 10')
    for n in NOMS:
        s = trajs[n]['union'][-1]['situation']
        print()
        print('### Scénario %s' % n)
        print('| Filière | Exploitations | Variation moyenne du revenu (k€) | Sous le plancher sans fonds | Perte > 25 % du revenu moyen | Revenu < 0 avant | Revenu < 0 sans fonds | Revenu < 0 avec fonds |')
        print('|---|---|---|---|---|---|---|---|')
        for f in F:
            v = s['par_filiere'][f['nom']]
            print('| %s | %s | %s | %s | %s | %s %% | %s %% | %s %% |' % (
                f['nom'], r(v['exploitations']), r(v['variation_moyenne_keur'], 1),
                r(v['exploitations_sous_plancher_sans_fonds']), r(v['exploitations_perte_sup_25pct']),
                r(100 * v['part_negatif_avant']), r(100 * v['part_negatif_sans_fonds']), r(100 * v['part_negatif_avec_fonds'])))
        print('| **Total** | %s | | %s | %s | %s %% | %s %% | %s %% |' % (
            r(m.N_EXPLOITATIONS), r(s['exploitations_sous_plancher_sans_fonds']), r(s['exploitations_perte_sup_25pct']),
            r(100 * s['part_negatif_avant'], 1), r(100 * s['part_negatif_sans_fonds'], 1), r(100 * s['part_negatif_avec_fonds'], 1)))
    print()
    print('## F. Trajectoire de la part d\'exploitations à revenu négatif (%), sans fonds / avec fonds')
    print('| Année | ' + ' | '.join('%s sans | %s avec' % (n, n) for n in NOMS) + ' |')
    print('|---|' + '---|---|' * 3)
    for t in (0, 2, 4, 6, 9):
        print('| %d | ' % (t + 1) + ' | '.join('%s | %s' % (
            r(100 * trajs[n]['union'][t]['situation']['part_negatif_sans_fonds'], 1),
            r(100 * trajs[n]['union'][t]['situation']['part_negatif_avec_fonds'], 1)) for n in NOMS) + ' |')
    print()
    print('## G. Fonds de transition (M€ par an)')
    print('| Année | ' + ' | '.join(NOMS) + ' |')
    print('|---|' + '---|' * 3)
    for t in (0, 2, 4, 6, 9):
        print('| %d | ' % (t + 1) + ' | '.join(r(trajs[n]['union'][t]['budget']['fonds_meur']) for n in NOMS) + ' |')
    print()
    print('## H. Pollueur-payeur, année 10')
    print('| Scénario | Pesticides : baisse des ventes | Pesticides : recette additionnelle (M€) | Azote : baisse | Azote : recette (M€) | Azote : CO2e évité (Mt) |')
    print('|---|---|---|---|---|---|')
    for n in NOMS:
        x = trajs[n]['union'][-1]
        print('| %s | %s %% | %s | %s %% | %s | %s |' % (n, r(x['pesticides']['baisse_pct'], 1),
              r(x['pesticides']['recette_additionnelle_meur']), r(x['azote']['baisse_pct'], 1),
              r(x['azote']['recette_meur']), r(x['azote']['co2e_evite_mt'], 2)))
    print()
    print('## I. Robots : équilibre économique (gain annuel d\'un adoptant en €, prix d\'équilibre, année d\'équilibre)')
    print('| Cas | Scénario | Gain année 0 (€) | Gain année 10 (€) | Prix d\'équilibre (€) | Prix actuel retenu (€) | Année d\'équilibre | Année avec taxe pesticides ×3 |')
    print('|---|---|---|---|---|---|---|---|')
    for cas in m.ROBOTS:
        for n in NOMS:
            sc = m.SCENARIOS[n]
            ae = m.annee_equilibre(cas, sc)
            surc = (sc['multiple_taxe_phyto'] - 1) * m.taux_effectif_eur_kg() * 1.5 if cas == 'grandes_cultures' else 0.0
            at = m.annee_equilibre(cas, sc, surc)
            f = lambda a: 'déjà rentable' if a == 0.0 else ('> 60 ans' if a is None else r(a, 1) + ' ans')
            print('| %s | %s | %s | %s | %s | %s | %s | %s |' % (cas, n, r(m.gain_robot(cas, sc, 0)), r(m.gain_robot(cas, sc, 10, surc)),
                  r(m.prix_robot_equilibre(cas, sc)), r(m.ROBOTS[cas]['prix']), f(ae), f(at)))
    print()
    print('## J. Pesticides évités : redevance contre robots, année 10')
    print('| Scénario | Baisse par la redevance (×3) | Baisse par les robots (borne haute) |')
    print('|---|---|---|')
    for n in NOMS:
        sc = m.SCENARIOS[n]
        print('| %s | %s %% | %s %% |' % (n, r(m.pesticides(sc, 10)['baisse_pct'], 1), r(100 * m.baisse_phyto_robots(F, sc, 10), 1)))
    print()
    print('## K. Sensibilité de la redevance sur les pesticides (scénario central, année 10) : multiple du taux effectif actuel')
    print('| Multiple | Taux effectif (€/kg) | Hausse du prix payé | Baisse des ventes | Recette additionnelle (M€) | Surcoût net pour les exploitations (M€) |')
    print('|---|---|---|---|---|---|')
    import copy
    for mult in (1, 2, 3, 5, 10, 20):
        sc = copy.deepcopy(m.SCENARIOS['central'])
        sc['multiple_taxe_phyto'] = float(mult)
        p = m.pesticides(sc, 10)
        print('| ×%d | %s | %s %% | %s %% | %s | %s |' % (mult, r(mult * m.taux_effectif_eur_kg(), 1),
              r(100 * (mult - 1) * m.taux_effectif_eur_kg() / m.prix_phyto_eur_kg(), 0), r(p['baisse_pct'], 1),
              r(p['recette_additionnelle_meur']), r(p['delta_depense_agri_meur'])))
    print()
    print('## L. Sensibilité de la politique (scénario central, année 10, cadre Union) : part des aides sortantes recyclée en paiements pour services environnementaux')
    print('| Part PSE | PSE (M€) | Fonds (M€) | Budget net (M€) | Exploitations sous le plancher sans fonds |')
    print('|---|---|---|---|---|')
    for pse in (0.0, 0.25, 0.5, 0.75, 1.0):
        sc = copy.deepcopy(m.SCENARIOS['central'])
        sc['part_pse'] = pse
        b = m.budget(F, sc, 10, m.CV_INTRA, 'union')
        s = m.fonds_et_situation(F, sc, 10, m.CV_INTRA)
        print('| %d %% | %s | %s | %s | %s |' % (pse * 100, r(b['pse_meur']), r(b['fonds_meur']), r(b['net_meur']), r(s['exploitations_sous_plancher_sans_fonds'])))


if __name__ == '__main__':
    main()
