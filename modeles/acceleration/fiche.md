---
titre: L'intelligence artificielle accélère-t-elle vraiment ?
theme: construire
statut: brouillon ; données consultées le 25/10/2026 (la date du calcul n'est pas écrite dans les résultats)
---

## La question
L'introduction du manifeste affirme que la révolution de l'intelligence artificielle et de la robotique arrive et s'accélère. Le modèle vérifie trois choses : quelles courbes accélèrent vraiment, si l'intelligence artificielle accélère déjà sa propre recherche, et quelle fourchette de dates on peut donner honnêtement pour une « bascule ». Il ne chiffre aucune mesure du programme : il sert à cadrer le constat de départ.

## Ce qui entre
- Mesures d'organismes indépendants des laboratoires : la longueur des tâches qu'un agent d'intelligence artificielle réussit seul, mesurée par METR (un organisme d'évaluation) en temps de travail d'un expert ; le calcul utilisé pour entraîner les plus gros modèles (Epoch AI) ; des évaluations de l'automatisation de la recherche.
- Statistiques publiques : adoption de l'intelligence artificielle par les entreprises (Eurostat, 2023-2025, Union et France), installations de robots industriels (Fédération internationale de la robotique).
- Données d'entreprises : trajets Waymo, utilisateurs de ChatGPT (déclarés par l'entreprise), 27 générations de robots humanoïdes avec leur date d'annonce et de première livraison à un client, 21 déclarations des laboratoires sur la part du code écrite par l'intelligence artificielle.
- Études et prévisions : 17 prévisions datées (enquêtes auprès des chercheurs, prévisionnistes, plateformes de paris, dirigeants), 9 modèles de « décollage » et leurs critiques.
- Hypothèses : le choix de l'indicateur, le seuil de la bascule, le rythme futur (voir plus bas).

Les chiffres d'Anthropic, l'entreprise qui développe l'IA coautrice du manifeste, sont signalés comme un conflit d'intérêts et ne servent qu'en complément.

## Comment il calcule
1. Ajustement exponentiel. Pour une série, on trace le logarithme de la valeur en fonction du temps et on y fait passer une droite. Sa pente k est le taux de croissance continu par an. Le temps de doublement vaut ln 2 / k, converti en mois. L'intervalle affiché (plus ou moins 1,96 erreur-type) est trop étroit, la méthode le dit, car les points ne sont pas indépendants.
2. Test d'accélération. On refait le même calcul sur des fenêtres glissantes de 2 ou 3 ans. Si le temps de doublement raccourcit d'une fenêtre à l'autre, la courbe va plus vite qu'une exponentielle ; s'il s'allonge, elle ralentit.
3. Courbe en S. On ajuste aussi une courbe qui plafonne : valeur = K / (1 + e^(−r (t − tm))), où K est le plafond. K est cherché sur une grille, de 1,001 à 50 fois le maximum observé. Si la courbe en S colle aussi bien que l'exponentielle, les données ne permettent pas de trancher.
4. Robots. Pour chaque entreprise, l'écart en mois entre deux générations annoncées, et la pente de ces écarts (négative : le cycle raccourcit). Seule la première livraison à un client extérieur compte comme produit.
5. Date de bascule. On part du dernier point mesuré, 17,4 heures de travail d'expert réussies à 50 % (avril 2026), et on avance mois par mois : chaque mois, la durée est multipliée par 2^(1 / doublement). Le doublement peut lui-même s'allonger ou raccourcir d'un pourcentage par an. On s'arrête quand la durée atteint le seuil, multiplié par 5 si l'on exige 80 % de réussite.
6. Prévisions. Quartiles des médianes publiées, avec une voix par famille de sources.

Exemple suivi (scénario central A) : seuil d'un mois de travail = 167 heures. Il faut passer de 17,4 à 167 heures, soit un facteur 9,6, soit 3,3 doublements. À un doublement tous les 4,2 mois, cela fait environ 14 mois après avril 2026 : mai 2027. Si l'on exige 80 % de réussite, le seuil passe à 835 heures, soit 5,6 doublements et environ 23 mois : avril 2028.

