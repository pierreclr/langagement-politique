---
titre: "Chiffrage poste par poste : PS et Place publique (contre-budget 2027)"
statut: généré par detail.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Chiffrage poste par poste : PS et Place publique (contre-budget 2027)

Cette page détaille, ligne par ligne, comment le banc d'essai chiffre ce programme : ce que dit la mesure, ce que le parti annonce, ce que nous estimons, comment nous l'estimons, avec quel modèle, et si le même modèle sert aux autres programmes quand les mesures se ressemblent. Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions. Le même banc chiffre notre propre programme : l'auteur est partie prenante de la comparaison, et les écarts de méthode entre programmes sont listés dans [les mêmes modèles pour tous](./memes-modeles.md).

Programme lu : Groupe Socialistes et apparentés (Assemblée nationale), contre-budget 2027 présenté le 16/09/2026, montants rapportés par LCP (16/09/2026, mis à jour le 12/10/2026, https://lcp.fr/actualites/budget-a-l-assemblee-les-socialistes-presentent-leurs-propositions-et-previennent-qu-ils), Selectra (17/09/2026, https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Investir Mag (16/09/2026, https://www.investirmag.fr/contre-budget-socialiste-smic-a-1-700-eur-csg-progressive-taxe-zucman/) et Moneyvox (16/09/2026, https://www.moneyvox.fr/impot/actualites/110407/budget-2027-les-socialistes-presentent-leur-contre-projet-et-entretiennent-le-flou-sur-la-censure), consultés le 09/11/2026 ; document du groupe non trouvé (⚠️ V-PS-01) (cote D, auteur = le programme).

Unités : milliards d'euros (Md€) par an, euros de 2025 ; un nombre positif améliore le solde public, un nombre négatif l'aggrave. Chaque estimation est une médiane de 10 000 tirages, suivie entre crochets de l'intervalle qui en contient 80 % (centiles 10 et 90). Régime : 2032. Résultats complets : `modeles/banc-programmes/resultats.md`. Pages voisines : [La France insoumise](./detail-lfi.md), [Rassemblement national](./detail-rn.md), [Les Républicains (plan Retailleau)](./detail-lr.md), [Glucksmann, Place publique (livret climat, chiffrage partiel)](./detail-glucksmann.md), [notre système](./detail-langagement.md).

## Le total

| | PS et Place publique (contre-budget 2027) |
|---|---|
| Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€) | **−11 [−19 ; −3]** |
| dont recettes nouvelles et économies | 26 [18 ; 34] |
| dont dépenses nouvelles et baisses d'impôts | 37 [35 ; 40] |
| Somme des médianes des postes ci-dessous | −14 |
| Somme des montants annoncés par le parti, ligne par ligne (même signe) | 24 |
| Part des tirages où le programme aggrave le déficit | 96 % |
| Dette publique en 2038 (% du PIB ; taux d'intérêt fixe de 3,45 %) | 161 [158 ; 164] |
| Dette publique en 2058 (% du PIB) | 252 [244 ; 261] |

Lecture. La médiane du total n'est pas la somme des médianes des postes : les postes sont tirés ensemble, avec des lois souvent asymétriques (pour une économie passée par le filtre, la moitié des tirages tombe entre la médiane et l'annonce, plus haut : la médiane du total est donc au-dessus de la somme des médianes). Le total est celui du tableau comparatif des résultats (§ 1 et § 11.1 de `modeles/banc-programmes/resultats.md`) ; un test vérifie qu'il est recopié sans écart.

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
- **L'impôt minimal sur les très grands patrimoines** est annoncé à 15 Md€ ; notre module des grandes fortunes, le même que pour l'ISF de La France insoumise, en retient 5,9 [0,8 ; 12,3] Md€ après érosion et exil. Les défenseurs de la mesure citent des estimations bien plus hautes ; la variante moins sévère du banc n'a pas encore été rejouée pour ce programme.
- **La CSG progressive** pèse −12,5 [−15,0 ; −10,6] Md€ sur le solde dans notre lecture, contre un coût annoncé de 10 Md€ : notre chiffre est un calcul de coin de table, pas un calcul OpenFisca (T-PS-1). Le parti peut le contester à bon droit.

## Les postes en un tableau

