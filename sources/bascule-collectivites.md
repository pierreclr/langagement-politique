---
titre: La bascule neutre des collectivités (v5.9) : ce que chaque niveau perçoit aujourd'hui des impôts supprimés, la clé qui le remplace, les gagnants et les perdants, les contraintes
date: 2026-11-05
statut: décision de l'auteur (à adopter) chiffrée par Claude ; adoptée dans la v5.9 ; neutre sur le solde consolidé ; hypothèses H824 à H834 (`modeles/systeme-ideal/methode.md` § 44) ; vérifications V13805 à V13818
code: modeles/systeme-ideal/decisions_0511i.js (partie B, test_decisions_0511i.js) ; sources/calculs/bascule_collectivites.py (communes) ; données sources/donnees/communes_fiscalite_2024.csv
---

# La bascule neutre des collectivités

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 05/11/2026. **Décision de l'auteur** : chaque niveau de collectivité (communes et intercommunalités, départements, régions, autorités organisatrices de la mobilité) reçoit d'abord à peu près ce qu'il perçoit aujourd'hui des impôts que le système supprime, par une **clé simple et modulable** : une part du prélèvement unique, une part de la taxe de 1 % affectée aux communes à la place de la taxe foncière, et une péréquation. La clé pourra ensuite évoluer au gré des recentralisations et des décentralisations.

