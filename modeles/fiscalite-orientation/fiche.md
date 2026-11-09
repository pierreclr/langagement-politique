---
titre: Taxer ce qui pollue, détaxer l'essentiel
theme: contribuer
statut: brouillon ; calcul du 25/10/2026 (une sensibilité sur la viande a été ajoutée ensuite)
---

## La question
Que rapporte, et que fait gagner au climat, une fiscalité « pollueur-payeur » sans interdiction : plus de taxe sur l'alimentation, l'eau et les médicaments, et de fortes taxes sur la viande, les carburants, le chauffage au gaz et au fioul, les billets d'avion et les voitures lourdes ? Qui la paie, selon le revenu ? Le modèle traite deux cas : un paquet conforme au droit européen, et un paquet qui ajoute une taxe carbone sur les importations, interdite par ce droit.

## Ce qui entre
- Statistique publique : la consommation des ménages par poste en 2024 (Insee, comptes nationaux) : par exemple 33,3 Md€ de viande, 52,0 Md€ de carburants, 15,7 Md€ de transport aérien, 131,3 Md€ d'alimentation hors viande et poisson.
- Statistique publique : l'empreinte carbone par produit (Insee et service statistique du ministère de l'Écologie), 575 millions de tonnes en 2024 ; la dépense par poste selon le niveau de vie (enquête Budget de famille 2017) ; le revenu disponible par dixième de la population (comptes distribués, 2023).
- Études : les élasticités-prix, c'est-à-dire le pourcentage de baisse de la consommation quand le prix monte de 1 %. Viande : 0,7 (étude américaine) ; carburants : 0,45 et chauffage : 0,2 (thèse de Douenne, 2020, France) ; avion : 0,8 (étude de 2007 commandée par le transport aérien).
- Hypothèses : les intensités carbone par euro de plusieurs postes, la part des taxes déjà payées dans les prix, et le niveau des nouvelles taxes (viande +25 %, carburants +15 %, gaz et fioul +15 %, avion +60 %, voitures lourdes +25 %).

## Comment il calcule
Le calcul est fait poste par poste, pour une seule année, puis additionné.

1. **Effet du prix sur la quantité.** Si le prix monte de τ (par exemple 25 %), la quantité achetée devient q = (1 + τ) puissance (− élasticité). Pour la viande : 1,25 puissance −0,7 = 0,855, soit 14,5 % de volume en moins.
2. **Recette nouvelle** = τ × dépense de départ × q. Viande : 0,25 × 33,3 × 0,855 = 7,1 Md€.
3. **Recettes perdues** sur les achats qui disparaissent = part des taxes actuelles × dépense × (1 − q). Viande : 0,052 × 33,3 × 0,145 = 0,25 Md€.
4. **Effet de report.** Ce que les ménages dépensent de plus ou de moins sur le poste, ils le dépensent de moins ou de plus ailleurs, où l'État prélève 9 % de taxes. Viande : la dépense monte de 2,3 Md€, donc 0,2 Md€ de taxes en moins ailleurs.
5. **Recette nette** = recette nouvelle − recettes perdues + effet de report. Viande : 6,7 Md€.
6. **Émissions évitées** = intensité carbone × dépense × (q − 1). Viande, avec 1 kg de CO2 par euro : −4,8 millions de tonnes.
7. **Taxe à 0 %.** La taxe perdue vaut dépense × taux / (1 + taux) ; on suppose la baisse entièrement passée dans les prix. Les ménages achètent un peu plus, ce qui émet un peu plus (premier « effet rebond »).
8. **Effets rebond.** L'argent qui n'est plus dépensé en viande ou en avion part ailleurs, à 0,2 kg par euro. Puis 90 % de la recette nette, rendue aux ménages, est dépensée au contenu moyen de leur consommation (0,263 kg par euro).
9. **Par dixième de revenu.** La charge de chaque poste est répartie selon la part de chaque dixième dans la dépense de ce poste (enquête de 2017), puis rapportée à son revenu. On simule enfin un versement de la recette nette à parts égales entre les dixièmes.

Le code suit ces formules ; on retrouve à la main les 6,7 Md€ et les −4,8 millions de tonnes de la viande.

