---
titre: Résultats du banc d'essai commun des programmes (LFI, Rassemblement national, notre système, fil de l'eau)
date: 2026-11-08
statut: généré par relancer.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Résultats du banc d'essai

Généré le 09/11/2026 par `python3 -I modeles/banc-programmes/relancer.py` : 10000 tirages de Monte-Carlo, graine 20261108. Écrit par Claude (IA d'Anthropic) pour l'auteur ; conflit d'intérêts à déclarer : l'auteur du manifeste est partie prenante (candidat potentiel) et le même moteur chiffre notre système et deux programmes concurrents (La France insoumise, Rassemblement national). Convention : **fait sourcé** / **estimation** / **opinion** ; ⚠️ = non vérifié (voir `verifications.md`).

Unités : Md€ par an, euros de 2025 (constants), effet sur le solde positif = améliore ; parts du PIB. **Médiane [intervalle à 80 % : centiles 10 et 90]**. Le régime est atteint en 2032 pour LFI, le Rassemblement national et le fil de l'eau (mandat 2027-2032), en 2038 pour notre système (rampe du modèle) ; les déficits et dettes sont comparés aux mêmes années. Dette de départ : 3 460,5 Md€ fin 2025 (115,7 % du PIB), macro de référence (croissance nominale 3 %, taux de marché 3,45 %), la même pour tous.

## 1. Tableau comparatif (résultat statique, c'est-à-dire sans effet de relance)

| | LFI (2027) | Rassemblement national (2027) | Notre système | Fil de l'eau |
|---|---|---|---|---|
| **Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€)** | −247 [−289 ; −203] | −32 [−61 ; 4] | 114 [64 ; 167] (2038) ; 115 [61 ; 171] (2041 et après) | 0 |
| dont recettes nouvelles et économies (Md€) | 61 [39 ; 89] | 68 [38 ; 106] | non détaillé ici (voir bilan global) | 0 |
| dont baisses d'impôts et dépenses nouvelles (Md€) | 309 [275 ; 343] | 100 [93 ; 108] | non détaillé ici | 0 |
| **Déficit restant en régime, statique (Md€ de 2025 ; déficit de 2024 de 169,1 Md€ moins la ligne précédente, avant coût des intérêts nouveaux)** | 416 [372 ; 458] | 201 [165 ; 230] | 55 [2 ; 105] (2038) ; 54 [−2 ; 108] (2041 et après) | 169 |
| **Déficit restant en régime, statique (% du PIB de 2025 : 2991 Md€)** | 13,9 [12,5 ; 15,3] | 6,7 [5,5 ; 7,7] | 1,8 [0,1 ; 3,5] (2038) ; 1,8 [−0,1 ; 3,6] (2041 et après) | 5,7 |
| Capital engagé en nationalisations, 2028-2030 (Md€, opération financière : dette, pas déficit, sauf transferts) | 129 [118 ; 140] | 0 | 0 | 0 |
| Prélèvements obligatoires, en régime (% du PIB ; 42,7 % en 2024) | 44,8 [44,0 ; 45,7] | 45,0 [44,0 ; 46,3] | 51,5 [50,2 ; 52,9] | 42,7 |
| Dépense publique, 2038 (% du PIB, intérêts compris ; 57,0 % en 2024) | 72,2 [70,8 ; 73,7] | 63,1 [62,8 ; 63,5] | 63,8 [62,4 ; 65,0] | 59,4 |
| Déficit public, 2038 (% du PIB, intérêts compris ; 5,1 % en 2025) | 18,9 [17,0 ; 20,7] | 9,6 [8,1 ; 10,8] | 3,7 [1,6 ; 5,7] | 8,2 |
| **Dette publique 2038 (% du PIB)** | 240 [225 ; 254] | 170 [158 ; 179] | 131 [118 ; 143] | 157,1 |
| **Dette publique 2058 (% du PIB)** | 503 [458 ; 548] | 276 [239 ; 306] | 122 [63 ; 176] | 240,2 |
| Dette 2038, macro prudente (croissance 2,5 %, taux 3,95 %) | 257 | 184 | 144 [130 ; 157] | 171 |
| Dette 2058, macro prudente | 603 | 341 | 166 [100 ; 227] | 300 |

