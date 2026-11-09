---
titre: Retraites — nouveau décompte des droits et passage progressif à la capitalisation (recherche)
tache: T48
date: 2026-11-01
statut: brouillon
---

# Retraites : nouveau décompte et part capitalisée croissante — recherche (T48)

Tâche T48 de document de travail de l'atelier, non publié, décidée avec l'auteur le 31/10/2026 : droits acquis **sanctuarisés** ; retraites **recalculées autrement**, sans tout ramener au minimum ; **nouveau décompte** (points ou comptes notionnels) ; **à terme**, des cotisations investies dans des actifs réels (capitalisation), dont des « entreprises d'intérêt commun ». Liens : [`modeles/retraites/`](../modeles/retraites/methode.md) (T13, socle + complément), [`modeles/systeme-ideal/resultats.md`](../modeles/systeme-ideal/resultats.md) § 11 (voie R, T47). Calcul reproductible : [`sources/calculs/t48_capitalisation.py`](calculs/t48_capitalisation.py) (résultats : `t48_capitalisation_resultats.txt`).

Légende : **fait sourcé** (lien, institution, date) · **estimation** (calcul explicité) · **opinion** (de l'auteur ou de Claude) · ⚠️ non confirmé, listé dans `verifications.md` (V2649 à V2663). Toutes les sources ont été consultées le **01/11/2026** ; les PDF ont été téléchargés dans `$DONNEES/sources/t48/` et lus en texte. « pdf p. » = numéro de page du fichier PDF (le numéro imprimé est inférieur de 2 pour le COR). Montants en euros ou couronnes courants de l'année indiquée, sauf mention. Des ordres de grandeur sous hypothèses, jamais des prédictions.

## 0. L'essentiel (écrit pour être vrai)

1. **Ce qui est établi par la littérature** : passer de la répartition à la capitalisation ne crée **pas** de richesse « gratuite » une fois la transition payée. Le rendement plus élevé des marchés est la contrepartie des « gains d'introduction » des premières générations de la répartition (Sinn, NBER 2000 ; Barr et Diamond, 2006). Il y a un **double coût** pour les générations de la transition, qu'on peut étaler (dette, impôt, baisse de droits) mais pas supprimer. Seule une hausse causale de l'épargne et de la croissance ferait un vrai gain, et c'est contesté.
2. **Ce que cela coûte, en ordre de grandeur (estimation)** : un point de cotisation détourné vers un fonds ≈ **14,7 Md€/an** (≈ 0,5 % du PIB). Trois points : surcoût net de **≈ 44 Md€/an au pic** (1,5 % du PIB), qui décroît ensuite (≈ 25 Md€ à 30 ans, ≈ 8 à 45 ans) ; six points : **≈ 83 Md€** (2,8 % du PIB). Cumul sur 30 ans : ≈ 1 000 Md€ (3 points) à ≈ 1 750 Md€ (6 points), soit 34 à 59 % du PIB 2025. C'est du même ordre que le modèle `modeles/retraites` (≈ 90 Md€/an, 3 % du PIB), qui était plus brutal.
3. **Le rendement de la répartition n'est pas nul mais faible** : le taux de rendement interne du cas type du COR est de **0,8 % réel** pour la génération 2000, contre ≈ 4 à 5,5 % réel pour les actions de long terme (avant risque). L'écart est réel, mais c'est la facture de la transition qui le « paie » (point 1).
4. **Les modèles étrangers qui tiennent** ont presque tous un **socle public + une part capitalisée gérée à bas coût** : Suède (comptes notionnels 16 % + 2,5 % capitalisés, frais ≈ 0,21 %), Pays-Bas (fonds professionnels à 36,6 % de cotisation totale, 96 % de taux de remplacement net), Canada (CPP Investments, 793 Md CAD), Australie (superannuation, 4 767 Md AUD). Le **Chili**, présenté comme le modèle de la capitalisation pure, a dû ajouter un socle quasi universel (2022) et une cotisation patronale de 7 points (2025).
5. **Frictions avec la voie R (T47)** : le déficit de départ de la voie R est déjà de 169 Md€ ; ajouter 1,5 à 2,8 % du PIB de double charge **n'est pas finançable sans arbitrage explicite**. La proposition ci-dessous commence à **1 point** (≈ 15 Md€/an) et conditionne chaque étape à un test (§ 5).
6. **Risque principal à nommer** : la **gouvernance**. Les précédents (Argentine 2008, Hongrie 2010, Pologne 2014, FRR détourné vers la Cades) montrent que les fonds de long terme sont repris en temps de déficit ; investir dans des « entreprises d'intérêt commun » choisies par le pouvoir politique est le point où la proposition peut échouer (§ 6).

## 1. Le système actuel (France)

### 1.1 Les masses (fait sourcé, COR 2026)

Source : [COR, Rapport annuel de juin 2026, scénario de référence](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf) (pdf p. 9, 39, 46, 67, 75, 102-103, 142), lu en texte le 01/11/2026.

| Indicateur | Valeur | Année | Remarque |
|---|---|---|---|
| Dépenses de retraite (tous régimes) | **422,2 Md€ = 14,1 % du PIB** | 2025 | 14,2 % en 2045 ; 15,3 % en 2070 |
| Ressources | 13,9 % du PIB | 2025 | 12,9 % en 2070 |
| Solde (hors produits financiers) | −0,2 % (−5,1 Md€) | 2025 | −0,9 % en 2045 ; **−2,4 % en 2070** |
| Cotisants / retraités de droit direct | 30,6 M / 17,4 M | 2025 | 28,9 M / 22,1 M en 2070 |
| Cotisants par retraité | 1,8 | 2025 | 2,1 en 2002 ; **1,3 en 2070** |
| Rapport 20-64 ans / 65 ans et plus | 2,5 | 2025 | 3,6 en 2009 ; 1,62 en 2070 |
| Pension moyenne / revenu d'activité moyen | 54,6 % | 2025 | 45,3 % en 2070 (indexation sur les prix) |
| Hypothèses de croissance | productivité horaire +0,7 %/an ; chômage 7 % dès 2040 | — | scénario de référence |

Le PIB implicite 2025 est ≈ 2 990 Md€ (422,2 / 0,141, **estimation**) ; **1 point de PIB ≈ 30 Md€**.

### 1.2 Les réserves existantes (fait sourcé, COR 2026, pdf p. 102-103)

| Réserves au 31/12/2025 | Md€ | Remarque |
|---|---|---|
| Total des régimes en répartition | **223,9** (7,5 % du PIB) | dont 91 % dans les complémentaires |
| Agirc-Arrco | 113,6 | ≈ 14 mois de prestations |
| RCI (indépendants), Cnavpl complémentaire, Ircantec | 23,4 ; 39,0 ; 19,2 | 107, 71 et 50 mois |
| Banque de France (régime spécial) | 13,4 | 277 mois |
| CRPCEN ; CNRACL | 2,3 ; 0 | |
| **FRR** (Fonds de réserve pour les retraites) | **20,7** | verse 1,45 Md€/an à la Cades jusqu'en 2033 |
| **Total y compris FRR** | **244,6** (8,2 % du PIB) | |
| Régimes déjà en capitalisation (RAFP, pharmaciens…) | actif ≈ 61,2 Md€ = **1,4 % du PIB** | RAFP : rendement interne du portefeuille **4,7 % nominal** 2006-2025 ; rendement technique 3,89 % en 2025 |

Lecture : les réserves actuelles couvrent **≈ 7 mois de dépenses** de l'ensemble du système (244,6 / 422,2 ≈ 0,58 an ≈ 7 mois), pour l'essentiel des réserves techniques de régimes en points. Elles ne sont **pas** un fonds de capitalisation. **Droits acquis** : Eurostat donne une valeur des droits à pension déjà acquis en répartition de **397 % du PIB en 2021** (368 % en 2015, 431 % en 2018) ; les droits « financés » sont affichés à 0 ([Eurostat nasa_10_pens1, FR](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nasa_10_pens1?geo=FR&unit=PC_GDP&na_item=F63_LE&format=JSON&lang=EN), mise à jour 10/03/2026). C'est la « dette implicite » à honorer pour une sanctuarisation, dépendante du taux d'actualisation.

### 1.3 Rendement implicite de la répartition contre rendement des marchés

- **Répartition (fait + estimation)** : le COR calcule un **taux de rendement interne** net du cas type de non-cadre du privé à carrière complète : il décroît de la génération 1940 aux générations du début des années 1970 puis se **stabilise**, à **0,8 % réel pour la génération 2000** (actualisation selon le salaire moyen par tête ; COR 2026, pdf p. 141-142). Le rendement est plus élevé pour les revenus modestes (redistribution). La condition d'Aaron (1966) dit que le rendement de la répartition tend vers la croissance de la masse salariale ([Sinn, NBER WP 7592, section 4](https://www.nber.org/system/files/working_papers/w7592/w7592.pdf)). **Estimation** : productivité +0,7 %/an et cotisants −0,13 %/an (30,6 → 28,9 M sur 45 ans) donnent ≈ +0,6 %/an réel, cohérent avec 0,8 % du COR. ⚠️ V2658.
- **Marchés (faits sourcés)** :
  - Actions, 16 pays, 1870-2015 : **4,64 %/an réel composé** (6,89 % en moyenne arithmétique) ; logement 6,61 % ([Jordà et al., FRBSF WP 2017-25](https://www.frbsf.org/wp-content/uploads/wp2017-25.pdf), repris de `modeles/retraites/donnees/rendements_et_fonds.csv`) ; **France : actions 3,25 %** sur 1870-2015, obligations 0,83 %.
  - Fonds norvégien : **6,6 % nominal et 4,3 % réel net** par an de 1998 à 2025 ; frais 0,04-0,05 % ([NBIM, rapport annuel 2025](https://www.nbim.no/contentassets/6db259ec684645ebbf171cacbe7cc7de/annual-report-2025.pdf), pdf p. 8 et 11).
  - OCDE : rendement réel moyen des fonds de pension de **≈ 4 % ou plus sur 20 ans** au Canada et en Australie ; USD 69,8 trillions d'actifs de retraite dans l'OCDE fin 2024, dont 6,7 en fonds de réserve publics ([OCDE, Pension Markets in Focus 2025](https://www.bollettinoadapt.it/wp-content/uploads/2025/11/b095d0a0-en.pdf), pdf p. 6 et 23 ; copie hébergée par un tiers, ⚠️ V2661). Les rendements réels de 2024 étaient supérieurs à la moyenne longue ; sur 5 ans, les gains de 2024 n'ont pas effacé les pertes de 2022 dans 21 pays sur 33.
- **Lecture (estimation, règle 3)** : 0,6 à 0,8 % contre 3 à 4,5 % réel net, soit un écart de **3 points ou plus**. Mais, d'après Sinn et Barr-Diamond (§ 3), cet écart ne se transforme pas en gain net sans payer la transition, et il est un rendement **avant ajustement du risque** (les actions ont un écart-type de 22 % par an, JST). Le logement a rapporté autant que les actions avec moitié moins de volatilité : un fonds « d'actifs réels » ne doit pas être 100 % actions.

## 2. Les modèles étrangers

Tableau comparatif (OCDE, [Pensions at a Glance 2025](https://www.bollettinoadapt.it/wp-content/uploads/2025/12/e40274c1-en_compressed.pdf), tableaux 4.5 p. 171 et 8.1 p. 221, copie tierce ⚠️ V2661) : cotisation obligatoire totale en 2024 et taux de remplacement **net** d'un salarié moyen à carrière complète entrant aujourd'hui (régimes obligatoires publics et privés).

| Pays | Cotisation obligatoire totale (2024) | Remplacement net, salaire moyen | Architecture |
|---|---|---|---|
| France | 27,8 % | 70,0 % | répartition en points / annuités |
| Suède | 22,3 % | 66,3 % | comptes notionnels + part capitalisée + occupationnel |
| Pays-Bas | 36,6 % | **96,0 %** | AOW de base + fonds professionnels capitalisés |
| Norvège | 22,8 % | 54,9 % | répartition notionnelle ; le fonds souverain est alimenté par le pétrole, non par les cotisations |
| Canada | 11,9 % | 45,1 % | CPP (réserves capitalisées) + OAS résidentielle |
| Australie | 11,5 % (employeur) | 53,0 % | superannuation capitalisée + Age Pension sous conditions de ressources |
| Chili | 12,6 % | 61,3 % (après la réforme de 2025 : +17 points) | comptes individuels + PGU + assurance sociale |
| Moyenne OCDE | — | 63,2 % (« 63 % ») | |

Lecture : le taux de remplacement dépend du niveau de cotisation, pas seulement du mode de financement (Pays-Bas : 36,6 %, 96 % ; Canada : 11,9 %, 45 %). Le taux de remplacement français est élevé pour une cotisation comparable à la suédoise.

### 2.1 Suède (comptes notionnels + « premium pension »)

- **Faits** : cotisation de 18,5 % de la base ; **16 % vers le compte notionnel** (pension de revenu, en répartition) et **2,5 % vers la pension par capitalisation** à comptes individuels ([Pensionsmyndigheten, Orange Report 2020, pdf p. 23](https://www.pensionsmyndigheten.se/statistik/publikationer/orange-report-2020/orange-report-2020.pdf)). Coût moyen de la pension capitalisée : **0,21 %** du capital en 2020, avec une remise sur les frais de gestion des fonds de ≈ 0,35 point (même source, pdf p. 26).
- Fin 2025 ([Orange rapport 2025, en suédois](https://www.pensionsmyndigheten.se/statistik/publikationer/orange-rapport-2025/orange-rapport-2025.pdf), pdf p. 4-5) : **actifs du système de pension de revenu 13 604 Md SEK**, dont fonds tampons AP 2 234 Md SEK et « actif de cotisation » (valeur actualisée des cotisations futures, notionnel) 11 370 Md SEK ; **passifs 11 859 Md SEK** ; **ratio d'équilibre 1,1472** ; la « durée de rotation » d'une couronne est de 31 ans (entrée à 45 ans, sortie à 76 ans) ; rendement du capital des fonds tampons en 2025 : 5,8 % (124 Md SEK) ; pension capitalisée : 2 858 Md SEK. Le système est **autonome** (hors budget de l'État) : si les passifs dépassent les actifs, un **frein automatique** abaisse l'indexation ; le groupe parlementaire des retraites s'est accordé le 26/08/2025 pour ajouter un « accélérateur » symétrique quand il y a excédent ; AP1 et AP6 ont été fermés au 01/01/2026 (consolidation des fonds tampons).
- **Ce qui marche** : stabilité financière automatique, coût de gestion faible, lisibilité de l'enveloppe orange. **Ce qui fait débat** : le niveau de pension relatif baisse quand le frein s'active (en 2010 pour la première fois, ⚠️ non relu) ; **la part capitalisée est restée petite (2,5 points)**, donc la transition n'a presque rien coûté et n'a presque rien changé. Rendement du fonds public par défaut AP7 : 7,4 % nominal par an de 2000 à 2022 contre 4,8 % pour les fonds privés du système (IPE, secondaire, ⚠️ V2651).

### 2.2 Pays-Bas (fonds professionnels, réforme Wtp)

- **Faits** : cotisation totale 36,6 % (dont 18,0 % de régime de base AOW du côté salarié et 18,6 % de cotisations de second pilier), remplacement net 96 % (OCDE PaG 2025). **97,5 %** des actifs étaient en régimes à prestations définies fin 2023 ; la loi sur l'avenir des retraites (**Wtp**) est en vigueur depuis le **01/07/2023** et oblige les fonds à passer à des régimes à cotisations définies (collectives) **avant le 01/01/2028** ([OCDE PMF 2025, pdf p. 14](https://www.bollettinoadapt.it/wp-content/uploads/2025/11/b095d0a0-en.pdf)). Taux de couverture des régimes à prestations définies : **116,4 %** (2024, même source, tableau 1.1).
- **DNB, 27/10/2026** (page lue par WebFetch ; PDF/serveur non accessible par curl, ⚠️ V2653) : **42 fonds** avaient basculé au 30/09/2026 ; actifs totaux **1 630 Md€**, dont **566 Md€** sous le nouveau régime ; taux de couverture moyen des fonds restants 136,1 % ([DNB, news update 2026 Q3](https://www.dnb.nl/en/general-news/news-2026/news-update-pension-transition-and-pension-fund-funding-ratios-2026q3/)).
- **Ce qui marche** : un pilier professionnel obligatoire capitalisé, les plus gros actifs de retraite par habitant de l'OCDE et un remplacement net de 96 %. **Ce qui pose problème** : des rendements garantis qui se sont avérés intenables (d'où la réforme) ; la transition sur 5 ans est une opération gigantesque (1,8-1,9 Md€ soit ≈ 150 % du PIB néerlandais selon une note de gestionnaire, secondaire ⚠️) ; c'est un système né dans les années 1950-60, c'est-à-dire **sans** double charge au départ (équivalent de la « première génération » de Sinn).

### 2.3 Norvège (fonds souverain)

- **Faits** : le Government Pension Fund Global valait **21 268 Md NOK** fin 2025 (71,3 % actions) ; rendement 2025 : 15,1 % ; **6,6 % par an nominal de 1998 à 2025, 4,3 % réel net** ; frais de gestion **0,05 %** par an en moyenne 2013-2025 (0,04 % en 2025). Depuis le premier versement en 1996 : entrées cumulées **6 191 Md NOK**, retraits cumulés **687 Md NOK**, **rendement cumulé 13 457 Md NOK** (≈ 63 % de la valeur) ([NBIM, rapport annuel 2025, pdf p. 8, 15](https://www.nbim.no/contentassets/6db259ec684645ebbf171cacbe7cc7de/annual-report-2025.pdf)). Plafond de 10 % des droits de vote d'une société cotée.
- **À ne pas confondre** : ce fonds est alimenté par les revenus du pétrole, **non** par les cotisations retraite. La pension norvégienne est un régime en répartition notionnelle (22,8 % de cotisation). Le fonds illustre la **gouvernance** (mandat du ministère des Finances, gestion à coûts très bas, comité d'éthique : le ministère en a nommé un pour revoir le cadre éthique, mêmes pages) et le poids du rendement, pas une « capitalisation des retraites ».

### 2.4 Canada (CPP Investments)

- **Faits** : actifs nets **793,3 Md CAD** au 31/03/2026 (714,4 un an plus tôt) ; rendement net de l'exercice **7,8 %** contre **13,2 %** pour le portefeuille de référence (écart −5,4 points) ; **8,8 %/an nominal sur 10 ans** ([CPP Investments, communiqué du 20/05/2026](https://www.newswire.ca/news-releases/cpp-investments-net-assets-total-793-3-billion-at-2026-fiscal-year-end-814459989.html), repris de `rendements_et_fonds.csv`). Cotisation totale 11,9 % ; remplacement net 45,1 % (OCDE) ; **57,4 %** des actifs de régimes professionnels en prestations définies (2022, OCDE PMF).
- **Ce qui marche** : un régime public en répartition partiellement capitalisée, géré par un organisme professionnel distinct du gouvernement (⚠️ V2652 : statut juridique et indépendance à lire dans la loi de 1997 et le rapport du Chief Actuary). **Ce qui fait débat** : une gestion active chère et plus complexe qu'un indice (le portefeuille actif n'a pas battu son indice sur l'exercice 2026).

### 2.5 Chili (AFP, réformes 2008 et 2025)

- **1981** : comptes individuels obligatoires gérés par des AFP privées. Le **déficit de transition** du régime civil a atteint **≈ 7 % du PIB par an** les cinq premières années puis ≈ 3 % en 2003 ; il devait se résorber vers 2030 ; il a été financé surtout par des **excédents budgétaires de plus de 5 % du PIB** (hausses d'impôts, coupes, vente d'entreprises publiques) et un peu de dette ([Soto, Boston College CRR, Issue in Brief n° 31, juin 2005](https://crr.bc.edu/wp-content/uploads/2005/06/ib_31_508c.pdf)). BBVA Research le résume à **≈ 4 points de PIB potentiel par an, « élevé et persistant »** depuis 1981 ([Melguizo et al., BBVA, Banca d'Italia, 03/2009](https://www.bbvaresearch.com/wp-content/uploads/mult/090328_Pensionreformandfiscalpolicyinchile_tcm348-191867.pdf), diapositives 5-9 ; projection 2,3 % en 2020, 1,5 % en 2025). Le déficit de départ de l'ancien système était supérieur au PIB (dette implicite) ; les coûts : déficit de l'ancien régime, bons de reconnaissance, pensions minimales.
- **Résultats mitigés (même source Soto, 2005)** : rendement **réel de 10,29 %** par an sur 1982-2005 ; mais **environ 40 % des travailleurs** ne cotisent pas à un instant donné (chômage, informalité, travailleurs indépendants à 93 % hors système) ; **plus d'un cinquième** du capital potentiel est absorbé par les frais et commissions pour un salarié moyen ayant cotisé 23 ans ; la pension minimale exige 20 ans de cotisations. Données de 2005 : ⚠️ V2649 (à actualiser).
- **2008 puis 2022** : un pilier de solidarité financé par l'impôt (PBS puis PGU « quasi universel » en 2022). **Réforme de 2025 (loi 21.735)** : cotisation patronale de **1,5 → 8,5 %** d'ici 2033-2034 (9 à 11 ans) ; sur 8,5 %, **4,5 points** vont aux comptes individuels, 1,5 à l'assurance invalidité-survie, 1,0 à une compensation pour les femmes (tables de mortalité par sexe), et 1,5 à une pension contributive de base et à des obligations garanties ; la PGU est relevée de 11,6 % ; **enchères** des comptes (10 % tous les deux ans dès 2027) pour faire baisser les frais ; fonds cibles par génération dès 2027 ([OCDE PaG 2025, pdf p. 45-46](https://www.bollettinoadapt.it/wp-content/uploads/2025/12/e40274c1-en_compressed.pdf) ; [ministère du Travail et de la Prévoyance sociale, présentation de septembre 2025](https://previsionsocial.gob.cl/wp-content/uploads/2025/09/PPT_REFORMA_EMPLEADOR.pdf)). Effet : taux de remplacement net **+17 points à 61 %** pour un homme moyen ; taux de participation aux régimes obligatoires de 87,6 % de la population en âge de travailler en 2024 (OCDE PMF, tableau 3.1).
- **Lecture (opinion défendable)** : le Chili n'est pas un échec de la capitalisation ni sa preuve ; c'est la démonstration qu'une capitalisation **seule** n'a pas protégé les carrières courtes et que le pays a fini par ajouter un socle et une cotisation solidaire (⚠️ « bilan contesté » : lire les évaluations de la Commission Marcel 2006 et de la Superintendencia des pensions, V2649).

### 2.6 Australie (superannuation)

- **Faits** : actifs totaux de la superannuation **4 767,2 Md AUD** au 30/06/2026 (4 353,9 un an plus tôt, +9,5 %) ; cotisations de l'année (entités de plus de six membres) 236,3 Md AUD ; prestations versées 148,2 Md AUD ; **rendement annuel 8,6 %**, **5 ans annualisé 6,3 %** (nominal, net) ([APRA, Quarterly superannuation performance statistics highlights, juin 2026](https://www.apra.gov.au/quarterly-superannuation-performance-statistics-highlights-june-2026), publié le 31/08/2026 ; une ligne du tableau, « régimes du secteur public exemptés 187,8 », est incohérente avec le total, ⚠️ V2654). Cotisation obligatoire de l'employeur : 11,5 % en 2024 (OCDE PaG, tableau 8.1) ; rendement réel moyen des fonds ≈ 4 % ou plus sur 20 ans (OCDE PMF). **L'Age Pension**, sous conditions de ressources, vaut 26,2 % du salaire moyen brut et est perçue par 55 % des plus de 65 ans (OCDE PaG, tableau 3.2).
- **Ce qui marche** : un système mature, croissant, avec des actifs en forte croissance (+9,5 % en un an) ; mais le taux de remplacement net est modeste (53 %) et dépend d'un filet public ciblé ; plus de la moitié des plus de 65 ans perçoivent encore l'Age Pension. **Ce qui fait débat** : le grand nombre de petits fonds et de frais, la concentration de l'épargne chez les hauts revenus (⚠️ à documenter).

## 3. La transition répartition → capitalisation

### 3.1 Ce que dit la littérature

- **Sinn (2000, NBER WP 7592)** : en valeur actuelle, « il n'y a **rien à gagner** d'une transition vers un système par capitalisation, même si celui-ci offre un rendement durablement plus élevé » ; la somme des charges fiscales implicites et explicites qui résultent du respect des droits existants est **la même quelle que soit la stratégie de transition** ; une fois les gains d'introduction distribués, il peut être « difficile, voire impossible » de concevoir une transition améliorant le sort de tous (références : Lüdeke 1988, Breyer 1989, qui est la référence du « pas de repas gratuit »). Mais **une capitalisation partielle** peut aider face à la crise démographique : elle remplace le « capital humain manquant » par du capital réel et **lisse la charge** entre générations ([Sinn, résumé et sections 1, 2, 8](https://www.nber.org/system/files/working_papers/w7592/w7592.pdf)).
- **Barr et Diamond (2006, Oxford Review of Economic Policy)** : l'argument « la capitalisation est meilleure si le rendement des marchés dépasse la croissance des salaires » est **faux** parce qu'il ne compare pas des situations comparables (coûts de transition, risque, frais) ; la transition peut retomber sur les retraités en place (en rompant des promesses), sur les travailleurs (impôt) ou sur les générations suivantes (dette) : **on peut changer le profil dans le temps, pas le total** ; seul un gain causal sur la croissance modifierait le tableau, ce qui reste controversé ; le terme « coût de transition » **suggère à tort quelque chose de petit** (Chili : « avec plusieurs décennies encore à venir ») ; les **comptes notionnels** reproduisent la logique des comptes individuels sans fonds ([Barr et Diamond, version acceptée, sections 3.3 et notes 26-32](https://researchonline.lse.ac.uk/id/eprint/2630/1/economics_of_pensions_final.pdf)).
- **Feldstein, Samwick, Banque mondiale (1994), Börsch-Supan** : plaident au contraire qu'une transition crée des gains d'efficacité (épargne, marchés du travail, rendement). Leurs textes sont des scans non lisibles par extraction (NBER w6149 ; w6603) ou non téléchargeables ; **estimations chiffrées non lues, ⚠️ V2655**. Sinn les cite (p. 2) comme camp des gains d'efficacité.
- **Le Chili comme cas test** : transition financée par des excédents primaires > 5 % du PIB, déficit de 7 % puis 3-4 % pendant plus de 25 ans (§ 2.5). Il montre que **la charge est une affaire de décennies** et qu'elle n'est supportable qu'avec une discipline budgétaire exceptionnelle.

### 3.2 Estimation pour la France (ce dossier)

Calcul : [`sources/calculs/t48_capitalisation.py`](calculs/t48_capitalisation.py). Cohortes simplifiées : carrière de 40 ans, retraite de 22 ans ; assiette salariale **1 466,5 Md€** (coût employeur 2024, `modeles/offre-de-travail/methode.md`) ; cotisation obligatoire moyenne de 27,8 % (OCDE) ; **1 point ≈ 14,7 Md€/an** (≈ 0,49 % du PIB) ; dépenses 422,2 Md€ constantes en euros constants. On détourne +1 point tous les 3 ans vers un fonds ; la **double charge** de l'année = points détournés − pensions que le fonds prend en charge cette année-là. ⚠️ V2657 (assiette), V2659 (modèle).

| Montée en charge (points détournés) | Surcoût net au pic | Surcoût net à 10 / 30 / 45 ans | Cumul à 20 ans / 30 ans | Fonds à 30 ans (r = 2 / 3,5 / 5 %) |
|---|---|---|---|---|
| **1 point** (en année 0) | 15 Md€/an (0,5 % PIB) | 14 / 7 / 2 | 270 / 364 Md€ | 507 / 658 / 862 Md€ |
| **3 points** (1 pt tous les 3 ans) | **44 Md€/an (1,5 %)**, an 6 | 42 / 25 / 8 | 703 / 1 016 Md€ | 1 363 / 1 718 / 2 184 Md€ |
| **6 points** | **83 Md€/an (2,8 %)**, an 15 | 57 / 60 / 27 | 1 049 / 1 755 Md€ | 2 251 / 2 742 / 3 370 Md€ |

Lecture : plus la montée est rapide, plus la bosse est haute ; la charge **ne disparaît qu'après ≈ 55-65 ans** (première génération entièrement servie par le fonds), mais elle **diminue de moitié en 25 à 30 ans**. Les chiffres de fonds sont des **majorants** : les pensions du fonds sont comptées au montant « équivalent répartition » ; le surplus de rendement (r > g) gonfle le fonds, c'est le « gain » de Sinn, payé par la génération de la transition. Pour comparaison : réserves actuelles **245 Md€** ; fonds norvégien ≈ 1 800 Md€ ⚠️ (conversion `rendements_et_fonds.csv`). En régime permanent, le surcoût net s'annule parce que le détournement de c points est compensé par une réduction de la dépense de c/27,8 × 422 Md€ ≈ c × 15,2 Md€ (identité, hypothèse H6).

**Sensibilité (estimation)** : croissance de l'assiette à 0,6 %/an : pic 45 contre 44 Md€ (3 points), 91 contre 83 Md€ (6 points) ; rendement de 2 à 5 % : change surtout la taille du fonds, pas le surcoût. **Pas de calcul** ici des effets d'épargne (substitution à l'épargne privée de 0,65 à 0,75 € par euro de droit, `methode.md` H, ⚠️ V469), de prix d'actifs (un fonds de 1 à 2 fois le PIB placé en France ferait monter les cours) ni de krach.

### 3.3 Options de financement de la double charge

| Option | Ordre de grandeur | Avantage | Risque / objection |
|---|---|---|---|
| **Hausse temporaire de cotisation** (« double cotisation ») | 1 point = 14,7 Md€ | transparent | frappe les actifs d'aujourd'hui ; contredit la baisse du coin socio-fiscal voulue dans T47 |
| **Dette de transition** (règle d'or : amortie par le fonds) | 1 000 à 1 750 Md€ cumulés sur 30 ans | étale sur les générations suivantes (Barr-Diamond) | déficit de départ de 169 Md€ (voie R) ; spread souverain ; la dette créée est explicite alors que la dette implicite (397 % du PIB) était cachée |
| **Réserves et produits de cession** | réserves 245 Md€ ≈ 7 mois de dépenses ; participations de l'État (T32-T33, ⚠️ non chiffrées) | pas d'impôt nouveau | réserves déjà adossées aux complémentaires ; c'est de la dette implicite |
| **Baisse des dépenses de répartition** (nouveau décompte avec frein automatique) | solde COR −0,9 % en 2045, −2,4 % en 2070 | traite la cause | droits acquis sanctuarisés : ne s'applique qu'aux droits futurs ; effet lent |
| **Ressources de la rente ou de l'héritage** (idée de T13 : parts d'entreprises reçues au titre des successions) | 10 / 20 / 35 Md€/an dans `modeles/retraites` | recoupe la logique de l'impôt | double compte avec le budget, ⚠️ V460 |

### 3.4 Durée, générations, risques, droits acquis

- **Durée et générations** : 3 générations sont touchées : les retraités en place (aucun changement si sanctuarisation), les actifs de la bascule (qui paient deux fois une partie), les jeunes (qui héritent d'un fonds ou d'une dette). **≈ 60 ans** pour une transition complète à l'échelle des cohortes (carrière 40 ans + retraite 22 ans).
- **Risque de marché** : un krach réduit la valeur du fonds ; la **part capitalisée progressive** (≤ 6 points sur 27,8) limite l'exposition à ≈ 20 % des pensions, le reste restant en répartition (diversification entre risque salarial et risque de marché, Barr-Diamond). Séquence de rendements : le Nikkei a mis 34 ans à retrouver son niveau de 1989 (en nominal, `rendements_et_fonds.csv`).
- **Inflation** : actifs réels (actions, immobilier, infrastructures) vs obligations nominales ; les comptes notionnels sont indexés sur la masse salariale. Non chiffré.
- **Frais de gestion** : 0,04-0,05 % (NBIM), 0,21 % (Suède, 2020), ≥ 20 % du capital potentiel pour l'AFP d'un cotisant de 1982 à 2005 (Chili, Soto). Le **coût** est l'un des déterminants du choix : un fonds public indiciel à 0,05 % plutôt que des comptes individuels commissionnés.
- **Protection des droits acquis** : la sanctuarisation en points, avec garantie de valeur de service, est la forme la plus robuste ; l'article 1er du protocole n° 1 de la CEDH n'admet que des réductions proportionnées (⚠️ V471) ; la protection constitutionnelle française des droits à pension, non relue, est à documenter par la jurisprudence du Conseil constitutionnel (⚠️ V2662).

### 3.5 Variante chiffrée dans `modeles/retraites` (T48, 01/11/2026)

Code : [`modeles/retraites/capitalisation.js`](../modeles/retraites/capitalisation.js) (36 contrôles), méthode H21-H40 : [`methode.md`](../modeles/retraites/methode.md) § 9, résultats : [`resultats.md`](../modeles/retraites/resultats.md), section « Capitalisation progressive (T48) ». Ce modèle par générations **remplace** le calcul du § 3.2 pour le fonds (il est exactement provisionné) ; la double charge reste la même (pic 44-45 et 91 Md€/an).

1. Étape 0-1 (droits acquis sanctuarisés, nouveau décompte) : coût nul par construction ; redistribue : la conversion à l'espérance de vie moyenne fait perdre 13 % de valeur viagère à 19 ans de retraite et en fait gagner 13 % à 25 ans (⚠️ durées illustratives).
2. Pic de la double charge (central) : **15 Md€/an (0,48 % du PIB) à 1 point, 45 Md€ (1,43 %) en 2034 à 3 points, 91 Md€ (2,75 %) en 2042 à 6 points** ; sous 0,1 % du PIB seulement en 2070, 2081 et 2090.
3. Fonds à 30 / 60 ans (central) : 651 / 1 115 Md€ (1 pt), **1 760 / 3 335 Md€ (3 pts)**, 2 909 / 6 562 Md€ (6 pts) ; réserves actuelles : 245 Md€.
4. Financement par la dette à 1,5 % : 3 points laissent 2 724 Md€ de dette à 60 ans (63 % du PIB), 41 Md€/an d'intérêts ; le fonds la couvre au central (+611 Md€) mais **pas au bas** (−1 022 Md€) ; par prélèvement, 3 points de cotisation temporaires au pic (5,7 pour 6 points).
5. Pension d'un salarié né en 2000, 3 points, central : **+11 % en espérance** (Smic 1 491 contre 1 339 €/mois ; médian 2 334 contre 2 097 ; cadre 4 339 contre 3 906) ; +4 % à 1 point, +18 % à 6 ; même rapport à tous les niveaux de salaire.
6. Dispersion (σ 12 %, 3 000 tirages) : rapport p5 / p50 / p95 de **1,00 / 1,09 / 1,31** à 3 points ; probabilité de faire moins bien que la répartition seule : 4 % (central), 18 % (bas), 0,4 % (haut).
7. Stress (médian, 3 points) : krach de −40 % avant le départ +2,8 % ; rendement nul les 20 dernières années −0,4 % ; rendement réel nul toute la carrière −1,4 %.
8. Compartiment « intérêt commun » ≤ 15 % : −0,02 à −0,5 point de rendement et +0,03 à +0,24 point de volatilité ; actif net à 60 ans de 611 à 416 Md€ à −2 points d'écart ; 11 % de probabilité de perdre au test extrême (corrélation 0,9, volatilité 30 %) ; écarts **non sourcés** (⚠️ H35-H36).
9. Le gain est la prime de risque des actions (r − ρ), pas un gain de richesse (identité de Sinn testée) ; le risque de la répartition est supposé nul dans ce modèle.
10. La proposition se joue sur la gouvernance (H37) bien plus que sur le rendement ; l'étape 2c (6 points) dépasse 2 % du PIB de 2039 à 2057 et n'est pas finançable avec la voie R sans arbitrage.

| Étape | Points | Pic de double charge | Fonds à 30 / 60 ans | Dette à 60 ans (1,5 %) | Pension salarié 2000, médian (€/mois ; rapport à la répartition) | Probabilité de faire moins bien (σ 12 %) |
|---|---|---|---|---|---|---|
| 0-1 sanctuarisation + nouveau décompte | 0 | 0 | 0 | 0 | 2 097 (1,00) | 0 % |
| 2a | 1 | 15 Md€/an (0,48 %) | 651 / 1 115 Md€ | 933 Md€ (22 %) | 2 189 (1,04) | 4,1 % |
| 2b | 3 | 45 Md€/an (1,43 %) | 1 760 / 3 335 Md€ | 2 724 Md€ (63 %) | 2 334 (1,11) | 4,2 % |
| 2c | 6 | 91 Md€/an (2,75 %) | 2 909 / 6 562 Md€ | 5 208 Md€ (121 %) | 2 473 (1,18) | 3,9 % |

## 4. Pour la décision de l'auteur : le schéma proposé (opinion de Claude, à discuter)

Principes retenus : (a) **droits acquis intouchables** ; (b) **personne n'est ramené au minimum** : les droits futurs sont proportionnels aux cotisations versées ; (c) **actifs réels** et **entreprises d'intérêt commun** ; (d) l'ordre de grandeur de la bascule est connu et affiché à l'avance ; (e) **chaque étape est conditionnelle** (test chiffré).

| Étape | Calendrier | Contenu | Ordre de grandeur |
|---|---|---|---|
| **0. Sanctuarisation** | année 0 | Tous les droits acquis à la date T0 sont convertis en **points de droits acquis** (garantie légale de valeur de service ; indexation au moins sur les prix) ; loi organique. | 422 Md€/an de pensions inchangés ; dette implicite 397 % du PIB reconnue |
| **1. Nouveau décompte** | années 0-3 | **Compte unique en points ou comptes notionnels** pour tous les régimes (fusion progressive de la complexité) ; conversion actuarielle à la liquidation avec l'espérance de vie de la génération ; revalorisation des comptes sur la **masse salariale** ; **règle d'équilibre automatique** et symétrique (suédoise : frein et accélérateur) ; plancher du socle inchangé (T47). | pas de coût de départ ; remplace le solde COR −0,9 à −2,4 % du PIB par un ajustement automatique (≈ 27 à 72 Md€ à PIB 2025) ; ⚠️ la pension moyenne relative baisse déjà à 45,3 % du revenu d'activité en 2070 dans le scénario de référence (COR) |
| **2a. Premier point capitalisé** | années 1-5 | **1 point** de la cotisation vers un fonds public indépendant. Financement : dette de transition amortie par le fonds + part des cessions de participations ; test préalable : le déficit hors retraite est sous contrôle. | **≈ 15 Md€/an** (0,5 % du PIB) ; fonds ≈ 390 Md€ en 20 ans (r = 3,5 %) et ≈ 660 Md€ en 30 ans |
| **2b. Montée à 3 points** | années 5-15 | **+1 point tous les 3 ans** si le test passe : (i) déficit public < 3 % du PIB, (ii) fonds au moins égal à son benchmark, (iii) audit de gouvernance. | **≈ 44 Md€/an** (1,5 % du PIB) au pic ; fonds ≈ 1 700 Md€ à 30 ans (≈ 57 % du PIB, 7 fois les réserves actuelles) |
| **2c. Palier 6 points (option)** | à partir de l'année 15 | Seulement si le fonds a tenu 10 ans et si le Parlement le vote à la majorité qualifiée. | ≈ 83 Md€/an (2,8 %) ; fonds ≈ 2 700 Md€ à 30 ans |
| **3. Régime de croisière** | 40 à 60 ans | Les pensions de la part capitalisée sont servies par le fonds sous forme de rente ; la part répartition baisse d'autant. | surcoût net → 0 ; fonds ≈ 100 à 150 % du PIB |

### 4.1 Combien de points de cotisation

« 1 point » = 1 point de salaire brut sur 27,8 % de cotisation retraite actuelle (OCDE) ; la part capitalisée des pensions serait de c/27,8 : **3,6 %** (1 point), **10,8 %** (3 points), **21,6 %** (6 points). C'est la même échelle que la Suède (2,5 sur 18,5 : 13,5 %) et très en deçà du Chili (4,5 des 8,5 points patronaux, plus les 10 salariaux) ou des Pays-Bas (≈ 50 % du total).

### 4.2 Où investir (actifs réels, « entreprises d'intérêt commun »)

**Opinion de Claude, règle 7 appliquée** : le cœur du fonds doit être **diversifié et indiciel à bas coût** (modèle NBIM/AP7), avec un **compartiment plafonné** (ordre de grandeur : 10 à 15 % du fonds, soit ≈ 170 à 260 Md€ à 30 ans pour 3 points, sur ≈ 1 700 Md€) pour les « entreprises d'intérêt commun » (infrastructures, énergie, calcul), investi selon des critères de **rendement commercial, mesurés et publiés**. Raisons : (1) risque de concentration sur un thème (IA, data centers) qui aurait la même corrélation que les cours des actions de technologie ; (2) risque de décisions d'allocation politisées ; (3) règles d'aides d'État de l'UE (⚠️ à analyser) ; (4) Sinn : le fonds doit s'ajouter à l'épargne, non l'orienter vers des choix publics ; (5) l'immobilier et les infrastructures ont un rendement réel de long terme comparable aux actions (JST), avec moins de volatilité, mais moins de liquidité. Le lien avec T32-T33 (participations publiques) et l'ARPA-E reste à écrire.

## 5. La meilleure objection et la réponse (steelman, règle 5)

**Objection (Sinn, Barr-Diamond, Breyer)** : « Vous financez deux fois la même retraite. Le gain de rendement n'existe que si l'on oublie la transition ; il retombe sur la génération des actifs d'aujourd'hui, qui sont déjà celles dont T47 aggrave le sort (le smicard à 35 h perd 233 € par mois à l'équilibre). Vous ajoutez le risque de marché, un nouvel organisme à capturer politiquement, et des frais ; la France a déjà vu son fonds de réserve détourné vers la Cades. Ajustez la répartition (âge, indexation, cotisation) et ne touchez à rien d'autre. »

**Réponse** : (1) **elle est juste sur le gain gratuit** et ce document le confirme : la proposition ne le vend pas, elle le chiffre (≈ 0,5 % du PIB par point) et le conditionne à des tests ; (2) la raison de changer n'est **pas** le rendement ; c'est la **diversification du risque** (aujourd'hui, 100 % des pensions dépendent de la masse salariale française, que la démographie, qui ramène le rapport 20-64/65+ de 2,5 à 1,62, et peut-être l'automatisation, érodent) ; la capitalisation partielle de Sinn « remplace le capital humain manquant par du capital réel » et **s'applique** à ce cas ; (3) un fonds public indiciel à frais quasi nuls (0,05 %) répond à l'objection des frais ; (4) le risque politique est réel et traité par la gouvernance (§ 6) ; le détournement du FRR vers la Cades montre le risque, mais le FRR n'avait **pas** de règle de non-retrait constitutionnelle ; (5) **concession** : si la voie R (T47) ne dégage aucune marge budgétaire, l'étape 2 doit **attendre** ; seule l'étape 0-1 (nouveau décompte, sanctuarisation) est indépendante et peut être décidée seule ; (6) alternative honnête : ajuster seulement la répartition coûte moins cher à court terme mais n'ajoute **aucun** actif réel et ne répond pas à l'argument de l'auteur sur le partage de la valeur créée par l'IA (c'est le même argument que dans `modeles/retraites/resultats.md`, § 7).

**Autres objections à garder** : (a) « la sanctuarisation coûte 397 % du PIB de dette implicite » : oui, mais cette dette existe déjà ; l'expliciter n'est pas la créer ; (b) « les comptes notionnels baissent les pensions de tous » : oui à long terme (45 % du revenu d'activité en 2070 dans le scénario de référence même sans réforme, COR) ; (c) « il n'y a pas assez d'actifs réels investissables en France » : placement mondial majoritaire (comme NBIM).

## 6. Gouvernance du fonds (indépendance, règles d'investissement, conflits d'intérêts)

- **Précédents d'échec (secondaires, ⚠️ V2656, repris de `modeles/retraites/donnees/precedents_transition.csv`)** : Argentine (2008, ≈ 24 Md USD d'actifs de comptes individuels renationalisés), Hongrie (2010-2011, ≈ 10 Md€ transférés à l'État), Pologne (2014, ≈ 50 % des actifs des fonds de pension, essentiellement des titres publics, transférés au régime public) ; en France, le FRR est affecté depuis 2011 au remboursement de la dette sociale (2,1 Md€/an, puis 1,45 Md€/an en 2025-2033), alors qu'il n'a que 20,7 Md€ (COR).
- **Précédents de bonne pratique (faits)** : fonds norvégien : mandat explicite du ministère des Finances, tracking error limité (0,62 point sur 1998-2025), plafond de 10 % des droits de vote, publication de tout, frais de 0,05 % (NBIM 2025) ; Suède : système **autonome**, actifs et passifs publiés chaque année (Orange report) ; Canada : organisme professionnel indépendant (⚠️ V2652).
- **Règles proposées (opinion de Claude, à discuter)** :
  1. **Loi organique + verrou constitutionnel** : le fonds est la propriété des cotisants ; aucun retrait ni prêt à l'État hors règle écrite ; toute modification à la majorité des 3/5.
  2. **Conseil indépendant** de gestionnaires nommés pour un mandat long, **sans ministre en exercice** ; les nominations passent par une commission du Parlement et un comité de professionnels ; déclarations d'intérêts publiées auprès de la HATVP.
  3. **Politique d'investissement écrite et publique** : cœur indiciel mondial, plafonds par émetteur, par pays (maximum de 10 à 20 % en France), par secteur ; compartiment « intérêt commun » plafonné (§ 4.2), sélectionné par un comité d'investissement qui ne peut pas être celui de l'État actionnaire ; **pas de participation de l'État actionnaire** aux décisions (séparation entre l'État investisseur et l'État régulateur).
  4. **Transparence** : portefeuille, votes en assemblée, frais, performance contre indice publiés ; audit annuel de la Cour des comptes ; données ouvertes (cohérent avec la méthode du projet).
  5. **Règle de décaissement** fixée à l'avance (les pensions servies par le fonds ne peuvent excéder le capital acquis par chaque cohorte) ; pas de ponction pour combler un déficit.
  6. **Conflits d'intérêts** : interdiction de détenir des positions personnelles dans les mêmes titres pendant le mandat ; « revolving doors » encadrées ; contrôle de la HATVP.
- **Question ouverte (honnête)** : la France n'a pas de tradition d'indépendance de ce type pour un fonds de cette taille (le FRR et la Caisse des dépôts sont des précédents partiels) ; la règle 7 s'applique : la proposition vaut ce que vaut son verrou institutionnel.

## 7. Ce qui appuie, nuance ou contredit les thèses de l'auteur

**Appuie** : un fonds public à frais bas est possible (NBIM 0,05 %, AP7) ; la Suède montre un système de comptes lisible et autonome ; les cohortes récentes ont un rendement interne faible dans la répartition (0,8 %) ; le Chili et l'Australie montrent qu'une capitalisation obligatoire accumule des actifs importants.
**Nuance** : le gain de rendement est payé par la transition (Sinn, Barr-Diamond) ; la Suède n'a capitalisé que 2,5 points ; le Chili a dû ajouter un socle et 7 points patronaux.
**Contredit** : « la répartition est à bout de souffle » (le COR projette 14,1 à 15,3 % du PIB ; déficit −0,9 % en 2045) ; « les cotisations investies rapportent mécaniquement 4 à 5 % » (c'est un rendement avant risque, et en France les actions n'ont rapporté que 3,25 % réel sur 1870-2015) ; « une nouvelle structure ne sera pas détournée » (précédents).

## 8. Manques et suite

- Lire les estimations chiffrées de Feldstein (1997, 2005), Feldstein-Samwick, Börsch-Supan et de la Banque mondiale (1994) (V2655).
- Actualiser le bilan du Chili (Superintendencia de Pensiones ; Commission Marcel ; rapports 2025).
- ~~Charger l'architecture dans `modeles/retraites`~~ **fait le 01/11/2026** (§ 3.5, sans cohortes réelles ni effets d'épargne) ; reste à la charger dans `modeles/systeme-ideal` (T47) et le simulateur, avec cohortes réelles et effets d'épargne.
- Examiner le droit : droit de l'UE (aides d'État, libre circulation des capitaux), CEDH, jurisprudence du Conseil constitutionnel sur les droits à pension (V2662).
- Préciser l'assiette : un point de cotisation sur les salaires **plafonnés** n'a pas la valeur d'un point de masse salariale totale (V2657).

## Synthèse des sources mobilisées

| Source | Ce qu'elle établit |
|---|---|
| [COR, rapport annuel juin 2026](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf) | dépenses 422,2 Md€ (14,1 % du PIB), cotisants 30,6 M, ratio 1,8 → 1,3, solde −0,2 → −2,4 % du PIB, réserves 244,6 Md€, TRI 0,8 % (génération 2000) |
| [Eurostat nasa_10_pens1](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nasa_10_pens1?geo=FR&unit=PC_GDP&na_item=F63_LE&format=JSON&lang=EN) | droits à pension acquis : 397 % du PIB en 2021 |
| [OCDE, Pensions at a Glance 2025](https://www.bollettinoadapt.it/wp-content/uploads/2025/12/e40274c1-en_compressed.pdf) | cotisations totales, taux de remplacement, réforme chilienne de 2025 |
| [OCDE, Pension Markets in Focus 2025](https://www.bollettinoadapt.it/wp-content/uploads/2025/11/b095d0a0-en.pdf) | actifs de retraite 69,8 trillions USD, rendements réels, Wtp néerlandaise |
| [Pensionsmyndigheten, Orange Report 2020](https://www.pensionsmyndigheten.se/statistik/publikationer/orange-report-2020/orange-report-2020.pdf) et [2025](https://www.pensionsmyndigheten.se/statistik/publikationer/orange-rapport-2025/orange-rapport-2025.pdf) | 16 % + 2,5 %, ratio d'équilibre 1,1472, actifs et passifs, frais 0,21 % |
| [NBIM, rapport annuel 2025](https://www.nbim.no/contentassets/6db259ec684645ebbf171cacbe7cc7de/annual-report-2025.pdf) | fonds de 21 268 Md NOK, 4,3 % réel net, frais 0,05 %, 63 % de la valeur venant du rendement |
| [DNB, 27/10/2026](https://www.dnb.nl/en/general-news/news-2026/news-update-pension-transition-and-pension-fund-funding-ratios-2026q3/) | 42 fonds basculés, 1 630 Md€, 566 Md€ sous Wtp |
| [APRA, juin 2026](https://www.apra.gov.au/quarterly-superannuation-performance-statistics-highlights-june-2026) | superannuation 4 767 Md AUD, rendement 8,6 % et 6,3 % sur 5 ans |
| [CPP Investments, 20/05/2026](https://www.newswire.ca/news-releases/cpp-investments-net-assets-total-793-3-billion-at-2026-fiscal-year-end-814459989.html) | 793,3 Md CAD, 8,8 % sur 10 ans |
| [Soto, Boston College CRR, 2005](https://crr.bc.edu/wp-content/uploads/2005/06/ib_31_508c.pdf) ; [BBVA Research, 2009](https://www.bbvaresearch.com/wp-content/uploads/mult/090328_Pensionreformandfiscalpolicyinchile_tcm348-191867.pdf) | coût de la transition chilienne (7 % puis 3-4 % du PIB), couverture, frais |
| [Ministère chilien de la Prévoyance sociale, 09/2025](https://previsionsocial.gob.cl/wp-content/uploads/2025/09/PPT_REFORMA_EMPLEADOR.pdf) | loi 21.735 : cotisation patronale 8,5 %, répartition des points |
| [Sinn, NBER WP 7592 (2000)](https://www.nber.org/system/files/working_papers/w7592/w7592.pdf) | pas de gain en valeur actuelle ; intérêt d'une capitalisation partielle ; condition d'Aaron |
| [Barr et Diamond (2006)](https://researchonline.lse.ac.uk/id/eprint/2630/1/economics_of_pensions_final.pdf) | le coût de transition ne se supprime pas, il se déplace ; notionnels |
| [Jordà et al., FRBSF WP 2017-25](https://www.frbsf.org/wp-content/uploads/wp2017-25.pdf) | rendements réels de long terme (repris de T13) |
