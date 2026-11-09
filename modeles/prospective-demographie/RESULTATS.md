---
titre: Prospective démographique 2025-2070 (résultats)
date: 2026-11-01
version: 1
statut: brouillon
---

# Prospective démographique : résultats

Produit par `python3 run.py` (aucune graine : le modèle est déterministe). Détail : [`trajectoires.csv`](trajectoires.csv), [`comparaison.csv`](comparaison.csv). Méthode et hypothèses : [`METHODE.md`](METHODE.md).

> **Ordres de grandeur conditionnels, jamais des prédictions.** Chaque ligne répond à « que donne la démographie *si* la fécondité, la mortalité et le solde migratoire suivent ces hypothèses ? ».

## 1. Jeu d'hypothèses de l'Insee 2026 (`[^insee2026]`)

| Scénario | Population 2050 (M) | Population 2070 (M) | Part 65+ 2070 | Part 75+ 2070 | 20-64 pour 1 personne de 65+ (2070) | Retraités 2070 (M, âge de départ relevé / constant) |
|---|---|---|---|---|---|---|
| central | 68,9 | 65,4 | 32,1 % | 19,6 % | 1,58 | 20,8 / 22,0 |
| population basse | 64,0 | 55,6 | 32,7 % | 19,3 % | 1,61 | 18,1 / 19,3 |
| population haute | 73,9 | 75,8 | 31,5 % | 19,7 % | 1,55 | 23,6 / 24,9 |
| population agee | 65,7 | 59,4 | 36,5 % | 23,4 % | 1,36 | 21,4 / 22,6 |
| population jeune | 72,2 | 71,8 | 28,1 % | 16,2 % | 1,83 | 20,0 / 21,3 |
| fecondite basse | 66,6 | 60,7 | 34,6 % | 21,1 % | 1,47 | 20,8 / 22,0 |
| fecondite haute | 71,3 | 70,4 | 29,8 % | 18,2 % | 1,69 | 20,8 / 22,0 |
| migration basse | 67,1 | 62,0 | 32,2 % | 19,8 % | 1,59 | 19,8 / 21,0 |
| migration haute | 70,7 | 68,7 | 32,1 % | 19,3 % | 1,57 | 21,8 / 23,1 |
| esperance vie basse | 68,0 | 63,4 | 30,3 % | 17,6 % | 1,72 | 19,1 / 20,3 |
| esperance vie haute | 69,7 | 67,3 | 33,9 % | 21,4 % | 1,46 | 22,5 / 23,7 |

Population en 2025 : 68,9 M (point de départ). Part des 65+ en 2025 : 21,8 % ; 75+ : 10,7 % ; 20-64 pour 1 personne de 65+ : 2,51 ; retraités approximatifs : 16,3 M.

## 2. Jeu d'hypothèses de l'Insee 2021-2070 (fécondité 1,8, solde +70 000), appliqué depuis 2025

| Scénario | Population 2050 (M) | Population 2070 (M) | Part 65+ 2070 | 20-64 pour 1 personne de 65+ (2070) |
|---|---|---|---|---|
| central | 68,4 | 64,8 | 32,2 % | 1,57 |
| population basse | 64,6 | 57,0 | 32,0 % | 1,64 |
| population haute | 72,2 | 72,9 | 32,3 % | 1,51 |
| population agee | 66,4 | 61,1 | 36,1 % | 1,36 |
| population jeune | 70,4 | 68,5 | 28,4 % | 1,81 |

L'écart entre les deux tableaux, c'est surtout la fécondité : 1,80 supposé en 2021 contre 1,56 observé en 2025 (`[^insee2026]`). Ce que coûte l'écart de fécondité à lui seul, à solde et mortalité centraux de l'Insee 2026, se lit aux lignes « fécondité basse » et « fécondité haute » du premier tableau.

## 3. Comparaison avec les chiffres publiés (écarts du modèle, en % du publié)

