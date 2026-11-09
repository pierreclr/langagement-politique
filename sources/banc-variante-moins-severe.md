# Variante « modèles moins sévères » du banc d'essai (exil, évasion, planification des grandes fortunes)

*Dossier du 08/11/2026, écrit par Claude (IA d'Anthropic) ; conflit d'intérêts : l'auteur du manifeste est partie prenante, et la variante s'applique à son propre système. Ordres de grandeur sous hypothèses, jamais des prédictions. Résultats : `modeles/banc-programmes/resultats.md` § 10.*

## 0. Résultat en dix lignes
1. Nos modèles d'érosion et d'exil étaient peut-être trop pessimistes ; la variante abaisse les hypothèses de comportement des grandes fortunes **pour tous les programmes, le nôtre compris**.
2. Effet en médiane (statique) : LFI environ +7 Md€ de solde en régime, Rassemblement national environ +1, notre système environ +6 ; la dette de 2058 baisse de 7 points de PIB pour LFI, 1 point pour le RN et 6 points pour nous.
3. Le classement des programmes et la lecture de leurs trajectoires de dette ne changent pas : les hypothèses d'exil ne sont pas ce qui sépare les programmes.
4. Le modèle de notre système (`modeles/systeme-ideal/`) n'est pas modifié ; les valeurs sont remplacées en mémoire (`js/prelude_moins_severe.js`). Les leviers votés de notre système restent fixés (F = 52,8 Md€) : la variante dit ce que les mêmes votes rapporteraient, pas ce qu'une recalibration voterait. La décision de calibrage est en attente chez l'auteur.
5. Un artefact du modèle existant a été trouvé et contourné (§ 3) : baisser l'érosion fait paraître l'ISF moins rentable dans `grandes_fortunes_0511.varianteB`.
6. Les triplets choisis sont des choix de Claude entre des ancrages publiés, pas des mesures (V32100).

## 1. Hypothèses remplacées
| Hypothèse (favorable / central / défavorable) | Banc | Variante | Ancrage (dossier `exil-patrimoines-preuves.md`) |
|---|---|---|---|
| Érosion de l'assiette à 1 point d'impôt sur la fortune | 20 / 35 / 55 % | 15 / 30 / 45 % | Jakobsen, Jakobsen, Kleven, Zucman, *QJE* 2020 : environ −30 % de patrimoine imposable après 8 ans pour les très riches, −10 % pour les aisés ; Brülhart, Gruber, Krapf, Schmidheiny, *AEJ: Policy* 2022 : environ −30 % par point, dont 24 % seulement par déménagement |
| Érosion du capital mobile du 1 % (fonction du patrimoine) | 20 / 40 / 74 % | 15 / 30 / 45 % | idem ; le 74 % repose sur une note non vérifiée (V7306) ; aucune étude lue au-delà de 30 à 45 % |
| Érosion du reste du patrimoine mobile | 5 / 15 / 30 % | 4 / 10 / 20 % | −10 % pour les aisés (JJKZ 2020) |
| Érosion des autres actifs financiers | 3 / 8 / 15 % | 2 / 5 / 10 % | convention (même proportion) |
| Transmissions : déclaration et planification (HT5) | 17 / 30 / 45 % | 12 / 20 / 32 % | CAE n° 69 (2021) : 20 à 25 points résiduels après réintégration de l'assurance-vie ; OCDE (Taxation WP n° 46, 2019) : −22 % de dépôts dans les centres financiers après l'échange automatique |
| Transmissions : départs des patrimoines mobiles (HT6) | 5 / 12 / 27 % | 2 / 5 / 12 % | Jakobsen, Kleven, Kolsrud, Landais, Muñoz (NBER 32153, *AER* 2026) : −2 % de riches par point d'impôt, soit environ 5 % pour 50 % sur vingt ans ; DGFiP via France Stratégie 2023 : départs de 0,2 à 0,7 % de la base ISF par an |

Études françaises : le rapport final du comité d'évaluation des réformes de la fiscalité du capital (France Stratégie, 2023) est le seul lu pour cette variante. Les travaux de Pichet sur l'exil lié à l'ISF et ceux du Conseil des prélèvements obligatoires n'ont pas été relus ici (V32100) ; ils ne sont donc pas cités comme appui.

## 2. Ce qui n'est pas touché
L'élasticité du revenu imposable des hauts revenus (Saez, Slemrod, Giertz, via `modeles/reactions-assiettes`), la fuite sur les pensions de notre système, les décotes conventionnelles de LFI (« 35 % du chiffre de LFI », sans lien avec l'exil), le socle hérité de la v5, la clause de dette. L'intervalle de notre système reste sous-estimé (V32019).

## 3. Artefact du modèle et contournement
`grandes_fortunes_0511.varianteB` donne `recetteVariante = n07 + delta`, où `n07` est la recette nette de la taxe de 1 % de la v5.4 (érosions de `taxe_patrimoine.js`) et `delta` le barème d'ISF moins cette taxe (érosions de `grandes_fortunes_0511.js`). Baisser les érosions fait monter la taxe de 1 % remplacée plus que l'ISF, et la recette de l'ISF **diminue** (central sobre : 4,5 Md€ avant, 2,8 après, test du 08/11). C'est une incohérence de comptabilité, non un effet économique. `js/pont_isf_abs.js` calcule la recette absolue des trois tranches du sommet (T1 de 1,3 M€ à 10 M€, T2 de 10 à 100 M€, T3 au-delà) ; le banc ajoute à la recette de base la seule variation de cette recette absolue. Résultat : ISF sobre central de 4,5 à 6,5 Md€, renforcé de 4,8 à 8,0 Md€. À corriger dans le modèle lui-même quand la décision de calibrage sera prise.

## 4. Sources mobilisées
| Source | Cote | Conflit d'intérêts |
|---|---|---|
| France Stratégie, rapport final du comité d'évaluation des réformes de la fiscalité du capital, octobre 2023 | A | organisme public ; aucun conflit connu |
| Jakobsen, Kleven, Kolsrud, Landais, Muñoz, NBER w32153 (rév. 01/2026) | A | publication à comité de lecture ; aucun conflit connu |
| Jakobsen, Jakobsen, Kleven, Zucman, *QJE* 2020 (lu en résumé, V8103) | A | Zucman est une des figures du débat sur la taxe sur les grandes fortunes |
| Brülhart, Gruber, Krapf, Schmidheiny, *AEJ: Economic Policy* 14(4), 2022 | A | aucun conflit connu |
| CAE, note n° 69, décembre 2021 | B | organisme public rattaché au Premier ministre ; recommandations assumées |
| OCDE, Taxation Working Paper n° 46, 2019 | B | organisation internationale |
