---
titre: Chiffrage du programme du Rassemblement national pour 2027 (contre-budget du 06/10/2026 et déclarations de Marine Le Pen) : effet sur les comptes publics, comparé à notre système
date: 2026-11-08
statut: brouillon de travail ; chiffrage principal par le banc d'essai commun (modeles/banc-programmes/, relancer.py, tests unittest, programmes/rn/mesures.py) ; ordres de grandeur sous hypothèses, jamais des prédictions ; texte de la réforme des retraites non paru (annoncé le 17/11/2026) ; les économies annoncées sont bornées par les contraintes juridiques et pratiques nommées ligne par ligne ; vérifications V32000 à V32019 ; non intégré aux chapitres ; pas de jugement de valeur
---

# Chiffrage du programme du Rassemblement national pour 2027

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 08/11/2026. Conflit d'intérêts à déclarer : l'auteur du manifeste est partie prenante (candidat potentiel, programme concurrent) ; Claude est un modèle d'Anthropic ; ce dossier applique au Rassemblement national (RN) exactement la méthode appliquée à La France insoumise (`sources/chiffrage-programme-lfi-2027.md`) et à notre système. **Reproduire** : `python3 -I modeles/banc-programmes/relancer.py` (tests : `python3 -I modeles/banc-programmes/tests/test_banc.py`, 29 tests). Convention : **fait sourcé** / **estimation** (méthode dite) / **opinion** ; ⚠️ = non vérifié (`verifications.md`) ; Md€ par an, euros de 2025 constants ; régime en 2032 (premier exercice après l'élection de 2027 : 2028). Dates de consultation : 08/11/2026 pour toutes les sources. Seuls les positions et documents publics du parti et de sa candidate sont traités.

## 0. Résultat en douze lignes

