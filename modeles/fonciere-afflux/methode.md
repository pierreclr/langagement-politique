---
titre: Afflux vers la foncière et effets sur les prix — méthode
date: 2026-11-09
statut: brouillon ; des ordres de grandeur sous hypothèses, jamais des prédictions
---

# Afflux vers la foncière et effets sur les prix : méthode

**Écrit par Claude (IA d'Anthropic) pour l'auteur**, le 09/11/2026. Résultats : `resultats.md` (généré par `code/calculer.py`, ne pas éditer à la main). Valeurs et sources de toutes les hypothèses : `donnees/parametres.json` (un seul fichier, lu par le code).

**Précaution de méthode.** Ce modèle ne présente jamais une hausse des prix comme un avantage sans dire qui la paie et qui en profite. Il pose une règle : pendant l'expérimentation, la foncière n'achète aucun bien d'un responsable du projet ni de ses proches, ou seulement sous évaluation indépendante publiée. Claude est un modèle d'Anthropic, sans intérêt financier connu dans le logement ; son biais connu est de vouloir aider l'auteur, d'où l'obligation de tester ses affirmations dans les deux sens.

Légende : **fait** (source lue, cote A à D selon la règle 11 de la charte de travail (CONTRIBUTING.md)) · **estimation** (méthode donnée) · **hypothèse** (de Claude) · ⚠️ non sourcé ou non vérifié.

## 1. La question

Décisions de l'auteur du 09/11/2026, transmises avec la demande (le § 30 annoncé de la note de conception de la foncière (atelier, non publiée) n'est pas dans la copie de travail : voir § 7, anomalie 1) : une foncière publique entre dans l'achat d'un logement que **le jeune a trouvé et négocié** ; le jeune y accède une fois dans sa vie, **à son premier emploi stable** et au plus tard à 35 ans ; il achète l'usufruit à vie au prix forfaitaire **f × prix de la transaction, travaux compris** (f = 70, 80, 85, 90 %), financé par la foncière sur 25 ou 30 ans au taux bancaire ; son capital de départ (40 000 € × e^(−héritage/80 000 €)) n'est pas versé en argent : c'est son apport, contrepartie de sa renonciation à la nue-propriété ; qui n'entre pas reçoit la moitié de son capital en parts à vie ; l'occupant paie la contribution sur la résidence principale (0,25 % par an) ; ouverture par cercles (bâtisseurs d'abord), plafond d'entrées à étudier. Compléments de l'auteur pendant le travail (09/11) : réforme locative (bail unique, plafond de loyer selon l'énergie, fin des avantages fiscaux de l'investissement locatif) et foncière comme sortie équitable pour les bailleurs ; suppression des droits de mutation ; expérimentation de cinq ans avec des bâtisseurs en alternance, dans une ville candidate et volontaire, de taille intermédiaire de préférence, disposant de locaux pour la formation (ville non choisie) ; clause de sortie (rachat de la nue-propriété) ; garantie à la génération qui a 20 ans au lancement.

Ce que l'on cherche : l'ampleur de l'afflux et ses effets (prix par secteur et par taille, gagnants et perdants, finances publiques), les réglages qui le rendent tenable, et ce qu'une expérimentation peut en apprendre.

## 2. Ce que fait le modèle

