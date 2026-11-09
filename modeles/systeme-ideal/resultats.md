---
titre: Modèle « Système idéal » (T47) : résultats
tache: T47
statut: brouillon sourcé, v1
date: 2026-10-31
---

# Système idéal : résultats

> **Ordres de grandeur sous hypothèses, jamais des prédictions.** Méthode et hypothèses H1 à H35 : [`methode.md`](methode.md). Chiffres reproduits par `jsc modele.js rapport.js` (tableaux de la section 2) ; 41 contrôles au vert (`test_modele.js`) + 33 (`test_voies.js`). Md€ de 2024 sauf mention ; ⚠️ = non confirmé. Les scénarios bas / central / haut qualifient l'**intensité des réactions** (élasticités), pas le caractère favorable du résultat. Les virgules décimales des tableaux sont celles du générateur.

## 1. Ce qu'il faut retenir (écrit pour être vrai)

1. **Aucune combinaison testée n'équilibre le budget, ni ne dégage de marge d'investissement, au scénario central, avec les rétroactions de la littérature.** Le simulateur seul : Δ = −194 Md€ en statique, **−276 Md€** au central (−233 bas, −333 haut) ; solde public total ≈ −445 Md€ avec le déficit actuel (−169,1).
2. **L'impôt continu seul (c1) ne peut pas financer le système** : même à t_max = 90 %, il rapporte ≈ 572 Md€ sur les revenus courants, contre ≈ 1 130 Md€ nécessaires (Δ = −556 Md€ en statique, −749 Md€ au central). Aucun t_max ≤ 95 % n'équilibre. Dans le modèle, un seuil à 24 000 € exonère le bas de la distribution, et la masse imposable au-dessus de 100 k€ reste trop petite pour compenser (hypothèses H4 et H5 : à confirmer avec les données fiscales). C'est le résultat le plus net du modèle : une « bonne équation » ne suffit pas, il faut aussi un taux plat ou des dépenses en moins.
3. **Le taux plat reste nécessaire** : l'architecture c2 (taux plat + continu en surtaxe) est la seule qui s'approche de l'équilibre, au prix d'un taux marginal de 60 à 75 % pour les déciles 5 à 9 au taux de référence (40 % + 50 %). Le prélèvement unique à 50 % seul, avec rétroactions, n'équilibre pas non plus (sommet de la courbe à ≈ 78 % de taux plat, Δ ≈ −60 Md€ au central).
4. **Les leviers, par effet sur le Δ (central, par rapport au simulateur)** : imposer ensemble pensions et capital des retraités **+100 Md€** (j) ; socle 800 € au lieu de 1 000 € **+103 Md€** (a) ; transparence des holdings **+25 Md€** (d, hypothèses H19 à H21) ; sous-indexation d'un point par an **+20 Md€** (f, voir H25) ; CIR remplacé par 4 Md€ **−4 Md€** (e) ; transition **−1 Md€** (g) ; prime d'activité **−63 à −65 Md€** (b) ; heures exonérées **−16 Md€** (i) ; retraite à 60 ans avec activité exonérée **−104 Md€** (h) (−77 à demi-taux, −55 avec une surcote).
5. **Marge d'investissement** : avec des taux optimisés (plat 45 % + t_max 40 %, taux marginal total ≤ 85 %), la meilleure combinaison dégage **Δ = +30 Md€ au central** (+154 au bas, −84 au haut) par rapport à la loi actuelle ; le solde public total reste **≈ −139 Md€** (déficit actuel compris). La marge d'investissement est donc **nulle** au sens strict (solde public positif). Le Δ de +30 Md€ n'est pas une marge tant que le déficit de 169 Md€ n'est pas résorbé ailleurs (santé, retraites, simplification : T47 n'en chiffre qu'une partie).
6. **La combinaison qui maximise la marge est la même, avec ou sans liberté sur l'âge de la retraite** : socle 800 €, **pas de prime d'activité**, c2 (45 % + 40 %), transparence des holdings, retraités imposés sur pension + capital, sous-indexation d'un point, CIR non remplacé, pas d'heures exonérées. La retraite à 60 ans **n'est jamais** dans la combinaison de marge maximale : elle coûte 55 à 123 Md€ (bas à haut). Si l'auteur la veut, c'est un choix de justice sociale, pas un gain budgétaire ; la version la moins coûteuse est la surcote.
7. **Humains** : au taux de référence, le 0,1 % du haut paie ≈ 87 % de son revenu ; le dirigeant du cas type doit un impôt supérieur à son revenu versé (−12 750 €/mois de trésorerie) parce que 300 k€ de bénéfices sont imputés mais non perçus : il faudrait un paiement différé ou une distribution forcée. Les retraités à l'ASPA perdent jusqu'à 244 €/mois avec un socle de 800 €. Le forfait de 15 h crée un seuil de 200 €.

## 2. Tableaux (générés par `rapport.js`)

T1 = variantes une à une ; T2 = combinaisons ; T3 = taux d'équilibre ; T4 = marge d'investissement (avec contraintes) ; T5 = postes ; T6 = par décile ; T7 = cas types ; T8 = retraités ; T9 et T10 = détails.

### T1. Variantes une à une, par rapport au simulateur (Δ solde en Md€/an, statique | central avec rétroactions)
| Variante | Statique | Bas | Central | Haut |
|---|---|---|---|---|
| Référence : simulateur (socle 1 000 €, plat 50 %) | -194,3 | -233,5 | -276 | -332,6 |
| (a) socle 800 € | -95,8 (+98,4) | -133,6 | -173,2 (+102,8) | -225,4 |
| (b) prime forfait 200 € dès 15 h | -263,9 (-69,6) | -299 | -338,9 (-62,9) | -394,3 |
| (b) prime progressive (13,3 €/h, plafond 200 €) | -265,8 (-71,5) | -300,9 | -340,8 (-64,8) | -396,2 |
| (c1) impôt continu seul, t_max 90 % | -556,4 (-362,1) | -648,7 | -749,3 (-473,3) | -858,5 |
| (c2) 40 % plat + continu 50 % | -63,2 (+131,1) | -203,9 | -345,9 (-69,9) | -520,7 |
| (d) transparence des holdings | -189,8 (+4,5) | -220,2 | -250,7 (+25,4) | -294,4 |
| (e) CIR remplacé par 4 Md€ de financement direct | -198,3 (-4) | -237,5 | -280 (-4) | -336,6 |
| (f) retraites : cumul du socle (aucune économie) | -379,8 (-185,5) | -419 | -461,5 (-185,5) | -518,1 |
| (f) retraites : sous-indexation de 1 pt/an (10 ans) | -174,5 (+19,8) | -213,7 | -256,2 (+19,8) | -312,8 |
| (g) transition de l'industrie de la complexité | -195,3 (-1) | -233,9 | -277,1 (-1) | -334,8 |
| (h) retraite à 60 ans + activité exonérée jusqu'à 70 ans | -303,3 (-109) | -323,7 | -380,4 (-104,3) | -455,3 |
| (h) idem, activité taxée à demi-taux (exo 50 %) | -274 (-79,7) | -298,5 | -352,6 (-76,6) | -422,7 |
| (h) idem, surcote de 5 %/an au lieu d'exonération | -251,3 (-57) | -279,3 | -331,4 (-55,4) | -397,5 |
| (i) heures au-delà de 35 h exonérées | -210,8 (-16,5) | -246,7 | -292,5 (-16,5) | -354,6 |
| (i) heures sup. à demi-taux | -202,5 (-8,2) | -240,1 | -284,3 (-8,2) | -343,6 |
| (j) pensions + capital des retraités imposés ensemble | -94,4 (+99,9) | -133,6 | -176,2 (+99,9) | -232,7 |

### T2. Combinaisons : Δ solde (Md€/an) par scénario, solde public total, taux marginal max, dispositifs supprimés
| # | Combinaison | Statique | Bas | Central | Haut | Solde public central (déficit actuel −169,1 inclus) | Taux marg. max | Dispositifs supprimés (net) |
|---|---|---|---|---|---|---|---|---|
| K0 | Simulateur actuel : socle 1 000 €, prélèvement unique 50 % | -194 | -233 | -276 | -333 | -445 | 50 % | 21 |
| K1 | Socle 800 € + prime forfait 200 € (15 h), prélèvement unique 50 % | -165 | -199 | -236 | -287 | -405 | 50 % | 20 |
| K2 | K1 avec prime progressive | -167 | -201 | -238 | -289 | -407 | 50 % | 20 |
| K3 | Socle 800 € + prime progressive + c2 (40 % + continu 50 %) + holdings | -28 | -118 | -227 | -401 | -396 | 90 % | 20 |
| K4 | K3 + CIR remplacé par 4 Md€ + coût de transition | -33 | -123 | -232 | -407 | -401 | 90 % | 20 |
| K5 | K4 en c1 (impôt continu seul, t_max 90 %) | -526 | -583 | -660 | -769 | -829 | 90 % | 20 |
| K6 | K4 + retraite à 60 ans, activité exonérée jusqu'à 70 ans | -147 | -215 | -339 | -527 | -508 | 90 % | 20 |
| K7 | K4 + heures au-delà de 35 h exonérées | -54 | -140 | -253 | -433 | -422 | 90 % | 20 |
| K8 | K4 + impôt sur pensions et capital des retraités (j) | 77 | -13 | -122 | -297 | -291 | 90 % | 20 |
| K9 | K8 + sous-indexation d'un point par an (retraites) | 100 | 10 | -99 | -274 | -268 | 90 % | 20 |

### T3. Taux d'équilibre par combinaison (solde public = 0 sur le Δ du système ; « aucun » = pas de solution sous le plafond)
| # | Statique | Central | Haut |
|---|---|---|---|
| K0 (t plat) | 60,4 % | aucun (sommet 78 % : Δ = -60 Md€) | aucun (sommet 64 % : Δ = -266 Md€) |
| K1 (t plat) | 58,9 % | 75,4 % | aucun (sommet 66 % : Δ = -207 Md€) |
| K2 (t plat) | 59 % | 76,1 % | aucun (sommet 66 % : Δ = -209 Md€) |
| K3 (t_max (plat 40 %)) | 54,4 % | aucun (sommet 44 % : Δ = -223 Md€) | aucun (sommet 23 % : Δ = -326 Md€) |
| K4 (t_max (plat 40 %)) | aucun (sommet 55 % : Δ = -1 Md€) | aucun (sommet 44 % : Δ = -228 Md€) | aucun (sommet 23 % : Δ = -333 Md€) |
| K5 (t_max) | aucun (sommet 95 % : Δ = -494 Md€) | aucun (sommet 93 % : Δ = -659 Md€) | aucun (sommet 76 % : Δ = -751 Md€) |
| K6 (t_max (plat 40 %)) | aucun (sommet 55 % : Δ = -116 Md€) | aucun (sommet 44 % : Δ = -334 Md€) | aucun (sommet 23 % : Δ = -454 Md€) |
| K7 (t_max (plat 40 %)) | aucun (sommet 55 % : Δ = -23 Md€) | aucun (sommet 44 % : Δ = -248 Md€) | aucun (sommet 23 % : Δ = -355 Md€) |
| K8 (t_max (plat 40 %)) | 38,6 % | aucun (sommet 45 % : Δ = -120 Md€) | aucun (sommet 25 % : Δ = -231 Md€) |
| K9 (t_max (plat 40 %)) | 35,2 % | aucun (sommet 45 % : Δ = -97 Md€) | aucun (sommet 25 % : Δ = -208 Md€) |

Variante c2 : taux PLAT d'équilibre pour t_max = 45 % (plafond : plat + 45 % < 95 % → plat ≤ 50 %)
| # | Statique | Central |
|---|---|---|
| K3 | 43,2 % | aucun (sommet 50 % : Δ = -152 Md€) |
| K4 | 43,5 % | aucun (sommet 50 % : Δ = -157 Md€) |
| K6 | aucun (sommet 50 % : Δ = -7 Md€) | aucun (sommet 50 % : Δ = -274 Md€) |
| K7 | 44,7 % | aucun (sommet 50 % : Δ = -180 Md€) |
| K8 | 38 % | aucun (sommet 50 % : Δ = -25 Md€) |
| K9 | 36,9 % | aucun (sommet 50 % : Δ = -2 Md€) |

### T4. Marge d'investissement dégagée (scénario central ; taux de référence : c2 40 % + 50 %, c1 90 %, plat 50 %)
| # | Δ solde du système vs loi actuelle | Solde public total (−169,1 + Δ) | Marge d'investissement après déficit actuel | Δ aux taux optimaux (c2, grille ≤ 95 %) | Solde public total aux taux optimaux | Taux marg. max < 100 % | Personne sous le socle | Dispositifs supprimés | Effets humains signalés |
|---|---|---|---|---|---|---|---|---|---|
| K0 | -276 | -445 | 0 | -279 (plat 45 + 30) | -449 | 50 % (oui) | oui (socle universel) | 21 | retraités sous 1 000 € perdent ASPA ; 0,9 M d'arrêts d'emploi (T4) |
| K1 | -236 | -405 | 0 | -239 (plat 45 + 30) | -408 | 50 % (oui) | oui (socle universel) | 20 | seuil de 15 h, contrats regroupés |
| K2 | -238 | -407 | 0 | -241 (plat 45 + 30) | -410 | 50 % (oui) | oui (socle universel) | 20 | prime progressive : coût de contrôle des heures |
| K3 | -227 | -396 | 0 | -175 (plat 45 + 40) | -344 | 90 % (oui) | oui (socle universel) | 20 | impôt sur revenus non perçus (holdings) : trésorerie |
| K4 | -232 | -401 | 0 | -180 (plat 45 + 40) | -349 | 90 % (oui) | oui (socle universel) | 20 | reconversion de ≈ 147 000 personnes |
| K5 | -660 | -829 | 0 | -180 (plat 45 + 40) | -349 | 90 % (oui) | oui (socle universel) | 20 | taux de 90 % dès les hauts revenus : exil, holdings |
| K6 | -339 | -508 | 0 | -291 (plat 45 + 40) | -460 | 90 % (oui) | oui (socle universel) | 20 | cohortes à 60 ans, pénibilité, niche salaires |
| K7 | -253 | -422 | 0 | -201 (plat 45 + 40) | -370 | 90 % (oui) | oui (socle universel) | 20 | fausses heures sup., inégalité temps partiel |
| K8 | -122 | -291 | 0 | -61 (plat 45 + 40) | -230 | 90 % (oui) | oui (socle universel) | 20 | retraités aisés contributeurs ; droits acquis |
| K9 | -99 | -268 | 0 | -38 (plat 45 + 40) | -207 | 90 % (oui) | oui (socle universel) | 20 | pouvoir d'achat des retraités (−1 pt/an) |

Meilleure combinaison (central, âge de la retraite libre, 1152 testées) : Δ -29,5 Md€, solde public -198,6 Md€ ; socle 800, prime aucune, archi c2 40+50, holdings true, CIR→enveloppe false, HS exo 0, retraités imposés true, sous-indexation 0.01, retraite60 false

Meilleure combinaison (central, sans toucher à l'âge, 576 testées) : Δ -29,5 Md€, solde public -198,6 Md€ ; socle 800, prime aucune, archi c2 40+50, holdings true, CIR→enveloppe false, HS exo 0, retraités imposés true, sous-indexation 0.01, retraite60 false

Meilleure combinaison (haut, âge de la retraite libre, 1152 testées) : Δ -204,7 Md€, solde public -373,8 Md€ ; socle 800, prime aucune, archi c2 40+50, holdings true, CIR→enveloppe false, HS exo 0, retraités imposés true, sous-indexation 0.01, retraite60 false

Meilleure combinaison (haut, sans toucher à l'âge, 576 testées) : Δ -204,7 Md€, solde public -373,8 Md€ ; socle 800, prime aucune, archi c2 40+50, holdings true, CIR→enveloppe false, HS exo 0, retraités imposés true, sous-indexation 0.01, retraite60 false

Meilleure combinaison, taux optimisés (grille, marginal ≤ 95 %) : plat 0.45 + t_max 0.4 → Δ 30,4 ; solde public -138,7
Idem scénario haut : plat 0.45 + t_max 0.2 → Δ -83,7
Idem scénario bas : combinaison Δ 81,9 ; taux optimisés plat 0.45 + t_max 0.5 → Δ 154,2 ; solde public -14,9
Idem en statique : plat 0.45 + t_max 0.5 → Δ 281,1

### T5. Détail des postes, combinaison K4 (central)
{"rec":{"courants":881.0721997086166,"transmissions":103.49999999999999,"retraites":40.25490079114218,"total":1024.8271004997587},"post":{"socle":530.1696,"enf":33.252,"eco":151.4,"prime":71.52,"rd":4,"hold":9.044400000000001,"tr":{"ponctuel":6.5,"recettes":3.675,"annualise":1.0175}}}
K6 retraite60 : {"pensions":24.941379310344832,"impotPerdu":26.049578808907953,"exoneration":48.081010086541845,"niche":7.681334267616264,"total":106.7533024734109,"nExtra":2400000}
K7 heures sup : {"cout":13.824488861736207,"niche":6.912244430868103,"tauxMarginal":0.6284572729508447,"masseHS":21.9975}

### T6. Par décile (K4, € par mois et par actif ; avant = loi actuelle approchée)
| Bande | Avant | Après | Écart | Part de gagnants | Taux moyen | Taux marginal |
|---|---|---|---|---|---|---|
| D1 | 1594 | 2175 | 581 | 100 % | 41 % | 41 % |
| D2 | 1815 | 2473 | 658 | 99 % | 42 % | 50 % |
| D3 | 1929 | 2641 | 712 | 99 % | 43 % | 54 % |
| D4 | 2043 | 2852 | 808 | 99 % | 45 % | 59 % |
| D5 | 2187 | 2982 | 795 | 99 % | 46 % | 61 % |
| D6 | 2438 | 3157 | 719 | 99 % | 48 % | 65 % |
| D7 | 2776 | 3384 | 608 | 99 % | 50 % | 68 % |
| D8 | 3264 | 3683 | 419 | 77 % | 54 % | 72 % |
| D9 | 4022 | 4068 | 46 | 77 % | 58 % | 75 % |
| D10a | 5398 | 4732 | -665 | 23 % | 62 % | 79 % |
| D10b | 7864 | 5550 | -2313 | 1 % | 67 % | 82 % |
| D10c | 11822 | 6660 | -5161 | 0 % | 72 % | 84 % |
| D10d (1 %) | 22074 | 9055 | -13019 | 0 % | 78 % | 87 % |
| D10e (0,1 %) | 115137 | 25710 | -89428 | 0 % | 87 % | 89 % |

### T7. Cas types (€ par mois) : K0 simulateur | K4 | K8 (retraités imposés) | K6 (retraite 60) / K7 (heures)
| Cas | Avant (loi actuelle) | K0 | K4 | K8 | Taux marg. heure K4 | Alertes (K4) |
|---|---|---|---|---|---|---|
| Smicard à 15 h par semaine | 913 | 1426 | 1511 | 1511 | 40 % |  |
| Smicard à 35 h | 1707 | 1994 | 2193 | 2193 | 41 % |  |
| Cadre à 60 k€ brut par an | 3423 | 4557 | 3980 | 3980 | 76 % |  |
| Retraité modeste (pension 800 € brut) | 1044 | 1000 | 800 | 800 | 17 % |  |
| Retraité aisé (4 000 € brut + 15 000 € de capital par an) | 3996 | 4625 | 4750 | 3045 | 17 % |  |
| Dirigeant avec holding (30 000 € brut/mois + 300 000 € de bénéfices retenus par an) | 15221 | 22167 | -12750 | -12750 | 89 % | impôt dû sur des bénéfices non perçus : prévoir un paiement différé ou une distribution forcée (trésorerie) |
| Retraité de 62 ans qui continue à mi-temps | 2389 | 2297 | 2596 | 2196 | 40 % |  |
| Salarié médian à 39 h (4 h supplémentaires) | 2476 | 3101 | 3163 | 3163 | 67 % |  |
| Couple, 2 enfants, deux Smic à 35 h | 3736 | 4388 | 4785 | 4785 | 41 % |  |
Dirigeant (K4) revenu économique avant 33971 → après 12250 ; impôt/an 673012 ; taux moyen 83,3 %
Retraité 62 ans mi-temps : K6 (exonéré) 2994 vs K4 2596
Salarié 39 h : K7 (HS exo) 3502 vs K4 3163 ; taux marginal heure 0 % vs 67 %
Smicard 15 h avec forfait : 1511 ; alertes à 15 h : perdre une heure fait perdre 200 €/mois

### T8. Retraités par décile de pension (K4 sans / avec imposition des compléments), Md€/an
K4 : avant (CSG+IR+PFU) 72,1 ; après 40,3 ; D10 avant 29,3 ; après 12,9 ; pension D10 4308 €/mois, capital D10 19515 €/an, R 19515
K8 : avant (CSG+IR+PFU) 72,1 ; après 150,2 ; D10 avant 29,3 ; après 53,2 ; pension D10 4308 €/mois, capital D10 19515 €/an, R 61610

### T9. Rétroactions détaillées K0 par scénario
bas : recettes courants 872 (statique 884), transmissions 123 (statique 150)
central : recettes courants 849 (statique 884), transmissions 103 (statique 150)
haut : recettes courants 818 (statique 884), transmissions 78 (statique 150)

### T10. Volumes : coût prime forfait 69,6 ; progressive 71,5
Retraite 60 central : {"pensions":21.413793103448278,"impotPerdu":27.371268110101056,"exoneration":50.52051811421902,"niche":5.03125,"total":104.33682932776836,"nExtra":2400000}
Retraite60 bas total 90,2 ; HS 13,2
Retraite60 central total 104,3 ; HS 16,5
Retraite60 haut total 122,7 ; HS 22


## 3. Lecture et réserves par variante

- **(a) Socle** : 100 € de socle coûtent 66 Md€ ; passer à 800 € améliore le Δ de 98 Md€ en statique (−132,5 Md€ de socle, +34,1 Md€ de moindre économie sur les pensions) et de 103 Md€ avec rétroactions (effet revenu plus faible).
- **(b) Prime d'activité** : le forfait coûte 69,6 Md€ (29 M × 200 € × 12, H23 ⚠️) ; la progressive 71,5 Md€. L'auteur estimait un gain net de 35 à 40 Md€ pour « 800 + prime » : le modèle donne +35 Md€ en statique et +40 Md€ avec rétroactions (98 − 70 ; 103 − 63), cohérent avec son calcul, mais cela ne rapproche pas de l'équilibre. Seuil du forfait : +200 € pour une heure juste avant 15 h (incitation à regrouper les contrats et à déclarer de fausses heures) ; la prime progressive l'efface pour 2 Md€ de plus et un contrôle des heures.
- **(c1, c2)** : voir 1.2 et 1.3. Un smicard à 35 h ne paie rien en c1 (R = 23 853 € < 24 000 €) : 2 988 € par mois avec un socle de 1 000 € ; en c2 (40 % + 50 %) il garde 60 % de son coût.
- **(d) Holdings** : le flux imputé (5,4 / 9,0 / 12,7 Md€) est une hypothèse (H19, **aucune statistique publique**). L'effet principal n'est pas l'imputation (+4,5 Md€ en statique) mais la **réduction de la fuite** du capital taxé à un taux marginal élevé (+25 Md€ au central). Steelman : holdings étrangères, expatriation, impôt sur des bénéfices non perçus (paiement différé).
- **(e) CIR** : l'IS étant supprimé dans le simulateur, le CIR disparaît avec lui (H22 ⚠️). Une enveloppe directe de x Md€ est un coût net de x ; elle n'économise 8,0 − x Md€ que par rapport à un CIR maintenu en crédit remboursable. Steelman : le CIR est jugé efficace pour les PME (CNEPI) et des centres de R&D peuvent partir si l'enveloppe est moins généreuse.
- **(f) Retraites** : intégrer le socle économise 185,5 Md€ à 1 000 € et 151,4 Md€ à 800 € (T13) ; le « cumul » (droits acquis intacts) coûte 185,5 Md€ de plus. La **sous-indexation** (−1 point par an) rapporte ≈ 20 Md€ au bout de 10 ans, mais l'indexation actuelle est déjà sur les prix ⚠️ : c'est une **baisse de pouvoir d'achat des retraités**, à assumer comme telle.
- **(g) Transition** : 6,5 Md€ ponctuels + 3,7 Md€ de recettes perdues (central), ≈ 1 Md€ par an sur 10 ans. Le gain de productivité (15 Md€/an, T6) n'est pas un gain budgétaire.
- **(h) Retraite à 60 ans, activité exonérée jusqu'à 70 ans** : coût central 104 Md€/an (pensions anticipées 21, impôt perdu sur ceux qui auraient travaillé 27, exonération des revenus d'activité des 60-69 ans 51, niche 5) ; le poste dominant est l'**exonération**. Variantes : demi-taux −77 Md€ ; surcote de 5 % par an −55 Md€. **Effet de niche** : requalifier du capital en salaires (un associé de 62 ans se verse un salaire plutôt qu'un dividende) ; protection possible : plafonner l'exonération à un revenu d'activité donné. Retraité de 62 ans à mi-temps : 2 994 €/mois (exonéré) contre 2 596 € (non exonéré).
- **(i) Heures au-delà de 35 h** : coût central ≈ 16,5 Md€ (13,8 de base + 6,9 de niche, ⚠️ H30 et H33). **Effet de niche** : requalification de salaires en heures supplémentaires, fausses heures. Cas type à 39 h : taux marginal de l'heure 0 % au lieu de 67 %.
- **(j) Retraités aisés** : l'impôt continu porte bien sur pension (complément) et capital **ensemble** (test : R = 51 000 €, I = 4 009 €). Le dixième le plus aisé paie **29,3 Md€ avant** (CSG, IR et PFU, H9 et H10) et **12,9 Md€ après** si les compléments ne sont pas imposés (K4), **53,2 Md€** s'ils le sont (K8). **Le simulateur actuel ne les imposait pas** : hypothèse implicite de 100 Md€. Données de patrimoine des retraités (Insee, DREES) non lues : ⚠️ H7.

## 4. Brancher dans le simulateur (sans le modifier ici)

1. Charger `modeles/systeme-ideal/modele.js` (global `SystemeIdeal`) à côté de `simulations/simulateur.html`.
2. **Onglet « mon foyer »** : `SystemeIdeal.situation(foyer, params)` avec `foyer = { adultes, enfants, age, heuresSemaine, coutHoraire | coutMensuelPlein, retraite, pensionBruteMois, capitalAn, bndHoldingAn, retraiteActive, actuel }` ; renvoie `avantMois`, `apresMois`, `tauxMarginalHeure`, `alertes[]`, `sousLeSocle`. `SystemeIdeal.CAS` : 9 cas types ; `casTypes(params)` les calcule.
3. **Curseurs à ajouter** : `archi` (plat / c1 / c2), `tPlat`, `tMax`, `R0`, `prime`, `socle`, `holdings`, `cir` + `enveloppeRD`, `retraites`, `sousIndexation`, `imposerComplements`, `retraite60` + `exoSeniors` + `surcote`, `hsExo`, `transition`, `scenario`, `reactions`.
4. **Bilan** : `solde(params)` (postes, recettes par bande, `soldePublic`, `margeInvestissement`) ; `equilibre(params, 'tMax' | 'tPlat', plafond)` ; `effetsParDecile(params)` ; `tableauMarge(scenario)` ; `meilleureCombinaison(toucherAge, scenario)` ; `optimiserTaux(params)`.
5. Remplacer l'expression des retraites du simulateur par `SystemeIdeal.economieRetraites(socle, params)` (même table T13).

## 5. À vérifier avant de citer ces chiffres (⚠️)

Nombre d'actifs à 15 h et plus (H23) ; cohorte et prise de la retraite à 60 ans (H27) ; taux d'emploi des 60-69 ans (H28) ; heures supplémentaires (H30) ; partie remboursable du CIR dans l'IS net (H22) ; stock et flux de bénéfices retenus des holdings (H19) ; patrimoine des retraités (H7) ; indexation légale des pensions (H25) ; cas types « avant » interpolés (H31) ; clé du capital et queues de Pareto (H4, H5). Une étude française de l'élasticité du revenu imposable (Cabannes, Houdré et Landais) reste à lire (H11).

## 6. Trois voies, IS conservé (31/10/2026)

> Décision de l'auteur : garder l'impôt sur les sociétés (25 %). Code : `voies.js` (au-dessus de `modele.js`), tableaux : `rapport_voies.js` (`jsc modele.js voies.js rapport_voies.js`), tests : `test_voies.js` (33 contrôles) ; les 41 contrôles de `test_modele.js` passent toujours. Hypothèses H36 à H52 : `methode.md` § 7. Md€ de 2024 ; Δ = variation du solde par rapport à la loi actuelle ; solde public = −169,1 + Δ ; scénarios bas / central / haut = intensité des réactions.

### 6.0 Ce qu'il faut retenir (écrit pour être vrai)

1. **Ce qui change par rapport au résultat v1 (meilleur solde ≈ −139 Md€).** Garder l'IS ajoute **+68,0 Md€** (IS 2024, comptabilité nationale ; test : Δ statique exactement +68,0), un socle plus bas (600 à 700 € au lieu de 800 à 1 000 €) apporte de l'ordre de +80 à +100 Md€ net des pensions, et l'AAH remplacée par socle + complément différentiel gagne ≈ +10 Md€ nets (⚠️ H44). Cela suffit pour **atteindre l'équilibre au central, de justesse**.
2. **Voies qui équilibrent au central** : **A (socle 600, 650 ou 700 €, plancher ASPA, AAH différentielle, maintien RSA + aide au logement)**, donc aussi **B année 1 (= A à 650 €)**, avec un **taux plat de 44,8 / 46,6 / 48,6 %** et un impôt continu t_max 25 % (taux marginal asymptotique 70 / 72 / 74 %, donc < 75 %). La marge d'investissement est **quasi nulle** (solde central de +4 à +6 Md€ aux taux arrondis ; 19 à 76 Md€ si le taux plat monte à 50 %). **Aucune voie n'équilibre au scénario haut** (solde −90 à −115 Md€ pour A ; −196 pour C avec t_max 40 %). Elles équilibrent au bas (+57 à +75).
3. **Voie C (recommandation de Claude, spécification de l'auteur)** : IS conservé + B + impôt continu + prime d'activité progressive + retraités imposés sur pension et capital + sous-indexation d'un point + surcote. **Elle n'équilibre au central qu'avec un taux plat de ≈ 50 %** : 49,9 % avec t_max 25 % (marginal asymptotique 75 %, limite exacte de la contrainte), 49,6 % avec t_max 40 % (marginal asymptotique 90 %) ; **avec t_max 45 %, aucun taux plat < 100 % de marginal total n'équilibre**. Sous la contrainte « marginal asymptotique ≤ 75 % » avec t_max 45 % (donc plat 30 %), l'écart est de **−253 Md€** de solde central. C coûte plus cher que A de ≈ 3 points de taux plat, à cause de la prime progressive (≈ −65 Md€).
4. **Levier le plus efficace pour combler l'écart de C** : le **socle dégressif** (D2, sortie linéaire) : **+238 à +246 Md€** à lui seul, contre +144 pour 10 points de taux plat, +68 pour la suppression de la prime, +27 pour 50 € de socle en moins, +10 pour l'IS à 30 %. Le socle dégressif S = 650 €, R1 = 2 000 € **sans prime** ramène C à **+57 Md€** de solde central au marginal asymptotique de 75 % ; avec la prime conservée : −7 Md€. Prix à payer : un taux marginal effectif de **62 à 70 %** pour les revenus de 1 500 à 2 500 €/mois (là où le socle sort), et des perdants parmi les smicards à 35 h (−152 €/mois en D2, S = 800, R1 = 2 500).
5. **Socle de 1 000 € (voie B)** : indexé sur la productivité du COR (+0,7 %/an), le socle passe de 650 à ≈ 692 € en 10 ans et **n'atteint 1 000 € qu'en année ≈ 63** (≈ 56 si indexé sur les recettes, ε = 1,12). Si **tout le surplus de recettes** de la croissance est affecté au socle : **≈ année 19** au central (13 à productivité 1,0 %, 32 à 0,4 %). Avec 2 %/an (hypothèse « IA » ⚠️ non sourcée) : année 23 (indexation) ou **7** (surplus). **Il n'atteint 1 000 € dans la décennie dans aucun cas sourcé.** Socle maximal finançable avec les taux de A 650 (47 %) : 660 € ; avec plat 50 % : 734 €.
6. **Contrainte sur les taux** : A et C (t_max 25 %) respectent < 75 % pour toutes les bandes (72 % et 75 % pour le 0,1 % du haut, travail). Avec l'IS à 25 %, le **taux combiné sur un dividende au sommet** est de 79 à 81 % (A, C 25 %) et de 93 % (C 40 %) : toujours < 100 %, mais au-dessus de 75 % : à nommer, car un chef d'entreprise compare ce total.
7. **Gagnants et perdants** (A 650) : gagnent les D1 à D8 et les bas salaires ; **perdent les D9 et D10** (−117 €/mois en moyenne au D9, −438 au D10a) et **les retraités aisés** (−1 141 €/mois pour 4 000 € de pension et 15 000 € de capital ; imposés au taux plat sur pension + capital). Le retraité modeste et la personne au RSA ne perdent rien **grâce aux compléments** (sans eux : −308 et −227 €/mois à 650 €). Le **retraité de 62 ans à mi-temps** perd ≈ 600 €/mois (la retraite à 60 ans exonérée n'est pas dans ces voies).
8. **Holdings** : la transparence en complément de l'IS ne vaut que **4,2 Md€ en statique** (flux imputé 9,0 Md€ taxé au taux personnel, moins le crédit d'IS de 25 % = 2,3 Md€) ; les **≈ 49 Md€ restants** au central viennent de la neutralisation du report en holding, c'est-à-dire de H21 (couverture 70 %, ⚠️ hypothèse sans source). **Le report en holding n'est pas moins attractif parce que l'IS existe** : l'incitation à retenir est le même rapport (1 − taux personnel) ; ce qui change, c'est que l'État a déjà perçu 25 % sur ces bénéfices. Pour le dirigeant du cas type (300 k€ retenus), le crédit d'IS est de 75 000 € et **138 k€ d'impôt sont différés** jusqu'à la distribution : plus aucun impôt supérieur à ce qu'il perçoit.
9. **IS à 30 %** : +13,6 Md€ en statique, **+10,3 au central** (+8,7 haut) avec une semi-élasticité de déplacement des bénéfices de 0,8 % par point (Heckemeyer et Overesch 2017, lue dans `modeles/reactions-assiettes`) ; effets réels sur l'investissement et la localisation des groupes non modélisés ⚠️. Si l'IS rapporte 57,4 Md€ (budget de l'État) et non 68,0 (comptabilité nationale), toutes les voies perdent ≈ 10,6 Md€.
10. **Points de fragilité** : (a) tout dépend de l'assiette et de la comonotonie H4-H5 ; (b) un taux plat de 45 à 50 % **s'ajoute** à l'IS de 25 % ; la pression totale n'est pas évaluée ; (c) l'équilibre est de justesse au central et perdu au haut ; (d) les compléments reposent sur des effectifs non lus (AAH moyen, RSA 1,9 M ⚠️).

### 6.1 Définition des voies

- **A** : IS 25 %, socle universel S ∈ {600, 650, 700} €, majoration enfants 200 €, plancher ASPA (0,75 M de bénéficiaires portés à 1 043,59 €), AAH remplacée par socle + complément différentiel (1,40 M, moyenne 824 €), maintien RSA + aide au logement (877 €, 1,9 M ⚠️) ; pas de prime d'activité ; transparence des holdings ; retraités imposés sur pension (complément) + capital ; impôt c2 (plat + continu, R0 = 24 000 €, t_max 25 %). Le taux plat est cherché pour maximiser le Δ central sous marginal asymptotique ≤ 75 % (il tombe sur 50 %, bord de grille) puis ramené au **taux d'équilibre** pour lire la marge.
- **B** : A à 650 € en année 1 (≈ niveau du RSA seul, 650 €, universel : le remplacement des minima « à niveau constant » ne peut pas être un socle universel à budget constant, qui vaudrait ≈ 70 € ; voir H46) ; puis hausse annuelle (trajectoire § V8).
- **C** : B + prime d'activité progressive + sous-indexation d'un point (10 ans) + surcote de 5 % par an de prolongation (sans retraite à 60 ans exonérée) ; impôt continu avec R0 = 24 000 € et t_max 25, 40 ou 45 %.
- **Dégressifs D1 à D4** (§ V9 et V10) : voir `methode.md` H47 à H50.

### V1. Les voies à leur taux plat d'équilibre arrondi (IS 25 %, c2 : plat + impôt continu R0 = 24 000 €)
| Voie | Plat / t_max | Marginal asymptotique | Δ statique | Δ bas | Δ central | Δ haut | Solde public central | Marge d'investissement (central) | Solde bas / haut |
|---|---|---|---|---|---|---|---|---|---|
| A, socle 600 € | 45 % / 25 % | 70 % | 271 | 226 | 173 | 80 | 4 | 4 | 57 / -90 |
| A, socle 650 € | 47 % / 25 % | 72 % | 287 | 235 | 175 | 68 | 6 | 6 | 66 / -101 |
| A, socle 700 € | 49 % / 25 % | 74 % | 303 | 244 | 175 | 54 | 6 | 6 | 75 / -115 |
| B, année 1 (= A 650 €) | 47 % / 25 % | 72 % | 287 | 235 | 175 | 68 | 6 | 6 | 66 / -101 |
| C, t_max 25 % (marginal ≤ 75 %) | 50 % / 25 % | 75 % | 297 | 240 | 170 | 44 | 1 | 1 | 71 / -125 |
| C, t_max 40 % (spécification de l'auteur, marginal ≤ 90 %) | 50 % / 40 % | 90 % | 399 | 295 | 173 | -27 | 4 | 4 | 126 / -196 |

Taux plat d'équilibre exact (solde central = 0), t_max fixé :
| Voie | t_max | Plat d'équilibre | Marginal asymptotique | Solde public à t plat = 50 % (marge max.) |
|---|---|---|---|---|
| A 600 | 25 % | 44,8 % | 70 % | 76 |
| A 650 (= B année 1) | 25 % | 46,6 % | 72 % | 47 |
| A 700 | 25 % | 48,6 % | 74 % | 19 |
| C | 25 % | 49,9 % | 75 % | 1 |
| C (t_max 45 % : sommet > 100 % avant équilibre) | 45 % | aucun ≤ 60 % | - | -11 |
| C | 40 % | 49,6 % | 90 % | 4 |

### V2. Compléments ciblés (Md€/an, central ; voie A au taux d'équilibre arrondi)
| Socle | Plancher ASPA (0,75 M) | AAH différentielle : complément brut | AAH : dépense actuelle remplacée | Maintien RSA + aide au logement (1,9 M ⚠️) | Total net |
|---|---|---|---|---|---|
| 600 € | 4 | 3,8 | −13,8 | 6,3 | 0,2 |
| 650 € | 3,5 | 2,9 | −13,8 | 5,2 | -2,2 |
| 700 € | 3,1 | 2,1 | −13,8 | 4 | -4,6 |

### V3. Taux marginaux effectifs par bande (central, impôt + sortie du socle ; travail + capital de la bande)
| Bande | A 650 | C t_max 25 % | C t_max 40 % |
|---|---|---|---|
| D1 | 47 % (moyen 47 %) | 50 % | 50 % |
| D2 | 51 % (moyen 48 %) | 54 % | 56 % |
| D3 | 54 % (moyen 49 %) | 57 % | 60 % |
| D4 | 56 % (moyen 49 %) | 59 % | 64 % |
| D5 | 58 % (moyen 50 %) | 61 % | 66 % |
| D6 | 59 % (moyen 51 %) | 62 % | 69 % |
| D7 | 61 % (moyen 52 %) | 64 % | 72 % |
| D8 | 63 % (moyen 54 %) | 66 % | 75 % |
| D9 | 65 % (moyen 56 %) | 68 % | 78 % |
| D10a | 67 % (moyen 59 %) | 70 % | 81 % |
| D10b | 69 % (moyen 62 %) | 71 % | 84 % |
| D10c | 70 % (moyen 64 %) | 73 % | 86 % |
| D10d (1 %) | 71 % (moyen 67 %) | 74 % | 87 % |
| D10e (0,1 %) | 72 % (moyen 71 %) | 75 % | 90 % |
Taux combiné IS 25 % + impôt personnel sur un dividende au sommet : A = 79 %, C 25 % = 81 %, C 40 % = 93 % (jamais ≥ 100 %).

### V4. Cas types (€/mois, loi actuelle → voie)
| Cas | Aujourd'hui | A 650 | Écart | C 25 % | Écart | C 40 % | Écart | Taux marginal sur l'heure (A / C 25 %) |
|---|---|---|---|---|---|---|---|---|
| Smicard à 15 h par semaine | 913 | 1102 | +189 | 1276 | +363 | 1276 | +363 | 47 % / 50 % |
| Smicard à 35 h | 1707 | 1704 | -4 | 1844 | +136 | 1844 | +136 | 47 % / 50 % |
| Cadre à 60 k€ brut par an | 3423 | 3776 | +353 | 3763 | +340 | 3376 | -47 | 65 % / 68 % |
| Retraité modeste (pension 800 € brut) | 1044 | 1044 | 0 | 1044 | 0 | 1044 | 0 | 47 % / 27 % |
| Retraité aisé (4 000 € brut + 15 000 € de capital par an) | 3996 | 2854 | -1141 | 2716 | -1279 | 2576 | -1419 | 61 % / 41 % |
| Dirigeant avec holding (30 000 € brut/mois + 300 000 € de bénéfices retenus par an) | 15221 | 14530 | -691 | 13460 | -1761 | 8325 | -6895 | 71 % / 74 % |
| Retraité de 62 ans qui continue à mi-temps | 2389 | 1785 | -604 | 1921 | -468 | 1920 | -469 | 49 % / 52 % |
| Salarié médian à 39 h (4 h supplémentaires) | 2476 | 2698 | +222 | 2772 | +296 | 2664 | +188 | 60 % / 63 % |
| Couple, 2 enfants, deux Smic à 35 h | 3736 | 3807 | +71 | 4088 | +352 | 4088 | +352 | 47 % / 50 % |
| Personne seule sans emploi (RSA + aide au logement) | 877 | 877 | +0 | 877 | +0 | 877 | +0 | 47 % / 27 % |
Dirigeant avec holding (A 650) : impôt payé dans l'année 341453 €, impôt différé 138216 €, crédit d'IS 75000 € ; revenu économique 21762 €/mois contre 33971 aujourd'hui.

### V5. Gagnants et perdants par bande (part des personnes qui gagnent ; écart moyen €/mois, central, travail + capital)
| Bande | A 650 : part gagnants | écart | C 25 % : part gagnants | écart |
|---|---|---|---|---|
| D1 | 77 % | +94 | 99 % | +235 |
| D2 | 77 % | +147 | 99 % | +272 |
| D3 | 77 % | +198 | 99 % | +312 |
| D4 | 99 % | +303 | 99 % | +403 |
| D5 | 99 % | +303 | 99 % | +392 |
| D6 | 77 % | +253 | 77 % | +328 |
| D7 | 77 % | +191 | 77 % | +244 |
| D8 | 77 % | +94 | 77 % | +115 |
| D9 | 23 % | -117 | 23 % | -142 |
| D10a | 23 % | -438 | 23 % | -557 |
| D10b | 1 % | -1439 | 1 % | -1696 |
| D10c | 0 % | -3182 | 0 % | -3655 |
| D10d (1 %) | 0 % | -8087 | 0 % | -9101 |
| D10e (0,1 %) | 0 % | -58092 | 0 % | -63637 |

### V6. Voie C sous contrainte « marginal asymptotique ≤ 75 % » (plat 30 %, t_max 45 %) : écart restant et leviers (Δ central, Md€/an, un levier à la fois)
Écart : solde public central = -253 Md€ (Δ = -84 ; statique 5).
| Levier | Δ central | Gain sur l'écart |
|---|---|---|
| plat + 5 points (35 %) | -8 | +76 |
| plat + 10 points (40 %) | 60 | +144 |
| t_max 45 → 60 % | -65 | +19 |
| sans prime d'activité | -16 | +68 |
| socle 650 → 600 € | -57 | +27 |
| socle 650 → 550 € | -30 | +54 |
| IS à 30 % | -74 | +10 |
| CIR remplacé par 4 Md€ | -80 | +4 |
| sous-indexation de 2 points | -60 | +23 |
| sans compléments ciblés (ASPA, AAH, RSA) | -86 | -2 |
| socle dégressif D2 (800 → 650 €, R1 = 2 500 €) | 154 | +238 |
| D2 avec S = 650 et R1 = 2 000 € | 162 | +246 |

Combinaisons de leviers sur C (t_max 45 %) :
| Combinaison | Δ central | Solde public central | Marginal asymptotique |
|---|---|---|---|
| D2 (S = 650, R1 = 2 000 €) + sans prime d'activité | 226 | 57 | 75 % |
| D2 (S = 650, R1 = 2 000 €), prime conservée | 162 | -7 | 75 % |
| D2 (S = 800, R1 = 2 500 €), plat 35 % | 198 | 29 | 80 % |
| plat 40 % + sans prime + socle 600 € | 153 | -16 | 85 % |

### V7. IS conservé : recette, taux 25 % et 30 % (Md€/an, base 68,0 en 2024)
| Taux | Statique | Bas | Central | Haut |
|---|---|---|---|---|
| 25 % | 68 | 68 | 68 | 68 |
| 30 % | 81,6 | 80 | 78,3 | 76,7 |
Δ central de la voie A 650 si l'IS passe de 25 à 30 % : 9,9 Md€. Si le rendement de l'IS est celui du budget de l'État (57,4) au lieu de 68,0 : ≈ -10,6 Md€ sur toutes les voies.
Transparence des holdings en complément de l'IS (A 650, central) : 53,1 Md€ (flux imputé central 9 Md€ avant crédit d'IS de 25 % = 2,3 Md€). Sans IS (modèle v1) : +25,4 Md€. Part directe (statique) : 4,2 Md€ ; le reste est la neutralisation du report en holding (couverture H21, ⚠️).

### V8. Voie B : trajectoire sur 10 ans (A 650 €, plat 47 %, t_max 25 % ; central)
| Productivité | Indexation | S année 1 | S année 5 | S année 10 | Solde public année 10 | Année d'atteinte de 1 000 € |
|---|---|---|---|---|---|---|
| bas (COR 0,4 %) | productivité | 650 | 660 | 674 | 45 | 109 |
| bas (COR 0,4 %) | recettes (ε = 1,12) | 650 | 662 | 677 | 43 | 97 |
| bas (COR 0,4 %) | surplus de recettes affecté au socle | 660 | 702 | 754 | 0 | 32 |
| central (COR 0,7 %) | productivité | 650 | 668 | 692 | 76 | 63 |
| central (COR 0,7 %) | recettes (ε = 1,12) | 650 | 671 | 697 | 73 | 56 |
| central (COR 0,7 %) | surplus de recettes affecté au socle | 660 | 733 | 828 | 0 | 19 |
| haut (COR 1,0 %) | productivité | 650 | 676 | 711 | 107 | 44 |
| haut (COR 1,0 %) | recettes (ε = 1,12) | 650 | 680 | 719 | 103 | 40 |
| haut (COR 1,0 %) | surplus de recettes affecté au socle | 660 | 765 | 903 | 0 | 13 |
| IA ⚠️ (2,0 %) | productivité | 650 | 704 | 777 | 219 | 23 |
| IA ⚠️ (2,0 %) | recettes (ε = 1,12) | 650 | 710 | 794 | 209 | 20 |
| IA ⚠️ (2,0 %) | surplus de recettes affecté au socle | 660 | 873 | 1168 | 0 | 7 |
Socle maximal finançable au central avec les taux de A 650 (solde public ≥ 0) : 660 €/mois ; avec plat 50 % : 734 €/mois.

### V9. Socles dégressifs D1 à D4 (IS 25 %, c2 plat 30 % + continu 40 %, retraités imposés, holdings en transparence ; central)
| Variante | Socle S | R1 (€/mois) | Coût brut du socle (Md€) | Δ statique | Δ central | Solde public statique | Solde public central | Marginal effectif max. dans la zone de sortie (revenu mensuel où il se trouve) | Marginal au sommet |
|---|---|---|---|---|---|---|---|---|---|
| D1 | 800 | - | 530 | -60 | -136 | -229 | -305 | - | 70 % |
| D2 | 800 | 2000 | 147 | 252 | 146 | 83 | -23 | 70 % (de 83 à 1958 €/mois) | 70 % |
| D3 | 800 | 2000 | 216 | 202 | 101 | 33 | -68 | 68 % (de 83 à 83 €/mois) | 70 % |
| D4 | 800 | 2000 | 147 | 252 | 146 | 83 | -23 | 70 % (de 83 à 1958 €/mois) | 70 % |
| D2 | 800 | 2500 | 167 | 242 | 137 | 73 | -32 | 69 % (de 2458 à 2458 €/mois) | 70 % |
| D3 | 800 | 2500 | 242 | 183 | 83 | 14 | -86 | 64 % (de 11417 à 12500 €/mois) | 70 % |
| D4 | 800 | 2500 | 167 | 242 | 137 | 73 | -32 | 69 % (de 2458 à 2458 €/mois) | 70 % |
| D2 | 800 | 3000 | 189 | 228 | 121 | 59 | -48 | 70 % (de 2917 à 2958 €/mois) | 70 % |
| D3 | 800 | 3000 | 265 | 166 | 67 | -3 | -102 | 65 % (de 13458 à 15000 €/mois) | 70 % |
| D4 | 800 | 3000 | 189 | 228 | 121 | 59 | -48 | 70 % (de 2917 à 2958 €/mois) | 70 % |
| D1 | 1000 | - | 663 | -171 | -251 | -340 | -420 | - | 70 % |
| D2 | 1000 | 2000 | 192 | 221 | 91 | 52 | -78 | 80 % (de 83 à 1958 €/mois) | 70 % |
| D3 | 1000 | 2000 | 273 | 158 | 42 | -11 | -127 | 78 % (de 83 à 83 €/mois) | 70 % |
| D4 | 1000 | 2000 | 192 | 221 | 91 | 52 | -78 | 80 % (de 83 à 1958 €/mois) | 70 % |
| D2 | 1000 | 2500 | 215 | 208 | 82 | 39 | -87 | 77 % (de 2458 à 2458 €/mois) | 70 % |
| D3 | 1000 | 2500 | 306 | 135 | 20 | -35 | -149 | 69 % (de 83 à 83 €/mois) | 70 % |
| D4 | 1000 | 2500 | 215 | 208 | 82 | 39 | -87 | 77 % (de 2458 à 2458 €/mois) | 70 % |
| D2 | 1000 | 3000 | 243 | 191 | 62 | 22 | -107 | 76 % (de 2917 à 2958 €/mois) | 70 % |
| D3 | 1000 | 3000 | 333 | 113 | 0 | -56 | -169 | 65 % (de 13375 à 15000 €/mois) | 70 % |
| D4 | 1000 | 3000 | 243 | 191 | 62 | 22 | -107 | 76 % (de 2917 à 2958 €/mois) | 70 % |

Même comparaison avec la moitié des adultes hors emploi et retraite supposés sans ressources de foyer (partInactifsSocle = 0,5), S = 800, R1 = 2 500 :
- D1 : coût brut 530 Md€, solde central -305 Md€
- D2 : coût brut 110 Md€, solde central 24 Md€
- D3 : coût brut 186 Md€, solde central -30 Md€
- D4 : coût brut 110 Md€, solde central 24 Md€

### V10. Taux marginal effectif total selon le revenu (D2, S = 800, R1 = 2 500 ; D1 pour comparaison), revenu mensuel de travail
| Revenu mensuel (coût employeur) | D1 | D2 | D3 (R1 = 2 500) | D2 R1 = 2 000 | D2 R1 = 3 000 |
|---|---|---|---|---|---|
| 1500 € | 30 % | 62 % | 48 % | 70 % | 57 % |
| 2000 € | 30 % | 62 % | 44 % | 30 % | 57 % |
| 2500 € | 38 % | 38 % | 50 % | 38 % | 65 % |
| 3000 € | 43 % | 43 % | 53 % | 43 % | 43 % |
| 4000 € | 50 % | 50 % | 56 % | 50 % | 50 % |
| 6000 € | 57 % | 57 % | 60 % | 57 % | 57 % |
| 10000 € | 62 % | 62 % | 63 % | 62 % | 62 % |
| 20000 € | 66 % | 66 % | 66 % | 66 % | 66 % |
| 100000 € | 69 % | 69 % | 69 % | 69 % | 69 % |

Cas types sous D2 (S = 800, R1 = 2 500, plat 30 % + continu 40 %) :
- Smicard à 15 h par semaine : 1124 €/mois (aujourd'hui 913), taux marginal sur l'heure 62 %, socle perçu 527 €
- Smicard à 35 h : 1555 €/mois (aujourd'hui 1707), taux marginal sur l'heure 62 %, socle perçu 164 €
- Cadre à 60 k€ brut par an : 3949 €/mois (aujourd'hui 3423), taux marginal sur l'heure 59 %, socle perçu 0 €
- Retraité modeste (pension 800 € brut) : 723 €/mois (aujourd'hui 1044), taux marginal sur l'heure 40 %, socle perçu 544 €
- Retraité aisé (4 000 € brut + 15 000 € de capital par an) : 3147 €/mois (aujourd'hui 3996), taux marginal sur l'heure 55 %, socle perçu 0 €
- Dirigeant avec holding (30 000 € brut/mois + 300 000 € de bénéfices retenus par an) : 15942 €/mois (aujourd'hui 15221), taux marginal sur l'heure 69 %, socle perçu 0 €
- Retraité de 62 ans qui continue à mi-temps : 1906 €/mois (aujourd'hui 2389), taux marginal sur l'heure 42 %, socle perçu 0 €
- Salarié médian à 39 h (4 h supplémentaires) : 2654 €/mois (aujourd'hui 2476), taux marginal sur l'heure 51 %, socle perçu 0 €
- Couple, 2 enfants, deux Smic à 35 h : 3511 €/mois (aujourd'hui 3736), taux marginal sur l'heure 62 %, socle perçu 728 €
- Personne seule sans emploi (RSA + aide au logement) : 800 €/mois (aujourd'hui 877), taux marginal sur l'heure 62 %, socle perçu 800 €

### 6.2 Lecture des tableaux dégressifs (D1 à D4)

- **Coût brut** : le socle universel à 800 € coûte 530 Md€ (D1) ; la sortie linéaire à R1 = 2 500 €/mois le ramène à 167 Md€ (D2), la sortie exponentielle à 242 Md€ (D3). La version dégressive est donc de **−290 à −380 Md€** moins chère que l'universel, mais **elle n'est plus universelle** : la majorité des salariés au-dessus de R1 ne perçoit plus rien (⚠️ R1 compare le revenu individuel, pas celui du foyer).
- **Solde public central** (plat 30 % + continu 40 %, marginal asymptotique 70 %) : D1 −305 Md€ ; D2 (800 €) −23 à −48 selon R1 ; D3 −68 à −102 ; **D4 = D2** : la réduction pour patrimoine ne mord pas dans le modèle (le capital est comonotone avec le revenu : personne n'a à la fois un revenu sous R1 et un patrimoine > 500 k€). Le cas visé (retraité propriétaire de placements à faible revenu) exige des données de patrimoine par revenu (Insee, enquête Histoire de vie et patrimoine ; non lue ⚠️). À 1 000 €, D2 reste en déficit (−78 à −107).
- **Où se situe le taux marginal effectif le plus élevé** : (i) **à la sortie du socle, juste avant R1** : en D2 à S = 800 €, c'est un **plateau à 70 % de 83 à 1 958 €/mois pour R1 = 2 000 €** (pente 40 % + plat 30 %) et **69 % à 2 458 €/mois pour R1 = 2 500 €** (pente 32 % + plat 30 % + continu 7 %), **puis une chute de ≈ 30 points juste après R1** ; à **S = 1 000 €, il monte à 76-80 %** ; (ii) en D3 (exponentielle), le plus élevé est **au bas de l'échelle** (≈ 48 % à 1 500 €/mois pour R1 = 2 500, S = 800) puis décroît lentement, 64-65 % à l'échelle du 10 000-15 000 €/mois quand l'impôt continu reprend la main ; **la sortie exponentielle lisse la bosse mais l'étale sur toute l'échelle** ; (iii) en D1 (socle universel), le maximum est **au sommet** (70 %, plat 30 % + continu 40 %). Le revenu où la pente de sortie s'ajoute le plus à l'impôt est donc **le haut du smic et le salaire médian-bas (2 000 à 3 000 €/mois)** : exactement la zone des smicards et des temps pleins modestes.
- **Cas types sous D2** (S = 800, R1 = 2 500, plat 30 % + continu 40 %) : smicard à 35 h **−152 €/mois** (1 555 contre 1 707), couple de deux Smic avec deux enfants **−225 €** (3 511 contre 3 736), retraité modeste 723 € (contre 1 044, sans plancher ASPA), retraité aisé −849 €, smicard à 15 h **+211 €**, cadre à 60 k€ **+526 €**. Le socle dégressif **reprend aux salariés modestes à temps plein ce qu'il donne aux temps partiels**, ce que l'universel ne fait pas.
- **Sensibilité** : si la moitié des adultes hors emploi et retraite vit dans un foyer qui dépasse R1 (partInactifsSocle = 0,5), D2 coûte 110 Md€ et le solde central passe de −32 à **+24 Md€**.

### 6.3 Vérification des faits sur l'IS (consultation du 31/10/2026)

- Taux normal **25 %**, taux réduit **15 %** jusqu'à 42 500 € de bénéfice pour les PME (CA < 10 M€, capital détenu à 75 % au moins par des personnes physiques), **non modifiés par la loi de finances pour 2026** (sources secondaires : [Hayot Expertise](https://hayot-expertise.fr/blog/is-2026-taux-normal-taux-reduit-15-seuils), [Swim Legal](https://www.swim.legal/blog/taux-reduit-is-15-conditions-plafond-calcul-pme)) ⚠️ à reconfirmer sur Légifrance (art. 219 du CGI). Un amendement de commission du PLF 2027 porterait le plafond à 49 000 € (non adopté à ce stade ⚠️). Coût du taux réduit PME : 1,8 Md€ (⚠️ source secondaire).
- Rendement : **68,0 Md€ en 2024** (comptabilité nationale, `sources/recherche-donnees-simulateur.md`) ; 57,4 Md€ au budget de l'État la même année ; ≈ 62 Md€ en 2026 selon un site secondaire non recoupé ⚠️. Surtaxe exceptionnelle sur les grandes entreprises (2025-2026) : estimations divergentes (≈ 2 à 7,3 Md€ ⚠️), non incluse.
- Le modèle retient 68,0 par cohérence avec les 885,9 Md€ de prélèvements du simulateur ; l'écart avec 57,4 vaut ≈ −10,6 Md€ pour chaque voie.

### 6.4 Écart restant et levier

Écart restant : **aucune voie n'équilibre au haut** (−90 à −196 Md€) ; **A et B année 1 équilibrent au central de justesse, C seulement à ≈ 50 % de taux plat**. Le **levier le plus efficace** est le socle dégressif (+240 Md€) ; les leviers les plus faibles par point d'impôt sont l'IS à 30 % (+10) et le CIR remplacé (+4). Le choix à faire par l'auteur n'est donc plus « quelle mesure », mais **quel arbitre entre universalité du socle et taux marginal de 62 à 70 % pour 1 500 à 3 000 €/mois** : un socle universel n'est finançable qu'avec un taux plat d'environ 47 à 50 %, un socle dégressif l'est à 30-35 % mais crée une trappe.

---

## 7. Santé (31/10/2026, brique `sante.js`, hypothèses H53 à H64)

Commande : `jsc modele.js voies.js sante.js rapport_sante.js`. Lecture détaillée des sources : `sources/recherche-sante-leviers.md`. Convention : économies **par rapport à la trajectoire de référence** (la dépense de santé continue de monter), Md€ par an à effet plein ; « favorable » = scénario bas du modèle, « défavorable » = scénario haut.

### 7.0 Ce qu'il faut retenir (écrit pour être vrai)

1. **La santé ajoute 9,7 Md€ au solde central (12,6 favorable, 2,75 défavorable) et fait gagner 0,7 point de taux plat.** Les voies A, B et C passent d'une marge d'investissement de 1 à 6 Md€ à **11 à 15 Md€** au central : mieux, mais c'est **encore trop peu pour financer** des centres de calcul ou des entreprises d'intérêt commun, et **le solde reste négatif au scénario haut dans toutes les voies** (−87 à −194 Md€).
2. **Ces économies ne baissent pas la dépense de santé.** Avec une régulation volontariste, la CNAM projette +44 Md€ de dépense d'ici 2030 ; le central représente 22 % de cette hausse. Le modèle étant statique en base 2024, **un solde « amélioré » de 9,7 Md€ en 2024 peut être absorbé dès 2030 par la hausse tendancielle** (déficit de la branche maladie : 13,8 Md€ en 2026). La santé est un levier de **soutenabilité**, pas de marge.
3. **Le levier le plus cité, le double guichet AMO/AMC, n'améliore pas le solde public.** Il fait gagner 3,2 à 7,4 Md€ de frais de gestion aux **payeurs** (primes et cotisations), mais déplace 22,5 à 33,5 Md€ de dépense vers le public et fait perdre 3,6 à 6,2 Md€ de TSA : **26 à 40 Md€ à financer par un prélèvement** (1,8 à 2,7 points de taux plat), solde public inchangé après financement. C'est un gain de pouvoir d'achat, avec 8,75 Md€ de gestion des complémentaires (18,8 % de leurs cotisations) comme enjeu et des salariés à reconvertir (effectif non trouvé ⚠️).
4. **Les montants de dépense et les propositions chiffrées sont lus à la source (CNAM, Cour des comptes, CEPS, DREES) ; cinq éléments manquent** : coûts administratifs hospitaliers, économies du dossier médical partagé, effet des taxes comportementales sur la dépense, renoncement aux soins en France, taux de TSA actuel (⚠️ dans `sources/recherche-sante-leviers.md` § 10).
5. **Les économies annoncées se réalisent mal** : 78 % de réalisation sur les produits de santé en 2025 (Cour, mai 2026), « mal ou pas mesurées ex post » pour la pertinence et l'efficience hospitalière. D'où un cas défavorable à 2,75 Md€.

### 7.1 Leviers de santé (Md€/an, effet plein, par rapport à la trajectoire de référence)
| Levier | Favorable (scénario bas) | Central | Défavorable (scénario haut) | Délai (années) |
|---|---|---|---|---|
| (a) Pertinence des soins, maîtrise médicalisée, qualité (hors fraude) | 4,5 | 4 | 0,85 | 3 à 5 |
| (c) Prix, génériques, biosimilaires, dispositifs médicaux | 5,3 | 3,4 | 1,3 | 1 à 4 |
| (d) Hôpital : achats, virage ambulatoire, restructuration des services à risque | 2,6 | 2,2 | 0,6 | 3 à 6 |
| (e) Prévention (Nutri-Score, activité physique, programmes ciblés) : dépense de soins évitée | 0,22 | 0,1 | 0 | 10 à 25 |
| (f) Franchises et reste à charge (optionnel, désactivé par défaut) (non compté) | 0,5 | 0,3 | 0,3 | 1 |
| (g) Numérique (DMP, Mon espace santé) : examens redondants évités | 0 | 0 | 0 | inconnu |
| **Total compté** | **12,62** | **9,7** | **2,75** | |
| Total avec franchises optionnelles | 13,12 | 10 | 3,05 | |

### 7.2 Solde et marge d'investissement des voies, sans et avec la santé (Md€/an, taux de la voie inchangés)
| Voie | Taux plat / t_max | Solde central sans santé | avec santé | Marge sans → avec | Solde bas (sans → avec) | Solde haut (sans → avec) | Plat d'équilibre sans → avec |
|---|---|---|---|---|---|---|---|
| A, socle 600 € | 45 % / 25 % | 4 | 13 | 4 → 13 | 57 → 69 | -90 → -87 | 44,8 % → 44,1 % |
| A, socle 650 € | 47 % / 25 % | 6 | 15 | 6 → 15 | 66 → 79 | -101 → -99 | 46,6 % → 46 % |
| A, socle 700 € | 49 % / 25 % | 6 | 15 | 6 → 15 | 75 → 88 | -115 → -113 | 48,6 % → 47,9 % |
| B, année 1 (= A 650 €) | 47 % / 25 % | 6 | 15 | 6 → 15 | 66 → 79 | -101 → -99 | 46,6 % → 46 % |
| C, t_max 25 % | 50 % / 25 % | 1 | 11 | 1 → 11 | 71 → 84 | -125 → -123 | 49,9 % → 49,2 % |
| C, t_max 40 % | 50 % / 40 % | 4 | 14 | 4 → 14 | 126 → 139 | -196 → -194 | 49,6 % → 48,6 % |

### 7.3 Un levier à la fois sur la voie A 650 € (solde central, Md€/an)
| Levier retiré | Économie retirée | Solde central |
|---|---|---|
| aucun (les quatre leviers comptés) | 0 | 15,3 |
| (a) Pertinence des soins | −4 | 11,3 |
| (c) Prix | −3,4 | 11,9 |
| (d) Hôpital | −2,2 | 13,1 |
| (e) Prévention | −0,1 | 15,2 |
| aucun levier (sans santé) | −9,7 | 5,6 |
| franchises optionnelles comptées en plus | +0,3 | 15,6 |
Un point de taux plat rapporte ≈ 14,5 Md€ (voie A 650 €) : l'économie de santé centrale (9,7) vaut donc ≈ 0,67 point de taux plat.

### 7.4 Double guichet AMO/AMC (Md€/an)
| Cas | Gain net des payeurs (gestion évitée) | Dépense publique nouvelle | TSA perdue | À financer | Solde public après financement à l'euro près | Équivalent en points de taux plat (voie A 650 €) |
|---|---|---|---|---|---|---|
| HCAAM 2022, sans désaffiliation induite | 3,2 | 22,5 | 3,6 | 26,1 | 0 | 1,8 |
| HCAAM 2022, scénario 3 (base 2017) | 5,4 | 22,5 | 3,6 | 26,1 | 0 | 1,8 |
| Borne haute : AMC supprimées (données 2024-2025) | 7,4 | 33,5 | 6,2 | 39,6 | 0 | 2,7 |
Si le prélèvement n'était PAS affecté et que l'État gardait tout le gain (cas extrême, scénario 3) : solde public +5,4 Md€ ; sans financement du tout : -26,1 Md€.
Frais de gestion des organismes complémentaires 2024 : 8,75 Md€, soit 18,8 % des cotisations (46,5 Md€).

### 7.5 Lecture et réserves

- Les tableaux 7.2 (avec santé) reprennent les taux plats des voies de `resultats.md` § 6 (V1) sans les changer : la santé n'est pas utilisée pour baisser les taux, elle est montrée à côté. Au taux plat d'équilibre avec santé, la voie A 650 € passe de 46,6 % à 46,0 %.
- La santé n'est **pas** un levier du socle : un point de taux plat (≈ 14,5 Md€) vaut plus que l'économie de pertinence centrale (4,0).
- **À vérifier avant de citer** : le 5,4 Md€ du HCAAM (net ou non de la gestion de l'AMO), le taux de TSA, le cumul de quatre années de baisses de prix (3,4 Md€), l'absence d'estimation pour le numérique et pour l'administration hospitalière (voir `sources/recherche-sante-leviers.md` § 10 et `verifications.md`, V2623 et suivants).

## 8. Optimisation (01/11/2026, `optimisation.js`, hypothèses H65 à H70)

> Question de l'auteur (T47) : quelle combinaison de paramètres maximise la marge d'investissement au scénario central, IS conservé et santé comprise, sous des contraintes de taux marginal, de planchers et de non-perte pour deux cas types ? Code : `optimisation.js` (fonctions pures au-dessus de `modele.js`, `voies.js`, `sante.js`), tests : `test_optimisation.js` (49 contrôles ; les 41, 33 et 30 contrôles précédents passent toujours), tableaux : `rapport_optimisation.js` (un plafond à la fois, une à deux minutes sous `jsc`). Md€ de 2024 ; solde public = −169,1 + Δ + santé ; **marge d'investissement = max(0 ; solde central)**. Des ordres de grandeur sous hypothèses, jamais des prédictions.

### 8.0 Ce qu'il faut retenir (écrit pour être vrai)

1. **Meilleure combinaison avec un taux marginal effectif total ≤ 70 % partout** : socle universel de 550 €, taux plat 49 %, impôt continu t_max 20 % à partir de R0 = 12 000 € par an, prime d'activité progressive de 200 €, pensions sous-indexées d'1,5 point, IS à 30 %, transparence des holdings. **Solde central 135 Md€ (marge 135), bas 202, haut +8.** Avec l'**IS gardé à 25 %** (décision de l'auteur) : **125 central, 190 bas, −0,3 haut**. Pour comparaison, la voie A à 650 € (taux marginal asymptotique 72 %) donne 15 Md€ avec la santé (§ 7.2).
2. **Meilleure combinaison avec un taux marginal ≤ 60 % partout** : socle de 550 € qui s'éteint avec le revenu (exponentiel, R1 = 3 000 €/mois), taux plat 35 %, t_max 25 %, R0 = 12 000 €, prime 200 €, sous-indexation 1,5 point, holdings transparentes. **Solde central 92 Md€ (IS 30 %) ou 82 Md€ (IS 25 %)** ; haut +10 ou +2.
3. **Frontière** : chaque point de plafond coûte de l'ordre de 4 à 8 Md€ de marge entre 50 et 75 % ; au-delà de 75 % le gain s'arrête (le meilleur reste à 75 % jusqu'à 80 %, puis +8 Md€ jusqu'à 83 %) et le scénario haut devient négatif (−40 à 90 %). Passer de 70 à 60 % coûte 43 Md€ (135 → 92) ; de 60 à 50 %, 72 Md€ (92 → 20).
4. **Ce que le balayage trouve est surtout un effet de niveau** : le solde se joue sur le socle (+46 Md€ pour 100 € de moins entre 650 et 550 €, −135 Md€ à 800 €, −260 Md€ à 1 000 €), la prime (+94 Md€ : elle permet de garder le taux plat haut sans faire perdre le smicard), l'impôt continu avec R0 bas (+46 Md€ contre R0 = 24 000 €), les holdings (+54 Md€, **⚠️ H21 non sourcée : couverture 70 %**), la sous-indexation (+40 Md€) et l'IS à 30 % (+10 Md€). Aucun socle dégressif ne fait mieux qu'un socle universel bas à ≤ 70 % : la sortie du socle ajoute du taux marginal que le plafond interdit (la forme exponentielle n'apparaît qu'à 60-65 %).
5. **Les optimums sont aux bords de la grille** : socle 500-550 € (bas de la plage demandée), R0 = 12 000 € (bas de la grille), prime 200 € (haut), sous-indexation 1,5 point (haut), holdings et IS 30 % (haut). Le balayage dit « pousse chaque levier » ; il ne dit pas si c'est acceptable. **Les contraintes ne couvrent que ce que l'auteur a demandé** : planchers ASPA/AAH/RSA, smicard, retraité modeste. Les chômeurs indemnisés (37,1 Md€ de prestations remplacées par un socle de 550 €), les familles (prestations familiales 35,2 Md€ remplacées, 200 € par enfant) et les étudiants ne sont pas vérifiés un à un ⚠️ : un socle de 550 € est **inférieur au RSA seul (650 €)** pour toute personne que les planchers ne couvrent pas.
6. **Qui perd** (≤ 70 %) : le retraité aisé (−1 479 €/mois), le retraité de 62 ans qui continue à mi-temps (−582), les bandes D8 à D10 (moins d'un quart des personnes gagnent ; −116 €/mois en moyenne au D8, −350 au D9, −682 au D10a). Le smicard à 35 h perd 4 €/mois (tolérance fixée à −10, § H67) ; il ne gagne pas, la prime sert à l'empêcher de perdre. À ≤ 60 %, le dirigeant avec holding **gagne** 3 100 €/mois par rapport à aujourd'hui : plafonner le taux marginal à 60 % laisse peu de prise sur les très hauts revenus du capital.
7. **Taux combiné avec l'IS** : l'IS de 25 % s'ajoute (taux plafonné hors IS) ; un dividende au sommet est prélevé à **78 % (≤ 70 %, IS 30 %) ou 72 % (≤ 60 %)**, au-dessus du plafond de 70 % : à nommer.
8. **Fragilité** : (a) tout vient d'un modèle statique en base 2024 ; (b) **la santé (9,7 Md€) est un écart à la tendance**, pas une baisse de dépense (§ 7.0) ; (c) le scénario haut est à peine positif (+8, −0,3 à IS 25 %) alors qu'il était à −99 pour la voie A à 650 € avec la santé (§ 7.2) ; (d) les coûts de transition (≈ 6,5 Md€ par an annualisés) et le remplacement du CIR ne sont pas comptés ici (comme au § 6).

### 8.1 Méthode (hypothèses H65 à H70 dans `methode.md` § 9)

- **Grille** : socle 500, 550, 600, 650, 700, 800, 900, 1 000 € ; forme : universel, linéaire (R1 = 1 500, 2 000, 2 500, 3 000, 4 000 €/mois), exponentiel (R1 = 1 000, 1 500, 2 000, 3 000) ; t_max 0, 5, 10, 20, 25, 30, 40 % ; R0 12 000, 18 000, 24 000, 30 000 € ; prime progressive 0, 100, 200 € ; sous-indexation 0, 0,5, 1, 1,5 point ; IS 25 ou 30 % ; holdings transparentes ou non : **107 520 structures** par plafond, et pour chacune le taux plat est borné par le plafond puis descendu par pas d'un point (jusqu'à trois taux admissibles comparés). **Ce n'est pas une preuve d'optimum global** : le taux plat est cherché au point près, les autres paramètres sur la grille ci-dessus.
- **Contraintes** : (1) taux marginal effectif total (impôt + sortie du socle, travail seul) ≤ plafond pour tout revenu de 3 000 € à 3 M€ par an et à la limite, ce qui implique taux plat + t_max ≤ plafond ; (2) aucun cas type sous son socle, retraité modeste au plancher ASPA (1 043,59 €), personne au RSA à 877 € (les compléments ASPA, AAH différentielle et RSA sont toujours actifs) ; (3) smicard à 35 h : écart ≥ −10 €/mois ; (4) retraité modeste : écart ≥ −0,5 €/mois.
- **Santé** : économies centrales de `sante.js` (9,7 Md€ ; 12,62 bas, 2,75 haut) ajoutées au solde. **Correction** : en socle dégressif, le plancher ASPA est plus coûteux que dans `modele.js` (qui le calcule sur le socle plein) ; elle est retranchée (0,2 Md€ pour l'exponentiel R1 = 3 000 €).

### 8.2 Frontière marge / taux marginal maximal

**Tous leviers libres (IS 25 ou 30 %)**

| Plafond de taux marginal | Solde central avec santé (Md€/an) | Solde bas | Solde haut | Marginal atteint | Combinaison | Structures admissibles |
|---|---|---|---|---|---|---|
| ≤ 50 % | 19,8 (marge 19,8) | 44,1 | -17,6 | 49 % | socle 500 € universel, plat 49 %, t_max 0 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes | 76224 / 107520 |
| ≤ 55 % | 61,9 (marge 61,9) | 93,4 | 7,6 | 54 % | socle 500 € universel, plat 49 %, t_max 5 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes | 84320 / 107520 |
| ≤ 60 % | 91,7 (marge 91,7) | 135,9 | 9,9 | 60 % | socle 550 € exponentiel R1 3000, plat 35 %, t_max 25 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes | 91552 / 107520 |
| ≤ 65 % | 110,8 (marge 110,8) | 163,2 | 11 | 64 % | socle 550 € exponentiel R1 3000, plat 34 %, t_max 30 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes | 98080 / 107520 |
| ≤ 70 % | 135,2 (marge 135,2) | 201,5 | 7,8 | 69 % | socle 550 € universel, plat 49 %, t_max 20 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes | 101296 / 107520 |
| ≤ 75 % | 158,2 (marge 158,2) | 240,3 | 2,8 | 75 % | socle 500 € universel, plat 45 %, t_max 30 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes | 103008 / 107520 |
| ≤ 80 % | 158,2 (marge 158,2) | 240,3 | 2,8 | 75 % | socle 500 € universel, plat 45 %, t_max 30 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes | 105712 / 107520 |
| ≤ 90 % | 165,8 (marge 165,8) | 279 | -40,3 | 83 % | socle 500 € universel, plat 43 %, t_max 40 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes | 107264 / 107520 |

**IS conservé à 25 % seulement (décision de l'auteur du 31/10)**

| Plafond | Solde central | Solde bas | Solde haut | Marginal atteint | Combinaison | Structures admissibles |
|---|---|---|---|---|---|---|
| ≤ 60 % | 81,9 (marge 81,9) | 124,2 | 1,8 | 60 % | socle 550 € exponentiel R1 3000, plat 35 %, t_max 25 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 25 %, holdings transparentes | 45776 / 53760 |
| ≤ 70 % | 125,3 (marge 125,3) | 189,8 | -0,3 | 69 % | socle 550 € universel, plat 49 %, t_max 20 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 25 %, holdings transparentes | 50648 / 53760 |


Lecture : « Structures admissibles » = structures pour lesquelles au moins un taux plat respecte les quatre contraintes. Plafond ≤ 50 % : le modèle trouve encore 20 Md€ au central mais le scénario haut est à −18. À 75 et 80 %, la même combinaison (le marginal atteint 75 %). À 90 %, le marginal atteint est 83 % (t_max 40 %, plat 43 %).

### 8.3 Détail des combinaisons à ≤ 70 % et ≤ 60 % (cas types, perdants, sensibilité)

#### Plafond 60 %, IS 25 ou 30 %
socle 550 € exponentiel R1 3000, plat 35 %, t_max 25 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes
Solde public central : sans santé 82, santé 9,7, total 91,7 ; bas 135,9 ; haut 9,9 (correction ASPA 0,2). Taux marginal total maximal 60 % (limite atteinte aux très hauts revenus, impôt + sortie du socle) ; avec l'IS, taux combiné sur un dividende 72 %.
Smicard à 35 h : -7,1 €/mois ; retraité modeste : 0 €/mois.
| Cas type | Aujourd'hui | Après | Écart |
|---|---|---|---|
| Smicard à 15 h par semaine | 913 | 1168 | +255 |
| Smicard à 35 h | 1707 | 1700 | -7 |
| Cadre à 60 k€ brut par an | 3423 | 3837 | +414 |
| Retraité modeste (pension 800 € brut) | 1044 | 1044 | 0 |
| Retraité aisé (4 000 € brut + 15 000 € de capital par an) | 3996 | 2817 | -1178 |
| Dirigeant avec holding (30 000 € brut/mois + 300 000 € de bénéfices retenus par an) | 15221 | 18320 | +3099 |
| Retraité de 62 ans qui continue à mi-temps | 2389 | 1934 | -455 |
| Salarié médian à 39 h (4 h supplémentaires) | 2476 | 2625 | +149 |
| Couple, 2 enfants, deux Smic à 35 h | 3736 | 3801 | +65 |
| Personne seule sans emploi (RSA + aide au logement) | 877 | 877 | +0 |
Bandes où moins de la moitié des personnes gagnent : D9 (23 % gagnent, -30 €/mois), D10a (23 % gagnent, -92 €/mois), D10b (1 % gagnent, -644 €/mois), D10c (0 % gagnent, -1621 €/mois), D10d (1 %) (0 % gagnent, -4508 €/mois), D10e (0,1 %) (0 % gagnent, -36782 €/mois).
Sensibilité (taux plat réoptimisé, variation du solde central, Md€/an) :
| Variante | Taux plat | Solde central | Écart |
|---|---|---|---|
| socle 650 € au lieu de 550 | 35 % | 60,5 | -31,2 |
| socle 800 € | 33 % | -18,9 | -110,6 |
| socle 1 000 € | 29 % | -152,7 | -244,4 |
| IS 25 % | 35 % | 81,9 | -9,9 |
| holdings non transparentes | 35 % | 54 | -37,8 |
| sans prime d'activité | 25 % | -24,1 | -115,8 |
| sans sous-indexation des pensions | 35 % | 44 | -47,7 |
| R0 = 24 000 € | 35 % | 5,1 | -86,6 |
| t_max = 0 (pas d'impôt continu) | 38 % | -71,6 | -163,3 |
| socle universel | 35 % | -55,5 | -147,2 |
| socle linéaire R1 2 000 € | 20 % | -128,9 | -220,7 |

#### Plafond 70 %, IS 25 ou 30 %
socle 550 € universel, plat 49 %, t_max 20 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 30 %, holdings transparentes
Solde public central : sans santé 125,5, santé 9,7, total 135,2 ; bas 201,5 ; haut 7,8 (correction ASPA 0). Taux marginal total maximal 69 % (limite atteinte aux très hauts revenus, impôt + sortie du socle) ; avec l'IS, taux combiné sur un dividende 78 %.
Smicard à 35 h : -3,8 €/mois ; retraité modeste : 0 €/mois.
| Cas type | Aujourd'hui | Après | Écart |
|---|---|---|---|
| Smicard à 15 h par semaine | 913 | 1184 | +271 |
| Smicard à 35 h | 1707 | 1704 | -4 |
| Cadre à 60 k€ brut par an | 3423 | 3547 | +124 |
| Retraité modeste (pension 800 € brut) | 1044 | 1044 | 0 |
| Retraité aisé (4 000 € brut + 15 000 € de capital par an) | 3996 | 2517 | -1479 |
| Dirigeant avec holding (30 000 € brut/mois + 300 000 € de bénéfices retenus par an) | 15221 | 14823 | -398 |
| Retraité de 62 ans qui continue à mi-temps | 2389 | 1807 | -582 |
| Salarié médian à 39 h (4 h supplémentaires) | 2476 | 2540 | +64 |
| Couple, 2 enfants, deux Smic à 35 h | 3736 | 3807 | +71 |
| Personne seule sans emploi (RSA + aide au logement) | 877 | 877 | +0 |
Bandes où moins de la moitié des personnes gagnent : D8 (23 % gagnent, -116 €/mois), D9 (23 % gagnent, -350 €/mois), D10a (1 % gagnent, -682 €/mois), D10b (0 % gagnent, -1653 €/mois), D10c (0 % gagnent, -3296 €/mois), D10d (1 %) (0 % gagnent, -7836 €/mois), D10e (0,1 %) (0 % gagnent, -53778 €/mois).
Sensibilité (taux plat réoptimisé, variation du solde central, Md€/an) :
| Variante | Taux plat | Solde central | Écart |
|---|---|---|---|
| socle 650 € au lieu de 550 | 50 % | 89,6 | -45,6 |
| socle 800 € | 50 % | 0,1 | -135,1 |
| socle 1 000 € | 50 % | -124,8 | -260 |
| IS 25 % | 49 % | 125,3 | -9,9 |
| holdings non transparentes | 49 % | 81,5 | -53,8 |
| sans prime d'activité | 39 % | 41,3 | -94 |
| sans sous-indexation des pensions | 49 % | 95,1 | -40,1 |
| R0 = 24 000 € | 50 % | 88,9 | -46,3 |
| t_max = 0 (pas d'impôt continu) | 52 % | 45,1 | -90,2 |
| socle universel | 49 % | 135,2 | +0 |
| socle linéaire R1 2 000 € | 21 % | -158,7 | -293,9 |

#### Plafond 60 %, IS 25 %
socle 550 € exponentiel R1 3000, plat 35 %, t_max 25 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 25 %, holdings transparentes
Solde public central : sans santé 72,2, santé 9,7, total 81,9 ; bas 124,2 ; haut 1,8 (correction ASPA 0,2). Taux marginal total maximal 60 % (limite atteinte aux très hauts revenus, impôt + sortie du socle) ; avec l'IS, taux combiné sur un dividende 70 %.
Smicard à 35 h : -7,1 €/mois ; retraité modeste : 0 €/mois.
| Cas type | Aujourd'hui | Après | Écart |
|---|---|---|---|
| Smicard à 15 h par semaine | 913 | 1168 | +255 |
| Smicard à 35 h | 1707 | 1700 | -7 |
| Cadre à 60 k€ brut par an | 3423 | 3837 | +414 |
| Retraité modeste (pension 800 € brut) | 1044 | 1044 | 0 |
| Retraité aisé (4 000 € brut + 15 000 € de capital par an) | 3996 | 2817 | -1178 |
| Dirigeant avec holding (30 000 € brut/mois + 300 000 € de bénéfices retenus par an) | 15221 | 18320 | +3099 |
| Retraité de 62 ans qui continue à mi-temps | 2389 | 1934 | -455 |
| Salarié médian à 39 h (4 h supplémentaires) | 2476 | 2625 | +149 |
| Couple, 2 enfants, deux Smic à 35 h | 3736 | 3801 | +65 |
| Personne seule sans emploi (RSA + aide au logement) | 877 | 877 | +0 |
Bandes où moins de la moitié des personnes gagnent : D9 (23 % gagnent, -30 €/mois), D10a (23 % gagnent, -92 €/mois), D10b (1 % gagnent, -644 €/mois), D10c (0 % gagnent, -1621 €/mois), D10d (1 %) (0 % gagnent, -4508 €/mois), D10e (0,1 %) (0 % gagnent, -36782 €/mois).
Sensibilité (taux plat réoptimisé, variation du solde central, Md€/an) :
| Variante | Taux plat | Solde central | Écart |
|---|---|---|---|
| socle 650 € au lieu de 550 | 35 % | 50,6 | -31,2 |
| socle 800 € | 33 % | -28,8 | -110,6 |
| socle 1 000 € | 29 % | -162,6 | -244,4 |
| IS 25 % | 35 % | 81,9 | +0 |
| holdings non transparentes | 35 % | 43,6 | -38,2 |
| sans prime d'activité | 25 % | -34 | -115,8 |
| sans sous-indexation des pensions | 35 % | 34,2 | -47,7 |
| R0 = 24 000 € | 35 % | -4,8 | -86,6 |
| t_max = 0 (pas d'impôt continu) | 38 % | -81,5 | -163,3 |
| socle universel | 35 % | -65,4 | -147,2 |
| socle linéaire R1 2 000 € | 20 % | -138,8 | -220,7 |

#### Plafond 70 %, IS 25 %
socle 550 € universel, plat 49 %, t_max 20 %, R0 12000 €, prime 200 €, sous-indexation 1,5 pt, IS 25 %, holdings transparentes
Solde public central : sans santé 115,6, santé 9,7, total 125,3 ; bas 189,8 ; haut -0,3 (correction ASPA 0). Taux marginal total maximal 69 % (limite atteinte aux très hauts revenus, impôt + sortie du socle) ; avec l'IS, taux combiné sur un dividende 77 %.
Smicard à 35 h : -3,8 €/mois ; retraité modeste : 0 €/mois.
| Cas type | Aujourd'hui | Après | Écart |
|---|---|---|---|
| Smicard à 15 h par semaine | 913 | 1184 | +271 |
| Smicard à 35 h | 1707 | 1704 | -4 |
| Cadre à 60 k€ brut par an | 3423 | 3547 | +124 |
| Retraité modeste (pension 800 € brut) | 1044 | 1044 | 0 |
| Retraité aisé (4 000 € brut + 15 000 € de capital par an) | 3996 | 2517 | -1479 |
| Dirigeant avec holding (30 000 € brut/mois + 300 000 € de bénéfices retenus par an) | 15221 | 14823 | -398 |
| Retraité de 62 ans qui continue à mi-temps | 2389 | 1807 | -582 |
| Salarié médian à 39 h (4 h supplémentaires) | 2476 | 2540 | +64 |
| Couple, 2 enfants, deux Smic à 35 h | 3736 | 3807 | +71 |
| Personne seule sans emploi (RSA + aide au logement) | 877 | 877 | +0 |
Bandes où moins de la moitié des personnes gagnent : D8 (23 % gagnent, -116 €/mois), D9 (23 % gagnent, -350 €/mois), D10a (1 % gagnent, -682 €/mois), D10b (0 % gagnent, -1653 €/mois), D10c (0 % gagnent, -3296 €/mois), D10d (1 %) (0 % gagnent, -7836 €/mois), D10e (0,1 %) (0 % gagnent, -53778 €/mois).
Sensibilité (taux plat réoptimisé, variation du solde central, Md€/an) :
| Variante | Taux plat | Solde central | Écart |
|---|---|---|---|
| socle 650 € au lieu de 550 | 50 % | 79,7 | -45,6 |
| socle 800 € | 50 % | -9,7 | -135,1 |
| socle 1 000 € | 50 % | -134,6 | -260 |
| IS 25 % | 49 % | 125,3 | +0 |
| holdings non transparentes | 49 % | 71,1 | -54,2 |
| sans prime d'activité | 39 % | 31,4 | -94 |
| sans sous-indexation des pensions | 49 % | 85,2 | -40,1 |
| R0 = 24 000 € | 50 % | 79 | -46,3 |
| t_max = 0 (pas d'impôt continu) | 52 % | 35,2 | -90,2 |
| socle universel | 49 % | 125,3 | +0 |
| socle linéaire R1 2 000 € | 21 % | -168,6 | -293,9 |


### 8.4 Lecture et réserves

- **La marge n'est « dégagée » que si les trois paris tiennent** : holdings (H21, ⚠️), réaction de l'offre de travail aux taux plats de 49 % (élasticités des scénarios, `reactions-assiettes`), et socle de 550 € acceptable pour ceux que les planchers ne couvrent pas. Sans holdings, la marge à ≤ 70 % est de 71 à 82 Md€ ; avec un socle de 650 €, de 80 à 90 Md€.
- Au scénario haut, la marge est quasi nulle : une marge d'investissement « robuste » ne sort pas de ce modèle ; ce sont des ordres de grandeur sous hypothèses.
- À vérifier avant de citer : les effectifs de l'ASPA, de l'AAH et du RSA (⚠️ § 6), le coût de la prime progressive (H, `methode.md`), le taux de remplacement des prestations chômage et familles par le socle.

## 9. Audit contradictoire de l'optimisation (01/11/2026, avocat du diable, `test_optimisation.js` : 83 contrôles ; 41, 33, 30 et 126 intacts)

> Mandat : auditer le saut de 15 Md€ (voie A) à 135 Md€ (O70) avant de le montrer à l'auteur. Règle 7 : écrit pour être vrai. Md€ de 2024, central, santé comprise sauf mention. Scripts de contrôle indépendants : calculs à la main dans `test_optimisation.js` (section « AUDIT »).

### 9.0 Verdict

1. **Le chiffre de 135 Md€ ne doit pas être montré tel quel.** Trois erreurs le gonflent de ≈ 62 Md€ : **72,7 Md€** (bas 159, **haut −80**) après correction à la même structure (≤ 70 %) ; **39,5 Md€** à ≤ 60 % (92 avant) ; **62,8 Md€** avec l'IS à 25 % (125 avant). La voie A à 650 € passe de +15,3 à **−16,1 Md€** : sa « marge » disparaît aussi.
2. **Les 73 Md€ restants sont presque tous un transfert depuis des gens que les contraintes ne regardent pas** : retraités (+137 Md€ d'impôt sur les pensions et le capital, de 72 à 209 Md€ ; déjà +108 en voie A), chômeurs indemnisés (−630 €/mois chacun), parents isolés, étudiants. « Personne ne perd en bas » n'est pas tenu.
3. **Les optimums aux bords de la grille sont un artefact** (§ 9.5), pas un signe qu'il faut étendre la grille.
4. **Ce n'est pas « une marge d'investissement »** : 9,7 Md€ de santé sont un écart à une tendance (pas une baisse par rapport à 2024), et la sous-indexation est un effet à 10 ans additionné à des effets de l'année 1.

### 9.1 L'écart voie A (15,3) → O70 (135,2), levier par levier (Md€/an, central, avec santé)

Voie A : socle 650, plat 47 %, t_max 25 %, R0 24 000, sans prime, sans sous-indexation, IS 25 %, holdings. Leviers ajoutés **dans cet ordre** ; « retiré de O70 » = ce que O70 perd si on remet le levier seul à sa valeur de A (taux inchangés) :

| Levier | Δ publié (séquence) | retiré de O70 | Δ après correctifs (séquence) | Contrôle à la main / lecture |
|---|---|---|---|---|
| Socle 650 → 550 | +55,6 | −59,5 | +55,4 | 55,226 M × 100 € × 12 = 66,3 Md€ évités − 18,2 d'économie de pensions perdue (T13 : 124,7 → 106,4) = **48,0** statique ; le reste (+7) vient des retraités plus imposés et des réactions. **Payé par** les 27 M de non-actifs et retraités (les actifs reprennent 200 € avec la prime) |
| Plat 47 → 49 %, t_max 25 → 20 % | +16,8 | −2,7 | +17,3 | ≈ 14,5 Md€ par point de plat (H62) ; t_max baissé retire un peu |
| **R0 24 000 → 12 000 €** | **+59,3** | −61,5 | +50,9 | À R = 40 000 € : impôt continu 2 710 € contre 748 €, soit +1 960 €/an par actif ; × 27 M. **Compensé par la prime** : R0 bas + prime = +59,3 − 61,9 = **−2,6** : ces deux leviers se neutralisent (le smicard paie 722 €/an de plus, la prime lui rend 2 400 €) |
| Prime 200 € progressive | **−61,9** | +61,9 | −61,9 | 29,0 M × 2 400 + 1,5 M × 107 € × 12 = **71,5** coût brut (juste) ; sert à tenir la contrainte « smicard », pas à produire de la marge |
| Sous-indexation 1,5 pt/an | +40,1 | −40,1 | **+17,2** | (392,5 − 106,4) × (1 − 0,985^10) = **40,1** brut ✓ ; mais l'impôt sur ces compléments baisse (§ 9.2) |
| IS 25 → 30 % | +9,9 | −9,9 | +9,9 | 272 × 30 % × (1 − 4 %) − 68 = 10,3 ✓ ; −0,45 de crédit holdings |
| Total | **+119,9** (→ 135,2) | | **+88,8** (→ 72,7 ; A corrigée −16,1) | |

Répartition qui compte : **les trois leviers « qui prennent aux retraités, inactifs et actifs moyens » (socle bas, R0 bas, sous-indexation) pèsent +155 Md€ publiés** ; la prime en rend 62.

### 9.2 Erreurs trouvées, corrigées et verrouillées par des tests

| # | Erreur | Effet sur O70 (central) | Sur la voie A | Test |
|---|---|---|---|---|
| E1 | **Double compte sous-indexation / impôt sur les pensions** : le gain brut (40,1) est compté, mais l'impôt sur les compléments (taux effectif ≈ 74 % compl. + capital) reste calculé sur le complément non réduit | −23,6 | 0 | « sous-indexation nette » (4 contrôles) |
| E2 | **Aucune rétroaction pour le capital des retraités** (100,6 Md€ imposé de 30 % à ≈ 55-65 %) alors que celui des actifs réagit | −5,7 | −4,2 | « rétroaction du capital des retraités » (2) |
| E3 | **La transparence des holdings neutralisait 70 % de la fuite de tout le capital**, pas seulement du capital en holdings. Levier de 53,8 Md€ : **52,8 viennent de cette neutralisation, 1,0 du flux imputé** | −20,5 (portée limitée au D10) ; −52,8 si couverture nulle | −17,5 | « holdings » (3) |
| Cumul | (interactions comprises) | **−62,5 (135,2 → 72,7)** | −31,4 (→ −16,1) | « O70 corrigé » (3) |

**Pas de double compte trouvé** : IS et holdings (crédit d'IS = t_IS × flux, 2,7 Md€, juste ; l'IS de 78,3 contient déjà ces bénéfices, c'est l'imputation personnelle qui s'y ajoute avec crédit) ; prime et socle (la prime existante de 10,65 est dans les dépenses remplacées, la nouvelle est comptée 71,5 une fois) ; santé et socle (aucun recouvrement). **Non corrigés mais à lire** : (a) la santé (9,7) est un écart à la tendance additionné à une base 2024 statique : sans elle, **63,0 Md€** ; (b) la sous-indexation à 10 ans : en année 1, le solde corrigé est de **57,3 Md€** (99,4 avant correction) ; (c) **la contrainte « plancher ASPA » est vraie par construction** : `casTypes` remonte à 1 043,59 € le retraité à 800 € ; le coût n'est compté que pour la pension moyenne des 0,75 M de bénéficiaires.

### 9.3 Rétroactions : s'appliquent-elles aux leviers de l'optimisation ?

- **R0 = 12 000 €** : oui par le taux marginal (le continu est nul à R0, donc pas d'effet participation) ; mais **c'est un fait politique, pas un détail** : le smicard à 35 h (R = 23 853 €) paie **722 €/an** d'impôt continu au lieu de 0, et le système prend net dès **17 916 € de coût employeur** (O70 ; 16 596 en voie A) car le **plat de 49 % s'applique dès le premier euro** (le socle de 550 + prime 200 = 9 000 €/an vaut 18 400 € de plat). **Contradiction avec l'auteur** (sa position : aucun impôt sous 24 000 € par an, rien à payer pour un salarié au Smic) : elle existe déjà en voie A (plat dès le premier euro) mais R0 = 12 000 l'aggrave ; le modèle la compense par une prime de 71,5 Md€ qui revient à un socle de 750 € réservé aux actifs.
- **Taux combiné IS + dividende (72 à 78 %)** : la réaction du capital n'utilise que le taux personnel (le passage de l'IS de 25 à 30 % n'y entre pas). Sensibilité : élasticité du capital ×1,07 / ×1,2 / ×1,5 : **−2,9 / −8,0 / −18,2 Md€**. Second ordre pour l'IS seul, mais le taux de 78 % dépasse le plafond de 70 % affiché (qui exclut l'IS) : à dire.
- **Retraités** : sans réaction jusqu'à E2 ; leur pension n'a aucune élasticité, leur capital en a (corrigé). Pas d'exil ni de départ de retraités modélisé (⚠️ non quantifié).
- **Sous-indexation sur plusieurs années** : le modèle applique l'état à 10 ans (14 % de baisse réelle des compléments) comme un flux annuel, sans réaction, **additionné à des effets de l'année 1** ; les cas types sont en année 1 et ne la montrent pas : un retraité à 1 750 € brut perd −503 €/mois à l'année 1 et ≈ −590 à l'année 10 (−86 € nets de plus).

### 9.4 Groupes que les contraintes ne vérifient pas (O70 ; ⚠️ « avant » et effectifs : ordres de grandeur)

| Groupe | Avant (€/mois) | Après | Écart | Effectif | Perte (Md€/an) |
|---|---|---|---|---|---|
| Chômeur indemnisé (allocation moyenne, Unédic) | 1 180 | 550 | −630 (−53 %) | 2,62 M | **19,8** |
| Parent isolé sans emploi, 2 enfants ⚠️ | ≈ 1 650 | 950 | −700 (−42 %) | ≈ 0,5 M ⚠️ | ≈ 4,2 |
| Étudiant boursier ⚠️ | ≈ 730 | 550 | −180 | ≈ 0,75 M ⚠️ | ≈ 1,6 |
| Retraité, 1 200 € brut | 1 200 | 882 | −318 (−27 %) | ≈ 1,65 M par décile | 6,3 |
| Retraité, 1 500 € brut | 1 459 | 1 035 | −424 (−29 %) | idem | 8,4 |
| Retraité, 1 750 € brut (médiane) | 1 662 | 1 158 | −503 (−30 %) | idem | 10,0 |
| **Retraités, tous déciles de pension** | | | −104 (D1) à −1 702 (D10) | 16,5 M | **+137 d'impôt de plus** (voie A : +108) |

Total des lignes non retraités et des trois cas ≈ 50 Md€ (les retraités se recoupent par décile) ; en voie A à 650 € : ≈ 42. Autres groupes : **AAH** (compensée en moyenne : 824 € ; les allocataires au-dessus de la moyenne perdent, ceux en dessous gagnent, non chiffré) ; **retraités juste au-dessus du plancher** : falaise : pension 1 100 € (plafond ASPA 1 043,59) tombe à 830 € contre 1 043,59 € à son voisin (test). **Un socle de 550 € est inférieur au RSA seul (650 €) pour toute personne que les planchers ne couvrent pas.**

### 9.5 Optimum aux bords de la grille : artefact

L'objectif (solde central) ne comprend aucun coût pour les gens non contraints : chaque levier est monotone, donc l'optimum colle au bord de la grille. **Preuve** : grille étendue (socle 300 à 550, R0 6 000, prime 300-400, sous-indexation 3-5 points, IS 30-40 %, 288 structures, ≤ 70 %) : l'optimum **se déplace aux nouveaux bords** (socle 300, R0 6 000, prime 400, sous-indexation 5 pts, IS 40 %) et monte à **292 Md€** (177 après correctifs), contrainte smicard satisfaite (+5 €). Il n'y a pas de maximum : étendre la grille ne le trouverait pas. Pour qu'il existe, il faut un objectif ou des contraintes qui coûtent quelque chose à la perte des groupes de § 9.4.

### 9.6 Résultat révisé (grille inchangée, correctifs actifs, central, santé comprise)

| Plafond | Contrainte supplémentaire | Solde central (sans santé) | Bas | Haut | Combinaison |
|---|---|---|---|---|---|
| ≤ 70 % | aucune | **72,7 (63,0)** | 159,2 | **−80,5** | socle 550 universel, plat 49 %, t_max 20 %, R0 12 000, prime 200, sous-index. 1,5, IS 30 %, holdings (même que publié) |
| ≤ 70 %, IS 25 % | aucune | 62,8 | 147,5 | −88,6 | idem, IS 25 % |
| ≤ 60 % | aucune | **39,5 (29,8)** | 99,1 | −63,8 | socle 550 exponentiel R1 3 000, plat 35 %, t_max 25 %, R0 12 000, prime 200, sous-index. 1,5, IS 30 % |
| ≤ 70 % | retraités (1 200 à 1 750 €) perdent ≤ 30 % | 72,3 | 157,4 | −79,0 | socle 500, plat 45 %, t_max 25 % |
| ≤ 70 % | retraités perdent ≤ 20 % | 56,9 | 127,6 | −67,5 | socle 500 linéaire R1 4 000, plat 26 %, t_max 40 %, prime 100 |
| ≤ 70 % | retraités perdent ≤ 10 % | **−98,6** | −67,9 | −145,2 | socle 500 linéaire, plat 13 % |

Lecture : la marge « robuste » (haut ≥ 0) n'existe pas ; la marge centrale de ≈ 70 Md€ tient sur : holdings (couverture, H21), socle de 550 €, chômeurs et retraités qui perdent 30 à 50 %. Dès que les retraités ne perdent que 10 %, le système est à −99 Md€ : **l'équilibre vient de la ponction sur les retraités, pas d'une simplification**.

### 9.7 Contradictions avec les positions de l'auteur (à lui de trancher)

1. **R0 = 24 000 €** (position de l'auteur : seuil d'entrée à 24 000 €/an) : l'optimum prend R0 = 12 000 (bord bas), le smicard paie 722 €/an, et même à R0 = 24 000 le plat de 47-49 % prend dès le premier euro (contributeur net dès ≈ 16 600 à 17 900 €). Garder R0 = 24 000 coûte −46 Md€ de marge (publié, taux plat réoptimisé, § 8.3) et −38 Md€ après correctifs.
2. **« Jamais on ne prendra tout »** : taux marginal total 69 % au plus (impôt) mais **78 % sur un dividende avec l'IS à 30 %** ; et les retraités à 1 750 € brut gardent 70 % de leur revenu net (−30 %), les chômeurs 47 %.
3. **Personne ne perd en bas** : faux pour les chômeurs indemnisés, parents isolés, retraités modestes au-dessus du plancher ASPA, étudiants boursiers (§ 9.4). Le smicard à 35 h perd 4 €/mois (toléré à −10) ; il ne « gagne » rien.
4. **Socle 800 € demandé le 31/10** : l'optimisation descend à 550 € ; à 800 € le solde central est de −135 Md€ de moins (publié ; sensibilité § 8.3).

### 9.8 Ce qu'il faut dire à l'auteur

Le modèle n'a pas trouvé un système où l'État dégage 135 Md€ : il a trouvé que, **si on ne protège que deux cas types, on peut prendre aux retraités, aux chômeurs et aux inactifs, et reprendre une partie aux actifs par une prime**. Après correction : ≈ 70 Md€ au central, négatif au haut. Décisions possibles : (1) remettre un objectif qui chiffre la perte des groupes de § 9.4 ; (2) trancher R0 (24 000) et le taux plat dès le premier euro ; (3) ne pas citer les 92-135 Md€ dans le texte ni sur le simulateur (O70, O60 : à ré-étiqueter) avant relecture ; (4) vérifier H21 (couverture des holdings), la seule hypothèse qui pèse 50 Md€ et qui n'a pas de source.

## 10. Optimisation sous les contraintes de l'auteur (01/11/2026, `optimisation.js` étendu, `rapport_pierre.js`, `test_optimisation.js` : 109 contrôles ; 41, 33, 30 et 128 intacts)

> Mandat (T47) : relancer l'optimisation **avec les correctifs de l'audit** (§ 9 : `audit: true`) et les contraintes de l'auteur (31/10) rendues explicites. Md€ de 2024, **solde public central avec santé** (9,7 Md€, écart à la tendance), « 10 ans » = régime de croisière de la sous-indexation, « année 1 » = sous-indexation d'un an seulement. Données brutes : `resultats-pierre.jsonl` (matrice, séquence, tolérances), `resultats-pierre-sous-ensembles.jsonl` (80 sous-ensembles de contraintes), `resultats-pierre-plat-nul.jsonl` (sans taux plat). Reproduction : `jsc modele.js voies.js sante.js optimisation.js rapport_pierre.js -- <plafond %> <R0> <chômeurs> <retraités> <minima> <falaise> <IS> [nom]` (≈ 5 à 30 s par jeu). Des ordres de grandeur sous hypothèses, jamais des prédictions.

### 10.0 Ce qu'il faut retenir (écrit pour être vrai)

1. **Aucune combinaison ne respecte toutes les contraintes de l'auteur.** Deux contraintes sont **infaisables** dans la grille bornée : **« aucune falaise »** (la falaise du plancher ASPA ne descend sous ≈ 24 €/mois qu'au prix de −639 Md€ ; à 0,5 € de tolérance : zéro structure admissible) et **« pensions < 2 000 € non perdantes »** (zéro structure admissible, quels que soient les autres choix). Le chômeur indemnisé « non perdant » en régime de croisière l'est aussi (il faudrait un socle ≥ 944 € pour une perte de 20 %, ≥ 1 062 € pour 10 %, 1 180 € pour 0 ; la grille s'arrête à 900 €).
2. **Parmi les contraintes faisables, la meilleure marge centrale est négative dès que l'on ajoute la protection des parents isolés** : **−53,6 Md€** (bas +47,4, **haut −221,5**) avec R0 = 24 000 €, étudiants et parents isolés non perdants, retraités ≤ −30 %, taux marginal ≤ 70 %. **Avec le taux IS + dividende ≤ 70 % : −242,7 Md€** (bas −212,5). À ≤ 60 % : −75,2 sans, −507,3 avec le taux IS + dividende.
3. **Le seul jeu de contraintes à marge positive au central** (aucun jeu n'est positif au haut : −97 à −135 Md€ au mieux) : R0 = 24 000 €, retraités ≤ −30 %, étudiants non perdants, parents isolés **non protégés**, IS + dividende **non plafonné** (taux combiné de 76 %, IS 30 %) : **+3,3 Md€** central (bas +84,8, haut −134,7), **−6,0 Md€ l'année 1** avant le coût de transition des chômeurs. Sans la protection des étudiants : +30,6 (année 1 : +15,5). C'est zéro, pas une marge : le moindre aléa sur H21 (holdings, −52,8 Md€ si la couverture est nulle) la renverse.
4. **Prix de chaque contrainte** (§ 10.3) : R0 = 24 000 € : **9,2 Md€** (10,3 à 12,7 par rapport à R0 = 18 000 € quand tout le reste est contraint) ; étudiants non perdants : 17,8 ; retraités ≤ −30 % : 21,5 en séquence (par rapport à l'absence de contrainte, sans les minima : 12,0 pour ≤ −30 %, 81,4 pour ≤ −20 %, 284,9 pour ≤ −10 %) ; **parents isolés non perdants : 56,9** ; **taux IS + dividende ≤ 70 % : 189,1 Md€**. Les contraintes se cumulent de façon non additive (la plupart deviennent non contraignantes une fois la plus chère posée).
5. **Que faudrait-il assouplir ?** Dans l'ordre du coût humain croissant pour un gain donné (§ 10.5) : (a) **le plafond IS + dividende** : accepter un taux combiné de 76-78 % sur le dividende (le personnel reste ≤ 70 %) rend **+189 Md€** ; (b) **R0 = 24 000 → 18 000 €** : +10 à +13 Md€ ; (c) **la falaise ASPA** : tolérer ≈ 130-160 €/mois de falaise ne coûte rien, la ramener à 50 € coûte ≈ 150 Md€ (§ 10.4) ; (d) **parents isolés** : +57 Md€ s'ils perdent ≈ 500 €/mois (−30 %) ; (e) les retraités à −30 % (et non −20 %) : +54. **Les seuls leviers à effet décisif sont (a) et (d)** ; (a) ne touche aucune personne modeste, (d) en touche 0,5 M (⚠️).
6. **Sans taux plat (aucun impôt sous R0, pris au pied de la lettre)** : le meilleur solde central est de **−362 Md€** (impôt continu seul, t_max 70 %, socle 600 €). **La contradiction de § 9.7 reste entière** : toutes les combinaisons ci-dessus prennent 56-69 % dès le premier euro (taux plat). Dans aucune, R0 = 24 000 € ne signifie qu'aucun impôt n'est prélevé en dessous.
7. **Optimums aux bords** : toutes les solutions touchent plusieurs bords (sous-indexation à 1 point, IS à 30 % ou 25 %, socle à 900 ou 600, majoration enfant à 200 ou 400) ; l'objectif ne coûte rien à la perte des groupes non contraints. La grille bornée **ne trouve donc pas un optimum, mais le coin le moins coûteux** ; l'élargir (sous-indexation 3-5 points, socle 300) fait remonter le solde sans limite (§ 9.5), ce que l'auteur a refusé en les bornant.

### 10.1 Contraintes de l'auteur, traduction dans le code (H76 à H82)

| N° | Contrainte de l'auteur | Traduction | Fait dans le code |
|---|---|---|---|
| H76 | R0 = 24 000 € (variante 18 000 €) | grille `GRILLE_PIERRE` : R0 fixé ; variante « libre » 12 000 à 30 000 € | `rapport_pierre.js` |
| H77 | Personne sous les seuils actuels de RSA, ASPA, AAH ; smicard et retraité modeste non perdants | contraintes d'origine (planchers 877 € / 1 043,59 € / AAH différentielle, smicard ≥ −10 €, retraité modeste ≥ −0,5 €) conservées | `verifier` |
| H78 | Parents isolés et étudiants boursiers non perdants | perte ≤ 5 €/mois (⚠️ « avant » 1 650 € et 730 €, effectifs 0,5 M et 0,75 M de mémoire) ; **majoration par enfant 200, 300 ou 400 €** ajoutée à la grille (sans elle le parent isolé ne peut pas être protégé : 900 + 2 × 200 = 1 300 € < 1 650 €) | `K.minima` (`true`, `'parent'`, `'etudiant'`) |
| H79 | Chômeurs indemnisés : perte plafonnée à 0, 10 ou 20 % pendant 2 ans | **coût de transition** = 2,62 M × max(0 ; (1 − x) × 1 180 € − après) × 12, par an, retranché de l'année 1 ; contrainte structurelle (long terme) testée à part | `transitionChomeurs`, `K.chomeurStructurel` |
| H80 | Aucune falaise | plus forte baisse du revenu disponible quand la pension (0 à 4 000 € brut, pas de 50 €, ASPA différentielle sous 1 043,59 €) ou le salaire (0 à 35 h, puis 1 à 10 fois le Smic) augmente | `falaises`, `K.sansFalaise` (tolérance en €/mois) |
| H81 | Taux marginal total ≤ 70 % (variante 60 %) y compris IS + dividende | impôt personnel + sortie du socle ≤ plafond ; **et** 1 − (1 − t_IS)(1 − marginal) ≤ plafond (avec IS 25 % : marginal ≤ 60 %) | `K.inclureIS` |
| H82 | Retraités plafonnés à 10, 20, 30 % ; pensions < 2 000 € non perdantes | perte de revenu net en année 1 pour les pensions de 1 200, 1 500, 1 750 et 2 000 € brut ≤ x % ; « non perdantes » : ≤ 0,5 % | `K.perteMaxRetraites` |
| | Grille bornée | socle 600-900 € (6), sous-indexation 0-1 point, IS 25-30 %, t_max 0-40 % (5), prime 0, 100, 200 €, 6 formes de socle, holdings oui / non : **19 440 structures par jeu** ; `bords(st, G)` signale les bords touchés | `GRILLE_PIERRE`, `bords` |

### 10.2 Séquence : on ajoute les contraintes une à une (plafond 70 %, correctifs de l'audit, central avec santé)

| Étape | Central 10 ans | Bas | Haut | Central année 1 | Prix de l'étape |
|---|---|---|---|---|---|
| 0. Aucune contrainte de l'auteur (R0 libre, grille bornée, audit, ≤ 70 % hors IS) : socle 650 €, plat 57 %, t_max 10 %, R0 18 000 € | **51,8** | 137,8 | −97,6 | 42,3 | |
| 1. + R0 = 24 000 € | 42,6 | 125,1 | −99,7 | 33,0 | **9,2** |
| 2. + étudiants boursiers non perdants (socle 750 €) | 24,8 | 106,4 | −113,5 | 16,4 | **17,8** |
| 3. + retraités (1 200 à 2 000 € brut) perdent ≤ 30 % | **3,3** | 84,8 | −134,7 | −6,0 | **21,5** |
| 4. + parents isolés non perdants (socle 900 €, 400 € par enfant) | −53,6 | 47,4 | −221,5 | −61,5 | **56,9** |
| 5. + IS + dividende ≤ 70 % (marginal personnel ≤ 60 %, IS 25 %) | −242,7 | −212,5 | −279,4 | −259,7 | **189,1** |
| 6. + aucune falaise (tolérance 0,5 €/mois) | **infaisable** | | | | |

Les chômeurs indemnisés ne changent pas ces lignes (transition : tableau suivant). L'ordre est arbitraire : en le changeant, les prix changent (voir § 10.3).

**Chômeurs indemnisés, transition de 2 ans** (coût par an, Md€, à retrancher du solde de l'année 1 et de l'année 2 ; il disparaît ensuite) :

| Perte plafonnée à | Après étape 3 (socle 750 €) | Après étape 4 (socle 900 €) |
|---|---|---|
| 0 % (revenu maintenu : 1 180 €) | 13,5 | 8,8 |
| 10 % | 9,8 | 5,1 |
| 20 % | 6,1 | 1,4 |

Année 1 après étape 3 avec perte ≤ 10 % : −6,0 − 9,8 = **−15,8 Md€** ; avec 0 % : −19,5. **En régime de croisière, le chômeur indemnisé perd** (étape 3 : 430 €/mois, −36 %, 2,62 M, 13,5 Md€ ; étape 4 : 280 €, −24 %) : la contrainte « personne ne perd en bas » n'est pas tenue pour lui, ni pour le **parent isolé** à l'étape 3 (−500 €/mois), ni pour les retraités à pension moyenne (−21 à −30 %, par construction de la contrainte).

### 10.3 Prix de chaque contrainte : retrait d'une contrainte à la fois (plafond 70 %)

Référence F : R0 = 24 000 €, étudiants et parents isolés non perdants, retraités ≤ −30 %, IS + dividende ≤ 70 % : **−242,7 Md€**.

| On retire | Nouveau solde central | Prix de la contrainte (Md€) |
|---|---|---|
| IS + dividende ≤ 70 % (reste ≤ 70 % hors IS) | −53,6 | **189,1** |
| Parents isolés **et** étudiants non perdants | −96,7 | 146,0 |
| R0 = 24 000 € (R0 libre, 12 000 à 30 000 €) | −211,4 | 31,3 |
| Retraités ≤ −30 % | −242,7 | 0 (non contraignante en présence de la contrainte IS) |

Autres prix, par famille de contraintes :

| Contrainte | Résultat (central 10 ans ; sans la contrainte IS ; avec R0 = 24 000 €, minima) |
|---|---|
| Retraités ≤ −30 % / ≤ −20 % / ≤ −10 % / < 2 000 € non perdantes | −53,6 / −107,4 / −288,3 / **infaisable** (sans minima : +30,6 / −38,8 / −242,3 / infaisable ; sans retraités : +42,6) |
| Plafond ≤ 70 % → ≤ 60 % | −53,6 → −75,2 (**21,6**) ; avec IS : −242,7 → −507,3 |
| R0 24 000 → 18 000 € (étape 4) | −53,6 → −43,3 (+10,3) ; avec IS : −242,7 → −230,0 (+12,7) |
| Chômeurs structurellement ≤ −20 % ou 0 % | **infaisable** (socle ≥ 944 / 1 180 € ; ≈ 66 Md€ par +100 € de socle universel, § 9.1) |

### 10.4 Falaises : le prix de « aucune falaise »

| Tolérance de falaise (€/mois, plus forte baisse du revenu disponible quand la pension ou le salaire monte) | Meilleur central (R0 = 24 000 €, minima, retraités ≤ −30 %, IS + dividende ≤ 70 %) | Falaise réelle |
|---|---|---|
| 0,5 | **infaisable** | |
| 25 | −639,3 | 23,6 €/mois |
| 50 | −398,1 | 47,6 |
| 100 | −276,7 | 62,6 |
| 150 et plus | −242,7 (non contraignante) | 126,6 |

**Lecture.** La falaise est celle du plancher ASPA : un retraité à 1 050 € de pension (juste au-dessus du plafond de 1 043,59 €) reçoit 82 à 244 € de moins que son voisin à 1 000 €, parce que le taux plat s'applique au complément dès le premier euro. Côté salaire, **aucune falaise** : le revenu disponible croît de 0 à 35 h puis avec le coût employeur (contrôlé de 1 à 10 fois le Smic) dans toutes les combinaisons. La falaise ASPA n'est pas un coût budgétaire à payer : c'est un défaut de conception (le minimum vieillesse n'a pas de sortie progressive dans le modèle). Une sortie en pente (reprise de x % du revenu au-dessus du plafond) la supprimerait sans changer le reste ; **son coût n'est pas chiffré ici** (⚠️, effectifs de pensions de 1 043 à 1 400 € non disponibles dans le dépôt).

### 10.5 Existe-t-il une combinaison qui respecte toutes les contraintes et dégage une marge positive ? Réponse honnête

**Non.** Trois raisons indépendantes :
1. **Deux contraintes sont infaisables seules** (aucune falaise, pensions < 2 000 € non perdantes) dans une grille bornée par des valeurs que l'auteur juge défendables.
2. **Avec les autres, le solde central est de −53,6 Md€** (−242,7 avec le taux IS + dividende), et **le haut est partout négatif** (−97,6 au mieux, avec aucune contrainte de l'auteur).
3. **Le seul résultat central positif (+3,3 Md€) suppose d'abandonner au moins quatre contraintes** (parents isolés, IS + dividende, falaise, chômeur en régime de croisière), et il repose sur l'hypothèse holdings H21 (sans source : −52,8 Md€ si couverture nulle) et sur un IS à 30 %.

**Contraintes à assouplir, par ordre de gain par personne touchée (central 10 ans) :**

| Assouplissement | De combien | Gain | Qui est touché |
|---|---|---|---|
| Taux IS + dividende : accepter 76-78 % de taux combiné (IS 30 %, personnel ≤ 70 %) au lieu de 70 % | 6 à 8 points | **+189 Md€** | actionnaires patrimoniaux (aucune personne modeste) ; ⚠️ départs et holdings non modélisés au-delà de H21 |
| Parents isolés : tolérer une perte de ≈ 500 €/mois (−30 %) | de 0 à −30 % | **+57 Md€** | ≈ 0,5 M de personnes ⚠️ |
| Étudiants boursiers : tolérer une perte de ≈ 80 €/mois | de 0 à −11 % | +18 | ≈ 0,75 M ⚠️ |
| Retraités : tolérer −30 % au lieu de −20 % | 10 points | +54 (avec minima) | 1,65 M par décile de pension |
| R0 : 24 000 → 18 000 € | −6 000 € | +10 à +13 | les revenus de 18 000 à 24 000 € (le smicard à 35 h paie 0 à 722 €/an d'impôt continu selon t_max, § 9.3) |
| Falaise : tolérer ≈ 130-160 €/mois (au lieu de ≈ 25 €) | | ≈ +400 | quelques retraités autour de 1 050 € ; **corrigeable par une sortie en pente** |

Combinaison « la moins coûteuse humainement » qui atteint zéro : **R0 = 24 000 €, étudiants non perdants, retraités ≤ −30 %, taux IS + dividende de 76 % toléré, parents isolés non protégés par le socle** (protégés par une mesure ciblée, non chiffrée ici : le coût de 56,9 Md€ était celui d'une hausse du socle et de la majoration pour tous) : **+3,3 Md€ central, −6,0 Md€ année 1, haut −134,7 Md€**. Ce n'est pas une marge d'investissement.

### 10.6 Les groupes qui perdent encore, à chaque étape (€/mois, central)

| Étape | Retraités 1 200 / 1 500 / 1 750 / 2 000 € brut | Chômeur indemnisé | Parent isolé (2 enfants) | Étudiant boursier |
|---|---|---|---|---|
| 0 (R0 libre) | −314 / −443 / −539 / −623 (−26 à −34 %) | −530 (−45 %) | −600 (−36 %) | −80 |
| 3 (retraités ≤ 30 %, étudiants) | −252 / −379 / −472 / −554 (−21 à −30 %) | −430 (−36 %) | −500 (−30 %) | +20 |
| 4 (parents isolés) | −177 / −313 / −413 / −503 (−15 à −27 %) | −280 (−24 %) | +50 | +170 |
| 5 (IS + dividende) | −191 / −264 / −311 / −346 (−16 à −19 %) | −280 (−24 %) | +50 | +170 |

À l'étape 5 les seuls perdants restants sont les retraités aisés (−498 €/mois pour 4 000 € brut + capital), le retraité actif de 62 ans (−380), le 0,1 % supérieur (−2 967) : le système est financé par personne, donc il ne l'est pas.

### 10.7 Matrice complète (plafonds 70 et 60 %, parents isolés et étudiants non perdants, falaise non vérifiée)

| Plafond | R0 | Retraités | IS + dividende ≤ plafond | Central 10 ans | Bas | Haut | Central année 1 | Meilleure combinaison |
|---|---|---|---|---|---|---|---|---|
| ≤ 70 % | 24 000 € | ≤ 30 % | non | -53,6 | 47,4 | -221,5 | -61,5 | socle 900 € universel, plat 59 %, t_max 10 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 70 % | 24 000 € | ≤ 30 % | oui | -242,7 | -212,5 | -279,4 | -259,7 | socle 900 € exp. R1 3000, plat 32 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 70 % | 24 000 € | ≤ 20 % | non | -107,4 | -31,8 | -227,2 | -124,1 | socle 900 € exp. R1 2000, plat 30 %, t_max 40 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 70 % | 24 000 € | ≤ 20 % | oui | -242,7 | -212,5 | -279,4 | -259,7 | socle 900 € exp. R1 3000, plat 32 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 70 % | 24 000 € | ≤ 10 % | non | -288,3 | -252,3 | -338,5 | -307,8 | socle 900 € linéaire R1 3000, plat 17 %, t_max 40 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 70 % | 24 000 € | ≤ 10 % | oui | -367,0 | -345,7 | -388,9 | -387,7 | socle 900 € linéaire R1 3000, plat 16 %, t_max 30 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 70 % | 24 000 € | < 2 000 € non perdantes | non | **infaisable** | | | | aucune structure admissible |
| ≤ 70 % | 24 000 € | < 2 000 € non perdantes | oui | **infaisable** | | | | aucune structure admissible |
| ≤ 70 % | 18 000 € | ≤ 30 % | non | -43,3 | 61,3 | -219,1 | -56,1 | socle 900 € exp. R1 3000, plat 40 %, t_max 30 %, prime 100, maj. enfant 400, IS 30 % |
| ≤ 70 % | 18 000 € | ≤ 30 % | oui | -230,0 | -197,6 | -270,7 | -246,6 | socle 900 € exp. R1 3000, plat 32 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 70 % | 18 000 € | ≤ 20 % | non | -67,2 | 22,5 | -212,7 | -82,7 | socle 900 € exp. R1 2000, plat 30 %, t_max 40 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 70 % | 18 000 € | ≤ 20 % | oui | -230,0 | -197,6 | -270,7 | -246,6 | socle 900 € exp. R1 3000, plat 32 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 70 % | 18 000 € | ≤ 10 % | non | -236,4 | -191,5 | -303,6 | -254,5 | socle 900 € linéaire R1 3000, plat 17 %, t_max 40 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 70 % | 18 000 € | ≤ 10 % | oui | -343,2 | -318,8 | -371,3 | -363,1 | socle 900 € linéaire R1 3000, plat 15 %, t_max 30 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 70 % | 18 000 € | < 2 000 € non perdantes | non | **infaisable** | | | | aucune structure admissible |
| ≤ 70 % | 18 000 € | < 2 000 € non perdantes | oui | **infaisable** | | | | aucune structure admissible |
| ≤ 60 % | 24 000 € | ≤ 30 % | non | -75,2 | 1,2 | -198,8 | -83,4 | socle 900 € universel, plat 59 %, t_max 0 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 60 % | 24 000 € | ≤ 30 % | oui | -507,3 | -497,3 | -504,7 | -528,0 | socle 900 € exp. R1 3000, plat 18 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 60 % | 24 000 € | ≤ 20 % | non | -176,5 | -122,7 | -261,3 | -192,8 | socle 900 € exp. R1 3000, plat 30 %, t_max 30 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 60 % | 24 000 € | ≤ 20 % | oui | -507,3 | -497,3 | -504,7 | -528,0 | socle 900 € exp. R1 3000, plat 18 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 60 % | 24 000 € | ≤ 10 % | non | -288,3 | -252,3 | -338,5 | -307,8 | socle 900 € linéaire R1 3000, plat 17 %, t_max 40 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 60 % | 24 000 € | ≤ 10 % | oui | -507,3 | -497,3 | -504,7 | -528,0 | socle 900 € exp. R1 3000, plat 18 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 60 % | 24 000 € | < 2 000 € non perdantes | non | **infaisable** | | | | aucune structure admissible |
| ≤ 60 % | 24 000 € | < 2 000 € non perdantes | oui | **infaisable** | | | | aucune structure admissible |
| ≤ 60 % | 18 000 € | ≤ 30 % | non | -75,2 | 1,2 | -198,8 | -83,4 | socle 900 € universel, plat 59 %, t_max 0 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 60 % | 18 000 € | ≤ 30 % | oui | -492,1 | -481,2 | -491,2 | -512,5 | socle 900 € exp. R1 3000, plat 18 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 60 % | 18 000 € | ≤ 20 % | non | -142,7 | -80,3 | -243,7 | -158,1 | socle 900 € exp. R1 3000, plat 30 %, t_max 30 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 60 % | 18 000 € | ≤ 20 % | oui | -492,1 | -481,2 | -491,2 | -512,5 | socle 900 € exp. R1 3000, plat 18 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 60 % | 18 000 € | ≤ 10 % | non | -265,2 | -217,4 | -342,5 | -282,5 | socle 900 € exp. R1 3000, plat 19 %, t_max 40 %, prime 0, maj. enfant 400, IS 30 % |
| ≤ 60 % | 18 000 € | ≤ 10 % | oui | -492,1 | -481,2 | -491,2 | -512,5 | socle 900 € exp. R1 3000, plat 18 %, t_max 10 %, prime 0, maj. enfant 400, IS 25 % |
| ≤ 60 % | 18 000 € | < 2 000 € non perdantes | non | **infaisable** | | | | aucune structure admissible |
| ≤ 60 % | 18 000 € | < 2 000 € non perdantes | oui | **infaisable** | | | | aucune structure admissible |

### 10.8 Signalement des bords de grille (chaque solution)

Étape 0 : prime maximale (200 €), sous-indexation maximale (1 point), IS maximal (30 %), majoration enfant minimale (200 €). Étape 3 : sous-indexation, IS 30 % maximaux, majoration minimale. Étape 4 : socle maximal (900 €), prime minimale (0), sous-indexation maximale, IS maximal, majoration enfant maximale (400 €). Étape 5 : socle 900 €, prime 0, sous-indexation 1 point, IS 25 % (minimum), majoration 400 €. **Dans tous les cas, au moins quatre bords sur sept sont touchés** : la grille bornée ne contient pas d'optimum intérieur, pour la raison de § 9.5 (aucun coût pour les groupes non contraints). Lire : « jusqu'où peut-on aller sans violer les contraintes de l'auteur », pas « l'optimum ».

### 10.9 Ce qu'il faut dire à l'auteur

- **Les contraintes posées ne sont pas satisfiables ensemble avec un solde public équilibré.** Ce n'est pas un défaut de calcul : c'est que « personne ne perd en bas » (socle 900 € + 400 € par enfant, ≈ 146 Md€ avec les étudiants), « jamais plus de 70 % y compris l'IS sur un dividende » (≈ 189 Md€) et « on prend peu aux retraités » (≈ 54 à 285 Md€ selon le seuil) se cumulent contre des recettes qu'on ne peut pas aller chercher ailleurs (taux plat plafonné, t_max ≤ 40 %).
- **Décision à prendre** : (1) sur le plafond IS + dividende : 70 % de taux combiné ou 70 % de taux personnel ; (2) sur les parents isolés : socle plus élevé pour tous ou mesure ciblée ; (3) sur la falaise ASPA : sortie en pente (corrigeable, non chiffré) ; (4) sur R0 : « zéro impôt sous 24 000 € » est incompatible avec un taux plat dès le premier euro (§ 9.7 et 10.0 n° 6) ; (5) sur les chômeurs : transition de 2 ans (coût de 1,4 à 13,5 Md€ par an) puis socle seul, ou assurance chômage maintenue hors socle.
- **Rien dans ce § 10 n'est une recommandation de chiffres à publier** : H21 (holdings), les effectifs des parents isolés et étudiants, la sous-indexation à 10 ans et la santé à 9,7 Md€ restent ⚠️.


---

## 11. Voie R : retraités sanctuarisés (01/11/2026, `modele.js` + `optimisation.js` étendus, `rapport_voieR.js`, `resultats-voieR.txt`, `test_optimisation.js` : 148 contrôles ; 41, 33, 30 et 204 du simulateur intacts ou étendus)

> Mandat (T47, décision de l'auteur du 31/10) : pensions et minimum vieillesse inchangés, aucune sous-indexation, impôt des retraités inchangé ; socle versé aux adultes non retraités (38,726 M) ; il remplace chômage, RSA, aides au logement, prime d'activité, allocations familiales, ASS. Md€ de 2024, **solde public central avec santé** (9,7 Md€), correctifs de l'audit actifs, IS 25 % (30 % en variante), R0 = 24 000 €, holdings transparents avec H21 sauf mention. Reproduction : `jsc modele.js voies.js sante.js optimisation.js rapport_voieR.js` (< 1 s). Hypothèses H84 à H94 : `methode.md` § 12. Des ordres de grandeur sous hypothèses, jamais des prédictions.

### 11.0 Ce qu'il faut retenir (écrit pour être vrai)

1. **Le socle neutre est faible : 172 €/mois** par adulte non retraité (113,0 Md€ de prestations remplacées, dont 33,3 Md€ restent versés sous forme de 200 € par enfant), **243 €** si les enfants n'ont pas de majoration, **295 à 366 €** avec le périmètre large (184 Md€ de prestations en espèces hors retraites, ⚠️ non revérifié). Les 258 et 400 € du 31/10 au soir étaient des ordres de grandeur sur d'autres dénominateurs. Un socle de 172 à 366 € ne permet pas de ne plus travailler.
2. **Sanctuariser les retraités déplace tout l'effort sur les actifs et le capital**, qui n'ont pas la marge : pour **ne pas aggraver le déficit** (Δ = 0 au central), il faut un taux plat de **23,4 % (socle neutre), 34 % (500 €), 39,8 % (650 €), 46,8 % (800 €)**, avec l'impôt continu à t_max 30 % ; pour **combler le déficit de 169 Md€** (solde ≥ 0), **50 % à 500 €** et **aucun taux plat jusqu'à 80 % à 650 € avec t_max 30 %** (meilleur solde −21 Md€ à 62 %) ; à t_max 20 %, 60,2 % à 650 €.
3. **Le plus haut socle finançable, taux marginal ≤ 70 %** (central, santé comprise) : **480 €/mois à l'équilibre** (plat 50 % + continu 20 % : 70 % de taux personnel, mais **77,5 % avec l'IS sur un dividende**) ; **232 €** si le plafond de 70 % porte sur IS + dividende ; **837 € si l'on se contente de ne pas aggraver le déficit** (592 € avec le plafond IS + dividende). **C'est faible, et à l'équilibre le smicard à 35 h perd 233 €/mois, le couple de deux Smic avec deux enfants 387 €** : le déficit est comblé par les salariés modestes, pas par les retraités.
4. **Aucune de ces voies n'est robuste** : au haut, le solde est de −115 Md€ (équilibre à 480 €) ou −293 Md€ (Δ ≥ 0 à 837 €) ; l'hypothèse H21 (holdings) pèse 3 à 4 points de taux plat (sans H21 : 43,2 % au lieu de 39,8 % à 650 €).
5. **Qui perd, dans tous les cas** : le chômeur indemnisé (−343 à −1 008 €/mois selon le socle), le **parent isolé** (−413 à −1 078), l'allocataire du RSA sans plancher (−40 à −705), l'étudiant boursier jusqu'à 700 €. Le plancher RSA à 877 € protège le RSA mais pas le parent isolé (−450 à −600 €).
6. **Chômage** (§ 11.5) : le socle seul fait économiser 37,1 Md€ mais ramène un chômeur au Smic de 1 064 à 650 € par mois ; **un complément dégressif coûte 9,6 à 12,7 Md€** (au lieu de 37,1) et paie **plus que l'assurance actuelle les premiers mois pour un Smic** (+83 à +165 €), puis moins (−414 € au mois 15). Il coûte 0,9 à 1,2 point de taux plat de plus que le socle seul. **La rétroaction sur la durée du chômage (⚠️ élasticité de la littérature, non collectée) est de +4 à +10 Md€ de recettes pour deg1**, hors solde.

### 11.1 Socle neutre (coût du socle = prestations remplacées, statique)

| Périmètre des prestations remplacées | Md€/an | Majoration enfant 200 € (33,3 Md€) | Socle neutre €/mois par adulte non retraité |
|---|---|---|---|
| Simulateur, ASPA conservée (113,0) | 113,0 | oui | **172** |
| Simulateur, ASPA conservée | 113,0 | non | 243 |
| Large (184 Md€ DREES, AAH déjà comptée) | 170,2 | oui | 295 |
| Large | 170,2 | non | 366 |

Calcul : (prestations − majoration enfants) / (38,726 M × 12). Le périmètre large comprend des prestations d'assurance (indemnités journalières, invalidité) dont le remplacement par un forfait fait perdre leurs bénéficiaires : **sensibilité, pas hypothèse centrale** (H88). La différence avec les 249-259 € de `cout_reel_socle.py` vient de la majoration enfant, du dénominateur et de l'ASPA.

### 11.2 Taux plat nécessaire, taux marginal maximal, marge (central, IS 25 %, H21, t_max 30 %)

Cible « Δ ≥ 0 » = ne pas aggraver le solde actuel (−169,1 Md€) ; Δ bas / central / haut = écart à la loi actuelle ; taux marginal = plat + t_max (limite à l'infini), « avec IS » = 1 − 0,75 × (1 − marginal).

| Socle €/mois | Plat nécessaire (Δ = 0) | Taux marginal maximal | Avec IS sur un dividende | Δ bas / central / haut (Md€) | Plat pour équilibrer (solde ≥ 0) |
|---|---|---|---|---|---|
| 172 (neutre) | 23,4 % | 53,4 % | 65,1 % | +14 / 0 / −18 | 35,2 % |
| 500 | 34,0 % | 64,0 % | 73,0 % | +38 / 0 / −63 | 50,1 % |
| 650 | 39,8 % | 69,8 % | 77,4 % | +58 / 0 / −97 | **aucun ≤ 80 %** (meilleur −21 Md€ à 62 %) |
| 800 | 46,8 % | 76,8 % | 82,6 % | +88 / 0 / −144 | aucun (meilleur −93 Md€ à 62 %) |

Sensibilités (plat nécessaire pour Δ = 0, t_max 30 %) : **IS 30 %** : −0,6 à −1,1 point ; **sans transparence des holdings (sans H21)** : +1,0 à +6,8 points (500 € : 36,3 contre 34,0 ; 650 € : 43,2 contre 39,8 ; 800 € : 53,6 contre 46,8) ; **t_max 20 %** : +1,4 à +3,2 points de taux plat et −10 points de taux marginal (650 € : 42,1 %, marginal 62,1 %) ; **t_max 45 %** : −1,7 à −4,4 points de plat mais taux marginal 76 à 83 % ; **périmètre large** (+57,2 Md€ remplacés) : 650 € : 35,1 % (−4,7 points), 800 € : 41,1 %. Les 48 combinaisons socle × IS × H21 × t_max sont dans `resultats-voieR.txt`.

### 11.3 Plus haut socle finançable (taux marginal ≤ 70 %, t_max 20-45 %, plat par pas de 1 point)

| Cible | Plafond de 70 % porté sur | Socle maximal | Taux retenus | Solde bas / central / haut |
|---|---|---|---|---|
| Équilibre (solde ≥ 0) | taux personnel | **480 €** | plat 50 % + t_max 20 % (IS + dividende : 77,5 %) | +68 / 0 / −115 |
| Équilibre | IS + dividende | **232 €** | plat 40 % + t_max 20 % | +32 / 0 / −53 |
| Δ ≥ 0 (déficit conservé) | taux personnel | 837 € | plat 50 % + t_max 20 % | −95 / −169 / −293 |
| Δ ≥ 0 | IS + dividende | 592 € | plat 40 % + t_max 20 % | −132 / −169 / −230 |

Avec IS 30 % : 501 / 165 / 857 / 526 € ; sans H21 : 409 / 184 / 766 / 545 € (IS 25 %). Périmètre large : 601 € à l'équilibre, 954 € pour Δ ≥ 0. **Le résultat est faible** : à l'équilibre, le socle de 480 € est inférieur au RSA avec aide au logement (877 €) et la voie fait perdre les salariés modestes (§ 11.4).

### 11.4 Gagnants et perdants (€/mois, plat de Δ = 0, t_max 30 %, chômage remplacé par le socle seul)

| Cas (« avant » ⚠️ pour les lignes marquées) | 172 € (plat 23,4 %) | 500 € (34 %) | 650 € (39,8 %) | 800 € (46,8 %) | Équilibre à 480 € (50 % + 20 %) |
|---|---|---|---|---|---|
| Chômeur indemnisé (1 180 €) | −1 008 | −680 | −530 | −380 | −700 |
| Famille 2 enfants, deux Smic 35 h (3 736 €) | +52 | +286 | +356 | +378 | −387 |
| Famille 2 enfants, un Smic (2 552 € ⚠️ simulateur) | −534 | −89 | +96 | +257 | −197 |
| Parent isolé, 2 enfants, sans emploi (1 650 € ⚠️) | −1 078 | −750 | −600 | −450 | −770 |
| AAH (824 €, maintenue) | 0 | 0 | 0 | 0 | 0 |
| Étudiant boursier (730 € ⚠️) | −558 | −230 | −80 | +70 | −250 |
| RSA seul + aide au logement (877 €) | −705 | −377 | −227 | −77 | −397 |
| Smicard 15 h (913 €) | −89 | +149 | +249 | +340 | −7 |
| Smicard 35 h (1 707 €) | −13 | +104 | +138 | +149 | **−233** |
| Cadre 60 k€ (3 423 €) | +1 424 | +996 | +733 | +386 | +99 |
| Dirigeant avec holding (15 221 € de cash) | +7 107 | +2 935 | +628 | −2 180 | −419 |
| Retraité modeste, aisé | 0 | 0 | 0 | 0 | 0 |

Avec le plancher RSA à 877 € : le RSA ne perd rien (la voie coûte de 2 à 16 Md€ de Δ en plus selon le socle) ; le parent isolé reste à −450 (800 €) à −773 € (172 €). **Lecture** : le socle remplace des prestations ciblées par un forfait ; les perdants sont les foyers qui touchaient beaucoup de prestations ciblées (parent isolé, RSA, chômeur indemnisé, famille à un seul Smic), les gagnants les salariés dont le coin fiscal et social baisse (cadre, famille à deux Smic). Le dirigeant avec holding gagne parce que le taux plat (23 à 40 %) est inférieur à son taux actuel à coût employeur constant ; ⚠️ cas type du modèle, comparé au revenu en espèces sans les bénéfices retenus.

### 11.5 Chômage : socle seul, complément dégressif ou assurance maintenue (S = 650 €)

| Variante | Coût Md€/an | Économie vs assurance actuelle (37,1) | Plat nécessaire Δ = 0 (650 €) | Socle max, équilibre / Δ ≥ 0 | Rétroaction durée, +recettes (ε 0,3 / 0,5 / 0,8) ⚠️ |
|---|---|---|---|---|---|
| Socle seul (l'assurance est remplacée) | 0 | 37,1 | 39,8 % | 480 / 837 | +10,7 / +16,9 / +24,9 Md€ |
| **deg1** : 60 % de la perte (mois 1-3), 40 % (4-6), 20 % (7-12), puis 0 | 9,6 | 27,5 | 40,7 % | 456 / 821 | +4,0 / +6,5 / +10,1 |
| **deg2** : deg1, perte calculée sur 3 000 € net au plus | 9,6 (voir limite) | 27,5 | 40,7 % | 456 / 821 | idem |
| **deg3** : 70 / 50 / 30 / 15 % jusqu'à 18 mois, plafond 3 000 € | 12,7 | 24,4 | 41,0 % | 448 / 815 | +2,2 / +3,6 / +5,6 |
| Allocation moyenne maintenue (max(0 ; 1 180 − socle)) | 16,7 | 20,4 | 41,3 % | 431 / 813 | 0 |
| Allocation en plus du socle | 37,1 | 0 | 43,3 % | 402 / 759 | 0 |

Revenu mensuel d'un chômeur (socle 650 € + complément) contre l'assurance actuelle simplifiée (72 % du net, plancher 960 €, 18 mois) ; entre parenthèses l'écart :

| Chômeur | Assurance actuelle | deg1 : mois 2 / 5 / 9 / 15 | deg3 : mois 2 / 5 / 9 / 15 |
|---|---|---|---|
| Au Smic (net 1 478 €) | 1 064 € | 1 147 (+83) / 981 (−83) / 816 (−249) / 650 (−414) | 1 230 (+165) / 1 064 (0) / 898 (−166) / 774 (−290) |
| Au salaire médian (net 2 116 €) | 1 524 € | 1 530 (+6) / 1 236 (−287) / 943 (−580) / 650 (−874) | 1 676 (+153) / 1 383 (−141) / 1 090 (−434) / 870 (−654) |
| Cadre à 5 000 € net | 3 600 € | 3 260 (−340) / 2 390 (−1 210) / 1 520 (−2 080) / 650 (−2 950) ; deg2 : 2 060 (−1 540) / 1 590 / 1 120 / 650 | 2 295 (−1 305) / 1 825 (−1 775) / 1 355 (−2 245) / 1 003 (−2 597) |

**Lecture.** (a) Un complément dégressif ne coûte que **9,6 à 12,7 Md€** contre 37,1 : 66 à 74 % de l'économie du socle seul (37,1 Md€) est conservée, au prix de **0,9 à 1,2 point de taux plat**, soit un socle maximal à l'équilibre de 448-456 € au lieu de 480 €. (b) **Le plafond de 3 000 € net** ne change presque rien au coût moyen (le chômeur moyen gagnait 1 640 € net) mais **divise par deux la protection des hauts salaires** : un cadre à 5 000 € net touche 2 060 € au mois 2 (deg2) au lieu de 3 260 €. (c) **Le piège de la dégressivité** : à partir du mois 7 (deg1) un chômeur au Smic est à 650-816 €, moins que le RSA avec aide au logement d'aujourd'hui (877 €) : sans plancher RSA, la sortie du complément est une chute de revenu pour les chômeurs de longue durée (la moitié du stock a plus de 6 mois d'ancienneté, H93). (d) **Rétroactions** : la dégressivité raccourcit le chômage si l'élasticité de la durée à l'allocation est celle de la littérature internationale (0,3 à 0,8 ⚠️) : **261 000 chômeurs de moins avec deg1 (ε = 0,5)**, ≈ +6,5 Md€ de recettes par an ; mais c'est l'hypothèse la moins étayée de la section (aucune étude française collectée dans le dépôt : Le Barbanchon, Unédic, Dares à lire), elle suppose des emplois disponibles (si la demande de travail est le facteur limitant, la baisse du chômage est moindre et le coût humain plus élevé), et elle n'est **pas** dans le solde. (e) Le coût de transition est à ajouter : les chômeurs indemnisés pendant la bascule (2,62 M) perdent de 1 180 € à 957 € en moyenne (deg1), voir `transitionChomeurs` pour le maintien temporaire des droits.

### 11.6 Contradictions et points à trancher (règle 7)

- **« On ne prend pas aux retraités » et « le travail n'est plus obligatoire » ne sont pas compatibles** dans le budget actuel : avec les retraités hors du système, le socle finançable est de 172 à 480 € (jusqu'à 837 € si le déficit de 169 Md€ n'est pas comblé). Les 392,5 Md€ de pensions sont le premier poste de dépense (T13) ; les sanctuariser fait peser le solde sur 38,7 M d'adultes non retraités (dont 11,7 M ni salariés ni retraités).
- **Le déficit n'est comblé que par des taux plats de 50 %** : le taux plat de 50 % et le taux marginal personnel de 70 % reviennent presque au point de départ du modèle (§ 6), et le smicard à 35 h y perd 233 €/mois. **Aucune des deux lectures de « marge nulle » ne donne un socle supérieur à 837 €**, et celle qui comble le déficit donne 480 € au mieux.
- **« Personne ne perd en bas » n'est pas tenu** : chômeur, parent isolé, RSA, étudiant perdent à tous les niveaux de socle testés jusqu'à 800 € (le parent isolé jusqu'à −450 €, ⚠️ « avant » estimé).
- **IS + dividende ≤ 70 %** (position de l'auteur) divise le socle finançable par deux (480 → 232 €) ; la lecture « 70 % de taux personnel » donne 77,5 % de taux combiné.
- **Ce qu'il faudrait pour monter** : dépenses de santé, simplification (l'industrie de la complexité n'est pas dans le solde : gain de productivité non compté, H26), investissement public ou fiscalité du patrimoine non modélisée ici, **ou toucher aux pensions élevées** (exclu par la décision de l'auteur).

### 11.7 Ce qu'il faut dire à l'auteur

- **La décision retenue est cohérente mais coûteuse** : sanctuariser les retraités et remplacer les prestations hors retraites par un socle donne un système finançable (480 € à l'équilibre, 650 € au prix de 40 % de plat sans comblement du déficit), pas un système qui libère du travail.
- **Choix à faire** : (1) combler le déficit (480 €, plat 50 %) ou seulement ne pas l'aggraver (837 €, plat 50 % aussi, mais le déficit de 169 Md€ reste) ; (2) plafond de 70 % sur le taux personnel ou sur IS + dividende (480 contre 232 €) ; (3) chômage : complément dégressif (≈ 10 Md€) avec plancher RSA, ou socle seul ; (4) parents isolés et RSA : plancher ciblé hors socle.
- **Le simulateur** propose R500, R650 et R800 (taux de Δ = 0, chômage remplacé par le socle seul, retraités inchangés). Les variantes de chômage ne sont pas dans le simulateur : il lui faudrait la durée de chômage et le salaire antérieur.
- **Rien dans ce § 11 n'est une recommandation de chiffres à publier** : H21, durée du chômage, élasticité, « avant » des parents isolés, étudiants et familles, périmètre de 184 Md€ restent ⚠️.


## 12. Voie R2 : minimum garanti, pensions comparables, contribution des hautes pensions (01/11/2026, `retraites2.js`, `rapport_voieR2.js`, `resultats-voieR2.txt`, `test_retraites2.js` : 53 contrôles ; 41, 33, 30, 148 et 237 du simulateur intacts ou étendus)

> Mandat (T47, nuance de l'auteur du 01/11) : pas de sanctuarisation totale ; minimum garanti pour tous les retraités ; pensions inchangées pour la plupart ; contribution des hautes pensions (surtout avec du capital) ; même logique pour les hauts salaires et l'évasion fiscale. Base : la voie R (socle de non retraités, IS conservé, impôt continu R0 = 24 000 €, holdings H21, santé, chômage). Sources et chiffrage des assiettes : `sources/recherche-hautes-pensions-hauts-revenus-evasion.md`. Md€ par an, euros de 2025, scénario central sauf mention (bas = réactions faibles, favorable ; haut = réactions fortes). Hypothèses H95 à H106 : `methode.md` § 13. Commande : `jsc modele.js voies.js sante.js optimisation.js retraites2.js rapport_voieR2.js`.

### 12.0 Ce qu'il faut retenir (écrit pour être vrai)

1. **La contribution des hautes pensions rapporte entre 6 et 33 Md€ nets selon le seuil, le taux et surtout la part « capital »**, mais **elle relève peu le socle** : au meilleur de la grille (seuil 2 000 €, 30 %, capital majoré), le socle finançable à l'équilibre passe de **483 € à 551 €** (+ 68 € ; 567 € avant le recalage H134) ; au réglage médian (seuil 2 500 €, 20 %), de **483 à 515 €** (+ 32 € ; 526 € avant) et le taux plat nécessaire à 650 € (Δ ≥ 0) de **39,7 à 38,4 %** (− 1,3 point ; 38,0 % avant). **Elle ne change pas la conclusion de la voie R** : le socle reste de l'ordre de 500 € à l'équilibre et de 850 à 920 € si l'on accepte de ne pas combler le déficit (taux marginal ≤ 70 %, personnel).
2. **Les pensions seules pèsent peu** : l'excédent au-dessus de 2 500 € nets représente 34 Md€ avant toute contribution ; à 20 % (6,8 Md€ bruts, 6,3 nets) cela fait **0,4 point de taux plat**. **La majeure partie vient encore de l'hypothèse sur le capital** (11,4 des 18,2 Md€ bruts du réglage médian, contre 18,4 des 25,2 avant le recalage) ; la répartition du capital est désormais reconstruite à partir de tableaux publiés (H134, `sources/recherche-pensions-patrimoine.md` : 13 Md€ nets au central, 8 à 25), mais la corrélation pension-patrimoine reste une hypothèse. **À citer comme un ordre de grandeur avec sa fourchette, pas comme un chiffre.**
3. **Qui perd** : un retraité à 3 500 € nets perd 200 €/mois (− 6,4 %) au réglage médian (taux marginal total 55 %, IR 30 % + CSG 8,3 % + 20 %) ; un retraité à 2 200 € avec 15 000 € de capital perd 285 €/mois (− 9,6 %) alors que sa pension est sous le seuil (c'est le choix de l'auteur : viser surtout les retraités qui ont du capital). Aucun retraité de moins de 2 500 € de pension sans capital ne change. Environ 2,9 M de retraités ont plus de 2 500 € nets (17,8 %), 4,9 M sont concernés par la contribution avec le capital (30 % ; 5,6 M, 34 % avant le recalage).
4. **Le minimum garanti coûte peu** : relever le minimum de l'ASPA (1 043,59 €) à 1 200 € coûte 1,7 Md€ de plus par an (6,3 au total), à 1 300 € : 3,1 (⚠️ ciblage proportionnel à l'ASPA actuelle, H100) ; **ce n'est pas un levier de budget**, c'est un choix de principe.
5. **Hauts salaires** : 1,1 % des salariés du privé gagnent plus de 10 000 € nets par mois (masse nette 55 Md€) ; 4,1 % plus de 6 000 € (129 Md€) ; 12,1 % plus de 4 000 € (252 Md€). **Au-delà de 40 % de taux marginal asymptotique de l'impôt continu (t_max), le modèle ne rapporte plus rien** (+ 13,6 Md€ de 30 à 40 %, + 13,3 de 30 à 45 %) : la réaction des hauts revenus (élasticité 0,25, exil) absorbe la hausse (⚠️ H11, H16).
6. **Évasion et fraude** : la fraude nette des coûts de contrôle vaut **0,5 / 1,4 / 2,8 Md€** par an avec 2 000 postes supplémentaires (haut / central / bas, ⚠️ hypothèses H103) : moins d'un point de taux plat. L'évasion fiscale totale n'a **aucune estimation officielle récente** (CPO 2007 : 29-40 Md€, non relu) ; la dépense publique en faveur d'un socle ne peut pas compter dessus.
7. **Gagnants parmi les actifs** : dans les trois structures testées, le cadre à 8 000 € nets (+ 422 à + 1 037 €/mois), le cadre à 60 k€ brut et le dirigeant avec holding (+ 561 à + 1 717 €/mois) **gagnent** par rapport à la loi actuelle, parce que les prélèvements supprimés (885,9 Md€, dont les cotisations) sont remplacés par un taux plat et un impôt continu plus légers pour eux que le système actuel (⚠️ « avant » estimé). Ce n'est pas un résultat d'une volonté politique : c'est une conséquence du chiffrage, et elle contredit l'intention de faire contribuer davantage les hauts revenus. Les perdants des voies R, chômeurs indemnisés, parents isolés, bénéficiaires du RSA, restent perdants (§ 11).
8. **Robustesse** : au socle de 650 € et au taux plat de 38 %, le solde public est de **− 113 / − 169 / − 260 Md€** (bas / central / haut, Δ ≥ 0 au central) : aucune des variantes n'est robuste au scénario haut.

### 12.1 Hautes pensions : assiette (DREES, EIR 2020, revalorisée × 1,155)

| Seuil (nets/mois) | Part des retraités | Effectifs | Excédent (Md€/an, pension seule, avant fuite) |
|---|---|---|---|
| 2 000 € | 33,4 % | 5,5 M | 58,5 |
| 2 500 € | 17,8 % | 2,9 M | 34,1 |
| 3 000 € | 9,6 % | 1,6 M | 21,0 |
| 4 000 € | 3,5 % | 0,6 M | 9,2 |

### 12.2 Contribution nette (Md€/an) : seuil × taux, bas / central / haut

> **Recalé le 01/11/2026 (H134)** sur `sources/recherche-pensions-patrimoine.md` : part du capital des retraités 20 % au lieu de 25 %, clé par décile 3-5-6-6-7-9-10-12-16-26 % (ancienne : 1-2-3-4-6-8-10-14-20-32 %). Le jeu ancien reste accessible (`jeuCapital: 'ancien'`, § 12.7). Avant le recalage, la ligne médiane (2 500 €, 20 %) donnait 17,6 / 15,5 / 13,1 sans majoration et 23,2 / 20,1 / 16,8 avec majoration, pour 5,6 M de concernés.

| Seuil | Taux | Pension seule | Pension + capital, sans majoration | Pension + capital, majoration + 10 pts | Concernés (avec capital) |
|---|---|---|---|---|---|
| 2 000 € | 10 % | 5,7 / 5,4 / 5,0 | 10,4 / 9,3 / 8,1 | 15,1 / 13,2 / 11,2 | 8,2 M (49 %) |
| 2 000 € | 20 % | 11,4 / 10,8 / 10,0 | 20,8 / 18,6 / 16,2 | 25,5 / 22,5 / 19,4 | 8,2 M |
| 2 000 € | 30 % | 17,0 / 16,2 / 14,9 | 31,1 / 27,9 / 24,3 | 35,8 / 31,8 / 27,5 | 8,2 M |
| 2 500 € | 10 % | 3,3 / 3,1 / 2,9 | 6,7 / 6,0 / 5,2 | 10,1 / 8,8 / 7,5 | 4,9 M (30 %) |
| 2 500 € | 20 % | 6,6 / 6,3 / 5,8 | 13,4 / 12,0 / 10,4 | 16,9 / 14,8 / 12,6 | 4,9 M |
| 2 500 € | 30 % | 9,9 / 9,4 / 8,7 | 20,2 / 18,0 / 15,5 | 23,6 / 20,8 / 17,8 | 4,9 M |
| 3 000 € | 10 % | 2,0 / 1,9 / 1,8 | 4,5 / 3,9 / 3,4 | 6,9 / 6,0 / 5,0 | 3,3 M (20 %) |
| 3 000 € | 20 % | 4,1 / 3,9 / 3,6 | 8,9 / 7,9 / 6,8 | 11,3 / 9,9 / 8,4 | 3,3 M |
| 3 000 € | 30 % | 6,1 / 5,8 / 5,3 | 13,4 / 11,8 / 10,2 | 15,8 / 13,9 / 11,8 | 3,3 M |

La « majoration capital » est un taux supplémentaire de 10 points sur la part du capital qui dépasse le seuil. La contribution est calculée sur une assiette en nets de CSG ; elle s'ajoute à l'IR et à la CSG actuels (taux marginal total d'un retraité seul à 3 500 € : 55 % à 20 %, 65 % à 30 %, loin du plafond de 70 %).

### 12.3 Socle maximal finançable (non retraités), taux marginal ≤ 70 %

Colonnes : équilibre (solde central avec santé ≥ 0), personnel | équilibre, IS + dividende ≤ 70 % | Δ ≥ 0, personnel | Δ ≥ 0, IS + dividende ≤ 70 % | recettes nouvelles nettes de R2 (fraude comprise, minimum garanti déduit) bas / central / haut.

| Variante | Équilibre, perso | Équilibre, IS+div | Δ ≥ 0, perso | Δ ≥ 0, IS+div | Recettes R2 (Md€) |
|---|---|---|---|---|---|
| R (voie R, fraude 1,4 comprise) | 483 | 235 | 840 | 595 | 2,8 / 1,4 / 0,5 |
| R2 seuil 3 000 €, 10 % | 496 | 247 | 852 | 608 | 9,7 / 7,4 / 5,5 |
| R2 seuil 3 000 €, 20 % | 504 | 256 | 860 | 616 | 14,1 / 11,3 / 8,9 |
| R2 seuil 3 000 €, 30 % | 513 | 264 | 868 | 625 | 18,6 / 15,3 / 12,3 |
| R2 seuil 2 500 €, 10 % | 502 | 253 | 858 | 614 | 12,9 / 10,2 / 8,0 |
| **R2 seuil 2 500 €, 20 %** | **515** | **266** | **870** | **627** | 19,7 / 16,2 / 13,1 |
| R2 seuil 2 500 €, 30 % | 527 | 279 | 882 | 639 | 26,4 / 22,2 / 18,3 |
| R2 seuil 2 000 €, 10 % | 511 | 263 | 867 | 623 | 17,9 / 14,6 / 11,7 |
| R2 seuil 2 000 €, 20 % | 531 | 283 | 886 | 643 | 28,3 / 23,9 / 19,9 |
| R2 seuil 2 000 €, 30 % | 551 | 302 | 905 | 663 | 38,6 / 33,2 / 28,0 |
| R2 2 500 €, 20 %, pension seule | 497 | 248 | 853 | 608 | 9,4 / 7,7 / 6,3 |
| R2 2 500 €, 20 %, capital sans majoration | 509 | 260 | 864 | 620 | 16,2 / 13,4 / 10,9 |
| R2 2 500 €, 20 %, minimum garanti 1 200 € | 511 | 262 | 867 | 623 | 17,9 / 14,5 / 11,4 |
| R2 2 500 €, 20 %, minimum garanti 1 300 € | 508 | 260 | 864 | 620 | 16,6 / 13,2 / 10,1 |
| R2 progressive (15 % de 2 500 à 4 000 €, 30 % au-delà) | 514 | 266 | 870 | 626 | 19,4 / 15,9 / 12,9 |

Le taux plat nécessaire (t_max 30 %) : socle 500 € : 33,9 % (R), 33,2 % (3 000 €, 20 %), 32,8 % (2 500 €, 20 %), 31,6 % (2 000 €, 30 %) pour Δ ≥ 0 ; 49,9, 48,6, 48,1 et 46,1 % pour l'équilibre ; socle 650 € : 39,7, 38,9, 38,4, 37,0 % (Δ ≥ 0) et, à l'équilibre, aucun taux ≤ 80 % en R, en R2 (3 000 €, 2 500 €) ; 56,5 % (2 000 €, 30 %) ; socle 800 € : 46,7, 45,6, 45,1, 43,3 % (Δ ≥ 0), aucun à l'équilibre. (Avant le recalage H134 : 32,4 % à 500 €, 38,0 % à 650 € et 61 % à l'équilibre pour le réglage 2 500 €, 20 %.)

### 12.4 Perdants (retraités, avant fuite ; actifs, central)

| Retraité | 2 000 €, 20 % | 2 500 €, 20 % | 3 000 €, 20 % | 2 500 €, 30 % |
|---|---|---|---|---|
| 3 500 € nets, sans capital (avant 3 096 €) | − 300 (− 9,7 %) | − 200 (− 6,5 %) | − 100 (− 3,2 %) | − 300 (− 9,7 %) |
| 2 200 € nets + 15 000 € de capital (avant 2 977 €) | − 415 (− 13,9 %) | − 285 (− 9,6 %) | − 135 (− 4,5 %) | − 380 (− 12,8 %) |
| 1 750 € nets (médiane) | 0 | 0 | 0 | 0 |
| 800 € nets | 0 (ASPA) | 0 | 0 | 0 |

« Avant » : pension nette moins IR (barème 2025, une part, décote, CSG non déductible dans la base, abattement de 10 % plafonné à 4 439 € : `fiscalite_actuelle.js`, H182 ; ⚠️ H101 pour les chiffres du plafond) plus capital net de PFU 30 %. Taux marginal total du retraité à 3 500 € : 56 % (20 %) ou 66 % (30 %). Les chiffres de ce paragraphe sont ceux de `resultats-voieR2.txt` régénéré le 01/11/2026 (l'ancien IR du retraité était recopié dans `retraites2.js`).

| Actif | Socle 500, plat 45 %, t_max 20 % | Socle 650, plat 40 %, t_max 30 % | Socle 650, plat 30 %, t_max 40 % |
|---|---|---|---|
| Cadre à 8 000 € nets (avant 6 290 €, H105) | 6 847 (+ 557) | 6 861 (+ 571) | 7 460 (+ 1 170) |
| Cadre à 60 k€ brut (avant 3 423 €) | 3 897 (+ 474) | 4 145 (+ 722) | 4 599 (+ 1 176) |
| Dirigeant avec holding (30 000 € brut + 300 k€ de bénéfices retenus ; avant 15 221 €) | 16 938 (+ 1 717) | 15 782 (+ 561) | 16 592 (+ 1 372) |

**Contradiction à nommer (règle 7)** : l'intention est de faire contribuer davantage les hauts revenus, mais le système remplace 885,9 Md€ de prélèvements par un taux plat et un impôt continu dont le total, pour un cadre ou un dirigeant, est inférieur au total actuel (cotisations, CSG, IR). La contribution du haut passe donc par l'IS (conservé), le taux plat et l'impôt continu, pas par un alourdissement net de leur charge.

### 12.5 Rétroactions (élasticités et fuites)

| Canal | Valeur (bas / central / haut) | Source |
|---|---|---|
| Revenu imposable des hauts revenus | 0,12 / 0,25 / 0,40 | Saez, Slemrod, Giertz, *JEL* 2012 (**[fait]**) |
| Exil du 1 % du haut | mobilité 0,05 / 0,15 / 0,40 | T5 (⚠️ H16) |
| Fuite de la contribution sur la pension | 3 / 8 / 15 % | ⚠️ hypothèse de Claude (appui indirect : Kleven et al., *JEP* 2020, p. 7, les personnes âgées aisées sont peu mobiles face aux droits de succession) |
| Fuite de la contribution sur le capital | 10 / 25 / 40 % | ⚠️ hypothèse de Claude (le capital est mobile, requalifiable, transférable à des descendants) |
| Fraude : rendement marginal encaissé par poste | 1,50 / 0,80 / 0,35 M€ | ⚠️ hypothèse ; moyenne apparente ≈ 2,2 M€ notifiés par vérificateur (DGFiP 2025, 4 500 vérificateurs de 2018 ⚠️) |
| Fraude : coût complet par poste | 0,10 M€ | ⚠️ hypothèse |
| Chômage, durée | ε 0,3 / 0,5 / 0,8 | ⚠️ H94 |

### 12.6 Steelman et contraintes

**Meilleure objection** : une pension est un droit acquis par des cotisations ; la rogner, même au-dessus d'un seuil élevé, casse la confiance dans toutes les promesses de l'État (y compris celles qu'on veut tenir à des actifs qui paient aujourd'hui). **Réponse** : le seuil laisse 82 % des retraités inchangés (à 2 500 €) ; la contribution est un prélèvement sur le revenu, pas une réduction de droits ; l'équation d'impôt continu frappait déjà les retraités dans la voie C. **Mais** : la réponse de fond est une question de justice entre générations que le modèle ne tranche pas, et la contribution ne rapporte que de 6 à 40 Md€ dont la plus grande part dépend de l'hypothèse sur le capital. **Contraintes** : égalité devant les charges publiques, droit de propriété, jurisprudence du Conseil constitutionnel sur les pensions : **non analysées** (⚠️ V2687).

### 12.7 Recalage du capital des retraités (01/11/2026, H134-H135, `resultats-voieR2.txt` § K)

Contribution à 20 % au-dessus de 2 500 € nets, capital sans majoration, Md€ nets par an (bas / central / haut), jeu de paramètres au choix.

| Jeu | Assiette du capital | Brut central | Net bas / central / haut | Concernés |
|---|---|---|---|---|
| Ancien (H20 : 25 % du capital, clé 1-2-3-4-6-8-10-14-20-32 %) | tous les retraités | 19,1 | 17,6 / 15,5 / 13,1 | 5,6 M |
| **Recalé (H134 : 20 %, clé 3-5-6-6-7-9-10-12-16-26 %)** | tous les retraités | 14,4 | 13,4 / **12,0** / 10,4 | 4,9 M |
| Recalé + seuil de patrimoine hors résidence principale 300 k€ (H135) | retraités à patrimoine hors RP > 300 k€ | 14,8 | 14,1 / 12,2 / 10,4 | 4,4 M |
| Ancien + seuil 300 k€ (comparaison) | idem | 19,0 | 17,9 / 15,4 / 13,0 | 4,4 M |

**Lecture** : le recalage retire 3,5 Md€ nets au central (15,5 → 12,0) et 0,7 M de contributeurs (le supplément dû au capital pèse moins sur les retraités sous le seuil). La recherche (`sources/recherche-pensions-patrimoine.md`) donne 13,3 Md€ nets (8,1 à 24,7) avec 300 000 retraités simulés individuellement : le modèle, qui lisse le capital à la moyenne de chaque décile de pension, **sous-estime d'environ 1,3 Md€** la convexité de l'assiette (⚠️ limite 1 de H135). La variante « seuil de patrimoine » n'abaisse pas la recette ici (12,2 contre 12,0) parce qu'elle concentre le capital sur 20 % des retraités (convexité retrouvée) ; **ce n'est pas un gain réel**, c'est le même artefact de lissage. Elle sert surtout à montrer qui est concerné (4,4 M au lieu de 4,9 M) et à épargner les retraités propriétaires de leur seul logement.

### 12.8 Ce que cela change pour la recommandation

- Le minimum garanti (ASPA, 1 043,59 €) est conservé ; le relever à 1 200 € est un choix de principe de 1,7 Md€.
- La contribution des hautes pensions est une **mesure de justice** (elle fait payer 3 à 6 % des retraités) plus qu'une mesure budgétaire : elle vaut 1 à 3 points de taux plat. Réglage défendable pour une première version : seuil 2 500-3 000 € nets, taux 20 %, sans majoration du capital (répartition désormais reconstruite mais encore sous hypothèses : § 12.7).
- Hauts salaires : pas de gain à monter t_max au-delà de 40 % ; la marge est dans la transparence des holdings et la fraude (modeste).
- Le chiffrage ne comble pas le déficit : même au meilleur de la grille, il faut une baisse de dépense ou des recettes de croissance (§ 11, `sources/recherche-creer-de-la-valeur.md`).


## 13. Palier 1 recalculé (01/11/2026, **régénéré le 01/11/2026 après l'audit : H176 à H182**, `palier1.js`, `rapport_palier1.js`, `resultats-palier1.txt`, `test_palier1.js` : 87 contrôles ; modules sous-jacents au vert)

> Mandat (T47, demande de l'auteur) : calculer exactement le palier 1 recommandé dans `sources/systeme-ideal-v2.md` (que la synthèse n'avait obtenu qu'en assemblant des tableaux voisins), avec `audit: true`, et tester deux correctifs pour les hauts revenus qui gagnent. Md€ par an, euros de 2024-2025, **solde public total** (déficit actuel de −169,1 compris, santé comptée). « bas » = réactions faibles (favorable), « haut » = réactions fortes (défavorable). **Tous les chiffres de ce paragraphe sont ceux de `resultats-palier1.txt`, sortie de `rapport_palier1.js` du 01/11/2026** (aucun chiffre n'est recopié d'une version antérieure ; ceux d'avant l'audit sont signalés « avant »). Reproduction, depuis `modeles/systeme-ideal/` : `jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js rapport_palier1.js` (quelques secondes). Hypothèses H107 à H116 et H176 à H182 : `methode.md` § 14 et § 19. Des ordres de grandeur sous hypothèses, jamais des prédictions.
>
> **Ce que l'audit du 01/11/2026 a changé ici** (`AUDIT-2026-11-01.md`, « Suites données ») : (1) le **jeu du capital des retraités (20 %) est le même partout** dans le palier 1 (H176) ; (2) les **économies de santé montent en charge** au lieu d'être à plein effet dès l'année 1 (H177) ; (3) l'**impôt de 50 % sur toutes les transmissions** est nommé et chiffré, avec une variante à droits actuels (H178, § 13.8) ; (4) l'**impôt net des holdings** n'est plus compté l'année 1 (H179) ; (5) le **levier C** de création de valeur est retiré (H180) ; (6) l'IR du retraité appelle `fiscalite_actuelle.js` (H182).

### 13.0 Ce qu'il faut retenir (écrit pour être vrai)

1. **Le taux plat du palier 1 exact est de 34,55 % (35 % retenu au demi-point supérieur), pas 32,4 %.** (Avant l'audit : 34,8 %, parce que le modèle de base gardait 25 % du capital aux retraités alors que la contribution n'en voyait que 20 % : ≈ 20 Md€ de revenus du capital n'étaient imposés nulle part.) Les 32,4 % de la synthèse supposaient une contribution des hautes pensions avec majoration du capital et ne payaient ni le plancher RSA, ni le chômage dégressif, ni le plancher des parents isolés. Cascade (jeu recalé) : voie R seule 33,8 % → plancher RSA 34,4 % → chômage dégressif 35,3 % → parents isolés 35,5 % → hautes pensions (capital sans majoration, 12,0 Md€ nets au central) **34,5 %**. Avec la pension seule (6,3 Md€, le chiffre solide) : **35 %** ; avec la majoration : 34,3 %.
2. **Ce taux suppose un impôt de 50 % sur toutes les successions et donations : 103,5 Md€ au central, contre 20,8 Md€ de droits actuels (DMTG 2024), soit 82,7 Md€ de plus et 6,5 points de taux plat** (§ 13.8). C'est l'hypothèse qui porte le palier 1 sans être dans les titres : **à droits actuels, le taux plat nécessaire est de 41,5 %, ou le socle finançable à 35 % tombe de 513 à 323 €.** Elle est ⚠️ : le flux de 300 Md€ (CAE, vers 2020, donations et assurance-vie comprises), l'absence d'abattement et la fuite de 31 % ne sont pas validés.
3. **Solde du palier 1 à 35 % : −120 / −163 / −236 Md€ (bas / central / haut)**, soit Δ de +49 / +6 / −67 par rapport à aujourd'hui (avant l'audit : −125 / −167 / −236). Au taux exact (34,55 %) : −127 / −169 / −239. Le déficit actuel est conservé, jamais résorbé ; **le haut est plus mauvais de 67 Md€** et le bas plus favorable de 49 Md€. **Ce palier 1 tel quel ne se finance pas : il reproduit un déficit de 160 Md€ et plus ; il lui faut des recettes ou des économies supplémentaires** (le § 17.ter chiffre la dette que cela accumule).
4. **Année 1 : −130 / −182 / −261 Md€** (transition de 4 / 10 / 22 Md€ comprise, création de valeur de 6 / 2,5 / 0,7, économies de santé en montée : 2,7 / 2,0 / 0,6 Md€ la première année au lieu de 12,6 / 9,7 / 2,8, impôt net des holdings non encaissé : 2,1 / 2,9 / 2,2 Md€). **Année 10, avec la création de valeur affectée au déficit : −63 / −134 / −229 Md€** (création de valeur de 56 / 30 / 6, sans levier C). **Sans la ligne E** (croissance par l'IA, la plus fragile) : −96 / −153 / −236. Le déficit ne se résorbe dans aucun scénario en 10 ans.
5. **Trajectoire du socle** (règle : recettes de création de valeur constatées l'année précédente, tranches de 10 Md€, 23,2 € par tranche) : **année 5 : 570 / 523 / 500 €, année 10 : 616 / 546 / 500 €** (favorable / central / défavorable). **Sans la ligne E : 523 / 500 / 500 à 5 ans et 546 / 500 / 500 à 10 ans** (le levier C retiré enlève la tranche que le central sans E touchait à 9 ans). **Au central, le socle ne passe pas de 500 à 550 € en dix ans.** Les mêmes recettes ne peuvent servir à la fois au socle et au déficit.
6. **Les deux gagnants que l'auteur ne voulait pas restent gagnants** : le cadre à 8 000 € nets gagne **+1 156 €/mois** (+1 342 à 10 000 €, +1 856 à 15 000 €), le dirigeant avec holding **+2 528 €/mois en espèces**. Mais **le dirigeant perd 7 194 €/mois en revenu économique** (espèces et bénéfices retenus après IS, une fois l'impôt différé dû à la distribution : de 33 971 à 26 777 €) : son gain est un report, pas une économie. Le diagnostic du § 12.4 (« le dirigeant gagne ») ne vaut qu'en espèces.
7. **Correctif 1, contribution de solidarité au-delà de 8 000 € nets (5 ou 10 %) : elle ne rapporte pas au central** (−1,8 / −4,6 Md€ à 5 / 10 %) : les hauts revenus sont déjà au sommet de la courbe (taux marginal de 62,5 % ; élasticité 0,25 : recette maximale vers 60 %). Elle ne rapporte un peu qu'au bas (+0,7 / +0,9 Md€). Elle n'atteint pas le cadre à 8 000 € pile (seuil), prend 367 €/mois au cadre à 10 000 € (10 %), 2 762 €/mois au dirigeant, et laisse le smicard intact. **C'est une mesure de justice qui a un coût, pas une recette.**
8. **Correctif 2, franchise sur le taux plat : elle fonctionne comme un second socle versé aux seuls revenus d'activité.** Une franchise de 6 000 € par an exige **39,9 %** de taux plat (40 % retenu, +5,4 points) et coûte 65 Md€ ; elle donne au smicard à 35 h +100 €/mois de plus (+185 au lieu de +85) et retire **535 €/mois au cadre à 8 000 €** (+621 au lieu de +1 156) et 1 917 € au dirigeant (+611 au lieu de +2 528 en espèces). À 9 000 € (taux plat 43,7 %, 44 % retenu), le cadre à 8 000 € ne garde que +162, le dirigeant perd 952 €, le couple à un Smic avec 2 enfants perd 39 €. **À 12 000 € : 49,8 % de taux plat (50 % retenu) et −551 € pour le cadre.** Le solde au haut se dégrade (−268 à 40 %, −333 à 50 %). **Aucune réaction de l'offre de travail n'est comptée** (⚠️ H112).
9. **Le plancher RSA du modèle n'est pas progressif** : un revenu d'activité de 0 à 580 € par mois est compensé euro pour euro (taux marginal implicite de 100 %). Il faut un plancher dégressif ; ce coût-là n'est pas chiffré.

### 13.1 Taux plat et solde du palier 1

| Étape (socle 500 €, t_max 30 %, central, santé comprise) | Taux plat nécessaire (Δ = 0) |
|---|---|
| Voie R seule à 25 % du capital aux retraités (§ 11.2, jeu historique) | 34,0 % |
| Voie R seule au jeu recalé (20 %, H176 ; sans plancher RSA, chômage remplacé par le socle, sans hautes pensions) | 33,8 % |
| + plancher RSA 877 € | 34,4 % |
| + chômage dégressif deg2 | 35,3 % |
| + plancher des parents isolés, 1 300 € (2,4 Md€) | 35,5 % |
| **+ hautes pensions, 2 500 €, 20 %, capital sans majoration (12,0 Md€ nets au central) = palier 1** | **34,5 %** (34,55 % exact ; 35 % retenu) |
| Variante : pension seule (6,3 Md€) | 35 % |
| Variante : capital avec majoration de 10 points (14,8 Md€ nets) | 34,3 % |
| Variante : avec la fraude nette (1,4 Md€, ⚠️) | 34,4 % |
| Variante : sans plancher des parents isolés | 34,4 % |

Un point de taux plat vaut 12,7 Md€. Le plancher des parents isolés coûte 1,2 Md€ à 1 100 €, 2,4 à 1 300 €, 4,5 au niveau actuel (1 650 €). Recettes de la contribution des hautes pensions (bas / central / haut) : pension seule 6,6 / 6,3 / 5,8 Md€ ; capital sans majoration 13,4 / 12,0 / 10,4 Md€.

| Solde public total (Md€) | Bas | Central | Haut |
|---|---|---|---|
| Palier 1 à 34,55 % (taux exact) | −126,8 | −169,1 | −239,2 |
| **Palier 1 à 35 % (retenu)** | **−119,8** | **−163,3** | **−235,7** |
| Δ à 35 % par rapport à la loi actuelle | +49,3 | +5,8 | −66,6 |
| Régime de croisière (= palier 1 à 35 %, santé à plein effet) | −119,8 | −163,3 | −235,7 |
| **Année 1** : − transition (4,3 / 10,2 / 22,2) + création de valeur (6 / 2,5 / 0,7), santé en montée, holdings différés | −130,2 | −181,6 | −261,5 |
| **Année 10** : + création de valeur affectée au déficit (56,4 / 29,7 / 6,4), santé à 10 ans | −63,5 | −133,7 | −229,3 |
| Année 10 sans la ligne E (croissance IA) : valeur 24,4 / 10,6 / 0,1 | −95,5 | −152,8 | −235,6 |

*Jeu du capital des retraités (H134, H176)* : le palier 1 applique 20 % du capital aux retraités **dans le modèle de base et dans la contribution** ; avec 25 % dans le modèle de base (comportement d'avant l'audit, encore celui de la voie R des § 11 et 12), le taux plat exact serait de 34,8 % et le solde central à 35 % de −166,8 Md€. Voir `resultats-palier1.txt` § M.

Création de valeur (sources/recherche-creer-de-la-valeur.md § 5, recoupée par test, **levier C retiré**, H180) à 5 ans : 3 / 15 / 37 Md€ ; à 10 ans : 6 / 30 / 56 (bas / central / haut de la source ; 31 et 59 avec le levier C) ; appariée ici au scénario favorable du modèle (le bas du modèle reçoit les gains hauts). Le haut cumule le pire des deux : 6 Md€ de gains contre 236 Md€ de déficit.

### 13.2 Trajectoire des paliers suivants (socle en €/mois)

Règle : l'année t, le socle est augmenté des **recettes constatées l'année t − 1**, par tranches entières de 10 Md€ ; une tranche vaut 23,2 € par mois (coût marginal du modèle : 0,4305 Md€ par €/mois ; 21,5 € en brut ; l'écart vient des prestations différentielles (AAH, plancher RSA, chômage dégressif), pas d'un retour d'impôt : le socle n'est pas imposé). Taux plat inchangé à 35 %.

| Année | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|
| Favorable (gains hauts), avec E | 523 | 546 | **570** | 570 | 593 | 593 | 593 | **616** |
| Central, avec E | 500 | 500 | **523** | 523 | 523 | 546 | 546 | **546** |
| Central, sans E | 500 | 500 | **500** | 500 | 500 | 500 | 500 | **500** |
| Favorable, sans E | 523 | 523 | **523** | 546 | 546 | 546 | 546 | **546** |
| Défavorable (gains bas) | 500 | 500 | **500** | 500 | 500 | 500 | 500 | **500** |

Lecture : **le socle ne dépasse pas 550 € au central en dix ans** et reste à 500 € dans le scénario défavorable ; atteindre 650 € demande 65 Md€ de recettes constatées (au-delà de ce que même le scénario favorable donne avant l'année 10). C'est cohérent avec la synthèse de la création de valeur (« 590 € à l'équilibre » était un cumul de tableaux non recalculé : voir le § 3.1 du v2).

### 13.3 Taux marginaux par décile (central, impôt à plat 35 % + continu t_max 30 %)

| Bande (revenu d'activité) | Taux moyen | Taux marginal personnel | Avec l'IS à 25 % sur un dividende | Écart de revenu (€/mois) | Part de gagnants |
|---|---|---|---|---|---|
| D1 | 35,5 % | 35,9 % | 51,9 % | +178 | 99 % |
| D2 | 36,5 % | 41,6 % | 56,2 % | +293 | 99 % |
| D3 | 37,3 % | 44,3 % | 58,3 % | +381 | 99 % |
| D4 | 38,4 % | 47,2 % | 60,4 % | +536 | 100 % |
| D5 | 39,2 % | 48,6 % | 61,4 % | +569 | 100 % |
| D6 | 40,4 % | 50,6 % | 62,9 % | +564 | 100 % |
| D7 | 41,7 % | 52,2 % | 64,2 % | +565 | 99 % |
| D8 | 43,8 % | 54,5 % | 65,9 % | +556 | 99 % |
| D9 | 46,1 % | 56,6 % | 67,4 % | +467 | 99 % |
| D10a (90e à 95e centile) | 50,1 % | 59,4 % | 69,6 % | +380 | 77 % |
| D10b (95e à 98e) | 53,1 % | 61,1 % | 70,8 % | −297 | 23 % |
| D10c (98e à 99e) | 55,8 % | 62,3 % | 71,7 % | −1 557 | 1 % |
| D10d (99e à 99,9e) | 59,0 % | 63,5 % | 72,6 % | −5 327 | 0 % |
| D10e (top 0,1 %) | 63,4 % | 64,7 % | 73,5 % | −46 898 | 0 % |

Limite à l'infini : **65 % de taux personnel, 73,8 % avec l'IS sur un dividende** (plat 35 % + t_max 30 %). **Lecture** : le dernier décile se scinde ; à partir du 95e centile, la moyenne de la bande perd, parce que leur capital passe du prélèvement forfaitaire de 30 % au plat plus l'impôt continu ; ce n'est pas le même résultat que le cas type « cadre » (revenu d'activité seul). Ces taux n'incluent ni la sortie du plancher RSA (100 % de 0 à 580 € d'activité), ni celle du complément de chômage, ni celle de la prime d'activité (hors du modèle).

### 13.4 Cas types (€/mois, central, palier 1 à 35 %)

| Cas | Avant ⚠️ | Après | Écart |
|---|---|---|---|
| Smicard à 15 h | 913 | 1 054 | +141 |
| Smicard à 35 h | 1 707 | 1 792 | **+85** |
| Couple, 2 enfants, deux Smic | 3 736 | 3 984 | +248 |
| Famille, 2 enfants, un seul Smic | 2 552 | 2 692 | +140 |
| Parent isolé, 2 enfants, sans emploi (plancher ciblé à 1 300 €) | 1 650 | 1 300 | **−350** |
| RSA seul + aide au logement | 877 | 877 | 0 (plancher) |
| Étudiant boursier | 730 | 500 | **−230** (aucun plancher chiffré) |
| AAH (différentiel) | 824 | 824 | 0 |
| Cadre à 60 k€ brut | 3 383 | 4 351 | +968 |
| **Cadre à 8 000 € nets** | 6 290 | 7 446 | **+1 156** |
| Cadre à 10 000 € nets | 7 525 | 8 867 | +1 342 |
| Cadre à 15 000 € nets | 10 473 | 12 329 | +1 856 |
| **Dirigeant avec holding** (espèces) | 15 221 | 17 748 | +2 528 |
| Dirigeant avec holding (**revenu économique**, bénéfices retenus après IS compris) | 33 971 | 26 777 | **−7 194** |
| Retraité à 3 500 € nets | 3 096 | 2 896 | −200 |
| Retraité à 2 200 € nets + 15 000 € de capital (sans majoration) | 2 977 | 2 787 | −190 |
| Retraité à 1 750 € nets (médiane) | 1 719 | 1 719 | 0 |
| Retraité à 800 € nets (ASPA) | 1 044 | 1 044 | 0 |

Chômeurs (revenu mensuel, loi actuelle → palier 1 avec deg2 et plancher RSA 877 €) :

| Chômeur | Mois 2 | Mois 5 | Mois 9 | Mois 15 |
|---|---|---|---|---|
| Au Smic (net antérieur 1 478 €) | 1 064 → 1 087 (+23) | 1 064 → 891 (−173) | 1 064 → 877 (−187) | 1 064 → 877 (−187) |
| Cadre à 5 000 € nets | 3 600 → 2 000 (−1 600) | 3 600 → 1 500 (−2 100) | 3 600 → 1 000 (−2 600) | 3 600 → 877 (−2 723) |

> **« Avant » des cas types** : l'« avant » des cadres est calculé par `fiscalite_actuelle.js` (barème de l'IR des revenus 2025, décote, abattement de 10 % plafonné à 14 555 €, CSG non déductible ; H105) et le coût employeur lu dans la table T14 (14 712 € pour 8 000 € nets, rapport 1,839). L'« avant » du retraité l'est aussi depuis l'audit (H182 : brut = net / 0,909, CSG non déductible dans la base, abattement de 10 % plafonné à 4 439 € par foyer, minimum 454 € ; le barème n'est plus recopié dans `retraites2.js`) : IR de 4 843 €/an à 3 500 € nets (4 444 € avec l'ancien calcul), « avant » de 3 096 € au lieu de 3 130 €. Un seul « avant » par profil (H181, audit A9) : le cadre à 60 k€ brut (3 900 € nets) est à 3 383 € (net moins IR calculé) dans `palier1.js` comme dans `hauts_revenus.js` ; l'interpolation T14 de `modele.js` (3 423 €, gain de +928) n'est plus utilisée pour cet « avant ».

**Lecture** : à 500 € de socle, le complément dégressif d'un chômeur au Smic est épuisé à partir du mois 7 (il retombe sur le plancher RSA) ; le seul gain net est aux deux premiers mois. Le « avant » du parent isolé, de l'étudiant et de la famille à un Smic est estimé (⚠️ H31).

### 13.5 Correctif 1 : contribution de solidarité sur les revenus d'activité (au-delà de x € nets actuels équivalents)

Recette nette (Md€/an) = brute − perte d'assiette (réaction du revenu imposable) − exil du 1 % supérieur. La tranche touchée : 518 000 personnes au-dessus de 8 000 € nets (1,9 % des salariés), 1,11 million au-dessus de 6 000 €. Taux marginal de la tranche avant correctif : 62,5 % (61,6 % à 6 000 €).

| Seuil (nets), taux | Recette nette bas / central / haut | Central : brute / perte d'assiette / exil | Solde public bas / central / haut | Smicard 35 h | Cadre 8 k€ | Cadre 10 k€ | Cadre 15 k€ | Dirigeant (espèces) |
|---|---|---|---|---|---|---|---|---|
| Sans correctif | — | — | −119,8 / −163,3 / −235,7 | +85 | +1 156 | +1 342 | +1 856 | +2 528 |
| 8 000 €, 5 % | +0,7 / −1,8 / −5,5 | 2,5 / 3,2 / 1,1 | −119,1 / −165,1 / −241,2 | +85 | +1 156 | +1 158 | +1 213 | +1 147 |
| 8 000 €, 10 % | +0,9 / −4,6 / −12,5 | 4,5 / 6,8 / 2,3 | −118,9 / −167,9 / −248,2 | +85 | +1 156 | +975 | +569 | −234 |
| 6 000 €, 5 % | +1,5 / −2,0 / −6,9 | 4,0 / 5,0 / 1,1 | −118,3 / −165,3 / −242,6 | +85 | +972 | +975 | +1 029 | +963 |
| 6 000 €, 10 % | +2,1 / −5,6 / −15,9 | 7,3 / 10,6 / 2,3 | −117,7 / −168,9 / −251,6 | +85 | +788 | +607 | +201 | −602 |

**Lecture** : (1) **elle ne rapporte pas de budget** : au central les hauts revenus sont déjà au sommet de la courbe de Laffer (le taux marginal de 62 % est déjà proche du taux de recette maximale 1 / (1 + a × 0,25) ≈ 60 % pour l'exposant de Pareto de 2,66 ; Saez, Slemrod et Giertz, *JEL* 2012) ; chaque point de taux de la tranche perd de l'argent. (2) Elle ne touche **pas le cadre à 8 000 €** (il est au seuil) ; pour neutraliser ses 1 156 € il faudrait un taux de ≈ 7,9 % **sur tout son revenu d'activité** (1 156 / 14 712, hors réactions). Même à 10 % dès 6 000 € nets, le cadre à 8 000 € garde +788 €, celui à 10 000 € +607 € et celui à 15 000 € +201 € : aucun cadre ne passe en négatif. (3) Elle est une mesure de **justice** qui coûte de 2 à 6 Md€ au central (jusqu'à 16 Md€ au haut) ; si on la veut, il faut la présenter ainsi. (4) Ses effets sont plus forts sur le dirigeant que sur le cadre : 10 % de (42 334 − 14 712 €) = 2 762 €/mois. ⚠️ H110 (coefficient coût employeur / net 1,839, table T14, `fiscalite_actuelle.js`), H111.

### 13.6 Correctif 2 : franchise sur le taux plat (financée par un taux plat plus haut)

Les F premiers euros de revenu par an et par adulte sont exonérés du taux plat ; le taux plat est relevé (au demi-point supérieur) pour que le solde central égale celui du palier 1 simple (Δ ≥ 0).

| Franchise F | Taux plat exact (retenu) | Coût de la franchise | Solde bas / central / haut | Smicard 15 h | Smicard 35 h | Couple 2 Smic, 2 enfants | Couple 1 Smic, 2 enfants | Cadre 8 k€ | Cadre 15 k€ | Dirigeant |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 (palier 1) | 34,5 % (35 %) | 0 | −119,8 / −163,3 / −235,7 | +141 | +85 | +248 | +140 | +1 156 | +1 856 | +2 528 |
| 3 000 € | 36,9 % (37 %) | 30 Md€ | −118,9 / −168,3 / −251,5 | +216 | +137 | +354 | +100 | +954 | +1 397 | +1 774 |
| **6 000 €** | **39,9 % (40 %)** | 65 Md€ | −108,4 / −167,8 / −268,1 | +298 | +185 | +449 | +41 | **+621** | +677 | +611 |
| 9 000 € | 43,7 % (44 %) | 107 Md€ | −92,4 / −167,0 / −291,3 | +394 | +236 | +550 | −39 | **+162** | −296 | −952 |
| 12 000 € | 49,8 % (50 %) | 162 Md€ | −66,2 / −168,4 / −332,5 | +439 | +286 | +652 | −158 | −551 | −1 781 | −3 322 |
| 18 000 € | aucun ≤ 80 % | — | — | | | | | | | |

**Lecture** : (1) **une franchise est une prestation versée aux seuls revenus d'activité** : à 35 %, 6 000 € d'exonération valent 2 100 €/an (175 €/mois) à toute personne gagnant plus de 6 000 €, soit 65 Md€ (27 M d'actifs). Elle sert surtout à corriger le gain du cadre et du dirigeant, au prix d'un taux plat de 40 % à 6 000 €. (2) **Elle améliore le smicard** (+100 €/mois à 6 000 €) **mais pas la famille à un seul Smic** (+41 au lieu de +140, car le foyer est imposé en commun), et ne change rien pour le chômeur, le parent isolé et l'étudiant, qui restent perdants. (3) **Elle dégrade la robustesse** : le solde au haut passe de −236 à −268 (6 000 €) et −333 (12 000 €) : un taux plat plus haut aggrave les réactions fortes des scénarios haut (non décomposé, ⚠️), alors que le bas s'améliore (−108 à 6 000 €, −66 à 12 000 €). (4) Elle déplace le point de bascule : on reçoit 6 000 € de socle par an et on paie 0,40 × (R − 6 000) ; on est bénéficiaire net jusqu'à R = 6 000 + 6 000 / 0,40 = **21 000 € par an** (calcul simple), contre 6 000 / 0,35 ≈ 17 100 € au palier 1 simple. La phrase « en dessous d'environ 17 000 € par an, on reçoit plus qu'on ne verse » devient « 21 000 € ». (5) Aucune réaction de l'offre de travail n'est comptée (taux marginal nul sous F) : le résultat est prudent pour le budget.

**Combinaison** (franchise 6 000 € + contribution de 10 % au-delà de 8 000 € nets) : taux plat 40,7 % (41 %) ; soldes −95,9 / −166,0 / −282,1 ; smicard 15 h +295, smicard 35 h +170 ; couple 2 Smic +420 ; cadre 8 k€ +479 ; cadre 10 k€ +76 ; cadre 15 k€ −881 ; dirigeant −2 570.

### 13.7 Ce que cela change pour la recommandation (à discuter avec l'auteur)

- **Le palier 1 recalculé est à 35 % de taux plat, pas à 32-34 %, et ce 35 % suppose les transmissions à 50 %.** Le chiffre de 32,4 % vient d'une hypothèse sur le capital des retraités sans source ; l'honnête est 34,5 à 35 %. À afficher : « environ 35 %, si les successions et donations sont taxées à 50 % ; environ 41,5 % avec les droits actuels ».
- **Le palier 1 conserve le déficit : −163 Md€ au central, −120 au bas, −236 au haut** (année 1 : −182 au central). À 10 ans, avec la création de valeur affectée au déficit : −134 au central ; **jamais plus près de zéro que −63 Md€** (scénario favorable). Si les mêmes recettes servent au socle, le socle monte de 46 € (central) en 10 ans. **Dit sans détour : le palier 1 tel quel n'est pas soutenable sans recettes ou économies supplémentaires.**
- **Cadre et dirigeant** : la contribution de solidarité ne rapporte rien (au central) et ne touche pas le cadre à 8 000 € ; la franchise le corrige mais fait passer le taux plat à 40-44 %. **Le seul levier cohérent avec « personne ne perd en bas » et un récit de simplification est d'assumer le gain du cadre et de corriger le dirigeant à la source** : l'impôt différé sur les bénéfices retenus ramène sa perte économique à −7 194 €/mois, c'est-à-dire que le dirigeant avec holding contribue déjà beaucoup, en revenu économique.
- **À coder ensuite** : un plancher RSA dégressif (taux de sortie), le plancher de l'étudiant, la contribution de solidarité sur base économique (avec capital), l'élasticité de l'offre de travail sous franchise.
- **Ce qui reste ⚠️** : H21, capital des retraités, « avant » des cas types, effectifs des parents isolés, coefficient coût employeur / net 1,839, élasticités, transmissions (§ 13.8).

### 13.8 Hypothèses rendues visibles par l'audit (H177 à H180)

**Transmissions (H3, H178).** Où : `modele.js` (`tTransmissions: 0.5`, `recettesTransmissions`), non surchargé par `palier1.BASE`. D'où : choix de Claude à l'origine du simulateur (H3 : « les transmissions restent au taux de 50 %, hors impôt continu »), flux de 300 Md€ par an « vers 2020 » (CAE, note n° 69, 2021 ; donations et assurance-vie comprises), fuite 18 / 31 / 48 % (H17). Poids : 103,5 Md€ au central (bas 123 / haut 78), contre 20,8 Md€ de DMTG en 2024 (Insee, tableaux 3.216-3.217 ; 20,9 Md€ au PLF 2026) : **+82,7 Md€, soit 6,5 points de taux plat**. Aucun abattement, aucune exonération (résidence principale, entreprises, conjoint) n'est modélisé : l'hypothèse est ⚠️ et plutôt optimiste.

| Variante | Taux plat exact (retenu) | Solde à 35 % bas / central / haut | Socle finançable à 35 %, déficit actuel conservé |
|---|---|---|---|
| Palier 1 : transmissions à 50 % (103,5 Md€) | 34,55 % (35 %) | −119,8 / −163,3 / −235,7 | 513 € |
| **Droits actuels (20,8 Md€)** | **41,5 % (41,5 %)** | **−222,0 / −246,0 / −292,9** | **323 €** |

À droits actuels, au taux retenu de 41,5 % : −123,7 / −168,9 / −252,6. Les trajectoires de long terme (§ 17) reposent sur le même palier 1 : à droits actuels, chaque solde est 82,7 Md€ plus bas (la ligne « reste du budget » les indexe sur le PIB, § 17.ter) : option `{ transmissionsActuelles: true }` de `palier1.solde`.

**Santé (H177).** Les économies (9,7 Md€ au central à effet plein) montent linéairement de 0 à 100 % sur 5 (pertinence), 4 (médicaments), 6 (hôpital) et 25 ans (prévention) : 2,0 Md€ la première année, 4,0 la deuxième, 9,3 la cinquième, 9,6 la dixième (bas 2,7 / 12,0 / 12,5 ; haut 0,6 / 2,7 / 2,8). Le régime de croisière et les trajectoires 2035-2065 du § 17 gardent l'effet plein (la montée coûte ≈ 20 Md€ cumulés sur une dette de plusieurs milliers : négligeable à cette échelle).

**Holdings (H179).** Les cas types disent l'impôt sur les bénéfices retenus (net du crédit d'IS) **différé** jusqu'à la distribution ; le solde agrégé le comptait comme encaissé dans l'année. Poids : 2,1 / 2,9 / 2,2 Md€ (bas / central / haut). En régime de croisière, on le compte (hypothèse : les bénéfices sont distribués ou transmis à terme ; ⚠️ si le report est définitif, le solde est surestimé de ≈ 3 Md€, soit 0,2 point de taux plat) ; l'année 1, on ne le compte pas.

**Levier C (H180).** Retiré de la création de valeur : il supposait des allègements de cotisations que le palier 1 supprime avec toutes les cotisations, et le modèle compte déjà la réponse de l'offre de travail à la baisse des taux marginaux. Poids évité : 0,8 Md€ à 5 ans, 1,6 Md€ à 10 ans au central.

## 14. Capitalisation progressive dans le palier 1 (01/11/2026, `capitalisation.js`, `rapport_capitalisation.js`, `resultats-capitalisation.txt`, `test_capitalisation.js` : 47 contrôles au vert ; simulateur 438)

> **Régénéré le 01/11/2026 après l'audit (H176 à H180).** Les tableaux ci-dessous sont ceux de `resultats-capitalisation.txt` (identique à la sortie de `rapport_capitalisation.js`). Ancien → nouveau au central (années 5 / 10 / 20) : le solde sans capitalisation passe de −151 / −136 / −113 à **−148 / −134 / −111** (jeu de capital recalé partout, santé en montée, holdings, sans levier C) ; le solde avec 3 points de −182 / −185 / −166 à **−179 / −183 / −164** ; les socles (523 / 546 / 616 sans, 451 / 432 / 493 avec) et la dette de transition (106 / 331 / 850 Md€) ne changent pas. **Les colonnes « avec » et « sans » du solde et du socle sont des alternatives, pas des cumuls** : « solde avec » suppose que la capitalisation est payée par le déficit (socle inchangé), « socle avec » qu'elle est payée par une baisse du socle (déficit inchangé) ; les mêmes recettes ne peuvent pas servir aux deux (audit A13).

Effet de la part capitalisée (T48) sur le solde public et le socle du palier 1 (socle 500 €, plat 35 %, santé comprise), aux années 5, 10 et 20 (année 1 = 2027), Md€ de 2025 et € par mois et par adulte non retraité. **Financement par la dette de transition** (variation de la dette = double charge + intérêts), socle compensé au coût marginal du modèle (H120). Scénarios : bas = favorable, central, haut = défavorable (H117).

**3 points, financement par la dette**

| scénario | année | solde sans | solde avec | socle sans | socle avec | dette de transition |
|---|---|---|---|---|---|---|
| favorable | 5 | −84 | −115 | 570 | 498 | 106 |
| favorable | 10 | −63 | −113 | 616 | 501 | 332 |
| favorable | 20 | −23 | −75 | 709 | 588 | 848 |
| **central** | 5 | −148 | −179 | 523 | **451** | 106 |
| **central** | 10 | −134 | −183 | 546 | **432** | 331 |
| **central** | 20 | −111 | −164 | 616 | **493** | 850 |
| défavorable | 5 | −233 | −263 | 500 | 429 | 106 |
| défavorable | 10 | −229 | −278 | 500 | 388 | 326 |
| défavorable | 20 | −223 | −276 | 523 | 401 | 837 |

**Lecture.** (1) Au central, 3 points capitalisés coûtent **31 Md€ de déficit à 5 ans, 49 à 10 ans, 53 à 20 ans** : le socle de 523 / 546 / 616 € tombe à **451 / 432 / 493 €** (−72, −114, −123 €/mois). (2) Un seul point : −36 à −40 €/mois du socle (central : 487 / 508 / 576 €) ; six points : −150 à −246 €/mois à 10-20 ans (central : 396 € à 10 ans, 370 € à 20 ans). (3) Le gain n'apparaît pas dans le solde de l'État sur 20 ans : la dette de transition (330 Md€ à 10 ans, 850 à 20 ans pour 3 points) n'est pas remboursée, alors que le fonds accumule ; il revient aux retraités (écart r − ρ, hors solde) et à la collectivité en actif net seulement à très long terme. (4) **Financement par prélèvement** : solde et socle inchangés, mais 2 points de cotisation en plus à 5 ans, 2,9 à 10 ans (3 points), 5,4 à 20 ans (6 points), soit une baisse du net des salariés. (5) La capitalisation **n'aide pas le socle avant de longues années** : elle le finance moins, pas plus. À dire clairement : c'est une réforme de long terme dont le coût arrive d'abord. Ordres de grandeur sous hypothèses (H24 : V2712 ; H35-H36 non sourcées : V2713), jamais des prédictions ; la réforme n'est pas décidée.

Tableaux complets (1, 3 et 6 points ; dette et prélèvement) : `resultats-capitalisation.txt`. Reproduction : `jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js ../retraites/capitalisation.js capitalisation.js rapport_capitalisation.js`.


## 15. Hauts revenus et échappement fiscal : second coude, reprise du socle, holdings sans différé (01/11/2026 ; **révisé le 01/11/2026 : plafond 75 %, élasticités par bande, holdings passifs**) (`hauts_revenus.js`, `rapport_hauts_revenus.js`, `resultats-hauts-revenus.txt`, `test_hauts_revenus.js` : 92 contrôles au vert ; modules sous-jacents au vert)

> **Note du 01/11/2026 (audit, H176)** : le palier 1 de référence a le même jeu de capital des retraités (20 %) partout : taux plat exact 34,55 % (34,8 % avant), solde central à 35 % −163 Md€ (−167 avant). `resultats-hauts-revenus.txt` est régénéré. **La recette nette de E73 passe de 5,6 à 9,1 Md€ au central** parce que 5 points de plus du capital sont dans l'assiette des actifs (contre-épreuve : `extra` de E73 avec le jeu à 25 % = 5,6 ; à 20 % = 9,1) ; les écarts de revenu des profils sont inchangés (le retraité à 3 500 € : « avant » 3 096 € au lieu de 3 130 €, écart −200 €).

> Mandat (T47) : le palier 1 laisse gagner le cadre à 8 000 € nets (+1 156 €/mois ; +1 019 avant le recalcul de l'IR du 01/11/2026) et le dirigeant avec holding (+2 528 € en espèces), alors que l'auteur demande la même logique pour les hauts salaires et l'évasion fiscale ; les deux correctifs du § 13 (contribution au-dessus de 8 000 €, franchise de 6 000 €) fonctionnent mal. On cherche une correction **continue** (aucun seuil), avec les mêmes réactions que le modèle (élasticité du revenu imposable, exil du 1 % supérieur). Md€ par an, euros 2024-2025, solde public total (déficit actuel compris), taux plat de 35 % fixé, « bas » = réactions faibles (favorable), « haut » = réactions fortes. Reproduction : `jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js hauts_revenus.js rapport_hauts_revenus.js` (sortie : `resultats-hauts-revenus.txt`). Hypothèses H123 à H133 : `methode.md` § 16. Des ordres de grandeur sous hypothèses, jamais des prédictions.
>
> **Révision du 01/11/2026** (conclusions de `sources/recherche-hauts-revenus-droit.md`, V2730-V2733, V2761-V2768) : (1) **plafond de taux marginal total ramené de 80 % à 75 % au plus** (le Conseil constitutionnel a admis 75 % en 2013 pour une taxe exceptionnelle et censuré 75,04 % et 82 % : aucun précédent pour 80 %) ; l'option F (77 %) est **écartée** ; (2) **élasticité par bande** au lieu d'une élasticité unique : D6-D9 0 / 0,05 / 0,10, D10 0,15 / 0,31 / 0,45 (Cabannes, Houdré, Landais 2014) ; (3) **mesure B limitée aux holdings de gestion de patrimoine (passives)**, avec preuve contraire ouverte (transparence admise seulement ciblée) ; part de l'assiette concernée : 70 %, ⚠️ non sourcée.

### 15.0 Ce qu'il faut retenir (écrit pour être vrai)

> **Réexamen du 01/11/2026 (plafond juridique, nouvelle option recommandée E73).** Depuis que l'IR d'aujourd'hui est calculé avec le vrai barème (H105), les cadres gagnent plus au palier 1 (+1 156 € au lieu de +1 019 pour le cadre à 8 000 €). Question : la contrainte de 75 % (idéalement 73 %, reprise du socle comprise) empêche-t-elle de ramener les cadres à 8 k et 15 k sous le gain du salarié médian (+636 €/mois) ? **Réponse : non.** Elle n'empêche pas de passer sous le médian ; elle empêche seulement de tomber à zéro (point 3). L'option E de la première version dépassait 73 % (74,1 %) parce que la zone de reprise du socle commençait à 8 000 € ; E73 élargit cette zone à 7 500-15 000 € et tient 73,0 % reprise comprise, avec les mêmes gains (+330 / +233).

1. **Trois leviers, trois rôles.** (B2) **Holdings passifs sans différé** : l'impôt sur la quote-part des bénéfices retenus est exigible dans l'année pour les holdings de gestion de patrimoine (sans activité réelle), au lieu d'être reporté jusqu'à la distribution ; un holding qui prouve une activité économique réelle est exclu (preuve contraire). Il ne coûte rien au solde et **règle l'essentiel du dirigeant** : de +2 528 € en espèces à **−4 277 €/mois** si 70 % de l'assiette est passive (⚠️ H133 ; −2 333 à 50 %, −7 194 à 100 %). (C) **Reprise dégressive du socle** (500 €/mois) entre **7 500 et 15 000 €** de revenu mensuel (coût employeur + capital) : 6,7 points de taux marginal dans la zone (8,3 points entre 8 000 et 14 000 €, version précédente). (D) **Second coude** I2(R) = t2 × [(R − R1) − R1 ln(R/R1)] : 8 % au-delà de 60 000 € par an et par adulte, continu, taux marginal 8 % × (1 − R1/R).
2. **Option recommandée E73 = B2 + C (7 500-15 000 €) + D (8 % au-delà de 60 000 €), dans le plafond de 73 %.** Écart de revenu disponible par rapport au palier 1 (€/mois) : **Smic +85** et **médian +636** (inchangés) ; **cadre à 4 000 € nets +940** (+968 : −28) ; **cadre à 8 000 € +330** (+1 156, soit 29 % de son gain, 52 % du gain du médian) ; **cadre à 15 000 € +233** (+1 856, 13 % de son gain, 37 % du gain du médian) ; **dirigeant −8 724 € en espèces** (+2 528 avant) et **−11 640 € de revenu économique** (−34 %) ; **retraité à 3 500 € −200** (inchangé). **Taux marginal total : limite 73 %, maximum 73,0 % reprise comprise** (72,9 % à 175 k€ pour le cadre à 8 000 €, qui se trouve dans la zone de reprise ; 69,4 % à 328 k€, 71,5 % à 808 k€). L'ancienne E (reprise 8 000-14 000 €) montait à 74,1 % vers 166 000 € : elle est gardée comme option « E » pour mémoire.
3. **La frontière : le gain du cadre en fonction du plafond (§ 15.4).** Avec les garde-fous (aucun des deux cadres ne perd ; cadre à 4 k presque intact ; médian intact), la meilleure combinaison donne : plafond **70 % : +590 / +655** (le cadre à 15 k dépasse le médian de 19 €) ; **71 % : +469 / +515** ; **72 % : +373 / +375** ; **73 % : +311 / +234** ; **74 % : +268 / +94** ; **75 % : +252 / +42** (cadres 8 k / 15 k). **Donc : sous le médian dès 71 %, cadre à 15 k à +234 € à 73 %.** L'objectif « pas plus que le médian » est atteint ; l'objectif « zéro » ne l'est pas : à 75 %, le cadre à 8 k garde au moins +252 € (écart à zéro : 252 €, soit 22 % de son gain du palier 1) ; à 73 %, +311 € (écart : 311 €). On atteint zéro (+51 / −9 à 73 %) seulement en levant les garde-fous, c'est-à-dire en faisant payer le cadre à 4 000 € net (−236 €/mois) et le salarié médian (−45 €/mois : second coude dès 20 k€).
4. **Effet sur le solde (taux plat 35 % fixé) : +24 / +9 / −11 Md€ (bas / central / haut)** par rapport au palier 1, soit **−95 / −154 / −247** (palier 1 : −120 / −163 / −236). Recette nette de E73 : 24,3 / 9,1 / −11,3 Md€ (23,3 / 5,6 / −11,6 avant l'audit). **À taux de socle constant, le socle gagnerait +56 / +21 / −26 €/mois** (taux plat exact : 33,7 %, retenu 34 %). Avec l'ancienne élasticité unique (0,12 / 0,25 / 0,40) E73 donne +23 / +7 / −14. **Ce n'est pas une recette, c'est une mesure de justice dont le résultat dépend de l'élasticité du haut du décile supérieur.**
5. **Où se perd la recette (E73).** Au central, **D10a (P90-95) perd −2,9 Md€** (élasticité 0,31 : la réaction l'emporte sur le gain mécanique) ; D9 gagne +1,7 ; D10b à D10e rapportent +3,6, +2,2, +2,0 et +2,3. Au haut, D10a perd −7,2, D10b −2,8, et les exilés (D10d, D10e) −2,3 et −0,6.
6. **Variantes dans le plafond.** **E70** (t2 = 5 %, limite 70 %, maximum 72,2 %) : cadre 8 k +440, cadre 15 k +654, dirigeant −7 244 € en espèces, solde +18 / +7 / −5. **G** (6 % au-delà de 80 000 €, maximum 72,1 %) : cadre 8 k +490, 15 k +669, solde +17 / +5 / −7. **E75** (t2 = 9,36 %, maximum exactement 75,0 %, zone 8 000-14 000 €) : cadre 8 k +252, 15 k +42, dirigeant −9 395 €, solde +25 / +7 / −13. **Écartée : F** (t2 = 12 %, limite 77 % > 75 %) : cadre 8 k +138, 15 k −329 ; elle ne serait défendable ni devant le Conseil constitutionnel ni devant le Conseil d'État (avis de 2013 évoqué à deux tiers, V2768, non relu). **t2 maximal compatible avec le plafond** (B2 + reprise 7 500-15 000 €) : 10 % pour 75 %, **8 % pour 73 %** et 3,6 % pour 70 % : avec la zone élargie, c'est la limite à l'infini (65 % + t2) qui borne, et non plus la zone de reprise (avec 8 000-14 000 €, la reprise absorbait 8,3 points : t2 admissible 6,2 % à 73 %).
7. **Ce que les profils montrent d'autre** : l'écart n'est pas entre « hauts » et « bas » mais entre **actifs** et **retraités**. À peu près au même niveau de vie, le cadre à 4 000 € nets gagne **+940 €/mois (+28 %)**, plus que le salarié médian (+636) : aucune des options admissibles ne le ramène sous le médian sans toucher le médian lui-même (R1 ≥ 60 000 € et zone ≥ 7 000 € les épargnent) ; le retraité à 3 500 € nets perd **200 €/mois (−6 %)**. Aucun des leviers ne touche ce point ; il découle de la voie R (le socle et la baisse des prélèvements vont aux actifs, la contribution des hautes pensions aux retraités). C'est un choix à nommer, pas une erreur de calcul.

### 15.1 Options (taux plat 35 % fixé ; solde bas / central / haut en Md€ ; élasticités par bande)

| Option | Taux marginal total : limite / maximum | Solde bas / central / haut | Recette nette (central) | Δ vs palier 1 | Socle en plus à taux constant (€/mois) | Taux plat exact (Δ central = 0) |
|---|---|---|---|---|---|---|
| A. Palier 1 sans correctif | 65 % / 65 % | −120 / −163 / −236 | 0 | — | — | 34,5 % |
| B. Holdings sans différé (assiette entière) | 65 % / 65 % | −120 / −163 / −236 | 0 | 0 / 0 / 0 | 0 | 34,5 % |
| B2. Holdings passifs sans différé (70 %, ⚠️) | 65 % / 65 % | −120 / −163 / −236 | 0 | 0 / 0 / 0 | 0 | 34,5 % |
| C. Reprise du socle 8 000 → 14 000 € | 65 % / 69 % | −110 / −158 / −236 | 4,9 | +10 / +5 / 0 | +22 / +11 / 0 | 34,1 % |
| D. Second coude 8 % au-delà de 60 000 € | 73 % / 73 % | −105 / −159 / −244 | 4,3 | +15 / +4 / −8 | +34 / +10 / −18 | 34,2 % |
| **E73 (recommandée) = B2 + reprise 7 500 → 15 000 € + D** | **73 % / 73,0 %** | **−95 / −154 / −247** | **9,1** | **+24 / +9 / −11** | **+56 / +21 / −26** | **33,7 %** |
| E (ancienne recommandation : reprise 8 000 → 14 000 €) | 73 % / 74,1 % | −96 / −156 / −246 | 7,5 | +23 / +7 / −10 | +54 / +17 / −24 | 33,9 % |
| E75 (la plus dure admissible, t2 = 9,36 %) | 74,4 % / 75,0 % | −94 / −156 / −248 | 7,4 | +25 / +7 / −13 | +59 / +17 / −29 | 33,9 % |
| E70 (t2 = 5 %) | 70 % / 72,2 % | −101 / −156 / −241 | 7,1 | +18 / +7 / −5 | +43 / +17 / −13 | 33,9 % |
| G (6 % au-delà de 80 000 €) | 71 % / 72,1 % | −103 / −158 / −243 | 5,4 | +17 / +5 / −7 | +39 / +12 / −17 | 34,1 % |
| ~~F (écartée : t2 = 12 %)~~ | 77 % / 77 % | −91 / −157 / −254 | 6,7 | +29 / +7 / −18 | +68 / +16 / −41 | 33,9 % |

### 15.2 Profils (€/mois, écart de revenu disponible en espèces avec le pourcentage du revenu avant ; central, taux plat 35 %)

| Profil | Avant | A (palier 1) | B | B2 | **E73** | E (ancienne) | E70 | E75 | G | ~~F~~ |
|---|---|---|---|---|---|---|---|---|---|---|
| Smic à 35 h | 1 707 | +85 (+5 %) | +85 | +85 | **+85** | +85 | +85 | +85 | +85 | +85 |
| Salarié médian | 2 116 | +636 (+30 %) | +636 | +636 | **+636** | +636 | +636 | +636 | +636 | +636 |
| Cadre à 60 k€ brut (≈ 4 000 € nets) | 3 383 | +968 (+29 %) | +968 | +968 | **+940 (+28 %)** | +940 | +950 | +935 | +967 | +926 |
| Cadre à 8 000 € nets | 6 290 | +1 156 (+18 %) | +1 156 | +1 156 | **+330 (+5 %)** | +311 | +440 | +252 | +490 | +138 |
| Cadre à 15 000 € nets | 10 473 | +1 856 (+18 %) | +1 856 | +1 856 | **+233 (+2 %)** | +233 | +654 | +42 | +669 | −329 |
| Dirigeant avec holding, **espèces** | 15 221 | +2 528 | −7 194 | −4 277 | **−8 724** | −8 724 | −7 244 | −9 395 | −7 492 | −13 614 |
| Dirigeant, **revenu économique** (33 971 avant) | 33 971 | −7 194 (−21 %) | −7 194 | −7 194 | **−11 640 (−34 %)** | −11 640 | −10 160 | −12 311 | −10 409 | −13 614 |
| Retraité à 3 500 € nets (hautes pensions, inchangé) | 3 096 | −200 (−6 %) | −200 | −200 | **−200** | −200 | −200 | −200 | −200 | −200 |

B et B2 diffèrent par la part passive (B : 100 % de l'assiette, B2 : 70 %). En B, l'écart en espèces du dirigeant égale sa variation de revenu économique (le « gain » du palier 1 était un report) ; en B2 la part non passive reste différée (preuve contraire). Part passive 0 / 50 / 70 / 100 % : +2 528 / −2 333 / −4 277 / −7 194 € en espèces. Équation à deux coudes de E73 (impôt total à plat 35 % + continu 30 % + second coude, par adulte) : 60 000 € → 25 203 € (42,0 %, marginal 53 %) ; 120 000 € → 60 685 € (50,6 %, 63 %) ; 175 200 € → 96 440 € (55,0 %, 66,2 % hors reprise du socle) ; 300 000 € → 181 089 € (60,4 %, 69 %) ; 1 M€ → 677 642 € (67,8 %, 71,8 %). **Un impôt moyen de 68 % à 1 M€ de coût employeur, et un taux marginal jamais supérieur à 73 %, reprise du socle comprise.**

### 15.3 Recommandation et objections (steelman)

**Je recommande E73, avec B2 non négociable.** B2 ne coûte rien au solde et ferme l'échappement des holdings passifs ; la reprise du socle (7 500-15 000 €) et le second coude (8 % au-delà de 60 000 €) ramènent le cadre à 8 000 € à +330 € (5 % de son revenu, contre 18 %) et le cadre à 15 000 € à +233 €, soit moins que le salarié médian (+636), sans dépasser 73,0 % de taux marginal total (plafond juridique 75 %, deux points de marge). Si l'auteur veut davantage de marge juridique, E70 ou G (maximum 72 %, cadre à 8 000 € +440 à +490, mais cadre à 15 000 € +654 à +669, au-dessus du médian) ; s'il veut la même logique au sens strict (aucun gain au-delà de 8 000 €), l'option F est **écartée** (77 %) ; E75 s'en approche (cadre à 8 000 € +252 €, à 15 000 € +42 €) au prix d'une marge nulle sous le plafond.

### 15.4 Frontière sous plafond (`frontiere()`, rapport § F)

Recherche sur une grille (R1 de 60 000 à 80 000 €, début de la reprise de 7 000 à 9 000 €, fin de 12 000 à 20 000 €), avec, pour chaque point, le plus grand t2 compatible avec le plafond (reprise comprise) ; on retient la combinaison qui minimise le plus grand des gains des cadres à 8 k et 15 k, sous trois garde-fous : aucun des deux ne perd, le cadre à 4 k perd au plus 60 € de plus qu'au palier 1, le médian est intact. Médian de référence : +636 €/mois ; sans correctif : +1 156 / +1 856.

| Plafond (reprise comprise) | Combinaison trouvée | Cadre 4 k | Cadre 8 k | Cadre 15 k | Sous le médian ? |
|---|---|---|---|---|---|
| 70 % | R1 60 000, zone 7 000-18 000, t2 5 % | +945 | +590 | +655 | **non** (15 k : +19 €) |
| 71 % | zone 7 000-16 000, t2 6 % | +940 | +469 | +515 | oui |
| 72 % | zone 7 000-15 000, t2 7 % | +936 | +373 | +375 | oui |
| 73 % | zone 7 000-14 000, t2 8 % | +932 | +311 | +234 | oui |
| 74 % | zone 7 000-14 000, t2 9 % | +928 | +268 | +94 | oui |
| 75 % | zone 8 000-14 000, t2 9,4 % | +935 | +252 | +42 | oui |

**E73** (zone 7 500-15 000 €, t2 8 %) est à 19 €/mois de la frontière à 73 % pour le cadre à 8 k (+330 contre +311) et sur la frontière pour le cadre à 15 k (+233) ; j'ai préféré cette zone parce qu'elle laisse intact le cadre à 4 000 € net (coût employeur 7 309 €, sous 7 500 €) : la combinaison 7 000-14 000 € lui retirerait 22 € de plus (8 € pour le cadre à 60 k€ brut du modèle). **Lecture de la contrainte** : (1) pour « pas plus que le médian », le plafond de 75 % n'est pas contraignant : 71 % suffit ; (2) pour « zéro » elle l'est : le plus petit gain sous garde-fous est +252 € (8 k) et +42 € (15 k) à 75 %, +311 € et +234 € à 73 % ; sans garde-fous, 73 % donnerait +51 / −9 mais en retirant 236 €/mois au cadre à 4 000 € net et 45 € au salarié médian. L'écart à zéro est donc de **252 à 311 € par mois pour le cadre à 8 k**, et il se referme presque entièrement pour le cadre à 15 k (42 à 234 €) ; (3) le taux plat de base, lui, ne change pas l'écart entre cadres et médian (tous les profils le subissent ; il sert à équilibrer le budget) et les revenus du capital sont déjà dans l'assiette (reprise du socle sur coût employeur + capital ; transparence H21, ⚠️ H127) : aucun gain à attendre de ces leviers pour cet objectif. Ces deux derniers points sont des raisonnements, pas des calculs refaits ici.

Objections, avec ma réponse :
1. **« 73 % de taux marginal limite (73,0 % au maximum avec E73) est au-dessus du taux qui maximise la recette. »** Vrai : le modèle trouve un sommet vers 62 % (§ 13), la littérature donne 72,7 % pour une élasticité de 0,25 et un paramètre de Pareto de 1,5 (Saez, Slemrod, Giertz, *JEL* 2012), 57 à 83 % selon la part de négociation et d'évitement (Piketty, Saez, Stantcheva, 2014). E73 rapporte +9 Md€ au central et **−11 au haut** (Δ vs palier 1) : c'est le prix de la correction. Réponse : c'est assumé comme justice ; on peut s'arrêter à E70 ou G (maximum 72 %). Le plafond de 75 % lui-même vient de la jurisprudence (V2730) : la limite de 73 % laisse deux points de marge, et l'avis du Conseil d'État de 2013 évoqué à deux tiers (V2768, non relu) la dépasserait.
2. **« Les très mobiles partent. »** Élasticités de migration de 1,5 à 2 pour les étrangers très qualifiés (Kleven et al., *QJE* 2014), très inférieures pour les nationaux. Le modèle compte l'exil du 1 % et du 0,1 % supérieurs (MU_EXIL 0,8 × mobilité du scénario) : ils contribuent +1,9 et +2,1 Md€ au central, **−2,3 et −0,6 au haut**. Réponse : le risque est dans le scénario haut ; il est chiffré, pas écarté.
3. **« Un impôt exigible sur des bénéfices non distribués étouffe l'investissement. »** C'est l'objection sérieuse à B : l'entrepreneur qui réinvestit paie sans avoir de liquidité. Réponse retenue dans la révision : B2 vise les seuls holdings de gestion de patrimoine, avec preuve contraire ouverte (cohérent avec 123 bis, 239 bis AB et la décision admettant la transparence ciblée). Autres réponses possibles, non chiffrées ici : report avec intérêts (le différé coûte alors son vrai prix) ; régime de la quote-part exigible *uniquement* sur ce qui n'est pas réinvesti dans une activité productive (⚠️ définition difficile, risque de contournement) ; distribution forcée. **Contrainte juridique à vérifier** : capacité contributive (art. 13 de la Déclaration de 1789) et taux « confiscatoire » (V2730), liberté d'établissement pour les holdings étrangères (V2731).
4. **« Reprise du socle = taux marginal caché de 6,7 points entre 7 500 et 15 000 €. »** Oui : 500 € sur 7 500 € de revenu. C'est un taux, pas un seuil (aucune falaise) ; il s'ajoute au 60-66 % de la zone (total ≤ 73 %).
5. **« Le modèle individualise : couples, quotient familial, enfants, revenus du conjoint sont ignorés. »** Vrai ; R1 et la reprise s'appliquent par adulte. Les profils sont des célibataires. **Traité au § 16** (dimension foyer).
6. **« Les profils "avant" sont des estimations. »** Cadres à 8 000 € et 15 000 € : net moins l'IR calculé par `fiscalite_actuelle.js` (barème des revenus 2025, décote, abattement plafonné ; H105), coût employeur lu dans la table T14 (rapport 1,839 ; H110) ; ni frais réels ni CEHR (⚠️). Le cadre à 4 000 € utilise la même fonction (« avant » 3 383 € ; 3 423 € dans `modele.js`, interpolation T14).
7. **Contre-objection de Claude.** La demande d'appliquer la même logique aux hauts salaires est ambiguë : la même que pour les hautes pensions (taxer la part au-dessus d'un seuil) ou la même que pour tout le monde (aucun gain particulier) ? Le second est ce que F réalise ; le premier ressemblerait à E, mais le retraité à 3 500 € (−6 %) est nettement plus pénalisé que le cadre à 8 000 € (+5 %) : si l'objectif est la symétrie avec les retraités, il faut soit alléger les hautes pensions (palier 1 : seuil 2 500 €, 20 %), soit durcir E73 (jusqu'à E75).

## 16. Dimension « foyer » : couple, quotient conjugal, enfants (01/11/2026, `foyer.js`, `rapport_foyer.js`, `resultats-foyer.txt`, `test_foyer.js` : 56 contrôles au vert ; modules sous-jacents au vert)

> **Statut.** Ordres de grandeur sous hypothèses H136 à H144 (`methode.md`), dont trois (nombre de couples, part de monoactifs, homogamie) **non sourcées** ; « aujourd'hui » est une approximation (pas OpenFisca) ; sources : `sources/recherche-foyer-quotient.md` (V2805 à V2816). Reproduction : `jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js foyer.js rapport_foyer.js` (sortie : `resultats-foyer.txt`, régénéré le 01/11/2026 : un seul changement, le point de taux plat vaut 12,6 Md€ et non 12,5).

### 16.0 Ce qu'il faut retenir (écrit pour être vrai)

1. **Le palier 1 que nous avons chiffré (§ 13) est individualisé** : socle par adulte, impôt par adulte. Le solde de −163 Md€ (central, à 35 %) ne contient ni couple ni quotient. Mais les **cas types** (`situation()`) imposent les couples sur le revenu moyen par adulte, donc **avec un quotient conjugal de 2 parts**. Les deux ne sont pas le même régime : c'est une incohérence interne du modèle, que ce paragraphe lève (H144).
2. **Conjugaliser l'impôt du palier 1 coûterait environ 14,5 Md€ par an** (−1,1 point de taux plat ; fourchette 7,7 à 19,1 selon les hypothèses, § 16.3). Le cadre à 8 000 € nets dont le conjoint n'a pas d'emploi gagne **2 001 €/mois** de plus que sous la loi actuelle avec le quotient, contre **1 036 €** avec l'impôt individuel : le quotient lui vaut **965 €/mois** (961 à 14 600 € de coût employeur, calcul à la main dans `test_foyer.js` : 11 531 €/an ; chiffres de ce paragraphe recalculés le 01/11/2026 avec l'IR calculé ; avant : 1 946 et 985).
3. **Le socle familial (1,5 S par couple au lieu de 2 S) économise 36 Md€** (2,8 points de taux plat, c'est-à-dire un taux plat de 32 % au lieu de 35 %) : 12 M de couples × 250 € × 12. C'est de loin le levier le plus gros de la dimension foyer, et **le plus dur à défendre** : un conjoint sans revenu perd 250 € par mois et un droit individuel (§ 16.4, objection 2).
4. **Le quotient d'enfants (0,5 part) à la place du supplément de 200 €** coûte 21,9 Md€ (majorant, sans plafonnement) au lieu de 33,3 Md€ : il économise 11,3 Md€ **mais ne donne rien aux foyers sous R0** : le parent isolé au Smic perd 200 € (1 enfant) à 400 € (2 enfants) par mois. **Je le déconseille** : il reproduit la critique que la Cour des comptes adresse au quotient familial actuel (effets concentrés sur les ménages aisés).
5. **Le conjoint d'un cadre entre en emploi à 51,6 % de taux de participation avec l'impôt conjugalisé** (contre 35 % avec l'impôt individuel) ; à 57 % si le premier apporteur coûte 14 600 € par mois. **Le retour de comportement est faible** : environ 127 000 entrants, +1,1 Md€ (élasticité 0,5 ; 4,3 Md€ à 2).
6. **Les deux chiffres qui contredisent l'intuition.** (a) Individualiser l'impôt n'est **pas** la grande réforme budgétaire qu'on croit : à IR actuel la littérature trouve 7 à 10 Md€ (Allègre, Périvier, Pucci 2021, [lu]) ; (b) le **couple de deux Smic ne gagne rien au quotient** (même impôt dans les deux régimes), seul le couple inégal en profite : c'est le cas polaire que décrit déjà le Conseil des prélèvements obligatoires en 2011 (cadre dirigeant et femme au foyer contre deux Smic).

### 16.1 Régimes comparés

| Régime (`foyer.js`) | Socle | Impôt (à plat + continu) | Enfants |
|---|---|---|---|
| `individualise` (référence du solde, H144) | S par adulte | par adulte | + 200 € par enfant |
| `palier1` (cas types de `situation()`) | S par adulte | **conjugal** (R du couple / 2 parts) | + 200 € par enfant |
| `familial` | **1,5 S par couple** | conjugal | + 200 € par enfant |
| `familialIndiv` | 1,5 S par couple | par adulte | + 200 € par enfant |
| `quotient` | S par adulte | par adulte | **0,5 part par enfant**, aucun supplément |

Le taux à plat (35 %) est linéaire : seul l'impôt continu (t_max 30 %, R0 = 24 000 €) distingue le conjugal de l'individuel. À revenus égaux, aucune différence.

### 16.2 Ménages types (€ par mois ; loi actuelle approchée, puis revenu disponible et écart à la loi actuelle ; taux plat 35 %)

| Ménage | Loi actuelle | Individualisé | Palier 1 (cas types, conjugal) | Familial | Socle familial + impôt individuel | Quotient d'enfants |
|---|---|---|---|---|---|---|
| Couple, un Smic + conjoint sans emploi | 2 035 | **2 292 (+257)** | 2 292 (+257) | 2 042 (+7) | 2 042 (+7) | 2 292 (+257) |
| Couple, deux Smic | 3 113 | **3 584 (+471)** | 3 584 (+471) | 3 334 (+221) | 3 334 (+221) | 3 584 (+471) |
| Couple, cadre à 8 000 € nets + conjoint sans emploi | 6 910 | **7 946 (+1 036)** | 8 912 (+2 001) | 8 662 (+1 751) | 7 696 (+786) | 7 946 (+1 036) |
| Couple, cadre à 8 000 € nets + Smic | 7 975 | **9 238 (+1 264)** | 9 760 (+1 785) | 9 510 (+1 535) | 8 988 (+1 014) | 9 238 (+1 264) |
| Parent isolé au Smic, 1 enfant | 1 909 | **1 992 (+83)** | 1 992 (+83) | 1 992 (+83) | 1 992 (+83) | 1 792 (−117) |
| Parent isolé au Smic, 2 enfants | 2 249 | **2 192 (−57)** | 2 192 (−57) | 2 192 (−57) | 2 192 (−57) | 1 792 (−457) |
| Couple, 2 enfants, un salaire médian + un Smic | 4 040 | **4 944 (+904)** | 5 000 (+960) | 4 750 (+710) | 4 694 (+654) | 4 682 (+642) |

Lectures : (a) le **couple Smic + 0** garde +257 €, mais le socle familial ramène son gain à **+7 €** (il perd 250 €) ; (b) le gain énorme du couple à deux Smic (+471 €) vient du socle de 500 € par adulte, et **disparaît pour moitié** si le socle devient familial ; (c) le parent isolé n'est **pas** touché par le choix conjugal/individuel (un seul adulte) mais l'est fortement par le quotient ; (d) **« aujourd'hui »** inclut le quotient plafonné (1 807 € par demi-part, 4 262 € pour les deux premières d'un parent isolé), la prime d'activité et les allocations familiales (H137, ⚠️ approximation).

**Taux de participation du conjoint qui entre à un Smic** (1 − gain du foyer / coût employeur ; 0 enfant ; coût mensuel du premier apporteur) : 0 ou 1 988 € : 35 % dans les deux régimes ; 3 677 € : 39,1 % (conjugal) contre 35 % ; 8 000 € : 51,6 % contre 35 % ; 14 600 € : 57,3 % ; 27 400 € : 60,8 %. Ordre de grandeur de la Cour des comptes pour l'IR actuel (barème 2022) : 11 % à 26,2 % contre 6,3 % ([lu], `sources/recherche-foyer-quotient.md` § 4).

### 16.3 Effet sur le solde public (Md€ par an ; + = rapporte à l'État ; par rapport au palier 1 individualisé ; 13 Md€ = 1 point de taux plat)

| Cas | Conjugalisation | Socle familial | Quotient : coût / supplément économisé | Participation | Individualiser l'impôt (net) |
|---|---|---|---|---|---|
| **central** (12 M couples, 15 % monoactifs, homogamie 30 %, élasticité 0,5) | **−14,5** | **+36,0** | −21,9 / +33,3 | +1,1 | **+15,6** |
| 10 M de couples | −12,1 | +30,0 | idem | +0,9 | +13,0 |
| 13 M de couples | −15,8 | +39,0 | idem | +1,2 | +16,9 |
| monoactifs 10 % | −13,2 | +36,0 | idem | +0,7 | +13,9 |
| monoactifs 25 % | −17,3 | +36,0 | idem | +1,8 | +19,1 |
| homogamie 0 % | −17,5 | +36,0 | idem | +1,1 | +18,6 |
| homogamie 60 % | −11,6 | +36,0 | idem | +1,1 | +12,7 |
| élasticité 0,2 | −14,5 | +36,0 | idem | +0,4 | +15,0 |
| élasticité 1 | −14,5 | +36,0 | idem | +2,1 | +16,7 |
| élasticité 2 (bas de Carbonnier) | −14,5 | +36,0 | idem | +4,3 | +18,8 |
| t_max 15 % | −7,7 | +36,0 | −11,5 / +33,3 | +0,5 | +8,2 |

Détail central : conjugalisation = −8,8 (couples biactifs) − 5,7 (couples monoactifs, 15 % des couples) ; le **couple monoactif coûte en moyenne environ 3,6 fois plus au quotient que le biactif** (−5,7/1,8 M contre −8,8/10,2 M). Coût moyen du quotient d'enfants : 1 582 € par enfant et par an (⚠️ non plafonné, répartition des enfants identique à celle des adultes : majorant).

**Méthode.** (1) Bandes de revenu du modèle au palier 1 (`recettesCourants`) et dispersion intra-bande (H141) ; (2) couples biactifs tirés par appariement (70 % indépendant, 30 % dans la même bande), couples monoactifs avec un revenu nul pour le conjoint ; (3) pour chaque paire, impôt conjugal moins impôt individuel (quadrature à 5 × 5 points) ; (4) multiplication par le nombre de couples (H140) ; (5) socle familial = couples × S × (2 − 1,5) × 12 ; (6) quotient : économie d'impôt d'un enfant à 0,5 part, moyennée sur les bandes, × 13,9 M d'enfants ; (7) participation : H142. Aucun retour de comportement sur le premier apporteur.

**Recoupements.** (a) Littérature : l'individualisation de l'IR actuel rapporte 7 Md€ (avec option) à 10 Md€ (sans), `sources/recherche-foyer-quotient.md` § 2 ; notre −14,5 Md€ est cohérent avec des taux marginaux plus élevés (65 % contre 45 %) et sans option d'optimisation. (b) Le quotient conjugal actuel vaut 11,1 Md€ (Cour des comptes, 2021) ; le nôtre 14,5 Md€. (c) Valeur d'un point de taux plat : 12,6 Md€ recalculés au palier 1 (13 retenu).

**Ce que ces chiffres ne disent pas** : la baisse de recettes possible si les couples changent de forme (mariage, pacs, concubinage), l'effet sur la natalité, le coût de gestion, la transition, les retraités (inchangés par décision), les parents isolés sans emploi (plancher de 1 300 € inchangé), le travail domestique non marchand et la dépendance économique du conjoint sans revenu.

### 16.4 Recommandation et objections (steelman)

**Je recommande le régime `individualise` : socle par adulte, impôt par adulte, supplément de 200 € par enfant.** C'est déjà ce que le solde du palier 1 suppose (H144) ; il est le plus simple (aucune déclaration commune, aucun quotient, aucun plafonnement), il coûte 14,5 Md€ de moins que le palier 1 conjugalisé des cas types, et il est neutre pour les deux Smic et pour les parents isolés. **Deux décisions pour l'auteur** : (A) **assumer que le cadre à 8 000 € dont le conjoint est sans emploi gagne 1 036 € et non 2 001 € par mois** (il gagnait 1 156 € célibataire au § 13.4 : c'est le même ordre ; 985, 1 946 et 1 019 avant le recalcul de l'IR du 01/11/2026) ; (B) **ne pas retenir le socle familial** (36 Md€ pour 2,8 points de taux plat) sauf si l'on veut financer un point de taux plat de moins en retirant 250 € à chaque conjoint : à décider, avec l'avertissement que ce choix retire un droit individuel aux femmes au foyer.

Objections, avec ma réponse :
1. **« L'équité horizontale : un couple à 100 000 € dont un seul travaille a la même capacité contributive que deux conjoints à 50 000 € ; l'impôt individuel les traite différemment. »** C'est la meilleure objection (CPO 2011 : « on taxe de la même manière un même revenu total, quel que soit sa répartition »). Réponse : elle suppose une mise en commun intégrale, vraie pour 64 % des couples seulement (Cour des comptes) ; elle ignore le travail domestique non marchand du conjoint ; et le palier 1 reconnaît déjà le conjoint sans emploi par un socle individuel. **Opinion de Claude, pas un fait.** Si l'on veut une compensation, l'abattement dégressif pour conjoint sans revenu (Italie, Slovaquie) est une voie testable.
2. **« Individualiser coûte aux 46 % de couples qui y perdent. »** Vrai à IR actuel (Allègre et al.). Au palier 1 (R0 = 24 000 € par adulte), seuls les couples inégaux et aisés perdent : le couple Smic + 0 ou deux Smic ne perd rien. La transition (option d'individualisation, maintien du régime pour les couples existants) n'est pas chiffrée.
3. **« Le conjoint sans revenu devient dépendant. »** Au contraire : le socle individuel le rend indépendant ; c'est le socle familial qui réduit son droit. C'est une raison de plus de ne pas retenir le socle familial.
4. **« Le quotient familial protège les familles nombreuses. »** Il protège surtout les foyers imposables : à 0,5 part, il ne rend rien en dessous de R0 par part (24 000 €), donc rien au parent isolé au Smic. Le supplément de socle de 200 € est versé à tous. Le plafonnement actuel (1 807 € par demi-part) montre que le législateur lui-même juge ses effets aisés trop importants.
5. **« L'élasticité de Carbonnier (1 à 2) montre que le retour est bien plus grand que +1,1 Md€. »** À 2, +4,3 Md€ : toujours un ordre de grandeur plus petit que la conjugalisation. Les études sur données anciennes surestiment peut-être la réponse (Cour des comptes). Le modèle ne compte pas la baisse d'offre de travail du premier apporteur (effet revenu), qui jouerait dans l'autre sens.
6. **« Il y a une obligation constitutionnelle de prendre en compte la famille. »** La Cour des comptes la mentionne. Un supplément de socle de 200 € par enfant, versé à tous, est une prise en compte ; ⚠️ la jurisprudence n'a pas été relue (V2815) : à vérifier avant toute formulation publique.
7. **Contre-objection de Claude à l'auteur.** L'auteur parle d'impôt « simple » : l'impôt individuel l'est. Mais « le couple de deux Smic gagne +471 € » est un résultat de **socle individuel** (500 € par adulte), pas d'impôt. Si l'objectif est de ne pas aggraver le déficit, le socle familial est la vraie question de ce paragraphe, pas l'impôt. Et il est possible que ce soit la mesure que l'auteur trouve la moins acceptable : à lui de le dire.


## 17. Démographie branchée sur le palier 1 (01/11/2026, `demographie.js`, `trajectoires_demo.js`, `rapport_demographie.js`, `resultats-demographie.txt`, `test_demographie.js` : 38 contrôles au vert ; **régénéré le 01/11/2026 après l'audit (H176 à H180 : jeu de capital des retraités à 20 % partout, `resultats-demographie.txt`, `resultats-age-sante.txt` et `resultats-croissance.txt` font foi)** ; **mise à jour du 01/11/2026 : § 17.bis, effet de l'âge sur la santé et la dépendance**, `age_sante.js`, `test_age_sante.js` : 135 contrôles)

Jusqu'ici le solde du palier 1 (§ 13) était **statique** : 38,7 M d'adultes non retraités, 16,5 M de retraités, pour toujours. Ce paragraphe fait évoluer ces volumes selon les projections de l'Insee 2026 (population par âge, `prospective-demographie/trajectoires.csv`) et de l'emploi calé sur le COR (`emploi.py`), **à taux plat constant (35 %), socle constant (500 €) et en euros constants**. Hypothèses H145 à H152 (methode.md § 17). Des ordres de grandeur sous hypothèses, jamais des prédictions. Reproduction : `jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js trajectoires_demo.js demographie.js rapport_demographie.js` ; régénérer les trajectoires : `python3 generer_demographie.py`.

> **Mise à jour du 01/11/2026 (audit A1 et A2).** Les tableaux A et D de ce paragraphe (g = 0) restent le **cas statique de référence** : le reste du budget (dépenses hors pensions et socle, TVA, IS, transmissions : net −384 Md€) y est en euros de 2025 et les intérêts de la dette ne sont ceux que de 2024 (60 Md€). **Les variantes B et C (1 % de productivité) laissaient aussi ce reste figé** : leurs chiffres (+122 et −72 Md€ en 2065 ; +116 et −74 avant le recalage du capital des retraités) sont ceux de l'ancien comportement (`reste: 'fige'`), conservés ici parce qu'ils sont reproductibles. Avec le reste indexé sur le PIB, la variante B (1 %, pensions sur les prix, sans santé) donne **−138 / −108 / −41 Md€** (socle 557 / 628 / 807 €) au lieu de −84 / −7 / +122, et la variante C **−175 / −189 / −235**. Les intérêts de la dette accumulée sont comptés au § 17.ter, G.

**A. Cas de base (g = 0, pensions indexées sur les prix, sans création de valeur).** Solde public en Md€/an (solde 2025 du palier 1 : −120 / −163 / −236) et socle finançable (le socle qui ne dégrade pas le solde de départ, H151), en € par mois et par adulte non retraité. Bas = population jeune, haut = population âgée (H147).

| scénario | 2035 : solde | 2035 : socle | 2045 : solde | 2045 : socle | 2065 : solde | 2065 : socle |
|---|---|---|---|---|---|---|
| bas (population jeune) | −122 | 496 | −132 | 472 | −154 | 420 |
| **central** | **−170** | **484** | **−189** | **441** | **−253** | **275** |
| haut (population âgée) | −248 | 472 | −274 | 410 | −372 | 123 |

Volumes du central : retraités 19,2 / 20,6 / 22,0 M (2035 / 2045 / 2065, contre 17,4 M en 2025 dans le calage COR), adultes non retraités 36,3 / 35,8 / 32,7 M, emploi 29,9 / 29,9 / 27,7 M (28,9 M en 2025), emploi par retraité 1,56 / 1,45 / 1,26 (1,66 en 2025).

**Décomposition du central en 2065 (Md€/an)** : assiette **−34** (emploi −4 %), pensions **−103** (retraités +26 %), impôt des retraités et hautes pensions **+20**, enfants **+9**, socle **+18** (moins d'adultes non retraités) ; total **−90** (de −163 à −253). **La ligne qui pèse est la masse des pensions, pas le socle.** Équivalent en taux plat : environ 7 points à 13 Md€ par point (H143) pour rester au solde de 2025.

**B et C. Productivité de 1 % par an (H152, hypothèse d'illustration ; remplacée par des scénarios sourcés au § 17.ter ci-dessous : 1 % est la variante haute du COR 2026).** Indexation des pensions sur les prix (B) : le central passe à **−84 / −7 / +122** Md€ (2035 / 2045 / 2065) et le socle finançable à **681 / 860 / 1 219 €** ; la productivité compense largement le vieillissement, **à condition que les pensions ne la suivent pas**. Pensions indexées sur les salaires (C) : central **−120 / −89 / −72**, socle **598 / 672 / 731 €**. Dans le haut, même avec 1 % de productivité : −166 / −103 / −44 (B) et −203 / −187 / −245 (C). Le choix d'indexation des pensions vaut, en 2065 et au central, **194 Md€ par an** d'écart de solde (+122 contre −72).

**D. Avec la création de valeur du palier 1 (§ 13.2, extrapolée sans plafond après 10 ans ⚠️)** : central **−143 / −139 / −156**, socle **545 / 556 / 519 €** ; haut −242 / −262 / −349, socle 485 / 438 / 186 € ; bas −69 / −39 / +25, socle 614 / 682 / 832 €.

**Lecture.**
1. **Le déficit du palier 1 se creuse avec le temps à taux constant si la productivité est nulle** : −163 aujourd'hui, −170 en 2035, −189 en 2045, −253 en 2065 au central. À partir de 2035, le socle finançable passe sous 500 € ; en 2065, il vaut 275 € au central et 123 € dans la population âgée.
2. **Cela confirme la contradiction 1 de la v3 (§ 3)** : un socle versé aux seuls non-retraités, avec des pensions sanctuarisées, repose sur une base d'emploi qui se rétrécit après 2045 (29,9 puis 27,7 M) pendant que la masse des pensions suit les retraités (+26 % en 2065). Ce n'est pas démontré au-delà de ce modèle : l'écart se joue sur la productivité et l'indexation, deux hypothèses que le modèle ne peut pas trancher.
3. **Les trois cas ne disent pas la même chose** : en statique, la démographie est un coût net (A) ; avec 1 % de productivité et des pensions sur les prix, elle est largement absorbée (B) ; avec des pensions sur les salaires, elle ne l'est que partiellement (C). **Le levier politique est l'indexation des pensions et la croissance, pas le socle.**
4. **Ce que les tableaux A à D ne comptent pas** (biais favorable, levé au § 17.bis ci-dessous) : la dépense de santé et de dépendance liée à l'âge, qui augmente avec les 75 ans et plus (de 10,7 % à 19,6 % de la population entre 2025 et 2070, Démo § 1). **Ce qu'ils comptent en défaveur** (biais défavorable) : aucun effet de composition (des actifs plus âgés sont mieux payés), aucune robotisation, aucun effet de la réforme sur la fécondité ou les migrations.
5. **Simplifications à nommer** : volumes indexés (pas de modèle de génération), pension moyenne et revenu moyen d'activité constants en euros constants sauf variantes B et C, IS et transmissions constants, scénarios démographiques appariés aux scénarios de réactions (cumul des extrêmes : le haut de −372 Md€ est une borne).

### 17.bis Avec la dépense de santé et de dépendance liée à l'âge (01/11/2026, `age_sante.js`, `trajectoires_age.js` généré par `generer_age_sante.py`, `rapport_age_sante.js`, `resultats-age-sante.txt`, `test_age_sante.js` : 135 contrôles ; régénéré le 01/11/2026 (H176) ; H153 à H162 et H170, methode.md § 17 ; sources : `sources/recherche-sante-vieillissement.md`)

La dépense publique de santé et de dépendance de 2025 est vieillie avec la population par âge (Insee 2026, mêmes trois scénarios que ci-dessus), en euros constants, **sans élasticité-revenu ni progrès technique** (non démographiques). Santé : profil par âge du remboursement de l'assurance maladie (DREES, 2023 : 925 € par personne de 0 à 10 ans, 3 822 € à 61-70 ans, 7 858 € à 80 ans et plus), niveau 201,6 Md€ (CSBM Sécurité sociale 2025). Dépendance : taux de dépendance par âge (Ageing Report 2024 : 13,5 %, 23,3 %, 39,5 % à 65-74, 75-84, 85 ans et plus), niveau 1,9 % du PIB soit 55,8 Md€ (⚠️ coût public uniforme par personne dépendante). **Hypothèse « bonne santé »** (méthode de la Commission) : le profil est décalé d'une part des années de vie gagnées à 65 ans : **toutes** (bas, « bonne santé »), **la moitié** (central, base de l'Ageing Report), **aucune** (haut, « pas de bonne santé »). Même scénarios démographiques que le § 17 : bas = population jeune, haut = population âgée. Reproduction : `jsc modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js rapport_age_sante.js` ; régénérer les trajectoires : `python3 generer_age_sante.py`.

**A. Dépense supplémentaire liée à l'âge par rapport à 2025 (Md€ constants).**

| scénario | année | décalage du profil (ans) | santé | dépendance | total |
|---|---|---|---|---|---|
| bas (population jeune, bonne santé) | 2035 / 2045 / 2065 | 0,3 / 0,6 / 1,3 | +18 / +27 / +29 | +6 / +9 / +10 | **+24 / +37 / +40** |
| **central** | 2035 / 2045 / 2065 | 0,4 / 0,8 / 1,7 | +16 / +25 / +26 | +6 / +9 / +11 | **+22 / +34 / +37** |
| haut (population âgée, pas de bonne santé) | 2035 / 2045 / 2065 | 0 / 0 / 0 | +18 / +29 / +35 | +7 / +12 / +17 | **+24 / +41 / +52** |

Le « bas » n'est pas le moins coûteux en santé : une population jeune est plus nombreuse (71,9 M en 2065 contre 66,4 M au central), donc la dépense totale monte même si la structure par âge est moins âgée.

**B. Solde du palier 1 sans et avec la santé et la dépendance (cas de base : g = 0, pensions sur les prix) et socle finançable (€ par mois et par adulte non retraité).**

| scénario | 2035 : sans | 2035 : avec | 2045 : sans | 2045 : avec | 2065 : sans | 2065 : avec |
|---|---|---|---|---|---|---|
| bas | −122 | −146 | −132 | −169 | −154 | −194 |
| **central** | −170 | **−192** | −189 | **−224** | −253 | **−290** |
| haut | −248 | −272 | −274 | −315 | −372 | −424 |

| socle finançable | 2035 : sans | 2035 : avec | 2045 : sans | 2045 : avec | 2065 : sans | 2065 : avec |
|---|---|---|---|---|---|---|
| bas | 496 | 441 | 472 | 390 | 420 | 329 |
| **central** | 484 | **434** | 441 | **361** | 275 | **181** |
| haut | 472 | 417 | 410 | 315 | 123 | **0** (plancher) |

**C. Avec 1 % de productivité (variantes B et C de ci-dessus), central, solde sans → avec** : pensions sur les prix **−84 → −106 / −7 → −41 / +122 → +85** (socle 681 → 630 / 860 → 781 / 1 219 → 1 125 €) ; pensions sur les salaires **−120 → −142 / −89 → −123 / −72 → −109** (socle 598 → 548 / 672 → 593 / 731 → 637 €). Dans le haut avec productivité et pensions sur les prix : **−190 / −144 / −96** (sans : −166 / −103 / −44). L'effet de santé en euros constants n'est pas modifié par la productivité (H160).

*Mise à jour du 01/11/2026 : les chiffres de la ligne C (1 % de productivité) sont ceux du reste du budget figé ; avec le reste indexé sur le PIB (et l'effet de l'âge multiplié par (1+g)^k, le coût unitaire des soins suivant la productivité), le central à 1 % en pensions sur les prix donne −163 / −150 / −97 Md€ (socle 501 / 532 / 668 €) et, sur les salaires, −199 / −232 / −291 (socle 419 / 343 / 179 €) ; détail au § 17.ter. Les tableaux A, B, D, E, F (g = 0) ne changent pas.*

**D. L'hypothèse « bonne santé », démographie centrale** (tout le reste égal) :

| part des années gagnées en bonne santé | 2035 | 2045 | 2065 | solde central 2065 | socle finançable 2065 |
|---|---|---|---|---|---|
| 0 (pas de bonne santé) | +26 | +42 | +52 | −305 | 144 € |
| 0,5 (base de l'Ageing Report) | +22 | +34 | +37 | −290 | 181 € |
| 1 (toutes, « bonne santé ») | +19 | +27 | +23 | −276 | 218 € |

L'hypothèse « bonne santé » vaut **29 Md€ par an en 2065** d'écart de dépense (+52 contre +23), soit environ la moitié de l'effet du vieillissement sur les soins ; c'est une hypothèse que les données ne tranchent pas (la Commission la partage en deux dans son scénario de base).

**E. Comparaison avec l'Ageing Report 2024** (corrigée le 01/11/2026 ; détail au F). Notre effet de santé central (+16 / +25 / +26 Md€ en 2035 / 2045 / 2065) se compare à celui que la Commission publie pour la France (scénario démographique, ratio dépense/PIB de 8,4 % en 2025 à 8,6 / 8,8 / 8,9 %) : **+9 / +16 / +16 Md€ une fois ce ratio rapporté à la population d'Eurostat (celle de la Commission)**, soit 1,6 à 1,8 fois moins que nous **mais à populations différentes** ; **à population égale (Insee 2026, plus faible après 2045), le repère vaut +7 / +11 / +4 Md€ et notre effet est 2,3 / 2,3 / 6,5 fois plus grand** (en effet de structure par habitant : 2,4 à 2,9 fois, F ci-dessous). La conclusion « profil DREES = haut de fourchette » est inchangée ; la mesure de l'écart est corrigée le 01/11/2026 (audit A10). L'écart de « 2 à 13 fois » publié le 01/11/2026 mélangeait deux populations et reposait sur une valeur mal transcrite (8,8 % au lieu de 8,9 % en 2065, ce qui comptait +2 Md€ au lieu de +4). Pour la dépendance, nous obtenons 1,104 / 1,169 / 1,198 contre 1,117 / 1,220 / 1,269 (scénario de base de la Commission, qui inclut des facteurs non démographiques) : un peu en dessous. Au périmètre CNSA des personnes âgées (niveau 2025 de 29,5 Md€ au lieu de 55,8) l'effet de dépendance est de **+3 / +5 / +6 Md€** (central) au lieu de +6 / +9 / +11.

**F. Pourquoi nous ne trouvons pas le chiffre de la Commission, étape par étape** (central, santé hors dépendance, Md€ constants ; `rapport_age_sante.js` sections 9 et 10 ; H170).

| étape | 2035 | 2045 | 2065 |
|---|---|---|---|
| 1. Notre profil DREES (assurance maladie), population Insee 2026 | +16 | +25 | +26 |
| 2. Commission : ratio publié × population **Insee** (repère du 01/11, valeur 2065 corrigée) | +7 | +11 | +4 |
| 3. Commission : ratio publié × population **Eurostat** (la sienne) | +9 | +16 | +16 |
| 4. Notre variante « méthode Commission » (profil aplati de 0,38, population Insee) | +8 | +10 | +5 |
| Effet de structure par âge **par habitant** : nous / Commission | +7 % / +2 % | +12 % / +5 % | +17 % / +6 % |
| Population (2025 = 1) : Insee / Eurostat | 1,011 / 1,021 | 1,008 / 1,029 | 0,964 / 1,019 |

Ce que l'on peut dire, par ordre de poids : (1) **l'effet de structure par âge est 2,4 à 2,9 fois plus fort chez nous que chez la Commission** (+7 / +12 / +17 % contre +2 / +5 / +6 %) : c'est l'essentiel de l'écart, et **nous ne l'expliquons pas entièrement** ; ce n'est ni la population (l'Insee 2026 et Eurostat 2023 sont presque identiques jusqu'en 2050 : rapport des 65 ans et plus aux 20-64 ans de 50,3 % contre 50,1 % en 2040, 54,0 % contre 53,2 % en 2050), ni l'hypothèse de bonne santé (la part de moitié est la même ; l'effet du décalage est du même ordre : 2,4 points de ratio entre « bonne santé » et « pas de bonne santé » en 2035 chez nous, 3,6 ± 1,2 chez la Commission), ni la fin de vie : un profil qui décline après 80 ou 85 ans (jusqu'à 50 à 70 % de la valeur à 100 ans, essai de sensibilité) ne retire que 0,1 à 0,5 point de l'indice en 2035 et 1,1 à 2,2 points en 2065. Reste la forme du profil : le profil de la Commission mesure la dépense **publique totale** de santé (hors soins de longue durée, comptés à part) en part du PIB par habitant, par âge et par sexe ; le nôtre est le **remboursement de l'assurance maladie** par classe de dix ans, 8,5 fois plus élevé à 80 ans et plus qu'avant 11 ans ; le profil par âge de la France de la Commission n'est pas publié sous forme de tableau (le graphique I.2.2 est un agrégat européen), donc **la cause précise n'est pas établie** ⚠️. (2) **La population** compte surtout en 2065 : l'Insee 2026 (fécondité plus basse) donne 66,4 M d'habitants contre 69,9 M à Eurostat, soit environ 12 Md€ de dépense en moins ; c'est une différence de scénario démographique, pas de méthode de santé. (3) Les autres points de méthode comparés (dépense totale ou remboursée, classes d'âge, 71-79 ou 71-80 ans, normalisation par le PIB par tête, base 2022 ou 2025, soins de ville ou hôpital) pèsent peu ou ne sont pas mesurables avec les données lues : voir `methode.md` H170.

**Conséquence pour le résultat.** Le chiffre du central au profil DREES (+16 / +25 / +26 Md€ de santé, +22 / +34 / +37 avec la dépendance) est à lire comme le **haut de la fourchette** ; la variante « méthode Commission » donne le **bas** : **+8 / +10 / +5 Md€ de santé, +13 / +20 / +16 avec la dépendance** ; solde central avec : −192 / −224 / −290 (DREES) contre **−184 / −209 / −269** (Commission) ; socle finançable : 434 / 361 / 181 € contre **454 / 395 / 234 €**. Le socle de 500 € n'est finançable à taux constant dans aucune des deux lectures. Le haut en 2065 : socle 0 (DREES) contre 78 € (Commission).

**Lecture.**
1. **L'effet de l'âge sur la santé et la dépendance coûte 22 Md€ par an en 2035, 34 en 2045 et 37 en 2065 au central, soit 13 à 15 % du déficit de 2065 du § 17 (−253 → −290).** Il fait passer le socle finançable central de 484 / 441 / 275 € à **434 / 361 / 181 €** : le socle de 500 € n'est plus finançable à taux constant dès 2035 dans aucun des trois scénarios.
2. **L'effet est plus faible que celui des pensions** (−103 Md€ en 2065 au central) : confirme que la ligne qui pèse reste la masse des pensions (§ 17, lecture 2), et que l'indexation et la productivité (194 Md€ d'écart en 2065) dominent la santé (29 Md€ pour l'hypothèse « bonne santé »).
3. **L'incertitude porte sur le profil, pas sur la démographie.** Avec le profil de la Commission l'effet de santé serait de l'ordre de 2 à 11 Md€, pas de 16 à 26 ; la différence n'est pas expliquée (recherche, § 3 : profil plus plat, décalage par âge, population de référence) ⚠️. **Je retiens le profil DREES comme central** parce qu'il est ouvert, reproductible et plus prudent, et je le nomme haut de fourchette sur la santé.
4. **Ce que ce paragraphe ne compte toujours pas** (biais favorable) : la hausse de la dépense de santé par personne à âge donné (progrès technique, prix, élasticité-revenu) : la CNAM chiffre la dérive spontanée à +57 Md€ entre 2024 et 2030, dont l'âge n'est qu'une partie ; le logement adapté, les aidants, le reste à charge des ménages (les dépenses des OC et des ménages croissent aussi, mais ne figurent pas au solde public) ; les prestations d'invalidité.  **Ce qu'il compte peut-être en excès** : le niveau de dépendance de 1,9 % du PIB inclut des dépendants non âgés (périmètre CNSA des personnes âgées : effet divisé par 1,9).
5. **Simplifications à nommer** : espérance de vie à 65 ans moyenne hommes-femmes ; plateau du profil au-delà de 86 ans ; profil de la dépendance appliqué à tous les âges ; dépense de santé modélisée comme financée par la Sécurité sociale (niveau 201,6 Md€) sans effet sur les cotisations ; cumul des extrêmes (haut : population âgée sans bonne santé) = une borne.

### 17.ter Productivité sourcée, PIB 2025-2070, indexation, reste du budget et intérêts de la dette (01/11/2026, **corrigé le 01/11/2026**, `croissance.js`, `rapport_croissance.js`, `resultats-croissance.txt`, `test_croissance.js` : 145 contrôles ; **corrigé une troisième fois le 01/11/2026 après la relecture adverse du module de soutenabilité (D2 : intérêts de 2024 comptés deux fois, § 17.ter G et § 18 ; chiffres de la veille entre parenthèses dans la note ci-dessous) ; régénéré le 01/11/2026 après l'audit du jeu de capital (H176) : chiffres de la version « corrigée » du matin entre parenthèses dans la note ci-dessous** ; H163 à H168 et H171 à H175, methode.md § 18 ; sources : `sources/recherche-productivite.md`)

> **Correction du 01/11/2026 (audit adverse du 01/11, défauts A1, A2, A3).** La version du 01/11 faisait croître l'assiette du nouvel impôt avec la productivité mais **figeait en euros de 2025 tout le reste du budget** (dépenses hors pensions et socle, TVA, IS, transmissions, autres recettes : net −384 Md€), ne comptait **aucun intérêt sur la dette accumulée** (déficit de départ avec les intérêts de 2024) et appelait « mécanisme du COR » une indexation des pensions plus dure que le COR. Les trois sont corrigés : (1) le reste du budget suit le PIB en euros constants (emploi × productivité) ; l'ancien comportement reste disponible (`reste: 'fige'`) ; (2) la dette part de 3 460,5 Md€ (Insee, fin 2025), s'accumule année par année et porte des intérêts (taux apparent convergeant vers le taux de marché) ; (3) la variante « pensions sur les prix » est nommée pour ce qu'elle est et une variante calée sur la pension relative du COR est ajoutée. **Les chiffres du 01/11 sont rappelés au B et en tête du F.** Le central à 0,7 % (pensions et socle sur les prix) passait de −47 Md€ et 800 € en 2065 à **−157 Md€ et 515 €** (−162 et 513 avant le recalage du capital des retraités de l'après-midi) ; **avec les intérêts de la dette, il passait à −592 Md€ en 2065 et la dette à 343 % du PIB** (−605 et 350 % avant le recalage ; **−556 et 329 % après la correction du double compte des intérêts, voir la note suivante**). La phrase du 01/11 « à la productivité du COR, le palier 1 est déjà meilleur en 2065 qu'en 2025 » est **retirée**.

> **Correction du 01/11/2026 (relecture adverse du module de soutenabilité, défaut D2 : intérêts de 2024 comptés deux fois).** Le solde de départ (−169,1 Md€) contient 60,131 Md€ d'intérêts de 2024 ; le « reste du budget » (−384 Md€), indexé sur le PIB, les contient donc, et le solde primaire n'ajoutait que 60,131 Md€ fixes : il restait un **intérêt fantôme** de 60,131 × (indice du PIB − 1), soit **16 Md€ de dépense en trop en 2065** (indice du PIB 1,266), qui croît avec le temps. Le solde primaire est maintenant `solde du modèle + 60,131 × indice du reste du budget` (`croissance.indiceReste` : PIB, productivité seule ou 1 selon l'option `reste`), dans `croissance.chemin` et `soutenabilite.evaluer`. Effet au central, pensions sur les prix : **dette/PIB 2065 de 343 à 329 %** (−592 à −556 Md€ de solde total), 150 / 200 à 148 / 196 % en 2035 / 2045. Les colonnes « intérêts de 2024 figés » (sans option `taux`) ne changent pas : elles gardent la convention du § 17.bis. Le seuil « solde primaire » passe de 0,67 à 0,60 %.

Le « 1 % par an d'illustration » des variantes B et C est remplacé par des **scénarios sourcés** : productivité horaire **0,4 / 0,7 / 1,0 %** (COR, rapport de juin 2026 : variante basse, référence, variante haute ; ce sont aussi les rythmes observés sur 15, 25 et 35 ans) ; trajectoire de la **Commission européenne** pour la France (Ageing Report 2024 : 0,3 % en 2030, 1,5 % en 2040, 1,2 % en 2070) ; et une **variante « IA » explicitement hypothétique** : central + 0,07 / + 0,7 / + 1,3 point (Acemoglu 2024 ; médiane Banque de France 2026 et Aghion-Bunel 2024 ; haut d'Aghion-Bunel). **Le COR 2026 ne retient pas 1,3 ni 1,6 %.** PIB = emploi (module emploi, calé COR) × productivité, durée du travail et partage stables. Toutes les sorties ci-dessous comptent la **santé et la dépendance** (§ 17.bis) ; solde en Md€ constants par an, socle finançable en €/mois par adulte non retraité (en euros de 2025). Reproduction : `jsc modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js croissance.js rapport_croissance.js` (84 combinaisons par année : 3 démographies × 7 productivités × 2 indexations des pensions × 2 indexations du socle, plus les variantes COR, reste du budget et taux).

**A. PIB, démographie centrale (Md€ de 2025 ; 2025 : 2 935).**

| productivité | 2035 | 2045 | 2065 | croissance moyenne 2025-2065 | pensions / PIB en 2065 (sur les prix) |
|---|---|---|---|---|---|
| bas (0,4 %) | 3 159 | 3 289 | 3 297 | 0,29 % | 15,0 % |
| **central (0,7 %, COR)** | **3 254** | **3 492** | **3 715** | **0,59 %** | **13,3 %** |
| haut (1,0 %) | 3 353 | 3 706 | 4 185 | 0,89 % | 11,8 % |
| Commission européenne (0,45 → 1,13 % effectif) | 3 176 | 3 639 | 4 400 | 1,02 % | 11,3 % |
| IA basse (0,77 %) | 3 277 | 3 541 | 3 820 | 0,66 % | 13,0 % |
| **IA médiane (1,4 %, hypothétique)** | 3 488 | 4 011 | 4 902 | 1,29 % | 10,1 % |
| IA haute (2,0 %) | 3 700 | 4 513 | 6 206 | 1,89 % | 8,0 % |

Contrôle : le central donne +0,7 % par an de 2035 à 2045 et +0,3 % de 2045 à 2065, contre « environ 0,8 % » puis « proche de 0,3 % » dans le COR 2026. L'emploi central vaut 1,03 / 1,03 / 0,96 fois celui de 2025.

**B. Solde (Md€/an) et socle finançable (€/mois), démographie centrale, pensions et socle indexés sur les prix, intérêts de 2024 figés (le cas du § 17.bis) : reste du budget indexé sur le PIB (nouveau défaut) ; entre parenthèses, les chiffres publiés le 01/11/2026 (reste figé).**

| productivité | 2035 : solde | 2035 : socle | 2045 : solde | 2045 : socle | 2065 : solde | 2065 : socle |
|---|---|---|---|---|---|---|
| bas (0,4 %) | −189 (−162) | 442 (510) | −204 (−158) | 407 (520) | −211 (−160) | 380 (517) |
| **central (0,7 %)** | **−176 (−137)** | **471 (569)** | **−178 (−104)** | **467 (645)** | **−157 (−47)** | **515 (800)** |
| haut (1,0 %) | −163 (−110) | 501 (629) | −150 (−46) | 532 (778) | −97 (+79) | 668 (1 119) |
| Commission | −187 (−158) | 447 (521) | −158 (−64) | 512 (737) | −69 (+137) | 737 (1 265) |
| IA médiane | −145 (−74) | 542 (711) | −110 (+36) | 623 (967) | −4 (+272) | 900 (1 606) |
| IA haute | −116 (−16) | 607 (841) | −44 (+172) | 774 (1 278) | +164 (+624) | 1 323 (2 492) |

Le même central avec le reste indexé sur la **productivité seule** (sans l'emploi) : −162 / −162 / **−179** Md€ et 503 / 503 / **461 €** (c'est l'estimation de l'audit) ; l'écart de 22 Md€ en 2065 est l'effet de l'emploi (−4 % en 2065) sur le reste du budget.

**C. Les quatre règles d'indexation, démographie centrale, productivité centrale (0,7 %), reste indexé : solde / socle finançable (entre parenthèses, 01/11).**

| pensions | socle | 2035 | 2045 | 2065 |
|---|---|---|---|---|
| prix | prix | −176 / 471 (−137 / 569) | −178 / 467 (−104 / 645) | −157 / 515 (−47 / 800) |
| prix | salaires | −195 / 432 (−156 / 523) | −217 / 393 (−143 / 548) | −234 / 365 (−124 / 581) |
| salaires | prix | −201 / 414 (−161 / 513) | −233 / 339 (−158 / 519) | −285 / 194 (−173 / 485) |
| salaires | salaires | −220 / 379 (−180 / 471) | −272 / 282 (−198 / 439) | −362 / 122 (−250 / 342) |

**C bis. Pensions calées sur la pension relative du COR (audit A3).** Le COR 2026 fait passer la pension moyenne de 54,6 % (2025) à 45,3 % (2070) du revenu d'activité moyen. Le modèle « pensions sur les prix » donne **41,3 % en 2065** (pension moyenne constante en euros constants, nouveaux retraités compris, sans effet de noria) : **il est plus dur que le COR, ce n'est pas « le mécanisme du COR »**. La variante `pensions: 'cor'` indexe la pension moyenne sur les salaires et applique le décrochage relatif du COR (interpolation linéaire 2025-2070, constante après) : à 0,7 %, **−187 / −201 / −205 Md€ et 446 / 414 / 394 €** (2035 / 2045 / 2065), entre les prix (−176 / −178 / −157) et les salaires (−201 / −233 / −285). Les pensions du COR en 2065 coûtent **48 Md€ de plus** que les pensions sur les prix (pension relative de 46,3 % en 2065 dans la variante COR, contre 41,3 % sur les prix).

**D. Population âgée et indexation sur les salaires (la borne défavorable, 3c du rapport)** : solde −303 / −369 / −492 Md€ et socle finançable 356 / 227 / **0 €** à 0,7 % ; **même à 2,0 % (IA haute) le socle de 2065 est nul et le solde de −823 Md€** (publié le 01/11 : −260 / −293 / −406 et 449 / 385 / 143 €). Population jeune, pensions et socle sur les prix : solde −129 / −121 / −68 à 0,7 % (01/11 : −90 / −46 / +73) et +117 en 2065 en variante IA médiane (01/11 : +428).

**E. Sans la santé (comparaison avec le § 17)**, central, pensions sur les prix / sur les salaires, **reste figé** (seul cas qui retrouve le § 17) : 0,7 % : −110 / −136, −65 / −121, −6 / −134 ; 1,0 % : **−84 / −120, −7 / −89, +122 / −72** (on retrouve exactement les variantes B et C du § 17). Avec le reste indexé sur le PIB, sans santé : 0,7 % : −152 / −177, −138 / −194, −108 / −236 ; 1,0 % : **−138 / −175, −108 / −189, −41 / −235** (socle 557 / 628 / 807 € en prix à 1 %).

**F. Seuils de productivité et valeur de l'indexation (2065, démographie centrale, socle sur les prix, avec santé).**

| pensions | reste du budget | solde de 2065 = solde de 2025 (−163, intérêts de 2024 figés) | solde primaire de 2065 = celui de 2025 | solde total avec intérêts (taux central) = −163 | dette/PIB de 2065 ≤ celle de 2025 (taux central) |
|---|---|---|---|---|---|
| prix | figé (01/11) | **0,38 %** | 0,38 % | 0,92 % | 1,09 % |
| **prix** | **indexé sur le PIB** | **0,67 %** | **0,60 %** | **1,51 %** | **1,66 %** |
| COR | indexé sur le PIB | 2,78 % | 1,24 % | 3,81 % | 2,81 % |
| salaires | indexé sur le PIB | > 5 % | 4,57 % | > 5 % | 3,36 % |

(Colonnes « solde primaire » et « avec intérêts » corrigées le 02/11 après la relecture D2 (intérêts de 2024 indexés avec le reste : le seuil primaire passe de 0,67 à 0,60 %, le seuil de dette de 1,81 à 1,66 %). Au 01/11 : 0,38 % avec les pensions sur les prix, 0,73 % sur les salaires ; le chiffre « 0,73 % » ne tient plus : avec un reste indexé et des pensions sur les salaires, **aucune productivité jusqu'à 5 % ne ramène le solde en euros à celui de 2025**, parce que tout le budget croît alors avec le PIB.) La règle d'indexation des pensions vaut en 2065 (prix moins salaires, socle sur les prix) **+128 Md€ par an à 0,7 %, +194 Md€ à 1,0 %, +295 Md€ en variante IA médiane** (le reste du budget s'annule dans la différence).

**G. Dette et intérêts (nouveau ; audit A2 ; H172 à H175).** Dette de départ **3 460,5 Md€ fin 2025 (115,7 % du PIB ; Insee Première n° 2106)** ; le déficit de départ du modèle (−169 Md€ en 2024) contient 60,1 Md€ d'intérêts (Insee, D41) : le **solde primaire** de 2025 du central est donc −163 + 60 = **−103 Md€ (−3,5 % du PIB)**, contre −86 Md€ observés en 2025 (déficit −151,6, intérêts 65,7). À partir de 2026 : intérêts = taux apparent × dette de fin d'année précédente ; taux apparent de 1,99 % en 2025 (intérêts 2025 / dette fin 2024) convergeant vers le taux de marché avec la durée de vie moyenne de la dette (8,5 ans, AFT) ; taux de marché de long terme **bas 3,4 %** (moyenne 2025, Eurostat 3,37 %), **central 4,0 %** (août 2026, 4,00 % ; moyenne janvier-septembre 2026 3,78 %), **haut 4,5 %** (dernier point, septembre 2026, 4,44 %) ; inflation de 2 % pour passer des flux nominaux aux euros constants. Taux apparent du central : 2,22 % en 2026, 3,42 % en 2035, 3,84 % en 2045, 3,99 % en 2065 ; **intérêts de 2026 : 75,5 Md€** (60,1 en 2024 et 65,7 en 2025 observés). Ce qui suit : démographie centrale, productivité centrale sauf mention, pensions et socle sur les prix, reste indexé sur le PIB, avec santé. **Solde total** = solde primaire − intérêts ; socle finançable : celui qui ramène le solde total au solde de 2025 (−163, qui contenait 60 Md€ d'intérêts) ; dette/PIB sur le PIB de l'Insee 2025 (2 991 Md€ déduit du ratio de 115,7 %).

| productivité (taux central 4,0 %) | 2035 : solde total | 2035 : socle | 2035 : dette/PIB | 2045 : solde total | 2045 : socle | 2045 : dette/PIB | 2065 : solde total | 2065 : socle | 2065 : dette/PIB | intérêts 2065 |
|---|---|---|---|---|---|---|---|---|---|---|
| bas (0,4 %) | −286 | 222 | 156 % | −402 | 0 | 219 % | −678 | 0 | 419 % | 535 |
| **central (0,7 %)** | **−269** | **261** | **148 %** | **−360** | **48** | **196 %** | **−556** | **0** | **329 %** | **475** |
| haut (1,0 %) | −251 | 301 | 142 % | −315 | 150 | 175 % | −421 | 0 | 251 % | 410 |
| Commission | −284 | 227 | 155 % | −341 | 91 | 190 % | −404 | 0 | 247 % | 425 |
| IA médiane (1,4 %) | −227 | 355 | 133 % | −252 | 295 | 150 % | −221 | 354 | 164 % | 317 |
| IA haute (2,0 %) | −189 | 441 | 121 % | −150 | 532 | 115 % | +132 | 1 243 | 61 % | 159 |

(Chiffres de la version précédente, avant la correction du double compte des intérêts de 2024 : central −276 / −376 / −592 Md€ et 150 / 200 / 343 % ; IA haute 88 % en 2065 ; IA médiane 186 %.)

Au central : solde primaire −109 / −81 Md€ (2035 / 2065), intérêts 159 (2035) et 475 (2065). En % du PIB : solde sans intérêts nouveaux −5,4 / −5,1 / −4,2 %, **avec intérêts −8,3 / −10,3 / −15,0 %** (−5,6 % en 2025). **Sensibilité** (central, 2065) : taux de marché bas (3,4 %) : solde −428 Md€, dette 282 % ; haut (4,5 %) : −687 Md€, 375 % ; pensions calées sur le COR : −650 Md€, 362 % ; pensions sur les salaires : −795 Md€, 410 %. Reste du budget figé (ancien comportement) avec intérêts : −339 Md€ et 245 % en 2065 (le reste indexé coûte 217 Md€ de plus en 2065 : 114 de solde hors intérêts nouveaux et 119 d'intérêts sur la dette supplémentaire) ; reste indexé sur la productivité seule : −562 Md€, 321 %. **Repère** (7h du rapport) : si le solde primaire restait seulement à son niveau de 2025 en % du PIB (−3,5 %), sans vieillissement ni santé, la dette serait de 149 / 200 / 355 % du PIB en 2035 / 2045 / 2065 au central : **la trajectoire de la dette vient d'abord du solde primaire de départ et de l'écart entre le taux de marché et la croissance, pas de la démographie.**

**Lecture.**
1. **Le palier 1 à 35 % n'est pas soutenable en l'état, ni en euros ni en dette.** À la productivité du COR (0,7 %) et avec des pensions sur les prix, le solde de 2065 est de −157 Md€ (−4,2 % du PIB) contre −163 (−5,6 %) en 2025 : un léger mieux **en part du PIB seulement**, et le socle finançable reste sous 500 € en 2035 et 2045 (471 et 467 €) avant de revenir à 515 € en 2065 (800 € dans la version du 01/11). **Avec les intérêts de la dette, le solde total passe à −269 / −360 / −556 Md€ et la dette à 148 / 196 / 329 % du PIB** ; le socle finançable tombe à 48 € en 2045 puis 0. Seule la variante IA haute (2,0 % pendant 40 ans) ramène la dette sous son niveau de départ (61 % en 2065), la variante IA médiane la laisse à 164 %. **Le palier 1 a besoin d'un solde primaire positif (donc d'un taux plat plus haut, d'un socle plus bas ou de dépenses réduites) : c'est le constat, avant toute question de démographie.** Ce n'est pas un résultat sur la réforme (le système actuel n'est pas tracé ici ; son déficit de 2025 est de −5,1 % du PIB), mais sur le palier 1 tel que calibré à 35 %.
2. **La phrase du 01/11 « le palier 1 est déjà meilleur en 2065 qu'en 2025 » reposait sur une asymétrie** : l'assiette du nouvel impôt gagnait 32 % de productivité pendant que le reste du budget (net −384 Md€) restait en euros de 2025 pendant 40 ans. Un gel réel de toute la dépense publique hors pensions et socle sur 40 ans est une **politique de rigueur explicite**, pas une hypothèse neutre ; elle reste disponible en variante (`reste: 'fige'`) et reste très favorable : −43 Md€ sans intérêts, mais déjà −339 Md€ avec eux.
3. **La variable qui compte reste l'indexation des pensions, pas le scénario de productivité.** À 0,7 %, le passage des pensions des prix aux salaires coûte 128 Md€ en 2065 ; avec des pensions et un socle sur les salaires et un reste indexé, **la productivité ne finance rien du tout** : le budget entier croît avec le PIB, le déficit reste un pourcentage constant du PIB (−5,6 %) et la dette suit les intérêts. Les pensions calées sur la pension relative du COR (C bis) sont entre les deux : −205 Md€ en 2065 (−157 sur les prix, −285 sur les salaires).
4. **Ce que cela dit sur la thèse de l'auteur (opinion, à discuter)** : la croissance finance le socle seulement si les prestations sont **découplées** des salaires, et cela ne suffit pas à stabiliser la dette à la productivité du COR. « Pensions sur les prix » n'est pas le mécanisme du COR : c'est une version plus dure (pension relative de 41 % en 2065 contre 45 % au COR en 2070), qui revient à faire décrocher les retraités de 13 points. Le COR lui-même décroche de 9 points. **C'est un choix de société, pas un gain**, et il faut le dire aux retraités dans le manifeste (steelman : « les pensions décrochent de 9 points par rapport aux salaires »). Il faut aussi le dire pour le socle : un socle fixé en euros constants vaut de moins en moins par rapport au revenu moyen.
5. **La variante IA n'est pas un argument, c'est une condition.** En variante IA médiane (1,4 % pendant 40 ans, deux fois le central), le solde de 2065 serait de −4 Md€ sans intérêts (+272 le 01/11), et −221 avec : ce chiffre est le produit d'une hypothèse que **personne n'a démontrée sur 40 ans** (les études portent sur dix ans, de 0,07 à 1,3 point, avec un facteur 20 d'écart). Biais à nommer : l'auteur est pro-technologie ; le central du modèle reste le COR.
6. **Seuil de productivité.** Pour que le solde primaire de 2065 égale celui de 2025, il faut **0,60 %** (pensions sur les prix, reste indexé ; 0,67 % si l'on garde le solde aux intérêts de 2024 figés, 0,38 % le 01/11 avec le reste figé). Pour que la dette/PIB de 2065 retombe à son niveau de 2025, **1,66 %** par an pendant 40 ans (1,81 % avant la correction des intérêts), soit 2,4 fois la référence du COR et plus que la variante haute (1,0 %) ; avec des pensions calées sur le COR, 2,81 %.
7. **Ce que le module ne compte pas** : la croissance ne rétroagit pas sur l'emploi, la fécondité ni les migrations ; pas d'effet Baumol sur la santé (le coût unitaire des soins suit la productivité dès que le reste est indexé, sans effet de prix relatif) ; pas de rétroaction du socle sur la dette (le socle de 500 € est tenu, le « socle finançable » est un indicateur) ; pas de correction budgétaire pendant 40 ans (les déficits cumulés ne sont pas une prévision : ils montrent ce que coûterait l'absence de correction) ; la phase de transition, l'année 1 à plein effet et les cessions d'actifs ne sont pas modélisées ; un seul taux d'inflation (2 %) et des taux de marché constants, sans prime de risque liée à la dette ; le taux apparent suit une convergence linéaire à la durée de vie moyenne de la dette de l'État (8,5 ans), appliquée à toute la dette des administrations publiques ; le PIB du modèle (2 935, niveau 2024) est mis à l'échelle du PIB de l'Insee 2025 (2 991) pour le ratio de dette ; l'IA est un point de croissance de plus sans destruction d'emplois (variante de robotisation H18 non couplée) ; productivité et démographie ne sont pas corrélées dans la grille. Le scénario COR est une convention, pas une prévision.


## 18. Ce qui rendrait le palier 1 soutenable : leviers, contraintes, solveur (01/11/2026, **corrigé le 01/11/2026 après la relecture adverse**, `soutenabilite.js`, `trajectoires_age_depart.js`, `rapport_soutenabilite.js`, `resultats-soutenabilite.txt`, `test_soutenabilite.js` : 282 contrôles ; modules sous-jacents au vert ; H183 à H193, H194 à H197 et H198 à H201 (§ 18.8) et H202-H203 (offre de travail), methode.md § 20)

> **Question.** Le § 17.ter dit que le palier 1 tel quel (taux plat 35 %, socle 500 €, pensions sur les prix) n'est pas soutenable : dette de 329 % du PIB en 2065 (343 % avant la correction du double compte des intérêts de 2024, § 17.ter). Que faudrait-il changer, et à quel prix pour les ménages modestes, pour que la dette/PIB soit **stable ou en baisse entre 2025 et 2065, intérêts compris, au central** (démographie centrale, productivité 0,7 % du COR, taux de marché 4,0 %) ? **Critère (H183)** : dette/PIB de 2065 ≤ 115,7 % (niveau de 2025) et jamais au-dessus de 120,7 % entre-temps. Le solveur (`soutenabilite.js`) ne recopie aucun chiffre : le solde de chaque année vient de `age_sante.solde`, les intérêts et la dette de la même formule que `croissance.chemin` (le palier 1 sans levier retrouve **329,2 %** à 1e-9 près) ; l'âge de départ vient du module emploi (H191).

> **Corrections du 01/11/2026 (relecture adverse, `RELECTURE-SOUTENABILITE-2026-11-01.md`, section « Suites données »).** (1) Les intérêts de 2024 n'étaient plus comptés deux fois (D2) : dette/PIB 2065 du palier 1 de 343 à 329 %, de A2 de 108 à 94 %. (2) La grille du socle par pas de 50 € créait un effet de seuil (D1) : elle est remplacée par une grille de 5 € (et de 1 point pour le taux plat), et le seuil de taux plat est donné **hors grille, sous forme de fourchette** selon les leviers favorables et le taux d'intérêt (§ 18.1 point 3, tableau 18.3 bis). « Taux plat ≥ 45 % » est remplacé par « environ 40 à 45 % au central ». (3) Le stress isole désormais les réactions de comportement hautes seules et le socle indexé sur les salaires (§ 18.7). (4) Les combinaisons A1 à A3, B1 et R1 restent des **repères figés** (elles ne sont plus « les trois moins coûteuses » : la recherche fine en trouve de moins coûteuses, au bord de la zone à 100 %). (5) Le levier D de la création de valeur est retiré quand des économies sont comptées (D10). (6) Les verdicts « le smicard y perd sous les contraintes de l'auteur » et « rien ne tient aux droits de succession actuels » **tiennent** (§ 18.1 points 4 et 5).

### 18.1 Ce qu'il faut retenir (écrit pour être vrai)

1. **L'écart à combler est d'environ 140 Md€ par an, en euros de 2025 (≈ 4,6 % du PIB)**, et il est le même quelle que soit la façon de le dire : un taux plat seul de **45,8 %** (+10,8 points × 12,7 Md€ = 137), ou un socle seul de **176 €** (−324 € × 0,43 Md€ = 139), ou des économies de dépenses seules de **217 Md€** à 10 ans (contre 8 / 18 / 31 documentées). Aucun levier seul ne stabilise la dette ; un taux plat de 45,8 % dépasse en outre le plafond de 75 % (taux marginal combiné de 82 %).
2. **Il existe des combinaisons qui stabilisent la dette** : 248 845 des 629 760 combinaisons de la grille fine sous le seul plafond juridique (personnel 75 %), 212 517 avec l'IS compté. **Mais elles reposent presque toutes sur toutes les hypothèses favorables à la fois** (économies de 31 Md€, création de valeur, âge de départ +1 ou +2 ans, hautes pensions à 30 % dès 2 000 €, transmissions à 50 %).
3. **Sous les contraintes de l'auteur** (plafond de 75 % compté avec l'IS, minimum garanti, pensions au moins sur les prix, retraités sous 2 500 € non touchés, âge de départ inchangé, zone à 100 % ≤ 800 €), il reste **3 140 combinaisons stables sur 52 800 admissibles** (grille fine), toutes avec un **taux plat de 40 % ou plus** et les transmissions à 50 %. **Le seuil de taux plat n'est pas un chiffre, c'est une fourchette** (recherche hors grille, plus petit socle admissible pour chaque taux plat ; tableau 18.3 bis) : **au central, 39,7 % si tous les leviers favorables se réalisent (économies 31 Md€, hautes pensions 30 %, création de valeur), 42,2 % avec les leviers de A2 (18 Md€, 25 %), 44,9 % sans aucun levier hors taux plat et socle** ; selon le taux de marché, de **37,3 %** (3,4 %, tous les leviers) à **47,0 %** (4,5 %, aucun levier). Le socle correspondant est de 394 à 436 € (t_max de 27 % à 21,8 %). La version précédente écrivait « ≥ 45 % » : c'était un effet de la grille (le socle de 425 €, absent de la grille de 50 €, est admis à 42 %). **Ce qui tient : un taux plat de l'ordre de 40 à 45 %, soit 5 à 10 points au-dessus des 35 % du palier 1.** Les repères A1 à A3 (taux plat de 45 à 48 %) coûtent aux ménages modestes **528 / 628 / 684 € par mois** (Smic et médian cumulés, par rapport au palier 1 tel quel) ; la recherche fine en trouve de moins chères (**468 €**, socle 400 €, plat 40 %), mais elles supposent toutes les hypothèses favorables.
4. **Sous les contraintes de l'auteur, le smicard ne peut pas rester gagnant.** Au palier 1 tel quel il gagne 85 € ; dans A1 à A3 il perd **114 à 174 €** par rapport à aujourd'hui. **Aucune combinaison de la grille fine ne le garde à moins de 10 € de perte** (tolérance de `optimisation.js`, v2) sous les contraintes de l'auteur, tous leviers au maximum compris ; la **perte la plus faible parmi les combinaisons stables est de 94 €** (taux de marché 4,0 %), **65 €** (3,4 %), **124 €** (4,5 %). La phrase précédente (« aucune des 38 400 combinaisons… incompatibles dans ce modèle ») était **trop large** (relecture D3) : hors des contraintes de l'auteur, la grille fine trouve **4 combinaisons** qui le tiennent (âge +2, 31 Md€ d'économies, hautes pensions à 30 % dès 2 000 €, création de valeur ; la meilleure : socle 485 €, plat 39 %, dette de 109 % en 2065, maximum 117 %, productivité requise 0,67 %), et la relecture a trouvé hors grille (socle de 750 à 800 €, plat de 52 à 54 %, âge +2) des combinaisons à −3 € ; il faut alors accepter l'âge de départ +2 ans et la contribution des pensions dès 2 000 €. **Protéger le smicard est donc un arbitrage, pas une impossibilité.**
5. **Les transmissions portent le tout.** À droits actuels, le solde baisse de 83 Md€ la première année (105 Md€ en 2065, hors intérêts) : **aucune combinaison de la grille ne stabilise la dette sous les contraintes de l'auteur** (taux plat jusqu'à 50 %), **et au central aucun taux plat jusqu'à 70 %** (socle de 300 à 500 €) ; seul un taux de marché de 3,4 % avec tous les leviers au maximum y arrive, à **51 %** de taux plat (rien à 4,0 % ni 4,5 %). Si l'on lève la seule contrainte de zone à 100 %, la moins coûteuse (928 € par mois pour les ménages modestes) demande un taux plat de 45 %, un socle de 300 € (zone à 100 % de 1 049 €), 31 Md€ d'économies, la création de valeur et les hautes pensions à 30 % (D22).
6. **Lâcher l'âge de départ et le seuil des hautes pensions change beaucoup** : B1 (âge +2 ans, hautes pensions à 30 % dès 2 000 €, économies de 31 Md€, création de valeur, socle 450 €, plat 38 % avec t_max 28,7 %) coûte **424 €** aux ménages modestes et le smicard ne perd que 25 € ; mais le retraité à 3 500 € perd 450 € (au lieu de 200), les retraités entre 2 000 et 2 500 € sont touchés, deux années de travail en plus sont demandées (contraire à la position de l'auteur, qui refuse d'allonger le temps de travail et de reculer l'âge de la retraite) et la fragilité est à son maximum (3,75 sur 3,75 : toutes les hypothèses favorables sont mobilisées). B1 repose en outre sur une assiette ajoutée par le départ plus tardif probablement surestimée de 10 à 30 % (H191) : la relecture trouve B1 non stable dans les trois cas **avant** la correction des intérêts (117,5 / 122,6 / 127,6 %) ; après correction B1 est à 103 % et n'a pas été retesté avec cette réduction.
7. **Aucune combinaison n'a de marge, et le plus gros aléa est celui des réactions de comportement.** Productivité requise **0,60 à 0,65 %** (A1 à A3, B1) contre 0,7 % supposée (0,29 % pour R1). Avec une productivité de 0,4 % seule, A1 à A3 et B1 sont à **165 à 177 %** ; avec en plus des taux de 4,5 % (le stress de H190), à **194 à 208 %**. **Un seul aléa à la fois (§ 18.7)** : productivité 0,4 % : 165 à 177 % ; taux de 4,5 % : 116 à 128 % ; socle indexé sur les salaires : 144 à 159 % ; **réactions de comportement hautes seules, démographie centrale : 247 à 274 %**. En démographie et réactions « haut » (taux haut), **349 à 383 %**. Même R1 (plat 50 %, t_max 16,7 %, socle 500 €, 31 Md€, création de valeur, hautes pensions 30 % ; **788 €** par mois, **260 € de plus qu'A1**) résiste à la productivité basse, aux taux hauts et au socle sur les salaires (77 %), mais pas aux réactions hautes seules (211 %) : **la marge de sécurité a un prix et ne couvre pas le plus gros aléa**. La conclusion vaut ce que valent les élasticités centrales : avec des réactions fortes, aucun réglage sous 55 % ne tient (relecture D4).
8. **« Pensions sur les prix » n'est pas neutre.** C'est l'indexation la moins chère pour le budget et celle de la position de l'auteur (minimum garanti indexé sur l'inflation), mais ce n'est **pas** la trajectoire du COR : la pension relative tombe à 41,3 % du revenu d'activité en 2065 (45,3 % au COR). Passer aux pensions du COR coûte **48 Md€ de plus par an en 2065** (hors intérêts), aux salaires **128**, à l'indexation « mixte » (COR sous 2 500 €, prix au-dessus : protège 58 % de la masse) **28**. Tous les résultats ci-dessus supposent « prix » : c'est un choix lourd, présenté à tort dans le § 13 comme un détail. **Même remarque pour le socle** (relecture D7) : un socle de 450 à 500 € indexé sur les prix perd 21 % de sa valeur relative en 2065 (1,007^40 = 1,32) ; s'il suit les salaires, A2 passe à 144 %, A1 à 159 %, A3 à 148 %, B1 à 152 % (non stables), R1 reste à 77 % (stable).
9. **Ce que le solveur ne dit pas** : qui paie les économies de dépenses (services publics non chiffrés), quel est l'effet de 50 % de droits sur chaque héritage (aucun abattement : une famille modeste qui hérite d'un logement est la première touchée, non modélisé par profil), et si un taux plat de 45 % avec t_max réduit garde l'économie de la réforme (réactions de l'offre de travail comptées par le modèle, jamais testées à ce niveau ⚠️). **Les transmissions à 50 % sont dans la base de toutes les combinaisons** alors que H178 les dit « plutôt optimistes » : fuite de 31 % (78 au lieu de 103,5 Md€ avec une fuite haute) et plat minimal de 46 % à fuite haute avant correction des intérêts (relecture D8) ; A2 repose donc sur l'hypothèse la plus lourde du modèle (≈ 83 Md€ par an). **Indice de fragilité** : A3 (1,25) < A2 (1,5) < A1 (2,5) ; A2 n'est donc pas « la moins fragile » (relecture D10), c'est la moins coûteuse des deux moins fragiles.

### 18.2 Chaque levier seul (écart par rapport au palier 1 tel quel, central)

| levier | écart 2035 | écart 2045 | écart 2065 | dont hors intérêts : 2035 / 2045 / 2065 | dette/PIB 2065 | stable ? | taux marginal combiné (IS + dividende) |
|---|---|---|---|---|---|---|---|
| Palier 1 tel quel (35 %, 500 €, pensions sur les prix) | +0 | +0 | +0 | +0 / +0 / +0 | 329 % | non | 73,8 % |
| Socle 450 € | +29 | +40 | +66 | +22 / +22 / +19 | 296 % | non | 73,8 % |
| Socle 400 € | +58 | +80 | +133 | +44 / +43 / +39 | 263 % | non | 73,8 % |
| Socle 350 € | +87 | +120 | +200 | +67 / +65 / +59 | 230 % | non | 73,8 % |
| Socle 300 € | +117 | +159 | +267 | +89 / +87 / +78 | 197 % | non | 73,8 % |
| Taux plat 36 % | +18 | +26 | +48 | +14 / +15 / +16 | 307 % | non | 74,5 % |
| Taux plat 38 % | +53 | +78 | +140 | +41 / +44 / +47 | 264 % | non | 76 % |
| Taux plat 40 % | +87 | +126 | +229 | +67 / +72 / +76 | 222 % | non | 77,5 % |
| Taux plat 42 % | +119 | +173 | +312 | +91 / +98 / +104 | 183 % | non | 79 % |
| Taux plat 45 % | +163 | +237 | +429 | +126 / +135 / +143 | 129 % | non | 81,3 % |
| Taux plat 38 % avec plafond combiné 75 % (t_max réduit) | +48 | +70 | +127 | +37 / +40 / +42 | 270 % | non | 75 % |
| Taux plat 40 % avec plafond combiné 75 % (t_max réduit) | +75 | +109 | +198 | +58 / +62 / +66 | 237 % | non | 75 % |
| Pensions sur le COR sous 2 500 €, les prix au-dessus | −7 | −19 | −55 | −6 / −14 / −28 | 348 % | non | 73,8 % |
| Pensions sur la pension relative du COR | −13 | −32 | −94 | −11 / −23 / −48 | 362 % | non | 73,8 % |
| Pensions sur les salaires | −29 | −76 | −240 | −25 / −56 / −128 | 410 % | non | 73,8 % |
| Âge effectif de départ +1 an (rampe 2027-2040) | +16 | +33 | +63 | +13 / +21 / +23 | 295 % | non | 73,8 % |
| Âge effectif de départ +2 ans (rampe 2027-2040) | +31 | +66 | +126 | +26 / +42 / +46 | 263 % | non | 73,8 % |
| Économies de dépenses 8 Md€ à 10 ans | +9 | +13 | +23 | +8 / +8 / +8 | 319 % | non | 73,8 % |
| Économies de dépenses 18 Md€ à 10 ans | +21 | +29 | +52 | +18 / +18 / +18 | 306 % | non | 73,8 % |
| Économies de dépenses 31 Md€ à 10 ans | +36 | +50 | +89 | +31 / +31 / +31 | 288 % | non | 73,8 % |
| Transmissions aux droits actuels (pas de 50 %) | −119 | −173 | −313 | −92 / −98 / −105 | 476 % | non | 73,8 % |
| Hautes pensions : 25 % au-dessus de 2500 € | +4 | +6 | +11 | +3 / +4 / +4 | 324 % | non | 73,8 % |
| Hautes pensions : 30 % au-dessus de 2500 € | +9 | +12 | +23 | +7 / +7 / +8 | 319 % | non | 73,8 % |
| Hautes pensions : 30 % au-dessus de 2000 € | +23 | +33 | +60 | +18 / +19 / +20 | 301 % | non | 73,8 % |
| Création de valeur (sans C ni E), gelée après 10 ans | +11 | +17 | +30 | +10 / +11 / +11 | 316 % | non | 73,8 % |
| Productivité 1,0 % par an au lieu de 0,7 % | +18 | +45 | +134 | +13 / +28 / +60 | 251 % | non | 73,8 % |
| Productivité 1,4 % par an au lieu de 0,7 % | +42 | +108 | +335 | +31 / +68 / +153 | 164 % | non | 73,8 % |

Seuils d'un levier seul (aucun plafond, hors grille) : socle ≤ 176 € (au lieu de 500) ; taux plat ≥ 45,8 % (au lieu de 35 %) ; économies de dépenses ≥ 217 Md€ à 10 ans (au lieu de 8 / 18 / 31).
Même seuil avec les transmissions aux droits actuels : socle aucun, même à 0 € ; taux plat ≥ 58,6 % (au-delà du plafond de 75 %).

*Lecture* : par unité de politique, 50 € de socle valent **22 Md€** par an (hors intérêts), 1 point de taux plat **14 Md€** (12,7 au départ ; environ 12 si l'on réduit t_max pour tenir 75 %), un an d'âge **13 Md€ en 2035, 21 en 2045 et 23 en 2065** (la rampe dure jusqu'en 2040), les 18 Md€ d'économies **18**, la contribution des hautes pensions à 25 % au-dessus de 2 500 € **4**. Les transmissions aux droits actuels coûtent **92 à 105 Md€** par an (hors intérêts) : c'est le plus gros levier du modèle, dans le mauvais sens. La productivité à 1,0 % ne ferait que +60 Md€ en 2065 hors intérêts, à 1,4 % (variante IA médiane) +153 : sans correction, c'est 164 % de dette, pas moins.

### 18.3 Combinaisons stables par jeu de contraintes

Grille fine de 629 760 combinaisons (socle de 500 à 300 € par 5 € × plat de 35 à 50 % par point × pensions × âge × économies × transmissions × hautes pensions × valeur ; la grille précédente, de 38 400 combinaisons, avait un socle par 50 € et huit taux plat ; méthode.md § 20). « Stables au stress » : productivité 0,4 % et taux 4,5 %. Coût : € par mois, 2025, Smic et médian cumulés + pénalité d'âge (H188, H193).

| jeu | combinaisons testées | admissibles | stables | stables au stress | plat minimal parmi les stables | socle minimal | coût minimal (€/mois) |
|---|---|---|---|---|---|---|---|
| smicSeul : Plafond combiné 75 % et le smicard ne perd pas plus de 10 €/mois (aucune autre contrainte : âge, hautes pensions, indexation et transmissions libres) | 629760 | 53760 | 4 | 0 | 39 % | 485 € | 386 |
| juridique : Plafond juridique seul (taux marginal personnel ≤ 75 %, IS non compté), t_max réduit si besoin | 629760 | 629760 | 248845 | 141662 | 35 % | 300 € | 373 |
| combine : Plafond juridique avec l'IS (taux marginal combiné ≤ 75 %), t_max réduit si besoin, aucune autre contrainte | 629760 | 629760 | 212517 | 109422 | 35 % | 300 € | 386 |
| pierre : Contraintes de l'auteur : plafond combiné 75 %, minimum garanti, pensions au moins sur les prix, retraités sous 2 500 € non touchés, âge de départ inchangé, zone à 100 % ≤ 800 € | 629760 | 52800 | 3140 | 77 | 40 % | 400 € | 468 |
| pierreSmic : Contraintes de l'auteur + le smicard à 35 h ne perd pas plus de 10 €/mois par rapport à la loi actuelle (tolérance TOL_SMIC de optimisation.js, v2) | 629760 | 10752 | 0 | 0 | aucune | aucun | sans objet |
| pierreDroitsActuels : Contraintes de l'auteur + transmissions aux droits actuels (D22 prudent : on ne compte pas l'impôt de 50 %) | 629760 | 26400 | 0 | 0 | aucune | aucun | sans objet |
| pierreAge : Contraintes de l'auteur sauf l'âge de départ (+1 ou +2 ans autorisés) et seuil des hautes pensions ≥ 2 000 € | 629760 | 264000 | 36443 | 7919 | 35 % | 360 € | 386 |

Les trois moins coûteuses pour chaque jeu (distinctes par socle, taux plat et âge), avec la dette/PIB au stress, sont dans `resultats-soutenabilite.txt` § 3. Sous le jeu « pierre », la recherche fine donne : (1) socle 400 €, plat 40 % (t_max 26,7 %), 31 Md€, création de valeur, hautes pensions 30 % > 2 500 € : 114 % en 2065, 213 % au stress, **468 €**, fragilité 2,75, zone à 100 % de 795 € (au bord de la limite de 800 €) ; (2) socle 425 €, plat 41 % : 470 € ; (3) socle 450 €, plat 42 % : 472 €. Les trois ont les mêmes leviers favorables, tous au maximum. Les **repères figés** A1 à A3 (stables après correction) :

| # | combinaison | dette/PIB 2065 | au stress (cumul H190) | coût (€/mois) | fragilité |
|---|---|---|---|---|---|
| A1 | socle 500 €, plat 45 % (t_max 21,7 %), pensions prix, âge inchangé, économies 31 Md€, transmissions 50 %, hautes pensions 25 % > 2 500 €, création de valeur (sans le levier D, recoupé par les économies) | 105 % | 208 % | 528 | 2,5 |
| A2 | socle 450 €, plat 45 % (t_max 21,7 %), pensions prix, âge inchangé, économies 18 Md€, transmissions 50 %, hautes pensions 25 % > 2 500 € | 94 % | 194 % | 628 | 1,5 |
| A3 | socle 500 €, plat 48 % (t_max 18,7 %), pensions prix, âge inchangé, économies 8 Md€, transmissions 50 %, hautes pensions 25 % > 2 500 € | 94 % | 197 % | 684 | 1,25 |

Le coût pour les ménages modestes de chaque contrainte (§ 6 du rapport) : **386 €** sous le plafond de 75 % seul (373 avec le plafond personnel), **468 €** sous les contraintes de l'auteur, **aucune combinaison** si l'on ajoute « le smicard ne perd pas » ou « transmissions aux droits actuels ».

**18.3 bis. Seuil de taux plat hors grille (sous les contraintes de l'auteur) : une fourchette.** Pour chaque taux plat (balayage par 0,25 point, puis dichotomie), le plus petit socle admissible (pas de 5 €, affiné au centime ; c'est la zone à 100 % ≤ 800 € qui le borne), puis test de stabilité. Autres leviers : pensions sur les prix, âge inchangé, transmissions à 50 %.

| leviers | taux de marché 3,4 % | 4,0 % (central) | 4,5 % | socle correspondant (central) |
|---|---|---|---|---|
| tous les leviers favorables au maximum (économies 31 Md€, hautes pensions 30 % > 2 500 €, création de valeur) | 37,3 % | 39,7 % | 41,7 % | 394 € (t_max 27 %) |
| leviers de A2 (économies 18 Md€, hautes pensions 25 % > 2 500 €, sans valeur) | 39,7 % | 42,2 % | 44,3 % | 414 € (t_max 24,5 %) |
| aucun levier hors taux plat et socle | 42,3 % | 44,9 % | 47 % | 436 € (t_max 21,8 %) |

Fourchette au central : 39,7 % à 44,9 % ; toutes hypothèses de taux confondues : 37,3 % à 47 %. Droits actuels : taux de marché 3,4 % : taux plat 51 % ; aucun taux plat à 4,0 % ni 4,5 % (jusqu'à 70 %).

### 18.4 Les combinaisons de référence : trajectoire, productivité requise, robustesse

A1 à A3 : repères figés, issus de la première recherche (grille de 50 €), admissibles sous les contraintes de l'auteur et **restés stables après correction des intérêts** ; B1 : la moins coûteuse sans l'âge ni le seuil de 2 500 € (première recherche) ; R1 : la plus robuste au stress de H190 sous les contraintes de l'auteur. Indice de fragilité : A1 2,5 ; A2 1,5 ; A3 1,25 ; B1 3,75 ; R1 2,75.

| étiquette | combinaison | solde total 2035 / 2045 / 2065 (Md€) | dette/PIB 2035 / 2045 / 2065 | productivité requise | dette/PIB 2065 : productivité 0,4 % | taux 4,5 % | taux 3,4 % | démographie et réactions « haut » | « bas » |
|---|---|---|---|---|---|---|---|---|---|
| A1 | socle 500 €, plat 45 % (t_max 21,7 %), pensions prix, âge +0, économies 31 Md€, transmissions 50 %, hautes pensions 25 % > 2500 €, valeur oui | −83 / −92 / −73 | 109 % / 106 % / 105 % | 0,65 % | 177 % | 128 % | 81 % | 383 % | −33 % |
| A2 | socle 450 €, plat 45 % (t_max 21,7 %), pensions prix, âge +0, économies 18 Md€, transmissions 50 %, hautes pensions 25 % > 2500 €, valeur non | −74 / −80 / −56 | 105 % / 100 % / 94 % | 0,6 % | 165 % | 117 % | 72 % | 361 % | −35 % |
| A3 | socle 500 €, plat 48 % (t_max 18,7 %), pensions prix, âge +0, économies 8 Md€, transmissions 50 %, hautes pensions 25 % > 2500 €, valeur non | −76 / −81 / −51 | 104 % / 101 % / 94 % | 0,6 % | 167 % | 116 % | 71 % | 376 % | −42 % |
| B1 | socle 450 €, plat 38 % (t_max 28,7 %), pensions prix, âge +2, économies 31 Md€, transmissions 50 %, hautes pensions 30 % > 2000 €, valeur oui | −96 / −93 / −72 | 112 % / 107 % / 103 % | 0,64 % | 168 % | 127 % | 79 % | 349 % | −21 % |
| R1 | socle 500 €, plat 50 % (t_max 16,7 %), pensions prix, âge +0, économies 31 Md€, transmissions 50 %, hautes pensions 30 % > 2500 €, valeur oui | −16 / 5 / 103 | 93 % / 73 % / 22 % | 0,29 % | 89 % | 38 % | 7 % | 309 % | −113 % |

### 18.5 Qui gagne, qui perd (€ par mois, 2025, central)

| profil | avant | palier 1 tel quel (35 %, 500 €) | A1 | A2 | A3 | B1 | R1 |
|---|---|---|---|---|---|---|---|
| Smicard à 35 h | 1707 | +85 | −114 | −164 | −174 | −25 | −214 |
| Salarié médian (2 116 € nets) | 2116 | +636 | +307 | +257 | +210 | +482 | +146 |
| Cadre à 60 k€ brut (≈ 4 000 € nets) | 3383 | +968 | +471 | +421 | +335 | +739 | +244 |
| Cadre à 8 000 € nets | 6290 | +1156 | +412 | +362 | +233 | +782 | +113 |
| Retraité à 1200 € nets | 1200 | +0 | +0 | +0 | +0 | +0 | +0 |
| Retraité à 3500 € nets | 3096 | −200 | −250 | −250 | −250 | −450 | −300 |

Retraité à 1 200 € : effet de l'indexation de la pension en 2045 par rapport aux prix (€/mois) : A1 +0 ; A2 +0 ; A3 +0 ; B1 +0 ; R1 +0
Coût pour les ménages modestes (€/mois) : A1 528 ; A2 628 ; A3 684 ; B1 424 ; R1 788
Smicard à 35 h : écart à la loi actuelle A1 −114 ; A2 −164 ; A3 −174 ; B1 −25 ; R1 −214 ; tolérance de optimisation.js (v2) : −10.

*Lecture* : (1) la logique « actifs modestes contre retraités » du § 15 se déplace : sous les contraintes de l'auteur, le **smicard** paie la soutenabilité (−114 à −174 €), le **salarié médian** garde +210 à +307 € (contre +636), le **cadre à 8 000 €** garde +233 à +412 € (contre +1 156) : le prix de la soutenabilité est payé surtout par ceux qui gagnaient le plus au palier 1 ; (2) les **retraités à 1 200 € ne bougent pas** dans aucune combinaison (hautes pensions au-dessus de 2 000 €, indexation sur les prix) ; celui à 3 500 € perd 250 € (25 % au-dessus de 2 500 €) et 450 € dans B1 ; (3) **qui n'est pas dans le tableau** : les héritiers (50 % de droits sur tout le flux, aucun abattement), les agents et usagers des services publics visés par 8 à 31 Md€ d'économies, les travailleurs de 60 à 64 ans dans B1 (deux ans de plus, sans surcote), les chômeurs, parents isolés et étudiants (le plat de 45 % ne change pas leurs planchers mais réduit le gain du retour à l'emploi).

### 18.6 Limites

(1) Les combinaisons de référence sont **au bord** du critère : leur stabilité n'a pas de marge (§ 18.1, point 7). (2) La réforme est à plein effet dès 2026, sans transition ni rétroaction du socle ou du taux plat sur la dette (comme § 17.ter) ; au-dessus de 55-60 % de taux plat, les recettes du modèle redescendent : le seuil est le plus petit taux plat trouvé par un balayage de 35 à 65 %, pas une propriété de monotonie. (3) L'âge de départ passe par une translation des courbes d'activité, sans surcote ni hétérogénéité : l'assiette ajoutée est probablement surestimée de 10 à 30 % ⚠️ (H191). (4) Le classement « moins coûteuses pour les ménages modestes » dépend d'un indicateur choisi (H193, pénalité d'âge de 40 € par an, H188 ⚠️) ; un autre donnerait un autre ordre, mais pas un autre verdict sur le smicard ni sur les transmissions. (5) Économies, création de valeur et hautes pensions n'ont aucun effet de comportement propre ; le levier D de la création de valeur (simplification, 6,4 Md€) est **retiré** quand des économies sont comptées (H187, D10). (6) L'indexation « prix » du socle et des pensions est un choix lourd (§ 18.1, point 8). (7) **Zone à 100 % et plafond de 75 %** (D11) : le plafond de 75 % porte sur le taux marginal en haut de la distribution (personnel et combiné avec l'IS) ; en bas, la zone à 100 % (retrait du complément quand le revenu monte) atteint 685 à 795 € par mois dans les repères et les combinaisons de la grille fine, et son seuil de 800 € (H185, choix de Claude) détermine le taux plat minimal : à 850 € le seuil baisserait encore. Les deux règles ne sont pas les mêmes ; la contradiction apparente n'est pas corrigée, elle est **documentée**. (8) Non chiffrés (D12) : pas de transition (H177 compte ≈ 20 Md€ de montée de la santé non comptés), inflation de 2 % non testée, aucune rétroaction du taux plat sur la croissance, « avant » du smicard (1 707 €) estimé ⚠️ ; l'indexation des intérêts de 2024 avec le reste (D2) vaut pour l'option `reste: 'pib'` ; en `'fige'` le solde primaire reste fixe. (9) Les chiffres sont des ordres de grandeur sous hypothèses, jamais des prédictions : ils disent ce qu'il faudrait pour que la dette ne grimpe pas, pas ce qui se passera.

### 18.7 Stress isolés (relecture D4 et D7) : un seul aléa à la fois, les autres au central

Dette/PIB de 2065 et maximum 2026-2065 ; « stable » si le critère H183 est tenu. **Réactions de comportement hautes seules** : écart statique du solde du palier 1 (réactions « haut » moins centrales), indexé sur le PIB, démographie centrale ; **socle sur les salaires** : le socle suit (1+g)^k au lieu des prix.

| combinaison | productivité 0,4 % (COR, variante basse) | taux de marché 4,5 % | réactions de comportement hautes seules (démographie centrale) | socle indexé sur les salaires (au lieu des prix) | démographie et réactions « haut » (ensemble) | cumul de H190 : productivité 0,4 % et taux 4,5 % |
|---|---|---|---|---|---|---|
| A1 | 177 % (max 177 %) | 128 % (max 128 %) | 274 % (max 274 %) | 159 % (max 159 %) | 336 % (max 336 %) | 208 % (max 208 %) |
| A2 | 165 % (max 165 %) | 117 % (max 117 %) | 262 % (max 262 %) | 144 % (max 144 %) | 316 % (max 316 %) | 194 % (max 194 %) |
| A3 | 167 % (max 167 %) | 116 % (max 116 %) | 274 % (max 274 %) | 148 % (max 148 %) | 330 % (max 330 %) | 197 % (max 197 %) |
| B1 | 168 % (max 168 %) | 127 % (max 127 %) | 247 % (max 247 %) | 152 % (max 152 %) | 305 % (max 305 %) | 198 % (max 198 %) |
| R1 | 89 % (max 114 %) stable | 38 % (max 114 %) stable | 211 % (max 211 %) | 77 % (max 114 %) stable | 269 % (max 269 %) | 111 % (max 114 %) stable |

Lecture : le plus gros aléa isolé est celui des **réactions de comportement** (A2 : 262 %, soit environ −95 Md€ par an en 2065, l'équivalent de 7 points de taux plat), loin devant la productivité basse (165 %), le taux de 4,5 % (117 %) ou le socle sur les salaires (144 %). Seule R1 passe les quatre premiers stress ; aucune ne passe les réactions hautes ni la démographie haute.

### 18.8 Une autre voie : un socle élevé et un taux plat de 40 à 60 % (piste du 01/11/2026, `frontiereSocle`, hypothèses H198 à H201 ; tableaux complets dans `resultats-soutenabilite.txt` § 8)

> **Pourquoi cette piste.** Les § 18.1 à 18.7 cherchaient les combinaisons qui tiennent **sous les contraintes de l'auteur**, avec un socle de 300 à 500 €. La relecture (D3) avait signalé hors grille un socle de 750 à 800 € avec un taux plat de 52 à 54 %. Cette piste répond à l'objectif de l'auteur (un socle élevé, un travail qui n'est plus obligatoire) : on étend la recherche au **socle de 300 à 1 000 € (pas de 5 €)** et au **taux plat jusqu'à 60 %**, avec le plafond de 75 % (IS compris), le minimum garanti, **le smicard à 0 € ou mieux et le salarié médian gagnant**. « Jamais tout prendre » est lu de deux façons : zone à 100 % ≤ 800 € (comme H185) ou, en variante stricte, **aucune** zone à 100 % (socle ≥ 877 €). Pour chaque taux plat et chaque combinaison de leviers, on prend le plus grand socle stable (H198).

**Ce qu'il faut retenir (écrit pour être vrai).**

1. **Une frontière existe, mais elle passe toujours par l'âge de départ.** Sur 523 points stables et admissibles, **aucun** ne laisse l'âge de départ inchangé : à âge inchangé, le smicard perd au mieux **33 €** par mois (taux plat 58,5 %, socle 850 €, contribution à 30 % dès 2 000 €), contre 94 € sous toutes les contraintes de l'auteur, et la dette ne tient pas dès que le socle monte au niveau qui le protège (915 € à 60 %). **Les contraintes de l'auteur qu'on relâche : l'âge de départ (+2 ans ; +1 an seulement avec une contribution dès 2 000 € et 50 % de taux plat), et, selon le point, le seuil de 2 500 € des retraités.** « Pensions au moins sur les prix », « transmissions à 50 % » et « plafond de 75 % » ne sont jamais relâchées (le modèle n'a pas d'indexation moins chère que les prix ; aux droits de succession actuels : **aucun point** jusqu'à 60 % et 1 000 €).
2. **La contribution des pensions dès 2 000 € n'est pas nécessaire** (précision sur la relecture D3) : avec l'âge +2 ans et une contribution de 30 % **au-dessus de 2 500 €** (retraités sous 2 500 € non touchés), la frontière commence à **44 %** (socle 595 €), **52 % : 780 €**, **54 % : 820 €**, **60 % : 925 €**. La contribution dès 2 000 € abaisse la frontière : de 20 à 25 € de socle de plus à taux plat égal, et un taux plat minimal de **39 %** (socle 495 €) au lieu de 44 %. Avec le palier 1 de base pour les hautes pensions (20 % au-dessus de 2 500 €) : 48 %, 675 €.
3. **Points de la frontière** (leviers au maximum : économies de 31 Md€, création de valeur, transmissions à 50 %). Smicard et médian en € par mois par rapport à aujourd'hui :

| # | taux plat | socle | contraintes de l'auteur relâchées | dette/PIB 2065 (max) | smicard | médian | cadre 4 000 € | cadre 8 000 € |
|---|---|---|---|---|---|---|---|---|
| P1 | 40 % | 520 € | âge +2 ans ; retraités de 2 000 à 2 500 € touchés | 115,5 % (117,7 %) | +5 | +488 | +718 | +732 |
| P2 | 44 % | 595 € | âge +2 ans | 115,6 % (118,2 %) | +1 | +434 | +611 | +567 |
| P3 | 48 % | 680 € | âge +2 ans (hautes pensions 25 %) | 113,7 % (118,7 %) | +6 | +390 | +515 | +413 |
| P6 | 50 % | 715 € | âge +1 an ; retraités de 2 000 à 2 500 € touchés | 115,2 % (118,0 %) | +1 | +361 | +459 | +328 |
| **P4** | **52 %** | **780 €** | **âge +2 ans** | 114,9 % (119,7 %) | +27 | +362 | +433 | +273 |
| P5 | 54 % | 820 € | âge +2 ans | 112,5 % (119,9 %) | +27 | +337 | +383 | +193 |
| P7 (stricte) | 57 % | 880 € | âge +2 ans ; aucune zone à 100 % | 112,4 % (120,5 %) | +27 | +301 | +307 | +73 |
| P8 | 60 % | 925 € | âge +2 ans ; sans création de valeur | 111,5 % (120,6 %) | +13 | +249 | +215 | −61 |

   t_max de 26,7 % (P1) à 6,7 % (P8) : à 60 % de taux plat, l'impôt continu ne sert presque plus (plafond de 75 % IS compris). Le cadre à 8 000 € perd à P8 : la progressivité est en grande partie remplacée par le taux plat. Les 31 Md€ d'économies (deux fois les revues de dépenses de 2025), la création de valeur (sauf P8), l'âge +2 ans et les transmissions à 50 % sont **tous** mobilisés (fragilité 3,25 à 3,75 sur 3,75) : avec les seuls leviers de A2 (18 Md€, sans valeur), il n'y a de point qu'avec la contribution dès 2 000 € et à partir de **46,5 %** (socle 645 €).
4. **Ce que perdent les retraités** (écart à la loi actuelle, pension nette, par mois) : **1 200 € : 0 €** et **2 000 € : 0 €** dans tous les points ; **2 500 € : 0 €** si la contribution commence à 2 500 €, **−150 €** si elle commence à 2 000 € (P1, P6) ; **3 000 € : −150 €** (−300 € à 2 000 €, contre −100 € au palier 1 de base) ; **3 500 € : −300 €** (P2, P4, P5, P7, P8 ; −250 € avec 25 % en P3), **−450 €** avec la contribution dès 2 000 € (P1, P6), contre −200 € au palier 1 de base. L'indexation sur les prix, présente dans toutes les combinaisons du § 18, laisse en outre les pensions de 1 200 / 2 000 / 3 500 € à −75 / −125 / −219 € par mois par rapport à la pension relative du COR en 2045 (c'est l'hypothèse H186, pas un coût de la piste).
5. **Aucune de ces combinaisons ne résiste à un aléa.** P4 : productivité de 0,4 % 196 %, taux de 4,5 % 141 %, socle sur les salaires 196 %, **réactions de comportement hautes 321 %**, cumul de H190 230 %. **L'âge est un point faible** : si l'effet de l'âge de départ est surestimé de 10 %, P4 monte à 120 % (non stable), de 20 % à 125 %, de 30 % à 130 % (H191 le juge probablement surestimé de 10 à 30 %). Frontière recalculée sous chaque aléa : taux de marché de 4,5 % : taux plat minimal **47,5 %** (socle 665 €) ; effet de l'âge ×0,8 : **42,5 %** (565 €) ; ×0,7 : 44 % (595 €) ; **productivité de 0,4 %, réactions hautes seules, socle indexé sur les salaires : aucun point** jusqu'à 60 % de taux plat et 1 000 € de socle.
6. **Lecture et réserves.** (a) Cette voie échange la contrainte de l'auteur sur l'âge contre un socle de 595 à 925 € ; elle est contraire à sa position, qui refuse d'allonger le temps de travail et de reculer l'âge de la retraite : **à lui de trancher**. (b) Un travail « plus obligatoire » avec un socle de 780 € est une phrase de la théorie, pas un résultat de ce modèle. **Précision du 01/11/2026 (point 7 ci-dessous)** : le modèle compte déjà, pour les déciles 1 à 9, la substitution (0,10), la participation (variation du taux effectif de participation) et l'effet revenu (propension à gagner moins de −0,15) ; ce qu'il ne compte pas, c'est le long terme, l'effet propre au second apporteur d'un couple et l'équilibre général (⚠️ non testé ; `sources/recherche-revenu-de-base-travail.md`). (c) Le taux plat de 52 à 60 % est élevé par rapport à tout ce que documente le § 18.1 ; la zone à 100 % persiste en P1 à P5 (124 à 595 € de revenu, tolérée jusqu'à 800 €) et n'est absente qu'en P7 et P8. (d) Les points sont **au bord** du critère (productivité requise de 0,69 à 0,70 % contre 0,7 % supposé) ; la marge est dans le § 8.4 du rapport. (e) La grille ne teste que le taux plat par demi-point et le socle par 5 € ; les autres limites du § 18.6 (pas de transition, aucune rétroaction sur la croissance) valent ici. (f) Le smicard garde 0 à +27 € **avec** un « avant » de 1 707 € estimé ⚠️ : la marge est de l'ordre de l'erreur de l'estimation.

7. **Offre de travail (revue de la recherche, option `offreTravail`, H202 et H203 ; `sources/recherche-revenu-de-base-travail.md`, `rapport_offre_travail.js`, `resultats-offre-travail.txt`).** Les expériences de transferts inconditionnels réduisent peu le travail (OpenResearch, 1 000 $/mois pendant 3 ans : −4,2 points de participation, −1,3 à −1,5 heure par semaine, élasticités −0,20 et −0,16 ; Alaska, casinos et Kenya : aucun effet sur l'emploi ; impôts négatifs : −4 points au plus, effet-revenu de −0,06 à −0,10) mais **aucune ne teste un transfert permanent de 56 % du Smic net financé par un taux de 52 %**, et le suivi long des impôts négatifs donne des effets plus grands que l'essai (−4,6 % d'emploi, −7,4 % de revenus, relayé). **Le modèle compte déjà** à 780 € et 52 % : −2,7 / −5,8 / −10,0 % des revenus d'activité D1-D9 (bas / central / haut), soit −27 / −62 / −114 Md€ de recettes et, au prorata, −0,3 à −0,7 / −0,7 à −1,4 / −1,2 à −2,4 million d'emplois équivalents (estimation) ; le central est du même ordre que la baisse mesurée à OpenResearch, le haut dépasse toute mesure lue. **Avec une baisse supplémentaire** des revenus D1-D9 de −2 / +1 / +3 points (proportionnelle au socle, choix de Claude ⚠️) : P4 passe de 114,9 % à **93,8 % / 125,4 % ✗ / 146,5 % ✗** ; elle **rompt dès +0,08 point** (P3 +0,23, P5 +0,28, P1 +0,04, P8 +0,06). **Un point de baisse du travail coûte 15 à 25 € de socle.** **La piste tient encore, sous une forme plus étroite** : frontière au central : taux plat minimal **41 %** (535 €) au lieu de 39 % (495 €), **785 €** à 52 % au lieu de 805 € (âge +2 ans, contribution dès 2 000 €, leviers au maximum ; 755-765 € sans elle) ; au haut : **15 points** seulement, taux plat de 49 à 54 %, 755 € à 52 % ; au bas : 835 € à 52 %. **P4 (780 € / 52 %) n'y survit pas au central** : le point de la frontière devient 755-765 € avec ses leviers. Le point le plus fragile est le **second apporteur** (taux de participation d'environ 14 % à 52 % pour un conjoint sans droit au RSA), pour lequel le modèle n'a qu'une fourchette d'élasticité (0,2 à 0,6 ; Carbonnier : 1 à 2, relayé ⚠️).

## 19. Rétroaction de la durée du chômage (01/11/2026, option `retroactionChomage` de `modele.js` et `retroChomage` de `palier1.js`, `rapport_chomage.js`, `resultats-chomage.txt`, `test_chomage.js` : 44 contrôles ; H204 à H220, methode.md § 21 ; sources : `sources/recherche-chomage-durees-elasticites.md`)

> Mandat (T47, file de travail, statut voie R du 01/11) : « durées et élasticité du chômage en France (Le Barbanchon, Unédic, Dares), variantes de chômage dans le simulateur ». **Option désactivée par défaut : aucun résultat des § 1 à 18 ne change.** Bas = réactions faibles, haut = réactions fortes. Md€ par an, + = rapporte à l'État.

### 19.1 Ce qu'il faut retenir (écrit pour être vrai)

1. **Les chiffres français existent et sont plus bas que l'hypothèse de la voie R.** 10 % d'allocation en moins raccourcit le chômage d'environ **2,5 à 3 %** (élasticité 0,25 à 0,3 : dégressivité évaluée par la Dares et l'Unédic en 2025, hypothèse retenue par le CAE en avril 2026, Le Barbanchon 2016 pour la durée des droits) ; la réforme du SJR donne 0,4 à 0,7 si on l'impute à la seule allocation. H94 prenait 0,5 au central, sans source collectée.
2. **Les durées** : 11 mois indemnisés en moyenne pour 19 mois de droits (droits interrompus en 2023, Unédic) ; après la réforme de 2023, 10 mois pour 15 (moins de 53 ans) ; 48,6 % des entrants retrouvent un emploi dans les six mois (France Travail, 2e trimestre 2025), 19,1 % un emploi durable. Le τ = 10 mois de H93 est du bon ordre.
3. **Au palier 1, la rétroaction rapporte +1,0 / +3,8 / +9,4 Md€** (bas / central / haut) : 68 000, **261 000** et 650 000 indemnisés de moins en moyenne. Solde central −163,3 → **−159,5 Md€** ; taux plat nécessaire 34,55 → **34,3 %** ; socle finançable à 35 % 513 → **522 €**. **Elle ne change pas l'ordre de grandeur du déficit.**
4. **Le central est à la borne.** Le complément dégressif et le socle (compté pour son seul effet de liquidité) font baisser la générosité conditionnelle de 45 % (r = 0,55) ; aucune étude française ne mesure plus de −30 % : le modèle s'arrête là (H211). Sans borne : +6,0 Md€. **C'est une extrapolation que le modèle refuse de faire.**
5. **Une part du gain est de l'emploi court** : la réforme du SJR n'a accéléré que la reprise de contrats de moins de 6 mois (comité d'évaluation 2025). La recette par emploi (10 257 € par an, V2974, impôt du palier 1 sur un salaire égal au salaire perdu) est donc un plafond.
6. **L'ancienne estimation hors solde (H94) était trop optimiste par emploi** : 25 k€ de recettes par personne (système actuel, cotisations comprises) au lieu de 10 k€ (impôt du palier 1), sans éviction ni effet de liquidité du socle.

### 19.2 Variantes de chômage (socle 500 €, structure du palier 1 : taux plat 35 %, t_max 30 %)

| Variante | Complément moyen (€/mois) | B1 = complément + 0,6 × socle | r brut → retenu | Bas : stock net, Md€ | Central : stock micro / net ; complément + recettes = Md€ | Haut : stock net, Md€ |
|---|---|---|---|---|---|---|
| Socle seul (assurance remplacée) | 0 | 300 | 0,25 → 0,70 (borné) | 68 k ; +0,7 | 348 k / 261 k ; 0,0 + 2,7 = **+2,7** | 650 k ; +6,7 |
| deg1 et **deg2** (palier 1) | 353 | 653 | 0,55 → 0,70 (borné) | 68 k ; +1,0 | 348 k / 261 k ; 1,1 + 2,7 = **+3,8** | 650 k ; +9,4 |
| deg3 | 466 | 766 | 0,65 → 0,70 (borné) | 59 k ; +0,9 | 348 k / 261 k ; 1,5 + 2,7 = **+4,1** | 650 k ; +10,3 |
| Allocation maintenue en différentiel | 680 | 980 | 0,83 | 17 k ; +0,3 | 188 k / 141 k ; 1,1 + 1,4 = **+2,6** | 548 k ; +10,1 |
| Allocation en plus du socle | 1 180 | 1 480 | 1,25 | −59 k ; −1,4 | −248 k / −186 k ; −2,6 − 1,9 = **−4,6** | −350 k ; −8,5 |

À 650 € : deg2 +0,9 / +3,6 / +9,1 ; différentiel +0,4 / +3,1 / +10,8 ; cumul −1,8 / −5,8 / −11,0 (`resultats-chomage.txt` § B). **Lecture** : (a) avec la borne, toutes les variantes dégressives et le socle seul donnent le même nombre de chômeurs en moins au central ; ce qui les distingue est le complément non versé (0 à 1,5 Md€) ; (b) le cumul (allocation en plus du socle) **allonge** le chômage : 186 000 indemnisés de plus au central, −4,6 Md€.

### 19.3 Sensibilité (palier 1, central, un paramètre à la fois ; `resultats-chomage.txt` § D)

| Variante | Stock évité net | Md€ |
|---|---|---|
| Central tel quel | 261 k | +3,8 |
| Sans borne, ou borne à −50 % | 414 k | +6,0 |
| λ = 1 (le socle compte comme une allocation) | 239 k | +3,5 |
| λ = 0 (borne atteinte de toute façon) | 261 k | +3,8 |
| Sans éviction / éviction 50 % | 348 k / 174 k | +5,0 / +2,5 |
| Sans effet sur les entrées (εE = 0) | 199 k | +2,9 |
| εD = 0,5 (médiane internationale du montant) | 379 k | +5,5 |

### 19.4 Objection (steelman) et réponse

- **Objection** : « Baisser l'assurance chômage pour faire retrouver un emploi plus vite, c'est faire payer les plus précaires ; l'économie budgétaire se paie en chute de consommation, et l'emploi retrouvé est court. » **C'est en partie juste** : le CAE (n° 90) mesure les plus fortes chutes de consommation chez les précaires et à l'épuisement des droits ; la réforme du SJR n'a produit que de l'emploi court. **Réponse** : le palier 1 garde un complément dégressif (deg2) et le plancher RSA ; la rétroaction n'est qu'une option chiffrée, pas un argument de vente ; et elle rapporte peu (3,8 Md€) au regard de ce qu'elle coûte à ceux qui la subissent. La justification d'un complément dégressif doit venir de la lisibilité et de l'équité du système, pas de ce gain.
- **Contrainte juridique** : l'assurance chômage est aujourd'hui fixée par les partenaires sociaux ou, à défaut, par décret (code du travail, art. L. 5422-20 et suivants ⚠️ à vérifier) ; la remplacer par un complément d'État change sa gouvernance, pas seulement ses paramètres.

### 19.5 Faut-il l'inclure dans le solde par défaut ?

**Recommandation (Claude)** : oui, à terme, en `'scenario'` (bas avec bas, central avec central), parce que le modèle compte déjà les réactions des assiettes et qu'oublier celle-ci biaise le palier 1 vers le pessimisme d'environ 4 Md€. **Pas maintenant** : les résultats des § 13 à 18 sont figés pour comparaison, et l'éviction (H209) comme la qualité de l'emploi (H220) restent des choix de Claude. Décision à prendre par l'auteur.

## 20. Capitalisation progressive avec les cohortes réelles : démographie Insee-COR, épargne nationale et taux (01/11/2026, `capitalisation_cohortes.js`, `trajectoires_capi_cohortes.js`, `rapport_capitalisation_cohortes.js`, `resultats-capitalisation-cohortes.txt` (fait foi), `test_capitalisation_cohortes.js` : 61 contrôles au vert ; H221 à H242, methode.md § 22 ; V2980-V2989, V3050-V3055)

Variante en option du § 14 : mêmes 3 points (φ_max = 3, +1 point tous les 3 ans, dès 2027), mais avec les cohortes de `prospective-demographie` (Insee 2026, emploi calé sur le COR : 1,76 cotisant par retraité en 2025, 1,27 en 2070 dans le central) au lieu de 40 générations égales et d'une rente de 22 ans. Conversion en rente à 64 ans. Euros constants de 2025. Ordres de grandeur conditionnels, jamais des prédictions. Reproduction : `jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js trajectoires_demo.js demographie.js ../retraites/capitalisation.js capitalisation.js trajectoires_capi_cohortes.js capitalisation_cohortes.js rapport_capitalisation_cohortes.js` (depuis `modeles/systeme-ideal/`).

### 20.1 Ce qu'il faut retenir (écrit pour être vrai)

1. **Les vraies cohortes rendent la transition un peu plus chère, pas moins.** Central, 3 points, financement par la dette : pic de **47 Md€** en 2038 (45 en stylisé), dette de transition **1 127 Md€ en 2050** (1 063) et **2 234 Md€ en 2070, 61 % du PIB** (2 053, 52 %). La raison principale : on vit plus longtemps que 22 ans après 64 ans (24 ans pour la cohorte qui part en 2030, 26 pour celle de 2067), donc les pensions de répartition évitées arrivent plus lentement.
2. **Le vieillissement raccourcit un peu le double paiement.** Plus il y a de retraités par cotisant, plus vite les pensions évitées rattrapent les cotisations détournées : la double charge passe sous 0,1 % du PIB vers **2081** (central ; 2079 en population âgée, 2085 en population jeune ; stylisé : 2081) et devient négative vers **2086** (stylisé : 2094). **Durée du double paiement : environ 55 à 60 ans** dans le central et la population âgée ; c'est plus d'une génération d'actifs qui paie deux fois.
3. **Mais le poids relatif est plus lourd quand la population vieillit** : la dette de transition atteint 67 % du PIB en 2070 avec la population âgée (90 % si le rendement est aussi bas), contre 57 % avec la population jeune, parce que le PIB croît moins.
4. **Sur le palier 1** (base « démographie », la plus cohérente) : socle **549 → 412 €** en 2050 et **490 → 361 €** en 2070, solde **−143 → −201 Md€** (2050) et **−167 → −217 Md€** (2070). Avec la population âgée, le socle tombe à **0 en 2070** (82 € sans capitalisation). Par rapport aux trois points du § 14 (base palier 1, stylisé) : socle 451 / 432 / 493 € à 5 / 10 / 20 ans → **450 / 427 / 482 €** ; solde −179 / −183 / −164 → **−180 / −185 / −169 Md€** ; dette 106 / 331 / 850 → **108 / 341 / 895 Md€**. Les ordres de grandeur du § 14 tiennent ; l'écart grandit avec le temps.
5. **Épargne nationale : financée par la dette, la transition n'augmente presque pas l'épargne.** Le fonds épargne ce que l'État emprunte (2030 : fonds +33, administrations −31 Md€). Avec un déplacement de 20 % de l'épargne volontaire (Chetty et al. 2014), l'épargne nationale **baisse** au début (−4 Md€ en 2030), puis monte de 0,3 % du PIB en 2070, quand le rendement du fonds dépasse le taux de la dette. Avec un déplacement de 75 % (Attanasio-Rohwedder), elle baisse toute la période (−0,5 % du PIB en 2070). **Financée par prélèvement**, elle monte vraiment : **+1,5 à +2 % du PIB** de 2040 à 2070 (central), parce que les actifs paient alors la transition.
6. **Le point faible est le taux d'intérêt.** Si chaque point de dette de transition / PIB relève le taux de 2 pb (la moitié de l'estimation américaine de Laubach dans sa version de travail de 2003 ; la version publiée de 2009 donne 3 à 4 pb, V2982), le taux de la dette de transition passe de 1,5 à 3 % en 2070, la dette de transition à **2 759 Md€ (76 % du PIB)**, le surcoût sur la dette existante à 39 Md€ par an, et le socle de 2070 à **139 €** au lieu de 361. À 4,5 pb, la dette s'emballe (108 % du PIB, socle 0) : c'est un stress, mais il dit que **le financement par la dette n'est soutenable que si les marchés traitent la dette de transition comme ce qu'elle est (une dette implicite rendue explicite, adossée à un actif)**, ce qui n'est pas acquis.
7. **Frais** : à 1 % par an au lieu de 0,21 %, le rendement net tombe à 2,7 %, le fonds de 2070 perd 400 Md€ et le gain des retraités en 2070 baisse d'un tiers (48 → 31 Md€) ; la double charge, elle, ne change pas (elle ne dépend pas du rendement). Un fonds public à frais très bas (0,05 %, type NBIM) ajoute peu (+4 Md€ de gain en 2070). **Mais 1 % est une borne basse du détail** (V2984) : une unité de compte vendue au détail coûte en 2025 environ 2,5 % par an (0,88 % de contrat + 1,60 % de fonds, France Assureurs) ; à ce niveau, le fonds de 2070 est de 2 012 Md€ (au lieu de 3 041) et le gain des retraités en 2070 tombe à 7 Md€ au lieu de 48 (§ 20.5).

### 20.2 Double charge et dette (central, rendement central, dette)

| année | versé au fonds | pensions de répartition évitées | double charge | dette de transition | dette / PIB | fonds | double charge stylisée | dette stylisée |
|---|---|---|---|---|---|---|---|---|
| 2030 | 30 | 0 | 30 | 76 | 2,4 % | 81 | 30 | 75 |
| 2040 | 49 | 2 | 47 | 555 | 16,3 % | 634 | 44 | 534 |
| 2050 | 51 | 9 | 42 | 1 127 | 31,8 % | 1 392 | 38 | 1 063 |
| 2060 | 52 | 21 | 32 | 1 702 | 47,1 % | 2 240 | 27 | 1 580 |
| 2070 | 53 | 36 | 17 | 2 234 | 61,3 % | 3 041 | 15 | 2 053 |

Points capitalisés (central, base démographie) : 1 point : dette 2070 786 Md€ (22 % du PIB), socle 2070 490 → 449 € ; 6 points : 4 044 Md€ (111 %), socle 490 → 217 €.

### 20.3 Épargne et taux (central)

| hypothèses | δ | β (pb / point) | épargne nationale 2030 / 2050 / 2070 (Md€), dette | idem, prélèvement | dette de transition 2070 avec effet de taux | socle 2070 avec effet de taux |
|---|---|---|---|---|---|---|
| bas | 0 | 0 | +2 / +23 / +22 | +29 / +77 / +70 | 2 234 Md€ | 361 € |
| central | 0,2 | 2 | −4 / +13 / +12 | +23 / +66 / +59 | 2 759 Md€ | 139 € |
| haut | 0,75 | 4,5 | −21 / −15 / −18 | +7 / +38 / +30 | 3 934 Md€ | 0 € |

Rendement de référence : le central de 3,5 % réel net (H24) est dans le haut de ce qu'observe l'OCDE sur longue période (≈ 4 % ou plus sur 20 ans au Canada et en Australie, proche de 0 dans quelques pays d'Europe centrale et baltes ; PMiF 2025) et sous le fonds norvégien (4,3 % réel net de 1998 à 2025).

### 20.4 Recommandation et objection

**Recommandation (opinion de Claude)** : garder la variante stylisée dans le simulateur (les écarts sont de 1 à 5 % à 20 ans), mais citer désormais la version cohortes pour tout chiffre au-delà de 2040 ; et **ne pas présenter la capitalisation financée par la dette comme une hausse de l'épargne** : elle ne l'est qu'en prélèvement, c'est-à-dire si les actifs d'aujourd'hui paient. **Objection (steelman)** : « La dette de transition ne fait que rendre visible une dette implicite qui existe déjà (les droits de retraite promis) ; les marchés le savent, β est nul. » **Réponse** : c'est le scénario bas, et il est défendable ; mais les règles budgétaires européennes et les agences de notation comptent la dette brute au sens de Maastricht, pas la dette implicite, et la France n'a pas de marge de crédibilité à 116 % du PIB : il faut le traiter comme un risque, pas comme une certitude.

Limites : methode.md § 22 (âge de conversion unique, survie figée après 2070, pas de boucle épargne → croissance, effet de taux linéaire transposé des États-Unis et des panels avancés, aucune étude sur une dette adossée à un actif ; V2984-V2988 levées le 01/11/2026, V3050-V3055).

### 20.5 Effet de taux et frais : ce que disent les études, appliqué à la dette de transition (01/11/2026, H241-H242, V3050-V3055)

**Ce que les études établissent** (méthode : H241). Sensibilité du taux long à la dette publique, en points de base (pb) par point de dette / PIB : États-Unis 3-4 pb (Laubach 2009, dette projetée) ; panels de pays avancés **0,6 à 5 pb, autour de 2 pb** (Poghosyan 2012, Kinoshita 2006, Baldacci-Kumar 2010) ; **zone euro dans son ensemble 3 à 7 pb** (deux valeurs de Faini, de seconde main et non lues à la source : environ 3 pb pour Faini 2006 selon Poghosyan ; 5-7 pb pour « Faini 2004 » selon Kinoshita, probablement une version de travail du même article ; le résumé de l'article publié, seul lu le 02/11/2026, ne donne pas de chiffre : V3078). Trois nuances qui jouent dans le sens du risque ou de la prudence : (1) **l'effet est plus fort quand la dette de départ est élevée** (Ardagna et al., Baldacci-Kumar) : la France part de 116 % du PIB ; (2) **dans la zone euro, l'écart propre à un pays est faible ou nul tant que les marchés sont calmes** (Poghosyan : ≈ 0,5 pb après l'euro ; Afonso et al. : dette non significative dans les écarts 1999-2010, significative à partir de mars 2009) et réapparaît dans la tension ; (3) **les effets de zone et de pays se distinguent** : une dette qui monte dans un pays déplace son écart, une dette qui monte partout déplace le taux de référence (Paesani et al. : débordements). Ce que les études **ne disent pas** : l'effet d'une dette de transition adossée à un actif (un fonds), ni l'effet linéaire au-delà de 100 % du PIB.

| scénario | β (pb par point) | lecture | dette de transition 2070 | taux de la dette 2070 | surcoût sur la dette existante 2070 | socle 2070 (sans → avec) | solde 2070 (sans → avec) |
|---|---|---|---|---|---|---|---|
| bas | 0 | marchés voient la dette implicite devenir explicite | 2 234 Md€ (61 %) | 1,50 % | 0 | 490 → 361 € | −167 → −217 Md€ |
| pays seul, temps calme | 1 | bas des panels, écart français faible | 2 468 Md€ (68 %) | 2,16 % | 18 Md€ | 490 → 264 € | −167 → −254 Md€ |
| **central** | **2** | Poghosyan, Kinoshita (simulé) | **2 759 Md€ (76 %)** | **2,96 %** | **39 Md€** | **490 → 139 €** | **−167 → −302 Md€** |
| Laubach publié, zone euro | 3,5 | Laubach 3-4 ; Faini 3 | 3 360 Md€ (92 %) | 4,57 % | 78 Md€ | 490 → 0 € | −167 → −408 Md€ |
| stress zone entière | 6 | Faini 2004 (5-7) | 5 282 Md€ (145 %) | 9,42 % | 177 Md€ | 490 → 0 € | −167 → −815 Md€ |

Démographie centrale, rendement central, financement par la dette, base démographie, 3 points. Le modèle applique β au taux de la dette de transition dès l'année (H233) et rejoint la dette existante au rythme de la maturité (H234). En dehors de β ∈ {0 ; 1 ; 2}, le raisonnement dit plutôt un ordre de grandeur de l'emballement qu'une valeur : à partir de 3 pb, le socle est à zéro et la dette passe dans une zone où la linéarité des études ne vaut plus.

**Lecture (écrite pour être vrai).** (1) **Le central de 2 pb est au milieu des études sur les pays avancés, et en dessous de celles sur la zone euro prise dans son ensemble** (3 à 7 pb) : le prendre comme central est défendable pour un pays qui ferait seul la transition en temps calme, **pas pour une transition menée par toute la zone**, qui est au moins à 3 pb. (2) **Au niveau de Laubach publié (3-4 pb), la transition financée par la dette n'est plus finançable** : dette de transition de 86 à 92 % du PIB en 2070, socle à zéro. (3) **Le résultat dépend moins de la valeur exacte que du seuil** : la dette de transition passe de 68 à 92 % du PIB quand β passe de 1 à 3,5 pb, soit un facteur 1,35 ; le surcoût sur la dette existante est multiplié par 4. (4) **L'effet pays seul est plus faible mais pas nul, et il se retourne en tension** (mars 2009) : c'est exactement le moment où une dette de transition de 60 % du PIB serait lue. (5) **Opinion de Claude** : ne pas présenter la capitalisation financée par la dette sans la mettre en parallèle d'un financement par prélèvement (§ 20.1 point 5), qui évite l'effet de taux sur le stock, et la présenter comme une variante à effet de taux contrôlé : plafond de dette de transition, paliers de points, revue annuelle.

**Frais de détail (V2984, H242).** Sensibilité centrale, démographie centrale :

| frais | rendement net | fonds 2070 | gain des retraités 2070 | dette 2070 |
|---|---|---|---|---|
| 0,05 % (NBIM) | 3,66 % | 3 135 Md€ | 52 Md€ | 2 234 Md€ |
| 0,21 % (Suède, central) | 3,50 % | 3 041 Md€ | 48 Md€ | 2 234 Md€ |
| 1 % (contrat d'assurance vie seul) | 2,71 % | 2 625 Md€ | 31 Md€ | 2 234 Md€ |
| **2,5 % (UC de détail : contrat 0,88 % + fonds 1,60 %)** | **1,21 %** | **2 012 Md€** | **7 Md€** | 2 234 Md€ |

La dette ne change pas (elle ne dépend pas du rendement) ; c'est le gain des retraités qui s'effondre. Un fonds public à bas coût est donc une condition de la variante, pas un détail. Source : France Assureurs 2025, relayé par la presse (étude primaire non lue).

**Objection (steelman)** : « Les études sont américaines ou antérieures à 2012 ; la BCE ancre les taux de la zone ; β est proche de 0 en zone euro. » **Réponse** : c'est vrai du pays seul en temps calme (Poghosyan, Afonso), et c'est le scénario bas ou 1 pb ; mais cet effet disparaît dans la crise de 2009-2012, et l'ancrage monétaire n'est pas inscrit dans le modèle. Aucune étude lue ne mesure l'effet de la dette de transition d'une réforme des retraites sur les taux d'un pays de la zone euro : c'est le manque principal.



## 21. Fiscalité du patrimoine immobilier : plus-value réelle à 50 %, fin des DMTO, report des pertes (02/11/2026, T56) (`patrimoine_immobilier.js`, `rapport_patrimoine_immobilier.js`, `resultats-patrimoine-immobilier.txt` (fait foi), `test_patrimoine_immobilier.js` : 131 contrôles au vert ; H243 à H265, methode.md § 23 ; V4270-V4284)

Ordres de grandeur, jamais des prédictions. « bas » = hypothèses les moins favorables au solde public, « haut » = les plus favorables. Les chiffres sont en Md€ de 2025 par an en régime de croisière ; la plus-value n'est pas observée (DVF ne donne pas le prix d'achat d'origine), elle est estimée (methode.md § 23).

> **Mise à jour du 03/11/2026 : élasticité 0,5/1,0/2,0 adoptée** (H252, avant 0,8 / 0,5 / 0,3). Les tableaux et le texte de ce § 21 et du § 23 ont été **recalculés le 04/11/2026** avec cette fourchette (`resultats-patrimoine-immobilier.txt` fait foi ; relecture T56 : `sources/elasticites-patrimoine-relecture.md`). Au central : solde net −14,1 Md€/an (avant −13,6), recettes de plus-values 5,9 (6,5), report 10 ans 0,9 (1,0), delta intégré au palier 1 −14,1 → solde −177,5 (−176,9), taux plat requis 35,7 %. Bas : −23,9 (inchangé) ; haut : −3,8 (avant −2,7). Le solde du palier 1 de référence (−163,3) ne bouge pas.

### 21.0 Ce qu'il faut retenir (écrit pour être vrai)

1. **Les plus-values ne remplacent pas les DMTO.** Solde net (recettes nouvelles de plus-values − DMTO perdus − coût du report à 10 ans) : **−14,1 Md€/an au centre, de −23,9 à −3,8**. Les recettes nouvelles couvrent 0 % (bas), 18 % (central) et 74 % (haut) des DMTO perdus (20,1 / 16,1 / 13,5 Md€).
2. **Le prélèvement de 50 % sur le gain réel rapporte plus que le droit actuel** (centre : 5,9 Md€ contre 3,0 estimés, 3,6 observés en 2023), parce qu'il supprime les abattements pour durée (4,8 Md€ de manque à gagner en 2022 selon une fiche de lecture tierce, V4271) ; mais **dans le scénario bas il rapporte à peine plus qu'aujourd'hui** (1,1 contre 1,0) : si les prix réels stagnent et que les frais (7,5 % d'acquisition en transition, 5 % de vente) consomment le gain, le gain réel taxable est faible. L'impôt est très sensible à la dérive des prix : −18,4 Md€ de solde à 1 % par an, −12,8 à 4 % (central).
3. **Le report des pertes coûte peu en régime normal** (central : 0,6 Md€/an à 5 ans, 0,9 à 10 ans, 1,5 sans limite ; bas : 2,6 / 3,8 / 4,9) mais **il pèse beaucoup plus s'il s'étend à la résidence principale** (central : 5,2 Md€/an sans limite) : à exclure, sinon on exonère les gains et on rembourse les pertes.
4. **Krach de −20 % (une année)** : au centre, 4,9 Md€ de crédits créés (3,0 de plus qu'une année normale), la recette de plus-values de l'année tombe de 5,9 à 2,1 Md€ ; coût ultime du surcroît de crédits 0,9 / 1,4 / 2,2 Md€ (5 ans / 10 ans / sans limite). Trois années de krach de suite : surcroît de 8,9 Md€ de crédits au centre, 12,9 au bas. La vraie difficulté n'est pas le coût des crédits mais **la chute de la recette** : l'impôt est cyclique, les DMTO l'étaient aussi (19,7 → 13,5 Md€ de 2021 à 2024).
5. **Comportement** (central) : +41 % de ventes (305 000 de plus par an), prix +2,9 %, coût total d'acquisition −2,7 % (les DMTO baissent de 5,8 points, une partie se capitalise dans les prix). Cette hausse repose sur une élasticité de 7 % par point tirée de l'Allemagne, **extrapolée de 1 à 5,8 points, hors de la plage des études** (V4276). Le verrouillage par un taux de 50 % retire 29 % des ventes gagnantes hors résidence principale au central (élasticité de réalisation 1,0 ; 21 % au haut avec 0,5 ; V4277).
6. **Compensation** : la hausse de taxe foncière équivalente est de **+38 %** pour les seuls DMTO (16,1 Md€ sur 41,96 Md€), +34 % une fois les plus-values nouvelles déduites ; elle est hors système idéal (la taxe foncière y est supprimée, H33). Intégré au palier 1 central, le delta de −14,1 Md€ demande **+0,7 point de taux plat** (35,7 % au lieu de 35 %) pour garder le déficit actuel ; +1,4 point dans le scénario bas, −0,2 dans le haut.
7. **Départements** : ≈ 77,5 % des DMTO (12,5 Md€ au centre), calculés avec les taux légaux, donc 12,5 Md€ de ressources à remplacer par une dotation ou une autre ressource ; les plus-values vont à l'État (IR) : le transfert n'est pas automatique.

### 21.A.  Volumes (DVF 2024, hors Alsace-Moselle et Mayotte)
| indicateur | valeur |
|---|---|
| ventes de logement ancien | 749583 (appartements 329744, maisons 417671) |
| valeur | 185,2 Md€ ; prix moyen 247093 € |
| DMTO théoriques à 5,81 % de cette valeur | 10,8 Md€ (total 2024 : 13,5 Md€ ; le reste = terrains, locaux, Alsace-Moselle) |
| tranche 0 à 100 k€ | 147868 ventes, 9,8 Md€ |
| tranche 100 à 200 k€ | 266232 ventes, 39,2 Md€ |
| tranche 200 à 300 k€ | 163884 ventes, 39,8 Md€ |
| tranche 300 à 500 k€ | 113791 ventes, 42,5 Md€ |
| tranche 500 à ∞ k€ | 57808 ventes, 54,0 Md€ |
| Isère 2024 | 14060 ventes (1,9 % du national) |
| reventes appariées Isère 2021-2025 | 3215 paires, durée moyenne 2,3 an, 40,3 % à perte réelle ; dispersion IQR/1,349 : 0,27 / 0,22 / 0,16 / 0,17 / 0,17 selon la durée (0,25-1, 1-2, 2-3, 3-4, 4-5 ans) |

### 21.B.  Hypothèses par scénario (« bas » = le moins favorable au solde public)
| paramètre | bas | central | haut |
|---|---|---|---|
| DMTO perdus (Md€) | 20,1 | 16,1 | 13,5 |
| part des ventes hors résidence principale | 0,25 | 0,33 | 0,38 |
| durée moyenne de détention (ans) | 9 | 12 | 15 |
| dérive réelle des prix (par an) | 0,01 | 0,03 | 0,04 |
| frais de vente du vendeur | 0,05 | 0,04 | 0,03 |
| travaux justifiés par an | 0,006 | 0,004 | 0,002 |
| hausse des ventes par point de DMTO supprimé | 0,03 | 0,07 | 0,1 |
| part du DMTO capitalisée dans les prix | 0,2 | 0,5 | 0,8 |
| élasticité de réalisation des plus-values | 2 | 1 | 0,5 |
| part des crédits finalement imputable | 0,9 | 0,75 | 0,6 |
| probabilité annuelle d'imputation | 0,15 | 0,1 | 0,06 |
| majoration des crédits (pertes fabriquées) | 0,15 | 0,05 | 0 |

### 21.C.  Plus-values immobilières (Md€/an ; frais d'acquisition : régime de transition 7,5 %, puis croisière 2,5 %)
| scénario | recettes actuelles estimées | recettes à 50 % (transition) | recettes nouvelles | recettes à 50 % (croisière) | taux effectif sur gain réel | part de ventes gagnantes | gain réel / vente | perte réelle / vente |
|---|---|---|---|---|---|---|---|---|
| bas | 1,01 | 1,06 | +0,05 | 1,28 | 50,0 % | 31,0 % | 3,9 % | 17,3 % |
| central | 2,98 | 5,86 | +2,89 | 6,32 | 50,0 % | 68,8 % | 16,6 % | 5,3 % |
| haut | 4,38 | 14,40 | +10,02 | 15,31 | 50,0 % | 84,7 % | 30,0 % | 2,2 % |
Contrôle : le droit actuel central donne 2,98 Md€ pour 3,6 Md€ observés en 2023 (82,7 %).

### 21.D.  Perte des droits de mutation et compensation (T = 10 ans, transition)
| scénario | DMTO perdus | dont départements | dont communes | dont État (frais d'assiette) | recettes nouvelles de plus-values | coût du report | solde net | couverture des DMTO par les plus-values | taxe foncière : hausse pour tout compenser | hausse pour les seuls DMTO |
|---|---|---|---|---|---|---|---|---|---|---|
| bas | 20,1 | 15,6 | 4,2 | 0,37 | +0,0 | −3,82 | −23,9 | 0,2 % | +57 % | +48 % |
| central | 16,1 | 12,5 | 3,3 | 0,30 | +2,9 | −0,92 | −14,1 | 17,9 % | +34 % | +38 % |
| haut | 13,5 | 10,5 | 2,8 | 0,25 | +10,0 | −0,29 | −3,8 | 74,2 % | +9 % | +32 % |

Solde « brut » (si le modèle a déjà retiré les recettes actuelles de plus-values avec l'IR et les prélèvements sociaux) : bas −22,9, central −11,2, haut +0,6 Md€/an.
Solde en régime de croisière (frais d'acquisition 2,5 %) : bas −22,6, central −13,4, haut −2,8 Md€/an.

### 21.E.  Report des pertes : coût annuel en régime de croisière (Md€/an)
| scénario | crédits créés par an | coût à 5 ans | coût à 10 ans | coût sans limite | coût sans limite si crédit aussi sur la résidence principale |
|---|---|---|---|---|---|
| bas | 5,47 | 2,60 | 3,82 | 4,92 | 19,65 |
| central | 1,95 | 0,58 | 0,92 | 1,46 | 5,18 |
| haut | 1,07 | 0,17 | 0,29 | 0,64 | 2,29 |

### 21.F.  Krach : prix −20 %, ventes × 0,75, une année (Md€)
| scénario | part de ventes à perte | crédits créés | surcroît vs année normale | recettes de plus-values perdues | coût ultime à 5 ans | à 10 ans | sans limite | crédits en années de recettes normales | surcroît sur trois années |
|---|---|---|---|---|---|---|---|---|---|
| bas | 93,0 % | 9,8 | 4,3 | 0,9 | 2,0 | 3,0 | 3,9 | 9,2 | 12,9 |
| central | 61,5 % | 4,9 | 3,0 | 3,8 | 0,9 | 1,4 | 2,2 | 0,8 | 8,9 |
| haut | 37,2 % | 3,2 | 2,2 | 7,4 | 0,3 | 0,6 | 1,3 | 0,2 | 6,5 |

### 21.G.  Effets de comportement
| scénario | hausse du volume de ventes | ventes supplémentaires par an | élasticité de réalisation → ventes gagnantes hors RP | prix | coût total d'acquisition |
|---|---|---|---|---|---|
| bas | +17,4 % | 130577 | ×1,00 (taux actuel moyen sur le gain réel 56,9 % → 50 %) | +1,2 % | −4,4 % |
| central | +40,6 % | 304680 | ×0,71 (taux actuel moyen sur le gain réel 29,4 % → 50 %) | +2,9 % | −2,7 % |
| haut | +58,1 % | 435257 | ×0,79 (taux actuel moyen sur le gain réel 20,8 % → 50 %) | +4,6 % | −1,1 % |

### 21.H.  Intégration au système idéal (palier 1 central : solde −163,3 Md€, taux plat 35 %, déficit actuel −169,1 Md€)
| scénario patrimoine | delta (net) | solde avec patrimoine | taux plat requis | points de plus | delta (brut) | taux plat requis (brut) | points de plus (brut) |
|---|---|---|---|---|---|---|---|
| bas | −23,9 | −187,2 | 36,4 % | +1,44 | −22,9 | 36,4 % | +1,36 |
| central | −14,1 | −177,5 | 35,7 % | +0,66 | −11,2 | 35,4 % | +0,42 |
| haut | −3,8 | −167,1 | 34,8 % | −0,16 | +0,6 | 34,5 % | −0,50 |

### 21.I.  Sensibilité du scénario central (solde net, Md€/an, T = 10 ans), un paramètre à la fois
| paramètre | valeur basse → solde | valeur haute → solde |
|---|---|---|
| dérive réelle des prix | 0,01 → −18,4 | 0,04 → −12,8 |
| part hors résidence principale | 0,25 → −14,6 | 0,4 → −13,7 |
| durée de détention | 8 → −15,7 | 16 → −12,7 |
| élasticité aux DMTO | 0,03 → −15,0 | 0,136 → −12,8 |
| élasticité de réalisation | 0 → −12,9 | 1 → −14,1 |
| absorption des crédits | 0,5 → −13,8 | 1 → −14,4 |
| frais de vente | 0,02 → −13,8 | 0,06 → −14,4 |
| travaux justifiés par an | 0 → −13,4 | 0,01 → −15,2 |
| dispersion sigma0 | 0,10 → −13,9 | 0,25 → −14,5 |

**Lecture des tableaux.** (C) : « recettes actuelles estimées » = droit en vigueur recalculé avec la même grille ; « recettes nouvelles » = réforme − actuel. (D) : le solde « net » garde les recettes actuelles de plus-values dans la base du modèle (conservateur) ; le « brut » suppose qu'elles ont été retirées avec l'IR (le modèle du palier 1 ne détaille pas la part des plus-values dans l'IR supprimé : à vérifier). (E) : crédits créés = 50 % × pertes réelles × majoration de fraude. (F) : « coût ultime » borné par la capacité d'imputation (T années de recettes normales). (H) : palier 1 central croisé avec les trois scénarios patrimoine.

**Suite.** Le volet individuel est fait au § 22 (`simulations/ma-situation-patrimoine.js`) ; il n'est pas encore branché sur `ma-situation.html` ; microdonnées DGFiP (2048-IMM) pour la part hors résidence principale, la durée de détention et la capacité d'imputation ; séries Insee-Notaires pour la dérive ; relecture des études d'élasticité (V3945, V4276, V4277).

## 22. « Ma situation » : ce que paie un foyer, aujourd'hui et dans le système idéal, sur le patrimoine immobilier (03/11/2026, T56) (`simulations/ma-situation-patrimoine.js`, `test_ma_situation_patrimoine.js` : 106 contrôles au vert ; H266 à H278, methode.md § 24 ; V5160-V5169)
Cas types (€, ordres de grandeur ; aucun cas ne décrit une personne réelle). « Aujourd'hui » : barèmes 2026 de la loi exécutable ; « idéal » : 50 % du gain réel, plus de DMTO, crédit de 50 % sur les moins-values.
- **Muté pour son travail, revend vite sa RP (3 ans, gain nominal positif) et rachète 260 000 €** : aujourd'hui ≈ 15 100 € de DMTO, rien sur la plus-value (exonérée) ; idéal 0 €, **économie ≈ 15 100 €** (≈ 15 120 à 15 190 € avec l'effet prix, selon la capitalisation). Le même foyer sans justificatif de mutation paie 50 % du gain réel (règle « 5 ans »).
- **Même profil, vente à perte (285 000 € contre 300 000 €, frais 22 500 €)** : économie ≈ 18 000 € de DMTO (17 300 à 17 700 € avec l'effet prix) ; la perte n'ouvre aucun crédit tant que la RP est exonérée (H277), ce qui est l'asymétrie à trancher.
- **Locatif vendu après 10 ans (200 000 → 400 000 €)** : aujourd'hui 48 181 € (identique à `plus_values.py`), idéal ≈ 68 955 € : **+ 20 800 €**.
- **Locatif détenu 30 ans (60 000 → 300 000 €)** : aujourd'hui 0 €, idéal ≈ 91 600 € : le « détenteur long » est le grand perdant, voulu par l'auteur.
- **Locatif vendu à perte après 5 ans** : 0 € aujourd'hui, crédit nominal ≈ 37 000 € ; valeur espérée selon la durée de report (≈ 75 % au maximum au central).
- **Loyers de 12 000 €, salarié à la tranche de 30 %** : micro-foncier aujourd'hui ; idéal 50 % de la base nette : plus lourd. À haut revenu (tranche 41-45 % + 17,2 %), l'écart se réduit.
- **Neuf à la TVA** : DMTO ≈ 2 000 € seulement ; l'effet prix (H251) peut dépasser le gain.
**Lecture.** Le système idéal est favorable à celui qui bouge et rachète (DMTO supprimés) et défavorable à celui qui détient longtemps ou revend un locatif : c'est le sens de la décision du 02/11, et le simulateur le montre en euros. L'effet prix (20 / 50 / 80 % de la capitalisation) réduit le gain de l'acheteur et augmente celui du vendeur ; il est affiché à part. Les gagnants et perdants sont des conséquences du modèle, pas des prédictions.

## 23. Variantes contre le verrouillage (03/11/2026, T56) (`patrimoine_immobilier.js` : `comparerVariantes` ; `rapport_patrimoine_immobilier.js` section L, `resultats-patrimoine-immobilier.txt` ; `test_patrimoine_immobilier.js` : 202 contrôles, `test_ma_situation_patrimoine.js` : 136 ; H279 à H287, methode.md § 25 ; V5250-V5262)
**À lire d'abord.** Le défaut reste 50 % du gain réel sans abattement (position de l'auteur). Les trois variantes (dégressif à la suisse, locatif exonéré après N ans, report en cas de réinvestissement) servent à comparer, elles ne décident rien. Tout est ⚠️ : élasticités de mémoire ou de seconde main, paramètres du report sans source (V5250 à V5262). Chiffres en Md€ de 2025 par an, régime de transition (frais d'acquisition de 7,5 %), solde net = recettes nouvelles de plus-values − DMTO perdus − coût du report des pertes (10 ans, inchangé).

**Ce que disent les tableaux.**
1. **Aucune variante ne rapporte autant que le défaut**, aux élasticités de la littérature. Au central : dégressif −0,9 à −2,4 Md€/an selon la pente ; locatif exonéré après 5, 10, 22 ans : −3,3 ; −2,7 ; −1,0 ; report : −0,6. Au haut, les écarts montent (−0,6 à −8,4), parce que le défaut y rapporte 14,4 Md€ de plus-values.
2. **Le verrouillage du défaut est réel mais son coût budgétaire est faible** : 29 % des ventes gagnantes hors résidence principale ne se font pas au central (21 % au haut), soit 1,5 Md€ de recettes perdues (3,0 au haut). Les variantes le réduisent (dégressif à 4 % : 12 % ; report : 7 % ; exonération après 10 ans : 18 %), mais gagnent moins en recettes de verrouillage évité qu'elles n'en perdent en taux. En scénario bas, le verrouillage est nul par construction : l'impôt actuel moyen sur le gain réel y dépasse déjà 50 % (V5260).
3. **Le report est le meilleur compromis entre recettes et verrouillage** : il garde le verrouillage au plus bas (7 % au central) pour −0,6 Md€ ; mais sa première année rapporte moins (3,5 contre 5,2 Md€ au central en croisière et 5,9 pour le défaut), le surcoût de transition étant le prix d'un recouvrement différé (15 ans) et partiel (φ, V5254).
4. **Quand une variante vaut mieux que le défaut, en recettes ?** Seulement si l'élasticité de réalisation est élevée : environ 1,75 pour le report et 5,05 pour le dégressif à 4 % (au central) ; jamais dans la plage 0 à 10 pour l'exonération après 10 ou 22 ans. La plage retenue (0,5 / 1,0 / 2,0 depuis le 03/11) place le central sous ces seuils ; seul le scénario bas (2,0) les dépasse, mais le verrouillage y est nul par construction ; la littérature française (Levy, 2021) n'a pas été lue, et c'est le point à vérifier d'abord (V5250).
5. **Limite de lecture** : le solde budgétaire n'est pas le seul critère. Les logements qui ne se libèrent pas, l'évitement (sociétés, démembrement, donation avant vente) et la mobilité ne sont pas dans ces chiffres ; ils jouent en faveur des variantes (steelman, methode.md § 25).

## 23. Variantes contre le verrouillage (Md€/an, régime de transition ; solde net = recettes nouvelles de plus-values − DMTO perdus − coût du report 10 ans)

### Scénario bas (élasticité de réalisation H252 = 0,8)
| Variante | Recettes de plus-values | Solde net | Écart au défaut | Ventes gagnantes verrouillées | Coût du verrouillage | Taux effectif moyen sur le gain |
|---|---|---|---|---|---|---|
| Défaut : 50 % du gain réel, sans abattement | 1,1 | −23,9 | — | 0,0 % | 0,00 | 50,0 % |
| Dégressif, −2 % du taux par an dès 5 ans (plafond 70 %) | 0,9 | −24,0 | −0,1 | 0,0 % | 0,00 | 43,5 % |
| Dégressif, −4 % du taux par an dès 5 ans (plafond 70 %) | 0,8 | −24,1 | −0,3 | 0,0 % | 0,00 | 37,9 % |
| Dégressif, −6 % du taux par an dès 5 ans (plafond 70 %) | 0,7 | −24,2 | −0,3 | 0,0 % | 0,00 | 34,1 % |
| Locatif exonéré après 5 ans | 0,5 | −24,4 | −0,5 | 0,0 % | 0,00 | 25,5 % |
| Locatif exonéré après 10 ans | 0,7 | −24,2 | −0,3 | 0,0 % | 0,00 | 34,9 % |
| Locatif exonéré après 22 ans | 1,0 | −23,9 | −0,1 | 0,0 % | 0,00 | 47,1 % |
| Report en cas de réinvestissement | 0,5 | −24,4 | −0,5 | 0,0 % | 0,00 | 25,5 % |

### Scénario central (élasticité de réalisation H252 = 0,5)
| Variante | Recettes de plus-values | Solde net | Écart au défaut | Ventes gagnantes verrouillées | Coût du verrouillage | Taux effectif moyen sur le gain |
|---|---|---|---|---|---|---|
| Défaut : 50 % du gain réel, sans abattement | 5,9 | −14,1 | — | 29,2 % | 1,47 | 50,0 % |
| Dégressif, −2 % du taux par an dès 5 ans (plafond 70 %) | 4,9 | −15,1 | −0,9 | 17,5 % | 0,61 | 37,7 % |
| Dégressif, −4 % du taux par an dès 5 ans (plafond 70 %) | 4,0 | −16,0 | −1,9 | 11,7 % | 0,35 | 29,4 % |
| Dégressif, −6 % du taux par an dès 5 ans (plafond 70 %) | 3,5 | −16,5 | −2,4 | 9,2 % | 0,25 | 25,3 % |
| Locatif exonéré après 5 ans | 2,5 | −17,5 | −3,3 | 13,7 % | 0,64 | 21,7 % |
| Locatif exonéré après 10 ans | 3,2 | −16,8 | −2,7 | 18,2 % | 0,79 | 26,9 % |
| Locatif exonéré après 22 ans | 4,8 | −15,2 | −1,0 | 26,3 % | 1,22 | 41,3 % |
| Report en cas de réinvestissement | 5,2 | −14,8 | −0,6 | 7,0 % | 0,26 | 37,5 % |

### Scénario haut (élasticité de réalisation H252 = 0,3)
| Variante | Recettes de plus-values | Solde net | Écart au défaut | Ventes gagnantes verrouillées | Coût du verrouillage | Taux effectif moyen sur le gain |
|---|---|---|---|---|---|---|
| Défaut : 50 % du gain réel, sans abattement | 14,4 | −3,8 | — | 20,6 % | 3,04 | 50,0 % |
| Dégressif, −2 % du taux par an dès 5 ans (plafond 70 %) | 10,9 | −7,2 | −3,5 | 12,7 % | 1,20 | 34,8 % |
| Dégressif, −4 % du taux par an dès 5 ans (plafond 70 %) | 8,5 | −9,7 | −5,9 | 8,4 % | 0,63 | 26,1 % |
| Dégressif, −6 % du taux par an dès 5 ans (plafond 70 %) | 7,4 | −10,8 | −7,0 | 6,3 % | 0,43 | 22,4 % |
| Locatif exonéré après 5 ans | 6,0 | −12,1 | −8,4 | 9,2 % | 1,27 | 20,9 % |
| Locatif exonéré après 10 ans | 7,1 | −11,1 | −7,3 | 11,9 % | 1,50 | 24,6 % |
| Locatif exonéré après 22 ans | 10,9 | −7,3 | −3,5 | 17,5 % | 2,30 | 37,8 % |
| Report en cas de réinvestissement | 13,8 | −4,3 | −0,6 | 15,0 % | 2,02 | 45,5 % |

### Report : première année contre régime de croisière (Md€ de recettes de plus-values)
| Scénario | Première année | Croisière | Défaut |
|---|---|---|---|
| bas | 0,3 | 0,5 | 1,1 |
| central | 3,5 | 5,2 | 5,9 |
| haut | 10,7 | 13,8 | 14,4 |

### Sensibilité à l'élasticité de réalisation (central ; écart de solde net d'une variante au défaut, les deux calculés avec la même élasticité)
| Élasticité | Défaut : solde | Dégressif −4 % | Locatif exonéré 10 ans | Report |
|---|---|---|---|---|
| 0 | −12,7 | −3,0 | −3,4 | −1,8 |
| 0,3 | −13,2 | −2,6 | −3,2 | −1,4 |
| 0,5 | −13,5 | −2,4 | −3,0 | −1,2 |
| 0,8 | −13,9 | −2,1 | −2,8 | −0,8 |
| 1 | −14,1 | −1,9 | −2,7 | −0,6 |
| 1,5 | −14,7 | −1,5 | −2,4 | −0,2 |
| 2,5 | −15,6 | −0,8 | −2,0 | +0,5 |

Élasticité à partir de laquelle la variante rapporte plus que le défaut (central, balayage de 0 à 10 par pas de 0,05 ; « aucune » = jamais dans cette plage) :
- dégressif −4 % du taux par an : 5,05
- locatif exonéré après 10 ans : aucune
- locatif exonéré après 22 ans : aucune
- report : 1,75

### Effet sur les cas types (impôt payé à la vente, scénario central, € ; `MaSituationPatrimoine.comparerVariantes`)
| Cas | Aujourd'hui | Défaut | Dégressif −4 % | Exo 5 ans | Exo 10 ans | Exo 22 ans | Report, réinvesti : payé / différé (valeur espérée) |
|---|---|---|---|---|---|---|---|
| Locatif vendu après 10 ans (200 000 → 400 000 €) | 48 181 | 68 955 | 55 164 | 0 | 0 | 68 955 | 0 / 68 955 (25 617) |
| Locatif détenu 30 ans (60 000 → 300 000 €) | 0 | 91 585 | 27 476 | 0 | 0 | 0 | 0 / 91 585 (34 025) |
| Locatif revendu après 3 ans (250 000 → 290 000 €) | 7 693 | 2 398 | 2 398 | 2 398 | 2 398 | 2 398 | 0 / 2 398 (891) |
Lecture : le détenteur long (30 ans) est le seul que les variantes changent beaucoup : le dégressif ramène son impôt de 91 585 à 27 476 €, l'exonération à zéro, le report le repousse. Le vendeur rapide (3 ans) ne gagne rien aux variantes de durée : seul le report le touche. Le cas de 10 ans montre la frontière : exonéré à 10 ans, taxé plein pot à 22 ans.

## 24. Fiscalité du patrimoine financier : dividendes, plus-values, assurance-vie, PEA, PER, cession d'entreprise, crypto-actifs (03/11/2026, T56) (`patrimoine_financier.js`, `rapport_patrimoine_financier.js`, `resultats-patrimoine-financier.txt` (fait foi), `test_patrimoine_financier.js` : 311 contrôles au vert ; H288 à H323, methode.md § 26 ; V5510-V5538, V6000, V6005, V6006)

**Avant / après la correction des prélèvements sociaux (03/11/2026, V6000, V6005, V6006 ; CSS L136-8 I 2° et IV) : solde net central +7,89 → +7,57 Md€/an (−0,32), bas −2,90 → −3,09, haut +20,25 → +19,69 ; recettes actuelles (statu quo) 18,46 → 19,17 Md€ au central (+0,71) ; PFU 30 % → 31,4 %, PEA 17,2 % → 18,6 %, assurance-vie inchangée à 17,2 %. Le statu quo rapporte plus, donc l'écart avec le système à 50 % se réduit, et le taux effectif plus élevé durcit un peu le verrouillage (m plus faible). Cette correction a ensuite été dépassée par la mise à jour ci-dessous.**

> **Mise à jour du 04/11/2026 : base réelle et fin de la purge par défaut.** Depuis les décisions du 03/11 (base **réelle** : prix d'achat indexé sur l'inflation ; **fin de la purge** des gains latents de l'assurance-vie au décès), le solde net central est de **+3,15 Md€/an** (bas −5,66 ; haut +13,33), contre +7,57 (−3,09 ; +19,69) en base nominale avec purge maintenue. Tous les tableaux et chiffres ci-dessous sont recalculés avec ces défauts (`resultats-patrimoine-financier.txt`, régénéré le 04/11 ; le script de rapport a été corrigé : libellés de base et ligne « assurance-vie au décès » ajoutée au tableau A). Variantes : base nominale +11,52 (−0,41 ; +24,96) ; purge maintenue +0,94 (−7,15 ; +10,39).

**À lire d'abord.** Règle de l'auteur : tout est taxé à 50 % dans le prélèvement unique, les pertes ouvrent un crédit de 50 % reportable, jamais remboursé. L'immobilier est traité aux § 21-23 et n'est pas repris. Les assiettes viennent de France Stratégie (dividendes, plus-values mobilières, via moteur), de France Assureurs et de Bercy (encours, via presse), de la Banque de France (PEA), de la DGFiP (crypto, via presse) et des dépenses fiscales du PLF 2026 (lues). Beaucoup de paramètres sont ⚠️ : ce sont des ordres de grandeur, jamais des prédictions.

**Ce que disent les tableaux.**
1. **Solde net central : +3,1 Md€/an** pour l'État (+7,6 en base nominale et purge maintenue), fourchette **−5,7 à +13,3** (tableau A). Le total tient à deux postes, le **PER** (+2,4) et la **fin de la purge de l'assurance-vie au décès** (+2,2), qui à eux deux (+4,6) dépassent le total ; ce sont précisément les moins bien mesurés (versements, sorties et taux marginaux du PER ; part de gains latents dans les capitaux décès). Les rachats d'assurance-vie, eux, perdent 0,8 Md€ en base réelle (+4,0 en base nominale).
2. **Les actifs mobiles ne rapportent rien de plus, ils perdent** : plus-values de portefeuille (−0,98 au central), assurance-vie en rachats (−0,82), cessions d'entreprise (−0,69, taux maximisant la recette 40 %), plus-values professionnelles (−0,23), crypto-actifs (−0,05). Les crédits sur pertes absorbent une part notable du gain de taux sur le portefeuille (coût 1,2 Md€ au central contre 3,1 de recette brute).
3. **Le taux de 50 % est au sommet de la courbe seulement si l'élasticité vaut 1** (t\* = 1/(1 + ε) ; tableau G : au central, la recette des blocs culmine à 50 % (20,6 Md€), est presque plate à 55 % (20,4) et baisse ensuite). Si toutes les élasticités sont multipliées par 1,5, le gain s'annule (tableau F : −0,07) ; doublées, le solde est de −2,8 ; triplées, −7,1.
4. **Base nominale ou réelle** : le choix pèse 8,4 Md€ au central (tableau C : +11,5 en nominal contre +3,1 en réel). L'assurance-vie en fonds euros rend à peine l'inflation ; l'imposer en nominal à 50 % pose le problème constitutionnel le plus net (taxer un gain réel nul). **Décision de l'auteur du 03/11 : base réelle par défaut.**
5. **Le report des pertes coûte de 1,2 (5 ans) à 2,0 Md€ (sans limite) au central** (tableau D) ; une année de krach crée 4,7 Md€ de crédits en plus et fait perdre 4,3 Md€ de recettes (tableau H) : comme pour l'immobilier, la recette est cyclique.
6. **Le PER perd son sens** : déduit à 50 %, repris à 50 %, il ne garde que le report d'impôt ; les versements chutent (de 12 à 6 Md€ au central), ce qui réduit le coût de la déduction. Le chiffre est un flux annuel à stock donné, pas une trajectoire.
7. **L'assurance-vie au décès** (variante : fin de la purge des gains latents par le décès) ajoute +2,2 Md€ au central (1,5 à 2,9 ; tableau E), comptés par défaut depuis le 03/11 (le solde central serait de +0,9 avec la purge maintenue) : la décision d'ensemble sur les successions reste à prendre (§ 26).
8. **Le report 150-0 B ter** : corrigé au § 25 : les entrées (22 à 34 Md€/an) dépassent de loin les sorties (0,4 à 1,5), le stock est de 173,3 Md€ (majorant, DGFiP) ; voir § 25. (Texte d'origine : « effet de croisière nul », contredit par les données DGFiP lues le 03/11 ; le tableau I reste valable comme formule.)

**Contraintes juridiques** (methode.md § 26, ⚠️ non vérifiées) : Conseil constitutionnel (capacité contributive, taux confiscatoire, imposition d'un gain nominal sans gain réel), libre circulation des capitaux (art. 63 TFUE, imposition de sortie), sécurité juridique pour les contrats en cours.

**Objection (steelman).** Le gain de recettes est fragile et repose sur des actifs peu mesurés ; réponse et limites : methode.md § 26.

### A. Solde net pour l'État par actif (Md€/an, régime de croisière ; report des pertes 10 ans ; base réelle par défaut ; fin de la purge de l'assurance-vie au décès par défaut)
| actif | actuel | système idéal (net des crédits) | solde net bas | central | haut |
|---|---|---|---|---|---|
| Dividendes | 7,41 / 7,60 / 8,79 | 6,98 / 8,55 / 11,83 | −0,43 | +0,96 | +3,04 |
| Plus-values de portefeuille | 2,12 / 2,83 / 3,53 | −0,35 / 1,85 / 3,72 | −2,47 | −0,98 | +0,19 |
| Assurance-vie (rachats) | 5,93 / 6,84 / 7,53 | 3,85 / 6,02 / 8,12 | −2,08 | −0,82 | +0,59 |
| PEA | 0,37 / 0,56 / 0,86 | 0,44 / 0,87 / 1,50 | +0,07 | +0,31 | +0,64 |
| PER | −3,04 / −2,94 / −2,66 | −3,25 / −0,50 / 1,75 | −0,21 | +2,44 | +4,41 |
| Cessions d'entreprise (titres) | 2,36 / 3,22 / 4,09 | 1,08 / 2,54 / 4,40 | −1,28 | −0,69 | +0,31 |
| Plus-values professionnelles | 0,63 / 0,94 / 1,26 | 0,30 / 0,71 / 1,26 | −0,33 | −0,23 | +0,00 |
| Crypto-actifs | 0,12 / 0,12 / 0,12 | −0,30 / 0,07 / 1,34 | −0,42 | −0,05 | +1,22 |
| Assurance-vie au décès (fin de la purge, gains latents taxés) | 0,00 / 0,00 / 0,00 | 1,49 / 2,20 / 2,94 | +1,49 | +2,20 | +2,94 |
| **Total** | 15,89 / 19,17 / 23,51 | 10,24 / 22,32 / 36,84 | **−5,66** | **+3,15** | **+13,33** |

### B. Détail par scénario : gains bruts, base après comportement, recettes brutes, crédits créés, coût des crédits (Md€/an)

### bas
| actif | assiette nette observée | gains bruts | taux actuel effectif | m (verrouillage) | fuite | base réformée | recettes brutes | crédits créés | coût des crédits | taux maximisant |
|---|---|---|---|---|---|---|---|---|---|---|
| Dividendes | 23,60 | 23,60 | 31,4 % | 0,62 | 5,0 % | 13,95 | 6,98 | 0,00 | 0,00 | 40,0 % |
| Plus-values de portefeuille | 6,75 | 9,61 | 31,4 % | 0,53 | 5,0 % | 3,69 | 1,85 | 2,51 | 2,19 | 33,3 % |
| Assurance-vie (rachats) | 22,62 | 22,62 | 26,2 % | 0,68 | 10,0 % | 7,69 | 3,85 | 0,00 | 0,00 | 50,0 % |
| PEA | 2,00 | 2,00 | 18,6 % | 0,61 | 5,0 % | 0,89 | 0,44 | 0,00 | 0,00 | 50,0 % |
| Cessions d'entreprise (titres) | 8,25 | 8,62 | 28,6 % | 0,41 | 15,0 % | 2,59 | 1,30 | 0,25 | 0,22 | 28,6 % |
| Plus-values professionnelles | 2,00 | 2,09 | 31,4 % | 0,45 | 10,0 % | 0,70 | 0,35 | 0,06 | 0,05 | 28,6 % |
| Crypto-actifs | 0,37 | 0,75 | 31,4 % | 0,53 | 40,0 % | 0,23 | 0,11 | 0,47 | 0,41 | 33,3 % |

PER : versements 14,0 → 10,5 Md€ ; sorties 4,0 ; solde actuel (sorties − déduction) −3,04 ; solde système idéal −3,25 ; avantage de taux actuel 6,0 % → 0.

### central
| actif | assiette nette observée | gains bruts | taux actuel effectif | m (verrouillage) | fuite | base réformée | recettes brutes | crédits créés | coût des crédits | taux maximisant |
|---|---|---|---|---|---|---|---|---|---|---|
| Dividendes | 24,20 | 24,20 | 31,4 % | 0,73 | 3,0 % | 17,11 | 8,55 | 0,00 | 0,00 | 50,0 % |
| Plus-values de portefeuille | 9,00 | 11,43 | 31,4 % | 0,73 | 3,0 % | 6,15 | 3,07 | 1,73 | 1,22 | 50,0 % |
| Assurance-vie (rachats) | 28,28 | 28,28 | 24,2 % | 0,81 | 6,0 % | 12,04 | 6,02 | 0,00 | 0,00 | 66,7 % |
| PEA | 3,00 | 3,00 | 18,6 % | 0,78 | 3,0 % | 1,74 | 0,87 | 0,00 | 0,00 | 66,7 % |
| Cessions d'entreprise (titres) | 11,00 | 11,29 | 29,3 % | 0,59 | 8,0 % | 5,33 | 2,66 | 0,18 | 0,13 | 40,0 % |
| Plus-values professionnelles | 3,00 | 3,08 | 31,4 % | 0,62 | 5,0 % | 1,50 | 0,75 | 0,05 | 0,03 | 40,0 % |
| Crypto-actifs | 1,00 | 1,52 | 31,4 % | 0,73 | 25,0 % | 0,78 | 0,39 | 0,45 | 0,32 | 50,0 % |

PER : versements 12,0 → 6,0 Md€ ; sorties 5,0 ; solde actuel (sorties − déduction) −2,94 ; solde système idéal −0,50 ; avantage de taux actuel 14,0 % → 0.

### haut
| actif | assiette nette observée | gains bruts | taux actuel effectif | m (verrouillage) | fuite | base réformée | recettes brutes | crédits créés | coût des crédits | taux maximisant |
|---|---|---|---|---|---|---|---|---|---|---|
| Dividendes | 28,00 | 28,00 | 31,4 % | 0,85 | 1,0 % | 23,67 | 11,83 | 0,00 | 0,00 | 66,7 % |
| Plus-values de portefeuille | 11,25 | 12,89 | 31,4 % | 0,85 | 1,0 % | 8,29 | 4,15 | 0,97 | 0,43 | 66,7 % |
| Assurance-vie (rachats) | 33,94 | 33,94 | 22,2 % | 0,88 | 2,0 % | 16,24 | 8,12 | 0,00 | 0,00 | 76,9 % |
| PEA | 4,60 | 4,60 | 18,6 % | 0,86 | 1,0 % | 2,99 | 1,50 | 0,00 | 0,00 | 76,9 % |
| Cessions d'entreprise (titres) | 13,75 | 13,99 | 29,7 % | 0,76 | 3,0 % | 8,91 | 4,46 | 0,14 | 0,06 | 55,6 % |
| Plus-values professionnelles | 4,00 | 4,07 | 31,4 % | 0,78 | 2,0 % | 2,55 | 1,27 | 0,04 | 0,02 | 55,6 % |
| Crypto-actifs | 3,50 | 4,44 | 31,4 % | 0,85 | 10,0 % | 3,21 | 1,61 | 0,61 | 0,27 | 66,7 % |

PER : versements 10,0 → 2,5 Md€ ; sorties 6,0 ; solde actuel (sorties − déduction) −2,66 ; solde système idéal 1,75 ; avantage de taux actuel 21,0 % → 0.

### C. Base réelle (défaut, inflation déduite, comme pour l'immobilier) ou base nominale (variante) : solde net total (Md€/an)
| base | bas | central | haut |
|---|---|---|---|
| réelle (défaut) | −5,66 | +3,15 | +13,33 |
| nominale (variante) | −0,41 | +11,52 | +24,96 |

Facteur réel (gain réel / gain nominal, central) : Plus-values de portefeuille 0,76 ; Assurance-vie (rachats) 0,56 ; PEA 0,76 ; Cessions d'entreprise (titres) 0,86 ; Plus-values professionnelles 0,82 ; Crypto-actifs 0,94

### D. Durée de report des pertes : coût annuel des crédits (blocs d'actifs, Md€) et solde net total
| report | coût des crédits bas / central / haut | solde net bas / central / haut |
|---|---|---|
| 5 ans | 2,23 / 1,21 / 0,48 | −5,02 / +3,64 / +13,62 |
| 10 ans | 2,87 / 1,71 / 0,78 | −5,66 / +3,15 / +13,33 |
| sans limite | 3,13 / 2,04 / 1,23 | −5,91 / +2,81 / +12,88 |

### E. Assurance-vie au décès (Md€/an)
| scénario | capitaux décès | gains latents | 990 I (2024, maintenu) | gains latents taxés à 50 % (net d'anticipation et de fuite) |
|---|---|---|---|---|
| bas | 28,3 | 8,5 | 0,46 | +1,49 |
| central | 28,3 | 9,9 | 0,46 | +2,20 |
| haut | 28,3 | 11,3 | 0,46 | +2,94 |

Solde net total au central : +3,15 avec la fin de la purge (défaut) ; +0,94 en gardant la purge (statu quo) ; bas −5,66 / −7,15, haut +13,33 / +10,39.

### F. Sensibilité à l'élasticité de la base (central ; toutes les ε multipliées par k) : solde net total
| k | ε dividendes | ε portefeuille | ε cession d'entreprise | solde net |
|---|---|---|---|---|
| 0 | 0,0 | 0,0 | 0,0 | +11,52 |
| 0.5 | 0,5 | 0,5 | 0,8 | +6,97 |
| 1 | 1,0 | 1,0 | 1,5 | +3,15 |
| 1.5 | 1,5 | 1,5 | 2,3 | −0,07 |
| 2 | 2,0 | 2,0 | 3,0 | −2,79 |
| 3 | 3,0 | 3,0 | 4,5 | −7,05 |

### G. Taux de prélèvement : recette totale des blocs selon t (central ; ε inchangés)
| t | recettes nettes des blocs | solde net total (avec PER) |
|---|---|---|
| 30,0 % | 17,13 | −1,02 |
| 35,0 % | 18,78 | +0,81 |
| 40,0 % | 19,80 | +1,99 |
| 45,0 % | 20,41 | +2,77 |
| 50,0 % | 20,61 | +3,15 |
| 55,0 % | 20,41 | +3,12 |
| 60,0 % | 19,81 | +2,69 |

### H. Une année de krach (gains × 0,3, pertes × 3) : crédits créés en plus, recettes perdues, coût ultime (Md€)
| scénario | crédits supplémentaires | recettes perdues | coût ultime (report 10 ans) |
|---|---|---|---|
| bas | 6,47 | 2,28 | 5,64 |
| central | 4,71 | 4,29 | 3,35 |
| haut | 3,44 | 7,15 | 1,52 |

### I. Report 150-0 B ter : gain unique à la suppression du report (50 % × stock × part devenant imposable ; Md€, une fois)
| stock reporté S (Md€) | φ = 30 % | φ = 50 % | φ = 70 % |
|---|---|---|---|
| 10 | 1,5 | 2,5 | 3,5 |
| 20 | 3,0 | 5,0 | 7,0 |
| 40 | 6,0 | 10,0 | 14,0 |


## 25. Report d'imposition de l'apport-cession (150-0 B ter) : suppression du report, taxe sur les holdings, fin de la purge (03/11/2026, T56) (`patrimoine_financier.js` : `report150*`, `holdingsTaxe`, `plancherRevenu` ; `rapport_report150.js`, `resultats-report150.txt` (fait foi), `test_patrimoine_financier.js` : 311 contrôles au vert ; H331 à H346, methode.md § 27 ; V5690-V5714 ; dossier `sources/report-150-0-b-ter-holdings.md`)

**À lire d'abord.** Stock reporté : **173,3 Md€ fin 2024** (majorant), 78,8 fin 2020. Flux entrant : 22,2 Md€ (2024), 33,6 (2023). Sorties : 1,5 (2024), 0,4 (2023) : **3,3 % des entrées 2020-2024**. 8 400 foyers ; 84 foyers = 70 % du flux 2023. Taux d'imposition effectif des 75 « milliardaires » (IPP, 2016) : **26 %** du revenu économique ; impôt sur le revenu et ISF : environ 2 %. Toutes les valeurs de scénario ci-dessous sont des hypothèses (V5702).

| option (Md€) | bas | central | haut |
|---|---|---|---|
| (a) supprimer le report, flux futur à 50 % (par an) | +0,34 | **+3,45** | +9,13 |
| (a) stock imposé rétroactivement (une fois) | 18,2 | **36,8** | 60,6 |
| (b1) taxe de 2 % sur les actifs passifs de holdings (par an) | +0,36 | **+0,77** | +1,18 |
| (b2) plancher de 40 % du revenu économique des 75 foyers (par an) | +1,97 | **+3,28** | +4,60 |
| (c) fin de la purge, stock 2024 (par an) | +0,45 | **+1,38** | +3,12 |
| (c) après 10 ans (par an) | +0,90 | +3,23 | +8,89 |
| (a) flux + (c) stock existant (par an) | +0,80 | **+4,83** | +12,24 |

**Ce que disent les tableaux.**
1. **L'hypothèse du § 26 était fausse** : le report n'est pas un simple décalage, 97 % du flux n'est jamais imposé de fait au central. Mais **le gain de (a) est fragile** : la base qui reste après suppression du report n'est que de 37 % au central ; à ε doublé, +0,75 ; à ε triplé, négatif (tableau C de `resultats-report150.txt`). La courbe est plate : 40 % rapporte plus que 50 % (+3,72 contre +3,45).
2. **(c) est plus robuste que (a)** : il conserve le report et supprime l'effacement ; sa recette ne dépend pas d'une réalisation volontaire (+1,4 Md€/an au central, croissante avec le stock : 5,1 après 20 ans). Avec t = 31,4 % : +0,9.
3. **Le stock** : l'impôt latent est de 54,4 Md€ à 31,4 % et de 86,6 Md€ à 50 % ; le recouvrer rétroactivement (37 Md€ au central) est le chiffre le plus incertain et le plus risqué juridiquement.
4. **Les taxes sur les holdings** rapportent peu (b1 : 0,8 Md€ ; la version votée en loi de finances pour 2026 en attend 0,1) parce que les actifs sortent de la holding (35 % au central). (b2) est l'option la plus « rentable » et la seule que la jurisprudence de 2012 ferme en l'état.
5. **À 3 Md€ près, le stock ne se recoupe pas avec les flux** (stock n−1 + flux − sorties − stock n : −2,0, −2,8, −2,5, +0,3) : le 8UT est un majorant.

**Contraintes juridiques** (dossier § 1.4 et § 3 ; ⚠️ décisions non relues sauf 2019-775 QPC) : fin du report à la transmission : pas de difficulté constitutionnelle selon la DLF, transfert au donataire validé par 2019-775 QPC ; transparence : barrée par 2012-662 DC et le droit des sociétés ; taxe sur les revenus non distribués des holdings : contraire à la directive mère-fille ; exit tax et sursis : de Lasteyrie du Saillant, N.

**Objection (steelman).** Le report finance le réinvestissement ; réponse et limites : methode.md § 27 et dossier § 5.

## 26. Le décès et la donation valent réalisation : plus-values latentes transmises, trois options, entreprises et Dutreil (03/11/2026, T56) (`deces_realisation.js`, `rapport_deces_realisation.js`, `resultats-deces-realisation.txt` (fait foi), `test_deces_realisation.js` : 210 contrôles au vert ; H347 à H376, methode.md § 28 ; V5880-V5908 ; dossier `sources/deces-realisation-plus-values.md`)

**À lire d'abord.** Le droit actuel efface la plus-value latente à la transmission (150-0 D, 150 VB). Sur un flux transmis de 300 Md€/an (CAE), le modèle estime **52 Md€ de plus-values latentes nettes par an** au central (17 à 97), dont **35 Md€ hors résidence principale** (12 à 66) : ⚠️ aucune ventilation officielle (V5881). Le défaut des modèles reste la purge (sauf l'assurance-vie, dont la fin de la purge est comptée au § 24 : +2,2 Md€ au central) ; les trois options sont optionnelles et **s'ajouteraient** au solde des § 23-26 (la classe assurance-vie ne doit pas être comptée deux fois).

| Md€/an, croisière, hors RP | bas | central | haut |
|---|---|---|---|
| Gain latent net transmis (assiette) | 12,3 | **34,9** | 65,7 |
| (i) réalisation à 50 %, impôt statique | 4,1 | 13,9 | 29,3 |
| **(i) recette nette** (comportement, droits perdus par déductibilité) | 2,9 | **11,0** | 25,8 |
| (i) sans report au conjoint (règle à la lettre) | 3,9 | 13,5 | 28,7 |
| (i) avec franchise de 200 000 € | 1,8 | 7,0 | 16,3 |
| (ii) prix d'acquisition reporté : recette immédiate | 0 | **0** | 0 |
| (ii) année 10 | 1,3 | 6,5 | 19,5 |
| (ii) croisière | 4,0 | **13,1** | 27,9 |
| (ii) valeur actuelle de la croisière | 2,0 | 8,2 | 20,3 |
| **(iii) réalisation avec crédit : borne basse (droits groupés)** | 0,0 | **1,9** | 13,5 |
| **(iii) borne haute (par classe)** | 0,2 | **5,7** | 21,2 |

- **Lecture.** (i) rapporte le plus vite et expose le plus : cumul avec les droits, contrainte constitutionnelle (DLF) et ventes forcées. (ii) ne rapporte rien à la transmission et 6,5 Md€/an à dix ans au central, 80 % de sa croisière (10,5 sur 13,1) à vingt ans ; il supprime l'effacement sans verrou constitutionnel connu. (iii) élimine le cumul mais le crédit absorbe l'essentiel de la recette sur l'immobilier et les titres ; la recette reste sur les entreprises sous Dutreil et l'assurance-vie.
- **Détail par classe au central (i, net)** : entreprises 3,8 ; immobilier 3,7 ; assurance-vie 2,2 ; titres 1,3 Md€.
- **Entreprises et Dutreil (sans étalement, central)** : impôt effectif de 15,8 % de la valeur ; **11 % de la valeur des entreprises transmises à céder** (5,5 à 14,8 %) ; étalement sur 5 ans ou 10 ans : 0. Droits Dutreil rappelés : 0,27 Md€/an sans étalement (0,12 à 0,29), 0 à 5 ans. Cas type (100 M€, prix de revient 5 M€, Dutreil) : droits actuels 5,6 M€ ; impôt de réalisation 47,5 M€ (16 années de dividendes à 3 %).
- **Comparaison** : le CAE transpose à la France 1,3 Md€/an (0,05 % du PIB américain) : notre (i) statique central est **10,7 fois** ce chiffre (V5898) ; les exemptions américaines n'étant pas retenues par défaut, le chiffre est une borne haute probable.
- **Droit** : DLF : imposition des plus-values latentes lors des transmissions « impossible en l'état de la jurisprudence » (rapport AN n° 3056, p. 244) ; OCDE : 12 pays step-up, 8 carry-over, 2 réalisation (Danemark, Hongrie) parmi ceux qui ont un impôt successoral.
- **Articulation avec le palier 1** (à trancher) : si le flux transmis est taxé à 50 % de sa valeur (H178), 50 % en plus sur la plus-value cumule jusqu'à 75 % de la valeur pour une plus-value égale à la valeur.
- **Tests** : toutes les suites du dossier relancées au vert (modele 41, fiscalite_actuelle 12, optimisation 148, patrimoine_financier 310, patrimoine_immobilier 202, deces_realisation 210, etc., ma-situation-patrimoine 136, loi exécutable 164).

## 27. Simulateur individuel du patrimoine financier (03/11/2026, T56) (`simulations/ma-situation-financier.js` ; `ma-situation.html`, volet « Patrimoine financier (facultatif) » ; 255 contrôles ; methode.md § 29 ; H400 à H413 ; V6000-V6011)
Ordres de grandeur sur les cas types, impôts de l'année en euros, **aujourd'hui → système idéal (central, base nominale, option (a))** : dividendes 4 000 € + intérêts 1 500 € (revenu de 30 000 €) 1 727 → 2 750 ; plus-value de 25 000 € 7 850 → 12 500 ; retraité (couple) rachetant 40 000 € d'assurance-vie de 12 ans (30 % de gains) 2 274 → 6 000 ; PEA de 9 ans, 18 000 € de gains 3 096 → 9 000 ; cession d'entreprise à la retraite, 1,2 M€ de gain, 227 300 → 600 000 (CEHR comprise ; la perte de l'abattement de 500 000 € pèse plus que le taux) ; apport-cession réinvesti à 70 %, 2 M€ de plus-value, 3 000 → 1 003 000 à l'option (a), 3 000 à l'option (c) (impôt latent de 1 M€ reporté). Le PER, à revenu égal entre l'entrée et la sortie, ne rapporte plus rien dans le système idéal (avantage net nul, voir H407).
**Lecture.** Pour les gains du capital, le système idéal coûte plus cher que le droit actuel dans tous les cas types, sauf les pertes, l'assurance-vie au décès (inchangée au statu quo) (crédit de 50 % contre une valeur espérée du report actuel) et le PER à l'entrée ; le plus gros écart vient de l'apport-cession à l'option (a) (liquidité) et de la cession d'entreprise. C'est l'objection à nommer au lecteur : celle des entrepreneurs (voir § 25). **Limites** : méthode § 29 ; textes de droit actuel non relus (V6000-V6010).

## 28. Contrôle du cœur du modèle aux sources primaires (03/11/2026, chapitre 9) (`sources/calculs/chapitre9_coeur_controle.py` ; V6680-V6693 ; `sources/chapitre9-etat-des-preuves.md`)

**Ce qu'il faut retenir.** Les agrégats du cœur sont confirmés à l'euro près (prélèvements supprimés 886,0 contre 885,9 ; salaires au coût employeur 1 466,6 contre 1 466,5 ; déficit −169,1 ; barème de l'IR, décote, plafonds, abattements, CSG). **Aucun paramètre par défaut n'est modifié** : toutes les suites de tests restent au vert (modele 41, fiscalite_actuelle 12, voies 33, sante 30, optimisation 148, retraites2 54, palier1 87, foyer 56, hauts_revenus 92, chomage 44, croissance 145, soutenabilité 289, patrimoine_financier 311, patrimoine_immobilier 202, deces_realisation 210, age_sante 135, demographie 38, capitalisation 47, capitalisation_cohortes 61 ; `simulations/` : ma-situation-financier 256, ma-situation-patrimoine 136).

| Point contrôlé | Avant | Après | Décision |
|---|---|---|---|
| PFU `pfu` (H10) : 30 % ; loi 2026 : 31,4 % sur dividendes et plus-values mobilières, 30 % sur intérêts (V6686) | solde central du palier 1 à 35 % : −163,3 Md€ (bas −119,8 ; haut −235,7) ; taux plat exact 34,55 % | à `pfu` = 0,314 : −167,6 (−126,1 ; −236,5) ; taux plat exact 34,39 % (retenu 34,5 %) | **sensibilité, paramètre inchangé** : `pfu` est une moyenne pondérée (≈ 30,4 %), l'écart attendu est ≈ −1,3 Md€ au central |
| Prélèvements supprimés (H1) | 885,9 | 886,0 (2024) ; 915,2 (2025 provisoire) | écart d'arrondi ; millésime 2025 non adopté |
| Capital courant (H1) | 402,5 | 402,4 (2024) ; ≈ 381 (2025 provisoire, −5,3 %) | non adopté (provisoire) : −10,7 Md€ de recette à 50 % si adopté |
| Taux d'équilibre statique 50 % | 59,0 % | 60,1 % (montants 2025) | aucune conséquence sur la lecture |
| IS 68,0 et IR 96,0 : avant crédits d'impôt (H22, V6684) | coût de la suppression compté en brut | crédits 2024 : IR 8,9, IS 10,7 | biais prudent ≤ 19,6 Md€, choix de périmètre (7,2 Md€ d'emploi à domicile, CIR 8,0) |

Commande de la sensibilité (depuis ce dossier) : `jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js` puis `D.pfu = 0.314` et `Palier1.palier1()` (script jetable, non conservé : une ligne). Limites : les recettes 2026 du PLF et du PLFSS ne sont pas dans la base locale (V6692) ; les hypothèses de comportement (H4, H5, H11-H21) ne se vérifient pas à une source primaire (V6693).

## 29. Options de financement du palier 1 : grille, empilement et quatre chemins (03/11/2026) (`options_financement.js`, `rapport_options_financement.js`, `resultats-options-financement.txt` (fait foi), `test_options_financement.js` : 73 contrôles au vert ; H420 à H432, methode.md § 30 ; V6800-V6810 ; document de décision `options-financement-palier1.md`)

**À lire d'abord.** Palier 1 : −120 / −163 / −236 Md€ (bas / central / haut). Aucune option seule n'équilibre. Écarts au central : taux plat 36 / 38 / 40 / 41,5 % : +12,6 / +37,1 / +60,4 / +77,1 ; socle −10 / −20 % : +21,7 / +43,5 ; fin du report 150-0 B ter +3,7 ; décès = réalisation (prix reporté, 10 ans) +6,3 ; PFU à 50 % +2,8 ; économies volontaires +5,3 ; CIR supprimé +8,0 ; héritage : écart de 35 % −6,0, impôt de 40 % −17,1, droits actuels −82,7. La montée du socle (5 ou 10 ans) améliore la moyenne sur 10 ans de 27 ou 54 Md€ mais pas le régime. Tout le patrimoine et toutes les économies ensemble : au mieux +26 Md€ (16 % du trou).

Chemins (solde de croisière bas / central / haut) : **1. montée lente** (38 %, socle 250 → 500 € sur 10 ans, fin du report) −65 / −123 / −214 ; **2. taux 41,5 %, socle 400 €, patrimoine, économies** +71 / −16 / −137 ; **3. idem, écart de déclaration de 35 %** +65 / −22 / −143 ; **4. taux 45 %, socle 400 €, écart de 35 %, patrimoine, économies** +113 / +14 / −128 ; contre-épreuve (chemin 2 aux droits actuels) −27 / −97 / −194. **Seul le chemin 4 équilibre au central ; aucun chemin n'équilibre au haut** (le solde du haut plafonne vers −116 à 50 % de taux plat). Les chemins 2 et 3 atteignent +14 et +8 à dix ans avec la création de valeur, et −5 et −11 sans la croissance par l'IA. À 45 % avec un socle de 400 €, D1 à D3 perdent par rapport au droit actuel (avant plancher RSA). Taux marginal limite : 65 % (palier 1), 72 % (41,5 %), 75 % (45 %). Érosion du taux plat par les réactions : 30 à 34 % du gain statique au central.

Pas de recommandation : le choix entre taux plat, socle et pari sur l'héritage est celui de l'auteur.

## 30. Cumul des prélèvements sur le patrimoine : le plafond de 50 % « tous impôts confondus » (04/11/2026, T56) (`cumul_patrimoine.js`, `rapport_cumul_patrimoine.js`, `resultats-cumul-patrimoine.txt` (fait foi), `test_cumul_patrimoine.js` : 376 contrôles au vert ; H650 à H668, methode.md § 34 ; V12130-V12151 ; note `sources/cumul-prelevements-patrimoine.md`)

Scénario central, euros constants, taux de 40,7 %, créance à 1 % réel ; système proposé → droit actuel.

| cas | cumul de détention / rendement réel (hors droits) | prélevé au décès / valeur transmise |
|---|---|---|
| résidence principale 300 k€, 30 ans | 16,4 % → 6,9 % | 45,9 % → 18,0 % |
| locatif 500 k€, 20 ans | **56,1 %** → 44,9 % | vente |
| actions 1 M€, 20 ans | **62,4 %** → 50,9 % | vente |
| entreprise familiale 5 M€ transmise | 38,5 % → 13,6 % | **58,6 %** → 6,4 % |
| patrimoine 50 M€ transmis | 40,8 % → 31,6 % | **54,6 %** → 30,7 % |
| fondateur sans dividende (extrême) | **57,4 %** → 53,5 % ; revenu de l'année prélevé à **115 %** | vente |
| héritier de 100 k€ | 15,4 % → 6,9 % | 28,0 % → 11,0 % ; réception : droits 9 295 €, capital de départ 11 460 € |

- **Le plafond de 50 % « tous impôts confondus » est dépassé** pour l'entreprise transmise (57,8 à 59,5 % selon le scénario) et le patrimoine de 50 M€ (53,9 à 55,4 %) : la créance de taxe reportée (19,4 % et 9,4 % de la valeur) s'ajoute à des droits E' de 39 à 45 %. Les droits E' seuls restent sous 50 % partout. Sans l'imputation de l'impôt sur la plus-value du décès sur les droits : 69 % et 65 %.
- **Détention (hors droits)** : le système prélève plus que le droit actuel dans les 7 cas et 3 scénarios testés ; plus de la moitié du rendement réel dans 10 des 24 combinaisons, jamais plus de 100 % ; tout compris (droits inclus), plus de 100 % pour l'entreprise et le patrimoine de 50 M€ au scénario bas. Le cumul franchit 100 % du rendement d'un portefeuille d'actions sous 1,7 % de rendement réel, et reste au-dessus de 50 % tant que ce rendement est sous 10,8 %.
- **Moins lourd qu'aujourd'hui** : la plus-value réelle des actions détenues 20 ans (41 % du gain réel contre 87 % aujourd'hui, qui taxe le gain nominal) ; l'héritier modeste à la réception.
- **Règle proposée** (75 % du revenu de l'année pendant la détention ; créance + gain + droits ≤ 50 % de la valeur à la transmission, excédent supprimé d'abord sur la créance) : aucun effet sur les cas ordinaires ; coût de 8,6 % de la valeur de l'entreprise et 4,6 % du patrimoine de 50 M€ ; ramène le fondateur de 115 % à 75 % du revenu en reportant la recette. Ne règle pas l'absence d'équivalent de Dutreil (entreprise : 58,6 % contre 6,4 %).
- Réserves : revenus des ménages, répartition revenu / plus-value et rendement des entreprises familiales de Claude ; pas de donations échelonnées ni d'optimisation ; critère « revenu de l'année » = analogue du plafonnement de l'ISF (2012-662 DC cons. 93), pas un seuil établi.
