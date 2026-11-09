---
titre: Comment financer le palier 1 ? Grille d'options et chemins à soumettre à l'auteur
date: 2026-11-03
statut: brouillon, ordres de grandeur sous hypothèses
---

# Comment financer le palier 1 ? Grille d'options et chemins

Ce document prépare une décision de l'auteur. Il ne la prend pas, ne recommande aucun chemin et ne change aucun défaut du modèle : le palier 1 (taux plat 35 %, socle 500 €, impôt de 50 % sur les transmissions) reste le point de départ, et chaque option est un écart à ce point de départ. Code : `options_financement.js` (fonctions pures, 78 contrôles dans `test_options_financement.js`), tableaux : `resultats-options-financement.txt` (fait foi), reproduction en bas de page. Hypothèses H420 à H432 (`methode.md` § 30), non confirmé : V6800-V6810.

Transparence : ce texte est écrit par Claude, une IA d'Anthropic. Le risque propre à cette tâche est la complaisance : une grille de « chemins » donne envie de trouver celui qui marche. Les chiffres ci-dessous disent plutôt que presque rien ne marche seul, et que ce qui équilibre au central ne tient pas au haut.

## 1. À lire d'abord

1. **Le trou à combler est de 163 Md€ au central** (solde public total, déficit actuel de −169,1 compris : −120 / −163 / −236 bas / central / haut). « Équilibre » veut dire ici solde ≥ 0. Deux autres seuils sont affichés : ≥ −88 Md€ (3 % du PIB 2024, 2 935 Md€) et ≥ −169,1 (déficit actuel conservé, ce que le palier 1 fait déjà au central).
2. **Aucune option seule n'équilibre.** Les deux plus gros leviers sont le taux plat (+77 Md€ à 41,5 %, soit 47 % du trou) et le socle (+43 Md€ à −20 %, soit 27 %). Tout le patrimoine et toutes les économies de dépenses réunis ne rapportent qu'au mieux **26 Md€** au central (fin du report 150-0 B ter 3,7 ; décès = réalisation 6,3 ; PFU 50 % 2,8 ; économies volontaires 5,3 ; CIR supprimé 8,0) : 16 % du trou.
3. **Un seul chemin équilibre au central, et il suppose un taux plat de 45 %** (chemin 4 : +14 Md€). Au bas il fait +113 ; **au haut il fait −128, et aucun chemin n'équilibre au haut** : avec toutes les options, le solde du haut plafonne à environ −116 Md€ vers 50 % de taux plat, puis baisse (exil et réactions du capital).
4. **Les chemins 2 et 3 (taux 41,5 %, socle 400 €, patrimoine, économies) sont à −16 et −22 Md€ au central** : sous 3 % du PIB, pas à l'équilibre. À dix ans, avec la création de valeur affectée au déficit, ils passent à +14 et +8 ; **sans la croissance par l'IA (la ligne la plus fragile) ils restent à −5 et −11**.
5. **Le pari de l'héritage est le plus gros point de fragilité** : 103,5 Md€ de droits contre 20,8 aujourd'hui. À droits actuels, le même chemin 2 tombe à −97 Md€ (contre-épreuve). Un héritage « réaliste » (écart de déclaration de 35 %) coûte 6 Md€ ; un impôt de 40 % au lieu de 50 %, 17 Md€.
6. **Les hauts taux ont un prix pour les plus modestes**. *Version du matin (03/11, gardée)* : à 45 % de taux plat avec un socle de 400 €, les trois premiers déciles de salaire perdent par rapport au droit actuel (−118 €/mois pour D1, central), calcul qui ignorait le plancher RSA (V6809). **Recalage de l'après-midi (03/11, `gagnants-perdants/palier1.js`, § 6bis)** : avec le RSA, la prime d'activité et les retraités dans la référence, au chemin 4 **D1 perd 81 €/mois (−7,8 %), D2 17 € (−1,0 %), D3 gagne 35 € (+1,7 %)** : le constat « D1 à D3 perdent » ne tient que pour D1 (robuste) et à peine D2. Le plancher RSA protège la personne sans revenu (−13 €), pas le smicard (−214 € au chemin 4) ni le parent isolé au Smic (−697 €). Incompatible avec « ne perdre personne » dès le chemin 2.
7. **Le taux marginal monte avec le taux plat** : limite à l'infini de 65 % au palier 1, 72 % à 41,5 %, 75 % à 45 % (avec l'IS : 74, 79, 81 %). Les réactions rongent 30 à 34 % du gain statique d'une hausse de taux au central.

## 2. Conventions

- Md€ par an, euros de 2024-2025, régime de croisière statique (sans transition ni création de valeur, sauf la colonne « année 10 »). Santé comprise (9,7 Md€ au central, déjà dans le palier 1 : l'Ondam n'est donc pas recompté).
- **Scénarios** : palier 1 « bas » = réactions faibles (favorable), « haut » = réactions fortes (défavorable). Les modules patrimoine ont la convention inverse (« bas » = le moins favorable) : le code les croise explicitement (H420, testé).
- « Qui paie » : *version du matin* : les déciles de revenu disponible venaient de `modele.js` (`effetsParDecile`, salariés par décile de salaire), le module `gagnants-perdants/` étant alors calé sur l'ancien système (socle 1 000 €, taux 50 %) et inutilisable tel quel (H430). *Recalage de l'après-midi (03/11)* : `gagnants-perdants/palier1.js` est recalé sur les paramètres du palier 1 et des chemins, avec RSA, prime d'activité et cas types OpenFisca (§ 6bis ; H440-H449). Les tableaux du § 6 restent comme historique de la lecture « salariés ». Les options sur l'héritage et le patrimoine ne se répartissent pas par décile dans ce modèle : elles sont décrites par qui les paie.
- Le risque de comportement est mesuré par l'**érosion** (part du gain statique perdue quand on active les réactions : élasticités de T4, `eti` 0,12 / 0,25 / 0,40, `eps` 0,05 / 0,10 / 0,30, participation, effet revenu, rendement du capital) pour le taux plat et le socle ; pour les autres options, par l'élasticité ou la fuite propre à leur module.

## 3. La grille : option × solde × qui paie

