---
titre: Chapitre 1 « La révolution est déjà là » : état des preuves
statut: brouillon sourcé
consultation: 2026-11-03
---

# Chapitre 1 : ce que les données établissent et ce qu'elles n'établissent pas

Ce dossier accompagne les trois modèles du chapitre (`modeles/acceleration/`, `modeles/rattrapage-robotique-ia/`, `modeles/recherche-et-ia/`) et le registre `verifications.md` (V6450-V6464, V6550-V6571). Il sépare trois choses que le titre du chapitre tend à confondre : **ce qui est mesuré** (adoption, investissement, capacités), **ce qui est promis** (bascule, remplacement des cols blancs) et **ce qui est mesuré sur la productivité et l'emploi**.

Transparence : ce texte est écrit par Claude, une IA d'Anthropic, qui vend des outils d'IA. Sur « l'IA change tout », c'est un conflit d'intérêts, et il pousse à surestimer.

## 1. Ce que les données établissent

### 1.1 Les capacités ont franchi des seuils mesurés

- Sur GPQA Diamond (questions de sciences de niveau doctorat), la précision moyenne atteint 93 % en 2025, contre 81,2 % pour les experts humains validateurs ; o3 est le premier à dépasser ce seuil fin 2024 (87,7 %) ([Stanford HAI, AI Index 2026, p. 94](https://hai.stanford.edu/assets/files/ai_index_report_2026.pdf), d'après Epoch AI, consulté le 03/11/2026). V128.
- Sur SWE-bench Verified (corriger de vraies issues GitHub), les meilleurs modèles sont à 70-77 % en février 2026 (Claude Opus 4.5 : 76,8 %) ; la formule « proche de 100 % » de l'AI Index désigne la performance **rapportée à la référence humaine**, pas un taux de réussite absolu. L'AI Index précise que les modèles restent **sous** la référence humaine en ingénierie logicielle autonome et en usage d'ordinateur. V128 corrigée (V6453).
- Un modèle a obtenu une médaille d'or à l'Olympiade internationale de mathématiques, mais lit une horloge analogique correctement 50,1 % du temps ; les robots ne réussissent que 12 % des tâches ménagères (AI Index 2026, points clés) : c'est la « frontière en dents de scie ».
- L'écart États-Unis / Chine sur la performance des modèles est « effectivement refermé » (mars 2026 : 2,7 % d'écart pour le meilleur modèle américain) (AI Index 2026).

### 1.2 L'adoption est rapide, mais la mesure dépend de qui on interroge

| Mesure | Valeur | Périmètre | Source |
|---|---|---|---|
| Organisations qui utilisent l'IA | 88 % (2025) ; IA générative dans une fonction : 70 % ; agents : un chiffre | Enquête auprès d'organisations (grandes en majorité, non représentative) | AI Index 2026, ch. 4 |
| Entreprises de l'UE (≥ 10 salariés) qui utilisent au moins une technologie d'IA | 13,5 % (2024) puis **19,95 % (2025)** ; France 9,9 % puis **18,2 %** ; Allemagne 19,8 % puis 26,0 % ; Danemark 27,6 % puis **42,0 %** | Statistique officielle, échantillon représentatif | [Eurostat isoc_eb_ai](https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ai/default/table), interrogé par API le 03/11/2026 |
| Population adulte utilisant l'IA générative | ≈ 53 % en trois ans | Mondial, enquêtes | AI Index 2026 |

Lecture : 88 % et 20 % ne se contredisent pas, ils mesurent deux populations. **Pour un manifeste qui parle à la France, le chiffre robuste est 18 % des entreprises (2025), contre 9,9 % un an plus tôt.** C'est une adoption qui double en un an, et qui reste minoritaire.

### 1.3 L'investissement est massivement américain

- Investissement privé en IA en 2025 : États-Unis 285,9 Md$ (23 fois la Chine), Chine 12,4 Md$, Europe 20,9 Md$ (périmètre Quid, Royaume-Uni compris), France 4,4 Md$ (AI Index 2026, ch. 4, relu le 03/11 sur la page de HAI et dans le PDF du chapitre). **Réserve** : ce périmètre est celui des levées des entreprises d'IA ; il omet les fonds publics. Les fonds d'orientation publics chinois auraient déployé ≈ 184 Md$ vers des entreprises d'IA de 2000 à 2023 (sur 912 Md$ tous secteurs), estimation de Beraja et coll. (2024) reprise par l'AI Index, p. 184 : V400 vérifiée (V6450).
- Investissements en capital des quatre grands (Alphabet, Amazon, Meta, Microsoft) : en 2025, seul Amazon dépasse 100 Md$ (131,8 Md$ ; tous usages) ; Alphabet 91,4, Meta 69,7, Microsoft 64,6 (exercice juillet 2024-juin 2025). Les annonces pour 2026 dépassent 100 Md$ pour chacun (Meta 140, Microsoft 175, Alphabet 200, Amazon 220), mais ce sont des annonces, avec des définitions différentes (V6455 ; données SEC dans `sources/donnees/ia_eco_capex_hyperscalers.csv`).
- Puces européennes : le Chips Act annonce au moins 43 Md€ d'investissements publics, appariés à autant de privé (≥ 86 Md€) ; la Commission n'en porte directement que ≈ 4,5 Md€ (Horizon Europe et Digital Europe) ; la part européenne de la production mondiale devrait n'atteindre que 11,7 % en 2030 selon la prévision de la Commission (juillet 2024), contre un objectif de 20 % : la Cour des comptes européenne juge l'objectif très peu probable ([rapport spécial 12/2025](https://www.eca.europa.eu/ECAPublications/SR-2025-12/SR-2025-12_EN.pdf), §05, §40, consulté le 03/11/2026). V406 vérifiée (V6451).

### 1.4 La Chine installe, l'Europe utilise

- La Chine a installé 54 % des robots industriels du monde en 2024 (295 000 unités, contre 51,1 % en 2023) ; croissance mondiale plate (AI Index 2026 ; [IFR](https://ifr.org/ifr-press-releases/news/robot-density-surges-in-europe-asia-and-americas)). Le jeu de données du projet porte à 59 % (354 000) l'édition 2026 de l'IFR (`modeles/rattrapage-robotique-ia/donnees/investissements_pays.csv`).
- Densité 2024 (robots pour 10 000 salariés de l'industrie manufacturière) : Corée 1 220, Singapour 818, Allemagne 449, Japon 446, États-Unis 307, UE 231 ; Chine 166 **après révision de l'emploi chinois** (470 dans l'édition précédente : rupture de série, ne pas comparer) (IFR, 04/2026, relu le 03/11).

### 1.5 Énergie, calcul, recherche, brevets

- Centres de données : ≈ 415 TWh en 2024 (1,5 % de l'électricité mondiale ; États-Unis 45 %, Chine 25 %, Europe 15 %) ; scénario de base de l'AIE : ≈ 945 TWh en 2030. Ce sont des projections ([AIE, Energy and AI, 2025](https://www.iea.org/reports/energy-and-ai/executive-summary)).
- Les États-Unis hébergent 5 427 centres de données, plus de dix fois n'importe quel autre pays ; TSMC fabrique presque toutes les puces d'IA de pointe (AI Index 2026).
- JUPITER, premier supercalculateur exascale européen (≈ 24 000 puces NVIDIA GH200), inauguré à Jülich le 05/09/2025 ; 19 « usines d'IA » EuroHPC en novembre 2025 ([EuroHPC JU](https://eurohpc-ju.europa.eu/jupiter-launching-europes-exascale-era-2025-09-05_en)). Communiqué du 05/09/2025 lu en entier le 03/11/2026 : « premier supercalculateur exascale européen », environ 24 000 GH200, jusqu'à 80 exaFLOP/s en IA (précision 8 bits, matrices creuses : ce n'est pas la mesure du calcul scientifique) ; le communiqué parle alors de **13 usines d'IA** (19 selon la page de la Commission lue ensuite) : V6558, V6590.
- Dépense de R&D (% du PIB) : UE 27 2,25 % (2023), 2,26 % (2024) ; **France 2,17 % puis 2,18 %** ; Allemagne 3,10 puis 3,12 ; États-Unis 3,42 puis 3,44 ; Chine 2,58 puis 2,69 ; Corée 4,94 puis 5,13 ([Eurostat rd_e_gerdtot](https://ec.europa.eu/eurostat/databrowser/view/rd_e_gerdtot/default/table), API, 03/11/2026). **Correction** : la France est un peu **sous** la moyenne de l'UE, pas au-dessus (le 2,14 % de l'UE du tableau OCDE/SIES est inférieur de 0,11 point à Eurostat) : V366, V6458.
- Brevets : 3,7 millions de demandes dans le monde en 2024 (+ 4,9 %), dont ≈ 1,8 million à l'office chinois ([OMPI, WIPI 2025](https://www.wipo.int/edocs/pubdocs/en/wipo-pub-941-2025-en-world-intellectual-property-indicators-2025.pdf)) ; à l'OEB en 2025 : 201 974 demandes, informatique en tête avec 17 844 (+ 6,1 %), États-Unis 47 008, Chine 22 031 (3e, 10,9 %) ([OEB](https://www.epo.org/en/news-events/news/demand-european-patents-2025-exceeded-200-000-first-time)). OMPI relue le 03/11/2026 dans le PDF (WIPI 2025, p. 9 et 10 : 3,7 millions, + 4,9 %, 1,8 million en Chine, soit plus de trois fois l'office américain) ; OEB relu sur le communiqué du 24/03/2026 (201 974, + 1,4 % ; informatique 17 844, + 6,1 % ; Chine + 9,7 % et troisième origine pour la première fois ; États-Unis en baisse de 1,6 %) ; **non retrouvés dans le texte** : 47 008 (États-Unis) et 22 031 (Chine), qui sont dans des graphiques dynamiques du tableau de bord de l'OEB (22 031 / 201 974 = 10,9 % est cohérent). Les brevets mesurent le dépôt, pas l'usage ni la qualité.

### 1.6 Plans nationaux : annoncé / engagé / dépensé

Trois mots que la presse confond. **Annoncé** : un chiffre dit en public (souvent public et privé mêlés, souvent « jusqu'à »). **Engagé** : voté, contractualisé ou signé. **Dépensé** : réellement versé. Seul un cas, les États-Unis, a un chiffre de dépense publié par un auditeur indépendant (GAO) ; pour tous les autres, le dépensé n'est pas publié. Lu le 03/11/2026 ; entrées V6550 à V6571.

| Pays, plan | Annoncé | Engagé (voté ou signé) | Dépensé | Part publique | Source principale |
|---|---|---|---|---|---|
| États-Unis, CHIPS Act (puces) | 50 Md$ (39 fabrication + 11 R&D), loi de 2022 | ≈ 31,2 à 31,7 Md$ d'aides directes (49 projets, 24 entreprises) + 6,8 Md$ de prêts | **13,1 Md$ au 04/2026 (≈ 42 %)** | 100 % budget fédéral | NIST ; GAO-26-109121 (06/08/2026) |
| États-Unis, Intel | 8,9 Md$ converties en 9,9 % du capital (+ 2,2 Md$ déjà versés) | Conversion faite en 08/2025 | 7,865 Md$ de dépenses éligibles retenues | Subventions existantes, « pas d'argent nouveau » | Intel (8-K) ; GAO |
| États-Unis, Stargate | 500 Md$ en quatre ans, 100 Md$ « immédiatement » | Non public | Non publié | **0 %** (privé) | OpenAI (extraits) |
| Chine, fonds national de capital-risque | ≈ 1 000 Md CNY (138 Md$) de capitaux à attirer | 100 Md CNY d'apport budgétaire (≈ 14 Md$), obligations spéciales | Non publié (lancé le 26/12/2025) | ≈ 10 % de l'annonce | NDRC (26/12/2025) |
| Chine, Big Fund III (puces) | 344 Md CNY (≈ 42 Md€) de capital | Enregistré le 24/05/2024 | Apports échelonnés sur 10 ans, non versés en totalité | Mixte : Finances, banques d'État, collectivités | China Securities Journal |
| Chine, plan IA 2017 | Cibles : industrie cœur > 400 Md CNY en 2025, > 1 000 Md en 2030 | Aucune dotation chiffrée lue | Sans objet | Sans objet | Traduction DigiChina |
| Chine, humanoïdes (MIIT 2023, NDRC 2025) | Aucun budget ni volume chiffré | Sans objet | Sans objet | Sans objet | Xinhua ; NDRC (27/11/2025) |
| Corée, fonds national de croissance | 150 000 Md KRW (≈ 97 Md€) sur 5 ans | 75 000 Md KRW de fonds des industries stratégiques (banque publique) | Non publié | **État : 1 000 Md KRW (≈ 0,7 %)** | FSC (10/09/2025) |
| Japon, cadre IA et semi-conducteurs | ≥ 10 000 Md JPY de soutien public jusqu'à 2030 (≈ 63 Md€) | Budget 2026 proposé : 1 239 Md JPY, dont ≈ 780 Md pour Rapidus ; Rapidus : 2 354 Md JPY de R&D cumulée (presse) | Non publié | Public (selon le cadre) | METI (résumé) ; presse |
| UE, InvestAI | 200 Md€ « à mobiliser » dont 20 Md€ pour les gigafactories | Programmes existants reconduits ; appel d'offres des gigafactories lancé, sans lauréat lu | Non publié | La répartition 150 / 50 Md€ n'est pas dans les pages lues | Commission (page lue, communiqué illisible) |
| UE, EuroHPC | 10 Md€ « attendus » en 2021-2027 (UE + États) | 19 usines d'IA, 13 antennes | Non publié | Public | Commission |
| Royaume-Uni, calcul public | jusqu'à 2 Md£ 2025-2030 | Phasage par année (≈ 1 Md£ en 2025) | Non publié | 100 % public | gov.uk (23/04/2026) |
| France, stratégie IA | Phase 1 : 1,5 Md€ (2018-2022) ; phase 2 : 1 Md€ (DGE) ou 2,22 Md€ (presse) ou « près de 2,5 Md€ » (Bercy) | Non réconcilié | **Introuvable pour l'IA** ; France 2030 entière : 5,1 Md€ décaissés en 2025, 26 % décaissés mi-2025 (⚠️) | Public + cofinancements | DGE ; Sénat (résumé) |
| France, Sommet IA | 109 Md€ « d'investissements privés confirmés » | Intentions | Non démontré | **0 %** (privé, dont fonds étrangers) | Élysée (10/02/2025) |

**Lectures.**

- **Une petite fraction du « chiffre » annoncé est de l'argent public** : sur 150 000 Md KRW, l'État coréen met 1 000 ; sur 138 Md$ chinois, 14 Md$ ; sur 109 Md€ français, rien. Comparer 138 Md$ chinois à 50 Md$ américains est une erreur de nature.
- **Le seul taux de dépense connu est de 42 % après quatre ans** (CHIPS Act, voté en 2022). Avant toute comparaison de rythme entre pays, il faut ce taux pour les autres, qui n'existe pas.
- **Les montants se contredisent à l'intérieur d'un même pays** (France : 1, 2,22 ou 2,5 Md€ pour la phase 2) ; la correction du fonds chinois (138 Md$ de levier, 100 Md CNY de budget) vient d'une transcription officielle.
- Corrections apportées au projet : fonds chinois (V6552), fonds coréen (V6561), Fouju (V6566), règle de diffusion (V6569), objectif de formation français (V6563).

## 2. Ce que les données n'établissent pas

### 2.1 Les effets mesurés sur la productivité sont modestes au niveau de l'économie, plus forts au niveau de la tâche

**Études de terrain (micro)**

| Étude | Résultat | Remarque |
|---|---|---|
| Brynjolfsson, Li, Raymond (NBER w31161, QJE 2025) | + 14 % de problèmes résolus par heure en moyenne ; + 34 % pour les novices ; effet minimal pour les plus expérimentés ; 5 179 agents d'un centre d'appels | Un seul employeur, une seule tâche, un assistant conversationnel |
| Cui et coll. (2025), GitHub Copilot | + 26 % de demandes de fusion complétées | Tâche logicielle |
| Ju et Aral (2025) | + 50 % de production par marketeur | Résumé de l'AI Index |
| METR, Becker et coll. (2025) | **− 19 %** (développeurs expérimentés sur leurs propres dépôts) alors qu'ils se croyaient 20 % plus rapides ; l'AI Index note que METR n'a **pas pu répliquer** en fin 2025 (les développeurs refusent de travailler sans IA) | Le résultat est daté |

Source des quatre lignes : [NBER](https://www.nber.org/papers/w31161) pour Brynjolfsson ; AI Index 2026, ch. 4.4, fig. 4.4.27 pour les autres. V31 vérifiée (V6454).

**Au niveau macro**

- Acemoglu (« The Simple Macroeconomics of AI », NBER w32487, 2024) : au plus **+ 0,66 % de productivité globale des facteurs en dix ans**, et moins de 0,53 % en tenant compte des tâches difficiles à apprendre ; gains « non triviaux mais modestes » ; l'IA élargirait l'écart entre revenus du capital et du travail ([NBER](https://www.nber.org/papers/w32487)). Cette estimation est une hypothèse d'extrapolation à partir de l'exposition des tâches, **pas une mesure**.
- OCDE (Filippucci et coll., 2025), G7 : + 0,2 à + 1,3 point de croissance annuelle de productivité sur dix ans selon la spécialisation des pays (cité par l'AI Index) ; projection.
- Aldasoro et coll. (2026) : + 4 % de productivité du travail sur 12 000 entreprises européennes (2019-2024), l'effet croissant avec la formation (AI Index). Enquête de 6 000 dirigeants (Yotzov et coll., 2026) : adoption large, **gains réalisés minimes**, emploi projeté − 0,7 % sur trois ans.
- États-Unis : productivité + 2,7 % en 2025 contre 1,4 % en moyenne sur la décennie précédente ; Brynjolfsson y voit le début d'une « courbe en J » (AI Index) : **une corrélation, une explication possible, pas une preuve**.

**Emploi**

- FMI (janvier 2024) : près de 40 % de l'emploi mondial est « exposé » à l'IA, ≈ 60 % dans les économies avancées, 40 % dans les émergentes et 26 % dans les pays à bas revenu ; environ la moitié des emplois exposés pourraient en bénéficier, l'autre moitié perdre des tâches clés ([FMI](https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity)). **Exposition n'est pas suppression** : c'est ce que dit le FMI lui-même.
- Premiers signaux : baisse de 15 à 16 % de l'emploi des jeunes dans les métiers exposés (étude ADP citée par l'AI Index) ; une autre étude date la dégradation de ces marchés de début 2022, avant ChatGPT. Les canaris sont réels mais la cause reste débattue.

### 2.2 Les promesses ne sont pas des mesures

- « 70-90 % du code écrit par l'IA », « 75 % du nouveau code de Google » : déclarations d'entreprises, sans unité définie (V118, V119, ⚠️).
- « Une IA qui accélère la R&D en IA » : ×1,5 déclaré, « sous ×2 » (V120, ⚠️) ; les gains ressentis (×1,4 à ×4) sont très au-dessus des gains mesurés (+ 4 à + 20 %) (`modeles/acceleration/methode.md`, §5).
- Les prévisions de « bascule » (Metaculus, dirigeants) sont des opinions agrégées (V117 ⚠️) ; elles ne valent pas des données.
- Le modèle `modeles/acceleration/` extrapole la courbe METR ; ses auteurs notent que les données **ne permettent pas de trancher** entre exponentielle et courbe en S.
- « Fin des métiers de cols blancs » (V23), « l'IA fait bien mieux les maths que les chercheurs » (V6) : opinions ou prospectives, requalifiées 📐 (V6459). Une médaille d'olympiade n'est pas de la recherche.

## 3. Steelman sceptique

Le meilleur argument contre le titre « la révolution est déjà là » n'est pas « l'IA ne marche pas ». Il tient en six points.

1. **Les capacités se mesurent sur des tests, la valeur se mesure dans les comptes.** Les benchmarks saturent et sont remplacés par d'autres plus durs ; le test de GPQA ou d'une olympiade n'est pas un métier. Les tâches des évaluations (METR) sont « plus propres » que le travail réel.
2. **Les gains robustes sont locaux.** Ils apparaissent sur des tâches bornées, textuelles, avec retour d'information clair (support client, code simple, rédaction) et profitent surtout aux moins expérimentés. Sur le travail de jugement, l'effet est nul ou négatif (METR) : ce n'est pas le cœur des « cols blancs ».
3. **Tout le monde a un intérêt à annoncer la révolution.** Les laboratoires (dont Anthropic, auteur de ces lignes), les fournisseurs de puces, les investisseurs, les États en compétition. L'écart entre gain ressenti et gain mesuré est systématique, y compris chez les développeurs.
4. **Les technologies à usage général mettent des décennies à apparaître dans la productivité** (électricité, informatique). Acemoglu : ≤ 0,66 % de productivité en dix ans. La « courbe en J » est une hypothèse qui arrange les deux camps.
5. **Les investissements peuvent être une bulle.** 285,9 Md$ de financements privés américains en 2025 prouvent l'ampleur des paris, pas leur rentabilité ; les engagements annoncés (109 Md€ au sommet de Paris, 200 Md€ d'InvestAI) sont des promesses plus que des décaissements.
6. **Les robots ne suivent pas.** Les installations de robots industriels sont plates dans le monde en 2024 ; les robots échouent à 88 % des tâches ménagères ; les humanoïdes livrés se comptent en centaines (UBTech : 921 au premier semestre 2026, selon le modèle). La partie « robotique » de la thèse est la moins soutenue.

**Ce que le steelman ne réfute pas** : l'adoption double en un an en France (9,9 % à 18,2 % des entreprises), les capacités passent des seuils mesurés (GPQA, olympiade), et les premières études sur les jeunes actifs suggèrent des effets réels sur l'embauche. **La formulation que les preuves soutiennent** : « l'IA progresse vite et s'adopte vite ; ses effets mesurés sur la productivité sont encore faibles au niveau de l'économie et forts sur certaines tâches ; ses effets sur l'emploi des jeunes sont un signal à surveiller, pas encore un fait établi. » « La révolution est déjà là » est une prévision qui peut s'avérer juste, pas une constatation.

## 4. Le biais pro-technologie du projet

La charte du projet demande de challenger ce biais. Trois points précis.

- **Le choix des indicateurs.** Les chiffres du chapitre qui parlent d'accélération (horizon METR, prix par token, calcul d'entraînement) sont les meilleurs pour la thèse. Les chiffres qui la ralentissent (adoption à 18 % des entreprises, productivité mesurée, robots plats) sont dans le dossier mais pas dans le titre. Le chapitre devrait les mettre au même niveau.
- **Une veille centrée sur l'actualité** sélectionne les annonces plutôt que les mesures : la plupart des chiffres « spectaculaires » (V115-V127) sont des déclarations de laboratoires, pas des audits.
- **Un conflit d'intérêts structurel** : l'IA coautrice est vendue par une des entreprises concernées ; l'auteur travaille dans une entreprise de logiciel, qui profite de l'adoption de l'IA. Les deux doivent être déclarés en tête du chapitre.

## 5. Reste à faire (⚠️ ouvertes)

V49 corrigé (V6569 : abrogation annoncée en mai 2025, règle formelle non parue), V55 vérifié pour 2025 (V6570 ; série à tracer), V51 (baisse du coût à capacité égale : Epoch, déjà en données locales, à relier), V115-V120, V126, V127, V129 (déclarations de laboratoires, sources primaires non lues), V414, V415, V419 ; **plans nationaux de la file T12 traités le 03/11 (V6550-V6571)** : lus, vérifiés ou corrigés ; restent ⚠️ V404 (Shanghai, Pékin), V405 (répartition 150/50 d'InvestAI), V408 (GPU, MSIT), V409 (METI et Rapidus, résumés), V410 (France : montants non réconciliés), V417 (emplois) ; non lus : Made in China 2025, plan robotique 2021-2025, whitehouse.gov, MSIT, MOTIE ; V416 RTE vérifié (≈ 18 GW de capacité réservée, 20 % d'usage moyen), V362, V365, V350, V351-V352, V359-V361 (recherche publique française : LFI 2026 et rapports d'organismes non relus).
