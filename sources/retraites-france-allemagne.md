# Pourquoi l'Allemagne dépense-t-elle environ 3 points de PIB de moins pour les retraites ?

> Dossier du 03/11/2026, demandé par l'auteur (comparer l'âge, le niveau et le système). Marquage : **[fait]** lu à la source ; **[estimation]** calcul de Claude, reproductible ; ⚠️ = non vérifié, listé dans `verifications.md` (V10000 et suivants). Téléchargements publics dans `$DONNEES/retraites-de-fr/` (rapport OCDE *Pensions at a Glance 2025*, séance du COR du 21/11/2024, rapport annuel du COR 2026).

## En dix lignes

1. **L'écart existe sous toutes les mesures, entre 2,2 et 3,9 points de PIB** : 3,2 points en 2023 pour les pensions au sens d'Eurostat (14,6 % contre 11,4 %), 3,6 pour la vieillesse au sens COFOG (13,35 contre 9,74 %), 3,0 en 2019 pour le COR (13,4 contre 10,4 %), 2,6 pour l'OCDE en public seul et 2,2 en public plus privé. **[fait]**
2. **Le périmètre ne l'explique pas.** Les pensions de fonctionnaires allemands (Beamte, environ 63 Md€ en 2023, 1,5 % du PIB) sont dans les comparaisons de la Commission et de l'OCDE ; la part des 65 ans et plus est même plus élevée en Allemagne (22,4 % contre 21,5 % en 2024). ⚠️ V10000
3. **Décomposition du COR (2019, 3,0 points), lue comme deux contrefactuels** : le **niveau relatif des pensions** (pension moyenne ÷ revenu d'activité moyen : 54 % en France, 44 % en Allemagne) pèse environ **2,4 points** ; l'**emploi** environ **2,0 points** (dont à peu près la moitié pour les seniors **[estimation]**) ; le **taux de retraités** (retraités ÷ 65 ans et plus : 122 % contre 112 %, c'est-à-dire des départs avant 65 ans) environ **1,0 point** ; la démographie 0,0 ; un effet de contexte économique joue en sens inverse (**environ −2,6 points**). Les facteurs ne s'additionnent pas en parts de l'écart : ils se compensent.
4. **Âge : de 1,5 à 2 ans d'écart, et deux à quatre ans de retraite en plus.** Âge normal 2024 : 64,3 ans en France contre 66,2 en Allemagne (OCDE) ; âge moyen de départ : 63,1 (COR, 2025) contre 64,7 (DRV, 2024) ; espérance de vie à 65 ans : 21,8 contre 19,4 ans (Eurostat 2023). La durée moyenne passée en retraite est ≈ 24 ans en France contre ≈ 20 en Allemagne **[estimation]**. Emploi des 55-64 ans en 2024 : 60,3 % contre 75,0 %.
5. **Niveau : l'écart est énorme.** Taux de remplacement pour le salarié moyen : **brut 56,6 % contre 42,1 %**, **net 70,0 % contre 53,3 %** (OCDE 2025, carrière complète, régimes obligatoires). Richesse en pensions d'un salarié moyen : 11,5 fois le salaire annuel contre 9,0.
6. **Indexation : l'Allemagne a un frein automatique, pas la France.** Les pensions allemandes suivent les salaires corrigés du ratio retraités/cotisants, avec des seuils de taux de remplacement net (48 % jusqu'en 2025, 43 % jusqu'en 2030) ; les françaises suivent les prix, ce qui les fait baisser relativement aux salaires (54,6 % → 45,3 % du revenu d'activité en 2070 selon le COR). La trajectoire future se resserre : écart de 3,9 points en 2023-24, 2,3 en 2060 selon le rapport sur le vieillissement 2024.
7. **Réversion : pas la cause.** Les pensions de survivants coûtent 1,41 % du PIB en France et 1,53 % en Allemagne (Eurostat 2023). L'écart se fait sur la vieillesse proprement dite (+3,0 points), l'invalidité et la retraite pour incapacité (+0,3), et la réversion joue légèrement en sens inverse (−0,1).
8. **Le privé allemand compte peu dans la dépense, beaucoup dans le niveau visé.** Dépense privée de pensions : 0,7 % du PIB contre 0,3 (OCDE) ; l'épargne volontaire (Riester, Betriebsrente) ajoute 11,2 points au taux de remplacement brut d'un salarié moyen **à participation complète**, ce qui le porte à 53,4 % brut et 68,0 % net, presque au niveau français (70,0 %). Dépenses fiscales associées : 1,0 % du PIB en Allemagne.
9. **Ce que l'Allemagne « paie » ailleurs** : pauvreté des 65 ans et plus de 12,6 % contre 6,1 % (seuil de 50 % du revenu médian, 2022) et de 20,9 % contre 13,3 % au seuil de 60 % (2020) ; niveau de vie relatif des seniors 86,6 % contre 94,3 % de celui de l'ensemble ; plus de travail après 60 ans ; une épargne privée à faire soi-même pour retrouver le niveau français ; avec, pourtant, une satisfaction de vie des 65-74 ans identique (7,0 contre 7,1 sur 10).
10. **Conclusion pour l'auteur** : l'Allemagne dépense moins surtout parce que ses pensions sont **plus basses relativement aux salaires** (niveau, indexation) et parce que ses seniors **travaillent plus longtemps** (âge effectif, taux d'emploi), et pas à cause d'un périmètre ou de la démographie. « Ne pas relever l'âge légal » laisse donc le levier du niveau, qui est précisément celui que la v2 retient (hautes pensions) ; mais **le modèle `modeles/retraites/age_libre.js` montre que « âge libre + niveau » ne comble, sans toucher l'âge légal, qu'environ 8 % de l'écart à l'horizon 2060 au scénario central (de −7 % au bas à 41 % au haut)** : le gros du levier est l'indexation des pensions au-dessus d'un seuil, et l'âge libre lui-même ne rapporte rien (voir `modeles/retraites/resultats.md`, section « Âge libre et niveau »).

---

## 1. L'écart de dépense, mesuré cinq fois

| Mesure | France | Allemagne | Écart (points de PIB) | Source |
|---|---|---|---|---|
| Pensions totales, 2023 (ESSPROS) | 14,58 | 11,41 | **+3,17** | [Eurostat spr_exp_pens](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/spr_exp_pens?format=JSON&lang=EN&geo=FR&geo=DE&geo=EU27_2020&unit=PC_GDP&time=2023&time=2022&spdepm=TOTAL), consulté le 03/11/2026 |
| Vieillesse (COFOG 1002), 2023 | 13,35 | 9,74 | +3,61 | `sources/economies-benchmark-europeen.md` |
| Dépense publique de retraite, 2019 | 13,4 | 10,4 | +3,0 | COR, [séance du 21/11/2024](https://www.cor-retraites.fr/sites/default/files/2024-11/4.France_Allemagne.pdf) (OCDE SOCX) |
| Public, dernier millésime (FR 2022, DE 2021) | 13,4 | 10,8 | +2,6 | OCDE, [Pensions at a Glance 2025](https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/11/pensions-at-a-glance-2025_76510fe4/e40274c1-en.pdf), tab. 8.2 |
| Public + privé, mêmes années | 13,7 | 11,5 | +2,2 | idem, tab. 8.3 |
| Rapport sur le vieillissement 2024, 2023-24 | 14,1 | 10,2 | +3,9 | Commission européenne, cité par l'OCDE (tab. 8.4) ; 2040 : 14,1 / 11,1 ; 2060 : 13,5 / 11,2 |

Lecture : l'ordre de grandeur est **3 points de PIB, soit environ 90 Md€ par an** (PIB 2025 de 2 994 Md€ : 3 % = 90 Md€). Le chiffre de 106 Md€ de `economies-benchmark-europeen.md` (3,6 points, COFOG, dépense par habitant et PIB de l'Allemagne) est le haut de la fourchette. Autre lecture, du COR (RA 2026) : **par habitant**, en dollars PPA, la France dépense moins que l'Allemagne (sixième rang contre cinquième) ; une part de l'écart en pourcentage du PIB vient donc d'un PIB par habitant plus bas, lui-même lié à l'emploi et à la productivité.

**Par nature de pension (ESSPROS 2023, points de PIB)** : vieillesse (y compris anticipée) France 12,04, Allemagne 9,03 (+3,01) ; invalidité et retraite anticipée pour incapacité ou raisons de marché du travail : 1,13 contre 0,85 (+0,28) ; survivants 1,41 contre 1,53 (−0,12). Les classements de l'invalidité diffèrent entre pays (l'Allemagne range en « retraite anticipée pour incapacité » 0,79 point que la France range en « invalidité »), d'où la somme.

## 2. Le périmètre : les Beamte sont-ils dedans ?

- **[fait]** Le rapport sur le vieillissement de la Commission, base des projections de l'OCDE, **inclut** les régimes de fonctionnaires : « les régimes de pensions des fonctionnaires et des autres salariés du secteur public sont généralement inclus » (note du tableau 8.4 de Pensions at a Glance 2025).
- **[fait, source secondaire]** Pensions des anciens fonctionnaires allemands en 2023 : 54,8 Md€ plus 8,6 Md€ de réversion, soit ≈ 1,5 % du PIB (communiqué de l'Office fédéral de la statistique, tel que repris par la presse). Pension moyenne d'environ 3 400 € par mois, 1,4 million de bénéficiaires. ⚠️ V10000
- Donc **l'Allemagne à 10,2-11,4 % comprend déjà les Beamte**. Si on les excluait pour comparer au seul régime général (Deutsche Rentenversicherung), l'Allemagne tomberait vers 9-10 % et l'écart avec la France *augmenterait* à 4-5 points. L'écart n'est pas un artefact de périmètre. Côté français, le COR compte tous les régimes obligatoires (base, complémentaires, spéciaux, fonction publique).
- Limite : je n'ai pas lu la note méthodologique d'Eurostat sur le classement des Beamte dans ESSPROS ; le recoupement vient de la cohérence OCDE (SOCX), COR et Commission. ⚠️ V10000

## 3. Décomposition de l'écart (COR, séance du 21 novembre 2024)

**[fait]** Le secrétariat du COR décompose la dépense (en % du PIB) en cinq facteurs multiplicatifs : (1) démographie (65 ans et plus ÷ 20-64 ans), (2) contexte économique (rémunération moyenne ÷ productivité par tête), (3) taux d'emploi des 20-64 ans, (4) taux de retraités (retraités de tous âges ÷ 65 ans et plus), (5) pension moyenne relative (pension moyenne ÷ rémunération moyenne). Le graphique de la page 6 donne, **pour chaque pays, l'effet de remplacer son facteur par celui de l'autre pays** (en points de PIB, 2019) :

| Facteur | Allemagne avec le facteur français | France avec le facteur allemand | Moyenne des deux lectures (contribution à l'écart de 3,0) |
|---|---|---|---|
| Démographie | 0,0 | 0,0 | **0,0** |
| Contexte économique (rémunération ÷ productivité) | −2,0 | +3,2 | **−2,6** (joue en sens inverse) |
| Taux d'emploi 20-64 ans (79,7 % contre 72,2 % en 2019) | +2,0 | −2,1 | **+2,05** |
| Taux de retraités (112 % contre 122 %) | +0,9 | −1,1 | **+1,0** |
| Pension moyenne relative (44 % contre 54 %) | +2,4 | −2,5 | **+2,45** |
| **Somme** | | | **+2,9** (écart observé : 3,0 ; l'arrondi explique la différence) |

**[estimation de Claude]** : la moyenne des deux lectures est un choix de lecture du graphique (le COR ne publie pas de répartition unique) ; ⚠️ V10003. Le facteur « taux d'emploi » regroupe les seniors et les autres âges : les écarts de 2019 sont de 7,5 points pour les 20-64 ans (79,7 % contre 72,2 %) et de 17,2 points pour les 55-64 ans (71,7 % contre 54,5 %, Eurostat) ; en pondérant les 55-64 ans par environ 22 % des 20-64 ans (hypothèse), ils font environ **la moitié** de l'écart d'emploi, soit ≈ 1,0 point sur les 2,05. ⚠️ V10004

**Lecture par grandes causes (points de PIB, ordres de grandeur)** :

| Cause | Points | Part de l'écart de 3,0 | Nature |
|---|---|---|---|
| Niveau relatif des pensions (taux de remplacement, indexation) | ≈ 2,4 | ≈ 80 % | règles : choix |
| Âge effectif de sortie (taux de retraités 1,0 + emploi des seniors ≈ 1,0) | ≈ 2,0 | ≈ 65 % | règles et comportements |
| Emploi aux autres âges (jeunes, femmes, chômage) | ≈ 1,0 | ≈ 35 % | marché du travail, hors retraites |
| Démographie | 0,0 | 0 % | |
| Contexte économique (écart de rémunération relative) | ≈ −2,6 | ≈ −87 % | compense |
| **Total** | **≈ 2,9** | **≈ 100 %** | |

Le message tient en deux lignes : **si l'on ne touche pas à l'âge légal, il reste le niveau (≈ 2,4 points) ; si l'on ne touche pas au niveau, il reste l'âge et l'emploi (≈ 3 points)**. Les deux ne se cumulent pas jusqu'à 5 points : l'effet de contexte économique, qui joue à l'opposé, rappelle que la comparaison en part de PIB mélange les règles et la productivité.

**Évolution depuis 1991** (COR) : la dépense a augmenté de 2,8 points en France et de 1,2 en Allemagne ; en projection, de 2019 à 2070, elle baisserait de 0,8 point en France et monterait de 0,5 en Allemagne. L'écart se resserrerait donc mécaniquement (Allemagne : retraités plus nombreux, pension relative à 33 % en 2070 ; France : pension relative à 45 %). Autrement dit, **l'Allemagne a déjà choisi, par des règles automatiques, de faire baisser le niveau relatif de ses pensions de 44 % à 33 % du revenu d'activité** ; la France a choisi de l'étaler.

## 4. Âge : légal, effectif, durée de retraite

| Indicateur | France | Allemagne | Source |
|---|---|---|---|
| Âge normal de la retraite, départ en 2024 après carrière complète dès 22 ans | 64,3 | 66,2 | OCDE PAG 2025, tab. 3.5 |
| Âge normal futur (carrière commencée à 22 ans en 2024) | 65 | 67 | tab. 3.6 |
| Âge anticipé (départ en 2024, tab. 3.5) | 62,5 | 63,0 | tab. 3.5 |
| Décote par an d'anticipation / surcote par an de report | 5,0 % / 5,0 % | 3,6 % / 6,0 % | tab. 3.6 |
| Âge moyen de départ | 63,1 (COR 2025, âge conjoncturel) | 64,7 (DRV 2024, nouvelles pensions de vieillesse) | [COR RA 2026](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf), p. 76 ; Destatis d'après la DRV ⚠️ V10001 |
| Âge effectif de sortie du marché du travail (OCDE 2024) | ≈ 62-62,4 | ≈ 63,9-64,2 | PAG 2025, fig. 6.13 ⚠️ V10002 (appariement des valeurs à relire sur le graphique) |
| Taux d'emploi 55-64 ans, 2024 | 60,3 % | 75,0 % | [Eurostat lfsi_emp_a](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/lfsi_emp_a?format=JSON&lang=EN&geo=FR&geo=DE&time=2024&time=2019&sex=T&indic_em=EMP_LFS&unit=PC_POP&age=Y20-64&age=Y55-64&age=Y60-64) |
| Taux d'emploi 20-64 ans, 2024 | 75,0 % | 81,1 % | idem |
| Espérance de vie à 60 / 65 / 70 ans, 2023 (sexes réunis) | 25,9 / 21,8 / 17,8 | 23,5 / 19,4 / 15,6 | [Eurostat demo_mlexpec](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_mlexpec) |
| Durée moyenne en retraite à l'âge de départ moyen | ≈ 24,0 ans (63,1) | ≈ 19,6 ans (64,7) | **[estimation]** interpolation des tables Eurostat |
| Part des 65 ans et plus, 2024 | 21,5 % | 22,4 % | [Eurostat demo_pjanind](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjanind) |

**Ce que cela pèse** : un départ 1,6 an plus tôt et une espérance de vie plus longue donnent **≈ 4,4 ans de retraite en plus (≈ 24 contre ≈ 20, soit +22 %)** pour un retraité français moyen. À pensions égales, ce serait l'ordre de grandeur d'un surcroît de dépense de +20 %, soit environ 2 points de PIB sur 10 : cela recoupe la somme « taux de retraités + emploi des seniors » du tableau du § 3 (≈ 2,0 points). **[estimation, un recoupement et non une addition]**

**Le COR note aussi** (brief de la séance de 2024) : en 2015, l'âge moyen de départ était d'environ 61,7 ans en France contre 64,0 ans en Allemagne, alors que l'âge **désiré** était de 60,8 ans en France et 64,5 en Allemagne (enquête européenne sur les conditions de travail) ; plus de 40 % des Français disent ne pas pouvoir travailler au-delà de 60 ans, contre 20 % des Allemands. L'écart d'âge n'est donc pas seulement une règle : il est aussi une préférence déclarée, ce qui plaide pour l'idée d'âge libre de l'auteur (la préférence française est de partir tôt).

## 5. Niveau : taux de remplacement, indexation, pension relative

**[fait]** OCDE, *Pensions at a Glance 2025*, tableaux 4.1, 4.4, 4.5 et 4.6 (carrière complète, régimes obligatoires, salaire moyen = 1) :

| Indicateur | France 0,5 / 1 / 2 × salaire moyen | Allemagne 0,5 / 1 / 2 × salaire moyen | OCDE-38 (0,5 / 1 / 2) |
|---|---|---|---|
| Taux de remplacement **brut** | 56,6 / 56,6 / 47,4 | 46,3 / 42,1 / 30,2 | 65,5 / 52,0 / 42,0 |
| Taux de remplacement **net** | 66,1 / 70,0 / 58,9 | 57,7 / 53,3 / 38,8 | 75,4 / 63,2 / 52,9 |
| Brut avec épargne volontaire (participation complète) | 56,6 / 56,6 / 47,4 | 56,8 / 53,4 / 41,4 | 70,0 / 56,6 / 47,1 |
| Net avec épargne volontaire | 66,1 / 70,0 / 58,9 | 71,6 / 68,0 / 52,7 | 81,2 / 69,2 / 59,9 |
| Richesse en pensions brute (hommes, multiple du salaire annuel) | 11,5 / 11,5 / 9,7 | 9,9 / 9,0 / 6,5 | |

Lecture : à salaire moyen, un salarié allemand obtient **24 % de pension nette relative en moins que le Français** (53,3 % contre 70,0 %) en régime obligatoire, et 2 points de moins seulement (68,0 %) s'il épargne à titre volontaire à taux plein (ce que beaucoup de salariés ne font pas ; la couverture est un point d'attention de l'OCDE). La France est plus généreuse **à tous les niveaux de salaire**, et l'écart croît avec le salaire (taux brut à deux fois le salaire moyen : 47,4 % contre 30,2 %) ; je n'ai pas cherché la cause institutionnelle (plafonds de cotisation, formules) de ce gradient.

**Indexation** : France, pensions indexées sur les prix (COR) ; Allemagne, pensions revalorisées sur les salaires avec un coefficient de durabilité qui intègre le ratio retraités/cotisants, une clause de sauvegarde qui interdit toute baisse nominale, et des seuils de taux de remplacement net (48 % jusqu'en 2025 puis 43 % jusqu'en 2030, d'après le brief du COR de 2024). ⚠️ V10017 : les ajustements législatifs ultérieurs (paquet retraites de 2025) ne sont pas vérifiés.

**Pension relative** [COR, 2019] : 54 % du revenu d'activité moyen en France, 44 % en Allemagne ; projection 2070 : 45 % contre 33 %. En 2025 (COR RA 2026) : 54,6 %, 45,3 % en 2070 (la pension moyenne progresse de 0,2 % par an en réel, le revenu d'activité de 0,7 %).

## 6. Fonction publique, réversion, régimes privés

- **Fonction publique** : voir § 2. Le régime des Beamte est financé par les budgets publics et sans cotisation salariale, mais compté en dépense publique ; ⚠️ V10000.
- **Réversion** : France 1,41 % du PIB, Allemagne 1,53 % (Eurostat 2023). L'OCDE note que la réversion allemande réduit de moitié l'écart de pension entre femmes et hommes, le plus fort effet de l'OCDE (note pays 2025, non lue directement : site de l'OCDE en 403, résumé tiré d'une recherche). ⚠️ V10016
- **Régimes privés et professionnels** : dépense privée de pensions 0,7 % du PIB en Allemagne et 0,3 en France ; ils comptent pour environ 7 % de la dépense de retraite allemande en 2019 (COR) et 2 % de la dépense française. La couverture de la Betriebsrente et du Riester est partielle ; la « richesse » supplémentaire des tableaux de l'OCDE suppose une participation complète.
- **Résumé** : le privé réduit l'écart de dépense de **0,4 point** (public 2,6 contre public + privé 2,2), pas davantage.

## 7. Démographie et niveau de vie des retraités

- Démographie : rapport 65 ans et plus ÷ 15-64 ans en 2024 : 34,9 % en France, 35,2 % en Allemagne ; part des 65+ : 21,5 % contre 22,4 %. **L'Allemagne est un peu plus âgée.** Le COR trouve une contribution démographique nulle (0,0 point). Elle jouera en défaveur de l'Allemagne à l'avenir (le rapport 20-64 ÷ 65+ tomberait à 1,7-1,8 dans les deux pays en 2070).
- **Niveau de vie des retraités** (OCDE, 2022 ; revenu moyen des 65+ en % de la population totale) : **France 94,3 %, Allemagne 86,6 %** ; **pauvreté des 65+** (moins de 50 % du revenu médian) : **6,1 % contre 12,6 %** ; au seuil de 60 % (2020, COR) : **13,3 % contre 20,9 %**. Les deux seuils donnent le même classement : un retraité allemand a **1,6 à 2 fois plus de risque** d'être pauvre.
- **Composition du revenu** : les ménages de plus de 65 ans ont en moyenne 464 € par mois et par unité de consommation de revenus du travail en Allemagne, 166 € en France (2019, OCDE reprise par le COR) : un retraité allemand travaille davantage, ou complète davantage, après 65 ans.
- **Satisfaction de vie** des 65-74 ans (SILC 2023) : 7,1 en France, 7,0 en Allemagne.
- **Patrimoine** : le COR présente aussi le patrimoine médian des ménages par âge (graphiques de la séance, enquête HFCS 2021) ; non repris ici (voir `patrimoine-generations.md`).

## 8. Ce que l'Allemagne « paie » ailleurs, et ce que cela dit pour la France

**Ce qu'elle paie** : (1) deux fois plus de pauvreté chez les seniors (12,6 % contre 6,1 %) ; (2) un niveau de vie relatif des retraités 8 points plus bas ; (3) un taux d'emploi de 75 % chez les 55-64 ans, c'est-à-dire plus de travail et d'inactivité subie après 60 ans ; (4) une épargne privée à faire soi-même (Riester, Betriebsrente) pour rejoindre 68 % de taux net, avec 1,0 % du PIB de dépenses fiscales ; (5) un âge normal de 67 ans.
**Ce qu'elle ne paie pas, d'après les chiffres lus** : une satisfaction de vie moindre (7,0 contre 7,1 pour les 65-74 ans). Côté français, le COR projette un solde des régimes de −2,4 % du PIB en 2070 : l'écart de niveau est financé par du déficit futur ou des prélèvements.

**Pour le manifeste** : les trois leviers disponibles sont l'âge (écarté par l'auteur), le niveau (retenu avec protection du bas), et l'emploi des seniors (qui rejoint la préférence pour l'« âge libre » si l'on le conçoit avec des incitations). Le cas allemand montre ce que coûte un niveau bas sans protection du bas : une pauvreté des retraités double. **C'est la raison de la clause « protection sous 1 500-2 000 € »** que l'auteur a évoquée le 03/11 et que le modèle chiffre.

## 9. Limites

- Les mesures de dépense diffèrent (ESSPROS, COFOG, SOCX, Commission) ; l'écart de 2,2 à 3,9 points est dû à des périmètres et à des années différents.
- La décomposition du COR porte sur 2019 (dernière année avant le Covid pour les données OCDE) et sur la dépense publique de l'OCDE ; elle ne tient pas compte des chiffres 2023-24, où l'écart a augmenté (3,9 points selon la Commission).
- Les effets de composition (pension relative, emploi) ne sont pas indépendants : les chiffres de la colonne « points » ne s'additionnent pas.
- Les taux de remplacement de l'OCDE sont des calculs théoriques (carrière complète dès 22 ans, salaire moyen) ; la pension réelle moyenne dépend de carrières plus courtes (surtout pour les femmes).
- Non lus à la source : la note méthodologique d'Eurostat sur les Beamte ; le communiqué de l'Office fédéral de la statistique sur les pensions de fonctionnaires ; le rapport sur le vieillissement 2024 (lu à travers l'OCDE) ; le document de travail n° 309 de l'OCDE (septembre 2024) sur la France et l'Allemagne, dont le COR tire ses données. Les sites de l'OCDE (notes pays) ont refusé l'accès (403) ; le rapport complet en PDF est accessible.

## 10. Synthèse des sources mobilisées

| Source | Ce qu'elle établit |
|---|---|
| Eurostat, spr_exp_pens (ESSPROS), consulté le 03/11/2026 | Pensions 2022 et 2023 par nature, % PIB : France 14,6 contre Allemagne 11,4 |
| OCDE, *Pensions at a Glance 2025* (PDF complet, 248 pages) | Âges, décote/surcote, taux de remplacement, richesse en pensions, dépense publique et privée, projections, revenus et pauvreté des seniors |
| COR, séance du 21/11/2024 (brief, présentation « France-Allemagne ») | Décomposition de l'écart de 3 points (2019), pension relative, taux d'emploi, âge désiré, pauvreté, satisfaction |
| COR, rapport annuel 2026 (PDF) | Dépense 14,1 % du PIB en 2025, âge conjoncturel de départ 63,1 ans, pension relative 54,6 %, classement par habitant |
| Eurostat, lfsi_emp_a, demo_pjanind, demo_mlexpec | Emploi des seniors, structure par âge, espérance de vie par âge |
| Destatis / DRV via presse (secondaire) | Pensions de fonctionnaires allemands 2023 ; âge moyen d'entrée en pension 2024 |

## 11. Âge de retraite lié à l'espérance de vie : sources et pays (03/11/2026)

Téléchargements dans `$DONNEES/sources/retraites-age-ev/` (COR, séance d'avril 2026 : projections de l'Insee ; Insee Première n° 2108 ; extraction du texte du PDF de l'OCDE déjà présent dans `sources/t48/`).

| Source | Ce qu'elle établit |
|---|---|
| Code de la sécurité sociale, art. L161-17-2 et L161-17-3 (version issue de la loi n° 2025-1403 du 30 décembre 2025), via [codes.droit.org](https://codes.droit.org/), consulté le 03/11/2026 | Âge légal par génération (62 ans 9 mois pour 1963 à mars 1965 ; 63 ans pour avril-déc. 1965 ; 63 ans 3, 6, 9 mois pour 1966, 1967, 1968 ; 64 ans dès 1969) et durée d'assurance (170 à 172 trimestres) |
| COR, [« Projections Insee 2026 »](https://www.cor-retraites.fr/sites/default/files/2026-04/03.Proj%20INSEE_COR_2026_V1.pdf), avril 2026, consulté le 03/11/2026 | Espérance de vie à 65 ans en 2070 : 26,3 ans (femmes) et 24,4 (hommes) au central ; 28,8 / 26,8 (haute) ; 24,0 / 22,2 (basse) ; niveau 2025 : 23,6 et 20,0 ; espérance de vie à la naissance 2070 : 89,5 et 86,7, variantes ± 3 ans |
| Insee, [Insee Première n° 2108](https://www.insee.fr/fr/statistiques/fichier/9004289/ip2108.pdf), juin 2026, consulté le 03/11/2026 | Hypothèses des projections de population 2026 : fécondité 1,45, solde migratoire +150 000, espérance de vie prolongée sur la tendance 2005-2025 |
| Insee, [Insee Analyses n° 30](https://www.insee.fr/fr/statistiques/2546882) (Dubois et Koubi, 2017), consulté le 03/11/2026 | Réforme de 2010 : à 60 ans, générations 1951-1953, +17 points d'emploi, +7 de chômage, +3 d'inactivité (hommes) ; +16, +6, 0 (femmes) |
| Drees, [communiqué du 30/10/2024](https://drees.solidarites-sante.gouv.fr/communique-de-presse-jeux-de-donnees/241030-Data_effectifs-de-retraites), consulté le 03/11/2026 | Âge moyen conjoncturel de départ : +2 ans 2 mois de 2010 à 2022 |
| OCDE, *Pensions at a Glance 2025*, chapitre 1 et tableaux 3.5 et 3.6 | Âges normaux actuels et futurs : Danemark 67 → 74 ; Pays-Bas 67 → 70 ; Suède 66 → 70 ; Finlande 65 → 68 ; Portugal 65,3 → 68 ; France 64,3 → 65 ; Norvège : lien de 2/3 des gains en préparation ; Danemark : 70 ans en 2040 voté en mai 2025 |
| Gouvernement suédois, [communiqué de mai 2025](https://www.regeringen.se/pressmeddelanden/2025/05/riktaldern-for-pension-2031-faststalld-till-67-ar) | « Riktålder » 67 ans de 2026 à 2031, fixée 6 ans à l'avance, adaptée à l'espérance de vie |
| Presse et sites spécialisés (secondaire) : Portugal (Portaria 358/2024 : 66 ans 9 mois en 2026 ; Portaria 476/2025 : 66 ans 11 mois en 2027), Pays-Bas (loi de 2020, 2/3, annonce 5 ans avant), Danemark (vote du 22/05/2025) | Règles nationales, non lues à la source primaire (V10106) |

**Ce que les pays qui lient l'âge à l'espérance de vie montrent** : les deux tiers (Pays-Bas, Portugal, Norvège) sont la fraction la plus courante après un 1 pour 1 danois jugé trop rigide ; la Suède et le Danemark annoncent l'âge 6 à 15 ans à l'avance ; le Portugal a vu son âge baisser de 3 mois en 2023 (effet de la pandémie), ce que le « cliquet » du modèle de la France interdit. Dans les huit pays de l'OCDE où l'âge normal futur est le plus haut, tous ont un lien avec l'espérance de vie (OCDE 2025). La France n'a aucun lien.

