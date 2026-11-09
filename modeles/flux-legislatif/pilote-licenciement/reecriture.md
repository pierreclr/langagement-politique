---
titre: Pilote « loi as code » — les conséquences du licenciement, réécrites
date: 2026-11-09
statut: brouillon (proposition de Claude, non validée par l'auteur)
perimetre: Code du travail, partie 1, livre II, titre III, chapitre IV (L1234-1 à L1234-20, R1234-1 à R1234-12, D1234-6 à D1234-8)
---

# Les conséquences du licenciement : texte actuel et texte réécrit

## Le périmètre

Le chapitre IV, « Conséquences du licenciement », compte **33 articles en vigueur** (21 législatifs, 12 réglementaires), soit **1 666 mots** (1 120 pour la partie législative) (comptage sur codes.droit.org, base LEGI de la DILA, mise à jour du 03/11/2026, cote A). Il fixe le préavis, l'indemnité de licenciement et les documents remis au salarié qui part. Le choix de ce chapitre suit `modeles/carte-du-droit/carte-C.md` (sujet n° 2, « licenciement, ruptures, prud'hommes », priorité 1).

Les règles actuelles sont écrites en code dans `regles.py` (fonction `actuel`), et chaque règle y cite son article. La réécriture est dans la même fonction `reecrit`. Ce qu'elle change par rapport au droit actuel tient en cinq **options nommées** (E1 à E5), que l'on peut activer ou désactiver.

## Le texte réécrit (6 articles, environ 420 mots)

**Article 1 — Champ.** Le présent chapitre s'applique au licenciement d'un salarié en contrat à durée indéterminée. Les documents de fin de contrat (article 5) sont dus pour tout contrat qui prend fin.

**Article 2 — Ancienneté.** L'ancienneté se compte en mois de services continus chez le même employeur. Une suspension du contrat ne l'interrompt pas, mais sa durée ne compte pas, sauf la suspension d'un élu local.

**Article 3 — Préavis.** Sauf faute grave ou lourde, et sauf cessation de l'entreprise pour force majeure, le salarié licencié a droit à un préavis de quinze jours s'il a moins de six mois d'ancienneté *(E1)*, d'un mois de six mois à deux ans et de deux mois au-delà. Une convention, un accord, le contrat ou l'usage peuvent prévoir mieux, jamais moins. Le préavis court à partir de la présentation de la lettre de licenciement. S'il n'est pas effectué à la demande de l'employeur, le salarié reçoit le salaire qu'il aurait perçu. Pendant le préavis, le salarié dispose d'un temps raisonnable pour chercher un emploi. Les mêmes durées s'appliquent quand le salarié démissionne, sauf règle plus longue. *(Le régime local de préavis d'Alsace-Moselle est abrogé : E3.)*

**Article 4 — Indemnité de licenciement.** Sauf faute grave ou lourde, le salarié reçoit dès le premier mois d'ancienneté *(E2)* une indemnité d'un quart de mois de salaire par année d'ancienneté jusqu'à dix ans, et d'un tiers de mois par année au-delà, au prorata des mois complets, préavis compris. Le salaire de référence est le plus favorable de deux moyennes : celle des douze derniers mois, ou celle des trois derniers mois, les primes annuelles étant prises au prorata *(E4, désactivée par défaut : la moyenne des douze mois seule)*. Une indemnité conventionnelle plus favorable la remplace, sans cumul. La cessation de l'entreprise ne dispense pas de l'indemnité ni du préavis, sauf en cas de force majeure ; si celle-ci résulte d'un sinistre, l'employeur verse une indemnité égale au préavis et à l'indemnité de licenciement.

**Article 5 — Documents.** À la fin du contrat, l'employeur remet au salarié un **relevé de fin de contrat** numérique unique *(E5)*, qui vaut certificat de travail (dates, emplois occupés), solde de tout compte (inventaire des sommes versées) et attestation pour France Travail, à qui il est transmis le même jour. Le salarié peut contester le solde dans les six mois ; au-delà, il est libératoire pour les sommes qui y figurent.

**Article 6 — Calcul public.** Le Gouvernement publie le code source du calcul des articles 2 à 4 et un simulateur ; en cas d'écart entre le simulateur et le présent texte, le texte prévaut et le simulateur est corrigé.

