---
titre: Architecture démocratique — trois modèles, une recommandation, une séquence de réforme
statut: brouillon
date: 2026-11-03
---

# Architecture démocratique : qui propose, qui rédige, qui délibère, qui vote, qui exécute, qui contrôle

> Chantier 9 de la boucle « meilleur système » (document de travail de l'atelier, non publié). Rien n'est décidé ; **l'auteur valide**. Les recommandations sont **de Claude** (opinion), les faits sont sourcés, les ordres de grandeur sont des hypothèses, jamais des prédictions.

## Dix lignes

1. **L'objectif de l'auteur** (que les Français décident de chaque réforme, en se passant de l'appareil parlementaire et électoral actuel) est tenable, mais **pas tel quel** : une votation permanente a besoin de quelqu'un qui rédige, de quelqu'un qui exécute et de quelqu'un qui contrôle. Le vrai choix porte sur ces trois rôles, pas sur le vote.
2. Trois architectures complètes : **A** modèle suisse renforcé (assemblée élue réduite) ; **B** panel tiré au sort qui rédige + votation sur toute loi, sans assemblée législative ; **C** votation permanente avec délégation révocable (démocratie liquide).
3. **C est écartée** : la délégation publique et révocable est incompatible avec l'art. 3 (« toujours secret ») et avec le noyau intangible (point 2), et les précédents (LiquidFeedback, Parti pirate allemand) montrent des super-délégués sans abus prouvé mais une participation qui s'effondre.
4. **Recommandation de Claude : B comme destination, atteinte par A comme première étape.** Dès le départ : initiative à **500 000 signatures (≈ 1 % des inscrits)** qui **oblige** à une votation, et référendum facultatif sur toute loi au même seuil (la Suisse est à 0,89 % pour 100 jours, 1,79 % pour l'initiative).
5. Le seuil proposé par l'auteur, 500 000 ou 1 million de signatures : le seuil suisse rapporté à la France donne ≈ **440 000** (référendum) et ≈ **880 000** (initiative). 500 000 et 1 M ne sont donc **pas** arbitraires : ce sont les équivalents suisses. Mon choix : 500 000 pour une loi, 1 M pour toucher à la Constitution.
6. **Sans quorum de participation** (Italie 2025 : 30,6 % de votants, aucune question validée ; Taïwan 2025 : 25 % des inscrits exigés, échec), mais avec un **plafond d'objets par date** et **4 dates fixes par an** (la Suisse : environ 3 dimanches, 8 à 9 objets par an).
7. **Le noyau intangible ne tient que s'il est écrit** : en France le pouvoir constituant est « souverain » (CC 92-312 DC) ; seuls trois verrous existent (territoire, forme républicaine, périodes). Le double verrou proposé n'est donc **pas** garanti par le droit actuel : il faut l'inscrire (modèle : art. 79 al. 3 de la Loi fondamentale allemande) et il ne vaudra que par la volonté politique de ne pas le défaire.
8. **Séquence** : (1) campagne et plateforme ouvertes ; (2) réformes économiques par **art. 11 al. 1** (sans toucher à la Constitution) ; (3) **révision courte par l'art. 89** : initiative populaire contraignante, noyau, cadre du vote numérique ; (4) seulement ensuite, après usage mesuré, la **fin de l'Assemblée comme législateur** (art. 24). Détail : `sources/recherche-basculement-constitutionnel.md`.
9. **Vote en ligne** : la CNIL (2026) reste « très réservée » sur le vote électronique politique, référendums compris, et l'ANSSI dit que ces scrutins « nécessitent des mesures complémentaires » ; la Suisse ne fait voter en ligne que 1,4 % de son électorat. **Signer** en ligne est acceptable (pas de secret à protéger) ; **voter** en ligne ne l'est pas avant un audit : le papier reste la référence.
10. **Ce que je ne sais pas** : le nombre de votations que générerait un seuil à 1 % en France (aucune donnée), le coût d'une votation nationale (un scrutin législatif anticipé a coûté 171 M€ en 2024 selon la presse, mais sans candidats ni propagande ce serait moins), le coût de l'Assemblée et du Sénat à économiser (non cherché), et si le Conseil constitutionnel jugerait la fin du Parlement contraire à la « forme républicaine » (art. 89 al. 5).

---

## 1. Points de départ (faits)

### 1.1 Ce que l'auteur a posé
- Noyau intangible en cinq points (03/11) : dignité et droits fondamentaux ; règles du jeu électoral, élections non suspendables, mandats non prolongeables ; justice indépendante capable d'annuler ; non-rétroactivité des sanctions ; droit de partir. Double verrou : large majorité des citoyens et des États, et deux votes séparés par une élection. Le reste se vote.
- Cahier des charges (03/11) : le désaccord avec l'auteur est attendu et même recherché ; l'objectif est de remplacer le fonctionnement actuel du Parlement et des élections.
- 02/11 : président surtout représentatif et chef des armées ; gouvernement = « les opérationnels » ; fin de l'Assemblée représentative ; reconduction du président chaque janvier par vote ; plateforme de votation d'État ; une personne, une voix ; abstention = vote blanc dans le cas local ; vote contraignant ; seul un référendum peut défaire un référendum ; double majorité européenne.
- **Friction nommée** : supprimer les élections contredirait le point 2 du noyau. La position est donc lue comme la fin des élections *législatives* : il reste des élections libres à date fixe pour ce qui exécute (reconduction annuelle) et pour réviser le noyau.

### 1.2 Seuils comparés (calcul : `sources/calculs/seuils_signatures.py`, résultats dans `seuils_signatures_resultats.txt`)

| Dispositif | Seuil | En % des inscrits | Effet observé |
|---|---|---|---|
| Suisse, initiative populaire (art. 138-139 Cst.) | 100 000 signatures en 18 mois | **1,79 %** (5 591 446 inscrits, scrutin du 03/03/2024, Swissvotes) | 191 votées 1971-2026, 19 acceptées (9,9 %) |
| Suisse, référendum facultatif (art. 141) | 50 000 signatures ou 8 cantons, 100 jours | **0,89 %** | 145 votés 1971-2026, loi confirmée dans 68 % |
| Suisse, ce qui est réellement déposé | médiane **2,22 %** des inscrits (1,82-4,15) pour 104 initiatives votées depuis 2000 ; médiane 1,13 fois le seuil | | les organisations déposent juste au-dessus du seuil |
| France, RIP (art. 11 al. 3) | un dixième des inscrits + un cinquième des parlementaires | **10 %** (4 717 396 en 2019) | 1 093 030 soutiens pour ADP, aucun référendum |
| UE, ICE | 1 M dans 7 États, 12 mois | ≈ 0,2-0,3 % de la population (⚠️ non calculé) | 14 abouties en 14 ans, 3 actes (cf. `democratie-directe-suisse-chiffres.md`) |
| Italie, référendum abrogatif (art. 75) | 500 000 électeurs ou cinq conseils régionaux (⚠️ de mémoire, V7472) **et quorum** de la moitié des inscrits | ≈ 1 % | 2025 : 30,58 % de votants, aucune question validée |
| Taïwan | proposition 1,5 % ; adoption : « oui » ≥ 25 % des inscrits | | Maanshan 2025 : 21,7 % des inscrits, échec |
| Californie | 5 % (loi), 8 % (Constitution) des voix du dernier scrutin de gouverneur | 5-8 % des votants | Ballotpedia, non relu |
| **Proposition de l'auteur** | **500 000 / 1 M** | **1,02-1,06 % / 2,04-2,12 %** (49 M ou 47,2 M d'inscrits) | |

Inscrits France : 49 339 714 au 08/05/2024 (Insee, via recherche web du 03/11/2026, page non lue : ⚠️ V7473) ; 47,2 M déduits du seuil RIP de 2019.

**Lecture [Interprétation]** : (a) le seuil de l'auteur est l'équivalent suisse, pas un seuil laxiste ; (b) la Suisse prouve qu'un seuil à ~1,8 % est franchi par des organisations (médiane 2,2 % déposé), jamais par des citoyens isolés : la « capture par les groupes organisés » est un trait du mécanisme, qu'on atténue (financement, transparence) sans la supprimer ; (c) le RIP français échoue par construction : il exige 10 % *et* des parlementaires, et laisse l'institution libre de ne rien faire (deux ans de délai, puis rien) ; (d) un seuil de 1 % sans plafond d'objets peut saturer l'agenda : ce plafond est un choix de conception, à voter.

### 1.3 Ce que dit la recherche (détail et niveaux de lecture dans `sources/recherche-democratie-directe-deliberation.md` et `sources/democratie-directe-suisse-chiffres.md`)
- **Dépenses** : Feld et Kirchgässner (cantons suisses, 1980-1998) : dépenses et recettes plus faibles avec démocratie directe ; Feld et Matsusaka (2003) : référendum financier obligatoire, environ -19 % pour le canton médian (selon le résumé publié, article non lu) ; Funk et Gathmann (2011) : environ -12 % de dépenses cantonales, pas d'effet communal. Matsusaka (États américains) : même direction, ⚠️ non relu ici (V7474). Sens pour un libéral : ✅, mais ce sont des corrélations de quasi-expériences.
- **Bien-être** : Frey et Stutzer (2000) : plus de satisfaction ; réplications mitigées ⚖️.
- **Minorités** : Hainmueller et Hangartner (naturalisations, Suisse) : le contrôle juridictionnel et l'obligation de motiver réduisent la discrimination (jusqu'à ≈ 60 % de naturalisations en plus pour les groupes discriminés selon le fichier existant) ; la Suisse sans noyau a voté les minarets (2009). **Résultat le plus solide : pas de vote à l'urne sur des personnes identifiables.**
- **Assemblées tirées au sort** : Irlande (2016-2018 : 99 citoyens, référendum du 25/05/2018, 66,4 % de oui) : elles débloquent un sujet et le peuple tranche. France, Convention citoyenne pour le climat : 149 propositions, 146 retenues par le président, mais **15 reprises fidèlement (Reporterre) ou 24 appliquées, 92 partiellement, 33 pas du tout (WWF)** ; référendum constitutionnel promis abandonné le 06/07/2021 : l'échec vient de l'absence de règle sur l'après. Ostbelgien (depuis 2019) : le seul dispositif permanent, avec **obligation de répondre à chaque recommandation** ; mise en œuvre variable.
- **Démocratie liquide** : Kling et al. (2015) : LiquidFeedback, super-votants au pouvoir théorique élevé mais votant le plus souvent avec la majorité ; le Parti pirate allemand a perdu ses électeurs et sa participation. Aucune évaluation à grande échelle d'une délégation révocable dans une décision publique contraignante n'a été trouvée (⚠️ V7475).
- **Critiques sérieuses** : Achen et Bartels (l'identité de groupe pèse plus que l'information) ; Brennan (*Against Democracy*) ; fatigue (la Suisse tient ≈ 50 % de participation avec ≈ 3 dimanches par an).

### 1.4 Vote numérique : position des autorités
- **CNIL** (recommandation adoptée le 19/03/2026) : « très réservée » pour les scrutins politiques, référendums compris ; seul usage admis : Français de l'étranger, avec le niveau de risque le plus élevé ; expertise indépendante à chaque scrutin.
- **ANSSI**, guide ANSSI-PA-118 (24/04/2026) : prévu pour les élections **non politiques** ; les élections politiques, référendums compris, « nécessitent des mesures de sécurité complémentaires non abordées dans ce guide ».
- **France** : abandon du vote par internet aux législatives 2017 (menaces cyber) ; annulation par le CC le 20/01/2023 de deux circonscriptions des Français de l'étranger (SMS d'identifiants non délivrés).
- **Suisse** : essais repris en juin 2023 (Bâle-Ville, Saint-Gall, Thurgovie, Grisons depuis mars 2024), plafonds 30 % du canton et 10 % du pays ; 1,4 % de l'électorat invité ; incident à Bâle-Ville en mars 2026 (2 048 suffrages non déchiffrables).
- **Allemagne** : la Cour constitutionnelle (03/03/2009) exige la vérifiabilité par un citoyen non spécialiste.
- **Conséquence** : le papier (ou une urne vérifiable) reste la référence ; le numérique sert à **signer, informer, délibérer**. Détail : `sources/cahier-des-charges-referendum-numerique.md`.

