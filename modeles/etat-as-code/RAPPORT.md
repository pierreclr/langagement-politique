---
titre: L'État as code, ce que révèle le modèle (v0)
date: 2026-11-06
statut: v0, brouillon de travail (T70) ; chiffres produits par code/rapport.py ; état proposé = scénario P1, non tranché
vérifications: V19000 à V19015
---

# L'État as code : ce que révèle le modèle (v0)

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026. Tous les chiffres viennent de `code/rapport.py` sur les tables de `donnees/` (détail dans `resultats/*.csv`) ; le schéma et les hypothèses sont dans `SCHEMA.md`. Les comptes dépendent du grain choisi (61 compétences de travail) : ce sont des ordres de grandeur rejouables, pas des mesures définitives.

## En une minute

- **La loi pose elle-même la règle que l'État ne respecte pas.** L'article L1111-4 du CGCT veut que « chaque domaine de compétences ainsi que les ressources correspondantes soient affectés en totalité soit à l'État, soit aux communes, soit aux départements, soit aux régions » ; le même article déclare, deux phrases plus loin, la culture, le sport, le tourisme, les langues régionales et l'éducation populaire « partagés » entre communes, départements et régions **[fait, R002]**. Le premier test du modèle traduit cette phrase en code ; l'état actuel y échoue.
- **37 compétences sur 59 (63 %) peuvent être exercées par au moins deux niveaux** d'après les textes en vigueur ; 26 au sens strict (plusieurs responsables ou une compétence partagée) ; 45 si l'on compte les opérateurs et les cofinanceurs **[calcul]**. La culture et le sport relèvent de six niveaux, les systèmes d'information de sept.
- **23 compétences sont financées en 2024 par au moins deux niveaux qui y dépensent chacun 50 M€ ou plus** (ventilation fonctionnelle OFGL) **[calcul]** : urbanisme et aménagement (communes 8,8 Md€, intercommunalités 3,8, départements 1,6, régions 1,2, syndicats 0,9), action sociale générale, culture, sport, déchets (communes 1,7, intercommunalités 5,5, syndicats 5,5), mobilité, voirie.
- **21 démarches citoyennes demandent aujourd'hui 39 interlocuteurs obligatoires (31 publics) ; 19 (15 publics) dans le scénario proposé** **[calcul ; l'état proposé repose sur les hypothèses H1 à H9]**. Les plus forts écarts : RSA (3 → 1), déclaration de naissance (3 → 1), création d'une micro-entreprise (3 → 1), embauche d'un premier salarié (4 → 2).
- **France services couvre une partie seulement** : sur 21 démarches, 7 relèvent entièrement d'opérateurs partenaires, 6 en partie, 8 pas du tout (mairie, département, MDPH, école, bailleurs ne font pas partie des 12 opérateurs) **[calcul sur une source B]**. Le réseau compte **3 076 structures (2 928 principales, 148 antennes) dans 2 795 communes**, dont 163 bus ou points itinérants **[fait, ANCT, 05/11/2026]**.
- **Le scénario proposé passe ses tests** : chaque compétence y a un et un seul responsable, chaque démarche un guichet de proximité, aucun organisme gardé n'est sans compétence. **Un seul trou déclaré** : le sort de l'AAH (fondue dans la fonction des revenus ou gardée comme compensation du handicap) n'est pas tranché ; la supprimer avec la MDPH, la CAF et le département la laisserait orpheline.
- **Ce que le modèle ne sait pas encore** : 38,6 Md€ de flux entre administrations n'ont pas de receveur dans le grand livre ; 238,8 Md€ de flux touchent un niveau éclaté (département, opérateurs, caisses) et restent à ventiler ; 939 organismes du recensement « à garder » n'ont pas encore de compétence rattachée.

## 1. Les chevauchements de compétences aujourd'hui

Méthode **[calcul]** : pour chaque compétence, on compte les niveaux qui ont un pouvoir d'agir d'après un article en vigueur (responsable, partiel, partagé, chef de file, optionnel par transfert ou convention). Les 233 attributions citent leur article (68 articles extraits de la base LEGI locale, version du 01/10/2026) ou leur source.