| N° | Poste | Annoncé par le parti (Md€) | Notre estimation (Md€) | Modèle ou traitement |
|---|---|---|---|---|
| [PS10](#ps10) | CSG progressive sur les revenus d'activité (de 9,2 % à 0,55 % au Smic, inchangée au-delà de 2 700 € net) | 10 | −12,5 [−15,0 ; −10,6] | fourchette propre à la ligne |
| [PS01](#ps01) | Impôt plancher de 2 % sur les patrimoines de plus de 100 M€ (« taxe Zucman »), sans ISF | 15 | 5,9 [0,8 ; 12,3] | module des grandes fortunes, érosion et exil |
| [PS02](#ps02) | CSG sur les gros héritages, calculée sur le total reçu au cours de la vie par chaque héritier (10 % des héritiers les plus aisés) | 10 | 5,0 [2,6 ; 9,0] | annonce plafonnée, médiane jugée réalisable à 50 % de l'annonce |
| [PS03](#ps03) | Taxe sur les géants du numérique (relèvement de la taxe sur les services numériques) | 10 | 2,0 [0,8 ; 8,4] | annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce |
| [PS04](#ps04) | Révision des exonérations de cotisations sociales (« niches » sociales) | 4 | 3,0 [1,8 ; 3,8] | annonce plafonnée, médiane jugée réalisable à 75 % de l'annonce |
| [PS05](#ps05) | Réforme des niches fiscales | 4 | 2,5 [1,3 ; 3,7] | annonce plafonnée, médiane jugée réalisable à 62 % de l'annonce |
| [PS09](#ps09) | Smic à 1 700 € net (effets publics seulement ; le coût pour les entreprises est privé) | — | −3,4 [−8,4 ; 1,6] | levier Smic : salaires, OpenFisca-France, emploi |
| [PS06](#ps06) | Économies sur les marges dans les dépenses de santé | 4 | 1,5 [0,7 ; 3,5] | annonce plafonnée, médiane jugée réalisable à 38 % de l'annonce |
| [PS12](#ps12) | Accès aux soins (hôpital, Ehpad, mutuelle publique gratuite des 18-25 ans : 1 Md€) | 5 | −5,1 [−5,5 ; −4,9] | montant du parti, 0,95 à 1,15 fois |
| [PS07](#ps07) | Économies de fonctionnement de l'État | 3,6 | 2,5 [1,3 ; 3,4] | annonce plafonnée, médiane jugée réalisable à 69 % de l'annonce |
| [PS13](#ps13) | Loi intégrale contre les violences sexistes et sexuelles | 3 | −3,1 [−3,3 ; −2,9] | montant du parti, 0,95 à 1,15 fois |
| [PS14](#ps14) | Soutien aux agriculteurs | 2 | −2,1 [−2,2 ; −2,0] | montant du parti, 0,95 à 1,15 fois |
| [PS15](#ps15) | École | 2 | −2,1 [−2,2 ; −2,0] | montant du parti, 0,95 à 1,15 fois |
| [PS11](#ps11) | Climat et adaptation (dont fonds de sécurité climatique de 5 Md€ et Fonds vert des collectivités) | 10 | −10,3 [−11,0 ; −9,8] | montant du parti, 0,95 à 1,15 fois |
| [PS08a](#ps08a) | Lutte contre la fraude fiscale | 2,4 | 1,0 [0,4 ; 2,1] | annonce plafonnée, médiane jugée réalisable à 42 % de l'annonce |
| [PS08b](#ps08b) | Lutte contre le travail dissimulé | 1,1 | 0,4 [0,2 ; 1,0] | annonce plafonnée, médiane jugée réalisable à 36 % de l'annonce |
| [PS08c](#ps08c) | Économies annoncées non détaillées (17,5 Md€ annoncés, 15,1 détaillés) | 2,4 | 0,5 [0,1 ; 2,0] | annonce plafonnée, médiane jugée réalisable à 21 % de l'annonce |

## Le détail, poste par poste

### Impôt sur le revenu et CSG

#### PS10 · CSG progressive sur les revenus d'activité (de 9,2 % à 0,55 % au Smic, inchangée au-delà de 2 700 € net) {#ps10}

- **La mesure, dans les mots du programme.** « une baisse […] de 10 milliards » ; « 21 millions de travailleurs » (Selectra) ; 130 € par mois au Smic (LCP). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), CSG. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ par an (coût).
- **Notre estimation.** **−12,5 [−15,0 ; −10,6]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 9 à 17, valeur la plus probable 12 Md€ (voir la lecture ci-dessous). Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Coût annoncé : 10 Md€ pour 21 millions de bénéficiaires, soit 40 € par mois en moyenne. Recoupement de Claude (⚠️ calcul de coin de table, pas OpenFisca) : gain de 130 € par mois au Smic, décroissant jusqu'à 0 à 2 700 € net ; au salaire médian à temps plein (environ 2 100 € net) le gain est d'environ 60 € ; une moyenne de 50 à 65 € sur 21 millions donne 13 à 16 Md€, moins le surcroît d'impôt sur le revenu (la CSG est en partie déductible) : 12 Md€ central, de 9 à 17. À refaire avec OpenFisca-France (T-PS-1).
- **Modèle utilisé.** Aucun : fourchette propre à la ligne (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R13](./detail-lfi.md#r13) (OpenFisca-France sur foyers types, avec élasticité du revenu imposable) — Rassemblement national : [RN T08](./detail-rn.md#t08) (OpenFisca-France, impôt d'un salarié seul) ; [RN D03](./detail-rn.md#d03) (montant du parti, 0,7 à 1,3 fois) — notre système : [M-REV](./detail-langagement.md#m-rev) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôt sur le revenu et CSG »](./memes-modeles.md#f-ir).
- **Fiabilité.** Pas de modèle : fourchette propre à la ligne. Cotes des sources de la ligne : D. 3 points marqués ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-CSG-PS : Central 12 Md€ (9 à 17) : estimation de Claude par interpolation linéaire du gain entre 1 443 et 2 700 € net, salaire médian net à temps plein d'environ 2 100 € (Insee, ordre de grandeur, ⚠️ non relu) ; le poids 0,3 sur le facteur commun « coût ».

### Patrimoine et héritages

#### PS01 · Impôt plancher de 2 % sur les patrimoines de plus de 100 M€ (« taxe Zucman »), sans ISF {#ps01}

- **La mesure, dans les mots du programme.** « Taxe Zucman […] : 15 milliards » (Selectra, LCP) ; « 10 milliards » (Investir Mag). Source : [article cité](https://lcp.fr/actualites/budget-a-l-assemblee-les-socialistes-presentent-leurs-propositions-et-previennent-qu-ils), Fiscalité du patrimoine. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 15 Md€ par an (recette ou économie).
- **Notre estimation.** **5,9 [0,8 ; 12,3]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Impôt minimal visé par la mesure sur les très grands patrimoines, appliqué au droit actuel (sans ISF), net de l'impôt déjà payé ; érosion et exil du module. Recette nette du module : 12,3 / 5,8 / 0,8 Md€ (favorable, central, défavorable), lue sur le facteur « comportement ». Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Branché sur notre module de patrimoine (modeles/systeme-ideal/grandes_fortunes_0511.js, fonction zucmanSurDroitActuel, exportée par js/pont_systeme.js dans le cache `zucman_droit_actuel`) : impôt minimal de 2 % au-dessus de 100 M€ appliqué au droit actuel (pas d'ISF), net de l'impôt déjà payé, avec érosion de l'assiette et exil ; scénarios favorable / central / défavorable lus comme centiles 10 / 50 / 90 sur le facteur commun « comportement ». Ce n'est pas la ligne R04 de LFI (complément au-dessus d'un ISF rétabli). Montant annoncé : 15 Md€ (LCP, Selectra) ou 10 (Investir Mag) ; Gabriel Zucman 15 à 25 ; Institut de l'entreprise 5,5 (cote C, patronal, cité au banc pour LFI).
- **Modèle utilisé.** Module des grandes fortunes, érosion et exil : `modeles/systeme-ideal/grandes_fortunes_0511.js` (zucmanSurDroitActuel) et `moteur.levier_zucman` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R01a](./detail-lfi.md#r01a), [LFI R04](./detail-lfi.md#r04) (même module des grandes fortunes, même érosion et même exil ; barème propre à la mesure) ; [LFI R05](./detail-lfi.md#r05) (module des transmissions, planification et départs) — Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (même module des grandes fortunes, même érosion et même exil ; barème propre à la mesure) — Glucksmann, Place publique (livret climat, chiffrage partiel) : [Glucksmann GL02](./detail-glucksmann.md#gl02) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce) — notre système : [M-TH](./detail-langagement.md#m-th), [M-PAT](./detail-langagement.md#m-pat), [M-TRANS](./detail-langagement.md#m-trans) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : B, C, D. 2 points marqués ⚠️ (non vérifié). Obstacle nommé : Conseil constitutionnel : risque de caractère confiscatoire si l'impôt total dépasse les revenus du patrimoine (jurisprudence sur l'ISF, non relue ici ⚠️) ; mobilité des contribuables.
- **Choix posés par l'IA.** le poids 0,9 sur le facteur commun « comportement ».

#### PS02 · CSG sur les gros héritages, calculée sur le total reçu au cours de la vie par chaque héritier (10 % des héritiers les plus aisés) {#ps02}

- **La mesure, dans les mots du programme.** « CSG sur les gros héritages […] : 10 milliards » (Selectra, LCP). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Successions. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ par an (recette ou économie).
- **Notre estimation.** **5,0 [2,6 ; 9,0]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (10 Md€) ; la médiane (5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 2. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Barème et seuil non publiés ; la presse indique que seuls les 10 % des héritiers les plus aisés seraient concernés. Base : droits de mutation à titre gratuit actuels de 20,8 Md€ (2024) ; 10 Md€ de plus = +48 %. Médiane 5 Md€ : notre module de transmissions (transmissions_0611.js) perd environ la moitié de la recette statique du scénario favorable au central sous l'effet de la planification (assurance-vie, démembrement, donations anticipées) et de l'exil des patrimoines mobiles (plat35 : 32,1 au favorable, 15,7 au central, cache systeme.json) : même proportion appliquée ici (⚠️ transposition, le module ne simule pas une CSG sur le cumul reçu).
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 50 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R01a](./detail-lfi.md#r01a), [LFI R04](./detail-lfi.md#r04) (module des grandes fortunes, érosion et exil) ; [LFI R05](./detail-lfi.md#r05) (module des transmissions, planification et départs) — Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (module des grandes fortunes, érosion et exil) — Glucksmann, Place publique (livret climat, chiffrage partiel) : [Glucksmann GL02](./detail-glucksmann.md#gl02) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce) — notre système : [M-TH](./detail-langagement.md#m-th), [M-PAT](./detail-langagement.md#m-pat), [M-TRANS](./detail-langagement.md#m-trans) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : A, D. 3 points marqués ⚠️ (non vérifié). Obstacle nommé : Planification et contournement ; une CSG sur un capital reçu est une nouveauté juridique (qualification d'imposition de toute nature, égalité devant les charges publiques) ⚠️.
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,6 sur le facteur commun « comportement ».

### Impôts des entreprises

#### PS03 · Taxe sur les géants du numérique (relèvement de la taxe sur les services numériques) {#ps03}

- **La mesure, dans les mots du programme.** « taxe sur les géants du numérique : 10 milliards » (Selectra, LCP). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Numérique. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ par an (recette ou économie).
- **Notre estimation.** **2,0 [0,8 ; 8,4]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (10 Md€) ; la médiane (2 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0,5. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Taux et assiette non publiés. La taxe sur les services numériques (3 % de certains chiffres d'affaires) rapporte de l'ordre de 0,7 à 0,8 Md€ par an (⚠️ ordre de grandeur non relu en primaire) : 10 Md€ supposeraient de multiplier son produit par plus de dix (taux de l'ordre de 30 % ou assiette très élargie). Médiane 2 Md€ (taux relevé à 10-15 %, report partiel sur les clients français) ; LFI annonce 3,9 Md€ pour une mesure voisine (R08 du banc).
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R03](./detail-lfi.md#r03), [LFI R06](./detail-lfi.md#r06) (recette de LFI ramenée entre 33 % et 100 %) ; [LFI R07](./detail-lfi.md#r07), [LFI R08](./detail-lfi.md#r08), [LFI R09](./detail-lfi.md#r09), [LFI R10](./detail-lfi.md#r10) (recette de LFI ramenée entre 36 % et 100 %) ; [LFI R11](./detail-lfi.md#r11) (recette de LFI ramenée entre 34 % et 100 %) — Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN F03](./detail-rn.md#f03) (annonce plafonnée, médiane jugée réalisable à 13 % de l'annonce) ; [RN F04](./detail-rn.md#f04) (annonce plafonnée, médiane jugée réalisable à 74 % de l'annonce) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-CRED](./detail-langagement.md#m-cred) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 3 points marqués ⚠️ (non vérifié). Obstacle nommé : Représailles commerciales des États-Unis (enquête de la section 301 en 2019-2020 sur la taxe française) ; report sur les annonceurs et vendeurs français ; droit de l'UE (liberté d'établissement) ⚠️.
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,5 sur le facteur commun « comportement ».

### Niches fiscales et sociales

#### PS04 · Révision des exonérations de cotisations sociales (« niches » sociales) {#ps04}

- **La mesure, dans les mots du programme.** « niches sur les cotisations retravaillées : 4 milliards supplémentaires » (LCP). Source : [article cité](https://lcp.fr/actualites/budget-a-l-assemblee-les-socialistes-presentent-leurs-propositions-et-previennent-qu-ils), Cotisations. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 4 Md€ par an (recette ou économie).
- **Notre estimation.** **3,0 [1,8 ; 3,8]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (4 Md€) ; la médiane (3 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 1,5. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Lecture : recentrage des allègements généraux au-dessus de 1,6 ou 2 Smic. Interaction avec le Smic (PS09) : non modélisée (les deux lignes touchent les allègements).
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 75 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R02](./detail-lfi.md#r02) (recette de LFI ramenée entre 35 % et 100 %) — Rassemblement national : [RN T04](./detail-rn.md#t04) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-FRP](./detail-langagement.md#m-frp), [M-CONV](./detail-langagement.md#m-conv) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Niches fiscales et sociales »](./memes-modeles.md#f-niches).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Effet sur l'emploi des salaires intermédiaires (non modélisé) ; interaction avec PS09.
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,3 sur le facteur commun « coût ».

#### PS05 · Réforme des niches fiscales {#ps05}

- **La mesure, dans les mots du programme.** « niches fiscales : 4 milliards » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Dépenses fiscales. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 4 Md€ par an (recette ou économie).
- **Notre estimation.** **2,5 [1,3 ; 3,7]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (4 Md€) ; la médiane (2,5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 1. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Niches non nommées dans la presse lue. Médiane 2,5 : les suppressions de niches votées en loi de finances rapportent souvent moins que prévu (comportements, reports).
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 62 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R02](./detail-lfi.md#r02) (recette de LFI ramenée entre 35 % et 100 %) — Rassemblement national : [RN T04](./detail-rn.md#t04) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-FRP](./detail-langagement.md#m-frp), [M-CONV](./detail-langagement.md#m-conv) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Niches fiscales et sociales »](./memes-modeles.md#f-niches).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Niches non désignées ; risque de rendement inférieur.
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,4 sur le facteur commun « coût ».

### Smic, salaires et cotisations

#### PS09 · Smic à 1 700 € net (effets publics seulement ; le coût pour les entreprises est privé) {#ps09}

- **La mesure, dans les mots du programme.** « porter le Smic à 1 700 € nets par mois » (Selectra, Investir Mag ; aucun coût publié). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Salaires. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par le parti pour cette ligne.
- **Notre estimation.** **−3,4 [−8,4 ; 1,6]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Salaires du privé en loi lognormale ; hausse du Smic : plancher 5,8 %, médiane 8,1 %, plafond 17,8 % ; cotisations, CSG, impôt, prime d'activité et allègements lus dans OpenFisca-France par foyer type. Emploi perdu selon une élasticité au coût du travail : de 0,05 à 0,5, valeur la plus probable 0,25 ; indexation des allègements (1 = droit actuel, 0 = gel) : de 0 à 1, valeur la plus probable 1. Seuls les effets sur les finances publiques sont comptés, pas le coût pour les entreprises. Calendrier : part du régime atteinte de 2028 à 2032 : 80 %, 100 %, 100 %, 100 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Branché sur le même levier que la ligne S01 de LFI (leviers2.py : salaires lognormaux, allègements, grille OpenFisca-France), avec les mêmes paramètres sauf la hausse. Lecture : le Smic net atteint 1 700 € grâce à la CSG progressive (PS10 : environ +130 € net au Smic) et à une hausse du Smic brut : (1 700 − 1 443 − 130) / (1 443 + 130) = +8,1 % (médiane) ; bas +5,8 % (Smic de 1 477 € net en 2027 selon Investir Mag) ; haut +17,8 % (si les 1 700 € s'entendent hors effet de la CSG, comme pour LFI). Le PS ne publie ni calendrier ni coût ; « conférence sociale sur les salaires » : lu comme une hausse par décret. Interaction avec PS10 (le gain de CSG n'est pas recompté ici) : approximation.
- **Modèle utilisé.** Levier Smic : salaires, OpenFisca-France, emploi : `leviers2.levier_smic` et `smic_openfisca.py`.
- **La même famille ailleurs.** La France insoumise : [LFI S01](./detail-lfi.md#s01) (même module ; paramètres propres à la mesure : hausse du Smic) — Rassemblement national : [RN D02](./detail-rn.md#d02) (ordre de grandeur sans source primaire, dit « grossier ») — Les Républicains (plan Retailleau) : [LRT2](./detail-lr.md#lrt2) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Smic, salaires et cotisations »](./memes-modeles.md#f-salaires).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : C, D. Obstacle nommé : Coût du travail au Smic (emploi) ; indexation des allègements.
- **Choix posés par l'IA.** H-SMIC-PS : Hausse du Smic brut : médiane +8,1 %, de +5,8 % à +17,8 % ; autres paramètres : ceux de S01 (LFI), hypothèses H-SMIC-1 à H-SMIC-6.

### Santé et dépendance

#### PS06 · Économies sur les marges dans les dépenses de santé {#ps06}

- **La mesure, dans les mots du programme.** « marges des dépenses de santé : 4 milliards » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Santé. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 4 Md€ par an (recette ou économie).
- **Notre estimation.** **1,5 [0,7 ; 3,5]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (4 Md€) ; la médiane (1,5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0,5. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Lecture : baisse des marges des fournisseurs (médicaments, dispositifs médicaux, laboratoires). Même médiane relative que la ligne H01 du RN (coûts hospitaliers : 2,0 sur 8,3).
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 38 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D07](./detail-lfi.md#d07), [LFI D08](./detail-lfi.md#d08) (fourchette propre à la ligne) ; [LFI D18](./detail-lfi.md#d18), [LFI D24](./detail-lfi.md#d24) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (annonce plafonnée, médiane jugée réalisable à 24 % de l'annonce) ; [RN H03](./detail-rn.md#h03) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) ; [RN H06](./detail-rn.md#h06) (annonce plafonnée, médiane jugée réalisable à 56 % de l'annonce) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) — notre système : [M-GA](./detail-langagement.md#m-ga), [M-SECU](./detail-langagement.md#m-secu) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Négociations conventionnelles ; pénuries possibles sur les produits à faible marge.
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,5 sur le facteur commun « coût ».

#### PS12 · Accès aux soins (hôpital, Ehpad, mutuelle publique gratuite des 18-25 ans : 1 Md€) {#ps12}

- **La mesure, dans les mots du programme.** « accès aux soins : 5 milliards » (Selectra) ; LCP : 3 Md€ pour l'hôpital et les Ehpad. Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Santé. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 5 Md€ par an (coût).
- **Notre estimation.** **−5,1 [−5,5 ; −4,9]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (5 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D07](./detail-lfi.md#d07), [LFI D08](./detail-lfi.md#d08) (fourchette propre à la ligne) ; [LFI D18](./detail-lfi.md#d18), [LFI D24](./detail-lfi.md#d24) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (annonce plafonnée, médiane jugée réalisable à 24 % de l'annonce) ; [RN H03](./detail-rn.md#h03) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) ; [RN H06](./detail-rn.md#h06) (annonce plafonnée, médiane jugée réalisable à 56 % de l'annonce) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) — notre système : [M-GA](./detail-langagement.md#m-ga), [M-SECU](./detail-langagement.md#m-secu) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

### Fonctionnement de l'État et opérateurs

#### PS07 · Économies de fonctionnement de l'État {#ps07}

- **La mesure, dans les mots du programme.** « fonctionnement de l'État : 3,6 milliards » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), État. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 3,6 Md€ par an (recette ou économie).
- **Notre estimation.** **2,5 [1,3 ; 3,4]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (3,6 Md€) ; la médiane (2,5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 1. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Effort de fonctionnement d'un an ; lu comme permanent.
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 69 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN A01](./detail-rn.md#a01) (annonce plafonnée, médiane jugée réalisable à 15 % de l'annonce) ; [RN A02](./detail-rn.md#a02) (annonce plafonnée, médiane jugée réalisable à 65 % de l'annonce) ; [RN A03](./detail-rn.md#a03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [RN H05](./detail-rn.md#h05) (annonce plafonnée, médiane jugée réalisable à 44 % de l'annonce) — Les Républicains (plan Retailleau) : [LR03](./detail-lr.md#lr03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [LR04](./detail-lr.md#lr04) (annonce plafonnée, médiane jugée réalisable à 22 % de l'annonce) ; [LR07](./detail-lr.md#lr07) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) ; [LR08](./detail-lr.md#lr08) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) ; [LR09](./detail-lr.md#lr09) (annonce plafonnée, médiane jugée réalisable à 39 % de l'annonce) ; [LR10](./detail-lr.md#lr10) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce) — notre système : [M-URSSAF](./detail-langagement.md#m-urssaf), [M-FORM](./detail-langagement.md#m-form), [M-GM](./detail-langagement.md#m-gm), [M-ECO](./detail-langagement.md#m-eco) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Fonctionnement de l'État et opérateurs »](./memes-modeles.md#f-etat).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Aucune contrainte juridique ; exécution.
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,4 sur le facteur commun « coût ».

### Services publics et dépenses nouvelles

#### PS13 · Loi intégrale contre les violences sexistes et sexuelles {#ps13}

- **La mesure, dans les mots du programme.** « loi intégrale […] : 3 milliards » (Selectra, Investir Mag, Moneyvox). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Justice. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 3 Md€ par an (coût).
- **Notre estimation.** **−3,1 [−3,3 ; −2,9]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (3 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D10](./detail-lfi.md#d10), [LFI D12](./detail-lfi.md#d12), [LFI D13](./detail-lfi.md#d13) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D11](./detail-lfi.md#d11), [LFI D17b](./detail-lfi.md#d17b), [LFI D22](./detail-lfi.md#d22) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D17a](./detail-lfi.md#d17a), [LFI D25](./detail-lfi.md#d25) (coût unitaire × quantité) — Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

#### PS14 · Soutien aux agriculteurs {#ps14}

- **La mesure, dans les mots du programme.** « agriculteurs : 2 milliards » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Agriculture. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 2 Md€ par an (coût).
- **Notre estimation.** **−2,1 [−2,2 ; −2,0]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (2 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D10](./detail-lfi.md#d10), [LFI D12](./detail-lfi.md#d12), [LFI D13](./detail-lfi.md#d13) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D11](./detail-lfi.md#d11), [LFI D17b](./detail-lfi.md#d17b), [LFI D22](./detail-lfi.md#d22) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D17a](./detail-lfi.md#d17a), [LFI D25](./detail-lfi.md#d25) (coût unitaire × quantité) — Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

#### PS15 · École {#ps15}

- **La mesure, dans les mots du programme.** « école : 2 milliards » (Selectra, Investir Mag). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), École. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 2 Md€ par an (coût).
- **Notre estimation.** **−2,1 [−2,2 ; −2,0]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (2 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D10](./detail-lfi.md#d10), [LFI D12](./detail-lfi.md#d12), [LFI D13](./detail-lfi.md#d13) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D11](./detail-lfi.md#d11), [LFI D17b](./detail-lfi.md#d17b), [LFI D22](./detail-lfi.md#d22) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D17a](./detail-lfi.md#d17a), [LFI D25](./detail-lfi.md#d25) (coût unitaire × quantité) — Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

### Logement et transition écologique

#### PS11 · Climat et adaptation (dont fonds de sécurité climatique de 5 Md€ et Fonds vert des collectivités) {#ps11}

- **La mesure, dans les mots du programme.** « 10 milliards pour le climat, dont 5 milliards pour un fonds de sécurité climatique » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Climat. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ par an (coût).
- **Notre estimation.** **−10,3 [−11,0 ; −9,8]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (10 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028.
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D03](./detail-lfi.md#d03) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D14](./detail-lfi.md#d14) (fourchette propre à la ligne) ; [LFI D16](./detail-lfi.md#d16) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN G05](./detail-rn.md#g05) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) — Glucksmann, Place publique (livret climat, chiffrage partiel) : [Glucksmann GL01](./detail-glucksmann.md#gl01) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Logement et transition écologique »](./memes-modeles.md#f-logement).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

### Fraude

#### PS08a · Lutte contre la fraude fiscale {#ps08a}

- **La mesure, dans les mots du programme.** « fraude fiscale : 2,4 milliards » (Selectra) ; « 5,5 milliards » fraude comprise (Investir Mag). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Fraude. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 2,4 Md€ par an (recette ou économie).
- **Notre estimation.** **1,0 [0,4 ; 2,1]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (2,4 Md€) ; la médiane (1 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0,3. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Même médiane relative que la ligne H02 du RN (fraude) : les recettes de la lutte contre la fraude sont incertaines et lentes.
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 42 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R12](./detail-lfi.md#r12) (recette de LFI ramenée entre 35 % et 100 %) — Rassemblement national : [RN F05](./detail-rn.md#f05) (annonce plafonnée, médiane jugée réalisable à 11 % de l'annonce) ; [RN F06](./detail-rn.md#f06) (annonce plafonnée, médiane jugée réalisable à 8 % de l'annonce) ; [RN H02](./detail-rn.md#h02) (annonce plafonnée, médiane jugée réalisable à 16 % de l'annonce) — Les Républicains (plan Retailleau) : [LR17](./detail-lr.md#lr17) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Fraude »](./memes-modeles.md#f-fraude).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 2 points marqués ⚠️ (non vérifié). Obstacle nommé : Recouvrement effectif bien inférieur aux montants notifiés (Cour des comptes, non relue ici ⚠️).
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,5 sur le facteur commun « coût ».

#### PS08b · Lutte contre le travail dissimulé {#ps08b}

- **La mesure, dans les mots du programme.** « travail dissimulé : 1,1 milliard » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Fraude. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 1,1 Md€ par an (recette ou économie).
- **Notre estimation.** **0,4 [0,2 ; 1,0]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (1,1 Md€) ; la médiane (0,4 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0,1. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Idem PS08a.
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 36 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R12](./detail-lfi.md#r12) (recette de LFI ramenée entre 35 % et 100 %) — Rassemblement national : [RN F05](./detail-rn.md#f05) (annonce plafonnée, médiane jugée réalisable à 11 % de l'annonce) ; [RN F06](./detail-rn.md#f06) (annonce plafonnée, médiane jugée réalisable à 8 % de l'annonce) ; [RN H02](./detail-rn.md#h02) (annonce plafonnée, médiane jugée réalisable à 16 % de l'annonce) — Les Républicains (plan Retailleau) : [LR17](./detail-lr.md#lr17) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Fraude »](./memes-modeles.md#f-fraude).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Idem PS08a.
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,5 sur le facteur commun « coût ».

### Autres recettes et écritures sans effet sur le déficit

#### PS08c · Économies annoncées non détaillées (17,5 Md€ annoncés, 15,1 détaillés) {#ps08c}

- **La mesure, dans les mots du programme.** « environ 17,5 milliards d'économies et de lutte contre la fraude » (Selectra). Source : [article cité](https://selectra.info/finance/actualites/marche/csg-progressive-2027-salaire-net-smic), Non détaillé. Article de presse qui rapporte le document du parti, que nous n'avons pas trouvé (montants : cote D, auteur = le programme).
- **Annoncé par le parti.** 2,4 Md€ par an (recette ou économie).
- **Notre estimation.** **0,5 [0,1 ; 2,0]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (2,4 Md€) ; la médiane (0,5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Écart entre le total annoncé et la somme des lignes rapportées ; Investir Mag donne 12,1 Md€ (niches et fraude) : la presse ne concorde pas.
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 21 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN F07](./detail-rn.md#f07) (annonce plafonnée, médiane jugée réalisable à 47 % de l'annonce) ; [RN G03](./detail-rn.md#g03) (valeur fixe (0)) ; [RN R30](./detail-rn.md#r30) (annonce plafonnée, médiane jugée réalisable à 83 % de l'annonce) — Les Républicains (plan Retailleau) : [LR11](./detail-lr.md#lr11) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) — notre système : [M-FANT](./detail-langagement.md#m-fant) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Autres recettes et écritures sans effet sur le déficit »](./memes-modeles.md#f-autres).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié). Obstacle nommé : Non détaillé.
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,4 sur le facteur commun « coût ».

---

Page générée par `modeles/banc-programmes/detail.py` à partir de `programmes/ps/mesures.py` et de `donnees/resultats.json` ; aucun chiffre n'y est tapé à la main. Écrite par Claude (IA d'Anthropic) pour l'auteur ; même banc pour tous, conflit d'intérêts déclaré.
