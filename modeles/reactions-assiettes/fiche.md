---
titre: Comment les contribuables réagiraient à un taux unique
theme: contribuer
statut: brouillon ; calcul du 25 octobre 2026
---

## La question
Si l'on taxait tous les revenus et les héritages au même taux de 50 %, sans niches, combien de recettes perdrait-on parce que les gens réagissent : ils déclarent moins, gardent l'argent dans leurs sociétés, placent autrement ou partent ? Le modèle répond assiette par assiette, et chiffre aussi l'idée d'imposer les Français selon leur nationalité. Il porte sur une version ancienne du système (le prélèvement unique à 50 % de fin octobre), pas sur la version du 8 novembre.

## Ce qui entre
- Les « assiettes » (montants taxés) de 2024 : salaires au coût employeur 1 466,5 Md€, indépendants 121,9, loyers 40,9, intérêts 71,7, dividendes 74,9, assurance-vie 67,5, plus-values 25,6, héritages et donations 300. Elles viennent de la recherche faite pour le simulateur du site, avec des années mélangées (H1).
- Les taux actuels payés en haut de l'échelle, par assiette (H5) : reconstitués par l'IA à partir des barèmes (61 % du coût employeur pour un haut salaire, 34 % pour un dividende, 10 % pour une grande transmission).
- Des élasticités tirées d'études : 0,12 à 0,40 pour les hauts revenus d'activité (revue de Saez, Slemrod et Giertz, 2012) ; mobilité des hauts revenus d'environ 0,15 pour les nationaux et de 1 pour les étrangers (études sur les footballeurs et les inventeurs) ; écart de déclaration des héritages de 35 à 40 % aujourd'hui (Conseil d'analyse économique, note 69).
- Les effectifs du 1 % le plus aisé : 378 333 foyers (2016, Institut des politiques publiques).
- Toutes les valeurs sont dans donnees/, avec leur source et leur statut.

## Comment il calcule
Pour chaque assiette, dans cet ordre :
1. **Héritages seulement** : base déclarée = base × (1 − écart de déclaration).
2. On sépare la base entre le 1 % le plus aisé (part posée par assiette, H3) et le reste.
3. **Optimisation** : chaque partie devient base × ((1 − nouveau taux) / (1 − ancien taux)) puissance élasticité. Si l'on gardait 66 % et que l'on garde 50 %, le rapport vaut 0,76 ; avec une élasticité de 1, l'assiette baisse de 24 %.
4. **Départs** : le groupe aisé varie de m = part d'étrangers × (r puissance élasticité des étrangers − 1) + part de nationaux × (r puissance élasticité des nationaux × (1 − k) − 1), où r est le rapport des taux nets moyens du groupe (après sur avant) et k l'efficacité d'un impôt suivant la nationalité. La perte = base du groupe × part de l'impôt perdue au départ × m. Deux groupes : les hauts revenus, et les grands patrimoines (qui décident sur les héritages). Ceux qui partent à cause des héritages emportent aussi une part de leurs revenus.
5. **Retour différé** : une part des bénéfices gardés en société ou des plus-values bloquées revient plus tard (50 %, 30 % ou 10 % selon le scénario) ; elle est remise dans la recette.
6. **Entreprises des partants** : baisse de la masse salariale proportionnelle aux départs (0 à 0,05 % par point d'impôt sur la fortune équivalent).

Recette = taux × (base finale + part revenue) ; perte = recette sans réaction − recette. Le test vérifie que la perte se décompose exactement en écart de déclaration + optimisation + exil + entreprises.

Exemple (scénario central, héritages) : sur 300 Md€, l'écart de déclaration de 25 % fait perdre 75 Md€ d'assiette, soit 37,5 Md€ de recette à 50 %. Avec l'optimisation et l'exil, il ne reste que 68,7 % de l'assiette : la perte atteint 46,9 Md€ sur 150 de recette attendue.

## L'hypothèse qui porte le résultat
**L'écart de déclaration des héritages dans le nouveau système (H11)** : 15 %, 25 % ou 37,5 % selon le scénario, contre 35 à 40 % aujourd'hui selon le Conseil d'analyse économique. L'IA a supposé qu'un système sans niches, avec un vrai fichier des transmissions, réduirait l'écart sans l'annuler. C'est le premier poste de perte (22,5 à 56,3 Md€). Chaque point d'écart en moins vaut 1,5 Md€ (resultats.md, § 6). Si l'écart restait à son niveau d'aujourd'hui, la perte centrale monterait d'environ 15 Md€ (calcul direct : 10 points × 1,5 Md€ ; ce cas n'est pas tabulé dans les résultats).

## Ce que l'IA a choisi elle-même
Quinze hypothèses sont marquées comme choix de l'IA : H2 (horizon de dix ans), H3 (part du 1 % dans chaque assiette, sauf les dividendes), H5 et H5 bis (taux actuels reconstitués), H7 (loyers peu mobiles), H8 (élasticité de l'épargne), H9 (élasticité des dividendes de 0,5 à 2), H10 (part qui revient plus tard), H11 (écart de déclaration), H12 (valeurs de la réaction de l'épargne aux droits), H13 bis (chevauchement entre familles et revenus), H14 (10 % d'étrangers, sans aucune donnée), H15 (valeur haute de l'effet sur les entreprises), H16 (efficacité de 0,25 pour l'impôt selon la nationalité), H17 (part de l'impôt perdue au départ).
Sens : H5 est décisive pour les salaires. Avec 61 % aujourd'hui, un taux de 50 % est une baisse en haut, d'où un léger gain. Si le taux actuel réel était plus bas (niches), le gain disparaîtrait. H11 est plutôt optimiste par rapport à aujourd'hui. Le scénario central de départs est en revanche plus pessimiste que la meilleure étude disponible (étude scandinave : −4,6 % de foyers aisés pour le même choc, contre −12 % au central).

## Ce qu'il ne fait pas
- Il porte sur l'ancien système à 50 % : ses chiffres ne s'appliquent pas tels quels à la version du 8 novembre (taux plat et taux du haut différents). Le modèle du système idéal en reprend des élasticités, pas les résultats.
- Pas de réaction de l'offre de travail des salariés ordinaires (traitée dans un autre modèle).
- Pas d'effet de la fin de l'impôt sur les sociétés sur le montant des dividendes (sens contraire à H9, non chiffré).
- Multinationales non chiffrées : ni paiements vers l'étranger, ni impôt minimum mondial de 15 %.
- Effets de long terme seulement (environ dix ans), pas la première année. Pas d'équilibre général.
- Trois études demandées n'ont pas pu être lues (dont une élasticité française récente des hauts revenus et une élasticité des dividendes) ; aucune valeur n'en est tirée.

## Ce qu'il donne
- Perte de 36 à 120 Md€ par an sur environ 1 085 Md€ de recettes sans réaction, soit 3,4 à 11 % (68 Md€, 6,3 %, au central) (resultats.md, § 2).
- L'exil n'est pas le gros poste : 2,3 à 17,8 Md€. Le gros poste est l'écart de déclaration des héritages (22,5 à 56,3) puis le report de l'épargne (11,5 à 44,8) (resultats.md, § 2).
- Part du flux d'héritages non taxée : 18 %, 31 % ou 48 % selon le scénario (resultats.md, § 3).
- Départs à dix ans du 1 % le plus aisé : environ 19 500, 45 500 ou 93 500 foyers ; les hauts revenus pris seuls n'ont pas de raison de partir (resultats.md, § 4).
- Un impôt suivant la nationalité, même appliqué comme aux États-Unis, ne réduit la perte totale que de 1 à 9 Md€ ; il réduit les départs d'un tiers à près de moitié (resultats.md, § 6).

## Comment le refaire
Depuis le dossier du modèle :
```
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc modele.js test_modele.js
```
Relancé le 9 novembre 2026 : 12 contrôles réussis, en moins d'une seconde ; la sortie reproduit les chiffres de resultats.md. Pour changer une hypothèse : modifier la ligne de donnees/parametres_assiettes.csv et la valeur par défaut de modele.js (le test vérifie qu'elles sont égales).