| Source | Indicateur | Année | Modèle | Publié | Écart | Unité |
|---|---|---|---|---|---|---|
| Eurostat EUROPOP2023 (référence) | population | 2030 | 69,23 | 69,39 | -0,23 | millions |
| Eurostat EUROPOP2023 (référence) | part des 65+ | 2030 | 23,5 | 23,5 | 0,0 | % |
| Eurostat EUROPOP2023 (référence) | 65+ pour 100 de 20-64 | 2030 | 43,4 | 43,4 | 0,0 | pour 100 |
| Eurostat EUROPOP2023 (référence) | population | 2050 | 69,95 | 70,64 | -0,98 | millions |
| Eurostat EUROPOP2023 (référence) | part des 65+ | 2050 | 27,4 | 27,3 | 0,37 | % |
| Eurostat EUROPOP2023 (référence) | 65+ pour 100 de 20-64 | 2050 | 53,2 | 53,1 | 0,19 | pour 100 |
| Eurostat EUROPOP2023 (référence) | population | 2070 | 68,44 | 69,67 | -1,77 | millions |
| Eurostat EUROPOP2023 (référence) | part des 65+ | 2070 | 29,1 | 29,3 | -0,68 | % |
| Eurostat EUROPOP2023 (référence) | 65+ pour 100 de 20-64 | 2070 | 57,2 | 57,6 | -0,69 | pour 100 |
| Eurostat EUROPOP2023 (migration haute) | population | 2070 | 71,47 | 74,01 | -3,43 | millions |
| Eurostat EUROPOP2023 (migration basse) | population | 2070 | 65,48 | 65,42 | 0,09 | millions |
| Insee 2026 | population (central) | 2050 | 68,91 | 69,08 | -0,25 | millions |
| Insee 2026 | population (central) | 2070 | 65,37 | 65,89 | -0,79 | millions |
| Insee 2026 | population (population_basse) | 2050 | 64,04 | 63,34 | 1,11 | millions |
| Insee 2026 | population (population_basse) | 2070 | 55,64 | 54,64 | 1,83 | millions |
| Insee 2026 | population (population_haute) | 2050 | 73,9 | 75,26 | -1,81 | millions |
| Insee 2026 | population (population_haute) | 2070 | 75,8 | 78,26 | -3,14 | millions |
| Insee 2026 | population (fecondite_basse) | 2050 | 66,64 | 66,83 | -0,28 | millions |
| Insee 2026 | population (fecondite_basse) | 2070 | 60,75 | 61,33 | -0,95 | millions |
| Insee 2026 | population (fecondite_haute) | 2050 | 71,27 | 71,44 | -0,24 | millions |
| Insee 2026 | population (fecondite_haute) | 2070 | 70,38 | 70,84 | -0,65 | millions |
| Insee 2026 | population (migration_basse) | 2050 | 67,14 | 66,44 | 1,05 | millions |
| Insee 2026 | population (migration_basse) | 2070 | 62,05 | 60,93 | 1,84 | millions |
| Insee 2026 | population (migration_haute) | 2050 | 70,68 | 71,72 | -1,45 | millions |
| Insee 2026 | population (migration_haute) | 2070 | 68,69 | 70,84 | -3,04 | millions |
| Insee 2026 | population (esperance_vie_basse) | 2050 | 68,04 | 68,13 | -0,13 | millions |
| Insee 2026 | population (esperance_vie_basse) | 2070 | 63,39 | 63,82 | -0,67 | millions |
| Insee 2026 | population (esperance_vie_haute) | 2050 | 69,72 | 70,16 | -0,63 | millions |
| Insee 2026 | population (esperance_vie_haute) | 2070 | 67,28 | 68,03 | -1,1 | millions |
| Insee 2026 | moins de 20 ans (central) | 2026 | 15,87 | 15,53 | 2,19 | millions |
| Insee 2026 | 20-64 ans (central) | 2026 | 37,81 | 38,22 | -1,07 | millions |
| Insee 2026 | 65 ans ou plus (central) | 2026 | 15,34 | 15,34 | 0,0 | millions |
| Insee 2026 | 80 ans ou plus (central) | 2026 | 4,29 | 4,32 | -0,69 | millions |
| Insee 2026 | 65+ pour 100 de 20-64 (central) | 2026 | 40,6 | 40,1 | 1,25 | pour 100 |
| Insee 2026 | moins de 20 ans (central) | 2050 | 12,89 | 12,39 | 4,04 | millions |
| Insee 2026 | 20-64 ans (central) | 2050 | 36,38 | 37,33 | -2,54 | millions |
| Insee 2026 | 65 ans ou plus (central) | 2050 | 19,64 | 19,37 | 1,39 | millions |
| Insee 2026 | 80 ans ou plus (central) | 2050 | 7,96 | 7,65 | 4,05 | millions |
| Insee 2026 | 65+ pour 100 de 20-64 (central) | 2050 | 54,0 | 51,9 | 4,05 | pour 100 |
| Insee 2026 | moins de 20 ans (central) | 2070 | 11,21 | 10,71 | 4,67 | millions |
| Insee 2026 | 20-64 ans (central) | 2070 | 33,16 | 34,08 | -2,7 | millions |
| Insee 2026 | 65 ans ou plus (central) | 2070 | 21,0 | 21,1 | -0,47 | millions |
| Insee 2026 | 80 ans ou plus (central) | 2070 | 9,14 | 8,9 | 2,7 | millions |
| Insee 2026 | 65+ pour 100 de 20-64 (central) | 2070 | 63,3 | 61,9 | 2,26 | pour 100 |
| Insee 2026 | 65+ pour 100 de 20-64 (population_agee) | 2070 | 73,3 | 77,9 | -5,91 | pour 100 |
| Insee 2026 | 65+ pour 100 de 20-64 (population_jeune) | 2070 | 54,8 | 50,2 | 9,16 | pour 100 |
| Insee 2026 | naissances (central) | 2026 | 632583 | 630843 | 0,28 | personnes |
| Insee 2026 | décès (central) | 2026 | 665128 | 659472 | 0,86 | personnes |
| Insee 2026 | naissances (central) | 2050 | 585825 | 581515 | 0,74 | personnes |
| Insee 2026 | décès (central) | 2050 | 852859 | 828264 | 2,97 | personnes |
| Insee 2026 | naissances (central) | 2069 | 491707 | 477164 | 3,05 | personnes |
| Insee 2026 | décès (central) | 2069 | 844099 | 821013 | 2,81 | personnes |
| Insee 2021-2070 | population (central) | 2050 | 68,44 | 69,2 | -1,1 | millions |
| Insee 2021-2070 | population (central) | 2070 | 64,81 | 68,1 | -4,83 | millions |
| Insee 2021-2070 | population (population_basse) | 2050 | 64,59 | 63,9 | 1,08 | millions |
| Insee 2021-2070 | population (population_basse) | 2070 | 56,96 | 58,0 | -1,79 | millions |
| Insee 2021-2070 | population (population_haute) | 2050 | 72,24 | 74,7 | -3,29 | millions |
| Insee 2021-2070 | population (population_haute) | 2070 | 72,91 | 79,1 | -7,83 | millions |
| Insee 2021-2070 | 65 ans ou plus (central) | 2050 | 19,71 | 18,9 | 4,29 | millions |
| Insee 2021-2070 | 65+ pour 100 de 20-64 (central) | 2050 | 55,5 | 53,3 | 4,13 | pour 100 |
| Insee 2021-2070 | 65 ans ou plus (central) | 2070 | 20,86 | 19,68 | 6,0 | millions |
| Insee 2021-2070 | 65+ pour 100 de 20-64 (central) | 2070 | 63,8 | 56,8 | 12,32 | pour 100 |

