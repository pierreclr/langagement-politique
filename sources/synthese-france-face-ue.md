# France face à l'UE-27 : rangs par chapitre et chiffres qui contredisent les thèses (T57)

> Rédigé le 03/11/2026. Complète `donnees-europeennes-par-chapitre.md` (inventaire des jeux) par des séries chiffrées sur les 27 États membres et un rang de la France. Décision de l'auteur du 02/11/2026 : manifeste européen.
> Légende (règle 3) : **fait sourcé** / **estimation** / **opinion de l'auteur**. Rang 1 = valeur la plus haute des 27 (ce n'est pas un bon ou un mauvais rang : une dépense élevée n'est pas un défaut en soi). Les points non confirmés portent ⚠️ et un numéro V74xx (`verifications.md`).
> Reproductibilité : `sources/calculs/eurostat_synthese_ue.py` (`--telecharger` refait les requêtes ; `--ecrire` met à jour `sources/calculs/eurostat_synthese_ue_resultats.txt`). Données brutes : `$DONNEES/sources/eurostat/t57c/` (Eurostat, JSON) et `$DONNEES/sources/europe/t57c/` (DG TAXUD, OCDE, Tørsløv-Wier-Zucman). Script lu avec `python3 -I`.

## 1. Sources et pièges de méthode

