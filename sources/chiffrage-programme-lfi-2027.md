---
titre: Chiffrage du programme de La France insoumise pour 2027 (« L'Avenir en commun » et document budgétaire d'octobre 2026) : effet sur les comptes publics, comparé à notre système
date: 2026-11-08
statut: brouillon de travail ; chiffrage principal par le banc d'essai commun (modeles/banc-programmes/, relancer.py, tests unittest) depuis le 08/11/2026 après-midi ; première méthode conservée en annexe (sources/calculs/chiffrage_programme_lfi_2027.py, « Tests : tous passés ») ; ordres de grandeur sous hypothèses, jamais des prédictions ; une partie des lignes n'a ni chiffrage public ni source primaire lue (marquée « grossier ») ; vérifications V31000 à V31013 ; non intégré aux chapitres ; pas de jugement de valeur
---

# Chiffrage du programme de La France insoumise pour 2027

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 08/11/2026. Conflit d'intérêts à déclarer : l'auteur du manifeste est partie prenante (candidat potentiel, programme concurrent) ; Claude est un modèle d'Anthropic ; le dossier applique à LFI la même méthode qu'à notre système. **Reproduire** : `python3 -I sources/calculs/chiffrage_programme_lfi_2027.py`. Convention : **fait sourcé** / **estimation** (méthode dite) / **opinion** ; ⚠️ = non vérifié ; Md€ par an, euros 2024-2026 sans croissance ; points = % du PIB 2024 (2 935 Md€, Insee). Dates de consultation : 08/11/2026 pour toutes les sources.

## 0 bis. Nouveau chiffrage par le banc d'essai commun (08/11/2026, remplace les chiffres des § 0 et § 5)

**Ce qui change.** Le premier chiffrage (conservé en annexe, § 0 et § 5 ci-dessous : « première méthode ») empilait des bornes et approchait les modèles par des coûts unitaires. Le nouveau chiffrage passe LFI dans le **banc d'essai commun** `modeles/banc-programmes/` (README et `resultats.md` qui fait foi) : mêmes modèles, même dette de départ, même macro que notre système. **Reproduire** : `python3 -I modeles/banc-programmes/relancer.py` (tests : `python3 -I modeles/banc-programmes/tests/test_banc.py`).

1. **Branché sur nos modèles** : retraite à 60 ans (`modeles/retraites/age_libre.js`, cohorte recalée par `modeles/demographie/`) ; impôt sur le revenu à 14 tranches et fin du quotient conjugal (OpenFisca-France 176.1.10, population stylisée de foyers types : limite assumée, pas de micro-données) ; ISF, plancher de 2 % (type Zucman), successions et plafond d'héritage (`modeles/systeme-ideal/`, érosion et exil du modèle) ; chaîne dette identique à celle de nos modèles. Lignes sans modèle : coût unitaire sourcé quand c'est possible (D08 Ségur, D09 DEPP, D17a crèches, D19 AAH DREES, D20 Insee, D21 masse salariale), sinon encore « grossier ».
2. **Incertitude** : Monte-Carlo, 10,000 tirages, graine 20261108, deux facteurs latents de corrélation (comportement des assiettes, dérive des coûts) ; on publie la médiane et l'intervalle à 80 % ; l'empilement des extrêmes reste à part, pour mémoire (`resultats.md` § 3).
3. **Dette de départ vérifiée (Insee, cote A)** : 3 305,3 Md€ fin 2024 (Informations rapides du 27/03/2025) ; 3 460,5 Md€ fin 2025 (115,7 % du PIB), départ commun de tous les programmes. V31000 est ainsi confirmée pour le montant.
4. **Test de validité** : le moteur retrouve la dette de notre système, 132,6 % en 2038 et 113,4 % en 2058 (écart inférieur à 0,001 point). Portée : il valide la chaîne dette et le branchement ; il ne valide pas les leviers de notre système, que le moteur lit au lieu de les recalculer.
5. **Calendrier corrigé** : premier exercice après l'élection de 2027 = 2028 (le budget 2027 est voté avant l'élection) ; régime en 2032.

| (statique ; médiane [intervalle à 80 %]) | LFI | Notre système | Fil de l'eau |
|---|---|---|---|
| Effet sur le solde en régime (Md€) | −247 [−289 ; −203] | 115 [59 ; 172] (2038) ; 139 [80 ; 200] (2041 et après) | 0 |
| Capital engagé en nationalisations, 2028-2030 (Md€ ; dette, pas déficit) | 129 [118 ; 140] | 0 | 0 |
| Prélèvements obligatoires (% du PIB) | 44,8 [44,0 ; 45,7] | 52,2 [50,7 ; 53,7] | 42,7 |
| Déficit 2038 (% du PIB) | 18,9 [17,0 ; 20,7] | 3,7 [1,5 ; 5,9] | 8,2 |
| Dette 2038 (% du PIB) | 240 [225 ; 254] | 133 [119 ; 146] (valeur centrale du modèle : 132,6) | 157,1 |
| Dette 2058 (% du PIB) | 503 [458 ; 548] | 110 [48 ; 169] (valeur centrale du modèle : 113,4) | 240,2 |
| Avec relance (multiplicateurs de Ramey 2019 et hypothèses) : dette 2038 ; 2058 | 207 [191 ; 224] ; 398 [347 ; 451] | 135 [125 ; 146] ; 128 [79 ; 173] | |
| Empilement des extrêmes, pour mémoire : dette 2038 | 180 à 261 | | |

Lectures. (a) La conclusion de signe est robuste : le solde de régime de LFI est négatif dans 100 % des tirages ; elle tient sans les lignes grossières. (b) L'écart avec la première méthode (dette 2038 de 206 %, de 162 à 264) vient surtout de la retraite à 60 ans (notre modèle donne environ 55 Md€ au central, avec 40 annuités exigées, contre 87 ; si tous partent à 60 ans, il retrouve 79 Md€, l'ordre de grandeur des deux chiffrages extérieurs) et des recettes du patrimoine, nettement plus basses dans notre modèle (érosion et exil) que dans le document de LFI : ISF renforcé environ 2 Md€ nets de l'IFI, impôt plancher de 2 % sans effet quand l'ISF renforcé s'applique, successions environ 13 Md€ au central, impôt sur le revenu à 14 tranches et fin du quotient conjugal environ 0,5 Md€ (avec réaction), contre 19, 15, 20 et 12 Md€ dans le document de LFI et les chiffrages de 2022. Ce sont les sorties de notre propre modèle de patrimoine : si ce modèle est trop pessimiste sur l'évasion, ces lignes sont sous-estimées, et la même correction jouerait aussi sur nos propres recettes de patrimoine. (c) Pour notre système, l'intervalle est maintenant propagé avec la même méthode (30 modules, mêmes facteurs communs : `resultats.md` § 6 ter) ; il est sous-estimé, parce que le socle hérité de l'architecture v5 est fixé au central (voir la fin de ce § 0 bis). (d) Convention des scénarios des modèles : favorable / central / défavorable = centiles 10 / 50 / 90, sans source. Détail ligne à ligne, hypothèses cotées A-D, limites : `modeles/banc-programmes/resultats.md` et `programmes/lfi/mesures.py`.

**Mise à jour du 08/11/2026 (soir) : les quatre mesures auparavant hors totaux sont dans le banc** (S01, P01, C01, N01 à N06 de `programmes/lfi/mesures.py` ; détail et hypothèses cotées dans `resultats.md` § 5 bis). Les chiffres du tableau ci-dessus les incluent (ils remplacent −220 / 226 / 467 de la version du matin). Effet sur le solde de régime, médiane [centiles 10 ; 90], Md€ par an :

| Mesure | Effet sur le solde | Ce qui le commande |
|---|---|---|
| Smic à 1 700 € net (effets publics seulement) | −6 [−13 ; +3] ; 91 [37 ; 196] milliers d'emplois perdus ; hausse des allègements généraux 12 [2 ; 20] ; coût brut privé : masse salariale +11 | **L'indexation des allègements**, que le programme ne tranche pas : si la formule reste en Smic, le solde public se dégrade de 14 [12 ; 16] et l'emploi perdu est de 35 000 ; si le barème est gelé, le solde s'améliore de 10 mais l'emploi perdu est de 234 000. Lecture « immédiate » (décret de 2027) : plein effet dès 2028. |
| Pension minimale au niveau du Smic | −23 [−30 ; −18] ; 4,2 millions de retraités à carrière complète relevés | Le niveau retenu (1 576 à 1 991 € nets), la part de carrières complètes (60 à 65 %, DREES), l'interaction avec le minimum vieillesse (2 Md€) |
| Blocage des carburants à 1,70 € | −4 [−13 ; 0] (coût total 10 Md€, dont 5 absorbés par les marges) | Le prix de marché de 2028 à 2032 : zéro s'il revient à 1,70 €, environ 20 à 30 Md€ si les prix d'octobre 2026 (2,14 et 2,36 €) durent ; la remise de 2022 avait coûté 7,5 à 8 Md€ |
| Nationalisations (SNCF, autoroutes, aéroports, Engie, ArcelorMittal France, EHPAD lucratifs) | environ +7 de dividendes nets en régime ; **capital engagé : 129 [118 ; 140] Md€** (Engie 62, autoroutes 40, EHPAD 15, ADP et aéroports 10, ArcelorMittal 2, SNCF 1) | Opération financière : elle ajoute environ 4 points de PIB de dette en 2028-2030, pas de déficit, sauf pertes reprises et part des EHPAD cédée gratuitement (7 Md€ au déficit). Prix de marché et prime d'offre de 10 à 40 % ; indemnité « juste et préalable » imposée par l'article 17 de 1789 |

