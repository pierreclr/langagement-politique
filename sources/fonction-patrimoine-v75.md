---
titre: Fonction du patrimoine v7.5 (proposition) — régime propre à la résidence principale, abattement unique, effets de bord
date: 2026-11-06
statut: brouillon chiffré, PROPOSITION NON ADOPTÉE ; hypothèses H75.1 à H75.8 (plus HQ1 à HQ12 de l'étude par tranche) ; vérifications V16900 à V16917
---

# Fonction du patrimoine v7.5 : protéger les petits, taxer davantage les grands

Transparence : texte et code écrits par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026, à partir de son recadrage du jour et de deux compléments transmis l'après-midi (abattement unique à comparer ; effets de bord à chiffrer). Code : `modeles/systeme-ideal/decisions_0611_v75.js` (fonctions pures, ne modifie aucun module ; `bilan_global.py` non touché), tests `test_decisions_0611_v75.js` (36 vérifications), résultats `resultats_decisions_0611_v75.txt`, qui font foi, produits par `rapport_decisions_0611_v75.js`. Conventions : euros 2024-2026, €/an par ménage, Md€/an pour les masses. Pour chaque chiffre, la nature est indiquée : **[fait]** sourcé, **[calcul]** reproductible, **[estimation]** sous hypothèses.

## 0. L'essentiel

1. **La contrainte de l'auteur est tenable.** Aucune tranche de patrimoine net jusqu'à 1 M€ ne paie plus sur son stock qu'aujourd'hui (taxe foncière + droits de mutation annualisés + IFI + taxe d'habitation des résidences secondaires), et aucun des cas types modestes non plus : retraité propriétaire, primo-accédant, livrets, petit bailleur, maison de famille [calcul, statique]. Le gain vient surtout de la fin des droits de mutation (17,2 Md€), que la nouvelle formule ne réintroduit pas.
2. **La variante recommandée, si l'objectif est de prélever le plus possible sur les grands patrimoines sans toucher aux petits :** résidence principale à **0,25 % de sa valeur jusqu'à 1 M€ par ménage** (la taxe foncière moyenne actuelle), et, sur tout le reste, **P(W) = 3 % × W² / (W + 400 000 €)**, avec l'impôt plancher et le paiement plafonné de la v7.4 et deux corrections (la part due sur les actifs mobilisables est toujours payée, en titres au besoin ; le plancher impute aussi l'impôt sur le revenu professionnel tiré du capital exploité).
3. **Elle ne comble pas le manque.** Recette : **62,5 Md€/an**, soit **+8,0 Md€** de plus que la v7.4 B (54,52). Elle comble **43 % des 18,7 Md€** de manque de référence et **27 % des 29,1 Md€** (avec les décisions en attente) [estimation]. Sous la contrainte dure et avec un taux plafond de 3 % au plus, **aucune variante testée ne comble le manque** : le maximum est de +11,2 Md€, avec un abattement unique de 500 000 € (§ 4). Les 200 Md€ souhaités par l'auteur sur le patrimoine (stock et transmissions ; 84 aujourd'hui) sont hors de portée : on est à ≈ 83 Md€.
4. **Trois défauts sont à dire sans détour.**
   - **(a) Le différé** : 26,0 Md€, soit 57 % de la fonction. **On encaisse 36,6 Md€ dans l'année, moins que la v7.4 B (42,1)** pendant toute la montée en charge.
   - **(b) Le comportement** : à 3 %, la chaîne de la v7.4 prévoit l'érosion de 59 % du capital mobile du 1 % le plus riche (35 % à 2 %). La recette nette n'est que 57 % du dû statique : elle dépend d'hypothèses fragiles.
   - **(c) Le locatif** : le bailleur aisé paie 2,9 % de marginal sur un logement qui rapporte ≈ 2 % net. La charge sur ce bien dépasse son revenu (la part non payée est différée), et une partie peut passer dans les loyers (§ 6).
