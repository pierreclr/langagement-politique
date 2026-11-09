---
titre: Démographie de la France — passé, projection et sensibilité aux hypothèses
date: 2026-11-07
statut: brouillon
demande: l'auteur, 07/11/2026 (une vision graphique de la démographie, « as code »)
---

# Démographie : où en est-on, où va-t-on, et qu'est-ce qui compte

Légende : **fait sourcé** (cote A à D, règle 11) · **estimation** (calcul de Claude, méthode donnée) · **hypothèse**. Les projections sont des hypothèses et des ordres de grandeur, jamais des prévisions. Vérifications non résolues : V19400 à V19407 dans [`verifications.md`](../../verifications.md).

## 1. La question : « de 10 à 20 millions de plus de 60 ans en une vie ? »

**Oui pour les ordres de grandeur, mais en 51 ans (1975-2026), pas en une vie entière, et en comparant honnêtement avec la population totale.**

| 1er janvier | Population totale | 60 ans ou plus | Part des 60+ | 65 ans ou plus | 75 ans ou plus |
|---|---|---|---|---|---|
| 1950, métropole | 41,65 M | 6,76 M | 16,2 % | 4,73 M | 1,56 M |
| 1975, métropole | 52,60 M | **9,67 M** | **18,4 %** | 7,05 M | 2,66 M |
| 2000, métropole | 58,86 M | 12,14 M | 20,6 % | 9,43 M | 4,24 M |
| 2026, métropole | 66,79 M | **19,16 M** | **28,7 %** | 14,96 M | 7,53 M |
| 2026, France (avec les DOM et Mayotte) | 69,08 M | **19,69 M** | 28,5 % | 15,34 M | 7,69 M |

