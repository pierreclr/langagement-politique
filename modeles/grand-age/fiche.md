---
titre: Le grand âge : un prix unique en maison de retraite et une avance reprise sur la succession
theme: vieillir
statut: brouillon
---

## La question

Que coûterait, à la collectivité et aux familles, une règle où chaque résident d'une maison de retraite paie 90 % de son revenu (au plus le prix de l'hébergement), la différence étant avancée puis reprise sur sa succession au-delà d'un seuil ? Le modèle compare cette règle au système actuel et projette la dépense jusqu'en 2050. La proposition est à l'étude : rien n'est adopté. Ce dossier ne publie pas de fichier de méthode : la description ci-dessous vient du code, des tests et de resultats.txt.

## Ce qui entre

- Statistiques publiques (ministère de la Santé, Insee, caisse nationale de solidarité pour l'autonomie) : 579 200 résidents en hébergement permanent en 2023, coût de revient d'une place (54 684 € par an), tarif d'hébergement (71 € par jour), aides actuelles (allocation personnalisée d'autonomie 2,693 Md€, aide sociale nette 1,204 Md€), population de 80 ans et plus de 4,1 à 7,6 M de 2023 à 2050.
- Règles du système envisagé : plancher de 877 €, courbe des pensions, abattement de 300 000 € sur les transmissions.
- Hypothèses : voir plus bas. Les fichiers de `donnees/` portent les sources.

## Comment il calcule

1. **Prix public unique** par résident et par mois : coût d'une place mis à l'échelle de 2026, découpé en hébergement, dépendance (560 €) et soin (par différence). Central : 4 922 € dont 2 332 d'hébergement.
2. **Revenu de chaque résident type** : 100 niveaux de revenu tirés de la distribution connue (médiane, quartiles, moyenne), relevés de 22 % pour 2026.
3. **Patrimoine** : 40 niveaux par revenu, mélange de deux lois (propriétaires, médiane 200 000 € ; autres, 12 000 €), corrélées au revenu.
4. **Participation** = revenu − max(10 % du revenu, 120 €), sans dépasser l'hébergement. **Avance** par mois = hébergement − participation, multipliée par la durée de séjour des personnes décédées (34 mois).
5. **Reprise** = min(avance, patrimoine − abattement de reprise), puis calcul des droits de transmission perdus.
6. **Résultat** : dépense publique brute = prix total − participations ; nette = brute − reprises (+ droits perdus).

Exemple suivi (resultats.txt, § 5) : pension de 2 000 €, patrimoine de 300 000 €, séjour de 34 mois, abattement de reprise de 100 000 €. Aujourd'hui : manque de 619 € par mois, 21 012 € repris sur la succession. Proposition : participation de 1 800 €, 200 € de reste à vivre, avance de 532 € par mois, reprise de 18 078 €. La famille transmet 2 934 € de plus.

## L'hypothèse qui porte le résultat

Le coût d'une place (facteur 0,9 / 1 / 1,1) : à lui seul, il fait varier la dépense nette de 19,2 à 24,6 Md€ pour une référence de 21,9 (resultats.txt, § 7). Les paramètres du patrimoine (propriétaires, corrélation) comptent peu : de −0,3 à +0,4 Md€. L'abattement de reprise est le curseur de la proposition : de 0 à 300 000 €, la reprise passe de 3,0 à 0,4 Md€.

## Ce que l'IA a choisi elle-même

Treize des vingt hypothèses sont posées par l'IA sans source qui tranche : dispersion du coût d'une place, mise à l'échelle de 2023 à 2026, hausse des revenus, nombre d'héritiers et cumul déjà reçu, minimum de reste à vivre (120 €), part récupérée de l'aide sociale (non publiée), tendance du taux de résidence, bornes de durée de séjour, part de propriétaires et patrimoine médian, patrimoine des autres, corrélation revenu-patrimoine, conjoint à domicile, reprise limitée à l'avance « hébergement ». La forme de la distribution (lois lognormales, lien gaussien) est un choix de l'IA. Aucune statistique publique ne décrit le patrimoine des résidents : la reprise est un ordre de grandeur. Au « bas », les hypothèses sont favorables aux finances publiques.

## Ce qu'il ne fait pas

Le prix unique national ignore la diversité des coûts selon les départements. Sans réintégration des donations, l'avance se contourne : le modèle ne la traite pas. Il ne tient pas compte des changements de comportement (épargne, donations, entrée plus tardive). Les aides à domicile ne sont traitées que par une hausse de volume. La démographie est une projection de l'Insee, sans modèle de santé.

## Ce qu'il donne

- Participation à 90 % : 11,0 Md€ par an (10,7 à 11,0), 1 586 € par mois en moyenne (resultats.txt, § 3).
- Dépense totale : environ 34 Md€ (resultats.txt, § 4).
- Dépense publique nette après droits, central, abattement de 100 000 € : 21,9 Md€, contre 18,7 Md€ aujourd'hui (reconstitution) ou 20,5 Md€ (recalée sur la couverture publique de 74 %) : un surcoût de +3,2 ou +1,4 Md€. Bas à haut : +1,0 à +6,5 Md€ (reconstitution).
- Projection 2040 : 867 000 résidents, dépense nette de 24,2 à 44,4 Md€ (central 32,7).

## Comment le refaire

Depuis la racine du dépôt : `python3 -I modeles/grand-age/tests/test_grand_age.py` (21 tests, passent en 1 seconde) et `python3 -I modeles/grand-age/code/rapport.py`. Pas de données lourdes.
