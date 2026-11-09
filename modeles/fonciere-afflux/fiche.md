---
titre: Afflux vers la foncière et effet sur les prix
theme: se loger
statut: brouillon ; dernier calcul du 09/11/2026
---

## La question

Si une foncière publique entre dans l'achat des logements de jeunes salariés, combien de jeunes viendront, de combien les prix monteront-ils, et à quelles conditions la foncière tient-elle financièrement ? Le modèle mesure ces effets pour la mesure « droit d'habiter à vie, avec capital de départ en apport ». C'est le modèle à jour de la foncière : il remplace dans ce rôle `fonciere-usufruit` et `capital-de-depart-options`, qui décrivent des règles abandonnées.

La foncière achète le logement avec le jeune et en reste propriétaire final. Le jeune acquiert l'usufruit : le droit d'habiter le logement et d'en tirer les revenus, sans pouvoir le vendre ni le léguer, à un prix forfaitaire, un pourcentage f du prix.

## Ce qui entre

- Une génération de 830 000 jeunes (statistique publique d'Eurostat, reprise d'un autre modèle).
- Âge et revenu au premier emploi stable (médiane de 1 800 € nets) : estimations calées sur des enquêtes publiques (Céreq, Insee). Aucune distribution de l'âge n'est publiée : c'est une inférence.
- Héritages : loi reprise du modèle `capital-de-depart`.
- Prix de vente et loyers par secteur, parc locatif privé par surface et classe énergétique (SDES, 2025), taux bancaire de 3,32 % (Banque de France, septembre 2026) : données publiques.
- Part qui veut se fixer, refus bancaires, ventes des bailleurs, effet d'appel : hypothèses de l'IA.

## Comment il calcule

