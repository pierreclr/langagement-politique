---
titre: Retraites : âge, niveau des pensions et part capitalisée
theme: vieillir
statut: brouillon ; derniers calculs du 03/11/2026, paramètres de comportement mis à jour le 04/11/2026
---

## La question
Ce dossier réunit quatre calculs faits à des dates différentes. Le plus récent répond à la règle retenue par l'auteur : un âge de référence qui suit l'espérance de vie, avec la liberté de partir dès 60 ans contre une pension ajustée, un plancher, et un effort demandé aux plus hautes pensions. Que gagnent ou perdent les comptes publics en 2040 et 2060, et qui paie ? Les trois autres calculs mesurent : l'économie d'une règle « pension moins socle », le coût d'un passage de tout le complément de pension en capitalisation, et celui d'une petite part capitalisée (1 à 6 points de cotisation).

## Ce qui entre
- Statistique publique : la répartition des retraités par tranche de pension de 100 € (Drees, échantillon de 2020) ; 422,2 Md€ de dépenses et 17,4 millions de retraités en 2025, et les projections jusqu'en 2070 (Conseil d'orientation des retraites, rapport de juin 2026) ; les tables de mortalité de 2023 (Eurostat, Insee) et les projections d'espérance de vie de l'Insee (2026) ; l'âge légal en vigueur, lu dans le code de la sécurité sociale (64 ans pour les personnes nées en 1969 et après).
- Études : le comportement de départ quand l'âge de référence recule (Seibold 2021 pour l'Allemagne, études autrichienne, néerlandaise et française) ; la part de ceux qui restent en emploi ; les rendements de long terme des placements (Jordà et coauteurs, 1870-2015 ; fonds souverain norvégien).
- Hypothèses : les réactions à un départ libre à 60 ans, la part des départs sans réduction pour pénibilité, le rendement du fonds, et de nombreuses simplifications démographiques.

## Comment il calcule
**Âge de référence indexé (le calcul en vigueur).**
1. Espérance de vie à 60 ans, année par année : on ajuste une courbe de mortalité sur la table de 2023, puis on la décale pour reproduire les gains prévus par l'Insee jusqu'en 2070.
2. Âge de référence d'une génération = 64 ans + 2/3 × (espérance de vie à 60 ans de cette génération − celle de la génération 1969), arrondi au mois, sans jamais baisser. Génération 1980 : gain de 0,92 an, donc 64 + 0,61 = 64 ans et 7 mois.
3. Âge réel de départ : chaque cohorte part plus tard de « passage » × (âge de référence − 64). Le passage vaut 0,5 au centre (0,8 et 0,33 dans les cas favorable et défavorable). Pour les départs de 2040 (génération 1975, âge de référence 64,37 ans), le report est de 0,18 an.
4. Économie sur les pensions = départs annuels (0,77 million) × survie × pension moyenne × années de pension en moins, moins une hausse de pension pour ceux qui partent plus tard (un quart de la hausse qui serait actuariellement neutre, au centre).
5. Recettes : la moitié de ceux qui reportent sont en emploi et paient 42 % de prélèvements sur leur revenu. Puis on retire 20 % du gain total, perdu en chômage, invalidité et maladie.
6. Exemple central en 2040 : 3,0 Md€ d'économie sur les pensions, plus 1,2 Md€ de recettes, moins 0,8 Md€ de dépenses sociales : solde de +3,4 Md€.

**Dispositif complet.** On additionne, sans interaction : l'âge de référence ; la liberté de partir dès 60 ans avec un coefficient « neutre » (la valeur des pensions à vie ne change pas selon l'âge de départ, au taux de 0,7 %) ; le départ sans réduction pour 10 % des départs ; une revalorisation inférieure de 0,5 point à l'inflation au-dessus de 2 000 € bruts ; une contribution de 20 % au-dessus de 2 500 € nets. Le solde est la somme des économies et des recettes.

**Part capitalisée.** Chaque année, une part de cotisation (1, 3 ou 6 points) va à un fonds public au lieu de payer les pensions. La « double charge » = cotisation versée au fonds − pensions de répartition qu'elle aurait permis d'éviter. Le fonds grandit au rendement r ; s'il est emprunté, la dette grandit au taux i. Le calcul vérifie que, si l'on actualise au rendement du fonds, la double charge et les gains futurs s'annulent : la capitalisation ne crée pas de richesse par elle-même. Son gain n'est que l'écart entre un rendement risqué et la croissance des salaires.

## L'hypothèse qui porte le résultat
- **La part du droit de partir à 60 ans réellement utilisée.** Au centre, on suppose que les gens avancent leur départ de 35 % de l'écart entre 64 et 60 ans. Aucune étude ne mesure un départ libre à coefficient neutre. La valeur repose sur une symétrie supposée avec le recul de l'âge. Elle décide du signe du solde de 2040 : 0,15 de plus ou de moins vaut 7,6 Md€, pour un solde central de −5,9 Md€.
- **Le rendement réel du fonds** pour la part capitalisée : 3,5 % au centre, contre 4,34 % pour le fonds norvégien depuis 1998 et 3,25 % pour les actions françaises de 1870 à 2015. Avec 3 points capitalisés financés par l'emprunt, le fonds moins la dette vaut +611 Md€ à 60 ans au centre, mais −1 022 Md€ dans le cas défavorable (rendement de 2 %, croissance nulle, dette à 2 %) : le gain disparaît quand le rendement ne dépasse plus le taux de la dette.

