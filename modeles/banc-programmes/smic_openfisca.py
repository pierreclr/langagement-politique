#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Smic à 1 700 € net : grille OpenFisca-France (176.1.10) des effets publics par foyer type et par salaire brut mensuel (impôt sur le revenu, prime d'activité, cotisations salariales,
cotisations patronales et allègement général du droit actuel). À lancer avec le Python du venv OpenFisca : <venv>/bin/python -I smic_openfisca.py -> une ligne JSON (écrite par ponts.py dans donnees/cache/smic_openfisca.json).
LIMITE : prime d'activité et IR sont calculés pour des foyers types (seul, parent isolé 1 enfant, couple à un apporteur avec 2 enfants, couple bi-actif de deux salaires identiques) ;
les aides au logement (APL) et le RSA ne sont pas incluses (⚠️ À VÉRIFIER : l'effet sur l'APL va dans le même sens, une perte, donc le solde public est ici légèrement sous-estimé).
Année de calcul : 2025 (barème et Smic de 2025 de OpenFisca ; le Smic de 2025 est de 1 801,80 € brut, 1 426,30 € net ; on raisonne en ratios).
"""
import json, sys
import numpy as np
from openfisca_core.simulation_builder import SimulationBuilder
from openfisca_france import FranceTaxBenefitSystem

AN = 2025
SALAIRES = [1802 + 100 * i for i in range(0, 17)]       # brut mensuel, du Smic de 2025 (1 802) à 3 400 €
TYPES = {'seul': (1, 0), 'isole1': (1, 1), 'couple1_2enf': (1, 2), 'couple2': (2, 0)}
VARS = ['irpp', 'ppa', 'cotisations_salariales', 'cotisations_employeur', 'allegement_general', 'csg_deductible_salaire', 'csg_imposable_salaire', 'crds_salaire', 'salaire_net']


def entites(types_salaires):
    ind, fam, foy, men = {}, {}, {}, {}
    anns = [str(AN - 2), str(AN - 1), str(AN)]
    for i, (typ, w) in enumerate(types_salaires):
        nad, nen = TYPES[typ]
        pers, enf = [], []
        for k in range(nad):
            pid = 'a%d_%d' % (i, k)
            brut = w * 12 if (typ != 'couple1_2enf' or k == 0) else 0.0
            d = {'date_naissance': {'1900-01-01': '1985-06-15'}, 'activite': {a: 'actif' for a in anns}, 'categorie_salarie': {a: 'prive_non_cadre' for a in anns},
                 'contrat_de_travail': {a: 'temps_plein' for a in anns}, 'salaire_de_base': {a: brut for a in anns}}
            if brut == 0.0:
                d['activite'] = {a: 'inactif' for a in anns}
                d.pop('categorie_salarie'); d.pop('contrat_de_travail')
            ind[pid] = d
            pers.append(pid)
        for k in range(nen):
            cid = 'e%d_%d' % (i, k)
            ind[cid] = {'date_naissance': {'1900-01-01': '2016-04-20'}, 'activite': {str(AN): 'etudiant'}, 'scolarite': {str(AN): 'college'}}
            enf.append(cid)
        fam['f%d' % i] = {'parents': pers, **({'enfants': enf} if enf else {})}
        foy['ff%d' % i] = {'declarants': pers, **({'personnes_a_charge': enf} if enf else {})}
        men['m%d' % i] = {'personne_de_reference': [pers[0]], **({'conjoint': [pers[1]]} if len(pers) > 1 else {}), **({'enfants': enf} if enf else {})}
    return {'individus': ind, 'familles': fam, 'foyers_fiscaux': foy, 'menages': men}


def main():
    tbs = FranceTaxBenefitSystem()
    liste = [(t, w) for t in TYPES for w in SALAIRES]
    sim = SimulationBuilder().build_from_entities(tbs, entites(liste))
    out = {}
    for t in TYPES:
        out[t] = {'salaires': SALAIRES}
    def lire(nom, entite_individu, i):
        # les variables individuelles : somme des adultes de chaque foyer ; mensuelles (prime, cotisations) : somme sur l'année
        pass
    res = {v: None for v in VARS}
    # impôts et prime : par foyer / famille ; cotisations : par individu (somme des adultes du foyer)
    irpp = -np.asarray(sim.calculate('impot_revenu_restant_a_payer', str(AN)), dtype=float)
    prime = np.asarray(sim.calculate_add('ppa', str(AN)), dtype=float)
    # individus : adultes d'abord dans l'ordre de création ; on reconstruit l'index par foyer
    ind_ids = list(entites(liste)['individus'].keys())
    def somme_adultes(nom):
        arr = np.asarray(sim.calculate_add(nom, str(AN)), dtype=float)
        par = np.zeros(len(liste))
        for idx, pid in enumerate(ind_ids):
            if pid.startswith('a'):
                par[int(pid[1:].split('_')[0])] += arr[idx]
        return par
    resv = {}
    for nom in ('cotisations_salariales', 'cotisations_employeur', 'allegement_general', 'csg_deductible_salaire', 'csg_imposable_salaire', 'crds_salaire', 'salaire_net'):
        try:
            resv[nom] = somme_adultes(nom)
        except Exception as e:
            resv[nom] = None
            print('variable absente', nom, str(e)[:80], file=sys.stderr)
    for j, (t, w) in enumerate(liste):
        d = out[t]
        d.setdefault('irpp', []).append(float(irpp[j]))
        d.setdefault('ppa', []).append(float(prime[j]))
        for nom, arr in resv.items():
            d.setdefault(nom, []).append(None if arr is None else float(arr[j]))
    print(json.dumps({'annee': AN, 'grille': out}))


if __name__ == '__main__':
    main()
