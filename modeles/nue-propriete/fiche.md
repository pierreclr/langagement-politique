---
titre: Payer l'impôt sur le patrimoine en nue-propriété (idée écartée)
theme: comptes et dette
statut: brouillon ; dernier calcul du 09/11/2026
---

## La question

Ce modèle chiffre une idée écartée par l'auteur le 9 novembre 2026 : payer la contribution sur le patrimoine en cédant à l'État la nue-propriété de biens. Il est gardé pour montrer pourquoi elle est écartée : elle fait perdre de l'argent chaque année.

La nue-propriété est la propriété d'un bien sans le droit de l'utiliser ni d'en tirer les revenus : l'État attendrait le décès du contribuable pour devenir plein propriétaire. Le modèle demande ce que le budget perd chaque année en argent, ce que l'État récupère au décès et quand, et ce que devient la dette.

## Ce qui entre

- Les sept tranches de patrimoine net de 500 000 € et plus de la fonction du patrimoine retenue (8,57 millions de ménages, 45,1 Md€ dus par an), tirées d'un autre modèle du dépôt.
- Le barème fiscal de l'usufruit selon l'âge (code général des impôts, art. 669) : texte public.
- Répartition de la masse de patrimoine par âge (Insee, enquête patrimoine 2023-2024) : statistique publique, découpée en partie par l'IA.
- Une mortalité de type Gompertz calée sur 21,6 ans d'espérance de vie à 65 ans : ordre de grandeur de l'Insee, non relu.
- Des hypothèses de l'IA : part des assujettis qui participent, part en couple, part sans héritier, rendement des biens publics.

## Comment il calcule

1. **Lignées.** 3 000 lignées représentatives par tranche, tirées une fois avec une graine fixe : âge, absence d'héritier, décès. Les mêmes lignées servent à tous les scénarios.
2. **Le choix.** Chaque lignée choisit la nue-propriété avec une probabilité proportionnelle à (1 − part d'usufruit du barème) × (3 si pas d'héritier) × (1 + 2 × part de patrimoine productif). La proportion est calée pour que 5, 20 ou 50 % des assujettis participent.
3. **Chaque année.** Dû = échelle × P(X + c × D) × 0,567. X est le patrimoine en pleine propriété, D la nue-propriété cédée, c un coefficient de faveur (0,5 / 0,3 / 0,1) et 0,567 un calage de la fonction retenue. Le participant cède une valeur pleine V = dû / (1 − part d'usufruit). Il ne verse rien en argent.
4. **Au décès** du dernier du couple, l'État devient plein propriétaire de D. Les droits de succession ne portent plus que sur le reste.
5. **Trésorerie** = argent non encaissé + recouvrement différé perdu + droits de succession perdus + revenus des biens publics (2 % par an).
6. **Dette.** L'écart de trésorerie est ajouté à la trajectoire de dette du modèle des taux (`taux-endogene`).

Exemple (calcul à la main) : un participant de 65 ans doit 100 000 €. La part d'usufruit du barème à cet âge est 40 %. Il cède donc 100 000 / (1 − 0,4), soit 166 667 € de valeur pleine, et l'État attend son décès.

## L'hypothèse qui porte le résultat

**La part des assujettis qui choisissent ce paiement** : 5, 20 ou 50 %. C'est un scénario demandé, pas une mesure. Le coût est à peu près proportionnel : −2,0, −7,8 et −19,8 Md€ de trésorerie en 2058, et +3,5, +14,2 et +38,0 points de PIB de dette en 2058 (resultats.md, section 1). Le coefficient c compte peu pour la trésorerie. Si les participants sont moins nombreux, la perte est moindre. Si les biens publics rapportent 1 % au lieu de 2 %, la dette de 2058 passe de +14,2 à +14,8 points à 20 % de participation (section 4).

## Ce que l'IA a choisi elle-même

Au moins 12 hypothèses sur 20 portent une cote D (convention sans source) ou un ⚠️ dans methode.md :

- HNP10 : les parts de participation de 5, 20 et 50 %.
- HNP2 : le coefficient de faveur c.
- HNP11 : qui participe (plus on est âgé, sans héritier, avec du patrimoine illiquide, plus on choisit la nue-propriété).
- HNP7 : 60 % de couples ; HNP8 : 15 % sans descendant ; HNP9 : les assujettis sont les patrimoines de 500 000 € et plus.
- HNP12 : le patrimoine suit le PIB, sans rendement propre.
- HNP14 : 2 % de rendement des biens publics.
- HNP16 : variante où des salariés reçoivent l'usufruit des parts productives.
- HNP20 : le reste du système ne bouge pas.

Plusieurs de ces choix favorisent le mécanisme : l'exil n'est pas modélisé, et il baisserait avec un paiement sans sortie d'argent.

## Ce qu'il ne fait pas

- Pas de sélection des biens. Le contribuable cédera les biens qu'il juge surévalués ; sans règle, l'État reçoit les plus mauvais actifs au prix fiscal.
- Pas d'effet de prix sur les actifs, pas de retour macroéconomique, pas de vente par l'État.
- Le droit de vote des titres démembrés, l'évaluation des non cotés, l'égalité devant l'impôt et le droit de l'Union sont signalés mais non instruits.
- Au-delà de 2058, le modèle de taux n'est plus dans son horizon : les chiffres de 2068 et 2088 donnent le calendrier des actifs, pas la dette.
- Il ne dit pas que l'idée serait bonne ailleurs : seulement qu'avec ces hypothèses elle coûte chaque année.

## Ce qu'il donne

- À 20 % de participation, la trésorerie perd de 4,9 Md€ (2030) à 8,7 Md€ (2048) par an ; 50 % : 12,0 à 20,9 Md€ (resultats.md, section 1).
- Dette brute à 20 % : +2,4 points de PIB en 2038, +14,2 en 2058, +54,4 en 2088 (section 2).
- Patrimoine net des administrations à 20 % : −0,1 point en 2038, −5,2 en 2058, −36,1 en 2088 (section 2).
- Actifs récupérés à 20 %, c = 0,3 : 62 Md€ en 2048, 242 en 2068, 459 en 2088 (section 1).
- Part du capital productif des assujettis qui finirait en propriété publique : jusqu'à 19,9 % en pleine propriété à 50 % de participation, en 60 ans (section 3).

## Comment le refaire

Depuis la racine du dépôt :

- Tests : la méthode indique `python3 -m pytest modeles/nue-propriete/tests -q -p no:cacheprovider`. Pytest n'était pas installé ici ; les 12 fonctions de test, appelées une à une, passent.
- `python3 -I modeles/nue-propriete/code/rapport.py` : régénère les résultats (non relancé ici).
