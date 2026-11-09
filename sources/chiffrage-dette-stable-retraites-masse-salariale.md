---
titre: Stabiliser la dette au lieu de la rembourser ; leviers retraites et masse salariale publique (arbitrage 40)
statut: brouillon
date: 2026-11-05
---

# Chiffrage : dette stabilisée, retraites, masse salariale publique (arbitrage 40)

**Demande de l'auteur (05/11/2026, arbitrage 40).** Le système taxe trop. La dette doit être **stabilisée**, pas remboursée à marche forcée : elle ne doit simplement pas grossir (rappel de l'arbitrage 23). Deux leviers de baisse des prélèvements : **les retraites**, à baisser un peu (au motif que le patrimoine est surtout détenu par les retraités), et **la masse salariale publique**. La **défense** est exclue de toute économie.

**Ce que fait ce dossier.** Il chiffre la variante sur la **v5.10 adoptée** (`decisions_0511j.js`, `resultats-optimum.txt` § 29) sans la modifier, ni le bilan adopté, ni les chapitres. Code : [`modeles/systeme-ideal/variante_dette_stable.js`](../modeles/systeme-ideal/variante_dette_stable.js) ; test : `test_variante_dette_stable.js` (94 vérifications, jsc ; tous les tests antérieurs passent). Le module est **paramétrable** : les leviers sont des fonctions (scénario, année) → Md€, et la cible de dette prend n'importe quel effet net annuel (`o.net`) et n'importe quelle fonction de taux (`o.taux`). On peut donc le rebrancher sur la v6 (`bareme_unique_v6.js`).

Légende : **fait** (source lue) · **estimation** (méthode donnée) · **hypothèse** (de Claude, numérotée HDS) · ⚠️ non confirmé (registre V14900 à V14912 de `verifications.md`). Sources consultées le **05/11/2026**. Euros de 2025. Des ordres de grandeur, jamais des prédictions. Scénarios du modèle : bas = favorable, haut = défavorable.

**Recadrage à signaler (arbitrage 41, 05/11).** Après cette commande, l'auteur a recadré : *plan A* neutre en recettes, et stabiliser la dette **par les économies** (pas par des recettes nouvelles). Ce dossier reste calé sur la v5.10, comme demandé. Mais deux des quatre leviers retraites (contribution relevée, alignement de la CSG) sont des **prélèvements**, pas des économies. Sous l'arbitrage 41, seuls la sous-indexation des pensions et les leviers sur la masse salariale comptent comme économies.

## 0. L'essentiel

1. **La v5.10 ne stabilise pas la dette, elle la rembourse vite.** Elle passe de 123,5 % du PIB fin 2028 à 101,9 / 75,4 / 44,4 % à 10, 20 et 30 ans. L'auteur a raison sur ce point.
2. **Stabiliser strictement libère beaucoup : environ 5 à 6 points de taux.** Un taux de base constant de **37,0 %** dès 2029, au lieu de 43 % jusqu'en 2044 puis 42 %, garde la dette sous son niveau de 2028 chaque année pendant 30 ans. Cela représente −68,5 Md€ de prélèvement unique par an par rapport à 43 %, et −57,8 par rapport à 42 %.
3. **Mais la stabilisation stricte est incompatible avec les règles européennes, et fragile.**
   - Il faudrait un déficit de 3,4 à 3,7 % du PIB de 2029 à 2041 (plafond : 3 %).
   - La dette ne baisserait pas d'un point par an alors qu'elle dépasse 90 % (règlement 2024/1263, art. 7).
   - Un point de taux d'intérêt de plus coûte environ 39 Md€ par an au bout de 10 ans, soit environ 3,3 points de taux de prélèvement.
   - La stabilisation consomme aussi la création de valeur que le modèle compte dans la dette (≈ 30 Md€ par an à 10 ans au central). Sans elle, il faudrait 38,7 %.
4. **Le seuil européen est 39,5 %** (sans levier). C'est le taux constant le plus bas qui respecte en même temps : déficit ≤ 3 %, baisse d'au moins 1 point par an sur 7 ans, dette encore en baisse les 10 années suivantes. Avec ce taux, la dette baisse lentement (113,8 / 98,8 / 77,9 %) au lieu de plonger.
5. **Les retraites rapportent peu tant qu'on protège les petites et moyennes pensions.** Sous 2 500 € nets, soit 82 % des retraités, personne ne perd. Les options rapportent de 0,3 à 3,9 Md€ par an. Les ménages retraités paient déjà environ 30,7 Md€ de taxe de 1 % (21,4 Md€ nets de leur ancienne taxe foncière). Le patrimoine est donc déjà mis à contribution. Et la prémisse est fausse au sens strict : les ménages de 60 ans et plus détiennent environ 48 % du patrimoine brut, les ménages retraités environ 35 % (estimation ⚠️ V14903).
6. **La masse salariale rapporte plus.** Non-remplacement d'un départ à la retraite sur quatre, hors régalien, soins et éducation : 7,0 Md€ en régime au central. Point d'indice indexé sur les prix moins 0,5 point pendant 4 ans : 3,8 Md€.
7. **Recommandation : un taux de base de 39 % dès 2029**, au lieu de 43 % puis 42 %.
   - Leviers : sous-indexation temporaire (6 ans) des pensions au-dessus de 2 500 €, contribution des hautes pensions à 25 %, non-remplacement d'un départ sur quatre, modération du point d'indice. Ensemble : 14,5 Md€ en 2040.
   - Conforme aux règles européennes (taux minimal conforme : 38,65 % ; 39 % garde une marge de 0,35 point, ≈ 4 Md€).
   - Dette au central : 112,1 / 94,0 / 70,0 %.
   - Prélèvements obligatoires : 51,5 % du PIB, contre 52,6 % en v5.10 et 42,7 % aujourd'hui.
   - Tous les ménages types modestes gagnent par rapport à la v5.10 (de +45 à +159 €/mois).
