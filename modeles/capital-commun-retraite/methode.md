---
titre: Capital commun et retraite : bascule partielle vers la capitalisation, fonds public, mérite, démographie (méthode)
tache: chantier 10 de la boucle « meilleur système »
date: 2026-11-03
statut: brouillon
---

# Capital commun et retraite : méthode

Demande de l'auteur (03/11/2026, positions sur le cahier des charges du système et les grandes entreprises à capital commun) : de grandes entreprises capitalistiques appartenant aux Français, qui redonnent du patrimoine aux plus gros contributeurs ; une bascule vers la capitalisation ; un système qui ne repose pas sur une démographie toujours plus haute. Code : [`modele.js`](modele.js) (fonctions pures), [`test.js`](test.js) (`jsc modele.js test.js`, 22 contrôles), [`rapport.js`](rapport.js) (`jsc modele.js rapport.js` > [`resultats-brut.txt`](resultats-brut.txt)). Résultats : [`resultats.md`](resultats.md).

**Ce module ne refait pas T48 ni T51.** Il les reprend (sources : [`sources/recherche-retraite-capitalisation.md`](../../sources/recherche-retraite-capitalisation.md), [`sources/recherche-colosses-capital-commun.md`](../../sources/recherche-colosses-capital-commun.md), [`modeles/retraites/`](../retraites/)) et ajoute ce qui manquait : un cadrage en **part des cotisations** (10 % et 20 %), le **taux de remplacement** par cohorte, le **krach**, la **sensibilité à la démographie**, le **mérite** (parts proportionnelles aux contributions) et le **rendement d'un actif de calcul public**. Les chiffres sont recoupés avec T48 (pic de double charge : 45 Md€/an pour 3 points, 90 pour 6 ; ici 45 et 90 pour 10 % et 20 %, soit 2,8 et 5,6 points de cotisation).

Légende : fait sourcé (lien) · estimation (calcul de Claude) · hypothèse · ⚠️ non confirmé (registre `verifications.md`, V7321 à V7332).

## 1. Données et sources

