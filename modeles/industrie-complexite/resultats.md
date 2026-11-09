---
titre: L'industrie de la complexité : résultats
tache: T6
statut: brouillon sourcé
consultation: 2026-10-25
---

# L'industrie de la complexité : ce que disent les chiffres

> **À lire d'abord.** Ce sont des **hypothèses et des ordres de grandeur, jamais des prédictions**. Chaque chiffre vient de `donnees/*.csv` (avec sa source) ou d'un calcul reproductible (`jsc modele.js test_modele.js`). Méthode et hypothèses H1 à H12 : [`methode.md`](methode.md). ⚠️ = non confirmé.
>
> On décrit un système, pas des personnes. Les comptables, les gestionnaires de paie et les fiscalistes rendent un service réel. C'est la règle qui crée le besoin.

## 1. Les faits solides (sources primaires)

- **Activités comptables (NAF 69.20), 2024** : 23 700 entreprises, **28,0 Md€ de chiffre d'affaires**, 17,1 Md€ de valeur ajoutée et **221 053 personnes occupées** ([Eurostat SBS](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_ovw_act?geo=FR&nace_r2=M692&lang=en)). Le CA a augmenté de 27 % depuis 2021 (22,0 Md€).
- **Audit légal** : 2,97 Md€ d'honoraires de certification, 208 128 mandats ([H2A, rapport 2025](https://h2a-france.org/wp-content/uploads/2026/05/Rapport-annuel-H2A-2025.pdf)).
- **Activités juridiques (NAF 69.10)** : 31,9 Md€ et 190 026 personnes, notaires compris. Les avocats sont 78 938 ([CNB, 2026](https://www.cnb.avocat.fr/chiffres-cles-2026-de-la-profession-d-avocat)).
- **Paie** : 1,57 M d'employeurs privés, 20,3 M de salariés et 726,5 Md€ de masse salariale en 2024 ([Urssaf open data](https://open.urssaf.fr/explore/dataset/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/)). Silae produit plus de 8 M de bulletins par mois et intègre plus de 900 conventions collectives. Cegid et Silae visent ensemble plus de **10 Md€ de valeur d'entreprise** ([communiqué du 09/09/2026](https://www.cegid.com/fr/presse/cegid-et-silae-annoncent-leur-rapprochement-pour-creer-un-leader-technologique-europeen-porte-par-lintelligence-artificielle/)). PayFit a été valorisée 1,82 Md€ en 2022 ⚠️.
- **Crédit d'impôt recherche** : 8,0 Md€ en 2026, la dépense fiscale la plus coûteuse de l'État ([Sénat, PLF 2026](https://www.senat.fr/rap/l25-139-323/l25-139-323_mono.html)). Selon l'IGF (2010), les cabinets de conseil prennent en moyenne **20 % du crédit obtenu**, et 20 à 30 % pour les PME ; les six plus gros réalisaient 150 M€ de CA ([rapport Berson, Sénat 2012](http://www.senat.fr/rap/r11-677/r11-6771.pdf)).
- **Temps de conformité d'une PME type** : 139 h par an, dont **80 h pour les cotisations sociales**, 31 h pour la TVA et 28 h pour l'IS ([Doing Business 2020](https://archive.doingbusiness.org/content/dam/doingBusiness/country/f/france/FRA.pdf), **source arrêtée en 2021, conservée pour comparaison**). La moyenne de l'OCDE est de 159 h : la France n'est pas un cas extrême sur ce critère. Contrôle de remplacement (OCDE PMR 2023, [API](https://sdmx.oecd.org/public/rest/data/OECD.ECO.GCRD,DSD_PMR@DF_PMR,1.4/FRA+DEU+ITA+ESP+NLD+GBR+SWE+USA..?format=csvfilewithlabels)) : charge administrative française 1,51 contre 1,46 en moyenne chez sept comparateurs (5e sur 8), mais professions comptable (2,29 contre 0,91) et d'avocat (3,36 contre 2,52) parmi les plus réglementées.
- **Contentieux** : la fiscalité représente 4 % des affaires des tribunaux administratifs (≈ 13 400, calcul), 7 % en appel et 9 % au Conseil d'État ([chiffres clés 2025](https://www.conseil-etat.fr/content/download/235833/document/ChiffresClesJA2025.pdf)).

## 2. Taille de l'industrie de la complexité

| | Bas | Central | Haut |
|---|---|---|---|
| **A. Marché externe** (cabinets, éditeurs, conseil) | 11,5 Md€ · 88 000 emplois | 17,9 Md€ · 134 000 | 24,3 Md€ · 181 000 |
| **B. Travail interne des employeurs** | 13,1 Md€ · 180 000 | 21,9 Md€ · 301 000 | 30,7 Md€ · 421 000 |
| **C. Temps des ménages** (non marchand) | 0,5 Md€ | 1,0 Md€ | 2,0 Md€ |
| **Total** | **25 Md€ (0,9 % du PIB) · 268 000** | **41 Md€ (1,4 % du PIB) · 435 000** | **57 Md€ (1,9 % du PIB) · 602 000** |

Les emplois sont des équivalents : 437 000 emplois, c'est par exemple un quart du temps de 1,2 M de personnes, pas 437 000 personnes à plein temps sur la complexité.

**Ce qui pèse le plus** : le travail interne des employeurs (B), puis l'expertise comptable (12,5 Md€ dans le scénario central). Les cabinets de CIR (0,3 à 0,8 Md€) et la défiscalisation patrimoniale (0,5 à 1 Md€) sont symboliques, mais petits.

**Revue des entrées (03/11/2026, V6650-V6659) : avant / après.**

| | Bas | Central | Haut |
|---|---|---|---|
| Total avant (Md€ · emplois) | 25,6 · 270 000 | 41,2 · 437 000 | 57,2 · 603 000 |
| Total après | 25,2 · 268 000 | 40,8 · 435 000 | 57,0 · 602 000 |
| Dont ce qui disparaît, avant → après | 10,1 → 10,0 | 24,5 → 24,3 | 45,4 → 45,3 |
| Gain réel net, avant → après (Md€/an) | 3,5 → 3,5 | 15,2 → 15,1 | 33,0 → 32,9 |

Une seule correction chiffrée : le CA des éditeurs de paie vendu aux cabinets, déjà dans le CA des cabinets, est retiré (H5, V6655). Les effectifs et chiffres d'affaires par NAF (Eurostat, Insee-Ésane, Urssaf, H2A, CNB, comptes déposés) sont confirmés ; la prétendue présence du secteur public dans les 1,2 M d'emplois internes est corrigée sans effet chiffré (pas de double compte avec le coût public du prélèvement). Contrôle VVA/KPMG : 31 à 38 Md€ pour la conformité fiscale et sociale des PME françaises, contre 38,5 Md€ au central de T6 sur le même périmètre (méthode § 4 bis).

**La fourchette 26 / 41 / 57 Md€ reste défendable, sous cette formulation** : « entre 25 et 57 Md€ par an (0,9 à 1,9 % du PIB) de coûts liés à la complexité des règles fiscales et sociales, en ordre de grandeur, dont les deux tiers sont du travail interne aux entreprises ; central 41 Md€ ». Trois réserves à dire : la part de disparition du haut (80 %) dépasse le meilleur précédent observé (Estonie, 64 % de temps en moins) ; la part de temps interne (15 / 25 / 35 %) est une hypothèse ; le chiffre n'est pas indépendant du coût complet « strict » (16 / 25 / 43 Md€), qui reprend plusieurs hypothèses de T6. Les emplois sont des équivalents, pas des personnes à licencier : l'objectif reste de ne perdre personne.

**Recoupements.**
- La charge administrative de **toutes** les normes est estimée à 60-70 Md€ (Sénat 2023, mission Margueritte 2024 ; mesure de 2007). Le scénario central (40 Md€ pour le marché et le travail interne) en représenterait environ 60 %. C'est plausible, sans plus.
- Aux États-Unis, la conformité à l'impôt fédéral seul coûterait 1,9 % du PIB (Tax Foundation, 2024, think tank). C'est le même ordre de grandeur que notre scénario haut.

## 3. Ce qui disparaît, ce qui se transforme, ce qui reste

| | Bas | Central | Haut |
|---|---|---|---|
| **Disparaît** | 10 Md€ (40 %) · 107 000 emplois | **24,3 Md€ (60 %) · 260 000** | 45 Md€ (79 %) · 479 000 |
| Se transforme (conseil de gestion, audit des données, accompagnement) | 9,7 Md€ · 106 000 | 11,8 Md€ · 130 000 | 8,6 Md€ · 92 000 |
| Reste (droit du travail, successions, contentieux de fraude…) | 5,5 Md€ · 56 000 | 4,7 Md€ · 46 000 | 3,2 Md€ · 31 000 |

Dans le scénario central, les emplois qui disparaissent se répartissent ainsi :
- 180 000 au sein des services internes des employeurs ;
- 59 000 en cabinets d'expertise comptable ;
- 10 000 dans les activités juridiques ;
- 5 000 dans la gestion de patrimoine ;
- 3 000 dans les cabinets de CIR ;
- 2 000 chez les éditeurs de paie.

## 4. Gain pour l'économie (pas pour le budget)

| | Bas | Central | Haut |
|---|---|---|---|
| Coût évité pour les entreprises et les ménages | 10 Md€/an | 24,3 Md€/an | 45 Md€/an |
| **Gain réel net** (travail réemployé, moins le coût du système public) | **3,5 Md€/an (0,1 % du PIB)** | **15 Md€/an (0,5 % du PIB)** | **33 Md€/an (1,1 % du PIB)** |
| Coût ponctuel des reconversions | 3,1 Md€ | 2,6 Md€ | 2,4 Md€ |

- Le **coût évité** n'est pas une richesse nouvelle tant que les personnes libérées ne retrouvent pas un emploi. D'ici là, c'est un transfert : ce que le client économise, le secteur le perd.
- *Coût ponctuel, avant/après (01/11/2026)* : le paramètre « coût par reconversion », sans source (40 / 25 / 15 k€), est remplacé par une fourchette sourcée (29 / 10 / 5 k€ : Transitions Pro, CPF, PIC, voir `methode.md` H12). Le coût ponctuel passait de 4,3 / 6,5 / 7,2 Md€ à 3,1 / 2,6 / 2,4 Md€ ; il baisse en bas, il est divisé par 2,5 en central et par 3 en haut. Le gain réel net ne change pas à la décimale près (3,5 / 15 / 33 Md€/an) car il est dominé par le réemploi. L'amortissement passe de 0,2-1,4 an à 0,1-0,9 an. Le coût hors formation (revenu perdu pendant la reconversion, couvert par le socle) n'est pas dans ce poste.
- Le **gain réel** dépend donc entièrement de la reconversion. C'est l'argument économique du principe « ne perdre personne », et pas seulement un argument moral.
- Ce gain **ne finance pas** le simulateur. Il améliore la productivité de l'économie et donc l'assiette, de façon indirecte et lente. T3 avait déjà relevé que chaque tranche de 10 % de charge administrative supprimée vaut environ 6 à 7 Md€ pour l'économie, pas pour le budget.

## 5. Personnes à reconvertir

| | Bas (15 ans) | Central (10 ans) | Haut (5 ans) |
|---|---|---|---|
| Postes supprimés au total | 107 000 | 261 000 | 480 000 |
| Postes supprimés par an | 7 000 | 26 000 | 96 000 |
| Départs en retraite par an dans ces fonctions (2,6 %/an, Métiers 2030) | 7 000 | 11 000 | 16 000 |
| **Personnes à reconvertir** (si les départs ne sont pas remplacés) | **≈ 2 000** | **≈ 147 000** | **≈ 400 000** |

**Le rythme décide de tout.** Sur 15 ans, les départs en retraite absorbent presque tout. Sur 5 ans, il faudrait reconvertir 80 000 personnes par an, soit l'équivalent de 3,5 % des projets de recrutement annuels de la France (2,27 M, BMO 2026). C'est un argument pour une bascule progressive et annoncée. C'est aussi un argument pour cesser de former des débutants aux métiers qui disparaissent : Métiers 2030 comptait déjà un excédent de 61 000 jeunes chez les employés de la comptabilité.

**Vers quels métiers (scénario central, parts indicatives H11) :**

| Métier d'arrivée | Personnes | Besoin sourcé | Compétences transférables |
|---|---|---|---|
| Contrôle de gestion, audit, conseil de gestion aux TPE-PME | ≈ 52 000 | déficit de 113 000 cadres administratifs, comptables et financiers d'ici 2030 | lecture des comptes, relation avec les dirigeants |
| Numérique : qualité des données, développement, support du système public | ≈ 22 000 | 18 323 projets d'ingénieurs informatiques, dont 58 % difficiles (BMO 2026) ; +35 000 de déficit (2030) | connaissance des flux de paie et de facturation, logique des règles |
| Contrôle, lutte contre la fraude, accompagnement des usagers | ≈ 15 000 | — | droit fiscal et social, traitement de dossiers |
| Enseignement et formation | ≈ 15 000 | déficit de 68 000 enseignants (2030) | pédagogie du chiffre |
| Santé et aide à la personne (formation longue) | ≈ 22 000 | déficit de 224 000 aides à domicile et de 104 000 aides-soignants (2030) | organisation, relation ; diplôme à acquérir |
| Industrie et métiers techniques | ≈ 7 000 | 72 à 81 % de projets difficiles pour les dix métiers les plus en tension (BMO 2026) | méthode ; formation technique à acquérir |
| Création ou reprise d'entreprise, autres | ≈ 15 000 | — | gestion d'une petite entreprise |

**Précédents.** La France a déjà vécu ce type de transition à petite échelle :
- **vignette automobile (2000-2001)** : 350 des 380 ETP concernés ont été redéployés à la DGI ([réponse ministérielle, 2004](https://www.assemblee-nationale.fr/dyn/12/questions/QANR5L12QE42113)) ;
- **marché unique de 1993** : 2 500 emplois de douane libérés ; 750 agents ont été reclassés en douane et 950 emplois repris par les autres administrations financières ([Sénat, 1992](https://www.senat.fr/questions/base/1992/qSEQ920521355.html)).

L’échelle visée ici est 60 à 400 fois plus grande (scénario central), et elle concerne surtout le secteur privé.

## 6. Ce qui appuie, nuance ou contredit la thèse de l'auteur

**Appuie.**
- L'industrie existe et elle est mesurable. Elle représente entre 0,9 et 1,9 % du PIB et 270 000 à 600 000 équivalents emplois, soit de l’ordre d’un emploi sur 50 à 110 (environ 30 M d’emplois en France ⚠️ ordre de grandeur).
- Elle croît : le CA du NAF 69.20 a progressé de 27 % entre 2021 et 2024.
- Elle se valorise : plus de 10 Md€ pour Cegid-Silae.
- Elle pèse d'abord sur les petits : la conformité TVA coûte 2,6 % du CA d'une PME contre 0,02 % pour une grande entreprise (Commission européenne ⚠️).
- La part captée par les cabinets de CIR (de l'ordre de 4 à 10 % d'une dépense de 8 Md€) illustre bien l'« extraction de valeur » au sens de Mazzucato : une partie de l'argent public destiné à la recherche rémunère la maîtrise du dossier.

**Nuance.**
- Le gain réel (0,1 à 1,1 % du PIB) est **un ordre de grandeur modeste** à côté des montants du simulateur. C'est un argument de productivité et de justice entre petits et grands, pas un argument budgétaire.
- La « rente » au sens de Krueger (7 à 15 % du revenu national dans l'Inde et la Turquie des années 1960) est d'un autre ordre. La comparaison est rhétorique, pas quantitative.
- Ces métiers déclinent **déjà** sous l'effet de l'automatisation. Frey et Osborne estiment leur probabilité d'automatisation entre 0,94 et 0,99, et les projets de recrutement d'employés de la comptabilité baissent. Une partie de la disparition se produira sans la réforme. Il est plus honnête de dire que la réforme rend cette disparition **ordonnée et utile**, plutôt que de la lui attribuer.

**Contredit, ou oblige à préciser.**
- La France n'est **pas** une exception sur le temps de conformité d'une PME type : 139 h contre 159 h en moyenne dans l'OCDE et 218 h en Allemagne. La complexité française se loge ailleurs : cotisations sociales (80 h), allègements, conventions collectives, niches.
- La complexité se reconstitue dès qu'on ajoute des modulations (chapitre 9). Chaque exception politique recrée une petite industrie.
- L'industrie se défend. Aux États-Unis, le pilote public IRS Direct File a été suspendu en 2025, alors que TurboTax pèse 5,3 Md$. Toute réforme doit prévoir cette résistance, et celle des personnes dont c'est le métier, qu'il faut associer plutôt que désigner.

## 7. Limites principales

Les parts « complexité » sont des hypothèses : aucune répartition du CA des cabinets par mission n'a été trouvée, et aucune enquête française de temps non plus. Le bloc interne (B) pèse plus de la moitié du total et c'est le moins bien mesuré. Les honoraires de CIR datent de 2010. Le contrefactuel « automatisation » n'est pas soustrait. Liste complète : [`methode.md` §8-9](methode.md) ; registre : `verifications.md` V148 à V162.

## 8. v2 : optimisation patrimoniale et successorale (02/11/2026)

Calcul : `node test_modele.js` (§ 4). Méthode : `methode.md` § 10. Tout est ordre de grandeur ; les hypothèses sont numérotées H13 à H22.

### 8.1 Recettes en jeu (Md€/an, avant et après réaction)

| | Bas | Central | Haut |
|---|---|---|---|
| Pacte Dutreil (PLF 2026 : 5,0 en 2024 ; Cour : 5,5) | 4,0 | 5,0 | 5,7 |
| Assurance-vie hors succession (CAE, 2017-2018) | 4,0 | 4,5 | 5,0 |
| Démembrement (CAE, vers 2006) | 2,0 | 2,5 | 3,0 |
| Autres exonérations classées (PLF 2026) | 0,3 | 0,3 | 0,3 |
| **Coût brut des régimes de faveur** | **10,3** | **12,3** | **14,0** |
| Part récupérée / fuite | 40 % / 20 % | 60 % / 10 % | 80 % / 5 % |
| **Rendement net d'une suppression ou d'un plafonnement** | **3,3** | **6,6** | **10,6** |

**Lecture.** (fait) L'État perçoit 20,9 Md€ de droits de mutation à titre gratuit en 2024 (16,0 de successions, 4,9 de donations ; PLF 2026, Voies et moyens t.1). (estimation) Les régimes de faveur coûteraient 10 à 14 Md€ par rapport au droit commun, soit **la moitié à deux tiers** de ce qui est perçu, mais cette somme est un majorant (double compte possible entre Dutreil et démembrement, données anciennes). (estimation) Après réaction des comportements, le rendement serait de **3 à 11 Md€, 7 au central**, soit **0,1 à 0,4 % du PIB**. Le contrôle de plausibilité tient : le CAE (2021) trouvait +9 Md€ pour une réforme d'assiette à barème inchangé, +19 Md€ pour une assiette « vie entière ».

**Trois constats à retenir.**
1. (fait) **Le plus gros avantage n'est pas chiffré.** L'abattement de 100 000 € par parent et par enfant n'est pas une dépense fiscale depuis 2009 (« assimilé à la norme »). Le coût d'un plafonnement n'a pas de chiffre officiel ⚠️.
2. (fait) **Le chiffrage officiel du Dutreil a été révisé de +4,2 Md€** dans le PLF 2026 : il valait 0,8 Md€ dans le PLF 2025. L'ordre de grandeur de ces dépenses est fragile.
3. (fait) **Concentration** : 110 donataires captent 65 % de l'avantage du Dutreil (Cour des comptes, 18/11/2025 ; ⚠️ repris du fichier de transmissions). Une réforme ciblée sur le haut de la distribution ferait l'essentiel du rendement sans toucher aux petites transmissions.

### 8.2 Matière grise mobilisée (activité liée à la complexité patrimoniale)

| | Bas | Central | Haut |
|---|---|---|---|
| Emplois liés | 6 000 | 14 000 | 24 000 |
| dont disparaîtraient | 2 000 | 7 000 | 17 000 |
| Chiffre d'affaires lié (Md€) | 0,8 | 1,9 | 3,4 |
| Valeur ajoutée liée (Md€) | 0,6 | 1,3 | 2,4 |

Soit, au central, **de l'ordre de 14 000 emplois et 1,3 Md€ de valeur ajoutée**, 0,05 % de l'emploi français (≈ 30 M ⚠️). (estimation) C'est **un ordre de grandeur plus petit que les recettes en jeu** : 1 à 2 Md€ de valeur ajoutée contre 3 à 11 Md€ de recettes. Pour comparaison, la v1 trouvait 270 000 à 600 000 emplois pour toute l'industrie de la complexité (§ 2).

### 8.3 Coût d'opportunité

| | Bas | Central | Haut |
|---|---|---|---|
| Emplois réemployés ailleurs | 1 000 | 5 000 | 15 000 |
| Gain annuel de réallocation (Md€) | 0,02 | 0,3 | 2,1 |
| Coût ponctuel de reconversion (Md€) | 0,05 | 0,07 | 0,08 |
| Années pour amortir | 3 | 0,2 | 0,04 |

Le gain central, **0,3 Md€/an**, est le produit d'emplois réemployés par la valeur ajoutée par emploi et par l'écart de produit social (0,85 − 0,25). Il est **très sensible** au ratio de produit social (de 0,02 à 2,1 Md€) : c'est exactement le paramètre que Lockwood, Nathanson et Weyl jugent mal mesuré.

### 8.4 Ce que dit la comparaison

- (estimation) **La première captation (les recettes) pèse nettement plus que la seconde (la matière grise)** : 7 Md€ contre 0,3 à 1,3 Md€ au central. La thèse de la « double captation » tient, mais le poids est du côté du pot commun, non du côté des talents, **si on se limite aux emplois actuels**.
- (hypothèse, non chiffrée) La seconde captation pèse peut-être davantage **dans le temps** : si les étudiants les plus capables choisissent le droit fiscal, la gestion de patrimoine ou la finance parce que ces activités sont mieux rémunérées que la recherche ou l'ingénierie, le coût est celui de ce qu'ils n'ont pas fait. Murphy, Shleifer et Vishny (1991) et Philippon et Reshef (2012) vont dans ce sens ; les coefficients n'ont pas été extraits et aucune élasticité française n'a été trouvée. C'est le chiffre inhabituel demandé par l'auteur : **il n'existe pas**, et le dire est le résultat.
- (opinion de l'auteur, non démontrée) Un cadre qui cesse de récompenser le savoir d'optimisation redirige des talents. Le modèle ne le prouve pas.

### 8.5 Ce qui appuie, nuance ou contredit

**Appuie.** Le coût des régimes de faveur est du même ordre que la moitié des droits perçus ; le Dutreil est très concentré (110 donataires, 65 %) ; les chiffrages officiels ont été sous-estimés (0,8 puis 5,0 Md€) ; le notariat et le conseil patrimonial sont des activités à rémunération élevée (VA par personne de 116 k€ dans le NAF 69.10).

**Nuance.** (1) Les 10 à 14 Md€ sont un **majorant** sur des données de 2006 à 2018 pour deux postes. (2) Les 7 Md€ de rendement central sont un transfert, pas un gain de richesse, et sont soumis à la **volonté du législateur** de maintenir des régimes de faveur. (3) L'abattement parent-enfant, que l'auteur cite, **ne peut pas être chiffré** avec les sources officielles actuelles. (4) La matière grise mobilisée est petite (14 000 emplois), et en partie utile (successions, divorces, protection de proches).

**Contredit, ou oblige à préciser.** (1) « Les petites gens paient les droits » : (⚠️ source secondaire) plus de six successions sur dix ne donnent lieu à aucun droit ; l'iniquité se loge plus haut, dans la distribution des gros patrimoines (110 donataires). À vérifier avant tout usage. (2) La complexité française n'est pas seulement le fait de montages : elle est aussi dans les barèmes eux-mêmes ; un barème plus simple (une exonération unique élevée) réduirait l'industrie, mais pas sans coût de transition.

### 8.6 Limites principales

Banque privée et ingénierie patrimoniale non chiffrées ; part du CA du notariat consacrée aux successions, aux donations et aux régimes matrimoniaux non publiée ; part fiscale du conseil des CGP non trouvée ; coefficients de la littérature sur l'allocation des talents non extraits ; élasticité des comportements propre à la suppression d'un cadre d'optimisation (et non à un taux) non trouvée ; jurisprudence constitutionnelle non relue. Les résultats ne s'additionnent pas à ceux du système idéal (même assiette).
