# -*- coding: utf-8 -*-
"""Bascule neutre des collectivités (v5.9, chantier B) : gagnants et perdants par type de commune si la taxe foncière communale est remplacée par une part de la taxe de 1 %.
Usage : python3 -I sources/calculs/bascule_collectivites.py  (depuis la racine du dépôt) ; sortie : sources/calculs/resultats-bascule-collectivites.txt.
Données : sources/donnees/communes_fiscalite_2024.csv (OFGL, base consolidée des communes 2024 et base fiscale simplifiée 2024 ; prix : « Indicateurs immobiliers par commune 2014-2024 »,
data.gouv, dérivé de DVF, moyenne au m² 2024 ; densité : grille communale Insee 2020, 4 niveaux).
Méthode (hypothèses H828-H831, sources/bascule-collectivites.md) :
  - perçu aujourd'hui : TF_i = taxe foncière bâtie (y compris l'ancienne part départementale) + coefficient correcteur + taxe foncière non bâtie (produits 2024) ;
  - valeur de marché de l'immobilier de la commune ≈ base nette de TFPB × prix au m² de la commune (⚠️ : la valeur locative au m² est supposée uniforme ; les locaux professionnels suivent le prix des logements) ;
    prix manquant : moyenne du département pondérée par les bases, sinon nationale ;
  - clé « localisation » : chaque commune reçoit la même fraction de la taxe de 1 % sur l'immobilier situé chez elle, calée pour que le total soit égal au total de TF_i (neutralité du niveau) ;
  - péréquation : part (1 − alpha) répartie par habitant ; garantie individuelle (FNGIR-like) = écart résiduel, figée en euros.
"""
import csv, statistics, os
RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
F = os.path.join(RACINE, 'sources', 'donnees', 'communes_fiscalite_2024.csv')
OUT = os.path.join(RACINE, 'sources', 'calculs', 'resultats-bascule-collectivites.txt')

def num(x):
    try: return float(x)
    except: return 0.0

C = []
for r in csv.DictReader(open(F, encoding='utf-8')):
    pop = num(r['population'])
    if pop <= 0: continue
    tf = num(r['tfb']) + num(r['tfb_coco']) + num(r['tfnb'])
    C.append({'code': r['code_insee'], 'nom': r['commune'], 'dep': r['departement_code'], 'pop': pop, 'tf': tf, 'base': num(r['base_nette_tfpb']), 'prix': num(r['prix_m2_moyen_2024']),
              'rural': r['rural'] == 'Oui', 'montagne': r['montagne'] == 'Oui', 'touristique': r['touristique'] == 'Oui', 'densite': r['densite_insee'] or '?'})
# prix manquants : moyenne départementale pondérée par les bases
dep = {}
for c in C:
    if c['prix'] > 0 and c['base'] > 0:
        d = dep.setdefault(c['dep'], [0.0, 0.0]); d[0] += c['prix'] * c['base']; d[1] += c['base']
nat = sum(v[0] for v in dep.values()) / sum(v[1] for v in dep.values())
manq = 0
for c in C:
    if c['prix'] <= 0:
        manq += 1; d = dep.get(c['dep']); c['prix'] = d[0] / d[1] if d and d[1] > 0 else nat
    c['valeur'] = c['base'] * c['prix']
TF = sum(c['tf'] for c in C); V = sum(c['valeur'] for c in C); POP = sum(c['pop'] for c in C)

def nouvelle(c, alpha):
    return alpha * TF * c['valeur'] / V + (1 - alpha) * TF * c['pop'] / POP

def groupe(c):
    p = c['pop']
    if c['code'] == '75056': return '7 Paris'
    if p < 500: return '1 moins de 500'
    if p < 2000: return '2 500 à 2 000'
    if p < 10000: return '3 2 000 à 10 000'
    if p < 50000: return '4 10 000 à 50 000'
    if p < 200000: return '5 50 000 à 200 000'
    return '6 plus de 200 000 (hors Paris)'
DENS = {'1': '1 dense', '2': '2 intermédiaire', '3': '3 peu dense', '4': '4 très peu dense', '?': '? inconnu'}
# richesse foncière : quintiles de TF par habitant (population pondérée)
srt = sorted(C, key=lambda c: c['tf'] / c['pop']); cum = 0
for c in srt:
    cum += c['pop']; c['quintileTF'] = 'Q%d' % min(5, 1 + int(5 * (cum - 0.5 * c['pop']) / POP))
