---
titre: Plan de bascule — supprimer les impôts, tenir les recettes, rassurer les marchés, mesurer la simplicité
date: 2026-11-03
chantier: 8 de la boucle « meilleur système » (document de travail de l'atelier, non publié)
statut: brouillon, ordres de grandeur sous hypothèses ; aucun juriste n'a relu ; rien n'est publié
---

# Plan de bascule du palier 1

Consultation : 03/11/2026. Auteur : Claude, une IA d'Anthropic (conflit d'intérêts à garder en tête : un plan de réforme informatique et institutionnelle donne envie de le rendre faisable ; ce texte cherche plutôt ce qui casse). Légende : **fait sourcé** (lien ou renvoi) · **estimation** (calcul reproductible : `sources/calculs/plan_de_bascule.py`, `sources/calculs/complexite_codes_fiscaux.py`) · **opinion** · ⚠️ non confirmé, listé en V7930 à V7949 dans `verifications.md`. Ce document ne touche ni ne recalcule `modeles/systeme-ideal/` : il lit ses résultats (palier 1 : taux plat 35 %, socle 500 € + 200 € par enfant, IS 25 %, droits de succession à 50 %) et demande comment y arriver.

## 0. Dix lignes

1. **« Demain » n'existe pas, et aucun précédent français ne le permet.** Le plus rapide tenable : des mesures neutres dans la loi de finances 2028 (effet le 01/01/2028), un premier bloc réel (salariés) au **01/01/2029**, la fermeture de l'ancien système vers **2032**. Repères : prélèvement à la source 2012 → 2019 (≈ 7 ans), taxe d'habitation 2018 → 2023 (6 ans), LOLF 2001 → 2005-2006.
2. **On supprime 885,9 Md€ de prélèvements (70,6 % des 1 254 Md€ de 2024)**, dont 68,0 d'IS qu'on remet aussitôt (IS conservé à 25 %) : net ≈ 818. On garde environ 436 Md€ : TVA 207,8, accises 53,4, IS 68,0, DMTO 14,7 (supprimés par la réforme immobilière, pas par le palier 1), le reste ≈ 92.
3. **Le test « au moins autant de recettes qu'aujourd'hui » se formule sur le solde, pas sur la recette brute** (le socle est une dépense, la recette brute monte forcément). Résultat du modèle : Δ solde = +49 / **+6** / **−67 Md€** par an (bas / central / haut) : tenu au central, pas au haut.
4. **Au haut, aucun levier de taux ne suffit** : il faudrait 9 points de taux plat (au rythme de 7,3 Md€ par point : scénario haut au taux de 35 % du palier 1 d'origine ; à 40,7 %, taux de la v5, un point vaut 5,0 au haut et 10,8 Md€ au central) ; la soupape réaliste est le socle (≈ 354 € au lieu de 500 €). D'où la règle : le socle ne monte et ne se maintient que sur recette **constatée** ; un socle promis puis réduit coûte politiquement très cher.
5. **Dette et marchés : je ne promets aucune baisse.** À 5,6 % du PIB (palier 1 au central), le déficit reste très au-dessus de ce qui stabilise la dette (≈ 3,5 % avec 3 % de croissance nominale ⚠️). Un écart de ±50 pb pèse ±2,2 Md€ la première année et ±17,3 Md€ par an à plein régime (34,6 par 100 pb) ; 17 Md€ = 1,4 point de taux plat.
6. **Ce qui rassure vraiment** : une règle chiffrée écrite avant, un avis public contraignant d'une institution indépendante (Haut Conseil des finances publiques, à renforcer), des comptes publiés comme ceux d'une entreprise. C'est de l'opinion étayée, pas un résultat : aucune étude lue ne chiffre l'effet d'une telle règle sur les taux.
7. **La complexité mesurée** : 314 prélèvements distincts (fourchette 300-400), une soixantaine d'entités qui collectent, 16 282 articles en vigueur dans les six codes fiscaux, douaniers et sociaux lus (CGI 2 407, CSS 7 429, CIBS 1 763...). Cible proposée : 80 à 140 prélèvements, 2 à 3 collecteurs, un plafond légal d'articles. **L'indicateur empire avant de s'améliorer** pendant les années de double système.
8. **Ce qui casse si ça rate** : le système d'information (ONP, Louvois, Sirhen : > 1,1 Md€ perdus ; NPfIT britannique > 13 Md€) et la paie du socle. Garde-fou n° 1 : jamais d'extinction de l'ancien système avant 24 mois de fonctionnement en parallèle sans écart.
9. **Deux contradictions à regarder en face** : (a) « réduire la dette par la confiance » : le palier 1 la maintient, il ne la réduit pas ; (b) la règle « recettes constatées avant dépenses » contredit « demain » : c'est le prix de la crédibilité.
10. **Ce que je ne sais pas** : le taux plat d'un bloc isolé (le 35 % équilibre le paquet entier, pas le seul bloc salariés), le coût du système d'information (non sourcé), la réponse du Conseil constitutionnel à une loi de refonte de cette taille, et la compatibilité du socle avec le règlement UE 883/2004 (⚠️).

---

## 1. Inventaire de ce qu'on supprime, de ce qu'on garde

**Source des montants 2024** : [Insee, tableaux 3.216 et 3.217](https://www.insee.fr/fr/statistiques/8988845), repris de `sources/recherche-donnees-simulateur.md` § 1 et § 3.3 (Insee 2024 : 1 254,0 Md€ de prélèvements obligatoires, 42,7 % du PIB). Dépenses fiscales : 88,3 Md€ en 2026, 465 dispositifs (Voies et moyens, tome 2, PLF 2026, p. 13-14 : 88,3 Md€ en 2026, 89,4 en 2024, 465 dispositifs dont 82 en extinction ; [PDF](https://www.assemblee-nationale.fr/dyn/dyn/contenu/visualisation/1087933/file/Voies_et_moyens_Tome_2_2026.pdf) lu le 03/11/2026 ✅ V7941 ; voir `sources/economies-depense-publique.md`). Prestations 2024 : `sources/recherche-donnees-simulateur.md` § 3.2 (DREES, Unédic, CNAF) ; périmètre H86 du modèle.

### 1.1 Prélèvements supprimés (liste `SUPPR` du palier 1)

| Prélèvement | Recette 2024 (Md€) | Remarque |
|---|---|---|
| Cotisations sociales effectives | 432,4 | financent aujourd'hui retraites (vieillesse 392,0 Md€ en COFOG), santé, famille, chômage ; **les prestations contributives en cours restent dues** : seule la ressource change (§ 2.4) |
| CSG | 153,1 | |
| Impôt sur le revenu | 96,0 | |
| CRDS | 9,1 | |
| Prélèvement de solidarité et autres contributions | 14,6 | |
| *Sous-total revenus et salaires* | *705,2* | |
| Impôt sur les sociétés | 68,0 | **remis aussitôt** : IS conservé à 25 % (H36), donc non perdu |
| Taxe foncière | 42,9 | 26,2 payés par les ménages, 16,7 par les autres ; va aux communes et intercommunalités |
| Droits de mutation à titre gratuit (successions, donations) | 20,8 | remplacés par l'impôt sur les transmissions (50 %, plafond de 50 % tous impôts confondus) |
| IFI | 2,7 | |
| Taxe sur les salaires | 17,3 | |
| Versement mobilité | 12,2 | |
| CFE | 7,7 | |
| C3S | 5,2 | |
| CVAE | 3,9 | |
| **Total supprimé** | **885,9** | = 839,6 + 46,3 d'impôts de production ; net de l'IS remis : **817,9** |

**Hors liste mais supprimés par la réforme immobilière** (`modeles/systeme-ideal/patrimoine_immobilier.js`) : DMTO : 14,7 Md€ en 2024 (série CPO, comptes nationaux) ; le modèle en retire 16,1 au central, valeur 2025 de la série de la Cour des comptes (écart d'année et de source, pas d'erreur ✅ V7930 ; l'Insee ne donne que « droits d'enregistrement », 17,2 Md€ en 2024, périmètre plus large). Perte pour les départements (12,5 Md€) et les communes (3,3), à compenser (§ 2.4).

### 1.2 Prestations remplacées (périmètre H86 du modèle, 2024)

| Prestation | Dépense 2024 (Md€) | Statut |
|---|---|---|
| Assurance chômage | 37,1 | remplacée par socle + complément dégressif (60/40/20 % de la perte, plafonné) |
| Prestations familiales | 35,2 | estimation ; majoration de 200 € par enfant dans le socle |
| Aides au logement | 16,0 | une part va à des retraités (non couverts par le socle) |
| RSA | 12,4 | **plancher RSA de 877 € conservé** dans le palier 1 |
| Prime d'activité | 10,7 | **version progressive conservée** (positions du 31/10) : le tableau H86 la compte remplacée, le texte `systeme-ideal-v2.md` § 3.2 la conserve ⚠️ V7931 : à trancher, c'est un écart de définition du périmètre |
| ASS | 1,7 | |
| **Total remplacé (H86)** | **113,0** | = 117,6 − 4,6 d'ASPA conservée |

Conservés tels quels : ASPA (minimum vieillesse, 4,6), AAH (en différentiel : socle plus complément jusqu'au niveau actuel), pensions de retraite (retraités « protégés », sauf contribution des hautes pensions : 2 500 € nets, 20 %), santé (dépense comptée, pas supprimée).

### 1.3 Ce qu'on garde

| Poste | Recette 2024 (Md€) | Pourquoi |
|---|---|---|
| TVA | 207,8 | harmonisée par le droit de l'UE (directive 2006/112 ⚠️) : hors de portée d'une loi nationale |
| Accises : TICPE 30,2, tabacs 13,7, électricité 4,8, alcools 4,7 | 53,4 | fiscalité d'orientation (pollueur-payeur) ; cadre UE (directive 2020/262 ⚠️) |
| IS (25 %) | 68,0 | choix de l'auteur (IS conservé) ; imposition minimale mondiale (15 %) déjà en droit (directive 2022/2523 ⚠️) |
| DMTO | 14,7 | supprimés par la réforme immobilière, voir § 1.1 |
| Autres (taxe d'aménagement, TGAP, assurances, jeux, droits de douane UE...) | ≈ 92 | solde = 1 254,0 − 885,9 − 207,8 − 53,4 − 14,7 (estimation par différence) |

**Niches** : les niches de TVA et d'accises sont conservées (4,7 Md€ de recette possible, `economies-depense-publique.md`). Les 465 dépenses fiscales (88,3 Md€) dont l'IR (41,3) et l'IS (14,4 dont CIR 8,0) disparaissent avec leur impôt, sauf le CIR (enveloppe directe de 4 Md€, H39).

### 1.4 Classement des 314 prélèvements (inventaire, ancien modèle à 50 %)

Source : `sources/recherche-inventaire-impots.md` § 6, classement **proposé par agent, à valider par l'auteur**. Absorbés : 69 (≈ 704 Md€). Supprimés : 107 (≈ 129). Maintenus : 44 (≈ 298). Convertis en redevance : 29 (≈ 11). À trancher : 64 (≈ 186, dont retraites complémentaires et assurance chômage ≈ 133, DMTO, taxes sur les assurances ≈ 17). Total : 313-314 lignes, ≈ 1 328 Md€ (le total Insee fait foi : 1 254).

**À trancher avant tout calendrier** : les 133 Md€ de retraites complémentaires et d'assurance chômage (droits contributifs gérés par les partenaires sociaux), les taxes sur les assurances (17 Md€) et la taxe foncière : le palier 1 la supprime, la taxe à 1 % sur le patrimoine (chantier 1, `taxe-patrimoine-1pc.md`) est une option à la décision de l'auteur ; sans elle, les communes perdent 42,9 Md€ de ressources propres (art. 72-2 de la Constitution, § 2.4).

---

## 2. Calendrier réaliste

### 2.1 Ce que mesurent les précédents

**Faits** (`sources/chapitre19-etat-des-preuves.md`, V7044-V7047, relu le 03/11/2026 ; Cour des comptes pour les projets, `sources/chapitre4-etat-des-preuves.md` § 2) :

| Réforme ou projet | Décision → effet | Leçon pour la bascule |
|---|---|---|
| Prélèvement à la source | loi du 29/12/2016 → 01/01/2019 ; report d'un an décidé par ordonnance (06-09/2017) ; engagement de 2012 : ≈ 7 ans | Réussi, mais en **3 ans de préparation** et avec un report ; il s'appuie sur un flux déjà en place (déclaration sociale nominative des employeurs ⚠️ V7932) |
| Taxe d'habitation | LFI 2018 → 2023 | 6 ans, deux lois, deux populations (80 % puis 20 %) : les réformes à perdants s'étalent |
| LOLF | décision 2001 → 01/01/2005 ; premier budget en programmes : 2006 | 3,5 à 5 ans pour une réforme de procédure |
| ONP (paie de 2,7 M d'agents, 2007) | abandonné ; ≈ 346 M€ à fin 2013 | ambition excessive, règles trop complexes |
| Louvois (solde des armées, 2001) | abandonné fin 2013 ; erreurs de 465 M€ la seule année 2012 | **réduire les effectifs avant que le système marche** (Cour 2020, p. 19) |
| Sirhen (Éducation, 2007) | prévu 60 M€ pour 2012, arrêté en 2018, > 500 M€ | périmètre qui dérive |
| NPfIT (NHS, Royaume-Uni) | coût ×5, arrêté 2011 | > 13 Md€ : l'échec centralisé est le plus cher |

**Estimation** : trois échecs français chiffrés ≈ 1,1 Md€ sur quinze ans. **Fait** : 32 % de ressources internes sur les grands projets de l'État contre 65 % chez Gartner (Cour 2020, p. 68). La dépense numérique de l'État est de l'ordre de 5,5 Md€ par an (Cour des comptes, octobre 2026, p. 42, périmètres mêlés).

**Opinion de Claude** : cinq règles tirées de ces cas : (1) jamais de date unique, des blocs ; (2) un an de fonctionnement « à blanc » (shadow mode : chaque foyer reçoit son calcul nouveau, sans effet) avant chaque bloc ; (3) s'appuyer sur les flux existants plutôt que reconstruire ; (4) ne retirer ni agents ni système ancien avant que le nouveau tienne ; (5) équipe interne, pas seulement prestataires.

### 2.2 Calendrier proposé (année 0 = élection, avril-mai 2027, dates à confirmer ⚠️)

| Période | Lois et procédure | Systèmes d'information | Ce qui change pour les gens |
|---|---|---|---|
| **2026-27** (campagne) | publier la loi sous forme exécutable (`sources/loi-executable-*.md`) ; **annoncer** les règles de fait générateur | audit des flux DGFiP, Urssaf, CAF, caisses de retraite | rien |
| **T2 2027** | loi d'habilitation (art. 38) ; loi de finances rectificative : règles anti-abus **datées de l'annonce** (2013-682 DC), transparence des holdings, publication des départs de hauts revenus | décision d'architecture : une **plateforme unique de déclaration et de paiement**, construite sur la DSN et le prélèvement à la source ; équipe interne | rien |
| **T3-T4 2027** | ordonnances (délai d'habilitation : 6-9 mois ⚠️) ; **PLF et PLFSS 2028** (dépôt au plus tard le premier mardi d'octobre, LOLF ⚠️) : suppression des petites taxes, regroupement des collecteurs, règle budgétaire (loi organique), mandat renforcé du Haut Conseil des finances publiques | prototype sur un bloc ; tests de charge | **01/01/2028** : mesures neutres (127 taxes sous 150 M€ supprimées, 0,37 % du total ; plus de nouvelle niche sans suppression) |
| **2028** | ratification des ordonnances (expresse) ; **référendum (art. 11) sur la loi-cadre** : principes, plafond de 50 % sur les transmissions, règle « recette constatée avant hausse du socle », noyau intangible ; puis LF et LFSS 2029 du **bloc 1** | **bloc 1 en shadow mode toute l'année** (salariés) | calculs « à blanc » sur les fiches de paie |
| **2029** | **bloc 1 en vigueur au 01/01** : salariés, taux plat calibré **pour ce bloc** (non calculé : ⚠️ V7933), socle de départ à 250 € ; ancien système en parallèle ; bloc 2 en shadow | plateforme en service pour les employeurs ; l'ancien système reste branché | salariés : une ligne au lieu de cinq ; D1 : −72 à −81 €/mois sans correctif (chantier 4) |
| **2030** | **bloc 2** : indépendants, capital, holdings, transmissions (fait générateur postérieur à l'annonce), IS ; prestations remplacées (logement, RSA, allocations familiales, chômage) **seulement si le filet est en place** | extension aux particuliers, CAF et France Travail | remplacement des aides : changement le plus visible |
| **2031** | **bloc 3** : fiscalité locale (foncier, CFE), compensation des collectivités ; nouveau décompte des retraites (points, compte unique), contribution des hautes pensions | | communes : nouveau mode de financement |
| **2032** | **fermeture de l'ancien système** après 24 mois sans écart ; révision constitutionnelle (art. 89) si la démocratie directe est lancée (`architecture-democratique.md` : art. 11 d'abord, art. 89 ensuite) | extinction de l'ancien SI | |
| **2033** | première année complète ; bilan Cour des comptes ; paliers de socle suivants | | |

**Ce qui peut se faire par ordonnance (art. 38), loi ordinaire ou loi de finances (⚠️ V7934, non relu par un juriste)** :
- *Loi de finances ou loi ordinaire* : taux, assiette, recouvrement des impositions (art. 34) ; suppression d'une taxe ; fait générateur ; fiscalité d'une année (la loi de finances de l'année).
- *Ordonnance* : recodification, mise en cohérence des renvois (la recodification de la TVA est déjà faite par ordonnance du 17/12/2025 en vigueur au 01/01/2027 : `bascules-futures-droit.md`), regroupement des collecteurs ; la **ratification expresse** est nécessaire pour que le texte prenne valeur de loi. Aucun précédent d'ordonnance de refonte fiscale de cette ampleur n'a été trouvé : à ne pas supposer.
- *Loi organique* : règle budgétaire, rôle du Haut Conseil des finances publiques (créé par loi organique de 2012 ⚠️).
- *Référendum art. 11* : « réformes relatives à la politique économique, sociale ou environnementale » ; une loi référendaire échappe au contrôle du Conseil (62-20 DC) mais **pas** à la CEDH ni au droit de l'UE (`chapitre19-etat-des-preuves.md`, V7041). Les lois de finances qui l'appliquent restent contrôlables ⚠️.
- *Révision constitutionnelle (art. 89)* : inutile pour le palier 1 ; nécessaire pour la démocratie directe, voir `architecture-democratique.md`.

### 2.3 Risques juridiques

| Risque | Gravité | Réponse |
|---|---|---|
| Conseil constitutionnel : égalité devant les charges publiques, droits acquis, confiscation (taux cumulé de 75,04 % jugé excessif sur un type de rente : 2012-662 DC) | fort | plafond de 50 % tous impôts confondus ; blocs divisibles ; gains acquis sous régime de durée protégés (2013-682 DC : un motif seulement financier ne suffit pas) ; référendum |
| Droits acquis (assurance-vie, PEA, abattements immobiliers) | fort (179 Md€ en jeu, `bascule-existant/resultats.md` § 6) | taux historiques maintenus pour les gains acquis ; coût ≈ 16 Md€ par an (central) |
| Anticipation (transmissions avancées sous l'ancien régime) | moyen | règle datée de l'annonce ; 12 Md€ de perte avec la règle contre 60 sans (central, `bascule-existant`) |
| UE : TVA et accises non modifiables ; libre circulation des capitaux (exit tax immédiate contraire) ; **règlement 883/2004** (coordination des régimes : cotisations remplacées par un impôt, socle versé aux résidents) | à instruire | ⚠️ V7935 : aucune lecture primaire ; à faire relire par un spécialiste du droit social européen |
| Art. 72-2 (autonomie financière des collectivités : ressources propres part déterminante) | fort | compensation par part de l'impôt national ou taxe locale résiduelle ; contrainte à nommer, pas à contourner |
| Sécurité juridique et rétroactivité fiscale | moyen | tout fait générateur postérieur à la date d'annonce ; jamais de rétroactivité au-delà |

### 2.4 Trois transitions qui ne sont pas triviales

1. **Cotisations contre retraites en cours.** La cotisation vieillesse finance aujourd'hui des pensions déjà liquidées (392,0 Md€ de dépense de vieillesse, COFOG 2024). Supprimer la cotisation sans changer le droit = la pension est payée par la recette générale. Le « nouveau décompte en points » (`systeme-ideal-v2.md` § 3.10) est le chaînon manquant ; il doit exister avant le bloc 3.
2. **Collectivités.** Taxe foncière 42,9, CFE 7,7 (communes et intercommunalités), DMTO 14,7 (départements, communes) : ≈ 65 Md€ de ressources à reverser d'une façon qui respecte l'art. 72-2. Précédent : la suppression de la taxe d'habitation s'est faite avec compensation par fraction de TVA ; son coût et sa durée sont dans les 6 ans cités plus haut.
3. **Prestations en cours.** La CAF et France Travail paient aujourd'hui des droits ouverts ; aucun droit ouvert n'est supprimé en cours de route, les nouveaux droits s'ouvrent à la date du bloc (hypothèse de conception, opinion).

---

## 3. Recettes pendant la transition et signal aux marchés

### 3.1 Comment formuler « au moins autant de recettes qu'aujourd'hui »

**Opinion de Claude, à valider par l'auteur.** La recette brute montera de toute façon (35 % sur toutes les assiettes) mais le socle est une dépense : un test sur la recette brute est vide. Le test utile : **Δ solde_t = solde public_t − solde public du droit actuel_t ≥ 0**, mesuré par une institution indépendante après coup (recettes constatées), pas prévu.

**Résultats du modèle** (`modeles/systeme-ideal/resultats-options-financement.txt` ; `plan_de_bascule_resultats.txt` ; Md€ par an, euros 2024-25, régime de croisière statique ; « bas » = réactions faibles, favorable ; « haut » = réactions fortes) :

| | Bas | Central | Haut |
|---|---|---|---|
| Solde du palier 1 (régime) | −119,8 (−4,1 % du PIB) | −163,3 (−5,6 %) | −235,7 (−8,0 %) |
| Δ solde par rapport au droit actuel (déficit 2024 : −169,1) | **+49,3** | **+5,8** | **−66,6** |
| Année 1 avec socle de 250 € (montée linéaire jusqu'à 500 €) | −14,3 | −54,3 | −121,4 |
| Δ de l'année 1 avec socle de 250 € | +154,8 | +114,8 | +47,7 |

**Lecture honnête.**
- Au central, le palier 1 ne dégrade pas le solde de plus de 6 Md€ : le test est tenu **de justesse par construction** (le taux plat de 35 % a été choisi pour cela).
- Au haut, il est violé de 66,6 Md€ par an, soit 2,3 % du PIB. La montée du socle (250 → 500 €) laisse un coussin au début (Δ > 0 dans les trois cas la première année) mais **ce coussin fond à mesure que le socle monte** et il suppose que l'ancien système a disparu d'un coup, ce que le plan par blocs interdit : ces lignes sont un plafond théorique, pas une prévision.
- **Le modèle n'a pas de solde par bloc.** Un taux plat de 35 % sur les seuls salariés (bloc 1) ne donne pas Δ = 0 : le 35 % équilibre le paquet entier (capital, transmissions, patrimoine compris). Le taux du bloc 1 est à calibrer (⚠️ V7933).

### 3.2 Mécanismes qui garantissent la recette (propositions)

| # | Mécanisme | Effet |
|---|---|---|
| R1 | **Cliquet de recette constatée** : le socle ne monte que si le Δ solde de l'année écoulée est ≥ 0 (23,2 €/mois par tranche de 10 Md€ constatés, `systeme-ideal-v2.md` § 3.1) | évite de promettre ce qu'on n'a pas encaissé |
| R2 | **Clause de sauvegarde automatique** : si Δ solde constaté < 0 pour deux trimestres, gel du socle ; si < −30 Md€ sur l'année, retour par paliers vers un socle plus bas | au haut : ≈ 146 € de baisse (socle ≈ 354 €) pour fermer −66,6 (45,6 Md€ par 100 € ; **linéaire ⚠️**) |
| R3 | **Marge de taux** : le taux plat peut varier de ± 2 points par loi de finances sur avis du HCFP ; au-delà, vote populaire | ≈ 12,6 Md€ par point au central, 7,3 au haut (options a1-a4, taux de 35 % du palier 1 d'origine ; v5 à 40,7 % : 10,8 au central, 5,0 au haut) ; 2 points ≈ 25 Md€ au central |
| R4 | **Années de double système** : l'ancien système continue à encaisser sur son assiette jusqu'à la fin du bloc ; l'impôt du nouveau régime s'ajoute **uniquement** quand l'ancien s'éteint, sans année blanche (leçon de 2018, V7045) | évite un trou de trésorerie, coût : complexité maximale pendant 2029-2032 |
| R5 | **Provision du système d'information** (estimation sans source, ⚠️ V7936) : 5 Md€ (≈ un an de dépense numérique de l'État) au central, jusqu'à 13 Md€ au haut (ordre de grandeur NPfIT) | à financer par les économies du chantier 3 (11,7 Md€ à 10 ans au central), non par l'emprunt |
| R6 | **Pas d'économie avant le fonctionnement** : aucune suppression d'agents des services de recouvrement avant le bloc correspondant (Louvois) | protège la recette ; retarde les gains de gestion |

### 3.3 Trésorerie

- Le déficit actuel (169,1 Md€ en 2024) est déjà financé ; le sujet est le **Δ défavorable**. Au haut, 66,6 Md€ de dette en plus par an représentent environ 21 % des émissions de 2026 (310 Md€, ⚠️ chiffre de recherche non relu au PLF 2027). Sur cinq ans sans correction : +333 Md€ de dette et ≈ 11,7 Md€ d'intérêts la cinquième année à 3,5 % (hypothèse H-B1 : OAT à 10 ans à 3,45 % début 2026, `recherche-creer-de-la-valeur.md`).
- **Besoin de trésorerie propre à la transition** : décalage entre l'arrêt d'un impôt et l'arrivée du suivant. Il est faible pour les salariés (les cotisations sont déjà payées au fil de l'eau) et plus fort pour les indépendants, le capital et les successions (paiement annuel, étalement). **Non chiffré** : à modéliser (⚠️ V7937).

### 3.4 Dette, taux et marchés : ce qu'on peut dire et ce qu'on ne peut pas

**Fait** : dette Maastricht 3 460,5 Md€ fin 2025 (115,7 % du PIB, Insee) ; intérêts 60,1 Md€ en 2024, 65,7 en 2025 ; 56 % de la dette négociable de l'État détenue par des non-résidents (AFT, fin 2025). **Estimation** (`sources/calculs/cout_sortie_ue.py`, durée moyenne de la dette 8 ans, hypothèse ⚠️ ; refinancement linéaire) :

| Écart de taux | Année 1 (Md€) | Régime plein (Md€/an) | En % du PIB (plein) | En points de taux plat (central) |
|---|---|---|---|---|
| −50 pb | −2,2 | −17,3 | −0,59 % | −1,4 |
| +50 pb | +2,2 | +17,3 | +0,59 % | +1,4 |
| +100 pb | +4,3 | +34,6 | +1,18 % | +2,7 |

**Ce qu'on ne peut pas dire** : que la bascule fera baisser les taux. Aucune source du dépôt ne chiffre l'effet d'une règle budgétaire ou d'un conseil indépendant sur le spread français. Ce qu'on sait : le risque est asymétrique (un choc de confiance coûte plus vite qu'un gain de crédibilité ne rapporte), et un déficit conservé à 5,6 % du PIB n'est pas un signal de réduction de dette. **Contradiction avec le cahier des charges du 03/11** (« réduire la dette grâce à la confiance ») : à nommer. Arithmétique : la dette ne se stabilise que si le déficit est au plus égal à la croissance nominale × le ratio de dette, soit ≈ 3,5 % du PIB à 3 % de croissance (hypothèse ⚠️) ; le palier 1 est à 5,6 % au central, 8,0 % au haut.

**Signal aux marchés (opinion étayée)** : (1) une **règle budgétaire chiffrée écrite avant le vote** (ex. : Δ solde ≥ 0 chaque année ; trajectoire du déficit vers 3 % du PIB à un horizon fixé) ; (2) un **avis public et contraignant du HCFP** sur chaque loi de finances (il en est consultatif aujourd'hui ⚠️) ; (3) des **comptes publiés** de l'État comme ceux d'une entreprise (`sources/comptes-etat-comme-entreprise.md`) ; (4) une **annonce dès la campagne** du calendrier et des clauses R1-R3, pour éviter l'effet de surprise ; (5) ne **jamais** annoncer un chiffre de baisse des taux.

---

## 4. Compter la complexité (l'indicateur de simplicité)

### 4.1 Avant : les mesures

| Indicateur | Valeur | Source |
|---|---|---|
| Prélèvements obligatoires distincts | **314** (fourchette 300-400 ⚠️) ; 343 lignes | décompte `recherche-inventaire-impots.md` § 2.1 ; aucune liste officielle n'existe |
| Petites taxes | 179 taxes de moins de 100 M€ (IGF 2014) ; 127 taxes de moins de 150 M€ = 0,37 % du total | Sénat, rapport général PLF 2019 ; `recherche-inventaire-impots.md` § 6 |
| Taxes affectées | 259 taxes affectées à d'autres que l'État en 2019, 308,5 Md€ | Voies et moyens PLF 2020 |
| Entités qui collectent | DGFiP 118 prélèvements, Urssaf 52, Agirc-Arrco 1, douane 32, caisses 22, **58 organismes qui collectent eux-mêmes**, 31 autres : une soixantaine d'entités distinctes ⚠️ ; DGFiP + Urssaf = 83 % des montants | `recherche-inventaire-impots.md` § 3 |
| Dépenses fiscales | 465 dispositifs, 88,3 Md€ (2026) | Voies et moyens tome 2, PLF 2026 |
| Coût de collecte et de conformité | public 7,6 Md€ ; conformité 25,3 Md€ ; total 32,9 Md€ (2,6 % des prélèvements) au central ; 139 h de conformité d'une PME contre 170 en moyenne UE | `cout-complet-prelevement.md` |
| **Articles en vigueur (copie locale codes.droit.org, 03/11/2026)** | CGI 2 407 ; annexes I à IV : 71 + 674 + 1 114 + 477 ; livre des procédures fiscales 919 ; CIBS 1 763 ; code des douanes 1 428 ; code de la sécurité sociale 7 429 ; **total 16 282** (2,81 millions de mots) | `sources/calculs/complexite_codes_fiscaux.py` |

Détail du CGI (articles, mots) : livre I 2 149 (748 759 mots), dont première partie « impôts d'État » 1 687, dont **impôt sur le revenu 500 (255 065 mots)**, IS 131, imposition minimale mondiale 184, TVA et chiffres d'affaires 196, enregistrement, publicité foncière, timbre, IFI 433 ; deuxième partie « impôts locaux » 382 ; livre II (recouvrement) 257.

**Réserves ⚠️ V7938** : (a) les copies codes.droit.org sont des vues « branches coupées » des XML Légifrance : le CGI compte 2 407 articles en vigueur dans cette copie, valeur à rapprocher d'une source officielle avant publication ; (b) le code de la sécurité sociale, le code des douanes et le CIBS ne sont pas tous supprimés, loin de là (TVA et accises restent) ; (c) un article n'est pas une règle : certains articles du CGI font des pages. La mesure retenue est donc double : **articles** et **mots**. Le nombre de formulaires n'a pas été compté (aucune source du dépôt : ⚠️ V7939).

### 4.2 Après : cibles et mesure du palier 1

**Estimation** (classement `recherche-inventaire-impots.md` § 6, à valider par l'auteur) :
- **Prélèvements** : 44 maintenus + 29 convertis en redevances + 5 prélèvements nouveaux (taux plat, impôt continu, IS, transmissions, éventuellement taxe à 1 %) = **78** au mieux ; **142** si les 64 « à trancher » restent. Soit −55 % à −75 % par rapport à 314.
- **Collecteurs** : plateforme unique (DGFiP + Urssaf) + douane (accises, droits UE) : **2 à 3** au lieu d'une soixantaine ; les 58 petits organismes sont financés par crédits budgétaires (leurs ressources totales : 10 Md€).
- **Articles du CGI directement concernés par les impôts supprimés** : IR 500 + enregistrement, publicité foncière, timbre, IFI 433 + impôts locaux 382 = ≈ 1 315 articles, soit 55 % des 2 407 (décompte par titres entiers, remplacé le 03/11 par un classement article par article : **887 articles supprimés (36,9 %) à 1 650 (68,6 %) avec les blocs mixtes et non tranchés**, 920 au central, dont 176 sont cités par un article conservé ; `sources/cgi-articles-supprimes.md`, V9000-V9003). **À écrire en contrepartie** : une loi du prélèvement unique. **Cible proposée (opinion)** : un **plafond légal d'articles** (300 par exemple, hypothèse de conception) vérifiable par le même compteur ; sans plafond, la complexité repousse.
- **Dépenses fiscales** : 465 → celles de l'IR (41,3 Md€) et de l'IS-IR (14,4) disparaissent avec leur impôt ; les niches de TVA et d'accises restent.

### 4.3 Ce que l'indicateur fera pendant la bascule

**Il empirera avant de s'améliorer** : de 2029 à 2032 deux systèmes coexistent (les articles ne sont pas abrogés avant la fermeture, § 2.2) et le nombre de règles applicables au même foyer augmente. Il faut le publier chaque année, avec trois séries : prélèvements actifs, articles en vigueur, heures de conformité d'une PME-type (OCDE/Banque mondiale : 139 h en France). **Seuil de décision** : si le compteur d'articles n'est pas repassé sous son niveau de 2027 à la fin de l'année 2033, la réforme a échoué sur son propre indicateur.

---

## 5. Ce qui casse si ça rate, et les garde-fous

| Scénario d'échec | Conséquence chiffrée ou datée | Garde-fou |
|---|---|---|
| **G-A. Le système d'information ne tient pas** (retards, paie du socle ratée) | ONP, Sirhen, Louvois : > 1,1 Md€ perdus ; NPfIT > 13 Md€ ; un socle non versé à temps touche d'abord D1-D3 | shadow mode d'un an par bloc ; 24 mois de parallèle sans écart avant l'extinction ; équipe interne ; aucune suppression d'agents avant (Louvois) ; reprise possible de l'ancien système tant qu'il n'est pas éteint |
| **G-B. Recettes sous le droit actuel** (haut : −66,6 Md€ par an, 2,3 % du PIB) | dette +333 Md€ en 5 ans ; intérêts +11,7 Md€ la 5e année | R1 (cliquet), R2 (sauvegarde : socle ≈ 354 € au pire), R3 (±2 points) ; l'érosion de 30 à 34 % du gain statique d'une hausse de taux est déjà dans le modèle |
| **G-C. Choc de taux** (+100 pb) | +4,3 Md€ la 1re année, +34,6 à plein régime (1,2 % du PIB) | échéancier de dette plus long ⚠️ ; règle publiée ; comptes publics ; aucune promesse de baisse de taux |
| **G-D. Censure partielle du Conseil constitutionnel** | motif financier insuffisant pour les gains acquis (179 Md€ en jeu) ; espérance de censure ≈ 24 Md€ (politique recommandée) contre ≈ 160 (stricte) sous la Constitution actuelle (H18) | blocs divisibles ; référendum pour la loi-cadre ; mesures non constitutionnellement fragiles d'abord ; taux historiques pour les gains acquis |
| **G-E. Anticipation et exil du capital** | 60 Md€ perdus sans règle datée, 12 avec (central) ; exil des 1 % du haut dans les réactions de T5 | règle datée de l'annonce ; exit tax différée (solide en droit de l'UE) ; publication des départs et retours |
| **G-F. Perdants visibles et concentrés** (D1 : −72 à −81 €/mois au palier 1 sans correctif, D2 −17 € ; parents isolés, retraités locataires, étudiants boursiers) | contestation politique avant 2029 ; retour en arrière par un successeur | correctifs ciblés (chantier 4), chiffrés ; clause de non-perte transitoire (⚠️ non chiffrée : V7940) ; paliers annoncés |
| **G-G. Collectivités privées de ressources propres** | 65 Md€ à compenser ; art. 72-2 | compensation d'abord, suppression ensuite ; décision sur la taxe à 1 % |
| **G-H. Incompatibilité avec le droit de l'UE** (règlement 883/2004, libre circulation, TVA) | procédure d'infraction ; arrêt du socle pour certains publics | avis préalable de juristes ; clause de résidence testée ; ⚠️ V7935 |
| **G-I. Réversibilité politique** (un successeur défait la réforme avant ses effets) | les réformes qui ont tenu (Suède, Nouvelle-Zélande) étaient étalées et soutenues par un compromis | loi-cadre par référendum + noyau intangible à double verrou ; indicateurs publics ; clause de rendez-vous annuelle |
| **G-J. Reconversions de l'industrie de la complexité** | 173 000 emplois concernés (central), 82 800 personnes à reconvertir après départs en retraite ; coût ponctuel ≈ 6,5 Md€ (estimation non sourcée ⚠️) | calendrier par blocs qui commence par augmenter la demande de conseil ; « ne perdre personne » |

**Les cinq garde-fous qui valent pour toute la bascule**, en une ligne chacun : (1) rien n'est éteint avant 24 mois de parallèle sans écart ; (2) rien n'est promis avant d'être encaissé ; (3) tout est divisible en blocs, chaque bloc a son test ; (4) un indicateur public de simplicité (articles, prélèvements, heures) décide aussi de la poursuite ; (5) l'avis d'une institution indépendante est public et lié aux clauses.

**Steelman (meilleure objection) et réponse.** *Objection* : plus on protège les perdants, plus le gain arrive tard, et plus un successeur peut défaire la réforme avant ses effets ; une réforme étalée sur cinq ans dépasse un mandat, ce qui contredit « demain ». *Réponse partielle* : l'étalement est ce que montrent les cas réussis ; on le compense par un premier effet visible dès 2028 (taxes supprimées, transparence), un référendum de principe en 2028 et un calendrier gravé dans la loi-cadre. Cela ne supprime pas la contradiction : c'est un arbitrage entre vitesse et solidité, que l'auteur doit trancher.

---

## 6. Ce que je ne sais pas, et qui reste à faire

1. **Modèle par blocs** : le taux plat et le solde de chaque bloc (salariés, indépendants, capital, transmissions, locaux). Sans lui, le calendrier ne garantit pas Δ ≥ 0 chaque année (V7933). Tâche suivante recommandée.
2. **Coût du système d'information et de la double gestion** : non sourcé (V7936) ; appel d'offres de référence introuvable.
3. **Avis de juristes** sur : ordonnance en matière fiscale, art. 11 pour une réforme fiscale, 883/2004, art. 72-2 (V7934, V7935).
4. **Effet de la règle budgétaire sur les taux** : aucune étude lue ; à chercher (FMI, Commission, OCDE, Banque de France).
5. **Formulaires** : pas de compteur ; à chercher dans Cerfa (V7939).
6. **Le plafond de 50 %** (tous impôts confondus) et le **noyau intangible** conditionnent la loi-cadre : cohérence à vérifier avec `architecture-democratique.md`.

## Sources mobilisées (synthèse)

| Source | Ce qu'elle établit ici |
|---|---|
| [Insee, tableaux 3.216 et 3.217](https://www.insee.fr/fr/statistiques/8988845) | recettes 2024 par prélèvement ; total 1 254,0 Md€ |
| `sources/recherche-inventaire-impots.md` (Insee, DGFiP, Sénat, CPO, IGF) | 314 prélèvements, collecteurs, classement par devenir |
| `sources/cout-complet-prelevement.md` ([PAP 2026](https://www.assemblee-nationale.fr/dyn/contenu/visualisation/1087984/file/PAP2026_BG_Gestion_finances_publiques_GA.pdf), Urssaf) | coût de collecte et de conformité |
| [Cour des comptes, 2020, grands projets numériques](https://www.ccomptes.fr/sites/default/files/2023-10/20201014-58-2-conduite-grands-projets-numeriques-Etat.pdf) ; [Cour des comptes, octobre 2026](https://www.vie-publique.fr/files/rapport/pdf/305075.pdf) | ONP, Louvois, Sirhen, NPfIT ; dépense numérique de 5,5 Md€ |
| `sources/chapitre19-etat-des-preuves.md` | durées de réformes, verrous juridiques, bascules étrangères |
| `modeles/bascule-existant/resultats.md` | droits acquis, anticipation, solidité juridique par mesure |
| `modeles/systeme-ideal/` (palier1, options-financement) | solde par scénario, gain par point de taux, calendrier de montée |
| `sources/calculs/cout_sortie_ue.py` | sensibilité de la charge de dette aux écarts de taux |
| `sources/calculs/complexite_codes_fiscaux.py` (codes.droit.org, XML Légifrance) | articles et mots en vigueur |
| `sources/architecture-democratique.md`, `recherche-basculement-constitutionnel.md` | séquence art. 11 puis art. 89 |
| `outils/droit/bascule_2027.py`, `bascules_futures.py` | dates certaines de bascule du droit (01/01/2027, 01/01/2028) |