1. **Déclencheur et afflux** (`code/afflux.py`). Une génération (830 000) est découpée en cellules : 40 groupes d'héritage (loi de `capital-de-depart`, via `capital-de-depart-options/donnees/heritages.json`) × 10 déciles de revenu (corrélés à l'héritage) × 4 secteurs × 5 âges au premier emploi stable × 3 types de ménage. Chaque ménage choisit entre la foncière, l'achat bancaire et la location selon des règles explicites (effort ≤ 35 %, accès bancaire, valeur de ce qu'il abandonne) ; s'il le peut, il monte d'une taille. Financement mixte : au-delà de f × prix du T3 médian du secteur, une banque prête le complément. Plafond d'entrées servi par héritage croissant ou à proportion.
2. **Offre** (`code/offre_prix.py`). Parc locatif privé SDES 2025 par surface et classe DPE, réparti entre secteurs ; plafond de loyer (résultats centraux de `loyers-energie`) à la relocation ; ventes des bailleurs proportionnelles à la perte de revenu net ; fin des avantages fiscaux ; en regard, ventes que l'interdiction de louer aurait provoquées en droit actuel (supprimées par la réforme).
3. **Prix**. Effet de niveau = (demande additionnelle − offre additionnelle) / ventes du segment × réponse du prix du secteur, avec diffusion entre tailles. Trois mondes : réforme locative seule, foncière seule, les deux. Variantes : suppression des droits de mutation (capitalisation, ventes plus nombreuses), comparaison à un point de taux, recoupement par la capitalisation d'une aide.
4. **Finances** (`code/finances.py`). `fonciere-usufruit/code/fonciere.py` est réutilisé **sans modification**, en mode `forfait`, avec les entrants calculés (contrats, âges, prix moyen, apport moyen = capital + part bancaire) ; pour un chemin d'entrées imposé, `capital-de-depart-options/code/options.simuler_chemin` remplace `fonciere.entrants` le temps d'un appel puis la restaure (test). Coût de l'argent 3,5 / 4,7 / 5,3 % ; seuils (forfait, marge, livret foncier) pour le test des 50 % sur 30 et 60 ans par `fonciere.seuil_parametre`.
5. **Gagnants et perdants**, **réglages** (règle « neutre en prix », grille sous contraintes, transition par cercles), **expérimentation** (`code/experimentation.py` : cas types des bâtisseurs, coûts et dette sur cinq ans, puissance statistique, clause de sortie, garantie, capacité de rénovation, une seule ville avec trois profils génériques ; Grenoble comme exemple chiffré).

## 3. Ce que le modèle ne fait pas

