# Grande France au banc d'essai

*11/11/2026. Calcul fait par Claude (IA d'Anthropic) pour Langagement politique. Ce sont des ordres de grandeur sous hypothèses, pas des prédictions.*

Grande France ([grandefrance.com/programme](https://www.grandefrance.com/programme)) publie un programme de redressement des comptes publics : 68 mesures chiffrées, avec leur méthode, un modèle Excel et des données ouvertes. Son auteur ne se présente pas à l'élection. Ce dossier le fait passer dans le banc d'essai de Langagement politique, avec **la même règle que tous les autres programmes, le nôtre compris**. Il est publié dans le dépôt pour en discuter, pas sur le site.

## Refaire le calcul
```sh
curl -L -o modeles/banc-programmes/grande-france/source-grande-france.json https://www.grandefrance.com/programme.json
python3 -I modeles/banc-programmes/grande-france/lancer.py          # 10 000 tirages, moins d'une minute
```
- Le fichier de Grande France n'est pas recopié ici, car sa licence n'est pas précisée. Les résultats ci-dessous viennent de la version du 11/11/2026 : `sha256 df027fe17cf8845e8cfb927bb0b2f12364b85d1ff34395892900c611a66385d1`. Une version plus récente peut donner d'autres chiffres.
- Fichiers :
  - `mesures_gf.py` : lecture des 68 mesures, et les trois notes (M, J, E) de chaque économie ou recette, avec leur motif ;
  - `lancer.py` : les variantes ;
  - `resultats-gf.json` : les résultats.

## Ce que le banc ajoute à un modèle comptable
Le modèle de Grande France est comptable : il additionne l'effet de chaque mesure, poste par poste, avec des fourchettes et des sources. Le banc ajoute trois couches.
1. **Des comportements.** Les modèles d'impôts du banc simulent les réactions des contribuables : érosion de l'assiette, départs, optimisation. Pour Grande France, ses propres montants sont repris ; ils intègrent déjà une partie de ces effets (fraude et baisse des achats sur la TVA, par exemple).
2. **De l'incertitude.** 10 000 tirages Monte-Carlo, avec des aléas communs (un coût dérape rarement seul) et des aléas propres à chaque ligne. Les résultats sont une médiane et une fourchette.
3. **Une règle de faisabilité, la même pour tous** (`../faisabilite.py`). Chaque économie ou recette nouvelle reçoit trois notes :
   - M : le mécanisme est-il décrit, avec une assiette mesurée ?
   - J : y a-t-il un obstacle juridique ?
   - E : existe-t-il un précédent où une mesure du même type a rapporté au moins la moitié de l'attendu ?

   Selon la somme des trois notes (de 0 à 3), on retient en médiane 100 %, 70 %, 35 % ou 10 % du montant annoncé. Les baisses d'impôts et les dépenses nouvelles sont comptées en entier, avec une fourchette de 0,9 à 1,3 fois : une baisse d'impôt votée est certaine, une économie ne l'est pas.

Aucun effet de croissance n'est crédité, à aucun programme. En contrepartie, l'effet récessif des baisses de dépenses n'est compté pour personne.

## Lecture des données
- **Effet de régime.** C'est l'effet 2032 de chaque mesure, ramené en euros 2025 (division par 1,027^7, la croissance nominale de son modèle). La montée en charge de 2028 à 2032 suit son calendrier. Après 2032, l'effet reste constant.
- **Les cinq effets de croissance** (79 Md€ en 2032) valent zéro, comme les retours dynamiques des autres programmes.
- **Contrôle.** Avec ses montants tels quels et sa croissance, le banc donne 1,2 % de déficit en 2032, contre 1,7 % dans son modèle. L'écart vient surtout de la référence. Sans rien changer, le banc part de 7,1 % de déficit en 2032, Grande France de 8,2 %. La conversion est donc fidèle.

## Résultats
Médianes ; entre parenthèses, 1 chance sur 10 de chaque côté.

| Variante | Déficit 2032 | Dette 2032 | Déficit 2038 | Dette 2038 |
|---|---|---|---|---|
| Ses montants, avec sa croissance | 1,2 % | 117 % | 1,3 % | 105 % |
| Ses montants, sans la croissance | 3,5 % | 123 % | 4,0 % | 124 % |
| **Règle commune du banc** | **10,7 %** (9,0 à 12,4) | **145 %** | **12,5 %** | **187 %** (172 à 203) |
| Règle commune, notes relevées à 2 au minimum (variante clémente) | 8,3 % | 138 % | 9,6 % | 166 % |
| Règle commune, en ne rendant que ce qui a été économisé (coûts × 0,63) | 5,3 % (3,5 à 7,0) | 127 % | 6,0 % | 139 % (123 à 153) |
| Règle commune, grille de sensibilité v1 (plus sévère) | 14,6 % | 160 % | 17,0 % | 223 % |

Pour comparer, la dette 2038 avec la même règle (`../resultats-v2.md`) :

| Programme | Dette 2038 |
|---|---|
| Droit actuel | 157 % |
| LR | 149 % |
| Langagement politique | 148 % |
| PS | 163 % |
| RN | 175 % |
| LFI | 241 % |

## Ce qui fait la différence
En 2032, la règle garde 304 des 483 Md€ d'économies et de recettes nouvelles annoncées. En face, les 384 Md€ d'impôts rendus et de dépenses nouvelles deviennent 405 Md€. Les lignes qui perdent le plus (Md€ de 2025) :

| Mesure | Annoncé | Retenu (médiane) | M + J + E | Motif |
|---|---|---|---|---|
| Deux millions de postes publics en moins | 82,0 | 29,5 | 1 + 0 + 0 | fin du statut à voter ; aucun précédent de −37 % des effectifs concernés en cinq ans |
| Chômage confié à des assureurs | 35,5 | 12,5 | 1 + 0 + 0 | une assurance obligatoire peut être reclassée en dépense publique (SEC 2010) ; pas de précédent comparable |
| Baisse des pensions | 51,7 | 36,1 | 1 + 0 + 1 | levable par la loi (protection des biens, égalité) ; précédent grec |
| Plus aucune aide aux entreprises | 42,5 | 29,5 | 0 + 1 + 1 | liste non détaillée ligne à ligne, comme les niches des autres programmes |
| Collectivités : dépenses, investissement, fonctionnement | 29,6 | 2,9 | 0 + 0 + 0 | libre administration (art. 72 de la Constitution) |
| Provinces et communes regroupées | 13,2 | 4,6 | 1 + 0 + 0 | révision constitutionnelle ; la fusion des régions de 2015 n'a pas produit les économies annoncées |
| Taxe foncière sur la valeur réelle | 25,4 | 17,8 | 1 + 1 + 0 | révision des valeurs locatives repoussée depuis 1970 |

Les mesures qui passent presque intactes :
- la TVA unique, puis portée à 25 % ;
- l'impôt unique sur le capital et les indépendants ;
- les successions et l'assurance-vie ;
- la retraite à 68 ans, avec le précédent italien de 2011 ;
- le gel du point d'indice ;
- le gel des aides au logement.

## Ce qu'on en retient
1. **Le travail est sérieux.** Il est transparent, sourcé et reproductible ; repris tel quel, il redonne son propre résultat.
2. **Le point n'est pas la valeur centrale.** Son modèle la retient pour 64 mesures sur 68. Mais pour les mesures qui sont des décisions (postes, collectivités, chômage), la valeur centrale suppose une exécution complète, et c'est cela que la règle décote.
3. **Les boucles de rétroaction manquent.** Le modèle crédite 79 Md€ de croissance. L'effet sur l'activité de 11 points de PIB de dépenses en moins en un mandat ne pèse qu'une ligne nette.
4. **L'ordre des opérations compte plus que les mesures.** Rendre 455 Md€ d'impôts à date fixe, face à des économies incertaines, creuse le déficit dès que les économies prennent du retard. Ne rendre que ce qui a été réellement économisé fait passer le déficit 2032 de 10,7 % à 5,3 %.

## Limites
- **Les notes sont des jugements de Claude**, relus par personne d'autre. Elles sont alignées sur celles données aux mêmes types de mesures dans les autres programmes, et leur motif est écrit dans `mesures_gf.py`. La variante clémente montre ce qu'elles pèsent. Une note contestée se rejoue : il suffit d'ouvrir une issue.
- **Les mesures qui montent après 2032** (68 ans, dépendance, réversion) sont tenues à leur niveau de 2032, ce qui est prudent pour ses économies.
- **La grille de décote est une convention publiée**, pas une source.
