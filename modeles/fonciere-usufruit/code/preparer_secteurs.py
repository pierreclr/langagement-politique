#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prix et loyers par type de territoire pour la v2 de modeles/fonciere-usufruit/ (T81 v2).

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Seul script qui lit les données brutes (hors dépôt) ;
il écrit donnees/secteurs.csv, lu par calculer.py. Usage : python3 -I modeles/fonciere-usufruit/code/preparer_secteurs.py (≈ 1 min).

Sources (hors dépôt, $DONNEES/) :
  - DVF géolocalisées 2024, France entière (DGFiP, format Etalab), sources/dvf/dvf_2024_france.csv.gz (cote A) ;
  - Aires d'attraction des villes 2020, géographie au 01/01/2025 (Insee), sources/aav2020/AAV2020_au_01-01-2025.xlsx (cote A),
    téléchargé le 09/11/2026 depuis https://www.insee.fr/fr/statistiques/fichier/4803954/AAV2020_au_01-01-2025.zip
    (SHA-256 du zip : 738f81b12832fe294bd24ddbfe3a31830c20d850143fc8b4393f18d4b8ee8181) ;
  - Carte des loyers 2025 (DHUP, ministère du Logement), loyers d'annonce prédits charges comprises par commune,
    loyers-energie/pred-app12-mef-dhup.csv (appartements T1-T2), pred-app3-mef-dhup.csv (T3 et plus),
    pred-mai-mef-dhup.csv (maisons) (cote A, modèle économétrique sur annonces).

