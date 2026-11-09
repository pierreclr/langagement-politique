#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Agrégats DVF pour patrimoine_immobilier.js (T56, 02/11/2026).
Entrées : fichiers DVF géolocalisés de data.gouv.fr (Licence Ouverte 2.0) dans $DONNEES/sources/dvf/.
Sorties : dvf_patrimoine.js (constantes embarquées) et resultats-dvf-patrimoine.txt (lisible).
Lancer : python3 -I generer_dvf_patrimoine.py <dossier_dvf> <dossier_sortie>
Méthode (voir methode.md § 23) :
 1. Ventes de logement ancien, France 2024 (hors Alsace-Moselle et Mayotte, absents de DVF) : mutations de nature « Vente »
    (la VEFA est une nature distincte, exclue) contenant au moins un local « Appartement » ou « Maison », sans local commercial ;
    valeur foncière lue une fois par mutation ; seuil de 15 000 € (CGI 150 U II 6°) et 1 M€ de plafond d'aberration non appliqué.
 2. Dispersion des rendements individuels : reventes du MÊME bien (même parcelle, même type, même surface, même lot) dans l'Isère
    2021-2025 ; rendement réel = prix de revente / prix d'achat / rapport IPC.
"""
import csv, gzip, io, json, math, os, sys, statistics
from collections import defaultdict
from datetime import date

IPC = {2019: 104.23, 2020: 104.73, 2021: 106.45, 2022: 112.01, 2023: 117.47, 2024: 119.82, 2025: 120.95}

def lire(chemin):
    with gzip.open(chemin, 'rt', encoding='utf-8', newline='') as f:
        yield from csv.DictReader(f)

def mutations(chemin):
    """Regroupe les lignes par id_mutation."""
    cur, rows = None, []
    for r in lire(chemin):
        if r['id_mutation'] != cur:
            if rows: yield rows
            cur, rows = r['id_mutation'], []
        rows.append(r)
    if rows: yield rows

def flt(x):
    try: return float(x)
    except (TypeError, ValueError): return None

def logement(rows):
    """Renvoie (valeur, nb_apt, nb_mai, date, principal) si mutation de logement ancien éligible, sinon None."""
    r0 = rows[0]
    if r0['nature_mutation'] != 'Vente': return None
    v = flt(r0['valeur_fonciere'])
    if not v or v < 15000: return None
    types = [r['type_local'] for r in rows]
    if any(t.startswith('Local industriel') for t in types): return None
    loc = [r for r in rows if r['type_local'] in ('Appartement', 'Maison')]
    if not loc: return None
    na = sum(1 for r in loc if r['type_local'] == 'Appartement'); nm = len(loc) - na
    return v, na, nm, r0['date_mutation'], loc

def agregat_france(chemin):
    N = V = 0.0; par = defaultdict(lambda: [0, 0.0]); bandes = defaultdict(lambda: [0, 0.0])
    depts = defaultdict(lambda: [0, 0.0])
    bornes = [(0, 100e3), (100e3, 200e3), (200e3, 300e3), (300e3, 500e3), (500e3, 1e12)]
    for rows in mutations(chemin):
        m = logement(rows)
        if not m: continue
        v, na, nm, d, loc = m
        t = 'appartement' if nm == 0 else ('maison' if na == 0 else 'mixte')
        par[t][0] += 1; par[t][1] += v
        N += 1; V += v
        for i, (a, b) in enumerate(bornes):
            if a <= v < b: bandes[i][0] += 1; bandes[i][1] += v
        depts[rows[0]['code_departement']][0] += 1; depts[rows[0]['code_departement']][1] += v
    return N, V, par, bandes, bornes, depts

def reventes(chemins):
    """Appariement des reventes dans le même fichier multi-années (Isère)."""
    ventes = defaultdict(list)
    n_mut = 0
    for ch in chemins:
        for rows in mutations(ch):
            m = logement(rows)
            if not m: continue
            v, na, nm, d, loc = m
            if len(loc) != 1: continue          # un seul local principal : prix attribuable sans ambiguïté
            r = loc[0]; s = flt(r['surface_reelle_bati'])
            if not s or s < 9: continue
            pm2 = v / s
            if pm2 < 500 or pm2 > 12000: continue
            cle = (r['code_commune'], r['id_parcelle'], r['type_local'], round(s), r['nombre_pieces_principales'], r['lot1_numero'])
            y, mo, jo = (int(x) for x in d.split('-'))
            ventes[cle].append((date(y, mo, jo), v))
            n_mut += 1
    paires = []
    for cle, L in ventes.items():
        L.sort()
        for (d0, v0), (d1, v1) in zip(L, L[1:]):
            dur = (d1 - d0).days / 365.25
            if dur < 0.25: continue                # exclut les double-enregistrements
            ipc = IPC[d1.year] / IPC[d0.year]
            paires.append((dur, math.log(v1 / v0 / ipc), v0, v1))
    return n_mut, len(ventes), paires

def main(dvf, sortie):
    N, V, par, bandes, bornes, depts = agregat_france(os.path.join(dvf, 'dvf_2024_france.csv.gz'))
    isere = [os.path.join(dvf, f'dvf_{y}_38.csv.gz') for y in range(2021, 2026)]
    # Part de l'Isère dans le national 2024
    N38, V38 = depts['38']
    n_mut, n_biens, paires = reventes(isere)
    # Dispersion : variance des résidus par année de détention, sigma^2 = sum(resid^2) / sum(d), avec dérive estimée par moindres carrés sans constante
    sd = sum(d for d, *_ in paires); mu = sum(d * x for d, x, *_ in paires) / sd
    sig2 = sum((x - mu * d) ** 2 for d, x, *_ in paires) / sd
    # robuste : écart absolu médian (MAD) des rendements annualisés pondérés
    res = sorted(abs(x - mu * d) / math.sqrt(d) for d, x, *_ in paires)
    mad = statistics.median(res) * 1.4826
    # part des reventes à perte réelle, selon la durée
    perte = defaultdict(lambda: [0, 0])
    for d, x, *_ in paires:
        k = int(d); perte[k][1] += 1; perte[k][0] += (x < 0)
    # dispersion par tranche de durée : médiane et écart-type robuste (IQR / 1,349) du log du rendement réel
    disp = []
    for lo, hi in [(0.25, 1), (1, 2), (2, 3), (3, 4), (4, 5)]:
        q = sorted(x for d, x, *_ in paires if lo <= d < hi); k = len(q)
        disp.append({'de': lo, 'a': hi, 'n': k, 'mediane': q[k // 2], 'sigmaIQR': (q[int(.75 * k)] - q[int(.25 * k)]) / 1.349})
    out = {
        'france2024': {'n': int(N), 'valeurMdEur': V / 1e9, 'prixMoyen': V / N,
                       'appartement': {'n': par['appartement'][0], 'valeurMdEur': par['appartement'][1] / 1e9},
                       'maison': {'n': par['maison'][0], 'valeurMdEur': par['maison'][1] / 1e9},
                       'mixte': {'n': par['mixte'][0], 'valeurMdEur': par['mixte'][1] / 1e9},
                       'bandes': [{'de': bornes[i][0], 'a': min(bornes[i][1], 1e9), 'n': bandes[i][0], 'valeurMdEur': bandes[i][1] / 1e9} for i in range(5)]},
        'isere2024': {'n': N38, 'valeurMdEur': V38 / 1e9, 'partNational': N38 / N},
        'reventesIsere2021_2025': {'mutationsRetenues': n_mut, 'biensDistincts': n_biens, 'paires': len(paires),
                                   'dureeMoyenne': sd / len(paires), 'deriveReelleAnnuelle': mu, 'sigmaAnnuel': math.sqrt(sig2), 'sigmaMAD': mad,
                                   'partPerteReelle': sum(1 for p in paires if p[1] < 0) / len(paires),
                                   'perteParDuree': {str(k): v for k, v in sorted(perte.items())}, 'dispersionParDuree': disp},
    }
    with open(os.path.join(sortie, 'dvf_patrimoine.js'), 'w', encoding='utf-8') as f:
        f.write('// Généré par generer_dvf_patrimoine.py le 02/11/2026 à partir de DVF (data.gouv.fr, Licence Ouverte 2.0). Ne pas éditer à la main.\n')
        f.write('(function (root) {\n  var D = ' + json.dumps(out, ensure_ascii=False, indent=2) + ';\n')
        f.write("  if (typeof module !== 'undefined' && module.exports) module.exports = D; else root.DvfPatrimoine = D;\n})(this);\n")
    with open(os.path.join(sortie, 'resultats-dvf-patrimoine.txt'), 'w', encoding='utf-8') as f:
        f.write(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(out, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
