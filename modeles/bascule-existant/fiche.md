---
titre: Passer de l'ancien au nouveau système pour les patrimoines déjà constitués
theme: contribuer
statut: brouillon ; données consultées le 25/10/2026 (la date du calcul n'est pas écrite dans les résultats)
---

## La question
Le système proposé taxe l'argent au moment où il sort : distribution d'un bénéfice, vente, rachat, transmission, départ à l'étranger. Que faire des milliers de milliards d'euros accumulés sous les règles actuelles (réserves des sociétés, plus-values jamais réalisées, assurance-vie, plans d'épargne en actions, donations avec usufruit gardé, réductions d'impôt en cours) ? Le modèle chiffre plusieurs règles de passage et dit lesquelles semblent solides en droit. Le principe de l'auteur est que la date de l'événement fixe le régime, pas la date du montage.

Point à savoir avant de lire : le modèle a été construit le 25 octobre 2026 sur la première version du système, un prélèvement unique de 50 % sur tout ce qui sort. Il n'a pas été recalé sur la version actuelle du système, dont le barème a changé depuis. Ses montants donnent des ordres de grandeur sur la transition, pas des chiffres à ajouter aux comptes publiés.

## Ce qui entre
- Statistiques publiques : encours des ménages fin 2025 (Banque de France) : titres non cotés 1 507 Md€, actions cotées et fonds 622 Md€, assurance-vie et épargne retraite 2 177 Md€, plans d'épargne en actions 145 Md€ ; logements et terrains des ménages 8 850 Md€ fin 2024 (Insee).
- Rapports : Cour des comptes sur le dispositif Pinel (2024) et le pacte Dutreil (2025) ; recettes actuelles des droits de succession (20,9 Md€ pour environ 300 Md€ transmis).
- Droit : décisions du Conseil constitutionnel de 2013 et 2014, jurisprudence européenne, taxe américaine de 2017 sur les bénéfices accumulés (15,5 % et 8 %).
- Hypothèses : la part de plus-value cachée dans chaque stock, le rythme auquel le stock se vend ou se transmet, la part qui passe par une transmission, le volume des donations avec usufruit gardé, l'anticipation des grandes familles. Presque toutes sont posées par l'IA (voir plus bas).

## Comment il calcule
Le modèle traite chaque stock séparément, dans trois scénarios (bas, central, haut). « Haut » veut dire « enjeux élevés », pas « favorable ».

1. Plus-value cachée : G = g × V, où V est la valeur du stock et g la part de cette valeur qui est un gain jamais taxé.
2. Rythme de sortie : chaque année, une part ρ (rho) de ce qui reste se réalise. L'année y, la part réalisée vaut ρ × (1 − ρ)^(y − 1). Le temps pour que 90 % du stock soit passé par un événement taxable vaut ln(0,1) / ln(1 − ρ).
3. Actualisation : un euro perçu dans y années vaut 1 / 1,03^y aujourd'hui. Le facteur F = somme sur 30 ans de ρ (1 − ρ)^(y − 1) / 1,03^y résume à la fois le rythme et l'attente.
4. Recette d'un stock : VA = (1 − σ) × G × t_vente × F + σ × V × t_transmission × F. Ici σ est la part des sorties qui se font par transmission ; la vente est taxée sur la plus-value seule, la transmission sur la valeur entière.
5. Les taux dépendent de la règle choisie : ancien régime (taux effectifs actuels, par exemple 30 % à la vente d'actions, 7 % de la valeur à la transmission) ; règle stricte (50 % partout) ; règle recommandée (anciens taux pour les gains acquis sous un régime lié à une durée de détention ; un tiers de la somme distribuée pour les réserves des sociétés, ce qui revient à 50 % du bénéfice avant impôt sur les sociétés une fois les 25 % déjà payés déduits : (0,50 − 0,25) / (1 − 0,25)).
6. Postes à part : extinction des usufruits, réductions d'impôt restant dues, transmissions avancées avant l'entrée en vigueur, et une option « payer maintenant à taux réduit » (la purge) payée en trois annuités.

Exemple suivi (titres non cotés, scénario central, règle recommandée sans purge, recalculé avec le code) : V = 1 507 Md€, g = 0,5, donc G = 754 Md€. Avec ρ = 4 % par an, F = 0,502 et il faut 56 ans pour que 90 % du stock soit sorti. Ventes et distributions : 0,6 × 754 × 1/3 × 0,502 = 76 Md€. Transmissions : 0,4 × 1 507 × 0,5 × 0,502 = 151 Md€. Total : 227 Md€ en valeur d'aujourd'hui, contre 89 Md€ sous l'ancien régime et 265 Md€ sous la règle stricte. L'écart de 38 Md€ avec la règle stricte est le coût de la déduction de l'impôt déjà payé sur les réserves, celui qu'affiche le tableau des protections.

Pour passer d'une valeur actualisée à un montant annuel, les résultats divisent par 19,6, le facteur d'une rente de 30 ans à 3 %.

## L'hypothèse qui porte le résultat
La part de plus-value cachée dans chaque stock (hypothèse H2) : 50 % pour les titres non cotés, 40 % pour l'immobilier hors résidence principale, 25 % pour l'assurance-vie, au central. Aucune statistique publique du stock de bénéfices non distribués des sociétés patrimoniales n'a été trouvée ; la méthode la dit elle-même « la plus fragile ». Avec elle va le rythme de sortie (H3, 3 à 10 % par an). Les scénarios bas et haut font bouger ces deux hypothèses en même temps que cinq autres : le coût de la règle recommandée par rapport à la règle stricte va alors de 159 à 513 Md€ en valeur actualisée (311 au central). L'effet de la seule part de plus-value n'est pas isolé.

## Ce que l'IA a choisi elle-même
Sur 20 hypothèses, 15 sont posées en tout ou partie par l'IA sans source qui tranche. Les plus importantes :
- H2 : part de plus-value cachée par stock. Plus elle est haute, plus la vente rapporte et plus les protections coûtent.
- H3 : rythme de réalisation, 3 à 10 % par an. Un rythme lent fait durer l'ancien système et réduit la valeur actualisée.
- H4 : part des sorties par transmission, 20 à 50 %. Elle pèse lourd, car la transmission est taxée sur la valeur entière : c'est d'elle que viennent 747 Md€ de l'écart entre règle stricte et ancien régime.
- H5 et H6 : 30 à 40 % de l'immobilier hors résidence principale ; taux effectifs actuels à la vente, lus dans le droit en vigueur.
- H10 et H11 : 15 à 45 % des donations avec usufruit gardé, sur 10 à 20 ans ; ils font le stock d'usufruits de 90 à 540 Md€.
- H12 à H14 : 75 Md€ par an de grandes transmissions qu'on peut avancer, sur 1 à 4 ans, dont 20 % échappent malgré une règle datée de l'annonce.
- H15 : 10 à 40 % d'adhésion à la purge.
- H17 : actualisation à 3 % sur 30 ans.
- H18 et H19 : les probabilités de censure (1, 5, 25 et 60 %) et le niveau de risque de chaque mesure. La méthode les appelle une « pure convention » : c'est une lecture de la jurisprudence par une IA, pas l'avis d'un juriste.
- Enfin, la politique « recommandée » elle-même (quelles protections garder) est une proposition de l'IA, à soumettre au vote.

## Ce qu'il ne fait pas
- Ce n'est pas un avis juridique : les niveaux de risque sont à faire relire par des juristes.
- Il n'est pas recalé sur la version actuelle du système (voir plus haut), et il ne s'ajoute pas aux comptes : il dit ce que chaque protection retirerait à un système qui taxerait déjà tout au nouveau régime.
- Il ne chiffre ni les retraites (renvoi au modèle des retraites), ni les sociétés étrangères contrôlées, ni l'exil.
- L'effet de blocage (on vend moins quand la vente est taxée) n'a pas d'élasticité propre : il passe seulement par le rythme de sortie.
- Point à vérifier : pour le pacte Dutreil, la section qui le décrit garde un engagement individuel de 4 ans, alors que la liste des limites, relue le 31 octobre, indique 6 ans depuis le 21 février 2026. Les pactes ne sont pas chiffrés dans les recettes, donc les totaux n'en dépendent pas.
- La « règle recommandée » des résultats est tantôt avec purge, tantôt sans : son coût par rapport à la règle stricte vaut 311 Md€ au central sans purge, 326 Md€ avec (sortie du code).

## Ce qu'il donne
- La règle stricte rapporte environ 1 349 Md€ en valeur actualisée sur 30 ans, contre 276 pour l'ancien régime (fourchettes 959 à 1 841 et 178 à 404) (resultats.md, § 3).
- La règle recommandée coûte 159 / 311 / 513 Md€ de moins que la règle stricte, soit 8 / 16 / 26 Md€ par an ; garder l'ancien régime pour tout l'existant coûterait 781 à 1 437 Md€ (40 à 73 Md€ par an) (resultats.md, § 3).
- Le patrimoine existant met 28 à 65 ans pour passer à 90 % par un événement taxable : garder l'ancien régime jusqu'au bout ferait durer deux systèmes une à deux générations (resultats.md, § 2 et § 7).
- Aux taux américains, la purge est une avance de trésorerie payée cher : −2 à −49 Md€ en valeur actualisée (resultats.md, § 4).
- Sans règle datée de l'annonce, l'anticipation des transmissions coûterait 30 à 120 Md€ ; avec elle, 6 à 24 Md€ (resultats.md, § 5).
- Même pondérée par un risque de censure, la règle stricte rapporte davantage (environ 1 190 contre 1 000 Md€) ; la méthode la déconseille pour des raisons que le chiffre ne capte pas (resultats.md, § 6).

## Comment le refaire
Depuis le dossier du modèle, avec JavaScriptCore fourni par macOS :

`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc modele.js test_modele.js`

La commande lance 13 contrôles puis imprime les tableaux des résultats. Relancée le 9 novembre 2026 : les 13 contrôles passent, et le profil annuel et les seuils de purge imprimés correspondent aux résultats écrits.
