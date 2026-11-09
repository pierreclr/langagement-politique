# -*- coding: utf-8 -*-
"""Tables de la section « Heures par hectare et robots » de resultats.md :  python3 rapport_heures.py"""
import heures as h

NOMS = ['bas', 'central', 'haut']


def r(x, d=0):
    if x is None:
        return 'jamais'
    return ('{:,.%df}' % d).format(x).replace(',', ' ').replace('.', ',')


def main():
    mono = h.MONO['central']
    print('### 1. Les systèmes mesurés (par hectare-équivalent et par an)')
    print('| Cas | Marge avant travail (€/ha) | Heures/ha | Marge par heure (€/h) | Actifs/ha (ETP) |')
    print('|---|---|---|---|---|')
    for n in NOMS:
        s = h.ha_equiv(h.BEC[n])
        print('| Bec-Hellouin extrapolé à 1 ha (%s) | %s | %s | %s | %s |' % (n, r(s['marge']), r(s['heures']), r(h.marge_par_heure(s), 2), r(s['heures'] / h.H_ACTIF, 1)))
    for n in NOMS:
        s = h.MONO[n]
        print('| Monoculture céréalière (%s) | %s | %s | %s | %s |' % (n, r(s['marge']), r(s['heures'], 1), r(h.marge_par_heure(s), 1), r(s['heures'] / h.H_ACTIF, 3)))
    print()
    print('Revenu par actif d\'un céréalier seul, sans robot (central) : %s ha × %s €/ha = %s k€' % (
        r(h.surface_par_actif(mono, 0.0)), r(mono['marge']), r(h.revenu_actif(mono, 0.0, 0.0) / 1000, 1)))
    print()
    print('### 2. Coût horaire du robot aujourd\'hui (€ par heure équivalente humaine) contre le travail humain')
    print('| Scénario | Utilisation (h/an) | Disponibilité réelle | Robot aujourd\'hui (€/h) | Humain chargé (€/h) | Baisse annuelle | Robot en 2036 (€/h) | Robot en 2046 (€/h) |')
    print('|---|---|---|---|---|---|---|---|')
    c0 = {}
    for n in NOMS:
        p = h.PARAM_ROBOT[n]
        c0[n] = h.cout_robot_heure(U=p['U'], k=p['k'], phi=p['phi'])
        print('| %s | %s | %s %% | %s | %s | %s %% | %s | %s |' % (n, r(p['U']), r(100 * p['phi']), r(c0[n], 1), r(h.W_HUMAIN[n]),
              r(100 * p['baisse_an']), r(h.cout_robot_a(c0[n], p['baisse_an'], 10), 1), r(h.cout_robot_a(c0[n], p['baisse_an'], 20), 1)))
    print()
    print('### 3. Seuil : coût horaire du robot (€/h équivalent humain) en dessous duquel le maraîchage bio-intensif bat la céréale')
    print('Monoculture : scénario central (300 €/ha, 6 h/ha), humain à 16 €/h. « jamais » : même un robot gratuit ne suffit pas à cette part robotisée.')
    print()
    for critere, nom in (('ha', 'par hectare'), ('actif', 'par actif')):
        print('**Critère %s**' % nom)
        print('| Part des heures robotisées r | ' + ' | '.join('seuil c* (%s)' % n for n in NOMS) + ' | date (bas) | date (central) | date (haut) |')
        print('|---|---|---|---|---|---|---|')
        for rr in (0.4, 0.7, 0.8, 0.9, 0.95, 0.99):
            cs, ds = [], []
            for n in NOMS:
                b = h.ha_equiv(h.BEC[n])
                if critere == 'ha':
                    c = h.seuil_par_ha(b, mono, rr, h.W_HUMAIN['central'])
                else:
                    c = h.seuil_par_actif(b, mono, rr)
                cs.append(c)
                ds.append(h.date_seuil(c0[n], c, h.PARAM_ROBOT[n]['baisse_an']))
            print('| %s %% | ' % r(100 * rr) + ' | '.join(r(c, 1) for c in cs) + ' | ' + ' | '.join(str(d) if d else 'jamais' for d in ds) + ' |')
        print()
    print('**Part robotisée minimale avec un robot gratuit** : ' + ' ; '.join(
        '%s : %s %% par ha, %s %% par actif' % (n, r(100 * h.part_robotisee_minimale(h.ha_equiv(h.BEC[n]), mono, 16.0, 'ha')),
                                               r(100 * h.part_robotisee_minimale(h.ha_equiv(h.BEC[n]), mono, 16.0, 'actif'))) for n in NOMS))
    print()
    print('### 4. Table générique : marge par hectare (avant travail) qu\'un système doit atteindre pour égaler la céréale (profit 204 €/ha à 16 €/h)')
    print('| Heures/ha | Au coût humain 16 €/h (€/ha) | Au coût robot 8 €/h (€/ha) | Marge par heure requise à 16 €/h |')
    print('|---|---|---|---|')
    pm = h.profit_ha(mono, 0.0, 0.0, 16.0)
    for hh in (10, 30, 100, 300, 1000, 3000, 20000):
        print('| %s | %s | %s | %s |' % (r(hh), r(h.marge_requise(hh, 16.0, pm)), r(h.marge_requise(hh, 8.0, pm)), r((h.marge_requise(hh, 16.0, pm)) / hh, 1)))
    print()
    print('### 5. Contraintes de débouchés')
    for ca in (328000, 573000):
        s = h.surface_saturation_ha(6.8e9, ca)
        print('- À %s k€ de chiffre d\'affaires par hectare, **%s ha** suffiraient à produire toute la valeur des fruits et légumes français (6,8 Md€, 2021, fruits inclus) : %s %% de la SAU.' % (
            r(ca / 1000), r(s), r(100 * h.part_sau(s), 3)))
    for k in (2, 5, 10):
        print('- Offre multipliée par %d : prix divisé par %s (élasticité −0,58 ⚠️).' % (k, r(1 / h.prix_relatif(k), 1)))
    print('- Offre maximale pour ne pas perdre plus de 20 %% de prix : ×%s.' % r(h.multiple_offre_max(0.2), 2))


if __name__ == '__main__':
    main()
