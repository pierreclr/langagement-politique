---
titre: "Banc des programmes, version 2 : une seule règle de faisabilité"
statut: généré par rapport_v2.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Banc des programmes, version 2 (11/11/2026)

Écrit par Claude (IA d'Anthropic) pour l'auteur, qui est partie prenante de la comparaison (candidat potentiel) : les écarts qui nous avantageaient sont corrigés comme les autres, et **rien n'a été ajusté pour que notre système remonte**. La version 1 (`resultats.md`, `memes-modeles.md`) n'est pas modifiée. Commande : `python3 -I modeles/banc-programmes/relancer_v2.py` puis `python3 -I modeles/banc-programmes/rapport_v2.py` ; tests : `tests/test_v2.py`. Mêmes caches de ponts, graine 20261108, 10000 tirages ; la relance macroéconomique (§ 2 de la v1) et la variante « modèles moins sévères » (§ 10 de la v1) ne sont pas rejouées.

## 0. Ce qui a changé et pourquoi

**Le problème de la version 1.** Les économies du RN, de LR et du PS passaient par un filtre de faisabilité (médiane = notre jugement, plafond = l'annonce) ; les recettes de LFI par une décote de convention (35 à 100 %) ; **les économies et recettes de notre système par aucun filtre**. Les dépenses nouvelles étaient tirées entre 0,9 et 1,3 fois pour LFI, entre 0,95 et 1,15 fois pour les autres, sans raison écrite. Un lecteur sceptique pouvait donc dire, à raison, que la comparaison penchait de notre côté.

**La règle unique** (`faisabilite.py`, écrite en tête du fichier) : chaque économie ou recette nouvelle, de **tous** les programmes, reçoit trois réponses : **M** (mécanisme décrit et assiette mesurée), **J** (obstacle juridique : 1 aucun, 0 levable, −1 bloquant), **E** (précédent d'exécution qui a rapporté au moins la moitié de l'attendu). Le score M + J + E (borné à 0-3) donne une part réalisable du montant, loi à deux pans uniformes (médiane au milieu, plafond = le montant) :

| Score | Bas | Médiane | Haut |
|---|---|---|---|
| 3 | 0,80 | 1,00 | 1,00 |
| 2 | 0,40 | 0,70 | 1,00 |
| 1 | 0,10 | 0,35 | 0,80 |
| 0 | 0,00 | 0,10 | 0,50 |

Le montant est l'annonce du programme (RN, LR, PS, LFI) ou la valeur de nos modèles (notre système, module par module). La part est tirée avec le facteur commun « coût » (poids 0,5) et un aléa propre à la ligne. **Cette grille est une convention de Claude (⚠️), pas une source** : elle se situe entre la décote de LFI et les jugements de la version 1 sur les économies du RN, de LR et du PS, **plus sévères que la grille en haut d'échelle** (§ 9 ; sensibilité à la grille alignée sur la v1 au § 6 bis), et les 114 réponses (M, J, E) sont des jugements listés ligne par ligne en annexe : c'est là que quelqu'un en désaccord doit attaquer. Même règle pour les recettes issues d'un de nos modèles (ISF, impôt plancher, successions, impôt sur le revenu : la part s'applique au résultat du modèle, en plus de l'érosion et de l'exil qu'il compte déjà).

**Dépenses nouvelles** : même plancher pour tous. Fourchette au moins 0,9 à 1,3 fois le montant du programme (les coûts publics dérivent plus souvent à la hausse qu'à la baisse) ; une ligne dont la source donne une fourchette plus large garde la sienne. Pour notre système, même plancher sur chaque module de coût (écart favorable au plus 10 % du coût, défavorable au moins 30 %), sauf M-V6 (retraites), modèle de coût comme les leviers de retraite des autres programmes. Les leviers qui sont des modèles de coût (retraites, Smic, pension minimale, carburants, nationalisations) ne sont pas touchés.

**Notre système, ce qui a été fait.** (1) Sa trajectoire centrale est décomposée en lignes : les 30 modules, plus les leviers votés F (33,3 Md€, recalibrés le 11/11/2026), l'impôt de suite TR03, le point d'indice M-M2 (séries relues dans le modèle, `js/pont_incertitudes_serie.js`), plus un **socle hérité non décomposé** (23,5 Md€ en 2038, ce que les modules n'expliquent pas). Chaque ligne positive reçoit un score et sa part réalisable ; le socle, qu'on ne sait pas décomposer, reçoit la classe du milieu (score 2) par défaut. (2) Les modules de coût reçoivent le plancher commun. (3) M-M1 (non-remplacement) est valorisé au coût d'un recrutement comme LR01 (écart n° 7 de la v1 : −3,5 Md€ sur 15,0). (4) Les leviers votés F ne sont plus « garantis » : ils passent par la règle comme les autres hausses, si bien que le calage qui stabilisait la dette n'est plus tenu.

## 1. Tableau comparatif v2 (statique, médiane [intervalle à 80 %])

Taux d'intérêt **fixe à 3,45 %** (tableau principal, comme en v1), puis, en dessous, la **même chaîne avec le taux qui suit la dette** (`modeles/taux-endogene/`, variante « central »), pour tous les programmes. Effet sur le solde : + améliore le déficit par rapport au droit actuel ; régime = 2032 pour les autres programmes, 2038 pour le nôtre (voir § 8 : cet écart n'est pas levé).

| | LR (Retailleau) | PS et Place publique | Glucksmann, livret climat (chiffrage partiel) | RN | LFI (programme complet) | LFI, contre-budget 2027 (sensibilité) | Horizons (Philippe), lecture de notre simulateur | Notre système | Fil de l'eau |
|---|---|---|---|---|---|---|---|---|---|
| **Effet sur le solde, en régime (Md€ ; 2038 pour notre système)** | 27 [4 ; 54] | −15 [−23 ; −7] | −36 [−43 ; −22] | −50 [−68 ; −27] | −249 [−287 ; −211] | −35 [−54 ; −10] | −15 [−28 ; −2] | 62 [35 ; 88] | 0 [0 ; 0] |
| dont recettes nouvelles et économies (Md€, après la règle) | 82 [57 ; 110] | 23 [14 ; 32] | 5 [1 ; 21] | 52 [32 ; 77] | 59 [35 ; 88] | 52 [33 ; 78] | 61 [48 ; 75] | non détaillé | 0 |
| dont baisses d'impôts et dépenses nouvelles (Md€) | 54 [50 ; 59] | 38 [35 ; 41] | 42 [39 ; 48] | 102 [94 ; 110] | 309 [275 ; 345] | 87 [83 ; 91] | 76 [71 ; 84] | non détaillé | 0 |
| **Déficit restant en régime, statique (% du PIB de 2025 ; 5,7 % au droit actuel)** | 4,7 [3,8 ; 5,5] | 6,2 [5,9 ; 6,4] | 6,8 [6,4 ; 7,1] | 7,3 [6,6 ; 7,9] | 14,0 [12,7 ; 15,3] | 6,8 [6,0 ; 7,4] | 6,2 [5,7 ; 6,6] | 3,6 [2,7 ; 4,5] | 5,7 |
| Prélèvements obligatoires **bruts** en régime (% du PIB ; 42,7 % en 2024) | 45,5 [44,6 ; 46,4] | 43,5 [43,2 ; 43,8] | 42,9 [42,7 ; 43,4] | 44,5 [43,8 ; 45,3] | 44,7 [43,9 ; 45,7] | 44,5 [43,8 ; 45,3] | 44,8 [44,3 ; 45,2] | 49,7 [48,8 ; 50,5] | 42,7 [42,7 ; 42,7] |
| Prélèvements obligatoires **nets des transferts reversés aux ménages** (notre système seul, § 5) | — | — | — | — | — | — | — | 46,3 [45,5 ; 47,1] | — |
| Déficit public 2038 (% du PIB, intérêts compris) | 7,0 [5,9 ; 8,0] | 8,9 [8,5 ; 9,2] | 8,4 [8,4 ; 8,4] | 10,4 [9,4 ; 11,1] | 19,0 [17,4 ; 20,6] | 9,7 [8,6 ; 10,5] | 8,9 [8,3 ; 9,4] | 5,9 [4,9 ; 7,0] | 8,2 [8,2 ; 8,2] |
| **Dette publique 2032 (% du PIB)** | 133 [129 ; 136] | 138 [137 ; 140] | 143 [142 ; 143] | 144 [141 ; 146] | 169 [164 ; 174] | 142 [138 ; 145] | 139 [137 ; 141] | 135 [133 ; 137] | 136 [136 ; 136] |
| Dette à la fin de la 5e année du mandat (2032 ; 2033 pour notre système) | 133 [129 ; 136] | 138 [137 ; 140] | 143 [142 ; 143] | 144 [141 ; 146] | 169 [164 ; 174] | 142 [138 ; 145] | 139 [137 ; 141] | 138 [135 ; 141] | 136 [136 ; 136] |
| **Dette publique 2038 (% du PIB)** | 149 [140 ; 156] | 163 [160 ; 166] | 164 [163 ; 165] | 175 [168 ; 181] | 241 [228 ; 254] | 170 [161 ; 177] | 164 [159 ; 168] | 148 [141 ; 155] | 157 [157 ; 157] |
| Dette publique 2058 (% du PIB) | 212 [184 ; 237] | 257 [247 ; 265] | 248 [247 ; 248] | 295 [271 ; 314] | 506 [466 ; 546] | 278 [251 ; 299] | 258 [244 ; 272] | 184 [159 ; 210] | 240 [240 ; 240] |
| Dette 2038, macro prudente (croissance 2,5 %) | 162 [153 ; 170] | 177 [174 ; 180] | 178 [178 ; 179] | 190 [182 ; 196] | 258 [245 ; 271] | 184 [175 ; 192] | 178 [173 ; 183] | 161 [155 ; 168] | 171 [171 ; 171] |
| **Trajectoire : année du passage sous 3 % de déficit (taux fixe)** | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,1 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) |
| Déficit médian le plus bas sur 2028-2045 (année) | 6,0 % (2029) | 6,8 % (2028) | 7,5 % (2028) | 7,9 % (2028) | 8,8 % (2028) | 7,5 % (2028) | 7,0 % (2028) | 5,9 % (2038) | 6,3 % (2028) |
| **Taux endogène : dette 2038 (% du PIB)** | 168 [156 ; 178] | 186 [182 ; 190] | 190 [188 ; 191] | 204 [194 ; 213] | 311 [287 ; 336] | 197 [184 ; 207] | 188 [181 ; 194] | 168 [160 ; 176] | 179 [179 ; 179] |
| Taux endogène : dette 2058 (% du PIB) | 896 [579 ; 1210] | 1480 [1346 ; 1604] | 1496 [1467 ; 1529] | 2053 [1711 ; 2323] | 5140 [4540 ; 5750] | 1804 [1399 ; 2114] | 1525 [1319 ; 1724] | 737 [488 ; 1030] | 1243 [1243 ; 1243] |
| Taux endogène : part des tirages en zone de crise avant 2058 | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % |
| Taux endogène : année du passage sous 3 % de déficit | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) | jamais avant 2058 en médiane (0,0 % des tirages y arrivent) |

Lecture. (1) **Notre système baisse nettement** : 62 Md€ de solde en 2038 contre 97 en v1, dette 2038 de 148 contre 139 %. C'est attendu (la v1 ne lui appliquait aucun filtre) ; rien n'a été retouché pour le faire remonter.
(2) Classement par dette 2038 (du plus bas au plus haut) : Notre système 148 % < LR (Retailleau) 149 % < Fil de l'eau 157 % < PS et Place publique 163 % < Horizons (Philippe), lecture de notre simulateur 164 % < Glucksmann, livret climat (chiffrage partiel) 164 % < LFI, contre-budget 2027 (sensibilité) 170 % < RN 175 % < LFI (programme complet) 241 %. À 2058, notre système est à 184 % (v1 : 149 %).
(3) **Aucun programme ne passe sous 3 % de déficit** avant 2058 en médiane, à taux fixe comme à taux endogène (seul notre système y arrive dans 0,1 % des tirages, à taux fixe : le déficit comprend les intérêts d'une dette de 124 % du PIB).
(4) La dette n'est stable après 2038 que dans 0,8 % des tirages de notre système (52 % en v1) : le calage des leviers votés (dette stable dès 2038) a été supprimé le 11/11/2026 (§ 11) ; la valeur est donc ici un résultat, plus un objectif.

## 1 bis. Tableau court pour le site (horizons 2032 et 2038)

Médiane des 10 000 tirages, mêmes tirages et même règle de faisabilité pour tous. Effet sur le solde : Md€ de 2025, + améliore ; déficit : % du PIB, intérêts compris, taux fixe ; dette : % du PIB, taux fixe puis taux endogène (`modeles/taux-endogene/`). Prélèvements obligatoires : valeur en régime (non datée par horizon), bruts ; nets des transferts reversés aux ménages pour notre système seul (« — » : non calculé pour les autres programmes). 2058 reste dans les tableaux détaillés. Des ordres de grandeur sous hypothèses, jamais des prédictions.

| | LR (Retailleau) | PS et Place publique | Glucksmann, livret climat (chiffrage partiel) | RN | LFI (programme complet) | LFI, contre-budget 2027 (sensibilité) | Horizons (Philippe), lecture de notre simulateur | Notre système | Fil de l'eau |
|---|---|---|---|---|---|---|---|---|---|
| **2032** : effet sur le solde (Md€) | 27 | −15 | −42 | −50 | −249 | −35 | −19 | 16 | 0 |
| 2032 : déficit public (% du PIB) | 6,1 | 7,7 | 8,7 | 9,0 | 16,1 | 8,4 | 7,8 | 6,6 | 7,1 |
| 2032 : dette, taux fixe (% du PIB) | 133 [129 ; 136] | 138 [137 ; 140] | 143 [142 ; 143] | 144 [141 ; 146] | 169 [164 ; 174] | 142 [138 ; 145] | 139 [137 ; 141] | 135 [133 ; 137] | 136 [136 ; 136] |
| 2032 : dette, taux endogène (% du PIB) | 138 [134 ; 141] | 144 [143 ; 145] | 149 [148 ; 150] | 150 [147 ; 153] | 177 [171 ; 183] | 148 [143 ; 151] | 145 [143 ; 147] | 141 [139 ; 143] | 141 [141 ; 141] |
| **2038** : effet sur le solde (Md€) | 27 | −15 | 0 | −50 | −254 | −35 | −15 | 62 | 0 |
| 2038 : déficit public (% du PIB) | 7,0 | 8,9 | 8,4 | 10,4 | 19,0 | 9,7 | 8,9 | 5,9 | 8,2 |
| 2038 : dette, taux fixe (% du PIB) | 149 [140 ; 156] | 163 [160 ; 166] | 164 [163 ; 165] | 175 [168 ; 181] | 241 [228 ; 254] | 170 [161 ; 177] | 164 [159 ; 168] | 148 [141 ; 155] | 157 [157 ; 157] |
| 2038 : dette, taux endogène (% du PIB) | 168 [156 ; 178] | 186 [182 ; 190] | 190 [188 ; 191] | 204 [194 ; 213] | 311 [287 ; 336] | 197 [184 ; 207] | 188 [181 ; 194] | 168 [160 ; 176] | 179 [179 ; 179] |
| Prélèvements obligatoires bruts (% du PIB) | 45,5 [44,6 ; 46,4] | 43,5 [43,2 ; 43,8] | 42,9 [42,7 ; 43,4] | 44,5 [43,8 ; 45,3] | 44,7 [43,9 ; 45,7] | 44,5 [43,8 ; 45,3] | 44,8 [44,3 ; 45,2] | 49,7 [48,8 ; 50,5] | 42,7 [42,7 ; 42,7] |
| Prélèvements obligatoires nets des transferts (% du PIB) | — | — | — | — | — | — | — | 46,3 [45,5 ; 47,1] | — |

## 2. Avant (v1) → après (v2), programme par programme (médiane [intervalle à 80 %])

### LR (Retailleau)

| Indicateur | v1 | v2 |
|---|---|---|
| Effet sur le solde en régime (Md€) | 24 [−9 ; 66] | 27 [4 ; 54] |
| Déficit restant en régime (% du PIB de 2025) | 4,9 [3,4 ; 6,0] | 4,7 [3,8 ; 5,5] |
| Déficit public 2038 (% du PIB) | 7,2 [5,4 ; 8,6] | 7,0 [5,9 ; 8,0] |
| Dette 2032 (% du PIB) | 133 [128 ; 137] | 133 [129 ; 136] |
| Dette 2038 (% du PIB) | 150 [135 ; 161] | 149 [140 ; 156] |
| Dette 2058 (% du PIB) | 216 [171 ; 251] | 212 [184 ; 237] |
| Prélèvements obligatoires bruts en régime (% du PIB) | 45,3 [44,1 ; 46,8] | 45,5 [44,6 ; 46,4] |

### PS et Place publique

| Indicateur | v1 | v2 |
|---|---|---|
| Effet sur le solde en régime (Md€) | −11 [−19 ; −3] | −15 [−23 ; −7] |
| Déficit restant en régime (% du PIB de 2025) | 6,0 [5,8 ; 6,3] | 6,2 [5,9 ; 6,4] |
| Déficit public 2038 (% du PIB) | 8,7 [8,3 ; 9,0] | 8,9 [8,5 ; 9,2] |
| Dette 2032 (% du PIB) | 138 [136 ; 139] | 138 [137 ; 140] |
| Dette 2038 (% du PIB) | 161 [158 ; 164] | 163 [160 ; 166] |
| Dette 2058 (% du PIB) | 252 [244 ; 261] | 257 [247 ; 265] |
| Prélèvements obligatoires bruts en régime (% du PIB) | 43,6 [43,3 ; 43,9] | 43,5 [43,2 ; 43,8] |

### Glucksmann, livret climat (chiffrage partiel)

| Indicateur | v1 | v2 |
|---|---|---|
| Effet sur le solde en régime (Md€) | −35 [−40 ; −1] | −36 [−43 ; −22] |
| Déficit restant en régime (% du PIB de 2025) | 6,8 [5,7 ; 7,0] | 6,8 [6,4 ; 7,1] |
| Déficit public 2038 (% du PIB) | 8,4 [8,4 ; 8,4] | 8,4 [8,4 ; 8,4] |
| Dette 2032 (% du PIB) | 142 [141 ; 143] | 143 [142 ; 143] |
| Dette 2038 (% du PIB) | 164 [163 ; 164] | 164 [163 ; 165] |
| Dette 2058 (% du PIB) | 247 [246 ; 248] | 248 [247 ; 248] |
| Prélèvements obligatoires bruts en régime (% du PIB) | 42,9 [42,7 ; 44,1] | 42,9 [42,7 ; 43,4] |

### RN

| Indicateur | v1 | v2 |
|---|---|---|
| Effet sur le solde en régime (Md€) | −33 [−61 ; 3] | −50 [−68 ; −27] |
| Déficit restant en régime (% du PIB de 2025) | 6,8 [5,6 ; 7,7] | 7,3 [6,6 ; 7,9] |
| Déficit public 2038 (% du PIB) | 9,7 [8,1 ; 10,8] | 10,4 [9,4 ; 11,1] |
| Dette 2032 (% du PIB) | 142 [138 ; 146] | 144 [141 ; 146] |
| Dette 2038 (% du PIB) | 170 [158 ; 179] | 175 [168 ; 181] |
| Dette 2058 (% du PIB) | 277 [240 ; 306] | 295 [271 ; 314] |
| Prélèvements obligatoires bruts en régime (% du PIB) | 45,0 [44,0 ; 46,3] | 44,5 [43,8 ; 45,3] |

### LFI (programme complet)

| Indicateur | v1 | v2 |
|---|---|---|
| Effet sur le solde en régime (Md€) | −247 [−289 ; −203] | −249 [−287 ; −211] |
| Déficit restant en régime (% du PIB de 2025) | 13,9 [12,5 ; 15,3] | 14,0 [12,7 ; 15,3] |
| Déficit public 2038 (% du PIB) | 18,9 [17,0 ; 20,7] | 19,0 [17,4 ; 20,6] |
| Dette 2032 (% du PIB) | 168 [163 ; 174] | 169 [164 ; 174] |
| Dette 2038 (% du PIB) | 240 [225 ; 254] | 241 [228 ; 254] |
| Dette 2058 (% du PIB) | 503 [458 ; 548] | 506 [466 ; 546] |
| Prélèvements obligatoires bruts en régime (% du PIB) | 44,8 [44,0 ; 45,7] | 44,7 [43,9 ; 45,7] |

### Notre système

| Indicateur | v1 | v2 |
|---|---|---|
| Effet sur le solde en régime (Md€) | 97 [60 ; 135] | 62 [35 ; 88] |
| Déficit restant en régime (% du PIB de 2025) | 2,4 [1,1 ; 3,7] | 3,6 [2,7 ; 4,5] |
| Déficit public 2038 (% du PIB) | 4,5 [3,0 ; 6,0] | 5,9 [4,9 ; 7,0] |
| Dette 2032 (% du PIB) | 132 [130 ; 135] | 135 [133 ; 137] |
| Dette 2038 (% du PIB) | 139 [130 ; 148] | 148 [141 ; 155] |
| Dette 2058 (% du PIB) | 149 [109 ; 187] | 184 [159 ; 210] |
| Prélèvements obligatoires bruts en régime (% du PIB) | 50,1 [49,2 ; 51,1] | 49,7 [48,8 ; 50,5] |

Fil de l'eau : inchangé (aucune mesure). Dette 2038 : 157 %.

Le Monte-Carlo n'est pas à l'identique de la v1 (la règle ajoute un tirage par ligne et la relance n'est plus tirée) : un écart de 1 à 2 points sur une dette ou de 1 à 3 Md€ sur un solde est du bruit de tirage, pas un effet de la règle.

## 3. Ce qui a le plus bougé, ligne par ligne (effet médian en régime ; Md€)

**RN** : H06 4,0 → 0,7 ; A01 1,5 → 3,5 ; A04 0,5 → 2,4 ; H02 1,5 → 3,3 ; F05 0,8 → 2,5 ; K01 2,4 → 0,8.

**LR (Retailleau)** : LR12 5,0 → 12,0 ; LR01 12,0 → 17,5 ; LR14 8,2 → 10,6 ; LR18 3,1 → 1,0 ; LR13 1,0 → 3,0 ; LR15 1,0 → 2,8.

**PS et Place publique** : PS03 2,0 → 7,0 ; PS01 5,9 → 1,9 ; PS02 5,0 → 3,5 ; PS07 2,5 → 1,3 ; PS08c 0,5 → 0,8 ; PS05 2,5 → 2,8.

**LFI (programme complet)** : R05 13,5 → 8,6 ; R01b 2,7 → 5,0 ; R07 3,4 → 1,8 ; R03 2,0 → 3,0 ; R02 14,8 → 15,4 ; R01a 2,2 → 1,8.

**Notre système** (valeur en 2038) : M-M1 15,0 → 7,5 ; SOCLE 23,5 → 16,5 ; M-FO 9,6 → 5,9 ; M-CRED 9,2 → 5,8 ; M-CONV 7,7 → 5,0 ; M-ECO 1,9 → 0,7 ; M-GM 1,9 → 0,8 ; TR03 2,3 → 1,6.

La ligne qui pèse le plus est **M-PAT** (fonction du patrimoine, 62,5 Md€ au central jusqu'au 11/11/2026, puis 20,9 Md€ au taux de 1,25 % ; classée 1 à 3 %, 3 à 1,25 % : voir § 13), classée 1 jusque-là parce qu'un impôt annuel de cette taille était sans précédent et exposait à un risque de confiscation devant le Conseil constitutionnel ; c'est le jugement le plus lourd de conséquences de cette version (sensibilité au § 6).

## 4. Trajectoire année par année (médiane ; effet sur le solde en Md€ de 2025, déficit public en % du PIB, taux fixe)

| Programme | 2028 | 2030 | 2032 | 2034 | 2036 | 2038 | 2040 | 2045 |
|---|---|---|---|---|---|---|---|---|
| LR (Retailleau) : effet sur le solde | 7 | 19 | 27 | 27 | 27 | 27 | 27 | 27 |
| LR (Retailleau) : déficit | 6,0 | 6,1 | 6,1 | 6,5 | 6,8 | 7,0 | 7,3 | 7,9 |
| PS et Place publique : effet sur le solde | −15 | −15 | −15 | −15 | −15 | −15 | −15 | −15 |
| PS et Place publique : déficit | 6,8 | 7,2 | 7,7 | 8,1 | 8,5 | 8,9 | 9,2 | 10,1 |
| Glucksmann, livret climat (chiffrage partiel) : effet sur le solde | −36 | −42 | −42 | 0 | 0 | 0 | 0 | 0 |
| Glucksmann, livret climat (chiffrage partiel) : déficit | 7,5 | 8,2 | 8,7 | 7,7 | 8,0 | 8,4 | 8,7 | 9,5 |
| RN : effet sur le solde | −47 | −50 | −50 | −50 | −50 | −50 | −50 | −50 |
| RN : déficit | 7,9 | 8,5 | 9,0 | 9,5 | 9,9 | 10,4 | 10,8 | 11,9 |
| LFI (programme complet) : effet sur le solde | −76 | −186 | −249 | −249 | −254 | −254 | −254 | −254 |
| LFI (programme complet) : déficit | 8,8 | 13,2 | 16,1 | 17,0 | 18,1 | 19,0 | 19,9 | 22,2 |
| LFI, contre-budget 2027 (sensibilité) : effet sur le solde | −35 | −35 | −35 | −35 | −35 | −35 | −35 | −35 |
| LFI, contre-budget 2027 (sensibilité) : déficit | 7,5 | 7,9 | 8,4 | 8,9 | 9,3 | 9,7 | 10,1 | 11,1 |
| Horizons (Philippe), lecture de notre simulateur : effet sur le solde | −21 | −22 | −19 | −15 | −15 | −15 | −15 | −15 |
| Horizons (Philippe), lecture de notre simulateur : déficit | 7,0 | 7,5 | 7,8 | 8,1 | 8,5 | 8,9 | 9,3 | 10,2 |
| Notre système : effet sur le solde | 0 | 3 | 16 | 32 | 47 | 62 | 63 | 66 |
| Notre système : déficit | 6,3 | 6,6 | 6,6 | 6,4 | 6,1 | 5,9 | 6,0 | 6,4 |
| Fil de l'eau : effet sur le solde | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Fil de l'eau : déficit | 6,3 | 6,7 | 7,1 | 7,5 | 7,8 | 8,2 | 8,5 | 9,3 |

Les autres programmes montent sur un mandat (2028-2032) puis restent au régime ; le nôtre suit la rampe de son modèle jusqu'en 2038. Cette trajectoire donne la comparaison « à la même année », que le tableau du § 1 ne donne qu'à 2032, 2038 et 2058.

## 5. Notre système : prélèvements obligatoires bruts et nets des transferts reversés aux ménages

Le chiffre de **49,7 % du PIB** (brut) est le niveau des prélèvements obligatoires de notre système en régime (2038) ; le droit actuel est à 42,7 % (2024). Il est élevé parce que le système **regroupe** dans une seule fonction des prélèvements qui existent déjà (impôt sur le revenu, CSG, cotisations, prélèvements sur le capital, 886 Md€ en 2024 selon `modeles/systeme-ideal/fiche.md`) et y ajoute les nouvelles recettes (fonction du patrimoine, transmissions, fiscalité d'orientation, crédit d'IS), **puis rend une partie aux ménages** par le socle, l'allocation par enfant et le plancher de protection, au lieu de laisser les prestations actuelles. Une partie de la hausse est aussi une substitution : la Sécurité sociale à 100 % (M-SECU, −25,5 Md€) et la conversion en salaire de la mutuelle patronale ou des titres-restaurant (M-CONV) remplacent des primes et dépenses privées par des prélèvements publics.

| | Brut | Net des transferts reversés |
|---|---|---|
| Prélèvements obligatoires en régime (% du PIB) | 49,7 [48,8 ; 50,5] | 46,3 [45,5 ; 47,1] |
| En Md€ de 2024 | 1458 | 1359 |

**Définition et limite.** Les transferts reversés sont ceux du bilan global du modèle (`sources/calculs/bilan_global.py`, `transferts_nets` = socle + allocation par enfant − prestations remplacées + plancher de protection) : **99,4 Md€**, soit 3,4 points de PIB de 2024. C'est la convention du modèle à la version 5.3 ; le système actuel (v7.5) a un plancher en deux parts et d'autres décisions depuis. ⚠️ Ce chiffre est un ordre de grandeur à recalculer avec le modèle actuel ; le net n'est donc **pas** un résultat de même qualité que le brut. Le net n'est pas comparable aux autres colonnes (leurs transferts ne sont pas défalqués) : pour comparer, il faudrait compter les prestations des autres programmes de la même façon.

## 6. Sensibilités de notre système (3 000 tirages, médiane [intervalle à 80 %])

| Variante | Solde 2038 (Md€) | Dette 2038 (%) | Dette 2038, taux endogène (%) |
|---|---|---|---|
| Règle complète (contrôle de la v2 avec 3 000 tirages) | 62 [36 ; 88] | 148 [142 ; 155] | 168 [160 ; 177] |
| M-PAT classé 2 au lieu de 1 (impôt annuel sur le patrimoine jugé constitutionnel) | 57 [30 ; 83] | 149 [143 ; 156] | 170 [162 ; 179] |
| M-PAT et socle sans filtre | 71 [44 ; 97] | 145 [138 ; 152] | 164 [156 ; 173] |
| Socle non filtré | 69 [43 ; 96] | 145 [139 ; 152] | 164 [156 ; 173] |
| Socle classé 1 au lieu de 2 | 55 [29 ; 81] | 150 [144 ; 157] | 171 [163 ; 180] |
| Sans le plancher commun sur les coûts | 64 [40 ; 89] | 147 [142 ; 153] | 167 [160 ; 174] |
| Aucun filtre (parts à 100 %, coûts élargis : retrouve à peu près la v1) | 91 [57 ; 125] | 140 [132 ; 149] | 159 [148 ; 170] |
| Sans le dispositif retraites (M-V6 : pénibilité et sous-indexation de la loi de 2023 gardée), règle complète | 60 [33 ; 87] | 148 [142 ; 155] | 168 [160 ; 177] |

## 6 bis. Sensibilité à la grille : alignée sur les médianes de la v1 (3 : 60 %, 2 : 36 %, 1 : 25 %, 0 : 18 %), pour tous les programmes

| | LR (Retailleau) | PS et Place publique | Glucksmann, livret climat (chiffrage partiel) | RN | LFI (programme complet) | LFI, contre-budget 2027 (sensibilité) | Horizons (Philippe), lecture de notre simulateur | Notre système | Fil de l'eau |
|---|---|---|---|---|---|---|---|---|---|
| Effet sur le solde en régime (Md€) | 3 [−13 ; 21] | −24 [−31 ; −17] | −33 [−39 ; −26] | −56 [−67 ; −44] | −270 [−304 ; −237] | −56 [−68 ; −39] | −41 [−52 ; −26] | 17 [−6 ; 45] | 0 [0 ; 0] |
| Dette 2038 (%) : grille de la v2 | 149 [140 ; 156] | 163 [160 ; 166] | 164 [163 ; 165] | 175 [168 ; 181] | 241 [228 ; 254] | 170 [161 ; 177] | 164 [159 ; 168] | 148 [141 ; 155] | 157 [157 ; 157] |
| Dette 2038 (%) : grille alignée sur la v1 | 156 [151 ; 162] | 166 [163 ; 168] | 164 [163 ; 165] | 178 [173 ; 181] | 249 [238 ; 260] | 178 [172 ; 182] | 172 [167 ; 176] | 158 [152 ; 164] | 157 [157 ; 157] |
| Taux endogène, dette 2038 (%) : grille alignée sur la v1 | 178 [170 ; 185] | 191 [187 ; 194] | 189 [188 ; 191] | 208 [202 ; 213] | 327 [306 ; 349] | 208 [199 ; 215] | 200 [193 ; 206] | 181 [173 ; 189] | 179 [179 ; 179] |

Le classement des programmes par dette 2038 : LR (Retailleau) 156 < Fil de l'eau 157 < Notre système 158 < Glucksmann, livret climat (chiffrage partiel) 164 < PS et Place publique 166 < Horizons (Philippe), lecture de notre simulateur 172 < RN 178 < LFI, contre-budget 2027 (sensibilité) 178 < LFI (programme complet) 249.

## 7. Ce qui reste fragile

1. **Les réponses (M, J, E)** : 114 jugements de Claude, relus par personne d'autre. Le plus lourd : M-PAT. Les autres programmes ont les mêmes risques de classement, mais pèsent moins (LFI et le RN pèsent surtout par leurs dépenses, que la règle ne filtre pas).
2. **La grille elle-même** (0,80 / 1,00 / 1,00 ; 0,40 / 0,70 / 1,00 ; 0,10 / 0,35 / 0,80 ; 0 / 0,10 / 0,50) est une convention, située entre la décote de LFI et nos propres jugements antérieurs (circulaire) ; elle est plus clémente que ces jugements pour les scores 3 et 2 (§ 9, § 6 bis).
3. **Le socle hérité** (23,5 Md€ en 2038) n'est pas décomposé : on lui applique la classe du milieu, faute de mieux. Sans filtre sur le socle, notre solde monte de 7 Md€ ; classé 1, il baisse de 7.
4. **Intervalle de notre système** : plus large qu'en v1 (53 au lieu de 75 Md€ de largeur p10-p90), mais encore étroit : les bornes des scénarios d'ensemble du modèle (v1, § 6 ter) sont bien plus larges, et le socle n'a pas de bornes propres.
5. **Le régime n'est pas au même horizon** (2032 contre 2038) : c'est une propriété du programme (la rampe de notre modèle), pas un réglage ; on ne l'a pas modifiée. Les lignes « 5e année » et la trajectoire du § 4 permettent de comparer à date égale.
6. **PO nets de notre système** : transferts de la convention v5.3 (99,4 Md€), à recalculer (§ 5).
7. **Le taux endogène** a ses propres hypothèses (`modeles/taux-endogene/methode.md`) ; avec lui, aucun programme ne tient (zone de crise avant 2058 dans presque tous les tirages, y compris le nôtre : 100 %).
8. **Retraites et entreprise d'État : faits le 11/11/2026, à relire (§ 10).** T87 est appliquée (loi de 2023 gardée, ni indexation sur l'espérance de vie ni âge libre) ainsi que l'entreprise d'État à 1 Md€. Trois points restent fragiles : (a) le **plancher de 1 300 €** du modèle ne protégeait que les pensions réduites par un départ anticipé : sans âge libre, son coût modélisé est nul ; s'il s'agit d'un minimum de pension relevé pour tous, c'est un coût **non chiffré** ; (b) l'âge de référence indexé était **le** gain de long terme : sans lui, le déficit structurel de 2058 remonte (§ 10) ; (c) **le calage des leviers** : tranché le même jour (§ 11) : la règle de dette stable est supprimée, les gains vont au déficit ; la règle « baisse des prélèvements une fois le déficit sous 3 % » n'est pas écrite (le montant et le rythme de la baisse sont des choix de conception à trancher).
9. **Ce que la règle ne filtre pas** : les dépenses nouvelles issues d'un modèle (retraites, Smic, pension minimale, carburants, nationalisations), et les baisses d'impôt et dépenses dont la source donne déjà une fourchette plus large que 0,9-1,3.

## 10. Ce qui a changé le 11/11/2026 pour notre colonne (retraites de la loi de 2023, entreprise d'État à 1 Md€)

Deux décisions de l'auteur du 11/11/2026, posées comme **couche datée** `DECISIONS1111` (`modeles/systeme-ideal/decisions_1111.js`, tests `test_decisions_1111.js`, rapport `resultats_decisions_1111.txt`) au-dessus de la couche précédente, qui reste reproductible : (1) **T87, retraites** : âge de référence 64 ans (loi de 2023), **sans** indexation sur l'espérance de vie et **sans** âge libre (reporté en phase 2, non chiffré) ; restent la pénibilité, l'indexation moindre au-dessus de 2 000 €, la contribution des hautes pensions ; (2) **entreprise d'État** : 1 Md€ par an (au lieu de 3), pris sur le crédit d'impôt recherche supprimé (ligne D32). Même règle de faisabilité pour tous, mêmes tirages (graine 20261108, 10000), **rien ajusté pour faire monter notre résultat**. Le « avant » est la version du banc du 10/11/2026 (`donnees/avant-1111-langagement.json`).

**Ce que fait la couche** (central, Md€ de 2025, + améliore le solde) : retraites : le net du dispositif passe de −18,5 Md€ à 2,2 Md€ en 2038 (soit 20,7 Md€ d'écart) ; entreprise d'État : +2,0 Md€ par an ; **écart total en 2038 : +22,7 Md€**. Mais la règle de notre modèle (dette stable à partir de 2038, macro de référence) **recalibre les leviers votés** : F passe de 33,3 à 33,3 Md€ et le coefficient de la fonction des revenus de 0,6515 à 0,6515 (la fonction des revenus doit rapporter 1,4 Md€ au lieu de +1,4) : le gain des deux décisions sert donc d'abord à **baisser les prélèvements**, pas à réduire le déficit. C'est la convention de toutes les couches précédentes ; **à trancher par l'auteur** (voir plus bas, variante « leviers inchangés »).

| Notre système, médiane [intervalle à 80 %] | Avant (10/11) | Après (11/11) | Écart de la médiane |
|---|---|---|---|
| Solde en régime (2038), Md€ de 2025 | 43 [11 ; 78] | 65 [33 ; 100] | 22,0 |
| Recettes nouvelles en régime, Md€ | 209 [178 ; 246] | 209 [178 ; 246] | 0,0 |
| Dépenses nouvelles en régime, Md€ | 166 [156 ; 178] | 144 [133 ; 156] | −22,1 |
| Prélèvements obligatoires bruts, % du PIB | 49,8 [48,8 ; 51,1] | 49,8 [48,8 ; 51,1] | 0,0 |
| Prélèvements obligatoires nets des transferts, % du PIB | 46,4 [45,4 ; 47,7] | 46,4 [45,4 ; 47,7] | 0,0 |
| Déficit public 2038 (intérêts compris), % du PIB | 6,6 [5,2 ; 7,9] | 5,8 [4,3 ; 7,0] | −0,9 |
| Dette 2032, % du PIB (taux fixe) | 136,0 [132,6 ; 138,8] | 134,6 [131,2 ; 137,4] | −1,3 |
| Dette 2038, % du PIB (taux fixe) | 151,6 [142,0 ; 159,9] | 146,7 [136,9 ; 154,9] | −5,0 |
| Dette 2038, % du PIB (taux endogène) | 172,6 [160,2 ; 183,2] | 166,4 [154,1 ; 176,9] | −6,2 |
| Dette 2038, macro prudente (taux fixe) | 165,5 [155,4 ; 174,0] | 160,3 [150,2 ; 168,9] | −5,1 |
| Dette 2058, % du PIB (taux fixe) | 196,4 [161,8 ; 227,4] | 180,7 [146,0 ; 211,6] | −15,8 |
| Dette 2058, % du PIB (taux endogène) | 906,9 [524,0 ; 1280,6] | 696,6 [358,7 ; 1052,2] | −210,3 |
| Part des tirages avec dette stable dès 2038 | 0,6 % | 4,2 % | |
| Part des tirages avec entrée en zone de crise avant 2038 (taux endogène) | 59 % | 31 % | |
| Année de passage sous 3 % de déficit (p10 · p50 · p90, tirages concernés : 0,5 % avant, 1,6 % après) | 2038 · 2051 · 2058 | 2037 · 2043 · 2057 | |

**Trajectoire année par année** (médiane ; effet sur le solde en Md€ de 2025 et déficit public en % du PIB, taux fixe) :

| | 2028 | 2029 | 2030 | 2031 | 2032 | 2033 | 2034 | 2035 | 2036 | 2037 | 2038 | 2040 | 2045 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Effet sur le solde, avant | 0,0 | −12,6 | −1,9 | 2,8 | 7,5 | 11,9 | 18,8 | 25,0 | 31,8 | 37,7 | 43,1 | 42,5 | 49,0 |
| Effet sur le solde, après | 0,0 | −5,4 | 7,3 | 14,0 | 20,3 | 26,5 | 34,3 | 42,1 | 49,9 | 57,7 | 65,1 | 66,2 | 68,4 |
| Déficit, avant | 6,3 | 6,9 | 6,8 | 6,8 | 6,9 | 6,9 | 6,9 | 6,8 | 6,7 | 6,7 | 6,6 | 6,9 | 7,2 |
| Déficit, après | 6,3 | 6,7 | 6,5 | 6,5 | 6,4 | 6,4 | 6,3 | 6,2 | 6,0 | 5,9 | 5,8 | 5,9 | 6,2 |

**Lecture au central, sans tirage ni filtre** (trajectoire du modèle, taux fixe, macro de référence) :

| | Avant | Après (leviers recalibrés) | Variante : leviers inchangés (F = 33,3) |
|---|---|---|---|
| 2029 : dette ; déficit (% du PIB) | 125,0 ; 5,0 | 124,7 ; 4,8 | 124,7 ; 4,8 |
| 2033 : dette ; déficit (% du PIB) | 128,9 ; 4,6 | 127,0 ; 4,1 | 127,0 ; 4,1 |
| 2038 : dette ; déficit (% du PIB) | 130,4 ; 3,7 | 125,2 ; 2,8 | 125,2 ; 2,8 |
| 2043 : dette ; déficit (% du PIB) | 130,3 ; 3,8 | 121,1 ; 2,7 | 121,1 ; 2,7 |
| 2058 : dette ; déficit (% du PIB) | 124,6 ; 2,9 | 108,2 ; 2,2 | 108,2 ; 2,2 |
| Prélèvements obligatoires (modèle), % du PIB | 51,6 | 51,6 | 51,6 |

**Ce qu'il faut en tirer, sans complaisance.** (1) Les médianes de dette 2038 bougent peu (taux fixe : 151,6 → 146,7 %) parce que la règle de calage rend aux prélèvements ce que les deux décisions rapportent ; ce qui change, c'est la **composition** (moins de leviers, prélèvements plus bas, dépenses nouvelles plus basses de 22 Md€) et le **solde en régime** (médiane 43 → 65 Md€, parce que les leviers retirés étaient des recettes). (2) Le **long terme se dégrade** : sans l'âge de référence indexé, le déficit central de 2058 est de 2,2 % du PIB au lieu de 2,9 % ; la loi de 2023 gardée ne règle pas, seule, le vieillissement. (3) Dans la variante « leviers inchangés », le déficit central de 2038 serait de 2,8 % (contre 3,7 %) : c'est l'ordre de grandeur de ce que gagnerait un programme qui garderait ses prélèvements. Le banc n'a pas rejoué cette variante par Monte-Carlo (valeurs centrales du modèle seulement) ; les médianes du tirage (déficit 2038 à 6,6 ou 6,9 %) sont plus hautes que le central du modèle (3,7 %) parce que la règle de faisabilité commune décote les recettes nouvelles.

**Reste à trancher** : (a) leviers recalibrés ou inchangés ; (b) le plancher de 1 300 € (nul dans le modèle sans âge libre) : minimum pour tous les retraités, ou supprimé ? (c) le coût de la phase 2 (âge libre) n'est pas chiffré, comme décidé ; (d) l'entreprise d'État à 1 Md€ : l'enveloppe est une décision, pas une estimation, et la fusion des équipes (DINUM, beta.gouv) apporte surtout des personnes, peu de budget ; (e) aucune ligne de revenus de l'entreprise d'État (bénéfices attendus ensuite) n'est comptée.

## 11. 11/11/2026, gains d'abord au déficit : la règle « dette stable dès 2038 » est supprimée

**Décision de l'auteur (11/11/2026)** : les économies et gains (retraites de la loi de 2023, entreprise d'État à 1 Md€) servent **d'abord à réduire le déficit** jusqu'à le faire passer sous 3 % du PIB ; **aucune baisse de prélèvement avant**. Couche datée `DECISIONS1111B` (`modeles/systeme-ideal/decisions_1111b.js`, tests `test_decisions_1111b.js`, rapport `resultats_decisions_1111b.txt`), posée au-dessus de `DECISIONS1111` sans l'écraser : mêmes dispositifs, mais les leviers votés F sont **gardés à 33,3 Md€** (valeur d'avant le recalibrage ; au lieu de 9,5) et le coefficient de la fonction des revenus en découle (0,6515 au lieu de 0,6264), sans réglage à la main. La règle explicite « baisse des prélèvements seulement une fois le déficit sous 3 % » **n'est pas implémentée** : elle demande de choisir quelle baisse, de quel montant et à quel rythme, ce qui est une décision de conception ; la couche rapporte à la place l'année de passage sous 3 % (central du modèle : **2038**), à partir de laquelle une baisse deviendrait possible (à trancher). Même règle de faisabilité pour tous, mêmes tirages ; rien d'autre n'est ajusté. « Avant » = banc du 11/11/2026 avec leviers recalibrés (`donnees/avant-1111b-langagement.json`).

| Notre système, médiane [intervalle à 80 %] | Avant (leviers recalibrés) | Après (gains au déficit) | Écart de la médiane |
|---|---|---|---|
| Solde en régime (2038), Md€ de 2025 | 35 [−2 ; 75] | 65 [33 ; 100] | 30,0 |
| Recettes nouvelles en régime, Md€ | 186 [151 ; 227] | 209 [178 ; 246] | 22,7 |
| Dépenses nouvelles en régime, Md€ | 151 [139 ; 165] | 144 [133 ; 156] | −7,4 |
| Prélèvements obligatoires bruts, % du PIB | 49,0 [47,8 ; 50,4] | 49,8 [48,8 ; 51,1] | 0,8 |
| Prélèvements obligatoires nets des transferts, % du PIB | 45,7 [44,5 ; 47,0] | 46,4 [45,4 ; 47,7] | 0,8 |
| Déficit public 2038 (intérêts compris), % du PIB | 6,9 [5,3 ; 8,4] | 5,8 [4,3 ; 7,0] | −1,1 |
| Dette 2032, % du PIB (taux fixe) | 135,3 [131,8 ; 138,2] | 134,6 [131,2 ; 137,4] | −0,7 |
| Dette 2038, % du PIB (taux fixe) | 151,7 [141,2 ; 160,9] | 146,7 [136,9 ; 154,9] | −5,0 |
| Dette 2038, % du PIB (taux endogène) | 172,2 [159,1 ; 184,0] | 166,4 [154,1 ; 176,9] | −5,8 |
| Dette 2038, macro prudente (taux fixe) | 165,4 [154,6 ; 174,9] | 160,3 [150,2 ; 168,9] | −5,1 |
| Dette 2058, % du PIB (taux fixe) | 206,8 [167,6 ; 242,4] | 180,7 [146,0 ; 211,6] | −26,1 |
| Dette 2058, % du PIB (taux endogène) | 946,4 [525,2 ; 1358,8] | 696,6 [358,7 ; 1052,2] | −249,7 |
| Part des tirages avec dette stable dès 2038 | 0,9 % | 4,2 % | |
| Part des tirages avec entrée en zone de crise avant 2038 (taux endogène) | 58 % | 31 % | |
| Part des tirages qui passent sous 3 % de déficit avant 2058 (taux fixe) ; année p10 · p50 · p90 | 0,3 % ; 2036 · 2038 · 2051 | 1,6 % ; 2037 · 2043 · 2057 | |

**Trajectoire année par année** (médiane ; taux fixe) :

| | 2028 | 2029 | 2030 | 2031 | 2032 | 2033 | 2034 | 2035 | 2036 | 2037 | 2038 | 2040 | 2045 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Effet sur le solde, avant | 0,0 | −5,5 | 4,0 | 7,2 | 10,3 | 13,2 | 17,7 | 22,2 | 26,6 | 31,1 | 35,1 | 36,2 | 38,4 |
| Effet sur le solde, après | 0,0 | −5,4 | 7,3 | 14,0 | 20,3 | 26,5 | 34,3 | 42,1 | 49,9 | 57,7 | 65,1 | 66,2 | 68,4 |
| Déficit (% du PIB), avant | 6,3 | 6,7 | 6,6 | 6,7 | 6,8 | 6,8 | 6,9 | 6,9 | 6,9 | 6,9 | 6,9 | 7,1 | 7,6 |
| Déficit (% du PIB), après | 6,3 | 6,7 | 6,5 | 6,5 | 6,4 | 6,4 | 6,3 | 6,2 | 6,0 | 5,9 | 5,8 | 5,9 | 6,2 |

**Lecture au central, sans tirage ni filtre** (modèle, taux fixe, macro de référence) :

| | Avant le 11/11 (CORRECTION0811) | 11/11, leviers recalibrés | **11/11, gains au déficit** |
|---|---|---|---|
| 2029 : dette ; déficit (% du PIB) | 125,0 ; 5,0 | 124,7 ; 4,8 | 124,7 ; 4,8 |
| 2033 : dette ; déficit (% du PIB) | 128,9 ; 4,6 | 127,9 ; 4,4 | 127,0 ; 4,1 |
| 2038 : dette ; déficit (% du PIB) | 130,4 ; 3,7 | 129,2 ; 3,7 | 125,2 ; 2,8 |
| 2043 : dette ; déficit (% du PIB) | 130,3 ; 3,8 | 129,1 ; 3,8 | 121,1 ; 2,7 |
| 2058 : dette ; déficit (% du PIB) | 124,6 ; 2,9 | 128,9 ; 3,7 | 108,2 ; 2,2 |
| Prélèvements obligatoires (modèle), % du PIB | 51,6 | 50,8 | 51,6 |
| Année de passage durable sous 3 % de déficit | 2058 | aucune avant 2058 | 2038 |
| Macro prudente (croissance 2,5 %) : dette 2038 ; déficit 2038 | 143,4 ; 4,7 | 142,1 ; 4,7 | 138,0 ; 3,7 (sous 3 % : jamais) |

**Sans complaisance.** (1) Dans le modèle central, le déficit passe sous 3 % en 2038, mais c'est un **résultat de la règle de faisabilité du banc que les tirages démentent** : la médiane du déficit 2038 est de 5,8 % (intervalle à 80 % : 4,3 à 7,0 %) et seulement 1,6 % des tirages passent sous 3 % avant 2058 ; la décote des recettes nouvelles pèse bien plus que les deux décisions. (2) La dette 2038 médiane baisse de 152 à 147 % (taux fixe) ; à taux endogène elle reste très haute (166 %). (3) Les prélèvements obligatoires bruts restent plus hauts d'environ 0,8 point que dans la version recalibrée (le prix de la décision : on ne les baisse pas). (4) Le dividende de la décision est surtout **à long terme** (dette 2058 du modèle central : 108,2 % contre 128,9 % recalibrée), car les leviers F ne sont plus rendus aux ménages ; reste que sans l'âge de référence indexé, le vieillissement n'est pas réglé (§ 10).

**Reste fragile** : la règle de restitution (« baisse après passage sous 3 % ») n'est pas écrite ; le central du modèle (déficit < 3 % en 2038) et les tirages (déficit médian > 5 %) divergent à cause de la règle de faisabilité commune ; le plancher de 1 300 € (nul sans âge libre) et la phase 2 (âge libre) restent non chiffrés ; aucune ligne de revenus de l'entreprise d'État ; l'intervalle de notre système est sous-estimé (socle hérité fixé au central).

## 12. 11/11/2026 : mise à jour sur les documents primaires (RN, Glucksmann, LFI)

Trois documents primaires réunis le 11/11/2026 (inventaire : `sources-programmes-2027.md`) ont été relus ligne par ligne. **La colonne de notre système n'est pas touchée.** Tous les montants sont ceux annoncés par les partis (cote D), non vérifiés par Claude.

**RN (contre-budget 2027, dossier de 16 p., tableau p. 11).** Le banc agrège les lignes du tableau en 46 lignes ; vérification : économies et recettes 137,218 Md€ (la somme des lignes relues, avec la ligne répétée comptée une fois comme le fait le sous-total, redonne 137,217), baisses d'impôts et dépenses nouvelles 69,208 Md€, mesures du gouvernement retenues 3,616 Md€, solde net −71,626 Md€. Cinq lignes du banc étaient inexactes ou incomplètes et ont été corrigées : **H06** (autres économies de protection sociale) affichait 8,9 Md€ pour 7,127 Md€ au tableau (écart de 1,77 Md€ sans source) ; **F04** (superdividendes, aides récupérées) 1,35 pour 0,95 (la ligne « récupération des aides » est répétée deux fois dans le tableau et n'est comptée qu'une fois au sous-total) ; **F07** 2,2 pour 2,15 ; **G03** (écritures sans effet) 12,2 pour 12,45 (le biogaz, 0,25, manquait ; la ligne vaut zéro dans le solde) ; **T04** (baisses d'impôts diverses) 6,5 pour 6,558 (le malus automobile, 0,1, manquait). Une ligne du tableau est volontairement hors du banc : la régularisation des rapatriés fiscaux (0,9 Md€, ponctuelle). Le total des lignes du banc reproduit ainsi le tableau à 0,9 + 0,03 Md€ près. Les plafonds des économies H06, F04 et F07 baissent (plafond = montant annoncé) ; les médianes viennent de la règle commune et ne changent pas de logique. Chaque ligne cite désormais la page du dossier (p. 11 ; le tableau est répété p. 12-13).

| RN, règle v2 (médiane [intervalle à 80 %]) | Avant la relecture | Après |
|---|---|---|
| Effet sur le solde en régime (Md€) | −49,7 [−68,0 ; −26,8] | −50,2 [−68,2 ; −27,4] |
| dont recettes nouvelles et économies (Md€) | 52,0 [32,0 ; 77,2] | 51,6 [31,9 ; 76,6] |
| Effet sur le solde 2032 (Md€) | −49,7 | −50,2 |
| Dette 2032 (% du PIB) | 144,0 [141,1 ; 146,3] | 144,1 [141,2 ; 146,3] |
| Dette 2038 (% du PIB) | 175,3 [167,8 ; 181,3] | 175,5 [168,0 ; 181,4] |

Ce qui reste incertain pour le RN : (1) le dossier ne donne que les montants de 2027 ; les montants « de régime » (2031) de certaines lignes (taxe sur les rachats d'actions 0,34 Md€ contre 11,352 en 2027, TVA à la source 18 Md€, etc.) viennent de la note de l'Institut de l'Entreprise (cote C, think tank financé par des entreprises) et ne se vérifient pas dans le dossier ; (2) la presse parle de 140 Md€ d'économies en 2032, le dossier de 137,2 Md€ d'économies et recettes en 2027 : horizons différents ; (3) le contre-budget du RN n'est pas son programme présidentiel (non paru) ; (4) le dossier compte 24,5 Md€ de mesures du gouvernement non retenues : le banc, qui compare au droit actuel et non au projet de loi de finances, ne les compte pas ; (5) les lignes des mesures du gouvernement retenues (pp. 8-10) sont brouillées à l'extraction : seul leur total (3,616, p. 11) est repris.

**Glucksmann (livret « Révolution écologique : les premiers 100 jours », 24 p., 09/11/2026) : colonne distincte du PS, CHIFFRAGE PARTIEL.** Le livret ne couvre que la partie climat et énergie ; une seconde partie est annoncée et le programme complet n'est pas chiffré. Il ne donne que deux montants : 200 Md€ d'argent public sur le quinquennat (p. 8), lus comme 40 Md€ par an de 2028 à 2032 puis arrêtés, et une contribution exceptionnelle de 50 Md€ sur les plus hauts patrimoines, une seule année (p. 9), lue en 2028 avec le score 0 de la règle commune (ni seuil, ni taux, ni assiette ; risque constitutionnel ; aucun précédent récent) : médiane de 5,1 Md€. Tout le reste est à zéro (liste des lignes non chiffrées dans `programmes/gl/mesures.py`). Le chèque énergie (5 Md€, calcul de Claude) et la sécurité civile (1 Md€) sont présentés par le livret comme des emplois des 200 Md€ : ils ne sont pas ajoutés. Résultat à taux fixe : effet sur le solde de −42 Md€ en 2032 et de 0 en 2038 (nul par construction : rien n'est chiffré au-delà du quinquennat), dette de 143 % du PIB en 2032 et de 164 % en 2038. Ces chiffres ne sont pas ceux du programme complet. Le livret vise « la stabilisation de la dette à l'horizon 2032 » ; le banc, avec ces seuls deux montants, ne la trouve pas (dette en hausse sur 2028-2032), ce qui n'est pas une réfutation (objectif adossé à des mesures non chiffrées). Incertain : le texte ne dit pas si les 200 Md€ sont additionnels au droit actuel (lus comme tels : hypothèse haute du coût), ni le profil par année.

**LFI, contre-budget 2027 (sensibilité ; colonne principale inchangée : « L'Avenir en commun » complet).** Document « Comment nous allons remettre de l'ordre dans les comptes publics » (24 p., octobre 2026) : recettes 106,4 Md€, dépenses 81,7 Md€ (37 lignes inventoriées, 28 chiffrées), réduction du déficit annoncée 24,7 Md€ (p. 6, 12-14) ; le document dit lui-même ne pas chiffrer l'ensemble du programme (p. 7). Construction : les 13 lignes de recette de la colonne principale qui sont exactement celles du document (mêmes modèles et mêmes réponses M, J, E), et les 14 lignes de dépenses du document à leur montant de première année, lu comme permanent (fourchette commune 0,9 à 1,3). Résultat : effet sur le solde de −35 Md€ en 2032 (colonne principale : −249), dette de 142 % du PIB en 2032 et de 170 % en 2038 (colonne principale : 169 et 241). L'écart entre les deux colonnes est celui d'un budget d'une année et d'un programme complet ; la règle de faisabilité ramène les 106,4 Md€ de recettes annoncées à 52 Md€ en médiane, si bien que le document ne tient pas non plus ses 24,7 Md€ de réduction du déficit dans le banc. Incertain : le contre-budget est lu comme permanent (euros constants), sans dérive des coûts de retraite ; le plan BTP-logement (36 Md€ par an hors de l'État, pôle public bancaire) n'est pas compté.

## 13. 11/11/2026, impôt sur le patrimoine à 1,25 % et grand ménage branché

**Décision de l'auteur (11/11/2026)** : taux marginal maximal de la fonction du patrimoine fixé à **1,25 %**, avec plafonnement à 75 % du revenu (`sources/impot-patrimoine-balayage.md`, `sources/impot-patrimoine-constitutionnel.md`) ; le grand ménage (`modeles/grand-menage/`) est branché tel quel. Couche datée `DECISIONS1111D` (`modeles/systeme-ideal/decisions_1111d.js`, tests `test_decisions_1111d.js`) au-dessus de `DECISIONS1111C` (grand ménage, paramètre `tauxPatrimoine` activé par défaut à 0,0125) et de `DECISIONS1111B`, sans les écraser. Leviers votés F **inchangés** (33,3 Md€), coefficient de la fonction des revenus **non recalibré** (0,6515) : les gains vont d'abord au déficit. Même règle de faisabilité pour tous, mêmes tirages (graine 20261108, 10000) ; **rien d'autre n'est ajusté pour améliorer notre résultat**. « Avant » = banc du 11/11/2026 de la section 11 (`donnees/avant-1111d-langagement.json`).

**Ce que fait la couche** (modèle, central, Md€ de 2025/an en croisière dès 2029, sans montée en charge : ⚠️ simplification) : recette nette de la fonction du patrimoine au taux de 1,25 % (résidence principale à 0,25 % jusqu'à 1 M€ puis fonction, K = 700 000 €, plafonnement à 75 % du revenu = −15 % de la fonction, hypothèse HB1) : **20,9 Md€** [favorable 21,6 ; défavorable 20,1] ; dû brut avant comportements et plafonnement : 23,5 Md€ ; la v7.5 à 3 % rapportait 62,5 Md€ : **écart de −41,6 Md€ par an**. Les prélèvements obligatoires du modèle baissent de 51,6 à 50,2 % du PIB. Le grand ménage ajoute (central) −1,0 Md€ en 2032 et +1,9 Md€ en 2038 (net de la transition).

**Score M/J/E de M-PAT révisé : (1, 1, 1) = 3, au lieu de (1, 0, 0) = 1.** M 1 : assiette et mécanisme précis, mais impôt annuel nouveau ; J 1 : 1,25 % est **sous** le taux de 1,5 % que le Conseil constitutionnel a validé en 2012 (décision 2012-662 DC) avec le plafonnement à 75 % du revenu, ce qui était le motif du J 0 à 3 % sans plafonnement ; **⚠️ le régime exact (RP à 0,25 %, K = 700 k€) n'a jamais été examiné** ; E 1 : précédent suisse (impôt cantonal sur la fortune, ≈ 1,2 % du PIB de recettes). **Fragile** : avec l'ISF français seul comme précédent (≈ 5 Md€ par an), E vaudrait 0 (recette attendue de 20,9 Md€ au-delà de 10 Md€) et M-PAT passerait à 2 ; la sensibilité « M-PAT classé 2 » du § 6 est conservée.

| Notre système, médiane [intervalle à 80 %] | Avant (gains au déficit) | Après (patrimoine 1,25 %, grand ménage) | Écart de la médiane |
|---|---|---|---|
| Solde en régime (2038), Md€ de 2025 | 65 [33 ; 100] | 62 [35 ; 88] | −2,8 |
| Recettes nouvelles en régime, Md€ | 209 [178 ; 246] | 205 [180 ; 230] | −3,9 |
| Dépenses nouvelles en régime, Md€ | 144 [133 ; 156] | 143 [132 ; 155] | −1,3 |
| Prélèvements obligatoires bruts, % du PIB | 49,8 [48,8 ; 51,1] | 49,7 [48,8 ; 50,5] | −0,1 |
| Prélèvements obligatoires nets des transferts, % du PIB | 46,4 [45,4 ; 47,7] | 46,3 [45,5 ; 47,1] | −0,1 |
| Déficit public 2038 (intérêts compris), % du PIB | 5,8 [4,3 ; 7,0] | 5,9 [4,9 ; 7,0] | 0,1 |
| Dette 2032, % du PIB (taux fixe) | 134,6 [131,2 ; 137,4] | 135,2 [133,2 ; 137,4] | 0,5 |
| Dette 2038, % du PIB (taux fixe) | 146,7 [136,9 ; 154,9] | 147,7 [141,5 ; 154,5] | 1,0 |
| Dette 2038, % du PIB (taux endogène) | 166,4 [154,1 ; 176,9] | 167,8 [159,9 ; 176,4] | 1,4 |
| Dette 2038, macro prudente (taux fixe) | 160,3 [150,2 ; 168,9] | 161,4 [155,0 ; 168,4] | 1,1 |
| Dette 2058, % du PIB (taux fixe) | 180,7 [146,0 ; 211,6] | 183,7 [159,2 ; 209,7] | 3,0 |
| Dette 2058, % du PIB (taux endogène) | 696,6 [358,7 ; 1052,2] | 737,1 [488,5 ; 1030,4] | 40,4 |
| Part des tirages avec dette stable dès 2038 | 4,2 % | 0,8 % | |
| Part des tirages avec entrée en zone de crise avant 2038 (taux endogène) | 31 % | 33 % | |
| Part des tirages sous 3 % de déficit avant 2058 (taux fixe) | 1,6 % | 0,1 % | |
| Effet médian de la ligne M-PAT en régime (Md€) | 22,2 [9,3 ; 45,5] | 20,3 [17,5 ; 21,4] | |
| Effet médian de la ligne M-GM (grand ménage, 2038, Md€) | — | 0,8 [0,0 ; 3,4] | |

**Trajectoire année par année** (médiane ; taux fixe) :

| | 2028 | 2029 | 2030 | 2031 | 2032 | 2033 | 2034 | 2035 | 2036 | 2037 | 2038 | 2040 | 2045 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Effet sur le solde, avant | 0,0 | −5,4 | 7,3 | 14,0 | 20,3 | 26,5 | 34,3 | 42,1 | 49,9 | 57,7 | 65,1 | 66,2 | 68,4 |
| Effet sur le solde, après | 0,0 | −9,1 | 3,5 | 10,0 | 16,4 | 23,5 | 31,8 | 39,6 | 47,3 | 55,0 | 62,3 | 63,4 | 65,7 |
| Déficit (% du PIB), avant | 6,3 | 6,7 | 6,5 | 6,5 | 6,4 | 6,4 | 6,3 | 6,2 | 6,0 | 5,9 | 5,8 | 5,9 | 6,2 |
| Déficit (% du PIB), après | 6,3 | 6,8 | 6,6 | 6,6 | 6,6 | 6,5 | 6,4 | 6,3 | 6,1 | 6,0 | 5,9 | 6,0 | 6,4 |

**Lecture au central, sans tirage ni filtre** (modèle, taux fixe, macro de référence ; leviers F inchangés) :

| | Avant (11/11, gains au déficit) | + grand ménage seul | **+ patrimoine à 1,25 % (nouvelle colonne)** |
|---|---|---|---|
| 2029 : dette ; déficit (% du PIB) | 124,7 ; 4,78 | 124,7 ; 4,78 | 126,1 ; 6,17 |
| 2032 : dette ; déficit (% du PIB) | 126,6 ; 4,18 | 126,7 ; 4,22 | 132,3 ; 5,73 |
| 2033 : dette ; déficit (% du PIB) | 127,0 ; 4,05 | 127,1 ; 4,06 | 134,0 ; 5,61 |
| 2038 : dette ; déficit (% du PIB) | 125,2 ; 2,81 | 125,0 ; 2,74 | 138,9 ; 4,52 |
| 2043 : dette ; déficit (% du PIB) | 121,1 ; 2,74 | 120,5 ; 2,66 | 141,7 ; 4,68 |
| 2058 : dette ; déficit (% du PIB) | 108,2 ; 2,23 | 106,6 ; 2,12 | 150,4 ; 4,92 |
| Prélèvements obligatoires (modèle), % du PIB | 51,6 | 51,6 | 50,2 |
| Année de passage durable sous 3 % de déficit | 2038 | — | aucune avant 2058 |
| Macro prudente (croissance 2,5 %) : dette 2038 ; déficit 2038 | 138,0 ; 3,7 | | 152,3 ; 5,5 |

**Classement par dette 2038 (médiane, taux fixe)** : Notre système 147,7 % ; LR (Retailleau) 148,6 % ; Fil de l'eau 157,1 % ; PS et Place publique 162,7 % ; Horizons (Philippe), lecture de notre simulateur 163,8 % ; Glucksmann, livret climat (chiffrage partiel) 163,9 % ; LFI, contre-budget 2027 (sensibilité) 170,0 % ; RN 175,5 % ; LFI (programme complet) 240,8 %.

**Sans complaisance.** (1) Dans le modèle central, retirer ≈ 41,6 Md€ de recette par an coûte environ 1,8 points de PIB de déficit ; le passage sous 3 % (2038 avant) **disparaît** du modèle central. (2) La médiane du banc bouge **beaucoup moins** que le central (dette 2038 : 146,7 → 147,7 %) : l'ancienne ligne M-PAT à 62,5 Md€ était classée 1 et donc décotée par la règle commune (médiane de 22,2 Md€) ; la nouvelle, plus petite, est classée 3 et presque intacte (médiane de 20,3 Md€). La médiane du banc est ainsi surtout un effet du classement : **c'est le jugement M/J/E, relu par personne d'autre, qui porte le résultat**. (3) Notre système et LR sont à moins de 1 point de dette 2038 avec des intervalles qui se recouvrent : le rang n'est pas significatif. (4) Le grand ménage est classé (0, 1, 0) comme les autres économies de fonctionnement ; il pèse peu (central 1,9 Md€ en 2038, jusqu'à 9,4 Md€ au scénario haut). (5) Hypothèses fragiles : recette de croisière dès 2029 sans montée en charge ni délai d'établissement de l'assiette ; plafonnement à 75 % simulé par −15 % (HB1, ⚠️ V-PAT5) ; départs non intégrés au tirage (ordres de grandeur dans le balayage) ; les variantes « modèles moins sévères » (§ 10 de `resultats.md`) reposent encore sur le patrimoine à 3 % et ne sont pas rejouées ici.

## 14. 13/11/2026 : Horizons (Édouard Philippe), lecture de notre simulateur

**Le programme d'Édouard Philippe n'est pas chiffré par son auteur (12/11/2026). Ce chiffrage est une lecture de notre simulateur : les montants manquants sont fixés par nous, hypothèse par hypothèse, et seront remplacés dès qu'un chiffrage officiel ou indépendant paraîtra.**

Document lu : Édouard Philippe (Horizons), programme présidentiel publié sur le site de campagne, 15 pages thématiques, « dernière mise à jour le 12 novembre 2026 » (https://www.edouardphilippe.fr/programme), consulté le 13/11/2026 ; aucun chiffrage du candidat (ni coût par mesure, ni total, ni trajectoire). Mesures chiffrées : 13 lignes (5 économies passées par la règle commune, 8 baisses d'impôts et dépenses nouvelles comptées en entier) ; 18 annonces sans contenu chiffrable restent hors du calcul (`programmes/philippe/mesures.py`, `NON_CHIFFREES`). Montants publiés par le candidat : 50 Md€ d'aides aux entreprises en moins et 50 Md€ d'impôts de production en moins ; tous les autres montants sont nos hypothèses H-PH1 à H-PH12, écrites une par une dans `detail-philippe.md`. Le quart de l'effort que le programme attend « de la croissance et de l'emploi » n'est pas crédité : aucun effet de croissance n'est compté, pour aucun programme.

| (médiane [intervalle à 80 %], 10000 tirages, même graine) | Hypothèses au central (colonne du § 1) | Toutes à leur borne basse | Toutes à leur borne haute | Économies basses, coûts hauts | Économies hautes, coûts bas |
|---|---|---|---|---|---|
| Effet sur le solde en régime, 2032 (Md€) | −15 [−28 ; −2] | −17 [−29 ; −4] | −17 [−30 ; −3] | −35 [−48 ; −22] | 2 [−12 ; 15] |
| dont économies, après la règle (Md€) | 61 [48 ; 75] | 52 [39 ; 65] | 70 [56 ; 85] | 52 [39 ; 65] | 70 [56 ; 85] |
| dont baisses d'impôts et dépenses nouvelles (Md€) | 76 [71 ; 84] | 68 [63 ; 75] | 87 [81 ; 94] | 87 [81 ; 94] | 68 [63 ; 75] |
| Déficit public 2032 (% du PIB, médiane) | 7,8 | 7,8 | 8,0 | 8,5 | 7,3 |
| Déficit public 2038 (% du PIB) | 8,9 [8,3 ; 9,4] | 8,9 [8,4 ; 9,5] | 9,0 [8,4 ; 9,5] | 9,7 [9,1 ; 10,3] | 8,2 [7,6 ; 8,8] |
| Dette publique 2032 (% du PIB) | 139 [137 ; 141] | 139 [137 ; 141] | 140 [138 ; 142] | 141 [139 ; 144] | 138 [135 ; 140] |
| Dette publique 2038 (% du PIB) | 164 [159 ; 168] | 164 [159 ; 168] | 165 [160 ; 169] | 170 [165 ; 174] | 159 [154 ; 163] |
| Dette 2038, taux endogène (% du PIB) | 188 [181 ; 194] | 188 [181 ; 194] | 189 [182 ; 196] | 196 [190 ; 203] | 181 [174 ; 188] |

Lecture. (1) **La cible du candidat est un déficit de 2 % du PIB en fin de mandat ; notre lecture donne 7,8 % en 2032** (fil de l'eau : 7,1 %) : avec la même règle pour tous, les mesures publiées ne suffisent pas à l'atteindre, parce que le pacte fiscal compte 50 Md€ de baisse d'impôts en entier contre une économie d'aides non désignées ramenée à sa part réalisable (score 2, médiane 70 %), parce que les dépenses nouvelles (familles, professeurs, heures supplémentaires) ne sont pas financées ligne à ligne, et parce que le quart attendu de la croissance n'est pas crédité. Ce n'est pas une réfutation : la cible pourrait être tenue par des mesures que le programme ne détaille pas. (2) Les lignes qui pèsent le plus (médiane, Md€) : PHT1 −52,8 (Pacte fiscal : 50 Md€ d'impôts de production en moins) ; PH05 34,8 (Pacte fiscal : 50 Md€ d'« aides publiques improductives » au) ; PH01 16,0 (Retraites : âge légal porté à 65 ans et durée à 45 annuités ) ; PHD2 −9,2 (Salaire des professeurs relevé de 20 % en moyenne sur le qui) ; PH02 8,4 (Non-remplacement d'un fonctionnaire sur trois partant à la r) ; PHD1 −6,0 (Allocation familiale unique jusqu'à 350 € par mois dès le pr). (3) Les bornes basse et haute de toutes les hypothèses bougent ensemble économies et coûts et se compensent en partie ; les colonnes « défavorable » et « favorable » donnent l'écart utile : de −35 à 2 Md€ de solde.

## 8. Les douze écarts de `memes-modeles.md` : statut

| N° | Écart | Statut v2 |
|---|---|---|
| 1 | Filtre de faisabilité asymétrique | **Traité** : une seule règle (score M + J + E, grille unique) pour toutes les économies et toutes les recettes nouvelles de tous les programmes, nous compris (§ 0, annexe). |
| 2 | Fourchettes des dépenses nouvelles | **Traité** : plancher commun 0,9 à 1,3 fois pour les dépenses chiffrées par leur auteur seul, y compris les modules de coût de notre système ; les fourchettes plus larges et sourcées sont gardées. |
| 3 | Leviers votés calés pour stabiliser la dette (nous seuls) | **Traité en partie** : les leviers votés F passent par la règle comme les autres hausses ; le calage n'est plus garanti (la dette n'est stable après 2038 que dans une minorité de tirages). Les autres programmes n'ont pas de règle de bouclage et n'en reçoivent pas : on publie le résultat de chacun tel quel. |
| 4 | Intervalle de notre système sous-estimé (socle fixé au central) | **Traité en partie** : le socle (non décomposé) reçoit la classe du milieu, les coûts le plancher commun, F et les petites lignes une part ; l'intervalle est plus large mais reste étroit (§ 7). Décomposer le socle en lignes demande un export du modèle JavaScript (hors de ce dossier). |
| 5 | Régime atteint en 2038 contre 2032 | **Non levé, expliqué** : c'est la rampe du programme (décision de l'auteur), pas un paramètre du banc. On ajoute la dette à la même année de mandat (5e année) et la trajectoire année par année (§ 1, § 4). |
| 6 | Taux fixe dans le tableau principal | **Traité** : tableau principal gardé à 3,45 %, version à taux endogène affichée en dessous pour tous (§ 1). |
| 7 | Coût par poste du non-remplacement | **Traité** : M-M1 valorisé au coût d'un recrutement comme LR01 (−3,5 Md€ sur 15,0, proportion simple appliquée à toute la série). |
| 8 | Baisses de TVA du RN hors de notre fonction de TVA | **Non traité** : il faudrait relancer le modèle JavaScript (`changementTva`) hors de ce dossier ; ce sont des coûts (le plancher commun 0,9-1,3 s'applique). |
| 9 | Réactions de l'impôt sur le revenu différentes selon les programmes | **Non traité** : il faut une table d'élasticités partagée avec le modèle JavaScript, hors de ce dossier. |
| 10 | Médianes « relatives » qui ne reprennent pas celles qu'elles disent reprendre | **Levé** : la part est fixée par le score, appliqué par le code ; plus de jugement ligne par ligne sur la médiane, seulement sur les trois réponses. |
| 11 | Édouard Philippe hors du banc | **Traité le 13/11/2026, avec une réserve** : le programme publié le 12/11/2026 n'est pas chiffré par le candidat ; la colonne est une lecture de notre simulateur (hypothèses H-PH1 à H-PH12, § 14), sous la même règle que les autres. |
| 12 | Variante « moins sévère » non rejouée pour LR et le PS | **Non traité en v2** : la v2 ne rejoue pas la variante ; la v1 (§ 10) reste la référence ; effet connu : +1 à +7 Md€ selon le programme. |

## 9. Contrôle de la grille : les jugements de la v1, regroupés par score

Médiane de la part retenue en v1 (centrale de l'ancienne loi / montant annoncé), par score de la v2, pour les lignes à montant annoncé. Si la grille est cohérente avec les jugements de la v1, ces médianes sont voisines de la colonne « médiane de la grille ». La concordance est partielle par construction : les réponses (M, J, E) ont été écrites par la même main que les anciens jugements.

| Score | Médiane de la grille | Médiane des parts v1, RN + LR + PS (nombre de lignes) | Médiane des parts v1, LFI (nombre) |
|---|---|---|---|
| 3 | 100 % | 62 % (2) | 58 % (2) |
| 2 | 70 % | 45 % (7) | 68 % (7) |
| 1 | 35 % | 25 % (28) | 68 % (1) |
| 0 | 10 % | 18 % (20) | — |

## Annexe. Classement ligne par ligne (M, J, E, score, part médiane v1 → v2)

Les lignes issues d'un de nos modèles (ISF, plancher, successions, impôt sur le revenu, IFF, Zucman) n'ont pas de « part v1 » : leur part v2 s'applique au résultat du modèle.

| Programme | Ligne | Libellé | M | J | E | Score | Montant nominal (Md€) | Part médiane v1 | Part médiane v2 | Motif |
|---|---|---|---|---|---|---|---|---|---|---|
| LFI (programme complet) | R01a | ISF rétabli et renforcé (volet climatique non modélisé), net de l'IFI  | 1 | 1 | 1 | 3 | sortie du modèle | — | 100 % | ISF rétabli : barème et assiette connus, a existé jusqu'en 2017 |
| LFI (programme complet) | R01b | Fin de la flat tax (prélèvement forfaitaire unique) | 1 | 1 | 1 | 3 | 5,0 | 50 % | 100 % | fin du prélèvement forfaitaire : retour au barème, a existé avant 2018 |
| LFI (programme complet) | R02 | Rabot des niches fiscales et sociales (dont CIR, pacte Dutreil) | 0 | 1 | 1 | 2 | 22,0 | 67 % | 70 % | niches : liste non donnée ; rabots de niches faits plusieurs fois, rendement partiel |
| LFI (programme complet) | R03 | CVAE rétablie sur les grandes entreprises | 1 | 1 | 1 | 3 | 3,0 | 67 % | 100 % | CVAE : impôt qui a existé et dont l'assiette est connue |
| LFI (programme complet) | R04 | Garantie d'impôt de 2 % sur le patrimoine des centimillionnaires (type | 1 | 0 | 0 | 1 | sortie du modèle | — | 35 % | impôt plancher sur les très grandes fortunes : risque constitutionnel (égalité, confiscation), jamais appliqué |
| LFI (programme complet) | R05 | Successions : exonération sous 150 000 €, plafond d'héritage de 12 M€ | 1 | 0 | 1 | 2 | sortie du modèle | — | 70 % | successions : taux et abattement connus, mais plafond d'héritage (droit de propriété) sans précédent |
| LFI (programme complet) | R06 | Réforme de l'impôt sur les sociétés | 0 | 1 | 1 | 2 | 3,0 | 67 % | 70 % | réforme de l'IS non détaillée |
| LFI (programme complet) | R07 | Taxe universelle sur les multinationales | 0 | 0 | 1 | 1 | 5,0 | 68 % | 35 % | taxe universelle sur les multinationales : conventions fiscales et UE, mécanisme non détaillé ; l'impôt minimum mondial existe |
| LFI (programme complet) | R08 | Taxe Gafam renforcée | 1 | 1 | 0 | 2 | 3,9 | 67 % | 70 % | taxe sur les services numériques : existe, mais aucun précédent d'un rendement multiplié |
| LFI (programme complet) | R09 | Taxe sur les superprofits | 0 | 1 | 1 | 2 | 5,0 | 68 % | 70 % | superprofits : définition non donnée ; contribution européenne de 2022 de rendement inférieur |
| LFI (programme complet) | R10 | Taxe sur les transactions financières renforcée | 1 | 1 | 0 | 2 | 5,0 | 68 % | 70 % | taxe sur les transactions financières : existe, hausse de taux et réaction des volumes |
| LFI (programme complet) | R11 | Rachats d'actions (2,5) et crypto-actifs (1) | 1 | 1 | 0 | 2 | 3,5 | 69 % | 70 % | rachats d'actions et crypto-actifs : assiette connue, les rachats s'adaptent |
| LFI (programme complet) | R12 | Lutte contre la fraude fiscale (reconstruction des effectifs) | 1 | 1 | 0 | 2 | 2,0 | 70 % | 70 % | fraude : reconstruction d'effectifs de contrôle, rendement des contrôles stable depuis des années |
| LFI (programme complet) | R13 | Impôt sur le revenu à 14 tranches et fin du quotient conjugal | 1 | 1 | 1 | 3 | sortie du modèle | — | 100 % | barème de l'impôt sur le revenu : paramètre, assiette mesurée, réaction modélisée |
| RN | F01 | Taxe sur les rachats d'actions | 1 | 1 | 0 | 2 | 0,3 | 29 % | 70 % | rachats d'actions : même type que LFI R11 |
| RN | F02 | Impôt sur la fortune financière (IFF) en remplacement de l'IFI | 0 | 1 | 1 | 2 | sortie du modèle | — | 70 % | impôt sur la fortune financière : barème non publié ; l'ISF a existé |
| RN | F03 | Impôt sur les sociétés assis en partie sur le chiffre d'affaires (méca | 0 | 0 | 0 | 0 | 7,5 | 13 % | 10 % | impôt assis sur le chiffre d'affaires : sans texte, conventions fiscales et UE, précédent censuré (2017) |
| RN | F04 | Taxe sur les superdividendes (0,75) et récupération des aides aux entr | 0 | 0 | 0 | 0 | 0,9 | 74 % | 10 % | surtaxes diverses : contribution sur les dividendes censurée en 2017 |
| RN | F05 | Autorité de la concurrence et cartels des marchés publics | 0 | 1 | 0 | 1 | 7,0 | 11 % | 35 % | amendes de la concurrence : pas d'obstacle, rendement aléatoire |
| RN | F06 | Prélèvement de la TVA à la source (retenue à la source entre entrepris | 1 | -1 | 0 | 0 | 18,0 | 8 % | 10 % | TVA à la source : dérogation à la directive TVA, unanimité du Conseil |
| RN | F07 | Autres recettes (redevance sur le marché historique 0,8, réseaux numér | 0 | 0 | 0 | 0 | 2,1 | 47 % | 10 % | autres recettes (services numériques, redevances) : droit de l'UE |
| RN | F08 | Taxe de 1 000 € par an à l'embauche d'un salarié extra-européen | 1 | 0 | 0 | 1 | 1,0 | 20 % | 35 % | taxe à l'embauche d'étrangers : égalité, droit de l'UE |
| RN | F09 | Taxation à 14 % des transferts d'argent vers les pays tiers | 1 | -1 | 0 | 0 | 1,9 | 31 % | 10 % | taxe sur les transferts d'argent vers l'étranger : libre circulation des capitaux (art. 63 TFUE) |
| RN | I01 | Prestations de solidarité réservées aux étrangers ayant travaillé au m | 1 | -1 | 0 | 0 | 12,2 | 16 % | 10 % | prestations réservées aux étrangers : décision 2024-6 RIP du Conseil constitutionnel |
| RN | I02 | Prestations familiales réservées aux foyers dont un parent est françai | 1 | -1 | 0 | 0 | 5,9 | 17 % | 10 % | prestations familiales réservées : même décision |
| RN | I03 | Aide médicale d'État remplacée par une aide médicale d'urgence (AME →  | 1 | 0 | 1 | 2 | 1,1 | 45 % | 70 % | aide médicale d'État : protection de la santé (préambule de 1946), précédents européens |
| RN | I04 | Asile, visa pour soins, départs, frais de scolarité des étudiants étra | 1 | 0 | 0 | 1 | 3,6 | 44 % | 35 % | asile, visas, frais de scolarité : directives européennes, CEDH |
| RN | U01 | Baisse unilatérale de la contribution de la France au budget de l'Unio | 1 | -1 | 0 | 0 | 13,1 | 6 % | 10 % | baisse unilatérale de la contribution à l'UE : ressources propres arrêtées à l'unanimité (art. 311 TFUE) |
| RN | U02 | Restitution à la France de sa part des droits de douane collectés par  | 1 | -1 | 0 | 0 | 2,2 | 9 % | 10 % | restitution des droits de douane : même article |
| RN | A01 | Suppression et réinternalisation des agences et opérateurs | 0 | 1 | 0 | 1 | 10,1 | 15 % | 35 % | agences et opérateurs : pas d'obstacle juridique, les suppressions annoncées se sont peu réalisées |
| RN | A02 | Aide publique au développement et action extérieure (2,1), subventions | 1 | 0 | 0 | 1 | 4,6 | 65 % | 35 % | aide au développement et action extérieure : autonomie des assemblées pour une partie |
| RN | A03 | Logement social et aides au logement (3,2 + 1,0), chèques apprentissag | 1 | 0 | 0 | 1 | 12,8 | 27 % | 35 % | logement social et aides : libre administration pour la taxe foncière |
| RN | A04 | Transferts entre administrations : écrêtement de la TVA des collectivi | 1 | 0 | 0 | 1 | 7,0 | 7 % | 35 % | écrêtement des transferts aux collectivités : libre administration (art. 72) |
| RN | K01 | Effectifs locaux, 35 heures, compétences strictes, suppression des EPC | 0 | 0 | 0 | 0 | 8,4 | 29 % | 10 % | dépenses des collectivités : l'État ne décide pas de leurs effectifs |
| RN | K02 | Baisse des dépenses des collectivités vers les associations hors intér | 0 | 0 | 0 | 0 | 2,0 | 25 % | 10 % | dépenses des collectivités : même obstacle |
| RN | H01 | Coûts hospitaliers et parcours de soins | 0 | 1 | 0 | 1 | 8,3 | 24 % | 35 % | coûts hospitaliers : mesure non détaillée, ONDAM voté chaque année |
| RN | H02 | Lutte contre les dépenses indues et le travail dissimulé | 0 | 1 | 0 | 1 | 9,5 | 16 % | 35 % | lutte contre les dépenses indues : rendement des contrôles non prouvé à l'ampleur annoncée |
| RN | H03 | Rationalisation des affections de longue durée et arrêts longs | 0 | 0 | 0 | 0 | 3,0 | 33 % | 10 % | affections de longue durée : préambule de 1946 (santé) |
| RN | H04 | « Réparation du système de retraite actuel » (corrections de mesures « | 0 | 0 | 0 | 0 | 15,0 | 20 % | 10 % | réparation du système de retraite : droits acquis, mesure non détaillée |
| RN | H05 | Systèmes d'information et gouvernance de la Sécurité sociale (ASU, rap | 0 | 1 | 0 | 1 | 2,3 | 44 % | 35 % | systèmes d'information et gouvernance : pas d'obstacle, économies rarement réalisées |
| RN | H06 | Autres économies de protection sociale (kiné en accès direct, médicame | 0 | 0 | 0 | 0 | 7,1 | 56 % | 10 % | autres économies de protection sociale : liberté contractuelle, mesures non détaillées |
| RN | G01 | Prix national de l'électricité : suppression des tarifs préférentiels  | 0 | 0 | 0 | 0 | 9,3 | 9 % | 10 % | prix national de l'électricité : contrats en cours, mécanisme non détaillé |
| RN | G02 | Dividendes d'EDF (exportation du surplus d'électricité, 3,7), TURPE (2 | 0 | 0 | 0 | 0 | 5,7 | 14 % | 10 % | dividendes d'EDF : indépendance du régulateur, mécanisme non détaillé |
| RN | G05 | Réforme de MaPrimeRénov' (« 100 % Rénov' ») et plan « 100 % Clim' » :  | 0 | 1 | 0 | 1 | 5,9 | 17 % | 35 % | MaPrimeRénov' : réforme non détaillée |
| RN | R30 | Mesures du PLF/PLFSS 2027 du gouvernement conservées par le RN | 1 | 1 | 1 | 3 | 3,6 | 83 % | 100 % | mesures du PLF/PLFSS 2027 déjà chiffrées par le gouvernement |
| LR (Retailleau) | LR01 | Non-remplacement de 400 000 agents partant à la retraite d'ici 2032 (1 | 1 | 1 | 0 | 2 | 25,0 | 48 % | 70 % | non-remplacement de départs : comme M-M1 ; 2007-2012 partiellement réalisé |
| LR (Retailleau) | LR02 | Contrats non renouvelés et départs volontaires hors retraite (opérateu | 0 | 1 | 0 | 1 | 5,0 | 30 % | 35 % | contrats non renouvelés : non détaillé |
| LR (Retailleau) | LR03 | Suppression de la quasi-totalité des agences et opérateurs de l'État | 0 | 1 | 0 | 1 | 7,5 | 27 % | 35 % | agences et opérateurs : même type que RN A01 |
| LR (Retailleau) | LR04 | Budgets « base zéro » des interventions de l'État | 0 | 1 | 0 | 1 | 11,5 | 22 % | 35 % | budgets base zéro : non détaillé |
| LR (Retailleau) | LR05 | Doublons entre l'État et les collectivités (dépenses de l'État) | 0 | 0 | 0 | 0 | 4,0 | 25 % | 10 % | doublons État et collectivités : libre administration |
| LR (Retailleau) | LR06 | Absentéisme dans la fonction publique : trois jours de carence, autori | 0 | 1 | 0 | 1 | 3,0 | 33 % | 35 % | absentéisme : non détaillé |
| LR (Retailleau) | LR07 | Délégation au privé de fonctions support (immobilier, achats, systèmes | 0 | 1 | 0 | 1 | 5,0 | 20 % | 35 % | délégation au privé de fonctions support : non détaillé |
| LR (Retailleau) | LR08 | Transfert de la formation professionnelle aux régions | 0 | 1 | 0 | 1 | 6,0 | 17 % | 35 % | formation professionnelle aux régions : non détaillé |
| LR (Retailleau) | LR09 | Postes agrégés : soutien au photovoltaïque et à l'éolien, aide au déve | 0 | 1 | 0 | 1 | 23,0 | 39 % | 35 % | postes agrégés (énergie, aides) : non détaillé |
| LR (Retailleau) | LR10 | Fin des subventions aux associations « qui contestent ou entravent la  | 0 | 0 | 0 | 0 | 3,0 | 10 % | 10 % | subventions aux associations ciblées : égalité, liberté d'association |
| LR (Retailleau) | LR11 | Économies de l'État non détaillées (96 Md€ annoncés, 93 retrouvés lign | 0 | 1 | 0 | 1 | 3,0 | 17 % | 35 % | économies de l'État non détaillées |
| LR (Retailleau) | LR12 | Retraites : âge minimal de 63 ans avec décote de 7 % par an, taux plei | 1 | 1 | 1 | 3 | 12,0 | 42 % | 100 % | âge minimal et décote : réformes de 2010 et 2023 chiffrées |
| LR (Retailleau) | LR13 | Retraites, autres leviers : capitalisation partielle pour les jeunes,  | 0 | 0 | 0 | 0 | 30,0 | 3 % | 10 % | autres leviers retraite (capitalisation) : transition et droits acquis |
| LR (Retailleau) | LR14 | Assurance chômage et prestations sociales | 0 | 1 | 0 | 1 | 30,0 | 27 % | 35 % | assurance chômage et prestations : non détaillé |
| LR (Retailleau) | LR15 | Arrêts maladie : jour de carence « d'ordre public » dans le privé | 1 | 1 | 0 | 2 | 4,0 | 25 % | 70 % | jour de carence : précédent 2012-2014 aux effets contestés |
| LR (Retailleau) | LR16 | Immigration (dont 4,5 Md€ conditionnés à une révision de la Constituti | 1 | 0 | 0 | 1 | 10,0 | 20 % | 35 % | immigration : une partie conditionnée à une révision constitutionnelle |
| LR (Retailleau) | LR17 | Fraude fiscale et sociale | 0 | 1 | 0 | 1 | 5,0 | 20 % | 35 % | fraude : rendement des contrôles non prouvé à l'ampleur annoncée (même réponse que LFI R12) |
| LR (Retailleau) | LR18 | Effort des 2 232 collectivités de plus de 10 M€ de budget (fonctionnem | 0 | 0 | 0 | 0 | 10,0 | 30 % | 10 % | effort des collectivités : libre administration |
| Horizons (Philippe), lecture de notre simulateur | PH01 | Retraites : âge légal porté à 65 ans et durée à 45 annuités « en moins | 1 | 1 | 1 | 3 | 16,0 | — | 100 % | âge légal à 65 ans et 45 annuités : même type que LR12 (réformes de 2010 et 2023 exécutées et chiffrées) ; montant = notre lecture (H-PH1) |
| Horizons (Philippe), lecture de notre simulateur | PH02 | Non-remplacement d'un fonctionnaire sur trois partant à la retraite :  | 1 | 1 | 0 | 2 | 12,0 | — | 70 % | non-remplacement d'un départ sur trois : même type que LR01 et M-M1 (2007-2012 partiellement réalisé) |
| Horizons (Philippe), lecture de notre simulateur | PH03 | Assurance chômage : indemnisation limitée à 12 mois pour les moins de  | 1 | 1 | 0 | 2 | 3,5 | — | 70 % | chômage limité à 12 mois pour les moins de 50 ans : paramètre précis, aucun obstacle majeur (l'État a fixé les règles par décret en 2019 et 2023) ; réforme de 2023 exécutée mais rendement constaté non relu : E 0 par prudence |
| Horizons (Philippe), lecture de notre simulateur | PH04 | Trois jours de carence non payés pour tous les actifs, dans le privé c | 1 | 1 | 0 | 2 | 0,5 | — | 70 % | trois jours de carence : même type que LR15 (précédent 2012-2014 aux effets contestés) |
| Horizons (Philippe), lecture de notre simulateur | PH05 | Pacte fiscal : 50 Md€ d'« aides publiques improductives » aux entrepri | 0 | 1 | 1 | 2 | 50,0 | — | 70 % | aides aux entreprises « improductives », sans liste : même type que les niches de LFI (R02) et les exonérations du PS (PS04) |
| PS et Place publique | PS01 | Impôt plancher de 2 % sur les patrimoines de plus de 100 M€ (« taxe Zu | 1 | 0 | 0 | 1 | sortie du modèle | — | 35 % | impôt plancher de 2 % : même type que LFI R04 |
| PS et Place publique | PS02 | CSG sur les gros héritages, calculée sur le total reçu au cours de la  | 1 | 0 | 0 | 1 | 10,0 | 50 % | 35 % | CSG sur les gros héritages : base constitutionnelle incertaine, sans précédent |
| PS et Place publique | PS03 | Taxe sur les géants du numérique (relèvement de la taxe sur les servic | 1 | 1 | 0 | 2 | 10,0 | 20 % | 70 % | taxe sur les services numériques : même type que LFI R08 |
| PS et Place publique | PS04 | Révision des exonérations de cotisations sociales (« niches » sociales | 0 | 1 | 1 | 2 | 4,0 | 75 % | 70 % | exonérations de cotisations : même type que LFI R02 |
| PS et Place publique | PS05 | Réforme des niches fiscales | 0 | 1 | 1 | 2 | 4,0 | 62 % | 70 % | niches fiscales : même type que LFI R02 |
| PS et Place publique | PS06 | Économies sur les marges dans les dépenses de santé | 0 | 1 | 0 | 1 | 4,0 | 38 % | 35 % | marges dans la santé : non détaillé |
| PS et Place publique | PS07 | Économies de fonctionnement de l'État | 0 | 1 | 0 | 1 | 3,6 | 69 % | 35 % | fonctionnement de l'État : même type que LR03 |
| PS et Place publique | PS08a | Lutte contre la fraude fiscale | 0 | 1 | 0 | 1 | 2,4 | 42 % | 35 % | fraude fiscale : même type que LR17 |
| PS et Place publique | PS08b | Lutte contre le travail dissimulé | 0 | 1 | 0 | 1 | 1,1 | 36 % | 35 % | travail dissimulé : même type que LR17 |
| PS et Place publique | PS08c | Économies annoncées non détaillées (17,5 Md€ annoncés, 15,1 détaillés) | 0 | 1 | 0 | 1 | 2,4 | 21 % | 35 % | économies non détaillées : même type que LR11 |
| Glucksmann, livret climat (chiffrage partiel) | GL02 | Contribution exceptionnelle pour l'investissement climatique sur les p | 0 | 0 | 0 | 0 | 50,0 | 10 % | 10 % | contribution exceptionnelle de 50 Md€ sur les plus hauts patrimoines, une seule année : ni seuil, ni taux, ni assiette dans le livret (M 0) ; égalité devant les charges publiques et caractère confiscatoire, levable par la conception (J 0) ; aucun précédent récent en France (E 0) |
| LFI, contre-budget 2027 | R01a à R12 | mêmes 13 lignes de recette que LFI (hors R13) | | | | | | | | mêmes réponses (M, J, E) que la colonne principale de LFI (`F.CLASSEMENT['lfi_cb']`) |
| Notre système | M-PAT | Fonction du patrimoine à 1,25 % (taux marginal maximal, K = 700 k€, pl | 1 | 1 | 1 | 3 | 20,9 | — | 100 % | fonction du patrimoine à 1,25 % de taux marginal maximal (décision du 11/11/2026), plafonnée à 75 % du revenu : M 1 (assiette et mécanisme précis, mais impôt annuel nouveau, ≈ 21 Md€ de recette nette) ; J 1 (taux inférieur au 1,5 % validé par le Conseil constitutionnel en 2012 avec plafonnement, sources/impot-patrimoine-constitutionnel.md ; ⚠️ pas de décision sur ce régime exact) ; E 1 (précédent suisse, ≈ 1,2 % du PIB de recettes ; ⚠️ fragile : avec l'ISF français seul comme précédent, ≈ 5 Md€, E serait 0). Avant le 11/11 : 3 % sans plafonnement, classé (1, 0, 0) |
| Notre système | M-TRANS | Transmissions : abattement de 300 000 €, taux, exil et déclaration au  | 1 | 1 | 1 | 3 | 8,8 | — | 100 % | successions : abattement et taux, même type que LFI R05 sans le plafond d'héritage |
| Notre système | M-PENS | Courbe des pensions relevée à 9 Md€ : fuite sur les pensions 3 / 8 / 1 | 1 | 1 | 1 | 3 | 9,0 | — | 100 % | courbe des pensions : prélèvement sur les pensions, type CSG |
| Notre système | M-REV | Fonction des revenus (a = 0,6733) : comportement des actifs, des retra | 1 | 1 | 1 | 3 | 1,4 | — | 100 % | fonction des revenus : même type que LFI R13 |
| Notre système | M-CRED | Crédit d'IS à 50 % : rendement au scénario (transmissions_0611.js cred | 1 | 1 | 0 | 2 | 9,3 | — | 70 % | crédit d'IS : mécanisme nouveau |
| Notre système | M-FO | Fiscalité d'orientation (9,59 Md€ au bas de sa fourchette) : réactions | 1 | 1 | 0 | 2 | 9,6 | — | 70 % | fiscalité d'orientation : la taxe carbone de 2014-2018 a été retirée sous la pression de la rue |
| Notre système | M-TVA | TVA à 5 % / 10 % / 20 % (TV01-TV10) | 1 | 1 | 1 | 3 | 7,1 | — | 100 % | TVA : taux et assiette connus, réaction modélisée |
| Notre système | M-CONV | Conversions en salaire à coût employeur inchangé : part patronale de l | 1 | 1 | 0 | 2 | 7,6 | — | 70 % | conversion de niches sociales en salaire : mécanisme précis mais sans précédent |
| Notre système | M-M1 | Non-remplacement d'un départ sur deux ou fonctionnaires (M1f) : part r | 1 | 1 | 0 | 2 | 11,5 | — | 70 % | non-remplacement de départs : même type que LR01 |
| Notre système | M-M3 | Temps de travail dans la fonction publique : 27 000 ETP, réalisation 8 | 0 | 1 | 0 | 1 | 0,4 | — | 35 % | temps de travail dans la fonction publique : même type que LR06 |
| Notre système | M-DET | Socle suspendu en détention : économie | 0 | 1 | 0 | 1 | 0,5 | — | 35 % | économie en détention : non détaillé |
| Notre système | M-ECO | Économies de fonctionnement de niveau 2 : 0,9 / 1,9 / 4,9 Md€ (le nive | 0 | 1 | 0 | 1 | 1,9 | — | 35 % | économies de fonctionnement : même type que LR03 et PS07 |
| Notre système | M-URSSAF | Gestion de l'Urssaf : économie de fonctionnement (consolidation_0611.j | 0 | 1 | 0 | 1 | 0,2 | — | 35 % | gestion de l'Urssaf : même type |
| Notre système | M-FIOUL | Taxe sur le fioul de chauffage : érosion du parc, au scénario | 1 | 1 | 1 | 3 | 0,2 | — | 100 % | taxe sur le fioul : taux et assiette connus |
| Notre système | M-RESID | Résidu de la mesure de la v5.10 (bonus d'activité de 100 €, reprise du | 1 | 1 | 0 | 2 | 0,3 | — | 70 % | résidu du bonus d'activité : mécanisme précis, sans précédent |
| Notre système | M-OM | Outre-mer : sur-rémunérations, prix alimentaires (OM01, OM02) | 0 | 1 | 0 | 1 | 0,2 | — | 35 % | sur-rémunérations outre-mer : non détaillé |
| Notre système | M-PL | Plancher en deux parts (627 + 250 €) et coefficient de lieu (PL01, PL0 | 1 | 1 | 0 | 2 | 1,7 | — | 70 % | plancher en deux parts : mécanisme précis, sans précédent |
| Notre système | F | Leviers votés (hausses de taux calées pour une dette stable) | 1 | 1 | 1 | 3 | 33,3 | — | 100 % | leviers votés calés (hausses de taux de nos fonctions) : paramètre de barème comme LFI R13 |
| Notre système | TR03 | Impôt de suite sur la fonction du patrimoine (2,28 Md€) | 1 | 1 | 0 | 2 | 2,3 | — | 70 % | impôt de suite sur la fonction du patrimoine : mécanisme précis, sans précédent |
| Notre système | M-M2 | Point d'indice : prix − 0,5 point pendant 4 ans | 1 | 1 | 1 | 3 | 3,8 | — | 100 % | gel relatif du point d'indice : précédent 2010-2016 |
| Notre système | M-GM | Grand ménage (non-remplacement, gestion, regroupements d'organismes) : | 0 | 1 | 0 | 1 | 1,9 | — | 35 % | grand ménage (non-remplacement, gestion, regroupements d'organismes) : économie nette modélisée mais non détaillée ligne à ligne dans le banc ; même type que M-ECO et M-M3 |
| Notre système | SOCLE | Socle hérité non décomposé (le modèle n'en publie ni les lignes ni les | — | — | — | 2 | 23,5 | — | 70 % | socle hérité non décomposé : classe du milieu par défaut (score 2) |

---

Page générée par `modeles/banc-programmes/rapport_v2.py` ; aucun chiffre n'y est tapé à la main. Écrite par Claude (IA d'Anthropic) pour l'auteur ; conflit d'intérêts déclaré.
