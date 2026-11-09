---
titre: Grand livre, ODAC (S13112) : bouclage au total Insee 2024
statut: v2 du 06/11/2026 (T65) ; 91,9 % du total hors éléments imputés couvert par des lignes nommées
code: modeles/grand-livre/code/odac.py (lignes et bouclage) et code/odac_jaune.py (extraction du jaune), python3 -I
verifications: V16100 à V16113
---

# ODAC : rapprochement au total Insee 2024

## 1. Total officiel

Insee, comptes nationaux annuels base 2020, tableau 3.204 (« Dépenses et recettes des ODAC, S13112 », `t_3204_fr.xlsx`, édition d'août 2026 ; cote A). **Total des dépenses 2024 : 142,631 Md€** (2025 : 142,266 ; 2023 : 137,650). Intérêts (D41), transferts courants entre administrations (D73) et transferts en capital (D9 hors D91, D995) sont consolidés des transferts internes au sous-secteur (note (*)) ; les autres flux internes (D3, D7 hors D73) ne le sont pas.

| Nature SEC | 2024, Md€ | Part |
|---|---|---|
| Consommation intermédiaire (P2) | 25,641 | 18,0 % |
| Rémunérations (D1) | 30,900 | 21,7 % |
| Autres impôts sur la production (D29) | 1,792 | 1,3 % |
| Intérêts (D41) | 1,895 | 1,3 % |
| Prestations sociales en espèces (D62) | 1,285 | 0,9 % |
| Transferts sociaux en nature (D632) | 0,473 | 0,3 % |
| Subventions (D3) | 11,104 | 7,8 % |
| Transferts courants entre APU (D73) | 12,941 | 9,1 % |
| Autres transferts courants (D7 hors D73) | 8,076 | 5,7 % |
| Transferts en capital (D9) | 14,782 | 10,4 % |
| Investissement (FBCF, P51g) | 33,143 | 23,2 % |
| Autres acquisitions d'actifs (P52, P53, NP) | 0,598 | 0,4 % |
| **Total** | **142,631** | écart des natures : 0,000 |

**Éléments imputés** (pas des dépenses en argent) : D122 0,700 ; P12 27,377 (production pour emploi final propre, comptée en rémunérations et consommations intermédiaires puis en P51g). **Dépenses hors éléments imputés : 114,553 Md€.** La comparaison avec des budgets d'organismes se fait sur ce dernier chiffre.

Tableau 7.304 (comptes détaillés ODAC, déjà en local) : même total, détaille la production (P11 9,85 ; P12 27,38 ; P13) et les opérations de répartition ; il n'ajoute pas de détail par organisme (lu, non exploité plus avant : voir V16111).

## 2. Résultat du bouclage (v2)

| | Md€ | Part du total | Part du hors imputés |
|---|---|---|---|
| Total Insee ODAC 2024 | 142,631 | 100 % | |
| Éléments imputés (GL-ODAC-098, fait Insee) | 28,077 | 19,7 % | |
| Hors éléments imputés | 114,553 | 80,3 % | 100 % |
| **Lignes nommées (166 organismes, 105,300)** | 105,300 | 73,8 % | **91,9 %** |
| « Autres ODAC » par différence (GL-ODAC-099, reconstituée) | 9,253 | 6,5 % | 8,1 % |
| Écart non expliqué | 0 par construction | | |

Les 105,3 se décomposent ainsi : 164 organismes du jaune « Opérateurs de l'État » PLF 2025 (budget initial 2024) présents dans la liste Insee, plus SNCF Réseau (15,7), les OPCO (12,45) et l'ANRU (2,1), qui ne sont pas dans le jaune. Les 20 plus gros (87,1 Md€) : universités et assimilés 18,21 ; SNCF Réseau 15,70 ; OPCO 12,45 ; CEA 7,42 ; France compétences 4,64 (nette) ; AFITF 4,61 ; CNRS 4,06 ; ANAH 4,00 ; ANRU 2,10 ; CNES 1,99 ; autres opérateurs de l'ESR 1,65 ; écoles d'ingénieurs 1,62 ; ANR 1,32 ; INSERM 1,24 ; ADEME 1,22 ; AEFE 1,21 ; INRAE 1,18 ; CNC 0,86 ; ARS 0,83 ; AFPA 0,78.

**Comment lire le chiffre de 8,1 % « par différence ».** Ce n'est pas un montant manquant : il mélange des budgets initiaux (jaune) et des dépenses constatées (Insee), des montants bruts et nets des transferts internes à l'ODAC (ANR vers universités, AFITF vers SNCF Réseau, ANAH, non isolés : plusieurs Md€ comptés deux fois dans les lignes nommées, ce qui sous-estime en fait le reste), et tout ce qui n'est pas chiffré (voir § 3). Le taux de 91,9 % est donc un taux de **recouvrement de montants comparables, pas une preuve d'exactitude**. Rapprochement par nature sur le jaune (164 organismes ODAC) : personnel 30,09 contre D1 hors imputés 30,2 ; fonctionnement net des amortissements (22,46 − 4,02 ≈ 18,4) contre P2 25,64 (SNCF Réseau et OPCO, hors jaune, expliquent une partie) ; interventions 29,97 (brut, FC et OPCO inclus) contre D3 + D73 + D7 + D9 = 46,9 ; investissement 7,09 contre P51g hors P12 = 5,77. Ce rapprochement est indicatif, les natures du jaune n'étant pas les natures SEC.

### Flux interne France compétences vers OPCO (compté une seule fois)
Dotations de France compétences aux OPCO en 2024 : **9,045 Md€** (alternance 3,6 + péréquation 5,445 ; jaune PLF 2026 via `sources/formation-professionnelle-depenses.csv`, ligne L18). Dans `odac.csv` : **GL-ODAC-FC** France compétences = 13,69 (dépenses 2024 = ressources 13,067 + déficit 0,62) − 9,045 = **4,645** ; **GL-ODAC-FC-OPCO** = ligne à 0,000 qui garde la trace de l'élimination ; **GL-ODAC-OPCO** = 12,45, la dépense finale. Sans cette élimination, 9,045 Md€ seraient comptés deux fois. Les autres flux internes (AFITF vers SNCF Réseau, ANR vers universités et CNRS, ANAH) restent non isolés (V16109).

## 3. Périmètre : liste officielle Insee des ODAC 2024

Liste Insee 2024 (mai 2026, `Liste_ODAC_SD2024.pdf`, ~700 organismes ; cote A) lue par recherche de texte.
- **Hors ODAC, exclus des lignes nommées** : France Travail (7,14 Md€ de budget initial), Société des grands projets (5,51), agences de l'eau (2,76), Réseau des œuvres universitaires et scolaires / Crous (1,67), ENIM (1,51), ONF (0,94), SOLIDEO, ANDRA, ANGDM, Atout France, LNE, FEI, Génopole, GEODERIS, GIP de l'inclusion, Marais poitevin : 17 entrées, **20,7 Md€** du jaune qui ne sont pas ODAC. À rapprocher des chantiers ASSO et APUL. Le brief demandait France Travail « selon son classement » : il n'est pas ODAC en 2024 (V16100).
- **Bpifrance** : 5 entités sont ODAC en 2024 (Participations, Investissement, Assurance Export, EPIC Bpifrance, FSI PME Portefeuille ; International Capital aussi). Leurs dépenses au sens de l'Insee ne sont pas publiées par entité dans ce que j'ai pu lire ; **non chiffrées**, comprises dans GL-ODAC-099 (V16113).
- Les entrées du jaune dont le nom diffère de la liste Insee (INRAE listé « INRA », Universcience listé « EPPDCSI »...) ont été retenues ; toute entrée absente après recherche du sigle et du nom est dans la liste d'exclusion de `odac.py` (`HORS_ODAC`).

## 4. Doublons suspects dans `sources/calculs/bilan_global.py` (non modifié)

| Ligne du bilan | Montant | Doublon ou fragilité | Lignes du grand livre |
|---|---|---|---|
| **D16** agences et opérateurs supprimés + SNU | −0,7 (0,54 + 0,16) | Économie de fonctions support répartie sur tous les opérateurs, qui recoupe D18 et B04. Le texte dit « ODAC 142,6 Md€, 0,5 % touché » : l'assiette contient 28,1 Md€ d'imputations et 20,7 Md€ du jaune ne sont pas ODAC (France Travail, SGP, agences de l'eau) : les 0,54 du Sénat portent sur les **opérateurs** (périmètre du jaune, 431 entités), pas sur les ODAC. | GL-ODAC-099 |
| **D17** MaPrimeRénov' | −3,3 (engagements 2024) | L'Anah a distribué 3,77 Md€ en 2024 ; budget initial 4,0 (jaune). Base différente (engagements contre paiements). Dépense de l'ODAC financée par l'État (P135, 40,6 Md€ de subventions de l'État reçues par l'ensemble des opérateurs retenus) : à compter une fois. | ANAH |
| **D15** primes à l'apprentissage | −4,6 (IGF 2022) | L'aide à l'embauche d'apprentis (3,9 Md€ exécutés 2024, P103) est **payée par l'ASP** ; le budget propre de l'ASP (0,47) ne la contient pas, elle est chez l'État. Aucun double compte ASP/État dans ce fichier (correction par rapport à la v1, qui prenait 9,1). Mais D15 (2022) n'est pas 2024. Les coûts pédagogiques (≈ 9 Md€) passent par FC et OPCO, hors D15. | ASP, OPCO |
| **P01 / P11** (V15401) | 11,36 | Contributions employeurs de FC : classement Insee non lu. Les dépenses correspondantes (13,69 Md€, dont 9,045 de dotations OPCO) ne sont dans aucune ligne de dépense du bilan (« reste » de la fonction). Risque : supprimer la recette sans traiter la dépense. | GL-ODAC-FC, OPCO, GL-REC-ODAC-001 |
| **P11** | accises maintenues | 2,1 Md€ de TICPE affectés à l'AFITF sont déjà des recettes de l'État. | GL-REC-ODAC-002 |
| **D32 / D14** | 3,0 / −8,0 | Recherche publique : à vérifier que les 3 Md€ ne recoupent pas la SCSP déjà prévue au CNRS (4,06), CEA (7,42), universités. | recherche |
| **Reste COFOG** | calculé | Le bilan complète chaque fonction Eurostat (État + ODAC, S1311) par un reste inchangé : aucun test ne vérifie que les lignes D ne retirent pas deux fois ce qui est à la fois dans l'État (SCSP) et dans l'ODAC. **Flux État vers opérateurs : 40,6 Md€ de subventions de l'État reçues par les opérateurs retenus** (budget initial 2024, flux inter-APU, à éliminer en consolidation ; contrepartie : lignes ETAT P150, P172, P193, P181, P135... de `lignes_etat.csv`). | toutes |

## 5. Taxes affectées (recettes, lignes REC)
Insee : 20,673 Md€ d'impôts D2 reçus par les ODAC en 2024. Jaune PLF 2025 (budget initial 2024) : fiscalité affectée des opérateurs retenus 17,63 Md€ (hors agences de l'eau, hors ODAC), dont FC 11,488. Lignes REC : contributions FC 11,36 ; TICPE AFITF 2,1 ; autres par différence (GL-REC-ODAC-003). Ce sont des recettes ; ne pas additionner aux dépenses.

## 6. Reconstitutions et estimations
- Toutes les lignes du jaune : **budget initial** 2024 (pas l'exécution) et dépense = charges − dotations aux amortissements + investissement (calcul de Claude ; les « opérations d'ordre » autres que les dotations ne sont pas retranchées). Recoupements : CEA 7,42 (jaune) contre 6,24 (rapport financier du CEA, dépenses 2024) ; universités et écoles du programme 150 : 20,1 (jaune) contre 19,79 (comptes 2024 de 152 établissements, data.enseignementsup-recherche.gouv.fr) ; France compétences 15,18 (jaune) contre 13,69.
- Jaune PLF 2025 lu sur une **copie hébergée par la CFDT-UFETAM** ; le PDF officiel (budget.gouv.fr) est inaccessible (403), assemblee-nationale.fr ne l'expose pas à une URL stable trouvée (V16110).
- SNCF Réseau (produits d'exploitation), ANRU (prévision 2024) : estimations, hors jaune.
- Cofog des lignes : rattachement par programme du jaune (estimation), pas la COFOG de l'Insee.
- GL-ODAC-099 : par différence.

## 7. Questions ouvertes
1. Comparer le jaune copié au PDF officiel (budget.gouv.fr, 403) ; passer du budget initial 2024 aux comptes financiers 2024 (rapports annuels de performance 2024 par programme).
2. Fonds d'intervention régional des ARS (plusieurs Md€, financé par l'assurance maladie) : non chiffré (V16110) ; comptes de la CNSA / Cnam à croiser avec le chantier ASSO.
3. Action Logement Services, EFS, Santé publique France, FranceAgriMer (jaune : 0,58 mais aides à des tiers), fonds de garantie : non chiffrés ou à confirmer (V16112).
4. Bpifrance : dépenses SEC par entité (V16113).
5. Isoler les autres flux internes ODAC (AFITF vers SNCF Réseau, ANR vers universités, ANAH).
6. Classement Insee de France Travail, SGP, agences de l'eau (absents de la liste ODAC).
