# -*- coding: utf-8 -*-
"""Génère S.dRdOF de cas_types_nets_0611.js (OpenFisca-France, barème 2026, zone 2) : effet de la complémentaire santé collective obligatoire (droit actuel) sur le revenu disponible
et le coût employeur des huit cas types de base_0611.js. Usage (depuis modeles/systeme-ideal/, avec le venv OpenFisca ; python -I) :
  python -I generer_cas_types_nets_0611.py ../../outils/droit/openfisca/taux_marginaux.py <prime adulte €/mois> <part employeur> <coef enfant>
Scénarios utilisés le 06/11/2026 : 74 0.60 0.4 (bas) ; 84.36 0.55 0.4 (central) ; 88.8 0.50 0.4 (haut). Sortie : JSON (€ par mois).
Limite constatée : OpenFisca déduit la part salariale du salaire imposable mais n'y ajoute pas la part employeur (imposable depuis les revenus 2013) : corrigé dans le module JS (HN8)."""
import sys, json, importlib.util
TM, PRIME, PE, KENF = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
sys.argv = ['x', '2026', '/dev/null']
spec = importlib.util.spec_from_file_location('tm', TM); tm = importlib.util.module_from_spec(spec); spec.loader.exec_module(tm)
from openfisca_core.simulation_builder import SimulationBuilder
import numpy as np
tbs, AN, SM, MED = tm.tbs, 2026, 1867.02, 2735.0
def m(sim, v): return float(np.sum(sim.calculate_add(v, str(AN)))) / 12
def run(c):
    ent = {"individus": c["individus"], "familles": c["familles"], "foyers_fiscaux": c["foyers"], "menages": {"m": c["menage"]}}
    sim = SimulationBuilder().build_from_entities(tbs, ent); per = str(AN)
    o = {'ppa': float(sim.calculate_add('ppa_nette_crds', per)[0]) / 12}
    for v in ['salaire_super_brut', 'salaire_net', 'complementaire_sante_employeur', 'complementaire_sante_salarie', 'forfait_social']:
        try: o[v] = m(sim, v)
        except Exception as e: o[v] = str(e)[:80]
    o['irpp'] = float(sim.calculate('irpp_economique', per)[0]) / 12
    o['rd'] = float(sim.calculate('revenu_disponible', per)[0]) / 12
    return o
def trav(naiss, brut, montant):
    kw = {}
    if montant:
        kw = dict(complementaire_sante_montant=tm.par_an(montant * 12), complementaire_sante_part_employeur=tm.par_an(PE))
    return tm.travail(naiss, salaire_fixe=brut, **kw)
def menage(salaires, nenf, naiss, avec):
    ind, parents, ids = {}, [], []
    for k, s in enumerate(salaires):
        mt = (PRIME * (1 + (KENF * nenf if k == 0 else 0))) if avec else 0
        ind[f"p{k+1}"] = trav(naiss[k], s, mt); parents.append(f"p{k+1}")
    for k, (nais, scol) in enumerate(tm.ENFANTS.get(nenf, [])):
        ind[f"e{k+1}"] = tm.enfant(nais, scol); ids.append(f"e{k+1}")
    return tm.cas_menage("x", ind, parents, ids, "locataire_vide", "zone_2")
CAS = {'smic_seul': ([SM], 0, ["1990-06-15"]), 'parent_isole_smic': ([SM], 2, ["1985-09-01"]),
       'couple_2smic_0enf': ([SM, SM], 0, ["1985-09-01", "1986-02-02"]), 'couple_2smic_2enf': ([SM, SM], 2, ["1985-09-01", "1986-02-02"]),
       'couple_median_2enf': ([MED, MED], 2, ["1985-09-01", "1986-02-02"]),
       'cadre_5000': ([5000.0], 0, ["1980-03-01"]), 'cadre_10000': ([10000.0], 0, ["1980-03-01"]), 'cadre_20000': ([20000.0], 0, ["1980-03-01"])}
out = {}
for id_, (s, n, nai) in CAS.items():
    a, b = run(menage(s, n, nai, False)), run(menage(s, n, nai, True))
    out[id_] = {'sans': a, 'avec': b, 'd_rd': b['rd'] - a['rd'], 'd_superBrut': b['salaire_super_brut'] - a['salaire_super_brut']}
print(json.dumps({'prime': PRIME, 'pe': PE, 'kenf': KENF, 'cas': out}, indent=1, ensure_ascii=False))
