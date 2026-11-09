---
titre: Capital commun et retraite : ce que disent les chiffres (résultats)
tache: chantier 10 de la boucle « meilleur système »
date: 2026-11-03
statut: brouillon
---

# Capital commun et retraite : résultats

Méthode : [`methode.md`](methode.md) · code : [`modele.js`](modele.js), [`test.js`](test.js) (22 contrôles verts), [`rapport.js`](rapport.js) · sortie brute : [`resultats-brut.txt`](resultats-brut.txt). Euros constants 2025, ordres de grandeur sous hypothèses, jamais des prédictions. Les ⚠️ renvoient à `verifications.md` (V7321 à V7332).

## Résumé en dix lignes

1. **Coût de la bascule.** Détourner 10 % des cotisations (≈ 3 points) vers un fonds public coûte **≈ 45 Md€/an au pic** (1,4 % du PIB, vers 2038) et **≈ 1 580 Md€ cumulés** (53 % du PIB) ; 20 % : **≈ 90 Md€/an** (2,8 %) et **≈ 3 160 Md€** (105 %). La charge ne retombe de moitié qu'après ≈ 25 ans (2060 : 30 et 60 Md€) et ne s'éteint qu'après ≈ 70 ans : la génération de transition paie deux fois.
2. **Ce que ça rapporte aux retraités.** Au central, la pension de la cohorte 2060 monte de **+6,6 % (10 %) ou +13 % (20 %)** (taux de remplacement 50,5 ou 53,7 % contre 47,4 %), et de **+13 % ou +26 %** en régime établi (cohorte 2090). C'est la prime de rendement r − ρ (3,5 % contre 0,6 %), pas un repas gratuit : au taux du fonds, le gain actualisé égale la double charge (identité de Sinn, testée).
3. **Ça ne tient que si le rendement est réel.** Avec 0,83 % (obligations françaises, 1870-2015) la pension baisse de 0,4 à 0,7 % ; à 2 % le gain est de +2 à +4 % ; à 4,34 % (NBIM) de +10 à +20 % (cohorte 2060). Le gain vient de la prime de risque des actions.
4. **Risque.** Un krach de −30 % l'année avant le départ ramène le gain de +6,6 à +2,5 % (10 %) et de +13 à +5 % (20 %) : l'avantage s'érode, il ne devient perte qu'avec rendement nul toute la carrière. Monte-Carlo (σ 12 %) : 3 à 5 % de chances de faire moins bien que la répartition. Un krach de −30 % du fonds en 2060 coûte ≈ 1 800 Md€ de moins en 2070 (promesse à combler par l'État).
5. **Dette.** Financée à 1,5 % réel, la transition laisse **≈ 1 530 Md€ (41 % du PIB) en 2060 à 10 %, ≈ 3 060 Md€ (83 %) à 20 %**, soit 23 et 46 Md€/an d'intérêts ; le fonds la couvre **seulement si r > taux de la dette** (à r = 3,5 % et i = 3,5 %, marge nulle). Le stock de dette implicite (397 % du PIB, Eurostat) ne change pas : on en explicite une partie.
6. **Démographie : « ne plus dépendre de la démographie » n'est tenu qu'à hauteur de la part capitalisée.** De 1,41 à 1,1 cotisant par retraité, le taux de remplacement perd ≈ 10 points en répartition (47,4 → 37,0 %) et ≈ 9 avec 20 % capitalisés (53,7 → 44,7 %) : **20 % capitalisés retirent 20 % de l'exposition**. En diviser la dépendance par deux demanderait ≈ 50 % de capitalisation, soit une double charge de l'ordre de 225 Md€/an ⚠️ (extrapolation linéaire, non calculée).
7. **Mérite.** Des parts proportionnelles aux contributions donnent **23 % du fonds au dixième le plus aisé, 3 % au plus modeste** (rapport 7,2) ; un plancher universel de 50 % ramène le rapport à 2,5 ; 75 % à 1,6. Tension avec les jeunes : les points suivent les années cotisées, donc **les nés en 2005 en reçoivent 7,1 contre 1,1 pour les nés en 1975**, alors que ces derniers financent le passage : le mérite favorise les jeunes sur la durée, pas la génération de transition.
8. **Colosses (centres de données, inférence).** Un actif de calcul amorti sur 6 ans ne rapporte 4 % réel que si son EBITDA annuel atteint **19 % du capital sans baisse des prix, 24 % avec −10 %/an, 30 % avec −20 %/an**. Les marges d'AWS (35 %) et de Google Cloud (30 %) sont des marges de services d'acteurs établis ⚠️ (sources secondaires), pas le rendement d'un entrant public.
9. **Verdict.** La capitalisation partielle **ne tient pas comme gain gratuit** ni comme moyen de supprimer la contrainte démographique ; elle **tient comme diversification** (+7 à +13 % de pension pour 10-20 % des cotisations, au central, risque mesuré) si le fonds est mondial, à frais quasi nuls et protégé de l'État. Les colosses **ne tiennent pas comme source de financement de la transition** : 15 % du fonds de 2087 (≈ 1 830 Md€) rapporteraient de 37 à 219 Md€/an selon un rendement de 2 ou 12 %.
10. **Recommandation (à valider par l'auteur).** Démarrer à 10 % ou moins (≈ 1,4 % du PIB de double charge), conditionner chaque palier à un test publié, attribuer les parts en points avec un plancher universel d'au moins 50 % plus une dotation à la naissance, garder le cœur du fonds indiciel mondial et plafonner les colosses à 15 % ; le financement des ≈ 45 Md€/an est à arbitrer avec le palier 1 (§ 7).

## 1. Bascule partielle : trois scénarios, deux trajectoires

Part détournée de F (cotisations ≈ dépenses de retraite : 432 Md€ en 2027), montée linéaire sur 10 ans. D = double charge (Md€/an) ; fonds en Md€ (% du PIB).

| Trajectoire | Scénario | Pic de D | Cumul max | D en 2035 / 2045 / 2060 / 2075 | Fonds 2057 | Fonds 2087 |
|---|---|---|---|---|---|---|
| 10 % | bas (r 2 %, ρ 1,2 %) | 49 (2042) | 1 843 | 43 / 49 / 37 / 15 | 1 632 (37 %) | 3 842 (61 %) |
| **10 %** | **central (3,5 %, 0,6 %)** | **45 (2038)** | **1 579** | **40 / 44 / 30 / 11** | **1 833 (51 %)** | **6 090 (140 %)** |
| 10 % | haut (4,34 %, 0,3 %) | 44 (2036) | 1 464 | 39 / 41 / 27 / 10 | 1 986 (60 %) | 8 101 (225 %) |
| 20 % | bas | 99 (2042) | 3 686 | 86 / 98 / 74 / 31 | 3 264 (74 %) | 7 683 (122 %) |
| **20 %** | **central** | **90 (2038)** | **3 158** | **81 / 87 / 60 / 23** | **3 667 (101 %)** | **12 180 (281 %)** |
| 20 % | haut | 87 (2036) | 2 928 | 79 / 82 / 54 / 20 | 3 972 (121 %) | 16 202 (449 %) |

Lecture : la double charge est un plateau de deux à trois décennies, pas un pic bref, car les cohortes d'avant 2027 gardent leurs droits en entier. Elle devient négative (la capitalisation coûte moins que la répartition) vers **2098-2109** ; le fonds sert 4,6 % (10 %) ou 9,1 % (20 %) des pensions en 2060, 9,9 % ou 19,8 % en 2090. Repères : fonds norvégien ≈ 1 800 Md€ ⚠️ ; réserves françaises 245 Md€ ; FRR 20,7 Md€. Un fonds de 100 à 280 % du PIB serait énorme au regard des fonds publics existants, d'où le risque de prix d'actifs (⚠️ V7327) et de gouvernance. Recoupement avec T48 : 3 points → 45 Md€/an, 6 points → 91 (identique).

**Dette si la double charge est empruntée** (i = 1,5 % réel) : 10 % central : 720 Md€ en 2045 (21 % du PIB), 1 528 en 2060 (41 %), 2 766 en 2087 (64 %) ; intérêts 11 puis 23 Md€/an ; 20 % central : 1 440 (43 %), 3 055 (83 %), 5 532 (128 %) ; intérêts 22 puis 46 Md€/an. Position nette fonds − dette en 2060 (20 % central) : +1 205 Md€ à i = 1,5 %, +662 à 2,5 %, **0 à 3,5 %** ; au scénario bas (r = 2 %) : +281, −310, −1 028. Le gain net est le spread r − i, c'est-à-dire la prime de risque : il disparaît si l'État emprunte au taux du rendement attendu du fonds.

## 2. Taux de remplacement et rendement

Taux de référence 2060 : 47,4 % (COR, interpolé, ⚠️ V7322). Rapport = pension mixte / pension de répartition de la même cohorte.

| Scénario | s = 10 %, cohorte 2060 | s = 20 %, cohorte 2060 | s = 10 %, cohorte 2090 | s = 20 %, cohorte 2090 |
|---|---|---|---|---|
| central | 1,066 (50,5 %) | 1,132 (53,7 %) | 1,131 | 1,261 |
| bas | 1,007 (47,7 %) | 1,015 (48,1 %) | n. c. | n. c. |
| haut | 1,116 (52,9 %) | 1,233 (58,4 %) | n. c. | n. c. |

Grille en rendement réel net r (ρ = 0,6 %), rapport cohorte 2060 / 2090 :

| r | s = 10 % | s = 20 % |
|---|---|---|
| 0,83 % (obligations FR, JST) | 0,996 / 0,996 | 0,993 / 0,992 |
| 1,5 % | 1,009 / 1,019 | 1,019 / 1,038 |
| 2,0 % | 1,021 / 1,040 | 1,042 / 1,081 |
| **3,5 %** | **1,066 / 1,131** | **1,132 / 1,261** |
| 4,34 % (NBIM) | 1,101 / 1,206 | 1,201 / 1,412 |
| 5,5 % | 1,163 / 1,355 | 1,326 / 1,710 |

**Comparaison au rendement de la répartition.** ρ ≈ 0,6 % (estimation) à 0,8 % (COR, cas type, génération 2000) contre 3,5 à 4,34 % réel net pour un fonds diversifié : ≈ 3 points d'écart. Mais (i) c'est avant risque (écart-type des actions ≈ 22 %), (ii) ρ suppose une répartition équilibrée, ce que la France n'est pas (COR : −0,2 % du PIB en 2025, −2,4 % en 2070), (iii) l'écart est la facture de la transition (§ 1), pas un gain net.

**Stress (central)** : rapport de la cohorte 2090 (2060 entre parenthèses).

| | s = 10 % | s = 20 % |
|---|---|---|
| central | 1,131 (1,066) | 1,261 (1,132) |
| krach −30 % la veille du départ | 1,061 (1,025) | 1,123 (1,050) |
| krach −40 % | 1,038 (1,011) | 1,077 (1,022) |
| rendement nul sur les 20 dernières années | 1,032 (1,013) | 1,063 (1,027) |
| rendement nul sur toute la carrière | 0,974 (0,983) | 0,947 (0,966) |
| Monte-Carlo p5 / p50 / p95 (σ 12 %), cohorte 2090 | 1,009 / 1,138 / 1,464 | 1,018 / 1,275 / 1,927 |
| Probabilité de faire moins bien que la répartition | 3,3 % (4,5 % pour 2060) | 3,3 % (4,5 % pour 2060) |

Krach du fonds en 2045 ou 2060 (20 %, central, promesse maintenue) : fonds 2070 de 6 568 Md€ sans choc, 5 447 avec choc en 2045 (−1 121), 4 791 avec choc en 2060 (−1 777).

## 3. Démographie : sensibilité au ratio cotisants / retraités

Taux de remplacement 2060 à cotisation fixe selon X (cotisants par retraité), X0 = 1,41 (COR : 1,8 en 2025, 1,3 en 2070).

| X | Répartition | 10 % capitalisés | 20 % capitalisés | Cotisation pour garder 47,4 % en répartition |
|---|---|---|---|---|
| 2,1 | 70,6 % | 72,1 % | 73,5 % | 18,7 % |
| 1,8 (2025) | 60,5 % | 62,7 % | 64,9 % | 21,8 % |
| 1,5 | 50,4 % | 53,3 % | 56,3 % | 26,1 % |
| 1,41 (2060) | 47,4 % | 50,5 % | 53,7 % | 27,8 % |
| 1,3 (2070) | 43,7 % | 47,1 % | 50,5 % | 30,2 % |
| 1,1 | 37,0 % | 40,9 % | 44,7 % | 35,6 % |

Lecture : perdre 0,3 cotisant par retraité coûte 10,4 points en répartition, 9,0 avec 20 % capitalisés. **Le système mixte reste exposé à 86 % (2060), puis 80 % (régime établi) au ratio démographique** : la capitalisation répond au souhait de l'auteur proportionnellement à sa part. Limites : l'« effondrement des actifs » (⚠️ V7324) ; le fonds mondial ne dépend pas de la démographie française, mais la production courante qui paie les retraités, si. Côté immigration (positions) : 70 000 migrants par an au lieu de 150 000 coûtent +1,1 point de PIB de retraites en 2070 (Insee/COR).

## 4. Mérite : parts proportionnelles aux contributions, avec plancher

Part du fonds (%) par dixième de niveau de vie (proxy des contributions : revenu disponible net 2023, ⚠️ V7325).

| Plancher universel | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 | D10 / D1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 % (mérite pur) | 3,2 | 5,2 | 6,6 | 7,7 | 8,5 | 9,4 | 10,5 | 11,9 | 13,9 | 23,1 | 7,2 |
| 25 % | 4,9 | 6,4 | 7,5 | 8,2 | 8,8 | 9,5 | 10,4 | 11,4 | 13,0 | 19,8 | 4,1 |
| **50 %** | 6,6 | 7,6 | 8,3 | 8,8 | 9,2 | 9,7 | 10,2 | 11,0 | 12,0 | 16,6 | 2,5 |
| 75 % | 8,3 | 8,8 | 9,2 | 9,4 | 9,6 | 9,8 | 10,1 | 10,5 | 11,0 | 13,3 | 1,6 |
| 100 % (égalité) | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 1,0 |

Lecture : le mérite pur donne à D10 ≈ 7 fois la part de D1 ; le plancher est le curseur d'égalité. Les cotisations étant en partie plafonnées et le patrimoine ne cotisant pas, la part réelle de D10 serait plus faible que dans ce proxy (⚠️). Le mécanisme est une retraite par points : il récompense la contribution passée, sans redistribuer vers le bas ; la redistribution vient du socle et du plancher.

**Tension avec les jeunes** (par tête, s = 20 %, central ; unités de masse cotisée détournée par tête-année) :

| Né en | 1965 | 1970 | 1975 | 1980 | 1985 | 1990 | 1995 | 2000 | 2005 | 2010 |
|---|---|---|---|---|---|---|---|---|---|---|
| Années actives après 2027 | 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 40 |
| Points | 0 | 0,30 | 1,10 | 2,10 | 3,10 | 4,10 | 5,10 | 6,10 | 7,10 | 7,80 |
| Double charge payée (nette) | 0 | 0,30 | 1,09 | 2,05 | 2,94 | 3,75 | 4,45 | 5,02 | 5,46 | 5,48 |

Lecture : tant que le fonds ne sert que peu de pensions, chaque cohorte « paie » en double charge à peu près les points qu'elle reçoit : la double charge est son épargne. La vraie inégalité est ailleurs : les nés avant 1966 gardent la répartition intégrale (0 point, 0 charge) et les cohortes 1970-1985 financent le passage en recevant peu de points (0,3 à 3,1 sur un maximum de 7,8) alors que leurs cotisations d'avant 2027 ne comptent pas dans le fonds. Pour redistribuer vers les jeunes : un plancher élevé, une dotation à la naissance (T51 : 1 000 à 10 000 € par enfant = 0,02 à 0,22 % du PIB), ou des points de départ pour les cotisations passées. **Le mérite pur et la priorité aux jeunes ne s'additionnent pas ; ce qui les concilie est le plancher (≥ 50 %) plus la dotation à la naissance.**

## 5. Fonds souverain et colosses

**Financement de la double charge (45 à 90 Md€/an au pic).** Aucune ressource n'est neuve : (a) **taxe à 1 % sur le patrimoine** (+93 Md€ au central, `modeles/systeme-ideal/taxe-patrimoine-1pc.md`), déjà fléchée vers le déficit du palier 1 (−84 Md€ après réforme immobilière) : un euro ne finance qu'un usage ; (b) **cessions** : portefeuille de l'APE 209 Md€ (T51), moins de cinq ans de D à 10 %, une seule fois ; (c) **dette** à 1,5 % : 41 % du PIB en 2060 à 10 %, à confronter à la confiance des marchés (chantier 8) ; (d) **hausse temporaire de cotisation** : 3 à 6 points au pic, contre la baisse du coin socio-fiscal voulue ; (e) **baisse des dépenses de répartition** sur les seuls droits futurs (nouveau décompte). Un mélange (a)+(e) est la seule voie compatible avec « au moins autant de recettes qu'aujourd'hui » ; le chiffrage global revient au chantier 2.

**Rendement d'un actif de calcul** (TRI réel avant impôt, durée 6 ans, valeur résiduelle nulle ; e = EBITDA année 1 / capital ; δ = baisse annuelle des prix) :

| e | δ = 0 | δ = 10 % | δ = 20 % | δ = 30 % | bâtiment + énergie, 20 ans, e/2 |
|---|---|---|---|---|---|
| 18 % | 2,2 % | −5,1 % | −12,6 % | −20,2 % | 6,4 % |
| 25 % | 13,0 % | 5,2 % | −2,7 % | −10,9 % | 10,9 % |
| 33 % | 23,9 % | 15,7 % | 7,3 % | −1,2 % | 15,6 % |
| 45 % | 38,7 % | 30,1 % | 21,3 % | 12,4 % | 22,1 % |

EBITDA minimal pour 4 % : 19,1 % (δ = 0), 24,1 % (10 %), 30,3 % (20 %), 37,5 % (30 %) ; pour 8 % : 21,6 / 27,1 / 33,5 / 41,0 %. **Le rendement dépend moins de la marge que de la vitesse à laquelle le prix du service baisse.** La partie longue (bâtiments, électricité, réseau) reste rentable à EBITDA modeste parce qu'elle ne s'obsolète pas avec les puces : si l'État veut détenir quelque chose, c'est plutôt cette partie que le parc d'équipement (opinion de Claude, à discuter). Ancrages sectoriels (⚠️ secondaires, V7328, V7330) : AWS 2025, résultat d'exploitation 45,6 Md$ sur 128,7 Md$ (35,4 %) ; Google Cloud, marge de 30,1 % au 4e trimestre 2025 ; Alphabet prévoit 175-185 Md$ d'investissements en 2026 contre ≈ 91 Md$ en 2025 ; la direction d'Amazon dit que la marge d'AWS continuera de fluctuer avec la dépréciation liée à l'IA. Ces marges prouvent que la rente existe aujourd'hui pour des acteurs établis, pas qu'un entrant public la capterait ni qu'elle durera (la baisse du prix du jeton et les modèles ouverts l'érodent : ⚠️ V7331).

**Ce que pèserait un compartiment « colosses »** (15 % du fonds de 2087 du scénario 20 % central, soit 1 827 Md€) : 37 Md€/an à 2 %, 110 à 6 %, 219 à 12 %. Ni de quoi payer la transition (D = 90 Md€/an), ni un dividende universel de 100 €/mois (1 370 à 2 740 Md€ de capital, T51). Même euro de capital, trois usages concurrents (T51 § 3.4).

**Risques.** Gouvernance (allocation politique du capital : Plan Calcul-Bull, Areva, Gaia-X ; mais Airbus, Bpifrance), corrélation (colosses = actions technologiques ; test T48 : 11 % de probabilité de perte au test extrême), obsolescence des équipements, dépendance à des fournisseurs étrangers de puces, prix d'actifs, concentration (position de l'auteur du 27/10 : une seule structure). Droit : critère de l'investisseur avisé (art. 107 TFUE), art. 63 TFUE pour une ouverture réservée aux Français : détails dans T51 § 4.

