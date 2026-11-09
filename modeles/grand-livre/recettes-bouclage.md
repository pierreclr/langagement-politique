---
titre: Grand livre (T65) : recettes des administrations publiques, bouclage 2024
statut: livré le 06/11/2026 (chantier recettes) ; vérifications V16400 à V16407
---

# Recettes des APU 2024 : bouclage au total Insee

Fichier : [`recettes.csv`](recettes.csv) (82 lignes, préfixe `GL-REC-`, séparateur « ; »). Code : [`code/recettes.py`](code/recettes.py) (relançable : `python3 -I modeles/grand-livre/code/recettes.py --csv`, avec la lecture XLSX de [`code/xlsx_lecture.py`](code/xlsx_lecture.py)).

Sources (cote A, comptes nationaux base 2020, millésime de mai 2026, fichiers lus localement dans `$DONNEES/sources/apu/brut/`, consultés le 06/11/2026) : Insee, [3.201](https://www.insee.fr/fr/statistiques/fichier/8988845/t_3201_fr.xlsx), 3.203, 3.204, 3.205, 3.212 (recettes par sous-secteur), 3.215, [3.216](https://www.insee.fr/fr/statistiques/fichier/8988845/t_3216_fr.xlsx) et [3.217](https://www.insee.fr/fr/statistiques/fichier/8988845/t_3217_fr.xlsx) (prélèvements par impôt). Aucun conflit d'intérêts connu (statistique publique).

Colonnes ajoutées au schéma commun (en fin de ligne) : `perimetre` (`APU` : compté dans les recettes des APU ; `PO_seulement` : compté dans les prélèvements obligatoires mais pas dans les recettes des APU ; `memo_credit` : ligne mémo non additive) et `ref_inventaire` (identifiants de `sources/donnees/impots_inventaire.csv`).

## 1. Bouclage

| Contrôle | Lignes du fichier | Total Insee | Écart |
|---|---|---|---|
| Total des recettes des APU (3.201, 2024) | 1 503,471 | 1 503,471 | 0,000 |
| Impôts et cotisations sociales des APU (3.201) | 1 322,290 | 1 322,290 | 0,000 |
| Prélèvements obligatoires (3.217 : lignes APU + droits UE 2,6 − cotisations imputées 51,242 − crédits d'impôt 19,624) | 1 254,024 | 1 254,024 | 0,000 |

L'écart est nul parce que les agrégats que l'Insee ne détaille pas sont des **lignes de résidu explicites** (statut `calcul` : 6 résidus pour 7,366 Md€ au total, soit 0,049 D212 ; 0,247 D214 ; 2,118 D29 ; 3,276 D51 ; 1,025 D59 ; 0,651 D91 ; plus 3 lignes, TGAP, agences de l'eau et octroi de mer, dont le montant Insee est diminué de la part que l'Insee classe ailleurs). Le bouclage « dur » porte donc sur la structure (chaque ligne nommée vient de l'Insee), pas sur une somme libre.

### Par nature SEC 2010 (APU consolidées, Md€)

| Nature | Lignes | Insee | Écart |
|---|---|---|---|
| D211 TVA | 207,753 | 207,753 | 0 |
| D212 impôts sur les importations (hors 2,6 de droits UE) | 0,706 | 0,706 (3,306 − 2,6) | 0 |
| D214 impôts sur les produits | 117,727 | 117,727 | 0 |
| D29 autres impôts sur la production (D291 58,131 + D292 71,816) | 129,947 | 129,947 | 0 |
| **D2 impôts sur la production et les importations** | **456,133** | 456,133 | 0 |
| D51 impôts courants sur le revenu | 358,823 | 358,823 | 0 |
| D59 autres impôts courants | 6,860 | 6,860 | 0 |
| **D5** | **365,683** | 365,683 | 0 |
| D91r impôts en capital | 21,470 | 21,470 | 0 |
| D61 cotisations sociales (effectives 432,389 + imputées 51,242) | 483,631 | 483,631 | 0 |
| D995r non recouvrables nets | −4,627 | −4,627 | 0 |
| Production et ventes (P11 79,513 ; P12 32,012 ; P13 partiel 14,606 ; D39 1,005) | 127,136 | 127,136 | 0 |
| D4 revenus de la propriété (D41 5,381 ; autres 16,820) | 22,201 | 22,201 | 0 |
| D7 hors D73 | 20,820 | 20,820 | 0 |
| D9r hors D91r | 11,024 | 11,024 | 0 |
| **Total** | **1 503,471** | 1 503,471 | 0 |

### Par sous-secteur, avant consolidation (3.201, 3.203, 3.204, 3.205, 3.212 ; Md€ 2024)

| Nature | État | ODAC | APUL | ASSO | Somme | Consolidé S13 | Élimination |
|---|---|---|---|---|---|---|---|
| Production et ventes | 8,117 | 42,898 | 49,077 | 27,044 | 127,136 | 127,136 | 0 |
| Revenus de la propriété (D4) | 10,131 | 3,027 | 4,379 | 5,674 | 23,210 | 22,201 | −1,009 |
| D2 | 144,280 | 20,673 | 170,744 | 120,436 | 456,133 | 456,133 | 0 |
| D5 | 188,393 | 0,589 | 3,632 | 173,069 | 365,683 | 365,683 | 0 |
| D91r | 21,470 | 0 | 0 | 0 | 21,470 | 21,470 | 0 |
| D733 (transferts de recettes fiscales) | −9,948 | 0 | 9,818 | 0,130 | 0 | 0 | 0 |
| D61 (dont imputées 48,240 État) | 56,237 | 0,700 | 0,906 | 425,788 | 483,631 | 483,631 | 0 |
| D995r | −0,515 | 0 | 0 | −4,112 | −4,627 | −4,627 | 0 |
| D73 transferts courants entre APU | 15,498 | 55,170 | 50,707 | 24,516 | 145,891 | 0 | −145,891 |
| D7 hors D73 | 8,155 | 3,565 | 4,137 | 4,963 | 20,820 | 20,820 | 0 |
| D9r hors D91r | 7,812 | 14,616 | 19,291 | 0,920 | 42,639 | 11,024 | −31,615 |
| **Total des recettes** | **449,630** | **141,238** | **312,690** | **778,428** | **1 681,986** | **1 503,471** | **−178,515** |

Les quatre totaux de sous-secteur retombent à l'euro sur le tableau 3.215 (449,630 ; 141,238 ; 312,690 ; 778,428). **L'élimination des flux entre APU est entièrement expliquée** : 145,891 (D73) + 31,615 (D9 en capital) + 1,009 (D41 intérêts) = 178,515, écart 0,000 ; le D733 est de somme nulle. Les 145,9 Md€ de D73 sont la contrepartie, côté recettes, des transferts que les chantiers de dépenses doivent marquer `flux_inter_apu`.

Prélèvements obligatoires par sous-secteur (3.216, 2024) : État 332,053 (impôts 324,056 ; cotisations 7,997) ; ODAC 21,262 ; APUL 184,194 ; ASSO 713,915 (impôts 292,442 ; cotisations 421,473) ; UE 2,600 ; total 1 254,024 (somme vérifiée).

## 2. V15401 tranchée : où l'Insee classe les contributions formation (11,4 Md€)

**Réponse (fait, cote A)** : le tableau 3.217 (2024) range la ligne « Contributions pour la formation professionnelle et l'apprentissage » (11,426 Md€) sous **D291 « Impôts sur les salaires et la main-d'œuvre »** (58,131), donc dans les **autres impôts sur la production (D29)**. Elle n'est **pas** dans les cotisations sociales (D61 : 483,631 = effectives 432,389 + imputées 51,242, sans cette ligne). Même rangement, dans D291, pour : taxe sur les salaires 17,315 ; versement mobilité 12,244 ; forfait social 6,300 ; FNAL 2,935 ; contribution solidarité autonomie 2,468 ; PEEC 1,504 ; AGS 1,538 ; stock-options 1,033.

Dans le bilan (`bilan_global.py`) :
- **hors de P01** (432,4 = D61 effectives à 0,011 près d'arrondi) ;
- **hors de P06** (46,3 = taxe sur les salaires 17,3 + VM 12,2 + CFE 7,7 + C3S 5,2 + CVAE 3,9 ; somme exacte 46,363) ;
- donc **dans P11** « reste conservé » : les 11,426 sont perçus après réforme. Ils sont conservés **sans réforme voulue** : c'est un reste, pas une décision.
- Conséquence : l'hypothèse « supprimé sans compensation » du registre était fausse dans les deux hypothèses (cf. précision du 06/11) ; la bonne lecture est « conservé dans P11 ». La dépense jumelle (formation, alternance) est fondue dans D15 (aide à l'apprentissage supprimée 4,6) et D27 ; le financement de France compétences reste donc perçu alors que son emploi est en partie supprimé : cohérence à arbitrer (`sort = à_arbitrer`, ligne GL-REC-033).
- Composition fine de la ligne Insee non lue en détail (CUFPA, solde de la taxe d'apprentissage, CPF-CDD, CSA, formation continue résiduelle) : l'inventaire donne 8,998 (CUFPA, 2022) + 0,5 + 0,301 + 0,311 ≈ 10,1 Md€ à millésimes mélangés, soit ≈ 1,3 Md€ de moins que l'Insee 2024 ⚠️ V16407.

## 3. Remboursements et dégrèvements (147,1 Md€ du budget de l'État)

Chiffre : `modeles/depenses/controles_etat.md` : P200 (remboursements et dégrèvements d'impôts d'État, 142,7 Md€) + P201 (impôts locaux, 4,4 Md€) = **147,141 Md€** de CP du PLF 2025 (somme recalculée sur `lignes_etat.csv` : 147,140796). Décomposition P200 : 200-11 « mécanique de l'impôt » 110,2 (restitutions de TVA, d'IS, etc.), 200-13 « gestion des produits » 13,7, 200-12 « politiques publiques » 18,8 ; P201 : 4,4.

Traitement en comptabilité nationale, tel que lu dans les comptes de l'Insee 2024 :
1. **Remboursements « mécaniques » et dégrèvements de gestion** : les recettes d'impôts des tableaux 3.201 et 3.217 sont des recettes **nettes** (les restitutions de TVA ou d'IS viennent en déduction de l'impôt, ex. TF 43,26 Md€ chez la DGCL contre 42,94 chez l'Insee, `bilan_global.py` l. 780). Ces ≈ 128 Md€ ne sont **ni une dépense** ni une recette à part : les lignes `lignes_etat.csv` correspondantes sont à juste titre marquées « hors dépense APU ».
2. **Crédits d'impôt** (celles des 147 Md€ qui sont des politiques publiques, dans P200-12 : 18,821 Md€) : l'Insee les enregistre en **dépenses** (3.201 : « crédits d'impôts enregistrés en dépenses » **19,771**) et en recettes **brutes** (3.201 : « crédits d'impôts enregistrés en recettes » **19,624**, soit 6,722 + 2,163 sur l'IRPP et 4,146 + 6,593 sur l'IS ; les deux parties, utilisées en déduction de l'impôt dû ou payées au-delà, sont traitées de la même façon). Les prélèvements obligatoires, eux, sont nets de ces crédits (3.217 : IV = −19,624).
3. **Ce que fait le bilan** : `RECETTES_AVANT = 1 672,6 − 169,1 = 1 503,5` est le total Insee (brut des crédits, net des remboursements mécaniques) ; les crédits sont donc **dans les dépenses du total Insee (19,771)** et **dans les recettes (brutes)**. Le bilan **ne compte pas les 147 Md€ en dépense** (aucune ligne `dep` ne les porte) et **ne les compte pas deux fois en recette** : P11 est calculé sur les PO nets (donc −19,624 dedans) et la ligne `HORS_PO_AVANT` (= recettes − PO = 250,226) contient **+19,624** qui rétablit le brut (décomposition au § 5). Verdict : **pas de double compte**, mais une présentation qui cache 19,6 Md€ dans deux lignes qui se compensent.
4. **Point d'interface pour le chantier État (dépenses)** : `lignes_etat.csv` classe tout P200 (dont les 18,821 de P200-12) en « hors dépense APU », alors que l'Insee compte **19,771 Md€ de crédits d'impôt en dépenses**. Si le grand livre des dépenses ne remet pas ≈ 19,8 Md€ de crédits d'impôt (dont CIR 8,0, dont les crédits IR 8,885), la dépense consolidée sera sous-évaluée de ce montant face à des recettes brutes. À intégrer comme ligne explicite côté dépenses (nature SEC D3/D9 ; montants Insee 3.201). ⚠️ V16401.

## 4. Rapprochement avec `bilan_global.py` (lignes P)

| Ligne bilan | Montant bilan | Insee 3.217 (exact) | Écart | Remarque |
|---|---|---|---|---|
| P01 cotisations effectives | 432,4 | 432,389 | 0,011 | arrondi |
| P02 CSG | 153,1 | 153,148 | −0,048 | arrondi ; hors CSG sur les jeux (classée D214) |
| P03 IRPP | 96,0 | 96,018 | −0,018 | **la note du bilan cite des crédits IR de 10,7 : l'Insee donne 8,885 (6,722 + 2,163)** |
| P04 prélèvement de solidarité | 14,6 | 14,647 | −0,047 | arrondi (PLF : 14,991) |
| P05 CRDS | 9,1 | 9,070 | 0,030 | arrondi |
| P06 impôts de production | 46,3 | 46,363 | −0,063 | arrondi |
| P07 taxe foncière | 42,9 | 42,940 | −0,040 | arrondi |
| P08 IFI | 2,7 | 2,682 | 0,018 | arrondi |
| P09 mutations à titre gratuit | 20,8 | 20,819 | −0,019 | arrondi |
| P10 IS | 68,0 | 67,955 | 0,045 | **la note cite des crédits IS de 8,9 : l'Insee donne 10,739 (4,146 + 6,593)** : les deux notes sont inversées |
| P11 reste | 367,345 | 367,993 | −0,648 | PO du bilan = 42,7 % × 2 935 = 1 253,245 contre 1 254,024 Insee (−0,779) ; arrondis de P01-P10 (+0,131) |

Somme P01-P10 : bilan 885,9 ; Insee 886,031.

### Ce que contient P11 (367,993 Md€, base prélèvements obligatoires)

| Composante | Md€ |
|---|---|
| TVA (D211) | 207,753 |
| Impôts sur les produits (D214) : accises, DMTO 14,742 dans les droits d'enregistrement 17,199, TSCA, jeux, etc. | 117,727 |
| Droits d'importation (D212 : octroi de mer 0,657 ; résidu 0,049 ; droits UE 2,6) | 3,306 |
| Impôts sur la production non supprimés (D29 hors P06 et P07) | 40,644 |
| dont groupe « assis sur la masse salariale » (CUFPA 11,426 ; forfait social 6,300 ; FNAL 2,935 ; CNSA 2,468 ; PEEC 1,504 ; AGS 1,538 ; stock-options 1,033) | 27,204 |
| dont autres (IFER 2,212 ; quotas carbone 2,113 ; consulaires 1,271 ; TASCOM 1,268 ; véhicules 1,145 ; bureaux 1,055 ; TSE 0,724 ; producteurs d'électricité 0,681 ; GEMAPI 0,532 ; TGAP 0,038 ; eau 0,283 ; résidu 2,118) | 13,440 |
| Impôts courants sur le revenu non supprimés (D51 : remises pharmaceutiques 9,659 ; RCM 3,884 ; CSB 1,166 ; résidu 3,276) | 17,985 |
| Autres D59 (taxe d'habitation 3,153 ; résidu 1,025) | 4,178 |
| D91 non détaillé | 0,651 |
| Non recouvrables (D995r) | −4,627 |
| Crédits d'impôt (soustraits dans les PO) | −19,624 |
| **Total** | **367,993** |

Le libellé de P11 (« TVA, accises, DMTO et autres prélèvements maintenus ») est donc trompeur : 40,6 + 18,0 + 4,2 Md€ de recettes de nature « impôt de production » ou « impôt sur le revenu » y restent sans décision explicite, et −24,2 d'ajustements comptables.

### Passage des recettes hors prélèvements (`HORS_PO_AVANT` = 250,226)

Recettes non fiscales (production, propriété, transferts) 181,181 + cotisations imputées 51,242 + crédits d'impôt rétablis en brut 19,624 − droits UE comptés dans les PO mais pas dans les APU 2,600 + arrondi du PIB 0,779 = **250,226** (écart 0,000). La ligne n'est donc pas « 250 Md€ de recettes diverses » : 69,0 sont des conventions de passage PO / recettes des APU.

## 5. Sort de chaque ligne (APU, Md€ de `recettes.csv`)

| Sort | Montant | Contenu |
|---|---|---|
| remplacé:fonction_revenus | 705,272 | cotisations effectives 432,389 ; CSG 153,148 ; IRPP 96,018 ; PS 14,647 ; CRDS 9,070 (= P01 à P05) |
| remplacé:fonction_patrimoine | 83,640 | TF 42,940 ; DMTG 20,819 ; DMTO et droits d'enregistrement 17,199 (la perte est portée par N08, pas par P11) ; IFI 2,682 |
| supprimé | 46,363 | P06 : taxe sur les salaires, VM, CFE, CVAE, C3S |
| reste | 629,938 | TVA, accises, IS 67,955, impôts divers ; cotisations imputées 51,242 ; recettes non fiscales 181,181 ; D995r |
| à_arbitrer | 38,258 | voir ci-dessous (conservés dans P11 par défaut) |

Le code ne distingue pas `fondu:…` : aucune recette n'est fondue ailleurs, la recette est soit remplacée, soit conservée, soit supprimée.

Lignes `à_arbitrer` (38,258 Md€) : groupe masse salariale 27,204 (CUFPA 11,426 ; forfait social 6,300 ; FNAL 2,935 ; CNSA 2,468 ; PEEC 1,504 ; AGS 1,538 ; stock-options 1,033) ; assiettes immobilières ou adossées à la taxe foncière supprimée 4,017 (taxes sur services de logement et constructions 1,706 ; bureaux 1,055 ; TSE 0,724 ; GEMAPI 0,532) ; revenus de capitaux mobiliers 3,884 ; taxe d'habitation sur résidences secondaires 3,153. Le bilan les conserve toutes dans P11 (colonne `montant_apres` = montant actuel).

## 6. Doublons et incohérences suspects dans `bilan_global.py` (non modifié)

| # | Ligne(s) | Montant | Nature |
|---|---|---|---|
| 1 | P11 (GL-REC-057, prélèvements sur revenus de capitaux mobiliers) et N02 | 3,884 | **doublon d'assiette suspect** : le capital courant est taxé à 42 % par N02, alors que l'impôt sur les revenus de capitaux mobiliers reste perçu dans P11 |
| 2 | P11 (GL-REC-063, taxe d'habitation résidences secondaires et logements vacants) et N07 / P07 | 3,153 | **doublon d'assiette suspect** : la taxe de 1 % taxe l'immobilier, la taxe d'habitation reste |
| 3 | P11 (D29 assis sur la masse salariale) et P01 / P06 | 27,204 | **incohérence de traitement** (pas un doublon) : les cotisations et deux impôts sur la masse salariale sont supprimés, ces sept contributions restent |
| 4 | P03 note « supprime l'impôt et ses crédits » et dépenses | 8,885 | **dépense orpheline** : les crédits d'impôt IRPP restent dans les dépenses Insee (19,771) alors que l'IRPP disparaît ; seul le CIR (8,0, D14) est retiré ; aucune ligne `dep` ne retire les 8,885 (ni les 2,7 de crédits IS hors CIR, justifiés tant que l'IS reste) |
| 5 | P03 et P10 (notes) | 10,7 / 8,9 | **notes inversées** : IRPP 8,885 ; IS 10,739 |
| 6 | P11 (remises pharmaceutiques 9,659, GL-REC-061) et D11 (médicaments, 3,4) | ≤ 3,4 | **interaction possible** : si les économies de médicaments passent par des prix plus bas, la remise (assise sur le chiffre d'affaires) baisse ⚠️ non chiffrée |
| 7 | P11 / `HORS_PO_AVANT` | 19,624 | **compensation cachée** : −19,624 (crédits) dans P11 et +19,624 dans HORS_PO ; correct, mais sans libellé |
| 8 | `PO_AVANT` | 0,779 | PO calculés à 42,7 % × 2 935 = 1 253,245 ; Insee 1 254,024 (42,723 %) ; l'écart tombe dans P11 |
| 9 | P01 (cotisations versées par les employeurs publics) | non chiffré | les cotisations patronales des APU (CNRACL 20,4 ; CAS Pensions hors budget général 7,1 ; inventaire 2025, lignes 289 et 291, cote C) sont à la fois une recette D61 supprimée et une dépense D1 de rémunération : la suppression retire la recette sans toucher D1 ⚠️ V16405 |

Vérifié sans doublon : DMTO (dans P11, la perte est portée seule par N08 « net de la recette actuelle ») ; TF des entreprises (16,738, impôt de production D29) comprise dans P07 et absente de P06 ; cotisations imputées 51,242 (recette fictive et dépense D122 jumelles, neutres) ; production pour emploi final propre 32,012 (recette fictive et dépense P51g jumelles, neutres) ; CSG sur les jeux (dans D214, ni dans P02 ni dans P05).

## 7. Rapprochement avec l'inventaire des prélèvements (`sources/donnees/impots_inventaire.csv`)

Cote C (inventaire du dépôt, millésimes mélangés 2022 à 2026) contre cote A (Insee) :
- 314 prélèvements comptés, **1 330,465 Md€** contre **1 329,517** (Insee, (I) avant non-recouvrement, crédits et cotisations imputées) : écart +0,947 (0,07 %), compensation de plusieurs erreurs de millésime, non analysée ligne à ligne ⚠️ V16406.
- Cotisations de l'inventaire : 457,4 Md€ (essentiellement 2025) contre 432,389 en 2024 (D61 effectives) : +25,0, cohérent avec une année de croissance de la masse salariale (non vérifié ligne à ligne).
- Lignes de l'inventaire qui ne sont pas des prélèvements Insee de 2024 : CEBG 8,0 (2025), CDHR 1,4 (2025), holdings 1,0 (2026), frais d'assiette et de recouvrement 2,127 (frais de gestion, doublon avec les impôts locaux), agrégats 1499 et 1799 (2,6).
- **Divergence de sort** : `devenir_modele` de l'inventaire (modèle du chapitre 9, prélèvement unique à 50 %) classe l'IS en « absorbé » ; le bilan v5.x à v7.2 le conserve (P10, puis F02 : IS unique à 25 %). L'inventaire n'est plus à jour du système v7 pour la colonne `devenir_modele` : à ne pas utiliser pour le grand livre.
- Chaque ligne principale de `recettes.csv` porte dans `ref_inventaire` les identifiants de l'inventaire qui la détaillent (une ligne Insee = une ou plusieurs lignes d'inventaire ; 82 lignes Insee contre 343 lignes d'inventaire : le grand livre suit le découpage de l'Insee, seul découpage qui boucle).

## 8. Lignes reconstituées (`statut_chiffre = calcul`)

| Id | Montant | Méthode |
|---|---|---|
| GL-REC-004 | 0,049 | D212 (3,306) − droits UE (2,6) − part de l'octroi de mer classée D212 (0,657) |
| GL-REC-028 | 0,247 | D214 − somme des lignes détaillées (après retrait des parts classées D212 et D29) |
| GL-REC-053 | 2,118 | D291 + D292 − somme des lignes − 0,321 (parts D29 de la TGAP et des agences de l'eau, classées par l'Insee dans D214) |
| GL-REC-062 | 3,276 | D51 − somme des lignes **hors crédits d'impôt** (les crédits sont une présentation, les recettes des APU sont brutes ; avec les crédits le résidu serait 22,9, incompatible avec 1 322,290 au total) |
| GL-REC-065 | 1,025 | D59 − taxe d'habitation − IFI |
| GL-REC-067 | 0,651 | D91r (21,470) − DMTG (20,819) |
| TGAP, agences de l'eau, octroi de mer | −0,038 ; −0,283 ; −0,657 | montants Insee diminués de la part classée ailleurs (champ `note`) |

Le rapprochement avec l'Insee est exact ; la nature des résidus (retenues à la source, CDHR, etc., voir inventaire lignes 6 à 8) n'est pas détaillée par l'Insee.

## 9. Questions ouvertes

1. **V16401** : les ≈ 19,8 Md€ de crédits d'impôt (Insee, en dépenses) doivent être remis dans le grand livre des dépenses de l'État alors que P200 est classé « hors dépense APU » (§ 3).
2. **V16402** : sort des 27,2 Md€ de contributions assises sur la masse salariale restées dans P11, dont les 11,4 de formation (D291) : à décider (supprimer avec les cotisations, ou garder comme financement du service rendu).
3. **V16403** : crédits d'impôt IRPP (8,885) conservés en dépense alors que l'IRPP est supprimé (P03 dit le contraire).
4. **V16404** : taxe d'habitation (3,153) et revenus de capitaux mobiliers (3,884) conservés dans P11 en doublon d'assiette avec N07 et N02.
5. **V16405** : cotisations des employeurs publics : recette D61 supprimée, dépense D1 inchangée.
6. **V16406** : écart inventaire / Insee (+0,947) non décomposé.
7. **V16407** : composition exacte de la ligne Insee 11,426 (CUFPA, taxe d'apprentissage, CPF-CDD, etc.) non lue ; l'inventaire en retrouve ≈ 10,1.
8. Les lignes `montant_apres_md_eur` suivent le bilan jusqu'à P11 (« reste ») ; les recettes nouvelles (N, F) sont des lignes de l'autre côté du grand livre, à intégrer par le chantier de synthèse : le fichier ne chiffre pas la v7.4.
