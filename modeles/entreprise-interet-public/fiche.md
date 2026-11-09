---
titre: Entreprise d'intérêt public et son « pari » industriel
theme: État
statut: relu de façon adverse ; dernier calcul du 09/11/2026
---

## La question

Combien coûterait à l'État une holding publique qui finance, par tranches conditionnées aux résultats, de petites équipes dans quatre domaines (calcul et intelligence artificielle, petits réacteurs nucléaires, robotique des métiers dangereux, objets du quotidien réparables) ? Que se passe-t-il si les projets échouent, et que devient la dette ? C'est un premier chiffrage, qui n'établit pas que le pari est rentable.

## Ce qui entre

- Dix programmes industriels d'État français comme précédents (nucléaire, Airbus, Concorde, Plan Calcul, Andromède, etc.) : cotes de A à D selon la ligne. Cinq lignes viennent de la mémoire de l'IA et sont marquées à sourcer.
- Coûts d'un centre de calcul (étude Epoch AI, modèle américain stylisé), d'un petit réacteur (chantier canadien de Darlington, projet américain NuScale abandonné), d'une ligne d'électroménager (usine citée par la presse).
- La trajectoire de dette de notre système et le modèle des taux `taux-endogene`.
- Hypothèses de l'IA : probabilités de réussite, chiffre d'affaires et marges, prix de location du calcul, nombre de projets.

## Comment il calcule

Pour chaque domaine, de 2029 à 2058 :

1. **Tranches.** Chaque projet passe deux jalons : probabilité p1 puis p2. La série est lancée si au moins un des n projets parallèles les passe : P(série) = 1 − (1 − p1 × p2)^n.
2. **Série.** Des unités sont lancées chaque année. Le coût de chaque doublement baisse par apprentissage : coût de l'unité de rang r = coût de la première × r^(log2(1 − taux d'apprentissage)).
3. **Exploitation.** Chiffre d'affaires par unité, marge avant intérêts et amortissements, investissement de renouvellement.
4. **Espérances.** Capital, revenus et emplois de la série sont multipliés par P(série). Ce sont des moyennes : en réalité, un domaine réussit ou échoue.
5. **Holding.** Frais de tête, épargne de particuliers en parts viagères, partage d'un éventuel bénéfice (30 % reversé au socle, 30 % au désendettement, 40 % réinvesti).
6. **Dette.** Le coût net s'ajoute à la trajectoire de dette du système, au taux fixe de 3,45 % ou au taux qui suit la dette.

Exemple (calcul à la main) : au scénario prudent pour le calcul, p1 × p2 = 0,30 et 3 projets : P(série) = 1 − 0,7³ = 66 %. Au central, p1 × p2 = 0,42 : 1 − 0,58³ = 80 % (resultats.md, tableaux des scénarios).

## L'hypothèse qui porte le résultat

**Les projets sont indépendants (H-EIP2), ce qui donne 66 à 91 % de chances de lancer une série.** Les dix précédents du dossier donnent 20 % de réussite nette, et 35 % en comptant les réussites partielles pour moitié. Des échecs corrélés (même cause : talents, demande) feraient baisser fortement la probabilité. Dans le calcul de la relecture, avec un seul projet effectif et 20 % de réussite, le coût public du central tombe de 38,4 à 15,0 Md€ : un succès plus probable augmente le coût, parce que chaque série lancée perd de l'argent au central. Cette sensibilité n'est pas dans les résultats du dossier.

Seconde hypothèse : **le prix de location du calcul** (H-EIP7 : 0,67 / 0,86 / 1,07 Md€ de chiffre d'affaires par centre de 100 MW). Un prix de 30 % plus bas fait passer le scénario ambitieux d'un gain de 10,2 Md€ à un coût de 35,7 Md€, selon la relecture.

## Ce que l'IA a choisi elle-même

Sur 26 hypothèses numérotées, 19 sont des hypothèses de l'IA ou portent un ⚠️. Les principales :

- H-EIP2 : indépendance des projets, un seul succès lance la série (pousse le coût attendu à la baisse pour les séries rentables, à la hausse sinon).
- H-EIP7 : chiffre d'affaires par centre de calcul. Le calcul colle avec un prix de 2 $ par heure de processeur graphique : la relecture soupçonne que le montant est en dollars et non en euros (0,77 au lieu de 0,86 Md€). Non tranché.
- H-EIP8, H-EIP12, H-EIP16, H-EIP20 : nombre de projets, probabilités, capacités lancées.
- H-EIP13 à H-EIP15 : coût, chiffre d'affaires et durée de vie d'un robot (80 à 30 k€ ; 11 à 27 k€ par an).
- H-EIP18 : marge de 0 à 12 % sur l'électroménager, au-dessus des 5 à 8 % cités pour les grands du secteur, de mémoire.
- H-EIP22 et H-EIP23 : épargne en parts viagères, partage du bénéfice.
- H-EIP24 : la holding est consolidée dans les administrations publiques.
- H-EIP3 : un emploi de recherche coûte 150 k€, appliqué même aux démonstrateurs de réacteurs, ce qui gonfle les emplois.

## Ce qu'il ne fait pas

- Pas de corrélation des échecs, pas de faillite brutale : seulement des espérances.
- Le coût d'un échec technique et celui d'un échec commercial sont très différents. Si tout échoue au second jalon, le pari coûte 7 à 10 Md€. Si les séries sont lancées sans trouver leur marge, le coût monte à 29 à 38 Md€ sur 30 ans (resultats.md, lecture 1). Un texte qui dit « s'il échoue, il aura coûté peu » ne vaut que pour le premier cas.
- Dans la variante hors administrations publiques, la dette propre de la holding s'accumule sans intérêts : au taux de 3,45 %, il manque 4,6 à 9,0 Md€ selon la relecture.
- Pas de droit de la concurrence ni d'aides d'État, pas de baisse des prix du calcul au-delà de la marge retenue.
- Le financement du pari dans le bilan global du programme n'est pas réglé : les 3 Md€ par an comptés ailleurs recoupent peut-être son enveloppe, ou bien le pari n'est financé nulle part.
- Les tests vérifient des formules, pas la cohérence économique des résultats.

## Ce qu'il donne

- Coût public net sur 2029-2058, holding consolidée : 29,4 Md€ (prudent), 38,4 Md€ (central), −10,2 Md€ (ambitieux, un gain) ; pic de 1,77 / 3,74 / 7,89 Md€ en une année (resultats.md, sections des scénarios).
- Sur dix ans : 10,8 / 17,6 / 38,0 Md€.
- Effet sur la dette en 2058, au taux qui suit la dette : +1,62 / +2,19 / +0,48 point de PIB.
- Pire cas des tranches si tout échoue au second jalon : 6,7 / 8,9 / 9,8 Md€.
- Les petits réacteurs n'ont un flux annuel positif qu'entre 2047 et 2052, et leur flux cumulé reste négatif en 2058 (lecture 3).

Les trois scénarios mêlent la taille du programme et la chance. Des ordres de grandeur sous hypothèses, jamais des prédictions.

## Comment le refaire

Depuis la racine du dépôt :

- `python3 -I modeles/entreprise-interet-public/tests/test_modele.py` : 10 tests, lancés le 9 novembre 2026, ils passent.
- `python3 -I modeles/entreprise-interet-public/calculer.py` : régénère les résultats (non relancé ici).
