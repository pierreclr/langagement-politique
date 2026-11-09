# Immigration : ce qu'elle apporte, ce qu'elle coûte, ce qu'on pourrait favoriser ou non

> Demande de l'auteur du 02/11/2026 : chiffrer avant de fixer une position. Principes déjà posés par l'auteur : **contrôler**, **pas d'immigration illégale**, une immigration **qui permette l'assimilation**.
>
> **Statut.** Synthèse décisionnelle. Elle s'appuie sur la note de fond `sources/recherche-immigration.md` (897 lignes, séries dans `sources/donnees/immigration_*.csv`, lectures du 25 et du 31/10/2026) et la complète sur ce qui manquait : intégration et « assimilation », comparaisons internationales, contraintes juridiques, options. Les calculs sont dans `sources/calculs/immigration.py` (résultats dans `sources/calculs/immigration_resultats.txt`). Sources consultées le **02/11/2026** sauf mention contraire.
>
> **Légende.** **[Fait]** chiffre officiel · **[Estimation]** · **[Projection]** conditionnelle · **[Étude]** · **[Calcul]** de Claude, hypothèses explicites · **[Opinion]** de l'auteur ou de Claude, signalée. `⚠️` : non vérifié, listé dans `verifications.md` (V4120 à V4134).
>
> **Règle de lecture.** Un chiffre sur « l'immigration » en bloc ne décrit personne : il mélange des étudiants de passage, des médecins, des aides à domicile, des familles, des réfugiés. Tout ce qui suit sépare par **motif, âge d'arrivée, emploi**.

---

## Mise à jour 2025-2026 (03/11/2026)

> **Ce qui est ajouté ici, ce qui est conservé.** Cette section complète les §§ 0 à 5 ci-dessous, qui restent inchangés (historique conservé). Elle reprend les chiffres 2025 **lus à la source** et corrige deux points de définition. `⚠️` : non confirmé, listé dans `verifications.md` (V5580 à V5597).
>
> **Sources lues.** (1) DGEF, *Les étrangers en France 2025, Rapport au Parlement* (28/09/2026), PDF local `langagement-donnees/sources/immigration/dgef-rapport-parlement-2025.pdf`, tableaux pp. 41, 64-66, 78, 92, 105 (relu le 03/11/2026). (2) Eurostat, API officielle, jeux migr_resfirst, migr_asyappctza, migr_eiord, migr_eirtn, demo_pjan, JSON dans `langagement-donnees/sources/immigration/eurostat-*.json` (mis à jour par Eurostat le 30/09/2026 pour migr_eiord ; consultés le 03/11/2026). (3) Sénat, rapport n° 617 (13/05/2026) sur le projet de loi d'habilitation du pacte, PDF `senat-rapport-pacte-l25-617.pdf`. (4) Code civil et CESEDA, texte en vigueur (codes.droit.org, extraction XML Légifrance du 29/07/2026).
>
> **Ce qui n'a pas pu être lu.** Le site de la DGEF (immigration.interieur.gouv.fr) refuse les accès automatiques (HTTP 403) et je n'ai pas contourné ce refus. Les publications de janvier 2026 (« L'essentiel de l'immigration », 27/01/2026) ne sont donc **pas lues directement** : leurs chiffres provisoires sont connus par la presse et par le Rapport au Parlement, qui les reprend en version consolidée. EUR-Lex a répondu par une page vide (vérification anti-robot) : les règlements du pacte ne sont pas lus dans le texte ; leur contenu vient du rapport du Sénat et d'articles de juristes.

### M1. Le tableau de bord 2025 (DGEF, Rapport au Parlement) [Fait]

| Domaine | Indicateur 2025 | Valeur | Évolution 2024 | Source (page) |
|---|---|---|---|---|
| Titres | Premiers titres, total (pays tiers, provisoire) | **384 230** | +11,2 % (345 587) | Rapport p. 41 |
| | dont économique | 51 190 | −12,6 % | p. 41 |
| | dont familial | 91 100 | +0,1 % | p. 41 |
| | dont étudiants | 117 970 | +6,4 % (premier motif depuis 2022) | p. 41 |
| | dont humanitaire | 92 610 | **+65,0 %** | p. 41 |
| | dont divers (dont 7 870 Britanniques) | 31 360 | +8,4 % | p. 41 |
| | Renouvellements | 955 080 | +7,6 % | p. 7 (introduction) |
| Asile | Demandes reçues à l'Ofpra | 145 211 | −5,5 % | p. 92 |
| | Décisions Ofpra / dont protections | 156 590 / 63 594 | +10,3 % / +16,8 % | p. 92 |
| | CNDA : recours reçus / décisions / accords | 60 065 / 53 086 / 12 391 | +6,3 % / −13,8 % / −5,5 % | p. 92 |
| | Protections accordées au total | **78 782** | +12,1 % | p. 92 |
| | Taux de protection : Ofpra 41,2 % ; CNDA 23 % ; **synthétique 52,1 %** | 52,1 % | +2,7 points (49,4 %) | pp. 78, 92 |
| Éloignement | Mesures d'éloignement prononcées (toutes catégories) | **156 180** | +7,6 % | p. 65 |
| | dont « retour » de ressortissants de pays tiers (OQTF et assimilés) | 137 980 | +7,0 % | p. 65 |
| | Interpellations d'étrangers en situation irrégulière | 175 051 | +19 % | p. 64 |
| | Éloignements forcés | **15 253** | +20,7 % | p. 65 |
| | Éloignements aidés / spontanés | 4 564 / 4 458 | −0,5 % / +15,5 % | p. 65 |
| | **Total éloignements (forcés + aidés + spontanés)** | **24 275** | +15,5 % (21 011) | p. 65 |
| | Assignations à résidence | 32 132 | +29,3 % | p. 66 |
| Nationalité | Acquisitions par décret (naturalisations et effets collectifs) | 42 246 | −13,5 % | p. 105 |
| | Acquisitions par mariage | 17 579 | +10,5 % | p. 105 |
| | Ensemble des acquisitions, ressort du ministère de l'intérieur | 62 235 | −6,8 % | p. 105 |
| | Ensemble des acquisitions (toutes voies, justice comprise) | non publié pour 2025 (103 661 en 2024) | | p. 105 |

**Lecture.** (1) La hausse des titres vient presque entièrement du motif humanitaire (+36 495 sur +38 643 au total) ; l'économique **baisse** de 7 400. (2) L'écart entre « 384 230 » (DGEF) et « 377 462 » (Eurostat) n'est pas un conflit : l'un est un champ national (pays tiers, provisoire), l'autre le champ Eurostat ; la cause exacte de l'écart de 6 768 n'est pas documentée ici ⚠️ V5580. (3) Le chiffre « 24 985 éloignements » entendu en janvier est la version provisoire des 24 275 consolidés ⚠️ V5581 : citer **24 275** (Rapport au Parlement), précisant « France métropolitaine, majeurs ». (4) Le taux de protection de 52,1 % est tiré par les Afghans, Ukrainiens et Haïtiens (Rapport p. 78) ; le Sénat y ajoute une extension jurisprudentielle du « groupe social » (rapport n° 617, p. 7) : c'est l'analyse des rapporteurs, pas un fait.

### M2. Le taux d'exécution des OQTF : sept définitions, sept chiffres [Calcul]

Aucune publication officielle ne donne « le » taux d'exécution des OQTF. Les chiffres qui circulent divisent des numérateurs et des dénominateurs différents. Calcul à partir du Rapport au Parlement 2025 (pp. 65) et d'Eurostat 2025 :

| # | Définition | Numérateur | Dénominateur | Taux |
|---|---|---|---|---|
| 1 | Éloignements **forcés** / toutes mesures prononcées | 15 253 | 156 180 | **9,8 %** |
| 2 | **Tous** éloignements (forcés, aidés, spontanés) / toutes mesures | 24 275 | 156 180 | **15,5 %** |
| 3 | Forcés vers pays tiers (hors UE) / mesures « retour » pays tiers | 6 180 | 137 980 | **4,5 %** |
| 4 | Eurostat : retours vers **pays tiers** / ordres de quitter (non-UE) | 14 940 | 137 550 | **10,9 %** |
| 5 | Eurostat : retours **toutes destinations** / ordres de quitter | 18 930 | 137 550 | **13,8 %** (UE : 32,1 %) |
| 6 | Cour des comptes (2019-2022), déboutés du droit d'asile seulement | n.d. | n.d. | **2 %** ⚠️ V5582 |
| 7 | Cour des comptes (janvier 2024), sur 2022, déjà cité au § 1.5 | 15 400 | 134 280 | ≈ 11 % (« autour de 10 % ») |