## 6. Steelman et réponse

**Objection (la meilleure).** « Vous demandez à la génération de transition de payer deux fois pour un gain qui n'est que la prime de risque des actions (Sinn, Barr-Diamond) ; vous concentrez ce risque dans un fonds public que l'État pourra capturer (Argentine, Hongrie, Pologne, FRR) ; vous prétendez rompre avec la démographie alors que 20 % n'en retirent que 20 % ; et des colosses publics, c'est l'État qui choisit les gagnants, avec des rendements que vos propres tableaux montrent hypothétiques. Réglez la répartition (âge, indexation, cotisation) et n'en faites pas plus. »

**Réponse.** (1) Elle a raison sur le gain gratuit, sur la démographie (§ 3) et sur les colosses (§ 5) : le document le dit. (2) Ce qui reste est la **diversification** : aujourd'hui 100 % des pensions dépendent de la masse salariale française ; 10 à 20 % en capital mondial réduisent cette exposition et rapportent, au central, 7 à 13 % de pension en plus à la cohorte 2060, avec 3 à 5 % de risque de faire moins bien (§ 2). (3) La gouvernance est l'objection la plus forte : seule une institution inscrite dans la loi organique, indépendante, indicielle, plafonnant les colosses à 15 %, avec règle de décaissement fixée, la rend défendable (T48 § 6). (4) Si la répartition seule suffisait, le COR ne projetterait pas −2,4 % du PIB en 2070 : la comparaison honnête n'est pas « capitalisation contre équilibre » mais « capitalisation partielle contre un déficit à combler ». (5) Concession : sans accord sur le financement de 45 Md€/an, la bascule n'est pas faisable d'emblée ; on commence à 1 point (≈ 15 Md€/an, T48), puis par paliers testés.

