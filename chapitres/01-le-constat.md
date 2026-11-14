---
titre: "Le constat"
statut: brouillon
version: 0.2
modele: DECISIONS0811
---

# 1. Le constat

> Deux liens d'intérêts, à lire avant le reste. Ce chapitre est coécrit par une intelligence artificielle, Claude, d'Anthropic, entreprise qui vend des modèles d'IA : sur la question « l'IA change-t-elle tout ? », cela pousse à surestimer. L'auteur dirige une jeune entreprise de logiciels, et reconnaît un biais favorable à la technologie. Nous avons donc mis au même niveau les chiffres qui vont dans notre sens et ceux qui le contredisent. Nous décrivons des systèmes, pas des personnes : agents publics, comptables, gestionnaires de paie et travailleurs sociaux rendent un service réel, c'est la règle qui crée le besoin.

## L'essentiel

### Ce que nous voulons

Un pays où chacun peut comprendre les règles qui s'appliquent à lui, et où personne ne paie plus cher parce qu'il n'a pas les moyens de les contourner. Un État qui connaît ses dépenses, les publie, et protège ceux que la complexité écarte de leurs droits aujourd'hui.

### Ce que nous constatons

- Le droit s'est empilé : 165 656 articles en vigueur dans 78 codes. Personne ne peut le lire en entier, et ceux qui le peuvent le font payer.
- Les impôts, cotisations et taxes forment 314 prélèvements distincts et 465 niches fiscales, que l'État ne sait chiffrer qu'en partie. Qui peut payer un conseil les utilise, les autres les subissent.
- Beaucoup de personnes n'obtiennent pas ce qui leur est dû : environ un foyer éligible sur deux ne demande pas la prime d'activité, un sur trois ne demande pas le RSA.
- Une industrie de la complexité vit de cet empilement : de 25 à 57 milliards d'euros par an selon nos hypothèses (41 en référence, 1,4 % du PIB). Ce coût pèse sur les entreprises et les ménages, il n'enrichit pas l'État. Les personnes qui y travaillent ne sont pas en cause : c'est le système qui produit ce travail.
- L'État a été organisé avant l'informatique. Il ne connaît pas sa dépense numérique, la France est 22e sur 27 pour les services publics en ligne, et 2 776 organismes publics sont recensés, dont un tiers seulement a un budget lisible.
- Trois pressions arrivent en même temps : une dette de 115,7 % du PIB fin 2025 (157 % en 2038 sans changement), une population qui vieillit (2,5 personnes de 20 à 64 ans pour une de 65 ans ou plus aujourd'hui, 1,6 en 2070), et l'IA, dont les effets mesurés restent faibles. Sur ce dernier point, notre système est un pari, et nous disons comment il pourrait être faux.

### Ce que nous changeons, et pourquoi

| Aujourd'hui | Demain | Pourquoi |
|---|---|---|
| 314 prélèvements, 465 niches | Quelques règles écrites en une ligne chacune | Ce qui se lit se contrôle, et ne profite plus aux seuls initiés |
| Des aides qu'il faut aller chercher | Des montants calculés et versés automatiquement | Un droit que l'on ne demande pas n'est pas un droit |
| 2 776 organismes, un tiers au budget lisible | Un registre public de chaque euro dépensé et de chaque organisme réévalué | On ne juge que ce que l'on voit |
| Un État qui ne chiffre pas son numérique | Des outils communs, conçus une fois pour tout le pays | Une seule bonne application vaut mieux que mille demi-solutions |
| Une dette qui grossit | Une trajectoire votée à l'avance, avec une clause qui oblige à voter si la croissance déçoit | Ne pas laisser la charge aux plus jeunes |

### Ce que cela change pour vous

- Si vous avez un petit revenu ou une famille modeste : vous n'aurez plus à courir après des aides dispersées, elles viendront d'un seul calcul.
- Si vous gérez une petite entreprise ou une association : moins d'heures passées à remplir et à vérifier, plus à travailler.
- Si vous contribuez beaucoup : vous savez à quoi sert chaque euro, et les montages dont profitaient les mieux conseillés disparaissent.

### Ce que cela coûte ou rapporte

Ce chapitre ne propose pas de mesure chiffrée, il pose le constat. Les mesures et leur financement sont aux chapitres 3 à 12, et le bilan d'ensemble au chapitre 12.

---

## 1. Un droit que personne ne peut lire

Le droit fiscal et social français s'est construit par couches, réforme après réforme, chaque exception répondant à une demande ou corrigeant une injustice. Le résultat est un système que l'État lui-même peine à décrire.

Le texte en vigueur de 78 codes compte 165 656 articles. Dans les seuls codes fiscaux, douaniers et sociaux que nous avons lus, on en dénombre 16 282, dont 7 429 pour la Sécurité sociale et 2 407 pour le code général des impôts.[^droit] L'inventaire du projet recense 314 prélèvements distincts : impôts, taxes, cotisations. Les dépenses fiscales, c'est-à-dire les exceptions qui réduisent l'impôt de celui qui coche la bonne case, sont 465 dans le budget 2026, pour un coût de 88,3 milliards d'euros. Leur chiffrage est fragile : 124 ne sont chiffrées qu'en « ordre de grandeur » et 88 sont déclarées non chiffrables.[^niches]

Les règles se contredisent parfois sans que personne l'ait voulu. Nous avons simulé, avec l'outil public OpenFisca, quatorze foyers types, dont treize dans trois zones de loyer (le quatorzième, logé gratuitement, ne dépend pas de la zone), soit 40 simulations par pas de 50 € de salaire : dans 34 simulations sur 40, il existe au moins un pas où gagner 50 € de plus fait perdre de l'argent. Pour un locataire qui sort du RSA, ce pas peut coûter deux à trois fois le gain de salaire.[^atlas] Ces cas types ne mesurent pas une population, mais ils montrent ce que personne ne voit en lisant les règles une à une. Un programme de lecture automatique a aussi repéré des centaines d'anomalies : renvois vers des articles disparus, montants restés en francs, seuils qui font payer 500 € pour un euro de plus. Aucune n'a encore été relue par un juriste, et la machine se trompe aussi : sur un échantillon de 43 détections relues, les renvois morts de haute confiance étaient exacts 15 fois sur 15, mais d'autres catégories une fois sur quatre seulement.[^anomalies]

Rien de tout cela ne vient d'agents incompétents. C'est le produit d'un système qui n'a jamais été conçu comme un tout, et qu'aucun outil ne permettait de voir en entier. Aujourd'hui, on peut écrire la loi comme du code, la tester et mesurer ses effets avant de la voter.

## 2. Ceux qui savent, ceux qui ne savent pas

Cette complexité a un premier coût, humain. Savoir à quoi l'on a droit est devenu un métier : les travailleurs sociaux passent une part importante de leur temps à décortiquer le système pour ceux qu'ils aident (c'est un témoignage, pas une mesure). Le service statistique du ministère des Solidarités a croisé les données fiscales et celles des caisses pour estimer qui ne touche pas ce à quoi il a droit. Fin 2021 :[^drees]

| Prestation | Foyers éligibles qui ne la demandent pas | Non versé |
|---|---|---|
| RSA | 33 à 37 %, environ 560 000 foyers | 630 M€ par trimestre |
| Prime d'activité | 48 à 52 %, environ 3,4 millions de foyers | 1,3 Md€ par trimestre |

On entend souvent que la France est trop généreuse. Ces chiffres montrent qu'une partie de la générosité affichée n'arrive jamais à destination, parce que le chemin pour y accéder est trop compliqué. Il s'ensuit un problème de justice (ceux qui savent obtiennent, ceux qui ne savent pas renoncent) et un problème de sincérité budgétaire (on vote des droits en sachant qu'une partie ne sera pas réclamée). Les non-recourants au RSA sont plus souvent propriétaires, diplômés ou proches de l'emploi : ils renoncent quand le coût d'accès, en temps, en compréhension ou en gêne, dépasse le gain perçu.[^drees]

Il y a une bonne nouvelle. Depuis mars 2025, les déclarations trimestrielles du RSA et de la prime d'activité sont préremplies pour environ 6,4 millions d'allocataires, et 96 % d'entre elles ont été validées sans modification en janvier 2026.[^cnaf] Quand l'État utilise les données qu'il possède déjà, cela fonctionne. Mais le droit reste à demander : le préremplissage n'est pas un versement automatique.

La complexité profite aussi à ceux qui peuvent la manier. Deux familles qui possèdent la même chose paient des sommes différentes selon qu'elles ont ou non monté, en toute légalité, donations échelonnées, démembrements ou pactes de transmission. Les régimes de faveur sur les transmissions coûteraient de 10 à 14 milliards d'euros par an par rapport au droit commun, un majorant fondé sur des données anciennes.[^t6] Parmi les dépenses fiscales liées à l'impôt sur le revenu, 79 ont une finalité d'orientation (dons, investissement locatif, outre-mer, capital de PME, emploi à domicile), pour 21,9 milliards d'euros. Elles ont souvent de bonnes raisons d'être, mais elles donnent à ceux qui paient beaucoup d'impôt le pouvoir de décider où va une partie de l'argent public.[^niches] Nous ne reprochons rien à ceux qui appliquent la loi. Nous constatons que la règle récompense le savoir plus que l'utilité.

> **Pour aller plus loin — ce que l'on sait des remèdes au non-recours**
>
> Contacter les ayants droit fonctionne : un essai randomisé belge auprès de 55 407 ménages à bas revenus a montré qu'un simple courrier augmentait le recours à un remboursement majoré des soins de 10 à 15 points.[^vangestel] C'est la seule preuve causale que nous ayons trouvée, et elle porte sur l'information, pas sur le versement automatique. En France, 39 territoires « zéro non-recours » existent depuis 2023, sans mesure chiffrée d'efficacité à ce jour. Aucune étude causale du versement automatique n'a été trouvée (Finlande, Norvège). Nous ne pouvons donc pas écrire « tel pays a montré que ». Notre proposition (chapitres 3 et 4) supprime le non-recours par construction pour la part versée sans condition, et s'appuie, pour le reste, sur des données déjà connues de l'administration.[^recherche-allocation]

## 3. L'industrie de la complexité

Quand une règle est complexe, quelqu'un est payé pour la comprendre à la place des autres. Additionnez ces métiers : vous obtenez ce que nous appelons l'industrie de la complexité, une activité dont la valeur tient moins à ce qu'elle produit qu'à la difficulté des règles qu'elle aide à traverser. L'économiste Mariana Mazzucato parle d'extraction de valeur : capter une part de la richesse sans en créer.[^mazzucato] La frontière entre extraction et création est discutée, et la plupart des économistes tiennent qu'un service librement payé crée de la valeur. Nous employons ces mots comme une question à poser aux règles, pas comme un verdict sur les personnes. Les comptables, gestionnaires de paie et fiscalistes font un travail réel et difficile. Changez les règles, et une partie de ce travail devient inutile ; les compétences, elles, restent précieuses.

Quelques faits tirés de sources primaires :[^t6]

- Les activités comptables emploient 221 053 personnes en 2024 pour 28,0 milliards d'euros de chiffre d'affaires, en hausse de 27 % depuis 2021.
- Le crédit d'impôt recherche coûte 8,0 milliards d'euros en 2026. Selon l'Inspection générale des finances (2010), les entreprises qui passent par un cabinet de conseil lui versent en moyenne 20 % du crédit obtenu, et 20 à 30 % pour les PME ; comme une entreprise sur quatre seulement y recourt, surtout parmi les petites, les cabinets touchent au total de l'ordre de 5 % du crédit. Une partie de l'argent public destiné à la recherche rémunère la maîtrise du dossier.
- La conformité fiscale et sociale d'une PME type prend 139 heures par an, dont 80 pour les cotisations sociales (Banque mondiale, dernière mesure disponible, 2020).

Notre modèle additionne trois blocs, le marché externe (cabinets, éditeurs, conseil), le travail interne des entreprises et le temps des ménages.

| Coût annuel de la complexité fiscale et sociale | Hypothèse prudente | De référence | Favorable |
|---|---|---|---|
| Milliards d'euros | 25 | 41 | 57 |
| Part du PIB | 0,9 % | 1,4 % | 1,9 % |
| Équivalents emplois | 268 000 | 435 000 | 602 000 |
| Dont ce qui disparaîtrait avec des règles simples (Md€) | 10 | 24 | 45 |

Nous donnons partout trois hypothèses. Celle de référence n'est ni une moyenne ni une médiane : c'est le jeu d'hypothèses que nous jugeons le plus probable. Ici, « favorable » désigne le cas où la simplification libère le plus. Et 435 000 équivalents emplois ne désignent pas 435 000 personnes à plein temps. Le travail interne des entreprises, par exemple, en représente environ 300 000 : c'est un quart du temps de 1,2 million de personnes des services comptables et administratifs.

Deux précisions pour ne pas surestimer ce chiffre. Il mesure un coût pour les entreprises et les ménages, pas une économie budgétaire : l'État se prélève à bon compte (0,60 € pour 100 € prélevés), et le coût pèse presque entièrement sur les entreprises : le temps des ménages n'en représente qu'environ 1 milliard. Nous ne disons donc jamais que le système se finance par les économies (chapitre 12). Et le gain n'existe réellement que si les personnes libérées retrouvent un emploi utile : en référence, la production nouvelle serait de l'ordre de 12 milliards d'euros par an, et les recettes publiques qui en découlent de 4 milliards.[^reorientation] Les fourchettes sont larges : le bloc interne aux entreprises, le moins bien mesuré, pèse plus de la moitié du total. Une étude pour la Commission européenne (VVA et KPMG) donne 31 à 38 milliards pour la conformité des PME françaises, contre 38,5 dans notre hypothèse de référence sur le même périmètre.[^t6]

La complexité pèse d'abord sur les petits. Selon la Commission européenne, la conformité à la TVA coûterait 2,6 % du chiffre d'affaires d'une PME contre 0,02 % pour une grande entreprise (⚠️ À VÉRIFIER, V14001).[^t6] Il y a un dernier coût, qui ne se mesure pas : quand optimiser rapporte plus que créer, des personnes brillantes choisissent d'optimiser. Nous n'avons trouvé aucun chiffre français sur ce coût d'opportunité ; nous le signalons comme une hypothèse.

Notre principe est de ne perdre personne. Étalée sur dix ans, la transition déplace environ 16 000 personnes dans notre hypothèse de référence, la plupart des départs étant absorbés par les retraites ; en quatre ans, plus de 100 000. Le rythme décide de tout (chapitre 13).[^reorientation]

## 4. Un État conçu avant l'informatique

Le titre n'est pas une image. L'État a été organisé avant l'informatique, puis l'informatique a été ajoutée par-dessus, projet par projet, ministère par ministère, sans que l'ensemble soit revu.

Il ne connaît pas sa dépense. La Cour des comptes l'estime à environ 5,5 milliards d'euros en 2025 pour l'État seul, soit environ 1 % de ses dépenses brutes, et relève qu'elle n'est « pas encore consolidée, malgré les multiples alertes sur ce sujet depuis 2016 ».[^cour2026] Personne ne connaît le coût consolidé des systèmes de la Sécurité sociale, des collectivités et des hôpitaux. L'État sous-traite l'essentiel : sur les grands projets, la Cour a mesuré 32 % de ressources internes, contre 65 % dans les organisations de référence étudiées par un cabinet de conseil. Les agents dont le métier est principalement numérique représentent 21 379 équivalents temps plein dans les ministères civils en 2022, soit 0,8 % des agents de l'État.[^igf]

Ses grands projets échouent souvent, pour les mêmes raisons. Louvois (solde des militaires) a été abandonné fin 2013 après 465 M€ d'erreurs de calcul pour la seule année 2012. L'opérateur national de paie, prévu pour 2,7 millions d'agents, a été abandonné pour un coût complet d'environ 346 M€. Sirhen (ressources humaines de l'Éducation nationale) est passé de 60 M€ prévus à plus de 500 M€ avant son arrêt en 2018.[^cour2020] Les causes reviennent : ambition mal découpée, gouvernance floue, règles trop complexes pour être codées, peu de compétences internes. La Cour attribue aussi l'échec de Louvois en partie à des réductions d'effectifs prématurées : réduire les effectifs avant que le système fonctionne est une cause d'échec documentée. Nous en tirons la leçon pour notre calendrier (chapitre 13).

Le résultat se lit dans les classements. Au tableau de bord européen des services publics en ligne, la France est 22e sur 27 (65,9 sur 100, contre 74,7 pour l'UE et 89,4 pour l'Estonie), 26e pour la disponibilité des services et 18e pour le préremplissage. Ce classement mesure la face visible, pas le coût ni l'efficacité interne. Notons ce qui va bien : les réseaux (fibre, 5G) sont de très bon niveau. Le retard est dans les services, pas dans les tuyaux.[^egov]

L'organisation elle-même est un labyrinthe. Notre recensement nominatif compte 2 776 organismes publics (opérateurs, agences, groupements d'intérêt public, autorités, chambres, commissions), sans compter les communes ni les caisses de sécurité sociale. Nous n'avons trouvé de budget chiffré que pour un tiers environ d'entre eux (de 647 à 873), et des effectifs pour presque aucun par établissement.[^organismes] Ce constat ne dit pas que ces organismes sont inutiles, beaucoup coûtent peu et certains sont essentiels. Il dit qu'on ne peut pas juger ce que l'on ne peut pas lire (chapitre 7).

Chaque collectivité, chaque réseau, chaque caisse achète et entretient ses propres logiciels, sans qu'aucune statistique publique ne mesure ce poste.

L'émiettement fragilise aussi la sécurité, mais la leçon est moins simple qu'il n'y paraît. Les données de 36,8 à 43 millions d'inscrits à France Travail ont été exposées en 2024 après une intrusion par les comptes de conseillers d'un partenaire sans double authentification (5 M€ d'amende de la CNIL en 2026), et plus de 33 millions de personnes par la fuite de deux opérateurs de tiers payant.[^cnil][^cyber] Or ces systèmes étaient déjà centralisés : un système central est une cible unique. La cause dominante est l'identifiant volé et l'absence de double authentification. Une technique commune ne protège donc que si elle s'accompagne d'une sécurité de premier rang, hors de portée de chaque commune mais à la portée d'une équipe nationale.

