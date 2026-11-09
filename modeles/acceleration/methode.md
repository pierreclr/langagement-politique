---
titre: Modèle « L'accélération » : méthode
tache: T18
statut: brouillon sourcé
consultation: 2026-10-25
---

# L'accélération : méthode

## 1. Question posée

L'introduction du livre affirme que « la révolution IA + robotique arrive » et qu'elle s'accélère. Ce modèle pose trois questions mesurables :

1. **Quelles courbes accélèrent vraiment ?** Le temps de doublement raccourcit-il, reste-t-il stable (exponentielle simple), ou s'allonge-t-il (signe possible d'une courbe en S) ?
2. **L'IA accélère-t-elle déjà sa propre recherche ?** Et de combien, selon des mesures indépendantes plutôt que selon les laboratoires ?
3. **Quelle fourchette de « bascule »** peut-on présenter honnêtement ? Ce sera une fourchette d'hypothèses, pas une date.

Ce dossier **complète** [`sources/recherche-ia-robotique.md`](../../sources/recherche-ia-robotique.md), sans le refaire. Il ajoute les mathématiques et la recherche, les générations de robots, « l'IA qui accélère l'IA » et les prévisions de bascule.

## 2. Périmètre et données

Toutes les données sont dans `donnees/`. Chaque ligne a une `source_url` et une colonne de nature (fait mesuré, fait vérifié par un tiers, déclaration d'entreprise, presse, projection, non confirmé). Consultation : 25/10/2026.

| Fichier | Contenu | Collecte |
|---|---|---|
| `series_courbes.csv` | Séries reprises des CSV du projet : horizon METR (record), calcul d'entraînement record (Epoch), trajets Waymo, installations de robots industriels (IFR), utilisateurs de ChatGPT, adoption de l'IA par les entreprises (Eurostat UE et France), livraisons d'humanoïdes Unitree | Extraction scriptée depuis `sources/donnees/`, URL d'origine conservées |
| `maths_recherche_chronologie.csv` | 34 jalons de l'IA en mathématiques et en recherche, de 1997 à 2026 (AlphaFold, AlphaGeometry, AlphaProof, IMO, FrontierMath, AlphaEvolve, preuves en Lean, GNoME et ses critiques…) | Pages primaires (DeepMind, arXiv, ARC Prize, AI Index), presse en complément |
| `delai_incapable_a_surhumain.csv` | 13 tâches : date où l'IA « ne sait pas faire », date où elle atteint le niveau expert, délai en années | Idem ; les arrivées ARC-AGI-2 et FrontierMath viennent de `sources/donnees/ia_benchmarks_etat_de_lart.csv` |
| `robotique_generations_produits.csv` | 27 générations d'humanoïdes (Unitree, Boston Dynamics, Tesla, Figure, Agility, 1X) : date d'annonce, première livraison client, prix, capacité clé, statut | Sites des constructeurs, Wikipédia, presse |
| `robotique_prix_humanoides.csv` | Prix et coûts de fabrication (Unitree, Goldman Sachs, Morgan Stanley) | Idem |
| `ia_accelere_ia_declarations.csv` | 21 déclarations des laboratoires sur la part du code et de la recherche faite par l'IA, avec **ce qu'elles mesurent vraiment** et le conflit d'intérêts | Sources primaires (blogs, cartes système, conférences) ; presse quand c'est la seule source |
| `ia_rd_automatisation_evaluations.csv` | 15 évaluations de l'automatisation de la R&D en IA (RE-Bench, PaperBench, MLE-bench, Expenditure Horizon, InnovationEval, MirrorCode, sondages internes) | arXiv, METR, Epoch, cartes système |
| `previsions_bascule.csv` | 17 prévisions datées : enquêtes auprès des chercheurs (ESPAI 2016-2024), superprévisionnistes (XPT), Metaculus, Epoch, dirigeants | AI Impacts, Forecasting Research Institute, Epoch, déclarations |
| `modeles_decollage_critiques.csv` | 9 modèles de « décollage » (Davidson, Eth & Davidson, AI 2027, GATE d'Epoch) et leurs critiques (Narayanan & Kapoor, titotal…) | Publications des auteurs |

**Méthode de collecte.** Trois recherches web parallèles le 25/10/2026, plus la réutilisation des CSV existants. Les recherches web ont été interrompues en cours de route ; les agents ont alors lu directement les pages primaires. Quelques dates restent donc vides : elles sont signalées dans les CSV et dans `verifications.md`.

## 3. Formules (`modele.js`)

- **Ajustement exponentiel** : régression de ln(y) sur le temps t (en années décimales). Le taux continu k donne le facteur annuel e^k et le **temps de doublement** ln 2 / k (en mois). L'intervalle affiché vaut ±1,96 erreur-type sur k. Il est trop étroit, car les points ne sont pas indépendants.
- **Test d'accélération** : on refait le même ajustement sur des **fenêtres glissantes** (2 ou 3 ans). Si le doublement raccourcit, la courbe va plus vite qu'une exponentielle. S'il s'allonge, elle ralentit.
- **Ajustement logistique** : y = K / (1 + e^(−r(t − tm))). Le plafond K est cherché par grille (de 1,001 à 50 fois le maximum observé). On compare son R² à celui de l'exponentielle. Si les deux collent aussi bien, **les données ne permettent pas de trancher**.
- **Générations de robots** : intervalles en mois entre deux annonces successives, délai entre l'annonce et la première livraison client, et pente des intervalles (négative = le cycle raccourcit).
- **Délai « incapable → expert »** : régression du délai sur la date de départ.
- **Date d'atteinte d'un seuil** (`dateAtteinteSeuil`) : on part du dernier point METR et on avance mois par mois. Paramètres : doublement initial, variation annuelle du doublement (0 = exponentielle pure, > 0 = ralentissement, < 0 = accélération), et facteur de fiabilité (passer de 50 % à 80 % de réussite).
- **Agrégation des prévisions** : quartiles pondérés des médianes publiées, avec une voix par famille de sources.

Test de cohérence : `jsc modele.js test_modele.js`, à lancer depuis ce dossier (jsc = JavaScriptCore, fourni avec macOS). Il vérifie les fonctions sur des données synthétiques, puis produit tous les chiffres de `resultats.md`.

## 4. Hypothèses numérotées

- **H1 — L'horizon METR est l'indicateur de la bascule** (hypothèse de Claude). Il mesure la longueur des tâches d'expert qu'un agent réussit seul. C'est l'indicateur le plus proche de « remplacer une partie du travail qualifié ». Ses tâches sont surtout du logiciel, du ML et de la cybersécurité, et elles sont « plus propres » que le travail réel ([METR](https://metr.org/time-horizons/)).
- **H2 — Point de départ** : Claude Mythos Preview, 17,4 h à 50 % de réussite, le 07/04/2026 (METR). METR juge l'instrument peu fiable au-delà de 16 h. Ce point est donc à la limite de la mesure.
- **H3 — Seuils** (hypothèse de Claude) :
  - « une semaine de travail » = 40 h ;
  - « un mois de travail » = 167 h.
  Le mois de travail sert de seuil de bascule : un agent qui mène seul un projet d'un mois change l'organisation du travail qualifié. Ce choix est conventionnel.
- **H4 — Rythme** :
  - central : doublement en 4,2 mois (METR, depuis 2023 : 129 jours, IC 104-158 j) ;
  - bas : 6,2 mois (METR, depuis 2019 : 188 jours).
  Mon ajustement sur les seuls records donne des valeurs proches : 4,1 mois depuis 2023 et 6,0 mois depuis 2019.
- **H5 — Fiabilité** : l'horizon à 80 % de réussite est environ 5 fois plus court que celui à 50 % (Mythos : 17,4 h contre 3,1 h). Une entreprise a besoin de fiabilité. Les scénarios « 80 % » multiplient donc le seuil par 5.
- **H6 — Ralentissement possible** (hypothèse de Claude, steelman) : le doublement s'allonge de 30 % par an (scénario bas), ou de 50 % par an (scénario « courbe en S »). Rien dans les données de 2026 ne montre ce ralentissement pour METR. Mais une logistique ressemble à une exponentielle avant son point d'inflexion, et les autres benchmarks saturent. Le plafond logistique de la série METR n'est pas identifiable : la grille bute sur sa borne de 50 fois le maximum.
- **H7 — Prévisions** : une voix par famille de sources (enquête de chercheurs, superprévisionnistes, experts XPT, Metaculus, revue Epoch, AI Futures, dirigeants) pour éviter qu'une famille bavarde domine. Les dirigeants de laboratoires sont des parties intéressées. Le résultat est donc aussi donné sans eux.
- **H8 — Robotique** : seule la **première livraison à un client externe** compte comme produit. Démonstrations, précommandes et usage interne ne comptent pas.

## 5. Effets de comportement et de rebond

Ce modèle décrit des capacités. Il ne chiffre pas d'effet économique. Mais trois effets de rebond conditionnent la lecture et sont sourcés dans les données :

1. **Jevons sur le calcul.** Le prix à capacité constante baisse de ÷10 à ÷50 par an (Epoch), mais la facture totale monte :
   - capex des hyperscalers de 147 Md$ (2023) à environ 735 Md$ (2026) ;
   - tokens traités par Google ×330 en 2 ans ([recherche-ia-robotique.md §1.5](../../sources/recherche-ia-robotique.md)).
   Moins cher par unité ne veut pas dire moins de ressources.
2. **Écart entre perception et productivité.**
   - Les développeurs se croyaient 20 % plus rapides et étaient 19 % plus lents (METR, 07/2025).
   - En 2026 : gains auto-déclarés de ×1,4 à ×2, contre +4 à +20 % mesurés par METR ([METR, 19/05/2026](https://metr.org/blog/2026-05-19-frontier-risk-report/) ; [sondage, 11/05/2026](https://metr.org/blog/2026-05-11-ai-usage-survey/)).
   - Élasticité implicite : le gain réel vaut environ le cinquième du gain ressenti.
   - Même écart chez Anthropic : environ ×4 de productivité ressentie, mais un progrès global estimé « below 2x » ([carte système Mythos](https://www.anthropic.com/claude-mythos-preview-system-card)).
3. **Effet de saturation des benchmarks.** Quand un test sature, les laboratoires en créent un plus dur. Le délai entre le lancement d'un test et sa saturation se raccourcit donc en partie mécaniquement (voir limite L3).

## 6. Scénarios (seuil « un mois de travail », H3)

| Scénario | Doublement | Ralentissement | Fiabilité exigée | Paramètres |
|---|---|---|---|---|
| Haut | 4,2 mois, qui raccourcit de 15 %/an | non | 50 % | `variationDoublementParAn: -0.15` |
| Central A | 4,2 mois | non | 50 % | tendance METR depuis 2023 |
| Central B | 4,2 mois | non | 80 % (seuil ×5) | — |
| Bas | 6,2 mois | non | 80 % | tendance METR depuis 2019 |
| Bas + ralentissement | 6,2 mois | +30 %/an | 80 % | — |
| Courbe en S | 6,2 mois | +50 %/an | 80 % | — |

## 7. Limites

- **L1. Les modèles de 2026 ne sont pas recoupés un par un.** Leurs noms et dates (GPT-6 Astra, Claude Mythos, Fable 5, Opus 5.5…) sont repris des bases Epoch et METR (voir [recherche-ia-robotique.md §5.10](../../sources/recherche-ia-robotique.md)).
- **L2. Conflit d'intérêts.** Les chiffres d'Anthropic (cartes système, rapport de décembre 2025, Risk Report d'août 2026) viennent de l'entreprise qui développe l'IA coautrice de ce manifeste. La carte système de Claude Opus 5.5 décrit le modèle même qui a compilé ces données. Ils ne servent ici qu'en complément des mesures de METR et d'Epoch. Ces deux organismes sont indépendants des laboratoires, mais ils ont des partenariats avec eux : FrontierMath est financé par OpenAI, et METR fait des évaluations pré-déploiement pour les laboratoires.
- **L3. Biais de censure dans la courbe des délais.** Un test créé en 2025 ne peut pas avoir un délai de 10 ans observé en 2026. La pente « le délai raccourcit » est donc en partie un artefact. La comparaison n'est valable qu'entre tâches anciennes et récentes déjà résolues. Les tâches que l'IA ne sait toujours pas faire ne figurent pas dans la table : c'est un biais du survivant.
- **L4. L'horizon METR n'est pas le travail réel.** Le Remote Labor Index (vrais projets freelance) n'est qu'à 21 %, et OSWorld 2 à 31 %. Un agent qui passe les tests ne produit pas toujours du code fusionnable.
- **L5. Le choix des seuils est conventionnel** (H3, H5) : changer le seuil d'un facteur 2 déplace la date d'environ un doublement, soit 4 à 6 mois.
- **L6. Robotique** : dates d'annonce parfois à l'année près (Unitree H1, Agility Cassie et Digit). Livraisons non vérifiées de façon indépendante (1X NEO, Atlas produit, Unitree H2). Le « cycle » mélange des gammes parallèles.
- **L7. Prévisions** : l'enquête ESPAI 2024 a un taux de réponse de 10 %. Les définitions (HLMI, AGI, « powerful AI ») diffèrent d'une source à l'autre. La valeur actuelle de Metaculus n'a pas pu être lue (erreur 403).

## 8. Ce qui manque

- Les données de Kiela et al. (Dynabench) sur le temps de saturation des benchmarks : site en erreur 404.
- La valeur actuelle de Metaculus (questions 5121 et 3479).
- Des résultats récents de PaperBench.
- Les chiffres par défaut du modèle de Davidson (2023) : page en erreur 403.
- Une source primaire pour « 70-90 % du code chez Anthropic » et pour le chiffre de Boris Cherny.
- Une source primaire pour les 12/12 d'OpenAI à l'ICPC 2025.
- Le communiqué officiel de l'IMO 2026.
- Le nombre de robots livrés par Figure à des clients externes.
