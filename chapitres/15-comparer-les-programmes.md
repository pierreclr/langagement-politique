---
titre: "Comparer les programmes"
statut: brouillon
version: 0.2
modele: DECISIONS0811, CORRECTION0811
sources_principales: [modeles/banc-programmes/resultats.md, sources/chiffrage-programme-lfi-2027.md, sources/chiffrage-programme-rn-2027.md, sources/chiffrage-programme-philippe-2027.md, sources/banc-variante-moins-severe.md]
---

# 15. Comparer les programmes

## L'essentiel

### Ce que nous voulons montrer

Un programme se juge sur ses chiffres autant que sur ses intentions. Nous avons passé trois programmes dans le même banc d'essai : celui de La France insoumise, celui du Rassemblement national et le nôtre, avec en repère le droit actuel laissé en l'état (le fil de l'eau). Les mêmes modèles, les mêmes hypothèses, la même façon de mesurer l'incertitude, avec deux écarts de méthode que nous signalons plus bas. Pour Édouard Philippe, candidat déclaré, aucun document chiffré d'ensemble n'est publié : nous le disons, et nous donnons ce qu'il a annoncé, hors du banc. Le choix de ces programmes est le nôtre : il tient aux documents que nous avons pu lire à la date de rédaction, pas à un sondage.

### Ce que révèle la comparaison

- Les programmes ne diffèrent pas seulement par leurs valeurs, mais par ce qu'ils font de la dette. Avec nos hypothèses et un taux d'intérêt fixe de 3,45 %, la dette publique de 2058 se situerait autour de 503 % du PIB pour le programme de La France insoumise, de 276 % pour celui du Rassemblement national, de 240 % au fil de l'eau, et de 122 % pour le nôtre (entre 63 et 176 % ; macro de référence, sans relance).
- Au taux de novembre 2026 (environ 4,7 %), avec un taux qui monte avec la dette, tous les programmes s'en trouvent aggravés, le nôtre compris : le fil de l'eau, La France insoumise et le Rassemblement national entrent en zone de crise avant 2038 dans presque tous les tirages ; le nôtre avant 2058 dans deux tirages sur trois si rien n'est ajouté, et il lui manque environ 40 Md€ par an pour stabiliser sa dette.
- Aucun des trois ne ressort de la comparaison sans point faible. Le programme de La France insoumise finance 309 Md€ de dépenses nouvelles et de baisses d'impôts avec 61 Md€ de recettes nouvelles et d'économies chiffrées ; celui du Rassemblement national annonce des économies dont une part se heurte à des contraintes juridiques que notre dossier nomme ligne par ligne ; le nôtre repose sur des efforts votés à l'avance et sur une clause qui, dans environ une moitié des cas, doit se déclencher.
- La relance par la dépense améliore le résultat de La France insoumise et du Rassemblement national (dette 2038 de 240 à 207 % et de 170 à 163 %) et dégrade un peu le nôtre (de 131 à 135 %), sans changer l'ordre des programmes.
- Les hypothèses sur l'exil des grandes fortunes ne séparent pas les programmes. La variante moins sévère déplace les résultats de quelques points de dette, jamais de l'ordre entre eux.

### Comment lire les chiffres

- Un chiffre est une médiane de 10 000 tirages, suivie d'un intervalle à 80 % entre crochets. Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions.
- Le résultat « statique » suppose que le PIB ne réagit pas. La relance est présentée à part.
- Les chiffres sont en euros de 2025, en parts du PIB quand c'est dit. Le déficit de départ est celui de 2024 (169,1 Md€) et la dette de départ celle de fin 2025 (3 460,5 Md€, soit 115,7 % du PIB).
- Le régime est atteint en 2032 pour La France insoumise et le Rassemblement national (mandat 2027-2032), en 2038 pour notre système (rampe du modèle). Une ligne « 2041 et après » évite de comparer des années différentes sans le dire.

---

## La méthode en langage simple

Chaque mesure d'un programme est reliée au modèle qui la calcule : nos modèles de retraites, d'impôt sur le revenu (OpenFisca-France), de patrimoine et de transmissions, ou, quand aucun modèle n'existe, un coût sourcé multiplié par une quantité sourcée. Quand un programme ne donne pas le détail d'une mesure, nous écrivons noir sur blanc comment nous la lisons.

Pour chaque modèle, nous avons des scénarios favorable, central et défavorable. Nous les lisons comme les centiles 10, 50 et 90 d'une loi de probabilité, et nous tirons au sort 10 000 combinaisons. Deux facteurs relient les tirages entre eux : un facteur de comportement (quand les gens réagissent plus que prévu à un impôt, ils réagissent plus à tous) et un facteur de coût (quand une dépense dérape, les autres dérapent aussi). Nous publions la médiane et l'intervalle à 80 %. L'empilement des pires cas en même temps est gardé à part, pour mémoire.

À la fin, tous les programmes passent dans la même chaîne de calcul de la dette : même dette de départ, même croissance (3 % par an en valeur), même taux d'intérêt (3,45 %), même formule. Nous avons vérifié que cette chaîne retrouve exactement la dette de notre propre modèle (valeur centrale : 130,4 % en 2038, 124,6 % en 2058, après correction du double compte d'un report d'encaissement) ; la médiane des tirages, que nous citons pour comparer, est de 131 % et 122 %.[^banc] Le taux fixe est une simplification favorable à tous : la section sur la dette de 200 à 500 % du PIB donne la lecture avec un taux qui suit la dette, pour tous les programmes, le nôtre compris. La relance macroéconomique, avec des multiplicateurs tirés de la littérature, est calculée à part et jamais mêlée au résultat statique.

## Un principe affiché

Nous avons pris les hypothèses les plus prudentes, et nous les avons appliquées à tous, y compris à notre propre programme, par précaution. Concrètement : les réactions des assiettes (exil, érosion, élasticité du revenu imposable) sont celles de nos modèles les plus sévères, le même banc chiffre les trois programmes, et notre système y passe par le même chemin que les deux autres.

Ce principe a un coût pour nous, que nous assumons : nos propres chiffres sont moins flatteurs qu'avec des hypothèses plus clémentes. La section sur la variante moins sévère montre de combien. Nous le disons aussi parce que l'auteur du manifeste est partie prenante : il est candidat potentiel, et le même banc chiffre son programme et ceux de ses concurrents. Ce conflit d'intérêts est déclaré, et le code est ouvert pour que chacun puisse refaire le calcul.

---

## Le tableau comparatif

Résultats statiques, c'est-à-dire sans effet de relance, avec les hypothèses prudentes appliquées à tous.

| | La France insoumise | Rassemblement national | Notre système | Fil de l'eau |
|---|---|---|---|---|
| Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€) | −247 [−289 ; −203] | −32 [−61 ; 4] | 114 [64 ; 167] (2038) | 0 |
| **Déficit total en régime, chaque année (Md€, avant coût des intérêts nouveaux)** | **416** [372 ; 458] | **201** [165 ; 230] | **55** [2 ; 105] (2038) ; 54 [−2 ; 108] (2041 et après) | **169** |
| Déficit restant en régime, avant coût des intérêts nouveaux (% du PIB) | 13,9 [12,5 ; 15,3] | 6,7 [5,5 ; 7,7] | 1,8 [0,1 ; 3,5] (2038) ; 1,8 [−0,1 ; 3,6] (2041 et après) | 5,7 |
| Prélèvements obligatoires, en régime (% du PIB ; 42,7 % en 2024) | 44,8 [44,0 ; 45,7] | 45,0 [44,0 ; 46,3] | 51,5 [50,2 ; 52,9] | 42,7 |
| Dépense publique en 2038 (% du PIB, intérêts compris ; 57,0 % en 2024) | 72,2 [70,8 ; 73,7] | 63,1 [62,8 ; 63,5] | 63,8 [62,4 ; 65,0] | 59,4 |
| Déficit public en 2038 (% du PIB, intérêts compris) | 18,9 [17,0 ; 20,7] | 9,6 [8,1 ; 10,8] | 3,7 [1,6 ; 5,7] | 8,2 |
| Dette publique en 2038 (% du PIB) | 240 [225 ; 254] | 170 [158 ; 179] | 131 [118 ; 143] | 157 |
| Dette publique en 2058 (% du PIB) | 503 [458 ; 548] | 276 [239 ; 306] | 122 [63 ; 176] | 240 |
| Dette 2038, macro prudente (croissance 2,5 %, taux 3,95 %) | 257 [242 ; 272] | 184 [172 ; 194] | 144 [130 ; 157] | 171 |
| Dette 2058, macro prudente | 603 | 341 | 166 [100 ; 227] | 300 |
| Dette 2038, avec relance | 207 [191 ; 224] | 163 [153 ; 171] | 135 [124 ; 144] | 159 [158 ; 160] |
| Dette 2058, avec relance | 398 [347 ; 451] | 256 [226 ; 283] | 137 [92 ; 179] | 246 [243 ; 250] |