| Nombre de niveaux | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Compétences | 22 | 13 | 14 | 6 | 1 | 2 | 1 |

Les plus éclatées :

| Compétence | Niveaux qui peuvent agir | Dépense locale 2024 (Md€) |
|---|---|---|
| Systèmes d'information (C59) | les sept niveaux, chacun pour lui-même | non mesurée |
| Culture (C39), sport (C40) | commune, intercommunalité, métropole, département, région, État | 10,4 ; 8,2 |
| Tourisme (C38) | commune, intercommunalité, métropole, département, région | 1,4 |
| Mobilité urbaine (C11) | intercommunalité, métropole, région (sur les communautés de communes sans transfert), syndicats mixtes | 6,7 |
| Déchets (C16) | commune, intercommunalité, métropole, département (traitement à la demande) ; syndicats opérateurs | 12,8 |
| Habitat (C23) | intercommunalité, métropole, région, département (FSL) ; communes guichets enregistreurs | 2,5 |
| Action sociale (C34) | département chef de file, commune (CCAS), intercommunalité et métropole (par option ou convention) | 16,0 |
| Archives (C41) | commune, intercommunalité (dépôt), département, région ; État en contrôle | non séparée |

Trois mécanismes produisent ces chevauchements **[lecture des articles]** :
1. **Le partage déclaré** (L1111-4) : culture, sport, tourisme, éducation populaire.
2. **L'« intérêt communautaire » et les transferts à la carte** : la même compétence est coupée entre la commune et son intercommunalité (voirie, équipements culturels et sportifs, action sociale), et l'eau et l'assainissement sont redevenus facultatifs pour les communautés de communes avec la loi n° 2025-327 du 11/04/2025 (cité dans L5214-16).
3. **Les conventions métropole-département** (L5217-2 IV) : une métropole peut reprendre neuf groupes de compétences départementales (FSL, action sociale, insertion, jeunes en difficulté, prévention spécialisée, personnes âgées, tourisme et culture, collèges, routes). Le partage dépend alors du territoire et de la négociation, pas de la loi.

À quoi s'ajoutent les **syndicats** : BANATIC recense des syndicats qui déclarent la même compétence que leur intercommunalité, surtout scolaire (336 sur le périscolaire, 228 sur les transports scolaires, 179 sur les écoles) **[fait, export du 28/10/2026, non rejoué ce soir, V19015]**.