## Les cinq écarts (E1 à E5), ce qu'ils changent et pour qui

Résultats du stress test (`stress_test.py`, 3 328 situations types, `resultats/stress_test_synthese.csv`). Le test central passe : **toutes options désactivées, la réécriture donne exactement le résultat du droit actuel dans les 3 328 situations**. Chaque écart observé avec les options actives est donc imputable à une option nommée, et il n'y en a pas d'autre.

| Option | Ce qu'elle change | Effet mesuré sur la grille | Pourquoi la proposer |
|---|---|---|---|
| E1 | Préavis de 15 jours sous 6 mois d'ancienneté (aujourd'hui : renvoi à la convention ou aux usages) | gagnants quand le préavis n'est pas effectué ; préavis enfin chiffré pour tous | La loi ne dit pas aujourd'hui ce que vaut un préavis court : il faut lire la convention ou connaître l'usage local |
| E2 | Indemnité dès le premier mois (aujourd'hui : 8 mois) | 440 situations gagnantes, de quelques dizaines à quelques centaines d'euros | Un seuil crée un effet de bord : licencier à 7 mois et 29 jours coûte zéro |
| E3 | Fin du préavis local d'Alsace-Moselle (L1234-15 et L1234-16) | **104 situations perdantes** (jusqu’à 12 jours de préavis de moins, en moyenne 612 € à 1 396 € de moins quand le préavis n'est pas effectué) ; 88 gagnantes grâce à E2 | Un seul droit pour tout le territoire ; mais c'est un recul pour une catégorie, et le droit local est un sujet politique en soi |
| E4 | Salaire de référence sur 12 mois seulement | désactivée ; activée, elle rend perdants les salariés augmentés récemment ou payés d'une prime en fin d'année | Plus simple, mais moins favorable : montre qu'une « simplification » peut cacher une baisse de droits |
| E5 | Un relevé numérique unique au lieu de trois documents | changement de forme seulement (2 704 situations) | Moins de papiers, transmission automatique à France Travail |

Lecture : avec les options par défaut, **496 situations gagnent, 104 perdent (toutes en Alsace-Moselle, à cause de E3), 2 720 ne changent que dans la forme et 8 voient leur préavis enfin chiffré (sans effet en euros)**. Une réforme présentée comme « sans perdant » serait fausse dès qu'on garde E3 : le test le montre avant le vote.

## Ce que le pilote démontre, et ce qu'il ne démontre pas

- **Démontré** : une règle de droit du travail peut être écrite comme une fonction testable, citée article par article ; une réécriture peut être comparée au droit actuel sur des milliers de cas, et chaque différence est attribuée à un choix politique explicite. Le texte passe de 33 articles et 1 666 mots à 6 articles et environ 420 mots, à droits identiques hors options.
- **Non démontré** : la grille n'est pas un échantillon représentatif de la population (elle donne des cas, pas des effectifs : combien de salariés licenciés chaque année sont dans chaque case, ⚠️ à chiffrer avec la DARES). Le code reprend une lecture non juriste du texte : trois interprétations sont marquées ⚠️ À VÉRIFIER dans `regles.py` (ancienneté de calcul jusqu'à la fin du préavis, articulation du droit local et du droit général, indemnité de préavis égale au salaire de référence). Le chapitre ne contient ni le barème des prud'hommes (L1235-3), ni le licenciement économique, ni les conventions collectives, qui pèsent bien plus lourd.
- **Steelman** : « réécrire à droit constant coûte plus qu'il ne rapporte : le texte actuel est connu des juges, chaque mot nouveau rouvre vingt ans de jurisprudence ». Réponse : c'est vrai pour une réécriture de fond, d'où le test de fidélité (toutes options éteintes, le réécrit égale l'actuel) qui isole ce qui est vraiment nouveau ; la recodification « à droit constant » de 2008 (ordonnance n° 2007-329 du 12 mars 2007) a déjà renuméroté et réécrit ce chapitre. Le risque contentieux demeure sur les mots « temps raisonnable » ou « relevé de fin de contrat », et un avis du Conseil d'État reste indispensable.