Solde public total, régime de croisière, bas / central / haut. Δ = écart du central au palier 1 (−163,3).

| Option | Solde bas / central / haut | Δ central | Qui paie | Risque de comportement |
|---|---|---|---|---|
| **Palier 1 (35 %, 500 €, héritage 50 %)** | −119,8 / −163,3 / −235,7 | | | |
| (a1) taux plat 36 % | −104,3 / −150,7 / −228,4 | +12,6 | tous les revenus d'activité et du capital, D9 et D10 d'abord ; D1 à D8 gagnent un peu moins | érosion 30 % ; gain de +15 / +13 / +7 selon le scénario |
| (a2) taux plat 38 % | −73,6 / −126,3 / −215,0 | +37,1 | idem ; D10a presque à zéro (+57 €/mois) | érosion 31 % |
| (a3) taux plat 40 % | −43,6 / −102,9 / −203,3 | +60,4 | idem ; D9 et D10 perdent (−159 €/mois pour D10a) | érosion 33 % |
| (a4) taux plat 41,5 % | −21,5 / −86,2 / −195,4 | +77,1 | idem ; D9 perd (−24), D10b −1 302 €/mois, top 1 % −8 021 | érosion 34 % ; gain de +98 / +77 / +40 : il fond au haut |
| (b1) socle −10 % (450 €) | −98,8 / −141,6 / −213,0 | +21,7 | −50 €/mois pour tout adulte non retraité, le même montant pour chaque décile : la charge pèse proportionnellement le plus sur D1 à D3 | érosion −5 % (les réactions renforcent un peu le gain : moins d'effet revenu) |
| (b2) socle −20 % (400 €) | −77,7 / −119,8 / −190,1 | +43,5 | −100 €/mois, idem | érosion −5 % |
| (c1) montée du socle sur 5 ans (de 250 à 500 €) | moyenne 10 ans : −93,4 / −136,1 / −207,2 ; régime inchangé | +27,2 en moyenne sur 10 ans, 0 en régime | les bénéficiaires du socle pendant la montée : D1 à D3 d'abord (année 1 : D1 −72 €/mois par rapport à aujourd'hui, ⚠️ avant plancher RSA) | aucun nouveau (c'est un calendrier) ; mais la promesse de montée devient un risque politique |
| (c2) montée sur 10 ans | moyenne 10 ans : −67,1 / −108,9 / −178,6 ; régime inchangé | +54,4 en moyenne, 0 en régime | idem, plus longtemps | idem |
| (d1) fin du report d'imposition 150-0 B ter (flux futur seulement) | −111,9 / −159,6 / −234,7 | +3,7 | ≈ 8 400 foyers, dont 84 foyers pour 70 % du flux (dirigeants qui cèdent leur entreprise) | forte : ε = 0,8 à 2,5, gain à +0,75 si ε doublé, négatif si triplé (resultats.md § 25) ; ne vaut +7,9 qu'au bas |
| (d2) décès = réalisation, prix d'acquisition reporté (valeur à 10 ans) | −103,6 / −157,0 / −233,8 | +6,3 | héritiers qui revendent des actifs à forte plus-value latente (entreprises, immobilier hors résidence principale) | verrouillage (on ne vend plus) ; 0 la première année, 19,3 en croisière (⚠️ à 20 ans), 9,1 à 10 ans |
| (d2b) décès = réalisation avec crédit sur les droits | = palier 1 | 0,0 | personne : à 50 % de droits le crédit absorbe tout | sans objet |
| (d2c) décès = réalisation sans crédit (cumul avec les droits) | −105,5 / −154,8 / −231,5 | +8,5 | héritiers : jusqu'à 75 % de la valeur pour une plus-value égale à la valeur ; ventes forcées d'entreprises | contraintes juridiques les plus dures (DLF : « impossible en l'état de la jurisprudence ») |
| (d3) PFU à 50 % (seul le surplus sur le taux plat) | −110,7 / −160,6 / −238,3 | +2,8 | détenteurs d'assurance-vie, de PER et de dividendes (D9, D10) | le taux de 50 % est au sommet de la courbe seulement si l'élasticité vaut 1 ; au haut le gain est négatif (−2,6) |
| (e1) économies prudentes (agences, SNU) | −119,1 / −162,6 / −235,0 | +0,7 | agences publiques, service national universel | faible ; chèque énergie exclu (redondant avec le socle) |
| (e2) économies volontaires (+ primes à l'apprentissage) | −114,5 / −158,0 / −232,8 | +5,3 | entreprises et centres de formation d'apprentis | l'aide n'est que de 2,2 Md€ au PLF 2026 (V6323) : 2,9 au total au haut |
| (e3) CIR recentré sur PME et ETI | −116,4 / −159,9 / −232,3 | +3,4 | grandes entreprises qui font de la R&D | effet sur la R&D non chiffré ⚠️ |
| (e4) CIR supprimé | −111,8 / −155,3 / −227,7 | +8,0 | entreprises qui font de la R&D | idem |
| (f1) héritage : écart de déclaration de 35 % | −125,8 / −169,3 / −241,7 | −6,0 | ce que les héritiers ne paient pas : 6 Md€ | c'est le niveau constaté (CAE : 35-40 %), le défaut du modèle (31 %) est du côté favorable |
| (f2) héritage : écart de 40 % | −133,3 / −176,8 / −249,2 | −13,5 | idem | idem |
| (f3) héritage : impôt de 40 %, écart de 35 % | −143,9 / −180,4 / −243,6 | −17,1 | idem | la fuite baisse avec le taux (formule du modèle) |
| (f4) héritage : droits actuels (20,8 Md€) | −222,0 / −246,0 / −292,9 | −82,7 | idem : le choix de ne pas taxer l'héritage à 50 % pèse 6,5 points de taux plat | sans objet |

Lecture. Les lignes (f) ne financent rien : ce sont des coûts de réalisme. Les lignes (d) et (e) sont petites une à une ; leur seul mérite est d'être peu douloureuses pour D1 à D8, parce qu'elles portent sur des patrimoines concentrés ou sur des dépenses d'organisation. Les lignes (a) et (b) font l'essentiel du travail et sont celles qui touchent les revenus ordinaires.

## 4. Combinaisons

### 4.1 Taux plat × socle (héritage à 50 %, rien d'autre)

Solde central (Md€) :

| | socle 500 € | socle 450 € | socle 400 € |
|---|---|---|---|
| taux plat 35,0 % | −163,3 | −141,6 | −119,8 |
| 36,0 % | −150,7 | −129,0 | −107,1 |
| 38,0 % | −126,3 | −104,5 | −82,6 |
| 40,0 % | −102,9 | −81,1 | −59,2 |
| 41,5 % | −86,2 | −64,4 | −42,5 |

Solde haut (Md€) : de −235,7 (35 %, 500 €) à −149,3 (41,5 %, 400 €). Solde bas : de −119,8 à +20,7 (41,5 %, 400 € est le premier point à l'équilibre au bas ; 40 % et 400 € le frôle à −1,4). Les deux leviers sont presque additifs (77,1 + 43,5 = 120,6 contre 120,8 observé).

### 4.2 Empilement (central ; chaque ligne s'ajoute à la précédente)

| étape | solde bas / central / haut | Δ central |
|---|---|---|
| palier 1 | −119,8 / −163,3 / −235,7 | |
| + taux plat 41,5 % | −21,5 / −86,2 / −195,4 | +77,1 |
| + socle −20 % | 20,7 / −42,5 / −149,3 | +43,8 |
| + fin du report 150-0 B ter | 29,3 / −38,7 / −148,5 | +3,7 |
| + décès = réalisation (prix reporté, 10 ans) | 48,5 / −31,2 / −146,3 | +7,5 |
| + PFU à 50 % | 57,7 / −28,9 / −148,2 | +2,3 |
| + économies volontaires | 63,0 / −23,6 / −145,3 | +5,3 |
| + CIR supprimé | 71,0 / −15,6 / −137,3 | +8,0 |
| + héritage : écart de 35 % | 65,0 / −21,6 / −143,3 | −6,0 |
| + héritage : impôt de 40 %, écart de 35 % (au lieu de la ligne précédente) | 46,8 / −32,7 / −145,2 | −11,1 |
| variante : mêmes ajouts, droits actuels, décès avec crédit (borne haute) | −26,7 / −96,8 / −193,8 | |

Les ajouts successifs ne s'additionnent pas exactement : le décès passe de +6,3 seul à +7,5 en empilement (à 41,5 % le prix reporté se taxe plus), le PFU de +2,8 à +2,3 (le surplus sur le taux plat se réduit quand le taux plat monte). La fin du report reste à +3,7 (flux imposé au taux plat de 41,5 % : 3,4).

## 5. Montée progressive du socle

Départ à 250 € (la moitié du socle final, hypothèse de Claude H423), montée linéaire, taux plat 35 % :

| montée | année 1 (b / c / h) | moyenne sur 10 ans (b / c / h) | régime |
|---|---|---|---|
| sur 5 ans (250 € en année 1, 375 € en année 3) | −14,3 / −54,3 / −121,4 | −93,4 / −136,1 / −207,2 | −119,8 / −163,3 / −235,7 |
| sur 10 ans (250 €, 306 € en année 3) | −14,3 / −54,3 / −121,4 | −67,1 / −108,9 / −178,6 | idem |

**La montée ne finance rien en régime** : elle reporte le coût. Au central, elle économise 27 Md€ par an en moyenne sur 10 ans (sur 5 ans de montée) ou 54 (sur 10 ans), c'est-à-dire que l'on emprunte moins pendant la montée mais que le trou de 163 est entièrement là l'année 10. Dans le chemin 1, le solde se dégrade chaque année de 13 à 123 Md€ (central). ⚠️ H423 : on suppose que les 117,6 Md€ de dépenses remplacées disparaissent dès l'année 1 et que le plancher RSA tient les plus pauvres ; si l'on gardait les aides pendant la montée, le coût de la première année serait supérieur.

## 6. Gagnants et perdants par décile

Écart de revenu disponible par rapport au droit actuel, €/mois, central, effets par décile de `modele.js` (hors plancher RSA, hors héritage et patrimoine). D10a à D10e sont les sous-bandes du dernier décile (D10d : le 1 % supérieur, D10e : le 0,1 %).

| configuration | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10a | D10b | D10c | D10d | D10e |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| palier 1 (35 %, 500 €) | 178 | 293 | 381 | 536 | 569 | 564 | 565 | 556 | 467 | 380 | −297 | −1 557 | −5 327 | −46 898 |
| taux 38 % | 119 | 217 | 295 | 435 | 457 | 438 | 418 | 376 | 240 | 57 | −761 | −2 243 | −6 570 | −52 868 |
| taux 40 % | 80 | 167 | 237 | 368 | 383 | 354 | 319 | 256 | 89 | −159 | −1 070 | −2 700 | −7 399 | −56 849 |
| taux 41,5 % | 51 | 129 | 194 | 317 | 327 | 291 | 245 | 166 | −24 | −320 | −1 302 | −3 042 | −8 021 | −59 834 |
| taux 45 % | −18 | 41 | 94 | 199 | 197 | 143 | 73 | −44 | −289 | −697 | −1 843 | −3 842 | −9 471 | −66 799 |
| socle 450 € (35 %) | 128 | 243 | 331 | 486 | 519 | 514 | 515 | 506 | 417 | 330 | −347 | −1 607 | −5 377 | −46 948 |
| socle 400 € (35 %) | 78 | 193 | 281 | 436 | 469 | 464 | 465 | 456 | 367 | 280 | −397 | −1 657 | −5 427 | −46 998 |
| 41,5 % + socle 400 € | −49 | 29 | 94 | 217 | 227 | 191 | 145 | 66 | −124 | −420 | −1 402 | −3 142 | −8 121 | −59 934 |
| 45 % + socle 400 € | −118 | −59 | −6 | 99 | 97 | 43 | −27 | −144 | −389 | −797 | −1 943 | −3 942 | −9 571 | −66 899 |
| année 1 de la montée (35 %, 250 €) | −72 | 43 | 131 | 286 | 319 | 314 | 315 | 306 | 217 | 130 | −547 | −1 807 | −5 577 | −47 148 |
| année 5 de la montée sur 10 ans (35 %, 361 €) | 40 | 154 | 242 | 397 | 430 | 426 | 426 | 417 | 328 | 241 | −436 | −1 696 | −5 466 | −47 037 |


Lecture. (1) Le palier 1 fait gagner jusqu'au décile 9 et perd à partir de la moitié haute du dernier décile. (2) **Une hausse du taux plat est payée par tout le monde, mais pas également** : de 35 à 41,5 %, D1 perd 127 €/mois, D5 242, D8 390, D9 491 ; le gain de D1 se réduit à 51. (3) Une baisse du socle de 100 € retire exactement 100 € à tous les déciles (le socle est forfaitaire) : proportionnellement, D1 le sent le plus. (4) À 45 % avec un socle de 400 €, D1 à D3 perdent, de même que D7 à D10 ; seuls D4 à D6 gardent un gain (≈ 100 €/mois pour D4 et D5, 43 pour D6).

### Taux marginal effectif implicite (central, impôt à plat et continu, hors IS, hors plancher RSA)

| configuration | D1 | D5 | D9 | D10b | D10e | limite à l'infini | avec IS |
|---|---|---|---|---|---|---|---|
| palier 1 (35 %) | 36 % | 49 % | 57 % | 61 % | 65 % | 65 % | 74 % |
| taux 38 % | 38 % | 51 % | 60 % | 64 % | 68 % | 68 % | 76 % |
| taux 40 % | 40 % | 53 % | 61 % | 66 % | 70 % | 70 % | 77 % |
| taux 41,5 % | 42 % | 55 % | 63 % | 67 % | 71 % | 72 % | 79 % |
| taux 45 % | 45 % | 58 % | 66 % | 71 % | 75 % | 75 % | 81 % |
| socle 400 € (35 %) | 36 % | 49 % | 57 % | 61 % | 65 % | 65 % | 74 % |

Le socle ne change pas les taux marginaux. Le taux plat les relève point pour point, et la limite à l'infini (impôt continu compris) dépasse 70 % à partir de 40 %. Comparaison : le taux marginal effectif moyen actuel du dernier décile est de 63 % (T4, H5) ; le palier 1 est donc déjà au niveau d'aujourd'hui pour les très hauts revenus, et au-dessus à 41,5 % et plus.

## 6bis. Gagnants et perdants recalés (03/11, après-midi) : dixièmes de niveau de vie, RSA et cas types

Source : `modeles/gagnants-perdants/palier1.js` (54 contrôles, `resultats-palier1.txt` fait foi ; méthode `gagnants-perdants/methode.md` § 10 ; H440-H449 ; non confirmé : V6850-V6859). Écart de revenu disponible par rapport au droit actuel, **€ par unité de consommation et par mois**, tous les adultes (retraités compris), central, statique. Référence : revenu disponible Insee 2023 (RSA, prime d'activité, prestations familiales inclus ; aides au logement perdues). Plancher RSA : 877 € pour 1,9 million de personnes sans autre revenu (coût retrouvé : 8,6 Md€ à 500 €, 10,9 à 400 €).

| configuration | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 (moy.) | D10d (1 %) | D10e (0,1 %) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| palier 1 (35 %, 500 €) | 21 | 140 | 232 | 259 | 337 | 326 | 388 | 380 | 403 | −72 | −5 327 | −46 898 |
| chemin 1, année 1 (38 %, 250 €) | −159 | −60 | 23 | 28 | 85 | 62 | 98 | 62 | 46 | −607 | −6 820 | −53 118 |
| chemin 1, année 5 (38 %, 361 €) | −83 | 17 | 98 | 107 | 168 | 146 | 186 | 153 | 138 | −506 | −6 709 | −53 007 |
| chemin 1, année 10 (38 %, 500 €) | 11 | 114 | 193 | 206 | 272 | 250 | 295 | 266 | 255 | −380 | −6 570 | −52 868 |
| chemins 2 et 3 (41,5 %, 400 €) | −69 | 14 | 80 | 73 | 122 | 86 | 108 | 51 | −2 | −831 | −8 121 | −59 934 |
| chemin 4 (45 %, 400 €) | −81 | −17 | 35 | 11 | 46 | −2 | 0 | −83 | −176 | −1 190 | −9 571 | −66 899 |

En % du revenu disponible actuel (D1 à D10) : palier 1 : 2,0 / 8,5 / 11,2 / 11,0 / 12,8 / 11,1 / 11,9 / 10,2 / 9,1 / −1,0 ; chemin 4 : −7,8 / −1,0 / 1,7 / 0,5 / 1,7 / −0,1 / 0,0 / −2,2 / −4,0 / −16,2 (revenus actuels par UC et par mois : D1 1 033 €, D2 1 633 €, D3 2 067 €, D10 7 367 €). Tableaux complets en % et par chemin : `resultats-palier1.txt`.

**Cas types** (OpenFisca-France 2026 pour le droit actuel ; € par mois, écart au droit actuel ; plancher RSA 877 €, plancher ciblé des parents isolés 1 300 €) :

| cas type | avant | palier 1 | chemin 1 an 1 | chemin 1 an 10 | chemins 2-3 | chemin 4 |
|---|---|---|---|---|---|---|
| personne seule au RSA (locataire) | 890 | −13 (−1,5 %) | −13 | −13 | −13 | −13 |
| salarié au Smic | 1 707 | +85 (+5,0 %) | −225 (−13,2 %) | +25 (+1,5 %) | −145 (−8,5 %) | −214 (−12,5 %) |
| couple, 2 enfants, deux Smic | 3 523 | +461 (+13,1 %) | −158 (−4,5 %) | +342 (+9,7 %) | +2 (+0,1 %) | −137 (−3,9 %) |
| couple, 2 enfants, un Smic | 2 593 | +99 (+3,8 %) | −460 (−17,8 %) | +40 (+1,5 %) | −230 (−8,9 %) | −300 (−11,6 %) |
| retraité au minimum vieillesse | 1 044 | 0 | 0 | 0 | 0 | 0 |
| idem, locataire (aide au logement 305 €) ⚠️ | 1 241 | −197 (−15,9 %) | −197 | −197 | −197 | −197 |
| cadre à 3 Smic brut | 3 777 | +970 (+25,7 %) | +479 (+12,7 %) | +729 (+19,3 %) | +347 (+9,2 %) | +66 (+1,8 %) |
| cadre à 6 Smic brut | 6 872 | +1 093 (+15,9 %) | +362 (+5,3 %) | +612 (+8,9 %) | −50 (−0,7 %) | −611 (−8,9 %) |
| parent isolé, 2 enfants, un Smic | 2 590 | −398 (−15,4 %) | −708 (−27,3 %) | −458 (−17,7 %) | −628 (−24,2 %) | −697 (−26,9 %) |
| parent isolé, 2 enfants, sans emploi | 1 796 | −496 (−27,6 %) | −496 | −496 | −496 | −496 |

**Le constat « D1 à D3 perdent à 45 % et 400 € » tient-il avec le RSA ? Partiellement.** D1 perd (−81 €/mois ; de −35 à −125 € selon que le plancher RSA concerne 2,85 ou 1 million de personnes ; −83 à −81 selon la dispersion). D2 est proche de zéro (−17 ; de −34 à +2). D3 gagne (+35 ; de +5 à +55). Même à 41,5 % et 400 €, D1 perd (−69 €), et le palier 1 lui-même ne donne que +21 € à D1 (en tous adultes). Le plancher RSA ne répare pas la perte de D1, parce que celle-ci est portée par les travailleurs à revenu partiel qui perdent la prime d'activité, l'aide au logement et les prestations remplacées, et non par les personnes sans revenu, qui sont tenues à 877 €.

**Ce qui est nouveau par rapport à la version du matin** : (i) le smicard perd à partir du chemin 2 (point mort : 39,3 % de taux plat à socle 500 €, 34,2 % à 400 €) ; (ii) le parent isolé perd à tous les chemins, et sans emploi il perd 496 € au plancher ciblé de 1 300 € ⚠️ (V6856) ; (iii) le retraité locataire perd son aide au logement si le palier 1 la supprime avec les autres (⚠️ question à l'auteur, V6852) ; (iv) en année 1 de la montée (socle de 250 €) D1 perd 159 €, D2 60 € et le smicard 225 €.

Limites : les niveaux d'ensemble ne sont pas fiables (profil, pas niveau, V6855) ; l'effectif du plancher RSA et la dispersion sont des hypothèses (H441, H444) ; la contribution des hautes pensions n'est pas dans les dixièmes (H449).

## 6ter. Correctifs « ne perdre personne » (03/11, soir) : quatre rustines chiffrées

Code : `gagnants-perdants/correctifs.js` (52 contrôles), tableaux complets : `gagnants-perdants/resultats-correctifs.txt` (fait foi), hypothèses H450-H459 (`gagnants-perdants/methode.md` § 11), non confirmé : V6900-V6910. Aucun défaut n'est changé : chaque correctif s'ajoute au palier 1 ou à un chemin.

**Ce qu'on corrige.** Au palier 1 : le parent isolé au Smic (−398 €/mois), le parent isolé sans emploi (−496 €), le retraité locataire (−197 €). Au chemin 4 : D1 (−81 €/mois par UC), le smicard seul (−214 €), le couple à un Smic (−300 €), le cadre à 6 Smic (−611 €), le parent isolé au Smic (−697 €).

### Coût de chaque correctif seul (Md€ par an, bas / central / haut ; croisière statique)

| correctif | coût | ménages concernés (central) | ce qu'il répare |
|---|---|---|---|
| **(a)** aides au logement des retraités locataires, sous le plafond de ressources actuel | 1,3 / **1,9** / 2,6 | 0,7 M (0,5 à 0,9) ⚠️ | le retraité locataire revient à 0, partout |
| **(b)** majoration parent isolé : ASF 200,78 € par enfant (haut : 300 €) × 3,166 M d'enfants | 3,8 / **7,6** / 11,4 | 2,0 M de familles (1,0 en bas) | palier 1 : parent isolé au Smic de −398 à +3 € ; sans emploi de −496 à −94 € ; **chemin 4 : au Smic encore −296 €** |
| **(c)** bonus d'activité de 200 €, 0,5 à 1,6 Smic, à la place de la prime d'activité | 36,5 / **40,7** / 42,7 | 25 M d'adultes | smicard au chemin 4 de −214 à −14 € ; couple à deux Smic de −137 à +263 € |
| (c) variante 100 € | 18,2 / 20,3 / 21,3 | 25 M | moitié de l'effet |
| (c) variante : extinction à 1,3 Smic | 28,7 / 35,0 / 37,4 | 20 M | |
| (c) variante : réservé aux cinq premiers dixièmes (ressources du ménage) | 24,3 / 28,0 / 29,5 | 15 M | |
| (c) bonus qui annule exactement la perte du smicard au chemin 4 (214 €) | 39,0 / 43,5 / 45,7 | 25 M | smicard à 0 |
| **(d)** plancher « pas moins qu'aujourd'hui », palier 1, pendant la garantie | 11,2 / **18,2** / 45,4 | 7,0 M de ménages | tous les cas types à zéro ou plus |
| (d) chemin 4, pendant la garantie | 46,1 / **63,7** / 103,5 | 24,4 M | idem |
| (d) chemin 4, moyenne annuelle sur 10 ans d'une garantie de 3 ans | 13,8 / **19,1** / 31,0 | | |
| (d) chemin 4, garantie de 5 ans | 23,1 / **31,9** / 51,7 | | |
| (d) palier 1, garantie de 3 ans / 5 ans (moyenne sur 10 ans) | 3,4 / **5,5** / 13,6 ; 5,6 / **9,1** / 22,7 | | |

Décomposition de (d) au central : palier 1 = 7,7 (adultes seuls) + 8,6 (parents isolés) + 0 (couples monoactifs) + 1,9 (retraités) = 18,2 ; chemin 4 = 44,1 + 12,3 + 5,3 + 1,9 = 63,7.

### Combinés (Md€ par an, bas / central / haut)

| combinaison | palier 1 | chemin 4 |
|---|---|---|
| (a) + (b) | 5,1 / **9,5** / 14,0 | idem |
| (a) + (b) + (c) ciblé (cinq premiers dixièmes) | 29,4 / **37,6** / 43,5 | idem |
| (a) + (b) + (c) ciblé + (d) résiduel jusqu'à 1,6 Smic | 30,6 / **42,0** / 64,0 | 37,3 / **52,3** / 87,7 |
| tout : (a) + (b) + (c) complet + (d) résiduel sans plafond | 42,7 / **54,6** / 77,1 | 49,5 / **64,9** / 100,9 |
| (d) seul | 11,2 / **18,2** / 45,4 | 46,1 / **63,7** / 103,5 |

### Ce qu'il faut ajouter au trou de chaque chemin (solde de croisière, Md€ par an, bas / central / haut)

| chemin | solde sans correctif | + (a) + (b) | + (a) + (b) + (c) ciblé | + (a) + (b) + (c) ciblé + (d) jusqu'à 1,6 Smic | tout | + (d) seul |
|---|---|---|---|---|---|---|
| palier 1 seul | −119,8 / −163,3 / −235,7 | −124,9 / −172,9 / −249,7 | −149,2 / −200,9 / −279,2 | −150,4 / −205,4 / −299,7 | −162,5 / −218,0 / −312,8 | −131,0 / −181,5 / −281,1 |
| chemin 1 | −65,4 / −122,5 / −214,1 | −70,5 / −132,1 / −228,0 | −94,8 / −160,1 / −257,6 | −96,1 / −165,0 / −279,6 | −108,2 / −177,6 / −292,7 | −77,9 / −142,4 / −263,9 |
| chemin 2 | 71,0 / −15,6 / −137,3 | 65,9 / −25,2 / −151,3 | 41,6 / −53,2 / −180,8 | 36,0 / −64,7 / −218,1 | 23,8 / −77,3 / −231,3 | 36,9 / −66,1 / −225,8 |
| chemin 3 | 65,0 / −21,6 / −143,3 | 59,9 / −31,2 / −157,3 | 35,6 / −59,2 / −186,8 | 30,0 / −70,7 / −224,1 | 17,8 / −83,3 / −237,3 | 30,9 / −72,1 / −231,8 |
| chemin 4 | 113,0 / **+14,1** / −127,8 | 107,9 / **+4,5** / −141,8 | 83,6 / −23,5 / −171,3 | 75,7 / −38,2 / −215,5 | 63,6 / −50,8 / −228,7 | 66,9 / −49,7 / −231,3 |

Avec (a) + (b), seul le chemin 4 reste à l'équilibre au central (+4,5) ; dès qu'on ajoute (c) ou (d), plus aucun chemin n'équilibre au central, et le chemin 4 passe à −24 puis −38 Md€. Convention : « bas » rapproche un coût faible d'un solde favorable, « haut » un coût fort d'un solde défavorable.

### Cas types et dixièmes après correctifs (central)

- **(a) + (b)** : le retraité locataire revient à 0 ; au palier 1 le parent isolé au Smic est à +3 €, sans emploi à −94 € (1 300 € de plancher + 401 € contre 1 796 € d'avant) ; au chemin 4 il reste à −96 € **avec (c)**, −296 € sans.
- **(a) + (b) + (c) au chemin 4** : D1 passe de −81 à +45 €/mois par UC, D2 de −17 à +137, D3 +157 ; **D8 (−38), D9 (−136) et D10 (−1 186) perdent toujours**, de même que le cadre à 6 Smic (−611), le couple à un Smic (−100), le smicard (−14), le parent isolé (−96) et la personne seule au RSA (−13).
- **(d)** ramène à zéro ou plus tous les cas types, mais il compense aussi les classes moyennes du chemin 4 : la plage où un adulte seul perd va de 0,1 à 2,9 Smic brut, contre 0,1 à 0,4 au palier 1. C'est ce qui fait coûter 64 Md€ : **au chemin 4, « ne perdre personne » rend l'essentiel de ce que le chemin prend aux ménages**. La masse des perdants est sous 1,6 Smic : plafonner (d) à 1,6 Smic n'économise presque rien (44,1 contre 44,1 Md€ pour les adultes seuls).

### Taux marginal effectif d'un adulte seul sans enfant (%)

| configuration | 0,25 Smic | 0,5 | 0,75 | 1 | 1,3 | 1,6 | 2 |
|---|---|---|---|---|---|---|---|
| palier 1, sans correctif | 35 | 35 | 35 | 35 | 44 | 50 | 53 |
| palier 1, avec (c) 200 €, éteint à 1,6 Smic | 15 | 35 | 35 | **47** | **55** | 50 | 53 |
| chemin 4, sans correctif | 45 | 45 | 45 | 45 | 54 | 60 | 63 |
| chemin 4, avec (c) 200 €, éteint à 1,6 Smic | 25 | 45 | 45 | **57** | **65** | 60 | 63 |
| chemin 4, avec (c), éteint à 1,3 Smic | 25 | 45 | 45 | **70** | 54 | 60 | 63 |

(a) et (b) sont forfaitaires : aucun effet sur le taux marginal. (c) **recrée une zone de taux élevé** : +12 points au-dessus du Smic avec une extinction à 1,6 Smic, +25 avec 1,3 Smic, soit le piège que la suppression de la prime d'activité devait défaire ; il baisse en revanche le taux dans la montée (de 45 à 25 % à 0,25 Smic). (d), s'il est calculé sur le revenu courant (« pas moins qu'aujourd'hui »), vaut **100 % de taux marginal sur toute la plage de perte** : il ne peut être qu'un forfait figé à la date de la bascule et dégressif, sans quoi il détruit l'incitation au travail sur la zone entière.

### Lecture (sans recommander ; la décision est à l'auteur)

1. **(a) + (b) sont les seuls correctifs bon marché et propres** : 9,5 Md€ (5,1 à 14,0), aucun effet sur le taux marginal, ils règlent le retraité locataire partout et le parent isolé au palier 1. Ils laissent au chemin 4 le parent isolé au Smic à −296 € : (b) répare le palier 1, pas le chemin 4.
2. **(c) coûte quatre fois le reste et recrée la trappe** : 41 Md€ pour 200 € à 25 M d'adultes, parce qu'un bonus individuel n'est pas ciblé sur le foyer (la prime d'activité actuelle coûte 10,7 Md€ pour des foyers sous plafond). Ciblé sur les cinq premiers dixièmes : 28 Md€. Le smicard seul ne perd que si le taux plat dépasse 34,2 % à socle 400 € ou 39,3 % à 500 € (points morts, `resultats-palier1.txt`) : sa perte est une conséquence du taux choisi, pas un défaut à compenser en soi ; on n'a pas chiffré le coût de revenir à ces taux.
3. **(d) est une clause de transition, pas un régime** : forfaitaire, figée, dégressive sur N ans ; 5,5 Md€ par an en moyenne sur 10 ans au palier 1 pour trois ans de garantie, 19,1 au chemin 4. Rien ne dit qu'une clause de trois ans suffise : les pertes du chemin 4 sont permanentes, et la clause ne fait que les retarder.
4. **Contradiction à nommer** : « ne perdre personne » et le chemin 4 ne tiennent pas ensemble. Le chemin 4 équilibre parce qu'il prélève 45 % à tout le monde ; le compenser pour tous (d) coûte 64 Md€, soit 4,5 fois sa marge (14 Md€). Le palier 1 au taux de 35 % est le seul où les correctifs sont chiffrés à 10-18 Md€.

Limites : (c) et (d) reposent sur un adulte seul sans enfant (H454) et sur la dispersion de H441 ; (d) est une borne basse pour les hauts salaires (l'atlas s'arrête à 2,9 Smic, H455) ; les effectifs des parents isolés actifs et des couples monoactifs sont des hypothèses (H456-H457) ; le coût de (b) peut recouper le plancher ciblé de 1 300 € déjà compté dans le solde du palier 1 (0,5 M de parents isolés, V6910) ; aucune réaction de comportement n'est chiffrée.

## 7. Les chemins

Quatre chemins cohérents plus une contre-épreuve. Ils n'ont pas de hiérarchie ; ils servent à voir quelle combinaison de renoncements fait quoi.

| chemin | contenu | solde croisière bas / central / haut | moyenne 10 ans, central | année 10 avec création de valeur (b / c / h) | année 10 sans IA | taux plat d'équilibre (b / c / h) |
|---|---|---|---|---|---|---|
| **1. Montée lente** | taux 38 %, socle de 250 à 500 € sur 10 ans, fin du report 150-0 B ter ; héritage à 50 % | −65,4 / −122,5 / −214,1 | −67,9 | −8,9 / −92,9 / −207,7 | −41,0 / −111,9 / −214,0 | 42,4 % / 50,4 % / inaccessible |
| **2. Taux et socle ajustés** | taux 41,5 %, socle 400 €, fin du report, décès (prix reporté), PFU 50 %, économies volontaires, CIR supprimé ; héritage à 50 % | 71,0 / −15,6 / −137,3 | −15,6 | 127,4 / 14,0 / −130,9 | 95,4 / −5,0 / −137,2 | 36,6 % / 43,0 % / inaccessible |
| **3. Idem avec héritage réaliste** | chemin 2 avec écart de déclaration de 35 % | 65,0 / −21,6 / −143,3 | −21,6 | 121,4 / 8,0 / −136,9 | 89,4 / −11,0 / −143,2 | 37,0 % / 43,6 % / inaccessible |
| **4. Taux 45 %** | taux 45 %, socle 400 €, écart de 35 %, patrimoine, économies volontaires, CIR supprimé | 113,0 / 14,1 / −127,8 | 14,1 | 169,5 / 43,7 / −121,4 | 137,4 / 24,7 / −127,7 | 37,0 % / 43,6 % / inaccessible |
| *Contre-épreuve* | chemin 2 sans le pari de l'héritage : droits actuels, décès avec crédit (borne haute) | −26,7 / −96,8 / −193,8 | −96,8 | 29,7 / −67,1 / −187,4 | −2,3 / −86,1 / −193,7 | 43,4 % / 52,5 % / inaccessible |

Décomposition du solde central (Md€/an) : palier 1 au taux et au socle du chemin / héritage / report 150-0 B ter / décès / PFU 50 % / économies.

| chemin | base | héritage | report | décès | PFU 50 % | économies | total |
|---|---|---|---|---|---|---|---|
| 1 | −126,3 | 0,0 | 3,7 | 0,0 | 0,0 | 0,0 | −122,5 |
| 2 | −42,5 | 0,0 | 3,4 | 9,1 | 1,0 | 13,3 | −15,6 |
| 3 | −42,5 | −6,0 | 3,4 | 9,1 | 1,0 | 13,3 | −21,6 |
| 4 | −6,2 | −6,0 | 3,4 | 9,1 | 0,4 | 13,3 | +14,1 |
| contre-épreuve | −42,5 | −82,7 | 3,4 | 10,6 | 1,0 | 13,3 | −96,8 |

**Qui équilibre, qui reste fragile (sans recommander).**

| chemin | bas | central | haut |
|---|---|---|---|
| 1 | sous 3 % du PIB | mieux qu'aujourd'hui | pire qu'aujourd'hui |
| 2 | équilibre | sous 3 % du PIB (−15,6) | mieux qu'aujourd'hui |
| 3 | équilibre | sous 3 % du PIB (−21,6) | mieux qu'aujourd'hui |
| 4 | équilibre | **équilibre (+14,1)** | mieux qu'aujourd'hui |
| contre-épreuve | sous 3 % du PIB | mieux qu'aujourd'hui | pire qu'aujourd'hui |

- **Équilibre au central** : seulement le chemin 4. Sa marge au central (14 Md€) est inférieure à l'écart entre l'héritage du modèle et le niveau constaté (6 à 13,5), plus la fragilité des économies de dépenses (CIR, apprentissage) ; au haut il reste à −128.
- **Presque** : les chemins 2 et 3 (−16 et −22). Ils atteignent l'équilibre à dix ans au central seulement avec la création de valeur, et s'ils comptent sur la croissance par l'IA (+19 Md€ de la ligne E à dix ans) ; sans elle, −5 et −11.
- **Fragiles** : le chemin 1 (−122,5 en régime : il reporte le trou, ne le comble pas) et la contre-épreuve (−97 : sans le pari de l'héritage, rien de ce qu'on a chiffré ne suffit à moins de 52,5 % de taux plat).
- **Au haut aucun chemin n'équilibre**, et il n'existe pas de taux plat inférieur à 80 % qui le fasse : à partir de 50-55 % le solde du haut baisse (exil, report du capital).
- **Qui paie** : chemins 2 et 3 : D1 à D3 gagnent peu ou perdent (−49 €/mois pour D1 avant plancher RSA), D9 perd 124 €, D10b à D10e perdent 1 400 à 60 000 €/mois ; chemin 4 : D1 à D3 perdent (−118, −59, −6) *dans la lecture « salariés » du matin* ; **recalé avec RSA et prime d'activité (§ 6bis) : D1 −81, D2 −17, D3 +35 €/mois par UC, D8 à D10 perdent 83 à 1 190 € (D10d −9 571, D10e −66 899)** ; chemin 1 : à 35 %, D1 −72 €/mois en année 1 (socle de 250 €), gain croissant ensuite, D10b −547 (à 38 % les pertes du haut sont un peu plus fortes).

## 8. Double comptes évités, et ce qui reste

1. **Décès = réalisation et héritage à 50 %** : l'impôt de 50 % porte déjà sur la valeur transmise, plus-value latente comprise. La réalisation avec crédit sur les droits ne rapporte donc rien à ce niveau de droits (0,0) ; elle ne compte que contre les droits actuels (au central : +1,9 en borne basse et +6,9 en borne haute au taux plat de 35 % ; +10,6 en borne haute à 41,5 %). La réalisation sans crédit est donnée à part (+8,5 seule, jusqu'à 75 % de la valeur cumulée). Le prix d'acquisition reporté (carryover) est compté dans les chemins : il ne cumule pas deux impôts à la transmission.
2. **PFU à 50 %** : seul le surplus sur le taux plat est compté (50 % moins le taux plat), parce que le palier 1 taxe déjà le capital courant (402,5 Md€ de base) au taux plat. ⚠️ Recouvrement possible avec la transparence des holdings (2,9 Md€ déjà comptés) : au plus quelques Md€ (V6804).
3. **Fin du report 150-0 B ter** : on compte le flux futur (3,7 au central) ; le stock rétroactif (36,8 Md€ une seule fois, ≈ 25,8 au taux plat) et la fin de la purge ne sont pas comptés : le premier est unique et juridiquement risqué, la seconde recoupe le décès.
4. **Santé** : déjà dans le palier 1 (9,7 Md€) ; l'Ondam (≈ 20 Md€ « d'ici 2029 », source non retrouvée, V6324) n'est pas ajouté.
5. **Chèque énergie** (0,76) : exclu des économies, redondant avec le socle (synthèse). **CIR** : le palier 1 le conserve, supprimer le CIR ou le recentrer est donc une économie nouvelle, mais l'effet sur la R&D n'est pas chiffré.

## 9. Ce que l'auteur a à trancher

Le modèle ne tranche pas ces points ; ils sont de choix, pas de preuve.

1. **Le pari de l'héritage** (50 % sur 300 Md€ avec fuite de 31 %, ou plus réaliste) : il pèse de 6 à 83 Md€. C'est le levier le plus gros après le taux plat et le moins prouvé.
2. **Qui porte l'effort** : le taux plat (tous les déciles, le dernier d'abord, mais aussi le milieu), le socle (forfaitaire, plus lourd pour les plus modestes) ou le patrimoine (peu de foyers, élasticités élevées, gain fragile).
3. **Le sens de « ne perdre personne »** : à 45 % et 400 €, D1 perd 81 € par mois et D2 17 € une fois le plancher RSA compté (D1 à D3 perdaient avant plancher, version du matin) ; le smicard perd dès 41,5 %, le parent isolé à tous les chemins, et le retraité locataire perd son aide au logement si on la supprime (§ 6bis). Les correctifs chiffrés au § 6ter ajoutent de 9,5 Md€ ((a) + (b)) à 65 Md€ (tout, chemin 4) au trou.
4. **La montée du socle** : un calendrier, pas un financement.
5. **Le CIR, les économies de dépenses** : petits montants, mais les seuls qui ne touchent ni les ménages ni les patrimoines.

> **Ajout du 03/11/2026 (soir) : taxe de 1 % sur le patrimoine de l'auteur** (`taxe-patrimoine-1pc.md`, options `immobilier` et `taxePatrimoine`). Avec la réforme immobilière en place (−177,5 au central), la taxe sans abattement rapporte 75 / 93 / 109 Md€ nets et porte le solde à −14,9 / −84,1 / −184,5. Chemins qui équilibrent alors au central : T1 au taux plat de 40 % avec un socle de 500 € (+0,3), ou le chemin 2 + la taxe (+60,6). Au haut, aucun chemin n'équilibre (meilleur : −87). La taxe foncière et l'IFI sont déjà supprimés par le palier 1, et les DMTO ne sont comptés qu'une fois.

## 10. Limites

- Tous les chiffres sont des ordres de grandeur sous hypothèses nommées (H420-H432), jamais des prédictions. Non confirmé : V6800-V6810.
- Le solde de croisière est statique : ni coût de transition (10 Md€ au central), ni création de valeur, ni dette. La colonne « année 10 » ajoute la création de valeur sans la transition (`palier1.horizons` fait l'inverse).
- Le taux plat est cherché pour le solde central ; le solde n'est pas monotone en taux plat (il plafonne au haut vers 50 %).
- Les contraintes juridiques ne sont pas examinées ici (Constitution, taux confiscatoire, directive mère-fille, rétroactivité) : voir `sources/report-150-0-b-ter-holdings.md` et `sources/deces-realisation-plus-values.md`.
- Les modules patrimoine ne simulent pas l'interaction entre un taux plat à 41,5 % et leurs propres élasticités ; ils sont évalués au taux plat comme taux de capital.

## Reproduction

Depuis `modeles/systeme-ideal/`, avec `jsc` = `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc` :

```
jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js options_financement.js rapport_options_financement.js > resultats-options-financement.txt
jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js options_financement.js test_options_financement.js
```