## 4. Sensibilité au profil d'âge des migrants (scénario central Insee 2026)

| Profil du solde migratoire | Population 2070 (M) | 20-64 ans 2070 (M) | 65+ 2070 (M) | 20-64 pour 1 personne de 65+ (2070) |
|---|---|---|---|---|
| résidus de la projection Eurostat (défaut) | 65,4 | 33,2 | 21,0 | 1,58 |
| stylisé, concentré à 18-34 ans (hypothèse H8 bis) | 67,9 | 36,1 | 20,3 | 1,78 |

## 5. Retraités approximatifs, scénario central Insee 2026 (millions, personnes touchant une pension de droit direct)

| Année | Âge moyen de départ relevé (62,5 puis 64,0 en 2032) | Âge moyen de départ constant (62,5) | 20-64 ans par retraité (relevé) | 20-64 ans par retraité (constant) |
|---|---|---|---|---|
| 2025 | 16,3 | 16,3 | 2,32 | 2,32 |
| 2030 | 16,9 | 17,7 | 2,24 | 2,13 |
| 2035 | 17,7 | 18,9 | 2,13 | 1,99 |
| 2040 | 18,6 | 19,7 | 2,01 | 1,89 |
| 2050 | 19,5 | 20,7 | 1,87 | 1,76 |
| 2060 | 20,0 | 21,2 | 1,74 | 1,65 |
| 2070 | 20,8 | 22,0 | 1,59 | 1,50 |

