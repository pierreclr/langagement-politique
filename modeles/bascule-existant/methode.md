---
titre: Basculer l'existant (montages, stocks et droits acquis) — méthode
tache: T16
statut: brouillon sourcé
consultation: 2026-10-25
---

# Basculer l'existant : méthode

Code : [`modele.js`](modele.js) · test : [`test_modele.js`](test_modele.js) (`jsc modele.js test_modele.js`) · résultats : [`resultats.md`](resultats.md) · données : [`donnees/`](donnees/)

Légende : **fait sourcé** (lien) · **estimation** (calcul explicité) · **hypothèse** (de l'auteur ou de Claude) · ⚠️ non confirmé (registre V500-V522).

> **Ce n'est pas un avis juridique.** Les appréciations de risque contentieux sont des lectures de la jurisprudence par une IA, à faire relire par des juristes (constitutionnalistes, fiscalistes, spécialistes de la CEDH). Les montants sont des **ordres de grandeur**, jamais des prédictions.

## 1. Question posée

Le modèle « 50 % de tout ce qui sort » ([plan.md, ch. 9](../../plan.md)) taxe au moment où l'argent sort : distribution, vente, rachat, transmission, départ. Or des milliers de milliards d'euros ont été accumulés sous l'ancien système, souvent **précisément pour profiter de ses règles** : bénéfices gardés dans des holdings, plus-values jamais réalisées puis effacées au décès, assurance-vie, PEA, donations avec réserve d'usufruit, pactes Dutreil, investissements Pinel.

Questions :
1. Quelle règle de transition appliquer à chaque stock, sans **rétroactivité illégale** ni **prime aux montages** ?
2. Que rapportent ou coûtent les différentes règles, et sur quelle durée ?
3. Qu'est-ce qui serait juridiquement solide, fragile, ou impossible, avec la Constitution actuelle puis avec une **nouvelle Constitution votée par le peuple**, la France restant liée par la **CEDH** et le **droit de l'UE** ?
4. Faut-il proposer une option « payer maintenant à taux réduit » plutôt que « plus tard à taux plein » ?

**Principe de l'auteur** (hypothèse de l'auteur) : *c'est la date de l'événement (distribution, vente, décès, départ) qui détermine le régime, pas la date du montage.*

## 2. Cadre juridique (résumé ; détail dans [`donnees/jurisprudence.csv`](donnees/jurisprudence.csv))

### 2.1 Le droit actuel : le principe de l'auteur est déjà la règle… avec deux exceptions

