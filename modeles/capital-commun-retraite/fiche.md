---
titre: Un fonds public pour une part des retraites
theme: vieillir
statut: brouillon ; calcul du 03/11/2026
---

## La question
Si une part des cotisations retraite (10 % ou 20 %) va à un fonds public placé en actions, au lieu de payer les pensions du moment, que coûte la transition ? Que gagnent les retraités ? Cela réduit-il la dépendance à la démographie ? Comment partager les parts du fonds selon les contributions ? Que rapporteraient de grands actifs publics de calcul, comme des centres de données ? Le modèle reprend les calculs de capitalisation du dossier retraites et ajoute ces questions.

## Ce qui entre
- Statistique publique : dépenses de retraite de 14,1 % du produit intérieur brut (PIB) en 2025 et 15,3 % en 2070, 1,8 cotisant par retraité en 2025 et 1,3 en 2070, pension moyenne égale à 54,6 % du revenu d'activité en 2025 et 45,3 % en 2070 (Conseil d'orientation des retraites, juin 2026) ; revenu disponible par dixième de la population (Insee, 2023) ; droits à pension déjà acquis, 397 % du PIB fin 2021 (Eurostat).
- Études et rapports de fonds : rendements de long terme des actions (4,64 % réels par an, 1870-2015, Jordà et coauteurs ; 3,25 % pour la France) ; fonds souverain norvégien (4,34 % réels nets depuis 1998).
- Sources secondaires, non lues à la source : les marges des services de calcul d'Amazon et de Google.
- Hypothèses : rendement du fonds, rythme de montée en charge, taux de la dette, conversion en rente, carrières et retraites de durée fixe.

## Comment il calcule
Tout est en euros de 2025, année par année de 2027 à 2127.

1. **Pensions et cotisations.** Pensions de l'année = PIB × part des retraites (de 14,1 % à 15,3 % en 2070, puis stable). Les cotisations sont supposées égales aux pensions. Le PIB croît au rythme ρ, qui est aussi le rendement de la répartition : 0,6 % par an au centre.
2. **Part versée au fonds** s(t) : elle monte en ligne droite sur dix ans (1 % des cotisations en 2027 pour la trajectoire à 10 %), puis reste fixe.
3. **Part des pensions servie par le fonds** f(t) : pour chaque génération qui part, c'est la part de ses droits qui vient des cotisations versées au fonds, pondérée par leur valeur revalorisée à ρ. On en fait la moyenne sur les générations en retraite (22 ans de retraite, 40 ans de carrière).
4. **Double charge** = s × cotisations − f × pensions. C'est ce que la collectivité paie en plus de la répartition seule : les droits anciens restent dus pendant qu'on remplit le fonds.
5. **Fonds** de l'année suivante = fonds × (1 + r) + versements − pensions servies. Si la double charge est empruntée : dette de l'année suivante = dette × (1 + 1,5 %) + double charge.
6. **Pension d'une génération** : la part restée en répartition est convertie en rente au taux ρ ; le capital du fonds, accumulé au rendement r, est converti en rente au taux r − 1 point, par prudence. Le rapport « pension mixte / pension de répartition » est appliqué au taux de remplacement de référence de 2060, soit 47,4 %, interpolé entre les chiffres du Conseil d'orientation des retraites.
7. **Risque** : 4 000 tirages de rendements annuels indépendants (écart-type 12 %), plus des krachs et des périodes sans rendement fixés à l'avance.
8. **Démographie** : à cotisation fixe, la pension de répartition suit le nombre de cotisants par retraité.
9. **Mérite** : part du fonds d'un dixième = plancher/10 + (1 − plancher) × son revenu / revenu total.
10. **Actif de calcul** : rendement d'un investissement de 1 qui rapporte e la première année, en baisse de δ par an, sur 6 ans.

Exemple : pour la génération qui part en 2060, à 10 % au centre, le rapport vaut 1,066. Le taux de remplacement passe donc de 47,4 % à 47,4 × 1,066 = 50,5 %.

## L'hypothèse qui porte le résultat
**Le rendement réel net du fonds**, 3,5 % au centre, contre une répartition qui rend 0,6 %. Tout le gain vient de cet écart, qui est la prime de risque des actions. Le calcul le teste : pour la génération 2060, à 10 % capitalisés, la pension baisse de 0,4 % si le fonds rapporte 0,83 % (obligations françaises de long terme). Elle monte de 2 % à 2 % de rendement, de 6,6 % à 3,5 %, et de 10 % à 4,34 %. Au rendement du fonds, la valeur actualisée de la double charge égale celle des gains : la capitalisation ne crée pas de richesse par elle-même.

