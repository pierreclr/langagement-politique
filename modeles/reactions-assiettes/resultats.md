---
titre: Modèle « Réaction des assiettes » : résultats
tache: T5
statut: brouillon sourcé
consultation: 2026-10-25
---

# Réaction des assiettes : résultats

> **À lire d'abord.** Ce sont des **hypothèses et des ordres de grandeur, pas des prédictions**. Chaque chiffre vient de `donnees/*.csv` (avec sa source) ou du calcul reproductible `jsc modele.js test_modele.js`. Les hypothèses H1 à H17 sont dans [`methode.md`](methode.md). Beaucoup de paramètres sont des **hypothèses de Claude** faute de données (parts du top 1 % par assiette, taux marginaux actuels reconstitués, part des étrangers) : ⚠️ = non confirmé. Effets de long terme (≈ 10 ans), taux unique de 50 %.

## 1. En une phrase

Le prélèvement unique perdrait **de l'ordre de 35 à 120 Md€ par an** sur ses ≈ 1 085 Md€ de recettes statiques (**3 à 11 %**, 68 Md€ dans le scénario central). L'essentiel ne vient **pas de l'exil** mais de deux sources : les **transmissions qui échappent à la déclaration** et le **report de l'épargne** vers ce qui n'est pas taxé (bénéfices gardés dans les sociétés, logement, plus-values non réalisées). L'imposition selon la nationalité réduit les départs, mais elle ne change le total que de quelques milliards.

## 2. Perte de recettes par assiette (Md€/an, taux 50 %, sans imposition selon la nationalité)

| Assiette | Recette statique | Réaction faible | Centrale | Forte | Assiette conservée (central) |
|---|---|---|---|---|---|
| Salaires au coût employeur | 733,3 | −1,0 (gain) | −0,7 (gain) | 2,9 | 100,1 % |
| Revenu des indépendants | 61,0 | 0,2 | 0,7 | 2,0 | 98,9 % |
| Loyers réels nets | 20,5 | 0,0 | 0,1 | 0,1 | 99,6 % |
| Intérêts | 35,9 | 3,4 | 6,6 | 12,1 | 81,7 % |
| Dividendes | 37,5 | 2,7 | 7,4 | 16,7 | 80,3 % |
| Assurance-vie | 33,8 | 2,6 | 5,2 | 9,7 | 84,7 % |
| Plus-values réalisées | 12,8 | 0,6 | 1,8 | 3,8 | 86,1 % |
| Transmissions | 150,0 | 27,7 | 46,9 | 71,4 | 68,7 % |
| Entreprises des partants (masse salariale) | — | 0,0 | 0,3 | 0,8 | — |
| **Total** | **1 084,5** | **36,3** | **68,2** | **119,7** | |
| Recette après réactions | | 1 048 | 1 016 | 965 | |
| Perte en % de la recette statique | | 3,4 % | 6,3 % | 11,0 % | |

**Par nature de réaction** (Md€/an) :

| | Faible | Centrale | Forte |
|---|---|---|---|
| Transmissions non déclarées (écart de déclaration) | 22,5 | 37,5 | 56,3 |
| Optimisation et report de l'épargne (marge intensive, nette de la part récupérée plus tard) | 11,5 | 23,2 | 44,8 |
| Exil (net des arrivées) | 2,3 | 7,2 | 17,8 |
| Entreprises des partants | 0,0 | 0,3 | 0,8 |

**Ce qu'il faut retenir :**

1. **Les salaires ne sont pas le problème ici.** Pour un salarié très bien payé, 50 % du coût employeur est **moins** que le taux marginal actuel (≈ 61 % du coût employeur, calcul de Claude ⚠️). Le haut des salaires gagnerait donc à déclarer plus, d'où un léger gain. La vraie question des salaires est l'offre de travail de tous les autres, traitée par T4 (curseur « masse salariale », chaque point coûte ≈ 7 Md€).
2. **Le capital est l'assiette fragile.** Intérêts, dividendes, assurance-vie et plus-values passent de 25-34 % aujourd'hui à 50 %, alors que garder les bénéfices dans une société ne coûte plus rien. Résultat central : 14 à 20 % de ces assiettes disparaissent des flux taxés (≈ 21 Md€ de recettes), surtout par **report**, pas par départ. Une partie revient plus tard, à la cession ou à la transmission (H10). C'est le prix assumé du modèle estonien, qui a aussi un effet favorable : plus de liquidités et d'investissement dans les entreprises (Masso et al. 2013, sans chiffre).
3. **Les transmissions sont le point le plus faible du chiffrage.** Avec 50 % sans niches, le taux effectif des grandes transmissions passerait d'environ 5-10 % (Dutreil : 5,6 %) à 50 %. Mais la plus grosse perte ne vient pas des réactions au taux : elle vient de **l'écart entre le flux économique (300 Md€) et ce que le fisc voit**, 35 à 40 % aujourd'hui selon le CAE. Même ramené à 25 % (hypothèse centrale), cet écart coûte 37 Md€.

