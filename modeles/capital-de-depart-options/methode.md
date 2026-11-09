---
titre: Capital de départ et foncière — options comparées (méthode)
date: 2026-11-09
statut: brouillon ; écrit par Claude (IA d'Anthropic) pour l'auteur ; des ordres de grandeur sous hypothèses, jamais des prédictions
---

# Capital de départ et foncière : options comparées

## 1. Demande

Demande de l'auteur, 09/11/2026 : simuler les options du capital de départ face à la règle de la foncière retenue au § 28 de la note de conception de la foncière (atelier, non publiée), et dire ce qui marche le mieux. Précision du même jour : l'auteur penche pour un capital qui passe par la foncière (option A ou proche) ; le problème à résoudre est **l'injustice du démarrage** (qui, quand, dans quel ordre), en partie corrigée par la décote du capital selon l'héritage. Ajouter : montée en charge sur 5 à 10 ans, sort des générations qui ont 25-35 ans (et plus) au lancement, mesure de l'injustice entre générations et entre secteurs, meilleur réglage global.

**Règle de la foncière (§ 28)** : accès de 25 à 35 ans ; mensualité = prêt bancaire au taux du marché (3,32 %, 25 ans) sur le prix (travaux compris) **diminué de l'apport du capital de départ** ; le jeune renonce à la nue-propriété (le bien revient à la foncière à son décès) ; il paie la contribution sur sa résidence principale (0,25 %).

**Options** (montants avant décote 40 000 € × e^(−héritage / 80 000 €), chapitre 3) :
- **A** : 40 000 € seulement comme apport à la foncière ; rien sinon.
- **B** : au choix, 40 000 € à la foncière ou 20 000 € en argent.
- **B'** : comme B, 20 000 € en cinq versements (25-29 ans) ou **en parts à vie** (épargne bloquée, rente ou capital à la retraite).
- **C** : au choix, 40 000 € à la foncière ou 20 000 € pour une formation ou une création d'entreprise sur justificatif.
- **D** (référence) : chapitre 3, 40 000 € en cinq versements, déblocage possible pour un projet (dont l'apport à la foncière).
- « Sans » : ni capital ni foncière (contrefactuel).

## 2. Code et réutilisation

- `code/exporter_heritages.js` (node) charge **sans les modifier** `modeles/capital-de-depart/modele.js` et `continu.js` : loi log-normale des héritages reçus à vie (H2 de ce modèle), quantiles sur 200 rangs, et coût de référence 40 000 € × e^(−H/80 000 €) (13,3 / 14,7 / 16,1 Md€) → `donnees/heritages.json`.
- `code/options.py` (fonctions pures) : choix probabilisé de chaque jeune (`choix`), agrégation sur une génération (`agreger` : 200 rangs d'héritage × 10 déciles de revenu × 4 secteurs × 3 âges d'entrée), paramètres de la foncière (`params_fonciere`), transition (`transition`, `capacite_rampe`). Il importe **sans les modifier** `modeles/fonciere-usufruit/code/usufruit.py` (mensualités, mortalité, valeur d'usufruit) et `fonciere.py` (simulation sur 60 ans en mode `redevance='banque'`, qui est exactement la règle du § 28 : mensualité bancaire sur prix − apport, comptabilisée comme un prêt de l'usufruit au taux implicite). Pour un chemin d'entrées imposé (transition), `simuler_chemin` remplace la fonction `fonciere.entrants` le temps d'un appel, puis la restaure (test).
- `code/calculer.py` écrit `resultats.md` et `donnees/resultats.json` ; `tests/test_options.py` (12 tests). Les « Hypothèses H-CO1 à H-CO31 » sont au § 3. Lancer depuis la racine : `node modeles/capital-de-depart-options/code/exporter_heritages.js`, puis `python3 -I modeles/capital-de-depart-options/tests/test_options.py` et `python3 -I modeles/capital-de-depart-options/code/calculer.py` (≈ 1 min).

## 3. Hypothèses

Scénarios de **recours** : bas = faible recours (favorable aux prix, à la dette et au coût), central, haut = fort recours (défavorable). Le scénario financier de la foncière est le central de `fonciere-usufruit` (argent à 3,5 %, prix +2,5 %/an) ; sensibilité « haut » (4,7 %).

| N° | Hypothèse | bas / central / haut | Source, cote, statut |
|---|---|---|---|
| H-CO1 | Génération | 830 000 (fixe ; 780 000 à 870 000 dans `capital-de-depart`) | Eurostat demo_pjan, A, via `capital-de-depart` H1 |
| H-CO2 | Héritage reçu ou attendu : log-normale (médiane 70 000 €, P90 500 000 €), 10 % sans héritage | — | CAE, note 69, 2021, B ; `capital-de-depart` H2-H3 (⚠️ V7802) |
| H-CO3 | Revenu net mensuel individuel des 25-34 ans par décile : 900, 1 200, 1 400, 1 550, 1 750, 1 950, 2 200, 2 500, 3 000, 4 000 € | — | ⚠️ ordre de grandeur de Claude, non lu dans l'Insee (revenu salarial et chômage des jeunes) : à recaler |
| H-CO4 | Corrélation de rang héritage–revenu (copule gaussienne) | 0,3 | ⚠️ hypothèse (corrélations intergénérationnelles de rang de 0,3 à 0,4 dans la littérature, non relue ici) |
| H-CO5 | Revenu selon l'âge d'entrée : 25 ans × 0,85 ; 30 ans × 1 ; 35 ans × 1,1 | — | ⚠️ hypothèse |
| H-CO6 | Lieu de vie des jeunes réparti comme les ventes DVF 2024 : Paris 4 %, métropoles 33 %, villes moyennes 42 %, rural 21 % | — | `fonciere-usufruit/donnees/secteurs.csv` (DVF, A) ; ⚠️ la population jeune est plus urbaine que les ventes |
| H-CO7 | Logement : T3 médian du secteur ; la moitié des entrants achète en couple (0,75 contrat par personne) ; part de logement par personne = 0,75 × T3 | — | DVF 2024, A ; part en couple : ⚠️ hypothèse |
| H-CO8 | Taux d'effort maximal 35 % (mensualité + contribution), à la banque comme à la foncière | — | HCSF, décision D-HCSF-2021-7 (règle de 35 %, 25 ans), A |
| H-CO9 | Accès au crédit bancaire : solvable à 35 % avec 10 % d'apport ; apport familial ou d'épargne avec probabilité 0,15 + 0,75 × rang d'héritage (ou capital versé en argent ≥ 10 % du prix) ; refus pour précarité de 30 % (D1) à 5 % (D10), × 0,7 / 1 / 1,3 | — | ⚠️ hypothèses (F24 de la foncière : aucune statistique publique des refus) |
| H-CO10 | Part qui veut se fixer (acheter) entre 25 et 35 ans si elle le peut | 50 / 60 / 70 % | ⚠️ hypothèse ; calage : sans dispositif, 16 % d'une génération propriétaire à 35 ans dans le modèle (individus, Paris compris) |
| H-CO11 | Âge d'entrée : 25, 30, 35 ans (40 / 40 / 20 %) | — | H-FU51 |
| H-CO12 | Ce que le jeune abandonne en passant par la foncière : nue-propriété évaluée au taux net r (actualisation − hausse des prix) + prime de liberté (revendre, léguer) φ × prix | r = 3,5 / 2,5 / 1,5 % ; φ = 15 / 10 / 5 % | ⚠️ hypothèses ; part d'usufruit par `usufruit.valeur_usufruit` (table Insee) |
| H-CO13 | Effet d'appel : en A, part de ceux qui ne voulaient pas se fixer qui entrent pour ne pas perdre le capital (s'ils peuvent payer) ; moitié en C | 10 / 20 / 30 % | ⚠️ hypothèse ; c'est l'hypothèse la plus fragile du modèle |
| H-CO14 | Valeur subjective d'un euro de l'alternative : argent 1 ; cinq versements 0,85 ; parts à vie 0,6 ; formation 0,4 | — | ⚠️ hypothèse |
| H-CO15 | Recours à la formation ou création sur justificatif (C) | 25 / 40 / 55 % | ⚠️ hypothèse |
| H-CO16 | Adhérents : part de ceux qui ont accès à la banque qui choisissent la foncière par conviction | 1 / 3 / 5 % | H-FU47 |
| H-CO17 | Demande additionnelle : entrant sans accès bancaire = 1 achat de plus ; entrant qui avait accès = α (achat avancé) ; argent libre : part qui finit en apport × levier | α = 0,2 / 0,3 / 0,5 ; 15 / 30 / 50 % × 1 / 2 / 3 | H-FU28 ; `capital-de-depart` H12-H13 (⚠️ V7803) |
| H-CO18 | Effet prix borné = (contrats additionnels / ventes du secteur + demande en argent / valeur des ventes) / élasticité ; ventes 1,1 million réparties comme DVF | élasticités H-FU40 × 2 / 1 / 0,5 | H-FU40 (⚠️ non recalé) ; effet de niveau, pas une prévision |
| H-CO19 | Foncière : `fonciere.simuler`, mode `banque`, prix d'achat = prix moyen des contrats des entrants, apport moyen par contrat, âges des entrants ; montée linéaire sur 10 ans (régime) | central ; sensibilité 4,7 % | H-FU46 ; ⚠️ apport moyen au lieu de la distribution (la mensualité est linéaire en l'apport, le taux implicite ne l'est pas) |
| H-CO20 | Coût public = capital versé (apports à la foncière, argent, parts à vie, formation). La gestion de la foncière (300 € par contrat et par an, payée par l'État dans `fonciere-usufruit`) n'y est pas ajoutée | — | Les apports sont une dépense de l'État quel que soit le canal (§ 6.3 de la méthode de la foncière) |
| H-CO21 | « Argent libre » = argent versé sans condition d'usage : mesure du risque de dépense sans effet durable | — | Littérature : § 6 |
| H-CO22 | Propriétaire = accédant (banque) ou usufruitier (foncière) avant 36 ans | — | — |
| H-CO23 | Grille du § 3 des résultats : montant 30 / 40 / 50 k€ ; A, B' (parts à vie), C ; durée 25 / 30 ans ; taux bancaire, +0,5, +1 pt ; quota aucun, 15, 20, 25 % d'une génération (216 réglages) | — | — |
| H-CO24 | Contraintes de la grille : test des 50 % tenu de l'an 5 à 60 ; effet prix ≤ 5 % dans chaque secteur (central) ; coût ≤ 14,7 Md€ ; critère : part propriétaire de la moitié qui hérite le moins | — | Choix de Claude ; le plafond de 5 % est une borne politique, la frontière (4 à 8 %) est publiée |
| H-CO25 | Quota : au-delà, les entrées sont rationnées à proportion (dans chaque secteur) ; les écartés reçoivent l'alternative | — | ⚠️ une priorité aux moins dotés n'est pas modélisée |
| H-CO26 | Capacité d'entrée : bâtisseurs 3 000 par an pendant 2 ans, puis montée linéaire jusqu'au régime × (1 + surcapacité) à l'année 5, 8 ou 10 ; marge structurelle de 5 % au moins | — | H-FU44 ; ⚠️ capacité d'achat et de rénovation non sourcée |
| H-CO27 | Démarrage : à l'ouverture, une génération qui a dépassé son âge d'entrée ne réclame que pour ceux qui n'ont pas pu acheter à la banque ; les autres ont déjà acheté | — | Hypothèse ; c'est ce qui crée la « file du lancement » |
| H-CO28 | Ordre de service : les plus âgés d'abord (les plus proches de l'échéance) ou par date de demande | — | — |
| H-CO29 | Sort du droit au lancement : perdu à 36 ans (non-servis convertis pour moitié en parts à vie) ; reporté jusqu'à 40 ou 45 ans ; réservé aux générations entrantes (25 ans ou moins), les 26-35 ans recevant 50 % en parts à vie ; rattrapage des 36-40 ans | — | Options demandées par l'auteur |
| H-CO31 | Aides au logement évitées (décision de l'auteur, 09/11) : part logement du socle de revenu, 250 € par mois à qui paie un loyer (chapitre 4), supposée retirée linéairement jusqu'à 1 856 € de revenu (464 € de complément / 25 %) ; versée pendant le remboursement, plus après ; comptée seulement pour les usufruitiers qui seraient restés locataires (sans accès bancaire) ; revenu après remboursement = revenu du décile × 1,2 / 1 / 0,8 | — | `chapitres-v02/04-proteger.md` (cote B, estimations) ; repère 15,9-16,0 Md€ d'aides personnelles au logement en 2024 (DREES, `sources/recherche-logement-social.md`) ; ⚠️ forme du retrait simplifiée, aide par personne et non par ménage, retraite non distinguée. Calcul par `fonciere.simuler` (aide évitée après la durée du contrat, H-FU14) |
| H-CO30 | Mesure de l'injustice entre générations : droit réalisé = entrées de la génération / entrées d'une génération en régime, et attente moyenne ; entre secteurs : capital reçu par jeune et part propriétaire | — | Choix de Claude |

## 4. Ce que le modèle ne fait pas

- Pas de construction : l'effet prix est un effet de niveau sans réponse de l'offre au-delà de l'élasticité ; pas de dynamique annuelle des prix.
- Pas d'aides au logement (maintenues à la foncière, § 24) : elles élargiraient l'accès des bas revenus ⚠️.
- Pas de mobilité (déménagement d'un usufruitier, revente du droit) ni de défaut ; pas d'effet du dispositif sur les loyers.
- Les choix sont des règles de décision explicites, pas des comportements estimés : les parts d'une génération sont des hypothèses mises en forme, pas des résultats.
- La classification hors administrations publiques ne se réduit pas au test des 50 % (contrôle, garantie : § 6.3 de la foncière).

## 5. Classement et recommandation de Claude

Chiffres : `resultats.md` (central sauf mention).

1. **B' en parts à vie (« A avec filet »)** : accession à 35 ans 37 % (16 % sans dispositif), 100 % des jeunes reçoivent quelque chose, aucun argent libre, coût 9,4 Md€, effet prix ≤ 5,6 %. Meilleur équilibre entre accession, justice et risque.
2. **C** : 39 % d'accession pour 6,4 Md€, sans argent libre ; mais 46 % ne reçoivent rien, et la formation sur justificatif ouvre un marché d'aubaine (⚠️ non chiffré).
3. **A** : la plus forte accession (42 %) au plus bas coût (4,9 Md€), mais 74 % ne reçoivent rien : le premier décile de revenu (4 % d'accession) et Paris (0 %) sont exclus. L'effet prix est le plus fort (6,9 % au central, 16,6 % au haut) et la dette à 30 ans la plus haute (358 Md€). Son avance sur B' vient de l'effet d'appel (H-CO13) : des jeunes qui ne voulaient pas se fixer achètent pour ne pas perdre leur capital.
4. **B / B' en cinq versements** : 37 % d'accession, mais 6,3 Md€ par an d'argent libre ; le fractionnement réduit le risque sans le supprimer.
5. **D** : la plus chère (14,7 Md€), 13,6 Md€ d'argent libre, la foncière ne sert que 9 % d'une génération (pour qui obtient un prêt, la foncière n'apporte rien). Même accession que B (37 %).

**Bilan public dans le temps** (H-CO31) : les aides au logement évitées sont faibles (≈ 1 Md€ par an à l'an 60 pour A, B' ou C ; 0,3 pour D), parce que la foncière sert des jeunes assez solvables pour payer la mensualité et que la part logement du socle s'éteint vers 1 860 € de revenu ; elles ne couvrent même pas la gestion de la foncière (≈ 2 Md€ par an). Ce qui rend le dispositif « rentable » à long terme, c'est le **patrimoine** : les logements qui reviennent et les marges de la mensualité bancaire font croître le patrimoine net de la foncière de 11 (D) à 29 Md€ (A) par an à l'an 60 ; coût net à l'an 60 : −23 (A), −13 (B' parts à vie), −19 (C), −8 (B), +4 Md€ (D). C'est un gain en patrimoine, pas en trésorerie, et il disparaît si l'argent coûte 4,7 %. La niche LMNP ne peut pas être comparée : le coût du régime réel n'est pas isolé dans les documents budgétaires (seul le Censi-Bouvard l'est, 35 à 39 M€) ⚠️ V3939.

Toutes les options passent le test des 50 % au central (105 à 112 % : la mensualité bancaire contient une marge implicite), et **toutes échouent si la foncière emprunte à 4,7 %** (≈ 33 % ; sous 50 % vers 2070).

**Réglage recommandé** : la foncière par défaut, avec un filet.
- Droit d'apport de 40 000 € × e^(−H/80 000 €), utilisable de 25 à 35 ans ;
- mensualité du § 28 (taux bancaire) mais **sur 30 ans** (au lieu de 25 : l'accès du deuxième décile de revenu passe de 14 à 19 %) ⚠️ écart au § 28 à valider par l'auteur ;
- **à 36 ans, le droit non utilisé devient 50 % en parts à vie** (ni perdu, ni versé en argent) ;
- entrées plafonnées à **20 % d'une génération** (≈ 166 000 jeunes, 125 000 contrats par an), à relever si la construction suit.
- Résultats (central) : 9,3 Md€ par an (coût net à l'an 60 : −12 Md€, patrimoine compris) ; 36 % d'accession (35 % pour la moitié qui hérite le moins) ; dette 92 Md€ à 10 ans et 311 Md€ à 30 ans ; ratio 105 % ; effet prix 4,7 % (métropoles), 5,3 % (villes moyennes), jusqu'à 10,6 % au haut.

**Mise en place recommandée** : générations entrantes. Le droit s'ouvre à chaque génération qui atteint 25 ans après le lancement ; bâtisseurs 2 ans, montée sur 8 ans, capacité de régime + 10 % ; les 26-35 ans au lancement reçoivent d'emblée 50 % en parts à vie (≈ 74 Md€ sur 10 ans, soit ≈ 7 Md€ par an) ; rien pour les plus de 35 ans (rattrapage des 36-40 ans par la foncière : ≈ 5 Md€ et une file qui dure 40 ans). La file est résorbée en 9 ans, l'attente reste sous 6 mois. Les autres schémas créent une file durable : par exemple, avec le droit perdu à 36 ans et une montée sur 10 ans, les 30-35 ans du lancement n'entrent qu'à 23 % et toutes les générations suivantes attendent 4 à 5 ans pendant des décennies.

## 6. Risque de dépense sans effet durable (littérature déjà citée dans `modeles/capital-de-depart/methode.md` § 4)

Les transferts en capital peuvent avoir un effet fort puis se dissiper (Blattman, Fiala et Martinez, Ouganda : +41 % de revenu à 4 ans, rien à 9 ans ; non transposable tel quel) ; peu d'effet de la richesse sur la création d'entreprise hors du haut de la distribution (Hurst et Lusardi, 2004) ; un petit capital crée de l'épargne (Child Trust Fund, IFS ; McKay et al., 2023) ; le CAE et Banerjee et al. relativisent la crainte d'un mauvais usage. Lecture : le risque se concentre sur l'**argent libre** (B : 6,3 Md€ ; D : 13,6 Md€ par an) ; A, C et B' en parts à vie n'en versent pas. Le versement en cinq fois réduit la tentation, sans preuve chiffrée. Pour C, la formation sur justificatif présente un risque d'aubaine (organismes de formation) ⚠️ non documenté dans nos sources.