5. **Régime propre à la RP ou abattement unique ?** À réglage égal (1 M€, 3 %, 400 k€), l'abattement unique rapporte **23 Md€ de moins** (39,3 contre 62,5) : il exonère jusqu'à 1 M€ d'épargne pour les locataires et de locatif pour les petits bailleurs. Il est neutre entre locataires et propriétaires. Il ne pousse pas l'épargne vers la pierre et n'alimente pas la hausse des loyers. Le régime propre à la RP rapporte plus et favorise l'accession, ce que veut l'auteur ; il crée en revanche un avantage du propriétaire sur le locataire à patrimoine égal (300 000 € d'épargne : 496 €/an contre 0 pour le propriétaire). Cet avantage se capitalise dans les prix là où l'offre est rigide (§ 6.2). Pour garder un abattement unique avec plus de recette, il faut le ramener à 500 000 € et une courbe plus raide (K = 100 000 €) : +11,2 Md€.
6. **Recommandation de Claude** : le régime propre à la RP (choix de l'auteur), avec plafond à 1 M€, τRP = 0,25 %, t∞ = 3 %, K = 400 000 € et les deux options. **Repli prudent** si l'on veut limiter l'exil et le différé : t∞ = 2,5 %, K = 300 000 €. Ce repli donne +3,2 Md€ seulement, mais 19,7 Md€ de différé et 48 % d'érosion au lieu de 26,0 et 59 %. Dans les deux cas, **le reste du manque doit venir de la fonction des revenus ou d'économies**.

## 1. Ce que l'auteur demande, et ce que j'ai vérifié

- **Demande de l'auteur (06/11/2026)** :
  - fonction de 0 % à 3 % (ou un autre plafond) ;
  - résidence principale jusqu'à ≈ 1 M€ à un taux simple, neutre par rapport à la taxe foncière ; au-delà, la part excédentaire entre dans la fonction ;
  - locatif, résidences secondaires et tout le reste dans la fonction ;
  - holdings transparentes (châteaux, terres, forêts) ;
  - forêt sortie de l'impôt cadastral ;
  - prélèvement en avance sur les entreprises valorisées.
- **Compléments du 06/11 (après-midi)** : la résidence principale a un sens humain et familial, ce n'est pas un placement. L'auteur demande de comparer avec un abattement unique par ménage, et de chiffrer les effets de bord (loyers, prix et accession, offre locative, entretien).
- **Friction (a) des positions, vérifiée** [fait, A] : l'IFI s'applique au-delà de **1 300 000 €** d'actifs immobiliers nets (CGI, art. 964), avec un **abattement de 30 %** sur la résidence principale (art. 973, I) et un barème de 0,5 % à 1,5 % à partir de 800 000 € (art. 977). L'IFI n'exonère donc pas la résidence principale jusqu'à 1 M€. Copie codes.droit.org du CGI (à jour du 31/10/2026), lue localement le 06/11/2026.
- **Friction (b), confirmée** : la v7.4 B fait payer 1 800 €/an pour une RP de 300 000 €, contre 765 € de taxe foncière (cas type, § 5). La v7.5 ramène ce cas à 765 €.

## 2. La formule proposée

**Fait (droit actuel, CGI lu localement)** : la taxe foncière de la résidence principale comporte déjà trois protections :
- une exonération pour les plus de 75 ans sous plafond de revenus (art. 1390 et 1391) ;
- un dégrèvement de 100 € entre 65 et 75 ans (art. 1391 B) ;
- un **plafonnement à 50 % des revenus** pour les ménages sous le plafond de l'art. 1417 qui ne paient pas l'IFI (art. 1391 B ter).

| élément | proposition v7.5 (variante recommandée) | ce qu'il remplace |
|---|---|---|
| (1) Résidence principale | **τRP × min(valeur brute de la RP, X)**, avec τRP = **0,25 %** et X = **1 M€ par ménage** (un seul logement, comme l'abattement de l'IFI). Exonérations et plafonnement de la taxe foncière actuelle repris (art. 1390, 1391, 1391 B, 1391 B ter). **Bouclier de transition** : l'occupant actuel ne paie jamais plus que sa taxe foncière de 2028, indexée, tant qu'il garde le bien. | taxe foncière des ménages sur leur RP |
| (2) Fonction du patrimoine | **P(Wf) = t∞ × Wf² / (Wf + K)**, avec t∞ = **3 %** et K = **400 000 €**. Wf = part de la RP au-delà de X + locatif + résidences secondaires + parts, titres, biens professionnels − dettes. Les dettes de la RP s'imputent d'abord sur sa part sous X : elles n'abritent pas le reste. Épargne réglementée exonérée dans la limite des plafonds (livret A 22 950 € et LDDS 12 000 € par personne : Code monétaire et financier, art. R221-2 et D221-103 [fait, A]). | taxe foncière du locatif et des résidences secondaires, **taxe d'habitation des résidences secondaires (C09)**, droits de mutation à titre onéreux, IFI |
| (3) Impôt plancher | P' = max(0, P − C_k), où C_k est la contribution déjà payée sur les revenus du capital (v7.4). **Option plancherPro (H75.8)** : on impute aussi la part de l'impôt sur le revenu d'activité tirée du capital exploité (terres, vignes, forêt, société où l'on travaille). | — |
| (4) Paiement | Payé dans l'année : min(P', max(x(N) × N − part RP, 2 % × A, **P' × A / Wf**)). Le dernier terme (option payeProrata) fait payer toujours, en titres au besoin, la part afférente aux actifs mobilisables. Le reste est différé : créance garantie sur le bien, intérêts au taux de l'État, exigible à la vente ou à la succession (v7.4). | — |
| Holdings | Transparence : les actifs sont comptés à leur valeur sous-jacente. **Valeur de rendement réservée** aux terres agricoles exploitées, aux forêts sous document de gestion durable et à l'outil de travail réellement exploité par le foyer ; tout le reste détenu en société (château, maison, terres d'agrément) à la **valeur vénale**. Parts de holdings passives : mobilisables (payées). | — |
| Logements vacants | Une taxe incitative est gardée (recommandation de C09, « calibrer plutôt qu'interdire »). | — |

Taux de la fonction [calcul] :

| base Wf | 100 k€ | 300 k€ | 500 k€ | 1 M€ | 2 M€ | 5 M€ | 10 M€ | 100 M€ |
|---|---|---|---|---|---|---|---|---|
| taux moyen | 0,60 % | 1,29 % | 1,67 % | 2,14 % | 2,50 % | 2,78 % | 2,88 % | 2,99 % |
| taux marginal | 1,08 % | 2,02 % | 2,41 % | 2,76 % | 2,92 % | 2,98 % | 3,00 % | 3,00 % |

Ces taux portent sur le patrimoine **hors résidence principale sous 1 M€**. La v7.4 B appliquait 0,25 % à 1,99 % au patrimoine **RP comprise**. La courbe est plus raide parce qu'elle porte sur une base plus étroite.

### 2.1 Le taux de la résidence principale (H75.1)
- **Aux sources** [calcul, A] : taxe foncière des ménages 26,202 Md€ (Insee, comptes nationaux 2024, tableau 3.217, via `modeles/grand-livre/recettes.csv`) ÷ immobilier des ménages 9 696 Md€ (Insee Première n° 2081, nov. 2025, figure 2 : logements 4 807, autres bâtiments 233, terrains bâtis 4 043, autres non produits 613) = **0,270 %**. Le numérateur contient le foncier non bâti et les locaux des entrepreneurs individuels ; le dénominateur contient les terres. Ce n'est pas un rapport « RP seule » (⚠️ V16900).
- **Dans la population du modèle** [calcul] : le taux qui reproduit 26,202 Md€ sur l'immobilier brut reconstitué (HVP × 1,4) vaut **0,255 %**. C'est le taux neutre par construction pour les comparaisons par tranche : je propose **0,25 %**.
- **Source sans ventilation** [fait, A] : le compte du logement 2024 (SDES, rapport du 20/11/2025, figure 6.1, lu le 06/11/2026) donne **30,49 Md€ de taxe foncière bâtie sur les logements**, tous propriétaires confondus (bailleurs sociaux compris), sans la séparer entre propriétaires occupants et bailleurs. Il donne aussi 186,1 Md€ de loyers imputés des résidences principales et 29,3 Md€ des résidences secondaires. Je n'ai trouvé aucune source qui donne la taxe foncière des seules résidences principales (V16900).

### 2.2 Éviter l'arbitrage de domiciliation
- **Le risque** : déclarer « résidence principale » le bien le plus cher, ou deux résidences dans un couple. Ce régime réintroduit un seuil, et donc un arbitrage, ce qui est la friction (c) des positions.
- **Les règles proposées** :
  - **un seul logement par foyer fiscal**, comme pour l'abattement de l'IFI (art. 973) ;
  - définition fiscale actuelle de la RP (occupation effective et habituelle, la plus longue de l'année) ;
  - **recoupement automatique** : adresse de l'avis d'impôt, de la CAF, de l'employeur, consommations d'énergie (les compteurs communicants donnent l'occupation), scolarisation des enfants ;
  - **charge de la preuve** sur le contribuable s'il déclare RP un bien qui n'est pas à son adresse fiscale ;
  - **rappel sur trois ans** au taux de la fonction, avec intérêts, en cas de fausse déclaration ;
  - la RP d'un non-résident n'existe pas : il est imposé sur ses immeubles en France dans la fonction (v7.4).
- **Ce qui limite l'enjeu** : l'avantage maximal est plafonné. La RP ne sort de la fonction que pour 1 M€ au plus.

## 3. Contrainte dure : aucun ménage modeste ne paie plus

### 3.1 Par tranche de patrimoine net
Population de l'étude par tranche (HVP 2023-2024 × 1,4, 30,9 M de ménages, loi jointe revenu × patrimoine). Valeurs **statiques** (avant comportements), en € par ménage et par an. L'**ancien stock** comprend la taxe foncière, les droits de mutation annualisés (0,167 % de l'immobilier brut), l'IFI et la taxe d'habitation des résidences secondaires (3,153 Md€, au prorata de l'immobilier hors RP). Les revenus du capital sont calculés comme dans l'étude (HQ1 à HQ12). Les droits de succession et de donation sont identiques dans les deux systèmes ; ils entrent dans les deux totaux sans changer l'écart. Variante recommandée :

| tranche | ménages | patrimoine net moyen | ancien stock | v7.4 B (dû) | **nouveau stock** (part RP + fonction) | dont différé | écart stock | ancien total, revenus du capital et DMTG compris | **nouveau total** | écart total (pt de patrimoine) |
|---|---|---|---|---|---|---|---|---|---|---|
| < 10 k€ | 3,85 M | 4 160 | 0 | 0 | 0 | 0 | 0 | 0 | 49 | +48 (+1,16) |
| 10-100 k€ | 7,10 M | 37 203 | 25 | 1 | 14 (14 + 0) | 0 | −10 | 30 | 547 | +516 (+1,39) |
| 100-200 k€ | 3,47 M | 146 582 | 404 | 153 | 233 (229 + 4) | 0 | −171 | 522 | 1 682 | +1 160 (+0,79) |
| 200-300 k€ | 3,64 M | 250 502 | 987 | 640 | 554 (543 + 12) | 0 | −433 | 1 339 | 2 358 | +1 020 (+0,41) |
| 300-500 k€ | 4,27 M | 389 490 | 1 526 | 1 505 | 869 (801 + 68) | 0 | −657 | 2 282 | 3 817 | +1 534 (+0,39) |
| 500-750 k€ | 3,27 M | 602 714 | 2 217 | 2 907 | 1 517 (1 052 + 466) | 2 | −699 | 4 380 | 7 305 | +2 925 (+0,49) |
| 750 k€-1 M€ | 1,96 M | 875 097 | 3 146 | 4 792 | 3 017 (1 342 + 1 674) | 59 | **−129** | 7 590 | 12 782 | +5 192 (+0,59) |
| 1-2 M€ | 2,32 M | 1 382 975 | 4 753 | 9 204 | 9 262 | 1 978 | +4 510 | 14 080 | 27 222 | +13 142 (+0,95) |
| 2-5 M€ | 0,83 M | 2 879 956 | 8 751 | 21 057 | 33 455 | 20 371 | +24 704 | 34 356 | 80 257 | +45 901 (+1,59) |
| 5-20 M€ | 173 000 | 8 138 814 | 20 796 | 57 027 | 127 761 | 98 655 | +106 965 | 100 140 | 272 175 | +172 034 (+2,11) |
| 20-100 M€ | ≈ 14 000 | 34 216 917 | 124 710 | 240 374 | 529 299 | 413 834 | +404 589 | 466 171 | 1 142 195 | +676 024 (+1,98) |
| > 100 M€ | ≈ 1 000 | 174 019 713 | 770 447 | 1 201 654 | 2 653 427 | 2 076 613 | +1 882 981 | 2 513 327 | 5 777 844 | +3 264 517 (+1,88) |
| **Ensemble** | 30,9 M | 474 098 | 1 593 | 2 623 | 3 171 | 1 482 | +1 578 | 4 288 | 9 072 | +4 783 (+1,01) |

**Lecture.**
- **Sur le stock**, toutes les tranches sous 1 M€ paient moins qu'aujourd'hui. La marge se resserre à 750 k€-1 M€ (−129 €). C'est cette tranche qui fixe K : à K = 350 000 €, elle paierait 3 265 € contre 3 146 €, et la contrainte serait violée.
- **Au-dessus de 1 M€**, le stock pèse 2 à 3,8 fois l'ancien.
- **Revenus du capital compris**, chaque tranche paie plus, parce que la fonction des revenus v7.2 taxe le capital comme le travail. C'est le constat de l'étude par tranche, inchangé ici. Il pèse jusqu'au bas de l'échelle : +516 €/an dans la tranche 10-100 k€, dont 322 € pour des livrets pleins (cas type), parce que la v7.2 taxe les intérêts de l'épargne réglementée (HQ12 ; V16806). **Pour que la promesse « les petits ne paient pas plus » vaille aussi pour les revenus de l'épargne, il faut exonérer de la fonction des revenus les intérêts de l'épargne réglementée, dans les plafonds** : je le recommande, coût non chiffré ici (V16806).
- **Limite** : les ménages de chaque cellule sont des moyennes (une part de RP et une part d'autres actifs selon la tranche). Locataires et propriétaires n'y sont pas séparés. D'où les cas types qui suivent.

### 3.2 Cas types (variante recommandée ; € par an)

| cas | ancien stock (TF + DMTO annualisés + TH RS) | v7.4 B | **nouveau** : part RP + fonction (différé) | écart stock |
|---|---|---|---|---|
| Retraité seul, pension 1 200 €/mois, maison 250 000 € | 1 056 (637 + 418) | 1 316 | 637 + 0 | **−418** |
| Retraité seul, 1 200 €/mois, maison 500 000 € | 2 111 | 4 167 | 1 275 + 0 | **−837** |
| Couple retraité 2 × 900 €/mois, maison 1,2 M€ | 5 067 | 15 158 | 2 549 + 2 000 (1 776 différés) | **−518** |
| Primo-accédant 2 × 2 200 €/mois, 400 000 € dont 380 000 € de crédit | 1 689 | 11 | 1 020 + 0 | **−669** ; et 23 200 € de droits de mutation évités à l'achat (≈ 5,8 %) |
| Locataire 2 000 €/mois, livret A et LDDS pleins | 0 | 0 | 0 | 0 |
| Propriétaire 3 700 €/mois, RP 300 000 € | 1 267 | 1 800 | 765 + 0 | **−502** |
| Petit bailleur 3 000 €/mois, RP 250 000 € + studio 150 000 € | 1 689 | 2 370 | 637 + 688 | **−364** |
| Ménage modeste 2 500 €/mois, RP 200 000 € + maison de famille 150 000 € (TH RS 996 €, moyenne SDES 3,723 Md€ / 3,737 M de résidences secondaires) | 2 474 | 2 333 | 510 + 1 227 | **−737** |
| *Locataire 3 700 €/mois, 300 000 € d'épargne* | 0 | 0 | 0 + 496 | **+496** |
| *Locataire 6 500 €/mois, 1 M€ d'épargne* | 0 | 600 | 0 + 5 861 | **+5 861** |
| *Propriétaire 6 500 €/mois, RP 1 M€* | 4 223 | 11 765 | 2 549 + 0 | **−1 673** |

**Deux constats.**
- **Aucun cas modeste ne paie plus.** Le bouclier de transition couvre en plus l'écart individuel entre la taxe foncière réelle d'un logement et 0,25 % de sa valeur (§ 5.3).
- **Le régime RP crée une asymétrie** : à 1 M€ de patrimoine, le locataire paie 5 861 € et le propriétaire de sa RP 2 549 €. C'est le prix de la préférence pour la propriété occupante. Avec l'abattement unique, le locataire ne paie rien et le propriétaire paie seulement sa part RP (2 549 €) : l'écart restant correspond à la taxe foncière que paie déjà tout propriétaire (§ 4).

## 4. Recette par variante, et ce qu'elle comble

### 4.1 Grille demandée (K = 700 000 €, comme la v7.4 B ; plancher ; Md€/an ; Δ = recette − 54,52)
Chaîne de calcul :
- **part RP** : statique × 0,96 × 0,99 (valorisation, gestion ; H75.3) ;
- **fonction** : dû statique (population de l'étude, plancher, règle de paiement) × le rapport « recette nette / dû statique » de la chaîne de la v7.4 au même t∞ (0,683 à 2 % ; 0,621 à 2,5 % ; 0,567 à 3 %). Ce rapport intègre l'effet sur les prix, l'érosion ménage par ménage, l'exil, la gestion et les pertes sur le différé (H75.3, ⚠️ V16902).

| régime | X | t∞ | part RP | fonction (statique) | différé | total | Δ v7.4 | comble 18,7 / 29,1 | contrainte |
|---|---|---|---|---|---|---|---|---|---|
| RP | 500 k€ | 2 % | 15,6 | 27,0 (39,6) | 9,2 | 42,7 | −11,9 | — | oui |
| RP | 500 k€ | 2,5 % | 15,6 | 37,1 (59,7) | 17,9 | 52,7 | −1,8 | — | oui |
| RP | 500 k€ | 3 % | 15,6 | 45,3 (79,9) | 25,8 | 60,9 | +6,4 | 34 % / 22 % | oui |
| RP | 750 k€ | 2 % | 17,0 | 21,5 | 7,7 | 38,5 | −16,0 | — | oui |
| RP | 750 k€ | 2,5 % | 17,0 | 30,6 | 15,2 | 47,6 | −6,9 | — | oui |
| RP | 750 k€ | 3 % | 17,0 | 38,2 | 22,1 | 55,2 | +0,7 | 4 % / 2 % | oui |
| RP | 1 M€ | 2 % | 17,3 | 20,5 | 7,0 | 37,8 | −16,7 | — | oui |
| RP | 1 M€ | 2,5 % | 17,3 | 29,5 | 14,3 | 46,8 | −7,7 | — | oui |
| RP | 1 M€ | 3 % | 17,3 | 37,0 | 21,1 | 54,3 | −0,2 | — | oui |
| AB | 500 k€ | 2 / 2,5 / 3 % | 15,6 | 17,6 / 25,8 / 32,6 | 5,0 / 11,8 / 18,2 | 33,2 / 41,4 / 48,2 | −21,3 / −13,1 / −6,3 | — | oui |
| AB | 750 k€ | 2 / 2,5 / 3 % | 17,0 | 12,0 / 18,4 / 23,9 | 3,5 / 9,1 / 14,3 | 29,0 / 35,5 / 41,0 | −25,5 / −19,0 / −13,5 | — | oui |
| AB | 1 M€ | 2 / 2,5 / 3 % | 17,3 | 9,1 / 14,5 / 19,1 | 2,6 / 7,2 / 11,7 | 26,4 / 31,8 / 36,4 | −28,1 / −22,7 / −18,1 | — | oui |

**Pourquoi la recette baisse quand on sort la RP** [calcul] :
- la v7.4 B tirait une grande part de ses 54,5 Md€ de la résidence principale, à 0,6 % à 300 000 € et 1,18 % à 1 M€ ;
- la v7.5 la ramène au niveau de la taxe foncière : la part RP rapporte 17,3 Md€ ;
- avec K = 700 000 €, la contrainte dure n'est pas du tout serrée : on laisse de la marge sur la table.

### 4.2 En resserrant la courbe jusqu'à la limite de la contrainte (K minimal, tranches ≤ 1 M€)

| régime | X | t∞ | K minimal | total | Δ v7.4 | différé | encaissé dans l'année |
|---|---|---|---|---|---|---|---|
| RP | 500 k€ | 2 / 2,5 / 3 % | 250 / 400 / 600 k€ | 55,1 / 61,0 / 63,6 | +0,6 / +6,5 / +9,1 | 14,8 / 22,6 / 27,5 | 40,3 / 38,4 / 36,1 |
| RP | 750 k€ | 2 / 2,5 / 3 % | 200 / 300 / 400 k€ | 51,7 / 58,6 / 63,5 | −2,8 / +4,1 / +9,0 | 12,7 / 20,7 / 27,1 | 39,1 / 37,9 / 36,5 |
| **RP** | **1 M€** | 2 / **2,5** / **3 %** | 200 / **300** / **400 k€** | 50,9 / **57,7** / **62,5** | −3,6 / **+3,2** / **+8,0** | 11,8 / 19,7 / 26,0 | 39,1 / 38,0 / 36,6 |
| AB | 500 k€ | 2 / 2,5 / 3 % | ≤ 100 k€ (bord de la grille) | 46,7 / 57,2 / **65,7** | −7,9 / +2,6 / **+11,2** | 10,9 / 20,7 / 29,9 | 35,8 / 36,4 / 35,8 |
| AB | 750 k€ | 3 % | ≤ 100 k€ | 52,6 | −1,9 | 21,8 | 30,8 |
| AB | 1 M€ | 3 % | ≤ 100 k€ | 43,8 | −10,7 | 16,9 | 26,9 |

**Lecture.**
- Sous la contrainte dure et à 3 % au plus, la meilleure recette est **+11,2 Md€** (abattement unique de 500 000 €), soit 60 % du manque de référence. Avec le régime RP, c'est **+8,0 à +9,1 Md€**.
- **Le plafond de la RP à 1 M€ coûte peu par rapport à 500 000 €** (62,5 contre 63,6) : le choix de l'auteur est presque gratuit en recette.
- **Partout, l'encaissé de l'année est inférieur à celui de la v7.4 B** (42,1), parce que la base taxée est faite de biens peu liquides chez des ménages aux revenus moyens (HQ11 : le modèle donne aux hauts patrimoines les revenus d'activité de leur quartile ; il surestime donc probablement le différé, ⚠️ V16903).

### 4.3 Variante recommandée : bilan (Md€/an)

| poste | montant |
|---|---|
| Part RP, nette | 17,3 (bouclier de transition l'année 1 : −3,4) |
| Fonction, nette (dû statique 79,8 × 0,567) | 45,2 |
| dont différé (recouvré à la vente ou à la succession) | 26,0 (57 %) |
| **Total** | **62,5** ; année 1 : 59,1 ; encaissé dans l'année 36,6 |
| Remplacés (rappel) | TF des ménages 26,2 ; DMTO 17,2 ; IFI 2,7 ; TH des résidences secondaires 3,15 (C09) |
| Δ par rapport à la v7.4 B dans le bilan (G05 = 54,52) | **+8,0** |
| Manque à financer | 18,7 en macro de référence (comblé à 43 %) ; 29,1 avec les décisions en attente, C09 comprise (comblé à 27 %) |

Pour mémoire : avec le réglage de la v7.4 B (2 %, K = 700 000 €) et la RP sortie, la recette tombe à 37,8 (−16,7). **Sortir la résidence principale sans raidir la courbe creuserait le trou de 17 Md€.**

L'effet en dette n'est pas recalculé : `bilan_global.py` n'est pas modifié. Si l'auteur adopte, la ligne G05 passe de 54,52 à 62,5 et C09 devient sans objet, puisque la TH des résidences secondaires est fondue ; les effets ne s'additionnent pas exactement (corrections-bilan.md).

## 5. Cas limites de la v7.4 : charge cumulée en % du revenu

Charge = fonction des revenus + part RP + fonction **payée**, en % du revenu reçu ; « due » ajoute le différé. Variante recommandée, € par an.

| cas | P | déduit (plancher) | payé | différé | charge payée | charge due | v7.4 B payée |
|---|---|---|---|---|---|---|---|
| RP 300 k€ à Grenoble, 2 × 2 000 €/mois | 0 (part RP 765) | 0 | 0 | 0 | 21 % | 21 % | 23 % |
| RP 1 M€, 2 × 3 500 €/mois | 0 (part RP 2 549) | 0 | 0 | 0 | 39 % | 39 % | 50 % |
| 5 M€ d'actions à 3 %, sans autre revenu | 138 889 | 66 950 | 71 939 | 0 | 93 % | 93 % | 58 % |
| Holding passive de 20 M€ qui ne distribue pas | 588 235 | 0 | 588 235 (en titres) | 0 | n.d. (aucun revenu) | n.d. | n.d. |
| Rentier 2 M€, 5 000 €/mois de dividendes | 50 000 | 19 045 | 30 955 | 0 | 83 % | 83 % | 49 % |
| Retraité 1 200 €/mois, maison 500 k€ | 0 (part RP 1 275) | 0 | 0 | 0 | transfert net | | |
| Couple 2 × 900 €/mois, maison 1,2 M€ | 2 000 | 0 | 1 119 | 881 | transfert net | | |
| Héritier sans revenu, appartement 2 M€ | 21 429 | 0 | 0 | 21 429 | 0 % | 0 % | 0 % |
| Agriculteur (valeur de rendement 750 k€) | 14 674 | 6 673 | 2 217 | 5 784 | 32 % | 51 % | 32 % |
| Viticulteur (valeur de rendement 2,4 M€) | 61 714 | 49 389 | 7 884 | 4 441 | 61 % | 66 % | 61 % |
| Chef d'entreprise (société 9,4 M€ de valeur de rendement, distribue 100 k€) | 269 741 | 89 350 | 19 145 | 161 246 | 65 % | **159 %** | 65 % |
| Start-up à la valeur substantielle (1 M€) | 21 429 | 15 594 | 4 234 | 1 600 | 48 % | 51 % | 48 % |
| Indivisaire non occupant | 3 857 | 0 | 3 214 | 643 | 48 % | 49 % | 48 % |
| Villa au Portugal + RP Lyon | 16 000 | 0 (IMI imputé à part : 2 400) | 5 318 | 8 282 | 56 % | 68 % | 56 % |
| 3 M€ en cryptoactifs, salaire 5 000 €/mois | 79 412 | 0 | 79 412 | 0 | **176 %** | 176 % | 125 % |
| Collectionneur, 5 M€ d'œuvres + RP 2 M€ | 168 750 | 0 | 16 983 | 151 767 | 69 % | **153 %** | 69 % |
| Forêt gérée (valeur de rendement 125 k€) | 893 | 3 478 | 0 | 0 | 37 % | 37 % | 38 % |
| Non-résident, appartement 1 M€ loué | 21 429 | 6 673 | 14 755 | 0 | 71 % | 71 % | 39 % |
| Parent seul avec 10 M€ (avant donation) | 288 462 | 134 950 | 120 000 | 33 512 | 98 % | **111 %** | 72 % |
| Chacun de ses trois enfants après donation | 89 286 | 42 170 | 40 000 | 7 116 | 81 % | 87 % | 59 % |
| **Château de 3 M€ en holding patrimoniale**, exploitation déficitaire, salaire 3 000 €/mois | 79 412 | 0 | 79 412 | 0 | **253 %** | 253 % | 38 % |
| **Fondateur, 30 M€ au dernier tour, prélèvement en avance payé en titres** | 888 158 | 0 | 888 158 (2,96 % des parts) | 0 | (en titres) | | |

**Au-delà de 100 % (à signaler)** :
- **Payé**, sur des actifs mobilisables qui ne rapportent rien (cryptoactifs, château en holding, fondateur payé en titres). C'est voulu : l'auteur juge inacceptable qu'un château ou une forêt détenus en holding ne versent aucun revenu imposable. Ces actifs paient en vendant ou en cédant des titres ; le château paie 2,6 %/an de sa valeur.
- **Dû seulement (différé)**, pour le chef d'entreprise, le collectionneur et le parent à 10 M€ : la créance grossit et se règle à la transmission.

**Le plancherPro est nécessaire.** Sans lui, la charge due du viticulteur atteint **117 %**, celle de l'agriculteur 73 % et celle du chef d'entreprise 189 %. La raison : à 3 %, un bien valorisé à son rendement capitalisé à 4 % paie déjà 75 % de son revenu en taxe sur le stock, avant l'impôt sur le revenu.

**Ce qui reste fragile (V16913)** : la valeur de rendement attribue au capital tout le revenu de l'exploitant. Il faut en retirer la rémunération du travail (piste V15307 de la v7.4).

**Par rapport à la v7.4 B**, les rentiers paient nettement plus (93 % et 83 % contre 58 % et 49 %) : c'est l'effet de 3 % au lieu de 2 % sur le patrimoine qui rapporte.

### 5.3 Bouclier de transition (H75.4, H75.5)
- **Le problème** [fait] : la taxe foncière est assise sur des valeurs locatives de 1970. Rapportée à la valeur, elle varie fortement : 2 650 € pour 300 000 € à Grenoble (0,88 %), d'après le cas type déjà dans le modèle (`decisions_0611_v74.js`, `grenobleTF`), contre beaucoup moins dans les grandes villes chères. Un taux national de 0,25 % de la valeur ferait donc payer plus certains occupants, là où la taxe foncière actuelle est faible par rapport aux prix.
- **Le chiffrage** [estimation] : si le rapport taxe foncière / valeur suit une loi log-normale d'écart-type 0,5 (aucune source lue, ⚠️ V16904), le bouclier coûte **19,7 % de la part RP l'année 1, soit 3,4 Md€** (11,9 % à σ = 0,3 ; 27,4 % à σ = 0,7). Il s'éteint à mesure que les logements changent de main : ≈ 5 %/an (⚠️ V16905), soit environ 40 % de l'écart résorbé en 10 ans.
- **L'effet inverse** : les occupants des communes à taxe foncière élevée (Grenoble) paient moins dès la première année.

## 6. Effets de bord : régime RP contre abattement unique

### 6.1 Loyers (incidence de la taxation du locatif)
**Calcul.** La hausse de charge annuelle sur un logement loué vaut (taux de charge nouveau − taxe foncière 0,27 % − droits de mutation annualisés 0,17 %) × valeur. Elle est répercutée pour une part ρ. La valeur vaut loyer × 12 / rendement brut. Logement de 60 m². Loyers et rendements bruts sont ceux de `sources/taxe-1pc-fiabilisation.md` : Paris 24,2 €/m², rendement 3,0 % ; Grenoble 10,8 €/m², 5,2 % (observatoires locaux des loyers et DVF). Pour la ville moyenne, je prends le loyer médian des communes, 10,00 €/m² (carte des loyers DHUP 2025), et un rendement de 5 %, qui est une hypothèse (⚠️ V16912).

Taux de charge nouveau :
- **petit bailleur** (cas type) : 0,46 % de la valeur du studio. Le plancher déduit presque tout, puisque le loyer est déjà taxé dans la fonction des revenus ;
- **bailleur aisé** (base de 2 M€) : marginal 2,92 % − plancher ≈ 65 % × 2 % de loyer net = 1,62 %.

| zone (loyer, valeur) | petit bailleur ρ = 0,15 / 0,5 / 1 | bailleur aisé ρ = 0,15 / 0,5 / 1 |
|---|---|---|
| Paris (1 452 €/mois ; 580 800 €) | +2 / +5 / +10 €/mois | **+86 / +285 / +571 €/mois** (+5,9 / +19,7 / +39,3 %) |
| Grenoble (648 €/mois ; 149 538 €) | +0 / +1 / +3 | +22 / +73 / +147 (+3,4 / +11,3 / +22,7 %) |
| Ville moyenne (600 €/mois ; 144 000 €) | +0 / +1 / +3 | +21 / +71 / +141 (+3,5 / +11,8 / +23,6 %) |

**Ce que dit la recherche** [⚠️ V16909, reprend V14814] :
- **théorie** : une taxe foncière se capitalise surtout dans les prix quand l'offre est rigide ; le bailleur la supporte alors sous forme de moins-value (Oates, 1969) ;
- **Carroll et Yinger (1994, Boston)** : environ 15 % répercutés sur les locataires à court terme ;
- **Löffler et Siegloch** (« Welfare Effects of Property Taxation », ZEW DP 21-026, CESifo 8952) : en Allemagne, la répercussion sur les loyers est forte à moyen terme et **plus faible quand l'offre est rigide**. Un résumé secondaire militant donne 83 % sans que j'aie pu le vérifier dans l'article. En Allemagne, la taxe foncière est refacturable dans les charges.
- **D'où la fourchette ρ = 0,15 à 1.** Milieu raisonnable : 0,5 à moyen terme (estimation).

**Lecture.** La hausse ne vient que des bailleurs aisés, qui détiennent une part importante du parc loué. Leur part exacte n'a pas été lue (V16909). À Paris, dans le haut de la fourchette, la hausse serait considérable. Deux leviers la limitent :
- l'encadrement des loyers instrumenté déjà proposé (positions du 03/11) ;
- l'**interdiction de refacturer** la part foncière dans les charges.

**Abattement unique** : le petit bailleur ne paie plus rien (0 contre 688 €/an), et le bailleur aisé paie un peu moins (la base est réduite de X). **Moins de pression sur les loyers.**

### 6.2 Prix et accession des primo-accédants
- **La fin des droits de mutation** [fait + calcul] : ≈ 5,8 % du prix (`impots_inventaire.csv`, ligne 121), soit 23 200 € pour 400 000 €, payés une fois. La recherche (`sources/recherche-fiscalite-immobiliere.md` § 3.1) établit qu'une taxe sur les transactions réduit ventes et mobilité (Toronto : −15 % de ventes ; Dachis, Duranton et Turner, 2012). La part qui revient au vendeur, par une hausse de prix, est débattue. Pour l'accédant, c'est un gain net à l'achat ; une partie peut se capitaliser dans les prix.
- **L'avantage du régime RP** [calcul + estimation] : pour un acheteur qui aurait sinon placé la même somme, l'avantage annuel vaut (fonction évitée − part RP) / valeur :
  - **1,03 %** pour une RP de 300 000 € sans autre patrimoine ;
  - **2,36 %** pour 500 000 € avec 500 000 € d'autres actifs ;
  - **2,60 %** pour 1 M€ avec 1 M€ d'autres actifs.

  Capitalisé (Δprix ≈ κ × a / (r + τ), r = 2 %, τ = 0,27 %), cela donnerait **+11 à +34 %** pour le premier profil et **+26 à +86 %** pour les autres si tout le marché avait ce profil (κ de 0,25 à 0,75). C'est une **borne haute** : seuls les acheteurs déjà dotés d'autres actifs en profitent. Mais c'est exactement le segment de 500 000 € à 1 M€ des zones tendues. **Effet de bord probable** : le régime RP pousse les ménages aisés à mettre plus de patrimoine dans leur résidence principale, jusqu'au plafond, et soutient les prix de ce segment.
- **Ce que dit la recherche** [⚠️ V16910] :
  - **Hilber et Turner (2014, *Review of Economics and Statistics*, 96(4), p. 618-637)**, résumé lu : la déduction des intérêts d'emprunt américaine n'augmente la propriété que chez les ménages aisés des marchés peu régulés ; dans les marchés à offre contrainte, elle se capitalise dans les prix et **réduit** l'accès à la propriété. C'est la mise en garde la plus directe contre un avantage fiscal à la RP en zone tendue.
  - Sommer et Sullivan (2018, *American Economic Review*) : supprimer cette déduction baisserait les prix et augmenterait la propriété (de mémoire, non relu).
  - France : Fack (2006, *Labour Economics*), 50 à 80 % des aides personnelles au logement absorbées par les loyers ; Bono et Trannoy, capitalisation du dispositif Scellier dans le prix des terrains (de mémoire, non relus).
- **Abattement unique** : aucun avantage de statut, donc rien à capitaliser au profit de la pierre. L'épargne n'est pas poussée vers l'immobilier.

### 6.3 Offre locative
- **Sans réaction**, la charge des bailleurs aisés augmente d'environ 1,2 point de la valeur par an (1,62 % contre 0,44 %), sur 2 412 Md€ de locatif hors RP dans la population (étude).
- **Où vont les logements vendus** [raisonnement, non chiffré] :
  - **à des occupants** (primo-accédants, aidés par la fin des droits de mutation) : le taux de propriétaires monte, le parc locatif baisse d'autant, et la demande locative aussi ;
  - **à d'autres bailleurs moins dotés**, pour qui la fonction est faible : l'offre ne change pas, la propriété se déconcentre ;
  - **à des personnes morales** (institutionnels, bailleurs sociaux) : en transparence, une société détenue par des ménages est taxée comme eux ; un investisseur institutionnel ne l'est pas, ce qui crée un avantage à vérifier (V16916).
- **Risque à court terme** : mise en vente simultanée de logements loués, baisse des prix dans les zones à fort taux de bailleurs aisés (Paris), et tension temporaire sur l'offre locative si les acheteurs sont des occupants qui libèrent d'autres logements moins vite.
- **Taux de propriétaires** [fait, A] : 47,0 % des logements ordinaires sont occupés par leur propriétaire en 2024, soit 17,998 M de résidences principales sur 31,592 M ; locataires du secteur libre 7,880 M (SDES 2024, figure 2.1). L'ampleur des ventes n'est pas estimable sans élasticité de détention, que je n'ai pas lue.
- **Abattement unique** : l'effet est moindre, parce que les petits bailleurs ne paient plus et que les grands paient un peu moins.

### 6.4 Entretien : propriétaires occupants contre bailleurs (état de la recherche) [⚠️ V16911]
- **Établi (théorie, consensus ancien)** : l'« externalité locative ». Le locataire n'a pas intérêt à entretenir un bien qui ne lui appartient pas, et le bailleur contrôle mal l'usage (Henderson et Ioannides, 1983, *American Economic Review*, de mémoire). Les études empiriques des années 1990 trouvent une dépréciation plus rapide des logements loués que des logements occupés par leur propriétaire (Shilling, Sirmans et Dombrow, 1991, *Journal of Housing Economics* ; Gatzlaff, Green et Ling, 1998, *Land Economics*, « Cross-Tenure Differences in Home Maintenance and Appreciation »). Références identifiées, articles non lus ; ordres de grandeur non repris.
- **Débattu** : Harding, Miceli et Sirmans (2000, *Real Estate Economics*, 28(4), p. 663-681, « Do Owners Take Better Care of Their Housing Than Renters? ») montrent que des externalités propres aux propriétaires peuvent aussi conduire à **sous-entretenir**. Exemples : le propriétaire âgé ou contraint en liquidité, celui qui compte vendre. La supériorité du propriétaire n'est donc pas automatique. Résumé lu, résultats chiffrés non lus.
- **Manque** : je n'ai lu aucune mesure française. La rénovation énergétique, avec MaPrimeRénov' et les obligations du DPE pour les logements loués, joue désormais dans l'autre sens : le bailleur est contraint, le propriétaire occupant ne l'est pas.
- **Conséquence pour le manifeste** : l'argument « le propriétaire entretient mieux » a un fondement théorique et empirique ancien, à nuancer. Il justifie une préférence modérée pour la propriété occupante, pas un avantage illimité. D'où l'intérêt du **plafond** et de la protection des copropriétés (entretien des parties communes).

### 6.5 Synthèse des quatre effets

| effet | régime propre à la RP (X = 1 M€) | abattement unique (X = 1 M€) |
|---|---|---|
| Loyers | hausse possible chez les bailleurs aisés (Paris : +86 à +571 €/mois selon ρ) ; nulle chez les petits bailleurs | plus faible (petits bailleurs exonérés, grands un peu moins taxés) |
| Prix et accession | fin des droits de mutation (+) ; avantage RP capitalisable dans le segment 500 k€-1 M€ des zones tendues (−, Hilber et Turner) | fin des droits de mutation (+) ; pas d'avantage de statut |
| Offre locative | ventes de bailleurs aisés : propriété plus répandue, offre locative réduite à court terme | ventes moindres |
| Entretien | favorise la propriété occupante (argument modéré) | neutre |
| Recette | **62,5 Md€** (+8,0) | 39,3 Md€ (−15,2) au même réglage ; +11,2 au mieux avec X = 500 k€ |
| Équité locataire / propriétaire | asymétrie (locataire à 1 M€ : 5 861 € contre 2 549 € pour le propriétaire) | égalité |

## 7. Forêts

### 7.1 L'imposition actuelle [fait, A ; CGI, copie codes.droit.org lue le 06/11/2026]
- **Impôt sur le revenu (art. 76, 1)** : le bénéfice agricole des coupes de bois est **forfaitairement égal au revenu cadastral** servant de base à la taxe foncière, quelles que soient les coupes de l'année. On paie chaque année sur un revenu théorique, et la coupe elle-même n'est pas imposée en plus : c'est un impôt payé en prévision de la coupe. Après plantation ou régénération, pendant 10 ans (peupleraies), 30 ans (résineux) ou 50 ans (feuillus), la base est réduite (art. 76, 3).
- **Taxe foncière sur le non bâti** : exonération des terrains plantés ou régénérés pendant les mêmes durées (art. 1395, 1° et 1° bis).
- **Droits de succession et de donation** : exonération des **trois quarts** de la valeur des bois et forêts sous engagement de gestion durable pendant 30 ans (« Monichon », art. 793, 2, 2°) ; idem pour les parts de groupements forestiers (art. 793, 1, 3°).
- **IFI** : bois et forêts exonérés aux **trois quarts** sous les mêmes conditions (art. 976, I et II).
- Le dispositif DEFI forêt (réduction d'impôt) n'a pas été relu (V16914).

**Effets de bord du régime actuel** :
- un impôt dû même sans coupe et sans revenu (problème de trésorerie), sur des valeurs cadastrales anciennes ;
- les très gros revenus de coupe ne sont pas imposés au réel : avantage pour les grandes forêts productives ;
- la forêt sert d'abri de transmission, pour les trois quarts de sa valeur, dans des structures qui ne versent rien.

### 7.2 Ce que la fonction unique change
- **Le stock** : la forêt gérée entre dans la fonction à sa **valeur de rendement** (revenu net moyen ÷ 4 %, plafonnée à la valeur vénale). Cette valeur ne dépend pas du volume de bois sur pied. Un propriétaire ne gagne donc rien à couper tôt pour faire baisser la base ; c'est l'inverse d'une taxe à la valeur vénale, qui inclut le bois sur pied et pousse à couper.
  - Exemple [calcul] : 100 ha, revenu 5 000 €/an, valeur vénale 500 000 €. Valeur de rendement 125 000 €. Fonction due au titre de la forêt : 893 €/an sans autre patrimoine (18 % du revenu forestier, avant plancher), 3 469 € avec 1 M€ d'autres actifs (69 %). À la valeur vénale, ce serait 8 333 et 14 098 €.
- **Le revenu** : les coupes sont taxées **au réel**, quand elles ont lieu, dans la fonction des revenus, avec le **lissage des gros gains** (barème v7, § 6), pour qu'une coupe trentenaire ne soit pas imposée au taux marginal maximal. L'impôt plancher déduit ensuite cette contribution de la fonction du patrimoine. Dans le cas type de la v7.4, la déduction (3 478 €) dépasse le dû (893 €) et la forêt ne paie rien de plus.
- **Ce qui disparaît** : le forfait cadastral (art. 76) et la taxe foncière non bâtie des forêts, remplacés par cette valeur de rendement et l'imposition au réel des coupes. Les exonérations des trois quarts (IFI, Monichon) disparaissent aussi pour les forêts détenues en holding ou sans gestion ; elles sont remplacées par la valeur de rendement, réservée aux forêts sous document de gestion durable.
- **La tension à dire (V16914)** : une « valeur de rendement » calculée sur un revenu moyen ressemble à un revenu cadastral si elle est normative (barème par essence et par région). Pour ne pas recréer un impôt cadastral, je propose :
  - la moyenne des revenus réels déclarés sur 10 à 20 ans, et non un barème ;
  - avec un plancher normatif seulement pour les forêts sans aucune coupe déclarée (pour qu'une forêt non exploitée ne soit pas valorisée à zéro) ;
  - plafonnée à la valeur vénale.

  La pratique suisse (valeur de rendement agricole, LDFR art. 10) est citée par la v7.4 sans avoir été relue (⚠️ V15304).
- **Forêts en holding** : transparence. Une forêt gérée détenue en société garde la valeur de rendement ; un domaine boisé d'agrément (chasse, résidence) est pris à la valeur vénale ; les parts d'une holding passive sont mobilisables et donc payées.

## 8. Prélèvement en avance sur une entreprise valorisée
- **La v7.4** comptait les jeunes entreprises à leur valeur substantielle jusqu'à la première liquidité : 1 M€ dans le cas type, 21 429 €/an dus à 3 %, presque tout différé.
- **Avec la demande de l'auteur**, on compte les parts à la valeur du dernier tour dès qu'un investisseur l'a fixée : 30 M€, soit **888 158 €/an à 3 % (2,96 % des parts)**, 740 132 € à 2,5 % et 592 105 € à 2 %. Le paiement se fait **en titres** à un fonds public : c'est une dilution, sans trésorerie ni différé.
- **Ce que cela change au différé** : il disparaît pour ces actifs. L'État détient des titres au lieu d'une créance, et l'exposition au risque de l'entreprise passe à la collectivité.
- **Coûts** :
  - une dilution annuelle de ≈ 3 % chez le fondateur, cumulée sur 10 ans ≈ 26 % ;
  - un fort effet de localisation : les fondateurs peuvent incorporer ailleurs ;
  - l'évaluation est sujette à manipulation (tours à prix « gonflés », clauses de préférence) : il faut retenir la valeur des actions ordinaires, pas celle des actions de préférence du tour.
- **Recommandation** : appliquer l'option au-delà d'un seuil de valorisation (par exemple 10 M€) et seulement pour les sociétés où le foyer n'exerce pas, ou après une première liquidité partielle. Non chiffrée en masse (V16916).

## 9. Steelman et droit
- **Meilleure objection** : « Vous taxez à 3 % un patrimoine qui rapporte 2 à 4 %. Pour le locatif à Paris (2 % net), la taxe dépasse le revenu : c'est confiscatoire. Et vous comptez dans la recette 26 Md€/an que vous n'encaisserez qu'aux successions. »
- **Réponse** :
  - oui pour le locatif des bailleurs aisés : la charge due dépasse le revenu du bien, mais la règle de paiement plafonne ce qui est payé dans l'année au revenu du ménage, et le reste est différé et garanti ;
  - le Conseil constitutionnel contrôle le caractère confiscatoire de l'impôt en tenant compte des revenus : ce contrôle visait le plafonnement de l'ISF (décision n° 2012-662 DC, de mémoire ⚠️ V16916) ; voir `sources/cumul-prelevements-patrimoine.md` § 3 ;
  - c'est pourquoi le repli à 2,5 % existe ;
  - sur le différé, l'objection est juste : je la mets en tête (§ 0, point 4).
- **Droit de l'Union** : réserver le différé aux résidents peut heurter la libre circulation des capitaux (art. 63 du TFUE, V15309) ; la transparence des holdings étrangères suppose l'échange d'informations.
- **Égalité devant l'impôt** : le régime RP traite différemment locataires et propriétaires à patrimoine égal. Le juge l'admet si le motif d'intérêt général (accès à la propriété) est en rapport avec l'objet de la loi : c'est le cas de l'abattement de 30 % de l'IFI. Mais le plafond doit rester raisonnable.

## 10. État de la recherche (synthèse)
- **Établi** :
  - les taxes sur les transactions réduisent ventes et mobilité ;
  - les avantages fiscaux au logement se capitalisent dans les prix quand l'offre est rigide (Hilber et Turner 2014 ; Fack 2006 pour les aides personnelles) ;
  - une partie de la taxe foncière est répercutée sur les loyers à moyen terme, moins quand l'offre est rigide (Löffler et Siegloch).
- **Débattu** :
  - l'ampleur de la répercussion sur les loyers (15 % à quasi complète selon les pays et l'horizon) ;
  - l'avantage d'entretien des propriétaires occupants (Harding et al. 2000) ;
  - l'élasticité de la détention de patrimoine à un impôt de 2 à 3 % (érosion, exil : `sources/taxe-1pc-fiabilisation.md` § 2).
- **Manque** :
  - la taxe foncière des seules résidences principales ;
  - la dispersion du rapport taxe foncière / valeur ;
  - la part du parc loué détenue par les bailleurs aisés ;
  - des mesures françaises de l'entretien selon le statut d'occupation ;
  - l'incidence de la fin des droits de mutation sur les prix en France.

## 11. Hypothèses
- **H75.1** τRP = 0,25 % (0,255 % calé dans la population ; 0,270 % aux sources). V16900.
- **H75.2** Épargne réglementée exonérée : livret A et LDDS × 1,7 adulte ≈ 59 400 € par ménage. Sans effet sur la recette chiffrée (H75.6). Plafond du LEP non relu (V16908).
- **H75.3** Part RP nette = statique × 0,96 × 0,99. Fonction nette = dû statique × rapport de la chaîne v7.4 au même t∞, calculé à K = 700 000 € et sur l'assiette RP comprise, puis appliqué à une base hors RP plus mobile, donc probablement optimiste (V16902).
- **H75.4** Rapport taxe foncière / valeur log-normal, σ = 0,5 (V16904).
- **H75.5** Rotation des RP ≈ 5 %/an (V16905).
- **H75.6** Assiette chiffrée : immobilier + actions et fonds + biens professionnels, comme le bilan (assiette « pierreNet ») ; dépôts et assurance-vie hors recette, alors que le texte de la v7.4 les inclut (V16906).
- **H75.7** Les emprunts financent d'abord la RP (cellules de la population).
- **H75.8** Plancher professionnel : la part de l'impôt sur le revenu d'activité imputée vaut min(1, 4 % × valeur de rendement / revenu d'activité) (V16913).
- **Hypothèses de l'étude par tranche** (HQ1 à HQ12), reprises telles quelles, dont **HQ11** (revenus d'activité des hauts patrimoines au niveau de leur quartile) : elle surestime probablement le différé (V16903).

## 12. Vérifications ouvertes (registre `verifications.md`)
V16900 τRP ; V16901 part de la RP par tranche et dettes ; V16902 calage du comportement ; V16903 différé et revenus des hauts patrimoines ; V16904 dispersion de la taxe foncière ; V16905 rotation ; V16906 dépôts et assurance-vie hors assiette chiffrée ; V16907 TH des résidences secondaires (3,153 au grand livre contre 3,723 + 0,426 au SDES) ; V16908 plafond du LEP ; V16909 incidence sur les loyers et part des bailleurs aisés ; V16910 capitalisation ; V16911 entretien ; V16912 loyers et rendements par zone ; V16913 plancher professionnel et rémunération du travail ; V16914 forêts (valeur de rendement, DEFI forêt) ; V16915 friction (a) IFI : **résolue** (CGI 964, 973, 977) ; V16916 droit (confiscatoire, investisseurs institutionnels, prélèvement en avance) ; V16917 cohérence avec la v7.4 (dû statique 81,05 retrouvé ; chaîne 54,52 retrouvée).

## 13. Sources mobilisées

| source | ce qu'elle établit | cote | conflit d'intérêts |
|---|---|---|---|
| [Insee, comptes nationaux 2024, tableau 3.217](https://www.insee.fr/fr/statistiques/fichier/8988845/t_3217_fr.xlsx), via `modeles/grand-livre/recettes.csv` (consulté le 06/11/2026) | TF ménages 26,202 ; droits d'enregistrement 17,199 ; IFI 2,682 ; DMTG 20,819 | A | aucun connu |
| Insee, *Insee Première* n° 2081, nov. 2025, figure 2 (copie locale, `taxe_patrimoine.js`) | immobilier des ménages 9 696 Md€ ; patrimoine net 14 953 | A | aucun connu |
| Insee, *Focus* n° 371, enquête HVP 2023-2024 | distribution du patrimoine (population du modèle) | A | aucun connu |
| [SDES, Rapport du compte du logement 2024](https://www.statistiques.developpement-durable.gouv.fr/media/8828/download?inline), 20/11/2025 (copie `$DONNEES/sources/patrimoine/sdes_compte_logement_2024.pdf`, lue le 06/11/2026) | TF bâtie logements 30,49 Md€ ; TH RS 3,723 ; vacants 0,426 ; DMTO 11,2 ; loyers imputés RP 186,1, RS 29,3 ; parc : 17,998 M de propriétaires occupants sur 31,592 M de RP, 3,737 M de RS | A | service statistique ministériel |
| CGI, art. 76, 793, 964, 973, 976, 977, 1390, 1391, 1391 B, 1391 B ter, 1395 (copie [codes.droit.org](https://codes.droit.org/), à jour du 31/10/2026, lue localement le 06/11/2026 ; Légifrance renvoie 403) | droit actuel des forêts, de l'IFI et des protections de la taxe foncière | A | aucun |
| Code monétaire et financier, art. R221-2, D221-103 (même copie) | plafonds du livret A (22 950 €) et du LDDS (12 000 €) | A | aucun |
| `sources/patrimoine-qui-paie-plus.md` et `sources/calculs/patrimoine_qui_paie_plus.js` | population, ancien système, revenus du capital (HQ1 à HQ12) | B (modèle du dépôt) | coécrit par Claude (Anthropic) et l'auteur |
| `sources/bareme-deux-fonctions-v7.md` § 16, `decisions_0611_v74.js` | v7.4 B : règle de paiement, plancher, chaîne de recette, cas limites | B (modèle du dépôt) | idem |
| `modeles/grand-livre/corrections-bilan.md` | manque de 18,7 Md€ et de 29,1 Md€ ; C09 | B (modèle du dépôt) | idem |
| `sources/taxe-1pc-fiabilisation.md` (observatoires locaux des loyers, ANIL, DVF) | loyers et rendements bruts par zone | A/B | aucun connu |
| [Hilber et Turner, 2014, *Review of Economics and Statistics*](https://eprints.lse.ac.uk/49843/1/Hilber_Mortgage_interest_deduction_2013.pdf) (résumé lu) | capitalisation d'un avantage fiscal à la propriété ; effet négatif en zone régulée | A | aucun connu |
| [Löffler et Siegloch, *Welfare Effects of Property Taxation*, ZEW DP 21-026](https://econpapers.repec.org/RePEc:zbw:zewdip:21026) (fiche lue) | répercussion de la taxe foncière sur les loyers, moindre si l'offre est rigide | A (document de travail) | aucun connu |
| [Harding, Miceli et Sirmans, 2000, *Real Estate Economics*, 28(4)](https://econbiz.de/Record/do-owners-take-better-care-of-their-housing-than-renters-harding-john/10006904238) (notice lue) | externalités des propriétaires : sous-entretien possible | A | aucun connu |
| Carroll et Yinger (1994), Oates (1969), Dachis, Duranton et Turner (2012), via `bareme-deux-fonctions-v7.md` § 8 et `recherche-fiscalite-immobiliere.md` | incidence et droits de mutation | A (résumés secondaires) | aucun connu |
| Shilling, Sirmans et Dombrow (1991) ; Gatzlaff, Green et Ling (1998) ; Henderson et Ioannides (1983) ; Sommer et Sullivan (2018) ; Fack (2006) ; Bono et Trannoy | références identifiées, **non lues** (⚠️ V16910, V16911) | — | — |

**Ce que cela établit** :
- la contrainte « aucun ménage modeste ne paie plus sur son patrimoine » est tenable avec un régime propre à la RP ;
- elle laisse peu de place pour combler le manque par la seule fonction du patrimoine : +8 Md€ avec le régime RP à 1 M€, +11 au mieux ;
- entre régime RP et abattement unique, le choix porte sur une préférence politique (l'accession) payée par une asymétrie entre locataires et propriétaires et par un risque de capitalisation dans les prix des zones tendues, contre ≈ 20 Md€ de recette en plus.