## 3. Le curseur « fuite des héritages » du simulateur

| | Faible | Centrale | Forte |
|---|---|---|---|
| Part du flux de 300 Md€ qui n'est pas taxée | **18 %** | **31 %** | **48 %** |
| dont écart de déclaration | 15 % | 25 % | 37,5 % |

⚠️ **Correction à apporter au simulateur.** La légende actuelle du curseur (« Le Conseil d'analyse économique estime qu'on perd jusqu'à 74 centimes par euro attendu (54 par optimisation, 20 par exil) ») n'est **pas** tirée de la Note n°69 du CAE sur l'héritage ni de son Focus n°77 : ces deux textes, relus, ne contiennent pas ces chiffres. D'après `sources/donnees/simu_7_taux_effectifs_riches.csv`, ils viennent du **Focus n°118** (2025) et concernent un **impôt sur la fortune en Scandinavie** (Jakobsen et al.). Le CAE 2021 dit au contraire que la contrainte migratoire sur les droits de succession est « faible ». Proposition de légende : « Part du flux non taxée (non-déclaration, optimisation, exil). Modèle T5 : 18 % (réaction faible), 31 % (centrale), 48 % (forte). »

## 4. Qui partirait, et avec combien ?

Les chiffres sont des **stocks de long terme** (environ dix ans), pas des départs annuels.

| | Faible | Centrale | Forte |
|---|---|---|---|
| **Familles fortunées (transmissions)** : variation du top 1 % | −5,2 % | −12,0 % | −24,7 % |
| foyers du top 1 % (378 000 foyers) | ≈ 19 500 | ≈ 45 500 | ≈ 93 500 |
| dont top 0,1 % (37 800 foyers) | ≈ 1 900 | ≈ 4 600 | ≈ 9 300 |
| assiette de transmissions partie | 2,6 Md€ | 5,1 Md€ | 8,2 Md€ |
| **Hauts revenus (groupe A seul)** : variation | +0,5 % | +1,2 % | +2,7 % |
| assiette de revenus perdue, familles qui partent comprises (net) | 2,1 Md€ | 9,3 Md€ | 27,3 Md€ |

Lecture :

- **Les hauts revenus, pris seuls, n'ont pas de raison de partir.** Leur charge moyenne passe de ≈ 52,5 % à 50 % (rapport des taux nets : 105 %). Le modèle prévoit même des arrivées. Ce résultat dépend du taux actuel reconstitué sur les hauts salaires (⚠️ 61 %) et ignore les niches dont ils profitent aujourd'hui.
- **Le motif de départ, ce sont les transmissions.** Passer de ≈ 10 % à 50 % revient à +2,3 points d'impôt annuel sur la fortune pour une transmission dans 25 ans (calcul de Claude). Pour comparaison, les départs de redevables de l'ISF étaient d'environ 950 par an en 2011-2016, pour 370 retours (France Stratégie 2021, ⚠️ extraction partielle). Le scénario central (≈ 4 500 par an) multiplierait ce rythme par près de cinq.
- **La meilleure preuve disponible est moins alarmiste que le scénario central.** Appliquée au même choc, l'étude scandinave (−2 % de contribuables fortunés par point d'impôt sur la fortune) donne ≈ −4,6 %, proche du scénario faible. Le CAE (2021) juge la contrainte migratoire « faible » pour les droits de succession, et une étude suédoise citée par le CAE ne trouve aucun effet de la suppression des droits de succession sur la migration.
- **Mais les entreprises des partants souffrent.** L'entreprise d'un actionnaire qui part perd 15 à 34 % de son activité selon le CAE (Focus 118, lecture de graphiques ⚠️) ; l'effet agrégé reste faible (Jakobsen et al. : −0,02 % d'emploi par point), ici 0 à 0,8 Md€.

## 5. Multinationales (non chiffré)

