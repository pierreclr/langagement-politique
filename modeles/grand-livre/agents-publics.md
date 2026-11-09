---
titre: Les agents publics : combien, où, pour quel coût, et ce que le système en fait
date: 2026-11-06
statut: brouillon sourcé ; ordres de grandeur sous hypothèses, jamais des prédictions ; aucun fichier du bilan modifié ; vérifications V18800 à V18815 ; données dans `agents-publics.csv` (2 840 lignes), code dans `modeles/grand-livre/code/agents_publics.py`
---

# Les agents publics

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026 (soir). **Demande** : compter les fonctionnaires et ce qu'ils coûtent « au-delà des flux financiers » (où sont-ils, combien par administration, quel coût complet, quels bâtiments), puis dire pour chaque entité si le système remet en cause son existence : est-elle là pour collecter, instruire, contrôler, ou autre chose ?

**Mon risque ici : la complaisance, dans deux sens.** L'auteur cherche des économies faites de nombreux montants d'un milliard, qui finissent par atteindre 10, 20 ou 30 milliards. La somme existe, mais presque rien n'y vient du système. Et la tentation inverse : ranger 2 776 entités par mots-clés donne une impression de précision que le classement n'a pas. Je le dis en tête.

## 1. Résultat en douze lignes

1. **5,88 millions de personnes** travaillent dans la fonction publique fin 2024 (5,80 millions d'ETP) : 2,59 M dans l'État, 2,04 M dans la territoriale, 1,25 M dans l'hospitalière (Insee, Première n° 2094, cote A). Avec les 161 000 salariés de droit privé de la sécurité sociale (2022), qui n'y figurent pas : **≈ 6,04 millions d'agents publics au sens large**. L'OCDE compte 6,31 M (2023, S13) : 0,27 M restent non rapprochés (V18812).
2. **Statut** : 64 % de fonctionnaires, 24 % de contractuels, 5 % de militaires, 7 % d'autres statuts. Les agents de la sécurité sociale et d'une partie de France Travail relèvent d'une convention collective de droit privé.
3. **Coût** : les rémunérations publiques de 2024 sommées dans le grand livre font **367,6 Md€** (État 151,6 ; opérateurs 35,5 ; collectivités 95,3 ; hôpitaux publics 75,0 ; caisses 10,3), contre 363,0 pour l'Insee : écart de 1,3 %.
4. **Les pensions dans le budget de l'éducation sont un fait comptable, pas un surcoût** : sur les 79,9 Md€ de rémunérations de la mission « Enseignement scolaire », **24,3 Md€ (30 %) sont une contribution employeur imputée au compte des pensions** (estimation, calibrée sur le total de 48,2 Md€ de l'État). Ce sont les retraites des anciens, payées par les actifs d'aujourd'hui. Hors pension, un agent de l'État coûte ≈ 53 k€ par an, pas 76 k€.
5. **Où ils travaillent, en gros** : l'enseignement scolaire (1,05 M d'ETPT à l'État) et l'hôpital (1,25 M) pèsent à eux deux 2,3 M de personnes ; la défense et la sécurité 0,53 M ; **la collecte des prélèvements 69 000 ETP ; l'instruction et le contrôle des prestations ≈ 198 000** (dont 80 000 à l'assurance maladie et 49 000 à France Travail). **Collecter + instruire + contrôler : ≈ 267 000 agents, 4,4 % de l'ensemble**, pour ≈ 17 Md€ de masse salariale.
6. **Le système réduit une partie seulement de ces fonctions** : **47 600 ETP concernés au central** (25 000 au bas, 80 000 au haut), soit 18 % des fonctions de collecte et d'instruction et **0,8 % des agents publics**. Ils sont à 64 % hors fonction publique (sécurité sociale : 30 300) et à 36 % à l'État (17 300).
7. **Les agents du service direct (enseigner, soigner, protéger, juger) ne sont pas touchés par le système** : si des postes y disparaissent, c'est par la démographie (éducation, 109 138 postes, D20) ou par un choix budgétaire (M1m, M2m).
8. **Absorption par les départs** : 11 ans pour les 17 300 postes de l'État au taux mesuré de 1,7 %, 6 ans à 3 % ; 9 ans pour les 30 300 de la sécurité sociale à 3 % (hypothèse). Au central on n'a donc pas de licenciement ; au bas du taux, certains postes ne partent qu'en 2037.
9. **Le cumul des économies de personnel et de fonctionnement du bilan : 28,95 Md€ brut, 23,7 Md€ net de recouvrements identifiés**, 24,9 avec le nouveau chiffré de l'inventaire, 26,8 avec le niveau 2 non mesuré. La réponse à « 10, 20, 30 » est donc : **entre 24 et 29, mais le système lui-même n'en porte que ≈ 5** (D18 3,80 + nouveau 1,2). Le reste est de la démographie (3,9) et des choix de dépense (M1m, M2m, collectivités, achats).
10. **Un double compte probable de ≈ 5,25 Md€** dans ce cumul (V18803) : M1m (un départ sur quatre non remplacé, périmètre qui contient toute la territoriale) recoupe D23 pour ≈ 4,1 Md€, D18 pour ≈ 0,75 et M3 pour ≈ 0,4.
11. **Chaque tranche de 10 Md€ par an** retire **117 Md€ de dette en dix ans** si elle est acquise dès l'année 1, **91 Md€** si elle monte sur cinq ans (taux marginal 3,5 %) ; la charge d'intérêts baisse de 3,6 Md€ par an la dixième année, 9,2 la vingtième, 17,1 la trentième. Le cumul net de 23,7 Md€ retire ≈ 216 Md€ en dix ans (7,4 points de PIB), si tout est acquis ; D18 et M1m ne sont pleins qu'en 2032 et 2038 : c'est un plafond.
12. **Les trois incohérences de l'inventaire se résolvent sans nouveau chiffre** (section 8) : la douane passe à 0 ETP, l'écart de 1,10 Md€ est exactement −0,25 (base CAF lue) −0,85 (plafond des départs), et l'Urssaf est cohérente en ETP à 34 % mais pas en euros (25 %).

## 2. Combien sont-ils ?

### 2.1 Fonction publique, par versant et statut (fait, cote A)

