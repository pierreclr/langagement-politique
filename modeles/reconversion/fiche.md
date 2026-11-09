---
titre: Reconversion : que deviennent les personnes dont le métier disparaît ?
theme: protéger
statut: brouillon sourcé ; dernier calcul le 03/11/2026
---

## La question

Quand la paie, la comptabilité de base et l'impôt passent par un système public simple, des postes disparaissent. Combien de personnes sont réellement déplacées, combien retrouvent un emploi et à quelle vitesse, avec quelle perte de salaire ? Combien cela coûte-t-il au budget, à l'économie et aux personnes, et à partir de quand le gain l'emporte-t-il ?

## Ce qui entre

- Les postes qui disparaissent viennent du modèle « L'industrie de la complexité » : 107 000 / 260 000 / 479 000 équivalents temps plein.
- Statistiques publiques : 1 424 000 personnes dans les métiers comptables et de gestion, 2,59 % de départs en fin de carrière par an (étude Les Métiers en 2030).
- Études sur le licenciement, lues pour la plupart dans leur version de travail : en France, 43 % des licenciés économiques en emploi à un an, 12 % de perte de revenu à cinq ans, environ 10 % de non-emploi à cinq ans ; aux États-Unis et en Allemagne, pertes plus lourdes.
- Hypothèses : efficacité de l'absorption, mobilité volontaire, parts qui deviennent des licenciements, retour à l'emploi par âge, perte de salaire au retour.

## Comment il calcule

Le calcul avance par trimestre, de 2029 à 2064.

1. **Postes à supprimer** par bloc, étalés selon un calendrier : rapide (2029 à 2032), lent (2029 à 2038) ou très lent (2029 à 2043).
2. **Absorption.** Chaque année, une capacité de postes disparaît sans licenciement : efficacité × (taux de retraite + taux de mobilité) × effectif du métier. Au central : 0,5 × (2,59 % + 1 %) × 1,424 M, soit environ 25 000 postes par an.
3. **Séparations.** Le reste, une fois retirée la part redéployée en interne, devient des personnes déplacées.
4. **Retour à l'emploi.** Chaque classe d'âge est un mélange de deux types : « mobile » (retour rapide) et « éloigné » (retour lent). La part éloignée monte avec l'âge (11 % à 20-29 ans, 70 % à 60-63 ans). La formation améliore le retour après deux trimestres d'enfermement. À 64 ans, les non-employés partent en retraite.
5. **Perte de salaire** au retour : L(y) = L∞ + (L0 − L∞) × e^(−y/3), y étant le nombre d'années depuis la séparation. Au central L0 = 15 % et L∞ = 7 %, majorés de 30 % après 50 ans.
6. **Sorties** : production manquante, coût budgétaire (impôt perdu au taux de 41 %, complément dégressif, plancher de 877 €, formation), perte pour les personnes, gain net.

## L'hypothèse qui porte le résultat

L'efficacité de l'absorption : la part des départs qui peuvent ne pas être remplacés là où le travail disparaît (0,7 / 0,5 / 0,3). C'est « le résultat le plus robuste du modèle, et il dépend d'un paramètre non mesuré » (methode.md, § 6). Elle n'a pas de source. Le résultat dépend aussi du rythme : sur dix ans au lieu de quatre, les déplacés passent de 106 000 à 16 000 au central (resultats.md, dix lignes, n° 6).

## Ce que l'IA a choisi elle-même

Neuf valeurs sont marquées comme hypothèses de l'IA ou non lues à la source : efficacité de l'absorption (H3), mobilité volontaire (H4), part des séparations (H5), structure par âge des déplacés (H7), salaire moyen de 2 100 € (H8), part des ménages ayant droit au plancher (H13), récupération d'impôt sur les économies des clients (H15), politiques de formation ciblée et d'aide à la mobilité (H18), actualisation à 2,5 % (H19). Le retour à l'emploi par âge (H6) est calé à la main sur des études, pas estimé. Les hypothèses du côté « favorable » sont réunies dans un même scénario : cela élargit la fourchette.

## Ce qu'il ne fait pas

Les postes sont des équivalents temps plein : un quart du temps de quatre personnes n'est pas une personne licenciée. Une partie du déclin aurait lieu sans la réforme, et le modèle l'attribue toute à la réforme. Pas d'effet de demande à court terme, de géographie ni de santé (mortalité, statut). Pas d'étude sur des comptables déplacés. Aucune évaluation causale française de l'aide à la mobilité.

## Ce qu'il donne

- Au central, 106 000 personnes déplacées (0 au favorable, 359 000 au défavorable) (resultats.md, § 2).
- Emploi retrouvé : 47 % à un an, 69 % à deux ans, 83 % à cinq ans ; 72 % des 60 à 63 ans arrivent à la retraite sans emploi retrouvé.
- Coût budgétaire net : 0,54 Md€ par an en moyenne de 2029 à 2035 (pic 0,88) ; 3,30 au défavorable.
- Production manquante cumulée : 28 Md€ (central), 143 Md€ (défavorable).
- Gain net positif dès 2029 avec la convention du modèle de la complexité ; en 2032 avec la convention prudente.

## Comment le refaire

Depuis le dossier du modèle : `jsc ../industrie-complexite/modele.js modele.js test_modele.js` (26 contrôles réussis), puis `jsc ../industrie-complexite/modele.js modele.js rapport.js > resultats.txt`. J'ai relancé le rapport : la sortie est identique à resultats.txt.
