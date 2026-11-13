---
titre: Fonction unique — le minimum garanti fondu dans la fonction des revenus
statut: adoptée par l'auteur le 13/11/2026 avec μ = 0,38 (voir la fin du fichier) ; intégrée au modèle par la couche datée decisions_1311.js
code: modeles/systeme-ideal/fonction_unique_1311.js (fonctions pures) ; test_fonction_unique_1311.js (72 vérifications) ; rapport_fonction_unique_1311.js (tableaux)
---

# Fonction unique (13/11/2026)

Des hypothèses et des ordres de grandeur, jamais des prédictions. Euros de 2025-2026, €/mois par adulte (R = coût employeur mensuel + revenus du capital), Md€/an pour les masses.

## 1. La formule en une ligne

Pour une personne seule :

**C(R) = a·R − P − (a − μ)·K_P·(1 − e^(−R/K_P)), avec K_P = (S + (a − m0)·K − P) / (a − μ)**

taux sur l'euro suivant : **m(R) = a − (a − μ)·e^(−R/K_P)** ; revenu disponible : R − C(R).

| Paramètre | Valeur | Rôle |
|---|---|---|
| P | 627 € + L, L = min(250 €, loyer payé) | ce que l'on touche à revenu nul (877 € pour un locataire, 627 € sans loyer) |
| μ | 0,40 | taux sur le premier euro gagné, le même pour tous |
| a | 0,6515 | taux du haut, inchangé |
| S, m0, K | 412,5 € ; 0,20 ; 1 500 € | réglages actuels, qui ne servent plus qu'à fixer K_P et le haut de la courbe |
| K_P | 846 € (locataire), 1 840 € (sans loyer) | vitesse de la montée, déduite des autres paramètres |

La part logement se traite sans règle à part : elle relève le point de départ P de 250 € et raccourcit la montée (K_P passe de 1 840 à 846 €), ce qui la retire dans la même fonction. Pourquoi ce choix : c'est la seule manière, avec une seule exponentielle, de garder à la fois (1) le même taux sur le premier euro pour tous, (2) le même haut de courbe pour tous, (3) une part logement plafonnée au loyer (un loyer de 150 € donne P = 777 € et une valeur intermédiaire de K_P, sans cas particulier).

Contrôle de construction : au-dessus de quelques milliers d'euros, C(R) rejoint exactement la fonction actuelle, a·R − S − (a − m0)·K (même asymptote : (a − μ)·K_P + P = S + (a − m0)·K). Les hauts revenus ne voient aucune différence (moins de 1 €/mois à 10 000 €, 0 à 15 000 €).

## 2. Ce qu'elle change

- **La bosse disparaît.** Aujourd'hui, une personne seule locataire voit son taux sur l'euro suivant monter à **70,7 % juste avant R = 3 568 €** (2 271 € de revenu disponible), puis retomber à **61,0 %** quand le complément s'arrête. Une personne sans loyer a la même bosse plus bas : 59,8 % puis 46,5 % à R = 1 323 €. Avec la fonction unique, le taux part de 40 % et monte sans jamais redescendre vers 65,15 %, qu'il n'atteint jamais : **le taux maximal est a = 65,15 %, approché par le haut de la distribution** (déjà 64,9 % à 4 000 € pour un locataire). Aucun revenu moyen ne paie plus sur l'euro suivant qu'un haut revenu.
- **Le premier euro ne change pas** : 40 % aujourd'hui pour un allocataire du plancher (20 % de la fonction plus 25 % × 80 % de retrait du complément), 40 % avec la fonction unique.
- **Le prix à payer** : pour un locataire, la montée est plus rapide entre 250 et 1 250 € (+0,3 à +1,6 point) ; pour une personne sans loyer, la montée est plus douce sous 1 300 € (−2 à −7 points) puis plus raide entre 1 500 et 3 000 € (+1 à +5,5 points), là où la règle actuelle offrait un creux après la fin du complément.
- **La règle des 25 centimes disparaît** du texte du chapitre 4 : le retrait du plancher est désormais inclus dans le taux sur l'euro suivant.

## 3. Couples et enfants : traités comme aujourd'hui

Le modèle actuel applique la fonction individuelle à chaque adulte, puis une règle de ménage : le plancher du ménage (627 € seul ou parent seul, 1 066 € pour un couple, plus une part logement de 250 € par ménage plafonnée au loyer, soit 877 et 1 316 € pour des locataires) est complété, puis retiré sur le gain du ménage. Les montants par enfant (200 € par enfant, 250 € de plus par enfant pour un parent seul) s'ajoutent hors plancher.