Ce que cela coûte en fonctions support : les collectivités déclarent **54,5 Md€ de dépenses 2024 en « services généraux » et intérêts** (communes de 3 500 habitants ou plus 26,1 ; intercommunalités 10,8 ; départements 8,0 ; régions 4,1 ; syndicats 2,4 ; budgets annexes 3,0 ; dont ≈ 5,4 d'intérêts de la dette) **[calcul, OFGL]**. Le modèle ne dit pas quelle part tient aux chevauchements : c'est une piste, pas un gisement chiffré.

## 2. Les démarches, avant et après

Méthode : pour chaque démarche, les organismes que la fiche officielle de service-public (flux DILA, téléchargé le 06/11/2026) indique comme points de contact, complétés par le texte de loi quand la fiche renvoie à un acteur sans le nommer. « Interlocuteurs » = organismes que l'usager doit contacter (obligatoires) ; « publics » = hors médecin, propriétaire, employeur, assureur.

| Démarche | Aujourd'hui (publics) | Proposé (publics) | Pièces aujourd'hui → proposé | France services aujourd'hui |
|---|---|---|---|---|
| Déclarer ses revenus | 1 (1) | 0 | n.c. → 0 | oui |
| Aide au logement (APL) | 2 (1) | 1 (1) | n.c. → 0 | oui |
| RSA | 3 (3) : CAF, département, France Travail | 1 (1) | n.c. → 0 | partiel |
| Prime d'activité | 1 (1) | 0 | n.c. → 0 | oui |
| Reconnaissance d'un handicap (AAH, PCH, RQTH) | 3 (2) : médecin, MDPH, CAF | 2 (1) : médecin, guichet de proximité | 2 au moins → 1 | partiel |
| APA | 1 (1) | 1 (1) | 3-4 → 0 | non |
| Inscription à l'école élémentaire | 2 (2) : mairie puis école | 1 (1) | 4 → 1 | non |
| Bourse de collège | 1 (1) | 1 (1) | 1-2 → 0 | non |
| Collecte des déchets | 2 (2) : mairie, intercommunalité | 0 | sans objet | non |
| Permis de construire | 2 (2) : mairie, impôts fonciers | 1 (1) | n.c. | partiel |
| Carte d'identité | 1 (1) | 1 (1) | 2-3 → 1 | non (France Titre aide à la pré-demande) |
| Carte grise d'occasion | 3 (1) | 2 (1) | 4 → 2 | oui |
| Listes électorales | 1 (1) | 0 | 2-3 → 0 | non |
| Déclaration de naissance | 3 (3) : mairie, CPAM, CAF | 1 (1) | 2-4 → 2 | partiel |
| Déclaration de décès | 2 (1) | 2 (1) | 2 → 2 | non |
| Inscription comme demandeur d'emploi | 1 (1) | 0 | 3-8 → 0 | oui |
| Retraite (salarié du privé) | 1 (1) : demande unique, puis deux caisses qui versent | 1 (1) : un régime | n.c. | oui |
| Logement social | 1 (0) | 1 (1) | n.c. | non |
| Micro-entreprise | 3 (3) : guichet INPI, Urssaf, impôts | 1 (1) | n.c. | partiel |
| Embauche d'un premier salarié | 4 (2) : Urssaf, Agirc-Arrco, santé au travail, mutuelle | 2 (1) | n.c. | partiel |
| Allocations familiales | 1 (1) | 0 | n.c. → 0 | oui |
| **Total** | **39 (31)** | **19 (15)** | | 7 oui, 6 partiel, 8 non |

Lecture :
- **Le cas cité par l'auteur se vérifie dans les textes** : une personne handicapée dépose son dossier à la MDPH de son département (CASF L146-3 : « une maison départementale » par département), fournit un certificat médical de moins d'un an, puis traite avec la CAF pour l'AAH (déclaration trimestrielle) et avec le département pour la PCH **[fait, fiches F12242, F14202]**. La MDPH n'est pas partenaire de France services **[fait, ANCT]**. Dans le scénario proposé, le dossier se dépose au guichet de proximité et l'évaluation passe à une branche autonomie unifiée (H4, H5) **[hypothèse]**.
- **Une bonne part du gain ne vient pas du découpage territorial mais du système fiscal et social** : la prime d'activité, le RSA, les aides au logement et les allocations familiales disparaissent en tant que démarches parce que la fonction des revenus et le montant par enfant sont versés d'office (H8). Le découpage, lui, joue sur l'école, les déchets, le permis, le handicap.
- **Ce qui ne bouge pas** : la carte d'identité, le décès, la retraite gardent un interlocuteur. Le modèle n'invente pas de gain là où il n'y en a pas.
- **Pièces** : comptées pour 10 démarches sur 21 seulement (cas général de la fiche) ; ailleurs, la liste est conditionnelle ou renvoyée au formulaire (V19011). Les pièces « proposées » supposent que l'administration ne redemande plus ce qu'elle sait (H8) : c'est une hypothèse d'organisation, qui demande les échanges de données correspondants.

## 3. Ce que les tests disent de l'état proposé

| Test | Résultat |
|---|---|
| Une compétence, un et un seul responsable | passe (0 orpheline, 0 doublon) |
| Aucun chevauchement | passe |
| Chaque démarche a un guichet de proximité | passe (21 sur 21) |
| Aucun organisme gardé sans compétence | passe (organismes du modèle) |
| Aucune compétence orpheline après suppression | passe, sauf l'AAH, déclarée « à arbitrer » (organismes concernés : département, MDPH, CAF, MSA) |
| Interlocuteurs qui n'augmentent pas | passe (39 → 19) |
| Contrôle du contrôle (doublon ajouté à la main) | détecté |
| Flux entièrement projetés | **échec attendu** : 238,8 Md€ à ventiler (département, opérateurs, caisses), 38,6 Md€ sans receveur ; 6,9 Md€ deviennent internes (dotations des régions aux lycées et collèges, qui restent dans la même collectivité) |
| Recensement entièrement rattaché | **échec attendu** : 939 organismes « à garder » sans compétence dans le modèle (736 locaux, 198 nationaux), et 1 666 encore « à examiner » |

L'état proposé passe parce qu'il a été écrit pour passer : c'est un scénario cohérent, pas une démonstration. Sa valeur est ailleurs : chaque fois qu'on changera une hypothèse (garder le département, confier les secours à l'État…), les tests diront aussitôt ce qui devient orphelin ou doublon.

## 4. Première analyse du découpage territorial (proposition, rien n'est tranché)

### 4.1 Ce que pèse chaque niveau et où ses compétences iraient dans le scénario P1

Budgets 2024 ventilés par fonction (OFGL), rattachés aux compétences puis au niveau qui les reprend dans P1 **[calcul ; le rattachement est une hypothèse]** :

| Niveau actuel | Dépense ventilée 2024 | Vers la proximité | Vers la région | Vers la sécurité sociale | Vers l'État-plateforme | Vers l'État | Support et intérêts |
|---|---|---|---|---|---|---|---|
| Départements (95) | 77,9 Md€ | 22,7 (aide sociale à l'enfance 11,1 ; action sociale 3,6 ; aménagement 1,6 ; PMI 1,1) | 16,4 (collèges 6,2 ; routes 5,2 ; secours 3,3) | 20,1 (handicap 10,4 ; APA et personnes âgées 9,7) | 10,5 (RSA) | 0,3 | 8,0 |
| Communes de 3 500 hab. ou plus | 87,1 Md€ | 55,0 | 2,5 | | | 3,5 (police municipale, santé) | 26,1 |
| Communes de moins de 3 500 hab. | 25,6 Md€ | non ventilé | | | | | |
| Intercommunalités | 44,2 Md€ ventilés (plus 2,5 non ventilés) | 27,8 | 5,0 | | | 0,7 | 10,8 |
| Syndicats | 22,0 Md€ ventilés | 19,2 | 0,3 | | | | 2,4 |
| Régions | 39,6 Md€ ventilés | 4,5 (culture, sport, jeunesse) | 25,0 | | | 6,0 (formation professionnelle) | 4,1 |

Agents concernés (DGAFP, données 2023, personnes) : départements 286 000 et établissements départementaux 72 000 ; communes 1 029 000 et CCAS 105 000 ; intercommunalités 302 000 ; autres structures intercommunales 90 000 ; régions 99 000 **[fait]**.

### 4.2 Les options, avec ce qu'elles déplacent

| Option | Ce qui disparaît ou fusionne | Compétences et budgets déplacés | Ce qu'elle résout | Ce qu'elle coûte ou risque |
|---|---|---|---|---|
| **P1 (modélisée)** : une collectivité de proximité au périmètre de l'intercommunalité (la métropole en ville), région, État | communes (en mairies déléguées), intercommunalités, syndicats fusionnés ; département supprimé | 77,9 Md€ départementaux répartis en quatre (tableau 4.1) ; 19,2 Md€ de syndicats internalisés | la concurrence commune-métropole (un seul conseil), les chevauchements syndicats-EPCI, le guichet unique | perte de l'élu de proximité ; collectivités de très inégale taille (de quelques milliers d'habitants à plus d'un million) ; ASE et PMI confiées à des collectivités parfois petites |
| **P2** : garder le département comme seul échelon intermédiaire, la région devient une instance de planification | régions (gestion), intercommunalités fusionnées avec les communes | lycées (7,0 Md€), transports régionaux (11,8 Md€ avec TER) et formation (4,7) vers le département ou l'État | garde l'échelon social le plus proche (ASE, handicap) | 95 départements pour le TER et l'économie : échelle trop petite pour le ferroviaire |
| **P3** : garder communes et intercommunalités, mais toutes les compétences de proximité à l'intercommunalité ; la commune ne garde que l'état civil et le guichet | syndicats, compétences communales | 55 Md€ communaux vers l'intercommunalité | sans fusion autoritaire ; règle « une compétence, un niveau » | les deux conseils subsistent : le conflit de gouvernance (cas de Grenoble) demeure |
| **P4** : l'État reprend les réseaux départementaux (routes, secours, collèges) par déconcentration | département supprimé | 16,4 Md€ vers l'État au lieu de la région | uniformité nationale | recentralisation, en tension avec l'article 1er de la Constitution (« son organisation est décentralisée ») ⚠️ V19015 |

Points communs à toutes les options **[lecture du modèle]** : les prestations monétaires (RSA, aides au logement, prime d'activité, allocations familiales : 10,5 Md€ de RSA départemental, plus les prestations des caisses) quittent les collectivités pour l'État-plateforme dès lors que la fonction des revenus existe ; c'est le système fiscal, pas le découpage, qui vide une partie du département.

### 4.3 Les questions concrètes de l'auteur

- **Qui collecte les déchets ?** Aujourd'hui, en droit, l'intercommunalité ou la métropole (L5214-16 I 5°, L5216-5 I 7°, L5217-2 I 6°), les communes pouvant transférer le traitement à un syndicat mixte et le département pouvant s'en voir confier une partie (L2224-13) ; en dépense 2024, intercommunalités 5,5 Md€, syndicats 5,5, communes 1,7 (dont la propreté urbaine) **[fait et calcul]**. La fiche officielle dit à l'usager de s'adresser à la mairie **[fait, F16217]** : deux interlocuteurs pour un service. Dans P1, une seule collectivité collecte, traite et facture.
- **Qui garde les archives ?** Chaque collectivité garde les siennes (L212-6), le département reçoit en plus celles des services de l'État (L212-8), les petites communes peuvent déposer au groupement (L212-11), l'État contrôle **[fait]**. Quatre niveaux conservent. P1 suit la position de l'auteur (plateforme nationale unique, H7) ; la conservation des originaux garde un coût de bâtiment que le modèle ne chiffre pas encore (`batiments.csv` vide sur ce point).
- **Le handicap en mairie ?** Voir § 2. Le guichet de proximité existe déjà en partie (France services : 3 076 structures), mais sans la MDPH ni le département parmi ses partenaires, et sans pouvoir de décision. Le changement proposé porte sur trois points : l'outil (dossier unique et données partagées), le droit de déposer partout, et la disparition des organismes qui décident en arrière-plan.

### 4.4 Objections à instruire (règle 5)

- **Contrainte juridique** : l'article 72 de la Constitution nomme les communes, les départements et les régions comme collectivités territoriales ; supprimer le département, ou faire des communes de simples mairies déléguées, demande une révision constitutionnelle **[fait, texte à citer exactement, V19015]**.
- **Démocratie de proximité** : P1 supprime l'essentiel des conseils municipaux ; c'est le coût politique principal, que la démocratie directe locale proposée par l'auteur (votations communales) devrait compenser. À débattre, pas à présupposer.
- **Économies d'échelle** : la littérature sur les fusions de communes (Danemark 2007, Allemagne, Pays-Bas…) est contrastée sur les économies réelles ; elle n'est pas encore sourcée ici (règle 9, V19015). Le modèle ne promet donc aucune économie de fusion à ce stade.
- **Biais de l'outil** : un modèle qui compte des niveaux pousse naturellement vers moins de niveaux. Un chevauchement n'est pas toujours un défaut (la redondance protège parfois, deux financeurs permettent un projet). Les tests disent où sont les doublons, pas qu'il faut tous les supprimer.

## 5. Suite proposée

1. Faire relire les 233 attributions par un second lecteur, article par article (V19000), et ajouter les articles manquants (coopération décentralisée, GIP MDPH, financement de la prime d'activité).
2. Ventiler les 238,8 Md€ de flux « à ventiler » organisme par organisme, en reliant `flux.csv` aux préclassements du grand livre.
3. Rattacher les 939 organismes gardés à une compétence (le préclassement par ministère en donne une première approximation).
4. Écrire les variantes P2 à P4 comme autres états (`propose_p2`…) : les tests diront lesquelles tiennent.
5. Compter les pièces des 11 démarches restantes et ajouter les démarches des entreprises et des associations.
