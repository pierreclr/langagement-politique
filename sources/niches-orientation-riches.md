---
titre: Les niches qui orientent l'argent des plus fortunés : inventaire des 465 dépenses fiscales du PLF 2026 et focus dons et mécénat
date: 2026-11-05
statut: brouillon sourcé ; inventaire complet (`sources/inventaire-niches-fiscales.csv`, contrôlé par `sources/calculs/inventaire_niches.py`) ; la concentration par niche n'est sourcée que pour une dizaine de dispositifs ; vérifications V13520 à V13531 ; le modèle v5.7 et le bilan global ne sont PAS modifiés
---

# Les niches qui orientent l'argent des plus fortunés

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 05/11/2026. **Demande de l'auteur** : recenser toutes les niches qui permettent aux plus fortunés d'orienter leur argent grâce aux impôts qu'ils déduisent (exemple : un don à une église, déduit en grande partie), et dire ce que devient chacune dans notre système. **Ce que ce document fait** : (1) l'inventaire des 465 dépenses fiscales du tome II de *Voies et moyens* (PLF 2026), avec leur sort dans le modèle v5.7 ; (2) les 30 niches les plus coûteuses et les plus orientées vers le haut ; (3) un focus sur les dons et le mécénat ; (4) la liste de ce que l'auteur doit décider. **Ce qu'il ne fait pas** : il ne touche ni au modèle ni au bilan global.

**Mon risque ici : la complaisance et le biais de confirmation.** Le sujet plaît (« les riches optimisent grâce à l'État »). Or (a) la concentration par niche n'est **sourcée que pour une dizaine** de dispositifs sur 465 : pour les autres, j'écris « structurel, non sourcé », c'est mon jugement ; (b) pour les dons, **la part du dernier centile n'est pas publiée** dans ce que j'ai pu lire ; (c) le classement (a) à (e) est ma lecture des lignes du bilan, pas une décision de l'auteur ; (d) mon modèle de réaction des dons (section 3.6) est un exercice à hypothèses, pas une mesure.

---

## 1. L'inventaire : 465 dépenses fiscales, 88,3 Md€ en 2026

**Source** : *Évaluation des voies et moyens, tome II, Dépenses fiscales*, annexe au PLF 2026, ministère de l'Économie, octobre 2025, copie locale `voies_moyens_t2_2026.pdf` (252 pages, extraite avec pypdf, consultée le 05/11/2026) ; document publié sur [budget.gouv.fr](https://www.budget.gouv.fr/) (adresse exacte du PDF non rechargée ⚠️). **Fichier** : `sources/inventaire-niches-fiscales.csv` (une ligne par fiche : numéro, intitulé, impôt, coût 2024 / 2025 / 2026 bruts et retenus, bénéficiaires, fiabilité, méthode, référence CGI, mission, page, statut, motif, finalité d'orientation, concentration). **Contrôle** : `python3 sources/calculs/inventaire_niches.py`. **Reproduction** : `sources/calculs/inventaire_niches_extraction.py` puis `inventaire_niches_classement.py`.

**Total retrouvé à l'unité près** : 89 406 M€ (2024, réalisé), 91 834 M€ (2025, prévision), **88 269 M€ (2026, prévision)**, ainsi que les 17 totaux par impôt de la page 16 (V13521). La règle de totalisation du tome II, que j'ai retrouvée en testant : « nc » (non chiffrable) est repris à la valeur de l'année précédente ; « ε » (moins de 0,5 M€) et « - » valent zéro. Le tome II ne dit pas cette règle : sans elle, le total 2026 tomberait à 79,6 Md€. **Fiabilité du chiffrage** (déclarée par fiche) : 189 « très bonne », 83 « bonne », **124 « ordre de grandeur »**, 69 non renseignées. **Bénéficiaires** : 192 fiches sans nombre (« non déterminé »). **88 fiches sont « nc » en 2026.**

### Sort dans le modèle v5.7

