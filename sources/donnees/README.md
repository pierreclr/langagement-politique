# Données — IA et robotique

Séries chiffrées utilisées par `sources/recherche-ia-robotique.md`. Consultation : 2026-10-25.

## Conventions

- Un fichier CSV par série. Les premières lignes, préfixées par `#`, donnent la source primaire (URL), l'unité, le périmètre et la date de consultation. Vient ensuite la ligne d'en-tête.
- Colonne `statut` :
  - `mesure` : valeur observée ou publiée par la source ;
  - `estimation` : valeur estimée par un tiers (Epoch, cabinets) ou recalculée ;
  - `projection` : prévision ;
  - `annonce` : déclaration commerciale non auditée.
- Colonne `source_url` : lien vers la source primaire de chaque ligne.
- Les dates sont au format ISO (AAAA-MM-JJ) ou en années.
- Les fichiers `ia_*` qui ne portent pas le préfixe `ia_eco_` sont générés par script à partir des données brutes Epoch AI et METR (voir la section « Reproductibilité »).

## IA — capacités

| Fichier | Contenu | Unité | Source |
|---|---|---|---|
| `ia_calcul_entrainement_frontiere.csv` | Record glissant du calcul d'entraînement (2010-2026) | FLOP | [Epoch AI, Notable AI Models](https://epoch.ai/data/notable-ai-models) |
| `ia_calcul_entrainement_tous_modeles.csv` | Tous les modèles notables dont le calcul est connu (nuage de points) | FLOP | idem |
| `ia_metr_horizon_temporel.csv` | Horizon temporel à 50 % et 80 % des agents IA, avec IC, de 2019 à 2026 | minutes de travail d'expert | [METR Time Horizon 1.1](https://metr.org/time-horizons/) |
| `ia_benchmarks_etat_de_lart.csv` | Record glissant de 10 benchmarks : SWE-bench Verified, FrontierMath 1-3 et 4, GPQA Diamond, HLE, ARC-AGI-2, OTIS AIME, OSWorld 2, GDPval, Remote Labor Index | score de 0 à 1 | [Epoch AI Benchmarking Hub](https://epoch.ai/benchmarks) |
| `ia_epoch_capabilities_index.csv` | Indice composite ECI : record mondial et record par pays (US, Chine, France/Mistral…) | points ECI | [Epoch Capabilities Index](https://epoch.ai/benchmarks/eci) |

## IA — économie (préfixe `ia_eco_`)

- Prix d'inférence : `ia_eco_prix_inference_epoch.csv` et `ia_eco_prix_inference_tendances.csv`.
- Volumes de tokens : `ia_eco_tokens_traites_google.csv`.
- Capex des hyperscalers : `ia_eco_capex_hyperscalers.csv` (données SEC XBRL et guidances).
- Revenus des laboratoires d'IA : `ia_eco_revenus_labos_ia.csv`.
- Adoption par les entreprises :
  - Eurostat : `ia_eco_adoption_entreprises_eurostat.csv` ;
  - Insee : `ia_eco_adoption_entreprises_insee.csv` ;
  - Census BTOS : `ia_eco_btos_adoption_us.csv`.
- Adoption par les individus :
  - États-Unis (RPS/FRED) : `ia_eco_genai_adoption_individus_us_rps.csv` ;
  - UE : `ia_eco_genai_adoption_individus_ue.csv` ;
  - Pew : `ia_eco_pew_usage_chatgpt_adultes_us.csv` ;
  - utilisateurs hebdomadaires de ChatGPT : `ia_eco_chatgpt_utilisateurs_hebdo.csv`.
- Usages : `ia_eco_anthropic_economic_index.csv`.
- Études d'impact : `ia_eco_etudes_emploi_productivite.csv` (colonne `sens` = appuie / nuance / contredit).
- Projections d'organismes : `ia_eco_projections_organismes.csv`.

## Robotique et véhicules autonomes

- Robots industriels (IFR) :
  - installations annuelles mondiales, y compris les prévisions passées de l'IFR (pour mesurer leurs erreurs) : `robotique_ifr_installations_monde.csv` ;
  - installations par région et par pays : `robotique_ifr_installations_regions.csv` et `robotique_ifr_installations_pays.csv` ;
  - stock opérationnel mondial : `robotique_ifr_stock_operationnel_monde.csv` ;
  - densité robotique : `robotique_ifr_densite_pays.csv`. **Attention :** la Chine passe de 470 à 166 en 2024 parce que l'IFR a mis à jour les données d'emploi du NBS (Bureau national des statistiques chinois). C'est une rupture de série.
  - valeur du marché et prix moyen implicite : `robotique_ifr_valeur_marche_et_prix_implicite.csv` ;
  - part des fabricants chinois sur le marché chinois : `robotique_ifr_part_fournisseurs_chinois_en_chine.csv`.
- Humanoïdes :
  - `robotique_humanoides_livraisons_mondiales.csv` : estimations hétérogènes selon les sources ;
  - `robotique_humanoides_entreprises.csv` : Unitree, UBTech, Agility, Figure, 1X, Hyundai ;
  - `robotique_tesla_optimus_annonces_vs_realite.csv`.
- Courbes de coût : `robotique_courbes_cout.csv` (robots industriels, humanoïdes, batteries).
- Véhicules autonomes :
  - `vehicules_autonomes_waymo_trajets_payants_hebdo.csv` ;
  - `vehicules_autonomes_waymo_securite.csv` ;
  - `vehicules_autonomes_baidu_apollo_go.csv` ;
  - `vehicules_autonomes_robotaxis_flottes_et_annonces.csv`.

## Reproductibilité (fichiers Epoch et METR)

1. Télécharger les données brutes :
   - `https://epoch.ai/data/notable_ai_models.csv` ;
   - `https://epoch.ai/data/benchmark_data.zip` ;
   - `https://metr.org/assets/benchmark_results_1_1.yaml`.
2. Calculer le record glissant : pour chaque série, trier par date de sortie et ne garder que les modèles qui battent le score précédent.
3. Ces données sont mises à jour en continu : refaire l'extraction avant publication.

**Licence :** les données Epoch AI sont sous CC-BY. Citer « Epoch AI » et « METR ».

## Pièges connus

- **Benchmarks saturés** : OTIS AIME, MATH niveau 5 et FrontierMath niveau 4 sont à environ 100 %. Ils ne mesurent plus le progrès.
- **METR** : au-delà de 16 h, METR juge ses mesures peu fiables. Les intervalles de confiance des derniers modèles vont d'environ ×0,5 à ×3.
- **Calcul d'entraînement** : le calcul des modèles de pointe de Google et Anthropic depuis 2025 est souvent inconnu, donc le record glissant est probablement sous-estimé. Le chiffre de GPT-5 est jugé « spéculatif » par Epoch.

## Immigration et démographie (préfixe `immigration_`)

Séries utilisées par `sources/recherche-immigration.md`. Consultation : 2026-10-25. Mêmes conventions que ci-dessus : lignes `#` d'en-tête et colonnes `statut` et `source_url`.

### Stocks et flux

| Fichier | Contenu | Unité | Source |
|---|---|---|---|
| `immigration_insee_stock_immigres_etrangers.csv` | Immigrés et étrangers, 1975-2025 | millions, % de la population | [Insee, L'essentiel sur les immigrés](https://www.insee.fr/fr/statistiques/3633212) |
| `immigration_insee_flux_entrees_sorties.csv` | Entrées, sorties et soldes des immigrés et des non-immigrés, 2006-2024 | milliers | [Insee Première n° 2107](https://www.insee.fr/fr/statistiques/8998082) |
| `immigration_eurostat_premiers_titres_france_motif.csv` | Premiers titres de séjour en France par motif, 2008-2025 | personnes | [Eurostat migr_resfirst](https://ec.europa.eu/eurostat/databrowser/view/migr_resfirst/default/table) |
| `immigration_eurostat_premiers_titres_ue_pour_1000_hab.csv` | Premiers titres par pays de l'UE, 2019-2025 | titres et titres pour 1 000 hab. | Eurostat migr_resfirst et demo_pjan |
| `immigration_dgef_chiffres_2025.csv` | Chiffres clés 2025 (titres, régularisations, asile, éloignements, naturalisations) | personnes | DGEF via AFP/Public Sénat (27/01/2026) |
| `immigration_eurostat_part_nes_etranger_ue.csv` | Part de la population née à l'étranger, dans l'UE ou hors UE, 2014-2025 | % | [Eurostat migr_pop3ctb](https://ec.europa.eu/eurostat/databrowser/view/migr_pop3ctb/default/table) |

### Asile et éloignements

| Fichier | Contenu | Unité | Source |
|---|---|---|---|
| `immigration_eurostat_demandes_asile.csv` | Demandeurs d'asile (primo-demandeurs et total), UE-27, 2008-2025 | personnes et pour 1 000 hab. | Eurostat migr_asyappctza |
| `immigration_eurostat_asile_decisions_premiere_instance.csv` | Décisions de première instance et taux de protection (FR, DE, IT, ES, UE) | décisions, % | Eurostat migr_asydcfsta |
| `immigration_eurostat_eloignements_ordonnes_vs_executes.csv` | Ordres de quitter le territoire et renvois effectifs (FR, DE, IT, ES, UE), 2008-2025 | personnes, ratio % | Eurostat migr_eiord et migr_eirtn |

### Démographie, retraites, emploi

| Fichier | Contenu | Unité | Source |
|---|---|---|---|
| `immigration_eurostat_fecondite.csv` | Indicateur conjoncturel de fécondité, 2000-2024 | enfants par femme | Eurostat demo_find |
| `immigration_eurostat_solde_naturel_migratoire.csv` | Soldes naturel et migratoire, 1990-2025 | personnes, ‰ | Eurostat demo_gind |
| `immigration_insee_projections_2026_variantes.csv` | Projections Insee 2026 : population 2030, 2050, 2070 par variante | millions | [Insee Première n° 2108](https://www.insee.fr/fr/statistiques/9004289) |
| `immigration_eurostat_projections_europop2023.csv` | EUROPOP2023, France et UE : population, 20-64 ans, ratios de dépendance, solde migratoire par scénario, 2025-2100 | voir colonne | Eurostat proj_23ndbi et proj_23np |
| `immigration_cor_2026_sensibilites.csv` | Sensibilité des dépenses de retraite en 2070 aux hypothèses | points de PIB | [COR, rapport annuel 2026](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf) |
| `immigration_eurostat_taux_emploi_pays_naissance.csv` | Taux d'emploi des 20-64 ans par pays de naissance et par sexe, 2010-2025 | % | Eurostat lfsa_ergacob |

### Reproductibilité

Les fichiers `immigration_eurostat_*` ont été générés en interrogeant l'API Eurostat. URL de base :

```
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/{jeu}?format=JSON&lang=EN&...
```

Les filtres utilisés figurent dans l'en-tête de chaque fichier. Les ratios pour 1 000 habitants et les taux sont recalculés par Claude.

### Pièges connus

- **« Né à l'étranger » (Eurostat) ≠ « immigré » (Insee).** La notion d'Eurostat inclut les Français nés à l'étranger : pour la France, 14,0 % contre 11,6 % en 2025.
- **Stock Insee.** Rupture de série en 2024 ; les valeurs 2024-2025 sont provisoires.
- **Solde migratoire.** Il est estimé par différence et comporte un « ajustement statistique » chez Eurostat. Les soldes français 2015-2016 négatifs chez Eurostat sont un artefact de calage. L'Insee fixe conventionnellement les années 2023-2025 à +176 000.
- **Ordres de quitter et renvois.** Le ratio est indicatif : une même personne peut recevoir plusieurs décisions, et les renvois d'une année peuvent porter sur des décisions antérieures.
- **EUROPOP2023.** Le scénario de migration basse donne un ratio de dépendance pire que le scénario de migration nulle : la définition des scénarios est à vérifier.

## Simulateur « socle universel + prélèvement unique » (préfixe `simu_`)

Données d'entrée du simulateur des chapitres 9, 11, 12 et 13. Synthèse, incohérences et premier ordre de grandeur : `sources/recherche-donnees-simulateur.md`. Consultation : 2026-10-25.

**Format (différent des autres fichiers de ce dossier)** : pas de lignes `#` d'en-tête ; la source est donnée à chaque ligne. Colonnes :

| Colonne | Contenu |
|---|---|
| `indicateur` | nom de la grandeur (code Insee entre parenthèses quand il existe, ex. D11, B3n) |
| `valeur` | nombre, point décimal, sans espace ; vide si non trouvé |
| `unité` | Md€, €/mois, personnes, milliers de personnes, %… |
| `année` | année de la donnée (pas de publication) |
| `périmètre` | champ géographique et statistique (France avec ou sans Mayotte, secteur S14, CAF seulement…) |
| `statut` | `mesure`, `estimation` (calcul donné en remarque), `projection`, `non_confirme` |
| `source_url` | lien vers la source primaire (fichier ou publication précise) |
| `remarque` | précisions ; commence par ⚠️ si la valeur n'est pas confirmée |

| Fichier | Contenu | Sources principales |
|---|---|---|
| `simu_1_population.csv` | Population 2026 par âge, adultes / enfants, familles par nombre d'enfants, ménages, aires d'attraction, allocataires logement par zone APL | Insee (bilan démographique, RP), CNAF |
| `simu_2_revenus_primaires.csv` | PIB, rémunérations (D1, D11, D12), revenu mixte, revenus de la propriété, comptes des sociétés, revenus fonciers et plus-values déclarés, distribution par décile et top 1 % | Insee comptes nationaux base 2020, DGFiP, WID |
| `simu_3_transmissions.csv` | Flux successions + donations, recettes DMTG, pacte Dutreil, assurance-vie | CAE n°69, PLF Voies et moyens, Cour des comptes, IPP |
| `simu_4_prestations.csv` | Montants et bénéficiaires : aides au logement, RSA, prime d'activité, AAH, prestations familiales, chômage, ASS, ASPA, retraites (et distribution), protection sociale par risque | DREES, CNAF, Unédic, COR |
| `simu_5_prelevements.csv` | Prélèvements obligatoires par impôt et sous-secteur, dépenses fiscales, allègements, coût de collecte | Insee 3.216/3.217, PLF et PLFSS 2026, Cour des comptes, PAP 156 |
| `simu_6_depenses_publiques.csv` | Dépense publique, déficit, dette, intérêts, dépenses par fonction (COFOG) | Insee 3.201/3.301, Sénat |
| `simu_7_taux_effectifs_riches.csv` | Taux effectifs d'imposition par fractile (IPP 2023 et document de travail 2025), définitions, taxe Zucman | IPP, Assemblée nationale, CAE |
| `simu_8_outils.csv` | OpenFisca, LexImpact, EDIFIS, Ines, TAXIPP, barèmes IPP : licence, maintenance, cas types | GitHub, sites des projets |

**Pièges connus**
- Millésimes mélangés (population 2026, revenus 2024, transmissions vers 2020, IPP 2016) : ordre de grandeur, pas un compte annuel.
- Comptabilité nationale et budget de l'État diffèrent (IR, IS) ; le simulateur utilise la comptabilité nationale.
- Les cotisations imputées (D122) sont fictives : à exclure de l'assiette.
- Dividendes et loyers : écart important entre comptabilité nationale et déclarations fiscales ; plus-values absentes de la comptabilité nationale.

## Inventaire de la dépense publique (préfixe `depenses_`)

Données de l'inventaire structuré de la dépense publique (chapitre 18). Synthèse, arborescence, comparaisons et limites : `sources/recherche-inventaire-depenses.md`. Consultation : 2026-10-25. Les aides aux entreprises, niches fiscales et coûts de gestion sont traités par un travail séparé (« ce qui disparaît avec la simplification »).

**Format** : pas de lignes `#` d'en-tête ; la source est donnée à chaque ligne. Colonnes :

| Colonne | Contenu |
|---|---|
| `poste` | libellé de la dépense ; pour les comparaisons, `Pays \| code COFOG libellé` |
| `niveau` | place dans l'arborescence : `total`, `sous-secteur`, `sous-sous-secteur`, `collectivité`, `branche`, `fonction_locale`, `cofog1`, `cofog2`, `mission`, `programme`, `versant`, `operateur`, `revue_depenses`… |
| `montant` | nombre, point décimal, sans espace ; vide si non trouvé |
| `unité` | `Md€` (courants), `% PIB`, `Md€ CP`, `ETPT`, `milliers d'agents`, `%`… |
| `année` | année de la donnée (exercice), pas de publication |
| `source_url` | lien vers la source primaire (fichier ou page précise) |
| `remarque` | périmètre, mode de calcul ; commence par ⚠️ si la valeur n'est pas confirmée |

| Fichier | Contenu | Sources principales |
|---|---|---|
| `depenses_1_sous_secteurs.csv` | Dépense par sous-secteur 2014-2025 (APU, État, ODAC, ASSO, régimes sociaux, hôpitaux, APUL, collectivités, communes, départements, régions, syndicats, ODAL), principales natures (D1, D62, D632, D73, intérêts, FBCF) ; % du PIB ; branches de la Sécurité sociale 2025 ; collectivités (DGCL) par niveau et par fonction | Insee 3.201-3.215, DGCL/OFGL rapport 2026, Sénat avis n° 747 |
| `depenses_2_cofog_comparaison.csv` | COFOG niveaux 1 et 2 en % du PIB, 2024 : France, Allemagne, Italie, Espagne, Suède, Pays-Bas, zone euro, UE ; séries France / zone euro 2014-2019-2024 ; montants France en Md€ et par sous-secteur ; masse salariale publique en % du PIB | Eurostat `gov_10a_exp` |
| `depenses_3_etat_missions.csv` | Budget de l'État par mission et principaux programmes (CP, emplois) | PLF / LFI 2026, budget.gouv.fr |
| `depenses_4_effectifs_publics.csv` | Agents publics par versant, statut, familles de métiers ; comparaisons internationales ; masse salariale | DGAFP, Insee, OCDE |
| `depenses_5_operateurs_agences.csv` | Opérateurs de l'État : nombre, financements, emplois, plus gros opérateurs ; rapports sur les agences | Jaune « Opérateurs de l'État », Sénat, Cour des comptes |
| `depenses_6_evaluation.csv` | Indicateurs de performance, revues de dépenses depuis 2014, suivi des recommandations de la Cour des comptes, dépenses non évaluées, pratiques étrangères | Cour des comptes, PAP/RAP, OCDE |

**Pièges connus**
- **Consolidation** : les sous-secteurs ne s'additionnent pas au total APU (les transferts entre administrations sont comptés chez le payeur et chez le receveur). Seul le total APU est consolidé.
- **Trois comptabilités** : comptabilité nationale (Insee, Eurostat), comptabilité budgétaire de l'État (missions, CP) et comptes des organismes (LFSS, comptes de gestion locaux) ne donnent pas les mêmes montants pour la « même » dépense.
- **% du PIB** : Insee (57,0 % en 2024) et Eurostat (57,3 %) diffèrent par la révision du PIB.
- **COFOG** : les classements de certaines dépenses (aménagement local, R&D, santé publique/privée) varient d'un pays à l'autre ; un écart de dépense *publique* n'est pas un écart de dépense *totale* (retraites et santé en partie privées ailleurs).
- **Euros courants** : aucune série n'est corrigée de l'inflation.

## Inventaire des prélèvements obligatoires (préfixe `impots_`)

Inventaire, ligne par ligne, des impôts, taxes, cotisations, contributions et redevances à caractère d'impôt (chapitre 9). Synthèse, devenir de chaque prélèvement dans le modèle « prélèvement unique », limites et note sur l'imposition liée à la nationalité et l'exit tax : `sources/recherche-inventaire-impots.md`. Consultation : 2026-10-25.

**Format** : pas de lignes `#` d'en-tête ; la source est donnée à chaque ligne. Colonnes de `impots_inventaire.csv` :

| Colonne | Contenu |
|---|---|
| `id` | numéro de ligne |
| `nom` | intitulé du prélèvement |
| `categorie` | revenu, travail, consommation, patrimoine, bénéfices des sociétés, production, environnement, autres, frais de gestion |
| `collecteur` | administration ou organisme qui encaisse (DGFiP, DGDDI, Urssaf, MSA, caisses, organisme affectataire…) |
| `beneficiaire` | à qui revient le produit |
| `assiette`, `payeur` | sur quoi porte le prélèvement ; qui le paie |
| `rendement_meur` | rendement annuel en **millions d'euros** ; vide si non publié |
| `annee` | année du rendement (2022 à 2026 selon la source la plus récente trouvée) |
| `cout_collecte` | coût de collecte connu ; sinon taux moyen du collecteur (⚠️ non spécifique) ou « non publié » |
| `base_legale` | article de code ou texte ; ⚠️ = non vérifié sur Légifrance |
| `source_url`, `remarque` | source primaire ; précisions (« petite taxe » = rendement < 150 M€, seuil de l'IGF 2014) |
| `bloc` | sous-secteur bénéficiaire : État, ASSO, APUL, ODAC/opérateurs, tiers, UE, multiple |
| `type_prelevement` | impôt, cotisation, redevance, droit de timbre, agrégat… |
| `statut_montant` | exécution, prévision, non publié |
| `creation` | date de création quand elle est connue |
| `devenir_modele` | classement **proposé** dans le modèle du chapitre 9 (absorbé / supprimé / maintenu / converti / à trancher), à valider par l'auteur |
| `compte_dans_total` | `oui`, ou `non (…)` pour les agrégats, détails non additifs, composantes déjà comptées, cotisation imputée de l'État et taxes supprimées |
| `tranche_rendement` | tranche de rendement |

| Fichier | Contenu | Sources principales |
|---|---|---|
| `impots_inventaire.csv` | 343 lignes, dont 314 prélèvements comptés (291 avec montant) | Insee 3.217, NTL Eurostat/DG TAXUD 2026, OCDE Revenue Statistics (France), PLF 2026 Voies et moyens tome I, liste des taxes affectées PLF 2024, État A PLF 2025, DGCL note REI 2024, CCSS octobre 2026, PLFSS 2027 annexes 3 et 8, Unédic, PAP 2026 |
| `impots_par_collecteur.csv`, `impots_par_beneficiaire.csv`, `impots_par_categorie.csv`, `impots_par_tranche.csv`, `impots_par_devenir_modele.csv` | Nombre de prélèvements, nombre de moins de 150 M€ et rendement total par groupe (lignes `compte_dans_total = oui`) | calcul sur l'inventaire |
| `impots_seuils_cumules.csv` | Combien de prélèvements sous 1, 10, 50, 100, 150, 500 M€… et ce qu'ils rapportent | calcul sur l'inventaire |
| `impots_couts_collecte.csv` | Coûts de collecte : DGFiP, DGDDI, Urssaf, frais d'assiette facturés, frais conservés sur les droits de douane | PAP 2026 (programmes 156 et 302), VM tome I 2026, REPSS/PLACSS 2025, CCSS 2026, Unédic |
| `impots_nombre_historique.csv` | Nombre de taxes selon les sources officielles depuis 2012 (taxes affectées, petites taxes, suppressions) et comparaison OCDE du nombre de lignes d'impôts par pays | Sénat (rapports généraux citant CPO 2013, IGF 2014, CPO 2018), Voies et moyens, OCDE |

**Pièges connus**
- **Millésimes mélangés** : grandes impositions en 2024 (Insee, REI), cotisations en 2025 (CCSS), petites taxes affectées en 2022 (dernière exécution publiée en données ouvertes). La somme des lignes comptées (≈ 1 330 Md€) est un ordre de grandeur, **pas** un total réconcilié : le total officiel est celui de l'Insee (impôts et cotisations 1 329,5 Md€ en 2024, prélèvements obligatoires 1 254,0 Md€).
- **TEOM** : la comptabilité nationale (Insee, OCDE) ne la compte pas comme un prélèvement obligatoire ; elle figure ici car c'est une imposition au sens du CGI.
- **Doublons évités** : les fractions d'un même impôt affectées à plusieurs bénéficiaires (CSG, TVA, accises, TSCA) ne font qu'une ligne ; les ventilations de la CSG et les détails non additifs sont gardés avec `compte_dans_total = non`.
- **Découpage** : le nombre de prélèvements dépend des choix de découpage (IFER en 11 composantes, une seule ligne pour les ≈ 35 taxes spéciales d'équipement et pour les cinq redevances des agences de l'eau). Il n'existe pas de décompte officiel.
- **Coût de collecte** : seul l'Urssaf publie un coût complet ; pour la DGFiP, le coût par taxe est un taux moyen appliqué faute de mieux (⚠️).

## Simplification et dépenses qui interrogent (préfixe `simplification_`)

Données de `sources/recherche-simplification-et-depenses-interrogeantes.md`. Chapitres 4, 8, 9, 11 et 18. Consultation : 2026-10-25.

**Format** : pas de lignes `#` d'en-tête. Colonnes :

| Colonne | Contenu |
|---|---|
| `poste` | intitulé |
| `catégorie` | gestion prestations, collecte, dépense fiscale, allègements, conformité, informatique, projet abandonné… |
| `montant` | point décimal ; une fourchette s'écrit `a-b` ; vide si non trouvé |
| `unité` | Md€, M€, %, ETPT… |
| `année` | année de la donnée |
| `effectifs` | agents ou ETPT quand ils sont connus |
| `source_url` | source primaire |
| `remarque` | ce que dit la source, la défense de la dépense ; commence par ⚠️ si la valeur n'est pas confirmée |

| Fichier | Contenu |
|---|---|
| `simplification_1_gestion_prestations.csv` | Gestion de la branche famille, de l'Unédic et de France Travail, de la Cnav et du régime général ; indus, fraude, non-recours |
| `simplification_2_collecte.csv` | DGFiP par action (crédits, ETPT), coût de collecte, Urssaf, contrôle fiscal |
| `simplification_3_depenses_fiscales.csv` | Total, nombre, non chiffrées, top 20 des dépenses fiscales (PLF 2026), évaluations |
| `simplification_4_allegements_aides_entreprises.csv` | Exonérations de cotisations (PLFSS 2027), aides aux entreprises (Sénat 2025, France Stratégie, Clersé) |
| `simplification_5_conformite_privee.csv` | Doing Business, charge administrative (60-70 Md€, mesure de 2007), écart de TVA, secteur comptable |
| `simplification_6_informatique_publique.csv` | Grands projets numériques, dérives, sous-traitance, échecs (ONP, Sirhen, Louvois), contre-exemples |
| `simplification_7_depenses_interrogeantes.csv` | 35 dépenses documentées par la Cour, l'IGF, l'IGAS ou le Parlement, avec leur meilleure défense |

**Pièges connus**

- **Doubles comptes.** Niches, allègements, indus et non-recours sont déjà intégrés dans le simulateur (`simu_*`) : ce ne sont pas des économies supplémentaires.
- **Les niches ne sont pas des dépenses.** Les supprimer donne des recettes en plus. Depuis le PLF 2024, les niches TVA ne sont comptées que pour la part État (≈ −10 Md€).
- **89,4 Md€** est l'exécution 2024, pas le chiffrage 2026 (88,3 Md€).
- **Allègements.** Le chiffre varie entre 57 et 93 Md€ selon le champ (régimes de base ou tous régimes, allègements généraux ou toutes exonérations).
- **Charge administrative.** Le chiffre de 60-70 Md€ est une mesure de 2007, jamais actualisée.
- **Gestion par prestation.** Les coûts de gestion par prestation ne sont pas publiés ; les remboursements forfaitaires (≈ 2 %) ne sont pas des coûts complets.
