#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prépare les données de Grenoble (exemple chiffré de ville pour l'expérimentation, avec des données réelles ; la ville n'est pas choisie) et de deux villes
témoins possibles (Clermont-Ferrand, Dijon) : ventes DVF 2024 d'un seul logement, prix médians par nombre de pièces et
prix au m² ; part des DPE d'appartements à chauffage collectif à Grenoble.

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026.
Sources : DVF géolocalisées 2024 (DGFiP/Etalab, https://files.data.gouv.fr/geo-dvf/latest/csv/2024/departements/,
départements 38, 63, 21, téléchargées le 09/11/2026 dans donnees/brutes/dvf2024/, empreintes dans SHA256.txt) ;
DPE ADEME de Grenoble (modeles/loyers-energie/donnees/dpe_grenoble.csv.gz, lu sans modification).
Filtres repris de F18 (fonciere-usufruit) : mutations « Vente » d'un seul logement (appartement ou maison, dépendances
admises), surface 9 à 300 m², 300 à 30 000 €/m² ; médianes.
Usage : python3 -I modeles/fonciere-afflux/donnees/preparer_grenoble.py
"""
import csv, gzip, io, os, statistics

ICI = os.path.dirname(os.path.abspath(__file__))
BRUT = os.path.join(ICI, 'brutes', 'dvf2024')
# Grenoble-Alpes Métropole : principales communes (⚠️ liste partielle des 49 communes, celles qui font l'essentiel des ventes)
METRO_GRENOBLE = {'38185', '38421', '38151', '38169', '38229', '38485', '38382', '38158', '38474', '38423', '38486',
                  '38317', '38516', '38179', '38150', '38111', '38545', '38524', '38170', '38562', '38309', '38200'}
ZONES = {'grenoble': ('38', {'38185'}), 'metropole_grenoble': ('38', METRO_GRENOBLE),
         'clermont_ferrand': ('63', {'63113'}), 'dijon': ('21', {'21231'})}


def ventes(dep):
    muts = {}
    with gzip.open(os.path.join(BRUT, f'dvf_{dep}.csv.gz'), 'rb') as f:
        for r in csv.DictReader(io.TextIOWrapper(f, encoding='utf-8')):
            if r['nature_mutation'] != 'Vente':
                continue
            muts.setdefault(r['id_mutation'], []).append(r)
    for rows in muts.values():
        loges = [r for r in rows if r['type_local'] in ('Appartement', 'Maison')]
        if len(loges) != 1:
            continue
        l = loges[0]
        try:
            v, s, p = float(rows[0]['valeur_fonciere']), float(l['surface_reelle_bati']), int(l['nombre_pieces_principales'] or 0)
        except ValueError:
            continue
        if not (9 <= s <= 300) or not (300 <= v / s <= 30000):
            continue
        yield l['code_commune'], l['type_local'], p, v, s


def main():
    out = []
    for z, (dep, communes) in ZONES.items():
        L = [x for x in ventes(dep) if x[0] in communes]
        app = [x for x in L if x[1] == 'Appartement']
        row = dict(zone=z, ventes=len(L), part_appartements=round(len(app) / len(L), 3) if L else 0,
                   prix_m2_app=round(statistics.median(v / s for _, _, _, v, s in app)) if app else '')
        for p in (1, 2, 3, 4):
            sel = [v for _, t, pp, v, _ in L if pp == p and (t == 'Appartement' or p >= 3)]
            row[f'prix_T{p}'] = round(statistics.median(sel)) if sel else ''
            row[f'n_T{p}'] = len(sel)
        out.append(row)
    # DPE de Grenoble : chauffage collectif
    n, coll = 0, 0
    with gzip.open(os.path.join(os.path.dirname(os.path.dirname(ICI)), 'loyers-energie', 'donnees', 'dpe_grenoble.csv.gz'), 'rb') as f:
        for r in csv.DictReader(io.TextIOWrapper(f, encoding='utf-8')):
            if r['type_batiment'] != 'appartement':
                continue
            n += 1
            coll += r['type_installation_chauffage'] == 'collectif'
    with open(os.path.join(ICI, 'grenoble.csv'), 'w', encoding='utf-8', newline='') as f:
        f.write(f'# DVF 2024 (DGFiP/Etalab), ventes d\'un seul logement ; part des DPE d\'appartements à chauffage collectif à Grenoble : '
                f'{coll / n:.3f} sur {n} DPE (ADEME 2026) ; généré par donnees/preparer_grenoble.py\n')
        w = csv.DictWriter(f, fieldnames=list(out[0].keys()))
        w.writeheader()
        w.writerows(out)
    for r in out:
        print(r)
    print('chauffage collectif', coll / n)


if __name__ == '__main__':
    main()
