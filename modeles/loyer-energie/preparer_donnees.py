# -*- coding: utf-8 -*-
# Prépare donnees/*.csv et donnees.js à partir des fichiers bruts (hors dépôt) :
#   $DONNEES/loyer-energie/ (agrégats ADEME, carte des loyers 2025)
# Lancer : python3 -I preparer_donnees.py
import csv, json, os, statistics
RAW = os.path.expandvars('$DONNEES/loyer-energie/')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'donnees')
os.makedirs(OUT, exist_ok=True)
A = json.load(open(RAW + 'dpe_agregats_ademe_2026-11-03.json'))
B = json.load(open(RAW + 'dpe_agregats_ademe_besoins_2026-11-03.json'))
classes = list('ABCDEFG')
dpe = {}
rows = [['zone', 'classe', 'n_dpe_appartements', 'ef_kwh_m2_an', 'ep_kwh_m2_an']]
def avg(agg, c): return [x['metric'] for x in agg['aggs'] if x['value'] == c][0]
for z in ['fr', 'grenoble', 'angers']:
    cnt = B[z + '|count']
    dpe[z] = {}
    for c in classes:
        n = [x['total'] for x in cnt['aggs'] if x['value'] == c][0]
        ef = avg(B[z + '|conso_5_usages_par_m2_ef'], c); ep = avg(B[z + '|conso_5_usages_par_m2_ep'], c)
        dpe[z][c] = dict(n=n, ef=round(ef, 1), ep=round(ep, 1))
        rows.append([z, c, n, round(ef, 1), round(ep, 1)])
csv.writer(open(OUT + '/dpe_par_classe.csv', 'w', newline='')).writerows(rows)
# mix d'énergie de chauffage principal (appartements)
def mix(key):
    t = A[key]['aggs']; tot = sum(x['total'] for x in t)
    return {x['value']: round(x['total'] / tot, 4) for x in t}
mixes = {'fr': mix('fr|appartement|energie'), 'grenoble': mix('grenoble|appartement|energie')}
mixes['angers'] = mixes['fr']  # non extrait : mix national par défaut
rows = [['zone', 'energie', 'part']]
for z, m in mixes.items():
    for e, p in m.items(): rows.append([z, e, p])
csv.writer(open(OUT + '/energie_chauffage.csv', 'w', newline='')).writerows(rows)
# loyers
loy = {}
rows = [['zone', 'loyer_m2_charges_comprises', 'borne_basse', 'borne_haute', 'nb_annonces', 'source']]
for fn, lab in [('pred-app-mef-dhup.csv', 'appartement'), ('pred-app12-mef-dhup.csv', 'appartement_1_2_pieces')]:
    R = list(csv.DictReader(open(RAW + fn, encoding='latin-1'), delimiter=';'))
    f = lambda s: float(s.replace(',', '.'))
    for r in R:
        if r['INSEE_C'] in ('38185', '49007'):
            z = {'38185': 'grenoble', '49007': 'angers'}[r['INSEE_C']]
            loy[(z, lab)] = f(r['loypredm2'])
            rows.append([z + '_' + lab, round(f(r['loypredm2']), 2), round(f(r['lwr.IPm2']), 2), round(f(r['upr.IPm2']), 2), r['nbobs_com'], fn])
    med = statistics.median(f(r['loypredm2']) for r in R)
    loy[('fr', lab)] = med
    rows.append(['mediane_des_communes_' + lab, round(med, 2), '', '', len(R), fn])
csv.writer(open(OUT + '/loyers_carte_2025.csv', 'w', newline='')).writerows(rows)
js = 'var DONNEES_ADEME = ' + json.dumps({'dpe': dpe, 'mix': mixes, 'loyer': {z: round(loy[(z, 'appartement_1_2_pieces')], 2) for z in ['fr', 'grenoble', 'angers']}, 'loyer_tous_appartements': {z: round(loy[(z, 'appartement')], 2) for z in ['fr', 'grenoble', 'angers']}}, ensure_ascii=False, indent=1) + ';\nif (typeof module !== "undefined") module.exports = DONNEES_ADEME;\n'
open(os.path.dirname(os.path.abspath(__file__)) + '/donnees.js', 'w').write(js)
print(open(OUT + '/loyers_carte_2025.csv').read())
