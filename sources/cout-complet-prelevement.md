# Coût complet du système de prélèvement français

Consultation : 03/11/2026. Chapitre concerné : 9 (prélèvement unique). Script : `sources/calculs/cout_complet_prelevement.py` (résultats : `sources/calculs/cout_complet_prelevement_resultats.txt`). PDF et données : `$DONNEES/sources/fiscalite/cout-complet/`. Registre : V5910 à V5923 dans `verifications.md`.

Légende : **fait sourcé** (lien) · **estimation** (calcul reproductible) · **opinion** · ⚠️ non confirmé.

Ce document complète trois travaux existants et ne les refait pas : l'inventaire des prélèvements et des coûts publics (`sources/recherche-inventaire-impots.md`), le ratio OCDE (`sources/donnees-europeennes-par-chapitre.md` § 2 bis b) et le modèle « industrie de la complexité » (`modeles/industrie-complexite/resultats.md`, qui chiffre déjà emplois et reconversions).

## 0. Résultat en une page

| Md€ par an | Bas | Central | Haut |
|---|---|---|---|
| Coût public de toutes les administrations de prélèvement | 5,6 | 7,6 | 9,2 |
| Coût de conformité (entreprises + ménages), strict : fiscal et social | 16,2 | 25,3 | 43,0 |
| **Total** | **21,8** | **32,9** | **52,2** |
| en % des prélèvements obligatoires 2024 (1 254 Md€) | 1,7 % | **2,6 %** | 4,2 % |
| en % du PIB 2024 (2 935 Md€) | 0,74 % | 1,1 % | 1,8 % |
| **Économie possible avec un prélèvement unique** (régime de croisière) | 4,6 | **16,4** | 37,6 |
| dont économie budgétaire (administrations) | 0 | 2,6 | 5,2 |
| Emplois concernés (équivalents temps plein) | 50 000 | 173 000 | 400 000 |
| Personnes à reconvertir, après départs en retraite | 0 | 82 800 | 324 900 |