srt = sorted(C, key=lambda c: c['prix']); cum = 0
for c in srt:
    cum += c['pop']; c['quintilePrix'] = 'Q%d' % min(5, 1 + int(5 * (cum - 0.5 * c['pop']) / POP))

L = []
def p(s=''): L.append(s)
p('Bascule neutre des collectivités : gagnants et perdants par type de commune (v5.9, 05/11/2026) ; script sources/calculs/bascule_collectivites.py')
p('communes : %d ; population : %.1f M ; taxe foncière perçue (TFB + coefficient correcteur + TFNB) : %.2f Md€ ; prix manquants remplacés : %d' % (len(C), POP / 1e6, TF / 1e9, manq))
p('valeur de marché estimée (base nette × prix au m², échelle relative) ; prix moyen national pondéré par les bases : %.0f €/m²' % nat)
for alpha in (1.0, 0.5):
    p(); p('=== Clé : %d %% localisation de la taxe de 1 %%, %d %% par habitant (sans garantie) ===' % (100 * alpha, 100 * (1 - alpha)))
    for nomg, fg, ordre in (('taille', groupe, None), ('densité', lambda c: DENS.get(c['densite'], c['densite']), None), ('richesse foncière (quintile de TF par habitant)', lambda c: c['quintileTF'], None),
                             ('prix immobilier (quintile)', lambda c: c['quintilePrix'], None), ('rurale (OFGL)', lambda c: 'rurale' if c['rural'] else 'non rurale', None),
                             ('touristique (OFGL)', lambda c: 'touristique' if c['touristique'] else 'non touristique', None), ('montagne (OFGL)', lambda c: 'montagne' if c['montagne'] else 'hors montagne', None)):
        p('-- par %s : groupe | communes | population (M) | TF aujourd\'hui (€/hab) | après (€/hab) | écart (€/hab) | écart (M€) | part des communes perdantes | part des habitants dans une commune perdante' % nomg)
        G = {}
        for c in C:
            g = fg(c); x = G.setdefault(g, {'n': 0, 'pop': 0, 'tf': 0, 'nv': 0, 'perd': 0, 'popPerd': 0})
            nv = nouvelle(c, alpha); x['n'] += 1; x['pop'] += c['pop']; x['tf'] += c['tf']; x['nv'] += nv
            if nv < c['tf']: x['perd'] += 1; x['popPerd'] += c['pop']
        for g in sorted(G):
            x = G[g]
            p('%s | %d | %.2f | %.0f | %.0f | %+.0f | %+.0f | %.0f %% | %.0f %%' % (g, x['n'], x['pop'] / 1e6, x['tf'] / x['pop'], x['nv'] / x['pop'], (x['nv'] - x['tf']) / x['pop'], (x['nv'] - x['tf']) / 1e6, 100 * x['perd'] / x['n'], 100 * x['popPerd'] / x['pop']))
    ec = sorted(((nouvelle(c, alpha) - c['tf']) / c['pop'], c) for c in C if c['pop'] >= 10000)
    p('-- communes de 10 000 habitants ou plus : 5 plus fortes pertes (€/hab) : ' + ' ; '.join('%s %+.0f' % (c['nom'], e) for e, c in ec[:5]))
    p('-- 5 plus forts gains (€/hab) : ' + ' ; '.join('%s %+.0f' % (c['nom'], e) for e, c in ec[-5:]))
    gar = sum(max(0, c['tf'] - nouvelle(c, alpha)) for c in C)
    p('-- garantie individuelle nécessaire pour qu\'aucune commune ne perde en 2029 : %.2f Md€ (prélevée sur les gagnantes : même montant ; c\'est un FNGIR)' % (gar / 1e9))
    disp = statistics.pstdev([(nouvelle(c, alpha) - c['tf']) / c['tf'] for c in C if c['tf'] > 0])
    p('-- dispersion des écarts relatifs (écart-type, communes) : %.0f %%' % (100 * disp))
open(OUT, 'w').write('\n'.join(L) + '\n')
print('\n'.join(L))
