---
titre: L'accélération : résultats (pour l'ouverture du livre)
tache: T18
statut: brouillon sourcé
consultation: 2026-10-25
---

# L'accélération : ce que disent les chiffres

> **À lire d'abord.** Ce sont des **hypothèses et des ordres de grandeur, pas des prédictions**. Chaque chiffre vient de `donnees/*.csv` (avec sa source) ou d'un calcul reproductible (`jsc modele.js test_modele.js`). Méthode et hypothèses H1 à H8 : [`methode.md`](methode.md). ⚠️ = non confirmé.
>
> **Transparence.** Ce texte est coécrit avec Claude, l'IA d'Anthropic. Les chiffres qui viennent d'Anthropic sont signalés. Ils ne sont jamais utilisés seuls quand une mesure indépendante existe (METR, Epoch AI).

## 1. Ce qui accélère vraiment

Le test est simple : on mesure le **temps de doublement** sur des fenêtres successives. S'il raccourcit, ça accélère. S'il reste stable, c'est une exponentielle « simple » (déjà très rapide). S'il s'allonge, ça ralentit.

| Courbe | Doublement (ajustement) | Évolution du doublement | Verdict |
|---|---|---|---|
| **Longueur des tâches que les agents IA réussissent seuls** ([METR](https://metr.org/time-horizons/)) | 6,0 mois depuis 2019 ; 4,1 mois depuis 2023 ; **3,5 mois depuis mi-2024** | 6,8 mois (2022-2024) → 6,5 (2023-2025) → **3,4 (2024-2026)** | **Accélère** |
| Calcul d'entraînement des plus gros modèles ([Epoch](https://epoch.ai/data/notable-ai-models)) | 5,2 mois (×4,9/an) | entre 4,5 et 5,7 mois selon les fenêtres, sans tendance | Exponentielle stable (n'accélère pas) |
| Trajets Waymo sans conducteur | 8,8 mois | plateau à environ 500 000/semaine de mars à septembre 2026 | Rapide, puis pause |
| Utilisateurs hebdomadaires de ChatGPT (auto-déclarés) | 8 mois | une courbe en S (plafond d'environ 2,2 Md) colle aussi bien qu'une exponentielle | **Ralentit** probablement |
| Entreprises utilisant l'IA (Eurostat, 2023-2025) | UE 18 mois, France 15 mois | 3 points seulement | Rapide, mais part de bas (20 %) |
| Installations de robots industriels (IFR) | environ 15 ans (+5 %/an) | plateau 2021-2024 | **N'accélère pas** |

**Le fait le plus fort de l'introduction.** En mars 2023, GPT-4 réussissait seul des tâches qui prennent **4 minutes** à un expert. En avril 2026, Claude Mythos Preview en réussit qui prennent **17 heures**. Et le rythme lui-même s'est accéléré : la durée doublait tous les 6 à 7 mois jusqu'en 2024, elle double tous les 3 à 4 mois depuis.
- Précautions à écrire à côté : réussite à 50 % seulement ; tâches surtout logicielles ; instrument peu fiable au-delà de 16 h.
- Note : Mythos est un modèle d'Anthropic, mais la mesure est celle de METR.

**Les maths et la recherche : le délai « l'IA ne sait pas » → « l'IA fait aussi bien que les meilleurs » se compte désormais en mois** (`delai_incapable_a_surhumain.csv`).

| Tâche | « Ne sait pas » | « Niveau expert » | Délai |
|---|---|---|---|
| Échecs | 1957 (premier programme) | 1997 (Deep Blue) | 40 ans |
| Raisonnement abstrait ARC-AGI-1 | 0 % en 2020 | 87,5 % le 20/12/2024 (ARC Prize) | 4,5 ans |
| Programmation compétitive | niveau médian (AlphaCode, 02/2022) | élite mondiale (o3, 12/2024 ; Gemini à l'ICPC, 09/2025) | 3 à 3,6 ans |
| Olympiades de maths (IMO) | 9 % à une qualification (2024) | **or, noté par l'IMO** (07/2025) ; 42/42 en 07/2026 ⚠️ | 1,1 an |
| Questions de science niveau doctorat (GPQA) | 39 % (11/2023) | 87,7 % contre 65-74 % pour les experts (12/2024) | 1,1 an |
| Maths de recherche (FrontierMath 1-3) | < 2 % (11/2024) | 67 % (12/2025), 94 % (09/2026) | 1,1 an |
| ARC-AGI-2 (conçu contre les IA) | 0 % (03/2025) | 64,6 % contre 60 % pour le panel humain (02/2026) | **0,9 an** |

Mise en garde (biais de censure, méthode L3) : les tests récents n'ont *pas eu le temps* d'afficher un délai long, et ceux que l'IA ne réussit pas encore n'apparaissent pas dans la table. La tendance au raccourcissement est réelle, mais exagérée par ce tableau.

Au-delà des tests, des résultats de recherche :
- AlphaFold : Nobel de chimie en 2024.
- Contre-exemple à une conjecture d'Erdős de 1946 par un modèle d'OpenAI (05/2026), jugé publiable dans les *Annals* par Gowers.
- 722 manuscrits publiés en bloc par OpenAI (10/2026), encore en cours d'audit humain.
- Le théorème des nombres premiers fort formalisé en Lean en 3 semaines (Gauss, 2025), contre environ 18 mois de travail humain.

## 2. Ce qui n'accélère pas

- **La robotique physique, en tant que rythme de produits.** On mesure ici le délai entre deux générations de produits (`robotique_generations_produits.csv`).

| Entreprise | Intervalles entre générations (mois) | Tendance | Annonce → première livraison client |
|---|---|---|---|
| Unitree | H1 (2023) → G1 (05/2024) : ~10-15 → R1 : 14 → H2 : 3 → prototype 2026 : 10 | stable, environ 1 an, avec des gammes parallèles | G1 : 3 mois (série dès 08/2024, 16 000 $, puis 13 500 $ en 2026) |
| Boston Dynamics | 31 → 98 → 21 | irrégulier | Atlas produit (CES 01/2026) : pas d'expédition confirmée ⚠️ |
| Tesla Optimus | 13 → 15 → 24 ; Gen 3 non dévoilée plus de 34 mois après Gen 2 | **s'allonge** | aucune livraison externe en 5 ans ; « début de production » le 21/10/2026, clients externes fin 2027 |
| Figure | 02 (08/2024) → 03 (10/2025) : 14 | stable | Figure 03 : environ 6 mois, mais surtout en usage interne |
| Agility | 24 → 45 → 42 | **s'allonge** | Digit v4 : 15 mois (GXO) ; Digit 5 : clients en 2027 |
| 1X | 74 → 6 → 8 | raccourcit | NEO : livraisons annoncées en 10/2026, non vérifiées ⚠️ |

**Verdict.** Le cycle **ne raccourcit pas de façon générale**. Ce qui s'améliore vite, ce sont les **prix** :
- prix moyen d'Unitree en baisse de 72 % entre 2023 et 2025 ;
- coût de fabrication d'un humanoïde selon Goldman Sachs : de 50-250 k$ (2023) à 30-150 k$ (2024) ;
- **volumes** : environ 5 500 humanoïdes livrés par Unitree en 2025.

Mais 74 % de ces ventes vont à la recherche et à l'éducation, et l'IFR note un recours fréquent à la téléopération. La démonstration du nouvel Atlas au CES était elle-même téléopérée.

- **La diffusion dans l'économie.**
  - 80 % des entreprises européennes n'utilisent pas l'IA.
  - Les effets mesurés sur l'emploi et la productivité restent nuls ou faibles (voir [recherche-ia-robotique.md §1.6](../../sources/recherche-ia-robotique.md)).
- **Les robots industriels** : environ +5 %/an sur la période, et la France recule.

## 3. L'IA qui accélère l'IA : déclarations contre mesures

| Qui | Ce qui est dit | Ce que ça mesure vraiment |
|---|---|---|
| Google | « plus d'un quart du nouveau code » (10/2024, [Alphabet](https://blog.google/inside-google/message-ceo/alphabet-earnings-q3-2024/)) ; **75 %** (04/2026, [presse](https://www.semafor.com/article/04/24/2026/google-ceo-says-75-of-companys-new-code-is-ai-generated)) | Code *proposé par l'IA puis accepté* par un ingénieur. L'unité n'est pas définie et inclut probablement l'autocomplétion. Ce n'est pas du travail autonome |
| Google DeepMind, AlphaEvolve (05/2025) | 0,7 % du calcul de Google récupéré ; entraînement de Gemini 1 % plus rapide | Gain réel mais modeste, sur des problèmes vérifiables automatiquement |
| Anthropic ⚠️ conflit d'intérêts | Amodei (03/2025) : « 90 % du code d'ici 3 à 6 mois » | Une **prévision**, pas une mesure |
| Anthropic ⚠️ | Rapport interne (12/2025) : Claude utilisé dans 59 % du travail, +50 % de productivité, +67 % de PR fusionnées | Auto-déclaré par les salariés ; aucun pourcentage de code |
| Anthropic ⚠️ | Cartes système de 2026 : productivité ressentie d'environ ×4 (Mythos), mais progrès global **« below 2x »** ; pente de l'indice interne ×1,53 (Opus 5.5) | Estimations internes. Elles sont plus prudentes que les déclarations publiques |
| OpenAI | Assistant de recherche « niveau stagiaire » en 09/2026, chercheur automatisé en 2028 | Objectifs. L'atteinte du premier n'est pas documentée |
| Microsoft, Meta | 20-30 % du code (04/2025) ; « la majeure partie » d'ici 12 à 18 mois | Déclarations sans méthode |

**Mesures indépendantes, à privilégier :**
- **METR, RE-Bench (11/2024)** : sur 2 h, l'IA fait environ 4 fois mieux que les experts en ingénierie de recherche. Sur 32 h, les humains font environ 2 fois mieux.
- **METR, Expenditure Horizon (07/2026)** : en accélération mesurée d'une vraie tâche de recherche (NanoGPT), les meilleurs modèles apportent environ 1 à 1,5 %. Effet autonome « minimal ».
- **Epoch, InnovationEval (07/10/2026)** : réinventer seul une technique de ML récente donne environ 15 % du gain humain. « AI struggles at end-to-end AI algorithms R&D… for now. »
- **METR, productivité réelle** (fin 2025) : +4 à +20 % mesurés, contre ×1,4 à ×2 ressentis.
- **METR sur Claude Opus 5.5** (09/2026) : « ~1,5X overall acceleration… perhaps 30% chance of 2X ». L'évaluateur est indépendant, mais ses preuves ne sont pas publiées, et le texte est dans un document d'Anthropic.

**Lecture honnête.** L'IA accélère déjà la recherche en IA, d'environ **×1,5, et moins de ×2**, selon les meilleures estimations de fin 2026. C'est beaucoup pour une industrie. C'est loin de « l'IA qui se construit seule ». Les chiffres spectaculaires (« 75 % du code ») mesurent de l'assistance, pas de l'autonomie.

## 4. La fourchette de bascule (hypothèses, pas une date)

**Définition retenue (H3)** : un agent réussit seul des projets d'**un mois de travail** d'expert. On part de 17,4 h (04/2026, METR).

| Scénario (methode.md §6) | Atteinte du seuil « 1 mois » |
|---|---|
| Haut : le rythme continue d'accélérer | ≈ avril 2027 |
| Central A : tendance 2023-2026, à 50 % de réussite | ≈ mai 2027 |
| Central B : même tendance, mais à 80 % de réussite | ≈ avril 2028 |
| Bas : tendance longue 2019-2026, à 80 % | ≈ mars 2029 |
| Bas + ralentissement de 30 %/an | ≈ août 2031 |
| Courbe en S (ralentissement de 50 %/an) | **jamais** avant 2100 |

Seuil « 1 semaine » (40 h) : entre fin 2026 et fin 2028 selon les mêmes hypothèses.

**Ce que disent les prévisionnistes** (`previsions_bascule.csv`, une voix par famille de sources) :
- médiane des médianes : **2042** ;
- quartiles : 2032-2046 ;
- étendue : de 2026 (Amodei, « as early as ») à 2060 (superprévisionnistes, 2022).

Par famille :
- **Chercheurs en IA** (ESPAI, réalisée en 12/2024 et publiée en 2026) : « IA de niveau humain » en **2042** à 50 %. C'était 2047 dans l'édition 2023 et 2061 dans celle de 2016 : les chercheurs **rapprochent** leurs prévisions. Ils donnent 10 % de chances dès 2027.
- **Dirigeants de laboratoires** : 2026-2035. Ce sont des parties intéressées.
- **Metaculus** : 2039 en 2022. Une valeur plus récente (2032) circule, mais elle n'est pas confirmée ⚠️.

**Formulation proposée pour le livre** : « Si les tendances mesurées continuent, des agents capables de mener seuls des projets d'un mois arrivent entre 2027 et 2029. Si elles ralentissent, ce sera plutôt dans les années 2030. Si la courbe est une courbe en S, peut-être jamais sous cette forme. Les chercheurs du domaine situent l'IA de niveau humain autour de 2040, et cette date recule vers nous à chaque enquête. »

**Fragilité de cette fourchette :**
1. Elle repose sur un seul instrument, METR, dont le dernier point dépasse la zone fiable.
2. Un ralentissement modeste (doublement qui s'allonge de 30 %/an) repousse la date de 2 à 4 ans. Un ralentissement fort la supprime.
3. « Un mois de tâche d'expert sur un banc de test » n'est pas « un mois de travail réel » : le Remote Labor Index est à 21 %.
4. Atteindre une capacité n'est pas la diffuser. L'électricité a mis environ 20 ans à produire ses gains.

## 5. Ce qui appuie, nuance ou contredit la thèse de l'auteur

**Appuie**
- Les capacités de l'IA ne font pas que croître de façon exponentielle : sur la mesure la plus parlante (METR), **le rythme lui-même s'est accéléré** depuis 2024.
- Le délai entre « l'IA échoue » et « l'IA égale les meilleurs » est passé de décennies (échecs) à quelques années (programmation), puis à environ un an (IMO, GPQA, FrontierMath, ARC-AGI-2).
- Des résultats mathématiques réels et une IA déjà utile à la recherche en IA (×1,5 environ).
- Les prévisions des chercheurs se rapprochent à chaque édition.

**Nuance**
- L'accélération porte sur des tâches bien définies et vérifiables. Les benchmarks du travail réel restent bas (21-31 %).
- L'auto-accélération de l'IA est mesurée sous ×2, loin d'une « explosion ».
- Les chiffres spectaculaires des laboratoires (part du code) mesurent l'assistance, pas l'autonomie, et viennent de parties intéressées, dont Anthropic.
- Le calcul d'entraînement croît vite, mais n'accélère pas, et il dépend d'un flux d'investissement qui peut s'arrêter.

**Contredit (à ce jour)**
- **La robotique n'accélère pas** au sens d'un cycle de produits qui raccourcit. Tesla et Agility ralentissent ; les livraisons réelles restent faibles et surtout destinées à la recherche ; les robots industriels progressent d'environ 5 %/an.
- **L'économie ne bascule pas encore** : effets nuls ou faibles sur l'emploi et la productivité mesurés jusqu'en 2026.

**Pour le manifeste (charte §7, biais pro-technologie).** L'introduction peut dire, chiffres à l'appui, que les **capacités** de l'IA accélèrent. Elle ne peut pas dire que la **robotique** accélère, ni que l'**économie** bascule déjà. La phrase la plus solide : « l'outil arrive plus vite que nos institutions ne savent l'absorber ». C'est précisément l'argument du manifeste. Il n'a pas besoin d'exagérer la robotique pour tenir.

## 6. Courbes à tracer pour l'introduction

1. Horizon METR, en échelle logarithmique, avec deux droites de tendance (2019-2024 et 2024-2026) : l'accélération se voit. Fichier : `series_courbes.csv`, série `metr_horizon_50`.
2. Délai « incapable → expert » par tâche, en barres horizontales, avec la mise en garde sur la censure (`delai_incapable_a_surhumain.csv`).
3. Contre-courbe : intervalles entre générations de robots par entreprise (`robotique_generations_produits.csv`), et installations IFR.
4. Fourchette de bascule : les six scénarios du §4, placés à côté des médianes des prévisionnistes (`previsions_bascule.csv`).