Lecture : les deux colonnes encadrent l'effet du relèvement de l'âge de départ sur le *nombre* de retraités, pas sur leurs pensions. Les « 20-64 ans par retraité » ne sont pas le « ratio cotisants/retraités » du COR (voir `METHODE.md`, section 5).

Lecture : les écarts sur la population totale restent de l'ordre de 1 à 3 % pour les scénarios centraux, et montent à 5-10 % pour les scénarios extrêmes en 2070. Explications dans [`METHODE.md`](METHODE.md), section 5.



## 6. Emploi et cotisants (module `emploi.py`, T34)

Produit par `python3 run_emploi.py` ; détail : [`trajectoires_emploi.csv`](trajectoires_emploi.csv), [`comparaison_cor.csv`](comparaison_cor.csv). Hypothèses H13 à H20 dans [`METHODE.md`](METHODE.md) (section 8). **Ordres de grandeur conditionnels, jamais des prédictions.**

### 6.1 Population active, emploi, cotisants et retraités (scénario de référence : population Insee 2026 centrale, hypothèses d'emploi COR à chômage de long terme 7 %)

| Année | Population 15-64 (M) | Population active (M) | Emploi (M) | Taux d'emploi 15-64 | Cotisants (M) | Retraités, tous régimes (M) | Cotisants par retraité | Valeur COR (juin 2026) | Écart |
|---|---|---|---|---|---|---|---|---|---|
| 2025 | 42,1 | 31,3 | 28,9 | 67,3 % | 30,6 | 17,4 | 1,76 | 1,77 | -0,5 % |
| 2030 | 42,1 | 31,9 | 29,3 | 68,2 % | 31,1 | 18,2 | 1,71 | 1,75 | -2,4 % |
| 2040 | 41,2 | 32,3 | 30,0 | 70,7 % | 31,8 | 20,0 | 1,59 | 1,64 | -3,0 % |
| 2050 | 39,7 | 31,6 | 29,4 | 71,7 % | 31,2 | 21,0 | 1,49 | 1,54 | -3,3 % |
| 2060 | 38,2 | 30,4 | 28,3 | 71,5 % | 30,0 | 21,6 | 1,39 | 1,44 | -3,7 % |
| 2070 | 36,3 | 28,9 | 26,9 | 71,2 % | 28,5 | 22,5 | 1,27 | 1,30 | -2,8 % |

Lecture : le modèle retrouve les cotisants du COR à 1 % près jusqu'en 2050 et à ‑1,1 % en 2070 (28,5 M contre 28,8 M) ; l'écart sur le rapport cotisants/retraités (−2,8 % en 2070 : 1,27 contre 1,30) vient surtout de la population (voir 6.4). Cotisants par retraité : 1,76 en 2025, 1,27 en 2070 : le rapport baisse de 28 %, quand le rapport démographique 20-64 / 65+ baisse de 37 % (2,51 à 1,58) : l'emploi des seniors amortit une partie du choc.

### 6.2 Leviers, effets sur 2050 et 2070 (population centrale)