**Cotation des sources** (charte de document de travail de l'atelier, non publié) : A = source primaire lue et chiffre recoupé ; B = source primaire lue, périmètre ou méthode discutable ; C = estimation ou source secondaire ; D = opinion.

## 1. En une minute

- **Ce qui est à compenser : 130,1 Md€ par an** (2024) : taxe foncière 43,3 ; CFE 8,0 ; droits de mutation 14,1 ; fraction de TVA 52,5 ; versement mobilité 12,2.
- **La clé de 2029** (au taux de transition de 43 %) : le bloc communal reçoit **50,1 % du produit net de la taxe de 1 %** (soit 55,6 % de la taxe sur l'immobilier : « 0,56 point du 1 % ») **et 3,06 % du prélèvement unique** ; les départements **3,40 %** ; les régions **1,85 %** ; les autorités de la mobilité **1,36 %**. En tout, **9,67 % du prélèvement unique, soit 4,16 points des 43** (exprimée en points, la clé ne bouge pas quand le taux revient à 42 % en 2045 : c'est l'État qui absorbe la baisse).
- **Effet sur le solde public consolidé : zéro.** Le modèle compte déjà la suppression de ces impôts (lignes P06, P07 et N08 du bilan) et garde la TVA (P11) ; la bascule déplace des recettes entre l'État et les collectivités, à l'intérieur des administrations publiques. **Solde v5.9 = solde v5.8 = +12,20 Md€ en croisière 2060.** Aucune erreur d'imputation qui change le solde n'a été trouvée (section 5).
- **Entre communes, la clé « localisation » pure est intenable** : répartir la part de la taxe de 1 % selon la valeur des biens situés dans chaque commune donnerait **+6,8 Md€ à Paris** et ferait perdre 80 % des communes (Grenoble −798 € par habitant, Neuilly +5 550). D'où la recommandation : **une garantie individuelle intégrale en 2029** (chaque commune reçoit sa part historique), puis une **péréquation qui monte progressivement** vers un mélange « moitié localisation, moitié habitants ».
- **Contraintes** : la Constitution (art. 72-2) exige une « part déterminante » de ressources propres ; une part d'impôt national compte comme ressource propre **si la loi en détermine, par collectivité, une part locale d'assiette** (Conseil constitutionnel, 2004-500 DC ; 2019-796 DC pour la fraction de TVA des départements). La clé doit donc être territorialisée (part du prélèvement payé par les habitants du territoire ; part de la taxe sur les biens situés sur le territoire), pas une dotation. La Charte européenne de l'autonomie locale (art. 9 § 3) demande qu'une partie des ressources vienne d'impôts dont les collectivités fixent le taux : les impôts locaux **maintenus** (taxe d'habitation sur les résidences secondaires, TEOM, taxe d'aménagement, IFER, TASCOM, cartes grises : ≈ 44 Md€) le permettent.

## 2. État des ressources fiscales supprimées, par niveau (2024)

Source principale : DGCL, *Les collectivités locales en chiffres 2025*, chapitre 5, tableau 5.1 (2024), en M€[^dgcl] ; recoupée avec l'OFGL (base consolidée 2024 et REI 2024)[^ofgl] ; le versement mobilité total vient de l'Insee (comptes des administrations publiques 2024, repris dans le bilan, ligne P06)[^insee].

| Md€, 2024 | Bloc communal (communes, EPCI, syndicats) | Départements | Régions | Autorités de la mobilité | Total | Cote |
|---|---|---|---|---|---|---|
| Taxe foncière sur le bâti | 41,95 | — | — | — | 41,95 | A (DGCL ; REI : communes 39,11, EPCI 2,52 + GEMAPI 0,34, syndicats 0,17) |
| Taxe foncière sur le non-bâti | 1,31 | — | — | — | 1,31 | A |
| Cotisation foncière des entreprises (CFE) | 8,03 | — | — | — | 8,03 | A (REI 8,00 hors CCI) |
| Droits de mutation à titre onéreux | 4,08 (communes 3,80 ; EPCI 0,28) | 9,86 | 0,16 | — | 14,09 | B (OFGL donne 11,30 aux départements avant péréquation, Paris compris : périmètre différent, V13807) |
| Fraction de TVA (dont compensation de la CVAE et de la taxe d'habitation) | 15,39 (communes 1,42 ; EPCI 13,97) | 20,69 | 16,41 | — | 52,49 | A (OFGL identique pour les régions et les EPCI ; départements 22,83, écart 2,1 non expliqué, V13808) |
| Versement mobilité | — | — | — | 12,2 (dont EPCI 4,36 et syndicats 1,11 dans le champ DGCL ; 6,73 hors champ, essentiellement Île-de-France Mobilités) | 12,2 | B (le partage des 6,73 n'est pas lu, V13806) |
| **Total à compenser** | **70,76** | **30,55** | **16,57** | **12,2** | **130,08** | |

**Ce qui n'est pas dans la bascule, parce que le modèle ne le supprime pas** (impôts locaux maintenus, avec pouvoir de taux ; DGCL 2024) : taxe d'habitation sur les résidences secondaires 3,72 et sur les logements vacants 0,18 ; TEOM 8,99 ; IFER 1,89 ; TASCOM 1,04 ; GEMAPI et taxes spéciales d'équipement 0,62 ; taxe d'aménagement 1,36 ; accises affectées (TICPE 11,70 ; TSCA 9,73) ; TCFE 2,74 ; cartes grises 2,36. **À trancher par l'auteur** (V13809) : la taxe d'habitation sur les résidences secondaires recouvre en partie la taxe de 1 % (même bien taxé deux fois) ; la TEOM est une redevance déguisée qui pourrait devenir une vraie redevance.

**La CVAE** n'apparaît plus : sa part locale a été remplacée en 2023 par une fraction de TVA (incluse ci-dessus) ; le reliquat national, perçu par l'État, est dans la ligne P06 du modèle.

## 3. Les parts : combien de prélèvement unique et de taxe de 1 % pour être neutre en 2029

Le prélèvement unique vaut **897,8 Md€ à 43 %** (2029-2044) et **887,2 Md€ à 42 %** (central, croisière, recettes « courants » du modèle). La taxe de 1 % rapporte **86,4 Md€ nets**, dont **77,8 Md€ bruts sur l'immobilier** (base de 7 781 Md€ retenue par `taxe_patrimoine.js`).

| Niveau | Reçoit (Md€) | Part de la taxe de 1 % | Part du prélèvement unique à 43 % | en points des 43 | Part à 42 % (si la clé était fixée en pourcentage) |
|---|---|---|---|---|---|
| Bloc communal | 70,76 = 43,26 (taxe de 1 %) + 27,50 (prélèvement) | **50,1 % du produit net** (55,6 % de la part immobilière) | **3,06 %** | 1,32 | 3,10 % |
| Départements | 30,55 | — | **3,40 %** | 1,46 | 3,44 % |
| Régions | 16,57 | — | **1,85 %** | 0,79 | 1,87 % |
| Autorités de la mobilité | 12,20 | — | **1,36 %** | 0,58 | 1,38 % |
| **Total** | **130,08** | 43,26 | **9,67 %** (86,82 Md€) | **4,16** | 9,79 % |

**Recommandation de forme : exprimer la clé en points du taux, pas en pourcentage du produit** (bloc 1,32 point, départements 1,46, régions 0,79, AOM 0,58 ; sur l'assiette du prélèvement unique). Ainsi, la baisse de 43 à 42 % en 2045 reste à l'État, comme la marge de financement du creux des retraites qu'elle représente ; les collectivités suivent la croissance de l'assiette (salaires, revenus), comme avec la fraction de TVA aujourd'hui. À 42 %, les mêmes points rapportent 27,8 / 30,9 / 16,8 / 12,3 Md€ (≈ +1 %, effet des réactions de comportement plus faibles).

**La taxe de 1 % pour le bloc communal** : la part de 50,1 % est élevée. Elle signifie que **la moitié du produit de la taxe de 1 % remplace simplement la taxe foncière** : il faut le dire dans le manifeste, car le chiffre de 86,4 Md€ « de taxe sur le patrimoine » contient donc 43 Md€ qui existent déjà sous le nom de taxe foncière (le bilan le montre déjà : patrimoine brut 134,5, net 68,1). Variante plus lisible : affecter au bloc **toute la taxe sur l'immobilier situé sur son territoire au taux de 0,56 %**, l'État gardant 0,44 % et la taxe sur les parts de sociétés.

**Modulable** : un transfert de compétence de l'État vers un niveau se traduit par des points en plus (art. 72-2, al. 4 : ressources équivalentes) ; une recentralisation (par exemple l'allocation unique, qui reprend le RSA des départements) par des points en moins. **Point de vigilance** : la fusion du RSA dans l'allocation unique retire aux départements une dépense de ≈ 12 Md€ (RSA versé) que la clé ci-dessus ne retire pas : la neutralité « par niveau » ne vaut que **à compétences constantes** ; la recentralisation du RSA doit réduire la part des départements du même montant (V13810, à chiffrer avec le bilan des compétences, non fait ici).

## 4. Gagnants et perdants entre communes, et péréquation

Méthode (`sources/calculs/bascule_collectivites.py`, résultats dans `resultats-bascule-collectivites.txt`) : pour 34 863 communes (68,9 M d'habitants), la taxe foncière perçue en 2024 (bâti, coefficient correcteur, non-bâti : 40,8 Md€, hors EPCI) est comparée à ce que chaque commune recevrait de la même enveloppe selon deux clés. La valeur des biens de chaque commune est approchée par sa **base nette de taxe foncière × le prix moyen au m² des logements** (DVF 2024 ; prix manquant pour 5 077 communes : moyenne du département)[^prix]. **C'est une approximation forte** (⚠️ V13811) : elle suppose une valeur locative au m² uniforme et traite les locaux professionnels comme des logements ; elle surestime probablement les gains des communes chères aux valeurs locatives anciennes (Paris, Hauts-de-Seine).

**Clé « localisation » pure** (chaque commune reçoit la taxe sur les biens situés chez elle) :

| Communes | Population (M) | Taxe foncière aujourd'hui (€/hab) | Après (€/hab) | Écart (€/hab) | Habitants dans une commune perdante |
|---|---|---|---|---|---|
| Moins de 500 habitants | 4,1 | 306 | 183 | −124 | 85 % |
| 500 à 2 000 | 11,1 | 359 | 268 | −91 | 83 % |
| 2 000 à 10 000 | 18,7 | 511 | 415 | −96 | 79 % |
| 10 000 à 50 000 | 18,5 | 705 | 569 | −136 | 78 % |
| 50 000 à 200 000 | 10,4 | 770 | 730 | −40 | 74 % |
| Plus de 200 000 (hors Paris) | 3,9 | 805 | 650 | −155 | 65 % |
| Paris | 2,2 | 841 | 4 024 | +3 183 | 0 % |
| Rurales (OFGL) | 14,3 | 347 | 231 | −116 | 86 % |
| Quintile de prix le plus bas | 13,8 | 415 | 144 | −272 | 97 % |
| Quintile de prix le plus haut | 13,8 | 842 | 1 672 | +830 | 25 % |

Plus fortes pertes (10 000 habitants et plus) : Grenoble −798 €/hab, Villeneuve-sur-Lot −691, Nevers −667, Angoulême −654, Cahors −654 ; plus forts gains : Neuilly-sur-Seine +5 550, Puteaux +4 975, Courbevoie +3 301, Paris +3 183, Levallois-Perret +2 663. **Lecture** : la taxe foncière actuelle est assise sur des valeurs locatives de 1970 et des taux votés élevés dans les villes moyennes en difficulté ; une taxe sur la valeur de marché concentre le produit là où l'immobilier est cher. Une garantie pour qu'aucune commune ne perde coûterait 13,0 Md€ à prélever sur les gagnantes.

**Clé mixte « moitié localisation, moitié par habitant »** : les petites communes et les rurales gagnent (+81 €/hab sous 500 habitants ; rurales +65), les villes de 10 000 à 200 000 habitants perdent (−109 à −124 €/hab), Paris garde +1 467 €/hab ; 35 % des communes perdent (61 % des habitants) ; garantie nécessaire 7,3 Md€.

**Péréquation recommandée (simple et modulable)** :
1. **2029 : garantie individuelle intégrale.** Chaque commune reçoit de l'enveloppe communale de la taxe de 1 % sa **part historique** (sa taxe foncière 2024 / le total). Personne ne gagne ni ne perd ; c'est la règle de l'auteur (chaque collectivité reçoit d'abord ce qu'elle perçoit aujourd'hui) et le précédent du FNGIR de 2010 (garantie individuelle de ressources après la suppression de la taxe professionnelle, validée par le Conseil constitutionnel, 2009-599 DC)[^cc2009].
2. **De 2030 à 2039 : 5 points de l'enveloppe par an** passent de la part historique à une **clé de péréquation** (moitié localisation des biens, moitié habitants, pondérée par l'inverse du potentiel financier : à préciser). En 2039, la moitié de l'enveloppe suit la clé, la moitié reste historique ; le Parlement décide ensuite d'aller plus loin ou non. Les écarts de la clé mixte (−124 à +81 €/hab en moyenne par taille) sont ainsi étalés sur dix ans (≈ ±10 € par habitant et par an au plus pour les groupes, davantage pour les cas extrêmes : plafonner la perte annuelle d'une commune à 2 % de ses recettes de fonctionnement, ⚠️ V13812).
3. **La croissance** de l'enveloppe (hausse des valeurs immobilières) suit la clé de péréquation dès 2030, ce qui accélère la convergence sans faire perdre d'euros courants.
4. **EPCI et départements, régions, AOM** : même principe (garantie historique de leur part de points en 2029, puis convergence décidée par la loi) ; pour les départements, la péréquation des DMTO existante (fonds de 1,6 à 1,8 Md€) disparaît avec les DMTO et doit être reprise dans la clé.

## 5. Neutralité consolidée et contrôle des imputations du modèle

| Poste | Supprimé dans le modèle (bilan) | Compensé aux collectivités | Écart | Effet sur le solde |
|---|---|---|---|---|
| Taxe foncière | 42,9 (Insee, P07) | 43,26 (DGCL) | +0,36 | nul : l'Insee compte ce que paient les contribuables ; les collectivités reçoivent en plus les dégrèvements payés par l'État, qui disparaissent avec la taxe (V13813) |
| Versement mobilité | 12,2 (P06) | 12,2 | 0 | nul |
| CFE | dans P06 (46,3) | 8,03 | — | nul (même impôt) |
| Droits de mutation | 16,1 (N08, valeur 2025 au central) | 14,09 (2024) | −2,0 | nul pour le solde : le modèle chiffre la perte sur l'année 2025 (marché remonté), la compensation est fixée sur 2024 ; si la clé est fixée en points, l'écart n'a pas d'objet (V13814) |
| Fraction de TVA | reste dans la TVA (P11) | 52,49 | — | nul : l'État garde la TVA et paie l'équivalent en points de prélèvement |

**Conclusion : la bascule ne change pas le solde consolidé, et aucune erreur d'imputation à corriger n'a été trouvée.** Deux points restent ouverts sans effet sur le solde : (a) les dépenses des collectivités ne sont pas modélisées (330,5 Md€ d'APUL, « reste inchangé » du bilan) ; (b) la recentralisation du RSA dans l'allocation unique, comptée côté dépenses par le modèle, doit réduire la part des départements (section 3) : c'est une affaire de clé, pas de solde consolidé.

## 6. Contraintes juridiques

1. **Constitution, art. 72-2** : al. 2 (« Elles peuvent recevoir tout ou partie du produit des impositions de toutes natures. La loi peut les autoriser à en fixer l'assiette et le taux dans les limites qu'elle détermine ») ; al. 3 (« Les recettes fiscales et les autres ressources propres des collectivités territoriales représentent, pour chaque catégorie de collectivités, une part déterminante de l'ensemble de leurs ressources ») ; al. 4 (transfert de compétences = ressources équivalentes) ; al. 5 (péréquation)[^const]. **Art. 72, al. 3** : libre administration par des conseils élus.
2. **Loi organique n° 2004-758 du 29 juillet 2004, art. LO 1114-2 du CGCT** : les ressources propres comprennent le produit des impositions « dont la loi les autorise à fixer l'assiette, le taux ou le tarif, **ou dont elle détermine, par collectivité, le taux ou une part locale d'assiette** » ; **LO 1114-3** : la part des ressources propres de chaque catégorie « ne peut être inférieure au niveau constaté au titre de l'année 2003 »[^cgct]. Les ratios planchers de 2003 (≈ 60,8 % pour le bloc communal, 58,6 % pour les départements, 41,7 % pour les régions, source secondaire) et les ratios récents n'ont pas pu être lus dans le rapport officiel (⚠️ V13815).
3. **Une part d'impôt national compte-t-elle comme ressource propre ? Oui, si elle est territorialisée.** Conseil constitutionnel, 2004-500 DC, cons. 10 : les recettes fiscales propres s'entendent aussi des impositions dont la loi « détermine, par collectivité, le taux ou une part locale d'assiette »[^cc2004] ; 2009-599 DC, cons. 61-64 : la CVAE affectée « à partir d'une part locale d'assiette » est une ressource propre, et « il ne résulte ni de l'article 72-2 de la Constitution ni d'aucune autre disposition constitutionnelle que les collectivités territoriales bénéficient d'une autonomie fiscale »[^cc2009] ; 2017-758 DC, cons. 16-17 : la répartition des recettes au sein d'une catégorie suffit ; **2019-796 DC, cons. 35** : la fraction de TVA des départements « constitue le produit d'une imposition de toutes natures dont la loi détermine, par département, une part locale d'assiette. Il s'agit donc d'une ressource propre », sans pouvoir de taux[^cc2019]. **Conséquence pour la clé** : la part du prélèvement unique doit être définie comme une fraction du prélèvement **payé par les habitants (ou assis sur l'activité) du territoire**, et la part de la taxe de 1 % comme une fraction de la taxe **sur les biens situés sur le territoire** ; une répartition purement « par habitant » ou une garantie figée ressemblerait à une dotation et ne compterait pas (⚠️ V13816 : la garantie historique de 2029 est-elle une « part locale d'assiette » ? Le FNGIR n'est pas compté comme ressource propre, à vérifier). La fraction de TVA des EPCI (2021) n'a pas été jugée sur ce point.
4. **Libre administration et pouvoir de taux** : la Constitution n'impose pas de pouvoir de taux (90-277 DC, cons. 13-14 ; 2000-432 DC, cons. 4-6 : la suppression de la part régionale de la taxe d'habitation compensée par l'État est validée) ; la limite est de ne pas « réduire la part des recettes fiscales […] au point d'entraver leur libre administration »[^cc2000].
5. **Charte européenne de l'autonomie locale (Conseil de l'Europe, 1985), art. 9** : § 1 ressources propres suffisantes ; § 3 « Une partie au moins des ressources financières des collectivités locales doit provenir de redevances et d'impôts locaux dont elles ont le pouvoir de fixer le taux, dans les limites de la loi » ; § 5 péréquation[^charte]. La France l'a ratifiée (2007 selon une source secondaire ; date et réserves non vérifiées, ⚠️ V13817). **La bascule respecte le § 3 parce qu'elle laisse ≈ 44 Md€ d'impôts locaux à taux voté** (section 2) ; sans eux, elle le heurterait.
6. **Précédents** : FNGIR et DCRTP (loi de finances pour 2010, art. 78 ; texte non relu, Légifrance fermé aux outils, ⚠️ V13818) ; coefficient correcteur de la réforme de la taxe d'habitation (LFI 2020, art. 16 ; net 0,76 Md€ en 2024 d'après la DGCL).

**Option à proposer à l'auteur (non chiffrée)** : un **droit de modulation** du bloc communal sur sa part de la taxe de 1 % (par exemple ±0,1 point), qui rendrait la part pleinement « ressource propre » et respecterait l'esprit de la Charte, au prix d'une complexité que l'auteur veut éviter.

## 7. Ce qui reste fragile

- La valeur des biens par commune est une approximation (V13811) : les résultats par commune sont des ordres de grandeur, les tendances (Paris et l'ouest parisien gagnent, villes moyennes et rurales perdent sous une clé de localisation) sont robustes, les montants individuels non.
- Versement mobilité hors champ DGCL (6,73) non décomposé (V13806) ; droits de mutation : périmètres OFGL et DGCL différents (V13807) ; fraction de TVA des départements : écart de 2,1 entre OFGL et DGCL (V13808).
- La clé est neutre à compétences constantes : la recentralisation du RSA et les transferts futurs changent les parts (V13810).
- Le prélèvement unique est un montant de croisière ; en 2029, l'assiette réelle peut différer (transition) : fixer la clé en points évite d'avoir à le prévoir.

## Sources mobilisées

| Source | Quoi | Ce qu'elle établit | Cote |
|---|---|---|---|
| DGCL, *Les collectivités locales en chiffres 2025*, ch. 5, tableau 5.1 (2024) | fiscalité locale par impôt et par niveau | les montants à compenser | A |
| OFGL, bases consolidées 2024, REI 2024, base fiscale simplifiée 2024 (API data.ofgl.fr) | agrégats par niveau, produits et bases par commune | recoupement, analyse par commune | A/B |
| Insee, comptes des APU 2024 (via le bilan, P06, P07) | prélèvements supprimés par le modèle | neutralité consolidée | A |
| Indicateurs immobiliers par commune 2014-2024 (data.gouv, dérivé de DVF) | prix moyen au m² 2024 | approximation de la valeur des biens | C |
| Insee, grille communale de densité (2020, 4 niveaux) | typologie | gagnants et perdants par densité | A |
| Constitution, art. 72 et 72-2 ; CGCT LO 1114-1 à LO 1114-4 | règles d'autonomie financière | contraintes | A |
| Conseil constitutionnel 90-277 DC, 2000-432 DC, 2004-500 DC, 2009-599 DC, 2017-758 DC, 2019-796 DC | jurisprudence | une part locale d'assiette suffit ; pas d'autonomie fiscale constitutionnelle | A |
| Charte européenne de l'autonomie locale, art. 9 (projet de loi AN n° 2802, 2006) | engagement international | pouvoir de taux sur une partie des ressources | B |

[^dgcl]: DGCL, *Les collectivités locales en chiffres 2025*, chapitre 5 « Fiscalité locale », tableau 5.1 (exercice 2024), https://www.collectivites-locales.gouv.fr/les-collectivites-locales-en-chiffres-2025, consulté le 05/11/2026.
[^ofgl]: OFGL, jeux ofgl-base-communes-consolidee, ofgl-base-gfp-consolidee, ofgl-base-departements-consolidee, ofgl-base-regions-consolidee, ofgl-base-syndicats-consolidee, rei, base-fiscale-simplifiee (exercice 2024), https://data.ofgl.fr/api/explore/v2.1, consulté le 05/11/2026.
[^insee]: Insee, comptes nationaux des administrations publiques 2024 (tableaux 3.216 et 3.217), repris dans `sources/recherche-donnees-simulateur.md` § 3.3 et document de travail de l'atelier, non publié (lignes P06, P07).
[^prix]: B. Mericskay, « Indicateurs immobiliers par commune et par année (prix et volumes) sur la période 2014-2024 », data.gouv.fr, fichier communesdvf2024.csv, colonne Prixm2Moyen, https://www.data.gouv.fr/datasets/indicateurs-immobiliers-par-commune-et-par-annee-prix-et-volumes-sur-la-periode-2014-2024, consulté le 05/11/2026.
[^const]: Constitution du 4 octobre 1958, art. 72 et 72-2, https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur, consulté le 05/11/2026.
[^cgct]: CGCT, art. LO 1114-1 à LO 1114-4 (version consolidée, codes.droit.org, mise à jour du 01/10/2026), https://codes.droit.org/payloads/Code%20g%C3%A9n%C3%A9ral%20des%20collectivit%C3%A9s%20territoriales.xml, consulté le 05/11/2026.
[^cc2004]: Conseil constitutionnel, décision n° 2004-500 DC du 29 juillet 2004, cons. 10, https://www.conseil-constitutionnel.fr/decision/2004/2004500DC.htm, consulté le 05/11/2026.
[^cc2009]: Conseil constitutionnel, décision n° 2009-599 DC du 29 décembre 2009, cons. 61-64 et 66-69, https://www.conseil-constitutionnel.fr/decision/2009/2009599DC.htm, consulté le 05/11/2026.
[^cc2019]: Conseil constitutionnel, décision n° 2019-796 DC du 27 décembre 2019, cons. 35-37, https://www.conseil-constitutionnel.fr/decision/2019/2019796DC.htm, consulté le 05/11/2026 ; et n° 2017-758 DC du 28 décembre 2017, cons. 16-17.
[^cc2000]: Conseil constitutionnel, décisions n° 90-277 DC du 25 juillet 1990 (cons. 13-14) et n° 2000-432 DC du 12 juillet 2000 (cons. 4-6), https://www.conseil-constitutionnel.fr, consulté le 05/11/2026.
[^charte]: Charte européenne de l'autonomie locale, art. 9, traduction officielle reproduite dans le projet de loi n° 2802 (Assemblée nationale, XIIe législature, 17/01/2006), https://www.assemblee-nationale.fr/12/pdf/projets/pl2802.pdf, consulté le 05/11/2026.
