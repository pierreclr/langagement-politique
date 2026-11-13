---
titre: "Chiffrage poste par poste : PS et Place publique (contre-budget 2027)"
statut: généré par detail.py (ne pas éditer à la main) ; règle de faisabilité commune (version 2, resultats-v2.md) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Chiffrage poste par poste : PS et Place publique (contre-budget 2027)

**Règle de chiffrage : version 2** (depuis le 13/11/2026). Toutes les estimations de cette page, ligne par ligne comme au total, suivent la règle de faisabilité commune (`faisabilite.py`, `relancer_v2.py`) : chaque recette ou économie est classée puis ramenée à une part réalisable par la même grille pour tous les programmes, y compris le nôtre, et les dépenses reçoivent le même plancher. Ce sont les chiffres de `resultats-v2.md` (mêmes 10 000 tirages, même graine 20261108). Les rappels de la version 1 sont signalés comme tels.

Cette page détaille, ligne par ligne, comment le banc d'essai chiffre ce programme : ce que dit la mesure, ce que le parti annonce, ce que nous estimons, comment nous l'estimons, avec quel modèle, et si le même modèle sert aux autres programmes quand les mesures se ressemblent. Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions. Le même banc chiffre notre propre programme : l'auteur est partie prenante de la comparaison, et les écarts de méthode entre programmes sont listés dans [les mêmes modèles pour tous](./memes-modeles.md).

