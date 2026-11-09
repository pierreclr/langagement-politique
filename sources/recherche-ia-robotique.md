---
titre: Recherche — progression de l'IA et de la robotique (données, projections, limites)
statut: sourcé (dossier de recherche, pas un chapitre)
consultation: 2026-10-25
---

# Progression de l'IA et de la robotique : données, projections, limites

> **Usage.** Ce dossier alimente le chapitre sur la révolution IA et robotique.
>
> Chaque élément est classé selon sa nature : **[M]** fait mesuré, **[E]** estimation d'un tiers, **[P]** projection, **[A]** annonce commerciale non auditée.
>
> Il est aussi classé selon son effet sur la thèse « l'IA et les robots arrivent de façon exponentielle et imminente » : **APPUIE**, **NUANCE** ou **CONTREDIT**.
>
> Les séries prêtes à tracer sont dans [`sources/donnees/`](donnees/README.md). ⚠️ = non confirmé : à reporter dans `verifications.md`.

## 0. Verdict en une page

La thèse est **juste pour les capacités de l'IA logicielle**. Elle est **prématurée pour ses effets économiques**. Elle est **fausse, à ce jour, pour la robotique physique** en tant qu'« exponentielle imminente ».

| Domaine | Ce que disent les données | Sens |
|---|---|---|
| Capacités de l'IA (calcul, METR, benchmarks) | Croissance exponentielle mesurée sur 5 à 15 ans, sans rupture visible en 2026 | **APPUIE fortement** |
| Coût d'usage de l'IA | Prix à capacité constante ÷10 à ÷50 par an ; la facture totale augmente | APPUIE |
| Investissements | Capex des 4 hyperscalers : 147 Md$ (2023), 376 Md$ (2025), environ 735 Md$ (2026, guidance) | APPUIE (et signale un risque de bulle) |
| Adoption | Entreprises UE : 8 % (2023) → 20 % (2025) ; 900 M d'utilisateurs hebdomadaires de ChatGPT | APPUIE |
| Emploi et productivité macro | Effets mesurés nuls ou faibles (Danemark, Yale, enquête Bloom) ; premier signal chez les jeunes débutants (Stanford) | **NUANCE / CONTREDIT à court terme** |
| Robots industriels | +7 à 11 %/an, plateau de 2021 à 2024, la Chine fait 59 % des installations, la France recule | NUANCE |
| Humanoïdes | Environ 7 000 à 20 000 unités/an, surtout pour la recherche et l'éducation ; écarts massifs entre annonces et réalité | **CONTREDIT l'imminence** (APPUIE sur la baisse des coûts) |
| Robotaxis | Waymo : ×10 en 2 ans ; Tesla avec environ 6 ans de retard sur ses promesses ; rien de commercial sans conducteur en France | APPUIE (US/Chine) / CONTREDIT (Europe) |

**Point de vigilance (biais pro-technologie du projet, charte §7).** Les courbes de capacité sont très convaincantes. Mais elles mesurent ce que l'IA *sait faire sur des tâches bien posées*, pas ce qu'elle *fait dans l'économie*.

Le chapitre doit tenir les deux. Écrire « ça arrive » est défendable. Écrire « c'est déjà là dans les chiffres de l'emploi » ne l'est pas en octobre 2026.

---

## 1. IA : capacités

### 1.1 Calcul d'entraînement des modèles de pointe [E]