| Scénario | Cotisants 2050 (M) | Cotisants 2070 (M) | Retraités 2070 (M) | Cotisants par retraité 2050 | Cotisants par retraité 2070 | Écart à la référence en 2070 |
|---|---|---|---|---|---|---|
| reference cor | 31,2 | 28,5 | 22,5 | 1,49 | 1,27 | 0,00 |
| demographie seule taux 2025 figes | 29,7 | 26,8 | 23,7 | 1,34 | 1,13 | -0,13 |
| chomage structurel 5 | 31,9 | 29,1 | 22,5 | 1,52 | 1,30 | 0,03 |
| chomage structurel 10 | 30,2 | 27,6 | 22,5 | 1,44 | 1,23 | -0,04 |
| age depart gele 2025 | 30,2 | 27,4 | 23,8 | 1,36 | 1,15 | -0,12 |
| age depart plus 1 an 2040 | 31,9 | 29,3 | 21,6 | 1,59 | 1,36 | 0,09 |
| age depart plus 2 ans 2040 | 32,6 | 30,0 | 20,7 | 1,70 | 1,45 | 0,18 |

Lecture : (i) à taux d'activité et de retraite figés à leur niveau de 2025, le rapport tomberait à 1,13 en 2070 : le relèvement de l'âge de départ et l'emploi des seniors supposés par le COR pèsent environ 0,13 point de rapport ; (ii) chaque point de chômage de long terme pèse environ 0,014 point de rapport en 2070 (1,30 à 5 %, 1,23 à 10 % : écart de 0,07 pour 5 points) ; (iii) un an d'âge effectif de départ en plus (atteint en 2040) vaut environ 0,09 point de rapport en 2070, soit environ six fois l'effet d'un point de chômage ; (iv) le gel de l'âge effectif à son niveau de 2025 (63,1 ans, contre 64,6 dans la trajectoire du COR) retire 0,12 point.

### 6.3 Scénarios de population (hypothèses d'emploi du COR inchangées)

| Scénario de population (Insee 2026) | Cotisants 2070 (M) | Cotisants par retraité 2050 | Cotisants par retraité 2070 |
|---|---|---|---|
| central | 28,5 | 1,49 | 1,27 |
| population basse | 25,2 | 1,52 | 1,29 |
| population haute | 31,9 | 1,46 | 1,25 |
| population agee | 25,5 | 1,42 | 1,10 |
| population jeune | 31,6 | 1,57 | 1,46 |

### 6.4 Comparaison avec le COR et explication des écarts

