# L'État-plateforme : méthode

Tâche T7 · consultation des sources : 2026-10-25 · code : [`modele.js`](modele.js) · test : [`test_modele.js`](test_modele.js) · résultats : [`resultats.md`](resultats.md)

Légende : **fait sourcé** (lien) · **estimation** (calcul explicité) · **hypothèse** (de l'auteur ou de Claude) · ⚠️ non confirmé.

## 1. Question posée

L'auteur propose une **entité logicielle publique unique** :
- un design system et un socle technique communs ;
- une gouvernance centralisée, mais une architecture décentralisée et cloisonnée ;
- du code ouvert et un red teaming permanent par IA ;
- une construction en interne, avec l'IA.

Elle remplacerait les logiciels redondants des administrations et des collectivités, ainsi que la sous-traitance aux entreprises de services du numérique (ESN). L'auteur avance, comme témoignage, un gain de productivité d'au moins ×100 grâce à l'IA pour le développement de logiciels.

Questions :
1. Combien coûte aujourd'hui l'informatique publique ?
2. Combien coûterait l'entité cible, selon le gain de productivité réellement apporté par l'IA ?
3. Combien d'ingénieurs publics faudrait-il ?
4. Combien coûterait la transition, combien de temps prendrait-elle, et avec quels risques ?

## 2. Périmètre

- **Inclus** : la dépense numérique annuelle de quatre sphères :
  - l'État et ses opérateurs ;
  - la sécurité sociale et France Travail ;
  - les collectivités ;
  - les hôpitaux publics.
- **Exclus** :
  - les systèmes d'armes et le renseignement ;
  - les gains de productivité des **agents non informaticiens** permis par de meilleurs logiciels. C'est sans doute le principal enjeu, mais il relève de [T3](../../sources/recherche-simplification-et-depenses-interrogeantes.md) (coûts de gestion) et non du budget informatique (voir §8) ;
  - les recettes fiscales perdues sur le chiffre d'affaires des ESN et des éditeurs.
- **Unité** : Md€ courants par an, autour de 2024-2026 (millésimes mélangés, voir H1).

## 3. Formules

Dépense actuelle : `C0 = Σ sphères`, découpée en infrastructure `I = 0,45·C0`, applicatif `A = 0,40·C0` et licences `L = 0,15·C0` (H3).

**Effectifs actuels du travail applicatif (ETP)** :
- agents : `N_i = A·(1 − e) / c_i` ;
- prestataires : `N_e = A·e / c_e` ;
- travail « contenu » dans les licences : `N_L = L / c_e` (H12).

**Cible, en quatre leviers** :
1. **Mutualisation** : `f_m = 1 − r·(1 − résiduel)`. La part redondante `r` n'est conservée qu'à hauteur de son résidu (paramétrage, intégration, données locales).
2. **Internalisation** : les mêmes ETP `(N_i + N_e + N_L)·f_m` sont payés au coût d'un ingénieur public `c_c`.
3. **IA, avec la loi d'Amdahl** : `m_eff = 1 / ((1 − p) + p/m)`, où `p` est la part du travail que l'IA accélère et `m` le gain sur cette part. On a alors :
   - ingénieurs cibles `N* = (N_i + N_e + N_L)·f_m / m_eff` ;
   - coût du travail `N*·(c_c + calcul d'IA)`.
4. **Infrastructure** : `I·(1 − g)`.

À ces leviers s'ajoute un surcoût : la **sécurité** vaut `s` × (budget cible hors sécurité).

**Économie annuelle** : `C0 − cible`. Elle se décompose exactement en mutualisation + internalisation + IA + infrastructure − sécurité (vérifié par le test).

**Transition** : `(construction + double fonctionnement + migration + sécurité initiale) × (1 + dépassement)`, avec :
- construction = coût annuel de l'équipe cible × années de construction × 0,5, l'équipe montant en charge linéairement ;
- double fonctionnement = `(A + L)` × part encore en service × années de chevauchement ;
- migration = `A` × années-équivalent / `m_eff` ;
- sécurité initiale = 2 ans du surcoût de sécurité.

**Retour sur investissement** = transition / économie annuelle, en années après la bascule.

**Pourquoi Amdahl.** L'IA n'accélère qu'une partie du travail. Elle accélère l'écriture du code, les tests et la documentation. Elle accélère beaucoup moins le recueil du besoin, l'arbitrage juridique, la recette par les métiers, la conduite du changement, les achats et la responsabilité en cas d'erreur. Même avec `m` infini, le gain total plafonne à `1/(1 − p)` : ×1,7 si p = 0,4, ×2,5 si p = 0,6, ×5 si p = 0,8. **C'est le paramètre le plus important du modèle, plus que `m`.**

## 4. Le coût actuel : ce qu'on sait

**Aucune source officielle ne consolide la dépense numérique publique.** La Cour des comptes dit ne pas pouvoir l'évaluer (2024). Aucun document de politique transversale du PLF 2026 ne porte sur le numérique ([`etat_depenses_organismes.csv`](donnees/etat_depenses_organismes.csv)). Le total est donc une **reconstitution**.

| Sphère | Bas | Central | Haut | Appui |
|---|---|---|---|---|
| État et opérateurs | 4,2 | 5,5 | 7,0 | 4,2 Md€ hors opérateurs : ministres auditionnés par l'Assemblée, 05/2026 ⚠️. **5,5 Md€ : confirmé dans le rapport de la Cour du 10/2026 (p. 42), pour 2025** : 4,4 Md€ d'achats « informatique et télécom » plus 1,1 Md€ de rémunérations (rapport IGF-CGE de 2023, qui ne porte que sur les ministères civils) ; périmètres et années mêlés (V6600, V6601). 3,2 Md€ en 2014 (Cour 2016) ; environ 4 Md€ personnel compris (Sénat, [rapport n° 76, 2016](https://www.senat.fr/rap/r16-076/r16-076_mono.html)). La valeur haute ajoute les opérateurs (hypothèse) |
| Sécurité sociale et France Travail | 1,5 | 2,0 | 2,5 | Environ 1,0 Md€ identifié : CNAM environ 0,38 Md€/an (IGAS, COG 2018-2022), CNAF 0,15 (maîtrise d'œuvre seule, SDSI 2023-2027), Pôle emploi 0,45 (2018 ⚠️). CNAV, Urssaf, MSA et Agirc-Arrco sont inconnus : hypothèse de Claude |
| Collectivités | 3,4 | 4,5 | 6,0 | 3,4 Md€ en 2024 hors personnel, matériel et télécoms (Markess by Exaegis via La Gazette ⚠️). Personnel et matériel ajoutés : hypothèse |
| Hôpitaux publics | 1,8 | 2,2 | 2,6 | 1,7 % du budget (Cour, 01/2025 ⚠️) × 132 Md€ de dépenses des hôpitaux publics ([Insee 2024](https://www.insee.fr/fr/statistiques/8988845)) |
| **Total** | **10,9** | **14,2** | **18,1** | |

**Recoupements** :
- environ 10 Md€/an pour la sphère publique hors militaire (Sénat 2016) ;
- 8,5 Md€ de logiciels, services et cloud pour le secteur public en 2022, hors personnel et matériel (Markess ⚠️) ;
- Royaume-Uni : 26 Md£ en 2023, soit environ 30 Md€ ([State of digital government review, 01/2025](https://www.gov.uk/government/publications/state-of-digital-government-review)), dont 55 % versés à des prestataires.

La fourchette de 11 à 18 Md€ est cohérente avec ces points. Elle reste **la principale incertitude du modèle** (⚠️ V250).

## 5. Hypothèses numérotées

| # | Hypothèse | Source ou statut |
|---|---|---|
| H1 | Dépense actuelle de 10,9 / 14,2 / 18,1 Md€ par an (tableau §4). Millésimes 2018-2026 mélangés, sans correction de l'inflation | Reconstitution de Claude à partir des CSV ⚠️ V250 |
| H2 | Les sphères sont additives, sans double compte (les subventions de l'État aux opérateurs ne sont pas comptées deux fois) | Hypothèse de Claude ⚠️ |
| H3 | Répartition : infrastructure 45 %, applicatif 40 %, licences 15 % | Hypothèse de Claude ⚠️ V251. Points d'appui partiels : à la DGFiP, 62 % d'exploitation et 70 % de personnel dans le budget informatique (Cour 2020 via la presse) ; bureautique de l'État : 61 % de licences sur 100 M€ (Cour 10/2026 ⚠️). Aucune ventilation publique d'ensemble |
| H4 | Part sous-traitée du travail applicatif e = 0,4 / 0,5 / 0,6 | CNAM : 55 à 65 % des jours-hommes de projet ([IGAS](donnees/operateurs_et_projets.csv)) ; Justice environ 60 %, AIFE 71 %, Agriculture 40 %, Éducation 36 % (Acteurs publics 09/2026 ⚠️) ; grands projets de l'État : **32 % de ressources internes** (29 % hors ministères économiques et financiers), donc environ 68 % de sous-traitance, contre un seuil minimal de 37 % calculé par la Cour et 65 % de ressources internes en moyenne chez Gartner ([Cour 2020, p. 68](https://www.ccomptes.fr/sites/default/files/2023-10/20201014-58-2-conduite-grands-projets-numeriques-Etat.pdf), relu le 03/11/2026 : corrige le « 37 % » qui était le seuil et non la mesure) ; médiane de 60 % d'externalisation sur les grands projets en 2022, de 25 à 75 % sur l'activité courante selon les ministères ([IGF-CGE, 01/2023, p. 12](https://www.vie-publique.fr/files/rapport/pdf/290132.pdf)) ; Royaume-Uni : 55 %. 📐 Requalifié : la fourchette 0,4 / 0,5 / 0,6 couvre l'activité courante ; elle est **inférieure** à la mesure sur les grands projets (0,68). Test : e = 0,68 donne 3,8 Md€ d'économie au lieu de 3,3 (V6608) |
| H5 | Les leviers s'appliquent de la même façon aux quatre sphères | Hypothèse de Claude. C'est faux en détail : les collectivités sont plus redondantes, les hôpitaux plus spécifiques |
| H6 | Coût complet d'un agent informaticien actuel : 80 k€/an | Hypothèse de Claude ⚠️ V252 |
| H7 | Coût complet d'un ETP de prestation : 184 k€/an | Calcul : 460 M€ pour environ 2 500 ETP (Sénat 2016, sur la base d'un TJM de 750 € TTC). Recoupement : le ministre affirme qu'un profil interne coûte moitié moins qu'un prestataire (Acteurs publics 09/2026 ⚠️) ; Déclic : 230 € la demi-journée en mutualisé contre 400 € dans le privé |
| H8 | Coût d'un ingénieur public de la cible : 110 / 100 / 90 k€. Attirer des profils rares impose de payer plus que la grille actuelle | Hypothèse de Claude ⚠️ |
| H9 | Mutualisation : part redondante r = 0,15 / 0,30 / 0,45, résidu conservé 50 / 40 / 30 % | Hypothèse de Claude. Point d'appui : budget informatique inférieur de 25 % pour les collectivités adhérant à un opérateur mutualisé (étude Déclic 2020, Val-de-Marne, faite par l'association elle-même ⚠️). Environ 35 000 communes ([DGCL](https://www.collectivites-locales.gouv.fr/)) achètent des fonctions largement identiques (état civil, paie, finances, urbanisme) |
| H10 | Gain de l'IA sur les tâches accélérées : m = 1,2 / 2 / 5 / 100 | Voir §6 |
| H11 | Part du travail accélérée par l'IA : p = 0,4 / 0,6 / 0,8 ; vision de l'auteur testée à 0,95 | Hypothèse de Claude ⚠️ V253. Aucune mesure publique de la part du code dans le travail d'un projet public |
| H12 | Les licences remplacées sont réécrites en interne ; le travail qu'elles contiennent est compté au coût d'un prestataire (L / c_e) | Hypothèse de Claude. Elle surestime peut-être le travail : un éditeur amortit son logiciel sur beaucoup de clients |
| H13 | Calcul d'IA : 20 / 15 / 10 k€ par ingénieur et par an | Hypothèse de Claude ⚠️ V254 (usage intensif d'agents ; les prix baissent vite, voir [acceleration](../acceleration/resultats.md)) |
| H14 | Construction : 5 / 3 / 2 ans, avec une montée en charge linéaire de l'équipe cible | Hypothèse de Claude |
| H15 | Double fonctionnement : 60 / 50 / 40 % de l'applicatif et des licences pendant 4 / 3 / 2 ans ; migration des données et recette : 1 / 0,75 / 0,5 an d'applicatif, divisé par m_eff | Hypothèse de Claude. Ordres de grandeur : Chorus environ 6 ans de déploiement ; Sirhen 11 ans (abandonné) ; ONP 7 ans (abandonné) |
| H16 | Sécurité de la cible : 10 / 7 / 5 % du budget, plus 2 ans de montée en charge pendant la transition | Hypothèse de Claude. La cible du gouvernement est de 5 % du budget numérique des ministères consacrés à la cybersécurité dès 2027 (communiqué du Premier ministre 08/2026 ⚠️). Une cible unique et très attractive justifie davantage |
| H17 | Dépassement de coût de la transition : +100 / +27 / 0 % ; +200 % testé en sensibilité | [Flyvbjerg & Budzier](https://arxiv.org/abs/1304.0265) (1 471 projets informatiques) : +27 % en moyenne ; 1 projet sur 6 est un « cygne noir », avec +200 % de coût et près de +70 % de délai. Cour des comptes 2020 : écart moyen de plus de 30 % pour les grands projets de l'État |
| H18 | Consolidation de l'infrastructure g = 0 / 5 / 10 % | Hypothèse de Claude. L'IA aide peu ici : postes, réseaux et centres de données coûtent surtout du matériel et de l'exploitation |

## 6. La productivité de l'IA : ce qui est mesuré ([`productivite_ia_code.csv`](donnees/productivite_ia_code.csv))

| Étude | Multiplicateur | Nature |
|---|---|---|
| [METR, essai randomisé début 2025](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) | **×0,84** (plus lent), IC ×0,72 à ×0,98 | 16 développeurs open source expérimentés, tâches réelles ; ils se croyaient 20 % plus rapides |
| [METR, fin 2025](https://metr.org/blog/2026-02-24-uplift-update/) | ×1,22 (IC ×0,92 à ×1,61) pour les développeurs initiaux ; ×1,04 (IC ×0,92 à ×1,18) pour les nouveaux | Agents inclus ; « very weak evidence » selon METR, protocole abandonné |
| Cui, Demirer et al. 2025 | ×1,26 (IC ×1,06 à ×1,46) en tâches terminées | 4 867 développeurs, 3 essais en entreprise ; effet surtout chez les juniors |
| Google, essai randomisé 2024 | environ ×1,27 | 96 ingénieurs, une tâche |
| Peng et al. 2023 | ×2,26 | Une tâche simple en laboratoire |
| He et al. 2025 (Cursor) | ×1,29 de lignes ajoutées, les deux premiers mois seulement | Complexité du code ×1,42 durablement : dette technique |
| DORA 2024 | Débit ×0,985, stabilité −7,2 % pour +25 % d'adoption | Corrélations d'enquête |
| METR sur Claude Opus 5.5 (09/2026) | environ ×1,5 « overall », 30 % de chances de ×2 | R&D en IA chez Anthropic ; preuves non publiées ; document d'une partie intéressée ⚠️ |

**Lecture.**
- Les mesures contrôlées donnent **×0,8 à ×1,3** sur le travail réel et jusqu'à **×2,3** sur une tâche simple et isolée.
- Les meilleures estimations de fin 2026 sur un travail complet tournent autour de **×1,5, sous ×2**.
- **×5 n'est mesuré nulle part.**
- Le **×100 de l'auteur est un témoignage**. Il est plausible pour un développeur seul qui produit un logiciel neuf qu'il n'aurait pas pu écrire seul, c'est-à-dire un gain de capacité plutôt qu'une accélération d'un travail existant. Il ne se transpose pas à une organisation de milliers de personnes soumise au droit public, à la recette métier et à la reprise de données de 40 ans.

Les scénarios ×1,2 / ×2 / ×5 / ×100 portent sur **m**, le gain sur la part accélérable. Le gain effectif sur l'ensemble du travail est **m_eff**, plafonné par **p**.

## 7. Scénarios

- **Productivité** : ×1,2 (mesuré), ×2 (haut des mesures), ×5 (extrapolation), ×100 (témoignage de l'auteur, **scénario extrême clairement non mesuré**).
- **Organisation** :
  - **bas** = prudent : peu de redondance réelle, ingénieurs chers, sécurité lourde, 15 ans, dépassement de +100 % ;
  - **central** ;
  - **haut** = favorable à la thèse : forte redondance, 6 ans, sans dépassement.
- **Coût actuel** : bas, central ou haut (H1).
- **Variante « vision de l'auteur »** : m = 100, p = 0,95, organisation haute.

Soit 3 × 4 × 3 = 36 combinaisons, plus la variante. Les résultats retiennent le coût actuel central et donnent les deux autres en proportion (l'économie est à peu près proportionnelle à C0).

## 8. Effets de comportement, de rebond et risques (non chiffrés ou partiellement)

1. **Effet rebond (Jevons).** Un logiciel moins cher, c'est plus de logiciels. L'expérience des laboratoires d'IA va dans ce sens : l'IA augmente le volume de code produit (+29 % de lignes chez He et al.) plus qu'elle ne réduit les effectifs. Une partie des économies sera probablement réinvestie en nouveaux services. Ce n'est pas un mal, mais ce n'est plus une économie budgétaire.
2. **Dette technique du code généré.** La complexité augmente durablement (×1,42, He et al.), le code dupliqué passe de 8 à 12 % des lignes (GitClear, ⚠️ source commerciale) et la stabilité baisse (DORA 2024). La maintenance future peut absorber une partie du gain.
3. **Monoculture et point unique de défaillance.**
   - Une faille dans le socle commun touche tout le monde. Exemples : HubEE, brique mutualisée de la DINUM piratée en 01/2026 ; mouvement latéral par le réseau interministériel (RIE) jusqu'à la DGFiP en 2026 ; failles d'équipements de bordure Ivanti et Fortinet (voir [`recherche-cybersecurite-france.md`](../../sources/recherche-cybersecurite-france.md)).
   - L'ANSSI recommande *plus* de cloisonnement entre ministères.
   - Les échecs centralisés comptent parmi les plus coûteux connus : la paie fédérale Phénix (Canada) a coûté 2,2 Md CAD imprévus sur 2016-2023, contre 310 M CAD de budget initial ; NPfIT (NHS) environ 9,8 Md£ ⚠️ (la Cour des comptes, 2020, p. 27-28, relaie 11,4 Md£ soit plus de 13,3 Md€ en 2011, coût prévisionnel multiplié par près de cinq d'après l'IGF-CGE 2011, projet arrêté fin 2011 : deux estimations à dates différentes, V6610) ; Queensland Health 1,2 Md AUD ([`operateurs_et_projets.csv`](donnees/operateurs_et_projets.csv)).
   - Le modèle ne chiffre pas l'espérance de perte d'un incident systémique. Il en tient compte seulement à travers le surcoût de sécurité et le dépassement.
4. **Réponse de l'auteur** : architecture décentralisée et cloisonnée, red teaming IA permanent, code ouvert. C'est la bonne direction, et c'est ce que fait déjà l'Estonie (X-Road : échange standardisé entre bases *séparées*, pas une base unique). Cela suppose de **mutualiser des briques et des standards, pas d'unifier les systèmes**. C'est une nuance importante par rapport à « une entité unique ».
5. **Capacité de recrutement.** L'État prévoit 409 recrutements numériques d'ici 2027 à masse salariale constante, et proposait environ 1 000 postes par an en 2022 (⚠️). Former ou recruter 20 000 à 40 000 ingénieurs de haut niveau (scénario central) est un défi majeur, qui suppose une autre grille salariale.
6. **Reconversion.** Les prestataires (environ 15 000 ETP dans le scénario central) et les salariés des éditeurs de logiciels pour collectivités (le groupe Berger-Levrault seul compte environ 2 200 salariés ⚠️) sont concernés. Principe « ne perdre personne » : une partie peut être recrutée par l'entité.
7. **Droit.** Le code de la commande publique et le droit européen des marchés n'interdisent pas de faire en interne (quasi-régie). Mais l'autonomie des collectivités (art. 72 de la Constitution, libre administration) empêche de leur imposer un logiciel. Il faut un modèle d'adhésion volontaire, comme celui de KOMBIT au Danemark (société détenue par l'association des 98 communes, 230 salariés, 30 solutions communes).

## 9. Limites

- Le **coût actuel est reconstitué** et n'est pas observé (H1, H3) : c'est la limite principale. Une division par deux de l'incertitude demanderait un « jaune » budgétaire du numérique, qui n'existe pas.
- Les paramètres d'organisation (r, p, coûts) sont des **hypothèses de Claude**, faute d'études. Les fourchettes sont larges à dessein.
- Le modèle est statique : régime permanent d'un côté, coût de transition de l'autre, sans actualisation ni trajectoire annuelle.
- Il ne chiffre ni la qualité du service rendu, ni les gains de productivité des agents usagers, ni le risque systémique.
- Les chiffres de la Cour postérieurs à 2020 n'ont pas pu être lus à la source (site inaccessible le 2026-10-25) : ils viennent de la presse.

## 10. Ce qui manque

- La dépense numérique consolidée et ventilée (fonctionnement, investissement, personnel, achats) de l'État, des opérateurs, de la sécurité sociale, des collectivités et des hôpitaux.
- L'effectif de la filière numérique publique : 18 500 agents civils de l'État en 2016 (DGAFP via le Sénat) et environ 20 000 aux Armées ; le chiffre actuel est inconnu.
- Les budgets SI de la CNAV, de l'Urssaf, de la MSA, de l'Agirc-Arrco et de France Travail après 2020.
- Le marché des éditeurs pour collectivités : chiffre d'affaires secteur public, parts de marché.
- Les coûts de FranceConnect et de Démarches simplifiées, les deux meilleurs exemples de mutualisation réussie (45 millions d'utilisateurs ; 22,7 millions de dossiers) : ils ne sont pas publiés.
- Une mesure indépendante de la productivité d'une équipe *publique* utilisant des agents d'IA. **beta.gouv.fr pourrait la produire** : 1 342 membres, environ 300 services ; un essai randomisé y serait faisable.
