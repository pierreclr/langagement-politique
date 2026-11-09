#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
modeles/gagnants-perdants/donnees/generer_droit_actuel.py — recalage du 03/11/2026 (droit actuel dans la situation de référence).

Extrait de l'atlas OpenFisca-France 2026 (outils/droit/openfisca/taux_marginaux.py ; sortie dans
langagement-donnees/resultats/droit/openfisca/atlas/atlas_taux_marginaux.csv, openfisca-france 176.1.10, barème 2026,
Smic 1 823,07 € brut au 1/1/2026) les courbes « revenu disponible actuel selon le salaire brut » de six cas types en zone 2 :
célibataire locataire, couple biactif (le conjoint à 1 Smic) et couple monoactif avec 2 enfants, parent isolé avec 2 enfants,
retraité au minimum vieillesse. Colonnes gardées : RSA, prime d'activité (nette de CRDS), aide au logement, prestations
familiales, salaire net, revenu disponible étendu. Écrit donnees/droit_actuel_atlas_2026_zone2.csv et ../droit_actuel.js.
Usage : python3 -I generer_droit_actuel.py CHEMIN_DE_L_ATLAS.csv
"""
import csv, json, os, sys
ICI = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1]
CAS = ['celib_locataire_z2', 'couple_biactif_2_z2', 'couple_monoactif_2_z2', 'isole_2_z2', 'retraite_aspa_z2']
rows = [r for r in csv.DictReader(open(src, encoding='utf-8')) if r['cas'] in CAS]
cols = ['rsa', 'ppa_nette_crds', 'aide_logement', 'prest_familiales', 'salaire_net', 'revenu_disponible_etendu']
out = {}
with open(os.path.join(ICI, 'droit_actuel_atlas_2026_zone2.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f); w.writerow(['cas', 'libelle', 'loyer', 'brut_mensuel'] + cols)
    for r in rows:
        w.writerow([r['cas'], r['libelle'], r['loyer'], r['brut_mensuel']] + [round(float(r[c]), 2) for c in cols])
        o = out.setdefault(r['cas'], {'libelle': r['libelle'], 'loyer': float(r['loyer']), 'brut': []})
        o['brut'].append([float(r['brut_mensuel'])] + [round(float(r[c]), 2) for c in cols])
meta = {'source': 'OpenFisca-France 176.1.10, barème 2026, atlas du 03/11/2026 (outils/droit/openfisca/taux_marginaux.py)', 'smicBrut': float(rows[0]['smic_mensuel_brut']), 'colonnes': ['brut_mensuel'] + cols}
with open(os.path.join(ICI, '..', 'droit_actuel.js'), 'w', encoding='utf-8') as f:
    f.write('// Généré par donnees/generer_droit_actuel.py le 2026-11-03 : ne pas modifier à la main.\n')
    f.write('// Droit actuel (OpenFisca-France 2026, zone 2) : revenu disponible selon le salaire brut mensuel ; colonnes : ' + ', '.join(meta['colonnes']) + '.\n')
    f.write('var DROIT_ACTUEL = ' + json.dumps({'meta': meta, 'cas': out}, ensure_ascii=False) + ';\n')
    f.write("if (typeof module !== 'undefined' && module.exports) module.exports = DROIT_ACTUEL;\n")
print(len(rows), 'lignes')
