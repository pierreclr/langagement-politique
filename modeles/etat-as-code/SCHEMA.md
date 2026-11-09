---
titre: L'État as code, schéma du modèle (v0)
date: 2026-11-06
statut: v0, brouillon de travail (tâche T70) ; état actuel sourcé, état proposé = scénario P1 non tranché par l'auteur
vérifications: V19000 à V19015 (verifications.md)
---

# L'État as code : schéma du modèle (v0)

Demande de l'auteur (06/11/2026) : représenter l'état actuel et l'état futur de l'État « as code », pour pouvoir les tester et raisonner sur des modèles plutôt que sur des mots. Ce dossier en est la première version : un jeu de tables ouvertes (CSV, séparateur « ; », UTF-8), décrit par un `datapackage.json` (format Frictionless Data, tâche T60), et une suite de tests automatiques en Python standard.

Écrit par Claude (IA d'Anthropic). Légende des statuts dans les tables : **fait** (texte de loi en vigueur, statistique publique, fiche officielle, avec sa source) ; **calcul** (somme ou rattachement fait par le code, règle indiquée) ; **hypothèse** (choix du scénario proposé, ou rattachement de jugement) ; **⚠️** (à vérifier, renvoi à `verifications.md`).

## 1. Ce que contient le dossier

```
modeles/etat-as-code/
├── SCHEMA.md                 ce fichier
├── RAPPORT.md                ce que révèle le modèle
├── datapackage.json          description Frictionless de toutes les tables (champs, types, clés)
├── donnees/                  le modèle
│   ├── niveaux.csv               niveaux territoriaux et institutionnels (actuels et proposés)
│   ├── competences.csv           61 compétences, leur base légale, leur devenir
│   ├── attributions.csv          compétence × niveau × rôle, pour chaque état (cœur du modèle)
│   ├── regles.csv                68 articles de code en vigueur (généré depuis la base LEGI locale)
│   ├── organismes.csv            49 acteurs du modèle (actuels et nouveaux) avec leurs compétences
│   ├── organismes_instances.csv  les 2 776 organismes du recensement (généré depuis le grand livre)
│   ├── demarches.csv             21 démarches citoyennes, pièces demandées
│   ├── demarche_etapes.csv       qui intervient dans chaque démarche, avant et après
│   ├── fiches_service_public.csv les fiches officielles utilisées (généré, flux DILA)
│   ├── flux.csv                  425 flux financiers entre administrations (généré depuis le grand livre)
│   ├── budgets_competences.csv   dépenses 2024 des collectivités par compétence et niveau (généré)
│   ├── fonction_competence.csv   table de passage nomenclature fonctionnelle → compétence
│   ├── agents.csv                effectifs par programme, grande administration et niveau local (généré)
│   ├── batiments.csv             parc (v0 : agrégats seulement)
│   ├── guichets_france_services.csv  structures France services par département (généré)
│   └── correspondance_niveaux.csv    niveau actuel → niveau proposé
├── code/
│   ├── construire.py             génère les tables dérivées et datapackage.json
│   ├── extraire_regles.py        extrait les articles de code (XML codes.droit.org, base LEGI)
│   ├── index_service_public.py   indexe les fiches service-public (flux DILA « vosdroits »)
│   ├── modele.py                 chargement et requêtes (fonctions pures)
│   └── rapport.py                calcule les résultats (resultats/*.csv)
├── tests/                    tests automatiques (unittest, bibliothèque standard)
└── resultats/                sorties de rapport.py
```

Rejouer (depuis la racine du dépôt, aucun réseau) :

```
python3 -I modeles/etat-as-code/code/extraire_regles.py $DONNEES/sources/legi/codes-droit-org modeles/etat-as-code/code/articles_cibles.csv modeles/etat-as-code/donnees/regles.csv
python3 -I modeles/etat-as-code/code/construire.py [<liste-fs.csv> <index_service_public.csv>]
python3 -I -m unittest discover -s modeles/etat-as-code/tests -v
python3 -I modeles/etat-as-code/code/rapport.py
```

Les deux arguments facultatifs de `construire.py` régénèrent `guichets_france_services.csv` et `fiches_service_public.csv` à partir des fichiers téléchargés dans `$DONNEES/sources/etat-as-code/` (liste ANCT du 05/11/2026 ; flux DILA particuliers et professionnels, indexé par `index_service_public.py`). Sans eux, ces deux tables restent telles qu'elles sont versionnées.

## 2. Entités

| Entité | Table | Clé | Ce qu'elle représente |
|---|---|---|---|
| Niveau | `niveaux` | `id` | un échelon : commune (N-COM), intercommunalité (N-EPCI), métropole (N-MET), syndicat (N-SYN), département (N-DEP), région (N-REG), État (N-ETAT), opérateur national (N-OPE), sécurité sociale (N-SECU) ; dans l'état proposé : collectivité de proximité (P-PROX), région (P-REG), État (P-ETAT), État-plateforme (P-PLAT), sécurité sociale unifiée (P-SECU) ; et TIERS (médecin, employeur, propriétaire… hors administration) |
| Compétence | `competences` | `id` | une mission publique (C01 état civil … C61 collecte unique), avec les règles qui la fondent et son devenir (`existe_propose` = oui / non / à_arbitrer ; `devient` = compétence qui la reprend) |
| Attribution | `attributions` | (etat, competence, niveau, role) | qui fait quoi : le cœur du modèle |
| Règle de droit | `regles` | `id_regle` | un article de code en vigueur, avec son identifiant LEGIARTI, sa version et un extrait |
| Organisme | `organismes` | `id` | un acteur concret (mairie, CAF, MDPH, Urssaf…) ou un acteur du système proposé (collectivité de proximité, État-plateforme…), avec ses compétences avant et après et son sort |
| Organisme recensé | `organismes_instances` | `id` | les 2 776 organismes du grand livre (instances.csv), avec leur préclassement et leur ministère proposé |
| Démarche citoyenne | `demarches` | `id` | un acte de la vie courante (déclarer ses revenus, demander le RSA, faire reconnaître un handicap…) |
| Étape de démarche | `demarche_etapes` | (etat, demarche, ordre) | un organisme qui intervient, son rôle, et si l'usager doit le contacter (`contact_usager` = oui / non / facultatif) |
| Flux financier | `flux` | `id` | un transfert entre administrations (payeur → receveur, Md€ 2024) |
| Budget | `budgets_competences` | (niveau, entite_source, competence) | dépense 2024 d'un niveau local rattachée à une compétence |
| Agent | `agents` | `id` | effectif (ETPT, ETP ou personnes, l'unité est dite) |
| Bâtiment | `batiments` | `id` | parc immobilier (v0 : trois agrégats) |
| Guichet | `guichets_france_services` | `insee_dep` | structures France services par département |

## 3. Relations

| Relation | Où elle vit |
|---|---|
| compétence → niveau (avec un rôle) | `attributions` (clés étrangères vers `competences` et `niveaux`) |
| compétence → règle de droit | `competences.regles` et `attributions.regles` (liste d'`id_regle`) ; règle → article de code par `regles.legiarti` |
| organisme → compétences | `organismes.competences_actuel`, `organismes.competences_propose` |
| organisme → niveau | `organismes.niveau_actuel`, `organismes.niveau_propose` |
| organisme → ministère proposé | `organismes_instances.ministere_propose` (les 16 ministères du grand livre) |
| organisme du modèle → organisme recensé | `organismes.ref_instances` |
| démarche → organismes qui interviennent | `demarche_etapes` (clés étrangères vers `demarches` et `organismes`) |
| démarche → compétences | `demarches.competences` |
| flux → payeur, receveur | `flux.payeur`, `flux.receveur` : un niveau, un organisme ou un sous-secteur (S-APUL, S-MENAGES, S-ENTREPRISES…) |
| budget → compétence | `budgets_competences.competence`, via `fonction_competence.csv` |
| niveau actuel → niveau proposé | `correspondance_niveaux` |

## 4. Rôles dans les attributions

| Rôle | Sens | Exemple |
|---|---|---|
| responsable | exerce la compétence de plein droit | le département pour le RSA (CASF L262-13) |
| responsable_partiel | exerce une partie (intérêt communautaire, territoires où la compétence n'a pas été transférée) | la commune pour l'eau là où la communauté de communes ne l'a pas prise |
| partage | compétence déclarée partagée par la loi | culture, sport, tourisme (CGCT L1111-4) |
| chef_de_file | organise l'action commune | le département pour l'action sociale (L1111-9 III) |
| optionnel | peut l'exercer par transfert, convention ou délégation | la métropole pour les collèges (L5217-2 IV 8°) |
| operateur | exécute pour le compte d'un autre | la CAF qui instruit et verse le RSA |
| finance | cofinance de façon structurelle | la CNSA pour l'APA et la PCH |
| controle | contrôle sans exercer | l'administration des archives (code du patrimoine L212-6) |

Trois mesures de chevauchement en découlent (`modele.py`) : **juridique** (au moins deux niveaux parmi responsable, responsable_partiel, partage, chef_de_file, optionnel), **stricte** (au moins deux niveaux parmi responsable, responsable_partiel, partage), **large** (on ajoute opérateurs et financeurs). Une quatrième est **financière** : au moins deux niveaux dépensent 50 M€ ou plus en 2024 sur la compétence.

## 5. Les deux états

- **actuel** : établi à partir des textes en vigueur (68 articles lus dans la base LEGI locale, version du 01/10/2026), des fiches officielles de service-public (flux DILA), des comptes 2024 (OFGL, DGCL) et du grand livre du dépôt. Chaque ligne porte sa source.
- **propose** : le **scénario P1**, une proposition de Claude pour rendre l'idée de l'auteur testable. **Rien n'y est tranché.** Ses hypothèses :
  - **H1** : une seule collectivité locale par territoire, au périmètre de l'intercommunalité actuelle ; les communes deviennent des mairies déléguées (état civil, guichet).
  - **H2** : dans une aire urbaine, cette collectivité est la métropole (position de l'auteur du 06/11 : raisonner à l'échelle de la métropole pour les grandes villes ; fin des conflits commune contre métropole).
  - **H3** : le département disparaît comme collectivité ; ses équipements et réseaux (collèges, routes, secours) vont à la région.
  - **H4** : la mairie déléguée et les France services deviennent un guichet universel, outillé par l'État, qui accueille toute demande (y compris handicap et autonomie) et accompagne la personne.
  - **H5** : l'évaluation du handicap et de l'autonomie (MDPH, APA, PCH) passe à une branche autonomie unifiée de la sécurité sociale ; le dépôt et l'accompagnement restent au guichet de proximité.
  - **H6** : les solidarités qui demandent une présence humaine (aide sociale à l'enfance, PMI, action sociale) vont à la collectivité de proximité.
  - **H7** : les archives passent à une plateforme nationale unique (position de l'auteur sur les archives).
  - **H8** : les données que l'administration détient déjà ne sont plus redemandées ; la fonction des revenus, le filet et le montant par enfant sont versés d'office (système du manifeste).
  - **H9** : les systèmes d'information des administrations sont regroupés dans l'entreprise d'État de la technologie (préclassement du grand livre ; position de l'auteur du 28/10).

  Chaque attribution de l'état proposé a le statut « hypothèse ». Une compétence dont le sort n'est pas décidé est marquée `à_arbitrer` (v0 : l'AAH, C29) et listée par les tests au lieu d'être inventée.

## 6. Les tests

| Fichier | Ce qu'il vérifie |
|---|---|
| `tests/test_integrite.py` | colonnes conformes au schéma, clés primaires uniques, clés étrangères résolues, nombres valides, règles citées présentes et en vigueur, statut déclaré sur chaque attribution |
| `tests/test_etat_actuel.py` | applique à l'état actuel les invariants du système proposé : une compétence = un niveau, un interlocuteur public par démarche, chaque euro rattaché à un payeur et un receveur, aucun financement croisé. **Ils échouent, et c'est attendu** (`expectedFailure`) : le message liste les défauts. Des tests « constat » figent les ordres de grandeur. |
| `tests/test_etat_propose.py` | un et un seul responsable par compétence, aucun chevauchement, un guichet de proximité par démarche, aucun organisme sans compétence, cohérence organismes/attributions, aucune compétence orpheline après une suppression (hors `à_arbitrer` déclarés), interlocuteurs qui n'augmentent pas ; un contrôle du contrôle (un doublon ajouté à la main est détecté). Deux tests listent ce qui manque (`expectedFailure`) : flux à ventiler et organismes recensés non rattachés. |

Résultat au 06/11/2026 : 22 tests, tous verts, dont 6 échecs attendus.

## 7. Sources et cotes

| Source | Cote | Conflits d'intérêts connus | Usage |
|---|---|---|---|
| Codes en vigueur (base LEGI), XML de codes.droit.org, version du 01/10/2026, copie locale | A (texte officiel ; conversion par un tiers) | aucun connu | `regles.csv`, attributions |
| Fiches pratiques service-public.gouv.fr, flux DILA 3.5 (particuliers et professionnels), téléchargé le 06/11/2026, Licence ouverte | B (information officielle, pas le texte) | éditeur public (Premier ministre) | démarches, guichets, pièces |
| ANCT, liste des structures labellisées France services (data.gouv.fr, fichier du 05/11/2026) | A | aucun | 3 076 structures |
| ANCT, page « France services » (consultée le 06/11/2026) | B | l'agence présente son propre programme | 12 opérateurs partenaires |
| OFGL et DGCL, comptes 2024 et ventilation fonctionnelle (via le grand livre et la cartographie nationale) | A | aucun | budgets, niveaux |
| BANATIC (DGCL), export du 28/10/2026 (via la cartographie nationale) | A | aucun | chevauchements syndicats / EPCI |
| DGAFP, Rapport annuel 2025 ; Insee Première n° 2094 (via agents-publics.md) | A | aucun | agents |
| Grand livre du dépôt (`modeles/grand-livre/`) | dérivé (sources A et B) | travail du dépôt | organismes, flux, préclassements |
| Positions de l'auteur | O (opinion) | l'auteur est candidat | scénario proposé |

## 8. Limites de la v0

- Les compétences sont une **nomenclature de travail** de 61 lignes : la loi en compte bien davantage (les seuls articles L5214-16, L5215-20, L5216-5 et L5217-2 listent des dizaines de groupes). Le choix du grain change les comptes ; il est rejouable.
- Le rattachement d'un rôle (optionnel, partiel, partagé) est un jugement de lecture des articles ; il est sourcé ligne par ligne et doit être relu par un second lecteur (V19000).
- Les budgets ne couvrent que les collectivités (communes de 3 500 habitants ou plus, intercommunalités, départements, régions, syndicats) ; les communes de moins de 3 500 habitants (25,6 Md€) ne sont pas ventilées par fonction. La nomenclature regroupe eau, assainissement et GEMAPI.
- Les flux reprennent ceux que le grand livre marque comme transferts entre administrations ; 38,6 Md€ n'y ont pas de receveur identifié (V19014).
- Les démarches décrivent le cas général d'une fiche officielle, pas la pratique de chaque guichet (V19002) ; le nombre de pièces n'est compté que pour 10 démarches sur 21 (V19011).
- Bâtiments : trois agrégats ; les surfaces par administration manquent.
- Aucune donnée sur des personnes physiques : les fichiers France services contiennent des coordonnées de structures, qui ne sont pas reprises (seuls des comptes par département le sont).