> **Pour aller plus loin — l'inventaire des démarches**
>
> Le flux officiel des fiches de service-public.gouv.fr compte 2 122 fiches pratiques, dont 847 décrivent une démarche ou une prestation. Selon notre classement, relu par échantillon seulement : 173 disparaîtraient avec le système proposé, 94 deviendraient automatiques, 435 resteraient (dont 185 regroupées dans l'application unique) et 145 restent à décider. Une prestation donne souvent plusieurs fiches, et le nombre de fiches n'est pas celui des démarches vécues. Le chapitre 7 en tire le temps rendu.[^demarches]

## 5. L'IA et les robots arrivent

Un laboratoire indépendant, METR, mesure la longueur des tâches qu'un agent d'IA réussit seul, une fois sur deux : on prend des tâches réelles, surtout informatiques, on chronomètre le temps d'un professionnel, et on regarde jusqu'où l'IA réussit. En mars 2023, GPT-4 réussissait des tâches qui prennent quatre minutes à un expert ; en avril 2026, le meilleur modèle mesuré en réussissait qui en prennent environ dix-sept heures. Ce dernier point est à la limite de l'instrument : METR juge ses mesures peu fiables au-delà de seize heures. La durée double environ tous les quatre mois depuis 2023, mais tous les six à sept mois si l'on prend toute la série depuis 2019.[^metr] Le modèle mesuré est d'Anthropic, constructeur de l'IA coautrice, ce qui est un conflit d'intérêts ; la mesure, elle, est de METR.

L'adoption suit, en partant de bas : 18,2 % des entreprises françaises d'au moins dix salariés utilisaient l'IA en 2025, contre 9,9 % un an plus tôt (42 % au Danemark).[^eurostat-ia] Les effets sur la productivité sont forts sur certaines tâches et faibles à l'échelle de l'économie. Dans un centre d'appels, l'assistance par IA a augmenté la productivité de 14 %, et de 34 % pour les débutants ;[^nber] dans un essai contrôlé de 2025, des développeurs expérimentés ont au contraire été 19 % plus lents.[^aiindex] L'économiste Daron Acemoglu estime, par extrapolation, que les gains de productivité sur dix ans seront modestes.[^acemoglu] Le FMI juge qu'environ 60 % des emplois des économies avancées sont exposés à l'IA, mais exposé ne veut pas dire supprimé.[^fmi] Les robots avancent moins vite : les installations mondiales de robots industriels sont stables, et la Chine en installe plus de la moitié.[^ifr]

Pourquoi cela concerne un manifeste sur la fiscalité ? Parce que notre système est financé par le travail. La fiscalité du travail représente 22,4 % du PIB en France (2024).[^taxud] Si une part croissante de la valeur est produite par des machines, ce financement s'érode, et un système qui taxe lourdement les salaires et légèrement les autres revenus voit son assiette fondre. Il faut l'anticiper avant, pas après.

Les preuves soutiennent un énoncé précis. L'IA progresse vite et s'adopte vite, et ses effets mesurés sur l'économie sont encore faibles. « La révolution est déjà là » est une conviction appuyée sur une tendance, pas un constat achevé. Nous l'assumons comme un pari, et nous construisons un système qui tient debout même si ce pari échoue : aucun de nos chiffres de dette ne suppose de revenus tirés de l'IA (chapitres 11 et 12).

> **Pour aller plus loin — ce qui pourrait nous donner tort**
>
> Les mesures de METR portent surtout sur des tâches informatiques bien définies, qui ne se transposent pas à un métier entier. Les gains de productivité mesurés sont locaux et contradictoires, et les enquêtes d'adoption reposent sur des échantillons d'entreprises. Les robots physiques progressent bien moins vite que les logiciels. Si les effets restent faibles dix ans, l'assiette s'érodera moins vite et notre pari industriel (chapitre 11) rapportera moins que prévu. C'est pourquoi chaque étape doit tenir seule.[^etatpreuves]

## 6. Une dette qui monte

En 2024, les administrations publiques ont dépensé 1 672,6 milliards d'euros, soit 57,0 % du PIB, et perçu 1 503,5 milliards. La différence, 169,1 milliards, a été empruntée. En 2025, le déficit était encore de 151,6 milliards et la dette atteignait 3 460,5 milliards d'euros fin 2025, soit 115,7 % du PIB. Les intérêts ont coûté 60,1 milliards en 2024 et 65,7 milliards en 2025.[^insee] La France est troisième de l'Union européenne pour le poids de sa dette et vingt-cinquième sur vingt-sept pour son solde public.[^eurostat]

Un déficit est un impôt différé. Ce que nous ne payons pas aujourd'hui sera payé plus tard, avec les intérêts, et chaque euro d'intérêts ne va ni à l'école ni à l'hôpital. Nous ne faisons pas ici une leçon de morale budgétaire. Un déficit peut être le bon choix en récession. Le problème est qu'il devienne la règle en temps normal.

À règles inchangées, notre modèle place la dette à 157 % du PIB en 2038 et 240 % en 2058, avec des prélèvements obligatoires de 42,7 % du PIB (hypothèses de croissance, de taux et de vieillissement à discuter, chapitre 12).[^droitactuel] Ce sont des ordres de grandeur, pas des prévisions, mais ils disent que « on verra plus tard » n'est pas une option neutre.

## 7. Une population qui vieillit

Le vieillissement est le plus prévisible de nos sept constats. Au 1er janvier 2026, la France entière compte 19,7 millions de personnes de 60 ans ou plus, soit 28,5 % de la population. En métropole, seul périmètre pour lequel la série remonte à 1975, ils sont 19,2 millions (29 %), contre 9,7 millions en 1975 (18,4 %) : leur nombre a doublé pendant que la population totale croissait de 27 %.[^demographie]

::: graphique id=plus-60-ans-metropole source=modeles/demographie/donnees/population_grands_ages_1901_2026.csv type=ligne x=annee y=60_plus,65_plus filtre="perimetre=metropole" titre="Personnes de 60 ans et plus, et de 65 ans et plus, en métropole" unite="millions" echelle=0.000001
:::

Le nombre de personnes de 20 à 64 ans pour une personne de 65 ans ou plus passe de 4,1 en 1975 à 2,5 en 2026, puis, selon le scénario central de l'Insee, à 2,0 en 2040 et 1,6 en 2070. Ce mouvement est largement acquis : les personnes de 65 ans en 2070 sont déjà nées. Même avec 2,1 enfants par femme dès 2035, le rapport entre les 65 ans ou plus et les 20-64 ans serait de 53 % en 2070 contre 40 % aujourd'hui. Le levier le plus puissant sur le rapport entre retraités et actifs est l'âge de départ, qui est un choix politique et non une donnée (chapitre 5). La fécondité, de 2,03 enfants par femme en 2010, est tombée à 1,56 en 2025 (donnée provisoire) ; elle ne joue sur ce rapport qu'à partir de 2045 environ, et l'immigration agit tout de suite mais ne règle rien seule.[^demographie]

> **Pour aller plus loin — ce qui change le plus le résultat en 2070**
>
> Notre modèle de projection retrouve les neuf scénarios de l'Insee à 2,1 % près sur la population totale. Une hypothèse changée à la fois, le rapport entre les 65 ans ou plus et les 20-64 ans en 2070 vaut 61,8 % au central, 66,0 % avec une fécondité de 1,20, 57,9 % avec 1,70, 67,1 % avec un solde migratoire nul, 55,6 % avec 400 000 par an, 53,2 % si l'espérance de vie cesse de progresser. Aucun scénario réaliste ne le ramène sous 50 %. L'indicateur mesure la contrainte démographique, pas la soutenabilité financière : productivité, emploi des seniors et automatisation peuvent la modifier.[^demographie]

## Ce que ces constats disent ensemble

Chacun de ces constats se discute, mais ils se renforcent. La complexité rend l'État coûteux à lire et injuste pour ceux qui ne savent pas. Le retard informatique l'empêche d'utiliser ce que l'IA permettrait. La dette limite ce que nous pouvons investir, et le vieillissement réduit la part de ceux qui financent. Nous en tirons une direction (chapitre 2) : des règles assez simples pour être appliquées automatiquement, une technique commune, des comptes publiés, et un système qui tient même si la révolution de l'IA tarde.

## La meilleure objection, et notre réponse

L'objection. « Le droit est complexe parce que la société l'est. Chaque exception que vous appelez niche corrige une injustice précise : le parent isolé, l'agriculteur, la transmission d'une PME familiale. Simplifier, c'est traiter de la même façon des situations différentes. Et automatiser des règles sociales a déjà produit des catastrophes : aux Pays-Bas, des milliers de familles accusées à tort de fraude aux allocations de garde d'enfants ; en Australie, le programme Robodebt de recouvrement automatique, jugé illégal. Votre État automatique sera aveugle. »

Notre réponse tient en trois temps. D'abord, nous ne prétendons pas que le droit puisse être simple partout : le droit de la famille, les successions, la justice restent affaire de jugement. Nous visons la complexité des prélèvements et des prestations, celle qui se calcule. Ensuite, la complexité actuelle crée elle-même des injustices massives, simplement moins visibles : un foyer sur deux qui renonce à la prime d'activité, des effets de seuil que personne n'a voulus, des régimes dont l'avantage va à quelques centaines de bénéficiaires. Face à un droit très complexe, ceux qui gagnent sont ceux qui paient les meilleurs conseils. Enfin, les catastrophes néerlandaise et australienne sont réelles et nous obligent.[^toeslagen][^robodebt] Elles viennent de systèmes opaques qui appliquaient des présomptions de fraude sans contrôle humain ni recours, pas de règles simples. Nous proposons l'inverse : la loi publiée avec son code et ses tests, des calculs que chacun peut vérifier, une décision automatique toujours contestable devant un humain (chapitres 7 et 8).

Une seconde objection voudrait que l'IA suffise à nous expliquer le système actuel. C'est une fausse solution. Une IA qui explique un système absurde reste un pansement sur une règle mal faite. Il faut d'abord simplifier les règles ; l'IA sert ensuite à les rendre accessibles à tous.

## Contraintes juridiques

Ce chapitre ne propose pas de mesure. Deux points valent pour la suite : les règles européennes sur les finances publiques (déficit, dette, trajectoire de dépenses) s'appliquent pendant toute la transition (⚠️ À VÉRIFIER, à instruire au chapitre 12), et le traitement automatisé de données personnelles relève du règlement général sur la protection des données et de la loi Informatique et libertés (chapitres 7 et 8).

## État de la recherche

- Ce qui est établi. Le non-recours aux prestations est massif en France (DREES) et dans toute l'Europe ; l'information ciblée des ayants droit augmente le recours (essai belge) ; le préremplissage fonctionne à grande échelle ; les grands projets informatiques publics échouent pour des causes récurrentes (Cour des comptes) ; la France est en retard sur les services en ligne ; le vieillissement est largement acquis (Insee).
- Ce qui est débattu. La taille de l'industrie de la complexité (aucune enquête française sur le temps de conformité : notre fourchette va du simple au double) ; l'effet du versement automatique sur le recours (aucune étude causale) ; l'idée qu'internaliser l'informatique publique coûte moins cher (hypothèse de notre modèle, non mesurée) ; la vitesse de l'IA et son effet sur l'économie, où les études vont de gains modestes à une transformation rapide.
- Ce qui manque. Une consolidation publique de la dépense numérique de toutes les administrations ; une mesure du temps que les travailleurs sociaux consacrent aux démarches ; un chiffrage officiel de plusieurs régimes de faveur ; une relecture juridique de notre registre d'anomalies.
- Sciences humaines et sociales. La sociologie du non-recours montre que le coût d'accès (temps, compréhension, stigmate) pèse plus que la pauvreté.[^drees] L'économie de la rente décrit le coût de l'allocation des talents vers la captation plutôt que la création, sans estimation transposable à la France.[^msv] Le scandale néerlandais montre qu'une automatisation sans recours détruit la confiance plus vite que la complexité.

## Synthèse des sources mobilisées

| Source | Ce qu'elle établit ici | Cote |
|---|---|---|
| Codes en vigueur (DILA), voies et moyens PLF 2026 | 165 656 articles ; 465 niches, 88,3 Md€ | A et C |
| DREES, études n° 1370 et 1379 | non-recours au RSA et à la prime d'activité | A |
| Modèle de l'industrie de la complexité | 25 à 57 Md€ par an | B |
| Cour des comptes, IGF et CGE, eGovernment Benchmark | dépense numérique, projets abandonnés, 22e sur 27 | A |
| METR, Eurostat, NBER, FMI, IFR | rythme de l'IA, adoption, productivité, robots | A et B |
| Insee, Eurostat, modèle de projection | dette, déficit, vieillissement | A et B |

## Notes

[^droit]: `sources/registre-anomalies-pour-le-manifeste.md` (78 codes, 165 656 articles en vigueur, programme `outils/droit/analyse_corpus.py`) et `sources/plan-de-bascule.md` § 1 (314 prélèvements ; 16 282 articles dans six codes fiscaux, douaniers et sociaux dont CSS 7 429, CGI 2 407), d'après la copie de https://codes.droit.org/ (base LEGI de la DILA, fichiers du 31/10/2026), lue le 02/11/2026. Cote C (outil du projet sur données de cote A ; copies « branches coupées » à rapprocher de Légifrance avant publication, V7938). Conflit d'intérêts : analyse assistée par Claude (Anthropic).
[^niches]: `sources/niches-orientation-riches.md` et inventaire `sources/inventaire-niches-fiscales.csv` (contrôle `sources/calculs/inventaire_niches.py`), d'après *Évaluation des voies et moyens, tome II, Dépenses fiscales*, annexe au PLF 2026, ministère de l'Économie, octobre 2025, https://www.budget.gouv.fr/ (adresse exacte du PDF non rechargée ⚠️), consulté le 05/11/2026. Cote A pour le document, B pour le classement. Conflit d'intérêts : classement rédigé par Claude (Anthropic).
[^atlas]: `sources/atlas-taux-marginaux.md` (OpenFisca-France 176.1.10, 14 cas types, 3 zones, pas de 50 €, législation 2026), novembre 2026. Cote B (calcul reproductible sur outil public ; cas types, pas une population). Conflit d'intérêts : rédigé par Claude (Anthropic) ; un défaut d'OpenFisca a modifié certains chiffres (`sources/ecarts-openfisca.md`).
[^anomalies]: `sources/registre-anomalies-pour-le-manifeste.md` (méthode en cinq temps, précision mesurée sur 43 détections relues), 02/11/2026 ; `sources/rules-as-code-analyse-statique.md` (1 355 renvois vers des articles disparus). Cote C : aucune fiche relue par un juriste. Conflit d'intérêts : revue assistée par Claude (Anthropic).
[^drees]: Gayet, DREES, *Études et Résultats* n° 1370, « Non-recours au RSA », mai 2026, copie hébergée https://www.lemediasocial.fr/hulkStatic/EL/ELI/2026/05/fcdfaf271-f458-4b5a-8fbc-d2700ed9db7a/sharp_/ANX/er1370-non-recours-rsa.pdf (version officielle à confirmer sur drees.solidarites-sante.gouv.fr) ; et n° 1379, « Non-recours à la prime d'activité », juillet 2026, https://www.drees.solidarites-sante.gouv.fr/sites/default/files/2026-07/ER1379_Non-recours_PA.pdf (tableau 1) ; lus en entier le 04/11/2026. Cote A. Pas de conflit d'intérêts. La Cour des comptes avance environ 30 % pour la prime d'activité avec une autre méthode (juin 2026, non lue).
[^cnaf]: Cnaf, « Solidarité à la source, un an après : les 5 enseignements clés », 18/03/2026, https://caf.fr/professionnels/presse/publications/solidarite-la-source-un-apres-les-5-enseignements-cles-d-une-reforme-qui-transforme-l-acces-aux , consulté le 04/11/2026. Cote B. Conflit d'intérêts : l'organisme évalue sa propre réforme ; aucun effet mesuré sur le recours.
[^t6]: `modeles/industrie-complexite/resultats.md` et `methode.md` (hypothèses H1 à H22), d'après Eurostat SBS (https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_ovw_act?geo=FR&nace_r2=M692&lang=en), Urssaf open data, Sénat (PLF 2026, https://www.senat.fr/rap/l25-139-323/l25-139-323_mono.html ; rapport Berson 2012, http://www.senat.fr/rap/r11-677/r11-6771.pdf, p. 140, 145 et 146, citant l'IGF 2010, relu le 14/11/2026), Banque mondiale (Doing Business 2020, https://archive.doingbusiness.org/content/dam/doingBusiness/country/f/france/FRA.pdf), PLF 2026, revu le 03/11/2026. Cote B (parts « complexité » non mesurées). Conflit d'intérêts : rédigé par Claude (Anthropic). Doing Business 2020 est arrêté depuis, et PwC, partenaire de l'étude, tire des revenus du conseil fiscal.
[^vangestel]: Van Gestel R., Goedemé T., Janssens J., Lefevere E., Lemkens R., « Improving take-up by reaching out to potential beneficiaries », *Journal of Social Policy*, 52(4), 2023, p. 740-760, https://www.cambridge.org/core/journals/journal-of-social-policy/article/improving-takeup-by-reaching-out-to-potential-beneficiaries-insights-from-a-largescale-field-experiment-in-belgium/2C926F2BDCF7EA8AB0446E67FC0C841D , résumé consulté le 04/11/2026. Cote A. Pas de conflit d'intérêts connu.
[^recherche-allocation]: `sources/etat-recherche-allocation-unique.md` (DREES ; synthèse DGCS des territoires zéro non-recours, https://solidarites.gouv.fr/sites/solidarite/files/2025-07/Bilans-territoires-zero-non-recours-janvier-2025.pdf ), 04/11/2026. Cote B. Conflit d'intérêts : rédigé par Claude (Anthropic).
[^mazzucato]: Mazzucato M., *The Value of Everything: Making and Taking in the Global Economy*, Allen Lane, 2018, présentation de l'éditeur https://www.penguin.co.uk/books/284307/the-value-of-everything-by-mariana-mazzucato/9780141980768 (livre non relu, date de consultation non consignée ⚠️ V14100). Cote B. Pas de conflit d'intérêts connu.
[^reorientation]: Répartition du coût : `modeles/industrie-complexite/resultats.md` § 2 (travail interne des employeurs 21,9 Md€ et 301 000 équivalents emplois, sur 1,2 million de personnes à 15 / 25 / 35 % de leur temps, `methode.md`, H8 ; temps des ménages 1,0 Md€). Réorientation : `sources/chiffrage-reorientation-complexite.md` (calcul `sources/calculs/reorientation_complexite.py`), 05/11/2026 ; vérifications V13250 à V13262. Cote B (assemblage de modèles, ordres de grandeur). Conflit d'intérêts : rédigé par Claude (Anthropic), qui signale un risque de complaisance sur les gains de productivité. Coût de collecte public : `sources/cout-complet-prelevement.md`, d'après le PAP 2026 « Gestion des finances publiques », https://www.assemblee-nationale.fr/dyn/contenu/visualisation/1087984/file/PAP2026_BG_Gestion_finances_publiques_GA.pdf , 03/11/2026, cote B.
[^cour2026]: Cour des comptes, rapport sur la dépense numérique de l'État, octobre 2026, p. 42, https://www.vie-publique.fr/files/rapport/pdf/305075.pdf , consulté le 03/11/2026. Cote A. Réserve : le montant des rémunérations (1,1 Md€) provient d'un rapport de 2023 sur un périmètre différent (V6601) ; le chiffre de 5,5 Md€ mêle des années et des périmètres.
[^igf]: Inspection générale des finances et Conseil général de l'économie, rapport sur les ressources numériques de l'État, janvier 2023, tableaux 2 et 4, https://www.vie-publique.fr/files/rapport/pdf/290132.pdf , consulté le 03/11/2026. Cote A. Pas de conflit d'intérêts.
[^cour2020]: Cour des comptes, « La conduite des grands projets numériques de l'État », octobre 2020, p. 19-20, 49-50, 68, https://www.ccomptes.fr/sites/default/files/2023-10/20201014-58-2-conduite-grands-projets-numeriques-Etat.pdf , relu le 03/11/2026 (32 % de ressources internes contre 65 % chez Gartner, cabinet de conseil). Cote A. Pas de conflit d'intérêts.
[^egov]: Commission européenne, *eGovernment Benchmark 2025*, résultats finaux (données de 2024), https://ec.europa.eu/newsroom/dae/redirection/document/116969 ; page France du rapport Décennie numérique 2025, https://digital-strategy.ec.europa.eu/en/factpages/france-2025-digital-decade-country-report ; lus le 03/11/2026 ; rangs calculés par nos soins (`modeles/etat-plateforme/donnees/egovernment_benchmark_2025.csv`). Cote A. Limite : mesure de la face visible ; méthode modifiée en 2025, pas de comparaison avec les éditions antérieures.
[^organismes]: `modeles/grand-livre/instances-liste-publiable.md` (2 776 lignes, base de la direction du Budget et recensements, 06/11/2026) et `modeles/grand-livre/consolidation-organismes.md` (budgets chiffrés pour 647 à 873 lignes, soit 31 %). Cote B (recensement du projet sur sources A à C ; classement par mots-clés en partie heuristique). Conflit d'intérêts : rédigé par Claude (Anthropic). ⚠️ À VÉRIFIER : le décompte mêle des familles d'organismes ; il ne s'agit pas d'une liste officielle.
[^cnil]: CNIL, « Violation de données : sanction de 5 millions d'euros à l'encontre de France Travail », 29/01/2026, https://www.cnil.fr/fr/violation-de-donnees-sanction-5millions-france-travail ; « Violation de données de deux opérateurs de tiers payant : la CNIL ouvre une enquête », 07/02/2024, https://www.cnil.fr/fr/violation-de-donnees-de-deux-operateurs-de-tiers-payant-la-cnil-ouvre-une-enquete-et-rappelle-aux ; consultés le 25/10/2026. Cote A. Pas de conflit d'intérêts.
[^cyber]: `sources/recherche-cybersecurite-france.md` (incidents 2020 à octobre 2026), d'après la CNIL (https://www.cnil.fr/fr/piratage-du-systeme-d-information-des-impots-les-verifications-sont-en-cours , 18/08/2026) et l'ANSSI (feuille de route de sécurité numérique de l'État 2026-2027), consultés le 25/10/2026. Cote B (plusieurs rapports lus via la presse). Conflit d'intérêts : rédigé par Claude (Anthropic).
[^demarches]: `sources/inventaire-demarches.md` § 1 et 2 (flux des fiches de service-public.gouv.fr, DILA, version du 05/11/2026 ; classement par règles, relu par échantillon), 07/11/2026. Cote B pour le flux, C pour le classement. Conflit d'intérêts : classement par Claude (Anthropic) ; plusieurs sorts sont des extensions non tranchées. ⚠️ À VÉRIFIER (V19900 à V19914).
[^metr]: METR, « Measuring AI Ability to Complete Long Tasks », https://metr.org/time-horizons/ , mise à jour 2026, consultée le 25/10/2026 (point du 07/04/2026 : 17,4 heures à 50 % de réussite ; « Measurements above 16 hrs are unreliable with our current task suite » ; reprise dans `modeles/acceleration/donnees/series_courbes.csv` et `modeles/acceleration/methode.md`, H2) ; METR, « Time Horizon 1.1 », 29/01/2026, https://metr.org/blog/2026-01-29-time-horizon-1-1/ (doublement en 131 jours environ pour les modèles depuis 2023, 89 jours depuis 2024, 196,5 jours sur toute la période) ; vérifié le 09/11/2026. Cote B (laboratoire indépendant à but non lucratif, méthode publiée, tâches surtout logicielles). Conflit d'intérêts : le modèle mesuré à 17 heures est d'Anthropic, constructeur de l'IA coautrice ; METR reçoit des accès anticipés des laboratoires.
[^eurostat-ia]: Eurostat, « Artificial intelligence by size class of enterprise » (isoc_eb_ai), https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ai/default/table , entreprises d'au moins 10 salariés, 2024 et 2025, interrogé le 03/11/2026. Cote A. Pas de conflit d'intérêts.
[^nber]: Brynjolfsson E., Li D., Raymond L., « Generative AI at Work », NBER Working Paper 31161, https://www.nber.org/papers/w31161 , 2023, publié au *Quarterly Journal of Economics* en 2025, consulté le 03/11/2026. Cote A. Limite : un seul employeur, une seule tâche.
[^aiindex]: Stanford HAI, *AI Index Report 2026*, https://hai.stanford.edu/assets/files/ai_index_report_2026.pdf , chapitre 4 (productivité : Becker et coll. 2025, pour les développeurs expérimentés), consulté le 03/11/2026. Cote A. Conflit d'intérêts : rapport financé en partie par des entreprises du secteur ; reprend des enquêtes privées non représentatives.
[^acemoglu]: Acemoglu D., « The Simple Macroeconomics of AI », NBER Working Paper 32487, https://www.nber.org/papers/w32487 , 2024, consulté le 03/11/2026. Cote A (estimation par extrapolation, pas une mesure). Le chiffre précis de gain n'est pas repris ici.
[^fmi]: Georgieva K., FMI, « AI Will Transform the Global Economy. Let's Make Sure It Benefits Humanity », 14/01/2024, https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity , consulté le 03/11/2026. Cote A (exposition n'est pas suppression).
[^ifr]: Fédération internationale de robotique (IFR), « Robot density surges in Europe, Asia and Americas », https://ifr.org/ifr-press-releases/news/robot-density-surges-in-europe-asia-and-americas , 04/2026, consulté le 03/11/2026 ; installations 2024 d'après l'AI Index 2026. Cote B. Conflit d'intérêts : l'IFR représente l'industrie robotique ; rupture de série sur la densité chinoise.
[^taxud]: Commission européenne, DG TAXUD, *Taxation trends in the EU*, édition 2026, profils pays, https://taxation-customs.ec.europa.eu/taxation/economic-analysis/data-taxation-trends_en , données 2024, consulté le 03/11/2026 ; calculs dans `sources/synthese-france-face-ue.md`. Cote A (⚠️ date d'extraction du classeur à relire, V7400).
[^etatpreuves]: `sources/chapitre1-etat-des-preuves.md` (plans nationaux annoncés, engagés, dépensés ; déclarations de laboratoires ; version sceptique de la thèse), 03/11/2026, et `modeles/acceleration/resultats.md`. Cote B. Conflit d'intérêts : rédigé par Claude (Anthropic).
[^insee]: Insee, comptes nationaux des administrations publiques 2024 et 2025 (tableaux 3.201, 3.216 et 3.217), https://www.insee.fr/fr/statistiques/8988845 ; repris dans `sources/recherche-donnees-simulateur.md` § 1 ; consulté le 05/11/2026. Cote A. Pas de conflit d'intérêts.
[^eurostat]: Eurostat, `gov_10a_exp` et `gov_10dd_edpt1` (2024), https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp ; rangs dans `sources/synthese-france-face-ue.md`, consulté le 03/11/2026. Cote A.
[^droitactuel]: `modeles/systeme-ideal/resultats_decisions_0811.txt` et `sources/calculs/bilan_global.py` (droit actuel : dette 157,1 % en 2038 et 240,2 % en 2058, prélèvements 42,7 %), 08/11/2026. Estimation cote B. Conflit d'intérêts : modèle de l'auteur et d'une IA. Les hypothèses macroéconomiques (croissance, taux d'intérêt, vieillissement) sont discutées au chapitre 12.
[^demographie]: `modeles/demographie/RAPPORT.md` § 1 à 4 et données `modeles/demographie/donnees/`, d'après Insee, « Bilan démographique 2025 », population au 1er janvier par âge (https://www.insee.fr/fr/statistiques/fichier/8721185/3_Pop1janv_age.xlsx) et Insee Première n° 2108, juin 2026 (https://www.insee.fr/fr/statistiques/9004289), consultés le 07/11/2026. Cote A pour l'Insee, B pour le modèle de projection (validé contre les neuf scénarios Insee). Conflit d'intérêts : aucun pour l'Insee ; modèle rédigé par Claude (Anthropic). Causes de la baisse de fécondité : ⚠️ À VÉRIFIER (V19405).
[^toeslagen]: Tweede Kamer, rapport final de la commission d'enquête parlementaire sur les allocations de garde d'enfants, « Ongekend onrecht », 17/12/2020, https://www.tweedekamer.nl/nieuws/kamernieuws/eindverslag-onderzoek-kinderopvangtoeslag-overhandigd , consulté le 01/11/2026. Cote A. Pas de conflit d'intérêts.
[^robodebt]: Royal Commission into the Robodebt Scheme (Australie), rapport remis le 07/07/2023, https://web.archive.org/web/2023/https://robodebt.royalcommission.gov.au/publications/report , consulté le 01/11/2026 ; contenu non relu ⚠️ À VÉRIFIER (V712, V713). Cote A pour l'existence et la date du rapport.
[^msv]: Murphy K., Shleifer A., Vishny R., « The Allocation of Talent: Implications for Growth », *Quarterly Journal of Economics*, 106(2), mai 1991, p. 503-530, DOI 10.2307/2937945, vérifié par Crossref le 06/11/2026 (V19323). Cote A. Pas de conflit d'intérêts.