## L'hypothèse qui porte le résultat
Les **élasticités**, tenues constantes. Elles font varier la recette et l'effet climat en sens contraire : plus les ménages réagissent, moins la taxe rapporte et plus elle réduit les émissions. Avec des réactions faibles, la recette du paquet conforme est de 17,8 Md€ et les émissions baissent de 7 millions de tonnes ; avec des réactions fortes, 11,9 Md€ et 18,5 millions de tonnes. Elles viennent d'études faites ailleurs ou sur le court terme, et une hausse de 60 % du billet d'avion sort du domaine où elles ont été mesurées. Pour la viande, une étude française donne une réaction plus forte (1,2) : la recette baisse alors un peu (14,3 Md€) et l'effet climat monte (14,8 millions de tonnes).

## Ce que l'IA a choisi elle-même
Douze hypothèses sur vingt sont écrites « de Claude » dans la méthode, et trois autres sont marquées non confirmées sans auteur. Les plus importantes :
- H19 : le niveau des taxes du scénario central (viande +25 %, avion +60 %…). C'est le premier moteur de la recette : divisées par deux, elles rapportent 4,4 Md€ ; multipliées par 1,5, 24,0 Md€.
- H8 : la part des taxes déjà payées dans les prix (50 % pour les carburants), qui fixe les recettes perdues.
- H3 et H4 : l'intensité carbone de la viande (1 kg par euro, de 0,6 à 1,4) et des carburants ; elles portent l'effet climat (9,9 à 18,2 millions de tonnes selon les intensités).
- H2, H11, H12, H16 : 40 % de voitures lourdes (60 % donne 16,1 Md€) ; la répartition de 2017 vaut pour 2024 ; 10 % des vols évités partent d'aéroports voisins ; 90 % de la recette rendue est dépensée.
- H13, H17, H20 : les importations, leur remplacement par des produits français et le prix de 200 € par tonne du scénario hors règles.
- Sans auteur nommé : H9 (baisse de taxe entièrement passée dans les prix ; à 50 %, la moitié du gain va aux marges), H14 (9 % de taxes sur le reste de la consommation).

## Ce qu'il ne fait pas
- Il est statique : une seule année, réactions de court ou moyen terme. Si la politique réussit, l'assiette fond et la recette baisse avec le temps.
- Il ne compte que les achats des ménages : pas la viande des cantines, ni le gazole des camions. La recette est donc sous-estimée.
- Ni emploi (élevage, aérien), ni contrebande, ni représailles commerciales ; les voitures ne comptent que les émissions de fabrication.
- Les réactions sont les mêmes dans tous les dixièmes de revenu. Les écarts entre ruraux et urbains, qui pèsent plus que ceux de revenu, ne sont pas modélisés.
- Point à vérifier : les comparaisons au socle universel et au « trou » du budget (§ 3 et § 5 des résultats) datent d'une version plus ancienne du programme (socle de 1 000 € par mois). Elles ne correspondent plus au système actuel.

## Ce qu'il donne
- Recette nette du paquet conforme : 12 à 18 Md€ par an, 15 Md€ au centre ; 25 à 32 Md€ si l'on dépasse les règles européennes (resultats.md, § 1 et § 2).
- Émissions évitées après rebonds : 7 à 19 millions de tonnes par an, soit 1 à 3 % de l'empreinte carbone ; le scénario hors règles n'en évite pas plus (4 à 18) (resultats.md, § 1).
- Les taxes seules pèsent 2,1 % du revenu du dixième le plus modeste et 1,1 % du plus aisé ; avec le 0 % sur l'essentiel, 0,8 à 1,1 % partout ; avec un versement égal, le dixième le plus modeste gagne 1,7 % de son revenu et le plus aisé perd 0,45 % (resultats.md, § 3).
- La taxe à 0 % coûte environ 8 Md€ ; la viande (6,7 Md€) et l'avion (6,1 Md€) la financent largement (resultats.md, § 2).
- Aucune combinaison testée ne dépasse environ 45 Md€ ni 4 % de l'empreinte (resultats.md, § 4).

## Comment le refaire
Depuis le dossier du modèle, avec le moteur JavaScript de macOS :
`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc modele.js test_modele.js`
Cette commande relance les tests et affiche tous les chiffres des résultats. Relancée le 9 novembre 2026 : 12 contrôles, tous passent, en moins d'une seconde.
