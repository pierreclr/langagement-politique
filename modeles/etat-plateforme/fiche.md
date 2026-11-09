---
titre: L'État-plateforme : une informatique publique commune
theme: État
statut: brouillon ; dernier calcul le 25/10/2026
---

## La question

Une entité logicielle publique unique, construite en interne avec l'IA, remplacerait les logiciels redondants des administrations et la sous-traitance aux sociétés de services. Combien coûte l'informatique publique aujourd'hui ? Combien coûterait l'entité cible selon le gain de productivité réel de l'IA ? Combien d'ingénieurs faudrait-il, et combien coûterait la transition ?

## Ce qui entre

- Aucune source officielle ne consolide la dépense numérique publique : la Cour des comptes dit ne pas pouvoir l'évaluer. Le total est une reconstitution à partir de morceaux publics (rapport de la Cour, 2025 ; rapports du Sénat ; estimations d'un cabinet d'étude sur les collectivités), de millésimes mêlés (2018 à 2026).
- Sources sur la sous-traitance (Cour des comptes 2020, mission interministérielle 2023, caisse d'assurance maladie) et sur le dépassement de coût des projets informatiques (étude de 1 471 projets).
- Études sur le gain de l'IA en programmation : de ×0,84 (essai randomisé début 2025) à ×2,26 (tâche simple en laboratoire). ×5 n'est mesuré nulle part. Le ×100 est un témoignage de l'auteur.
- Hypothèses : tout le reste (voir plus bas).

## Comment il calcule

1. **Coût actuel** : somme de quatre sphères (État et opérateurs, sécurité sociale, collectivités, hôpitaux) : 10,9 / 14,2 / 18,1 Md€. Il est découpé en infrastructure 45 %, applicatif 40 %, licences 15 %.
2. **Effectifs actuels** du travail applicatif : agents = applicatif × (1 − part sous-traitée) / coût d'un agent ; prestataires = applicatif × part sous-traitée / coût d'un prestataire (184 000 €) ; plus le travail « contenu » dans les licences.
3. **Mutualisation** : on ne garde qu'une partie du travail redondant : facteur = 1 − r × (1 − résidu).
4. **Internalisation** : les mêmes équivalents temps plein sont payés au coût d'un ingénieur public (100 000 € au central).
5. **IA, loi d'Amdahl** : gain effectif = 1 / ((1 − p) + p/m), où p est la part du travail que l'IA accélère et m le gain sur cette part. Avec m infini, le gain plafonne à 1/(1 − p) : ×2,5 pour p = 0,6.
6. **Infrastructure** : consolidation de 0, 5 ou 10 %. **Sécurité** : 10, 7 ou 5 % du budget cible.
7. **Économie** = coût actuel − cible. **Transition** = (construction + double fonctionnement + migration + sécurité initiale) × (1 + dépassement). **Retour** = transition / économie.

Exemple (central, ×2) : p = 0,6 donne un gain effectif de 1/(0,4 + 0,3) = 1,43. Économie : mutualisation +1,4, internalisation +1,3, IA +1,0, infrastructure +0,3, sécurité −0,7, soit +3,3 Md€ par an (resultats.md, § 2).

## L'hypothèse qui porte le résultat

La part p du travail que l'IA accélère (0,4 / 0,6 / 0,8) : elle plafonne le gain. À ×100 sur le code, l'organisation ne gagne que ×2,46 si p = 0,6. Passer de ×5 à ×100 ne rapporte que 0,7 Md€ par an au central. Elle n'est pas mesurée publiquement. Sans aucun pari sur l'IA, l'économie centrale reste de 2,2 Md€ par an (retour en 14 ans).

## Ce que l'IA a choisi elle-même

Quatorze valeurs sont des hypothèses de l'IA : dépense actuelle (H1), additivité des sphères (H2), répartition 45/40/15 (H3), mêmes leviers dans les quatre sphères (H5), coût d'un agent à 80 000 € (H6), coût d'un ingénieur public (H8), mutualisation et résidu (H9), part accélérée p (H11), licences réécrites en interne (H12), calcul d'IA par ingénieur (H13), durée de construction (H14), double fonctionnement (H15), sécurité (H16), consolidation de l'infrastructure (H18). La part sous-traitée (H4) a été resserrée sur des sources, mais reste un choix. La plupart des valeurs « hautes » sont favorables à la thèse, les « basses » prudentes.

## Ce qu'il ne fait pas

Il ne compte pas les gains des agents non informaticiens, sans doute le principal enjeu. Il exclut systèmes d'armes et renseignement. Les collectivités ne peuvent pas être contraintes (libre administration). Le recrutement, 20 à 50 fois le rythme actuel, est la contrainte qui lie, sans être modélisé dans le coût. Le risque de monoculture n'est pas chiffré.

## Ce qu'il donne

- Coût actuel : 11 à 18 Md€ par an, central 14 (resultats.md, § 1).
- Économie en croisière, central : de −1,0 (×1,2, organisation basse) à +7,3 Md€ ; 2,0 / 3,3 / 4,4 / 5,1 pour ×1,2 / ×2 / ×5 / ×100 (§ 2).
- Ingénieurs publics nécessaires au central : 46 000 à 21 000 (§ 3).
- Transition centrale : environ 28 Md€ sur dix ans ; retour de 16 ans (×1,2) à 4,5 ans (×100) ; 20 ans en cas de dépassement de +200 % (§ 4).

## Comment le refaire

Depuis le dossier : `jsc modele.js test_modele.js` (`jsc` de JavaScriptCore). Relancé : les contrôles affichent « ok », sans échec. Les données sont dans `donnees/`.
