---
titre: L'industrie de la complexité
theme: contribuer
statut: brouillon sourcé ; dernier calcul le 25/10/2026, entrées revues le 03/11/2026
---

## La question

Quelle est la taille de l'activité économique qui existe parce que les règles fiscales et sociales sont complexes (paie, comptabilité de base, impôt) ? Quelle part disparaîtrait si un système public simple faisait ce travail, quelle part se transformerait, et quel gain en tirerait l'économie ? Ce gain n'est pas un gain pour le budget public.

## Ce qui entre

- Statistiques publiques : chiffre d'affaires, valeur ajoutée et emplois des activités comptables et juridiques (Eurostat, 2024), honoraires d'audit légal (H2A, 2025), employeurs et masse salariale (Urssaf, 2024), effectifs des métiers comptables et administratifs (étude Les Métiers en 2030), coût du crédit d'impôt recherche.
- Chiffres d'entreprises privées (éditeurs de paie, cabinets de conseil) lus dans leurs comptes déposés ou dans la presse.
- Études : un contrôle européen du coût de conformité (38 Md€ pour la France, brut) et un indicateur de réglementation de l'OCDE. Les 139 heures de conformité de la Banque mondiale (série arrêtée en 2021 pour irrégularités) ne servent qu'à un recoupement, jamais à un résultat.
- Hypothèses : les parts « liées à la complexité » de chaque métier, les parts qui disparaissent, le taux de réemploi, le coût d'une reconversion.

## Comment il calcule

L'industrie est découpée en huit segments, répartis en trois blocs : marché externe (cabinets, éditeurs, conseil), travail interne des employeurs, temps des ménages. Pour chaque segment :

1. activité « complexité » = base × part complexité ;
2. disparaît = complexité × part qui disparaît ;
3. se transforme = complexité × part qui se transforme ;
4. reste = le solde.

Exemple central, travail interne : 1,2 M de personnes dans les métiers administratifs et comptables, 25 % de leur temps liés à la conformité, 60 % de cela qui disparaît, soit environ 180 000 emplois en équivalents temps plein.

Gain pour l'économie : emplois qui disparaissent × taux de réemploi × valeur ajoutée par emploi (77 500 €), moins le coût annuel du système public. Au central : 260 000 × 0,8 × 77 500 € = 16,1 Md€, moins 1 Md€, soit 15,1 Md€. Coût ponctuel : emplois qui disparaissent × coût de reconversion (10 000 € au central).

Personnes à reconvertir : suppressions par an (emplois disparus divisés par la durée de la transition) moins les départs en retraite non remplacés (2,6 % par an des emplois exposés), au minimum zéro.

## L'hypothèse qui porte le résultat

La part du temps interne des entreprises consacrée à la conformité (15 / 25 / 35 %) : le bloc « travail interne » pèse les deux tiers du total. La méthode le dit : passer de 25 à 35 % fait passer les emplois qui disparaissent de 261 000 à 333 000 (resultats.md, § 8). Le central de disparition (60 %) est sous le seul précédent observé (Estonie, 64 % de temps de conformité en moins), le haut (80 %) le dépasse.

## Ce que l'IA a choisi elle-même

La méthode compte quatorze mentions explicites d'une hypothèse ou d'un choix de l'IA, sans source qui tranche : retrait de l'audit légal et part de complexité de 5 à 15 % (H2), part de l'expertise comptable (H3), part des activités juridiques (H4), CA vendu aux cabinets retiré des éditeurs et emplois à 200 000 € de CA par emploi (H5), cabinets de crédit d'impôt (H6), part de la défiscalisation en gestion de patrimoine (H7), part du temps interne (H8), heures par foyer (H9), métiers d'arrivée (H11), réemploi, valeur ajoutée, coût du système public (H12), coût de reconversion entre bornes publiées (H12), et plusieurs paramètres de la partie patrimoine (H17, H19, H21). La plupart poussent la taille de l'industrie vers le haut dans le scénario haut. Le coût du système public (0,5 à 1,5 Md€) n'a pas de source.

## Ce qu'il ne fait pas

Il ne soustrait pas ce que l'automatisation ferait de toute façon à ces métiers : « disparaît » veut dire « ne serait plus nécessaire », pas « supprimé par la réforme ». Il ne chiffre pas les bénéfices de la complexité (ciblage des aides). Doubles comptes possibles entre éditeurs, cabinets et métiers internes. Certaines données sont anciennes (honoraires de crédit d'impôt de 2010). Le gain réel suppose le réemploi.

## Ce qu'il donne

- Taille : 25 / 41 / 57 Md€ par an, soit 0,9 à 1,9 % du PIB, et 268 000 / 435 000 / 602 000 emplois (resultats.md, § 2).
- Disparaît : 10 / 24,3 / 45 Md€ ; 107 000 / 260 000 / 479 000 emplois (§ 3).
- Gain réel net pour l'économie : 3,5 / 15 / 33 Md€ par an (§ 4).
- Coût ponctuel de reconversion : 3,1 / 2,6 / 2,4 Md€.
- Personnes à reconvertir : environ 2 000 / 147 000 / 400 000 selon le rythme (15, 10 ou 5 ans) (§ 5).

## Comment le refaire

Depuis le dossier : `jsc modele.js test_modele.js`, avec `jsc` de JavaScriptCore (`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc`). Les tests passent (aucun échec affiché). Les données sont dans `donnees/`.