Source : [Epoch AI, Notable AI Models](https://epoch.ai/data/notable-ai-models) (données CC-BY) et [Epoch, Trends](https://epoch.ai/trends), page mise à jour le 05/02/2026. CSV : `ia_calcul_entrainement_frontiere.csv`.

| Date | Modèle (record) | Calcul (FLOP) | Confiance Epoch |
|---|---|---|---|
| 2012-09 | AlexNet | 4,7e17 | — |
| 2016-01 | AlphaGo Lee | 1,9e21 | spéculatif |
| 2020-05 | GPT-3 175B | 3,1e23 | confiant |
| 2023-03 | GPT-4 | 2,1e25 | probable (IC 90 % : 8e24-4e25) |
| 2023-12 | Gemini 1.0 Ultra | 5e25 | spéculatif |
| 2025-02 | Grok 3 / GPT-4.5 | 3,5e26 / 3,8e26 | probable |
| 2025-07 | Grok 4 | 5e26 | spéculatif |
| 2026-09 | GPT-6 Astra | 9,4e26 | probable (≥ 100 000 GB200) |

- **Tendance d'Epoch** : pour les modèles de langage de pointe, **×5 par an depuis 2020** (IC 90 % : ×4 à ×6), soit un doublement tous les 5,2 mois. Le calcul des 5 plus gros modèles a été multiplié par environ 10 000 depuis 2020. **APPUIE.**
- **Mon calcul sur le record glissant** : de GPT-3 (mai 2020) à GPT-6 Astra (sept. 2026), on passe de 3,1e23 à 9,4e26 FLOP, soit ×3 000 en 6,3 ans ou **×3,6 par an**.
- **Ralentissement apparent** : entre février 2025 et septembre 2026, le record n'est multiplié que par 2,7 en 19 mois. **NUANCE.**
  - Ce ralentissement est en partie un artefact. Le calcul de Gemini 3, de Claude et de GPT-5.x n'est pas publié.
  - Le progrès 2025-2026 est aussi passé par l'apprentissage par renforcement et par le calcul *au moment de l'inférence*, qui ne sont pas comptés ici. Epoch estime GPT-5 à environ 6,6e25 FLOP (« spéculatif »), donc **moins que GPT-4.5**.
  - Conclusion pour le chapitre : **la courbe du calcul d'entraînement n'est plus, à elle seule, un bon indicateur du progrès.**

### 1.2 Horizon temporel des agents (METR) [M]

Source : [METR, Time Horizon 1.1](https://metr.org/time-horizons/), page mise à jour le 08/09/2026 et désormais « plus activement mise à jour » ; données brutes : [benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml). CSV : `ia_metr_horizon_temporel.csv`.

**Définition.** C'est la durée qu'il faut à un expert humain pour accomplir une tâche que l'agent IA réussit avec 50 % de probabilité. Les tâches portent surtout sur le génie logiciel, le ML et la cybersécurité.

| Date de sortie | Modèle | Horizon 50 % | IC 95 % | Horizon 80 % |
|---|---|---|---|---|
| 2019-02 | GPT-2 | 3 s | — | — |
| 2022-03 | GPT-3.5 | 36 s | 15 s-1 min | 15 s |
| 2023-03 | GPT-4 | 4 min | 2-8 min | 53 s |
| 2024-06 | Claude 3.5 Sonnet | 11 min | 5-22 min | 1,7 min |
| 2024-12 | o1 | 39 min | 21-65 min | 7 min |
| 2025-04 | o3 | 2 h | 1,2-3,2 h | 30 min |
| 2025-08 | GPT-5 | 3,4 h | 1,9-6,8 h | 38 min |
| 2025-11 | Claude Opus 4.5 | 4,9 h | 2,7-10,4 h | 49 min |
| 2026-02 | Claude Opus 4.6 | 12 h | 5,3-61 h | 70 min |
| 2026-04 | Claude Mythos Preview (version préliminaire) | **17,4 h** | 8,5-55 h | 3,1 h |

- **Doublement estimé par METR** : **129 jours depuis 2023** (IC 104-158 j, soit environ 4,2 mois). Sur toute la période depuis 2019, il est de 188 jours (environ 6,2 mois).
- La valeur de « 7 mois » souvent citée vient de la publication initiale de mars 2025 ; **elle est dépassée**.
- Mon calcul de contrôle : de GPT-4 à Mythos, on passe de 4 min à 1 045 min, soit ×262 en 3,1 ans, donc un doublement tous les 4,6 mois.
- **APPUIE fortement** : c'est la courbe la plus parlante pour un lecteur (« l'IA tenait 4 minutes de travail en 2023, une journée en 2026 »).

**Limites, à écrire dans le chapitre :**
- METR juge ses mesures **au-delà de 16 h peu fiables** avec sa suite de tâches actuelle. Le dernier point est donc à la limite de l'instrument.
- Les intervalles de confiance sont très larges, environ ×0,5 à ×5.
- Un correctif de mars 2026 a réduit de jusqu'à 20 % les horizons récents ([note METR](https://metr.org/notes/2026-03-20-impact-of-modelling-assumptions-on-time-horizon-results/)).
- Les tâches sont « plus propres » que le travail réel.
- L'horizon à 80 % reste environ 5 fois plus court que l'horizon à 50 %.
- En août 2025, METR a montré qu'un agent qui passe les tests automatiques ne produit pas pour autant du code fusionnable tel quel. Claude 3.7 passait environ 38 % des tests des mainteneurs, mais beaucoup moins de ses solutions étaient acceptables à la relecture humaine ([METR, 12/08/2025](https://metr.org/blog/2025-08-12-research-update-towards-reconciling-slowdown-with-time-horizons)). **NUANCE.**

### 1.3 Benchmarks : record glissant [M]

Source : [Epoch AI Benchmarking Hub](https://epoch.ai/benchmarks) ([archive CC-BY](https://epoch.ai/data/benchmark_data.zip)). CSV : `ia_benchmarks_etat_de_lart.csv`. Les scores sont en %, à la date de sortie du modèle.

| Benchmark | Ce qu'il mesure | Premier point | Dernier point (record) | Sens |
|---|---|---|---|---|
| GPQA Diamond | QCM de sciences niveau doctorat (experts humains : environ 65-70 %) | 36 % (GPT-4, 03/2023) | 96 % (Gemini 4, 09/2026) | APPUIE, mais **saturé** |
| OTIS Mock AIME | Problèmes d'olympiades | 0,6 % (GPT-4, 03/2023) | 100 % (GPT-5.5, 04/2026) | **saturé** |
| SWE-bench Verified | Résolution de vraies issues GitHub | 31 % (GPT-4o, 11/2024) | 83,5 % (Claude Opus 4.7, 04/2026) | APPUIE |
| FrontierMath niveaux 1-3 | Mathématiques inédites de niveau recherche | 0,7 % (GPT-4 Turbo, 04/2024) | **94 %** (GPT-6 Astra, 09/2026) | **APPUIE fortement** |
| FrontierMath niveau 4 | Problèmes les plus durs, environ 48 problèmes | 0 % (o3-mini, 01/2025) | 100 % (GPT-6.1, 09/2026) | APPUIE, mais **saturé** (échantillon petit) |
| Humanity's Last Exam | 2 500 questions d'experts | 4,6 % (09/2024) | 55 % (09/2026) | APPUIE |
| ARC-AGI-2 | Raisonnement visuel abstrait, conçu pour résister aux LLM | ≈ 0 % (07/2024) | 95 % (09/2026) | APPUIE |
| GDPval (OpenAI) | Livrables de 44 métiers ; part jugée ≥ expert humain | 12 % (11/2024) | 71 % (GPT-5.2, 12/2025) | APPUIE |
| OSWorld 2 | Usage autonome d'un ordinateur de bureau | 8 % (02/2026) | **31 %** (07/2026) | NUANCE |
| Remote Labor Index | Vrais projets freelance, livrés à un niveau acceptable par le client | 0,8 % (06/2025) | **21 %** (09/2026) | **NUANCE** |

**Lecture.**
- Chaque benchmark difficile créé depuis 2023 est passé de quasi 0 % à plus de 50 % en 1 à 3 ans. C'est le meilleur argument « ça arrive ».
- Mais les deux benchmarks les plus proches du **travail réel** (Remote Labor Index, OSWorld 2) sont encore à 20-30 %. Près de 80 % des projets freelance réels ne sont pas automatisables de bout en bout fin 2026.
- Biais à mentionner :
  - risque de contamination des données d'entraînement ;
  - résultats souvent obtenus avec le réglage de raisonnement maximal, donc coûteux ;
  - les résultats marqués « externes » sont rapportés par les labos et ne sont pas reproduits par Epoch.

**Indice composite (ECI d'Epoch).** CSV : `ia_epoch_capabilities_index.csv`.
- Le record passe de 129 (GPT-4o, 05/2024) à 150 (GPT-5, 08/2025), puis à **169** (GPT-6 Astra et Claude Opus 5.5, 09/2026).
- Epoch mesure environ +14 points/an depuis l'arrivée des modèles de raisonnement (09/2024), contre +6 auparavant : **accélération**.
- Meilleur modèle chinois : 158 (Kimi K3, 07/2026). **Meilleur modèle français : 150** (Mistral Large 4, 10/2026), soit le niveau de la frontière américaine d'août 2025, un retard d'environ 14 mois. Pertinent pour la section Europe.

### 1.4 Faits marquants 2025-2026 [M sauf mention]

| Date | Fait | Source | Sens |
|---|---|---|---|
| 21/07/2025 | Gemini Deep Think : **or à l'IMO**, 35/42, notation officielle par les coordinateurs de l'IMO, en langage naturel, dans le temps imparti. OpenAI annonce aussi 35/42 avec un modèle expérimental (auto-déclaré, non noté par l'IMO) | [Google DeepMind](https://deepmind.google/discover/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/) | APPUIE |
| 07/2026 | **IMO 2026 : 42/42** pour Celia (Huawei) et dots-note-3.0 (Xiaohongshu), selon les entreprises, avec notation par les organisateurs ; 7 humains sur 666 ont fait un sans-faute. D'autres 42/42 (OpenAI, Anthropic…) ne viennent que d'un test informel | [AFP via The Standard, 23/07/2026](https://www.standardmedia.co.ke/sports/amp/sci-tech/2001553533/ai-catches-up-with-humans-to-score-100pc-at-top-maths-contest) ⚠️ (pas de communiqué IMO trouvé) | APPUIE |
| 10/2025 → 02/2026 | Environ **100 problèmes d'Erdős** passés dans la colonne « résolu » avec l'aide de l'IA. Selon le recensement de T. Tao, il s'agit surtout de recherche bibliographique ; au moins 2 preuves sont originales (dont le n° 728, GPT-5.2 Pro et Aristotle, 04/01/2026) | [Quanta, 03/08/2026](https://www.quantamagazine.org/how-ai-tore-through-a-mathematical-community-20260803/) ; [Scientific American via Harvard](https://people.math.harvard.edu/~williams/scientificamerican2.pdf) | APPUIE, avec NUANCE (« victoires faciles », selon Tao) |
| 05/2026 | Un agent DeepMind résout **9 problèmes d'Erdős ouverts sur 353** (quelques centaines de dollars par problème) | Quanta (idem) | APPUIE (mais 97 % d'échecs) |
| 20/05/2026 | Un modèle interne d'OpenAI trouve un **contre-exemple à la conjecture des distances unitaires d'Erdős (1946)**. Gowers : publiable dans les *Annals* « sans hésitation ». Résultat amélioré par des humains en quelques semaines | Quanta (idem) | **APPUIE fortement** : premier résultat mathématique historiquement important attribué à une IA |

### 1.5 Coût, investissements, adoption

Le détail figure dans les CSV `ia_eco_*`.

| Série | Valeurs clés | Statut | Source | Sens |
|---|---|---|---|---|
| Prix d'inférence à capacité constante | Médiane **÷50 par an** (de ÷9 à ÷900 selon le seuil, 2022-2025). Niveau GPT-4 sur MMLU : 37,5 $/M tokens (03/2023) → 0,18 $ (02/2025). Réestimation 2026 plus prudente : ÷5 à ÷10 par an | E | [Epoch, 03/2025](https://epoch.ai/data-insights/llm-inference-price-trends) ; [Epoch, 02/2026](https://epoch.ai/gradient-updates/how-persistent-is-the-inference-cost-burden) ; [a16z](https://a16z.com/llmflation-llm-inference-cost/) | APPUIE |
| Tokens traités par Google | 9,7 T/mois (05/2024) → 480 T (05/2025) → >3 200 T (05/2026) | A | [Google I/O 2026](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/) | APPUIE (la facture totale monte) |
| Capex Microsoft, Alphabet, Amazon, Meta | 147 Md$ (2023) → 228 (2024) → **376 (2025)** → environ **735 (2026, guidance)** | M (SEC) / A (guidance) | [SEC XBRL](https://data.sec.gov/api/xbrl/companyconcept/CIK0000789019/us-gaap/PaymentsToAcquirePropertyPlantAndEquipment.json) et communiqués de résultats (voir CSV) | APPUIE |
| Revenus des laboratoires d'IA | OpenAI : 3,7 Md$ (2024) → 13,1 Md$ (2025), perte opérationnelle de 20,9 Md$ (états fuités) ; run-rate d'environ 50 Md$ (10/2026). Anthropic : run-rate de 47 Md$ (05/2026, officiel) | A ⚠️ | [Anthropic](https://www.anthropic.com/news/series-h) ; [BGov/FT](https://news.bgov.com/artificial-intelligence/openais-annualized-revenue-nears-50-billion-ft-says) | APPUIE / NUANCE (pertes) |
| Ratio capex / revenus | Capex 2026 d'environ 735 Md$ contre environ 115 Md$ de run-rate OpenAI + Anthropic, soit environ 6:1 (calcul ; revenus IA des clouds non comptés). Sequoia : « question à 600 Md$ » ; Bain : 2 000 Md$/an nécessaires en 2030 | E | [Sequoia](https://sequoiacap.com/article/ais-600b-question/) ; [Bain](https://www.bain.com/about/media-center/press-releases/20252/$2-trillion-in-new-revenue-needed-to-fund-ais-scaling-trend---bain--companys-6th-annual-global-technology-report/) | NUANCE (risque de bulle) |
| FMI, WEO 10/2026 | Si l'investissement IA s'arrête brutalement : PIB mondial −1,1 %, PIB américain −1,8 % d'ici 2028 | P ⚠️ (via Reuters) | [BusinessDay/Reuters](https://www.businessday.co.za/world/americas/2026-10-13-imf-warns-of-risks-from-ai-market-correction-and-war/) | NUANCE |
| Entreprises de l'UE (≥ 10 salariés) utilisant l'IA | UE : 7,7 % (2021) → 8,1 % (2023) → 13,5 % (2024) → **20,0 % (2025)**. France : 5,9 % → 9,9 % → **18,2 %**. Danemark : 42 % | M | [Eurostat isoc_eb_ai](https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ai/default/table) | APPUIE (×2,5 en 2 ans) / NUANCE (80 % des entreprises n'utilisent pas l'IA) |
| France, non-utilisatrices | 71 % ne voient pas l'utilité de l'IA | M | [Insee Première n° 2120](https://www.insee.fr/fr/statistiques/9025878) | NUANCE |
| Entreprises américaines (Census BTOS) | 17,3 % (11/2025) → 24,6 % (10/2026), nouvelle question | M | [Census BTOS](https://www.census.gov/hfp/btos/downloads/National.xlsx) | APPUIE |
| Individus utilisant l'IA générative | UE 2025 : 32,7 % des 16-74 ans (France : 37,5 %). États-Unis (RPS), 18-64 ans : 44,6 % (T3 2024) → 60,8 % (T3 2026) | M | [OWID/Eurostat](https://ourworldindata.org/grapher/share-europe-using-generative-ai) ; [FRED](https://fred.stlouisfed.org/series/RPSGENAIUSAGESHAREALL) | APPUIE |
| Utilisateurs hebdomadaires de ChatGPT | 100 M (11/2023) → 500 M (03/2025) → 800 M (10/2025) → 900 M (02/2026) | A | [TechCrunch](https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users) | APPUIE (ralentissement en 2026) |
| Anthropic Economic Index | Claude.ai : environ 45-49 % d'automatisation contre 47-56 % d'augmentation (2025). API entreprises : environ 75 % d'automatisation | M (données de l'éditeur) | [Anthropic, 01/2026](https://www.anthropic.com/research/anthropic-economic-index-january-2026-report) | APPUIE (entreprises) |

**Énergie.** Les centres de données ont consommé environ 415 TWh en 2024 (1,5 % de l'électricité mondiale). L'AIE projette environ **945 TWh en 2030** dans son scénario de base ([AIE, Energy and AI, 04/2025](https://www.iea.org/reports/energy-and-ai/executive-summary)). C'est une contrainte, mais aussi un atout français (nucléaire). NUANCE.

### 1.6 Emploi et productivité : études empiriques

| Étude | Résultat | Sens |
|---|---|---|
| [Brynjolfsson, Li, Raymond (QJE 2025)](https://www.nber.org/papers/w31161) | Service client : +14 % de tickets résolus par heure, +34 % pour les novices | APPUIE (micro) |
| [Dell'Acqua et al. (HBS/BCG, 2023)](https://www.hbs.edu/faculty/Pages/item.aspx?num=64700) | Dans la « frontière » de l'IA : +12 % de tâches, +25 % de vitesse, +40 % de qualité. Hors frontière : −19 points de réponses correctes | NUANCE |
| [METR, essai randomisé (07/2025)](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) | Développeurs open source expérimentés **19 % plus lents** avec l'IA, alors qu'ils se croyaient 20 % plus rapides | **CONTREDIT** (début 2025) |
| [METR, suite (02/2026)](https://metr.org/blog/2026-02-24-uplift-update/) | −18 % de temps (IC −38 à +9 %), non significatif ; protocole abandonné parce que 30 à 50 % des développeurs refusent désormais de travailler sans IA | NUANCE (penche vers APPUIE) |
| [Brynjolfsson, Chandar, Chen, « Canaries »](https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/) | 22-25 ans dans les métiers les plus exposés : environ −13 à −16 % d'emploi relatif depuis 2024 ; causalité non établie | APPUIE (premier signal) |
| [Humlum & Vestergaard (NBER w33777, rév. 03/2026)](https://www.nber.org/papers/w33777) | Danemark : effet nul « précis » sur les salaires et les heures (effets supérieurs à 2 % exclus) | **CONTREDIT** (court terme) |
| [Yale Budget Lab (09/2026)](https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market) | « No clear evidence of AI-associated labor market disruption » (pas de preuve claire de perturbation du marché du travail liée à l'IA), données jusqu'à août 2026 | **CONTREDIT** (à ce stade) |
| [Yotzov, Bloom et al. (NBER w34836, 03/2026)](https://www.nber.org/papers/w34836) | 6 000 dirigeants : plus de 80 % ne voient aucun effet passé ; ils prévoient +1,4 % de productivité et −0,7 % d'emploi à 3 ans | CONTREDIT (passé) / NUANCE |
| [Banque de France, Bulletin 266 (09/2026)](https://www.banque-france.fr/fr/actualites/lia-sinstalle-dans-les-entreprises-francaises-une-diffusion-rapide-mais-des-gains-de-productivite) | Plus des 2/3 des entreprises de 20 salariés et plus utilisent l'IA générative ; gains de productivité « encore limités » | NUANCE |
| [Acemoglu (NBER w32487)](https://www.nber.org/papers/w32487) | Productivité globale des facteurs : au plus +0,66 % **en 10 ans** | CONTREDIT |
| [MIT NANDA (07/2025)](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf) | « 95 % des organisations sans retour » ; méthode faible (échantillon de convenance, pas de relecture par les pairs) | NUANCE faible, **à ne pas surutiliser** |

### 1.7 Projections d'organismes [P]

Rappel : être *exposé* à l'IA ne veut pas dire que son emploi sera *détruit*.

| Organisme | Projection | Sens |
|---|---|---|
| [FMI (01/2024)](https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity) | 40 % des emplois mondiaux exposés (60 % dans les pays avancés, dont environ la moitié en complémentarité) | APPUIE (ampleur) |
| OIT [2023](https://www.ilo.org/resource/news/generative-ai-likely-augment-rather-destroy-jobs) / [2025](https://webapps.ilo.org/static/english/intserv/working-papers/wp140/index.html) | 1 emploi sur 4 exposé ; 3,3 % dans la catégorie la plus exposée ; « transformation plutôt que destruction » | NUANCE |
| Goldman Sachs (03/2023 ; mise à jour de 06/2026 rapportée par la presse ⚠️) | 300 M d'emplois exposés, +7 % de PIB mondial en 10 ans ; 9 % des emplois américains déplacés en environ 10 ans | APPUIE (acteur intéressé) |
| McKinsey ([2023](https://www.weforum.org/stories/2023/07/generative-ai-could-add-trillions-to-global-economy/), [11/2025](https://fortune.com/2025/11/25/why-ai-wont-take-your-job-partnership-agents-robots-mckinsey/)) | 57 % des heures de travail américaines techniquement automatisables ; +0,1 à +0,6 point/an de productivité | APPUIE (potentiel) |
| Anthropic Economic Index (01/2026) | +1,8 point/an de productivité américaine sur 10 ans (1,0 à 1,2 point après ajustement) | P de l'éditeur, APPUIE |
| [Commission de l'IA (France, 03/2024)](https://www.gouvernement.fr/upload/media/content/0001/09/4d3cc456dd2f5b9d79ee75feea63b47f10d75158.pdf) | +0,8 à +1,3 point/an de productivité ; +250 à 420 Md€ de PIB d'ici 2034. Rappelle que l'électricité a mis environ 20 ans à produire ses gains | APPUIE, avec un délai |
| Banque mondiale (WDR 2026) ⚠️ | Risque d'automatisation : 4,5 % des emplois dans les pays à revenu faible ou intermédiaire, 14,2 % dans les pays riches | NUANCE |

---

## 2. Robotique

### 2.1 Robots industriels (IFR) [M]

Sources :
- [IFR World Robotics 2026, résumé exécutif (24/09/2026)](https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf) ;
- [WR 2025](https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years) ;
- [WR 2024](https://ifr.org/ifr-press-releases/news/record-of-4-million-robots-working-in-factories-worldwide).

CSV : `robotique_ifr_*`.

| Année | Installations mondiales | Stock opérationnel |
|---|---|---|
| 2018 | 423 000 | > 2,4 M |
| 2021 | 517 000 | 3,48 M |
| 2022 | 553 000 | — |
| 2023 | 541 000 | 4,28 M |
| 2024 | 542 000 | 4,66 M |
| 2025 | **603 000 (+11 %)** | **5,08 M** |
| 2026 (P, IFR) | 655 000 | — |
| 2029 (P, IFR) | 806 000 (+7 %/an) | — |

- **NUANCE.** C'est une croissance régulière, pas une exponentielle : plateau d'environ 550 000 par an de 2021 à 2024.
- Les prévisions passées de l'IFR se sont trompées dans les deux sens : 600 000 prévus pour 2023 contre 541 000 réalisés.

**Installations 2025 par pays.** Communiqués IFR : [Chine](https://ifr.org/downloads/press_docs/EN-2026-SEP-24-IFR_Press_Release_WR-CHINA.pdf), [UE](https://ifr.org/downloads/press_docs/EN-2026-SEP-14-IFR_Press_Release_WR-EU-27.pdf).

| Pays | Installations 2025 | Variation |
|---|---|---|
| Chine | **354 000** (59 % du monde) | +20 % |
| États-Unis | 38 400 | +12 % |
| Japon | 36 200 | −19 % |
| Corée | 30 200 | −1 % |
| Allemagne | 24 800 | −8 % |
| France | **4 474** | −8 % |
| UE-27 | 60 500 | −11 % |

- France : record de 7 380 en 2022, puis recul en 2024 et en 2025. **CONTREDIT** la thèse *pour la France*.
- La part de l'Europe dans les installations mondiales est passée d'environ 20 % (2015) à **12 % (2025)**.
- Les fabricants chinois détiennent environ 55-57 % de leur marché national (2024-2025), contre environ 30 % en 2020.

**Densité robotique** (robots pour 10 000 salariés de l'industrie manufacturière) : [IFR, 08/04/2026](https://ifr.org/ifr-press-releases/news/robot-density-surges-in-europe-asia-and-americas) (données 2024, vérifié).

| Corée | Singapour | Allemagne | Japon | États-Unis | UE-27 | Monde | Chine | France |
|---|---|---|---|---|---|---|---|---|
| 1 220 | 818 | 449 | 446 | 307 | 231 | 132 | **166** ⚠️ | non publiée (≈ 186 en 2023 selon la presse ⚠️) |

**Piège.** La Chine était à 470 en 2023 (3e mondiale, « devant l'Allemagne »). Elle tombe à 166 en 2024 parce que l'IFR utilise désormais les données d'emploi mises à jour par le NBS chinois. C'est une **rupture de série**, pas un recul : ne pas écrire « la Chine a dépassé l'Allemagne » sans le préciser.

L'IFR écrit lui-même (WR 2026) : « Most humanoids remain prototypes or pilot-stage… industrial robots are economically superior for industrial production tasks » (la plupart des humanoïdes restent des prototypes ou sont au stade pilote ; les robots industriels sont économiquement supérieurs pour les tâches de production).

### 2.2 Humanoïdes

**Livraisons mondiales.** Aucun chiffre n'est audité. CSV : `robotique_humanoides_livraisons_mondiales.csv`.

| Période | Unités | Source | Statut |
|---|---|---|---|
| 2025 | environ 7 000 (taille réelle, hors R&D) | [IFR (30/09/2026)](https://ifr.org/ifr-press-releases/news/global-sales-of-professional-service-robots-surge-24-percent) | E |
| 2025 | environ 13 000 (Agibot 5 100, Unitree 4 200, UBTech 1 000) | [Omdia via TechNode](https://technode.com/2026/01/09/chinas-agibot-leads-global-humanoid-robot-shipments-in-2025-omdia-says/) | E |
| S1 2026 | 19 000 à 22 000 | SAG / Counterpoint via [36kr](https://eu.36kr.com/en/p/3982638611535750) | E ⚠️ |
| 2035 | 1,4 M/an (marché de 38 Md$) | [Goldman Sachs (02/2024)](https://www.goldmansachs.com/insights/articles/the-global-market-for-robots-could-reach-38-billion-by-2035) | P |
| 2050 | environ 1 Md d'unités en service | [Morgan Stanley](https://www.morganstanley.com/insights/podcasts/thoughts-on-the-market/humanoid-robot-market-rising-adam-jonas-sheng-zhong) | P |

- **Croissance : APPUIE** (×5 et plus par an).
- **Volume et usages : CONTREDIT l'imminence.** Le volume est de 30 à 80 fois inférieur à celui des robots industriels. L'IFR note que les humanoïdes requièrent souvent la téléopération.

**Par entreprise.** CSV : `robotique_humanoides_entreprises.csv` et `robotique_tesla_optimus_annonces_vs_realite.csv`.

| Acteur | Annonce | Réalité mesurée | Sens |
|---|---|---|---|
| **Unitree** (Chine) | Introduction en bourse le 19/08/2026, +460 % le premier jour | CA : 159 M CNY (2023) → **1,70 Md CNY (2025)** ; plus de 5 500 humanoïdes livrés en 2025 ; prix moyen −72 % entre 2023 et 2025 ; **74 % du CA humanoïdes vient de la recherche et de l'éducation, 9 % de l'industrie** ([The Robot Report](https://www.therobotreport.com/unitree-ipo-shows-a-real-hardware-business-the-humanoid-case-is-still-early/)) ; modèle R1 à environ 5 900 $ ([SCMP](https://www.scmp.com/tech/tech-trends/article/3319637/chinas-unitree-debuts-us5900-humanoid-robot-race-make-cheaper-products)) | APPUIE (coûts) / NUANCE (usages) |
| **UBTech** (Chine) | Cible de 10 000 unités par an | 1 079 unités en 2025 ; 921 au S1 2026 ; perte de 311 M CNY ([HKEX, 28/08/2026](https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0828/2026082801691.pdf)) | NUANCE (écart ×5 à ×10) |
| **Tesla Optimus** | 07/2024 : « high production for other companies in 2026 » (production en volume pour d'autres entreprises en 2026) ; 01/2025 : environ 10 000 en 2025 | 01/2026 : « bien moins », « still in R&D phase » (encore en phase de R&D) ([heise](https://heise.de/-11159358)) ; 10/2026 : « early production » (début de production), clients externes fin 2027 | **CONTREDIT** |
| **Agility Digit** | 300 M$ de commandes conditionnelles | CA 2025 : **1,78 M$** ; perte de 362 M$ au S1 2026 ([SEC S-4/A](https://www.sec.gov/Archives/edgar/data/0002074973/000121390026105334/ea0297114-05.htm)) | CONTREDIT / NUANCE |
| **Figure** (BMW) | — | 11 mois à Spartanburg ; nombre de robots non publié | NUANCE |
| **1X NEO** | 20 000 $ ou 499 $/mois ; usine de 10 000 unités par an (04/2026) | Aucune livraison client confirmée | ⚠️ |
| **Boston Dynamics Atlas** (Hyundai) | Production 2026 « entièrement réservée » | 30 000 robots par an en 2028 : non confirmé | ⚠️ |

### 2.3 Robotique agricole

- **Naïo Technologies** (France) :
  - redressement judiciaire en juin 2025 ;
  - reprise pour **170 000 €** en octobre 2025, avec 20 salariés conservés sur 49 ;
  - environ 300 robots vendus au total ([Réussir](https://www.reussir.fr/fruits-legumes/un-repreneur-pour-les-robots-naio-technologies)).
  - **CONTREDIT** : c'est le cas français emblématique, avec la crise viticole et la prudence des agriculteurs.
- **Carbon Robotics** (LaserWeeder, désherbage laser) : plus de 100 M$ de CA annuel selon son PDG [A] ; projet d'introduction en bourse ([AgFunder](https://agfundernews.com/🎥-carbon-robotics-100m-revenue-new-machine-and-a-path-to-ipo)). **APPUIE** (niche rentable).
- **John Deere** : kits d'autonomie limités au labour ; vise une production entièrement autonome en 2030 [P] ([AgWeb](https://www.agweb.com/news/machinery/technology/john-deere-offer-autonomy-kits-2026)). NUANCE.

### 2.4 Véhicules autonomes

**Waymo, trajets payants par semaine.** CSV : `vehicules_autonomes_waymo_trajets_payants_hebdo.csv`.

| Date | Trajets par semaine | Source |
|---|---|---|
| 05/2024 | 50 000 | TechCrunch |
| 08/2024 | 100 000 | [TechCrunch](https://techcrunch.com/2024/08/20/waymo-is-now-giving-100000-robotaxi-rides-week) |
| 04/2025 | 250 000 | [Reuters/NBC](https://www.nbcsandiego.com/news/business/money-report/waymo-reports-250000-paid-robotaxi-rides-per-week-in-u-s/3811293/) |
| 02/2026 | > 400 000 | [Bloomberg](https://www.bloomberg.com/news/articles/2026-02-11/waymo-co-ceo-outlines-path-to-1-million-weekly-trips-in-2026) |
| 03-09/2026 | environ 500 000 (15 villes, environ 4 000 véhicules) | [TechCrunch](https://techcrunch.com/2026/09/24/waymo-is-scaling-fast-heres-what-the-fleet-data-shows/) |
| fin 2026 | 1 000 000 | objectif [P] |

- **APPUIE fortement** : ×10 en moins de 2 ans.
- **Sécurité** (données publiées par Waymo, 271 M de miles sans conducteur) : −82 % d'accidents avec blessés et −95 % d'accidents avec blessés graves par rapport à la référence humaine ([Waymo Safety Impact](https://waymo.com/safety/impact/)).
  - Biais : la référence exclut les autoroutes et la neige, et il n'y a pas encore assez de miles pour conclure sur les décès.

**Les autres acteurs.**
- **Tesla.** Promesse du 22/04/2019 : « over a million robotaxis on the road » (plus d'un million de robotaxis en circulation) en 2020 ([NPR](https://www.npr.org/transcripts/nx-s1-5144675)).
  - Réalité en octobre 2026 : 6 zones limitées, environ 2 M de miles non supervisés (contre 271 M pour Waymo), environ 300 Cybercabs ([Electrek, 21/10/2026](https://electrek.co/2026/10/21/tesla-unsupervised-fsd-q2-2027-robotaxi-fleet/)).
  - **CONTREDIT** : environ 6 ans de retard.
- **Baidu Apollo Go.**
  - 3,1 M de trajets sans conducteur au T3 2025 (+212 %) ; plus de 20 M de trajets cumulés (02/2026) ; 28 villes ([6-K SEC, 08/2026](https://www.sec.gov/Archives/edgar/data/0001329099/000119312526355431/d112854dex991.htm)).
  - Mais le T2 2026 **ne publie plus le nombre de trajets**, après une panne d'environ 100 véhicules à Wuhan le 31/03/2026 ([Caixin](https://www.caixinglobal.com/2026-04-02/baidus-apollo-go-robotaxis-suffer-mass-malfunction-on-wuhan-roads-102430046.html)). APPUIE puis NUANCE.
- **Europe.**
  - Zagreb (Verne/Pony.ai) : service commercial avec opérateur de sécurité depuis 04/2026, essais sans conducteur depuis 09/2026 ([Euronews](https://www.euronews.com/2026/10/18/look-no-hands-euronews-rode-driverless-in-europes-first-robotaxi-in-zagreb)).
  - Londres : Waymo et Baidu en essais ; service sans conducteur non confirmé.
- **France.**
  - Cadre légal : [décret 2021-873 du 29/06/2021](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043729532) (véhicules à délégation de conduite et systèmes de transport routier automatisés, contrôle du STRMTG ; lu le 31/10/2026, V2537).
  - **Aucun robotaxi commercial sans conducteur.**
  - Île-de-France Mobilités : transport autonome à la demande prévu début 2028 ([Banque des Territoires](https://www.banquedesterritoires.fr/lile-de-france-lance-sont-projet-de-transport-collectif-autonome-pour-un-demarrage-en-2028)).
  - **CONTREDIT l'imminence en France**, et APPUIE l'argument du retard institutionnel européen.

### 2.5 Europe et France : synthèse

- L'Europe **utilise** des robots : densité de 231 pour l'UE, 449 pour l'Allemagne. Mais elle en **fabrique** de moins en moins sous contrôle européen :
  - KUKA appartient à Midea depuis 2017 ⚠️ (non revérifié) ;
  - la cession d'ABB Robotics à SoftBank (5,4 Md$, accord du 08/10/2025) est annoncée ([SoftBank](https://group.softbank/en/news/press/20251008)), sa clôture n'est pas confirmée ⚠️.
- La France installe 4 474 robots par an, contre 24 800 pour l'Allemagne et 354 000 pour la Chine. Aucun acteur français de taille mondiale dans les humanoïdes (Wandercraft non vérifié ⚠️). Naïo est en quasi-faillite.
- IA : le meilleur modèle français (Mistral) a environ 14 mois de retard sur la frontière (ECI).
- **Argument utile pour le manifeste** : la révolution arrive, mais **pas par l'Europe**. C'est cohérent avec la thèse « Europe fédérale et État doté de moyens ». Mais cela affaiblit l'idée que la France en récoltera spontanément les gains.

---

## 3. Projections et modèles

### 3.1 Les familles de modèles

| Modèle | Principe | Exemples | Limites |
|---|---|---|---|
| **Extrapolation de tendance** (exponentielle sur échelle log) | Prolonger une droite en échelle logarithmique | METR (doublement en 4 à 7 mois) ; Epoch (calcul ×5 par an, prix d'inférence ÷10 à ÷50 par an) | Ne dit rien de la cause. Une sigmoïde ressemble à une exponentielle avant son point d'inflexion. Les benchmarks saturent (AIME, GPQA, FrontierMath 4) |
| **Lois d'échelle** (*scaling laws*) | La perte (l'erreur du modèle) baisse en loi de puissance avec le calcul, les paramètres et les données (Kaplan 2020, Chinchilla 2022) | Base des investissements des laboratoires | Relient le calcul à la perte, **pas à l'utilité économique**. Le pré-entraînement montre des rendements décroissants (GPT-4.5) ; relais par le RL et l'inférence |
| **Contraintes physiques** | Calculer les plafonds de puissance, de puces et de données | [Epoch (08/2024)](https://epoch.ai/blog/can-ai-scaling-continue-through-2030) : environ **2e29 FLOP faisables en 2030**, soit ×200 par rapport à GPT-6 Astra. L'électricité est la contrainte qui mord en premier, puis les puces | Ce sont des scénarios « si l'argent suit » |
| **Courbes d'apprentissage** (loi de Wright) | Le coût baisse d'un pourcentage fixe à chaque doublement de la production cumulée | Robots industriels 1990-2005 : prix ajusté de la qualité −80 % ([Graetz & Michaels](https://epflicht.ulb.uni-bonn.de/download/pdf/201268)) ; prix moyen Unitree −72 % entre 2023 et 2025 ; batteries à 108 $/kWh en 2025 ([BNEF](https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/)) | **Le prix implicite des robots industriels est stable** à environ 30 800 $ de 2023 à 2025 (valeur IFR / unités, calcul, nominal). ARK prévoyait 11 000 $ en 2025 : **CONTREDIT** |
| **Scénarios narratifs et modèles de décollage** | Automatisation de la R&D en IA, puis accélération | [AI 2027](https://ai-2027.com/) ; [AI Futures Model](https://blog.aifutures.org/p/ai-futures-model-dec-2025-update) | Nombreux paramètres « à l'intuition », selon les auteurs eux-mêmes |
| **Marchés de prévision** | Agrégation de prévisionnistes | Metaculus, Manifold | Peu calibrés à long horizon ; questions mouvantes |

### 3.2 Ce que disent les prévisionnistes [P]

- **AI 2027 et AI Futures Project** ([mise à jour du 16/08/2026](https://blog.aifutures.org/i/211256047/daniel)) :
  - « Codeur automatisé » : médiane de **Kokotajlo à novembre 2027** (p10 : 01/2027, p90 : 04/2030) ; médiane de **Lifland à janvier 2030** (p90 : 2070).
  - Superintelligence : médiane de Kokotajlo à mars 2029, de Lifland à juillet 2033.
  - Les auteurs disent eux-mêmes que la réalité avance à **environ 75 % du rythme du scénario AI 2027**. Ils avaient repoussé leurs dates de 3 à 5 ans en décembre 2025, avant de les raccourcir légèrement en 2026.
  - **Lecture : l'année « 2027 » du titre n'était pas leur médiane.** Ne pas la citer comme une prédiction ferme.
- **Metaculus** : je n'ai pas pu y accéder directement (erreur 403). Un agrégateur secondaire (juillet 2026) cite une médiane de 2028 pour une « IA faiblement générale » et de **2032** pour une « IA générale » ⚠️. En 2020, la médiane était autour de 2050. La tendance des prévisions est au rapprochement, mais à vérifier sur le site avant de citer.

### 3.3 Limites et objections (steelman)

1. **Plafond des données** : environ 300 T de tokens de texte humain public de qualité (IC 100-1 000 T), entièrement utilisés **entre 2026 et 2032** (IC 80 %) ([Epoch, Villalobos et al., 06/2024](https://epoch.ai/blog/will-we-run-out-of-data-limits-of-llm-scaling-based-on-human-generated-data)). Les parades sont les données synthétiques (efficaces surtout en maths et en code), le multimodal et le RL. NUANCE.
2. **Énergie et capital** : les centres de données passeraient de 415 TWh en 2024 à 945 TWh en 2030 (AIE). Un centre de 1 GW coûte environ 38 Md$ (Epoch). Le ratio capex/revenus est d'environ 6:1, et le FMI chiffre le risque de correction. La courbe dépend d'un flux d'investissement qui peut s'arrêter. NUANCE.
3. **Saturation et validité des benchmarks** : les tests saturent en 1 à 3 ans. Les benchmarks « travail réel » (Remote Labor Index à 21 %, OSWorld 2 à 31 %) progressent mais restent bas. Écart démontré par METR entre tests automatiques et code fusionnable. NUANCE.
4. **Diffusion lente** (Solow, l'électricité) : 80 % des entreprises de l'UE n'utilisent pas l'IA, et les effets macro mesurés sont nuls ou faibles (Danemark, Yale, Bloom). La Commission IA elle-même table sur des gains étalés dans le temps. **C'est l'objection la plus forte contre « imminent ».**
5. **Écart entre annonces et réalité en robotique** : Tesla (robotaxis promis pour 2020, environ 6 ans de retard ; Optimus 2025-2026 non tenu), UBTech (cible ×10 au-dessus du réalisé), Agility (CA de 1,8 M$), 1X (pas de livraisons), Naïo (faillite). Les robots industriels croissent de 7 à 11 % par an, pas exponentiellement. Le prix implicite des robots industriels ne baisse plus. **CONTREDIT l'imminence de la robotique.**
6. **Incertitude de mesure** : intervalles METR de ×0,5 à ×5 et instrument saturé au-delà de 16 h ; calcul d'entraînement estimé, pas déclaré ; revenus des laboratoires non audités ; rupture de série sur la densité chinoise.

**Ce qui résiste aux objections.**
- Le progrès des capacités est **mesuré par des tiers indépendants** (Epoch, METR, ARC Prize, notation officielle de l'IMO, mathématiciens comme Gowers et Tao). Ce n'est pas qu'une affirmation des labos.
- Le prix par unité de capacité s'effondre.
- L'adoption double en deux ans.
- La robotaxi fonctionne commercialement à l'échelle de 500 000 trajets par semaine.

**Formulation honnête recommandée pour le chapitre** : « Les capacités progressent de façon exponentielle et mesurée. Leur traduction dans l'économie et dans le monde physique a commencé, mais suivra le rythme plus lent des investissements, des institutions et de l'industrie. C'est précisément ce délai que la politique doit utiliser. »

---

## 4. Les courbes à tracer (classement)

| Rang | Courbe | Fichier | Pourquoi elle convainc | Précaution |
|---|---|---|---|---|
| 1 | Horizon temporel METR, échelle logarithmique, 2019-2026 | `ia_metr_horizon_temporel.csv` | De 3 secondes à 17 heures ; intuitive (« minutes de travail d'expert ») | Afficher les intervalles de confiance ; plafond de 16 h |
| 2 | Record de benchmarks : FrontierMath 1-3, ARC-AGI-2, HLE, Remote Labor Index | `ia_benchmarks_etat_de_lart.csv` | Tests conçus pour résister à l'IA, passés de 0 à plus de 50 % en 1 à 3 ans | Montrer aussi le Remote Labor Index (21 %) par honnêteté |
| 3 | Calcul d'entraînement, échelle logarithmique, 2010-2026 | `ia_calcul_entrainement_*.csv` | ×2 milliards depuis AlexNet (2012) | Estimations ; record incomplet après 2025 |
| 4 | Capex des hyperscalers et revenus des laboratoires | `ia_eco_capex_hyperscalers.csv`, `ia_eco_revenus_labos_ia.csv` | Ampleur de l'engagement industriel | C'est aussi un indicateur de bulle |
| 5 | Waymo, trajets par semaine | `vehicules_autonomes_waymo_trajets_payants_hebdo.csv` | La seule courbe de robotique physique franchement exponentielle | Deux pays seulement ; à mettre en regard de Tesla |
| 6 | Adoption de l'IA par les entreprises, UE et France (Eurostat) | `ia_eco_adoption_entreprises_eurostat.csv` | ×2,5 en 2 ans ; la France rattrape l'UE | 80 % de non-utilisatrices |
| Contre-courbe | Installations de robots industriels, et prix implicite | `robotique_ifr_installations_monde.csv`, `robotique_ifr_valeur_marche_et_prix_implicite.csv` | Montre que la robotique industrielle est linéaire | À publier : charte §5 (steelman) |

---

## 5. Points non confirmés (⚠️ → à reporter dans `verifications.md`)

1. Les résultats de l'IMO 2026 (42/42 de Huawei et Xiaohongshu) ne reposent que sur les entreprises et l'AFP ; pas de communiqué officiel de l'IMO trouvé.
2. Les chiffres Metaculus (2028 et 2032) viennent d'un agrégateur secondaire ; la page Metaculus était inaccessible.
3. Les revenus et run-rates d'OpenAI et d'Anthropic ne sont pas audités (états OpenAI 2025 fuités, run-rate d'Anthropic de 65 Md$ rapporté par la presse).
4. Les capex T3 2026 d'Alphabet, Amazon et Microsoft sont publiés après le 25/10 : guidances de juillet à mettre à jour. Oracle FY27 et Goldman Sachs 06/2026 ne viennent que de la presse.
5. FMI WEO 10/2026, scénario de correction : −1,1 % selon Reuters, une autre source donne −0,6 %.
6. Densité robotique de la France (180 et 186) : chiffres de presse, l'IFR ne publie pas de valeur.
7. Unitree : chiffres du prospectus lus via la presse ; livraisons d'humanoïdes au S1 2026 (SAG, Counterpoint) ; Hyundai (30 000 robots par an en 2028).
8. Baidu : trajets du T1 et du T2 2026 ; Waymo : 150 000 trajets par semaine en 10/2024.
9. Clôture de la cession ABB Robotics à SoftBank ; KUKA/Midea ; service sans conducteur de Waymo à Londres ; humanoïdes européens (Wandercraft, Neura) non vérifiés.
10. Les noms et dates des modèles de 2026 (GPT-6 Astra, Claude Mythos, Claude Fable, etc.) sont repris tels quels des bases Epoch et METR ; je ne les ai pas recoupés individuellement.

## 6. Biais des sources

- **Éditeurs d'IA** (Anthropic Economic Index, OpenAI/NBER, annonces de revenus) : parties intéressées.
- **Cabinets** (Goldman Sachs, McKinsey, Morgan Stanley, ARK, Bain) : leurs projections servent aussi leurs clients.
- **Waymo** publie ses propres données de sécurité.
- **Epoch et METR** sont indépendants des laboratoires, mais Epoch est financé en partie par OpenAI pour FrontierMath (accès aux problèmes), et METR a des partenariats d'évaluation avec les laboratoires.
- Les études universitaires sur l'emploi (Danemark, Yale, Stanford) portent sur 2023-2026. Elles ne disent rien de la suite.

## 7. Liste des sources principales

**Données de capacités**
- [Epoch AI, Notable AI Models](https://epoch.ai/data/notable-ai-models)
- [Epoch, Benchmarking Hub](https://epoch.ai/benchmarks)
- [Epoch, Trends](https://epoch.ai/trends)
- [METR, Time Horizons](https://metr.org/time-horizons/)
- [METR, Algorithmic vs Holistic (08/2025)](https://metr.org/blog/2025-08-12-research-update-towards-reconciling-slowdown-with-time-horizons)

**Limites et contraintes**
- [Epoch, Will we run out of data? (06/2024)](https://epoch.ai/blog/will-we-run-out-of-data-limits-of-llm-scaling-based-on-human-generated-data)
- [Epoch, Can AI scaling continue through 2030? (08/2024)](https://epoch.ai/blog/can-ai-scaling-continue-through-2030)
- [AIE, Energy and AI (04/2025)](https://www.iea.org/reports/energy-and-ai/executive-summary)

**Mathématiques**
- [Google DeepMind, IMO 2025](https://deepmind.google/discover/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/)
- [Quanta, IA et problèmes d'Erdős (08/2026)](https://www.quantamagazine.org/how-ai-tore-through-a-mathematical-community-20260803/)

**Prévisions**
- [AI Futures Project, mise à jour du 16/08/2026](https://blog.aifutures.org/i/211256047/daniel)
- [AI Futures Model, 12/2025](https://blog.aifutures.org/p/ai-futures-model-dec-2025-update)

**Robotique**
- [IFR World Robotics 2026](https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf)
- [IFR, densité robotique (04/2026)](https://ifr.org/ifr-press-releases/news/robot-density-surges-in-europe-asia-and-americas)
- [IFR, robots de service (09/2026)](https://ifr.org/ifr-press-releases/news/global-sales-of-professional-service-robots-surge-24-percent)
- [Waymo Safety Impact](https://waymo.com/safety/impact/)

**Économie, emploi, adoption**
- Les sources de cette catégorie sont citées en ligne dans les sections 1.5 à 1.7 et dans la colonne `source_url` des CSV `ia_eco_*`.
- Principales : Eurostat, Insee, Census BTOS, NBER (w31161, w32487, w33777, w34836), METR (07/2025 et 02/2026), Stanford Digital Economy Lab, Yale Budget Lab, Banque de France, FMI, OIT, Commission de l'IA.