## 7. Contraintes et cohérence avec le reste du dépôt

- **Ne pas compter deux fois** : taxe à 1 %, successions et cessions financent déjà le palier 1 ; la double charge s'y ajoute (1,4 % du PIB à 10 %) : le solde du palier 1 se dégrade d'autant tant que le financement n'est pas tranché.
- **Droits acquis sanctuarisés** (décision de l'auteur du 31/10 : ne rien reprendre aux retraités) : c'est ce qui crée la double charge ; on ne peut pas à la fois sanctuariser les droits et supprimer la transition.
- **Contradiction à nommer** (positions de l'auteur du 02/11 et du 27/10) : l'idée que le travail disparaît et que l'IA finance les retraites suppose que la valeur créée par le capital ne se dilue pas dans la concurrence ; or la thèse de la décentralisation dit que l'inférence devient une commodité à marges faibles. Le module fait varier r et δ ; les deux thèses ne peuvent pas être vraies ensemble au maximum.
- **Droit** : voir `methode.md` § 9.

## 8. Ce qui tient, ce qui ne tient pas

| Tient | Ne tient pas |
|---|---|
| Capitalisation partielle comme diversification (+7 à +13 % de pension au central pour 10-20 %) | Gain gratuit (identité de Sinn : rendement actualisé nul à r = i) |
| Pic de double charge de 1,4 % du PIB à 10 %, supportable si étalé et conditionné | Transition rapide ou à 20 % sans arbitrage de financement (2,8 % du PIB, 105 % du PIB cumulés) |
| Fonds indiciel mondial à frais quasi nuls (NBIM 0,05 %) comme noyau | Supprimer la dépendance à la démographie : 20 % retirent 20 % de l'exposition |
| Mérite avec plancher ≥ 50 % + dotation à la naissance | Mérite pur : D10 reçoit 7 fois D1 ; défavorise la génération de transition |
| Part publique minoritaire dans les infrastructures longues (énergie, bâtiments de calcul) | Colosses comme financement de la transition ou dividende universel |

## Synthèse des sources mobilisées

- **COR, rapport annuel 2026** : dépenses, cotisants par retraité, taux de remplacement, rendement interne : base des trajectoires.
- **NBIM 2025** (vérifié 03/11), **Jordà et al.**, **CPP Investments**, **FRR**, **APRA**, **AP7** : fourchette de rendement r (obligations 0,83 % à NBIM 4,34 %).
- **Sinn (NBER WP 7592)** : identité de Sinn et condition d'Aaron ; testées dans `test.js`.
- **Insee Analyses n° 119 (DINA 2023)** : proxy des contributions par dixième.
- **Eurostat nasa_10_pens1** : dette implicite (397 % du PIB).
- **Presse financière (⚠️ secondaire)** : marges d'AWS et Google Cloud, investissements d'Alphabet ([Amazon Q4 2025](https://quartr.com/events/amazon-com-inc-amzn-q4-2025_3sdJ6cFb), [Alphabet Q4 2025](https://fintool.com/news/alphabet-q4-2025-earnings-ai-capex)) ; communiqués primaires à lire.
- **T48 et T51 du dépôt** : droit, gouvernance, précédents, ordres de grandeur des colosses.
