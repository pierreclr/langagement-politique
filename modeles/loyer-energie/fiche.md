---
titre: Loyer plafonné selon l'énergie : premier modèle agrégé
theme: se loger
statut: brouillon ; dernier calcul du 03/11/2026
---

## La question

Ce modèle date du 3 novembre 2026. Sa suite, calculée le 8 novembre sur des diagnostics réels ville par ville, est `loyers-energie` : c'est elle que reprend `fonciere-afflux`. Celui-ci reste utile pour la comparaison avec l'interdiction de louer les passoires et pour le cas de la pompe à chaleur.

Il étudie la règle suivante : le loyer maximal d'un logement est celui d'un logement qui ne consomme rien, diminué du coût de l'énergie que le diagnostic de performance énergétique (DPE) estime pour le logement. Un logement très mal isolé reste louable, mais c'est le propriétaire qui supporte le coût de la mauvaise isolation. Le modèle cherche à quel niveau fixer le plafond, qui perd quoi, et si rénover devient rentable.

## Ce qui entre

- Consommation d'énergie finale par classe de DPE : moyennes de la base de l'ADEME (statistique publique), pour la France, Grenoble et Angers. Ce sont des flux de diagnostics (ventes, locations), pas le parc.
- Loyers : carte des loyers 2025 du ministère du logement. Ce sont des loyers d'annonce, plus hauts que les loyers en cours.
- Prix de l'énergie : électricité 0,20 €/kWh (tarif réglementé) ; gaz, bois, réseau : hypothèses.
- Parc locatif privé : 7,97 millions de logements, dont 13,8 % en classes F et G (SDES). Le SDES donne depuis 8,30 millions : écart non repris ici.
- Hypothèses : prime de loyer par classe, coût de rénovation, aides, comportement des bailleurs.

## Comment il calcule

Pour une classe X, une surface S et un loyer moyen de commune L (€/m²) :

1. Plafond de la classe A = k × L × S. Le coefficient k est le plus petit qui ne fait pas mordre le plafond sur les bons logements (de A à la classe protégée).
2. Déduction mensuelle = consommation d'énergie finale (kWh/m²/an) × S × prix moyen du kWh / 12.
3. Plafond de X = plafond de A − déduction de X.
4. Loyer retenu = le plus bas du loyer de marché de X et du plafond. Le loyer de marché de X = loyer moyen × (1 + prime de classe), de +4 % pour A à −6 % pour G.
5. Un bailleur rénove si le gain de loyer rembourse le coût en moins de 15, 12 ou 8 ans selon le scénario.

Le modèle utilise l'énergie finale (celle que le locataire paie) et non l'énergie primaire, qui dépend d'un coefficient de conversion modifié par arrêté.

Exemple, Grenoble, 50 m², classe G (resultats.md, section 1) : loyer de marché 736 €. Déduction : 341 kWh/m²/an × 50 m² × 0,154 €/kWh / 12 = 218 €. Plafond de A : 887 € (k = 1,132). Plafond de G = 887 − 218 = 669 €. Baisse du loyer : 67 € par mois.

## L'hypothèse qui porte le résultat

**Le niveau du plafond de la classe A, donc k, avec les primes de loyer par classe (H4, sans source).** À Grenoble, le plafond ne mord sur aucun logement à 20 €/m² (l'exemple de départ de la proposition). Il mord sur 24,5 % des logements au k calibré (1,132), sur 58 % si on arrondit à 17,74 €/m², et sur la totalité à k = 1,05 ; à k = 1,2 il ne mord plus que sur 2,3 % (resultats.md, section 1). Un plafond « haut et permissif » n'a donc pas d'effet avec les chiffres actuels.

## Ce que l'IA a choisi elle-même

Les 10 hypothèses H1 à H10 de la méthode portent presque toutes un ⚠️. Les choix de l'IA sans source qui tranche :

- H3 : prix du gaz, du bois, du réseau, et les coefficients ×0,85 et ×1,25.
- H4 : prime de loyer par classe (+4 % à −6 %). La « valeur verte » sur les loyers est faible ; plus la prime est forte, plus le plafond mord.
- H7 : coût de rénovation de 80 / 120 / 180 €/m² par saut de classe, aides de 35 / 25 / 0 %.
- H8 : horizon de rentabilité du bailleur de 15, 12 ou 8 ans, et parts de sortie de 5, 15 ou 25 % : une hypothèse unique pour les deux régimes comparés, donc la comparaison des retraits de logements n'a pas de base empirique.
- H9 : le cas type (G, 50 m², isolation de −45 % du besoin, pompe à chaleur à 4 500 €).
- H10 : scénarios bas, central, haut (classe protégée E, D ou C).
- Le choix d'Angers comme ville moyenne.
- Une option sanitaire (S1 à S4, désactivée par défaut) : trois hypothèses sur quatre sont posées par l'IA avec un facteur 24 entre bas et haut.

## Ce qu'il ne fait pas

- Pas d'effet de comportement : pas de retrait de logements du marché, pas de hausse des loyers des bons logements.
- Le diagnostic est pris comme vrai, alors que la Cour des comptes le juge peu fiable. Le modèle propose une base hybride (diagnostic, contre-expertise mesurée bornée entre 50 et 150 %).
- Les chiffres nationaux utilisent le loyer médian non pondéré des communes : ce sont des planchers.
- La consommation réelle est bien moindre que la conventionnelle (étude du Conseil d'analyse économique) : la déduction est plus forte que l'économie réelle du locataire.
- Les numéros des vérifications renvoient à un registre interne.

## Ce qu'il donne

- À Grenoble, central : le plafond mord sur 24,5 % des logements (E, F, G), baisse de 19 € (E), 44 € (F), 67 € (G) par mois (resultats.md, « Dix lignes », point 4).
- En France, central : 31 % du parc locatif privé concerné, transfert de l'ordre de 1,6 Md€ par an si personne ne rénovait (point 5).
- Rénovation : retour de 9 à 10 ans pour un saut vers D ou E à Grenoble ; rien ne se rembourse au-dessus de D (32 ans de D vers B) (point 6).
- Contre l'interdiction, par parc de 100 000 logements : 31 400 rénovés pour 141 M€ et aucun retiré, contre 26 700 rénovés pour 195 M€ et 4 700 retirés ; au scénario haut, la formule ne fait plus rénover personne (section 3).
- Isolation intérieure et pompe à chaleur : sans correction, le bailleur pose la pompe à chaleur ; avec une surface de référence figée et une déduction moitié euros, moitié besoin du bâti, il isole (retour de 6,0 ans contre 7,5) (section 4).

## Comment le refaire

Depuis le dossier du modèle :

- `python3 -I preparer_donnees.py` : lit les agrégats et la carte des loyers, stockés hors dépôt.
- `jsc donnees.js modele.js test_modele.js` avec l'interpréteur JavaScript du système : lancé le 9 novembre 2026, aucun contrôle en échec (97 lignes « ok » ; le document en annonce 56).