Programme lu : Groupe Socialistes et apparentés (Assemblée nationale), contre-budget 2027 présenté le 16/09/2026, montants rapportés par LCP (16/09/2026, mis à jour le 12/10/2026, https://lcp.fr/actualites/budget-a-l-assemblee-les-socialistes-presentent-leurs-propositions-et-previennent-qu-ils), Selectra (17/09/2026, https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Investir Mag (16/09/2026, https://www.investirmag.fr/contre-budget-socialiste-smic-a-1-700-eur-csg-progressive-taxe-zucman/) et Moneyvox (16/09/2026, https://www.moneyvox.fr/impot/actualites/110407/budget-2027-les-socialistes-presentent-leur-contre-projet-et-entretiennent-le-flou-sur-la-censure), consultés le 09/11/2026 ; document du groupe non trouvé (⚠️ V-PS-01) (cote D, auteur = le programme).

Unités : milliards d'euros (Md€) par an, euros de 2025 ; un nombre positif améliore le solde public, un nombre négatif l'aggrave. Chaque estimation est une médiane de 10 000 tirages, suivie entre crochets de l'intervalle qui en contient 80 % (centiles 10 et 90). Régime : 2032. Résultats complets : `modeles/banc-programmes/resultats-v2.md`. Pages voisines : [La France insoumise](./detail-lfi.md), [Rassemblement national](./detail-rn.md), [Les Républicains (plan Retailleau)](./detail-lr.md), [Horizons, Édouard Philippe (lecture de notre simulateur)](./detail-philippe.md), [Glucksmann, Place publique (livret climat, chiffrage partiel)](./detail-glucksmann.md), [notre système](./detail-langagement.md).

## Le total

| | PS et Place publique (contre-budget 2027) |
|---|---|
| Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€) | **−15 [−23 ; −7]** |
| dont recettes nouvelles et économies | 23 [14 ; 32] |
| dont dépenses nouvelles et baisses d'impôts | 38 [35 ; 41] |
| Somme des médianes des postes ci-dessous | −16 |
| Moyenne du total = somme des moyennes des postes | −15,1 = −15,1 |
| Somme des montants annoncés par le parti, ligne par ligne (même signe) | 24 |
| Part des tirages où le programme aggrave le déficit | 99 % |
| Dette publique en 2038 (% du PIB ; taux d'intérêt fixe de 3,45 %) | 163 [160 ; 166] |
| Dette publique en 2058 (% du PIB) | 257 [247 ; 265] |

Lecture. Le total est celui du tableau comparatif de la version 2 (§ 1 de `modeles/banc-programmes/resultats-v2.md`) ; un test vérifie qu'il est recopié sans écart. Dans chaque tirage, le total est exactement la somme des lignes : la moyenne du total est donc la somme des moyennes des lignes (ci-dessus). La médiane, elle, ne s'additionne pas : la médiane du total (Le total, somme de nombreuses lignes, est presque symétrique : sa médiane reste proche de sa moyenne, et l'écart avec la somme des médianes vient, pour l'essentiel, des écarts entre moyenne et médiane de chaque ligne.) est −15,2 de supérieure Md€ à la somme des médianes (1,2), parce que les lois des lignes sont asymétriques (part réalisable des scores 0 et 1, dont la moyenne dépasse la médiane ; fourchettes de coût de −16,4 à 0,9 fois le montant, plus longues du côté de la dérive) et que les lignes sont tirées ensemble (facteurs communs). 1,3

## Ce que nous n'avons pas pu chiffrer

- conférence sociale sur les salaires et réouverture des négociations de branche (aucun montant).
- 1 Md€ pour la sécurité civile (Investir Mag ; peut-être inclus dans le climat).
- écart entre 39,5 Md€ de recettes annoncées et 39 Md€ détaillés (0,5 Md€ non retrouvé).
- fonds européen de défense de 500 Md€ financé par emprunt commun (programme de R. Glucksmann ; hors budget national).
- plan d'investissement de 100 Md€ sur dix ans prêté au candidat par des sites tiers (non confirmé en source primaire).
- réduction du déficit annoncée : 24 Md€ en 2027, soit 0,8 point de PIB (le banc la recalcule).

## La meilleure objection à notre chiffrage

Ce que le PS et Place publique peuvent opposer à ce chiffrage, dit aussi loyalement que possible :

- **Un budget annuel lu comme un programme.** Le contre-budget 2027 est un budget d'une année ; nous le lisons comme permanent (H-PS-PERMANENCE) et comme la base du candidat (H-PS-PERIMETRE), ce que le candidat peut récuser : il n'a pas publié de chiffrage propre.
- **L'impôt minimal sur les très grands patrimoines** est annoncé à 15 Md€ ; notre module des grandes fortunes, le même que pour l'ISF de La France insoumise, en retient 1,9 [0,3 ; 5,9] Md€ après érosion, exil et part réalisable. Les défenseurs de la mesure citent des estimations bien plus hautes ; la variante moins sévère du banc n'a pas encore été rejouée pour ce programme.
- **La CSG progressive** pèse −12,5 [−15,0 ; −10,6] Md€ sur le solde dans notre lecture, contre un coût annoncé de 10 Md€ : notre chiffre est un calcul de coin de table, pas un calcul OpenFisca (T-PS-1). Le parti peut le contester à bon droit.

## Les postes en un tableau

| N° | Poste | Annoncé par le parti (Md€) | Notre estimation (Md€) | Modèle ou traitement |
|---|---|---|---|---|
| [PS10](#ps10) | CSG progressive sur les revenus d'activité (de 9,2 % à 0,55 % au Smic, inchangée au-delà de 2 700 € net) | 10 | −12,5 [−15,0 ; −10,6] | fourchette propre à la ligne |
| [PS01](#ps01) | Impôt plancher de 2 % sur les patrimoines de plus de 100 M€ (« taxe Zucman »), sans ISF | 15 | 1,9 [0,3 ; 5,9] | règle v2, score 1 (part médiane 35 %), appliquée au résultat : module des grandes fortunes, érosion et exil |
| [PS02](#ps02) | CSG sur les gros héritages, calculée sur le total reçu au cours de la vie par chaque héritier (10 % des héritiers les plus aisés) | 10 | 3,5 [1,5 ; 7,1] | règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé |
| [PS03](#ps03) | Taxe sur les géants du numérique (relèvement de la taxe sur les services numériques) | 10 | 7,0 [4,6 ; 9,4] | règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé |
| [PS04](#ps04) | Révision des exonérations de cotisations sociales (« niches » sociales) | 4 | 2,8 [1,8 ; 3,8] | règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé |
| [PS05](#ps05) | Réforme des niches fiscales | 4 | 2,8 [1,8 ; 3,8] | règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé |
| [PS09](#ps09) | Smic à 1 700 € net (effets publics seulement ; le coût pour les entreprises est privé) | — | −3,5 [−8,5 ; 1,4] | levier Smic : salaires, OpenFisca-France, emploi |
| [PS06](#ps06) | Économies sur les marges dans les dépenses de santé | 4 | 1,4 [0,6 ; 2,8] | règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé |
| [PS12](#ps12) | Accès aux soins (hôpital, Ehpad, mutuelle publique gratuite des 18-25 ans : 1 Md€) | 5 | −5,3 [−6,0 ; −4,8] | montant du parti, 0,95 à 1,15 fois |
| [PS07](#ps07) | Économies de fonctionnement de l'État | 3,6 | 1,3 [0,5 ; 2,5] | règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé |
| [PS13](#ps13) | Loi intégrale contre les violences sexistes et sexuelles | 3 | −3,2 [−3,6 ; −2,9] | montant du parti, 0,95 à 1,15 fois |
| [PS14](#ps14) | Soutien aux agriculteurs | 2 | −2,1 [−2,4 ; −1,9] | montant du parti, 0,95 à 1,15 fois |
| [PS15](#ps15) | École | 2 | −2,1 [−2,4 ; −1,9] | montant du parti, 0,95 à 1,15 fois |
| [PS11](#ps11) | Climat et adaptation (dont fonds de sécurité climatique de 5 Md€ et Fonds vert des collectivités) | 10 | −10,5 [−11,9 ; −9,6] | montant du parti, 0,95 à 1,15 fois |
| [PS08a](#ps08a) | Lutte contre la fraude fiscale | 2,4 | 0,8 [0,4 ; 1,7] | règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé |
| [PS08b](#ps08b) | Lutte contre le travail dissimulé | 1,1 | 0,4 [0,2 ; 0,8] | règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé |
| [PS08c](#ps08c) | Économies annoncées non détaillées (17,5 Md€ annoncés, 15,1 détaillés) | 2,4 | 0,8 [0,4 ; 1,7] | règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé |

## Le détail, poste par poste

### Impôt sur le revenu et CSG

#### PS10 · CSG progressive sur les revenus d'activité (de 9,2 % à 0,55 % au Smic, inchangée au-delà de 2 700 € net) {#ps10}

- **La mesure, dans les mots du programme.** « une baisse […] de 10 milliards » ; « 21 millions de travailleurs » (Selectra) ; 130 € par mois au Smic (LCP). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), CSG. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ par an (coût).
- **Notre estimation.** **−12,5 [−15,0 ; −10,6]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 9 à 17, valeur la plus probable 12 Md€ (voir la lecture ci-dessous). Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Dépense : loi de la ligne inchangée (le plancher commun ne s'applique qu'à une fourchette triangulaire centrée sur le montant du programme).
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Coût annoncé : 10 Md€ pour 21 millions de bénéficiaires, soit 40 € par mois en moyenne. Recoupement de Claude (⚠️ calcul de coin de table, pas OpenFisca) : gain de 130 € par mois au Smic, décroissant jusqu'à 0 à 2 700 € net ; au salaire médian à temps plein (environ 2 100 € net) le gain est d'environ 60 € ; une moyenne de 50 à 65 € sur 21 millions donne 13 à 16 Md€, moins le surcroît d'impôt sur le revenu (la CSG est en partie déductible) : 12 Md€ central, de 9 à 17. À refaire avec OpenFisca-France (T-PS-1).
- **Modèle utilisé.** Aucun : fourchette propre à la ligne (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R13](./detail-lfi.md#r13) (OpenFisca-France sur foyers types, avec élasticité du revenu imposable) — Rassemblement national : [RN T08](./detail-rn.md#t08) (OpenFisca-France, impôt d'un salarié seul) ; [RN D03](./detail-rn.md#d03) (montant du parti, 0,7 à 1,3 fois) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PHT3](./detail-philippe.md#pht3) (lecture de notre simulateur (H-PH6, montant non publié)) — notre système : [M-REV](./detail-langagement.md#m-rev) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôt sur le revenu et CSG »](./memes-modeles.md#f-ir).
- **Fiabilité.** Pas de modèle : fourchette propre à la ligne. Cotes des sources de la ligne : D. 3 points marqués ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-CSG-PS : Central 12 Md€ (9 à 17) : estimation de Claude par interpolation linéaire du gain entre 1 443 et 2 700 € net, salaire médian net à temps plein d'environ 2 100 € (Insee, ordre de grandeur, ⚠️ non relu) ; le poids 0,3 sur le facteur commun « coût ».

### Patrimoine et héritages

#### PS01 · Impôt plancher de 2 % sur les patrimoines de plus de 100 M€ (« taxe Zucman »), sans ISF {#ps01}

- **La mesure, dans les mots du programme.** « Taxe Zucman […] : 15 milliards » (Selectra, LCP) ; « 10 milliards » (Investir Mag). Source : [article cité](https://lcp.fr/actualites/budget-a-l-assemblee-les-socialistes-presentent-leurs-propositions-et-previennent-qu-ils), Fiscalité du patrimoine. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 15 Md€ par an (recette ou économie).
- **Notre estimation.** **1,9 [0,3 ; 5,9]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Impôt minimal visé par la mesure sur les très grands patrimoines, appliqué au droit actuel (sans ISF), net de l'impôt déjà payé ; érosion et exil du module. Recette nette du module : 12,3 / 5,8 / 0,8 Md€ (favorable, central, défavorable), lue sur le facteur « comportement ». Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 1, J 0, E 0, score 1 (impôt plancher de 2 % : même type que LFI R04). Part réalisable de 10 % à 80 %, médiane 35 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au résultat du modèle, en plus de l'érosion et de l'exil que le modèle compte déjà.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Branché sur notre module de patrimoine (modeles/systeme-ideal/grandes_fortunes_0511.js, fonction zucmanSurDroitActuel, exportée par js/pont_systeme.js dans le cache `zucman_droit_actuel`) : impôt minimal de 2 % au-dessus de 100 M€ appliqué au droit actuel (pas d'ISF), net de l'impôt déjà payé, avec érosion de l'assiette et exil ; scénarios favorable / central / défavorable lus comme centiles 10 / 50 / 90 sur le facteur commun « comportement ». Ce n'est pas la ligne R04 de LFI (complément au-dessus d'un ISF rétabli). Montant annoncé : 15 Md€ (LCP, Selectra) ou 10 (Investir Mag) ; Gabriel Zucman 15 à 25 ; Institut de l'entreprise 5,5 (cote C, patronal, cité au banc pour LFI).
- **Modèle utilisé.** Module des grandes fortunes, érosion et exil : `modeles/systeme-ideal/grandes_fortunes_0511.js` (zucmanSurDroitActuel) et `moteur.levier_zucman` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R01a](./detail-lfi.md#r01a), [LFI R04](./detail-lfi.md#r04) (même module des grandes fortunes, même érosion et même exil ; barème propre à la mesure) ; [LFI R05](./detail-lfi.md#r05) (module des transmissions, planification et départs) — Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (même module des grandes fortunes, même érosion et même exil ; barème propre à la mesure) — Glucksmann, Place publique (livret climat, chiffrage partiel) : [Glucksmann GL02](./detail-glucksmann.md#gl02) (règle v2, score 0 (part médiane 10 %), appliquée au montant annoncé) — notre système : [M-TH](./detail-langagement.md#m-th), [M-PAT](./detail-langagement.md#m-pat), [M-TRANS](./detail-langagement.md#m-trans) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : B, C, D. 2 points marqués ⚠️ (non vérifié). Obstacle nommé : Conseil constitutionnel : risque de caractère confiscatoire si l'impôt total dépasse les revenus du patrimoine (jurisprudence sur l'ISF, non relue ici ⚠️) ; mobilité des contribuables.
- **Choix posés par l'IA.** le poids 0,9 sur le facteur commun « comportement » ; les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

#### PS02 · CSG sur les gros héritages, calculée sur le total reçu au cours de la vie par chaque héritier (10 % des héritiers les plus aisés) {#ps02}

- **La mesure, dans les mots du programme.** « CSG sur les gros héritages […] : 10 milliards » (Selectra, LCP). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Successions. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ par an (recette ou économie).
- **Notre estimation.** **3,5 [1,5 ; 7,1]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** *Loi de la version 1, remplacée par la règle v2 (point suivant) :* Le plafond est l'annonce du parti (10 Md€) ; la médiane (5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 2. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 1, J 0, E 0, score 1 (CSG sur les gros héritages : base constitutionnelle incertaine, sans précédent). Part réalisable de 10 % à 80 %, médiane 35 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au plus haut du montant annoncé et de la borne haute de la version 1 (10 Md€) : loi de 1 à 8 Md€, médiane 3,5, qui remplace la loi décrite ci-dessus.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Barème et seuil non publiés ; la presse indique que seuls les 10 % des héritiers les plus aisés seraient concernés. Base : droits de mutation à titre gratuit actuels de 20,8 Md€ (2024) ; 10 Md€ de plus = +48 %. Médiane 5 Md€ : notre module de transmissions (transmissions_0611.js) perd environ la moitié de la recette statique du scénario favorable au central sous l'effet de la planification (assurance-vie, démembrement, donations anticipées) et de l'exil des patrimoines mobiles (plat35 : 32,1 au favorable, 15,7 au central, cache systeme.json) : même proportion appliquée ici (⚠️ transposition, le module ne simule pas une CSG sur le cumul reçu).
- **Modèle utilisé.** Aucun : règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R01a](./detail-lfi.md#r01a), [LFI R04](./detail-lfi.md#r04) (module des grandes fortunes, érosion et exil) ; [LFI R05](./detail-lfi.md#r05) (module des transmissions, planification et départs) — Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (module des grandes fortunes, érosion et exil) — Glucksmann, Place publique (livret climat, chiffrage partiel) : [Glucksmann GL02](./detail-glucksmann.md#gl02) (règle v2, score 0 (part médiane 10 %), appliquée au montant annoncé) — notre système : [M-TH](./detail-langagement.md#m-th), [M-PAT](./detail-langagement.md#m-pat), [M-TRANS](./detail-langagement.md#m-trans) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : A, D. 3 points marqués ⚠️ (non vérifié). Obstacle nommé : Planification et contournement ; une CSG sur un capital reçu est une nouveauté juridique (qualification d'imposition de toute nature, égalité devant les charges publiques) ⚠️.
- **Choix posés par l'IA.** les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

### Impôts des entreprises

#### PS03 · Taxe sur les géants du numérique (relèvement de la taxe sur les services numériques) {#ps03}

- **La mesure, dans les mots du programme.** « taxe sur les géants du numérique : 10 milliards » (Selectra, LCP). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Numérique. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ par an (recette ou économie).
- **Notre estimation.** **7,0 [4,6 ; 9,4]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** *Loi de la version 1, remplacée par la règle v2 (point suivant) :* Le plafond est l'annonce du parti (10 Md€) ; la médiane (2 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0,5. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 1, J 1, E 0, score 2 (taxe sur les services numériques : même type que LFI R08). Part réalisable de 40 % à 100 %, médiane 70 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au plus haut du montant annoncé et de la borne haute de la version 1 (10 Md€) : loi de 4 à 10 Md€, médiane 7, qui remplace la loi décrite ci-dessus.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Taux et assiette non publiés. La taxe sur les services numériques (3 % de certains chiffres d'affaires) rapporte de l'ordre de 0,7 à 0,8 Md€ par an (⚠️ ordre de grandeur non relu en primaire) : 10 Md€ supposeraient de multiplier son produit par plus de dix (taux de l'ordre de 30 % ou assiette très élargie). Médiane 2 Md€ (taux relevé à 10-15 %, report partiel sur les clients français) ; LFI annonce 3,9 Md€ pour une mesure voisine (R08 du banc).
- **Modèle utilisé.** Aucun : règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R03](./detail-lfi.md#r03) (règle v2, score 3 (part médiane 100 %), appliquée au montant annoncé) ; [LFI R06](./detail-lfi.md#r06), [LFI R08](./detail-lfi.md#r08), [LFI R09](./detail-lfi.md#r09), [LFI R10](./detail-lfi.md#r10), [LFI R11](./detail-lfi.md#r11) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) ; [LFI R07](./detail-lfi.md#r07) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé) — Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) ; [RN F03](./detail-rn.md#f03), [RN F04](./detail-rn.md#f04) (règle v2, score 0 (part médiane 10 %), appliquée au montant annoncé) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PHT1](./detail-philippe.md#pht1) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-CRED](./detail-langagement.md#m-cred) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 3 points marqués ⚠️ (non vérifié). Obstacle nommé : Représailles commerciales des États-Unis (enquête de la section 301 en 2019-2020 sur la taxe française) ; report sur les annonceurs et vendeurs français ; droit de l'UE (liberté d'établissement) ⚠️.
- **Choix posés par l'IA.** les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

### Niches fiscales et sociales

#### PS04 · Révision des exonérations de cotisations sociales (« niches » sociales) {#ps04}

- **La mesure, dans les mots du programme.** « niches sur les cotisations retravaillées : 4 milliards supplémentaires » (LCP). Source : [article cité](https://lcp.fr/actualites/budget-a-l-assemblee-les-socialistes-presentent-leurs-propositions-et-previennent-qu-ils), Cotisations. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 4 Md€ par an (recette ou économie).
- **Notre estimation.** **2,8 [1,8 ; 3,8]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** *Loi de la version 1, remplacée par la règle v2 (point suivant) :* Le plafond est l'annonce du parti (4 Md€) ; la médiane (3 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 1,5. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 0, J 1, E 1, score 2 (exonérations de cotisations : même type que LFI R02). Part réalisable de 40 % à 100 %, médiane 70 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au plus haut du montant annoncé et de la borne haute de la version 1 (4 Md€) : loi de 1,6 à 4 Md€, médiane 2,8, qui remplace la loi décrite ci-dessus.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Lecture : recentrage des allègements généraux au-dessus de 1,6 ou 2 Smic. Interaction avec le Smic (PS09) : non modélisée (les deux lignes touchent les allègements).
- **Modèle utilisé.** Aucun : règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R02](./detail-lfi.md#r02) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — Rassemblement national : [RN T04](./detail-rn.md#t04) (montant du parti, 0,95 à 1,15 fois) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PH05](./detail-philippe.md#ph05) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — notre système : [M-FRP](./detail-langagement.md#m-frp), [M-CONV](./detail-langagement.md#m-conv) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Niches fiscales et sociales »](./memes-modeles.md#f-niches).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Effet sur l'emploi des salaires intermédiaires (non modélisé) ; interaction avec PS09.
- **Choix posés par l'IA.** les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

#### PS05 · Réforme des niches fiscales {#ps05}

- **La mesure, dans les mots du programme.** « niches fiscales : 4 milliards » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Dépenses fiscales. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 4 Md€ par an (recette ou économie).
- **Notre estimation.** **2,8 [1,8 ; 3,8]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** *Loi de la version 1, remplacée par la règle v2 (point suivant) :* Le plafond est l'annonce du parti (4 Md€) ; la médiane (2,5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 1. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 0, J 1, E 1, score 2 (niches fiscales : même type que LFI R02). Part réalisable de 40 % à 100 %, médiane 70 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au plus haut du montant annoncé et de la borne haute de la version 1 (4 Md€) : loi de 1,6 à 4 Md€, médiane 2,8, qui remplace la loi décrite ci-dessus.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Niches non nommées dans la presse lue. Médiane 2,5 : les suppressions de niches votées en loi de finances rapportent souvent moins que prévu (comportements, reports).
- **Modèle utilisé.** Aucun : règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R02](./detail-lfi.md#r02) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — Rassemblement national : [RN T04](./detail-rn.md#t04) (montant du parti, 0,95 à 1,15 fois) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PH05](./detail-philippe.md#ph05) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — notre système : [M-FRP](./detail-langagement.md#m-frp), [M-CONV](./detail-langagement.md#m-conv) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Niches fiscales et sociales »](./memes-modeles.md#f-niches).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Niches non désignées ; risque de rendement inférieur.
- **Choix posés par l'IA.** les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

### Smic, salaires et cotisations

#### PS09 · Smic à 1 700 € net (effets publics seulement ; le coût pour les entreprises est privé) {#ps09}

- **La mesure, dans les mots du programme.** « porter le Smic à 1 700 € nets par mois » (Selectra, Investir Mag ; aucun coût publié). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Salaires. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par le parti pour cette ligne.
- **Notre estimation.** **−3,5 [−8,5 ; 1,4]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Salaires du privé en loi lognormale ; hausse du Smic : plancher 5,8 %, médiane 8,1 %, plafond 17,8 % ; cotisations, CSG, impôt, prime d'activité et allègements lus dans OpenFisca-France par foyer type. Emploi perdu selon une élasticité au coût du travail : de 0,05 à 0,5, valeur la plus probable 0,25 ; indexation des allègements (1 = droit actuel, 0 = gel) : de 0 à 1, valeur la plus probable 1. Seuls les effets sur les finances publiques sont comptés, pas le coût pour les entreprises. Calendrier : part du régime atteinte de 2028 à 2032 : 80 %, 100 %, 100 %, 100 %, 100 %.
- **Règle v2 (faisabilité commune).** Modèle de coût : non touché par la règle ; son incertitude vient de ses paramètres.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Branché sur le même levier que la ligne S01 de LFI (leviers2.py : salaires lognormaux, allègements, grille OpenFisca-France), avec les mêmes paramètres sauf la hausse. Lecture : le Smic net atteint 1 700 € grâce à la CSG progressive (PS10 : environ +130 € net au Smic) et à une hausse du Smic brut : (1 700 − 1 443 − 130) / (1 443 + 130) = +8,1 % (médiane) ; bas +5,8 % (Smic de 1 477 € net en 2027 selon Investir Mag) ; haut +17,8 % (si les 1 700 € s'entendent hors effet de la CSG, comme pour LFI). Le PS ne publie ni calendrier ni coût ; « conférence sociale sur les salaires » : lu comme une hausse par décret. Interaction avec PS10 (le gain de CSG n'est pas recompté ici) : approximation.
- **Modèle utilisé.** Levier Smic : salaires, OpenFisca-France, emploi : `leviers2.levier_smic` et `smic_openfisca.py`.
- **La même famille ailleurs.** La France insoumise : [LFI S01](./detail-lfi.md#s01) (même module ; paramètres propres à la mesure : hausse du Smic) — Rassemblement national : [RN D02](./detail-rn.md#d02) (ordre de grandeur sans source primaire, dit « grossier ») — Les Républicains (plan Retailleau) : [LRT2](./detail-lr.md#lrt2) (montant du parti, 0,95 à 1,15 fois) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PHT2](./detail-philippe.md#pht2) (lecture de notre simulateur (H-PH5, montant non publié)). Ce que le code confirme et ce qui diffère : [note de famille « Smic, salaires et cotisations »](./memes-modeles.md#f-salaires).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : C, D. Obstacle nommé : Coût du travail au Smic (emploi) ; indexation des allègements.
- **Choix posés par l'IA.** H-SMIC-PS : Hausse du Smic brut : médiane +8,1 %, de +5,8 % à +17,8 % ; autres paramètres : ceux de S01 (LFI), hypothèses H-SMIC-1 à H-SMIC-6.

### Santé et dépendance

#### PS06 · Économies sur les marges dans les dépenses de santé {#ps06}

- **La mesure, dans les mots du programme.** « marges des dépenses de santé : 4 milliards » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Santé. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 4 Md€ par an (recette ou économie).
- **Notre estimation.** **1,4 [0,6 ; 2,8]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** *Loi de la version 1, remplacée par la règle v2 (point suivant) :* Le plafond est l'annonce du parti (4 Md€) ; la médiane (1,5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0,5. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 0, J 1, E 0, score 1 (marges dans la santé : non détaillé). Part réalisable de 10 % à 80 %, médiane 35 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au plus haut du montant annoncé et de la borne haute de la version 1 (4 Md€) : loi de 0,4 à 3,2 Md€, médiane 1,4, qui remplace la loi décrite ci-dessus.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Lecture : baisse des marges des fournisseurs (médicaments, dispositifs médicaux, laboratoires). Même médiane relative que la ligne H01 du RN (coûts hospitaliers : 2,0 sur 8,3).
- **Modèle utilisé.** Aucun : règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D07](./detail-lfi.md#d07), [LFI D08](./detail-lfi.md#d08) (fourchette propre à la ligne) ; [LFI D18](./detail-lfi.md#d18), [LFI D24](./detail-lfi.md#d24) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé) ; [RN H03](./detail-rn.md#h03), [RN H06](./detail-rn.md#h06) (règle v2, score 0 (part médiane 10 %), appliquée au montant annoncé) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PH04](./detail-philippe.md#ph04) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — notre système : [M-GA](./detail-langagement.md#m-ga), [M-SECU](./detail-langagement.md#m-secu) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Négociations conventionnelles ; pénuries possibles sur les produits à faible marge.
- **Choix posés par l'IA.** les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

#### PS12 · Accès aux soins (hôpital, Ehpad, mutuelle publique gratuite des 18-25 ans : 1 Md€) {#ps12}

- **La mesure, dans les mots du programme.** « accès aux soins : 5 milliards » (Selectra) ; LCP : 3 Md€ pour l'hôpital et les Ehpad. Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Santé. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 5 Md€ par an (coût).
- **Notre estimation.** **−5,3 [−6,0 ; −4,8]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (5 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Dépense : fourchette élargie au plancher commun (0,9 à 1,3 fois le montant du programme) : de 4,75–5,75 à 4,5–6,5 Md€, valeur la plus probable 5 inchangée.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D07](./detail-lfi.md#d07), [LFI D08](./detail-lfi.md#d08) (fourchette propre à la ligne) ; [LFI D18](./detail-lfi.md#d18), [LFI D24](./detail-lfi.md#d24) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé) ; [RN H03](./detail-rn.md#h03), [RN H06](./detail-rn.md#h06) (règle v2, score 0 (part médiane 10 %), appliquée au montant annoncé) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PH04](./detail-philippe.md#ph04) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — notre système : [M-GA](./detail-langagement.md#m-ga), [M-SECU](./detail-langagement.md#m-secu) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

### Fonctionnement de l'État et opérateurs

#### PS07 · Économies de fonctionnement de l'État {#ps07}

- **La mesure, dans les mots du programme.** « fonctionnement de l'État : 3,6 milliards » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), État. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 3,6 Md€ par an (recette ou économie).
- **Notre estimation.** **1,3 [0,5 ; 2,5]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** *Loi de la version 1, remplacée par la règle v2 (point suivant) :* Le plafond est l'annonce du parti (3,6 Md€) ; la médiane (2,5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 1. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 0, J 1, E 0, score 1 (fonctionnement de l'État : même type que LR03). Part réalisable de 10 % à 80 %, médiane 35 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au plus haut du montant annoncé et de la borne haute de la version 1 (3,6 Md€) : loi de 0,36 à 2,88 Md€, médiane 1,26, qui remplace la loi décrite ci-dessus.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Effort de fonctionnement d'un an ; lu comme permanent.
- **Modèle utilisé.** Aucun : règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN A01](./detail-rn.md#a01), [RN A02](./detail-rn.md#a02), [RN A03](./detail-rn.md#a03), [RN H05](./detail-rn.md#h05) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé) — Les Républicains (plan Retailleau) : [LR03](./detail-lr.md#lr03), [LR04](./detail-lr.md#lr04), [LR07](./detail-lr.md#lr07), [LR08](./detail-lr.md#lr08), [LR09](./detail-lr.md#lr09) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé) ; [LR10](./detail-lr.md#lr10) (règle v2, score 0 (part médiane 10 %), appliquée au montant annoncé) — notre système : [M-URSSAF](./detail-langagement.md#m-urssaf), [M-FORM](./detail-langagement.md#m-form), [M-GM](./detail-langagement.md#m-gm), [M-ECO](./detail-langagement.md#m-eco) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Fonctionnement de l'État et opérateurs »](./memes-modeles.md#f-etat).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Aucune contrainte juridique ; exécution.
- **Choix posés par l'IA.** les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

### Services publics et dépenses nouvelles

#### PS13 · Loi intégrale contre les violences sexistes et sexuelles {#ps13}

- **La mesure, dans les mots du programme.** « loi intégrale […] : 3 milliards » (Selectra, Investir Mag, Moneyvox). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Justice. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 3 Md€ par an (coût).
- **Notre estimation.** **−3,2 [−3,6 ; −2,9]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (3 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Dépense : fourchette élargie au plancher commun (0,9 à 1,3 fois le montant du programme) : de 2,85–3,45 à 2,7–3,9 Md€, valeur la plus probable 3 inchangée.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D10](./detail-lfi.md#d10), [LFI D12](./detail-lfi.md#d12), [LFI D13](./detail-lfi.md#d13) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D11](./detail-lfi.md#d11), [LFI D17b](./detail-lfi.md#d17b), [LFI D22](./detail-lfi.md#d22) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D17a](./detail-lfi.md#d17a), [LFI D25](./detail-lfi.md#d25) (coût unitaire × quantité) — Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PHD3](./detail-philippe.md#phd3) (lecture de notre simulateur (H-PH9, montant non publié)) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

#### PS14 · Soutien aux agriculteurs {#ps14}

- **La mesure, dans les mots du programme.** « agriculteurs : 2 milliards » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Agriculture. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 2 Md€ par an (coût).
- **Notre estimation.** **−2,1 [−2,4 ; −1,9]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (2 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Dépense : fourchette élargie au plancher commun (0,9 à 1,3 fois le montant du programme) : de 1,9–2,3 à 1,8–2,6 Md€, valeur la plus probable 2 inchangée.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D10](./detail-lfi.md#d10), [LFI D12](./detail-lfi.md#d12), [LFI D13](./detail-lfi.md#d13) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D11](./detail-lfi.md#d11), [LFI D17b](./detail-lfi.md#d17b), [LFI D22](./detail-lfi.md#d22) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D17a](./detail-lfi.md#d17a), [LFI D25](./detail-lfi.md#d25) (coût unitaire × quantité) — Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PHD3](./detail-philippe.md#phd3) (lecture de notre simulateur (H-PH9, montant non publié)) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

#### PS15 · École {#ps15}

- **La mesure, dans les mots du programme.** « école : 2 milliards » (Selectra, Investir Mag). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), École. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 2 Md€ par an (coût).
- **Notre estimation.** **−2,1 [−2,4 ; −1,9]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (2 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Dépense : fourchette élargie au plancher commun (0,9 à 1,3 fois le montant du programme) : de 1,9–2,3 à 1,8–2,6 Md€, valeur la plus probable 2 inchangée.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D10](./detail-lfi.md#d10), [LFI D12](./detail-lfi.md#d12), [LFI D13](./detail-lfi.md#d13) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D11](./detail-lfi.md#d11), [LFI D17b](./detail-lfi.md#d17b), [LFI D22](./detail-lfi.md#d22) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D17a](./detail-lfi.md#d17a), [LFI D25](./detail-lfi.md#d25) (coût unitaire × quantité) — Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PHD3](./detail-philippe.md#phd3) (lecture de notre simulateur (H-PH9, montant non publié)) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

### Logement et transition écologique

#### PS11 · Climat et adaptation (dont fonds de sécurité climatique de 5 Md€ et Fonds vert des collectivités) {#ps11}

- **La mesure, dans les mots du programme.** « 10 milliards pour le climat, dont 5 milliards pour un fonds de sécurité climatique » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Climat. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ par an (coût).
- **Notre estimation.** **−10,5 [−11,9 ; −9,6]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (10 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Dépense : fourchette élargie au plancher commun (0,9 à 1,3 fois le montant du programme) : de 9,5–11,5 à 9–13 Md€, valeur la plus probable 10 inchangée.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D03](./detail-lfi.md#d03) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D14](./detail-lfi.md#d14) (fourchette propre à la ligne) ; [LFI D16](./detail-lfi.md#d16) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN G05](./detail-rn.md#g05) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé) — Horizons, Édouard Philippe (lecture de notre simulateur) : [Horizons PHD4](./detail-philippe.md#phd4) (lecture de notre simulateur (H-PH10, montant non publié)) — Glucksmann, Place publique (livret climat, chiffrage partiel) : [Glucksmann GL01](./detail-glucksmann.md#gl01) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Logement et transition écologique »](./memes-modeles.md#f-logement).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

### Fraude

#### PS08a · Lutte contre la fraude fiscale {#ps08a}

- **La mesure, dans les mots du programme.** « fraude fiscale : 2,4 milliards » (Selectra) ; « 5,5 milliards » fraude comprise (Investir Mag). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Fraude. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 2,4 Md€ par an (recette ou économie).
- **Notre estimation.** **0,8 [0,4 ; 1,7]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** *Loi de la version 1, remplacée par la règle v2 (point suivant) :* Le plafond est l'annonce du parti (2,4 Md€) ; la médiane (1 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0,3. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 0, J 1, E 0, score 1 (fraude fiscale : même type que LR17). Part réalisable de 10 % à 80 %, médiane 35 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au plus haut du montant annoncé et de la borne haute de la version 1 (2,4 Md€) : loi de 0,24 à 1,92 Md€, médiane 0,84, qui remplace la loi décrite ci-dessus.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Même médiane relative que la ligne H02 du RN (fraude) : les recettes de la lutte contre la fraude sont incertaines et lentes.
- **Modèle utilisé.** Aucun : règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R12](./detail-lfi.md#r12) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — Rassemblement national : [RN F05](./detail-rn.md#f05), [RN H02](./detail-rn.md#h02) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé) ; [RN F06](./detail-rn.md#f06) (règle v2, score 0 (part médiane 10 %), appliquée au montant annoncé) — Les Républicains (plan Retailleau) : [LR17](./detail-lr.md#lr17) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé). Ce que le code confirme et ce qui diffère : [note de famille « Fraude »](./memes-modeles.md#f-fraude).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 2 points marqués ⚠️ (non vérifié). Obstacle nommé : Recouvrement effectif bien inférieur aux montants notifiés (Cour des comptes, non relue ici ⚠️).
- **Choix posés par l'IA.** les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

#### PS08b · Lutte contre le travail dissimulé {#ps08b}

- **La mesure, dans les mots du programme.** « travail dissimulé : 1,1 milliard » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Fraude. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 1,1 Md€ par an (recette ou économie).
- **Notre estimation.** **0,4 [0,2 ; 0,8]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** *Loi de la version 1, remplacée par la règle v2 (point suivant) :* Le plafond est l'annonce du parti (1,1 Md€) ; la médiane (0,4 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0,1. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 0, J 1, E 0, score 1 (travail dissimulé : même type que LR17). Part réalisable de 10 % à 80 %, médiane 35 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au plus haut du montant annoncé et de la borne haute de la version 1 (1,1 Md€) : loi de 0,11 à 0,88 Md€, médiane 0,385, qui remplace la loi décrite ci-dessus.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Idem PS08a.
- **Modèle utilisé.** Aucun : règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R12](./detail-lfi.md#r12) (règle v2, score 2 (part médiane 70 %), appliquée au montant annoncé) — Rassemblement national : [RN F05](./detail-rn.md#f05), [RN H02](./detail-rn.md#h02) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé) ; [RN F06](./detail-rn.md#f06) (règle v2, score 0 (part médiane 10 %), appliquée au montant annoncé) — Les Républicains (plan Retailleau) : [LR17](./detail-lr.md#lr17) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé). Ce que le code confirme et ce qui diffère : [note de famille « Fraude »](./memes-modeles.md#f-fraude).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Idem PS08a.
- **Choix posés par l'IA.** les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

### Autres recettes et écritures sans effet sur le déficit

#### PS08c · Économies annoncées non détaillées (17,5 Md€ annoncés, 15,1 détaillés) {#ps08c}

- **La mesure, dans les mots du programme.** « environ 17,5 milliards d'économies et de lutte contre la fraude » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Non détaillé. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 2,4 Md€ par an (recette ou économie).
- **Notre estimation.** **0,8 [0,4 ; 1,7]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** *Loi de la version 1, remplacée par la règle v2 (point suivant) :* Le plafond est l'annonce du parti (2,4 Md€) ; la médiane (0,5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Règle v2 (faisabilité commune).** Classée M 0, J 1, E 0, score 1 (économies non détaillées : même type que LR11). Part réalisable de 10 % à 80 %, médiane 35 % (grille commune, la même pour tous les programmes, y compris le nôtre ; convention de Claude ⚠️), tirée avec le facteur « coût » (poids 0,5) et un aléa propre. Elle s'applique au plus haut du montant annoncé et de la borne haute de la version 1 (2,4 Md€) : loi de 0,24 à 1,92 Md€, médiane 0,84, qui remplace la loi décrite ci-dessus.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Écart entre le total annoncé et la somme des lignes rapportées ; Investir Mag donne 12,1 Md€ (niches et fraude) : la presse ne concorde pas.
- **Modèle utilisé.** Aucun : règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN F07](./detail-rn.md#f07) (règle v2, score 0 (part médiane 10 %), appliquée au montant annoncé) ; [RN G03](./detail-rn.md#g03) (valeur fixe (0)) ; [RN R30](./detail-rn.md#r30) (règle v2, score 3 (part médiane 100 %), appliquée au montant annoncé) — Les Républicains (plan Retailleau) : [LR11](./detail-lr.md#lr11) (règle v2, score 1 (part médiane 35 %), appliquée au montant annoncé) — notre système : [M-FANT](./detail-langagement.md#m-fant) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Autres recettes et écritures sans effet sur le déficit »](./memes-modeles.md#f-autres).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Non détaillé.
- **Choix posés par l'IA.** les réponses (M, J, E) de la règle v2 et la grille des parts réalisables (convention de Claude), avec le poids 0,5 sur le facteur « coût ».

---

Page générée par `modeles/banc-programmes/detail.py` à partir de `programmes/ps/mesures.py`, de `faisabilite.py` et de `donnees/resultats-v2.json` (règle v2 ; rappels de la version 1 : `donnees/resultats.json`) ; aucun chiffre n'y est tapé à la main. Écrite par Claude (IA d'Anthropic) pour l'auteur ; même banc pour tous, conflit d'intérêts déclaré.
