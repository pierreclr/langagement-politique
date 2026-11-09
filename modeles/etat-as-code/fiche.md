---
titre: L'État as code : qui fait quoi, avant et après
theme: État
statut: brouillon ; dernier calcul le 06/11/2026
---

## La question

Peut-on décrire l'État actuel et un État proposé sous forme de tables ouvertes, puis les tester avec des règles écrites d'avance (une compétence, un seul responsable ; une démarche, un guichet) ? Le modèle ne chiffre pas un budget : il construit une carte testable des compétences, des démarches et des flux d'argent entre administrations. Le scénario proposé (nommé P1) est une proposition de l'IA pour rendre l'idée testable : rien n'y est tranché.

## Ce qui entre

- Textes de loi en vigueur : 68 articles de codes extraits de la base officielle (version du 01/10/2026). Ils fondent 233 attributions « qui fait quoi » (163 pour l'état actuel, 70 pour l'état proposé).
- Fiches officielles de service-public (flux de l'administration, 06/11/2026) pour 21 démarches : qui l'usager doit contacter.
- Comptes 2024 des collectivités par fonction (OFGL, DGCL), effectifs publics, liste des structures France services (3 076, ANCT, 05/11/2026).
- Le recensement des organismes et les flux du modèle « Grand livre ».
- Hypothèses H1 à H9 du scénario proposé : une seule collectivité de proximité par territoire, disparition du département, évaluation du handicap par une branche unifiée de la sécurité sociale, archives sur une plateforme nationale, données déjà détenues non redemandées, etc.

## Comment il calcule

Pas de calcul statistique : une construction en tables, puis des comptages.

1. **Nomenclature** : 61 compétences de travail (état civil, déchets, culture, sport, systèmes d'information, etc.).
2. **Attributions** : pour chaque compétence, quels niveaux ont un pouvoir d'agir d'après un article en vigueur, avec un rôle (responsable, partiel, partagé, chef de file, optionnel, opérateur, financeur, contrôle).
3. **Chevauchement** : juridique (au moins deux niveaux parmi responsable, partiel, partagé, chef de file, optionnel), strict (au moins deux parmi responsable, partiel, partagé), large (avec opérateurs et financeurs), financier (au moins deux niveaux dépensent 50 M€ ou plus en 2024).
4. **Démarches** : on compte les organismes que la fiche officielle désigne comme points de contact, avant et après.
5. **Tests** : sur l'état proposé, une compétence a un et un seul responsable, chaque démarche a un guichet de proximité, aucun organisme gardé n'est sans compétence.

Exemple : sur 59 compétences comptées, 37 peuvent être exercées par au moins deux niveaux ; 21 démarches demandent 39 interlocuteurs obligatoires aujourd'hui (31 publics) contre 19 (15 publics) dans le scénario proposé (RAPPORT.md, « En une minute »).

## L'hypothèse qui porte le résultat

Le grain de la nomenclature (61 compétences) et les rôles attribués : les comptes de chevauchements en dépendent. Le scénario proposé passe ses tests parce qu'il a été écrit pour les passer : c'est un scénario cohérent, pas une démonstration. Une part du gain sur les démarches vient d'une hypothèse du système fiscal et social (prestations versées d'office), pas du découpage territorial.

## Ce que l'IA a choisi elle-même

Tout l'état proposé : 70 attributions marquées « hypothèse », neuf hypothèses H1 à H9, et le rattachement des budgets des collectivités à un nouveau niveau (RAPPORT.md, § 4.1). L'IA a aussi choisi : la nomenclature de 61 compétences, le rôle de chaque attribution (un jugement de lecture, à relire par un second lecteur), 7 attributions encore à vérifier, la table de passage entre nomenclature fonctionnelle et compétences, la liste des 21 démarches, et le classement de « publics » et « obligatoires ». Le sort de l'allocation aux adultes handicapés est laissé « à arbitrer ». Un outil qui compte des niveaux pousse vers moins de niveaux : le rapport le dit.

## Ce qu'il ne fait pas

Il ne promet aucune économie de fusion de collectivités. Les communes de moins de 3 500 habitants (25,6 Md€) ne sont pas ventilées par fonction. 38,6 Md€ de flux entre administrations n'ont pas de receveur identifié ; 238,8 Md€ restent à ventiler ; 939 organismes « à garder » n'ont pas de compétence rattachée. Les démarches décrivent le cas général d'une fiche, pas la pratique de chaque guichet ; les pièces ne sont comptées que pour 10 démarches sur 21. Les articles ne sont pas relus par un juriste.

## Ce qu'il donne

- 37 compétences sur 59 (63 %) exercées par au moins deux niveaux ; 26 au sens strict ; 45 avec opérateurs et financeurs (RAPPORT.md, « En une minute »).
- 23 compétences financées par au moins deux niveaux dépensant chacun 50 M€ ou plus en 2024.
- Démarches : 39 interlocuteurs (31 publics) → 19 (15 publics) ; RSA 3 → 1 (RAPPORT.md, § 2).
- France services : 7 démarches sur 21 couvertes entièrement, 6 en partie, 8 pas du tout.
- Les tests : 22 tests dont 6 échecs attendus (flux entièrement projetés, recensement rattaché) (SCHEMA.md, § 6).

## Comment le refaire

Depuis la racine du dépôt : `python3 -I -m unittest discover -s modeles/etat-as-code/tests -v` (22 tests, OK, 6 échecs attendus : relancé) ; `python3 -I modeles/etat-as-code/code/rapport.py` produit les tableaux de `resultats/`. Régénérer `regles.csv` demande la copie locale des codes de loi, absente de cette copie.
