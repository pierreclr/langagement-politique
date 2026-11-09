---
titre: Économies côté dépenses : ce que l'on peut raisonnablement attendre (T47)
tache: T47
statut: brouillon sourcé ; ordres de grandeur sous hypothèses, jamais des prédictions
date: 2026-11-01
---

# Économies côté dépenses : combien, à quel délai, avec quels effets humains

> **Question de l'auteur (T47).** Le palier 1 ne boucle pas par les recettes seules (solde −163 Md€ au central, `modeles/systeme-ideal/resultats.md` § 13). Que peut-on **raisonnablement économiser côté dépenses**, en Md€ par an à 3 et à 10 ans, avec des sources primaires et les effets humains ?
>
> **Documents lus en texte (téléchargés par curl, extraits par pypdf ou par lecture du HTML, dans `$DONNEES/sources/t47-depenses/`)** : Sénat, commission d'enquête sur les agences, *rapport n° 807* (juillet 2025, `senat807.html`, texte `senat807.txt`) ; Cour des comptes, *Les finances publiques locales 2024, fascicule 2* (octobre 2024, 111 p., `cc_fpl2024_f2.pdf`, copie hébergée par vie-publique.fr) ; IGF, IGAS et IGA, *Le déploiement de l'intelligence artificielle dans les administrations publiques* (avril 2026, synthèse et propositions, 6 p., `ia_igf_igas_iga_synthese.pdf`) ; DGAFP, *Rapport annuel 2025, Les départs à la retraite dans la fonction publique en 2024* (`dgafp_flux_retraites.pdf`). **Repris des notes déjà faites dans le dépôt, non relus ici** : `recherche-inventaire-depenses.md`, `recherche-simplification-et-depenses-interrogeantes.md`, `recherche-sante-leviers.md`, `recherche-marches-risques.md`, `recherche-ugap.md`, `outils/argent-public/GRAPHE.md` §§ 35-44, `modeles/industrie-complexite/resultats.md`.
>
> **Ce qui n'a pas pu être lu** : le rapport d'activité 2025 de la Direction des achats de l'État (page economie.gouv.fr refusée, 403, aucun contournement) ; le rapport de la Cour sur le budget de l'État 2025 et celui sur les perspectives des finances publiques de juin 2026 (non téléchargés, détails ci-dessous) ; les études IPP (fusion des régions) et DGCL (communes nouvelles), connues seulement par la citation de la Cour ou par un résumé de recherche web. Les résumés de recherche web sont marqués « [résumé] » et ne valent pas lecture.
>
> **Légende** : **[Lu]** document ouvert, passage vu · **[Résumé]** résumé de recherche web, document non ouvert · **[Note]** chiffre repris d'une note du dépôt · **[Calcul]** calcul de Claude, reproductible dans ce fichier · **[Hypothèse]** choix de Claude, sans source. ⚠️ = non confirmé.
>
> **Convention de lecture des scénarios.** Dans ce fichier, « bas / central / haut » désigne **l'ampleur de l'économie** (bas = prudent, haut = ambitieux). **Attention : c'est l'inverse de la convention du modèle** (`resultats.md` § 13, où « bas » est le scénario favorable au solde). La correspondance est donnée à la fin (§ 9).

---

## 0. Ce qu'il faut retenir (écrit pour être vrai)

1. **Les économies de dépenses raisonnablement documentées sont modestes : 3 / 8 / 16 Md€ par an à 3 ans et 8 / 18 / 31 Md€ à 10 ans (bas / central / haut), en plus de ce que le modèle compte déjà** (santé 9,7 Md€, niches, allègements, prestations remplacées). Le central à 10 ans représente environ 1 % de la dépense publique (1 714 Md€ en 2025) et **11 % du déficit du palier 1** (−163 Md€). Aucun scénario, même le haut, ne ramène le déficit à zéro : le haut à 10 ans en couvre 19 %.
2. **Le gros levier annoncé, la masse salariale par le numérique et l'IA, rapporte très peu à 3 ans** (≈ 0,1 Md€ net au central, parfois négatif la première année) **et 1 Md€ à 10 ans au central** (de 0,1 à 4,6). La raison est arithmétique : les départs en retraite sont de 136 700 pensions en 2024 pour 5,88 millions d'agents (≈ 2,3 % par an) ; ne pas remplacer 40 % des départs dans les seuls métiers administratifs exposés ne retire que quelques dizaines de milliers de postes en dix ans. Le rapport IGF-IGAS-IGA de 2026 **ne chiffre aucune économie** et décrit des gains « diffus et rarement mesurés ».
3. **Les trois gisements les mieux documentés sont dans les collectivités** (effectifs et temps de travail, achats) **et dans les dépenses mal évaluées** (logement social, sport-jeunesse-vie associative), pas dans le regroupement des agences : le Sénat écrit lui-même « pas de miracle arithmétique » (≈ 540 M€ pour 20 % de fonctions support en moins) et les fusions de 2015-2019 n'ont retiré que 0,8 % des emplois.
4. **La fusion des niveaux (communes, intercommunalités, régions) n'a aucune économie documentée** : la Cour (2019 et 2024) et l'IPP (2021) relèvent l'absence de gains d'efficience de la fusion des régions et même des hausses de coûts ; les communes nouvelles dépensent d'abord plus. C'est un argument de simplicité et de lisibilité, pas de budget.
5. **Les « économies » sont mesurées par rapport à une trajectoire**, pas en baisse de la dépense en euros courants, comme en santé (`recherche-sante-leviers.md` § 0). Un modèle statique en base 2024 les compte en niveau ; la dérive tendancielle (retraites, santé, intérêts) peut les absorber. Les revues de dépenses réalisées ont rendu **3,7 Md€ pérennes en 2025** (Cour, avril 2026, [Note]) : le central à 3 ans (8 Md€) suppose de faire **deux fois mieux** que la dernière année documentée.
6. **Ce que cela change pour le palier 1** (§ 9) : le solde central passe de −163 à environ **−155 Md€ à 3 ans et −146 Md€ à 10 ans**, soit 0,6 puis 1,4 point de taux plat, ou **+19 puis +41 €/mois de socle** si tout allait au socle au lieu du déficit. **Ce n'est pas additionnable avec la création de valeur affectée au même usage** (même euro, deux fois). La conclusion de la synthèse v2 (« conserver le déficit actuel, socle de 500 € ») **ne change pas** ; elle devient un peu moins fragile.
7. **Vigilance de méthode (règle 7).** Les gisements les plus faciles à mal compter sont ceux de la **liste des 35 dépenses qui interrogent** : une partie sont des niches ou des exonérations (déjà supprimées par le prélèvement unique), une autre des dépenses ponctuelles (boucliers énergie, indemnité inflation), qui ne sont pas des économies récurrentes. Le § 7 trie.

---

## 1. Cadre, périmètre et doubles comptes

### 1.1 Ce que le modèle compte déjà (à ne pas recompter)

