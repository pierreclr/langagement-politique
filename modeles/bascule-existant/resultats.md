---
titre: Basculer l'existant (montages, stocks et droits acquis) — résultats
tache: T16
statut: brouillon sourcé
consultation: 2026-10-25
---

# Basculer l'existant : résultats

> **À lire d'abord.** Ce sont des **ordres de grandeur, pas des prédictions**, et **pas un avis juridique**. Chaque chiffre vient de [`donnees/`](donnees/) ou du calcul `jsc modele.js test_modele.js` (13 tests au vert). Les hypothèses H1 à H20 sont dans [`methode.md`](methode.md). Les plus fragiles (⚠️) : la part de plus-value latente dans chaque stock (H2), le rythme de réalisation (H3), le stock de démembrements (H10) et les probabilités de censure (H18). Montants en **valeur actualisée sur 30 ans** (VA, taux 3 %), sauf mention « par an ». Pour passer d'une VA à un « équivalent annuel », diviser par ≈ 19,6.

## 1. En une phrase

Le principe de l'auteur (« la date de l'événement fixe le régime ») est **déjà, pour l'essentiel, la règle du droit fiscal français**, et il est juridiquement solide pour la plus grosse masse en jeu : les **transmissions** futures du patrimoine existant. Il devient fragile sur deux points : les **gains acquis sous des régimes liés à une durée de détention** (assurance-vie, PEA, abattements immobiliers, Pinel), que le Conseil constitutionnel protège, et l'**anticipation** entre l'annonce et l'entrée en vigueur, qui peut coûter 30 à 120 Md€ si rien n'est prévu. La transition recommandée coûte ≈ 160 à 510 Md€ en VA par rapport au principe strict (≈ 8 à 26 Md€ par an) ; un maintien général des anciennes règles (« grand-père large ») coûterait 780 à 1 440 Md€ (≈ 40 à 73 Md€ par an) et repousserait la réforme d'une à deux générations.

## 2. Les stocks concernés

| Stock (fin 2024-2025) | Valeur | Plus-value latente (central ⚠️) | Années pour réaliser 90 % du stock (central) |
|---|---|---|---|
| Titres non cotés et holdings (réserves non distribuées) | 1 507 Md€ | 754 Md€ | 56 ans |
| Actions cotées et OPC en direct | 622 Md€ | 186 Md€ | 28 ans |
| Immobilier hors résidence principale | ≈ 3 100 Md€ | ≈ 1 240 Md€ | 65 ans |
| Assurance-vie et épargne retraite | 2 177 Md€ | 544 Md€ | 32 ans |
| PEA et PEA-PME | 145 Md€ | 44 Md€ | 28 ans |
| Usufruits en cours (démembrements) | 90 / **270** / 540 Md€ | — | 10-20 ans |
| Réductions d'impôt restant dues (Pinel et autres) | 4,8 / **7,7** / 13 Md€ | — | 9 ans |
| Pactes Dutreil sous engagement | ≈ 60-150 Md€ (estimation) | — | ≤ 6 ans |
| Droits à pension accumulés | ≈ 397 % du PIB (2021) | — | renvoi à T13 |

Sources : Banque de France (épargne des ménages et PEA, fin 2025), Insee Première n° 2081 (fin 2024), Cour des comptes (Dutreil 2025, Pinel 2024), Eurostat. **Aucune statistique publique du stock de bénéfices non distribués et de trésorerie des holdings patrimoniales n'a été trouvée** (V503) : c'est le premier manque.

**Lecture.** Le patrimoine existant met **30 à 65 ans** à « passer » par un événement taxable. Toute règle qui protège ce stock jusqu'à son terme (le « grand-père ») fait donc durer l'ancien système une à deux générations.

## 3. Recettes et coûts de la transition par politique (Md€, VA sur 30 ans)

