---
titre: Le banc d'essai commun des programmes
theme: comparer
statut: brouillon ; calcul du 9 novembre 2026
---

## La question

Que deviennent le déficit et la dette publics si l'on applique les mesures d'un programme politique, chiffrées avec les mêmes modèles pour tous ? Le banc compare le programme de l'auteur à ceux de La France insoumise, du Rassemblement national, des Républicains (plan Retailleau), au contre-budget 2027 du Parti socialiste et de Place publique, et au « fil de l'eau » (rien ne change). Il sert au chapitre qui compare les programmes.

## Ce qui entre

- **Statistique publique.** Dette au sens européen fin 2025 : 3 460,5 Md€, soit 115,7 % du produit intérieur brut (Insee). Déficit de 2024 : 169,1 Md€, dont 65,7 Md€ d'intérêts, donc un solde hors intérêts (le « solde primaire ») de −103,4 Md€.
- **Hypothèses communes.** Croissance nominale de 3 % par an ; taux d'intérêt de marché (obligation d'État à 10 ans) fixé à 3,45 %, sa valeur du début 2026 ; dette renouvelée en 8 ans. Variante prudente : 2,5 % de croissance et 3,95 % de taux.
- **Les programmes.** Chaque programme est une liste de mesures lues dans ses documents (dossier `programmes/`), avec un montant, un calendrier et une interprétation écrite quand la mesure est vague.
- **Nos autres modèles**, appelés quand ils existent : impôt sur le revenu calculé avec le logiciel public OpenFisca-France, retraites, patrimoine, transmissions, Smic, pension minimale (données de la Drees). Sinon, un coût unitaire sourcé ou un ordre de grandeur marqué « grossier ».
- **Pour le programme de l'auteur**, le banc ne recalcule pas les mesures : il lit la trajectoire produite par le modèle du système (page « système idéal ») et 30 « modules » d'incertitude rejoués avec ce même modèle.

## Comment il calcule