| Poste | Où c'est compté | Conséquence ici |
|---|---|---|
| **Niches fiscales** (88 à 89 Md€) et **allègements de cotisations** (65 à 74 Md€) | Supprimés avec les 885,9 Md€ de prélèvements, remplacés par le taux plat (`methode.md` § 2 ; `recherche-simplification-et-depenses-interrogeantes.md` § 0) | **Aucune économie supplémentaire pour celles qui sont dans les prélèvements supprimés** (impôts sur le revenu et le patrimoine, cotisations) : le § 6 ne compte ni CICE, Dutreil, Pinel, CIR, outre-mer fiscal, Lodéom, taxe au tonnage, zonages fiscaux. **Correction du 03/11/2026 (V7450)** : les niches de l'IS, de la TVA et des accises ne sont pas supprimées, car ces impôts sont conservés (H36, H171) ; elles ne sont donc pas « déjà dans le taux plat » et ne sont ni comptées ni exclues ici : leur économie éventuelle reste à chiffrer à part |
| **Prestations remplacées par le socle** (113,0 Md€ : chômage 37,1, allocations familiales 35,2, logement 16,0, RSA 12,4, prime d'activité 10,7, ASS 1,7) | `methode.md` H86 | La gestion de ces prestations n'y est **pas** comptée ; elle est traitée au § 2 (b) |
| **Indus, erreurs et non-recours** | Dans les montants des prestations remplacées | Rien à ajouter (6 à 8 Md€ d'erreurs CAF : ne pas les compter en « économie » une seconde fois) |
| **Santé** | `sante.js` : 9,7 Md€ au central (12,6 favorable, 2,75 défavorable), écart à la tendance | **Renvoi** (§ 8) : rien de nouveau n'est ajouté |
| **Transition** (4 / 10 / 22 Md€ en année 1) | `palier1.js`, `transition` | Les économies de personnel ci-dessous n'ont pas de coût de reconversion propre : à prévoir dans la transition (§ 2, effets humains) |
| **Création de valeur** (6 / 31 / 59 Md€ à 10 ans, dont dividendes APE, simplification, croissance IA) | `recherche-creer-de-la-valeur.md` | La « simplification » de la création de valeur recoupe la gestion simplifiée du § 2 (b) ⚠️ : voir § 9, vigilance |

### 1.2 Trois précautions sur la nature des « économies »

1. **Économie ≠ baisse de la dépense.** Une économie est un écart à la trajectoire tendancielle, sauf lorsqu'il s'agit d'un effectif ou d'un budget réellement diminué.
2. **« Gain achats » ≠ économie budgétaire.** La Direction des achats de l'État mesure le gain à la notification du marché par rapport à un **prix de référence**, pas par rapport à la dépense de l'année précédente (Acteurs publics, recherche web, [Résumé] ; la définition de la DAE n'a pas pu être lue à la source).
3. **Économie brute ≠ économie nette.** Le non-remplacement d'un agent ne rapporte que son coût employeur **hors cotisation au CAS Pensions** (la pension du retraité est payée dans tous les cas) et si la « restitution » aux agents n'efface pas le gain : la Cour avait relevé en 2010 que l'État rendait à ses agents plus de la moitié des économies du « un sur deux » [Résumé, presse et comptes rendus parlementaires 2010-2011, non lus à la source].

### 1.3 Ordres de grandeur utiles

- Dépense publique 2025 : 1 714,1 Md€ ; rémunération des agents publics : 363,0 Md€ en 2024, 370,0 Md€ en 2025 ([Note], Insee 3.201) ; écart à la zone euro : +2,5 points de PIB (≈ 73 Md€), dont une part de périmètre (hôpitaux, statut public contre privé non lucratif, cotisations imputées).
- Effectifs fin 2024 : **5 876 700 agents** (État 2 587 400 ; territoriale 2 039 400 ; hospitalière 1 249 900) ([Note], Insee Première n° 2094).
- **Départs à la retraite** : **136 700 nouvelles pensions de droit direct en 2024** (−13,0 % après −2,6 % en 2023, premiers effets de la réforme de 2023) : État 38 800 (fonctionnaires civils), territoriale 43 000, hospitalière 19 800, militaires 11 800 ; âge moyen de départ 62,3 ans ([Lu], DGAFP, *Rapport annuel 2025*, fiche « départs à la retraite », p. 79 de l'édition). **Calcul** : 136 700 / 5 876 700 = **2,3 % par an**.
- Un point de taux plat du palier 1 = **12,7 Md€** au taux de 35 % du palier 1 d'origine (10,8 Md€ à 40,7 %, taux de la v5) ; un euro par mois de socle = **0,430 Md€ par an** (23,2 € de socle par tranche de 10 Md€) (`resultats.md` § 13.1-13.2).

---

## 2. Gisement 1 : masse salariale, numérique et IA (départs non remplacés dans les fonctions administratives)

### 2.1 Montant en jeu

- **Masse salariale publique** : 363,0 Md€ en 2024 (État 151,6 ; ODAC 30,9 ; collectivités et ODAL 95,3 ; sécurité sociale 85,3 dont hôpitaux 75,0) ([Note]). Hors cotisations aux pensions, la masse salariale de l'État est de 110,2 Md€ (titre 2 du PLF 2026 : 162,7 Md€ dont 52,5 au CAS Pensions) ([Note], Sénat).
- **Effectifs par fonction** : la DGAFP ne publie pas de ventilation récente par famille de métiers (recherche refaite le 31/10, toujours rien : `recherche-inventaire-depenses.md` § 5) ⚠️. **Substituts** : (i) l'**exposition à l'IA** mesurée par la mission IGF-IGAS-IGA (méthode OIT) : **un agent public sur cinq « sensiblement exposé », un sur sept « significativement exposé », notamment dans les fonctions administratives et de support, un sur quatre faiblement exposé, un sur deux très peu exposé** ([Lu], synthèse, p. 2) ; (ii) les ETPT de l'État par catégorie d'emploi, LFI 2023 : **≈ 150 000 ETPT** dans des catégories dont le libellé contient « administratif » sur 1 961 000 ETPT (7,7 %), liste non exhaustive (les corps de la DGFiP, A, B, C, n'y sont pas libellés « administratifs ») ([Calcul], `fonction_publique/lfi2023_etpt_programmes.csv`).
- **Vivier retenu** [Hypothèse] : un agent sur sept de l'État et de l'hospitalière (2 587 400 + 1 249 900 = 3 837 300 ; /7 = 548 000), moins 82 000 agents déjà comptés au § 3 (b) (DGFiP fiscalité des particuliers et PME : 46 583 ETPT ; branche famille : 35 226 agents). **Bas et central : 466 000 ; haut (un sur cinq) : 685 000.** La territoriale est traitée au § 4 (la Cour a déjà chiffré son propre scénario), les opérateurs au § 3.

### 2.2 Économie documentée par une source officielle

- **Aucune source officielle ne chiffre l'économie de masse salariale permise par l'IA en France.** Le rapport IGF-IGAS-IGA (avril 2026, publié en juillet) conclut que les gains sont « diffus et rarement mesurés », qu'ils « ne se concrétisent qu'après une phase d'apprentissage et d'ajustements », que les coûts d'investissement et de fonctionnement sont « difficiles à estimer et souvent supérieurs aux prévisions », et il **ne propose aucune suppression de postes** : sa proposition n° 12 est une gestion prévisionnelle des emplois et des compétences ciblée sur les métiers exposés [Lu, synthèse p. 2-4].
- **Gains mesurés, très partiels** : la direction des achats de l'État anticipe **plus de 60 % de gain de temps** pour le sourcing des fournisseurs ; une direction juridique ministérielle a **divisé par deux** le temps de recherche documentaire ; le délai de réponse aux usagers de « Services publics + » est passé de 19 à 3 jours ; le chatbot d'une commune réduit les appels perdus de 55 % à 8 % [Lu, p. 2]. Ce sont des gains de **temps** et de qualité, pas des économies budgétaires.
- **Financements actuels** : 2023-2025, la DINUM a engagé **8,7 M€** sur l'IA, les ministères 26,2 M€, France Travail 18,7 M€ : « faibles et fragmentés » [Lu, p. 3]. Pour mémoire, les administrations fiscales françaises consacrent moins de 7 % de leur budget à l'informatique, contre 10 à 20 % chez leurs homologues (Cour, 2020, [Note]) : **un prélèvement automatisé suppose d'investir d'abord**.
- **Précédent chiffré du non-remplacement** (lot 5, 01/11/2026, V2689 : Sénat, avis budgétaire n° 154 de 2012 (https://www.senat.fr/rap/a12-154-15/a12-154-154.html, lu) : suppressions d'emplois de l'État 2009-2012 = 5,4 % des effectifs, dont 3 points rattachables à la RGPP ; objectif d'économies de 15 Md€ sur 2009-2013, 11,9 Md€ attendus fin 2012 contre 12,3 visés ; part des économies restituée aux agents ≈ 63 % (2009), 67 % (2010), 61 % (2011), ce qui **confirme l'ordre de grandeur « plus de la moitié restituée »** ; les 136 000 postes, 4 Md€ et 2,7 Md€ ne sont pas retrouvés dans cette source) : la RGPP (2007-2012) a supprimé 136 000 postes pour ≈ 4 Md€ de masse salariale [Note], soit ≈ 29 000 € par poste ; le gouvernement de l'époque revendiquait 2,7 Md€ pour près de 100 000 postes non remplacés [Résumé] ; la Cour jugeait les économies « inférieures aux attentes » [Résumé]. **Point commun** : l'ordre de grandeur de 30 000 à 40 000 € de gain par poste non remplacé.
- **Coût unitaire retenu** [Calcul] : la Cour chiffre à 4,1 Md€ par an le retour de 100 000 agents territoriaux « un peu plus de 100 000 » à leur niveau de 2011 : **≈ 41 000 € par agent** (cotisations employeur comprises, [Lu], fascicule 2, p. 63 du PDF). Retenu : 41 000 € (bas et central), 50 000 € (haut).

### 2.3 Calcul (reproductible)

Départs annuels du vivier = vivier × 2,3 %. Postes non rendus au bout de n années = départs cumulés × part non remplacée. Économie brute = postes × coût unitaire ; nette = brute × (1 − restitution aux agents) − coût numérique net.

| | Bas | Central | Haut |
|---|---|---|---|
| Vivier (agents) | 466 000 | 466 000 | 685 000 |
| Part des départs non remplacée | 20 % | 40 % | 60 % |
| Coût unitaire | 41 k€ | 41 k€ | 50 k€ |
| Restitution aux agents | 50 % | 25 % | 0 % |
| Coût numérique net (hypothèse : investissement puis maintenance) à 3 ans / 10 ans | −0,5 / −0,3 | −0,3 / −0,2 | −0,2 / −0,1 |
| Postes non rendus à 3 ans | 6 400 | 12 900 | 28 400 |
| Postes non rendus à 10 ans | 21 400 | 42 900 | 94 600 |
| **Économie nette à 3 ans (Md€/an)** | **−0,4** | **0,1** | **1,2** |
| **Économie nette à 10 ans (Md€/an)** | **0,1** | **1,1** | **4,6** |

**Plafond physique** [Calcul] : même en ne remplaçant **aucun** départ d'un vivier d'un agent sur cinq (685 000) pendant dix ans, on ne retire que ≈ 158 000 postes, soit **≈ 7,9 Md€** brut à 50 000 € par poste. Aucun scénario crédible ne dépasse ce plafond sans licenciement.

### 2.4 Délai, conditions, effets

- **Délai** : 3 à 5 ans pour mutualiser des outils (propositions n° 1 et 3 du rapport : assistants généralistes, solutions interministérielles pour achats, juridique, RH), 10 ans pour que les départs absorbent une réduction significative.
- **Conditions** : (i) investir d'abord (données de qualité, interopérabilité, hébergement souverain : propositions n° 8 et 10) ; (ii) **non-remplacement ciblé**, pas uniforme (un « un sur deux » appliqué partout toucherait aussi enseignants, soignants et policiers ; ce n'est pas l'hypothèse) ; (iii) co-construction avec les agents et dialogue social (propositions n° 5 et 11) ; (iv) aucune baisse de qualité pour les usagers fragiles.
- **Effets sur les agents** : pas de licenciement dans ce mécanisme ; **charge de travail** accrue dans les services qui perdent des postes avant que les outils ne produisent leurs gains (le rapport relève que les gains se matérialisent après une phase d'apprentissage) ; **pyramide des âges déséquilibrée** (moins d'entrants jeunes) ; reconversion interne à financer (`modeles/industrie-complexite/resultats.md` § 5 : le rythme décide de tout). Le rapport relève que l'IA est un facteur d'attractivité et de réduction de la rotation (un centre de gestion de Haute-Savoie) [Lu, p. 2], ce qui joue en sens inverse de la crainte.
- **Effets sur les usagers** : meilleur délai et qualité pour les démarches simples ; **fracture numérique** pour les autres. Le Défenseur des droits demande depuis 2019 qu'aucune démarche ne soit accessible uniquement par voie dématérialisée ; il a relevé 15 % de saisines en plus en 2021 [Résumé, rapport de 2022 non lu] ; 73 % des communes de moins de 3 500 habitants n'ont aucun projet d'IA [Lu, p. 1]. **Risque d'erreur** automatisée (contentieux et perte de confiance cités par le rapport comme « échecs étrangers »).
- **Meilleure objection** : *« L'IA va supprimer des centaines de milliers de postes : 700 000 agents sont exposés, donc le gisement est de dizaines de milliards. »* **Réponse** : l'exposition mesure des tâches qui pourraient être automatisées, pas des emplois qui disparaissent : le rapport le dit lui-même (« ne préjuge pas des gains de productivité effectifs »). Même si la moitié du temps libéré devenait une suppression, la contrainte est celle des départs (2,3 % par an) et du coût de l'investissement. Le gain principal est la qualité de service, que le budget ne voit pas.

---

## 3. Gisement 2 : regroupement des opérateurs et agences, gestion simplifiée

### 3.1 Opérateurs et agences

**Montant en jeu.** Opérateurs de l'État : 434 au PLF 2025, 431 au PLF 2026, 423 au PLF 2027 (Fipeco, [Note]) ; 1 153 organismes publics nationaux (Sénat, [Lu]) ; ODAC : 142,6 Md€ de dépense en 2024 ([Note]) ; financements publics des opérateurs : ≈ 73,6 Md€ (LFI 2026, Fipeco [Note]) ; 401 389 ETPT sous plafond (LFI 2026). **Fonctions support : 2,7 Md€** ; **coûts de fonctionnement des opérateurs : ≈ 27 Md€** (calcul : 2,2 Md€ = 8 % ; le Sénat donne le 8 % et le 2,2 Md€) ([Lu], rapport 807, partie III.D).

**Économie documentée.**
- **Sénat, rapport 807 (juillet 2025)** : **−20 % du coût des fonctions support = ≈ 540 M€**, jugé « très volontariste » hors fusion ; réduction de 8 % du coût de fonctionnement = 2,2 Md€, mais « ne pourrait être à missions constantes » ; supprimer 20 % des organismes consultatifs ≈ 10 M€ ; la ministre a avancé 2 à 3 Md€ sans pouvoir préciser le calcul à la commission ; **fusions 2015-2019 : −0,8 % d'emplois à périmètre constant** (Cour des comptes) ; **Royaume-Uni 2010-2015 : ≈ 146 M€ cumulés** [Lu]. **Conclusion du Sénat** : « des gains potentiels, mais pas de miracle arithmétique » ; **l'enjeu véritable porte sur le périmètre des politiques publiques portées par les opérateurs**, c'est-à-dire sur des **charges d'intervention** (subventions aux entreprises et aux particuliers), non sur les structures [Lu].
- **Réalisé à ce jour** : −11 opérateurs entre PLF 2025 et 2027 contre ≈ 145 visés par l'iFRAP ; fusion des cinq IRA au 01/01/2027 (décret 2026-27, `GRAPHE.md` § 37) ; bilan de la ministre à l'audition du 15/10/2025 : 2 Md€ et 1 700 ETP (AFD, CCI, parcs nationaux…) ([Note]).
- **Cotutelles** : `GRAPHE.md` §§ 35-44 : sur 378 opérateurs dont la tutelle est lue dans les textes, **63 ont une cotutelle absente du jaune budgétaire** (le jaune ne rattache chaque opérateur qu'au programme chef de file) et 19 un ministère différent ; 69 opérateurs restent non lus (`GRAPHE.md` § 44). **Ce que cela établit** : le pilotage est éclaté (plusieurs ministères pour un même établissement), ce qui plaide pour un rattachement unique, mais **ne donne aucun chiffre d'économie** : aucune source lue ne chiffre le coût de la cotutelle ⚠️.

**Fourchette retenue (Md€/an, nette du recouvrement avec le § 2)** [Calcul et hypothèse] :

| | Bas | Central | Haut |
|---|---|---|---|
| À 3 ans | 0,1 | 0,2 | 0,5 |
| À 10 ans | 0,2 | 0,4 | 1,5 |

Bas : un cinquième des 540 M€ à 3 ans (les fusions se font cas par cas, les engagements en cours se poursuivent). Central : 540 M€ moins un recouvrement avec le § 2 (les fonctions support sont en partie de la masse salariale). Haut : 540 M€ plus une part de la réduction de 8 % du fonctionnement (2,2 Md€), **seulement si des missions sont abandonnées** : hypothèse du Sénat lui-même, non neutre pour les usagers.

**Délai.** 3 à 5 ans (fusions, transferts, reprise des engagements, coûts sociaux de fusion).
**Conditions.** Fusion des opérateurs de nature proche ; mutualisation de la paie, des achats, du numérique et de l'immobilier (foncière de l'État) ; **rattachement à une seule tutelle** ; contrat d'objectifs et de performance (22 % des opérateurs en 2020, Cour 2021 [Note]).
**Effets sur les agents.** Mobilité forcée, harmonisation des régimes indemnitaires (souvent par le haut : coût court terme) ; les opérateurs de recherche et d'enseignement supérieur (251 884 ETPT sur 401 389) sont un cas à part. **Usagers** : risque de perte de proximité ou d'expertise (parcs nationaux, culture).
**Meilleure objection.** *« Les agences existent parce que l'administration centrale est trop rigide : les regrouper ramène la rigidité. »* **Réponse** : le Sénat distingue fusion, transfert, suppression et mutualisation cas par cas ; la proposition ne vaut pas « fusionner pour fusionner » mais **réduire les doublons de support**. L'argument budgétaire est faible : l'argument de lisibilité est le vrai.

### 3.2 Gestion devenue inutile avec la simplification (propre au système)

**Montant en jeu** : gestion de la branche famille 3,2 Md€ (35 226 agents) ; DGFiP fiscalité des particuliers et PME 3,69 Md€ (46 583 ETPT) ; Urssaf recouvrement 1,85 Md€ ; Unédic (gestion et CSP) ≈ 0,155 Md€ ([Note], `recherche-simplification-et-depenses-interrogeantes.md` § 1).
**Économie documentée** : aucune source officielle ne ventile les coûts de gestion par prestation (la DSS ne les publie pas) ; l'estimation de la note est « certain 0,5 ; probable 1,5 à 3 ; hypothétique 4 à 8 Md€ », avec des clés de répartition **de l'auteur de la note** (40 à 60 % de la gestion famille, 25 à 40 % de la DGFiP particuliers et PME…).
**Fourchette retenue (Md€/an)** [Hypothèse prudente, plus basse que la note] :

| | Bas | Central | Haut |
|---|---|---|---|
| À 3 ans | 0,1 | 0,4 | 0,8 |
| À 10 ans | 0,3 | 1,0 | 2,5 |

Pourquoi plus bas que la note : le palier 1 **garde** un plancher RSA, un chômage dégressif, un plancher des parents isolés et des retraites (donc des fichiers et des contrôles) ; il crée le contrôle du socle (résidence, identité) ; la transition suppose un système d'information dont les grands projets dérivent de plus de 30 % en moyenne (Cour, 2020).
**Délai** : 3 ans pour la première moitié (le SI doit exister), 10 ans pour le reste (départs).
**Effets sur les agents** : jusqu'à 20 000 à 40 000 postes de la CNAF et de la DGFiP concernés ([Note], estimation à étaler sur les départs) ; reconversion vers le contrôle, l'accompagnement, la lutte contre la fraude.
**Effets sur les usagers** : moins d'erreurs et de non-recours (RSA ≈ 30 %, minimum vieillesse 50 %) ; **mais** la suppression des guichets de proximité de la CAF est un risque pour les personnes éloignées du numérique.
**Meilleure objection.** *« La collecte française est déjà bon marché (0,54 € pour 100 €) : on ne peut pas économiser sur une administration déjà efficiente. »* **Réponse** : exact pour la collecte ; ici l'économie vient surtout de la **gestion des prestations supprimées**, où l'on ne s'appuie pas sur un ratio mais sur le fait qu'un dispositif disparaît.

---

## 4. Gisement 3 : collectivités (empilement, dépense par habitant, fusion des niveaux)

### 4.1 Montant en jeu

**Dépenses locales** : 212,6 Md€ de fonctionnement et 72,8 Md€ d'investissement (budgets 2023) ; **34 935 communes, 1 254 intercommunalités à fiscalité propre, 101 départements, 18 régions** (2024) ([Lu], Cour, fascicule 2, encadré « chiffres clés », début du chapitre I) ; effectifs territoriaux 2 039 400 fin 2024 ; **dépense de fonctionnement 2023 : achats 48,9 Md€ (23,1 % des dépenses réelles de fonctionnement)** [Lu].

### 4.2 Économie documentée

- **Cour des comptes, octobre 2024, proposition d'économie n° 1** : ramener progressivement les effectifs des collectivités à leur niveau de fin 2011 (1,76 million) par **non-remplacement d'une partie des départs**, soit « un peu plus de 100 000 » agents (−5,5 %) : **4,1 Md€ par an à partir de 2030** (euros 2023) ; « un peu plus de 0,8 Md€ » en moyenne sur chacune des années 2025 à 2029 prises individuellement (la lecture « montée linéaire d'environ 0,8 Md€ par an » est de Claude ⚠️). **Alignement du temps de travail sur la durée légale : 1,3 Md€ par an** (durée effective 2022 : 1 564 h dans la territoriale, 43 h sous les 1 607 h) ; **absentéisme** : économie non chiffrée (27,2 jours en moyenne contre 14,1 dans les communes de moins de 1 000 habitants et 34,5 au-dessus de 100 000) [Lu, p. 17, 63, 76].
- **Mutualisation intercommunale** : seule la moitié des services techniques, des systèmes d'information et de l'urbanisme sont mutualisés ; un tiers des services support ; un quart de la commande publique (Intercommunalités de France, 2021, cité par la Cour) ; **les schémas de mutualisation sont facultatifs depuis leur suppression** ; la Cour propose de les rendre obligatoires [Lu].
- **Fusion des niveaux** : la Cour (2019) et l'IPP (2021) « ont souligné **l'absence de gains d'efficience** lié à ce redécoupage territorial » des régions, avec des **hausses de coûts** (rémunérations, indemnités d'élus) ; la Cour constate des **doublons** de dépenses de personnel, d'achat et d'équipement entre communes et intercommunalités [Lu, p. 86 du PDF, citant les études]. **Communes nouvelles** : le bulletin de la DGCL (2020) montre que les dépenses de fonctionnement des 517 communes nouvelles de 2016 et 2017 ont crû plus vite que celles des autres, l'écart se résorbant en 2019 ; une étude (*Revue d'économie régionale et urbaine*, 2024) ne trouve pas d'économies d'échelle systématiques ; les maires déclarent −11 % de frais de fonctionnement (enquête Territoires conseils, déclarative) [Résumé, non lu]. **Cour des comptes 2022** sur l'intercommunalité : pas d'économies d'échelle démontrées [Résumé].
- **Dépense par habitant** : 910 € par habitant pour les communes nouvelles, 957 € pour l'ensemble des communes en 2019 (« Territoires et finances 2020 »), mais plus pour les communes nouvelles de moins de 3 500 habitants [Résumé]. Aucune source lue ne donne un coût de l'empilement des niveaux en euros ⚠️.

### 4.3 Fourchette retenue (Md€/an)

| Levier | | Bas | Central | Haut |
|---|---|---|---|---|
| Effectifs (non-remplacement ciblé, scénario Cour) | 3 ans | 0,5 | 1,5 | 2,5 |
| | 10 ans | 2,0 | 4,1 | 4,1 |
| Temps de travail (1 607 h) | 3 ans | 0,2 | 0,5 | 1,0 |
| | 10 ans | 0,3 | 0,8 | 1,3 |
| **Fusion des niveaux, intégration** | 3 ans | 0 | 0 | 0 |
| | 10 ans | 0 | 0 | 0 |
| **Total** | **3 ans** | **0,7** | **2,0** | **3,5** |
| | **10 ans** | **2,3** | **4,9** | **5,4** |

Le bas à 10 ans retient la moitié du scénario de la Cour (la Cour elle-même relève la libre administration, la hausse des départs à venir et la difficulté d'agir sur l'absentéisme). Le central à 10 ans reprend la Cour pour les effectifs et retient 0,8 sur 1,3 pour le temps de travail (**recouvrement possible** : si la durée augmente, il faut moins d'agents, les deux montants ne sont pas rigoureusement additifs ⚠️). **Les économies d'achats des collectivités sont au § 5.**

### 4.4 Délai, conditions, effets

- **Délai** : non-remplacement : de l'ordre de 5 ans pour une montée en régime (2030 dans la Cour) ; temps de travail : 1 à 3 ans ; fusion : sans objet budgétaire.
- **Conditions** : l'État ne commande pas directement les effectifs locaux (libre administration, art. 72 de la Constitution) : il peut **conditionner des dotations** (la Cour propose de tenir compte du degré d'intégration pour les subventions) ; **un chantier d'harmonisation du temps de travail** suppose le dialogue social local.
- **Effets sur les agents** : mêmes que § 2 ; la territoriale compte plus de contractuels (CNRACL : déficit pouvant atteindre 10 Md€ en 2030, [Lu]) : la politique des effectifs est liée à celle du régime de retraite.
- **Effets sur les usagers** : les collectivités portent les écoles, la petite enfance, l'aide sociale (60,4 Md€ de santé et action sociale, dont 47,3 Md€ des départements) ([Note]) : toucher à l'effectif revient à toucher à des services de proximité.
- **Meilleure objection.** *« Fusionner les niveaux est le seul moyen de réaliser un vrai gain ; sinon l'empilement coûte cher. »* **Réponse** : c'est **plausible mais non établi** : les deux seules études lues (Cour, IPP) concluent à l'absence de gain après la fusion des régions de 2016, et les communes nouvelles dépensent d'abord plus. La réforme peut se justifier par la lisibilité et la responsabilité politique (un seul niveau pour une compétence), **pas par une économie que l'on pourrait inscrire au budget**.

---

## 5. Gisement 4 : achats publics (offre unique, mutualisation, DAE, UGAP)

### 5.1 Montant en jeu

- **Collectivités** : **48,9 Md€** d'achats de biens et de services en 2023, 17,2 % de leurs dépenses, dont 39,1 Md€ pour le bloc communal ; la moitié des communes ont moins de 100 000 € d'achats par an et quatre agents en moyenne pour toutes leurs tâches administratives [Lu, Cour 2024, p. 76].
- **État** : ≈ 24,8 Md€ d'achats en 2024 (Acteurs publics, titre, [Résumé] ⚠️ ; le « environ 50 Md€ » de 2025 est le périmètre hors défense et sécurité avec les établissements publics : 49,4 Md€ = 24,4 ministères + 25 établissements, selon un relais de presse du rapport DAE 2025 ; périmètres expliqués, V2701) ; **hôpitaux** : 18 Md€ d'achats (programme PHARE, Cour 2024 [Lu]) ; **UGAP** : 6,88 Md€ d'activité en 2024, marge moyenne de 3,74 à 3,76 % sur 5,941 Md€ de commandes, soit ≈ 222 M€ [Note, `recherche-ugap.md`].
- **Concurrence** : offre unique **18,6 %** des consultations avec publicité (hors flux PES, 2023-2025, par consultation ; 21,8 % toutes sources), contre 22 % (France) et 28 % (UE) au tableau de bord de la Commission européenne ; seuil « rouge » à 20 % [Note, `recherche-marches-risques.md`]. **Indicateur statistique, pas un soupçon de faute.**

### 5.2 Économie documentée

- **Cour des comptes (2024)** : repères de l'IGF et de la DAE : programme PHARE hospitalier **910 M€ sur trois ans sur 18 Md€ d'achats (5 %)** ; méthodologie visant 3 à 5 % par an ; **économies d'achat moyennes de la DAE 2016-2018 : 13,4 %** ; gain moyen estimé par l'UGAP : **8,4 %**. La Cour retient pour les collectivités **un objectif de 10 % d'économies, soit ≈ 5 Md€ par an à moyen ou long terme** (euros 2023), avec **1 Md€ en 2025 et 3 Md€ en 2027** (proposition d'économies n° 2) ; elle précise que les bonnes pratiques (sourcing, allotissement, massification) sont difficiles pour les petites communes [Lu, p. 79-80 du PDF].
- **DAE, gains achats** : 413 M€ en 2025 contre 360 M€ en 2024 (rapport d'activité 2025, publié en juin 2026 [Résumé, Acteurs publics, page de la DAE refusée]) ; l'objectif de 800 M€ (330 pour l'État, 470 pour les établissements publics) concerne les deux périmètres réunis et n'est donc **pas incohérent** avec le 413 M€, qui ne couvre que les services de l'État (objectif de 330 M€ au PLF 2025) ; objectif global porté à 850 M€ en 2026 (Weka, https://www.weka.fr/actualite/?p=217272, qui cite le rapport d'activité 2025 de la DAE ; **levé en partie le 01/11/2026, lot 5, V2692** ; page de la DAE toujours bloquée par Cloudflare, rapport non lu). Ce sont des gains par rapport à un prix de référence, **non des économies budgétaires** (§ 1.2).
- **Effet de la concurrence sur les prix** : une étude causale tchèque (Titl, « The One and Only: Single-Bidding in Public Procurement », CESifo WP 11697, 2025, https://ideas.repec.org/p/ces/ceswps/_11697.html, résumé lu le 01/11/2026 ; **corrigé** : 6,1 %, et l'année de l'interdiction n'est pas donnée dans la notice, le « 2012 » reste ⚠️) estime que les prix baissent de 6,1 % par rapport aux coûts estimés, sans baisse de qualité apparente ; une étude de l'autorité danoise de la concurrence trouve un prix inférieur de près de 5 % avec deux offres plutôt qu'une, de 10 à 13 % avec quatre [Résumé, non lues ; pays, périodes et définitions différentes ; **aucune étude française lue**] ⚠️.
- **IA** : la DAE anticipe plus de 60 % de gain de temps pour le sourcing [Lu, IGF-IGAS-IGA] : un gain de temps, pas de prix.

### 5.3 Fourchette retenue (Md€/an)

| | | Bas | Central | Haut |
|---|---|---|---|---|
| Collectivités (Cour : 3 Md€ en 2027, 5 Md€ à terme) | 3 ans | 0,8 | 1,8 | 3,0 |
| | 10 ans | 2,0 | 3,5 | 5,0 |
| État, opérateurs, hôpitaux hors santé | 3 ans | 0,2 | 0,4 | 0,8 |
| | 10 ans | 0,4 | 0,8 | 1,5 |
| **Total** | **3 ans** | **1,0** | **2,2** | **3,8** |
| | **10 ans** | **2,4** | **4,3** | **6,5** |

Le haut reprend la Cour (3 Md€ en 2027, 5 Md€ à terme) ; le central en retient 60 à 70 % (décote de la réalisation incertaine : en santé, 78 % de réalisation sur les produits de santé en 2025) ; le bas la moitié à 10 ans. **État et hôpitaux** : [Hypothèse] 2 à 6 % de ≈ 25 Md€ à 10 ans (les gains DAE mesurés sont de 0,36 à 0,41 Md€ par an, hors économies budgétaires) ; **les achats hospitaliers de la santé (0,6 Md€ de la Cour, `recherche-sante-leviers.md` § 4)** sont déjà comptés dans la santé : ici, **aucun euro d'achat hospitalier de santé** n'est ajouté (le « hôpitaux hors santé » désigne les achats généraux non couverts par le § 4 de la note santé ⚠️ périmètre à préciser).

### 5.4 Délai, conditions, effets

- **Délai** : 1 à 3 ans pour les premières centrales (le calendrier de la Cour : 2025 et 2027) ; 5 à 10 ans pour la pleine économie.
- **Conditions** : massification (centrales d'achat, UGAP, DAE, associations de collectivités), partage de prix de référence (l'IGF propose de s'appuyer sur l'OFGL pour les collecter), allotissement (qui favorise les PME), **sourcing**, formation des acheteurs ; mesure **ex post**.
- **Effets sur les agents** : acheteurs publics spécialisés dans les grandes collectivités ; les petites communes perdent la liberté de choisir leur fournisseur local.
- **Effets sur les entreprises** : risque pour les **PME locales** : les dépenses de l'État auprès des PME ont reculé de 5,6 à 5,1 Md€ TTC entre 2024 et 2025 (Weka, [Résumé]) ; la massification peut les évincer, d'où l'allotissement. **Concentration** : un fournisseur dominant d'un accord-cadre national est un risque de dépendance (voir `recherche-marches-risques.md`).
- **Meilleure objection.** *« 10 % d'économie sur l'achat public, c'est ce que tout rapport promet depuis vingt ans : le gain est un gain de papier. »* **Réponse** : la Cour le dit elle-même (« économies significatives, bien que difficiles à évaluer précisément ») ; **c'est pourquoi** le central est à 60-70 % de son objectif et que le gain doit être mesuré sur la dépense, pas sur un prix de référence.

---

## 6. Gisement 5 : aides aux entreprises et niches hors système (déjà comptées : à ne pas compter deux fois)

**Ce qui est déjà dans le simulateur** (voir § 1.1) : les dépenses fiscales (88 à 89 Md€, 457 dispositifs), les allègements généraux (65 à 74 Md€) et les exonérations (93,2 Md€ au total en 2024) **disparaissent mécaniquement** avec un prélèvement unique sans niches **pour la part qui relève des impôts et cotisations supprimés** ; **correction du 03/11/2026 (V7450)** : les niches de l'IS, de la TVA et des accises subsistent puisque ces impôts sont conservés (H36, H171) et ne sont pas dans ce taux ; l'effet est **déjà dans le taux plat de 35 %** pour la première part (un euro supprimé de niche est déjà un euro de recette dans l'assiette brute). **Les compter ici serait un double compte.**

**Ce qui reste hors du simulateur** : les aides budgétaires (subventions) : 7 Md€ sur les 211 Md€ « au sens large » de 2023 (Sénat, rapport 808, [Note]) ; les prêts et garanties de Bpifrance (41 Md€) sont des engagements, pas des dons. Les aides budgétaires sectorielles (agriculture, France 2030 : 4,4 Md€, apprentissage : 4,6 Md€) sont traitées au § 7 comme « dépenses qui interrogent ».

**Fourchette (Md€/an)** : **0 / 0 / 0** à 3 ans et à 10 ans (aucune économie supplémentaire).

**Effets** : sur les entreprises, la suppression des niches est **déjà** dans les effets du modèle (la distribution des gagnants et des perdants du § 13.3-13.4 du résultat) ; elle touche des secteurs précis (emploi à domicile, 7,2 Md€ ; CIR, 8,0 Md€ ; Pacte Dutreil, 4,0 à 5,5 Md€).
**Meilleure objection.** *« Supprimer toutes les niches est irréaliste : certaines sont de vraies politiques (CIR efficace pour les PME selon le CNEPI, emploi à domicile). »* **Réponse** : c'est un point de la **simplification** (chapitres 9 et 18 du manifeste), pas de cette note : chaque niche recréée est une dépense ou une perte de recette qu'il faut chiffrer dans le taux plat. La note `recherche-simplification-et-depenses-interrogeantes.md` § 1.3 le dit déjà.

---

## 7. Gisement 6 : les 35 dépenses qui interrogent (sommes)

### 7.1 Tri des 35 cas (`donnees/simplification_7_depenses_interrogeantes.csv`)

| Catégorie | Cas | Traitement |
|---|---|---|
| **Déjà compté (niche, exonération, prélèvement)** | CICE (≈ 18 Md€/an en 2016), CIR (6 à 8 Md€), Pacte Dutreil (5,5 Md€), Pinel (10-12 Md€ cumulés), zonages fiscaux, défiscalisation et Lodéom outre-mer (0,83 + 1,5 Md€), taxe au tonnage, cinéma (crédits d'impôt) | **Exclus** (§ 6) |
| **Ponctuel, non récurrent** | Boucliers énergie 2021-2024 (72 Md€ brut, 36 net), remise carburant (8 Md€), indemnité inflation (3,8 Md€), chèque énergie exceptionnel, écotaxe (958 M€ d'indemnités), ONP/Sirhen/Louvois (≈ 0,75 Md€) | **Pas d'économie récurrente** : leçon de méthode (règle de non-aide généralisée), aucun euro au tableau |
| **Évité, non économisé** | SNU (160 M€ en 2024 ; 3,5-5 Md€ par an en généralisation selon la Cour) | « Coût évité », **pas** une économie au sens de ce tableau |
| **Récurrent, avec une source chiffrée** | Logement social (14,8 Md€, IGF : 1 à 3 Md€ de scénarios) ; sport, jeunesse, vie associative (IGF-IGESR, mai 2025 : 1 à 3 Md€) ; CPF (2,3 Md€ ; ticket modérateur ≈ 190 M€, IGF 2024) | **Retenus** (a, b, c) |
| **Récurrent, sans chiffre officiel d'économie** | Primes à l'apprentissage (4,6 Md€, IGF 2024 : effets d'aubaine possibles) ; dispositifs emploi de France Travail (7,8 Md€, IGF-IGAS 2024 : resserrer le ciblage) ; conseil acheté par l'État (≈ 1 Md€ en 2021) ; culture (Pass Culture 0,244 Md€, cinéma, presse) ; compléments de rémunération outre-mer (1,5 Md€) | **Retenus avec hypothèse de Claude** (c à g), marquée ⚠️ |
| **Contre-exemples** | CIR efficace pour les PME, AME (0,6 % de la dépense de santé), agences (« pas de miracle arithmétique ») | Pas de gisement |

### 7.2 Fourchette détaillée (Md€/an)

| Poste (base sourcée) | 3 ans : bas / central / haut | 10 ans : bas / central / haut | Nature |
|---|---|---|---|
| a. Logement social, 14,8 Md€ (IGF : 1 à 3 Md€) | 0,5 / 1,0 / 2,0 | 1,0 / 2,0 / 3,0 | Documenté |
| b. Sport, jeunesse, vie associative (IGF-IGESR 2025 : 1 à 3 Md€, « peu de suites ») | 0,3 / 0,8 / 1,5 | 0,5 / 1,5 / 3,0 | Documenté |
| c. Formation : CPF 0,19 (IGF) + primes d'apprentissage 4,6 Md€ (⚠️ à retirer, V7450 : la part « apprentissage » est une hypothèse de Claude sans chiffre officiel ; fourchette non recalculée, totaux inchangés) | 0,2 / 0,4 / 0,8 | 0,2 / 0,8 / 1,5 | Partiel (0,19) + hypothèse |
| d. Conseil acheté par l'État, ≈ 1 Md€ (plus que doublé depuis 2018) | 0,2 / 0,3 / 0,5 | 0,2 / 0,4 / 0,6 | Hypothèse (internalisation) |
| e. France Travail, dispositifs 7,8 Md€ | 0,1 / 0,3 / 0,6 | 0,2 / 0,5 / 1,0 | Hypothèse |
| f. Culture (Pass Culture, cinéma, presse) | 0,05 / 0,2 / 0,4 | 0,1 / 0,3 / 0,6 | Hypothèse |
| g. Compléments outre-mer des fonctionnaires, 1,5 Md€ | 0 / 0,1 / 0,3 | 0 / 0,3 / 0,5 | Hypothèse, sensible |
| **Total** | **1,35 / 3,1 / 6,1** | **2,2 / 5,8 / 10,2** | |

**Part documentée** (a + b + CPF) : 2,2 à 6,2 Md€ à 10 ans si les scénarios de l'IGF et de l'IGESR étaient suivis en entier ; **le reste est une hypothèse** (≈ 40 % du central). **Aucun de ces rapports n'a été suivi d'effet important** (Cour, avril 2026 : « exploitation très limitée » des revues de dépenses ; 2025 : 4,9 Md€ documentés dont **3,7 Md€ pérennes**) [Note].

### 7.3 Délai, conditions, effets

- **Délai** : 1 à 3 ans pour un vote de budget ; les économies sur des dispositifs de guichet (logement social, formation) se réalisent progressivement (stock de projets déjà engagés).
- **Conditions** : évaluer d'abord (`recherche-inventaire-depenses.md` § 7.4 : aucun inventaire de la part de la dépense évaluée) ; **garde-fous** pour les publics éloignés (France Travail), les territoires (outre-mer), les associations (financement des petites structures).
- **Effets sur les usagers** : logement social : « demande en forte hausse, 25 % des mises en chantier » (défense de la dépense, [Note]) : moins de logements sociaux = file d'attente plus longue ; apprentissage : « entrées presque doublées (≈ 800 000) » : une baisse brutale peut les réduire ; associations : emplois et lien social locaux.
- **Effets sur les agents** : peu d'agents directs ; les emplois sont dans les associations, les bailleurs, les organismes de formation.
- **Meilleure objection.** *« Ce sont des dépenses sociales utiles ; vouloir les couper parce qu'elles sont mal évaluées, c'est punir les bénéficiaires du défaut d'évaluation de l'État. »* **Réponse** : l'économie n'est pas une coupe uniforme, mais le **recentrage** prévu par l'IGF (ciblage, ticket modérateur) ; l'absence d'évaluation est la raison de retenir le central à moins de 60 % du scénario haut ; en cas de doute, on évalue avant de couper (règle : une dépense sans évaluation publiée ne peut pas être reconduite à l'identique).

---

## 8. Gisement 7 : santé (déjà chiffrée : renvoi)

La santé est traitée dans `sources/recherche-sante-leviers.md` et la brique `sante.js` : **9,7 Md€ au central (12,6 favorable, 2,75 défavorable), déjà comprise dans le solde de −163 Md€ du palier 1**. Les économies de santé sont des **écarts à la tendance** (la CNAM projette +44 Md€ de dépense d'ici 2030 avec une régulation volontariste) : **rien n'est ajouté ici**. Le double guichet AMO/AMC (5,4 à 7,4 Md€ de gestion évitée) est un gain des **payeurs** et non du solde public ; la Cour juge les économies de la LFSS 2026 « à la réalisation incertaine » et « mal ou pas mesurées ex post ». **Une seule précaution** : la mutualisation des achats hospitaliers (0,6 Md€) est comptée dans la santé, pas au § 5.

---

## 9. Tableau de synthèse et conséquences pour le palier 1

### 9.1 Fourchette, par gisement (Md€/an, nets, en plus du modèle)

| Gisement | 3 ans bas | 3 ans central | 3 ans haut | 10 ans bas | 10 ans central | 10 ans haut |
|---|---|---|---|---|---|---|
| 1. Masse salariale, numérique et IA (État, hospitalière) | −0,4 | 0,1 | 1,2 | 0,1 | 1,1 | 4,6 |
| 2a. Opérateurs et agences (regroupement, support) | 0,1 | 0,2 | 0,5 | 0,2 | 0,4 | 1,5 |
| 2b. Gestion devenue inutile avec la simplification | 0,1 | 0,4 | 0,8 | 0,3 | 1,0 | 2,5 |
| 3. Collectivités (effectifs, temps de travail ; fusion : 0) | 0,7 | 2,0 | 3,5 | 2,3 | 4,9 | 5,4 |
| 4. Achats publics (collectivités, État) | 1,0 | 2,2 | 3,8 | 2,4 | 4,3 | 6,5 |
| 5. Aides aux entreprises et niches | 0 | 0 | 0 | 0 | 0 | 0 |
| 6. Dépenses qui interrogent (récurrentes, hors niches) | 1,4 | 3,1 | 6,1 | 2,2 | 5,8 | 10,2 |
| 7. Santé | 0 | 0 | 0 | 0 | 0 | 0 |
| **Total (Md€/an)** | **2,9** | **8,0** | **15,9** | **7,5** | **17,5** | **30,7** |
| En % de la dépense publique 2025 (1 714 Md€) | 0,2 % | 0,5 % | 0,9 % | 0,4 % | 1,0 % | 1,8 % |
| En % du déficit du palier 1 central (163,3 Md€) | 1,7 % | 4,9 % | 9,7 % | 4,6 % | 10,7 % | 18,8 % |

Arrondis à la décimale (le total du bas à 3 ans est de 2,85, celui du haut à 10 ans de 30,7).

**Ce que le tableau suppose** : (i) aucune économie sur les **retraites**, la **défense**, la **charge de la dette** ni l'**enseignement scolaire** ; (ii) les économies s'**ajoutent** (recouvrements traités au § 2 et § 3.1) ; (iii) la mise en œuvre commence l'année 1 et atteint le régime indiqué à 3 puis 10 ans ; (iv) **aucun coût de transition propre** n'est ajouté à ceux du modèle (4 / 10 / 22 Md€ en année 1), alors qu'une partie des économies de personnel suppose des reconversions et un investissement numérique ⚠️.

### 9.2 Conséquences pour le palier 1

Conversion : un point de taux plat = 12,7 Md€ à 35 % (10,8 à 40,7 %, v5) ; 10 Md€ = 23,2 €/mois de socle (`resultats.md` § 13.1-13.2) ; un € de socle/mois = 0,430 Md€.

| | Bas | Central | Haut |
|---|---|---|---|
| **Économie à 3 ans** (Md€) | 2,9 | 8,0 | 15,9 |
| Solde du palier 1, central du modèle (−163,3) | −160,5 | **−155,3** | −147,4 |
| Équivalent en taux plat | 0,2 pt | 0,6 pt | 1,3 pt |
| Équivalent en socle (si tout allait au socle) | +7 € | **+19 €** | +37 € |
| **Économie à 10 ans** (Md€) | 7,5 | 17,5 | 30,7 |
| Solde, central (−163,3) | −155,8 | **−145,8** | −132,6 |
| Équivalent en taux plat | 0,6 pt | 1,4 pt | 2,4 pt |
| Équivalent en socle | +17 € | **+41 €** | +71 € |

**Lectures.**
1. **Le palier 1 reste un palier qui conserve le déficit.** Au central, −155 Md€ à 3 ans et −146 Md€ à 10 ans : on ne passe jamais sous −130 Md€, même avec le haut. La conclusion de la synthèse v2 (« assumer de ne pas l'aggraver ») tient ; le solde du haut reste très au-dessus de l'équilibre.
2. **Les économies de dépenses ne valent pas un socle plus élevé** : +41 € à 10 ans au central, contre +46 € pour la création de valeur affectée au socle (`resultats.md` § 13.2). **Les deux usages sont exclusifs par euro** (même règle : une recette ou une économie constatée l'année précédente, par tranche de 10 Md€) ; **le cumul des deux affectés au socle** donnerait ≈ 48,8 Md€ (17,5 + 31,3), soit environ **+113 €/mois à 10 ans**, soit un socle de ≈ 613 € au central si le déficit n'était pas touché, ce qui contredit la règle norvégienne de ne monter le socle que sur recettes constatées ⚠️ (économies **et** création de valeur ne sont pas toutes deux « constatées » avec certitude).
3. **Ce que cela change en taux plat** : la fourchette de 0,6 à 1,4 point de taux plat (central à 3 et 10 ans) **ne permet pas d'annoncer « environ 35 % » comme « environ 34 % »** sans faire une promesse dont le gain est incertain ; le choix de conserver 35 % tient.
4. **Ce qui change dans le récit de campagne** : **on ne peut pas dire** « on finance par les économies de l'État » (11 % du déficit à 10 ans) ni « on supprime des centaines de milliers de postes » (le haut à 10 ans retire ≈ 95 000 postes dans le gisement 1 et ≈ 100 000 dans les collectivités). **On peut dire** : « l'État rend ses comptes sur chaque ligne, et une partie des économies (achats, collectivités, mal évalué) est documentée par la Cour, l'IGF et le Sénat ».

### 9.3 Correspondance avec la convention du modèle

Le modèle appelle « bas » le scénario **favorable** (réactions faibles). L'économie « haute » de ce fichier va avec le scénario « bas » du modèle (favorable) : −120,5 + 15,9 = **−104,6 à 3 ans** et −120,5 + 30,7 = **−89,8 à 10 ans** (avant création de valeur) ; l'économie « basse » va avec le scénario « haut » du modèle (défavorable) : −233,3 + 2,9 = −230,4 et −233,3 + 7,5 = −225,8. **Ces associations sont un choix de cohérence, pas un résultat** : la réalisation des économies et les réactions du modèle ne sont pas corrélées de façon démontrée ⚠️.

---

## 10. Contradictions, points fragiles et questions à l'auteur (règle 7)

1. **Contradiction avec la thèse « pas un problème de moyens mais de dépenses »** (`recherche-inventaire-depenses.md` § 8) : la thèse « la dépense est exagérée » porte surtout sur la **retraite** (+2,5 points de PIB) et la **santé** (+1,5), pas sur l'administration. Les gisements de cette note (masse salariale, agences, collectivités, achats, dépenses mal évaluées) pèsent ensemble **1 % de la dépense à 10 ans au central** : **la thèse ne se vérifie pas dans les chiffres de l'État**, elle se vérifie, au mieux, dans la **non-évaluation**. Cela ne contredit pas l'objectif de transparence (« comptes rendus ») ; cela contredit l'idée qu'une administration plus efficace suffit à financer le socle.
2. **Biais pro-technologie** (déclaré dans la charte du projet) : l'IA est présentée comme un levier majeur ; **le seul rapport officiel lu ne chiffre aucune économie** et recommande une gestion des emplois, de la formation et du dialogue social. Je recommande de ne **jamais** écrire « l'IA permet de supprimer x postes » avant qu'une source primaire ne le mesure.
3. **L'ego et la communication** : « moins de fonctionnaires » est un slogan puissant ; **il ne rapporte que quelques Md€** et touche des milliers de personnes ; dans la logique « ne perdre personne » (la charte de travail (CONTRIBUTING.md)), les départs non remplacés sont la seule voie compatible, avec la **restitution aux agents** (si elle est de 50 %, l'économie est divisée par deux).
4. **Je n'ai pas lu** la Cour sur le budget de l'État 2025, le rapport de juin 2026 sur les perspectives, la DAE, l'IPP, la DGCL : les chiffres qui en dépendent sont ⚠️ (V ci-dessous).

**Questions à l'auteur (ma recommandation d'abord).**
1. **Compter ou non ces économies dans le palier 1 ?** *Je recommande de ne pas les compter dans le solde affiché* (déficit conservé, −163 Md€), et de les présenter comme une « réserve documentée » de 8 Md€ à 3 ans et 18 Md€ à 10 ans, affectée au déficit tant que les recettes constatées ne les confirment pas.
2. **Pas de fusion des niveaux au programme budgétaire.** *Je recommande de la défendre par la lisibilité, pas par une économie.*
3. **Fixer un objectif d'achats public mesuré sur la dépense** (10 % sur les collectivités à 10 ans, trajectoire de la Cour) *et publier chaque année l'écart avec le gain DAE.*
4. **Dire publiquement la limite de l'IA** : *je recommande la phrase « l'IA améliore le service avant de réduire le coût ».*

---

## 11. Limites

1. **Les hypothèses de Claude** (vivier d'un sur sept et d'un sur cinq ; part de départs non remplacés ; restitution ; coût numérique ; gisements d à g) sont **le principal facteur d'incertitude** : la part documentée par une source officielle est de l'ordre de la moitié du central (collectivités et achats : Cour ; fonctions support : Sénat ; logement social et sport-jeunesse : IGF).
2. **Modèle statique, base 2024** : les économies sont des niveaux, comme la santé ; la dépense tendancielle peut les absorber.
3. **Aucune réaction macroéconomique** : moins de dépense publique peut réduire l'activité (multiplicateur) ; non chiffré ⚠️.
4. **Aucun coût de transition propre** n'est ajouté (§ 9.1) ; le modèle compte 4 / 10 / 22 Md€ en année 1 pour la reconversion de l'industrie de la complexité, pas pour les agents publics.
5. **Les effectifs par fonction** (famille de métiers) ne sont pas publiés par la DGAFP à notre connaissance : les viviers ne sont pas mesurés ⚠️.
6. **Sources secondaires** : plusieurs chiffres (DAE 2025, effet de l'offre unique, communes nouvelles, Défenseur des droits, RGPP) sont des résumés de recherche web.

---

## Synthèse des sources mobilisées

| Source | Quoi | D'où | Ce qu'elle établit |
|---|---|---|---|
| Sénat, [rapport n° 807](https://www.senat.fr/rap/r24-807-1/r24-807-1_mono.html) (juillet 2025), commission d'enquête sur les agences, consulté le 01/11/2026 | Fonctions support 2,7 Md€, −20 % = ≈ 540 M€ ; 8 % du fonctionnement = 2,2 Md€ ; fusions 2015-2019 −0,8 % d'emplois ; Royaume-Uni 146 M€ | Texte lu (`senat807.txt`) | « Pas de miracle arithmétique » ; l'enjeu est dans les charges d'intervention |
| Cour des comptes, [*Les finances publiques locales 2024, fascicule 2*](https://www.vie-publique.fr/files/rapport/pdf/295578.pdf) (octobre 2024), consulté le 01/11/2026 | 4,1 Md€ à 2030 (100 000 agents), 1,3 Md€ (1 607 h), achats 48,9 Md€, 10 % ≈ 5 Md€, 1 Md€ en 2025 et 3 Md€ en 2027 ; absence de gains de la fusion des régions | PDF lu (111 p., pypdf) | Le gisement le mieux documenté ; pas de gain de la fusion des niveaux |
| IGF, IGAS, IGA, [*Le déploiement de l'IA dans les administrations publiques*](https://www.igas.gouv.fr/sites/igas/files/2026-07/Rapport%20IGF-IGAS-IGA%20D%C3%A9ploiement%20IA%20dans%20AP%20%28synth%C3%A8se%20et%20recommandations%29_0.pdf) (avril 2026, publié en juillet), consulté le 01/11/2026 | Un agent sur cinq exposé, un sur sept significativement ; 60 % de gain de temps sur le sourcing ; 8,7 M€ DINUM ; 13 propositions | Synthèse lue (6 p.) | Gains diffus et rarement mesurés ; aucune économie chiffrée |
| DGAFP, [*Rapport annuel 2025*, fiche « départs à la retraite »](https://www.fonction-publique.gouv.fr/files/files/publications/vue-rapport-annuel/ra_2025_vue_flux_de_personnels_retraites.pdf), consulté le 01/11/2026 | 136 700 nouvelles pensions en 2024 (−13 %) | PDF lu | 2,3 % de départs par an : le rythme du non-remplacement |
| Notes du dépôt : inventaire des dépenses, simplification, santé, marchés, UGAP, graphe T40, industrie de la complexité | Effectifs, masse salariale, 35 dépenses, opérateurs, cotutelles, offre unique | Reprises, non relues | Cadre et montants |
| Presse et web (non lus à la source) : Acteurs publics, Weka, Banque des Territoires, Titl (IDEA), autorité danoise de la concurrence, Défenseur des droits | DAE 413 M€, restitution du « un sur deux », offre unique et prix, dématérialisation | Résumés de recherche | À vérifier avant toute citation |

Ces sources établissent que **les économies de dépenses documentées par des sources officielles sont réelles mais petites** (de l'ordre d'un point de dépense à 10 ans), qu'elles se concentrent dans les collectivités, les achats et les dépenses mal évaluées, et que **ni le regroupement des agences ni l'IA ne sont, aujourd'hui, un gisement chiffré par une source primaire**.
