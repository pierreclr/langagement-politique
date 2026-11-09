---
titre: Foncière publique et droit d'habiter à vie (versions successives)
theme: se loger
statut: relu de façon adverse ; dernier calcul du 09/11/2026
---

## La question

Ce modèle décrit des règles abandonnées le 9 novembre 2026 ; il est gardé pour comparaison. Le modèle à jour est `fonciere-afflux`.

Il cherche à savoir si une foncière publique peut vendre à des jeunes le droit d'habiter un logement à vie sans perdre d'argent, et ce que cela coûterait à l'État. La foncière achète le logement, le jeune en acquiert l'usufruit (le droit d'habiter et d'en tirer les revenus, sans pouvoir le vendre ni le léguer), et le logement revient à la foncière au décès.

## Ce qui entre

- Barème fiscal de l'usufruit (code général des impôts, art. 669) : texte public.
- Table de mortalité 2023-2025 de l'Insee : statistique publique.
- Prix des logements (ventes de 2024, fichier public des valeurs foncières), loyers (carte des loyers 2025), taux bancaire de 3,32 % (Banque de France, septembre 2026).
- Hypothèses de l'IA : croissance des prix de 2,5 % par an, coût de l'argent de 3,5 %, part des jeunes qui entrent (10, 30 ou 60 % des primo-accédants, puis 30, 50 ou 70 % d'une génération), coût de gestion, impayés, part de passoires rénovées.

## Comment il calcule

1. **Valeur de l'usufruit.** On calcule la probabilité d'être en vie chaque année avec la table de mortalité, améliorée de 1 % par an. Nue-propriété = moyenne de 1/(1 + r)^T, où T est l'année du décès et r le taux de tarification. Usufruit = 1 − nue-propriété. Au taux de 1,48 %, l'usufruit à 25 ans vaut 60 % du logement (resultats.md, v1 · 1).
2. **Le taux d'équilibre.** La foncière emprunte à i et le logement prend g par an : r = (1 + i)/(1 + g) − 1, soit environ 1 % avec 3,5 % et 2,5 %. Le modèle ajoute 0,5 point de prudence et retient 1,48 %.
3. **Le contrat.** Mensualité = somme à financer × taux mensuel / (1 − (1 + taux mensuel)^(−nombre de mois)).
4. **La foncière sur 60 ans.** Chaque année : entrées, achats, mensualités reçues, impayés, gestion, logements rendus. La dette suit D(t) = D(t−1) × (1 + i) + besoin net.
5. **Le test des 50 %.** Une unité publique dont les ventes couvrent moins de la moitié des coûts reste classée dans l'administration, et sa dette compte alors dans la dette publique. Ici : intérêts reçus / (intérêts payés + gestion + impayés), en moyenne sur trois ans.

Exemple suivi (ville moyenne, jeune de 25 ans au Smic, T2 à 119 000 €, règle de la version 2, resultats.md section B) : usufruit forfaitaire 70 % × 119 000 = 83 300 €, moins 40 000 € de capital de départ, donc 43 300 € à financer à 3,32 % sur 25 ans. Mensualité calculée à la main : 213 € (le tableau donne 213 €). Marge de la foncière : 10 points du prix, soit 11 877 €.

## L'hypothèse qui porte le résultat

**Les prix montent de 2,5 % par an et l'argent coûte 3,5 %.** Ces deux valeurs sont des choix de l'IA (H-FU7, H-FU19). Si les prix ne montent que de 1,5 % par an, le patrimoine net de la foncière à 60 ans devient négatif (−65 Md€ au lieu de +1 007 Md€, resultats.md, section D). Deux points d'intérêt en plus dès la sixième année creusent un trou de l'ordre de 800 Md€ en 60 ans (version 1, section 5).

## Ce que l'IA a choisi elle-même

Sur 52 hypothèses numérotées, 32 portent un ⚠️ ou sont des choix de l'IA, d'après un comptage des lignes de methode.md. Les principaux :

- Taux de tarification de 1,48 % (H-FU7) : l'IA le dit elle-même, c'est la décision qui compte. Plus il est haut, plus l'usufruit est cher pour le jeune et la marge de la foncière grande.
- Croissance des prix de 2,5 % (H-FU19), coût de l'argent de 3,5 % (H-FU11).
- Part des jeunes qui entrent : 30 %, 50 % ou 70 % d'une génération (H-FU16, H-FU50). Plus elle est haute, plus la dette et la hausse des prix montent.
- Gestion de 300 € par contrat et par an (H-FU25), impayés de 0,5 % (H-FU27).
- Élasticité de l'offre et de la demande (H-FU28, H-FU40) : trop souple par rapport aux études françaises. Les hausses de prix annoncées ici (4 à 7 %) sont probablement sous-estimées. `fonciere-afflux` les recalcule avec des valeurs plus proches des études, et trouve 13 à 17 %.
- Les secteurs (H-FU38), les cas types (H-FU13, H-FU36), les âges d'entrée (H-FU17, H-FU51), le prêt familial (H-FU41).

## Ce qu'il ne fait pas

- Aucune des règles successives n'est la règle en vigueur. L'auteur envisage maintenant un forfait de l'ordre de 85 % du prix, à l'étude. Les chiffres 451 €, 727 € et 250 € de la version 1 viennent d'une règle périmée.
- La version 2 prend 70 % comme scénario principal. Elle conclut que le test des 50 % échoue (22 %) ; la comparaison avec la règle « mensualité bancaire » (aujourd'hui abandonnée) conclut qu'il passe. Les deux ne valent que comme comparaison.
- La ligne « la foncière emprunte à 4,7 % » change aussi la hausse des prix, les impayés et la gestion : elle ne mesure pas l'effet du taux seul. Avec le taux seul, l'essai de relecture donne 49 % à 4,7 % et 34 % à 5,3 %.
- Pas d'équilibre du marché du logement, pas de sélection (qui choisit l'usufruit), pas de géographie dans la simulation (prix moyen national), pas de sorties anticipées.
- Les cinq valeurs du coût de l'argent public ne concordent pas entre modèles.

## Ce qu'il donne

Pour comparaison seulement.

- Version 2, 50 % d'une génération : ratio recettes sur coûts de 22 % au plus bas, 49 % à l'an 10 ; dette de 1 832 Md€ à 30 ans, 66,4 % du PIB à 60 ans (resultats.md, section D).
- Pour tenir 60 ans, le taux du contrat doit dépasser le taux bancaire d'environ 2,1 points ; un forfait d'environ 85 % tient 30 ans (section D).
- Surcoût du forfait de 70 % par rapport à la valeur actuarielle : 17 % à 25 ans, 31 % à 35 ans, 89 % à 55 ans : d'où la borne d'âge de 35 ans (section C).
- Effet de niveau sur les prix à 50 % d'une génération : 4,7 % (rural) à 18,9 % (Paris), fourchette large (section E).
- Besoin de financement de 89 Md€ par an à l'an 10 à 50 % d'une génération (section D).

## Comment le refaire

Depuis la racine du dépôt :

- `python3 -I modeles/fonciere-usufruit/tests/test_fonciere.py` : 25 tests, lancés le 9 novembre 2026, ils passent en 2 secondes.
- `python3 -I modeles/fonciere-usufruit/code/calculer.py` : recalcule les résultats (non relancé ici).
- `code/preparer_secteurs.py` : prix et loyers par secteur.