Trois enseignements, dont deux ne vont pas dans le sens de la thèse :
1. **Fait** : l'État ne se prélève pas cher. Au périmètre complet (cotisations comprises), le coût public est de 0,60 % des prélèvements obligatoires au central, contre 0,56 % au périmètre OCDE. L'ajout des Urssaf change à peine le ratio : l'Urssaf est elle-même peu chère (0,25 € pour 100 €).
2. **Estimation** : le gros du coût n'est pas public. Il est dans les entreprises : environ 77 % du total au central. L'argument du prélèvement unique est donc un argument de **conformité**, pas un argument budgétaire.
3. **Fait** : sur le temps de conformité d'une PME type, la France n'est pas un cas extrême (139 heures par an contre 170 en moyenne dans l'UE-27, 218 en Allemagne). Elle est loin derrière l'Estonie (50 heures).

L'économie centrale (16,4 Md€, 0,56 % du PIB) est un gain de productivité, pas une ressource pour financer le socle : seuls 2,6 Md€ sont budgétaires.

## 1. Coût public de toutes les administrations de prélèvement

| Poste (Md€/an) | Bas | Central | Haut | Base |
|---|---|---|---|---|
| DGFiP, part fiscale | 3,48 | 4,45 | 5,05 | H1 |
| DGDDI, part fiscale | 0,13 | 0,40 | 0,64 | H2 |
| Urssaf et réseau Acoss | 1,57 | 1,85 | 1,85 | H3 |
| MSA, recouvrement | 0,06 | 0,12 | 0,23 | H4 ⚠️ |
| Agirc-Arrco, recouvrement | 0,10 | 0,25 | 0,45 | H5 ⚠️ |
| Caisses autonomes et régimes spéciaux | 0,12 | 0,20 | 0,41 | H6 ⚠️ |
| ~58 organismes qui collectent eux-mêmes | 0,10 | 0,20 | 0,40 | H7 ⚠️ |
| Collectivités (régie) | 0,05 | 0,10 | 0,20 | H8 ⚠️ |
| **Total** | **5,6** | **7,6** | **9,2** | |
| en % des prélèvements obligatoires 2024 | 0,45 % | 0,60 % | 0,74 % | |

**Faits sourcés.**
- **DGFiP.** Taux d'intervention sur l'impôt : 0,54 € pour 100 € en 2024 (0,68 en 2023). Coût de collecte DGFiP + DGDDI : 0,55 € pour 100 € en 2024 ([PAP 2026, Gestion des finances publiques, indicateurs 3.1 et 1.1](https://www.assemblee-nationale.fr/dyn/contenu/visualisation/1087984/file/PAP2026_BG_Gestion_finances_publiques_GA.pdf), p. 11 et 34). Crédits de paiement 2026 du programme 156 : 8,23 Md€ ; actions fiscales (grandes entreprises 137 M€, PME 1 639 M€, particuliers et fiscalité locale 2 057 M€, législation fiscale 22 M€) : 3,86 Md€ ; soutien : 1,95 Md€ ; 92 115 ETPT (p. 14-18). Le programme 156 contient aussi la gestion des dépenses, des pensions et des fonds déposés, qui ne sont pas de la collecte. Le coût OCDE 2022 est de 3 483 M€ pour 626 861 M€ de recettes (0,56 %).
- **DGDDI.** Programme 302 : 1,82 Md€ de crédits et 16 475 ETPT en 2026. La douane fait de la surveillance, de la sûreté et de la lutte contre les trafics autant que de la fiscalité : le PAP ne publie pas le coût de sa collecte. L'action « fiscalité douanière, énergétique et environnementale » coûte 134 M€ (minorant).
- **Urssaf.** Charges nettes de gestion de la branche recouvrement : 1 570,6 M€ en 2025 (brutes 1 849 M€) pour 636 Md€ recouvrés, soit 24,7 centimes pour 100 € ; 30,8 centimes sur le seul champ Urssaf et CGSS (REPSS Financement, indicateur Fi.2.12, repris de l'inventaire ⚠️ V5912). Exécuté 2023 du fonds de gestion : 1 784 M€ bruts, 1 110 M€ nets ([PLACSS 2023, annexe 6, tableau 2](https://questions.assemblee-nationale.fr/dyn/contenu/visualisation/833190/file/annexe%206%20organisme%20s%C3%A9curit%C3%A9%20sociale%20gestion%20performance%20simplification.pdf), p. 24). Ensemble du régime général et de la MSA : 13,1 Md€ de dépenses brutes de gestion en 2023, toutes fonctions (prestations comprises), dont la MSA 1 166 M€ (p. 22).
- **Collecteurs dispersés.** Selon l'inventaire (`recherche-inventaire-impots.md` § 3), la DGFiP et l'Urssaf encaissent 83 % des montants ; une soixantaine d'autres entités collectent le reste.

**Hypothèses numérotées.**
- **H1.** Part fiscale de la DGFiP : bas = coût OCDE 2022 (3,48 Md€) ; central = actions fiscales (3,86) + la moitié du soutien réparti au prorata (0,59) ; haut = soutien entier au prorata (1,19). ⚠️ V5910
- **H2.** Part fiscale de la DGDDI : bas = action 05 seule ; central = 0,40 Md€, valeur qui rend compatible l'indicateur combiné (0,55) avec les 0,54 de la DGFiP, sous des dénominateurs que je n'ai pas lus ; haut = 35 % du programme. ⚠️ V5911
- **H3.** Urssaf : bas = charges nettes ; central et haut = charges brutes (le coût réel de la collecte inclut ce qui est facturé aux organismes pour qui elle collecte).
- **H4 à H8.** Aucun coût n'est publié (MSA, Agirc-Arrco, caisses, petits organismes, collectivités). Ordres de grandeur en pourcentage des montants collectés : MSA 0,3 % de ~20 Md€ à 20 % de son budget de gestion ; Agirc-Arrco 0,1 à 0,45 Md€ sur ~98 Md€, avec risque de double compte avec l'Urssaf depuis le transfert ; caisses 0,3 à 1 % de 41 Md€ ; petits organismes 1 à 4 % de 10 Md€ (le CPO a relevé des taxes dont la collecte coûte plus que le rendement : 409,6 % pour une taxe sur les radioamateurs, voir l'inventaire § 4.3). ⚠️ V5913

**Non compté** : contentieux fiscal et social devant les juridictions (4 % des affaires des tribunaux administratifs, 9 % au Conseil d'État, chiffres repris du modèle T6), coût des dépenses fiscales à gérer, coût du contrôle sur les administrations. Les frais d'assiette et de recouvrement prélevés sur les contribuables locaux (2,13 Md€) sont un transfert, pas un coût supplémentaire.

## 2. Coût de conformité des entreprises et des ménages

**Ce que disent les sources.**
- **Commission européenne** (VVA/KPMG, *Tax compliance costs for SMEs: an update and a complement*, rapport final, janvier 2022, enquête 2019 auprès de plus de 3 500 PME dans 28 pays : [rapport](https://op.europa.eu/en/publication-detail/-/publication/70a486a9-b61d-11ec-b6f4-01aa75ed71a1/language-en)). Coût moyen pondéré : 14 745 € par PME et par an, dont 3 097 € pour l'impôt sur les sociétés et 2 853 € pour la TVA (p. 31-32). Micro-entreprises : 13 897 €, grandes entreprises : 33 917 € (résumé du Parlement européen). Ces coûts dépendent du recours à l'externalisation : 74 % des micro-entreprises externalisent (en tout ou partie) la TVA et 84 % l'impôt sur les sociétés ; l'externalisation augmente le coût mesuré (13 846 € contre 10 588 € pour les micro-entreprises).
- **Parlement européen** (D'Andria et Heinemann, [*Overview on the tax compliance costs faced by European enterprises*, PE 642.353, mars 2023](https://www.europarl.europa.eu/RegData/etudes/STUD/2023/642353/IPOL_STU(2023)642353_EN.pdf)) : les coûts sont « généralement compris entre 1 % et 2 % du chiffre d'affaires » ; ils pèsent relativement plus sur les petites entreprises ; les pays nordiques et baltes sont les plus légers ; la complexité et l'incertitude augmentent les coûts. La dispersion entre pays est telle que le classement dépend de l'indicateur utilisé.
- **Banque mondiale, Doing Business 2020** (données 2018, entreprise type, source arrêtée en 2021) : France 139 heures par an et 9 paiements ; Estonie 50 heures et 8 paiements ; Pays-Bas 119 heures et 9 ; Allemagne 218 heures et 9 ([profils](https://archive.doingbusiness.org/content/dam/doingBusiness/country/f/france/FRA.pdf), lus le 03/11/2026). Moyenne UE-27 : 170 heures (EP, tableau 1). L'API de la Banque mondiale n'expose plus l'indicateur (retiré). B-READY ne couvre pas la France avant l'édition 2026 (⚠️ V5921).
- **Insee, fiche sectorielle 692** (activités comptables) : 21 690 entreprises, 22,0 Md€ de chiffre d'affaires et 166 000 ETP en 2021 ([fiche](https://www.insee.fr/fr/statistiques/7763830), publiée le 11/03/2024). Eurostat SBS, repris du modèle T6 : 28,0 Md€ et 221 053 personnes occupées en 2024 pour le NAF 69.20. Ces chiffres couvrent aussi l'audit, la tenue comptable et le conseil : **la part fiscale et sociale n'est pas publiée** (⚠️ V5923).
- **Charge administrative** : ≈ 60 Md€ mesurés en 2007 (« Standard Cost Model »), 70 Md€ selon la mission Margueritte en 2024, toutes normes confondues (repris du modèle T6, ⚠️ V5922). Le Conseil national d'évaluation des normes ne couvre que les collectivités : il n'apporte rien sur les entreprises.

**Calcul.** Base de chiffre d'affaires : 5 012,5 Md€ pour les secteurs marchands non agricoles et non financiers en 2022 ([Insee Analyses n° 101](https://www.insee.fr/fr/statistiques/8295813), Ésane, 05/12/2024 ; ✅ V5914), dont 34,3 % pour les micro-entreprises (13,0 %) et PME (21,3 %), soit ≈ 1 719 Md€.
- **H9.** Taux sur les micro-entreprises et PME : bas 0,82 % ; central 1,22 % ; haut 2,0 % du chiffre d'affaires. La fourchette de la Commission est de 1 à 2 % ; j'applique pour le bas et le central un facteur 139/170 (heures de la France rapportées à la moyenne UE) puisque la France est moins chargée que la moyenne sur ce critère. ⚠️ V5915
- **H10.** Taux sur les grandes entreprises : 0,05 / 0,10 / 0,20 % du chiffre d'affaires (hypothèse de Claude). ⚠️ V5916
- **H11.** Ménages : 0,5 / 1,0 / 2,0 Md€, repris de T6 (1, 2 ou 4 heures par foyer et honoraires de conseil). ⚠️ V5917

| Md€ par an | Bas | Central | Haut |
|---|---|---|---|
| Micro-entreprises et PME | 14,0 | 21,0 | 34,4 |
| Grandes entreprises | 1,6 | 3,3 | 6,6 |
| Ménages | 0,5 | 1,0 | 2,0 |
| **Conformité, strict** | **16,2** | **25,3** | **43,0** |
| en % des prélèvements obligatoires | 1,3 % | 2,0 % | 3,4 % |
| Rappel T6, sens large (paie, comptabilité de base, conseil, CIR) | 26 | 41 | 57 |

**Deux définitions à ne pas confondre.** Le chiffre « strict » ne couvre que les obligations fiscales et sociales (méthode de la Commission). Le modèle T6 y ajoute la comptabilité de base, la paie et le conseil, d'où 41 Md€ au central. Ma valeur centrale (25,3) tombe sous celle de T6 (41), ce qui est cohérent avec cette différence de périmètre. **Recoupement partiel** : si 30 % du chiffre d'affaires des cabinets comptables (28 Md€ en 2024) relevait du fiscal et du social, cela ferait 8 Md€ de dépenses externes ; le reste de ma valeur centrale serait du temps interne. Je n'ai aucune source pour ce 30 %, il sert seulement à vérifier que l'ordre de grandeur n'est pas absurde.

## 3. Comparaison : Estonie, Pays-Bas, Allemagne

| | Coût public de collecte pour 100 de recettes (2022) | Part des recettes publiques collectée | Cotisations sociales incluses | Heures de conformité d'une PME type | Indice de conformité, % des prélèvements |
|---|---|---|---|---|---|
| France (périmètre OCDE) | 0,56 | 44,4 % | non | 139 | 2,02 |
| **France (périmètre complet, central)** | **0,60 (sur les prélèvements 2024)** | — | oui | 139 | 2,02 |
| Estonie | 0,19 | 86,3 % | oui (37,7 % des recettes) | 50 | 0,73 |
| Pays-Bas | 0,75 | 76,5 % | oui (31,2 %) | 119 | 1,73 |
| Allemagne | 1,26 | 45,0 % | non | 218 | 3,17 |

Sources : [fiches OCDE, *Tax Administration 2024*](https://www.oecd.org/tax/forum-on-tax-administration/publications-and-products/tax-administration-series-country-snapshot-EST.pdf) (exercice 2022, remplacer EST par FRA, NLD ou DEU ; lues le 03/11/2026) ; Doing Business 2020. L'indice de conformité n'est **pas une mesure** : c'est la valeur centrale française mise à l'échelle du rapport des heures (⚠️ V5920). Aucune donnée comparable en euros n'existe pour le coût de conformité total des quatre pays.

**Lecture.**
- **Fait** : l'Estonie et les Pays-Bas ont déjà un collecteur quasi unique (86 % et 76 % des recettes publiques, cotisations comprises). Leur coût de collecte diffère pourtant par quatre : 0,19 contre 0,75. L'unification ne fixe donc pas le coût par elle-même ; l'Estonie cumule petite taille, numérisation poussée (96,5 % de déclarations d'impôt sur le revenu par voie électronique) et impôt sur les sociétés limité aux distributions.
- **Fait** : la France, au périmètre complet, coûte 0,60 %, du même ordre que les Pays-Bas (0,75). L'écart avec l'Estonie, à périmètre comparable, représente 5,2 Md€ par an au maximum (c'est le scénario haut).
- **Opinion** : l'Allemagne (1,26) est un contre-exemple partiel : son système fédéral sépare Bund et Länder et ne collecte pas les cotisations ; le ratio est donc gonflé par un périmètre différent autant que par la complexité.

## 4. Ce que le prélèvement unique pourrait économiser

**Périmètre du scénario** (`plan.md` § 9) : un prélèvement à la source sur tout ce qui sort des entreprises, un seul collecteur, facturation électronique obligatoire ; **TVA et accises conservées** (fiscalité d'orientation). Il s'agit d'un régime de croisière, après la transition.

**Hypothèses.**
- **H12 (privé).** Part du coût de conformité évitée, par type d'impôt (répartition d'après la Commission : impôt sur les sociétés 21 %, TVA 19 %, autres impôts et cotisations 60 %) :

| Part évitée | Bas | Central | Haut |
|---|---|---|---|
| Impôt sur les sociétés | 50 % | 80 % | 95 % |
| TVA (conservée) | 0 % | 10 % | 25 % |
| Autres (cotisations, taxes foncières et locales…) | 30 % | 60 % | 85 % |
| **Part évitée du total** | **28 %** | **55 %** | **75 %** |

Le modèle T6 retient 40, 59 et 79 % pour son périmètre élargi ; les deux jeux d'hypothèses sont proches. ⚠️ V5918
- **H13 (public).** Le ratio coût public / prélèvements converge vers : bas, celui des Pays-Bas (0,75 %, supérieur au ratio français actuel : économie nulle) ; central, le milieu entre le ratio actuel (0,60 %) et l'Estonie (0,19 %), soit 0,40 % ; haut, l'Estonie (0,19 %).

| Économie en Md€ par an | Bas | Central | Haut |
|---|---|---|---|
| Publique (administrations) | 0 | 2,6 | 5,2 |
| Privée (conformité) | 4,6 | 13,8 | 32,4 |
| **Total** | **4,6** | **16,4** | **37,6** |
| en % du PIB | 0,16 % | 0,56 % | 1,28 % |

**Sensibilité (central).** Si la part évitée du privé est moitié moindre, l'économie tombe à 9,5 Md€ ; si elle est supérieure de moitié, elle monte à 23,3 Md€.

**Ce n'est pas un gain budgétaire.** Seule l'économie publique (0 à 5,2 Md€) allège les dépenses de l'État. Le reste est le coût évité par les entreprises et les ménages : il devient une richesse réelle seulement si les personnes libérées retrouvent un emploi productif ailleurs, sinon c'est un transfert vers des chômeurs. Il n'est pas imputable au financement du socle.

### Emplois concernés et reconversions (« ne perdre personne »)

- **H14.** Emplois privés : ratio du modèle T6 (437 000 emplois-équivalents pour 41 Md€, soit 10 700 par Md€), appliqué à l'économie privée. Emplois publics : ETPT fiscaux estimés à 69 600 (47 500 pour le programme 156 au prorata du titre 2, 4 100 pour la douane à 25 %, 15 000 pour l'Urssaf ⚠️ ordre de grandeur, 3 000 pour les autres), multipliés par la part d'économie publique. Départs en retraite : 2,6 % par an (Métiers 2030, repris de T6), sans remplacement. ⚠️ V5919

| | Bas (bascule sur 15 ans) | Central (10 ans) | Haut (5 ans) |
|---|---|---|---|
| Emplois privés concernés | 49 000 | 147 200 | 345 800 |
| Emplois publics concernés (ETPT) | 0 | 23 900 | 47 700 |
| **Personnes à reconvertir**, après retraites | **0** | **82 800** | **324 900** |
| Coût ponctuel des reconversions (29 000 / 10 000 / 5 000 € par personne, T6 H12) | 0 | 0,83 Md€ | 1,62 Md€ |

Le rythme décide de tout, comme dans T6 : sur 15 ans, les départs en retraite absorbent presque tout ; sur 5 ans, il faut reconvertir plus de 60 000 personnes par an. Le gain budgétaire public repose sur l'attrition naturelle des agents (statut de fonctionnaire : pas de licenciement, mais redéploiement). Pour la liste des métiers d'accueil (contrôle de gestion, numérique, contrôle et accompagnement des usagers, enseignement, santé et aide à la personne, métiers techniques), voir `modeles/industrie-complexite/resultats.md` § 5 ; je n'ai pas refait ce travail. **Précédents** : vignette automobile (350 sur 380 ETP redéployés à la DGI), marché unique de 1993 (2 500 emplois de douane libérés).

## 5. Steelman et limites

**La meilleure objection.**
1. **La complexité finance aussi des choix politiques ciblés.** Chaque niche, taux réduit ou crédit d'impôt répond à une demande (soutien à la recherche, à l'emploi à domicile, au logement) et sa gestion fait vivre une expertise. Supprimer la complexité supprime l'instrument. Le crédit d'impôt recherche (8,0 Md€) en est l'exemple : il n'existe que parce que l'État veut orienter la recherche privée. **Réponse** : la complexité a un prix mesurable (ici 1 à 4 % des prélèvements) et la question est de savoir si l'objectif ciblé vaut ce prix ; l'auteur propose de remplacer les niches par des modulations votées en petit nombre. Le piège est qu'une modulation est une niche (voir le plan, § 9) : la complexité se reconstitue si chaque vote ajoute un critère.
2. **Une partie du coût subsiste.** La comptabilité est exigée par le droit commercial et par la gestion de l'entreprise, indépendamment de l'impôt ; les employeurs déclarent toujours des salaires ; la TVA est conservée ; les distributions et les prix de transfert demandent un contrôle. Mes parts évitées (28 à 75 %) en tiennent compte, mais la répartition entre « fiscal » et « comptabilité » est le point le moins bien mesuré (V5918, V5923).
3. **La conformité n'est pas du gaspillage pur.** Une partie sert à l'entreprise elle-même (connaître ses marges, sa trésorerie, préparer un crédit). La Commission mesure des coûts d'obligation, pas leur utilité privée résiduelle.
4. **La France n'est pas la plus lourde.** Le coût public est proche de celui des Pays-Bas et le temps de conformité d'une PME type inférieur à la moyenne UE. L'économie centrale suppose de viser l'Estonie, pas la moyenne.
5. **Ce qui contredit le plus la thèse.** L'économie budgétaire (0 à 5,2 Md€) est faible à côté des montants du simulateur (déficit supplémentaire d'environ 196 Md€ à 50 % et 1 000 €). Le prélèvement unique se défend par la justice entre petits et grands (la conformité pèse relativement plus sur les petits : la Commission le dit pour toute l'UE) et par la productivité, pas par l'équilibre des comptes.

**Limites de ce chiffrage.**
- Toutes les données de conformité sont déclaratives (enquêtes) ou hypothétiques ; aucune mesure française récente n'existe (la dernière, de 2007, couvre toutes les normes).
- Mon coût de conformité repose surtout sur un taux de la Commission appliqué à une base de chiffre d'affaires que j'ai reconstituée (V5914, V5915).
- Pas de comparaison en euros pour les quatre pays : seulement des heures d'une entreprise type, issues d'une source arrêtée (V5921).
- Le coût public des collecteurs dispersés est en grande partie estimé (V5913).
- Le contre-factuel « automatisation » n'est pas soustrait : une partie de la baisse viendrait de toute façon de l'intelligence artificielle (voir T6).

## 6. État de la recherche

**Établi.**
- La conformité fiscale représente un coût réel pour les entreprises, de l'ordre de 1 à 2 % du chiffre d'affaires en Europe, et pèse relativement plus sur les petites (VVA/KPMG 2022 ; PE 642.353).
- La complexité et l'incertitude des règles augmentent le coût plus que le niveau des taux (PE 642.353).
- Les pays nordiques et baltes, dont l'Estonie, ont les coûts de conformité les plus bas selon plusieurs indicateurs (PE 642.353).

**Débattu.**
- La comparabilité : les enquêtes déclaratives, les classements fondés sur des entreprises types et les ratios au chiffre d'affaires donnent des classements différents (la Hongrie est parmi les pires dans Doing Business, parmi les meilleures dans l'enquête de la Commission). Le Parlement européen juge Doing Business le plus neutre, malgré l'arrêt de la série pour irrégularités de données (France non visée).
- Le rôle du numérique : la déclaration électronique réduit surtout le coût des administrations, peu celui des entreprises (PE 642.353, p. 16).

**Manque.**
- Une mesure française récente et publique du coût de conformité fiscale et sociale (le modèle de coût standard de 2007 n'a jamais été actualisé, selon les documents du Sénat repris dans T6).
- La ventilation du chiffre d'affaires des cabinets par mission.
- Le coût de recouvrement de la MSA, de l'Agirc-Arrco et des caisses.
- Une évaluation ex post d'une unification des collecteurs (les Pays-Bas et l'Estonie y sont depuis longtemps ; il n'y a pas d'avant-après récent).

## 7. Synthèse des sources mobilisées

| Source | D'où | Ce qu'elle établit |
|---|---|---|
| [PAP 2026, Gestion des finances publiques](https://www.assemblee-nationale.fr/dyn/contenu/visualisation/1087984/file/PAP2026_BG_Gestion_finances_publiques_GA.pdf) | Projet de loi de finances 2026 | Crédits des programmes 156 et 302, ETPT, taux d'intervention DGFiP 0,54 % (2024), coût combiné 0,55 % |
| [PLACSS 2023, annexe 6](https://questions.assemblee-nationale.fr/dyn/contenu/visualisation/833190/file/annexe%206%20organisme%20s%C3%A9curit%C3%A9%20sociale%20gestion%20performance%20simplification.pdf) | Direction de la sécurité sociale | Budgets de gestion exécutés 2022-2023 par branche, dont recouvrement et MSA |
| `sources/donnees/impots_couts_collecte.csv` (REPSS Financement 2025) | Inventaire du projet | Coût Urssaf 24,7 centimes pour 100 € ; charges 1 570 M€ nets |
| [OCDE, *Tax Administration 2024*, fiches pays](https://www.oecd.org/tax/forum-on-tax-administration/publications-and-products/tax-administration-series-country-snapshot-EST.pdf) | Forum on Tax Administration, exercice 2022 | Coût de collecte, part des recettes publiques collectée, cotisations incluses ou non |
| [VVA/KPMG, rapport final (2022)](https://op.europa.eu/en/publication-detail/-/publication/70a486a9-b61d-11ec-b6f4-01aa75ed71a1/language-en) | Commission européenne, DG GROW | Coût moyen de conformité des PME : 14 745 €, répartition par impôt, taille, externalisation |
| [PE 642.353 (2023)](https://www.europarl.europa.eu/RegData/etudes/STUD/2023/642353/IPOL_STU(2023)642353_EN.pdf) | Parlement européen, sous-commission FISC | 1 à 2 % du chiffre d'affaires ; limites de comparabilité ; heures Doing Business UE-27 |
| [Doing Business 2020, profils pays](https://archive.doingbusiness.org/content/dam/doingBusiness/country/f/france/FRA.pdf) | Banque mondiale (source arrêtée) | 139 / 50 / 119 / 218 heures par an (France, Estonie, Pays-Bas, Allemagne) |
| [Insee, fiche secteur 692](https://www.insee.fr/fr/statistiques/7763830) | Insee, Ésane | 22,0 Md€ de chiffre d'affaires et 166 000 ETP des activités comptables (2021) |
| `modeles/industrie-complexite/` (T6) | Projet | Industrie de la complexité au sens large, ratio emplois par Md€, retraites, coût de reconversion |

Recherches sans résultat : ventilation par mission du chiffre d'affaires des cabinets (Ordre des experts-comptables), coût propre de la douane, coût de conformité de la France dans le rapport de la Commission (graphiques sans valeurs lisibles), étude du CNEN sur les entreprises (le CNEN ne traite que les collectivités), Paying Taxes de PwC (hors accès).
