# Chiffrage des décisions du 07 et 08/11/2026 (euros 2026, régime)

Rédigé par Claude (IA d'Anthropic) pour l'auteur, le 08/11/2026. Consultations : 08/11/2026 pour toutes les sources. Données brutes : `sources/donnees/decisions-0811/entrees.csv`.

**Convention de lecture** : les colonnes « bas / central / haut » donnent l'ampleur du poste, en Md€ par an, en régime. Le signe indique le sens pour le solde public : **+** améliore le solde, **−** le dégrade. Les coûts de transition (une fois) sont hors régime.

**Cotes** (la charte de travail (CONTRIBUTING.md), règle 11) : A = statistique publique ou texte officiel ; B = institution reconnue, rapport parlementaire, organisme public ; C = presse, cabinet, rapport d'acteur ; D = communication militante ou commerciale. **⚠️** = hypothèse ou non vérifié.

## Tableau de synthèse

| Ligne | Bas | Central | Haut | Source (cote) |
|---|---|---|---|---|
| 1. Collectivités : un seul niveau élu | +0,5 | +1,5 | +3,0 | Départements : 66,56 Md€ de fonctionnement en 2025 (DGCL/OFGL, A, lu par recherche) ; régions et doublons : hypothèses ⚠️ |
| 2. Justice : vers la médiane européenne | −0,74 | −1,09 | −1,35 | CEPEJ 2024, données 2022 (A) ; coût unitaire par magistrat et greffier : hypothèse ⚠️ |
| 3. Protection de l'enfance : +10 / +20 / +30 % de moyens, suivi à 21 ans | −1,3 | −2,5 | −3,8 | DREES, Dossier 138, 30/06/2026 : 11,7 Md€ (2024), 42 400 €/an par enfant accueilli (A) ; jeunes majeurs : hypothèse ⚠️ |
| 4. Taxe d'artificialisation : recette brute à 20 / 50 / 100 €/m² | +3,1 | +6,5 | +10,3 | Cerema : 15 119 ha (2024) et 19 263 ha (2023) (A/C) ; baisse des surfaces : hypothèse ⚠️. **Effet solde net ≈ 0** si la recette finance la renaturation |
| 5. Enveloppe d'État imprévus et cas particuliers (nette de l'existant) | −0,3 | −0,8 | −1,8 | Existant chiffré : au moins 0,23 Md€ (sources de années mélangées) ; enveloppe proposée : hypothèse ⚠️ |
| 6. Retenue pour indemniser les victimes : recouvrement additionnel | +0,05 | +0,1 | +0,2 | FGTI 2024 : 103,8 M€ recouvrés (B) sur environ 831 M€ versés (B, à confirmer) ; effet : hypothèse ⚠️ |
| **Total régime (lignes 1, 2, 3, 5, 6 ; ZAN exclu)** | **−1,8** | **−2,8** | **−3,8** | Somme des colonnes |
| **Scénario tout favorable / tout défavorable** | **+0,9** | | **−6,4** | Favorable : +3,0 −0,74 −1,3 −0,3 +0,2. Défavorable : +0,5 −1,35 −3,8 −1,8 +0,05 |

