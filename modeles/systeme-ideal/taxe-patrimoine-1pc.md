---
titre: Taxe unique de 1 % sur le patrimoine (proposition de l'auteur) : chiffrage, effet sur le palier 1, qui paie
date: 2026-11-03
statut: brouillon, ordres de grandeur sous hypothèses
---

# Taxe unique de 1 % sur le patrimoine : chiffrage

Code : `taxe_patrimoine.js` (fonctions pures), `test_taxe_patrimoine.js` (66 contrôles), options `immobilier` et `taxePatrimoine` de `options_financement.js` (défaut inchangé, 78 contrôles), tableaux : `resultats-taxe-patrimoine.txt` (c'est lui qui fait foi), reproduction en bas de page. Hypothèses H500 à H522 ; points non confirmés : V7300 à V7313.

Transparence : ce texte est écrit par Claude, une IA d'Anthropic. La proposition est celle de l'auteur, et j'ai donc une raison de la trouver bonne. J'ai essayé de compenser : les fragilités passent avant les chiffres flatteurs.

## Résumé pour l'auteur (dix lignes)

1. **La taxe rapporte beaucoup : 93 Md€ nets par an au central** (75 / 93 / 109 selon les scénarios bas / central / haut), sans abattement, sur l'assiette proposée par l'auteur : immobilier, terres, actions et parts de fonds, en brut. Le calcul mécanique donne 118,5 Md€ ; la différence vient de la baisse des prix, de la fuite du capital mobile et du coût de gestion.
2. **La taxe foncière et l'IFI sont déjà supprimés dans le palier 1** (45,6 Md€ parmi les 885,9 Md€ supprimés). Les DMTO, eux, sont déjà retirés par la réforme immobilière. La recette ci-dessus est donc entièrement nouvelle, et les DMTO ne sont comptés qu'une fois (testé).
3. **86 % de la recette vient de l'immobilier.** Les actions et les entreprises pèsent peu (2 154 Md€ sur 11 850), et ce sont elles qui fuient. La taxe est donc d'abord une taxe foncière multipliée par environ 3,7.
4. **Effet sur le solde du palier 1 avec la réforme immobilière : de −177,5 à −84,1 Md€ au central** (−14,9 au bas, −184,5 au haut). Elle couvre à elle seule 53 % du trou. Avec un abattement de 100 000 € par ménage : −104,8 (41 %). Avec 300 000 € : −133,4 (25 %).
5. **Elle peut remplacer une partie de la hausse du taux plat, pas la totalité.** Avec la taxe, le patrimoine et les économies, il faut **40 % de taux plat avec un socle de 500 €** (contre 44,7 % sans la taxe), ou bien **un socle de 364 € à 35 %**, pour équilibrer au central. Le chemin 2 (41,5 %, 400 €) plus la taxe donne +60,6 au central.
6. **Au haut, rien n'équilibre toujours.** Le meilleur chemin finit à −87 Md€ (juste sous 3 % du PIB).
7. **Qui paie : la classe moyenne propriétaire paie beaucoup, pas seulement les riches.** De D5 à D9, c'est 1 100 à 5 300 €/an par ménage (48 % de la recette). Le top 10 % paie 51 %, et D1 à D4 moins de 1 %.
8. **Le point le plus dur est la liquidité.** Le retraité à 300 000 € de maison et 1 400 € de pension paie 3 000 €/an, soit 18 % de sa pension (environ 800 € de taxe foncière moyenne équivalente aujourd'hui). Le fondateur qui détient 10 M€ de parts paie 100 000 €/an pour 48 000 € de salaire. Il faut un paiement différé (une créance récupérée à la vente ou au décès), qui ne coûte presque rien en croisière (0,5 Md€) mais 9 Md€ par an les premières années.
9. **Le droit est un obstacle sérieux.** Le Conseil constitutionnel n'a accepté l'ISF à 1,5 % qu'avec un plafonnement à 75 % des revenus (2012-662 DC, cons. 91 et 93). Un 1 % sans plafond sur la résidence principale d'un ménage modeste est exposé.
10. **La taxe est volatile si l'indice est local.** Un krach de −20 % retire environ 17 Md€ par an : il faut une réserve d'environ 50 Md€ sur trois ans. Avec l'IPC, la recette reste stable, mais les remboursements à la vente sont plus grands. Recommandation : **assiette de référence nette de dettes, paiement différé avec plafonnement à un pourcentage du revenu, sans abattement**. Cela donne environ 78 Md€ au central et un solde de −99 Md€.

## 1. Ce qui est chiffré

Proposition de l'auteur (03/11/2026) :
- un impôt de 1 % par an de la valeur de tout capital : immobilier, résidence principale comprise, et parts de sociétés (holdings, sociétés valorisées par des investisseurs) ; les auto-entrepreneurs sans patrimoine dans leur société en sont exclus ;
- il remplace la taxe foncière et les DMTO ;
- la valeur annuelle est le prix d'achat indexé (indice local de prix au m², travaux déclarés ; un travail non déclaré est réputé fait au premier jour), puis elle est régularisée à la vente sur le prix réel ;
- il doit être « facilement applicable ».

**Articulation avec le modèle (H500)** :
- La **taxe foncière** (42,94 Md€ en 2024 : 26,20 payés par les ménages, 16,74 par les autres) et l'**IFI** (2,68) figurent dans la liste des prélèvements supprimés par le palier 1 (885,9 Md€ ; `sources/calculs/chapitre9_coeur_controle.py`, liste `SUPPR`, Insee tableau 3.217). Leur perte est donc déjà au solde de −163,3 : la taxe de 1 % ne doit pas la redéduire.
- Les **DMTO** (16,1 Md€ au central) sont supprimés par la réforme immobilière (`patrimoine_immobilier.js`, `bilan(...).soldeNet`, qui retire les DMTO et ajoute l'impôt de 50 % sur les plus-values réelles). Avec cette réforme en place (option `immobilier: true`, référence de cette note : −177,5 au central), la taxe ne redéduit pas les DMTO. Sans elle, la taxe les déduit elle-même (§ 5, ligne E). Un test vérifie que l'écart entre les deux montages vaut exactement le solde de plus-values de la réforme.
- **Qui perd ces recettes** (signalé, pas résolu) : la taxe foncière va aux communes et aux intercommunalités, déjà privées par le palier 1 ; les DMTO vont aux départements (12,5 Md€) et aux communes (3,3). Si la taxe de 1 % est nationale, il faut un mécanisme de reversement ; si elle est locale, son taux ne peut plus être uniforme.

## 2. Assiette (fait sourcé, puis choix motivé)

**Comptes de patrimoine 2024 des ménages** (y compris entrepreneurs individuels et institutions sans but lucratif ; Insee Première n° 2081, figure 2), en Md€ fin 2024 :

| poste | Md€ | dans la référence ? |
|---|---|---|
| logements | 4 807 | oui |
| terrains bâtis | 4 043 | oui |
| autres bâtiments et génie civil | 233 | oui |
| autres actifs non produits (terres agricoles surtout, selon le texte Insee ✅ V7301) | 613 | oui (remplace la taxe foncière non bâtie) |
| actions et autres participations hors OPC (cotées, non cotées, parts de SCI) | 1 745 | oui (« parts de sociétés ») |
| titres d'OPC | 409 | oui |
| assurance-vie / droits à pension | 1 856 / 234 | variante `pierreAV` |
| numéraire et dépôts (livrets compris) | 2 108 | variante `large` |
| machines, stocks, autres actifs produits (entrepreneurs individuels) | 270 | variante `large` |
| crédits (passif) | 1 768 | déduits dans les variantes nettes |
| **patrimoine net** | **14 953** | |

**Assiette de référence (« pierre ») = 11 850 Md€**, en brut. Elle traduit ce que l'auteur a dit : l'immobilier et les parts de sociétés, et pas l'épargne de précaution. Variantes : nette de crédits (10 082), avec assurance-vie (13 940), tout le patrimoine brut (16 385), tout le patrimoine net (13 702, hors « autres comptes à recevoir » et systèmes d'assurance non listés).

Choix et objections :
- **Brut ou net ?** L'auteur décrit un impôt sur le brut, comme la taxe foncière. Mais en brut, l'accédant qui vient d'acheter 300 000 € avec 270 000 € de crédit paie 3 000 €/an sur 30 000 € de fonds propres, soit 10 % par an de sa richesse nette. L'ISF et l'IFI déduisaient les dettes. **Recommandation : le net** (−15 Md€ au central). La référence reste le brut, parce que c'est la proposition.
- **Assurance-vie et livrets ?** Les exclure ouvre une niche : les unités de compte d'un contrat d'assurance-vie sont des actions. Les inclure taxe l'épargne de précaution (le livret du jeune locataire). La variante `pierreAV` ajoute 18 Md€ au central. C'est à trancher par l'auteur.
- **Sociétés.** La référence taxe les parts détenues par les ménages résidents, pas les actifs des sociétés. L'immobilier des sociétés (4 019 Md€ ; 40 Md€ à 1 %) n'est taxé qu'à travers la valeur des parts. Conséquence : les sociétés détenues par des **non-résidents** ne paient plus rien sur leurs bâtiments en France (la taxe foncière hors ménages, 16,7 Md€, est supprimée par le palier 1). Une variante qui taxerait aussi l'immobilier des sociétés, avec un crédit pour les associés résidents, n'est pas codée (risque de double compte, H502).
- **Non-résidents.** L'immobilier situé en France reste taxable quel que soit le propriétaire, comme pour l'IFI aujourd'hui. Les comptes nationaux rattachent ces biens à des unités résidentes fictives (⚠️ V7302), si bien que leur poids exact n'est pas isolé ici. Un résident qui part emporte ses parts, mais laisse ses murs : c'est pour cela que la fuite ne touche que le capital mobile.

## 3. Méthode et hypothèses

Recette nette = 1 % × [immobilier × valorisation × (1 + effet prix) + capital mobile × valorisation × (1 − érosion)] × (1 − part retirée par l'abattement) − autres impôts perdus sur le capital parti − coût de gestion − part non recouvrée du paiement différé − (DMTO si la réforme immobilière n'est pas en place).

| n° | hypothèse | bas / central / haut | source ou motif |
|---|---|---|---|
| H500 | Taxe foncière et IFI déjà supprimés par le palier 1 ; DMTO déduits une seule fois | | liste SUPPR du palier 1 ; `patrimoine_immobilier.js` |
| H501 | Assiette de référence : immobilier + terres + actions hors OPC + OPC des ménages, brut (11 850 Md€) | | Insee Première 2081 ; proposition de l'auteur |
| H502 | L'immobilier des sociétés n'est pas taxé directement (on taxe les parts) | | proposition de l'auteur ; variante non codée |
| H503 | Valorisation de l'immobilier (valeur administrative / valeur des comptes nationaux) | 0,92 / 0,96 / 1,00 | prix d'achat indexé sur un indice local, travaux non déclarés réputés faits au premier jour : un retard modeste ; la régularisation à la vente corrige en moyenne (dossier reventes § 5) |
| H504 | φ : part des actions dans le patrimoine financier, par dixième de patrimoine (de 3 % à 55 %) | | moyenne nationale (1 745 + 409) / 7 096 = 30 % ; profil croissant ⚠️ V7303 |
| H505 | L'abattement est calculé sur la distribution de l'enquête HVP non recalée (le patrimoine absent de l'enquête est supposé réparti comme le patrimoine observé) | | prudent : le patrimoine manquant est plus concentré en haut, donc l'abattement retire en réalité un peu moins |
| H506 | Part des actions cotées dans les actions hors OPC ; valorisation des non cotées | **15 / 15 / 15 %** (corrigé le 04/11/2026 : 14,9 % Banque de France T4 2025, V7304 ✅, V12400 ; avant 20 / 25 / 30 %) ; 0,65 / 0,80 / 0,90 |  les non cotées sont valorisées par l'administration sous les multiples des comptes nationaux |
| H507 | Capitalisation de la hausse d'impôt dans les prix : Δprix = −cap × (1 % − 0,27 %) / (rendement + 0,27 %) | cap 0,75 / 0,50 / 0,25 | modèle d'actualisation ; Brülhart et al. : environ 21 % de l'effet suisse passe par les prix du logement |
| H508 | Rendement locatif net (de charges et de taxe foncière) servant à l'actualisation | **1,7 / 2,0 / 2,7 %** (corrigé le 04/11/2026, V7305, V12420 ; avant 3,0 / 3,5 / 4,5 %, au-dessus du brut national mesuré ≈ 3,0 %) | ⚠️ part de charges hors taxe foncière sans source (V12533) |
| H509 | Part des actions et fonds des ménages détenue par le top 1 % | 50 % | Insee Focus 371 : le top 1 % détient 68 % du patrimoine professionnel et 25 % du financier ⚠️ V7303 |
| H510 | Érosion du capital mobile (départs, optimisation, sous-déclaration) pour 1 %, proportionnelle au taux : top 1 % / reste | 74 / 40 / 20 % ; 30 / 15 / 5 % | bas : 54 c d'optimisation et 20 c d'exil par euro de recette mécanique (Scandinavie, cité par le CAE, Focus 118 ⚠️ V7306) ; central : Jakobsen et al. (2020), élasticité de long terme au rendement net de 0,77 (aisés) et 1,15 (très riches), soit 14 % et 21 % pour un rendement de 6 %, auxquels s'ajoutent les départs ; haut : Seim (2017), élasticité au taux net de 0,09-0,27 |
| H511 | Érosion des autres actifs financiers (variantes avec assurance-vie ou dépôts) | 15 / 8 / 3 % | hypothèse de Claude : épargne de la classe moyenne, peu mobile |
| H512 | Part de l'érosion due aux départs | 27 % (20 / 74) | même source que H510 |
| H513 | Autres impôts perdus par euro de patrimoine parti : 3 % × 35 % (revenus du capital au taux plat) + 50 % × (1 − 31 %) / 30 ans (héritage) = 2,2 %/an | | paramètres du palier 1 ; horizon de 30 ans : hypothèse |
| H514 | Coût de gestion | 2 / 1 / 0,5 % de la recette | hypothèse ; l'immobilier s'appuie sur les DVF et le cadastre, les non cotées demandent une évaluation |
| H515 | Paiement différé : ménages sous la médiane de niveau de vie (21 % du patrimoine brut) ; taux de recours ; part recouvrée en croisière | 60 / 45 / 30 % ; 90 / 95 / 100 % | Insee Focus 371 (patrimoine par quartile de niveau de vie) ; créance indexée, garantie par hypothèque légale : la perte est la part irrécouvrable ⚠️ |
| H520 | Krach : prix −20 %, trois années | | même choc que `patrimoine_immobilier.js` (H260) |
| H521 | Durée de détention moyenne pour la régularisation | 10 ans | ⚠️ V7307 (non sourcée, déjà au dossier reventes) |
| H522 | Écart absolu moyen entre le prix de revente et la valeur indexée, indice local | 25 % | DVF Isère 2021-2025 : premier quartile −4 %, troisième quartile +26 % (dossier reventes § 4.2) |

**Distribution (qui paie, abattements).** L'enquête Histoire de vie et Patrimoine 2023-2024 (Insee Focus 371) fournit les seuils de patrimoine brut (D1 6 200 € … D9 857 700 €, P95 1 268 200 €, P99 3 020 900 €) et la composition par dixième (immobilier, financier, professionnel, emprunts). La population est découpée en 2 000 quantiles : interpolation linéaire jusqu'à P95, loi de Pareto au-delà (α = 1,85, calé sur P95 et P99). Contrôle : moyenne reconstituée 385 600 € (enquête : 374 900) ; part de la masse détenue par le top 1 / 5 / 10 / 25 / 50 % : 16 / 34 / 48 / 72 / 93 % (enquête : 15 / 34 / 48 / 72 / 93). L'enquête couvre environ 70 % du patrimoine des comptes nationaux (H505).

## 4. État de la recherche sur les impôts sur la fortune

- **Ce qui est établi** : la base déclarée réagit fortement, surtout en haut, et surtout par des canaux de déclaration et d'optimisation plutôt que par une baisse de l'épargne. Seim (2017, Suède) : élasticité au taux net de 0,09 à 0,27, dont un tiers vient de la sous-déclaration. Jakobsen, Jakobsen, Kleven et Zucman (2020, Danemark) : effets nettement plus forts pour les très riches (environ 30 % de patrimoine imposable en moins après 8 ans) que pour les aisés (environ 10 %). Brülhart, Gruber, Krapf et Schmidheiny (2022, Suisse) : une baisse d'un point du taux cantonal fait monter le patrimoine déclaré d'au moins 43 % après 6 ans, dont 24 % par mobilité entre cantons et 21 % par les prix du logement ; le reste ressemble à de l'évasion.
- **Exil** : Jakobsen, Kleven, Kolsrud, Landais et Muñoz (2024-2026, Scandinavie) mesurent −2 % de contribuables fortunés par point d'impôt sur la fortune, avec des effets agrégés modestes (valeur ajoutée −0,10 %). En France, de 2011 à 2016, environ 950 redevables de l'ISF sont partis chaque année et 370 sont revenus (France Stratégie 2021) : quelques centaines de départs pour plusieurs centaines de milliers de redevables.
- **Ce qui est débattu** : l'élasticité suisse (intranationale, sans barrière de langue) majore sans doute ce qui se passerait au niveau d'un pays. Le Danemark et la Suède avaient des niches et des seuils : un 1 % sans niche, prélevé surtout sur l'immobilier, est hors du champ observé.
- **Ce qui manque** : aucune étude ne porte sur un impôt annuel de 1 % appliqué à toute la propriété immobilière, résidence principale comprise, avec une régularisation à la vente. Le plus proche est la taxe foncière sur la valeur vénale (*property tax* américaine, environ 1 % de la valeur dans de nombreux États ⚠️ V7308), dont la littérature documente la capitalisation dans les prix et les plafonds votés par les électeurs (Proposition 13 en Californie, 1978 ⚠️ V7308).

## 5. Résultats (Md€/an de 2024, régime de croisière ; scénarios du module : bas = le moins favorable)

**Référence décomposée** : à partir du 1 % mécanique de 118,5, l'effet prix (−9,7 % au central) ramène la base immobilière à 8 374 Md€. L'érosion du capital mobile (27,5 %) ramène la base mobile à 1 372. La recette brute est de 97,5. On retire ensuite 3,1 d'autres impôts perdus sur le capital parti et 1,0 de gestion : **recette nette 93,4** (bas 75,1, haut 108,7).

**Par assiette et abattement** (bas / central / haut) :

| assiette | sans abattement | abattement 100 000 € | abattement 300 000 € | ménages exonérés (100 k / 300 k) |
|---|---|---|---|---|
| pierre (référence, brut) | 75,1 / 93,4 / 108,7 | 57,6 / 72,6 / 85,1 | 33,5 / 44,0 / 52,5 | 43 % / 70 % |
| pierreNet (net de crédits) | 61,9 / 78,2 / 91,8 | 44,6 / 57,7 / 68,4 | 24,5 / 33,4 / 40,6 | 48 % / 76 % |
| pierreAV (+ assurance-vie) | 90,7 / 111,4 / 128,5 | 73,4 / 90,6 / 104,7 | 48,0 / 60,1 / 69,9 | 41 % / 65 % |
| large (tout le brut) | 108,9 / 132,5 / 151,6 | 88,6 / 107,9 / 123,5 | 59,8 / 73,4 / 84,2 | 38 % / 62 % |
| largeNet (tout le net) | 88,7 / 109,5 / 126,0 | 70,1 / 86,6 / 99,6 | 46,1 / 57,4 / 66,3 | 41 % / 68 % |

Un abattement de 100 000 € retire 24 % de l'assiette immobilière et 9 % du capital mobile : il protège la classe moyenne propriétaire, pas les détenteurs d'actions.

**Paiement différé** (référence) : 9,1 Md€ sont reportés chaque année au central. En croisière, la perte se limite à 0,5 (la créance est récupérée à la vente ou à la succession), mais tant que les premiers recouvrements n'ont pas commencé, il manque 9,1 Md€ par an (environ 15 ans, l'horizon d'une succession).

**Sans la réforme immobilière** (la taxe remplace elle-même les DMTO) : 55,0 / 77,3 / 95,2.

**Volatilité.** Avec un indice local (la recommandation du dossier reventes), la valeur annuelle suit le marché : un krach de −20 % retire 16,7 Md€ par an au central (17 % de la recette brute), soit 50 Md€ sur trois ans. Il faut une réserve de lissage de cet ordre, ou un indice lissé sur plusieurs années. Avec un indice IPC, la recette annuelle ne baisse pas, mais chaque vente pendant le krach est remboursée : au plus 2,8 Md€ par année de krach (borne haute), et la régularisation garde en temps normal un biais positif de +3 à +9 % (dossier reventes § 4.1). En temps normal, avec l'indice local, la régularisation fait circuler environ 2,3 Md€ par an dans chaque sens, pour un solde net nul.

**Sensibilité** (recette centrale, un paramètre à la fois) : capitalisation 0,75 → 88,9, 0,25 → 97,8 ; valorisation de l'immobilier 92 % → 90,1, 100 % → 96,6 ; érosion du top 1 % 74 % → 88,3. **L'érosion du capital mobile change peu le total**, parce que ce capital pèse peu dans l'assiette. Le vrai risque n'est pas comptable, il est politique et juridique (§ 7).

## 6. Effet sur le solde du palier 1 et chemins (scénarios du palier 1 : bas = favorable ; la taxe reçoit le scénario croisé)

| chemin | solde bas / central / haut | taux plat d'équilibre (bas / central / haut) |
|---|---|---|
| Palier 1 | −119,8 / −163,3 / −235,7 | 43 % / 50,9 % / inaccessible |
| Palier 1 + réforme immobilière (référence) | −123,5 / −177,5 / −259,6 | 43,2 % / 52,9 % / inaccessible |
| + taxe de 1 %, sans abattement | −14,9 / **−84,1** / −184,5 | 36 % / **42,1 %** / inaccessible |
| + taxe, abattement 100 000 € | −38,4 / −104,8 / −202,0 | 37,5 % / 44,1 % / inaccessible |
| + taxe, abattement 300 000 € | −71,0 / −133,4 / −226,1 | 39,7 % / 47,2 % / inaccessible |
| + taxe nette de dettes | −31,8 / −99,2 / −197,7 | 37,1 % / 43,6 % / inaccessible |
| + taxe, paiement différé | −14,9 / −84,5 / −185,5 | 36 % / 42,2 % / inaccessible |
| T1 : taxe + patrimoine (150-0 B ter, décès, PFU 50 %) + économies volontaires + CIR supprimé, 35 %, 500 € | 34,0 / −59,1 / −174,6 | 32,8 % / 40 % / inaccessible |
| T2 : T1 avec abattement de 100 000 € et paiement différé | 10,4 / −80,2 / −192,9 | 34,3 % / 41,9 % / inaccessible |
| **T5 : T1 au taux plat de 40 %** | 107,5 / **+0,3** / −141,7 | |
| **T3 : chemin 2 (41,5 %, 400 €) + réforme immobilière + taxe** | 171,1 / **+60,6** / −87,4 | 30 % / 36,3 % / inaccessible |
| T4 : chemin 2 + réforme immobilière + taxe avec abattement de 100 000 € et différé | 147,5 / +39,5 / −105,8 | 31,6 % / 38 % / inaccessible |
| Contre-épreuve : chemin 2 + réforme immobilière, sans taxe | 62,4 / −32,8 / −162,6 | 37,2 % / 44,7 % / inaccessible |

Lecture :
- **La taxe ne remplace ni la hausse du taux plat ni la baisse du socle, mais elle en divise le besoin à peu près par deux.** Sans elle, équilibrer au central (chemin 2 + réforme immobilière) demande 44,7 % de taux plat avec un socle de 400 €. Avec elle, il faut 40 % avec un socle de 500 € (T5), ou 35 % avec un socle de 364 €.
- **Chemins qui équilibrent au central** : T5 (40 %, 500 €, taxe, patrimoine, économies) et T3 / T4 (chemin 2 + taxe, avec une marge de 40 à 60 Md€). **Au haut, aucun** : T3 finit à −87 Md€, à la limite de 3 % du PIB. Au haut, T1 garde le déficit actuel (−169,1) dès 35,7 % de taux plat.
- La taxe porte une **double fragilité** : la plus grosse ligne de recette nouvelle après l'héritage à 50 % (103,5 Md€) repose sur la même population, les propriétaires âgés. Si l'héritage à 50 % et la taxe à 1 % sont tous deux appliqués, un patrimoine immobilier de 300 000 € détenu 20 ans paie 60 000 € de taxe annuelle (sans actualisation) puis 50 % à la transmission.

## 7. Qui paie

**Par dixième de patrimoine brut** (assiette de référence, impôt moyen par ménage, valeurs de l'enquête, avant comportements) :

| tranche | patrimoine brut moyen | sans abattement (€/an) | part | abattement 100 000 € | part | abattement 300 000 € | part |
|---|---|---|---|---|---|---|---|
| D1 à D3 | 3 100 à 28 300 € | 0 à 15 | 0,1 % | 0 | 0 % | 0 | 0 % |
| D4 | 76 100 € | 247 | 0,8 % | 0 | 0 % | 0 | 0 % |
| D5 | 158 600 € | 1 121 | 3,7 % | 154 | 0,6 % | 0 | 0 % |
| D6 | 244 150 € | 1 892 | 6,3 % | 892 | 3,7 % | 0 | 0 % |
| D7 | 332 500 € | 2 610 | 8,7 % | 1 610 | 6,8 % | 0 | 0 % |
| D8 | 455 900 € | 3 563 | 11,8 % | 2 563 | 10,7 % | 563 | 3,7 % |
| D9 | 693 850 € | 5 343 | 17,8 % | 4 343 | 18,2 % | 2 343 | 15,4 % |
| P90-95 | 1,06 M€ | 8 583 | 14,3 % | 7 583 | 15,9 % | 5 583 | 18,4 % |
| P95-99 | 1,80 M€ | 14 773 | 19,6 % | 13 773 | 23,1 % | 11 773 | 31 % |
| top 1 % | 6,0 M€ | 50 881 | 16,9 % | 49 881 | 20,9 % | 47 881 | 31,5 % |

La taxe est **proportionnelle**, pas progressive : environ 0,8 % du patrimoine brut de D5 à P99. Elle est un peu plus lourde en haut parce que la part taxable y est plus grande. Le top 1 % paie 17 % de la recette alors qu'il détient 15 % du patrimoine brut. L'abattement la rend progressive à la base, pas au sommet.

**Cas types** (assiette de référence ; « TF équivalente » = taux moyen actuel de la taxe foncière des ménages, 0,27 % de la valeur, appliqué au bien : estimation, pas la taxe réelle) :

| cas | brut | part du revenu | abattement 100 000 € | net de dettes | TF équivalente aujourd'hui |
|---|---|---|---|---|---|
| Retraité, maison de 300 000 €, pension de 1 400 €/mois | 3 000 € | 17,9 % | 2 000 € (11,9 %) | 3 000 € | ≈ 810 € (×3,7) |
| Jeune locataire, livret de 15 000 €, 1 900 €/mois | 0 € | 0 % | 0 € | 0 € | 0 (150 € avec l'assiette large) |
| Cadre : appartement de 450 000 €, crédit restant de 250 000 €, PEA de 50 000 €, 5 000 €/mois | 5 000 € | 8,3 % | 4 000 € | 2 500 € | ≈ 1 220 € |
| Fondateur : 50 % d'une start-up valorisée 20 M€ (10 M€), salaire de 4 000 €/mois, pas de liquidités | 100 000 € | 208 % | 99 000 € | 100 000 € | 0 |

Le retraité et le fondateur sont les deux cas où la taxe **ne peut pas être payée sur le revenu**. Pour le fondateur, la valorisation du dernier tour surestime la valeur des actions ordinaires (les investisseurs ont des actions de préférence avec une priorité de remboursement ⚠️ V7309). Une taxe sur cette valeur, sans liquidité, pousse à vendre ou à s'expatrier : c'est exactement le profil des départs mesurés par le CAE (Focus 118).

## 8. Contraintes juridiques (steelman)

- **Article 13 de la Déclaration de 1789** : la contribution « doit être également répartie entre tous les citoyens, en raison de leurs facultés ». Le Conseil constitutionnel en tire l'exigence de ne pas faire peser une « charge excessive au regard des facultés contributives ».
- **Décision 2012-662 DC du 29/12/2012** (lue le 03/11/2026) : l'ISF n'a pas à porter sur les seuls biens productifs de revenus, ni à être payé avec leurs seuls revenus (cons. 90). Le taux marginal de 1,5 % au-delà de 10 M€ est admis parce qu'il est combiné à l'exclusion de nombreux biens (cons. 91) et à un **plafonnement à 75 % des revenus**, qui évite une « rupture caractérisée de l'égalité devant les charges publiques » (cons. 93). Sont censurés : l'intégration dans le plafonnement de sommes non perçues (cons. 94-95), et la taxation des biens d'une société non affectés à son activité sans preuve qu'ils sont à la disposition de l'associé (cons. 96). Des taux marginaux de 75 à 82 % sur certains revenus sont jugés excessifs (cons. 19, 81, 101).
- Conséquences pour la proposition : (1) un **plafonnement** en fonction du revenu, ou un paiement différé qui en tient lieu, est probablement nécessaire pour les ménages dont la taxe dépasse une part élevée du revenu ; (2) la taxation des **parts de sociétés** à leur valeur, y compris pour les actifs non affectés à l'activité, devra prouver la disposition effective (cons. 96) ; (3) le **cumul** taxe à 1 % + impôt de 50 % sur la plus-value + taux plat sur les loyers peut dépasser, pour un bien locatif, le seuil de la charge excessive. Avec un rendement brut de 3,5 %, la taxe absorbe 29 % du loyer brut avant le taux plat ⚠️ V7310 (calcul à affiner).
- **CEDH, Protocole 1, article 1** : la Cour reconnaît aux États une large marge en matière fiscale ; seule une charge individuelle excessive, qui porte atteinte à la substance du droit de propriété, viole l'article ⚠️ V7311 (jurisprudence non relue).
- **Valorisation et liquidité** : la valeur des titres non cotés est le point dur de tout impôt sur la fortune (rapport du comité d'évaluation, France Stratégie 2021). La régularisation à la vente de l'auteur corrige la valeur a posteriori, mais un titre non coté peut ne jamais être vendu (transmission, Dutreil). La régularisation devrait alors s'appliquer aussi au décès et à la donation, ce qui rejoint « décès = réalisation » (`deces_realisation.js`).
- **Taxe foncière actuelle** : elle aussi frappe sans plafond la valeur et non le revenu, mais elle prévoit des exonérations et des dégrèvements pour les personnes âgées ou modestes sous condition de revenu ⚠️ V7312 (CGI art. 1390, 1391, 1391 B ter, non relus). La taxe de 1 % pour tous proposée par l'auteur supprimerait ces protections, à moins de les recréer.

**Meilleure objection adverse** : « Un impôt de 1 % sur la valeur brute, résidence principale comprise, est un impôt sur un revenu qui n'existe pas. Pour un propriétaire occupant, il n'y a pas de loyer. Pour un fondateur, il n'y a pas de dividende. Il force le retraité à vendre sa maison et le fondateur à vendre sa société ou à partir, il rend la propriété précaire, et le Conseil constitutionnel n'a accepté l'ISF qu'avec un plafonnement. Ce n'est pas une simplification de la taxe foncière, c'est une taxe foncière multipliée par quatre. »

**Réponse** (ce qui tient et ce qui ne tient pas) :
- *Ce qui tient* : le loyer existe, mais il est implicite (le propriétaire occupant ne paie pas de loyer). C'est l'argument classique de la taxation du loyer imputé. L'égalité devant l'impôt entre propriétaire et locataire va dans le sens de l'auteur. La valeur est plus transparente que les valeurs locatives de 1970. La régularisation à la vente rend la taxe juste en moyenne.
- *Ce qui doit changer pour que la réponse tienne* : (a) un **paiement différé** de droit pour tout ménage dont la taxe dépasse X % du revenu, avec une créance indexée garantie sur le bien et récupérée à la vente ou à la succession (cela coûte environ 0,5 Md€ par an en croisière, mais 9 Md€ par an les quinze premières années) ; (b) **pour les titres non cotés sans liquidité**, un report jusqu'à l'événement de liquidité (vente, dividende, introduction en bourse), avec intérêt, plutôt qu'un paiement annuel en trésorerie ; (c) la **base nette de dettes**, pour ne pas taxer l'accédant sur la dette de sa banque.
- *Ce qui ne tient pas* : l'affirmation « 1 %, c'est pas grand-chose ». Pour un logement dont le rendement locatif net est de 3 à 3,5 %, 1 % de la valeur prend environ 30 % du revenu réel ou implicite du bien. Ce n'est pas peu.

## 9. Applicabilité (« facilement applicable »)

- **Immobilier : réaliste.** La DGFiP connaît chaque bien (cadastre, fichiers fonciers) et chaque prix de vente (DVF). La valeur indexée sur un indice local publié (DVF, ventes répétées) est calculable automatiquement pour les biens vendus depuis 2014 environ. Pour les biens détenus depuis plus longtemps, il faut une valeur d'entrée (estimation de masse, puis régularisation à la vente) ⚠️ V7313 (profondeur des fichiers DVF et des fichiers de la publicité foncière).
- **Actions cotées et fonds : simple** (déclaration des teneurs de compte, comme les relevés annuels IFU).
- **Non cotées : difficile.** Il faut une valeur par entreprise : la valeur du dernier tour pour les jeunes pousses, un multiple sectoriel ou une valeur comptable pour les PME. C'est là que se logent la sous-évaluation (H506) et le contentieux.
- **Le paiement différé** demande un registre des créances et une hypothèque légale : faisable (c'est le principe de la récupération de l'ASPA sur succession), mais ce n'est pas « facile ».

## 10. Limites

1. Régime de croisière statique : pas de transition. La baisse des prix (environ −10 %) est un choc unique sur le patrimoine des ménages (environ −940 Md€ de valeur immobilière au central), avec des effets sur les banques et sur les collatéraux, non modélisés.
2. Les érosions viennent d'impôts sur la fortune à seuil élevé ; leur application à un 1 % général est une extrapolation.
3. Les interactions avec les autres recettes du palier 1 sont limitées aux départs (H513). La baisse des loyers nets, la baisse de la plus-value taxée à 50 % liée à la baisse des prix, et la variation des droits sur les successions (une base plus basse à cause de la capitalisation) ne sont pas recalculées : elles réduiraient un peu la recette totale.
4. L'immobilier des sociétés et celui des non-résidents ne sont pas chiffrés séparément.
5. La distribution vient d'une enquête qui couvre environ 70 % du patrimoine des comptes nationaux ; l'abattement est estimé de façon prudente (H505).
6. Le paiement différé est simplifié : éligibilité par niveau de vie, pas de modèle de la vente ni de la succession.
7. Aucun chiffre n'est une prédiction ; ce sont des ordres de grandeur sous hypothèses.

## Sources (consultées le 03/11/2026)

- Insee, « Les comptes de patrimoine en 2024 », *Insee Première* n° 2081, novembre 2025, figure 2 : https://www.insee.fr/fr/statistiques/8661938 (PDF local : `$DONNEES/sources/t47-patrimoine/insee_ip2081.pdf`). Établit : le patrimoine des ménages par poste (14 953 Md€ nets), l'immobilier des sociétés.
- Insee, « Les montants de patrimoine détenus par les ménages en 2024 », *Insee Focus* n° 371, fichier IF371.xlsx (enquête Histoire de vie et Patrimoine 2023-2024) : https://www.insee.fr/fr/statistiques/8672665. Établit : les seuils de patrimoine brut, la composition par dixième, la part de la masse détenue par le haut de la distribution, le patrimoine par quartile de niveau de vie.
- Insee, comptes nationaux, tableau 3.217 (impôts et cotisations), lu par `sources/calculs/chapitre9_coeur_controle.py` : https://www.insee.fr/fr/statistiques/fichier/8988845/t_3217_fr.xlsx. Établit : taxe foncière 2024 de 42,94 Md€ (ménages 26,20), IFI 2,68, droits d'enregistrement 17,20.
- Conseil constitutionnel, décision n° 2012-662 DC du 29/12/2012, cons. 15, 19, 70, 81, 90-96, 101 : https://www.conseil-constitutionnel.fr/decision/2012/2012662DC.htm.
- Jakobsen, Jakobsen, Kleven, Zucman, « Wealth Taxation and Wealth Accumulation: Theory and Evidence from Denmark », *Quarterly Journal of Economics* 135(1), 2020, 329-388 : https://academic.oup.com/qje/article/135/1/329/5571832 ; version de travail : https://www.nber.org/papers/w24371 (chiffres relevés dans les résumés et la version de travail, citée par une recherche web : environ 30 % après 8 ans pour les très riches, 10 % pour les aisés ; élasticités de long terme de 0,77 et 1,15 ⚠️ V7306).
- Brülhart, Gruber, Krapf, Schmidheiny, « Behavioral Responses to Wealth Taxes: Evidence from Switzerland », *American Economic Journal: Economic Policy* 14(4), 2022 : https://www.aeaweb.org/articles?id=10.1257/pol.20200258 (résumé lu : au moins +43 % après 6 ans pour −1 point ; 24 % par mobilité, 21 % par les prix du logement).
- Seim, « Behavioral Responses to Wealth Taxes: Evidence from Sweden », *American Economic Journal: Economic Policy* 9(4), 2017, 395-421 : https://www.aeaweb.org/articles?id=10.1257/pol.20150290 (résumé : élasticité de 0,09 à 0,27, dont un tiers de sous-déclaration).
- Jakobsen, Kleven, Kolsrud, Landais, Muñoz, « Taxing Top Wealth: Migration Responses and their Aggregate Economic Implications », NBER WP 32153 : https://www.nber.org/papers/w32153 (repris de `modeles/reactions-assiettes/donnees/mobilite_hauts_revenus.csv`).
- CAE, Focus n° 118, « Fiscalité du capital : quels sont les effets de l'exil fiscal sur l'économie ? », juillet 2025 : https://cae-eco.fr/static/pdf/Focus_118_emigration_fiscale_250725_v2.pdf (54 c + 20 c, repris de la même base, ⚠️ V7306).
- France Stratégie, 3e rapport du comité d'évaluation des réformes de la fiscalité du capital, octobre 2021 : https://www.strategie-plan.gouv.fr/files/files/Publications/2021/1014%20Reforme%20de%20la%20fiscalit%C3%A9%20du%20capital/fs-2021-troisieme_rapport-fiscalite_du_capital-octobre.pdf (départs et retours de redevables de l'ISF, repris de `isf_exil_france.csv`).
- Zucman, rapport au G20, 25/06/2024 : https://gabriel-zucman.eu/files/report-g20.pdf (impôt minimal de 2 % au-delà d'un milliard de dollars ; comparaison : la taxe de l'auteur est générale et proportionnelle, celle de Zucman ne vise que les milliardaires).
- Dossier `sources/taxe-patrimoine-1pc-reventes-a-perte.md` (03/11/2026) : remboursements, choix de l'indice, dispersion individuelle (DVF Isère).
- Modèle : `patrimoine_immobilier.js` (DMTO, réforme immobilière, volume DVF 2024 de 185 Md€), `palier1.js`, `options_financement.js`.

Synthèse des sources : les comptes nationaux fixent l'assiette ; l'enquête HVP donne la répartition et donc qui paie ; les études scandinaves et suisse encadrent la fuite du capital mobile, qui pèse peu ici ; la décision du Conseil constitutionnel de 2012 fixe le cadre juridique (plafonnement, facultés contributives). Aucune source ne porte sur un impôt de ce type appliqué à la résidence principale : la capitalisation (H507) et l'acceptabilité restent les deux grandes inconnues.

## Reproduction

```
cd modeles/systeme-ideal
J=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
$J modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js test_taxe_patrimoine.js
$J modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js rapport_taxe_patrimoine.js > resultats-taxe-patrimoine.txt
```
