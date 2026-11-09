---
titre: Plan A, « deux fonctions » (v7) : simplifier le système actuel sans prélever plus
date: 2026-11-05
statut: brouillon, PROPOSITION non adoptée (l'auteur tranchera) ; ordres de grandeur sous hypothèses, jamais des prédictions ; vérifications V14800 à V14830 ; v7.1 (arbitrage 42, § 14) : V15000 à V15012
---

# Plan A : une fonction des revenus, une fonction du patrimoine, un montant par enfant

Écrit par Claude (IA d'Anthropic) à la demande de l'auteur (arbitrage 41 du 05/11/2026 ; ciblage validé le 05/11). Module : `modeles/systeme-ideal/bareme_deux_fonctions_v7.js` ; tests : `test_bareme_deux_fonctions_v7.js` (50 vérifications) ; moteur commun : `bareme_unique_v6.js` (dossier `sources/bareme-unique-v6.md`). Rien n'est intégré au bilan adopté ni aux chapitres.

**Légende.** **A** : fait tiré d'une source primaire ou du droit (base LEGI locale, OpenFisca). **B** : estimation reproductible (modèle + hypothèses numérotées H7.x). **C** : opinion ou recommandation de Claude.

## 0. En une page

> **Mise à jour v7.1 (arbitrage 42)** : κ = 0,6 est remplacé par le capital compté à 100 % avec crédit de l'IS déjà payé, IS unique à 25 %. Cela rapporte ≈ 61 Md€ de plus que κ = 0,6 et le trilemme ci-dessous demeure : voir **§ 14** (calibrages C « ciblage » et N « neutre »).

- **La demande** : simplifier le système **actuel**, à recettes **au plus égales** à celles d'aujourd'hui, avec une redistribution **modeste dans les deux sens** (cible validée par l'auteur : **+20 à +80 €/mois pour les bas revenus, −1 à −3 % du revenu disponible en haut**). La dette se stabilise par les économies, pas par l'impôt.
- **Fonction des revenus [B]** : par adulte, **B(R) = 400 + 675 × (1 − e^(−R/1 500)) − 0,65 × R** (€/mois). Le taux marginal part de **20 %** au premier euro et monte sans marche vers **65 %**. Une seule règle de ménage : un plancher de **877 €** par adulte seul (**1 316 €** pour un couple), montants par enfant en plus, retiré à 25 % du revenu net gagné. **200 € par enfant**, **250 €** de plus par enfant pour un parent seul (au lieu de 345 €).
- **Fonction du patrimoine [B]** : par ménage, **0,5 %** sur les 300 000 premiers euros de la résidence principale, **1,34 %** sur le reste de l'immobilier et des parts de sociétés (holdings comprises), **+0,5 point** au-delà de 10 M€. Elle remplace la taxe foncière, l'IFI et les droits de mutation à titre onéreux (61,7 Md€). Paiement différé sous la médiane de niveau de vie.
- **Ce que la neutralité permet [B]** : sans reprise par les taux, les aides supprimées (RSA, prime d'activité, aides au logement, ASS : 40,8 Md€) ne financent qu'un socle de **88 €** par adulte. Un socle de 400 € n'est possible que parce que la fonction le reprend dès les premiers euros. Pour les plus pauvres, la neutralité impose de garder **le niveau d'aujourd'hui (877 €)**, pas plus.
- **Le trilemme [B]** : on ne peut pas avoir à la fois (1) des recettes égales à aujourd'hui, (2) le capital compté exactement comme le travail et (3) une redistribution modeste. Taxer le capital comme le travail rapporte ≈ **58 Md€ de plus** qu'aujourd'hui (surtout sur le dixième le plus riche). Il faut choisir :
  - **A3 (calibrage proposé)** : (1) + (3), le capital ne compte que pour **60 %** dans R (κ = 0,6). Les bas revenus gagnent **+34 à +80 €/mois**, les cadres à 10 000 et 20 000 € brut perdent **−3,7 %** et **−0,2 %**. Limite : un rentier à 5 000 €/mois gagne **+604 €** (+18 %).
  - **A1** : (1) + (2) : le capital compte pour 100 % et le socle monte à 550 € pour rendre l'argent. Le rentier perd **−14 %**, mais la classe moyenne gagne beaucoup (couple médian **+675 €**, salarié à 2 500 € net **+268 €**) : la redistribution n'est plus modeste.
  - **A2** : (2) + (3) : même barème qu'A3 avec le capital à 100 % : les recettes dépassent celles d'aujourd'hui de ≈ **58 Md€**.
- **Taux marginal effectif [B]** : **70,8 %** au plus (personne seule à la fin du plancher, vers 3 700 €) ; aucune trappe à inactivité.
- **Seuil « 2 000 € net » [B]** : dans cette forme, il est **déjà tenu sans coût** : à 1 500, 1 750 et 2 000 € net, le salarié seul gagne +62, +80 et +138 €/mois par rapport à aujourd'hui. Les 38,5 Md€ du chiffrage du seuil concernent l'architecture de la v5.10 (R0 relevé), pas cette fonction.
- **Gros gains [B]** : lissage par le quotient (comme l'art. 163-0 A du CGI) sur la durée de détention, plafonnée à 20 ans. Avec une fonction qui atteint vite son taux maximal, le lissage pèse peu sur les très gros gains (1 M€ : 35,5 % au lieu de 38,8 %) ; il pèse surtout sur les gains de 50 000 à 300 000 €.
- **Exit tax au prorata [B/C]** : imposer en France la part du gain qui correspond aux années passées en France (10/11 dans l'exemple de l'auteur : 106 M€ sur 300 M€), avec un sursis jusqu'à la vente et sans dégrèvement automatique. Le droit de l'UE l'admet si le paiement attend la vente ; les conventions fiscales (article 13) sont l'obstacle principal.
- **Retraités [B]** : les pensions entrent dans la fonction par un **regroupement à net constant** : aucune pension ne change le jour de la bascule. En option, au-delà de 2 500 € brut, le dépassement n'est pas regroupé : **11,2 Md€**, payés par les deux dixièmes de pension les plus élevés (−5 % et −13 %).
- **Solde et dette [B]** : le plan A garde les économies de la v5.10 (retraites V6, dépenses) mais abandonne ses recettes supplémentaires : solde de croisière **−103 Md€** (≈ 3,5 % du PIB, proche du déficit qui stabilise la dette, 3,6 %). Pendant la transition, la dette monte encore : **144 %** du PIB à 10 ans, **172 %** à 30 ans. Pour ne jamais dépasser le niveau de départ (123,5 %), il faut **≈ 62 Md€ d'économies de plus par an** (central ; 0 au favorable, 255 au défavorable).
- **Recommandation [C]** : retenir **A3 comme base de travail**, en le disant franchement : il respecte la cible de l'auteur et la neutralité, mais il ne taxe pas le capital « pareil ». Le prochain pas est de remplacer κ = 0,6 par une règle défendable : **crédit de l'IS déjà payé** sur les dividendes (avoir fiscal) et part réelle de l'inflation dans les intérêts, plutôt qu'un coefficient global. Ne pas promettre « travail et capital taxés pareil » et « recettes égales » et « redistribution modeste » en même temps : les chiffres l'interdisent.

## 1. Les deux formules, énoncées simplement

### 1.1 La fonction des revenus [B]

**En une phrase** : chaque adulte reçoit 400 € par mois ; sur chaque euro qu'il gagne, il rend 20 centimes au début, puis de plus en plus, jusqu'à 65 centimes pour les très hauts revenus ; à 1 500 € de revenu, on a déjà fait 63 % du chemin.

**En formule** (€/mois ; B > 0 : l'État verse ; B < 0 : l'adulte paie) :

B(R) = S − T(R), avec T(R) = m∞ × R − (m∞ − m0) × K × (1 − e^(−R/K))

S = 400 €, m0 = 20 %, m∞ = 65 %, K = 1 500 €. Donc **B(R) = 1 075 − 675 × e^(−R/1 500) − 0,65 × R**. Taux marginal : m(R) = 0,65 − 0,45 × e^(−R/1 500).

R = revenu individuel du mois en **coût employeur**, plus κ × revenus du capital (κ = 0,6 dans A3), plus la pension regroupée pour les retraités (§ 6). Les gros gains en capital passent par le lissage (§ 5).

**Table de lecture** (A3) :

| R (€/mois) | B (€/mois) | taux moyen net (T − S)/R | taux marginal |
|---|---|---|---|
| 0 | +400 | — | 20,0 % |
| 500 | +266 | −53 % | 32,8 % |
| 1 000 | +78 | −8 % | 41,9 % |
| 1 500 | −148 | 10 % | 48,4 % |
| 2 000 | −403 | 20 % | 53,1 % |
| 3 000 | −966 | 32 % | 58,9 % |
| 5 000 | −2 199 | 44 % | 63,4 % |
| 10 000 | −5 426 | 54 % | 64,9 % |
| 50 000 | −31 425 | 63 % | 65,0 % |

**Trois exemples faits à la main** :
1. R = 1 000 € : e^(−1 000/1 500) = e^(−0,667) = 0,5134 ; 675 × 0,5134 = 346,6 ; B = 1 075 − 346,6 − 650 = **+78,4 €** (l'État verse 78 €).
2. R = 2 000 € : e^(−1,333) = 0,2636 ; 675 × 0,2636 = 177,9 ; B = 1 075 − 177,9 − 1 300 = **−402,9 €** (l'adulte paie 403 €, il garde 1 597 €).
3. R = 10 000 € : e^(−6,667) = 0,0013 ; 675 × 0,0013 = 0,9 ; B = 1 075 − 0,9 − 6 500 = **−5 425,9 €** (il garde 4 574 €, taux net 54 %).

**La situation comme paramètre (précision de l'auteur)**. La formule est la même pour tous ; la situation n'intervient que par une règle de plancher, la plus simple possible : un ménage dont les ressources sont sous **877 € par adulte seul ou 1 316 € pour un couple** (1,5 × 877, le rapport du RSA couple / seul), montants par enfant non compris, reçoit la différence, diminuée de 25 centimes par euro net gagné. Deux situations seulement (seul, en couple) ; un parent seul est « seul », avec ses montants par enfant. Pourquoi ne pas tout individualiser : donner 877 € à chaque adulte sans revenu, même en couple avec quelqu'un qui gagne bien, coûterait ≈ 527 € × 12 × 4 à 5 M de conjoints sans revenu, soit **25 à 32 Md€** ⚠️ V14802 ; la neutralité l'interdit.

**Montants par enfant** : 200 € par enfant ; 250 € de plus par enfant pour un parent seul (au lieu de 345 € : le plancher de 877 € s'applique désormais aussi au parent seul, la majoration peut baisser ; économie 3,6 Md€).

### 1.2 La fonction du patrimoine [B]

**En une phrase** : chaque ménage paie chaque année 0,5 % sur les 300 000 premiers euros de sa résidence principale et 1,34 % sur le reste de son immobilier et de ses parts de sociétés, dettes déduites, et 0,5 point de plus au-delà de 10 M€.

**En formule** (€/an) : P(rp, autre) = 0,5 % × min(rp, 300 000) + τ × (rp + autre − min(rp, 300 000)) + 0,5 % × max(0, rp + autre − 10 000 000), avec **τ = 1,343 %** (taux qui remplace exactement taxe foncière 42,9 + IFI 2,7 + DMTO 16,1 = 61,7 Md€, central).

**Trois exemples faits à la main** :
1. Résidence principale de 250 000 €, rien d'autre : 0,5 % × 250 000 = **1 250 €/an** (taxe foncière moyenne équivalente aujourd'hui : 0,27 % × 250 000 ≈ 675 € ; le ménage modeste peut différer le paiement jusqu'à la vente).
2. Résidence principale de 500 000 € : 0,5 % × 300 000 + 1,343 % × 200 000 = 1 500 + 2 686 = **4 186 €/an**.
3. Résidence principale de 1 M€ et parts de sociétés de 49 M€ : 1 500 + 1,343 % × 49,7 M€ + 0,5 % × 40 M€ = 1 500 + 667 470 + 200 000 = **868 970 €/an** (1,74 % du patrimoine).

**Limites [B]** : (i) la recette plafonne vers **66 Md€** autour de 2 % (érosion du sommet de taxe_patrimoine.js, H510 : les assiettes mobiles partent ou se réduisent) : on **ne peut pas** remplacer aussi les droits de succession et de donation (20,8 Md€) ; ils sont gardés dans le solde du plan A en attendant une décision (piste : l'héritage reçu entre dans B comme revenu exceptionnel lissé, non chiffrée) ⚠️ V14803. (ii) L'allègement de la résidence principale pèse lourd : les 300 000 premiers euros représentent **48 %** de l'assiette nette (population HVP, hypothèse : résidence principale = tout l'immobilier sous le 8e dixième de patrimoine, 60 % au-dessus) ⚠️ V14804. (iii) Le surcroît au-delà de 10 M€ (1,3 % de l'assiette) est compté sans érosion propre ⚠️ V14805.

## 2. Neutralité : ce qu'elle permet et ce qu'elle interdit

### 2.1 La règle de calcul [B]

Le modèle compare tout à la v5.10. Pour passer au droit actuel, on lit dans le bilan global (`sources/calculs/bilan_global.py`, exécuté le 05/11) ce que la v5.10 prélève **en plus** du droit actuel sur le périmètre de la fonction des revenus :

| | Md€/an |
|---|---|
| Recettes nouvelles : prélèvement unique à 42 % (N02) 887,2 ; impôts des retraités maintenus (N01) 66,0 | 953,2 |
| Recettes supprimées : cotisations 432,4 ; CSG 153,1 ; IR 96,0 ; prélèvements de solidarité 14,6 ; CRDS 9,1 ; impôts de production 46,3 | −751,5 |
| Dépenses nouvelles : socle 162,7 ; enfants 33,3 ; majoration 13,1 ; aide au logement des retraités 1,9 ; plancher 16,5 + 2,5 ; bonus 16,1 ; reprise −16,4 | 229,6 |
| Dépenses supprimées : chômage −24,5 ; RSA −0,8 ; ASS −1,7 ; prime d'activité −10,7 ; aides au logement −16,0 ; prestations familiales −27,2 ; AAH −5,9 ; arrondi +0,1 | −86,7 |
| **Prélèvement net supplémentaire de la v5.10** | **+58,7** |

La fonction de la v7 doit donc rendre **58,7 Md€** à la v5.10. A3 en rend **59,6** (central ; 76,9 au favorable, 32,2 au défavorable : les réactions des hauts revenus jouent dans les deux sens). La contribution des hautes pensions (N03, 12,0) et l'effet des retraites V6 sur les recettes (N27, −5,3) restent hors périmètre : ce sont des leviers d'économies (arbitrage 40).

### 2.2 Combien de socle la neutralité permet [B]

- **Sans reprise par les taux** : RSA 12,4 + prime d'activité 10,7 + aides au logement 16,0 + ASS 1,7 = 40,8 Md€ pour 38,7 M d'adultes non retraités : **88 €/mois** par adulte. C'est le seul socle « gratuit ».
- **Avec reprise** : le socle peut être de 400 € (ou 550 € dans A1), parce que la fonction reprend ce qu'elle donne : à partir de 1 150 €/mois environ, l'adulte rend plus qu'il ne reçoit. Le socle est alors surtout une **manière d'écrire** la fonction (B(0) > 0), pas un gain net : pour une personne sans revenu, le plancher de 877 € reste le vrai niveau, c'est-à-dire celui d'aujourd'hui (RSA + aide au logement).
- **Ce que la neutralité interdit** : donner plus que 877 € aux personnes sans revenu, ou individualiser complètement le plancher, sans reprendre plus en haut ou au milieu.

## 3. Le trilemme : neutralité, capital « pareil », redistribution modeste [B]

| | A3 (proposé) | A1 | A2 |
|---|---|---|---|
| Capital compté dans R | 60 % | 100 % | 100 % |
| Socle | 400 € | 550 € | 400 € |
| Recettes / droit actuel (Md€) | −0,9 | −0,5 | **+58,4** |
| Célibataire au Smic | +64 | +64 | ≈ +64 |
| Couple à deux Smic, 2 enfants | +34 | +334 | ≈ +34 |
| Couple médian, 2 enfants | +375 | +675 | ≈ +375 |
| Salarié à 2 500 € net | +118 | +268 | ≈ +118 |
| Cadre à 10 000 € brut | −3,7 % | −1,3 % | −3,7 % |
| Cadre à 20 000 € brut | −0,2 % | +1,2 % | −0,2 % |
| Rentier à 5 000 €/mois | **+18 %** | −14 % | ≈ −19 % |

**Lecture.** Le droit actuel taxe le capital au prélèvement forfaitaire unique (31,4 %), le travail beaucoup plus (cotisations comprises, 55 à 63 % de taux marginal sur le coût employeur, T4). Mettre le capital dans la même fonction que le travail fait monter les recettes d'environ 58 Md€, presque entièrement sur le dixième le plus riche. Si l'on veut des recettes égales, il faut rendre cet argent : soit à tout le monde (A1 : la classe moyenne gagne beaucoup), soit au capital lui-même (A3 : κ = 0,6). **La cible de l'auteur (petits gains en bas, petit effort en haut) ne tient qu'avec A3.**

**Le défaut d'A3 [C]** : un coefficient global de 60 % allège le capital modeste (le rentier à 5 000 €/mois paie 19 % au lieu de 31 %) alors que l'idée était de taxer pareil. Une règle plus juste et presque aussi neutre : **créditer l'IS déjà payé** sur les dividendes (le dividende entre dans R pour son montant avant IS, et l'IS est déduit : même charge totale que le travail) et ne compter que le rendement réel des intérêts. Le modèle a l'option (crédit d'IS, `creditIS`) mais elle ne rend que ≈ 6 Md€ sur les bandes de salariés (assiette des dividendes mal séparée) ⚠️ V14806 : à chiffrer proprement avant de trancher.

## 4. Cas types comparés au droit actuel (A3, €/mois)

Droit actuel : OpenFisca-France 2026, locataire zone 2 (H818 de `decisions_0511i.js`, `generer_variante_seuil_0511.py`).

| Cas | Aujourd'hui | v5.10 | Plan A (A3) | Écart à aujourd'hui |
|---|---|---|---|---|
| Célibataire au Smic | 1 706 | 1 817 | 1 770 | **+64** (+3,8 %) |
| Salarié seul, 1 500 € net | 1 723 | 1 830 | 1 785 | **+62** |
| Salarié seul, 1 750 € net | 1 868 | 1 977 | 1 948 | **+80** |
| Salarié seul, 2 000 € net | 1 977 | 2 154 | 2 115 | +138 (+7 %) |
| Salarié seul, 2 500 € net | 2 357 | 2 539 | 2 475 | +118 (+5 %) |
| Salarié seul, 3 000 € net | 2 736 | 2 887 | 2 812 | +77 (+2,8 %) |
| Parent isolé au Smic, 2 enfants | 2 590 | 2 693 | 2 670 | **+80** |
| Couple à deux Smic, 2 enfants | 3 549 | 3 606 | 3 583 | **+34** |
| Couple à deux Smic, sans enfant | 3 088 | 3 206 | 3 183 | +94 |
| Couple médian, 2 enfants (2 × 2 735 € brut) | 4 424 | 4 850 | 4 798 | +375 (+8,5 %) |
| Cadre seul, 5 000 € brut | 3 429 | 3 444 | 3 462 | +33 (+1,0 %) |
| Cadre seul, 10 000 € brut | 6 276 | 5 752 | 6 045 | **−231 (−3,7 %)** |
| Cadre seul, 20 000 € brut | 11 038 | 10 144 | 11 015 | −23 (−0,2 %) |
| Sans emploi (RSA + aide au logement) | 877 | 877 | 877 | 0 |
| AAH à taux plein (différentielle maintenue) | 1 033 | 1 033 | 1 033 | 0 |
| Rentier, 5 000 € de revenus du capital | 3 430 | 2 877 | 4 034 | +604 (+18 %) |
| Indépendant, 3 000 € de revenu d'activité | n.d. | 2 033 | 2 102 | n.d. (+69 par rapport à la v5.10) |

**Hors cible [C]** : le couple médian (+375 €) gagne surtout par les montants par enfant (400 € contre 148 € d'allocations familiales et l'avantage du quotient familial) ; les salariés de 2 000 à 2 500 € net gagnent un peu plus que la cible. Pour s'en approcher : 150 € par enfant (−8 Md€ de dépense, à rendre ailleurs) ou une fonction un peu plus raide entre 2 500 et 4 000 € ; la grille de calibrage n'a pas trouvé mieux sous les autres contraintes.

**Le haut (dixièmes) [B, indicatif]** : la quadrature des dixièmes de palier 1 ne sépare pas travail et capital ; elle donne pour A3 un dernier dixième à **−13 %** de son revenu disponible (volet revenus, sans la fonction du patrimoine), ce qui contredit les cas types. Ce chiffre surestime l'effort : κ n'y est pas appliqué et le sommet y est mal représenté (H7.4) ⚠️ V14807. Les cas types et les bandes de salariés sont la lecture de référence pour le haut.

## 5. Taux marginaux effectifs (A3) [B]

| R (€/mois) | 500 | 1 000 | 1 500 | 1 988 (Smic) | 2 500 | 3 000 | 4 000 | 5 000 | 10 000 | 50 000 |
|---|---|---|---|---|---|---|---|---|---|---|
| Personne seule (plancher compris) | 49,6 % | 56,5 % | 61,4 % | 64,8 % | 67,4 % | 69,2 % | 61,9 % | 63,4 % | 64,9 % | 65,0 % |

Maximum : **70,8 %** vers 3 675 € (fin du plancher d'une personne seule) ; de 1 à 1,1 Smic : 65,6 % (droit actuel : 73,1 %). Participation : passer de 0 à 0,25 Smic coûte 45 % du coût employeur, de 0 au Smic 55 % (51 % pour le second adulte d'un couple) ; **aucune trappe**. Au sommet : 65 %, sous le plafond de 75 %.

## 6. Lissage des gros gains, exit tax au prorata

### 6.1 Ce que le modèle faisait déjà (vérifié, pour éviter un double emploi) [A/B]

- `patrimoine_financier.js` : plus-values et revenus du capital au taux unique (50 % au départ, aligné sur le taux des revenus par la décision (10) du 05/11 : 41,4 %), base réelle (prix d'achat indexé sur l'inflation), pertes en crédit d'impôt reportable ; cessions d'entreprise et report 150-0 B ter chiffrés à part.
- `deces_realisation.js` : décès et donation valent réalisation (options), avec **étalement du paiement** sur n annuités en cas de vente forcée d'entreprise et Dutreil. C'est un étalement du **paiement**, pas de l'**assiette** : il ne règle pas la progressivité.
- `patrimoine_immobilier.js` : variante dégressive (taux réduit avec la durée de détention).
Aucun de ces mécanismes ne lisse un gain dans une fonction progressive : le lissage est nouveau et ne fait pas double emploi, à condition de **retirer la variante dégressive** si on l'adopte.

### 6.2 La règle proposée [B/C]

Comme le « système du quotient » de l'art. 163-0 A du CGI (lu dans la base LEGI : revenu exceptionnel divisé par quatre, cotisation supplémentaire multipliée par quatre) : la **part linéaire** de la fonction (65 % du gain) est due en entier ; la **part progressive** (l'abattement qui décroît) est calculée comme si le gain avait été perçu en N annuités égales, N = durée de détention plafonnée à **20 ans** :

impôt = m∞ × κG + N × [P(R + κG/N) − P(R)], avec P(R) = T(R) − m∞ × R.

### 6.3 Trois cessions après 20 ans, salaire au Smic pendant toute la période (A3) [B]

| Gain | Sans lissage | Avec lissage | Droit actuel (PFU 31,4 % + CEHR) |
|---|---|---|---|
| 1 M€ | 388 k€ (38,8 %) | **355 k€ (35,5 %)** | 342 k€ (34,2 %) |
| 5 M€ | 1,95 M€ (39,0 %) | **1,91 M€ (38,1 %)** | 1,76 M€ (35,2 %) |
| 50 M€ | 19,5 M€ (39,0 %) | **19,5 M€ (38,9 %)** | 17,7 M€ (35,4 %) |

Avec A1 (capital à 100 %) : 61 %, 64 % et 65 % avec lissage. **Droit actuel [A]** : PFU de 31,4 % (12,8 % d'IR + 18,6 % de prélèvements sociaux en 2026) et contribution exceptionnelle sur les hauts revenus (art. 223 sexies : 3 % de 250 000 à 500 000 €, 4 % au-delà pour un célibataire ; elle a son propre lissage, non appliqué ici). Abattement de 500 000 € au départ à la retraite du dirigeant (150-0 D ter) non appliqué. **150-0 B ter [A]** : en apportant ses titres à une holding qu'il contrôle avant la vente, le cédant met la plus-value **en report** ; si la holding revend dans les trois ans, le report tient à condition de réinvestir au moins **70 % du prix dans les trois ans** dans une activité économique (base LEGI, version en vigueur au 21/02/2026) ; l'impôt est alors différé, souvent jusqu'à une transmission. Ce report coûte peu de recette immédiate mais diffère des milliards (`sources/report-150-0-b-ter-holdings.md`).

**Lecture [C]** : la fonction atteint vite son taux maximal ; le quotient change donc peu de chose au-delà d'1 M€. Il protège surtout les gains moyens (50 000 à 300 000 €) d'un salarié modeste. Le vrai sujet des très gros gains est le taux maximal (65 %) et κ, pas le lissage.

### 6.4 Exit tax au prorata temporis [A/B/C]

**Droit actuel [A]** (art. 167 bis, base LEGI, version en vigueur au 01/01/2024) : imposition au départ des plus-values latentes si le contribuable a été domicilié en France **6 des 10 dernières années** et détient **au moins 50 %** des bénéfices d'une société ou des titres de plus de **800 000 €** ; **sursis de paiement automatique** vers un État de l'UE ou un État lié par une convention d'assistance administrative ; **dégrèvement** si les titres sont encore détenus **2 ans** après le départ (**5 ans** au-delà de 2,57 M€). Rendement : 138 M€ encaissés de 2012 à 2017 (23 M€/an) pour 5,75 Md€ d'impositions théoriques (réponse ministérielle, Sénat, 27/02/2020 ; `sources/exil-patrimoines-preuves.md` § 1.2).

**Contraintes [A]** :
- **Droit de l'UE** : CJCE, *de Lasteyrie du Saillant* (C-9/02, 11/03/2004) : une imposition immédiate des plus-values latentes au départ entrave la liberté d'établissement ; *N* (C-470/04, 07/09/2006) : l'imposition est admise si le paiement est différé jusqu'à la réalisation effective, sans garantie disproportionnée, et en tenant compte des moins-values ultérieures. Le **sursis jusqu'à la vente** est donc la forme compatible.
- **Conventions fiscales** : l'article 13 § 5 du modèle de l'OCDE attribue les gains en capital sur titres à l'**État de résidence du cédant au moment de la vente**. Certaines conventions françaises prévoient une clause qui garde un droit d'imposer à l'ancien État de résidence pendant quelques années, ou un traitement des plus-values latentes au départ ⚠️ V14808 (liste à dresser). Sans clause, la France ne peut pas imposer la part « française » d'un gain réalisé par un non-résident, sauf via une imposition **au départ** (latente) dont le paiement est suspendu.
- **Constitution** : égalité devant l'impôt et capacité contributive (art. 13 de la DDHC) : imposer un gain non réalisé est admis s'il est constaté et si le paiement attend la réalisation ; le Conseil constitutionnel a validé l'exit tax de 2011 (décision 2014-404 QPC ⚠️ V14809) ; un taux global excessif serait censuré (décision 2012-662 DC, § 76 sur le seuil de 75 % ⚠️ V14810).

**Imposition liée à la citoyenneté (modèle américain) [A/C]** : les États-Unis imposent leurs citoyens partout (IRC § 1) et taxent la renonciation à la nationalité (§ 877A). Pour la France, il faudrait renégocier l'essentiel de ses **≈ 125 conventions** fiscales ⚠️ V14811, créer un réseau de déclaration mondial (les États-Unis s'appuient sur FATCA et la menace de retenues), et l'Union européenne n'a pas de précédent. Ce n'est pas un outil de plan A.

**Proposition qui tient [C]** :
1. au départ (ou au transfert du siège, assimilé à une cession), on **constate** la plus-value latente et la durée de détention en France ;
2. **pas de dégrèvement automatique** au bout de 2 ou 5 ans ;
3. **sursis de paiement jusqu'à la vente effective**, sans garantie dans l'UE ;
4. à la vente, la France impose **la part du gain réel au prorata des années de détention passées en France**, au barème lissé (§ 6.2), sous déduction de l'impôt payé à l'étranger sur la même part (crédit) ; une baisse de valeur après le départ réduit l'impôt (exigence de *N*) ;
5. **échange automatique d'informations** (directive 2011/16/UE, norme commune de déclaration de l'OCDE) pour connaître la vente ; obligation déclarative annuelle du sursis (déjà dans 167 bis) ;
6. clause de prorata à inscrire dans les conventions à la renégociation (priorité aux pays de destination des départs : Belgique, Suisse, Royaume-Uni, États-Unis, Portugal).

Exemple de l'auteur (A3) : 10 ans en France, vente à 300 M€ un an après le départ : 10/11 du gain imposé en France, **106 M€** (35 % du gain). **Rendement** : non chiffrable avec les données publiques (le rapport annuel sur l'exit tax n'est pas lu ; on ne connaît ni le stock en sursis par pays ni les ventes) ⚠️ V14812. Ordre de grandeur de ce qui est en jeu : 5,75 Md€ d'impositions théoriques fin 2017, presque toutes en sursis.

## 7. Retraités : les pensions dans la fonction, une transition protectrice [B]

**Règle** : à la bascule, chaque pension actuelle est **regroupée** : on fixe le montant versé par la caisse x tel que x + B(x) = pension nette d'aujourd'hui (CSG et IR déduits, `tauxPensionActuel` de modele.js). Le retraité touche exactement la même chose ; ensuite, ses autres revenus (travail, capital) passent dans la même fonction. Les petites pensions sont regroupées vers le bas (la caisse verse moins, l'État verse B > 0), les moyennes vers le haut : l'opération est neutre pour les comptes publics consolidés.

**Option « hautes pensions »** : au-delà de 2 500 € brut, le dépassement n'est pas regroupé (ρ = 0) : il supporte le taux marginal de la fonction (≈ 60 %) au lieu de ≈ 25 à 35 % aujourd'hui.

| Dixième de pension | Brut | Net aujourd'hui | Versé par la caisse (regroupé) | Écart, option ρ = 0 |
|---|---|---|---|---|
| 1 | 742 | 742 | 464 | 0 |
| 2 | 1 040 | 1 040 | 935 | 0 |
| 3 | 1 249 | 1 243 | 1 294 | 0 |
| 4 | 1 444 | 1 411 | 1 617 | 0 |
| 5 | 1 644 | 1 577 | 1 958 | 0 |
| 6 | 1 865 | 1 752 | 2 339 | 0 |
| 7 | 2 125 | 1 945 | 2 786 | 0 |
| 8 | 2 458 | 2 175 | 3 349 | 0 |
| 9 | 2 956 | 2 514 | 3 875 | −133 (−5,3 %) |
| 10 | 4 308 | 3 317 | 5 227 | −433 (−13,1 %) |

Rendement de l'option : **11,2 Md€** (5,6 avec ρ = 0,5). C'est le même ordre de grandeur que la contribution des hautes pensions de la v5.10 (12,0) et que les leviers du chiffrage de la dette stable. **Lien avec la question 27** (document de travail de l'atelier, non publié, P-143 « retraite = socle garanti + complément ») : le regroupement est la forme concrète de « pension − socle » sans perdant ; il rend la voie R inutile comme régime à part. Arbitrage 10 respecté par défaut (ρ = 1 : aucune pension ne change).

## 8. Incidence de la taxe du patrimoine sur les loyers [B, ordre de grandeur]

**Calcul** : impôt annuel moyen sur l'immobilier aujourd'hui (taxe foncière des ménages) : 26,2 / 9 696 Md€ = **0,27 %** de la valeur ; plan A : **1,34 %** sur un logement loué (pas d'allègement de résidence principale), soit **+1,07 point**. La suppression des DMTO (≈ 7,5 % du prix à chaque achat, tous les ≈ 10 ans, soit ≈ 0,75 point par an) en compense une partie : **+0,32 point net** ⚠️ V14813. Rendement locatif brut : 310,5 Md€ de loyers pour ≈ 9 900 Md€ de logements, **3,1 %**. Si la hausse nette était **entièrement** répercutée, les loyers monteraient d'au plus **+10 %** (+34 % sans compter la fin des DMTO).

**Ce que disent les études [A, ⚠️ V14814]** :
- théorie classique (Oates, 1969 ; Hamilton) : une taxe foncière se **capitalise** en grande partie dans les prix, surtout si l'offre est rigide ; le bailleur supporte alors l'impôt sous forme de moins-value ;
- Carroll et Yinger (1994, Boston) : environ **15 %** de la taxe foncière répercutée sur les locataires à court terme ;
- Löffler et Siegloch (Allemagne, hausses locales de la taxe foncière) : répercussion **quasi complète** sur les loyers à moyen terme, dans un pays où la taxe est refacturable aux locataires dans les charges ;
- France : Bérard et Trannoy (hausse des DMTO de 2014) : l'impôt sur les transactions pèse surtout sur les prix et les volumes.

**Lecture [C]** : selon le marché, de **0 à +10 %** à terme (milieu ≈ +5 %), étalé sur plusieurs années ; plus fort dans les zones tendues, où l'offre est rigide. À mettre en regard de l'encadrement des loyers instrumenté (permis de louer, positions du 03/11) et du fait que la refacturation de la taxe dans les charges peut être interdite par la loi.

## 9. Solde, dette et économies nécessaires [B]

| Md€/an, croisière (central) | |
|---|---|
| Solde de la v5.10 (42 %) | +12,5 |
| Fonction des revenus : rendu à la v5.10 | −59,6 |
| Fonction du patrimoine (61,7) + DMTG gardés (20,8) − DMTO supprimés (16,1), à la place du volet patrimoine de la v5.10 (137,3) | −70,8 |
| Capital de départ abandonné (hors plan A) | +14,7 |
| **Solde du plan A** | **−103,2** (≈ 3,5 % du PIB) |

Le déficit qui stabilise la dette est de **3,6 % du PIB** (≈ 108 Md€ ; `variante_dette_stable.js`, macro de référence) : en croisière, le plan A est donc **juste au niveau qui stabilise la dette**. Mais la v5.10 a un creux de recettes dans les années 2030-2040 (pic du taux d'équilibre en 2041) : pendant la transition, la dette monte à **144 %** du PIB à 10 ans, **160 %** à 20 ans, **172 %** à 30 ans (central ; favorable : 88 / 32 / −40 % ; défavorable : 207 / 298 / 392 %). Pour qu'elle ne dépasse jamais 123,5 % (fin 2028), il faut **≈ 62 Md€ d'économies supplémentaires par an** dès 2029 (central). Les leviers chiffrés par l'autre agent (retraites : 0,9 à 3,9 Md€ par option ; masse salariale) sont à additionner ; ils ne suffisent pas seuls ⚠️ V14815.

## 10. Mise en œuvre : retenue à la source, versements, régularisation [C]

- **Prélèvement** : retenue à la source mensuelle sur le **coût employeur** par l'employeur (déclaration sociale nominative, déjà mensuelle) ; par la caisse de retraite pour les pensions ; par l'établissement payeur pour les revenus du capital (comme le PFU aujourd'hui), au taux marginal de la fonction pour le dernier euro connu, pour éviter les rattrapages.
- **Versements négatifs (B > 0)** : versés **chaque mois par un seul payeur public** (la caisse unique de l'allocation, par exemple la CAF fusionnée avec l'Urssaf et la DGFiP particuliers), sur le compte de l'adulte, calculés sur les revenus du mois précédent déclarés par les employeurs (le circuit existe : c'est celui du « montant net social » et de la solidarité à la source).
- **Ménage** : le plancher est calculé chaque mois sur les ressources du ménage connues par la DSN et le répertoire des allocataires ; un seul formulaire de situation (seul, en couple), modifiable en ligne.
- **Régularisation annuelle automatique** : en début d'année, recalcul sur les revenus réels de l'année (dont les gains lissés), remboursement ou reprise étalée sur douze mois.
- **Ce qui reste à côté** : montants par enfant, fonction du patrimoine (avis annuel, paiement différé possible), TVA, accises et fiscalité d'orientation.

## 11. État de la recherche [A, ⚠️ V14816]

- **Impôt négatif et revenu de base** : Friedman (*Capitalism and Freedom*, 1962) propose l'impôt négatif ; expériences américaines de 1968 à 1982 (New Jersey, Seattle-Denver) : baisse modérée des heures travaillées (de l'ordre de 5 à 10 % pour le premier apporteur, plus pour les conjoints) ; Finlande 2017-2018 (2 000 chômeurs, 560 €/mois) : emploi peu changé, bien-être meilleur ; Mincome (Manitoba, 1974-1979) : effets faibles sur l'emploi.
- **Taux marginaux** : Saez (2001), Diamond et Saez (2011) : taux maximal optimal de 60 à 73 % selon l'élasticité ; le plafond de 75 % du modèle est dans le haut de la fourchette.
- **Capital** : Saez et Stantcheva (2018) et la littérature française (évaluation de la réforme de 2018 par France Stratégie) : l'élasticité des dividendes au taux est forte à court terme (reports de distribution), plus faible à long terme.
- **Débattu** : l'incidence des cotisations patronales (qui paie vraiment le coût employeur) ; l'effet du revenu garanti sur les jeunes ; la capacité administrative de calculer un plancher mensuel par ménage sans erreurs.
- **Ce qui manque** : une microsimulation par ménage réel (Ines, OpenFisca sur l'enquête revenus fiscaux) pour remplacer les cas types et les dixièmes reconstitués.

## 12. Droit [A/C]

- **Taux confiscatoire** : décision 2012-662 DC du 29/12/2012 : le Conseil constitutionnel censure la contribution de 75 % et juge excessifs des taux marginaux cumulés proches de 75 % sur certains revenus du capital (cumul impôt + prélèvements sociaux) ⚠️ V14810. Le taux maximal de A3 (65 %) et le TME maximal (70,8 %) restent en dessous.
- **Familialisation** : le quotient familial (art. 194 et 197 du CGI) disparaît ; la Constitution n'impose pas le quotient (le Conseil admet son plafonnement : décisions sur les lois de finances 1998, 2013 ⚠️ V14817) mais exige que les charges de famille soient prises en compte (alinéa 10 du Préambule de 1946) : les 200 € par enfant le font.
- **Individualisation** : B est individuel ; seul le plancher regarde le ménage. Le Conseil admet l'imposition par foyer comme par individu ; une imposition purement individuelle qui ignorerait le conjoint sans revenu n'est pas exigée.
- **UE** : prestations familiales et minima soumis à la coordination des régimes de sécurité sociale (règlement 883/2004) ; un montant par enfant versé par un payeur unique reste une prestation familiale au sens du règlement.

## 13. Hypothèses (H7.x)

- **H7.1** : neutralité lue sur les lignes du bilan global de la v5.10 (§ 2.1), effet calculé par le moteur de la v6 (comparaison à la v5.10 à 42 %, fermeture corrigée).
- **H7.2** : calibrage par grille (S 300 à 500 €, m∞ 50 à 70 %, m0 10 à 45 %, K 500 à 10 000 €, κ 0,55 à 1, enfant 150 ou 200 €, majoration 200 à 345 €) sous les contraintes du ciblage validé, de la neutralité (±2 Md€) et du TME ≤ 75 %.
- **H7.3** : règle de ménage : planchers hors montants par enfant (877 € seul ou parent seul, 1 316 € en couple), retrait de 25 % du gain net ; coût agrégé du plancher par la masse « personne seule » calée sur la dépense de prime d'activité (k ≈ 0,21).
- **H7.4** : dixièmes indicatifs (κ non appliqué dans la quadrature de palier 1).
- **H7.5** : AAH à taux plein 1 033,32 € (différentielle maintenue) ⚠️ V14801.
- **H7.6** : fonction du patrimoine sur taxe_patrimoine.js (assiette nette, paiement différé, exil, gestion) corrigée de l'allègement RP et du surcroît au-delà de 10 M€ ; DMTG gardés (H7.6b).
- **H7.7** : lissage par quotient, plafond 20 ans, part linéaire non lissée.
- **H7.8** : incidence sur les loyers par le rendement locatif brut (3,1 %), DMTO annualisés à 0,75 point.
- **H7.9** : droit actuel des gains : PFU 31,4 % + CEHR, sans abattement de départ à la retraite ni lissage de la CEHR.
- **H7.10** : exit tax au prorata des années de détention, barème lissé.

## Sources mobilisées

| Quoi | D'où | Ce que ça établit |
|---|---|---|
| Lignes du bilan v5.10 | `sources/calculs/bilan_global.py` (exécuté le 05/11/2026) | Le surplus de 58,7 Md€ de la v5.10 sur le périmètre de la fonction |
| Cas types actuels | OpenFisca-France 2026 (`generer_cas_types_0511i.py`, `generer_variante_seuil_0511.py`) | Revenus disponibles d'aujourd'hui |
| Distribution du patrimoine, recettes 2024 | `taxe_patrimoine.js` (Insee Focus 371, comptes de patrimoine 2024, tableau 3.217) | Recette de la fonction du patrimoine, loyers |
| Art. 167 bis, 163-0 A, 150-0 B ter, 223 sexies du CGI | base LEGI locale (`outils/droit/lire_legi.py`, lue le 05/11/2026) | Exit tax actuelle, quotient, report, CEHR |
| Rendement de l'exit tax | QE Sénat n° 05844, réponse du 27/02/2020 (`sources/exil-patrimoines-preuves.md`) | 23 M€/an encaissés, 5,75 Md€ théoriques |
| Arrêts C-9/02 et C-470/04 | CJCE, 11/03/2004 et 07/09/2006 | Sursis de paiement exigé dans l'UE |
| Déficit stabilisant | `variante_dette_stable.js` (autre agent, 05/11) | 3,6 % du PIB |
| Études citées § 8 et § 11 | voir V14814, V14816 | À relire avant publication |

## 14. v7.1 : un seul impôt des sociétés, crédit d'IS pour les résidents (arbitrage 42)

Écrit par Claude le 05/11/2026 au soir, à la demande de l'auteur (arbitrage 42). Module : `modeles/systeme-ideal/bareme_v71.js` ; tests : `test_bareme_v71.js` (51 vérifications). Ne touche ni au bilan adopté ni aux chapitres. Vérifications V15000 à V15012.

### 14.0 En une page

- **La règle [B]** : un seul régime des sociétés (fin du choix IR/IS, du taux réduit PME, des brevets à 10 % et de la taxe au tonnage), IS à **25 %** payé par tous, reports de pertes maintenus. Pour un **résident**, le dividende entre dans R pour son montant **avant IS** et l'IS déjà payé est déduit : la charge totale sur un euro de bénéfice distribué est alors **exactement le taux marginal de la fonction**, comme pour un euro de salaire (65 % au sommet ; 53,3 % sur le dividende net). Les autres revenus du capital (intérêts, loyers, revenus mixtes) comptent à 100 %, et ceux des **retraités** entrent aussi dans la fonction. Pour un **non-résident** : IS plus retenue à la source au plafond conventionnel.
- **Ce que rapporte le capital à 100 % avec crédit [B]** : **+61 Md€/an** de plus que κ = 0,6 (central, barème A3, réaction du capital comprise ; +47 sur les actifs, +14 sur le capital des retraités). Mécanique, sans réaction : +70. Fourchette : +24 (défavorable) à +79 (favorable). Le crédit d'IS rend **6,6 Md€** par rapport à κ = 1 sans crédit : c'est l'ordre de grandeur de 6 Md€ de la première estimation, retrouvé, mais il ne mesurait que l'écart crédit / κ = 1, pas l'écart à κ = 0,6.
- **Le trilemme demeure, plus net [B]** : avec le capital à 100 %, **aucun barème de la forme v6/v7** ne tient ensemble (1) des recettes égales au droit actuel, (2) le ciblage validé (+20 à +80 € en bas, −1 à −3 % en haut) et (3) « le rentier ne gagne pas ». La recherche sur grille (≈ 110 000 barèmes) le montre : sous le ciblage, les recettes dépassent toujours le droit actuel d'au moins **≈ 68 Md€**.
- **Deux calibrages [B]** :
  - **C (ciblage tenu)** : B(R) = **412,5 + 675 × (1 − e^(−R/1 500)) − 0,65 × R**. Bas revenus +58 à +80 €/mois, cadres −3,5 % (10 000 € brut) et −0,1 % (20 000 €), rentier −17 € (dividendes) et −315 € (dividendes + intérêts). **Recettes +71 Md€** au-dessus du droit actuel (≈ 2,4 points de PIB), payées presque entièrement par le dernier dixième et les retraités aisés.
  - **N (neutre)** : B(R) = **825 + 390 × (1 − e^(−R/750)) − 0,67 × R**. Recettes égales au droit actuel (+0,3 Md€), rentier −15 € et −290 €, mais la redistribution n'est plus modeste : Smic seul **+137 €**, couple à deux Smic avec deux enfants **+538 €**, couple médian **+649 €**, cadres **−6,0 %** et **−4,1 %**.
- **Rentier [B]** : il ne gagne plus dans aucun des deux (il gagnait +604 €, +18 %, avec κ = 0,6).
- **Gros gains [B]** : 1 M€ après 20 ans : **61 %** avec lissage (C) au lieu de 34 % aujourd'hui ; 50 M€ : 65 %. Le lissage ne change presque rien au-delà d'1 M€.
- **TME [B]** : 70,5 % au plus (C), 67 % (N) ; aucune trappe.
- **Dette [B]** : C stabilise la dette sans économies supplémentaires (96 % du PIB à 30 ans au central) ; N demande, comme la v7, **≈ 61 Md€** d'économies de plus par an.
- **Non-résidents [A/B]** : la France prélève **déjà** au plafond conventionnel (art. 187 du CGI : 25 % pour les personnes morales, plafonné par les conventions ; 0 % dans l'UE sous la directive mère-fille) ; seul le taux des personnes physiques (12,8 %) est sous le plafond usuel de 15 % : gain **≈ 0,03 Md€**. Taux conventionnel moyen pondéré ≈ **7 %** (ordre de grandeur). « Taxer les étrangers comme les résidents » ne passe que par l'**IS** lui-même (la moitié du CAC 40 est détenue par des non-résidents).
- **Recommandation [C]** : ne pas présenter « capital taxé comme le travail » et « recettes égales » et « redistribution modeste » ensemble. Choisir : **C** (le surcroît de 71 Md€ finance la stabilisation de la dette, ce qui contredit « la dette par les économies » de l'arbitrage 41) ou **N** (neutre, franchement redistributif) ; ou rendre une partie du surcroît au capital par la **fonction du patrimoine** (§ 14.8). Je recommande de soumettre ce choix à l'auteur tel quel, avec C comme base des cas types parce qu'il garde sa cible.

### 14.1 Données : travail et capital par dixième, dividendes [A/B]

Bandes de salariés de `modele.js` (27,0 M d'adultes, euros 2024, après les réactions de la v5.8 ; le capital des retraités, 20 % du capital courant, est à part, § 14.4). Le capital courant (402,5 Md€) comprend revenus mixtes 121,9, loyers 40,9, intérêts 71,7, dividendes 74,9, assurance vie 67,5, plus-values 25,6 (comptes nationaux 2024).

| Dixième | Adultes (M) | Travail €/mois | Capital €/mois | Part du capital | Part des dividendes dans le capital | Travail Md€ | Capital Md€ | Dividendes Md€ |
|---|---|---|---|---|---|---|---|---|
| D1 | 2,70 | 1 881 | 107 | 5,4 % | 3,8 % | 61,0 | 3,5 | 0,1 |
| D2 | 2,70 | 2 296 | 170 | 6,9 % | 3,8 % | 74,4 | 5,5 | 0,2 |
| D3 | 2,70 | 2 604 | 205 | 7,3 % | 3,8 % | 84,4 | 6,7 | 0,3 |
| D4 | 2,70 | 2 996 | 250 | 7,7 % | 3,8 % | 97,2 | 8,1 | 0,3 |
| D5 | 2,70 | 3 295 | 257 | 7,2 % | 3,8 % | 106,8 | 8,3 | 0,3 |
| D6 | 2,70 | 3 720 | 313 | 7,8 % | 3,8 % | 120,6 | 10,1 | 0,4 |
| D7 | 2,70 | 4 212 | 389 | 8,5 % | 3,8 % | 136,6 | 12,6 | 0,5 |
| D8 | 2,70 | 5 014 | 554 | 10,0 % | 3,8 % | 162,6 | 18,0 | 0,7 |
| D9 | 2,70 | 6 183 | 834 | 11,9 % | 3,8 % | 200,5 | 27,0 | 1,0 |
| D10 (P90-95) | 1,35 | 8 254 | 2 057 | 20,0 % | 7,2 % | 133,8 | 33,4 | 2,4 |
| D10 (P95-98) | 0,81 | 11 137 | 3 452 | 23,7 % | 8,5 % | 108,3 | 33,6 | 2,9 |
| D10 (P98-99) | 0,27 | 15 356 | 5 956 | 27,9 % | 12,4 % | 49,8 | 19,3 | 2,4 |
| 1 % (P99-99,9) | 0,24 | 24 533 | 13 588 | 35,6 % | 28,2 % | 69,7 | 38,6 | 10,9 |
| 0,1 % | 0,026 | 73 310 | 129 902 | 63,9 % | 84,4 % | 23,0 | 40,8 | 34,4 |
| **Total** | 27,0 | | | | | **1 428,7** | **265,5** | **56,8** |

Les dividendes des actifs (80 % de 74,9 Md€, ramenés à l'assiette après réactions : 47,7 Md€) sont répartis selon la concentration observée : **62 % des dividendes vont aux 0,1 % des foyers** (France Stratégie, *Point de vue* du 20/10/2022 sur les distributions de 2020 ; Comité d'évaluation des réformes de la fiscalité du capital, rapport du 29/10/2021, sur 2019) [^v71-fs] ; la part du capital d'une bande est plafonnée à 80 %, ce qui ramène la bande des 0,1 % à 53 %, l'excédent passant au 1 %. S'y ajoutent les **9,0 Md€** de bénéfices retenus des holdings imputés aux associés (bande des 0,1 %), qui ont supporté l'IS et ouvrent le crédit. ⚠️ V15000 (répartition par bande), V15001 (part des dividendes dans le capital des retraités : 10 / 15 / 30 %).

### 14.2 L'IS, réel et en régime [A/B]

- **Réel [A]** : 68,0 Md€ en 2024 en comptabilité nationale (Insee, `modele.js`) ; **57,4 Md€** d'IS net au budget de l'État en 2024, 58,2 révisé pour 2025 et 59,0 prévu pour 2026 (PLF 2026, *Évaluation des voies et moyens*, t. I) [^v71-vm] ; ≈ 62 Md€ net encaissés en 2025 selon la DGFiP, plus 7,5 Md€ de contribution exceptionnelle des grandes entreprises (temporaire, non comptée) ⚠️ V15002.
- **Droit [A]** : taux normal 25 % ; taux réduit 15 % jusqu'à 42 500 € de bénéfice pour un chiffre d'affaires ≤ 10 M€ (art. 219 I b du CGI, base LEGI, version en vigueur au 21/02/2026) ; plus-values à long terme imposées à part (art. 219 I a).
- **En régime (régime unique, 25 %) [B]** : 68,0 + suppression du taux réduit PME (≈ 2,8 Md€, chiffre cité en commission des finances, ⚠️ V15003), de la taxation des brevets à 10 % (1,26 Md€ en 2025, Voies et moyens t. II, dépense 210326) et de la taxe au tonnage (0,62 Md€ en 2026, 1,44 en 2025, dépense 320119), moins 25 % de perte (réorganisations, brevets localisés ailleurs ; 10 à 50 %, ⚠️ V15004) : **71,5 Md€, soit +3,5** (de +2,3 à +4,2).
- **Variante à taux plus élevé [B]** : 28 % : +10,3 Md€ d'IS (semi-élasticité de déplacement des bénéfices 0,8 % par point, Heckemeyer et Overesch 2017, `modele.js`) ; 30 % : +14,5. Mais le crédit des résidents monte d'autant sur les bénéfices distribués : sur le calibrage C, passer à 28 % ne rapporte net que **+4,1 Md€** (l'IS supplémentaire des résidents leur est rendu). **Elle n'est pas nécessaire à la neutralité** (le capital à 100 % crée un surplus, pas un manque) ; je retiens **25 %**. Elle n'aurait d'intérêt que pour faire payer davantage les actionnaires non résidents, au prix d'un taux parmi les plus élevés de l'UE.

### 14.3 Ce que rapporte le capital à 100 % avec crédit, par rapport à κ = 0,6 [B]

Même barème (A3 de la v7), Md€/an, central, écart au droit actuel des lignes concernées :

| | κ = 0,6 (v7) | κ = 1 sans crédit | **100 % avec crédit (v7.1)** | v7.1 − κ = 0,6 |
|---|---|---|---|---|
| Actifs (bandes, avec réaction du capital) | −43,6 | +8,7 | +3,2 | **+46,8** |
| Capital des retraités (contre le PFU) | +3,4 | +18,5 | +17,2 | **+13,8** |
| **Total** | | | | **+60,6** |
| Sans réaction du capital | | | | +69,8 |
| Favorable / défavorable | | | | +78,8 / +24,4 |
| Sans transparence des holdings (rétention non rattrapée) | | | | +30,8 |

**Méthode.** Le moteur de la v6 compare tout à la v5.10 (qui compte déjà le capital à 100 %, sans crédit). La v7.1 réécrit sa partie « haut » : dans chaque bande, la part φ du capital qui est un dividende entre dans R pour D / (1 − 25 %), l'IS déjà payé est déduit ; le reste compte à 100 %. **Réaction du capital (H71.4)** : la règle de `modele.js` (élasticité 0,5 / 1 / 2 au taux net, bornes 0,2 et 1,5, la perte atténuée par la transparence des holdings et la part qui revient plus tard), appliquée en rapport des niveaux mesurés depuis le PFU, pour que la v5.10 et la v7.1 soient traitées de la même façon. La v7 n'avait pas cette réaction : avec elle, le κ = 0,6 de la v7 rendait 43,6 Md€ au lieu de 52,7.

**Le capital des retraités** : la v5.10 et la v7 le laissaient au droit actuel (ligne N01 du bilan : « les retraités paient comme aujourd'hui »). L'arbitrage 42 dit « le dividende entre dans la fonction des revenus » pour les résidents : il entre donc, au-dessus de la pension regroupée à net constant. C'est **+14 Md€ par rapport à κ = 0,6**, payés surtout par les deux derniers dixièmes de pension (le 10e : 1 057 €/mois de capital, impôt de 317 € aujourd'hui, 584 € en v7.1).

**Mécanique du crédit (vérifiée)** : bénéfice de 100 €, IS 25 € ; dividende 75 €, compté 100 € dans R ; au taux marginal de 65 %, impôt 65 €, moins 25 € de crédit : 40 € ; total 25 + 40 = **65 €**, comme pour 100 € de salaire en coût employeur. Aujourd'hui : 25 + 75 × 31,4 % = **48,6 €**.

### 14.4 Recalibrage : la formule et sa table [B]

**Calibrage C (ciblage tenu, recommandé comme base des cas types)** : S = 412,5 €, m0 = 20 %, m∞ = 65 %, K = 1 500 € :

**B(R) = 1 087,5 − 675 × e^(−R/1 500) − 0,65 × R** ; taux marginal m(R) = 0,65 − 0,45 × e^(−R/1 500) ; point neutre (B = 0) : 1 209 €/mois.

| R (€/mois) | B C | taux moyen net C | marginal C | B N | taux moyen net N | marginal N |
|---|---|---|---|---|---|---|
| 0 | +413 | — | 20,0 % | +825 | — | 15,0 % |
| 500 | +279 | −56 % | 32,8 % | +680 | −136 % | 40,3 % |
| 1 000 | +91 | −9 % | 41,9 % | +442 | −44 % | 53,3 % |
| 1 500 | −136 | 9 % | 48,4 % | +157 | −10 % | 60,0 % |
| 2 000 | −390 | 20 % | 53,1 % | −152 | 8 % | 63,4 % |
| 3 000 | −954 | 32 % | 58,9 % | −802 | 27 % | 66,0 % |
| 5 000 | −2 187 | 44 % | 63,4 % | −2 135 | 43 % | 66,9 % |
| 10 000 | −5 413 | 54 % | 64,9 % | −5 485 | 55 % | 67,0 % |
| 50 000 | −31 413 | 63 % | 65,0 % | −32 285 | 65 % | 67,0 % |

**Calibrage N (neutre)** : S = 825 €, m0 = 15 %, m∞ = 67 %, K = 750 € : **B(R) = 1 215 − 390 × e^(−R/750) − 0,67 × R** ; point neutre 1 758 €/mois. Mêmes montants par enfant (200 €, 250 € de majoration pour un parent seul) et même règle de plancher que la v7 dans les deux.

**Pourquoi pas mieux (H71.8)** : grille S 375 à 900 €, m∞ 50 à 72 %, m0 5 à 40 %, K 500 à 2 500 € ; contraintes : bas revenus ≥ +20 €, rentiers ≤ 0, TME ≤ 75 %, puis ciblage (bas ≤ +80,5 €, cadre à 10 000 € entre −3,5 % et −0,5 %, à 20 000 € ≤ 0) ou neutralité (−2 à +0,5 Md€). Sous le ciblage, l'écart minimal est de +68 Md€ ; à la neutralité, le barème le plus proche de la cible est N. **La raison est arithmétique** : rendre ≈ 70 Md€ sans dépasser +80 € en bas ni alléger le haut oblige à les rendre au milieu (≈ 20 M d'adultes, ≈ +250 €/mois chacun) ; et alléger le haut (m∞ plus bas) fait regagner le rentier. Deux limites communes à C et N : le cadre à 20 000 € brut reste vers 0 % dans C (la forme ne sait pas prendre −2 % à 10 000 € et à 20 000 € à la fois, comme dans la v7) ; le couple médian gagne +400 € dans C (montants par enfant, comme la v7).

### 14.5 Cas types (€/mois, écart au droit actuel ; OpenFisca-France 2026, locataire zone 2)

| Cas | Aujourd'hui | C | écart C | N | écart N |
|---|---|---|---|---|---|
| Célibataire au Smic | 1 706 | 1 770 | **+64** (+3,8 %) | 1 843 | +137 |
| Salarié seul, 1 500 € net | 1 723 | 1 785 | **+62** | 1 858 | +136 |
| Salarié seul, 1 750 € net | 1 868 | 1 948 | **+80** | 2 031 | +162 |
| Salarié seul, 2 000 € net | 1 977 | 2 115 | +138 | 2 211 | +235 |
| Salarié seul, 2 500 € net | 2 357 | 2 488 | +131 | 2 574 | +218 |
| Salarié seul, 3 000 € net | 2 736 | 2 825 | +89 | 2 875 | +139 |
| Parent isolé au Smic, 2 enfants | 2 590 | 2 670 | **+80** | 2 743 | +153 |
| Couple à deux Smic, 2 enfants | 3 549 | 3 608 | **+58** | 4 087 | +538 |
| Couple à deux Smic, sans enfant | 3 088 | 3 208 | +119 | 3 687 | +599 |
| Couple médian, 2 enfants | 4 424 | 4 823 | +400 (+9,0 %) | 5 073 | +649 |
| Cadre, 5 000 € brut | 3 429 | 3 475 | +45 (+1,3 %) | 3 472 | +43 |
| Cadre, 10 000 € brut | 6 276 | 6 057 | **−219 (−3,5 %)** | 5 901 | −375 (−6,0 %) |
| Cadre, 20 000 € brut | 11 038 | 11 027 | −10 (−0,1 %) | 10 587 | −451 (−4,1 %) |
| Sans emploi (RSA + aide au logement) | 877 | 877 | 0 | 877 | 0 |
| AAH à taux plein | 1 033 | 1 033 | 0 | 1 033 | 0 |
| Indépendant, 3 000 € de revenu d'activité | n.d. | 2 102 | n.d. | 2 198 | n.d. |
| Rentier, 5 000 € de dividendes | 3 430 | 3 413 | **−17** (−0,5 %) | 3 415 | −15 |
| Rentier, 2 500 € de dividendes + 2 500 € d'intérêts | 3 430 | 3 115 | **−315** (−9,2 %) | 3 140 | −290 |
| Retraité, pension médiane (1 644 € brut), sans capital | 1 577 | 1 577 | 0 | 1 577 | 0 |
| Retraité, pension médiane + 500 € de dividendes | 1 920 | 1 878 | −43 (−2,2 %) | 1 838 | −83 |
| Retraité, 10e dixième (4 308 € brut) + 2 000 € de capital | 4 689 | 4 141 | −548 (−11,7 %) | 4 087 | −602 |

**Le haut, vu par bande [B, mécanique]** : par rapport à la v7 (κ = 0,6), la v7.1 C prend de 0,6 % (D1) à 5,3 % (D9) du revenu disponible, puis **10 à 14 %** dans le dernier dixième et **17 à 20 %** au 1 % et au 0,1 %. Le cadre sans capital reste dans la cible ; le **dernier dixième pris en bloc ne l'est pas** (son capital paie). La cible « −1 à −3 % en haut » et « capital comme le travail » se contredisent pour quiconque a du capital ⚠️ V15009.

### 14.6 Rentier, gros gains, taux marginaux [B]

- **Rentier** : il ne gagne plus. En dividendes purs, il est presque au niveau d'aujourd'hui (−17 €) : le crédit d'IS et le PFU donnent des charges voisines à ce niveau de revenu (6 667 € avant IS, taux marginal 63 %) ; en intérêts, il perd nettement (les intérêts passent de 31,4 % à 59 à 63 % à la marge). C'est le résultat voulu : avec κ = 0,6, il gagnait +604 €.
- **Gros gains (C, Smic pendant 20 ans, prix de revient négligeable)** : 1 M€ : 648 k€ sans lissage (64,8 %), **610 k€ avec (61,0 %)**, 342 k€ aujourd'hui (34,2 %) ; 5 M€ : 3,25 M€ / **3,21 M€ (64,1 %)** / 1,76 M€ ; 50 M€ : 32,5 / **32,5 M€ (64,9 %)** / 17,7 M€. Avec N : 66,3 %, 66,9 %, 67,0 %. **Point dur [C]** : une plus-value sur titres reflète en partie des bénéfices retenus qui ont déjà payé l'IS ; sans crédit sur les plus-values, la charge totale dépasse celle du travail. Piste : crédit d'IS forfaitaire sur la part de la plus-value égale aux réserves accumulées (non chiffré, ⚠️ V15010).
- **Taux marginaux effectifs** : C : **70,5 %** au plus (personne seule, fin du plancher, vers 3 525 €) ; 65,6 % de 1 à 1,1 Smic ; participation : 45 % du coût employeur perdu de 0 à 0,25 Smic, 55 % de 0 au Smic ; **aucune trappe**. N : 67,0 % au plus (asymptote), 63,9 % au Smic. Sur un bénéfice distribué : IS + fonction = 65 % (C), 67 % (N) ; sous 75 % dans les deux.

### 14.7 Non-résidents, déficit et dette [A/B]

**Retenue à la source [A]** : art. 187 du CGI (base LEGI, version en vigueur au 16/02/2025) : 25 % (taux normal de l'IS) pour les personnes morales, 12,8 % pour les personnes physiques, 75 % vers un État ou territoire non coopératif ; les conventions plafonnent en général à 15 % sur les dividendes de portefeuille et à 0 ou 5 % sur les participations (modèle OCDE, art. 10 § 2) ; exonération dans l'UE pour les sociétés mères (directive 2011/96/UE, art. 119 ter du CGI) et, par le droit de l'UE (libre circulation des capitaux), pour les fonds comparables aux OPC français. **Détention [A]** : les non-résidents détiennent **50 %** du CAC 40 fin 2024 (1 083 Md€ sur 2 165) et 32 % des autres sociétés cotées (Banque de France, *Bulletin* n° 261, art. 3, décembre 2025) [^v71-bdf]. **Ordre de grandeur [B]** : dividendes versés aux non-résidents ≈ 45 Md€/an ⚠️ V15005 ; taux conventionnel moyen pondéré ≈ **7 %** (portefeuille 55 % à ≈ 12 % effectif, participations UE 30 % à 0 %, participations hors UE 15 % à ≈ 4 %) ⚠️ V15006, soit ≈ 3 Md€ ; passer « au maximum conventionnel » ne relève que les personnes physiques de 12,8 % à 15 % : **+0,03 Md€** ⚠️ V15007. Le risque à surveiller n'est pas le taux mais l'**arbitrage de dividendes** (« cum-cum » : prêt des titres à un résident ou à un fonds exonéré autour de la date de détachement ; durci par la loi de finances pour 2025, art. 119 bis A).

**Solde et dette (même construction que la v7 : solde de la v5.10 à 42 % + écart du plan A, constant dès 2029) [B]** :

| Md€/an, croisière, central | C | N |
|---|---|---|
| Fonction des revenus (actifs) par rapport à la v5.10 | −8,5 | −81,0 |
| Capital des retraités dans la fonction | +17,1 | +19,0 |
| IS en régime unique | +3,5 | +3,5 |
| Retenue au plafond conventionnel | +0,03 | +0,03 |
| **Écart des recettes au droit actuel** | **+70,9** (65,2 à 74,0) | **+0,3** (−9,0 à +13,0) |
| Solde public de croisière (2060) | **−31,5** (≈ 1,1 % du PIB) | −102,0 (≈ 3,5 %) |
| Dette / PIB à 10, 20, 30 ans (central) | 120 %, 111 %, 96 % | 143 %, 159 %, 171 % |
| Économies supplémentaires pour ne jamais dépasser 123,5 % | **0** (défavorable : 208) | **61** (défavorable : 291) |

### 14.8 Une troisième voie : rendre le surcroît par la fonction du patrimoine [B/C]

Si le capital paie désormais comme le travail sur son revenu, la taxe annuelle sur le patrimoine (pensée comme une « taxe Zucman pour tous » quand le capital était peu taxé) peut s'alléger. Ordres de grandeur (`taxe_patrimoine.js` via la v7) : ramener le taux général de 1,34 % à **0,2 %** rend ≈ **30 Md€** (la part fixe de 0,5 % sur les 300 000 premiers euros de la résidence principale reste) ; supprimer en plus les droits de succession et de donation, gardés dans le plan A, rend 20,8 Md€. Total ≈ 51 Md€ : il manque ≈ 20 Md€ pour la neutralité avec le barème C. **[C]** C'est la voie la plus cohérente avec « capital taxé comme le travail » (on ne taxe pas deux fois le même capital), mais elle profite d'abord aux patrimoines élevés et elle renonce à l'idée d'une taxe Zucman ; elle n'est pas chiffrée en détail (cas types patrimoniaux à faire, ⚠️ V15011).

### 14.9 Risques [A/C]

1. **Rétention des bénéfices (le plus lourd)** : distribuer coûte 53 % (C) au résident, garder dans la société 25 % seulement. Sans la transparence des holdings de la v5.10 (imputation des bénéfices retenus des holdings passives aux associés), le surcroît du capital tombe de 61 à **31 Md€** (§ 14.3). Précédent : la barémisation des dividendes de 2013 a fait chuter les distributions, le PFU de 2018 les a fait remonter d'≈ 15 % (IPP, note n° 46, octobre 2019) ⚠️ V15012. Parade : garder la transparence des holdings et la fonction du patrimoine sur les parts de sociétés.
2. **Passage à l'IS des sociétés de personnes** (SCI, SNC, SARL de famille) : leurs bénéfices retenus ne paient plus que 25 % ; à l'inverse de l'objectif « un seul régime », c'est un report d'impôt. Ordre de grandeur : 10 Md€ retenus coûteraient ≈ 3 Md€/an (écart de 30 points entre la fonction et l'IS), en partie rattrapés à la distribution ou par la fonction du patrimoine (non chiffré).
3. **Transferts de bénéfices et prix de transfert** : à 25 %, rien ne change par rapport à aujourd'hui ; à 28 ou 30 %, perte de 2,4 à 4 % de la base (semi-élasticité 0,8 % par point) ; suppression de la taxation des brevets à 10 % : risque de localisation des brevets à l'étranger (régimes de « boîte à brevets » dans d'autres États de l'UE, compatibles avec l'action 5 du BEPS sous condition de lien).
4. **Conventions fiscales** : le crédit est réservé aux résidents (les conventions françaises ne prévoient plus d'avoir fiscal pour les non-résidents depuis sa suppression en 2005) ; un crédit réservé aux dividendes de sociétés françaises serait contraire à la libre circulation des capitaux (CJCE, *Manninen*, C-319/02, 07/09/2004 ; *Meilicke*, C-292/04, 06/03/2007 : un avoir fiscal limité aux dividendes nationaux est incompatible) : **le crédit doit couvrir aussi l'impôt étranger sur les sociétés** pour les dividendes de sociétés de l'UE, ce qui en augmente le coût (non chiffré, ⚠️ V15008).
5. **Pilier 2 (impôt minimum mondial de 15 %, directive (UE) 2022/2523)** : il vise les groupes de plus de 750 M€ de chiffre d'affaires ; un IS à 25 % sans taux réduits reste au-dessus de 15 % de taux effectif ; la suppression des régimes à 10 % (brevets) et du tonnage réduit le risque d'impôt complémentaire. Les crédits d'impôt remboursables (CIR) sont traités comme des revenus, non comme une baisse d'impôt : pas de conflit. Le crédit d'IS des actionnaires résidents est un impôt personnel : hors du champ du pilier 2.
6. **Constitution** : charge totale sur les dividendes et les gains de 65 à 67 % au sommet ; le Conseil constitutionnel a jugé confiscatoires des taux marginaux proches de 75 % sur certains revenus du capital (décision 2012-662 DC, ⚠️ V14810) : marge faible mais respectée.

### 14.10 Hypothèses (H71.x)

- **H71.1** : IS en régime = 68,0 Md€ (CN 2024) + régimes particuliers supprimés (PME 2,8, brevets 1,26, tonnage 0,62) × (1 − 10 / 25 / 50 %) × t / 25 % ; déplacement des bénéfices de `modele.js`.
- **H71.2** : dividendes des actifs = 80 % de 74,9 Md€, ramenés à l'assiette après réactions ; répartition par bande (8 % aux dixièmes 1 à 9 au prorata du capital, 5 / 6 / 5 % aux trois sous-bandes du 10e, 14 % au 1 %, 62 % au 0,1 %), plafond de 80 % ; holdings imputées créditées.
- **H71.3** : retenue au plafond conventionnel ; 45 Md€ de dividendes versés aux non-résidents, 5 % à des personnes physiques, 70 % dans des pays à plafond de 15 %.
- **H71.4** : réaction du capital au taux, règle de `modele.js` en rapport des niveaux depuis le PFU ; **H71.4b** : couverture par la transparence des holdings (0,9 / 0,7 / 0,5 ; sensibilité à 0).
- **H71.5** : dividende mesuré au taux d'IS actuel (25 %) ; à un autre taux, le bénéfice avant IS est inchangé et le crédit suit le taux.
- **H71.6** : capital des retraités (20 % du capital courant, clé de `modele.js`) dans la fonction au-dessus de la pension regroupée ; droit actuel : PFU de 30 % ; part des dividendes 10 / 15 / 30 %.
- **H71.7** : pas de crédit d'IS sur les plus-values ; lissage de la v7.
- **H71.8** : calibrage par grille (§ 14.4).

### Sources mobilisées (v7.1)

| Quoi | D'où | Ce que ça établit |
|---|---|---|
| Taux de l'IS, taux réduit PME | Art. 219 du CGI, base LEGI (`outils/droit/lire_legi.py`, version en vigueur au 21/02/2026, lue le 05/11/2026) | 25 % ; 15 % jusqu'à 42 500 € si CA ≤ 10 M€ |
| Retenue à la source | Art. 187 du CGI, base LEGI (version en vigueur au 16/02/2025, lue le 05/11/2026) | 25 % (personnes morales), 12,8 % (personnes physiques), 75 % (ETNC) |
| Recette de l'IS | [PLF 2026, Évaluation des voies et moyens, t. I](https://www.assemblee-nationale.fr/dyn/contenu/visualisation/1087930/file/PLF%202026%20-%20V%26M%20TI%20-%20Evaluations%20des%20recettes.pdf) (consulté le 05/11/2026, résumé de recherche) | 57,4 Md€ (2024), 58,2 (2025), 59,0 (2026) |
| Dépenses fiscales brevets et tonnage | `sources/inventaire-niches-fiscales.csv` (Voies et moyens t. II) | 1,26 et 0,62 Md€ |
| Détention du CAC 40 | [Banque de France, Bulletin n° 261, art. 3](https://www.banque-france.fr/fr/publications-et-statistiques/publications/la-detention-des-actions-des-societes-francaises-du-cac-40-par-les-non-residents-augmente-tres) (décembre 2025, consulté le 05/11/2026, résumé) | 50 % fin 2024 ; 32 % hors CAC 40 |
| Concentration des dividendes | [France Stratégie, Point de vue, 20/10/2022](https://www.strategie-plan.gouv.fr/files/files/Publications/Points%20de%20vue/2022-10-20%20-%20Point%20de%20vue%20Gros%20dividendes%20-%20Plus-values/FS-2022-PDV_Distribution%20dividendes%20en%202020_20oct.pdf) (consulté le 05/11/2026, résumé) | 62 % des dividendes aux 0,1 % des foyers (2020) |
| Effet du PFU sur les dividendes | [IPP, note n° 46, octobre 2019](https://halshs.archives-ouvertes.fr/halshs-02515791v1/file/n46-notesIPP-octobre2019.pdf) (résumé) | ≈ +15 % de dividendes en 2018 |

[^v71-fs]: France Stratégie, « Point de vue : distribution des dividendes en 2020 », 20/10/2022, https://www.strategie-plan.gouv.fr/ (lien ci-dessus), consulté le 05/11/2026 par résumé de moteur de recherche ; Comité d'évaluation des réformes de la fiscalité du capital, rapport du 29/10/2021. À lire en entier (V15000).
[^v71-vm]: Assemblée nationale, PLF 2026, Évaluation des voies et moyens, tome I, consulté le 05/11/2026 par résumé (V15002).
[^v71-bdf]: Banque de France, F. Renouard, « La détention des actions des sociétés françaises du CAC 40 par les non-résidents augmente très légèrement en 2024 », Bulletin n° 261, art. 3, décembre 2025, consulté le 05/11/2026 par résumé.

## 15. v7.3 proposée (06/11/2026, NON ADOPTÉE) : une fonction du patrimoine « qui a du sens », la dette d'abord

**Ce que cette section fait.** L'auteur demande une courbe du patrimoine lisible : taux moyen ≈ 0 pour les petits patrimoines, ≈ 0,5 % vers 300 000 € (le niveau d'une taxe foncière de résidence principale), 1 % vers 1 M€, 2 % pour les très grandes fortunes, continue, sans seuil à 100 M€. La recette monte ; le surplus comble d'abord le manque de la dette de la v7.2, puis allège la fonction des revenus. Module `modeles/systeme-ideal/decisions_0611_v73.js`, test `test_decisions_0611_v73.js` (57 vérifications), ce texte par `rapport_decisions_0611_v73.js`. Tout le reste est la v7.2. Euros de 2025 ; ordres de grandeur sous hypothèses (H73.x), pas des prédictions.

### 15.0 En une page
- **Patrimoine, une phrase** : « on paie chaque année 2 % × W / (W + 1 M€) de son patrimoine net » : la moitié de 2 % à 1 M€, presque rien en dessous de 100 000 €, presque 2 % au-delà de 10 M€.
- **Formule** [B] : **τ(W) = 2 % × W / (W + 1 M€)** ; taxe annuelle **P(W) = 2 % × W² / (W + 1 M€)** ; taux marginal 2 % × (1 − (1 M€ / (W + 1 M€))²), de 0 au premier euro à 2 %, sans jamais le dépasser : ni seuil ni marche.
- **Recette** [B] : **66,2 Md€** au central (83,6 favorable, 47,8 défavorable), contre 26,3 en v7.2 et 61,7 pour les impôts remplacés (taxe foncière, IFI, DMTO) ; après le plafond de 75 % au sommet (−6,6), le gain sur la v7.2 est de **+35,5 Md€**.
- **Usage** [C, règle de l'auteur] : 29,5 Md€ comblent le manque de la dette de la v7.2 ; 5,3 Md€ allègent la fonction des revenus : **B(R) = 412,5 + 785 × (1 − e^(−R/2000)) − 0,655 × R**.
- **Dette** [B] : avec la combinaison recommandée (R1f, M1m, M2m, M3), **plus aucun manque en macro de référence** (dette à 30 ans 102,3 %) ; il manque encore 28,3 Md€/an en macro prudente.
- **Prélèvements obligatoires** [B] : 50,7 % du PIB (v7.2 49,7 %, aujourd'hui 42,7 %) ; nets des transferts 47,1 %. **On prélève ≈ 30 Md€ de plus que la v7.2 : c'est le prix de la dette stabilisée.**
- **Qui paie** [B] : la résidence de 300 000 € paie moins qu'aujourd'hui (Grenoble : 1 385 €/an au lieu de 2 650) ; la résidence de 1 M€ paie 10 000 €/an au lieu de ≈ 2 700 ; le rentier à 2 M€ paie 75 % de son revenu ; au-delà de quelques millions, revenus et patrimoine réunis dépassent 100 % du revenu et **c'est le plafond de 75 % qui fait la loi** (voir 15.6).

### 15.1 La fonction du patrimoine [B]

| W (valeur nette) | taux moyen | taxe annuelle | taux marginal | v7.2 : taxe annuelle |
|---|---|---|---|---|
| 50 k€ | 0,10 % | 48 € | 0,19 % | 101 € |
| 100 k€ | 0,18 % | 182 € | 0,35 % | 205 € |
| 300 k€ | 0,46 % | 1 385 € | 0,82 % | 642 € |
| 1 M€ | 1,00 % | 10 000 € | 1,50 % | 2 464 € |
| 3 M€ | 1,50 % | 45 000 € | 1,88 % | 10 038 € |
| 10 M€ | 1,82 % | 181 818 € | 1,98 % | 59 966 € |
| 100 M€ | 1,98 % | 1 980 198 € | 2,00 % | 1 658 983 € |
| 1 Md€ | 2,00 % | 19 980 020 € | 2,00 % | 19 657 185 € |

Repères de l'auteur : 0,46 % à 300 000 € (cible ≈ 0,5 %), 1,00 % à 1 M€ (cible ≈ 1 %), 1,98 % à 100 M€ (cible 2 %). Variante K = 900 000 € : 0,50 % à 300 000 €, 1,05 % à 1 M€ (+2,4 Md€ de recette nette avant plafond ; non retenue : la phrase « la moitié de 2 % à 1 M€ » est plus simple). Vérifications (test) : taux moyen et marginal croissants partout de 0 à 3 Md€, marginal maximal 2 % jamais atteint, dérivée continue.

### 15.2 Recette, exil, érosion [B]
Même chaîne que `taxe_patrimoine.js` (assiette nette, valorisations, effet de prix, paiement différé, gestion), mais **taux par composante** et **érosion ménage par ménage** : chaque ménage de l'enquête HVP (recalée × 1,4 sur les comptes nationaux) a son taux τ(W) ; son capital mobile s'érode selon e(τ) = 1 − (1 − e1)^(τ / 1 %) (loi exponentielle de `grandes_fortunes_0511.js`, égale à la loi linéaire de `taxe_patrimoine.js` à 1 %) ; l'exil emporte 20 / 74 de l'érosion (CAE, Focus n° 118) et 2,2 %/an d'autres impôts par euro parti. Contrôle : à taux plat de 1 %, on retrouve exactement la recette de `taxe_patrimoine.js` (72,9 Md€).

| Md€/an | favorable | central | défavorable |
|---|---|---|---|
| taux effectif moyen (immobilier) | 0,99 % (0,86 %) | 0,99 % (0,86 %) | 0,99 % (0,86 %) |
| effet de prix sur l'immobilier | −5,0 % | −13,0 % | −22,5 % |
| érosion du capital mobile : 1 % le mieux doté / reste | 32 % / 5 % | 59 % / 15 % | 90 % / 30 % |
| recette brute (immobilier + mobile) | 86,2 (64,7 + 21,5) | 71,4 (56,8 + 14,6) | 55,4 (48,4 + 7,0) |
| exil (autres impôts perdus) | −2,22 | −4,09 | −5,85 |
| gestion ; différé non recouvré | −0,43 ; −0,00 | −0,71 ; −0,33 | −1,11 ; −0,69 |
| **recette nette** | **83,6** | **66,2** | **47,8** |
| plafond de 75 % au sommet : excédent ; perdu après report (H73.7) | 14,0 ; −3,5 | 13,2 ; −6,6 | 11,8 ; −8,9 |
| gain du volet patrimoine sur la v7.2 | +53,5 | +35,5 | +17,8 |

Comparaisons (central) : v7.2 26,3 Md€ ; impôts remplacés 61,7 (taxe foncière 42,9, IFI 2,7, DMTO 16,1) ; taxe plate de 1 % de la v5.10 86,4. La v7.3 prélève donc ≈ 4,5 Md€ de plus sur le patrimoine qu'aujourd'hui, en échange des droits de mutation (DMTO) supprimés.

### 15.3 La fonction des revenus allégée [B]
**B(R) = 412,5 + 785 × (1 − e^(−R/2000)) − 0,655 × R** (v7.2 : B(R) = 412,5 + 675 × (1 − e^(−R/1 500)) − 0,65 × R). Taux marginal de 26,25 % au premier euro à 65,5 %. Recherche sur grille (H73.4) ; tous les bas revenus dans la cible +20 à +80 € ; cadre à 10 000 € brut dans la cible ; cadre à 20 000 € à −0,4 % (la forme ne permet toujours pas de tenir les deux cadres à la fois). Le surplus au-dessus du droit actuel passe de 70,9 à 65,6 Md€.

| R (€/mois) | dû (− = versé) | reste pour soi | taux moyen | taux marginal | v7.2 : dû |
|---|---|---|---|---|---|
| 0 | −413 | 413 | — | 26,3 % | −413 |
| 1 000 | −66 | 1 066 | −6,6 % | 41,7 % | −91 |
| 2 000 | 401 | 1 599 | 20,1 % | 51,1 % | 390 |
| 3 000 | 943 | 2 057 | 31,4 % | 56,7 % | 954 |
| 5 000 | 2 142 | 2 858 | 42,8 % | 62,3 % | 2 187 |
| 8 000 | 4 057 | 3 943 | 50,7 % | 64,8 % | 4 116 |
| 10 000 | 5 358 | 4 642 | 53,6 % | 65,2 % | 5 413 |
| 50 000 | 31 553 | 18 447 | 63,1 % | 65,5 % | 31 413 |

### 15.4 Écart, solde, prélèvements (Md€/an, croisière)
| | favorable | central | défavorable |
|---|---|---|---|
| surplus de la fonction des revenus au droit actuel | +58,24 | +65,61 | +69,87 |
| volet patrimoine / v5.10 | −49,66 | −70,11 | −90,82 |
| **écart total à la v5.10** (v7.2) | **−48,89** (−95,41) | **−60,49** (−90,68) | **−75,32** (−89,04) |
| **solde de croisière 2060** (v7.2) | **+180,8** (+134,3) | **−48,0** (−78,2) | **−273,7** (−287,4) |

Solde année par année (central) : 2029 −59,6 (−2,0 %) ; 2030 −61,3 (−2,1 %) ; 2035 −68,5 (−2,3 %) ; 2041 −74,5 (−2,5 %) ; 2050 −61,0 (−2,1 %) ; 2060 −48,0 (−1,6 %) ; 2070 −37,3 (−1,3 %). Prélèvements obligatoires bruts 50,7 % du PIB, nets des transferts 47,1 % (v7.2 : 49,7 % et 46,1 % ; aujourd'hui 42,7 % ; convention du bilan global : B(0) en dépense, T(R) en prélèvement).

### 15.5 Dette / PIB (comportements centraux) et économies [B]
| macro | fin 2028 | 10 ans | 20 ans | 30 ans | économies pour une dette stable (v7.2) | avec R1f + M1m + M2m + M3 : 10 / 20 / 30 ans ; manque (v7.2) |
|---|---|---|---|---|---|---|
| prudente | 125,6 % | 138,1 % | 148,9 % | 156,5 % | **37,2** (67,4) | 135,2 % / 141,3 % / 143,5 % ; **28,3** (58,5) |
| reference | 123,5 % | 125,4 % | 122,2 % | 113,8 % | **6,5** (36,7) | 122,6 % / 115,2 % / 102,3 % ; **0,0** (29,5) |
| favorable | 121,5 % | 114,3 % | 101,1 % | 83,1 % | **0,0** (8,3) | 111,6 % / 94,5 % / 72,9 % ; **0,0** (5,8) |
Comportements favorables / défavorables (macro de référence) : dette à 30 ans −107 % / 354 % ; économies 0,0 / 219,3 Md€/an. L'écart vient toujours des réactions des hauts revenus et du capital.

### 15.6 Cas types (€/mois, écart au droit actuel ; v7.2 pour comparer)
| cas | aujourd'hui | v7.3 | écart | % | v7.2 : écart |
|---|---|---|---|---|---|
| Célibataire au Smic | 1 706 | 1 762 | +56 | +3,3 % | +64 |
| Salarié seul à 1500 € net actuels | 1 723 | 1 777 | +54 | +3,2 % | +62 |
| Salarié seul à 2000 € net actuels | 1 977 | 2 124 | +147 | +7,4 % | +138 |
| Salarié seul à 3000 € net actuels | 2 736 | 2 870 | +134 | +4,9 % | +89 |
| Parent isolé, 2 enfants, au Smic | 2 590 | 2 662 | +72 | +2,8 % | +80 |
| Couple sans enfant, deux Smic | 3 088 | 3 185 | +97 | +3,1 % | +119 |
| Couple, 2 enfants, deux Smic | 3 549 | 3 585 | +36 | +1,0 % | +58 |
| Couple médian, 2 enfants (2 × 2 735 € brut) | 4 424 | 4 863 | +439 | +9,9 % | +400 |
| Cadre seul à 5 000 € brut | 3 429 | 3 532 | +103 | +3,0 % | +45 |
| Cadre seul à 10 000 € brut | 6 276 | 6 096 | −180 | −2,9 % | −219 |
| Cadre seul à 20 000 € brut | 11 038 | 10 995 | −42 | −0,4 % | −10 |
| Personne seule sans emploi (RSA + aide au logement) | 877 | 877 | 0 | 0,0 % | 0 |
| Allocataire de l'AAH à taux plein, seul, sans autre revenu (allocation différentielle maintenue) | 1 033 | 1 033 | 0 | 0,0 % | 0 |
| Indépendant (micro-entrepreneur libéral, 3 000 € de chiffre d'affaires, R = 2550 €) | 1 743 | 1 961 | +218 | +12,5 % | +217 |
| Rentier, 5 000 €/mois de dividendes (2 M€ de parts), revenus et patrimoine | 3 430 | 1 250 | −2 180 (plafond de 75 % atteint) | −63,6 % | −503 |
| Retraité, 1200 € nets de pension (versé par la caisse : 1235 €) | 1 200 | 1 200 | 0 | 0,0 % | 0 |
| Retraité, 2000 € nets de pension (versé par la caisse : 2868 €) | 2 000 | 2 000 | 0 | 0,0 % | 0 |
| Retraité, 4000 € nets de pension (versé par la caisse : 8162 €) | 4 000 | 4 000 | 0 (−43 avec R1f) | 0,0 % | 0 |
| Retraité aisé : pension du 10e dixième + 2 000 €/mois de capital, 400 000 € de parts, résidence principale de 500 000 € | 4 577 | 3 435 | −1 141 (−1 166 avec R1f) | −24,9 % | −617 |
| Propriétaire de sa résidence principale de 300 000 € à Grenoble, sans crédit (volet patrimoine seul ; taxe foncière actuelle 2 650 €/an) | taxe 221 | taxe 115 | +105 | — | taxe v7.2 54 : +167 |
| Propriétaire de sa résidence principale de 1 M€, sans crédit (volet patrimoine seul ; taxe foncière moyenne 0,27 %) | taxe 225 | taxe 833 | −608 | — | taxe v7.2 205 : +20 |
| Retraité, 1200 € nets de pension, propriétaire d'une maison de 500 000 € (taxe foncière actuelle ≈ 0,27 % : 1350 €/an) | 1 088 | 1 140 | +53 (paie 5 % de sa pension ; 2 613 €/an différés ; charge économique −165) | +4,8 % | +19 (charge économique) |
| Couple médian, 2 enfants, propriétaire d'un bien de 400 000 € avec 140 000 € de crédit restant (revenus et patrimoine) | 4 334 | 4 774 | +440 | +10,1 % | +444 |
| Patrimoine de 20 M€ (résidence 2 M€, locatif 3 M€, parts 15 M€ ; dividendes 3 %, loyers nets 2 %) | 24 169 | 10 625 | −13 544 (dû : 127 % du revenu ; plafonné à 75 %, 266 k€/an reportés) | −56,0 % | −13 544 (61 k€/an reportés) |

**Non confiscatoire ?** Charge totale (fonction des revenus + patrimoine) d'un rentier pur, sans plafond, en % de son revenu : 1 M€ à 3 % : 45 % ; 2 M€ à 3 % : 75 % ; 3 M€ à 3 % : 88 % ; 5 M€ à 3 % : 100 % ; 10 M€ à 3 % : 110 % ; 100 M€ à 3 % : 120 % ; 10 M€ à 5 % : 87 % ; 100 M€ à 5 % : 93 %. **Sans plafond, la combinaison dépasse 100 % du revenu dès ≈ 5 M€ pour un patrimoine qui rapporte 3 %.** Le plafond annuel de 75 % (avec report) est donc indispensable, et il mord sur ≈ 541 000 ménages (13,2 Md€ d'excédent après érosion, dont la moitié supposée jamais recouvrée, H73.7). Les petits revenus restent protégés par le plafond de 5 % du revenu sous la médiane (paiement différé : 6,7 Md€/an de créances nouvelles, stock ≈ 80 Md€ à 12 ans de durée moyenne).

### 15.7 Taux marginaux effectifs
Personne seule (plancher compris) : 500 € 51,3 % ; 1 000 € 56,3 % ; 1 500 € 60,3 % ; 1 988 € 63,3 % ; 2 500 € 65,7 % ; 3 000 € 67,6 % ; 4 000 € 60,2 % ; 5 000 € 62,3 % ; 7 000 € 64,3 % ; 10 000 € 65,2 % ; 20 000 € 65,5 % ; 50 000 € 65,5 %. Maximum 69,0 % vers 3 475 € (v7.2 : 70,5 %) ; trappes : 0. Sommet : 65,5 % (v7.2 : 65 %) ; bénéfice distribué : IS + fonction = 65,5 %. Patrimoine : taux marginal maximal 2 % par an de la valeur.

### 15.8 Ce qui reste fragile (à ne pas masquer)
(1) **Le plafond fait la loi au sommet** : avec 65,5 % sur les revenus du capital et jusqu'à 2 % par an sur la valeur, un patrimoine qui rapporte 3 % paie plus que son revenu dès ≈ 5 M€ ; la « taxe Zucman » continue n'est tenable qu'avec le plafond de 75 % et un report dont on ne sait pas quelle part sera recouvrée (H73.7 ⚠️ V15202, V15203). Piste à trancher : imputer sur P(W) l'impôt déjà payé sur les revenus du capital (logique d'impôt plancher du projet Zucman) ; non chiffrée. (2) **Les propriétaires d'un bien de 0,5 à 3 M€ paient beaucoup plus** : 1 M€ → 10 000 €/an (≈ 3,7 fois la taxe foncière moyenne) ; retraités riches en patrimoine et pauvres en revenu : le différé devient massif (stock ≈ 80 Md€). (3) **Effet de prix** : le taux effectif sur l'immobilier passe de 0,27 % à 0,86 % ; le modèle capitalise −13 % sur les prix (central), ce qui pèse sur les ménages endettés et sur les banques ⚠️ V15206. (4) **Recalage × 1,4** : appliqué proportionnellement, il pousse les ménages moyens vers le haut d'une courbe progressive (recette probablement surestimée au milieu, sous-estimée en haut ; queue au-delà de ≈ 30 M€ absente) ⚠️ V15205, V15106. (5) **Érosion à 2 %** : la loi exponentielle donne 59 % d'érosion du capital mobile du 1 % au central (90 % au défavorable) ; les preuves (Danemark, Suisse : ≈ 30 % pour un point) disent que le 40 % à 1 % est déjà un peu pessimiste ⚠️ V15200. (6) **« Ne pas taxer plus au global »** : la v7.3 prélève ≈ 1 point de PIB de plus que la v7.2 ; c'est le montant qui stabilise la dette (règle de l'auteur : la dette d'abord), pas une hausse cachée.

### 15.9 Si l'auteur adopte : lignes à changer dans document de travail de l'atelier, non publié (section 0), sans rien toucher avant sa décision
| N° | Poste (écart à la v5.10, Md€, central) | v7.2 | v7.3 |
|---|---|---|---|
| F01 | Fonction des revenus (T(R), capital des retraités compris) | +29,66 | +24,54 |
| F02 | IS unique à 25 % | +3,51 | +3,51 |
| F03 | Retenue à la source | +0,03 | +0,03 |
| F05 | Fonction du patrimoine (recette 26,28 → 66,23) | −60,14 | −20,19 |
| F09 | Plafonds (v7.3 : plafond de 75 % au sommet, H73.7) | +1,62 | −4,29 |
| F11 | Trusts | −0,53 | 0,00 |
| F12 | SCI | −0,91 | −0,01 |
| F20 | Versement B(0) = 412,5 € | +29,04 | +29,04 |
| F21 | Majoration par enfant | −3,61 | −3,61 |
| F22 | Plancher | −4,68 | −4,53 |
|  | **Effet sur le solde** | −90,68 | −60,49 |
|  | **Solde de croisière 2060** | −78,18 | −47,99 |

À reprendre aussi : l'« En une minute » (deux formules, recette, solde, prélèvements obligatoires 50,7 % / nets 47,1 %, dette et économies) ; le tableau 0.2 (15.5 ci-dessus) ; le tableau 0.3 (solde année par année : 15.4) ; le tableau 0.4 (collectivités : la fonction du patrimoine, 66,2 Md€, couvre désormais toutes les ressources supprimées du bloc communal, 55,4 Md€, et laisse 10,9 Md€ à l'État ; départements 1,01 %, régions 0,016 %, autorités de la mobilité 1,25 % de T(R)) ; la ligne N07/F05 du registre des propositions ; `sources/calculs/bilan_global.py` (dictionnaire V72 → V73, export à écrire sur le modèle de `export_bilan_v72.js`) ; document de travail de l'atelier, non publié.

### 15.10 Hypothèses (H73.x) et sources
- **H73.1** : τ(W) = 2 % × W / (W + 1 M€) sur la valeur nette de l'immobilier et des parts de sociétés, résidence principale comprise ; population HVP 2023-2024 recalée × 1,4 sur les comptes de patrimoine 2024 (`taxe_patrimoine.js` H505) ⚠️ V15205.
- **H73.2** : érosion ménage par ménage, loi exponentielle calée sur l'érosion à 1 % de `taxe_patrimoine.js` (H510) ; exil 20 / 74 (CAE, Focus n° 118, cité par `taxe_patrimoine.js` H512) ; externalité 2,2 %/an (H513) ⚠️ V15200.
- **H73.3** : surplus sur la v7.2 affecté d'abord au manque de la dette (combinaison R1f + M1m + M2m + M3, macro de référence), puis à la fonction des revenus.
- **H73.4** : fonction des revenus recalibrée sur grille (bas revenus +20 à +80 €, rentiers perdants revenus et patrimoine compris, TME ≤ 75 %, recette visée) : S = 412,5 €, m∞ = 65,5 %, m0 = 26,25 %, K = 2 000 €/mois.
- **H73.5** : cas types patrimoniaux (taxe foncière de 2 650 €/an pour un cas type à Grenoble ; retraité, famille, 20 M€) ⚠️ V15201, V15204.
- **H73.6** : plafonds de la v7.2 (5 % du revenu sous la médiane, paiement différé ; 75 % au-dessus, report).
- **H73.7** : plafond de 75 % au sommet, revenu imposable 5 / 4 / 3 % du patrimoine, report recouvré à 75 / 50 / 25 % ⚠️ V15202, V15203.
- Sources : celles de la v7.2 et de `taxe_patrimoine.js` (Insee Première n° 2081, comptes de patrimoine 2024 ; Insee Focus n° 371, enquête Histoire de vie et Patrimoine 2023-2024) ; barème de l'IFI : art. 977 du CGI (cas de 20 M€). Aucune source nouvelle lue pour cette section.

## 16. v7.4 proposée (06/11/2026, nuit, NON ADOPTÉE) : impôt plancher, paiement plafonné au revenu, différé garanti

**Ce que cette section fait.** Elle corrige les trois défauts de la v7.3 (15.8) en suivant les retours de l'auteur du 06/11 : (1) la résidence principale reste sur la courbe principale (l'auteur juge acceptable 10 000 €/an pour une résidence de 1 M€) ; un allègement léger jusqu'à 300 000 € est chiffré en option seulement ; (2) **impôt plancher à la Zucman** : on déduit de la taxe du patrimoine la contribution déjà payée sur les revenus du capital ; (3) **garde-fous min/max** : ce qu'on paie dans l'année est plafonné par une fraction du revenu net, le reste est différé jusqu'à la vente ou à la succession ; (4) **tous les cas limites** sont calculés avant de proposer la formule (16.6). Module `modeles/systeme-ideal/decisions_0611_v74.js`, test `test_decisions_0611_v74.js` (40 vérifications), ce texte par `rapport_decisions_0611_v74.js`. Tout le reste est la v7.3 (et donc la v7.2). Euros de 2025 ; ordres de grandeur sous hypothèses (H74.x), pas des prédictions.

### 16.0 En une page
- **La formule, en quatre lignes** [B/C] :
  1. **P(W) = 2 % × W² / (W + 700 k€)**, soit un taux moyen τ(W) = 2 % × W / (W + 700 k€), sur la valeur nette, résidence principale comprise ; biens professionnels, terres exploitées et forêts gérées comptés à leur **valeur de rendement** ; jeunes entreprises à leur valeur substantielle jusqu'à la première liquidité.
  2. **Impôt plancher : P' = max(0, P(W) − C_k)**, où C_k est la contribution personnelle déjà payée sur les revenus du capital. Pour un rentier, cela revient à payer **le plus élevé des deux** : la contribution sur ses revenus ou la taxe du patrimoine.
  3. **Payé dans l'année = min(P', max(x(N) × N, 2 % × A))**, avec N le revenu net du foyer, **x(N) = 50 % × N / (N + 72 000 €)** (8 % à 1 200 €/mois, 12,5 % à 2 000 €, 25 % à 6 000 €) et A les actifs mobilisables : titres cotés, fonds, cryptoactifs, holdings passives.
  4. **Le reste est différé** : c'est une créance garantie sur le bien, qui porte intérêt au taux d'emprunt de l'État et devient exigible à la vente, à la donation ou à la succession (le conjoint survivant garde le report). Elle est sans recours au-delà de la valeur du bien. **Le plafond de 75 % de la v7.3 est supprimé.**
- **Pourquoi K = 700 000 € et non 1 M€** [B, décision de Claude, à valider] : l'impôt plancher coûte ≈ 15 Md€ par rapport à la v7.3 (il retire 35 % du dû brut). Pour garder la dette stable, il faut les reprendre quelque part. Avec K = 700 000 €, on les reprend sur le patrimoine qui ne rapporte pas (surtout l'immobilier) et **la fonction des revenus redevient exactement celle de la v7.2** (cadre à 10 000 € brut : −3,5 %). Avec K = 1 M€ (variante A), il faut resserrer la fonction des revenus : **B(R) = 412,5 + 690 × (1 − e^(−R/1500)) − 0,66 × R**, et le cadre à 10 000 € brut tombe à −5,5 %, hors de la cible validée.
- **Recette** [B] : **54,5 Md€** au central (64,4 favorable, 40,6 défavorable) ; v7.3 66,2 Md€, mais celle-ci perdait encore 6,6 Md€ au plafond de 75 % ; volet patrimoine −5,6 Md€ par rapport à la v7.3, compensé par la fonction des revenus de la v7.2 (surplus 70,9 au lieu de 65,6).
- **Dépassement de 100 % du revenu** [B] : **il disparaît sans plafond** pour tout patrimoine qui rapporte : avec un rendement de 3 %, la charge totale est de 58 % à 5 M€ et de 66 % à 100 M€ (v7.3 sans plafond : 100 % et 120 %). Il ne subsiste que pour un patrimoine **mobilisable qui ne rapporte presque rien** (titres qui ne distribuent pas, cryptoactifs) : c'est la cible voulue de l'impôt plancher, car le rendement y prend la forme de plus-values latentes.
- **Dette** [B] : avec la combinaison recommandée, **dette stable en macro de référence** (dette à 30 ans 102,7 %, marge 0,3 Md€/an) ; il manque 28,7 Md€/an en macro prudente (v7.3 : 28,3).
- **Prélèvements obligatoires** [B] : 50,7 % du PIB (v7.3 50,7 %, v7.2 49,7 %, aujourd'hui 42,7 %). **Ils ne peuvent pas redescendre au niveau de la v7.2 sans rouvrir le manque de la dette** : stabiliser la dette coûte ≈ 30 Md€ de recettes, et le plancher ne fait que changer qui les paie.
- **Différé** [B] : 12,4 Md€/an de créances nouvelles, 2,44 millions de ménages, **encours ≈ 149 Md€ (5,1 % du PIB)**. Le coût est nul pour l'État puisque les intérêts sont facturés à son propre taux ; les pertes atteignent 0,62 Md€/an. En revanche, la dette brute (dette de Maastricht) porte cet encours, que compense une créance garantie : voir 16.5.
- **Immobilier** [B] : effet de prix −9,7 % au central (v7.3 −13,0 %).
- **Recommandation** : **v7.4 variante B plutôt que v7.3.** Elle supprime le plafond de 75 % et son report incertain, elle ferme la brèche des holdings qui ne distribuent pas (la v7.3 faisait payer 10 500 € par an à une holding de 20 M€), elle protège le retraité dans sa grande maison sans vente forcée et elle laisse inchangée la fonction des revenus de la v7.2. Elle a un prix : la résidence de 1 M€ paie 11 765 € au lieu de 10 000, celle de 300 000 € paie 1 800 € au lieu de 1 385 (toujours moins que les 2 650 € de Grenoble aujourd'hui), et la dette brute porte ≈ 5 points de créances garanties.

### 16.1 La fonction du patrimoine [B]

| W (valeur nette) | taux moyen | taxe annuelle (dû brut P) | taux marginal | option RP (−100 k€) | v7.3 | droit actuel (repère) |
|---|---|---|---|---|---|---|
| 100 k€ | 0,25 % | 250 € | 0,47 % | 0 € (0,00 %) | 182 € | TF ≈ 270 € |
| 300 k€ | 0,60 % | 1 800 € | 1,02 % | 889 € (0,30 %) | 1 385 € | TF ≈ 810 € (Grenoble 2 650 €) |
| 1 M€ | 1,18 % | 11 765 € | 1,66 % | 10 125 € (1,01 %) | 10 000 € | TF ≈ 2 700 € (autre estimation non sourcée : ≈ 5 000 € à Paris ⚠️) |
| 3 M€ | 1,62 % | 48 649 € | 1,93 % | 46 722 € (1,56 %) | 45 000 € | TF + IFI ≈ 8 100 + 9 600 € |
| 10 M€ | 1,87 % | 186 916 € | 1,99 % | 184 925 € (1,85 %) | 181 818 € | IFI ≈ 87 000 € (hors biens professionnels) |
| 100 M€ | 1,99 % | 1 986 097 € | 2,00 % | 1 984 097 € (1,98 %) | 1 980 198 € | IFI ≈ 1,4 M€ si tout immobilier |
| 1 Md€ | 2,00 % | 19 986 010 € | 2,00 % | 19 984 010 € (2,00 %) | 19 980 020 € | — |

Lecture : la colonne « dû brut » vaut pour un patrimoine qui ne rapporte rien, une résidence principale par exemple, ou une holding qui ne distribue pas. Pour un patrimoine qui rapporte, on en retire la contribution déjà payée sur ses revenus (16.2). La « RP » et l'« autre patrimoine » suivent la même courbe, comme l'auteur l'a demandé ; ils ne diffèrent que sur deux points : seule la RP peut recevoir l'option, et seul l'autre patrimoine ouvre l'imputation (une RP ne verse pas de revenu). **Option RP** (abattement de 100 000 € sur la résidence principale : 0,30 % au lieu de 0,60 % à 300 000 €) : recette 42,2 Md€ au lieu de 54,5, soit **12,3 Md€ à retrouver** ailleurs ; non recommandée. Aux repères de l'auteur (≈ 0,5 % à 300 000 €, 1 % à 1 M€), la variante B ajoute 0,1 et 0,18 point.

### 16.2 Impôt plancher : effet sur la recette, le report et l'exil [B]
Même chaîne que la v7.3 : population HVP recalée × 1,4, érosion ménage par ménage selon la loi exponentielle, exil (20 / 74 de l'érosion, 2,2 %/an d'autres impôts), gestion. Trois nouveautés : (a) le dû de chaque ménage est P' et non plus P. Les loyers de l'immobilier hors résidence principale y sont comptés au rendement net de `taxe_patrimoine.js`, les distributions des parts à 1,5 / 2 / 3 % (H74.2) ; la contribution est imputée au prorata des revenus du capital, d'après une loi jointe revenu × patrimoine reconstituée (H74.4) ; (b) la règle de paiement (c) remplace le différé forfaitaire et le plafond de 75 % ; (c) les terres sont comptées à leur valeur de rendement (× 0,5, H74.7). Contrôle : à 1 % plat, sans les nouveautés, on retrouve exactement `taxe_patrimoine.js`.

| Md€/an | favorable | central | défavorable |
|---|---|---|---|
| taux moyen avant plancher → après | 1,13 % → 0,74 % | 1,13 % → 0,74 % | 1,13 % → 0,64 % |
| part du dû retirée par le plancher | 35 % | 35 % | 44 % |
| taux effectif sur l'immobilier ; effet de prix | 0,69 % ; −3,6 % | 0,71 % ; −9,7 % | 0,65 % ; −14,3 % |
| érosion du capital mobile : 1 % / reste (v7.3 central 59 % / 15 %) | 19 % / 4 % | 35 % / 12 % | 46 % / 23 % |
| recette brute | 66,1 | 58,3 | 45,3 |
| exil (autres impôts perdus ; v7.3 central −4,1) | −1,36 | −2,59 | −3,36 |
| gestion ; différé non recouvré | −0,33 ; −0,00 | −0,58 ; −0,62 | −0,91 ; −0,46 |
| **recette nette** | **64,4** | **54,5** | **40,6** |
| différé de l'année (recouvré plus tard) | 15,1 | 12,4 | 4,6 |

Comparaisons (central) : même courbe sans plancher 70,5 Md€ ; variante A (K = 1 M€) 45,0 Md€ (plancher 40 %, sans plancher 63,1) ; v7.3 66,2 Md€, dont 6,6 perdus au plafond de 75 % ; impôts remplacés 61,7 Md€. **Report** : le plafond de 75 % et ses 13,2 Md€ d'excédent reporté chaque année (dont la moitié supposée perdue) disparaissent ; le différé de la règle (c) le remplace, porte intérêt et est garanti par le bien. **Exil** : l'érosion du capital mobile du 1 % passe de 59 % à 35 % au central et les impôts perdus par l'exil de 4,1 à 2,6 Md€/an, car le plancher baisse le taux effectif sur le patrimoine qui rapporte, le plus mobile.

### 16.3 Fonction des revenus [B]
Variante B : **B(R) = 412,5 + 675 × (1 − e^(−R/1 500)) − 0,65 × R**, la fonction de la v7.2. La recherche sur grille (`calibrer()`, mêmes contraintes que la v7.3 : bas revenus +20 à +80 €, rentier perdant revenus et patrimoine compris, TME ≤ 75 %, recette au plus près du besoin de la dette) la retrouve d'elle-même. Taux marginal de 20 % au premier euro à 65 % au sommet ; TME maximal 70,5 % ; aucune trappe. Variante A : B(R) = 412,5 + 690 × (1 − e^(−R/1500)) − 0,66 × R ; TME maximal 71,4 %.

| cas (€/mois) | aujourd'hui | v7.4 B | écart | % | v7.3 : écart | v7.4 A : écart |
|---|---|---|---|---|---|---|
| Célibataire au Smic | 1 706 | 1 770 | +64 | +3,8 % | +56 | +58 (+3,4 %) |
| Salarié seul à 1500 € net actuels | 1 723 | 1 785 | +62 | +3,6 % | +54 | +55 (+3,2 %) |
| Salarié seul à 2000 € net actuels | 1 977 | 2 115 | +138 | +7,0 % | +147 | +125 (+6,3 %) |
| Salarié seul à 3000 € net actuels | 2 736 | 2 825 | +89 | +3,3 % | +134 | +53 (+1,9 %) |
| Parent isolé, 2 enfants, au Smic | 2 590 | 2 670 | +80 | +3,1 % | +72 | +73 (+2,8 %) |
| Couple sans enfant, deux Smic | 3 088 | 3 208 | +119 | +3,9 % | +97 | +102 (+3,3 %) |
| Couple, 2 enfants, deux Smic | 3 549 | 3 608 | +58 | +1,6 % | +36 | +41 (+1,1 %) |
| Couple médian, 2 enfants (2 × 2 735 € brut) | 4 424 | 4 823 | +400 | +9,0 % | +439 | +358 (+8,1 %) |
| Cadre seul à 5 000 € brut | 3 429 | 3 475 | +45 | +1,3 % | +103 | −8 (−0,2 %) |
| Cadre seul à 10 000 € brut | 6 276 | 6 057 | −219 | −3,5 % | −180 | −346 (−5,5 %) |
| Cadre seul à 20 000 € brut | 11 038 | 11 027 | −10 | −0,1 % | −42 | −279 (−2,5 %) |
| Personne seule sans emploi (RSA + aide au logement) | 877 | 877 | 0 | 0,0 % | 0 | 0 (0,0 %) |
| Allocataire de l'AAH à taux plein, seul, sans autre revenu (allocation différentielle maintenue) | 1 033 | 1 033 | 0 | 0,0 % | 0 | 0 (0,0 %) |

### 16.4 Cas types demandés (volet patrimoine, €/an)
« Payé » = ce qui sort dans l'année ; « différé » = créance garantie, exigible à la vente ou à la succession. v7.3 : dû P(W), payé après le plafond de 5 % sous la médiane ou de 75 % au-dessus. Droit actuel : taxe foncière (0,27 % de la valeur sauf mention) et IFI.

| cas | dû brut P | déduit (plancher) | payé | différé | payé / revenu net | v7.3 : payé (reporté) | v7.4 A : payé (différé) | aujourd'hui |
|---|---|---|---|---|---|---|---|---|
| Résidence principale de 300 000 € à Grenoble, couple au revenu médian (2 × 2 000 €/mois), sans crédit | 1 800 | 0 | **1 800** | 0 | 5 % | 1 385 (0) | 1 385 (0) | 2 650 |
| Résidence principale de 1 M€, couple à 2 × 3 500 €/mois, sans crédit | 11 765 | 0 | **11 548** | 217 | 21 % | 10 000 (0) | 10 000 (0) | 2 700 |
| 5 M€ d'actions cotées qui rapportent 3 % (12 500 €/mois de dividendes nets), sans autre revenu, pas de résidence | 87 719 | 66 950 | **20 769** | 0 | 25 % | 45 868 (37 466) | 14 563 (0) | 0 |
| 20 M€ dans une holding passive (titres cotés) qui ne distribue rien, aucun autre revenu | 386 473 | 0 | **386 473** | 0 | ≫ 100 % (distribution ou titres) | 10 524 (370 428) | 380 952 (0) | 0 |
| Rentier : 2 M€ d'actions cotées, 5 000 €/mois de dividendes nets, sans résidence | 29 630 | 19 045 | **10 585** | 0 | 26 % | 26 634 (33) | 6 999 (0) | 0 |
| Retraité, 1 200 €/mois de pension, maison de 500 000 € | 4 167 | 0 | **1 737** | 2 429 | 10 % | 720 (2 613) | 1 731 (1 602) | 1 350 |

Lecture : le rentier à 2 M€ (5 000 €/mois de dividendes) paie 19 045 €/an sur ses revenus, que le plancher déduit de son dû de 29 630 € ; il lui reste 10 585 €/an de taxe, soit une charge totale de 49 % de son revenu (v7.3 : 75 %, plafond atteint). Il perd encore 899 €/mois par rapport au PFU actuel : « le rentier ne gagne pas » reste vrai. Le retraité à 1 200 €/mois dans une maison de 500 000 € paie 1 737 €/an, soit 9,8 % de son revenu net (taxe foncière actuelle : 1 350 €) ; il diffère 2 429 €/an, et au bout de 20 ans sa créance représente 11 % de la valeur de sa maison.

### 16.5 Différé : ce qu'il coûte en trésorerie [B]
| | central | variante A |
|---|---|---|
| créances nouvelles (Md€/an) | 12,4 | 8,8 |
| ménages qui diffèrent une partie | 2,44 millions | 1,76 millions |
| encours en croisière (durée moyenne 12 ans) | 149 Md€ (5,1 % du PIB) | 105 Md€ (3,6 %) |
| coût annuel pour l'État (intérêts au taux de l'État) | 0 | 0 |
| coût si aucun intérêt sous la médiane (non retenu) | 0,43 Md€/an | 0,30 Md€/an |
| pertes (5 % non recouvrés, déjà retirées de la recette) | 0,62 Md€/an | 0,44 Md€/an |

**Ce qu'il faut dire sans détour.** La recette compte le différé au moment où il est dû, comme la v7.3 le faisait pour son propre différé (6,7 Md€/an, encours ≈ 80 Md€). En caisse, l'État avance cet encours pendant la montée en charge, qui dure à peu près douze ans : la dette brute au sens de Maastricht monte alors d'environ 5 points de PIB. En face, l'État détient une créance garantie par une hypothèque légale ou un nantissement et rémunérée à son propre taux d'emprunt, si bien que sa dette nette ne bouge pas ⚠️ V15308 (traitement en comptabilité nationale à confirmer). Réduire l'encours coûte cher aux ménages modestes : avec x(N) = 30 % × N / (N + 48 000 €), les créances nouvelles montent à ≈ 17 Md€/an ; il faudrait monter x pour les faire baisser, et le retraité paierait alors davantage. **Recommandation** : garder 50 % / 72 000 €, et réserver le différé aux résidents, à leurs biens non mobilisables (logement, terres, biens professionnels, œuvres d'art).

### 16.6 Cas limites (liste de l'auteur), avant la formule finale (€/an)
Hypothèses de chaque cas dans son libellé (illustratives ⚠️ V15306). « Créance à 20 ans » : différé cumulé avec intérêts réels de 1,3 %, en % de la valeur retenue.

| cas | dû brut | déduit | payé | différé | payé / revenu net | créance à 20 ans | v7.3 : payé (reporté) | aujourd'hui | aberration ? |
|---|---|---|---|---|---|---|---|---|---|
| Retraité modeste (couple, 2 × 900 €/mois) dans la grande maison payée par une vie d'épargne (1,2 M€) | 15 158 | 0 | **3 669** | 11 489 | 14 % | 22 % | 1 080 (12 011) | 3 240 | Non : il paie à peu près sa taxe foncière actuelle et garde sa maison ; la créance est réglée à la succession. |
| Héritier sans revenu d'activité (revenu minimum, 877 €/mois) d'un appartement de 2 M€ qu'il occupe | 29 630 | 0 | **671** | 28 959 | 6 % | 33 % | 0 (26 667) | 8 600 | Tension : sans revenu, il diffère presque tout ; après 40 ans, la créance approcherait 80 % du bien. Garde-fou : alerte à 50 % de la valeur, puis vente ou viager hypothécaire proposés, sans vente forcée. |
| Agriculteur : terres d'une valeur vénale de 2 M€, revenu 2 500 €/mois (valeur de rendement : 30 000 €/an / 4 % = 750 000 €), maison 250 000 € | 11 765 | 0 | **2 854** | 8 911 (sans valeur de rendement : 2 854 payé, 31 468 différé) | 12 % | 20 % | 10 000 (0) | 2 675 | Non avec la valeur de rendement ; oui sans elle (31 000 €/an dus sur 30 000 € de revenu). |
| Viticulteur en appellation prestigieuse : vignes de 6 M€ de valeur vénale, revenu 8 000 €/mois (valeur de rendement 96 000 € / 4 % = 2,4 M€), maison 500 000 € | 46 722 | 0 | **9 158** | 37 564 (sans valeur de rendement : 9 158 payé, 108 203 différé) | 20 % | 29 % | 23 317 (19 811) | 7 350 | Limite : même à la valeur de rendement, la créance atteint 29 % de cette valeur au bout de 20 ans (12 % de la valeur vénale), réglée à la transmission. Piste : retirer de la valeur de rendement la rémunération du travail de l'exploitant (⚠️ V15307). |
| Chef d'entreprise : société de 10 M€ où il travaille (bénéfice 500 000 €, après IS 375 000 € : valeur de rendement 9,4 M€ ; distribue 100 000 €/an ; salaire 8 000 €/mois), maison 1 M€ | 194 385 | 39 189 | **21 694** | 133 502 (sans valeur de rendement : 21 694 payé, 145 954 différé) | 27 % | 29 % | 39 237 (150 021) | 2 700 | Tension voulue : le plancher mord sur l'outil de travail qui distribue peu (155 000 €/an dus). Sorties : distribuer (chaque euro distribué réduit le plancher) ou payer en titres ; sinon la créance atteint 29 % de la société à 20 ans. |
| Fondateur de start-up : parts valorisées 30 M€ au dernier tour, aucune liquidité, salaire 4 000 €/mois ; valeur substantielle de ses parts 1 M€ | 11 765 | 0 | **4 234** | 7 531 (sans valeur de rendement : 4 234 payé, 582 085 différé) | 14 % | 17 % | 10 000 (0) | 0 | Oui à la valeur du dernier tour (586 000 €/an dus sans un euro de liquidité) ; non à la valeur substantielle, jusqu'à la première liquidité. |
| 20 M€ de parts d'une société familiale (le foyer n'y travaille pas), via une holding qui ne distribue rien | 386 473 | 0 | **386 473** | 0 | ≫ 100 % (distribution ou titres) | 0 % | 10 524 (370 428) | 0 | Comme la précédente : parts non cotées où le foyer n'exerce pas, donc mobilisables (paiement en titres). |
| Jeune ménage : appartement de 400 000 € acheté avec 380 000 € de crédit, 2 × 2 200 €/mois | 11 | 0 | **11** | 0 | 0 % | 0 % | 8 (0) | 1 080 | Non (valeur nette). À l'inverse, il paie moins qu'aujourd'hui ; dettes déductibles seulement si elles financent des biens taxés (règle de l'art. 974 du CGI). |
| Copropriétaire à 50 % d'un appartement de 600 000 € (l'autre moitié à un tiers), 3 000 €/mois | 1 800 | 0 | **1 800** | 0 | 7 % | 0 % | 1 385 (0) | 810 | Non : chacun est imposé sur sa quote-part. |
| Indivisaire non occupant : 1/3 d'une maison héritée de 900 000 € (occupée par un frère, sans indemnité), RP de 400 000 €, 4 000 €/mois | 7 000 | 0 | **4 234** | 2 766 | 14 % | 9 % | 5 765 (0) | 1 890 | Tension : il paie sur une part qui ne lui rapporte rien. Correctif : l'indemnité d'occupation due par l'occupant (art. 815-9 du Code civil) devient un revenu, que le plancher impute. |
| Résident, villa de 800 000 € au Portugal (impôt foncier local IMI 0,3 % : 2 400 €/an, imputé) et RP de 500 000 € à Lyon, 6 000 €/mois | 16 900 | 2 400 | **6 593** | 7 907 | 17 % | 14 % | 14 696 (0) | 1 350 | Non : l'impôt étranger est imputé. Le contrôle des biens immobiliers à l'étranger, sans échange automatique, reste le point faible. |
| 3 M€ en cryptoactifs (valeur moyenne de l'année), salaire 5 000 €/mois, locataire | 48 649 | 0 | **48 649** | 0 | 144 % | 0 % | 19 297 (25 703) | 0 | Voulu, mais lourd : mobilisable, donc tout est payé (144 % du revenu net) en vendant ≈ 1,6 %/an des cryptoactifs. Garde-fou : évaluation sur la valeur moyenne de l'année, pas au 1er janvier. |
| Collectionneur : 5 M€ d'œuvres d'art, RP de 2 M€, 15 000 €/mois | 127 273 | 0 | **19 532** | 107 740 | 26 % | 35 % | 31 465 (91 035) | 8 600 | Non, sans être idéal : le différé porte intérêt et se règle à la succession, la dation en œuvres étant possible (art. 1716 bis du CGI). Valeur déclarée sous droit de préemption de l'État. |
| Forêt gérée de 100 ha (valeur vénale 500 000 €, revenu 5 000 €/an : valeur de rendement 125 000 €), RP de 300 000 €, 3 000 €/mois | 3 211 | 1 739 | **1 472** | 0 (sans valeur de rendement : 3 620 payé, 3 174 différé) | 6 % | 0 % | 2 535 (0) | 1 310 | Non avec la valeur de rendement ; à la valeur vénale, 3 600 €/an pour 5 000 € de revenu. |
| Non-résident : appartement de 1 M€ à Paris loué 2 500 €/mois nets (imposé en France sur ce bien seul, sans différé) | 11 765 | 6 673 | **5 091** | 0 | 22 % | 0 % | 10 000 (0) | 2 700 | Non sur le calcul. Le risque est juridique : réserver le différé aux résidents peut heurter la libre circulation des capitaux (art. 63 du TFUE) ⚠️ V15309. |
| Fractionnement : parent seul avec 10 M€ (locatif 4 M€ à 2 %, titres 6 M€ à 3 %), avant donation | 186 916 | 134 950 | **51 966** | 0 | 42 % | 0 % | 59 770 (122 048) | 25 690 | Non : voir la ligne suivante. |
| Fractionnement : chacun des trois enfants majeurs après donation (1/3 de tout, 3 000 €/mois de salaire chacun) | 55 096 | 42 170 | **12 927** | 0 | 21 % | 0 % | 32 899 (18 383) | 1 900 | Non : la donation baisse la taxe annuelle totale de 52 000 à 3 × 12 900 €, mais coûte des droits de donation de l'ordre du million par enfant. Enfants mineurs rattachés au foyer, usufruitier imposé sur la pleine propriété. |

**Bilan des cas limites.** Les aberrations franches viennent toutes de l'**évaluation**, pas de la courbe : une start-up comptée à la valeur de son dernier tour, des terres ou des forêts comptées à leur valeur vénale. La valeur de rendement et la valeur substantielle les suppriment ; c'est la pratique suisse ⚠️ V15304. Les cas de liquidité (retraité dans une grande maison, héritier sans revenu, agriculteur) sont réglés par la règle (c) et le différé garanti, sans vente forcée. Restent trois **tensions assumées**, à trancher par l'auteur : (1) le chef d'entreprise qui distribue peu paie le plancher sur sa société (c'est le sens même d'un impôt à la Zucman, mais l'IFI exonère aujourd'hui les biens professionnels) ; (2) l'héritier sans revenu dont la créance grossit pendant des décennies ; (3) les cryptoactifs et titres qui ne distribuent pas, imposés au-delà du revenu déclaré.

### 16.7 Écart, solde, dette, prélèvements (variante B)
| Md€/an | favorable | central | défavorable |
|---|---|---|---|
| surplus de la fonction des revenus au droit actuel | +65,20 | +70,89 | +73,96 |
| volet patrimoine / v5.10 | −65,89 | −75,75 | −89,65 |
| **écart total à la v5.10** (v7.3) | **−58,16** (−48,89) | **−60,85** (−60,49) | **−70,05** (−75,32) |
| **solde de croisière 2060** (v7.3) | **+171,6** (+180,8) | **−48,4** (−48,0) | **−268,4** (−273,7) |

Solde année par année (central) : 2029 −59,9 ; 2030 −61,7 ; 2035 −68,8 ; 2041 −74,8 ; 2050 −61,4 ; 2060 −48,4 ; 2070 −37,7. Prélèvements obligatoires bruts 50,7 % du PIB, nets des transferts 47,1 % (variante A : 50,7 %).

| macro | fin 2028 | 10 ans | 20 ans | 30 ans | économies pour une dette stable | avec R1f + M1m + M2m + M3 : 10 / 20 / 30 ans ; manque |
|---|---|---|---|---|---|---|
| prudente | 125,6 % | 138,2 % | 149,1 % | 156,9 % | 37,6 | 135,3 % / 141,5 % / 144,0 % ; **28,7** |
| reference | 123,5 % | 125,5 % | 122,5 % | 114,1 % | 6,9 | 122,7 % / 115,4 % / 102,7 % ; **0,0** |
| favorable | 121,5 % | 114,4 % | 101,3 % | 83,4 % | 0,0 | 111,7 % / 94,7 % / 73,3 % ; **0,0** |

### 16.8 Taux marginaux
Fonction des revenus : ceux de la v7.2 (maximum 70,5 % vers 3 525 €, sommet 65 %, aucune trappe). Patrimoine : taux marginal de 0 au premier euro à 2 %, sans jamais l'atteindre (1,02 % à 300 000 €, 1,66 % à 1 M€). Le plancher crée un **taux marginal implicite sur les revenus du capital** : tant qu'un patrimoine paie le plancher (P > C_k), chaque euro de dividende supplémentaire réduit d'autant la taxe du patrimoine. Distribuer ne coûte alors rien de plus, ce qui est voulu : l'impôt plancher pousse à distribuer ou à vendre ce qui dort. Règle de paiement : x(N) monte doucement, de 8,3 % à 1 200 €/mois à 25,0 % à 6 000 € ; elle ne crée aucune marche.

### 16.9 v7.3 ou v7.4 ? Recommandation
| critère | v7.3 | v7.4 A (K = 1 M€) | **v7.4 B (K = 700 k€)** |
|---|---|---|---|
| dépassement de 100 % du revenu | oui dès ≈ 5 M€ (plafond de 75 % + report) | non pour un patrimoine qui rapporte | non pour un patrimoine qui rapporte |
| holding de 20 M€ qui ne distribue rien | paie 10 500 €/an, reporte 370 000 € | paie 380 952 € | paie 386 473 € |
| retraité modeste, grande maison (1,2 M€) | paie 1 080 €, diffère 12 011 € | paie 3 659 €, diffère 9 432 € | paie 3 669 €, diffère 11 489 € |
| résidence de 300 000 € / 1 M€ | 1 385 / 10 000 € | 1 385 / 10 000 € | 1 800 / 11 765 € |
| recette du patrimoine (central) | 66,2 (− 6,6 au plafond) | 45,0 | 54,5 |
| fonction des revenus ; cadre à 10 000 € brut | v7.3 allégée ; −2,9 % | resserrée ; −5,5 % | v7.2 ; −3,5 % |
| dette stable (référence, combinaison) | oui | oui | oui |
| prélèvements obligatoires | 50,7 % | 50,7 % | 50,7 % |
| effet de prix immobilier (central) | −13,0 % | −6,3 % | −9,7 % |
| encours de différé | ≈ 80 Md€ | 105 Md€ | 149 Md€ |

**Recommandation de Claude : la v7.4 B.** Trois raisons. (1) Elle remplace un plafond de 75 % dont on ne sait pas quelle part serait recouvrée par une règle qui se lit en une ligne : on paie le plus élevé des deux, contribution sur ses revenus ou taxe sur son patrimoine. (2) Elle ferme la brèche que la v7.3 laissait au sommet, la holding qui ne distribue pas. (3) Elle garde intacte la fonction des revenus de la v7.2, que l'auteur a déjà validée. **Ce qu'elle coûte, à ne pas masquer** : la classe moyenne propriétaire paie un peu plus que dans la v7.3 (+415 €/an à 300 000 €, +1 765 €/an à 1 M€), parce que le plancher allège le capital qui rapporte et que la dette impose de reprendre ces milliards ailleurs ; c'est l'arbitrage plancher contre rente immobilière. Si l'auteur tient à « 1 % à 1 M€ », la variante A fait payer la même somme aux cadres (−5,5 % à 10 000 € brut).

### 16.10 Ce qui reste fragile
(1) **Loi jointe revenu × patrimoine reconstituée** (H74.4) : le plancher et le différé dépendent de qui a quels revenus. La forme HVP mise à l'échelle par quartile de niveau de vie est une approximation, et les revenus par quartile sont des ordres de grandeur ⚠️ V15302. (2) **Taux de distribution du capital** (1,5 / 2 / 3 %) : il décide de la part que le plancher retire (35 à 44 %) ⚠️ V15301. (3) **Encours du différé** (≈ 5 points de PIB de dette brute) et son traitement en comptabilité nationale ⚠️ V15308. (4) **Valeur de rendement** : elle évite les aberrations, mais crée une frontière entre biens professionnels et biens passifs, qu'il faut garder contre l'optimisation (c'est le contentieux classique des biens professionnels à l'IFI) ⚠️ V15304. (5) **Non-résidents** (droit de l'UE) ⚠️ V15309. (6) **Imputation de l'IS** : non retenue, comme dans la proposition de loi « Zucman » ⚠️ V15300 ; l'imputer ferait nettement baisser la recette (non chiffré dans le module). (7) Toutes les fragilités de la v7.3 sur le recalage × 1,4 et l'érosion (15.8, points 4 et 5) restent.

### 16.11 Si l'auteur adopte : lignes à changer dans document de travail de l'atelier, non publié (section 0), sans rien toucher avant sa décision
| N° | Poste (écart à la v5.10, Md€, central) | v7.2 | v7.3 | v7.4 B |
|---|---|---|---|---|
| F01 | Fonction des revenus (T(R), capital des retraités compris) | +29,66 | +24,54 | +29,66 (fonction de la v7.2) |
| F05 | Fonction du patrimoine (recette 26,28 → 66,23 → 54,52) | −60,14 | −20,19 | −31,90 |
| F09 | Plafonds (v7.4 : plus de plafond de 75 % ; différé dans F05) | +1,62 | −4,29 | +2,31 |
| F11 | Trusts | −0,53 | 0,00 | −0,20 |
| F12 | SCI | −0,91 | −0,01 | −0,34 |
| F22 | Plancher | −4,68 | −4,53 | −4,68 |
|  | **Effet sur le solde** | −90,68 | −60,49 | −60,85 |
|  | **Solde de croisière 2060** | −78,18 | −47,99 | −48,35 |

Les autres lignes (F02 IS, F03 retenue, F20 versement, F21 enfants) sont inchangées. Contrôle : v7.2 (−90,68) + écarts de F05, F09, F11 et F12 = −60,85 Md€, l'effet calculé. À reprendre aussi : l'« En une minute », les tableaux 0.2 à 0.4, le registre des propositions (N07/F05 : impôt plancher, règle de paiement, différé garanti, valeur de rendement), `sources/calculs/bilan_global.py` et document de travail de l'atelier, non publié.

### 16.12 Hypothèses (H74.x) et sources
- **H74.1** : τ(W) = 2 % × W / (W + 700 k€), résidence principale comprise (variante A : K = 1 M€) ; option RP : abattement de 100 000 €, non retenue.
- **H74.2** : impôt plancher : on impute la contribution personnelle due sur les revenus du capital, au prorata des revenus ; l'IS n'est pas imputé. Distributions : loyers au rendement net de `taxe_patrimoine.js` (H508) ; parts à 1,5 / 2 / 3 % ⚠️ V15300, V15301.
- **H74.3** : part de la résidence principale dans l'immobilier net, par tranche HVP (100 % en bas, 30 % pour le 1 % le mieux doté ; 70 % en moyenne) ⚠️ V15303.
- **H74.4** : loi jointe revenu × patrimoine : patrimoine moyen par quartile de niveau de vie (Insee Focus n° 371, figure 3b), forme HVP par quartile ; revenus 1 700 / 2 700 / 3 700 / 6 500 €/mois ; 1,7 adulte ⚠️ V15302.
- **H74.5** : règle de paiement x(N) = 50 % × N / (N + 72 000 €), avec un minimum de 2 % des actifs mobilisables ; différé portant intérêt au taux de l'État (1,3 % réel), durée 12 ans, 5 % de pertes ⚠️ V15305, V15308.
- **H74.6** : fonction des revenus recalibrée sur grille, avec la dette stable en macro de référence pour contrainte : variante B = v7.2, variante A = 412,5 / 66 % / 20 % / 1 500 €.
- **H74.7** : terres exploitées et forêts gérées à la valeur de rendement (assiette des terres × 0,5) ; biens professionnels : revenu net / 4 %, plafonné à la valeur vénale ; jeunes entreprises : valeur substantielle ⚠️ V15304, V15307.
- **Cas** : hypothèses dans les libellés (16.6) ⚠️ V15306.
- Sources : celles de la v7.3 ; Code général des impôts, art. 968 (usufruit), 974 (dettes déductibles), 976 (bois et forêts), 977 (barème de l'IFI) et 1716 bis (dation) ; Code civil, art. 815-9 (indemnité d'occupation) ; TFUE, art. 63 ; proposition de loi instaurant un impôt plancher de 2 % sur les très hauts patrimoines, adoptée par l'Assemblée nationale le 20/02/2025 ⚠️ V15300 ; pratique suisse de la valeur de rendement (LDFR, art. 10 ; circulaire n° 28 de la Conférence suisse des impôts) ⚠️ V15304. **Aucune de ces sources n'a été relue pour cette section** : les références sont à vérifier (registre V15300 à V15309).