**Pourquoi ils divergent [Calcul].**
- Le **dénominateur** change : « 156 180 » inclut des réadmissions vers l'UE (13 104) et des renvois de ressortissants de l'UE (5 096), qui ne sont pas des OQTF ; « 137 980 » ne garde que les pays tiers.
- Le **numérateur** change : seuls les éloignements *forcés* supposent une contrainte ; les « aidés » (4 564) et « spontanés » (4 458) sont des départs constatés, plus faciles à obtenir mais comptés dans le taux 2 et non dans le taux 1. Les « sorties du territoire » de 2024 comprenaient des départs spontanés sans mesure (6 101) qui ne sont plus comptés en 2025 (zéro, car l'aide au retour exige désormais une mesure d'éloignement : loi du 26 janvier 2024 ; Rapport p. 66). **La baisse du « total des sorties » de 27 201 à 24 275 (−10,8 %) est donc un artefact de définition, pas un recul.**
- Les **cohortes** diffèrent : les départs d'une année concernent des mesures prises les années précédentes ; aucun de ces ratios n'est un taux de suivi d'une cohorte.
- **Eurostat** ne compte que les retours *enregistrés* et arrondit à 5 ; la France y apparaît à 137 550 ordres contre 137 980 mesures « retour » de pays tiers dans le Rapport (concordant), mais les 18 930 retours Eurostat ne correspondent à aucune somme des lignes DGEF (forcés 15 253 + aidés 4 564 + spontanés 4 458 = 24 275, ou seulement ceux vers pays tiers) ⚠️ V5583.
- **Ce que le manifeste doit écrire.** « Environ un éloignement forcé pour dix mesures prononcées, un départ constaté pour six » (taux 1 et 2), en nommant la définition. Les « 14 % contre 32 % dans l'UE » du § 5.1 ci-dessous sont le **taux 5** ; le chiffre comparable pays tiers est **10,9 % contre 28,6 %** (Eurostat). Aucun des sept ne mesure « OQTF notifiées puis exécutées dans l'année », que l'État ne publie pas.

### M3. Comparaison européenne 2025 (Eurostat) [Fait + Calcul]

Graphique : `langagement-donnees/resultats/immigration/immigration_ue_2025.png` ; données et script : `immigration_ue_2025.csv` et `.py` (même dossier, sans pandas).

| Pays | Premiers titres 2025 | pour 1 000 hab. | Demandes d'asile 2025 (toutes) | pour 1 000 hab. | Ordres de quitter | Retours vers pays tiers | Taux (pays tiers) | Taux (toutes dest.) |
|---|---|---|---|---|---|---|---|---|
| France | 377 462 | **5,5** | 151 665 | 2,2 | 137 550 | 14 940 | **10,9 %** | 13,8 % |
| Allemagne | 605 292 | 7,2 | 168 450 | 2,0 | 55 240 | 29 295 | 53,0 % | 65,3 % |
| Italie | 433 099 | 7,3 | 135 485 | 2,3 | 21 295 | 4 780 | 22,4 % | 22,4 % |
| Espagne | 635 438 | 12,9 | 143 715 | 2,9 | 53 700 | 5 705 | 10,6 % | 10,6 % |
| Pays-Bas | 120 161 | 6,7 | 25 860 | 1,4 | 31 230 | 4 825 | 15,5 % | 15,9 % |
| Suède | 61 196 | 5,8 | 10 620 | 1,0 | 18 340 | 11 250 | 61,3 % | 76,3 % |
| UE 27 | 3 860 000 | 8,6 | 802 910 | 1,8 | 486 705 | 139 270 | 28,6 % | 32,1 % |

Populations : Eurostat demo_pjan, 1er janvier 2025 (France 68,88 M ; Allemagne 83,58 M ; UE 450,65 M). Asile : migr_asyappctza, demandeurs « total » ; pour la France, dont 116 475 premières demandes et 35 190 demandes ultérieures.

**Ce que ça dit [Interprétation, à nuancer].**
- **Flux légaux** : la France est **en dessous** de la moyenne UE (5,5 contre 8,6 pour 1 000) et au niveau de la Suède ; l'Espagne est à plus du double. La thèse d'une France « ouverte » ne se lit pas dans ce chiffre ; elle se lit dans l'asile.
- **Asile** : 2,2 pour 1 000 contre 1,8 dans l'UE : au-dessus de la moyenne, sous l'Italie et l'Espagne (flux irréguliers par la mer ; attention aux demandes ultérieures : la France en compte 35 190, soit 23 % des siennes, l'Espagne 2 %).
- **Retours** : la France est à **10,9 %**, au niveau de l'Espagne (10,6 %), loin de l'Allemagne (53 %) et de la Suède (61 %). **Mais** ces deux pays comptent peu d'ordres (55 k et 18 k contre 138 k) : la France prononce 2,5 fois plus d'ordres que l'Allemagne pour un nombre de retours deux fois moindre. Le taux dépend autant de la **politique de prononcé** (on ne notifie que ce qu'on peut exécuter, ou on notifie tout) que de l'exécution. Comparer des taux sans comparer ce que chaque État appelle « ordre » est fragile ⚠️ V5584.
- **Limite** : les trois indicateurs ne se multiplient pas : les ordres de 2025 concernent des personnes arrivées à des dates différentes ; Eurostat arrondit ; les comparaisons de retours supposent des définitions nationales harmonisées de façon imparfaite.

### M4. Le pacte européen sur la migration et l'asile (applicable depuis le 12 juin 2026)