- Le simulateur **abandonne déjà les 68 Md€ d'IS** : les multinationales ne peuvent donc pas y faire perdre une recette qu'il ne compte pas. Le risque est ailleurs.
- **Ce qui disparaît du transfert de bénéfices** : si le bénéfice réinvesti en France n'est plus taxé, garder ses bénéfices en France ne coûte plus rien. L'incitation actuelle à les déplacer (semi-élasticité ≈ 0,8 des bénéfices déclarés à l'écart de taux, Heckemeyer & Overesch 2017 ; ≈ 36 % des bénéfices des multinationales dans les paradis fiscaux, Tørsløv-Wier-Zucman 2023) s'inverse pour la part réinvestie.
- **Ce qui reste exposé** : les sommes qui sortent vers des actionnaires ou des filiales étrangères (dividendes, redevances, intérêts). L'auteur veut les taxer à la sortie, mais la directive mères-filiales et les conventions limitent les retenues à la source (V101).
- **Le piège du Pilier 2** : sans impôt minimum domestique de 15 % sur les grands groupes, d'autres pays pourraient prélever l'impôt complémentaire sur leurs bénéfices réinvestis en France. Les règles prévoient un traitement des régimes « à l'estonienne » (⚠️ non lu, V99).

## 6. Ce que changerait une imposition selon la nationalité

L'efficacité *k* est la part de l'impôt réellement perçue sur un Français parti. Elle combine trois filtres : ceux qui renoncent à la nationalité, les pays où une convention l'interdit, et le recouvrement effectif.

**Perte totale (Md€/an) selon *k*** :

| Scénario | k = 0 (rien) | k = 0,05 (type exit tax française) | k = 0,25 | k = 0,6 (type États-Unis) |
|---|---|---|---|---|
| Faible | 36,3 | 36,3 | 36,0 | 35,5 |
| Centrale | 68,2 | 68,0 | 66,9 | 65,0 |
| Forte | 119,7 | 119,0 | 116,0 | 110,5 |

| | Exil + entreprises, k = 0 → 0,6 | Familles du top 1 % qui partent, k = 0 → 0,6 |
|---|---|---|
| Faible | 2,3 → 1,5 Md€ | 19 500 → 13 600 |
| Centrale | 7,6 → 4,3 Md€ | 45 500 → 28 600 |
| Forte | 18,6 → 9,4 Md€ | 93 500 → 52 700 |

**Ce que cela dit :**

- **L'idée de l'auteur a un fondement.** Elle existe déjà pour les Français de Monaco (convention de 1963, confirmée par le Conseil d'État en 2011). Le CAE la cite lui-même comme moyen de contrôler l'exil pour les droits de succession. Bien appliquée, elle réduit les départs d'un tiers à près de moitié.
- **Mais elle vise le petit problème.** L'exil ne pèse que 2 à 18 Md€ dans la perte totale. Les gros montants (transmissions non déclarées, report de l'épargne) ne dépendent pas de la nationalité. Un **système d'information sur les transmissions** (préconisé par le CAE) rapporterait davantage : chaque point d'écart de déclaration en moins vaut 1,5 Md€.

**Ses limites :**

1. **Renonciation.** On ne peut en principe renoncer à la nationalité française qu'en ayant ou en acquérant une autre nationalité (⚠️ Code civil, art. 23, à vérifier). C'est un frein réel, sauf pour les binationaux (≈ 1 million selon l'objection relayée par le Sénat en 2012 ⚠️) et pour ceux qui se font naturaliser ailleurs. Aux États-Unis, ≈ 4 800 personnes renoncent chaque année (Federal Register). Parade possible : une taxe de sortie à la renonciation, comme l'article 877A américain.
2. **Conventions fiscales.** Les conventions rattachent l'impôt à la résidence (modèle OCDE, art. 4 ⚠️). Il faudrait insérer une clause « à l'américaine » ou « à l'andorrane » dans chacune, avec l'accord des pays, notamment ceux qui attirent les fortunes (Suisse, Belgique, Émirats…).
3. **Droit de l'Union.** Imposer différemment un Français parce qu'il s'installe en Belgique ou au Portugal se heurte à la liberté d'établissement et de circulation. La Cour de justice a déjà censuré l'exit tax française de 1999 (*de Lasteyrie*, 2004).
4. **Application.** L'échange automatique d'informations bancaires renseigne l'État de **résidence**, pas l'État de nationalité (⚠️). La France ne saurait pas ce qu'un Français de Dubaï possède à Dubaï, sauf à imposer un FATCA français, ce que seuls les États-Unis ont réussi. L'exit tax française a recouvré **138 M€ sur 5,75 Md€** mis en recouvrement en 2011-2016 (Sénat).
5. **Effets secondaires.** Elle toucherait aussi tous les Français déjà installés à l'étranger pour d'autres raisons (effectif non vérifié ici ⚠️), avec un coût de conformité élevé : c'est le problème des « Américains accidentels ». Elle ne retient pas les étrangers fortunés installés en France, dont la mobilité est la plus forte (élasticité ≈ 1 à 2).

**Steelman de l'objection.** « Un impôt fondé sur la nationalité est inapplicable hors des États-Unis : ils l'imposent au monde grâce au poids du dollar ; la France n'a pas ce levier. » Réponse : c'est vrai pour le revenu courant. Ce l'est moins pour les **transmissions**, qui portent souvent sur des biens situés en France (immeubles, entreprises françaises) et sur des héritiers qui y vivent. Une règle « résidence longue ou nationalité du défunt **ou** de l'héritier » couvre l'essentiel sans FATCA. C'est la version défendable de l'idée.

## 7. Conséquences pour le bilan du simulateur (ordre de grandeur)

- Le solde central du simulateur (≈ −196 Md€) se dégrade de **≈ 36 à 120 Md€** (68 Md€ dans le scénario central), avant l'effet sur l'offre de travail (T4).
- Le **taux d'équilibre** passerait de ≈ 59 % à environ **61 % (faible), 63 % (central), 66 % (forte)** (calcul : besoin de 1 280 Md€ / assiette effective à 50 %). C'est une approximation : à un taux plus haut, les réactions sont un peu plus fortes (perte centrale de 4,2 % à 40 %, 8,5 % à 60 %).

## 8. Comment brancher les résultats sur le simulateur

1. **Curseur `fuite`** : valeur par défaut **31** au lieu de 0 ; repères 18 / 31 / 48 ; remplacer la légende (§ 3). Le maximum actuel (74) peut rester comme borne de prudence.
2. **Autres assiettes** : remplacer la constante `ASSIETTE_FIXE` par une somme de bases × coefficients issus du modèle, et ajouter un sélecteur « réaction des revenus du capital » (faible / centrale / forte) et un sélecteur « imposition selon la nationalité » (*k*). Les coefficients dépendent du taux, il faut donc recalculer à chaque mouvement :

```js
// dans calculer(p) du simulateur, après avoir chargé modeles/reactions-assiettes/modele.js
const r = ReactionsAssiettes.calculer({ taux: p.taux, scenario: p.reaction, nationalite: p.k });
const c = r.coefficients; // ex. central à 50 % : intérêts 0,817 ; dividendes 0,803 ; transmissions 0,687
const assietteCapital = 121.9 * c.independants + 40.9 * c.loyers + 71.7 * c.interets + 74.9 * c.dividendes
                      + 67.5 * c.assurance_vie + 25.6 * c.plus_values;
const assiette = SALAIRES * (1 + p.salaires) * c.salaires + assietteCapital
               + (p.transmissions ? TRANSMISSIONS * c.transmissions : 0); // remplace (1 - p.fuite)
```

   Si l'on garde le curseur `fuite` manuel, utiliser `1 − p.fuite` pour les transmissions **à la place** de `c.transmissions`, jamais les deux.
3. **Salaires** : `c.salaires` ne contient que la réaction du haut et l'effet sur les entreprises des partants ; il se **multiplie** avec le curseur « masse salariale » de T4 sans double compte.

## 9. Ce qui appuie, nuance ou contredit la thèse de l'auteur

- **Appuie** : une assiette large et sans niches réduit l'élasticité (Saez-Slemrod-Giertz : avec une assiette élargie, le taux qui maximise la recette des hauts revenus monterait de 54 % à 80 % selon Gruber-Saez). La crainte d'un exode des hauts revenus n'est pas fondée pour les revenus d'activité : 50 % est moins que la charge actuelle au sommet.
- **Nuance** : le modèle estonien déplace le problème. Il protège l'investissement, mais il rend les revenus distribués et l'épargne financière très sensibles, et il repousse une grande partie de l'impôt au moment de la transmission. Tout repose alors sur un impôt sur les transmissions qui fonctionne. Si celui-ci fuit (« acheter, emprunter, mourir »), les deux assiettes fuient ensemble.
- **Contredit** : l'imposition selon la nationalité n'est pas la réponse principale à la fuite. Elle réduit l'exil, mais l'exil est le plus petit des trois postes. La priorité chiffrée, c'est l'information sur les transmissions et les règles anti-abus sur les sociétés qui ne distribuent jamais. Et l'idée est juridiquement coûteuse : conventions à renégocier, droit de l'Union, risque de renonciations chez les binationaux.
- **Biais à signaler** : beaucoup de paramètres sont des hypothèses de Claude (marqués ⚠️). Les choix ne sont pas faits pour arranger la thèse : le scénario central est plus pessimiste que la meilleure étude disponible sur l'exil, et plus optimiste que la situation actuelle sur la déclaration des transmissions. Les deux choix sont contestables et se modifient dans `donnees/parametres_assiettes.csv`.
