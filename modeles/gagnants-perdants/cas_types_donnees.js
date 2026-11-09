// Généré par donnees/collecte.py le 2026-10-25 : ne pas modifier à la main.
// Revenu disponible ACTUEL des cas types (€ par mois, législation 2026) et entrées du système proposé.
var CAS_TYPES_DONNEES = [
 {
  "id": "sans_emploi_seul",
  "libelle": "Personne seule sans emploi (RSA)",
  "adultes": 1,
  "enfants": 0,
  "logement": "locataire",
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 572.35,
   "prime_activite": 0.0,
   "aides_logement": 304.84,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 877.19,
   "revenu_disponible_openfisca_brut": 889.89
  }
 },
 {
  "id": "temps_partiel",
  "libelle": "Salarié seul à mi-temps au Smic",
  "adultes": 1,
  "enfants": 0,
  "logement": "locataire",
  "salaires": [
   [
    933.51,
    17.5
   ]
  ],
  "couts_employeur": [
   1003.88
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 738.96,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 269.18,
   "aides_logement": 209.23,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 1217.38,
   "revenu_disponible_openfisca_brut": 1216.03
  }
 },
 {
  "id": "smic",
  "libelle": "Salarié seul au Smic à temps plein",
  "adultes": 1,
  "enfants": 0,
  "logement": "locataire",
  "salaires": [
   [
    1867.02
   ]
  ],
  "couts_employeur": [
   1987.76
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 1477.93,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 229.52,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 1707.45,
   "revenu_disponible_openfisca_brut": 1706.3
  }
 },
 {
  "id": "median",
  "libelle": "Salarié seul au salaire médian (1,5 Smic brut)",
  "adultes": 1,
  "enfants": 0,
  "logement": "locataire",
  "salaires": [
   [
    2800.5299999999997
   ]
  ],
  "couts_employeur": [
   3676.54
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 2216.89,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 101.0,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 2115.89,
   "revenu_disponible_openfisca_brut": 2115.89
  }
 },
 {
  "id": "cadre_2x",
  "libelle": "Cadre seul, 2 fois le médian (3 Smic brut)",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "salaires": [
   [
    5601.0599999999995
   ]
  ],
  "couts_employeur": [
   8034.02
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 4445.2,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 668.58,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 3776.62,
   "revenu_disponible_openfisca_brut": 3776.62
  }
 },
 {
  "id": "cadre_4x",
  "libelle": "Cadre seul, 4 fois le médian (6 Smic brut)",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "salaires": [
   [
    11202.119999999999
   ]
  ],
  "couts_employeur": [
   16044.43
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 8937.8,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 2065.92,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 6871.88,
   "revenu_disponible_openfisca_brut": 6871.88
  }
 },
 {
  "id": "tres_haut_salaire",
  "libelle": "Très haut salaire (30 000 € brut par mois)",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "salaires": [
   [
    30000
   ]
  ],
  "couts_employeur": [
   42334.25
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 23992.43,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 8771.75,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 15220.68,
   "revenu_disponible_openfisca_brut": 15220.68
  }
 },
 {
  "id": "independant",
  "libelle": "Indépendant (micro-entrepreneur libéral, 3 000 € de chiffre d'affaires par mois)",
  "adultes": 1,
  "enfants": 0,
  "logement": "locataire",
  "micro_ca": 3000,
  "charges_reelles_part": 0.15,
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 1776.0,
   "cotisations_micro": 774,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 87.17,
   "rsa": 0.0,
   "prime_activite": 53.97,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 1742.8,
   "revenu_disponible_openfisca_brut": 1946.53
  }
 },
 {
  "id": "intermittent",
  "libelle": "Intermittent du spectacle (salaires + allocation, moyennes Unédic)",
  "adultes": 1,
  "enfants": 0,
  "logement": "locataire",
  "salaires": [
   [
    1366,
    null,
    "intermittent"
   ]
  ],
  "chomage_brut": 1117.5,
  "couts_employeur": [
   1960.09
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 1081.33,
   "chomage_net": 1117.5,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 86.58,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 2112.24,
   "revenu_disponible_openfisca_brut": 2112.24
  }
 },
 {
  "id": "cadre_chomage",
  "libelle": "Cadre au chômage indemnisé (ancien salaire 3 Smic brut)",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "chomage_ancien_brut": 5601.0599999999995,
  "are_brut": 3192.6,
  "sjr": 184.14,
  "are_journaliere": 104.96,
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 2814.41,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 255.17,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 2559.24,
   "revenu_disponible_openfisca_brut": 2727.27
  }
 },
 {
  "id": "couple_0_enfant",
  "libelle": "Couple, Smic + salaire médian, 0 enfant",
  "adultes": 2,
  "enfants": 0,
  "logement": "locataire",
  "salaires": [
   [
    1867.02
   ],
   [
    2800.5299999999997
   ]
  ],
  "couts_employeur": [
   1987.76,
   3676.54
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 3694.82,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 117.92,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 3576.9,
   "revenu_disponible_openfisca_brut": 3576.9
  }
 },
 {
  "id": "couple_1_enfant",
  "libelle": "Couple, Smic + salaire médian, 1 enfant",
  "adultes": 2,
  "enfants": 1,
  "logement": "locataire",
  "salaires": [
   [
    1867.02
   ],
   [
    2800.5299999999997
   ]
  ],
  "couts_employeur": [
   1987.76,
   3676.54
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 3694.82,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 40.67,
   "rsa": 0.0,
   "prime_activite": 65.52,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 3719.67,
   "revenu_disponible_openfisca_brut": 3719.34
  }
 },
 {
  "id": "couple_2_enfants",
  "libelle": "Couple, Smic + salaire médian, 2 enfants",
  "adultes": 2,
  "enfants": 2,
  "logement": "locataire",
  "salaires": [
   [
    1867.02
   ],
   [
    2800.5299999999997
   ]
  ],
  "couts_employeur": [
   1987.76,
   3676.54
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 3694.82,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 103.86,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 151.94,
   "dont_allocations_familiales": 152.71,
   "dont_asf": 0.0,
   "revenu_disponible": 3950.63,
   "revenu_disponible_openfisca_brut": 3950.11
  }
 },
 {
  "id": "couple_3_enfants",
  "libelle": "Couple, Smic + salaire médian, 3 enfants",
  "adultes": 2,
  "enfants": 3,
  "logement": "locataire",
  "salaires": [
   [
    1867.02
   ],
   [
    2800.5299999999997
   ]
  ],
  "couts_employeur": [
   1987.76,
   3676.54
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 3694.82,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 655.03,
   "dont_allocations_familiales": 348.37,
   "dont_asf": 0.0,
   "revenu_disponible": 4349.85,
   "revenu_disponible_openfisca_brut": 4349.85
  }
 },
 {
  "id": "couple_4_enfants",
  "libelle": "Couple, Smic + salaire médian, 4 enfants",
  "adultes": 2,
  "enfants": 4,
  "logement": "locataire",
  "salaires": [
   [
    1867.02
   ],
   [
    2800.5299999999997
   ]
  ],
  "couts_employeur": [
   1987.76,
   3676.54
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 3694.82,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 30.58,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 885.28,
   "dont_allocations_familiales": 544.02,
   "dont_asf": 0.0,
   "revenu_disponible": 4610.68,
   "revenu_disponible_openfisca_brut": 4610.52
  }
 },
 {
  "id": "couple_monoactif_2_enfants",
  "libelle": "Couple, un seul salaire au Smic, 2 enfants",
  "adultes": 2,
  "enfants": 2,
  "logement": "locataire",
  "salaires": [
   [
    1867.02
   ],
   null
  ],
  "couts_employeur": [
   1987.76,
   0.0
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 1477.93,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 587.86,
   "aides_logement": 293.19,
   "aspa": 0.0,
   "prestations_familiales": 225.05,
   "dont_allocations_familiales": 152.71,
   "dont_asf": 0.0,
   "revenu_disponible": 2584.02,
   "revenu_disponible_openfisca_brut": 2581.08
  }
 },
 {
  "id": "parent_isole_1_enfant",
  "libelle": "Parent isolé au Smic, 1 enfant",
  "adultes": 1,
  "enfants": 1,
  "logement": "locataire",
  "salaires": [
   [
    1867.02
   ]
  ],
  "couts_employeur": [
   1987.76
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 1477.93,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 287.69,
   "aides_logement": 197.95,
   "aspa": 0.0,
   "prestations_familiales": 235.95,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 201.38,
   "revenu_disponible": 2199.52,
   "revenu_disponible_openfisca_brut": 2198.08
  }
 },
 {
  "id": "parent_isole_2_enfants",
  "libelle": "Parent isolé au Smic, 2 enfants",
  "adultes": 1,
  "enfants": 2,
  "logement": "locataire",
  "salaires": [
   [
    1867.02
   ]
  ],
  "couts_employeur": [
   1987.76
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 1477.93,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 182.54,
   "aides_logement": 293.19,
   "aspa": 0.0,
   "prestations_familiales": 625.8,
   "dont_allocations_familiales": 152.71,
   "dont_asf": 402.77,
   "revenu_disponible": 2579.47,
   "revenu_disponible_openfisca_brut": 2578.55
  }
 },
 {
  "id": "retraite_800",
  "libelle": "Retraité seul, pension de 800 € brut par mois",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "pensions": [
   800
  ],
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 0.0,
   "pensions_nettes": 800.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 243.59,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 1043.6,
   "revenu_disponible_openfisca_brut": 1043.6
  }
 },
 {
  "id": "retraite_1200",
  "libelle": "Retraité seul, pension de 1 200 € brut par mois",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "pensions": [
   1200
  ],
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 0.0,
   "pensions_nettes": 1200.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 1200.0,
   "revenu_disponible_openfisca_brut": 1200.0
  }
 },
 {
  "id": "retraite_1600",
  "libelle": "Retraité seul, pension de 1 600 € brut par mois",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "pensions": [
   1600
  ],
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 0.0,
   "pensions_nettes": 1531.2,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 1531.2,
   "revenu_disponible_openfisca_brut": 1600.0
  }
 },
 {
  "id": "retraite_2500",
  "libelle": "Retraité seul, pension de 2 500 € brut par mois",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "pensions": [
   2500
  ],
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 0.0,
   "pensions_nettes": 2315.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 111.67,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 2203.33,
   "revenu_disponible_openfisca_brut": 2388.33
  }
 },
 {
  "id": "retraite_4000",
  "libelle": "Retraité seul, pension de 4 000 € brut par mois",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "pensions": [
   4000
  ],
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 0.0,
   "pensions_nettes": 3636.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 515.33,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 3120.67,
   "revenu_disponible_openfisca_brut": 3484.67
  }
 },
 {
  "id": "couple_retraites",
  "libelle": "Couple de retraités, pensions de 1 600 € et 800 € brut",
  "adultes": 2,
  "enfants": 0,
  "logement": "proprietaire",
  "pensions": [
   1600,
   800
  ],
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 0.0,
   "pensions_nettes": 2296.8,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": -0.0,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 2296.8,
   "revenu_disponible_openfisca_brut": 2400.0
  }
 },
 {
  "id": "proprietaire_bailleur",
  "libelle": "Salarié médian propriétaire bailleur (12 000 € de loyers nets par an)",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "salaires": [
   [
    2800.5299999999997
   ]
  ],
  "foncier_annuel": 12000,
  "couts_employeur": [
   3676.54
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 2216.89,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 1000.0,
   "prelevements_sociaux_capital": 172.0,
   "impot_revenu": 345.42,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 2699.48,
   "revenu_disponible_openfisca_brut": 2699.48
  }
 },
 {
  "id": "rentier",
  "libelle": "Rentier : 100 000 € de dividendes par an",
  "adultes": 1,
  "enfants": 0,
  "logement": "proprietaire",
  "dividendes_annuels": 100000,
  "couts_employeur": [],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 0.0,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 8333.33,
   "prelevements_sociaux_capital": 1550.0,
   "impot_revenu": 1066.67,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 5716.67,
   "revenu_disponible_openfisca_brut": 5716.67
  }
 },
 {
  "id": "heritier",
  "libelle": "Salarié médian qui hérite de 300 000 € d'un parent",
  "adultes": 1,
  "enfants": 0,
  "logement": "locataire",
  "salaires": [
   [
    2800.5299999999997
   ]
  ],
  "heritage": 300000,
  "couts_employeur": [
   3676.54
  ],
  "actuel": {
   "methode": "OpenFisca-France 175.0.45 (API) + Urssaf mon-entreprise + calculs documentés",
   "salaires_nets": 2216.89,
   "chomage_net": 0.0,
   "pensions_nettes": 0.0,
   "revenu_independant_net": 0.0,
   "cotisations_micro": 0.0,
   "capital_brut": 0.0,
   "prelevements_sociaux_capital": 0.0,
   "impot_revenu": 101.0,
   "rsa": 0.0,
   "prime_activite": 0.0,
   "aides_logement": 0.0,
   "aspa": 0.0,
   "prestations_familiales": 0.0,
   "dont_allocations_familiales": 0.0,
   "dont_asf": 0.0,
   "revenu_disponible": 2115.89,
   "revenu_disponible_openfisca_brut": 2115.89,
   "droits_succession": 38194.35,
   "droits_succession_100k": 0.0,
   "droits_succession_1M": 212961.95
  }
 }
];
if (typeof module !== 'undefined' && module.exports) module.exports = CAS_TYPES_DONNEES;
