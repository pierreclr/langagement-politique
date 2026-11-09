---
titre: Retraites — socle universel, complément de carrière et capitalisation (méthode)
tache: T13
date: 2026-10-25
statut: brouillon
---

# Retraites : socle + complément + capitalisation — méthode

Tâche T13. Code : [`modele.js`](modele.js) (fonctions pures), test : [`test_modele.js`](test_modele.js) (`jsc modele.js test_modele.js`). Résultats : [`resultats.md`](resultats.md).

Légende : **fait sourcé** (lien) · **estimation** (calcul de Claude, explicité) · **hypothèse** (de l'auteur ou de Claude) · ⚠️ non confirmé, listé dans `verifications.md` (V450 à V472).

## 1. Questions posées

1. Avec un socle de S €/mois versé à tous les adultes résidents, **combien économise-t-on vraiment sur les pensions** si chaque retraité ne reçoit plus que le complément « pension − socle » ? Le simulateur utilise pour l'instant trois groupes non sourcés (29,4 % à 600 €, 26,2 % à 1 250 €, 44,4 % à 2 000 €). On les remplace par la **distribution officielle des pensions par tranches de 100 €**.
2. Quelles **règles** de complément sont possibles (intégral, réduit, progressif, cumul), et que coûtent-elles ?
3. Si le complément de carrière doit à terme être servi par un **fonds souverain capitalisé**, quelle est la **double charge** de la transition (payer les droits acquis *et* remplir le fonds), combien de temps dure-t-elle, et **quelle taille** doit atteindre le fonds ?
4. Que se passe-t-il en cas de **krach** ou de **décennies perdues** (Nikkei 1989-2024), et en quoi le socle sert-il d'assurance ?

Périmètre : France, tous régimes obligatoires (base et complémentaires), euros constants 2025, horizon 2027-2200 (la fin sert à approcher la perpétuité). On ne traite pas l'épargne retraite supplémentaire (PER), ni l'invalidité.

## 2. Données (dans `donnees/`)

| Fichier | Contenu | Source primaire |
|---|---|---|
| `distribution_pensions_2020.csv` | Parts de retraités par tranche de 100 € (0 à 4 500 €, puis > 4 500 €), femmes / hommes / ensemble : 8 tableaux de l'EIR 2020 (brut / net, droit direct / total avec réversion, tous / carrières complètes) et la distribution des **résidents en France** (DREES 2025, graphique 4) | [DREES, EIR 2020](https://data.drees.solidarites-sante.gouv.fr/api/explore/v2.1/catalog/datasets/4178_distribution-des-pensions-mensuelles/attachments/eir2020_distribution_des_pensions_mensuelles_xlsx) ; [DREES, *Les retraités et les retraites* 2025, fiche 05](https://drees.solidarites-sante.gouv.fr/sites/default/files/2025-07/Fiche%2005%20-%20Le%20niveau%20des%20pensions.xlsx) |
| `effectifs_montants_pensions.csv` | Effectifs (droit direct, dérivé, dérivé seul, résidents à l'étranger), pensions moyennes 2020-2023, pensions et effectifs **par régime**, masses financières 2025 | [DREES, données fin 2022](https://data.drees.solidarites-sante.gouv.fr/api/explore/v2.1/catalog/datasets/1393_les-effectifs-et-montants-de-pension-des-retraites/attachments/les_effectifs_de_retraites_montants_des_pensions_et_ages_de_depart_a_la_retraite_fin_2022_xlsx) ; fiche 05 ; [COR, rapport annuel juin 2026](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf) |
| `cor_2026_projections.csv` | Dépenses, ressources et solde en % du PIB (2025-2070), cotisants et retraités, rapports démographiques, réserves (Agirc-Arrco, FRR…) | COR, rapport annuel 2026 |
| `engagements_implicites.csv` | Droits à pension déjà acquis (« dette implicite ») : 397 % du PIB fin 2021 | [Eurostat, nasa_10_pens1](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nasa_10_pens1?geo=FR&unit=PC_GDP&na_item=F63_LE&format=JSON&lang=EN) |
| `rendements_et_fonds.csv` | Rendements réels de long terme (actions, logement, obligations, 16 pays et France, 1870-2015) ; fonds norvégien, CPP Investments, FRR, AP7 (Suède) ; Nikkei | [Jordà et al., *The Rate of Return on Everything*](https://www.frbsf.org/wp-content/uploads/wp2017-25.pdf) ; [NBIM 2025](https://www.nbim.no/en/news-and-insights/reports/2025/annual-report-2025/web-report-annual-report-2025/) ; [CPP Investments 2026](https://www.newswire.ca/news-releases/cpp-investments-net-assets-total-793-3-billion-at-2026-fiscal-year-end-814459989.html) |
| `precedents_transition.csv` | Chili (1981, PGU 2022, réforme 2025), Suède (1999), Argentine (2008), Hongrie (2010), Pologne (2014), FRR français | sources dans le fichier ; ⚠️ plusieurs secondaires |

**Méthode de collecte.** Les fichiers Excel de la DREES ont été téléchargés et lus par un script (cellule par cellule, sans ressaisie) ; le rapport du COR a été lu en texte intégral ; les données Eurostat viennent de l'API officielle. Les rendements des fonds viennent des rapports des fonds (NBIM) ou de leurs communiqués relayés par la presse spécialisée (CPP, FRR, AP7) quand le site primaire était inaccessible : ils sont marqués comme tels.

**Ce qui manque.** La DREES ne publie pas encore de distribution par tranches plus récente que l'EIR 2020 (prochaine vague : EIR 2024, ⚠️ date inconnue ; l'édition 2026 du panorama, 14/10/2026, utilise encore l'EIR 2020, V6770). La distribution des **résidents en France** n'existe que pour la pension de droit direct (sans réversion) ; celle de la pension totale inclut les retraités vivant à l'étranger. Le modèle combine les deux (section 3).

## 3. Bloc 1 — économie statique sur les pensions

### Formules
Pour un retraité de pension brute totale *p* (droit direct + réversion + majoration) et un socle *S* :

| Règle | Ce que touche le retraité | Économie sur les pensions |
|---|---|---|
| **Complément intégral** (règle de l'auteur) | S + max(p − S, 0) = max(p, S) | min(p, S) |
| **Complément réduit** (part α du complément) | S + α·max(p − S, 0) | min(p, S) + (1 − α)·max(p − S, 0) |
| **Complément sur le net** | S + max(p_net − S, 0) | p − max(p_net − S, 0) |
| **Transition progressive** (le socle déduit monte de 0 à S en n ans) | S + max(p − λ(t)·S, 0) | min(p, λ(t)·S) |
| **Cumul** (droits acquis absolus) | S + p | 0 |

Économie totale = N × 12 × E[min(p, S)], où l'espérance se calcule tranche par tranche (pension uniforme dans chaque tranche de 100 €), puis :
− les **retraités résidant à l'étranger** (≈ 0,94 M, pension moyenne ≈ 690 €), qui ne touchent pas le socle : aucune économie sur eux ;
+ les **bénéficiaires d'une réversion seule** résidant en France (≈ 0,48 M, ≈ 790 €), absents du champ de l'EIR « droit direct », qui touchent le socle.

**Fonction pour le simulateur** : `economiePourSimulateur(S)` (ou la table `tableSimulateur(0, 2000, 100)`) remplace `RETRAITES × 12 / 1000 × Σ part × min(moyenne, socle)` dans `simulations/simulateur.html`. Le coefficient du curseur (1 / 0,5 / 0) s'applique ensuite comme aujourd'hui.

### Hypothèses
- **H1** — La forme de la distribution est celle de fin 2020 (EIR 2020, tableau 5, pension brute totale). *Fait sourcé ; ⚠️ datée (V451).*
- **H2** — Dans chaque tranche, les pensions sont uniformes ; la tranche ouverte (> 4 500 €, 1,8 % des retraités) a une moyenne calée pour que la moyenne d'ensemble égale celle de la DREES (1 614 € brut fin 2020) : ≈ 5 230 € en 2020. *Hypothèse de Claude.*
- **H3** — Passage 2020 → 2025 par **homothétie** : toutes les pensions sont multipliées par k = (1 763 / 1 614) × (1 729 / 1 607) ≈ **1,175**, soit l'évolution de la pension moyenne DREES 2020 → 2023, puis 2023 → 2025 calée sur la pension de droit direct moyenne du COR (361 Md€ / 17,4 M / 12 = 1 729 €). L'homothétie ignore l'effet de noria (les nouveaux retraités ont des pensions plus élevées) et les revalorisations différenciées (complémentaires vs base) : la part de retraités sous un seuil est un peu surestimée. *Estimation de Claude ; ⚠️ V452.* Contrôle : la masse obtenue (396 Md€) est proche des 401 Md€ de pensions de base et complémentaires hors ASPA du COR pour 2025.
- **H4** — 17,4 M de retraités de droit direct en 2025 (COR, y compris à l'étranger). *Fait sourcé (estimation COR).*
- **H5** — Part des retraités résidant à l'étranger : 5,4 % (DREES 2022 : 16,06 M résidents sur 16,97 M) ; ils ne reçoivent pas le socle, qui suppose la résidence (règle d'éligibilité encore « à trancher » par l'auteur). *Hypothèse de Claude ; V453.*
- **H6** — Pensions des retraités à l'étranger et des réversions seules : loi exponentielle de moyenne connue (690 € et 790 €). *Hypothèse de Claude.* L'effet total est de quelques Md€.
- **H7** — Le socle est versé à tous les adultes résidents, retraités compris ; son coût est déjà dans le simulateur (662,7 Md€). Le modèle ne calcule que l'économie côté pensions. *Hypothèse de l'auteur.*
- **H8** — Le complément n'est pas imposé (choix actuel du simulateur). Avec la règle « intégral sur le brut », les retraités gagnent alors la CSG, la CRDS et la CASA qu'ils paient aujourd'hui (≈ 29 Md€) ; la variante « sur le net » neutralise ce gain. *Hypothèse de l'auteur / variante de Claude.*
- **H9** — Les pensions de l'EIR excluent le minimum vieillesse (ASPA), déjà compté à part (4,6 Md€) dans le simulateur : pas de double compte. *Fait sourcé (champ EIR) ; V454 pour le recoupement exact.*
- **H10** — Transition progressive : λ(t) passe linéairement de 0 à 1 en n = 10 ans. *Hypothèse de Claude (paramètre).*

## 4. Bloc 2 — transition vers la capitalisation et double charge

### Principe
L'année t₀ (2027), on cesse d'acquérir des droits en répartition. Les droits **déjà acquis** restent dus (part « héritée »). Les droits correspondant aux années travaillées **après** t₀ sont servis par le fonds souverain (part « capitalisée »). Chaque année :

- C(t) = masse des compléments (pension − socle, plancher 0) = C₂₀₂₅ × N(t) / N(2025) ;
- f(t) = part moyenne des droits acquis après t₀ parmi les retraités de l'année t ;
- part héritée H(t) = C(t) × (1 − f(t)), payée par le budget (il n'y a plus de cotisations) ;
- versements du fonds P(t) = C(t) × f(t) ;
- fonds : A(t+1) = A(t) × (1 + r) + I − P(t), avec un **apport constant I** (budget + parts d'entreprises reçues au titre de l'héritage) ;
- **I\*** = plus petit apport constant tel que le fonds ne soit jamais négatif *et* reste soutenable à perpétuité (I + r·A ≥ P à la fin du calcul) ;
- **double charge** D(t) = H(t) + I\* − C(t) : ce que la collectivité consacre aux compléments **au-delà** de ce qu'aurait coûté la répartition. Elle est positive au début, négative ensuite.

**Identité de Sinn** (contrôlée par le test) : au taux de rendement du fonds, la valeur actualisée de D(t) est nulle. Autrement dit, **la capitalisation ne crée pas de richesse par elle-même** : les gains futurs (C − I\* chaque année en régime permanent) sont exactement payés par la double charge, si on actualise au rendement du fonds. Il n'y a gain net que si l'on actualise à un taux plus bas (par exemple la croissance, ≈ 1 %), c'est-à-dire si l'on accepte de faire payer les générations de la transition au profit des suivantes. Références : Aaron (1966), Breyer (1989), Sinn (2000), ⚠️ citées de mémoire (V470).

### Hypothèses
- **H11** — Droits acquis honorés au prorata de la carrière effectuée avant t₀. *Hypothèse de l'auteur (reprise des droits acquis) ; modalités juridiques : V471.*
- **H12** — Carrière de W = 41 ans finissant au départ, retraite de D = 25 ans, effectifs égaux par âge (sans mortalité). La part capitalisée vaut 9 % en 2040, 27 % en 2050, 51 % en 2060, 75 % en 2070, 100 % vers 2093. *Simplification de Claude.*
- **H13** — Effectif de retraités : 17,4 M (2025) → 22,1 M (2070) linéairement (COR), stable ensuite ; complément moyen constant en euros 2025 (socle indexé sur les prix, comme le veut l'auteur). Le COR projette une baisse de la pension relative au revenu d'activité (54,6 % → 45,3 %) : notre hypothèse est plutôt prudente. *Hypothèse de Claude.*
- **H14** — Objectif du fonds : servir à terme **l'intégralité** des compléments actuels (même promesse que la répartition). *Hypothèse de Claude, pour mesurer la taille maximale.*
- **H15** — Rendement réel net du fonds r : **2 % / 3,5 % / 5 %** (bas / central / haut). Repères : actions mondiales 4,64 % composé (1870-2015), obligations 1,94 %, logement 6,61 % (Jordà et al.) ; fonds norvégien 4,3 % réel net (1998-2025) ; **actions françaises 3,25 % seulement** sur 1870-2015 (11,07 % sur 1980-2015). Un fonds à 70 % d'actions mondiales vise ≈ 3,5-4 % réel. *Choix de Claude.*
- **H16** — Apport constant en euros 2025, sans croissance de l'économie dans le calcul du fonds (prudence : la croissance réduirait le poids relatif de l'apport). *Simplification de Claude.*
- **H17** — Parts d'entreprises reçues au titre de l'héritage : **10 / 20 / 35 Md€ par an**. Calcul indicatif : flux de transmissions ≈ 300 Md€ (CAE, vers 2020) × (1 − 31 % de fuite, modèle T5) × 50 % ≈ 103 Md€ d'impôt, dont une part payée en titres d'entreprise (la part des biens professionnels dans les successions n'a pas été sourcée : ⚠️ V460). **Attention au double compte** : le simulateur compte déjà ces 150 Md€ comme recette budgétaire en argent ; ce qui part au fonds ne finance pas le socle.
- **H18** — Pour comparer : une capitalisation par **comptes individuels** en régime permanent sans croissance (cotisation constante 41 ans, rente 25 ans) détient ≈ 20 années de versements à r = 3,5 % (24 à 2 %, 16 à 5 %).

## 5. Bloc 3 — risque de marché et rôle du socle

- **H19** — Rendements annuels indépendants et normaux, volatilité σ = 14 / 12 / 11 % (bas / central / haut) ; moyenne arithmétique r + σ²/2 pour que le rendement composé médian vaille r. Repères : écart-type des actions 22 %, des obligations 11 % (Jordà et al.) ; fonds norvégien : −14,1 % en 2022, −23,3 % en 2008 (NBIM, V6775). La loi normale sous-estime les queues épaisses et l'autocorrélation des décennies perdues : on ajoute donc deux **chocs déterministes** : krach de 40 % en 2060 ; 34 ans de rendement réel nul à partir de 2060 (durée qu'a mise le Nikkei à retrouver son record de décembre 1989, en février 2024).
- Résultats calculés : probabilité d'épuisement du fonds avant 2100 avec l'apport I\* ; apport nécessaire pour 90 % et 95 % de réussite ; surcoût annuel après choc.
- **Le socle comme assurance** : seul le complément est exposé au marché. Pour un retraité de pension p, une baisse x du complément réduit son revenu de x × (p − S) / p au lieu de x sans socle.

## 6. Effets de comportement et de rebond (non chiffrés dans le code)

| Effet | Sens | Ordre de grandeur dans la littérature | Statut |
|---|---|---|---|
| **Taxe implicite à 100 % sur les petites pensions.** Avec le complément intégral, chaque euro de pension sous le socle est entièrement repris : pour un futur retraité qui finira sous S (21 % des retraités en 2025), cotiser ou travailler plus longtemps n'apporte rien. C'est l'effet du minimum vieillesse, en plus grand. | baisse de l'offre de travail des seniors et de la déclaration des petits revenus | Les études internationales du NBER (Gruber & Wise) relient la taxe implicite sur la prolongation d'activité à des départs plus précoces (⚠️ V469) | qualitatif ; à relier au modèle T4 |
| **Épargne privée** : un fonds public capitalisé peut se substituer en partie à l'épargne des ménages (et l'inverse) | réduit l'effet de la capitalisation sur le stock de capital du pays | substitution de 0,65 à 0,75 € d'épargne privée par euro de droit à pension au Royaume-Uni (Attanasio & Rohwedder, 2003) ⚠️ V469 | non chiffré |
| **Prix des actifs** : un fonds de ≈ 1,5 fois le PIB placé en partie en France ferait monter les cours (et baisser les rendements futurs) | réduit r | non chiffré ; d'où l'intérêt d'un placement surtout mondial, comme le fonds norvégien | qualitatif |
| **Risque politique** : les fonds de long terme sont tentants en période de déficit | réduit le fonds | Précédents : Argentine 2008, Hongrie 2010, Pologne 2014 ; en France, le FRR réaffecté au remboursement de la dette sociale (2,1 Md€/an depuis 2011) | sourcé (sources secondaires ⚠️ V466-V468) |
| **Migration des retraités** : le socle n'étant versé qu'aux résidents, les retraités partant à l'étranger perdent la part de leur pension absorbée par le socle (s'ils gardent seulement le complément) ou la gardent (si on leur verse la pension entière) | selon la règle | non chiffré | à trancher (V453) |

## 7. Scénarios

| Paramètre | Bas | Central | Haut |
|---|---|---|---|
| Rendement réel net du fonds | 2 % | 3,5 % | 5 % |
| Volatilité | 14 % | 12 % | 11 % |
| Parts reçues au titre de l'héritage | 10 Md€/an | 20 Md€/an | 35 Md€/an |
| Socle | 800 / 1 000 / 1 200 / 1 500 € (tous croisés) | | |

« Bas » est défavorable au projet (rendement faible), « haut » favorable.

## 8. Limites

- **Pas de croissance** dans le bloc 2 : tout est en euros 2025 et en part du PIB 2025. Avec 1 % de croissance réelle, les montants pèseraient moins en part du PIB futur, mais le socle indexé sur les prix aussi.
- **Démographie simplifiée** (rampe linéaire COR, pas de table de mortalité, carrières identiques) : la durée de la double charge (23 à 35 ans) est un ordre de grandeur, pas un calendrier.
- **Dette implicite** : le modèle ne compte que les compléments au-dessus du socle ; l'ensemble des droits acquis (Eurostat, 397 % du PIB en 2021) dépend fortement du taux d'actualisation.
- **Distribution de 2020** : la vague EIR 2024 pourra modifier les résultats de quelques Md€.
- **Gagnants et perdants** : traités dans T14 (règle « sur le brut » : aucun retraité ne perd en brut ; règle réduite : les pensions au-dessus du socle baissent).
- **Droit** : la protection des pensions par l'article 1er du protocole n° 1 de la CEDH admet des réductions proportionnées mais pas une confiscation (⚠️ V471) ; la règle « complément intégral » ne réduit aucun montant brut et paraît donc la plus robuste.

## 9. Bloc 4 — nouveau décompte et part capitalisée progressive (T48, 01/11/2026)

Code : [`capitalisation.js`](capitalisation.js) (fonctions pures, n'altère pas `modele.js`), tests : [`test_capitalisation.js`](test_capitalisation.js) (`jsc capitalisation.js test_capitalisation.js`, 36 contrôles), tables : [`rapport_capitalisation.js`](rapport_capitalisation.js) → [`resultats-capitalisation.txt`](resultats-capitalisation.txt). Contexte et sources : [`sources/recherche-retraite-capitalisation.md`](../../sources/recherche-retraite-capitalisation.md). Résultats : [`resultats.md`](resultats.md), section « Capitalisation progressive (T48) ». Différence avec le bloc 2 (T13) : le bloc 2 remplace tout le complément ; ce bloc détourne **1, 3 ou 6 points** de cotisation et traite les générations une par une (le fonds est exactement provisionné, au contraire du calcul de `sources/calculs/t48_capitalisation.py`, qui gonflait le fonds de la différence r − g).

### Principe
Étape 0 : droits acquis convertis en points ou en capital notionnel, **sanctuarisés** (aucun montant versé ne change). Étape 1 : à partir de 2027 (t = 0), tout nouveau droit est inscrit dans un compte notionnel revalorisé au rythme ρ de la masse salariale (condition d'Aaron), converti en rente à l'espérance de vie de la génération. Étape 2 : une part φ(t) de points (sur 27,8) est versée à un fonds capitalisé au lieu du compte notionnel ; φ monte de **1 point tous les 3 ans** jusqu'à 1, 3 ou 6 points.

- Cotisation détournée l'année u : c(u) = φ(u) × 14,665 Md€ × (1 + g)^u.
- Elle se répartit à parts égales sur les **40 générations d'actifs** qui partiront 1 à 40 ans plus tard. Capital fonds de la génération qui part l'année s : K_F(s) = Σ c(u)/40 × (1 + r)^(s−u) ; équivalent répartition : K_R(s) = Σ c(u)/40 × (1 + ρ)^(s−u). Rente constante sur D = 22 ans (rente due) : K / Σ(1 + x)^−m.
- **Double charge(t)** = c(t) − rentes de répartition évitées (Σ des K_R/facteur des générations en cours de retraite). Pensions du fonds(t) = Σ des K_F/facteur ; **gain des retraités**(t) = pensions du fonds − rentes de répartition évitées (l'écart r − ρ leur revient).
- Financement : (a) **dette de transition** D(t) = D(t−1)(1 + i) + double charge(t) ; (b) **prélèvement** : points de cotisation temporaires = double charge / (14,665 × (1 + g)^t). Actif net = fonds − dette.
- **Salarié né en 2000** : entrée à 22 ans (2022), départ à 65 ans (2065) ; les 5 années 2022-2026 restent en répartition (droits acquis) ; 2027-2064 : (27,8 − φ) points au compte notionnel, φ au fonds. Pension répartition seule : tout au compte notionnel. Les trois profils diffèrent par le niveau (Smic, médian, cadre) et par la pente de carrière ; le rapport mixte / répartition n'en dépend presque pas (proportionnalité, vérifiée par le test).
- **Risque de marché** : rendements annuels log-normaux d'espérance r et de volatilité σ, indépendants d'une année à l'autre (3 000 tirages, graine 12345, générateur mulberry32) ; rente fixée au départ au taux r (H40). Stress déterministes : krach de −40 % l'année avant le départ ; rendement réel nul les 20 dernières années (taux technique 0) ; rendement réel nul toute la carrière.
- **Compartiment « entreprises d'intérêt commun »** de poids q ≤ 15 % : rendement (1 − q) r + q (r + Δ) ; variance (1 − q)² σ² + q² σ_C² + 2 q (1 − q) κ σ σ_C.

### Hypothèses (suite de H1-H20)
| N° | Hypothèse | Valeur | Source / statut |
|---|---|---|---|
| H21 | 1 point de cotisation = 1 % de l'assiette salariale 2024 (coût employeur) | 14,665 Md€/an (0,49 % du PIB) | `modeles/offre-de-travail/methode.md` ; ⚠️ l'assiette plafonnée n'a pas la valeur de la masse salariale totale (V2657) |
| H22 | Cotisation retraite obligatoire moyenne | 27,8 % du salaire brut | OCDE, Pensions at a Glance 2025, tableau 8.1 (repris de T48) |
| H23 | Dépenses de retraite 2025 ; PIB implicite | 422,2 Md€ ; 2 994 Md€ | COR juin 2026 (14,1 % du PIB) |
| H24 | Scénarios bas / central / haut : rendement réel net r ; croissance réelle g (= ρ) ; volatilité σ ; taux réel de la dette i | 2 / 3,5 / 5 % ; 0 / 0,6 / 1,0 % ; 14 / 12 / 11 % ; 2 / 1,5 / 1 % | r et σ : scénarios de `modele.js` ; g central : estimation de `sources/recherche-retraite-capitalisation.md` § 1.3 (COR : 0,8 % de TRI réel, génération 2000) ; g bas et haut, et i : ⚠️ hypothèses de Claude |
| H25 | La masse salariale, les pensions et le PIB croissent à g (même rythme) | — | ⚠️ simplification |
| H26 | Montée en charge : +1 point tous les 3 ans jusqu'à 1, 3 ou 6 points | — | Proposition de `sources/recherche-retraite-capitalisation.md` § 4 (opinion de Claude, à valider par l'auteur) |
| H27 | Carrière de 40 ans, retraite de 22 ans (rente constante, sans mortalité par cohorte) | 40 ; 22 | Reprise de T48 ; ⚠️ pas de table de mortalité |
| H28 | Répartition uniforme de la cotisation sur 40 classes d'âge ; effectifs de cohorte constants (pas de baisse de natalité ni de migration) | — | ⚠️ simplification ; la démographie COR (cotisants 30,6 → 28,9 M) n'est pas modélisée |
| H29 | Équivalent répartition = compte notionnel revalorisé à ρ = g | — | Aaron (1966), Sinn (2000), ⚠️ cités via `sources/recherche-retraite-capitalisation.md` |
| H30 | Droits acquis avant 2027 sanctuarisés : leur montant ne change pas, ils continuent à être financés en répartition | coût nul | Décision de l'auteur du 31/10/2026 ; ⚠️ garanties juridiques (CEDH, Conseil constitutionnel : V471, V2662) |
| H31 | Le nouveau décompte ne change ni la masse des pensions versées ni les cotisations : coût de départ nul ; il remplace le solde COR (−0,9 % du PIB en 2045, −2,4 % en 2070) par un ajustement automatique | 0 | Estimation ; la règle d'ajustement n'est pas modélisée |
| H32 | Effets redistributifs du nouveau décompte : (a) conversion à l'espérance de vie moyenne : le transfert de longévité se calcule par le rapport des facteurs de rente ; durées de retraite de 19, 22 et 25 ans ; (b) fin des « 25 meilleures années », (c) réversion et majorations à financer explicitement | 19 / 22 / 25 ans | ⚠️ durées illustratives, écart d'espérance de vie par catégorie sociale à sourcer (INSEE) ; (b) et (c) non chiffrés |
| H33 | Frais de gestion inclus dans r (rendement net) | 0,05 % (NBIM) à 0,21 % (Suède) | NBIM 2025, Pensionsmyndigheten 2020 ; r est un rendement espéré, non une garantie |
| H34 | Compartiment « intérêt commun » : poids q | 0 à 15 % | Opinion de Claude (`sources/recherche-retraite-capitalisation.md` § 4.2) |
| H35 | Écart de rendement du compartiment au cœur indiciel, Δ | −2 / −0,5 / +0,5 points (−3,5 en test extrême) | ⚠️ hypothèse de Claude, aucune source (à documenter avec les rendements de l'APE et de Bpifrance) |
| H36 | Volatilité du compartiment σ_C ; corrélation κ avec le cœur | 20 % ; 0,6 (test de concentration : 30 % ; 0,9) | ⚠️ hypothèses de Claude |
| H37 | Pas de coût politique, pas de ponction du fonds par l'État (gouvernance du § 6 de la recherche) | — | Hypothèse la plus fragile (Argentine 2008, Hongrie 2010, Pologne 2014, FRR) |
| H38 | Cas types (€ bruts 2025) : Smic 21 876 ; médian 2 190 € net / 0,78 × 12 = 33 692 ; cadre 60 000 | — | INSEE (via `modeles/offre-de-travail`) ; ⚠️ Smic brut 2026 (≈ 1 823 €/mois) à reconfirmer ; cadre : cas type de `systeme-ideal` H31 |
| H39 | Pente de carrière (croissance réelle individuelle annuelle) : 0 / 0,5 / 1,5 % ; salaire de référence à 40 ans | — | ⚠️ hypothèse de Claude |
| H40 | Rente du fonds fixée au départ au taux r attendu (rente fixe, pas de rente variable) ; en phase de retraite, le risque de marché n'est pas modélisé | — | ⚠️ simplification : la rente variable (Pays-Bas, Wtp) ou le risque de taux à la conversion ajoutent de la dispersion |

**Vérifications (02/11/2026)** : H24 → V2712 ; H35-H36 → V2713 (non sourcées) ; H38 → V2714 (Smic de juin 2026 : 1 867,02 €/mois brut, 22 404 €/an ; 21 876 € = niveau de début 2026, janvier non relu) ; H39-H40 → V2715. **Chargement dans le système idéal** : `modeles/systeme-ideal/capitalisation.js` (`methode.md` § 15 de ce modèle, `resultats.md` § 14).

### Limites propres à ce bloc
- Le gain central vient de l'écart **r − ρ**, soit la prime de risque des actions : il est **espéré**, pas garanti. Comparer r (risqué) à i (taux de la dette) fait apparaître un « gain » au niveau de la collectivité ; à i = r il disparaît (identité de Sinn, testée).
- La dispersion ne porte que sur le fonds ; le **risque de la répartition** (ρ, démographie, décision politique) est traité comme certain : la comparaison est donc favorable à la répartition seule en variance. Le scénario bas (g = 0) donne un ordre de grandeur de ce risque.
- Pas d'effet sur l'épargne privée (0,65 à 0,75 € par euro de droit, V469), ni sur les prix d'actifs (un fonds à 50-150 % du PIB), ni sur la croissance (Sinn : seul un effet causal sur l'épargne ferait un gain net), ni sur le marché du travail.
- Les chiffres de la double charge sont **cohérents avec ceux de T48** (pic 44-45 Md€/an pour 3 points, 83-91 pour 6) mais le fonds est ici exactement provisionné (30 ans : 1 760 Md€ au central pour 3 points, contre 1 718 Md€ dans le calcul de la recherche, qui supposait g = 0 ; ici g = 0,6 %).

## 10. Paramétrage par (socle, taux plat) et choix sur l'imposition du complément (03/11/2026)

Le socle S entrait déjà comme paramètre ; le taux plat t n'entrait pas, car la règle « pension − socle » du bloc 1 ne dépend que de S. Il intervient dès que l'on pose la question de l'imposition du complément. Trois jeux sont calculés (voir `resultats.md`, en tête) : ancien 1 000 € / 50 %, palier 1 500 € / 35 %, architecture retenue 350 € / 40 % (`modeles/systeme-ideal/optimum.md`).

**Fonctions ajoutées** (aucune fonction existante modifiée) : `bilanRevenuRetraites({socle, taux, imposition})` ; `contributionHautesPensions({seuil, taux})` ; `esperanceFonction`.

| Imposition du complément | Revenu du retraité de pension brute p | Signe pour les retraités |
|---|---|---|
| `brut` : non imposé (H8 d'origine) | S + max(p − S, 0) | tous gagnent (CSG supprimée, ≈ 29 Md€) |
| `net` : calculé sur la pension nette | max(ν·p, S) | neutre au-dessus du socle ; gain seulement sous le socle |
| `taux_plat` : imposé comme tout revenu du système | S + (1 − t)·max(p − S, 0) | négatif pour la grande majorité |

- **H41** — Rapport net / brut de la pension : ν = moyenne nette / moyenne brute des distributions de l'EIR 2020 ramenées en 2025 ≈ 0,927, supposé constant (en réalité progressif). *Hypothèse de Claude.*
- **H42** — **Choix retenu pour la règle « pension − socle » : complément calculé sur le net.** Raisons : (1) la v2 du système (§ 3.4) ne retient pas cette règle : retraités non ramenés au minimum, socle réservé aux non-retraités, contribution de 20 % sur la part nette au-dessus de 2 500 € ; (2) la version brute fait un cadeau non décidé de ≈ 29 Md€ aux retraités ; (3) la version « imposé au taux plat » ferait perdre 73 à 91 % des retraités, ce qui contredit « retraités protégés ». *Choix de Claude, à valider par l'auteur* (fiche 04).
- **H43** — La contribution des hautes pensions se calcule sur la distribution **nette** (résidents, pension seule, sans capital), 17,4 M × 94,6 %. Résultat 6,6 Md€ à 2 500 € et 20 % contre 6,3 (5,8 à 6,6) dans `systeme-ideal` : écart dû au champ (EIR 2020 ramené, résidents) et à l'interpolation. *Estimation de Claude.*
- IR non compté (la pension nette DREES est après CSG-CRDS-Casa, avant impôt sur le revenu). Effets de comportement et d'épargne non modélisés.

## 11. Âge libre avec pension ajustée et levier « niveau » (03/11/2026)

Code : [`age_libre.js`](age_libre.js) (charger `modele.js` avant), test : [`test_age_libre.js`](test_age_libre.js), sortie : `resultats-age-libre.txt` ; aucune fonction de `modele.js` modifiée. Données ajoutées : `donnees/esperance_vie_FR_2023_eurostat.csv` (Eurostat demo_mlexpec, tables de l'Insee). Comparaison internationale : `sources/retraites-france-allemagne.md`.

**Questions** : (1) à quel coefficient une pension prise à 60 ans, 64 ou 67 ans est-elle équivalente ? (2) que coûte la liberté de partir dès 60 ans, avec plancher et dispense de réduction pour carrières longues et pénibles ? (3) que rapporte le niveau (indexation, hautes pensions) ? (4) combien de l'écart avec l'Allemagne cela comble-t-il sans toucher l'âge légal ? (5) qui perd ?

- **H44** — Croissance réelle du PIB : 0,8 % par an (productivité 0,7 %/h du COR plus emploi), pour convertir Md€ en points de PIB. *Hypothèse de Claude.*
- **H45** — Pension des nouveaux retraités : +0,5 % par an en réel. *Hypothèse (le COR donne +0,2 % pour le stock et +0,7 % pour le revenu d'activité).*
- **H46** — Prélèvements induits par un euro de revenu d'activité : 42 % (cotisations, CSG, impôts, TVA), pour les recettes perdues par les départs plus précoces. *Hypothèse, ≈ taux de prélèvements obligatoires.*
- **H47** — Âge légal d'ouverture des droits : 62,75 ans, réforme de 2023 suspendue (valeur à vérifier) ; gap avec 60 ans : 2,75 ans.
- **H48** — Départs annuels : stock de retraités de droit direct ÷ espérance de vie à 63 ans = 17,4 / 22,6 ≈ 0,77 M par an, constants. *Estimation.*
- **H49** — Seuil de pauvreté à 60 % du niveau de vie médian : 1 216 €/mois pour une personne seule. *Valeur Insee 2022 à actualiser ⚠️.*
- **H50** — Comportement de départ : le décalage de l'âge moyen est Δ = passage × (62,75 − 60), passage = 0,2 (haut), 0,35 (central), 0,5 (bas pour les finances, car il augmente les départs). *Hypothèse non calibrée, à confronter à la réforme de 2010 et à Mastrobuoni (2009) ⚠️.*
- **H51** — Coefficient neutre : valeur actuelle des pensions à vie égale à l'âge de départ a et à l'âge de référence, actualisée à r ; r = 0,7 % central (croissance de la masse salariale, rendement de la répartition), 0 (bas), 1,6 % (haut, norme suédoise). Mortalité : force de mortalité ln μ = a + b·u + c·u² (u = âge − 70) ajustée aux tables Eurostat/Insee 2023 (rmse 0,06 à 0,11 an), sexes réunis par défaut. *Méthode : Gompertz généralisé ; ⚠️ V10005.*
- **H52** — Les cohortes sont suivies en fraction d'année : dépense = effectif × pension × survie du jour de départ à l'année. Le décalage monte en charge en 3 ans à partir de 2028 ; les retraités déjà partis ne sont pas touchés. *Hypothèse.*
- **H53** — Part des départs avec dispense de réduction (carrières longues et pénibilité) : 10 % (haut), 20 % (central), 30 % (bas), à partir de 60 ans. *Hypothèse non sourcée ⚠️ V10012 ; le surcoût est une borne haute si le dispositif « carrières longues » en couvre déjà une partie.*
- **H54** — Indexation : prix moins un écart (0,25 / 0,5 / 1 point par an) pour la part de la pension brute au-dessus d'un seuil (2 500 / 2 000 / 1 500 €), à partir de 2028 ; le seuil suit les prix ; la distribution des pensions 2025 est supposée fixe en réel (la masse suit l'effectif de retraités du COR). *Hypothèse.*
- **H55** — Contribution des hautes pensions : `contributionHautesPensions` (20 % au-dessus de 2 500 € nets), constante en euros réels. *Reprise de H43.*
- **H56** — Plancher : jamais en dessous de min(pension d'origine, 1 044 €) (ASPA, H9). *Hypothèse de conception.*
- **H57** — Trajectoires COR : dépense en % du PIB (14,1 / 14,1 / 14,2 / 15,3 en 2025 / 2030 / 2045 / 2070 sourcés ; 2040 et 2060 interpolés) ; retraités et cotisants (2025 et 2070 sourcés, 2030/2040/2060 interpolés). *⚠️ V10009.*
- **H58** — Part des partants en emploi : 50 % (le reste part du chômage, de l'invalidité ou de l'inactivité). *Hypothèse non sourcée ⚠️ V10013.*
- **H59** — Les pensions individuelles ne sont pas des niveaux de vie : l'effet sur la pauvreté est une borne haute.
- **H60** — Pas de réaction des employeurs ni de report de départ des cadres.

**Fonctions** : `esperanceVie`, `survie`, `annuite`, `coefNeutre`, `coefFrancais`, `coefSuedois`, `comparerCoefficients`, `pensionAjustee` (plancher), `effetAgeLibre` (cohortes), `penibilite`, `masseAuDessus`, `indexationNiveau`, `contributionHautes`, `parDecile`, `pauvreteAnticipee`, `bilan` (scénarios `bas`, `central`, `haut`).

**Ce que le modèle montre sur la logique** : à r = 0 la neutralité laisse la dépense inchangée à long terme (test : résidu < 0,06 pt en 2090) et coûte pendant la transition ; à r > 0 les pensions totales baissent mais la valeur actuelle reste égale : l'économie vient du choix de r, pas de l'âge libre. Les recettes perdues (travail en moins) sont le vrai coût public d'un départ plus précoce.

## 12. Âge de référence indexé sur l'espérance de vie (03/11/2026)

Code : section 8 de [`age_libre.js`](age_libre.js) (`ageLegalEnVigueur`, `esperanceVieProjetee`, `trajectoireAgeReference`, `effetAgeReference`, `penibiliteIndexee`, `bilanReference`, `pauvreteReference`, `parDecileReference`, `PAYS_LIEN`) ; test : [`test_age_reference.js`](test_age_reference.js) (`jsc modele.js age_libre.js test_age_reference.js`), sortie : `resultats-age-reference.txt` ; données : `donnees/age_legal_en_vigueur_2026.csv`, `donnees/esperance_vie_projections_insee_2026.csv`. Aucune fonction antérieure modifiée, sauf une mémoïsation de `valeurDepart` (mêmes résultats : les 37 contrôles de § 11 passent, sortie identique).

**Règle décidée par l'auteur (03/11/2026)** : à partir de la génération 1969 (64 ans, loi du 14 avril 2023 maintenue), chaque année d'espérance de vie à 60 ans gagnée reporte l'âge de référence de 2/3 d'année (2/3 au travail, 1/3 à la retraite) ; âge libre autour de cet âge avec coefficient neutre (§ 11) ; départ sans réduction pour pénibilité et carrières longues ; plancher à 1 300 € nets ; contribution de 20 % au-dessus de 2 500 € nets ; indexation prix − 0,5 point au-dessus de 2 000 € bruts.

**Âge légal réellement en vigueur au 03/11/2026** (lu dans le code de la sécurité sociale, art. L161-17-2, version issue de la loi n° 2025-1403 du 30 décembre 2025, LFSS 2026) : 62 ans pour les nés avant le 1er septembre 1961 ; 62 ans 3 mois (sept.-déc. 1961) ; 62 ans 6 mois (1962) ; **62 ans 9 mois (1963 au 31 mars 1965)** ; 63 ans (avril-déc. 1965) ; 63 ans 3 mois (1966) ; 63 ans 6 mois (1967) ; 63 ans 9 mois (1968) ; **64 ans (1969 et après)**. La suspension a donc décalé d'une génération le calendrier de 2023 (la génération 1964 reste à 62 ans 9 mois au lieu de 63 ans) ; la durée d'assurance est de 170 trimestres jusqu'en mars 1965, 171 (avril-déc. 1965), 172 à partir de 1966 (art. L161-17-3). Les sources de presse indiquent une reprise du relèvement en 2028 : le texte consolidé donne le calendrier, pas la durée de la suspension ⚠️ V10100.

- **H61** : âge de référence de la génération g ≥ 1969 = 64 + (2/3) × (e60(g + 60) − e60(2029)), arrondi au mois, jamais en baisse (cliquet). e60 = espérance de vie à 60 ans de l'année où la génération atteint 60 ans (période, sexes réunis). *Choix de conception ; les pays voisins annoncent l'âge 5 ans (Pays-Bas) à 15 ans (Danemark) à l'avance, ce que le modèle suppose.*
- **H62** : espérance de vie projetée : le niveau est la table 2023 (Eurostat/Insee) ; le progrès reproduit le gain d'espérance de vie à 65 ans des projections Insee 2026 (2025 : femmes 23,6, hommes 20,0 ; 2070 central 26,3 et 24,4 ; haute 28,8 et 26,8 ; basse 24,0 et 22,2), par décalage uniforme de la mortalité de Gompertz (§ 11, H51), trajectoire linéaire de 2025 à 2070, sexes réunis = moyenne simple. Le gain à 60 ans en découle (central : +3,4 ans en 2070 contre +3,55 à 65 ans). *Estimation ; l'Insee publie des séries annuelles et des e(60), non lues ⚠️ V10101, V10102.*
- **H63** : comportement. Le report de l'âge effectif de départ d'une cohorte vaut « passage » × (âge de référence de sa génération − 64) : **0,8 (favorable), 0,5 (central), 0,33 (défavorable)** (*mise à jour du 04/11/2026, V12840 : ancien 1,0 / 0,8 / 0,6 ; valeurs sourcées dans `sources/retraites-comportements.md` § 1 : Seibold 2021, Allemagne, un âge normal relevé d'un an décale l'âge moyen de départ d'environ 4 mois, soit 0,33 ; Manoli-Weber, Autriche, +1 an d'âge minimal = +0,4 an ; Pays-Bas 0,6 sur la liquidation ; Bozio, France 1993, 0,4 à 0,8 pour une minorité*). *Constat de la première version (repères, non calibrés) : la Drees mesure +2 ans 2 mois d'âge conjoncturel de départ de 2010 à 2022 pour un relèvement de l'âge légal de 2 ans (périmètre et âges de départ non relus), soit un passage proche de 1 ; l'Insee trouve à 60 ans, pour les générations 1951-1953 touchées par la réforme de 2010, +17 points (hommes) et +16 points (femmes) d'emploi, +7 et +6 de chômage ⚠️ V10103.*
- **H64** : contrepartie. La pension de ceux qui reportent est multipliée par 1 + c × (coefficient neutre − 1) : c = 0 (favorable : le report ne relève pas la pension), 0,25 (central), 0,5 (défavorable). *Hypothèse non sourcée ⚠️ V10105.*
- **H65** : parmi ceux qui reportent, part en emploi : **75 % (favorable), 50 % (central), 35 % (défavorable)** (*mise à jour du 04/11/2026, V12841 : ancien 75 / 65 / 50 % ; évaluations causales : 0,40 Rabaté-Rochut France 2010, 0,32 Pays-Bas, 0,74 Danemark, 0,44 Autriche hommes*) ; le reste est au chômage, en invalidité ou inactif (recettes nulles). *Hypothèse inspirée de l'Insee (2010 : 63 % des hommes et 73 % des femmes qui « restent » sont en emploi, le reste au chômage ou inactif) ⚠️ V10104 ; coût d'indemnisation du chômage non chiffré ⚠️ V10111.*
- **H66** : départ sans réduction. Définitions : « pénibilité » = départ à 60 ans ; « carrière longue » = âge de référence − 2 ans (plancher 60). Part des départs : **5 / 10 / 20 %** (favorable / central / défavorable) (*mise à jour du 04/11/2026, V12843 : ancien 10 / 20 / 30 % ; part NETTE du droit actuel : la carrière longue, environ 1 départ sur 5 au régime général en 2023 (Drees 2025), est déjà dans la trajectoire du COR ; seuls des départs en plus de ce régime coûtent*). Surcoût de la dispense = pension non réduite − pension au coefficient neutre rapporté à l'âge de référence de la génération ; coût total = dépense supplémentaire par rapport au départ à l'âge de base (recettes perdues incluses, borne haute). Montée en charge sur 3 ans à partir de 2028. *Parts et définitions non sourcées ⚠️ V10109 (reprend V10012).*
- **H67** : le dispositif complet additionne les blocs (âge de référence, âge libre avec passage 0,2 / 0,35 / 0,5 de l'écart entre 64 et 60 ans, dispense de réduction, indexation, hautes pensions) sans interaction, plus le coût de substitution (H71). **`passageLibre` n'a pas changé (0,2 / 0,35 / 0,5) : aucune étude d'un départ libre à 60 ans à coefficient neutre n'existe (fait lu, `sources/retraites-comportements.md` § 3) ; c'est une hypothèse assumée de symétrie entre relèvement et abaissement de l'âge, non testée, et le paramètre qui décide du signe du solde de 2040 (± 0,15 = ± 7,6 Md€), V12844.** Les cohortes de base sont celles du COR 2026 (âge conjoncturel 63,1 puis 64,6 ans) ; la dépense de base est la trajectoire du COR. *Les blocs se recouvrent en partie (un départ à 60 ans sans réduction est aussi un départ « libre »), donc la somme est une borne prudente sur les coûts ⚠️ V10110.*
- **H68** : pauvreté. Taux de pauvreté (seuil de 60 %) de 13,3 % pour les retraités (COR 2020, lu dans `sources/retraites-france-allemagne.md`), 30 % pour les personnes hors emploi à 62-66 ans, 7 % pour celles en emploi. *Les deux derniers taux sont des hypothèses ⚠️ V10107.*
- **H69** : mortalité différentielle par décile de pension : l'espérance de vie à 60 ans va de −2,75 an (décile 1) à +2,75 an (décile 10) autour de la moyenne. *Hypothèse tirée d'un écart de 5,4 ans (femmes) et 7,6 ans (hommes) entre les 5 % les plus modestes et les 5 % les plus aisés (Insee, 2012-2016, présentation au COR, résumé non lu à la source) ⚠️ V10108.*
- **H70** : variantes d'espérance de vie. L'effet de la règle est calculé par rapport à une dépense de base qui ne varie pas avec l'espérance de vie : « favorable » (variante haute) mesure l'effet d'un report plus grand, **pas le coût supplémentaire de la longévité**, que la règle ne compense qu'aux deux tiers. Le coût propre de la longévité n'est pas chiffré ici ⚠️ V10110.
- **H71** (ajouté le 04/11/2026, V12842) : coût de substitution. Une part `substitution` des gains de l'âge de référence (économie sur les pensions + recettes) est perdue en dépenses de chômage, d'invalidité et de maladie de ceux qui ne partent plus à la retraite sans être en emploi : **10 % (favorable), 20 % (central), 30 % (défavorable)**. *Sources : Rabaté-Rochut (France, réforme de 2010) : 20 € de dépenses des autres régimes pour 100 € gagnés ; Pays-Bas (Atav-Jongen-Rabaté) : 47 % des économies de pensions perdues en prestations sociales, 28 % repris en recettes fiscales. Valeur absente du modèle avant le 04/11/2026 (V10111). Appliqué au bilan de l'âge de référence seulement, pas à l'âge libre (la symétrie ferait gagner ≈ 3,5 Md€ au central de 2040 : `sensibilite_comportements.js`).* `bilanReference` : champ `substitutionMdE`, compté dans `soldeMdE`, pas dans `economiePensionsMdE`.
- **H72** (04/11/2026, non appliqué) : part en emploi des départs avancés (recettes perdues de l'âge libre et de la pénibilité), défaut 0,5 de `effetAgeLibre` : la note propose 0,40 / 0,45 / 0,55 (Rabaté-Rochut 0,40 ; COR 55,5 % en emploi à 61 ans) ; laissée à 0,5, à trancher (V12845).

**Ce que le modèle montre sur la logique** : l'indexation est un stabilisateur lent. Le report de l'âge de référence est de 4 mois pour la génération 1975 et de 7 mois pour 1980 (central) : aucun effet avant ~2034, 0,14 point de PIB en 2040, 0,47 en 2060 (pensions seules, central). Elle affecte au travail les deux tiers des années de vie gagnées ; elle ne règle ni le déficit hérité ni l'écart avec l'Allemagne.

