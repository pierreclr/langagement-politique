---
titre: Grand livre T65, sous-secteur ASSO, bouclage au total Insee 2024
statut: v1 du 06/11/2026, chantier ASSO (vérifications V16200 à V16214)
---

# ASSO (administrations de sécurité sociale) : bouclage 2024

Construit par `modeles/grand-livre/code/asso.py` (relançable : `python3 -I modeles/grand-livre/code/asso.py`). Fichiers : `asso.csv` (291 lignes, additives), `asso-hors-total.csv` (17 lignes, jamais additionnées : flux entre organismes de l'ASSO, dépenses d'État ou de collectivités payées par les caisses, recoupements).

## 1. Résultat

| | Md€ 2024 |
|---|---|
| Total des dépenses ASSO, Insee (tableau 3.212, S1314, millésime août 2026) | **777,288** |
| Somme des 291 lignes de `asso.csv` | **777,288** |
| Écart non absorbé | 0,000 (arrondi à 0,0001) |
| dont lignes à source indépendante de l'Insee (DREES, DREES hôpitaux, CCSS, Cades) | 699,569 (90,0 %) |
| dont lignes reprises de l'Insee sans décomposition possible (nature SEC par sous-secteur) | 48,820 (6,3 %) |
| dont lignes reconstituées par différence (Insee moins sources indépendantes) | 27,005 (3,5 %) |
| dont écart explicite entre les prestations DREES et l'Insee (lignes `GL-ASSO-ECART-D62` et `-D632`) | 1,894 (0,24 %) |

