---
titre: "Chiffrage poste par poste : La France insoumise"
statut: généré par detail.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Chiffrage poste par poste : La France insoumise

Cette page détaille, ligne par ligne, comment le banc d'essai chiffre ce programme : ce que dit la mesure, ce que le parti annonce, ce que nous estimons, comment nous l'estimons, avec quel modèle, et si le même modèle sert aux autres programmes quand les mesures se ressemblent. Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions. Le même banc chiffre notre propre programme : l'auteur est partie prenante de la comparaison, et les écarts de méthode entre programmes sont listés dans [les mêmes modèles pour tous](./memes-modeles.md).

Programme lu : *L'Avenir en commun*, édition 2027 (https://melenchon2027.fr/programme/livre/), et le document budgétaire de LFI du 14/10/2026 (cote D : document partisan, qui dit lui-même ne pas constituer un chiffrage complet).

Unités : milliards d'euros (Md€) par an, euros de 2025 ; un nombre positif améliore le solde public, un nombre négatif l'aggrave. Chaque estimation est une médiane de 10 000 tirages, suivie entre crochets de l'intervalle qui en contient 80 % (centiles 10 et 90). Régime : 2032. Résultats complets : `modeles/banc-programmes/resultats.md`. Pages voisines : [Rassemblement national](./detail-rn.md), [Les Républicains (plan Retailleau)](./detail-lr.md), [PS et Place publique (contre-budget 2027)](./detail-ps.md), [notre système](./detail-langagement.md).

## Le total

