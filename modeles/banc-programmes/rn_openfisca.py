#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Programme du Rassemblement national : impôt sur le revenu d'un salarié célibataire sans enfant par salaire brut mensuel (OpenFisca-France 176.1.10), pour chiffrer l'exonération d'IR des actifs de moins de 30 ans
jusqu'à 4 Smic (mesure du contre-budget du RN, 2,0 Md€). À lancer avec le Python du venv OpenFisca : <venv>/bin/python -I rn_openfisca.py -> une ligne JSON (écrite par ponts.py dans donnees/cache/rn_openfisca.json).
LIMITE : foyer type d'un salarié seul, sans autre revenu ni charge ; les jeunes rattachés au foyer de leurs parents ne sont pas modélisés (leur revenu est ajouté à l'IR des parents : l'effet est ignoré).
"""
import json
import numpy as np
from openfisca_core.simulation_builder import SimulationBuilder
from openfisca_france import FranceTaxBenefitSystem

AN = 2025
SALAIRES = [1802 + 150 * i for i in range(0, 37)]       # brut mensuel, de 1 Smic (1 802 €) à 4 Smic et plus (7 202 €)


def main():
    tbs = FranceTaxBenefitSystem()
    anns = [str(AN - 2), str(AN - 1), str(AN)]
    ind, foy, fam, men = {}, {}, {}, {}
    for i, w in enumerate(SALAIRES):
        pid = 'a%d' % i
        ind[pid] = {'date_naissance': {'1900-01-01': '1998-06-15'}, 'activite': {a: 'actif' for a in anns}, 'categorie_salarie': {a: 'prive_non_cadre' for a in anns},
                    'contrat_de_travail': {a: 'temps_plein' for a in anns}, 'salaire_de_base': {a: w * 12.0 for a in anns}}
        fam['f%d' % i] = {'parents': [pid]}
        foy['ff%d' % i] = {'declarants': [pid]}
        men['m%d' % i] = {'personne_de_reference': [pid]}
    sim = SimulationBuilder().build_from_entities(tbs, {'individus': ind, 'familles': fam, 'foyers_fiscaux': foy, 'menages': men})
    irpp = -np.asarray(sim.calculate('impot_revenu_restant_a_payer', str(AN)), dtype=float)
    print(json.dumps({'annee': AN, 'smic_brut_mensuel': 1802, 'salaires': SALAIRES, 'irpp_seul': [float(x) for x in irpp]}))


if __name__ == '__main__':
    main()