- **Le fait générateur fixe le régime.** En droit fiscal français, l'impôt dû est celui en vigueur au moment du fait générateur (décès, cession, distribution). Changer le barème des successions pour les décès à venir n'est pas rétroactif. Le principe de l'auteur ne crée donc rien de nouveau : il **généralise** une règle existante.
- **Exception 1 — les situations légalement acquises et les effets « légitimement attendus ».** Depuis 2013, le Conseil constitutionnel juge, sur le fondement de l'article 16 de la Déclaration de 1789, que le législateur ne peut, « sans motif d'intérêt général suffisant, ni porter atteinte aux situations légalement acquises ni remettre en cause les effets qui peuvent légitimement être attendus de telles situations » ([2013-682 DC, cons. 14](https://www.conseil-constitutionnel.fr/decision/2013/2013682DC.htm)). Appliqué à l'assurance-vie, cela protège les gains acquis **pendant la durée de détention que la loi exigeait** pour bénéficier d'un régime (cons. 17-19). Et le Conseil précise qu'un motif « exclusivement financier » ne suffit pas (cons. 18) ; il le redit en 2014 (« la volonté du législateur d'augmenter les recettes fiscales ne constitue pas un motif d'intérêt général suffisant », [2014-435 QPC, cons. 10](https://www.conseil-constitutionnel.fr/decision/2014/2014435QPC.htm)).
- **Exception 2 — l'impôt déjà soldé.** Un impôt payé « pour solde de tout compte » (prélèvement libératoire) ne peut pas être rouvert ([2014-435 QPC, cons. 9-10](https://www.conseil-constitutionnel.fr/decision/2014/2014435QPC.htm)). Cela vaut, par analogie, pour les transmissions Dutreil déjà faites et les donations déjà taxées.
- **L'outil anti-abus existe déjà.** Le même Conseil a admis que la loi s'applique aux faits générateurs **postérieurs à la date d'annonce** de la réforme (26 septembre 2013), pour éviter que l'annonce ne provoque des comportements contraires à son objectif ([2013-682 DC, cons. 15](https://www.conseil-constitutionnel.fr/decision/2013/2013682DC.htm)).

### 2.2 Avec une nouvelle Constitution

- **Ce qui change.** Le Conseil constitutionnel ne contrôle pas une révision ou une Constitution adoptée par le peuple (lois adoptées par référendum : hors du contrôle de l'article 61, décisions 62-20 DC du 6/11/1962 et 92-313 DC du 23/09/1992, relues le 03/11/2026, V7041 ; révisions de la Constitution : décision 2003-469 DC non relue ⚠️ ; une Constitution entièrement nouvelle n'a pas de procédure prévue par l'article 89, V7040). Une nouvelle Constitution pourrait donc **écrire la règle de transition elle-même** : « le régime applicable est celui de la date du fait générateur ; la loi peut s'appliquer aux faits générateurs postérieurs à l'annonce publique d'une réforme ». La protection des « effets légitimement attendus » disparaîtrait si la nouvelle Constitution ne reprenait pas l'article 16 de la Déclaration de 1789, ou si elle encadrait explicitement son application aux régimes fiscaux.
- **Ce qui ne change pas : la CEDH.** L'article 1er du Protocole n° 1 (protection des biens) continue de s'appliquer, avec des juges nationaux qui écartent la loi contraire à la Convention et la Cour de Strasbourg au-dessus. La Cour laisse aux États une **large marge en matière fiscale** : elle a admis une loi rétroactive fermant une faille (*National & Provincial Building Society*, 1997 ⚠️ non relu, V512), la fermeture rétroactive d'un montage « très artificiel » (*Huitson c. Royaume-Uni*, 2015), un prélèvement de crise sur les salaires de l'année précédente (*P. Plaisier B.V. c. Pays-Bas*, 2017). Elle sanctionne en revanche la **charge individuelle excessive** : impôt de 98 % sur une indemnité de départ (*R.Sz. c. Hongrie*, 2013). Les droits à pension sont des « biens », qu'on peut réduire sans les vider de leur substance (*Koufaki et ADEDY c. Grèce*, 2013).
- **Ce qui ne change pas : le droit de l'UE.** Il ne régit pas les impôts directs en général, mais les libertés de circulation s'imposent : une taxe de sortie vers un autre État membre ne peut pas être exigée immédiatement (*de Lasteyrie*, CJCE 2004) ; il faut offrir le choix entre paiement immédiat et différé (*National Grid Indus*, CJUE 2011). La directive mères-filiales limite les retenues sur les dividendes sortants (voir T5, V101).

**Conséquence pour la méthode.** On note pour chaque mesure deux niveaux de risque : sous la Constitution actuelle, et sous une nouvelle Constitution (où il ne reste que la CEDH et le droit de l'UE).

## 3. Périmètre et formules

**Stocks pré-réforme** (les « cas » de la tâche T16) :

| Stock | Valeur retenue | Source |
|---|---|---|
| Titres non cotés et participations des ménages (dont holdings patrimoniales, réserves non distribuées) | 1 507 Md€ | [Banque de France, fin 2025](https://www.banque-france.fr/fr/statistiques/epargne/epargne-des-menages-2025-q4) |
| Actions cotées et OPC détenus en direct | 622 Md€ | idem (263 + 358 ⚠️ V500) |
| Immobilier hors résidence principale | 2 655 à 3 540 Md€ | [Insee Première n° 2081](https://www.insee.fr/fr/statistiques/8661938) : 8 850 Md€ de logements et terrains × 30-40 % (H5 ⚠️) |
| Assurance-vie et épargne retraite | 2 177 Md€ | Banque de France, fin 2025 (1 571 en euros + 607 en UC) |
| PEA et PEA-PME | 145 Md€ | [Banque de France, PEA 2025](https://www.banque-france.fr/fr/statistiques/epargne/plan-depargne-en-actions-2025) |
| Démembrements en cours (valeur des usufruits) | 90 à 540 Md€ | estimation (H10-H11 ⚠️) |
| Réductions d'impôt restant dues (Pinel et autres) | 4,8 à 13 Md€ | estimation d'après la [Cour des comptes](https://www.ccomptes.fr/fr/publications/laide-fiscale-linvestissement-locatif-pinel) (H9) |
| Transmissions anticipées entre annonce et réforme | 75 à 300 Md€ | estimation (H12-H13 ⚠️) |
| Pactes Dutreil sous engagement | 60 à 150 Md€ | estimation (non chiffrée dans les recettes, voir § 5.6) |
| Retraites, régimes spéciaux | 422 Md€/an de pensions ; droits ≈ 397 % du PIB | renvoi à T13 |

**Formules** (pour chaque stock *k*, scénario *n*) :

- plus-value latente `G = g · V` ; part réalisée l'année *y* : `ρ (1 − ρ)^(y−1)` (réalisation exponentielle) ;
- facteur actualisé `F = Σ_{y=1..30} ρ (1 − ρ)^(y−1) / (1 + r)^y` ;
- recette actualisée : `VA = (1 − u)(1 − σ) G t_v F + σ V t_t F + VA(purge)` où `σ` est la part qui se réalise par transmission, `t_v` le taux à la vente (sur la plus-value), `t_t` le taux à la transmission (sur la valeur entière), `u` l'adhésion à la purge ;
- purge : base `u (1 − σ) G`, payée au taux `t_p` en trois annuités ; manque à gagner `u (1 − σ) G t_v F` ;
- durée de la transition : années pour que 90 % du stock se soit réalisé, `ln 0,1 / ln (1 − ρ)`.

**Ce que le modèle ne fait pas.** Il ne s'ajoute pas au bilan du simulateur (`simulations/simulateur.html`) : ce dernier suppose déjà que **tous** les flux sont taxés à 50 % dès le premier jour, c'est-à-dire la règle « stricte ». Le modèle mesure donc **ce que coûte chaque protection** par rapport à cette hypothèse, et ce que rapporterait le passage par rapport à l'ancien régime. Les deux lectures ne doivent pas être cumulées.

## 4. Hypothèses numérotées

Détail et valeurs basses / hautes : [`donnees/parametres_transition.csv`](donnees/parametres_transition.csv).

- **H1** — Taux unique de 50 % (hypothèse de l'auteur) ; IS de 25 % déjà payé sur les réserves.
- **H2** — Part de plus-value latente dans chaque stock (hypothèse de Claude ⚠️ V516) : non cotés 35/50/65 %, cotés et PEA 20/30/40 %, assurance-vie 15/25/35 %, immobilier 30/40/50 %. **C'est l'hypothèse la plus fragile** : aucune statistique publique du stock de bénéfices non distribués des holdings n'a été trouvée (V503).
- **H3** — Rythme de réalisation : 3 à 10 % du stock par an selon l'actif (hypothèse de Claude ⚠️ V517).
- **H4** — Part des réalisations qui passent par une transmission : 20 à 50 % (hypothèse de Claude ⚠️ V517).
- **H5** — Part de l'immobilier des ménages hors résidence principale : 30/35/40 % (hypothèse de Claude ⚠️ V502). La résidence principale est exclue (exonérée après 5 ans selon le plan).
- **H6** — Taux effectifs actuels à la vente : 30 % (PFU), 15 % (immobilier, abattements pour durée), 20 % (assurance-vie après 8 ans), 18,6 % (PEA, prélèvements sociaux 2026 ⚠️ V514). Hypothèses de Claude d'après le droit en vigueur (⚠️ V518).
- **H7** — Taux effectif actuel à la transmission : 7 % de la valeur (DMTG 20,9 Md€ pour 300 Md€ de flux), 2 % pour l'assurance-vie (art. 990 I : 0,46 Md€ pour ≈ 44 Md€ de capitaux décès). Millésimes mélangés (⚠️ V518).
- **H8** — Crédit d'IS sur les réserves anciennes : la distribution est taxée à `(0,50 − 0,25)/(1 − 0,25) = 1/3`, ce qui revient à taxer à 50 % le bénéfice avant IS (calcul).
- **H9** — Réductions d'impôt restant dues après 2028 : 4 / 5,1 / 6,5 Md€ pour le Pinel (décroissance linéaire de 1,35 Md€ en 2026 à 0 en 2038), multipliées par 1,2 / 1,5 / 2 pour les autres dispositifs (⚠️ V506).
- **H10** — 15/30/45 % des donations (≈ 150 Md€/an) sont faites avec réserve d'usufruit (hypothèse de Claude ⚠️ V519).
- **H11** — Usufruit valant 40 % (barème de l'art. 669 CGI pour un donateur de 61 à 70 ans, relu le 31/10/2026, V2529), en cours pendant 10/15/20 ans.
- **H12** — 75 Md€/an de grandes transmissions peuvent être avancées (hypothèse de Claude ⚠️ V520).
- **H13** — Entre l'annonce et l'entrée en vigueur, 1/2/4 années de ce flux sont avancées. Une nouvelle Constitution suppose un référendum puis des lois : le délai se compte en années, pas en semaines comme en Estonie (loi du 15/12/1999, en vigueur le 01/01/2000, d'où l'absence d'anticipation selon [Masso, Meriküll et Vahter](https://mjtoimetised.ut.ee/febpdf/febawb81.pdf)).
- **H14** — Avec une règle anti-abus datée de l'annonce, 20 % de l'anticipation échappe quand même (hypothèse de Claude ⚠️ V520).
- **H15** — 10/25/40 % des plus-values destinées à la vente adhèrent à l'option de purge ; en sensibilité, les adhérents réalisent deux fois plus vite (sélection) (hypothèse de Claude ⚠️ V521).
- **H16** — Taux de purge « à l'américaine » : 15,5 % sur les actifs liquides, 8 % sur les illiquides ([26 U.S.C. § 965](https://www.law.cornell.edu/uscode/text/26/965)), en trois annuités comme l'option italienne ([Assolombarda](https://www.assolombarda.it/servizi/fisco/informazioni/guida-alla-rivalutazione-dei-terreni-e-partecipazioni) ⚠️ V508).
- **H17** — Actualisation 3 %, horizon 30 ans (hypothèse de Claude).
- **H18** — Probabilité de censure par niveau : très faible 1 %, faible 5 %, moyen 25 %, élevé 60 %. **Pure convention** pour ordonner les risques (⚠️ V522).
- **H19** — Niveau de risque de chaque mesure : lecture de Claude de la jurisprudence (§ 5 et `MESURES` dans le code ; ⚠️ V522).
- **H20** — Retraites : non chiffrées ici (renvoi à T13).

## 5. Cas par cas

Pour chaque cas : la règle proposée (par Claude, à soumettre au vote), son fondement, le risque, et ce qu'elle rapporte ou coûte. Les chiffres viennent de [`resultats.md`](resultats.md).

### 5.1 Bénéfices non distribués et trésorerie des holdings

- **Situation.** Garder les bénéfices dans une société coûte aujourd'hui l'IS (25 %) ; les sortir coûte en plus le PFU (30 %, 31,4 % sur certains revenus depuis 2026 ⚠️ V514), soit ≈ 47,5 % au total. Au sommet, les bénéfices non distribués font 96 % du revenu économique des 75 foyers les plus riches (IPP). Une holding qui ne distribue jamais repousse l'impôt jusqu'à la vente, au départ ou à la transmission (IPP, note n° 92), et la plus-value latente est **effacée au décès** pour les héritiers. La loi de finances 2026 a créé une taxe sur certaines holdings patrimoniales, réduite en cours de débat à 20 % sur des actifs somptuaires et ≈ 100 M€ de rendement (art. 235 ter C CGI, ⚠️ V504).
- **Règle proposée.** Rien n'est taxé tant que les réserves restent dans la société (c'est le modèle estonien). **À la distribution, après la réforme : 50 % du bénéfice avant IS, avec crédit de l'IS déjà payé**, soit 33 % de la somme distribuée (H8). C'est la règle de l'auteur (date de l'événement), avec un correctif contre la double imposition.
- **Pourquoi le crédit d'IS.** Sans lui, une réserve ancienne supporterait 25 % + 50 % × 75 % = 62,5 %, plus que les 47,5 % actuels et plus que les 50 % promis aux bénéfices nouveaux. Cela pousserait à distribuer massivement **avant** la réforme (sous l'ancien régime à 47,5 %) et exposerait à un grief d'inégalité et de charge excessive. Avec le crédit, il n'y a presque plus d'intérêt à anticiper (33 % de la distribution contre 30 % aujourd'hui).
- **Fondement.** Le fait générateur (la distribution) est postérieur : pas de rétroactivité. Précédent : l'Estonie imputait déjà avant 2000 l'impôt sur dividendes sur l'impôt sur les bénéfices ([Masso et al., note 1](https://mjtoimetised.ut.ee/febpdf/febawb81.pdf)) ; le traitement des réserves d'avant 2000 n'est pas décrit dans la source lue (⚠️ V507).
- **Risque.** Faible, avec ou sans nouvelle Constitution.
- **Option « payer maintenant ».** Une purge facultative des réserves à 8 % (taux américain sur les actifs illiquides) ou 15,5 % (liquidités) libère ensuite les réserves de l'impôt à la distribution. Le taux « neutre » (qui ne fait ni gagner ni perdre l'État en valeur actualisée, central) est ≈ 17 % pour ces titres.
- **Anti-abus dès l'annonce.** Les prêts d'une holding à ses associés, les avantages en nature, les rachats de titres et les paiements non justifiés valent distribution (plan, ch. 9) **dès la date d'annonce**. Une holding qui « consomme » pour son associé distribue.

### 5.2 Plus-values latentes (titres et immobilier hors résidence principale)

- **Situation.** Les plus-values ne sont taxées qu'à la vente. L'immobilier bénéficie d'abattements pour durée de détention (exonération d'impôt sur le revenu après 22 ans, de prélèvements sociaux après 30 ans ⚠️ V518). Au décès, la plus-value latente disparaît : les héritiers repartent de la valeur du jour.
- **Règle proposée.** La plus-value **acquise avant la réforme** est figée à sa date (valeur déclarée ou forfaitaire) et taxée, lors de la vente, **au taux de l'ancien régime avec les abattements déjà acquis** ; la plus-value **postérieure** est taxée à 50 %. C'est la logique des « taux historiques » validée en 2013-682 DC, transposée aux abattements pour durée. Pour les titres sans régime de durée (PFU depuis 2018), la règle stricte (50 %) s'applique.
- **Au décès** : la règle de l'événement s'applique sans réserve. La transmission est taxée sur la valeur entière (pas de double imposition plus-value + transmission).
- **Fondement et risque.** Taxer à 50 % des abattements « déjà gagnés » par des années de détention exposerait fortement à la censure sous la Constitution actuelle (cons. 17-19 de 2013-682 DC) ; risque moyen sous une nouvelle Constitution (CEDH, attentes légitimes).
- **Option « payer maintenant ».** Purge facultative de la plus-value latente (précédent : la *rideterminazione* italienne, 18 % à 21 % de la **valeur** du titre ou du terrain, en trois annuités ⚠️ V508). Elle a un défaut : elle attire surtout ceux qui allaient vendre bientôt.
- **Anti-abus dès l'annonce.** Les apports-cessions et les donations suivies de cession (purge des plus-values par donation) décidés après l'annonce relèvent du nouveau régime.

### 5.3 Assurance-vie

- **Situation.** 2 177 Md€ d'encours fin 2025 (Banque de France, épargne retraite comprise). Après 8 ans : 7,5 % d'impôt (12,8 % au-delà de 150 000 € de primes) plus 17,2 % de prélèvements sociaux, après un abattement annuel (⚠️ V518). Au décès : abattement de 152 500 € par bénéficiaire pour les primes versées avant 70 ans, puis 20 % et 31,25 % (art. 990 I). Le prélèvement 990 I rapporte 0,46 Md€ pour ≈ 44 Md€ de capitaux transmis hors succession.
- **Règle proposée.** **Les produits acquis avant la réforme gardent leur taux** quand ils sont rachetés (c'est exactement ce que le Conseil constitutionnel a exigé en 2013) ; les produits postérieurs sont taxés à 50 %. **Au décès, le capital est taxé comme toute transmission** (règle de l'événement) : le régime 990 I n'est pas maintenu pour les décès postérieurs.
- **Fondement et risque.** Le régime 990 I ne dépend pas d'une durée de détention : l'attente légitime est plus faible (risque faible). Le précédent de 1998 montre que la France a déjà maintenu l'ancien régime pour les primes anciennes (⚠️ V510) : c'est un choix politique, pas une obligation démontrée. **Maintenir 990 I pour tout l'encours existant coûterait ≈ 244 Md€ en valeur actualisée (central)** : c'est le plus gros poste de la transition.
- **Contrats jusqu'à leur terme.** L'option « maintien jusqu'au terme » n'a pas de sens pour l'assurance-vie, contrat sans terme : il faut une date de coupure.

### 5.4 PEA

- **Situation.** 141 Md€ (titres + espèces) sur 7,3 millions de plans, plus 4,4 Md€ en PEA-PME (Banque de France, fin 2025). Après 5 ans, seuls les prélèvements sociaux s'appliquent.
- **Règle proposée.** Comme l'assurance-vie : gains acquis avant la réforme au taux historique (si le plan a ou atteint 5 ans), gains postérieurs à 50 %. Enjeu faible (≈ 7 Md€ de valeur actualisée).

### 5.5 Démembrements et donations avec réserve d'usufruit

- **Situation.** Un parent donne la nue-propriété, taxée sur sa valeur réduite (barème de l'art. 669 ; 60 % de la valeur pour un donateur de 61 à 70 ans, relu le 31/10/2026, V2529). À son décès, l'usufruit s'éteint **sans impôt** (art. 1133 CGI, relu le 03/11/2026 : texte inchangé depuis 1979, V7053 ; la correction de 2024 supposée ailleurs n'a pas été retrouvée ⚠️). Le stock n'est publié nulle part : estimation 90 à 540 Md€ de valeur d'usufruit en cours (H10-H11).
- **Règle de l'auteur (stricte).** L'extinction de l'usufruit après la réforme est un événement : 50 % de la valeur de l'usufruit. Rapport : ≈ 88 Md€ en valeur actualisée (central).
- **Règle proposée.** Démembrements **antérieurs à l'annonce** : maintien de l'ancienne règle (la donation a été taxée en tenant compte de l'extinction gratuite, et l'impôt est « soldé », cf. 2014-435 QPC). Démembrements **postérieurs à l'annonce** : extinction taxée. Risque de la règle stricte : moyen dans les deux cadres constitutionnels (double charge sur une même transmission, attentes légitimes au sens de la CEDH).
- **Variante intermédiaire** (non modélisée) : taxer l'extinction en imputant les droits déjà payés sur la nue-propriété.

### 5.6 Pactes Dutreil en cours d'engagement

- **Situation.** 20 Md€ d'actifs transmis en 2024 avec 75 % d'abattement, coût supérieur à 5,5 Md€, 65 % de l'avantage pour 110 donataires ([Cour des comptes, 2025](https://www.ccomptes.fr/fr/publications/le-pacte-dutreil-un-dispositif-fiscal-en-forte-croissance-mieux-cibler)). L'avantage suppose un engagement collectif (au moins 2 ans) puis individuel (4 ans) de conservation (⚠️ durées à relire dans l'art. 787 B, V524).
- **Règle proposée.** (a) **Transmissions déjà faites** : maintenues ; l'engagement court jusqu'à son terme ; une rupture entraîne la reprise de l'avantage **selon l'ancien régime** (situation acquise). (b) **Pactes signés mais transmission à venir** : la transmission relève du nouveau régime (héritage d'entreprise : 50 % payables en parts au fonds souverain). Un pacte n'est qu'un engagement de conserver : il ne crée pas d'attente légitime sur le taux d'une transmission future. Risque : faible.
- **Le vrai risque est l'anticipation** : avec une réforme annoncée des années à l'avance, chaque famille concernée a intérêt à transmettre **avant** sous Dutreil (5,6 % de taux effectif selon la Cour) plutôt qu'après à 50 %. D'où la règle anti-abus du § 6.

### 5.7 Investissements locatifs défiscalisés en cours (Pinel et autres)

- **Situation.** Le Pinel est fermé depuis fin 2024 ; la réduction est étalée sur 6, 9 ou 12 ans d'engagement de location. Coût : 1,35 Md€ en 2026, 10 à 12 Md€ cumulés jusqu'en 2038 ([Cour des comptes, 2024](https://www.ccomptes.fr/fr/publications/laide-fiscale-linvestissement-locatif-pinel)).
- **Règle proposée.** **Maintien jusqu'au terme**, converti en crédit imputable sur le prélèvement unique (ou remboursable), puisque l'impôt sur le revenu disparaît. Coût : 4,8 à 13 Md€ au total, ≈ 6,6 Md€ en valeur actualisée (central).
- **Fondement.** Un avantage conditionné à un engagement de durée est l'exemple type de l'« effet légitimement attendu » (2013-682 DC). Le supprimer exposerait fortement à la censure, et à un risque moyen devant la CEDH. Le gain (7 Md€) ne vaut pas le risque.

### 5.8 Personnes déjà parties à l'étranger et exit tax en cours

- **Déjà parties avant l'annonce** : pas de rattrapage. Les imposer sur ce qu'elles ont accumulé avant de partir serait rétroactif et, pour celles installées dans l'UE, contraire aux libertés de circulation. Les sursis d'exit tax en cours (art. 167 bis CGI) continuent sous l'ancien régime (dégrèvement après 2 ou 5 ans).
- **Départs après l'annonce** : la plus-value latente et les réserves contrôlées sont figées au départ et taxées au nouveau régime **à leur réalisation** (vente, distribution, transmission). Dans l'UE/EEE, le paiement doit pouvoir être différé (*de Lasteyrie* ; *National Grid Indus*). Efficacité à attendre : faible (138 M€ recouvrés pour 5,75 Md€ mis en recouvrement en 2011-2016). Sur l'imposition selon la nationalité, voir T5 (§ 6) : elle vise le plus petit des postes de fuite.

### 5.9 Régimes spéciaux et droits à retraite acquis

- **Règle proposée.** (a) Pensions liquidées : garanties en euros (le socle de 1 000 € + un complément égal à la différence, comme le fait déjà le simulateur) ; (b) droits acquis par les cotisations passées : convertis en points ou en capital à la date de bascule, sans baisse de valeur ; (c) régimes spéciaux : fermés aux nouveaux entrants (« clause du grand-père »), comme la loi du 14 avril 2023 l'a déjà fait pour plusieurs régimes à partir du 1er septembre 2023 (⚠️ V509).
- **Fondement et risque.** Les droits à pension sont des biens (CEDH) ; on peut les réduire pour un motif d'intérêt général sans en atteindre la substance (*Koufaki et ADEDY*, 2013). Une conversion à valeur égale est solide ; une baisse générale ciblée le serait beaucoup moins.
- **Chiffrage** : renvoi à T13 ([`modeles/retraites/`](../retraites/)). Les droits accumulés valent ≈ 397 % du PIB (Eurostat, 2021) : c'est de loin le plus gros « stock » de l'ancien système, mais la règle (b) ne le fait pas disparaître, elle le rend lisible.

## 6. Mesures anti-abus applicables dès l'annonce

Précédents : la date d'annonce du 26/09/2013 (2013-682 DC, cons. 15) ; les deux dates de mesure du § 965 américain (2 novembre et 31 décembre 2017, la plus élevée des deux), choisies pour neutraliser les montages entre le projet et la loi ([26 U.S.C. § 965(a)](https://www.law.cornell.edu/uscode/text/26/965)).

1. **Transmissions** (donations, pactes Dutreil, démembrements, contrats d'assurance-vie souscrits) faites après la date d'annonce : régularisées au nouveau régime à son entrée en vigueur. C'est la mesure qui pèse le plus : 30 à 120 Md€ de recettes perdues sans elle, 6 à 24 Md€ avec (H12-H14).
2. **Départs** à l'étranger après l'annonce : régime du § 5.8.
3. **Distributions exceptionnelles** et rachats d'actions décidés après l'annonce : sans objet si le crédit d'IS est retenu (§ 5.1) ; sinon, régularisation.
4. **Prêts aux associés, comptes courants débiteurs, avantages en nature** consentis par une société après l'annonce : requalifiés en distribution.
5. **Changements de résidence fiscale de holdings** ou transferts d'actifs vers des entités étrangères après l'annonce : figés et suivis au nouveau régime.
6. **Annonce précise et publique** : un texte daté, publié, qui décrit la règle. Le cas jugé en 2013 portait sur une annonce gouvernementale précise ; rien n'indique qu'une promesse de campagne suffirait (lecture de Claude).

**Risque** : moyen sous la Constitution actuelle (le cons. 15 concernait des prélèvements sociaux et une annonce de quelques mois ; un délai de plusieurs années passerait moins bien) ; faible si la nouvelle Constitution l'autorise explicitement, la CEDH ayant toléré la rétroactivité contre l'évitement (*National & Provincial*, *Huitson*).

## 7. Politiques de transition et scénarios

| Politique | Vente / distribution | Transmission | Purge | Pinel | Démembrements | Anti-abus |
|---|---|---|---|---|---|---|
| **Stricte** (principe de l'auteur pur) | 50 % | 50 % | non | supprimé | extinction taxée | oui |
| **Recommandée** (Claude) | taux historique (AV, PEA, immobilier) ; crédit d'IS (réserves) ; 50 % (titres cotés) | 50 % | oui | maintenu | anciens maintenus | oui |
| Recommandée sans purge | idem | 50 % | non | maintenu | anciens maintenus | oui |
| **Grand-père large** | ancien régime | ancien régime | non | maintenu | maintenus | non |

**Scénarios** (bas / central / haut) : ils font varier ensemble la taille des plus-values latentes (H2), la part hors résidence principale (H5), le rythme de réalisation (H3), les démembrements (H10-H11), les réductions restantes (H9), l'anticipation (H13) et l'adhésion à la purge (H15). « Haut » = enjeux élevés, pas « scénario favorable ».

## 8. Effets de comportement

- **Anticipation** (H12-H14). C'est l'effet dominant d'une réforme annoncée longtemps à l'avance. Il n'existe pas d'élasticité publiée pour la France ; on raisonne en années de flux avancées. L'Estonie l'a évitée par un délai de deux semaines entre le vote et l'application (Masso et al.) ; une nouvelle Constitution ne le permet pas.
- **Effet de blocage (« lock-in »)**. Taxer la plus-value à la vente incite à ne pas vendre ; la littérature l'établit depuis Feldstein, Slemrod et Yitzhaki (1980) (⚠️ non relu, V525). La règle « taux historique » le renforce pour les stocks anciens ; la purge le réduit. Le modèle le traite par le rythme de réalisation (H3), sans élasticité explicite.
- **Sélection dans la purge** (H15). Ceux qui adhèrent sont ceux qui allaient vendre : la purge rapporte vite mais coûte plus qu'elle ne semble (sensibilité « si sélection »).
- **Exil** : traité par T5 (2 à 18 Md€/an de pertes à long terme) ; non recompté ici.

## 9. Limites et ce qui manque

- **Pas de statistique publique du stock de bénéfices non distribués et de trésorerie des holdings patrimoniales** (Insee, Banque de France, CPO : rien trouvé ; V503). Le poste est approché par les titres non cotés des ménages (1 507 Md€), qui mêlent holdings et entreprises opérationnelles. C'est le premier chiffre à obtenir (DGFiP, liasses fiscales ; Banque de France, base FIBEN).
- Plus-values latentes (H2) et rythmes de réalisation (H3) sont des hypothèses : il faudrait les prix d'acquisition, que seule l'administration connaît.
- Le stock de démembrements n'est publié nulle part (statistiques notariales à chercher).
- Les probabilités de censure (H18) sont une convention. Seule une consultation de juristes peut les remplacer.
- Le modèle ignore la fiscalité des sociétés étrangères contrôlées, le Pilier 2, la directive mères-filiales (voir T5) et les conventions fiscales.
- Le texte actuel de l'art. 1133 et l'art. 5 de la directive ATAD n'ont pas été relus sur Légifrance / EUR-Lex (V513, V523). Dutreil relu le 31/10/2026 (V2530) : engagement collectif de 2 ans puis individuel de 6 ans depuis le 21/02/2026 (4 ans avant).