**Lu à la source (Sénat, rapport n° 617, 13/05/2026, pp. 7-9)** [Fait] :
1. **Filtrage** aux frontières extérieures : triple contrôle (identité, santé, sécurité) des personnes qui ne remplissent pas les conditions d'entrée ; étendu aux irréguliers interpellés sur le territoire, dans un délai plus bref. Données versées à **Eurodac**, dont les finalités sont élargies.
2. **Procédure d'asile à la frontière** : demande traitée en **douze semaines**, le demandeur étant réputé non entré sur le territoire (assignation ou zone d'attente) ; en cas de rejet, refus d'entrée et retour à la frontière, avec rétention possible.
3. **Procédure accélérée** obligatoire dans plus de cas, **trois mois** ; notions de pays d'origine sûr et pays tiers sûr élargies ; règles de Dublin révisées (responsabilité plus longue, délais réduits, recours contre les transferts révisés).
4. **Solidarité** : réserve annuelle (relocalisation, contribution financière ou mesures alternatives). Pour 2026, décision d'exécution (UE) 2025/2642 du Conseil du 22/12/2025 : contribution de la France de **3 361 relocalisations**.
5. **Garanties pour les demandeurs** renforcées, dont mineurs non accompagnés, traduction des pièces par l'Ofpra à ses frais, conditions matérielles d'accueil (retrait devenant l'exception).

**Ce que ça change pour la France [Fait / Opinion].**
- **Retard de transposition.** La France n'a pas transposé à temps : projet de loi d'habilitation (ordonnances) adopté par le Sénat le 20/05/2026, rejeté en commission des lois de l'Assemblée le 22/07/2026 (voir § 5.0). Le ministre de l'intérieur a averti, devant le Sénat, d'une « admission quasi systématique » à la frontière sans adaptation (rapport n° 617, p. 10).
- **Capacité d'attente et durée.** Un juriste (V. Tchen, Club des juristes, 29/05/2026) relève un passage de 26 jours à **16 semaines** de maintien en zone d'attente, une capacité actuelle de **181 places** aux aéroports parisiens contre 615 « adéquates » selon la Commission, environ 1 000 personnes par an concernées, et un délai de recours de 48 h porté à **5 jours** minimum ⚠️ V5585 (article d'un universitaire, règlement 2024/1348 non lu ; **16 semaines contre 12** dans le Sénat : écart à expliquer, peut-être l'addition de la procédure de retour à la frontière).
- **Exécution des retours.** Le pacte ne règle pas la question des laissez-passer consulaires : le goulot est dans les pays d'origine (voir M5). Il agit sur les **entrées** et la **procédure**, pas sur le stock de personnes déjà présentes.
- **Règlement retour (hors pacte).** Accord politique Parlement-Conseil du **01/06/2026** sur un règlement « retour » : renvoi possible vers un pays tiers sur la base d'un accord ou arrangement (« return hubs ») avec un pays qui respecte les normes de droits de l'homme ; les hubs ne fonctionnent qu'après négociation avec des pays tiers. Publication au JOUE et entrée en vigueur **non confirmées** ⚠️ V5586 (informations de presse et de juristes, pas le texte).

### M5. Chaque position de l'auteur : la donnée, la contrainte juridique

Légende : « Droit » = texte en vigueur lu (codes.droit.org) sauf mention ⚠️. Ce sont des **contraintes**, pas des verdicts : le manifeste peut proposer de changer la loi, mais doit dire ce qu'il faut réviser (loi, traité, Constitution).

| Position de l'auteur | Ce que disent les données | Contrainte juridique | Verdict de faisabilité [Opinion de Claude] |
|---|---|---|---|
| **Contrôler l'immigration** | Flux légaux sous la moyenne UE (5,5 contre 8,6 ‰) ; 384 230 titres dont 24 % familial, 31 % études, 13 % économique, 24 % humanitaire (Rapport p. 41) ; la hausse 2025 vient du humanitaire | Aucun droit général d'entrée (93-325 DC, § 5.1) ; asile = droit constitutionnel (préambule de 1946, al. 4) et Convention de Genève ; Pacte et libre circulation UE hors du champ national | **Faisable** pour travail, études, famille ; **non plafonnable par la loi nationale** pour l'asile ni pour les Européens |
| **Pas d'immigration illégale** | 175 051 interpellations ; 156 180 mesures ; 15 253 forcés (9,8 %) ; AME 458 681 comme borne basse du stock (§ 1.6) ; retours 10,9 % contre 28,6 % UE | Directive 2008/115 (départ volontaire, rétention proportionnée) ; **CESEDA L. 612-1** : 30 jours de départ volontaire, supprimés dans les cas de L. 612-2 (menace, fraude, risque de fuite) ; CEDH art. 3 (non-refoulement, absolu) et art. 5 (rétention) ; contrôle du juge (93-325 DC) | **Partiellement** : le goulot est consulaire et contentieux, pas législatif ; « zéro » est inaccessible, une baisse du stock l'est |
| **Assimilation** | Naturalisation par décret 42 246 ; TeO2 : 94 % des descendants de deux immigrés se sentent français (§ 4.2) | **Code civil art. 21-24** : assimilation à la communauté française, langue (niveau fixé par décret ; B2 dans la loi du 26/01/2024, § 4.1), histoire, culture, adhésion aux principes essentiels de la République, charte des droits et devoirs ; art. 21-17 : 5 ans de résidence ; l'« assimilation » est déjà dans le droit | **Déjà en vigueur** ; ce qui manque est la mesure : pas de suivi publié des échecs de naturalisation par motif ⚠️ V5587 |
| **Expulsion en cas de délit ou de crime** | Pas de donnée lue ici sur la part d'étrangers parmi les condamnés ou les détenus ⚠️ V5588 (à chercher : ministère de la justice, DAP) ; 15 253 forcés au total, dont 6 180 vers pays tiers | **CESEDA L. 631-1** : expulsion si menace grave pour l'ordre public ; **L. 631-2** : protégés (parent d'enfant français, marié depuis 3 ans avec un Français, résident régulier depuis plus de 10 ans) sauf « nécessité impérieuse » **ou** condamnation définitive à 3 ans ou plus ; **L. 631-3** : arrivés avant 13 ans, plus de 20 ans de résidence, etc., seulement atteinte aux intérêts fondamentaux, terrorisme, provocation à la haine ; **CEDH art. 8** (vie privée et familiale) : mise en balance de la gravité, de la durée de séjour, des liens (arrêt *Üner c. Pays-Bas*, Grande Chambre, 18/10/2006 ⚠️ V5589) ; **CEDH art. 3** ; UE : citoyens européens expulsables sur « menace réelle, actuelle et suffisamment grave » (L. 251-1) | **Faisable en grande partie** : le droit permet déjà l'expulsion pour condamnation ≥ 3 ans même des protégés de L. 631-2 ; les **protections de L. 631-3** (arrivés avant 13 ans, 20 ans de séjour) et l'art. 8 CEDH sont les vraies bornes ; les lever = réviser le CESEDA et probablement dénoncer ou renégocier un engagement international |
| **Casier judiciaire exclut la naturalisation** | 42 246 acquisitions par décret en 2025 | **Code civil art. 21-27** : déjà exclus : condamnation pour atteinte aux intérêts fondamentaux ou terrorisme ; **toute** condamnation à 6 mois ou plus ferme ; arrêté d'expulsion non abrogé ; interdiction du territoire non exécutée ; séjour irrégulier. Exceptions : réhabilitation (art. 133-12 CP) ou exclusion du bulletin n° 2 | **Déjà largement en droit positif.** Pour aller plus loin (toute condamnation, même avec sursis), il faut modifier l'art. 21-27 ; la proportionnalité et la réhabilitation sont les bornes. **Cette position est en grande partie déjà la loi** |
| **Expulsion vers un pays tiers (pas le pays d'origine)** | 6 180 éloignements forcés de ressortissants de pays tiers vers des pays tiers en 2025 (−5,1 %) et 6 596 vers l'UE ou l'EEE (+64,2 %, réadmissions et transferts Dublin) (Rapport p. 65) | Règlement « retour » : accord politique du 01/06/2026, « return hubs » vers un pays tiers sûr avec accord bilatéral ou UE ⚠️ V5586 ; **CEDH art. 3** : pas d'envoi vers un pays où existe un risque réel de torture ou de traitements inhumains, y compris par ricochet (arrêt *Saadi c. Italie*, GC, 28/02/2008 ⚠️ V5590) ; notion de « pays tiers sûr » révisée par le pacte | **Dépend d'accords que la France ne contrôle pas** : aucun pays tiers ne reprend sans contrepartie ; coût et contrôle du juge non chiffrés ⚠️ V5591 |
| **Accord franco-algérien de 1968** (France-Algérie, cité au § 5.4) | Stock de certificats de résidence algériens : 616 419 au 31/12/2025 (+0,4 %) ; premiers titres aux Algériens en baisse pour la 3e année (29 346 en 2024, −8,3 %) ; en 2025, Marocains premiers, Algériens 2es, Tunisiens 3es (Rapport p. 45) | Traité bilatéral ; en droit français, un traité ratifié prime sur la loi (Constitution art. 55) : la loi ne peut pas l'écarter, seule la **dénonciation ou la renégociation** par l'exécutif le peut ; résolution RN du 30/10/2025 (185 contre 184) non contraignante ; Premier ministre : « révision nécessaire » (08/02/2026) ; Alger rejette une révision unilatérale ⚠️ V5592 | **Négociation, pas loi** : toute mesure unilatérale expose à des représailles consulaires, or le **laissez-passer consulaire** algérien conditionne les retours (lien non chiffré ici ⚠️ V5593) |

### M6. Ce que cette mise à jour change dans les conclusions du § 0 et du § 5

1. **Aucune de ces données ne contredit les six constats du § 0.** La hausse de 2025 est **humanitaire** (+65 %), pas économique ni familiale.
2. **Corrections de vocabulaire à reporter** : écrire « 9,8 % d'éloignements forcés rapportés aux mesures prononcées » et pas « 14 % d'OQTF exécutées » ; « 24 275 éloignements, métropole, majeurs » ; ne pas comparer le total des sorties 2024 et 2025 (artefact).
3. **Pour la position « casier et naturalisation »**, le manifeste doit commencer par dire que le droit en vigueur l'applique déjà largement (art. 21-27) : proposer ce qui existe passerait pour du vide.
4. **La contrainte qui borne le plus** : l'expulsion de personnes arrivées enfants ou installées depuis plus de 20 ans (CESEDA L. 631-3, CEDH art. 8), et l'obtention des laissez-passer consulaires.
5. **Conflit d'intérêts et biais** : l'IA qui écrit ceci n'a pas lu le site de la DGEF (403) ni les règlements européens dans leur texte ; les jugements de faisabilité sont des opinions de Claude, à contredire.

**Fiches de vérification** : V5580 à V5597 dans `verifications.md`.

---

## 0. Six constats chiffrés

1. **Stock et flux dans la moyenne européenne [Fait].** 7,97 millions d'immigrés en 2025, soit 11,6 % de la population (Insee) ; 14,0 % de personnes nées à l'étranger contre 14,4 % dans l'UE ; 5,5 premiers titres pour 1 000 habitants contre 8,6 dans l'UE (Eurostat, 2025). La hausse depuis 2017 est réelle (solde migratoire moyen +163 000 en 2017-2021 contre +59 000 en 2006-2016, COR).
2. **Le contrôle est surtout nominal [Fait].** 156 180 mesures d'éloignement prononcées en 2025, 24 275 éloignements au total (≈ 15,5 %), dont 15 253 forcés (≈ 9,8 %) (DGEF, Rapport au Parlement 2025, définitif, 28/09/2026 ; le dépliant provisoire de juillet donnait 156 058, 23 549 et 14 133). La France prononce 28 % des ordres de quitter l'UE et en exécute ≈ 14 % (32 % pour l'UE). Estimation du stock irrégulier : 600 000 à 900 000, sans base statistique (rapport Rodwell).
3. **Le solde budgétaire net est incertain en signe, pas en ordre de grandeur [Étude].** Entre −0,5 % et +0,5 % du PIB (CEPII, 1979-2011) ; −0,53 % à +1,02 % (OCDE 2021, reprises de presse ⚠️) ; ≈ −1,2 à −1,4 % (OID, contesté). Soit, à PIB 2024 = 2 935 Md€ (H1, Eurostat), de **−40 à +30 Md€ par an** selon les conventions : l'écart vient des choix de méthode, pas d'un fait caché.
4. **La hiérarchie, elle, est stable d'une étude à l'autre [Étude].** Travail qualifié > travail peu qualifié > famille > asile pour la contribution sur la vie entière (Danemark, Pays-Bas, Royaume-Uni). Le niveau d'emploi après l'arrivée pèse plus que le volume.
5. **Le point faible français est l'emploi, pas le nombre [Fait].** Taux d'emploi des 20-64 ans nés hors UE : 63,1 % contre 77,2 % pour les natifs (−14,1 points ; −8,6 dans l'UE) ; 54,1 % pour les femmes (Eurostat, 2025). Un testing de la Dares (2021) mesure −31,5 % de chances d'être rappelé pour un nom à consonance maghrébine.
6. **L'immigration ne sauve pas les retraites, elle les aide [Projection].** ±80 000 migrants par an changent les dépenses de retraite de ±1,1 point de PIB en 2070 (COR 2026) ; sans migration, la population de 20-64 ans serait 1,7 million plus basse en 2050, mais le ratio 65+/20-64 ans resterait presque identique en 2070 (57,3 % contre 57,6 %, Eurostat) : les migrants vieillissent aussi.

**Lecture d'ensemble [Opinion de Claude, à contester].** Les chiffres ne donnent raison ni à « tout fermer » (pénuries de soins et de BTP, démographie), ni à « ouvrir » (coût de l'asile et du regroupement peu qualifié à court terme, emploi faible). Ils déplacent la question : de « combien » vers « lesquels, avec quel emploi, et avec quel contrôle effectif ». Les principes posés par l'auteur (assimilation, pas d'immigration illégale) sont cohérents avec ce déplacement, mais les chiffres ne les fondent pas, ils les rendent seulement praticables.

---

## 1. Faits de base (sources primaires)

### 1.1 Définitions
Immigré (né étranger à l'étranger, peut être naturalisé), étranger (sans nationalité française, peut être né en France), descendant (2e génération), « né à l'étranger » d'Eurostat (inclut les Français nés hors de France). Les trois séries ne se recouvrent pas ; ne jamais en citer une pour une autre (Insee).

### 1.2 Stocks et structure [Fait]
- 2025 (estimation provisoire Insee) : 68,9 M d'habitants ; immigrés 7,97 M (11,6 %), dont 2,63 M naturalisés ; étrangers 6,30 M (9,1 %). Origines des immigrés : Afrique 49,2 %, Europe 30,3 %, Asie 14,3 %, Amériques-Océanie 6,2 % ; Algérie 12,6 %, Maroc 11,7 %, Portugal 7,2 %. Rupture de série en 2024.
- Part des immigrés : 7,4 % (1975), 8,5 % (2010), 11,6 % (2025). Détail et fichier : `sources/recherche-immigration.md` § 1.2.
- **TeO2 (Ined-Insee, 2019-2020, 27 000 personnes de 18 à 59 ans, ouvrage Ined du 21/05/2026)** : parmi les 18-59 ans, 13 % d'immigrés, 11 % de descendants, 10 % de 3e génération ; **41 %** de la tranche d'âge a un lien à l'immigration par l'origine ou par l'union. Les immigrés qui arrivent après 16 ans ont, pour 73 %, un niveau d'instruction supérieur à leurs homologues restés au pays (85 % dans le groupe le plus fort). Un immigré sur cinq a déjà été sans papiers (la moitié de ces cas : entrés avec un visa puis perdu le droit au séjour) ; un naturalisé sur cinq aussi. Un immigré sur six a déjà vécu sans logement personnel (16 % contre 3 %).[^teo2]
- Emploi, diplôme, secteurs : § 3 ci-dessous et `recherche-immigration.md` § 3.2 et 3.4 (immigrés = 38,8 % des employés de maison, 27,0 % des ouvriers non qualifiés du gros œuvre, 14,6 % des médecins en activité régulière, contre 10,2 % de l'emploi total).

### 1.3 Flux légaux : premiers titres par motif [Fait]
| 2025 (DGEF/Eurostat, provisoire) | Titres |
|---|---|
| Total | 377 462 (+9,2 %) |
| Famille | 90 959 |
| Études | 118 404 (premier motif depuis 2022) |
| Travail | 50 848 (−13 %) |
| Autres, dont humanitaire | 117 251 (humanitaire : 88 001, +56,8 %) |

Le motif « travail » représente donc **≈ 13 %** des premiers titres, le motif familial ≈ 24 %, les études ≈ 31 % : la « sélection » économique est déjà la plus petite voie d'entrée. Régularisations (AES et liens personnels et familiaux) : 27 819 (−11 %). Acquisitions de nationalité : 98 139 (Insee, 2025). Stock de titres valides : 4 470 970 au 31/12/2025.

### 1.4 Asile [Fait]
- 151 665 demandeurs en 2025 (dont 116 475 premières demandes ; Eurostat). Ofpra : 145 210 demandes, taux de protection **41,2 %** avant recours ; taux synthétique Ofpra + CNDA **52,1 %** (49,4 % en 2024) (dépliant DGEF, juillet 2026). Troisième pays d'asile de l'UE en valeur absolue, 1,7 primo-demandeur pour 1 000 habitants (UE : 1,5).
- Le **pacte européen asile et migration** s'applique depuis le 12/06/2026 (filtrage aux frontières, procédure de frontière de 12 semaines avec décision de retour simultanée). La France l'applique par décrets 2026-453 et 2026-454 du 06/06/2026 et une circulaire du 10/06/2026 ; la loi d'habilitation a été rejetée en commission des lois de l'Assemblée le 22/07/2026 (voir `recherche-immigration.md` § 5.0). ⚠️ V4121.

### 1.5 Éloignements [Fait, avec deux sources qui divergent]
- Dépliant DGEF (provisoire, juillet 2026) : 156 058 mesures, **14 133 forcés**, 23 549 éloignements au total, 175 051 interpellations. Rapport au Parlement 2025 (28/09/2026) : **15 253 forcés**, 24 275 au total. L'écart s'explique : le dépliant est provisoire, le Rapport au Parlement donne les chiffres consolidés (relu le 03/11/2026, tableaux p. 65-66 ; PDF dans `langagement-donnees/sources/immigration/dgef-rapport-parlement-2025.pdf`) : citer le Rapport au Parlement (V4122 ✅). Coquille du rapport : le texte parle de « 156 180 en 2024 » pour les mesures, le tableau les attribue à 2025.
- Taux d'exécution : « autour de 10 % » (Cour des comptes, janvier 2024, sur 2022 : 15 400 départs pour 134 280 OQTF) ; « de l'ordre de 15 % » en 2025 (rapport Rodwell). Coût de la politique : 1,8 Md€ (Cour des comptes, 2024) puis 2,1 Md€ (Rodwell, 2026) ; périmètres à comparer avant de parler de hausse. Un éloignement forcé coûte en moyenne 4 414 €, une journée de rétention 602 €.
- Obstacles : laissez-passer consulaires, recours, abrogations (la DGEF estime que 17 % des mesures ne peuvent pas être exécutées), refus de certains pays d'origine.

### 1.6 Immigration irrégulière : ce qu'on peut dire [Estimation]
Aucun décompte officiel. L'AME donne une borne basse : 458 681 bénéficiaires fin septembre 2025, 1,34 Md€ de dépenses en 2025 (**≈ 2 900 € par bénéficiaire**, calcul `immigration.py`). Limites : tous les sans-papiers ne la demandent pas ; certains bénéficiaires sont en attente de régularisation ; l'AME est conditionnée à trois mois de présence. Le rapport Rodwell avance 600 000 à 900 000 personnes **sans base statistique solide**. TeO2 ajoute un fait utile : l'irrégularité est souvent un **passage** (un cinquième des naturalisés ont connu les « sans-papiers ») et non un état permanent. Pour l'AME, l'ordre de grandeur de ce que gagnerait sa suppression (1,3 Md€ au plus ; crédits LFI 2025 et PLF 2026 : 1,208 Md€, dépenses réelles d'AME de droit commun 1,255 Md€ en 2024 et 1,314 Md€ estimés en 2025, Sénat, note sur la mission Santé, PLF 2026, https://www.senat.fr/fileadmin/cru-1762483659/Commissions/Finances/2025-2026/PLF_2026/NP/Sante_PLF_2026_NP.pdf, lue le 03/11/2026) est faible comparé au coût de la politique d'éloignement (≈ 2 Md€) et aux dépenses de santé publique qu'elle reporterait aux urgences (effet non mesuré ici ⚠️ V4123).

---

## 2. Impact budgétaire : la fourchette et ses raisons

### 2.1 Les estimations [Étude]
| Source | Résultat | Convention |
|---|---|---|
| CEPII, Chojnicki-Ragot-Sokhna (2018 ; *Revue économique* 2022), 1979-2011 | contribution au budget primaire **entre −0,5 % et +0,5 % du PIB**, globalement négative mais faible | comptabilité annuelle, hors dette, enfants nés en France comptés comme natifs |
| OCDE, *Perspectives des migrations internationales 2021*, chap. 4 (25 pays, 2006-2018) | impact net entre ≈ −1 % et +1 % du PIB dans tous les pays ; **France −0,53 % (hors dette, iFRAP) ou +1,02 % (autre variante)** ⚠️ V4124 | coût moyen ou marginal des biens publics purs |
| Observatoire de l'immigration et de la démographie (OID) | coût net 35 à 40 Md€/an (≈ 1,4 % du PIB) | coût moyen intégral ; ratios d'années anciennes appliqués au PIB récent (critique de la Fondation Jean-Jaurès) ; **estimation non revue par les pairs** |
| Danemark, ministère des Finances (2018) | non occidentaux −31 Md DKK, occidentaux +7 Md DKK ⚠️ | photographie annuelle, non corrigée de la conjoncture |
| Pays-Bas, van de Beek et al. (2021) | environ +100 000 € (travail), −200 000 € (famille), −400 000 € (asile) sur la vie ⚠️ | cycle de vie ; étude non revue par les pairs, financement contesté |
| Royaume-Uni, OBR (2024), MAC (2025) | positif pour hauts salaires, négatif pour bas salaires (aides à domicile, conjoints) | projections officielles |

### 2.2 Ce qui fait varier le résultat [Calcul, `immigration.py::fourchette_budgetaire`]
À PIB 2024 = 2 935 Md€ (H1 sourcée : Eurostat nama_10_gdp, consulté le 03/11/2026, V4125) : CEPII −14,7 à +14,7 Md€ ; OCDE France −15,6 à +29,9 Md€ ; OID −35 à −40 Md€. **Amplitude totale ≈ 70 Md€ par an**, soit plus que l'effet réel probable de n'importe quelle option du § 5.

Les quatre sources de l'écart :
1. **Biens publics purs** (défense, dette, justice) : les imputer par tête (coût moyen) rend le solde négatif ; ne pas les imputer (coût marginal) le rend positif. C'est un choix de philosophie, pas de mesure : un migrant de plus ne fait pas augmenter le coût de la défense.
2. **Enfants nés en France** : coût de l'immigration ou futurs contribuables natifs ? La 2e génération fait partie des meilleurs contributeurs (National Academies 2017).
3. **Photographie ou vie entière** : l'instantané favorise une immigration jeune et pénalise celle qui vieillit ; le cycle de vie intègre les retraites.
4. **Année et conjoncture** : une crise dégrade le solde ; l'emploi est la variable qui bouge le plus.

### 2.3 Variable la plus actionnable : l'emploi [Calcul]
Écart d'emploi des nés hors UE avec les natifs : 14,1 points ; avec la moyenne européenne de la même catégorie : 5,5 points. Si 25 %, 50 % ou 100 % de l'écart avec les natifs était comblé (H4) sur 4,5 millions de personnes de 20-64 ans nées hors UE (H2, ⚠️ V4126) : 160 000, 320 000 ou 630 000 emplois de plus, et, à 5 000, 10 000 ou 15 000 € de gain net annuel par emploi (H3, hypothèse, non sourcée) : **+0,8, +3,2 ou +9,5 Md€ par an** (0,03 %, 0,11 %, 0,33 % du PIB). Ordre de grandeur cohérent avec l'OCDE (plus d'un tiers de point de PIB pour les pays qui comblent l'écart). C'est le **plus grand levier budgétaire accessible sans toucher aux flux**, mais il reste dix fois plus petit que l'écart entre les conventions du § 2.2 : ce qu'on ne sait pas dépasse ce qu'on peut gagner.

### 2.4 Ce qu'on peut dire honnêtement
- **Fait** : l'effet net moyen est faible (quelques dixièmes de point de PIB) et de signe incertain.
- **Fait** : il existe de fortes différences par motif, âge d'arrivée et emploi.
- **Estimation** : l'asile et le regroupement peu qualifié coûtent au budget à court et moyen terme ; le travail qualifié rapporte.
- **Opinion** (à ne pas confondre) : décider du volume par le seul solde budgétaire reviendrait à ne juger les humains que sur leur contribution fiscale ; c'est un choix de valeurs que le manifeste devrait énoncer et non cacher (la Convention de Genève et l'article 8 de la CEDH relèvent d'une autre logique, voir § 5.4).
- **Manque** : aucune étude française récente n'apparie les titres de séjour (AGDREF) aux données fiscales et sociales par motif d'entrée. C'est **la donnée qui manque le plus** ; c'est aussi une mesure de transparence que l'État pourrait publier (le manifeste veut un État qui rend des comptes).

---

## 3. Marché du travail et démographie

### 3.1 Salaires et emploi des natifs [État de la recherche]
- **Établi.** Effet moyen de long terme quasi nul sur les salaires des natifs (National Academies, 2017) ; peu d'effet sur l'emploi total ; effets négatifs, quand ils existent, sur les immigrés déjà installés et sur les natifs sans diplôme du secondaire.
- **Débattu.** Borjas (États-Unis, comparaisons par groupes d'expérience) trouve des baisses de salaire des moins diplômés ; Card (choc de Mariel, 1990) n'en trouve pas ; la différence vient de la définition du marché du travail concerné et du traitement des natifs qui partent. Pour la France : Edo (2020, rapatriés d'Algérie 1962) trouve une baisse locale à court terme qui se résorbe en une quinzaine d'années ; Ortega et Verdugo (2014, 1968-1999) trouvent +3,3 % de salaire pour +10 points de part d'immigrés (estimation fragile).
- **Manque.** Études françaises récentes sur les effets par métier ; effets de composition entre vagues d'arrivée.
- **Opinion défendable sans contredire les études.** Les moins qualifiés sont les seuls à pouvoir supporter une partie du coût à court terme ; ils sont aussi ceux qui votent le plus contre l'immigration. Une politique honnête le dit et compense (formation, salaire minimum appliqué).

### 3.2 Métiers en tension [Fait / Projection]
Dares et France Stratégie (2022) : ≈ 760 000 postes à pourvoir par an en 2030, dont 90 % pour remplacer des départs ; +100 000 aides à domicile. Drees (février 2026) : 150 000 à 200 000 emplois supplémentaires d'ici 2050 pour l'autonomie. Part des immigrés dans ces métiers : voir § 1.2. **Nuance** : une partie de la « pénurie » tient aux salaires et aux conditions de travail ; recruter à l'étranger peut freiner la hausse qui la corrigerait (débattu, ampleur inconnue).

### 3.3 Ratio actifs/retraités [Projection]
- Insee (juin 2026), solde migratoire +70 000 / +150 000 / +230 000 : population 2070 de 60,9 / 65,9 / 70,8 M ; baisse de la population dès 2028 / 2037 / 2053 ; ratio 65+/20-64 de 40 % (2026) à 62 % (2070) dans le scénario central.
- COR (2026) : ±80 000 migrants par an = ±1,1 point de PIB de dépenses de retraite en 2070, soit ≈ **4 Md€ pour chaque tranche de 10 000** au PIB actuel (calcul illustratif) ; effet décroissant à long terme car les migrants prennent leur retraite ; le COR ne précise pas, dans les passages lus, le taux d'emploi des migrants supplémentaires (⚠️ V4127) : pour une immigration à faible emploi, l'effet est surestimé.
- Eurostat EUROPOP2023, France : sans migration, 1,7 M d'actifs de moins en 2050 et 2,4 M en 2070 ; mais ratio de dépendance presque inchangé en 2070. Un solde nul coûte cher (démographie, retraites) ; le niveau optimal ne ressort pas des projections.

### 3.4 Robots à la place des immigrés : ce qu'on peut chiffrer ou non
- **Établi (Acemoglu-Restrepo 2022, Danzer et al. 2024, Lewis 2011, Clemens et al. 2018)** : la rareté de main-d'œuvre pousse à automatiser, l'abondance freine ; immigration et robots sont en partie substituts.
- **Contre-exemples observés** : Japon (446 robots pour 10 000 salariés de l'industrie) et Corée du Sud (1 220), champions mondiaux, ont **augmenté** leur main-d'œuvre étrangère (2,57 M de travailleurs étrangers au Japon fin octobre 2025). Les robots de soin testés au Japon demandaient du travail humain supplémentaire (Wright, 2023).
- **Ce qu'on peut chiffrer** : le nombre d'emplois concernés (aides à domicile, BTP, restauration : § 3.2) ; le coût d'un remplacement n'est **pas chiffrable** aujourd'hui pour les soins et le gros œuvre, faute de robot démontré. Seul un horizon est défendable : court terme (jusqu'à 2032), non ; moyen terme, possible pour certains emplois de bureau, pas pour les soins ; long terme, hypothétique.
- **Friction à nommer [Opinion de Claude]** : « des robots à la place des immigrés » (Zemmour) et l'optimisme du manifeste sur la robotique ne sont un programme que si le robot existe ; sinon c'est une pénurie. La logique inverse est cohérente avec le manifeste : si le travail humain devient rare, chaque résident supplémentaire est un ayant droit supplémentaire d'un revenu universel, ce qui plaide pour une immigration **plus sélective et plus temporaire**, pas pour moins de contrôle des flux irréguliers seulement.

---

## 4. Intégration et « assimilation »

### 4.1 Sens juridique
- **Code civil, art. 21-24** : « Nul ne peut être naturalisé s'il ne justifie de son assimilation à la communauté française, notamment par une connaissance suffisante, selon sa condition, de la langue française, de l'histoire, de la culture et de la société françaises, et des droits et devoirs conférés par la nationalité » (formule rappelée dans des questions parlementaires, antérieure à 2024). **Texte en vigueur relu (03/11/2026, base LEGI locale, version du 27/01/2024, loi 2024-42 art. 20)** : l'assimilation s'apprécie par « une connaissance suffisante [...] de la langue, de l'histoire, de la culture et de la société françaises, dont le niveau et les modalités d'évaluation sont fixés par décret en Conseil d'État » ; la loi décrit elle-même le niveau de langue (comprendre le contenu essentiel de textes complexes, s'exprimer avec spontanéité : niveau B2 du CECRL) ; signature de la charte des droits et devoirs ; 5 ans de résidence habituelle (art. 21-17, relu) (V4128 ✅). Le juge administratif apprécie l'assimilation à partir d'indices : langue, insertion professionnelle, stabilité familiale, adhésion aux principes républicains (pratique de la naturalisation par décret, pouvoir discrétionnaire de l'administration).
- **Niveau de langue** : la loi du 26/01/2024 (art. 20) fait passer l'exigence de B1 à **B2** ; un décret du 15/07/2025 (n° 2025-648) le précise d'après le Gisti ; des décisions de juridiction de 2025-2026 citent encore B1 (candidatures antérieures ou non, non établi). ⚠️ V4129 : vérifier le texte en vigueur et la date d'application.
- **Notion juridique, pas ethnique** : le droit français parle d'assimilation à la *communauté française* (langue, culture civique, valeurs), jamais d'origine ; le mot reste chargé et l'État utilise aussi « intégration » (contrat d'intégration républicaine, CIR, pour les nouveaux titulaires d'un titre ; niveau de langue exigé, formation civique ; ⚠️ V4130, décrets non relus).
- **Durée de résidence** : 5 ans en règle générale (art. 21-17, ⚠️ V4130). Allemagne : 8 → 5 ans en 2024 (la voie à 3 ans a été supprimée le 30/10/2025).

### 4.2 Indicateurs mesurables
| Dimension | Résultat | Source |
|---|---|---|
| Sentiment d'être français | 71 % des immigrés, **94 %** des descendants de deux parents immigrés, 98 % des descendants de couple mixte, 97 % sans ascendance migratoire | TeO2 (2019-2020) |
| Appartenance au pays des parents | 75 % des descendants de deux parents immigrés la partagent aussi | TeO2 |
| Langue | 86 % des descendants de deux parents immigrés ont parlé français avec leurs parents dans l'enfance (68 % avec la langue des parents aussi) | TeO2 |
| Mixité des unions | 39 % des immigrés (29 % avec un conjoint sans ascendance migratoire), **59 %** des descendants (45 %) | TeO2 |
| Entre-soi amical | « Tous ou presque tous mes amis sont de la même origine » : 59 % population majoritaire, 21 % descendants de deux immigrés, 11 % immigrés | TeO2 |
| Discrimination déclarée (5 dernières années) | 14 % population majoritaire ; maximum pour Maghreb, Outre-mer, Afrique subsaharienne, surtout 2e génération ; l'expérience a augmenté depuis TeO1 | TeO2 |
| Emploi des descendants | 70 % (descendants d'immigrés) contre 79 % ; 12 % de chômage contre 6 % chez les diplômés bac+2 et plus | Insee Références 2023 |
| Testing à l'embauche | −31,5 % de rappels pour un nom maghrébin | Dares 2021 |

**Lecture [Opinion de Claude].** Les indicateurs culturels (langue, sentiment d'appartenance, mixité) montrent **plus** d'intégration à la deuxième génération qu'à la première ; les indicateurs d'inégalité et de discrimination montrent **moins**. TeO2 énonce le paradoxe : les descendants sont plus intégrés dans leurs pratiques et plus exposés à la discrimination fondée sur l'origine ou la couleur de peau. Deux limites : TeO2 mesure des expériences *déclarées* (exposition et capacité à nommer) ; et son périmètre est de 18 à 59 ans en métropole, donc ni les mineurs ni Mayotte. ⚠️ V4131 : chiffres repris du dossier de presse de l'Ined (PDF lu en local avec pypdf, 6 chapitres cités), non du texte complet de l'ouvrage.

### 4.3 Ce qui marche, selon les évaluations
| Pays | Dispositif | Ce que disent les évaluations | Limites |
|---|---|---|---|
| **Canada** | Points (Express Entry, Système de classement global) ; seuils de volumes (380 000 résidents permanents par an en 2026-2028 ; résidents temporaires ramenés de 673 650 à 385 000) | Évaluation IRCC (2020, cohortes 2015-2018) : revenus à un an +20 % par rapport aux non sélectionnés, +16 % après contrôle ; **mais** les candidats avec points bonus pour le français gagnent 14 % de moins : certains critères de points ne prédisent pas les revenus | Cohortes anciennes ; le Canada a dû réduire l'immigration temporaire après l'avoir laissée dériver ; cohérence politique du plafond ; ⚠️ V4132 (résumés et sources secondaires) |
| **Danemark** | Travail d'abord, formation linguistique, plafonds de prestations | Revue de 17 études : emploi des réfugiés monte vite sur sept ans puis plafonne, **−10 points** par rapport aux autres immigrés et **−25 points** par rapport aux natifs à 30 ans ; formation linguistique et affectation dans des bassins d'emploi dynamiques améliorent le long terme ; la baisse des prestations initiales **non** (JOLE 2024) ; l'appariement aux métiers en pénurie : +5-6 points un an après | Évaluations du Danemark du passé : « pas particulièrement réussi » avec les non-occidentaux (2018) ; effet de la politique plus restrictive sur les flux mesuré par Agersnap et al. (2020), contesté par une réanalyse (2026) |
| **Suisse** | Libre circulation UE + quotas pour pays tiers ; naturalisation exigeante (cantons) | Les citoyens ont **rejeté le 14/06/2026 l'initiative « Pas de Suisse à 10 millions »** par 54,79 % contre 45,21 % : un plafond démographique soumis au vote a été refusé, même si la préoccupation est forte | Pas d'évaluation d'intégration lue ; le cas montre surtout que le vote ne mène pas mécaniquement à la fermeture (⚠️ V4132) |
| **Allemagne** | Loi sur l'immigration qualifiée (2023), carte « opportunité » (Chancenkarte, non lu), naturalisation 8 → 5 ans en 2024, voie à 3 ans supprimée en 10/2025 | **332 500 naturalisations en 2025** (+14 % sur 2024, 292 000 ; chiffres provisoires, 467 400 demandes déposées ; Destatis, communiqué n° 186 du 03/06/2026, https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/06/PD26_186_125.html, lu le 03/11/2026 ; les 309 000 d'une enquête de presse auprès de 14 Länder sont dépassés) ; l'emploi des nés hors UE : 69,0 % contre 84,0 % pour les natifs (Eurostat 2025), écart de 15 points, **comparable à la France** | Aucune évaluation causale lue |
| **Royaume-Uni** | Système à points post-Brexit ; restrictions 2025 | Solde migratoire 204 000 (juin 2025) contre 649 000 un an plus tôt (ONS) : on peut baisser vite quand l'État contrôle les visas de travail et d'études | Effet sur les secteurs en tension non évalué ici ; les arrivées irrégulières (traversées) restent un sujet distinct ; ⚠️ V4132 |

**Ce que l'on peut en tirer [Interprétation].** (1) Un système à points améliore les revenus des admis, mais seulement si les critères sont **calibrés sur ce qui prédit réellement l'emploi** (langue, expérience, offre d'emploi), pas sur des bonus politiques. (2) La langue et l'accès rapide à l'emploi sont les leviers qui ont une preuve ; la sévérité des prestations a une preuve faible sur l'intégration. (3) Un plafond peut se baisser très vite à l'entrée par les visas (Royaume-Uni, Canada), au prix de pénuries et de contentieux. (4) Aucun pays comparé n'a réglé l'emploi des réfugiés.

---

## 5. Options pour le manifeste

Chaque option : ordre de grandeur, ce que disent les données, meilleure objection (steelman), contrainte juridique. **Aucune n'est un programme ; ce sont des pièces à combiner** (la combinaison est le choix de l'auteur).

### 5.1 Immigration de travail choisie à points
- **Ordre de grandeur.** Le travail représente 50 848 premiers titres sur 377 462 (≈ 13 %). Même un doublement (+50 000 par an) ne change pas le volume total ; il en change la **composition**. Comparaison : le Canada admet 380 000 résidents permanents (pour 41 millions d'habitants, plan 2026-2028).
- **Données.** Revenu des sélectionnés +16 % à +20 % (Canada) ; contribution la plus élevée pour le travail qualifié (Pays-Bas, Royaume-Uni).
- **Meilleure objection.** (a) Fuite des cerveaux des pays d'origine ; (b) les « points » sont gamables, et certains critères ne prédisent rien (bonus français : −14 %) ; (c) les métiers en tension sont mal payés, donc peu attractifs pour des candidats à points élevés : le système sélectionne des profils qui ne vont pas dans les métiers qui manquent.
- **Droit.** Compatible : le législateur peut conditionner l'entrée (aucun droit général d'entrée, 93-325 DC). Pour l'UE, la politique de visas de travail reste nationale ; la directive Carte bleue UE concerne les qualifiés (⚠️ V4133).

### 5.2 Quotas votés par référendum
- **Ordre de grandeur.** Un plafond ne peut agir que sur ce que l'État contrôle : titres de travail, d'études et familiaux (≈ 260 000 premiers titres en 2025 : 50 848 + 118 404 + 90 959), et non sur l'asile (droit constitutionnel) ni sur les Européens. Le solde migratoire de l'Insee (+150 000) mélange tout ; un plafond de « solde » n'est pas pilotable.
- **Données.** Suisse, 14/06/2026 : plafond à 10 millions rejeté par 54,79 % ; Canada : plafond fixé par le gouvernement puis révisé en 2025-2026 ; le vote **rend la décision légitime**, mais pas plus facile à exécuter.
- **Meilleure objection.** Un quota fixe est mal adapté aux chocs (guerres, pénuries soudaines) ; il est contourné par l'irrégularité (si l'admission légale est bridée sans moyens de contrôle) ; un référendum précoce fige un chiffre avant les données.
- **Droit.** **L'article 11 de la Constitution ne couvre pas, selon la lecture dominante, l'immigration** : il faudrait l'article 89 (révision) ou une révision de l'article 11 (RN, LR le proposent) ; la décision 2024-6 RIP (11/04/2024) a jugé disproportionnée une condition de 5 ans pour les prestations. Le plan de l'auteur (plateforme de vote, publication des chiffres avant) est cohérent avec cette option ; voir `recherche-immigration.md` § 5.0.

### 5.3 Exécution réelle des éloignements
- **Ordre de grandeur [Calcul].** Passer de 15 % à 25 % des 156 058 mesures exécutées (39 000 éloignements) = +15 500 par an ; à 50 % (78 000) = +54 500. Au coût moyen constant de 4 414 € par éloignement forcé (borne basse : les cas faciles sont déjà faits, le coût unitaire monte) : **+0,07 à +0,24 Md€ par an** ; plus la rétention (602 € par jour) et les personnels de justice. Coût total actuel de la politique : 1,8 à 2,1 Md€.
- **Données.** Les laissez-passer consulaires dépendent des pays d'origine (voir 5.4) ; la part exacte de chaque obstacle n'est pas établie ici. **Chiffres par pays (Rapport au Parlement 2025, p. 67-68, `dgef-rapport-parlement-2025.pdf`, lu le 03/11/2026)** : en 2025, 7 261 laissez-passer instruits, 55,1 % délivrés dans les délais (tous pays) ; par pays, part des laissez-passer délivrés dans les délais : Algérie 18,0 % (1 752 demandés), Tunisie 41,7 %, Maroc 70,6 %, Géorgie 97 %, Sénégal 13 % ; mesures d'éloignement exécutées rapportées aux mesures prononcées (calcul sur la colonne « exécutées » de la même table) : Algérie 2 539 / 27 244 = 9,3 %, Tunisie 14 %, Maroc 18 %, Géorgie 37 %, total 24 985 / 156 180 = 16 %. ⚠️ Le total de 24 985 de cette table ne correspond pas à son intitulé (« hors aides au départ et départs spontanés ») : la p. 65 donne 15 253 éloignements forcés et 24 275 en comptant aidés et spontanés ; écart non expliqué (V5581), donc les taux par pays sont des ordres de grandeur. Le lien entre refus de laissez-passer et taux d'exécution n'est que suggéré (Algérie : 18 % de laissez-passer délivrés dans les délais et 9 % d'exécution ; mais Côte d'Ivoire : 90 % et 9 %) ; pas de relation causale établie (V5593). Les pays à fort taux d'exécution (Allemagne 65 %) combinent retours volontaires et accords.
- **Meilleure objection.** Exécuter plus coûte et se heurte au droit : 17 % des mesures ne sont pas exécutables (recours, abrogations) ; la rétention (jusqu'à 90 jours pour le droit commun ⚠️) est limitée par la Constitution (93-325 DC : rétention et liberté individuelle, juge judiciaire) ; l'efficacité marginale est faible.
- **Droit.** Directive « retour » 2008/115 (départ volontaire, proportionnalité, rétention limitée) ⚠️ V4133 ; article 3 et article 8 de la CEDH ; contrôle du juge ; pacte 2026.

### 5.4 Accords avec les pays d'origine
- **Ordre de grandeur.** Les éloignements dépendent du consentement consulaire : l'efficacité agit directement sur le taux de 15 %. Les leviers : visas, aide au développement, accords de gestion concertée. Aucun chiffre d'efficacité robuste lu (⚠️ V4133).
- **Meilleure objection.** Le rapport de force est souvent défavorable (pays qui n'ont rien à gagner : remises d'argent, diaspora) ; l'accord franco-algérien de 1968 a fait l'objet d'une résolution RN (185 voix contre 184, 30/10/2025, non contraignante) ; conditionner l'aide au développement sacrifie un outil de prévention des départs.
- **Droit.** Les accords bilatéraux de réadmission restent compatibles avec le droit de l'UE ; l'accord de 1968 est un traité (dénonciation par l'exécutif).

### 5.5 Intégration exigeante (langue, emploi)
- **Ordre de grandeur.** C'est l'option dont le gain est **le plus certain** : combler 25 à 100 % de l'écart d'emploi des nés hors UE (14,1 points) représente 160 000 à 630 000 emplois et +0,8 à +9,5 Md€ par an (calcul § 2.3, hypothèses H2 à H4).
- **Données.** Formation linguistique et affectation à des bassins d'emploi dynamiques : effets longs prouvés au Danemark ; −31,5 % de rappels pour les noms maghrébins : la discrimination est un obstacle mesuré, pas une excuse.
- **Meilleure objection.** Exiger sans offrir (cours de langue en nombre, garde d'enfants pour les femmes, lutte contre la discrimination) revient à punir ; la condition d'emploi pour le droit au séjour crée des abus (employeurs) ; B2 est un niveau élevé pour un titulaire peu scolarisé.
- **Droit.** Les exigences de langue pour la naturalisation sont admises (art. 21-24) ; pour le regroupement familial, des conditions d'intégration sont possibles dans le cadre de la directive 2003/86 ⚠️ ; mais l'article 8 de la CEDH et le droit à une vie familiale normale limitent les refus (93-325 DC : cons. 70, 74-75).

### 5.6 Régularisation par le travail
- **Ordre de grandeur.** Régularisations actuelles : 27 819 par an (AES + liens personnels et familiaux). Estimation du stock : 600 000 à 900 000 (sans base). Espagne 2005 : 600 000 personnes régularisées, **pas d'effet d'appel détecté**, ≈ +4 000 € de recettes par personne et par an (Elias et al., JOLE 2025) ; nouvelle régularisation d'environ 500 000 personnes en 2026 (effets non mesurés).
- **Meilleure objection.** Récompense l'infraction et crée un précédent (effet d'appel, que l'étude espagnole n'a pas trouvé mais qui reste débattu) ; la loi de 2024 et la circulaire du 23/01/2025 ont déplacé les catégories ; le principe posé par l'auteur, **pas d'immigration illégale**,  la régularisation est en tension avec ce principe, à moins de la définir comme une **sortie** de l'irrégularité, accompagnée d'un éloignement effectif des nouveaux cas.
- **Droit.** Pouvoir d'appréciation de l'administration (admission exceptionnelle au séjour) ; pas de droit à la régularisation (la CEDH n'en crée pas, sauf liens familiaux).

### 5.7 Contraintes juridiques à nommer (pas des obstacles, des règles du jeu)
| Norme | Ce qu'elle impose | Marge pour le législateur |
|---|---|---|
| **Constitution, 93-325 DC (13/08/1993)** | Aucun droit général d'entrée et de séjour des étrangers (cons. 2) ; droit de mener une vie familiale normale pour ceux installés de façon stable et régulière, avec leurs conjoints et enfants mineurs (cons. 70) ; droit d'asile garanti (cons. 81) ; censure d'une « rétention judiciaire » (dans un procès pénal) assortie de garanties moindres que la détention provisoire (cons. 114, texte relu le 03/11/2026 : ne concerne pas la rétention administrative des étrangers) et de l'interdiction automatique du territoire (cons. 49) | Fixer des conditions, des plafonds ; pas supprimer le regroupement ni l'asile ; texte lu partiellement (100 000 des 166 000 premiers caractères) ⚠️ V4134 |
| **Décision 2023-863 DC (25/01/2024)** | 32 articles de la loi immigration censurés comme cavaliers : censure de procédure ; elles peuvent revenir dans un autre texte | Réintroduction possible par un texte propre |
| **Décision 2024-6 RIP (11/04/2024)** | Condition de 5 ans de résidence pour des prestations : atteinte disproportionnée | Durées plus courtes ou prestations ciblées |
| **CEDH, art. 8** | Vie privée et familiale : limite des éloignements et refus de regroupement (proportionnalité) ; art. 3 : pas de renvoi vers des traitements inhumains | Primauté sur la loi (art. 55 de la Constitution) ; en sortir suppose de dénoncer la Convention (⚠️) |
| **Convention de Genève (1951) et non-refoulement** | Qui peut être persécuté ne peut être renvoyé ; examen de chaque demande | Pas de quota d'asile ; procédure accélérée possible (pacte 2026) |
| **Droit de l'UE** | Libre circulation des Européens (hors champ des plafonds) ; directives retour 2008/115, regroupement 2003/86, résidents de longue durée 2003/109, Carte bleue ; pacte asile-migration (12/06/2026) | Conditions nationales de travail et de visa ; la « primauté du droit national » (LR) suppose de réviser les art. 55 et 88-1 |

---

## 6. Ce que cette synthèse ne dit pas, et ce qu'elle ne règle pas

- **Ce qui manque pour trancher le volume** : appariement titres de séjour × données fiscales par motif (la donnée décisive) ; stock irrégulier ; effet d'appel d'un revenu universel (Danemark : élasticité 1,3 contestée à 0,1-0,3) ; rythme réel de la robotisation des soins et du BTP.
- **Ce qui ne relève pas du chiffre** : combien d'étrangers la communauté nationale veut accueillir ; le poids donné à l'asile (devoir), au regroupement familial (droit), à l'identité (valeur). Le manifeste peut chiffrer les conséquences, pas choisir à la place des citoyens : cohérent avec la votation que l'auteur veut après publication des chiffres.
- **Biais de Claude à signaler.** Cette note part d'une base (recherche-immigration.md) qui a retenu des études à revue par les pairs plus que des travaux militants des deux bords ; la sélection des sources peut sembler pencher vers l'état académique, plus favorable à « l'effet moyen faible » ; l'OID est cité mais pas ses propres tableaux ⚠️ V4124. À l'inverse, Claude a été entraîné à éviter les affirmations tranchées sur ce sujet (complaisance, prudence) : ne pas confondre la réserve d'une IA avec l'état des connaissances.

---

## 7. Synthèse des sources mobilisées

- **Statistique française** : Insee (stock 2025, flux 2024, projections 2026, acquisitions de nationalité, descendants), DGEF/ministère de l'Intérieur (titres 2025, dépliant de juillet 2026, Rapport au Parlement du 28/09/2026), Ofpra (bilan 2025), Cour des comptes (janvier 2024), rapport Rodwell (Assemblée, 16/09/2026), COR (2026), Dares (métiers, testing), Drees. Établissent niveaux, tendances et sensibilités.
- **Ined-Insee TeO2** : dossier de presse de l'ouvrage du 21/05/2026 (intégration, mixité, discrimination déclarée).
- **Statistique européenne et internationale** : Eurostat (titres, asile, éloignements, emploi par pays de naissance, EUROPOP2023), OCDE (2021), IRCC (Canada), ONS (Royaume-Uni), swissinfo (vote du 14/06/2026).
- **Recherche** : CEPII, National Academies, JEEA, Labour Economics, JOLE, AER, Review of Economic Studies, QJE (voir `recherche-immigration.md` § 8).
- **Droit** : décisions 93-325 DC, 2023-863 DC, 2024-6 RIP ; code civil 21-24 ; textes UE rappelés (non relus).

## Notes

[^teo2]: Ined (dir. Beauchemin, Ichou, Simon), *Trajectoires et origines 2. Diversité des populations et inégalités sociales en France*, dossier de presse, 2026, https://www.thuram.org/wp-content/uploads/2026/06/Trajectoires-et-origines-2.DP_.pdf (copie : `$DONNEES/sources/immigration/teo2-dossier-presse-2026.pdf`, lu avec pypdf le 02/11/2026) ; page Ined https://www.ined.fr/fr/actualites/trajectoires-et-origines-2-enquete-inedite (non lue, 503 le 02/11). Enquête 2019-2020, 27 000 personnes de 18 à 59 ans, métropole.