Secteurs (hypothèse H-FU38) : Paris = commune de Paris ; grandes métropoles = communes des aires d'attraction de
700 000 habitants ou plus (y compris l'aire de Paris hors Paris) ; villes moyennes = aires de 50 000 à 700 000 habitants ;
petites villes et rural = aires de moins de 50 000 habitants et communes hors attraction des villes.

Ventes retenues : mutations « Vente » d'un seul logement (appartement ou maison, dépendances admises), surface 9 à 300 m²,
prix 15 000 € à 5 M€, prix au m² 300 à 30 000 €. Médianes (robustes aux erreurs de saisie de DVF).
"""
import csv, gzip, io, os, re, sys, zipfile
import xml.etree.ElementTree as ET

sys.dont_write_bytecode = True
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
DONNEES = os.path.expandvars('$DONNEES')
AAV = os.path.join(DONNEES, 'sources', 'aav2020', 'AAV2020_au_01-01-2025.xlsx')
DVF = os.path.join(DONNEES, 'sources', 'dvf', 'dvf_2024_france.csv.gz')
LOYERS = {'app12': 'pred-app12-mef-dhup.csv', 'app3': 'pred-app3-mef-dhup.csv', 'mai': 'pred-mai-mef-dhup.csv'}
SECTEURS = ('paris', 'metropoles', 'villes_moyennes', 'rural')
NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'


def lire_feuille_xlsx(chemin, numero):
    """Lecteur xlsx minimal (bibliothèque standard) : liste des lignes (listes de chaînes) de la feuille `numero`."""
    z = zipfile.ZipFile(chemin)
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).iter(NS + 'si'):
            ss.append(''.join(t.text or '' for t in si.iter(NS + 't')))
    lignes = []
    for row in ET.fromstring(z.read(f'xl/worksheets/sheet{numero}.xml')).iter(NS + 'row'):
        vals = []
        for c in row.findall(NS + 'c'):
            v = c.find(NS + 'v')
            if v is None:
                vals.append(''.join(x.text or '' for x in c.iter(NS + 't')))
            else:
                vals.append(ss[int(v.text)] if c.get('t') == 's' else v.text)
        lignes.append(vals)
    return lignes


def secteur_de(codgeo, taav):
    """Fonction pure : secteur d'une commune selon son code et la tranche de son aire (TAAV2017 : 0 hors attraction,
    1 < 50 000 hab., 2 de 50 000 à 200 000, 3 de 200 000 à 700 000, 4 ≥ 700 000, 5 aire de Paris)."""
    if codgeo == '75056':
        return 'paris'
    if taav in ('4', '5'):
        return 'metropoles'
    if taav in ('2', '3'):
        return 'villes_moyennes'
    return 'rural'


def commune_mere(code):
    """Arrondissements municipaux -> commune (Paris, Lyon, Marseille)."""
    if code.startswith('751') and len(code) == 5:
        return '75056'
    if code.startswith('6938'):
        return '69123'
    if re.match(r'^132(0[1-9]|1[0-6])$', code):
        return '13055'
    return code


def mediane(v):
    v = sorted(v)
    n = len(v)
    if n == 0:
        return float('nan')
    return v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2


def mediane_ponderee(paires):
    paires = sorted(p for p in paires if p[1] > 0)
    tot = sum(w for _, w in paires)
    acc = 0.0
    for x, w in paires:
        acc += w
        if acc >= tot / 2:
            return x
    return float('nan')


def main():
    aires = {l[0]: l[2] for l in lire_feuille_xlsx(AAV, 2)[6:] if l and l[0]}
    communes = {}
    for l in lire_feuille_xlsx(AAV, 3)[6:]:
        if l and l[0]:
            communes[l[0]] = secteur_de(l[0], aires.get(l[2], '0'))

    obs = {s: {'app': [], 'mai': [], 'T1': [], 'T2': [], 'T3': [], 'T4': [], 'T5': [], 'surf': {k: [] for k in ('T2', 'T3', 'T4')},
               'm2app': [], 'm2mai': [], 'tous': []} for s in SECTEURS}
    ventes_commune = {}
    non_trouvees = 0

    def traiter(rows):
        nonlocal non_trouvees
        if not rows or rows[0]['nature_mutation'] != 'Vente':
            return
        logts = [r for r in rows if r['type_local'] in ('Appartement', 'Maison')]
        if len(logts) != 1:
            return
        r = logts[0]
        try:
            prix = float(r['valeur_fonciere'])
            surf = float(r['surface_reelle_bati'] or 0)
            pieces = int(float(r['nombre_pieces_principales'] or 0))
        except ValueError:
            return
        if not (9 <= surf <= 300 and 15000 <= prix <= 5e6 and 300 <= prix / surf <= 30000):
            return
        code = commune_mere(r['code_commune'])
        s = communes.get(code)
        if s is None:
            non_trouvees += 1
            return
        ventes_commune[r['code_commune']] = ventes_commune.get(r['code_commune'], 0) + 1
        o = obs[s]
        o['tous'].append(prix)
        if r['type_local'] == 'Appartement':
            o['app'].append(prix)
            o['m2app'].append(prix / surf)
        else:
            o['mai'].append(prix)
            o['m2mai'].append(prix / surf)
        if 1 <= pieces <= 5:
            k = f'T{pieces}'
            if r['type_local'] == 'Appartement' or pieces >= 3:   # T1-T2 : appartements ; T3 et plus : appartements et maisons
                o[k].append(prix)
                if k in o['surf']:
                    o['surf'][k].append(surf)

    with gzip.open(DVF, 'rt', encoding='utf-8') as f:
        courant, rows = None, []
        for r in csv.DictReader(f):
            if r['id_mutation'] != courant:
                traiter(rows)
                courant, rows = r['id_mutation'], []
            rows.append(r)
        traiter(rows)

    loyers = {s: {} for s in SECTEURS}
    for cle, fic in LOYERS.items():
        paires = {s: [] for s in SECTEURS}
        with open(os.path.join(DONNEES, 'loyers-energie', fic), encoding='latin-1') as f:
            for r in csv.DictReader(f, delimiter=';'):
                code = r['INSEE_C']
                s = communes.get(commune_mere(code))
                if s is None:
                    continue
                paires[s].append((float(r['loypredm2'].replace(',', '.')), ventes_commune.get(code, 0)))
        for s in SECTEURS:
            loyers[s][cle] = mediane_ponderee(paires[s])

    total = sum(len(obs[s]['tous']) for s in SECTEURS)
    champs = ['secteur', 'ventes', 'part_ventes', 'prix_median_tous', 'prix_moyen_tous', 'prix_m2_app', 'prix_m2_mai',
              'prix_T1', 'prix_T2', 'prix_T3', 'prix_T4', 'prix_T5', 'surf_T2', 'surf_T3', 'surf_T4',
              'loyer_m2_app12', 'loyer_m2_app3', 'loyer_m2_mai', 'n_T2', 'n_T3', 'n_T4']
    with open(os.path.join(RACINE, 'donnees', 'secteurs.csv'), 'w', encoding='utf-8', newline='') as f:
        f.write('# Prix DVF 2024 (DGFiP/Etalab, ventes d\'un seul logement, médianes) et loyers de la Carte des loyers 2025 (DHUP, '
                'charges comprises, médiane des communes pondérée par les ventes DVF) par secteur ; généré par code/preparer_secteurs.py\n')
        w = csv.writer(f)
        w.writerow(champs)
        for s in SECTEURS:
            o = obs[s]
            w.writerow([s, len(o['tous']), round(len(o['tous']) / total, 4), round(mediane(o['tous'])),
                        round(sum(o['tous']) / len(o['tous'])), round(mediane(o['m2app'])), round(mediane(o['m2mai'])),
                        round(mediane(o['T1'])), round(mediane(o['T2'])), round(mediane(o['T3'])), round(mediane(o['T4'])),
                        round(mediane(o['T5'])), round(mediane(o['surf']['T2']), 1), round(mediane(o['surf']['T3']), 1),
                        round(mediane(o['surf']['T4']), 1), round(loyers[s]['app12'], 2), round(loyers[s]['app3'], 2),
                        round(loyers[s]['mai'], 2), len(o['T2']), len(o['T3']), len(o['T4'])])
    print(f'donnees/secteurs.csv écrit ; {total} ventes retenues ; {non_trouvees} ventes hors du zonage 2025 (codes communes)')


if __name__ == '__main__':
    main()
