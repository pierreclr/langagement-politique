# -*- coding: utf-8 -*-
# Télécharge des extraits de la base DPE (ADEME) et la carte des loyers 2025.
# Usage : python3 -I telecharger_donnees.py
# Sortie : $DONNEES/loyers-energie/ (brut, hors dépôt) ; extraits compressés copiés dans donnees/ par preparer_donnees.py
import csv, gzip, json, os, urllib.parse, urllib.request, time
RAW = os.path.expandvars('$DONNEES/loyers-energie/')
os.makedirs(RAW, exist_ok=True)
API = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines'
CHAMPS = ['numero_dpe', 'etiquette_dpe', 'type_batiment', 'surface_habitable_logement', 'conso_5_usages_par_m2_ef',
          'conso_5_usages_par_m2_ep', 'conso_5_usages_ef', 'besoin_chauffage', 'besoin_ecs', 'besoin_refroidissement',
          'conso_chauffage_ef', 'conso_ecs_ef', 'cout_total_5_usages', 'type_energie_principale_chauffage',
          'type_energie_n1', 'conso_5_usages_ef_energie_n1', 'type_energie_n2', 'conso_5_usages_ef_energie_n2',
          'type_energie_n3', 'conso_5_usages_ef_energie_n3', 'periode_construction', 'date_etablissement_dpe',
          'code_insee_ban', 'code_postal_ban', 'type_installation_chauffage', 'hauteur_sous_plafond']
PARIS = ' OR '.join(str(75100 + i) for i in range(1, 21))
LYON = ' OR '.join(str(69380 + i) for i in range(1, 10))
ZONES = {
    'paris': f'code_insee_ban:({PARIS}) AND type_batiment:appartement AND date_etablissement_dpe:[2026-01-01 TO 2026-02-28]',
    'lyon': f'code_insee_ban:({LYON}) AND type_batiment:appartement AND date_etablissement_dpe:[2026-01-01 TO *]',
    'grenoble': 'code_insee_ban:38185 AND type_batiment:appartement AND date_etablissement_dpe:[2026-01-01 TO *]',
    'angers': 'code_insee_ban:49007 AND type_batiment:appartement AND date_etablissement_dpe:[2026-01-01 TO *]',
}
def get(url):
    for i in range(4):
        try:
            return json.load(urllib.request.urlopen(url, timeout=120))
        except Exception as e:
            print('retry', e); time.sleep(3)
    raise SystemExit('échec')
# Zone rurale : les communes de la Creuse (23), codes INSEE tirés de la carte des loyers, par lots
def communes_creuse():
    import io
    t = open(RAW + 'pred-mai-mef-dhup.csv', encoding='latin-1').read()
    return sorted({r['INSEE_C'] for r in csv.DictReader(io.StringIO(t), delimiter=';') if r['DEP'] == '23'})
def telecharger_creuse():
    out = RAW + 'dpe_creuse.csv.gz'
    if os.path.exists(out): return
    codes = communes_creuse(); rows = []
    for i in range(0, len(codes), 25):
        qs = 'code_insee_ban:(' + ' OR '.join(codes[i:i+25]) + ') AND date_etablissement_dpe:[2025-01-01 TO *]'
        url = API + '?' + urllib.parse.urlencode({'size': 10000, 'qs': qs, 'select': ','.join(CHAMPS), 'sort': 'numero_dpe'})
        while url:
            d = get(url); rows += d['results']; url = d.get('next') if d['results'] else None
        print('creuse', len(rows))
    with gzip.open(out, 'wt', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=CHAMPS, extrasaction='ignore'); w.writeheader()
        for r in rows: w.writerow(r)
for z, qs in ZONES.items():
    out = RAW + f'dpe_{z}.csv.gz'
    if os.path.exists(out): continue
    url = API + '?' + urllib.parse.urlencode({'size': 10000, 'qs': qs, 'select': ','.join(CHAMPS), 'sort': 'numero_dpe'})
    rows = []
    while url:
        d = get(url)
        rows += d['results']
        url = d.get('next') if d['results'] else None
        print(z, len(rows), '/', d.get('total'))
    with gzip.open(out, 'wt', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=CHAMPS, extrasaction='ignore'); w.writeheader()
        for r in rows: w.writerow(r)
telecharger_creuse()
base = 'https://static.data.gouv.fr/resources/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025/'
for fn, path in [('pred-app12-mef-dhup.csv', '20251211-144934/'), ('pred-app3-mef-dhup.csv', '20251211-144951/'),
                 ('pred-mai-mef-dhup.csv', '20251211-145039/'), ('pred-app-mef-dhup.csv', '20251211-145010/')]:
    if not os.path.exists(RAW + fn):
        print('à télécharger avec curl -O', base + path + fn, 'dans', RAW)