8. **Le système taxe encore beaucoup plus qu'aujourd'hui** : même à 39 %, les prélèvements obligatoires restent de 8,8 points au-dessus de 2024 (5,4 points en lecture nette des transferts). La stabilisation corrige l'excès de remboursement ; elle ne ramène pas les prélèvements au niveau actuel. Pour cela, il faut l'architecture neutre en recettes de l'arbitrage 41 (v6).

## 1. Le déficit qui stabilise la dette

**Formule** (estimation, comptabilité de la dette). Notons d la dette en part du PIB et g la croissance nominale. La dette est stable si le déficit total, intérêts compris, vaut d × g / (1 + g). Avec un taux apparent r, le solde primaire requis vaut d × (r − g) / (1 + g) : il faut un excédent si r > g. Le module reprend la récurrence de dette du modèle (`decisions_0511g.js`) : dette Maastricht fin 2025 (115,7 %), trois années au droit actuel (2026-2028, déficit de 2024 conservé), taux moyen qui converge vers l'OAT au rythme du renouvellement (durée 8 ans).

| macro (HDS1) | g nominal | OAT | dette fin 2028 | déficit stabilisant | en Md€ de 2025 | solde primaire requis | intérêts de long terme |
|---|---|---|---|---|---|---|---|
| référence (modèle) | 3,0 % | 3,45 % | 123,5 % | **3,6 % du PIB** | 108 | +0,5 % | 4,1 % du PIB |
| prudente | 2,5 % | 3,95 % | 125,6 % | 3,1 % | 92 | +1,8 % | 4,8 % |
| favorable | 3,5 % | 3,0 % | 121,5 % | 4,1 % | 123 | −0,6 % | 3,5 % |

