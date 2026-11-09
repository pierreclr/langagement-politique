---
titre: Modèle « Éducation » : méthode
tache: aucune (chapitre 15 « Apprendre avec l'IA », Q19 et Q20)
statut: premier jet, à valider par l'auteur
consultation: 2026-11-03
---

# Éducation : méthode

## 1. Les positions de l'auteur, et ce qu'elles ne disent pas

Rien n'est ajouté ici aux positions de l'auteur sur l'éducation et l'orientation de la jeunesse.

- **Tuteur IA** : accompagnateur pédagogique qui comprend où l'élève bloque, gamification (jeu vidéo, défi, petites étapes). **Mais l'auteur tient à un lien humain : une présence, des enseignants.**
- **École** : plus de choix dès le collège, plus de temps libre (sport, arts), des temps d'autonomie encadrés par des **accompagnateurs** plutôt que des professeurs, en petites salles avec ordinateurs, un dispositif que l'auteur juge peu coûteux ; savoirs pratiques, cuisine, démocratie à l'école ; apprendre à utiliser l'IA.
- **Supérieur** : université ouverte à tous sans Parcoursup, cours en ligne et en présentiel, l'État garantissant à chacun la possibilité de se former ; le diplôme perd sa valeur ; formations d'élite maintenues ; le privé est libre.
- **Non précisé par l'auteur** : un budget, un nombre d'enseignants, le sort des enseignants (« ne perdre personne » est la règle générale du projet, pas une phrase sur l'école), la forme du choix des établissements (chèque ou autonomie), le contenu de la « certification exigeante ». « Apprendre librement, certifier exigeant » est la formule de la mission, pas une formule de l'auteur. Tout cela reste à trancher par l'auteur.
- **Tension ouverte** : le faible coût attendu des accompagnateurs contre le résultat central du modèle, où l'humain domine le coût du tuteur.
- **Précision de l'auteur du 03/11** : non-remplacement des postes libérés ; le tuteur est l'IA elle-même, bridée en « moteur d'accompagnement » ; il faut seulement des **surveillants**, pas des pédagogues, au motif que personne n'est encore vraiment formé à une technologie aussi récente et changeante. La variante « surveillants » (H22, H23, § 4.5) la chiffre. Elle remplace H12 (« pas de remplacement de l'enseignant ») sans le contredire : l'enseignant reste, il n'est simplement plus recruté en renfort du tuteur.

## 2. Questions posées

1. Que coûte l'éducation aujourd'hui, par niveau, et où en sont les résultats (PISA, TIMSS) ?
2. Que coûterait un tuteur IA généralisé, quel effet attendre, et que devient le besoin en enseignants ?
3. Que montrent les évaluations du choix et de l'autonomie des établissements ?
4. Que coûte « apprendre librement, certifier exigeant » dans le supérieur ?

## 3. Hypothèses numérotées

**D** = donnée sourcée (`donnees/sources.csv`), **H** = hypothèse, **⚠️** = à vérifier (registre : V6180 à V6219 ; V9200 à V9203 pour la variante « surveillants »). Le 03/11/2026, la DIE, le coût par élève et par étudiant, PISA 2022 maths, TIMSS 2023 CM1, les effectifs et les enseignants ont été relus à la source (PDF DEPP 23.48, 24.47, 26.42 ; data.education.gouv.fr). Le reste a été lu dans des résumés de recherche (pages OCDE en HTTP 403) et reste ⚠️.

| N° | Hypothèse | Bas / central / haut | Statut |
|---|---|---|---|
| H1 | DIE 2025 | 199,2 Md€ | D |
| H2 | Élèves 2025 : premier degré 6,155 M ; second degré 5,621 M | idem | D (recoupé à 1 % par les sommes par établissement : 6,22 M et 5,68 M, data.education.gouv.fr, 03/11/2026 ; la note DEPP elle-même n'a pas été lue) |
| H3 | Coût par élève 2025 : 9 440 (1er) ; 10 580 (collège) ; 13 200 (LGT) ; 14 590 (LP) | idem | D (DEPP, note d'information 26.42, p. 4 et figure 6, lue le 03/11/2026) |
| H4 | Étudiants : 3,0 M ; coût 13 350 € (2025, apprentissage inclus) | idem | ⚠️ effectif (la DIE du supérieur implique 3,4 M avec apprentis) ; D coût (DEPP, note 26.42) |
| H5 | Répartition du second degré : 3,39 / 1,61 / 0,67 M (collège / LGT / LP), rentrée 2025 | idem | D (sommes par établissement, data.education.gouv.fr, 03/11/2026 ; total 5,68 M contre 5,621 M DEPP, écart de 1 %) |
| H6 | Licence du tuteur IA, € par élève et par an | 15 / 60 / 200 | ⚠️ : 15 $ (partenariat de district Khan, minimum 250 licences, États-Unis seulement), 44 $ par an (particulier), un contrat à 60-90 $ ; aucune offre européenne en volume lue |
| H7 | Matériel neuf par élève, amorti | 0 (équipement existant) / 300 € sur 4 ans / 450 € sur 3 ans | **H non sourcée ⚠️** |
| H8 | Accompagnateurs : 1 pour N élèves ; coût chargé 35 000 € par an | aucun / 1 pour 100 / 1 pour 50 | **H non sourcée ⚠️** : traduit les « accompagnateurs » proposés par l'auteur ; l'humain est le poste dominant |
| H9 | Effet du tuteur sur les acquis, en écarts-types | 0,00 / 0,15 / 0,30 | H encadrée par la littérature (§ 4) ; **le bas est nul exprès** : un tuteur sans garde-fous peut nuire (Bastani) |
| H10 | Tutorat humain intensif : 1 500 € par élève et par an ; 0,29 écart-type | n. a. | coût **H non sourcée ⚠️** ; effet ⚠️ (Nickow et al.) |
| H11 | Conversion PISA : 1 écart-type = 100 points | n. a. | convention de l'échelle PISA ; ⚠️ à confirmer à la source OCDE |
| H12 | Le tuteur s'ajoute à l'école actuelle (pas de remplacement de l'enseignant) | n. a. | choix du modèle, en cohérence avec « lien humain » |
| H13 | Enseignants : 756 000 ETP (314 700 au premier degré, 441 100 au second ; enseignants en établissement, public + privé sous contrat, rentrée 2025) | idem | D (sommes par établissement, data.education.gouv.fr, jeux `fr-en-indicateurs_personnels_etablissements1d` et `2d`, 03/11/2026) ; hors remplaçants et enseignants hors établissement, si le jeu les exclut |
| H14 | Part du temps d'enseignement reprise par le tuteur (exercices individualisés) | 0 / 5 / 15 % | **H non sourcée ⚠️** : le paramètre le plus décisif et le moins mesuré du bloc B |
| H15 | Baisse de 1,7 M élèves en dix ans (projection DEPP) rapportée aux 11,78 M élèves ; encadrement maintenu | idem | ⚠️ résumé ; la baisse est en réalité étalée et diffère entre premier et second degrés |
| H16 | Taux de départ des enseignants (retraites, démissions) : 3 % par an, sans remplacement | idem | **H non sourcée ⚠️** ; même valeur que H5 du modèle numerus-orientation |
| H17 | Entrants en L1 : 250 / 300 / 350 mille ; 26 % sortent après la L1 ; coût d'une année : 13 350 € | idem | entrants **H non sourcés ⚠️** ; 26 % ⚠️ presse |
| H18 | Part de l'enseignement dans le coût par étudiant : 60 % | idem | **H non sourcée ⚠️** (les coûts de vie étudiante et de recherche sont dans les 40 %) |
| H19 | Part de l'enseignement passée en ligne ; réduction du coût unitaire de cet enseignement | 10 / 30 / 50 % ; 60 / 40 / 20 % (économie forte en bas) | **H non sourcées ⚠️** |
| H20 | Abandons supplémentaires par enseignement en ligne, en points | 0 / 5 / 9 | ⚠️ borne haute d'après Bettinger et al. (−9 points de maintien, cours en ligne dans un collège à but lucratif américain : transposition non établie) |
| H21 | Certification : part des étudiants certifiés chaque année ; coût d'une épreuve surveillée | 20 / 40 / 60 % ; 100 / 200 / 400 € | **H non sourcées ⚠️** |
| H22 | Variante « surveillants » : coût employeur d'un assistant d'éducation (AED) = brut mensuel 1 801,74 € × 12 × 1,40 | 30 269 € par an | brut : page officielle education.gouv.fr (« Être assistant d'éducation »), chiffre **rapporté par un résumé de recherche, page en HTTP 403, non lue** ⚠️ V9200 ; coefficient 1,40 **H non sourcée ⚠️** V9201 |
| H23 | Surveillants : 1 pour N élèves pendant le temps de tuteur, en équivalent temps plein ; licence (H6) et matériel (H7) inchangés | 200 / 100 / 50 (bas, central, haut) | **H non sourcée ⚠️** V9202 : un surveillant n'est pas nécessairement dédié ; en collège, 1 pour 100 revient à un AED par tranche de quatre classes |
| H24 | Économie du non-remplacement pur des 109 000 ETP à 10 ans | 2,2 / 3,9 / 5,5 Md€ par an | `sources/economies-depense-publique.md` (modèle de la synthèse, ⚠️ hérité) |
| H25 | Expérimentation : 500 élèves par établissement ; 100 élèves testés par établissement ; corrélation intra-établissement 0,15 ; le score initial explique 70 % de la variance entre établissements et 50 % à l'intérieur ; puissance 80 %, seuil 5 % | idem | **H non sourcées ⚠️** V9203 (valeurs usuelles des essais en grappes en éducation, non relues) |

## 4. Ce que la littérature établit (état de la recherche)

Statut de preuve : **solide** = plusieurs essais contrôlés ou méta-analyse ; **moyen** = un essai contrôlé bien conçu ; **annonce** = communiqué, billet, ou effet non reproduit. Tout est lu dans des résumés ⚠️ (V6190 et suivantes).

### 4.1 Tuteur IA

- **Bloom et le « 2 sigma » (1984)** : l'étude d'origine est celle d'élèves en tutorat individuel et en apprentissage par maîtrise, sur de petits échantillons, avec des tests proches de l'enseignement. **Annonce, non reproduite à cette taille** (von Hippel 2024 le soutient, ⚠️ de mémoire, non relu). Les méta-analyses actuelles du tutorat humain donnent 0,29 à 0,37 écart-type (Nickow, Oreopoulos, Quan : 0,37 sur 96 essais en 2020, 0,288 sur 89 essais dans la version récente) : **solide**, et très en dessous de 2.
- **Banque mondiale, Nigeria (2024-2025)** : essai contrôlé de six semaines en lycée (Édo), séances extrascolaires avec un LLM (encadrement par des enseignants : de mémoire, ⚠️ V6197), 13 heures en moyenne, effet de 0,29 écart-type (anglais, connaissance de l'IA, compétences numériques). **Moyen** : un seul essai, court, un pays à revenu intermédiaire inférieur où le point de départ est bas ; les sources divergent sur l'outil et la taille d'échantillon ; « deux ans d'apprentissage en six semaines » est un habillage de presse. Le calcul de coût n'a pas été lu.
- **Harvard, physique (Kestin et al., 2023-2025)** : essai croisé sur 194 étudiants d'un cours sélectif, deux sujets, gain médian plus que double de celui de l'apprentissage actif en classe, en moins de temps. **Moyen** : une université d'élite, un cours, des tests à court terme.
- **Bastani et al. (PNAS 2025)** : près de 1 000 lycéens en Turquie ; l'accès à un chatbot sans garde-fous améliore les exercices mais **dégrade l'examen** une fois l'outil retiré (−17 %) ; la version « tuteur » avec garde-fous atténue largement cet effet. **Moyen, et c'est le résultat le plus important pour le modèle** : le même outil aide ou nuit selon la conception.
- **Khanmigo** : prix publiés, pas d'évaluation d'effet lue. **Annonce** pour l'effet.
- **Conclusion** : l'effet moyen plausible d'un tuteur bien conçu est du même ordre que le tutorat humain (0,15 à 0,30 écart-type), pas de « 2 sigma » ; un tuteur mal conçu peut être négatif. **Aucun essai de long terme en école ordinaire, en Europe, sur un programme complet.**

### 4.2 Écrans et résultats (le biais pro-technologie)

PISA 2022, corrélations ajustées du profil socio-économique (OCDE, ⚠️) : jusqu'à une heure par jour d'écran pour apprendre, **+14 points** en maths ; cinq à sept heures de loisirs numériques en classe ou hors classe, **−49 points** par rapport à une heure ; être distrait par les écrans des autres, **−15 points**. **Corrélation, pas causalité.** Lecture honnête : l'usage ciblé et borné est associé à de meilleurs résultats ; l'usage de masse et récréatif, à de moins bons. Le temps d'autonomie avec ordinateurs proposé par l'auteur est exactement la zone où le risque de loisir numérique est le plus fort.

### 4.3 Choix et autonomie des établissements

| Dispositif | Ce qui est établi | Preuve | Ce qui coince |
|---|---|---|---|
| Charter schools (États-Unis) | CREDO 2023 : +16 jours en lecture, +6 en maths par an ; 50 → 51e percentile ; plus fort pour les réseaux (CMO) et les élèves défavorisés | moyen (appariement, pas tirage au sort) | « jours d'apprentissage » contestés ; effets faibles en moyenne, forts dans quelques réseaux urbains (les études par tirage au sort de Boston n'ont pas été relues) ; élèves en éducation spécialisée en retrait |
| Academies anglaises | Sponsorisées (écoles en échec) : +0,2 écart-type après quatre ans (Eyles et Machin) | moyen | l'essentiel des academies sont des « converties » d'écoles déjà bonnes : effet incertain |
| Friskolor suédoises | Gain moyen via la concurrence, visible après une dizaine d'années, **sans économie de dépense** (Böhlmark et Lindahl) | moyen | ségrégation par origine accrue (Holmlund et al. 2015 ; Söderström et Uusitalo 2005 pour l'admission par les notes) ; inflation des notes, dérives des écoles à but lucratif : **non lues, ⚠️** |
| Chèque éducation | non traité par un essai lu | n. a. | à chiffrer avant d'être proposé |

**Lecture** : l'autonomie ne coûte pas de moins et ne rapporte de manière nette que si l'on pilote la mixité. D'où l'indicateur proposé (`indice_dissimilarite`) : le publier chaque année est la condition pour que le choix ne creuse pas les inégalités. La position de l'auteur (plus de choix dès le collège) porte sur le choix des **filières et des activités**, pas sur celui des établissements : le modèle ne tranche pas.

### 4.4 Supérieur

- Bettinger et al. (2017) : cours en ligne, notes plus basses, maintien en baisse de 9 points ; transposition à des cours universitaires conçus pour le numérique à vérifier. ⚠️
- Efficacité de la certification externe : aucun essai lu ; **lacune**.
- Les formations d'élite et le diplôme : à documenter (valeur du diplôme en France, évolution du recrutement sur compétences).

### 4.5 Avec ou sans adulte, et protocole d'une expérimentation (mise à jour du 03/11)

**Ce que disent les études citées plus haut, et ce qu'elles ne disent pas.**
- **Avec adulte** : le Nigeria (0,29 écart-type) est une séance extrascolaire encadrée par des enseignants, donc un tuteur *avec* adulte ; Kestin et al. se déroulent en classe. Dans les deux cas **l'adulte est un enseignant ou un cadre de cours**, jamais un surveillant sans formation disciplinaire.
- **Sans adulte** : Bastani et al. testent des lycéens avec un chatbot ; la version à garde-fous limite la dégradation. Le résultat plaide pour **la conception de l'outil** (moteur d'accompagnement, pas moteur de réponse : exactement la position de l'auteur) plus que pour la présence d'un adulte, mais l'essai ne compare pas des adultes différents.
- **Le tutorat humain** (Nickow et al., 0,29 effet moyen) est dispensé par des enseignants, des étudiants ou des bénévoles formés ; la méta-analyse distingue les tuteurs, mais **cette distinction n'a pas été relue** (⚠️).
- **Conclusion honnête** : aucune étude lue ne compare un tuteur IA avec surveillant et un tuteur IA avec enseignant. L'hypothèse de l'auteur (un surveillant suffit si l'outil est bien bridé) est **plausible et non testée**. Contre-hypothèse à tester : l'enseignant détecte le décrochage, motive, et repère l'élève qui contourne l'outil ; ce que fait le surveillant, c'est surtout tenir le cadre (pas de jeux, pas de triche, pas d'usage récréatif).

**Protocole proposé** (pour le programme, à soumettre à un comité d'évaluation indépendant, par exemple la DEPP ou un laboratoire universitaire).
1. **Unité** : l'établissement (collège), pas l'élève, pour éviter la contamination. **Tirage au sort stratifié** (académie, indice de position sociale, taille) parmi les établissements volontaires ; préenregistrement public du protocole et des critères.
2. **Trois bras** : (A) tuteur IA + un surveillant (AED) pour N élèves ; (B) tuteur IA + un enseignant-accompagnateur au même ratio ; (C) sans tuteur (enseignement actuel). Même outil, même temps de tuteur (par exemple 2 heures par semaine), mêmes garde-fous (moteur d'accompagnement). Ratio central 1 pour 100.
3. **Mesures** : (i) **acquis** : test indépendant en mathématiques et en français, au départ, à un an, à deux ans, et **sans l'outil** (c'est l'enseignement de Bastani : l'examen après retrait) ; (ii) **par origine sociale** (indice de position sociale) pour répondre à l'objection des inégalités ; (iii) **usage** : journaux d'usage anonymisés (temps, types de requêtes, usage récréatif), pour distinguer le moteur d'accompagnement du moteur de réponse ; (iv) **bien-être, motivation, décrochage** : questionnaire ; (v) **mixité** : indice de dissimilarité à l'entrée du tuteur ; (vi) **coût** réel par élève, adulte compris.
4. **Taille** (`etablissements_par_bras`) : **35 établissements par bras** détectent 0,15 écart-type entre tuteur et sans tuteur (106 collèges de 500 élèves environ, 17 500 élèves par bras) ; **78 par bras** détectent 0,10 entre A et B (234 établissements, 39 000 élèves par bras). Hypothèses H25 : ces chiffres bougent beaucoup avec la corrélation intra-établissement, à mesurer sur données françaises avant de figer l'effectif.
5. **Durée** : deux années scolaires, plus un suivi de six mois sans outil. L'effet du Nigeria vient de six semaines : **aucune conclusion sur un effet durable avant la deuxième année**.
6. **Coût brut du dispositif** (central, 438 € par élève avec surveillant, 485 € avec enseignant, 2 ans) : à 35 établissements par bras, ≈ 7,7 M€ + 8,5 M€ = 16 M€ par an, soit ≈ 32 M€ sur deux ans ; à 78 par bras, ≈ 17,1 M€ + 18,9 M€ = 36 M€ par an, ≈ 72 M€ sur deux ans ; plus l'évaluation (tests, analyse), non chiffrée ici ⚠️. C'est 0,02 à 0,04 % de la dépense d'éducation, à comparer aux 2 à 11 Md€ par an que la généralisation engagerait.
7. **Règles de décision fixées d'avance** : généraliser le surveillant si l'effet de A est au moins la moitié de celui de B et que A dépasse C d'au moins 0,10 écart-type, sans dégradation de l'examen sans outil ni creusement des écarts sociaux ; sinon garder le non-remplacement seul. Seuils proposés par Claude, à fixer par l'auteur.
8. **Biais à nommer** : volontariat (les établissements volontaires sont probablement plus favorables), effet « nouveauté » ; le préenregistrement et l'analyse en intention de traiter les limitent.

## 5. Méthode de calcul (code dans `modele.py`, fonctions pures, tests dans `test_modele.py`)

**Bloc A.** Dépense par niveau = effectif × coût par élève ; la différence avec la DIE (≈ 35 Md€) est le **reste non expliqué** : formation continue, administration, périscolaire, apprentissage hors effectifs ; **à reconstituer à la source** (V6182).

**Bloc B.** Coût du tuteur = licence + matériel amorti + (35 000 / élèves par accompagnateur). Coût national = coût par élève × 11,78 M élèves. Coût par 0,1 écart-type = coût / (effet / 0,1). ETP libérés = 730 000 × part de temps libéré. ETP excédentaires par démographie = 730 000 × 1,7 / 11,78. Années pour absorber sans licencier : n tel que 730 000 × (1 − (1 − 0,03)^n) = ETP à absorber.

**Bloc B'.** Coût d'un surveillant = brut mensuel × 12 × coefficient de charges (H22). Coût par élève = licence + matériel amorti + coût du surveillant / N (H23). Économie nette = économie du non-remplacement (H24) − coût national du tuteur surveillé. Établissements par bras : J = 2 × [ICC(1−R²entre) + (1−ICC)(1−R²dans)/n] × (2,8 / MDE)² (H25).

**Bloc C.** Indice de dissimilarité de Duncan, D = ½ Σ |a_i/A − b_i/B| ; aucune donnée française chargée.

**Bloc D.** Économie en ligne = étudiants × coût × 60 % × part en ligne × réduction ; abandons = entrants × part en ligne × surcroît × coût d'une année ; certification = étudiants × part × coût d'épreuve ; solde = économie − abandons − certification.

## 6. Ce que le modèle ne fait pas

- Pas d'effet sur l'emploi des jeunes ni sur la croissance (le lien entre scolarité et revenu est établi mais non chiffré ici).
- Pas de coût d'un lycée « à la carte » ni des savoirs pratiques (cuisine, bricolage) : aucune donnée.
- Pas de modèle de l'impact de la baisse démographique sur les écoles rurales.
- Pas de chiffrage du chèque éducation, ni du supérieur ouvert à tous (capacité d'accueil, amphithéâtres).
- Pas de données de dépense OCDE (« Regards sur l'éducation ») : non lues (V6181).

## 7. Steelman : la meilleure objection

**« Le tuteur IA creuse les inégalités. »** Les enfants déjà motivés et bien entourés en tireront le plus (le Nigeria montre des gains, mais sous la supervision de professeurs, en groupe) ; l'élève en difficulté, face à un écran, peut y chercher un raccourci (Bastani). L'accès (équipement, connexion, accompagnement familial) est inégal. **Réponse partielle** : le modèle ne remplace pas l'enseignant (H12) et réserve un poste d'accompagnateurs (H8) ; mais l'effet par catégorie sociale n'est pas mesuré ici : c'est la première chose à mesurer dans une expérimentation.

**« Ce que l'IA ne remplace pas, c'est la relation. »** L'auteur partage cette position. Le modèle est cohérent avec cela uniquement si le temps libéré par l'IA est rendu aux élèves en petits groupes, non supprimé.

## 8. Contraintes juridiques nommées

- Constitution et loi : liberté de l'enseignement (loi Debré de 1959, contrats d'association), laïcité, obligation d'instruction à partir de 3 ans : tout chèque éducation ou toute autonomie doit les respecter. ⚠️ à relire à la source.
- Statut des enseignants : fonctionnaires, concours ; redéploiement dans le cadre du statut (aucune suppression de poste n'est supposée).
- RGPD et règlement européen sur l'IA : les systèmes d'IA utilisés pour évaluer des élèves ou orienter l'accès à l'éducation sont classés « à haut risque » (annexe III du règlement 2024/1689) ; le tuteur est à examiner à cette aune. ⚠️ à relire.
- Droit de l'UE : reconnaissance des diplômes, mais pas de contrainte directe sur l'organisation scolaire.
