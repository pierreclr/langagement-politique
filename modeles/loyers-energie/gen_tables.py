# -*- coding: utf-8 -*-
# Génère resultats/tables.md (tables markdown par ville et classe) depuis resultats/synthese.csv. Usage : python3 -I gen_tables.py
import csv, os
ICI = os.path.dirname(os.path.abspath(__file__))
R = list(csv.DictReader(open(ICI + '/resultats/synthese.csv')))
NOM = {'paris': 'Paris', 'lyon': 'Lyon', 'grenoble': 'Grenoble', 'angers': 'Angers', 'creuse-appartement': 'Creuse, appartements', 'creuse-maison': 'Creuse, maisons'}
out = []
for v, nom in NOM.items():
    out.append(f'#### {nom} (scénario central)\n')
    out.append('| Classe | Logements (DPE) | Part | Énergie réelle €/mois | Plafond moyen €/mois | Loyer médian de marché €/mois | Loyers au-dessus du plafond (sans effet énergie) | Écart dû à l\'énergie, loyers au-dessus | Baisse moyenne €/mois (tous) | Baisse moyenne (concernés) | Marge de hausse €/mois |')
    out.append('|---|---|---|---|---|---|---|---|---|---|---|')
    L = [r for r in R if r['ville'] == v and r['scenario'] == 'central' and r['groupe_type'] == 'classe']
    tot = sum(int(r['n']) for r in L)
    for r in L:
        pd_, pn = float(r['part_depassant']), float(r['part_depassant_neutre'])
        out.append(f"| {r['groupe']} | {r['n']} | {int(r['n'])/tot:.1%} | {float(r['cout_energie_mois']):.0f} | {float(r['plafond_moy']):.0f} | {float(r['marche_median_moy']):.0f} | {pd_:.0%} ({pn:.0%}) | {100*(pd_-pn):+.0f} pts | {float(r['baisse_tous']):.0f} | {float(r['baisse_concernes']):.0f} | {float(r['marge_hausse']):.0f} |")
    out.append('')
    out.append('Par taille : ' + ' ; '.join(f"{r['groupe']} (n {r['n']}) plafond {float(r['plafond_moy']):.0f} € pour un loyer médian de {float(r['marche_median_moy']):.0f} €, {float(r['part_depassant']):.0%} au-dessus" for r in R if r['ville'] == v and r['scenario'] == 'central' and r['groupe_type'] == 'taille'))
    out.append('')
open(ICI + '/resultats/tables.md', 'w').write('\n'.join(out))
