#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prépare la répartition des DPE par classe et par surface dans cinq zones (fonciere-afflux, H-FA30 à H-FA33).

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026.
Lit, sans les modifier, les extraits de la base DPE de l'ADEME déjà téléchargés par modeles/loyers-energie/
(donnees/dpe_*.csv.gz : Paris, Lyon, Grenoble, Angers, Creuse ; DPE de 2025-2026 ; ventes et locations confondues).
Écrit donnees/dpe_classe_surface.csv : nombre de DPE et surface moyenne par zone, type de bâtiment, tranche de surface
et classe. Ce sont des FLUX de diagnostics (ventes et mises en location), pas le parc (limite rappelée dans methode.md).
Usage : python3 -I modeles/fonciere-afflux/donnees/preparer_dpe.py
"""
import csv, gzip, io, os

ICI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(os.path.dirname(ICI)), 'loyers-energie', 'donnees')
ZONES = ('paris', 'lyon', 'grenoble', 'angers', 'creuse')
TRANCHES = ((0, 30, 'moins de 30 m²'), (30, 45, '30-45 m²'), (45, 70, '45-70 m²'), (70, 100, '70-100 m²'), (100, 1e9, '100 m² et plus'))


def tranche(s):
    for a, b, nom in TRANCHES:
        if a <= s < b:
            return nom
    return None


def lire(zone):
    with gzip.open(os.path.join(SRC, f'dpe_{zone}.csv.gz'), 'rb') as f:
        for r in csv.DictReader(io.TextIOWrapper(f, encoding='utf-8')):
            try:
                s = float(r['surface_habitable_logement'])
            except (TypeError, ValueError):
                continue
            c = (r['etiquette_dpe'] or '').strip()
            if c not in 'ABCDEFG' or not c or not (9 <= s <= 400):
                continue
            yield r['type_batiment'] or '?', tranche(s), c, s


def main():
    agg = {}
    for z in ZONES:
        for typ, tr, c, s in lire(z):
            k = (z, typ, tr, c)
            n, ss = agg.get(k, (0, 0.0))
            agg[k] = (n + 1, ss + s)
    sortie = os.path.join(ICI, 'dpe_classe_surface.csv')
    with open(sortie, 'w', encoding='utf-8', newline='') as f:
        f.write('# Base DPE ADEME (dpe03existant), extraits de modeles/loyers-energie/donnees (téléchargés le 08/11/2026) ; '
                'généré par donnees/preparer_dpe.py ; flux de DPE, pas le parc\n')
        w = csv.writer(f)
        w.writerow(['zone', 'type_batiment', 'tranche_surface', 'classe', 'n_dpe', 'surface_moyenne'])
        for (z, typ, tr, c), (n, ss) in sorted(agg.items()):
            w.writerow([z, typ, tr, c, n, round(ss / n, 1)])
    print('écrit', sortie, len(agg), 'lignes')


if __name__ == '__main__':
    main()
