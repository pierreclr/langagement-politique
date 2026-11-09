---
titre: Taux d'intérêt endogène : résultats (T74)
date: 2026-11-09
statut: généré par calculer.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Taux endogène : résultats

Généré le 09/11/2026 par `python3 -I modeles/taux-endogene/calculer.py` (10000 tirages par programme, graine du banc 20261108). Écrit par Claude (IA d'Anthropic) pour l'auteur ; même conflit d'intérêts que le banc (le moteur chiffre notre système et ses concurrents). Méthode et hypothèses H-TE1 à H-TE16 : `methode.md` ; faits : `sources/taux-souverains-faits-2026.md`. **Ce fichier n'écrase rien** : les résultats du banc (`modeles/banc-programmes/resultats.md`) restent ceux du taux fixe de 3,45 % ; ceci est une couche de sensibilité.

Variantes : **banc** = chaîne du banc (OAT fixe 3,45 %, convergence en 8 ans), reproduite à l'identique (test) ; **exogène** = recalage du niveau seul (OAT fixe 4,7 % = Bund 3,4 % + prime 1,3 point, sans boucle) ; **endogène central** = prime fonction de la dette (2 pb par point), du déficit (10 pb par point) et convexe au-delà de 130 % (0,03 pb par point²) ; **sensibilités bas / haut** = (1 pb ; 0 ; pas de convexité au-dessous de 140 %) / (4 pb ; 25 pb ; 0,09 pb par point² au-delà de 120 %), niveaux centraux ; **TPI** = endogène central, prime plafonnée à 1,75 point les années où le pays est éligible (déficit ≤ 3 % ou en baisse de 0,4 point). Taux en % ; dette en % du PIB. « Crise » = première année où la prime dépasse 3 points ; **n.s.** (non significatif) = année postérieure à l'entrée en zone de crise (pour les programmes : plus de la moitié des tirages y sont entrés) : la prime y est plafonnée à 15 points et la dynamique ne décrit plus rien (dans la réalité : programme d'ajustement, aide européenne, restructuration ou intervention de la BCE).

## 1. Grille d'efforts budgétaires (amélioration du solde primaire par rapport au droit actuel, Md€ de 2025, montée 2028-2032, croissance nominale 3 %)

L'effort 0 est le fil de l'eau du banc (solde primaire de 2024 maintenu, −3,5 % du PIB). 30 Md€ ≈ 1 point de PIB. L'effort n'a ici aucun effet sur l'activité (statique), sauf dans la ligne « multiplicateur ».

| Effort (Md€/an) | Variante | OAT 2032 | OAT 2038 | OAT 2058 | Taux apparent 2038 | Taux apparent 2058 | Dette 2032 | Dette 2038 | Dette 2058 | Crise |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | banc (3,45 % fixe) | 3,45 | 3,45 | 3,45 | 3,18 | 3,43 | 135,9 | 157,1 | 240,2 | — |
| 0 | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,70 | 4,28 | 4,50 | 140,6 | 171,3 | 306,1 | — |
| 0 | **endogène central** | 5,32 | n.s. | n.s. | n.s. | n.s. | 141,3 | n.s. | n.s. | 2037 |
| 0 | sensibilités basses | 4,88 | 5,19 | n.s. | 4,56 | n.s. | 140,8 | 173,2 | n.s. | 2054 |
| 0 | sensibilités hautes | 6,40 | n.s. | n.s. | n.s. | n.s. | 142,4 | n.s. | n.s. | 2033 |
| 0 | central + TPI | 5,32 | n.s. | n.s. | n.s. | n.s. | 141,3 | n.s. | n.s. | 2037 |
| 0 | central + multiplicateur 0,8 | 5,32 | n.s. | n.s. | n.s. | n.s. | 141,3 | n.s. | n.s. | 2037 |
| 0 | tout bas (Bund 2,9 ; prime 0,8) | 3,85 | 4,07 | 5,10 | 3,36 | 4,39 | 136,3 | 158,9 | 265,0 | — |
| 0 | tout haut (Bund 3,9 ; prime 1,7) | n.s. | n.s. | n.s. | n.s. | n.s. | n.s. | n.s. | n.s. | 2031 |
| 30 | banc (3,45 % fixe) | 3,45 | 3,45 | 3,45 | 3,18 | 3,43 | 132,9 | 148,1 | 209,7 | — |
| 30 | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,70 | 4,27 | 4,50 | 137,6 | 161,7 | 270,2 | — |
| 30 | **endogène central** | 5,18 | 6,26 | n.s. | 5,09 | n.s. | 138,1 | 167,0 | n.s. | 2039 |
| 30 | sensibilités basses | 4,86 | 5,10 | n.s. | 4,50 | n.s. | 137,7 | 163,3 | n.s. | 2057 |
| 30 | sensibilités hautes | 6,01 | n.s. | n.s. | n.s. | n.s. | 139,0 | n.s. | n.s. | 2034 |
| 30 | central + TPI | 5,18 | 6,26 | n.s. | 5,09 | n.s. | 138,1 | 167,0 | n.s. | 2039 |
| 30 | central + multiplicateur 0,8 | 5,22 | 6,31 | n.s. | 5,13 | n.s. | 139,2 | 168,1 | n.s. | 2039 |
| 30 | tout bas (Bund 2,9 ; prime 0,8) | 3,83 | 3,98 | 4,72 | 3,31 | 4,09 | 133,3 | 149,5 | 225,2 | — |
| 30 | tout haut (Bund 3,9 ; prime 1,7) | n.s. | n.s. | n.s. | n.s. | n.s. | n.s. | n.s. | n.s. | 2031 |
| 60 | banc (3,45 % fixe) | 3,45 | 3,45 | 3,45 | 3,18 | 3,43 | 129,9 | 139,0 | 179,2 | — |
| 60 | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,70 | 4,25 | 4,49 | 134,5 | 152,1 | 234,3 | — |
| 60 | **endogène central** | 5,05 | 5,74 | n.s. | 4,81 | n.s. | 135,0 | 155,7 | n.s. | 2042 |
| 60 | sensibilités basses | 4,84 | 5,02 | 6,06 | 4,44 | 5,55 | 134,7 | 153,4 | 262,3 | — |
| 60 | sensibilités hautes | 5,64 | n.s. | n.s. | n.s. | n.s. | 135,6 | n.s. | n.s. | 2035 |
| 60 | central + TPI | 5,05 | 5,74 | n.s. | 4,81 | n.s. | 135,0 | 155,7 | n.s. | 2042 |
| 60 | central + multiplicateur 0,8 | 5,12 | 5,82 | n.s. | 4,87 | n.s. | 137,1 | 157,9 | n.s. | 2041 |
| 60 | tout bas (Bund 2,9 ; prime 0,8) | 3,81 | 3,90 | 4,36 | 3,26 | 3,81 | 130,3 | 140,1 | 187,3 | — |
| 60 | tout haut (Bund 3,9 ; prime 1,7) | 7,09 | n.s. | n.s. | n.s. | n.s. | 140,8 | n.s. | n.s. | 2032 |
| 100 | banc (3,45 % fixe) | 3,45 | 3,45 | 3,45 | 3,18 | 3,43 | 125,9 | 127,0 | 138,5 | — |
| 100 | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,70 | 4,23 | 4,49 | 130,4 | 139,4 | 186,4 | — |
| 100 | **endogène central** | 4,87 | 5,15 | n.s. | 4,47 | n.s. | 130,7 | 141,0 | n.s. | 2048 |
| 100 | sensibilités basses | 4,81 | 4,90 | 5,48 | 4,36 | 5,10 | 130,5 | 140,3 | 200,4 | — |
| 100 | sensibilités hautes | 5,15 | 6,20 | n.s. | 4,97 | n.s. | 131,2 | 144,0 | n.s. | 2039 |
| 100 | central + TPI | 4,87 | 5,15 | n.s. | 4,47 | n.s. | 130,7 | 141,0 | n.s. | 2048 |
| 100 | central + multiplicateur 0,8 | 4,99 | 5,26 | n.s. | 4,57 | n.s. | 134,2 | 144,5 | n.s. | 2047 |
| 100 | tout bas (Bund 2,9 ; prime 0,8) | 3,78 | 3,79 | 3,91 | 3,20 | 3,46 | 126,2 | 127,6 | 139,4 | — |
| 100 | tout haut (Bund 3,9 ; prime 1,7) | 6,57 | n.s. | n.s. | n.s. | n.s. | 136,2 | n.s. | n.s. | 2034 |
| 150 | banc (3,45 % fixe) | 3,45 | 3,45 | 3,45 | 3,18 | 3,43 | 120,9 | 111,9 | 87,7 | — |
| 150 | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,70 | 4,20 | 4,49 | 125,3 | 123,4 | 126,6 | — |
| 150 | **endogène central** | 4,66 | 4,56 | 4,57 | 4,12 | 4,36 | 125,5 | 123,3 | 123,1 | — |
| 150 | sensibilités basses | 4,78 | 4,76 | 4,80 | 4,26 | 4,58 | 125,4 | 123,9 | 129,1 | — |
| 150 | sensibilités hautes | 4,57 | 4,24 | 3,63 | 3,96 | 3,64 | 125,7 | 122,8 | 111,7 | — |
| 150 | central + TPI | 4,66 | 4,56 | 4,57 | 4,12 | 4,36 | 125,5 | 123,3 | 123,1 | — |
| 150 | central + multiplicateur 0,8 | 4,83 | 4,69 | 4,87 | 4,25 | 4,60 | 130,7 | 128,3 | 134,3 | — |
| 150 | tout bas (Bund 2,9 ; prime 0,8) | 3,75 | 3,65 | 3,37 | 3,11 | 3,05 | 121,2 | 112,1 | 83,4 | — |
| 150 | tout haut (Bund 3,9 ; prime 1,7) | 5,95 | 6,62 | n.s. | 5,78 | n.s. | 130,5 | 139,6 | n.s. | 2040 |

Macro prudente (croissance nominale 2,5 %), endogène central : 0 Md€ : n.s. % en 2038, n.s. % en 2058 (crise : 2036) ; 30 Md€ : 177,8 % en 2038, n.s. % en 2058 (crise : 2038) ; 60 Md€ : 166,1 % en 2038, n.s. % en 2058 (crise : 2040) ; 100 Md€ : 150,8 % en 2038, n.s. % en 2058 (crise : 2044) ; 150 Md€ : 132,4 % en 2038, 164,0 % en 2058 (crise : —).

**Effort qui stabilise la dette de 2038 à 2058** (plus petit effort constant, Md€ de 2025, pas de 1) : banc : 117 ; exogène : 154 ; endogène central : 150 ; sensibilités basses : 155 ; sensibilités hautes : 146 ; tout bas : 114 ; tout haut : 184.

**Lecture.** (1) **Le recalage seul coûte cher** : sans aucune boucle, passer de 3,45 % à 4,7 % ajoute environ 14 points de dette en 2038 au fil de l'eau et fait passer l'effort qui stabilise la dette de 117 à 154 Md€ par an. (2) **La boucle punit l'inaction et récompense l'effort** : au central, sans effort, la prime franchit 3 points vers 2037 ; avec 60 Md€, vers 2042 ; avec 100 Md€, vers 2048 ; avec 150 Md€ (≈ 5 points de PIB), jamais, et l'OAT redescend vers 4,6 % en 2038. (3) **Le niveau de départ compte autant que la pente** : « tout bas » (Bund 2,9 %, prime 0,8) ramène l'effort stabilisant à 114 Md€ ; « tout haut » le porte à 184 Md€. (4) Le TPI ne change rien dans ces trajectoires : il ne protège que les pays dont le déficit baisse ou est sous 3 %, et ceux-là n'ont pas besoin de lui dans le modèle. (5) Un multiplicateur de 0,8 ajoute 2 à 5 points de dette pendant la consolidation, sans changer le diagnostic.

## 2. Programmes du banc d'essai (médiane des tirages ; dette [centiles 10 ; 90] pour l'endogène central)

Mêmes tirages que le banc, mêmes mesures, rien n'est changé dans les programmes ; seule la chaîne dette diffère. Statique (sans relance), macro de référence.

| Programme | Variante | OAT 2032 | OAT 2038 | Taux apparent 2038 | Dette 2032 | Dette 2038 | Dette 2058 | Tirages en crise avant 2038 | avant 2058 |
|---|---|---|---|---|---|---|---|---|---|
| Fil de l'eau (droit actuel) | banc (3,45 % fixe) | 3,45 | 3,45 | 3,18 | 135,9 | 157,1 | 240,2 | 0 % | 0 % |
|  | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,28 | 140,6 | 171,3 | 306,1 | 0 % | 0 % |
|  | **endogène central** | 5,32 | n.s. | n.s. | 141,3 | n.s. | n.s. | 100 % | 100 % |
|  | sensibilités basses | 4,88 | 5,19 | 4,56 | 140,8 | 173,2 | n.s. | 0 % | 100 % |
|  | sensibilités hautes | 6,40 | n.s. | n.s. | 142,4 | n.s. | n.s. | 100 % | 100 % |
|  | central + TPI | 5,32 | n.s. | n.s. | 141,3 | n.s. | n.s. | 100 % | 100 % |
| La France insoumise (2027) | banc (3,45 % fixe) | 3,45 | 3,45 | 3,18 | 168,5 | 239,9 | 503,4 | 0 % | 0 % |
|  | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,35 | 174,2 | 259,7 | 617,5 | 0 % | 0 % |
|  | **endogène central** | 7,02 | n.s. | n.s. | 176,7 | n.s. | n.s. | 100 % | 100 % |
|  | sensibilités basses | 5,13 | 6,01 | 5,13 | 174,7 | 266,7 | n.s. | 0 % | 100 % |
|  | sensibilités hautes | n.s. | n.s. | n.s. | n.s. | n.s. | n.s. | 100 % | 100 % |
|  | central + TPI | 7,02 | n.s. | n.s. | 176,7 | n.s. | n.s. | 100 % | 100 % |
| Rassemblement national (2027) | banc (3,45 % fixe) | 3,45 | 3,45 | 3,18 | 141,9 | 169,7 | 276,3 | 0 % | 0 % |
|  | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,29 | 146,9 | 184,9 | 349,2 | 0 % | 0 % |
|  | **endogène central** | 5,60 | n.s. | n.s. | 148,0 | n.s. | n.s. | 98 % | 100 % |
|  | sensibilités basses | 4,93 | 5,32 | 4,66 | 147,2 | 187,6 | n.s. | 0 % | 100 % |
|  | sensibilités hautes | n.s. | n.s. | n.s. | n.s. | n.s. | n.s. | 100 % | 100 % |
|  | central + TPI | 5,60 | n.s. | n.s. | 148,0 | n.s. | n.s. | 98 % | 100 % |
| Notre système (Langagement politique) | banc (3,45 % fixe) | 3,45 | 3,45 | 3,18 | 128,2 | 130,6 | 121,9 | 0 % | 0 % |
|  | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,24 | 132,8 | 143,3 | 169,3 | 0 % | 0 % |
|  | **endogène central** | 4,97 | 5,30 | 4,61 | 133,2 | 145,9 [130,8 ; 161,3] | n.s. | 2 % | 67 % |
|  | sensibilités basses | 4,83 | 4,95 | 4,40 | 133,0 | 144,4 | 183,0 | 0 % | 3 % |
|  | sensibilités hautes | 5,41 | n.s. | n.s. | 133,8 | n.s. | n.s. | 61 % | 85 % |
|  | central + TPI | 4,97 | 5,30 | 4,61 | 133,2 | 145,9 | n.s. | 2 % | 67 % |
| Les Républicains (plan Retailleau, 2027) | banc (3,45 % fixe) | 3,45 | 3,45 | 3,18 | 133,2 | 149,7 | 215,8 | 0 % | 0 % |
|  | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,27 | 137,9 | 163,4 | 277,3 | 0 % | 0 % |
|  | **endogène central** | 5,20 | 6,35 | 5,14 | 138,5 | 168,9 [150,9 ; 183,3] | n.s. | 47 % | 100 % |
|  | sensibilités basses | 4,86 | 5,12 | 4,51 | 138,1 | 165,0 | n.s. | 0 % | 66 % |
|  | sensibilités hautes | 6,05 | n.s. | n.s. | 139,3 | n.s. | n.s. | 97 % | 100 % |
|  | central + TPI | 5,20 | 6,35 | 5,14 | 138,5 | 168,9 | n.s. | 47 % | 100 % |
| PS et Place publique (contre-budget 2027) | banc (3,45 % fixe) | 3,45 | 3,45 | 3,18 | 137,7 | 161,2 | 252,4 | 0 % | 0 % |
|  | exogène (4,7 % fixe) | 4,70 | 4,70 | 4,28 | 142,5 | 175,7 | 320,6 | 0 % | 0 % |
|  | **endogène central** | 5,41 | n.s. | n.s. | 143,3 | n.s. | n.s. | 100 % | 100 % |
|  | sensibilités basses | 4,90 | 5,23 | 4,59 | 142,7 | 177,9 | n.s. | 0 % | 100 % |
|  | sensibilités hautes | 6,65 | n.s. | n.s. | 144,6 | n.s. | n.s. | 100 % | 100 % |
|  | central + TPI | 5,41 | n.s. | n.s. | 143,3 | n.s. | n.s. | 100 % | 100 % |

**Effort supplémentaire qui stabilise la dette de 2038 à 2058**, ajouté à la série moyenne des tirages de chaque programme (Md€ de 2025 par an, montée 2028-2032 ; 0 = le programme stabilise déjà ; pas de 1) :

| Programme | banc (3,45 %) | exogène (4,7 %) | endogène central | sensibilités basses | sensibilités hautes |
|---|---|---|---|---|---|
| Fil de l'eau (droit actuel) | 117 | 154 | 150 | 155 | 146 |
| La France insoumise (2027) | 368 | > 400 | > 400 | > 400 | > 400 |
| Rassemblement national (2027) | 147 | 186 | 184 | 188 | 183 |
| Notre système (Langagement politique) | 0 | 37 | 40 | 41 | 44 |
| Les Républicains (plan Retailleau, 2027) | 90 | 127 | 123 | 129 | 118 |
| PS et Place publique (contre-budget 2027) | 128 | 165 | 162 | 167 | 159 |

Contrôle : la variante « banc » redonne les médianes publiées par le banc (dette 2038 et 2058, § 1 de `modeles/banc-programmes/resultats.md`) : fil_de_l_eau 157,1 / 240,2 % (banc : 157,1 / 240,2 %) ; lfi 239,9 / 503,4 % (banc : 239,9 / 503,4 %) ; rn 169,7 / 276,3 % (banc : 169,7 / 276,3 %) ; langagement 130,6 / 121,9 % (banc : 130,6 / 121,9 %) ; lr 149,7 / 215,8 % (banc : 149,7 / 215,8 %) ; ps 161,2 / 252,4 % (banc : 161,2 / 252,4 %)

## 3. Contrôle de plausibilité du départ

Intérêts des administrations publiques, modèle endogène central : 74 Md€ en 2026 et 91 Md€ en 2027 (2,40 % et 2,88 % du PIB) ; chaîne du banc : 72 et 82 Md€. Avis du HCFP n° 2026-5 (PLF 2027, § 115) : 79,2 Md€ en 2026 et 91 Md€ en 2027 (2,9 % du PIB). Le taux à 3,45 % sous-estimait déjà la charge de 2027 ; le recalage la rapproche du chiffre officiel. Écart résiduel attendu : le modèle part du solde primaire de 2024 (déficit de 5,9 % en 2026 contre 5,4 % visé) et ne suit pas le calendrier réel des tombées.