**Paramètres et sources.**
- **Fait** : PLF 2027 (avis du HCFP n° 2026-5, 25/09/2026, [PDF](http://www.hcfp.fr/sites/default/files/2026-10/Avis%20HCFP%202026-5%20-%20PLF-PLFSS%202027.pdf)) :
  - déficit de 5,4 % du PIB en 2026 et de 5,0 % en 2027 (§ 92, p. 29) ;
  - dette de 119,3 % puis 121,7 % (§ 113, p. 37) ;
  - croissance réelle de 1,0 % en 2027, jugée « optimiste », et inflation de 1,8 % (p. 2) ;
  - charge d'intérêts de 79,2 Md€ en 2026 et de 91 Md€ en 2027, soit 2,9 % du PIB (§ 115, p. 38).

  Le modèle (123,5 % fin 2028) est cohérent avec ce point de départ.
- **Fait** : rapport d'avancement annuel 2026 ([Trésor, PDF](https://www.tresor.economie.gouv.fr/Articles/b16f3103-ed47-4c37-9362-11ff01e12ae5/files/1d29351b-0187-4837-a3cd-e4ea7b0e4ce1), tableau 2, p. 20) : croissance potentielle de 1,2 % (2027-2028) puis de 1,0 % (2029) ; inflation de 1,6 à 1,75 %. La référence du modèle (1,2 réel + 1,8 inflation) est donc dans le haut de la fourchette ; la macro prudente (≈ 0,9 + 1,6) est plus proche du programme officiel.
- **Hypothèse HDS1** : OAT à 3,45 % (référence du modèle, début 2026) ; à 3,95 % en macro prudente. L'adjudication du 03/09/2026 se faisait à 4,23 % (presse, déjà V9806) : la macro prudente n'est pas pessimiste.
- **Cour des comptes**, *Situation et perspectives des finances publiques* (juin 2026) : rapport non lu (PDF introuvable) ; la presse rapporte une alerte sur une dette de 118,5 % en 2026 (⚠️ V14908).

## 2. Combien le taux de base peut baisser

### 2.1 Taux constant dès 2029 (v5.10 sans levier)

| contrainte (central) | taux | par rapport à 43 % | par rapport à 42 % | prélèvement unique en moins (vs 42 %) |
|---|---|---|---|---|
| dette au plus au niveau de 2028 à **10 ans** | 36,9 % | −6,1 pts | −5,1 pts | ≈ 59 Md€ |
| à **20 ans** (horizon seul) | 36,3 % | −6,7 | −5,7 | ≈ 65 |
| à **30 ans** (horizon seul) | 35,7 % | −7,3 | −6,3 | ≈ 72 |
| **aucune année** au-dessus du niveau de 2028 (sur 20 ou 30 ans) | **37,0 %** | −6,0 | −5,0 | 57,8 (68,5 vs 43 %) |
| idem, sans création de valeur dans la dette | 38,7 % | −4,3 | −3,3 | ≈ 37 |
| idem, macro prudente | 39,7 % | −3,3 | −2,3 | ≈ 26 |
| idem, macro favorable | 34,6 % | −8,4 | −7,4 | ≈ 85 |
| **conforme aux règles européennes** (§ 3.2) | **39,5 %** | −3,5 | −2,5 | 28,0 (38,6 vs 43 %) |

Un point de taux vaut 11,9 Md€ de solde vers 37 %, 11,3 vers 39 % et 10,2 vers 42 % (réactions de comportement comprises ; `mdParPoint`). La baisse mécanique du prélèvement unique est plus forte que l'effet sur le solde (décisions_0511i.js, `prelevementUnique`).

**Pourquoi « aucune année » coûte plus que « à l'horizon ».** Le creux des retraites (2030-2050) fait monter la dette dans les années 2030. Un taux qui la ramène au niveau de 2028 en 2058 la laisse dépasser ce niveau entre-temps. La contrainte qui lie est vers 2035-2040.

### 2.2 Nouvelle trajectoire de taux (remplace 43 % de 2029 à 2044)

| plan | 2029-2044 | après 2044 | dette 10 / 20 / 30 ans (central) | règles UE |
|---|---|---|---|---|
| v5.10 adoptée | 43 % | 42 % | 101,9 / 75,4 / 44,4 % | conforme |
| stabilité stricte, taux constant | 37,0 % | 37,0 % | 123,2 / 118,1 / 107,8 % | **non** (déficit > 3 % de 2029 à 2041) |
| stabilité stricte, deux paliers (même forme que la v5.10) | 37,0 % | 36,0 % | 123,2 / 119,7 / 113,5 % | **non** |
| conforme UE, sans levier | 39,5 % | 39,5 % | 113,8 / 98,8 / 77,9 % | oui |
| **recommandé : 39 % + leviers (§ 6)** | **39 %** | **39 %** | **112,1 / 94,0 / 70,0 %** | **oui** |

**Dette du plan recommandé selon les hypothèses** (dette / PIB à 10, 20 et 30 ans) :

| | comportements favorables (bas) | central | comportements défavorables (haut) |
|---|---|---|---|
| macro de référence | 60,7 / −25,5 / −128,9 % | **112,1 / 94,0 / 70,0 %** | 171,0 / 224,4 / 278,6 % |
| macro prudente | 71,1 / −11,4 / −119,9 % | 124,3 / 118,1 / 106,2 % (déficit de 3,0 % à 10 ans) | 185,4 / 259,9 / 344,8 % |
| macro favorable | 51,8 / −35,9 / −132,4 % | 101,5 / 75,0 / 44,5 % | 158,3 / 195,7 / 229,2 % |
| OAT +1 point | 67,7 / −15,4 / −124,4 % | 120,6 / 113,4 / 100,6 % | 181,4 / 254,3 / 337,8 % |

**Lecture, sans complaisance.**
- L'écart entre comportements favorables et défavorables écrase tout le reste. Il vient du système lui-même (solde de croisière de +229,7 à −198,4 Md€ en v5.10), pas de la stabilisation.
- Au défavorable, **aucun taux jusqu'à 55 % ne stabilise la dette**. La v5.10 y monte déjà à 168 % en 10 ans.
- Les valeurs négatives du favorable sont mécaniques (l'État deviendrait créancier net) ; ce n'est pas un scénario crédible.
- La macro prudente suffit à mettre le plan recommandé à la limite : dette stable mais pas en baisse, déficit de 3,0 %. La marge de ±2 points de taux votée chaque année sur avis du HCFP (plan de bascule, R3) reste indispensable.

## 3. Risques

### 3.1 Taux d'intérêt
- **Estimation (module)** : un point d'OAT de plus, permanent dès 2029, coûte +38,6 Md€ d'intérêts par an au bout de 10 ans (Md€ de 2025), soit environ **3,3 points de taux de base**.
  - À 37 %, la dette passerait de 107,9 % à **143,8 %** à 30 ans.
  - Le taux de stabilité stricte remonte de 37,0 % à 39,2 %.
  - La v5.10 encaisse le même choc en restant conforme (110,1 % à 10 ans) : rembourser vite, c'est aussi se protéger contre les taux.
- **Fait** : le gouvernement estime qu'une hausse permanente de 1 point au 1er janvier 2027 coûte +3,4 Md€ la première année et +8,1 Md€ la deuxième, « et s'amplifierait pendant de nombreuses années » (avis HCFP 2026-5, § 116, p. 39). Le HCFP juge l'hypothèse de taux 2026-2027 « trop optimiste ».
- La première année du modèle (≈ 4,9 Md€) est un peu plus forte que celle de l'État : renouvellement uniforme sur 8 ans contre un calendrier réel des tombées (⚠️ V14909).
- **Avec une dette stable à 123 %, chaque point de taux pèse en permanence 1,2 point de PIB d'intérêts.** Avec une dette à 70 %, il n'en pèse plus que 0,7.

### 3.2 Règles budgétaires européennes
**Faits** :
- Règlement (UE) 2024/1263 ([EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1263/oj) ; texte lu dans une copie tierce, [LawPlayer](https://lawplayer.com/eu/article/32024R1263/art_7), ⚠️ V14900) :
  - art. 7 : la dette doit baisser en moyenne d'au moins **1 point de PIB par an tant qu'elle dépasse 90 %**, de 0,5 point entre 60 et 90 % ;
  - art. 8 : marge de résilience de **1,5 % du PIB** sous la valeur de référence de 3 %, avec une amélioration du solde primaire structurel de 0,4 point par an (0,25 si la période d'ajustement est prolongée) ;
  - art. 2, point 2 : les **dépenses nettes** s'entendent hors intérêts, hors mesures discrétionnaires de recettes, hors programmes de l'UE et leur cofinancement, hors partie cyclique du chômage, hors mesures ponctuelles.
- La France est en **procédure pour déficit excessif depuis le 26/07/2024**. La recommandation du Conseil du 21/01/2025 demande un déficit sous 3 % en 2029, avec une période d'ajustement de 4 à 7 ans (RAA 2026, p. 24).
- La clause nationale « défense » (jusqu'à 1,5 % du PIB par an pendant 4 ans) a été activée en juillet 2025 pour une quinzaine d'États, **sans la France**, qui est en procédure (Euronews, 08/07/2025 ; ⚠️ V14901).

**Réponse franche à la question posée** : **non, la stabilisation stricte n'est pas compatible.**
- Elle maintient un déficit au-dessus de 3 % pendant 13 ans.
- La dette ne baisse pas de 1 point par an.
- Avec une dette à 123 %, le cadre de 2024 exige une dette « plausiblement décroissante ».

La version compatible la moins coûteuse est le taux de 39,5 % (38,65 % avec les leviers). Elle fait baisser la dette d'environ 1,1 à 1,6 point par an. Une stabilisation stricte supposerait de sortir du cadre ou de le renégocier ; c'est un choix politique à assumer, pas un détail technique.

**La règle des dépenses nettes, frein supplémentaire** (estimation, non modélisée année par année ⚠️ V14902). Une baisse de taux est une mesure discrétionnaire de recettes. Dans le cadre européen, elle doit être compensée par une baisse de la trajectoire de dépenses nettes. Le compte de contrôle enregistre les écarts. Le plafond de croissance des dépenses nettes recommandé pour la France est de 0,8 % en 2025 et de 1,2 % en 2026 (RAA 2026, tableau 4, p. 25), et le HCFP note un dépassement de 0,2 point en 2026 (avis 2026-5, § 109-112). Concrètement : une baisse de taux de 3 à 4 points en 2029, non compensée par une baisse de la dépense, serait lue comme un relâchement, même si la v5.10 était en excédent avant la baisse. Les leviers de dépense (masse salariale, pensions) sont précisément ceux que la règle reconnaît.

### 3.3 La création de valeur
La trajectoire de dette du modèle compte une création de valeur (palier1.js : 29,7 Md€ par an à 10 ans au central, plafonnée ensuite). Le solde annuel, lui, ne la compte pas. Stabiliser la dette revient à **rendre aux contribuables une recette qui n'est pas encore démontrée**. Sans elle, le taux stable strict est de 38,7 % (37,7 % avec les leviers).

## 4. Levier retraites : « baisser un peu »

### 4.1 Ce qui existe déjà (pour ne pas compter deux fois)
- **Voie R (retraités sanctuarisés)** : pensions, minimum vieillesse et impôt des retraités inchangés (CSG de 8,3 %, abattement de 10 %, barème) ; le socle n'est pas versé aux retraités (`modele.js`, H84-H93).
- **N03** : contribution de 20 % au-dessus de 2 500 € nets par mois, sur la pension et les revenus du capital (base « totale »). Elle rapporte 11,97 Md€ au central (13,45 au favorable, 10,35 au défavorable ; `retraites2.js`, H108) et touche 29,9 % des retraités (17,8 % par leur seule pension).
- **Dispositif V6** (`age_libre.js`) : il sous-indexe déjà de 0,5 point par an, en permanence, la part des pensions au-dessus de 2 000 € bruts (≈ 1 850 € nets) au central. **Cette ligne touche déjà une partie des « moyennes pensions » au sens de l'arbitrage 10** : tension à signaler, que ce dossier ne tranche pas.
- **Taxe de 1 % sur le patrimoine** : ≈ 30,7 Md€ payés par les ménages retraités (part de 35,5 % du patrimoine brut ; fourchette 30 à 40 %), dont 21,4 Md€ nets de la taxe foncière qu'ils payaient. Cela fait ≈ 3 100 € par ménage retraité et par an (estimation ⚠️ V14903).
- **Premisse de l'auteur** (fait + estimation) : les ménages dont la personne de référence a 60 ans ou plus détiennent ≈ **48 %** du patrimoine brut. Le calcul utilise les moyennes de l'enquête Histoire de vie et Patrimoine 2023-2024 ([Insee](https://www.insee.fr/fr/statistiques/8736842) : 462 500 € pour les 60-69 ans, 420 300 € pour les 70 ans et plus, 374 900 € pour l'ensemble), pondérées par une part des ménages supposée (16,5 % et 24,5 %, ⚠️ V14903). Les ménages retraités en détiennent ≈ 35 %. Les 50-79 ans détiennent 61 % de la masse (Insee Focus n° 371). « Majoritairement chez les retraités » est donc à corriger en « pour moitié chez les plus de 60 ans ». Le patrimoine des retraités est aussi **moins concentré** que celui des actifs : les 10 % les mieux dotés en détiennent 42 %, contre 51 % chez les actifs (COR, séance du 5/02/2026, doc. 6).

### 4.2 Options chiffrées
Seuil commun : **2 500 € nets par mois (82 % des retraités au-dessous, aucun perdant sans capital sous le seuil)**. Rendement en Md€ par an (+ améliore le solde) ; perte en €/mois par retraité du décile.

| option | rendement (fav. / central / déf.) | profil dans le temps | qui est touché | décile 9 / décile 10 de pension | décile 10 de patrimoine | perte au 10e décile, en part de la pension |
|---|---|---|---|---|---|---|
| **R1m** : prix −1 point pendant 3 ans (2029-2031) sur la part au-dessus de 2 500 € | 0,47 au pic (2031), 0,33 en 2040, 0,14 en 2060 | s'éteint avec les décès (4 %/an, HDS8) | 17,8 % | −2,5 / −22,1 | −9,2 | 0,5 % |
| **R1f** : idem pendant 6 ans (2029-2034) | 0,87 au pic (2034), 0,68 en 2040, 0,30 en 2060 | idem | 17,8 % | −5,0 / −43,5 | −18,1 | 1,1 % |
| **R2m** : N03 à 25 % au lieu de 20 % | 3,36 / **2,99** / 2,59 | permanent | 29,9 % (avec le capital) | −39,9 / −130,4 | −93,7 | 3,2 % |
| **R2f** : 25 % jusqu'à 4 000 €, puis 30 % | 4,39 / 3,90 / 3,37 | permanent | 29,9 % | −39,9 / −185,9 | −134,3 | 4,6 % |
| **R3** : alignement sur les actifs au-dessus du seuil (CSG 9,2 % au lieu de 8,3 % ; abattement de 10 % limité à la part sous le seuil) | 0,97 / 0,92 / 0,85 | permanent | 17,8 % | −6,3 / −44,0 | −17,4 | 1,1 % |
| **R4** : majoration de 10 % sur la part du capital dans N03 | 3,42 / 2,85 / 2,28 | permanent | 29,9 % | −63,9 / −105,7 | −121,4 | 2,6 % |

Déciles de pension (pension nette moyenne en 2025) : 231, 726, 1 044, 1 291, 1 513, 1 724, 1 961, 2 234, 2 648 et 4 052 €. **Les déciles 1 à 7 ne perdent rien dans aucune option.** Le décile 8 n'est touché que par R2 et R4, par ses revenus du capital (pension + capital > 2 500 €).

Méthode des effets par décile de patrimoine : copule gaussienne pension × patrimoine (ρ = 0,499, central de `t47_pensions_patrimoine.py`, calé sur le COR doc. 6) ; patrimoine des ménages retraités log-normal (médiane 246 438 €, D9 909 902 €) ; revenus du capital proportionnels au patrimoine (HDS12). Les rendements viennent de `retraites2.js` pour R2 et R4 (même base que N03) ; les effets par décile de patrimoine sont des moyennes sur la grille.

**Lecture.**
1. **R1 est la seule vraie « baisse des retraites »**, donc la seule qui soit une économie au sens de l'arbitrage 41. Mais elle rapporte peu : la part des pensions au-dessus de 2 500 € nets ne pèse que 34,1 Md€ sur 345 Md€ de pensions nettes (fait, DREES : 359,7 Md€ de pensions de droit direct en 2024, [CPS 2025, fiche 05](https://drees.solidarites-sante.gouv.fr/sites/default/files/2026-03/CPS2025%20-%20Fiche%2005%20-%20Le%20risque%20vieillesse-survie.pdf)). Pour rapporter 5 Md€ par an, il faudrait descendre le seuil vers 1 800 € et donc toucher les pensions moyennes.
2. **R2 est le levier le plus rentable**, mais c'est un prélèvement.
3. **R3 est symbolique** (0,9 Md€) : l'abattement de 10 % est déjà plafonné à 4 439 € par foyer.
4. **R4 est déconseillé.** Un euro de revenu du capital d'un retraité au-dessus du seuil serait prélevé à 42 % (prélèvement unique) + 20 % (N03) + 10 % (R4) = 72 %. La taxe de 1 % représente en plus un tiers d'un rendement de 3 %. Total : environ **105 % du rendement** (`cumulCapital`). Ce serait confiscatoire, et la prise en compte du patrimoine est déjà faite par la taxe de 1 % : ce serait compter deux fois. Même R2 porte ce cumul à 100 % : c'est un argument pour réserver le relèvement à la seule part « pension » (variante non chiffrée ici, à faire si l'auteur retient R2).
5. **Retraités types** (combinaison R1f + R2m, en régime) : pension de 3 500 € sans capital : −80,5 €/mois ; 2 200 € avec 15 000 € de capital par an : −47,5 ; pension médiane de 1 750 € : 0 ; minimum de 800 € : 0.

Sources des options R3 : aucun chiffrage public de l'alignement de la CSG des retraités n'a été lu (une note de l'OFCE citée par la presse donne 1,2 Md€ pour un alignement complet, ⚠️ V14910). Le remplacement de l'abattement de 10 % par un forfait de 2 000 € a été proposé dans le PLFSS 2026 puis rejeté (presse syndicale, ⚠️ V14910).

## 5. Levier masse salariale publique (défense exclue)

### 5.1 Ce qui est déjà compté
- D20 : éducation, non-remplacement des 109 138 postes libérés par la baisse du nombre d'élèves (3,86 Md€).
- Gestion supprimée : départs non remplacés dans la gestion des impôts et prestations abolis (21 452 départs en 10 ans, `optimum.js`) ; ils sont retirés de M1 ci-dessous.
- D19 : effectifs et IA, −0,11 au central (l'outil coûte plus que le gain à 10 ans).
- H01 : État-plateforme, réserve de +2,12 non comptée, qui exige de recruter 20 000 à 45 000 ingénieurs.
- H04 : IA ambitieuse, effet central nul.

**Faits** :
- 5 876 700 agents fin 2024 (Insee Première n° 2094, repris de `economies-effectifs-publics-ia.md` ; déjà V20) ;
- rémunération des agents publics : 363,0 Md€ en 2024 et 370,0 Md€ en 2025 (Insee, comptes nationaux 3.201) ;
- point d'indice gelé depuis le 01/07/2023 (4,92278 €), gel prolongé en 2027 par le PLF (avis HCFP 2026-5, p. 2 et 28).

**Comparaison européenne** (fait, Eurostat `gov_10a_exp`, D.1, S13, 2024 provisoire, [API](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&unit=PC_GDP&sector=S13&na_item=D1&cofog99=TOTAL&time=2024), mise à jour du 21/10/2026). Rémunération des salariés publics en % du PIB :

| France | zone euro | UE-27 | Allemagne | Pays-Bas | Italie | Espagne | Suède | Danemark |
|---|---|---|---|---|---|---|---|---|
| **12,4** | 9,9 | 10,2 | 8,3 | 8,7 | 9,0 | 10,8 | 12,6 | 14,3 |

La France est **7e sur 27**. L'écart avec la zone euro est de 2,5 points de PIB (≈ 73 Md€). Une partie tient au périmètre (hôpitaux publics plutôt que privés non lucratifs, cotisations imputées des fonctionnaires) : ce n'est pas un gisement à 100 %.

### 5.2 Options chiffrées
Coût moyen d'un agent : 61 769 € (363,0 Md€ / 5,88 M), cotisations comprises. Une économie s'entend à service rendu réorganisé (État-plateforme, IA), en supposant que les personnes non recrutées travaillent ailleurs (le prélèvement sur leur salaire est alors perçu dans le privé).

| option | rendement en régime (fav. / central / déf.) | montée | effet sur les services publics | faisabilité |
|---|---|---|---|---|
| **M1m** : 1 départ sur 4 non remplacé pendant 10 ans, sur 2,95 M d'agents (hors défense, sécurité, justice, hospitalière, éducation nationale) | 9,1 / **7,0** / 4,5 | 1,4 en 2030, 4,9 en 2035, plein en 2038 | −163 000 postes nets (−5,5 % du périmètre) : soutenable seulement si l'État-plateforme et l'IA reprennent les tâches de guichet et de gestion | 69 % du périmètre est territorial : l'État ne peut qu'inciter (libre administration, art. 72 de la Constitution ; précédent des contrats de Cahors, 2018-2019) |
| **M1f** : 1 sur 2 | 19,3 / 15,0 / 9,7 | idem | −347 000 postes (−11,8 %) : précédent de la RGPP (2007-2012, 1 sur 2 à l'État), suivi d'une recentralisation des besoins et de dépenses de sous-traitance (⚠️ V14904) | difficile |
| **M2m** : point d'indice = prix − 0,5 point pendant 4 ans (2029-2032) | **3,8** (2,0 Md€ par point de 1 %, hors défense) | 1,9 en 2030, plein en 2032 | perte de pouvoir d'achat de 2 % ; attractivité déjà faible (enseignants, soignants) ; bas de grille protégé par le minimum de traitement aligné sur le Smic | décret simple |
| **M2f** : gel 2 ans (inflation de 1,8 %) | 6,7 | immédiat | −3,6 % de pouvoir d'achat après le gel de 2023 à 2027 : risque social élevé | décret simple, politiquement très coûteux |
| **M3** : 1 607 h effectives (≈ 27 000 ETP hors soins et défense, convertis en non-remplacement sur 5 ans) | 1,3 / 0,8 / 0,4 | 2034 | neutre si les heures remplacent des postes ; en partie redondant avec M1 (ne pas additionner les deux pleinement) | loi de 2019 déjà appliquée aux collectivités depuis 2022 ; dérogations restantes |

Sources des paramètres : coût d'un point de 1 % de point d'indice entre 1,85 et 2,07 Md€ selon la presse spécialisée (⚠️ V14905, source primaire DGAFP ou Cour des comptes à lire) ; 27 000 ETP et 0,7 Md€ attribués au rapport Laurent (2016) par la presse (⚠️ V14906) ; durée annuelle moyenne de 1 584 h dans la fonction publique contre 1 694 h dans le privé en 2013-2014 (Acteurs publics, ⚠️ V14906). Périmètre exclu (défense 270 000, sécurité intérieure 254 000, justice 92 000, éducation nationale 1 060 000) et taux de départ de 2,5 % par an : hypothèses HDS13-HDS14 (⚠️ V14904).

**Lecture.** La masse salariale est le seul levier qui rapporte vraiment sans toucher aux petites pensions. Mais elle pèse aussi sur la qualité des services publics si l'outil numérique n'est pas prêt. **Le non-remplacement doit suivre la livraison de l'État-plateforme, pas la précéder.** La modération du point est rapide et sûre budgétairement ; elle frappe 5,9 M d'agents, dont beaucoup de catégorie C. Mais dans la combinaison, un agent de catégorie C à 1,1 Smic gagne quand même : −31 €/mois de point, +74 €/mois de baisse de taux par rapport à 42 % (+96 par rapport à 43 %), soit +43 € net (approximation par le brut, ⚠️ V14911).

## 6. Combinaison recommandée

**Composition** : stabilisation conforme aux règles européennes, avec une marge, plus R1f + R2m (retraites, modéré) et M1m + M2m (masse salariale, modéré). Leviers : 14,5 Md€ en 2040 et 14,1 en 2060 (R1f 0,68 ; R2m 2,99 ; M1m 7,05 ; M2m 3,75).

| | v5.10 | dette stable stricte + leviers | conforme UE + leviers (minimum) | **recommandé** |
|---|---|---|---|---|
| taux de base | 43 % (2029-2044), puis 42 % | 36,2 % (35,2 % après 2044 en deux paliers) | 38,65 % | **39 %**, constant dès 2029 |
| dette à 10 / 20 / 30 ans (central) | 101,9 / 75,4 / 44,4 % | 123,0 / 116,5 / 104,7 % | 113,4 / 96,7 / 74,1 % | **112,1 / 94,0 / 70,0 %** |
| déficit de 2029 à 2041 | ≤ 3 % | 3,4 à 3,7 % | ≤ 3 % | 2,1 à 2,6 % |
| règles UE | conformes | **non conformes** | conformes | conformes |
| prélèvement unique en moins (vs 42 %) | — | 68,3 Md€ | 37,9 | **33,8** |
| PO bruts, % du PIB (2024 : 42,7 %) | 52,6 % | 50,3 % | 51,4 % | **51,5 %** |
| PO nets des transferts | 49,2 % | 47,0 % | 48,0 % | **48,1 %** |
| rang de la France dans l'UE (PO) | 1re | 1re | 1re | **1re** |

**Rang européen** (fait : Eurostat `gov_10a_taxag`, 2024, [API](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_taxag?format=JSON&lang=EN&unit=PC_GDP&sector=S13&time=2024), 28/10/2026). Aujourd'hui, la France est 2e avec 45,0 %, derrière le Danemark (45,4 %), devant la Belgique (44,6 %) et l'Autriche (43,2 %) ; UE-27 : 40,0 %. Au sens de l'Insee, 42,8 % ([Insee Première n° 2054](https://www.insee.fr/fr/statistiques/fichier/8574492/IP2054.pdf)). Le modèle mesure ses prélèvements au sens de l'Insee (42,7 % avant) : même à 48,1 % en lecture nette, la France passerait **1re de l'UE, à plus de 5 points du Danemark**, à pays inchangés (estimation : écart Eurostat - Insee d'environ 2,2 points ajouté, ⚠️ V14912). **Le constat de l'auteur (le système prélève trop) reste vrai après la stabilisation** : la stabilisation rend environ 3 à 4 points ; l'écart avec aujourd'hui (5,4 points nets) relève de l'architecture (arbitrage 41).

**Cas types** (écart au droit actuel, €/mois ; à 39 % avec la combinaison ; entre parenthèses, écart à la v5.10 à 43 % / à 42 %). **Aucun ménage modeste ne perd par rapport à la v5.10** :

| cas | à 39 % | par rapport à la v5.10 (43 % / 42 %) |
|---|---|---|
| couple à deux Smic, 2 enfants | +175,9 | +159,0 / +119,3 |
| couple à deux Smic sans enfant | +236,8 | +159,0 / +119,3 |
| parent isolé au Smic, 2 enfants | +162,2 | +79,5 / +59,6 |
| célibataire au Smic | +155,1 | +59,6 / +44,7 |
| couple médian (2 × 2 735 € brut) | +631,1 | +272,8 / +204,6 |
| cadre 5 000 € brut | +219,7 | +273,6 / +205,2 |
| cadre 10 000 € brut | −98,1 | +568,0 / +426,0 |
| cadre 20 000 € brut | −42,0 | +1 136 / +852 |
| retraité à 800 € / 1 750 € | 0 | 0 |
| retraité à 3 500 € sans capital | −80,5 | −80,5 |
| agent public de catégorie C (1,1 Smic) | — | +65 / +43 (point modéré compris) |

**Ce que la baisse de taux fait aussi, et qu'il faut dire.** En euros, la baisse profite plus aux hauts revenus : le cadre à 20 000 € regagne 852 €/mois par rapport à la v5.10, le smicard 45 €. C'est mécanique avec un taux proportionnel. Si l'auteur veut que la baisse profite d'abord aux modestes, il faut la faire porter sur la fonction progressive (v6) plutôt que sur le taux de base.

## 7. Hypothèses (HDS1 à HDS18)
- **HDS1** : macro de référence g = 3 %, OAT = 3,45 % (R3, R5 du modèle) ; prudente 2,5 % et 3,95 % ; favorable 3,5 % et 3,0 %.
- **HDS2** : choc de taux de +1 point permanent dès 2029, transmis au taux moyen par renouvellement sur 8 ans (R4).
- **HDS3** : solde du modèle à tout taux (`decisions_0511d.js`) ; résidu de la mesure de la v5.10 (bonus et reprise du socle) extrapolé linéairement hors de la grille 38-43 %.
- **HDS4** : plan à deux paliers de même forme que la v5.10 (+1 point jusqu'en 2044).
- **HDS5** : critères européens opérationnalisés : déficit ≤ 3 % chaque année de 2029 à 2058 ; baisse moyenne ≥ 1 point par an de 2029 à 2035 ; dette en baisse de 2035 à 2045. Les critères de résilience (1,5 % structurel) et de dépenses nettes ne sont pas modélisés année par année.
- **HDS6** : seuil des options retraites de 2 500 € nets par mois (celui de N03).
- **HDS7** : sous-indexation additionnelle au dispositif V6, appliquée au stock de pensions en cours de paiement.
- **HDS8** : extinction du stock touché au rythme de 4 % par an (décès).
- **HDS9** : barèmes de R2.
- **HDS10** : alignement de R3 sur la part au-dessus du seuil ; impôt d'un retraité seul.
- **HDS11** : majoration de R4 (option `majCapital` de `retraites2.js`).
- **HDS12** : parts de patrimoine (§ 4.1) ; copule de t47.
- **HDS13** : périmètre de M1.
- **HDS14** : départs à la retraite de 2,5 % par an.
- **HDS15** : départs déjà comptés retirés de M1.
- **HDS16** : réalisation de M1 de 90 / 70 / 45 %.
- **HDS17** : coût d'un point de 1 % de point d'indice : 2,0 Md€, défense retirée (5,5 %).
- **HDS18** : M3 = 27 000 ETP, réalisation de 80 / 50 / 25 %.

Les leviers retraites et masse salariale sont sans effet de comportement : pas d'exil des retraités aisés au-delà de la fuite de `retraites2.js`, pas d'effet de la modération salariale sur les recrutements. C'est une limite.

## 8. Synthèse des sources mobilisées
| source | institution, date | ce qu'elle établit ici |
|---|---|---|
| [Avis n° 2026-5 sur le PLF et le PLFSS 2027](http://www.hcfp.fr/sites/default/files/2026-10/Avis%20HCFP%202026-5%20-%20PLF-PLFSS%202027.pdf) | HCFP, 25/09/2026 | déficit 2026-2027, dette, croissance, intérêts, sensibilité de +1 point, crédibilité, gel du point en 2027 |
| [Rapport d'avancement annuel 2026](https://www.tresor.economie.gouv.fr/Articles/b16f3103-ed47-4c37-9362-11ff01e12ae5/files/1d29351b-0187-4837-a3cd-e4ea7b0e4ce1) | DG Trésor, avril 2026 | procédure pour déficit excessif (26/07/2024), recommandation du 21/01/2025, croissance potentielle, dépenses nettes |
| [Règlement (UE) 2024/1263](https://eur-lex.europa.eu/eli/reg/2024/1263/oj) (lu via LawPlayer) | UE, 29/04/2024 | sauvegardes de la dette (art. 7) et de la résilience (art. 8), définition des dépenses nettes (art. 2) |
| [Eurostat gov_10a_exp](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&unit=PC_GDP&sector=S13&na_item=D1&cofog99=TOTAL&time=2024) | Eurostat, 21/10/2026 | masse salariale publique en % du PIB, rang 7/27 |
| [Eurostat gov_10a_taxag](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_taxag?format=JSON&lang=EN&unit=PC_GDP&sector=S13&time=2024) | Eurostat, 28/10/2026 | prélèvements obligatoires 2024, France 2e (45,0 %) |
| [Insee Première n° 2054](https://www.insee.fr/fr/statistiques/fichier/8574492/IP2054.pdf) | Insee, mai 2025 | taux de prélèvements obligatoires 2024 : 42,8 % |
| [CPS 2025, fiche 05](https://drees.solidarites-sante.gouv.fr/sites/default/files/2026-03/CPS2025%20-%20Fiche%2005%20-%20Le%20risque%20vieillesse-survie.pdf) | DREES, mars 2026 | pensions de droit direct 2024 : 359,7 Md€ |
| [HVP 2023-2024](https://www.insee.fr/fr/statistiques/8736842) ; COR, doc. 6 du 5/02/2026 | Insee ; COR | patrimoine par âge, patrimoine des retraités moins concentré |
| Modules du dépôt : `decisions_0511j.js`, `risques/stress.js`, `retraites2.js`, `age_libre.js`, `t47_pensions_patrimoine.py`, `economies-effectifs-publics-ia.md` | dépôt | v5.10, récurrence de dette, distribution des pensions, N03, V6, copule, effectifs |

**État de la recherche (règle 9).**
- **Établi** : quand r > g, une dette stable exige un excédent primaire, d'autant plus grand que la dette est élevée (Blanchard, *Public Debt and Low Interest Rates*, AER 2019, ⚠️ non relu ici). Les gels du point d'indice réduisent la masse salariale à court terme (gels de 2011-2016 et de 2023-2027).
- **Débattu** : le niveau de dette « soutenable » (la Commission privilégie une analyse de soutenabilité plutôt qu'un seuil) ; l'effet des baisses d'impôt sur la croissance, qui pourrait financer une partie de la baisse ; l'effet du non-remplacement sur la qualité des services (évaluations de la RGPP contrastées).
- **Manque** : une source primaire sur le coût du point d'indice, le temps de travail effectif des agents (Cour des comptes), le patrimoine par âge pondéré par le nombre de ménages, et un chiffrage public de l'alignement de la CSG des retraités.