### 1.5 Textes constitutionnels (relus le 03/11/2026 sur le texte du Conseil constitutionnel, à jour de la révision du 8 mars 2024)
- **Art. 3** : souveraineté exercée « par ses représentants et par la voie du référendum » ; suffrage « toujours universel, égal et secret ».
- **Art. 11** : référendum sur l'organisation des pouvoirs publics, la politique économique, sociale ou environnementale, les traités ; initiative partagée (un cinquième des parlementaires + un dixième des électeurs) ; pas d'abrogation d'une loi de moins d'un an ; deux ans avant de reposer la même question ; promulgation sous quinze jours.
- **Art. 24** : « Le Parlement vote la loi. Il contrôle l'action du Gouvernement. Il évalue les politiques publiques. » Maxima 577 députés et 348 sénateurs.
- **Art. 72-1** : pétition locale et référendum local décisionnel (à l'initiative de la collectivité).
- **Art. 89** : révision par les deux assemblées en termes identiques puis référendum, ou Congrès à 3/5 ; interdits : atteinte à l'intégrité du territoire, **forme républicaine du Gouvernement**. Le Sénat dispose donc d'un veto.
- Jurisprudence (déjà lue, `recherche-basculement-constitutionnel.md`) : 62-20 DC (une loi adoptée par le peuple échappe au contrôle), 92-312 DC (le pouvoir constituant est souverain hors les trois verrous), 2003-469 DC, Hauchemaille 2000 (contrôle préalable des décrets de convocation).
- **Droit de l'UE** : les compétences exclusives et partagées (marché intérieur, concurrence, euro, commerce) échappent à la votation nationale ; une loi référendaire reste soumise à la primauté (Costa/ENEL, 1964) et à la CEDH (`topo-droit-europeen.md`). Ce qui est **hors de portée d'un vote français** doit être dit aux électeurs avant le vote.
- **Allemagne** : Loi fondamentale, art. 79 al. 3 (lu le 03/11/2026, gesetze-im-internet.de) : une révision touchant la structure fédérale, la participation des Länder à la législation ou les principes des art. 1 et 20 « est inadmissible ». C'est le précédent d'un noyau écrit.
- **Suisse** : art. 139 al. 3 : nullité d'une initiative qui viole l'unité de la forme, l'unité de la matière ou le droit international impératif (relu le 31/10/2026). Fedlex ne s'est pas laissé relire le 03/11 (site exigeant JavaScript).

---

## 2. Les trois architectures

Convention : « qui » = rôle, pas personne. Sauf mention contraire, **une personne, une voix, vote à bulletin secret, noyau intangible contrôlé avant le vote**.

### Architecture A : modèle suisse renforcé

| Rôle | Qui |
|---|---|
| Propose | Gouvernement, assemblée élue, **ou 500 000 citoyens** (initiative, 12-18 mois de collecte) ; toute loi votée est soumise au **référendum facultatif à 500 000 signatures sous 100 jours** |
| Rédige | Assemblée élue **réduite** (ex. 150 à 200 élus, ⚠️ chiffre d'illustration, pas une recommandation) pour les lois ; comité d'initiative pour les initiatives, avec un bureau juridique d'État qui met en forme |
| Délibère | L'assemblée ; brochure officielle contradictoire (modèle suisse, depuis 1977) ; contre-projet possible |
| Vote | Le peuple sur les initiatives (obligatoire) et sur les lois contestées ; l'assemblée sur le reste |
| Exécute | Gouvernement ; président surtout représentatif |
| Contrôle | Conseil constitutionnel (noyau, **avant** la collecte), Cour des comptes, assemblée (art. 24 inchangé) |

- **Compatibilité avec le noyau** : très bonne (élections législatives conservées, point 2 intact). **Avec l'objectif de l'auteur** : insuffisante : elle garde le fonctionnement parlementaire actuel.
- **Révisions** : art. 11 (initiative contraignante, seuil, suppression de l'exigence parlementaire), art. 3 inchangé ; **art. 89** nécessaire mais **sans toucher à l'art. 24** : la voie la plus facile devant le Sénat.
- **Risques** : l'assemblée devient une filtre-gardienne (le RIP actuel le montre) ; initiatives dominées par des organisations ; 90 % d'échec des initiatives en Suisse : l'outil donne un agenda, pas une machine à produire des lois (§ 1.2 et fichier suisse § 1.1).
- **Coût** : faible à l'unité ; économie nulle sur le Parlement.
- **Steelman** : « la Suisse n'est pas reproductible : confiance, fédéralisme communal, gouvernement de concordance » (fichier suisse § 5). Réponse : non réfutable avec les données ; d'où une montée par paliers.

### Architecture B : panel tiré au sort de rédaction + votation

| Rôle | Qui |
|---|---|
| Propose | Gouvernement (programme), **500 000 citoyens** (obligation de suite), un **panel permanent** (modèle Ostbelgien : il fixe l'ordre du jour d'assemblées thématiques) |
| Rédige | **Assemblées citoyennes tirées au sort** (≈ 100 à 150 personnes, rotation, indemnisées, éclairées par experts contradictoires : modèle Irlande), appuyées par un **bureau de rédaction d'État** (juristes, Conseil d'État) ; consultation ouverte (Pol.is, Decidim) en amont, pas en lieu et place |
| Délibère | L'assemblée tirée au sort (délibération réelle) ; note d'information d'un panel (modèle Oregon CIR) insérée dans la brochure |
| Vote | **Le peuple vote toute loi** « de rang législatif », sur 4 dates fixes par an, plafond d'objets ; les actes techniques (décrets d'application) restent au gouvernement, sous référendum facultatif |
| Exécute | Gouvernement « opérationnel » ; **réponse motivée obligatoire** à chaque recommandation ; président surtout représentatif, **reconduit par vote chaque janvier** (dernier acte d'élection : à date fixe, donc compatible avec le point 2) |
| Contrôle | Conseil constitutionnel avant le vote ; Cour des comptes renforcée ; **panel de contrôle tiré au sort** doté de pouvoirs d'enquête (à créer par loi organique) ; vote annuel de reconduction |

- **Compatibilité avec le noyau** : bonne **si** l'on conserve une élection libre à date fixe (reconduction de l'exécutif) et la possibilité d'annuler (justice). Le tirage au sort n'est pas une élection : le point 2 n'est pas violé tant que l'exécutif reste soumis à des élections libres.
- **Révisions** : art. 24 (le Parlement ne vote plus la loi), art. 3 (« représentants » : le tirage au sort et le vote direct), art. 89 (forme républicaine : ⚠️ risque d'argument de « forme républicaine du Gouvernement », V7476), art. 6 et 8 (reconduction annuelle contre le quinquennat), Conseil constitutionnel et lois organiques.
- **Risques** : (a) **charge** : le volume de lois que le peuple devrait voter est inconnu (⚠️ le nombre de lois promulguées par an n'a pas été sourcé ici, V7477) ; (b) les retraités et les organisés pèsent plus (point déjà relevé le 02/11) ; (c) le tirage au sort **ne contrôle pas** l'exécutif sans expertise ni moyens ; (d) l'après : la leçon de la CCC est qu'il faut une règle ; (e) l'humeur du moment : il faut des garde-fous de temps long (lois de programmation à majorité qualifiée, délais, budget pluriannuel).
- **Coût** : dépend du numérique et du papier ; **une votation sans candidat** coûte moins qu'un scrutin classique (un scrutin législatif anticipé : 171,49 M€ en 2024, ministère de l'Intérieur relayé par Acteurs publics, non lu : ⚠️ V7478). À 4 dates par an, l'ordre de grandeur **supérieur** serait ≈ 700 M€/an ; il faut le comparer au coût de l'Assemblée et du Sénat (**non chiffré : à faire**).
- **Steelman** : « le peuple n'a ni le temps ni la compétence ; c'est le rôle d'une représentation ». Réponse : la recherche ne valide ni l'utopie ni le rejet ; le design (information, délibération, sujets, contrôle) compte plus que la compétence moyenne ; le tirage au sort entre l'initiative ouverte et le vote final est précisément la parade (§ 1.3).

### Architecture C : votation permanente avec délégation révocable (démocratie liquide)

| Rôle | Qui |
|---|---|
| Propose | Tout citoyen ou élu délégué, par la plateforme |
| Rédige | Co-écriture ouverte, version choisie par vote |
| Délibère | En ligne, sur la plateforme |
| Vote | Chacun, ou son **délégué, révocable à tout moment, par thème** |
| Exécute | Gouvernement |
| Contrôle | La plateforme (journal public) ; juridictions |

- **Pourquoi je l'écarte** : (1) **délégation publique = vote non secret** : l'art. 3 exige un suffrage « toujours secret » et le noyau de l'auteur protège les règles du jeu électoral ; (2) **sécurité** : tout est en ligne, donc le scénario que la CNIL et l'ANSSI jugent le plus risqué ; (3) **précédents** : LiquidFeedback (super-votants, participation en chute), Mouvement 5 étoiles et Rousseau (⚠️ non relus ici) ; (4) la délégation recrée une **représentation** que l'auteur veut dépasser, mais **sans élection** ni responsabilité visible.
- **Ce qu'on garde** : l'idée de **délégation sur un sujet**, en **consultation** (non décisionnelle) ou pour des assemblées de copropriété (hors art. 3).
- **Steelman** : « l'expertise a droit de s'exprimer sans corporatisme ; la délégation par thème le permet ». Réponse : l'Irlande y arrive avec **une personne, une voix** et des experts devant un panel tiré au sort, sans délégation.

### Comparaison

| Critère | A suisse | B tirage au sort + votation | C liquide |
|---|---|---|---|
| Fidélité à « les Français décident » | forte sur initiative et veto | **la plus forte** | forte (en théorie) |
| Noyau intangible | intact | compatible sous conditions | **incompatible** (secret) |
| Révision constitutionnelle | art. 11 + 89 (sans art. 24) | art. 3, 6, 24, 89 | art. 3 (secret), 24, 89 |
| Risque principal | filtre parlementaire, capture | charge, retraités, contrôle de l'exécutif | sécurité, super-délégués |
| Effet sur le droit UE | inchangé | inchangé | inchangé |
| Faisabilité en 5 ans | **forte** | moyenne | faible |

---

## 3. Recommandation de Claude

**B comme destination, A comme chemin.** Autrement dit : **un régime sans assemblée législative élue, où des assemblées tirées au sort délibèrent et le peuple vote, mais qu'on atteint en passant d'abord par une étape A** (initiative contraignante à 500 000 signatures + référendum facultatif sur toute loi), qui coûte peu à faire voter et produit les données (participation, nombre d'objets, capture) qui manquent aujourd'hui. **C'est une recommandation de Claude, pas un fait.**

Pourquoi pas B tout de suite : (1) il faut l'accord du **Sénat** pour toucher l'art. 24 par l'art. 89 ; (2) personne ne sait combien de votations cela produit ; (3) le contrôle de l'exécutif par le tirage au sort n'a **aucun précédent à l'échelle d'un État** (⚠️ à confirmer, V7479) ; (4) l'objection de la « forme républicaine » (art. 89 al. 5) n'a pas été testée.

**Paramètres recommandés** (révisables par votation) :
- Initiative : **500 000 signatures** (≈ 1,0 %) en 12 mois, signature **numérique autorisée** (identité France Identité : c'est le recueil, pas le vote) ; **1 M** (≈ 2,1 %) pour une révision constitutionnelle ; aucune exigence de parlementaires.
- Référendum facultatif sur toute loi : **500 000 signatures en 100 jours** (la Suisse : 0,89 %, soit ≈ 440 000 en France).
- **Pas de quorum de participation, pas de seuil de « oui » en % des inscrits.** Abstention = non comptée, sauf le cas local retenu par l'auteur (abstention = vote blanc), à discuter : il vaut surtout pour des consultations d'urgence.
- **Calendrier de votation** : 4 dates par an, au plus 6 objets par date, file d'attente par date de dépôt ; brochure contradictoire ; **délai d'au moins deux ans** pour revoter sur le même sujet (art. 11), sauf **référendum** contraire, comme l'auteur l'a décidé.
- **Contrôle avant collecte** : avis du Conseil constitutionnel (noyau intangible), du Conseil d'État (cohérence) et mention des **limites européennes** sur la brochure.
- **Interdiction du vote sur des personnes identifiables** (naturalisations, sanctions) : décisions motivées et contestables devant un juge.
- **Après-vote** : séparer principe (vote) et loi d'application (rédigée par le bureau d'État dans un délai fixé, **avec re-vote si dérive**), pour éviter le cas de l'initiative suisse de 2014 appliquée sans contingents.
- **Financement de campagne plafonné et transparent** (les campagnes suisses de mars 2026 : 10,71 M CHF pour quatre objets, selon le Contrôle fédéral des finances relayé par swissinfo).
- **Noyau** : double verrou inscrit dans la Constitution (pas seulement dans la loi), sur le modèle de l'art. 79 al. 3 allemand, plus la règle « deux votes séparés par une élection ».

### Objection la plus forte et réponse
- **Objection** : « le double verrou ne protège de rien : un peuple capable de voter la fin du noyau peut d'abord voter la fin du verrou ; et en France le pouvoir constituant est souverain (92-312 DC). » **Réponse** : c'est vrai. Un verrou n'est jamais plus fort que la volonté qui le défend. Ce qu'il fait : imposer **deux votes séparés par une élection**, donc du temps et une occasion de reculer ; l'Allemagne a mis l'art. 79 al. 3 après 1949 précisément pour cela, mais la protection finale reste politique. Il faut l'écrire dans le manifeste.
- **Objection secondaire** : « B est un coup de force contre le Parlement. » **Réponse** : c'est pourquoi la séquence passe d'abord par le Sénat (art. 89), et rend le refus du Sénat objet de campagne, l'art. 11 n'étant qu'un ultime recours assumé.

---

## 4. Séquence de réforme proposée

(Reprend et prolonge `recherche-basculement-constitutionnel.md` §§ 5-6 ; dates indicatives.)

| Étape | Voie | Contenu | Délai réaliste |
|---|---|---|---|
| 0. Avant l'élection | aucune | Plateforme de signature et de consultation en code ouvert, audit indépendant ; annonce **précise** de la procédure | jusqu'à avril 2027 |
| 1. Mai-déc. 2027 | **art. 11 al. 1** (réformes économiques et sociales) et loi ordinaire | Premiers référendums sur la fiscalité et le revenu universel ; **engagement de répondre** aux pétitions (modèle Ostbelgien) ; assemblées citoyennes consultatives | 6 à 8 mois |
| 2. Fin 2027 - 2028 | **art. 89** (révision courte) | Initiative populaire **contraignante** (art. 11), noyau intangible avec double verrou, cadre du vote numérique, **sans toucher à l'art. 24** ; soumise au Sénat ; **si refus**, le refus est soumis aux Français | 6 à 12 mois |
| 3. 2028-2029 | loi organique + usage | Premières votations à l'urne sur initiative ; mesure de la participation, du nombre d'objets, de la capture ; audit du vote numérique, essais locaux en option (art. 72-1) | 12 à 18 mois |
| 4. 2029-2030 | **art. 89** (Sénat renouvelé en septembre 2029), **ou art. 11 / constituante** en dernier recours | Fin de l'Assemblée comme législateur (art. 24), assemblées tirées au sort, reconduction annuelle (art. 6) ; second référendum sur l'ensemble | après les données de l'étape 3 |

**Révisions à prévoir** : art. 3 (précision du suffrage direct et du tirage au sort), 6 et 8 (reconduction annuelle), 11 (initiative contraignante), 24 (étape 4), 89 (verrou renforcé), titre sur le Conseil constitutionnel (contrôle avant collecte), nouveau titre sur les assemblées citoyennes.

**Ce que je ne peux pas promettre** : la tenue de ce calendrier (Sénat, Conseil constitutionnel, élection de 2027 : tout reste conditionné) ; une garantie que l'étape 4 passe sans coup de force.

---

## 5. Ce que je n'ai pas fait / à vérifier
- Volume de lois, de décrets et de votations attendus par an en France : aucune donnée trouvée.
- Coût de l'Assemblée et du Sénat (économie à compter) et coût d'une votation nationale sans candidat.
- Contrôle de l'exécutif par un panel tiré au sort : littérature non cherchée.
- Étude de Matsusaka (États américains) et de la Californie en nombre d'initiatives : non relues.
- Texte du Fedlex (Constitution suisse) non relisible (JavaScript) ; art. 71 et 75 de la Constitution italienne non relus.

## Registre des affirmations à vérifier
V7470 à V7479 : voir `verifications.md`.

## Synthèse des sources mobilisées
- **Constitution française** (Conseil constitutionnel, texte à jour du 08/03/2024, lu le 03/11/2026) : *établit* le texte des art. 3, 11, 24, 72-1, 89.
- **Loi fondamentale** (gesetze-im-internet.de, art. 79, lu le 03/11/2026) : *établit* la clause d'éternité.
- **Swissvotes** (université de Berne, fichier du 03/11/2026) : *établit* l'électorat (5 591 446 au 03/03/2024), les signatures déposées, les taux ; script `sources/calculs/seuils_signatures.py`.
- **Insee** (recherche web, non lu), **Acteurs publics** (non lu) : électorat français, coût des législatives de 2024.
- Fichiers existants du dépôt : `recherche-democratie-directe-deliberation.md` (Feld, Matsusaka, Frey, Hainmueller, Irlande, CCC, Ostbelgien, Kling), `democratie-directe-suisse-chiffres.md` (Suisse, Italie, Taïwan, Californie, ICE, RIP), `cahier-des-charges-referendum-numerique.md` (CNIL, ANSSI), `recherche-basculement-constitutionnel.md` (voies, jurisprudence, calendrier), `topo-droit-europeen.md` (primauté, compétences).
