---
titre: Fonction des transmissions, crédit d'IS partiel et jeux de réglages (arbitrage 53) — couche sur la base de travail du 06/11/2026
date: 2026-11-06
statut: brouillon chiffré, PROPOSITION NON ADOPTÉE (l'auteur tranche) ; hypothèses HT1 à HT16 ; vérifications V18400 à V18416
---

# Faire perdre le capital, les grandes fortunes d'abord : ce que rapportent les transmissions et un crédit d'IS partiel

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026. C'est une demande de l'auteur, l'arbitrage 53 : les cadres doivent perdre un peu, et surtout le capital, en particulier les grandes fortunes. Le code est dans `modeles/systeme-ideal/transmissions_0611.js` (fonctions pures, aucun module existant modifié), avec ses tests `test_transmissions_0611.js` (38 vérifications). Les résultats sont dans `resultats_transmissions_0611.txt`, qui fait foi, produit par `rapport_transmissions_0611.js`. La couche datée **TRANS0611** (lignes TR01 à TR05) est ajoutée dans `sources/calculs/bilan_global.py` (« Tests : tous passés »). La base de travail (§ 000 du bilan) n'est pas écrasée. Conventions : Md€/an en croisière, €/mois pour les cas types. Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions.

## 0. L'essentiel

1. **La fonction des transmissions rapporte beaucoup moins que les +39 Md€ de la v5.10 dès qu'on veut un abattement large.** Recette nette au central, par rapport aux 20,8 Md€ de droits actuels, avec K = 100 000 € (progressivité forte) :
   - abattement de 100 000 € : **+16,7** Md€ (favorable +38,2, défavorable −1,5) ; 63 % des bénéficiaires ne paient rien ;
   - abattement de 300 000 € : **+4,3** (+22,4 / −9,9) ; **85 % ne paient rien**, soit le niveau d'aujourd'hui (85 à 90 % des successions en ligne directe, ⚠️ V18402) ;
   - abattement de 500 000 € : **−2,0** (+13,5 / −13,4) ; 92 % ne paient rien.
   
   Avec K = 500 000 € (progressivité douce), on perd encore 7 à 12 Md€. La v5.10 taxait 50 % dès le premier euro et ne comptait ni le fractionnement entre bénéficiaires, ni la dette différée de la fonction du patrimoine.
2. **Pourquoi si peu** [calcul] : à A = 300 000 €, l'impôt statutaire rapporterait 54,7 Md€. Il en reste 48,9 une fois déduite la dette différée de la v7.5, puis **25,1 après les comportements** : sous-déclaration et valorisation, exil, abattements multipliés par les donations aux petits-enfants. **91 % de la recette vient des bénéficiaires qui reçoivent plus d'1 M€ au cours de leur vie**, soit 6 % d'une génération.
3. **Le taux de 60 % au-delà de 10 M€ ne rapporte rien** (−0,2 Md€ au central) : la fuite qu'il provoque sur toute la base des très gros héritages mange le gain. C'est un **symbole**, pas une recette. Il reste défendable pour l'équité : à 50 M€ reçus, le taux moyen statutaire passe de 44 % (droit actuel théorique) à 56 % ; net des comportements, le taux effectif du sommet reste d'environ 26 %, contre environ 10 % aujourd'hui pour le 0,1 % (CAE).
4. **L'impôt de suite « court terme »** (transparence et couverture des départs à 30 %, `sources/impot-nationalite-et-erosion.md`, HN3) ajoute **+4,5 Md€** aux transmissions. Le « bien conçu central », visé en fin de mandat, ajouterait +12,4.
5. **Crédit d'IS partiel** (recette sur le barème de la base, réaction des dividendes comprise) :
   - crédit à 75 % : **+4,8 Md€** ;
   - crédit à 50 % : **+9,3** ;
   - crédit nul : **+17,5**.
   
   **Le prix** : un euro distribué supporte 77,5 % de prélèvements au total avec un crédit à 50 %, contre 65 % pour un euro de salaire au même niveau. **On renonce au principe « capital taxé comme le travail » de l'arbitrage 42** : il faut le dire.
6. **Les cibles « cadres −3 % » et « cadres −5 % » ne comblent pas le manque** avec les leviers du capital compatibles avec un abattement large. En revenu net santé, avec A = 300 000 € et un crédit à 50 %, il reste en macro de référence :
   - **37,2 Md€** avec des cadres à −3 % ;
   - **28,2 Md€** avec des cadres à −5 % ;
   - **21,4 Md€** si l'on ajoute l'impôt de suite « court terme ».
   
   Pour combler le manque avec des cadres à −5 %, il faut un **abattement de 100 000 €, un crédit d'IS nul et le patrimoine du haut « au mieux »** (+9,4) : c'est le jeu J5C, avec ses rentiers au-delà de 100 % de leur revenu.
7. **Jeu recommandé (JR, dette stable en macro de référence)** :
   - transmissions à A = 300 000 € (+4,3) ;
   - impôt de suite « court terme » sur les transmissions (+4,5) et sur le patrimoine (+2,3) ;
   - crédit d'IS à 50 % (+8,9) ;
   - fonction des revenus a = 0,6857 (+32,1).
   
   Les bas revenus restent largement au-dessus de la cible : Smic +74 €/mois, couple à deux Smic avec deux enfants +108. **Les cadres perdent 9 à 10 %** (−622 €/mois à 10 000 € brut), et non 3 à 5 %. Le rentier à 5 000 €/mois de dividendes perd 30 %. Les PO passent à 51,8 % (52,1 % élargis). **Je le recommande parce qu'il respecte l'abattement large**, mais il ne tient pas « cadres : pas trop ». L'alternative est **JA** (abattement de 100 000 €) : cadres à −6,6 %, mais un tiers des bénéficiaires qui ne payaient rien paient. **À l'auteur de choisir lequel des deux principes cède.**

## 1. Méthode

### 1.1 Assiette et loi du cumul reçu
- **Flux** : 300 Md€/an de successions et de donations, en flux économique vers 2020 (CAE, note n° 69). Assurance-vie comprise, sans exonération Dutreil ni démembrement : le modèle de la v5.10 taxait déjà ce flux entier (H178), et le démembrement est supprimé (H72.12). Ce qu'on demandait de vérifier : **oui, la fin du Dutreil et l'entrée de l'assurance-vie dans l'assiette sont déjà dans le modèle**. Rien n'est ajouté à ce titre.
- **Conjoint** : exonéré (report au second décès) ; 18 % du flux au central (10 % / 25 %), retiré de l'assiette (HT2).
- **Cumul reçu par bénéficiaire sur une vie** : loi log-normale calée sur le CAE (médiane 70 000 €, 90e centile 500 000 €, données DMTG 2006). Contrôle de la queue : la moyenne du 1 % vaut 4,86 M€ (CAE : plus de 4,2 M€) et celle du 0,1 % vaut 13,6 M€ (CAE : environ 13 M€). La loi est mise à l'échelle du flux économique hors conjoint (× 1,31 au central) avec une génération de 830 000 bénéficiaires. L'intégration se fait sur une grille en −log10(1 − u), précise jusqu'au dix-millionième supérieur.

### 1.2 La fonction (statutaire)
- On calcule x = cumul reçu − A. Le taux **marginal** vaut τ(x) = 50 % × x / (x + K) : il est nul à l'abattement, monte de façon lisse et ne dépasse jamais 50 %. C'est la forme « marg » de `capital-de-depart/continu.js`, donc **sans seuil ni tranche**, comme le veut l'auteur. L'impôt vaut 50 % × (x − K ln(1 + x/K)).
- **Option du sommet** : une rampe de +10 points entre 10 et 20 M€ reçus porte le marginal à 60 % au-delà de 20 M€. On évite ainsi la marche qu'aurait créée un seuil sec à 10 M€.
- K = 100 000 € (variante recommandée) donne un marginal de 25 % à A + 100 000 €, 40 % à A + 400 000 € et 45 % à A + 900 000 €. La sensibilité K = 500 000 € figure au § 2.
- **Entreprises** : le paiement est étalé sur dix ans, avec intérêt au taux réel, ou se fait en titres cédés par l'État. En croisière, le flux d'encaissement est le même. L'année 1 est plus basse (transition non chiffrée, ⚠️ V18413).

### 1.3 Comportements (par bénéficiaire, nets)
- **Dette différée de la v7.5** : une part du différé (26 Md€/an), soit 25 / 50 / 75 %, se règle sur l'actif successoral, où c'est une dette déductible. On la répartit selon le poids H/(H + 2 M€) (HT8).
- **Fractionnement** (saut de génération, donations aux petits-enfants) : ceux qui paieraient obtiennent en moyenne 0,25 / 0,5 / 1 abattement de plus (HT7).
- **Déclaration et planification** : d = 17 / 30 / 45 % à un marginal de 50 %, proportionnel au marginal et plafonné à 1,5 fois (HT5, `exil-patrimoines-preuves.md` § 6.2).
- **Exil** : e = 5 / 12 / 27 % des patrimoines mobiles (pondération H²/(H² + (1,3 M€)²)), proportionnel au marginal (HT6, même source).
- La base imposable vaut A_eff + (H1 − A_eff) × (1 − d) × (1 − e). En test, la fuite indexée sur le taux moyen plutôt que sur le marginal donne 28,5 au lieu de 25,1.
- **Contrôle sur le droit actuel** [calcul] : on passe dans la même chaîne le barème actuel en ligne directe (deux abattements de 100 000 €), sans niches. On obtient 29,0 Md€ au central (39,5 / 19,7), contre 20,8 encaissés. L'écart de 8,2 correspond au coût des niches estimé par le CAE : assurance-vie 4-5, Dutreil 2-3, démembrement 2-3 Md€. **La chaîne n'est donc ni trop dure ni trop douce**, à l'ordre de grandeur près. Le modèle laisse 78 % des bénéficiaires sans droits, contre 85-90 % observés : les abattements renouvelés tous les 15 ans et les niches ne sont pas modélisés (⚠️ V18404).
- **Réconciliation avec la v5.10** : 50 % au-delà de 100 000 €, sans fractionnement ni dette différée, donne 62,0 Md€ ici contre 59,6 en v5.10 (`partVie` 70,5 / 97,5) : écart de méthode de 4 %.

### 1.4 Crédit d'IS partiel
- La v7.1 fait entrer le dividende des résidents dans R pour son montant avant IS et lui accorde un crédit égal à l'IS payé (25 %). La variante ne crédite qu'une part c de cet IS.
- Le code réplique `BaremeV71.haut` et `retraitesCapital` avec le paramètre c. À c = 1, on retrouve exactement les fonctions d'origine (test). Le taux marginal sur le dividende reçu, qui pilote la réaction, vaut (t − 0,25 c) / 0,75.
- Les dividendes des bandes sous la coupure (8 % des dividendes) ne sont pas touchés : la recette est légèrement sous-estimée (⚠️ V18412).

### 1.5 Jeux
- Le manque de la base est de 52,1 Md€ (macro de référence, combinaison R1f + M1m + M2m + M3, `base_0611.js`).
- La fonction des revenus est réglée par a = m∞, sous la forme du jeu (a) du § 000.6. La perte des cadres s'entend en revenu net santé du cadre à 10 000 € brut (couche « mutuelle comptée », mode salaire, central).
- La dette est un effet constant dès 2029, comme la base.

## 2. Recette de la fonction des transmissions (Md€/an)

| Abattement A | K | 60 % au-delà de 10 M€ | Statique (central) | Recette fav. / central / déf. | Net des droits actuels | Bénéficiaires qui ne paient rien (central ; statutaire) |
|---|---|---|---|---|---|---|
| 100 000 € | 100 000 € | non | 71,0 | 59,1 / 37,7 / 19,5 | +38,3 / **+16,9** / −1,3 | 62,9 % ; 52,4 % |
| 100 000 € | 100 000 € | oui | 71,4 | 59,0 / 37,5 / 19,3 | +38,2 / **+16,7** / −1,5 | 62,9 % ; 52,4 % |
| 100 000 € | 500 000 € | oui | 48,3 | 40,5 / 25,5 / 13,2 | +19,7 / **+4,7** / −7,6 | 62,9 % ; 52,4 % |
| 300 000 € | 100 000 € | non | 54,3 | 43,2 / 25,3 / 11,1 | +22,4 / **+4,5** / −9,7 | 85,5 % ; 78,1 % |
| **300 000 €** | **100 000 €** | **oui** | 54,7 | 43,2 / 25,1 / 10,9 | +22,4 / **+4,3** / −9,9 | **85,5 %** ; 78,1 % |
| 300 000 € | 500 000 € | oui | 38,9 | 31,1 / 17,9 / 7,7 | +10,3 / **−2,9** / −13,1 | 85,5 % ; 78,1 % |
| 500 000 € | 100 000 € | oui | 44,8 | 34,3 / 18,8 / 7,4 | +13,5 / **−2,0** / −13,4 | 91,9 % ; 86,6 % |
| 500 000 € | 500 000 € | oui | 32,9 | 25,5 / 13,9 / 5,4 | +4,7 / **−6,9** / −15,4 | 91,9 % ; 86,6 % |

(Grille complète dans les résultats. Statutaire : part sous l'abattement légal, avant fractionnement.)

**Variante recommandée** (A = 300 000 €, K = 100 000 €, rampe à 60 %), au central :
- statutaire : 54,7 ; dette différée déduite : 48,9 ;
- net : 25,1, dont 2,8 perdus par l'exil ;
- sans fractionnement : 30,2 ; sans dette différée : 28,3 ;
- impôt de suite « court terme » : 46,7 / 29,6 / 15,2 ; « bien conçu central » : 52,5 / 37,5 / 23,4.

| Cumul reçu | Impôt nouveau | Taux moyen | Marginal | Droit actuel théorique (deux parents, sans niches) | Taux moyen actuel |
|---|---|---|---|---|---|
| 300 000 € | 0 € | 0 % | 0 % | 16 389 € | 5,5 % |
| 500 000 € | 45 069 € | 9,0 % | 33 % | 56 389 € | 11,3 % |
| 1 M€ | 246 028 € | 24,6 % | 44 % | 156 389 € | 15,6 % |
| 2 M€ | 705 481 € | 35,3 % | 47 % | 425 924 € | 21,3 % |
| 5 M€ | 2,16 M€ | 43,1 % | 49 % | 1,68 M€ | 33,7 % |
| 10 M€ | 4,62 M€ | 46,2 % | 49 % | 3,93 M€ | 39,3 % |
| 50 M€ | 28,0 M€ | 56,1 % | 60 % | 21,9 M€ | 43,9 % |

**Distribution par tranche de cumul reçu** (central, montants du flux économique) :

| Tranche | Bénéficiaires par génération | Part | Part de la masse | Taux actuel théorique | Taux nouveau statutaire | Taux nouveau net | Recette (Md€) | Part de la recette |
|---|---|---|---|---|---|---|---|---|
| 0 à 100 000 € | 434 562 | 52,4 % | 7,0 % | 0,0 % | 0,0 % | 0,0 % | 0,00 | 0 % |
| 100 000 à 300 000 € | 213 566 | 25,7 % | 15,4 % | 1,1 % | 0,0 % | 0,0 % | 0,00 | 0 % |
| 300 000 à 500 000 € | 70 631 | 8,5 % | 11,1 % | 8,7 % | 3,7 % | 0,0 % | 0,01 | 0 % |
| 500 000 à 1 M€ | 61 901 | 7,5 % | 17,5 % | 13,7 % | 17,2 % | 5,2 % | 2,25 | 9,0 % |
| 1 à 2 M€ | 30 974 | 3,7 % | 17,3 % | 17,9 % | 30,3 % | 14,2 % | 6,07 | 24,2 % |
| 2 à 5 M€ | 14 593 | 1,8 % | 17,5 % | 27,5 % | 39,4 % | 20,0 % | 8,63 | 34,4 % |
| 5 à 10 M€ | 2 856 | 0,34 % | 7,8 % | 36,6 % | 44,7 % | 23,1 % | 4,43 | 17,7 % |
| 10 à 50 M€ | 901 | 0,11 % | 5,8 % | 41,5 % | 49,4 % | 23,6 % | 3,40 | 13,5 % |
| 50 M€ et plus | 16 | 0,002 % | 0,5 % | 44,2 % | 57,3 % | 25,8 % | 0,31 | 1,2 % |

**Lecture** :
- jusqu'à 500 000 € reçus, le nouveau système fait payer **moins** que le barème actuel ;
- au-delà d'1 M€, il fait payer **beaucoup plus**, surtout parce qu'il n'y a plus d'assurance-vie, de Dutreil ni de démembrement ;
- le « taux actuel théorique » est celui du barème sans niches : le taux réel des gros héritages est bien plus bas aujourd'hui (le 0,1 % paie environ 10 %, CAE).

## 3. Crédit d'IS partiel

| Crédit | Recette (réaction comprise) | dont actifs | dont retraités | Statique | Érosion |
|---|---|---|---|---|---|
| 75 % | 4,82 | 3,99 | 0,83 | 5,77 | 17 % |
| 50 % | 9,33 | 7,72 | 1,61 | 11,55 | 19 % |
| 0 % | 17,49 | 14,47 | 3,02 | 23,09 | 24 % |

**Charge totale sur un euro de bénéfice distribué** (IS + fonction des revenus − crédit) comparée à un euro de coût employeur versé en salaire, barème de la base :

| Coût employeur R | Salaire | Dividende, crédit 100 % | 75 % | 50 % | 0 % |
|---|---|---|---|---|---|
| 3 000 €/mois | 58,9 % | 58,9 % | 65,2 % | 71,4 % | 83,9 % |
| 10 000 €/mois | 64,9 % | 64,9 % | 71,2 % | 77,4 % | 89,9 % |
| 50 000 €/mois | 65,0 % | 65,0 % | 71,2 % | 77,5 % | 90,0 % |

## 4. Jeux de réglages (macro de référence ; manque de la base 52,1 Md€)

| Jeu | Réglage | a | Revenus | Transmissions | Crédit | Patrimoine du haut | Total | Manque restant (réf. ; prudente) | PO officiels ; élargis | Cas > 100 % |
|---|---|---|---|---|---|---|---|---|---|---|
| J3 | cadres −3 % ; A = 300 000 € ; crédit 50 % | 0,6515 | 1,4 | 4,3 | 9,3 | 0 | 15,0 | **37,2** ; 66,1 | 50,5 % ; 50,9 % | 4 |
| J5 | cadres −5 % ; A = 300 000 € ; crédit 50 % | 0,6613 | 10,4 | 4,3 | 9,2 | 0 | 23,9 | **28,2** ; 57,2 | 50,8 % ; 51,2 % | 4 |
| J5S | J5 + impôt de suite « court terme » (transmissions, patrimoine +2,28) | 0,6613 | 10,4 | 8,8 | 9,2 | 2,3 | 30,7 | **21,4** ; 50,4 | 51,1 % ; 51,4 % | 4 |
| J5C | cadres −5 % ; A = 100 000 € ; crédit 0 % ; impôt de suite ; patrimoine « au mieux » (+9,4 : t∞ 4,5 %, K 700 k€) | 0,6613 | 10,4 | 23,1 | 17,5 | 9,4 | 60,4 | 0 (excédent 8,3) ; 20,7 | 52,1 % ; 52,4 % | 5 (+ rentiers du patrimoine « au mieux ») |
| JA | équilibre ; A = 100 000 € ; crédit 50 % ; impôt de suite (+2,28) | 0,6693 | 17,6 | 23,1 | 9,1 | 2,3 | 52,1 | 0 ; 29,0 | 51,8 % ; 52,1 % | 4 |
| **JR** | **équilibre ; A = 300 000 € ; crédit 50 % ; impôt de suite (+2,28)** | **0,6857** | **32,1** | **8,8** | **8,9** | **2,3** | **52,1** | **0 ; 29,0** | **51,8 % ; 52,1 %** | **4** |

Base de travail : 2 cas au-delà de 100 % (sur 24, le fondateur de start-up qui paie en titres étant hors décompte). Le crédit partiel en ajoute deux : 5 M€ d'actions cotées (109 %) et le parent à 10 M€ avant donation (110 à 114 %). Le rentier à 2 M€ d'actions arrive à 100 %.

**Cas types, revenu net santé (mutuelle comptée, mode salaire, central), écart au droit actuel en €/mois (%)** :

| Cas type | Aujourd'hui | Base | J3 | J5 | J5S | J5C | JA | **JR** |
|---|---|---|---|---|---|---|---|---|
| Célibataire au Smic | 1 674 | +97 | +96 | +90 | +90 | +90 | +85 | **+74 (4,4 %)** |
| Parent isolé, 2 enfants, au Smic | 2 551 | +135 | +134 | +127 | +127 | +127 | +121 | **+110 (4,3 %)** |
| Couple sans enfant, deux Smic | 3 022 | +189 | +186 | +169 | +169 | +169 | +155 | **+126 (4,2 %)** |
| Couple, 2 enfants, deux Smic | 3 457 | +173 | +170 | +153 | +153 | +153 | +138 | **+108 (3,1 %)** |
| Couple médian, 2 enfants | 4 307 | +647 | +641 | +597 | +597 | +597 | +562 | **+489 (11,4 %)** |
| Cadre seul à 5 000 € brut | 3 384 | +156 | +148 | +93 | +93 | +93 | +49 | **−42 (−1,2 %)** |
| Cadre seul à 10 000 € brut | 6 230 | −168 (−2,7 %) | −187 (−3,0 %) | −311 (−5,0 %) | −311 (−5,0 %) | −311 (−5,0 %) | −413 (−6,6 %) | **−622 (−10,0 %)** |
| Cadre seul à 20 000 € brut | 10 995 | −37 (−0,3 %) | −77 (−0,7 %) | −339 (−3,1 %) | −339 (−3,1 %) | −339 (−3,1 %) | −552 (−5,0 %) | **−991 (−9,0 %)** |
| Retraité, 1 200 € nets, 70 ans | 1 068 | +132 | +132 | +132 | +132 | +132 | +132 | **+132** |
| Retraité, 4 000 € nets, 70 ans (R1f) | 3 868 | +132 (sans R1f) | +89 | +89 | +89 | +89 | +89 | **+89** |
| Rentier, 5 000 €/mois de dividendes nets d'IS | 3 430 | −17 | −858 | −909 | −909 | −1 742 | −950 | **−1 036 (−30,2 %)** |

(La base reprend `sources/cas-types-nets-sante.md` § 4.1. Le rentier est comparé au PFU de 31,4 %, sans mutuelle comptée.)

## 5. Steelman et contradictions (règle 7)

- **Objection de fond** : « Un impôt successoral à 50-60 % sur les gros héritages fait fuir les familles d'entrepreneurs et vend les entreprises familiales à des fonds étrangers ; le Dutreil existe pour cela. »
  - *Réponse* : le paiement est étalé ou se fait en titres, ce qui évite la vente forcée. La Cour des comptes ne constate pas d'effet du Dutreil sur l'investissement ni sur l'emploi (rapport AN n° 3056). L'exil est compté (2,8 Md€ de recette perdue au central).
  - *Mais* : aucune étude ne mesure la réponse à un impôt national de cette ampleur, et le défavorable (−9,9 Md€ net) montre qu'on peut **perdre de la recette** par rapport à aujourd'hui.
- **Contradiction avec l'arbitrage 42** : un crédit d'IS partiel taxe le capital distribué plus que le travail (77,5 % contre 65 %). C'est un choix assumé de « faire perdre le capital », mais **il contredit « capital taxé comme le travail »**. Il pousse aussi à garder les bénéfices dans les sociétés : seule la transparence des holdings (v5.10) l'empêche, et elle n'est pas recalculée ici.
- **Contradiction entre les deux cibles de l'auteur** : abattement large (85 % ne paient rien) et « cadres : pas trop » ne tiennent pas ensemble avec un manque de 52 Md€. Les leviers du capital qui respectent l'abattement large rapportent ≈ 20 Md€ (29 avec un crédit d'IS nul). Le reste revient aux cadres, ou aux décisions qui ont creusé le trou (Sécurité sociale à 100 %, épargne réglementée exonérée, TVA de la restauration : § 000.6 du bilan).
- **Ligne indirecte** : la fonction unique traite pareil un enfant et un tiers. Or les droits actuels prélèvent 35 à 60 % sur les neveux et les tiers, une part notable des 20,8 Md€ (non isolée, ⚠️ V18414). Réserver l'abattement large aux descendants (et au partenaire) relèverait la recette : à chiffrer si l'auteur le souhaite.
- **Ego et récit** : « les grandes fortunes paieront » est vrai en taux (25 % nets au sommet contre ≈ 10 % aujourd'hui). C'est faux comme source principale de financement : **les bénéficiaires au-delà de 10 M€ apportent 3,7 Md€**, soit 7 % du manque.

## 6. État de la recherche

- **Ce qui est établi** :
  - l'héritage est très concentré (CAE n° 69 ; Insee HVP 2021) ;
  - la fuite des transmissions est surtout **déclarative** : écart de 35 à 40 % entre le flux économique et les déclarations (CAE) ;
  - l'exil des riches installés répond peu au taux (Jakobsen, Kleven et al., NBER 32153 : −2 % de riches par point d'impôt sur la fortune) ;
  - l'impôt successoral des États américains fait partir des milliardaires âgés (Moretti et Wilson, 2023 : 35 % des milliardaires du Forbes 400 quittent un État à impôt successoral) ;
  - les effets sur l'épargne et le travail des héritiers sont faibles (Goupille-Lebret et Infante, 2018).
- **Ce qui est débattu** : la réponse à des taux très élevés au sommet ; l'efficacité de l'assiette « reçu sur la vie » contre le fractionnement ; la double imposition des dividendes (le crédit d'impôt, ou « avoir fiscal », a été supprimé en France en 2005 sous la pression du droit de l'UE (arrêt Manninen, CJCE 2004 ⚠️ V18415) : un crédit réservé aux résidents doit être vérifié au regard de la libre circulation des capitaux).
- **Ce qui manque** : des données sur les héritages depuis 2006 (aucune enquête DMTG publiée depuis) ; la part de la ligne indirecte dans les DMTG ; une évaluation de l'impôt « reçu sur la vie » (Irlande : *Capital Acquisitions Tax*, seuils par groupe de parenté, non lu ⚠️ V18416).

## 7. Hypothèses (HT1 à HT16)

| N° | Hypothèse | Valeur (fav. / central / déf.) | Source ou méthode |
|---|---|---|---|
| HT1 | Flux de transmissions, assurance-vie comprise, sans Dutreil ni démembrement | 300 Md€ | CAE n° 69 ; H178 ⚠️ V18400 |
| HT2 | Part du flux au conjoint, exonérée | 10 / 18 / 25 % | deces_realisation.js PARAM.cj (H353) |
| HT3 | Progressivité : K | 100 000 € (reco) ; 500 000 € (sensibilité) | choix de Claude |
| HT4 | Rampe du sommet | +10 points de 10 à 20 M€ | demande de l'auteur |
| HT5 | Déclaration et planification à 50 % | 17 / 30 / 45 %, × marginal / 50 %, plafond × 1,5 | exil-patrimoines-preuves.md § 6.2 |
| HT6 | Exil des patrimoines mobiles (> ≈ 1,3 M€) | 5 / 12 / 27 % × marginal / 50 % | idem ; V8110 |
| HT7 | Fractionnement : abattements supplémentaires | 0,25 / 0,5 / 1 | hypothèse ⚠️ V18405 |
| HT8 | Part du différé de la v7.5 réglée sur la succession | 25 / 50 / 75 % de 26 Md€ | hypothèse ⚠️ V18406 |
| HT9 | Loi du cumul reçu : log-normale (médiane 70 000 €, P90 500 000 €), mise à l'échelle du flux | × 1,43 / 1,31 / 1,19 | CAE n° 69 (DMTG 2006) ⚠️ V18403 |
| HT10 | Bénéficiaires par génération | 830 000 | Eurostat demo_pjan (capital de départ) |
| HT11 | Impôt de suite « court terme » | transparence 30 %, couverture des départs 30 % | impot-nationalite-et-erosion.md HN3 ⚠️ V18411 |
| HT12 | Crédit partiel : seuls les dividendes des bandes au-dessus de la coupure et des retraités | — | bareme_v71.js ⚠️ V18412 |
| HT13 | Paiement étalé ou en titres sans effet en croisière | — | ⚠️ V18413 |
| HT14 | Perte des cadres mesurée sur le cadre à 10 000 € brut, en revenu net santé | — | cas_types_nets_0611.js |
| HT15 | Jeux : fonction des revenus réglée par a = m∞ seul (m0, K, S inchangés) | — | forme du jeu (a) de base_0611.js |
| HT16 | Patrimoine du haut : impôt de suite « court terme » +2,28 (réglage inchangé), « au mieux » +9,4 | — | consigne du coordinateur ; impot-nationalite-et-erosion.md § 3 |

## 8. Questions pour l'auteur

1. **Abattement** : 300 000 € (85 % ne paient rien, cadres à −10 % pour équilibrer) ou 100 000 € (63 % ne paient rien, cadres à −6,6 %) ?
2. **Crédit d'IS** : 50 % (+9 Md€, capital distribué taxé 12,5 points de plus que le travail) ou 75 % (+5 Md€) ?
3. **60 % au sommet** : le garder comme symbole, en sachant qu'il ne rapporte rien ?
4. **Abattement réservé aux descendants**, avec la ligne indirecte taxée dès le premier euro (à chiffrer) ?
5. **Revoir une décision qui creuse le trou** plutôt que d'alourdir les cadres ?

## Sources mobilisées

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts |
|---|---|---|---|
| CAE, note n° 69, *Repenser l'héritage* (Dherbécourt, Fack, Landais, Stantcheva, décembre 2021), via `sources/exil-patrimoines-preuves.md`, `recherche-generations-patrimoine.md` | flux de 300 Md€ ; médiane 70 000 €, P90 500 000 €, 1 % > 4,2 M€, 0,1 % ≈ 13 M€ ; écart de déclaration 35-40 % ; coûts des niches | B | organisme rattaché au Premier ministre |
| `sources/exil-patrimoines-preuves.md` § 6 (NBER 32153 ; Moretti et Wilson 2023 ; DGFiP via France Stratégie 2023) | fourchettes de déclaration (17/30/45 %) et d'exil (5/12/27 % des patrimoines mobiles) | A/B (études) ; B (combinaison du dépôt) | coécrit par Claude (Anthropic) et l'auteur |
| `sources/impot-nationalite-et-erosion.md`, `variante_nationalite_0611.js` | leviers « court terme » 30 % / 30 % ; patrimoine du haut +2,28 (+9,4 au mieux) | B (modèle du dépôt) | idem |
| [Moneyvox, « Héritage : qui paie les droits de succession et combien »](https://www.moneyvox.fr/impot/actualites/93930/heritage-qui-paie-les-droits-de-succession-et-combien) et [« Risquez-vous vraiment de payer des droits de succession ? »](https://www.moneyvox.fr/impot/actualites/110999/heritage-risquez-vous-vraiment-de-payer-des-droits-de-succession) (consultés le 06/11/2026) | 85 à 90 % des successions en ligne directe non imposées (estimation attribuée au CAE) ; 62 % de déclarations exonérées (notariat, via Les Échos) | C | presse financière grand public |
| CGI, art. 777 et 779 (barème et abattement en ligne directe ; relevés dans le dépôt, Légifrance 403) | barème de 5 à 45 %, abattement de 100 000 € | A | — |
| Insee, tableaux 3.216-3.217 (via le bilan, ligne P09) | DMTG 2024 : 20,8 Md€ | A | — |
| `modeles/systeme-ideal/bareme_v71.js`, `base_0611.js`, `cas_types_nets_0611.js` | barème, crédit d'IS, manque, cas types nets | B (modèle du dépôt) | coécrit par Claude (Anthropic) et l'auteur |
| Rapport AN n° 3056 (commission d'enquête sur les plus hauts patrimoines, 2026), via `chiffrage-grandes-fortunes-holdings.md` | Dutreil : coût 3,3-5,5 Md€, absence d'effet différencié sur l'investissement | B | rapport parlementaire |