1. **Ce que le RN publie (fait, cote D).** Un contre-budget 2027 de 125 mesures, présenté le 06/10/2026 par Marine Le Pen, Jordan Bardella et Jean-Philippe Tanguy : 140 Md€ d'économies nettes en 2032 par rapport à 2026, déficit sous 3 % du PIB en 2030, dette à 112 % du PIB en 2032, règle d'or constitutionnelle par référendum. L'annexe de 2027 affiche +71,6 Md€ d'amélioration nette du solde en première année (137,2 d'économies et de recettes, 69,2 de baisses d'impôts et de dépenses, 3,6 de mesures du gouvernement conservées) ; l'Institut de l'Entreprise relève 141,7 Md€ en 2031.
2. **Ce que notre banc en tire (estimation).** Effet de régime sur le solde, par rapport au droit actuel : **−32 [−61 ; 4] Md€** (médiane [centiles 10 ; 90]) : le programme ne réduit pas le déficit en médiane ; il le réduit dans 12 % des tirages ; **déficit restant en régime** (statique, avant coût des intérêts nouveaux) : **201 [165 ; 230] Md€**, soit **6,7 [5,5 ; 7,7] % du PIB** (fil de l'eau : 169 Md€, 5,7 % ; LFI : 416 [372 ; 458] Md€ ; notre système : environ 33 Md€, 1,1 %, en régime structurel).
3. **Dette** : 170 [158 ; 179] % du PIB en 2038 (fil de l'eau : 157 ; LFI : 240 ; notre système : 133) ; 276 [239 ; 306] % en 2058. Avec la relance de la littérature : 163 [153 ; 171] % en 2038.
4. **Pourquoi l'écart avec l'affichage.** Les baisses d'impôts et dépenses nouvelles (99 Md€ en médiane, contre 77 annoncés) sont des coûts certains une fois votés (l'Institut de l'Entreprise compte 102,8 Md€ de baisses d'impôts et de dépenses en 2031, nos lignes ne reprennent que les montants de 2027 sauf pour les retraites) ; les économies et recettes annoncées (199 Md€ en somme des annonces, hors 21,7 Md€ d'écritures sans effet sur le déficit) ne sont réalisables qu'en partie : notre médiane est de 41 Md€, avec comme plafond l'annonce du RN elle-même.
5. **Mesures les plus lourdes (coût, régime)** : retour aux règles de retraite d'avant 2023 (24 Md€, contre 9,5 annoncés), suppression de la CFE, de la CVAE et de la C3S (17), TVA à 5,5 % sur l'énergie (12), autres baisses d'impôts et dépenses.
6. **Économies annoncées et ce qui en reste après contraintes juridiques** : immigration (prestations, AME, asile, étudiants ; hors taxes d'embauche et de transferts, comptées en recettes nouvelles) 22,8 annoncés → 5,1 Md€ ; Union européenne 15,3 → 1,1 ; Sécurité sociale 47,0 → 12,5 ; État et opérateurs 34,5 → 8,5 ; collectivités 10,4 → 2,9 ; recettes nouvelles (TVA à la source, IS sur le chiffre d'affaires, taxes) 50,2 → 6,5 ; énergie 15,0 → 1,6 ; 21,7 Md€ d'écritures sans effet sur le déficit (certificats d'énergie, bons du Trésor, retours dynamiques) → 0.
7. **Recoupement** : l'Institut de l'Entreprise (cote C, financé par des entreprises) trouve **7,5 Md€** d'amélioration nette en 2031 (de −25 à +50), en retenant à 50 % les lignes sans mode opératoire et à 0 les lignes juridiquement fragiles : notre médiane est plus basse (retraites, lecture plus sévère des lignes sans mode opératoire), son extrémité haute est du même ordre que la sienne.
8. **Limites principales** : le texte de la réforme des retraites est annoncé pour le 17/11/2026 ; le document du parti ne fournit que les montants de 2027 (les valeurs de 2031 sont connues par le recalcul d'un tiers) ; les médianes des économies sont des jugements écrits ligne par ligne, contestables ; aucun chiffrage indépendant de la Cour des comptes, de l'OFCE, de Fipeco ou de l'Institut Montaigne sur ce contre-budget n'a été trouvé.

Tableau de résultats complet, avec LFI, notre système et le fil de l'eau : `modeles/banc-programmes/resultats.md` § 1.

| (statique ; médiane [intervalle à 80 %]) | Rassemblement national | LFI | Notre système | Fil de l'eau |
|---|---|---|---|---|
| Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€) | −32 [−61 ; 4] | −247 [−289 ; −203] | 115 [59 ; 172] (2038) ; 139 [80 ; 200] (2041 et après) | 0 |
| Déficit restant en régime, statique (Md€ de 2025) | 201 [165 ; 230] | 416 [372 ; 458] | 54 [−3 ; 110] (2038) ; 30 [−31 ; 89] (2041 et après) | 169 |
| Déficit restant en régime, statique (% du PIB de 2025) | 6,7 [5,5 ; 7,7] | 13,9 [12,5 ; 15,3] | 1,8 [−0,1 ; 3,7] (2038) ; 1,0 [−1,0 ; 3,0] (2041 et après) | 5,7 |
| Prélèvements obligatoires (% du PIB ; 42,7 en 2024) | 45,0 [44,0 ; 46,3] | 44,8 [44,0 ; 45,7] | 52,2 [50,7 ; 53,7] | 42,7 |
| Déficit public 2038 (% du PIB, intérêts compris) | 9,6 [8,1 ; 10,8] | 18,9 [17,0 ; 20,7] | 3,7 [1,5 ; 5,9] | 8,2 |
| Dette publique 2038 (% du PIB) | 170 [158 ; 179] | 240 [225 ; 254] | 133 [119 ; 146] | 157,1 |
| Dette publique 2058 (% du PIB) | 276 [239 ; 306] | 503 [458 ; 548] | 110 [48 ; 169] | 240,2 |

Note sur la présentation : la première ligne est une réduction (+) ou une aggravation (−) du déficit par rapport au droit actuel ; pour notre système, médiane et intervalle à 80 % viennent du même Monte-Carlo que pour les deux autres programmes (`resultats.md` § 6 ter ; l'intervalle est sous-estimé, le socle hérité de l'architecture v5 étant fixé au central) ; la valeur centrale du modèle est de 113 Md€ en 2038 (132,6 % de dette) et de 136 Md€ en régime structurel (2041 et après). Le saut de 25 Md€ entre 2040 et 2041 est la fin d'un report d'encaissement de douze ans (hypothèse H537, `resultats.md` § 1, V32012, V32018) ; la même note explique l'écart avec les 132,7 Md€ de `sources/decomposition-prelevements-0811.md` (année, unité, périmètre ; pas une erreur de calcul).

## 1. Ce que le Rassemblement national publie lui-même

**Documents lus** (date, lien, cote) :

| Document | Contenu utile | Cote et conflit d'intérêts |
|---|---|---|
| [Groupe RN à l'Assemblée nationale, « Contre-budget 2027 », dossier, octobre 2026](https://nicolasdragon.com/wp-content/uploads/2026/10/grn-contre-budget-2027-dossier.pdf) (copie hébergée sur le site d'un député RN, 16 p., lue en entier ; le site rassemblementnational.fr renvoie une redirection au chargement automatique : non lu, aucun contournement ; copie conservée dans `sources/donnees/rn/`) | héritage (déficit 2026 de 5,4 %, dette de 119,3 %) ; 125 mesures ligne à ligne (annexe, montants de 2027 sur la base du PLF/PLFSS 2027) ; mesures du gouvernement retenues (3,6 Md€) et rejetées (24,5 Md€) ; déficit 2027 annoncé de 116 Md€ (3,7 %) contre 156 Md€ pour le budget du gouvernement | D : auteur = le programme |
| [Public Sénat, 06/10/2026](https://www.publicsenat.fr/actualites/politique/140-milliards-deuros-deconomies-dici-2032-leffort-radical-propose-par-marine-le-pen-pour-redresser-les-f) | 140 Md€ d'ici 2032 ; dette de 121 % en 2027 à 112 % en 2032 ; règle d'or par référendum ; immigration 15 puis 29 Md€ ; retraites 15 à 20 Md€ ; contribution UE 9 Md€ ; agences 3,4 Md€ (contre 0,5 Md€ pour la commission d'enquête du Sénat) | C : presse (chaîne publique) |
| [Acteurs publics, octobre 2026](https://acteurspublics.fr/articles/la-reforme-de-letat-et-des-collectivites-au-coeur-des-economies-programmees-par-le-rn/) | valeurs 2031 des économies de l'État et des collectivités | C : presse spécialisée |
| [Journal du Net, 28/08/2026](https://www.journaldunet.com/business/action-publique/1554113-marine-le-pen-maintient-le-retour-a-la-retraite-a-62-ans/) et [franceinfo, 14/10/2026](https://www.franceinfo.fr/elections/presidentielle/marine-le-pen-presentera-de-maniere-extremement-precise-sa-reforme-des-retraites-le-17-novembre_8237821.html) | retraites : 62 ans (60 pour un premier emploi significatif à 20 ans ou moins), 40 à 42 annuités, « 9 milliards en rythme de croisière », réforme précise annoncée pour le 17 novembre ; exonération de cotisations retraite et chômage des plus âgés | C : presse |
| [Institut de l'Entreprise, 06/10/2026](https://www.institut-entreprise.fr/wp-content/uploads/2026/10/Analyse-primaire-contre-budget-RN-Note-de-contexte-IDEP.pdf) (lue en entier, 9 p.) | valeurs 2027 et 2031 de l'annexe du RN ; classement de 125 mesures ; recalcul ligne à ligne ; chiffre de 7,5 Md€ | C : think tank financé par des entreprises ; méthode publiée |

**Programme présidentiel.** Le texte du programme présidentiel n'est pas paru à la date de ce dossier (la réforme des retraites est annoncée pour le 17/11/2026). Le contre-budget 2027 est un document d'opposition sur le PLF 2027 ; il contient des « mesures sectorielles du programme présidentiel » (3,0 Md€ non détaillés) et une « réforme des retraites de Marine Le Pen » (1,9 Md€ en 2027). À défaut du programme complet, les positions de la candidate (déclarée en juillet 2026 selon un résumé de moteur de recherche) sont lues dans les déclarations d'août et d'octobre 2026. Le programme législatif de 2024 et celui de la présidentielle de 2022 ne sont pas utilisés : le contre-budget d'octobre 2026 est plus récent et plus détaillé.

**Mesures à effet budgétaire (annexe du contre-budget, montants de 2027 sauf mention).** Citations courtes ; chaque ligne est dans `modeles/banc-programmes/programmes/rn/mesures.py` avec ses hypothèses cotées.

*Baisses d'impôts et dépenses nouvelles* (annoncé en Md€ ; effet médian dans le banc, + améliore) :

| N° | Mesure | Citation | Annoncé | Effet |
|---|---|---|---|---|
| T01 | TVA à 5,5 % sur les énergies (gaz, électricité, carburants, bois, fioul) | « « Baisse de la TVA sur les énergies (gaz, électricité, carburants, bois, fioul) 12,200 » (annexe) » | 12,2 | −11,5 [−13,5 ; −9,0] |
| T02 | TVA à 0 % sur 100 produits de première nécessité | « « Suppression de la TVA sur 100 produits de première nécessité 3,500 » » | 3,5 | −4,1 [−5,1 ; −3,5] |
| T03 | Suppression de la CFE (8,1), de la CVAE (3,7) et de la C3S (5,3) | « « Baisse de l'impôt de production : suppression de la CFE 8,100 ; de la CVAE 3,700 ; de la C3S 5,300 » » | 17,1 | −17,3 [−18,0 ; −16,9] |
| T04 | Suramortissement industriel et agricole (2,1), pacte Dutreil modifié (1,75), octroi de mer (1,8), autres taxes (0,8) | « « suramortissement (robotisation et numérique) 2,100 ; pacte Dutreil 1,750 ; réforme de l'octroi de mer 1,800 » » | 6,5 | −6,7 [−7,1 ; −6,4] |
| T05 | Retour de la TICPE au niveau de 2017 | « « Retour de la TICPE au niveau de 2017 3,900 » » | 3,9 | −4,0 [−4,3 ; −3,8] |
| T06 | Retour du prélèvement forfaitaire unique à 30 % (annulation de la hausse de 1,4 point) | « « Revenir sur la hausse du taux PFU de 1,4 point pour le fixer à 30 % 1,500 » » | 1,5 | −1,5 [−1,6 ; −1,5] |
| T07 | Demi-part pour veufs et veuves, prime d'activité étudiante, successions (immobilier jusqu'à 300 k€) et donations | « « demi-part pour les veuves et veufs 1,000 ; prime d'activité étudiante 0,600 ; successions 1,200 ; donations 0,500 » » | 3,3 | −3,4 [−3,6 ; −3,2] |
| T08 | Exonération d'impôt sur le revenu des actifs de moins de 30 ans jusqu'à 4 Smic | « « Exonérer d'IR tous les jeunes actifs jusqu'à 30 ans jusqu'à 4 SMIC 2,000 » » | 2,0 | −3,4 [−4,6 ; −2,5] |
| D01 | Retraite : âge légal à 62 ans, durée de 42 annuités, départ à 60 ans pour les entrées précoces (réforme de Marine Le Pen) | « « Je ne promets pas à tout le monde de partir à la retraite pleine à 60 ans » ; « quelque 9 milliards d'euros en rythme de croisière » (JDN, 28/08/2026) » | 9,5 | −24,1 [−31,1 ; −18,4] |
| D02 | Exonération de cotisations retraite et chômage des salariés les plus âgés (annonce du 27/08/2026, non chiffrée dans le contre-budget) | « « les salariés les plus âgés continueraient à travailler sans cotisations retraite ni chômage » (JDN, 28/08/2026) » | 0,0 | −4,6 [−6,5 ; −2,9] |
| D03 | Part fiscale pleine dès le deuxième enfant ; prêt jeunes ménages transformé en subvention au troisième enfant | « « part fiscale pleine dès le 2ème enfant 3,500 ; subvention à la naissance du 3ème enfant 1,600 » » | 5,1 | −5,1 [−5,9 ; −4,2] |
| D04 | Remboursement à 100 % des soins dentaires (1,4), congé de proche aidant (2,0), AAH au-dessus du seuil de pauvreté (0,95), cumul emploi-retraite des soignants (0,2) | « « Rembourser à hauteur de 100 % de la base de remboursement de la Sécurité sociale des soins dentaires 1,400 ; Revaloriser le congé de proche aidant 2,000 » » | 4,5 | −5,2 [−6,3 ; −4,5] |
| D05 | 30 000 places de prison (1,0), permis de conduire gratuit pour les jeunes (0,7), recherche (1,8), outre-mer (0,6), fonds vert (0,1), SDIS (0,4), mesures sectorielles du programme présidentiel (3,0) | « « Construction de 30 000 places de prison 1,000 ; permis de conduire gratuit 0,700 ; mesures sectorielles du programme présidentiel 3,000 » » | 7,6 | −8,5 [−10,1 ; −7,4] |

*Recettes nouvelles et économies annoncées* :

| N° | Mesure | Citation | Annoncé (régime) | Effet |
|---|---|---|---|---|
| U01 | Baisse unilatérale de la contribution de la France au budget de l'Union européenne | « « Baisse de la contribution de la France à l'Union européenne 8,897 » (13,1 Md€ en 2031 avec les droits de douane) » | 13,1 | 0,9 [0,2 ; 7,3] |
| U02 | Restitution à la France de sa part des droits de douane collectés par l'UE | « « Rendre à la France sa part des droits de douane collectés par l'UE 2,200 » » | 2,2 | 0,2 [0,0 ; 1,8] |
| I01 | Prestations de solidarité réservées aux étrangers ayant travaillé au moins cinq ans (équivalents temps plein) | « « Réserver les prestations de solidarité aux étrangers ayant au moins 5 ans ETP travaillés en France 7,500 » (12,2 Md€ en 2031) » | 12,2 | 2,0 [0,4 ; 10,0] |
| I02 | Prestations familiales réservées aux foyers dont un parent est français | « « Allocations familiales réservées aux foyers dont un parent est français » (5,9 Md€ en 2031, Institut de l'Entreprise ; la restriction aux étrangers extra-UE d » | 5,9 | 1,0 [0,2 ; 4,9] |
| I03 | Aide médicale d'État remplacée par une aide médicale d'urgence (AME → AMU) | « « Remplacement de l'AME par l'AMU 1,100 » » | 1,1 | 0,5 [0,1 ; 1,0] |
| I04 | Asile, visa pour soins, départs, frais de scolarité des étudiants étrangers, effet indirect sur l'insécurité | « « Réformer la politique de l'asile 0,900 ; Suppression du visa pour soins 1,000 ; Hausse des frais de scolarité des étudiants étrangers 1,100 » » | 3,6 | 1,6 [0,7 ; 3,2] |
| F06 | Prélèvement de la TVA à la source (retenue à la source entre entreprises) | « « Mise en place du prélèvement de la TVA à la source » (annexe 2027 : −0,100 ; 18,0 Md€ en 2031 selon l'Institut de l'Entreprise) » | 18,0 | 1,5 [0,3 ; 14,6] |
| F05 | Autorité de la concurrence et cartels des marchés publics | « « Renforcer l'Autorité de la concurrence… 1,200 ; Réforme du cartel des marchés publics 1,200 » » | 7,0 | 0,8 [0,2 ; 5,7] |
| F03 | Impôt sur les sociétés assis en partie sur le chiffre d'affaires (mécanisme de correction) | « « Mécanisme de correction de l'impôt sur les sociétés assis sur le chiffre d'affaires et non sur le bénéfice 3,750 » » | 7,5 | 1,1 [0,2 ; 6,2] |
| F01 | Taxe sur les rachats d'actions | « « Taxe sur les rachats d'actions 11,352 » (2027) ; 0,34 Md€ par an ensuite (annexe, via l'Institut de l'Entreprise) » | 0,3 | 0,1 [0,0 ; 0,3] |
| F02 | Impôt sur la fortune financière (IFF) en remplacement de l'IFI | « « IFF en remplacement de l'IFI 5,000 » » | 5,0 | −0,5 [−3,9 ; 3,8] |
| F08 | Taxe de 1 000 € par an à l'embauche d'un salarié extra-européen | « « Taxe de 1000 €/an à l'embauche d'un extra-européen 1,000 » » | 1,0 | 0,2 [0,0 ; 0,8] |
| F09 | Taxation à 14 % des transferts d'argent vers les pays tiers | « « Taxation à 14 % des transferts d'argent vers les pays tiers 1,920 » » | 1,9 | 0,6 [0,1 ; 1,6] |
| A01 | Suppression et réinternalisation des agences et opérateurs | « « Suppressions et réinternalisations d'agences et d'opérateurs 3,400 » (plus de 10 Md€ en 2031) » | 10,1 | 1,5 [0,7 ; 8,3] |
| A02 | Aide publique au développement et action extérieure (2,1), subventions aux associations hors intérêt général (2,0), train de vie des institutions (0,54) | « « Rationalisation de l'Aide publique au développement… 2,100 ; Baisser les subventions de l'Etat aux associations ne relevant pas de l'intérêt général 2,000 ; B » | 4,6 | 3,0 [1,6 ; 4,3] |
| A03 | Logement social et aides au logement (3,2 + 1,0), chèques apprentissage (1,6), parc immobilier de l'État (1,0 ; 5,1 en 2031), autres (audiovisuel public, presse, politique de la ville, France Compétences : 1,9) | « « Economies sur la politique de logement social - dont la fin d'exonération de TF sur les bailleurs sociaux 3,200 ; Meilleure gestion du parc immobilier de l'Et » | 12,8 | 3,5 [1,5 ; 11,0] |
| A04 | Transferts entre administrations : écrêtement de la TVA des collectivités (3,4), cotisation CNRACL (1,0 ; 3,2 en 2031), FCTVA (0,4) | « « Écrêtement puis rebudgétisation de la TVA transférée aux collectivités (régions et EPCI) 3,400 ; hausse d'un point par an de la cotisation employeur de la FPT » | 7,0 | 0,5 [0,1 ; 5,6] |
| K01 | Effectifs locaux, 35 heures, compétences strictes, suppression des EPCI et des métropoles | « « Ajustement des effectifs… 0,800 ; Application des 35 h dans la fonction publique territoriale 0,500 ; Suppression des EPCI et des métropoles −0,250 » (8,4 Md€ » | 8,4 | 2,4 [0,9 ; 7,2] |
| K02 | Baisse des dépenses des collectivités vers les associations hors intérêt général | « « Baisser les dépenses des collectivités à destination des associations ne relevant pas de l'intérêt général 2,000 » » | 2,0 | 0,5 [0,1 ; 1,7] |
| H01 | Coûts hospitaliers et parcours de soins | « « Réduire les coûts hospitaliers et fluidifier les parcours (mutualisation des achats, protocoles de prévention, hospitalisations évitables, etc.) 3,210 » (8,3  » | 8,3 | 2,0 [0,8 ; 7,1] |
| H02 | Lutte contre les dépenses indues et le travail dissimulé | « « Lutter contre les dépenses indues (carte vitale biométrique, juste prescription, contrôle automatisé des factures avant paiement…) 2,200 ; travail dissimulé 0 » | 9,5 | 1,5 [0,5 ; 7,9] |
| H03 | Rationalisation des affections de longue durée et arrêts longs | « « Rationaliser les ALD (arrêts maladie de longue durée et affections de longue durée) 3,000 » » | 3,0 | 1,0 [0,2 ; 2,6] |
| H04 | « Réparation du système de retraite actuel » (corrections de mesures « injustes ou inefficaces ») | « « Mettre en œuvre les mesures de réparation du système de retraite actuel 3,000 » ; « 15 à 20 milliards d'économies » (Marine Le Pen, octobre 2026) » | 15,0 | 3,0 [0,6 ; 12,6] |
| H05 | Systèmes d'information et gouvernance de la Sécurité sociale (ASU, rapport Mélin), fusion Urssaf-DGFiP | « « Rationaliser les systèmes d'information et de la gouvernance de la Sécurité sociale (rapport Mélin) et mettre en place l'ASU 2,000 » » | 2,3 | 1,0 [0,4 ; 2,0] |
| H06 | Autres économies de protection sociale (kiné en accès direct, médicaments à l'unité, imagerie, biologie, cartes vitales, APA, AAH, rupture conventionnelle, pointage France Travail, mécénat…) | « « Généraliser la délivrance à l'unité des médicaments 0,850 ; Limiter à une rupture conventionnelle tous les 10 ans 0,900 ; Supprimer le passage obligé par le m » | 8,9 | 4,0 [2,4 ; 7,9] |
| G01 | Prix national de l'électricité : suppression des tarifs préférentiels pour les énergies intermittentes | « « Création d'un prix national de l'électricité 5,600 » ; « Suppression des tarifs préférentiels pour les énergies intermittentes » (9,3 Md€ en 2031) » | 9,3 | 0,8 [0,2 ; 7,6] |
| G02 | Dividendes d'EDF (exportation du surplus d'électricité, 3,7), TURPE (2,0), redevance sur le marché historique (0,8, voir F07) | « « Exporter en Europe le surplus de production d'électricité (via dividendes EDF) 3,700 ; Économies sur le TURPE 2,000 » » | 5,7 | 0,8 [0,2 ; 4,7] |
| G03 | Écritures sans effet sur le déficit : rebudgétisation des certificats d'économie d'énergie (8,0) et de production de biogaz (1,3), bons du Trésor à intérêt précompté (4,2) | « « Rebudgétisation des certificats d'économie d'énergie 8,000 ; Réforme de la gestion des bons du Trésor (BTF) à taux fixe et intérêt précompté 4,200 » » | 13,5 | 0,0 [0,0 ; 0,0] |
| G04 | Retours dynamiques comptés dans l'annexe : retour d'IS (4,3), retour de TVA (2,6), économie sur le coût de la dette (1,3) | « « Retour d'IS lié à la baisse des impôts de production 4,275 ; Retour de TVA lié à la baisse des « dépenses contraintes » 2,640 ; Economie sur le coût de la det » | 8,2 | 0,0 [0,0 ; 0,0] |
| G05 | Réforme de MaPrimeRénov' (« 100 % Rénov' ») et plan « 100 % Clim' » : solde annoncé | « « Remplacement de MaPrimeRenov par le 100 % Renov' 5,100 ; Plan 100% Clim' 0,840 » » | 5,9 | 1,0 [0,2 ; 4,9] |
| R30 | Mesures du PLF/PLFSS 2027 du gouvernement conservées par le RN | « « Mesures du Gouvernement retenues (impact net sur le solde des articles PLF / PLFSS 2027 soutenus par le groupe) 3,616 » » | 3,6 | 3,0 [2,2 ; 3,5] |

**Ce que le RN ne publie pas** : le détail de la réforme des retraites ; les valeurs de 2028 à 2031 mesure par mesure (seules celles de l'annexe de 2027 sont lues ; les valeurs de 2031 viennent du recalcul de l'Institut de l'Entreprise) ; un chiffrage des 120 taxes supprimées, de la baisse du nombre d'agents, des « mesures sectorielles » ; l'hypothèse de croissance en détail (1,8 % par an selon la presse ; 2,8 points de croissance supplémentaire sur cinq ans pour 0,5 point d'effet récessif des économies, selon l'Institut de l'Entreprise).

## 2. Méthode

Même banc que pour LFI et notre système (README et `resultats.md` du banc) : mêmes modèles, même dette de départ (3 460,5 Md€ fin 2025, Insee), même macro, même chaîne de dette ; Monte-Carlo de 10 000 tirages (graine 20261108) ; deux facteurs de corrélation (comportement, dérive des coûts) ; la relance est présentée à part. Branchements sur nos modèles :

1. **Retraites** (D01) : `modeles/retraites/age_libre.js` : retour aux règles d'avant 2023 (âge légal 62 ans, 42 annuités, départ à 60 ans pour les entrées précoces) = âge effectif moyen de 62,2 à 63,2 ans (médiane 62,8) contre 63,8 dans le modèle en 2032 ; coût de la réforme : voir § 3.
2. **Impôt sur le revenu** (T08, exonération des moins de 30 ans jusqu'à 4 Smic) : OpenFisca-France 176.1.10, IR d'un salarié seul par salaire (`rn_openfisca.py`), salaires lognormaux, effectif de 2,2 à 3,8 millions d'ETP (hypothèse ⚠️).
3. **Patrimoine** (F02, impôt sur la fortune financière à la place de l'IFI) : module d'ISF de `modeles/systeme-ideal/grandes_fortunes_0511.js` appliqué à la part financière (40 à 60 %), net de l'IFI supprimé.
4. **TVA** (T01, T02) : base de consommation des ménages (SDES) x écart de taux ; contrainte de la directive TVA nommée ; aucun modèle du dépôt ne chiffre encore la TVA par produit (limite).
5. **Économies annoncées** (immigration, Union européenne, fraude, « train de vie », Sécurité sociale, État, collectivités, énergie) : loi `med` (support bas-haut, **médiane = notre estimation réalisable, borne haute = l'annonce du RN**) ; la contrainte juridique ou pratique est nommée dans le champ `contrainte` de chaque ligne. Ces médianes sont des jugements, pas des mesures : elles sont écrites noir sur blanc ligne par ligne pour être contestées.
6. **Écritures sans effet sur le déficit** (G03, G04) : valeur zéro avec la raison écrite (certificats d'énergie, bons du Trésor à intérêt précompté en droits constatés, retours dynamiques déjà dans la chaîne de dette).

## 3. Résultats

**Par thème** (régime, Md€ par an ; + améliore le solde ; somme de médianes) :

| Thème | Annoncé par le RN | Notre estimation : médiane [centiles 10 ; 90] |
|---|---|---|
| Baisses d'impôts | −50,0 | −51,9 [−57,7 ; −46,9] |
| Retraites | −9,5 | −28,7 [−37,6 ; −21,3] |
| Familles | −5,1 | −5,1 [−5,9 ; −4,2] |
| Famille et santé | −4,5 | −5,2 [−6,3 ; −4,5] |
| Sécurité et divers | −7,6 | −8,5 [−10,1 ; −7,4] |
| Recettes nouvelles | 50,2 | 6,5 [−2,1 ; 41,2] |
| Immigration | 22,8 | 5,1 [1,4 ; 19,1] |
| Union européenne | 15,3 | 1,1 [0,2 ; 9,1] |
| État et opérateurs | 34,5 | 8,5 [3,8 ; 29,2] |
| Collectivités | 10,4 | 2,9 [1,0 ; 8,9] |
| Sécurité sociale | 47,0 | 12,5 [5,0 ; 40,1] |
| Énergie | 15,0 | 1,6 [0,3 ; 12,3] |
| Sans effet sur le déficit | 21,7 | 0,0 [0,0 ; 0,0] |
| Mesures du PLF retenues | 3,6 | 3,0 [2,2 ; 3,5] |

**Mesures les plus lourdes.** (1) *Retraites* : la réforme est chiffrée à 9,5 Md€ en 2031 par le RN (9 Md€ « en rythme de croisière » selon Marine Le Pen) ; notre modèle donne 24 Md€ (de 18 à 31) pour un écart d'âge effectif de 0,6 à 1,6 an par rapport à la loi de 2023 : l'abrogation de la réforme de 2023 économisait environ 18 Md€ en 2030 selon le gouvernement et le COR (⚠️ cité de mémoire, V32010) et l'Institut Montaigne chiffrait environ 35 Md€ en 2024 pour une version antérieure du programme du RN. L'exonération de cotisations des seniors annoncée en août (D02, 4,6 Md€) n'est pas dans l'annexe. (2) *Impôts de production* : 17 Md€, coût certain. (3) *TVA à 5,5 % sur l'énergie* : 12 Md€ ; le coût monte avec les prix de l'énergie et, si le droit de l'UE interdit un taux réduit sur les carburants et le fioul (⚠️ V32001), la part légalement réalisable tomberait vers 7 Md€.

**Économies annoncées : annoncé, plafond juridique ou pratique, médiane.**

| Poste | Annoncé (régime) | Contrainte principale | Médiane retenue |
|---|---|---|---|
| Union européenne : baisse unilatérale de la contribution | 13,1 (8,9 en 2027) | traités : ressources propres fixées à l'unanimité et ratifiées par chaque État (art. 311 TFUE) ; manquement | 0,9 [0,2 ; 7,3] |
| Immigration : prestations réservées (5 ans de travail) | 12,2 (7,5 en 2027) | Constitution (décision 2024-6 RIP, condition de 5 ans de résidence jugée disproportionnée), CEDH, directive 2003/109/CE (CJUE 2024) | 2,0 [0,4 ; 10,0] |
| Immigration : prestations familiales (un parent français) | 5,9 | égalité, CEDH, directive 2003/109/CE | 1,0 [0,2 ; 4,9] |
| Fraude : TVA prélevée à la source | 18,0 (2031) | écart total de TVA de 12 Md€ (Commission européenne, 2023) ; dérogation à la directive TVA à l'unanimité | 1,5 [0,3 ; 14,6] |
| Sécurité sociale : « réparation » des retraites | 15,0 (3,0 en 2027) | aucune mesure décrite | 3,0 [0,6 ; 12,6] |
| État : agences et opérateurs | 10,1 (3,4 en 2027) | commission d'enquête du Sénat : environ 0,5 Md€ ; universités = opérateurs | 1,5 [0,7 ; 8,3] |
| Énergie : prix national de l'électricité | 9,3 (5,6 en 2027) | contrats d'achat en cours (rétroactivité) | 0,8 [0,2 ; 7,6] |
| Collectivités : effectifs, 35 heures, EPCI | 8,4 | libre administration (art. 72 et 72-2) | 2,4 [0,9 ; 7,2] |
| Écritures sans effet sur le déficit | 21,7 | règles de la comptabilité nationale | 0 |

**Fraude sociale et fiscale, « train de vie de l'État »** : la fraude est chiffrée par le RN en 2027 à 4,85 Md€ (autorité de la concurrence, impôt sur les sociétés assis sur le chiffre d'affaires) et 3,2 Md€ de lutte contre les dépenses indues et le travail dissimulé ; le « train de vie » (Élysée, Assemblée nationale, Sénat, CESE) à 0,54 Md€ : les assemblées parlementaires votent elles-mêmes leurs crédits (autonomie financière, ⚠️ V32014), ce que le gouvernement ne peut pas réduire seul.

**Relance.** Avec les multiplicateurs communs (Ramey 2019 et hypothèses, `resultats.md` § 2), le solde de régime devient −15 [−39 ; 14] Md€ et la dette de 2038 163 [153 ; 171] % du PIB. L'annexe du RN suppose une asymétrie (1 € de baisse d'impôt rapporte environ 1 € d'activité, 1 € d'économie en coûte une dizaine de centimes) que la littérature ne valide pas selon l'Institut de l'Entreprise ; nous ne retenons pas cette asymétrie.

## 4. Chiffrages publics existants et leur orientation

| Source | Objet | Chiffre | Cote et orientation |
|---|---|---|---|
| Institut de l'Entreprise, 06/10/2026 | contre-budget 2027, 125 mesures | affiché 71,6 (2027) et 141,7 (2031) ; recalcul : 69,3 et 140,3 avant correction ; **crédible : 2,9 (2027) et 7,5 Md€ (2031), de −25 à +50** ; déficit 5,9 % en 2027 et 6,5 % en 2031 (RN : 3,7 et 2,3) ; 80 % du financement brut en catégories B, C ou D | C : think tank financé par des entreprises, tend à insister sur les risques pour les entreprises ; classement et hypothèses publiés |
| Gouvernement (Roland Lescure, Édouard Philippe), relayés par [Euronews](https://fr.euronews.com/2026/10/07/france-le-gouvernement-tire-a-boulets-rouges-sur-le-contre-budget-de-marine-le-pen) | contre-budget | hypothèse de croissance de 1,8 % « bien au-dessus » des prévisions ; mesures sur l'immigration jugées inconstitutionnelles | D-C : acteurs politiques adverses ; non lus en primaire |
| Sénat (commission d'enquête sur les agences), via Public Sénat et l'Institut de l'Entreprise | agences et opérateurs | environ 0,5 Md€ d'économies (contre 3,4 puis 10,1 annoncés) | B-C : rapport parlementaire relayé |
| Localtis (Banque des Territoires), 15/10/2026 | contribution UE | prélèvement de 30,9 Md€ en 2027 ; contribution nette d'environ 9,5 Md€ ; budget 2028-2034 : environ 35 Md€ par an | B : groupe Caisse des dépôts |
| Institut Montaigne (cité par le Journal du Net, 28/08/2026) | retraites : version 2024 du programme | environ 35 Md€ | C : think tank à financements privés ; ancienne version |
| Contrepoints (billet de Nicolas Lecaussin), octobre 2026 | programme et contre-budget | « la moitié du chemin reste à chiffrer » ; le RN « a fixé un cap et publie des chiffres, ce qui est à son crédit » | C-D : auteur d'orientation libérale, site libéral ; billet d'opinion ; s'appuie sur la version 2026 du contre-budget |
| Conseil constitutionnel (2024-6 RIP) et CJUE (C-112/22, C-223/22), via billet de Me Éric Landot, 03/08/2024 | prestations sociales des étrangers | cinq ans de résidence (30 mois d'activité) : atteinte disproportionnée ; la CJUE admet 5 ans, refuse 10 ans | A pour les décisions (non relues), C pour le billet |

**Non trouvé** (à ne pas supposer) : chiffrage de la Cour des comptes, de l'OFCE, de Fipeco, de l'Institut Montaigne ou de l'IFRAP sur le contre-budget d'octobre 2026 ; étude indépendante du coût net de l'immigration pour les finances publiques à jour (notre chapitre 9 cite le CEPII : de −0,5 à +0,5 point de PIB selon les hypothèses).

**Recoupement des ordres de grandeur.** Le recalcul de l'Institut de l'Entreprise (7,5 Md€ d'amélioration en 2031) et le nôtre (−32 [−61 ; 4] Md€ de médiane, p90 à 4) concordent sur ce qui compte : l'affichage de 140 Md€ ne tient qu'à condition que presque toutes les économies annoncées se réalisent à leur montant plein, et le chiffrage de la réforme des retraites (9,5 Md€) est le plus bas des estimations disponibles. Ils divergent sur la proportion à retenir des lignes sans mode opératoire (50 % pour l'Institut, 20 à 45 % ici) et sur le coût des retraites.

## 5. Limites

- Les valeurs de 2031 de l'annexe ne sont lues que par le recalcul de l'Institut de l'Entreprise (diapositives 24 à 26 du dossier de presse non retrouvées en ligne) ; les montants lus par nous sont ceux de 2027.
- Les médianes des économies annoncées sont des jugements ; la loi `med` en fait une médiane et non un mode ; la somme de médianes (−58 Md€ pour tout le programme) n'est pas la médiane de la somme (−32 Md€).
- Aucun modèle du dépôt ne chiffre la TVA par produit, la fraude ou l'immigration : ces lignes sont des ordres de grandeur sourcés ou marqués ⚠️.
- Impôt sur le revenu : foyers types de salariés seuls, effectif et salaires des moins de 30 ans en hypothèse.
- Le texte de la réforme des retraites (17/11/2026) peut changer la ligne la plus lourde.
- Les effets d'activité d'une baisse des impôts de production (investissement) ne sont comptés que par le multiplicateur commun.
- Aucune de ces lignes n'est un jugement de valeur sur les objectifs du programme.

## 6. Carte des convergences et des divergences avec notre manifeste

Catégories : **(1) accord** ; **(2) rapprochement** (à peu près la même chose) ; **(3) même fond, méthode différente** ; **(4) divergence nette**, ou **absence de position équivalente** (l'absence d'une mesure dans un texte n'est pas une opposition). Références : contre-budget du RN (§ 1) ; manifeste : `chapitres-v02/`. Lecture limitée aux documents cités ; elle ne dit rien de ce qu'ils ne traitent pas.

| Thème | Sujet | Cat. | RN | Manifeste | Réf. |
|---|---|---|---|---|---|
| Fiscalité | Impôts de production (CFE, CVAE, C3S) | 2 | suppression : 17,1 Md€ (annexe) | une partie des impôts de production disparaît dans la bascule des collectivités (bascule neutre) ; IS conservé | ch. 13 |
| Fiscalité | TVA sur l'énergie | 4 | 5,5 % sur gaz, électricité, carburants, bois, fioul : 12,2 Md€ | TVA à trois taux (5, 10, 20 %) ; « un prix calibré sur le dommage » plutôt qu'une baisse sur ce qui pollue | ch. 2 et 3 |
| Fiscalité | TVA sur les produits de première nécessité | 3 | taux zéro sur 100 produits : 3,5 Md€ | alimentation de base, eau, médicaments, restauration à 5 % ; plus de taux à 0 % | ch. 3 |
| Fiscalité | Carburants (TICPE) | 4 | retour au niveau de 2017 : 3,9 Md€ | taxes calibrées sur le dommage, recette partagée par la fonction des revenus | ch. 2 et 3 |
| Fiscalité | Capital imposé comme le travail | 4 | retour du prélèvement forfaitaire unique à 30 % (−1,5 Md€) | contribution sur les revenus qui traite le capital comme le travail | ch. 3 |
| Fiscalité | Patrimoine | 4 | IFF (financier seulement) à la place de l'IFI ; exonération de l'immobilier transmis jusqu'à 300 k€ | contribution progressive sur tout le patrimoine, résidence principale comprise (0,25 % jusqu'à 1 M€), qui remplace taxe foncière et IFI | ch. 3 |
| Fiscalité | Successions et donations | 4 | exonération de l'immobilier transmis (300 k€) ; donations de 100 k€ par enfant tous les 10 ans | fonction sur le cumul reçu, plus progressive | ch. 3 |
| Fiscalité | Familles dans l'impôt | 3 | part fiscale pleine dès le 2e enfant (3,5 Md€) | 200 € par mois par enfant (+250 € parent seul), le quotient familial disparaît pour l'essentiel | ch. 4 |
| Fiscalité | Impôt sur les sociétés | 4 | mécanisme assis en partie sur le chiffre d'affaires (3,75 puis 7,5 Md€) | IS conservé tel quel (position libérale) | ch. 2 |
| Fiscalité | Rachats d'actions, superdividendes | 4 | taxe sur les rachats ; taxe sur les superdividendes | pas de position équivalente lue (fiscalité du capital par la contribution unique) | ch. 3 |
| Fiscalité | Fraude à la TVA et cartels | 3 | TVA prélevée à la source ; Autorité de la concurrence renforcée | règle simple qui rend l'optimisation inutile ; revenu réel calculé par l'État à partir des factures | ch. 2 et 3 |
| Fiscalité | Recouvrement | 2 | fusion Urssaf-DGFiP | un seul prélèvement : regroupement du recouvrement | ch. 3 et 7 |
| Retraites | Âge et durée | 3 | 62 ans, 42 annuités, 60 ans pour les entrées précoces (texte annoncé le 17/11/2026) | départ libre dès 60 ans avec pension ajustée ; âge de référence lié à l'espérance de vie | ch. 5 |
| Retraites | Capitalisation | 4 | « pilier de capitalisation » annoncé, sans contenu | pas de capitalisation : elle demande de payer deux fois pendant une génération | ch. 5 |
| Retraites | Économies sur le système actuel | 4 | « réparation » : 3 Md€ en 2027, 15 à 20 Md€ à terme, sans mesure décrite | pas de position équivalente (pension plafonnée et progressive pour les hautes pensions) | ch. 5 |
| Santé et protection sociale | Soins remboursés | 2 | dentaire remboursé à 100 % de la base | socle de soins à 100 % par la Sécurité sociale | ch. 4 et 10 |
| Santé et protection sociale | Coûts hospitaliers et parcours | 3 | économies de gestion, postes administratifs −10 % sur 5 ans | hôpital jugé sur l'attente, allègement administratif | ch. 10 |
| Santé et protection sociale | Fraude et dépenses indues | 4 | carte vitale biométrique, contrôles automatisés | versements calculés d'office : pas de démarche, donc moins d'indus ; pas de contrôle biométrique | ch. 7 |
| Santé et protection sociale | Prestations et résidence | 4 | prestations réservées aux étrangers ayant 5 ans de travail ; prestations familiales réservées aux foyers avec un parent français | les conditions de résidence du plancher relèvent du chapitre 9 et du vote des citoyens ; plancher sans condition d'activité | ch. 4 et 9 |
| Santé et protection sociale | Proches aidants, handicap | 2 | congé de proche aidant revalorisé ; AAH au-dessus du seuil de pauvreté | handicap compensé par le même circuit que le reste, niveau garanti | ch. 4 |
| Immigration | Aide médicale d'État | 4 | AME remplacée par une aide d'urgence | pas de position lue | ch. 9 |
| Immigration | Asile | 3 | réforme (0,9 Md€) non détaillée | décision d'asile en trois mois | ch. 9 |
| Immigration | Volumes et instrument | 3 | référendum et révision de la Constitution | vote des citoyens sur les volumes, consultatif tant que l'article 11 n'est pas modifié ; effet net sur les finances publiques de −0,5 à +0,5 point de PIB selon le CEPII, non tranché | ch. 8 et 9 |
| Europe | Contribution au budget de l'Union | 4 | baisse unilatérale : 8,9 puis 13,1 Md€ | respect du cadre ; « à terme une Europe fédérale » ; la France agit d'abord ; version européenne en préparation | ch. 2 et 14 |
| Europe | Règle budgétaire | 3 | règle d'or constitutionnelle par référendum (déficit au niveau qui stabilise la dette) | règle de dette stable avec clause de sauvegarde | ch. 12 et 13 |
| Europe | Trajectoire de déficit | 4 | sous 3 % en 2030 (annonce) | au-dessus de 3 % jusqu'en 2043, dit sans détour | ch. 12 et 13 |
| État | Agences et opérateurs | 3 | suppression et réinternalisation (3,4 puis plus de 10 Md€) | regroupement de 2 776 organismes sans perte d'agent | ch. 1 et 7 |
| État | Subventions aux associations, aide au développement | 3 | baisse (2,0 + 2,1 Md€) selon l'« intérêt général » | registre public de chaque euro dépensé ; pas de ligne équivalente | ch. 7 |
| État | « Train de vie » des institutions | 3 | 0,54 Md€ (Élysée, Assemblée, Sénat, CESE) | transparence des comptes, instance indépendante | ch. 7 |
| État | Effectifs publics | 3 | non-remplacement d'une partie des départs (non chiffré) | non-remplacement chiffré dans les économies de gestion (4,5 Md€ brut) ; aucune perte d'agent par regroupement | ch. 7 et 12 |
| État | Collectivités | 4 | suppression des EPCI et des métropoles ; 35 heures ; baisse de DGF | compétences de proximité confiées à l'intercommunalité (révision constitutionnelle) | ch. 7 et 13 |
| Énergie | Tarifs des énergies renouvelables | 4 | suppression des tarifs préférentiels (prix national de l'électricité) | développer les renouvelables les moins chères ; barrages publics ; EPR2 plafonnés en coût | ch. 11 |
| Énergie | Certificats d'économie d'énergie, TURPE, EDF | 4 | rebudgétisation, baisse du TURPE, dividendes d'exportation | pas de position équivalente lue | ch. 11 |
| Familles et société | Troisième enfant | 3 | prêt jeunes ménages transformé en subvention à la naissance du 3e enfant | montant par enfant universel | ch. 4 |
| Familles et société | Cotisations des seniors | 4 | exonération de cotisations retraite et chômage (annonce d'août) | statut unique de l'actif ; pas de mesure équivalente | ch. 4 |
| Sécurité et justice | Prisons | 4 | 30 000 places (1,0 Md€ par an dans l'annexe) | moyens de la justice et enquête d'abord ; pas de position lue sur les places | ch. 9 |
| Démocratie | Référendum | 2 | règle d'or et immigration par référendum | vote des lois par les citoyens quatre dimanches par an | ch. 8 |

Bilan (comptage de ce tableau, 37 lignes, ⚠️ à recompter si le tableau est modifié) : accord : 0 ligne ; rapprochement : 5 ; même fond, méthode différente : 13 ; divergence nette ou absence de position équivalente : 19. **Aucun sujet n'est classé en accord strict.** Les rapprochements portent sur le recouvrement (fusion Urssaf-DGFiP), le remboursement des soins, la place du référendum et du vote ; les divergences nettes sur la fiscalité de l'énergie, du capital et du patrimoine, la contribution à l'Union européenne, la trajectoire de déficit, la place de l'intercommunalité et la condition de nationalité ou d'activité pour les prestations. Sur l'immigration, notre manifeste ne propose pas de programme chiffré : il pose les contraintes juridiques, renvoie les volumes au vote des citoyens et ne tranche pas les chiffres sur lesquels les études divergent (chapitre 9) ; sa position n'est donc ni en accord ni en opposition avec les lignes du RN, c'est une absence de position équivalente. Réserve de lecture : la carte repose sur les positions écrites dans les chapitres de la version v02, dont une partie sont résumées ici sans relecture ligne à ligne.

**Convergences réelles à nommer.** (a) Le diagnostic de départ (dette de plus de 115 % du PIB, déficit supérieur à 5 %, intérêts élevés) est commun, avec les mêmes sources (Insee). (b) Le regroupement du recouvrement. (c) L'idée qu'une dépense publique doit être justifiée ligne par ligne et rendue publique. (d) Le référendum comme voie de décision. **Divergences de méthode.** Nous écrivons les contraintes juridiques avant les mesures ; nous donnons une trajectoire de déficit qui reste au-dessus de 3 % jusqu'en 2043 ; nous ne comptons pas d'économie sans mécanisme décrit.

## 7. Steelman

**Les meilleurs arguments en faveur du programme** (formulés comme ses partisans les formulent).

1. *Le diagnostic est exact et l'urgence réelle.* Dette de 119 % du PIB, déficit de 5,4 % en 2026, charge d'intérêts de 79 Md€ : le RN part de chiffres publics (Insee, comptes de l'État) et publie 125 mesures ligne à ligne, ce qui est plus précis que beaucoup de programmes ; même un critique libéral lui reconnaît d'avoir « fixé un cap » et publié ses chiffres (Contrepoints, cote C-D).
2. *Les impôts de production sont les plus pénalisants pour l'industrie.* Les supprimer (CFE, CVAE, C3S : 17,1 Md€) est présenté par ses partisans comme la baisse la moins distorsive (argument non étayé ici, ⚠️) ; le coût de 17 Md€ est certain, l'effet sur l'investissement et l'emploi est la partie incertaine, que notre banc ne compte que par le multiplicateur commun (⚠️ pas d'effet d'offre propre à cette mesure) : si l'effet est plus grand que celui du multiplicateur, le coût net est plus bas.
3. *La contribution de la France au budget de l'Union est élevée et en hausse.* 30,9 Md€ en 2027, environ 9,5 Md€ nets, et jusqu'à 35 Md€ par an dans la proposition 2028-2034 ; la règle de l'unanimité donne aussi à la France un droit de veto dans la négociation, que le RN annonce utiliser : notre borne haute (8,9 Md€) représente ce scénario, notre médiane suppose seulement quelques marges de négociation.
4. *Une partie des économies est réalisable.* L'État peut réduire l'aide au développement, les subventions aux associations, ses opérateurs ; la fraude existe (nous la nommons au chapitre 2). Sur les agences, même le Sénat chiffre des économies (0,5 Md€) : le sens n'est pas contesté, c'est le montant.
5. *Les conditions de durée pour certaines prestations ne sont pas hors de portée.* Le Conseil constitutionnel a admis le principe d'une condition de durée de résidence, en jugeant seulement la durée de cinq ans trop longue (2024-6 RIP) ; le RN propose de passer par un référendum de révision de la Constitution ; une version atténuée existe (notre médiane de 2,0 Md€ pour les prestations réservées).
6. *Revenir à 62 ans répond à une demande sociale* et le RN affirme que l'exonération de cotisations des seniors et la hausse du taux d'activité des jeunes compensent une partie du coût (effet de taux d'emploi non compté dans notre modèle, qui suppose des départs seulement avancés).
7. *Le multiplicateur d'une baisse d'impôts sur la production peut être supérieur à celui d'une consolidation ;* la littérature sur les asymétries est moins unanime que les chiffres de l'Institut de l'Entreprise ne le laissent croire (⚠️ non relue pour ce dossier).

**Ce qui peut être retourné contre nous** (nos propres chiffres, par la même méthode).

1. *Nos propres économies de dépense ne sont pas passées par ce filtre.* Notre système compte 44 Md€ d'économies (structurelles −27,2 ; règle de dette −17,0, `decomposition-prelevements-0811.md`), dont des économies de gestion, d'agences (0,70) et de collectivités, et des gains de fraude : le banc leur appliquerait la même question (mécanisme décrit ? contrainte juridique ?). Nous ne l'avons pas fait ; un lecteur hostile peut le demander.
2. *Notre système dépend lui aussi du droit de l'Union.* La TVA à trois taux, les barrages publics hors concession (la Commission demande leur mise en concurrence) et une trajectoire de déficit supérieure à 3 % jusqu'en 2043 sont nommés dans nos chapitres comme contraintes « non toutes instruites » (chapitre 14) : les haircuts juridiques appliqués ici au RN pourraient l'être aux lignes de notre manifeste.
3. *Notre taux de prélèvements de 52,2 % contre 45 % pour le RN.* Notre explication (écriture brute des versements, déficit ramené à 1,2 % du PIB, coût de la complexité internalisé) est comptable et vérifiée, mais l'affichage brut est plus simple ; et notre dette, qui plafonne à 133 % du PIB en 2037, ne baisse pas avant 2040.
4. *Notre manifeste n'a pas de position chiffrée sur l'immigration.* Renvoyer au vote des citoyens est une méthode ; elle sera lue comme une absence par ceux qui attendent des mesures ; le RN propose des lignes (même fragiles) là où nous écrivons un cadre.
5. *Le même banc peut produire pour nous un résultat plus défavorable que le modèle.* Notre intervalle n'est pas propagé ; la dette de 133 % est une valeur de modèle, celle du RN (170 [158 ; 179] %) une médiane de Monte-Carlo ; les chiffres ne sont pas comparables au point près (limite de `resultats.md` § 9).
6. *Le RN affiche 112 % de dette en 2032 ; nous affichons 133 % en 2038 et reconnaissons un déficit supérieur à 3 % jusqu'en 2043.* La comparaison honnête est celle des banc, pas celle des annonces ; mais la comparaison des annonces est celle que les électeurs verront.

## 8. Sources mobilisées, cotes et conflits d'intérêts

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts / orientation |
|---|---|---|---|
| [Groupe RN, Contre-budget 2027](https://nicolasdragon.com/wp-content/uploads/2026/10/grn-contre-budget-2027-dossier.pdf) | 125 mesures, montants de 2027, mesures du gouvernement retenues et rejetées | D | auteur = le programme ; copie hébergée par un député RN ; texte lu en entier |
| [Institut de l'Entreprise, note du 06/10/2026](https://www.institut-entreprise.fr/wp-content/uploads/2026/10/Analyse-primaire-contre-budget-RN-Note-de-contexte-IDEP.pdf) | valeurs 2031, classement des mesures, recalcul (7,5 Md€), écritures sans effet, TVA à la source, contribution UE | C | financé par des entreprises ; méthode publiée |
| [Public Sénat, 06/10/2026](https://www.publicsenat.fr/actualites/politique/140-milliards-deuros-deconomies-dici-2032-leffort-radical-propose-par-marine-le-pen-pour-redresser-les-f) | annonces, agences et Sénat (0,5 Md€) | C | presse publique |
| [Acteurs publics](https://acteurspublics.fr/articles/la-reforme-de-letat-et-des-collectivites-au-coeur-des-economies-programmees-par-le-rn/) | valeurs 2031 de l'État et des collectivités | C | presse spécialisée |
| [Journal du Net, 28/08/2026](https://www.journaldunet.com/business/action-publique/1554113-marine-le-pen-maintient-le-retour-a-la-retraite-a-62-ans/) ; [franceinfo, 14/10/2026](https://www.franceinfo.fr/elections/presidentielle/marine-le-pen-presentera-de-maniere-extremement-precise-sa-reforme-des-retraites-le-17-novembre_8237821.html) | retraites : 62 ans, 40-42 annuités, 9 Md€, 17/11/2026 | C | presse |
| [Localtis, 15/10/2026](https://www.banquedesterritoires.fr/budget-2027-la-facture-europeenne-continue-de-gonfler) | PSR-UE 30,9 Md€, contribution nette 9,5 Md€, 35 Md€ par an en 2028-2034 | B | Caisse des dépôts |
| [Billet de Me Landot, 03/08/2024](https://blog.landot-avocats.net/2024/08/03/etrangers-et-duree-dattente-avant-de-recevoir-des-prestations-sociales-le-conseil-constitutionnel-plus-protecteur-que-la-cjue/amp/) | décisions 2024-6 RIP et CJUE C-112/22 | C (décisions : A, non relues) | avocat ; blog |
| [Contrepoints, octobre 2026](https://contrepoints.org/programme-et-contre-budget-du-rassemblement-national-des-economies-en-trompe-loeil-des-impots-bien-reels/) | critique libérale et inventaire de la version 2026 du contre-budget | C-D | site et auteur d'orientation libérale ; opinion |
| SDES, Chiffres clés de l'énergie 2026 | dépense énergétique des ménages | A | lu par résumé de moteur de recherche |
| OpenFisca-France 176.1.10 | barème de l'IR 2025 | B | code public |
| Euronews, 07/10/2026 | réactions du gouvernement | C | presse ; non lu en primaire |

**Ce que ces sources établissent ensemble.** Faits : le contenu de l'annexe du RN, les annonces du 06/10/2026, la contribution française à l'Union. Estimations : tous les montants de régime du banc (méthodes au § 2, `programmes/rn/mesures.py`, `leviers_rn.py`, `rn_openfisca.py`). Opinions : aucune n'est formulée par l'auteur du dossier ; les jugements du RN, de l'Institut de l'Entreprise, du gouvernement et de Contrepoints sont attribués.

**Vérifications.** V32000 à V32019 ajoutées à `verifications.md`.
