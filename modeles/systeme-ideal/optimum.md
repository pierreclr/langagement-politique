---
titre: Recherche de l'architecture optimale (chantier 2 de la boucle « meilleur système »)
date: 2026-11-03
statut: brouillon, ordres de grandeur sous hypothèses ; décision à l'auteur
---

# Quelle architecture tient le mieux les contraintes ?

Code : `optimum.js` (fonctions pures, au-dessus d'`options_financement.js`, `taxe_patrimoine.js`, `palier1.js`, `deces_realisation.js` et des modules `gagnants-perdants/palier1.js` et `correctifs.js`), `test_optimum.js` (293 contrôles), `rapport_optimum.js`. **Tableaux : `resultats-optimum.txt` (c'est lui qui fait foi ; affinage au § 7, sortie du plancher au § 8, architecture finale v2 au § 9, socle plus haut au § 10, allocation unique au § 11, fonctions continues et architecture v3 au § 12, formes plus convexes et architecture v3b au § 13, architecture v4 au § 14 : `rapport_v4.js`, architecture v5 au § 15 : `rapport_v5.js`).** Hypothèses H530 à H634 (`methode.md` § 33). Points non confirmés : V7850 à V7861, V7870 à V7878, V8200 à V8202, V8300 à V8304, V8400 à V8403, V8500 à V8504, V8600 à V8604, V8700 à V8702, V9400 à V9404, V9950 à V9956. Aucun défaut des autres modules n'est modifié.

Transparence : ce texte est écrit par Claude, une IA d'Anthropic. Le risque propre à cette tâche est de présenter un résultat de grille comme « le système parfait ». Une grille trouve le meilleur point *dans les hypothèses du modèle*. Elle ne dit rien de ce que le modèle ignore.

## v5.1 recalculée (04/11) : corrections de données aux sources primaires (tableaux : `resultats-optimum.txt` § 18 ; `pas_a_pas_v51.py` ; V12400-V12420)

**Ce n'est pas une nouvelle architecture** : mêmes mesures, mêmes choix (socle 350 €, majoration 400 €, héritage, capital de départ). On a seulement appliqué aux modèles les corrections de **faits sourcés** établies la nuit du 04/11 (aucun choix politique), puis recalculé le taux plat d'équilibre. **Effet total : −7,7 Md€ sur le solde central à taux inchangé, et +0,7 point sur le taux d'équilibre (40,7 → 41,4 %) : au-dessus des deux seuils (1 Md€ ; 0,1 point).**

| indicateur | v5 (avant) | **v5.1** |
|---|---|---|
| taux plat d'équilibre | 40,7 % | **41,4 %** (variante « IA ambitieuse » : 40,1 → 40,8 %) |
| solde favorable / central / défavorable (Md€/an), à ce taux | 116,8 / +0,8 / −144,8 | **121,0 / +0,6 / −150,6** |
| même, au taux inchangé de 40,7 % | 116,8 / +0,75 / −144,8 | 110,8 / **−7,0** / −154,2 |
| dette / PIB à 10 ans, favorable / central / défavorable | 56,6 / 100,1 / 151,7 % | 55,2 / **100,0** / 153,3 % |
| smicard seul (€/mois, écart au droit actuel) | +54 | **+43** |
| parent isolé au Smic, 2 enfants | +138 | **+124** |
| couple avec un Smic, 2 enfants | +45 | **+35** |
| couple avec deux Smic, 2 enfants | −66 | **−94** |
| cadre à 4 Smic | +28 | **−84** |
| taxe de 1 % (recette nette au central) | 92,6 | **86,4** |
| gestion nette (favorable / central / défavorable) | 8,0 / 4,2 / 1,1 | **5,3 / 3,1 / 0,6** |
| effectifs et IA | +0,2 / +0,2 / −0,4 | **−0,1 / −0,1 / −0,4** |

**Correction par correction** (cumul, au taux inchangé de 40,7 %, effet sur le central) : H45 RSA 1,84 M **+0,35** ; H23 emploi 27,9 M **0** (n'entre pas dans la v5, seulement dans le forfait des variantes anciennes) ; H506 cotées 15 % **−0,35** ; H250 bornes 0 / 0,136 **0** au central (le bas passe de 116,8 à 118,7, le haut de −144,6 à −144,2) ; H252 réalisation 1,5 / 1,0 (Levy, V11550) **−0,48** ; gestion (base CAF lue, plafond des départs, coût du socle 1,46) **−1,10** ; IA 2,5 / 6 / 15 % **−0,31** ; **H508 rendement locatif 1,7 / 2,0 / 2,7 % : −5,85 (taxe 93,2 → 87,3)**.

**Lecture, sans complaisance.** (1) Une seule correction fait presque tout : le rendement locatif du modèle (3,0 / 3,5 / 4,5 % « net ») dépassait le brut national mesuré (≈ 3,0 %) ; corrigé, la taxe de 1 % rapporte 6 Md€ de moins parce que la hausse d'impôt est capitalisée beaucoup plus fortement dans les prix. Mais la part de charges retranchée du brut (15 / 25 / 35 %) est **une hypothèse sans source primaire** (V12533). (2) La gestion garde deux lignes sans base publiée (MSA, Agirc-Arrco et caisses ; France Travail) : les retirer coûterait encore 1,56 Md€ au central (choix de prudence laissé à l'auteur). Le plafond de 21 452 départs en dix ans repose sur un facteur ×1,5 de sorties hors retraite, hypothèse. (3) Le « +138 € » du parent isolé devient +124 €, toujours au-dessus du minimum de +100 € ; le smicard gagne encore 43 €. Mais **le cadre à 4 Smic passe de +28 à −84 €** et le couple à deux Smic de −66 à −94 : le taux plus haut se paie en haut de l'échelle. (4) **Conséquences sur des tests historiques** : les architectures v2, v3 et v3b (étapes du 03/11) ne tiennent plus (3) à leur nouveau taux d'équilibre, et le stabilisateur ne ramène plus la (2) au haut à l'an 10 (−92,8 contre −88,1) ; ces étapes sont dépassées par la v4 et la v5. (5) La **dette à 10 ans ne baisse toujours pas** (100,0 %). (6) Le plafond de 84,7 % du calendrier de gestion de `risques/stress.js` est retiré : le plafond des départs est maintenant dans la somme (sinon double compte).

## Architecture v5 (03/11 au soir ; tableaux : `resultats-optimum.txt` § 15 ; H630 à H634)

La v5 est la v4 plus les économies documentées de trois chantiers du 03/11 au soir, **sans double compte** (chaque rapport liste ses recouvrements, appliqués au § 15.1) : gestion (`sources/economies-gestion-simplification.md`), benchmark européen (`sources/economies-benchmark-europeen.md`), effectifs publics et IA (`sources/economies-effectifs-publics-ia.md`). Attention à la convention : les rapports disent « bas » pour l'économie prudente, le modèle dit « bas » pour le scénario favorable ; `optimum.js` inverse l'ordre.

