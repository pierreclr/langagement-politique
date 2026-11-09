---
titre: Le grand livre de l'argent public, 2024
theme: comptes et dette
statut: brouillon ; dernier calcul le 06/11/2026
---

## La question

Peut-on recenser toutes les dépenses et toutes les recettes des administrations publiques, retrouver chaque ligne dans les comptes nationaux de l'Insee, sans oubli ni double compte ? Le grand livre est le socle du bilan global du programme : il dit ce qui existe avant de dire ce que devient chaque ligne dans le nouveau système. Ce n'est pas un modèle de calcul : c'est une base de lignes sourcées, construite et fermée sur des totaux officiels.

## Ce qui entre

- Statistique publique : comptes nationaux annuels de l'Insee, base 2020, année 2024, tableaux 3.201, 3.203, 3.204, 3.205, 3.212, 3.215 à 3.217 (dépenses et recettes par sous-secteur : État, organismes d'administration centrale, collectivités, sécurité sociale).
- Sources de détail : exécution budgétaire de l'État (2024), jaune budgétaire des opérateurs (budgets initiaux 2024), comptes des collectivités (OFGL), prestations sociales (DREES), base SIRENE (96 032 personnes morales publiques, 1er octobre 2026), effectifs de la fonction publique.
- Chaque ligne porte sa source, une cote de fiabilité de A à D, et un statut : fait, calcul, estimation, ou non confirmé (SCHEMA.md).

## Comment il est construit

1. **Cadre** : année 2024, millions d'euros courants. Chaque sous-secteur doit retomber sur son total Insee, par nature de dépense (rémunérations, subventions, etc.).
2. **Lignes** : une ligne par ministère, opérateur, caisse ou fonction, avec un champ qui marque les transferts entre administrations.
3. **Fermeture** : ce qui n'est pas recensé est porté par une ligne de fermeture explicite « par différence », jamais absorbée. L'écart nul est donc obtenu par construction ; ce qui mesure la qualité est la part de ces lignes.
4. **Consolidation** : on ôte les flux entre administrations (transferts courants 145,891 ; transferts en capital 31,615 ; intérêts 1,009 ; au total 178,515 Md€), une fois chez le payeur, une fois chez le receveur.
5. **Recensement des organismes** : 2 776 lignes classées avec un sort proposé (garder, fusionner, absorber, supprimer, à examiner).
6. **Contrôle de complétude** : on compare les 96 032 personnes morales publiques de la base SIRENE aux recensements, avec six statuts (nommée, rapprochement, fermeture, agrégée, listée seulement, absente).

Exemple : dépenses des quatre sous-secteurs, 1 851,111 Md€ de lignes pour 1 851,104 d'Insee. En retirant 178,515 de flux internes, on trouve 1 672,596 Md€ de dépenses consolidées contre 1 672,589 publiés ; avec 1 503,471 Md€ de recettes, le solde est de −169,125 Md€ contre −169,118 (synthese.md, § 3).

## L'hypothèse qui porte le résultat

Les lignes de fermeture : elles font tomber l'écart à zéro. Part brute des lignes de fermeture dans le total : 5,1 % pour l'État (30,4 Md€), 6,5 % pour les organismes centraux, 9,7 % pour les collectivités, 3,7 % pour la sécurité sociale (synthese.md, § 4). Pour la consolidation, 71,5 % de l'élimination (127,7 sur 178,5 Md€) se rapproche de lignes nommées ; le reste, non (§ 2).

## Ce que l'IA a choisi elle-même

Le classement est fait par l'IA : nature de dépense de l'État dérivée des catégories budgétaires (statut « calcul ») ; 856 lignes de l'État, 173 des organismes centraux, 364 des collectivités, 291 de la sécurité sociale ; les lignes de fermeture (6 pour l'État, 1 pour les organismes centraux, 6 pour les collectivités, 91 pour la sécurité sociale) ; le sort proposé pour chacun des 2 776 organismes ; le rapprochement par nom ou sigle avec la base SIRENE ; le classement automatique des agents par fonction, par règles de motifs sur le nom ; l'attribution de chaque organisme à un ministère par programme de tutelle ou par mots-clés. Sur 2 776 organismes, 1 665 restent « à examiner ». Les 19 038 entités « absentes » sont à classer, pas forcément des oublis.

## Ce qu'il ne fait pas

Le périmètre « public » de SIRENE n'est pas celui des comptes nationaux. Les listes des collectivités et de la sécurité sociale manquent. Les budgets d'organismes ne s'additionnent pas sans précaution : années différentes, charges brutes, entités emboîtées. Le classement en 2 776 lignes donne une impression de précision que les mots-clés n'ont pas. 25,5 Md€ de transferts en capital ne sont pas rattachés à un payeur. Les 103 Md€ d'écritures sans flux d'argent (cotisations imputées, production pour compte propre, crédits d'impôt) sont dans les dépenses.

## Ce qu'il donne

- Dépenses consolidées 2024 : 1 672,596 Md€ ; recettes : 1 503,471 Md€ ; solde −169,125 Md€ (synthese.md, § 3).
- Une table de 20 corrections du bilan global : aucun double compte de consolidation trouvé ; une dépense oubliée (crédits d'impôt sur le revenu, 8,9 Md€), un montant périmé, et 34,2 Md€ de recettes gardées et 2,2 de dépense supprimée sans décision (corrections-bilan.md, § 1).
- Complétude : rapprochements relus sur un échantillon de 59 : 0 faux, 3 incertains (taux d'erreur estimé de 0 à 5,1 %, borne haute à 95 % : environ 8 %) (completude.md, § 2).
- Agents publics : 5,88 millions (Insee), 367,6 Md€ de rémunérations contre 363,0 (agents-publics.md). Classement par fonction : 6 erreurs sur 45 lignes relues.

## Comment le refaire

Les scripts de construction ne sont pas tous publiés dans cette copie : seuls `code/recettes.py` et `code/xlsx_lecture.py` le sont, et ils demandent les fichiers Insee téléchargés en local, absents ici. Je n'ai pas pu relancer le calcul. Les totaux de synthese.md se recontrôlent en sommant la colonne `montant_md_eur` : je l'ai fait pour les recettes (77 lignes du périmètre APU, 1 503,471 Md€), les collectivités (364 lignes « additif = oui », 330,484), la sécurité sociale (291 lignes, 777,288) et les organismes centraux (173 lignes du sous-secteur ODAC, 142,637), qui retombent exactement. Pour l'État, la somme des 942 lignes de dépenses de `etat.csv` donne 902,6 Md€ et non 600,7 : la synthèse cite 856 lignes, et je n'ai pas identifié le filtre qui les retient.