| Donnée | Valeur | Source |
|---|---|---|
| Dépenses de retraite | 14,1 % du PIB en 2025, 15,3 % en 2070 ; 422,2 Md€ | [COR, rapport annuel juin 2026](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf) (déjà dans `modeles/retraites/donnees/cor_2026_projections.csv`) |
| Cotisants par retraité | 2,1 (2002), 1,8 (2025), 1,3 (2070) | COR 2026, p. 72 |
| Pension moyenne / revenu d'activité moyen | 54,6 % (2025), 45,3 % (2070) | COR 2026, p. 65 |
| Rendement interne de la répartition (cas type) | 0,8 % réel, génération 2000 | COR 2026, p. 141-142 (⚠️ V2658) |
| Rendement réel net du fonds norvégien | 4,34 % par an, 1998-2025 (frais 0,05 %) | [NBIM, rapport annuel 2025](https://www.nbim.no/en/news-and-insights/reports/2025/annual-report-2025/web-report-annual-report-2025/), vérifié le 03/11 (V6773) |
| Rendements réels de long terme | actions 4,64 % (France 3,25 %), obligations 1,94 % (France 0,83 %), 1870-2015 | [Jordà et al., FRBSF WP 2017-25](https://www.frbsf.org/wp-content/uploads/wp2017-25.pdf) |
| CPP Investments | 793,3 Md CAD, 8,8 %/an nominal sur 10 ans | [communiqué du 20/05/2026](https://www.newswire.ca/news-releases/cpp-investments-net-assets-total-793-3-billion-at-2026-fiscal-year-end-814459989.html) |
| AP7 (Suède) | 8,4 %/an nominal pondéré par le temps 2000-2025 (rapport AP7) ; 7,4 % 2000-2022 (IPE) | `donnees/rendements_et_fonds.csv` (V6778) |
| FRR | 20,7 Md€ ; 4,4 %/an nominal depuis 2010 | COR 2026 p. 99 ; [FRR, rapport annuel 2025](https://www.fondsdereserve.fr/wp-content/uploads/2026/07/FRR-Rapport-Annuel-2025-PAGE.pdf) (V6776) |
| Australie (superannuation) | 4 767 Md AUD, rendement 5 ans 6,3 % nominal | [APRA, juin 2026](https://www.apra.gov.au/quarterly-superannuation-performance-statistics-highlights-june-2026) |
| Dette implicite des retraites | 397 % du PIB, fin 2021 | Eurostat, nasa_10_pens1 (`engagements_implicites.csv`) |
| Revenu disponible par dixième de niveau de vie | D1 53 Md€ à D10 385 Md€, 2023 | [Insee Analyses n° 119](https://www.insee.fr/fr/statistiques/fichier/8973957/ia119.xlsx) (`modeles/fiscalite-orientation/donnees/revenu_par_decile_dina2023.csv`) |
| Marges et investissements des fournisseurs de cloud | AWS 2025 : résultat d'exploitation 45,6 Md$ sur 128,7 Md$ (35,4 %) ; Google Cloud T4 2025 : 30,1 % ; Alphabet : investissements ≈ 91 Md$ en 2025, 175-185 Md$ annoncés pour 2026 | **⚠️ secondaires** (synthèses de presse financière relayant les communiqués d'Amazon et d'Alphabet ; communiqués primaires non lus, V7330) |

Aucun téléchargement n'a été nécessaire : les données du module viennent du dépôt ; les marges du cloud viennent d'une recherche web (liens dans `resultats.md`).

## 2. Modèle de la bascule partielle (bloc A)

**Principe.** Chaque année t à partir de 2027, une part s(t) des cotisations retraite F(t) est versée à un fonds public par capitalisation au lieu de payer les pensions du moment. Les droits correspondants sont servis plus tard par le fonds (promesse : l'équivalent de ce qu'aurait donné la répartition). Pendant ce temps, les droits déjà acquis restent dus par le budget.

- **H1** — Euros constants 2025. PIB 2025 = 2 994 Md€ ; P(t) = dépenses de retraite = PIB(t) × part (14,1 % → 15,3 % en 2070 puis stable, interpolation linéaire du COR). *Fait sourcé + interpolation.*
- **H2** — Cotisations F(t) = P(t) (équilibre de base). Le solde négatif du COR (−0,2 % du PIB en 2025, −2,4 % en 2070) n'est **pas** imputé à la bascule : c'est un problème de la répartition, déjà là. *Simplification.*
- **H3** — Croissance du PIB et de la masse salariale = ρ (rendement implicite de la répartition, loi d'Aaron : la répartition rend la croissance de la masse salariale ; Sinn, NBER WP 7592). ρ = 1,2 / 0,6 / 0,3 % (bas / central / haut). Central : productivité +0,7 %/an (COR) et cotisants −0,13 %/an donnent ≈ 0,6 %, cohérent avec le 0,8 % du COR. *Estimation, ⚠️ V2658.*
- **H4** — Montée en charge linéaire de s sur 10 ans (2027-2036), puis s constant : 10 % ou 20 % de F, soit 2,8 ou 5,6 points sur 27,8 % de cotisation moyenne (OCDE). *Choix de Claude, paramètre.*
- **H5** — Carrière 40 ans, retraite 22 ans, cohortes de taille égale, pas de mortalité intra-retraite (même simplification que T48).
- **H6** — Part f(u) des pensions de l'année u servie par le fonds = moyenne, sur les cohortes retraitées, de la part des droits issue des cotisations détournées, pondérée par la valeur notionnelle revalorisée au taux ρ. Double charge D(t) = s(t)·F(t) − f(t)·P(t) : ce que l'État dépense en plus que la répartition (positif au début, nul en régime stable, négatif ensuite si r > ρ).
- **H7** — Fonds : A(t+1) = A(t)(1 + r) + s·F − f·P. Le fonds sert la promesse « équivalent répartition » ; le surplus (r > ρ) reste dans le fonds.
- **H8** — Rendement réel net r = 2,0 / 3,5 / 4,34 % (bas / central / haut). 4,34 % = NBIM ; 3,5 % = fonds à ≈ 70 % d'actions diversifiées, prudent (France actions seules : 3,25 % sur 1870-2015) ; 2,0 % = gestion médiocre ou allocation prudente. Volatilité σ = 14 / 12 / 11 %. *Choix de Claude appuyé sur les sources ci-dessus.* Repères de rendement sans risque : obligations d'État françaises 0,83 % réel (JST, 1870-2015, long terme, ⚠️ pas le taux d'aujourd'hui, non vérifié V7321).
- **H9** — À la retraite, le capital est converti en rente au rendement r − 1 point (prudence) ; la rente de répartition est convertie au taux ρ. *Choix de Claude.*
- **H10** — « Bas » = défavorable à la capitalisation (r bas, ρ haut) ; « haut » = favorable.
- **H11** — Financement de la double charge : trois voies comparées : (a) dette à taux réel i = 1,5 % (H12), le fonds en détenant l'actif ; (b) hausse de cotisation ; (c) ressources (taxe sur le patrimoine, cessions), **déjà comptées ailleurs** (§ 7 de `resultats.md`).
- **H12** — i = 1,5 % réel central, 2,5 et 3,5 % en sensibilité. ⚠️ Choix de Claude, non confronté au taux de l'OAT à 10 ans d'aujourd'hui (V7321). Au passage : prêter à l'État pour placer en actions rapporte le spread r − i, qui est la prime de risque ; à i = r, le gain net est nul (identité de Sinn, testée).

**Dette implicite.** Eurostat chiffre à 397 % du PIB les droits à pension déjà acquis (fin 2021). La bascule ne change pas ce stock : elle en rend visible une partie (le cumul de double charge) si on l'emprunte. Le module chiffre ce cumul ; il ne prétend pas « effacer » la dette implicite.

## 3. Taux de remplacement et risque (bloc B)

- **H13** — Taux de remplacement de référence 2060 : 47,4 % (interpolation linéaire du COR entre 54,6 % en 2025 et 45,3 % en 2070). *Estimation.*
- **H14** — Salaire individuel : +0,7 %/an (productivité). Pension de la cohorte qui part en v = (part répartition revalorisée à ρ) / rente(ρ) + (capital accumulé à r) / rente(r − 1 pt). Rapport pension mixte / pension de répartition, appliqué au taux de référence.
- **H15** — Stress déterministes : krach de −30 % ou −40 % l'année précédant le départ ; rendement nul sur les 20 dernières années de carrière ; rendement nul sur toute la carrière. Monte-Carlo : rendements annuels log-normaux de médiane r, volatilité σ (graine fixe, 4 000 tirages). La loi log-normale i.i.d. sous-estime les queues épaisses et l'autocorrélation (décennies perdues : Nikkei 34 ans pour retrouver le niveau de 1989, `rendements_et_fonds.csv`) : d'où les chocs déterministes.
- **H16** — Krach du fonds : −30 % de l'actif en 2045 ou 2060, promesse maintenue (le déficit est comblé par l'État).

## 4. Démographie (bloc C)

- **H17** — À taux de cotisation fixe, la pension servie en répartition est proportionnelle au nombre de cotisants par retraité X (COR : 1,8 en 2025, 1,3 en 2070 ; X0 = 1,41 en 2060 par interpolation). La part capitalisée (s_eff) n'en dépend pas directement. Pension du système mixte = RR0 × [(1 − s_eff)·X/X0 + s_eff·M], M = rapport capital/notionnel de la cohorte. *Estimation.*
- **H18** — Limites : (i) hypothèse dite de l'« effondrement des actifs » (asset meltdown) : une population vieillissante vend des actifs et pèse sur leurs prix ; la littérature (Poterba) trouve peu d'effet empirique, ⚠️ cité de mémoire (V7324) ; (ii) la capitalisation en économie ouverte (placement mondial) s'en protège en partie ; (iii) les retraités à la charge des actifs restent, quel que soit le système, une demande sur la production courante : la capitalisation ne supprime pas la contrainte démographique, elle la déplace sur les prix des actifs et sur le rendement.

## 5. Mérite et générations (bloc D)

- **H19** — Parts du fonds attribuées en points proportionnels aux contributions, avec un plancher universel φ : part du dixième i = φ/10 + (1 − φ) × y_i / Σ y. Approximation des contributions par le revenu disponible net par dixième de niveau de vie (INSEE, 2023). ⚠️ C'est un proxy : les cotisations suivent les salaires, plafonnés pour une part (PMSS), et les revenus du patrimoine ne cotisent pas aux retraites ; la concentration réelle des cotisations est plus faible que celle du revenu total (V7325).
- **H20** — Points par cohorte de naissance : somme, sur les années actives (22 à 61 ans) postérieures à 2027, de la part de masse cotisée détournée s(t). Effectif actif supposé constant par cohorte (H21 simplification).

## 6. Fonds public et colosses (bloc E)

- **H22** — Un « colosse » (centre de données, calcul, inférence) est modélisé par le TRI d'un actif de coût 1 : EBITDA la première année e (en part du capex), baisse annuelle δ des prix, durée 6 ans (équipement), valeur résiduelle nulle ; variante bâtiment et énergie 20 ans à e/2. e et δ sont des **hypothèses de grille**, non des mesures : on lit à quelles conditions le TRI dépasse 4 %.
- **H23** — Les marges de cloud citées plus haut sont des marges d'exploitation de **services** (logiciel inclus) d'acteurs établis ; elles ne mesurent ni le TRI d'un entrant public ni celui d'un actif marginal. ⚠️ Secondaires.
- **H24** — Capital pour un dividende : K = d × 12 × N / r (T51, N = 68,6 M).
- **H25** — Pas de modèle du prix d'inférence : la baisse rapide du prix du jeton et la concurrence des modèles ouverts sont des faits constatés par la presse sectorielle, non sourcés ici (⚠️ V7331) ; δ en tient lieu.

## 7. Scénarios

| Paramètre | Bas | Central | Haut |
|---|---|---|---|
| Rendement réel net r | 2,0 % | 3,5 % | 4,34 % |
| Rendement implicite de la répartition ρ (= croissance) | 1,2 % | 0,6 % | 0,3 % |
| Volatilité σ | 14 % | 12 % | 11 % |
| Part détournée s | 10 % et 20 % | idem | idem |

Des hypothèses et des ordres de grandeur, jamais des prédictions.

## 8. Effets de comportement et de rebond (non chiffrés)

| Effet | Sens | Statut |
|---|---|---|
| Substitution avec l'épargne privée (0,65-0,75 € par euro de droit, Attanasio et Rohwedder, Royaume-Uni) | réduit l'effet net sur l'épargne nationale | ⚠️ V469, non chiffré |
| Prix des actifs : un fonds de 1 à 2,8 fois le PIB placé en partie en France ferait monter les cours puis baisser les rendements | réduit r | qualitatif ; d'où placement mondial (H8) |
| Risque politique (Argentine 2008, Hongrie 2010, Pologne 2014, FRR détourné) | réduit le fonds | sourcé en secondaire ⚠️ V2656 |
| Rebond côté travail : points proportionnels aux contributions = incitation à déclarer et à travailler (positive) ; plancher universel = effet inverse (faible) | ambigu | non chiffré |
| Fuite des plus gros contributeurs si le mérite est abandonné ou plafonné | négatif sur les recettes | non chiffré |

## 9. Droit

Aides d'État (art. 107 TFUE, critère de l'investisseur privé avisé) et libre circulation des capitaux (art. 63 TFUE) : instruits dans [T51, § 4](../../sources/recherche-colosses-capital-commun.md) ; droits à pension et protocole n° 1 de la CEDH : [T48, § 3.4](../../sources/recherche-retraite-capitalisation.md). Pour le mérite : attribuer des parts d'un fonds public en proportion des contributions est dans la logique des régimes contributifs (points) ; un plancher universel et le plafonnement des parts relèvent de l'égalité devant les charges publiques (art. 13 DDHC) ; aucune décision précise du Conseil constitutionnel n'a été lue sur un fonds public à parts nominatives (⚠️ V7326).