1. **La population.** Une génération est découpée en cellules : 40 groupes d'héritage, 10 tranches de revenu, 4 secteurs, 5 âges d'entrée, 3 types de ménage.
2. **Le choix de chaque ménage** entre foncière, banque et location. Prix du droit = f × prix du logement, moins le capital de départ (40 000 € × e^(−héritage / 80 000 €)). Le reste est emprunté sur 25 ou 30 ans : mensualité = somme empruntée × taux mensuel / (1 − (1 + taux mensuel)^(−nombre de mois)). Le ménage entre si mensualité plus contribution tiennent sous 35 % de son revenu, et si ce qu'il abandonne (la nue-propriété, valeur du logement après sa mort) ne dépasse pas ce qu'il gagne.
3. **L'afflux** : somme des ménages qui choisissent la foncière, avec un plafond éventuel d'entrées.
4. **L'offre.** Plafond de loyer et fin des avantages fiscaux réduisent le revenu des bailleurs. Probabilité de vendre = part de base × (perte de revenu net / 15 %), au plus 1.
5. **Les prix.** Effet = (demande ajoutée − offre ajoutée) / ventes du segment × réponse du prix, avec réponse du prix = 1 / (élasticité de l'offre + élasticité de la demande). L'élasticité mesure de combien l'offre ou la demande bouge quand le prix bouge de 1 %. L'effet se diffuse pour moitié entre tailles de logement : c'est un niveau atteint en 5 à 10 ans, pas une trajectoire.
6. **Les finances** : `fonciere-usufruit` simule la dette et les recettes de la foncière sur 60 ans avec les entrants calculés ici.

Exemple, f = 85 %, 25 ans (moyennes de resultats.md, section 2, calcul refait à la main) : prix moyen 148 926 €, droit à 126 587 €, capital apporté 30 459 €. Reste 96 128 €, soit environ 472 € par mois à 3,32 % sur 25 ans. Ce n'est pas un cas réel : le modèle calcule chaque ménage séparément.

## L'hypothèse qui porte le résultat

**L'élasticité de l'offre de logements** (H-FA21 : 0,3 à Paris, 0,4 en métropole, 0,5 en ville moyenne, 1 en rural). Elle vient de fourchettes d'études françaises, mais la ventilation par zone est un choix de l'IA : aucune étude ne la donne. Dans le test de sensibilité (resultats.md, section 9), la hausse des prix de la foncière seule passe de +13,7 % à +20,7 % entre les valeurs basse et haute, autour de +17,2 %. La part qui veut se fixer (H-FA11, 60 %) porte l'afflux : 244 000 à 323 000 jeunes par an.

Pour la réforme locative, c'est la part des bailleurs qui vendent (H-FA33, 15 %), qu'aucune étude ne mesure : l'effet net passe de +11,0 % à +16,8 %.

## Ce que l'IA a choisi elle-même

Sur 47 hypothèses numérotées, 35 portent un ⚠️ ou une règle posée par l'IA (comptage des lignes de methode.md). Les plus lourdes :

- H-FA11 : 60 % veulent se fixer. Plus c'est haut, plus l'afflux et la hausse des prix montent.
- H-FA21 et H-FA22 : ventilation des élasticités par zone, diffusion entre tailles. Une offre plus souple ferait baisser la hausse des prix.
- H-FA33 : 15 % de vente par bailleur touché. Plus c'est haut, plus la réforme locative fait baisser les prix.
- H-FA13, H-FA16, H-FA14 : valeur subjective de la nue-propriété abandonnée, effet d'appel de 10 %, 50 % qui montent d'une taille de logement.
- H-FA2, H-FA3, H-FA9 : âge d'entrée, revenus, composition des ménages.
- H-FA70 à H-FA80 : toute l'expérimentation (chantiers, productivité, impayés).

## Ce qu'il ne fait pas

- Pas d'équilibre dynamique : ni récession, ni choc de taux, ni construction induite au-delà de l'élasticité. Les comportements sont des règles de décision, pas des estimations.
- La simulation financière est nationale et ne reprend pas la hausse des prix que la foncière provoque.
- La contribution sur le patrimoine des bailleurs n'est pas modélisée ; elle pourrait faire vendre bien plus.
- Pas de revente ni de mobilité des usufruitiers. À Paris, presque personne n'entre.
- Le coût de l'argent de la foncière (3,5 %) diffère de celui du modèle des taux (4,7 %) : la dette est donnée aux deux.
- La méthode signale que `fonciere-usufruit` et `capital-de-depart-options` ont des élasticités plus souples que les études françaises : leurs effets sur les prix (4 à 7 %) sont probablement sous-estimés.
- Le paragraphe de règle auquel renvoie la méthode n'est pas dans la copie de travail : la règle chiffrée est celle de la demande de l'auteur du 9 novembre.

## Ce qu'il donne

- À f = 85 %, 25 ans : 284 000 jeunes par an (220 000 à 319 000), soit 20 % des ventes (resultats.md, « Dix lignes »).
- Prix, foncière seule : +17,2 % en villes moyennes, +13,2 % en métropoles, +11,7 % en rural ; fourchette +9,5 % à +33,1 % dans le secteur le plus touché. Réforme locative seule : −4,4 % à Paris, −4,3 % en métropoles (section 4).
- Foncière : dette de 531 Md€ à 30 ans à 3,5 % (641 à 4,7 %). Le test des 50 % (les recettes couvrent la moitié des coûts, sinon la dette compte dans la dette publique) échoue à 48 %. Il faut f = 87 % ou une marge de 0,1 point sur 30 ans (section 6.1).
- Réglage sous contraintes (prix ≤ 5 %, test des 50 % sur 30 ans, capital ≤ 14,7 Md€) : f = 70 %, 30 ans, marge de 2 points, plafond de 6 % d'une génération (50 000 par an) : 23 % de propriétaires dans la moitié qui hérite le moins, contre 10 % sans dispositif (section 7.2).

## Comment le refaire

Depuis la racine du dépôt :

- `python3 -I modeles/fonciere-afflux/tests/test_afflux.py` : 22 tests, lancés le 9 novembre 2026, ils passent en 3 secondes.
- `python3 -I modeles/fonciere-afflux/code/calculer.py` : le calcul complet, environ 3 minutes d'après la méthode (non relancé ici).