1. **Chaque mesure reçoit une loi de probabilité**, pas un chiffre : une valeur basse, centrale et haute. Pour le Rassemblement national, Les Républicains et le Parti socialiste, la valeur haute d'une économie est le montant annoncé par le parti, et la valeur centrale est l'estimation par l'IA de ce qui est réalisable compte tenu des obstacles juridiques et pratiques nommés ligne par ligne. Les baisses d'impôt et dépenses nouvelles sont comptées entre 0,95 et 1,15 fois leur montant.
2. **Les mesures sont reliées entre elles** par deux facteurs communs : « comportement » (fuite de l'assiette, exil, réaction des revenus déclarés) et « coût » (dérive des dépenses). Le poids de chaque mesure sur ces facteurs va de 0,3 à 0,8.
3. **10 000 tirages** au hasard (graine fixe, donc résultat reproductible). Dans chaque tirage, on obtient l'effet du programme sur le solde, année par année, avec sa montée en charge.
4. **La dette de chaque tirage** suit la même récurrence pour tous :
   - taux moyen de la dette de l'année = taux de l'an passé + (taux de marché − taux de l'an passé) / 8 ;
   - intérêts = taux moyen × dette de l'année d'avant ;
   - solde primaire = (−103,4 Md€ + effet du programme) × (1,03 puissance le nombre d'années depuis 2025) ;
   - dette de l'année = dette de l'année d'avant − solde primaire + intérêts.
5. **On publie la médiane** des tirages et l'intervalle qui contient 80 % d'entre eux (du 10e au 90e centile).
6. **La relance** (effet des mesures sur l'activité) est présentée à part : variation du produit intérieur brut = multiplicateur × dépenses nouvelles − rapport × multiplicateur × recettes nouvelles + effet d'offre, puis 45 % de cette variation revient en recettes.

**Exemple suivi, le fil de l'eau en 2026.** Le taux moyen de départ vaut 65,7 / 3 460,5 = 1,90 %. Il monte vers 3,45 % d'un huitième de l'écart : 2,09 %. Intérêts : 2,09 % × 3 460,5 = 72,4 Md€. Solde primaire : −103,4 × 1,03 = −106,5 Md€. Dette fin 2026 : 3 460,5 + 106,5 + 72,4 = 3 639,4 Md€, pour un produit intérieur brut de 3 080,7 Md€, soit 118,1 %. En répétant jusqu'en 2038 : 157,1 %, puis 240,2 % en 2058 (calcul relancé pour cette fiche avec les fonctions du dossier).

**Contrôle.** Le moteur, réécrit à part, retrouve à 0,001 point près la trajectoire du modèle du système : 130,4 % en 2038 et 124,6 % en 2058 (`resultats.md`, § 4). Ce contrôle valide la chaîne de la dette, pas les mesures.

## L'hypothèse qui porte le résultat

**Le taux d'intérêt fixe de 3,45 %, qui ne réagit pas à la dette.** Il vient du taux à 10 ans du début 2026. Or le taux du 9 novembre 2026 est d'environ 4,7 à 4,8 %. Le modèle du taux d'intérêt (page « taux-endogene ») rejoue les mêmes tirages : à 4,7 % fixe, la dette 2058 de notre système passe de 122 % à 169 % ; avec un taux qui monte avec la dette, notre système entre en zone de crise (écart de taux avec l'Allemagne au-dessus de 3 points) avant 2058 dans 67 % des tirages, et il manque environ 40 Md€ par an (37 à 44) pour stabiliser la dette. La même remarque vaut pour tous les programmes, pas seulement pour La France insoumise.

**Pour le programme de l'auteur, la stabilité de la dette est une construction.** Le taux du haut de la contribution est réglé dans le modèle du système pour que la dette cesse de monter après 2038 à 3,45 %. Le banc le dit lui-même : « le modèle central est calé exactement sur la limite » (`resultats.md`, § 7). Ce n'est donc pas un résultat indépendant. Dans les tirages, la dette ne reste stable après 2038 que dans 52 % des cas.

## Ce que l'IA a choisi elle-même

Le code des programmes porte environ 90 marques ⚠️ (29 pour La France insoumise, 36 pour le Rassemblement national, 10 pour le Parti socialiste, 8 pour Les Républicains, 5 pour notre système, 3 dans le moteur) ; une partie sont des faits non vérifiés, pas des choix. Les choix qui pèsent le plus :

- **La valeur « réalisable » des économies annoncées** (Rassemblement national, Républicains, Parti socialiste) : jugement de l'IA, ligne par ligne. Il abaisse leur résultat. Le Rassemblement national annonce environ +144 Md€ en régime ; le banc retient −32 Md€.
- **Lire les scénarios favorable et défavorable des modèles comme les 10e et 90e centiles** : convention sans source. Elle fixe la largeur des intervalles.
- **Les poids sur les facteurs communs** (0,3 à 0,8) : conventions. Sans corrélation, l'intervalle de notre système passe de [64 ; 167] à [81 ; 151] Md€ (§ 7).
- **Le retour de 45 % en recettes** et les bornes des multiplicateurs (0,3 à 1,5 pour la dépense ; effet d'offre de −1 % à 0, « sans source »).
- **Pour notre système**, le niveau des hausses votées (33,3 Md€) est fixé, et la séparation entre recettes et dépenses nouvelles pour la relance est une convention.

## Ce qu'il ne fait pas

- **Taux fixe** : aucune réaction des marchés à la dette (voir plus haut).
- **Traitement pas tout à fait égal.** Le filtre « ce qui est réalisable » s'applique aux économies du Rassemblement national, des Républicains et du Parti socialiste ; il ne s'applique ni aux mesures de La France insoumise ni à celles de l'auteur, dont le banc lit la valeur dans son propre modèle. Le programme d'Édouard Philippe n'a pas de colonne faute de document chiffré.
- **L'intervalle de notre système est sous-estimé** : le socle hérité des premières versions du modèle, des corrections comptables (−19 Md€) et l'impôt de suite sont fixés à leur valeur centrale. Les scénarios d'ensemble du modèle donnent un solde primaire 2038 bien plus large que le tirage : de −214 à +203 Md€, pour une valeur centrale de 9 Md€ (`resultats.md`, § 3).
- **Deux chiffres pour la dette 2058 de notre système** : 121,9 % (médiane des tirages) et 124,6 % (valeur centrale du modèle). L'écart vient de bornes asymétriques. Il faut citer la médiane et son intervalle, et dire lequel on cite.
- **Prélèvements.** Le programme de l'auteur porte les prélèvements obligatoires de 42,7 % à 51,5 % du produit intérieur brut. Une phrase qui dirait « pas de prélèvement nouveau » sans préciser son périmètre serait fausse.
- Impôt sur le revenu calculé sur des foyers types, pas sur un échantillon représentatif : le haut de la distribution est sous-représenté.
- Le banc est écrit par l'IA pour l'auteur, et le même moteur chiffre ses concurrents : conflit d'intérêts déclaré.

## Ce qu'il donne

- Effet sur le solde par rapport au fil de l'eau, en régime : La France insoumise −247 Md€ [−289 ; −203] ; Rassemblement national −32 [−61 ; 4] ; notre système +114 [64 ; 167] en 2038 (`resultats.md`, § 1).
- Dette publique 2038 : La France insoumise 240 % [225 ; 254] ; Rassemblement national 170 % [158 ; 179] ; notre système 131 % [118 ; 143] ; fil de l'eau 157,1 % (§ 1).
- Dette publique 2058 : 503 %, 276 %, 122 % [63 ; 176] et 240,2 % (§ 1). Tous à taux fixe de 3,45 %.
- Les Républicains : +24 Md€ [−9 ; 66], dette 2038 de 150 % ; Parti socialiste et Place publique : −11 Md€ [−19 ; −3], dette 2038 de 161 % (§ 11.1).
- Notre système : le déficit public de 2038 est sous 3 % dans 34 % des tirages seulement (médiane 3,7 %) ; prélèvements obligatoires 51,5 % [50,2 ; 52,9] (§ 1 et § 7).
- Avec des hypothèses d'exil des grandes fortunes moins sévères, appliquées à tous, le classement ne change pas (§ 10).

## Le détail, poste par poste

Pour chaque programme, une page reprend chaque ligne : la mesure dans les mots du parti et sa source, ce que le parti annonce, l'estimation du banc (médiane et intervalle), la façon de la calculer, le modèle utilisé, la même famille de mesures chez les autres, la fiabilité et les choix posés par l'IA. Une page à part, « les mêmes modèles pour tous », vérifie dans le code que les mesures qui se ressemblent passent par le même modèle avec les mêmes paramètres, et liste les cas où ce n'est pas vrai, avec leur effet quand il se calcule. Ces pages sont produites par un programme (`detail.py`) à partir des fichiers de mesures et des résultats, sans aucun chiffre recopié à la main ; un test vérifie que leurs totaux sont ceux du tableau comparatif.

- [La France insoumise](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-lfi.html)
- [Rassemblement national](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-rn.html)
- [Les Républicains (plan Retailleau)](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-lr.html)
- [PS et Place publique (contre-budget 2027)](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-ps.html)
- [Notre système](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-langagement.html)
- [Les mêmes modèles pour tous](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/memes-modeles.html)

## Comment le refaire

Depuis la racine du dépôt :

```
python3 -I modeles/banc-programmes/tests/test_banc.py     # 45 tests, environ 11 secondes
python3 -I modeles/banc-programmes/relancer.py            # recalcule à partir des données en cache et réécrit resultats.md
python3 -I modeles/banc-programmes/relancer.py --ponts    # relance d'abord les modèles JavaScript et OpenFisca
python3 -I modeles/banc-programmes/detail.py              # réécrit les pages de détail (sans nouveau tirage)
python3 -I modeles/banc-programmes/tests/test_detail.py   # vérifie les pages de détail
```

Les 45 tests passent (lancés le 9 novembre 2026 pour cette fiche). Le calcul complet n'a pas été relancé. L'option `--ponts` demande OpenFisca-France 176.1.10 installé dans un environnement Python à part, et le moteur JavaScript du système (`jsc`).
