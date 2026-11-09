# -*- coding: utf-8 -*-
"""Lecture minimale d'un XLSX avec la bibliothèque standard (sans openpyxl). Fonctions pures."""
import re
import zipfile
import xml.etree.ElementTree as ET

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def _col(ref):
    s = re.match(r'[A-Z]+', ref).group(0)
    n = 0
    for ch in s:
        n = n * 26 + ord(ch) - 64
    return n - 1


def lire_xlsx(chemin):
    """Retourne {nom_feuille: [liste de lignes (listes de valeurs)]}."""
    z = zipfile.ZipFile(chemin)
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS):
            ss.append(''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])))
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    cible = {r.get('Id'): r.get('Target') for r in rels}
    out = {}
    for sh in wb.find('m:sheets', NS):
        rid = sh.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
        t = cible[rid].lstrip('/')
        t = t if t.startswith('xl/') else 'xl/' + t
        rows = []
        for r in ET.fromstring(z.read(t)).iter('{%s}row' % NS['m']):
            ligne = []
            for c in r.findall('m:c', NS):
                i = _col(c.get('r'))
                while len(ligne) <= i:
                    ligne.append(None)
                v = c.find('m:v', NS)
                if v is None:
                    is_ = c.find('m:is', NS)
                    val = ''.join(t.text or '' for t in is_.iter('{%s}t' % NS['m'])) if is_ is not None else None
                elif c.get('t') == 's':
                    val = ss[int(v.text)]
                elif c.get('t') in ('str', 'inlineStr'):
                    val = v.text
                else:
                    try:
                        val = float(v.text)
                    except (TypeError, ValueError):
                        val = v.text
                ligne[i] = val
            rows.append(ligne)
        out[sh.get('name')] = rows
    return out
