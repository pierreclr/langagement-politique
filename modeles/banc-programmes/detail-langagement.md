---
titre: "Chiffrage poste par poste : notre système"
statut: généré par detail.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Chiffrage poste par poste : notre système

Cette page détaille, ligne par ligne, comment le banc d'essai chiffre ce programme : ce que dit la mesure, ce que le parti annonce, ce que nous estimons, comment nous l'estimons, avec quel modèle, et si le même modèle sert aux autres programmes quand les mesures se ressemblent. Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions. Le même banc chiffre notre propre programme : l'auteur est partie prenante de la comparaison, et les écarts de méthode entre programmes sont listés dans [les mêmes modèles pour tous](./memes-modeles.md).

Programme lu : notre propre modèle du système ([page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/)), tel qu'il est exporté pour le banc. Ce n'est pas une annonce indépendante : c'est le chiffrage que nous défendons, et nous le passons dans le même banc que les autres.

Unités : milliards d'euros (Md€) par an, euros de 2025 ; un nombre positif améliore le solde public, un nombre négatif l'aggrave. Chaque estimation est une médiane de 10 000 tirages, suivie entre crochets de l'intervalle qui en contient 80 % (centiles 10 et 90). Régime : 2038. Résultats complets : `modeles/banc-programmes/resultats.md`. Pages voisines : [La France insoumise](./detail-lfi.md), [Rassemblement national](./detail-rn.md), [Les Républicains (plan Retailleau)](./detail-lr.md), [PS et Place publique (contre-budget 2027)](./detail-ps.md), [Glucksmann, Place publique (livret climat, chiffrage partiel)](./detail-glucksmann.md).

## Le total