## L'hypothèse qui porte le résultat
Que la tendance mesurée par METR continue (hypothèses H4 et H6) : un doublement tous les 4,2 mois au central (tendance depuis 2023, mesurée par METR), 6,2 mois au bas (tendance depuis 2019). La fourchette de bascule repose sur ce seul instrument, dont le dernier point dépasse la zone où METR le juge fiable (au-delà de 16 heures). Si le doublement s'allonge de 30 % par an, la date passe de mars 2029 à août 2031 dans le scénario bas ; s'il s'allonge de 50 % par an (courbe en S), le seuil n'est jamais atteint avant 2100 (resultats.md, § 4). Les données de 2026 ne montrent pas ce ralentissement pour METR, mais elles ne permettent pas non plus de l'exclure : le plafond de la courbe en S n'est pas identifiable.

## Ce que l'IA a choisi elle-même
Trois hypothèses sont marquées « hypothèse de Claude » dans la méthode, et quatre autres règles sont posées par l'IA sans source qui tranche. Sept en tout :
- H1 : l'horizon METR comme indicateur de la bascule. Ses tâches sont surtout du logiciel et sont plus propres que le travail réel ; ce choix rapproche la date.
- H3 : les seuils, une semaine = 40 heures et un mois = 167 heures, et le mois comme seuil de bascule. La méthode le dit conventionnel : doubler le seuil décale la date d'un doublement, 4 à 6 mois.
- H6 : les ralentissements testés, +30 % et +50 % par an, choisis pour donner la meilleure chance à l'objection.
- H5 : le facteur 5 entre réussite à 50 % et à 80 %, tiré d'un seul modèle (17,4 heures contre 3,1, soit 5,6). Arrondir à 5 avance les dates de moins d'un mois.
- Le scénario haut, où le doublement raccourcit de 15 % par an, n'a pas de source.
- H7 : une voix par famille de sources pour les prévisions, et le choix des valeurs retenues dans chaque famille.
- H8 : ne compter un robot comme produit qu'à sa première livraison à un client extérieur. Ce choix rend la robotique moins rapide qu'avec les annonces.

## Ce qu'il ne fait pas
- Il décrit des capacités, pas des effets économiques : rien sur l'emploi, la productivité ou les recettes publiques.
- Les modèles d'intelligence artificielle de 2026 et leurs dates sont repris des bases d'Epoch et de METR, sans recoupement un par un.
- La courbe « délai entre l'échec et le niveau expert » est biaisée : un test créé en 2025 ne peut pas montrer un délai de dix ans, et les tâches encore ratées n'y figurent pas.
- Le travail réel reste loin des bancs d'essai : 21 % sur un indice de vrais projets indépendants.
- Les prévisions agrégées sont écrites dans le fichier de contrôle, pas lues dans le fichier de données : dix médianes sur les 17 prévisions recensées. La valeur actuelle de Metaculus n'a pas pu être lue.
- Les données datent du 25 octobre 2026 et n'ont pas été mises à jour depuis.

## Ce qu'il donne
- La longueur des tâches réussies seules par les agents double désormais tous les 3,4 à 3,5 mois, contre 6,5 à 6,8 mois sur les fenêtres antérieures : c'est la seule courbe qui accélère nettement (resultats.md, § 1).
- Le calcul d'entraînement double tous les 5,2 mois sans accélérer ; les installations de robots industriels progressent d'environ 5 % par an ; le cycle des robots humanoïdes ne raccourcit pas en général, seuls leurs prix baissent vite (resultats.md, § 1 et § 2).
- Les mesures indépendantes situent l'accélération de la recherche en intelligence artificielle par elle-même autour de 1,5 fois, sous 2 fois ; les chiffres spectaculaires des laboratoires mesurent de l'assistance, pas de l'autonomie (resultats.md, § 3).
- Un agent capable de mener seul un projet d'un mois : entre avril 2027 et mars 2029 si les tendances continuent, août 2031 avec un ralentissement de 30 % par an, jamais sous la forme d'une courbe en S (resultats.md, § 4).
- Les prévisionnistes situent l'intelligence artificielle de niveau humain vers 2042 (quartiles 2032 à 2046), une date que les chercheurs rapprochent à chaque enquête (resultats.md, § 4).

## Comment le refaire
Depuis le dossier du modèle, avec JavaScriptCore fourni par macOS :

`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc modele.js test_modele.js`

La commande lance 5 contrôles sur des données synthétiques, puis imprime tous les chiffres des résultats. Relancée le 9 novembre 2026 : les 5 contrôles passent, et les dates imprimées (2027,3 ; 2027,4 ; 2028,3 ; 2029,2 ; 2031,6) correspondent aux mois écrits dans les résultats.
