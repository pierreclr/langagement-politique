---
titre: Prospective démographique 2025-2070, avec emploi et cotisants
theme: vieillir
statut: brouillon ; dernier calcul le 01/11/2026
---

## La question

Combien d'habitants, de personnes de 65 ans et plus et de retraités la France aura-t-elle de 2025 à 2070 selon la fécondité, la mortalité et le solde migratoire ? Le moteur retrouve-t-il les projections publiées de l'Insee et d'Eurostat ? Un second module passe de la population aux actifs, aux cotisants et au rapport cotisants par retraité, pour mesurer le poids du chômage, de l'âge de départ et d'une baisse du besoin d'emploi liée à la robotisation. Il est voisin du modèle « Démographie », écrit après lui, mais ajoute les retraités et l'emploi.

## Ce qui entre

- Population de départ : projection européenne EUROPOP2023, remise à l'échelle (facteur 1,003) pour valoir 68,852 M, la population 2025 de l'Insee. Ce n'est donc pas une observation.
- Hypothèses publiques de l'Insee 2026 (fécondité de 1,45 dès 2028, solde de +150 000, espérance de vie de 89,5 et 86,7 ans en 2070) et de l'Insee 2021 pour comparaison.
- Pour l'emploi : taux d'emploi et de chômage par âge et sexe du Conseil d'orientation des retraites (juin 2026).
- Hypothèses : profil par âge des migrants, loi des âges de départ, rampe du chômage, robotisation.

## Comment il calcule

Année après année, par sexe et âge de 0 à 100 ans et plus :

1. Population d'âge x+1 = (population d'âge x + moitié des migrants) × (1 − taux de décès) + moitié des migrants.
2. Naissances = somme, pour les âges de 15 à 50 ans, du taux de fécondité × l'exposition des femmes. Le taux de fécondité est un calage × l'indicateur de fécondité de l'année × la forme par âge, décalée pour que l'âge moyen passe de 31,2 à 33,0 ans.
3. Taux de décès = κ × taux européens 2025 × exp(−λ × (t − 2025)) : κ est calé pour retrouver 651 000 décès en 2025, λ pour reproduire le gain d'espérance de vie de chaque scénario.
4. Retraités = somme de la population × 0,95 × Φ((âge + 0,5 − A) / 2,5), Φ étant la loi normale et A l'âge moyen de départ (62,5 ans en 2025).
5. Module emploi : emploi = activité × (1 − chômage) par âge ; cotisants = 1,061 × emploi ; retraités = 1,053 × somme (population × taux de retraités du COR) ; rapport = cotisants / retraités.

Exemple : en 2070, scénario central, 28,5 M de cotisants pour 22,5 M de retraités « tous régimes » donnent environ 1,27 cotisant par retraité (RESULTATS.md, § 6.1). Le chiffre de 20,8 M de retraités, plus bas, vient de la loi normale de l'étape 4, une autre méthode que celle du module emploi (H19 dans la méthode) : les deux divergent après 2025 parce que le Conseil d'orientation projette des taux de retraités par génération.

## L'hypothèse qui porte le résultat

Le profil par âge des migrants (H8), « le point le plus faible » du modèle : par défaut, des résidus de la projection européenne ; en variante, un profil concentré sur 18 à 34 ans. L'écart vaut 2,5 M d'habitants en 2070, plus que l'écart entre espérances de vie centrale et basse : 20 à 64 ans de 33,2 à 36,1 M, et 1,58 à 1,78 personne de 20 à 64 ans pour un 65 ans et plus (RESULTATS.md, § 4). Le vrai profil de l'Insee se situe entre les deux.

## Ce que l'IA a choisi elle-même

J'en relève douze à la lecture des hypothèses H1 à H21 (le texte ne les marque pas tous comme choix de l'IA) : pas annuel et migrants arrivés à mi-année (H1), correction d'indexation de la mortalité (H3), amélioration de la mortalité identique à tous les âges (H4), forme de la fécondité décalée (H5), profil migratoire par résidus (H8), profil stylisé de variante (H8 bis, seul marqué comme hypothèse de l'IA à vérifier), loi normale des âges de départ réglée à la main sur 16,3 M de retraités (H11), lissage par âge (H13), rampe linéaire du chômage de long terme jusqu'en 2040 (H15), décalage de la courbe d'activité pour l'âge de départ (H17), robotisation de 5, 15 ou 30 % avec 50 % de chômage (H18), constantes de calage des cotisants et retraités (H16). Ces constantes absorbent des différences de définition.

## Ce qu'il ne fait pas

Pas de boucle économique : fécondité et migration ne réagissent à rien. Gains de mortalité uniformes par âge, ce qui surestime les grands âges. Pas de régimes de retraite : le rapport est un ordre de grandeur. Le taux d'activité 2025 du modèle (73,0 %) diffère du chiffre publié (75,1 %), écart non expliqué. La robotisation est un paramètre simple, sans modèle de tâches.

## Ce qu'il donne

- Population 2070, central (jeu 2026) : 65,4 M ; 65 ans et plus 21,0 M, 32,1 % (RESULTATS.md, § 1). Scénarios de l'Insee : de 55,6 M (basse) à 75,8 M (haute).
- Écart au publié : moteur contre Eurostat −1,8 % en 2070 ; contre l'Insee 2026 −0,8 % (65,4 contre 65,9 M) (METHODE.md, § 5).
- Retraités 2070 : 20,8 M (âge relevé) ou 22,0 M (âge constant).
- Cotisants par retraité : 1,76 en 2025, 1,27 en 2070 ; le Conseil d'orientation donne 1,77 et 1,30 (RESULTATS.md, § 6.1).
- Leviers sur 2070 : un an d'âge de départ en plus vaut environ 0,09 point de rapport, environ six fois un point de chômage (§ 6.2).

## Comment le refaire

Depuis le dossier : `python3 test_modele.py` (15 tests) et `python3 test_emploi.py` (13 tests) passent ; `python3 run.py` puis `python3 run_emploi.py` relancent les calculs. La préparation des données (`donnees/preparer_donnees.py`) demande les fichiers Eurostat, Insee et du Conseil d'orientation, non vérifiés ici. Le modèle « Démographie » donne des chiffres voisins mais différents (population 2070 de 66,44 M contre 65,37 M ici) : les deux ne s'additionnent pas.
