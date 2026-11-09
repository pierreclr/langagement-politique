---
titre: Rattraper la Chine et les États-Unis en IA et en robotique — résultats
tache: T12
statut: brouillon sourcé
consultation: 2026-10-25
---

# Rattraper la Chine et les États-Unis en IA et en robotique : ce que disent les chiffres

> **À lire d'abord.** Ce sont des **ordres de grandeur sous hypothèses, pas des prédictions**. Chaque chiffre vient de `donnees/*.csv` (avec sa source) ou d'un calcul reproductible (`jsc modele.js test_modele.js`, 11 tests au vert). Méthode et hypothèses H1 à H20 : [`methode.md`](methode.md). ⚠️ = non confirmé (registre V400-V427).
>
> **Conflit d'intérêts.** Ce texte est écrit par Claude, une IA d'Anthropic, entreprise américaine qui a intérêt à ce que l'on investisse dans l'IA. Les chiffres viennent de sources indépendantes (Stanford AI Index, Epoch AI, IFR, RTE, Cour des comptes), et le modèle donne autant de place aux arguments contre.

## 1. Le point de départ : un écart de 1 à 65, pas de 1 à 2

| 2025 | États-Unis | Chine | France | Source |
|---|---|---|---|---|
| Investissement privé dans les entreprises d'IA | **286 Md$** | 12 Md$ (+ fonds publics d'orientation : ≈ 184 Md$ vers l'IA de 2000 à 2023) | **4,4 Md$** (4e mondial) | [AI Index 2026](https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_4_economy.pdf) |
| Cumul 2013-2025 | 757 Md$ | 132 Md$ | 15,6 Md$ | idem |
| Nouvelles entreprises d'IA financées | 1 953 | 161 | 84 | idem |
| Robots industriels installés | 38 400 | **354 000** | **4 474** (en baisse) | IFR 2026 |
| Meilleur modèle d'IA (indice Epoch) | 169 | 158 | 150 (≈ 14 mois de retard) | [recherche-ia-robotique.md](../../sources/recherche-ia-robotique.md) |