| | La France insoumise |
|---|---|
| Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€) | **−247 [−289 ; −203]** |
| dont recettes nouvelles et économies | 61 [39 ; 89] |
| dont dépenses nouvelles et baisses d'impôts | 309 [275 ; 343] |
| Somme des médianes des postes ci-dessous | −244 |
| Part des tirages où le programme aggrave le déficit | 100 % |
| Dette publique en 2038 (% du PIB ; taux d'intérêt fixe de 3,45 %) | 240 [225 ; 254] |
| Dette publique en 2058 (% du PIB) | 503 [458 ; 548] |

Lecture. La médiane du total n'est pas la somme des médianes des postes : les postes sont tirés ensemble, avec des lois souvent asymétriques. Le total est celui du tableau comparatif des résultats (§ 1 et § 11.1 de `modeles/banc-programmes/resultats.md`) ; un test vérifie qu'il est recopié sans écart.
Les nationalisations ajoutent en outre 129 [118 ; 140] Md€ de capital engagé de 2028 à 2030 : une opération financière, qui augmente la dette et non le déficit.

## Ce que nous n'avons pas pu chiffrer

- exonérations de cotisations supprimées au-dessus de 2 SMIC.
- cotisation sociale universelle (fusion avec la CSG).
- dettes perpétuelles à taux nul (BCE) : hors champ budgétaire.
- pôle public du médicament et nationalisation de filiales critiques (inclus dans D24 sans prix).

## La meilleure objection à notre chiffrage

Ce que La France insoumise peut opposer à ce chiffrage, dit aussi loyalement que possible :

- **Les recettes sont nettes de réactions, celles de LFI sont brutes.** L'ISF rétabli, inscrit à 10 Md€ la première année, rapporte 2,2 [−5,8 ; 14,1] Md€ dans le banc ; les successions, inscrites à 20 Md€, 13,5 [−0,6 ; 31,1] Md€. L'écart vient de l'érosion de l'assiette et de l'exil que notre module des grandes fortunes retire, et que les chiffrages proches de LFI ne retiennent pas : l'Institut La Boétie l'a dit lui-même en audition, ses montants sont bruts. Avec des hypothèses d'exil moins sévères, appliquées à tous, ces trois lignes gagnent 6,6 Md€ en médiane (§ 10 des résultats) : le signe du total ne change pas.
- **Les recettes des entreprises sont ramenées par une convention sans source.** Faute de chiffre indépendant, la borne basse de 9 lignes est fixée à 35 % du montant de LFI. C'est le point le plus faible de notre côté ; ces lignes pèsent ensemble 35,3 Md€ en médiane.
- **La relance.** Le programme du Nouveau Front populaire de 2024, soutenu par LFI, présentait la dépense comme largement autofinancée par l'activité. Avec les multiplicateurs de la littérature, appliqués de la même façon à tous, l'effet passe de −247 [−289 ; −203] à −149 [−200 ; −101] Md€ (§ 2) : il reste négatif, mais un multiplicateur plus fort que nos bornes le réduirait encore.
- **La retraite à 60 ans.** Notre lecture suppose qu'une partie seulement des assurés part à 60 ans (âge effectif moyen central : 61,5 ans). Si tous partaient à 60 ans, le coût serait plus élevé, pas plus bas.

## Les postes en un tableau

| N° | Poste | Annoncé par le parti (Md€) | Notre estimation (Md€) | Modèle ou traitement |
|---|---|---|---|---|
| [R13](#r13) | Impôt sur le revenu à 14 tranches et fin du quotient conjugal | — | 0,5 [−2,4 ; 3,7] | OpenFisca-France sur foyers types, avec élasticité du revenu imposable |
| [R01b](#r01b) | Fin de la flat tax (prélèvement forfaitaire unique) | 9 (an 1) | 2,7 [1,5 ; 3,9] | ordre de grandeur sans source primaire, dit « grossier » |
| [R01a](#r01a) | ISF rétabli et renforcé (volet climatique non modélisé), net de l'IFI actuel | 10 (an 1) | 2,2 [−5,8 ; 14,1] | module des grandes fortunes, érosion et exil |
| [R04](#r04) | Garantie d'impôt de 2 % sur le patrimoine des centimillionnaires (type taxe Zucman) | 15 (an 1) | 0,0 [−0,0 ; 0,8] | module des grandes fortunes, érosion et exil |
| [R05](#r05) | Successions : exonération sous 150 000 €, plafond d'héritage de 12 M€ | 20 (an 1) | 13,5 [−0,6 ; 31,1] | module des transmissions, planification et départs |
| [R03](#r03) | CVAE rétablie sur les grandes entreprises | 3 (an 1) | 2,0 [1,4 ; 2,5] | recette de LFI ramenée entre 33 % et 100 % |
| [R06](#r06) | Réforme de l'impôt sur les sociétés | 3 (an 1) | 2,0 [1,4 ; 2,6] | recette de LFI ramenée entre 33 % et 100 % |
| [R07](#r07) | Taxe universelle sur les multinationales | 5 (an 1) | 3,4 [2,5 ; 4,3] | recette de LFI ramenée entre 36 % et 100 % |
| [R08](#r08) | Taxe Gafam renforcée | 3,9 (an 1) | 2,6 [2,0 ; 3,3] | recette de LFI ramenée entre 36 % et 100 % |
| [R09](#r09) | Taxe sur les superprofits | 5 (an 1) | 3,4 [2,5 ; 4,3] | recette de LFI ramenée entre 36 % et 100 % |
| [R10](#r10) | Taxe sur les transactions financières renforcée | 5 (an 1) | 3,4 [2,5 ; 4,3] | recette de LFI ramenée entre 36 % et 100 % |
| [R11](#r11) | Rachats d'actions (2,5) et crypto-actifs (1) | 3,5 (an 1) | 2,4 [1,7 ; 3,0] | recette de LFI ramenée entre 34 % et 100 % |
| [R02](#r02) | Rabot des niches fiscales et sociales (dont CIR, pacte Dutreil) | 22 (an 1) | 14,8 [10,8 ; 18,7] | recette de LFI ramenée entre 35 % et 100 % |
| [S01](#s01) | Smic à 1 700 € net, immédiatement (effets publics seulement : le coût pour les entreprises est privé) | — | −6,1 [−12,7 ; 3,4] | levier Smic : salaires, OpenFisca-France, emploi |
| [D05](#d05) | Retraite à 60 ans à taux plein pour 40 annuités (abroge la réforme de 2023, supprime la décote) | 9 (an 1) | −55,1 [−69,0 ; −43,4] | modèle des retraites, âge de départ |
| [P01](#p01) | Pension minimale au niveau du Smic revalorisé pour une carrière complète, et minimum vieillesse au seuil de pauvreté | — | −22,9 [−30,3 ; −18,4] | distribution des pensions des carrières complètes, DREES |
| [D02](#d02) | Indexation des pensions, allocations familiales, APL ; APL +10 % | 8 (an 1) | −8,5 [−9,5 ; −7,7] | montant de LFI, 0,9 à 1,3 fois |
| [D04](#d04) | Garantie d'autonomie : jeunes, puis chaque personne au seuil de pauvreté (1 337 €) | 9,5 (an 1) | −20,4 [−25,8 ; −14,5] | fourchette propre à la ligne |
| [D06](#d06) | Assurance chômage : abrogation des réformes puis droits élargis | 3 (an 1) | −4,3 [−5,2 ; −3,5] | ordre de grandeur sans source primaire, dit « grossier » |
| [D19](#d19) | AAH portée à hauteur du SMIC | — | −8,0 [−9,2 ; −6,8] | coût unitaire × quantité |
| [D20](#d20) | Garantie d'emploi (chômeurs de longue durée, au moins au SMIC revalorisé), nette des allocations évitées | — | −10,9 [−17,3 ; −6,8] | coût unitaire × quantité |
| [D07](#d07) | « 100 % Sécu » : soins pris en charge à 100 %, fin des franchises, arrêts maladie à 100 % sans carence | — | −30,4 [−35,7 ; −25,3] | fourchette propre à la ligne |
| [D08](#d08) | Hôpital et soin : recrutements, revalorisations | 3 (an 1) | −7,5 [−10,0 ; −5,0] | fourchette propre à la ligne |
| [D18](#d18) | Dépendance : 10 000 places publiques par an pendant 5 ans, domicile en Sécu, statut d'aidant | — | −2,8 [−4,0 ; −1,8] | ordre de grandeur sans source primaire, dit « grossier » |
| [D24](#d24) | Centres de santé publics, pôle public du médicament, psychologues remboursés | — | −5,5 [−8,1 ; −3,5] | ordre de grandeur sans source primaire, dit « grossier » |
| [C01](#c01) | Blocage du prix des carburants à 1,70 € le litre (avec encadrement des marges des raffineurs) | — | −4,1 [−12,5 ; 0,0] | levier carburants : volume, prix, marges |
| [D01](#d01) | Point d'indice +10 % (compensation des collectivités) | 17 (an 1) | −19,8 [−20,3 ; −19,1] | fourchette propre à la ligne |
| [D09](#d09) | Éducation : postes supplémentaires (23 à 19 élèves par classe) | 0,5 (an 1) | −6,4 [−8,2 ; −5,1] | coût unitaire × quantité |
| [D21](#d21) | Sixième semaine de congés payés (part employeur public) | — | −3,9 [−6,1 ; −1,8] | coût unitaire × quantité |
| [D23](#d23) | Collectivités : DGF indexée, taxe d'habitation progressive, moratoires de fermeture, services itinérants, outre-mer | — | −3,8 [−6,1 ; −2,2] | ordre de grandeur sans source primaire, dit « grossier » |
| [D10](#d10) | Cantine scolaire gratuite | 3,6 (an 1) | −3,8 [−4,3 ; −3,5] | montant de LFI, 0,9 à 1,3 fois |
| [D11](#d11) | Université : gratuité, 250 000 places, Crous, immobilier | 3,5 (an 1) | −5,4 [−6,8 ; −4,3] | ordre de grandeur sans source primaire, dit « grossier » |
| [D12](#d12) | Violences sexistes et sexuelles (2,6) et violences faites aux enfants (2) | 4,6 (an 1) | −4,9 [−5,5 ; −4,4] | montant de LFI, 0,9 à 1,3 fois |
| [D13](#d13) | Rattrapage des budgets 2026, indexés sur l'inflation (travail, culture, sport, diplomatie, aide au développement) | 7 (an 1) | −7,4 [−8,3 ; −6,8] | montant de LFI, 0,9 à 1,3 fois |
| [D17a](#d17a) | Petite enfance : 500 000 places d'accueil | — | −8,3 [−9,1 ; −7,6] | coût unitaire × quantité |
| [D17b](#d17b) | Gratuité des crèches publiques (perte des participations familiales) | — | −1,6 [−2,4 ; −1,0] | ordre de grandeur sans source primaire, dit « grossier » |
| [D22](#d22) | Gratuité de l'école hors cantine, repas Crous à 1 €, culture à 1 % du PIB, sport | — | −7,6 [−12,3 ; −4,3] | ordre de grandeur sans source primaire, dit « grossier » |
| [D25](#d25) | Service citoyen de neuf mois rémunéré au SMIC | — | −6,8 [−11,0 ; −3,8] | coût unitaire × quantité |
| [D03](#d03) | Logements d'urgence, réquisition | 3 (an 1) | −3,2 [−3,6 ; −2,9] | montant de LFI, 0,9 à 1,3 fois |
| [D14](#d14) | Planification écologique (État) : rénovation de 700 000 logements par an, bâtiments publics, sécurité civile | 10 (an 1) | −24,4 [−31,4 ; −16,6] | fourchette propre à la ligne |
| [D16](#d16) | Logement public : 200 000 par an (environ la moitié aujourd'hui) + 30 000 logements jeunes | — | −4,5 [−6,5 ; −3,1] | ordre de grandeur sans source primaire, dit « grossier » |
| [R12](#r12) | Lutte contre la fraude fiscale (reconstruction des effectifs) | 2 (an 1) | 1,4 [1,0 ; 1,7] | recette de LFI ramenée entre 35 % et 100 % |
| [D15](#d15) | Pôle public bancaire : 100 Md€ par an investis ; part supportée par l'État | — | −7,7 [−14,5 ; −3,2] | ordre de grandeur sans source primaire, dit « grossier » |
| [N01](#n01) | Renationaliser la SNCF (la SA SNCF est déjà détenue à 100 % par l'État) | — | 0,0 | levier nationalisations : prix, dette, dividendes |
| [N02](#n02) | Renationaliser les autoroutes (concessions de Vinci, Eiffage, Abertis) en revenant sur les hausses de prix passées | — | 4,7 [3,5 ; 6,1] | levier nationalisations : prix, dette, dividendes |
| [N03](#n03) | Renationaliser les « aéroports stratégiques » (dont Aéroports de Paris) | — | 0,3 [0,2 ; 0,4] | levier nationalisations : prix, dette, dividendes |
| [N04](#n04) | Renationaliser Engie (pôle public de l'énergie avec EDF et des coopératives locales) | — | 2,9 [2,4 ; 3,4] | levier nationalisations : prix, dette, dividendes |
| [N05](#n05) | Nationaliser ArcelorMittal France | — | −0,5 [−0,9 ; −0,2] | levier nationalisations : prix, dette, dividendes |
| [N06](#n06) | Collectiviser les EHPAD privés à but lucratif et les confier à des associations ou coopératives | — | 0,0 | levier nationalisations : prix, dette, dividendes |

## Le détail, poste par poste

### Impôt sur le revenu et CSG

#### R13 · Impôt sur le revenu à 14 tranches et fin du quotient conjugal {#r13}

- **La mesure, dans les mots du programme.** « barème à 14 tranches contre 5 ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2), P2 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **0,5 [−2,4 ; 3,7]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le barème est appliqué par OpenFisca-France à une population de foyers types calée sur l'impôt de 2024. Taux du haut du barème : de 60 % à 90 %, valeur la plus probable 75 % ; rapport des revenus des conjoints : de 0,4 à 0,8, valeur la plus probable 0,6 ; calage : de 0,85 à 1,15, valeur la plus probable 1. Réaction : les revenus déclarés baissent selon une élasticité du revenu imposable de 0,12 / 0,25 / 0,4 (centiles 10, 50 et 90 du facteur « comportement »). Calendrier : part du régime atteinte de 2028 à 2032 : 50 %, 75 %, 100 %, 100 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Taux et seuils des 14 tranches non publiés (⚠️ À VÉRIFIER dans la version complète du programme). Lecture : barème actuel conservé jusqu'à 84 577 € par part, puis 45 / 50 / 55 % et une montée linéaire jusqu'au taux supérieur (60, 75 ou 90 %, atteint à 20 M€) ; quotient conjugal remplacé par une imposition individuelle sans compensation par enfant (non chiffrée par LFI : sans compensation, la recette est surestimée). OpenFisca-France 176.1.10 sur population stylisée de foyers types (voir ir_openfisca.py) ; réaction par l'élasticité du revenu imposable.
- **Modèle utilisé.** OpenFisca-France sur foyers types, avec élasticité du revenu imposable : `ir_openfisca.py` (OpenFisca-France 176.1.10, population stylisée calée sur l'impôt de 2024) et `moteur.levier_ir`.
- **La même famille ailleurs.** Rassemblement national : [RN T08](./detail-rn.md#t08) (OpenFisca-France, impôt d'un salarié seul) ; [RN D03](./detail-rn.md#d03) (montant du parti, 0,7 à 1,3 fois) — PS et Place publique (contre-budget 2027) : [PS10](./detail-ps.md#ps10) (fourchette propre à la ligne) — notre système : [M-REV](./detail-langagement.md#m-rev) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôt sur le revenu et CSG »](./memes-modeles.md#f-ir).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : A, C. 1 point marqué ⚠️ (non vérifié).

### Revenus du capital et épargne

#### R01b · Fin de la flat tax (prélèvement forfaitaire unique) {#r01b}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Fin de la flat tax. Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2), P2 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 9 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **2,7 [1,5 ; 3,9]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Fourchette retenue : de 0,7 à 5, valeur la plus probable 2,5 Md€ (voir la lecture ci-dessous). Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Sans modèle branché (OpenFisca n'a pas de population de revenus du capital ici). Ordre de grandeur : de 0,7 à 5 Md€, sans source primaire lue ; l'Institut Montaigne (2022) donne environ 5 Md€ pour ISF et flat tax ensemble.
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN T06](./detail-rn.md#t06) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-CAP](./detail-langagement.md#m-cap), [M-EPAR](./detail-langagement.md#m-epar) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Revenus du capital et épargne »](./memes-modeles.md#f-capital).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : C. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** le poids 0,6 sur le facteur commun « comportement ».

### Patrimoine et héritages

#### R01a · ISF rétabli et renforcé (volet climatique non modélisé), net de l'IFI actuel {#r01a}

- **La mesure, résumée par nous (pas de citation exacte relevée).** ISF rétabli et renforcé, volet climatique. Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2), P2 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **2,2 [−5,8 ; 14,1]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Barème d'ISF du module des grandes fortunes, entre « sobre » et « renforcé » (intensité de 0 à 1, valeur la plus probable 0,7), net de l'IFI actuel (2,739 Md€). Érosion de l'assiette et exil selon le facteur « comportement » : érosion à 1 point d'impôt de 20 / 35 / 55 % (favorable, central, défavorable). Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Montant de LFI : 10 Md€ (document budgétaire du 14/10/2026, « ISF climatique » ; l'ancien an1 de 19 additionnait à tort l'ISF, 10, et la flat tax, 9 : corrigé le 08/11/2026 ; NFP 2024 : 15 ; La Boétie 2026 : environ 8 : sources/hypotheses-chiffrage-lfi-boetie.md). Taux et seuil non publiés. Branché sur le module de patrimoine de notre modèle (érosion de l'assiette, exil, externalités). Seuil de 1,3 M€ par foyer (ISF avant 2018). « Sobre » (0) : 0,8 % jusqu'à 10 M€, 1,5 % au-delà ; « renforcé » (1) : 1 %, 2 % de 10 à 100 M€, 3 % au-delà de 100 M€ ; central 0,7. Effet net de l'IFI actuel (2,74 Md€). Le volet climatique n'est pas modélisé.
- **Modèle utilisé.** Module des grandes fortunes, érosion et exil : `modeles/systeme-ideal/grandes_fortunes_0511.js` (varianteB) et `moteur.levier_isf` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (même module des grandes fortunes, même érosion et même exil ; barème propre à la mesure) — PS et Place publique (contre-budget 2027) : [PS01](./detail-ps.md#ps01) (même module des grandes fortunes, même érosion et même exil ; barème propre à la mesure) ; [PS02](./detail-ps.md#ps02) (annonce plafonnée, médiane jugée réalisable à 50 % de l'annonce) — notre système : [M-TH](./detail-langagement.md#m-th), [M-PAT](./detail-langagement.md#m-pat), [M-TRANS](./detail-langagement.md#m-trans) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : B.

#### R04 · Garantie d'impôt de 2 % sur le patrimoine des centimillionnaires (type taxe Zucman) {#r04}

- **La mesure, dans les mots du programme.** « garantie d'impôt de 2 % sur le patrimoine des centimillionnaires ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2), P2 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 15 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **0,0 [−0,0 ; 0,8]** Md€ par an en 2032 : pratiquement nul en médiane.
- **Comment nous l'évaluons.** Complément pour que l'impôt payé atteigne le minimum visé par la mesure sur les très grands patrimoines, après l'ISF et le prélèvement unique déjà payés ; même intensité que la ligne d'ISF. Érosion et exil du module (érosion à 1 point : 20 / 35 / 55 %). Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Branché sur le module grandes_fortunes_0511 : complément nécessaire pour atteindre 2 % du patrimoine (après ISF et prélèvement unique déjà payés), avec érosion et exil. Si l'ISF « renforcé » (3 % au sommet) s'applique déjà, le plancher n'ajoute rien : les deux lignes se recouvrent, ce que le moteur fait apparaître au lieu de les additionner naïvement. Cohérence (08/11/2026) : l'intensité de l'ISF et celle du plancher sont désormais le même facteur latent (facteur « isf », poids 0,95), pour que le complément du plancher soit calculé net du barème d'ISF effectivement tiré ; l'audition de La Boétie additionne l'ISF (8) et la taxe Zucman (15 à 25, puis « peut-être 10 » p. 7), ce que le banc ne fait pas : à trancher par l'auteur. Recoupement : Institut de l'entreprise 2026 : environ 5,5 Md€ (cote C, patronal) ; Zucman : 15 à 25.
- **Modèle utilisé.** Module des grandes fortunes, érosion et exil : `modeles/systeme-ideal/grandes_fortunes_0511.js` et `moteur.levier_plancher` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (même module des grandes fortunes, même érosion et même exil ; barème propre à la mesure) — PS et Place publique (contre-budget 2027) : [PS01](./detail-ps.md#ps01) (même module des grandes fortunes, même érosion et même exil ; barème propre à la mesure) ; [PS02](./detail-ps.md#ps02) (annonce plafonnée, médiane jugée réalisable à 50 % de l'annonce) — notre système : [M-TH](./detail-langagement.md#m-th), [M-PAT](./detail-langagement.md#m-pat), [M-TRANS](./detail-langagement.md#m-trans) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : B.

#### R05 · Successions : exonération sous 150 000 €, plafond d'héritage de 12 M€ {#r05}

- **La mesure, dans les mots du programme.** « plafond d'héritage de 12 M€ », exonération sous 150 000 €. Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2), P2 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 20 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **13,5 [−0,6 ; 31,1]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Module des transmissions : exonération prévue par la mesure puis taux plat équivalent (de 20 % à 45 %, valeur la plus probable 30 %), avec la déclaration et la planification (17 / 30 / 45 %) et les départs des patrimoines mobiles (5 / 12 / 27 %) ; plus la reprise de ce qui dépasse le plafond d'héritage (12 000 000 €). Effet net des droits actuels. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Barème au-delà de 150 000 € non publié : lu comme un taux plat équivalent de 20 % à 45 % (central 30 %), dans notre module transmissions_0611.recette (déclaration, planification, exil des patrimoines mobiles), plus la reprise de ce qui dépasse 12 M€ reçus, nette des comportements. Effet net des droits actuels (20,8 Md€).
- **Modèle utilisé.** Module des transmissions, planification et départs : `modeles/systeme-ideal/transmissions_0611.js` (trois) et `moteur.levier_succession` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/systeme-ideal/).
- **La même famille ailleurs.** Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (module des grandes fortunes, érosion et exil) — PS et Place publique (contre-budget 2027) : [PS01](./detail-ps.md#ps01) (module des grandes fortunes, érosion et exil) ; [PS02](./detail-ps.md#ps02) (annonce plafonnée, médiane jugée réalisable à 50 % de l'annonce) — notre système : [M-TH](./detail-langagement.md#m-th), [M-PAT](./detail-langagement.md#m-pat) (notre modèle, rejoué à ses bornes) ; [M-TRANS](./detail-langagement.md#m-trans) (même fonction `trois()` du module des transmissions, mêmes comportements ; barème propre à la mesure). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : A, B.

### Impôts des entreprises

#### R03 · CVAE rétablie sur les grandes entreprises {#r03}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Rétablir la CVAE (document budgétaire : 3 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 3 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **2,0 [1,4 ; 2,5]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Haut : le montant de LFI (3 Md€) ; bas : 33 % de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : 2. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : LFI ; bas : 35 % (convention).
- **Modèle utilisé.** Aucun : recette de LFI ramenée entre 33 % et 100 % (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN F03](./detail-rn.md#f03) (annonce plafonnée, médiane jugée réalisable à 13 % de l'annonce) ; [RN F04](./detail-rn.md#f04) (annonce plafonnée, médiane jugée réalisable à 52 % de l'annonce) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS03](./detail-ps.md#ps03) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — notre système : [M-CRED](./detail-langagement.md#m-cred) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Pas de modèle : montant de LFI, ramené par une convention. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-DECOTE : 35 % du chiffre de LFI sans recoupement ; la borne basse à une fraction fixe du montant de LFI ; le poids 0,5 sur le facteur commun « comportement ».

#### R06 · Réforme de l'impôt sur les sociétés {#r06}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Réforme de l'IS (document budgétaire : 3 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 3 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **2,0 [1,4 ; 2,6]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Haut : le montant de LFI (3 Md€) ; bas : 33 % de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : 2. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : LFI ; bas : 35 %.
- **Modèle utilisé.** Aucun : recette de LFI ramenée entre 33 % et 100 % (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN F03](./detail-rn.md#f03) (annonce plafonnée, médiane jugée réalisable à 13 % de l'annonce) ; [RN F04](./detail-rn.md#f04) (annonce plafonnée, médiane jugée réalisable à 52 % de l'annonce) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS03](./detail-ps.md#ps03) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — notre système : [M-CRED](./detail-langagement.md#m-cred) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Pas de modèle : montant de LFI, ramené par une convention. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-DECOTE : 35 % sans recoupement ; la borne basse à une fraction fixe du montant de LFI ; le poids 0,5 sur le facteur commun « comportement ».

#### R07 · Taxe universelle sur les multinationales {#r07}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Impôt universel sur les entreprises (document budgétaire : 5 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 5 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **3,4 [2,5 ; 4,3]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Haut : le montant de LFI (5 Md€) ; bas : 36 % de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : 3,4. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : LFI ; bas : 35 %. L'Institut Montaigne (2022) donnait 18 pour une conception différente : non retenu.
- **Modèle utilisé.** Aucun : recette de LFI ramenée entre 36 % et 100 % (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN F03](./detail-rn.md#f03) (annonce plafonnée, médiane jugée réalisable à 13 % de l'annonce) ; [RN F04](./detail-rn.md#f04) (annonce plafonnée, médiane jugée réalisable à 52 % de l'annonce) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS03](./detail-ps.md#ps03) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — notre système : [M-CRED](./detail-langagement.md#m-cred) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Pas de modèle : montant de LFI, ramené par une convention. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-DECOTE : 35 % sans recoupement ; la borne basse à une fraction fixe du montant de LFI ; le poids 0,5 sur le facteur commun « comportement ».

#### R08 · Taxe Gafam renforcée {#r08}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Taxe Gafam (document budgétaire : 3,9 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 3,9 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **2,6 [2,0 ; 3,3]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Haut : le montant de LFI (3,9 Md€) ; bas : 36 % de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : 2,6. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : LFI ; bas : 35 %.
- **Modèle utilisé.** Aucun : recette de LFI ramenée entre 36 % et 100 % (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN F03](./detail-rn.md#f03) (annonce plafonnée, médiane jugée réalisable à 13 % de l'annonce) ; [RN F04](./detail-rn.md#f04) (annonce plafonnée, médiane jugée réalisable à 52 % de l'annonce) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS03](./detail-ps.md#ps03) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — notre système : [M-CRED](./detail-langagement.md#m-cred) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Pas de modèle : montant de LFI, ramené par une convention. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-DECOTE : 35 % sans recoupement ; la borne basse à une fraction fixe du montant de LFI ; le poids 0,5 sur le facteur commun « comportement ».

#### R09 · Taxe sur les superprofits {#r09}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Taxe sur les superprofits (document budgétaire : 5 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 5 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **3,4 [2,5 ; 4,3]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Haut : le montant de LFI (5 Md€) ; bas : 36 % de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : 3,4. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : LFI ; bas : 35 % (le Nouveau Front populaire revendiquait 15 en 2024 : non retenu).
- **Modèle utilisé.** Aucun : recette de LFI ramenée entre 36 % et 100 % (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN F03](./detail-rn.md#f03) (annonce plafonnée, médiane jugée réalisable à 13 % de l'annonce) ; [RN F04](./detail-rn.md#f04) (annonce plafonnée, médiane jugée réalisable à 52 % de l'annonce) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS03](./detail-ps.md#ps03) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — notre système : [M-CRED](./detail-langagement.md#m-cred) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Pas de modèle : montant de LFI, ramené par une convention. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-DECOTE : 35 % sans recoupement ; la borne basse à une fraction fixe du montant de LFI ; le poids 0,5 sur le facteur commun « comportement ».

#### R10 · Taxe sur les transactions financières renforcée {#r10}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Taxe sur les transactions financières (document budgétaire : 5 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P2 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 5 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **3,4 [2,5 ; 4,3]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Haut : le montant de LFI (5 Md€) ; bas : 36 % de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : 3,4. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : LFI ; bas : 35 %.
- **Modèle utilisé.** Aucun : recette de LFI ramenée entre 36 % et 100 % (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN F03](./detail-rn.md#f03) (annonce plafonnée, médiane jugée réalisable à 13 % de l'annonce) ; [RN F04](./detail-rn.md#f04) (annonce plafonnée, médiane jugée réalisable à 52 % de l'annonce) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS03](./detail-ps.md#ps03) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — notre système : [M-CRED](./detail-langagement.md#m-cred) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Pas de modèle : montant de LFI, ramené par une convention. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-DECOTE : 35 % sans recoupement ; la borne basse à une fraction fixe du montant de LFI ; le poids 0,5 sur le facteur commun « comportement ».

#### R11 · Rachats d'actions (2,5) et crypto-actifs (1) {#r11}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Taxation des rachats d'actions et des crypto-actifs. Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 3,5 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **2,4 [1,7 ; 3,0]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Haut : le montant de LFI (3,5 Md€) ; bas : 34 % de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : 2,4. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : LFI ; bas : 35 %.
- **Modèle utilisé.** Aucun : recette de LFI ramenée entre 34 % et 100 % (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN T03](./detail-rn.md#t03) (montant du parti, 0,97 à 1,08 fois) ; [RN F01](./detail-rn.md#f01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN F03](./detail-rn.md#f03) (annonce plafonnée, médiane jugée réalisable à 13 % de l'annonce) ; [RN F04](./detail-rn.md#f04) (annonce plafonnée, médiane jugée réalisable à 52 % de l'annonce) — Les Républicains (plan Retailleau) : [LRT1](./detail-lr.md#lrt1) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS03](./detail-ps.md#ps03) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — notre système : [M-CRED](./detail-langagement.md#m-cred) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Impôts des entreprises »](./memes-modeles.md#f-entreprises).
- **Fiabilité.** Pas de modèle : montant de LFI, ramené par une convention. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-DECOTE : 35 % sans recoupement ; la borne basse à une fraction fixe du montant de LFI ; le poids 0,5 sur le facteur commun « comportement ».

### Niches fiscales et sociales

#### R02 · Rabot des niches fiscales et sociales (dont CIR, pacte Dutreil) {#r02}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Suppression de niches fiscales et sociales (document budgétaire : 22 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P2/P1. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 22 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **14,8 [10,8 ; 18,7]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Haut : le montant de LFI (22 Md€) ; bas : 35 % de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : 14,8. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : montant de LFI ; bas : 35 % du montant de LFI (érosion de l'assiette ; règle de recoupement du dossier : aucun chiffre indépendant lu).
- **Modèle utilisé.** Aucun : recette de LFI ramenée entre 35 % et 100 % (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN T04](./detail-rn.md#t04) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS04](./detail-ps.md#ps04) (annonce plafonnée, médiane jugée réalisable à 75 % de l'annonce) ; [PS05](./detail-ps.md#ps05) (annonce plafonnée, médiane jugée réalisable à 62 % de l'annonce) — notre système : [M-FRP](./detail-langagement.md#m-frp), [M-CONV](./detail-langagement.md#m-conv) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Niches fiscales et sociales »](./memes-modeles.md#f-niches).
- **Fiabilité.** Pas de modèle : montant de LFI, ramené par une convention. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-DECOTE : 35 % du chiffre de LFI quand aucun chiffre indépendant n'est lu : convention sans source (V31009) ; la borne basse à une fraction fixe du montant de LFI ; le poids 0,5 sur le facteur commun « comportement ».

### Smic, salaires et cotisations

#### S01 · Smic à 1 700 € net, immédiatement (effets publics seulement : le coût pour les entreprises est privé) {#s01}

- **La mesure, dans les mots du programme.** « Porter immédiatement le SMIC mensuel à 1 700 euros net ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2), P2 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−6,1 [−12,7 ; 3,4]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : coût net pour les employeurs privés (non compté dans le solde) : 2,8 [−4,6 ; 13,6] ; hausse des allègements généraux : 12,3 [1,8 ; 19,9] ; recettes publiques nettes avant l'effet sur l'emploi : −2,0 [−9,5 ; 8,6] ; emplois perdus (milliers) : 90,7 [36,9 ; 195,9] ; masse salariale brute en plus dans le privé : 11,4 [9,9 ; 13,0] ; variante où le barème des allègements est gelé : 10,1 [7,9 ; 12,5] ; variante où les allègements suivent le Smic : −14,0 [−16,2 ; −12,2].
- **Comment nous l'évaluons.** Salaires du privé en loi lognormale ; hausse du Smic : de 14,3 % à 17,8 %, valeur la plus probable 17,8 % ; cotisations, CSG, impôt, prime d'activité et allègements lus dans OpenFisca-France par foyer type. Emploi perdu selon une élasticité au coût du travail : de 0,05 à 0,5, valeur la plus probable 0,25 ; indexation des allègements (1 = droit actuel, 0 = gel) : de 0 à 1, valeur la plus probable 1. Seuls les effets sur les finances publiques sont comptés, pas le coût pour les entreprises. Calendrier : part du régime atteinte de 2028 à 2032 : 80 %, 100 %, 100 %, 100 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Lecture : décret en 2027 (« immédiatement »), donc plein effet dès le premier exercice du banc (2028), l'effet sur l'emploi se constituant en un an (80 % la première année). La hausse est lue en euros constants : de 1 443 € net (Smic de 2026) à 1 700 €, soit +17,8 % (central, haut) ; bas : +14,3 % si 1 700 € de 2028 après deux revalorisations automatiques de 1,5 %. Les allègements généraux sont maintenus avec leur formule en Smic (la réduction générale est dégressive jusqu'à 1,6 Smic dans OpenFisca-France 176.1.10) : comme elle est indexée sur le Smic, elle augmente mécaniquement, y compris pour les salariés dont le salaire ne bouge pas (aubaine pour les employeurs, coût pour les finances publiques) ; le paramètre « indexation_allegement » va de 1 (droit actuel, valeur modale) à 0 (barème gelé en euros, ce que la Cour des comptes et le Sénat proposent d'étudier) : sa médiane est donc inférieure à 1 ; le programme supprime les exonérations au-dessus de 2 Smic (autre ligne, non chiffrée). Salaires modélisés par une loi lognormale du privé à temps plein, calée sur 12,4 % de salariés au Smic (DARES) et un salaire médian ; les salaires entre 1 Smic et 1,3 Smic reçoivent une part (diffusion) de la hausse ; recette publique par salarié (cotisations, CSG, CRDS, impôt sur le revenu, prime d'activité) lue dans OpenFisca-France sur quatre foyers types. Emploi : élasticité absolue de 0,05 à 0,50 du coût des salariés concernés ; chaque emploi perdu retire la recette publique d'un emploi au nouveau Smic et ajoute une allocation de remplacement. Dépenses publiques : agents et secteurs financés au voisinage du Smic, contrats aidés. Hors solde, conservés à part : coût brut pour les employeurs privés (affiché dans resultats.md), TVA induite par la consommation des salariés augmentés (non comptée pour ne pas doubler le multiplicateur du § 2), aides au logement (APL) non modélisées.
- **Modèle utilisé.** Levier Smic : salaires, OpenFisca-France, emploi : `leviers2.levier_smic` et `smic_openfisca.py`.
- **La même famille ailleurs.** Rassemblement national : [RN D02](./detail-rn.md#d02) (ordre de grandeur sans source primaire, dit « grossier ») — Les Républicains (plan Retailleau) : [LRT2](./detail-lr.md#lrt2) (montant du parti, 0,95 à 1,15 fois) — PS et Place publique (contre-budget 2027) : [PS09](./detail-ps.md#ps09) (même module ; paramètres propres à la mesure : hausse du Smic). Ce que le code confirme et ce qui diffère : [note de famille « Smic, salaires et cotisations »](./memes-modeles.md#f-salaires).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : A, D. 6 points marqués ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-SMIC-3 : Réduction générale (allègement) : 31,93 % du salaire au Smic, dégressive jusqu'à 1,6 Smic ; cotisations et impôts : grille de 4 foyers types (seul, parent isolé, couple à un apporteur avec 2 enfants, couple bi-actif) ; H-SMIC-6 : Salaire brut mensuel médian en équivalent temps plein du privé : 2 900 € (2 750 à 3 050) : médiane nette de l'ordre de 2 190 € (Insee, 2022) revalorisée, divisée par 0,78 (ratio du modèle). Équivalent temps plein = 88 % des salariés (82 à 95 %) ; H-SMIC-7 : Agents publics au voisinage du Smic : 1 à 5 % de la masse salariale publique (370 Md€), après la hausse de 10 % du point d'indice déjà comptée (D01) ; secteurs financés par la dépense publique (aide à domicile, médico-social, petite enfance) : masse de 40 à 100 Md€ dont 10 à 30 % au voisinage du Smic ; contrats aidés : 60 000 à 150 000 à 15 000 € par an, pris en charge à 40-80 % par l'État ; H-SMIC-8 : Allocation de remplacement par emploi perdu : 5 000 à 11 000 € par an (allocation moyenne de l'ordre de 1 100 € par mois, tous demandeurs non indemnisés compris).

### Retraites

#### D05 · Retraite à 60 ans à taux plein pour 40 annuités (abroge la réforme de 2023, supprime la décote) {#d05}

- **La mesure, dans les mots du programme.** « retraite à 60 ans à taux plein pour 40 annuités ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1), P3 ch1. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 9 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−55,1 [−69,0 ; −43,4]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Le programme fixe un âge ; nous en déduisons un âge effectif moyen de départ en 2032 : de 60,3 à 62,3, valeur la plus probable 61,5. Le modèle des retraites calcule le coût d'un départ avancé par rapport à l'âge effectif de 63,8 ans de son scénario de 2032 (pensions versées plus tôt, cotisations et impôts perdus sur l'emploi des partants), cohorte recalée par le modèle démographique. Aucune autre réaction de comportement. Calendrier : part du régime atteinte de 2028 à 2032 : 15 %, 45 %, 75 %, 100 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Branché sur modeles/retraites/age_libre.js (cohortes, mortalité, pension sans décote, recettes perdues d'activité). Le texte ne dit pas combien de personnes partent réellement à 60 ans : celles qui ont 40 annuités à cet âge. Âge effectif moyen visé : 62,3 ans si la condition de 40 annuités est stricte (bas coût), 61,5 central, 60,3 si presque tous partent à 60 ans (haut coût). Pension minimale au SMIC et abrogation de la décote ailleurs : non chiffrées. Départ de 2028, montée en 3 ans.
- **Modèle utilisé.** Modèle des retraites, âge de départ : `modeles/retraites/age_libre.js` par `js/pont_retraites.js` (cohortes, mortalité, pension sans décote, cotisations perdues), cohorte recalée par `modeles/demographie/` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/retraites/).
- **La même famille ailleurs.** Rassemblement national : [RN D01](./detail-rn.md#d01) (même module ; paramètres propres à la mesure : âge effectif moyen de départ (ans)) ; [RN H04](./detail-rn.md#h04) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — Les Républicains (plan Retailleau) : [LR12](./detail-lr.md#lr12) (annonce plafonnée, médiane jugée réalisable à 42 % de l'annonce) ; [LR13](./detail-lr.md#lr13) (annonce plafonnée, médiane jugée réalisable à 3 % de l'annonce) — notre système : [M-PENS](./detail-langagement.md#m-pens), [M-V6](./detail-langagement.md#m-v6) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Retraites »](./memes-modeles.md#f-retraites).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : B, C.

#### P01 · Pension minimale au niveau du Smic revalorisé pour une carrière complète, et minimum vieillesse au seuil de pauvreté {#p01}

- **La mesure, dans les mots du programme.** « Porter, a minima, toutes les pensions pour une carrière complète (salarié, indépendant, agriculteur) » au « niveau du SMIC revalorisé » ; « le minimum vieillesse au niveau du seuil de pauvreté ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1), P3 ch1. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−22,9 [−30,3 ; −18,4]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : minimum vieillesse relevé, net : 2,1 [1,4 ; 3,0] ; retraités relevés (millions) : 4,2 [3,6 ; 4,9] ; coût du complément de pension : 21,0 [16,1 ; 27,9] ; part des carrières complètes sous le seuil : 41 [35 ; 48] % ; coût total : 23,2 [18,3 ; 30,1].
- **Comment nous l'évaluons.** Distribution des pensions des retraités à carrière complète (DREES) : part sous le seuil et complément à verser. Seuil (€ nets par mois) : de 1 576 à 1 991, valeur la plus probable 1 700 ; part des carrières complètes : de 58 % à 65 %, valeur la plus probable 62 % ; minimum vieillesse relevé (Md€) : de 1,3 à 4, valeur la plus probable 2,5, moins un chevauchement (Md€) : de 0 à 0,9, valeur la plus probable 0,4. Calendrier : part du régime atteinte de 2028 à 2032 : 50 %, 75 %, 100 %, 100 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Le texte ne donne aucun montant en euros ni de date (séquence : minimum d'abord, puis retour à 60 ans). Trois lectures du « niveau du Smic revalorisé » : 1 700 € bruts de pension (environ 1 576 € nets, bas) ; 1 700 € nets (central, comparé à la pension nette) ; Smic brut revalorisé de 2 148 € (environ 1 991 € nets, haut). Seuls les retraités à carrière complète sont concernés (60 à 65 % des retraités résidents, DREES) : la distribution des pensions nettes totales de ce sous-champ (DREES, EIR 2020, tableau 8, ramenée à 2025 par l'homothétie k = 1,175 du modèle modeles/retraites/) donne la part sous le seuil et le coût du complément. Interaction avec le minimum vieillesse (ASPA, 4,6 Md€ actuels dans le modèle des retraites) : porté à 1 337 € (seuil de pauvreté de LFI), il coûte de 1,3 à 4 Md€ de plus (revalorisation de 28 % de l'allocation et élargissement du nombre de bénéficiaires), dont on retire de 0 à 0,9 Md€ d'ASPA économisée pour les carrières complètes dont la pension est relevée. Début en 2028, montée en trois ans (calendrier non précisé). Les pensions de carrières incomplètes ne sont relevées que par l'ASPA.
- **Modèle utilisé.** Distribution des pensions des carrières complètes, DREES : `leviers2.levier_pension_min` et `modeles/retraites/donnees/` ; [page du modèle](https://langagement-politique.vercel.app/fr/modeles/retraites/).
- **La même famille ailleurs.** Rassemblement national : [RN D01](./detail-rn.md#d01) (modèle des retraites, âge de départ) ; [RN H04](./detail-rn.md#h04) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — Les Républicains (plan Retailleau) : [LR12](./detail-lr.md#lr12) (annonce plafonnée, médiane jugée réalisable à 42 % de l'annonce) ; [LR13](./detail-lr.md#lr13) (annonce plafonnée, médiane jugée réalisable à 3 % de l'annonce) — notre système : [M-PENS](./detail-langagement.md#m-pens), [M-V6](./detail-langagement.md#m-v6) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Retraites »](./memes-modeles.md#f-retraites).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : A, D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-PMIN-3 : Interaction avec l'ASPA : hausse de 1,3 à 4 Md€, chevauchement de 0 à 0,9 Md€ : estimations à partir de l'ASPA de 4,6 Md€ (modèle), sans source primaire sur le nombre de bénéficiaires ⚠️ À VÉRIFIER (DREES, minimum vieillesse).

### Prestations et minima sociaux

#### D02 · Indexation des pensions, allocations familiales, APL ; APL +10 % {#d02}

- **La mesure, dans les mots du programme.** « APL +10 % », indexation sur les prix. Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2), P3 ch1/P2 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 8 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−8,5 [−9,5 ; −7,7]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Le montant de LFI (8 Md€) est la valeur la plus probable ; fourchette de 0,9 à 1,3 fois, asymétrique parce que les coûts publics dérivent plus souvent à la hausse (convention, sans source). Calendrier : part du régime atteinte de 2028 à 2032 : 95 %, 96 %, 97 %, 99 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Modèle utilisé.** Aucun : montant de LFI, 0,9 à 1,3 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Les Républicains (plan Retailleau) : [LR14](./detail-lr.md#lr14) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) — notre système : [M-GT](./detail-langagement.md#m-gt), [M-PL](./detail-langagement.md#m-pl), [M-DET](./detail-langagement.md#m-det), [M-RESID](./detail-langagement.md#m-resid) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Prestations et minima sociaux »](./memes-modeles.md#f-prestations).
- **Fiabilité.** Pas de modèle : montant de LFI, repris avec une fourchette. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,6 sur le facteur commun « coût ».

#### D04 · Garantie d'autonomie : jeunes, puis chaque personne au seuil de pauvreté (1 337 €) {#d04}

- **La mesure, dans les mots du programme.** « le revenu mensuel de chaque personne atteindra le seuil de pauvreté ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1), P3 ch1/ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 9,5 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−20,4 [−25,8 ; −14,5]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 9,5 à 30,2, valeur la plus probable 21,1 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 46 %, 60 %, 73 %, 87 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Bas : seulement les jeunes (9,5 Md€, document de LFI). Haut : écart de pauvreté de toute la population au seuil de 1 337 € (9,8 M de pauvres x 19,2 % x 1 337 € x 12 = 30,2 Md€, sans unités de consommation). Central : le haut moins 30 % déjà comblés par SMIC, minima, AAH et pensions (hypothèse).
- **Modèle utilisé.** Aucun : fourchette propre à la ligne (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Les Républicains (plan Retailleau) : [LR14](./detail-lr.md#lr14) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) — notre système : [M-GT](./detail-langagement.md#m-gt), [M-PL](./detail-langagement.md#m-pl), [M-DET](./detail-langagement.md#m-det), [M-RESID](./detail-langagement.md#m-resid) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Prestations et minima sociaux »](./memes-modeles.md#f-prestations).
- **Fiabilité.** Pas de modèle : fourchette propre à la ligne. Cotes des sources de la ligne : A, D.
- **Choix posés par l'IA.** H-COMBLE : 30 % de l'écart déjà comblés par les autres mesures : hypothèse sans source ; le poids 0,3 sur le facteur commun « coût ».

#### D06 · Assurance chômage : abrogation des réformes puis droits élargis {#d06}

- **La mesure, dans les mots du programme.** « abrogation des réformes de l'assurance chômage » (document budgétaire : 3 Md€ la 1re année). Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1), P3 ch1. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 3 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−4,3 [−5,2 ; −3,5]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 3 à 6, valeur la plus probable 4 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 70 %, 78 %, 85 %, 93 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Bas : montant de LFI ; haut : droits élargis (nombre d'allocataires et durée), sans source primaire lue.
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Les Républicains (plan Retailleau) : [LR14](./detail-lr.md#lr14) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) — notre système : [M-GT](./detail-langagement.md#m-gt), [M-PL](./detail-langagement.md#m-pl), [M-DET](./detail-langagement.md#m-det), [M-RESID](./detail-langagement.md#m-resid) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Prestations et minima sociaux »](./memes-modeles.md#f-prestations).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** le poids 0,6 sur le facteur commun « coût ».

#### D19 · AAH portée à hauteur du SMIC {#d19}

- **La mesure, dans les mots du programme.** « AAH à hauteur du SMIC ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2), P3 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−8,0 [−9,2 ; −6,8]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Produit de : bénéficiaires (1 400 000) ; écart mensuel (€) (de 401 à 658, valeur la plus probable 530) ; part à taux plein (de 80 % à 100 %, valeur la plus probable 90 %). Calendrier : part du régime atteinte de 2028 à 2032 : 50 %, 75 %, 100 %, 100 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** 1,40 M de bénéficiaires x écart mensuel entre le niveau visé et l'AAH x 12 x part qui reçoit l'allocation à taux plein. Écart : SMIC net de 1 443 € moins AAH de 1 042 € (avril 2026) = 401 €, jusqu'à 1 700 € (SMIC revalorisé de LFI) moins 1 042 € = 658 €.
- **Modèle utilisé.** Coût unitaire × quantité : `moteur.evaluer_mesure` (produit des facteurs).
- **La même famille ailleurs.** Les Républicains (plan Retailleau) : [LR14](./detail-lr.md#lr14) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) — notre système : [M-GT](./detail-langagement.md#m-gt), [M-PL](./detail-langagement.md#m-pl), [M-DET](./detail-langagement.md#m-det), [M-RESID](./detail-langagement.md#m-resid) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Prestations et minima sociaux »](./memes-modeles.md#f-prestations).
- **Fiabilité.** Coût unitaire × quantité, sourcés quand c'est possible. Cotes des sources de la ligne : A.

#### D20 · Garantie d'emploi (chômeurs de longue durée, au moins au SMIC revalorisé), nette des allocations évitées {#d20}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Garantie d'emploi pour les chômeurs de longue durée. Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1), P3 ch1. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−10,9 [−17,3 ; −6,8]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Produit de : emplois (de 500 000 à 1 500 000, valeur la plus probable 700 000) ; coût net par emploi (€ par an) (de 6 000 à 20 000, valeur la plus probable 12 000). Calendrier : part du régime atteinte de 2028 à 2032 : 20 %, 50 %, 80 %, 100 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Nombre d'emplois créés x coût net par emploi (coût employeur au SMIC moins allocations évitées, cotisations et impôts retournés). Haut du nombre : toutes les personnes inscrites depuis un an ou plus en catégories A, B, C (2,39 M au 4e trimestre 2024, Insee) ne sont pas visées ; 1,5 M est notre borne haute (hypothèse). Coût net : hypothèse, à calculer avec OpenFisca (non fait).
- **Modèle utilisé.** Coût unitaire × quantité : `moteur.evaluer_mesure` (produit des facteurs).
- **La même famille ailleurs.** Les Républicains (plan Retailleau) : [LR14](./detail-lr.md#lr14) (annonce plafonnée, médiane jugée réalisable à 27 % de l'annonce) — notre système : [M-GT](./detail-langagement.md#m-gt), [M-PL](./detail-langagement.md#m-pl), [M-DET](./detail-langagement.md#m-det), [M-RESID](./detail-langagement.md#m-resid) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Prestations et minima sociaux »](./memes-modeles.md#f-prestations).
- **Fiabilité.** Coût unitaire × quantité, sourcés quand c'est possible. Une partie de la ligne est encore « grossière ». Cotes des sources de la ligne : A, D.
- **Choix posés par l'IA.** H-GROSSIER-D20 : Coût net par emploi : sans source.

### Santé et dépendance

#### D07 · « 100 % Sécu » : soins pris en charge à 100 %, fin des franchises, arrêts maladie à 100 % sans carence {#d07}

- **La mesure, dans les mots du programme.** « 100 % Sécu », fin des franchises, arrêt maladie à 100 % sans carence. Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1), P3 ch1. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−30,4 [−35,7 ; −25,3]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 21,2 à 40, valeur la plus probable 30 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 40 %, 60 %, 80 %, 100 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Non chiffré par LFI. Bas : même mesure que dans notre système (21,2 Md€, décomposition des prélèvements) ; haut : plus les indemnités journalières (12,1 Md€ aujourd'hui) à 100 % et la hausse de recours. Central = milieu du support (30).
- **Modèle utilisé.** Aucun : fourchette propre à la ligne (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (annonce plafonnée, médiane jugée réalisable à 24 % de l'annonce) ; [RN H03](./detail-rn.md#h03) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) ; [RN H06](./detail-rn.md#h06) (annonce plafonnée, médiane jugée réalisable à 45 % de l'annonce) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS06](./detail-ps.md#ps06) (annonce plafonnée, médiane jugée réalisable à 38 % de l'annonce) ; [PS12](./detail-ps.md#ps12) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-GA](./detail-langagement.md#m-ga), [M-SECU](./detail-langagement.md#m-secu) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** Pas de modèle : fourchette propre à la ligne. Cotes des sources de la ligne : B.
- **Choix posés par l'IA.** le poids 0,6 sur le facteur commun « coût ».

#### D08 · Hôpital et soin : recrutements, revalorisations {#d08}

- **La mesure, dans les mots du programme.** « plan de recrutement, revalorisation des soins » (document budgétaire : 3 Md€ la 1re année). Source : [livre du programme](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4), P4 ch4. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 3 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−7,5 [−10,0 ; −5,0]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 3 à 12, valeur la plus probable 7,5 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 40 %, 55 %, 70 %, 85 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : l'ordre de grandeur du Ségur de la santé (environ 12 Md€ par an en 2022 selon la presse ; 7,2 Md€ d'aides versées aux établissements cumulées en 2022 selon la Cour des comptes). Central : milieu.
- **Modèle utilisé.** Aucun : fourchette propre à la ligne (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (annonce plafonnée, médiane jugée réalisable à 24 % de l'annonce) ; [RN H03](./detail-rn.md#h03) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) ; [RN H06](./detail-rn.md#h06) (annonce plafonnée, médiane jugée réalisable à 45 % de l'annonce) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS06](./detail-ps.md#ps06) (annonce plafonnée, médiane jugée réalisable à 38 % de l'annonce) ; [PS12](./detail-ps.md#ps12) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-GA](./detail-langagement.md#m-ga), [M-SECU](./detail-langagement.md#m-secu) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** Pas de modèle : fourchette propre à la ligne. Cotes des sources de la ligne : C.
- **Choix posés par l'IA.** le poids 0,6 sur le facteur commun « coût ».

#### D18 · Dépendance : 10 000 places publiques par an pendant 5 ans, domicile en Sécu, statut d'aidant {#d18}

- **La mesure, dans les mots du programme.** « 10 000 places par an » pendant cinq ans. Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2), P3 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−2,8 [−4,0 ; −1,8]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 1 à 5, valeur la plus probable 2,5 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 20 %, 40 %, 60 %, 80 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Sans source primaire lue ; notre modèle grand-age (modeles/grand-age/) chiffre un autre dispositif.
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (annonce plafonnée, médiane jugée réalisable à 24 % de l'annonce) ; [RN H03](./detail-rn.md#h03) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) ; [RN H06](./detail-rn.md#h06) (annonce plafonnée, médiane jugée réalisable à 45 % de l'annonce) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS06](./detail-ps.md#ps06) (annonce plafonnée, médiane jugée réalisable à 38 % de l'annonce) ; [PS12](./detail-ps.md#ps12) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-GA](./detail-langagement.md#m-ga), [M-SECU](./detail-langagement.md#m-secu) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-GROSSIER-D18 : Ordre de grandeur sans source ; le poids 0,6 sur le facteur commun « coût ».

#### D24 · Centres de santé publics, pôle public du médicament, psychologues remboursés {#d24}

- **La mesure, dans les mots du programme.** « centres de santé publics », « pôle public du médicament ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4), P4 ch4. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−5,5 [−8,1 ; −3,5]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 2 à 10, valeur la plus probable 5 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 20 %, 40 %, 60 %, 80 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Sans source lue.
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D04](./detail-rn.md#d04) (montant du parti, 0,9 à 1,6 fois) ; [RN H01](./detail-rn.md#h01) (annonce plafonnée, médiane jugée réalisable à 24 % de l'annonce) ; [RN H03](./detail-rn.md#h03) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) ; [RN H06](./detail-rn.md#h06) (annonce plafonnée, médiane jugée réalisable à 45 % de l'annonce) — Les Républicains (plan Retailleau) : [LR15](./detail-lr.md#lr15) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS06](./detail-ps.md#ps06) (annonce plafonnée, médiane jugée réalisable à 38 % de l'annonce) ; [PS12](./detail-ps.md#ps12) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-GA](./detail-langagement.md#m-ga), [M-SECU](./detail-langagement.md#m-secu) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Santé et dépendance »](./memes-modeles.md#f-sante).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-GROSSIER-D24 : Ordre de grandeur sans source ; le poids 0,6 sur le facteur commun « coût ».

### TVA, énergie et prix

#### C01 · Blocage du prix des carburants à 1,70 € le litre (avec encadrement des marges des raffineurs) {#c01}

- **La mesure, dans les mots du programme.** « Bloquer et encadrer les prix des produits de première nécessité (alimentation, énergie, carburant) » ; 1,70 € le litre : plan d'urgence énergie de mars 2026 et conférence de presse du 23/09/2026 (hors du livre). Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2), P2 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−4,1 [−12,5 ; 0,0]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : écart du prix de marché au plafond (€ par litre) : 0,3 [0,1 ; 0,5] ; part supportée par les marges (privé) : 5,2 [2,4 ; 8,8] ; part à la charge du budget : 3,9 [0,0 ; 12,3] ; coût total : 9,9 [3,1 ; 18,9] ; volume plafonné (milliards de litres) : 38,4 [25,8 ; 46,2].
- **Comment nous l'évaluons.** Coût = volume × (prix de marché − plafond − marge absorbée par les distributeurs), l'État compensant le reste. Plafond (€ par litre) : 1,7 ; prix de marché (€ par litre) : de 1,65 à 2,35, valeur la plus probable 1,95 ; volume (milliards de litres) : de 45 à 48,5, valeur la plus probable 47,5 ; marge absorbable (€ par litre) : de 0,05 à 0,3, valeur la plus probable 0,15. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Le chiffre de 1,70 € n'est pas dans le livre mais dans le plan d'urgence énergie de mars 2026 et la conférence de presse du 23/09/2026 (Public Sénat) : plafond au litre vendu, pour l'essence (le gazole n'est pas précisé ; Manon Aubry a parlé des deux). Lecture centrale : essence et gazole. Bas : essence seule (33 % des volumes routiers en 2025). Coût = volume x (prix de marché − 1,70 € − marge absorbée par les raffineurs et distributeurs), si l'État compense le reste pour maintenir l'approvisionnement, comme la remise de 2022 (hypothèse : sans compensation, un prix administré sous le prix d'import ferait disparaître l'offre). Le prix de marché de 2028 à 2032 est un scénario sans source (de 1,65 € à 2,35 € TTC par litre, euros de 2025) : relevés de la DGEC au 02/10/2026 : 2,14 € pour le SP95-E10 et 2,36 € pour le gazole, après le choc de la guerre au Moyen-Orient ; avant le choc le prix était proche de 1,70 €. La demande réagit au prix plafonné. Qui paie : le texte du programme annonce un plafond et un encadrement des marges (donc des acteurs privés : raffineurs, distributeurs), sans TICPE réduite ni subvention ; la marge absorbable est bornée (de 0,05 à 0,30 € par litre) et l'excédent retombe sur le budget. Les taxes (TICPE, TVA) ne sont pas touchées dans cette lecture. Coût privé (marges comprimées) affiché à part dans resultats.md.
- **Modèle utilisé.** Levier carburants : volume, prix, marges : `leviers2.levier_carburant`.
- **La même famille ailleurs.** Rassemblement national : [RN T01](./detail-rn.md#t01) (fourchette propre à la ligne) ; [RN T02](./detail-rn.md#t02) (montant du parti, 0,9 à 1,7 fois) ; [RN T05](./detail-rn.md#t05) (montant du parti, 0,95 à 1,15 fois) ; [RN G01](./detail-rn.md#g01) (annonce plafonnée, médiane jugée réalisable à 9 % de l'annonce) — notre système : [M-TVA](./detail-langagement.md#m-tva), [M-RESTO](./detail-langagement.md#m-resto), [M-FO](./detail-langagement.md#m-fo), [M-FIOUL](./detail-langagement.md#m-fioul) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « TVA, énergie et prix »](./memes-modeles.md#f-tva).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : B, C, D. 3 points marqués ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-CARB-4 : Prix de marché 2028-2032, marge absorbable (0,05 à 0,30 €/l), élasticité-prix de la demande (0,05 à 0,30 en valeur absolue) : hypothèses sans source primaire ⚠️ À VÉRIFIER (CPDP, CGDD).

### Emplois et rémunérations publics

#### D01 · Point d'indice +10 % (compensation des collectivités) {#d01}

- **La mesure, dans les mots du programme.** « point d'indice +10 % » (document budgétaire : 17 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2), P2 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 17 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−19,8 [−20,3 ; −19,1]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 18,5 à 20,7, valeur la plus probable 20 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 86 %, 89 %, 93 %, 96 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** +10 % de la valeur du point pour les trois versants de la fonction publique ; coût d'un point = 2,0 Md€ (notre modèle, HDS17, défense exclue), de 1,85 à 2,07 selon la presse spécialisée.
- **Modèle utilisé.** Aucun : fourchette propre à la ligne (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Les Républicains (plan Retailleau) : [LR01](./detail-lr.md#lr01) (annonce plafonnée, médiane jugée réalisable à 48 % de l'annonce) ; [LR02](./detail-lr.md#lr02) (annonce plafonnée, médiane jugée réalisable à 30 % de l'annonce) ; [LR06](./detail-lr.md#lr06) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) — notre système : [M-M1](./detail-langagement.md#m-m1), [M-M3](./detail-langagement.md#m-m3) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Emplois et rémunérations publics »](./memes-modeles.md#f-effectifs).
- **Fiabilité.** Pas de modèle : fourchette propre à la ligne. Cotes des sources de la ligne : C.
- **Choix posés par l'IA.** le poids 0,3 sur le facteur commun « coût ».

#### D09 · Éducation : postes supplémentaires (23 à 19 élèves par classe) {#d09}

- **La mesure, dans les mots du programme.** « effectifs par classe sous 19 » (document budgétaire : 10 000 postes, 0,5 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2), P4 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 0,5 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−6,4 [−8,2 ; −5,1]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Produit de : postes (de 75 000 à 157 000, valeur la plus probable 100 000) ; coût d'un poste (€ par an) (de 50 000 à 70 000, valeur la plus probable 58 000). Calendrier : part du régime atteinte de 2028 à 2032 : 10 %, 30 %, 60 %, 85 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Passer de 23 à 19 élèves par classe = +21 % de classes. Bas : premier degré seul (48 % des 747 400 enseignants du public, soit 359 000 x 21 % = 75 000 postes) ; haut : tous les degrés (157 000) ; central : 100 000. Coût par poste : 50 000 € (LFI) à 70 000 € (coût complet avec encadrement et locaux, hypothèse).
- **Modèle utilisé.** Coût unitaire × quantité : `moteur.evaluer_mesure` (produit des facteurs).
- **La même famille ailleurs.** Les Républicains (plan Retailleau) : [LR01](./detail-lr.md#lr01) (annonce plafonnée, médiane jugée réalisable à 48 % de l'annonce) ; [LR02](./detail-lr.md#lr02) (annonce plafonnée, médiane jugée réalisable à 30 % de l'annonce) ; [LR06](./detail-lr.md#lr06) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) — notre système : [M-M1](./detail-langagement.md#m-m1), [M-M3](./detail-langagement.md#m-m3) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Emplois et rémunérations publics »](./memes-modeles.md#f-effectifs).
- **Fiabilité.** Coût unitaire × quantité, sourcés quand c'est possible. Cotes des sources de la ligne : A, D.

#### D21 · Sixième semaine de congés payés (part employeur public) {#d21}

- **La mesure, dans les mots du programme.** « 6e semaine de congés ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1), P3 ch1. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−3,9 [−6,1 ; −1,8]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Produit de : masse salariale publique (Md€) (370) ; une semaine sur les semaines travaillées (0,021) ; part des heures remplacées (de 0 % à 100 %, valeur la plus probable 50 %). Calendrier : part du régime atteinte de 2028 à 2032 : 50 %, 100 %, 100 %, 100 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Masse salariale publique (370 Md€, modèle) x une semaine sur 47 travaillées x part des heures remplacées (0 à 100 %). Le coût pour les employeurs privés est un coût privé, non compté.
- **Modèle utilisé.** Coût unitaire × quantité : `moteur.evaluer_mesure` (produit des facteurs).
- **La même famille ailleurs.** Les Républicains (plan Retailleau) : [LR01](./detail-lr.md#lr01) (annonce plafonnée, médiane jugée réalisable à 48 % de l'annonce) ; [LR02](./detail-lr.md#lr02) (annonce plafonnée, médiane jugée réalisable à 30 % de l'annonce) ; [LR06](./detail-lr.md#lr06) (annonce plafonnée, médiane jugée réalisable à 33 % de l'annonce) — notre système : [M-M1](./detail-langagement.md#m-m1), [M-M3](./detail-langagement.md#m-m3) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Emplois et rémunérations publics »](./memes-modeles.md#f-effectifs).
- **Fiabilité.** Coût unitaire × quantité, sourcés quand c'est possible. Cotes des sources de la ligne : A.

### Collectivités

#### D23 · Collectivités : DGF indexée, taxe d'habitation progressive, moratoires de fermeture, services itinérants, outre-mer {#d23}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Moratoires de fermeture de services publics. Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P5 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−3,8 [−6,1 ; −2,2]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 1 à 8, valeur la plus probable 3 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 20 %, 40 %, 60 %, 80 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Sans source lue.
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN A04](./detail-rn.md#a04) (annonce plafonnée, médiane jugée réalisable à 7 % de l'annonce) ; [RN K01](./detail-rn.md#k01) (annonce plafonnée, médiane jugée réalisable à 29 % de l'annonce) ; [RN K02](./detail-rn.md#k02) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) — Les Républicains (plan Retailleau) : [LR05](./detail-lr.md#lr05) (annonce plafonnée, médiane jugée réalisable à 25 % de l'annonce) ; [LR18](./detail-lr.md#lr18) (annonce plafonnée, médiane jugée réalisable à 30 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Collectivités »](./memes-modeles.md#f-collectivites).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-GROSSIER-D23 : Ordre de grandeur sans source ; le poids 0,6 sur le facteur commun « coût ».

### Services publics et dépenses nouvelles

#### D10 · Cantine scolaire gratuite {#d10}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Gratuité de la cantine (document budgétaire : 3,6 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2), P4 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 3,6 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−3,8 [−4,3 ; −3,5]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Le montant de LFI (3,6 Md€) est la valeur la plus probable ; fourchette de 0,9 à 1,3 fois, asymétrique parce que les coûts publics dérivent plus souvent à la hausse (convention, sans source). Calendrier : part du régime atteinte de 2028 à 2032 : 95 %, 96 %, 97 %, 99 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Modèle utilisé.** Aucun : montant de LFI, 0,9 à 1,3 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Pas de modèle : montant de LFI, repris avec une fourchette. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,6 sur le facteur commun « coût ».

#### D11 · Université : gratuité, 250 000 places, Crous, immobilier {#d11}

- **La mesure, dans les mots du programme.** « gratuité de l'enseignement supérieur » (document budgétaire : 3,5 Md€ la 1re année). Source : [livre du programme](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2), P4 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 3,5 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−5,4 [−6,8 ; −4,3]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 3,5 à 8, valeur la plus probable 5 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 65 %, 74 %, 82 %, 91 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Bas : montant de LFI ; haut sans source primaire lue (⚠️ V31007).
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** le poids 0,6 sur le facteur commun « coût ».

#### D12 · Violences sexistes et sexuelles (2,6) et violences faites aux enfants (2) {#d12}

- **La mesure, dans les mots du programme.** « 3 milliards de budget demandés par les associations ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre3), P3 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 4,6 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−4,9 [−5,5 ; −4,4]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Le montant de LFI (4,6 Md€) est la valeur la plus probable ; fourchette de 0,9 à 1,3 fois, asymétrique parce que les coûts publics dérivent plus souvent à la hausse (convention, sans source). Calendrier : part du régime atteinte de 2028 à 2032 : 95 %, 96 %, 97 %, 99 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Modèle utilisé.** Aucun : montant de LFI, 0,9 à 1,3 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Pas de modèle : montant de LFI, repris avec une fourchette. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,6 sur le facteur commun « coût ».

#### D13 · Rattrapage des budgets 2026, indexés sur l'inflation (travail, culture, sport, diplomatie, aide au développement) {#d13}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Rattrapage des budgets (document budgétaire : 7 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 7 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−7,4 [−8,3 ; −6,8]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Le montant de LFI (7 Md€) est la valeur la plus probable ; fourchette de 0,9 à 1,3 fois, asymétrique parce que les coûts publics dérivent plus souvent à la hausse (convention, sans source). Calendrier : part du régime atteinte de 2028 à 2032 : 95 %, 96 %, 97 %, 99 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Modèle utilisé.** Aucun : montant de LFI, 0,9 à 1,3 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Pas de modèle : montant de LFI, repris avec une fourchette. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,6 sur le facteur commun « coût ».

#### D17a · Petite enfance : 500 000 places d'accueil {#d17a}

- **La mesure, dans les mots du programme.** « 500 000 places » d'accueil. Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre3), P3 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−8,3 [−9,1 ; −7,6]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Produit de : places (500 000) ; coût public par place (€ par an) (de 14 000 à 19 450, valeur la plus probable 16 500). Calendrier : part du régime atteinte de 2028 à 2032 : 10 %, 30 %, 50 %, 75 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** 500 000 places x coût public par place : 14 000 € (6,6 Md€ publics pour 470 000 places de crèche) à 19 450 € (coût moyen par place).
- **Modèle utilisé.** Coût unitaire × quantité : `moteur.evaluer_mesure` (produit des facteurs).
- **La même famille ailleurs.** Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Coût unitaire × quantité, sourcés quand c'est possible. Cotes des sources de la ligne : C.

#### D17b · Gratuité des crèches publiques (perte des participations familiales) {#d17b}

- **La mesure, dans les mots du programme.** « gratuité des crèches publiques ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre3), P3 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−1,6 [−2,4 ; −1,0]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 0,5 à 3, valeur la plus probable 1,5 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 20 %, 40 %, 60 %, 80 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Participations des familles aux crèches publiques : ordre de grandeur sans source lue.
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-GROSSIER-D17b : Sans source ; le poids 0,3 sur le facteur commun « coût ».

#### D22 · Gratuité de l'école hors cantine, repas Crous à 1 €, culture à 1 % du PIB, sport {#d22}

- **La mesure, dans les mots du programme.** Culture « à 1 % du produit intérieur brut (PIB) par an ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre3), P4 ch2/ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−7,6 [−12,3 ; −4,3]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 2 à 16, valeur la plus probable 6 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 20 %, 40 %, 60 %, 80 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Culture à 1 % du PIB : écart au niveau actuel (non lu) ; le reste sans source.
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-GROSSIER-D22 : Ordre de grandeur sans source (⚠️ V31007) ; le poids 0,6 sur le facteur commun « coût ».

#### D25 · Service citoyen de neuf mois rémunéré au SMIC {#d25}

- **La mesure, dans les mots du programme.** « service citoyen de neuf mois ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2), P4 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−6,8 [−11,0 ; −3,8]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Produit de : jeunes (de 100 000 à 800 000, valeur la plus probable 300 000) ; mois (9) ; coût mensuel (€) (de 1 400 à 2 500, valeur la plus probable 2 000). Calendrier : part du régime atteinte de 2028 à 2032 : 20 %, 40 %, 60 %, 80 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Le texte ne dit pas si le service est obligatoire. Bas : 100 000 volontaires ; haut : toute une classe d'âge (environ 800 000) ; coût mensuel : SMIC net à coût employeur (1 400 à 2 500 €), hypothèse.
- **Modèle utilisé.** Coût unitaire × quantité : `moteur.evaluer_mesure` (produit des facteurs).
- **La même famille ailleurs.** Rassemblement national : [RN D05](./detail-rn.md#d05) (montant du parti, 0,9 à 1,5 fois) — PS et Place publique (contre-budget 2027) : [PS13](./detail-ps.md#ps13), [PS14](./detail-ps.md#ps14), [PS15](./detail-ps.md#ps15) (montant du parti, 0,95 à 1,15 fois) — notre système : [M-OM](./detail-langagement.md#m-om), [M-08](./detail-langagement.md#m-08), [M-GRAT](./detail-langagement.md#m-grat) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Services publics et dépenses nouvelles »](./memes-modeles.md#f-services).
- **Fiabilité.** Coût unitaire × quantité, sourcés quand c'est possible. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-SERVICE : Taille d'une classe d'âge : environ 800 000 ; coût mensuel : hypothèse.

### Logement et transition écologique

#### D03 · Logements d'urgence, réquisition {#d03}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Mesure de mise à l'abri (document budgétaire : 3 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2), P3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 3 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−3,2 [−3,6 ; −2,9]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Le montant de LFI (3 Md€) est la valeur la plus probable ; fourchette de 0,9 à 1,3 fois, asymétrique parce que les coûts publics dérivent plus souvent à la hausse (convention, sans source). Calendrier : part du régime atteinte de 2028 à 2032 : 95 %, 96 %, 97 %, 99 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Modèle utilisé.** Aucun : montant de LFI, 0,9 à 1,3 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN G05](./detail-rn.md#g05) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS11](./detail-ps.md#ps11) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Logement et transition écologique »](./memes-modeles.md#f-logement).
- **Fiabilité.** Pas de modèle : montant de LFI, repris avec une fourchette. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** la largeur de la fourchette autour du montant du parti ; le poids 0,6 sur le facteur commun « coût ».

#### D14 · Planification écologique (État) : rénovation de 700 000 logements par an, bâtiments publics, sécurité civile {#d14}

- **La mesure, dans les mots du programme.** « Refaire l'isolation d'au moins 700 000 logements par an ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3), P1. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 10 Md€ la première année (coût, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **−24,4 [−31,4 ; −16,6]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 10 à 37, valeur la plus probable 25 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 41 %, 56 %, 71 %, 85 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Bas : 10 Md€ (document de LFI) ; haut : 37 Md€ (Pisani-Ferry et Mahfouz, cité par LFI, besoin public de la transition) ; central : milieu.
- **Modèle utilisé.** Aucun : fourchette propre à la ligne (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN G05](./detail-rn.md#g05) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS11](./detail-ps.md#ps11) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Logement et transition écologique »](./memes-modeles.md#f-logement).
- **Fiabilité.** Pas de modèle : fourchette propre à la ligne. Cotes des sources de la ligne : B.
- **Choix posés par l'IA.** le poids 0,6 sur le facteur commun « coût ».

#### D16 · Logement public : 200 000 par an (environ la moitié aujourd'hui) + 30 000 logements jeunes {#d16}

- **La mesure, dans les mots du programme.** « 200 000 logements publics par an ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P3 ch2/P5 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−4,5 [−6,5 ; −3,1]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 2 à 8, valeur la plus probable 4 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 20 %, 40 %, 60 %, 80 %, 100 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Aide à la pierre par logement x 100 000 logements en plus par an, sans source lue.
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN G05](./detail-rn.md#g05) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS11](./detail-ps.md#ps11) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Logement et transition écologique »](./memes-modeles.md#f-logement).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-GROSSIER-D16 : Ordre de grandeur sans source primaire (⚠️ V31007) ; le poids 0,6 sur le facteur commun « coût ».

### Fraude

#### R12 · Lutte contre la fraude fiscale (reconstruction des effectifs) {#r12}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Reconstruction des effectifs de contrôle (document budgétaire : 2 Md€). Source : [livre du programme](https://melenchon2027.fr/programme/livre/), P2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** 2 Md€ la première année (recette ou économie, document budgétaire de LFI du 14/10/2026) ; pas de montant de régime publié.
- **Notre estimation.** **1,4 [1,0 ; 1,7]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Haut : le montant de LFI (2 Md€) ; bas : 35 % de ce montant, pour l'érosion de l'assiette, faute de chiffre indépendant (convention, sans source) ; valeur la plus probable : 1,4. Calendrier : plein effet dès 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Haut : LFI ; bas : 35 %. L'Institut Montaigne (2022) écartait les 26 Md€ annoncés alors.
- **Modèle utilisé.** Aucun : recette de LFI ramenée entre 35 % et 100 % (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN F05](./detail-rn.md#f05) (annonce plafonnée, médiane jugée réalisable à 11 % de l'annonce) ; [RN F06](./detail-rn.md#f06) (annonce plafonnée, médiane jugée réalisable à 8 % de l'annonce) ; [RN H02](./detail-rn.md#h02) (annonce plafonnée, médiane jugée réalisable à 16 % de l'annonce) — Les Républicains (plan Retailleau) : [LR17](./detail-lr.md#lr17) (annonce plafonnée, médiane jugée réalisable à 20 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS08a](./detail-ps.md#ps08a) (annonce plafonnée, médiane jugée réalisable à 42 % de l'annonce) ; [PS08b](./detail-ps.md#ps08b) (annonce plafonnée, médiane jugée réalisable à 36 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Fraude »](./memes-modeles.md#f-fraude).
- **Fiabilité.** Pas de modèle : montant de LFI, ramené par une convention. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-DECOTE : 35 % sans recoupement ; la borne basse à une fraction fixe du montant de LFI ; le poids 0,5 sur le facteur commun « comportement ».

### Participations publiques et nationalisations

#### D15 · Pôle public bancaire : 100 Md€ par an investis ; part supportée par l'État {#d15}

- **La mesure, résumée par nous (pas de citation exacte relevée).** Pôle public bancaire, 100 Md€ par an (document budgétaire : hors déficit). Source : [livre du programme](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre1), P2 ch1/ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−7,7 [−14,5 ; −3,2]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Fourchette retenue : de 0 à 20, valeur la plus probable 5 Md€ (voir la lecture ci-dessous). Calendrier : part du régime atteinte de 2028 à 2032 : 0 %, 25 %, 50 %, 75 %, 100 % (la première année reprend le montant inscrit par le parti, puis montée en ligne droite).
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** LFI : aucun effet au déficit. Hypothèse : l'État supporte de 0 % à 20 % des 100 Md€ (subvention implicite, reclassement en administrations publiques). Classement comptable Eurostat non lu (V31010).
- **Modèle utilisé.** Aucun : ordre de grandeur sans source primaire, dit « grossier » (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** Rassemblement national : [RN G02](./detail-rn.md#g02) (annonce plafonnée, médiane jugée réalisable à 14 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Participations publiques et nationalisations »](./memes-modeles.md#f-participations).
- **Fiabilité.** « Encore grossier » : ordre de grandeur sans source primaire lue. Cotes des sources de la ligne : D.
- **Choix posés par l'IA.** H-GROSSIER-D15 : Part supportée par l'État : sans source ; le poids 0,6 sur le facteur commun « coût ».

#### N01 · Renationaliser la SNCF (la SA SNCF est déjà détenue à 100 % par l'État) {#n01}

- **La mesure, dans les mots du programme.** « Renationaliser la Société nationale des chemins de fer français (SNCF) ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3), P1 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **0,0** Md€ par an en 2032 : pratiquement nul en médiane.
  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : flux annuel (Md€, solde) : 0,0 ; prix payé (Md€, une fois : dette) : 1,0 [0,4 ; 2,2] ; transfert en capital (Md€, déficit) : 0,0.
- **Comment nous l'évaluons.** Le prix payé est une opération financière : il augmente la dette, pas le déficit. Le solde reçoit le rendement (dividendes ou résultat) et, s'il y en a, les pertes reprises et la part cédée gratuitement. Paramètres : prix payé (Md€) : de 0 à 3, valeur la plus probable 0,5 ; rendement annuel (part du prix) : 0 % ; flux annuel repris (Md€) : 0. Calendrier : plein effet dès 2028 ; prix payé de 2028 à 2032 : 50 %, 50 %, 0 %, 0 %, 0 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Le groupe public ferroviaire SNCF est détenu par l'État (SA SNCF, capital 100 % public) : l'acquisition de capital est nulle ; la mesure vise le statut et l'ouverture à la concurrence (le quatrième paquet ferroviaire de l'UE l'interdit : contrainte de droit européen, hors budget). Prix : de 0 à 3 Md€ pour d'éventuels rachats d'actifs et d'indemnités (Fret SNCF liquidé, filiales), sans source, ⚠️ À VÉRIFIER.
- **Modèle utilisé.** Levier nationalisations : prix, dette, dividendes : `leviers2.levier_nationalisation`.
- **La même famille ailleurs.** Rassemblement national : [RN G02](./detail-rn.md#g02) (annonce plafonnée, médiane jugée réalisable à 14 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Participations publiques et nationalisations »](./memes-modeles.md#f-participations).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : D. 2 points marqués ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-NAT-SNCF : Capital de la SA SNCF détenu à 100 % par l'État (code des transports) ; prix de rachat d'actifs annexes : hypothèse.

#### N02 · Renationaliser les autoroutes (concessions de Vinci, Eiffage, Abertis) en revenant sur les hausses de prix passées {#n02}

- **La mesure, dans les mots du programme.** « Renationaliser les autoroutes en revenant sur les hausses de prix passées ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3), P1 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **4,7 [3,5 ; 6,1]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : flux annuel (Md€, solde) : 4,8 [3,6 ; 6,1] ; prix payé (Md€, une fois : dette) : 40,2 [31,7 ; 48,6] ; transfert en capital (Md€, déficit) : 0,0.
- **Comment nous l'évaluons.** Le prix payé est une opération financière : il augmente la dette, pas le déficit. Le solde reçoit le rendement (dividendes ou résultat) et, s'il y en a, les pertes reprises et la part cédée gratuitement. Paramètres : prix payé (Md€) : de 25 à 55, valeur la plus probable 40 ; rendement annuel (part du prix) : de 8 % à 16 %, valeur la plus probable 12 % ; flux annuel repris (Md€) : 0. Calendrier : part du régime atteinte de 2028 à 2032 : 50 %, 100 %, 100 %, 100 %, 100 % ; le flux s'arrête après 2035 ; prix payé de 2028 à 2032 : 30 %, 40 %, 30 %, 0 %, 0 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Rachat anticipé des concessions : le Sénat (commission d'enquête de 2020) cite 45 à 50 Md€ (estimation de Bercy) ; comme les concessions s'achèvent entre 2031 et 2036 et que le rachat intervient en 2028-2030, la valeur résiduelle est plus faible : de 25 à 55 Md€ (central 40), hypothèse. Indemnisation à la valeur due (article 17 de la Déclaration de 1789, premier protocole additionnel de la CEDH) : le prix est celui de l'indemnité. Opération financière : emprunt, dette, pas de déficit (les concessionnaires sont hors administrations publiques ; ⚠️ reclassement possible dans les APU si les péages sont fixés par l'État). Flux : résultat net des sociétés repris par l'État, de 8 à 16 % du prix par an jusqu'en 2035, date moyenne de fin des concessions, puis plus rien (le prix est consommé). « Revenir sur les hausses de prix passées » baisserait ce flux : couvert par la borne basse.
- **Modèle utilisé.** Levier nationalisations : prix, dette, dividendes : `leviers2.levier_nationalisation`.
- **La même famille ailleurs.** Rassemblement national : [RN G02](./detail-rn.md#g02) (annonce plafonnée, médiane jugée réalisable à 14 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Participations publiques et nationalisations »](./memes-modeles.md#f-participations).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : B, D. 3 points marqués ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-NAT-ASF2 : Valeur résiduelle et rendement sur la période restante : hypothèses ; fin moyenne des concessions : 2035.

#### N03 · Renationaliser les « aéroports stratégiques » (dont Aéroports de Paris) {#n03}

- **La mesure, dans les mots du programme.** « ainsi que les aéroports stratégiques ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3), P1 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **0,3 [0,2 ; 0,4]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : flux annuel (Md€, solde) : 0,3 [0,2 ; 0,4] ; prix payé (Md€, une fois : dette) : 10,0 [8,7 ; 11,6] ; transfert en capital (Md€, déficit) : 0,0.
- **Comment nous l'évaluons.** Le prix payé est une opération financière : il augmente la dette, pas le déficit. Le solde reçoit le rendement (dividendes ou résultat) et, s'il y en a, les pertes reprises et la part cédée gratuitement. Paramètres : capitalisation (Md€) : de 10,2 à 11,4, valeur la plus probable 10,8 ; part rachetée : 49,4 % ; prime d'offre : de 15 % à 40 %, valeur la plus probable 25 % ; autres actifs (Md€) : de 1 à 6, valeur la plus probable 3 ; rendement annuel (part du prix) : de 2 % à 4,5 %, valeur la plus probable 3 % ; flux annuel repris (Md€) : 0. Calendrier : part du régime atteinte de 2028 à 2032 : 50 %, 100 %, 100 %, 100 %, 100 % ; prix payé de 2028 à 2032 : 50 %, 50 %, 0 %, 0 %, 0 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** La liste des aéroports n'est pas donnée. Lecture : Aéroports de Paris (capitalisation de 10,2 à 11,4 Md€ en 2026 ; l'État détiendrait environ 50,6 %, donc 49,4 % à racheter avec une prime d'offre de 15 à 40 %) plus quelques aéroports régionaux dont les concessions sont privées (Nice, Lyon, Toulouse, etc.) : de 1 à 6 Md€, sans source. Rendement : dividende de 2 à 4,5 % du prix. Opération financière (titres cotés, hors APU).
- **Modèle utilisé.** Levier nationalisations : prix, dette, dividendes : `leviers2.levier_nationalisation`.
- **La même famille ailleurs.** Rassemblement national : [RN G02](./detail-rn.md#g02) (annonce plafonnée, médiane jugée réalisable à 14 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Participations publiques et nationalisations »](./memes-modeles.md#f-participations).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : C, D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-NAT-AERO : Aéroports régionaux concédés : de 1 à 6 Md€ : hypothèse.

#### N04 · Renationaliser Engie (pôle public de l'énergie avec EDF et des coopératives locales) {#n04}

- **La mesure, dans les mots du programme.** « créer un pôle public de l'énergie en lien avec des coopératives locales et EDF, et en renationalisant Engie ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3), P1 ch3. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **2,9 [2,4 ; 3,4]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : flux annuel (Md€, solde) : 2,9 [2,4 ; 3,4] ; prix payé (Md€, une fois : dette) : 61,6 [56,6 ; 66,8] ; transfert en capital (Md€, déficit) : 0,0.
- **Comment nous l'évaluons.** Le prix payé est une opération financière : il augmente la dette, pas le déficit. Le solde reçoit le rendement (dividendes ou résultat) et, s'il y en a, les pertes reprises et la part cédée gratuitement. Paramètres : capitalisation (Md€) : de 57,6 à 70,3, valeur la plus probable 66 ; part rachetée : 76,4 % ; prime d'offre : de 10 % à 40 %, valeur la plus probable 25 % ; rendement annuel (part du prix) : de 3,5 % à 6 %, valeur la plus probable 4,6 % ; flux annuel repris (Md€) : 0. Calendrier : part du régime atteinte de 2028 à 2032 : 50 %, 100 %, 100 %, 100 %, 100 % ; prix payé de 2028 à 2032 : 50 %, 50 %, 0 %, 0 %, 0 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Engie est cotée (capitalisation de 57,6 Md€ en janvier 2026 à 70,3 Md€ en avril 2026, environ 66 Md€ au central) ; l'État en détiendrait 23,6 % (⚠️ non confirmé), il faut donc racheter 76,4 % avec une prime d'offre de 10 à 40 % : environ 63 Md€ au central. Opération financière (acquisition de titres) : elle augmente la dette (de 2 points de PIB environ) mais pas le déficit ; les dividendes (environ 5,5 % de la capitalisation, soit 4,6 % du prix payé) améliorent le solde, tandis que l'emprunt coûte 3,45 % : portage positif au central. La dette propre d'Engie (hors APU) n'est pas consolidée ; elle le serait en cas de reclassement ⚠️. EDF est déjà détenue à 100 % par l'État depuis 2023 : pas de coût. Barrages : « stopper la privatisation » : pas de coût. Engie a un actionnariat international : une offre publique d'achat par l'État suppose l'accord de l'AMF, et le droit de l'UE (libre circulation des capitaux) limite les nationalisations seulement si elles sont discriminatoires.
- **Modèle utilisé.** Levier nationalisations : prix, dette, dividendes : `leviers2.levier_nationalisation`.
- **La même famille ailleurs.** Rassemblement national : [RN G02](./detail-rn.md#g02) (annonce plafonnée, médiane jugée réalisable à 14 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Participations publiques et nationalisations »](./memes-modeles.md#f-participations).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : C, D. 5 points marqués ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-NAT-PRIME : Prime d'offre publique : de 10 à 40 % (central 25 %) : convention de marché sans source ⚠️ ; H-NAT-RENDEMENT : Dividende : de 3,5 à 6 % du prix payé (dividende de l'ordre de 5,5 % de la capitalisation).

#### N05 · Nationaliser ArcelorMittal France {#n05}

- **La mesure, dans les mots du programme.** « notamment en nationalisant ArcelorMittal France ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre2), P1 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **−0,5 [−0,9 ; −0,2]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : flux annuel (Md€, solde) : −0,5 [−0,9 ; −0,2] ; prix payé (Md€, une fois : dette) : 1,6 [0,9 ; 2,4] ; transfert en capital (Md€, déficit) : 0,0.
- **Comment nous l'évaluons.** Le prix payé est une opération financière : il augmente la dette, pas le déficit. Le solde reçoit le rendement (dividendes ou résultat) et, s'il y en a, les pertes reprises et la part cédée gratuitement. Paramètres : prix payé (Md€) : de 0,3 à 3, valeur la plus probable 1,5 ; rendement annuel (part du prix) : 0 % ; flux annuel repris (Md€) : de −1,2 à 0, valeur la plus probable −0,4. Calendrier : part du régime atteinte de 2028 à 2032 : 50 %, 100 %, 100 %, 100 %, 100 % ; prix payé de 2028 à 2032 : 100 %, 0 %, 0 %, 0 %, 0 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Prix : de 0,3 à 3 Md€ ; la proposition de loi de LFI et ses soutiens avancent environ 3 Md€ (cote D) ; la CGT environ 1 Md€ voire moins vu les investissements à engager (cote D) ; les sites visés : Dunkerque, Fos-sur-Mer, Mardyck, Montataire, Desvres, Florange, Mouzon, Basse-Indre, Saint-Chély-d'Apcher, Maizières (environ 15 400 salariés). Flux : pertes d'exploitation et investissements de décarbonation repris par l'État (reprise de pertes : dépense ; de 0 à 1,2 Md€ par an, central 0,4 ; sans source). Opération financière pour le prix, dépense pour les pertes. Le groupe conteste la nationalisation (stratégie d'investissement mise en avant, Le Journal des entreprises) ; le gouvernement de 2025 l'écartait.
- **Modèle utilisé.** Levier nationalisations : prix, dette, dividendes : `leviers2.levier_nationalisation`.
- **La même famille ailleurs.** Rassemblement national : [RN G02](./detail-rn.md#g02) (annonce plafonnée, médiane jugée réalisable à 14 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Participations publiques et nationalisations »](./memes-modeles.md#f-participations).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : C, D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-NAT-AM2 : Pertes d'exploitation reprises : de 0 à 1,2 Md€ par an : hypothèse sans source.

#### N06 · Collectiviser les EHPAD privés à but lucratif et les confier à des associations ou coopératives {#n06}

- **La mesure, dans les mots du programme.** « Collectiviser les EHPAD privés à but lucratif et les confier à des associations, coopératives, etc. ». Source : [livre du programme](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2), P3 ch2. Livre du programme (cote D, auteur = le programme).
- **Annoncé par le parti.** Aucun montant publié par LFI pour cette ligne.
- **Notre estimation.** **0,0** Md€ par an en 2032 : pratiquement nul en médiane.
  Composantes (tirage à part de 2 000 tirages, § 5 bis des résultats ; médiane [centiles 10 ; 90]) : flux annuel (Md€, solde) : 0,0 ; prix payé (Md€, une fois : dette) : 14,7 [9,9 ; 19,7] ; transfert en capital (Md€, déficit) : 6,9 [3,0 ; 12,2].
- **Comment nous l'évaluons.** Le prix payé est une opération financière : il augmente la dette, pas le déficit. Le solde reçoit le rendement (dividendes ou résultat) et, s'il y en a, les pertes reprises et la part cédée gratuitement. Paramètres : prix payé (Md€) : de 6 à 24, valeur la plus probable 14 ; part cédée gratuitement : de 0 % à 100 %, valeur la plus probable 50 % ; rendement annuel (part du prix) : 0 % ; flux annuel repris (Md€) : 0. Calendrier : plein effet dès 2028 ; prix payé de 2028 à 2032 : 30 %, 40 %, 30 %, 0 %, 0 %.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Le texte dit « collectiviser » et « confier », pas « nationaliser » ni « racheter » : aucune indemnité annoncée. Lecture : acquisition (indemnisée : article 17 de 1789) des établissements privés à but lucratif, environ 23 % des 610 000 places d'EHPAD, soit environ 140 000 places, à 40 000 € à 170 000 € la place (immobilier et exploitation ; central 100 000 €), puis transfert à des associations ou coopératives. La part transférée gratuitement (de 0 à 100 %, central 50 %) est un transfert en capital : dépense, donc déficit ; le reste est une opération financière (dette) : cession à la valeur d'acquisition. Le coût de fonctionnement ne change pas (financement par l'assurance maladie et les départements inchangé). Sans source primaire sur la valeur des places.
- **Modèle utilisé.** Levier nationalisations : prix, dette, dividendes : `leviers2.levier_nationalisation`.
- **La même famille ailleurs.** Rassemblement national : [RN G02](./detail-rn.md#g02) (annonce plafonnée, médiane jugée réalisable à 14 % de l'annonce). Ce que le code confirme et ce qui diffère : [note de famille « Participations publiques et nationalisations »](./memes-modeles.md#f-participations).
- **Fiabilité.** Branché sur un modèle du dépôt. Cotes des sources de la ligne : C, D. 2 points marqués ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-NAT-EHPAD2 : Valeur par place : de 40 000 à 170 000 € : hypothèse sans source primaire ⚠️.

---

Page générée par `modeles/banc-programmes/detail.py` à partir de `programmes/lfi/mesures.py` et de `donnees/resultats.json` ; aucun chiffre n'y est tapé à la main. Écrite par Claude (IA d'Anthropic) pour l'auteur ; même banc pour tous, conflit d'intérêts déclaré.
