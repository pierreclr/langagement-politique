---
titre: Démographie de la France : passé, projection et sensibilité
theme: vieillir
statut: brouillon ; dernier calcul le 07/11/2026
---

## La question

Combien de personnes de plus de 60 ans en 1975 et aujourd'hui, et que donne la structure par âge jusqu'en 2070 selon la fécondité, la mortalité, le solde migratoire et l'âge de départ à la retraite ? Quelle hypothèse pèse le plus ? Le modèle sert de base aux mesures sur les retraites et le grand âge.

## Ce qui entre

- Statistiques publiques de l'Insee : population par âge et sexe de 1901 à 2026 (2026 provisoire), tables de mortalité 2023-2025 (provisoires), fécondité par âge et indicateur conjoncturel jusqu'en 2025, projections 2026 (publication de juin 2026) pour les hypothèses centrales et la comparaison.
- Hypothèses centrales de l'Insee reprises telles quelles : 1,45 enfant par femme dès 2028, solde migratoire de +150 000 par an, espérance de vie à la naissance de 89,5 ans (femmes) et 86,7 (hommes) en 2070.
- Calcul de l'IA : le profil par âge des migrants, estimé par « résidu de cohortes » (ce qu'il faut ajouter à une génération pour passer d'une année à la suivante, une fois les décès retirés).
- Un indice de dépenses de retraites en part du PIB, calé sur 14,1 % en 2025 (rapport du Conseil d'orientation des retraites).

## Comment il calcule

Un modèle « par composantes de cohortes », année après année, par sexe et par âge de 0 à 105 ans.

1. **Vieillissement et décès** : population d'âge a+1 l'an prochain = population d'âge a × (1 − taux de décès à cet âge) + migrants.
2. **Naissances** = somme, pour les femmes de 15 à 49 ans, du taux de fécondité par âge multiplié par le nombre de femmes exposées. Le profil par âge de 2025 est mis à l'échelle de l'indicateur voulu et décalé pour suivre l'âge moyen à la maternité.
3. **Mortalité** : la table 2023-2025 multipliée par un facteur commun à tous les âges, recalculé chaque année pour que l'espérance de vie suive la trajectoire choisie.
4. **Migration** : le solde annuel est réparti selon le profil par âge estimé.
5. **Indicateurs** : parts des 60 ans et plus, 65 et plus, 75 et plus ; rapport de dépendance = 100 × (65 ans et plus) / (20 à 64 ans) ; retraités pour 100 actifs selon un âge de départ (62, 64 ou 67 ans).

Exemple chiffré : le scénario central donne en 2070 21,22 M de 65 ans et plus pour 34,37 M de 20 à 64 ans, soit un rapport de 61,8 pour 100, contre 40,1 en 2026 (RAPPORT.md, § 2).

## L'hypothèse qui porte le résultat

Les 65 ans et plus de 2070 sont déjà nés : le vieillissement est largement acquis. Ce qui varie est l'espérance de vie : 65+ de 18,1 M (constante) à 23,1 M (+3 ans par rapport au central). Pour le rapport de dépendance, la plus forte variation vient de l'âge de départ : de 75 à 54 retraités pour 100 actifs entre 62 et 67 ans. Les trois composantes démographiques jouent en sens inverses sur le rapport : fécondité de 1,20 à 1,70, +4,2 à −3,9 points ; solde migratoire nul à +230 000, +5,3 à −2,3 points (RAPPORT.md, § 3).

## Ce que l'IA a choisi elle-même

Six choix : le facteur de mortalité unique pour tous les âges, le profil migratoire par résidu de cohortes (calcul de l'IA, cote B) fixé sur 2018-2019 et 2022-2025 pour les âges de 1 à 64 ans, le niveau du solde migratoire fixé par hypothèse, le décalage du profil de fécondité pour suivre l'âge moyen, la mise à l'échelle de la dépense de retraites sur 14,1 %, et l'interprétation d'un pic des 60 ans et plus en 1975 (classes creuses de la guerre de 1914-1918, non vérifiée). Les trois scénarios précalculés sont bas, central et haut en taille de population, pas en vieillissement.

## Ce qu'il ne fait pas

Pas d'économie : ni taux d'emploi, ni productivité, ni santé des seniors, ni réforme. L'indice « part du PIB » est un contrefactuel démographique, pas une projection du Conseil d'orientation. Pas de mortalité différentielle par diplôme ou revenu. Au-delà de 2050, l'incertitude domine (l'Insee publie de 55 à 78 M d'habitants en 2070). Fécondité et migration ne réagissent ni à l'économie ni aux politiques. Le facteur de mortalité commun surestime de 6 à 8 % les 80 ans et plus.

## Ce qu'il donne

- Plus de 60 ans en métropole : 9,67 M en 1975 (18,4 %), 19,16 M en 2026 (28,7 %) (RAPPORT.md, § 1).
- Population France 2070, central : 66,44 M (Insee : 65,89 M), écart de +0,8 % ; 65+ en 2070 21,22 M contre 21,10 M (§ 4).
- Rapport de dépendance : 49,5 en 2040 et 61,8 en 2070 (Insee : 48,6 et 61,9).
- Population 2070 : 61,9 à 71,3 M selon la fécondité, 58,4 à 79,9 M selon le solde migratoire (§ 3).
- Les neuf scénarios de l'Insee sont retrouvés à 0 à 2,1 % près (population basse 2070 : 55,8 M contre 54,6 M).

## Comment le refaire

Depuis le dossier : `python3 -I tests/test_projection.py` (13 tests, passent en quelques secondes) ; `python3 -I code/projection.py` affiche le scénario central. Les sorties sont dans `sorties/`. Les fichiers bruts de l'Insee ne sont pas dans cette copie ; seuls les CSV de `donnees/` y sont. Le modèle n'a pas encore de version en JavaScript.
