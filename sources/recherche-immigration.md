# Recherche : immigration, démographie, économie, et l'avenir avec les robots

> Note de recherche pour le manifeste. Toutes les sources ont été consultées le **2026-10-25**.
>
> **Méthode.** J'ai interrogé directement les bases Eurostat (API), et lu les publications primaires de l'Insee (2026), du COR (rapport de juin 2026) et du CEPII. Pour la DGEF, l'OCDE et plusieurs articles scientifiques, je n'ai eu accès qu'aux résumés, aux reprises de presse ou à des sources secondaires : c'est signalé à chaque fois par `⚠️`. Les séries chiffrées sont dans `sources/donnees/immigration_*.csv`.
>
> **Légende**
> - Nature : **[Fait]** (chiffre officiel mesuré) · **[Estimation]** · **[Projection]** (calcul conditionnel à des hypothèses, ce n'est pas une prévision) · **[Étude]** (résultat publié) · **[Interprétation]** (lecture de Claude, discutable).
> - Sens pour la thèse examinée (aucun des deux extrêmes n'est fondé) : ✅ appuie · ⚖️ nuance · ❌ contredit.

---

## 0. Synthèse en une page

| Question | Ce que disent les données | Robustesse | Sens |
|---|---|---|---|
| La France est-elle un pays d'immigration massive en comparaison européenne ? | Part de personnes nées à l'étranger **dans la moyenne de l'UE** (14,0 % contre 14,4 %) ; **moins** de premiers titres par habitant que la moyenne (5,5 ‰ contre 8,6 ‰ en 2025) ; un peu **plus** de demandes d'asile par habitant (1,7 ‰ contre 1,5 ‰). | forte (Eurostat) | ✅ |
| L'immigration a-t-elle augmenté ? | Oui, nettement : 7,4 % d'immigrés en 1975, 8,5 % en 2010, 11,6 % en 2025. Le solde migratoire a presque triplé entre 2006-2016 et 2017-2021. | forte (Insee) | ⚖️ (le constat de hausse n'est pas un fantasme) |
| Peut-on renvoyer ceux qui doivent partir ? | La France prononce ≈ 28 % des ordres de quitter le territoire de toute l'UE, mais n'en exécute que ≈ 14 % (32 % en moyenne dans l'UE). | forte (Eurostat) | ⚖️ (la « fermeté » actuelle est surtout nominale) |
| L'immigration sauve-t-elle les retraites ? | Elle **aide** : un solde de +230 000/an au lieu de +150 000 réduit les dépenses de retraite de 1,1 point de PIB en 2070. Mais elle ne **renverse pas** le vieillissement, et l'effet s'estompe quand les immigrés vieillissent à leur tour. | forte (COR, Insee, Eurostat) | ✅ |
| Coûte-t-elle cher aux finances publiques ? | Les études sérieuses trouvent un effet net **faible**, entre environ −0,5 % et +0,2 % du PIB par an pour la France. Mais la moyenne cache des écarts très forts **selon le motif, l'âge d'arrivée et l'emploi** (Danemark, Pays-Bas, Royaume-Uni). | moyenne (dépend des conventions) | ✅ |
| Fait-elle baisser les salaires ? | Effet moyen proche de zéro à long terme ; effets négatifs possibles, concentrés sur les moins qualifiés et les immigrés déjà présents, à court terme. | forte (consensus de la recherche) | ⚖️ |
| Le problème français est-il le nombre ou l'intégration ? | Écart de taux d'emploi parmi les plus élevés d'Europe : 77,2 % pour les natifs contre 63,1 % pour les personnes nées hors UE (54,1 % pour les femmes) en 2025. | forte (Eurostat) | ✅ |
| Les robots rendront-ils l'immigration inutile ? | Pas démontré. Le Japon et la Corée, champions de la robotique, ont des nombres de travailleurs étrangers record. La pénurie de main-d'œuvre **accélère** l'automatisation (et inversement). | moyenne | ✅ |
| Un revenu universel attirerait-il des migrants ? | Indice sérieux d'un effet d'appel des prestations (Danemark : élasticité de 1,3, contestée et ramenée à 0,1-0,3 par une réanalyse de 2026). Aucune expérience de revenu universel ne l'a testé. | faible à moyenne | ⚖️ |

**Lecture d'ensemble [Interprétation].** Les données ne donnent raison à aucun des deux discours dominants.

- **Contre l'ouverture totale.** Les coûts de l'immigration peu qualifiée et humanitaire sont réels, ils sont mal mesurés en France et ils dépendent fortement de l'emploi. Un revenu universel versé dès l'arrivée changerait l'équation.
- **Contre la fermeture.** Sans solde migratoire, la population active fond plus vite. Des secteurs entiers dépendent déjà de travailleurs immigrés (soins à domicile, BTP, restauration). Et la France n'est pas, en comparaison européenne, un pays d'immigration hors norme.

Le **levier qui compte le plus** dans les chiffres n'est ni l'ouverture ni la fermeture : c'est **la composition des flux** (motif, qualification, âge) et **le taux d'emploi après l'arrivée**.

---

## 1. Les chiffres de base

### 1.1 Définitions (Insee) — à fixer avant tout débat

- **Immigré** : personne née étrangère à l'étranger et résidant en France. Elle reste immigrée si elle devient française.
- **Étranger** : personne sans nationalité française. Elle peut être née en France (enfant d'étrangers pas encore naturalisé).
- **Descendant d'immigré** : personne née en France dont au moins un parent est immigré (2e génération). L'Insee mesure aussi une 3e génération : au moins un grand-parent immigré.

Les trois notions ne se recouvrent pas. Un débat qui les confond produit des chiffres incompatibles. De plus, la notion de « né à l'étranger » utilisée par Eurostat est plus large que celle d'immigré : elle inclut les Français nés à l'étranger, comme les rapatriés d'Algérie.

### 1.2 Le stock

**[Fait]** En 2025, selon des estimations provisoires de l'Insee, la France compte 68,9 millions d'habitants, dont :

| Population | Effectif | Part de la population |
|---|---|---|
| Immigrés | **7,97 millions** | **11,6 %** |
| dont naturalisés | 2,63 millions (33 % des immigrés) | |
| Étrangers | **6,30 millions** | **9,1 %** |
| dont nés en France | 0,95 million | |
| Nés à l'étranger (définition Eurostat) | 9,63 millions | 14,0 % |

[^insee-essentiel]

- **Origines.** Afrique 49,2 %, Europe 30,3 %, Asie 14,3 %, Amériques et Océanie 6,2 %. Premiers pays de naissance : Algérie (12,6 %), Maroc (11,7 %), Portugal (7,2 %), Tunisie (4,9 %).
- **Évolution.** La part des immigrés est passée de 7,4 % (1975) à 7,3 % (1999), 8,5 % (2010), 10,2 % (2020) et 11,6 % (2025). L'Insee signale une **rupture de série en 2024** : les chiffres 2024-2025 ne sont pas directement comparables aux précédents.
- **Descendants** (2019-2020, France métropolitaine) : 7,5 millions de descendants de 2e génération (12 % de la population). Environ un tiers des moins de 60 ans a au moins un parent ou un grand-parent immigré.

Données : `immigration_insee_stock_immigres_etrangers.csv`.

### 1.3 Les flux

**Entrées et sorties [Estimation].** Insee Première n° 2107 (juin 2026)[^insee-flux] :

- En 2024, 313 000 immigrés sont entrés en France, contre 347 000 en 2023 et 375 000 en 2022. Ce niveau est revenu à celui de 2019 (307 000).
- Les **sorties** d'immigrés (de 26 000 à 125 000 par an) et celles des non-immigrés (de 74 000 à 287 000 par an) pèsent lourd. L'expatriation des personnes nées en France est un phénomène méconnu du débat.
- Le solde migratoire total a atteint +271 000 en 2022, son plus haut niveau depuis 1962 (effet de la guerre en Ukraine). Pour 2023 à 2025, l'Insee le fixe conventionnellement à **+176 000** par an (estimation provisoire).
- Le COR note que le solde a été « quasiment trois fois plus élevé entre 2017 et 2021 (+163 000 en moyenne) qu'entre 2006 et 2016 (+59 000) »[^cor-tendances].

Série : `immigration_insee_flux_entrees_sorties.csv`.

**Premiers titres de séjour par motif [Fait].** Eurostat, données transmises par le ministère de l'Intérieur[^es-resfirst] :

| Année | Total | Familial | Études | Travail | Autres (dont humanitaire et asile) |
|---|---|---|---|---|---|
| 2008 | 188 723 | 85 475 | 52 226 | 21 784 | 29 238 |
| 2015 | 228 687 | 99 312 | 70 250 | 21 003 | 38 122 |
| 2019 | 287 443 | 98 174 | 90 668 | 39 652 | 58 949 |
| 2022 | 326 948 | 97 038 | 105 717 | 55 247 | 68 946 |
| 2024 | 345 587 | 91 030 | 112 594 | 58 603 | 83 360 |
| 2025 | **377 462** | 90 959 | 118 404 | 50 848 | 117 251 |

Ce tableau corrige plusieurs idées reçues :

1. **Les étudiants sont le premier motif** depuis 2022. Ce sont aussi les entrées les plus temporaires.
2. **Le motif familial est stable** depuis quinze ans (85 000 à 99 000 par an). Ce n'est pas lui qui explique la hausse.
3. **La hausse de 2025 vient de l'humanitaire** : +56,8 % selon la DGEF (données provisoires de juin 2026, 88 001 titres ; l'estimation de janvier 2026 donnait +65 % et 92 600). La protection subsidiaire a plus que doublé (+115,8 %) et les réfugiés et apatrides ont augmenté de 39 %. Elle découle des décisions de protection (réfugiés et protection subsidiaire) prises sur des demandes antérieures.
4. **Le motif « travail » recule** en 2025 (−13 %). La DGEF compte 50 848 titres pour ce motif (provisoire, juin 2026 ; 51 190 en estimation de janvier)[^dgef2025].

Le total a **doublé** entre 2008 et 2025. Données : `immigration_eurostat_premiers_titres_france_motif.csv`.

**Autres chiffres 2025 (DGEF, provisoires)** [^dgef2025] :

- **Premiers titres : 377 462 (provisoire, juin 2026), +9,2 %**, Britanniques inclus (8 250). L'estimation de janvier 2026 (384 230, +11,2 %) a été révisée à la baisse de 1,8 %. Ce chiffre est identique à celui d'Eurostat : l'ancienne mention « hors Britanniques » était fausse ;
- **régularisations (AES + liens personnels et familiaux) : 27 819 en 2025, −11,0 %**, sous l'effet de la loi de janvier 2024 et de la circulaire du 23 janvier 2025. Le périmètre a été redéfini en juin 2026 (l'estimation de janvier donnait 28 610, −10,1 %). Détail : AES 14 737 (−35,0 %), dont AES familial 4 912 (−54,9 %), et liens personnels et familiaux 13 082 (+52,4 %) : une partie de la baisse est un déplacement de catégorie ;
- **stock de titres valides et documents provisoires au 31/12/2025 : 4 470 970 (+3,2 %)**, pays tiers, Britanniques inclus ; 8,1 % de la population majeure ;
- **98 139 acquisitions de la nationalité en 2025 (−5,3 % ; 103 661 en 2024)**, dont 42 246 par décret (42 063 naturalisations et 183 réintégrations) et 53 912 par déclaration (Insee, *Acquisitions de la nationalité française, données annuelles de 2008 à 2025*, paru le 09/07/2026, sources ministères de l'Intérieur et de la Justice, https://www.insee.fr/fr/statistiques/2381644, lu le 31/10/2026). Le chiffre de janvier (dépêche AFP) de 62 235 (−6,8 %) correspond au seul périmètre du ministère de l'Intérieur (42 246 décrets + 19 989 déclarations = 62 235, somme recalculée à partir de l'Insee et d'un résumé de recherche non lu à la source pour les 19 989) et non au total national ; ne pas l'opposer au chiffre de l'Insee ;
- **151 665 demandeurs d'asile en 2025 (−3,7 % ; 157 550 en 2024), dont 116 475 premières demandes (129 910 en 2024) et 35 190 réexamens (27 645)** : Eurostat, migr_asyappctza, API JSON lue le 31/10/2026 (mise à jour du 03/09/2026), qui reprend le chiffre de janvier. À l'Ofpra seul : **145 210 demandes (−5,5 % ; 153 715 en 2024)**, premières demandes −14,4 %, réexamens +43 %, 156 590 décisions (+10,3 %), chiffres provisoires mineurs inclus ; **taux de protection de l'Ofpra 41,2 %** (avant recours à la CNDA ; 2024 : environ 38,8 %, déduit de la hausse de 2,4 points, non publié tel quel) (Ofpra, *Bilan 2025*, https://www.ofpra.gouv.fr/actualites/bilan-2025-de-lofpra-une-activite-record-et-des-evolutions-contrastees, lu le 31/10/2026). **taux synthétique de protection (Ofpra + CNDA) de 52,1 % en 2025** (49,4 % en 2024 ; 44,7 % en 2023) : dépliant DGEF « L'essentiel de l'immigration en France, données provisoires 2025 » (juillet 2026, page 2, tableau « Activité de l'Ofpra et de la CNDA », champ France, calcul MI/DGEF), https://www.immigration.interieur.gouv.fr/sites/dgef/files/medias/documents/2026-08/202607-Depliant-statistiques-donnees-2025.pdf, lu le 31/10/2026 ; total des protections accordées (Ofpra + annulations CNDA + accords Ofpra après annulation, mineurs inclus) 78 783 (70 284 en 2024) ; le taux de 41,2 % de l'Ofpra est calculé sur les décisions hors clôtures, le taux synthétique ajoute les décisions de la CNDA ;
- éloignements (Eurostat, migr_eirtn, API lue le 31/10/2026 : 18 930 ressortissants de pays tiers renvoyés en 2025, contre 16 665 en 2024 et 12 165 en 2023 ; migr_eiord : 137 550 ordres de quitter en 2025, 128 740 en 2024 ; périmètre « pays tiers » d'Eurostat, qui n'est pas celui des 24 985 éloignements de la DGEF) : l'estimation de janvier de la presse donnait 24 985 éloignements dont 15 569 forcés ; le dépliant DGEF *L'essentiel de l'immigration en France, données provisoires 2025* (juillet 2026, page 1, tableau « Sorties du territoire des étrangers en situation irrégulière », champ France métropolitaine, pays tiers et UE, majeurs, source MI/DGEF/DNPAF, https://www.immigration.interieur.gouv.fr/sites/dgef/files/medias/documents/2026-08/202607-Depliant-statistiques-donnees-2025.pdf, lu le 31/10/2026) donne, révisé : **14 133 éloignements forcés** (12 451 en 2024, +13,5 %), 4 564 éloignements aidés, 4 852 éloignements spontanés, soit **23 549 éloignements au total (A+B+C)** (21 196 en 2024, +11,1 %) et 30 943 sorties du territoire en incluant les départs volontaires et spontanés (27 386 en 2024) ; 175 051 interpellations d'étrangers en situation irrégulière (+19,0 %). Les 24 985 et 15 569 de janvier sont donc **périmés** (provisoires, périmètre antérieur) ; le *Rapport au Parlement 2025* (ministère de l'Intérieur, 28/09/2026) donne, d'après les extraits recueillis, 156 180 mesures d'éloignement prononcées (+7,6 %) et 15 253 éloignements forcés (+20,7 %) : périmètre différent de celui du dépliant (14 133), non relu `⚠️` (PDF de 118 p. non lisible en texte ; l'écart 14 133 / 15 253 n'est pas expliqué). Mesures prononcées au dépliant : 156 058 (retours vers pays tiers 137 861, réadmissions dans l'UE 13 104, renvois 5 093).

Sources lues le 31/10/2026 : DGEF, *Les titres de séjour en 2025* (https://www.immigration.interieur.gouv.fr/documentation/etudes-et-statistiques/titres-de-sejour-en-2025-protections-subsidiaires-ont-plus-que-double.html), publié le 30/06/2026 (le site est accessible dans un navigateur). Fichier : `immigration_dgef_chiffres_2025.csv`.

### 1.4 Asile

**[Fait]** Eurostat, primo-demandeurs (mineurs inclus)[^es-asyapp] :

| Année | France | Allemagne | Italie | Espagne | UE-27 |
|---|---|---|---|---|---|
| 2015 | 70 570 | 441 900 | 82 790 | 14 610 | 1 217 185 |
| 2019 | 138 290 | 142 510 | 35 005 | 115 190 | 629 230 |
| 2023 | 145 160 | 329 120 | 130 565 | 160 470 | 1 049 905 |
| 2025 | 116 475 | 113 235 | 128 655 | 141 055 | 672 350 |

- **Rapporté à la population** (2025), la France compte 1,7 primo-demandeur pour 1 000 habitants. C'est un peu plus que la moyenne de l'UE (1,5) et que l'Allemagne (1,35), mais moins que l'Espagne (2,9), l'Italie (2,2) ou la Grèce (5,3).
- **En valeur absolue**, la France est en 2025 le troisième pays d'asile de l'UE, derrière l'Espagne et l'Italie et devant l'Allemagne.

**Taux de protection en première instance [Fait]**[^es-asydc] (décisions positives sur total des décisions, OFPRA seul pour la France) :

- La France a longtemps été **nettement plus restrictive que la moyenne** : 22 à 31 % entre 2015 et 2023, contre 37 à 62 % pour l'UE.
- L'écart s'est refermé : 37,8 % en 2024 et 40,0 % en 2025, contre 39,1 % pour l'UE en 2025. Le taux allemand est tombé de 53 % à 32 %.

Ce point contredit l'image d'un asile français « laxiste » au guichet. Le rattrapage récent tient en partie à la composition des demandes : d'après le résumé du rapport d'activité OFPRA 2025 (EUAA), les premières nationalités sont l'Ukraine, la RDC et l'Afghanistan, avec des taux de protection de 89 % (Ukraine, Haïti) et 57 % (Afghanistan) ; l'OFPRA a rendu 156 509 décisions (+10,3 %) et enregistré 145 270 demandes (−5,5 %), les premières demandes baissant de 14,4 % pendant que les réexamens (Haïtiens en Guyane et aux Antilles) montaient de 43 %. Côté titres de séjour, la DGEF relève 12 330 premiers titres pour des Ukrainiens (×3,5) et +42 % pour les Afghans (17 531). Le rapport OFPRA lui-même n'a pas été lu (résumé de l'EUAA : https://dip.euaa.europa.eu/node/13714).

Données : `immigration_eurostat_demandes_asile.csv`, `immigration_eurostat_asile_decisions_premiere_instance.csv`.

### 1.5 Éloignements : OQTF prononcées et exécutées

**[Fait]** Eurostat, ressortissants de pays tiers[^es-return] :

| Année | France : ordres de quitter | France : renvoyés | Ratio France | Ratio UE | Ratio Allemagne |
|---|---|---|---|---|---|
| 2012 | 77 600 | 22 760 | 29 % | — | 69 % |
| 2019 | 123 845 | 17 705 | 14 % | 34 % | 59 % |
| 2021 | 125 450 | 8 210 | 7 % | 28 % | 34 % |
| 2023 | 136 685 | 12 165 | 9 % | 23 % | 35 % |
| 2025 | 137 550 | 18 930 | **14 %** | **32 %** | 65 % |

- **Poids de la France.** En 2025, elle prononce **28 % de tous les ordres de quitter le territoire de l'UE** (137 550 sur 486 705, calcul de Claude).
- **Bilan de la Cour des comptes** (janvier 2024)[^ccomptes] :
  - **447 257 OQTF prononcées par les préfets entre 2019 et 2022, outre-mer compris** ; leur nombre a augmenté de 60 % en cinq ans, contre +9 % pour les effectifs préfectoraux dédiés (synthèse du rapport, p. 12 du PDF, https://www.ccomptes.fr/sites/default/files/2024-02/20240104_Politique-lutte-contre-immigration-irreguliere.pdf, lu le 31/10/2026) ;
  - **taux d'exécution** : la synthèse (p. 14) écrit que « autour de 10 % » des OQTF sont exécutées (départ effectif de la personne) ; la page de présentation de la Cour parle de 12 % (même source, autre formulation ; la période du taux n'est pas précisée dans les deux cas). Les deux chiffres sont donc sourcés, avec l'ordre de grandeur « 10 à 12 % » ; `⚠️` le chiffre « 134 280 OQTF en 2022 pour environ 15 400 départs » n'a pas été retrouvé et reste retiré ;
  - **coût** : environ 1,8 Md€ par an, porté à 90 % par le ministère de l'Intérieur ; une journée de rétention coûte 602 € et un éloignement forcé 4 414 € en moyenne (synthèse, p. 15) ; France première de l'UE pour les éloignements forcés selon Eurostat : 11 409 en 2022 et 18 915 en 2019 (même page) ; « près de 16 000 fonctionnaires et militaires à temps plein » **lu** le 31/10/2026 sur la page de présentation du rapport (ccomptes.fr, https://www.ccomptes.fr/fr/publications/la-politique-de-lutte-contre-limmigration-irreguliere : « Elle mobilise près de 16 000 fonctionnaires et militaires à temps plein ») : ce sont des agents à temps plein (fonctionnaires et militaires), pas « 16 000 agents » au sens large ; le chiffre n'a pas été retrouvé dans le corps du PDF.
  - **2022 : 134 280 OQTF et 15 400 départs (lus, PDF p. 98, Cour des comptes, janvier 2024)** : « En 2022, les préfectures et juridictions françaises ont prononcé 153 042 mesures d'éloignements, dont 134 280 obligations de quitter le territoire français » ; la police aux frontières « n'a dénombré que 15 400 éloignements ou départs volontaires, soit 10 % des mesures prononcées » (hors outre-mer) ; en intégrant les territoires ultramarins, 38 059 éloignements, dont 57 % à Mayotte ; la DGEF estime à 17 % la part des mesures qui ne peut être exécutée (recours suspensif 3 % des OQTF, abrogation 11 %) et évalue à 12 % le taux d'exécution des OQTF réputées exécutoires. Le graphique n° 10 (p. 99) détaille 2022 : 7 214 éloignements forcés, 4 195 remises, 2 103 retours aidés, 1 888 retours spontanés. Périmètre : 15 400 = départs constatés après une mesure de type OQTF, métropole, tous motifs ; l'écart avec les 11 409 éloignements forcés d'Eurostat tient au périmètre (Eurostat : forcés, pays tiers).
- **Rapport Rodwell** (Assemblée nationale, commission des finances, rapport d'information n° 3178, enregistré le 16/09/2026, https://www.assemblee-nationale.fr/dyn/opendata/RINFANR5L17B3178.html, lu le 31/10/2026) : il actualise le coût de la lutte contre l'immigration irrégulière à **2,1 Md€** (la Cour des comptes disait 1,8 Md€ en 2024 ; périmètres à comparer avant de parler de hausse) ; il note qu'aucune étude officielle ne permet de connaître le nombre de personnes en situation irrégulière (estimation 600 000 à 900 000) ; il relève, pour 2025, 156 058 mesures d'éloignement notifiées (record), 14 133 exécutées sous contrainte et 23 549 éloignements réalisés, soit un taux global d'exécution « de l'ordre de 15 % » (synthèse). Ces chiffres recoupent ceux du dépliant DGEF[^rodwell].

Le rapport Rodwell a été lu dans sa synthèse (page HTML de l'Assemblée, 100 000 premiers caractères sur 712 000 ; le corps du rapport n'est pas relu) ; celui de la Cour des comptes à travers la synthèse du PDF (pages 10 à 15 du rapport, lues le 31/10/2026 ; le corps du rapport, 141 p., n'est pas lu).

**Limite du ratio.** Une même personne peut recevoir plusieurs OQTF, et un départ de l'année N peut correspondre à une décision antérieure. Les départs spontanés non enregistrés ne sont pas comptés. Le ratio est donc un indicateur de tendance, pas un taux exact.

**Le stock irrégulier est inconnu [Fait].** Le seul indicateur administratif disponible est l'aide médicale d'État (AME) :

- environ 457 000 bénéficiaires fin 2023 ;
- 1,34 Md€ de dépenses en 2025[^ame].

C'est une borne basse, puisque tous les sans-papiers ne la demandent pas. Le rapport d'information de C. Rodwell (n° 3178, enregistré le 16/09/2026, https://www.assemblee-nationale.fr/dyn/opendata/RINFANR5L17B3178.html, lu le 31/10/2026) écrit qu'« aucune étude officielle ne permet d'appréhender le nombre de personnes en situation irrégulière » et ne donne qu'une fourchette estimée de 600 000 à 900 000 personnes : une estimation sans base statistique solide, pas un décompte.

Données : `immigration_eurostat_eloignements_ordonnes_vs_executes.csv`.

**Sens.** ⚖️ Les deux camps ont un point. La droite a raison : la plupart des décisions d'éloignement ne sont pas exécutées. La gauche a raison : multiplier les OQTF sans moyens d'exécution (laissez-passer consulaires, rétention) produit surtout des chiffres. Une politique « ferme » qui n'exécute qu'une décision sur sept n'est ferme que sur le papier.

### 1.6 Comparaisons européennes

**Part de la population née à l'étranger, 1er janvier 2025 [Fait]**[^es-pop] :

| Pays | Nés à l'étranger | dont nés hors UE |
|---|---|---|
| Luxembourg | 51,5 % | 19,0 % |
| Irlande | 23,3 % | 16,6 % |
| Autriche | 22,5 % | 12,8 % |
| Suède | 20,8 % | 15,6 % |
| Allemagne | 20,5 % | 13,0 % |
| Belgique | 20,2 % | 12,1 % |
| Espagne | 19,3 % | 16,0 % |
| Pays-Bas | 16,8 % | 12,4 % |
| Danemark | 14,4 % | 9,7 % |
| **UE-27** | **14,4 %** | **10,4 %** |
| **France** | **14,0 %** | **11,1 %** |
| Italie | 11,8 % | 9,1 % |
| Pologne | 2,6 % | 1,9 % |

**Flux 2025 : premiers titres de séjour pour 1 000 habitants [Fait, ratio calculé]**[^es-resfirst] :

| Pays | Titres pour 1 000 hab. |
|---|---|
| Malte | 56,9 |
| Chypre | 46,7 |
| Portugal | 28,9 |
| Espagne | 12,9 |
| Pologne | 12,8 |
| **UE-27** | **8,6** |
| Italie | 7,4 |
| Allemagne | 7,2 |
| Belgique | 6,2 |
| **France** | **5,5** |

**[Interprétation]** La France n'est ni un pays d'immigration exceptionnelle par son stock, ni par ses flux légaux. Elle se distingue par deux traits :

1. une immigration **plus ancienne et plus extra-européenne** (Maghreb, Afrique subsaharienne) ;
2. une **intégration économique plus faible** (voir § 3.2).

C'est là que se situe le vrai sujet. Données : `immigration_eurostat_part_nes_etranger_ue.csv`, `immigration_eurostat_premiers_titres_ue_pour_1000_hab.csv`.

**Sens du chapitre 1.**

- ✅ Ni « submersion » (stock et flux dans la moyenne européenne), ni « rien à voir » (hausse réelle et rapide depuis 2017, éloignements inefficaces).
- ⚖️ La perception d'une forte immigration n'est pas infondée en tendance, même si elle l'est en niveau relatif.

---

## 2. Démographie

### 2.1 Fécondité : la France décroche à son tour

**[Fait]** Indicateur conjoncturel de fécondité (Eurostat[^es-fert] ; Insee pour 2025[^insee-bilan]) :

| | 2010 | 2019 | 2023 | 2024 | 2025 |
|---|---|---|---|---|---|
| France | 2,03 | 1,86 | 1,66 | 1,61 | **1,56** (Insee) |
| UE-27 | 1,57 | 1,53 | 1,38 | 1,34 | — |
| Allemagne | 1,39 | 1,54 | 1,39 | 1,36 | — |
| Italie | 1,44 | 1,27 | 1,21 | 1,18 | — |
| Espagne | 1,37 | 1,23 | 1,12 | 1,10 | — |

En 2025, selon l'Insee[^insee-bilan] :

- la fécondité tombe à 1,56, son plus bas niveau depuis la fin de la Première Guerre mondiale ;
- **le solde naturel devient négatif (−6 000)**, pour la première fois depuis 1945 : 645 000 naissances pour 651 000 décès ;
- la population atteint 69,1 millions au 1er janvier 2026. Sa croissance (+0,25 %) **ne vient plus que du solde migratoire**.

**Contribution des immigrées à la fécondité [Étude].** Selon l'Ined (Volant, Pison, Héran, *Population & Sociétés* n° 568, 2019), les mères immigrées n'ajoutaient qu'environ 0,1 enfant par femme à l'indicateur français (de l'ordre de 1,77 sans elles contre 1,88 avec en 2017). L'immigration n'explique donc pas la fécondité française « élevée » `⚠️` les chiffres 1,77 et 1,88 n'ont pas été retrouvés ; le site de l'Ined est indisponible (31/10/2026). Un résumé du numéro 568 indique environ 1,9 enfant par femme en 2017 et une contribution des immigrées d'environ +0,1 enfant par femme ; à relire dans la publication.

Données : `immigration_eurostat_fecondite.csv`, `immigration_eurostat_solde_naturel_migratoire.csv`.

### 2.2 Les nouvelles projections Insee (juin 2026) : le solde migratoire devient décisif

**[Projection]** Insee Première n° 2108, 8 juin 2026[^insee-proj]. Hypothèses centrales :

- fécondité de 1,45 enfant par femme dès 2028 ;
- **solde migratoire de +150 000 par an** (contre +70 000 dans l'exercice de 2021) ;
- espérance de vie en 2070 : 89,5 ans pour les femmes, 86,7 ans pour les hommes.

| Scénario | Population 2050 | Population 2070 | Début de la baisse |
|---|---|---|---|
| Central | 69,1 M | 65,9 M | 2037-2038 |
| **Solde migratoire bas (+70 000/an)** | 66,4 M | **60,9 M** | **2028** |
| **Solde migratoire haut (+230 000/an)** | 71,7 M | **70,8 M** | **2053** |
| Fécondité basse (1,20) | 66,8 M | 61,3 M | 2029 |
| Fécondité haute (1,70) | 71,4 M | 70,8 M | 2052 |
| Population basse (toutes hypothèses défavorables) | — | 54,6 M | 2027 |
| Population haute (toutes hypothèses favorables) | — | 78,3 M | pas de baisse |

L'Insee en tire trois enseignements :

1. Jusqu'en 2037, la croissance de la population « tiendrait exclusivement au solde migratoire ».
2. **L'effet d'un écart de ±80 000 migrants par an est « très proche » de celui d'un écart de fécondité de ±0,25 enfant.**
3. Le ratio des 65 ans et plus sur les 20-64 ans passerait de 40 % (2026) à 49 % (2040) et 62 % (2070).

Données : `immigration_insee_projections_2026_variantes.csv`.

### 2.3 Eurostat : que se passerait-il avec zéro migration ?

**[Projection]** Les projections EUROPOP2023 d'Eurostat comportent un scénario « migration nulle » (NMIGR)[^es-proj]. Pour la France :

| Indicateur | Année | Référence | Migration nulle | Migration +33 % | Fécondité basse |
|---|---|---|---|---|---|
| Population 20-64 ans | 2050 | 36,4 M | 34,7 M | 37,8 M | 35,6 M |
| | 2070 | 35,4 M | 33,0 M | 38,0 M | 32,2 M |
| Ratio 65+/20-64 ans | 2050 | 53,1 % | 54,6 % | 51,4 % | 54,3 % |
| | 2070 | 57,6 % | **57,3 %** | 55,1 % | 63,5 % |
| | 2100 | 65,1 % | 67,6 % | 62,7 % | 77,3 % |

**Ce que montre ce tableau [Interprétation fondée sur les projections]** :

- **Sans immigration**, la population en âge de travailler compterait environ **1,6 million de personnes de moins en 2050** et 2,4 millions de moins en 2070.
- **Mais le ratio de dépendance des âgés ne change presque pas** : +1,5 point en 2050, quasiment rien en 2070. Les immigrés arrivés jeunes vieillissent à leur tour.
- **La fécondité pèse davantage** sur le long terme que la migration.

C'est la conclusion classique du rapport de l'ONU sur les « migrations de remplacement » (2000) : compenser le vieillissement par l'immigration demanderait des flux sans cesse croissants `⚠️ rapport ONU cité de mémoire, non relu ici` (non traité dans cette passe).

`⚠️` **Anomalie à signaler.** Le scénario de migration basse (−33 %) produit pour 2070 un ratio plus dégradé que le scénario de migration nulle. Les métadonnées Eurostat (https://ec.europa.eu/eurostat/cache/metadata/en/proj_23n_esms.htm, lues le 31/10/2026) définissent la migration basse comme −33 % des flux d'immigration extra-UE chaque année 2023-2100, la migration haute comme +33 %, et la migration nulle comme un solde net égal à zéro chaque année ; rien n'y indique que la migration nulle supprime aussi l'émigration des natifs. L'explication proposée plus haut n'est donc pas confirmée et l'anomalie reste inexpliquée. Recalcul à partir de l'API JSON Eurostat (proj_23ndbi, France, 2070, lue le 31/10/2026, mise à jour du 13/05/2026) : ratio 65+/20-64 ans de 57,6 % (référence), 57,3 % (migration nulle), 60,4 % (migration basse) et 55,1 % (haute) ; solde migratoire annuel de 98 516, 0, 37 903 et 158 870 ; âge médian 47,6 / 47,8 / 48,5 ans ; naissances 667 101 / 618 994 / 610 415. Les valeurs du tableau sont donc exactes. Le scénario de migration basse garde un solde positif (+37 903) et pourtant produit une population plus âgée et moins de naissances que la migration nulle : l'anomalie est réelle dans les données et ne s'explique pas par le niveau du solde net ; la structure par âge des flux (non lue) est une piste, pas un résultat.

Données : `immigration_eurostat_projections_europop2023.csv`.

### 2.4 Retraites : ce que dit le COR (juin 2026)

**[Fait/Projection]** Rapport annuel du COR, juin 2026[^cor2026] :

- **Rapport démographique** : 3,6 personnes de 20-64 ans par personne de 65 ans et plus en 2009, 2,5 en 2025 et **1,62 en 2070**.
- **Rapport cotisants/retraités** : 2,1 en 2002, 1,8 en 2025 et **1,3 en 2070**. Cette baisse vient du « recul de la natalité qui ne serait que partiellement compensé par la hausse du solde migratoire ».
- **Variante migratoire** : avec +230 000 migrants par an au lieu de +150 000, les dépenses de retraite seraient plus faibles de **1,1 point de PIB en 2070**. Avec +70 000, elles seraient plus élevées de 1,1 point. Le solde du système varie « quasiment à due concurrence ».
- **Dynamique dans le temps** (citation) : « Cet effet positif tendrait toutefois à s'estomper progressivement à plus long terme, à mesure que les populations concernées accéderaient elles-mêmes à la retraite. » Le COR note aussi que les retraités issus de l'immigration ont des pensions plus faibles (carrières plus courtes).

**Comparaison de l'effet de chaque hypothèse sur les dépenses de retraite en 2070 :**

| Hypothèse | Effet sur les dépenses de retraite en 2070 |
|---|---|
| Solde migratoire ±80 000/an | ±1,1 point de PIB |
| Fécondité ±0,25 | ±1,0 point de PIB |
| Productivité 0,4 % à 1,0 % par an | ±0,8 point de PIB |
| Chômage 5 % à 10 % | −0,3 à +0,4 point de PIB |

**L'hypothèse migratoire est donc l'une des plus structurantes du système de retraite.**

`⚠️` **Limite importante.** Le COR fait passer l'effet par le PIB, avec plus d'actifs en emploi. Je n'ai pas vérifié quel taux d'emploi il retient pour les immigrés supplémentaires. Si c'est le taux moyen, l'effet est surestimé pour une immigration peu employée (voir § 3.2). À vérifier dans l'annexe méthodologique.

Données : `immigration_cor_2026_sensibilites.csv`.

**Sens du chapitre 2.**

- ✅ **Contre la fermeture.** Un solde migratoire bas avance le déclin de la population à 2028 et alourdit les retraites d'un point de PIB.
- ✅ **Contre l'argument « l'immigration paiera nos retraites ».** L'effet est temporaire et ne corrige pas le vieillissement.
- ⚖️ **Pour le manifeste.** La démographie seule ne tranche pas la question. Elle dit qu'un solde **nul** coûte cher, mais pas quel solde est optimal.

---

## 3. Économie et finances publiques

### 3.1 Impact budgétaire net : ce que disent les études

**France**

- **[Étude] Chojnicki, Ragot & Sokhna (CEPII, 2018 ; *Revue économique*, 2022)**[^cepii]
  - Méthode : approche comptable sur 1979-2011. Le déficit primaire est réparti entre immigrés et natifs ; la charge de la dette est exclue.
  - Résultat : la contribution nette des immigrés est **globalement négative mais faible**, toujours inférieure à 0,5 % du PIB (0,2 % hors 2011). Elle était même légèrement positive en 2005 (+0,2 %).
  - Explication : une structure par âge favorable (beaucoup d'actifs) compense une contribution individuelle plus faible (plus de chômage, de prestations familiales et de logement).
  - Dégradation après la crise de 2008 : la contribution par tête des immigrés de l'UE rejoint celle des immigrés de pays tiers. Le pays d'origine compte plus que le diplôme, parce que les immigrés européens s'insèrent mieux sur le marché du travail.
- **[Étude] OCDE, *Perspectives des migrations internationales 2021*, chapitre 4** (25 pays, 2006-2018)[^ocde2021]
  - Dans tous les pays étudiés, l'impact budgétaire net des immigrés est compris entre environ −1 % et +1 % du PIB.
  - Pour la France, les chiffres repris diffèrent selon le périmètre : **−0,53 % du PIB hors charge de la dette** (lecture de l'iFRAP), mais **+1,02 %** dans une autre variante (reprise de presse).
  - La différence tient au traitement des « biens publics purs » (défense, dette, etc.) : faut-il en imputer une part par tête aux immigrés (coût moyen) ou ne pas leur en imputer (coût marginal) ?
  - Le chapitre (lu le 31/10/2026) indique que, dans des pays comme l'Allemagne ou la France, la contribution fiscale nette totale des immigrés et celle des natifs sont assez proches ; en France, le ratio fiscal des migrants européens est supérieur à celui des natifs ; la France et les Pays-Bas se distinguent par une baisse relative du ratio des immigrés par rapport aux natifs. Il cite Chojnicki, Ragot et Sokhna (2018) : contribution au budget primaire négative mais faible, entre −0,5 % et +0,5 % du PIB sur trente ans de données françaises. La France ne figure pas parmi les pays que l'OCDE cite pour le gain d'un rattrapage d'emploi (Belgique et Suède : plus de 0,5 point de PIB ; Autriche, Danemark, Luxembourg et Pays-Bas : plus d'un tiers de point). L'ancienne mention « la France fait partie des pays où l'écart se refermerait le plus » n'est pas confirmée.
  - `⚠️` Les chiffres −0,53 % et +1,02 % pour la France restent issus de reprises (iFRAP, janvier 2022 ; CNews, octobre 2021) : le texte du chapitre OCDE ne les donne pas, ils sont dans les figures et annexes, non consultées.
- **[Estimation non revue par les pairs] Observatoire de l'immigration et de la démographie (OID)**
  - Il avance un coût net d'environ 35 à 40 Md€ par an, soit environ 1,4 % du PIB.
  - La Fondation Jean-Jaurès critique la méthode : des ratios d'années anciennes sont appliqués au PIB récent, et on cumule des conventions de coût moyen[^jj].
  - Il faut le citer comme une **borne haute contestée**, pas comme un résultat établi.

**Pourquoi les études divergent [Interprétation méthodologique].** Quatre choix de convention expliquent l'essentiel des écarts :

1. **Biens publics purs.** Les compter par tête rend le solde négatif ; ne pas les compter le rend positif.
2. **Enfants nés en France.** Les classer comme coût de l'immigration, ou comme futurs contribuables natifs ?
3. **Statique ou cycle de vie.** Une photographie d'une année favorise une immigration jeune ; un calcul sur la vie entière intègre les retraites.
4. **Année étudiée.** Les crises dégradent fortement les résultats.

La Migration Observatory (Oxford) le résume ainsi : quatre études britanniques sur les mêmes groupes et la même période arrivent à des conclusions opposées[^mo-uk].

**Études qui ventilent par origine ou par motif (étranger)**

- **[Fait administratif] Danemark, ministère des Finances (analyse de 2021, données 2018)**[^dk]
  - Contribution nette : +7 Md DKK pour les immigrés et descendants de pays occidentaux ; **−31 Md DKK** pour ceux de pays non occidentaux, dont −24 Md DKK pour la zone MENAPT (Moyen-Orient, Afrique du Nord, Pakistan, Turquie).
  - Le ministère précise que ces chiffres ne sont pas corrigés de la conjoncture.
  - Tendance récente : la part des immigrés MENAPT en emploi salarié est passée de 47 % (2019) à 58 % (fin 2024), selon Dansk Erhverv.
  - `⚠️` Le PDF du ministère était hors ligne au moment de la consultation : chiffres issus de résumés et de réponses au Folketing.
- **[Étude, non revue par les pairs] Pays-Bas, van de Beek, Roodenburg, Hartog & Kreffer, *Grenzeloze verzorgingsstaat* (2021)**[^nl]
  - Méthode : comptabilité générationnelle sur microdonnées de CBS (l'institut statistique néerlandais) ; coût net de l'immigration estimé à environ 400 Md€ sur 1995-2019.
  - Contribution sur toute la vie, par motif : environ **+100 000 €** par migrant de travail arrivé entre 20 et 50 ans ; environ −200 000 € par migrant familial ; environ **−400 000 €** par demandeur d'asile.
  - Limites :
    - le rapport est cofinancé par un institut lié au parti Forum voor Democratie ;
    - les microdonnées ne sont pas publiques, la réplication est donc difficile ;
    - des économistes néerlandais contestent la méthode.
  - Joop Hartog, l'un des auteurs, est un économiste du travail reconnu.
- **[Projection officielle] Royaume-Uni, OBR (Office for Budget Responsibility, 2024) et MAC (Migration Advisory Committee, 2025)**[^mo-uk]
  - OBR : un migrant arrivé à 25 ans **à bas salaire** a un impact négatif sur toute sa vie ; un migrant **à haut salaire** a un impact positif. Le salaire d'arrivée est la variable décisive.
  - MAC : les travailleurs qualifiés et les principaux titulaires de visas santé sont contributeurs nets ; les aides à domicile et les conjoints sont plutôt coûteux.

**Sens du § 3.1.**

- ✅ **Contre les deux extrêmes.** En moyenne, l'immigration n'est ni une manne ni un gouffre pour la France (±0,5 % du PIB).
- ⚖️ **Mais ce chiffre moyen n'est pas le bon outil.** Toutes les études qui ventilent par motif trouvent la même hiérarchie : **travail qualifié > travail peu qualifié > famille > asile**, et l'âge d'arrivée compte beaucoup.
- ❌ L'argument « l'immigration rapporte » est **faux pour certaines catégories**, en particulier l'asile et l'immigration familiale peu qualifiée, au moins à court et moyen terme.
- ❌ L'argument « l'immigration coûte 40 Md€ » repose sur des conventions extrêmes.
- La politique qui découle de ces données n'est pas « plus » ou « moins » d'immigration, mais **laquelle** et **avec quel taux d'emploi**.

### 3.2 Emploi des immigrés : le vrai point faible français

**[Fait]** Taux d'emploi des 20-64 ans selon le pays de naissance, 2025 (Eurostat[^es-emploi]) :

| Pays | Nés dans le pays | Nés hors UE | Écart | Femmes nées hors UE |
|---|---|---|---|---|
| **France** | 77,2 % | **63,1 %** | **−14,1 pts** | **54,1 %** |
| UE-27 | 77,2 % | 68,6 % | −8,6 pts | 59,4 % |
| Allemagne | 84,0 % | 69,0 % | −15,0 pts | 59,7 % |
| Espagne | 73,3 % | 68,7 % | −4,6 pts | 61,6 % |
| Suède | 84,7 % | 71,0 % | −13,7 pts | 65,3 % |

- L'écart français s'est un peu réduit depuis 2015 : 55,3 % pour les personnes nées hors UE contre 71,4 % pour les natifs, soit −16,1 points.
- **Pour les femmes nées hors UE, le taux d'emploi français est le plus bas** des grands pays comparés.

Données : `immigration_eurostat_taux_emploi_pays_naissance.csv` (rupture de série possible en 2021, avec la refonte de l'enquête Emploi).

**Descendants [Fait]** (Insee Références 2023, sortants de formation initiale depuis 1 à 10 ans, données 2021)[^insee-desc] :

- taux d'emploi : 70 % pour les descendants d'immigrés, contre 79 % sans ascendance migratoire ;
- selon l'origine : 64 % (origine africaine), 74 % (asiatique), 80 % (européenne) ;
- à diplôme égal, le chômage reste plus élevé : **12 % contre 6 % pour les diplômés de bac+2 et plus**.

**Discrimination [Étude].** Le testing de la Dares (2021) porte sur 9 600 candidatures envoyées à 2 400 offres[^dares-testing] :

- à qualité égale, un nom à consonance maghrébine réduit de **31,5 %** la probabilité d'être rappelé ;
- l'effet est environ deux fois plus fort dans les métiers peu qualifiés.

**Composition des diplômes [Estimation].** Le Conseil d'analyse économique (CAE, note n° 67, novembre 2021) indique que 37,8 % des immigrés d'âge actif ont au plus le brevet, contre 18,9 % des natifs[^cae]. Les arrivées récentes sont en revanche plus diplômées : dans les Hauts-de-France, 52 % des immigrés récents en emploi sont diplômés du supérieur, contre 40 % des non-immigrés[^insee-hdf]. La population immigrée est donc **polarisée** entre peu diplômés et très diplômés.

**Sens du § 3.2.**

- ✅ **Le levier n'est ni « ouvrir » ni « fermer ».** C'est **l'emploi après l'arrivée**, et en particulier celui des femmes.
- ✅ D'après l'OCDE (*Perspectives des migrations internationales 2021*, chap. 4), les taux d'emploi plus faibles des immigrés expliquent l'essentiel de l'écart de contribution ; combler l'écart d'emploi à âge et diplôme égaux augmenterait la contribution nette de plus de 0,5 point de PIB en Belgique et en Suède, et de plus d'un tiers de point en Autriche, au Danemark, au Luxembourg et aux Pays-Bas. L'ancienne formulation (« rendre le solde positif dans la plupart des pays ») n'est pas dans le texte et est retirée.
- ⚖️ La discrimination à l'embauche est une partie mesurée du problème, pas la totalité : il y a aussi des effets de composition (diplôme, langue, motif d'entrée, garde d'enfants).

### 3.3 Effets sur les salaires et l'emploi des natifs

**[Étude, consensus] National Academies of Sciences (États-Unis, 2017)**[^nas] :

- sur dix ans ou plus, l'effet de l'immigration sur les salaires des natifs pris dans leur ensemble est « très faible » ;
- les effets négatifs, quand ils existent, touchent surtout **les immigrés arrivés avant** et **les natifs sans diplôme du secondaire** ;
- il y a peu d'effet sur l'emploi total des natifs ;
- la première génération coûte plus aux finances publiques que les natifs, mais **la deuxième génération figure parmi les meilleurs contributeurs**.

**France**

- **[Étude] Edo (2020)**, *Journal of the European Economic Association*[^edo] : l'arrivée des rapatriés d'Algérie en 1962 est un choc d'offre de travail exogène. Les salaires régionaux ont baissé à court terme, puis sont revenus à leur niveau antérieur en une quinzaine d'années (1976).
- **[Étude] Ortega & Verdugo (2014)**, *Labour Economics*[^ov] :
  - sur 1968-1999, une hausse de 10 points de la part d'immigrés dans une catégorie (diplôme et expérience) s'accompagne d'une hausse de **3,3 %** du salaire des natifs ;
  - mécanisme : les natifs se reportent vers des tâches mieux payées ;
  - les auteurs reconnaissent eux-mêmes que l'estimation est fragile, car elle dépend de la mesure retenue.

**Régularisations**

- **[Étude] Elias, Monras & Vázquez-Grenno (*Journal of Labor Economics*, 2025)**, sur la régularisation espagnole de 2005 (600 000 personnes)[^spain] :
  - **pas d'effet d'appel détecté** (comparaison des flux de migrants non européens et européens) ;
  - environ **+4 000 €** de recettes fiscales par personne régularisée ;
  - pas de hausse des dépenses détectée ;
  - effets sur les natifs peu qualifiés présentés différemment selon les versions de l'article `⚠️`.
- L'Espagne a lancé en 2026 une nouvelle régularisation d'environ 500 000 personnes : décret d'avril 2026, demandes jusqu'au 30 juin 2026[^spain2026]. Ses effets ne sont pas encore mesurés.

**Sens du § 3.3.**

- ✅ **Contre le discours « ils prennent nos emplois ».** L'effet moyen est quasi nul.
- ⚖️ **Mais ce discours n'est pas absurde pour les moins qualifiés à court terme**, et ce sont eux qui votent le plus contre l'immigration. Une politique honnête le reconnaît et compense.

### 3.4 Métiers en tension et dépendance sectorielle

**[Fait]** Part des immigrés dans l'emploi (Dares, données du recensement 2017)[^dares-metiers] :

| Métier | Part d'immigrés |
|---|---|
| Employés de maison | 38,8 % |
| Agents de gardiennage et de sécurité | 28,4 % |
| Ouvriers non qualifiés du gros œuvre du BTP | 27,0 % |
| Ouvriers qualifiés du gros œuvre du bâtiment | 24,8 % |
| Cuisiniers | 22,0 % |
| Employés de l'hôtellerie-restauration | 19,3 % |
| Agents d'entretien | 17,4 % |
| **Ensemble des emplois** | **10,2 %** |

En Île-de-France (2018), la dépendance est bien plus forte : 61 % des aides à domicile et employés de maison sont immigrés, ainsi que 61 % du gros œuvre du BTP et 50 % des cuisiniers[^insee-idf].

**Médecins.** Au 1er janvier 2025, **14,6 % des médecins en activité régulière** ont un diplôme étranger (29 452 sur 201 239 ; 14 274 en 2010, soit +106,3 %) ; parmi **l'ensemble des médecins en activité** (périmètre plus large), la part est de 13,6 % (France 86,4 %, UE 5,6 %, hors UE 8,0 %), contre 7,1 % en 2010 (3,1 % UE, 4,0 % hors UE) ; chez les médecins en activité, 21,7 % des chirurgiens, 18,0 % des spécialistes médicaux et 6,5 % des généralistes (Atlas 2025 du Conseil national de l'Ordre des médecins, CNOM)[^cnom]. **Lus dans le PDF du CNOM le 31/10/2026** (168 p. : p. 72-73 figures 10 et 11, p. 126 et 142 pour les actifs réguliers) : le 14,6 % est bien celui des actifs réguliers, et les 21,7 %, 18 % et 6,5 % portent sur les médecins en activité, pas sur les seuls actifs réguliers. **Corrections** : 29 452 (PDF) et non 29 453 (presse) ; le « 7,2 % en 2010 » n'est pas dans les pages lues (la figure 10 donne 7,1 % pour les médecins en activité en 2010) `⚠️` : la part des actifs réguliers en 2010 n'a pas été lue. Attention au périmètre : la DREES donne 11 % de médecins à diplôme étranger au 1er janvier 2025, sur une autre base.

**Besoins futurs [Projection]**

- **Dares et France Stratégie, *Les métiers en 2030* (2022)** : environ 760 000 postes à pourvoir chaque année, dont 90 % pour remplacer des départs à la retraite ; environ +100 000 aides à domicile[^metiers2030].
- **Drees (février 2026)** : il faudrait **150 000 à 200 000 emplois supplémentaires d'ici 2050** pour accompagner les personnes âgées en perte d'autonomie. Les bénéficiaires de l'APA (aide personnalisée d'autonomie) à domicile augmenteraient de plus de 60 %[^drees].

**Sens du § 3.4.**

- ✅ **Contre la fermeture.** Les secteurs du soin, du BTP et de la restauration fonctionnent déjà en partie grâce aux immigrés. Le besoin en soins de longue durée va croître, et ce sont des métiers où la robotique est la moins avancée (voir § 4).
- ⚖️ **Mais la « pénurie » est aussi une question de salaires et de conditions de travail.** Des métiers sous-payés et pénibles « manquent » de bras en partie parce qu'ils paient mal. Faire venir de la main-d'œuvre peut freiner les hausses de salaire qui rendraient ces métiers attractifs. C'est l'argument de la droite souverainiste comme d'une partie de la gauche syndicale. Son ampleur est débattue.

---

## 4. Scénario robots, IA et revenu universel

### 4.1 Ce que dit la recherche sur l'automatisation et la main-d'œuvre immigrée

Le constat est cohérent d'une étude à l'autre : **la rareté de la main-d'œuvre pousse à automatiser, et l'abondance de main-d'œuvre freine l'automatisation.** Immigration et robots sont en partie des **substituts**.

| Étude | Résultat | Robustesse |
|---|---|---|
| **Acemoglu & Restrepo (2022)**, *Review of Economic Studies*[^ar] | Le vieillissement (moins de travailleurs d'âge moyen dans les tâches manuelles) entraîne plus de robots et plus de brevets d'automatisation. Selon le communiqué du MIT, il explique environ 35 % des écarts d'usage de robots entre pays. | forte (revue de premier rang) |
| **Abeliansky & Prettner** (documents de travail 2017-2021)[^ap] | Sur 60 pays entre 1993 et 2013, une croissance démographique plus faible de 1 % s'accompagne d'environ 2 % de croissance de la densité robotique en plus. | moyenne (pas de publication en revue trouvée) |
| **Danzer, Feuerbaum & Gaessler (2024)**, *Journal of Public Economics*[^dfg] | En Allemagne, une politique d'affectation géographique des immigrants a augmenté l'offre de travail locale et réduit les brevets d'automatisation des procédés dans les grandes entreprises industrielles, seulement quand le marché du travail était tendu. | forte |
| **Clemens, Lewis & Postel (2018)**, *American Economic Review*[^clp] | L'arrêt du programme Bracero en 1964 (moins de travailleurs agricoles mexicains) n'a **pas** augmenté les salaires ni l'emploi des natifs dans l'agriculture américaine. Les exploitants ont mécanisé ou changé de cultures. | forte |
| **Basso, Peri & Rahman (2020)**, *Revue canadienne d'économique*[^bpr] | L'informatisation a attiré des immigrés vers les services manuels et non routiniers. L'ouverture à l'immigration a atténué la polarisation des emplois des natifs. | moyenne à forte |
| **Lewis (2011)**, *Quarterly Journal of Economics* | Aux États-Unis, les zones à forte immigration peu qualifiée ont moins adopté de machines automatisées. (résumé lu le 31/10/2026 via OpenAlex, doi 10.1093/qje/qjr011 : usines de métal et d'équipement, 1980-1990 ; les zones touchées par une vague d'immigration peu qualifiée ont adopté nettement moins de machines par unité de production)  | forte |

**Japon et Corée : champions de la robotique, mais pas sans immigration [Fait]**

| Pays | Densité robotique 2024 (robots pour 10 000 salariés de l'industrie) | Immigration |
|---|---|---|
| Japon | 446[^ifr] | 2,57 millions de travailleurs étrangers fin octobre 2025 (+11,7 % en un an, record pour la 13e année de suite)[^jp-work]. 4,13 millions de résidents étrangers fin 2025, soit 3,36 % de la population, puis 4,28 millions mi-2026[^jp-res]. Le statut de « travailleur qualifié spécifique » a progressé de 37 % en un an. |
| Corée du Sud | 1 220, record mondial[^ifr] | Étrangers : 4,1 % de la population au recensement de 2025. Le quota de travailleurs peu qualifiés (visa E-9) est passé de 165 000 (2024) à 130 000 (2025) puis 80 000 (2026), en raison de la baisse des offres d'emploi dans l'industrie et le BTP[^kr]. |

- **Soins aux personnes âgées.** L'ethnographie de James Wright (*Robots Won't Save Japan*, Cornell, 2023) montre que les robots de soin testés au Japon (Hug, Paro, Pepper) coûtaient plus cher et **demandaient du travail humain supplémentaire**. Ils n'ont pas compensé la pénurie de soignants[^wright].
- **Rappel.** La recherche menée pour le chapitre 1 du livre (`sources/recherche-ia-robotique.md`) concluait que l'imminence d'un impact de l'IA sur l'emploi est prématurée, et qu'elle n'est **pas démontrée pour la robotique** (hors robotaxis).

**[Interprétation] Trois horizons**

1. **Court terme (2026-2032).** Les robots ne remplaceront pas les aides à domicile, les maçons ni les cueilleurs. Les besoins de main-d'œuvre dans ces métiers sont réels et croissants. Fermer brutalement les flux de travail créerait des pénuries que l'automatisation ne comblera pas à temps.
2. **Moyen terme (2032-2045).** Si l'IA réduit fortement l'emploi des cols blancs, l'argument « il nous faut des actifs » faiblit pour les métiers qualifiés de bureau. Il reste valable pour les métiers physiques et relationnels, sauf percée de la robotique humanoïde (non démontrée à ce jour).
3. **Long terme (si les robots font l'essentiel du travail).** La valeur économique d'un résident ne vient plus de son travail mais de **sa part du dividende robotique**. L'immigration de travail perd alors sa justification économique, puisque chaque nouveau résident devient un ayant droit de plus. Cela poserait une **tension forte avec l'universalité d'un revenu universel**, comme avec tout État-providence généreux.

Une politique restrictive accélérerait-elle l'automatisation ? **Oui, probablement, et c'est à double tranchant.**

- **Côté gain** : plus de productivité, ce qui est cohérent avec l'optimisme technologique du manifeste.
- **Côté coût** : dans les soins, l'automatisation est lente et coûteuse (cas du Japon). La qualité du service peut chuter pendant la transition.

**Sens du § 4.1.**

- ✅ **Contre la fermeture**, à court terme.
- ⚖️ **Contre l'ouverture large**, à long terme si le scénario robotique se réalise.
- ⚠️ **Pour le manifeste.** L'optimisme robotique du manifeste est un argument pour une immigration **plus sélective et plus temporaire** à l'avenir, pas pour plus d'immigration. Il faut le dire clairement : le scénario « les robots font le travail » est celui où l'immigration de travail peu qualifiée a le moins de sens économique.

### 4.2 Revenu universel et étrangers : ce qu'on sait, ce qu'on ignore

**Aucune expérience de revenu universel n'a mesuré d'effet sur les migrations [Fait].**

- Les expériences existantes ne sont ni universelles ni ouvertes aux nouveaux arrivants : Finlande 2017-2018 (chômeurs seulement), Kenya (GiveDirectly), Stockton, OpenResearch (voir `sources/recherche-persuasion-et-transition.md`).
- Elles ne disent **rien** de l'effet d'appel.

**Preuves indirectes : l'effet des prestations sociales sur les migrations [Étude]**

- **Agersnap, Jensen & Kleven (2020)**, *American Economic Review: Insights*[^ak] :
  - en 2002, le Danemark divise environ par deux les prestations des immigrés non européens ; l'immigration nette baisse d'environ 5 000 personnes par an ;
  - l'abrogation de la mesure inverse presque exactement cet effet ;
  - **l'élasticité de la migration au montant des prestations est de 1,3**.
- **Adema (2026)**, Institute for Replication, document de discussion n° 302 : cette réanalyse conteste l'ampleur et trouve des élasticités **beaucoup plus faibles**, au plus 0,28 pour les arrivées et 0,14 pour les stocks.
- **Conclusion honnête** : un effet d'appel existe probablement, mais son ampleur est **incertaine d'un facteur 5 à 10**. Un revenu universel d'environ 1 000 €/mois ferait de la France l'un des pays les plus généreux au monde pour un adulte sans revenu. L'effet ne serait sans doute pas nul.

**Comment les dispositifs existants traitent les étrangers [Fait]**

| Dispositif | Règle | Statut juridique |
|---|---|---|
| **Alaska, dividende pétrolier (Permanent Fund Dividend)** | Il faut une année civile complète de résidence et la nationalité américaine, ou une résidence permanente légale, ou le statut de réfugié ou d'asilé. Les autres non-citoyens sont exclus[^pfd]. | La Cour suprême des États-Unis (*Zobel v. Williams*, 457 U.S. 55, 14/06/1982) a jugé contraire à la clause d'égale protection un dividende calculé selon le nombre d'années de résidence depuis 1959 (sources : Cornell LII, Justia ; vérifié le 31/10/2026). La Cour distingue ce cas des délais minimaux de résidence exigés des nouveaux arrivants. |
| **RSA (France)** | Les étrangers non européens doivent détenir depuis au moins **5 ans** un titre de séjour autorisant à travailler. Sont exemptés les réfugiés, les bénéficiaires de la protection subsidiaire et les titulaires d'une carte de résident. | Conforme à la Constitution (décision 2011-137 QPC) et à la Convention européenne des droits de l'homme (Conseil d'État, 2015)[^rsa]. |
| **Allocations familiales et APL (proposition de LR, 2024)** | Condition de 5 ans de résidence (30 mois pour les actifs), proposée par voie de référendum d'initiative partagée. | **Censurée** comme « atteinte disproportionnée » (décision 2024-6 RIP du 11 avril 2024). Le Conseil admet toutefois qu'une durée de résidence puisse conditionner **certaines** prestations[^rip]. |
| **Macao, programme de partage de la richesse** | Versement annuel aux résidents, avec un montant plus faible pour les résidents non permanents. | `⚠️ non vérifié (quota de recherche épuisé)` |

**Contraintes juridiques à nommer**

Le droit de l'UE impose l'égalité de traitement :

- pour les **travailleurs européens**, dès le premier jour (règlement 492/2011) ;
- pour les **résidents de longue durée** de pays tiers, après 5 ans (directive 2003/109).

Les citoyens européens **inactifs** peuvent en revanche être exclus de l'assistance sociale pendant leurs premières années (arrêt *Dano* de la CJUE, grande chambre, 11/11/2014, C-333/13 : un État peut refuser des prestations aux inactifs sans ressources suffisantes, sur examen individuel ; EUR-Lex 62013CJ0333). `⚠️` Les autres points sont rappelés de mémoire ; ils doivent être validés par un juriste.

**Options de conception pour le manifeste [Interprétation]**

1. **Revenu universel lié à la résidence légale, avec une montée en charge** sur plusieurs années (par exemple 20 % par année de résidence). C'est cohérent avec la jurisprudence RSA (stabilité du séjour), mais la décision de 2024 rend une durée de 5 ans risquée pour une prestation qui remplace **toutes** les aides. Il faudrait sans doute une durée plus courte, ou un socle minimal immédiat.
2. **Revenu universel réservé aux nationaux et aux résidents de longue durée**, les autres relevant d'un régime d'aide d'urgence. Cette option se heurte au droit de l'UE et au préambule de 1946.
3. **Revenu universel pour tous, dès l'arrivée, mais immigration de travail sélective et quotas votés.** Cette option déplace le contrôle de la prestation vers l'admission. C'est la logique suédoise et danoise des années 2000-2010, à l'envers.

**Sens du § 4.2.**

- ⚖️ **Contradiction à nommer dans le livre.** Un revenu universel **strictement universel** et une immigration ouverte sont difficilement compatibles budgétairement. L'auteur devra choisir l'un de ces trois compromis et l'exposer.
- C'est l'objection la plus forte qu'un lecteur de droite opposera au revenu universel. Les travaux de Michael Howard (*Basic Income Studies*, 2006) la nomment depuis vingt ans : un « dilemme moral » entre générosité interne et ouverture externe[^howard].

---

## 5. Les positions politiques en vue de 2027

*État au 25 octobre 2026. Aucun grand parti n'a encore publié de programme 2027 complet sur l'immigration. Les mesures viennent de textes déposés, d'entretiens et de programmes antérieurs, avec la date de chaque source. Quand je n'ai vu qu'un agrégateur (votons-2027.fr, ÉlyséeScope), c'est marqué `⚠️`.*

### 5.0 Contexte juridique et politique

- **Loi du 26 janvier 2024 et décision 2023-863 DC.** Le Conseil constitutionnel a censuré 32 articles comme « cavaliers législatifs ». Il s'agit d'une censure de procédure, pas de fond. Les articles concernés portaient sur le regroupement familial, la condition de 5 ans pour les APL et les prestations familiales, la nationalité et le délit de séjour irrégulier. **Ces mesures peuvent donc revenir dans un autre texte.** Communiqué : https://www.conseil-constitutionnel.fr/actualites/communique/decision-n-2023-863-dc-du-25-janvier-2024-communique-de-presse
- **Décision 2024-6 RIP (11 avril 2024).** Une condition de 5 ans de résidence pour les prestations a été jugée disproportionnée. **C'est pourquoi RN et LR passent par une révision constitutionnelle**, puisque l'article 11 ne permet pas, selon la lecture dominante, un référendum direct sur l'immigration.
- **Circulaire Retailleau (23 janvier 2025).** Elle porte à 7 ans la durée de présence indicative pour une régularisation. Les régularisations ont baissé de 10 % en 2025 (§ 1.3). Analyse : https://www.leclubdesjuristes.com/societe/circulaire-retailleau-sur-ladmission-exceptionnelle-au-sejour-une-infra-reforme-9248/
- **Pacte européen asile et migration**, applicable depuis le 12 juin 2026. Le projet de loi d'habilitation a été adopté au Sénat le 20 mai 2026, puis **rejeté en commission des lois de l'Assemblée le 22 juillet 2026**. Le dossier, mis à jour le 15 octobre, ne mentionne aucune séance publique. https://www.senat.fr/dossier-legislatif/pjl25-526.html
- **Accord franco-algérien de 1968.** Le 30 octobre 2025, l'Assemblée a adopté par 185 voix contre 184 une résolution du RN demandant sa dénonciation. Elle n'a pas de portée contraignante. https://lcp.fr/actualites/denonciation-des-accords-franco-algeriens-de-1968-un-texte-du-rn-adopte-a-une-voix-pres
- **Calendrier.** Premier tour le 18 avril 2027, second tour le 2 mai 2027.

### 5.1 Rassemblement national (Marine Le Pen, Jordan Bardella)

**Candidature.** En appel (7 juillet 2026), Marine Le Pen a été condamnée à 15 mois d'inéligibilité, déjà purgés. Elle s'est déclarée candidate et a formé un pourvoi en cassation. Jordan Bardella est le candidat de recours `⚠️ calendrier de la cassation non recoupé`.

**Propositions.** Aucun programme 2027 n'est publié. Les références sont les « 22 mesures » de 2022 (https://rassemblementnational.fr/22-mesures) et la proposition de loi constitutionnelle « Citoyenneté-Identité-Immigration » n° 2120 du 25 janvier 2024 (https://www.assemblee-nationale.fr/dyn/16/textes/l16b2120_proposition-loi) :

- référendum constitutionnel sur l'immigration ;
- **priorité nationale** pour le logement social et l'emploi ;
- aides sociales réservées aux Français, et 5 ans de travail exigés pour les prestations de solidarité ;
- suppression du droit du sol ;
- fin du regroupement familial ;
- demandes d'asile déposées uniquement à l'étranger ;
- expulsion systématique des étrangers en situation irrégulière et des délinquants étrangers ;
- dénonciation de l'accord de 1968.

**Meilleure défense.** Selon le RN, les règles migratoires sont fixées par les juges et les traités plus que par les électeurs. Seul un vote constitutionnel rendrait au peuple la maîtrise de deux questions : qui devient Français, et qui bénéficie de la solidarité nationale.

**Ce que les données appuient.**

- L'exécution des éloignements est très faible : 14 % en 2025, contre 32 % dans l'UE (§ 1.5).
- L'emploi des immigrés non européens est faible (§ 3.2).
- Les études danoises et néerlandaises montrent un coût net élevé de l'immigration d'asile et familiale peu qualifiée (§ 3.1).
- Un effet d'appel des prestations est plausible (§ 4.2).

**Ce que les données contredisent ou nuancent.**

- Le stock et les flux légaux de la France sont **dans la moyenne européenne**, voire en dessous (§ 1.6) : l'idée d'une submersion propre à la France n'est pas étayée.
- Avec un solde migratoire faible, le déclin démographique commence dès 2028, et les retraites coûtent +1,1 point de PIB en 2070 (§ 2). Le RN ne chiffre pas ce coût.
- Les secteurs du soin, du BTP et de la restauration dépendent déjà de la main-d'œuvre immigrée (§ 3.4).
- La « priorité nationale » sur les prestations se heurte au Préambule de 1946 et au droit de l'UE. Il faudrait réviser la Constitution, et probablement renégocier certains engagements européens.
- La suppression du droit du sol touche des enfants nés et scolarisés en France, dont le profil d'intégration (§ 3.2) diffère nettement de celui des primo-arrivants.

### 5.2 Les Républicains (Bruno Retailleau)

Candidature annoncée le 12 février 2026 (https://fr.euronews.com/2026/02/12/presidentielle-de-2027-bruno-retailleau-annonce-sa-candidature-et-promet-des-referendums). Pas de programme complet publié.

**Propositions.**

- Révision constitutionnelle, puis référendum pour « réduire drastiquement l'immigration ».
- Suppression du droit du sol, par référendum (8 septembre 2026 : https://www.leclubdesjuristes.com/en-bref/presidentielle-2027-bruno-retailleau-veut-supprimer-le-droit-du-sol-par-referendum-17273/).
- Regroupement familial « réduit drastiquement ».
- Aides sociales après « cinq ans de présence légale et de travail ». C'est exactement la durée censurée en 2024, d'où le recours au référendum.
- Visas « territorialisés », limités au pays de délivrance.
- Quotas et exécution des OQTF `⚠️ via agrégateurs`.
- En 2023, il proposait de transformer l'AME en aide médicale d'urgence.

Source principale : entretien à *Valeurs actuelles* du 30 juin 2026, https://www.valeursactuelles.com/clubvaleurs/politique/immigration-droit-du-sol-racisme-anti-blancs-remigration-lentretien-sans-concession-de-bruno-retailleau `⚠️ lu via une reprise`.

**Meilleure défense.** Les leviers décisifs (droit du sol, regroupement familial, prestations) sont bloqués par la jurisprudence. Seul le peuple constituant pourrait légitimement les redéfinir. L'assimilation serait la contrepartie de la nationalité.

**Ce que les données appuient.**

- Le motif familial est le deuxième motif d'admission, stable autour de 91 000 titres par an (§ 1.3).
- Les études qui ventilent par motif lui attribuent une contribution budgétaire faible ou négative (§ 3.1).
- La France n'exécute qu'une part très faible de ses OQTF.

**Ce que les données nuancent.**

- La circulaire Retailleau a réduit les régularisations (−10 %). Mais le total des premiers titres a **augmenté** de 11 % en 2025, porté par l'asile, qui relève du droit international. Le ministre a donc eu peu de prise sur le total.
- Le délai de 5 ans pour les aides sociales existe déjà pour le RSA (§ 4.2).
- L'effet d'appel des prestations est réel mais d'ampleur incertaine (§ 4.2).

### 5.3 Renaissance et bloc central (Gabriel Attal, Édouard Philippe)

**Gabriel Attal**, candidat depuis mai 2026 :

- « accueillir moins pour accueillir mieux » ;
- **« préférence travail »** : l'immigration économique devient la priorité (AFP, 26 mai 2026, https://www.lagazettefrance.fr/article/attal-veut-une-immigration-plus-faible-et-axee-sur-le-travail) ;
- allongement de la durée de résidence exigée pour le regroupement familial (aujourd'hui 18 mois) ;
- quotas sectoriels proposés par les partenaires sociaux puis votés par le Parlement ;
- système à points « comme au Canada » `⚠️ via votons-2027` ;
- refus de la préférence nationale.

**Édouard Philippe (Horizons)**, programme : https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure

- **« diviser par deux » l'immigration légale** (précisé sur France 2 le 8 octobre 2026) ;
- dénonciation de l'accord de 1968 ;
- **suspension du regroupement familial** pendant le quinquennat ;
- quotas pour l'immigration économique ;
- liste de pays d'origine sûrs votée chaque année ; fin de « l'asile à vie » ;
- suspension du droit du sol à Mayotte ;
- aides sociales des étrangers alignées sur la moyenne européenne ;
- « centres de retour » ;
- référendum constitutionnel non exclu.

Interview sur France 2 : https://www.franceinfo.fr/politique/edouard-philippe/immigration-retraites-allocations-familiales-parcoursup-ce-qu-il-faut-retenir-de-l-interview-d-edouard-philippe-dans-l-emission-l-heure-de-verite_8228416.html

**Meilleure défense.** Le vieillissement et les métiers en tension rendent l'immigration de travail nécessaire. Mais la confiance publique exige que l'État choisisse réellement ses flux. La voie proposée passe par la loi et l'Europe, pas par une rupture avec l'État de droit.

**Ce que les données appuient.**

- **C'est la position la plus proche de la hiérarchie trouvée dans les études** : travail qualifié, puis famille, puis asile (§ 3.1, OBR, Danemark, Pays-Bas).
- Les données de démographie et de retraites (§ 2) et la dépendance sectorielle (§ 3.4) vont dans le même sens.

**Ce que les données nuancent.**

- **« Diviser par deux » l'immigration légale** (Philippe) n'est pas cohérent avec la composition des flux :
  - sur 377 000 premiers titres en 2025, 118 000 sont des titres étudiants, souvent temporaires et économiquement favorables ;
  - 117 000 relèvent de l'humanitaire et d'autres motifs, en grande partie imposés par le droit d'asile ;
  - ramener le total à environ 190 000 supposerait de couper fortement l'immigration étudiante ou familiale, ou de déroger aux conventions.
  - Avec un tel solde, la projection Insee « migration basse » prévoit une baisse de la population dès 2028.
- Les quotas votés existaient déjà dans la loi de 2024. Leur caractère contraignant a été censuré (le Parlement ne peut pas être lié par avance). Il faudrait donc une base constitutionnelle.
- L'immigration de travail **a reculé** en 2025 (−13 %) : la priorité affichée n'est pas encore une réalité.

### 5.4 Parti socialiste et Place publique (Raphaël Glucksmann)

Raphaël Glucksmann a remporté la primaire de la gauche le 11 octobre 2026 avec 66,1 % des voix (https://www.publicsenat.fr/actualites/politique/primaire-de-la-gauche-raphael-glucksmann-plie-le-match-et-remporte-le-scrutin-des-le-premier-tour-avec-66).

**Propositions** (projet « Acte I », https://place-publique.eu/pages/6mRSwq5tuSrSi68Cw1IADX/l-acte-i) `⚠️ détail via votons-2027` :

- abrogation de la loi de 2024 ;
- asile européen harmonisé, fin du système de Dublin, refus de l'externalisation ;
- voies légales d'immigration de travail, avec des accords liant visas et réadmission ;
- carte de séjour pluriannuelle comme titre de référence ;
- exécution effective des OQTF délivrées, mais fin de la « politique du chiffre » ;
- régularisation des travailleurs sans papiers, cours de français jusqu'au niveau A2 ;
- droit au travail dès l'enregistrement de la demande d'asile ;
- **convention citoyenne** sur l'immigration.

Citation : « Non, l'immigration zéro n'est ni souhaitable, ni possible. Et non, s'installer en France n'est pas un droit universel. » (LCP, 26 mai 2026 : https://lcp.fr/actualites/presidentielle-raphael-glucksmann-devoile-les-premieres-lignes-de-son-possible-programme)

Olivier Faure, battu à la primaire, proposait de régulariser environ 400 000 travailleurs sur le modèle espagnol `⚠️`.

**Meilleure défense.** Des centaines de milliers de personnes travaillent déjà en France sans droits. Les régulariser sous conditions servirait l'ordre public, les finances sociales et la dignité. Une politique régulée et européenne retirerait le sujet à l'extrême droite sans renoncer au contrôle.

**Ce que les données appuient.**

- La régularisation espagnole de 2005 n'a pas eu d'effet d'appel détecté et a rapporté environ 4 000 € de recettes par personne (§ 3.3).
- Le droit au travail des demandeurs d'asile est cohérent avec le diagnostic : le problème français est l'**emploi** des immigrés (§ 3.2).
- Le principe d'une convention citoyenne rejoint la méthode de démocratie directe de l'auteur.

**Ce que les données nuancent.**

- Les résultats espagnols portent sur un contexte de forte croissance (2005) et sur une seule régularisation ; ils ne se transposent pas automatiquement.
- Abroger la loi de 2024 ne règle pas le taux d'exécution des éloignements. Le programme reste peu précis sur les moyens de faire exécuter les OQTF.

### 5.5 La France insoumise (Jean-Luc Mélenchon)

Candidature annoncée le 3 mai 2026. Programme : *L'Avenir en commun* (https://melenchon2027.fr/programme2025/livre/), nouvelle édition annoncée pour le 6 novembre 2026 (« disponible le 6 novembre en librairie », page d'accueil lue le 31/10/2026). `⚠️ chapitre migrations non lu` : les pages officielles melenchon2027.fr se chargent sans le texte du chapitre ; un extrait de recherche de la page officielle (chapitre 16, section 7) mentionne régularisation des travailleurs, étudiants et parents d'enfants scolarisés, carte de dix ans, dépénalisation du séjour irrégulier, fin de la rétention des enfants, suspension de Dublin, rattachement de l'Ofpra aux Affaires étrangères, abrogation de la loi asile et immigration, rétablissement du droit du sol ; droit de vote des étrangers et AME non retrouvés à la source officielle.

**Propositions.**

- régularisation des travailleurs, des étudiants et des parents d'enfants scolarisés ;
- carte de séjour de 10 ans comme titre de référence ;
- abrogation des lois récentes sur l'asile et l'immigration ;
- droit du sol intégral ;
- droit de vote des étrangers aux élections locales ;
- suspension du règlement de Dublin ;
- maintien de l'AME ;
- fin de l'enfermement des enfants en centre de rétention.

**Meilleure défense.** Les migrations sont structurelles (guerres, climat, inégalités). Les durcissements fabriquent de l'irrégularité et de l'exploitation sans réduire les flux. La stabilité du séjour serait le meilleur levier d'intégration.

**Ce que les données appuient.**

- L'arrêt du programme Bracero n'a pas fait monter les salaires des natifs (§ 4.1).
- La régularisation espagnole n'a pas eu d'effet d'appel détecté (§ 3.3).
- La discrimination à l'embauche est mesurée : −31,5 % de rappels pour un nom à consonance maghrébine (§ 3.2).
- Les restrictions ont souvent un effet faible sur le total des flux : en 2025, la circulaire Retailleau coexiste avec un total de titres en hausse.

**Ce que les données contredisent ou nuancent.**

- Le programme ne dit rien du coût budgétaire net de l'immigration d'asile et familiale peu qualifiée, qui est négatif dans toutes les études ventilées (§ 3.1).
- Il ignore l'effet d'appel des prestations (Danemark, § 4.2), qui deviendrait central avec un revenu universel.
- Une carte de 10 ans d'emblée, avec des prestations immédiates, maximise ce risque.
- Le taux d'emploi des immigrés non européens (63 %) montre que la stabilité du séjour ne suffit pas.

### 5.6 Les Écologistes (Marine Tondelier)

Marine Tondelier a été désignée candidate. Un vote des adhérents prévu en décembre 2026 doit trancher entre le maintien de sa candidature et le soutien à un autre candidat (https://lcp.fr/actualites/candidature-a-la-presidentielle-pas-de-choix-definitif-des-ecologistes-avant-la-mi). Projet 2027 : https://lesecologistes.fr/pages/6ImK65GKUnvibm33WGkjkj/projet-2027 `⚠️ page inaccessible, mesures via votons-2027`.

**Propositions.**

- AME et prise en charge des frais de santé (PUMA) sans délai de carence ;
- droit du sol pour tout enfant né en France ;
- fin des refoulements illégaux aux frontières ;
- révision du Pacte européen pour créer des voies légales ;
- remplacement de Frontex par une agence de sauvetage ;
- fin de la « production de sans-papiers » par la complexité du droit.

**Meilleure défense.** Le droit d'asile est un engagement juridique et moral non négociable. Militariser les frontières déplace les routes et augmente les morts sans tarir les départs. Les migrations climatiques sont inévitables : mieux vaut les organiser.

**Ce que les données appuient.**

- La complexité administrative fabrique de l'irrégularité ; l'exécution d'une OQTF sur sept en témoigne indirectement.
- Le droit d'asile s'impose juridiquement (Convention de Genève, droit de l'UE).

**Ce que les données nuancent.**

- Le volume des « migrations climatiques » vers l'Europe reste très incertain dans la littérature, et cette recherche ne l'a pas couvert.
- Les mêmes réserves budgétaires que pour LFI s'appliquent (§ 3.1).

### 5.7 Reconquête (Éric Zemmour)

En 2022, Reconquête proposait « l'immigration zéro », un ministère de la « remigration », la suppression du droit du sol, de l'AME et du regroupement familial. `⚠️` Aucun programme 2027 n'a été vérifié.

Ce que disent les données : un solde migratoire nul ferait baisser la population en âge de travailler d'environ 1,6 million de personnes en 2050 et 2,4 millions en 2070 (Eurostat, § 2.3). Les dépenses de retraite augmenteraient d'au moins 1,1 point de PIB (COR, variante +70 000, qui est moins extrême qu'un solde nul).

### 5.8 Lecture transversale [Interprétation]

| Enjeu | Gauche (LFI, Écologistes) | Gauche réformiste (PS, Place publique) | Centre (Attal, Philippe) | Droite (LR, RN) | Ce que tranchent les données |
|---|---|---|---|---|---|
| Volume total | ne pas restreindre | réguler | réduire et sélectionner | réduire fortement | la composition compte plus que le volume |
| Immigration familiale | droits élargis | maintien | durcir ou suspendre | réduire ou supprimer | levier budgétaire réel, mais protégé par le droit à la vie familiale (art. 8 de la CEDH) |
| Immigration de travail | régulariser | voies légales | priorité, quotas, points | limiter (RN) | contribution positive si qualifiée ou bien employée |
| Éloignements | humaniser | exécuter sans « chiffre » | exécuter | expulser systématiquement | taux d'exécution de 14 % : tous promettent, aucun n'a su faire |
| Prestations | égalité immédiate | égalité | alignement européen | réservées ou conditionnées à 5 ans | une condition de durée est possible, mais 5 ans a été censuré |
| Droit du sol | intégral | maintien | Mayotte seulement | supprimer | aucune donnée ne relie le droit du sol aux flux |

Points communs :

- **Tous les camps ignorent l'interaction avec l'automatisation**, alors qu'elle change le calcul à long terme (§ 4).
- **Personne ne chiffre l'effet démographique et budgétaire de son propre programme.** C'est un angle d'attaque naturel pour le manifeste : simuler chaque programme avec les variantes de l'Insee et du COR.

---

## 6. Ce qui reste vraiment incertain

1. **Le coût budgétaire net de l'immigration en France, par motif.** Aucune étude française récente et revue par les pairs ne ventile par motif d'entrée sur le cycle de vie, à la manière danoise ou néerlandaise. Les chiffres disponibles vont de −1,4 % à +1 % du PIB selon les conventions. **C'est la donnée la plus utile qui manque au débat.** Il faudrait demander à l'Insee, à la DGEF et à la DGFiP un appariement des fichiers de titres de séjour (AGDREF) avec les données fiscales.
2. **Le stock d'immigrés en situation irrégulière.** Il n'existe aucune mesure ; l'AME (environ 460 000 bénéficiaires) n'est qu'une borne basse.
3. **L'effet d'appel d'un revenu universel.** Aucune expérience ne le mesure. La meilleure étude indirecte (Danemark) est contestée d'un facteur 5 à 10.
4. **Le rythme de la robotisation des métiers physiques**, en particulier les soins et le BTP. Il conditionne tout le raisonnement de long terme.
5. **Le solde migratoire lui-même.** L'Insee le mesure par différence, avec un aléa de sondage. Les valeurs 2023-2025 sont conventionnelles.

---

## 7. Points à vérifier (à reporter dans `verifications.md` si utilisés)

- ✅ Chiffres DGEF 2025 : lus sur le site du ministère (publication du 30/06/2026) ; ✅ acquisitions de nationalité (98 139, Insee) et demandes d'asile (151 665, Eurostat ; 145 210 à l'Ofpra, taux 41,2 %) lues le 31/10/2026 ; ✅ éloignements DGEF (14 133 forcés, 23 549 au total) et taux synthétique de protection (52,1 %) lus dans le dépliant DGEF de juillet 2026 (31/10/2026) ; *Rapport au Parlement 2025* (28/09/2026) lu : 15 253 forcés, 4 564 aidés, 4 458 spontanés, total 24 275, champ « France métropolitaine, tous pays, majeurs » (tableau p. 65) ; le dépliant donne 14 133 / 4 564 / 4 852 / 23 549 sur le même champ annoncé : **l'écart (1 120 forcés, 726 au total) n'est pas expliqué par les passages lus** `⚠️` (voir la section du 31/10/2026 ci-dessous).
- `⚠️` OCDE 2021 pour la France (−0,53 % ou +1,02 % du PIB selon le périmètre) : figures et annexe 4.A non consultées ; texte du chapitre lu (31/10/2026).
- `⚠️` Cour des comptes (janvier 2024) : 447 257 OQTF, taux « autour de 10 % » (12 % à la page de présentation) et 1,8 Md€ lus dans la synthèse du PDF (31/10/2026) ; « 16 000 » lu (page de présentation) ; 134 280 et 15 400 lus (p. 98) ; rapport Rodwell : synthèse lue (2,1 Md€, 15 %, 156 058, 14 133), corps non relu.
- `⚠️` Danemark : PDF du ministère des Finances hors ligne ; chiffres issus de réponses parlementaires et de résumés.
- `⚠️` Pays-Bas : chiffres par motif repris de la presse (Euronews), pas du livre lui-même.
- `⚠️` Ined 2019, contribution des immigrées à la fécondité (environ 0,1 enfant par femme ; 1,77 et 1,88 non retrouvés ; site Ined indisponible).
- `⚠️` COR : hypothèse de taux d'emploi des immigrés supplémentaires dans la variante migratoire.
- `⚠️` EUROPOP2023 : définitions lues (−33 %, +33 % d'immigration extra-UE ; solde nul) ; l'incohérence apparente entre migration basse et migration nulle est confirmée par un recalcul sur l'API Eurostat (31/10/2026) mais reste inexpliquée.
- ✅ CNOM, Atlas 2025 : 14,6 % lu dans le PDF (actifs réguliers, p. 142) ; 7,2 % de 2010 levé le 01/11/2026 (Atlas 2026, p. 134 : 7,2 % en 2010 → 15,2 % en 2026, activité régulière ; V1906).
- ✅ Lewis (2011) lu (résumé, 31/10/2026). `⚠️` directive 2003/109, programme de Macao : cités de mémoire. ✅ *Zobel v. Williams* et *Dano* vérifiés (31/10/2026).
- `⚠️` Elias, Monras & Vázquez-Grenno : effet sur les natifs peu qualifiés (versions divergentes).

---

## 8. Synthèse des sources mobilisées

- **Statistique publique française.** Insee (stock 2025, flux 2024, bilan démographique 2025, projections 2026, descendants), COR (rapport annuel 2026, document du 16 avril 2026), Dares (métiers des immigrés, testing), Drees (autonomie 2050), Cour des comptes, Conseil constitutionnel. Ces sources établissent les niveaux, les tendances et la sensibilité des retraites à la migration.
- **Statistique européenne.** Eurostat : premiers titres, asile, éloignements, nés à l'étranger, fécondité, EUROPOP2023, taux d'emploi par pays de naissance. Elle établit que la France est dans la moyenne européenne pour les stocks et les flux, mais en retard pour l'emploi des immigrés et l'exécution des éloignements.
- **Recherche revue par les pairs.**
  - Finances publiques : CEPII/*Revue économique* (Chojnicki et al.).
  - Salaires : JEEA (Edo), *Labour Economics* (Ortega-Verdugo), National Academies.
  - Régularisation : JOLE (Elias, Monras & Vázquez-Grenno).
  - Automatisation : *Review of Economic Studies* (Acemoglu-Restrepo), *Journal of Public Economics* (Danzer et al.), AER (Clemens et al.), *Revue canadienne d'économique* (Basso et al.).
  - Effet d'appel : AER: Insights (Agersnap et al.) et sa réanalyse.
  - Revenu universel : *Basic Income Studies* (Howard).
  - Ces travaux établissent un effet moyen faible de l'immigration sur les salaires et les finances, mais des effets hétérogènes selon le motif, et une substitution partielle entre immigration et automatisation.
- **Travaux étrangers administratifs ou non revus.** Danemark (ministère des Finances), Pays-Bas (*Grenzeloze verzorgingsstaat*), Royaume-Uni (OBR, MAC, via la Migration Observatory), OID. Ils sont utiles pour la ventilation par motif, mais à manier avec précaution.
- **Asie.** Japon (ministère de la Santé et du Travail, Agence des services de l'immigration), Corée (recensement, quotas E-9), IFR (densité robotique), Wright (2023). Ils établissent que la robotisation la plus avancée du monde coexiste avec une immigration de travail en hausse.

---

## Notes

[^insee-essentiel]: Insee, « L'essentiel sur... les immigrés et les étrangers », mise à jour du 25/06/2026. https://www.insee.fr/fr/statistiques/3633212 (consulté le 2026-10-25).
[^insee-flux]: C. Pariset, « Flux migratoires : les entrées sur le territoire diminuent en 2024 et retrouvent leur niveau d'avant-crise sanitaire », Insee Première n° 2107, 04/06/2026. https://www.insee.fr/fr/statistiques/8998082
[^cor-tendances]: COR, séance du 16 avril 2026, document n° 4, « Dernières tendances démographiques et économiques ». https://www.cor-retraites.fr/sites/default/files/2026-04/Doc_04_tendances_d%C3%A9mo_%C3%A9co.pdf
[^es-resfirst]: Eurostat, migr_resfirst (premiers titres de séjour), mise à jour du 22/10/2026. https://ec.europa.eu/eurostat/databrowser/view/migr_resfirst/default/table ; population : demo_pjan.
[^dgef2025]: Ministère de l'Intérieur (DGEF/DSED), chiffres annuels 2025 publiés le 27/01/2026, via R. David, Public Sénat/AFP, 27/01/2026. https://www.publicsenat.fr/actualites/societe/immigration-titres-de-sejour-en-nette-hausse-et-regularisations-en-baisse-sur-lannee-2025 ; source officielle lue le 31/10/2026 : DGEF/DSED, *Les titres de séjour en 2025*, 30/06/2026, https://www.immigration.interieur.gouv.fr/documentation/etudes-et-statistiques/titres-de-sejour-en-2025-protections-subsidiaires-ont-plus-que-double.html ; *Rapport au Parlement 2025* (28/09/2026) : https://www.immigration.interieur.gouv.fr/sites/dgef/files/medias/documents/2026-10/INTV2623196X_Rapport%20au_Parlement_2025_28sept2026.pdf ; OFPRA 2025 via EUAA : https://dip.euaa.europa.eu/node/13714.
[^es-asyapp]: Eurostat, migr_asyappctza. https://ec.europa.eu/eurostat/databrowser/view/migr_asyappctza/default/table
[^es-asydc]: Eurostat, migr_asydcfsta (décisions de première instance). https://ec.europa.eu/eurostat/databrowser/view/migr_asydcfsta/default/table
[^es-return]: Eurostat, migr_eiord et migr_eirtn. https://ec.europa.eu/eurostat/databrowser/view/migr_eiord/default/table ; https://ec.europa.eu/eurostat/databrowser/view/migr_eirtn/default/table
[^ccomptes]: Cour des comptes, « La politique de lutte contre l'immigration irrégulière », janvier 2024, via Public Sénat : https://www.publicsenat.fr/actualites/politique/immigration-quand-la-cour-des-comptes-reprend-les-constats-dun-rapport-senatorial et https://www.macommune.info/la-cour-des-comptes-appelle-letat-a-mieux-sorganiser-pour-les-expulsions-detrangers synthèse du PDF lue le 31/10/2026 (https://www.ccomptes.fr/sites/default/files/2024-02/20240104_Politique-lutte-contre-immigration-irreguliere.pdf) ; page de présentation lue le 31/10/2026 : https://www.ccomptes.fr/fr/publications/la-politique-de-lutte-contre-limmigration-irreguliere.
[^rodwell]: Assemblée nationale, commission des finances, rapport d'information n° 3178 de C. Rodwell, « Coûts et moyens budgétaires nécessaires pour mener une politique de lutte efficace contre l'immigration irrégulière », enregistré le 16/09/2026. https://www.assemblee-nationale.fr/dyn/opendata/RINFANR5L17B3178.html (synthèse lue le 31/10/2026) ; compte rendu de l'examen : https://www.assemblee-nationale.fr/dyn/17/comptes-rendus/cion_fin/l17cion_fin2526131_compte-rendu.pdf.
[^ame]: Assemblée nationale, rapport spécial PLF, mission Santé. https://www.assemblee-nationale.fr/dyn/17/rapports/cion_fin/l17b1996-tiii-a40_rapport-fond.pdf ; Sénat, rapport PLF 2026. https://www.senat.fr/rap/l25-139-327/l25-139-327-syn.pdf
[^es-pop]: Eurostat, migr_pop3ctb (population par pays de naissance), mise à jour du 25/09/2026. https://ec.europa.eu/eurostat/databrowser/view/migr_pop3ctb/default/table
[^es-fert]: Eurostat, demo_find. https://ec.europa.eu/eurostat/databrowser/view/demo_find/default/table
[^insee-bilan]: Insee, « Bilan démographique 2025 », Insee Première n° 2087, janvier 2026. https://www.insee.fr/fr/statistiques/8719824
[^insee-proj]: N. Blanpain, J. Pointet, H. Thélot, « Projections de population à l'horizon 2070 », Insee Première n° 2108, 08/06/2026. https://www.insee.fr/fr/statistiques/9004289
[^es-proj]: Eurostat, EUROPOP2023, proj_23ndbi et proj_23np. https://ec.europa.eu/eurostat/databrowser/view/proj_23ndbi/default/table
[^cor2026]: Conseil d'orientation des retraites, « Rapport annuel », juin 2026 (synthèse p. 21-23 ; partie 1 § 1.2 et 1.5 ; partie 2 chap. 5 § 1.3). https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf
[^cepii]: X. Chojnicki, L. Ragot, N.-P. Sokhna, « The Fiscal Impact of 30 Years of Immigration in France: (I) an Accounting Approach », CEPII WP 2018-04. https://www.cepii.fr/PDF_PUB/wp/2018/wp2018-04ang.pdf ; version publiée : *Revue économique* 73(4), 2022. https://shs.cairn.info/journal-revue-economique-2022-4-page-529?lang=en
[^ocde2021]: OCDE, *International Migration Outlook 2021*, chap. 4 « The fiscal impact of immigration in OECD countries ». https://doi.org/10.1787/4ccb6899-en ; chiffres France via iFRAP (12/01/2022) : https://www.ifrap.org/etat-et-collectivites/immigration-couts-et-gains-pour-leconomie-francaise et CNews (28/10/2021) : https://www.cnews.fr/monde/2021-10-28/selon-locde-limmigration-ne-coute-rien-et-peut-meme-rapporter-1143327 ; texte du chapitre lu le 31/10/2026 : https://www.oecd.org/en/publications/international-migration-outlook-2021_29f23e9d-en/full-report/component-8.html `⚠️ chiffres France non retrouvés dans le texte`
[^jj]: Fondation Jean-Jaurès, « Le coût de l'immigration en France : une "fake news" à l'épreuve de la vérité ». https://www.jean-jaures.org/publication/le-cout-de-limmigration-en-france-une-fake-news-a-lepreuve-de-la-verite/ ; OID : https://observatoire-immigration.fr/limpact-de-limmigration-sur-leconomie-francaise/
[^mo-uk]: C. Vargas-Silva, M. Sumption, B. Brindle, « The fiscal impact of immigration in the UK », Migration Observatory (Oxford), 23/06/2026. https://migrationobservatory.ox.ac.uk/resources/briefings/the-fiscal-impact-of-immigration-in-the-uk/
[^dk]: Finansministeriet, « Indvandreres nettobidrag til de offentlige finanser i 2018 » (2021). https://fm.dk/media/0qmmvey5/indvandreres-nettobidrag-til-de-offentlige-finanser-i-2018.pdf (hors ligne le 2026-10-25) ; Dansk Erhverv, mai 2025 : https://www.danskerhverv.dk/politik-og-analyser/analyser/2025/maj-2025/positive-tendenser-trakker-i-retning-af-et-mindre-negativt-nettobidrag-for-indvandrere-fra-menapt-lande/ `⚠️`
[^nl]: J. van de Beek, H. Roodenburg, J. Hartog, G. Kreffer, *Grenzeloze verzorgingsstaat* (2021). https://www.wyniasweek.nl/wp-content/uploads/2021/03/Grenzeloze_Verzorgingsstaat.pdf ; vérification Euronews, 27/10/2025 : https://www.euronews.com/my-europe/2025/10/27/fact-check-how-much-do-immigrants-cost-the-netherlands
[^es-emploi]: Eurostat, lfsa_ergacob. https://ec.europa.eu/eurostat/databrowser/view/lfsa_ergacob/default/table
[^insee-desc]: Insee Références, « Insertion professionnelle des descendants d'immigrés », 30/03/2023. https://www.insee.fr/fr/statistiques/6793264
[^dares-testing]: Dares Analyses n° 67, novembre 2021, testing sur la discrimination à l'embauche. https://migrant-integration.ec.europa.eu/system/files/2022-01/Dares%20Analyses_testing_discrimination_embauche.pdf ; Insee : https://www.insee.fr/fr/statistiques/6793310
[^cae]: CAE, note n° 67, novembre 2021, citée par l'iFRAP (voir la note OCDE ci-dessus). `⚠️ note originale non relue`
[^insee-hdf]: Insee Analyses Hauts-de-France n° 188, février 2025. https://www.insee.fr/fr/statistiques/8348614
[^nas]: National Academies of Sciences, Engineering, and Medicine, *The Economic and Fiscal Consequences of Immigration*, 2017. https://www.nationalacademies.org/news/new-report-assesses-the-economic-and-fiscal-consequences-of-immigration
[^edo]: A. Edo, « The Impact of Immigration on Wage Dynamics: Evidence from the Algerian Independence War », *JEEA* 18(6), 2020, p. 3210-3260. https://ideas.repec.org/a/oup/jeurec/v18y2020i6p3210-3260..html
[^ov]: J. Ortega, G. Verdugo, « The impact of immigration on the French labor market: Why so different? », *Labour Economics* 29, 2014. https://openaccess.city.ac.uk/id/eprint/3644/
[^spain]: E. Elias, J. Monras, J. Vázquez-Grenno, « Understanding the effects of granting work permits to undocumented immigrants », *Journal of Labor Economics* 43(3), 2025. https://ideas.repec.org/a/ucp/jlabec/doi10.1086-730122.html ; résumé : https://www.ub.edu/school-economics/news/understanding-the-effects-of-granting-work-permits-to-undocumented-immigrants/
[^spain2026]: Maldita, « La regularización extraordinaria de personas migrantes en España », mise à jour du 08/07/2026. https://maldita.es/malditobulo/20260708/regularizacion-extraordinaria-inmigrantes-espana/
[^dares-metiers]: Dares Analyses n° 36, « Quels sont les métiers des immigrés ? », juillet 2021, tableau repris par l'Observatoire des inégalités. https://www.inegalites.fr/Les-immigres-exercent-plus-souvent-des-metiers-penibles
[^insee-idf]: Insee Analyses Île-de-France n° 160. https://www.insee.fr/fr/statistiques/6546101
[^cnom]: CNOM, Atlas de la démographie médicale 2025, tome 1. https://www.conseil-national.medecin.fr/sites/default/files/external-package/analyse_etude/1lz38w1/cnom_atlas_demographie_2025_tome_1.pdf ; chiffres via https://www.caducee.net/actualite-medicale/16679/de-7-a-11-la-progression-continue-des-medecins-formes-hors-de-france.html `⚠️ PDF CNOM (168 p.) ouvert le 31/10/2026 : seules les pages de méthode (p. 5 à 7) ont été lues, la page du chiffre de 14,6 % n'a pas été trouvée, marque maintenue`
[^metiers2030]: France Stratégie et Dares, *Les métiers en 2030*, mars 2022, via Banque des territoires. https://www.banquedesterritoires.fr/la-dares-et-france-strategie-identifient-les-metiers-les-plus-demandes-en-2030
[^drees]: Drees, Études et résultats n° 1365, février 2026 (modèle LIVIA). https://drees.solidarites-sante.gouv.fr/sites/default/files/2026-02/Embargo_ER1365.pdf
[^ar]: D. Acemoglu, P. Restrepo, « Demographics and Automation », *Review of Economic Studies* 89(1), 2022. https://www.nber.org/papers/w24421 ; MIT News : https://news.mit.edu/2021/aging-workers-automation-0915
[^ap]: A. L. Abeliansky, K. Prettner, « Automation and demographic change », Hohenheim DP 05-2017 ; VID WP 02/2021. https://wiso.uni-hohenheim.de/fileadmin/einrichtungen/wiso/Forschungsdekan/Papers_BESS/dp_2017-05_online.pdf
[^dfg]: A. M. Danzer, C. Feuerbaum, F. Gaessler, « Labor supply and automation innovation: Evidence from an allocation policy », *Journal of Public Economics*, 2024. https://edoc.ku.de/id/eprint/33404/
[^clp]: M. Clemens, E. Lewis, H. Postel, « Immigration Restrictions as Active Labor Market Policy: Evidence from the Mexican Bracero Exclusion », *AER* 108(6), 2018. https://pmc.ncbi.nlm.nih.gov/articles/PMC6040835
[^bpr]: G. Basso, G. Peri, A. Rahman, « Computerization and Immigration: Theory and Evidence from the United States », *Canadian Journal of Economics* 53(4), 2020. https://ideas.repec.org/p/nbr/nberwo/23935.html
[^ifr]: IFR, voir `sources/donnees/robotique_ifr_densite_pays.csv`. https://ifr.org/ifr-press-releases/news/robot-density-surges-in-europe-asia-and-americas
[^jp-work]: Ministère japonais de la Santé, du Travail et des Affaires sociales (MHLW), données du 30/01/2026, via Nippon.com et Tuoi Tre. https://news.tuoitre.vn/foreign-workers-in-japan-hit-record-257-million-103260130174306871.htm
[^jp-res]: Agence des services de l'immigration (Japon), données fin 2025, via Nippon.com. https://www.nippon.com/ja/japan-data/h02750/ ; mi-2026 : https://kumanichi.com/articles/2047152
[^kr]: Korea Times, 19/12/2025. https://www.koreatimes.co.kr/amp/southkorea/globalcommunity/20251219/vietnamese-lead-surge-as-koreas-foreign-resident-population-hits-record-high ; quotas E-9 : https://www.nationthailand.com/news/world/40060235
[^wright]: J. Wright, *Robots Won't Save Japan: An Ethnography of Eldercare Automation*, ILR Press/Cornell University Press, 2023. https://www.degruyterbrill.com/document/doi/10.1515/9781501768064/html
[^ak]: H. Agersnap, A. Jensen, H. Kleven, « The Welfare Magnet Hypothesis: Evidence from an Immigrant Welfare Scheme in Denmark », *AER: Insights* 2(4), 2020. https://www.aeaweb.org/doi/10.1257/aeri.20190510 ; réanalyse : J. Adema, I4R DP 302 (2026). https://ideas.repec.org/p/zbw/i4rdps/302.html
[^pfd]: Alaska Permanent Fund Dividend Division, « Immigration – alien status and eligibility for the PFD ». https://pfd.alaska.gov/Eligibility/Immigration
[^rsa]: Conseil constitutionnel, décision n° 2011-137 QPC du 17 juin 2011, commentaire. https://oos.cloudgouv-eu-west-1.outscale.com/ccqpc-drupal-prd/dqpc/commentaire/commentaire_D%C3%A9cision-n%C2%B0-2011-137-QPC-du-17-juin-2011.pdf
[^rip]: Conseil constitutionnel, décision n° 2024-6 RIP du 11 avril 2024, communiqué et texte lus le 31/10/2026 : https://www.conseil-constitutionnel.fr/actualites/communique/decision-n-2024-6-rip-du-11-avril-2024-communique-de-presse ; version anglaise : https://www.conseil-constitutionnel.fr/en/decision/2024/20246RIP.htm. L'article 1er (5 ans de résidence ou 30 mois d'affiliation) est jugé contraire aux 10e et 11e alinéas du Préambule de 1946 ; les articles 2 à 5 ne sont pas examinés.
[^howard]: M. W. Howard, « Basic Income and Migration Policy: A Moral Dilemma? », *Basic Income Studies* 1(1), 2006. https://www.degruyterbrill.com/document/doi/10.2202/1932-0183.1012/pdf

## Passe du 31/10/2026 (PDF lus dans Chrome : Rapport au Parlement, CNOM, Cour des comptes)

- **Rapport au Parlement 2025, *Les étrangers en France* (ministère de l'Intérieur, DGEF, 118 p., daté du 28/09/2026, https://www.immigration.interieur.gouv.fr/sites/dgef/files/medias/documents/2026-10/INTV2623196X_Rapport%20au_Parlement_2025_28sept2026.pdf, lu le 31/10/2026, p. 65)** : éloignements forcés 9 782 (2021), 11 171 (2022), 11 469 (2023), 12 633 (2024), **15 253 (2025, +20,7 %)** ; aidés 4 564 ; spontanés 4 458 ; total 24 275 ; champ « France métropolitaine, tous pays, majeurs ». Ventilation 2025 des forcés : 6 180 ressortissants de pays tiers vers un pays tiers, 6 596 vers l'UE/EEE/Suisse (réadmissions Schengen, transferts Dublin), 2 477 ressortissants de l'UE. Mesures prononcées : 156 180 (+7,6 %). Interpellations : 175 051. Bénéficiaires de l'AME : 458 681 fin septembre 2025.
- **Écart avec le dépliant (14 133 forcés, 23 549 au total)** : le rapport annonce le même champ (métropole, tous pays, majeurs) ; les aidés sont identiques (4 564), les spontanés diffèrent dans l'autre sens (4 458 contre 4 852). L'écart n'est donc pas un simple changement de périmètre lisible dans les textes ; hypothèse non vérifiée : consolidation ultérieure des données de la DNPAF (le rapport est postérieur au dépliant de juillet). **⚠️ maintenu** : citer 15 253 avec « Rapport au Parlement 2025 » et 14 133 avec « dépliant DGEF, données provisoires », jamais l'un pour l'autre ; le 15 569 de la presse (janvier) reste périmé.