Lecture. (a) L'ordre de grandeur de la dette de LFI augmente de 14 points en 2038 (de 226 à 240 %) et de 36 points en 2058 (de 467 à 503 %) : surtout la pension minimale. (b) Les nationalisations sont **le poste le moins connu** : la liste est partielle (les aéroports « stratégiques » ne sont pas listés) et les valeurs (capitalisations de 2026, participations actuelles de l'État) sont lues par moteur de recherche (cotes C, ⚠️ à vérifier à l'APE). (c) Chaque fait cité dans ces lignes porte une cote A à D et ses conflits d'intérêts dans `mesures.py` ; le carburant à 1,70 € n'est pas dans le livre mais dans le plan d'urgence énergie de mars 2026 (rapporté par Public Sénat, 23/09/2026, et Selectra, 08/10/2026).

**Corrections de cohérence signalées par l'audit des hypothèses de La Boétie** (`sources/hypotheses-chiffrage-lfi-boetie.md`) : (1) **ISF** : l'an 1 de 19 Md€ de `mesures.py` était la somme de l'ISF (10) et de la flat tax (9) du document de LFI ; corrigé en 10 et 9 (ne change que le calendrier de la première année, pas le régime) ; (2) **successions** : le banc ne double pas la base : il retient la recette nouvelle **moins** les 20,8 Md€ de droits actuels (successions 15,9 + donations 4,9 Md€ en 2024, DGFiP via Insee, cote A) ; le chiffre de LFI (20 Md€) est un supplément (+96 % de la base) ; notre médiane de 13,5 [−0,6 ; 31] est donc un supplément de 65 % ; (3) **ISF et taxe Zucman** : le complément de la garantie de 2 % est maintenant calculé avec la même intensité d'ISF que la ligne ISF (facteur latent commun, poids 0,95), il n'y a donc ni double compte ni omission ; médiane du complément : environ 0 (La Boétie additionne ISF et Zucman : « peut-être 10 » p. 7 ; à arbitrer).

### Écarts avec les hypothèses de LFI (Institut La Boétie, NFP 2024)

Voir `sources/hypotheses-chiffrage-lfi-boetie.md` (lu le 08/11/2026 ; aucune note publique de l'Institut sur les quatre mesures ci-dessus n'a été trouvée). Pour les quatre mesures ajoutées : **Smic** : le NFP de 2024 visait 1 600 € net (+14 %) et n'a chiffré aucun coût (« effets positifs pour toute l'économie », avances à 0 % pour les TPE-PME) ; **pension minimale, carburants, nationalisations** : absents du NFP et de l'audition de M. Berr. Aucune hypothèse de multiplicateur ni de comportement n'est publiée par l'Institut ou le NFP : il n'y a donc rien à confronter à nos élasticités d'emploi (0,05 à 0,50), à notre diffusion aux salaires voisins, à nos prix du carburant ou à nos primes d'offre : **ces hypothèses sont les nôtres, non contestées par LFI faute de contre-chiffrage**. Écarts documentés sur les autres lignes : ISF 15 (NFP) et 8 (La Boétie) contre 2 (nous, net d'érosion et d'exil) ; successions 17 et 17 contre 13,5 ; multinationales 26 et 25 contre 3,4 ; IS progressif 11 contre 2 ; IR à 14 tranches 5 contre 0,5 ; ce qui sépare ces chiffres est surtout que les leurs sont bruts (sans comportement, p. 5 de l'audition) et les nôtres nets.

**Notre système, intervalle propagé le 08/11/2026 (nuit), même méthode que LFI et le RN.** Chaque module du modèle (garantie de transition, patrimoine v7.5 et comportements, transmissions, fonction des revenus et crédit d'IS, courbe des pensions, TVA, économies, grand âge, chiffrage du 08/11, Sécurité sociale à 100 %, conversions en salaire, plancher en deux parts, outre-mer, retraites V6, fiscalité d'orientation...) est rejoué à ses bornes favorable et défavorable avec `decisions_0811.s3()` et ses fonctions (`modeles/banc-programmes/js/pont_incertitudes.js`) ; mêmes facteurs communs « comportement » et « coût », mêmes 10 000 tirages, mêmes lois ; les leviers votés restent fixes (52,8 Md€). Résultat : solde 2038 115 [59 ; 172] Md€, dette 2038 133 [119 ; 146] %, dette 2058 110 [48 ; 169] %, contre 113, 132,6 et 113,4 pour la valeur centrale. Le déficit baisse dans 99,7 % des tirages, mais la dette n'est stabilisée dès 2038 que dans 52 % d'entre eux (aucune année de 2039 à 2058 au-dessus du niveau de 2038). L'intervalle reste **sous-estimé** : socle hérité de l'architecture v5, corrections du grand livre et impôt de suite sont fixés au central. Détail et poids des modules : `resultats.md` § 6 ter et § 7.

**La carte des convergences (§ 7) est inchangée** : elle ne dépend pas du chiffrage ; aucune correction.

## 0. Résultat en dix lignes (première méthode, matin du 08/11/2026 : conservée en annexe, chiffres remplacés par le § 0 bis)

1. **Fait.** LFI a publié le 14/10/2026 un document budgétaire pour 2027 : 106,4 Md€ de recettes, 81,7 Md€ de dépenses, 24,7 Md€ de réduction du déficit la première année, et 100 Md€ par an d'investissements d'un « pôle public bancaire » hors budget. Le document dit lui-même qu'il « ne constitue pas un chiffrage complet du programme » (cote D, document partisan).
2. **Fait (contrôle arithmétique).** Les 81,7 Md€ se retrouvent ligne à ligne (37,5 + 22,2 + 10 + 12) et les 106,4 Md€ aussi. Le document n'inclut pas : le SMIC à 1 700 € net, le blocage du carburant à 1,70 €, la pension minimale au SMIC, la retraite à 60 ans (9 Md€ seulement pour l'abrogation de 2023), le « 100 % Sécu ».
3. **Estimation.** Avec une règle de recoupement explicite (§ 2), les recettes de la première année vont de **37,8** (bas) à **106,4** (haut, chiffre de LFI), central **72,1**. Solde de la première année, dépenses de LFI conservées : **−43,9 / −9,6 / +24,7** Md€.
4. **Estimation.** Programme complet en régime (2032, central, avant retour macro) : dépenses nouvelles **284 Md€** (196 à 416), recettes nouvelles **80 Md€** (42 à 118), solde brut **−204 Md€** (−374 à −78). La retraite à 60 ans pèse 87 Md€ de ces 284.
5. **Estimation.** Après un retour macroéconomique modéré (multiplicateur 0,5 au central, effet d'offre −0,3 % du PIB) : solde net **−153 Md€** (−334 / −16), soit un déficit d'environ 322 Md€ (11 % du PIB) contre 169 Md€ en 2024.
6. **Estimation.** Dette / PIB en 2038 : **206 %** (264 / 162) ; en 2058 : **402 %** (588 / 261), macro de référence ; le fil de l'eau (solde primaire de 2024 maintenu) donne 160 % et 247 %.
7. **Estimation.** Prélèvements obligatoires (mesure officielle) : 42,7 % → **45,4 %** (44,1 à 46,7) ; dépense publique 57,0 % → **66,7 %** (63,7 à 71,2).
8. **Sensibilité.** Le multiplicateur qui équilibrerait le central serait d'environ 1,9 (1,3 dans le cas favorable) ; il est au-dessus de la plupart des estimations lues (§ 3).
9. **Ce qui est solide :** le périmètre des mesures, les unités de coût de plusieurs lignes (point d'indice, écart de pauvreté, cantine), l'ordre de grandeur de la retraite à 60 ans (deux chiffrages de bords opposés : 71,5 et 85,8 en euros 2022). **Ce qui manque :** voir § 6.
10. **Pour notre système :** voir § 5 et § 7 (carte des convergences) ; les arguments qui peuvent être retournés contre nous sont au § 8.

## 1. Les mesures à effet budgétaire, par chapitre

Programme : *L'Avenir en commun*, https://melenchon2027.fr/programme/livre/ (cote D : texte partisan, source primaire pour ce que LFI propose, pas pour ce que cela coûte). Les pages ne donnent presque aucun montant. Citations courtes, lues le 08/11/2026.

| Chapitre (lien) | Mesures significatives | Montant donné par le texte |
|---|---|---|
| [P3 ch1 « À chacun selon ses besoins »](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1) | « le revenu mensuel de chaque personne atteindra le seuil de pauvreté » (1 337 €) ; garantie d'emploi ; retour aux 35 h, 32 h métiers pénibles, 6e semaine de congés ; retraite « à 60 ans à taux plein pour 40 annuités », pension de carrière complète au SMIC, suppression de la décote ; « 100 % Sécu », fin des franchises, arrêt maladie à 100 % sans carence ; cotisation sociale universelle (fusion avec la CSG) ; doublement de l'inspection du travail | aucun, sauf le seuil de 1 337 € |
| [P3 ch2 « République de l'égalité réelle »](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2) | AAH « à hauteur du SMIC » ; « 10 000 places par an » d'hébergement public pendant cinq ans ; EHPAD lucratifs collectivisés ; repas à 1 € au Crous ; emploi jeune de 5 ans | 10 000 places par an |
| [P3 ch3 « Émancipation des femmes »](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre3) | « 3 milliards de budget demandés par les associations » ; « 500 000 places » d'accueil ; gratuité des crèches publiques ; congé d'accueil de 20 semaines par parent | 3 Md€ ; 500 000 places |
| [P3 ch4 « Égalité contre le racisme »](https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre4) | plan contre le racisme et les discriminations ; droit du sol intégral ; droit de vote des étrangers aux élections locales | 1 Md€ (plan) |
| [P1 ch1-3 Bifurcation écologique](https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3) | « Refaire l'isolation d'au moins 700 000 logements par an » ; renationaliser SNCF, autoroutes, Engie ; « Arrêter les subventions aux énergies fossiles » ; tarifs réglementés ; caisse de défaisance des dettes agricoles, prix planchers ; rénover les réseaux d'eau ; plan de reconstruction industrielle ; nationaliser ArcelorMittal France ; droits de douane écologiques, taxe kilométrique aux frontières | aucun (700 000 logements en unités physiques) |
| [P2 ch1 « Nouveau collectivisme »](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre1) | « Revenir sur les privatisations (aéroports, autoroutes, Française des jeux, etc.) » ; pôles publics (banque, assurance) ; moratoire sur les PPP | aucun |
| [P2 ch2 « Partager les richesses »](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2) | « barème à 14 tranches contre 5 » ; ISF rétabli et renforcé, volet climatique ; « garantie d'impôt de 2 % sur le patrimoine des centimillionnaires » ; fin de la flat tax ; succession : plafond d'héritage de 12 M€, exonération sous 150 000 € ; impôt universel sur les entreprises ; taxe sur les superprofits ; SMIC « à 1 700 € net » ; point d'indice +10 % ; APL +10 % ; écart de 1 à 20 des salaires | 14 tranches, 2 %, 12 M€, 150 000 €, 1 700 €, +10 % ; aucun montant de recettes |
| [P2 ch3 « Pacte productif »](https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre3) | dividendes plafonnés aux bénéfices ; interdiction des licenciements économiques pour les entreprises qui versent des dividendes ; pôle bancaire public ; taxe sur les transactions financières ; « circuit du Trésor » ; BCE : rachats de dette, dette détenue transformée en « dettes perpétuelles à taux nul » | « 19 milliards d'euros par an » (Cades) |
| [P4 ch2 « Éducation »](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2) | gratuité de la cantine, de l'école, de l'enseignement supérieur ; effectifs par classe sous 19 ; rattrapage du point d'indice depuis 2010 ; suppression du crédit d'impôt recherche au profit de dotations ; service citoyen de neuf mois au SMIC | aucun |
| [P4 ch3 Culture et sport](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre3) | culture « à 1 % du produit intérieur brut (PIB) par an » ; gratuité des musées | 1 % du PIB |
| [P4 ch4 Santé](https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4) | ONDAM remplacé par un objectif de besoins ; sortie de la T2A ; plan de recrutement, revalorisation des soins ; centres de santé publics ; pôle public du médicament | aucun |
| [P5 ch3 « Sans déserts de droits »](https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre3) | « Produire 200 000 logements publics par an » ; taxe d'habitation progressive (80 % exonérés) ; DGF indexée ; garantie universelle des loyers | 200 000 logements ; 30 000 logements jeunes |
| [P6 ch1](https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre1) et [ch2](https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre2) | « suspension pour tous des règles budgétaires des 3 % » ; « désobéissance aux règles bloquantes » ; « Rejeter le tribut, exigé par les États-Unis, de 5 % du PIB » de défense ; sortie du commandement intégré de l'OTAN ; pôle public de l'armement | 3 % ; 5 % |
| [P5 ch1](https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1) et [ch2](https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2) | constituante, RIC, proportionnelle, vote à 16 ans ; autorité indépendante de contrôle de la police ; abrogation de l'état d'urgence permanent | aucun |

Non lus (limite) : [Introduction](https://melenchon2027.fr/programme/livre/introduction), P1 ch1 et ch2 en détail (lus par extraction, sans montant), P4 ch1, ch5, ch6, ch7, P6 ch3, pages de présentation. Aucune page n'a refusé l'accès. Le PDF du document budgétaire (« Comment nous allons remettre de l'ordre dans les comptes publics », [lien](https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf)) a été lu en entier (24 pages).

## 2. Le chiffrage : année 1 (loi de finances 2027) et régime (2032)

### 2.1 Le document budgétaire de LFI, ligne à ligne (fait, cote D)

| Bloc de dépenses (LFI) | Md€ | Composition vérifiée |
|---|---|---|
| Revenus des classes populaires | 37,5 | point d'indice +10 % (17) ; pensions, allocations familiales et APL indexées, APL +10 % (8) ; logements d'urgence (3) ; garantie d'autonomie des jeunes à 1 337 € (9,5) |
| Services publics | 22,2 | 10 000 postes d'enseignants (0,5) ; cantine gratuite (3,6) ; 250 000 places à l'université (3,5) ; hôpitaux (3) ; violences sexistes et sexuelles (2,6) et sur enfants (2) ; indexation des budgets 2026 (7) |
| Planification écologique | 10 | « 10 milliards devront être investis dès 2026 » |
| Sécurité sociale | 12 | abrogation de la réforme de 2023 (9) ; abrogation des réformes de l'assurance chômage (3) |
| **Total dépenses** | **81,7** | |

Recettes (LFI) : ISF climatique 10 ; flat tax 9 ; niches fiscales et sociales 22 ; CVAE grandes entreprises 3 ; taxe Zucman 15 ; succession 20 ; IS 3 ; taxe universelle sur les multinationales 5 ; Gafam 3,9 ; superprofits 5 ; transactions financières 5 ; rachats d'actions 2,5 ; crypto-actifs 1 ; fraude 2 = **106,4 Md€** (somme vérifiée par le script). Réduction annoncée du déficit : 24,7 Md€. La suppression des exonérations de cotisations au-dessus de 2 SMIC est annoncée sans montant et n'entre pas dans la somme.

### 2.2 Règle de recoupement des recettes (convention, pas une vérité)

Pour chaque recette : **haut** = chiffre de LFI ; **bas** = chiffre indépendant le plus proche s'il existe, sinon 35 % du chiffre de LFI (hypothèse `HYP_DECOTE_SANS_RECOUPEMENT`, sans source : elle représente l'érosion de l'assiette, l'exil et l'évitement) ; **central** = milieu. Cette règle évite de reprendre un seul chiffrage orienté. Elle ne dit pas que le milieu est le plus probable.

| Recette | LFI | Chiffrage indépendant lu | Bas | Central | Haut |
|---|---|---|---|---|---|
| ISF climatique + fin de la flat tax | 19 | Institut Montaigne 2022 : environ 5 pour les deux | 5,0 | 12,0 | 19,0 |
| Niches fiscales et sociales (dont CIR, pacte Dutreil) | 22 | aucun | 7,7 | 14,8 | 22,0 |
| CVAE grandes entreprises | 3 | aucun | 1,0 | 2,0 | 3,0 |
| Taxe Zucman | 15 | Institut de l'entreprise 2026 : environ 5,5 (cote C, patronal) ; Zucman : 15 à 25 | 5,5 | 10,2 | 15,0 |
| Succession | 20 | Institut Montaigne 2022 : 9 | 9,0 | 14,5 | 20,0 |
| IS | 3 | aucun | 1,0 | 2,0 | 3,0 |
| Taxe universelle multinationales | 5 | Institut Montaigne 2022 : 18 (conception différente, non retenu) | 1,8 | 3,4 | 5,0 |
| Gafam | 3,9 | aucun | 1,4 | 2,6 | 3,9 |
| Superprofits | 5 | aucun (NFP 2024 : 15 revendiqués) | 1,8 | 3,4 | 5,0 |
| Transactions financières | 5 | Institut Montaigne 2022 : 9 (non retenu) | 1,8 | 3,4 | 5,0 |
| Rachats d'actions, crypto | 3,5 | aucun | 1,2 | 2,4 | 3,5 |
| Fraude fiscale | 2 | Institut Montaigne 2022 écartait 26 annoncés | 0,7 | 1,4 | 2,0 |
| **Total année 1** | **106,4** | | **37,8** | **72,1** | **106,4** |
| IR à 14 tranches, fin du quotient conjugal (régime seulement) | non chiffré par LFI | Institut Montaigne 2022 : environ 12 | 4,0 | 8,0 | 12,0 |
| **Total régime** | | | **41,8** | **80,1** | **118,4** |

Lecture : Institut Montaigne et Institut de l'entreprise sont des sources de cote C avec conflit d'intérêts déclaré ou probable (voir § 9). Pour la taxe Zucman, l'écart (5,5 à 15, ou 25 selon son auteur) est le plus gros désaccord documenté ; il n'est pas arbitré ici.

### 2.3 Dépenses de régime (programme complet, 2032)

« Ancrage » : **LFI** = chiffre du document de LFI pour la première année, prolongé ; **indep** = chiffrage extérieur lu ; **calcul** = calcul du dépôt ; **grossier** = ordre de grandeur sans source primaire lue (à ne pas citer comme un fait). Favorable / central / défavorable pour le solde.

| N° | Mesure | Favorable | Central | Défavorable | Ancrage et méthode |
|---|---|---|---|---|---|
| D01 | Point d'indice +10 % | 17,0 | 18,5 | 20,0 | LFI : 17 ; dépôt : 2,0 Md€ par point (HDS17) |
| D02 | Indexation pensions, allocations, APL ; APL +10 % | 8,0 | 8,0 | 8,0 | LFI |
| D03 | Logements d'urgence | 3,0 | 3,0 | 3,0 | LFI |
| D04 | Garantie d'autonomie (jeunes, puis chacun au seuil de 1 337 €) | 9,5 | 19,8 | 30,2 | LFI pour les jeunes ; écart de pauvreté Insee 2023 (9,8 M de pauvres x 19,2 % x 1 337 € x 12 = 30,2) ; ignore les unités de consommation |
| D05 | Retraite à 60 ans, 40 annuités (comprend l'abrogation) | 79,5 | 87,4 | 95,4 | Contre-chiffrage de LFI 71,5 ; Institut Montaigne 85,8 (euros 2022, mis à l'échelle du PIB x 1,11 ⚠️) |
| D06 | Assurance chômage | 3,0 | 4,0 | 6,0 | LFI : 3 ; haut sans source |
| D07 | « 100 % Sécu », fin des franchises, arrêts maladie à 100 % | 21,2 | 30,0 | 40,0 | dépôt : 21,2 (même mesure que dans notre système) ; indemnités journalières 12,1 aujourd'hui ; non chiffré par LFI |
| D08 | Hôpital et soin (recrutements, revalorisations) | 3,0 | 8,0 | 13,0 | LFI : 3 ; haut ≈ Ségur de la santé ⚠️ |
| D09 | Éducation : postes (23 → 19 élèves par classe) | 2,5 | 6,0 | 9,0 | LFI : 10 000 postes = 0,5 (50 k€ par poste) ; 50 000 / 120 000 / 180 000 postes ⚠️ |
| D10 | Cantine gratuite | 3,6 | 3,6 | 3,6 | LFI |
| D11 | Université (gratuité, places, Crous) | 3,5 | 5,0 | 8,0 | LFI : 3,5 ; haut sans source |
| D12 | Violences sexistes et sexuelles, enfants | 4,6 | 4,6 | 4,6 | LFI |
| D13 | Budgets 2026 rattrapés et indexés | 7,0 | 7,0 | 7,0 | LFI |
| D14 | Planification écologique (État) | 10,0 | 25,0 | 37,0 | LFI : 10 ; haut : 37 (Pisani-Ferry et Mahfouz, cité par LFI) ; central = milieu |
| D15 | Pôle public bancaire : part supportée par l'État | 0,0 | 5,0 | 20,0 | LFI : aucun effet ; hypothèse : 0 / 5 / 20 % de 100 Md€ |
| D16 | 200 000 logements publics par an, 30 000 logements jeunes | 2,0 | 4,0 | 8,0 | grossier |
| D17 | Petite enfance : 500 000 places, gratuité | 5,0 | 9,0 | 14,0 | 6,6 Md€ publics pour 470 000 places en crèche (≈ 14 k€ par place) ; coût moyen 19 450 € par place (Banque des Territoires, origine à vérifier) |
| D18 | Dépendance : 10 000 places par an x 5, domicile, aidants | 1,0 | 2,5 | 5,0 | grossier |
| D19 | AAH au niveau du SMIC | 5,0 | 8,0 | 10,5 | grossier : ≈ 1,3 M de bénéficiaires x écart ⚠️ |
| D20 | Garantie d'emploi, net des allocations évitées | 3,0 | 8,0 | 15,0 | grossier : 0,5 à 0,7 M de chômeurs de longue durée ⚠️ |
| D21 | 6e semaine de congés (part employeur public) | 0,0 | 4,0 | 8,0 | grossier |
| D22 | Gratuité de l'école hors cantine, Crous, culture 1 % du PIB, sport | 2,0 | 6,0 | 16,0 | grossier |
| D23 | Collectivités, taxe d'habitation progressive, services itinérants, outre-mer | 1,0 | 3,0 | 8,0 | grossier |
| D24 | Centres de santé publics, pôle du médicament, psychologues | 2,0 | 5,0 | 10,0 | grossier |
| D25 | Service citoyen de 9 mois au SMIC | 0,0 | 0,0 | 17,0 | grossier ; caractère obligatoire non précisé |
| | **Total régime** | **196,4** | **284,5** | **416,3** | |
| | dont lignes LFI + indep + calcul | 177,4 | 235,0 | 292,8 | (sans les lignes « grossier ») |

**Résultat sans les lignes « grossier »** (solde brut) : −251 (bas) / −155 (central) / −59 (haut) Md€. La conclusion de signe ne dépend donc pas des lignes les moins sourcées.

**Lignes non chiffrées, hors totaux** : SMIC à 1 700 € net (voir § 3), blocage du carburant à 1,70 € (dépend du prix à la pompe, non lu), pension minimale au SMIC, nationalisations et rachats (opérations en capital : ils changent la dette brute plus que le solde ; ArcelorMittal France, Engie, SNCF, autoroutes, EHPAD lucratifs ; valeurs non lues), exonérations de cotisations supprimées au-dessus de 2 SMIC (recette, non chiffrée), recherche (le CIR supprimé finance des dotations : neutre par construction), plan anti-racisme (1 Md€), défense (rejet des 5 % : neutre par rapport à la loi de programmation, non lu), budget européen (contribution conditionnée), taxe kilométrique et droits de douane (recettes et rétorsions non chiffrables).

## 3. Effets de comportement et bouclage macroéconomique (deux lectures, gardées en sensibilité)

**Lecture de LFI** (document budgétaire, p. 6-7 et 17-18) : les revenus des classes populaires relancent l'activité, l'investissement public « entraîne un effet multiplicateur », la consolidation « ne réduit pas les ratios dette/PIB » (FMI cité), « dès l'année 2028 » un « regain d'activité » redresse les comptes. Aucun multiplicateur chiffré n'est donné.

**Lecture des critiques** (sources lues par moteur de recherche, non en primaire) : exil et évitement fiscal (taxe Zucman : de 20 Md€ annoncés à environ 5 chez Antoine Lévy et l'Institut de l'entreprise ; Gabriel Zucman juge l'exil « largement surestimé », bouclier de cinq ans proposé), baisse d'assiette, hausse du coût du travail.

**Dans le calcul** (`sensibilite_macro`) : variation du PIB = m x dépenses nouvelles / PIB − 0,5 x m x recettes nouvelles / PIB + effet d'offre ; retour sur le solde = 0,45 x variation du PIB (⚠️ hypothèse). Multiplicateur m : 0,3 / 0,5 / 1,0 (hypothèses ; OFCE 2025 : « un peu moins de 0,5 » à un an en contexte de consolidation, lu par moteur de recherche). Effet d'offre sur le niveau du PIB en régime : −1,0 % / −0,3 % / 0 (⚠️ hypothèse non sourcée, pour le coût du SMIC à 1 700 €, des 6e semaine, du plafonnement des dividendes et de l'exil).

**Le SMIC à 1 700 € net** (fait : SMIC 2026 = 1 823,03 € brut, 1 443,11 € net, +17,8 % pour atteindre 1 700 ; [info.gouv.fr](https://www.info.gouv.fr/public/index.php/actualite/le-smic-revalorise-au-1er-janvier-2026), cote A) : environ 2,2 millions de salariés au SMIC (DARES, novembre 2024, relayé par la presse, cote C). **Estimation** : environ 3 900 € de brut annuel en plus par salarié au SMIC, soit près de 8,6 Md€ pour eux seuls, plus les effets de tassement des salaires proches ; coût surtout privé (entreprises : marges, prix, emploi) donc absent du solde public hors fonction publique ; l'effet sur les cotisations et les allègements de cotisations n'est pas signé a priori. Ce coût privé est la raison de l'effet d'offre en sensibilité, pas une ligne budgétaire.

**Grille du solde net en régime** (central de l'assiette, Md€ ; lignes : m ; colonnes : effet d'offre −1,0 % / −0,3 % / 0) :

| m | −1,0 % | −0,3 % | 0 |
|---|---|---|---|
| 0 | −218 | −208 | −204 |
| 0,3 | −185 | −175 | −171 |
| 0,5 | −163 | −153 | −149 |
| 1,0 | −108 | −98 | −94 |
| 1,5 | −53 | −43 | −39 |

Multiplicateur d'équilibre (solde net nul, effet d'offre nul) : environ 1,9 au central, 1,3 au cas favorable (formule du script, ⚠️ simplifiée : multiplicateur constant sur un choc permanent, sans réaction des taux ni du commerce extérieur). **Non compté** : les 100 Md€ par an du pôle public bancaire (si on leur applique m = 1 et un retour de 0,45, +45 Md€ de recettes avant le coût de financement ; hypothèse optimiste, en dehors des totaux) ; la prime de risque sur la dette française (défavorable) ; la reprise de dette par la BCE (§ 6).

## 4. Chiffrages publics existants et leur orientation

Le programme de 2027 n'a pas de contre-chiffrage indépendant lu à cette date (le document de LFI est du 14/10/2026). Recoupement avec les chiffrages des programmes proches (2022 et NFP 2024), lus ou relayés :

| Source | Objet | Chiffre | Cote et conflit d'intérêts |
|---|---|---|---|
| LFI, document budgétaire 2026 (lu en entier) | 2027, année 1 | recettes 106,4 ; dépenses 81,7 ; réduction du déficit 24,7 | D : document partisan, « pas un chiffrage complet » |
| [Institut Montaigne, présidentielle 2022, Mélenchon](https://www.institutmontaigne.org/presidentielle-2022/jean-luc-melenchon/synthese) (lu) | programme 2022, par an | dépenses nouvelles 331,6 (candidat : 250) ; recettes et économies 112,7 (candidat : 267) ; solde −218,9 (≈ 7,2 points) ; retraite à 60 ans 85,8 (contre-chiffrage de LFI : 71,5) | C : think tank à financements exclusivement privés (aucune contribution au-delà de 1,2 % de 7,2 M€ de budget annuel, selon l'institut), souvent proche des entreprises ; méthode publiée ; sans changement de comportement |
| [Institut Montaigne, NFP 2024](https://institutmontaigne.org/communiques-de-presse/legislatives-2024-chiffrage-global-des-programmes) (lu) | NFP 2024, par an | déficit +179 | C (même) ; exclut les changements de comportement ; délais très courts |
| [Public Sénat, 14/10/2026](https://www.publicsenat.fr/actualites/politique/presidentielle-2027-jean-luc-melenchon-table-sur-106-milliards-de-recettes-supplementaires-et-82-milliards-de-depenses-nouvelles-pour-2027) (lu) | compte rendu de la conférence de presse | 106,4 ; 81,7 ; ISF 10, flat tax 9, Zucman 15, succession 20, niches 22 | C : presse publique ; ne cite pas de critique d'économiste |
| NFP 2024, chiffrage de la coalition (relayé par [LCP](https://lcp.fr/actualites/le-nouveau-front-populaire-chiffre-son-programme-a-150-milliards-d-ici-a-2027-assurant)) | NFP 2024 | 150 Md€ de dépenses d'ici 2027, couverts par des recettes | D : partisan ; relayé, non lu en primaire |
| Valérie Rabault (PS), relayé par LCP | NFP 2024 | 106 Md€ de dépenses nouvelles sur 2024-2027 | C : élue d'un parti de la coalition ; relayé |
| IFRAP, relayé par moteur de recherche | NFP 2024 | déficit +160 ; 215 Md€ de dépenses par an en 2027 | C-D : fondation libérale ; relayé, non lu |
| Asterès, relayé par moteur de recherche | NFP 2024 | déficit d'environ +50 ; chiffrage jugé incomplet | C : cabinet privé ; relayé, non lu |
| Institut Rousseau, relayé | NFP 2024 | simulation macro favorable (PIB, dette) | C-D : think tank orienté à gauche ; relayé, non lu |
| OFCE, relayé | multiplicateur budgétaire 2025 | « un peu moins de 0,5 » à un an en consolidation | B : centre de recherche rattaché à Sciences Po, financement public, réputé plutôt keynésien ; relayé, non lu en primaire ; pas de chiffrage OFCE du NFP ni du programme 2027 trouvé |
| Insee Première n° 2063 (juillet 2025) | pauvreté 2023 | 15,4 %, 9,8 M, seuil 1 288 €, intensité 19,2 % | A : statistique publique ; lu via moteur de recherche |

**Non trouvé** (à ne pas supposer) : chiffrage de Rexecode, de Fipeco, de la Cour des comptes ou de l'OFCE sur le programme 2027 ; chiffrage de Rexecode sur le NFP 2024 ; unités de coût de la Cour des comptes pour les mesures de ce dossier (hors petite enfance, relayée par la presse).

**Recoupement des ordres de grandeur.** Le solde brut central du régime (−204 Md€, 7,0 points) est du même ordre que celui de l'Institut Montaigne pour le programme de 2022 (−219 Md€, 7,2 points) ; celui de LFI pour la première année (+24,7) en est très loin ; la différence principale est le périmètre (retraite à 60 ans, « 100 % Sécu », garantie d'autonomie élargie), que le document de LFI ne chiffre pas pour 2027. Un seul recoupement est donc indépendant du chiffrage de LFI pour l'ordre de grandeur ; il est orienté (C) et porte sur un autre programme.

## 5. Synthèse comparable à notre système (première méthode : chiffres remplacés par le § 0 bis, conservée en annexe)

Méthode : mêmes conventions que document de travail de l'atelier, non publié (euros 2024-2025 sans croissance, régime, ordres de grandeur). Notre système : calcul de `bilan_global.py` (couche DECISIONS0811) ; LFI : ce dossier. **Dette** : méthode simple et identique pour les deux (script, `dette_trajectoire`) : dette 2024 de 3 305 Md€ (⚠️ À VÉRIFIER, Insee), solde primaire de 2024 maintenu au fil de l'eau (−3,76 % du PIB), intérêts au taux moyen 2024 (1,78 %) rejoignant le taux de marché au rythme de 1/8 par an, macro de référence (g 3 %, r 3,45 %) ou prudente (2,5 % ; 3,95 %) du modèle du dépôt. Programme LFI : amélioration du solde de l'année 1 (2027) au régime (2032), linéaire.

| | Aujourd'hui (2024) | LFI 2027, régime : bas | central | haut | Notre système (08/11) |
|---|---|---|---|---|---|
| Effet net sur le solde public (Md€/an ; + améliore) | | **−334** | **−153** | **−16** | **+133** (déficit 169 → 36) |
| dont brut, avant retour macro | | −374 | −204 | −78 | |
| Solde public total (Md€ ; % du PIB) | −169 (5,8 %) | −503 (17,1 %) | −322 (11,0 %) | −185 (6,3 %) | −36 (1,2 %) |
| Prélèvements obligatoires, mesure officielle (% du PIB) | 42,7 | 44,1 | 45,4 | 46,7 | 52,2 |
| Dépense publique, comptabilité nationale (% du PIB) | 57,0 | 71,2 | 66,7 | 63,7 | 61,4 |
| Dette / PIB 2038, macro de référence | | 264 % | 206 % | 162 % | 133 % (modèle : 132,6 %) |
| Dette / PIB 2058, macro de référence | | 588 % | 402 % | 261 % | 128 % (modèle : 113,4 %) |
| Dette / PIB 2038 ; 2058, macro prudente | | 284 % ; 705 % | 224 % ; 490 % | 178 % ; 326 % | 148 % ; 175 % (modèle : 145,7 % ; 157,6 %) |
| Fil de l'eau (aucun changement), référence ; prudente | | 160 % ; 247 % (2038 ; 2058) | | | 175 % ; 311 % (prudente) |

Lectures et réserves :

- « Bas » et « haut » cumulent tous les extrêmes à la fois : ce sont des bornes, pas des scénarios probables. Le central est une convention de recoupement (§ 2), pas une prévision.
- Écart de méthode pour notre système : la méthode simple donne 133 % en 2038 (le modèle : 132,6 %) mais 128 % en 2058 (le modèle : 113,4 %), car le modèle applique ensuite sa règle de dette stable, que la méthode simple n'a pas. Nous gardons les chiffres du modèle pour notre système et la méthode simple pour la comparaison ; l'écart de 2058 est de 14 points.
- **Comparabilité des prélèvements.** Notre hausse de 9,5 points (42,7 → 52,2) vient surtout de la réduction du déficit (4,5 points), des versements écrits en dépense (5,7 points) et de la santé (`sources/decomposition-prelevements-0811.md`). Ces biais d'écriture jouent peu pour LFI, dont les versements restent en dépense comme dans le droit actuel ; sa hausse mesurée (+2,7 points central) est donc plus proche d'une hausse nette. À déficit constant, nos prélèvements nets baisseraient d'environ 3 points ; ceux de LFI augmenteraient (calcul par différence ; non refait ici).
- **Variante « abrogation seule »** (retraites : 9 Md€ au lieu de 87, c'est-à-dire un mandat sans retraite à 60 ans) : solde net −259 / −93 / +23 Md€ (bas / central / haut). C'est la lecture la plus favorable du programme sur ce poste ; elle ne correspond pas à l'objectif écrit (« 60 ans avec 40 annuités, objectif sur un mandat »).
- **Année 1 sur le seul périmètre de LFI** (dépenses de 81,7 conservées, recettes recoupées) : −43,9 / −9,6 / +24,7. Le chiffre de LFI (+24,7) est la borne haute de cette règle.

## 6. Ce qui manque pour que le programme soit chiffrable, et ce qui est solide

**Manque** (mesures vagues ou sans paramètre) : taux et seuils des 14 tranches de l'IR ; taux de l'ISF renforcé ; taux de la « TVA grand luxe », de la taxe sur les transactions, de la taxe sur les superprofits ; calendrier de la retraite à 60 ans ; périmètre de la garantie d'autonomie (individuelle ou par ménage, avec quelles ressources) ; financement du « 100 % Sécu » et de la cotisation sociale universelle (assiette et taux) ; caractère obligatoire du service citoyen ; effectifs des recrutements annoncés (soignants, enseignants au-delà de 10 000, fonction publique) ; montant des revalorisations de métiers ; périmètre des nationalisations et prix de rachat ; règle d'indemnisation des actionnaires ; calendrier des mesures sur la BCE et des mesures européennes ; mécanisme de blocage des prix (qui supporte l'écart) ; financement du pôle public bancaire et traitement comptable (administrations publiques ou non).

**Solide** (paramètre explicite et vérifiable) : SMIC à 1 700 € net (écart de +17,8 % à janvier 2026) ; point d'indice +10 % (17 Md€ pour LFI, 20 Md€ au coût de 2 Md€ par point du dépôt) ; seuil de pauvreté à 1 337 € ; 200 000 logements publics par an ; 700 000 rénovations par an ; 10 000 postes d'enseignants par an ; 500 000 places d'accueil ; 10 000 places d'hébergement par an ; écart maximal de 1 à 20 ; plafond d'héritage de 12 M€ et exonération sous 150 000 € ; garantie d'impôt de 2 % sur les patrimoines de plus de 100 M€.

**Deux points qui dépassent le budget.** (1) Le droit de l'Union : la « suspension des règles des 3 % », la « désobéissance aux règles bloquantes » et la modification du statut de la BCE (traité sur le fonctionnement de l'Union européenne, article 123 ; LFI soutient que les rachats de dette « ne nécessitent pas de révision des traités ») sont des hypothèses de négociation, non chiffrées ; si elles échouent, le déficit total central de ce dossier (11 % du PIB) expose à la procédure de déficit excessif et à une prime de risque. (2) Les investissements du pôle public bancaire (100 Md€ par an, soit 3,4 points de PIB) : leur classement hors des administrations publiques dépend d'Eurostat (règle de classification des unités) ; ce classement n'est pas lu ici ⚠️.

## 7. Carte des convergences et des divergences avec notre manifeste

Catégories : **(1) accord** ; **(2) rapprochement** (à peu près la même chose) ; **(3) même fond, méthode différente** (même objectif, outils différents) ; **(4) divergence nette**, ou **absence de position équivalente** (précisée en ligne : l'absence d'une mesure dans un texte n'est pas une opposition). Références : programme LFI (liens du § 1) ; manifeste : `chapitres-v02/` (positions dans document de travail de l'atelier, non publié). Lecture limitée aux pages citées au § 1 ; elle ne dit rien de ce que les deux textes ne traitent pas.

| Thème | Sujet | Cat. | LFI | Manifeste | Réf. |
|---|---|---|---|---|---|
| Fiscalité | Progressivité de l'impôt sur le revenu | 3 | barème à 14 tranches (P2 ch2) | une courbe continue, sans seuil ni tranche | ch. 2 et 3 |
| Fiscalité | Capital imposé comme le travail | 2 | suppression de la flat tax | « le travail n'est plus pénalisé par rapport à la rente » ; rentier à 5 000 € de dividendes : −28 % | ch. 3, intro |
| Fiscalité | Patrimoine | 3 | ISF renforcé et climatique ; garantie de 2 % pour les patrimoines > 100 M€ ; exit tax | contribution sur le patrimoine, 0,25 % de la résidence principale jusqu'à 1 M€, puis une courbe qui approche 3 % ; remplace la taxe foncière et l'IFI | ch. 3 |
| Fiscalité | Successions et donations | 2 | cumul des dons et héritages reçus ; plafond de 12 M€ ; exonération sous 150 000 € | « une fonction sur le cumul reçu » ; pas de plafond absolu lu ⚠️ | ch. 3 |
| Fiscalité | Niches fiscales | 2 | suppression des niches injustes, réductions en crédits d'impôt | suppression des niches de succession et des « petits cadeaux » ; conversion en salaire | ch. 3 |
| Fiscalité | Fusion CSG, cotisations, impôt | 2 | cotisation sociale universelle (part progressive) | contribution unique sur les revenus | P3 ch1 ; ch. 3 |
| Fiscalité | TVA | 4 | « TVA grand luxe » ajoutée | trois taux (5, 10, 20 %) ; deux logiques sans opposition de principe | ch. 3 |
| Fiscalité | Fraude et évasion | 3 | moyens du contrôle fiscal, fin de la CJIP, mesures unilatérales | règle simple, revenu réel calculé par l'État à partir des factures | P2 ch2 ; ch. 3 |
| Fiscalité | Impôt sur les sociétés | 4 | refonte progressive, taux modulé selon l'usage des bénéfices, impôt universel | IS conservé (position libérale, ch. 2) ; crédit d'IS dans le système (détail en ch. 3 ⚠️) | P2 ch2 ; ch. 2 |
| Protection sociale | Plancher de revenu | 3 | garantie d'autonomie à 1 337 € pour chacun | plancher unique de 877 € s'il paie un loyer, 627 € sinon, sans condition d'activité ; niveau inférieur au seuil de pauvreté (1 288 €, Insee 2023) | P3 ch1 ; ch. 4 |
| Protection sociale | Enfants et familles | 2 | crédit d'impôt par enfant pour toutes les familles ; fin du quotient conjugal ; ASF revalorisée | 200 € par mois par enfant, +250 € pour un parent seul | P2 ch2 ; ch. 4 |
| Protection sociale | Remboursement des soins | 2 | « 100 % Sécu », franchises supprimées | socle de soins à 100 % par la Sécurité sociale, complémentaires facultatives | P3 ch1 ; ch. 4 |
| Protection sociale | Chômage | 3 | indemnisation dès le premier jour, sur les derniers salaires | garantie de transition : 100 % du revenu au premier jour, baisse en douze mois, ouverte aux indépendants et démissionnaires | P3 ch1 ; ch. 4 |
| Protection sociale | Handicap | 3 | AAH « à hauteur du SMIC », corps de fonctionnaires pour les AESH | handicap reconnu en mairie et compensé par le même circuit que le reste | P3 ch2 ; ch. 4 |
| Retraites | Âge et durée | 3 | 60 ans à taux plein avec 40 annuités (objectif de mandat), abrogation de 2023 | départ libre dès 60 ans avec pension ajustée ; âge de référence lié à l'espérance de vie | P3 ch1 ; ch. 5 |
| Retraites | Minimum | 3 | pension de carrière complète au SMIC ; minimum vieillesse au seuil de pauvreté | minimum vieillesse au-dessus du plancher général | P3 ch1 ; ch. 5 |
| Retraites | Pensions élevées | 4 | aucune mesure équivalente lue (absence) | une seule courbe sur les pensions, rien sous 2 000 € nets, plafond à 42 % | ch. 5 |
| Retraites | Capitalisation | 4 | suppression des avantages fiscaux de la retraite par capitalisation | position du manifeste non relue pour ce dossier ⚠️ | P3 ch1 |
| Retraites | Grand âge, prix | 3 | réseau public à tarifs harmonisés | prix public unique, 90 % des revenus pour l'hébergement, reprise sur succession > 100 000 € | P3 ch2 ; ch. 5 |
| Retraites | Grand âge, statut des places | 4 | collectiviser les EHPAD privés à but lucratif | pas de nationalisation (objection traitée en ch. 5) | P3 ch2 ; ch. 5 |
| Santé | Financement de l'hôpital | 3 | sortie de la T2A, ONDAM remplacé par un objectif de besoins | hôpital jugé sur l'attente et les délais, allègement administratif | P4 ch4 ; ch. 10 |
| Santé | Médicaments | 3 | pôle public, nationalisation de filiales critiques | stocks obligatoires, achats européens groupés, prix plancher des vieux médicaments | P4 ch4 ; ch. 10 |
| Santé | Accès aux soins | 3 | centres de santé publics en exercice salarié | cabinet partagé par commune classée désert médical, liberté d'installation conservée | P4 ch4 ; ch. 10 |
| Santé | Psychologues | 2 | conventionnement, remboursement à 100 % | psychologue dans le cabinet partagé | P4 ch4 ; ch. 10 |
| Travail | SMIC | 4 | 1 700 € net immédiatement | pas de hausse du SMIC ; plancher + fonction des revenus (célibataire au Smic : +82 €, +4,9 %) | P2 ch2 ; ch. 3 et intro |
| Travail | Durée du travail | 4 | 35 h, 32 h métiers pénibles, 6e semaine de congés (absence de position équivalente) | pas de position lue dans les chapitres | P3 ch1 |
| Travail | Encadrement de l'emploi | 4 | quotas de contrats précaires, interdiction de licenciements économiques si dividendes ou aides, écart de 1 à 20 | ligne libérale sur l'économie ; pas de mesure équivalente | P3 ch1 ; P2 ch2-3 ; ch. 2 |
| Travail | Perte d'emploi | 3 | garantie d'emploi (embauche au moins au SMIC revalorisé) | garantie de revenu de transition, pas d'emploi garanti | P3 ch1 ; ch. 4 |
| Travail | Statut des actifs | 3 | sécurité sociale professionnelle (maintien du revenu en reconversion) | statut unique de l'actif | P3 ch1 ; ch. 4 |
| Logement | Offre | 3 | 200 000 logements publics par an, aides aux HLM | permis automatique pour un projet conforme (silence vaut accord) | P5 ch3 ; ch. 6 |
| Logement | Loyers | 3 | garantie universelle des loyers ; encadrement (non relu en détail) | plafond par formule publique, à partir de 1,3 fois le loyer médian, nouveaux baux seulement | P5 ch3 ; ch. 6 |
| Logement | Aides | 3 | APL +10 % | part logement du plancher (250 €) versée à qui paie un loyer | P2 ch2 ; ch. 4 et 6 |
| Logement | Garantie des loyers | 2 | garantie universelle des loyers | garantie de loyer attachée au bail sur la plateforme | P5 ch3 ; ch. 6 |
| Logement | Taxes foncières et logements vacants | 2 | taxe foncière progressive, taxe unique sur les logements vacants | contribution progressive sur le patrimoine, qui remplace la taxe foncière | P5 ch3 ; ch. 3 |
| Écologie et énergie | Rénovation et passoires | 3 | 700 000 rénovations par an financées par le public | plafond de loyer qui baisse avec la mauvaise performance, prêt adossé aux loyers pour le fioul rural | P1 ch3 ; ch. 6 |
| Écologie et énergie | Prix du carbone, interdictions | 3 | planification, droits de douane écologiques, ISF climatique, fin des subventions fossiles | « un prix calibré sur le dommage » plutôt que l'interdiction ; recette partagée | P1, P2 ; ch. 2 |
| Écologie et énergie | Subventions fossiles | 2 | « Arrêter les subventions aux énergies fossiles » | taxes sur ce qui pollue, pas d'interdiction | P1 ch3 ; ch. 3 |
| Écologie et énergie | Transports | 3 | renationaliser la SNCF, plan vélo, maillage dense | transports urbains gratuits pour tous | P1 ch3 ; ch. 7 |
| Écologie et énergie | Énergie, actifs stratégiques | 3 | renationaliser Engie et les autoroutes, tarifs réglementés | barrages publics hors concession ; liste fermée de critères pour les actifs stratégiques ; réacteurs EPR2 plafonnés en coût | P1 ch3 ; ch. 2 et 11 |
| Démocratie et institutions | Décision par les citoyens | 3 | constituante, RIC, référendum obligatoire sur les traités | vote des lois par les citoyens quatre dimanches par an, 60 % pour adopter | P5 ch1 ; ch. 8 |
| Démocratie et institutions | Gouvernement et Parlement | 3 | 6e République, proportionnelle, fin du 49.3, vote à 16 ans | ministres élus par domaine, assemblée tirée au sort | P5 ch1 ; ch. 8 |
| Démocratie et institutions | Scrutin | 4 | vote obligatoire, vote blanc reconnu | mention pour chaque candidat ; vote en ligne avec papier maintenu | P5 ch1 ; ch. 8 |
| État et services publics | Démarches et administration | 4 | pas de mesure équivalente lue (absence) | une application unique, 173 démarches supprimées par calcul automatique | ch. 7 |
| État et services publics | Fonction publique | 4 | point d'indice +10 %, titularisation des contractuels | pas de hausse générale ; regroupement des compétences à l'intercommunalité, sans perte d'agent | P2 ch2 ; ch. 7 |
| État et services publics | Collectivités | 4 | DGF indexée, moratoire sur les fermetures de services | compétences de proximité confiées à l'intercommunalité (révision constitutionnelle) | P5 ch3 ; ch. 7 |
| État et services publics | Transparence des comptes | 3 | publicité des aides aux grandes entreprises, commission d'enquête | registre public de chaque euro dépensé, instance indépendante | P2 ch2 ; ch. 7 |
| Europe | Règles budgétaires | 4 | suspension des 3 %, désobéissance aux règles bloquantes | respect du cadre européen ; reconnaît que le déficit au-dessus de 3 % jusqu'en 2043 expose à la procédure | P6 ch1 ; ch. 13 |
| Europe | BCE et dette | 4 | rachats de dette, dette détenue en perpétuelle à taux nul, circuit du Trésor | pas de proposition équivalente lue | P2 ch3, P6 ch1 ; ch. 12 |
| Europe | Horizon institutionnel | 3 | « Se libérer du libéralisme en Europe », conditionnement de la contribution | « à terme une Europe fédérale » ; la France agit d'abord ; version européenne en préparation | P6 ch1 ; ch. 2, 14 |
| Sécurité et justice | Indépendance de la justice | 2 | limiter les remontées d'information individuelles ; police judiciaire sous l'autorité des magistrats | parquet indépendant, procureurs nommés par le CSM | P5 ch2 ; ch. 9 |
| Sécurité et justice | Contrôle de la police | 2 | autorité indépendante rattachée au Défenseur des droits ; récépissé de contrôle | autorité indépendante ; enregistrement de chaque contrôle d'identité ; caméras allumées | P5 ch2, P3 ch4 ; ch. 9 |
| Sécurité et justice | Libertés et surveillance | 2 | abroger l'état d'urgence permanent ; interdire la reconnaissance faciale généralisée | état d'urgence plafonné à trois mois ; pas de surveillance individuelle sans juge | P5 ch2 ; ch. 9 |
| Sécurité et justice | Moyens de la justice | 3 | aide juridictionnelle, suppression de la taxe de 50 €, sortie du « tout carcéral » | rattraper la médiane européenne : 4 300 juges et 14 000 agents ; priorité à l'enquête | P5 ch2 ; ch. 9 |
| Sécurité et justice | Armement de la police | 4 | interdire les tasers, grenades de désencerclement et LBD pour la police du quotidien ; démanteler BAC et BRAV-M | pas de position lue sur ces armes | P5 ch2 ; ch. 9 |
| Immigration | Nationalité et vote | 4 | droit du sol intégral ; vote des étrangers aux élections locales | pas de position lue ; la décision relève du vote des citoyens (ch. 8) | P3 ch4 ; ch. 8 |
| Immigration | Asile et rétention | 3 | abolir l'enfermement des mineurs en rétention | décision d'asile en trois mois | P3 ch2 ; ch. 9 |
| Économie et entreprises | Cadre général | 4 | « nouveau collectivisme » : pôles publics (banque, assurance), retour sur les privatisations, réquisition | « libéral sur l'économie » : marché, propriété, concurrence et IS restent ; exception : le stratégique, par critères publiés | P2 ch1 ; ch. 2 |
| Économie et entreprises | Distribution des profits | 4 | dividendes plafonnés aux bénéfices ; superprofits taxés | pas de plafond ; fiscalité du capital par la contribution | P2 ch2-3 ; ch. 3 |
| Économie et entreprises | Aides aux entreprises | 3 | conditionnalité écologique et sociale des aides, publicité des montants | suppression des niches et du CIR capté par des intermédiaires ; transparence des dépenses | P2 ch2-3 ; ch. 7 et 11 |
| Économie et entreprises | Recherche | 3 | supprimer le CIR au profit de dotations récurrentes, supprimer l'ANR | licences ouvertes, entreprise d'État de la technologie par regroupement, CIR réorienté | P4 ch2 ; ch. 11 |
| Économie et entreprises | Industrie, protection commerciale | 4 | plan de reconstruction industrielle, droits de douane écologiques, taxe kilométrique aux frontières, antidumping | pas de position équivalente lue (chapitre européen à venir) | P1 ch2, P2 ch2 ; ch. 11 |

Bilan (comptage de ce tableau, 61 lignes, ⚠️ à recompter si le tableau est modifié) : accord : 0 ligne ; rapprochement : 13 ; même fond, méthode différente : 29 ; divergence nette ou absence de position équivalente : 19. **Aucun sujet n'est classé en accord strict** : les textes ne s'écrivent pas dans les mêmes unités (courbes contre barèmes, prix contre plan). Réserve de lecture : cette carte repose sur des résumés du programme (extraits de pages lus par un outil de lecture, pas sur la lecture intégrale) et sur les résumés « L'essentiel » du manifeste ; elle est à relire par l'auteur avant tout usage. Elle compare des textes, pas des effets : deux mesures de même catégorie peuvent avoir des effets très différents sur les comptes (voir § 5).

## 8. Steelman

**Les meilleurs arguments en faveur du programme** (formulés comme ses partisans les formulent).

1. *La consolidation par la dépense a un coût en activité.* L'austérité de 2010-2014 a été suivie en Espagne et au Portugal de baisses de PIB (document de LFI, p. 17-18) ; le FMI a lui-même relevé des multiplicateurs plus élevés en bas de cycle (Blanchard et Leigh, 2013 ⚠️ non relu pour ce dossier). Si le multiplicateur est supérieur à 1 en période de sous-emploi, la grille du § 3 montre un solde net bien meilleur (−94 au lieu de −153 à m = 1) ; à m = 1,5 le déficit reste élevé (−39) mais l'écart au fil de l'eau se resserre.
2. *Le déficit actuel vient en partie des recettes.* Le document de LFI rappelle que les recettes ont baissé de 2,1 points de PIB depuis 2017 (Insee) ; rétablir une partie de ces recettes sur les plus hauts revenus et patrimoines est un choix de répartition défendable, dont la faisabilité dépend de l'assiette et de l'évitement, pas d'une impossibilité de principe.
3. *Un besoin d'investissement public réel.* Le rapport Pisani-Ferry et Mahfouz chiffre 37 Md€ d'investissement public supplémentaire d'ici 2030 pour la transition (cité par LFI) ; ne pas financer ces investissements a aussi un coût (16 Md€ de dégâts climatiques cités par LFI pour 2026, non recoupés).
4. *Le coût de la dette n'est pas le seul coût.* La charge de la dette est de 2,9 % du PIB en 2027 selon LFI (non recoupé), loin du maximum de 1996-2004 ; une dette en monnaie nationale qu'une banque centrale peut soutenir est moins fragile qu'une dette en monnaie étrangère (argument défendu, non chiffré ici).
5. *Les dépenses ne sont pas toutes des coûts nets.* La cantine gratuite, les crèches, la santé, l'éducation ont des retours (emploi des mères, santé, productivité) que le modèle simple ne compte pas ; une part des « nouvelles dépenses » remplace des dépenses privées (mutuelles : 46,5 Md€ de cotisations aujourd'hui, comme dans notre propre système).
6. *Les chiffrages d'adversaires sont orientés.* L'Institut Montaigne ne retient aucun changement de comportement et écarte des recettes de fraude (26 Md€) que LFI juge réalistes ; ses financements sont exclusivement privés (publié par l'institut). Notre règle de recoupement donne à LFI sa borne haute telle quelle.

**Ce qui peut être retourné contre nous** (nos propres chiffres, par la même méthode).

1. *Notre mesure officielle des prélèvements monte de 9,5 points (42,7 → 52,2 %), bien plus que celle de LFI (+2,7 points au central).* Nous expliquons cet écart par trois biais d'écriture (`decomposition-prelevements-0811.md`) ; un lecteur hostile retiendra le chiffre brut. Notre explication est vérifiée par une identité comptable (reste nul), mais l'écriture « brute » des versements est un choix de présentation qu'un adversaire peut nommer.
2. *Notre déficit reste au-dessus de 3 % jusqu'en 2043,* donc incompatible avec la règle européenne dans la période (ch. 13) ; nous citons ce fait nous-mêmes. LFI assume la désobéissance à la règle ; nous, non : notre propre trajectoire expose pourtant à la procédure de déficit excessif.
3. *Nos hausses reposent aussi sur l'assiette de grands patrimoines et de hauts revenus* (taux marginal du haut de 67 %, patrimoine jusqu'à 3 %, retraités à partir de 3 090 € de pension) ; les critiques d'exil et d'érosion appliquées à la taxe Zucman le sont aussi à nos leviers ; notre propre dossier d'exil (`sources/exil-patrimoines-preuves.md`) en est la réponse, non un démenti.
4. *Notre dette plafonne à 133 % du PIB* : nous ne la réduisons pas ; LFI écrit viser une stabilisation en un quinquennat ; la comparaison porte sur la crédibilité des deux trajectoires, pas sur le niveau.
5. *Nos propres lignes de calcul ont des bornes larges* (leviers de 48,7 à 66,8 Md€ selon les nouvelles lignes) ; nous appliquons ici à LFI la même règle de bornes, ce qui élargit aussi notre incertitude affichée.
6. *Notre dépense publique monte de 57,0 à 61,4 % du PIB,* contre 66,7 % au central pour LFI : l'écart est réel, mais l'ordre de grandeur de notre hausse est lui aussi un fait que l'on peut lire sans nuance.

## 9. Sources mobilisées, cotes et conflits d'intérêts

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts / orientation |
|---|---|---|---|
| [LFI, « Comment nous allons remettre de l'ordre dans les comptes publics », octobre 2026](https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf) | chiffres de 2027 (106,4 ; 81,7 ; 24,7 ; 100 Md€ du pôle bancaire) | D | document de campagne ; dit ne pas chiffrer le programme complet |
| [LFI, L'Avenir en commun](https://melenchon2027.fr/programme/livre/) | mesures, paramètres, citations (§ 1) | D | texte partisan ; source primaire de ce qui est proposé |
| [Institut Montaigne, synthèse 2022 Mélenchon](https://www.institutmontaigne.org/presidentielle-2022/jean-luc-melenchon/synthese) | 331,6 ; 112,7 ; −218,9 ; 85,8 ; ISF + flat tax ≈ 5 ; IR ≈ 12 ; succession 9 ; TTF 9 ; impôt universel 18 | C | financé par des entreprises ; méthode publiée ; sans comportement ; programme 2022 |
| [Institut Montaigne, NFP 2024](https://institutmontaigne.org/communiques-de-presse/legislatives-2024-chiffrage-global-des-programmes) | déficit +179 ; hypothèses | C | idem |
| [Public Sénat, 14/10/2026](https://www.publicsenat.fr/actualites/politique/presidentielle-2027-jean-luc-melenchon-table-sur-106-milliards-de-recettes-supplementaires-et-82-milliards-de-depenses-nouvelles-pour-2027) | date et contenu de la conférence de presse | C | presse (chaîne publique) |
| Insee Première n° 2063, [lien Insee](https://www.insee.fr/fr/statistiques/8600989) | pauvreté 2023 | A | statistique publique ; lu par résumé de moteur de recherche |
| [info.gouv.fr, SMIC 2026](https://www.info.gouv.fr/public/index.php/actualite/le-smic-revalorise-au-1er-janvier-2026) | 1 823,03 € brut ; 1 443,11 € net | A | gouvernement ; lu par résumé de moteur de recherche |
| Insee, comptes des administrations publiques 2024, t. 3.201, 3.216-3.217 (via `bilan_global.py`) | PIB, déficit, intérêts, PO, dépense | A | statistique publique |
| [Institut de l'entreprise, « Taxe Zucman 2026 »](https://www.institut-entreprise.fr/wp-content/uploads/2026/06/TCT_Taxe-Zucman-2026.pdf) | ≈ 5,5 Md€ après déduction de l'IS (via moteur de recherche, non lu) | C | think tank financé par des entreprises |
| LCP, Moneyvox, IFRAP, Asterès, Institut Rousseau, OFCE (via moteur de recherche, non lus en primaire) | chiffrages et critiques du NFP 2024, multiplicateur | C à B | voir § 4 |
| Banque des Territoires (via moteur de recherche) | 6,6 Md€ publics pour 470 000 places de crèche ; 19 450 € par place | B | groupe Caisse des dépôts ; origine du chiffre de coût à vérifier |

**Ce que ces sources établissent ensemble.** Faits : le contenu du programme, les chiffres de 2027 de LFI, les données Insee. Estimations : tous les montants de régime (méthodes au § 2 et dans le script). Opinions : aucune n'est formulée par l'auteur du dossier ; les jugements de LFI et de ses critiques sont attribués.

**Vérifications.** V31000 à V31013 ajoutées à `verifications.md` ; V31020 à V31030 pour le banc d'essai.