Règle de classement (lecture de document de travail de l'atelier, non publié, lignes P01 à P11, N08 à N17, D14) :

| Cas | Définition retenue | Fiches | Coût 2026 (Md€) | Part |
|---|---|---|---|---|
| **(a)** | impôt supprimé **et** nommé dans une ligne comptée du bilan : IR (P03, « le modèle supprime l'impôt et ses crédits », V6684), IFI (P08), CFE et CVAE (P06), taxe foncière (P07), droits de succession (P09, remplacés par N06) | 238 | **42,64** | 48,3 % |
| **(b)** | l'impôt disparaît (ou est réformé) mais **aucune ligne ne nomme** le dispositif : taxe d'habitation, droits d'enregistrement hors successions, prélèvement sur les capitaux décès de l'assurance-vie | 27 | **0,18** | 0,2 % |
| **(c)** | niche explicitement supprimée ou modifiée **et comptée** : CIR (D14, 8,0), accises énergie (N10, comptées à 40 % au central), TVA restauration (N10), TVA rénovation énergétique (N11) | 40 | **18,91** (dont ≈ 11,8 effectivement comptés) | 21,4 % |
| **(d)** | explicitement maintenue : TVA 10 % travaux (décision 4 du 05/11) ; et, **de fait**, trois niches de retraités (abattement de 10 % sur les pensions, abattement personnes âgées, plus-values des pensionnés) parce que la voie R maintient « à l'identique » l'impôt des retraités (N01) ⚠️ | 4 | **7,16** | 8,1 % |
| **(e)** | sur un impôt maintenu (TVA, IS, accises hors N10, taxes sur les véhicules, TGAP) et **non décidée** | 156 | **19,38** | 22,0 % |
| | **Total** | **465** | **88,27** | 100 % |

**Lecture sans détour.**
1. **Près de la moitié du coût (48 %) disparaît « gratuitement »** avec l'IR : aucune niche n'a été décidée une à une, l'impôt disparaît d'un bloc. Ce n'est pas une décision sur les niches, c'est une conséquence. **79 de ces fiches, pour 21,9 Md€, ont une finalité d'orientation** (dons, épargne, investissement locatif, outre-mer, capital de PME, emploi à domicile). Leur finalité s'éteint avec l'impôt sans que personne l'ait choisi : c'est le sujet de l'auteur.
2. **Le piège de (a) contre (b)** : le coût de la niche n'est jamais une ligne séparée dans le bilan ; il est « compté » parce que la recette de l'impôt entier l'est. Je classe (a) quand cet impôt a une ligne, (b) quand il n'en a pas. Autre lecture possible, plus sévère : tout IR est « sans décision » (b). Je l'écarte, mais l'auteur peut trancher (V13520).
3. **(c) est surestimé si on le lit au coût** : seuls ≈ 11,8 Md€ sont comptés (CIR 8,0 en entier ; accises 3,0 ; restauration ≈ 0,7 ; rénovation +0,1), le reste est un coût de niche dont une fraction est reprise.
4. **(e) pèse 19,4 Md€** : l'IS reste à 25 %, la TVA et les accises restent, donc leurs niches restent, sans décision. C'est là qu'on retrouve les niches « riches » d'entreprise : mécénat d'entreprise 1,73 Md€, régime de la propriété industrielle à 10 % 1,26 Md€, SIIC et SPPICAV 1,05 Md€.
5. **Le CSV garde, par ligne, le motif** (colonne `motif_statut`) : une ligne mal classée se corrige sans toucher au reste.

Détail par impôt et statut : IR 167 (a), 3 (d) ; retenues à la source 1 (a) ; IR et IS 1 (c), 52 (e) ; IS 38 (e) ; TVA 2 (c), 1 (d), 43 (e) ; accises 37 (c) ; enregistrement et timbre 25 (a), 24 (b) ; taxes d'urbanisme 1 (b) ; autres droits 23 (e) ; IFI 5 (a) ; impôts locaux : 40 (a), 2 (b).

---

## 2. Les 30 niches les plus coûteuses et les plus orientées vers le haut

**Critère.** Je retiens les dispositifs où la concentration vers le haut est établie par une source, ou « structurelle » : avantage proportionnel au taux marginal, réservé aux foyers très imposés, ou à un nombre réduit de bénéficiaires. **J'ai 38 candidats ; seuls 6 ont un chiffre de concentration sourcé** (colonne « Niveau »). Classés par coût 2026. Coûts en M€ (2024 réalisé / 2025 / 2026).

| # | N° | Dispositif | Impôt | Coût 2024 / 2025 / 2026 | Bénéficiaires | Statut | Niveau |
|---|---|---|---|---|---|---|---|
| 1 | 110246 | Crédit d'impôt au titre de l'emploi d'un salarié à domicile | IR | 6 420 / 7 029 / 7 208 | 4 909 243 Ménages | a | fort (non officiel) |
| 2 | 520110 | Exonération partielle, sous certaines conditions, de droits de mutati… | Enregistrement et timbre | 5 000 / 4 000 / 4 000 | Non déterminé | a | très fort |
| 3 | 110201 | Réduction d'impôt au titre des dons | IR | 1 990 / 2 204 / 2 204 | 5 621 930 Ménages | a | fort |
| 4 | 130201 | Déduction des dépenses de réparations et d'amélioration | IR | 1 990 / 1 990 / 1 990 | 1 942 000 Ménages | a | fort (structurel, non sourcé) |
| 5 | 210309 | Réduction d'impôt au titre des dons faits par les entreprises à des œ… | IR et IS | 1 635 / 1 730 / 1 730 | 157 399 Entreprises | e | fort (entreprises) |
| 6 | 110261 | Réductions d'impôt sur le revenu en faveur de l'investissement locati… | IR | 1 469 / 1 459 / 1 349 | 384 000 Ménages | a | fort (structurel, non sourcé) |
| 7 | 210326 | Taxation au taux de 10% des revenus issus de certains actifs de propr… | IR et IS | 1 199 / 1 258 / 1 258 | 1 065 Entreprises | e | fort (structurel, non sourcé) |
| 8 | 110224 | Réduction d'impôt sur le revenu à raison des investissements producti… | IR | 775 / 825 / 831 | 55 898 Ménages | a | fort (structurel, non sourcé) |
| 9 | 140119 | Exonération ou imposition réduite des produits attachés aux bons ou c… | IR | 582 / 595 / 569 | Non déterminé | a | fort (structurel, non sourcé) |
| 10 | 300210 | Exonération des sociétés de placement à prép ondérance immobilière à… | IS | 600 / 556 / 556 | 280 Entreprises | e | fort (structurel, non sourcé) |
| 11 | 300206 | Exonérations des produits retirés par les sociétés d'investissements… | IS | 648 / 492 / 492 | 234 Entreprises | e | fort (structurel, non sourcé) |
| 12 | 140117 | Exonération des dividendes capitalisés sur un plan d'épargne en actio… | IR | 428 / 487 / 487 | Non déterminé | a | fort (structurel, non sourcé) |
| 13 | 730222 | Taux de 10 % pour les ventes et livraisons à soi-mê me, à des investi… | TVA | 225 / 275 / 385 | Non déterminé | e | fort (structurel, non sourcé) |
| 14 | 120402 | Abattements des articles 150-0 D ou 150-0 D ter du CGI au gain d'acqu… | IR | 189 / 241 / 245 | 13 751 Ménages | a | fort (structurel, non sourcé) |
| 15 | 110252 | Réduction d'impôt sur le revenu majorée en faveur de l'investissement… | IR | 189 / 169 / 176 | 72 945 Ménages | a | fort (structurel, non sourcé) |
| 16 | 440201 | Réduction d'impôt au titre de certains dons | IFI | 150 / 160 / 160 | 35 010 Ménages | a | fort (structurel) |
| 17 | 150518 | Abattement majoré appliqué aux plus-values sur cessions de titres acq… | IR | 196 / 152 / 152 | 7 473 Ménages | a | fort (structurel, non sourcé) |
| 18 | 300203 | Exonération des sociétés de capital-risque (SCR) | IS | 98 / 148 / 148 | 30 Entreprises | e | fort (structurel, non sourcé) |
| 19 | 580102 | Suppression du prélèvement de 20 % sur les capitaux décès lorsque le… | Enregistrement et timbre | 120 / 120 / 120 | Non déterminé | b | fort (structurel, non sourcé) |
| 20 | 150708 | Exonération des gains de cession de valeurs mobilières réalisés dans… | IR | 100 / 101 / 101 | Non déterminé | a | fort (structurel, non sourcé) |
| 21 | 150515 | Abattement fixe applicable aux cessions de titres ou droits par les d… | IR | 84 / 78 / 75 | 3 578 Entreprises et ménages | a | fort (structurel, non sourcé) |
| 22 | 110216 | Réduction d'impôt au titre des souscriptions en numéraire au capital… | IR | 76 / 52 / 53 | 46 495 Ménages | a | fort (structurel, non sourcé) |
| 23 | 440102 | Exonération partielle des bois et forêts, des parts de groupement for… | IFI | 46 / 49 / 52 | 26 087 Ménages | a | fort (structurel, non sourcé) |
| 24 | 110218 | Réduction d'impôt au titre de la souscription de parts de fonds commu… | IR | 54 / 29 / 50 | 29 528 Ménages | a | fort (structurel, non sourcé) |
| 25 | 110249 | Réduction d’impôt sur le revenu au titre des dépenses de restauration… | IR | 37 / 44 / 45 | 5 119 Ménages | a | fort (structurel, non sourcé) |
| 26 | 120128 | Exonération de la rente viagère lorsqu'un PEA se dénoue après 5 ans o… | IR | 44 / 44 / 44 | Non déterminé | a | fort (structurel, non sourcé) |
| 27 | 110251 | Réduction d'impôt sur le revenu en faveur de l'investissement locatif… | IR | 34 / 30 / 38 | 16 859 Ménages | a | fort (structurel, non sourcé) |
| 28 | 110250 | Réduction d'impôt sur le revenu au titre des investissements locatifs… | IR | 39 / 35 / 37 | 25 367 Ménages | a | fort (structurel, non sourcé) |
| 29 | 110259 | Réduction d'impôt sur le revenu en faveur des investissements locatif… | IR | 41 / 37 / 37 | 15 781 Ménages | a | fort (structurel, non sourcé) |
| 30 | 110244 | Réduction d’impôt au titre des souscriptions en nu méraire, réalisées… | IR | 35 / 35 / 35 | 8 738 Ménages | a | fort (structurel, non sourcé) |

*Total des 30 : 24,6 Md€ en 2026, 28 % des dépenses fiscales.* « Fort (structurel, non sourcé) » = **mon jugement**, pas une donnée.

### Les dix plus concentrées sur le haut, avec leur niveau de preuve

| Rang | Niche (n°, coût 2026) | Ce que la source établit | Preuve |
|---|---|---|---|
| 1 | Pacte Dutreil, 520110 (4,0 Md€ au tome II ; 5,5 Md€ pour 2024 selon la Cour) | **65 % du montant pour 1 % des bénéficiaires** (110 personnes en 2024, ≈ 30 M€ chacune) | Cour des comptes 2025, **relayée par la presse spécialisée, rapport non lu** ⚠️ V13522 ; [IPP, nov. 2025](https://www.ipp.eu/wp-content/uploads/2025/11/Dutreil_CourDesComptes-6_compressed.pdf) (non lu) |
| 2 | Réduction d'impôt pour dons, 110201 (2,20 Md€) | **38 % des foyers du dernier décile donnent contre moins de 1 % du premier** ; don moyen ≈ 1 200 € en D10, 500 € en D9, 275 à 430 € de D1 à D8 (2021) | [DGFiP Statistiques n° 06, janv. 2024](https://www.seban-associes.avocat.fr/wp-content/uploads/2024/05/FOCUS-dgfip_analyse_06_dons_mecenat-1.pdf) (lu) |
| 3 | Mécénat d'entreprise, 210309 (1,73 Md€) | grandes entreprises : **49 % des dons** ; un tiers via des fondations d'entreprise ; 75 % des grandes donnent chaque année contre 10 % des TPE (2015-2021) | DGFiP n° 06 (lu). Concentration par taille, pas par revenu |
| 4 | Emploi à domicile, 110246 (7,21 Md€) | les deux derniers déciles ≈ **58 %** du crédit | **calcul sur un tableau d'amendement parlementaire** ⚠️ V13523, non officiel |
| 5 | Investissement locatif intermédiaire, 110261 (1,35 Md€) | 384 000 ménages ; réduction proportionnelle au prix du bien, réservée aux foyers qui paient l'impôt | structurel |
| 6 | Outre-mer productif, 110224 (0,83 Md€) | 55 898 ménages ; réduction moyenne ≈ 40 000 € par investisseur (propos du président de la Cour en 2016) | ⚠️ V13531, presse 2016 |
| 7 | Régime à 10 % de la propriété industrielle, 210326 (1,26 Md€) | 1 065 entreprises | structurel |
| 8 | SIIC et SPPICAV, 300206 et 300210 (1,05 Md€) | 234 et 280 entités | structurel |
| 9 | Dons au titre de l'IFI, 440201 (0,16 Md€) | réservée aux redevables de l'IFI (près de 133 000 foyers au 1er janvier 2018) ; don moyen des assujettis ISF/IFI jusqu'à dix fois celui des foyers à l'IR seul (≈ 6 000 € en 2021) | DGFiP n° 06 (lu) |
| 10 | Assurance-vie, décès (580102) et capitalisation (140119) (0,69 Md€) | aucune répartition lue | structurel |

**Ensemble des réductions et crédits d'impôt de l'IR (la seule donnée agrégée que j'ai pour tout le bloc).** En 2024, 12,8 millions de foyers (30,9 %) en bénéficient, pour **20 Md€** ; le montant moyen est de **2 538 € pour le dernier décile contre 49 € pour le premier** ; 45 % des crédits d'impôt (4 Md€) vont à des foyers non imposés ([DGFiP Statistiques n° 41, nov. 2025](https://www.impots.gouv.fr/sites/default/files/media/9_statistiques/0_etudes_et_stats/0_publications/dgfip_statistiques/2025/num41_11/dgfip_stat_41.pdf), lu). **Estimation de la part du dernier décile : ≈ 52 %** (2 538 € × ≈ 4,1 millions de foyers par décile ≈ 10,5 Md€, sur 20 Md€ ; le nombre de foyers vient de 12,8 M ÷ 30,9 % ; V13524). Sans détail par dispositif : le tableau 3 de la publication n'est lisible qu'en image. **À obtenir** : le fichier POTE ou une demande à la DGFiP.

---

## 3. Focus : dons et mécénat

### 3.1 Le droit (base LEGI locale, versions en vigueur et différées)

Lecture de `python3 outils/droit/lire_legi.py` (copie LEGI de 2026, consultée le 05/11/2026). Légifrance répond 403. Les articles 200 et 238 bis ont une version qui entre en vigueur le 01/01/2027 ; c'est celle que j'ai lue (contenu des modifications non comparé ⚠️ V13530).

| Dispositif | Taux | Plafond | Bénéficiaires |
|---|---|---|---|
| **CGI 200, 1** | **66 %** | **20 % du revenu imposable**, excédent reporté sur **cinq ans** (200, 1 bis) | fondations et associations reconnues d'utilité publique (a) ; œuvres d'intérêt général philanthropiques, éducatives, scientifiques, sociales, culturelles, sportives (b) ; établissements d'enseignement supérieur (c) ; **associations cultuelles et de bienfaisance et cultes reconnus d'Alsace-Moselle (e)** ; spectacle vivant (f) ; presse (f bis) ; forêts (f ter) ; **fonds de dotation (g)** ; fondations d'entreprise pour les seuls salariés et actionnaires, dans la limite de 1 500 € (a) |
| **CGI 200, 1 ter** | **75 %** | **2 000 €** dans le texte lu (la DGFiP écrit 1 000 € depuis 2020 : le relèvement n'a pas été relu ⚠️ V13530) | repas gratuits, logement, soins gratuits pour personnes en difficulté, aide aux victimes de violences domestiques ; sans effet sur le plafond de 20 % |
| Dons aux partis et candidats | 66 % | 15 000 € par an pour les partis ; 4 600 € par élection pour les candidats (DGFiP n° 06) | partis politiques, candidats |
| **Cultes** | 66 % (**75 % seulement du 2 juin au 31 décembre 2021**, 150 M€ déclarés par 520 000 foyers) | 20 % du revenu imposable | associations cultuelles : le taux de 75 % **n'apparaît pas** dans le texte lu |
| **CGI 978** (IFI) | **75 %** | **50 000 € de réduction** (imputation sur l'IFI, dons en numéraire et titres cotés) | recherche, enseignement supérieur, fondations reconnues d'utilité publique, structures d'insertion, ANR ; **pas de cultes** |
| **CGI 238 bis** (entreprises IR ou IS) | **60 %** jusqu'à 2 M€ de dons, **40 %** au-delà (depuis 2020) | **5 ‰ du chiffre d'affaires**, ou 20 000 € pour les TPE et PME qui dépassent (DGFiP n° 06 ; le paragraphe 2 du texte a été tronqué par l'outil, ⚠️) ; excédent reporté 5 ans | mêmes organismes que 200, plus musées de France, cultes (b), fonds de dotation (g), Fondation du patrimoine ; dons en nature valorisés au coût de revient ; mécénat de compétences plafonné à trois fois le plafond de la sécurité sociale ; **contreparties ≤ 25 %** du don (admis par le ministère de la Culture) |
| **Fondation abritée** | dons faits à une fondation reconnue d'utilité publique pour le compte d'une œuvre (CGI 200, 2) : **même réduction de 66 %** que si le don allait à l'œuvre | idem | l'abritante est reconnue d'utilité publique ; l'abritée n'a pas de personnalité propre |
| **Fonds de dotation** | 66 % (200, 1, g) et 60 % (238 bis, g) | idem | s'il répond à l'intérêt général ou reverse ses revenus à des organismes éligibles |

**Exemple : un million d'euros donné à une église.** Au taux de 66 %, la réduction est de 660 000 €, **mais plafonnée à 20 % du revenu imposable de chaque année, avec cinq ans de report** (donc six années de plafond). Pour déduire les 660 000 €, il faut un **revenu imposable d'au moins 833 000 € par an** pendant six ans (1 000 000 ÷ 0,2 ÷ 6) et un impôt d'au moins 110 000 € par an à effacer. Alors le million ne coûte que **340 000 €**. Sur la voie IFI (978), l'imputation est plafonnée à 50 000 € : le même million ne se réduit que de 5 %. Pour une entreprise (238 bis), un million donné en une année suppose un chiffre d'affaires d'au moins 200 M€ (5 ‰), et coûte 400 000 € après 60 %. **Donc : l'auteur a raison que la fraction est grande ; la contrainte réelle est le plafond de 20 % du revenu, qui réserve les gros dons à ceux qui ont de gros revenus.** Ce n'est pas un contournement, c'est la règle (calcul de Claude).

### 3.2 Coût, concentration, bénéficiaires

| | Chiffre | Source |
|---|---|---|
| Coût 2024 / 2025 / 2026 de la réduction des particuliers (110201) | 1 990 / 2 204 / 2 204 M€ ; 5,62 millions de ménages | tome II, fiche 110201 |
| Coût du mécénat d'entreprise (210309) | 1 635 / 1 730 / 1 730 M€ ; 157 399 entreprises | tome II, fiche 210309 |
| Dons de l'IFI (440201) | 160 M€ ; 35 010 ménages | tome II, fiche 440201 |
| Dons déclarés en 2021 | **5,9 Md€** : 3,3 particuliers à l'IR, 2,6 entreprises ; réductions **≈ 3,0 Md€** (1,7 particuliers, 1,4 entreprises) | DGFiP n° 06 |
| Donateurs 2021 | 5,2 millions de foyers (13 % des foyers) ; don moyen 585 € (395 € en 2011) ; **109 300 entreprises** (33 900 en 2011) | DGFiP n° 06 |
| Concentration | **38 % des foyers du dernier décile donnent** (moins de 1 % du premier) ; don moyen D10 ≈ 1 200 € ; IFI : don moyen ≈ 6 000 € ; **la part du dernier centile dans les dons déduits n'est pas dans la publication** | DGFiP n° 06 |
| Répartition des dons des particuliers | ≈ 75 % à l'IR vers l'intérêt général ; **≈ 17 %** aide aux personnes en difficulté ; moins de 10 % IFI ; partis 65 M€ (125 M€ en 2013) ; cultes 150 M€ sur sept mois de 2021 | DGFiP n° 06 |
| Mécénat d'entreprise par bénéficiaire (2020, dons > 10 000 €) | fondations d'entreprise **plus d'un quart** ; établissements et associations de santé un dixième ; aide alimentaire et solidarités surtout par dons en nature du commerce | DGFiP n° 06 |

**Sur la demande « par secteur (social, culte, culture, enseignement, partis politiques) »** : la DGFiP ne publie pas la ventilation fine des dons des particuliers par secteur (elle ne distingue que : intérêt général, difficulté, partis, cultes depuis 2021, IFI). **Je n'ai pas de répartition culture / enseignement / social pour les particuliers** ; je ne l'invente pas.

### 3.3 Ce que dit la Cour des comptes

- **Mécénat d'entreprise, 2018** (*Le soutien public au mécénat des entreprises*, 28/11/2018) : le coût fiscal est passé d'environ **75 M€ (estimation de 2003) à 900 M€ en 2016-2017** ; le nombre d'entreprises bénéficiaires de 6 500 (2005) à près de 69 000 (2017) ; l'État ne mesure pas ce que son aide apporte ; la Fondation Louis Vuitton a reçu 518,1 M€ en onze ans (8,1 % du coût total de 2007 à 2017 ; construction de 790 M€ pour un budget initial de 100) ; recommandation de **plafonner l'avantage en valeur absolue**. Suites : le taux est tombé à 40 % au-delà de 2 M€ et une déclaration a été créée. **Rapporté par la presse spécialisée (legifiscal, carenews, sponsoring.fr) ; le rapport n'a pas été lu** ⚠️ V13525.
- **Dons des particuliers** : la Cour a adressé en 2021 un référé *La fiscalité des dons en faveur des associations* ; je n'ai lu que **la réponse du gouvernement** (l'administration juge la critique non fondée et dit que le suivi des dons reçus par les organismes ne permet pas de vérifier le bien-fondé de la dépense). ⚠️ V13525. **Je n'ai pas trouvé de rapport récent de la Cour intitulé « soutien public aux dons »** : si l'auteur en a le titre exact, je le lis.
- **IPP et Cour sur le Dutreil** : voir section 2 (coût multiplié par plus de quatre entre 2020-2021 et 2024).

### 3.4 Ce qui se passe dans notre système (v5.7)

1. **La réduction des particuliers (CGI 200) tombe d'elle-même.** L'IR est supprimé (P03) et le prélèvement unique à 42 % n'a pas de réduction : il n'existe plus d'impôt sur lequel imputer. **L'IFI (978) tombe d'elle-même** (P08). La taxe de 1 % sur l'immobilier et les parts n'ouvre pas de réduction non plus dans le modèle (aucune décision). **Un don d'un million ne coûtera donc plus 340 000 € mais un million**, y compris à l'église, aux partis (66 % jusqu'à 15 000 €) et à la Fondation du patrimoine. Statut : (a) pour 110201 et 440201.
2. **Le mécénat d'entreprise (238 bis) ne tombe pas** : l'IS reste à 25 % (P10). Il est en (e), non décidé : 1,73 Md€ de coût fiscal, concentré sur les grandes entreprises. **Asymétrie à nommer** : sans décision, le don d'un particulier perd toute aide tandis que celui de l'entreprise (donc de son actionnaire) la garde à 60 %. Un riche actionnaire peut faire donner sa société. Ce n'est pas cohérent avec « on ne favorise pas ».
3. **Les dons aux fondations abritantes** passent par l'IR (200) : ils tombent avec lui ; l'abritante garde ses avantages propres (exonération d'IS des fondations, droits de succession).
4. **Le chiffre qui compte** : le coût fiscal des dons des particuliers (2,2 Md€) est **déjà inclus** dans la suppression de l'IR du bilan ; supprimer sans relais ne change donc **aucune ligne** du solde (+14,93 Md€). Le « gain » de l'option (i) est nul par rapport à la v5.7 ; ce qui change, c'est ce que reçoivent les associations.

### 3.5 La réaction des dons : ce que dit la littérature

- **Fack et Landais (2010, *American Economic Journal: Economic Policy*, vol. 2, n° 2, p. 117-141)** : sur deux réformes qui ont relevé le taux du crédit de 32 %, l'élasticité-prix des dons en France est **« relativement faible mais croissante avec la taille des dons »** (résumé lu sur [EconPapers](https://econpapers.repec.org/RePEc:aea:aejpol:v:2:y:2010:i:2:p:117-41), texte intégral non lu : **je ne cite pas de valeur** ⚠️ V13526). Un papier de suivi des auteurs soutient que le durcissement du contrôle de 1983 a surtout supprimé des dons surdéclarés, non des dons réels : les élasticités mesurées mêlent comportement et fraude.
- **Almunia, Guceri, Lockwood et Scharf (2020, *Journal of Public Economics*, vol. 183, art. 104114)**, Royaume-Uni, toutes les déclarations d'auto-évaluation 2005-2013 : élasticité-prix totale d'environ **−0,3** (marge intensive ≈ −0,2, marge extensive ≈ −0,1) d'après le résumé publié ; **une version de travail antérieure donnait ≈ −1** (extensive ≈ −0,8). J'utilise la version publiée comme borne basse. ⚠️ V13526. Les auteurs concluent à un argument pour **augmenter** la subvention.
- **Bönke, Massarrat-Mashhadi et Sielaff (2013, *Public Choice*, vol. 154, p. 39-58)**, Allemagne : en tenant compte de l'éviction, la déductibilité provoque assez de dons privés **pour compenser la perte de recettes** ; valeurs d'élasticité non lues ⚠️ V13526.
- **Ce que la littérature ne dit pas** : l'effet d'une suppression totale dans un pays où les dons sont déjà établis (hystérèse) ; l'effet d'un plafond en euros uniforme (option (ii)) ; l'effet de la disparition simultanée de l'IR (effet de revenu : le prélèvement de 42 % laisse moins de revenu net aux plus aisés, et plus au bas de l'échelle avec l'allocation unique).
- **Ce que la DGFiP ajoute** : l'**habitude** explique l'essentiel : un foyer qui a donné l'année précédente a **72,2 points de pourcentage de chances de plus** de redonner (R² 0,57 avec cette variable contre 0,10 sans) ; être imposé à l'IR n'ajoute que 8,8 points, être redevable de l'IFI 27,2 points. L'incitation fiscale n'est **pas** l'objet de leur étude. Lecture de Claude : **l'effet de la suppression sera plus faible à court terme (l'habitude) que l'élasticité ne le suggère, et plus fort à long terme** (jeunes donateurs jamais recrutés).

### 3.6 Effet probable de la suppression sans relais, et chiffrage des options

**Hypothèses (⚠️ V13527)** : base 2021 de la DGFiP (dons des particuliers à l'IR 3,3 Md€, réductions 1,7 Md€, don moyen 585 €) ; **prix net d'un euro donné aujourd'hui = 1 − 1,7 ÷ 3,3 = 0,485** (taux effectif de 51,5 %, inférieur à 66 % à cause des plafonds) ; élasticité-prix constante e ; dons log-normaux autour de la moyenne (σ = 1, **non observé**, test à 0,8 et 1,2). Les montants de 2026 sont ≈ 1,3 fois plus élevés (2,204 ÷ 1,7). Calcul : `sources/calculs/inventaire_niches.py` (fonctions `option_i`, `option_ii`, `option_iii`).

**Option (i), supprimer sans relais (= la v5.7).** Le prix d'un euro donné double (0,485 → 1). Perte de dons des particuliers à l'IR :

| Élasticité | Dons restants (Md€) | **Perte pour les associations** (base 2021 ; entre parenthèses × 1,3 pour 2026) |
|---|---|---|
| −0,2 | 2,86 | **0,44** (0,58) |
| −0,5 | 2,30 | **1,00** (1,30) |
| −1,0 | 1,60 | **1,70** (2,21) |

La perte est **de 13 à 52 %** des dons des particuliers à l'IR ; sur l'ensemble des dons déclarés (5,9 Md€ en 2021), 7 à 29 %. L'effet est **plus fort sur les associations qui vivent de gros donateurs** (culture, fondations, enseignement supérieur) et sur celles dont les donateurs sont âgés et aisés (les plus de 70 ans donnent 700 € en moyenne). Dons aux associations cultuelles : 150 M€ sur sept mois en 2021 (avec le taux de 75 %, non reconduit).

**Option (ii), crédit remboursable plafonné en euros, identique pour tous.** 75 % des dons jusqu'à 1 000 € (crédit maximal de 750 €), versé même aux foyers non imposés. Le prix passe à 0,25 pour les premiers 1 000 € et à 1 au-delà. Avec σ = 1 (≈ 77 % des montants sous le plafond) :

| Élasticité | Dons versés (Md€) | **Coût budgétaire** (Md€/an) | Fourchette (σ de 0,8 à 1,2) |
|---|---|---|---|
| −0,2 | 3,56 | **2,18** | 1,95 à 2,40 |
| −0,5 | 4,07 | **2,66** | 2,38 à 2,93 |
| −1,0 | 5,30 | **3,70** | 3,32 à 4,08 |

Le coût est **comparable au coût actuel (2,2 Md€)** parce que le crédit s'étend aux non-imposés (l'IR actuel exclut la moitié des foyers) et que la baisse du prix augmente les dons sous le plafond. **Les gros dons (> 1 000 €) perdent toute incitation** : le prix de l'euro marginal redevient 1.

**Option (iii), abondement public (« matching »).** L'État ajoute 50 % aux dons jusqu'à 1 000 €, via une plateforme, sans réduction d'impôt (le donateur paie 1, l'association reçoit 1,5). Précédents : (1) **Gift Aid** au Royaume-Uni : l'association récupère un supplément de l'État sur les dons nets d'un donateur imposable (mécanisme décrit de mémoire : 25 pence par livre nette, ⚠️ non relu), coût de **plus de 1,8 Md£ en 2015-2016** selon l'introduction d'Almunia et al. (HMRC, 2018) ; (2) le **« cinque per mille » italien** : le contribuable affecte 5 ‰ de son impôt sur le revenu à l'association de son choix **sans dépenser un euro de plus** ; en 2023, **plus de 520 M€** répartis entre ≈ 81 000 bénéficiaires, dont 64 % aux entités du tiers secteur ([Agenzia delle Entrate, communiqué du 27/06/2024](https://agenziaentrate.gov.it/portale/documents/20143/6193318/030_Com.+st.+Cinque+per+mille+ammessi+esclusi+anno+2023+27.06.2024/f4305163-0135-5694-8825-658bb532f00d), vu par recherche, ⚠️ V13528). Une version « 5 ‰ » française est une **allocation du prélèvement** : 5 ‰ de 887 Md€ = **4,4 Md€** au maximum, bien plus que le coût actuel ; à 1 ‰, 0,9 Md€. Chiffrage de mon abondement à 50 % : coût **0,9 à 1,3 Md€**, dons reçus par les associations 3,1 à 4,2 Md€ selon l'élasticité.

**Option (iv), statu quo plafonné.** Garder une réduction de 66 % (recréer un crédit) en la plafonnant à 2 000 € : économie de **0,36 Md€** par rapport au coût actuel selon un amendement parlementaire (⚠️ source secondaire). Dans notre système, l'IR n'existant plus, ce n'est pas une économie mais une **dépense nouvelle d'environ 1,8 Md€** par an (2,2 − 0,36).

| Option | Coût pour l'État (Md€/an, par rapport à la v5.7) | Effet sur les dons des particuliers (base 3,3 Md€) |
|---|---|---|
| (i) supprimer sans relais (v5.7) | 0 | −0,44 à −1,70 (−13 à −52 %) |
| (ii) crédit 75 % jusqu'à 1 000 € | **2,2 à 3,7** (central 2,7) | +0,3 à +2,0 versés ; baisse des dons au-delà de 1 000 € |
| (iii) abondement 50 % jusqu'à 1 000 € | **0,9 à 1,3** | reçu net par les associations : −0,2 à +0,9 |
| (iv) crédit 66 % plafonné à 2 000 € | **≈ 1,8** | proche du statu quo |

### 3.7 Recommandation

**Option (ii), crédit remboursable de 75 % jusqu'à 1 000 € de dons par personne et par an, identique pour tous, sans report.** Raisons : (1) elle **n'est pas proportionnelle au revenu** : un million donné ne coûte plus 340 000 € mais 999 250 € à un riche comme à un pauvre, ce qui est précisément la demande de l'auteur ; (2) elle **réintroduit les non-imposés** (la moitié des foyers) et récompense le **nombre de donateurs**, canal sensible dans la littérature (marge extensive) ; (3) le coût central de **2,7 Md€** (2,0 à 4,1) est du même ordre que le coût actuel de 2,2 Md€, **pour une assiette de bénéficiaires bien plus large** ; (4) elle est neutre vis-à-vis des cultes (aucun taux spécial). **Condition** : elle coûte environ **0,26 point de taux plat** (2,7 Md€ ÷ ≈ 10,3 Md€ par point, ordre de grandeur à vérifier ⚠️) ; elle n'est donc **pas** dans le solde de +14,93 Md€ tant que l'auteur ne l'a pas décidée. **Si l'auteur veut zéro dépense** : (i), en assumant la perte de 13 à 52 % des dons des particuliers à l'IR, et décider (e) du mécénat d'entreprise dans le même sens (supprimer 238 bis, ou le plafonner en euros) pour **ne pas créer l'asymétrie** du point 3.4.2. **Ce que je ne recommande pas** : (iv), qui garde la proportionnalité au revenu, et le « 5 ‰ » complet (4,4 Md€, le double du coût actuel).

### 3.8 Steelman et contraintes juridiques

**Meilleure objection (steelman).** « Une niche sur les dons n'est pas un cadeau aux riches : c'est une **subvention décentralisée** qui laisse les citoyens, pas l'État, choisir les causes (recherche, culture, solidarité). La supprimer livre ces secteurs à la subvention publique, donc au jugement des fonctionnaires, ce que l'auteur refuse par ailleurs (il veut supprimer les aides attribuées selon le jugement d'agents sur la valeur des projets, P-062). » **Réponse** : l'argument vaut pour un don **orienté par tous** ; il ne vaut pas pour la proportionnalité au revenu, qui donne aux plus aisés **plus de voix** dans le choix des causes que les autres (38 % des foyers du dernier décile donnent contre moins de 1 % du premier). Le crédit plafonné (ii) garde la décentralisation et enlève l'avantage de poids. **Seconde objection** : « les dons sont peu élastiques et dominés par l'habitude, donc la suppression coûte peu aux associations. » **Réponse** : c'est vrai à court terme (section 3.5), pas à long terme ; et l'élasticité croît avec la taille des dons (Fack et Landais), précisément ceux des plus aisés.

**Laïcité et loi de 1905.** L'article 2 de la loi du 9 décembre 1905 dit que la République « ne reconnaît, ne salarie ni ne subventionne aucun culte » ; l'article 19 permet aux associations cultuelles de recevoir des dons. La réduction d'impôt pour les dons aux cultes (CGI 200, 1, e) est une **aide indirecte** que l'administration ne tient pas pour une subvention (position de principe, ⚠️ V13529, non relue dans cette séance). Dans nos options : (i) suppression : le problème disparaît ; (ii) crédit identique pour tous les dons éligibles : **un taux unique, sans traitement spécial des cultes** (le culte reste un bénéficiaire éligible parmi d'autres, comme aujourd'hui, sans le 75 % de 2021) ; (iii) abondement : l'État **verserait** de l'argent à une plateforme où figureraient des cultes, plus exposé à la lettre de l'article 2 que la déduction : **je recommande d'exclure les cultes de l'abondement (iii) s'il était retenu.** Les dons aux partis (15 000 € à 66 %) posent une question distincte (financement de la vie politique) : à traiter avec le chapitre démocratie.

**Droit de l'Union.** La Cour de justice a jugé dans l'**arrêt Persche (C-318/07, 27/01/2009, grande chambre, ECLI:EU:C:2009:33)** qu'un État membre ne peut refuser la déduction d'un don à un organisme d'intérêt général établi dans un autre État membre au seul motif de son établissement à l'étranger (libre circulation des capitaux, art. 56 CE) ; le don de M. Persche (≈ 18 180 €, en nature) allait à une maison de retraite au Portugal ; il revient à l'État de vérifier que l'organisme répondrait aux conditions nationales (résumés de la presse spécialisée et de la Cour, arrêt non relu ⚠️ V13529). **Conséquences** : (a) le CGI 200 vise déjà les organismes établis en Europe (DGFiP n° 06, note 2) ; (b) **notre crédit (ii) devra être ouvert aux organismes des autres États de l'Espace économique européen**, sous peine d'être contraire au traité ; la plateforme d'abondement (iii) aussi ; (c) cela rend le dispositif **vérifiable par un registre européen**, ce qui rejoint l'idée de la version européenne du manifeste. **Droit constitutionnel** : un crédit uniforme n'a pas de risque d'inégalité devant l'impôt (ce n'est pas une proportion du revenu).

---

## 4. À intégrer (décisions pour l'auteur)

**Aucune modification du modèle ni du bilan n'a été faite.** Pour chaque ligne : la recommandation de Claude ; les coûts sont ceux du tome II 2026.

### Cas (b), sans décision ni chiffrage (27 fiches, 0,18 Md€)

| N° | Dispositif | Coût 2026 | Recommandation |
|---|---|---|---|
| 580102 | Prélèvement de 20 % sur les capitaux décès d'assurance-vie, supprimé quand le bénéficiaire est le conjoint (990 I) | 120 M€ | **À trancher avec les droits sur les transmissions (N06)** : le conjoint est déjà exempté dans N06 ; l'assurance-vie au décès est réalisée en N05. Recommandation : **ne rien ajouter**, vérifier que l'assurance-vie n'échappe pas à la fonction continue des transmissions |
| 530203, 530207, 530208 et 21 autres fiches d'enregistrement hors successions | exonérations de droits sur cessions de parts de fonds, SAFER, régimes agricoles | 55 M€ | DMTO supprimés (N08) : **supprimer ces exonérations avec leur droit**, sauf les cessions de parts d'entreprise, à traiter avec la taxe de 1 % sur les parts ; périmètre exact non décidé |
| 070201, 070205 | taxe d'habitation (résidences secondaires) | 0 M€ en 2026 | rien à décider tant que la taxe n'est pas rétablie ; confirmer qu'elle disparaît avec la taxe foncière |

### Cas (e), IS, TVA et accises maintenus, non décidé (156 fiches, 19,4 Md€) : les plus lourdes

| N° | Dispositif | Coût 2026 | Recommandation |
|---|---|---|---|
| 210309 | **Mécénat d'entreprise (238 bis)** | 1 730 M€ | **À décider avec les dons des particuliers** (section 3) : sinon asymétrie. Recommandation : plafond en euros par entreprise (Cour des comptes 2018), taux de 40 % au-delà de 2 M€ déjà en place ; pas de suppression si l'option (ii) est retenue |
| 210326 | Régime à 10 % de la propriété industrielle | 1 258 M€ | **Supprimer** : 1 065 entreprises, ≈ 1,2 M€ chacune ; l'IS à 25 % sans régime de faveur. Preuve C (pas d'évaluation lue) |
| 940102, 940103, 970105, 940204 | taxes sur les véhicules : exonérations électriques, hybrides, abattements de malus | 2 515 M€ | **À décider avec N17** (voitures lourdes +25 %) : fiscalité d'orientation et exonérations doivent être calibrées ensemble |
| 710103 | Taux de TVA de 8,5 % et 2,1 % outre-mer | 1 300 M€ | **Maintenir** : art. 73 de la Constitution et art. 349 TFUE ; hors compté |
| 730205 | TVA 10 % hôtels | 780 M€ | **Aligner** au taux normal si l'auteur garde le principe de N10 (restauration) ; chiffré en ES2 (0,78 × 20 à 65 %), non compté en v5.7 |
| 300206, 300210 | Exonérations des SIIC et SPPICAV | 1 048 M€ | **Décider avec la taxe de 1 % et les holdings** : ces structures échappent à l'IS en contrepartie d'une distribution ; la taxe sur les non-cotés les atteint-elle ? À instruire (preuve manquante) |
| 730222 | TVA 10 % pour les ventes aux investisseurs institutionnels (logement) | 385 M€ | **Supprimer** (ES2) : aucune justification sociale lue |
| 210313, 210321 | Crédits d'impôt prêt à taux zéro, éco-prêt | 1 093 M€ | **À décider avec le logement** : le modèle supprime MaPrimeRénov' (D17) ; ces crédits sont de même nature |
| 320121, 320129, 320135, 320140 | Cinéma, audiovisuel, jeux vidéo | 622 M€ | **Chiffrés en ES3, non comptés** (0,17 Md€ prudent) : à décider |
| 200310, 210308 | CII (crédit d'impôt innovation) et crédit d'impôt famille | 453 M€ | **Aligner sur la décision du CIR** : si le CIR est supprimé (D14), le CII l'est aussi ; non comptés aujourd'hui |

### Cas (a) à finalité d'orientation (79 fiches, 21,9 Md€) : disparaissent sans décision de fond

Les plus importantes : emploi à domicile 7 208 M€ (110246), **Dutreil 4 000 M€ (520110 : le barème de N06 ne le reprend pas)**, dons 2 204 M€, déduction des travaux sur revenus fonciers 1 990 M€, garde d'enfants 1 799 M€, investissement locatif intermédiaire 1 349 M€, outre-mer productif 831 M€, épargne salariale 652 M€, assurance-vie 569 M€, PEA 487 + 101 M€. **Recommandation générale** : l'extinction mécanique est cohérente avec « on calibre plutôt qu'on interdit » **seulement si l'auteur assume le coût social** de chacune. Trois cas appellent une décision explicite : (1) **emploi à domicile et garde d'enfants** (9 Md€) : la suppression pèse sur les emplois déclarés (le crédit est une raison d'être de la déclaration) ; à instruire avec le volet travail non déclaré ; (2) **Dutreil** : sans régime, la transmission d'entreprise taxée jusqu'à 50 % peut forcer des ventes ; l'exception pour les entreprises est à voter ou à refuser dans N06 ; (3) **livrets réglementés** (Livret A, LDDS, LEP, livrets bleus et jeunes, épargne logement : 1,7 Md€ cumulés) et **PEA** : le prélèvement unique sur le capital courant les rendra imposables ; à confirmer explicitement.

---

## 5. Limites et vérifications

- **Le classement (a) à (e) est ma lecture** du bilan v5.7 ; elle est dans la colonne `motif_statut` du CSV, ligne par ligne.
- **Concentration** : six niches avec un chiffre sourcé, une dizaine avec une indication ; pour les autres de la liste, **jugement structurel de Claude** (aucune statistique). Les rangs 1 à 10 de la section 2 ne sont **pas** un classement par part du dernier centile (donnée absente) : ils mêlent preuve et plausibilité.
- **Dons** : pas de part du dernier centile ; pas de ventilation des particuliers par secteur ; élasticités de Fack-Landais et Bönke non lues ; modèle de réaction à hypothèses (σ, e, taux effectif).
- **Texte de l'article 238 bis** : le paragraphe 2 (plafonds) a été tronqué par l'outil de lecture ; le plafond de 5 ‰ du chiffre d'affaires vient de la DGFiP.
- **Vérifications ouvertes** : V13520 à V13531 dans `verifications.md`.

## Synthèse des sources mobilisées

| Source | D'où | Ce qu'elle établit |
|---|---|---|
| Évaluation des voies et moyens, tome II, Dépenses fiscales, PLF 2026 (ministère de l'Économie, oct. 2025) | copie locale `voies_moyens_t2_2026.pdf` ; [budget.gouv.fr](https://www.budget.gouv.fr/) | les 465 fiches, leur coût 2024-2026, leurs bénéficiaires, le total 88 269 M€ |
| DGFiP Statistiques n° 06, *Dons et mécénat de 2011 à 2021* (Charnacé, Loiseau, janv. 2024) | [PDF](https://www.seban-associes.avocat.fr/wp-content/uploads/2024/05/FOCUS-dgfip_analyse_06_dons_mecenat-1.pdf) (copie hébergée par un cabinet d'avocats, ⚠️ à rapprocher de la version impots.gouv.fr) | dons 5,9 Md€ ; réductions ≈ 3,0 Md€ ; donateurs plus âgés et plus aisés ; habitude ; mécénat par taille |
| DGFiP Statistiques n° 41, *L'impôt sur le revenu 2024* (nov. 2025) | [PDF](https://www.impots.gouv.fr/sites/default/files/media/9_statistiques/0_etudes_et_stats/0_publications/dgfip_statistiques/2025/num41_11/dgfip_stat_41.pdf) | RICI 20 Md€ ; 2 538 € en D10 contre 49 € en D1 |
| Code général des impôts, art. 200, 978, 238 bis | base LEGI locale (`outils/droit/lire_legi.py`), consultée le 05/11/2026 | taux, plafonds, bénéficiaires |
| Cour des comptes (2018, 2021, 2025) sur le mécénat, les dons et le Dutreil | presse spécialisée et réponse du gouvernement (rapports non lus) | coût 900 M€ ; Dutreil 5,5 Md€ ; concentration |
| Fack et Landais (2010) ; Almunia et al. (2020) ; Bönke et al. (2013) | EconPapers, recherche | élasticités : signe et ordre de grandeur |
| Agenzia delle Entrate (27/06/2024) | lien ci-dessus | « cinque per mille » : 520 M€ en 2023 |
| CJUE, C-318/07, *Persche* (27/01/2009) | presse spécialisée et communiqués (arrêt non relu) | non-discrimination des dons transfrontaliers |

Consultations des liens : 05/11/2026.
