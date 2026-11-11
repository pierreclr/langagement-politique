---
titre: Impôt sur le patrimoine : balayage du taux marginal maximal (0,5 % à 2 %), recette nette, départs, score de la grille, recommandation
date: 2026-11-11
statut: brouillon chiffré ; code modeles/systeme-ideal/patrimoine_balayage_1111c.js (47 tests) ; résultats resultats_decisions_1111c.txt ; hypothèses HB1 à HB4 ⚠️ ; ne remplace PAS la fonction du patrimoine du système (paramètre préparé, à choisir par l'auteur)
---

# Quel taux marginal maximal pour un impôt non confiscatoire qui ne fait pas fuir les patrimoines ?

Écrit par Claude (IA d'Anthropic) pour l’auteur, le 11/11/2026. Cadre : `sources/impot-patrimoine-constitutionnel.md` (Conseil constitutionnel : 1,5 % avec plafonnement à 75 % du revenu validé en 2012, décision 2012-662 DC § 91 et 93). Fonction : v7.5 du système, `P(W) = t∞ · W² / (W + K)`, K = 700 000 € (variante C du dossier juridique), résidence principale à 0,25 % jusqu'à 1 M€, plafonnement à 75 % du revenu.

## 0. L'essentiel

1. **Recommandation : 1,25 % de taux marginal maximal** si l'on veut garder les départs au niveau de l'ancien ISF ou en dessous selon les deux méthodes ; **1,5 % est le plafond** (taux déjà validé par le Conseil, score de grille 3) et ne tient sous le niveau de l'ISF que si l'on croit la méthode « exil du modèle » (417 départs par an) contre la méthode « calée sur l'ISF » (2 100). Au-dessus de 1,5 %, le score de la grille tombe (J = 0) et la recette retenue baisse malgré une recette nominale plus haute.
2. **Aux taux bas, la fonction ne rapporte presque rien** : l'impôt plancher (déduction de ce que le ménage paie déjà sur ses revenus du capital) absorbe presque tout. À 1 % la fonction rapporte 0,6 Md€ de dû, à 1,25 % 5,3 Md€, à 1,5 % 13,1 Md€. En dessous de 1,2 %, il ne reste que la part « résidence principale » (17,3 Md€) qui **remplace** la taxe foncière : ce n'est pas une recette nouvelle.
3. **Recette nouvelle (nette, central, au-delà de la part RP) : ≈ 3,6 Md€ à 1,25 %, ≈ 8,4 Md€ à 1,5 %, ≈ 17,4 Md€ à 2 %.** C'est loin des 62,5 Md€ de la v7.5 à 3 % (K = 400 k€) : −42 Md€ (1,25 %) ou −37 Md€ (1,5 %) par rapport à elle, en nominal. La grille de faisabilité, elle, **retient davantage** (25,7 Md€ à 1,5 %) que pour la v7.5 à 3 % (21,9 Md€), parce qu'elle récompense la sécurité juridique.
4. **L'extrapolation linéaire du dossier juridique était optimiste** : il annonçait ≈ 32 Md€ pour la variante C (1,5 %) ; la simulation donne **25,7** au central [24,0 ; 27,8] (non-linéarité de l'impôt plancher, K = 700 k€).

## 1. Méthode (code en fonctions pures, aucun module existant modifié)

- Dû statique, population et plancher : `Decisions0611V75.recette` (régime RP, X = 1 M€, K = 700 k€, payeProrata, plancherPro).
- Comportement : chaîne de la v7.4 (érosion du capital mobile, exil, gestion, perte du différé), calée comme dans la v7.5 sur le rapport nette / statique **au même taux**, pour trois scénarios : favorable / central / défavorable = érosion du top 1 % de 20 / 40 / 74 % pour 1 % de taxe (`taxe_patrimoine.js`, CAE Focus 118 pour la part d'exil 20/74).
- **HB1 plafonnement à 75 % du revenu : non simulé par le modèle**, remplacé par −15 % de la fonction (bornes 5 % favorable, 30 % défavorable), hypothèse reprise du dossier juridique (⚠️ V-PAT5). Il ne touche pas la part RP.
- **Départs, méthode A (exil du modèle, HB2)** : capital parti = exil ÷ externalité (le modèle fait exil = 20/74 × capital érodé × 2,2 %) ; c'est un stock atteint en croisière, étalé sur 10 ans, à 3,5 M€ d'actif net par départ (DGFiP via France Stratégie 2023 : 3,5 M€ en 2021).
- **Départs, méthode B (calée sur l'ISF, HB3)** : 950 départs par an en 2011-2016 pour un produit d'environ 5 Md€ = 190 départs par Md€ de dû de la fonction (la fuite est proportionnelle au taux effectif). Le produit de l'ISF est de seconde main (⚠️ V-PAT2).
- Score M/J/E (règle de `modeles/banc-programmes/faisabilite.py`, lue sans la modifier) : M = 1 ; **J = 1 jusqu'à 1,5 %** (taux validé avec plafonnement), 0 au-delà (levable, sans précédent) ; **E = 1** (précédent suisse, 1,2 % du PIB). Parts médianes de la grille : score 3 = 100 %, score 2 = 70 %.

## 2. Résultats (Md€/an, croisière, euros 2024-2026 ; RP comprise ; plafonnement central)

| Taux max. | M/J/E | Dû de la fonction (statique) | **Nette : fav. / centrale / défav.** | Dont nouvelle (hors RP 17,3), central | **Retenue par la grille** (central) | **Départs par an : modèle (fav./centr./défav.)** | Départs par an : méthode ISF |
|---|---|---|---|---|---|---|---|
| 0,5 % | 1/1/1 | 0,1 | 17,4 / 17,4 / 17,3 | 0,1 | 17,4 | 0 / 1 / 1 | 17 |
| 0,75 % | 1/1/1 | 0,2 | 17,5 / 17,4 / 17,4 | 0,1 | 17,4 | 1 / 2 / 2 | 35 |
| 1,0 % | 1/1/1 | 0,6 | 17,8 / 17,7 / 17,6 | 0,4 | 17,7 | 5 / 7 / 9 | 104 |
| **1,25 %** | 1/1/1 | 5,3 | 21,6 / 20,9 / 20,1 | 3,6 | **20,9** | 85 / 127 / 85 | **853** |
| **1,5 %** | 1/1/1 | 13,1 | 27,8 / 25,7 / 24,0 | 8,4 | **25,7** | 252 / 417 / 248 | 2 121 |
| 2,0 % | 1/0/1 | 30,0 | 40,3 / 34,7 / 29,7 | 17,4 | 24,3 | 634 / 1 076 / 1 332 | 4 851 |
| *3,0 % (même réglage)* | 1/0/1 | 65,3 | 64,0 / 48,7 / 35,7 | 31,4 | 34,1 | 1 382 / 2 230 / 2 693 | 10 541 |
| *v7.5 recommandée (3 %, K = 400 k€, sans plafonnement)* | 1/0/0 | 79,8 | 62,5 | 45,2 | 21,9 (35 %) | 3 208 (modèle central) | 15 162 |

**Contribuables.** Le nombre de ménages visés ne dépend pas du taux mais de la définition : dans la population du modèle (HVP × 1,4, 30,9 M de ménages), **1,02 M de ménages ont un patrimoine net ≥ 2 M€ et 187 000 ≥ 5 M€** ; ceux dont le dû moyen de tranche dépasse 1 000 €/an sont ceux de ≥ 2 M€ dès 1,25 %, et ceux de 1 à 2 M€ à 2 %. À titre de comparaison, l'ISF avait **358 000 redevables en 2017** (130 000 pour l'IFI en 2018) : la population du modèle compte donc beaucoup plus de ménages riches que l'ISF n'en recensait (assiette plus large, valorisation des biens professionnels, recalage × 1,4) ; **le nombre de contribuables n'est pas comparable terme à terme**.

## 3. Départs : l'ancien ISF et les comparaisons

- **ISF** (DGFiP via France Stratégie 2023, `sources/exil-patrimoines-preuves.md`, cote A) : **950 départs par an en moyenne en 2011-2016** (pic 1 150 en 2014), 370 retours, soit 0,3 % des redevables par an et 0,5 % de la base ; actif net moyen d'un partant 3,5 M€ (2021). Sous l'IFI (2018-2021) : ≈ 260 départs et 380 retours par an. Départs de l'ordre de **mille par an** pour un impôt à 0,5-1,5 %.
- **Recommandation à 1,25 %** : 127 départs par an (modèle) à 853 (méthode ISF), soit **de 13 % à 90 % du niveau de l'ISF**. À 1,5 % : 417 à 2 121, soit **de 0,4 à 2,2 fois l'ISF** : la méthode ISF dépasse, celle du modèle non.
- **Elasticités** (Jakobsen, Kleven et al., NBER 32153 / *AER* 2026, cote A) : −2 % de riches par point d'impôt sur la fortune ; Brülhart et al. (*AEJ: Policy* 2022) : −1 point cantonal = au moins +43 % de patrimoine déclaré en 6 ans, dont 24 % par mobilité. Le dossier de l'érosion (`sources/erosion-capital-generations.md`) concerne la dilution sur des générations, pas les départs : il ne sert pas à ce calcul.
- **Suisse** (Administration fédérale des contributions, [calculateur fiscal 2026](https://swisstaxcalculator.estv.admin.ch/), cote A) : impôt cantonal sur la fortune de **0,64 % (Vaud), 0,45 % (Genève), 0,09 % (Zoug)** pour 1 M CHF, soit des taux effectifs bien sous 1 % ; la Suisse rapporte pourtant **≈ 1,2-1,3 % du PIB** (OCDE 2022, cote C) parce que la base est large et les exclusions rares. **À 1,5 % de taux marginal maximal, le taux moyen de la fonction vaut ≈ 0,9 % sur 1 M€ de patrimoine hors résidence principale et ≈ 1,3 % sur 5 M€** (`W²/(W+K)`, K = 700 k€) : de 1,4 fois (Vaud) à 10 fois (Zoug) le taux effectif cantonal pour 1 M€, donc plus lourd que la Suisse, mais sur une base qui exclut la résidence principale jusqu'à 1 M€. Les taux marginaux maximaux suisses ne sont pas relus à la source (⚠️ V-PAT3).
- **ISF** : taux marginal maximal 1,5 % (> 10 M€), barème de 0,5 % à 1,5 % dès 800 000 € avec seuil de 1,3 M€ : **1,5 % est exactement le niveau de l'ancien ISF**.

## 4. Ce qui est fragile (à ne pas gonfler)

1. **Deux méthodes de départs qui divergent d'un facteur 5.** Le modèle fait du départ une fraction (27 %) d'une érosion calibrée sur la Scandinavie (taux de 1 %) et étalée par hypothèse sur 10 ans ; la méthode ISF suppose la proportionnalité au dû, vraie à l'ordre de grandeur pour des taux voisins de l'ISF, douteuse au-delà (à 3 % elle donne 15 000 départs par an pour la v7.5). **La recommandation retient la plus pessimiste des deux** ; l'ordre de grandeur « de l'ISF » est le bon repère, pas le chiffre.
2. **Le plafonnement n'est pas simulé** (HB1 : −15 % [5 ; 30]).
3. **La recette « retenue » dépend d'un score qui est un jugement** : J = 1 jusqu'à 1,5 % est une lecture de la décision 2012-662 DC (le Conseil n'a validé que 1,5 % et 1,8 %, il ne dit pas que 1,6 % serait censuré) ; E = 1 repose sur la Suisse. Avec l'ISF seul (≈ 5 Md€) comme précédent, E vaudrait 0 et le retenu à 1,5 % chuterait de 25,7 à 18,0 Md€ (score 2).
4. **La part RP (17,3 Md€) remplace la taxe foncière** : la recette nette totale est un montant de remplacement, pas un gain. Le gain net est la colonne « nouvelle » : 3,6 Md€ (1,25 %), 8,4 (1,5 %).
5. **Population** : HVP × 1,4 compte 1,02 M de ménages ≥ 2 M€ contre 358 000 redevables ISF en 2017 : les nombres de contribuables ne se comparent pas ; les masses en Md€, oui davantage.
6. **Tout est en croisière**, sans montée en charge ni différé (le différé est inclus comme perte recouvrée à 95 % au central, pas comme décalage de trésorerie).
7. Le produit de l'ISF (5 Md€), les taux marginaux suisses et la recette norvégienne restent à lire à la source (⚠️ V-PAT2 à V-PAT4).

## 5. Branchement dans notre système (non appliqué)

`modeles/systeme-ideal/decisions_1111c.js` : l'option `tauxPatrimoine` de `Decisions1111C.s3` (ex. 0,0125) ajoute à la trajectoire l'**écart de recette nette central** entre ce taux et la v7.5 recommandée (62,5 Md€) : **−41,6 Md€ à 1,25 %, −36,8 Md€ à 1,5 %**. Comme les leviers F sont gardés fixes (décision du 11/11), le déficit 2032 passerait de 4,18 % à 5,69 % du PIB à 1,25 % ; **il faudrait donc compenser ≈ 37 à 42 Md€ ailleurs** (fonction des revenus, économies), ce qui est un arbitrage de l'auteur. Sans l'option, rien ne change. À choisir : un taux (1,25 % ou 1,5 %), puis recalibrer le coefficient a des revenus (non fait : il faudrait remplacer la fonction dans `retraites_aisees_0611.js`).

## Sources mobilisées

- Conseil constitutionnel, 2012-662 DC (A), via `sources/impot-patrimoine-constitutionnel.md` : 1,5 % et plafonnement à 75 % validés.
- DGFiP via France Stratégie, rapport 2023 (A), via `sources/exil-patrimoines-preuves.md` : départs ISF/IFI, actif moyen des partants ; Jakobsen et al. (A), Brülhart et al. (A), CAE Focus 118 (B, part d'exil 20/74).
- AFC, [calculateur fiscal suisse 2026](https://swisstaxcalculator.estv.admin.ch/) (A) ; OCDE 2022 via Tax Foundation (C, think tank libéral) pour 1,2 % du PIB.
- Modèles du dépôt : `modeles/systeme-ideal/decisions_0611_v75.js`, `decisions_0611_v74.js`, `taxe_patrimoine.js` ; règle de score : `modeles/banc-programmes/faisabilite.py` (lue, non modifiée).