## Ce que l'IA a choisi elle-même
Environ 30 des 72 hypothèses (H1 à H72) sont dites « de Claude », « choix de Claude » ou sans source. Les plus importantes :
- H67 : la part du départ libre utilisée (0,2 / 0,35 / 0,5), voir plus haut.
- H66 : la part des départs sans réduction (5 / 10 / 20 %) et leur définition ; c'est le premier poste de coût (3,7 Md€ en 2040 au centre).
- H64 : la hausse de pension de ceux qui partent plus tard (0, 25 ou 50 % du coefficient neutre). Plus elle est haute, plus le gain baisse.
- H15 et H24 : les rendements (2 / 3,5 / 5 %), la croissance de 0 / 0,6 / 1 % et le taux réel de la dette de transition (2 / 1,5 / 1 %). Un taux de dette plus haut réduit, voire annule, le gain de la capitalisation.
- H35 et H36 : rendement et risque d'un compartiment « entreprises d'intérêt commun » dans le fonds, sans aucune source.
- H42 : si la règle « pension moins socle » était appliquée, la calculer sur la pension nette. Choix de l'IA à valider.
- H44, H46, H58 : croissance de 0,8 %, 42 % de prélèvements sur le travail, 50 % des partants en emploi.
- H12, H27, H28 : carrières identiques de 40 ou 41 ans, pas de table de mortalité dans les calculs de capitalisation, cohortes de même taille.
- H69 : un écart d'espérance de vie de ± 2,75 ans entre les plus modestes et les plus aisés, qui fait payer davantage les premiers.

## Ce qu'il ne fait pas
- Pas de microsimulation : une cohorte moyenne par année, une pension moyenne, des carrières types.
- Les blocs du dispositif complet sont additionnés sans interaction, alors qu'ils se recouvrent (un départ à 60 ans sans réduction est aussi un départ libre).
- Le coût propre de l'allongement de la vie n'est pas chiffré : la variante « espérance de vie haute » mesure seulement un report plus grand.
- La répartition des pensions date de 2020, revalorisée en bloc.
- Le risque de la répartition elle-même (démographie, décisions politiques) est traité comme nul dans la comparaison avec la capitalisation. La reprise du fonds par l'État, déjà vue ailleurs, n'est pas modélisée.
- Point à vérifier : les « dix lignes » du 3 novembre en tête des résultats gardent d'anciens paramètres de comportement. Le tableau du 4 novembre, juste au-dessus, les remplace. Les calculs « pension moins socle » et « capitalisation de tout le complément » partent d'un socle de 1 000 € par mois. Cette architecture n'est plus celle du programme, et la règle n'est plus retenue (résultats, mise à jour du 3 novembre, point 6).

## Ce qu'il donne
- Âge de référence au centre : 64 ans et 4 mois pour la génération 1975, 65 ans et 9 mois pour 2000, 66 ans et 3 mois pour 2010. Aucun effet avant 2034 (resultats.md, « Âge de référence indexé », point 2).
- Âge de référence seul, au centre : solde public de +3,4 Md€ en 2040 et +14,0 Md€ en 2060 (resultats.md, tableau du 4 novembre).
- Dispositif complet, au centre : −20,8 Md€ en 2030, −5,9 en 2040, +20,1 en 2060. En 2040, la fourchette va de +25,7 à −24,0 Md€ (même tableau).
- Le dispositif comble 3 % de l'écart de 3 points de PIB avec l'Allemagne en 2040, 24 % en 2060 (même tableau).
- Avec 3 points capitalisés, au centre : double charge maximale de 45 Md€ par an (1,4 % du PIB) en 2034, fonds de 1 760 Md€ à 30 ans ; pension d'un salarié né en 2000 supérieure de 11 % en espérance, avec 4 % de chances de faire moins bien (resultats.md, « Capitalisation progressive », points 2, 3, 5, 6).

## Comment le refaire
Depuis le dossier du modèle, avec `jsc` = `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc` :
- `jsc modele.js test_modele.js` (règle « pension moins socle », capitalisation de tout le complément) ;
- `jsc capitalisation.js test_capitalisation.js` (part capitalisée) ;
- `jsc modele.js age_libre.js test_age_libre.js` (âge libre et niveau) ;
- `jsc modele.js age_libre.js test_age_reference.js` (âge de référence indexé).
Relancés le 9 novembre 2026 : 32, 36, 37 et 32 contrôles, tous passent, en moins d'une seconde chacun. Chaque commande affiche aussi les chiffres des résultats.