Deuxième hypothèse : **le taux de la dette de transition**, 1,5 % réel. Il n'est pas comparé au taux auquel l'État emprunte aujourd'hui (la méthode le signale). En 2060, à 20 % capitalisés, le fonds moins la dette vaut +1 205 Md€ à 1,5 %, +662 Md€ à 2,5 %, et 0 à 3,5 %.

## Ce que l'IA a choisi elle-même
Quatre hypothèses sont écrites « choix de Claude », et huit autres sont des simplifications ou des estimations sans source qui tranche. En tout, douze sur vingt-cinq (H1 à H25) :
- H8 : rendement de 2 / 3,5 / 4,34 % et écart-type de 14 / 12 / 11 % ; c'est le moteur du gain.
- H12 : taux de la dette à 1,5 % réel (2,5 et 3,5 % en sensibilité). Un taux plus haut réduit le gain net, jusqu'à l'annuler.
- H9 : rente du fonds servie à r − 1 point. C'est un choix prudent, qui réduit le gain.
- H4 : montée en charge en dix ans, jusqu'à 10 % ou 20 % des cotisations.
- H2 : cotisations égales aux pensions. Le déficit prévu de la répartition n'est pas imputé à la transition, ce qui rend la répartition plus favorable qu'elle n'est.
- H3 : croissance égale au rendement de la répartition, 1,2 / 0,6 / 0,3 %.
- H5, H13, H17, H20 : carrières de 40 ans, retraites de 22 ans, générations de même taille ; taux de remplacement interpolé ; pension de répartition proportionnelle au nombre de cotisants par retraité.
- H19 : le revenu disponible sert de mesure des cotisations. Il surestime la part des plus aisés, car une partie des cotisations est plafonnée et le patrimoine ne cotise pas.
- H22 : les marges et les baisses de prix des actifs de calcul forment une grille de lecture, pas une mesure.

## Ce qu'il ne fait pas
- Pas de mortalité pendant la retraite, ni de carrières différentes selon le sexe ou le métier.
- Les rendements tirés sont indépendants d'une année à l'autre. Cela sous-estime les longues périodes de baisse, d'où les chocs ajoutés à part.
- Ne sont pas modélisés : l'effet sur l'épargne privée, l'effet d'un fonds de 1 à 3 fois le PIB sur le prix des actifs, et la reprise du fonds par un gouvernement (précédents en Argentine, Hongrie, Pologne et France).
- L'affirmation « diviser par deux la dépendance à la démographie demanderait environ 50 % de capitalisation, soit environ 225 Md€ par an » est une extrapolation en ligne droite, non calculée.
- Le financement de la double charge n'est pas résolu. Les ressources citées (taxe sur le patrimoine, cessions) sont déjà comptées ailleurs, dans une version du programme antérieure au 8 novembre.
- Point à vérifier : l'en-tête du code renvoie à des hypothèses H1 à H30, alors que la méthode s'arrête à H25 ; H21, cité dans la méthode, n'y est pas défini.

## Ce qu'il donne
- Double charge maximale : environ 45 Md€ par an (1,4 % du PIB, vers 2038) à 10 %, 90 Md€ (2,8 %) à 20 %. Cumul : 1 580 et 3 160 Md€. Elle ne s'éteint qu'après environ 70 ans (resultats.md, résumé point 1 et § 1).
- Pension de la génération 2060 au centre : +6,6 % à 10 %, +13 % à 20 % ; +13 % et +26 % pour la génération 2090. Environ 3 à 5 % de chances de faire moins bien que la répartition (resultats.md, § 2).
- Avec 20 % capitalisés, le système reste exposé à 86 % aux variations du nombre de cotisants par retraité en 2060 : « 20 % capitalisés retirent 20 % de l'exposition » (resultats.md, § 3).
- Parts proportionnelles aux revenus : 23 % du fonds pour le dixième le plus aisé, 3 % pour le plus modeste ; avec un plancher de 50 %, le rapport tombe de 7,2 à 2,5 (resultats.md, § 4).
- Un actif de calcul amorti sur 6 ans ne rapporte 4 % réel que si sa marge annuelle atteint 19 % du capital sans baisse des prix, 24 % avec une baisse de 10 % par an et 30 % avec une baisse de 20 % par an (resultats.md, § 5).

## Comment le refaire
Depuis le dossier du modèle, avec le moteur JavaScript de macOS (`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc`) :
- `jsc modele.js test.js` : les tests. Relancés le 9 novembre 2026 : 22 contrôles, tous passent, en moins d'une seconde.
- `jsc modele.js rapport.js > resultats-brut.txt` : toutes les tables des résultats.
