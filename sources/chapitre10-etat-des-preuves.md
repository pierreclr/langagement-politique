---
titre: Chapitre 10 « Orienter sans interdire » : état des preuves de la fiscalité d'orientation
statut: brouillon sourcé
consultation: 2026-11-03
---

# Chapitre 10 : ce que montrent les taxes d'orientation réelles

Ce dossier accompagne `modeles/fiscalite-orientation/` (T8), `modeles/aviation-croisieres/` (T10) et `modeles/transports-gratuits/` (T9), ainsi que le registre `verifications.md` (V6870 à V6893). Il reprend trois résultats établis le 03/11/2026 : la taxe danoise sur les pesticides n'a réduit la charge que de 16 % pour un objectif de 40 % (`modeles/agriculture/`, V6101) ; la révision de la directive sur la taxation de l'énergie est bloquée (`sources/energie-europe.md`, V5664) ; la valeur tutélaire du carbone de Quinet est passée de 250 € à environ 300 € en 2030 en 2025 (V209, V6423).

Transparence : ce texte est écrit par Claude, une IA d'Anthropic. Le risque propre à ce chapitre est connu : la position de l'auteur (calibrer la fiscalité plutôt qu'interdire) est aussi celle vers laquelle un modèle complaisant penche, parce qu'elle est élégante. Ce dossier cherche donc d'abord les cas où elle a mal marché. L'auteur déclare ses propres liens d'intérêts (il travaille dans une entreprise de logiciel) ; Claude déclare le sien (Anthropic). Aucun des deux n'est en jeu dans la fiscalité du carbone.

## 1. Les chiffres vérifiés au 03/11/2026 (droit et rendements)

| Élément | Valeur | Source relue | Verdict |
|---|---|---|---|
| Accise sur les carburants, tarifs normaux depuis 2022 | gazoles 60,75 ; essences et carburéacteurs 77,647 ; GPL 16,208 ; gaz naturel 5,23 €/MWh | CIBS art. L. 312-35 (version du 20/02/2026), copie `codes-droit-org` du 10/10/2026 | ✅ V6871 |
| Accise combustibles (gaz, fioul…) | 10,73 €/MWh du 01/08/2026 au 31/01/2027 (GPL combustible 0,31), indexée sur l'inflation sous-jacente | CIBS art. L. 312-36 | ✅ V6871 |
| Accise sur l'électricité | 24,69 (ménages) et 20,42 €/MWh (entreprises) du 01/08/2026 au 31/01/2027 | CIBS art. L. 312-37 | ✅ V6871 |
| Équivalent en carbone de l'accise des carburants | ≈ 0,61 €/L de gazole et ≈ 0,68 €/L d'essence ; soit ≈ 230-250 et ≈ 300 €/tCO2 d'accise seule, hors TVA | calcul de Claude, facteurs de conversion d'ordre de grandeur non relus ⚠️ | 📐 V6871 : l'ordre « ≈ 200 €/t » de V302 est un minimum |
| Accise sur les produits énergétiques (ex-TICPE) | brute totale 31,6 (2024), 31,4 (2025), 31,5 Md€ (2026) ; nette État 16,0 ; 16,5 ; 15,3 Md€ | Voies et moyens, tome I, PLF 2026, p. 27-28 | ✅ V6872 (Insee 2024 : 30,2 Md€, périmètre de comptabilité nationale) |
| Malus CO2 2026 (WLTP) | 50 € à partir de 108 g/km, 80 000 € au-dessus de 191 g/km (2027 : dès 103 g, plafond 90 000 €) | CIBS art. L. 421-62 | ✅ V6873 |
| Malus au poids 2026 | 10 € par kg de la tranche 1 500-1 699 kg ; jusqu'à 30 € par kg à partir de 2 000 kg | CIBS art. L. 421-75 | ✅ V6873 |
| Taxe de solidarité sur les billets d'avion (TSBA) depuis le 01/03/2025 | 7,40 / 15 / 40 € en classe économique (destination européenne / intermédiaire / lointaine) ; 30 / 80 / 120 € avec services additionnels | CIBS art. L. 422-22 | ✅ V6874 |
| Rendement de la hausse de la TSBA | « +850 M€ par an » pour l'aviation commerciale ; ≈ 1,3 Md€ en année pleine, 20 % à l'AFITF | DGAC, étude de novembre 2025 (ministère de la Transition écologique) | ✅ prévu ; **le montant constaté en 2025 n'est pas dans les sources lues** ⚠️ V6874 |
| TVA sur le transport de voyageurs, vols intérieurs compris ; exonération des vols au départ ou à destination de l'étranger | 10 % ; exonération avec droit à déduction | CGI art. 279 b quater et 262 II 8° | ✅ V6877 |
| Passagers internationaux au départ de la métropole allant en Europe | 98,78 M sur 156,04 M en 2025 (63 %) ; 2024 : ≈ 64 % ; en passagers-kilomètres : 24,5 % | DGAC, Bulletin statistique 2025 (mai 2026), tableaux 1.1.2 | ✅ V6877 (« près des deux tiers » confirmé) |
| ETS aérien | vols intra-EEE et au départ vers la Suisse et le Royaume-Uni ; fin des quotas gratuits en 2026 (-25 % en 2024, -50 % en 2025) | Commission (pages Climat) ; proposition COM(2026) 616 du 17/07/2026, **lue le 03/11/2026** (Cellar, version française, 158 p.) : étendre le SEQE à la part équitable de l'UE de certains vols extra-européens au départ et aux vols d'affaires (extension partielle à partir de janvier 2029), possibilité de réduire l'obligation de restitution lorsque le CORSIA prend en charge les coûts, annulation d'unités CORSIA prolongée jusqu'en 2035 | ✅ le principe et la proposition (texte lu ; non adoptée, procédure 2026/0212 (COD)) V6877 |
| ETS maritime | navires de 5 000 UJB et plus ; 40 % des émissions 2024, 70 % de 2025, 100 % de 2026 (restitution un an plus tard) ; 50 % des trajets entrant ou sortant de l'UE ; méthane et protoxyde d'azote dès 2026 | Commission (pages Climat), rapport COM(2025) 735 du 03/12/2025 | ✅ V6877 |
| Prix du carbone européen | enchères : 64,74 €/t en moyenne en 2024 (83,60 en 2023) ; recettes ETS 2024 : 38,8 Md€ | Commission, rapport sur le marché du carbone, COM(2025) 735 | ✅ pour 2024 V6878 |
| Prix 2025 et 2026 | 73,43 €/t en moyenne en 2025 ; autour de 80 à 92 € début 2026 | Instrat (enchères, 213 ventes) et presse de marché | ⚠️ secondaire V6878 : les rapports d'enchères EEX et de la Commission n'ont pas été relus |

Ce que cela veut dire : **les montants du droit en vigueur sont exacts**. Les tarifs d'accise sont gelés en euros par MWh depuis 2022 pour les carburants (seuls les combustibles et l'électricité sont indexés). Un point de fond se lit dans le tableau : la fiscalité française des carburants est déjà un prix du carbone d'environ 230 à 300 €/t, du même ordre que la valeur tutélaire (≈ 300 € en 2030) pour l'essence, un peu en dessous pour le gazole, alors que le gaz de chauffage est taxé à 10,73 €/MWh, soit environ 53 €/t (facteur d'environ 0,2 tCO2/MWh, non relu ⚠️). L'orientation existante est donc très inégale selon l'énergie, ce que T8 modélise (H14, H19).

## 2. Ce que montrent les taxes d'orientation réelles

Les éléments qui suivent sont classés par ce que les études **établissent**, ce qui est **débattu** et ce qui **manque**. Les trois premiers cas vont dans le sens de la position de l'auteur ou la nuancent, les suivants la contredisent en partie.

### 2.1 Un cas où la taxe a changé les comportements : le carbone suédois

**Fait sourcé.** Julius Andersson (2019, *American Economic Journal: Economic Policy* 11(4)) compare la Suède à un groupe synthétique de pays de l'OCDE : après l'introduction de la taxe carbone et de la TVA sur les carburants, les émissions de CO2 des transports ont baissé de « presque 11 % », « la plus grande part » venant de la taxe carbone seule. L'élasticité de la demande d'essence à la taxe carbone est **trois fois plus grande** que l'élasticité au prix : les consommateurs réagissent plus à une taxe visible, annoncée comme telle, qu'à une hausse de prix équivalente. Une réplication de 2024 trouve −7,7 % par habitant dans les transports suédois (source secondaire, résumé d'EconPapers, non relue).

**Ce que cela établit.** Une taxe carbone durable et lisible peut faire baisser les émissions d'un secteur de plusieurs points, avec une méthode quasi expérimentale (contrôle synthétique).

**Ce que cela n'établit pas.** Le chiffre vaut pour les transports routiers suédois, sur une trentaine d'années. Il ne dit pas combien coûte la baisse par tonne, ni si elle se transpose à un pays où le diesel est subventionné par l'histoire fiscale. On peut supposer que la hausse continue de la taxe a laissé le temps de renouveler les véhicules (hypothèse de Claude, non lue).

**Lien avec le modèle.** Le résultat d'Andersson suggère que les élasticités au prix des méta-analyses (ci-dessous) **sous-estiment** l'effet d'une taxe nommée carbone. T8 utilise des élasticités au prix (Douenne −0,45 pour les carburants) : il est prudent sur ce point, et le dit (méthode, limites).

**Élasticités vérifiées (V6870).** La méta-analyse de Labandeira, Labeaga et López-Otero (2017, *Energy Policy* 102, 428 études de 1990 à 2016) donne, au court et au long terme : essence −0,293 et −0,773 ; diesel −0,153 et −0,443 ; électricité −0,126 et −0,365 ; gaz −0,180 et −0,684 ; fioul −0,017 et −0,185 (tableau 6). Brons, Pels, Nijkamp et Rietveld (2002, *Journal of Air Transport Management* 8) trouvent, sur 204 observations, une moyenne de **−1,146** pour le transport aérien (écart-type 0,619 ; de −3,20 à +0,21), plus élastique pour les voyageurs de loisir que pour les voyageurs d'affaires. Attention : T10 utilise InterVISTAS (2007) à −0,8 au niveau national ; la valeur de Brons est plus élevée et couvre des élasticités de route (une compagnie contre une autre). Les deux sont compatibles, car la demande sur une route est plus élastique que la demande nationale ; mais la valeur de Brons ne doit pas être lue comme celle d'une taxe nationale.

### 2.2 Le bonus-malus français : le comportement change, le bilan carbone n'est pas garanti

**Fait sourcé.** D'Haultfoeuille, Givord et Boutin (Insee, document de travail G2011-14 ; *Economic Journal* 124, 2014) étudient le bonus-malus de 2008 (jusqu'à 1 000 € de bonus, 2 600 € de malus). Résultats de la version de travail : la politique **a changé les choix** (émissions moyennes des véhicules neufs −3,9 % par rapport au scénario sans réforme) ; mais elle a **augmenté les ventes de 13,2 %** (13,4 % observés entre l'automne 2007 et le printemps 2008), donc les émissions de fabrication et de circulation : à long terme, **+13,7 % d'émissions totales du parc** dans leur scénario. Leur conclusion : de tels dispositifs peuvent réduire le CO2 puisque les consommateurs réagissent, mais « doivent être conçus avec soin ».

**Ce que cela établit.** Une incitation à l'achat est un levier réel sur la composition du parc ; un bonus qui rend l'achat moins cher en moyenne crée un effet d'**expansion** qui peut annuler le gain (effet rebond sur le volume, pas sur l'usage).

**Ce que cela n'établit pas.** Le malus actuel (§ 1) est très différent de celui de 2008 : 50 € dès 108 g/km, jusqu'à 80 000 € ; plus de bonus dans cette formule, un malus au poids, des abattements pour familles nombreuses. Aucune évaluation causale de ce nouveau régime n'a été lue ; la version publiée de 2014 n'a pas été lue (⚠️ V6880).

**Lien avec le modèle.** C'est exactement le point que T8 traite pour les voitures lourdes (H10 : élasticité −1,0 supposée) : une taxe sans bonus réduit les ventes au lieu de les augmenter. L'enseignement de 2008 plaide pour **taxer sans subventionner** et pour des taxes récurrentes.

### 2.3 La taxe sur les billets d'avion 2025 : un effet sur le prix, un effet sur le trafic difficile à isoler

**Fait sourcé (source intéressée).** L'étude de la DGAC de novembre 2025 observe que la hausse du tarif de solidarité s'est répercutée « en grande partie, voire en totalité » sur les prix (jusqu'à 2,2 points d'inflation du prix des billets en juin 2025, 4,5 points sur l'intérieur métropole) ; l'offre de sièges au départ de la France progresse de 1,4 à 1,5 % contre 4,5 à 4,7 % dans le reste de l'Europe au deuxième trimestre 2025 ; le pavillon français de l'aviation d'affaires commerciale recule de 21,8 % au troisième trimestre.

**Réserve.** La DGAC dit elle-même que « l'effet propre » de la taxe est difficile à dégager (conjoncture, kérosène). L'étude est écrite par l'administration de l'aviation civile, avec un titre qui conclut (« baisse de compétitivité du transport aérien français ») : à lire comme un indice, pas comme une évaluation causale. Le rendement réel 2025 n'est pas publié dans les sources lues ; un think tank (IFRAP) donne 1 151 M€ pour le tarif de solidarité, non recoupé (⚠️ V6874).

**Lien avec le modèle.** T10 suppose une élasticité nationale de −0,8 ; la hausse de la TSBA est trop récente pour la tester.

### 2.4 Un cas où l'effet a été plus faible que prévu : les pesticides au Danemark

**Fait sourcé** (V6101, 03/11/2026). Le Danemark a au moins doublé les taux de sa taxe sur les pesticides en 2013 (+125 % en moyenne) avec l'objectif de réduire de 40 % l'indicateur de charge. L'évaluation officielle de 2018 annonce −40 % en avant/après sur les ventes ; sur les **données d'exploitation** (Nielsen et coll. 2023, *Land Use Policy*), la charge utilisée ne baisse que de **16 %** entre 2012 et 2017 (2,37 à 1,98 par hectare) tandis que la **fréquence de traitement monte** (2,30 à 2,67). La taxe a déplacé les agriculteurs vers des produits moins nocifs plus qu'elle n'a réduit l'usage. Les recettes ont été restituées au secteur agricole par une baisse des taxes foncières.

**Ce que cela établit.** Un prix sur un intrant sans substitut proche fait peu baisser la quantité ; le résultat dépend de la mesure retenue (ventes, charge, fréquence de traitement).

**Lien avec le modèle.** `modeles/agriculture/` calcule qu'une baisse de 40 % des ventes exigerait ×56 le taux actuel. **Tension avec la position de l'auteur, à nommer** : quand l'élasticité est faible, « calibrer plutôt qu'interdire » conduit à des taux très élevés ou à des résultats lents ; l'auteur refuse l'interdiction ciblée. Le texte doit soit défendre des taux très élevés avec compensation, soit admettre qu'il existe des cas où la règle est plus efficace que le prix.

### 2.5 La question sociale

**Gilets jaunes (2018).** Faits sourcés (Douenne et Fabre, *AEJ: Economic Policy* 14(1), 2022 ; version de travail PSE 2020 relue) : la composante carbone des taxes françaises est passée de 7 €/tCO2 en 2014 à 44,6 € en 2018, avec une trajectoire prévue de 86,2 € en 2022 ; fin 2018, après la mobilisation des « gilets jaunes », le gouvernement l'a **gelée** à ce niveau. Les recettes servaient surtout à financer le budget, pas à redistribuer. Dans une enquête auprès de 3 002 ménages, une taxe carbone avec dividende égal pour tous est **approuvée par 10 % et rejetée par 70 %** ; les répondants surestiment leur perte de pouvoir d'achat (60 % se croient perdants alors que 70 % des ménages seraient gagnants, selon l'estimation des auteurs), croient à tort la mesure régressive et doutent de son efficacité écologique. Informer ne suffit pas : parmi les gagnants qui se croient perdants, seuls 12 % changent d'avis quand on leur donne l'estimation ; les mises à jour sont biaisées vers le pessimisme. Si toutes les croyances étaient corrigées, l'approbation atteindrait 90 % selon les auteurs, ce qui ne dit pas qu'on puisse les corriger.

**Régressivité (débattu).** Douenne (2020, thèse PSE, lue plus tôt dans ce dépôt) trouve un effet vertical modéré et des effets **horizontaux** (rural ou urbain, fioul ou non) plus grands que les écarts entre déciles : la moyenne cache des perdants. T8 le reprend : charge de 0,8 à 1,1 % du revenu par décile, progressive après un versement égal ; les effets horizontaux ne sont pas modélisés (méthode, limites). Le modèle est donc **optimiste sur l'acceptabilité** : une taxe progressive en moyenne n'est pas acceptée si certains perdent beaucoup.

**Redistribuer les recettes : le chèque climat canadien et sa suppression (2025).** Faits sourcés. Le Canada a redistribué les recettes de la redevance fédérale sur les combustibles aux ménages (« Canada Carbon Rebate »). Le nouveau gouvernement l'a supprimée : la redevance cesse de s'appliquer le **1er avril 2025** et le dernier versement a lieu à partir du 22 avril 2025 (ministère des Finances du Canada) ; la tarification des grands émetteurs est maintenue. Le Directeur parlementaire du budget (PBO, 10/10/2024) estime, pour 2030-31, que, sur le seul plan budgétaire, le ménage moyen de la plupart des quintiles et de chaque province concernée **gagne** (le chèque dépasse ce qu'il paie) ; mais, en ajoutant les effets économiques (revenus plus bas), le ménage moyen des trois quintiles supérieurs est perdant.

**Ce que cela établit.** Un dividende égal peut rendre une taxe carbone gagnante pour la majorité des ménages, et cela n'a pas suffi à la sauver politiquement : la suppression a été décidée avant toute évaluation complète. Le PBO prend en compte des effets économiques que les adversaires et les partisans contestent (les modèles macroéconomiques y sont débattus ; ce dossier ne tranche pas).

**Ce que cela n'établit pas.** Le chiffre « 80 % des ménages gagnants » circule dans la presse ; ce dossier ne l'a pas retrouvé dans le document du PBO (⚠️ V6882).

**Lien avec la position de l'auteur.** Son modèle d'orientation (T8) suppose des recettes reversées à parts égales (≈ 20 € par adulte et par mois). Les deux cas (France 2018, Canada 2025) montrent que **la compensation est nécessaire, pas suffisante**. La perception compte autant que le calcul, et l'État doit rendre ses comptes visibles : c'est un argument en faveur du principe de transparence du projet.

### 2.6 Le lien avec la contradiction relevée : un prix du carbone commun suppose l'harmonisation fiscale européenne

**La contradiction (nommée dans `sources/energie-europe.md`).** L'auteur veut une fiscalité d'orientation (pollueur-payeur) et une Europe fédérale ; or la taxation de l'énergie relève de l'article 113 TFUE, à l'**unanimité**, avec le Parlement seulement consulté ; la refonte de la directive 2003/96 (COM(2021) 563) est bloquée : lors de l'ECOFIN du 13/11/2025, plusieurs États ont demandé un travail supplémentaire, notamment sur la compétitivité, l'indexation, les carburants de l'aviation et de la navigation et le gaz (V5664). Le kérosène reste exonéré par la directive (art. 14) et la convention de Chicago (art. 24, non relu ⚠️) est invoquée contre sa taxation.

**Ce que le droit permet déjà.** Le **système d'échange de quotas (ETS)** n'est pas une taxe : il repose sur la politique de l'environnement (article 175 §1 du traité CE dans la directive 2003/87, devenu article 192 §1 TFUE, à la majorité qualifiée, visa lu dans le Journal officiel). Il fixe donc un **prix commun** pour l'industrie, l'électricité, l'aérien intra-EEE et, depuis 2024, le maritime (38,8 Md€ de recettes en 2024). La France contourne ainsi le veto fiscal.

**Ce que cela change pour la position de l'auteur.**
- Un prix du carbone **commun** existe déjà pour une part importante des émissions de l'Union (de l'ordre de 40 %, chiffre courant non relu ⚠️), par le marché, pas par la fiscalité ; il varie entre 65 et 90 € selon les années : il ne donne pas la prévisibilité qu'une taxe donnerait.
- Pour le carburant routier et le chauffage, une extension par le marché (ETS2) est prévue ; sa date a été repoussée d'un an, à 2028, dans le paquet sur l'objectif climatique 2040, avec un mécanisme de stabilisation des prix autour de 45 € (prix de 2020), décrit par les sources comme un amortisseur et non un plafond ferme (sources secondaires, ⚠️ V6893). Cela montre qu'un prix commun sur les ménages est possible juridiquement, mais politiquement fragile.
- Une taxe nationale (comme T8) fonctionne **sans** harmonisation, au prix de fuites (carburant frontalier, achats d'avions ailleurs : H12) et de dumping fiscal. La contradiction n'est donc pas totale : elle porte sur la **taxe commune** (kérosène, minimum européen sur le carburant), pas sur la fiscalité d'orientation nationale.
- Résolution possible, à discuter avec l'auteur : (a) prix commun par le marché (ETS, ETS2) et taxes nationales calibrées en complément ; (b) chercher la majorité qualifiée par la base juridique environnementale (article 192) pour les mesures qui ne sont pas fiscales au sens strict, sachant que l'article 192 §2 exclut les dispositions « essentiellement de nature fiscale » (point de droit non relu ⚠️) ; (c) accepter l'unanimité et construire des coopérations renforcées. Aucune n'est acquise.

### 2.7 Steelman : la meilleure objection, et la réponse

**Objection (version la plus forte).** « Calibrer la fiscalité » suppose trois choses que les cas réels ne garantissent pas. Premièrement, que la demande réagisse : les pesticides danois (−16 % au lieu de −40 %) et les élasticités de court terme de l'énergie (−0,15 à −0,3) montrent qu'un prix ne suffit pas quand il n'y a pas de substitut proche. Deuxièmement, que le calibrage soit acceptable : un prix du carbone visible, même compensé, est rejeté si les gens ne croient pas qu'ils gagneront (France 2018, Canada 2025) ; or une interdiction ou une norme ne se voit pas à la caisse, et a pu être plus durable (exemples : normes d'émissions de CO2 des constructeurs, interdiction du fioul neuf ; non relus ici, ⚠️). Troisièmement, que l'État résiste à la tentation de rendement : le bonus-malus de 2008 a augmenté les émissions parce qu'il a stimulé les ventes ; une taxe d'orientation devient vite une recette dont l'État dépend (15,3 Md€ nets d'ex-TICPE au budget 2026), donc elle perd son intérêt dès qu'elle réussit. Et la fuite est inévitable sans prix commun, que l'Europe a bloqué.

**Réponse (en partie).**
- Sur la réaction : le cas suédois (−11 %) montre qu'une taxe carbone durable et nommée agit plus que l'élasticité au prix ne le prédit ; le cas danois montre qu'il faut des taux bien supérieurs ou un substitut, pas que le prix est inopérant. L'objection est forte pour l'agriculture, faible pour les transports.
- Sur l'acceptabilité : l'argument d'une meilleure durabilité des normes est vrai à court terme, mais les normes ont leurs propres coûts cachés (elles ne font pas payer de façon proportionnée à la pollution) et laissent les ménages sans compensation. La réponse de l'auteur (le refus d'un monde fondé sur l'interdiction) est un choix de valeur, pas un résultat empirique ; elle doit être assumée comme telle, avec la compensation visible en tête de proposition.
- Sur l'État-rentier : l'objection est **juste** et sans réponse complète. T8 la traite par l'assiette qui fond (méthode, limites) ; la protection est institutionnelle (affecter les recettes, les reverser, afficher les comptes), non technique.
- Sur la fuite : voir 2.6.

**Ce que le texte doit assumer.** La phrase « on calibre plutôt qu'on interdit » reste défendable comme position de valeur et comme règle par défaut ; elle n'est pas démontrée comme règle d'efficacité. À formuler ainsi : « par défaut un prix, avec compensation visible ; une interdiction ciblée quand la preuve montre que le prix ne change rien et que le dommage est grave », ce qui est une modification de la position de l'auteur, à lui soumettre.

### 2.8 Ce que cela change dans les modèles

- **T8 (V313, corrigé).** L'élasticité de la viande du central (−0,7, Andreyeva et coll., États-Unis) est inférieure à celle que donne la seule étude française lue : Caillavet, Fadhuile et Nichèle (AAEA 2014, scanner Kantar 1998-2010) trouvent des élasticités propres compensées d'environ **−1,2** pour le bœuf. Le central n'est pas modifié (document de travail, élasticité compensée) ; une sensibilité est calculée : recettes nettes 14,3 Md€ au lieu de 14,9, émissions nettes −14,8 Mt au lieu de −12,4, volume de viande −23,5 % au lieu de −14,5 %. Test ajouté dans `test_modele.js`.
- **T9 (V6884, V6885).** Les chiffres de la Cour des comptes (2025) sont relus : le comité Rapoport est une **simulation** (+6 % de voyageurs-kilomètres, −2 % de trafic automobile) ; les « trois quarts des reports depuis la marche » valent pour les déplacements (la voiture compte pour 21 %), mais, en distance parcourue, la marche pèse 41 % et la voiture 52 % de l'accroissement. Pour Dunkerque, **+88 % est le cumul 2017-2019** (1,38 × 1,36 ≈ 1,88), non la première année : le libellé du tableau 9 de la Cour est trompeur. Seule étude solide sur données observées : Tallinn (+8 points de part modale des transports collectifs la première année, −3 points pour la voiture et −5 pour la marche), **inversé dès l'année suivante**.
- **T10.** Tarifs de la TSBA confirmés ; l'élasticité de Brons (−1,146) est ajoutée à l'étude de sensibilité (voir V6889) mais ne modifie pas le central.

### 2.9 Ce qui manque

- Les élasticités de la TSBA, ses recettes de 2025 constatées (rapport d'exécution 2025 de la DGFiP, évaluation de la DGAC).
- L'évaluation du malus actuel (SDES, Cour des comptes, France Stratégie).
- Le rapport PBO complet (tableaux par quintile) et la littérature sur les effets d'un chèque égal sur l'acceptabilité (Klenert et coll. 2018, *Nature Climate Change*, non lu).
- Le rapport d'enchères EEX/Commission pour les prix 2025-2026.
- L'article de Caillavet et coll. (2016, *European Review of Agricultural Economics*, payant) et des élasticités de la viande publiées en France.
- Les points de droit : convention de Chicago art. 24 et 15, taxe à l'arrivée (V222), TFUE art. 30, 110, 207, GATT art. I, III et XX (V310).

## 3. Synthèse des sources mobilisées

| Source | Ce qu'elle établit | Lien |
|---|---|---|
| Code des impositions sur les biens et services (Légifrance, copie codes.droit.org du 10/10/2026) | Tarifs d'accise 2026, malus 2026, TSBA | [CIBS](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000044595989) |
| Code général des impôts, art. 262 et 279 | TVA sur les vols | [CGI](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069577) |
| Voies et moyens, tome I, PLF 2026 | Rendement de l'ex-TICPE | [PDF](https://www.assemblee-nationale.fr/dyn/contenu/visualisation/1087930/file/PLF%202026%20-%20V%26M%20TI%20-%20Evaluations%20des%20recettes.pdf) |
| DGAC, étude TSBA, novembre 2025 | Rendement prévu, prix, offre | [PDF](https://www.ecologie.gouv.fr/sites/default/files/documents/etude_impact_TSBA_transport_aerien_france_novembre2025.pdf) |
| DGAC, Bulletin statistique 2025 | Trafic par continent | [PDF](https://www.ecologie.gouv.fr/sites/default/files/documents/Bulletin_Statistiques_transport_aerien_2025.pdf) |
| Andersson (2019), AEJ: Economic Policy | Carbone suédois −11 % | [AEA](https://www.aeaweb.org/articles?id=10.1257/pol.20170144) |
| Labandeira, Labeaga, López-Otero (2017) | Élasticités de l'énergie | [Energy Policy](https://doi.org/10.1016/j.enpol.2017.01.002) |
| Brons et coll. (2002) | Élasticité du transport aérien | [Tinbergen TI 2001-047](https://papers.tinbergen.nl/01047.pdf) |
| D'Haultfoeuille, Givord, Boutin (2011, 2014) | Bonus-malus 2008 | [Insee G2011-14](https://www.insee.fr/en/statistiques/fichier/1380983/G2011-14.pdf) |
| Douenne et Fabre (2020, 2022) | Gilets jaunes, croyances | [HAL](https://halshs.archives-ouvertes.fr/halshs-02482639v1/file/wp2020_05_.pdf) |
| Ministère des Finances du Canada (03/2025) | Suppression de la redevance | [Canada.ca](https://www.canada.ca/en/department-finance/news/2025/03/removing-the-consumer-carbon-price-effective-april-1-2025.html) |
| Directeur parlementaire du budget (10/2024) | Analyse distributive | [PBO](https://www.pbo-dpb.ca/en/news-releases--communiques-de-presse/pbo-releases-updated-distributional-analysis-of-the-federal-fuel-charge-le-dpb-publie-une-mise-a-jour-de-lanalyse-distributive-de-la-redevance-federale-sur-les-combustibles) |
| Commission, rapport COM(2025) 735 | Prix et recettes de l'ETS | [PDF](https://climate.ec.europa.eu/document/download/ddc1b1de-652b-49ed-8f15-d9fa8badd39f_en?filename=com_2025_735_en.pdf) |
| Directive 2003/87/CE | Base juridique de l'ETS | [Cellar](http://publications.europa.eu/resource/celex/32003L0087) |
| Instrat, bilan ETS 2025 | Prix moyen 2025 (secondaire) | [Instrat](https://energy.instrat.pl/en/eu-ets-2025-summary/) |
| Cour des comptes (09/2025) | Gratuité, Dunkerque, Rapoport, Tallinn | [PDF](https://www.ccomptes.fr/sites/default/files/2025-09/20250915-Contribution-usagers-transports-collectifs.pdf) |
| Caillavet, Fadhuile, Nichèle (2014) | Élasticité française de la viande | [AAEA](https://ageconsearch.umn.edu/record/169974/files/TaxingAnimalProducts_2014_AAEA_AnnualConference.pdf) |
| Nielsen et coll. (2023), Land Use Policy | Pesticides au Danemark | voir V6101 |
| Gouvernement du Luxembourg (02/2025) | Gratuité : fréquentation | [gouvernement.lu](https://gouvernement.lu/fr/actualites/toutes_actualites/communiques/2025/02-fevrier/28-bilan-transport-gratuit.html) |