- Pas d'équilibre dynamique : les effets sur les prix sont des **niveaux** atteints en 5 à 10 ans, sans construction induite au-delà de l'élasticité de l'offre, sans récession ni choc de taux.
- Les comportements (vouloir se fixer, refus bancaires, ventes des bailleurs, effet d'appel, montée en gamme) sont des **règles de décision**, pas des estimations : les parts qui en sortent sont des hypothèses mises en forme.
- La simulation financière de la foncière reste **nationale** (prix moyen des contrats) et ne reprend pas la hausse des prix qu'elle provoque.
- La contribution sur le patrimoine des bailleurs (chapitre 3 : le locatif entre dans la courbe, jusqu'à près de 3 % par an) n'est pas modélisée ; elle pourrait faire vendre bien plus que le plafond de loyer.
- Pas d'effet de la réforme sur les loyers au-delà d'un ordre de grandeur ; pas de mobilité ni de revente des usufruitiers ; pas de défaut détaillé.
- Paris : presque personne n'entre (prix) ; ce que le modèle dit de Paris porte sur la réforme locative.

## 4. Hypothèses numérotées

Valeurs bas / central / haut : convention « bas = faible afflux et faible hausse des prix ». Toutes les URL, dates de consultation (09/11/2026 sauf mention), cotes et conflits d'intérêts sont dans `donnees/parametres.json` ; les principales sont reprises ici. Une hypothèse reprise d'un modèle existant est citée par son fichier et son numéro.

### 4.1 Population, revenus, choix

| N° | Hypothèse | bas / central / haut | Source, cote, statut |
|---|---|---|---|
| H-FA1 | Génération | 830 000 | H-CO1 (`capital-de-depart-options`), Eurostat, A |
| H-FA2 | Âge au premier emploi stable (≤ 23, 24-26, 27-29, 30-32, 33-35 ans ; reste : pas avant 36 ans) | 30/30/14/7/5 % (14 %) · **40/30/10/5/3 % (12 %)** · 45/30/8/4/3 % (10 %) | **Estimation** calée sur : sortie de formation initiale à 22 ans en moyenne (Céreq, Bref n° 422, mai 2022, https://hal.science/hal-03666641v1/document, A) ; 19 mois en moyenne pour le premier emploi à durée indéterminée, 84 % en ayant occupé un environ six ans après la sortie (Insee, Formations et emploi 2025, fiche 2.12, https://www.insee.fr/fr/statistiques/fichier/8305534/BFE2025-F18.pdf, A) ; Génération 2021 : 47 % en EDI à 3 ans (Céreq, Bref n° 487-488, juillet 2026, A). **Aucune distribution publiée** : inférence ⚠️. Le chiffre « 27 ans pour le premier CDI » (CESE 2012) n'a pas de source primaire : écarté |
| H-FA3 | Revenu net au premier emploi stable : log-normale, médiane 1 800 €, σ = 0,30, plancher 1 100 € ; multiplicateur | 0,9 / **1** / 1,1 | **Estimation** : médiane à 3 ans 1 600 € en 2020 (Génération 2017) revalorisée ; 1 530 € à l'embauche du premier emploi (Génération 2021) ; dispersion tous âges D1 1 490 €, D9 4 330 € (Insee, salaires du privé 2024, https://www.insee.fr/fr/statistiques/8733089, A), réduite pour les jeunes ⚠️. **Remplace H-CO3**, non sourcée |
| H-FA4 | Revenu selon l'âge d'entrée : 0,95 (22 ans) à 1,18 (34 ans) | — | Insee : EQTP 1 620 € avant 25 ans, 2 550 € à 25-39 ans (A) ; pente atténuée ⚠️ |
| H-FA5 | Héritage (log-normale, 10 % sans héritage) ; corrélation de rang avec le revenu 0,3 | — | H-CO2, H-CO4 (⚠️ V7802) |
| H-FA7 | Jeunes répartis comme les ventes DVF ; variante « jeunes plus urbains » | DVF / **DVF** / urbain | H-CO6 (A pour DVF ; variante ⚠️) |
| H-FA9 | Ménage seul (T2), couple (T3), famille (T4), parts selon l'âge ; revenu du couple × 1,8 ; capital du conjoint du même ordre ; un contrat par ménage | — | ⚠️ ordres de grandeur |
| H-FA10 | Effort ≤ 35 % (HCSF, A) ; entretien 0,75 % de la valeur (H-FU39 ⚠️) ; loyers de la carte des loyers 2025 (H-FU37, A) | — | — |
| H-FA11 | Part qui veut se fixer à son premier emploi stable | 50 / **60** / 70 % | H-CO10 ⚠️ |
| H-FA12 | Refus bancaire pour précarité (H-CO9) × | 0,35 / **0,5** / 0,65 | H-CO9, réduit parce que l'emploi est stable ⚠️ |
| H-FA13 | Valeur de la nue-propriété abandonnée (taux net r) et prime de liberté φ ; parts à vie valent 0,6 € l'euro | r 3,5 / **2,5** / 1,5 % ; φ 15 / **10** / 5 % | H-CO12, H-CO14 ⚠️ |
| H-FA14 | Montée d'une taille si l'effort reste ≤ 30 % | 25 / **50** / 75 % | ⚠️ non sourcé |
| H-FA15 | Financement mixte : la foncière finance jusqu'à f × prix du T3 médian du secteur, la banque le reste, au taux bancaire + écart | écart 0 / **0,5** / 1,5 pt | Règle de Claude ; limite : un usufruit viager est hypothécable mais la garantie s'éteint au décès (Code civil, non relu ⚠️) |
| H-FA16 | Taux bancaire 3,32 % (Banque de France, septembre 2026, A) ; effet d'appel (entrent sans vouloir se fixer si la foncière coûte moins que le loyer) ; adhérents | appel 5 / **10** / 20 % ; adh 1 / **3** / 5 % | d'après H-CO13 (réduit : le capital non utilisé n'est pas perdu), H-CO16 ⚠️ |
| H-FA17 | Demande additionnelle : 1 pour un non-bancarisé, α pour un bancarisé | α 0,2 / **0,3** / 0,5 | H-CO17 (⚠️ V7803) |

### 4.2 Prix

| N° | Hypothèse | bas / central / haut | Source, cote, statut |
|---|---|---|---|
| H-FA20 | Ventes par an ; parts par taille d'après DVF 2024 (`fonciere-usufruit/donnees/secteurs.csv`) ; ventes hors T2-T4 réparties moitié T1, moitié T5+ | 1,2 / **1,1** / 1,0 million | H-FU28 ; Insee : 951 000 ventes d'anciens fin 2025 (A) ; répartition ⚠️ |
| H-FA21 | Élasticité de l'offre : Paris 0,5/**0,3**/0,1 ; métropoles 0,65/**0,4**/0,2 ; villes moyennes 0,8/**0,5**/0,3 ; rural 2/**1**/0,8 ; demande 0,67 ; réponse du prix = 1/(offre + demande) | — | Fourchettes de `sources/prix-immobilier-effets-mesures.md` (« Ce que le modèle peut en tirer ») : **interprétation de son auteur, pas des estimations publiées** ; la ventilation par zone est son choix, aucune étude ne la donne ; France entière ≈ 0,5 (OCDE WP 1589, 2019 : 0,49 ; Chapelle, Eyméoud et Wolf, THEMA 2023-08, B ; financement ANR et Société du Grand Paris) ; métropoles : moyenne de Claude ; demande : Friggit, CGEDD 2021 (B). L'offre française est parmi les plus inélastiques de l'OCDE |
| H-FA22 | Diffusion entre tailles σ ; réponse des T1-T2 plus faible de e, des T4+ plus forte de e | σ 0,7 / **0,5** / 0,3 ; e 0,4 / **0,2** / 0 | Qualitatif : l'offre de 1-2 pièces s'ajuste (Grislain-Letrémy et Trevien, BdF 2023, B) ; amplitudes ⚠️ |
| H-FA23 | Droits de mutation : 5,8 % du prix (5,81 % ; 6,32 % dans 80 départements de 2025 à 2028, hausse non applicable aux primo-accédants) ; recette 14,7 Md€ (2024) | — | LFI 2025 art. 116, DGCL (A) ; recette : chapitre 6 (Insee) ; 9,9 Md€ pour les seuls départements (OFGL, A) : écart de périmètre |
| H-FA24 | Part de la suppression des droits capitalisée κ ; hausse durable des ventes μ | κ 40 / **70** / 100 % ; μ 25 / **10** / 0 % | Dossier de preuves : Besley et al. 2014 (≈ 40 %, résumé), Dachis et al. 2012 (≈ 100 %, lu) ; μ : Best et Kleven 2018, Bérard et Trannoy 2018 ⚠️ extrapolation. La contribution de 0,25 % remplace la taxe foncière (0,27 % aujourd'hui, chapitre 3) : pas d'impôt annuel nouveau à capitaliser pour l'occupant |
| H-FA25 | Semi-élasticité du prix au taux | −2,5 / **−5** / −9 % par point | Dossier de preuves : BCE (Economic Bulletin 6/2022 ; WP 2789), B ; recoupement de Claude : Labonne et Welter-Nicol (élasticité au crédit 0,4-0,7, B) × −10 % de capacité d'emprunt par point |
| H-FA26 | Part d'une aide capitalisée (recoupement) | 0 / **30** / 65 % | Dossier de preuves (Carozzi, Hilber, Yu ; Fack), A/B |

### 4.3 Offre des bailleurs

| N° | Hypothèse | bas / central / haut | Source, cote, statut |
|---|---|---|---|
| H-FA30 | Parc locatif privé 8 301 000 résidences principales, par surface et classe DPE (01/01/2025) | — | SDES/ONRE, 12/11/2025, Tableau 2 (`donnees/brutes/dpe-parc/onre-parc-dpe-2025-donnees.xlsx`, https://www.statistiques.developpement-durable.gouv.fr/le-parc-de-logements-par-classe-de-performance-energetique-au-1er-janvier-2025), A ; extrait par `donnees/preparer_parc.py`. Le bon taux de passoires est **13,8 %** ; « 29,3 % » est la part des passoires de toutes les résidences principales situées dans le locatif privé |
| H-FA31 | Rotation locative | 23 / **21** / 19 % | SDES, Chiffres clés 2022 (23 %, A-/B) ; question écrite 6458 (19 %, C) |
| H-FA32 | Classes réparties entre secteurs d'après les DPE ADEME de villes témoins (Paris ; Lyon et Grenoble ; Angers ; Creuse), total national conservé ; plafond de loyer : part des loyers coupés et baisse par classe et taille, scénario central de `loyers-energie/resultats/synthese.csv` (k = 1,2) ; surfaces → tailles → segments de prix | — | `donnees/preparer_dpe.py` ; flux de DPE, pas le parc ⚠️ ; villes témoins, pas des moyennes ⚠️ |
| H-FA33 | Probabilité de vendre = v × (perte de revenu net / 15 %), au plus 1 ; revenu net = 70 % du loyer | v 30 / **15** / 5 % | **⚠️ non sourcé** : aucune étude ne mesure la part des bailleurs qui vendent (dossier de preuves, § 5.4) ; les repères (Paris 0 %, Catalogne ≈ 10 %, San Francisco 15 %) mesurent un **retrait d'offre locative**, pas des ventes ; intentions déclarées 40 % (Guy Hoquet, D) |
| H-FA34 | Fin des avantages fiscaux : ≈ 546 000 logements sous défiscalisation (≈ 3 300 € par an) ; ≈ 1,37 million de foyers LMNP (≈ 300 € par an) ; ventes étalées sur 5 ans ; part du stock qui perd l'avantage en cours | 100 / **50** / 0 % | Voies et moyens, tome II, PLF 2026 (A) ; LMNP : IGF 2016 via la presse (C ⚠️) ; micro-foncier, déficit foncier de droit commun et amortissement LMNP non chiffrés par le PLF ; répartitions ⚠️ ; rétroactivité juridiquement fragile ⚠️ |
| H-FA35 | Droit actuel : interdiction de louer G (2025), F (2028), E (2034) ; 10 % des logements interdits vendus à la relocation | — | ≈ 15 % de sorties parmi les non rénovés (`loyer-energie`, V10218) × deux tiers ⚠️ |

### 4.4 Finances, transferts

| N° | Hypothèse | bas / central / haut | Source, cote, statut |
|---|---|---|---|
| H-FA40 | Impôt + prélèvements sociaux sur un euro de revenu foncier | 30 / **40** / 47 % | ⚠️ ; revenus fonciers 2024 (DGFiP) : micro 8,5 Md€, réel 35,0 Md€ nets |
| H-FA41 | Coût de l'argent de la foncière | 3,5 / 4,7 / 5,3 % | H-FU11 ; `taux-endogene` (OAT exogène 4,7 % ; endogène 2032 5,3 %) |
| H-FA42 | Simulation : `fonciere.py` central (H-FU19 à H-FU27, H-FU45, H-FU48), sans viagers ni dations, montée linéaire 10 ans ; contrat au taux bancaire (+ marge) | — | Réutilisation sans modification |
| H-FA45 | Aide au logement évitée après remboursement, pour qui serait resté locataire | — | H-CO31 |
| H-FA50 | Décote d'un appartement G / maison G par rapport à D : 12 % / 25 % ; rénovation 350 / **450** / 600 €/m² | — | Notaires 2024 via relais (B/C ; profession intéressée aux volumes) ; Anah 2024 : 22 343 € par logement en copropriété (A) ; acteur commercial (D) ⚠️ |
| H-FA52 | Surpaiement 1 / 3 / 5 % ; dispersion du prix autour d'une valeur de référence indépendante 10 % | — | ⚠️ |
| H-FA60 | Grille : f 70-90 %, 25-30 ans, marge 0-2 points, plafond d'entrées 3 à 25 % d'une génération (servi par héritage croissant) ; contraintes : hausse ≤ 5 % par secteur, test des 50 % sur 30 ans à 3,5 %, capital ≤ 14,7 Md€ | — | H-CO24 (plafond de coût) ; contraintes fixées par l'auteur |

### 4.5 Expérimentation, sortie, garantie, capacité

| N° | Hypothèse | bas / central / haut | Source, cote, statut |
|---|---|---|---|
| H-FA70 | Bâtisseur : formation à 20 ans, chantier de 6 / **12** / 18 mois avant d'entrer dans le logement (≈ 21 ans) ; T2 de 40 m², passoire achetée 12 % sous le prix, rénovation comptée en matériaux (50 / **60** / 80 % du coût) | — | ⚠️ ; décisions de l'auteur |
| H-FA71 | Coût de la formation : coût net par formé 5 / **34** / 92 k€ | — | `batisseurs-et-repas` (67 k€ brut dont 33 k€ de valeur des travaux faits) : la main-d'œuvre des alternants n'est pas recomptée dans la rénovation |
| H-FA72 | Gestion et accompagnement 1 200 / **1 800** / 2 500 € par contrat et par an ; impayés 0,2 / **0,5** / 1 % | — | H-FU25, H-FU27 ⚠️ |
| H-FA73 | Revenu de l'alternant : 43 % du Smic à 20 ans (1re année), 61 % et 78 % à 21 ans (2e et 3e années), Smic 1 867,02 € brut ; exonération de cotisations et de CSG-CRDS jusqu'à 50 % du Smic ; formation de 18 mois ; ouvrier qualifié à la sortie 1 480 / **1 360** / 1 260 € nets | — | Service-public.gouv.fr, F2918, vérifié le 08/09/2026, consulté le 09/11/2026 (A) ; `batisseurs-et-repas` H7 ; Céreq Génération 2021, CAP-BEP (A) |
| H-FA75 | Système proposé : plancher 877 € (part logement de 250 € comprise, retirée avec le revenu, maintenue pendant l'accession) ; droit actuel : aide du locataire 220 / **180** / 140 € **maintenue pendant l'accession par la loi d'expérimentation** (décision de l'auteur), perte en sensibilité | — | Plancher : chapitre 4 (donnée de l'auteur, chapitre absent de la copie) ; APL accession supprimée pour les prêts depuis 2018 (F14 de `fonciere-usufruit`, B) ; APL moyenne locative 222 € (DHUP 2024, A) ; montant pour un alternant ⚠️ non calculé au barème |
| H-FA76 | Villes types (résultat principal : profils génériques) : métropole régionale (exemple chiffré : Grenoble, 2 338 ventes d'un seul logement en 2024, ≈ 87 000 résidences principales ⚠️), ville moyenne (1 500 ventes) et petite ville (300) types ; 30 % de E-F-G | — | DVF 2024 (`donnees/preparer_grenoble.py`, A) ; autres ⚠️ |
| H-FA77 | Copropriété : isolation intérieure −45 % du besoin de chauffage, 160 €/m², 4 % de surface perdue ; rénovation d'ampleur en copropriété 22 343 € par logement ; immeuble de 20 lots | — | `loyers-energie` H12-H13 (⚠️ V29007) ; SDES/Anah 2024 (A) |
| H-FA78 | Détection : écart-type des évolutions communales de prix 6 %, risque 5 %, puissance 80 %, témoins deux fois plus nombreux ; impayés 1 %, emploi à la sortie 65 %, achèvement 70 % | — | ⚠️ ordres de grandeur |
| H-FA79 | Sortie : prix +2,5 %/an, revenus +3,5 %/an, frais de revente 5 %, travaux rendus à leur coût (variante 3), nue-propriété évaluée au taux de tarification (H-FU7) | — | ⚠️ |
| H-FA80 | Capacité : 0,28 / **0,35** / 0,45 année-ETP par rénovation d'ampleur ; maintien dans la filière 70 / **60** / 45 % ; départs 5 / **8** / 12 % par an ; logements entrants à rénover 15 / **40** / 50 % | — | `batisseurs-et-repas` H5 (⚠️ V32308), H14, H15 ; 40 % de E-F-G dans les ventes d'anciens (bilan notarial 2024, relayé, C ⚠️) |
| H-FA84 | Compagnons du Devoir : plus de 11 000 jeunes formés par an (35 métiers) ; 2 552 nouveaux contrats en juin 2024 | — | Plaquette 2026 et lettre du conseil n° 88 (acteur, C) ; part du bâtiment, Fédération et Union compagnonniques : non trouvées ⚠️. À ne pas confondre avec l'association Compagnons Bâtisseurs |
| H-FA85 | Garantie : généralisation à l'an 5 ; droit des générations de 20 ans ou moins au lancement, borne d'âge suspendue pendant l'attente ; service des plus âgés d'abord | — | Règle de l'auteur ; `options.transition` (règle « entrantes », borne d'âge levée) |

### 4.6 Schéma « usufruit à 60 %, sans capital de départ » (11/11/2026)

Schéma proposé par l'auteur le 11/11/2026, à l'étude : le jeune achète l'usufruit à vie à 60 % de la valeur, sans apport ; la foncière paie la nue-propriété (40 %) ; plus de capital de départ ni de parts à vie. Code : `afflux.reglage_usufruit60()`, `finances.nue_propriete_payee`, `maastricht`, `deficit`, `avantage_cache` ; générateur `code/usufruit60.py` ; résultats `resultats-usufruit-60.md` (généré, ne pas éditer à la main). Tout le reste du modèle (H-FA1 à H-FA85) est inchangé.

| N° | Hypothèse | bas / central / haut | Source, cote, statut |
|---|---|---|---|
| H-FA90 | Part du prix (travaux compris) payée par le jeune pour l'usufruit : f = 60 % ; capital de départ G = 0 ; parts à vie = 0 ; sensibilité 55 / 60 / 65 / 70 % | — | Décision de l'auteur (11/11/2026) |
| H-FA91 | Le choix du ménage reste celui de H-FA13 : un bancarisé prend la foncière si valeur de l'usufruit (taux net r) − f − φ ≥ 0 ; sans capital, plus d'« alternative » en parts à vie. Conséquence : seuil de bascule ≈ 68 % du prix au central | r, φ de H-FA13 | ⚠️ hypothèses non mesurées (H-CO12) ; la convention bas / haut de H-FA13 n'est plus monotone pour ce schéma (le « haut » fait entrer moins de monde que le central) |
| H-FA92 | Qui prête les 60 % : **mixte** au central (foncière jusqu'à 60 % du prix du T3 médian du secteur, banque au-delà, H-FA15) ; variantes « tout par la foncière » et « tout par une banque » (taux bancaire + écart H-FA15) | mixte | Règle de Claude ; la décision dit « prêt bancaire ou de la foncière ». **⚠️ non vérifié** : qu'une banque prête 100 % d'un usufruit viager sans apport (garantie qui s'éteint au décès) |
| H-FA93 | Nue-propriété payée par an = acquisitions de la foncière (prix + 1 % de frais + rénovation des passoires − décote) − usufruit vendu, sorties de `fonciere.py` (mode forfait, non modifié) | — | Estimation (méthode donnée) |
| H-FA94 | Grille de taux « 3,3 % » et « 4,7 % » : coût de l'argent de la foncière **et** taux des contrats égaux à cette valeur (le taux bancaire du contrefactuel aussi) | 3,3 / 4,7 % | Choix de Claude pour lire la demande ; central inchangé (argent 3,5 %, contrats 3,32 %, H-FA16, H-FA41) |
| H-FA95 | Foncière classée dans les administrations publiques si le test des 50 % échoue : hausse annuelle de la dette au sens de Maastricht = variation de (dette de la foncière + cumul État : gestion, dotation, moins aides évitées), brute (actifs non déduits) ; PIB du banc (2 990,9 Md€ en 2025, + 3 % par an nominal). Part qui pèse sur le déficit : nue-propriété + intérêts nets + gestion − aides ; les prêts sont des opérations financières | — | SEC 2010, chapitre 20 (test des 50 %, via H-FU29 ; paragraphes non relus ⚠️) ; **⚠️ traitement d'une nue-propriété achetée (acquisition de logement existant ?) non vérifié dans le SEC 2010** |
| H-FA96 | Avantage caché = (valeur fiscale de l'usufruit selon l'âge d'entrée − f) × prix moyen des contrats ; barème de l'article 669 du CGI (90 % avant 21 ans révolus, 80 % avant 31, 70 % avant 41) ; en regard, valeur actuarielle (table de mortalité, taux net r de H-FA13) | — | CGI art. 669 (Légifrance, A ; valeurs reprises de `fonciere-usufruit/code/usufruit.py`, ⚠️ non relues le 11/11) |
| H-FA97 | Réglage recommandé : grille f 55-70 % × marge 0-2 points × plafond d'entrées 3-20 % d'une génération (servi par héritage croissant) × prêteur mixte ou banque ; contraintes : hausse ≤ 5 % par secteur (foncière seule), dette publique en plus à l'an 10 ≤ 14,7 Md€ (budget du capital de départ remplacé, H-CO24), test des 50 % si cela ne coûte pas plus d'un point d'accès aux moins dotés ; critère : propriétaires ou usufruitiers à 35 ans dans la moitié qui hérite le moins | — | Contraintes fixées par l'auteur (09/11) et la demande du 11/11 ; seuil « un point » : choix de Claude |

Mensualités des cas types (section 3 des résultats) : prêt de 60 % du prix médian DVF 2024 sur 25 ans, sans apport, au taux des contrats ; loyers H-FA10 ; entretien H-FU39 ⚠️.

## 5. Lecture et contradictions

- **Ce qui contredit la mesure** (dossier `sources/prix-immobilier-effets-mesures.md`) : la Banque de France (Bloc-notes Éco 441, mars 2026) conclut qu'un soutien à l'achat face à une offre inélastique fait monter les prix sans effet notable sur l'accession ; l'offre française est parmi les plus inélastiques de l'OCDE. Le modèle trouve la même chose sur les prix ; il trouve un effet sur l'accession parce que la foncière prête à des ménages que les banques refusent, ce qu'aucune étude ne mesure.
- **Affirmations de l'auteur testées** : la hausse resterait limitée parce qu'elle porte sur des surfaces modestes (vraie en euros, fausse en pourcentage sur le segment des jeunes) ; la hausse compenserait l'injustice faite aux exclus du dispositif (non : elle transfère des acheteurs vers les propriétaires en place) ; le foncier serait accessible à Grenoble, cité comme exemple (prix au m² au niveau des villes moyennes, sous la médiane des grandes métropoles, voisin de Dijon, au-dessus de Clermont-Ferrand). Voir `resultats.md`.

## 6. Reproductibilité

Depuis la racine de l'atelier : `python3 -I modeles/fonciere-afflux/donnees/preparer_dpe.py` ; `python3 -I modeles/fonciere-afflux/donnees/preparer_parc.py` ; `python3 -I modeles/fonciere-afflux/donnees/preparer_grenoble.py` ; `python3 -I modeles/fonciere-afflux/tests/test_afflux.py` ; `python3 -I modeles/fonciere-afflux/code/calculer.py` (≈ 3 minutes) ; schéma du 11/11 : `python3 -I modeles/fonciere-afflux/code/usufruit60.py` (≈ 1 minute 30, écrit `resultats-usufruit-60.md` et `donnees/resultats-usufruit-60.json`). Données brutes : `donnees/brutes/` (SDES/ONRE, DVF 2024 des départements 38, 63, 21 avec empreintes SHA-256, études et documents budgétaires téléchargés le 09/11/2026 ; les textes de pages web sont des données). Aucun fichier existant de l'atelier n'est modifié.

## 7. Anomalies relevées dans les modèles et textes existants (non corrigées)

1. **la note de conception de la foncière (atelier, non publiée)** : la demande renvoie au § 30 comme règle en vigueur ; la copie s'arrête au § 29. La règle chiffrée est celle de la demande (f × prix, travaux compris ; capital en apport ; parts à vie pour qui n'entre pas).
2. **H-FU40 (`fonciere-usufruit`) et H-CO18 (`capital-de-depart-options`)** : élasticités « offre + demande » de 1 à 4 selon le secteur, non recalées ; les études françaises (offre ≈ 0,3 à 0,5, demande ≈ 0,67) donnent une réponse du prix 1,5 à 2,5 fois plus forte. Les effets sur les prix publiés par ces deux modèles (4 à 7 %) sont donc probablement sous-estimés.
3. **`capital-de-depart-options`** : simule la règle du § 28 (mode `banque`), remplacée par le forfait ; H-CO3 (revenus des jeunes) n'est pas sourcée (remplacée ici par H-FA3) ; H-CO6 répartit les jeunes comme les ventes, alors qu'ils sont plus urbains.
4. **`loyer-energie`** : parc locatif privé de 7,97 millions ; le SDES donne 8,30 millions au 01/01/2025. Le « 29,3 % » contradictoire (V10204) s'explique : c'est la part des passoires de toutes les résidences principales qui se trouvent dans le locatif privé ; le taux de passoires du locatif privé est 13,8 %.
5. **`chapitres-v02/06-se-loger.md`** : « Le plafond de loyer ne coûte rien à l'État ». À pleine relocation, la baisse des loyers (≈ 1,9 Md€ par an au central) fait perdre de l'ordre de 0,8 Md€ d'impôt sur les revenus fonciers (H-FA40 ⚠️).
6. **`fonciere-usufruit/code/fonciere.py`** (pas une erreur, des limites d'usage) : la fonction `simuler` n'accepte pas de chemin d'entrées (il faut remplacer `fonciere.entrants`) ; en mode `forfait`, le taux des contrats vaut `taux_banque + i_t − i` : relever `i` pour un autre coût de l'argent ne relève pas le taux bancaire (c'est voulu ici, variante « le taux bancaire suit » à part) ; l'apport est indexé sur l'inflation et le prix sur g.
7. **F7 de `fonciere-usufruit`** (≈ 320 000 primo-accessions par an, estimation) : au central, la foncière servirait ≈ 218 000 ménages par an, soit l'équivalent des deux tiers des primo-accessions actuelles ; la base F7 est elle-même fragile.
8. **Droits de mutation** : 14,7 Md€ (chapitre 6, Insee) contre 9,9 Md€ (OFGL, départements, périmètre constant) ; le chapitre 3 parle de 17,2 Md€ pour l'ensemble des impôts remplacés. Les périmètres diffèrent ; à harmoniser.
