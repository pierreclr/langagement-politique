# -*- coding: utf-8 -*-
# Prépare donnees/ à partir des fichiers bruts (hors dépôt) de telecharger_donnees.py.
# Usage : python3 -I preparer_donnees.py
import csv, io, os, shutil
RAW = os.path.expandvars('$DONNEES/loyers-energie/')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'donnees')
os.makedirs(OUT, exist_ok=True)
for z in ['paris', 'lyon', 'grenoble', 'angers', 'creuse']:
    shutil.copy(RAW + f'dpe_{z}.csv.gz', OUT + f'/dpe_{z}.csv.gz')
VILLES = {'75101', '75102', '75103', '75104', '75105', '75106', '75107', '75108', '75109', '75110', '75111', '75112', '75113',
          '75114', '75115', '75116', '75117', '75118', '75119', '75120', '69381', '69382', '69383', '69384', '69385', '69386',
          '69387', '69388', '69389', '38185', '49007'}
rows = [['type', 'insee', 'commune', 'dep', 'loyer_m2_cc', 'borne_basse_95', 'borne_haute_95', 'niveau', 'nbobs_com']]
for typ, fn in [('app12', 'pred-app12-mef-dhup.csv'), ('app3', 'pred-app3-mef-dhup.csv'), ('mai', 'pred-mai-mef-dhup.csv')]:
    t = open(RAW + fn, encoding='latin-1').read()
    for r in csv.DictReader(io.StringIO(t), delimiter=';'):
        if r['INSEE_C'] in VILLES or r['DEP'] == '23':
            f = lambda s: round(float(s.replace(',', '.')), 3)
            rows.append([typ, r['INSEE_C'], r['LIBGEO'], r['DEP'], f(r['loypredm2']), f(r['lwr.IPm2']), f(r['upr.IPm2']), r['TYPPRED'], r['nbobs_com']])
csv.writer(open(OUT + '/loyers_carte_2025_extraits.csv', 'w', newline='')).writerows(rows)
# prix de l'électricité : option Base 6 kVA, part variable TTC en vigueur (CRE, open data), consulté le 08/11/2026
for l in open(RAW + 'trve_option_base.csv', encoding='utf-8'):
    p = l.strip().split(';')
    if p[0] == '01/08/2026' and p[2] == '6': print('TRVE Base 6 kVA depuis le 01/08/2026 :', p)
print(len(rows) - 1, 'lignes de loyers')

# Observatoires locaux des loyers (OLL) : niveaux de loyers au 01/01 (Paris 2025, Lyon et Grenoble 2024), appartements par nombre de pièces
OLL = [('paris', 'Base_OP_2025_L7501/Base_OP_2025_L7501/Base_OP_2025_L7501.csv'), ('lyon', 'Base_OP_2024_L6900/Base_OP_2024_L6900.csv'), ('grenoble', 'Base_OP_2024_L3800/Base_OP_2024_L3800.csv')]
rows = [['ville', 'annee', 'pieces', 'loyer_mensuel_d1', 'loyer_mensuel_q1', 'loyer_mensuel_median', 'loyer_mensuel_q3', 'loyer_mensuel_d9', 'surface_moyenne', 'nombre_observations']]
for ville, fn in OLL:
    t = open(RAW + 'oll/' + fn, encoding='latin-1').read().lstrip('\ufeff\u00ef\u00bb\u00bf')
    seen = set()
    for r in csv.DictReader(io.StringIO(t), delimiter=';'):
        if all(r[k] == '' for k in ['Zone_calcul', 'Zone_complementaire', 'epoque_construction_local', 'epoque_construction_homogene', 'anciennete_locataire_local', 'anciennete_locataire_homogene']) and r['nombre_pieces_local'] in ('Appart 1P', 'Appart 2P', 'Appart 3P', 'Appart 4P+') and r['nombre_pieces_local'] not in seen:
            seen.add(r['nombre_pieces_local'])
            rows.append([ville, r['Data_year'], r['nombre_pieces_local']] + [r['loyer_mensuel_' + k].replace(',', '.') for k in ['1_decile', '1_quartile', 'median', '3_quartile', '9_decile']] + [r['surface_moyenne'], r['nombre_observations']])
csv.writer(open(OUT + '/oll_extraits.csv', 'w', newline='')).writerows(rows)