La fonction unique garde ces trois éléments. Chaque adulte garde sa fonction individuelle ; le ménage reçoit un terme de plancher fonction de son revenu total R_h (n adultes, P_h plancher du ménage hors enfants) :

F_h(R_h) = (a − m0)·K·e^(−R_h/K) − (a − μ)·K_h·e^(−R_h/K_h), avec K_h = ((a − m0)·K − (P_h − n·S)) / (a − μ).

Pour une personne seule, fonction individuelle + F_h donne exactement la formule du § 1. Pour un couple, K_h vaut 741 € (locataire) ou 1 735 € (sans loyer). Condition : P_h − n·S < (a − m0)·K = 677,25 €, vraie pour tous les planchers du modèle (au plus 491 €). Les montants par enfant ne changent pas.

Monotonie dans un couple (démonstration) : le taux sur l'euro suivant de l'adulte i, de revenu R_i, dans un ménage de revenu total R_h ≥ R_i, vaut a − (a − m0)·(e^(−R_i/K) − e^(−R_h/K)) − (a − μ)·e^(−R_h/K_h). Les deux termes retranchés sont positifs et décroissent quand R_i monte (le premier parce que e^(−R_i/K)·(1 − e^(−R_autres/K)) décroît en R_i). Le taux est donc croissant et toujours inférieur à a, quel que soit le revenu de l'autre adulte. Le test le vérifie numériquement de 0 à 50 000 € pour huit situations (seul, sans loyer, loyer de 100 €, couple avec conjoint sans revenu, au Smic, à 5 000 €, parent seul).

## 4. Hypothèses