Lecture. Aucun programme, le nôtre compris, n'est en excédent : la première ligne dit de combien chacun améliore ou aggrave le déficit d'aujourd'hui, la deuxième ce qu'il reste à emprunter chaque année une fois le programme en place. Notre système emprunte encore environ 55 Md€ par an, contre 169 aujourd'hui ; La France insoumise environ 416, le Rassemblement national environ 201. La ligne « déficit public en 2038 » ajoute le coût des intérêts d'une dette devenue plus lourde. Les prélèvements et la dépense des lignes 4 et 5 ne contiennent pas le retour macroéconomique. Les prélèvements de notre système montent de 42,7 % à 51,5 % du PIB (médiane du banc ; 51,6 % au central du modèle) parce que la mesure officielle compte en brut ce que l'État verse ensuite aux ménages ; une fois ces versements retranchés, la hausse tombe à 3,1 points (chapitre 12).[^decompo] Le fil de l'eau est le droit actuel, avec le solde primaire de 2024 maintenu en part du PIB : ce n'est pas la trajectoire officielle. Pour La France insoumise, l'intervalle porte sur les mesures chiffrées ligne à ligne, y compris quatre mesures longtemps laissées hors totaux (Smic à 1 700 € net, pension minimale, blocage des carburants, nationalisations) ; il ne couvre pas ce que le programme fera des lignes restées non chiffrées. Pour le Rassemblement national, la borne haute de chaque économie annoncée est l'annonce elle-même, et la médiane est notre estimation de ce que le droit et la pratique permettent.

Ce filtre juridique est le premier écart de méthode, et il joue contre le Rassemblement national. Nous ne l'avons appliqué qu'à lui, parce que ses recettes sont surtout des économies annoncées sans mode d'emploi détaillé, que nous avons dû lire ligne par ligne. Les mesures de La France insoumise qui supposent une sortie de règles européennes ou une nouvelle Constitution, et les nôtres, qui supposent aussi une révision de la Constitution (chapitre 8), sont comptées comme si elles s'appliquaient. Le traitement n'est donc pas égal ; une prochaine version du banc devra appliquer le même filtre à tous.

Quant aux macros prudentes, une croissance de 2,5 % et un taux de 3,95 % sont les hypothèses que nous retenons comme scénario de précaution, pas ce que nous attendons. Elles aggravent tous les programmes dans des proportions voisines.

## La variante moins sévère, et ce qu'elle change

