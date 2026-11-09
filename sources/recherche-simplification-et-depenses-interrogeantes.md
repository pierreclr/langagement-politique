# Ce qui saute avec la simplification, et les dépenses qui interrogent

Consultation : 2026-10-25. Chapitres concernés : 4 (un État conçu sans informatique), 8 (État-plateforme), 9 (prélèvement unique), 11 (revenu universel), 18 (finances publiques).

Données ligne par ligne : `sources/donnees/simplification_*.csv` (voir le README de ce dossier). L'inventaire global de la dépense par fonction et par mission est traité ailleurs : ce document ne le refait pas.

Légende : **fait sourcé** (lien) · **estimation** (calcul ou hypothèse explicités) · ⚠️ non confirmé dans une source primaire ouverte.

**Conditions de la recherche.** Le quota de recherche web s'est épuisé tôt, et le site de la Cour des comptes a bloqué les accès automatisés pendant une partie du travail. Les sources ont donc été retrouvées par leurs URL connues et par les plans des sites officiels. Plusieurs postes restent ⚠️ : ils sont listés en fin de document.

---

## 0. Le résultat en une page

**1. La plupart des gros chiffres de la « simplification » sont déjà dans le simulateur.**
- Les **niches fiscales** (88 à 89 Md€) et les **allègements de cotisations** (65 à 74 Md€) disparaissent mécaniquement avec un prélèvement unique sans niches. Mais le simulateur (`recherche-donnees-simulateur.md`) applique déjà ses 50 % à l'assiette brute de comptabilité nationale, et ne supprime que les cotisations effectivement perçues. Ces montants sont donc **déjà inclus** dans le taux d'équilibre de 59 %.
- Les **indus** (6 à 8 Md€ d'erreurs par an sur les prestations CAF) sont compris dans les montants des prestations remplacées. Les retirer une seconde fois serait un double compte.
- Le **non-recours** (≈ 30 % pour le RSA, 50 % pour le minimum vieillesse) est aujourd'hui une économie pour le budget. Un socle universel la supprime : c'est **un coût**, déjà compris dans les 696 Md€ du socle.
- Les ajouter à nouveau comme « économies » reviendrait à compter deux fois.

**2. Ce que la simplification économise en plus, ce sont des coûts de gestion.** Ils sont faibles à l'échelle du problème. Estimation prudente des économies budgétaires annuelles, en régime de croisière, après la transition (cumulatif, détail en §3) :

| Niveau | Md€/an | Ce que cela couvre |
|---|---|---|
| **Certain** | **≈ 0,5** | Frais de gestion propres aux dispositifs supprimés et documentés |
| **Probable** (y compris le certain) | **≈ 1,5 à 3** | + une part de la gestion de la branche famille, de la fiscalité des particuliers et des PME (DGFiP), du recouvrement (Urssaf) ; − le coût de versement du socle |
| **Hypothétique** (y compris le probable) | **≈ 4 à 8** | + l'indemnisation chômage à France Travail, la fusion des caisses de retraite, le SI unique, les fonctions support des agences |

Le simulateur donne un déficit supplémentaire d'environ 196 Md€. La simplification seule en couvrirait **1 à 4 %**. Son vrai argument n'est pas le financement : c'est la lisibilité, la fin des erreurs et du non-recours, et le temps rendu aux ménages et aux entreprises.

**3. Le gain principal est privé, et il est mal mesuré.** La charge administrative des entreprises est estimée à **≈ 60 Md€ (2,8 % du PIB)**. Mais ce chiffre est une mesure de 2007, jamais actualisée et recyclée depuis (OCDE 2010, Sénat 2023, mission Margueritte 2024 qui le porte à 70 Md€ en mettant le PIB à jour). Chaque tranche de 10 % réellement supprimée vaudrait ≈ 6 à 7 Md€ pour l'économie, pas pour le budget. Cet ordre de grandeur est fragile.

---

## 1. Ce qui disparaît ou se réduit mécaniquement

### 1.1 Gestion des prestations remplacées ([`simplification_1_gestion_prestations.csv`](donnees/simplification_1_gestion_prestations.csv))

**Branche famille.**
- **Charges de gestion courante (Cnaf + CAF) : 3,2 Md€ en 2025, pour 35 226 agents.** C'est 2,7 % des dépenses de la branche ; le personnel en représente 73 %. Sources : [rapport AN n° 2994, juillet 2026](https://www.assemblee-nationale.fr/dyn/docs/RINFANR5L17B2994.raw) et [Cour des comptes, certification 2025](https://www.ccomptes.fr/sites/default/files/2026-05/20260513-Certification-comptes-Securite-sociale-2025_0.pdf).
- **Aucun coût de gestion par prestation n'existe officiellement**, selon la DSS (rapport AN 2994). Il existe seulement des remboursements forfaitaires de l'État, d'environ 2 % de la prestation : APL 147 M€, ALF 65 M€, ALS 109 M€, prime d'activité 37 M€ (2024). La gestion du RSA par les CAF est gratuite pour les départements.
- **Ce qui reste après la réforme** : l'AAH, l'action sociale et le versement du socle lui-même. La branche famille ne disparaît donc pas entièrement.

**Chômage.**
- **Contribution de l'Unédic à France Travail : 4,98 Md€ en 2025** (« 11 % » légal, 11,6 à 12,1 % effectif) ([Unédic, rapport financier 2025](https://s3.eusc-de-east-1.amazonaws.eu/unedic-eks-prod-cms/2026/07/16/unedic_rafi25_global_web_p_16072026_uid_6a59074129d7d.pdf)). Elle finance l'indemnisation **et** l'accompagnement. La part de l'indemnisation et les effectifs qui y sont dédiés ne sont pas publiés ⚠️.
- **Unédic elle-même : 37,7 M€ de gestion et 117 salariés.** S'y ajoutent 41 M€ versés à l'Urssaf pour le recouvrement et 76 M€ pour le fonctionnement du CSP.

**Retraites.**
- **Cnav : 1,73 Md€ de gestion (2025), soit 0,9 % des prestations.** Un coût de gestion déjà bas.
- **Coût total de gestion des régimes : inconnu ⚠️.** Le COR ne l'isole pas. Le chiffre de 1,6 à 2 % des prestations vient de l'iFRAP, un think tank non neutre.
- **Nombre de régimes (« 42 ») : ⚠️**, attribué au rapport Delevoye (2019), non ouvert.
- **MSA : ⚠️**, non trouvé.

**Régime général, toutes branches.** Les charges de gestion courante 2025 totalisent ≈ 14,1 Md€ (calcul sur la certification). Seules la famille (3,2 Md€) et une partie du recouvrement et de la vieillesse sont concernées par la réforme. La maladie (6,1 Md€) reste.

**Fraude, erreurs, non-recours** (certification 2025 de la Cour, sauf mention) :
- **Erreurs sur les prestations CAF à 24 mois : 6,2 à 8,0 Md€ (2024), soit 8,8 %**, concentrées sur la prime d'activité, le RSA et les aides au logement, c'est-à-dire là où les ressources sont déclarées. Ce ne sont ni des pertes sèches ni de la fraude.
- **Le DRM a déjà réduit ces erreurs d'environ 1,1 Md€** (estimation Cnaf, à confirmer). Le DRM est le dispositif de ressources mensuelles, qui préremplit les ressources à partir des données de paie. C'est la preuve que l'automatisation produit déjà une partie de l'effet recherché, sans revenu universel.
- **Fraude estimée, branche famille : 3,8 à 4,7 Md€ ; détectée : 509 M€.**
- **Non-recours** : RSA ≈ 30 à 36 % ([Cour, 2022](https://www.ccomptes.fr/sites/default/files/2022-01/20220113-rapport-RSA.pdf)) ; minimum vieillesse 50 % ([DREES, 2022](https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/les-dossiers-de-la-drees/le-non-recours-au-minimum-vieillesse-des)). Prime d'activité : ⚠️.
- **Coût du contrôle : non chiffré ⚠️.**

**Lecture.** Un socle universel et inconditionnel supprime les erreurs et la fraude sur les ressources, et supprime le non-recours. Il ne supprime pas la fraude à la résidence ni à l'identité, qui devient le point de contrôle central.

### 1.2 Collecte des prélèvements ([`simplification_2_collecte.csv`](donnees/simplification_2_collecte.csv))

**DGFiP.** Source : [PAP 2026, programme 156](https://www.assemblee-nationale.fr/dyn/contenu/visualisation/1087984/file/PAP2026_BG_Gestion_finances_publiques_GA.pdf).
- **Budget : 8,23 Md€ et 92 115 ETPT.** Une grande part ne relève pas de l'impôt : gestion financière de l'État (12 715 ETPT), secteur public local (17 344), soutien (11 962).
- **Fiscalité proprement dite :**
  - particuliers et fiscalité locale : **2,06 Md€, 27 289 ETPT** ;
  - PME : **1,63 Md€, 19 294 ETPT** ;
  - grandes entreprises : 0,13 Md€, 1 408 ETPT.
- **Coût de collecte : 0,54 % des recettes brutes (2024).** Avec les douanes : 0,55 € pour 100 €. **La collecte française est déjà bon marché en moyenne.** Une ventilation par impôt n'existe pas.

**Urssaf (activité de recouvrement).** 1,85 Md€ de charges de gestion en 2025, soit ≈ 0,31 € pour 100 € reversés (calcul). Effectifs ⚠️.

**Contrôle et contentieux.**
- Taux de recouvrement des créances de contrôle fiscal : 72 % (2024).
- Montants notifiés et encaissés, contentieux fiscal, effectifs fiscaux des douanes : ⚠️ non trouvés.

**Contre-intuitif.** Selon la [Cour des comptes (2020)](https://www.ccomptes.fr/sites/default/files/2023-10/20201014-58-2-conduite-grands-projets-numeriques-Etat.pdf), les administrations fiscales françaises consacrent **moins de 7 % de leur budget à l'informatique, contre 10 à 20 %** chez leurs homologues (États-Unis, Suède, Royaume-Uni, Canada). Un prélèvement automatisé suppose donc d'**investir d'abord**.

### 1.3 Dépenses fiscales ([`simplification_3_depenses_fiscales.csv`](donnees/simplification_3_depenses_fiscales.csv))

Source : [jeu de données officiel PLF 2026 « Budget vert »](https://data.economie.gouv.fr/explore/dataset/plf-2026-budget-vert/), qui reprend le tome II des Voies et moyens.

**Montants.**
- **89,4 Md€ = exécution 2024** (et non le chiffrage 2026) ; 91,8 Md€ prévus en 2025 ; 88,3 Md€ en 2026.
- **Convention TVA.** Depuis le PLF 2024, les niches TVA ne sont comptées que pour la part de l'État, ce qui retire environ 10 Md€ ([FIPECO](https://www.fipeco.fr/pdf/Niches2024.pdf), qui cite la Cour : convention « contestable »).

**Nombre.**
- **457 dispositifs** (465 selon le Sénat, 474 au PLF 2025).
- 62 ne sont pas chiffrés ; 41 coûtent moins de 0,5 M€ ; au total, **135 ont un coût nul, non chiffré ou epsilon**.

**Concentration.** Les 20 premières font 52,7 Md€ (60 %). Il y a 21 dispositifs à plus de 1 Md€. Top 5 (2026) :

| Rang | Dispositif | Coût 2026 |
|---|---|---|
| 1 | CIR | 8,0 Md€ |
| 2 | Emploi à domicile | 7,2 Md€ |
| 3 | Abattement de 10 % sur les pensions | 4,7 Md€ |
| 4 | Pacte Dutreil | 4,0 Md€ (5,5 Md€ en 2024 selon la [Cour](https://www.ccomptes.fr/fr/publications/le-pacte-dutreil-un-dispositif-fiscal-en-forte-croissance-mieux-cibler)) |
| 5 | Participation et intéressement | 2,9 Md€ |

La liste complète des 20 premières est dans le CSV.

**Évaluation.** Le [Sénat (2025)](https://www.senat.fr/rap/r24-808-1/r24-808-1_mono.html) écrit que « la majorité des dépenses fiscales majeures échappent à une évaluation régulière ». ⚠️ Aucun décompte des niches « jamais évaluées » n'a été trouvé.

**À préciser dans le livre.**
1. Supprimer une niche produit **des recettes en plus, pas des dépenses en moins**.
2. Le « coût » affiché suppose des comportements inchangés : le rendement réel est inférieur.
3. Dans le simulateur, ce gain est **déjà compté** par l'assiette brute.
4. Beaucoup de niches sont des politiques d'orientation (CIR, emploi à domicile, dons). Le manifeste devra dire lesquelles il recrée sous forme de « modulations » (chapitre 9), et chaque modulation est une niche.

### 1.4 Allègements de cotisations et aides aux entreprises ([`simplification_4_allegements_aides_entreprises.csv`](donnees/simplification_4_allegements_aides_entreprises.csv))

**Allègements de cotisations.** Source : [PLFSS 2027, annexe 4](https://www.securite-sociale.fr/files/live/sites/SSFR/files/medias/PLFSS/2027/PLFSS2027-Annexe4-VDEF.pdf).
- **Allègements généraux : 65,0 Md€ en 2025 sur les régimes de base, 74,1 Md€ en 2026 tous régimes.** La « baisse » à 57,4 Md€ en 2026 sur les régimes de base est un transfert vers l'Unédic et l'Agirc-Arrco, pas une économie.
- **Toutes exonérations, exemptions et DFS : 93,2 Md€ (2024).**
- **Ce qu'en dit le [rapport Bozio-Wasmer (2024)](https://www.strategie-plan.gouv.fr/files/files/Publications/Rapport/rapport_vffff_241003.pdf)** :
  - le système est d'« une complexité redoutable » ;
  - les supprimer brutalement rapporterait 12 Md€ statiques mais coûterait ≈ 61 000 emplois.
- **Les allègements n'existent que pour corriger le coût du travail peu qualifié.** Le prélèvement unique les rend inutiles seulement si son barème ne surtaxe pas le bas de l'échelle. Avec un socle de 1 000 € et 50 % à la marge, le coût du travail au Smic change : c'est à simuler, pas à présumer.

**Aides aux entreprises.** Source : [commission d'enquête du Sénat, rapport n° 808 (juillet 2025)](https://www.senat.fr/rap/r24-808-1/r24-808-1_mono.html).
- **Au moins 211 Md€ en 2023 au sens large.** Composition : dépenses fiscales au sens large 88, allègements 75, Bpifrance 41 (des prêts et garanties, pas des dons), subventions 7.
- **108 Md€ au sens strict**, selon le rapport lui-même.
- **Autres estimations** : France Stratégie 139 à 223 Md€ ; Clersé-IRES 157 à 205 Md€ ; le ministre de l'Économie 150 Md€.

**Ce qui relève de la complexité du système :**
- les allègements généraux ;
- l'abattement de 10 % sur les pensions ;
- les exonérations de prestations ;
- les dépenses fiscales « déclassées » (intégration fiscale).

Le reste (CIR, outre-mer, Dutreil, aides sectorielles) relève de choix politiques.

### 1.5 Coût de conformité privé ([`simplification_5_conformite_privee.csv`](donnees/simplification_5_conformite_privee.csv))

**Doing Business 2020 (PME-type, trois impôts)** ([données Banque mondiale](https://archive.doingbusiness.org/content/dam/doingBusiness/excel/db2020/Historical-data---COMPLETE-dataset-with-scores.xlsx)) :
- **France : 139 h par an et 9 paiements** ;
- Allemagne 218 h, Royaume-Uni 114 h, **Estonie 50 h** ;
- la France est dans la moyenne. Cet indicateur ne plaide pas fortement pour la réforme. Il a d'ailleurs été arrêté en 2021 pour irrégularités.

**Charge administrative des entreprises : ≈ 60 Md€ (2,8 % du PIB, mesure 2007).** Le chiffre a été recyclé sans actualisation, d'après le [Sénat (2023)](https://www.senat.fr/rap/r22-743/r22-7431.pdf), et la [mission Margueritte (2024)](https://www.vie-publique.fr/files/rapport/pdf/293049.pdf) le porte à 70 Md€.

**Effet régressif.** La conformité TVA coûterait ≈ 2,6 % du chiffre d'affaires d'une PME contre ≈ 0,02 % pour une grande entreprise (Commission européenne, 2018 ⚠️, lu via une source secondaire). La complexité pèse d'abord sur les petits.

**Fraude à la TVA.**
- **Écart de TVA en France : 12,1 Md€, soit 5,6 % (2023)** ([Commission européenne](https://taxation-customs.ec.europa.eu/taxation/vat/fight-against-vat-fraud/vat-gap_en)).
- Le chiffre de « 20 à 25 Md€ de fraude TVA » n'a **aucune source primaire** ⚠️.
- La facturation électronique (réception obligatoire depuis le 01/09/2026) vise cet écart. Ce gain sera **déjà acquis sans la réforme** : on ne doit pas le lui attribuer.

**Secteur de la comptabilité.** Plus de 22 000 experts-comptables ; 28 Md€ de chiffre d'affaires et ≈ 221 000 personnes pour la NAF 69.20 (⚠️ source secondaire). Une partie seulement (paie, déclarations) vient de la complexité fiscale et sociale.

### 1.6 Informatique publique ([`simplification_6_informatique_publique.csv`](donnees/simplification_6_informatique_publique.csv))

**Dépenses totales.** La dépense numérique de l'État est **inconnue** : la Cour des comptes dit ne pas pouvoir l'évaluer ([via Acteurs publics, 2024](https://acteurspublics.fr/articles/la-cour-des-comptes-sagace-de-ne-pas-pouvoir-evaluer-les-depenses-numeriques-de-letat)). C'est en soi un argument pour le chapitre 8. Les dépenses des collectivités sont elles aussi inconnues ⚠️ (dernier chiffre : 2,4 Md€ en 2010).

**Grands projets.**
- **59 grands projets pour 4,53 Md€ de coût estimé** ([panorama DINUM, décembre 2025](https://www.data.gouv.fr/fr/datasets/panorama-des-grands-projets-numeriques-de-letat/)). Le panorama ne publie ni le coût initial ni la dérive.
- **Dérive moyenne de plus de 30 % (2015-2019)** ([Cour des comptes, 2020](https://www.ccomptes.fr/sites/default/files/2023-10/20201014-58-2-conduite-grands-projets-numeriques-Etat.pdf)). Exemple : SI-SAMU, prévu à 290 M€ sur 13 ans (Cour 2020), est aujourd'hui à 475 M€ sur 17 ans (panorama 2025).

**Sous-traitance.**
- **830 M€ de prestations intellectuelles informatiques en 2018** (Cour 2020) ; seulement 37 % de ressources internes dans les projets.
- **Plus de 1 Md€ de conseil acheté en 2021** ([Sénat, 2022](https://www.senat.fr/rap/r21-578-1/r21-578-1-syn.pdf)) ; la part informatique est ⚠️.

**Échecs.** Opérateur national de paye (ONP) : 346 M€ ; Sirhen : ≈ 400 M€ ; Louvois : 358 M€ de trop-versés, en partie récupérés.

**Contre-exemples.** Chorus, le prélèvement à la source et la suite numérique de la DINUM (≈ 15 M€ pour 200 000 agents) montrent que l'État sait réussir quand il internalise et standardise.

---

## 2. Dépenses qui interrogent ([`simplification_7_depenses_interrogeantes.csv`](donnees/simplification_7_depenses_interrogeantes.csv))

Trente-cinq cas, tous sourcés par la Cour des comptes, l'IGF, l'IGAS, le Sénat ou l'Assemblée. Chacun est donné avec la meilleure défense de la dépense. Les dix qui interrogent le plus, du point de vue du rapport coût / résultat documenté :

| # | Dépense | Montant | Ce que dit la source | Meilleure défense |
|---|---|---|---|---|
| 1 | [Boucliers énergie 2021-2024](https://www.ccomptes.fr/fr/publications/les-mesures-exceptionnelles-de-lutte-contre-la-hausse-des-prix-de-lenergie) | 72 Md€ brut, 36 Md€ net | « Imparfaitement pallié » ; marges du marché de gros > 30 Md€ | Choc exceptionnel, inflation contenue |
| 2 | [CICE](https://www.strategie-plan.gouv.fr/publications/evaluation-credit-dimpot-competitivite-lemploi-synthese-travaux-dapprofondissement) | ≈ 18 Md€/an (2016) | ≈ 100 000 emplois, effet « faible » au regard du coût | Hausse des salaires, effet fort pour les plus aidées |
| 3 | [Pacte Dutreil](https://www.ccomptes.fr/fr/publications/le-pacte-dutreil-un-dispositif-fiscal-en-forte-croissance-mieux-cibler) | 5,5 Md€ (2024) | 110 donataires captent 65 % de l'avantage | Éviter la vente forcée d'entreprises familiales |
| 4 | [Écotaxe poids lourds](https://www.ccomptes.fr/sites/default/files/EzPublish/05-ecotaxe-poids-lourds-Tome-1.pdf) | 958 M€ d'indemnités + 9,8 Md€ de recettes perdues | « Échec stratégique, abandon coûteux » | Compensée par la TICPE (payée par les automobilistes) |
| 5 | [Pinel](https://www.ccomptes.fr/fr/publications/laide-fiscale-linvestissement-locatif-pinel) | 10-12 Md€ cumulés jusqu'en 2038 | Défiscalisation de hauts revenus, résultat inconnu de l'administration | « Réel effet volume » |
| 6 | [Primes à l'apprentissage](https://www.igf.gouv.fr/rapports-de-mission/revue-de-depenses-formation-professionnelle-et-apprentissage) | 4,6 Md€ (2022) | Effets d'aubaine, soutien au supérieur « disproportionné » | ≈ 800 000 entrées |
| 7 | Outre-mer : [défiscalisation productive](https://www.igf.gouv.fr/rapports-de-mission/evaluation-du-regime-daide-fiscale-linvestissement-productif-en-outre-mer) + [Lodéom](https://www.igf.gouv.fr/rapports-de-mission/dispositifs-dexoneration-de-cotisations-sociales-dans-les-outre-mer-evaluation) | 0,83 + 1,5 Md€ | Aucun effet significatif ; contrôle « inexistant » | Surcoûts structurels |
| 8 | [Chèque énergie](https://www.ccomptes.fr/fr/publications/le-cheque-energie) | 0,76 Md€ (+ 0,53 exceptionnel, 2021) | 25 % des précaires exclus, la moitié des bénéficiaires non précaires | Automatique, gestion peu coûteuse (3 %) |
| 9 | [Indemnité inflation](https://www.ccomptes.fr/fr/publications/la-mise-en-place-dune-indemnite-inflation-en-2021) | 3,8 Md€ (2021) | 38 M de bénéficiaires, 1,7 M de doublons, 170 M€ à tort | Rapidité |
| 10 | [SNU](https://www.ccomptes.fr/fr/publications/le-service-national-universel-snu) | 160 M€ (2024) ; 3,5-5 Md€/an en généralisation | Objectifs non atteints, trajectoire incompatible | Satisfaction des participants |

**Les 25 autres cas** sont dans le CSV : remise carburant, MaPrimeRénov', CEE, logement social, CPF, Pass Culture, cinéma, presse, zonages, taxe au tonnage, compléments outre-mer, CESE, immobilier de l'État, arrêts maladie dans la fonction publique, dispositifs emploi, ONP / Sirhen / Louvois, conseil, régimes spéciaux, La Poste, audiovisuel public, fraude, agences.

**Contre-exemples à citer par honnêteté.**
- **CIR** : jugé efficace pour les PME (CNEPI).
- **Aide médicale d'État** : « pas un outil de politique migratoire », 0,6 % de la dépense de santé (IGF-IGAS 2019), avec des atypies réelles.
- **Agences** : le Sénat (2025) conclut à l'absence de « miracle arithmétique ». Supprimer 20 % des instances consultatives rapporterait ≈ 10 M€, réduire de 20 % les fonctions support ≈ 540 M€.

Ces trois cas contredisent l'idée d'un gisement caché dans les « doublons d'agences » : **le gisement est dans les gros dispositifs mal évalués, pas dans les structures**.

---

## 3. Estimation des économies « par simple simplification » (ESTIMATION)

**Périmètre.** Économies budgétaires annuelles en régime de croisière, **en plus** de ce que le simulateur compte déjà. Les niches, les allègements, les indus et le non-recours sont exclus pour éviter les doubles comptes (voir §0).

**Rythme.** Les effectifs publics baissent au rythme des départs, pas d'un coup. La transition coûte : il faut construire le SI et former les agents.

| Poste | Base sourcée | Hypothèse | Certain | Probable | Hypothétique |
|---|---|---|---|---|---|
| Frais de gestion remboursés pour les aides au logement et la prime d'activité | 0,36 Md€ (AN 2994) | disparaissent avec les prestations | 0,36 | 0,36 | 0,36 |
| Unédic : gestion, CSP, frais de recouvrement | 0,155 Md€ (Unédic) | disparaissent avec l'assurance chômage | 0,15 | 0,15 | 0,15 |
| Reste de la gestion de la branche famille | 3,2 − 0,36 = 2,84 Md€ | 40 à 60 % disparaît ; le reste sert à l'AAH, à l'action sociale et au socle | — | 1,1 à 1,7 | 1,1 à 1,7 |
| DGFiP, fiscalité des particuliers et des PME | 3,69 Md€, 46 583 ETPT (PAP 156) | 25 à 40 % ; la TVA, le contrôle et la vérification des flux restent | — | 0,9 à 1,5 | 0,9 à 1,5 |
| Urssaf, recouvrement | 1,85 Md€ | 10 à 25 % par fusion avec la collecte unique | — | 0,2 à 0,5 | 0,2 à 0,5 |
| **À déduire : versement et contrôle du socle** | ratios observés : 0,1 % (frais Urssaf de l'Unédic) à 0,3 % (Urssaf) des flux | 0,1 à 0,3 % de ≈ 696 Md€ | — | −0,7 à −2,1 | −0,7 à −2,1 |
| France Travail, indemnisation | une part de 5,0 Md€ ⚠️ non publiée | 10 à 20 % | — | — | 0,5 à 1,0 |
| Fusion des caisses de retraite | Cnav 1,73 Md€ ; total ⚠️ inconnu | 15 à 25 % d'un total supposé de 6 à 8 Md€ ⚠️ | — | — | 1,0 à 2,0 |
| SI unique, fin des doublons et des dérives | dépense totale inconnue ; dérive > 30 % (Cour) | ordre de grandeur indicatif | — | — | 0,5 à 2,0 |
| Fonctions support des agences et opérateurs | ≈ 0,54 Md€ pour −20 % (Sénat 2025) | repris tel quel | — | — | 0,5 |
| **Total (arrondi)** | | | **≈ 0,5** | **≈ 1,5 à 3** | **≈ 4 à 8** |

Calcul. Les bornes basses et hautes ne s'additionnent pas strictement : la déduction pour le versement du socle est en sens inverse. Les totaux sont donc arrondis prudemment :
- probable : 0,5 + (2,2 à 3,7) − (0,7 à 2,1) ≈ 0,6 à 3,5, présenté comme **1,5 à 3** ;
- hypothétique : on ajoute 2,5 à 5,5, soit ≈ 3 à 9, présenté comme **4 à 8**.

**Hors budget (gains pour l'économie, hypothétiques).**
- Conformité des entreprises : chaque 10 % de la charge administrative supprimée vaut ≈ 6 à 7 Md€ (base 2007 ⚠️).
- Temps des ménages : non chiffré.

**Recettes (et non économies), déjà comptées dans le simulateur.** Il s'agit des niches (88 Md€), des allègements (65 à 74 Md€) et de la part de l'écart de TVA récupérée par la facturation électronique, qui est acquise avec ou sans réforme.

**Effectifs.**
- Les postes probables concernent un vivier d'environ 35 000 agents à la branche famille et 46 600 ETPT pour la fiscalité DGFiP des particuliers et des PME.
- Une réduction de 25 à 50 % de ce vivier représenterait de l'ordre de 20 000 à 40 000 postes. C'est une estimation, à étaler sur les départs en retraite, dont le rythme n'a pas été recherché (⚠️).

---

## 4. Limites

1. **Les coûts de gestion par prestation ne sont pas publiés.** La DSS ne les ventile pas. Les clés de répartition (40 à 60 %, 25 à 40 %…) sont des hypothèses de l'auteur de ce document, à remplacer par une enquête (questions écrites, CNAF, DGFiP).
2. **Coût total de gestion des retraites, nombre officiel de régimes, MSA, effectifs de France Travail affectés à l'indemnisation, dépense numérique de l'État et des collectivités : inconnus ou ⚠️.** La partie « hypothétique » en dépend.
3. **L'estimation est statique.** Elle ignore le coût de la transition (double système pendant plusieurs années, construction du SI, reconversions) et le risque de dérive du projet lui-même : plus de 30 % en moyenne pour les grands projets de l'État.
4. **Le socle crée de nouvelles fonctions** : contrôle de la résidence et de l'identité, recouvrement des dettes sur le socle, gestion des modulations (enfants, zones, handicap). Chaque modulation recrée de la gestion.
5. **La charge administrative privée (≈ 60 Md€) date de 2007.** Elle n'a jamais été remesurée, et le chiffre de 3 % du PIB est recyclé de rapport en rapport.
6. **Doing Business est arrêté** et ne montre pas de retard français marqué.
7. **Les chiffres de fraude et d'erreurs CAF varient selon la source et la méthode** (6,2 à 8,0 Md€ selon la Cour, 6,8 Md€ selon l'AN, 8,0 % selon le ministère). Il faut toujours citer le millésime.
8. **Pages de la Cour non consultées** (blocage), à compléter :
   - prêts garantis par l'État ;
   - EPR ;
   - Lyon-Turin ;
   - Opéra de Paris ;
   - agences de Corse ;
   - réforme des régions ;
   - France Télévisions ;
   - transports sanitaires ;
   - fraude au CPF ;
   - rapport Évin-Stefanini sur l'AME (2023) ;
   - jaune « aides aux entreprises » du PLF 2027.

## 5. Sources mobilisées (synthèse)

- **Cour des comptes**
  - certification des comptes de la sécurité sociale 2025 : gestion, erreurs, fraude ;
  - conduite des grands projets numériques (2020) : dérives, sous-traitance ;
  - 20 rapports thématiques pour la partie 2.
- **Assemblée nationale** : rapport n° 2994 (2026) sur les indus de la Cnaf et les coûts de gestion.
- **Sénat**
  - rapport n° 808 (aides aux entreprises, 2025) ;
  - rapport n° 807 (agences, 2025) ;
  - rapport n° 578 (conseil, 2022) ;
  - rapport n° 743 (simplification, 2023).
- **PAP 2026, programme 156** : budget, effectifs et coût de collecte de la DGFiP.
- **PLF 2026 « Budget vert »** : liste complète des dépenses fiscales.
- **PLFSS 2027, annexe 4** : exonérations de cotisations.
- **Unédic** : rapport financier 2025 et prévisions d'octobre 2026.
- **IGF et IGAS** : revues de dépenses 2019-2025.
- **France Stratégie** : CICE, CIR, rapport Bozio-Wasmer.
- **DREES** : non-recours.
- **Commission européenne** : écart de TVA, ViDA.
- **Banque mondiale** : Doing Business 2020.
- **DINUM** : panorama des grands projets.

Ces sources établissent que les coûts de gestion des prestations et de la collecte sont **modestes en proportion** (0,3 à 2,7 % des flux). Les grands montants liés à la complexité (niches, allègements) sont des choix de politique fiscale, déjà intégrés dans le calcul du prélèvement unique.