Lecture honnête : le total tombe à 0 parce que chaque nature SEC est fermée par une ligne `calcul` ou `écart` qui dit ce qui reste. **Le chiffre qui mesure la qualité du recensement est la part reconstituée (27,0 Md€ + 1,9 Md€ d'écart, soit 3,7 %)**, pas l'écart nul. Les prestations (587,1 Md€ de D62 + D632, 75,5 % du total) sont recensées à 0,3 % près par régime et par prestation, sur une source indépendante.

Le total Insee ASSO est confirmé à l'identique par Eurostat (gov_10a_main, S1314, TE 2024 = 777 288,0 M€).

## 2. Rapprochement par nature SEC

| Nature SEC | Total Insee 2024 | Somme des lignes | Écart | dont source indépendante | dont lignes Insee non décomposées | dont reconstitué par différence | dont écart explicite |
|---|---|---|---|---|---|---|---|
| D1 rémunérations | 85,279 | 85,279 | 0,000 | 63,300 | 11,416 | 10,563 | 0,000 |
| P2 consommations intermédiaires | 39,980 | 39,980 | 0,000 | 33,300 | 5,612 | 1,067 | 0,000 |
| D29 autres impôts sur la production | 7,535 | 7,535 | 0,000 | 0,000 | 7,535 | 0,000 | 0,000 |
| D3 subventions | 0,726 | 0,726 | 0,000 | 0,000 | 0,726 | 0,000 | 0,000 |
| D41 intérêts | 6,045 | 6,045 | 0,000 | 4,283 | 0,000 | 1,762 | 0,000 |
| D5 impôts courants | 0,129 | 0,129 | 0,000 | 0,000 | 0,129 | 0,000 | 0,000 |
| D62 prestations sociales en espèces | 441,103 | 441,103 | 0,000 | 437,460 | 0,000 | 3,085 | 0,558 |
| D632 prestations sociales en nature (produits marchands) | 145,972 | 145,972 | 0,000 | 144,566 | 0,000 | 0,069 | 1,337 |
| D7 hors D73 autres transferts courants | 19,018 | 19,018 | 0,000 | 0,000 | 19,018 | 0,000 | 0,000 |
| D73 transferts vers d'autres sous-secteurs (D731) | 19,512 | 19,512 | 0,000 | 11,160 | 0,000 | 8,352 | 0,000 |
| D9 transferts en capital | 1,934 | 1,934 | 0,000 | 0,000 | 0,811 | 1,123 | 0,000 |
| P51g formation brute de capital fixe | 9,927 | 9,927 | 0,000 | 5,500 | 3,444 | 0,983 | 0,000 |
| P52, P53, NP autres actifs non financiers | 0,128 | 0,128 | 0,000 | 0,000 | 0,128 | 0,000 | 0,000 |
| **Total** | **777,288** | **777,288** | **0,000** | 699,569 | 48,820 | 27,005 | 1,894 |

Les « autres » prestations (81 lignes de moins de 10 M€ ou de part non détaillée par la DREES, 3,1 Md€ au total) sont comptées dans « reconstitué » de D62 et D632.

### Passage des sous-secteurs au total consolidé de l'ASSO

| | Md€ 2024 |
|---|---|
| Régimes d'assurance sociale (S13141, Insee 3.213) | 740,468 |
| Hôpitaux et autres organismes dépendants (S13142, Insee 3.214) | 132,103 |
| Somme non consolidée | 872,571 |
| moins D73 intra-ASSO (régimes vers hôpitaux, calcul : 112,967 + 0,732 − 19,512) | −94,187 |
| moins D9 intra-ASSO (3.213 + 3.214 − 3.212 : 2,219 + 0,811 − 1,934) | −1,096 |
| **Total ASSO consolidé (3.212)** | **777,288** |

Les 95,3 Md€ éliminés se retrouvent dans `asso-hors-total.csv` (`GL-ASSO-HT-01`, `-01B`), jamais additionnés.

### Hôpitaux : ne pas compter deux fois l'Ondam hospitalier et les dépenses des hôpitaux

Pour l'Insee, l'assurance maladie ne « verse pas de prestations » aux hôpitaux publics : elle leur transfère 94,2 Md€ (D73 intra-ASSO, calcul), et ce sont les hôpitaux qui dépensent (rémunérations, achats, investissements, impôts : 128,5 Md€ de lignes `GL-ASSO-HOP-*`, soit le S13142 hors prestations et hors transferts). La DREES compte les mêmes transferts en « prestations de soins du secteur public hospitalier » (90,9 + 1,4 USLD = 92,3 Md€ ; écart de 1,9 avec le calcul Insee non expliqué, V16210). Dans `asso.csv` figurent donc **les dépenses des hôpitaux, pas le transfert qui les finance** ; les prestations DREES des hôpitaux (92,3) sont exclues des lignes `GL-ASSO-PRE-*`. L'ancienne ligne `ASSO-MAL-ONDAM-ES` (109,4 Md€, 2025, objectif national, public et privé) ne doit plus être additionnée avec les dépenses hospitalières : sa part publique est le transfert intra-ASSO (`HT-01`), sa part privée (cliniques) est déjà dans D632 (`GL-ASSO-PRE-CNAM-11-2-39`, 18,9 Md€ en 2024).

## 3. Recoupement Eurostat

| Nature | Insee 3.212 | Eurostat gov_10a_main | Eurostat gov_10a_exp (COFOG) | gov_10a_exp moins Insee |
|---|---|---|---|---|
| D1 | 85,279 | 85,279 | 85,435 | 0,157 |
| P2 | 39,980 | 39,980 | 39,515 | −0,465 |
| D62 | 441,103 | 441,103 | 439,799 | −1,304 |
| D632 | 145,972 | 145,972 | 147,021 | 1,049 |
| D7 (D73 + D7 hors D73) | 38,531 | 38,531 | 39,151 | 0,621 |
| P51g | 9,927 | 9,927 | 10,182 | 0,254 |
| **Total** | **777,288** | **777,288** | **778,427** | **1,139** |

Eurostat « comptes nationaux » (gov_10a_main) reprend l'Insee à l'euro près sur toutes les natures. Le jeu COFOG (gov_10a_exp), pourtant mis à jour le même jour (21/10/2026), dépasse de 1,139 Md€ le total de l'ASSO, et cet écart est presque égal à la capacité de financement de l'ASSO (1,140, tableau 3.212) : cause non élucidée (V16200). Conséquence : toute ventilation COFOG de l'ASSO est à ±1,1 Md€.

Eurostat apporte aussi ce que l'Insee ne publie pas dans les tableaux 3.2xx : D7 hors D73 = D75 18,520 + D71 0,407 + D74 0,092 ; D731 vers l'État et les ODAC 10,200, vers les collectivités 9,312 (utilisés pour borner `GL-ASSO-D731-*`) ; prestations D62 par fonction : vieillesse 297,561, survie 39,794, chômage 37,610.

## 4. COFOG (ventilation des lignes)

| Division | Lignes de `asso.csv` | Eurostat gov_10a_exp | Écart | Remarque |
|---|---|---|---|---|
| 01 services généraux (intérêts) | 6,045 | 7,904 | −1,859 | Eurostat y met aussi 1,7 de fonctionnement non reconstitué ici |
| 04 affaires économiques | 0,000 | 0,560 | −0,560 | subventions classées en 07 ou 10 dans les lignes |
| 07 santé | 257,451 | 250,596 | +6,855 | les lignes y rangent 11,2 à 11,4 de la DREES et tout le fonctionnement des hôpitaux |
| 10 protection sociale | 499,284 | 519,367 | −20,083 | dont 44,6 de fonctionnement des régimes (D1, P2, D7, D9…) classé ici en 10 faute de ventilation ; Eurostat range une partie du fonctionnement des ODASS en 10 |
| non ventilé 07 ou 10 (autres personnels, autres achats, autres investissements des ODASS) | 12,613 | | | |
| écart D62 / D632 | 1,894 | | | |
| **Total** | **777,288** | **778,427** | **−1,139** | |

La ventilation COFOG par ligne est un rattachement de la DREES (risque) et de convention pour le fonctionnement ; elle ne remplace pas le tableau Insee 3.301 (annoncé pour décembre 2026). Les 12,6 Md€ « 07 ou 10 » ne peuvent pas être répartis avec les sources publiques.

## 5. Prestations par régime (DREES 2024, hors hôpitaux publics)

Source : DREES, comptes de la protection sociale 2024, régimes classés S13141 et S13142. 255 lignes (régime × prestation, niveau 4 de la nomenclature, avec une ligne « autres » par régime et sous-risque pour les parts inférieures à 10 M€).

| Régime (nom DREES simplifié) | Prestations 2024, Md€ |
|---|---|
| CNAV (régime général, vieillesse) | 163,354 |
| CNAM (régime général, maladie-AT-MP-invalidité) | 139,881 |
| Agirc-Arrco | 98,307 |
| Régimes spéciaux de salariés (CNRACL, SNCF, RATP, mines, marins, CRPCEN, Banque de France…) | 43,452 |
| Unédic et autres régimes | 37,049 |
| CNAF | 36,279 |
| CNSA | 17,749 |
| MSA exploitants | 14,906 |
| CNAVPL (base et complémentaire) | 9,124 |
| MSA salariés | 8,857 |
| Ircantec | 4,331 |
| Autres régimes de non-salariés | 3,904 |
| Fonds C2S | 2,959 |
| France Travail (ex-Pôle emploi) | 1,704 |
| Autres ODASS | 1,145 |
| Autres complémentaires de salariés | 0,978 |
| Autres organismes du régime général | 0,637 |
| Autres fonds spéciaux | 0,563 |
| **Total (hors 0,442 d'hôpitaux militaires reclassés en D73)** | **585,181** |

Rapprochement avec l'Insee (D62 + D632 = 587,075) : écart **+1,894 Md€** (0,32 %). Dans le détail : S13142 (France Travail et autres ODASS) tombe à l'euro (2,849 des deux côtés) ; S13141 : 582,332 + 0,442 de la DREES contre 584,226 de l'Insee. L'écart est porté par `GL-ASSO-ECART-D62` (0,558) et `GL-ASSO-ECART-D632` (1,337), car la répartition D62 / D632 est ici une convention (V16201) : D632 = soins de ville, cliniques, médicaments, médico-social (11.2 hors hôpital, 11.3, 11.4, 12.4), complément de mode de garde et accueil du jeune enfant (30.3.04, .05, .20). Cette règle retrouve le D632 de l'Insee à 1,3 Md€ près.

Recoupements (non additionnels) : Agirc-Arrco 98,307 (DREES) contre 98,118 d'allocations (présentation de presse du 27/03/2025) ; Unédic « et autres régimes » 37,049 contre ARE 32,580 + aides diverses (comptes certifiés Unédic) ; CCSS : pensions de base des régimes spéciaux 2024 = CNRACL 27,546 ; SNCF 5,556 ; RATP 1,379 ; mines 1,082 ; marins 1,043 ; CRPCEN 0,981 ; Banque de France 0,568 ; autres 0,441 (total 38,596) contre 38,888 (DREES, vieillesse-survie « autres régimes spéciaux »). La CNIEG (6,041 de prestations en 2024) n'apparaît dans aucune ligne nommée de la DREES (V16206).

## 6. Lignes reconstituées (91 lignes `calcul`, 28,9 Md€ avec les écarts)

| Ligne | Md€ | Méthode |
|---|---|---|
| 81 lignes « autres prestations » (`GL-ASSO-PRE-*-AUTRES`) | 3,155 | niveau 3 DREES moins somme des niveaux 4 retenus |
| `GL-ASSO-ECART-D62`, `-D632` | 1,894 | Insee moins prestations DREES |
| `GL-ASSO-HOP-D1-AUTRES` | 10,563 | D1 Insee S13142 moins titre 1 DREES (63,3) moins cotisations imputées (1,145) ; contient France Travail, ESPIC, budgets annexes |
| `GL-ASSO-HOP-P2-AUTRES` | 1,067 | P2 Insee S13142 moins titres 2 et 3 DREES (33,3) |
| `GL-ASSO-HOP-P51G-AUTRES` | 0,983 | P51g Insee S13142 moins investissement hospitalier (5,5) moins production propre immobilisée (2,526) |
| `GL-ASSO-HOP-D41-AUTRES` | 0,351 | D41 Insee S13142 moins résultat financier net des hôpitaux (0,877) |
| `GL-ASSO-REG-D41-AUTRES` | 1,411 | D41 Insee S13141 moins Cades (3,406) |
| `GL-ASSO-REG-D9` | 1,123 | D9 régimes moins élimination intra-ASSO (1,096) |
| `GL-ASSO-D731-AUTRES-APUC`, `-APUL` | 4,449 ; 3,903 | Eurostat D731 vers APUC (10,200) et APUL (9,312) moins les postes identifiés (FIR 5,309 ; CNMSS 0,442 ; CNSA vers départements 5,409) |

Lignes `estimation` (7) : titre 1, 2 et 3 des hôpitaux publics (budget principal : périmètre différent de l'Insee), investissement hospitalier (5,5), intérêts hospitaliers (0,877), FIR vers les ARS, CNMSS en D73.

## 7. Traitement dans le bilan (`bilan_global.py`) : `ligne_bilan` et `sort`

| Ligne du bilan | Lignes ASSO concernées (Md€ 2024) | Base du bilan | Sort |
|---|---|---|---|
| D01 retraites | 299,203 (prestations de vieillesse DREES : droits propres, minimum vieillesse, complémentaires dont Agirc-Arrco 84,974) | 392,0 (COFOG vieillesse de toutes les APU : ASSO 322,2 ; État 75,6 ; APUL 9,0) | reste, réduit de 19,718 en croisière 2060 ; pas de montant par ligne |
| D02 chômage Unédic | 37,044 | 37,1 | remplacé par le complément dégressif (cible 12,56) ; `montant_apres` réparti au prorata |
| D07 prestations familiales | 35,450 | 35,2 | 25,245 remplacés par la fonction des revenus (AF, CF, ASF, ARS, Paje base, prime de naissance) ; 7,984 gardés (CMG assistante maternelle et domicile, PreParE) ; 2,221 à arbitrer (accueil du jeune enfant) |
| D13 supplément familial de traitement | 0,888 | 1,34 (tous employeurs) | remplacé |
| D11 santé | 237,805 (prestations de santé, médico-social, hôpitaux, FIR) | 261,2 (COFOG santé) | reste, réduit de 9,7 ; pas de montant par ligne |
| D18 gestion des caisses | 26,195 (D1 et P2 des régimes, autres personnels des ODASS) | économie brute 3,8 | reste, réduit |
| D28 intérêts | 6,045 (Cades 3,406 + autres) | 58,9 | reste, conservé |
| aucune | 134,658 | | reste (« reste inchangé » de la fonction COFOG) |

Les prestations remplacées de D03 à D06 et D08 (RSA, ASS, prime d'activité, aides au logement, AAH) ne sont **pas** dans l'ASSO : l'Insee les classe dans l'État, les ODAC ou les collectivités (DREES : régimes d'intervention sociale de l'État et des départements), même si les caisses les versent (lignes `GL-ASSO-HT-09` à `-16`, hors total). Dans les 113,1 Md€ de « prestations remplacées » du bilan, **72,3 Md€ sont de l'ASSO (D02 + D07) et 40,8 de l'État, des ODAC et des collectivités** : chaque chantier de sous-secteur doit retrouver sa part.

## 8. Doublons suspects et incohérences dans le bilan (aucune modification de `bilan_global.py`)

1. **D07, accueil du jeune enfant : 2,221 Md€ fondus sans décision.** D07 part de 35,2 « estimation Cnaf, accueil du jeune enfant inclus » et ne garde que 8,0 (CMG 7,3 et PreParE 0,7). La somme DREES des prestations familiales, scolaires et de garde (30.1 + 30.2 + 30.3) est 34,934 ; elle contient 2,219 de prestations de service aux structures d'accueil (financement de crèches, pas prestation aux familles). Ce financement disparaît du bilan sans que personne ne l'ait décidé (même mécanisme que V15401, formation). Ligne `GL-ASSO-PRE-CNAF-30-3-20`, sort `à_arbitrer` (V16204).
2. **D30 contre D02 (chevauchement possible, montant non isolé).** D30 (3,499 en croisière 2060) chiffre le coût de substitution (chômage, invalidité, maladie des seniors) sur les prestations actuelles ; D02 remplace l'allocation chômage de 37,1 par un complément de 12,56. La part « chômage » de D30 devrait être chiffrée sur le complément, pas sur l'allocation d'aujourd'hui. Signalé sur `GL-ASSO-PRE-UNEDIC-42-1-01` (V16205).
3. **D18 et D19 sur les mêmes agents.** D18 supprime de la gestion des caisses (économie brute 3,8, dont CAF 1,56, Urssaf 0,46, autres caisses 0,46, France Travail 1,10 de l'étude de gestion), D19 (non-remplacement, IA) porte aussi sur les agents publics, dont ceux des organismes de sécurité sociale. D19 vaut +0,11 : effet net nul aujourd'hui, mais un même agent ne part qu'une fois (V16010 le note déjà pour les enseignants). Signalé sur `GL-ASSO-REG-D1` et `-P2` (10,0 + 5,6 Md€).
4. **D01, périmètre des réversions (pas un double compte, un trou possible).** La base 392,0 est la COFOG vieillesse (GF1002 = 391,954) : elle **exclut** les pensions de réversion (GF1003 : 40,6 dont ASSO 39,8 ; DREES 22.x : 34,9 pour l'ASSO), alors que le modèle de pensions (392,5) et l'indexation V6 s'appliquent aussi aux réversions. L'économie D01 est donc soit sous-estimée, soit comptée sur une base qui n'est pas celle du modèle (V16203). Les pensions complémentaires (Agirc-Arrco 98,3 ; Ircantec 4,3 ; CNAVPL, indépendants…) sont dans D01 alors qu'elles relèvent de l'accord des partenaires sociaux et non de la loi : contrainte juridique à nommer.
5. **Financement de France Travail et validation des points de retraite.** La contribution de l'Unédic à France Travail (4,820) et la validation des points de retraite (2,488) sont des flux intra-ASSO financés par les cotisations chômage, que P01 supprime. Ni D02 (37,1 de prestations) ni D01 ne les contiennent : la dépense de France Travail (budget propre dans `GL-ASSO-HOP-D1-AUTRES`) est « reste » sans financement, et les droits à retraite validés pendant le chômage n'ont plus de financeur. Ce n'est pas un double compte ; c'est un flux orphelin.
6. **Vérifié, non suspect :** le SFT (D13, ASSO 0,888) n'est pas dans les 35,2 de D07 (34,934 sans lui) ; les intérêts de la Cades (D28 : 6,045 pour l'ASSO) ne sont comptés qu'une fois.

## 9. Comparaison avec `modeles/depenses/lignes_asso.csv`

L'ancien fichier mélangeait trois années et trois conventions (CCSS 2025, DREES 2024 en « sous-détail », PLF) : ses lignes additives (`additif = oui`) font **717,5 Md€ en 2025** pour un total Insee de 803,2, soit 85,7 Md€ de moins, sans les dépenses des hôpitaux (le seul poste hospitalier est l'Ondam, qui est un transfert) ni les dépenses des régimes complémentaires hors Agirc-Arrco ; en 2024 toutes ses lignes étaient non additives. Il classait le régime des fonctionnaires de l'État (64,5 Md€) et le FSPOEIE comme non additifs (hors ASSO), ce que le nouveau fichier confirme (`GL-ASSO-HT-07` et `-08`, hors total).

## 10. Questions ouvertes (vérifications V16200 à V16214 dans `verifications.md`)

- L'Insee ne publie pas la composition de D7 hors D73 (19,0 Md€ : D75 18,5), de D1 et P2 des régimes (15,9 Md€), ni de D731 (19,5) : 48,8 Md€ de lignes restent « Insee non décomposé ». Les tableaux de comptes détaillés par organisme (comptes financiers de France Travail, de l'Acoss, de la CNAM) lèveraient une partie du voile.
- Le compte financier 2024 de France Travail n'a pas été trouvé ; ses charges sont dans les 10,563 reconstitués (V16209).
- Classement de la CNIEG, de la CNMSS (hôpitaux militaires), du FIR et du FSPOEIE (V16202, V16206, V16208).
- Répartition D62 / D632 : convention à confirmer auprès de l'Insee (V16201).
- Intérêts de la dette sociale : la Cades est comptée ici (3,406) ; l'amortissement du capital n'est pas une dépense au sens SEC.

## 11. Sources, cotes et conflits d'intérêts connus

| Source | Cote | Usage | Conflit d'intérêts connu |
|---|---|---|---|
| Insee, comptes nationaux base 2020, tableaux 3.212 à 3.214 et 7.306 (août 2026) | A | totaux et natures | aucun (producteur de statistique publique) |
| DREES, comptes de la protection sociale 2024 (jeu 305) | A | prestations par régime et prestation | aucun ; la DREES dépend du ministère de la Santé (périmètre de protection sociale, pas de SEC) |
| Eurostat, gov_10a_main et gov_10a_exp (21/10/2026) | A | recoupement, D7, D731 | aucun |
| DREES, Les établissements de santé en 2024, fiche 25 | A | hôpitaux publics (budget principal) | aucun |
| DSS, Comptes de la Sécurité sociale, octobre 2026 | B | FIR, concours aux départements, gestion | produit par la direction qui administre le système |
| Cades, comptes certifiés 2024 | B | intérêts | comptes de l'entité elle-même (certifiés) |
| Unédic, comptes certifiés 2024 (via `secu.parquet`) | B | contribution à France Travail, validation des points | gestionnaire paritaire (partie prenante) |
| `modeles/depenses/lignes_asso.csv` | B | lignes hors total (RSA, AAH, APA…) | hérite des sources citées ligne par ligne |

Données téléchargées dans `$DONNEES/sources/grand-livre/asso/` (JSON Eurostat) ; autres fichiers lus dans `apu/`, `regimes/`, `secu/` du même dossier.