- **H-FU1** : fonction actuelle a = 0,6515 (correction_0811.js), S = 412,5 €, m0 = 0,20, K = 1 500 € (v7.4 B) ; règle actuelle du plancher : retrait de 25 % du gain net du ménage (bareme_deux_fonctions_v7.js, H7.3).
- **H-FU2** : μ = 0,40, taux du premier euro d'un allocataire du plancher aujourd'hui. *Choix de Claude.* La valeur qui rend la réforme exactement neutre au central est μ = 0,437 (premier euro à 43,7 %).
- **H-FU3** : planchers hors enfants : 627 € (seul, parent seul), 1 066 € (couple), part logement 250 € par ménage plafonnée au loyer (decisions_0811.js, HE6 ; chapitre 4). Le plancher du couple sans loyer (1 316 − 250) est une lecture de la ligne PL01, qui retire 250 € par ménage. ⚠️ À confirmer par l'auteur.
- **H-FU4** : le terme de plancher dépend du revenu total du ménage R_h (coût employeur), et non plus du gain net après contribution. *Choix de Claude*, pour que la formule tienne en une ligne pour une personne seule.
- **H-FU5** : montants par enfant et majoration parent seul inchangés, hors plancher, sans retrait.
- **H-FU6** : recette chiffrée avec le moteur de bareme_unique_v6.js, sans le modifier : adultes non retraités des dix dixièmes de palier 1 (quadrature à 5 points, dispersion 0,3 / 0,6 / 0,9 selon le scénario), bénéficiaires sans revenu exclus (ils touchent P dans les deux règles), calage k du plancher sur la dépense de la v5.10 (V.kPlancher : 0,236 / 0,207 / 0,178). Ce calage suppose que la part des adultes qui touchent réellement le complément (ménage éligible) est la même dans la zone de retrait actuelle et dans la queue plus longue de la nouvelle règle (jusqu'à 6 000 € environ). ⚠️ Fragile : la nouvelle règle verse de petits montants plus haut, où la structure des ménages diffère.
- **H-FU7** : part des bénéficiaires sans loyer (propriétaires et hébergés sans loyer) : 27 / 19 / 7 % (decisions_0811.js, HE6, cote C), appliquée à toute la zone de retrait. ⚠️ Les jeunes salariés hébergés par leurs parents sont sans doute plus nombreux dans la zone de retrait que parmi les allocataires du RSA.
- **H-FU8** : chiffrage mécanique, sans réaction de l'emploi, comme le plancher et le bas de distribution du moteur. Le sens des réactions : le premier euro ne change pas ; la montée plus rapide des locataires entre 250 et 1 250 € joue contre l'emploi à temps partiel ; la disparition de la bosse vers 3 000-3 600 € joue pour les heures et les promotions. La littérature trouve des réactions de participation plus fortes en bas de l'échelle que des réactions d'heures au milieu (Saez, 2002, *Quarterly Journal of Economics* 117(3) ; Immervoll et al., 2007, déjà utilisés par le modèle). ⚠️ À VÉRIFIER : référence de Saez citée de mémoire, non relue pour ce rapport.

## 5. Tableau comparatif : personne seule

« Actuel » = fonction actuelle + complément (877 € locataire, 627 € sans loyer, retrait de 25 % du gain net) ; « unique » = formule du § 1. Écart en €/mois de revenu disponible (+ = la personne gagne).

| R | taux actuel (loc.) | taux unique (loc.) | dispo actuel (loc.) | dispo unique (loc.) | écart (loc.) | taux actuel (sans loyer) | taux unique (sans loyer) | écart (sans loyer) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 40,0 % | 40,0 % | 877 | 877 | 0 | 40,0 % | 40,0 % | 0 |
| 250 | 45,2 % | 46,4 % | 1 020 | 1 019 | −2 | 45,2 % | 43,2 % | +3 |
| 500 | 49,6 % | 51,2 % | 1 152 | 1 146 | −5 | 49,6 % | 46,0 % | +10 |
| 750 | 53,3 % | 54,8 % | 1 273 | 1 263 | −9 | 53,3 % | 48,4 % | +20 |
| 1 000 | 56,5 % | 57,4 % | 1 386 | 1 373 | −13 | 56,5 % | 50,5 % | +34 |
| 1 250 | 59,1 % | 59,4 % | 1 491 | 1 477 | −14 | 59,1 % | 52,4 % | +50 |
| 1 500 | 61,4 % | 60,9 % | 1 590 | 1 576 | −14 | 48,5 % | 54,0 % | +44 |
| 1 750 | 63,3 % | 62,0 % | 1 684 | 1 673 | −11 | 51,1 % | 55,4 % | +32 |
| 2 000 | 64,9 % | 62,8 % | 1 774 | 1 767 | −7 | 53,2 % | 56,7 % | +22 |
| 2 250 | 66,3 % | 63,4 % | 1 860 | 1 859 | −1 | 55,1 % | 57,7 % | +15 |
| 2 500 | 67,5 % | 63,8 % | 1 942 | 1 950 | +7 | 56,6 % | 58,7 % | +9 |
| 2 750 | 68,4 % | 64,2 % | 2 023 | 2 040 | +17 | 57,9 % | 59,5 % | +4 |
| 3 000 | 69,3 % | 64,4 % | 2 100 | 2 129 | +29 | 59,0 % | 60,2 % | +1 |
| 3 250 | 70,0 % | 64,6 % | 2 176 | 2 218 | +42 | 60,0 % | 60,9 % | −2 |
| 3 500 | 70,6 % | 64,7 % | 2 250 | 2 306 | +56 | 60,8 % | 61,4 % | −3 |
| 3 750 | 61,4 % | 64,9 % | 2 341 | 2 394 | +53 | 61,4 % | 61,9 % | −5 |
| 4 000 | 62,0 % | 64,9 % | 2 437 | 2 482 | +45 | 62,0 % | 62,3 % | −6 |
| 4 250 | 62,5 % | 65,0 % | 2 531 | 2 569 | +38 | 62,5 % | 62,7 % | −6 |
| 4 500 | 62,9 % | 65,0 % | 2 624 | 2 657 | +33 | 62,9 % | 63,0 % | −6 |
| 4 750 | 63,2 % | 65,1 % | 2 717 | 2 744 | +28 | 63,2 % | 63,2 % | −6 |
| 5 000 | 63,5 % | 65,1 % | 2 808 | 2 832 | +24 | 63,5 % | 63,5 % | −6 |
| 5 250 | 63,8 % | 65,1 % | 2 899 | 2 919 | +20 | 63,8 % | 63,7 % | −6 |
| 5 500 | 64,0 % | 65,1 % | 2 989 | 3 006 | +17 | 64,0 % | 63,9 % | −6 |
| 5 750 | 64,2 % | 65,1 % | 3 079 | 3 093 | +14 | 64,2 % | 64,0 % | −6 |
| 6 000 | 64,3 % | 65,1 % | 3 168 | 3 181 | +12 | 64,3 % | 64,2 % | −5 |
| 8 000 | 64,9 % | 65,1 % | 3 874 | 3 878 | +3 | 64,9 % | 64,8 % | −3 |
| 10 000 | 65,1 % | 65,1 % | 4 574 | 4 575 | +1 | 65,1 % | 65,0 % | −1 |
| 15 000 | 65,1 % | 65,1 % | 6 317 | 6 317 | 0 | 65,1 % | 65,1 % | 0 |

Variante A (même K pour tout, la plus simple à écrire : C(R) = a·R − P − (a − m0 − (P − S)/K)·K·(1 − e^(−R/K))) : elle est aussi sans bosse et rapporte +0,6 Md€, mais elle taxe le premier euro d'un locataire à **51 %** et fait perdre 45 € par mois au locataire au Smic, 64 € au couple dont un seul adulte est au Smic. Écartée.

## 6. Cas types

| Cas | actuel | unique | écart |
|---|---:|---:|---:|
| Seul, Sans revenu, locataire | 877 | 877 | 0 |
| Seul, Sans revenu, sans loyer | 627 | 627 | 0 |
| Seul, Smic (coût employeur 1 941 €), locataire | 1 753 | 1 745 | −8 |
| Seul, Smic (coût employeur 1 941 €), sans loyer | 1 581 | 1 605 | +25 |
| Seul, Salaire médian (2 735 € brut, coût employeur 3 507 €), locataire | 2 253 | 2 309 | +56 |
| Seul, Salaire médian (2 735 € brut, coût employeur 3 507 €), sans loyer | 2 247 | 2 243 | −3 |
| Seul, Coût employeur 4 000 €, locataire | 2 437 | 2 482 | +45 |
| Seul, Coût employeur 4 000 €, sans loyer | 2 437 | 2 431 | −6 |
| Seul, Coût employeur 8 000 €, locataire | 3 874 | 3 878 | +3 |
| Seul, Coût employeur 8 000 €, sans loyer | 3 874 | 3 872 | −3 |
| Couple sans revenu, locataire | 1 316 | 1 316 | 0 |
| Couple, un Smic et un sans revenu, locataire | 2 192 | 2 165 | −27 |
| Couple, deux Smic, sans enfant, locataire | 3 161 | 3 211 | +50 |
| Couple, deux Smic, deux enfants, locataire | 3 561 | 3 611 | +50 |
| Couple médian, deux enfants, locataire | 4 893 | 4 899 | +6 |
| Parent seul au Smic, deux enfants, locataire | 2 653 | 2 645 | −8 |

Le Smic et le médian du tableau sont ceux du modèle (OpenFisca 2026) : Smic à 1 867 € brut (coût employeur 1 941 €), médian à 2 735 € brut (coût employeur 3 507 €, la moitié du couple médian). Les montants 4 000 et 8 000 € sont des coûts employeur.

**Qui gagne** : les personnes seules locataires entre 2 400 et 8 000 € (jusqu'à +60 €/mois vers 3 570 €, là où la bosse était la plus haute ; +56 € au salaire médian) ; les personnes seules sans loyer entre 250 et 3 000 € (jusqu'à +55 € vers 1 320 € ; +25 € au Smic) ; les couples de deux Smic (+50 €).

**Qui perd** : les personnes seules locataires entre 250 et 2 300 € (jusqu'à −14 € vers 1 340 € ; −8 € au Smic) ; le parent seul au Smic (−8 €) ; le couple dont un seul adulte travaille au Smic (−27 €) ; les personnes seules sans loyer au-dessus de 3 100 € (−2 à −6 €). Les hauts revenus et les personnes sans revenu ne bougent pas.

## 7. Recette

Écart à la règle actuelle (Md€/an, + = l'État gagne) : **−0,74 au central** (−1,11 en bas, −0,30 en haut). Le complément actuel coûte, dans la zone de retrait, 10,34 Md€ au central ; le terme de plancher unique 11,08 Md€. C'est un coût de l'ordre de 0,03 % du PIB, à comparer aux ≈ 9 Md€ que vaut 0,01 de a.

Méthode : fonction_unique_1311.js, recette(), qui reprend la masse du plancher du moteur (même population, mêmes nœuds, même calage k) pour les deux règles, pondérées par la part sans loyer (H-FU6, H-FU7). La fonction individuelle n'est pas modifiée : les recettes du haut et du bas du moteur, les retraités et le capital sont inchangés par construction.

Constat annexe (⚠️ à relire avant correction) : le bilan actuel du modèle compte le complément de la zone de retrait à 877 € pour tout le monde et ne retire la part logement des personnes sans loyer qu'à revenu nul (ligne PL01). La règle telle qu'elle est écrite au chapitre 4 et sur le site retire aussi la part logement dans la zone de retrait : le modèle surestime donc la dépense d'environ **1,95 Md€** au central (0,74 à 2,61). Comparée au bilan tel qu'il est tenu, la fonction unique fait gagner +1,2 Md€ à l'État. Je n'ai rien corrigé dans les modules existants.

## 8. Recommandation de Claude

*Recommandation de Claude, pas une décision.* Adopter la forme B avec μ = 0,40. Elle répond exactement à la demande (une seule courbe, croissante, plafonnée à 65,15 %, plancher intact à revenu nul, premier euro inchangé, haut inchangé) pour un coût de 0,7 Md€ par an, dans la marge d'erreur du modèle. Deux réserves à dire dans le texte : (1) la réforme déplace l'effort de quelques euros vers les locataires qui travaillent peu (−8 à −14 €), alors qu'elle soulage les revenus moyens ; on peut l'assumer (c'est le prix d'une courbe sans bosse) ou prendre μ un peu plus bas : à 0,38, la recette baisse de 1,1 Md€ et la perte du locataire au Smic tombe à −5 € (pire perte −9 €) ; à 0,36, 1,4 Md€ et −2 € (pire perte −5 €) ; le couple dont un seul adulte est au Smic perd encore 22 à 24 € ; (2) le chiffrage repose sur un calage du plancher (k) fait pour l'ancienne règle, et ne compte aucune réaction de l'emploi. Si l'auteur adopte, il faut mettre à jour le calculateur du site, le § « Le plancher » du chapitre 4 (la règle des 25 centimes disparaît) et le § fonction des revenus du chapitre 3, et rouvrir la ligne PL01 du bilan.

## 9. En langage simple (pour le site)

Avant, deux règles s'empilaient : la contribution sur les revenus, et un filet qui complétait jusqu'au minimum garanti puis se retirait de 25 centimes par euro gagné. Leur somme faisait une bosse : vers 2 300 € nets par mois, l'euro suivant était pris à 71 %, plus que pour un cadre (65 %). Désormais, le minimum garanti est inclus dans la courbe elle-même : à revenu nul, on reçoit 877 € si l'on paie un loyer, 627 € sinon ; sur le premier euro gagné, l'État prend 40 centimes, comme aujourd'hui, et cette part monte doucement sans jamais redescendre ni dépasser 65 centimes. Personne ne paie plus sur l'euro suivant parce qu'il gagne un revenu moyen, et le coût est d'environ 0,7 milliard d'euros par an, selon notre modèle.

## 10. Refaire le calcul

Depuis modeles/systeme-ideal/ : la liste de chargement est en tête de test_fonction_unique_1311.js (celle de test_bareme_unique_v6.js, puis fonction_unique_1311.js).

```
$JSC $LIST test_fonction_unique_1311.js       # 72 vérifications
$JSC $LIST rapport_fonction_unique_1311.js    # tableaux des § 5 à 7
```

Calcul exécuté le 13/11/2026 ; sources des chiffres d'entrée : correction_0811.js, bareme_unique_v6.js, decisions_0811.js, decisions_0511i.js (cas types OpenFisca), tous dans ce dossier. Rédigé par Claude (Anthropic) : conflit d'intérêts déclaré, une IA qui propose une règle est exposée à la complaisance envers sa propre proposition.

## Décision de l'auteur (13/11/2026)
Adoptée avec un premier euro à 38 % (μ = 0,38, coût ≈ 1,1 Md€ par an au central, perte du locataire au Smic ramenée à ≈ −5 €). Calculateur du site mis à jour ; chapitres 3 et 4 à réécrire.

Intégration au modèle (13/11/2026) : couche datée `decisions_1311.js` (tests `test_decisions_1311.js`), au-dessus de DECISIONS1111D, sans rien écraser. Le constat annexe du § 7 est confirmé à la relecture : la dépense du plancher dans la zone de retrait (bareme_unique_v6.js plancher(), optimum.js massesPlancher, type « personne seule locataire », P = 877 €) n'a jamais été corrigée pour les personnes sans loyer ; PL01 (decisions_0811.js) ne retire la part logement qu'aux 3,3 M de bénéficiaires à revenu nul, alors que la règle du chapitre 4 la retire à quiconque ne paie pas de loyer. Deux lignes, constantes dès 2029 (Md€/an, + améliore le solde, favorable / central / défavorable) : FU01, correction de convention de PL01 : 2,61 / **1,95** / 0,74 ; FU02, la décision à μ = 0,38 : −1,51 / **−1,07** / −0,55 ; net : 1,10 / **0,88** / 0,19. Au central (taux fixe, macro de référence) : déficit 2032 de 5,73 à 5,69 % du PIB, 2038 de 4,52 à 4,49 % ; dette 2032 de 132,3 à 132,1 %, 2038 de 138,9 à 138,6 %, 2058 de 150,4 à 149,5 %. Banc des programmes : § 14 de `modeles/banc-programmes/resultats-v2.md`.