**Coûts de transition, hors régime (une fois, Md€)** : collectivités −1 / −2 / −3 (fin de mandat, reprise des personnels, fusion des systèmes d'information ; hypothèse ⚠️) ; outil numérique unique de la justice −0,3 à −1 (ordre de grandeur ⚠️, à chiffrer avec le ministère) ; ZAN, aucun.

**Attention aux doubles comptes** : les 11,7 Md€ de l'aide sociale à l'enfance des départements sont **déjà** dans les dépenses. Le transfert à l'État ou à l'intercommunalité ne crée pas de coût consolidé ; seule la ligne 3 (hausse des moyens) en crée un. Idem pour les 66,56 Md€ de fonctionnement des départements : leur transfert déplace la dépense, sans économie, sauf doublons.

---

## Ligne 1 : collectivités (un seul niveau élu)

**Ce qui est sourcé**
- Départements, fonctionnement 2025 : **66,56 Md€**, en hausse de 1,2 % par rapport à 2024 (65,79 Md€) : DGCL/OFGL, BIS n° 212, « Finances des départements 2025 » (A). Lu par recherche : le PDF n'est pas lisible par l'outil d'extraction. URL : https://www.collectivites-locales.gouv.fr/files/files/Etudes-et-statistiques/BIS/2026/Bis%20n%C2%B0%20212%20-%20Finances%20des%20d%C3%A9partements%202025_V1.pdf
- Ensemble des collectivités : frais de personnel en hausse de 1,8 % en 2025 ; dépenses de fonctionnement en hausse de 1,4 %, la plus faible depuis 2020, et en recul pour les régions : DGCL, « Les collectivités locales en chiffres 2025 » (A) : https://www.collectivites-locales.gouv.fr/les-collectivites-locales-en-chiffres-2025
- Régions : fonctionnement **non trouvé** dans les extraits. Hypothèse ⚠️ : 25 Md€ (à remplacer par le BIS régions).
- Indemnités d'élus : données nationales les plus récentes trouvées, anciennes : 123,6 M€ (départements) et 75,2 M€ (régions) en 2002 (réponse ministérielle, B) ; 58,3 M€ pour les conseils régionaux en 2011 (Dosière, B) ; un seul conseil régional, Auvergne-Rhône-Alpes, plus de 6,47 M€ en 2023 (presse, C). Ordre de grandeur actuel : **0,15 à 0,25 Md€** ⚠️.

**Méthode (hypothèses ⚠️)** : économie = indemnités des élus départementaux et régionaux supprimés (0,10 / 0,15 / 0,20 Md€) + doublons et fonctions support sur environ 90 Md€ de fonctionnement cumulé (0,5 % / 1,5 % / 3,1 %, soit 0,4 / 1,35 / 2,8 Md€). Total : **0,5 / 1,5 / 3,0 Md€**.

**Ce qui ne se chiffre pas encore** : cabinets des élus départementaux et régionaux (budgets non trouvés) ; économies de l'État absorbant les compétences (les coûts se déplacent) ; effet sur les subventions aux associations.

**Scénarios** : bas = doublons très faibles ; central = doublons 1,5 % ; haut = doublons 3 %. Un « scénario prudent » serait le bas.

**Transition (hors régime)** : −1 / −2 / −3 Md€ une fois (⚠️).

**Friction (Claude)** : la suppression des régions est politiquement tranchée, mais l'économie dépend presque entièrement de la réduction des doublons, qui n'est pas mesurée. Le manifeste doit dire que le chiffre est une fourchette, pas un gain acquis.

## Ligne 2 : justice (juges et personnel)

**Ce qui est sourcé** (CEPEJ, rapport 2024, données 2022, A ; relayé par le ministère de la Justice, le syndicat USM et la presse) :
- Juges professionnels : **11,3** pour 100 000 habitants (France) ; médiane européenne **17,6** ; moyenne **21,9**. Les sources divergent sur la moyenne (21,9 ; 22,2 ; 22,6) : retenir 21,9 et vérifier dans le rapport lui-même (https://rm.coe.int/tendances-et-conclusions-2024-rapport-d-evaluation-cepej-donnees-2022-/1680b1f9ff).
- Personnel non juge (greffiers et assimilés, selon CEPEJ) : **37,3** ; médiane **57,9**.
- Procureurs : 3,2 ; moyenne 12,2 (communiqué du ministère de la Justice, octobre 2024 : https://justice.gouv.fr/sites/default/files/2024-10/CP-%20Publication%20du%20rapport%202024%20de%20la%20CEPEJ.pdf).
- Budget de la justice, crédits de paiement 2024 : 12,16 Md€ (presse, C).

**Calcul** (population France ≈ 68 M, soit 680 unités par 100 000 habitants ; Insee, arrondi) :
- Juges vers la médiane : (17,6 − 11,3) × 680 ≈ **4 300 juges** ; vers la moyenne : (21,9 − 11,3) × 680 ≈ **7 200 juges**.
- Personnel non juge vers la médiane : (57,9 − 37,3) × 680 ≈ **14 000 personnes** ; bas = moitié de l'écart (7 000).
- Coût chargé : **magistrat 90 000 €/an** et **greffier 50 000 €/an** (⚠️ hypothèses : à remplacer par la masse salariale du programme 166 et l'effectif réel de la DGFiP/Justice).
- Bas : 4 300 × 0,09 + 7 000 × 0,05 = 0,39 + 0,35 = **0,74 Md€/an**. Central : 0,39 + 0,70 = **1,09 Md€/an**. Haut : 7 200 × 0,09 + 0,70 = **1,35 Md€/an**.
- Trajectoire 10 ans : montée linéaire, 10 % du coût annuel la première année, 100 % la dixième ; cumul sur 10 ans ≈ 5,5 × le coût annuel plein (central : ≈ 6,0 Md€ cumulés). ⚠️ (rythme de recrutement : école de la magistrature et de greffe, délai de formation).

**Outil numérique unique** : ordre de grandeur de transition −0,3 à −1 Md€ (⚠️, pas de source chiffrée). Les échecs passés (Portalis, procédure pénale numérique) **ne sont pas vérifiés** dans cette passe : à documenter avec la Cour des comptes ou les rapports parlementaires avant publication.

**Friction (Claude)** : les juges par habitant ne mesurent pas les délais. La France a moins de juges mais des indicateurs de délai à croiser (durée moyenne des procédures, non trouvée ici). Un recrutement massif sans outil ni formation ne baisse pas les délais.

## Ligne 3 : protection de l'enfance

**Ce qui est sourcé** (DREES, Les Dossiers de la DREES n° 138, « L'aide sociale à l'enfance », 30/06/2026, A ; URL : https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/les-dossiers-de-la-drees/260630-aide-sociale-enfance-2026) :
- Dépenses départementales de protection de l'enfance 2024 : **11,7 Md€** (+6,7 % en courant). Inclut la rémunération des assistants familiaux, pas les autres dépenses de personnel.
- **Coût moyen d'accueil par bénéficiaire accueilli : 42 400 € par an** (2024).
- Enfants accueillis fin 2024 : 224 700, dont 32 600 jeunes majeurs ; 392 600 bénéficiaires de l'ASE au total.
- Contrats jeunes majeurs : **aucun chiffre** dans la publication.

**Calcul**
- Hausse de moyens : +10 % / +20 % / +30 % de 11,7 Md€ = 1,17 / 2,34 / 3,51 Md€.
- Suivi jusqu'à 21 ans : **10 000 / 20 000 / 30 000** jeunes majeurs supplémentaires à 10 000 €/an (⚠️ hypothèse) = 0,10 / 0,20 / 0,30 Md€.
- Total : **1,3 / 2,5 / 3,8 Md€/an** (les signes sont négatifs : coût).

**Friction (Claude)** : l'auteur cite 50 000 à 70 000 € par an en établissement (⚠️) ; la moyenne DREES est **42 400 €** et couvre tous les accueils (familles d'accueil incluses). À retenir : 42 400 €. La hausse de 20 % ne dit pas où va l'argent : le plus gros du coût est l'accueil (80 %), donc la prévention et l'accompagnement doivent être chiffrés séparément. Le transfert de l'exécution aux intercommunalités ne change pas le coût.

## Ligne 4 : taxe d'artificialisation (remplace les quotas ZAN)

**Ce qui est sourcé**
- Artificialisation 2023 : **19 263 ha** (plus bas depuis 2009 selon la recherche ; Cerema, A/C ; la page officielle n'a pas été ouverte) : https://artificialisation.developpement-durable.gouv.fr
- Artificialisation 2024 : **15 119 ha** (Cerema, relayé par la Banque des Territoires, C).
- Moyenne 2023-2024 : **17 191 ha**, retenue pour le central.
- **Écart avec la position de l'auteur** : il a noté 20 000 à 25 000 ha par an (⚠️). Les données de 2023-2024 sont plus basses. Les millésimes diffèrent (le Sraddet et la DREAL n'utilisent pas le même) : à reprendre sur le dernier millésime avant publication.

**Calcul** : recette = surface × 10 000 m² × prix. Central 17 191 ha = 1,72 × 10⁸ m².
- Recette brute à 20 € : 17 191 × 10 000 × 20 = **3,4 Md€** ; avec une baisse des surfaces de 10 % : **3,1 Md€** (bas).
- À 50 € : **8,6 Md€** ; avec −25 % : **6,5 Md€** (central).
- À 100 € : **17,2 Md€** ; avec −40 % : **10,3 Md€** (haut).
- Élasticités ⚠️ : aucune source trouvée ; à calibrer sur la littérature (prix du foncier, permis de construire).

**Effet sur le solde** : si la recette finance la renaturation (position de l'auteur), l'effet net sur le solde est **nul**. Il ne devient positif que si une part de la recette n'est pas affectée. La taxe n'est pas un gain budgétaire : c'est un signal de prix.

**Friction (Claude)** : à 100 €/m², un hectare coûte 1 M€ de taxe. Le prix doit être publié et trajectorial (position de l'auteur : calibrer le prix et publier sa trajectoire). Un prix trop haut renchérit le logement neuf en périphérie, ce qui va contre la politique du logement décidée le 07/11.

## Ligne 5 : enveloppe d'État pour imprévus et cas particuliers

**Recensement** (détail : `sources/imprevus-et-verifications-0711.md`, partie 1) :
- Dépenses accidentelles et imprévisibles (P552) : 125 M€ en crédits de paiement, PLF 2026 (projet, A ; LFI non confirmée).
- Dotation de solidarité aux collectivités sinistrées (DSEC) : **70 M€ en 2026** (décret du 12/08/2026, C ; annonce ministérielle, B).
- Fonds de secours pour l'outre-mer (volet collectivités) : 17,84 M€ (PLF 2026, projet, B).
- Fonds d'aide aux jeunes (départements) : 17,5 M€ en 2020 (DREES, A ; à mettre à jour).
- **Somme chiffrée : environ 0,23 Md€, années mélangées** ; non chiffrés : aides CNAF et CPAM, CCAS, FSL. La CAF publie un budget d'action sociale (FNAS 2024 : environ 7 Md€), mais ce n'est pas une aide individuelle ; exclu.
- Catastrophes naturelles (CatNat) : prime payée par les assurés, pas une dépense publique ; exclue (environ 5 Md€ de sinistres en 2024 selon UFC-Que Choisir, C, ordre de grandeur seulement).

**Proposition de montant central** : enveloppe brute **0,5 / 1,0 / 2,0 Md€** par an. Moins l'existant (0,23) : effet net **−0,3 / −0,8 / −1,8 Md€**. Le central 1 Md€ couvre des aides individuelles de CNAF, CPAM, CCAS et FSL non chiffrées et une marge pour des catastrophes non assurables ⚠️. À calibrer après une collecte directe (DREES aide sociale départementale, rapports d'activité CNAF, comptes des CCAS).

**Friction (Claude)** : la commission de décision locale (position de l'auteur, 07/11) doit être dotée d'un plafond et de règles publiées, sinon l'enveloppe devient un guichet. Le « 50 € par habitant et par mois » évoqué le 07/11 (≈ 41 Md€ par an) a été écarté : il valait 2 € par habitant et par mois (≈ 1,6 Md€) à l'échelle nationale.

## Ligne 6 : retenue pour indemniser les victimes

**Ce qui est sourcé**
- FGTI, rapport d'activité 2024 : plus de 113 000 victimes prises en charge ; indemnisations de l'ordre de **830,8 M€** (texte coupé dans la recherche : à confirmer, B) ; **103,8 M€ recouvrés** auprès des auteurs (B). Source : https://www.fondsdegarantie.fr (rubrique publications).
- Résultat annuel négatif de **210 M€** en 2024 (question écrite citant le FGTI, B, à vérifier).
- SARVI 2023 : 67 874 victimes, **42,8 M€ versés** (réponse ministérielle, B). Une autre réponse cite 20,4 M€ recouvrés : chiffres contradictoires, à ne pas citer sans vérification.
- **Taux de recouvrement actuel** : aucun taux officiel global trouvé. Proxy : 103,8 / 830,8 ≈ **12,5 %** (rapport de deux flux de l'année, pas une cohorte : à traiter comme un ordre de grandeur ⚠️).

**Calcul** : base = 0,83 Md€ indemnisés. Recouvrement supplémentaire grâce à la retenue : 12,5 % → 18 % / 24 % / 36 % (bas / central / haut), soit +0,05 / +0,10 / +0,20 Md€ par an. Hypothèses ⚠️ sur la retenue : 250 €/mois, jusqu'à extinction de la dette (position de l'auteur, 07/11).

**Effet net** : l'État avance les sommes (coût de trésorerie, pas de dépense supplémentaire si le recouvrement suit). Le gain budgétaire est **faible**, environ 0,1 Md€ ; l'effet principal est symbolique (sentiment de justice) et de trésorerie pour les victimes.

**Friction (Claude)** : la retenue de 250 €/mois ne rembourse 100 000 € qu'en 33 ans hors intérêts. L'État avance, mais la dette ne s'éteint souvent jamais si les intérêts courent. L'auteur envisage une dette sans intérêts ; le texte doit trancher.

---

## Points à vérifier avant intégration (`verifications.md`)

1. Régions : fonctionnement 2025 (BIS régions) ; ligne 1 repose sur une hypothèse de 25 Md€.
2. Coût chargé magistrat (90 k€) et greffier (50 k€) : masse salariale du programme 166.
3. Artificialisation : chiffre officiel 2024 (portail) ; écart avec les 20 000 à 25 000 ha de la position de l'auteur.
4. FGTI : indemnisations 2024 (830,8 M€ ou autre) et résultat −210 M€.
5. SARVI 2023 : 42,8 M€ versés ou 20,4 M€ recouvrés.
6. CEPEJ : moyenne européenne des juges (21,9, 22,2 ou 22,6) : lire le rapport.
7. Protection de l'enfance : coût de 50 000 à 70 000 € par enfant (position de l'auteur) contre 42 400 € (DREES).
8. Mettre à jour `sources/imprevus-et-verifications-0711.md` avec la LFI 2026 (P552, FSOM).

## Sources mobilisées (synthèse)

| Source | Institution | Date | Cote | Conflit d'intérêts | Ce qu'elle établit |
|---|---|---|---|---|---|
| DREES, Dossier 138, ASE 2026 | DREES | 30/06/2026 | A | Aucun | 11,7 Md€ ; 42 400 €/an ; 224 700 accueillis ; 32 600 jeunes majeurs |
| DGCL/OFGL, BIS 212 (départements 2025) | DGCL | 2026 | A | Aucun | 66,56 Md€ de fonctionnement (lu par recherche) |
| DGCL, Les collectivités locales en chiffres 2025 | DGCL | 2025 | A | Aucun | Tendance des dépenses et des frais de personnel |
| CEPEJ 2024 (données 2022) | Conseil de l'Europe | 10/2024 | A | Aucun | Juges 11,3 ; personnel non juge 37,3 ; médianes et moyennes |
| Communiqué justice.gouv.fr (CEPEJ) | Ministère de la Justice | 10/2024 | A | Partie intéressée (budget) | Procureurs 3,2 / 100 000 |
| Cerema / portail de l'artificialisation | Cerema | 2023-2025 | A/C | Aucun | 19 263 ha (2023) ; 15 119 ha (2024) |
| FGTI, rapport d'activité 2024 | FGTI | 2025 | B | Organisme public | 103,8 M€ recouvrés ; indemnisations à confirmer |
| Réponse ministérielle SARVI | Assemblée nationale / Sénat | 2024-2025 | B | Parlementaire | 42,8 M€ versés en 2023 (chiffres contradictoires) |
| Réponses aux questions sur les élus (2002, 2011) | Gouvernement, Dosière | 2002-2011 | B | Parlementaire | Indemnités d'élus départementaux et régionaux (anciennes) |
| Actu-juridique, budget justice 2024 | Presse juridique | 2026 | C | Partie intéressée | 12,16 Md€ (CP) |
| Lyon Capitale, AURA 2023 | Presse | 2023 | C | Aucun | 6,47 M€ d'indemnités, une région |
| UFC-Que Choisir, catastrophes 2024 | Association de consommateurs | 2025 | C | Position militante | ≈ 5 Md€ de sinistres (ordre de grandeur) |