| Politique | Bas | Central | Haut |
|---|---|---|---|
| Ancien régime (référence) | 178 | 276 | 404 |
| **Stricte** (principe de l'auteur pur) | 959 | 1 349 | 1 841 |
| **Recommandée** (avec purge) | 798 | 1 023 | 1 279 |
| Recommandée sans purge | 800 | 1 037 | 1 328 |
| Grand-père large | 178 | 276 | 404 |
| *Coût de la recommandée (sans purge) par rapport à la stricte* | *159* | *311* | *513* |
| *Coût du grand-père large par rapport à la stricte* | *781* | *1 073* | *1 437* |

**Ne pas ajouter ces chiffres au simulateur.** Le simulateur suppose déjà la règle stricte pour tous les flux. Ce tableau dit ce que **retirerait** du simulateur chaque protection accordée à l'existant : ≈ 8 / 16 / 26 Md€ par an pour la politique recommandée, ≈ 40 / 55 / 73 Md€ par an pour le grand-père large (à comparer au solde central du simulateur, ≈ −196 Md€ par an).

**D'où vient l'écart entre la stricte et l'ancien régime (central)** : 747 Md€ des transmissions (le patrimoine existant taxé à 50 % au décès ou à la donation, au lieu de ≈ 7 %) et 243 Md€ des ventes. Le cœur financier de la réforme, c'est donc la **transmission**, et c'est aussi la partie la plus solide juridiquement.

**Ce que coûtent les protections recommandées (central, VA)** :

| Protection | Coût | Pourquoi la garder |
|---|---|---|
| Taux historiques sur les plus-values immobilières (abattements acquis) | 100 | abattements « gagnés » par la durée (2013-682 DC) |
| Démembrements antérieurs à l'annonce non taxés à l'extinction | 88 | donation déjà taxée en tenant compte de l'extinction gratuite |
| Taux historiques sur l'assurance-vie (gains déjà acquis) | 71 | c'est exactement ce que le Conseil a exigé en 2013 |
| Crédit d'IS sur les réserves anciennes | 38 | évite 62,5 % de charge et une vague de distributions avant la réforme |
| PEA (gains déjà acquis) | 8 | même logique que l'assurance-vie |
| Réductions Pinel et autres honorées | 7 | engagement de durée ; enjeu faible, risque élevé |
| **Total** | **≈ 311** | ≈ 16 Md€ par an |

**Le profil dans le temps (central, Md€ par an tirés des stocks existants)** :

| Année | Ancien régime | Recommandée (avec purge) | Stricte |
|---|---|---|---|
| 1 | 24 | 90 | 110 |
| 2 | 23 | 98 | 116 |
| 5 | 19 | 71 | 98 |
| 10 | 16 | 55 | 75 |
| 20 | 9 | 33 | 44 |
| 30 | 6 | 20 | 27 |

Sur les 5 premières années, la politique recommandée rapporte ≈ 230 / 320 / 430 Md€ de plus que l'ancien régime (bas / central / haut) ; sur 10 ans, ≈ 420 / 540 / 680 Md€. Ce sont surtout des recettes de transmission que le simulateur compte déjà.

## 4. « Payer maintenant à taux réduit » ou « plus tard à taux plein » ?

| Purge à l'américaine (15,5 % liquide, 8 % illiquide) | Bas | Central | Haut |
|---|---|---|---|
| Recette en plus l'année 1 | 2,6 | 8,9 | 16,0 |
| Recette en plus sur 5 ans | 6 | 19 | 29 |
| Effet net en VA | −2 | −15 | −49 |
| Effet net en VA si les adhérents sont ceux qui allaient vendre vite | −7 | −32 | −82 |

**Seuils** : payer 15,5 % maintenant coûte moins que 50 % plus tard dès que l'on garderait le bien plus de **40 ans** (taux 3 %) ; 8 % contre 50 % : 62 ans. Autrement dit, aux taux américains, presque tout détenteur a intérêt à purger : **la purge est une avance de trésorerie payée cher**, pas une recette.

**Taux « neutres »** (ni gain ni perte en VA, central) : ≈ 17 % pour les titres non cotés, 35 % pour les titres cotés, 7 % pour l'immobilier, 13 % pour l'assurance-vie et le PEA. À ces taux, la purge ne coûte presque rien (−3 Md€ en VA) et avance ≈ 30 Md€ sur 5 ans.

**Précédents** : la taxe américaine de 2017 était **obligatoire** (pas une option), étalée sur 8 ans ; sur 251 Md$ déclarés, 94 Md$ étaient payés en mars 2022, l'IRS jugeant l'étalement « very difficult to implement » ([TIGTA, 2022](https://www.oversight.gov/sites/default/files/upload-reports/202234062fr.pdf)). L'Italie offre en permanence une option de réévaluation à 18-21 % de la **valeur** (⚠️ V508).

**Recommandation de Claude** : une option de purge **ouverte deux ans, à des taux proches des taux neutres** (≈ 15-20 % sur les réserves et titres, plus bas sur l'immobilier ancien), payable en trois annuités. Elle n'est utile que pour simplifier : elle éteint des stocks anciens qu'il faudrait sinon suivre pendant des décennies (prix d'acquisition, abattements acquis).

## 5. L'anticipation : la vraie faille d'une réforme constitutionnelle

| Transmissions avancées sous l'ancien régime | Bas | Central | Haut |
|---|---|---|---|
| Volume avancé (1, 2 ou 4 années de grandes transmissions) | 75 Md€ | 150 Md€ | 300 Md€ |
| Recettes perdues sans règle anti-abus | 30 | 60 | 120 |
| Avec la règle datée de l'annonce | 6 | 12 | 24 |

Une nouvelle Constitution suppose un référendum puis des lois : plusieurs années entre l'annonce et l'application. L'Estonie avait voté sa réforme le 15 décembre 1999 pour le 1er janvier 2000, ce qui a empêché toute anticipation. Ici, sans règle datée de l'annonce, chaque grande famille transmettrait avant, sous Dutreil (≈ 5,6 % de taux effectif) plutôt qu'à 50 % après.

## 6. Ce qui est juridiquement solide ou fragile

| Mesure | Constitution actuelle | Nouvelle Constitution (CEDH et UE restent) | Montant en jeu (central, VA) |
|---|---|---|---|
| Transmissions postérieures au nouveau régime (décès, donations) | **solide** (fait générateur) | **solide** | ≈ 750 |
| Capitaux décès d'assurance-vie sans maintien du 990 I | solide à risque faible | risque faible | 244 |
| Réserves anciennes taxées à la distribution avec crédit d'IS | **solide** | **solide** | — |
| Réserves anciennes sans crédit d'IS (62,5 % cumulés) | risque faible | risque faible | 38 |
| Gains acquis sous régime de durée taxés à 50 % (AV, PEA, abattements immobiliers) | **fragile** (2013-682 DC ; motif financier insuffisant) | risque moyen (attentes légitimes, CEDH) | 179 |
| Suppression des réductions Pinel restantes | **fragile** | risque moyen | 7 |
| Extinction des usufruits existants taxée | risque moyen | risque moyen | 88 |
| Règle anti-abus datée de l'annonce | risque moyen (délai long) | risque faible si la Constitution l'autorise | 48 |
| Exit tax immédiate vers l'UE | **contraire au droit de l'UE** | **contraire au droit de l'UE** | faible |
| Exit tax différée jusqu'à la réalisation | solide | solide | faible (recouvrement 2,4 %) |
| Pensions converties à valeur égale ; régimes spéciaux fermés aux nouveaux entrants | solide | solide | renvoi à T13 |
| Baisse ciblée de droits à pension déjà acquis | fragile | fragile (substance du droit, CEDH) | — |

**Avec les probabilités conventionnelles de H18** (≈ 5 % pour un risque faible, 25 % moyen, 60 % élevé), l'« espérance de censure » vaut ≈ 160 Md€ pour la politique stricte sous la Constitution actuelle (85 Md€ avec une nouvelle Constitution), contre ≈ 24 Md€ (15) pour la politique recommandée. **Honnêtement : même pondérée par ce risque, la politique stricte rapporte davantage en VA** (≈ 1 190 contre ≈ 1 000 Md€ central). Elle reste déconseillée pour trois raisons que le chiffre ne capte pas : une censure du Conseil frappe souvent **toute la disposition**, pas la seule part litigieuse ; elle arrive après des années d'insécurité, pendant lesquelles les comportements s'adaptent ; et elle donne aux opposants l'argument « spoliation » contre le reste de la réforme.

**Ce qu'une nouvelle Constitution change vraiment** : elle peut écrire le principe de l'événement et la règle datée de l'annonce, et lever l'obstacle national (2013-682 DC). Elle **ne lève pas** la CEDH (protection des biens, attentes légitimes, charge excessive) ni le droit de l'UE (exit tax, directive mères-filiales). Dans la lecture de Claude, c'est donc surtout la **règle anti-abus** qui gagne en solidité ; les gains acquis sous des régimes de durée restent exposés.

## 7. Durée de la transition

- **Avec la politique recommandée** : les transmissions passent au nouveau régime dès le premier jour ; les taux historiques sur les gains anciens s'éteignent avec les ventes (28 à 65 ans pour 90 % des stocks, mais l'essentiel en valeur dans les 20 premières années) ; Pinel : 9 ans ; usufruits : 10 à 20 ans ; engagements Dutreil : 6 ans au plus. Une purge à taux neutre raccourcirait le suivi des stocks anciens.
- **Avec un grand-père large** : 30 à 65 ans, soit une à deux générations, pendant lesquelles deux systèmes coexistent. C'est le contraire de la simplification promise.

## 8. Ce qui appuie, nuance ou contredit l'auteur

- **Appuie.**
  - Le principe « date de l'événement, pas date du montage » est déjà celui du droit fiscal français (le fait générateur). Il s'applique sans difficulté à la plus grosse masse : les transmissions futures (≈ 750 Md€ de VA, central). Aucune « prime aux montages » n'est nécessaire.
  - La règle anti-abus datée de l'annonce a un précédent validé par le Conseil (2013-682 DC, cons. 15) et des précédents tolérés par la CEDH (*Huitson*, *National & Provincial*). Les États-Unis ont daté leur taxe de rapatriement d'avant le vote, et la Cour suprême l'a jugée constitutionnelle (*Moore*, 2024).
  - Le modèle estonien a fait sa transition sans drame (et avec un effet favorable sur les liquidités et l'endettement des entreprises, selon Masso et al.).
- **Nuance.**
  - Le principe strict doit souffrir **des exceptions précises** : gains acquis sous un régime de durée (assurance-vie, PEA, abattements immobiliers), réductions Pinel en cours, crédit d'IS sur les réserves anciennes, démembrements antérieurs. Coût : ≈ 16 Md€ par an (central), ≈ 8 % du trou du simulateur.
  - « Payer maintenant à taux réduit » n'est pas une manne : aux taux américains, c'est une avance de trésorerie qui coûte 15 à 50 Md€ en VA. Utile pour simplifier, pas pour financer.
  - Une nouvelle Constitution aide surtout contre l'anticipation ; elle ne libère pas de la CEDH ni du droit de l'UE.
- **Contredit.**
  - S'inspirer de la taxe américaine de 2017 pour taxer **d'office** les réserves accumulées ne s'impose pas : elle accompagnait le passage **vers** un régime territorial, avec des taux bas (8 et 15,5 %), et elle a été payée lentement. Le modèle estonien que l'auteur retient n'exige pas de taxer les réserves tant qu'elles restent investies : il suffit de les taxer à la sortie, avec un crédit d'IS. Une taxation d'office d'un stock non distribué serait en outre plus exposée (charge sans revenu perçu, CEDH).
  - Le calendrier d'une nouvelle Constitution est l'ennemi de la réforme fiscale : plusieurs années d'annonce ouvrent une fenêtre d'anticipation de 30 à 120 Md€. Sans règle datée de l'annonce, inscrite dès le premier texte public, une partie des grandes transmissions échapperait au nouveau régime pour une génération.
- **Biais à signaler.** Claude a choisi des plus-values latentes et des rythmes de réalisation sans données (⚠️). Les niveaux de risque contentieux sont une lecture d'IA, pas l'avis de juristes. Le modèle ne dit pas qu'une politique est « la bonne » : il chiffre les arbitrages, que le vote doit trancher.

## 9. Pour le simulateur et le livre

- **Simulateur** : ajouter un sélecteur « règle de transition » (stricte / recommandée / grand-père) qui retire du solde, pendant les 30 premières années, l'équivalent annuel du coût (≈ 0 / 16 / 55 Md€ par an, central), et un interrupteur « règle anti-abus datée de l'annonce » (perte ponctuelle 12 ou 60 Md€, central).
- **Chapitre 19** (« Comment on passe de l'ancien au nouveau système ») : ce modèle fournit la matière juridique et les ordres de grandeur ; la partie « bascule un 31 décembre » doit intégrer la date d'annonce.