*Source : Insee, bilan démographique 2025, population au 1er janvier par âge révolu, [3_Pop1janv_age.xlsx](https://www.insee.fr/fr/statistiques/fichier/8721185/3_Pop1janv_age.xlsx) (cote A ; 2026 provisoire) ; sommes par âge calculées ici (`donnees/population_grands_ages_1901_2026.csv`). Avant 2000, seule la métropole est publiée : la comparaison à périmètre égal est métropole 1975 contre métropole 2026.*

À périmètre égal : les 60+ ont été multipliés par **2,0** (9,7 M → 19,2 M) pendant que la population totale était multipliée par **1,27** (52,6 M → 66,8 M). Leur part a gagné 10 points (18 % → 29 %). Depuis 1950 (6,8 M), le facteur est 2,8. Deux précisions : (1) 1975 est un petit sommet local des 60+ (9,7 M, puis 9,2 M en 1980) probablement parce que les classes creuses nées pendant la guerre de 1914-1918 passent le seuil de 60 ans entre 1975 et 1979 (interprétation de Claude, non vérifiée : V19407) ; (2) le chiffre de 1975 est un total arrondi dans le fichier source (52 600 000), sans effet sur les sommes par âge.

Pour 60 ans comme seuil, on compare des personnes dont une partie travaille encore : en 1975 comme aujourd'hui, l'âge de départ n'est pas 60 ans. Le seuil de 65 ans donne la même histoire (7,0 M → 15,0 M en métropole, ×2,1).

Graphiques : `sorties/graphiques/plus_de_60_ans.png`, `pyramides.png`, `dependance.png` (matplotlib, hors modèle).

## 2. Ce que disent les projections

Modèle par composantes de cohortes (méthode au §5), calé sur les hypothèses centrales de l'Insee (fécondité 1,45 dès 2028, solde migratoire +150 000 par an, espérance de vie à la naissance en 2070 de 89,5 ans pour les femmes et 86,7 pour les hommes). Les résultats officiels sont ceux de l'[Insee Première n° 2108](https://www.insee.fr/fr/statistiques/9004289) (juin 2026, cote A) ; le modèle les retrouve (§4).

| France, scénario central | 2026 | 2040 | 2070 | Insee 2040 | Insee 2070 |
|---|---|---|---|---|---|
| Population totale | 69,08 M | 70,06 M | 66,44 M | 69,73 M | 65,89 M |
| 0-19 ans | 15,53 M | 12,87 M | 10,85 M | 12,97 M | 10,71 M |
| 20-64 ans | 38,22 M | 38,25 M | 34,37 M | 38,19 M | 34,08 M |
| 60 ans ou plus | 19,69 M | 22,98 M | 25,71 M | n.p. | n.p. |
| 65 ans ou plus | 15,34 M | 18,94 M | 21,22 M | 18,57 M | 21,10 M |
| 75 ans ou plus | 7,69 M | 10,73 M | 13,18 M | n.p. | n.p. |
| 20-64 ans pour un 65+ | 2,49 | 2,02 | 1,62 | 2,06 | 1,62 |
| Rapport de dépendance (65+ pour 100 de 20-64) | 40,1 | 49,5 | 61,8 | 48,6 | 61,9 |

*(n.p. : non publié dans la source ; pour 1975, métropole, le rapport 65+/20-64 est de 24,6 pour 100, soit 4,1 personnes de 20-64 ans pour un 65+.)*

**Actifs et retraités (indicateur simple, estimation de Claude).** Nombre de personnes ayant atteint l'âge de départ pour 100 personnes de 20 ans à cet âge moins un, scénario central :

| Âge de départ appliqué à toute la période | 2026 | 2040 | 2070 |
|---|---|---|---|
| 62 ans | 50 | 60 | 75 |
| 64 ans | 43 | 53 | 66 |
| 67 ans | 34 | 43 | 54 |

Autrement dit, avec un âge de départ de 64 ans, on passe de 2,3 personnes de 20 à 63 ans pour une personne de 64 ans ou plus (2026) à 1,9 (2040) et 1,5 (2070).

**Indice « pension moyenne constante, part du PIB ».** Hypothèses : pension moyenne constante par rapport au revenu d'activité moyen, taux d'emploi par âge constant, « retraité » = personne ayant l'âge de départ, calage sur 14,1 % du PIB en 2025 pour un âge de 62 ans en 2026 (COR, rapport annuel juin 2026, [PDF](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf), cote B). Résultat : à âge de départ de 62 ans, 14,1 % → 16,7 % (2040) → 21,1 % (2070) ; à 64 ans (recalculé pour toute la période, donc 12,2 % en 2026 : contrefactuel, pas observé) 12,2 → 14,8 → 18,5 ; à 67 ans 9,6 → 12,1 → 15,3. Vérification de cohérence, non une validation : le COR projette 15,3 % en 2070 avec un âge moyen de départ de 64,6 ans et une pension moyenne qui passe de 54,6 % à 45,3 % du revenu d'activité (soit ×0,83) ; 18,5 % × 0,83 = 15,4 %, du même ordre. L'indice n'est donc **pas** une projection de dépenses : il isole l'effet démographique.

## 3. Ce qui change le plus le résultat (2070, une hypothèse à la fois, `sorties/sensibilites.txt`)

| Hypothèse changée | Population 2070 | 20-64 ans | 65+ | Rapport 65+ / 20-64 | Retraités pour 100 actifs (64 ans) |
|---|---|---|---|---|---|
| **Central** | 66,4 M | 34,4 M | 21,2 M | 61,8 % | 66 |
| Fécondité 1,20 dès 2030 | 61,9 M | 32,1 M | 21,2 M | 66,0 % | 70 |
| Fécondité 1,70 dès 2030 | 71,3 M | 36,7 M | 21,2 M | 57,9 % | 62 |
| Fécondité 2,10 dès 2035 (remplacement) | 78,5 M | 39,8 M | 21,2 M | 53,4 % | 57 |
| Solde migratoire nul | 58,4 M | 29,5 M | 19,8 M | 67,1 % | 71 |
| Solde +230 000 | 70,7 M | 37,0 M | 22,0 M | 59,5 % | 64 |
| Solde +400 000 | 79,9 M | 42,5 M | 23,6 M | 55,6 % | 59 |
| Espérance de vie constante (2025) | 63,0 M | 34,0 M | 18,1 M | 53,2 % | 57 |
| Espérance de vie 2070 : −3 ans | 64,4 M | 34,2 M | 19,4 M | 56,7 % | 61 |
| Espérance de vie 2070 : +3 ans | 68,4 M | 34,5 M | 23,1 M | 66,9 % | 71 |
| Âge de départ 62 → 67 ans (démographie centrale) | 66,4 M | 34,4 M | 21,2 M | 61,8 % | 75 → 54 |

Lecture, en distinguant ce qui est établi par le calcul de ce qui est une opinion :

1. **Le vieillissement est largement acquis.** Les 65+ de 2070 sont déjà nés (sauf migrants) : ils sont ~21 M dans toutes les variantes de fécondité. Même avec 2,1 enfants par femme dès 2035, le rapport 65+/20-64 est de 53 % en 2070 contre 40 % aujourd'hui. Il ne revient pas à son niveau de 1975 (25 %).
2. **La fécondité ne joue pas avant ~2045-2050 sur ce rapport** : un enfant né en 2026 entre dans la tranche 20-64 ans en 2046. Elle joue à long terme (−4 à −8 points de rapport en 2070 selon la cible) et sur la population totale (61,9 M à 71,3 M entre 1,20 et 1,70).
3. **La migration joue tout de suite**, parce que les migrants arrivent à 20-35 ans : en 2040 le rapport va de 51,3 % (solde nul) à 46,9 % (+400 000). Elle ne règle rien seule : même à +400 000 par an (plus du double de 2025), le rapport 2070 est de 55,6 %.
4. **L'espérance de vie** déplace surtout le nombre de 65+ (18,1 M si elle cesse de progresser, 23,1 M avec +3 ans par rapport au central). C'est la composante qui fait le plus varier les 65+ : l'écart entre « constante » et « +3 ans » est de 5 millions de personnes en 2070.
5. **L'âge de départ est de loin le levier le plus puissant sur le rapport retraités/actifs** (75 → 54 pour 100 entre 62 et 67 ans), parce qu'il agit à la fois sur le numérateur et le dénominateur. Contrairement aux autres, c'est un choix politique, pas une donnée : à lire comme « ce que vaut chaque levier », pas comme un plaidoyer (opinion de l'auteur, hors rapport). L'approche suppose aussi que ceux de 62-66 ans puissent travailler (emploi des seniors, santé : non modélisé).

Effet comparé en points de rapport de dépendance en 2070 (écart au central) : fécondité 1,20 / 1,70 : +4,2 / −3,9 ; solde migratoire nul / +230 000 : +5,3 / −2,3 ; espérance de vie ±3 ans : −5,1 / +5,1 ; fécondité 2,1 : −8,4 ; aucun scénario réaliste ne ramène le rapport sous 50 %.

Steelman (règle 5) : l'objection la plus forte à ce type d'analyse est que le rapport 65+/20-64 est un indicateur grossier : la productivité, le taux d'emploi réel (non modélisé), la santé en bonne santé des seniors et l'automatisation (thèse de l'auteur) peuvent changer la capacité à financer un nombre donné de retraités. C'est exact : l'indicateur mesure la contrainte démographique, pas la soutenabilité financière. Autre objection : une immigration à +400 000 par an suppose une capacité d'accueil (logement, intégration) non traitée ici ; la fécondité à 2,1 n'a pas été atteinte en métropole depuis 1974 (2,11 ; 1,93 en 1975 ; Insee, cote A).

Statut de la recherche (règle 9, en bref) : l'Insee présente ses projections comme « conditionnelles » (des hypothèses, pas des prévisions) et publie des variantes très écartées à 2070 (55 à 78 M). La fécondité a baissé de 2,03 (France, 2010) à 1,56 (2025 provisoire) : fait sourcé (Insee, cote A). Les causes de cette baisse (âge à la première naissance, logement, emploi, préférences) et l'efficacité des politiques natalistes sont débattues en sciences sociales : ⚠️ À VÉRIFIER (V19405), aucune étude n'est citée ici, le chapitre « état de la recherche » reste à écrire.

## 4. Validation contre l'Insee (`tests/`, `sorties/validation.txt`)

Le scénario aux hypothèses centrales retrouve la projection officielle Insee (Insee Première 2108, juin 2026) :

| Indicateur | Modèle | Insee | Écart |
|---|---|---|---|
| Population totale 2040 | 70,06 M | 69,73 M | +0,5 % |
| Population totale 2070 | 66,44 M | 65,89 M | +0,8 % |
| 65 ans ou plus 2040 | 18,94 M | 18,57 M | +2,0 % |
| 65 ans ou plus 2070 | 21,22 M | 21,10 M | +0,6 % |
| Rapport de dépendance 2040 / 2070 | 49,5 / 61,8 | 48,6 / 61,9 | +1,8 % / −0,3 % |

Les neuf scénarios de population totale de l'Insee en 2040 et 2070 (fécondité, migration, espérance de vie, population basse et haute) sont retrouvées à 0 à 2,1 % près (population basse 2070 : 55,8 M contre 54,6 M). Tous les tests (`python3 -I tests/test_projection.py`, 13 tests) passent.

**Écarts expliqués.** (1) Le modèle surestime les 80 ans ou plus de 6 à 8 % (7,1 M contre 6,7 M en 2040) et sous-estime les décès de 3 à 5 % vers 2030-2040 : il applique un **facteur commun à tous les âges** pour reproduire le gain d'espérance de vie, alors que l'Insee module les gains par âge. (2) Le profil des migrants par âge est estimé par résidu de cohortes, pas repris de l'Insee (non publié dans les fichiers lus) : voir V19401. (3) Le scénario composé « population âgée » (fécondité basse + migration basse + espérance de vie haute) donne un rapport 2070 de 74,9 % contre 77,9 % : l'écart de 3,8 % se cumule sur trois hypothèses extrêmes à la fois ; tolérance portée à 4,5 % pour ce cas seulement. (4) La population de départ est l'estimation **provisoire** de l'Insee à fin 2025.

## 5. Méthode, données et code

Modèle par composantes (`code/projection.py`, bibliothèque standard, fonctions pures, `python3 -I`). Chaque année : vieillissement par sexe et âge révolu avec les quotients de mortalité, solde migratoire réparti par âge et sexe, naissances = taux de fécondité par âge × exposition des femmes de 15 à 49 ans. Paramètres réglables : `icf_cible` et `annee_icf` (indicateur de fécondité), `age_moyen_cible` et `annee_age`, `gain_e0_femmes` / `gain_e0_hommes` (gain annuel d'espérance de vie, années par an), `solde_migratoire` (par an), `age_depart`. Exemple :

```python
import projection as P
b = P.charger_base("donnees")
s = P.par_annee(P.projeter(b, P.parametres(b, icf_cible=1.8, annee_icf=2030, solde_migratoire=100000)))
print(s[2070]["total"], s[2070]["retraites_par_actif"])
```

| Fichier (`donnees/`) | Contenu | Source | Cote |
|---|---|---|---|
| `population_grands_ages_1901_2026.csv` | 0-19, 20-64, 60+, 65+, 75+, 80+, total, 1901-2026 | Insee, bilan démographique 2025 (pyramides) | A |
| `pyramide_2026_france.csv` | population par âge et sexe au 1er janvier 2026 | idem | A |
| `pyramides_france_2014_2026.csv` | pyramides annuelles (sert au résidu migratoire) | idem | A |
| `mortalite_tables_triennales_1999_2025.csv` | quotients par âge et sexe, espérance de vie | Insee, tables triennales (2023-2025 provisoire) | A |
| `fecondite_par_age_1994_2025.csv`, `icf_1901_2025.csv` | taux par âge, indicateur conjoncturel et âge moyen | Insee, bilan démographique 2025 | A |
| `migration_profil_residuel.csv` | profil par âge et sexe du solde migratoire | **calcul de Claude** (résidu de cohortes) | B |
| `insee_projections_2026_*.csv` | scénarios, âges, pyramide 2070, mouvements, hypothèses | Insee Première 2108 | A |

Conflits d'intérêts connus : Insee, institut statistique officiel ; aucun lien d'intérêt connu avec la thèse. Fichiers bruts dans `$DONNEES/sources/demographie/` ; reconstruction : `code/construire_donnees.py`, `code/profil_migration.py`, `code/construire_json.py`.

**Fichier pour la page interactive : `sorties/demographie.json` (40 Ko).** Contient l'historique (grands âges, 1901-2026), la pyramide 2026, les quotients de mortalité, le profil de fécondité 2025, le profil migratoire, les paramètres centraux, l'algorithme en 5 étapes (`meta.algorithme`) et trois scénarios précalculés par an jusqu'en 2070 : **bas** (population basse Insee : fécondité 1,20, solde +70 000, espérance de vie basse), **central**, **haut** (fécondité 1,70, +230 000, espérance de vie haute). Attention : « bas » et « haut » désignent la taille de la population, pas le vieillissement ; en 2070 le rapport de dépendance est de 63,3 / 61,8 / 60,4 %, car les trois composantes jouent en sens inverses sur ce rapport. La porte en JavaScript du modèle n'est **pas** écrite (aucun interpréteur JavaScript disponible pour la tester ici) : l'algorithme est décrit pas à pas dans le JSON et le code Python sert de référence.

## 6. Limites

1. **Facteur de mortalité commun à tous les âges** (surestime les 80+ de 6 à 8 %) ; pas de mortalité différentielle (diplôme, niveau de vie).
2. **Profil migratoire estimé** par résidu sur 2018-2019 et 2022-2025, âges 1 à 64, ni les retours ni les départs de Français ne sont séparés ; niveau fixé par hypothèse.
3. **Fécondité** : forme par âge de 2025 décalée pour suivre l'âge moyen de l'Insee ; pas de modèle de rattrapage ni d'effet de la fécondité des immigrées.
4. **Pas d'économie** : taux d'emploi, productivité, santé des seniors et réformes sont absents ; l'indice « part du PIB » est un contrefactuel démographique, pas une projection du COR.
5. **Données provisoires** : pyramide 2026, table de mortalité 2023-2025 et fécondité 2025 sont provisoires (Insee, bilan à fin 2025).
6. **Périmètres** : la série longue avant 2000 est métropolitaine ; 1915-1919 absentes du fichier source.
7. **Horizon** : au-delà de 2050, l'incertitude de l'Insee lui-même (61 à 71 M en 2070 en changeant une seule hypothèse, 55 à 78 M toutes hypothèses combinées) domine ; à lire comme conditionnelle.
8. Projections 2021-2070 (édition précédente de l'Insee) non utilisées : les projections 2026 (Insee Première 2108) sont plus récentes et couvrent le même horizon.