Lecture. (1) Pour LFI et le Rassemblement national, l'intervalle porte sur les mesures chiffrées ligne à ligne (tirages corrélés, § 6) ; pour LFI, les quatre mesures longtemps laissées hors totaux y sont avec leurs propres fourchettes (§ 5 bis) ; l'intervalle ne couvre pas ce que les programmes feront réellement des lignes restées non chiffrées (§ 5). Pour le Rassemblement national, la borne haute de chaque économie annoncée est l'annonce du parti elle-même, et la médiane est notre estimation réalisable compte tenu des contraintes juridiques et pratiques nommées ligne par ligne (§ 5 ter) ; le Rassemblement national ne publie pas de calendrier complet de ses mesures de retraite (présentation annoncée le 17/11/2026). (2) **Pour notre système, la méthode est la même** (§ 6 ter) : chaque module du modèle (garantie de transition, fonction du patrimoine v7.5 et ses comportements, transmissions, fonction des revenus et crédit d'IS, courbe des pensions, TVA, économies, grand âge, chiffrage du 08/11, Sécurité sociale à 100 %, conversions en salaire, plancher en deux parts, outre-mer, etc.) est rejoué à ses bornes favorable et défavorable, avec les mêmes facteurs communs (comportement, coût) et les mêmes 10 000 tirages ; le niveau des leviers votés est fixe (33,3 Md€, calé au central, après correction du double compte du report d'encaissement). La valeur centrale du modèle (déterministe : 112,8 Md€ en 2038, 112,4 en 2041, dette 130,4 % en 2038 et 124,6 % en 2058) est dans le test du § 4 ; la médiane du tirage s'en écarte peu parce que les bornes ne sont pas symétriques. **L'intervalle de notre système est sous-estimé** : le socle hérité de l'architecture v5, les corrections du grand livre et l'impôt de suite sont fixés à leur valeur centrale (§ 6 ter, § 9). (3) Le « fil de l'eau » est le droit actuel : solde primaire de 2024 maintenu en part du PIB, sans consolidation ; ce n'est pas la trajectoire officielle. (4) Les prélèvements et la dépense des programmes ne contiennent pas le retour macroéconomique (§ 2). (5) « Déficit restant en régime » est une écriture statique : le déficit de 2024 (169,1 Md€ de 2025) moins l'effet des mesures ; il ne contient pas la hausse des intérêts due à une dette plus élevée, que la ligne « Déficit public, 2038 » intègre.

**Note : pourquoi +113 Md€ en 2038 ici et 113,2 Md€ dans `sources/decomposition-prelevements-0811.md`, et pourquoi le saut de 2041 a disparu (notre système).** (a) **Avant le 08/11/2026 (nuit)**, la trajectoire de nos modèles avait un saut du solde primaire de +25,0 Md€ de 2025 entre 2040 et 2041 (+0,8 point de PIB ; V32012) : l'hypothèse H537 (`dureeFlux = 12`, `Z.HYP.dureeCreance = 12`) faisait durer douze ans, de 2029 à 2040, deux reports d'encaissement hérités de la v5 (13,5 Md€ dans `Stress.pbStruct`, 11,5 Md€ dans `Decisions0511b.ajustement`), alors que la fonction du patrimoine v7.4 / v7.5 a sa propre trésorerie du différé (flux de 12,4 Md€ par an, encours de 149 Md€) : le même report était compté deux fois (V32018). (b) **Correction, décision de l'auteur du 08/11/2026, couche `CORRECTION0811`** : les deux reports hérités sont retirés, la seule trésorerie de la v7.4 est gardée, écrite comme un stock qui se rembourse de 1/12 par an (hypothèse de modélisation HC1 ; avec une durée fixe de 12 ans, un saut résiduel de 11,8 Md€ subsisterait en 2041) ; les leviers votés de S3 passent de 52,8 à 33,3 Md€ pour la même règle de dette (dette stable à partir de 2038) ; le plafond des transmissions est ramené de 60 à 50 % au-delà de 10 M€. Le banc lit l'effet de notre système en **2038**, l'année où la rampe atteint son plein régime : 112,8 Md€ en 2038 (le pic de dette du modèle est en 2037), 112,4 Md€ en 2041 : **plus de saut**. (c) **Unités** : 113,2 Md€ (décomposition des prélèvements) est écrit en euros de 2024 sans croissance, sur le PIB de 2024 ; il équivaut à 115,4 Md€ de 2025, contre 112,4 Md€ ici en 2041 (écart de 2,9 Md€ : écriture statique de régime d'un côté, trajectoire avec le coût de trésorerie du différé de l'autre). (d) **Périmètre** : les deux sont la réduction du déficit primaire par rapport au droit actuel ; ni l'un ni l'autre ne contient les intérêts supplémentaires ni le retour macroéconomique. **Conséquence pour la lecture** : il reste en déficit : environ 57 Md€ (1,9 % du PIB) en régime structurel (2041 et après), 56 Md€ (1,9 %) en 2038. La ligne « 2041 et après » du tableau est gardée pour comparer des régimes.

## 2. Relance macroéconomique, présentée à part

Principe : le résultat statique (§ 1) suppose un PIB inchangé. L'effet de relance ajoute : variation du PIB = m x dépenses nouvelles / PIB − r x m x recettes nouvelles / PIB + effet d'offre ; retour sur le solde = 45 % de la variation du PIB (part des recettes publiques dans le PIB, ⚠️ hypothèse V31008). Lois (tirage indépendant du reste) : multiplicateur des dépenses m de 0,3 à 1,5 (mode 0,8) ; rapport r du multiplicateur des recettes à celui des dépenses de 0,3 à 1,0 (mode 0,5) ; effet d'offre sur le niveau du PIB de −1,0 % à 0 (mode −0,3 %, ⚠️ sans source).

| | LFI statique | LFI avec relance | RN statique | RN avec relance | Notre système statique | Notre système avec relance |
|---|---|---|---|---|---|---|
| Effet sur le solde en régime (Md€) | −247 [−289 ; −203] | −149 [−200 ; −101] | −32 [−61 ; 4] | −15 [−39 ; 14] | 114 [64 ; 167] | 104 [64 ; 146] |
| Déficit 2038 (% du PIB) | 18,9 [17,0 ; 20,7] | 14,6 [12,5 ; 16,7] | 9,6 [8,1 ; 10,8] | 8,8 [7,6 ; 9,9] | 3,7 [1,6 ; 5,7] | 4,1 [2,4 ; 5,7] |
| Dette 2038 (% du PIB) | 240 [225 ; 254] | 207 [191 ; 224] | 170 [158 ; 179] | 163 [153 ; 171] | 131 [118 ; 143] | 135 [124 ; 144] |
| Dette 2058 (% du PIB) | 503 [458 ; 548] | 398 [347 ; 451] | 276 [239 ; 306] | 256 [226 ; 283] | 122 [63 ; 176] | 137 [92 ; 179] |

Pour notre système, les recettes nouvelles (R) montent comme la rampe du modèle jusqu'en 2038 (part (an − 2028) / 10) et les dépenses nouvelles sont déduites (D = R − effet sur le solde) : ⚠️ convention, le modèle ne publie pas la série brute des deux ; les prélèvements obligatoires passent de 42,7 % à 52,2 % du PIB (recettes nouvelles de l'ordre de 280 Md€ en régime, dont une grande part est reversée en prestations, socle et crédit d'IS). Le même effet d'offre (−1,0 % à 0 du niveau du PIB) est appliqué à tous.

Pour le Rassemblement national, la relance suppose des multiplicateurs communs aux deux programmes ; l'annexe du RN retient de son côté 2,8 points de croissance supplémentaire sur cinq ans pour 0,5 point d'effet récessif des économies, soit une asymétrie que la littérature ne valide pas selon l'Institut de l'Entreprise (note du 06/10/2026, cote C) ; le banc applique les mêmes lois à tous.

Sources des multiplicateurs : Valerie Ramey, « Ten Years after the Financial Crisis: What Have We Learned from the Renaissance in Fiscal Research? », *Journal of Economic Perspectives* 33(2), 2019, p. 89-114 (https://www.aeaweb.org/doi/10.1257/jep.33.2.89, consulté le 08/11/2026, résumé seulement) : la plupart des estimations moyennes se situent entre 0,6 et 1 pour les dépenses, avec des circonstances où les multiplicateurs sortent de cette plage (cote A, revue à comité de lecture, aucun conflit connu) ; Blanchard et Leigh (2013) : multiplicateurs sous-estimés en 2010-2011, de l'ordre de 1,5 (cité de mémoire, ⚠️ non relu, V31011) ; OFCE 2025 : un peu moins de 0,5 pour une consolidation (⚠️ non relu, V31008). La borne basse 0,3 et la borne haute 1,5 sont donc nos hypothèses encadrant ces lectures. Ramey situe les multiplicateurs de recettes entre −2 et −3 pour des changements d'impôts généraux : nous retenons un rapport r bien plus faible parce que les recettes de LFI sont concentrées sur les hauts patrimoines et les entreprises (⚠️ hypothèse, sensible).

## 3. Empilement des extrêmes (pour mémoire, non recommandé)

Chaque mesure à son pire (ou son meilleur) résultat en même temps, au centile 10 (ou 90) de ses paramètres : solde de régime **−419** à **−84** Md€ ; dette 2038 de **180 %** à **261 %**, dette 2058 de **323 %** à **642 %**. L'intervalle à 80 % du § 1 est plus étroit parce que les erreurs ne sont pas toutes du même côté en même temps ; les facteurs communs (comportement des assiettes, dérive des coûts) gardent une partie de l'ampleur (§ 7).


Notre système, même exercice : chaque module à son centile 10 (ou 90) en même temps, leviers votés inchangés : solde de 2038 de **7** à **226** Md€ ; dette 2038 de **102 %** à **159 %**, dette 2058 de **−0 %** à **235 %** (négative : la dette serait remboursée). Les scénarios d'ensemble « bas » et « haut » du modèle, qui mêlent des postes de l'ancienne architecture remplacés par des couches, donnent un solde primaire de 2038 de −214 à 203 Md€ (central 9) : ils ne sont pas utilisés ici, mais ils disent que le socle hérité, non propagé, pèse potentiellement plus que tous les modules propagés (§ 9).

## 4. Test de validité du moteur sur notre propre système

Le moteur refait la chaîne dette à partir de la trajectoire de solde primaire exportée par nos modèles (S3, `correction_0811.js`) : même dette de départ, même macro, même récursion que `modeles/systeme-ideal/`, écrite à part en Python.

| Cas | Dette 2038 : moteur | modèle | Dette 2058 : moteur | modèle |
|---|---|---|---|---|
| Notre système, macro de référence | 130,35 % | 130,35 % | 124,60 % | 124,60 % |
| Notre système, macro prudente | 143,36 % | 143,36 % | 169,30 % | 169,30 % |
| Droit actuel, macro de référence | 157,12 % | 157,12 % | 240,24 % | 240,24 % |
| Droit actuel, macro prudente | 170,99 % | 170,99 % | 300,13 % | 300,13 % |

**Résultat : le moteur retrouve 130,4 % en 2038 et 124,6 % en 2058 (écart inférieur à 0,001 point).** Portée exacte de ce test : il valide la chaîne dette (solde primaire → intérêts → dette, macro, dette de départ) et le branchement sur l'export de nos modèles ; il ne valide pas les leviers eux-mêmes, que le moteur lit dans le modèle pour notre système au lieu de les recalculer (le modèle de notre système est le même code que celui qui chiffre la fonction du patrimoine, les transmissions et les retraites utilisés pour LFI). Les bornes de chaque module viennent du même code (`js/pont_incertitudes.js`), pas d'un recalcul indépendant.

**Même test, avec le tirage de notre système.** Tous les modules à leur valeur centrale (écarts nuls) redonnent exactement le modèle : solde de 2038 112,8 Md€, dette 2038 **130,35 %**, dette 2058 **124,60 %**. La médiane des 10 000 tirages donne 114,5 Md€, **130,56 %** et **121,88 %** : écart de 0,21 point en 2038 et de −2,72 point en 2058 ; il est attendu, parce que les bornes de nos modules ne sont pas symétriques autour du central (la médiane d'une somme de lois asymétriques n'est pas la somme des médianes). Le test passe si la médiane reste à moins de 1 point de dette 2038 de la valeur centrale (`tests/test_banc.py`).

## 5. Ce qui est branché sur nos modèles, et ce qui est encore grossier

Ponts utilisés pour cette exécution : modèles JavaScript = cache ; retraites = cache ; OpenFisca = cache ; démographie = cache ; Smic (OpenFisca) = cache ; pension minimale (CSV DREES) = cache (le cache versionné `donnees/cache/` est relu si le moteur n'est pas disponible).

| Levier | Branché sur | Mesures de LFI |
|---|---|---|
| cout_unitaire | montant du programme ou ordre de grandeur (voir l'ancrage) | D01, D02, D03, D04, D06, D07, D08, D10, D11, D12, D13, D14, D15, D16, D17b, D18, D22, D23, D24, R01b, R02, R03, R06, R07, R08, R09, R10, R11, R12 |
| retraites_age | modeles/retraites/age_libre.js (jsc) : cohortes, mortalité, pension, recettes perdues ; cohorte recalée par modeles/demographie/ (Python) | D05 |
| produit | coût unitaire sourcé x quantité sourcée (DEPP, DREES, Insee, modèle) | D09, D17a, D19, D20, D21, D25 |
| isf | modeles/systeme-ideal/grandes_fortunes_0511.js : patrimoine, érosion, exil | R01a |
| plancher | modeles/systeme-ideal/grandes_fortunes_0511.js : patrimoine, érosion, exil | R04 |
| succession | modeles/systeme-ideal/transmissions_0611.js : loi du cumul reçu, comportements | R05 |
| ir_openfisca | OpenFisca-France 176.1.10 (venv) : impôt sur le revenu, population de foyers types | R13 |
| smic | leviers2.py : lognormale des salaires + grille OpenFisca-France (cotisations, allègement, impôt, prime d'activité) par foyer type | S01 |
| pension_min | leviers2.py : distribution DREES (EIR 2020, carrières complètes) via modeles/retraites/donnees/ | P01 |
| carburant | leviers2.py : volume SDES/UFIP x écart au plafond, marges absorbables | C01 |
| nationalisation | leviers2.py : prix (capitalisation x prime), dette (opération financière), dividendes | N01, N02, N03, N04, N05, N06 |

Programme du Rassemblement national : retraites (D01) : `retraites_age` ; exonération d'IR des moins de 30 ans (T08) : `ir_jeunes` (OpenFisca) ; impôt sur la fortune financière (F02) : `iff` (module patrimoine) ; toutes les autres lignes : montant du programme ou économie annoncée bornée par une contrainte juridique ou pratique (`cout_unitaire`, loi `med`). Aucun modèle du dépôt ne chiffre encore la TVA (taux réduits), la fraude ou l'immigration : ces lignes sont des ordres de grandeur sourcés ou marqués comme tels.

Lignes encore grossières (ordre de grandeur sans source primaire lue ; leur effet sur la conclusion est testé au § 7) : D06, D11, D15, D16, D17b, D18, D20, D22, D23, D24, R01b. Les plus lourdes en médiane : D20 (10,9 Md€), D15 (7,7 Md€), D22 (7,6 Md€), D24 (5,5 Md€), D11 (5,4 Md€). Lignes non chiffrées, hors totaux : exonérations de cotisations supprimées au-dessus de 2 SMIC; cotisation sociale universelle (fusion avec la CSG); dettes perpétuelles à taux nul (BCE) : hors champ budgétaire; pôle public du médicament et nationalisation de filiales critiques (inclus dans D24 sans prix).

Sourcées dans cette version (nombre de bénéficiaires, coûts unitaires, cote A à C) : D09 (DEPP), D17a (crèches), D19 (DREES, AAH), D20 (nombre d'emplois : Insee, inscrits à France Travail ; coût net par emploi : encore grossier), D21 (masse salariale), D08 (Ségur). Encore sans source primaire : D06, D11, D15, D16, D17b, D18, D22, D23, D24, D25 (coût mensuel), R01b.

## 5 bis. Quatre mesures ajoutées le 08/11/2026 (Smic, pension minimale, carburants, nationalisations)

Ces mesures étaient hors des totaux ; elles y sont désormais (§ 1 et § 6). Tirages propres à cette décomposition (2 000, graine + 1) ; médiane [centiles 10 ; 90] ; Md€ par an en régime sauf mention ; effet sur le solde = recettes moins dépenses. Citations, liens, interprétation écrite et hypothèses cotées : `programmes/lfi/mesures.py` (S01, P01, C01, N01 à N06) ; code : `leviers2.py` (fonctions pures, testées).

### Smic à 1 700 € net (S01)

| Composante (régime) | Médiane [p10 ; p90] |
|---|---|
| Masse salariale brute en plus, secteur privé (Md€) | 11,4 [9,9 ; 13,0] |
| Coût net pour les employeurs privés, après allègements (Md€, **non compté** dans le solde) | 2,8 [−4,6 ; 13,6] |
| Hausse des allègements généraux (Md€, formule en Smic ; base : 33 Md€ en 2025 dans le modèle) | 12,3 [1,8 ; 19,9] |
| Recettes publiques nettes avant l'emploi (cotisations, CSG, impôt, moins prime d'activité, moins allègements) (Md€) | −2,0 [−9,5 ; 8,6] |
| Emplois perdus (milliers d'ETP) | 91 [37 ; 196] |
| Dépenses : agents publics ; secteurs financés ; contrats aidés (Md€) | 0,6 [0,4 ; 0,9] ; 1,8 [1,1 ; 2,5] ; 0,15 [0,11 ; 0,20] |
| Coût de l'emploi perdu : recettes, allocations (Md€) | 0,44 [0,16 ; 1,14] ; 0,7 [0,3 ; 1,6] |
| **Effet sur le solde** | **−5,9 [−12,7 ; 3,6]** |
| Variante : les allègements suivent le Smic (droit actuel) | −14,0 [−16,2 ; −12,2] (emplois perdus : 35 [15 ; 64] milliers) |
| Variante : le barème des allègements est gelé en euros | 10,1 [7,9 ; 12,5] (emplois perdus : 234 [127 ; 355] milliers) |

Lecture. (1) **Estimation, pas un fait** : l'effet public dépend surtout d'un choix que le programme ne fait pas, l'indexation des allègements : tant que la formule reste exprimée en Smic, une hausse de 17,8 % du Smic augmente les allègements de tous les salariés jusqu'à 1,6 Smic, y compris de ceux dont le salaire ne bouge pas (aubaine pour les employeurs, coût pour l'État et la Sécurité sociale) ; si elle est gelée, les recettes montent mais le coût du travail au Smic monte de 17,8 % et l'emploi perdu est plusieurs fois plus grand. Le programme supprime en outre les exonérations au-dessus de 2 Smic (ligne non chiffrée). (2) Recoupements de l'emploi (sources de la ligne S01, H-SMIC-4) : OFCE 2024 environ 2 300 emplois par point de Smic (soit environ 41 000 pour +17,8 %) ; Institut Montaigne 230 000 à 380 000 pour +14,4 % ; IFRAP 240 000 pour 1 600 € net. Notre fourchette couvre la première et approche les deux autres seulement si les allègements sont gelés. (3) Limites : foyers types (pas de micro-données), aides au logement non modélisées (leur baisse améliorerait le solde public), TVA induite non comptée (pour ne pas doubler le multiplicateur du § 2 : de l'ordre de 1 à 2 Md€ au plus), élasticité d'emploi tirée de la littérature sur des hausses beaucoup plus petites (extrapolation hors échantillon, ⚠️), salaires de 1 à 1,3 Smic par diffusion (⚠️ non relu).

### Pension minimale au niveau du Smic (P01)

| Composante | Médiane [p10 ; p90] |
|---|---|
| Retraités à carrière complète sous le seuil (millions) | 4,2 [3,6 ; 4,9] |
| Part des carrières complètes sous le seuil | 41 [35 ; 48] % |
| Coût du complément de pension (Md€) | 21,0 [16,1 ; 27,9] |
| Interaction avec le minimum vieillesse porté à 1 337 € (net, Md€) | 2,1 [1,4 ; 3,0] |
| **Coût total** | **23,2 [18,3 ; 30,1]** |

Lecture. Fait sourcé : distribution des pensions nettes des carrières complètes (DREES, EIR 2020, ramenée à 2025 par l'homothétie du modèle des retraites). Estimation : le texte ne fixe ni montant ni date ; trois lectures du « niveau du Smic » encadrent le coût (voir la ligne P01 de `mesures.py`) ; la montée est en trois ans à partir de 2028. Limites : homothétie sans effet de noria (les nouveaux retraités ont de meilleures pensions : le coût est légèrement surestimé), part de carrières complètes issue de la DREES par génération, interaction avec l'ASPA estimée sans source primaire (⚠️). Ne comprend pas le coût de la retraite à 60 ans (D05).

### Blocage du prix des carburants à 1,70 € (C01)

| Composante | Médiane [p10 ; p90] |
|---|---|
| Écart du prix de marché au plafond (€ par litre) | 0,27 [0,09 ; 0,49] |
| Volume plafonné (milliards de litres) | 38,4 [25,8 ; 46,2] |
| Coût du blocage, total (Md€) | 9,9 [3,1 ; 18,9] |
| dont supporté par les marges des raffineurs et distributeurs (Md€, privé) | 5,2 [2,4 ; 8,8] |
| **dont à la charge du budget (compensation)** | **3,9 [0,0 ; 12,3]** |

Lecture. Le coût est l'écart entre le prix de marché et le plafond, fois le volume : il vaut zéro si le pétrole redescend au niveau d'avant la guerre au Moyen-Orient (1,70 €) et monte à 25-30 Md€ si les prix d'octobre 2026 (2,14 € pour l'essence, 2,36 € pour le gazole) durent. Précédent : la remise de 2022 a coûté 7,5 à 8 Md€. Le prix de marché de 2028 à 2032 est un scénario sans source ; l'hypothèse que l'État comble ce que les marges n'absorbent pas est la nôtre (sans cela, l'offre disparaît) ; le programme parle d'un plafond et d'un encadrement des marges, pas de subvention.

### Nationalisations (N01 à N06)

| Opération | Prix payé (Md€) | Flux annuel en régime (Md€ ; + = dividendes) | Transfert en capital (Md€, déficit) |
|---|---|---|---|
| SNCF | 1,0 [0,4 ; 2,2] | 0,00 | 0,0 |
| Autoroutes | 40,2 [31,7 ; 48,6] | 4,77 [3,60 ; 6,14] | 0,0 |
| Aéroports stratégiques | 10,0 [8,7 ; 11,6] | 0,31 [0,24 ; 0,41] | 0,0 |
| Engie | 61,6 [56,6 ; 66,8] | 2,88 [2,42 ; 3,40] | 0,0 |
| ArcelorMittal France | 1,6 [0,9 ; 2,4] | −0,51 [−0,89 ; −0,22] | 0,0 |
| EHPAD lucratifs | 14,7 [9,9 ; 19,7] | 0,00 | 6,9 [3,0 ; 12,2] |
| **Total (capital engagé)** | **129 [118 ; 140]** | | |

Lecture. Traitement en comptabilité nationale : l'achat de titres ou d'actifs est une **opération financière** : il augmente la dette brute (par l'emprunt) mais pas le déficit ; le rendement (dividendes) améliore le solde, et l'emprunt coûte 3,45 % au taux de marché de référence. Sont une dépense (déficit) : les pertes reprises (ArcelorMittal) et la part des EHPAD cédée gratuitement aux associations. Les entreprises acquises restent hors administrations publiques tant qu'elles sont des producteurs marchands ; un reclassement ajouterait leur dette à la dette publique (⚠️ non modélisé). Droit : indemnité « juste et préalable » (article 17 de la Déclaration de 1789 ; premier protocole additionnel à la CEDH), donc prix de marché, pas moins ; SNCF déjà publique à 100 % ; le quatrième paquet ferroviaire limite la renationalisation du réseau concurrentiel (droit de l'UE). Les valeurs (Engie, ADP) sont des capitalisations de 2026 lues par moteur de recherche, la participation actuelle de l'État à confirmer (⚠️).

Effet sur les totaux : les nationalisations ajoutent le capital engagé à la dette de 2028 à 2030 (en Md€ de 2025, indexé sur le PIB nominal) ; les mesures S01, P01 et C01 sont dans le solde de régime du § 1.

## 5 ter. Rassemblement national : ce qui est annoncé et ce qui est réalisable (régime, Md€ par an ; + améliore le solde)

| Thème | Annoncé par le RN (régime ; recettes et économies − baisses d'impôts et dépenses) | Notre estimation : médiane [centiles 10 ; 90] | Contraintes juridiques et pratiques principales |
|---|---|---|---|
| Baisses d'impôts | −50,0 | −51,9 [−57,7 ; −46,9] | coût certain une fois votée (baisse d'impôt ou dépense) |
| Retraites | −9,5 | −28,7 [−37,6 ; −21,3] | coût certain une fois votée (baisse d'impôt ou dépense) |
| Familles | −5,1 | −5,1 [−5,9 ; −4,2] | coût certain une fois votée (baisse d'impôt ou dépense) |
| Famille et santé | −4,5 | −5,2 [−6,3 ; −4,5] | coût certain une fois votée (baisse d'impôt ou dépense) |
| Sécurité et divers | −7,6 | −8,5 [−10,1 ; −7,4] | coût certain une fois votée (baisse d'impôt ou dépense) |
| Recettes nouvelles | 50,2 | 6,5 [−2,1 ; 41,2] | Art. 63 TFUE; Constitution; Directive 2006/112/CE : tout mécanisme dérogatoire; Droit de l'UE; Pas de contrainte juridique propre |
| Immigration | 22,8 | 5,1 [1,4 ; 19,1] | Alinéa 11 du préambule de 1946; Constitution; Droit d'asile |
| Union européenne | 15,3 | 1,1 [0,2 ; 9,1] | Décision; Traités |
| État et opérateurs | 34,5 | 8,5 [3,8 ; 29,2] | Autonomie financière des assemblées; Libre administration et autonomie financière des collectivités; Pratique; Pratique : suppression des missions ou transfert aux administrations |
| Collectivités | 10,4 | 2,9 [1,0 ; 8,9] | Constitution art. 72; Constitution art. 72 et 72-2 |
| Sécurité sociale | 47,0 | 12,5 [5,0 ; 40,1] | Alinéa 11 du préambule de 1946; Constitution; Pratique |
| Énergie | 15,0 | 1,6 [0,3 ; 12,3] | Contrats en cours; Directive |
| Sans effet sur le déficit | 21,7 | 0,0 [0,0 ; 0,0] | coût certain une fois votée (baisse d'impôt ou dépense) |
| Mesures du PLF retenues | 3,6 | 3,0 [2,2 ; 3,5] | coût certain une fois votée (baisse d'impôt ou dépense) |
| **Somme** | **144** | **−58** (somme de médianes ; médiane de la somme au § 1 : −32) | |

Lecture. (1) **Fait** : le Rassemblement national annonce 140 Md€ d'économies nettes en 2032 par rapport à 2026 (Public Sénat, 06/10/2026) ; son annexe affiche une amélioration nette du solde de 71,6 Md€ en 2027 et 141,7 Md€ en 2031 (Institut de l'Entreprise, d'après les diapositives 11, 19 et 26 du dossier de presse, non lues par nous) ; la somme des annonces lignes par lignes reprises ici (2027 pour les baisses d'impôts et dépenses, 2031 pour les économies quand elle est connue) est de 144 Md€, du même ordre. (2) **Estimation** : notre médiane est la somme de ce que chaque ligne peut raisonnablement produire dans le droit actuel (Constitution, droit de l'UE, CEDH, traités) et dans la pratique ; la borne haute de chaque ligne est l'annonce du RN elle-même. Elle dépend de jugements écrits ligne par ligne (`programmes/rn/mesures.py`, champs `interpretation` et `contrainte`) et peut être contestée ; l'ordre de grandeur est recoupé : l'Institut de l'Entreprise (cote C, financé par des entreprises) trouve 7,5 Md€ d'amélioration nette en 2031 (de −25 à +50) en retenant à 50 % les lignes « sans mode opératoire » et à 0 les lignes juridiquement fragiles. La médiane de la somme (§ 1) est supérieure à la somme des médianes parce que les lois des économies sont asymétriques (médiane = notre estimation, borne haute = annonce du RN) : la moyenne d'une loi de ce type est au-dessus de sa médiane. (3) Ce que le banc ne contient pas : la suppression des 120 taxes et la baisse du nombre d'agents (aucun montant) ; les règles du référendum sur l'immigration et la règle d'or (cadre) ; la réforme des retraites au-delà de son âge de départ (texte annoncé le 17/11/2026).

Sources principales : dossier « Contre-budget 2027 » du groupe RN (octobre 2026, cote D, auteur = le programme) ; Institut de l'Entreprise, 06/10/2026 (cote C) ; Public Sénat, 06/10/2026 ; Acteurs publics ; Localtis (Banque des Territoires), 15/10/2026 ; décisions du Conseil constitutionnel et de la CJUE (via billet d'avocat, à relire en primaire). Liens, cotes et conflits d'intérêts ligne par ligne : `programmes/rn/mesures.py`.

## 6 bis. Détail par mesure du Rassemblement national (effet sur le solde en régime, Md€ : médiane [centiles 10 ; 90])

| N° | Mesure | Annoncé (régime) | Effet | Levier | Contrainte |
|---|---|---|---|---|---|
| T01 | TVA à 5,5 % sur les énergies (gaz, électricité, carburants, bois, fioul) | −12,2 | −11,5 [−13,5 ; −9,0] | cout_unitaire |  |
| T02 | TVA à 0 % sur 100 produits de première nécessité | −3,5 | −4,1 [−5,1 ; −3,5] | cout_unitaire |  |
| T03 | Suppression de la CFE (8,1), de la CVAE (3,7) et de la C3S (5,3) | −17,1 | −17,3 [−18,0 ; −16,9] | cout_unitaire |  |
| T04 | Suramortissement industriel et agricole (2,1), pacte Dutreil modifié (1,75), octroi de mer (1,8), autres taxes (0,8) | −6,5 | −6,7 [−7,1 ; −6,4] | cout_unitaire |  |
| T05 | Retour de la TICPE au niveau de 2017 | −3,9 | −4,0 [−4,3 ; −3,8] | cout_unitaire |  |
| T06 | Retour du prélèvement forfaitaire unique à 30 % (annulation de la hausse de 1,4 point) | −1,5 | −1,5 [−1,6 ; −1,5] | cout_unitaire |  |
| T07 | Demi-part pour veufs et veuves, prime d'activité étudiante, successions (immobilier jusqu'à 300 k€) et donations | −3,3 | −3,4 [−3,6 ; −3,2] | cout_unitaire |  |
| T08 | Exonération d'impôt sur le revenu des actifs de moins de 30 ans jusqu'à 4 Smic | −2,0 | −3,4 [−4,6 ; −2,5] | ir_jeunes |  |
| D01 | Retraite : âge légal à 62 ans, durée de 42 annuités, départ à 60 ans pour les entrées précoces (réforme de Marine Le Pen) | −9,5 | −24,1 [−31,1 ; −18,4] | retraites_age |  |
| D02 | Exonération de cotisations retraite et chômage des salariés les plus âgés (annonce du 27/08/2026, non chiffrée dans le contre-budget) | −0,0 | −4,6 [−6,5 ; −2,9] | cout_unitaire |  |
| D03 | Part fiscale pleine dès le deuxième enfant ; prêt jeunes ménages transformé en subvention au troisième enfant | −5,1 | −5,1 [−5,9 ; −4,2] | cout_unitaire |  |
| D04 | Remboursement à 100 % des soins dentaires (1,4), congé de proche aidant (2,0), AAH au-dessus du seuil de pauvreté (0,95), cumul emploi-retraite des soignants (0,2) | −4,5 | −5,2 [−6,3 ; −4,5] | cout_unitaire |  |
| D05 | 30 000 places de prison (1,0), permis de conduire gratuit pour les jeunes (0,7), recherche (1,8), outre-mer (0,6), fonds vert (0,1), SDIS (0,4), mesures sectorielles du programme présidentiel (3,0) | −7,6 | −8,5 [−10,1 ; −7,4] | cout_unitaire |  |
| F01 | Taxe sur les rachats d'actions | 0,3 | 0,1 [0,0 ; 0,3] | cout_unitaire |  |
| F02 | Impôt sur la fortune financière (IFF) en remplacement de l'IFI | 5,0 | −0,5 [−3,9 ; 3,8] | iff |  |
| F03 | Impôt sur les sociétés assis en partie sur le chiffre d'affaires (mécanisme de correction) | 7,5 | 1,1 [0,2 ; 6,2] | cout_unitaire | Constitution (égalité devant les charges publiques, art. 13 de la Déclaration de 1789), droit de l'UE (directive mère-fi |
| F04 | Taxe sur les superdividendes (0,75), amendes et récupération d'aides (0,6) | 1,4 | 0,7 [0,3 ; 1,2] | cout_unitaire | Droit de l'UE (libertés de circulation, directive mère-fille) pour la taxe sur les dividendes |
| F05 | Autorité de la concurrence et cartels des marchés publics | 7,0 | 0,8 [0,2 ; 5,7] | cout_unitaire | Pas de contrainte juridique propre ; contrainte pratique : rendement des contrôles non garanti |
| F06 | Prélèvement de la TVA à la source (retenue à la source entre entreprises) | 18,0 | 1,5 [0,3 ; 14,6] | cout_unitaire | Directive 2006/112/CE : tout mécanisme dérogatoire (paiement scindé, autoliquidation généralisée) requiert une décision  |
| F07 | Autres recettes (redevances, timbres, banques et numériques, régularisation de rapatriés fiscaux hors flux, casseur-payeur, éolien, niche des journalistes, biogaz) | 2,2 | 1,0 [0,4 ; 2,0] | cout_unitaire | Droit de l'UE (directive services numériques, aides, libre prestation) pour la contribution des géants du numérique |
| F08 | Taxe de 1 000 € par an à l'embauche d'un salarié extra-européen | 1,0 | 0,2 [0,0 ; 0,8] | cout_unitaire | Constitution (égalité), directives 2003/109/CE et 2011/98/UE (égalité de traitement en matière d'accès à l'emploi), art. |
| F09 | Taxation à 14 % des transferts d'argent vers les pays tiers | 1,9 | 0,6 [0,1 ; 1,6] | cout_unitaire | Art. 63 TFUE (libre circulation des capitaux, y compris vers les pays tiers, sauf clauses de sauvegarde), Constitution ( |
| I01 | Prestations de solidarité réservées aux étrangers ayant travaillé au moins cinq ans (équivalents temps plein) | 12,2 | 2,0 [0,4 ; 10,0] | cout_unitaire | Constitution (égalité ; décision 2024-6 RIP), CEDH art. 14 + 1er protocole art. 1, directive 2003/109/CE (CJUE C-112/22) |
| I02 | Prestations familiales réservées aux foyers dont un parent est français | 5,9 | 1,0 [0,2 ; 4,9] | cout_unitaire | Constitution (égalité), CEDH (Niedzwiecki c. Allemagne, Okpisz c. Allemagne : discrimination fondée sur la nationalité p |
| I03 | Aide médicale d'État remplacée par une aide médicale d'urgence (AME → AMU) | 1,1 | 0,5 [0,1 ; 1,0] | cout_unitaire | Alinéa 11 du préambule de 1946 (protection de la santé), principe de dignité ; pas d'obstacle constitutionnel certain |
| I04 | Asile, visa pour soins, départs, frais de scolarité des étudiants étrangers, effet indirect sur l'insécurité | 3,6 | 1,6 [0,7 ; 3,2] | cout_unitaire | Droit d'asile (Constitution, directive procédures 2013/32/UE), directive 2004/38/CE pour les citoyens européens (départs |
| U01 | Baisse unilatérale de la contribution de la France au budget de l'Union européenne | 13,1 | 0,9 [0,2 ; 7,3] | cout_unitaire | Traités (art. 311 TFUE : ressources propres arrêtées à l'unanimité, approbation par les États membres selon leurs règles |
| U02 | Restitution à la France de sa part des droits de douane collectés par l'UE | 2,2 | 0,2 [0,0 ; 1,8] | cout_unitaire | Décision (UE, Euratom) 2020/2053, art. 311 TFUE |
| A01 | Suppression et réinternalisation des agences et opérateurs | 10,1 | 1,5 [0,7 ; 8,3] | cout_unitaire | Pratique : suppression des missions ou transfert aux administrations ; Constitution pour les établissements à garanties  |
| A02 | Aide publique au développement et action extérieure (2,1), subventions aux associations hors intérêt général (2,0), train de vie des institutions (0,54) | 4,6 | 3,0 [1,6 ; 4,3] | cout_unitaire | Autonomie financière des assemblées (ordonnance 58-1100) pour le « train de vie » ; périmètre des subventions non défini |
| A03 | Logement social et aides au logement (3,2 + 1,0), chèques apprentissage (1,6), parc immobilier de l'État (1,0 ; 5,1 en 2031), autres (audiovisuel public, presse, politique de la ville, France Compétences : 1,9) | 12,8 | 3,5 [1,5 ; 11,0] | cout_unitaire | Pratique ; libre administration des collectivités pour la taxe foncière |
| A04 | Transferts entre administrations : écrêtement de la TVA des collectivités (3,4), cotisation CNRACL (1,0 ; 3,2 en 2031), FCTVA (0,4) | 7,0 | 0,5 [0,1 ; 5,6] | cout_unitaire | Libre administration et autonomie financière des collectivités (art. 72-2 de la Constitution) |
| K01 | Effectifs locaux, 35 heures, compétences strictes, suppression des EPCI et des métropoles | 8,4 | 2,4 [0,9 ; 7,2] | cout_unitaire | Constitution art. 72 et 72-2 (libre administration ; ressources propres) ; loi de 2019 sur le temps de travail territori |
| K02 | Baisse des dépenses des collectivités vers les associations hors intérêt général | 2,0 | 0,5 [0,1 ; 1,7] | cout_unitaire | Constitution art. 72 (libre administration) |
| H01 | Coûts hospitaliers et parcours de soins | 8,3 | 2,0 [0,8 ; 7,1] | cout_unitaire | Pratique ; ONDAM fixé chaque année par la loi de financement |
| H02 | Lutte contre les dépenses indues et le travail dissimulé | 9,5 | 1,5 [0,5 ; 7,9] | cout_unitaire | Pratique (rendement des contrôles) ; RGPD et Constitution pour la carte vitale biométrique ⚠️ |
| H03 | Rationalisation des affections de longue durée et arrêts longs | 3,0 | 1,0 [0,2 ; 2,6] | cout_unitaire | Alinéa 11 du préambule de 1946 (protection de la santé) ; pratique |
| H04 | « Réparation du système de retraite actuel » (corrections de mesures « injustes ou inefficaces ») | 15,0 | 3,0 [0,6 ; 12,6] | cout_unitaire | Constitution (protection des droits acquis limitée ; Conseil constitutionnel admet des réformes de retraite), pas d'obst |
| H05 | Systèmes d'information et gouvernance de la Sécurité sociale (ASU, rapport Mélin), fusion Urssaf-DGFiP | 2,3 | 1,0 [0,4 ; 2,0] | cout_unitaire | Pratique |
| H06 | Autres économies de protection sociale (kiné en accès direct, médicaments à l'unité, imagerie, biologie, cartes vitales, APA, AAH, rupture conventionnelle, pointage France Travail, mécénat…) | 8,9 | 4,0 [2,4 ; 7,9] | cout_unitaire | Pratique ; liberté contractuelle pour la rupture conventionnelle (Constitution, art. 4 de la Déclaration de 1789) ⚠️ |
| G01 | Prix national de l'électricité : suppression des tarifs préférentiels pour les énergies intermittentes | 9,3 | 0,8 [0,2 ; 7,6] | cout_unitaire | Contrats en cours (Constitution : garantie des droits, art. 16 de la Déclaration de 1789 ; droit de l'UE : aides d'État  |
| G02 | Dividendes d'EDF (exportation du surplus d'électricité, 3,7), TURPE (2,0), redevance sur le marché historique (0,8, voir F07) | 5,7 | 0,8 [0,2 ; 4,7] | cout_unitaire | Directive (UE) 2019/944 (indépendance du régulateur) ; pratique (interconnexions) |
| G03 | Écritures sans effet sur le déficit : rebudgétisation des certificats d'économie d'énergie (8,0) et de production de biogaz (1,3), bons du Trésor à intérêt précompté (4,2) | 13,5 | 0,0 | cout_unitaire |  |
| G04 | Retours dynamiques comptés dans l'annexe : retour d'IS (4,3), retour de TVA (2,6), économie sur le coût de la dette (1,3) | 8,2 | 0,0 | cout_unitaire |  |
| G05 | Réforme de MaPrimeRénov' (« 100 % Rénov' ») et plan « 100 % Clim' » : solde annoncé | 5,9 | 1,0 [0,2 ; 4,9] | cout_unitaire |  |
| R30 | Mesures du PLF/PLFSS 2027 du gouvernement conservées par le RN | 3,6 | 3,0 [2,2 ; 3,5] | cout_unitaire |  |

## 6. Détail par mesure de LFI (effet sur le solde en régime, Md€ : médiane [centiles 10 ; 90])

| N° | Mesure | Effet | Levier | Interprétation (extrait) |
|---|---|---|---|---|
| D01 | Point d'indice +10 % (compensation des collectivités) | −19,8 [−20,3 ; −19,1] | cout_unitaire | +10 % de la valeur du point pour les trois versants de la fonction publique ; coût d'un point = 2,0 Md€ (notre modèle, HDS17, défense exclue), de 1,85 à 2,07 selon la pre |
| D02 | Indexation des pensions, allocations familiales, APL ; APL +10 % | −8,5 [−9,5 ; −7,7] | cout_unitaire |  |
| D03 | Logements d'urgence, réquisition | −3,2 [−3,6 ; −2,9] | cout_unitaire |  |
| D04 | Garantie d'autonomie : jeunes, puis chaque personne au seuil de pauvreté (1 337 €) | −20,4 [−25,8 ; −14,5] | cout_unitaire | Bas : seulement les jeunes (9,5 Md€, document de LFI) |
| D05 | Retraite à 60 ans à taux plein pour 40 annuités (abroge la réforme de 2023, supprime la décote) | −55,1 [−69,0 ; −43,4] | retraites_age | Branché sur modeles/retraites/age_libre.js (cohortes, mortalité, pension sans décote, recettes perdues d'activité) |
| D06 | Assurance chômage : abrogation des réformes puis droits élargis | −4,3 [−5,2 ; −3,5] | cout_unitaire | Bas : montant de LFI ; haut : droits élargis (nombre d'allocataires et durée), sans source primaire lue. |
| D07 | « 100 % Sécu » : soins pris en charge à 100 %, fin des franchises, arrêts maladie à 100 % sans carence | −30,4 [−35,7 ; −25,3] | cout_unitaire | Non chiffré par LFI |
| D08 | Hôpital et soin : recrutements, revalorisations | −7,5 [−10,0 ; −5,0] | cout_unitaire | Haut : l'ordre de grandeur du Ségur de la santé (environ 12 Md€ par an en 2022 selon la presse ; 7,2 Md€ d'aides versées aux établissements cumulées en 2022 selon la Cour |
| D09 | Éducation : postes supplémentaires (23 à 19 élèves par classe) | −6,4 [−8,2 ; −5,1] | produit | Passer de 23 à 19 élèves par classe = +21 % de classes |
| D10 | Cantine scolaire gratuite | −3,8 [−4,3 ; −3,5] | cout_unitaire |  |
| D11 | Université : gratuité, 250 000 places, Crous, immobilier | −5,4 [−6,8 ; −4,3] | cout_unitaire | Bas : montant de LFI ; haut sans source primaire lue (⚠️ V31007). |
| D12 | Violences sexistes et sexuelles (2,6) et violences faites aux enfants (2) | −4,9 [−5,5 ; −4,4] | cout_unitaire |  |
| D13 | Rattrapage des budgets 2026, indexés sur l'inflation (travail, culture, sport, diplomatie, aide au développement) | −7,4 [−8,3 ; −6,8] | cout_unitaire |  |
| D14 | Planification écologique (État) : rénovation de 700 000 logements par an, bâtiments publics, sécurité civile | −24,4 [−31,4 ; −16,6] | cout_unitaire | Bas : 10 Md€ (document de LFI) ; haut : 37 Md€ (Pisani-Ferry et Mahfouz, cité par LFI, besoin public de la transition) ; central : milieu. |
| D15 | Pôle public bancaire : 100 Md€ par an investis ; part supportée par l'État | −7,7 [−14,5 ; −3,2] | cout_unitaire | LFI : aucun effet au déficit |
| D16 | Logement public : 200 000 par an (environ la moitié aujourd'hui) + 30 000 logements jeunes | −4,5 [−6,5 ; −3,1] | cout_unitaire | Aide à la pierre par logement x 100 000 logements en plus par an, sans source lue. |
| D17a | Petite enfance : 500 000 places d'accueil | −8,3 [−9,1 ; −7,6] | produit | 500 000 places x coût public par place : 14 000 € (6,6 Md€ publics pour 470 000 places de crèche) à 19 450 € (coût moyen par place). |
| D17b | Gratuité des crèches publiques (perte des participations familiales) | −1,6 [−2,4 ; −1,0] | cout_unitaire | Participations des familles aux crèches publiques : ordre de grandeur sans source lue. |
| D18 | Dépendance : 10 000 places publiques par an pendant 5 ans, domicile en Sécu, statut d'aidant | −2,8 [−4,0 ; −1,8] | cout_unitaire | Sans source primaire lue ; notre modèle grand-age (modeles/grand-age/) chiffre un autre dispositif. |
| D19 | AAH portée à hauteur du SMIC | −8,0 [−9,2 ; −6,8] | produit | 1,40 M de bénéficiaires x écart mensuel entre le niveau visé et l'AAH x 12 x part qui reçoit l'allocation à taux plein |
| D20 | Garantie d'emploi (chômeurs de longue durée, au moins au SMIC revalorisé), nette des allocations évitées | −10,9 [−17,3 ; −6,8] | produit | Nombre d'emplois créés x coût net par emploi (coût employeur au SMIC moins allocations évitées, cotisations et impôts retournés) |
| D21 | Sixième semaine de congés payés (part employeur public) | −3,9 [−6,1 ; −1,8] | produit | Masse salariale publique (370 Md€, modèle) x une semaine sur 47 travaillées x part des heures remplacées (0 à 100 %) |
| D22 | Gratuité de l'école hors cantine, repas Crous à 1 €, culture à 1 % du PIB, sport | −7,6 [−12,3 ; −4,3] | cout_unitaire | Culture à 1 % du PIB : écart au niveau actuel (non lu) ; le reste sans source. |
| D23 | Collectivités : DGF indexée, taxe d'habitation progressive, moratoires de fermeture, services itinérants, outre-mer | −3,8 [−6,1 ; −2,2] | cout_unitaire | Sans source lue. |
| D24 | Centres de santé publics, pôle public du médicament, psychologues remboursés | −5,5 [−8,1 ; −3,5] | cout_unitaire | Sans source lue. |
| D25 | Service citoyen de neuf mois rémunéré au SMIC | −6,8 [−11,0 ; −3,8] | produit | Le texte ne dit pas si le service est obligatoire |
| R01a | ISF rétabli et renforcé (volet climatique non modélisé), net de l'IFI actuel | 2,2 [−5,8 ; 14,1] | isf | Montant de LFI : 10 Md€ (document budgétaire du 14/10/2026, « ISF climatique » ; l'ancien an1 de 19 additionnait à tort l'ISF, 10, et la flat tax, 9 : corrigé le 08/11/20 |
| R01b | Fin de la flat tax (prélèvement forfaitaire unique) | 2,7 [1,5 ; 3,9] | cout_unitaire | Sans modèle branché (OpenFisca n'a pas de population de revenus du capital ici) |
| R02 | Rabot des niches fiscales et sociales (dont CIR, pacte Dutreil) | 14,8 [10,8 ; 18,7] | cout_unitaire | Haut : montant de LFI ; bas : 35 % du montant de LFI (érosion de l'assiette ; règle de recoupement du dossier : aucun chiffre indépendant lu). |
| R03 | CVAE rétablie sur les grandes entreprises | 2,0 [1,4 ; 2,5] | cout_unitaire | Haut : LFI ; bas : 35 % (convention). |
| R04 | Garantie d'impôt de 2 % sur le patrimoine des centimillionnaires (type taxe Zucman) | 0,0 [−0,0 ; 0,8] | plancher | Branché sur le module grandes_fortunes_0511 : complément nécessaire pour atteindre 2 % du patrimoine (après ISF et prélèvement unique déjà payés), avec érosion et exil |
| R05 | Successions : exonération sous 150 000 €, plafond d'héritage de 12 M€ | 13,5 [−0,6 ; 31,1] | succession | Barème au-delà de 150 000 € non publié : lu comme un taux plat équivalent de 20 % à 45 % (central 30 %), dans notre module transmissions_0611.recette (déclaration, planif |
| R06 | Réforme de l'impôt sur les sociétés | 2,0 [1,4 ; 2,6] | cout_unitaire | Haut : LFI ; bas : 35 %. |
| R07 | Taxe universelle sur les multinationales | 3,4 [2,5 ; 4,3] | cout_unitaire | Haut : LFI ; bas : 35 % |
| R08 | Taxe Gafam renforcée | 2,6 [2,0 ; 3,3] | cout_unitaire | Haut : LFI ; bas : 35 %. |
| R09 | Taxe sur les superprofits | 3,4 [2,5 ; 4,3] | cout_unitaire | Haut : LFI ; bas : 35 % (le Nouveau Front populaire revendiquait 15 en 2024 : non retenu). |
| R10 | Taxe sur les transactions financières renforcée | 3,4 [2,5 ; 4,3] | cout_unitaire | Haut : LFI ; bas : 35 %. |
| R11 | Rachats d'actions (2,5) et crypto-actifs (1) | 2,4 [1,7 ; 3,0] | cout_unitaire | Haut : LFI ; bas : 35 %. |
| R12 | Lutte contre la fraude fiscale (reconstruction des effectifs) | 1,4 [1,0 ; 1,7] | cout_unitaire | Haut : LFI ; bas : 35 % |
| R13 | Impôt sur le revenu à 14 tranches et fin du quotient conjugal | 0,5 [−2,4 ; 3,7] | ir_openfisca | Taux et seuils des 14 tranches non publiés (⚠️ À VÉRIFIER dans la version complète du programme) |
| S01 | Smic à 1 700 € net, immédiatement (effets publics seulement : le coût pour les entreprises est privé) | −6,1 [−12,7 ; 3,4] | smic | Lecture : décret en 2027 (« immédiatement »), donc plein effet dès le premier exercice du banc (2028), l'effet sur l'emploi se constituant en un an (80 % la première anné |
| P01 | Pension minimale au niveau du Smic revalorisé pour une carrière complète, et minimum vieillesse au seuil de pauvreté | −22,9 [−30,3 ; −18,4] | pension_min | Le texte ne donne aucun montant en euros ni de date (séquence : minimum d'abord, puis retour à 60 ans) |
| C01 | Blocage du prix des carburants à 1,70 € le litre (avec encadrement des marges des raffineurs) | −4,1 [−12,5 ; 0,0] | carburant | Le chiffre de 1,70 € n'est pas dans le livre mais dans le plan d'urgence énergie de mars 2026 et la conférence de presse du 23/09/2026 (Public Sénat) : plafond au litre v |
| N01 | Renationaliser la SNCF (la SA SNCF est déjà détenue à 100 % par l'État) | 0,0 | nationalisation | Le groupe public ferroviaire SNCF est détenu par l'État (SA SNCF, capital 100 % public) : l'acquisition de capital est nulle ; la mesure vise le statut et l'ouverture à l |
| N02 | Renationaliser les autoroutes (concessions de Vinci, Eiffage, Abertis) en revenant sur les hausses de prix passées | 4,7 [3,5 ; 6,1] | nationalisation | Rachat anticipé des concessions : le Sénat (commission d'enquête de 2020) cite 45 à 50 Md€ (estimation de Bercy) ; comme les concessions s'achèvent entre 2031 et 2036 et  |
| N03 | Renationaliser les « aéroports stratégiques » (dont Aéroports de Paris) | 0,3 [0,2 ; 0,4] | nationalisation | La liste des aéroports n'est pas donnée |
| N04 | Renationaliser Engie (pôle public de l'énergie avec EDF et des coopératives locales) | 2,9 [2,4 ; 3,4] | nationalisation | Engie est cotée (capitalisation de 57,6 Md€ en janvier 2026 à 70,3 Md€ en avril 2026, environ 66 Md€ au central) ; l'État en détiendrait 23,6 % (⚠️ non confirmé), il faut |
| N05 | Nationaliser ArcelorMittal France | −0,5 [−0,9 ; −0,2] | nationalisation | Prix : de 0,3 à 3 Md€ ; la proposition de loi de LFI et ses soutiens avancent environ 3 Md€ (cote D) ; la CGT environ 1 Md€ voire moins vu les investissements à engager ( |
| N06 | Collectiviser les EHPAD privés à but lucratif et les confier à des associations ou coopératives | 0,0 | nationalisation | Le texte dit « collectiviser » et « confier », pas « nationaliser » ni « racheter » : aucune indemnité annoncée |

Les citations courtes, les liens, l'interprétation complète et les hypothèses cotées de chaque mesure sont dans `programmes/lfi/mesures.py`.

## 6 ter. Notre système module par module (effet sur le solde en 2038, Md€ : médiane [centiles 10 ; 90])

Méthode : pour chaque module, la fonction du modèle qui le calcule est rejouée au scénario favorable puis défavorable, tout le reste au central (`js/pont_incertitudes.js`, jsc) ; on garde l'écart au central année par année, qui s'ajoute au solde primaire exporté par `correction_0811.js` (au-dessus de `decisions_0811.js`) (la trajectoire est linéaire dans ces écarts : `lev(s, y)` s'ajoute au net). Le niveau des leviers votés (F = 33,27 Md€, après correction du double compte du report d'encaissement) reste fixe : c'est ce que la loi voterait ; ce que chaque module rapporte réellement varie. Les modules sont tirés comme les lignes de LFI : facteurs communs « comportement » et « coût », aléa propre ; entre bornes et rang, lecture en centiles 10 et 90 (⚠️ convention, comme pour tous). **Part de la variance** : covariance du module avec le solde de 2038, divisée par la variance du solde (la somme des parts vaut 1) ; **R² dette 2058** : carré de la corrélation entre la valeur du module en 2038 et la dette 2058 (non additif : les modules sont reliés par les facteurs communs).

| Module | Central | Médiane [p10 ; p90] | Facteur (λ) | Part de la variance du solde 2038 | R² dette 2058 | Cote |
|---|---|---|---|---|---|---|
| **M-V6** : Dispositif retraites V6 (âge libre, sous-indexation) : effet net par année au scénario | −18,5 | −18,5 [−35,9 ; 11,8] | cout (0,5) | 29 % | 0,51 | B-C |
| **M-TRANS** : Transmissions : abattement de 300 000 €, taux, exil et déclaration au scénario (transmissions_0611.js trois()) | 8,8 | 8,7 [−5,8 ; 26,0] | comportement (0,7) | 19 % | 0,27 | B |
| **M-PAT** : Fonction du patrimoine v7.5 : comportements (érosion, exil, rendement) au scénario favorable / défavorable de la chaîne de la v7.4, appliqués à la par | 62,5 | 62,5 [49,4 ; 77,4] | comportement (0,8) | 17 % | 0,32 | B |
| **M-FO** : Fiscalité d'orientation (9,59 Md€ au bas de sa fourchette) : réactions des assiettes | 9,6 | 9,6 [3,2 ; 12,3] | comportement (0,8) | 5 % | 0,24 | B-C |
| **M-RESID** : Résidu de la mesure de la v5.10 (bonus d'activité de 100 €, reprise du socle entre 4 700 et 9 400 €) | 0,3 | 0,3 [−7,0 ; 8,6] | cout (0,3) | 5 % | 0,09 | B-C |
| **M-CRED** : Crédit d'IS à 50 % : rendement au scénario (transmissions_0611.js credit(c, q, sc)) | 9,3 | 9,3 [3,9 ; 12,0] | comportement (0,8) | 4 % | 0,23 | B |
| **M-CONV** : Conversions en salaire à coût employeur inchangé : part patronale de la mutuelle (BT08 + CS01), transport (CS02), titres-restaurant et assimilés (BT09 | 7,6 | 7,6 [1,8 ; 12,8] | comportement (0,3) | 3 % | 0,07 | B-C |
| **M-M1** : Non-remplacement d'un départ sur deux ou fonctionnaires (M1f) : part réalisée 90 / 70 / 45 % | 15,0 | 14,9 [9,7 ; 19,2] | cout (0,5) | 3 % | 0,10 | C |
| **M-SECU** : Sécurité sociale à 100 % sur le socle : dépense publique, TSA perdue, gestion, C2S (BT04-BT07) | −25,5 | −25,6 [−28,2 ; −20,0] | cout (0,5) | 2 % | 0,09 | B-C |
| **M-08** : Chiffrage du 08/11 : collectivités, justice, protection de l'enfance, imprévus, retenue victimes, artificialisation (CL01, JU01, EN01, IM01, VI01, ZA0 | −2,8 | −2,8 [−6,4 ; 0,8] | cout (0,5) | 2 % | 0,09 | B-D (selon la ligne) |
| **M-EPAR** : Épargne réglementée exonérée (BT02) | −8,8 | −8,8 [−12,3 ; −5,2] | comportement (0,3) | 2 % | 0,06 | B-C |
| **M-GA** : Grand âge : hébergement et aide à domicile (GA01, GA02) | −4,1 | −4,1 [−7,4 ; −1,9] | cout (0,5) | 2 % | 0,10 | B-D (selon la ligne) |
| **M-GRAT** : Gratuité des transports urbains : coût net (recettes perdues, offre, collecte) | −6,2 | −6,3 [−11,0 ; −4,4] | cout (0,3) | 1 % | 0,04 | B-C |
| **M-ECO** : Économies de fonctionnement de niveau 2 : 0,9 / 1,9 / 4,9 Md€ (le niveau 1 de 0,4465 est fixe) | 1,9 | 1,9 [0,9 ; 4,9] | cout (0,5) | 1 % | 0,08 | C |
| **M-CAP** : Capitaux mobiliers : prélèvements des résidents fondus dans la fonction des revenus (DC01) | −2,9 | −2,9 [−3,9 ; −1,9] | comportement (0,5) | 1 % | 0,10 | B-D (selon la ligne) |
| **M-GT** : Garantie de transition, arrêts maladie, pont vers la retraite (DG01-DG04) | −4,3 | −4,3 [−6,0 ; −3,5] | cout (0,5) | 1 % | 0,08 | B-D (selon la ligne) |
| **M-REV** : Fonction des revenus (a = 0,6733) : comportement des actifs, des retraités à capital, de l'IS et de la retenue (bareme_v71.js bilan(q, sc)) au scénari | 1,4 | 1,4 [0,8 ; 2,0] | comportement (0,8) | 1 % | 0,23 | B |
| **M-PENS** : Courbe des pensions relevée à 9 Md€ : fuite sur les pensions 3 / 8 / 15 % (expatriation, cumul emploi-retraite ; retraites2.js) | 9,0 | 9,0 [8,3 ; 9,5] | comportement (0,5) | 0 % | 0,09 | B |
| **M-PL** : Plancher en deux parts (627 + 250 €) et coefficient de lieu (PL01, PL02) | 1,7 | 1,7 [0,4 ; 2,6] | cout (0,3) | 0 % | 0,04 | B-D (selon la ligne) |
| **M-RESTO** : TVA de la restauration à 5 % (BT10, BT11) | −4,1 | −4,1 [−4,5 ; −3,4] | comportement (0,5) | 0 % | 0,08 | B-C |
| **M-FANT** : Fantômes : GEMAPI et taxes spéciales d'équipement, chambres consulaires (BT13, BT14) | −1,3 | −1,3 [−1,9 ; 0,0] | cout (0,3) | 0 % | 0,03 | B-C |
| **M-M3** : Temps de travail dans la fonction publique : 27 000 ETP, réalisation 80 / 50 / 25 % (M3) | 0,4 | 0,4 [−0,1 ; 0,9] | cout (0,5) | 0 % | 0,07 | C |
| **M-FORM** : Formation professionnelle : un seul organisme (BT12) | −2,3 | −2,3 [−2,9 ; −1,9] | cout (0,5) | 0 % | 0,07 | B-C |
| **M-OM** : Outre-mer : sur-rémunérations, prix alimentaires (OM01, OM02) | 0,2 | 0,2 [−1,1 ; 0,4] | cout (0,3) | 0 % | 0,03 | B-D (selon la ligne) |
| **M-FRP** : Frais professionnels au réel (DC03) | 0,0 | −0,0 [−1,0 ; 0,5] | cout (0,3) | 0 % | 0,03 | B-D (selon la ligne) |
| **M-TVA** : TVA à 5 % / 10 % / 20 % (TV01-TV10) | 7,1 | 7,1 [6,6 ; 7,2] | comportement (0,5) | 0 % | 0,08 | B-D (selon la ligne) |
| **M-DET** : Socle suspendu en détention : économie | 0,5 | 0,5 [0,2 ; 0,9] | cout (0,3) | 0 % | 0,03 | B-C |
| **M-FIOUL** : Taxe sur le fioul de chauffage : érosion du parc, au scénario | 0,2 | 0,2 [0,1 ; 0,3] | comportement (0,5) | 0 % | 0,08 | B-C |
| **M-TH** : Taxe d'habitation des résidences secondaires fondue dans la v7.5 (BT03) | −2,8 | −2,8 [−3,2 ; −2,8] | cout (0,3) | 0 % | 0,02 | B-C |
| **M-URSSAF** : Gestion de l'Urssaf : économie de fonctionnement (consolidation_0611.js urssaf()) | 0,2 | 0,2 [0,0 ; 0,2] | cout (0,3) | 0 % | 0,03 | C |

**Ce que le tirage ne couvre pas (valeur centrale, non propagée)** : (a) le **socle hérité de l'architecture v5** (`Stress.pbStruct`, croisière de la v5, création de valeur, report des paiements, `Decisions0511b.ajustement`, retraites et fiscalité d'orientation au central pour les postes sans scénario) : le modèle n'en publie pas de bornes cohérentes avec les couches qui l'ont remplacé (la v7.4 retire la taxe de 1 % du centre mais le scénario « bas » ou « haut » de la v5 la contient encore) ; (b) les **corrections du grand livre** (C01-C03, C10 : −19,0 Md€, faits Insee) ; (c) l'**impôt de suite** TR03 (2,28 Md€, une seule valeur) ; (d) la clause automatique de la règle de dette (non déclenchée au central) ; (e) le remboursement étalé du report d'encaissement (hypothèse HC1 de la couche CORRECTION0811 : stock remboursé de 1/12 par an, V32018). Autre convention : les bornes de l'incertitude de la fonction du patrimoine v7.5 sont celles de la chaîne de comportement de la v7.4 (rapport recette nette / dû statique au scénario), appliquées à la seule part « fonction » (la part résidence principale est calée sans érosion) ; la ligne BT01 du modèle avait des bornes identiques, ce qui est lui-même une limite (V16902). Les scénarios d'ensemble « bas » et « haut » du modèle (§ 3) valent +194 et −224 Md€ sur le solde primaire de 2038 : plus large que le tirage ; non retenus parce qu'ils additionnent des postes remplacés.

Les sources, les bornes, les lambda et les cotes de chaque module sont dans `programmes/langagement/mesures.py` et `donnees/cache/incertitudes.json` ; les lignes que le modèle laisse à valeur unique : TR03 (Impôt de suite « court terme » sur la fonction du patrimoine (2,28 Md€); M-M2 (Point d'indice : prix − 0,5 point pendant 4 ans (M2m)).

## 7. Corrélations et sensibilité

Deux facteurs latents gaussiens relient les lignes : « comportement » (érosion de l'assiette, exil, élasticité du revenu imposable ; il commande tous les modèles de patrimoine, de transmissions et d'impôt sur le revenu, et les recettes de LFI recoupées par décote) et « coût » (dérive des coûts des dépenses). Chaque ligne a un poids λ entre 0,3 et 0,6 (⚠️ hypothèse, sans source : la corrélation entre deux lignes de même famille est de l'ordre de λ² ≈ 0,1 à 0,4). Sensibilité : tous les poids multipliés par 0 (indépendance) puis par 1,3.

| Hypothèse de corrélation | Solde de régime (Md€) | Dette 2038 (%) |
|---|---|---|
| Poids de référence | −247 [−289 ; −203] | 240 [225 ; 254] |
| Lignes indépendantes (x 0) | −247 [−281 ; −210] | 240 [227 ; 252] |
| Corrélations renforcées (x 1,3) | −246 [−294 ; −199] | 240 [224 ; 256] |

Part des tirages où le solde de régime de LFI est négatif (pire que le fil de l'eau) : 100,0 %. Les trois lignes qui pèsent le plus en médiane : D05 (−55 Md€), D07 (−30 Md€), D14 (−24 Md€). La conclusion de signe ne dépend donc pas des lignes les plus grossières mais des plus grosses.

Poids des lignes grossières : somme des médianes des lignes non grossières = −193 Md€ ; somme des médianes des lignes grossières = −51 Md€ (somme de médianes, qui n'est pas la médiane de la somme). Même sans les lignes grossières, le solde reste très négatif.

Rassemblement national : solde de régime −32 [−61 ; 4] (poids de référence), −30 [−46 ; −11] (lignes indépendantes), −34 [−66 ; 14] (corrélations renforcées) ; dette 2038 170 [158 ; 179], 169 [163 ; 174], 170 [155 ; 181] %. Part des tirages où le solde de régime est négatif (pire que le fil de l'eau) : 87,5 %. Intervalle favorable : le centile 90 du solde (4 Md€) est proche de zéro : même si les économies annoncées se réalisaient en haut de notre fourchette, le programme resterait proche du fil de l'eau ; même l'empilement des extrêmes favorables, pour mémoire (toutes les lignes à leur meilleur résultat en même temps), donne 99 Md€, moins que les 141,7 Md€ affichés par le RN pour 2031 : l'affichage suppose des économies réalisées à leur montant plein et sans coût de la réforme des retraites au-delà de 9,5 Md€.

Lignes qui pèsent le plus en médiane (coûts) : D01 (−24 Md€), T03 (−17 Md€), T01 (−12 Md€). Test de robustesse sur les économies : si la médiane de chaque économie était l'annonce du RN elle-même, le solde de régime serait, en somme des annonces, de l'ordre de +144 Md€ (§ 5 ter) ; en retenant l'hypothèse de l'Institut de l'Entreprise (lignes sans mode opératoire à 50 %, lignes juridiquement fragiles à 0), il serait de +7,5 Md€ en 2031 (cote C). Notre médiane (−32 Md€) est plus basse que cette dernière parce que nous retenons une part plus faible des lignes « sans mode opératoire » et un coût de la réforme des retraites 2,5 fois celui du RN.


**Notre système.** Sensibilité aux corrélations : solde 2038 114 [64 ; 167] (poids de référence), 114 [81 ; 151] (modules indépendants), 114 [57 ; 175] (corrélations renforcées) ; dette 2038 131 [118 ; 143], 131 [122 ; 138], 131 [116 ; 145] % ; dette 2058 en poids de référence 122 [63 ; 176] %.

**Ce que le tirage révèle pour notre système (macro de référence, 10 000 tirages, leviers votés fixés ; ⚠️ intervalle sous-estimé, § 6 ter).** (1) **Le déficit baisse presque sûrement** : le solde primaire s'améliore dans 99,9 % des tirages (le solde de régime est négatif dans 0,1 % d'entre eux) ; mais **« réduire » ne veut pas dire « équilibrer »** : le déficit public de 2038 (intérêts compris) est sous 3 % du PIB dans 34 % des tirages seulement (médiane 3,7 %). (2) **La dette est stabilisée à partir de 2038 dans 52 % des tirages seulement** (aucune année de 2039 à 2058 au-dessus du niveau de 2038) ; avec une tolérance de 1 point de PIB, 57 % ; en macro prudente, 20 %. Par construction, le modèle central est calé exactement sur la limite : toute dérive défavorable des modules fait remonter la dette, toute dérive favorable la fait baisser ; la règle « dette stable » n'est donc tenue que par la **clause automatique** (leviers qui montent si la dette dépasse la trajectoire de 2 points), pas par le niveau voté (la clause n'est pas simulée ici). (3) La dette de 2058 est inférieure à celle de 2038 dans 60 % des tirages et inférieure à son niveau de fin 2025 (115,7 %) dans 44 % ; elle repasse sous 100 % du PIB dans 31 % des tirages ; le pic de dette (médiane 131 %) tombe en 2037 (centiles 10 à 90 : 2031 à 2058). (4) La dette 2038 reste sous 150 % dans 98 % des tirages ; elle est sous son niveau de fin 2028 (123,5 %) dans 24 % seulement : la bosse de 2029-2038 est quasi certaine. (5) **Lignes qui pèsent le plus dans notre incertitude** (part de la variance du solde 2038) : M-V6 (29 %), M-TRANS (19 %), M-PAT (17 %), M-FO (5 %), M-RESID (5 %), M-CRED (4 %). Les cinq premières, toutes des comportements d'assiette ou de retraites, portent à elles seules 74 % de la variance ; les petites lignes (TVA, outre-mer, plancher, capitaux mobiliers) n'y pèsent presque rien : la conclusion dépend des gros modules (patrimoine, transmissions, fonction des revenus, retraites V6), pas des lignes récemment chiffrées.

## 8. Dette de départ (vérifiée) et hypothèses communes

- **Fait (cote A).** Dette au sens de Maastricht fin 2024 : **3 305,3 Md€**, 113,0 % du PIB à la publication (Insee, Informations rapides, dette trimestrielle 4T2024, 27/03/2025 : https://www.insee.fr/fr/statistiques/8540321, consulté le 08/11/2026) ; le ratio a été révisé à 112,6 % après révision du PIB (Insee, mai 2026, lu par résumé de moteur de recherche). Ferme V31000 (montant confirmé ; ratio révisé à relire dans le tableau Insee).
- **Fait (cote A).** Dette fin 2025 : **3 460,5 Md€** (3 460,1 selon Vie-publique, écart de 0,4 Md€ non tranché), 115,7 % du PIB (Insee, mai 2026) ; déficit 2025 : 152,5 Md€, 5,1 % du PIB. C'est la dette de départ de tous les programmes (la même que celle de nos modèles, `modeles/risques/stress.js` R1). Vérification de cohérence : 3 305,3 + 152,5 = 3 457,8, soit 2,7 Md€ d'écart avec 3 460,5 (flux de créances et autres ajustements).
- **Hypothèses communes (estimation).** Croissance nominale 3 %, taux de marché 3,45 % (OAT 10 ans début 2026), durée de renouvellement 8 ans, solde primaire du droit actuel de −103,4 Md€ de 2025 ; macro prudente : 2,5 % et 3,95 %. Même récursion que `modeles/systeme-ideal/variante_dette_stable.js`.
- **Calendrier.** Premier exercice après l'élection de 2027 : 2028 ; ce choix remplace celui du premier chiffrage de LFI (2027), qui était incompatible avec un budget voté avant l'élection ; l'écart avec le premier chiffrage vient aussi des nouveaux branchements (§ 5).

## 9. Limites assumées

- **Impôt sur le revenu** : population stylisée de foyers types (pas de micro-données représentatives dans le dépôt), calage sur le total de l'IR 2024 ; la part de l'IR payée par les 10 % les plus aisés dans cette population est de 56 % (de l'ordre de 70 % dans les statistiques de la DGFiP, ⚠️ à relire) : le haut de la distribution est sous-représenté, ce qui sous-estime la recette de tranches hautes. L'incertitude de calage est portée par une loi (0,85 à 1,15).
- **Patrimoine et transmissions** : les scénarios favorable / central / défavorable de nos modèles sont lus comme les centiles 10 / 50 / 90 : convention, sans source.
- **Notre système** : l'intervalle propage les bornes de 30 modules (§ 6 ter) mais **pas** le socle hérité de l'architecture v5, les corrections du grand livre ni l'impôt de suite, fixés au central : il est donc **sous-estimé** (les scénarios d'ensemble du modèle sont bien plus larges, § 3) ; les bornes sont celles du modèle, lues comme centiles 10 et 90 (convention), et les modules sont comonotones en interne ; les lambda (0,3 à 0,8) sont des conventions ; le test du § 4 valide la chaîne dette et le branchement, pas les leviers ; le report d'encaissement n'est plus compté deux fois depuis la correction du 08/11 (nuit) ; son remboursement étalé (1/12 par an) est une hypothèse de modélisation (V32012, V32018).
- **Programme de LFI** : certaines mesures n'ont ni barème ni calendrier publiés ; l'interprétation retenue est écrite ligne par ligne et peut être contestée.
- Aucune de ces lignes n'est un jugement de valeur sur les objectifs du programme.


## 10. Variante « modèles moins sévères » (exil, évasion et planification des grandes fortunes), appliquée à tous les programmes

Pourquoi : nos modèles d'érosion et d'exil des grands patrimoines sont peut-être trop pessimistes, pour nous comme pour les autres. Cette variante remplace, **pour tous les programmes, nous compris**, les hypothèses de comportement des grandes fortunes par un jeu plus bas tiré de la littérature (tableau ci-dessous ; dossier `sources/banc-variante-moins-severe.md`), avec les mêmes tirages (même graine) et la même méthode. Le modèle de notre système (`modeles/systeme-ideal/`) n'est pas modifié : les valeurs sont remplacées en mémoire par `js/prelude_moins_severe.js` ; les leviers votés de notre système (F) restent fixés à leur niveau de la section 1, de sorte que la variante dit ce que les mêmes votes rapporteraient avec des comportements moins défavorables, pas une recalibration.

| Hypothèse (favorable / central / défavorable) | Valeur du banc | Variante moins sévère | Ancrage |
|---|---|---|---|
| Érosion de l'assiette à 1 point d'impôt sur la fortune (`grandes_fortunes_0511`, HG08) | 20 / 35 / 55 % | 15 / 30 / 45 % | Jakobsen, Jakobsen, Kleven, Zucman 2020 (environ −30 % après 8 ans pour les très riches) ; Brülhart et al. 2022 (environ −30 % par point, 24 % seulement par déménagement) ; aucune étude lue au-delà de 30 à 45 % |
| Érosion du capital mobile du top 1 % (`taxe_patrimoine`, fonction du patrimoine v7.5) | 20 / 40 / 74 % | 15 / 30 / 45 % | idem ; le 74 % repose sur une note non vérifiée (V7306) |
| Érosion du reste du patrimoine mobile | 5 / 15 / 30 % | 4 / 10 / 20 % | Jakobsen et al. 2020 : environ −10 % pour les aisés |
| Érosion des autres actifs financiers | 3 / 8 / 15 % | 2 / 5 / 10 % | convention (même proportion) |
| Transmissions : déclaration et planification d (HT5) | 17 / 30 / 45 % | 12 / 20 / 32 % | CAE n° 69 (2021) : 20 à 25 points résiduels après réintégration de l'assurance-vie ; échange automatique d'informations (OCDE, −22 % de dépôts) |
| Transmissions : départs des patrimoines mobiles e (HT6) | 5 / 12 / 27 % | 2 / 5 / 12 % | Jakobsen, Kleven, Kolsrud, Landais, Muñoz (NBER 32153, AER 2026) : −2 % de riches par point d'impôt, soit environ 5 % pour un impôt successoral de 50 % sur vingt ans ; DGFiP via France Stratégie 2023 : 0,2 à 0,7 % de la base ISF par an |

Note de méthode sur l'ISF : la recette de `varianteB` est nette de la taxe de 1 % de la v5.4, calculée avec d'autres érosions ; baisser l'érosion y fait paraître l'ISF **moins** rentable (la base de 1 % remplacée devient plus grosse). C'est un artefact de comptabilité du modèle, non un effet économique. Le banc corrige donc la recette de l'ISF de la seule variation de la recette absolue des tranches du sommet (`js/pont_isf_abs.js`). Ce qui n'est pas touché : l'élasticité du revenu imposable des hauts revenus (Saez, Slemrod, Giertz), la fuite sur les pensions de notre système, les décotes conventionnelles de LFI (« 35 % du chiffre de LFI », sans lien avec l'exil), le socle hérité de la v5.

### 10.1 Résultats (statique, médiane [intervalle à 80 %])

| | LFI : valeur du banc | LFI : moins sévère | Rassemblement national : valeur du banc | Rassemblement national : moins sévère | Notre système : valeur du banc | Notre système : moins sévère |
|---|---|---|---|---|---|---|
| Réduction (+) ou aggravation (−) du déficit en régime (Md€ ; notre système : 2038) | −247 [−289 ; −203] | −239 [−282 ; −196] | −32 [−61 ; 4] | −31 [−60 ; 5] | 114 [64 ; 167] | 120 [71 ; 171] |
| Prélèvements obligatoires, en régime (% du PIB) | 44,8 [44,0 ; 45,7] | 45,0 [44,3 ; 46,0] | 45,0 [44,0 ; 46,3] | 45,0 [44,0 ; 46,3] | 51,5 [50,2 ; 52,9] | 51,8 [50,5 ; 53,0] |
| Dépense publique 2038 (% du PIB, intérêts compris) | 72,2 [70,8 ; 73,7] | 72,1 [70,7 ; 73,6] | 63,1 [62,8 ; 63,5] | 63,1 [62,8 ; 63,5] | 63,8 [62,4 ; 65,0] | 63,7 [62,3 ; 64,9] |
| Déficit public 2038 (% du PIB) | 18,9 [17,0 ; 20,7] | 18,6 [16,7 ; 20,4] | 9,6 [8,1 ; 10,8] | 9,6 [8,0 ; 10,8] | 3,7 [1,6 ; 5,7] | 3,4 [1,4 ; 5,4] |
| Dette publique 2038 (% du PIB) | 240 [225 ; 254] | 237 [223 ; 251] | 170 [158 ; 179] | 169 [158 ; 179] | 131 [118 ; 143] | 129 [117 ; 141] |
| Dette publique 2058 (% du PIB) | 503 [458 ; 548] | 496 [450 ; 540] | 276 [239 ; 306] | 275 [237 ; 305] | 122 [63 ; 176] | 116 [58 ; 169] |
| Dette 2058, avec relance (% du PIB) | 398 [347 ; 451] | 392 [342 ; 444] | 256 [226 ; 283] | 255 [225 ; 282] | 137 [92 ; 179] | 133 [88 ; 174] |

### 10.2 Ce qui change, mesure par mesure (effet sur le solde en régime, Md€ : médiane)

| Programme | Mesure | Valeur du banc | Moins sévère | Écart |
|---|---|---|---|---|
| LFI | R01a | 2,2 | 4,9 | 2,7 |
| LFI | R04 | 0,0 | 0,0 | 0,0 |
| LFI | R05 | 13,5 | 17,4 | 3,9 |
| Rassemblement national | F02 | −0,5 | 0,5 | 1,0 |
| Notre système | M-PAT | 62,5 | 64,7 | 2,2 |
| Notre système | M-TRANS | 8,7 | 12,9 | 4,1 |

Lecture : en médiane, la variante améliore le solde en régime de 7 Md€ pour LFI, de 1 pour le Rassemblement national et de 6 pour notre système, et déplace la dette 2058 de −8, −1 et −6 points de PIB. Elle ne change ni le classement des programmes ni la lecture de leur trajectoire de dette ; les hypothèses d'exil et d'évasion ne sont donc pas ce qui sépare les programmes. Le chapitre 15 affiche le jeu « valeur du banc », plus prudent, et cite la variante à côté.

## 11. Programmes ajoutés le 09/11/2026 : Les Républicains (plan Retailleau) et PS et Place publique (contre-budget 2027)

Demande de l'auteur du 09/11/2026 : chiffrer plus de programmes. Recensement et choix : `sources/chiffrage-programme-lr-2027.md` § 0 et `sources/chiffrage-programme-ps-2027.md` § 0 ; dossiers : `sources/chiffrage-programme-lr-2027.md`, `sources/chiffrage-programme-ps-2027.md`. **Même méthode, sans rien changer aux autres colonnes** : mêmes leviers, mêmes facteurs communs (comportement, coût, isf), mêmes 10 000 tirages, même graine, même chaîne dette ; chaque programme a son propre générateur, si bien que les sections 1 à 10 sont identiques à celles d'avant l'ajout (contrôle : `tests/test_banc.py`). Les deux documents sont relayés par la presse, le document original n'a pas été trouvé (⚠️ V-LR-01, V-PS-01). Le contre-budget du PS est un budget annuel de 2027, pas le programme présidentiel de Raphaël Glucksmann, qui n'a publié aucun chiffrage (H-PS-PERIMETRE). Mêmes conventions que pour le RN : pour chaque économie ou recette annoncée, la borne haute est l'annonce et la médiane est notre estimation réalisable, la contrainte étant nommée ligne par ligne ; les baisses d'impôts et dépenses nouvelles sont comptées à leur montant (0,95 à 1,15 fois). Ordres de grandeur sous hypothèses, jamais des prédictions.

### 11.1 Tableau comparatif (statique, médiane [intervalle à 80 %])

| | LR (Retailleau) | PS et Place publique | RN | LFI | Notre système | Fil de l'eau |
|---|---|---|---|---|---|---|
| **Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€ ; 2038 pour notre système)** | 24 [−9 ; 66] | −11 [−19 ; −3] | −32 [−61 ; 4] | −247 [−289 ; −203] | 114 [64 ; 167] | 0 |
| dont recettes nouvelles et économies (Md€) | 76 [42 ; 120] | 26 [18 ; 34] | 68 [38 ; 106] | 61 [39 ; 89] | non détaillé | 0 |
| dont baisses d'impôts et dépenses nouvelles (Md€) | 53 [51 ; 55] | 37 [35 ; 40] | 100 [93 ; 108] | 309 [275 ; 343] | non détaillé | 0 |
| Annonce du programme : effet net sur le solde en régime (Md€) | 146 | 24 | — | — | — | — |
| **Déficit restant en régime, statique (% du PIB de 2025 ; 5,7 % au droit actuel)** | 4,9 [3,4 ; 6,0] | 6,0 [5,8 ; 6,3] | 6,7 [5,5 ; 7,7] | 13,9 [12,5 ; 15,3] | 1,8 [0,1 ; 3,5] | 5,7 |
| Prélèvements obligatoires en régime (% du PIB ; 42,7 % en 2024) | 45,3 [44,1 ; 46,8] | 43,6 [43,3 ; 43,9] | 45,0 [44,0 ; 46,3] | 44,8 [44,0 ; 45,7] | 51,5 [50,2 ; 52,9] | 42,7 |
| Déficit public 2038 (% du PIB, intérêts compris) | 7,2 [5,4 ; 8,6] | 8,7 [8,3 ; 9,0] | 9,6 [8,1 ; 10,8] | 18,9 [17,0 ; 20,7] | 3,7 [1,6 ; 5,7] | 8,2 |
| **Dette publique 2032 (% du PIB)** | 133 [128 ; 137] | 138 [136 ; 139] | 142 [137 ; 145] | 168 [163 ; 174] | 128 [124 ; 132] | 136 |
| **Dette publique 2038 (% du PIB)** | 150 [135 ; 161] | 161 [158 ; 164] | 170 [158 ; 179] | 240 [225 ; 254] | 131 [118 ; 143] | 157 |
| Dette publique 2058 (% du PIB) | 216 [171 ; 251] | 252 [244 ; 261] | 276 [239 ; 306] | 503 [458 ; 548] | 122 [63 ; 176] | 240 |
| Dette 2038, macro prudente | 164 | 175 | 184 | 257 | 144 | 171 |
| Avec relance (§ 2) : effet sur le solde (Md€) | 20 [−5 ; 54] | −9 [−16 ; −1] | −15 [−39 ; 14] | −149 [−200 ; −101] | 104 [64 ; 146] | — |
| Avec relance (§ 2) : dette 2038 (% du PIB) | 151 [139 ; 159] | 160 [157 ; 163] | 163 [153 ; 171] | 207 [191 ; 224] | 135 [124 ; 144] | — |
| Corrélations nulles (ρ = 0) : effet sur le solde (Md€) | 25 [5 ; 50] | −11 [−21 ; −1] | −30 [−46 ; −11] | −247 [−281 ; −210] | 114 [81 ; 151] | 0 |
| Corrélations fortes (ρ = 1,3) : effet sur le solde (Md€) | 20 [−17 ; 76] | −11 [−18 ; −3] | −34 [−66 ; 14] | −246 [−294 ; −199] | 114 [57 ; 175] | 0 |
| Empilement des extrêmes, pour mémoire : solde (Md€) | −39 à 135 | −44 à 21 | −112 à 99 | −419 à −84 | 7 à 226 | 0 à 0 |

Lecture. (1) Les colonnes RN, LFI, notre système et fil de l'eau reprennent les valeurs des sections 1 et 2 (mêmes tirages) ; la ligne « dette 2032 » est ajoutée pour tous. (2) « Annonce » (pour les deux programmes ajoutés ; pour le RN, voir le § 5 ter) = somme des montants annoncés ligne par ligne, lus en niveau annuel de régime (pour Les Républicains, lecture H-LR-LECTURE : les « 197 milliards cumulés jusqu'en 2032 » sont lus comme le niveau des économies en 2032 ; lus comme une somme de cinq ans, l'annonce nette serait de l'ordre de 146 / 3 ≈ 49 Md€ par an). (3) Le droit actuel du banc ne contient pas la consolidation du budget 2027 du gouvernement : le contre-budget du PS est comparé au droit actuel, pas au projet de loi de finances.

### 11.2 Les Républicains (plan Retailleau, 2027) : détail par mesure (effet sur le solde en régime, Md€ : médiane [centiles 10 ; 90] ; + améliore)

Source : Bruno Retailleau (Les Républicains), plan d'économies présenté le 12/10/2026, montants rapportés par Public Sénat (12/10/2026, https://www.publicsenat.fr/actualites/economie/presidentielle-2027-bruno-retailleau-sengage-sur-un-plan-deconomies-de-pres-de-200-milliards-deuros-sil-est-elu), LCP (12/10/2026, https://lcp.fr/actualites/face-a-une-france-quasiment-en-faillite-bruno-retailleau-presente-un-plan-d-economies-de), Europe 1 (12/10/2026, https://www.europe1.fr/politique/presidentielle-2027-bruno-retailleau-promet-des-economies-de-pres-de-200-milliards-deuros-jusquen-2032-1141661), Acteurs publics (12/10/2026, tableau remis à la presse, https://acteurspublics.fr/articles/bruno-retailleau-veut-faire-travailler-davantage-les-fonctionnaires/), AFP via La Gazette France (12/10/2026, https://www.lagazettefrance.fr/article/presidentielle-retailleau-sort-le-bulldozer-pour-reduire-la-depense-publique), consultés le 09/11/2026 ; dossier du candidat non trouvé (⚠️ V-LR-01). Calendrier : Même calendrier que LFI et le RN : premier exercice après l'élection de 2027 = 2028 ; régime en 2032 (« jusqu'en 2032 »). Les non-remplacements montent linéairement sur cinq ans ; les autres économies et les baisses d'impôts suivent la montée du RN (40 %, 70 %, 90 %, 100 %), faute de calendrier publié (le candidat annonce un excédent primaire en 2030 et un déficit sous 3 % en 2031).

| Id | Mesure | Annonce | Effet sur le solde | Levier | Contrainte nommée |
|---|---|---|---|---|---|
| LR01 | Non-remplacement de 400 000 agents partant à la retraite d'ici 2032 (16 heures de travail de plus par an, appui de l'IA) | +25,0 | 12,0 [7,2 ; 22,3] | cout_unitaire | Hôpitaux et écoles (besoins de personnel) ; collectivités hors de l'autorité de l'État (libre administration, article 72 de la Constitution) ; retour catégoriel aux agents restants. |
| LR02 | Contrats non renouvelés et départs volontaires hors retraite (opérateurs) | +5,0 | 1,5 [0,7 ; 4,3] | cout_unitaire | Indemnités de départ ; continuité des missions. |
| LR03 | Suppression de la quasi-totalité des agences et opérateurs de l'État | +7,5 | 2,0 [0,8 ; 6,4] | cout_unitaire | Missions reprises par les ministères ; statuts des personnels ; lois créant les agences. |
| LR04 | Budgets « base zéro » des interventions de l'État | +11,5 | 2,5 [0,9 ; 9,7] | cout_unitaire | Aucune dépense désignée. |
| LR05 | Doublons entre l'État et les collectivités (dépenses de l'État) | +4,0 | 1,0 [0,2 ; 3,4] | cout_unitaire | Compétences fixées par la loi ; transferts de charges compensés (article 72-2 de la Constitution). |
| LR06 | Absentéisme dans la fonction publique : trois jours de carence, autorisations d'absence | +3,0 | 1,0 [0,5 ; 2,6] | cout_unitaire | Dialogue social ; pas d'obstacle juridique majeur. |
| LR07 | Délégation au privé de fonctions support (immobilier, achats, systèmes d'information) | +5,0 | 1,0 [0,2 ; 4,2] | cout_unitaire | Coûts de contrat et de pilotage ; dépendance (systèmes d'information). |
| LR08 | Transfert de la formation professionnelle aux régions | +6,0 | 1,0 [0,2 ; 5,0] | cout_unitaire | Compensation financière des transferts de compétences (article 72-2). |
| LR09 | Postes agrégés : soutien au photovoltaïque et à l'éolien, aide au développement, culture et audiovisuel public, contrats aidés, fin du SNU, MaPrimeRénov' | +23,0 | 9,0 [5,0 ; 20,2] | cout_unitaire | Contrats d'achat d'électricité en cours ; engagements internationaux d'aide ; dépendances de la rénovation énergétique aux aides. |
| LR10 | Fin des subventions aux associations « qui contestent ou entravent la loi » | +3,0 | 0,3 [0,1 ; 2,5] | cout_unitaire | Liberté d'association (principe fondamental reconnu par les lois de la République, décision du Conseil constitutionnel de 1971) ; égalité. |
| LR11 | Économies de l'État non détaillées (96 Md€ annoncés, 93 retrouvés ligne à ligne) | +3,0 | 0,5 [0,1 ; 2,5] | cout_unitaire | Non détaillé. |
| LR12 | Retraites : âge minimal de 63 ans avec décote de 7 % par an, taux plein automatique à 65 ans (lié à l'espérance de vie) | +12,0 | 5,0 [1,8 ; 10,5] | cout_unitaire | Concertation avec les partenaires sociaux ; métiers pénibles (aménagements annoncés, non chiffrés). |
| LR13 | Retraites, autres leviers : capitalisation partielle pour les jeunes, placement des réserves, convergence de l'Agirc-Arrco, fin des régimes spéciaux | +30,0 | 1,0 [−3,0 ; 24,2] | cout_unitaire | Transition de la capitalisation (double paiement) ; comptabilité nationale (opérations financières et transferts internes sans effet sur le déficit). |
| LR14 | Assurance chômage et prestations sociales | +30,0 | 8,2 [4,0 ; 25,5] | cout_unitaire | Gestion paritaire de l'assurance chômage ; conventions ; effets sur la pauvreté. |
| LR15 | Arrêts maladie : jour de carence « d'ordre public » dans le privé | +4,0 | 1,0 [0,4 ; 3,4] | cout_unitaire | Accords collectifs existants ; concertation. |
| LR16 | Immigration (dont 4,5 Md€ conditionnés à une révision de la Constitution) | +10,0 | 2,0 [0,8 ; 8,4] | cout_unitaire | Révision de la Constitution (4,5 Md€) ; droit de l'UE ; jurisprudence constitutionnelle (voir H-CONST-PRESTATIONS du RN). |
| LR17 | Fraude fiscale et sociale | +5,0 | 1,1 [0,4 ; 4,2] | cout_unitaire | Recouvrement effectif bien inférieur aux montants notifiés ⚠️. |
| LR18 | Effort des 2 232 collectivités de plus de 10 M€ de budget (fonctionnement hors personnel et prestations sociales) | +10,0 | 3,1 [1,4 ; 8,6] | cout_unitaire | Libre administration (article 72) ; autonomie financière (article 72-2). |
| LRT1 | Suppression des impôts de production (entreprises) | −30,0 | −30,8 [−32,8 ; −29,5] | cout_unitaire |  |
| LRT2 | Allègements pour les ménages : exonération de cotisations sur les heures supplémentaires, baisse de la facture d'électricité | −21,0 | −21,6 [−23,0 ; −20,6] | cout_unitaire |  |

Par thème (annoncé ; médiane du banc, somme des médianes des lignes, pour lecture seulement : la médiane d'une somme n'est pas la somme des médianes) :

| Thème | Annoncé (Md€) | Médiane du banc (Md€) |
|---|---|---|
| État | 96,0 | 31,7 |
| Social | 91,0 | 18,2 |
| Collectivités | 10,0 | 3,1 |
| Baisses d'impôts | −51,0 | −52,4 |

Hors totaux (non chiffré ou sans montant) : santé (280 Md€ de dépenses) : aucun montant d'économie (Public Sénat) ; hausse du temps de travail des agents publics de 1 607 à 1 623 heures (comptée dans LR01) ; suppression de 600 000 postes sur dix ans (au-delà de 2032) ; abrogation de normes (« passer au bulldozer ») : aucun montant ; écart entre 56 et 51 Md€ d'allègements selon les articles (Public Sénat) : 51 retenu, comme LCP et l'AFP ; trajectoire annuelle du déficit non publiée (excédent primaire en 2030, déficit sous 3 % en 2031, 2,2 % en 2032).

Part des tirages où le programme aggrave le déficit par rapport au droit actuel : 20 %.

### 11.3 PS et Place publique (contre-budget 2027) : détail par mesure (effet sur le solde en régime, Md€ : médiane [centiles 10 ; 90] ; + améliore)

Source : Groupe Socialistes et apparentés (Assemblée nationale), contre-budget 2027 présenté le 16/09/2026, montants rapportés par LCP (16/09/2026, mis à jour le 12/10/2026, https://lcp.fr/actualites/budget-a-l-assemblee-les-socialistes-presentent-leurs-propositions-et-previennent-qu-ils), Selectra (17/09/2026, https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Investir Mag (16/09/2026, https://www.investirmag.fr/contre-budget-socialiste-smic-a-1-700-eur-csg-progressive-taxe-zucman/) et Moneyvox (16/09/2026, https://www.moneyvox.fr/impot/actualites/110407/budget-2027-les-socialistes-presentent-leur-contre-projet-et-entretiennent-le-flou-sur-la-censure), consultés le 09/11/2026 ; document du groupe non trouvé (⚠️ V-PS-01). Calendrier : Même calendrier que LFI et le RN : premier exercice après l'élection de 2027 = 2028 ; régime en 2032. Le contre-budget est un budget annuel pour 2027 : ses mesures sont lues comme permanentes, en euros constants, à plein effet dès 2028 (H-PS-PERMANENCE) ; le Smic monte en un an.

| Id | Mesure | Annonce | Effet sur le solde | Levier | Contrainte nommée |
|---|---|---|---|---|---|
| PS01 | Impôt plancher de 2 % sur les patrimoines de plus de 100 M€ (« taxe Zucman »), sans ISF | +15,0 | 5,9 [0,8 ; 12,3] | zucman | Conseil constitutionnel : risque de caractère confiscatoire si l'impôt total dépasse les revenus du patrimoine (jurisprudence sur l'ISF, non relue ici ⚠️) ; mobilité des contribuables. |
| PS02 | CSG sur les gros héritages, calculée sur le total reçu au cours de la vie par chaque héritier (10 % des héritiers les plus aisés) | +10,0 | 5,0 [2,6 ; 9,0] | cout_unitaire | Planification et contournement ; une CSG sur un capital reçu est une nouveauté juridique (qualification d'imposition de toute nature, égalité devant les charges publiques) ⚠️. |
| PS03 | Taxe sur les géants du numérique (relèvement de la taxe sur les services numériques) | +10,0 | 2,0 [0,8 ; 8,4] | cout_unitaire | Représailles commerciales des États-Unis (enquête de la section 301 en 2019-2020 sur la taxe française) ; report sur les annonceurs et vendeurs français ; droit de l'UE (liberté d'établissement) ⚠️. |
| PS04 | Révision des exonérations de cotisations sociales (« niches » sociales) | +4,0 | 3,0 [1,8 ; 3,8] | cout_unitaire | Effet sur l'emploi des salaires intermédiaires (non modélisé) ; interaction avec PS09. |
| PS05 | Réforme des niches fiscales | +4,0 | 2,5 [1,3 ; 3,7] | cout_unitaire | Niches non désignées ; risque de rendement inférieur. |
| PS06 | Économies sur les marges dans les dépenses de santé | +4,0 | 1,5 [0,7 ; 3,5] | cout_unitaire | Négociations conventionnelles ; pénuries possibles sur les produits à faible marge. |
| PS07 | Économies de fonctionnement de l'État | +3,6 | 2,5 [1,3 ; 3,4] | cout_unitaire | Aucune contrainte juridique ; exécution. |
| PS08a | Lutte contre la fraude fiscale | +2,4 | 1,0 [0,4 ; 2,1] | cout_unitaire | Recouvrement effectif bien inférieur aux montants notifiés (Cour des comptes, non relue ici ⚠️). |
| PS08b | Lutte contre le travail dissimulé | +1,1 | 0,4 [0,2 ; 1,0] | cout_unitaire | Idem PS08a. |
| PS08c | Économies annoncées non détaillées (17,5 Md€ annoncés, 15,1 détaillés) | +2,4 | 0,5 [0,1 ; 2,0] | cout_unitaire | Non détaillé. |
| PS09 | Smic à 1 700 € net (effets publics seulement ; le coût pour les entreprises est privé) | n.d. | −3,4 [−8,4 ; 1,6] | smic | Coût du travail au Smic (emploi) ; indexation des allègements. |
| PS10 | CSG progressive sur les revenus d'activité (de 9,2 % à 0,55 % au Smic, inchangée au-delà de 2 700 € net) | −10,0 | −12,5 [−15,0 ; −10,6] | cout_unitaire |  |
| PS11 | Climat et adaptation (dont fonds de sécurité climatique de 5 Md€ et Fonds vert des collectivités) | −10,0 | −10,3 [−11,0 ; −9,8] | cout_unitaire |  |
| PS12 | Accès aux soins (hôpital, Ehpad, mutuelle publique gratuite des 18-25 ans : 1 Md€) | −5,0 | −5,1 [−5,5 ; −4,9] | cout_unitaire |  |
| PS13 | Loi intégrale contre les violences sexistes et sexuelles | −3,0 | −3,1 [−3,3 ; −2,9] | cout_unitaire |  |
| PS14 | Soutien aux agriculteurs | −2,0 | −2,1 [−2,2 ; −2,0] | cout_unitaire |  |
| PS15 | École | −2,0 | −2,1 [−2,2 ; −2,0] | cout_unitaire |  |

Par thème (annoncé ; médiane du banc, somme des médianes des lignes, pour lecture seulement : la médiane d'une somme n'est pas la somme des médianes) :

| Thème | Annoncé (Md€) | Médiane du banc (Md€) |
|---|---|---|
| Recettes nouvelles | 39,0 | 15,9 |
| Économies | 17,5 | 8,4 |
| Pouvoir d'achat | −10,0 | −15,9 |
| Dépenses nouvelles | −22,0 | −22,6 |

Hors totaux (non chiffré ou sans montant) : conférence sociale sur les salaires et réouverture des négociations de branche (aucun montant) ; 1 Md€ pour la sécurité civile (Investir Mag ; peut-être inclus dans le climat) ; écart entre 39,5 Md€ de recettes annoncées et 39 Md€ détaillés (0,5 Md€ non retrouvé) ; fonds européen de défense de 500 Md€ financé par emprunt commun (programme de R. Glucksmann ; hors budget national) ; plan d'investissement de 100 Md€ sur dix ans prêté au candidat par des sites tiers (non confirmé en source primaire) ; réduction du déficit annoncée : 24 Md€ en 2027, soit 0,8 point de PIB (le banc la recalcule).

Part des tirages où le programme aggrave le déficit par rapport au droit actuel : 96 %.
