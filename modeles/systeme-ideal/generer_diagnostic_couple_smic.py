# -*- coding: utf-8 -*-
"""Génère les constantes OF et OF_GRILLE_COUPLE de diagnostic_couple_smic.js (OpenFisca-France 176.1.10, barème 2026, zone 2).
Usage (depuis le venv OpenFisca, hors du dossier de travail ; python -I) : python -I generer_diagnostic_couple_smic.py
Importe les cas de outils/droit/openfisca/taux_marginaux.py. La prime d'activité est lue EN PREMIER sur une simulation neuve (ordre d'évaluation : V13350).
Cas : salarié seul au Smic ; couple sans enfant et couple avec 2 enfants à deux Smic (1 867,02 € brut chacun) ; couple Smic + 1,5 Smic ; grille : 2 enfants, premier adulte au Smic, second à 0 / 0,25 / 0,5 / 0,75 / 1 / 1,5 Smic.
Sortie : JSON sur la sortie standard (€ par mois). Les valeurs recopiées dans diagnostic_couple_smic.js sont arrondies au centime."""
import sys, json, importlib.util
sys.argv = ['x', '2026', '/dev/null']
spec = importlib.util.spec_from_file_location('tm', '../../outils/droit/openfisca/taux_marginaux.py')
tm = importlib.util.module_from_spec(spec); spec.loader.exec_module(tm)
from openfisca_core.simulation_builder import SimulationBuilder
import numpy as np
tbs, ANNEE, SM = tm.tbs, 2026, 1867.02

def cas(nenf, salaires, loyer):
    ind, parents, ids = {}, [], []
    for k, s in enumerate(salaires):
        ind[f"p{k+1}"] = tm.travail("1985-09-01" if k == 0 else "1986-02-02", salaire_fixe=s); parents.append(f"p{k+1}")
    for k, (nais, scol) in enumerate(tm.ENFANTS.get(nenf, [])):
        ind[f"e{k+1}"] = tm.enfant(nais, scol); ids.append(f"e{k+1}")
    c = tm.cas_menage("x", ind, parents, ids, "locataire_vide", "zone_2")
    for a in (ANNEE - 1, ANNEE):
        for m in range(1, 13): c['menage']['loyer'][f"{a}-{m:02d}"] = loyer
    return c

def mensuel(sim, v, cumul=True):
    per = str(ANNEE)
    return float(np.sum(sim.calculate_add(v, per))) / 12

def run(c):
    ent = {"individus": c["individus"], "familles": c["familles"], "foyers_fiscaux": c["foyers"], "menages": {"m": c["menage"]}}
    sim = SimulationBuilder().build_from_entities(tbs, ent); per = str(ANNEE)
    o = {'ppa': float(sim.calculate_add('ppa_nette_crds', per)[0]) / 12}          # prime d'activité lue en premier
    for v in ['salaire_de_base', 'salaire_super_brut', 'salaire_net', 'cotisations_salariales', 'csg_deductible_salaire', 'csg_imposable_salaire', 'crds_salaire', 'allegement_general']:
        o[v] = mensuel(sim, v)
    for v in ['af_nettes_crds', 'cf_net_crds', 'ars_nette_crds', 'aide_logement']:
        o[v] = float(sim.calculate_add(v, per)[0]) / 12
    o['irpp'] = float(sim.calculate('irpp_economique', per)[0]) / 12
    o['revenu_disponible'] = float(sim.calculate('revenu_disponible', per)[0]) / 12
    return o

R = {'couple_2smic_2enf': run(cas(2, [SM, SM], 750)), 'couple_2smic_0enf': run(cas(0, [SM, SM], 600)), 'couple_smic_15_2enf': run(cas(2, [SM, 1.5 * SM], 750)),
     'couple_atlas_2enf_conjoint_1823': run(cas(2, [SM, 1823.07], 750)),
     'smic_seul': run(tm.cas_menage("x", {"p1": tm.travail("1990-06-15", salaire_fixe=SM)}, ["p1"], [], "locataire_vide", "zone_2"))}
R['grille_couple_2enf_p1_smic'] = {str(p2): run(cas(2, [SM, p2], 750)) for p2 in [0, 466.76, 933.51, 1400.27, 1867.02, 2800.53]}
print(json.dumps(R, indent=1, ensure_ascii=False))