| | notre système |
|---|---|
| Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en 2038 (Md€) | **97 [60 ; 135]** |
| Même effet, valeur centrale du modèle (sans tirage) | 95,8 |
| Somme des valeurs centrales des 31 modules | 33,0 |
| Hors modules (leviers votés, socle hérité, corrections), fixé au central | 62,8 |
| dont leviers votés, réglés pour stabiliser la dette | 33,3 |
| Dette publique en 2038 (% du PIB ; taux d'intérêt fixe de 3,45 %) | 139 [130 ; 148] |
| Dette publique en 2058 (% du PIB) | 149 [109 ; 187] |

Lecture. La médiane du total n'est pas la somme des médianes des postes : les postes sont tirés ensemble, avec des lois souvent asymétriques. Le total est celui du tableau comparatif des résultats (§ 1 et § 11.1 de `modeles/banc-programmes/resultats.md`) ; un test vérifie qu'il est recopié sans écart.

## Ce que nous n'avons pas pu chiffrer

- Impôt de suite « court terme » sur la fonction du patrimoine (2,28 Md€) : fixé à sa valeur centrale (une seule valeur dans le modèle (R.S.patrimoineNat)).
- Point d'indice : prix − 0,5 point pendant 4 ans (M2m) : fixé à sa valeur centrale (scénarios identiques dans le modèle).
- socle hérité des premières versions du modèle et corrections du grand livre : fixés à leur valeur centrale, non propagés (§ 6 ter des résultats).
- capital de départ et quelques lignes nouvelles : hors de la trajectoire (chapitre 12).

## La meilleure objection à notre chiffrage

Ce que un contradicteur peut opposer à ce chiffrage, dit aussi loyalement que possible :

- **Le banc est notre outil, et il chiffre notre propre programme.** C'est l'objection la plus forte. L'auteur est partie prenante ; le code et les hypothèses sont ouverts pour que chacun refasse le calcul.
- **Nos leviers votés sont réglés pour stabiliser la dette.** 33,3 Md€ par an sont calés dans notre modèle pour que la dette cesse de monter après 2038, à taux fixe ; aucun autre programme n'a de levier réglé ainsi. Même avec ce réglage, la dette ne reste stable après 2038 que dans 31 % des tirages.
- **Plus de la moitié de notre effet n'est pas détaillée module par module.** Au central, les 31 modules font 33,0 Md€ sur 95,8 ; le reste (62,8 Md€, dont les leviers votés) réunit le socle hérité des premières versions du modèle, les corrections du grand livre, l'impôt de suite et le point d'indice, fixés à leur valeur centrale. Notre intervalle est donc trop étroit : les scénarios d'ensemble du modèle vont de −180 à 209 Md€ en 2038.
- **Nos économies ne passent pas par le filtre** de faisabilité appliqué aux économies du Rassemblement national, des Républicains et du PS.
- **Le taux fixe nous flatte.** Avec un taux qui suit la dette, notre système entre en zone de crise avant 2058 dans 67 % des tirages, et il lui manque environ 40 Md€ par an pour stabiliser la dette.
- **Ce qui n'est pas dans la trajectoire.** Le capital de départ et quelques lignes nouvelles n'y sont pas encore (chapitre 12) : un concurrent peut nous faire le reproche que nous faisons aux autres.

## Les postes en un tableau

| N° | Poste | Valeur centrale du modèle (Md€) | Notre estimation (Md€) | Modèle ou traitement |
|---|---|---|---|---|
| [M-REV](#m-rev) | Fonction des revenus (a = 0,6733) : comportement des actifs, des retraités à capital, de l'IS et de la retenue (bareme_v71.js bilan(q, sc)) au scénario | 1,4 | 1,4 [0,8 ; 2,0] | notre modèle, rejoué à ses bornes |
| [M-CAP](#m-cap) | Capitaux mobiliers : prélèvements des résidents fondus dans la fonction des revenus (DC01) | −2,9 | −2,9 [−3,9 ; −1,9] | notre modèle, rejoué à ses bornes |
| [M-EPAR](#m-epar) | Épargne réglementée exonérée (BT02) | −8,8 | −8,8 [−12,4 ; −5,3] | notre modèle, rejoué à ses bornes |
| [M-TH](#m-th) | Taxe d'habitation des résidences secondaires fondue dans la v7.5 (BT03) | −2,8 | −2,8 [−3,2 ; −2,8] | notre modèle, rejoué à ses bornes |
| [M-PAT](#m-pat) | Fonction du patrimoine à 1,25 % (taux marginal maximal, K = 700 k€, plafonnement à 75 % du revenu) : comportements (érosion, exil, rendement) et plafonnement (−5 % / −15 % / −30 % de la fonction) au scénario favorable / défavorable | 20,9 | 20,9 [20,1 ; 21,6] | notre modèle, rejoué à ses bornes |
| [M-TRANS](#m-trans) | Transmissions : abattement de 300 000 €, taux, exil et déclaration au scénario (transmissions_0611.js trois()) | 8,8 | 8,8 [−5,9 ; 26,0] | notre modèle, rejoué à ses bornes |
| [M-CRED](#m-cred) | Crédit d'IS à 50 % : rendement au scénario (transmissions_0611.js credit(c, q, sc)) | 9,3 | 9,2 [3,8 ; 12,0] | notre modèle, rejoué à ses bornes |
| [M-FRP](#m-frp) | Frais professionnels au réel (DC03) | 0,0 | −0,0 [−1,0 ; 0,5] | notre modèle, rejoué à ses bornes |
| [M-CONV](#m-conv) | Conversions en salaire à coût employeur inchangé : part patronale de la mutuelle (BT08 + CS01), transport (CS02), titres-restaurant et assimilés (BT09) | 7,6 | 7,7 [1,7 ; 12,8] | notre modèle, rejoué à ses bornes |
| [M-PENS](#m-pens) | Courbe des pensions relevée à 9 Md€ : fuite sur les pensions 3 / 8 / 15 % (expatriation, cumul emploi-retraite ; retraites2.js) | 9,0 | 9,0 [8,3 ; 9,5] | notre modèle, rejoué à ses bornes |
| [M-V6](#m-v6) | Dispositif retraites (loi de 2023 gardée ; pénibilité, sous-indexation des hautes pensions) : effet net par année au scénario | 2,2 | 2,3 [−4,2 ; 15,1] | notre modèle, rejoué à ses bornes |
| [M-GT](#m-gt) | Garantie de transition, arrêts maladie, pont vers la retraite (DG01-DG04) | −4,3 | −4,3 [−6,1 ; −3,5] | notre modèle, rejoué à ses bornes |
| [M-PL](#m-pl) | Plancher en deux parts (627 + 250 €) et coefficient de lieu (PL01, PL02) | 1,7 | 1,7 [0,4 ; 2,6] | notre modèle, rejoué à ses bornes |
| [M-DET](#m-det) | Socle suspendu en détention : économie | 0,5 | 0,5 [0,2 ; 0,9] | notre modèle, rejoué à ses bornes |
| [M-RESID](#m-resid) | Résidu de la mesure de la v5.10 (bonus d'activité de 100 €, reprise du socle entre 4 700 et 9 400 €) | 0,3 | 0,3 [−6,8 ; 8,5] | notre modèle, rejoué à ses bornes |
| [M-GA](#m-ga) | Grand âge : hébergement et aide à domicile (GA01, GA02) | −4,1 | −4,1 [−7,3 ; −1,9] | notre modèle, rejoué à ses bornes |
| [M-SECU](#m-secu) | Sécurité sociale à 100 % sur le socle : dépense publique, TSA perdue, gestion, C2S (BT04-BT07) | −25,5 | −25,5 [−28,1 ; −20,2] | notre modèle, rejoué à ses bornes |
| [M-TVA](#m-tva) | TVA à 5 % / 10 % / 20 % (TV01-TV10) | 7,1 | 7,1 [6,6 ; 7,2] | notre modèle, rejoué à ses bornes |
| [M-RESTO](#m-resto) | TVA de la restauration à 5 % (BT10, BT11) | −4,1 | −4,1 [−4,5 ; −3,4] | notre modèle, rejoué à ses bornes |
| [M-FO](#m-fo) | Fiscalité d'orientation (9,59 Md€ au bas de sa fourchette) : réactions des assiettes | 9,6 | 9,6 [3,2 ; 12,3] | notre modèle, rejoué à ses bornes |
| [M-FIOUL](#m-fioul) | Taxe sur le fioul de chauffage : érosion du parc, au scénario | 0,2 | 0,2 [0,1 ; 0,3] | notre modèle, rejoué à ses bornes |
| [M-M1](#m-m1) | Non-remplacement d'un départ sur deux ou fonctionnaires (M1f) : part réalisée 90 / 70 / 45 % | 15,0 | 15,0 [9,7 ; 19,3] | notre modèle, rejoué à ses bornes |
| [M-M3](#m-m3) | Temps de travail dans la fonction publique : 27 000 ETP, réalisation 80 / 50 / 25 % (M3) | 0,4 | 0,4 [−0,1 ; 0,9] | notre modèle, rejoué à ses bornes |
| [M-URSSAF](#m-urssaf) | Gestion de l'Urssaf : économie de fonctionnement (consolidation_0611.js urssaf()) | 0,2 | 0,2 [−0,0 ; 0,2] | notre modèle, rejoué à ses bornes |
| [M-FORM](#m-form) | Formation professionnelle : un seul organisme (BT12) | −2,3 | −2,3 [−3,0 ; −2,0] | notre modèle, rejoué à ses bornes |
| [M-GM](#m-gm) | Grand ménage (non-remplacement, gestion, regroupements d'organismes) : économie nette additionnelle, transition comprise, année par année, scénarios bas / central / haut du modèle du grand ménage | 1,9 | 1,9 [−0,0 ; 9,5] | notre modèle, rejoué à ses bornes |
| [M-ECO](#m-eco) | Économies de fonctionnement de niveau 2 : 0,9 / 1,9 / 4,9 Md€ (le niveau 1 de 0,4465 est fixe) | 1,9 | 1,9 [0,9 ; 4,9] | notre modèle, rejoué à ses bornes |
| [M-OM](#m-om) | Outre-mer : sur-rémunérations, prix alimentaires (OM01, OM02) | 0,2 | 0,2 [−1,1 ; 0,4] | notre modèle, rejoué à ses bornes |
| [M-08](#m-08) | Chiffrage du 08/11 : collectivités, justice, protection de l'enfance, imprévus, retenue victimes, artificialisation (CL01, JU01, EN01, IM01, VI01, ZA01, ZA02) | −2,8 | −2,8 [−6,3 ; 0,9] | notre modèle, rejoué à ses bornes |
| [M-GRAT](#m-grat) | Gratuité des transports urbains : coût net (recettes perdues, offre, collecte) | −6,2 | −6,2 [−11,0 ; −4,4] | notre modèle, rejoué à ses bornes |
| [M-FANT](#m-fant) | Fantômes : GEMAPI et taxes spéciales d'équipement, chambres consulaires (BT13, BT14) | −1,3 | −1,3 [−1,9 ; 0,0] | notre modèle, rejoué à ses bornes |

## Le détail, poste par poste

### Impôt sur le revenu et CSG

#### M-REV · Fonction des revenus (a = 0,6733) : comportement des actifs, des retraités à capital, de l'IS et de la retenue (bareme_v71.js bilan(q, sc)) au scénario {#m-rev}

- **La mesure.** Fonction des revenus (a = 0,6733) : comportement des actifs, des retraités à capital, de l'IS et de la retenue (bareme_v71.js bilan(q, sc)) au scénario. Source : `bareme_v71.js, decisions_0611_v74.js ecart(sc), base_0611.js recetteRevenus`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 1,4 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **1,4 [0,8 ; 2,0]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 2,0 Md€ (favorable), 1,4 (central), 0,8 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,8). Calendrier : monte de 2029 à 2038 (rampe du modèle) ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R13](./detail-lfi.md#r13) (OpenFisca-France sur foyers types, avec élasticité du revenu imposable) — Rassemblement national : [RN T08](./detail-rn.md#t08) (OpenFisca-France, impôt d'un salarié seul) ; [RN D03](./detail-rn.md#d03) (montant du parti, 0,7 à 1,3 fois) — PS et Place publique (contre-budget 2027) : [PS10](./detail-ps.md#ps10) (fourchette propre à la ligne). Ce que le code confirme et ce qui diffère : [note de famille « Impôt sur le revenu et CSG »](./memes-modeles.md#f-ir).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B. 2 points marqués ⚠️ (non vérifié). Cote du module : B.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,8 sur le facteur commun « comportement ».

### Revenus du capital et épargne

#### M-CAP · Capitaux mobiliers : prélèvements des résidents fondus dans la fonction des revenus (DC01) {#m-cap}

- **La mesure.** Capitaux mobiliers : prélèvements des résidents fondus dans la fonction des revenus (DC01). Source : `decisions_0711.js HYP.rcm`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −2,9 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−2,9 [−3,9 ; −1,9]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, −1,9 Md€ (favorable), −2,9 (central), −3,9 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,5). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R01b](./detail-lfi.md#r01b) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN T06](./detail-rn.md#t06) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Revenus du capital et épargne »](./memes-modeles.md#f-capital).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-D (selon la ligne). 2 points marqués ⚠️ (non vérifié). Cote du module : B-D (selon la ligne).
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « comportement ».

#### M-EPAR · Épargne réglementée exonérée (BT02) {#m-epar}

- **La mesure.** Épargne réglementée exonérée (BT02). Source : `base_0611.js HB1-HB2`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −8,8 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−8,8 [−12,4 ; −5,3]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, −5,2 Md€ (favorable), −8,8 (central), −12,4 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,3). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R01b](./detail-lfi.md#r01b) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN T06](./detail-rn.md#t06) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Revenus du capital et épargne »](./memes-modeles.md#f-capital).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « comportement ».

### Patrimoine et héritages

#### M-TH · Taxe d'habitation des résidences secondaires fondue dans la v7.5 (BT03) {#m-th}

- **La mesure.** Taxe d'habitation des résidences secondaires fondue dans la v7.5 (BT03). Source : `base_0611.js HB3`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −2,8 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−2,8 [−3,2 ; −2,8]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, −2,8 Md€ (favorable), −2,8 (central), −3,2 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,3). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R01a](./detail-lfi.md#r01a), [LFI R04](./detail-lfi.md#r04) (module des grandes fortunes, érosion et exil) ; [LFI R05](./detail-lfi.md#r05) (module des transmissions, planification et départs) — Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (module des grandes fortunes, érosion et exil) — PS et Place publique (contre-budget 2027) : [PS01](./detail-ps.md#ps01) (module des grandes fortunes, érosion et exil) ; [PS02](./detail-ps.md#ps02) (annonce plafonnée, médiane jugée réalisable à 50 % de l'annonce) — Glucksmann, Place publique (livret climat, chiffrage partiel) : [Glucksmann GL02](./detail-glucksmann.md#gl02) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « coût ».

#### M-PAT · Fonction du patrimoine à 1,25 % (taux marginal maximal, K = 700 k€, plafonnement à 75 % du revenu) : comportements (érosion, exil, rendement) et plafonnement (−5 % / −15 % / −30 % de la fonction) au scénario favorable / défavorable {#m-pat}

- **La mesure.** Fonction du patrimoine à 1,25 % (taux marginal maximal, K = 700 k€, plafonnement à 75 % du revenu) : comportements (érosion, exil, rendement) et plafonnement (−5 % / −15 % / −30 % de la fonction) au scénario favorable / défavorable. Source : `patrimoine_balayage_1111c.js ligne(0,0125) ; decisions_0611_v74.js recettePatrimoine(sc) ; decisions_1111d.js`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 20,9 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **20,9 [20,1 ; 21,6]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 21,6 Md€ (favorable), 20,9 (central), 20,1 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,8). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R01a](./detail-lfi.md#r01a), [LFI R04](./detail-lfi.md#r04) (module des grandes fortunes, érosion et exil) ; [LFI R05](./detail-lfi.md#r05) (module des transmissions, planification et départs) — Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (module des grandes fortunes, érosion et exil) — PS et Place publique (contre-budget 2027) : [PS01](./detail-ps.md#ps01) (module des grandes fortunes, érosion et exil) ; [PS02](./detail-ps.md#ps02) (annonce plafonnée, médiane jugée réalisable à 50 % de l'annonce) — Glucksmann, Place publique (livret climat, chiffrage partiel) : [Glucksmann GL02](./detail-glucksmann.md#gl02) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B. 2 points marqués ⚠️ (non vérifié). Cote du module : B.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,8 sur le facteur commun « comportement ».

#### M-TRANS · Transmissions : abattement de 300 000 €, taux, exil et déclaration au scénario (transmissions_0611.js trois()) {#m-trans}

- **La mesure.** Transmissions : abattement de 300 000 €, taux, exil et déclaration au scénario (transmissions_0611.js trois()). Source : `transmissions_0611.js`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 8,8 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **8,8 [−5,9 ; 26,0]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 25,9 Md€ (favorable), 8,8 (central), −5,6 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,7). Calendrier : monte de 2029 à 2038 (rampe du modèle) ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R01a](./detail-lfi.md#r01a), [LFI R04](./detail-lfi.md#r04) (module des grandes fortunes, érosion et exil) ; [LFI R05](./detail-lfi.md#r05) (même fonction `trois()` du module des transmissions, mêmes comportements ; barème propre à la mesure) — Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (module des grandes fortunes, érosion et exil) — PS et Place publique (contre-budget 2027) : [PS01](./detail-ps.md#ps01) (module des grandes fortunes, érosion et exil) ; [PS02](./detail-ps.md#ps02) (annonce plafonnée, médiane jugée réalisable à 50 % de l'annonce) — Glucksmann, Place publique (livret climat, chiffrage partiel) : [Glucksmann GL02](./detail-glucksmann.md#gl02) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B. 2 points marqués ⚠️ (non vérifié). Cote du module : B.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,7 sur le facteur commun « comportement ».

### Impôts des entreprises

#### M-CRED · Crédit d'IS à 50 % : rendement au scénario (transmissions_0611.js credit(c, q, sc)) {#m-cred}

- **La mesure.** Crédit d'IS à 50 % : rendement au scénario (transmissions_0611.js credit(c, q, sc)). Source : `transmissions_0611.js credit()`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 9,3 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **9,2 [3,8 ; 12,0]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 12,0 Md€ (favorable), 9,3 (central), 3,8 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,8). Calendrier : monte de 2029 à 2038 (rampe du modèle) ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R03](./detail-lfi.md#r03), [LFI R06](./detail-lfi.md#r06) (recette de LFI ramenée entre 33 % et 100 %) ; [LFI R07](./detail-lfi.md#r07), [LFI R08](./detail-lfi.md#r08), [LFI R09](./detail-lfi.md#r09), [LFI R10](./detail-lfi.md#r10) (recette de LFI ramenée entre 36 % et 100 %) ; [LFI R11](./detail-lfi.md#r11) (recette de LFI ramenée entre 34 % et 100 %) — Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN F03](./detail-rn.md#f03) (annonce plafonnée, médiane jugée réalisable à 13 % de l'annonce) ; [RN F04](./detail-rn.md#f04) (annonce plafonnée, médiane jugée réalisable à 74 % de l'annonce) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS03](./detail-ps.md#ps03) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B. 2 points marqués ⚠️ (non vérifié). Cote du module : B.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,8 sur le facteur commun « comportement ».

### Niches fiscales et sociales

#### M-FRP · Frais professionnels au réel (DC03) {#m-frp}

- **La mesure.** Frais professionnels au réel (DC03). Source : `decisions_0711.js HYP.fraisReels`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 0,0 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−0,0 [−1,0 ; 0,5]** Md€ par an en 2038 : pratiquement nul en médiane.
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 0,5 Md€ (favorable), 0,0 (central), −1,0 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,3). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R02](./detail-lfi.md#r02) (recette de LFI ramenée entre 35 % et 100 %) — Rassemblement national : [RN T04](./detail-rn.md#t04) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS04](./detail-ps.md#ps04) (annonce plafonnée, médiane jugée réalisable à 75 % de l'annonce) ; [PS05](./detail-ps.md#ps05) (annonce plafonnée, médiane jugée réalisable à 62 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Niches fiscales et sociales »](./memes-modeles.md#f-niches).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-D (selon la ligne). 2 points marqués ⚠️ (non vérifié). Cote du module : B-D (selon la ligne).
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « coût ».

#### M-CONV · Conversions en salaire à coût employeur inchangé : part patronale de la mutuelle (BT08 + CS01), transport (CS02), titres-restaurant et assimilés (BT09) {#m-conv}

- **La mesure.** Conversions en salaire à coût employeur inchangé : part patronale de la mutuelle (BT08 + CS01), transport (CS02), titres-restaurant et assimilés (BT09). Source : `base_0611.js HB6, HB8 (PLFSS 2026 annexe 4) ; decisions_0811.js HE5`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 7,6 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **7,7 [1,7 ; 12,8]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 12,8 Md€ (favorable), 7,6 (central), 1,7 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,3). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI R02](./detail-lfi.md#r02) (recette de LFI ramenée entre 35 % et 100 %) — Rassemblement national : [RN T04](./detail-rn.md#t04) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS04](./detail-ps.md#ps04) (annonce plafonnée, médiane jugée réalisable à 75 % de l'annonce) ; [PS05](./detail-ps.md#ps05) (annonce plafonnée, médiane jugée réalisable à 62 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Niches fiscales et sociales »](./memes-modeles.md#f-niches).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « comportement ».

### Retraites

#### M-PENS · Courbe des pensions relevée à 9 Md€ : fuite sur les pensions 3 / 8 / 15 % (expatriation, cumul emploi-retraite ; retraites2.js) {#m-pens}

- **La mesure.** Courbe des pensions relevée à 9 Md€ : fuite sur les pensions 3 / 8 / 15 % (expatriation, cumul emploi-retraite ; retraites2.js). Source : `decisions_0811.js courbe() ; decisions_0711.js recettePension(o, k)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 9,0 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **9,0 [8,3 ; 9,5]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 9,5 Md€ (favorable), 9,0 (central), 8,3 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,5). Calendrier : monte de 2029 à 2038 (rampe du modèle) ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D05](./detail-lfi.md#d05) (modèle des retraites, âge de départ) ; [LFI P01](./detail-lfi.md#p01) (distribution des pensions des carrières complètes, DREES) — Rassemblement national : [RN D01](./detail-rn.md#d01) (modèle des retraites, âge de départ) ; [RN H04](./detail-rn.md#h04) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — Les Républicains (plan Retailleau) : [LR12](./detail-lr.md#lr12) (annonce plafonnée, médiane jugée réalisable à 42 % de l'annonce) ; [LR13](./detail-lr.md#lr13) (annonce plafonnée, médiane jugée réalisable à 3 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Retraites »](./memes-modeles.md#f-retraites).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B. 2 points marqués ⚠️ (non vérifié). Cote du module : B.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « comportement ».

#### M-V6 · Dispositif retraites (loi de 2023 gardée ; pénibilité, sous-indexation des hautes pensions) : effet net par année au scénario {#m-v6}

- **La mesure.** Dispositif retraites (loi de 2023 gardée ; pénibilité, sous-indexation des hautes pensions) : effet net par année au scénario. Source : `decisions_1111.js v6(sc, an) (loi de 2023 : pénibilité et indexation au-dessus de 2 000 €, sans âge libre ni indexation sur l'espérance de vie), modeles/retraites/`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 2,2 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **2,3 [−4,2 ; 15,1]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 15,0 Md€ (favorable), 2,2 (central), −4,3 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : suit la trajectoire année par année du modèle ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D05](./detail-lfi.md#d05) (modèle des retraites, âge de départ) ; [LFI P01](./detail-lfi.md#p01) (distribution des pensions des carrières complètes, DREES) — Rassemblement national : [RN D01](./detail-rn.md#d01) (modèle des retraites, âge de départ) ; [RN H04](./detail-rn.md#h04) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — Les Républicains (plan Retailleau) : [LR12](./detail-lr.md#lr12) (annonce plafonnée, médiane jugée réalisable à 42 % de l'annonce) ; [LR13](./detail-lr.md#lr13) (annonce plafonnée, médiane jugée réalisable à 3 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Retraites »](./memes-modeles.md#f-retraites).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

### Prestations et minima sociaux

#### M-GT · Garantie de transition, arrêts maladie, pont vers la retraite (DG01-DG04) {#m-gt}

- **La mesure.** Garantie de transition, arrêts maladie, pont vers la retraite (DG01-DG04). Source : `decisions_0711.js gtLignes (budget « coût constant en ligne droite »), garantie_transition.js`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −4,3 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−4,3 [−6,1 ; −3,5]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, −3,5 Md€ (favorable), −4,3 (central), −6,0 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D02](./detail-lfi.md#d02) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D04](./detail-lfi.md#d04) (fourchette propre à la ligne) ; [LFI D06](./detail-lfi.md#d06) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D19](./detail-lfi.md#d19), [LFI D20](./detail-lfi.md#d20) (coût unitaire × quantité) — Les Républicains (plan Retailleau) : [LR14](./detail-lr.md#lr14) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Prestations et minima sociaux »](./memes-modeles.md#f-prestations).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-D (selon la ligne). 2 points marqués ⚠️ (non vérifié). Cote du module : B-D (selon la ligne).
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

#### M-PL · Plancher en deux parts (627 + 250 €) et coefficient de lieu (PL01, PL02) {#m-pl}

- **La mesure.** Plancher en deux parts (627 + 250 €) et coefficient de lieu (PL01, PL02). Source : `decisions_0811.js HE6-HE7 (DREES)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 1,7 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **1,7 [0,4 ; 2,6]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 2,6 Md€ (favorable), 1,7 (central), 0,4 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,3). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D02](./detail-lfi.md#d02) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D04](./detail-lfi.md#d04) (fourchette propre à la ligne) ; [LFI D06](./detail-lfi.md#d06) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D19](./detail-lfi.md#d19), [LFI D20](./detail-lfi.md#d20) (coût unitaire × quantité) — Les Républicains (plan Retailleau) : [LR14](./detail-lr.md#lr14) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Prestations et minima sociaux »](./memes-modeles.md#f-prestations).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-D (selon la ligne). 2 points marqués ⚠️ (non vérifié). Cote du module : B-D (selon la ligne).
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « coût ».

#### M-DET · Socle suspendu en détention : économie {#m-det}

- **La mesure.** Socle suspendu en détention : économie. Source : `decisions_0511h.js detentionDetail(sc)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 0,5 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **0,5 [0,2 ; 0,9]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 0,9 Md€ (favorable), 0,5 (central), 0,2 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,3). Calendrier : suit la trajectoire année par année du modèle ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D02](./detail-lfi.md#d02) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D04](./detail-lfi.md#d04) (fourchette propre à la ligne) ; [LFI D06](./detail-lfi.md#d06) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D19](./detail-lfi.md#d19), [LFI D20](./detail-lfi.md#d20) (coût unitaire × quantité) — Les Républicains (plan Retailleau) : [LR14](./detail-lr.md#lr14) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Prestations et minima sociaux »](./memes-modeles.md#f-prestations).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « coût ».

#### M-RESID · Résidu de la mesure de la v5.10 (bonus d'activité de 100 €, reprise du socle entre 4 700 et 9 400 €) {#m-resid}

- **La mesure.** Résidu de la mesure de la v5.10 (bonus d'activité de 100 €, reprise du socle entre 4 700 et 9 400 €). Source : `decisions_0511j.js residu(t, sc)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 0,3 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **0,3 [−6,8 ; 8,5]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 8,6 Md€ (favorable), 0,3 (central), −7,0 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,3). Calendrier : suit la trajectoire année par année du modèle ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D02](./detail-lfi.md#d02) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D04](./detail-lfi.md#d04) (fourchette propre à la ligne) ; [LFI D06](./detail-lfi.md#d06) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D19](./detail-lfi.md#d19), [LFI D20](./detail-lfi.md#d20) (coût unitaire × quantité) — Les Républicains (plan Retailleau) : [LR14](./detail-lr.md#lr14) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Prestations et minima sociaux »](./memes-modeles.md#f-prestations).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « coût ».

### Santé et dépendance

#### M-GA · Grand âge : hébergement et aide à domicile (GA01, GA02) {#m-ga}

- **La mesure.** Grand âge : hébergement et aide à domicile (GA01, GA02). Source : `modeles/grand-age/ (central, abattement 100 000 €), decisions_0811.js HE1-HE2`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −4,1 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−4,1 [−7,3 ; −1,9]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, −1,9 Md€ (favorable), −4,1 (central), −7,4 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D07](./detail-lfi.md#d07), [LFI D08](./detail-lfi.md#d08) (fourchette propre à la ligne) ; [LFI D18](./detail-lfi.md#d18), [LFI D24](./detail-lfi.md#d24) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (annonce plafonnée, médiane jugée réalisable à 24 % de l'annonce) ; [RN H03](./detail-rn.md#h03) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) ; [RN H06](./detail-rn.md#h06) (annonce plafonnée, médiane jugée réalisable à 56 % de l'annonce) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS06](./detail-ps.md#ps06) (annonce plafonnée, médiane jugée réalisable à 38 % de l'annonce) ; [PS12](./detail-ps.md#ps12) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-D (selon la ligne). 2 points marqués ⚠️ (non vérifié). Cote du module : B-D (selon la ligne).
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

#### M-SECU · Sécurité sociale à 100 % sur le socle : dépense publique, TSA perdue, gestion, C2S (BT04-BT07) {#m-secu}

- **La mesure.** Sécurité sociale à 100 % sur le socle : dépense publique, TSA perdue, gestion, C2S (BT04-BT07). Source : `base_0611.js HB4-HB5 (HCAAM, CSBM)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −25,5 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−25,5 [−28,1 ; −20,2]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, −20,2 Md€ (favorable), −25,5 (central), −28,2 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D07](./detail-lfi.md#d07), [LFI D08](./detail-lfi.md#d08) (fourchette propre à la ligne) ; [LFI D18](./detail-lfi.md#d18), [LFI D24](./detail-lfi.md#d24) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (annonce plafonnée, médiane jugée réalisable à 24 % de l'annonce) ; [RN H03](./detail-rn.md#h03) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) ; [RN H06](./detail-rn.md#h06) (annonce plafonnée, médiane jugée réalisable à 56 % de l'annonce) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS06](./detail-ps.md#ps06) (annonce plafonnée, médiane jugée réalisable à 38 % de l'annonce) ; [PS12](./detail-ps.md#ps12) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

### TVA, énergie et prix

#### M-TVA · TVA à 5 % / 10 % / 20 % (TV01-TV10) {#m-tva}

- **La mesure.** TVA à 5 % / 10 % / 20 % (TV01-TV10). Source : `decisions_0711.js tva() (élasticités), decisions_0811.js tvaAutres() (± 50 % d'assiette)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 7,1 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **7,1 [6,6 ; 7,2]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 7,2 Md€ (favorable), 7,1 (central), 6,6 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,5). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI C01](./detail-lfi.md#c01) (levier carburants : volume, prix, marges) — Rassemblement national : [RN T01](./detail-rn.md#t01) (fourchette propre à la ligne) ; [RN T02](./detail-rn.md#t02) (montant du parti, 0,9 à 1,7 fois) ; [RN T05](./detail-rn.md#t05) (montant du parti, 0,95 à 1,15 fois) ; [RN G01](./detail-rn.md#g01) (annonce plafonnée, médiane jugée réalisable à 9 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « TVA, énergie et prix »](./memes-modeles.md#f-tva).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-D (selon la ligne). 2 points marqués ⚠️ (non vérifié). Cote du module : B-D (selon la ligne).
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « comportement ».

#### M-RESTO · TVA de la restauration à 5 % (BT10, BT11) {#m-resto}

- **La mesure.** TVA de la restauration à 5 % (BT10, BT11). Source : `base_0611.js HB9`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −4,1 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−4,1 [−4,5 ; −3,4]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, −3,4 Md€ (favorable), −4,1 (central), −4,5 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,5). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI C01](./detail-lfi.md#c01) (levier carburants : volume, prix, marges) — Rassemblement national : [RN T01](./detail-rn.md#t01) (fourchette propre à la ligne) ; [RN T02](./detail-rn.md#t02) (montant du parti, 0,9 à 1,7 fois) ; [RN T05](./detail-rn.md#t05) (montant du parti, 0,95 à 1,15 fois) ; [RN G01](./detail-rn.md#g01) (annonce plafonnée, médiane jugée réalisable à 9 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « TVA, énergie et prix »](./memes-modeles.md#f-tva).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « comportement ».

#### M-FO · Fiscalité d'orientation (9,59 Md€ au bas de sa fourchette) : réactions des assiettes {#m-fo}

- **La mesure.** Fiscalité d'orientation (9,59 Md€ au bas de sa fourchette) : réactions des assiettes. Source : `decisions_0511g.js fo(sc, an), modeles/fiscalite-orientation/`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 9,6 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **9,6 [3,2 ; 12,3]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 12,4 Md€ (favorable), 9,6 (central), 3,2 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,8). Calendrier : suit la trajectoire année par année du modèle ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI C01](./detail-lfi.md#c01) (levier carburants : volume, prix, marges) — Rassemblement national : [RN T01](./detail-rn.md#t01) (fourchette propre à la ligne) ; [RN T02](./detail-rn.md#t02) (montant du parti, 0,9 à 1,7 fois) ; [RN T05](./detail-rn.md#t05) (montant du parti, 0,95 à 1,15 fois) ; [RN G01](./detail-rn.md#g01) (annonce plafonnée, médiane jugée réalisable à 9 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « TVA, énergie et prix »](./memes-modeles.md#f-tva).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,8 sur le facteur commun « comportement ».

#### M-FIOUL · Taxe sur le fioul de chauffage : érosion du parc, au scénario {#m-fioul}

- **La mesure.** Taxe sur le fioul de chauffage : érosion du parc, au scénario. Source : `decisions_0511h.js fioul(sc, an)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 0,2 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **0,2 [0,1 ; 0,3]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 0,3 Md€ (favorable), 0,2 (central), 0,1 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « comportement » (poids 0,5). Calendrier : suit la trajectoire année par année du modèle ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI C01](./detail-lfi.md#c01) (levier carburants : volume, prix, marges) — Rassemblement national : [RN T01](./detail-rn.md#t01) (fourchette propre à la ligne) ; [RN T02](./detail-rn.md#t02) (montant du parti, 0,9 à 1,7 fois) ; [RN T05](./detail-rn.md#t05) (montant du parti, 0,95 à 1,15 fois) ; [RN G01](./detail-rn.md#g01) (annonce plafonnée, médiane jugée réalisable à 9 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « TVA, énergie et prix »](./memes-modeles.md#f-tva).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « comportement ».

### Emplois et rémunérations publics

#### M-M1 · Non-remplacement d'un départ sur deux ou fonctionnaires (M1f) : part réalisée 90 / 70 / 45 % {#m-m1}

- **La mesure.** Non-remplacement d'un départ sur deux ou fonctionnaires (M1f) : part réalisée 90 / 70 / 45 %. Source : `variante_dette_stable.js leviers(['M1f']) ; consolidation_0611.js recouvrement`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 15,0 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **15,0 [9,7 ; 19,3]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 19,3 Md€ (favorable), 15,0 (central), 9,7 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : suit la trajectoire année par année du modèle ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D01](./detail-lfi.md#d01) (fourchette propre à la ligne) ; [LFI D09](./detail-lfi.md#d09), [LFI D21](./detail-lfi.md#d21) (coût unitaire × quantité) — Les Républicains (plan Retailleau) : [LR01](./detail-lr.md#lr01) (annonce plafonnée, médiane jugée réalisable à 48 % de l'annonce) ; [LR02](./detail-lr.md#lr02) (annonce plafonnée, médiane jugée réalisable à 30 % de l'annonce) ; [LR06](./detail-lr.md#lr06) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Emplois et rémunérations publics »](./memes-modeles.md#f-effectifs).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : C. 2 points marqués ⚠️ (non vérifié). Cote du module : C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

#### M-M3 · Temps de travail dans la fonction publique : 27 000 ETP, réalisation 80 / 50 / 25 % (M3) {#m-m3}

- **La mesure.** Temps de travail dans la fonction publique : 27 000 ETP, réalisation 80 / 50 / 25 % (M3). Source : `variante_dette_stable.js leviers(['M3']) ; consolidation_0611.js recouvrement`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 0,4 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **0,4 [−0,1 ; 0,9]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 0,9 Md€ (favorable), 0,4 (central), −0,1 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : suit la trajectoire année par année du modèle ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D01](./detail-lfi.md#d01) (fourchette propre à la ligne) ; [LFI D09](./detail-lfi.md#d09), [LFI D21](./detail-lfi.md#d21) (coût unitaire × quantité) — Les Républicains (plan Retailleau) : [LR01](./detail-lr.md#lr01) (annonce plafonnée, médiane jugée réalisable à 48 % de l'annonce) ; [LR02](./detail-lr.md#lr02) (annonce plafonnée, médiane jugée réalisable à 30 % de l'annonce) ; [LR06](./detail-lr.md#lr06) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Emplois et rémunérations publics »](./memes-modeles.md#f-effectifs).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : C. 2 points marqués ⚠️ (non vérifié). Cote du module : C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

### Fonctionnement de l'État et opérateurs

#### M-URSSAF · Gestion de l'Urssaf : économie de fonctionnement (consolidation_0611.js urssaf()) {#m-urssaf}

- **La mesure.** Gestion de l'Urssaf : économie de fonctionnement (consolidation_0611.js urssaf()). Source : `consolidation_0611.js`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 0,2 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **0,2 [−0,0 ; 0,2]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 0,2 Md€ (favorable), 0,2 (central), 0,0 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,3). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** Rassemblement national : [RN A01](./detail-rn.md#a01) (annonce plafonnée, médiane jugée réalisable à 15 % de l'annonce) ; [RN A02](./detail-rn.md#a02) (annonce plafonnée, médiane jugée réalisable à 65 % de l'annonce) ; [RN A03](./detail-rn.md#a03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [RN H05](./detail-rn.md#h05) (annonce plafonnée, médiane jugée réalisable à 44 % de l'annonce) — Les Républicains (plan Retailleau) : [LR03](./detail-lr.md#lr03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [LR04](./detail-lr.md#lr04) (annonce plafonnée, médiane jugée réalisable à 22 % de l'annonce) ; [LR07](./detail-lr.md#lr07) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) ; [LR08](./detail-lr.md#lr08) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) ; [LR09](./detail-lr.md#lr09) (annonce plafonnée, médiane jugée réalisable à 39 % de l'annonce) ; [LR10](./detail-lr.md#lr10) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS07](./detail-ps.md#ps07) (annonce plafonnée, médiane jugée réalisable à 69 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Fonctionnement de l'État et opérateurs »](./memes-modeles.md#f-etat).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : C. 2 points marqués ⚠️ (non vérifié). Cote du module : C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « coût ».

#### M-FORM · Formation professionnelle : un seul organisme (BT12) {#m-form}

- **La mesure.** Formation professionnelle : un seul organisme (BT12). Source : `base_0611.js, arbitrage 48`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −2,3 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−2,3 [−3,0 ; −2,0]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, −2,0 Md€ (favorable), −2,3 (central), −3,0 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** Rassemblement national : [RN A01](./detail-rn.md#a01) (annonce plafonnée, médiane jugée réalisable à 15 % de l'annonce) ; [RN A02](./detail-rn.md#a02) (annonce plafonnée, médiane jugée réalisable à 65 % de l'annonce) ; [RN A03](./detail-rn.md#a03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [RN H05](./detail-rn.md#h05) (annonce plafonnée, médiane jugée réalisable à 44 % de l'annonce) — Les Républicains (plan Retailleau) : [LR03](./detail-lr.md#lr03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [LR04](./detail-lr.md#lr04) (annonce plafonnée, médiane jugée réalisable à 22 % de l'annonce) ; [LR07](./detail-lr.md#lr07) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) ; [LR08](./detail-lr.md#lr08) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) ; [LR09](./detail-lr.md#lr09) (annonce plafonnée, médiane jugée réalisable à 39 % de l'annonce) ; [LR10](./detail-lr.md#lr10) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS07](./detail-ps.md#ps07) (annonce plafonnée, médiane jugée réalisable à 69 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Fonctionnement de l'État et opérateurs »](./memes-modeles.md#f-etat).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

#### M-GM · Grand ménage (non-remplacement, gestion, regroupements d'organismes) : économie nette additionnelle, transition comprise, année par année, scénarios bas / central / haut du modèle du grand ménage {#m-gm}

- **La mesure.** Grand ménage (non-remplacement, gestion, regroupements d'organismes) : économie nette additionnelle, transition comprise, année par année, scénarios bas / central / haut du modèle du grand ménage. Source : `modeles/grand-menage/donnees/serie_2028_2038.json via decisions_1111c.js grandMenage(sc, an)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 1,9 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **1,9 [−0,0 ; 9,5]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 9,4 Md€ (favorable), 1,9 (central), 0,0 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : suit la trajectoire année par année du modèle ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** Rassemblement national : [RN A01](./detail-rn.md#a01) (annonce plafonnée, médiane jugée réalisable à 15 % de l'annonce) ; [RN A02](./detail-rn.md#a02) (annonce plafonnée, médiane jugée réalisable à 65 % de l'annonce) ; [RN A03](./detail-rn.md#a03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [RN H05](./detail-rn.md#h05) (annonce plafonnée, médiane jugée réalisable à 44 % de l'annonce) — Les Républicains (plan Retailleau) : [LR03](./detail-lr.md#lr03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [LR04](./detail-lr.md#lr04) (annonce plafonnée, médiane jugée réalisable à 22 % de l'annonce) ; [LR07](./detail-lr.md#lr07) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) ; [LR08](./detail-lr.md#lr08) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) ; [LR09](./detail-lr.md#lr09) (annonce plafonnée, médiane jugée réalisable à 39 % de l'annonce) ; [LR10](./detail-lr.md#lr10) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS07](./detail-ps.md#ps07) (annonce plafonnée, médiane jugée réalisable à 69 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Fonctionnement de l'État et opérateurs »](./memes-modeles.md#f-etat).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : C. 2 points marqués ⚠️ (non vérifié). Cote du module : C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

#### M-ECO · Économies de fonctionnement de niveau 2 : 0,9 / 1,9 / 4,9 Md€ (le niveau 1 de 0,4465 est fixe) {#m-eco}

- **La mesure.** Économies de fonctionnement de niveau 2 : 0,9 / 1,9 / 4,9 Md€ (le niveau 1 de 0,4465 est fixe). Source : `sources/economies-fonctionnement.md § 1 via retraites_aisees_0611.js S.eco2`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 1,9 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **1,9 [0,9 ; 4,9]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 4,9 Md€ (favorable), 1,9 (central), 0,9 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : monte de 2029 à 2038 (rampe du modèle) ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** Rassemblement national : [RN A01](./detail-rn.md#a01) (annonce plafonnée, médiane jugée réalisable à 15 % de l'annonce) ; [RN A02](./detail-rn.md#a02) (annonce plafonnée, médiane jugée réalisable à 65 % de l'annonce) ; [RN A03](./detail-rn.md#a03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [RN H05](./detail-rn.md#h05) (annonce plafonnée, médiane jugée réalisable à 44 % de l'annonce) — Les Républicains (plan Retailleau) : [LR03](./detail-lr.md#lr03) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) ; [LR04](./detail-lr.md#lr04) (annonce plafonnée, médiane jugée réalisable à 22 % de l'annonce) ; [LR07](./detail-lr.md#lr07) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) ; [LR08](./detail-lr.md#lr08) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) ; [LR09](./detail-lr.md#lr09) (annonce plafonnée, médiane jugée réalisable à 39 % de l'annonce) ; [LR10](./detail-lr.md#lr10) (annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS07](./detail-ps.md#ps07) (annonce plafonnée, médiane jugée réalisable à 69 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Fonctionnement de l'État et opérateurs »](./memes-modeles.md#f-etat).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : C. 2 points marqués ⚠️ (non vérifié). Cote du module : C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

### Services publics et dépenses nouvelles

#### M-OM · Outre-mer : sur-rémunérations, prix alimentaires (OM01, OM02) {#m-om}

- **La mesure.** Outre-mer : sur-rémunérations, prix alimentaires (OM01, OM02). Source : `decisions_0811.js HE8 (Cour des comptes 2020, Insee)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** 0,2 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **0,2 [−1,1 ; 0,4]** Md€ par an en 2038 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 0,4 Md€ (favorable), 0,2 (central), −1,1 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,3). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D10](./detail-lfi.md#d10), [LFI D12](./detail-lfi.md#d12), [LFI D13](./detail-lfi.md#d13) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D11](./detail-lfi.md#d11), [LFI D17b](./detail-lfi.md#d17b), [LFI D22](./detail-lfi.md#d22) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D17a](./detail-lfi.md#d17a), [LFI D25](./detail-lfi.md#d25) (coût unitaire × quantité) — Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-D (selon la ligne). 2 points marqués ⚠️ (non vérifié). Cote du module : B-D (selon la ligne).
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « coût ».

#### M-08 · Chiffrage du 08/11 : collectivités, justice, protection de l'enfance, imprévus, retenue victimes, artificialisation (CL01, JU01, EN01, IM01, VI01, ZA01, ZA02) {#m-08}

- **La mesure.** Chiffrage du 08/11 : collectivités, justice, protection de l'enfance, imprévus, retenue victimes, artificialisation (CL01, JU01, EN01, IM01, VI01, ZA01, ZA02). Source : `sources/chiffrage-decisions-0811.md via decisions_0811.js HE9`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −2,8 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−2,8 [−6,3 ; 0,9]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 0,9 Md€ (favorable), −2,8 (central), −6,4 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,5). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D10](./detail-lfi.md#d10), [LFI D12](./detail-lfi.md#d12), [LFI D13](./detail-lfi.md#d13) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D11](./detail-lfi.md#d11), [LFI D17b](./detail-lfi.md#d17b), [LFI D22](./detail-lfi.md#d22) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D17a](./detail-lfi.md#d17a), [LFI D25](./detail-lfi.md#d25) (coût unitaire × quantité) — Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-D (selon la ligne). 2 points marqués ⚠️ (non vérifié). Cote du module : B-D (selon la ligne).
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,5 sur le facteur commun « coût ».

#### M-GRAT · Gratuité des transports urbains : coût net (recettes perdues, offre, collecte) {#m-grat}

- **La mesure.** Gratuité des transports urbains : coût net (recettes perdues, offre, collecte). Source : `decisions_0511h.js gratuite(sc)`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −6,2 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−6,2 [−11,0 ; −4,4]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, −4,4 Md€ (favorable), −6,2 (central), −11,1 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,3). Calendrier : suit la trajectoire année par année du modèle ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** La France insoumise : [LFI D10](./detail-lfi.md#d10), [LFI D12](./detail-lfi.md#d12), [LFI D13](./detail-lfi.md#d13) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D11](./detail-lfi.md#d11), [LFI D17b](./detail-lfi.md#d17b), [LFI D22](./detail-lfi.md#d22) (ordre de grandeur sans source primaire, dit « grossier ») ; [LFI D17a](./detail-lfi.md#d17a), [LFI D25](./detail-lfi.md#d25) (coût unitaire × quantité) — Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « coût ».

### Autres recettes et écritures sans effet sur le déficit

#### M-FANT · Fantômes : GEMAPI et taxes spéciales d'équipement, chambres consulaires (BT13, BT14) {#m-fant}

- **La mesure.** Fantômes : GEMAPI et taxes spéciales d'équipement, chambres consulaires (BT13, BT14). Source : `base_0611.js HB11-HB12`, [page du modèle du système](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **Notre valeur centrale.** −1,3 Md€ en 2038, sans tirage (c'est notre propre chiffrage, pas une annonce indépendante ; aucun filtre de faisabilité ne lui est appliqué).
- **Notre estimation.** **−1,3 [−1,9 ; 0,0]** Md€ par an en 2038 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** La fonction de notre modèle qui calcule ce module est rejouée au scénario favorable puis défavorable, tout le reste au central : en 2038, 0,0 Md€ (favorable), −1,3 (central), −1,9 (défavorable). Ces deux bornes sont lues comme les centiles 10 et 90 ; le module est relié aux autres par le facteur « coût » (poids 0,3). Calendrier : à plein effet dès 2029 ; valeur lue en 2038.
- **Modèle utilisé.** Notre modèle, rejoué à ses bornes : `js/pont_incertitudes.js` et `moteur.effet_modules` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** Rassemblement national : [RN F07](./detail-rn.md#f07) (annonce plafonnée, médiane jugée réalisable à 47 % de l'annonce) ; [RN G03](./detail-rn.md#g03) (valeur fixe (0)) ; [RN R30](./detail-rn.md#r30) (annonce plafonnée, médiane jugée réalisable à 83 % de l'annonce) — Les Républicains (plan Retailleau) : [LR11](./detail-lr.md#lr11) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS08c](./detail-ps.md#ps08c) (annonce plafonnée, médiane jugée réalisable à 21 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Autres recettes et écritures sans effet sur le déficit »](./memes-modeles.md#f-autres).
- **Fiabilité.** Module de notre modèle, propagé dans le tirage. Cotes des sources de la ligne : B-C. 2 points marqués ⚠️ (non vérifié). Cote du module : B-C.
- **Choix posés par l'IA.** lire les bornes du modèle comme centiles 10 et 90 ; le poids 0,3 sur le facteur commun « coût ».

---

Page générée par `modeles/banc-programmes/detail.py` à partir de `programmes/langagement/mesures.py` et de `donnees/resultats.json` ; aucun chiffre n'y est tapé à la main. Écrite par Claude (IA d'Anthropic) pour l'auteur ; même banc pour tous, conflit d'intérêts déclaré.
