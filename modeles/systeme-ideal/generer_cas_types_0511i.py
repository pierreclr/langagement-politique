# -*- coding: utf-8 -*-
"""Génère la constante OF_CAS de decisions_0511i.js (OpenFisca-France, barème 2026, zone 2) : droit actuel des cas types du chantier A de la v5.9.
Usage (depuis modeles/systeme-ideal/, avec le venv OpenFisca ; python -I) : python -I generer_cas_types_0511i.py
Même méthode que generer_diagnostic_couple_smic.py (prime d'activité lue EN PREMIER sur une simulation neuve, V13350) ; loyers : convention de taux_marginaux.py (loyer_pour) sauf mention.
Cas : parent isolé, 2 enfants, au Smic ; couple médian (2 enfants, deux salaires bruts de 2 735 €, net ≈ médian) ; cadres seuls à 5 000, 10 000 et 20 000 € brut par mois ;
célibataire au Smic (contrôle : doit redonner 1 706,30 €) ; grille du célibataire autour du Smic (1,0 / 1,1 Smic) pour le taux marginal effectif.
Sortie : JSON (€ par mois)."""
import sys, json, importlib.util
sys.argv = ['x', '2026', '/dev/null']
spec = importlib.util.spec_from_file_location('tm', '../../outils/droit/openfisca/taux_marginaux.py')
tm = importlib.util.module_from_spec(spec); spec.loader.exec_module(tm)
from openfisca_core.simulation_builder import SimulationBuilder
import numpy as np
tbs, ANNEE, SM, MED = tm.tbs, 2026, 1867.02, 2735.0

def mensuel(sim, v):
    return float(np.sum(sim.calculate_add(v, str(ANNEE)))) / 12

def run(c):
    ent = {"individus": c["individus"], "familles": c["familles"], "foyers_fiscaux": c["foyers"], "menages": {"m": c["menage"]}}
    sim = SimulationBuilder().build_from_entities(tbs, ent); per = str(ANNEE)
    o = {'ppa': float(sim.calculate_add('ppa_nette_crds', per)[0]) / 12}
    for v in ['salaire_de_base', 'salaire_super_brut', 'salaire_net']:
        o[v] = mensuel(sim, v)
    for v in ['af_nettes_crds', 'cf_net_crds', 'ars_nette_crds', 'asf', 'aide_logement']:
        try: o[v] = float(sim.calculate_add(v, per)[0]) / 12
        except Exception as e: o[v] = None
    o['irpp'] = float(sim.calculate('irpp_economique', per)[0]) / 12
    o['revenu_disponible'] = float(sim.calculate('revenu_disponible', per)[0]) / 12
    return o

def seul(brut, naiss="1990-06-15"):
    return tm.cas_menage("x", {"p1": tm.travail(naiss, salaire_fixe=brut)}, ["p1"], [], "locataire_vide", "zone_2")

def famille(salaires, nenf):
    ind, parents, ids = {}, [], []
    for k, s in enumerate(salaires):
        ind[f"p{k+1}"] = tm.travail("1985-09-01" if k == 0 else "1986-02-02", salaire_fixe=s); parents.append(f"p{k+1}")
    for k, (nais, scol) in enumerate(tm.ENFANTS.get(nenf, [])):
        ind[f"e{k+1}"] = tm.enfant(nais, scol); ids.append(f"e{k+1}")
    return tm.cas_menage("x", ind, parents, ids, "locataire_vide", "zone_2")

R = {'smic_seul': run(seul(SM)), 'smic_seul_1_1': run(seul(1.1 * SM)),
     'parent_isole_smic_2enf': run(famille([SM], 2)),
     'couple_median_2enf': run(famille([MED, MED], 2)),
     'cadre_5000': run(seul(5000.0, "1980-03-01")), 'cadre_10000': run(seul(10000.0, "1980-03-01")), 'cadre_20000': run(seul(20000.0, "1980-03-01"))}
print(json.dumps(R, indent=1, ensure_ascii=False))