- Les seuls investissements des quatre grands groupes du cloud américains (376 Md$ en 2025, ≈ 735 Md$ annoncés pour 2026) représentent **≈ 85 fois** ce qui a été levé par l'IA française en 2025.
- Les États-Unis et la Chine ne gagnent pas de la même façon : **l'Amérique par le capital privé**, **la Chine par l'État** (fonds d'orientation, « Big Fund » des puces de 344 Md CNY, fonds national de capital-risque : 100 Md CNY d'apport budgétaire, 138 Md$ étant l'effet de levier visé, V6552) **et par l'usine** (59 % des robots industriels installés dans le monde).
- La France a des points forts réels : **Mistral** (3 Md€ levés en septembre 2026 à 21 Md€ de valorisation, ≈ 300 M€ de revenus récurrents revendiqués en 2025 ⚠️), **Exotec** (robotique logistique, ≈ 2 Md$ de valorisation en 2022), **Wandercraft** (75 M$ en 2025, Renault actionnaire). Et des échecs : **Aldebaran** liquidée (2025), **Naïo** reprise pour 170 000 €, **Pollen Robotics** rachetée par une société de droit américain, **H Company** (220 M$ d'amorçage, 3 cofondateurs sur 5 partis).

## 2. Combien investir, et sur quelle durée (10 ans, argent public ou du fonds)

| Scénario | Public par an | Public sur 10 ans | % du PIB/an | Privé entraîné | Total |
|---|---|---|---|---|---|
| **Rester spectateur** | 0,7 Md€ | 7 Md€ | 0,02 % | — | 7 Md€ |
| **Rattrapage ciblé** | **7,6 Md€** | **76 Md€** | **0,26 %** | 31 Md€ | 107 Md€ |
| **Ambition de leadership** | **30 Md€** | **298 Md€** | **1,0 %** | 135 Md€ | 433 Md€ |

Répartition du rattrapage ciblé : calcul 22,5 Md€ (1 GW à moitié public), participations 20, formation 11,6, matériel (puces, projets européens) 10, recherche 10, aides au déploiement de robots 2, usines 0,1.

**Trois choses à retenir.**
1. **Le calcul est le poste le plus lourd.** 1 GW de centres de données d'IA coûte ≈ 45 Md€ sur 10 ans, parce que les serveurs (56 % du coût initial) doivent être rachetés au bout de 5 ans (Epoch AI). Et ces serveurs sont achetés à Nvidia : **une grande partie de l'argent du « calcul souverain » part aux États-Unis et à Taïwan**.
2. **Les usines de robots coûtent peu, les clients manquent.** Même une capacité de 200 000 robots par an coûterait de l'ordre de 2 Md€ (hypothèse sans source primaire ⚠️). Ce qui est cher et incertain, c'est la R&D et la demande : Agility a une usine de 10 000 robots par an et 1,8 M$ de chiffre d'affaires ; UBTech vise 10 000 et en a vendu 921 au premier semestre 2026.
3. **Même le leadership reste petit face aux États-Unis.** 30 Md€ publics par an, c'est 1 % du PIB français mais **12 % de l'investissement privé américain de la seule année 2025**. « Rattraper » les États-Unis en IA générale n'est pas à la portée d'un pays seul ; c'est une question européenne (InvestAI : 200 Md€ annoncés, dont ≈ 150 de promesses privées ⚠️).

## 3. Emplois créés : peu, et très qualifiés

| Scénario | Emplois directs en régime | dont centres de données | Ingénieurs requis | Ingénieurs formés en plus par an |
|---|---|---|---|---|
| Spectateur | ≈ 3 000 | 0 | ≈ 2 000 | 0 |
| Ciblé | **≈ 15 000** | 250 | ≈ 10 000 | 15 000 |
| Leadership | **≈ 64 000** | 1 250 | ≈ 37 000 | 30 000 |

- **Un centre de données de 1 GW, c'est ≈ 250 emplois d'exploitation** (0,2-0,3 par MW). L'IA et la robotique sont des industries de capital, pas d'emploi. Ce n'est pas un argument contre (la thèse du livre est justement que la technique fera le travail), mais **ce n'est pas un plan d'emploi** : à 76 Md€ pour 15 000 emplois directs, chaque emploi coûte ≈ 5 M€. Les emplois indirects et ceux que l'automatisation supprime ne sont pas comptés.
- **Les jeunes ingénieurs ne sont pas le goulot.** La France en diplôme 47 700 par an (2023) ; le besoin supplémentaire estimé va de 10 000 à 28 000 par an selon les organisations (UIMM, Syntec, Institut Montaigne). Le vrai goulot, ce sont **quelques milliers de chercheurs et d'ingénieurs seniors de rang mondial**, que les laboratoires américains paient plusieurs fois plus. Et le vivier se rétrécit : écoles d'ingénieurs remplies à 73 % en 2025 ⚠️, baisse du niveau en mathématiques.

## 4. Le financement : l'héritage en parts ne suffit pas, et ce n'est pas du cash

Chaque année, l'héritage d'entreprise payé à 50 % en parts apporterait au fonds **5 à 25 Md€ de parts** (central : ≈ 14 Md€), après la fuite estimée par le modèle T5. En 10 ans, le fonds détiendrait **≈ 120 Md€** (44 à 209) de parts d'entreprises françaises.

Mais ce sont **des parts de PME et d'ETI familiales, pas de l'argent**. Pour investir dans des GPU, il faut du cash : seuls les dividendes (3 %/an supposés) et des cessions progressives (3 %/an) en donnent.

| Scénario (financement central) | Couvert par le fonds | Reste à emprunter | Charge d'intérêts en année 10 |
|---|---|---|---|
| Ciblé | **55 %** (42 Md€) | 34 Md€ | ≈ 1,1 Md€/an |
| Leadership | **14 %** | **257 Md€** (≈ 9 points de PIB) | ≈ 8,5 Md€/an |

- Sans aucune cession (dividendes seuls), le fonds ne couvre que 30 % du rattrapage ciblé ; en cédant 10 % du stock par an, 81 %. **Le levier n'est pas le taux de l'héritage, c'est la liquidité des parts.** Un fonds qui revend chaque année les parts reçues devient un impôt en cash différé ; un fonds qui les garde devient un actionnaire minoritaire de milliers d'entreprises familiales, ce qui est un autre projet.
- Le scénario de leadership repose à 75-95 % sur l'**emprunt d'investissement**. Il n'est soutenable que si les participations rapportent : à +7 %/an, le portefeuille investi vaut ≈ 268 Md€ au bout de 10 ans ; à 0 %, 194 ; à −10 %/an (éclatement d'une bulle), 126, pour une dette de 257 Md€.
- **Contrainte juridique** : pour rester compatible avec les règles européennes d'aides d'État, le fonds doit investir comme un investisseur privé avisé (participations aux conditions du marché) ou via des projets européens (PIIEC, gigafactories d'IA). C'est cohérent avec « gérées comme des entreprises privées ». Une prise de participation rentable ne creuse pas le déficit, mais augmente la dette brute ⚠️.

## 5. Ce que la France peut viser de façon réaliste

| Niche | Atout | Limite | Verdict |
|---|---|---|---|
| **Calcul bas carbone** | 92 TWh d'exportations nettes d'électricité en 2025, 95 % de production bas carbone (RTE). 5 GW (≈ 31 TWh) tiennent dans ce surplus | Les 18 GW de demandes de raccordement (≈ 112 TWh) le dépasseraient ; serveurs importés ; ≈ 250 emplois par GW | **Atout le plus solide**, à condition de posséder une partie des centres et pas seulement de les héberger |
| **Modèles d'IA** (Mistral, Kyutai, H) | Chercheurs reconnus ; Mistral à 21 Md€ ; ASML et Samsung actionnaires | ≈ 14 mois de retard sur la frontière ; des modèles ouverts presque gratuits | Viser des modèles ouverts, efficaces, souverains pour l'État et l'industrie, pas la frontière mondiale |
| **Matériel avec l'Europe** | ASML (lithographie, actionnaire de Mistral) ; Chips Act | La Cour des comptes européenne juge l'objectif de 20 % du marché mondial « très improbable » (11,7 % prévus en 2030) | Se battre en Européen sur des maillons (équipements, puces spécialisées), pas sur toute la chaîne |
| **Robotique de service et logistique** | Exotec ; le transport-logistique représente 47 % des robots de service vendus dans le monde (IFR 2025) | Concurrence chinoise ; capital de croissance européen limité | **Niche réaliste** |
| **Exosquelettes et humanoïdes industriels** | Wandercraft + Renault | Pas de volume avéré ; plus de 150 constructeurs chinois, une bulle reconnue par la NDRC | Niche de pointe, pas filière de masse |
| **Robotique agricole** | Grande agriculture, viticulture | Naïo reprise pour 170 000 € ; prudence des agriculteurs | À aider côté demande (déploiement), sans illusion de champion |

## 6. Ce qui appuie, nuance ou contredit la thèse de l'auteur

**Appuie**
- **Le capital public dans la tech n'a rien d'exotique.** La Chine finance l'IA par des fonds publics d'orientation (≈ 184 Md$ vers l'IA de 2000 à 2023) ; les États-Unis ont pris ≈ 10 % d'Intel en 2025 en convertissant des subventions en actions ; la Corée lance un fonds de 150 000 Md KRW ⚠️ ; la France est déjà actionnaire de Mistral et de Wandercraft via Bpifrance. La proposition de l'auteur est une **différence de degré**, pas de nature.
- **Le marché seul laisse la France spectatrice** : à 0,7 Md€ public par an, les centres de données français seront surtout construits et possédés par des fonds étrangers (Émirats, Canada, États-Unis), et la valeur de l'IA sera captée ailleurs.
- **L'énergie nucléaire est un vrai avantage comparatif**, mesuré (RTE), pas un slogan.

**Nuance**
- **« L'IA est le nouveau pétrole » est à moitié vrai.** Le pétrole norvégien était sous le sol norvégien : la rente revenait à l'État par la propriété de la ressource. L'IA, elle, devient une commodité (prix ÷ 10 à ÷ 50 par an à capacité égale) ; sa rente va aux propriétaires des puces, de l'énergie et des plateformes. Un fonds français n'en touche les dividendes que s'il **possède** ces actifs, ou s'il **taxe** la valeur produite en France (chapitre 14 bis). Le fonds norvégien vaut ≈ 21 300 Md NOK (≈ 1 800 Md€ ⚠️) parce qu'il a reçu 30 ans de rente ; l'héritage en parts n'apporte, en régime central, que ≈ 14 Md€ de parts par an.
- **L'héritage payé en parts finance un fonds d'entreprises familiales françaises, pas l'IA.** Il faut le transformer en cash (cessions) ou l'utiliser comme garantie d'emprunt. Le fonds devient alors un gestionnaire d'actifs, avec les risques de gouvernance que l'auteur veut éviter par les garde-fous qu'il prévoit pour le capital commun.
- **Peu d'emplois** : l'argument « on crée des emplois » ne porte pas ; l'argument « on possède le capital qui fera le travail » porte.

**Contredit**
- **Rattraper les États-Unis en IA générale n'est pas réaliste pour la France seule** : même 1 % du PIB par an pendant 10 ans représente 12 % de l'investissement privé américain d'une seule année. Ce qui est réaliste, ce sont des niches et une stratégie européenne.
- **L'État chinois n'est pas un modèle infaillible** : son propre planificateur (NDRC) met en garde contre une bulle des humanoïdes (plus de 150 constructeurs) ; l'Europe a déjà raté ses objectifs de puces (Cour des comptes européenne). Les échecs français (Aldebaran, Naïo, H) montrent qu'un pari concentré peut se perdre.
- **Le scénario de leadership est surtout financé par la dette** (≈ 257 Md€ en 10 ans), en contradiction avec l'objectif d'équilibre budgétaire de l'auteur, sauf rendement élevé et durable des participations, ce qu'aucune donnée ne garantit.

**Formulation honnête proposée pour le chapitre 14** : « La France ne rattrapera pas seule les États-Unis. Elle peut, pour 0,3 % de son PIB par an pendant dix ans, posséder une part du calcul bas carbone qu'elle est la mieux placée en Europe pour produire, et devenir actionnaire de ses meilleures entreprises d'IA et de robotique. Ce n'est pas le pétrole norvégien : c'est un pari d'investisseur, qui peut perdre, et qui ne vaut que s'il est fait à l'échelle européenne. »
