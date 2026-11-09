# -*- coding: utf-8 -*-
"""Génère la constante NET_ACTUEL de variante_seuil_0511.js (OpenFisca-France, barème 2026, zone 2) : traduction d'un salaire NET mensuel
d'aujourd'hui en salaire brut, en coût employeur (super-brut, allègements déduits) et en revenu disponible actuel d'un salarié seul.
Usage (depuis modeles/systeme-ideal/, avec le venv OpenFisca ; python -I) : python -I generer_variante_seuil_0511.py
Même convention que generer_cas_types_0511i.py : salarié du privé, non cadre, temps plein, seul, locataire zone 2 (loyer 500 €), né en 1990.
« Net » = salaire_net d'OpenFisca : salaire après cotisations salariales, CSG et CRDS, AVANT impôt sur le revenu (le « net avant prélèvement à la source »
de la fiche de paie). Le net après impôt est aussi sorti (salaire_net − IR mensuel).
Méthode : bisection sur le salaire de base (brut) jusqu'à un écart de brut < 0,005 € ; coût hors allègements et allègement général sortis aussi ;
taux marginal effectif actuel local entre le brut trouvé et 1,01 × ce brut. Sortie : JSON (€ par mois). Durée : ≈ 3 min."""
import sys, json, importlib.util
sys.argv = ['x', '2026', '/dev/null']
spec = importlib.util.spec_from_file_location('tm', '../../outils/droit/openfisca/taux_marginaux.py')
tm = importlib.util.module_from_spec(spec); spec.loader.exec_module(tm)
from openfisca_core.simulation_builder import SimulationBuilder
import numpy as np
tbs, ANNEE = tm.tbs, 2026


def run(brut, cadre=False):
    ind = tm.travail("1990-06-15", salaire_fixe=brut)
    c = tm.cas_menage("x", {"p1": ind}, ["p1"], [], "locataire_vide", "zone_2")
    ent = {"individus": c["individus"], "familles": c["familles"], "foyers_fiscaux": c["foyers"], "menages": {"m": c["menage"]}}
    sim = SimulationBuilder().build_from_entities(tbs, ent); per = str(ANNEE)
    o = {'ppa': float(sim.calculate_add('ppa_nette_crds', per)[0]) / 12}
    for v in ['salaire_de_base', 'salaire_super_brut', 'salaire_net']:
        o[v] = float(np.sum(sim.calculate_add(v, per))) / 12
    o['irpp'] = float(sim.calculate('irpp_economique', per)[0]) / 12
    o['revenu_disponible'] = float(sim.calculate('revenu_disponible', per)[0]) / 12
    o['net_apres_ir'] = o['salaire_net'] + o['irpp']   # irpp_economique est négatif
    for v in ['salaire_super_brut_hors_allegements', 'allegement_general']:
        o[v] = abs(float(np.sum(sim.calculate_add(v, per)))) / 12
    return o


def pour_net(cible):
    lo, hi = cible, 2.0 * cible
    for _ in range(40):
        m = (lo + hi) / 2
        if run(m)['salaire_net'] < cible: lo = m
        else: hi = m
        if hi - lo < 0.005: break
    r = run(hi); r['cible_net'] = cible
    r1 = run(1.01 * hi)   # point voisin (+1 % de brut) : taux marginal effectif actuel local = 1 − Δ revenu disponible / Δ coût employeur
    r['tme_local'] = 1 - (r1['revenu_disponible'] - r['revenu_disponible']) / (r1['salaire_super_brut'] - r['salaire_super_brut'])
    return r


R = {str(n): pour_net(float(n)) for n in (1477.93, 1500, 1750, 2000, 2500, 3000)}
print(json.dumps(R, indent=1, ensure_ascii=False))
