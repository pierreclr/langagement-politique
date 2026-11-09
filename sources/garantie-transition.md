---
titre: Garantie de transition et arrêts maladie — règles actuelles, courbe, calibration à coût égal, comportement, cas types
date: 2026-11-07
statut: brouillon chiffré, NON ADOPTÉ (arbitrage 56, proposition de l'auteur du 07/11/2026, et précisions du même jour) ; vérifications V19800 à V19849
code: modeles/systeme-ideal/garantie_transition.js (tests test_garantie_transition.js, 69 contrôles ; rapport rapport_garantie_transition.js → resultats_garantie_transition.txt) ; couche GT0711 de sources/calculs/bilan_global.py
---

# Garantie de transition et arrêts maladie

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 07/11/2026. Conflit d'intérêts : aucun lien connu avec les organismes cités ; Claude a un biais d'entraînement vers des positions « raisonnables » qui peut le pousser à freiner une proposition coûteuse : le lecteur jugera. Montants en euros de 2026, par mois sauf mention. Des ordres de grandeur sous hypothèses, jamais des prédictions. Consultation de toutes les URL : 07/11/2026. Téléchargements : `$DONNEES/sources/transition/` (Unédic « Paramètres utiles » juillet 2026 et fiche ARE de juin 2025, Drees CNS 2025 fiche 25 et CPS 2025 fiche 6) et `$DONNEES/sources/chomage/`, `.../chomage-recherche/` (déjà au dépôt).

**Légende** : **[Fait]** (source lue, cote A-D) · **[Relayé]** (vu dans un texte lu, source d'origine non ouverte, ⚠️) · **[Estimation]** (calcul de Claude, reproductible par le module) · **[Opinion]**.

## 0. L'essentiel

**Mise à jour du 07/11/2026, soir (§ 12) : variante « coût constant ».** L'auteur fixe la contrainte : pas plus cher qu'aujourd'hui (chômage 37,1 + IJ maladie 12,1 = 49,2 Md€). Avec une courbe de 12 mois, des droits proportionnels au travail (un mois pour deux mois travaillés), les différés et le délai d'attente actuels, le pont des 50 ans et plus et la règle des arrêts maladie (jour 1 : 0 ; jours 2-3 : 10 et 20 % sur déclaration ; 60 % dès le 4e jour avec un médecin ; 64 % au 8e), le total versé est de **28,7 Md€ (−20,5 par rapport à aujourd'hui, +4,0 par rapport à la base)** avec une courbe en droite ; la contrainte est tenue quelle que soit la forme (41,4 Md€ au plus). La règle des arrêts maladie coûte autant que les IJ actuelles (+0,07 Md€ net des consultations évitées) : les jours 2-3 payés compensent la baisse des jours 4 à 7. Les sections 1 à 11 ci-dessous gardent les variantes précédentes (coût égal à l'assurance chômage, 18 et 24 mois).


1. **Aujourd'hui** [Fait] : l'assurance chômage verse **37,1 Md€** d'allocations et d'aides en 2024 (37,2 en 2025) à **2,62 millions** d'indemnisés en moyenne ; l'allocation nette moyenne est de **1 048 €** par mois. L'ARE vaut 57 % du salaire brut au-dessus de 2 415 € (72 à 75 % du net), au plus 18 mois sous 55 ans, avec une baisse de 30 % au 7e mois au-dessus de 4 857 € brut. Les démissionnaires n'y ont droit que dans des cas étroits, les indépendants presque jamais (ATI : 789 € pendant 6 mois, après une liquidation).
2. **La courbe** : au jour où le revenu s'arrête, la personne garde 100 % de son revenu net de référence, puis le montant baisse **un peu chaque jour** jusqu'au plancher de 877 €. Une seule formule, G(t) = 877 + (Ref − 877) × g(t/T), où la forme g ne dépend que d'un paramètre λ (λ = 0 : baisse régulière ; λ < 0 : baisse lente au début, plus rapide à la fin ; λ > 0 : l'inverse).
3. **À coût égal à l'assurance chômage actuelle (37,1 Md€ au-dessus du plancher, démissionnaires et indépendants compris)** [Estimation] :
   - **A** : départ à 100 %, plancher atteint en **24 mois**, λ = −1,12 ;
   - **B** : départ à 100 %, plancher en **18 mois**, λ = −3,82 (la baisse est lente pendant un an puis s'accélère : on s'approche d'un palier) ;
   - **C** : départ à **90 %**, plancher en 24 mois, λ = −4,22 ;
   - un départ à **80 %** ne peut pas dépenser 37,1 Md€ sans palier : même la courbe la plus lente coûte 32,4 Md€ (24 mois) ou 27,0 Md€ (18 mois).
4. **Le point dur** : le plancher de 877 € est déjà versé à tous dans le nouveau système, si bien que la garantie n'a à financer que l'écart entre le revenu et le plancher. Dépenser autant qu'aujourd'hui donne donc une garantie **beaucoup plus généreuse** que l'ARE : un salarié médian touche 2 344 € le premier mois et 1 850 € le douzième, contre 1 545 € avec l'ARE ; au Smic, 1 761 € puis 1 464 €, contre 1 084 €. Mais la base de travail ne comptait que **12,56 Md€** pour le complément dégressif : « coût égal à l'assurance chômage » coûte donc **24,5 Md€ de plus que la base**, et le non-emploi qui s'allonge en coûte encore **7,8** (fourchette 2,2 à 19,4).
5. **À coût égal au modèle actuel (12,56 Md€)**, la même famille donne une courbe qui part de 100 % et descend vite (λ = +4,19 sur 18 mois) : un salarié médian passe de 2 198 € le premier mois à 1 274 € le sixième, puis 958 € le douzième. C'est moins que l'ARE dès le 4e mois.
6. **Ouverture** [Estimation] : démissionnaires +4,0 Md€ (2,3 à 7,6), indépendants +1,3 Md€ (0,6 à 2,6), avec la courbe A. Ce sont les deux postes les plus incertains (aucune expérience française d'ouverture générale).
7. **Comportement retenu** [Estimation] : élasticité de la durée au niveau 0,30 (0,15 à 0,70), à la durée potentielle 0,27, des entrées 0,10, éviction 25 %, effets bornés à ±30 % ; avec la courbe A, la durée moyenne s'allonge de 18 % (9 à 33 %).
8. **Arrêts maladie** [Estimation] : auto-déclaration des arrêts courts, fin de la carence et de la subrogation, reprise par le système des compléments versés aujourd'hui par les employeurs et la prévoyance : **+7,8 Md€ par an de dépense publique nette** (4,7 à 11,5), dont 3,0 sans la reprise des compléments.
9. **Pont vers la retraite** (décision de l'auteur : pas de retraite anticipée, une garantie modulée par l'âge pour toute perte d'activité) : à partir de 50 ans, la courbe descend vers un niveau L(a) = 877 + w(a) × (pension estimée − 877), tenu jusqu'au taux plein, avec w(a) = ((a − 50)/(62 − 50))^1,47 : nul à 50 ans (garantie standard), proche de la pension à l'approche du taux plein. Surcoût calibré à **1 Md€** par an (+0,3 de non-emploi allongé), ≈ 470 000 entrants de 50 ans et plus par an, ≈ 280 000 choisissant le pont (§ 8).
10. **Couche du bilan GT0711** (non adoptée, arrêts maladie et pont compris) : **−41,4 Md€** sur le solde de croisière au central (−29,0 à −63,3), qui passerait de −100,7 à −142,1 Md€. **Recommandation de Claude** [Opinion] : garder la forme et les règles (courbe continue, moyenne glissante, horloge, ouverture), mais fixer le budget entre les deux lectures, vers **25 Md€** au-dessus du plancher (12,4 de plus que la base, 12,1 de moins que l'assurance chômage), sur **18 mois** et presque en droite (λ = +0,17) : un salarié médian touche 2 316 € le premier mois, 1 880 € le sixième, 1 384 € le douzième (au-dessus de l'ARE pendant les dix premiers mois, en dessous ensuite) ; au Smic, 1 482 € puis 1 182 € (au-dessus de l'ARE jusqu'au 14e mois) ; l'allongement du non-emploi ne coûte alors que 2,7 Md€. Détail au § 7.

## 1. Les règles actuelles

### 1.1 Montant, durée, conditions [Fait, cote A sauf mention]

| Règle | Valeur en vigueur (novembre 2026) | Source |
|---|---|---|
| Allocation journalière brute (ARE) | le plus favorable de **40,4 % du SJR + 13,18 €** et **57 % du SJR**, au moins **32,13 €**, au plus **75 % du SJR** ; maximum 300,21 €/jour (2026) | Unédic, *Paramètres utiles*, juillet 2026, p. 5 et 23 ; montants du 01/07/2025, **non revalorisés au 01/07/2026** (CA du 30/06/2026) |
| Salaire journalier de référence (SJR) | salaires des 24 derniers mois (36 à 55 ans et plus) divisés par les jours calendaires depuis le premier jour d'emploi de la période, jours non travaillés pris en compte limités à 70 % des jours travaillés (formule de 2021) ; assiette plafonnée à 4 plafonds de la Sécurité sociale (16 020 €/mois en 2026) | idem, p. 3 et 5 |
| Taux de remplacement selon le brut | 75 % sous 1 303 € ; minimum 32,13 € de 1 303 à 1 427 € ; 40,4 % + 13,18 € de 1 427 à 2 415 € ; 57 % au-delà | idem, p. 23 |
| Prélèvements sur l'allocation | retraite complémentaire 3 % du SJR (sans descendre sous 32,13 €) ; CSG 6,2 % et CRDS 0,5 % sur 98,25 %, sauf si l'allocation est sous 61 € par jour ; imposable à l'impôt sur le revenu | idem, p. 22 |
| Dégressivité (réforme de 2021, seuil d'âge de 2025) | coefficient **0,7 au 7e mois** si l'allocation journalière dépasse 92,57 € (brut antérieur ≈ 4 857 €/mois) et si l'allocataire a **moins de 55 ans**, sans descendre sous 92,57 € | idem, p. 5 ; [service-public.gouv.fr F14860](https://www.service-public.gouv.fr/particuliers/vosdroits/F14860), vérifié le 23/07/2026 |
| Durée | jours calendaires de la période de référence × **0,75** (coefficient de « contracyclicité » de 2023) ; minimum 182 jours ; maximum **548 jours (18 mois) sous 55 ans, 685 (22,5 mois) à 55-56 ans, 822 (27 mois) à 57 ans et plus** ; complément de fin de droits si le chômage dépasse 9 % ou monte de 0,8 point en un trimestre | idem, p. 6-7 (convention du 15/11/2024 ⚠️ V19802) |
| Rupture conventionnelle (avenant du 25/02/2026, depuis le 01/09/2026) | durée maximale ramenée à **15 mois** sous 55 ans et 20,5 mois au-delà, prolongeable pour les seniors | Unédic, prévisions d'octobre 2026, encadré 1 ⚠️ V19801 |
| Affiliation | **130 jours ou 910 heures** travaillés sur 24 mois (36 mois à 55 ans et plus) ; **108 jours ou 758 heures** pour les primo-entrants et les saisonniers ; perte involontaire d'emploi | idem, p. 6 et 25 |
| Démission | droit ouvert si la démission est **légitime** (liste du règlement : suivi de conjoint, non-paiement des salaires, violences, etc.) ou, depuis le 01/11/2019, pour un **projet de reconversion** « réel et sérieux » : 1 300 jours travaillés sur 60 mois, conseil en évolution professionnelle préalable, attestation de la commission Transitions Pro ; sinon réexamen possible après 121 jours | idem, p. 9, 25-26 ⚠️ V19804 |
| Licenciement économique | contrat de sécurisation professionnelle (CSP), entreprises de moins de 1 000 salariés : **ASP = 75 % du SJR** pendant 12 mois, sans dégressivité, prime de reclassement ; l'employeur verse 3 mois de préavis | idem, p. 4 et 13-14 ; `sources/economies-cachees-et-transition.md` § 3.3 |
| Indépendants | ATI : **26,30 €/jour (≈ 789 €/mois), 182 jours**, après liquidation ou cessation non viable attestée, 2 ans d'activité, 10 000 € de revenu sur une des deux années, ressources ≤ 607,75 €/mois, une fois tous les 5 ans | idem, p. 10 |
| Cumul avec une activité | allocation du mois − 70 % du salaire brut repris ; jours non versés reportés | idem, p. 11 |

### 1.2 Coût et effectifs [Fait]

| Indicateur | Valeur | Source (cote) |
|---|---|---|
| Allocations brutes et aides | **37,1 Md€ (2024)**, 37,2 (2025), 38,1 prévus (2026) | Unédic, *Situation financière à horizon 2028*, 21/10/2026, tableau 4 (A) |
| dont, en 2025 : ARE ; autres allocations (ASP, AREF, ATI…) ; aides au reclassement | ≈ 32,1 ; 3,5 ; 1,3 Md€ | Unédic, *Paramètres utiles*, p. 31 (extraction cassée ⚠️ V19803) |
| Hors champ de la comparaison : retraite complémentaire des allocataires ; contribution à France Travail | 2,4 et 5,0 Md€ (2025) | idem, tableau 4 |
| Allocataires indemnisés (ARE, AREF, ASP, ATI) | **2 624 000** en moyenne 2025 ; 2 628 286 à fin mars 2026 | idem, tableau 3 ; *Paramètres utiles*, p. 29 |
| Motifs | licenciement 29 % ; fin de CDD 30 % ; intérim 10 % ; intermittents 5 % ; **rupture conventionnelle ou démission 25 %** | *Paramètres utiles*, p. 29 |
| Allocation nette moyenne reçue | **1 048 €/mois** (3e trimestre 2025) ; 866 € pour ceux qui cumulent avec un salaire (24 % des allocataires) | [Unédic, indicateurs, mars 2026](https://www.unedic.org/publications/les-indicateurs-de-l-assurance-chomage-mars-2026) (A) |
| Ouvertures de droit | 549 000 au 3e trimestre 2025 | idem |
| Durées | 11 mois indemnisés en moyenne (droits interrompus en 2023), 60 % des droits consommés ; durée potentielle moyenne 16 mois pour les droits ouverts en 2024 (−20 %), deux tiers consommés après la réforme | Unédic, juin et décembre 2025, via `sources/recherche-chomage-durees-elasticites.md` § 1 (A) |
| Avenant « ruptures conventionnelles » | −730 à −900 M€ par an en régime de croisière ; −35 000 indemnisés | Unédic, octobre 2026, tableau A ⚠️ V19801 |

### 1.3 Calibrage du module sur ces faits [Estimation]

Le module reproduit l'assurance chômage par une population d'entrants : aléa de sortie constant **h = 0,059 par mois** (pour que 64 % des droits soient consommés, entre les 60 % de 2023 et les deux tiers d'après la réforme), durées potentielles de 6 à 27 mois (moyenne 15,9 mois ⚠️ V19807), **258 000 entrants par mois** pour un stock de 2,62 M, salaire brut de référence lognormal (σ = 0,5) de **médiane 1 819 €** (calée pour que l'ARE simulée fasse exactement 37,1 Md€ ; elle comprend les temps partiels et les contrats courts ⚠️ V19808), 95 % de l'allocation pleine versée en moyenne (cumuls). L'écart entre 3,1 M d'entrées par an et 2,2 M d'ouvertures de droit n'est pas réconcilié (rechargements, CSP ⚠️ V19809). Contrôle : le complément dégressif de la base, recalculé dans cette population, coûte 14,7 Md€, contre 12,56 dans le bilan (même ordre de grandeur ; l'écart tient au socle et au revenu moyen retenus en v5.1).

## 2. La courbe

### 2.1 Forme [Proposition]

Précision de l'auteur (07/11) : 100 %, c'est le revenu tant qu'on l'a encore ; dès le lendemain de l'arrêt, le montant baisse d'une petite fraction chaque jour jusqu'au plancher. Le module travaille donc en temps continu (jour par jour) ; le montant d'un mois est la moyenne de ses jours.

G(t) = P + (p0 × Ref − P) × g(t/T), avec P = 877 €, T la durée (18 ou 24 mois), p0 le départ (1 ; 0,9 et 0,8 en variantes, qui supposent une marche le premier jour), et

g(x) = (e^(−λx) − e^(−λ)) / (1 − e^(−λ)) pour 0 ≤ x ≤ 1, g = 0 au-delà ; λ → 0 donne la droite g(x) = 1 − x.

Pourquoi cette famille plutôt qu'une exponentielle simple ou une logistique : elle part exactement de 100 % et arrive exactement au plancher en T (une exponentielle pure ne l'atteint jamais), elle n'a qu'un paramètre à calibrer, et elle couvre les deux cas, baisse rapide puis lente (λ > 0, proche d'une exponentielle) ou lente puis rapide (λ < 0, proche d'une logistique), sans jamais faire de marche. Avec λ très négatif, elle se rapproche d'un palier : la variante B (λ = −3,8) en est à la limite.

### 2.2 Coût selon la forme [Estimation, population actuelle, comportement central]

Supplément versé au-dessus du plancher, Md€/an ; entre parenthèses, sans réaction de comportement ; puis effet du non-emploi plus long sur les recettes et le plancher.

| Départ | Durée | λ = −10 | λ = −3 | λ = 0 (droite) | λ = +3 | λ = +10 |
|---|---|---|---|---|---|---|
| 100 % | 18 mois | 36,4 (34,1 ; −5,0) | 30,3 (28,9 ; −4,3) | 22,0 (21,5 ; −2,5) | 13,1 (13,2 ; +0,1) | 5,2 (5,4 ; +3,2) |
| 100 % | 24 mois | 44,4 (39,8 ; −7,9) | 37,5 (34,2 ; −7,4) | 27,6 (25,9 ; −5,9) | 16,8 (16,4 ; −3,5) | 6,8 (7,0 ; −0,1) |
| 90 % | 18 mois | 29,1 (27,9 ; −3,4) | 24,3 (23,6 ; −2,7) | 17,7 (17,5 ; −1,1) | 10,6 (10,8 ; +1,1) | 4,2 (4,4 ; +3,7) |
| 90 % | 24 mois | 35,4 (32,5 ; −6,1) | 30,0 (27,9 ; −5,7) | 22,1 (21,2 ; −4,4) | 13,5 (13,4 ; −2,4) | 5,5 (5,7 ; +0,5) |
| 80 % | 18 mois | 22,0 (21,6 ; −1,5) | 18,4 (18,2 ; −0,9) | 13,4 (13,6 ; +0,3) | 8,1 (8,4 ; +2,1) | 3,3 (3,4 ; +4,2) |
| 80 % | 24 mois | 26,7 (25,2 ; −4,2) | 22,6 (21,6 ; −3,9) | 16,8 (16,4 ; −2,8) | 10,3 (10,4 ; −1,2) | 4,3 (4,4 ; +1,2) |

Lecture : une courbe régulière de 100 % au plancher en 24 mois coûte 27,6 Md€ au-dessus du plancher, soit 9,5 de moins que l'assurance chômage actuelle et 15 de plus que la base.

### 2.3 Calibration à coût égal [Estimation]

λ est cherché par dichotomie pour que le supplément versé, réaction de comportement comprise, égale le budget. Deux budgets, parce que « coût égal » a deux sens :

- **coût égal à l'assurance chômage** (37,1 Md€, la lecture littérale de la consigne) ;
- **coût égal au modèle** (12,56 Md€, ce que la base de travail compte déjà en ligne D02).

| Budget | Départ | Durée | Population actuelle : λ | Ouverture comprise : λ | Effet du non-emploi plus long (ouverture comprise, Md€) |
|---|---|---|---|---|---|
| 37,1 | 100 % | 18 mois | −13,34 (palier de fait) | **−3,82 (B)** | −5,29 |
| 37,1 | 100 % | 24 mois | −2,82 | **−1,12 (A)** | −7,76 |
| 37,1 | 90 % | 18 mois | hors de portée (30,6 au plus) | hors de portée (35,6 au plus) | |
| 37,1 | 90 % | 24 mois | hors de portée (37,0 au plus) | **−4,22 (C)** | −6,94 |
| 37,1 | 80 % | 18 / 24 mois | hors de portée (23,1 / 27,9) | hors de portée (27,0 / 32,4) | |
| 12,56 | 100 % | 18 mois | +3,26 | **+4,19 (M)** | +1,08 |
| 12,56 | 100 % | 24 mois | +4,79 | +5,90 | −1,94 |
| 12,56 | 90 % | 18 mois | +2,05 | +2,95 | +1,20 |
| 12,56 | 90 % | 24 mois | +3,45 | +4,44 | −1,77 |
| 12,56 | 80 % | 18 mois | +0,45 | +1,42 | +1,39 |
| 12,56 | 80 % | 24 mois | +1,85 | +2,80 | −1,50 |

Les trois courbes retenues à coût égal à l'assurance chômage (A, B, C) et leur sœur à coût égal au modèle (M) sont détaillées aux § 5 et 6. Une durée de 24 mois coûte en recettes même quand la courbe est sobre : la durée potentielle allonge le non-emploi (élasticité 0,27), indépendamment du niveau.

### 2.4 La moyenne glissante [Proposition, HGT11]

Ref = Σ w_j × y_j / Σ w_j sur les **24 derniers mois hors mois passés en garantie**, y_j le revenu net d'activité du mois (nouveau système, filet compris), poids **linéaires** w_j = 25 − j (le dernier mois pèse 24, le plus ancien 1 : la moitié du poids porte sur les 7 derniers mois). Un mois sans activité ni garantie compte pour zéro ; s'il manque des mois (début de carrière), ils comptent pour zéro. Conséquences :

- aucune condition de durée « localisée » : deux mois de travail donnent une référence faible (≈ 15 % du salaire), un an en donne ≈ 75 %, deux ans 100 % ; les droits montent en continu au lieu de s'ouvrir d'un coup à 130 jours ;
- les mois en garantie sont neutralisés : une deuxième perte rapprochée ne fait pas s'effondrer la référence ;
- choix écartés : moyenne simple (trop sensible au dernier contrat… ou pas assez), décroissance exponentielle (plus élégante, mais un mois isolé très payé pèserait trop).

### 2.5 L'horloge, le cumul et l'intérim [Proposition, HGT12-HGT13]

- Chaque mois en garantie avance l'horloge d'un mois sur la courbe.
- En activité pendant un épisode, la courbe est figée : la personne garde son revenu net et le supplément de la courbe, diminué de **50 centimes par euro net gagné au-dessus du plancher**. Travailler rapporte donc toujours plus que rester sans activité (règle actuelle : 70 centimes par euro brut).
- Chaque mois d'activité fait reculer l'horloge de ρ = 0,5 mois au plus, en proportion du revenu repris rapporté à la référence (un intérim payé comme l'ancien emploi rend un demi-mois de courbe par mois travaillé).
- Au retour sans activité, la référence devient le maximum de l'ancienne et de la nouvelle moyenne : **les petits boulots peuvent faire remonter les droits, jamais les baisser** (sinon accepter un intérim moins payé serait pénalisé à vie). L'épisode se ferme quand l'horloge revient à zéro.
- Ces règles ne sont pas évaluées empiriquement et ne sont pas reprises une à une dans le coût agrégé (qui garde la part versée de l'ARE, 95 %) ⚠️ V19811.

### 2.6 Ouverture aux démissionnaires et aux indépendants [Estimation, très incertaine]

| Groupe | Hypothèse | Supplément (courbe A) | Supplément (courbe M) |
|---|---|---|---|
| Démissionnaires sans autre emploi au terme du préavis | ≈ 1,9 M de démissions de CDI par an (Dares, 481 200 au 3e trimestre 2024, [Relayé] ⚠️ V19815) ; 30 % sans emploi au terme du préavis, 70 % de recours : **33 000 entrants par mois** (20 000 à 60 000, la borne haute comprend des démissions induites ⚠️ V19816) ; sortie plus rapide (h = 0,08) ; référence 10 % au-dessus des licenciés | **4,0 Md€** (2,3 à 7,6) | 1,4 (0,9 à 2,6) |
| Indépendants qui cessent leur activité | 3,26 M de non-salariés (Insee 2024, via l'Unédic) ; **100 000 cessations par an** avec revenu (50 000 à 200 000), revenu médian 2 500 €/mois ⚠️ V19817 ; contrôle du revenu par la facture électronique ⚠️ V19818 | **1,3 Md€** (0,6 à 2,6) | 0,4 (0,2 à 0,9) |

Le préavis bilatéral de 3 mois joue dans les deux sens : il donne au salarié trois mois pour chercher en étant payé (la littérature suédoise sur le préavis montre moins de chômage à la sortie, ⚠️ V19824, non chiffré ici, donc prudent) et il protège l'employeur d'un départ du jour au lendemain. Pour les contrats courts, il a un coût pour l'employeur, non chiffré.

## 3. Comportement : état de la recherche et réaction retenue

### 3.1 Ce que les études établissent

**Durée du chômage et niveau de l'allocation.** En France, les élasticités mesurées se recoupent autour de **0,25-0,3** : Le Barbanchon, Rathelot et Roulet (*Journal of Public Economics*, 2019 ; NBER w23406) trouvent 0,22 à 0,33 pour la durée indemnisée, et un salaire de réserve insensible à la durée des droits ; le comité d'évaluation de la réforme 2019-2021 (Dares, avril 2025) mesure 0,25 pour la dégressivité des hauts salaires (−30 % au 7e mois : −2 mois d'indemnisation, sans effet sur le CDI ni le salaire retrouvé) et 0,14 à 0,5 pour la réforme du SJR (0,4 à 0,7 si on l'impute au seul montant). Le CAE (note n° 90, avril 2026) retient **0,3** pour le montant et **0,27** pour la durée potentielle, plus 0,1 sur les entrées. Ailleurs, la médiane des études est de 0,37 pour la durée potentielle et 0,53 pour le montant (Schmieder et von Wachter, *Annual Review of Economics*, 2016). [Fait, lus : `sources/recherche-chomage-durees-elasticites.md` § 2 ; cotes A]

**Durée des droits.** Allonger les droits allonge le chômage d'environ un dixième à un cinquième de l'allongement (Schmieder et von Wachter : +0,13 mois par mois de droits) ; au Danemark, le passage de 4 à 2 ans en 2010 a accéléré les sorties vers l'emploi à l'approche de la fin des droits (Hermansen, 2015 : 3 à 5 semaines de chômage en moins par personne) sans relever l'emploi dans tous les groupes, une partie des personnes passant vers les études ou sans revenu (VIVE, 2014) [Relayé, résumés lus ⚠️ V19822]. Les sorties se concentrent à l'épuisement des droits (« pic de fin de droits ») : une courbe sans marche l'atténue, ce qui est un argument pour la forme continue, mais aucune étude ne mesure une courbe journalière.

**Qualité de l'emploi retrouvé.** Les résultats divergent. En Allemagne, des droits plus longs abaissent le salaire de reprise, parce que le non-emploi plus long déprécie le capital humain (Schmieder, von Wachter et Bender, *AER* 2016 : −0,8 % par mois de non-emploi dans la version de travail ⚠️ V19821) ; en Autriche, neuf semaines de droits en plus relèvent le salaire de reprise de 0,5 %, par de meilleures entreprises (Nekoei et Weber, *AER* 2017) ; en France, ni Le Barbanchon (2016) ni la dégressivité ne trouvent d'effet sur le salaire, et la réforme du SJR n'a accéléré que la reprise de contrats de moins de 6 mois. Nekoei et Weber réconcilient ces écarts : l'effet sur le salaire est d'autant plus négatif que l'effet sur la durée est fort.

**Liquidité.** Une large part (60 % selon Chetty, *JPE* 2008, méthode discutée) de l'allongement du chômage dû à l'allocation vient de ce qu'on a de quoi vivre pour chercher, pas d'une moindre recherche : c'est un gain de bien-être, pas seulement un coût. Card, Chetty et Weber (2007, Autriche) trouvent un effet de liquidité net des indemnités de licenciement ⚠️ V19823.

**Externalités.** Quand des chômeurs indemnisés plus longtemps cherchent moins, les autres trouvent plus vite (Lalive, Landais et Zweimüller, *AER* 2015) ; l'effet global est plus faible que l'effet individuel ; l'accompagnement renforcé français déplace en partie l'emploi vers ses bénéficiaires (Crépon et al., *QJE* 2013 ⚠️).

**Ce qui est débattu** : l'élasticité à la durée potentielle (0,1 à 1 selon le pays et la conjoncture) ; l'effet sur les salaires ; la part de la liquidité. **Ce qui manque** : aucune étude d'une indemnisation **continûment décroissante** combinée à un revenu plancher inconditionnel ; aucune mesure française d'une hausse de générosité de plus de 30 % ; aucune étude d'une ouverture générale aux démissionnaires (les démissionnaires « avec projet » de 2019 sont trop peu nombreux pour servir de référence).

### 3.2 La réaction intégrée au calibrage [Estimation, HGT18-HGT22]

1. Générosité : taux de remplacement moyen des 12 premiers mois, pondéré par la survie (garantie / revenu net de référence ; ARE nette / net actuel), rapporté à celui de l'ARE : **r = 1,18** pour la courbe A (93 % contre 78 %).
2. Durée : facteur q = r^εD × (T / 15,9)^εPD, borné à [0,7 ; 1/0,7] (pas d'extrapolation au-delà de la plus forte variation observée en France) ; εD = 0,15 / **0,30** / 0,70 ; εPD = 0,15 / **0,27** / 0,40. Courbe A : **q = 1,09 / 1,18 / 1,33**.
3. Entrées × r^εE, εE = 0 / **0,10** / 0,10.
4. Le stock supplémentaire coûte, par mois, le plancher versé plus la contribution nette perdue R − N(R), net d'une éviction de 50 / **25** / 0 % ⚠️ V19820, sur 36 mois.

Avec la courbe A, la réaction ajoute 1,9 Md€ au supplément versé (déjà dans les 37,1) et coûte **7,8 Md€** (2,2 à 19,4) de plancher versé et de contributions perdues. Avec la courbe M, sobre, la réaction rapporte 1,1 Md€. Le comportement n'est donc pas un détail : la borne haute de la courbe A coûte autant que la moitié du trou de la base.

## 4. Steelman

**La meilleure objection** : « Garantir 100 % du revenu au départ, ouvert aux démissionnaires, c'est payer les gens à quitter leur emploi ; la France a déjà l'assurance chômage la plus généreuse de l'OCDE pour les hauts salaires, et la base de travail est en déficit de 100 Md€. » Réponse : (1) l'objection porte sur le **niveau**, pas sur la **forme** : la courbe continue, la moyenne glissante et l'horloge peuvent être calibrées à n'importe quel budget, y compris celui de la base (courbe M) ; (2) le préavis de 3 mois imposé au salarié qui démissionne, la référence glissante (qui ne récompense pas un mois isolé très payé) et la baisse journalière rendent l'aller-retour emploi-garantie peu rentable : un démissionnaire perd chaque jour une fraction de son revenu ; (3) la fin de la rupture conventionnelle supprime un détournement documenté (indemnisation plus longue après une rupture « négociée », 25 % des allocataires, cf. l'avenant de 2026) ; (4) mais l'objection garde sa force sur le coût : à coût égal à l'assurance chômage, la proposition aggrave le solde de 32 Md€ (24,5 de supplément au-delà de la base et 7,8 de comportement). **Je ne la crois pas finançable dans la base actuelle** [Opinion].

**Objection inverse (côté gauche)** : « La courbe M fait tomber un salarié au Smic à 1 116 € au 6e mois, sous l'ARE (1 084 €)… à peine au-dessus, et le médian sous l'ARE dès le 4e mois. » Réponse : oui ; c'est ce qu'achète la base de travail aujourd'hui (le complément 60/40/20 % fait de même) ; d'où la recommandation intermédiaire (§ 7).

**Contraintes juridiques** : l'assurance chômage relève aujourd'hui de la négociation des partenaires sociaux (articles L5422-20 et suivants du code du travail, agrément de la convention par l'État ⚠️ non relus) et la concertation préalable de l'article L1 s'applique ; la fin de la rupture conventionnelle et du licenciement économique touche aux articles L1237-11 et L1233-1 et suivants ; le préavis bilatéral est compatible avec la convention n° 158 de l'OIT (préavis raisonnable) ⚠️ ; le droit de l'Union coordonne les prestations de chômage des travailleurs mobiles (règlement (CE) n° 883/2004 : calcul sur les périodes accomplies dans un autre État) ⚠️ non relu ; la directive « plateformes » de 2024 et le statut unique (arbitrage 55) interagissent avec l'ouverture aux indépendants.

## 5. Cas types (€/mois, plancher compris)

Courbes : **A** (100 %, 24 mois, λ = −1,12) ; **B** (100 %, 18 mois, λ = −3,82) ; **C** (90 %, 24 mois, λ = −4,22) : coût égal à l'assurance chômage, ouverture comprise ; **M** (100 %, 18 mois, λ = +4,19) : coût égal au modèle. ARE actuelle nette de CSG, CRDS et retraite complémentaire, **avant impôt sur le revenu**, 30 jours par mois, droits pleins de 18 mois (moins de 55 ans) ; après la fin des droits, plancher de 877 € (ce que valent à peu près RSA et aide au logement, HGT5 ; l'ASS, 584 €, n'est pas comptée). Le revenu de référence est le revenu net **du nouveau système** (après la fonction des revenus et le filet) : il est plus élevé que le net actuel au Smic et au médian, plus bas pour le cadre, dont le net actuel est donné avant impôt. Indépendant : aujourd'hui rien, sauf l'ATI en cas de liquidation (789 € pendant 6 mois), puis le RSA.

**Salarié au Smic (1 867 € brut, temps plein)**

| Mois | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Garantie A | 1761 | 1740 | 1718 | 1695 | 1670 | 1645 | 1618 | 1590 | 1561 | 1530 | 1498 | 1464 | 1428 | 1391 | 1353 | 1312 | 1269 | 1224 | 1178 | 1128 | 1077 | 1023 | 967 | 908 | 33748 |
| Garantie B | 1769 | 1764 | 1758 | 1750 | 1740 | 1727 | 1712 | 1693 | 1670 | 1641 | 1605 | 1561 | 1507 | 1439 | 1356 | 1253 | 1125 | 968 | 877 | 877 | 877 | 877 | 877 | 877 | 33299 |
| Garantie C | 1594 | 1591 | 1589 | 1585 | 1582 | 1577 | 1572 | 1565 | 1557 | 1548 | 1537 | 1524 | 1509 | 1490 | 1468 | 1442 | 1410 | 1373 | 1328 | 1275 | 1211 | 1136 | 1045 | 937 | 34446 |
| Garantie M | 1674 | 1505 | 1372 | 1266 | 1182 | 1116 | 1064 | 1022 | 989 | 963 | 942 | 926 | 913 | 903 | 894 | 888 | 883 | 879 | 877 | 877 | 877 | 877 | 877 | 877 | 24642 |
| ARE actuelle | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 877 | 877 | 877 | 877 | 877 | 877 | 24776 |
| Complément du modèle | 1693 | 1693 | 1693 | 1421 | 1421 | 1421 | 1149 | 1149 | 1149 | 1149 | 1149 | 1149 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 26757 |

Référence nette 1772 € (R = 1991 €) ; net actuel avant impôt ≈ 1456 €

**Salarié médian (≈ 2 900 € brut, 2 238 € net en 2025)**

| Mois | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Garantie A | 2344 | 2309 | 2272 | 2233 | 2193 | 2151 | 2106 | 2060 | 2011 | 1960 | 1906 | 1850 | 1792 | 1730 | 1666 | 1598 | 1527 | 1453 | 1376 | 1294 | 1209 | 1119 | 1026 | 928 | 42113 |
| Garantie B | 2357 | 2348 | 2338 | 2324 | 2308 | 2287 | 2262 | 2231 | 2192 | 2144 | 2085 | 2012 | 1921 | 1809 | 1671 | 1500 | 1289 | 1027 | 877 | 877 | 877 | 877 | 877 | 877 | 41367 |
| Garantie C | 2123 | 2119 | 2115 | 2109 | 2102 | 2094 | 2085 | 2074 | 2060 | 2044 | 2025 | 2003 | 1976 | 1943 | 1905 | 1859 | 1804 | 1739 | 1662 | 1569 | 1458 | 1327 | 1169 | 982 | 44348 |
| Garantie M | 2198 | 1919 | 1698 | 1523 | 1384 | 1274 | 1187 | 1117 | 1063 | 1019 | 985 | 958 | 936 | 919 | 906 | 895 | 887 | 880 | 877 | 877 | 877 | 877 | 877 | 877 | 27009 |
| ARE actuelle | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 877 | 877 | 877 | 877 | 877 | 877 | 33064 |
| Complément du modèle | 2046 | 2046 | 2046 | 1656 | 1656 | 1656 | 1267 | 1267 | 1267 | 1267 | 1267 | 1267 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 29231 |

Référence nette 2361 € (R = 3792 €) ; net actuel avant impôt ≈ 2262 €

**Cadre à 4 000 € net (≈ 5 200 € brut)**

| Mois | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Garantie A | 3519 | 3456 | 3389 | 3320 | 3247 | 3171 | 3091 | 3007 | 2919 | 2828 | 2731 | 2630 | 2524 | 2414 | 2298 | 2176 | 2048 | 1915 | 1775 | 1628 | 1475 | 1314 | 1145 | 968 | 58988 |
| Garantie B | 3543 | 3527 | 3508 | 3483 | 3454 | 3417 | 3371 | 3315 | 3245 | 3159 | 3053 | 2921 | 2758 | 2556 | 2307 | 1999 | 1619 | 1148 | 877 | 877 | 877 | 877 | 877 | 877 | 57645 |
| Garantie C | 3191 | 3184 | 3176 | 3165 | 3153 | 3138 | 3121 | 3100 | 3075 | 3045 | 3010 | 2968 | 2918 | 2858 | 2786 | 2701 | 2600 | 2479 | 2334 | 2162 | 1957 | 1712 | 1420 | 1072 | 64326 |
| Garantie M | 3257 | 2754 | 2355 | 2040 | 1790 | 1591 | 1434 | 1310 | 1212 | 1134 | 1072 | 1023 | 984 | 953 | 929 | 910 | 894 | 882 | 877 | 877 | 877 | 877 | 877 | 877 | 31785 |
| ARE actuelle | 2577 | 2577 | 2577 | 2577 | 2577 | 2577 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 877 | 877 | 877 | 877 | 877 | 877 | 50010 |
| Complément du modèle | 2430 | 2430 | 2430 | 1912 | 1912 | 1912 | 1395 | 1395 | 1395 | 1395 | 1395 | 1395 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 31916 |

Référence nette 3550 € (R = 7052 €) ; net actuel avant impôt ≈ 4056 €

**Indépendant (R = 3 000 €/mois de revenu avant contribution)**

| Mois | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Garantie A | 2088 | 2059 | 2029 | 1997 | 1964 | 1929 | 1892 | 1854 | 1813 | 1771 | 1727 | 1681 | 1632 | 1581 | 1528 | 1472 | 1414 | 1353 | 1289 | 1221 | 1151 | 1077 | 1000 | 919 | 38441 |
| Garantie B | 2099 | 2092 | 2083 | 2072 | 2058 | 2041 | 2020 | 1995 | 1963 | 1923 | 1874 | 1814 | 1739 | 1647 | 1533 | 1392 | 1217 | 1001 | 877 | 877 | 877 | 877 | 877 | 877 | 37825 |
| Garantie C | 1891 | 1887 | 1884 | 1879 | 1874 | 1867 | 1860 | 1851 | 1840 | 1827 | 1811 | 1793 | 1771 | 1744 | 1713 | 1676 | 1631 | 1578 | 1515 | 1440 | 1350 | 1243 | 1115 | 963 | 40001 |
| Garantie M | 1968 | 1737 | 1555 | 1410 | 1295 | 1205 | 1133 | 1076 | 1030 | 995 | 966 | 944 | 926 | 912 | 901 | 892 | 885 | 879 | 877 | 877 | 877 | 877 | 877 | 877 | 25970 |
| ATI puis plancher | 789 | 789 | 789 | 789 | 789 | 789 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 20520 |
| Complément du modèle | 1891 | 1891 | 1891 | 1553 | 1553 | 1553 | 1215 | 1215 | 1215 | 1215 | 1215 | 1215 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 28145 |

Référence nette 2102 € (R = 3000 €)


**Lecture.** Avec les courbes à coût égal à l'assurance chômage, chacun touche plus qu'avec l'ARE pendant au moins 18 mois, de 30 à 60 % de plus selon les mois (salarié médian : 42 113 € sur deux ans avec A, contre 33 064 € avec l'ARE). Avec M, on touche plus que l'ARE les trois premiers mois au Smic et les deux premiers au médian, puis moins ; sur deux ans, le salarié au Smic touche presque autant (24 642 € contre 24 776 €), le médian 18 % de moins, le cadre 36 % de moins. L'indépendant gagne dans tous les cas : il n'a presque rien aujourd'hui.

### 5.1 Un intérim de deux mois en cours de route

Salarié médian, intérim aux mois 7 et 8 payé 2 000 € brut (1 842 € nets dans le nouveau système), courbe A :

| Mois | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Avec intérim | 2344 | 2309 | 2272 | 2233 | 2193 | 2151 | 2589 | 2603 | 2135 | 2090 | 2043 | 1993 | 1942 | 1887 | 1830 | 1771 | 1708 | 1642 | 1574 | 1502 | 1426 | 1347 | 1265 | 1178 |
| Sans intérim | 2344 | 2309 | 2272 | 2233 | 2193 | 2151 | 2106 | 2060 | 2011 | 1960 | 1906 | 1850 | 1792 | 1730 | 1666 | 1598 | 1527 | 1453 | 1376 | 1294 | 1209 | 1119 | 1026 | 928 |
| ARE avec intérim | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1778 | 1778 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1356 | 877 | 877 | 877 | 877 |
| Horloge (mois de courbe) | 1,0 | 2,0 | 3,0 | 4,0 | 5,0 | 6,0 | 5,7 | 5,3 | 6,3 | 7,3 | 8,3 | 9,3 | 10,3 | 11,3 | 12,3 | 13,3 | 14,3 | 15,3 | 16,3 | 17,3 | 18,3 | 19,3 | 20,3 | 21,3 |


Lecture : l'intérim rapporte 2 589 et 2 603 € les deux mois travaillés (1 842 € de salaire net plus le supplément diminué de moitié du revenu au-dessus du plancher), contre 2 106 et 2 060 € sans activité ; l'horloge recule d'un peu moins d'un demi-mois par mois travaillé ; la référence reste à 2 361 € (l'intérim moins payé ne la baisse pas) ; au 24e mois, la personne touche 1 178 € au lieu de 928 €. Sur deux ans : 46 027 € avec l'intérim, 42 113 € sans, 34 678 € avec l'ARE et le même intérim. Avec la courbe M, l'intérim (1 842 €) dépasse le supplément restant, qui tombe à zéro ces deux mois.

## 6. Coût total et bilan [Estimation]

| Poste (Md€/an, croisière) | Favorable | **Central** | Défavorable |
|---|---|---|---|
| Ligne D02 de la base : complément dégressif | 12,56 | **12,56** | 12,56 |
| Garantie, population indemnisée aujourd'hui (courbe A) | 30,5 | **31,9** | 33,2 |
| Démissionnaires | 2,3 | **4,0** | 7,6 |
| Indépendants | 0,6 | **1,3** | 2,6 |
| Total versé au-dessus du plancher (= coût de l'assurance chômage par construction au central) | 33,4 | **37,1** | 43,4 |
| Non-emploi plus long : plancher et contributions perdues | 2,2 | **7,8** | 19,4 |
| Pont vers la retraite (§ 8), surcoût et non-emploi | 1,1 | **1,3** | 1,5 |
| Arrêts maladie (§ 9), net | 4,7 | **7,8** | 11,5 |
| **Écart au solde de la base (couche GT0711)** | **−29,0** | **−41,4** | **−63,3** |

Le solde de croisière de la base consolidée passe de **−100,7** à **−142,1 Md€** au central. La garantie seule (GT01 à GT03) pèse −24,5 : c'est exactement la réduction de la ligne D02 que la base avait déjà comptée (37,1 → 12,56) et que « coût égal à l'assurance chômage » rend. Les contrôles du bilan restent verts (`python3 -I sources/calculs/bilan_global.py` : « Tests : tous passés » ; tableau `--md`, section GT0711).

Pour mémoire, les variantes « coût égal au modèle » laissent GT01 à GT03 à zéro et l'effet de comportement entre +1,2 et −1,9 Md€.

## 7. Recommandation de Claude [Opinion]

1. **Garder l'architecture** : courbe continue journalière, moyenne glissante, horloge, cumul à 50 %, référence qui ne baisse jamais pendant un épisode, ouverture à tous, préavis bilatéral. Elle règle l'effet de seuil de l'affiliation (130 jours), la marche de la fin de droits, l'inégalité entre licenciés économiques (CSP à 75 %) et autres, et l'absence des indépendants.
2. **Ne pas retenir « coût égal à l'assurance chômage »** tant que la base manque de 53 Md€ : c'est 32 Md€ de plus que la base au central (y compris le comportement), plus que tous les leviers de S3 réunis hors fonction des revenus.
3. **Budget de 25 Md€ au-dessus du plancher, sur 18 mois, presque en droite (λ = +0,17)**, ouverture comprise : 12,4 Md€ de plus que la base (et 2,7 de comportement), 12,1 de moins que l'assurance chômage. Mois par mois :

| Mois | 1 | 3 | 6 | 9 | 12 | 15 | 18 | Cumul 24 mois |
|---|---|---|---|---|---|---|---|---|
| Smic | 1 745 | 1 638 | 1 482 | 1 330 | 1 182 | 1 039 | 900 | 28 869 (ARE : 24 776) |
| Médian | 2 316 | 2 139 | 1 880 | 1 628 | 1 384 | 1 146 | 915 | 34 020 (ARE : 33 064) |
| Cadre à 4 000 € net | 3 469 | 3 150 | 2 684 | 2 230 | 1 789 | 1 361 | 945 | 44 411 (ARE : 50 010) |
| Indépendant (R = 3 000 €) | 2 065 | 1 919 | 1 705 | 1 497 | 1 295 | 1 099 | 908 | 31 758 (aujourd'hui ≈ 20 520) |

   Le bas et le milieu de l'échelle gagnent sur deux ans, le cadre perd 11 % face à l'ARE (qui le couvre aujourd'hui jusqu'à 2 440 € pendant 18 mois). C'est un choix politique, pas technique : il faut le dire.
4. **Contrôles à prévoir** : déclaration du revenu des indépendants par la facture électronique, moyenne sur 24 mois (un mois gonflé pèse au plus 8 %), plafond de la référence (par exemple 4 plafonds de la Sécurité sociale, comme aujourd'hui), recherche d'emploi et accompagnement au guichet de proximité, évaluation à groupe témoin dès la bascule (aucune étude n'existe sur une telle courbe).

## 8. Le pont vers la retraite (garantie modulée par l'âge)

### 8.1 La règle [Proposition, décision de principe de l'auteur du 07/11/2026]

Pas de retraite anticipée à proprement parler. Toute personne qui perd son activité, quel qu'en soit le motif (réforme, délocalisation, démission), reçoit la garantie ; **avant 50 ans**, garantie standard et formation de son choix (compte formation unique, `sources/formation-professionnelle-cartographie.md` § 4) ; **à partir de 50 ans**, elle choisit entre la reconversion (garantie standard et formation financée) et le **pont** : la courbe descend du revenu de référence non plus jusqu'au plancher, mais jusqu'à un niveau L(a) tenu jusqu'à l'âge du taux plein, où la pension prend le relais :

L(a) = P + w(a) × (Pen − P),   w(a) = ((a − 50) / (Atp − 50))^κ, borné à [0, 1],

avec Pen la pension estimée (75 % du revenu net de référence ⚠️ V19831), Atp l'âge du taux plein (62 ans au central ; l'auteur évoque 60 ans, à discuter ; variantes 60 et 64), et la même forme g et la même durée T que la garantie pour descendre jusqu'à L. À 50 ans, w = 0 : le pont **est** la garantie standard (aucun « cadeau de 12 ans ») ; plus on approche du taux plein, plus le pont est court et proche de la pension. Cumulable avec de petits revenus d'activité (mêmes règles de cumul et d'horloge, moyenne glissante). Ce dispositif remplace la « retraite anticipée à 58 ans » de transition (`sources/economies-cachees-et-transition.md` § 3, 0,29 Md€ cumulés), qui ne concernait que les métiers supprimés par la réforme : il règle l'équité avec les licenciés d'une délocalisation.

### 8.2 Calibration [Estimation]

κ est calibré pour que le surcoût du pont, au-delà de la garantie standard, soit de 1 Md€ par an (contrainte indicative de l'auteur). Entrants de 50 ans et plus : 15 % des entrées (≈ 470 000 par an ⚠️ V19830), sortie vers l'emploi plus lente (37,7 % d'accès à l'emploi en 6 mois après 50 ans contre 48,6 % pour l'ensemble : France Travail, *Statistiques et indicateurs* n° 26.011, juillet 2026, cote A), « verrou » du pont (sortie jusqu'à 20 % plus lente, proportionnelle à w ⚠️ V19832), part qui choisit le pont de 30 % à 50 ans à 90 % juste avant le taux plein (⚠️ V19833).

Courbes : A (coût de l'assurance chômage), R (recommandation du § 7 : 25 Md€, 18 mois), M (coût du modèle).

| Courbe de la garantie | Âge du taux plein | κ (surcoût 1 Md€) | Surcoût du pont : bas / central / haut (Md€) | Recettes et plancher (Md€) | Entrants de 50 ans et plus par an | Choisissent le pont |
|---|---|---|---|---|---|---|
| A | 60 ans | 1,22 | 0,94 / 1,00 / 1,06 | −0,21 / −0,32 / −0,43 | 472705 | 276533 |
| A | 62 ans | 1,47 | 0,94 / 1,00 / 1,07 | −0,21 / −0,33 / −0,44 | 472705 | 277714 |
| A | 64 ans | 1,68 | 0,94 / 1,00 / 1,08 | −0,22 / −0,33 / −0,45 | 472705 | 278559 |
| R | 60 ans | 1,44 | 0,98 / 1,00 / 1,03 | −0,18 / −0,28 / −0,37 | 468196 | 273895 |
| R | 62 ans | 1,68 | 0,98 / 1,00 / 1,03 | −0,19 / −0,28 / −0,38 | 468196 | 275065 |
| R | 64 ans | 1,89 | 0,98 / 1,00 / 1,03 | −0,19 / −0,29 / −0,39 | 468196 | 275901 |
| M | 60 ans | 1,74 | 1,02 / 1,00 / 0,98 | −0,15 / −0,23 / −0,30 | 458359 | 268140 |
| M | 62 ans | 1,99 | 1,02 / 1,00 / 0,98 | −0,16 / −0,23 / −0,31 | 458359 | 269286 |
| M | 64 ans | 2,20 | 1,02 / 1,00 / 0,98 | −0,16 / −0,24 / −0,32 | 458359 | 270104 |

Poids de l'âge w(a) et niveau tenu L(a) (courbe A, taux plein 62 ans, κ = 1,47, salarié médian, pension estimée 1771 €) : 50 ans : w 0,00, L 877 € ; 52 ans : w 0,07, L 942 € ; 55 ans : w 0,28, L 1124 € ; 57 ans : w 0,45, L 1282 € ; 58 ans : w 0,55, L 1370 € ; 59 ans : w 0,66, L 1463 € ; 60 ans : w 0,77, L 1561 € ; 61 ans : w 0,88, L 1664 €


**Smic, perte à 50 ans** (référence 1772 €, pension estimée 1329 €, niveau tenu 877 €, 144 mois jusqu'à 62 ans)
| Mois | 1 | 3 | 6 | 12 | 18 | 24 | 36 | 48 | 60 | 72 | 84 | 96 | 108 | 120 | 132 | 144 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Pont | 1761 | 1718 | 1645 | 1464 | 1224 | 908 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 138988 |
| Garantie standard | 1761 | 1718 | 1645 | 1464 | 1224 | 908 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 138988 |
| ARE actuelle puis plancher | 1084 | 1084 | 1084 | 1084 | 1084 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 130016 |

**Smic, perte à 55 ans** (référence 1772 €, pension estimée 1329 €, niveau tenu 1002 €, 84 mois jusqu'à 62 ans)
| Mois | 1 | 3 | 6 | 12 | 18 | 24 | 36 | 48 | 60 | 72 | 84 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Pont | 1763 | 1726 | 1663 | 1507 | 1301 | 1028 | 1002 | 1002 | 1002 | 1002 | 1002 | 95100 |
| Garantie standard | 1761 | 1718 | 1645 | 1464 | 1224 | 908 | 877 | 877 | 877 | 877 | 877 | 86368 |
| ARE actuelle puis plancher | 1084 | 1084 | 1084 | 1084 | 1084 | 877 | 877 | 877 | 877 | 877 | 877 | 78224 |

**Smic, perte à 60 ans** (référence 1772 €, pension estimée 1329 €, niveau tenu 1223 €, 24 mois jusqu'à 62 ans)
| Mois | 1 | 3 | 6 | 12 | 18 | 24 | Cumul |
|---|---|---|---|---|---|---|---|
| Pont | 1765 | 1739 | 1694 | 1583 | 1436 | 1241 | 37138 |
| Garantie standard | 1761 | 1718 | 1645 | 1464 | 1224 | 908 | 33748 |
| ARE actuelle puis plancher | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 26018 |

**médian, perte à 50 ans** (référence 2361 €, pension estimée 1771 €, niveau tenu 877 €, 144 mois jusqu'à 62 ans)
| Mois | 1 | 3 | 6 | 12 | 18 | 24 | 36 | 48 | 60 | 72 | 84 | 96 | 108 | 120 | 132 | 144 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Pont | 2344 | 2272 | 2151 | 1850 | 1453 | 928 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 147353 |
| Garantie standard | 2344 | 2272 | 2151 | 1850 | 1453 | 928 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 147353 |
| ARE actuelle puis plancher | 1545 | 1545 | 1545 | 1545 | 1545 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 138304 |

**médian, perte à 55 ans** (référence 2361 €, pension estimée 1771 €, niveau tenu 1124 €, 84 mois jusqu'à 62 ans)
| Mois | 1 | 3 | 6 | 12 | 18 | 24 | 36 | 48 | 60 | 72 | 84 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Pont | 2347 | 2287 | 2186 | 1936 | 1605 | 1167 | 1124 | 1124 | 1124 | 1124 | 1124 | 112006 |
| Garantie standard | 2344 | 2272 | 2151 | 1850 | 1453 | 928 | 877 | 877 | 877 | 877 | 877 | 94733 |
| ARE actuelle puis plancher | 1545 | 1545 | 1545 | 1545 | 1545 | 877 | 877 | 877 | 877 | 877 | 877 | 88354 |

**médian, perte à 60 ans** (référence 2361 €, pension estimée 1771 €, niveau tenu 1561 €, 24 mois jusqu'à 62 ans)
| Mois | 1 | 3 | 6 | 12 | 18 | 24 | Cumul |
|---|---|---|---|---|---|---|---|
| Pont | 2352 | 2313 | 2248 | 2086 | 1872 | 1588 | 48819 |
| Garantie standard | 2344 | 2272 | 2151 | 1850 | 1453 | 928 | 42113 |
| ARE actuelle puis plancher | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 37069 |


**Lecture.** Avec la courbe A et un taux plein à 62 ans, κ = 1,47 : un salarié médian qui perd son emploi à 55 ans descend en deux ans de 2 347 € à 1 124 € et garde ce niveau jusqu'à 62 ans (contre 877 € avec la garantie standard et le plancher après 22,5 mois d'ARE aujourd'hui) ; à 60 ans, il descend vers 1 561 € et touche 1 588 € au 24e mois, à la veille de sa retraite (contre 1 545 € d'ARE, qui va aujourd'hui jusqu'à la retraite pour les 57 ans et plus). Le surcoût reste d'environ 1 Md€ quel que soit l'âge du taux plein (κ = 1,22 à 60 ans, 1,68 à 64 ans), mais un taux plein plus tardif rend le pont plus maigre à âge égal ; l'allongement du non-emploi coûte en plus 0,2 à 0,4 Md€. **Réserve** [Opinion] : un pont tenu jusqu'à la retraite reproduit en partie les préretraites des années 1980-1990 (le COR note un effet de vases communicants entre préretraites et chômage des seniors, `sources/economies-cachees-et-transition.md` § 2) ; le poids w(a) convexe et le choix explicite de la reconversion le limitent, sans l'annuler.

## 9. Les arrêts maladie dans le même système

### 9.1 La proposition (précision de l'auteur du 07/11/2026)

Même circuit que la garantie, sans démarche de l'employeur : les **arrêts courts** se font sur **simple déclaration** de la personne (pas de certificat pour une grippe), sans jour de carence et sans subrogation par l'employeur ; seuls les **arrêts longs et les affections de longue durée** passent par le médecin, qui les déclare directement au système, lequel verse l'indemnité. Niveau d'indemnisation comparable à aujourd'hui : le module retient **90 % du revenu net de référence** (la même moyenne glissante) pour les arrêts courts, à rapprocher du maintien actuel à 90 % du brut par l'employeur (article L1226-1 du code du travail, après un an d'ancienneté ⚠️) ; la suite (deux tiers, puis invalidité) reste à écrire avec le chapitre santé.

### 9.2 Ce que coûtent les arrêts aujourd'hui [Fait]

| Poste | Montant 2024 | Source (cote) |
|---|---|---|
| IJ des régimes de base : maladie / AT-MP / maternité-paternité | **12,1** / 5,3 / 3,9 Md€ (21,3 au total, +6,2 %) ; IJ maladie hors Covid +6,6 % par an de 2019 à 2024 | Drees, *Les dépenses de santé en 2024*, fiche 25, tableau 1 (A) |
| Compléments d'IJ des organismes complémentaires (prévoyance, mutuelles) | **7,4 Md€** (+7,2 %) | idem (A) ; 5,6 au titre du « maintien de salaire » du risque maladie dans les comptes de la protection sociale (Drees, CPS 2025, fiche 6) |
| Salaire maintenu des fonctionnaires malades | non identifié (« sans que cette dépense soit identifiée ») ; estimé 6 à 9,5 Md€ | idem, note 1 ; estimation ⚠️ V19841 |
| Maintien direct par les employeurs privés | non publié ; 2 à 6,3 Md€ | ⚠️ V19840 |
| Régime général (salariés du privé et contractuels) | 10,2 Md€ en 2023 ; 28 % des salariés ont au moins un arrêt indemnisé ; arrêts de moins de 8 jours : près de la moitié des arrêts, **4 % des dépenses** ; arrêts de plus de 6 mois : 7 % des arrêts, **45 % des dépenses** ; IJ moyenne 36-37 € par jour | [Drees, *Études et résultats*, décembre 2024](https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/etudes-et-resultats/241211_ER_Arrets-Maladie) (A) |
| Règles | carence de 3 jours dans le privé (souvent couverte par l'employeur : deux tiers des salariés, Pollak 2015 ⚠️ V19844), d'1 jour dans la fonction publique ; IJ = 50 % du salaire journalier de base, plafonnée (1,4 Smic depuis avril 2025 ⚠️ V19849) ; fonctionnaires : 90 % pendant trois mois depuis 2025 ⚠️ V19849 | |

### 9.3 Ce que disent les études sur la carence et l'auto-déclaration

- **France, fonction publique** : le jour de carence (2012-2013, puis depuis 2018) réduit le nombre d'arrêts de **22,6 %** mais les jours d'absence de **5,1 %** seulement ; −44 % pour les arrêts d'un jour, −26 % pour deux jours, −12 % pour 4 à 7 jours, rien de significatif au-delà de trois mois (Hillion, *Insee Analyses* n° 95, juillet 2024, Éducation nationale, 880 000 agents, cote A) ; la première évaluation (Cazenave-Lacroutz et Godzinski, *Insee Analyses* n° 36, 2017) trouvait moins d'absences de deux jours et **plus d'absences d'une semaine à trois mois** (cote A, résumé lu). La carence fait aussi venir travailler des personnes malades : le gain en jours travaillés n'est pas un gain d'abus évités.
- **Auto-déclaration** : la revue Cochrane (Kausto et al., 2019 ; 5 études, Suède, Norvège, Royaume-Uni) conclut à une **certitude faible à très faible** : instaurer 3 jours d'auto-déclaration augmente les arrêts courts ; passer de 3 jours à un an ne change pas la durée et réduit le temps perdu des arrêts de plus de 4 jours ; le coût des indemnités supplémentaires dépasse de près de six fois l'économie de consultations (cote A). En Norvège, la commune de Mandal, qui a laissé ses agents se déclarer eux-mêmes jusqu'à un an en 2008, n'a pas vu l'absence augmenter (elle a baissé chez les femmes) : l'employeur a repris le rôle d'accompagnement du médecin (Ferman, Torsvik et Vaage, *Journal of Population Economics*, 2021, résumé lu, cote A).
- **Précédents** : Royaume-Uni, auto-certification jusqu'à 7 jours, certificat médical (« fit note ») au-delà ; Norvège, « egenmelding » de 3 jours, 4 fois par 12 mois, jusqu'à 8 jours dans les entreprises qui l'ont négocié (de mémoire ⚠️ V19849).
- **Manque** : aucune étude française de l'auto-déclaration ; aucune mesure de la suppression de la carence dans le privé quand l'employeur ne la couvre pas.

### 9.4 Coût et garde-fous [Estimation, Md€/an : bas / central / haut]

| Poste | Bas | **Central** | Haut |
|---|---|---|---|
| Jours de carence payés par le système (privé : 7,5 M d'arrêts × 3 jours + 4 M d'arrêts courts × 2 jours ; 90 % de 85 € nets) | 2,33 | **2,33** | 2,33 |
| Jour de carence de la fonction publique | 0,36 | **0,36** | 0,36 |
| Comportement, privé (jours des arrêts de 7 jours ou moins : +10 / **+25** / +45 %) | 0,34 | **0,86** | 1,55 |
| Comportement, fonction publique (fin de la carence : +5,4 % des jours, réciproque de −5,1 %) | 0,14 | **0,37** | 0,55 |
| Économies (consultations pour certificat, subrogation, attestations) | −0,30 | **−0,20** | −0,10 |
| Reprise par le système des compléments de prévoyance et du maintien employeur (hors carence déjà comptée) | 7,84 | **9,84** | 12,14 |
| Salaire libéré (primes et maintien reversés en salaire) repris par la fonction des revenus | −5,98 | **−5,80** | −5,31 |
| **Coût net pour les finances publiques** | **4,7** | **7,8** | **11,5** |
| *Sans reprise des compléments (le système ne paie que l'indemnité de base et la carence)* | *2,0* | *3,0* | *4,1* |

Garde-fous proposés : auto-déclaration limitée à **7 jours par arrêt et 3 arrêts par période de 12 mois** (au-delà, certificat) ; contrôle aléatoire et ciblé par les données (récurrence des arrêts du lundi, etc.) ; l'employeur est informé de l'arrêt, pas du motif ; la fraude détectée aux IJ (42 M€ en 2024, relayé) reste faible devant les montants en jeu.

**Opinion (Claude)** : la fin de la carence et l'auto-déclaration coûtent peu (≈ 3 Md€) au regard de ce qu'elles simplifient (des millions de consultations, la subrogation dans chaque entreprise) ; ce qui coûte, c'est la **reprise par le système de la prévoyance et du maintien employeur** (≈ 10 Md€ bruts, ≈ 4 nets du salaire libéré), qui suppose, comme pour la mutuelle, une règle de transition qui oblige les employeurs à reverser en salaire ce qu'ils ne paient plus.

## 10. Hypothèses

| N° | Hypothèse | Valeur | Vérification |
|---|---|---|---|
| HGT1 | Fonction des revenus de la base de travail | S = 412,5 ; m∞ = 0,65 ; m0 = 0,20 ; K = 1 500 ; plancher 877 €, retrait 25 % | — |
| HGT2 | Coût de la garantie = supplément au-dessus du plancher ; garantie non imposable ; personne seule | | V19810, V19812 |
| HGT3 | Coût employeur interpolé entre trois cas OpenFisca, mutuelle reversée (50,11 €) | | V19805 |
| HGT4 | Net actuel = 78 % du brut, avant impôt | | V19806 |
| HGT5 | Après la fin des droits actuels : plancher de 877 € (RSA + aide au logement) ; ASS ignorée | | |
| HGT6-HGT10 | Calibrage : stock 2,62 M ; 37,1 Md€ ; consommation 64 % ; durées potentielles ; part versée 95 % ; σ = 0,5 | | V19807-V19809 |
| HGT11 | Moyenne glissante : 24 mois hors garantie, poids linéaires 24 à 1 | | |
| HGT12 | Horloge : recul de 0,5 mois au plus par mois travaillé | | V19811 |
| HGT13 | Cumul : 50 centimes retirés par euro net au-dessus du plancher ; référence qui ne baisse pas pendant un épisode | | V19811 |
| HGT14-HGT17 | Ouverture : démissionnaires 20 000 / 33 000 / 60 000 par mois (h = 0,08, référence +10 %) ; indépendants 50 000 / 100 000 / 200 000 par an (médiane 2 500 €, σ = 0,7, h = 0,06) | | V19815-V19818 |
| HGT18-HGT22 | Comportement : εD 0,15 / 0,30 / 0,70 ; εPD 0,15 / 0,27 / 0,40 ; εE 0 / 0,10 / 0,10 ; bornes ±30 % ; éviction 50 / 25 / 0 % ; horizon 36 mois | | V19820 |
| HGT25-HGT27 | Arrêts maladie : 90 % du net de référence ; volumes d'arrêts ; hausse des arrêts courts ; retour en salaire 35-55 % | | V19840-V19849 |
| HGT31-HGT33 | Pont : pension à 75 % du net ; taux plein à 62 ans (60 et 64 en variantes) ; 15 % d'entrants de 50 ans et plus ; sortie × 0,71 ; verrou 0,8 ; choix 30 à 90 % ; surcoût visé 1 Md€ | | V19830-V19833 |

## 11. Synthèse des sources mobilisées

| Source | Quoi | Ce qu'elle établit | Cote, conflits d'intérêts |
|---|---|---|---|
| Unédic, *Assurance chômage : paramètres utiles*, juillet 2026, [PDF](https://s3.eusc-de-east-1.amazonaws.eu/unedic-eks-prod-cms/2026/07/15/unedic_parametres_utiles_juillet2026-vf_uid_6a5757953d941.pdf) | règles et montants en vigueur, effectifs, résultats 2025 | formule de l'ARE, durées, dégressivité, affiliation, démissionnaires, ATI, CSP, motifs des allocataires | A (gestionnaire du régime, paritaire) |
| Unédic, *Situation financière de l'assurance chômage à horizon 2028*, 21/10/2026 (`langagement-donnees/sources/chomage/unedic_prev_oct2026.pdf`) | comptes 2024-2025, prévisions | 37,1 / 37,2 Md€ d'allocations, 2,62 M d'indemnisés, avenant « ruptures conventionnelles » | A ; l'Unédic plaide contre les prélèvements de l'État (orientation dite) |
| Unédic, synthèse du conseil d'administration du 30/06/2026 | comptes 2025, revalorisation | pas de revalorisation au 01/07/2026 | A |
| [Unédic, indicateurs de mars 2026](https://www.unedic.org/publications/les-indicateurs-de-l-assurance-chomage-mars-2026) | allocation moyenne | 1 048 € nets ; 549 000 ouvertures au 3e trimestre 2025 | A |
| [service-public.gouv.fr, F14860](https://www.service-public.gouv.fr/particuliers/vosdroits/F14860) | montant de l'ARE | dégressivité, seuils | A |
| Unédic, juin et décembre 2025 ; Dares, comité d'évaluation 2019-2021 (avril 2025) ; CAE n° 90 (avril 2026) | durées, élasticités | voir `sources/recherche-chomage-durees-elasticites.md` | A / A / B |
| Le Barbanchon, Rathelot, Roulet (2019) ; Schmieder et von Wachter (2016) ; Schmieder, von Wachter, Bender (2016) ; Nekoei et Weber (2017) ; Chetty (2008) ; Lalive, Landais, Zweimüller (2015) | effets de l'indemnisation | élasticités 0,2-0,5 ; salaire de reprise ambigu ; liquidité ; externalités | A (revues à comité de lecture ; plusieurs lus en résumé ⚠️ V19821) |
| Hermansen (2015) ; VIVE (2014) | Danemark, réforme de 2010 | sorties plus rapides près de la fin des droits, effet global discuté | A / B (résumés ⚠️ V19822) |
| Drees, *Les dépenses de santé en 2024*, fiche 25 ; *La protection sociale en 2024*, fiche 6 | IJ | 21,3 Md€ d'IJ de base, 12,1 pour la maladie, 7,4 de compléments | A |
| [Drees, *Études et résultats*, décembre 2024](https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/etudes-et-resultats/241211_ER_Arrets-Maladie) | arrêts du régime général | 28 % de salariés arrêtés ; arrêts courts 4 % des dépenses | A |
| [Insee Analyses n° 95](https://www.insee.fr/fr/statistiques/8198911) (2024) et [n° 36](https://www.insee.fr/fr/statistiques/3181789) (2017) | jour de carence | −22,6 % d'arrêts, −5,1 % de jours ; report vers les arrêts longs | A |
| [Kausto et al., Cochrane, 2019](https://www.cochrane.org/evidence/CD013098_changing-length-time-worker-allowed-take-time-work-because-illness-without-physicians-certificate) ; Ferman, Torsvik, Vaage (2021) | auto-déclaration | effets incertains ; pas de hausse à Mandal | A |
| France Travail, *Statistiques et indicateurs* n° 26.011 (juillet 2026) | retour à l'emploi par âge | 37,7 % après 50 ans contre 48,6 % | A |
| Insee Première n° 2132 (octobre 2026) | salaire net médian 2025 | 2 238 € (cas type médian) | A (relayé par la recherche, page non ouverte ⚠️) |
| Modules du dépôt (`modele.js`, `decisions_0611_v74.js`, `bilan_global.py`) | barème, complément actuel | hypothèses d'auteur | B/C selon leurs propres cotes |

## 12. Variante « coût constant » (consignes de l'auteur du 07/11/2026, soir)

Consigne : **pas plus cher qu'aujourd'hui** (assurance chômage 37,1 Md€ + indemnités journalières maladie 12,1 Md€ = **49,2 Md€**), si possible un peu moins ; coût présenté aussi par rapport à la base du bilan (complément de 12,56 Md€ + IJ inchangées de 12,1 = **24,66 Md€**).

### 12.1 Les nouvelles règles

1. **Courbe de 12 mois** jusqu'au plancher de 877 €, même famille de formes (λ).
2. **Droits proportionnels au travail** : un mois de droits pour deux mois travaillés (24 mois travaillés donnent 12 mois). La courbe est ramenée sur la durée des droits : elle part toujours du revenu et rejoint le plancher en D mois, sans marche. La référence reste la moyenne glissante, calculée sur les mois de vie active (les mois antérieurs à l'entrée dans l'emploi ne comptent pas pour zéro) : un jeune qui a travaillé 12 mois a une référence égale à son salaire et 6 mois de droits. C'est « mieux indemniser sur une période plus courte ». Dans la population, les droits valent 4 mois pour 12 % des entrants, 8 mois pour 23 %, 12 mois pour 65 % (reconstitution ⚠️ V19853).
3. **Carence et différés, comme aujourd'hui** [Fait, cote A : Unédic, fiche ARE, avril 2025, p. 6-7] : l'indemnisation ne commence qu'après (a) le **différé spécifique**, égal aux indemnités de rupture supérieures au minimum légal divisées par 109,6 (valeur 2025, indexée sur le plafond de la Sécurité sociale), au plus 150 jours (75 en cas de licenciement économique) ; (b) le **différé congés payés**, égal aux indemnités compensatrices de congés payés des fins de contrat des 182 derniers jours divisées par le salaire journalier de référence, au plus 30 jours ; (c) un **délai d'attente de 7 jours**, sauf s'il a déjà été appliqué dans les 12 derniers mois. Exemple de l'Unédic : 4 + 17 + 7 = 28 jours. **Proposition** : garder les trois. Dans la logique de la garantie (100 %, c'est le revenu tant qu'on l'a), congés payés non pris et indemnités supra-légales **sont** du revenu : l'horloge de la courbe ne démarre qu'à leur épuisement, puis après le délai d'attente. Comme ces règles sont les mêmes qu'aujourd'hui, elles sont déjà dans le calibrage (le coût de 37,1 Md€ est net des différés) ; supprimer le délai d'attente coûterait ≈ 0,8 Md€ par an [Estimation : 3,6 M d'entrées × 1 043 € de supplément mensuel moyen au départ × 7/30].
4. **Pont vers la retraite des 50 ans et plus**, gardé dans l'enveloppe (κ recalibré à 1,71 pour un surcoût de 1,0 Md€, 1,27 Md€ avec le non-emploi allongé).
5. **Arrêts maladie** (règle de l'auteur, variante principale) : **jour 1 non payé** (carence) ; **jours 2 et 3 payés 10 % et 20 %** du revenu net de référence, sur simple déclaration « je suis malade », sans médecin ; **à partir du 4e jour, arrêt prescrit par un médecin et 60 %**, puis montée jusqu'au **taux plein de 64 % du net** au 8e jour (variante comparée : +10 points par jour, 30 % au 4e jour) ; la référence journalière est plafonnée comme l'IJ actuelle (1,4 Smic) ; arrêts longs et affections de longue durée déclarés par le médecin directement au système. **Taux réel actuel** [Fait, de mémoire pour les textes ⚠️ V19850] : l'IJ de base vaut 50 % du salaire journalier de base (brut des trois derniers mois), plafonnée, soit ≈ 64 % du net ; le « ≈ 80 % » est celui qu'atteignent les salariés couverts par un complément (employeur, art. L1226-1 : 90 % du brut à partir du 8e jour après un an d'ancienneté, puis deux tiers ; prévoyance). Par défaut, le système **ne reprend pas** ces compléments : ils continuent d'être versés par les employeurs et la prévoyance, à partir de leurs propres règles.

### 12.2 Coût par rapport à aujourd'hui et à la base [Estimation, Md€/an, central]

Total versé = supplément de la garantie au-dessus du plancher (démissionnaires et indépendants compris) + surcoût du pont + arrêts maladie, consultations évitées déduites ; « avec comportement » ajoute l'effet des sorties plus rapides (une garantie plus courte que l'ARE raccourcit le non-emploi, élasticité 0,27 à la durée des droits) :

| λ (12 mois) | Garantie versée (dont démissionnaires ; indépendants) | Pont (surcoût ; κ) | Arrêts maladie | **Total versé** | vs aujourd'hui | vs base | Comportement (recettes ; pont) | Total avec comportement | vs aujourd'hui | vs base |
|---|---|---|---|---|---|---|---|---|---|---|
| -40 | 28,24 (3,09 ; 0,96) | 1,00 ; 1,34 | 12,17 | **41,41** | −7,79 | +16,75 | +1,91 ; −0,35 | 39,85 | −9,35 | +15,19 |
| -10 | 26,50 (2,91 ; 0,90) | 1,00 ; 1,39 | 12,17 | **39,66** | −9,54 | +15,00 | +2,41 ; −0,34 | 37,59 | −11,61 | +12,93 |
| -3 | 21,72 (2,41 ; 0,74) | 1,00 ; 1,53 | 12,17 | **34,88** | −14,32 | +10,22 | +3,85 ; −0,31 | 31,34 | −17,86 | +6,68 |
| 0 | 15,52 (1,74 ; 0,53) | 1,00 ; 1,71 | 12,17 | **28,69** | −20,51 | +4,03 | +5,91 ; −0,27 | 23,05 | −26,15 | −1,61 |
| 3 | 9,14 (1,04 ; 0,31) | 1,00 ; 1,89 | 12,17 | **22,31** | −26,89 | −2,35 | +8,34 ; −0,24 | 14,21 | −34,99 | −10,45 |
| 10 | 3,54 (0,42 ; 0,12) | 1,00 ; 2,04 | 12,17 | **16,71** | −32,49 | −7,95 | +10,75 ; −0,22 | 6,17 | −43,03 | −18,49 |

**Lecture.**
- **La contrainte ne mord pas** : avec 12 mois et des droits proportionnels, la garantie coûte moins que l'assurance chômage actuelle **quelle que soit la forme**. Même la courbe la plus lente (λ = −40, presque un palier à 100 % pendant 12 mois) laisse le total versé à 41,4 Md€, 7,8 de moins qu'aujourd'hui. Le choix ne porte donc pas sur le respect du budget, mais sur la générosité au regard du trou de la base.
- **Courbe centrale retenue pour la couche du bilan : la droite (λ = 0)**. Total versé **28,7 Md€**, soit **−20,5 Md€ par rapport à aujourd'hui** et **+4,0 par rapport à la base** ; avec le comportement, 23,1 Md€ (−26,2 et −1,6). Selon l'ampleur des réactions, l'effet sur les recettes va de +1,9 à +13,7 Md€ : c'est l'élément le plus incertain, je recommande de ne pas le compter pour décider.
- **Courbe généreuse (λ = −3)** : la baisse est lente pendant six mois puis s'accélère ; total versé 34,9 Md€ (−14,3 et +10,2) ; elle donne au salarié médian, sur deux ans, à peu près autant que l'ARE (33 852 € contre 33 064 €), concentré sur la première année.
- **Arrêts maladie** : la règle de l'auteur coûte 12,23 Md€, **+0,13** par rapport aux IJ actuelles, et 12,17 une fois déduites les consultations évitées (**+0,07**) : les jours 2-3 payés (0,17 Md€) compensent presque exactement la baisse des jours 4 à 7 (60 % au lieu de 64 %). L'intuition de l'auteur se vérifie à 0,1 Md€ près. La variante « +10 points par jour » (30 % au 4e jour) coûte 0,3 Md€ de moins ; un taux plein de 80 % coûterait 2,9 Md€ de plus.

### 12.3 Arrêts maladie : trois schémas et les consultations évitées

| Schéma | Taux plein | Jour du taux plein | Coût | Écart aux IJ actuelles | Jours 2-3 payés | Consultations évitées (millions) | Économie Assurance maladie | Coût net |
|---|---|---|---|---|---|---|---|---|
| règle de l'auteur : 0 / 10 / 20 %, puis 60 % dès le 4e jour (médecin), montée au taux plein au 8e jour | 64 % | 8 | 12,23 | +0,13 | 0,168 | 3,2 | 0,061 (0,096 toutes parts) | 12,17 |
| règle de l'auteur : 0 / 10 / 20 %, puis 60 % dès le 4e jour (médecin), montée au taux plein au 8e jour | 80 % | 8 | 15,09 | +2,99 | 0,168 | 3,2 | 0,061 (0,096 toutes parts) | 15,03 |
| jour 1 : 0 ; jour 2 : 10 % ; jour 3 : 20 % ; puis +10 points/jour | 64 % | 8 | 11,95 | −0,15 | 0,168 | 3,2 | 0,061 (0,096 toutes parts) | 11,89 |
| jour 1 : 0 ; jour 2 : 10 % ; jour 3 : 20 % ; puis +10 points/jour | 80 % | 9 | 14,71 | +2,61 | 0,168 | 3,2 | 0,061 (0,096 toutes parts) | 14,65 |
| 10 / 20 / 30 % ; puis +10 points/jour | 64 % | 7 | 12,27 | +0,17 | 0,283 | 3,2 | 0,061 (0,096 toutes parts) | 12,21 |
| 10 / 20 / 30 % ; puis +10 points/jour | 80 % | 8 | 15,08 | +2,98 | 0,283 | 3,2 | 0,061 (0,096 toutes parts) | 15,02 |
| jours 1-3 non payés ; 30 % au 4e jour, puis +10 points/jour | 64 % | 8 | 11,79 | −0,31 | 0,000 | 3,2 | 0,061 (0,096 toutes parts) | 11,72 |
| jours 1-3 non payés ; 30 % au 4e jour, puis +10 points/jour | 80 % | 9 | 14,55 | +2,45 | 0,000 | 3,2 | 0,061 (0,096 toutes parts) | 14,49 |

**Consultations évitées** [Estimation ⚠️ V19852] : 4 M d'arrêts de 1 à 3 jours par an, dont 80 % ne donneraient plus lieu à une consultation (60 à 90 %), soit **3,2 millions de consultations** ; à 30 € (consultation de généraliste G), **0,10 Md€** toutes parts confondues, dont **0,06 Md€** pour l'Assurance maladie (70 % moins 2 € de participation). Les indemnités des jours 2 et 3 coûtent **0,17 Md€** : le schéma principal coûte donc un peu plus qu'il n'économise de consultations sur les arrêts courts, mais il dégage surtout du temps médical (3,2 M de créneaux, environ 1 % des consultations de généralistes ⚠️), et l'ensemble de la règle reste au coût d'aujourd'hui à 0,1 Md€ près. Le schéma « 10 / 20 / 30 % » coûte à peu près autant que la règle de l'auteur ; « jours 1-3 non payés » 0,45 Md€ de moins, mais garde l'incitation à aller chez le médecin dès le premier jour pour être payé ensuite.

**Arrêts types : la compensation vérifiée** [Estimation ; IJ actuelle = 50 % du salaire journalier de base plafonné à 1,4 Smic, nette de CSG-CRDS ; maintien légal = 90 % à partir du 8e jour avec un an d'ancienneté ; maintien conventionnel = 100 % du net dès le 1er jour ; nouveau système = règle de l'auteur sur le revenu net de référence plafonné comme l'IJ, le maintien employeur restant dû au-dessus]. Revenu reçu sur l'arrêt, aujourd'hui → règle de l'auteur, et part du salaire net ; entre crochets, ce que paie l'employeur :

| Salarié | Maintien employeur | 3 jours | 5 jours | 10 jours | 30 jours |
|---|---|---|---|---|---|
| Smic | aucun | 0 → 18 (0 → 10 %) | 57 → 89 (24 → 30 %) | 200 → 276 (41 → 47 %) | 773 → 1032 (53 → 58 %) |
| Smic | légal (dès le 8e jour, 90 %) | 0 → 18 (0 → 10 %) [0 → 0] | 57 → 89 (24 → 30 %) [0 → 0] | 246 → 322 (51 → 55 %) [45 → 46] | 1119 → 1385 (77 → 78 %) [346 → 353] |
| Smic | conventionnel (100 % dès le 1er jour) | 146 → 177 (100 → 100 %) [146 → 159] | 243 → 295 (100 → 100 %) [185 → 206] | 485 → 591 (100 → 100 %) [285 → 314] | 1456 → 1772 (100 → 100 %) [683 → 739] |
| médian | aucun | 0 → 19 (0 → 8 %) | 80 → 95 (21 → 24 %) | 281 → 293 (37 → 37 %) | 1082 → 1095 (48 → 46 %) |
| médian | légal (dès le 8e jour, 90 %) | 0 → 19 (0 → 8 %) [0 → 0] | 80 → 95 (21 → 24 %) [0 → 0] | 364 → 385 (48 → 49 %) [83 → 92] | 1721 → 1802 (76 → 76 %) [639 → 707] |
| médian | conventionnel (100 % dès le 1er jour) | 226 → 236 (100 → 100 %) [226 → 217] | 377 → 393 (100 → 100 %) [297 → 299] | 754 → 787 (100 → 100 %) [473 → 494] | 2262 → 2361 (100 → 100 %) [1180 → 1266] |


Lecture : **sans maintien employeur, la règle de l'auteur paie plus qu'aujourd'hui pour tous les arrêts types** (arrêt de 5 jours au médian : 95 € contre 80 €, parce que les jours 2-3 payés font plus que compenser les 60 % des jours 4-5 ; au Smic, 89 € contre 57 €) ; à 30 jours, autant ou un peu plus. Avec le maintien légal (à partir du 8e jour), le salarié est au même niveau ou mieux. Avec un maintien conventionnel à 100 %, le salarié ne voit pas de différence (100 % du net, plus élevé dans le nouveau système) ; l'employeur paie un peu plus quand le net du nouveau système est plus élevé que le net actuel (Smic), un peu moins sur les arrêts courts du médian.

Garde-fous : déclaration en ligne ou au guichet, limitée à trois arrêts sans certificat par période de 12 mois ; l'employeur est informé de l'arrêt, pas du motif ; contrôles ciblés. Le jour de carence réduit surtout les arrêts d'un jour (−44 %, Insee Analyses n° 95) : payer peu les jours 2 et 3 garde l'essentiel de cet effet.

### 12.4 Congés payés et garantie

Les congés payés acquis et non pris sont soldés à la fin du contrat par l'indemnité compensatrice (ICCP) : c'est un revenu, qui couvre les jours correspondants. La garantie démarre donc après eux, comme le différé actuel (ICCP / salaire journalier de référence, 30 jours au plus) : la personne qui part avec 15 jours de congés touche son salaire pendant 15 jours, puis la courbe démarre à 100 % le 16e jour (après le délai d'attente). Dans le statut unique de l'actif, les congés s'acquièrent de la même façon pour tous les contrats ; un indépendant n'a pas d'ICCP, mais son revenu des derniers mois entre dans la moyenne glissante.

### 12.5 Cas types (€/mois, plancher compris ; ARE nette avant impôt ; après la fin des droits : plancher)

Smic, médian et cadre ont deux ans de travail (12 mois de droits) ; le jeune de 25 ans a travaillé 12 mois au Smic (6 mois de droits ; aujourd'hui, 9,1 mois d'ARE).


Courbe centrale (λ = 0)

| Mois | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| smic : garantie | 1734 | 1660 | 1585 | 1511 | 1436 | 1362 | 1287 | 1213 | 1138 | 1063 | 989 | 914 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 26416 |
| smic : ARE | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 877 | 877 | 877 | 877 | 877 | 877 | 24776 |
| median : garantie | 2299 | 2175 | 2052 | 1928 | 1804 | 1681 | 1557 | 1433 | 1310 | 1186 | 1062 | 939 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 29951 |
| median : ARE | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 877 | 877 | 877 | 877 | 877 | 877 | 33064 |
| cadre : garantie | 3438 | 3216 | 2993 | 2770 | 2547 | 2325 | 2102 | 1879 | 1657 | 1434 | 1211 | 988 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 37084 |
| cadre : ARE | 2577 | 2577 | 2577 | 2577 | 2577 | 2577 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 877 | 877 | 877 | 877 | 877 | 877 | 50010 |
| jeune 25 ans, 12 mois au Smic : garantie (droits 6 mois) | 1697 | 1548 | 1399 | 1250 | 1101 | 952 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 23732 |
| jeune : ARE (9,1 mois) | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 22912 |


Courbe généreuse (λ = −3)

| Mois | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | Cumul |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| smic : garantie | 1765 | 1750 | 1731 | 1706 | 1674 | 1633 | 1580 | 1512 | 1425 | 1313 | 1170 | 985 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 28768 |
| smic : ARE | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 877 | 877 | 877 | 877 | 877 | 877 | 24776 |
| median : garantie | 2350 | 2325 | 2293 | 2252 | 2199 | 2130 | 2043 | 1930 | 1786 | 1601 | 1363 | 1057 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 33852 |
| median : ARE | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 1545 | 877 | 877 | 877 | 877 | 877 | 877 | 33064 |
| cadre : garantie | 3531 | 3485 | 3427 | 3353 | 3257 | 3134 | 2977 | 2774 | 2514 | 2180 | 1752 | 1201 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 44110 |
| cadre : ARE | 2577 | 2577 | 2577 | 2577 | 2577 | 2577 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 2440 | 877 | 877 | 877 | 877 | 877 | 877 | 50010 |
| jeune 25 ans, 12 mois au Smic : garantie (droits 6 mois) | 1758 | 1718 | 1653 | 1546 | 1369 | 1078 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 24908 |
| jeune : ARE (9,1 mois) | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 1084 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 877 | 22912 |


**Lecture.** Avec la droite, chacun touche nettement plus que l'ARE les premiers mois (médian : 2 299 € contre 1 545 € au premier mois) et moins à partir du 7e ou 8e mois ; sur deux ans, le salarié au Smic gagne 1 640 € (+7 %), le médian perd 3 113 € (−9 %), le cadre 12 926 € (−26 %), le jeune gagne 820 € (+4 %) en touchant beaucoup plus pendant 6 mois au lieu de 1 084 € pendant 9 mois. Avec la courbe généreuse, le Smic gagne 3 992 €, le médian 788 €, le cadre perd 5 900 €.

### 12.6 Couche du bilan

Variante « coût constant » de la couche GT0711 (lignes GTC1 à GTC4, à côté des anciennes) : garantie −2,96 (−2,27 à −4,62) par rapport au complément de la base, comportement +5,91 (+1,93 à +13,68), pont −1,27, arrêts maladie −0,07 ; **effet +1,61 Md€ au central** (−1,60 à +7,63), solde de croisière −99,05 Md€ au lieu de −100,65. Sans compter le comportement, la variante coûte 4,0 Md€ de plus que la base et 20,5 de moins qu'aujourd'hui.