| Jeu | Source primaire (consultée le 03/11/2026) | Ce que c'est | Piège |
|---|---|---|---|
| Dépenses par fonction | Eurostat `gov_10a_exp` (COFOG), [API](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp), mise à jour 21/10/2026 | % du PIB, administrations publiques (S13), 2024 | Les fonctions COFOG ne sont pas des ministères ; la protection sociale comprend retraites, maladie, famille, chômage |
| Prélèvements, parts par type et par fonction économique, taux implicites | Commission, DG TAXUD, [*Taxation trends in the EU*, édition 2026, profils pays](https://taxation-customs.ec.europa.eu/taxation/economic-analysis/data-taxation-trends_en) (classeur `Part2_country_profiles.xlsx`), données Eurostat | % du PIB, 2024 | La Commission remplace les « taux implicites » d'Eurostat (jeu retiré de l'API, codes testés sans succès) ; le pied du classeur dit « Data extracted February 2024 » alors que les colonnes vont à 2024 : à relire (⚠️ V7400). Le taux implicite sur le capital n'est pas dans le classeur lu. |
| Coin fiscal | Eurostat `earn_nt_taxwedge`, 2025 | Taux sur les bas salaires | Le cas type exact (célibataire, 67 % du salaire moyen ?) n'est pas lisible dans la réponse de l'API : à confirmer (⚠️ V7401) |
| Dette et solde | Eurostat `gov_10dd_edpt1`, 2024 | % du PIB, S13 | — |
| Taux légal de l'IS | OCDE, [Corporate Tax Statistics, base DF_CIT](https://sdmx.oecd.org/public/rest/data/OECD.CTP.TPS,DSD_TAX_CIT@DF_CIT,1.0/all) (API SDMX, mesure `CIT_C`, taux combiné central + local) | Taux de droit commun | **2025 : 22 États membres seulement ; Chypre absente** ; le 36,1 % de la France en 2025 semble inclure les contributions exceptionnelles de la loi de finances 2025 : définition OCDE non relue (⚠️ V7402) ; il s'agit d'un taux légal, pas d'un taux effectif |
| Profits transférés | Tørsløv, Wier, Zucman, [*The Missing Profits of Nations*](https://missingprofits.world) (données et classeur `TWZ2022.xlsx`, Tables 2 et 3) | Milliards de dollars courants, **année 2015** | Estimation modélisée (bornes 369 à 740 Md$ au niveau mondial) ; ancienne de 11 ans ; BG, HR, CY, LT, RO non tabulés individuellement ; hypothèse de rentabilité comparable des filiales (voir `pertes-systeme-europeen.md` § 2) |
| Infractions au droit de l'UE | Commission, base « Infringement decisions » (données ouvertes), calcul de `sources/calculs/infractions_ue_2026.py` | Stock de dossiers actifs, état du 03/11/2026 | Brut, sans correction par la taille du pays ; un dossier peut viser un manque de transposition (non-communication) autant qu'une application fautive |

**Prélèvements des taux implicites** : un « taux implicite » est le rapport entre les recettes d'une catégorie (consommation, travail) et son assiette macroéconomique ; ce n'est pas un taux légal (définition de la Commission, méthodologie non relue ici, ⚠️ V7400).

## 2. Résultats détaillés (sortie du script, 03/11/2026)

### A. Dépenses publiques par fonction (Eurostat gov_10a_exp, S13, % du PIB, 2024)
| Indicateur | France | UE-27 | Médiane des 27 | Rang de la France (1 = le plus haut) | Maximum | Minimum | Unité |
|---|---|---|---|---|---|---|---|
| Dépenses publiques totales | 57,3 | 48,8 | 46,8 | 2/27 | Finlande 57,7 | Irlande 22,4 | % PIB |
| Services généraux | 6,2 | 6,0 | 5,5 | 7/27 | Hongrie 10,0 | Irlande 2,0 | % PIB |
|   dont charge de la dette | 2,0 | 1,9 | 1,4 | 9/27 | Hongrie 5,0 | Luxembourg 0,4 | % PIB |
| Défense | 1,9 | 1,5 | 1,5 | 7/27 | Estonie 3,7 | Irlande 0,1 | % PIB |
| Ordre et sécurité | 1,8 | 1,7 | 1,7 | 10/27 | Lettonie 3,2 | Irlande 0,7 | % PIB |
| Affaires économiques | 5,7 | 5,3 | 5,5 | 12/27 | Hongrie 7,7 | Irlande 2,1 | % PIB |
| Environnement | 1,0 | 0,8 | 0,7 | 6/27 | Pays-Bas 1,6 | Finlande 0,2 | % PIB |
| Logement et équipements collectifs | 1,4 | 0,7 | 0,6 | 4/27 | Chypre 2,1 | Danemark 0,3 | % PIB |
| Santé | 8,9 | 7,3 | 6,6 | 4/27 | Autriche 9,5 | Hongrie 4,7 | % PIB |
| Culture, loisirs, cultes | 1,5 | 1,2 | 1,3 | 6/27 | Hongrie 2,5 | Irlande 0,4 | % PIB |
| Éducation | 5,1 | 4,7 | 5,0 | 11/27 | Suède 7,2 | Irlande 2,7 | % PIB |
| Protection sociale | 23,7 | 19,5 | 17,1 | 2/27 | Finlande 26,5 | Irlande 8,2 | % PIB |
|   dont vieillesse | 13,4 | 10,6 | 9,8 | 4/27 | Finlande 15,5 | Irlande 3,0 | % PIB |
|   dont maladie et invalidité | 2,9 | 2,8 | 2,2 | 10/27 | Danemark 4,8 | Chypre 0,5 | % PIB |
|   dont famille et enfants | 2,3 | 2,0 | 1,8 | 8/27 | Danemark 4,1 | Malte 0,9 | % PIB |
|   dont chômage | 1,7 | 1,2 | 0,7 | 1/27 | France 1,7 | Roumanie 0,0 | % PIB |

### B. Fiscalité (DG TAXUD, Taxation trends 2026, % du PIB sauf mention, 2024)
| Indicateur | France | UE-27 | Médiane des 27 | Rang de la France (1 = le plus haut) | Maximum | Minimum | Unité |
|---|---|---|---|---|---|---|---|
| Prélèvements obligatoires totaux | 43,5 | 39,4 | 36,8 | 2/27 | Danemark 45,2 | Irlande 21,7 | % PIB |
| Cotisations sociales | 14,6 | 13,0 | 11,7 | 6/27 | Slovénie 16,9 | Danemark 0,1 | % PIB |
|   dont cotisations employeurs | 10,0 | 7,1 | 5,8 | 2/27 | Estonie 11,2 | Danemark 0,1 | % PIB |
| TVA | 7,1 | 7,1 | 7,9 | 18/27 | Croatie 13,3 | Irlande 3,9 | % PIB |
| Impôt sur le revenu des personnes | 9,4 | 9,6 | 7,1 | 9/27 | Danemark 26,3 | Roumanie 2,9 | % PIB |
| Impôt sur les sociétés | 2,9 | 3,1 | 3,0 | 18/27 | Chypre 6,9 | Hongrie 1,6 | % PIB |
| Autres impôts sur la production | 4,4 | 2,4 | 1,5 | 2/27 | Suède 10,2 | Malte 0,5 | % PIB |
| Fiscalité de la consommation (fonction économique) | 10,8 | 10,6 | 11,2 | 19/27 | Croatie 18,5 | Irlande 5,6 | % PIB |
| Fiscalité du travail (fonction économique) | 22,4 | 20,3 | 18,1 | 5/27 | Autriche 24,4 | Irlande 9,0 | % PIB |
| Fiscalité du capital (fonction économique) | 10,3 | 8,5 | 7,5 | 4/27 | Luxembourg 12,6 | Estonie 3,5 | % PIB |
| Impôts sur la propriété | 3,4 | 1,8 | 0,9 | 1/27 | France 3,4 | Estonie 0,3 | % PIB |
|   dont successions et donations | 0,7 | 0,3 | 0,1 | 1/24 | France 0,7 | Slovaquie 0,0 | % PIB |
| Impôts environnementaux | 1,9 | 2,1 | 2,1 | 19/27 | Grèce 3,8 | Irlande 1,0 | % PIB |
| Taux implicite sur la consommation | 16,40 | 16,48 | 18,18 | 21/27 | Croatie 22,37 | Espagne 13,59 | % |
| Taux implicite sur le travail | 38,76 | 37,09 | 35,19 | 6/27 | Grèce 44,80 | Malte 24,35 | % |
| Coin fiscal, bas salaires (Eurostat earn_nt_taxwedge, 2025) | 38,0 | 39,5 | 38,3 | 15/27 | Allemagne 44,7 | Irlande 22,5 | % |

### B bis. Dette et solde (Eurostat gov_10dd_edpt1, S13, % du PIB, 2024)
| Indicateur | France | UE-27 | Médiane des 27 | Rang de la France (1 = le plus haut) | Maximum | Minimum | Unité |
|---|---|---|---|---|---|---|---|
| Dette brute | 112,6 | 80,3 | 56,5 | 3/27 | Grèce 153,5 | Estonie 23,5 | % PIB |
| Solde des administrations publiques (négatif = déficit ; rang 1 = le plus haut excédent) | -5,8 | -3,1 | -2,5 | 25/27 | Irlande 4,2 | Roumanie -9,2 | % PIB |

### C. Concurrence fiscale sur les sociétés
| Indicateur | France | UE-27 | Médiane des 27 | Rang de la France (1 = le plus haut) | Maximum | Minimum | Unité |
|---|---|---|---|---|---|---|---|
| Taux légal combiné de l'IS, 2024 (OCDE) | 25,8 | n.d. | 21,5 | 5/26 | Malte 35,0 | Hongrie 9,0 | % |
| Taux légal combiné de l'IS, 2025 (OCDE) | 36,1 | n.d. | 22,0 | 1/22 | France 36,1 | Hongrie 9,0 | % |

Profits transférés (Tørsløv-Wier-Zucman 2022, Tables 2 et 3, données 2015, milliards de dollars courants) :

| Pays | Profits transférés hors du pays (Md$) | en % des profits déclarés dans le pays | Perte d'IS en % de l'IS collecté |
|---|---|---|---|
| France | 32,1 | 17,1 % | 21,0 % |
| Suède | 8,5 | 13,5 % | 12,8 % |
| Hongrie | 2,4 | 11,6 % | 20,7 % |
| Finlande | 2,7 | 10,8 % | 10,8 % |
| Italie | 22,7 | 10,7 % | 19,1 % |
| Allemagne | 54,9 | 9,9 % | 27,9 % |
| Portugal | 2,6 | 9,9 % | 8,9 % |
| Espagne | 14,4 | 9,0 % | 14,2 % |
| Autriche | 3,6 | 7,5 % | 10,6 % |
| Slovénie | 0,2 | 6,6 % | 6,1 % |
| Estonie | 0,2 | 6,0 % | 10,4 % |
| Danemark | 3,0 | 5,7 % | 8,4 % |
| Slovaquie | 0,6 | 5,5 % | 4,8 % |
| Tchéquie | 1,8 | 5,2 % | 5,0 % |
| Lettonie | 0,2 | 4,8 % | 7,0 % |
| Grèce | 1,0 | 4,6 % | 7,2 % |
| Pologne | 3,7 | 4,2 % | 8,0 % |

Rang de la France parmi les 17 États membres tabulés individuellement (hors refuges BE, IE, LU, MT, NL ; BG, HR, CY, LT, RO non tabulés) : 2e en montant, 1e en part des profits déclarés, 2e en perte relative d'IS (rang 1 = le plus touché).
Profits reçus par les refuges de l'UE (Md$, 2015) : Irlande 106, Pays-Bas 57, Luxembourg 47, Belgique 13, Malte 12 ; total 236 Md$.

### D. Infractions au droit de l'UE (stock de procédures ouvertes, Commission, état du 03/11/2026)
France : 86 dossiers actifs, rang 7/27 (1 = le plus de dossiers) ; médiane 71 ; maximum Espagne 124 ; minimum Danemark 36.
Taille des États : le stock brut n'est pas rapporté à la population ; la France, 3e population de l'UE, est dans la moitié haute sans être en tête.

## 3. Tableau de synthèse « France face à l'UE » par chapitre

Rang parmi les 27 sauf mention ; « haut » signifie une valeur élevée, sans jugement. Les lignes marquées (ant.) viennent des fichiers antérieurs de T57 (sources et dates dans ces fichiers).

| Chapitre | Indicateur | France | UE-27 | Rang de la France | Sens pour les thèses de l'auteur |
|---|---|---|---|---|---|
| 4. L'État conçu sans informatique | Dépenses publiques totales, % PIB 2024 | 57,3 | 48,8 | **2e** (Finlande 57,7) | Appuie « problème de dépenses » ; mais voir 4.1 |
| 4. id. | Services généraux, % PIB | 6,2 | 6,0 | 7e | **Contredit** l'idée d'un appareil administratif hors norme : l'écart total (+8,5 points) n'est presque pas là |
| 4 / 18. id. | Charge de la dette, % PIB | 2,0 | 1,9 | 9e | Neutre (Hongrie 5,0) |
| 4 (ant.) | Coût de collecte de l'administration fiscale (OCDE, 2022), pour 100 de recettes | 0,56 | médiane 0,70 | 7e plus bas coût (ant.) | **Contredit** l'argument « la collecte coûte cher » (voir 4.2) |
| 5. La vassalisation | Défense, % PIB | 1,9 | 1,5 | 7e (Estonie 3,7) | Neutre ; la France dépense plus que la moyenne UE |
| 5 (ant.) | Prix de l'électricité, entreprises 2-20 GWh, 2025 (c€/kWh hors TVA) | 12,5 | 16,2 | non classé (11 pays seulement, `energie-europe.md`) | Appuie l'atout nucléaire (irrégulier : 2023 plus cher que l'Allemagne) |
| 6. Ce qui a de la valeur (ant.) | PIB par habitant en SPA vs revenu disponible ajusté des ménages | 12e vs 6e | 100 | 12e / 6e | Nuance « la France s'appauvrit » : les ménages sont mieux placés que le PIB ne le dit |
| 9. Un prélèvement unique | Prélèvements obligatoires, % PIB 2024 | 43,5 | 39,4 | **2e** (Danemark 45,2) | Appuie « la France prélève déjà l'équivalent de beaucoup » ; le taux de 50 % tombe à 6,5 points au-dessus |
| 9. id. | Cotisations employeurs, % PIB | 10,0 | 7,1 | **2e** | Appuie le diagnostic sur le coût du travail |
| 9. id. | Impôt sur le revenu des personnes, % PIB | 9,4 | 9,6 | 9e | Neutre : la France n'est pas haute en impôt sur le revenu |
| 9. id. | Impôt sur les sociétés, % PIB | 2,9 | 3,1 | 18e | **Contredit** le « poids » de l'IS : sa suppression coûterait peu (2,9 % du PIB) |
| 9. id. | Taux légal combiné de l'IS (OCDE), 2024 / 2025 | 25,8 / 36,1 | n.d. | 5e sur 26 / 1re sur 22 | Appuie la thèse d'une concurrence fiscale mal engagée ; ⚠️ V7402 |
| 9. id. | Fiscalité du travail, % PIB / taux implicite | 22,4 / 38,8 % | 20,3 / 37,1 % | 5e / 6e | Appuie |
| 9. id. | Coin fiscal bas salaires (2025) | 38,0 | 39,5 | 15e | **Contredit** « le travail peu qualifié est écrasé de charges » : au bas de l'échelle la France est sous la moyenne (allègements de cotisations) ; ⚠️ V7401 |
| 9. id. | Fiscalité du capital, % PIB | 10,3 | 8,5 | 4e | **Contredit** « le capital est peu taxé » ; la thèse porte sur les montages, pas sur la moyenne |
| 9 / 10. id. | Impôts sur la propriété, % PIB | 3,4 | 1,8 | **1re** | **Contredit** la neutralité fiscale de la suppression de la taxe foncière : la recette perdue est la plus grande d'Europe |
| 9. id. | Successions et donations, % PIB | 0,7 | 0,3 | **1re sur 24** | Appuie l'idée que la France taxe déjà fortement les transmissions |
| 9 / 17. Concurrence fiscale | Profits transférés hors du pays, 2015 (Md$) / part des profits déclarés | 32,1 / 17,1 % | 17 pays tabulés | 2e en montant (derrière l'Allemagne, 54,9) ; **1re** en part | Appuie la thèse du système européen perdant ; estimation 2015 |
| 10. Orienter sans interdire | Fiscalité de la consommation (fonction économique), % PIB / taux implicite | 10,8 / 16,4 % | 10,6 / 16,5 % | 19e / 21e | Appuie qu'il existe une marge pour une TVA d'orientation ; **mais** la France taxe moins la consommation que la médiane |
| 10. id. | Impôts environnementaux, % PIB | 1,9 | 2,1 | 19e | **Contredit** « le pollueur-payeur existe déjà » ; appuie « on peut calibrer plus » |
| 11 / 12. Revenu universel, travail | Dépenses d'assurance chômage (COFOG GF1005), % PIB | 1,7 | 1,2 | **1re** (médiane 0,7) | Appuie : un poste que le socle remplacerait est le plus lourd d'Europe |
| 11 / 12. id. | Famille et enfants, % PIB | 2,3 | 2,0 | 8e | Neutre |
| 13. Les retraites | Vieillesse (COFOG GF1002), % PIB | 13,4 | 10,6 | 4e | Appuie : poste majeur de l'excès de dépense |
| 4 / 13. Santé | Santé, % PIB | 8,9 | 7,3 | 4e | **Contredit** l'idée d'économiser facilement en santé ; c'est le deuxième poste de l'écart |
| 15. Apprendre avec l'IA | Éducation, % PIB | 5,1 | 4,7 | 11e (Suède 7,2) | **Contredit** « on dépense trop pour l'école » : la France est dans la médiane |
| 16. Agriculture (ant.) | Part de la France dans les dépenses PAC de l'UE ; solde PAC | 17 % ; −0,8 Md€/an (2021-2025, estimation) | | non classé (`pac-france-europe.md`) | Neutre : la PAC n'explique pas le solde net (−7,9 Md€ en 2024) |
| 17. L'Europe fédérale | Procédures d'infraction ouvertes, stock | 86 | médiane 71 | 7e (Espagne 124, Danemark 36) | **Contredit** « Bruxelles étouffe la France » : la France est dans la moitié haute sans être première ; appuie le risque de la « méthode Trump » (39 dossiers de non-communication) |
| 17. id. | Défense (voir 5) et dépenses publiques totales (voir 4) | | | | La France est d'abord un très gros dépensant dans un bloc qui dépense peu à l'échelle commune |
| 18. Finances publiques | Dette brute, % PIB 2024 | 112,6 | 80,3 | **3e** (Grèce 153,5, Italie 134,3) | Appuie l'urgence |
| 18. id. | Solde des administrations publiques, % PIB 2024 | −5,8 | −3,1 | 25e sur 27 (Roumanie −9,2) | Appuie l'urgence ; seuls deux pays font pire |
| 7 ter, 3, 7, 14, 1-2 | Immigration, polarisation, démocratie directe, capital commun, IA | | | **Non comblé** | Données listées dans `donnees-europeennes-par-chapitre.md` (codes à tester, ⚠️ V4200), séries chiffrées à faire dans une prochaine séance |

## 4. Les chiffres qui contredisent les thèses de l'auteur

À lire sans complaisance (règle 7). Chaque point nomme la thèse de l'auteur, le chiffre et ce qu'il laisse intact.

**4.1. « La France n'a pas un problème de moyens, elle a un problème de dépenses. »** Le chiffre appuie le début (57,3 % du PIB, 2e de l'UE, 8,5 points au-dessus de l'UE-27) mais déplace le coupable. L'écart par rapport à la médiane des 27 se concentre sur la protection sociale (+6,6 points : 23,7 contre 17,1), la santé (+2,3), le logement (+0,8) ; **les services généraux (6,2) ne sont qu'à +0,7 de la médiane et l'éducation (5,1) est à la médiane**. La dépense que l'auteur veut cartographier et réduire est donc d'abord de la redistribution et de la santé, c'est-à-dire des revenus et des soins reçus par les ménages, pas un appareil administratif. Ceci rejoint le revenu disponible des ménages français (6e sur 26) : l'excès de dépense est aussi un revenu pour les ménages. Réduire la dépense de 8 points sans toucher aux transferts n'est pas arithmétiquement possible (estimation : l'administration générale entière, 6,2 points, ne couvrirait pas l'écart).

**4.2. Prélèvement unique et coût de collecte.** L'argument « la collecte coûte cher et se simplifie » est faible au regard de la seule administration fiscale : 0,56 pour 100 collectés, sous la médiane de 0,70 (ant., OCDE 2022). L'argument doit reposer sur la fragmentation (cotisations, collectivités) et sur le coût de conformité des entreprises, pas mesurés ici.

**4.3. « Fin de l'impôt sur les sociétés ; 50 % sur les dividendes. »** L'IS rapporte 2,9 % du PIB (18e), moins que la moyenne UE (3,1) : l'abolir coûte moins qu'ailleurs, mais ne règle pas le problème des transferts de profits sous une autre forme (distribution à des holdings étrangères, point « pas sûr à 100 % » de l'auteur). Les chiffres TWZ (17,1 % des profits déclarés transférés, 1re de l'UE ; 21,0 % de perte d'IS) appuient le diagnostic, mais l'Irlande, le Luxembourg et les Pays-Bas ne pourront pas être corrigés par un acte français : il faudra l'accord de 27 États (unanimité fiscale, voir `topo-droit-europeen.md`).

**4.4. « Fin de la taxe foncière. »** La France tire 3,4 % du PIB des impôts sur la propriété, **1re de l'UE**, pour 1,8 en moyenne : la suppression coûte plus de recette que dans n'importe quel autre pays (confirme `fiscalite-immobiliere-europe.md`). Les successions (0,7 % du PIB) sont aussi les plus fortes d'Europe : la France n'est pas un pays qui taxe peu le patrimoine transmis.

**4.5. « Le coût du travail écrase l'emploi. »** Vrai en haut du tableau (cotisations employeurs 2e, fiscalité du travail 5e), **faux au bas de l'échelle** : le coin fiscal des bas salaires (15e, 38,0 contre 39,5) est sous la moyenne européenne. Le diagnostic doit être précisé : ce sont les salaires moyens et élevés, pas le SMIC, qui portent le coût (⚠️ V7401 pour le cas type exact).

**4.6. « Pollueur-payeur / taxe d'orientation. »** Les impôts environnementaux sont à 1,9 % du PIB (19e, UE-27 2,1) et la fiscalité de la consommation est sous la médiane (19e) : la France n'est pas un pays qui orienterait déjà. Cela appuie la marge de manœuvre, mais contredit l'idée d'une orientation écologique par la fiscalité déjà faite ; et `energie-europe.md` montre qu'on taxe plus l'électricité décarbonée que le gaz par kWh.

**4.7. Santé et éducation.** Aucune « économie facile » : la santé est 4e (8,9 % du PIB) mais l'éducation est à la médiane. Si le manifeste maintient des coupes dans ces deux postes, il doit argumenter par la qualité du résultat, pas par le niveau de la dépense.

**4.8. « Tentation de la méthode Trump (refuser d'appliquer les règles européennes). »** La France a déjà 86 procédures d'infraction ouvertes, 7e sur 27 (dont 39 de non-communication de transposition) : refuser d'appliquer ne serait pas une rupture mais une poursuite, avec des sanctions possibles de l'article 260(3). Ce n'est pas un chiffre qui désavoue la thèse, mais il nuance « Bruxelles étouffe » : l'Espagne, la Pologne, la Hongrie, le Portugal, la Belgique ont davantage de dossiers.

**4.9. « Leadership français, déjà un peu en tête » (Europe).** PIB par habitant 12e sur 27 (ant.), solde public 25e sur 27, dette 3e : sur les finances, la France est parmi les derniers, pas en tête. Le leadership est politique (puissance nucléaire, taille), pas financier : le manifeste ne peut pas présenter la France comme modèle de gestion.

## 5. Faits récents (règle 8)

- Taux légal d'IS : l'OCDE donne 36,1 % pour la France en 2025 contre 25,8 % en 2024, premier taux parmi les 22 États membres renseignés (⚠️ V7402) : joue **contre** l'idée que l'IS français baisse et **pour** la thèse d'une France qui s'isole fiscalement ; ajouté à `faits-recents.md`.

## 6. Limites et suite

1. Chapitres sans série chiffrée dans ce fichier : immigration (7 ter), polarisation (3), démocratie directe (7), capital commun et IA (1, 2, 14), libertés (7 bis), qualité de vie (6, partiellement en ant.). Les codes sont listés dans `donnees-europeennes-par-chapitre.md` et restent à tester.
2. Les rangs sont sur une seule année (2024 ; TWZ 2015 ; infractions : stock du 03/11/2026) : la stabilité des rangs sur 2015-2024 n'est pas testée (les séries 2019-2024 sont téléchargées pour COFOG, mais pas exploitées ici).
3. Non fait : ratios d'infractions par habitant ; taux effectifs d'IS (Taxation trends partie 1 non lue) ; taux implicite sur le capital.
4. Ne pas additionner les lignes : périmètres et années diffèrent.
