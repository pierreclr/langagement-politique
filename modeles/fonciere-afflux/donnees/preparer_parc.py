#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrait du fichier SDES/ONRE « Le parc de logements par classe de performance énergétique au 1er janvier 2025 »
(donnees/brutes/dpe-parc/onre-parc-dpe-2025-donnees.xlsx, Tableau 2) le parc locatif privé par classe DPE selon le type, la surface,
la période de construction et la zone, et écrit donnees/parc_dpe_surface.csv (milliers de logements, résidences principales, France métropolitaine).

Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Python de base : le XLSX est lu comme une archive zip (XML).
Usage : python3 -I modeles/fonciere-afflux/donnees/preparer_parc.py [--montrer]
"""
import csv, os, re, sys, zipfile

ICI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ICI, 'brutes', 'dpe-parc', 'onre-parc-dpe-2025-donnees.xlsx')
NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'


def lire_feuille(chemin, n):
    import xml.etree.ElementTree as ET
    z = zipfile.ZipFile(chemin)
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).iter(NS + 'si'):
            ss.append(''.join(t.text or '' for t in si.iter(NS + 't')))
    rows = []
    for row in ET.fromstring(z.read(f'xl/worksheets/sheet{n}.xml')).iter(NS + 'row'):
        cells = {}
        for c in row.iter(NS + 'c'):
            ref = c.get('r')
            col = re.match(r'[A-Z]+', ref).group(0)
            v = c.find(NS + 'v')
            if v is None:
                is_ = c.find(NS + 'is')
                val = ''.join(t.text or '' for t in is_.iter(NS + 't')) if is_ is not None else ''
            elif c.get('t') == 's':
                val = ss[int(v.text)]
            else:
                val = v.text
            cells[col] = val
        rows.append(cells)
    return rows


def main():
    rows = lire_feuille(SRC, 2)
    if '--montrer' in sys.argv:
        for r in rows[:60]:
            print(r)
        return
    # lignes libellées en colonne A avec des effectifs en B (A) à H (G) ; une ligne libellée sans effectifs ouvre une
    # rubrique (« Type de logement », « Tranche de surface », ...) ; les lignes sans libellé (parts) sont ignorées
    out, rubrique = [], ''
    cols = dict(zip('ABCDEFG', 'BCDEFGH'))
    for r in rows[3:]:
        lib = (r.get('A') or '').strip()
        if not lib:
            continue
        try:
            eff = {c: float(r[col]) for c, col in cols.items()}
        except (KeyError, ValueError):
            rubrique = lib
            continue
        out.append((rubrique or 'Ensemble', lib, eff))
    with open(os.path.join(ICI, 'parc_dpe_surface.csv'), 'w', encoding='utf-8', newline='') as f:
        f.write('# SDES/ONRE, parc de logements par classe DPE au 01/01/2025 (Tableau 2), résidences principales, '
                'France métropolitaine ; unité : celle du fichier source ; généré par donnees/preparer_parc.py\n')
        w = csv.writer(f)
        w.writerow(['rubrique', 'modalite'] + list('ABCDEFG'))
        for st, s, eff in out:  # milliers de logements du parc locatif privé
            w.writerow([st, s] + [eff[c] for c in 'ABCDEFG'])
    print(len(out), 'lignes')


if __name__ == '__main__':
    main()