| Indicateur | Année | Modèle | COR ou publié | Écart | Unité |
|---|---|---|---|---|---|
| cotisants (COR, scénario de référence) | 2025 | 30,6382 | 30,6382 | 0,0 | millions |
| retraités, tous régimes (COR) | 2025 | 17,4035 | 17,3111 | 0,53 | millions |
| rapport cotisants / retraités (COR) | 2025 | 1,7605 | 1,7699 | -0,53 | rapport |
| cotisants (COR, scénario de référence) | 2030 | 31,1067 | 31,1127 | -0,02 | millions |
| retraités, tous régimes (COR) | 2030 | 18,2139 | 17,775 | 2,47 | millions |
| rapport cotisants / retraités (COR) | 2030 | 1,7079 | 1,7504 | -2,43 | rapport |
| cotisants (COR, scénario de référence) | 2040 | 31,8326 | 32,0583 | -0,7 | millions |
| retraités, tous régimes (COR) | 2040 | 20,0084 | 19,5525 | 2,33 | millions |
| rapport cotisants / retraités (COR) | 2040 | 1,591 | 1,6396 | -2,97 | rapport |
| cotisants (COR, scénario de référence) | 2050 | 31,1942 | 31,4447 | -0,8 | millions |
| retraités, tous régimes (COR) | 2050 | 20,9549 | 20,4275 | 2,58 | millions |
| rapport cotisants / retraités (COR) | 2050 | 1,4886 | 1,5393 | -3,29 | rapport |
| cotisants (COR, scénario de référence) | 2060 | 29,9957 | 30,2275 | -0,77 | millions |
| retraités, tous régimes (COR) | 2060 | 21,5602 | 20,9292 | 3,02 | millions |
| rapport cotisants / retraités (COR) | 2060 | 1,3913 | 1,4443 | -3,67 | rapport |
| cotisants (COR, scénario de référence) | 2070 | 28,5036 | 28,8191 | -1,09 | millions |
| retraités, tous régimes (COR) | 2070 | 22,4765 | 22,0912 | 1,74 | millions |
| rapport cotisants / retraités (COR) | 2070 | 1,2681 | 1,3045 | -2,79 | rapport |
| 20-64 ans par personne de 65+ (Insee via COR, fig. 1.5) | 2030 | 2,2909 | 2,3273 | -1,56 | rapport |
| 20-64 ans par personne de 65+ (Insee via COR, fig. 1.5) | 2050 | 1,8522 | 1,927 | -3,88 | rapport |
| 20-64 ans par personne de 65+ (Insee via COR, fig. 1.5) | 2070 | 1,5789 | 1,615 | -2,24 | rapport |
| taux d'emploi 15-64 ans (COR fig. 1.12 ; dénominateurs différents) | 2025 | 0,673 | 0,693 | -2,89 | fraction |
| taux d'emploi 15-64 ans (COR fig. 1.12 ; dénominateurs différents) | 2050 | 0,7171 | 0,7216 | -0,61 | fraction |
| taux d'emploi 15-64 ans (COR fig. 1.12 ; dénominateurs différents) | 2070 | 0,7124 | 0,7175 | -0,71 | fraction |
| rapport 2070 avec la pyramide Insee 2026 (au lieu de celle du modèle) | 2070 | 1,2979 | 1,3045 | -0,51 | rapport |
| emploi 2025 du modèle contre Eurostat (15-74 ans, enquête Emploi) | 2025 | 28,8875 | 29,3309 | -1,51 | millions |
| rapport cotisants / retraités 2070, variante COR chômage 5 % | 2070 | 1,2953 | 1,3329 | -2,82 | rapport |
| rapport cotisants / retraités 2070, variante COR chômage 10 % | 2070 | 1,2274 | 1,2631 | -2,82 | rapport |
| croissance annuelle de la population active, 2023-2033 (modèle : 2025-2033) | 2033 | 0,331 | 0,485 | -0,154 | % par an (écart en points) |
| croissance annuelle de la population active, 2034-2044 (modèle : 2033-2044) | 2044 | 0,008 | 0,064 | -0,055 | % par an (écart en points) |
| croissance annuelle de la population active, 2045-2055 (modèle : 2044-2055) | 2055 | -0,353 | -0,351 | -0,003 | % par an (écart en points) |
| croissance annuelle de la population active, 2056-2066 (modèle : 2055-2066) | 2066 | -0,42 | -0,444 | 0,024 | % par an (écart en points) |

