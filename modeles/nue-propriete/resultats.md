---
titre: Payer la contribution sur le patrimoine en nue-propriété : résultats (T82)
date: 2026-11-09
statut: généré par code/rapport.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Nue-propriété : résultats

Généré par `python3 -I modeles/nue-propriete/code/rapport.py`. Écrit par Claude (IA d'Anthropic) pour l'auteur. Méthode et hypothèses HNP1 à HNP20 : `methode.md`. Unités : Md€ de 2025 indexés sur le PIB nominal (convention du banc d'essai). Graine 20261109, 3000 lignées représentatives par tranche. Écarts **par rapport à la fonction actuelle** (v7.5 retenue, report d'encaissement compris). Rien ici ne modifie la fonction du patrimoine, le banc ni le modèle de taux.

## 0. Calage

Assujettis retenus (patrimoine net ≥ 500 000 €) : 8,57 M de ménages. Dû net de comportements reconstitué sur ces tranches : 45,1 Md€ par an (v7.5 : 45,2 Md€ pour toute la courbe ; les tranches sous 500 000 € en paient 0,2). Espérance de vie à 65 ans du modèle de mortalité : 21,6 ans.

| Tranche | Ménages | Courbe moyenne (€) | Dû net (Md€/an) | Part différée | Part productive de la courbe |
|---|---|---|---|---|---|
| 500-750 k€ | 3 265 593 | 190 339 | 0,86 | 0 % | 26 % |
| 750 k€-1 M€ | 1 957 826 | 348 647 | 1,86 | 4 % | 34 % |
| 1-2 M€ | 2 324 918 | 743 694 | 10,06 | 26 % | 50 % |
| 2-5 M€ | 832 822 | 2 101 367 | 14,86 | 65 % | 57 % |
| 5-20 M€ | 173 203 | 7 333 580 | 12,35 | 78 % | 63 % |
| 20-100 M€ | 13 500 | 33 217 173 | 4,03 | 79 % | 58 % |
| > 100 M€ | 686 | 173 019 969 | 1,03 | 78 % | 57 % |

Série de référence pour la dette : notre système (banc, trajectoire de référence, prolongée à son niveau de 2058 jusqu'en 2088) **plus 42 Md€ d'effort** qui la stabilise au taux endogène central (modèle T74). Les écarts de dette ci-dessous sont mesurés par rapport à cette trajectoire stabilisée.

## 1. Neuf scénarios (participation × coefficient)

Trésorerie : écart de solde public (négatif = perte) : fonction du patrimoine (comptant et recouvrement du différé), fonction des transmissions sur les biens qui reviennent à l'État, revenus (2 % par an) des biens revenus en pleine propriété publique. Actifs récupérés : valeur pleine des biens dont l'État devient plein propriétaire au décès (cumul). Dette : écart de dette brute (points de PIB). Patrimoine net : − écart de dette + nue-propriété détenue (barème de l'art. 669) + pleine propriété publique − créances de différé qui n'existent plus.

| Participation | c | Part du dû des participants | Âge moyen / sans héritier | Trésorerie 2030 | 2038 | 2048 | 2058 | 2068 | Actifs récupérés 2048 / 2068 / 2088 | Dette 2038 / 2058 (pts) | Patrimoine net 2058 (pts) | Effort pour restabiliser |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 % | 0,5 | 6 % | 66 ans / 39 % | −1,2 | −2,0 | −2,4 | −2,0 | −1,8 | 15 / 64 / 123 | +0,6 / +3,5 | −1,1 | 2 Md€ |
| 5 % | 0,3 | 6 % | 66 ans / 39 % | −1,2 | −2,0 | −2,4 | −2,0 | −1,7 | 14 / 62 / 117 | +0,6 / +3,5 | −1,2 | 2 Md€ |
| 5 % | 0,1 | 6 % | 66 ans / 39 % | −1,2 | −2,0 | −2,3 | −2,0 | −1,7 | 14 / 60 / 112 | +0,6 / +3,5 | −1,3 | 2 Md€ |
| 20 % | 0,5 | 24 % | 65 ans / 37 % | −4,9 | −7,6 | −8,7 | −7,8 | −6,7 | 63 / 250 / 480 | +2,4 / +14,2 | −4,8 | 8 Md€ |
| 20 % | 0,3 | 24 % | 65 ans / 37 % | −4,9 | −7,6 | −8,7 | −7,8 | −6,7 | 62 / 242 / 459 | +2,4 / +14,2 | −5,2 | 8 Md€ |
| 20 % | 0,1 | 24 % | 65 ans / 37 % | −4,9 | −7,6 | −8,6 | −7,8 | −6,6 | 61 / 234 / 439 | +2,4 / +14,1 | −5,5 | 8 Md€ |
| 50 % | 0,5 | 57 % | 65 ans / 30 % | −12,0 | −18,6 | −20,9 | −19,8 | −17,3 | 146 / 613 / 1204 | +6,0 / +38,0 | −14,8 | 19 Md€ |
| 50 % | 0,3 | 57 % | 65 ans / 30 % | −12,0 | −18,5 | −20,9 | −19,8 | −17,3 | 144 / 593 / 1150 | +6,0 / +37,9 | −15,7 | 19 Md€ |
| 50 % | 0,1 | 57 % | 65 ans / 30 % | −12,0 | −18,5 | −20,9 | −19,7 | −17,2 | 142 / 574 / 1101 | +6,0 / +37,9 | −16,5 | 19 Md€ |

## 2. Détail : participation 20 %, c = 0,3

| Année | Fonction du patrimoine | Transmissions | Revenus des biens publics | Trésorerie | Nue-propriété reçue (valeur fiscale) | Biens cédés (valeur pleine) | Actifs récupérés dans l'année |
|---|---|---|---|---|---|---|---|
| 2029 | −4,3 | −0,1 | 0,0 | −4,4 | 10,6 | 18,9 | 0,3 |
| 2030 | −4,8 | −0,1 | 0,0 | −4,9 | 10,4 | 18,4 | 0,6 |
| 2033 | −5,9 | −0,2 | 0,0 | −6,1 | 9,8 | 16,8 | 0,9 |
| 2038 | −7,1 | −0,7 | 0,2 | −7,6 | 8,8 | 14,4 | 3,1 |
| 2043 | −7,8 | −1,2 | 0,5 | −8,5 | 8,1 | 13,0 | 5,5 |
| 2048 | −8,2 | −1,6 | 1,1 | −8,7 | 7,3 | 11,5 | 6,6 |
| 2058 | −8,5 | −1,9 | 2,6 | −7,8 | 6,2 | 9,8 | 9,1 |
| 2068 | −8,8 | −2,5 | 4,6 | −6,7 | 5,6 | 9,1 | 11,8 |
| 2078 | −9,3 | −2,4 | 6,9 | −4,8 | 5,4 | 9,0 | 11,5 |
| 2088 | −10,1 | −1,6 | 9,0 | −2,7 | 5,5 | 9,2 | 9,4 |

| Année | Dette de référence (% PIB) | Écart de dette, taux endogène (pts) | Écart à taux fixe 4,7 % (pts) | Nue-propriété (Md€) | Pleine propriété (Md€) | Créances différées (Md€) | Patrimoine net, endogène / taux fixe (pts) |
|---|---|---|---|---|---|---|---|
| 2038 | 130,5 | +2,4 | +2,2 | 95 | 15 | −40 | −0,1 / 0,2 |
| 2048 | 129,8 | +7,0 | +5,5 | 159 | 62 | −54 | −1,5 / 0,1 |
| 2058 | 123,9 | +14,2 | +9,2 | 189 | 139 | −58 | −5,2 / −0,2 |
| 2068 | 112,7 | +24,4 | +13,2 | 188 | 242 | −61 | −12,0 / −0,8 |
| 2088 | 76,3 | +54,4 | +21,1 | 159 | 459 | −69 | −36,1 / −2,8 |

Dette brute : 2,4 / 14,2 / 54,4 points de PIB de plus en 2038 / 2058 / 2088 ; patrimoine net des administrations : −0,1 / −5,2 / −36,1 points. Somme actualisée (taux réel 1,7 %, r − g du banc) de la trésorerie sur 60 ans : −255 Md€ ; valeur des actifs détenus en 2088 (nue-propriété + pleine propriété) : 549 Md€.

## 3. Part du capital productif des assujettis passée en nue-propriété publique (démembré) ou en pleine propriété publique

Dénominateur : titres et biens professionnels de la courbe des ménages de 500 000 € et plus dans le modèle, 3 370 Md€ (indexé sur le PIB). Les comptes de patrimoine de l'Insee (2024) donnent 2 424 Md€ d'actions, de parts de fonds et d'actifs productifs pour **tous** les ménages : l'enquête et le modèle en comptent davantage dans le haut de la distribution (composition par tranche, valeur des non cotés). Le capital productif **national** (sociétés détenues par l'étranger, les institutions, l'État) est plus grand encore : rapportées à lui, ces parts seraient plus faibles (⚠️ dénominateur national non chiffré).

| Participation | c | 20 ans (2048) : démembré / plein | 40 ans (2068) | 60 ans (2088) |
|---|---|---|---|---|
| 5 % | 0,5 | 1,1 % / 0,2 % | 1,2 % / 1,1 % | 1,0 % / 2,1 % |
| 5 % | 0,3 | 1,1 % / 0,2 % | 1,1 % / 1,0 % | 0,9 % / 2,0 % |
| 5 % | 0,1 | 1,0 % / 0,2 % | 1,1 % / 1,0 % | 0,9 % / 1,9 % |
| 20 % | 0,5 | 4,1 % / 1,0 % | 4,5 % / 4,2 % | 3,8 % / 8,0 % |
| 20 % | 0,3 | 3,9 % / 1,0 % | 4,3 % / 4,0 % | 3,7 % / 7,6 % |
| 20 % | 0,1 | 3,8 % / 1,0 % | 4,1 % / 3,9 % | 3,6 % / 7,3 % |
| 50 % | 0,5 | 10,2 % / 2,4 % | 11,4 % / 10,2 % | 8,8 % / 19,9 % |
| 50 % | 0,3 | 9,9 % / 2,4 % | 10,9 % / 9,8 % | 8,5 % / 19,0 % |
| 50 % | 0,1 | 9,6 % / 2,4 % | 10,5 % / 9,5 % | 8,3 % / 18,1 % |

## 4. Variantes (participation 20 %, c = 0,3)

| Variante | Trésorerie 2030 / 2048 / 2068 | Actifs récupérés en 20 / 40 / 60 ans | Dette 2058 (pts) | Patrimoine net 2058 (pts) | Âge moyen des participants |
|---|---|---|---|---|---|
| sans perte sur les transmissions | −4,8 / −7,1 / −4,2 | 62 / 242 / 459 | +12,6 | −3,6 | 65 ans |
| rendement des biens publics 1 % | −4,9 / −9,2 / −9,0 | 62 / 242 / 459 | +14,8 | −5,8 | 65 ans |
| rendement des biens publics 3 % | −4,9 / −8,1 / −4,4 | 62 / 242 / 459 | +13,5 | −4,6 | 65 ans |
| choix indépendant de l'âge et des héritiers | −4,2 / −7,1 / −5,7 | 50 / 201 / 382 | +11,8 | −4,2 | 66 ans |
| cession aux salariés : 20 % des participants de 1 M€ et plus (plus 138 Md€ en usufruit aux salariés, nue-propriété publique, rendus après 30 ans) | −4,9 / −8,8 / −4,6 | 54 / 217 / 418 | +14,4 | −6,5 | 65 ans |
| espérance de vie à 65 ans + 3 ans | −4,9 / −8,8 / −7,0 | 52 / 226 / 439 | +14,4 | −5,4 | 65 ans |
| tous les ménages seuls (pas d'usufruit réversible) | −4,9 / −8,4 / −6,6 | 72 / 260 / 477 | +14,0 | −4,9 | 65 ans |

**Lecture.** (1) **La perte de trésorerie ne dépend presque pas du coefficient** : un participant ne verse plus rien en argent, quel que soit c. Le coefficient ne change que la quantité de biens cédés, donc ce que l'État récupère : un coefficient bas est une récompense payée en actifs, pas en argent. Du seul point de vue des finances publiques, c = 0,5 domine c = 0,1. (2) La perte suit la participation, un peu plus que proportionnellement, parce que les patrimoines les plus gros et les plus illiquides choisissent plus souvent la nue-propriété (part du dû des participants supérieure à leur part en nombre). (3) Elle grossit pendant une vingtaine d'années (le différé de la fonction actuelle aurait été recouvré, les droits de succession sur les biens qui reviennent à l'État disparaissent), puis se réduit quand les biens revenus à l'État rapportent ; elle ne s'annule pas en 60 ans : les biens publics rapportent 2 % par an, moins que la contribution et les droits de succession qu'ils auraient payés en mains privées. (4) **À taux fixe, l'opération est presque neutre pour le patrimoine net** de l'État : de l'argent en moins, des actifs en plus. **Avec le taux endogène, elle ne l'est plus** : la dette brute plus haute relève la prime de risque sur tout le stock de dette, et cette charge n'a pas de contrepartie en actifs. Les marchés et la règle européenne regardent la dette brute (modèle T74). Les chiffres au-delà de 2058 sortent de l'horizon du modèle de taux (série du système prolongée à plat).

