---
titre: Capital de départ et foncière : options comparées (règle abandonnée)
theme: contribuer
statut: relu de façon adverse ; dernier calcul du 09/11/2026
---

## La question

Ce modèle décrit une règle abandonnée le 9 novembre 2026 ; il est gardé pour comparaison. Il simule une foncière dont la mensualité est celle d'une banque, avec des revenus de jeunes qui ne sont pas sourcés. Le modèle à jour est `fonciere-afflux`.

Il comparait cinq façons de donner le capital de départ à un jeune qui entre dans la foncière (apport seul, argent, cinq versements, parts à vie, formation) et cherchait celle qui sert le plus de jeunes pour un coût et un effet sur les prix raisonnables. La foncière est un organisme public qui achète le logement avec le jeune et en reste propriétaire final.

## Ce qui entre

- Génération de 830 000 jeunes (Eurostat). Héritages : loi reprise de `capital-de-depart` (étude du Conseil d'analyse économique de 2021).
- Prix de vente par secteur : fichier public des ventes de 2024. Taux bancaire de 3,32 % (Banque de France). Règle des 35 % d'effort : décision publique du Haut Conseil de stabilité financière.
- Revenus des 25-34 ans par décile : valeurs posées par l'IA, non lues dans l'Insee (H-CO3).
- Accès au crédit, part qui veut acheter, valeur de ce que le jeune abandonne, effet d'appel : hypothèses de l'IA.

## Comment il calcule

1. Chaque jeune est repéré par son rang d'héritage, son décile de revenu, son secteur et son âge d'entrée (25, 30 ou 35 ans). Capital = montant × e^(−héritage / 80 000 €).
2. **Foncière.** Mensualité = (part de logement − capital) × taux mensuel / (1 − (1 + taux mensuel)^(−nombre de mois)), plus la contribution de 0,25 % de la valeur par an. Le jeune entre seulement si mensualité plus contribution restent sous 35 % de son revenu.
3. **Banque.** Il y a accès s'il a 10 % d'apport (probabilité 0,15 + 0,75 × rang d'héritage), s'il est solvable, et s'il n'est pas refusé pour précarité (30 % dans le premier décile, 5 % dans le dernier).
4. **Le choix.** Un jeune qui veut se fixer et peut aller à la banque prend la foncière si ce qu'il reçoit (le capital) dépasse ce qu'il abandonne, la nue-propriété (valeur du logement après sa mort) plus une prime de liberté. Un jeune sans accès bancaire prend la foncière s'il peut payer. Un jeune qui ne voulait pas se fixer peut entrer pour ne pas perdre le capital : c'est l'effet d'appel.
5. On additionne sur la génération, on lance la simulation de la foncière sur 60 ans (modèle `fonciere-usufruit`), et on borne l'effet sur les prix par (contrats ajoutés / ventes du secteur) / élasticité.
6. Une grille de 216 réglages cherche le meilleur sous contraintes.

Exemple (resultats.md, section 1) : l'option A donne 40 000 € à la foncière seulement. Elle sert 26 % d'une génération, coûte 4,9 Md€ par an et 74 % des jeunes ne reçoivent rien.

## L'hypothèse qui porte le résultat

**L'effet d'appel** (H-CO13 : 10 / 20 / 30 % des jeunes qui ne voulaient pas se fixer entrent pour ne pas perdre leur capital). La méthode la qualifie elle-même d'hypothèse la plus fragile. Elle explique l'avance de l'option A sur les autres. Elle n'est pas testée seule ; elle varie avec les autres dans le scénario de recours. L'effet sur les prix dans les métropoles passe alors de 2,3 % à 9,3 % (resultats.md, section 3).

## Ce que l'IA a choisi elle-même

Sur 31 hypothèses numérotées, 20 portent un ⚠️ ou sont posées par l'IA, d'après un comptage des lignes de methode.md. Les plus importantes :

- H-CO3 : les revenus des jeunes par décile (900 € à 4 000 €). Non sourcé. La relecture demande de les recaler sur l'Insee avant de publier un chiffre de ce modèle.
- H-CO9 : l'accès au crédit. Aucune statistique publique des refus.
- H-CO10 : 60 % veulent se fixer. Plus c'est haut, plus l'afflux monte.
- H-CO12 : valeur de la nue-propriété abandonnée et prime de liberté de 10 %.
- H-CO13 : effet d'appel.
- H-CO14 : un euro en parts à vie vaut 0,6, une formation 0,4.
- H-CO18 : élasticités des prix, trop souples face aux études françaises : l'effet sur les prix est probablement sous-estimé.
- H-CO6 : les jeunes sont répartis comme les ventes, alors qu'ils sont plus urbains.
- H-CO24 : contraintes de la grille (effet sur les prix ≤ 5 %, coût ≤ 14,7 Md€) : « choix de Claude ».
- H-CO25 à H-CO29 : règles de quota, de capacité et de sort des générations du lancement.

## Ce qu'il ne fait pas

- Il applique la règle de la mensualité bancaire, abandonnée depuis. Avec elle, le test des 50 % est passé (ratio de 105 à 112 %) parce que la mensualité contient une marge implicite. Le modèle `fonciere-usufruit`, avec la règle suivante, conclut le contraire (22 %).
- La ligne « la foncière emprunte à 4,7 % » (ratio de 32 %) change aussi la hausse des prix, les impayés et la gestion. Avec le taux seul, l'essai de relecture donne 49 % à 4,7 % et 34 % à 5,3 %.
- Pas de construction, pas de mobilité, pas de défaut, pas d'effet sur les loyers.
- Les parts d'une génération sont des hypothèses mises en forme, pas des résultats.
- Le capital passant par la foncière cesse d'être universel : au réglage recommandé, 7 % de propriétaires dans le dixième aux plus bas revenus et 0 % à Paris. Le choix entre capital universel et capital réservé reste ouvert.

## Ce qu'il donne

À lire comme des comparaisons, pas comme des valeurs du programme.

- Option A : 42 % de propriétaires à 35 ans (16 % sans dispositif), coût 4,9 Md€, effet prix 6,9 % en villes moyennes ; option D (chapitre actuel du manifeste) : 14,7 Md€, 13,6 Md€ d'argent libre (resultats.md, section 1).
- Réglage recommandé alors : coût 9,3 Md€ par an, 36 % de propriétaires, effet prix 4,7 % (métropoles) à 5,3 % (villes moyennes), jusqu'à 10,6 % au recours haut, dette de 92 Md€ à 10 ans et 311 Md€ à 30 ans (section 3).
- Au même réglage, 20 % d'une génération est servie et la moitié qui hérite le moins atteint 35 % de propriétaires.
- Démarrage : avec une ouverture aux seules générations entrantes, la file d'attente est résorbée en 9 ans (section 4).

## Comment le refaire

Depuis la racine du dépôt :

- `python3 -I modeles/capital-de-depart-options/tests/test_options.py` : 12 tests, lancés le 9 novembre 2026, ils passent en 2 secondes.
- `node modeles/capital-de-depart-options/code/exporter_heritages.js` (nécessite node), puis `python3 -I modeles/capital-de-depart-options/code/calculer.py` : environ une minute (non relancé ici).