**Explication des écarts (estimations).** (1) *Population* : avec la pyramide de l'Insee 2070 à la place de celle du modèle, le rapport vaut 1,298 contre 1,305 pour le COR (−0,5 %) : environ 80 % de l'écart de 2070 (−2,8 %) vient donc de la structure par âge du modèle (20-64 ans −2,7 % par rapport à l'Insee, voir `METHODE.md` section 5, profil d'âge des migrants). (2) *Définitions* : les cotisants du COR (30,6 M en 2025) sont des cotisants à au moins un régime, pas des personnes en emploi au sens du BIT (28,9 M dans le modèle, 29,3 M selon Eurostat pour les 15-74 ans) ; le modèle les relie par un coefficient fixe de 1,06 (H16), qui ne tient pas compte d'une évolution du multi-emploi ou du cumul emploi-retraite (le COR publie ses hypothèses de cumul, non reprises ici). (3) *Taux d'emploi 15-64 ans* : 67,3 % dans le modèle en 2025 contre 69,3 % chez le COR, parce que le modèle divise par la population totale résidente et non par celle des ménages ordinaires de l'enquête Emploi (écart de dénominateur, pas d'emploi). (4) *Retraités* : le modèle applique les taux de retraités par âge du COR (50-70 ans, taux de 70 ans étendu au-delà) aux populations du modèle et dépasse le nombre de retraités du COR de 1,7 % en 2070 (retraités résidant en France : 21,4 M contre 20,8 M ; avec la pyramide Insee : 21,5 M). Le surplus ne vient donc pas de la population ; cause non identifiée (hypothèses : l'extension du taux de 70 ans aux âges élevés, l'absence d'effet de génération, et le passage résidents → tous régimes par un coefficient constant de 1,053 alors que le COR le fait varier de 1,053 à 1,075 puis 1,064). Ce surplus de retraités et la sous-estimation des cotisants par la population du modèle jouent dans le même sens sur le rapport, la première pour environ −1,7 point et la seconde pour environ −1,1 point en 2070, partiellement compensées par un excès de cotisants (+1,8 % avec la pyramide Insee). (5) *Lissage par âge* : les taux par tranche de 5 ans sont lissés par âge simple, sans effet de génération. (6) *Population active* : croissance annuelle moyenne proche de celle du COR après 2044 (−0,35 % contre −0,35 %, puis −0,42 % contre −0,44 %), plus faible avant (0,33 % sur 2025-2033 contre 0,49 % sur 2023-2033 ; 0,01 % contre 0,06 % sur 2034-2044) : les trois premières années du COR (2023-2025) sont hors modèle et la population de 15-24 ans du modèle croît moins.

### 6.5 Variante « robotisation » (baisse du besoin d'emploi : hypothèse, pas prédiction)

Mécanisme : à partir de 2030, une part r des emplois du scénario de référence cesse d'être nécessaire, en rampe logistique jusqu'à r en 2060 ; une part c (compensation) est recréée ailleurs ; la perte nette r(1−c) se répartit pour moitié en chômage, pour moitié en sortie d'activité. Les bornes de r sont des ordres de grandeur issus de `sources/recherche-ia-robotique.md` (Goldman Sachs : 9 % des emplois américains déplacés en 10 ans ⚠️ ; Banque mondiale : 14,2 % d'emplois à risque dans les pays riches ⚠️ ; OIT : 3,3 % dans la catégorie la plus exposée) : 5 %, 15 %, 30 % (le dernier est un test de résistance, hors de ces sources).

| Scénario | Emploi 2070 (M) | Taux de chômage 2070 | Cotisants par retraité 2070 | Masse salariale par retraité (indice, mêmes unités) |
|---|---|---|---|---|
| reference cor | 26,9 | 7,0 % | 1,27 | 1,27 |
| robotisation 5 sans compensation | 25,5 | 9,5 % | 1,20 | 1,20 |
| robotisation 15 sans compensation | 22,8 | 15,0 % | 1,08 | 1,08 |
| robotisation 15 compensation 50 | 24,9 | 10,8 % | 1,17 | 1,17 |
| robotisation 30 sans compensation | 18,8 | 24,3 % | 0,89 | 0,89 |
| robotisation 30 compensation 50 | 22,8 | 15,0 % | 1,08 | 1,08 |
| robotisation 30 comp 50 salaires plus 15 | 22,8 | 15,0 % | 1,08 | 1,24 |

Lecture : le choc démographique fait passer le rapport de 1,76 à 1,27 ; une robotisation nette de 15 % l'amène à 1,08 (−0,19), soit une fois et demie l'effet du gel de l'âge de départ (−0,12) ; elle relève le chômage de 7 % à 15 %. Avec une compensation de moitié, le rapport est 1,17. La variante ne dit rien du *niveau* de la masse salariale : si les salaires par emploi restants montent (dernière ligne : +15 % en 2070), la masse salariale par retraité remonte, mais pas le nombre de cotisants ; le financement d'un régime par répartition dépend de la masse salariale, pas du nombre de têtes. Ces résultats ne tiennent compte ni du financement par d'autres assiettes (capital, valeur ajoutée), ni de la réponse de la fécondité ou des migrations, ni du fait que moins d'emplois peut vouloir dire un âge de départ plus bas.