Nos modèles d'exil et d'évasion des grandes fortunes sont peut-être trop pessimistes. Nous avons donc relancé le banc avec un jeu d'hypothèses plus basses, appliqué à tous les programmes, le nôtre compris. L'érosion de l'assiette d'un impôt sur la fortune passe de 20 / 35 / 55 % à 15 / 30 / 45 % par point d'impôt (favorable, central, défavorable), la déclaration et la planification des transmissions de 17 / 30 / 45 % à 12 / 20 / 32 %, et les départs de patrimoines mobiles de 5 / 12 / 27 % à 2 / 5 / 12 %. Les ancrages sont des études lues : les départs de redevables de l'ISF mesurés par la DGFiP (0,2 à 0,7 % de la base par an), l'étude des réformes scandinaves (moins 2 % de riches par point d'impôt), l'étude danoise (environ moins 30 % de patrimoine imposable après huit ans pour les très riches), l'étude des cantons suisses (environ moins 30 % de base par point, dont moins d'un quart par déménagement).[^variante][^exil]

| Dette et solde (statique) | La France insoumise | Rassemblement national | Notre système |
|---|---|---|---|
| Solde en régime, valeur du banc (Md€) | −247 | −32 | 114 |
| Solde en régime, variante moins sévère (Md€) | −239 | −31 | 120 |
| Dette 2038, valeur du banc (% du PIB) | 240 | 170 | 131 |
| Dette 2038, variante (% du PIB) | 237 | 169 | 129 |
| Dette 2058, valeur du banc (% du PIB) | 503 | 276 | 122 |
| Dette 2058, variante (% du PIB) | 496 | 275 | 116 |

La variante améliore le solde de 7 à 8 Md€ pour La France insoumise, de 1 Md€ pour le Rassemblement national et de 6 Md€ pour notre système. Elle ne change ni le classement, ni la lecture des trajectoires. Un fait supplémentaire mérite d'être dit : le modèle de patrimoine existant donnait, quand on baissait l'érosion, une recette d'ISF plus faible, parce que la taxe de 1 % qu'il remplace devenait plus rentable que l'ISF lui-même. Nous avons corrigé cet artefact de comptabilité dans le banc sans modifier le modèle (dossier sur la variante, section 3).

Nous gardons le jeu le plus prudent comme référence, pour la raison déjà dite, et nous montrons la variante à côté. Les leviers votés de notre système restent à leur niveau : la variante dit ce que les mêmes votes rapporteraient, non ce qu'une recalibration voterait.

---

## Une dette de 200 à 500 % du PIB dans la zone euro

Les trajectoires du tableau amènent à une question : que signifierait, pour un pays de la zone euro, une dette de 200 à 500 % de son PIB ? Nous répondons par l'arithmétique, puis par les précédents.

### L'arithmétique

Une dette de d fois le PIB, qui coûte r par an en intérêts, absorbe d × r du PIB en intérêts. Pour que la dette cesse de croître en part du PIB quand le PIB croit de g, il faut un excédent primaire (avant intérêts) d'environ d × (r − g) / (1 + g).[^dette] Calculé avec une croissance nominale de 3 %, voici ce que cela donne en régime, une fois que la dette a été refinancée au nouveau taux :

| Dette (% du PIB) | Intérêts à 3,45 % | Excédent primaire pour stabiliser, à 3,45 % | Intérêts à 5 % | Excédent pour stabiliser, à 5 % | Excédent pour stabiliser, à 7 % |
|---|---|---|---|---|---|
| 200 | 6,9 % du PIB | 0,9 % | 10,0 % | 3,9 % | 7,8 % |
| 300 | 10,4 % | 1,3 % | 15,0 % | 5,8 % | 11,7 % |
| 400 | 13,8 % | 1,7 % | 20,0 % | 7,8 % | 15,5 % |
| 500 | 17,2 % | 2,2 % | 25,0 % | 9,7 % | 19,4 % |

Pour comparaison, les intérêts de la France représentaient 65,7 Md€ en 2025, soit 2,2 % du PIB (modèle du dépôt, Insee).[^banc] Le déficit primaire du fil de l'eau est de 103,4 Md€, soit 3,5 % du PIB. Ce calcul est le nôtre ; il suppose que le taux ne dépend pas de la dette, ce qui est précisément ce qui ne tient plus à ces niveaux. Une dette longue se refinance lentement (huit ans de durée moyenne dans nos modèles), de sorte que la charge monte par paliers.

L'effet « boule de neige » est le cœur du risque. Quand le taux dépasse la croissance, la dette grossit d'elle-même, d'autant plus vite qu'elle est élevée : à 400 % du PIB, un écart de deux points entre le taux et la croissance ajoute 8 points de PIB de dette par an sans aucun déficit primaire. La trajectoire de La France insoumise l'illustre : 240 % du PIB en 2038, 503 % en 2058 dans notre banc, avec un taux fixé à 3,45 % qui ne réagit pas à la dette. Mais ce taux fixe vaut pour tous les programmes du banc, le nôtre compris, et la mise en garde vaut pour tous.

### Avec un taux qui suit la dette, pour tous

Nous avons donc refait la chaîne de la dette avec un modèle où le taux part du niveau de novembre 2026 (environ 4,7 %) et monte avec la dette et le déficit, pour chaque programme, avec les mêmes tirages et les mêmes mesures.[^taux] La « zone de crise » commence quand la prime de risque dépasse 3 points ; au-delà, le modèle ne sait plus décrire la suite (ajustement forcé, aide européenne, restructuration).

| | La France insoumise | Rassemblement national | Notre système | Fil de l'eau |
|---|---|---|---|---|
| Dette 2038 à 3,45 % fixe (% du PIB) | 240 | 170 | 131 | 157 |
| Dette 2058 à 4,7 % fixe, sans boucle (% du PIB) | 618 | 349 | 169 | 306 |
| Tirages en zone de crise avant 2038, taux qui suit la dette | 100 % | 98 % | 2 % | 100 % |
| Tirages en zone de crise avant 2058 | 100 % | 100 % | 67 % | 100 % |
| Effort supplémentaire qui stabilise la dette (Md€ par an) | plus de 400 | 184 | 40 | 150 |

Lecture. Le classement ne change pas, mais aucun programme ne tient sans effort supplémentaire, le nôtre non plus. Pour notre système, la dette atteint environ 146 % en 2038 au lieu de 131 %, et il manque environ 40 Md€ par an pour la stabiliser ; comment les trouver est un point que l'auteur n'a pas encore tranché (chapitre 12).

### Le Japon, qui est le contre-exemple, et ce qui le distingue

Le Japon a une dette brute d'environ 214 % du PIB en 2024, que le FMI projette autour de 193 % en 2031.[^japon] Il tient depuis vingt ans avec cette dette. Trois différences avec un pays de la zone euro sont établies ou documentées.

La première est la monnaie. Le Japon emprunte dans sa propre monnaie, sa banque centrale détient massivement ses titres publics (46 % de la dette publique totale fin mars 2025, ⚠️ chiffre lu par un résumé de moteur de recherche) et une part limitée est détenue à l'étranger (environ 12 % fin 2024, même réserve).[^japonbis] Un pays de la zone euro ne contrôle pas la banque centrale qui détiendrait sa dette.

La deuxième tient aux taux. Le Japon a emprunté à des taux très bas pendant des années, de sorte que la charge d'intérêts est restée faible malgré la dette. Le FMI relève dans son examen de 2026 que la banque centrale relève ses taux vers le niveau neutre et que la charge d'intérêts, ainsi que les dépenses de santé et de dépendance, va continuer de monter.[^japon] Le cas japonais n'est donc pas un équilibre durable : c'est une situation que les taux bas ont permise, et que leur remontée met à l'épreuve.

La troisième est l'épargne et la balance courante : le Japon est un pays prêteur net au reste du monde, la France est emprunteuse nette. Ce point n'est pas documenté dans ce chapitre et mérite une source avant d'être affirmé comme un fait (⚠️ V32102).

### La zone euro : pas de prêteur en dernier ressort inconditionnel

Dans la zone euro, la Banque centrale européenne a créé en juillet 2022 un instrument de protection de la transmission de la politique monétaire. Il permet des achats de titres d'un pays dont les taux s'écartent sans justification fondamentale, sous conditions : le pays ne doit pas être en procédure de déficit excessif, ni sous procédure de déséquilibre excessif, sa trajectoire de dette doit être jugée soutenable, et il doit respecter les engagements de son plan de relance et les recommandations du Conseil.[^bce] Le critère de soutenabilité est jugé par le Conseil des gouverneurs à partir des analyses de la Commission, du Mécanisme européen de stabilité, du FMI et de la BCE. Une dette de 200 % du PIB qui continue de croître ne répondrait vraisemblablement pas à ce critère. C'est notre lecture ; le texte ne dit pas à quel niveau de dette la condition cesse d'être remplie.

À cela s'ajoute le cadre budgétaire européen : valeurs de référence de 60 % de dette et de 3 % de déficit, procédure de déficit excessif (⚠️ textes non relus pour ce chapitre, V32102). Nos trajectoires de La France insoumise et du Rassemblement national placent le déficit au-dessus de 9 % du PIB en 2038 : elles ne sont pas compatibles avec ce cadre sans sortie ou révision des règles, que le programme de La France insoumise annonce vouloir, et que celui du Rassemblement national traite autrement (sa propre trajectoire annonce un retour sous 3 % en 2030, que notre banc ne retrouve pas). La nôtre ne l'est pas non plus, à un degré moindre : un déficit de 3,7 % du PIB en 2038, au-dessus de 3 % jusqu'en 2057, et une dette d'environ 130 % qui ne baisse pas d'un point par an (chapitre 12).

### Le précédent grec

La Grèce a vu sa dette passer de 109 % du PIB en 2008 à 146 % en 2010, et a reçu un prêt de 110 Md€ le 2 mai 2010.[^grece] En mars 2012, les créanciers privés ont accepté une réduction de 53,5 % de la valeur nominale de leurs obligations, soit une réduction de la dette d'environ 107 Md€ sur environ 197 Md€ d'obligations concernées.[^esm] Un rapport de la Commission d'octobre 2011 projetait 198 % du PIB pour 2012 sans restructuration.[^grece]

Ce précédent dit trois choses. La restructuration d'une dette dans la zone euro est un fait : elle a eu lieu, et elle a été lourde pour les créanciers privés. Elle s'est accompagnée de programmes d'ajustement dont les contreparties sociales sont documentées par d'autres sources que celles lues ici (non traitées dans ce chapitre). Et le niveau de dette à partir duquel les marchés cessent de prêter n'est pas un seuil fixe : il dépend du moment, des taux, de la confiance et de l'appui des autres États. La Grèce avait 146 % ; la France des trajectoires de La France insoumise en aurait 240 % en 2038 sans que nous puissions dire à quel moment un refus de prêter surviendrait. Nous disons seulement que le risque est asymétrique : les marchés sont indulgents longtemps, puis d'un coup.

### Ce que nous en concluons

Nous ne prétendons pas qu'une dette de 200 à 500 % du PIB mène nécessairement à une crise : le cas japonais montre qu'une dette très élevée peut tenir dans des conditions précises. Nous disons que ces conditions (monnaie propre, épargne intérieure, taux bas) ne sont pas celles de la France, et que la zone euro n'offre pas de garantie inconditionnelle. Une trajectoire qui mène à ces niveaux est un pari sur la patience des prêteurs.

---


---

## Les grandes mesures de chaque programme et leur coût

Les chiffres sont l'effet médian sur le solde en régime, en Md€ par an, avec l'intervalle à 80 %. Un nombre négatif aggrave le déficit.

### La France insoumise

Les quatre plus fortes lignes de dépense du programme, dans nos chiffres : la retraite à 60 ans à taux plein pour 40 annuités (−55 [−69 ; −43]), le remboursement des soins à 100 % par la Sécurité sociale (−30 [−36 ; −25]), la planification écologique de l'État (−24 [−31 ; −17]) et la pension minimale au niveau du Smic (−23 [−30 ; −18]). Suivent la garantie d'autonomie (−20), le point d'indice de la fonction publique à +10 % (−20) et la garantie d'emploi (−11). Côté recettes, la plus importante est le rabot des niches fiscales et sociales (+15 [11 ; 19]), puis la réforme des successions (+13,5 [−0,6 ; 31]) et l'ISF rétabli (+2,2). Le total des dépenses nouvelles et des baisses d'impôts est de 309 Md€ ; les recettes nouvelles et économies, de 61 Md€.[^lfi]

### Le Rassemblement national

La ligne la plus lourde est la retraite à 62 ans avec 42 annuités (−24 [−31 ; −18]), puis la suppression de la CFE, de la CVAE et de la C3S (−17), la TVA à 5,5 % sur les énergies (−11,5), un ensemble de dépenses de sécurité (30 000 places de prison) et de pouvoir d'achat (−8,5) et le suramortissement industriel (−6,7). Les recettes nouvelles et économies totalisent 68 [38 ; 106] Md€, mais la plupart sont des économies annoncées dont une part est limitée par le droit ; la borne haute de chaque économie est l'annonce elle-même. Le programme de retraite détaillé est annoncé pour le 17 novembre 2026 et n'est pas encore chiffré.[^rn]

### Notre système

Il n'a pas de liste de dépenses nouvelles, et remplace des prélèvements par des règles. Le niveau des leviers votés pour stabiliser la dette est de 33,3 Md€ par an en régime ; la fonction du patrimoine rapporte 62,5 Md€ nets de comportement en 2038 (dont une partie est différée jusqu'à la vente ou à la succession), la fonction des revenus 1,4 Md€ au-delà de la base, le crédit d'IS 9,3 Md€, les transmissions 8,9 Md€ et la courbe des pensions élevées 9 Md€. L'effet total sur le solde par rapport au droit actuel est de 114 [64 ; 167] Md€ en 2038.[^banc] Ce chiffre ne contient pas tout ce que nous proposons : le capital de départ (de l'ordre de 9 à 15 Md€ par an selon sa forme) a été retiré de la trajectoire et n'y est pas encore remis, et quelques lignes nouvelles (formation des rénovateurs, installation agricole, repas, environ 2,6 Md€) n'y sont pas. Le chapitre 12 en donne la liste. Un programme concurrent pourrait nous faire le reproche que nous faisons aux autres : des mesures annoncées sans être comptées.

### Édouard Philippe (Horizons)

Aucun document chiffré d'ensemble n'est publié à notre connaissance. Nous donnons ce qui est annoncé, sans le chiffrer à la place de ses auteurs : un pacte fiscal de 50 Md€ de baisses d'impôts de production contre 50 Md€ de réduction d'aides, une cible de déficit de 2 % du PIB à la fin du quinquennat, un budget alternatif de 10 Md€ d'économies supplémentaires pour 2027, un non-remplacement d'un fonctionnaire sur trois (environ 250 000 postes sur cinq ans), un âge légal de 65 ans avec 45 annuités en moins de dix ans, un fonds d'adaptation climatique de 2 Md€ par an, et plusieurs dépenses nouvelles (allocation familiale unique de 350 € dès le premier enfant, exonération de cotisations sur deux heures supplémentaires par semaine) publiées sans coût.[^philippe]

Deux ordres de grandeur se calculent à partir de données publiques. Ils ne passent pas par le banc : ils n'ont ni intervalle, ni filtre juridique, ni lecture avec un taux qui suit la dette, et ils ne se comparent donc pas aux colonnes du tableau ; c'est le second écart de méthode de ce chapitre. Le non-remplacement de 250 000 postes représenterait environ 15,7 Md€ par an en régime, si chaque poste coûte la masse salariale publique moyenne (370 Md€ pour 5,9 millions d'agents, environ 63 000 € par agent), avant coûts de transition. Notre propre chiffrage valorise le même levier moins cher, environ 43 000 € par poste (7,05 Md€ pour 163 000 postes, chapitre 12), soit environ 10,8 Md€ pour 250 000 postes : nous donnons les deux, parce que nous n'avons pas encore établi lequel des deux coûts par poste est le bon, et qu'il serait injuste d'en appliquer un à nous et l'autre aux autres. Et atteindre un déficit de 2 % du PIB en 2032 supposerait environ 145 Md€ par an d'effort par rapport au droit actuel, avec une dette de 121 % du PIB en 2032 et de 113 % en 2038, à taux fixe. Ce second chiffre n'est pas le chiffrage de leur programme : c'est ce que leur cible, si elle était tenue, supposerait. Quand un document chiffré paraîtra, le programme entrera dans le banc avec la même méthode.

## Comment chaque poste est chiffré

Chaque ligne d'un programme est chiffrée par un modèle ou par une règle écrite. Une page de détail par programme le montre poste par poste : la mesure dans les mots du parti, ce qu'il annonce, notre estimation et son intervalle, la façon de la calculer, le modèle utilisé, sa fiabilité et les choix posés par l'IA. La règle est la même pour tous : quand deux programmes proposent des mesures qui se ressemblent, elles passent par le même modèle, avec les mêmes paramètres, et seul change ce qui distingue les deux mesures.

Trois exemples. La retraite à 60 ans de La France insoumise et le retour à 62 ans du Rassemblement national passent par le même modèle des retraites, avec les mêmes données ; seul diffère l'âge effectif moyen de départ que produit chaque réforme (61,5 ans au central pour l'une, 62,8 pour l'autre), d'où −55 et −24 Md€ par an. Notre propre réforme des retraites reprend le même comportement de départ, mais par le branchement de notre modèle. L'ISF rétabli de La France insoumise, l'impôt sur la fortune financière du Rassemblement national et l'impôt minimal du PS passent par le même module des grandes fortunes, avec la même érosion de l'assiette (20 / 35 / 55 % pour un point d'impôt, selon le scénario) ; les successions de La France insoumise et les nôtres, par la même fonction des transmissions. Le Smic à 1 700 € net de La France insoumise et celui du PS utilisent le même levier et les mêmes paramètres, sauf la hausse elle-même.

Le traitement n'est pas partout le même, et nous le disons. Les économies annoncées par le Rassemblement national, Les Républicains et le PS passent par un filtre de faisabilité (le plafond est l'annonce, la médiane notre jugement) qui ne s'applique ni aux recettes de La France insoumise, ramenées par une convention, ni à nos propres économies. Nos leviers votés (33,3 Md€ par an) sont réglés pour stabiliser notre dette ; aucun autre programme n'a ce réglage. Notre fonction du patrimoine n'est pas le module appliqué à l'ISF des autres, et son érosion au sommet est plus forte (20 / 40 / 74 %). Le non-remplacement des départs est valorisé plus cher par poste chez nous que dans le plan des Républicains, ce qui avantage nos économies. Les baisses de TVA du Rassemblement national sont comptées à leur montant, alors que notre modèle a une fonction de TVA qui aurait pu les chiffrer. Le régime est atteint en 2032 pour les autres et en 2038 pour nous, et le taux d'intérêt est fixe dans le tableau principal, pour tous. Édouard Philippe reste hors du banc.

Le détail est dans les pages de [La France insoumise](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-lfi.html), du [Rassemblement national](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-rn.html), des [Républicains](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-lr.html), du [PS et de Place publique](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-ps.html) et de [notre système](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/detail-langagement.html). La liste complète des écarts de méthode, avec leur effet quand il se calcule et ce qu'il faudrait faire pour les lever, est dans [les mêmes modèles pour tous](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/memes-modeles.html).

---

## Les cartes de convergences

Pour chaque programme, nous avons dressé une carte, sujet par sujet, de ce qui nous rapproche et de ce qui nous sépare, en quatre catégories : accord, rapprochement (à peu près la même chose), même fond avec une méthode différente, et divergence nette ou absence de position équivalente (l'absence d'une mesure n'est pas une opposition).

| Programme | Lignes | Accord | Rapprochement | Même fond, méthode différente | Divergence ou absence |
|---|---|---|---|---|---|
| La France insoumise | 61 | 0 | 13 | 29 | 19 |
| Rassemblement national | 37 | 0 | 5 | 13 | 19 |
| Édouard Philippe (Horizons) | 15 | 0 | 1 | 5 | 9 |

Nous ne classons aucun sujet en accord strict : à ce niveau de détail, deux textes ne disent jamais exactement la même chose. Avec La France insoumise, les rapprochements portent sur la fiscalité du capital et des successions, le remboursement des soins, le plancher de revenu, l'indépendance de la justice et le contrôle de la police. Avec le Rassemblement national, sur le recouvrement unique, le remboursement des soins et la place du référendum. Avec Édouard Philippe, sur la règle d'équilibre budgétaire. Les convergences de diagnostic sont partout les mêmes : la dette de plus de 115 % du PIB, le déficit au-dessus de 5 % et la charge d'intérêts.

Le détail, ligne à ligne, est dans les trois dossiers.[^lfi][^rn][^philippe] Les cartes ont une limite : elles ne lisent que les documents cités et ne disent rien de ce que les textes ne traitent pas.

---

## Ce que nos propres chiffres ont de fragile

Nous avons passé notre système par le même banc que les autres. Voici ce que cela révèle sur lui, et que nous préférons dire avant qu'on nous le dise.

La stabilisation de la dette ne tient pas toute seule. Dans nos 10 000 tirages, la dette ne remonte pas après son pic de 2038 dans 52 % des cas, et reste à moins d'un point près de ce pic dans 65 % des cas. Avec les hypothèses de macro prudentes, la proportion tombe à 22 %. Dans les autres cas, c'est la clause de votation qui doit se déclencher : si la dette dérive de plus de deux points de PIB, les citoyens votent un ajustement chiffré d'avance. Notre banc suppose la clause tenue ; il ne dit pas que les citoyens la voteront. Dans un cas sur deux environ, la stabilisation repose donc sur un vote qui n'a pas eu lieu.

L'intervalle de notre système est sous-estimé. Le banc fait varier 30 modules, mais le socle hérité des architectures précédentes, les corrections du grand livre et l'impôt de suite sont fixés à leur valeur centrale. Les scénarios d'ensemble du modèle (bas et haut) donnent un solde primaire de 2038 de −214 à 203 Md€ pour un central de 9 : le socle non propagé pèse potentiellement davantage que tous les modules propagés.[^banc]

Le report d'encaissement de douze ans était compté deux fois dans la trajectoire : une fois dans la couche héritée de l'architecture v5 (deux termes, 13,5 et 11,5 Md€ par an), une fois dans la fonction du patrimoine actuelle (12,4 Md€ par an). Il en résultait un saut de 25 Md€ du solde entre 2040 et 2041. Nous l'avons corrigé le 08/11/2026 (V32012, V32018) : les deux termes hérités sont retirés, il ne reste que celui de la fonction du patrimoine, écrit comme un stock qui se rembourse de 1/12 par an. Les leviers nécessaires pour la même règle de dette passent de 52,8 à 33,3 Md€, la dette de 2058 de 113 à 125 % dans la valeur centrale du modèle (la baisse d'avant venait du saut), et le saut disparaît. Cette écriture étalée est une hypothèse de modélisation : avec une durée fixe de douze ans, il resterait un saut de 12 Md€ en 2041 et les leviers seraient de 40,1 Md€.[^banc]

Le taux d'intérêt fixe nous flatte autant que les autres. Avec un taux qui part du niveau de novembre 2026 et monte avec la dette, notre système entre en zone de crise avant 2058 dans deux tirages sur trois si rien n'est ajouté, et il lui manque environ 40 Md€ par an (section sur la dette de 200 à 500 % du PIB).[^taux]

Enfin, pour notre système comme pour les autres, le tableau donne une médiane de 10 000 tirages et son intervalle à 80 % (131 % en 2038, 122 % en 2058). Notre modèle donne aussi une valeur centrale (130,4 % et 124,6 %), que nous nommons comme telle quand nous la citons. Comme notre intervalle est sous-estimé (plus haut), les chiffres ne se comparent pas au point près.

## Les meilleurs arguments en faveur des autres programmes

Nous les formulons comme leurs partisans les formulent.

Pour La France insoumise, la dépense de santé, de logement et de retraite répond à des besoins mesurés ; l'impôt sur les très grandes fortunes est défendu par des économistes dont les travaux sont publiés (la garantie d'impôt de 2 % sur les patrimoines au-dessus de 100 M€ est la proposition de Gabriel Zucman) ; une relance par la dépense peut avoir des multiplicateurs plus forts qu'à l'ordinaire quand les ressources sont inemployées, ce que notre banc retient en partie (multiplicateur de 0,3 à 1,5 selon les tirages) ; et une dette publique n'est pas seulement un passif, elle finance des actifs (rénovation, infrastructures) dont la valeur n'apparaît pas dans le ratio de dette.[^lfi]

Pour le Rassemblement national, le diagnostic de départ est exact et publié ligne à ligne, ce qui est plus précis que beaucoup de programmes ; supprimer les impôts de production est présenté comme la baisse la moins pénalisante pour l'industrie ; la contribution de la France au budget de l'Union est élevée et en hausse, et le droit de veto de la règle d'unanimité donne un levier de négociation ; une partie des économies sur les agences, l'aide au développement et les subventions est réalisable, et même le Sénat chiffre des économies sur les opérateurs.[^rn]

Pour Édouard Philippe, la cible de 2 % du PIB est la plus basse des programmes lus et répond à la charge d'intérêts ; travailler plus longtemps reste la voie la mieux documentée pour équilibrer les retraites sans hausse de cotisations ; le non-remplacement des départs permet de réduire les effectifs sans licenciement ; baisser les impôts de production en réduisant les aides est défendu de longue date par les économistes de l'offre.[^philippe]

## La meilleure objection

L'objection la plus forte à ce chapitre est que le banc est notre outil et qu'il juge nos concurrents. Un système de mesure construit par un candidat peut être biaisé, même sans mauvaise foi, par des choix de modélisation invisibles : la façon de lire les scénarios, les facteurs de corrélation, ce qu'on laisse hors du total. Nous répondons par la transparence : toutes les hypothèses sont numérotées, sourcées et cotées, le code est ouvert, notre propre système passe par le même chemin que les autres, la variante moins sévère montre que les conclusions ne tiennent pas à une hypothèse particulière, et les cartes de convergences disent ce que chaque programme fait de mieux que nous. Nous ne pouvons pas supprimer le conflit d'intérêts ; nous pouvons le déclarer et inviter chacun à refaire le calcul, avec d'autres hypothèses, sur les mêmes données.

La seconde objection est qu'on ne juge pas un programme à ses chiffres seuls. C'est exact : les chiffres ne disent rien de la justice d'une mesure, de ce qu'un peuple est prêt à accepter, ni de ce qu'un programme change dans la vie des gens. Notre comparaison répond à une seule question, celle de la cohérence entre les promesses et la dette. Les autres questions appartiennent aux électeurs.

## État de la recherche

Ce que les études établissent. Les multiplicateurs budgétaires dépendent fortement du moment et du type de mesure : pour les dépenses, la plupart des estimations se situent entre 0,6 et 1 selon Valerie Ramey, avec des circonstances où ils sortent de cette plage ; les multiplicateurs de recettes sont plus incertains.[^ramey] Les départs de grands patrimoines en réponse à un impôt sur la fortune sont réels mais modestes quand on regarde des résidents établis (réformes scandinaves, redevables de l'ISF en France), plus forts pour les profils mobiles (étrangers au Danemark, entrepreneurs, personnes âgées pour les successions).[^exil] Une dette élevée n'a pas de seuil critique unique : la littérature sur le sujet a dû revoir un seuil de 90 % qui avait été avancé (Reinhart et Rogoff, corrigé par Herndon, Ash et Pollin ; ⚠️ cités de mémoire, non relus pour ce chapitre, V32102).

Ce qui est débattu. Le niveau du multiplicateur de relance, qui change fortement les résultats de La France insoumise. L'ampleur de l'exil sous un impôt national à des taux élevés, que aucune étude ne mesure directement. La capacité d'un pays de la zone euro à tenir une dette très élevée, que le précédent japonais éclaire seulement en partie.

Ce qui manque. Un programme chiffré d'Édouard Philippe, pour le mettre dans le banc. Une relecture indépendante de nos hypothèses par des économistes qui n'appartiennent pas au projet. Les effets d'offre propres à chaque mesure (suppression des impôts de production, par exemple), que notre banc remplace par un effet commun. Les programmes de partis qui n'ont pas publié de contre-budget.

## Synthèse des sources mobilisées

- Banc d'essai du dépôt (`modeles/banc-programmes/`, cote B, estimations de Claude) : 10 000 tirages, chaîne dette commune, test de validité sur notre propre modèle. Écrit avec une IA : exposé à la complaisance, conflit d'intérêts déclaré.
- Dossiers de chiffrage de La France insoumise, du Rassemblement national et d'Édouard Philippe (cotes C à D pour les programmes eux-mêmes, qui sont des documents de campagne ; B pour nos recalculs).
- Insee, comptes nationaux (cote A) : dette et déficit de départ.
- FMI, examen 2026 de l'article IV pour le Japon (cote A) : dette et situation budgétaire du Japon.
- MES, page sur la restructuration de mars 2012 (cote B) ; BCE, communiqué du 21 juillet 2022 sur l'instrument de protection de la transmission (cote A).
- Littérature sur l'exil et les multiplicateurs : France Stratégie 2023, NBER 32153, Brülhart et al., CAE n° 69, Ramey (cotes A à B).

## Notes

[^banc]: `modeles/banc-programmes/resultats.md` (08/11/2026, généré par `python3 -I modeles/banc-programmes/relancer.py`), § 1 (tableau), § 4 (test de validité : 130,35 % en 2038 et 124,60 % en 2058 retrouvés, après correction du double compte du report d'encaissement), § 6 ter (notre système), § 9 (limites) ; dette de départ 3 460,5 Md€ fin 2025 (Insee). Cote B, estimations ; intervalle de notre système sous-estimé (V32019). Écrit par Claude (Anthropic) ; l'auteur est partie prenante : conflit d'intérêts déclaré.
[^decompo]: `sources/decomposition-prelevements-0811.md` (08/11/2026) : identité comptable des prélèvements, 42,7 % à 51,6 % du PIB en mesure officielle et +3,1 points une fois les versements retranchés. Cote B. (Le banc, avec sa propre convention de rampe, écrit 52,2 % dans sa section sur la relance : ce n'est pas le même calcul.)
[^variante]: `sources/banc-variante-moins-severe.md` (08/11/2026) et `modeles/banc-programmes/resultats.md` § 10. Cote B ; les triplets d'hypothèses sont des choix de Claude entre des ancrages publiés (⚠️ V32100).
[^exil]: `sources/exil-patrimoines-preuves.md` (03/11/2026) : France Stratégie, rapport final du comité d'évaluation des réformes de la fiscalité du capital, octobre 2023 (cote A) ; Jakobsen, Kleven, Kolsrud, Landais, Muñoz, NBER w32153 (rév. 01/2026), https://www.nber.org/papers/w32153 (cote A) ; Brülhart, Gruber, Krapf, Schmidheiny, *American Economic Journal: Economic Policy* 14(4), 2022 (cote A) ; CAE, note n° 69, https://cae-eco.fr/static/pdf/cae-note069.pdf (cote B). Les travaux de Pichet et du Conseil des prélèvements obligatoires n'ont pas été relus pour ce chapitre (⚠️ V32100).
[^dette]: Formule du déficit stabilisant d × g / (1 + g) et excédent primaire d × (r − g) / (1 + g) : `sources/chiffrage-dette-stable-retraites-masse-salariale.md` § 1 (05/11/2026). Les tableaux de ce chapitre sont un calcul de Claude, reproductible à la main avec g = 3 % et r = 3,45 %, 5 % et 7 %. Cote B.
[^japon]: FMI, « IMF Executive Board Concludes 2026 Article IV Consultation with Japan », communiqué du 02/04/2026, https://www.imf.org/en/news/articles/2026/04/02/pr-26105-japan-imf-executive-board-concludes-2026-article-iv-consult ; table 1 : dette publique brute de 214,5 % du PIB en 2024, 206,8 % en 2025 et 193,1 % en 2031 ; consulté le 08/11/2026 (page lue par un résumé automatique). Cote A. Aucun conflit d'intérêts connu.
[^japonbis]: Part de la Banque du Japon : 46,0 % de la dette publique totale fin mars 2025, d'après les données de la Banque du Japon reprises par l'agence de presse financière MNI ; part étrangère : 11,9 % fin décembre 2024, d'après le ministère japonais des Finances ; lus par résumé de moteur de recherche le 09/11/2026, ⚠️ source primaire à ouvrir (comptes financiers de la Banque du Japon, statistiques du ministère des Finances). Le chiffre de 43 % (mars 2022, Wikipédia) cité dans une version précédente était périmé et n'est plus repris. Part étrangère d'environ 12 % aussi chez AMRO (Bureau de recherche macroéconomique de l'ASEAN+3), https://amro-asia.org/living-with-high-debt-in-japan-why-market-valuation-matters, extrait lu par moteur de recherche, ⚠️ non relu. Cote C pour la presse, B pour AMRO. V32102.
[^bce]: Banque centrale européenne, communiqué du 21/07/2022 sur l'instrument de protection de la transmission, https://www.ecb.europa.eu/press/pr/date/2022/html/ecb.pr220721~973e6e7273.en.html ; critères d'éligibilité lus par un résumé automatique de la page ; consulté le 08/11/2026. Cote A. Aucun conflit d'intérêts connu ; la lecture « une dette croissante de 200 % ne répondrait vraisemblablement pas au critère » est de Claude.
[^grece]: Wikipédia, « Greek government-debt crisis », https://en.wikipedia.org/wiki/Greek_government-debt_crisis ; consulté le 08/11/2026 (premier tiers de la page lu) : dette de 109 % du PIB en 2008 et 146 % en 2010, prêt de 110 Md€ du 02/05/2010, projection de la Commission d'octobre 2011 à 198 % pour 2012 sans restructuration. Cote C à D, ⚠️ à reprendre dans les sources primaires (Eurostat, Commission), V32102. Wikipédia est ici une exception à notre règle « sources primaires d'abord » : c'est la seule source lue pour ces chiffres à la rédaction, et nous la signalons comme telle plutôt que de la masquer ; seule la restructuration de 2012 est lue dans une source institutionnelle (note suivante).
[^esm]: Mécanisme européen de stabilité, « What was the private sector debt restructuring of March 2012? », https://www.esm.europa.eu/content/what-was-private-sector-debt-restructuring-march-2012 ; consulté le 08/11/2026 : environ 97 % des obligations détenues par des créanciers privés, soit environ 197 Md€, décote nominale de 53,5 %, environ 107 Md€ de réduction de dette. Cote B. Le MES est un créancier de la Grèce : conflit d'intérêts possible dans la présentation.
[^lfi]: `sources/chiffrage-programme-lfi-2027.md` (08/11/2026), § 6 (détail par mesure), § 7 (carte des convergences, 61 lignes), § 8 (steelman) ; `modeles/banc-programmes/resultats.md` § 5 bis et § 6. Cote C à D pour les documents du programme (auteur = le programme) ; B pour nos recalculs.
[^rn]: `sources/chiffrage-programme-rn-2027.md` (08/11/2026), § 3 (résultats), § 6 (carte des convergences, 37 lignes), § 7 (steelman) ; contre-budget du Rassemblement national du 06/10/2026 (cote D, auteur = le programme) ; Institut de l'Entreprise, note du 06/10/2026 (cote C, financé par des entreprises, méthode publiée). B pour nos recalculs.
[^philippe]: `sources/chiffrage-programme-philippe-2027.md` (08/11/2026) : Euronews, 09/10/2026, https://fr.euronews.com/2026/10/09/presidentielle-2027-edouard-philippe-mise-sur-le-travail-et-la-reduction-des-depenses-publ ; Public Sénat, 29/09/2026 ; Moneyvox, 13/10/2026 ; dettedelafrance.fr (outil tiers). Cote C à D ; consultés le 08/11/2026 par résumés automatiques de pages ; la page officielle du candidat n'a pas été lue (⚠️ V32101). Aucun document chiffré d'ensemble publié à notre connaissance.
[^taux]: Modèle du taux qui suit la dette, [page du modèle](https://langagement-politique.vercel.app/fr/modeles/taux-endogene/) (résultats du 09/11/2026, mêmes 10 000 tirages que le banc), § 2 : taux de départ 4,7 % (taux allemand de 3,4 % plus une prime de 1,3 point, calés sur septembre et octobre 2026) ; prime fonction de la dette (2 points de base par point), du déficit et convexe au-delà de 130 % ; zone de crise : prime au-delà de 3 points. Dette 2058 à 4,7 % fixe : 617,5 / 349,2 / 169,3 / 306,1 % ; tirages en crise avant 2038 : 100 / 98 / 2 / 100 % ; avant 2058 : 100 / 100 / 67 / 100 % ; notre dette 2038 : 145,9 % [130,8 ; 161,3] ; effort supplémentaire stabilisant : > 400 / 184 / 40 / 150 Md€ par an (La France insoumise, Rassemblement national, notre système, fil de l'eau). Cote B, estimations sous hypothèses. Conflit d'intérêts : le même modèle, écrit par Claude (Anthropic) pour l'auteur, chiffre notre système et ses concurrents.
[^ramey]: Valerie Ramey, « Ten Years after the Financial Crisis: What Have We Learned from the Renaissance in Fiscal Research? », *Journal of Economic Perspectives* 33(2), 2019, p. 89-114, https://www.aeaweb.org/doi/10.1257/jep.33.2.89 ; consulté le 08/11/2026 (résumé seulement). Cote A. Aucun conflit d'intérêts connu.