Source : Insee, [Première n° 2094](https://insee.fr/fr/statistiques/fichier/8732435/IP2094.pdf) (février 2026), figures 1 et 3, personnes au 31/12/2024, ETP en volume de travail de l'année, contrats aidés compris ; téléchargée le 06/11/2026.

| 2024 | Personnes (milliers) | ETP (milliers) | Fonctionnaires | Contractuels | Militaires | Autres statuts | 50 ans ou plus | Départs 2024 à la retraite |
|---|---|---|---|---|---|---|---|---|
| État (FPE) | 2 587,4 | 2 581,4 | 1 503 k (58,1 %) | 600 k (23,2 %) | 313 k (12,1 %) | 168 k (6,5 %) | 35,6 % | 38 800 civils + 11 800 militaires (1,7 % hors militaires) |
| Territoriale (FPT) | 2 039,4 | 1 999,3 | 1 417 k (69,5 %) | 538 k (26,4 %) | | 61 k (3,0 %) | 44,4 % | 43 000 (2,1 %) |
| Hospitalière (FPH) | 1 249,9 | 1 223,6 | 827 k (66,2 %) | 271 k (21,7 %) | | 151 k (12,1 %) | 32,2 % | 19 800 (1,6 %) |
| **Ensemble** | **5 876,7** | **5 804,2** | 3 747 k (63,8 %) | 1 409 k (24,0 %) | 313 k (5,3 %) | 380 k (6,5 %) | 37,9 % | 136 700 |

(Les parts de statut sont celles d'Insee ; les effectifs par statut sont les parts appliquées aux personnes, arrondies. Les départs sont ceux de la DGAFP, *Rapport annuel 2025*, repris de `sources/economies-effectifs-publics-ia.md` § 1 ; les taux sont calculés par le dépôt.)

**Par employeur** (DGAFP, *Rapport annuel 2025*, données 2023, personnes) :

- **État (2 570 k en 2023)** : Éducation nationale, jeunesse, sports, enseignement supérieur, recherche 1 490 k (dont ministère 1 105 k, établissements 385 k) ; Intérieur et Outre-mer 306 k ; Armées 290 k (281 k au ministère, civils et militaires) ; ministères économiques et financiers 142 k ; Justice 95 k ; ministères sociaux 94 k (dont 81 k dans les établissements : France Travail y est compté) ; Transition écologique et Cohésion des territoires 67 k ; Agriculture 46 k ; Culture 25 k ; Premier ministre 12 k ; Affaires étrangères 4 k en France (9 500 à l'étranger, non comptés). Les ministères pèsent 2 021 k, les établissements publics 549 k.
- **Territoriale (1 994 k)** : communes 1 029 k ; établissements communaux (CCAS, caisses des écoles) 105 k ; EPCI à fiscalité propre 302 k et autres structures intercommunales 90 k ; départements 286 k et autres établissements départementaux 72 k ; régions 99 k ; autres 11 k.
- **Hospitalière (1 239 k)** : médecins 141 k ; personnel non médical 969 k ; Ehpad non hospitaliers 92 k ; autres établissements médico-sociaux 38 k.

### 2.2 Dans le budget de l'État : les ETPT par programme (fait, cote A)

Les 1 959 612 ETPT du budget général et des budgets annexes (Direction du budget, LFI 2023, `fonction_publique/lfi2023_etpt_programmes.csv`) se répartissent ainsi (Md€ et ETPT par mission : section 3.2). Les cinq plus gros programmes sont **l'enseignement scolaire public du second degré (452 033)**, **la police nationale (151 020)**, **le premier degré (344 278)**, **la défense (272 571, tout le personnel du ministère)** et **la gendarmerie (102 162)**. La DGFiP (programme 156) en compte 93 597 en 2023 et 92 115 au plafond 2026 ; la douane 16 490.

### 2.3 Hors de la fonction publique : sécurité sociale, France Travail, opérateurs

| Administration | Effectif (ETP) | Statut | Nature de la donnée |
|---|---|---|---|
| **Urssaf (réseau 13 285 + caisse nationale 1 813)** | **15 098** (2023) | droit privé (UCANSS) | **fait, cote A** (open.urssaf.fr, CDI en ETP moyenne annuelle) |
| Assurance maladie (Cnam, CPAM, CGSS, services médicaux, Ugecam) | 80 400 | droit privé | estimation (C) : 161 260 − Urssaf, répartis au prorata du budget de gestion 2023 |
| CAF (Cnaf et 102 CAF) | 34 700 | droit privé | estimation (C) ; le dépôt retenait 35 200 |
| Assurance retraite (Cnav et Carsat) | 16 000 | droit privé | estimation (C) |
| MSA (toutes fonctions) | 15 100 | droit privé | estimation (C) |
| **Total régime général et MSA** | **161 260** (effectif moyen annuel 2022) | | **fait, cote A** (PLACSS 2023, annexe 6, p. 26, CIASSP) ; dépenses de personnel 8 726 M€, soit 54,1 k€ par salarié |
| **France Travail** | **48 647 ETPT** (PLF 2025) | droit privé ou contractuel de droit public | fait, cote A (jaune « opérateurs de l'État ») ; déjà compté dans les établissements de l'État de la DGAFP |
| Opérateurs de l'État, hors France Travail | 340 900 ETP lus (164 lignes) | public | fait, cote A (jaune PLF 2025) : universités et assimilés 145 261 ; CNRS 25 999 ; CEA 17 296 ; réseau des œuvres universitaires 12 833 ; INRAE 9 733 |

**Ce que je n'ai pas** : la répartition par branche des 161 260 (je ne l'ai pas trouvée : les seuls chiffres publiés par caisse que j'ai lus sont ceux de l'Urssaf) ; le statut exact de France Travail (agents de droit privé et contractuels de droit public mélangés, proportion non lue) ; les effectifs de la **MSA collecte**, d'**Agirc-Arrco** et des autres régimes. Les effectifs de `instances.csv` pour les sièges de la Cnam (10 000), de la Cnaf (1 000), de l'Acoss (2 000) et de la Cnav (2 000) sont des **planchers de tranche SIRENE d'un seul établissement** : je ne les ai pas additionnés (colonne `nature_eff` du CSV).

### 2.4 Réconciliation avec le total officiel

État (ETPT LFI 2023) 1 960 k + opérateurs 341 k = 2 301 k, contre 2 587 k de personnes de la FPE : il manque 286 k. C'est l'écart entre personnes et ETPT (≈ 3 %, soit 75 k), les agents des établissements d'enseignement du second degré et des autres établissements nationaux non opérateurs (167 lignes, 76 269 ETP dans `instances.csv`), les AESH (94 000 déclarés par les services de l'Éducation nationale en 2023) et les juridictions. **Je ne ferme pas cet écart ligne à ligne** : il est signalé, pas absorbé.

## 3. Ce que ça coûte

### 3.1 Coût complet par grande fonction (État, comptes 2024 du grand livre, Md€)

Source : `modeles/grand-livre/etat.csv` (PLRG 2024, catégories 21 rémunérations, 22 cotisations et contributions sociales, 31 fonctionnement, 51-52 investissement), jointe aux ETPT de la LFI 2023 par programme. La contribution employeur au compte des pensions est comptée dans la catégorie 22. Voir 3.3 pour son isolement.

| Fonction | ETPT (milliers) | Rémunérations | Cotisations hors pension | **Pension imputée** | Fonctionnement | Investissement |
|---|---|---|---|---|---|---|
| F1 Collecte des prélèvements (DGFiP actions 1-3, douane fiscale) | 54 | 2,43 | 0,36 | 1,16 | 0,65 | 0,08 |
| F2 Prestations (action « pensions » de la DGFiP) | 1 | 0,05 | 0,01 | 0,02 | 0,01 | 0,00 |
| F3 Autres contrôles (douane non fiscale, sanitaire, travail, comptes) | 26 | 1,32 | 0,19 | 0,56 | 0,66 | 0,05 |
| F4 Service rendu (enseigner, protéger, juger, défendre) | 1 673 | 76,56 | 11,30 | 42,51 | 7,59 | 1,93 |
| F5 Régulation, autorité, titres | 50 | 2,74 | 0,39 | 0,79 | 1,63 | 0,15 |
| F6 Production (statistiques, infrastructures, aviation civile) | 51 | 3,30 | 0,29 | 0,99 | 0,92 | 0,26 |
| F7 Support | 105 | 5,02 | 0,74 | 2,21 | 3,03 | 0,54 |
| **Total (58 lignes de programme)** | **1 960** | **91,4** | **13,3** | **48,3** | **14,5** | **3,0** |

Coût par ETPT (rémunération + cotisations + pension, mission entière) : Enseignement scolaire 76 k€ (53 k€ hors pension) ; Défense 84 k€ (51) ; Sécurités 81 k€ (53) ; Gestion des finances publiques 75 k€ (53) ; Justice 75 k€ (54) ; Action extérieure 91 k€ (82, peu de pension : agents de droit local). Le coût du 156 par ETPT pour les actions fiscales (3,38 Md€ pour 46 583 ETPT) est de 73 k€.

### 3.2 Coût hors budget de l'État (Md€, 2024)

Rémunérations : collectivités 95,3 (communes 59,3 ; départements 14,6 ; régions 4,8 ; organismes locaux 13,8) ; hôpitaux publics 75,0 (63,3 de personnel, 1,1 imputé, 10,6 d'autres personnels) ; caisses de sécurité sociale 10,3 ; opérateurs 35,5 (universités 13,1 ; France Travail 3,83 ; CNRS 2,78 ; CEA 1,73). Cela donne, par agent et par an, 47,7 k€ dans la territoriale (95,3 ÷ 1,999 M d'ETP), 61,3 k€ à l'hôpital (75,0 ÷ 1,224 M) et 54,1 k€ à la sécurité sociale. **Je n'isole pas la part « pension » de la territoriale et de l'hospitalière** : leur contribution à la CNRACL est un flux réel, pas imputé, et je n'ai pas lu son taux (V18806).

### 3.3 Pourquoi les pensions des professeurs sont dans la mission « Enseignement scolaire »

Le budget de l'État paie les agents, et paie en même temps, **pour chaque agent, une « contribution employeur » au compte d'affectation spéciale Pensions** : 78,28 % du traitement en 2025 pour un civil, 126,07 % pour un militaire (82,28 % pour un civil en 2026), contre 16,6 % dans le privé. Cette contribution est imputée aux programmes : elle gonfle la ligne « cotisations » du ministère. Le compte, de son côté, **paie les pensions des retraités** : 66,5 Md€ en 2024 (pensions civiles et militaires 64,4 ; ouvriers de l'État 2,1 ; autres 0,02). C'est un système par répartition : ce que le ministère « paie » pour un professeur en activité finance la retraite d'un professeur parti.

Isolement, en deux étapes (estimation, H-AP1) : (a) la note du grand livre donne le total des contributions imputées de l'État, **48,24 Md€** en 2024 ; (b) les autres cotisations employeur de l'État sont fixées proportionnelles à la rémunération, avec un coefficient calibré pour que le total soit exact : (61,53 − 48,24) ÷ 90,05 = **14,76 %**. La pension imputée d'un programme est alors sa cotisation moins 14,76 % de sa rémunération. Résultat : **Enseignement scolaire 24,3 Md€ de pension sur 79,9 Md€** ; Défense 9,0 sur 22,8 (39 %) ; Sécurités 7,3 sur 20,7 (35 %) ; Gestion des finances publiques 2,5 sur 8,5 ; Justice 2,0 sur 7,0.

**Pourquoi cela compte pour le système.** (1) Ne pas confondre le **coût d'un actif** (≈ 53 k€ hors pension pour un agent de l'État) et les **pensions de ceux qui sont partis** (66,5 Md€) : l'un se décide, l'autre est un engagement déjà pris. (2) **Un poste qui n'est pas remplacé n'économise pas la contribution pension à court et moyen terme** : le compte doit payer les mêmes retraités, et si les contributions baissent, la subvention d'équilibre de l'État monte. À l'État, le gain d'un poste supprimé est donc ≈ 53 k€ et non les 70 k€ de la convention du dépôt (V18805). Sur les 17 300 postes de l'État du central : − 0,29 Md€ par rapport à une valorisation à 70 k€. Pour la sécurité sociale, le coût moyen est déjà de 54,1 k€ et il n'y a pas de pension imputée.

L'écart entre 66,5 Md€ de pensions payées et 48,2 Md€ de contributions imputées de l'État (≈ 18 Md€) est financé par les retenues des agents, les contributions des opérateurs et entreprises publiques (La Poste, Orange) et une subvention d'équilibre ; **je n'ai pas lu la décomposition** (V18804).

### 3.4 Les bâtiments

Source : [DPT « Politique immobilière de l'État », PLF 2025](https://www2.assemblee-nationale.fr/static/17/Annexes-DL/PLF2025-Oranges/12-Orange_Politique_immobiliere.pdf) (inventaire Chorus RE-FX au 31/12/2023, cote A) ; téléchargé le 06/11/2026.

| Mesure (31/12/2023) | Valeur |
|---|---|
| Parc de l'État et de ses opérateurs | **95,9 M m² de surface utile brute** (194 456 bâtiments) et 4,1 M ha de terrains (30 918) ; 225 374 biens |
| dont occupé par l'État | 57,1 M m² ; le reste (38,8 M m²) par les opérateurs |
| Bureaux | 22,4 M m² (État 18,1 ; opérateurs 4,3) ; **24,9 m² de SUB par poste de travail** (cible 16 m² par résident, plafond 18) |
| Valeur nette comptable du parc contrôlé par l'État | 74,985 Md€ ; valeur brute des biens des 416 opérateurs 93,3 Md€ |
| Dépenses immobilières 2023 | **9,47 Md€** (7,0 en 2018) : immobilisations 3,46 ; loyers 1,875 ; entretien courant 1,40 ; fluides 1,38 ; nettoyage 0,38 ; autres |
| Coût moyen | **99 € par m² et par an** (calcul : 9 470 M€ ÷ 95,9 M m², tous bâtiments, investissement compris) |
| Cessions 2023 | 645 biens pour 279 M€ |

Par ministère (bureaux 2023 : État ; VNC en M€ ; biens avec convention d'utilisation) : Intérieur 4,36 M m², 14 480 M€, 12 505 biens ; Armées 3,23 M m², 16 535 M€, 56 756 biens ; Économie et finances 2,99 M m², 5 866 M€, 1 630 biens ; Justice 1,92 M m², 16 775 M€, 1 862 biens ; Éducation nationale et enseignement supérieur 0,70 M m² (+1,51 M chez les opérateurs), 2 070 M€, 7 043 biens ; Transition écologique 0,49 M m² (+0,53), 2 552 M€ ; Affaires étrangères 0,60 M m², 5 163 M€ ; Premier ministre 0,35 M m² ; Affaires sociales 0,26 M m² (+1,59 chez les opérateurs, dont les ARS) ; Culture 0,08 M m² ; Agriculture 0,07 M m². Le détail est dans le script (`BUREAUX_MIN`).

**Ce que je n'ai pas** : la surface totale et le coût d'entretien **par ministère** (le DPT les donne dans un graphique et dans des fiches par programme que je n'ai pas lues ; V18810) ; et rien du tout **par entité** (le fichier foncier des locaux de la DGFiP ne donne ni surface ni valeur ; il n'y a pas de couverture ouverte de la valeur du patrimoine des collectivités et des hôpitaux). Ce que je donne par ministère est le **coût d'exploitation théorique des bureaux** à 99 €/m², ordre de grandeur uniquement : Intérieur 0,43 Md€, Armées 0,33, Économie et finances 0,30, Éducation et enseignement supérieur 0,22, Justice 0,19, Affaires sociales 0,18.

**Effet du système sur les bâtiments.** Les 47 600 postes concernés occupent ≈ 1,2 M m² de bureaux (24,9 m² par poste), soit 5,3 % des bureaux, soit **≈ 0,12 Md€ au coût moyen**. C'est de la même nature que EF11 (−25 % de surface, 0,33 Md€ net) : **je n'ajoute rien**. Une part de ces postes est dans des organismes de droit privé qui louent (caisses) : les bâtiments des caisses ne sont pas dans l'inventaire de l'État.

## 4. Où sont-ils : le classement par fonction

### 4.1 Les sept fonctions

| Code | Fonction | Réduite par le système ? |
|---|---|---|
| F1 | **Collecter** : assiette, recouvrement et contrôle des prélèvements (impôts, cotisations) | oui |
| F2 | **Instruire** : instruction, versement et contrôle des prestations et aides sous condition | en partie |
| F3 | **Contrôler, hors prélèvements et prestations** : inspection du travail, sécurité sanitaire, douane de surveillance, juridictions financières | non |
| F4 | **Rendre un service** : enseigner, soigner, protéger, juger, défendre, culture, aide aux entreprises | non |
| F5 | **Réguler et délivrer des titres** : autorités, préfectures, consulats, conseil, pouvoirs publics | non |
| F6 | **Produire** : recherche, infrastructures, statistiques, services techniques, services industriels locaux | non |
| F7 | **Soutenir** : pilotage, RH, informatique, immobilier | indirectement (D16, M1m) |

Les fonctions que le système réduit sont **F1 et F2** (le système supprime l'impôt sur le revenu, la CSG, toutes les cotisations, la taxe foncière, le RSA, la prime d'activité, les aides au logement et les allocations familiales, et l'Urssaf comme collecteur séparé). Une prestation d'assurance (remboursement de soins, retraite) est classée F2 mais **n'est pas réduite** : au contraire, la Sécurité sociale rembourse tout le socle de soins (BT06 compte un coût de gestion en plus).

### 4.2 Les grandes administrations (personnes ou ETP ; coût ; fonction ; effet)

| Administration | Effectif | Coût (Md€) | Fonction | Effet du système | ETP concernés | Déjà compté |
|---|---|---|---|---|---|---|
| **DGFiP, fiscalité des PME et des particuliers** | 46 583 ETPT (2026) | 3,38 dont pension 1,00 | F1 | **réduite de 35 %** : IR, taxe foncière, IFI, mutations, CFE, CVAE, contributions salariales | 16 300 | D18 (S01, 1,24) |
| DGFiP, grandes entreprises | 1 408 | 0,10 | F1 | inchangée (TVA et IS restent) | 0 | |
| DGFiP, comptabilité de l'État, paye, trésoreries locales, soutien | 42 104 | 3,13 | F7 | inchangée | 0 | |
| DGFiP, législation fiscale | 220 | 0,02 | F5 | réduite de 90 % (agréments, évaluation des niches) | 200 | N30 (hors bilan, 0,02) |
| **Douane, part fiscale** | ≈ 5 800 | 0,46 | F1 | **inchangée** (accises et droits restent) | **0** (1 400 retirés, V18700) | D18 (S05, 0 €) |
| Douane, surveillance et lutte contre les trafics | ≈ 10 700 | 0,85 | F3 | inchangée | 0 | |
| **Urssaf (réseau et caisse nationale)** | 15 098 | ≈ 0,82 de personnel ; gestion 1,85 brut | F1 | **réduite** : AT-MP, allègements, versement mobilité ; collecteur séparé | 5 200 (34 %) | D18 (S02, 0,46) |
| **CAF (Cnaf et 102 CAF)** | ≈ 34 700 | ≈ 1,9 de personnel ; gestion 3,2 | F2 | **réduite d'environ 40 %** : RSA, prime d'activité, aides au logement, allocations familiales remplacés par une fonction | 14 555 | D18 (S06, 1,56) |
| **France Travail** | 48 647 | 3,83 de personnel | F2 | **réduite** : part indemnisation (calcul des droits, contrôle) ; l'accompagnement reste | non publié (V9604) ; 10 500 au prorata | D18 (S07, 1,10 sans effectif) |
| Assurance maladie | ≈ 80 400 | ≈ 4,3 de personnel ; gestion 6,2 | F2 | inchangée (la gestion monte, BT06) ; C2S : N19 | 1 000 | N19 (hors bilan) |
| Assurance retraite (Cnav, Carsat) | ≈ 16 000 | ≈ 0,9 ; gestion 1,2 | F2 | inchangée ; régime unique : N01 touche le versement des complémentaires | 0 | N01 (hors bilan, 0,25) |
| MSA | ≈ 15 100 | ≈ 0,8 ; gestion 1,2 | F2 | réduite : collecte regroupée ; guichet regroupé | 1 000 | D18 (S03) ; N50 hors bilan |
| ASP, ANAH, ANGDM, ANCV | 1 792 ; 287 ; 113 ; 200 | | F2 | réduites : paiement des aides supprimées (50 %), instruction de MaPrimeRénov' (60 %), fusion, fin des chèques-vacances | 896 ; 172 ; 113 ; 200 | N13, N15, N14, N40 (hors bilan) |
| **Éducation (mission Enseignement scolaire)** | 1 052 998 ETPT | 79,9 dont pension 24,3 | F4 | **inchangée par le système** ; −109 138 postes par la démographie (D20) | 109 138 (hors système) | D20 (3,86) |
| Police nationale | 151 020 | 11,5 dont pension 3,4 | F4 | inchangée | 0 | |
| Gendarmerie nationale | 102 162 | 9,1 dont pension 3,8 | F4 | inchangée | 0 | |
| Armées | 272 571 | 22,8 dont pension 9,0 | F4 | inchangée (hors périmètre, arbitrage 40) | 0 | |
| Justice (tribunaux, prisons, PJJ) | 92 753 | 7,0 dont pension 2,0 | F4 | inchangée ; contentieux fiscal et des cotisations : 400 ETP | 0 (N31, N32 : 400 hors bilan) | N31, N32 (0,04) |
| Préfectures (administration territoriale) | 29 298 | 2,0 | F5 | inchangée (titres, autorisations) | 0 | |
| Hôpitaux publics et médico-social (FPH) | 1 249 900 | 75,0 | F4 | inchangée (admissions et facturation : N22 non chiffré) | 0 | |
| Communes, intercommunalités | 1 526 k | ≈ 73 (communes + organismes locaux) | F4/F6/F7 | inchangée côté service ; services fiscaux locaux : S04 (500 ETP) ; D23 réduit de 4,5 Md€ par non-remplacement | 500 | D23 |
| Départements | 358 k | 14,6 | F4 et F2 (instruction RSA, APA, ASE) | inchangée ; orientation et contractualisation du RSA : N11 | 1 500 | N11 (hors bilan, 0,15) |
| Universités et organismes de recherche | 145 261 ; 25 999 ; 17 296 | 13,1 ; 2,8 ; 1,7 (personnel) | F4, F6 | inchangée | 0 | |

**Lecture** : sur les 1 960 k ETPT de l'État, **les seules lignes que le système réduit sont les 16 300 de la DGFiP** (plus 200 de législation fiscale). L'essentiel des postes concernés est dans la sécurité sociale, **hors fonction publique**.

### 4.3 Les 2 776 organismes de `instances.csv`

Classement automatique par fonction (règles de motifs sur le nom et la mission, puis défaut par type ; code `classer()`), effet pris du préclassement du dépôt (colonne `preclassement` : garder, supprimer, fusionner) et des lignes S/N de l'inventaire. **C'est une première lecture** : j'ai relu au hasard 45 lignes, 6 erreurs de fonction corrigées par des règles spécifiques (offices de tourisme, théâtres, logement social, ARS, ONF, autorités indépendantes) ; le taux d'erreur résiduel n'est pas mesuré (V18814).

| Fonction | Entités | Effet : inchangée | à examiner | regroupée | supprimée | réduite | fonction touchée, effet non décidé |
|---|---|---|---|---|---|---|---|
| F1 Collecter | 2 | | | | | | 2 |
| F2 Instruire | 130 | | | 11 | 1 | 6 | 112 (dont ≈ 95 MDPH, 24 organismes de sécurité sociale) |
| F3 Contrôler | 4 | 1 | 1 | 2 | | | |
| F4 Rendre un service | 994 | 458 | 512 | 19 | 7 | | |
| F5 Réguler | 385 | 34 | 302 | 28 | 20 | | |
| F6 Produire | 631 | 418 | 183 | 27 | 1 | | |
| F7 Soutenir | 630 | 30 | 551 | 49 | 1 | | |
| **Total** | **2 776** | **941** | **1 549** | **136** | **30** | **6** | **114** |

- **Supprimées (30)** : 18 commissions et comités dormants, SOLIDEO, le comité d'organisation de Paris 2024, sept opérateurs de compétences et associations paritaires de formation, le fonds de la complémentaire santé solidaire, et, à confirmer par l'auteur (position du 06/11), l'Assemblée nationale et le Sénat remplacés par le vote du peuple (ni l'un ni l'autre n'est dans le calcul des ETP : N02 et EF14 n'ont pas d'ETP chiffrés, et le Sénat est « non tranché » dans l'inventaire).
- **Regroupées (136)** : les organismes que le préclassement fusionne (49 organismes de formation vers le guichet unique, 14 petits établissements vers l'OFB, 6 régimes de retraite vers le régime unique, 5 vers l'INSP, 5 comités de transaction, etc.). Les agents sont repris ; le gain de support est déjà dans D16 (0,54 Md€) quand il est chiffré.
- **Réduites (6)** : ANAH, ASP, ANGDM, ANCV, OPCO (via S13), Unédic (via S08).
- **La grande majorité ne bouge pas** : 941 « inchangées » (dont 458 en F4 : musées, écoles, chambres consulaires) et 1 549 « à examiner » (aucun effet décidé : pour la plupart des GIP et des établissements publics locaux dont la mission n'est pas lisible dans le nom). **Je ne les range pas en « supprimées » pour faire un total.**

**Ce que le système remet en cause, en une phrase** : il remet en cause l'existence de **fonctions** (collecter l'IR, la taxe foncière, les cotisations salariales ; instruire le RSA, la prime d'activité, les aides au logement, les allocations familiales) et de **quelques organismes qui n'existent que pour elles** (ANCV, ANGDM, une part de l'ASP et de l'ANAH, les OPCO), pas celle des administrations qui rendent un service.

## 5. Synthèse : combien, pour quoi, avec quel effet

| Grande fonction | Agents (milliers, ETP) | Part des 6,04 M | Réduite ? |
|---|---|---|---|
| F1 Collecter (DGFiP actions 1 à 3 : 48 ; douane fiscale : 6 ; Urssaf : 15) | **≈ 69** | 1,1 % | oui, de 22 500 ETP (33 %) |
| F2 Instruire (Cnam 80 ; France Travail 49 ; CAF 35 ; Cnav 16 ; MSA 15 ; ASP, ANAH, ANGDM, ENIM, pensions DGFiP 4) | **≈ 198** | 3,3 % | en partie, de 25 000 ETP (13 %) |
| F3 Autres contrôles | ≈ 27 | 0,5 % | non |
| **F1 + F2 + F3** | **≈ 294** | 4,9 % | **47 600 ETP concernés au central** |
| F4 Service direct : État 1 673 ; hôpitaux 1 250 ; opérateurs et établissements 229 ; collectivités (écoles, crèches, action sociale : non ventilé) | **> 3 150** | > 52 % | **non** |
| F5 Réguler et titres | ≈ 70 | 1,2 % | non |
| F6 Produire | ≈ 153 hors collectivités | 2,5 % | non |
| F7 Soutenir | ≈ 114 hors collectivités et hôpitaux ; vivier administratif estimé : 283 k à l'État, 469 k dans la territoriale (23 % ⚠️ ancien), 116 k à l'hôpital | | indirectement (D16, M1m) |

(Les périmètres ne sont pas additifs : l'État est en ETPT, la sécurité sociale en estimation, les collectivités et hôpitaux en personnes. Le vivier administratif de `economies-effectifs-publics-ia.md` § 1 est une **autre coupe**, par métier, dont 15 % d'instruction et de contrôle, soit ≈ 110 k ETP à l'État et dans la territoriale réunis : non ajouté ici.)

### 5.1 Les postes concernés par le système, et leur absorption

| Poste | ETP central | Versant | Départs annuels | Années pour absorber |
|---|---|---|---|---|
| DGFiP, particuliers et PME | 16 300 | État | 1 566 (1,7 %, DGAFP 2024) à 2 763 (3 %) sur 92 115 ETPT | **11 ans** au taux mesuré, **6 ans** à 3 % |
| Autres services fiscaux | 1 000 | État | idem | inclus ci-dessus (17 300 au total) |
| CAF, MSA, France Travail, Unédic | 25 100 | hors fonction publique | 3 421 à 3 % sur 114 000 ETP (CAF + MSA + France Travail + Urssaf) | **8,9 ans** pour les 30 300 de la sécurité sociale |
| Urssaf | 5 200 | hors fonction publique | idem | idem |
| **Total** | **47 600** (bas 25 000 ; haut 80 000) | 36 % État, 64 % hors fonction publique | | **6 à 11 ans selon le taux** |

Le taux de 3 % de la sécurité sociale est une hypothèse du dépôt : aucun taux publié (PLACSS 2023 : 21,1 % des salariés du régime général ont plus de 55 ans). Au bas du taux, le dernier départ nécessaire ne tombe qu'en 2037 ; les règles « ne perdre personne » et « D18 ne produit rien avant 2032 » sont compatibles avec cela.

### 5.2 Le coût évité et le cumul

Le cumul que demande l'auteur, par famille, pour **les économies de personnel et de fonctionnement du bilan** (central, Md€ par an en croisière ; sources : `sources/calculs/bilan_global.py`, `sources/chiffrage-dette-stable-retraites-masse-salariale.md`, `sources/inventaire-suppressions.md`) :

| Famille | Ligne | Md€ | À quoi ça tient | Recouvrement identifié |
|---|---|---|---|---|
| **Du fait du système** | D18 gestion de la collecte et des prestations (3,80 brut, 3,11 net du socle et des collectivités) | 3,11 | fin de l'IR, de la CSG, des cotisations, des prestations sous condition | 0,75 avec M1m (postes DGFiP) |
| Du fait du système, nouveau et chiffré | inventaire des suppressions, net de recouvrement | 1,20 | 17 lignes (Assemblée, pensions, RSA des départements, ASP…) | déjà net |
| Démographie, pas le système | D20 éducation, 109 138 postes | 3,86 | baisse du nombre d'élèves (DEPP) | |
| Choix de dépense | D16 agences et SNU | 0,70 | Sénat 2025 | |
| Choix de dépense | D23 collectivités (non-remplacement 4,1 ; 1 607 h 1,3) | 4,50 | Cour des comptes | **4,1 avec M1m** |
| Choix de dépense | D24 achats des collectivités | 3,50 | Cour des comptes | |
| Choix de dépense | D13 supplément familial de traitement | 1,34 | | |
| Choix de dépense (levier de la dette stable) | M1m un départ sur quatre non remplacé (163 000 postes) | 7,05 | périmètre 2,95 M d'agents dont 69 % territorial | voir ci-dessus |
| Choix de dépense (levier de la dette stable) | M2m point d'indice : prix − 0,5 point pendant quatre ans | 3,75 | | |
| Choix de dépense (levier de la dette stable) | M3 1 607 heures (27 000 ETP) | 0,80 | « en partie redondant avec M1 » | **0,4** |
| Fin des Jeux | SOLIDEO, COJO, commissions (couche ECOFONC0611) | 0,45 | normalisation de la base | |
| Technologie | D19 effectifs et IA (coût net) | −0,11 | l'outil coûte plus qu'il ne rapporte à dix ans | |
| **Cumul déjà au bilan (brut)** | | **28,95** | | **−5,25** |
| **Cumul déjà au bilan, net de recouvrement** | | **23,7** | | |
| + nouveau chiffré (inventaire, net) | | **+ 1,2** → **24,9** | | |
| + niveau 2 de `economies-fonctionnement.md`, non mesuré (informatique, achats, immobilier, conseil) | | + 1,91 → **26,8** | à ne compter qu'après mesure | |
| Hors solde public (complémentaires santé 6,1, titres 0,35) | | non compté | baisse les primes des ménages, pas le déficit | |

**Révision du 06/11/2026 (soir, consolidation)** : le recouvrement vaut **4,72 Md€ et non 5,25** (la part DGFiP de M1m est de 0,22, pas 0,75) ; avec la ligne Urssaf de l'arbitrage 44 (+0,153), le cumul passe à **29,13 brut, 24,41 net**, 24,92 avec les candidats de l'inventaire (non adoptés). Les résolutions de la section 8 sont appliquées dans `sources/calculs/bilan_global.py` (couche CONSO0611) ; tableau détaillé : un document de travail non publié.

**Lecture honnête.** (1) La réponse à « à la fin ça fait 10, 20, 30 » est **24 à 27 Md€ nets, 29 bruts**. (2) **Seuls ≈ 5 Md€ viennent du système** ; 4 Md€ de la démographie ; **le reste (≈ 17 Md€) est de la décision budgétaire que n'importe quel gouvernement peut prendre sans notre système**, avec les risques de service que la Cour décrit (précédent de la RGPP). (3) Les deux tiers de la somme reposent sur des **règles de non-remplacement** dont le plafond est la capacité des départs, pas l'ambition (section 5.1). (4) Je n'ai trouvé **aucune nouvelle économie de personnel** : le classement par fonction retrouve ce que le dépôt chiffre déjà, il n'en ajoute pas. La seule correction nouvelle va dans le mauvais sens : **− 0,29 Md€** si l'on valorise les 17 300 postes de l'État sans pension (V18805).

Ces économies sont par ailleurs **inégales dans le temps** : D18 ne produit rien avant 2032, M1m monte jusqu'en 2038, M3 en 2034.

### 5.3 Effet d'une tranche de 10 Md€ sur la dette et les intérêts

Méthode (calcul, `effet_dette()` du script) : une économie annuelle réduit la dette de son montant, plus les intérêts qu'on ne paie pas sur le stock évité ; taux marginal de **3,5 %** (OAT à 10 ans 3,45 % début 2026 ; hypothèse du dépôt, V9806) ; **aucun effet sur les taux, la croissance ni les recettes, aucun coût de transition** (reconversion de 49 000 agents : 1,10 Md€ au central, hors compte).

| Tranche de 10 Md€ par an | Dette évitée à 5 ans | à 10 ans | à 20 ans | à 30 ans | Intérêts évités l'année 10 | l'année 20 | l'année 30 |
|---|---|---|---|---|---|---|---|
| Acquise dès l'année 1 | 54 | **117** | 283 | 516 | 3,6 | 9,2 | 17,1 |
| Montée linéaire sur 5 ans | 31 | **91** | 246 | 464 | 2,7 | 8,0 | 15,4 |

En points de PIB (2 935 Md€ en 2024) : 117 Md€ = 4,0 points ; 91 Md€ = 3,1 points. Le cumul net de 23,7 Md€, montée sur cinq ans : **≈ 216 Md€ à dix ans (7,4 points de PIB)**, 263 Md€ pour le brut. C'est un plafond : le calendrier réel (2032, 2034, 2038) est plus lent, et un effet sur les taux, favorable ou non, n'est pas modélisé. **1 Md€ par an retire ≈ 12 Md€ de dette en dix ans** : c'est la règle à retenir.

## 6. Ce que cela change dans le récit

1. Le système **n'est pas** un plan de réduction du nombre de fonctionnaires : il touche **0,8 %** des agents publics, presque tous dans des caisses de droit privé et dans la DGFiP.
2. Les pensions ne sont **pas un poste à part qui s'ajoute** : 48,2 Md€ de contributions imputées sont déjà dans le coût des agents de l'État, et elles financent les retraités actuels. À dire ainsi, avec le chiffre de 53 k€ hors pension.
3. Le gros du « 1 Md€ par-ci » est **politique, pas systémique**. Il faut l'écrire, sinon un adversaire le fera.
4. Les agents de l'industrie de la complexité sont surtout **privés** (308 000 ETP au central, T6) : le système y touche plus qu'à l'État (49 000).

## 7. Meilleure objection et réponse (règle 5)

**Objection** : « Vous classez par mots-clés 2 776 organismes et vous prétendez dire lesquels le système remet en cause : c'est du théâtre. » **Réponse** : en partie juste. Le classement par fonction est fiable pour les 58 programmes de l'État et les grandes administrations (effectifs et coûts lus), moins pour les 2 776 organismes dont 1 549 restent « à examiner » : je ne force pas la décision. Le résultat qui compte (47 600 postes) ne dépend d'aucun mot-clé : il vient des lignes S/N déjà sourcées.

**Seconde objection** : « 53 k€ par agent d'État hors pension, c'est faux : vous oubliez que la contribution pension baisse quand les agents disparaissent. » **Réponse** : à terme (30 à 40 ans), oui ; à l'horizon du bilan, non : les retraités sont déjà là et le compte doit les payer, la subvention d'équilibre de l'État compense ce que les contributions ne couvrent plus. C'est une hypothèse de calibrage que je ne démontre pas (V18805).

**Contraintes juridiques nommées** : droits acquis des fonctionnaires (statut, article 20 de la loi du 13 juillet 1983 pour la rémunération) ; libre administration des collectivités (art. 72 de la Constitution) pour M1m et D23 ; article 24 pour l'Assemblée ; droit du travail et conventions collectives de la sécurité sociale (UCANSS) pour les 30 300 postes de droit privé ; RGPD art. 22 pour les décisions automatisées de la fonction unique.

## 8. Les trois incohérences de l'inventaire : comment les résoudre dans le bilan

Rien n'est modifié dans `bilan_global.py`. Pour Claude, qui intègre :

**V18700 — la douane (1 400 ETP pour 0 €).** Le système laisse les accises, les droits de douane et la TVA à l'importation : la ligne L1e vaut 0 €, c'est cohérent. Ce sont donc les **1 400 ETP** qui sont à retirer. Dans le bilan : ramener les ETP de D18 de 49 000 à **47 600** (et de 49 500 à 48 100 dans l'inventaire), sans toucher aux euros. Si l'auteur veut au contraire réduire la douane fiscale, la valeur serait de 1 400 × 0,7 × 70 k€ ≈ 0,07 à 0,10 Md€ : à décider, pas à supposer.

**V18701 — 4,90 contre 3,80 Md€.** L'écart de 1,10 Md€ (ligne S10) **n'est pas un « écart de lecture »** : c'est la somme de deux corrections déjà documentées dans `sources/gestion-effectifs-fiabilisation.md` : **−0,25 Md€** (base de la CAF lue dans le PLACSS : 2,68 brut au lieu de 3,20) et **−0,85 Md€** (plafond des départs : les 146 000 ETP des services touchés, à 3 % par an avec sorties ×1,5, ne libèrent que ≈ 38 200 ETP en dix ans, contre 49 000 visés). 4,90 − 0,25 − 0,85 = **3,80**, au centime (scénario S4 de ce document ; le net de D18, 3,1086, en découle). Dans le bilan : renommer S10 en « base CAF lue (−0,25) et plafond des départs (−0,85) », et **fixer les ETP de D18 à ≈ 38 200 absorbables** (47 600 concernés). Je l'ai reconstitué par les chiffres, sans retrouver la formule dans le code de D18 : V18801.

**V18702 — l'Urssaf gardée comme collecteur.** Il y a une incohérence plus fine que celle relevée : les **5 200 ETP** de L1b représentent **34 % des 15 098 ETP** réels de l'Urssaf, alors que les **0,46 Md€** ne sont que 25 % de sa gestion brute de 1,85. Soit l'euro est trop bas (35 % = 0,65, ce qui ajoute les 0,19 de N10), soit l'ETP est trop haut (25 % × 15 098 = 3 775, soit −1 425). **Résolution proposée** : (a) si l'auteur **confirme l'arbitrage 44** (suppression de l'Urssaf comme collecteur séparé : le collecteur séparé disparaît, la collecte survit dans le prélèvement unique), remplacer L1b par 35 % (0,65 Md€) et **garder 5 200 ETP** ; N10 est alors inclus, non additionné ; (b) sinon, ramener L1b à 25 % et **réduire les ETP à 3 800**. Dans tous les cas, ne pas additionner N10 à L1b (V18802).

## 9. État de la recherche (règle 9)

- **Établi** : l'emploi public français est élevé en comparaison européenne (20,7 % de l'emploi total contre 11,5 % en Allemagne en 2023, OCDE) mais le périmètre pèse (hôpitaux publics, enseignants publics) ; les fusions d'administrations rapportent peu en emplois (−0,8 % entre 2015 et 2019, Cour des comptes via Sénat n° 807) ; le non-remplacement sans réorganisation des tâches a fini par coûter plus que ce qu'il rapportait (Louvois, suppression prématurée de postes selon la Cour).
- **Débattu** : la part d'un poste public réellement « économisée » quand il n'est pas remplacé (pension imputée, transfert vers le privé, sous-traitance : précédent de la RGPP) ; le gain des guichets uniques (Royaume-Uni, Pays-Bas : mesures divergentes).
- **Manque** : les effectifs par branche de la sécurité sociale (non publiés dans ce que j'ai lu) ; la structure par âge de la sécurité sociale et de France Travail (UCANSS) ; les effectifs des fonctions de collecte hors Urssaf et DGFiP ; la ventilation par fonction de la territoriale ; les surfaces par ministère et par entité.

## 10. Ce que je ne sais pas

La structure par branche de la sécurité sociale (estimée, ±15 %) ; l'ETP exact des fonctions F1 et F2 dans les collectivités et à l'hôpital (non ventilé) ; la décomposition des 66,5 Md€ de pensions payées ; le taux de la contribution employeur à la CNRACL ; la part exacte de l'activité fiscale de la douane (35 % est le haut de la fourchette du dépôt) ; si les 1 960 k ETPT de la LFI 2023 ont bougé en 2024 (le fichier des ETPT par programme n'existe en texte que pour 2023 : les jeux 2024 à 2026 n'ont pas été trouvés). Les coûts 2024 sont rapprochés d'ETPT 2023, sauf pour la DGFiP (plafond 2026). **Je n'ai lu aucune donnée sur des personnes physiques.**

## Vérifications ouvertes (V18800 à V18815)

Toutes ⚠️, statut « à vérifier » ; détail dans `verifications.md`.

## Sources mobilisées

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts |
|---|---|---|---|
| [Insee, Première n° 2094](https://insee.fr/fr/statistiques/fichier/8732435/IP2094.pdf) (02/2026), consulté le 06/11/2026 | effectifs et ETP 2024 par versant, statut, âge | A | aucun connu |
| [DGAFP, *Rapport annuel sur l'état de la fonction publique*, éd. 2025](https://www.fonction-publique.gouv.fr/) (copies dans `langagement-donnees/sources/effectifs-ia/`), consulté le 06/11/2026 | effectifs 2023 par ministère, employeur, statut ; lieux de travail | A | institution gestionnaire de la fonction publique |
| Direction du budget, [ETPT par programme, LFI 2023](https://data.economie.gouv.fr/explore/dataset/etpt-par-ministere-mission-programme-pour-le-bg-et-les-ba-lfi-2023/) (copie du 30/10/2026) | 1 959 612 ETPT par programme | A | émetteur du budget |
| `modeles/grand-livre/etat.csv`, `jaune2025_bi2024_operateurs.csv`, `instances.csv`, `apul.csv`, `asso.csv` (T65) | coûts 2024, opérateurs, 2 776 organismes | A à C selon la ligne | voir chaque fichier |
| [PLACSS 2023, annexe 6](https://questions.assemblee-nationale.fr/dyn/contenu/visualisation/833190/file/annexe%206%20organisme%20s%C3%A9curit%C3%A9%20sociale%20gestion%20performance%20simplification.pdf), consulté le 06/11/2026 | 161 260 salariés en 2022, 8 726 M€ de personnel, budgets de gestion | A | annexe du gouvernement |
| [Urssaf, effectifs par région (open.urssaf.fr)](https://open.urssaf.fr/api/explore/v2.1/catalog/datasets/effectifs-par-region/exports/csv?use_labels=true), consulté le 06/11/2026 | 15 098 ETP en 2023 (13 285 + 1 813) | A | producteur est l'employeur |
| [DPT « Politique immobilière de l'État », PLF 2025](https://www2.assemblee-nationale.fr/static/17/Annexes-DL/PLF2025-Oranges/12-Orange_Politique_immobiliere.pdf), consulté le 06/11/2026 | surfaces, valeur, dépenses, loyers, bureaux par ministère | A | annexe du gouvernement |
| `sources/economies-fonctionnement.md`, `inventaire-suppressions.md`, `economies-cachees-et-transition.md`, `gestion-effectifs-fiabilisation.md`, `chiffrage-dette-stable-retraites-masse-salariale.md`, `economies-effectifs-publics-ia.md` | lignes S/N, 49 000 ETP, M1m, M2m, M3, taux de départ, taux marginal de 3,5 % | B/C | modèles de Claude |
| `sources/calculs/bilan_global.py` (lecture seule) | D13, D16, D18 à D24, ECOFONC0611 | calcul | — |
| [OCDE, *Government at a Glance 2025*](https://www.oecd.org/) via `economies-effectifs-publics-ia.md` | 6,31 M d'emplois publics (S13, 2023) | B | organisme international |