1. **Gestion** (`gestion: 'recommandee'`, H630) : gestion supprimée (collecte, prestations) **moins** la régie fiscale des collectivités (déjà dans A1) **moins** le **nouveau coût de paiement du socle** (0,2 / 0,4 / 0,8 % de 159 Md€, un coût **manquant** du modèle) : **+8,0 / +4,2 / +1,1 Md€**. B1 (gestion devenue inutile) est remplacée, pas ajoutée : B1 n'était pas dans les structurelles A. L'économie informatique de l'État-plateforme (5,3 / 2,1 / 0,1) reste **en réserve** (recrutement massif, transition de 28 Md€ hors solde).
2. **Effectifs et IA** (`effectifs: 'central'`, H631) : **+0,2 / +0,2 / −0,4 Md€** (central du rapport ; le « bas » du rapport, où l'outil coûte plus qu'il ne rapporte, au scénario défavorable). Il **remplace B2**. Le haut du rapport (+6,2 ; 84 % des départs du vivier non remplacés) est la variante « IA ambitieuse ».
3. **Benchmark** (`benchmark: 'classeB'`, H632) : **0**. Les 2,0 / 6,4 / 12,6 additionnels du rapport (1 / 4 / 9 hors déchets) sont tous de classe C (logement et équipements collectifs, ordre et sécurité, aides aux entreprises) : en réserve (9 / 4 / 1 dans la variante). Le benchmark ne montre aucun excès de fonctionnement contre l'Allemagne, les Pays-Bas ni la Suède ; les écarts vraiment grands sont des transferts (retraites +106 Md€ contre l'Allemagne), hors modèle ou déjà dans les 113 Md€ du socle.
4. **Architecture v5** (H633) : v4 + les trois postes, **majoration 400 €** (marge recommandée : le minimum qui donne +100 €/mois au parent isolé est maintenant 380 €, la v4 en demandait 390 ; 400 € donne +138 € au taux d'équilibre sans perdant protégé), taux plat **40,7 %** (v4 : 41,0 %).
5. **Économies de dépense au solde, total** : **33,3 Md€ au central** (v4 : 28,9), soit **3,1 points de taux plat** (1 point = 10,8 Md€) ; favorable 43,0, défavorable 19,6. Les trois chantiers ajoutent **4,4 Md€ au central, soit 15 %** : pas le doublement espéré. Niches de TVA (4,7, recette) et santé (9,7) hors total.
6. **Résultats** : solde **+116,8 / +0,8 / −144,8 Md€** (v4 : +113,2 / 0,0 / −143,5) ; (2) non tenue (écart 56,7), les autres tenues ; 15 règles ; taux marginal à l'infini 70,7 % ; TME maximal 66 %. Cas types (€/mois) : smicard **+54**, couple avec un Smic **+45**, couple avec deux Smic −66, **parent isolé au Smic +138**, retraité locataire 0, RSA seul −13, cadre 2 Smic +362, cadre 4 Smic +28. Dixièmes (€/UC/mois) : D1 +55, D2 +215, D3 +71, D4 +54, D5 +97, D6 0, D7 +19, D8 −125, D9 −256, D10 −1 054. Pression nette +180,0 Md€ (6,1 points de PIB, dont 169,9 pour le déficit actuel).
7. **Dette à 10 ans** (`risques/stress.js`, chemin « V5 », H634) : **57 / 100 / 152 %** sans choc (v4 : 56 / 100 / 151). **La dette ne baisse pas** : le taux plat baisse dès l'année 1, alors que la gestion ne produit rien avant 2032 (calendrier du rapport, plafonné à 84,7 % par les départs) ; sans calendrier, 99,4 % au central (v4 : 99,7). Le retrait de la déduction « système public » de 1,0 Md€ dans T6 (V9613) agit sur ce chemin seulement (+0,43 Md€/an de recettes au central). Chocs au central : IA à zéro 104 %, récession 106 %, +100 pb 105 %, krach immobilier 103 %, exil au haut 108 %.
8. **Variante « IA ambitieuse + réserves »** (§ 15.6) : IA haute, informatique, classe C : taux d'équilibre **40,1 %**, économies **39,4 Md€ au central** (63,4 au favorable), solde +128,3 / +0,2 / −146,9, dette 101 % au central. **C'est le plafond atteignable** : environ 0,9 point de taux plat de moins que la v4, au central 0,6 point de plus que la v5 ; l'essentiel du gain est au scénario favorable.
9. **À nommer** : « à richesse par habitant égale, la France dépense comme ses voisins ; l'écart est dans les retraites » (§ 15.7 point 2). La fin de l'industrie de la complexité est un gain de productivité privée, pas une réserve budgétaire. Limites : bases non publiées (MSA, Agirc-Arrco, France Travail), départs comptés une fois (V9955), calendrier de l'IA non modélisé (V9954), choix de 400 € à confirmer (V9950), taux plat à faire descendre au rythme des économies (V9951).

## Architecture v4 (décisions de l'auteur du 03/11) (tableaux : `resultats-optimum.txt` § 14 ; H620 à H625)

L'auteur a tranché les neuf dilemmes (03/11). Deux changent le chiffrage ; les autres (capitalisation après l'équilibre, règle de lancement, régularisation expérimentée, droit existant d'abord, seules les législatives remplacées) n'ont pas de poste dans le solde de croisière (H625).

1. **Éducation (dilemme 3) : non-remplacement des postes libérés** par la démographie au lieu du redéploiement vers le tuteur IA. Poste éducation : **+5,5 / +3,9 / +2,2 Md€** (favorable / central / défavorable, `sources/economies-depense-publique.md`) **moins 36 M€/an** d'expérimentation, au lieu de −0,2 / −1,6 / −4,1 : **+5,5 Md€ au central** par rapport à la v3b. **Le tuteur n'est pas compté comme économie** (H620, choix documenté) : ni « hors budget » (flatteur : il faudra le payer s'il marche), ni généralisé (≈ 5,7 Md€/an avec des accompagnateurs formés à 1 pour 100, ce qui ramènerait presque à la v3b), mais **au coût de l'expérimentation à trois bras** (78 collèges par bras, ≈ 17,1 + 18,9 M€/an, `modeles/education/methode.md` § 4.5). La généralisation se décidera sur les résultats, et coûtera alors ≈ 0,5 point de taux plat (⚠️ V9401).
2. **Parent isolé (dilemme 9) : majoration relevée à 390 € par enfant**, la plus petite au pas de 10 € qui donne au parent isolé au Smic au moins **+100 €/mois** (seuil choisi par Claude pour traduire « marge plus grande », H621) au taux d'équilibre, sans perdant protégé. Grille au § 14.3 : 340 € → +14 ; 380 € → +92 ; **390 € → +112** ; 400 € (41,1 %) → +130 ; 500 € (41,4 %) → +324.
3. **Architecture v4** : v3b (socle 350 €, allocation unique α = 25 %, pas de prime d'activité, héritage E' K = 94 000 €, capital de départ exp K = 80 000 €, taxe à 1 % plafonnée, non-cotés à la vente, exil défendable) + éducation par non-remplacement + majoration 390 € ; **taux plat 41,0 %** (équilibre vérifié par `tauxEquilibre` ; v3b : 41,4 %). Les deux décisions se financent : le non-remplacement rapporte 5,5 Md€, la majoration en coûte 1,9.
4. **Résultats** : solde **+113,2 / +0,0 / −143,5 Md€** (central exact +0,01 : marge mince par construction, ⚠️ V9403) ; contraintes (1), (3) élargie, (4), (5), (6) tenues, (2) non tenue (écart 55,5 Md€) ; 15 règles et exceptions ; taux marginal à l'infini 71 % ; TME maximal 66 %. Cas types (€/mois) : smicard **+49**, couple avec un Smic **+41**, couple avec deux Smic −78, **parent isolé au Smic +112**, retraité locataire 0, RSA seul −13, cadre à 2 Smic +338, cadre à 4 Smic −20. Dixièmes (€/UC/mois) : D1 +52, D2 +208, D3 +67, D4 +49, D5 +91, D6 −7, D7 +10, D8 −136, D9 −271, D10 −1 085. Pression nette +183,2 Md€ (6,2 points de PIB), dont 169,1 pour le déficit actuel.
5. **Dette à 10 ans** (`risques/stress.js`, chemin « V4 ») : **56 / 100 / 151 %** sans choc (v3b : 56 / 99 / 152) ; chocs au central : IA à zéro 103 %, récession type 2009 106 %, +100 pb 105 %, krach immobilier −20 % 103 %, exil au haut de la fourchette 108 % (−24,4 Md€/an).
6. **Limites** : économie scolaire supposée répartie alors que la baisse démographique ne l'est pas (V9400) ; écart parent isolé / couple qui grandit, risque de séparations fictives non modélisé (V9402) ; économie à 10 ans traitée comme régime de croisière (V9404) ; celles des §§ 11 à 13.

## Architecture v3 (03/11 ; tableaux : `resultats-optimum.txt` § 12 ; H600 à H609)

Principe de l'auteur (03/11) : pas de seuils ni de tranches, des fonctions continues. L'exemption de 100 000 € de l'héritage « reçu à vie » et le coude du capital de départ C sont remplacés par des fonctions lisses ; la v3 y ajoute les décisions déjà prises (allocation unique α = 25 %, majoration 340 €, socle 350 €). Code : `../capital-de-depart/continu.js` (fonctions pures, tests dans `test_continu.js`) et options `heritageFonction` / `capitalFonction` d'`optimum.js`.

| régime d'héritage | K | impôt à 20 000 € | 58 000 € | 100 000 € | 300 000 € | 1 M€ | 10 M€ | taux marginal max | paient plus / moins |
|---|---|---|---|---|---|---|---|---|---|
| exemption 100 000 € (v2) | — | 0 | 0 | 0 | 100 000 | 450 000 | 4 950 000 | 50 % | — |
| **A. taux moyen 50 % × x/(x+K)** | **188 845 (190 000 retenu)** | 958 | 6 814 | 17 310 | 92 054 | 420 576 | 4 907 328 | 50 % (jamais atteint) | 76 % / 23 % |
| B. 50 % × (1 − e^(−x/K)) | 389 709 | 500 | 4 010 | 11 316 | 80 535 | 461 580 | 5 000 000 | **56,8 %** (à x = 2K) | 73 % / 26 % |
| C. taux marginal 50 % × x/(x+K) | 64 056 | 1 297 | 8 351 | 19 879 | 94 350 | 409 998 | 4 838 035 | 50 % (jamais atteint) | 79 % / 21 % |
| exemption 50 000 € | — | 0 | 4 000 | 25 000 | 125 000 | 475 000 | 4 975 000 | 50 % | — |
| A, même recette | 80 781 | 1 985 | 12 120 | 27 658 | 118 178 | 462 628 | 4 959 933 | 50 % | 66 % / 34 % |

1. **Neutre pour le budget, pas pour la justice** : à recette égale, solde et taux plat d'équilibre (41,1 %) ne bougent pas (< 0,1 Md€ ; recette de 89,0 / 72,7 / 52,1 Md€ à fuite de 18 / 33 / 52 %). Mais **76 % des héritiers paient plus** (l'héritier médian de 58 000 € : 6 800 € au lieu de 0) et les cumuls au-dessus de 213 000 € paient moins (−30 000 € à 1 M€, −190 000 € à 10 M€). Steelman : « on taxe la petite succession pour alléger le milliardaire ». La forme C, la plus proche de l'exemption, déplace encore plus de charge vers le milieu à recette égale. Alternative : un K plus petit et plus de recette (K = 81 000 € ≈ exemption de 50 000 € : +8,9 Md€ au central, taux d'équilibre 40,3 %).
2. **Forme A retenue (K = 190 000 €, à confirmer par l'auteur)** : un paramètre qui se lit (« à 190 000 € reçus, 25 % en moyenne »), taux marginal toujours sous 50 %. **B écartée** : son taux marginal dépasse le plafond de 50 % (jusqu'à 56,8 %).
3. **Capital de départ lissé** : g(H) = 40 000 € × e^(−H/K), K = 47 000 € (même coût central que C : 11,5 Md€). **Prix : pente initiale 86 % au lieu de 50 %** (à coût égal, toute fonction lisse a une pente plus raide ou une queue) ; la forme hyper à coût égal dépasse 100 % de pente (rejetée) ; gauss 78 %. Pour 50 % de pente : K = 80 000 €, +3,2 Md€ (taux d'équilibre 41,4 %) ; pour 67 % : K = 60 000 €, +1,4 Md€ (41,2 %). Taux marginal cumulé maximal (capital + impôt) : 50 % (C + exemption), 75 % (C + A), **86 %** (v3).
4. **Architecture v3** : taux plat **41,1 %** (taux d'équilibre vérifié par `tauxEquilibre`), socle 350 € (« 877 € garantis, dont 350 € versés à tous »), allocation unique α = 25 % (pas de prime d'activité), majoration parent isolé 340 €, héritage forme A K = 190 000 €, capital exp K = 47 000 €, taxe à 1 % plafonnée à 5 % du revenu sous la médiane (non-cotés à la vente), exil défendable 18 / 33 / 52 %, reste de la v2 inchangé.
5. **Résultats** : solde **+113,2 / +0,7 / −144,5 Md€** (4,9 % du PIB au haut) ; dette à 10 ans **56 / 99 / 151 %** (sans choc) ; chocs au central 103 % (IA à zéro), 105 % (récession 2009), 105 % (+100 pb), 103 % (krach immobilier −20 %), 108 % (exil au haut) ; cas types : smicard +48, couple 1 Smic +39, parent isolé Smic +10, retraité locataire 0, RSA −13, cadre 2 Smic +330, cadre 4 Smic −36 ; D1 +41, D2 +184, D5 +89, D8 −140, D10 −1 095 € par UC et par mois ; 15 règles et exceptions (v2 : 16) ; TME maximal 66 % ; taux marginal à l'infini 71,1 % ; contrainte (2) non tenue comme partout.
6. **Limites** : fuite supposée identique à tout montant (la fonction taxe des montants plus petits, plus difficiles à déplacer : ⚠️ V8601) ; queue de la loi des héritages mal connue (⚠️ V8600) ; pas d'effet de substitution sur les dons des parents (H607) ; les autres falaises (30e année des plus-values, seuil de 50 salariés, seuil de patrimoine des APL, sortie du RSA, condition de revenu du plafond de la taxe à 1 %) ne sont pas traitées ici.

## Architecture v3b (03/11 ; tableaux : `resultats-optimum.txt` § 13 ; H610 à H615)

Défaut de la v3 constaté : à recette égale, la forme A fait payer l'héritier médian (6 814 € sur 58 000 €) et fait payer **moins** les très gros héritages qu'avec l'exemption (−29 000 € à 1 M€, −43 000 € à 10 M€ ; le § 12.2 écrit −190 000 € pour 10 M€ par erreur de lecture, corrigée au § 13.2). On teste des formes plus convexes, sans seuil, au même coût que l'exemption de 100 000 €.

| forme (K calibré) | taux marginal max | impôt à 20 000 € | 58 000 € | 100 000 € | 300 000 € | 1 M€ | 10 M€ | paient plus / moins |
|---|---|---|---|---|---|---|---|---|
| exemption 100 000 € | 50 % | 0 | 0 | 0 | 100 000 | 450 000 | 4 950 000 | — |
| A (188 845) | 50 % | 958 | 6 814 | 17 310 | 92 054 | 420 576 | 4 907 328 | 76 % / 23 % |
| D, taux moyen x²/(x²+K²) (257 601) | **56,25 %** (écartée) | 60 | 1 399 | 6 548 | 86 340 | 468 886 | 4 996 684 | 69 % / 27 % |
| E, taux moyen x³/(x³+K³) (277 160) | **66,7 %** (écartée) | 4 | 263 | 2 243 | 83 867 | 489 577 | 4 999 894 | 58 % / 27 % |
| D', taux marginal x²/(x²+K²) (87 132) | 50 % | 170 | 3 414 | 12 792 | 93 881 | 435 353 | 4 931 946 | 72 % / 25 % |
| **E', taux marginal x³/(x³+K³) (93 690 ; 94 000 retenu)** | 50 % | 24 | 1 520 | 9 354 | 95 612 | 443 561 | 4 943 357 | 63 % / 28 % |

1. **Convexifier le taux moyen est impossible sous plafond de 50 %** : D et E dépassent 50 % de taux marginal (56,25 % et 66,7 %). On convexifie le taux **marginal** (D', E') : impôt = intégrale, plafond respecté par construction.
2. **E' retenue (K = 94 000 €)** : l'héritier médian paie 1 520 € au lieu de 6 814 € ; l'écart à l'exemption est de −6 400 € à 1 M€ et −6 600 € à 10 M€ (A : −29 000 / −43 000). Défauts restants : personne ne paie zéro (24 € à 20 000 €) ; formule moins lisible qu'un seuil.
3. **Capital de départ exp K = 80 000 €** : pente initiale 50 %, coût +3,2 Md€ (14,7 contre 11,5) ; **taux marginal cumulé maximal capital + impôt : 50 %** (v3 : 85 % ; objectif ≤ 75 % tenu).
4. **v3b** : taux plat **41,4 %** (équilibre vérifié), solde **+114,3 / +0,8 / −145,9 Md€**, dette à 10 ans **56 / 99 / 152 %** ; smicard +43 (v3 : +48), couple avec un Smic +35 (+39), parent isolé +4 (+10), D1 / D5 / D10 : +40 / +83 / −1 126 (v3 : +41 / +89 / −1 095). La v3b est **meilleure sur la justice** (médian, gros héritages, marginal cumulé) et **un peu moins bonne sur le budget** (0,3 point de taux plat). Choix de l'auteur à confirmer : V8700 à V8702.

## Allocation unique dégressive ? (03/11 ; tableaux : `resultats-optimum.txt` § 11 ; H590 à H599)

Idée de l'auteur : supprimer la prime d'activité, garder un seul montant garanti et un complément dégressif (877 € − socle − α × revenu d'activité net). Calcul sur la v2, taux plat d'équilibre à chaque fois. Ordres de grandeur sous hypothèses.

| variante | taux plat | coût (Md€) | solde b / c / h | smicard | couple 1 Smic | parent isolé | TME max | règles |
|---|---|---|---|---|---|---|---|---|
| v2 (prime gardée) | 40,9 % | 17,1 | +112 / +1 / −143 | +46 | +267 | +16 | 83 % | 16 |
| α = 15 %, majoration 350 € | 41,9 % | 25,1 | +117 / 0 / −150 | +151 | +143 | +15 | 66 % | 15 |
| α = 20 %, majoration 340 € | 41,4 % | 20,0 | +113 / 0 / −146 | +101 | +93 | +4 | 68 % | 15 |
| **α = 25 %, majoration 340 €** | **41,1 %** | **16,2** | **+113 / +1 / −144** | **+48** | **+39** | **+10** | **66 %** | **15** |
| α = 30 % | 40,5 % | 13,4 | +109 / 0 / −142 | −3 | −11 | −158 | 65 % | 15 |

1. **La plus simple qui protège le smicard : α = 25 %** : 8 paramètres de prime remplacés par 1, coût 16,2 Md€ contre 17,1, taux plat +0,2 point, TME maximal 66 % au lieu de 83 %. À α = 30 %, le smicard seul perd déjà.
2. **Piège : le plancher des familles.** À majoration de 250 €, le parent isolé au Smic perd 160 à 180 € (il touchait ≈ 180 € de prime) : socle + majoration + prestations atteignent déjà le plancher de 1 300 €. Il faut 340 à 350 € de majoration, ou un plancher familial plus haut (non modélisé).
3. **Le prix** : le couple avec un Smic passe de +267 à +39 €, et le travail à très temps partiel ne paie plus mieux qu'aujourd'hui (TME plat à 56 %, participation à 0,25 Smic 0 % contre +13 % avec la prime ; 10 h/semaine : −14 € contre +82 €). L'allocation est plus simple et plus lisible, la prime protégeait mieux les petits temps partiels et les couples.
4. **Seuil de 10 h** : −1,4 Md€ mais TME de 100 % sous le seuil, sans bonus de franchissement : non recommandé. **Non-recours** supposé nul si versé automatiquement ; la v2 automatisée subit le même surcoût (8 à 9 Md€ à recours de 100 %), il ne départage rien.
5. **Limite** : le coût du complément est calé sur la seule personne seule (k ≈ 0,21, V8201) : sous-estimé pour α bas (V8501). L'auteur décide : simplicité (α = 25 %) ou protection des temps partiels et des couples (v2).

## Socle plus haut ? (03/11 ; tableaux : `resultats-optimum.txt` § 10 ; H581 à H586)

L'auteur trouve 350 € trop bas. Grille sur la v2 (seuls socle et taux plat changent ; taux = le plus petit au dixième de point qui équilibre le central). Tout est de l'ordre de grandeur, sous hypothèses.

| socle | taux plat | solde b / c / h (Md€) | smicard | couple 1 Smic | parent isolé Smic | D1 | cadre 3 Smic | masse salariale (central) | contraintes non tenues |
|---|---|---|---|---|---|---|---|---|---|
| 350 € | 40,9 % | +112 / +1 / −143 | +46 | +267 | +16 | +24 | +346 | −2,0 % | (2) |
| 400 € | 42,7 % | +118 / 0 / −156 | +60 | +331 | +30 | +44 | +251 | −3,1 % | (2) |
| 450 € | 44,7 % | +127 / 0 / −169 | +70 | +391 | +41 | +63 | +140 | −4,4 % | (2) |
| 500 € | 46,9 % | +137 / 0 / −185 | +76 | +448 | +47 | +81 | +14 | −5,8 % | (2), (5) taux marginal 76,9 % |
| 550 € | 49,4 % | +151 / 0 / −203 | +77 | +498 | +47 | +100 | −137 | −7,5 % | (2), (5) |
| 600 € | 52,3 % | +167 / 0 / −225 | +69 | +540 | +39 | +118 | −320 | −9,7 % | (2), (4), (5) |
| 700 € | 60 % (pas d'équilibre) | +210 / −10 / −307 | +16 | +587 | −14 | +149 | −839 | −16,4 % | (1) à (5) |

1. **Jusqu'à 450 € le socle plus haut est tenable** (contraintes (1), (3) à (6) tenues, taux marginal à l'infini 74,7 %) : il paie 2 à 3 points de taux plat par 100 €, protège mieux le smicard (+46 à +70), le couple (+267 à +391) et D1 (+24 à +63). À 500 € la contrainte (5) saute (76,9 %), à 600 € le plafond de 50 % (taux plat 52,3 %), à 700 € plus rien ne tient.
2. **Qui paie** : la classe moyenne haute. Le cadre à 3 Smic passe de +346 à +140 (450 €) puis devient perdant dès 550 €, D6-D7 passent sous zéro dès 400-450 €.
3. **Le gain des bas salaires plafonne vers 550 €** (smicard +77) puis redescend : au-delà, le taux plat reprend aux actifs ce que le socle donne.
4. **Offre de travail** : la masse salariale recule de −2,0 % (350 €) à −5,8 % (500 €) contre le droit actuel (module d'offre de travail du modèle) ; la participation de la personne seule à 0,25 Smic fond de +12,9 % à −0,4 % entre 350 et 600 €. Le haut du barème se dégrade : −143 Md€ (4,9 % du PIB) à 350 €, −185 Md€ (6,3 %) à 500 €.
5. **Variante « socle haut + prime d'activité réduite » : rejetée.** À socle égal, retirer 25 points de prime ne gagne que 0,1 à 0,4 point de taux et coûte 57 €/mois au smicard ; à 40,9 % imposé, aucune variante ne tient l'équilibre en protégeant mieux que la v2. La prime reste le levier de protection le moins cher.
6. **Recommandation de Claude (révisable)** : si l'auteur veut relever le socle, **450 €** est le plafond tenable (44,7 %) ; je garde 350 € dans la v2 parce que le haut est déjà à −4,9 % du PIB et que chaque 50 € de plus l'aggrave de 12 à 23 Md€. C'est un arbitrage de valeurs, pas un résultat du modèle. Points non confirmés : V8400 à V8403.

## Architecture finale v2 (03/11 ; tableaux : `resultats-optimum.txt` § 9 ; H571 à H580)

Elle remplace la finale de l'affinage sur trois points : la sortie du plancher « plat » est active, l'exil suit les fourchettes défendables, la dette à 10 ans est calculée. Tranchée par Claude, révisable par l'auteur.

1. **Paramètres** : taux plat **41 %**, socle **350 €**, taxe à 1 % brute plafonnée à 5 % du revenu sous la médiane (non-cotés taxés à la vente), héritage « reçu à vie » (exemption de 100 000 €, plafond de 50 % tous impôts confondus, conjoint exonéré), capital de départ C, majoration parent isolé **250 €** par enfant, aide au logement des retraités locataires, **prime d'activité à 100 %** de son barème, **sortie du plancher « plat »** (le complément fond au taux plat), fuite des transmissions 18 / 33 / 52 % et érosion du top 1 % 20 / 35 / 55 %. Le reste est inchangé (fin du report 150-0 B ter, e2 + CIR supprimé, économies A, niches de TVA supprimées).
2. **Soldes : +113,1 / +2,2 / −142,9 Md€** (bas / central / haut ; 4,9 % du PIB au haut). Avec l'exil des modules, la même architecture donne +113,1 / +3,3 / −141,8 : **les nouvelles fourchettes d'exil ne changent presque rien** (−1,1 au central). La fuite plus forte des transmissions coûte 6 Md€ au haut, et la taxe moins érodée en rend 2,2.
3. **Cas types** (€/mois, central) : smicard **+44**, couple avec un Smic **+265**, couple avec deux Smic +299, parent isolé au Smic **+14**, retraité locataire 0, personne seule au RSA −13, cadre à 3 Smic +338, cadre à 6 Smic −20.
4. **Dixièmes** (€/UC/mois) : D1 **+23**, D2 +146, D3 +68, D5 +94, D6 −5, D8 −136, D9 −270, D10 −1 085. Pression nette du socle : +182 Md€ (6,2 points de PIB), dont 171 pour combler le déficit actuel.
5. **Dette à 10 ans** (`modeles/risques/stress.js`, chemin V2, départ ≈ 123,5 % du PIB en 2029) : **57 / 99 / 151 %** sans choc (bas / central / haut). Au central : IA à zéro 102 %, récession type 2009 105 %, +100 pb 104 %, krach immobilier −20 % 102 %, **exil au haut de la fourchette 107 %** (−24 Md€/an), contre 120 % avec l'ancien stress « exil doublé ».
6. **Contraintes tenues** : (1) équilibre central, (3) élargie (D1-D3, smicard, couple un Smic, parent isolé au Smic, retraité locataire), (4) plafond de 50 %, (5) taux marginal à l'infini de 71 %, (6) effort du retraité modeste de 5 %. **Non tenue : (2)** (écart de 54,8 Md€ au haut), comme partout.
7. **« Moins de règles à solde voisin »** : les huit architectures à moins d'un demi-point du taux le plus bas ont toutes 16 règles et exceptions, et toutes gardent la prime d'activité. Sans elle, le mieux est 45 % et le smicard perd encore 100 €. Le critère ne départage donc rien : la v2 a une règle de plus que la finale (la sortie du plancher).
8. **Tension à nommer (H577)** : avec la prime d'activité à 100 %, le taux marginal effectif maximal de la personne seule monte à **82,7 %** vers 0,42 Smic. Le critère de 80 % qui avait fait choisir la sortie « plat » n'est donc plus tenu, et aucune architecture qui protège le smicard ne le tient. C'est toujours bien moins que les 131 % du droit actuel.
9. **Le prix de l'équilibre** : la majoration parent isolé baisse de 400 à 250 €, si bien que le parent isolé au Smic ne gagne plus que 14 €/mois (contre 288 €). La prime d'activité est gardée en entier (10,7 Md€, la règle complexe qu'on voulait supprimer), et la sortie du plancher coûte 6,4 Md€.
10. **Ce qui reste à décider par l'auteur** : la (2) n'est tenue par aucune architecture (règle de lancement du chantier 5), la prime d'activité contre la simplicité, et un demi-point de taux en plus pour redonner de la marge au parent isolé : à 41,5 % avec une majoration de 400 €, le solde est de +117,7 / +2,1 / −145,9, le parent isolé au Smic gagne 304 €, le smicard 34 € et D1 52 € (`resultats-optimum.txt` § 9.2, liste des architectures voisines).

## Sortie du plancher de 877 € (03/11, suite de l'affinage ; tableaux : `resultats-optimum.txt` § 8)

Le défaut était réel : le plancher de 877 € n'était versé qu'à ceux sans aucun revenu, donc une falaise (TP de 270 % à 0,1 Smic pour une personne seule). J'ai écrit la règle de sortie en trois variantes : **complément = plancher du ménage − revenu sans activité − α × gain de revenu d'activité et de prime**, avec α = 100 % (« maintien »), 38 % (« dégressif », comme la prime d'activité) ou α = taux plat (« plat »). **Tranché par Claude : « plat »**, parce qu'il supprime la falaise (TP de 44 % à 0,25 Smic contre 111 %), ne dépasse jamais 79 % de TME (le droit actuel monte à 131 % vers 0,4 Smic) et n'ajoute aucun paramètre. Coût central : **7,0 Md€** (5,5 à 8,8 ; « maintien » 1,6, mais il garde un TME de 100 % jusqu'à 0,27 Smic ; « dégressif » 7,7). Participation : +10 % d'emploi à 0,25 Smic et +16 % à 0,5 Smic par rapport au droit actuel (élasticité de 0,4 ; ordre de grandeur, pas une prévision). Règles : +1 exception (15 → 16), aucun paramètre. **Le défaut n'est pas basculé** : avec « plat », la finale tombe à −6,6 Md€ au central ; il faut 41,5 % ou une nouvelle recherche (41 %, majoration 250 €, prime d'activité 100 % : +3,3), ce qui déplace les §§ 1 à 7. Le coût vient d'un calcul par adulte calibré sur la prime d'activité (k ≈ 0,21, ⚠️ V8201) : c'est la partie fragile. Hypothèses H561 à H570 (`methode.md` § 33).

## Affinage du 03/11 : dix lignes pour l'auteur

1. **Architecture finale recommandée** (tranchée par Claude sur délégation, révisable) : taux plat **40,5 %**, socle **350 €**, taxe à 1 % plafonnée à 5 % du revenu sous la médiane, titres non cotés taxés à la vente, héritage « reçu à vie » (exemption de 100 000 €, plafond de 50 % tous impôts confondus, conjoint exonéré), capital de départ C, majoration parent isolé de **400 €** par enfant, aide au logement des retraités locataires, et **prime d'activité maintenue à 80 % de son barème actuel**. Le reste est inchangé : fin du report 150-0 B ter, e2 + CIR supprimé, économies structurelles A, niches de TVA supprimées.
2. **Solde : +109,7 / +0,5 / −140,0 Md€** (bas / central / haut). Au haut, le déficit atteint 4,8 % du PIB.
3. **Qui gagne, qui perd** (€/mois, central) : smicard **+8** (il perdait 165 €), couple avec un Smic **+158** (il perdait 300 €), couple avec deux Smic +244, parent isolé au Smic +288, cadre à 3 Smic +378, cadre à 6 Smic +61. La personne seule au RSA perd 13 €, le retraité locataire est à 0. Par dixième (€/UC/mois) : D1 +3, D2 +189, D3 +55, D5 +93, D6 −2, D8 −120, D9 −248, D10 −1 033.
4. **Le levier le moins cher est, de très loin, la prime d'activité maintenue.** Pour que le smicard ne perde plus au taux de 40 %, il faut garder 72 % du barème : **7,7 Md€**, et le couple avec un Smic y gagne déjà 121 €. Les autres leviers coûtent bien plus. Un abattement de 411 € sur les premiers revenus d'activité coûte 71 Md€ (125 Md€ s'il doit aussi protéger le couple). Un bonus d'activité individuel coûte 29 à 34 Md€ (53 à 61 avec le couple). Monter le socle en le finançant par le taux ne marche pas : à 550 € et 48,5 %, le smicard perd encore 134 €. La raison : la prime est familiale et sous condition de ressources du foyer, alors que les leviers individuels paient aussi les seconds salaires des ménages aisés.
5. **Le prix à nommer : c'est exactement la règle complexe qu'on voulait supprimer.** La prime d'activité, c'est un barème familial à environ 8 paramètres, une demande à la CAF et du non-recours : un smicard qui ne la demande pas perd 175 €/mois. Le système passe de 13 à 15 règles et exceptions. Piste : la verser automatiquement à partir des données de paie, ce qui coûterait jusqu'à 4,4 Md€ de plus si un tiers des ayants droit ne la demandent pas aujourd'hui (⚠️ V7874).
6. **Incitation au travail** : le taux marginal effectif est de 52 % au Smic (60 % aujourd'hui) et de 64 % à 1,25 Smic (78 % aujourd'hui). Le taux de participation au Smic est de 58 % (59 % aujourd'hui). **Mais l'affinage révèle un défaut du palier 1** : le plancher de 877 € réservé aux personnes « sans autre revenu » fait perdre 100 % des premiers euros gagnés, jusque vers 0,4 à 0,5 Smic (participation taxée à 100 % à 0,25 Smic, contre 56 % aujourd'hui). La règle de sortie du plancher est à écrire (⚠️ V7875).
7. **Le stabilisateur sur le seul taux est une fausse sécurité.** Au haut, deux points de taux de plus ne rapportent que **10 Md€** (de −140 à −130). Dans ce scénario, l'assiette réagit tellement qu'augmenter le taux ne rapporte presque plus. Baisser le socle de 100 € rapporte 46 Md€. Les deux ensemble ramènent le déficit sous 3 % du PIB (−84), mais le smicard perd alors 132 € et D1 72 €. Au bas, la règle rend 30 à 73 Md€ (taux −2 points, socle +100 €). **Ma recommandation** : une règle automatique sur le taux (±0,5 point par an, ±2 points), plus un frein à la dépense voté d'avance. Le socle ne doit pas servir de variable d'ajustement, parce que c'est le bas qui paie.
8. **Pression fiscale** : les prélèvements nets du socle augmentent de **186 Md€ (6,3 points de PIB)**. **169,6 Md€ servent à combler le déficit actuel**, et 16,8 Md€ financent les dépenses nouvelles nettes des économies. Le système lui-même n'ajoute donc qu'environ 0,6 point : c'est l'équilibre budgétaire qui fait monter la pression. La variante la plus légère (économies A + B, éducation « économie », 39,5 %, PPA à 70 %) reste à +176 Md€ (6,0 points). Être libéral et viser l'équilibre sans baisse massive de la dépense, c'est une contradiction : pour que la pression nette ne monte pas, il faudrait 176 Md€ d'économies de plus.
9. **Artefact H540** : la clé des prestations familiales ne gonflait pas D1 (28 % de la majoration, contre 30 % avec la clé des parents isolés). Elle étalait en revanche 52 % de la majoration sur D3-D10, où il n'y a pas de parent isolé au Smic. J'ai fait deux corrections : la majoration est désormais répartie sur les dixièmes des parents isolés (H556), et la contrainte (3) porte aussi sur le smicard et le couple avec un Smic, pour qu'une moyenne de dixième ne puisse plus cacher un perdant. Reste un fait à nommer : **sans majoration, D1 perdrait 79 €**. D1 tient grâce à cette rustine.
10. **Contraintes tenues : (1), (3) élargie, (4), (5) et (6). La (2) ne l'est pas** (écart de 51,9 Md€ au haut). Aucune variante financée par un abattement ou un bonus ne tient la (3) élargie.

### Les leviers à protection égale (taux 40 %, socle 350 €, majoration 500 €, avant refinancement)

| levier | montant | coût b / c / h (Md€) | smicard / couple un Smic | TME 0,5 / 1 / 1,25 Smic | paramètres |
|---|---|---|---|---|---|
| aucun | — | 0 | −165 / −300 | 40 / 40 / 48 % (actuel 70 / 60 / 78 %) | 0 |
| (1) abattement sur les premiers revenus d'activité | 411 € (smicard) ; 750 € (+ couple) | 69 / 71 / 72 ; 119 / 125 / 128 | 0 / −136 ; +135 / 0 | 40 / 40 / 48 % | 1 |
| (2) bonus d'activité, extinction à 1,3 Smic | 165 € ; 300 € | 24 / 29 / 31 ; 43 / 53 / 56 | 0 / −135 ; +135 / 0 | 40 / 60 / 66 % ; 40 / 77 / 80 % | 3 |
| (2) bonus d'activité, extinction à 1,6 Smic | 165 € ; 300 € | 30 / 34 / 35 ; 55 / 61 / 64 | 0 / −135 ; +135 / 0 | 40 / 50 / 57 % ; 40 / 58 / 64 % | 3 |
| (3) socle plus haut financé par le taux | 550 € à 48,5 % | (équilibre central) | −134 / −69 | — | 0 |
| **(4) prime d'activité maintenue** | **72 % du barème** | **7,7 / 7,7 / 7,7** | **0 / +121** | 50 / 50 / 62 % | ≈ 8 |

Une fois financées (recherche ciblée, `resultats-optimum.txt` § 7.2), seule la prime d'activité tient la (3) élargie. L'abattement (meilleure variante : 44,5 %, 100 €) laisse le smicard à −135. Le bonus (45 %, 300 €) laisse le couple à −50 et le parent isolé à −21.

### Stabilisateur (écart de plus de 15 Md€ à l'équilibre ; 10 ans, scénario réalisé dès l'an 1)

| scénario | taux seul (±0,5 pt/an, ±2 pts) | socle seul (∓25 €/an, ±100 €) | les deux |
|---|---|---|---|
| haut | −140 → −130 ; smicard −32 | −140 → −94 ; smicard −92, D1 −65 | −140 → **−84** ((2) tenue) ; smicard −132, D1 −72 |
| bas | +110 → +80 (38,5 %) | +110 → +67 (450 €) | +110 → +37 |

Taux seul jusqu'au plafond du taux marginal (45 %) : −120 au haut. Limite : le calcul est statique. Il n'y a ni délai de constatation du solde, ni dette accumulée, ni retour au central (H560).

### Pression fiscale nette du socle (central)

| architecture | taux | variation nette | points de PIB | dont déficit comblé | dont dépenses nouvelles nettes |
|---|---|---|---|---|---|
| recommandation du chantier 2 | 40 % | +190,2 | 6,5 | 169,7 | 20,6 |
| « assurance » (§ 1) | 44,5 % | +262,1 | 8,9 | 253,0 | 9,1 |
| **finale** | **40,5 %** | **+186,3** | **6,3** | **169,6** | **16,8** |
| finale + A + B + éducation « économie » | 39,5 % | +175,9 | 6,0 | 169,8 | 6,2 |

Steelman : « maintenir la prime d'activité, c'est renoncer à la simplification ». C'est vrai, et c'est le choix le plus discutable de cette architecture. La réponse : au même niveau de protection, la version simple (abattement ou bonus individuel) coûte 4 à 16 fois plus, soit l'équivalent de 2 à 12 points de taux plat (≈ 10 Md€ le point), et elle fait perdre d'autres personnes. L'auteur peut préférer la simplicité, mais il faut alors accepter que le smicard perde environ 165 €, ou monter le taux. **Dilemme pour l'auteur (synthèse)** : prime d'activité maintenue (7,7 à 8,5 Md€, une règle complexe) ou simplicité (le smicard perd).

## Dix lignes pour l'auteur (chantier 2, avant l'affinage)

1. **L'architecture retenue, dans l'ordre de priorité demandé** : taux plat de 44,5 %, socle de 350 €, taxe à 1 % brute sans abattement, plafonnée à 5 % du revenu pour les ménages sous la médiane (le reste est différé jusqu'à la vente ou la succession). S'y ajoutent l'héritage à 50 % plafonné tous impôts confondus avec le conjoint exonéré, la fin du report 150-0 B ter, les économies e2 et la suppression du CIR, les économies structurelles A du chantier 3, la fin des niches de TVA, une majoration de 500 € par enfant pour les parents isolés et le maintien de l'aide au logement des retraités.
2. **Solde : +216 / +84 / −86,5 Md€** (bas / central / haut). C'est l'équilibre au central et moins de 3 % du PIB au haut, mais avec **84 Md€ d'excédent au central** : pour tenir au haut, il faut surtaxer le central. L'écart entre les deux scénarios (≈ 170 Md€) est le vrai problème.
3. **Qui gagne, qui perd** (€ par UC et par mois, central) : D2 +6, D3 +22, D5 +9 ; **D1 −11**, D4 −5, D6 −112, D7 −119, D8 −299, D9 −491, D10 −1 486. Côté cas types : **le smicard perd 254 €/mois**, le couple avec un Smic 390 € et le cadre à 6 Smic 581 €. Le parent isolé au Smic gagne 263 €, le retraité locataire est à 0.
4. **Contraintes tenues : (1), (2), (4), (5) et (6). La (3) n'est pas tenue, à 11 €/UC/mois près pour D1.** Aucune des 2,7 millions d'architectures évaluées ne tient à la fois (1), (2) et (3). Tenir au haut demande un taux haut et un socle bas, et c'est le premier dixième qui le paie.
5. **Si l'on passe « ne perdre personne » avant la robustesse au haut**, la meilleure architecture devient : **37 %, socle de 350 €**, taxe plafonnée à 10 %, le reste inchangé. Elle tient tout sauf (2) : **+104 / 0,0 / −126**. D1 gagne 4 €, D2 à D9 gagnent de 62 à 157 €, D10 perd 715 €. Le smicard perd quand même 105 €.
6. **La taxe à 1 % est le levier qui rend tout possible** (93 Md€ nets au central). Sans elle, même à 45 % de taux et 350 € de socle, ni (2) ni (3) ne tiennent, et le parent isolé perd 346 €. **Le seuil de protection sur le modèle de l'article 1391 B ter coûte peu en croisière** (0,2 à 0,4 Md€), mais 3 à 8 Md€ de trésorerie par an les premières années. Sans condition de revenu, il coûterait 25 à 53 Md€ de trésorerie par an.
7. **Recettes** : toutes les architectures dépassent largement l'objectif « au moins autant de recettes qu'aujourd'hui ». Les prélèvements nets du socle montent de 6 à 9 points de PIB (+262 Md€ pour l'architecture retenue). **C'est une contradiction à nommer** : un système libéral qui équilibre en prélevant 9 points de plus.
8. **Simplicité** : 5 règles et 6 exceptions (11) pour chaque architecture avec la taxe, contre 9 sans elle. L'exception du conjoint coûte 18,6 Md€ au central : c'est l'exception la plus chère du système.
9. **Les trois paramètres les plus fragiles** (effet sur le solde central) : les réactions de comportement du scénario haut sur le taux et le socle (−124 Md€) ; les hypothèses de la taxe à 1 % (érosion, capitalisation, valorisation : −18,5) ; l'écart de déclaration de l'héritage à 40 % au lieu de 31 % (−13,5).
10. **Ma recommandation, avec le paquet du chantier 4 imposé** (capital de départ C et héritage « reçu à vie » avec 100 000 € d'exemption, qui coûtent ensemble 35 Md€ au central) : **40 %, socle de 350 €, taxe plafonnée à 5 % sous la médiane, majoration de 500 €**, le reste comme au point 1 → **+109 / +0,6 / −137**. Elle tient tout sauf (2). Aucun dixième ne perd avant D8 (D1 +4, D5 +107, D9 −268, D10 −1 023), mais le smicard seul perd 165 € et le couple avec un Smic 300 €, le taux marginal est de 70 %, et il n'y a plus de 29 000 € prélevés à l'héritier médian. Le prix : passer (3) avant (2), ce qui veut dire un déficit possible de 4,7 % du PIB au haut, et une règle de pilotage à écrire. Si l'on garde (2) en priorité, le paquet du chantier 4 n'est plus compatible avec (2) (aucune architecture ne la tient : écart minimal de 14 Md€ à 45 %).

## 1. Ce qui a été cherché

**Leviers** (grille complète, 2 744 280 architectures, 24 s) :

| levier | valeurs |
|---|---|
| taux plat | 35 à 45 %, pas de 0,5 point |
| socle | 350 à 600 €, pas de 25 € |
| taxe à 1 % | aucune ; brute ou nette de dettes × abattement 0 ou 100 000 € × plafonnement au revenu (aucun, 5, 10, 15 %, sous la médiane) × titres non cotés taxés à la vente ou non (33 variantes) |
| héritage | 50, 45, 40 %, plafonné à 50 % de la valeur transmise tous impôts confondus (imputation de l'impôt sur le gain au décès) ; conjoint exonéré |
| fin du report 150-0 B ter | oui / non |
| économies e1-e4 | aucune, e1, e2, e2 + CIR recentré, e2 + CIR supprimé |
| majoration parent isolé | 200,78 (ASF), 250, 300, 350, 400, 500 € par enfant |
| niches de TVA et d'accises | maintenues / supprimées (chantier 3 : 8,5 / 4,7 / 2,4) |

**Fixes** : réforme immobilière (RP exonérée, base réelle, fin des DMTO), décès = réalisation avec imputation, fin de la purge de l'assurance-vie, aide au logement des retraités locataires (correctif a), économies structurelles A du chantier 3 (16,1 / 11,7 / 5,8), éducation au défaut tranché (redéploiement vers le tuteur : −0,2 / −1,6 / −4,1). L'écart avec la variante « économie » est de **+5,7 / +5,5 / +6,3 Md€** (pour la synthèse).

**Contraintes, dans l'ordre** : (1) solde ≥ 0 au central ; (2) solde ≥ −88 Md€ au haut ; (3) D1, D2 et D3 non perdants au central après correctifs, et cas types parent isolé au Smic et retraité locataire au minimum vieillesse non perdants ; (4) plafond de 50 % sur les transmissions ; (5) taux marginal à l'infini ≤ 75 % ; (6) effort de la taxe ≤ 10 % du revenu pour le retraité propriétaire modeste (maison de 300 000 €, pension de 1 400 €).

**Ordre de préférence** : les contraintes d'abord, dans l'ordre. Si une contrainte n'est tenue nulle part, on prend la plus petite violation (H544). Ensuite viennent le taux plat le plus bas, puis le socle le plus haut, puis le moins de règles et d'exceptions (demande de l'auteur), puis le meilleur solde au haut.

## 2. Le résultat central : (1) + (2) + (3) n'existe pas

| contraintes tenues, dans l'ordre | architectures |
|---|---|
| aucune dès (1) | 2 263 964 |
| (1) seulement | 476 166 |
| (1) et (2) | 4 150 |
| (1), (2) et (3) | **0** |

Les 4 150 architectures qui tiennent (1) et (2) ont toutes un taux plat d'au moins 43,5 % et un socle de 350 à 400 €. À ce niveau, D1 perd (environ 11 €/UC/mois dans le meilleur des cas), alors même que la majoration parent isolé est à 500 €. Le premier dixième paie la robustesse au haut.

## 3. Les architectures

| | **retenue** (ordre demandé) | « ne perdre personne, taux bas » ((2) relâchée) | « socle généreux » ((2) relâchée, socle d'abord) | contre-épreuve sans taxe à 1 % |
|---|---|---|---|---|
| taux plat / socle | 44,5 % / 350 € | 37 % / 350 € | 44,5 % / 550 € | 45 % / 350 € |
| taxe à 1 % | brute, plafond 5 % | brute, plafond 10 % | brute, plafond 10 % | aucune |
| majoration parent isolé | 500 € | 500 € | 300 € | 200,78 € |
| solde b / c / h | **216,0 / 83,9 / −86,5** | 104,2 / 0,0 / −125,9 | 135,5 / 4,1 / −171,1 | 120,1 / 7,3 / −147,8 |
| contraintes non tenues | (3) : D1 −11 | (2) : écart 37,8 | (2) : écart 83,1 | (2) et (3) |
| D1 / D2 / D3 (€/UC/mois) | −11 / 6 / 22 | 4 / 63 / 107 | 76 / 110 / 131 | −55 / −16 / 19 |
| D8 / D9 / D10 | −299 / −491 / −1 486 | −12 / −120 / −715 | −142 / −327 / −1 307 | −118 / −214 / −1 233 |
| smicard seul / couple un Smic | −254 / −390 | −105 / −241 | −54 / +10 | −264 / −400 |
| cadre 3 Smic / 6 Smic | +56 / −581 | +659 / +622 | +256 / −381 | +16 / −661 |
| taux marginal à l'infini | 74,5 % | 67 % | 74,5 % | 75 % |
| prélèvements, nets du socle | +262 Md€ (8,9 pts de PIB) | +178 (6,1) | +164 (5,6) | +174 (5,9) |
| règles + exceptions | 5 + 6 | 5 + 6 | 5 + 6 | 4 + 5 |
| année 1 de la montée du socle (250 €) | D1 −79, smicard −354 | D1 −63, smicard −205 | D1 −127, smicard −354 | D1 −123, smicard −364 |

Lecture :
- **La retenue** est robuste, mais elle fait perdre D1 et toute la moitié haute, y compris les classes moyennes salariées (smicard, couple avec un Smic). Elle n'est pas défendable politiquement telle quelle : son excédent central de 84 Md€ est le prix d'une assurance contre le scénario haut.
- **« Taux bas »** est le meilleur compromis à mes yeux : on y perd peu de monde (D1 +4, D10 −715 €/UC/mois), avec un taux marginal de 67 %, et elle est juste à l'équilibre au central. Au haut, elle est à −126 Md€ (4,3 % du PIB). Elle a besoin d'une règle de pilotage (stabilisateur).
- **« Socle généreux »** montre la pente : chaque point de taux plat finance environ 25 € de socle (frontière, `resultats-optimum.txt` § 5). À 45 %, le socle plafonne à 550-575 €, et D8-D10 paient.
- **Sans taxe à 1 %**, rien ne tient en dehors de (1) : la taxe vaut 93 Md€, soit l'équivalent de 9 à 10 points de taux plat.

## 3 bis. Avec le paquet du chantier 4 (capital de départ et héritage « reçu à vie »)

Données du chantier 4 (`modeles/capital-de-depart/resultats.md`) : le capital C (garantie de 40 000 € à 25 ans, dégressive à 50 % de l'héritage reçu) coûte 10,1 / 11,5 / 13,0 Md€. L'impôt « reçu à vie » à 100 000 € d'exemption garde 70,5 / 97,5 = 72,3 % de la recette d'héritage (H548). Appliqué aux droits du modèle (fuite de 31 %), il coûte **28,7 Md€ au central** (27 dans le chantier 4, qui prend une fuite de 35 %). À 50 000 € d'exemption, il coûte 17,5. L'exception du conjoint coûte alors moins (13,5 au lieu de 18,6).

| | retenue sans le paquet | **avec le paquet, ordre demandé** | **avec le paquet, (3) avant (2) : recommandation** | paquet à 50 000 €, (3) avant (2) |
|---|---|---|---|---|
| taux plat / socle | 44,5 % / 350 € | 45 % / 350 € | **40 % / 350 €** | 39,5 % / 350 € |
| taxe à 1 % / majoration | plafond 5 % / 500 € | plafond 10 % / 200,78 € | plafond 5 % / 500 € | plafond 5 % / 500 € |
| solde b / c / h | 216,0 / 83,9 / −86,5 | 188,0 / 65,4 / −102,3 | **109,3 / 0,6 / −136,9** | 113,7 / 4,0 / −133,4 |
| contraintes non tenues | (3) | (2) écart 14,2 ; (3) | (2) écart 48,8 | (2) écart 45,4 |
| D1 / D5 / D8 / D10 | −11 / 9 / −299 / −1 486 | −80 / −30 / −326 / −1 541 | 4 / 107 / −127 / −1 023 | 6 / 117 / −108 / −972 |
| smicard / couple un Smic / parent isolé Smic | −254 / −390 / +263 | −264 / −400 / −346 | −165 / −300 / +352 | −155 / −290 / +362 |
| taux marginal à l'infini | 74,5 % | 75 % | 70 % | 69,5 % |
| prélèvements nets du socle | +262 | +244 | +190 (6,5 pts) | +194 |
| règles + exceptions | 11 | 13 | 13 | 13 |

Avec le paquet imposé, aucune architecture ne tient (2), même à 45 %. Le capital et l'exemption coûtent l'équivalent de 3,5 points de taux plat au central (35 Md€). Le capital de départ n'apparaît pas dans les dixièmes de niveau de vie (le modèle ne suit pas les âges) : ses gagnants sont les 25 ans sans héritage, qui n'ont pas de colonne ici.

## 4. Valeur des leviers autour de l'architecture retenue (Δ solde central)

Taux plat +1 point : +9,8 (+3,4 seulement au haut, car les réactions rongent le gain). Socle −50 € : +22. Sans taxe à 1 % : −93. Taxe nette de dettes : −15. Abattement de 100 000 € : −21. Non-cotés taxés à la vente : −1,1. Héritage à 40 % : −10,9. **Sans exception du conjoint : +18,6.** Report maintenu : −3,7. Économies e1-e4 nulles : −13,3. Économies structurelles A + B : +5,1. Niches de TVA maintenues : −4,7. Majoration ramenée à l'ASF : +11,4. Aide au logement des retraités supprimée : +1,9. Capital de départ C : −11,5 ; « reçu à vie » à 100 000 € : −23,5 (à 45 % de droits effectifs du scénario retenu) ; les deux : −35,0. Tableau complet, avec les contraintes tenues après chaque changement : `resultats-optimum.txt` § 3.

## 5. Seuils de protection de la taxe à 1 % (demande de l'auteur, 03/11)

Le modèle juridique est l'**article 1391 B ter du CGI**. Je l'ai relu dans la copie locale (codes.droit.org, version d'août 2026) : il accorde, sur la taxe foncière de l'habitation principale, un dégrèvement de la fraction qui excède 50 % des revenus, pour les contribuables dont le revenu ne dépasse pas le plafond de l'article 1417 II (30 083 € pour une part), et il ne s'applique pas aux redevables de l'IFI. Transposition (H539) : le plafonnement à X % du revenu ne vaut que sous la médiane du revenu disponible par UC (33 450 €/UC/an, DINA). Le reliquat devient une créance récupérée à la vente ou à la succession, avec intérêt au taux de la dette.

| plafond | part différée | différé (Md€/an) | trésorerie des premières années | perte en croisière (central) | effort du retraité modeste |
|---|---|---|---|---|---|
| aucun | 0 | 0 | 93,4 | 0 | 17,9 % |
| 5 % | 8,5 % | 8,3 | 85,1 | 0,4 | 5 % |
| 10 % | 4,9 % | 4,8 | 88,6 | 0,2 | 10 % |
| 15 % | 3,4 % | 3,3 | 90,1 | 0,2 | 15 % (contrainte 6 violée) |
| 5 %, sans condition de revenu | 53,9 % | 52,5 | 40,9 | 2,6 | 5 % |

La condition de revenu est décisive. Sans elle, les gros patrimoines à revenu moyen diffèrent la moitié de la taxe, et le stock de créances atteint 630 Md€. **Le fondateur** (10 M€ de parts non cotées, 4 000 €/mois) n'a pas droit au plafonnement : il doit 100 000 € par an, soit 208 % de son revenu. Seule l'option « non-cotés taxés à la vente » le protège, pour 1,1 Md€ par an. Aucune contrainte ne la rend nécessaire, donc la recherche ne la retient pas. **Je la recommande quand même**, pour une raison de liquidité qui n'est pas dans les contraintes.

## 6. Héritage plafonné

À 50 % de droits avec imputation, l'impôt sur le gain au décès ne rapporte rien de plus : il est absorbé par les droits (0,0 aux trois scénarios). Le décès = réalisation sert donc à la neutralité (il n'y a plus d'effacement des plus-values), pas au rendement. Sans imputation, une transmission dont la plus-value égale la valeur serait prélevée à 72 %. Le plafond de 50 % l'interdit, et c'est ce qui le rend affichable. **L'exception du conjoint coûte 12 / 18,6 / 19,5 Md€** : la part de la valeur transmise qui va au conjoint (25 / 18 / 10 %, `deces_realisation.js`) sort de l'assiette en régime de croisière (H533 ⚠️ : la part du conjoint dans les 300 Md€ du CAE n'est pas sourcée, V7853).

## 7. Steelman et limites

- **Objection : « la robustesse au haut est un faux objectif ; un État emprunte ».** Elle est sérieuse. Le haut combine les élasticités les plus fortes de la littérature (eti 0,40, eps 0,30) avec l'érosion la plus faible de la taxe à 1 % (convention croisée, H420). Un système qui y résiste en régime normal surtaxe. Réponse : c'est pour cela que je recommande la (3) d'abord, plus un stabilisateur automatique (H547 : non chiffré).
- **Objection : « la majoration parent isolé à 500 € sert de rustine pour D1 ».** Exact. Son coût est réparti sur les dixièmes comme les prestations familiales (méthode de `correctifs.js`), si bien qu'elle remonte D1 au-delà des seuls parents isolés. C'est un artefact du modèle (H540). Un correctif mieux ciblé (bonus d'activité, correctif c) coûte bien plus cher (28 à 41 Md€).
- **La charge de la taxe par dixième de niveau de vie est fragile** (H534-H536). Le patrimoine par dixième vient des quartiles HVP, avec la forme nationale à l'intérieur de chaque dixième, un revenu moyen sans dispersion, 1,5 UC par ménage, et la taxe foncière supprimée comptée comme un gain.
- **Statique, en régime de croisière** : ni coût de transition (hors montée du socle et trésorerie de la taxe), ni création de valeur, ni dette. L'excédent de la retenue n'est affecté à rien.
- **Juridique** : un 1 % sur la résidence principale sans plafonnement général est exposé (Conseil constitutionnel 2012-662 DC, plafonnement de l'ISF). Le seuil de protection ne protège que les revenus sous la médiane. Le contrôle constitutionnel d'un taux marginal de 74,5 % et d'un héritage à 50 % n'est pas examiné ici.
- **Des hypothèses, pas des prédictions.** Chaque nombre dépend de H1-H547.

## 8. Options du 04/11 (recommandations de la nuit, chiffrées sur la v5 sans rien changer par défaut)

Module séparé `optimum_options_0411.js` (aucun défaut d'`optimum.js` modifié ; une option de plus dans `../risques/stress.js`, `shocks.ajust`, nulle par défaut), rapport `rapport_options_0411.js` → `resultats-optimum.txt` § 17, tests `test_options_0411.js` (89 contrôles). Hypothèses H700 à H712 (`methode.md` § 35), points V12200 à V12226. Md€/an en croisière, favorable / central / défavorable ; 1 point de taux plat = 10,8 Md€.

| option | coût | taux d'équilibre (v5 : 40,7 %) | à trouver ailleurs (central) | dette à 10 ans (v5 : 56,6 / 100,1 / 151,7 %) |
|---|---|---|---|---|
| 1. CMG hors des prestations remplacées | 7,3 / 7,3 / 7,3 | 41,4 % | 6,5 Md€ (0,61 pt) | 59,1 / 102,5 / 154,1 % |
| 2. TVA à 10 % sur les travaux | 1,7 / 1,0 / 0,5 | 40,8 % | 0,2 (0,02 pt) | 57,2 / 100,4 / 151,8 % |
| 3. majoration dégressive pour tous (pente 25 %) | 18,8 / 15,8 / 20,3 (net) | 42,1 % | 15,0 (1,39 pt) | 62,9 / 105,4 / 158,4 % |
| 4. plafond continu + 50 % à la transmission | 1,0 / 2,2 / 2,8 | 40,9 % | 1,4 (0,13 pt) | 62,0 / 105,1 / 156,0 % |
| 5. chômage deg2 | 0 (déjà en v5 : 12,6 Md€ comptés) | 40,7 % | 0 | inchangée |
| **ensemble 1 à 5** | **28,9 / 26,2 / 30,9** | **43,1 %** | **25,5 (2,35 pt)** | **71,4 / 113,1 / 165,4 %** |

Ce qu'il faut retenir : (i) aucune recommandation ne se finance dans les 0,75 Md€ de marge du central ; (ii) la majoration dégressive pour tous est le poste dominant : à coût égal, la pente implicite est de 94 % de chaque euro gagné ; à 25 %, le taux marginal du parent isolé monte à 89 % (contrainte 5 non tenue) ; la pente qui tient 75 % (8 %) coûte 35,9 Md€ net au central ; le parent isolé au Smic garde +138 €/mois, le couple à deux Smic avec deux enfants passe de −66 à +734 €/mois ; (iii) le plafond a un coût de croisière faible mais un report d'encaissement de 12,7 Md€/an au central (borne haute, la distribution revenu-patrimoine du module est grossière) ; (iv) l'option 5 est vérifiée : la v5 contient déjà `chomage: 'deg2'`. Les cas types ne changent que pour l'option 3.

## Reproduction

Depuis `modeles/systeme-ideal/`, avec `jsc` = `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc` :

```
jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js optimum.js ../risques/stress.js rapport_optimum.js > resultats-optimum.txt
```
`../risques/stress.js` sert au seul § 9.5 (dette à 10 ans). Tests : même liste sans `stress.js`, avec `test_optimum.js` au lieu de `rapport_optimum.js`.

Options du 04/11 : ajouter `optimum_options_0411.js` après `optimum.js` (puis `../risques/stress.js`), avec `rapport_options_0411.js` ou `test_options_0411.js`.
