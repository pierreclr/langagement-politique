---
titre: Foncière d'État et accession à l'usufruit à vie (T81) — résultats
statut: brouillon ; généré par code/calculer.py ; écrit par Claude (IA d'Anthropic) pour l'auteur ; des ordres de grandeur sous hypothèses, jamais des prédictions
---

# Foncière d'État et accession à l'usufruit à vie : résultats

Fichier généré par `code/calculer.py` (et `code/preparer_secteurs.py` pour les prix et loyers par secteur) ; hypothèses dans `methode.md`. Deux parties : la **v2** (09/11/2026, soir), puis la **v1** (sans marge), conservée pour comparaison.

## v2 (09/11/2026, soir) : capital de départ en apport, usufruit forfaitaire, marge de la foncière

**Scénario principal** (décisions de l'auteur du 09/11/2026) : le capital de départ (jusqu'à 40 000 €, dégressif avec l'héritage) n'est plus versé en argent ; c'est **un droit d'apport à la foncière, utilisable de 25 à 35 ans** ; l'usufruit est vendu **70 % de la valeur totale de la transaction, travaux de rénovation compris, quel que soit l'âge** ; le reste est financé sur 25 ans **au taux des banques** (3,32 %, Banque de France, septembre 2026) ; l'occupant paie la contribution sur la résidence principale (0,25 % de la valeur) dès l'accession, **au budget public**, comme tout propriétaire ; pas de redevance à vie. La marge de la foncière est l'écart entre 70 % et la valeur actuarielle de l'usufruit. **Comparaisons** : mensualité égale à celle d'un prêt bancaire ; usufruit actuariel et marge de 0 à 2 points au-dessus du coût de l'argent (3,5 %). Hypothèses H-FU31 à H-FU52 (`methode.md`, § 6). Euros de 2026.

### A. Prix et loyers par secteur (données publiques)

Prix : médianes des ventes d'un seul logement en 2024 (DVF, DGFiP/Etalab, cote A). Loyers : Carte des loyers 2025 (DHUP, cote A ; loyers d'annonce charges comprises, prédits par commune), médiane des communes pondérée par les ventes. Secteurs : aires d'attraction des villes 2020 (Insee, cote A ; H-FU38). Script : `code/preparer_secteurs.py`.

| Secteur | Ventes 2024 | Part | Prix/m² appart. | Prix/m² maison | T2 (médiane) | T3 | T4 | Prix moyen | Loyer/m² T1-T2 | Loyer/m² T3+ | Loyer/m² maison |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Paris | 25 103 | 4 % | 9 602 | 12 380 | 347 800 | 567 006 | 890 000 | 543 112 | 33,3 | 30,4 | 24,8 |
| Grandes métropoles | 212 308 | 33 % | 3 560 | 3 165 | 160 000 | 218 400 | 270 000 | 270 992 | 18,4 | 14,4 | 14,9 |
| Villes moyennes | 275 505 | 42 % | 2 500 | 2 033 | 119 000 | 150 000 | 182 000 | 195 947 | 14,0 | 10,6 | 10,8 |
| Petites villes et rural | 136 511 | 21 % | 2 857 | 1 552 | 121 570 | 124 000 | 150 000 | 176 825 | 12,2 | 8,9 | 9,0 |

**Lecture.** Prix moyen d'un logement vendu en 2024 : 229 895 € (H-FU18 retenait 220 000 €). Un T2 médian vaut 119 000 € en ville moyenne et 347 800 € à Paris. Les appartements du rural sont plus chers au m² que ceux des villes moyennes (stations, littoral) ; les maisons y sont bon marché.

### B. Scénario principal : mensualités des cas types, par secteur

Usufruit = 70 % de la transaction ; financé = usufruit − capital de départ ; 3,32 % sur 25 ans. « Avec travaux » : le même logement acheté comme passoire 10 % sous le prix et rénové pour 500 € par m² (H-FU49). Marge de la foncière = (70 % − usufruit actuariel au taux de tarification 1,48 %) × transaction. Effort = (mensualité + contribution) / revenu net. Coût d'occupation = mensualité + contribution + charges et entretien (0,75 % de la valeur par an, H-FU39), comparé au loyer de marché du même logement. Achat bancaire : pleine propriété, même apport, même taux.

| Secteur | Cas | Prix (€) | Mensualité (€/mois) | Avec travaux : transaction (€) | Avec travaux : mensualité | Contribution (€/mois) | Effort | Achat bancaire (€/mois) | Loyer de marché | Coût d'occupation / loyer | Marge de la foncière |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Paris | Jeune de 25 ans au Smic, T2, capital de départ 40 000 € | 347 800 | 999 | 332 020 | 945 | 72 | 72 % | 1 511 | 1 265 | 1,02 | 34 713 € (10,0 pt) |
| Paris | Couple de 30 ans au Smic, deux enfants, T4, deux capitaux (80 000 €) | 890 000 | 2 666 | 845 000 | 2 512 | 185 | 96 % | 3 977 | 2 429 | 1,40 | 71 511 € (8,0 pt) |
| Paris | 35 ans, seul, T3, capital réduit (20 000 €) | 567 006 | 1 851 | 541 305 | 1 762 | 118 | — | 2 686 | 1 886 | 1,23 | 94 983 € (16,8 pt) |
| Grandes métropoles | Jeune de 25 ans au Smic, T2, capital de départ 40 000 € | 160 000 | 354 | 166 000 | 374 | 33 | 26 % | 589 | 808 | 0,60 | 15 969 € (10,0 pt) |
| Grandes métropoles | Couple de 30 ans au Smic, deux enfants, T4, deux capitaux (80 000 €) | 270 000 | 535 | 285 000 | 587 | 56 | 20 % | 933 | 1 232 | 0,62 | 21 694 € (8,0 pt) |
| Grandes métropoles | 35 ans, seul, T3, capital réduit (20 000 €) | 218 400 | 652 | 229 060 | 689 | 46 | — | 974 | 937 | 0,89 | 36 585 € (16,8 pt) |
| Villes moyennes | Jeune de 25 ans au Smic, T2, capital de départ 40 000 € | 119 000 | 213 | 129 100 | 247 | 25 | 16 % | 388 | 614 | 0,51 | 11 877 € (10,0 pt) |
| Villes moyennes | Couple de 30 ans au Smic, deux enfants, T4, deux capitaux (80 000 €) | 182 000 | 233 | 207 300 | 320 | 38 | 9 % | 501 | 931 | 0,41 | 14 624 € (8,0 pt) |
| Villes moyennes | 35 ans, seul, T3, capital réduit (20 000 €) | 150 000 | 417 | 168 500 | 481 | 31 | — | 638 | 708 | 0,77 | 25 127 € (16,8 pt) |
| Petites villes et rural | Jeune de 25 ans au Smic, T2, capital de départ 40 000 € | 121 570 | 221 | 129 413 | 248 | 25 | 17 % | 401 | 490 | 0,66 | 12 134 € (10,0 pt) |
| Petites villes et rural | Couple de 30 ans au Smic, deux enfants, T4, deux capitaux (80 000 €) | 150 000 | 123 | 180 000 | 226 | 31 | 5 % | 344 | 802 | 0,31 | 12 052 € (8,0 pt) |
| Petites villes et rural | 35 ans, seul, T3, capital réduit (20 000 €) | 124 000 | 328 | 146 100 | 404 | 26 | — | 511 | 611 | 0,71 | 20 772 € (16,8 pt) |

**Lecture.** (1) En ville moyenne, le jeune au Smic paie 213 € par mois pour un T2 médian (247 € s'il le rénove), contre 388 € pour un achat bancaire ; son effort est de 16 % et son coût d'occupation vaut 0,51 fois le loyer du marché : le dispositif est **nettement moins cher que louer** hors de Paris ; à Paris, 999 € par mois (72 % du Smic). (2) La marge de la foncière est de 10,0 pt de la valeur à 25 ans et de 16,8 pt à 35 ans. (3) Les 400 € visés par l'auteur correspondent, en ville moyenne, à un T3 ou à un T2 rénové, pas à un T2 médian.

### C. L'effet de l'âge : pourquoi l'accès s'arrête à 35 ans

| Âge à l'entrée | Usufruit actuariel (1,48 %) | à 2 % | Forfait | Surcoût du forfait | Dans la borne 25-35 ans |
|---|---|---|---|---|---|
| 20 | 63 % | 74 % | 70 % | 11 % | non |
| 25 | 60 % | 71 % | 70 % | 17 % | oui |
| 30 | 57 % | 67 % | 70 % | 23 % | oui |
| 35 | 53 % | 64 % | 70 % | 31 % | oui |
| 40 | 50 % | 60 % | 70 % | 41 % | non |
| 45 | 46 % | 56 % | 70 % | 54 % | non |
| 55 | 37 % | 46 % | 70 % | 89 % | non |
| 65 | 28 % | 36 % | 70 % | 148 % | non |

**Lecture.** Le forfait de 70 % est proche de la valeur d'un usufruit à 25 ans calculée à 2 %, mais il fait payer à un accédant de 35 ans 31 % de plus que la valeur actuarielle (au taux de tarification), à 45 ans 54 %, à 55 ans 89 % : au-delà de 35 ans, le forfait devient une injustice visible. **Borne retenue : de 25 à 35 ans**, parce que le droit est adossé au capital de départ (versé à partir de 25 ans), que la surfacturation reste sous environ 30 % jusqu'à 35 ans, et que l'âge moyen du premier achat est de 39 ans (enquête Logement 2013) : on vise ceux qui achèteraient sinon tard ou jamais. Entrer à 20 ans (§ 15 de l'esquisse) supposerait de débloquer le capital avant 25 ans.

### D. La foncière en scénario principal : autofinancement, test des 50 %, dette

Une part de chaque génération (830 000 jeunes, H-FU50) entre à 25, 30 ou 35 ans (40 / 40 / 20 %) et apporte son capital de départ (moyenne 26 000 € au central, H-FU50) ; montée sur 10 ans ; prix moyen 220 000 € de 2026 ; 20 % de passoires rénovées ; le reste comme la v1 (H-FU19 à H-FU30). Ratio = intérêts reçus / (intérêts payés + gestion + impayés), moyenne sur 3 ans, apprécié à partir de la 5e année (démarrage exclu, H-FU34).

#### 30 % d'une génération utilise son capital de départ comme apport

| Année | Entrants | Acquisitions (Md€) | Besoin de financement (Md€) | Mensualités reçues (Md€) | Dette foncière (Md€) | Dette / PIB | Patrimoine net (Md€) | Recettes / coûts | Effet sur la dette publique si hors APU |
|---|---|---|---|---|---|---|---|---|---|
| 10 (2036) | 249 k | 60,2 | 53,8 | 8,4 | 278 | 8,2 % | 38 | 49 % | 0,2 % |
| 20 (2046) | 249 k | 61,9 | 55,0 | 25,8 | 728 | 19,4 % | 105 | 43 % | 0,6 % |
| 30 (2056) | 249 k | 63,3 | 55,9 | 39,8 | 1 103 | 26,7 % | 184 | 36 % | 1,2 % |
| 45 (2071) | 249 k | 63,2 | 69,0 | 45,3 | 1 643 | 34,4 % | 359 | 26 % | 1,9 % |
| 60 (2086) | 249 k | 55,3 | 76,5 | 49,1 | 2 197 | 39,7 % | 630 | 21 % | 2,2 % |

#### 50 % d'une génération utilise son capital de départ comme apport

| Année | Entrants | Acquisitions (Md€) | Besoin de financement (Md€) | Mensualités reçues (Md€) | Dette foncière (Md€) | Dette / PIB | Patrimoine net (Md€) | Recettes / coûts | Effet sur la dette publique si hors APU |
|---|---|---|---|---|---|---|---|---|---|
| 10 (2036) | 415 k | 99,8 | 89,1 | 14,1 | 459 | 13,5 % | 60 | 49 % | 0,3 % |
| 20 (2046) | 415 k | 103,2 | 91,3 | 43,0 | 1 206 | 32,2 % | 165 | 43 % | 0,8 % |
| 30 (2056) | 415 k | 105,8 | 93,3 | 66,3 | 1 832 | 44,4 % | 291 | 36 % | 1,7 % |
| 45 (2071) | 415 k | 105,9 | 115,6 | 75,4 | 2 737 | 57,3 % | 569 | 26 % | 2,7 % |
| 60 (2086) | 415 k | 92,9 | 128,7 | 81,9 | 3 673 | 66,4 % | 1 007 | 21 % | 2,9 % |

#### 70 % d'une génération utilise son capital de départ comme apport

| Année | Entrants | Acquisitions (Md€) | Besoin de financement (Md€) | Mensualités reçues (Md€) | Dette foncière (Md€) | Dette / PIB | Patrimoine net (Md€) | Recettes / coûts | Effet sur la dette publique si hors APU |
|---|---|---|---|---|---|---|---|---|---|
| 10 (2036) | 581 k | 139,5 | 124,3 | 19,7 | 640 | 18,8 % | 81 | 49 % | 0,3 % |
| 20 (2046) | 581 k | 144,4 | 127,7 | 60,1 | 1 683 | 45,0 % | 225 | 44 % | 1,0 % |
| 30 (2056) | 581 k | 148,3 | 130,6 | 92,8 | 2 560 | 62,0 % | 398 | 36 % | 2,1 % |
| 45 (2071) | 581 k | 148,7 | 162,2 | 105,6 | 3 832 | 80,2 % | 780 | 26 % | 3,4 % |
| 60 (2086) | 581 k | 130,6 | 180,9 | 114,7 | 5 149 | 93,1 % | 1 383 | 21 % | 3,7 % |

#### Scénarios, risques et leviers (50 % d'une génération)

| Variante | Recettes / coûts, min (dès l'an 5) | à l'an 10 | Sous 50 % dès | Besoin an 10 (Md€) | Besoin an 30 | Dette an 30 (Md€) | Dette an 60 | Dette / PIB an 60 | Patrimoine net an 60 |
|---|---|---|---|---|---|---|---|---|---|
| Central | 22 % | 49 % | 2034 | 89,1 | 93,3 | 1 832 | 3 673 | 66,4 % | 1 007 |
| Bas (favorable) | 47 % | 71 % | 2070 | 83,2 | 78,1 | 1 631 | 2 842 | 51,4 % | 3 322 |
| Haut (défavorable : la foncière paie 4,7 %) | 8 % | 35 % | 2031 | 91,1 | 110,9 | 2 000 | 5 047 | 91,2 % | -2 306 |
| Taux du contrat = taux bancaire + 1 point | 33 % | 65 % | 2058 | 87,4 | 82,4 | 1 717 | 3 187 | 57,6 % | 1 520 |
| Taux du contrat = taux bancaire + 2 points | 48 % | 82 % | 2081 | 85,6 | 70,8 | 1 595 | 2 674 | 48,3 % | 2 060 |
| Forfait 80 % au lieu de 70 % | 30 % | 58 % | 2051 | 86,6 | 77,6 | 1 667 | 2 976 | 53,8 % | 1 853 |
| Livret foncier : 300 Md€ à 2 % | 25 % | 79 % | 2049 | 84,0 | 84,5 | 1 702 | 3 303 | 59,7 % | 1 377 |
| Prêt familial : 25 % des entrants | 24 % | 51 % | 2040 | 80,0 | 77,3 | 1 790 | 3 452 | 62,4 % | 1 228 |
| Écart de 0,5 point (emprunt hors APU) | 16 % | 44 % | 2031 | 91,1 | 107,1 | 1 974 | 4 445 | 80,4 % | 234 |
| Taux : +2 points dès l'an 6, contrats fixes | 14 % | 44 % | 2032 | 95,0 | 132,9 | 2 227 | 6 463 | 116,8 % | -1 730 |
| Prix : +1,5 %/an au lieu de 2,5 % | 17 % | 49 % | 2031 | 80,2 | 68,7 | 1 511 | 2 672 | 48,3 % | -65 |
| Ouverture par cercles | 22 % | 51 % | 2040 | 89,3 | 92,9 | 1 764 | 3 632 | 65,7 % | 944 |

**Seuils (central, 50 % d'une génération).** Pour rester au-dessus de 50 % pendant 60 ans, le taux du contrat doit dépasser le taux bancaire d'environ **2,1 pt** (taux de 5,4 %) ; 0,9 pt pour les 30 premières années ; 1,7 pt avec un livret foncier de 300 Md€. Sans toucher au taux, il faudrait un forfait d'usufruit de 85 % pour tenir les 30 premières années (au lieu de 70 %).

**Lecture.** (1) **Au taux des banques, la foncière ne passe pas le test des 50 %** (central : 22 % au plus bas, 49 % à l'an 10) : elle prête l'usufruit à 3,32 % quand l'argent lui coûte 3,5 %, et elle porte à crédit les 30 % de nue-propriété jusqu'au décès ; le forfait de 70 % ne crée qu'une marge en capital, qui ne revient qu'au décès et ne compte pas comme recette courante : la foncière est **rentable en patrimoine, pas en trésorerie**. Elle resterait donc dans les administrations publiques, sauf lecture comptable favorable où la vente de l'usufruit au forfait compterait comme une vente de l'année (⚠️ à faire trancher par l'Insee ou Eurostat ; H-FU29). (2) Le besoin de financement est massif : environ 54, 89 et 124 Md€ par an à l'an 10 (30, 50, 70 % d'une génération), soit 1 à 3 fois les prêts nouveaux du fonds d'épargne (41,6 Md€ en 2025) ; la dette atteint 66 % du PIB à 60 ans à 50 %. C'est la taille d'un grand prêteur immobilier : l'encours des crédits à l'habitat des ménages est de l'ordre de 1 300 Md€ (⚠️ à vérifier, Banque de France). (3) Le patrimoine net reste positif au central (les logements reviennent), mais il devient négatif au haut. (4) Le levier qui compte est **le coût de l'argent** : un livret foncier large ou un taux du contrat supérieur de 1 à 2 points au taux bancaire.

### E. Effet borné sur les prix (capital de départ en apport)

Effet de niveau ≈ (entrants additionnels / ventes) / élasticité (offre + demande) du secteur (H-FU40) ; entrants répartis comme les ventes (1,1 million par an) ; additionnels : 30 / 50 / 70 % des entrants (avancer l'achat de 39 à 25-35 ans ou acheter au lieu de louer, H-FU28).

| Part d'une génération | Entrants par an | Part des ventes | Paris | Grandes métropoles | Villes moyennes | Petites villes et rural |
|---|---|---|---|---|---|---|
| 30 % | 249 k | 23 % | 11,3 % (3,4 % à 31,7 %) | 7,5 % (2,3 % à 21,1 %) | 4,5 % (1,4 % à 12,7 %) | 2,8 % (0,8 % à 7,9 %) |
| 50 % | 415 k | 38 % | 18,9 % (5,7 % à 52,8 %) | 12,6 % (3,8 % à 35,2 %) | 7,5 % (2,3 % à 21,1 %) | 4,7 % (1,4 % à 13,2 %) |
| 70 % | 581 k | 53 % | 26,4 % (7,9 % à 73,9 %) | 17,6 % (5,3 % à 49,3 %) | 10,6 % (3,2 % à 29,6 %) | 6,6 % (2,0 % à 18,5 %) |

**Lecture.** À 50 % d'une génération, la foncière achèterait chaque année l'équivalent de plus d'un tiers des ventes de logements : la demande additionnelle ferait monter le niveau des prix de l'ordre de 4 à 20 % selon les secteurs (central), davantage là où l'offre ne suit pas. Les achats viendraient en partie du parc rendu au décès, mais seulement après plusieurs décennies. **C'est le principal risque du scénario** : sans construction ni montée en charge lente, le capital de départ en apport renchérit les logements qu'il veut rendre accessibles.

### F. Question ouverte : le droit non utilisé à 35 ans

| Part qui l'utilise | Jeunes qui ne l'utilisent pas, par génération | Apports versés à la foncière (Md€/an, croisière) |
|---|---|---|
| 30 % | 581 k | 6,5 |
| 50 % | 415 k | 10,8 |
| 70 % | 249 k | 15,1 |

Pour comparaison, le capital de départ versé en argent coûterait environ 11,5 Md€ par an (garantie dégressive, `modeles/capital-de-depart/`). Options pour le droit non utilisé (à trancher par l'auteur) : (a) **il s'éteint** : simple et moins cher, mais injuste pour qui n'a pas pu acheter (mobilité, santé, revenu) ; (b) **report** au-delà de 35 ans sur motif (naissance, mutation, handicap), avec un forfait d'usufruit plus bas ; (c) **conversion partielle** en compte de formation ou en création d'entreprise (retour aux usages d'origine, sous condition) ; (d) **versement sur une épargne retraite** bloquée ; (e) **transfert** au conjoint ou à un frère ou une sœur qui accède. Recommandation de Claude : (b) + (c), pour ne pas faire du logement le seul usage du capital.

### G. Comparaison 1 : la mensualité d'un prêt bancaire (règle intermédiaire, remplacée)

Mensualité = prêt de (prix − apport) à 3,32 % sur 25 ans ; usufruit actuariel ; primo-accédants de tous âges (v1).

| Secteur | Cas | Prix (€) | Mensualité (€/mois) | Marge implicite | Effort | Loyer de marché | Coût / loyer |
|---|---|---|---|---|---|---|---|
| Paris | Jeune de 25 ans au Smic, T2, apport 40 000 € | 347 800 | 1 511 | 6,3 pt | 107 % | 1 265 | 1,42 |
| Paris | Couple au Smic, deux enfants (32 ans), T4, sans apport | 890 000 | 4 370 | 5,1 pt | 154 % | 2 429 | 2,10 |
| Paris | 40 ans, seul, T3, sans apport | 567 006 | 2 784 | 7,7 pt | — | 1 886 | 1,73 |
| Paris | 55 ans, seul, T3, sans apport (20 ans) | 567 006 | 3 236 | 14,4 pt | — | 1 886 | 1,97 |
| Grandes métropoles | Jeune de 25 ans au Smic, T2, apport 40 000 € | 160 000 | 589 | 8,5 pt | 42 % | 808 | 0,89 |
| Grandes métropoles | Couple au Smic, deux enfants (32 ans), T4, sans apport | 270 000 | 1 326 | 5,1 pt | 47 % | 1 232 | 1,26 |
| Grandes métropoles | 40 ans, seul, T3, sans apport | 218 400 | 1 072 | 7,7 pt | — | 937 | 1,34 |
| Grandes métropoles | 55 ans, seul, T3, sans apport (20 ans) | 218 400 | 1 247 | 14,4 pt | — | 937 | 1,52 |
| Villes moyennes | Jeune de 25 ans au Smic, T2, apport 40 000 € | 119 000 | 388 | 10,9 pt | 28 % | 614 | 0,79 |
| Villes moyennes | Couple au Smic, deux enfants (32 ans), T4, sans apport | 182 000 | 894 | 5,1 pt | 32 % | 931 | 1,12 |
| Villes moyennes | 40 ans, seul, T3, sans apport | 150 000 | 737 | 7,7 pt | — | 708 | 1,22 |
| Villes moyennes | 55 ans, seul, T3, sans apport (20 ans) | 150 000 | 856 | 14,4 pt | — | 708 | 1,39 |
| Petites villes et rural | Jeune de 25 ans au Smic, T2, apport 40 000 € | 121 570 | 401 | 10,6 pt | 29 % | 490 | 1,02 |
| Petites villes et rural | Couple au Smic, deux enfants (32 ans), T4, sans apport | 150 000 | 737 | 5,1 pt | 26 % | 802 | 1,07 |
| Petites villes et rural | 40 ans, seul, T3, sans apport | 124 000 | 609 | 7,7 pt | — | 611 | 1,16 |
| Petites villes et rural | 55 ans, seul, T3, sans apport (20 ans) | 124 000 | 708 | 14,4 pt | — | 611 | 1,33 |

| Part des primo-accédants | Recettes / coûts, min (dès l'an 5) | Sous 50 % dès | Besoin an 10 (Md€) | Besoin an 30 | Dette maximale | Dette an 60 | Patrimoine net an 60 |
|---|---|---|---|---|---|---|---|
| 10 % | 94 % | jamais | 7,5 | 3,6 | 125 | 95 | 309 |
| 30 % | 116 % | jamais | 21,0 | 10,9 | 369 | 322 | 796 |
| 60 % | 123 % | jamais | 41,1 | 22,0 | 739 | 662 | 1 527 |
| 30 %, haut (4,7 %) | 36 % | 2072 | 20,6 | 15,6 | 661 | 661 | 2 |

Demande attendue avec une mensualité bancaire (H-FU47, ⚠️ aucune statistique publique des refus de crédit) :

| Hypothèse | Refusés par les banques | Adhérents | Part des primo-accédants | Entrants par an |
|---|---|---|---|---|
| bas | 3 % | 1 % | 4 % | 13 k |
| central | 8 % | 3 % | 11 % | 35 k |
| haut | 15 % | 5 % | 20 % | 64 k |

**Lecture.** La mensualité bancaire fait passer le test des 50 % pendant 60 ans au central (marge implicite de 5 à 14 points, parce que l'occupant rembourse presque le prix entier pour un usufruit) et la foncière s'autofinance ; mais, pour la même mensualité qu'un achat et un droit moindre, seuls les refusés des banques et les adhérents viendraient (de l'ordre de 10 % des primo-accédants), et le dispositif coûte plus cher que louer presque partout. Au haut (argent à 4,7 %), le test échoue après une trentaine d'années.

### H. Comparaison 2 : usufruit actuariel et marge de 0 à 2 points au-dessus du coût de l'argent

| Secteur | Cas | Marge 0 (€/mois) | 0,5 pt | 1 pt | 1,5 pt | 2 pts | Contribution | Effort à 1 pt | Coût/loyer à 0 | Coût/loyer à 2 pts |
|---|---|---|---|---|---|---|---|---|---|---|
| Paris | Jeune de 25 ans au Smic, T2, apport 40 000 € | 845 | 891 | 938 | 986 | 1 036 | 72 | 68 % | 0,90 | 1,05 |
| Paris | Couple au Smic, deux enfants (32 ans), T4, sans apport | 2 705 | 2 852 | 3 003 | 3 159 | 3 318 | 185 | 108 % | 1,42 | 1,67 |
| Paris | 40 ans, seul, T3, sans apport | 1 405 | 1 482 | 1 560 | 1 641 | 1 724 | 118 | — | 1,00 | 1,16 |
| Paris | 55 ans, seul, T3, sans apport (20 ans) | 1 220 | 1 274 | 1 331 | 1 388 | 1 447 | 118 | — | 0,90 | 1,02 |
| Grandes métropoles | Jeune de 25 ans au Smic, T2, apport 40 000 € | 281 | 296 | 311 | 328 | 344 | 33 | 23 % | 0,51 | 0,59 |
| Grandes métropoles | Couple au Smic, deux enfants (32 ans), T4, sans apport | 821 | 865 | 911 | 958 | 1 007 | 56 | 33 % | 0,85 | 1,00 |
| Grandes métropoles | 40 ans, seul, T3, sans apport | 541 | 571 | 601 | 632 | 664 | 46 | — | 0,77 | 0,90 |
| Grandes métropoles | 55 ans, seul, T3, sans apport (20 ans) | 470 | 491 | 512 | 535 | 557 | 46 | — | 0,70 | 0,79 |
| Villes moyennes | Jeune de 25 ans au Smic, T2, apport 40 000 € | 157 | 166 | 175 | 184 | 193 | 25 | 13 % | 0,42 | 0,48 |
| Villes moyennes | Couple au Smic, deux enfants (32 ans), T4, sans apport | 553 | 583 | 614 | 646 | 679 | 38 | 22 % | 0,76 | 0,89 |
| Villes moyennes | 40 ans, seul, T3, sans apport | 372 | 392 | 413 | 434 | 456 | 31 | — | 0,70 | 0,82 |
| Villes moyennes | 55 ans, seul, T3, sans apport (20 ans) | 323 | 337 | 352 | 367 | 383 | 31 | — | 0,63 | 0,72 |
| Petites villes et rural | Jeune de 25 ans au Smic, T2, apport 40 000 € | 165 | 174 | 183 | 193 | 202 | 25 | 14 % | 0,54 | 0,62 |
| Petites villes et rural | Couple au Smic, deux enfants (32 ans), T4, sans apport | 456 | 481 | 506 | 532 | 559 | 31 | 18 % | 0,72 | 0,85 |
| Petites villes et rural | 40 ans, seul, T3, sans apport | 307 | 324 | 341 | 359 | 377 | 26 | — | 0,67 | 0,79 |
| Petites villes et rural | 55 ans, seul, T3, sans apport (20 ans) | 267 | 279 | 291 | 304 | 316 | 26 | — | 0,61 | 0,69 |

| Marge (30 % des primo-accédants) | Ratio an 5 | an 10 | an 20 | an 30 | an 45 | an 60 | Sous 50 % dès | Besoin an 10 (Md€) | an 30 | Dette an 30 (Md€) | an 60 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0,0 pt | 38 % | 39 % | 35 % | 28 % | 20 % | 17 % | 2031 | 23,6 | 27,1 | 508 | 1 025 |
| 0,5 pt | 43 % | 44 % | 40 % | 33 % | 25 % | 20 % | 2031 | 23,4 | 26,0 | 497 | 977 |
| 1,0 pt | 49 % | 50 % | 46 % | 39 % | 29 % | 24 % | 2031 | 23,2 | 24,9 | 485 | 928 |
| 1,5 pt | 55 % | 56 % | 52 % | 44 % | 34 % | 29 % | 2050 | 23,1 | 23,8 | 474 | 877 |
| 2,0 pt | 60 % | 62 % | 59 % | 51 % | 39 % | 34 % | 2057 | 22,9 | 22,6 | 462 | 825 |

| Configuration (marge sur l'usufruit actuariel) | Marge minimale, 60 ans | 30 premières années |
|---|---|---|
| Base (contribution au budget public) | 3,2 pt | 2,0 pt |
| Écart de 0,5 point (emprunt hors APU) | 3,8 pt | 2,2 pt |
| Livret foncier (100 Md€ à 2 %) | 2,5 pt | 1,3 pt |
| Prêt familial (25 % des jeunes de 25 ans) | 3,0 pt | 1,8 pt |
| Haut (défavorable) | 6,3 pt | 3,3 pt |
| Sensibilité secondaire : contribution affectée à la foncière, comptée comme vente ⚠️ | 1,9 pt | 1,1 pt |

**Lecture.** Une marge de 0 à 2 points ne suffit pas : à 2 points, le ratio passe 50 % une vingtaine d'années, puis retombe. Il faut environ 3,2 pt (redevance à 6,7 %). Affecter la contribution à la foncière n'aide que si la comptabilité nationale la compte comme une vente, ce qui est douteux (un impôt n'est pas une vente), et le budget public la perd.

### I. Un taux par secteur pour garder le même effort ? (cible de 400 € par mois)

Jeune de 25 ans au Smic, T2 médian, 40 000 € d'apport, usufruit actuariel (comparaison 2). « Borné » : entre 3,5 % et 5,5 % ; « durée » : années pour rembourser à 400 € par mois à 4,5 %. Dernière colonne : scénario principal (forfait 70 %, taux bancaire).

| Secteur | Prix T2 | Usufruit financé | Taux pour 400 € | Taux borné | Mensualité | Effort | Durée à 400 € | Scénario principal |
|---|---|---|---|---|---|---|---|---|
| Paris | 347 800 | 168 747 | -2,6 % | 3,5 % | 845 | 62 % | impossible | 999 |
| Grandes métropoles | 160 000 | 56 031 | 7,1 % | 5,5 % | 344 | 26 % | 16,6 ans | 354 |
| Villes moyennes | 119 000 | 31 423 | 14,9 % | 5,5 % | 193 | 15 % | 7,8 ans | 213 |
| Petites villes et rural | 121 570 | 32 965 | 14,1 % | 5,5 % | 202 | 15 % | 8,2 ans | 221 |

**Lecture.** Un taux par secteur ne peut pas égaliser l'effort : là où le T2 est bon marché, il faudrait un taux de 7 à 15 % pour atteindre 400 € ; à Paris, même un taux nul n'y suffit pas. L'écart vient du prix, pas du taux. Mieux vaut **fixer la mensualité et laisser la durée s'ajuster**, ou une règle simple proportionnelle au prix (le forfait).

### J. Les autres canaux, appliqués au scénario principal (50 % d'une génération)

**Prêt familial (section 19).** T2 médian de ville moyenne : les parents (55 ans) prêtent la nue-propriété (30 %), 35 700 €, indexée sur l'inflation et remboursée à leur succession. Durée moyenne 39,3 ans ; somme espérée versée 78 760 € courants ; gain pour la foncière par rapport à un emprunt à 3,5 % : 15 448 € en valeur actuelle (43 % du prêt).

| Canal | Besoin an 10 (Md€) | an 30 | Dette an 30 (Md€) | an 60 | Recettes / coûts, min (dès l'an 5) | à l'an 10 |
|---|---|---|---|---|---|---|
| Référence | 89,1 | 93,3 | 1 832 | 3 673 | 22 % | 49 % |
| Prêt familial : 25 % des entrants | 80,0 | 77,3 | 1 790 | 3 452 | 24 % | 51 % |
| Livret foncier : 100 Md€ à 2 % | 87,3 | 90,2 | 1 783 | 3 542 | 22 % | 58 % |
| Livret foncier : 300 Md€ à 2 % | 84,0 | 84,5 | 1 702 | 3 303 | 25 % | 79 % |
| Sans dation ni viager | 88,2 | 93,3 | 1 820 | 3 689 | 21 % | 51 % |
| Dation doublée (1 Md€ par an) | 89,0 | 92,9 | 1 829 | 3 643 | 22 % | 49 % |
| Ouverture par cercles (3 000 bâtisseurs par an pendant 3 ans) | 89,3 | 92,9 | 1 764 | 3 632 | 22 % | 51 % |
| Prêt familial + livret 300 Md€ + cercles | 77,0 | 69,1 | 1 611 | 3 073 | 28 % | 83 % |

**Lecture.** Le prêt familial remplace de la dette de marché par une dette indexée, remboursée à date connue, sans coût pour l'État. Le livret foncier abaisse le coût de l'argent : c'est le levier le plus puissant sur le ratio. Dations et viagers pèsent peu. L'ouverture par cercles retarde la montée de la dette sans changer sa trajectoire de long terme. Aucun canal seul ne fait passer le test des 50 % au taux bancaire.

## v1 (09/11/2026, après-midi) : résultats d'origine, sans marge

Conservés pour comparaison ; ils sont recalculés par le même code, avec les réglages de la v1 (redevance au coût de l'argent, sans marge). Hypothèses H-FU1 à H-FU30. Taux de tarification central de l'usufruit : **1,48 %** = taux d'équilibre (1 + 3,5 %) / (1 + 2,5 %) − 1 + 0,5 point de prudence (H-FU6, H-FU7).

### v1 · 1. Valeur de l'usufruit selon l'âge et le taux (part de la pleine propriété)

Contrat signé en 2027 ; mortalité Insee 2023-2025 (ensemble des deux sexes) avec une baisse des quotients de 1 % par an (H-FU4) ; espérance « du moment » = table sans amélioration.

| Âge | Espérance du moment (ans) | Espérance avec amélioration | à 1 % | à 1,48 % (tarif) | à 2 % | à 3 % | à 4 % | Barème CGI 669 | Esquisse (3 %, déterministe) |
|---|---|---|---|---|---|---|---|---|---|
| 25 | 58,6 | 64,3 | 47 % | 60 % | 71 % | 83 % | 90 % | 80 % | 82 % |
| 30 | 53,7 | 58,8 | 44 % | 57 % | 67 % | 81 % | 88 % | 80 % | 80 % |
| 35 | 48,9 | 53,4 | 41 % | 53 % | 64 % | 77 % | 85 % | 70 % | 76 % |
| 40 | 44,1 | 48,1 | 37 % | 50 % | 60 % | 74 % | 82 % | 70 % | 73 % |
| 45 | 39,3 | 42,8 | 34 % | 46 % | 56 % | 69 % | 78 % | 60 % | 69 % |
| 55 | 30,2 | 32,7 | 27 % | 37 % | 46 % | 59 % | 69 % | 50 % | 59 % |
| 65 | 21,7 | 23,4 | 20 % | 28 % | 36 % | 48 % | 57 % | 40 % | 47 % |
| 75 | 14,1 | 15,0 | 14 % | 19 % | 25 % | 34 % | 42 % | 30 % | 34 % |
| 85 | 7,5 | 7,9 | 7 % | 11 % | 14 % | 20 % | 25 % | 20 % | 20 % |

**Lecture.** Le barème fiscal est proche d'un calcul à 3 % pour les jeunes, mais il surévalue l'usufruit des personnes âgées (75 ans : 30 % au barème contre 25 % à 2 %). Au taux d'équilibre de la foncière (≈ 1,5 %), l'usufruit d'une personne de 25 ans ne vaut qu'environ 60 % du bien : le prix d'entrée dépend d'abord du taux choisi, bien plus que de la table de mortalité.

### v1 · 2. Cas types : redevance mensuelle, durée, coût total

Taux du contrat 3,5 % fixe (refinancement de la foncière répercuté sans marge), durée 25 ans ; usufruit tarifé à 1,48 %. Comparaison : achat en pleine propriété à 3,2 % sur 25 ans (si une banque prête). Smic net : 1 477,93 €/mois (H-FU9). Le coût total exclut charges, entretien et taxe foncière, payés dans les deux cas.

| Cas | Part usufruit | Financé (€) | Redevance (€/mois) | Durée | Coût total (€) | Taux d'effort | Redevance si tarif 3 % | Achat classique (€/mois) | Coût total achat (€) | Durée d'occupation espérée (ans) | Aide au logement évitée ensuite (€, espérance) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 25 ans, seul, au Smic, T2 à 150 000 €, sans apport | 60 % | 90 029 | 451 | 25 ans | 135 212 | 30 % | 625 | 727 | 218 106 | 64,3 | 47 385 |
| 25 ans, seul, au Smic, T2 à 150 000 €, apport 40 000 € | 60 % | 50 029 | 250 | 25 ans | 115 137 | 17 % | 425 | 533 | 199 944 | 64,3 | 47 385 |
| Couple au Smic, deux enfants (32 et 32 ans, droit réversible), T4 à 250 000 €, sans apport | 61 % | 151 783 | 760 | 25 ans | 227 959 | 26 % | 1 058 | 1 212 | 363 509 | 64,4 | 118 196 |
| Couple au Smic, deux enfants (32 et 32 ans, droit réversible), T4 à 250 000 €, apport 80 000 € | 61 % | 71 783 | 359 | 25 ans | 187 809 | 12 % | 657 | 824 | 327 186 | 64,4 | 118 196 |
| 40 ans, seul, logement à 230 000 €, sans apport | 50 % | 113 874 | 570 | 25 ans | 171 024 | — | 847 | 1 115 | 334 428 | 48,1 | — |
| 55 ans, seul, logement à 230 000 €, sans apport | 37 % | 85 309 | 495 | 20 ans | 118 741 | — | 793 | 1 115 | 334 428 | 32,7 | — |

**Lecture.** (1) Au tarif d'équilibre, la redevance d'un jeune au Smic sans apport est inférieure d'environ 38 % à un achat classique (que la banque lui refuserait : près de la moitié de son revenu). Elle atteint 30 % de son revenu, la limite de la règle. (2) Avec le capital de départ en apport, le taux d'effort tombe à 17 %. (3) Le couple au Smic avec deux enfants paie 26 % de ses deux salaires sans apport pour un T4 à 250 000 €, 12 % avec ses deux apports. (4) À 55 ans, la redevance est moins de la moitié d'un achat. (5) Si la foncière tarife à 3 % (marge implicite, voir § 5), les redevances montent d'environ 40 % sans apport, de 70 à 85 % avec apport. La dernière colonne : aide au logement que l'État cesse de verser après la redevance (H-FU14 ; montants d'aide supposés de 100 € et 250 € par mois ⚠️).

**Ce qu'un jeune au Smic peut payer** (règle d'un tiers du revenu, § 14) : 488 €/mois, soit 97 422 € d'usufruit sur 25 ans ; avec 40 000 € d'apport, 137 422 €. Un usufruit à 60 % correspond à un logement de **162 318 €** sans apport et **228 963 €** avec apport.

### v1 · 3. Taux répercuté : fixe, variable plafonné, allongement de durée

Cas du jeune de 25 ans sans apport (90 029 € financés). Choc : le taux de refinancement passe de 3,5 % à 5,5 % à partir de la 6e année et y reste (H-FU12).

| Option | Redevance initiale (€/mois) | Redevance maximale | Durée | Total payé (€) |
|---|---|---|---|---|
| Fixe (la foncière porte le risque) | 451 | 451 | 25,0 ans | 135 212 |
| Variable sans plafond | 451 | 535 | 25,0 ans | 155 341 |
| Variable plafonné à +1 point | 451 | 492 | 25,0 ans | 145 039 |
| Allongement de durée (plafond 35 ans) | 451 | 451 | 33,5 ans | 180 995 |

**Lecture.** Sans plafond, un choc de 2 points ajoute environ 20 % à la redevance d'un ménage au Smic. L'allongement garde la mensualité, mais coûte davantage au total. Avec un plafond, la différence est portée par la foncière, donc par l'État ; c'est un coût d'option à provisionner (non tarifé ici ⚠️).

### v1 · 4. La foncière sur 60 ans selon la montée en charge (scénario central)

Primo-accessions : 320 000 par an (H-FU15) ; montée linéaire sur 10 ans ; prix moyen 220 000 € en 2026, +2,5 % par an ; refinancement à 3,5 % variable, contrats à taux fixe ; 5 000 viagers rachetés et 0,5 Md€ de dations par an. Dette publique : « hors APU » = seuls les flux de l'État (gestion, dation, dotation, moins l'aide au logement évitée) ; « dans APU » = plus la dette de la foncière.

#### Part cible : 10 % des primo-accédants

| Année | Entrants | Achats | Acquisitions (Md€) | Besoin de financement net (Md€) | Redevances (Md€) | Dette foncière (Md€) | Dette / PIB | Patrimoine net (Md€) | Recettes / coûts | Effet dette publique hors APU | Effet dette publique dans APU | Parc |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 10 (2036) | 32 k | 31 k | 8,3 | 8,4 | 0,9 | 46 | 1,3 % | 5 | 34 % | 0,2 % | 1,5 % | 0,26 M |
| 20 (2046) | 32 k | 28 k | 7,9 | 8,7 | 2,8 | 117 | 3,1 % | 9 | 32 % | 0,4 % | 3,5 % | 0,63 M |
| 30 (2056) | 32 k | 25 k | 7,6 | 9,0 | 4,4 | 176 | 4,3 % | 16 | 26 % | 0,6 % | 4,9 % | 0,97 M |
| 45 (2071) | 32 k | 20 k | 6,7 | 10,2 | 5,1 | 258 | 5,4 % | 34 | 20 % | 0,9 % | 6,3 % | 1,43 M |
| 60 (2086) | 32 k | 13 k | 4,9 | 10,5 | 5,6 | 330 | 6,0 % | 65 | 17 % | 1,1 % | 7,1 % | 1,80 M |

#### Part cible : 30 % des primo-accédants

| Année | Entrants | Achats | Acquisitions (Md€) | Besoin de financement net (Md€) | Redevances (Md€) | Dette foncière (Md€) | Dette / PIB | Patrimoine net (Md€) | Recettes / coûts | Effet dette publique hors APU | Effet dette publique dans APU | Parc |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 10 (2036) | 96 k | 94 k | 23,5 | 23,6 | 2,8 | 123 | 3,6 % | 2 | 39 % | 0,2 % | 3,8 % | 0,61 M |
| 20 (2046) | 96 k | 90 k | 23,7 | 25,4 | 8,5 | 326 | 8,7 % | -1 | 34 % | 0,5 % | 9,2 % | 1,61 M |
| 30 (2056) | 96 k | 86 k | 23,6 | 27,1 | 13,2 | 508 | 12,3 % | 1 | 28 % | 0,8 % | 13,1 % | 2,58 M |
| 45 (2071) | 96 k | 74 k | 22,1 | 32,6 | 15,3 | 773 | 16,2 % | 18 | 20 % | 1,2 % | 17,4 % | 3,91 M |
| 60 (2086) | 96 k | 53 k | 17,1 | 34,9 | 16,9 | 1 025 | 18,5 % | 64 | 17 % | 1,4 % | 20,0 % | 4,99 M |

#### Part cible : 60 % des primo-accédants

| Année | Entrants | Achats | Acquisitions (Md€) | Besoin de financement net (Md€) | Redevances (Md€) | Dette foncière (Md€) | Dette / PIB | Patrimoine net (Md€) | Recettes / coûts | Effet dette publique hors APU | Effet dette publique dans APU | Parc |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 10 (2036) | 192 k | 190 k | 46,4 | 46,3 | 5,6 | 238 | 7,0 % | -3 | 40 % | 0,2 % | 7,2 % | 1,13 M |
| 20 (2046) | 192 k | 185 k | 47,3 | 50,3 | 17,1 | 641 | 17,1 % | -16 | 35 % | 0,6 % | 17,7 % | 3,09 M |
| 30 (2056) | 192 k | 177 k | 47,7 | 54,2 | 26,5 | 1 006 | 24,4 % | -23 | 28 % | 1,0 % | 25,4 % | 4,98 M |
| 45 (2071) | 192 k | 156 k | 45,2 | 66,2 | 30,6 | 1 545 | 32,3 % | -5 | 20 % | 1,6 % | 34,0 % | 7,61 M |
| 60 (2086) | 192 k | 113 k | 35,4 | 71,5 | 33,9 | 2 068 | 37,4 % | 62 | 17 % | 1,9 % | 39,3 % | 9,77 M |

**Lecture.** (1) Le besoin de financement net est d'environ 8 à 11, 24 à 35 et 46 à 72 Md€ de 2026 par an (10 %, 30 %, 60 %), à comparer aux 41,6 Md€ de prêts nouveaux du fonds d'épargne en 2025 et aux ≈ 160 Md€ d'épargne centralisée non prêtée (406,5 − 244,9 ; ⚠️ la liquidité requise n'est pas déduite). (2) La dette de la foncière ne cesse pas de croître sur 60 ans : la nue-propriété est portée à crédit pendant des décennies, et les intérêts s'accumulent plus vite que les logements ne reviennent. (3) Le patrimoine net reste proche de zéro : c'est le but d'une tarification à l'équilibre, sans marge. (4) Les recettes courantes (intérêts des redevances) couvrent 15 à 40 % des coûts (intérêts payés, gestion, impayés), et la part baisse avec le temps : **sous le seuil de 50 %**, la foncière serait classée dans les administrations publiques, sauf si la comptabilité nationale traitait l'usufruit vendu comme un loyer payé d'avance (lecture possible, non tranchée ⚠️ ; voir methode.md § 5).

### v1 · 5. Scénarios et risques (part cible 30 %)

| Variante | Besoin an 30 (Md€) | Dette an 30 (Md€) | Dette an 60 (Md€) | Dette / PIB an 60 | Patrimoine net an 30 | Patrimoine net an 60 | Recettes / coûts, min (3 ans) | max | Dette publique an 60, hors APU | dans APU |
|---|---|---|---|---|---|---|---|---|---|---|
| Bas (favorable) | 25,0 | 490 | 875 | 15,8 % | 87 | 564 | 25 % | 41 % | 0,7 % | 16,6 % |
| Central | 27,1 | 508 | 1 025 | 18,5 % | 1 | 64 | 17 % | 39 % | 1,4 % | 20,0 % |
| Haut (défavorable) | 29,0 | 512 | 1 289 | 23,3 % | -116 | -640 | 9 % | 38 % | 2,7 % | 26,0 % |
| Longévité : quotients −2 %/an au lieu de −1 % | 27,7 | 513 | 1 098 | 19,8 % | -0 | 44 | 16 % | 39 % | 1,4 % | 21,3 % |
| Taux : +2 points dès l'an 6, contrats fixes | 39,9 | 633 | 1 917 | 34,6 % | -116 | -817 | 10 % | 39 % | 2,9 % | 37,5 % |
| Taux : +2 points dès l'an 6, contrats variables | 39,3 | 624 | 1 880 | 34,0 % | -107 | -780 | 11 % | 40 % | 2,9 % | 36,9 % |
| Prix : +1,5 %/an au lieu de 2,5 % | 21,0 | 429 | 787 | 14,2 % | -41 | -172 | 13 % | 39 % | 1,5 % | 15,7 % |
| Tarification à 3 % (marge implicite) | 18,0 | 411 | 614 | 11,1 % | 25 | 260 | 37 % | 58 % | 1,5 % | 12,6 % |
| Nue-propriété en fonds propres de l'État | 6,2 | 170 | 256 | 4,6 % | 339 | 832 | 56 % | 116 % | 15,3 % | 20,0 % |
| Sans viager ni dation | 27,1 | 496 | 1 040 | 18,8 % | -22 | 1 | 17 % | 55 % | 0,5 % | 19,3 % |

**Lecture.** (1) Le risque de **taux** domine : 2 points de plus dès la 6e année creusent un trou d'environ 800 Md€ de 2026 à 60 ans, que les contrats soient fixes ou variables, parce que la nue-propriété (40 à 60 % de la valeur) est portée à crédit pendant des décennies, sans redevance en face. Les contrats variables ne reportent sur les ménages que la part usufruit. (2) Le risque de **prix** est de même nature : si les logements prennent 1 point de moins par an que prévu, le bien rendu au décès ne rembourse plus son portage (−170 Md€ à 60 ans). (3) Le risque de **longévité collective** pèse moins (les logements reviennent plus tard, la foncière porte plus longtemps). (4) Une tarification à 3 % dégage une marge, mais renchérit les redevances (§ 2). (5) En fonds propres, le ratio dépasse 50 %, mais la dette publique porte alors la nue-propriété : on ne fait que déplacer la dette. (6) Une tarification à 3 % ne passe le seuil de 50 % que pendant une vingtaine d'années : le portage de la nue-propriété finit toujours par l'emporter.

### v1 · 6. Effet possible sur les prix : une borne, pas un modèle

Effet de niveau ≈ (demande additionnelle / transactions annuelles) / (élasticité de l'offre + élasticité de la demande au prix) ; demande additionnelle = part des entrants qui n'auraient pas acheté sans la foncière (H-FU28).

| Part cible | Bas (30 % additionnels, élasticité 4) | Central (50 %, 2) | Haut (70 %, 1) |
|---|---|---|---|
| 10 % | 0,2 % | 0,7 % | 2,0 % |
| 30 % | 0,7 % | 2,2 % | 6,1 % |
| 60 % | 1,3 % | 4,4 % | 12,2 % |

**Lecture.** Une hausse ponctuelle du niveau des prix de l'ordre de 1 à 4 % au central, jusqu'à 12 % à 60 % de part cible dans le cas haut ; davantage dans les villes où l'offre ne suit pas. Le capital de départ en apport et le taux public ajoutent un effet de solvabilisation non chiffré ici. Ces chiffres sont une **borne d'ordre de grandeur**, pas une prévision.

