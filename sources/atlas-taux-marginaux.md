---
titre: Atlas des taux marginaux effectifs : 14 cas types, 3 zones de logement, barèmes 2026 (OpenFisca-France)
statut: brouillon
date: 2026-11-04
---

# Atlas des taux marginaux effectifs d'imposition

Tâche T55. Extension de `sources/rules-as-code-taux-marginaux.md` (4 cas types, zone 2) : 14 cas types et 3 zones de logement, soit 40 simulations de 110 points (salaire brut mensuel de 0 à 3 SMIC, pas de 50 €). Fait établi : ce qui sort du code OpenFisca-France. Estimation : tout ce qui touche à la réalité. Rien n'est publié (dépôt privé).

## 0. Mesure du 04/11/2026 : effet du bogue d'ordre d'évaluation d'OpenFisca sur l'atlas (V12080-V12099)

Contexte : un bogue d'OpenFisca-France est confirmé (document de travail de l'atelier, non publié) : une quasi-boucle dans le temps (RSA, AAH, aide au logement, RSA du mois précédent) est coupée par `max_spiral_loops = 1`, et des valeurs fausses restent en cache selon l'ordre dans lequel on lit les variables. Question : l'atlas du 03/11 (qui tournait avec la valeur par défaut) est-il touché ? Les 40 simulations ont été rejouées à l'identique et avec trois variantes (`outils/droit/openfisca/atlas_spirale.py`, résultats dans `$DONNEES/resultats/droit/openfisca/atlas/spirale-2026-11-04/`, ancien dossier intact).

| Variante | Pas > 70 % | Pas > 100 % | Pas où le revenu disponible baisse (salaire net en hausse) | Simulations > 100 % | Lignes (sur 4 400) où l'aide au logement diffère de l'atlas du 03/11 |
|---|---|---|---|---|---|
| (a) identique à l'atlas (défaut, `rsa` lu en premier) | 392 | 135 | 144 (138) | 34 | 0 : reproduit au centime |
| (b) `max_spiral_loops = 3` | **380** | 135 | 144 (138) | 34 | 39 (12 simulations), jusqu'à 54 € par mois |
| (b') `max_spiral_loops = 6` | 380 | 135 | 144 (138) | 34 | 39 : identique à (b) |
| (c) défaut, ordre de lecture des composantes inversé | 289 | 85 | 94 (88) | 34 | 3 816 (39 simulations sur 40), jusqu'à 570 € par mois ; prime d'activité différente sur 1 014 lignes, jusqu'à 175 € |
| (d) `max_spiral_loops = 3`, ordre inversé | 380 | 135 | 144 (138) | 34 | 39 (comme b), mais la prime d'activité diffère encore de 5,2 € au plus sur 858 lignes |
| (e) `max_spiral_loops = 6`, ordre inversé | 380 | 135 | 144 (138) | 34 | 39 : identique à (b) et à (b'), au centime |

(Le comptage « 129 pas » du texte du 03/11 correspond aux baisses de plus de 0,50 € avec un salaire net en hausse ; sans seuil, il y en a 138, ou 144 avec les pas où le net n'augmente pas. Le seuil est maintenant dit.)

**Lecture.** (1) Le bogue est réel et massif quand on lit les variables dans un autre ordre (c) : l'atlas sort alors avec 85 pas à plus de 100 % au lieu de 135 et une AAH sans plage à plus de 100 % (1 pas au lieu de 14 à 18). (2) L'atlas du 03/11, lui, était **presque épargné par chance** : son ordre de lecture (`rsa` d'abord) donne les mêmes valeurs que les variantes stables, sauf sur **39 lignes**, toutes pour l'aide au logement, dans 12 simulations (célibataire locataire, couple monoactif sans enfant, avec 2 et 3 enfants, dans les trois zones), juste avant la sortie du RSA. (3) Les valeurs de (b), (b') et (e) sont identiques : c'est la référence corrigée, indépendante de l'ordre ; seule (d) laisse un résidu de prime d'activité (5,2 € au plus), signe que `max_spiral_loops = 3` ne suffit pas dans tous les ordres sur un atlas complet (le calcul avec 6 boucles doit relever la limite de récursion de Python pour la variante défaut, `sys.setrecursionlimit`).

**Ce qui tient** (inchangé, vérifié ligne par ligne) : 4 360 pas ; **135 pas à plus de 100 %** (3,1 %) ; **34 simulations sur 40** avec au moins un pas à plus de 100 % (mêmes simulations : seuls le couple biactif sans enfant et l'étudiant boursier échappent) ; **144 pas à revenu disponible décroissant**, dans les mêmes 34 simulations ; **plages de l'AAH** (70 % ou plus de 650 à 2 650 € ; plus de 100 % jusqu'à 1 550, 1 400 et 1 350 € en zones 1, 2 et 3) et **du minimum vieillesse** (100 % et plus de 450 à 1 050 € de pension) : identiques au pas près ; tous les chiffres du complément familial, de l'allocation de rentrée scolaire, de la prime de Noël des familles monoparentales et de la majoration pour la vie autonome.

**Ce qui tombe ou change** :
- **392 pas à plus de 70 % devient 380** (9 % devient 8,7 %) : 12 pas disparaissent, ceux où l'aide au logement baissait à tort *avant* la sortie du RSA (célibataire locataire de 600 à 700 € de brut : de 53 à 73 % à 40 % ; couple monoactif sans enfant de 850 à 1 000 € : de 48-74 % à 16-40 % ; couple monoactif à 2 enfants de 1 050 à 1 250 € : de 33-50 % à 16 %).
- **La sortie du RSA est plus raide que l'atlas ne le disait.** L'aide au logement reste à son maximum tant que le RSA est versé (la loi exécutable donne la même forme : 308 € pour 554 € de net quand la situation est « RSA », contre 284 € sinon) et tombe au pas de la sortie. Les maxima passent de **142 % à 218 %** (célibataire locataire, zone 2), de **152 % à 273 %** (couple monoactif sans enfant) et de **182 % à 314 %** (couple monoactif à 2 enfants) ; en zone 1, 144 % devient 222 %, 154 % devient 278 % et 182 % devient 319 % ; la prime de Noël du couple monoactif à 3 enfants passe de 156 % à 173 %. La cause principale de ces pas n'est plus le RSA mais l'aide au logement. Les pertes sur le pas passent de 17 à 47 € (célibataire), de 20 à 68 € (couple sans enfant) et de 32 à 85 € (couple à 2 enfants).
- **La moyenne lissée change de signe de lecture.** Le §4 bis D disait que le couple monoactif à 2 enfants a « 88 % » de taux moyen de 1 200 à 1 400 € de brut (« intensité exagérée par le pas ») ; avec l'atlas corrigé, ce taux moyen est de **114 %** (net) : le revenu disponible baisse quand on passe de 1 200 à 1 400 € de brut. La mise en garde sur le pas de 50 € reste vraie, la conclusion « du niveau des 70-90 % » tombe.
- Tableau 4 : le RSA (19 pas à plus de 70 %, 4 à plus de 100 %) et les aides au logement (16 pas, 9 à plus de 100 %) échangent leur place (avant : RSA 40 pas et 13 à plus de 100 % ; aides au logement 7 pas et 0 à plus de 100 %).
- Les tableaux 1 à 4 et la ligne « 392 » de §1 ont été remplacés par les valeurs corrigées (variante b, identique à b' et e).

**Recoupement avec la loi exécutable du dépôt** (`outils/droit/openfisca/recoupe_atlas_loi_executable.py`, sortie `recoupe_loi_executable.txt`). Cinq pas à plus de 100 % de l'atlas corrigé, à la sortie du RSA, recalculés avec `rsa_prime_activite.py` et `aides_logement.py` (revenu disponible partiel : salaire net, RSA, prime d'activité, aide au logement, prestations familiales, prime de Noël d'OpenFisca) :

| Pas (zone 2) | Atlas corrigé | Loi exécutable (aide au logement de la loi) | Même calcul avec l'aide au logement d'OpenFisca | Verdict |
|---|---|---|---|---|
| Célibataire logé gratuitement, 700 à 750 € | 104 % | 102 % | 102 % | réel (RSA et prime de Noël) |
| Célibataire locataire, 700 à 750 € | 218 % | 203 % | 216 % | réel : aide au logement 308 à 268 € |
| Parent isolé, 1 enfant, 850 à 900 € | 131 % | 88 % si l'allocation de rentrée scolaire n'est pas comptée dans les ressources, 115 % si elle l'est | 88 % ou 115 % | réel seulement si la rentrée scolaire compte dans les ressources du RSA, comme le fait OpenFisca (non tranché sur R262-11, V12088) |
| Couple monoactif, 0 enfant, 1 000 à 1 050 € | 273 % | 235 % | 271 % | réel |
| Couple monoactif, 2 enfants, 1 250 à 1 300 € | 314 % | 283 % | 311 % | réel |

Quatre pas sur cinq sont confirmés par l'autre implémentation (écarts de 2 à 38 points, dus à l'aide au logement : la loi exécutable donne 268, 322 et 443 € après la sortie, OpenFisca 260, 305 et 428 € ; écarts déjà documentés entre les deux codes) ; le cinquième dépend d'une lecture du texte restée ouverte. La forme (aide au logement maintenue tant que le RSA est perçu, puis perdue d'un coup) vient donc du droit codé, pas seulement du bogue. Limite : la loi exécutable traite la situation « RSA » par une base forfaitaire (R822-13 et suivants) ; je n'ai pas relu cet article pour ce recoupement (V12089).

**Ce que cela vaut pour le manifeste.** Le chiffre « 135 pas à plus de 100 % » et les « 34 simulations sur 40 » tiennent. À citer avec précision : la sortie du RSA d'un foyer locataire coûte de 2 à 3 fois le gain de salaire sur un pas de 50 € (218 à 319 %), et un taux moyen de 114 % sur 200 € de brut pour le couple à 2 enfants. Ce sont des résultats de cas types sous OpenFisca-France 176.1.10 avec `max_spiral_loops = 3` ou 6, à ne pas présenter comme mesure de population.

## 1. Ce que l'atlas dit (en dix lignes)

- Sur 4 360 pas de 50 € (40 simulations), **380 (8,7 %) ont un taux marginal net supérieur à 70 %** (392 avant la correction du 04/11, voir §0) et **135 (3,1 %) un taux supérieur à 100 %** : et dans 129 pas le revenu disponible baisse alors que le salaire net monte.
- **34 simulations sur 40 ont au moins un pas à plus de 100 %.** Les seules exceptions : le couple biactif sans enfant (TMEP max 62 %) et l'étudiant boursier (64 %), dans les trois zones.
- Les plus hauts taux ne sont pas dans l'impôt sur le revenu mais dans les prestations à seuil (et, à la sortie du RSA, dans l'aide au logement qui tombe d'un coup : 218 à 319 % pour les locataires, §0) : **complément familial** (99 € par mois d'un coup, 273 % à 314 % pour trois enfants), **allocation de rentrée scolaire** (jusqu'à 133 %), **prime de Noël** (150 à 380 € par an perdus à la sortie du RSA : jusqu'à 173 %), **majoration pour la vie autonome** de l'AAH (285 % au premier euro de salaire).
- Les plages longues à plus de 70 % sont celles des minima à reprise lente : **AAH** (70 à 111 % de 650 à 2 650 €), **minimum vieillesse** (100 % à 138 % de 0 à 1 050 € de pension, revenu disponible qui baisse quand la pension monte) et, plus courtes, le RSA et la prime d'activité vers 0,4 à 0,5 SMIC.
- L'étudiant boursier a un taux **négatif** (-12 % en moyenne de 0 à 1 SMIC) : la prime d'activité s'ouvre d'un coup à 1 450 € de brut (+206 €).
- Le résultat de loyer (3 zones) change peu les taux : les plages à plus de 100 % sont identiques d'une zone à l'autre, sauf pour l'AAH (plage de 700 à 1 550 € en zone 1, 1 400 en zone 2, 1 350 en zone 3).
- La demande annonçait 12 cas types ; la liste en contient 14 (2 + 3 + 6 + 3), tous sont traités (⚠️ V4388).

## 2. Méthode et reproduction

- **Moteur** : OpenFisca-France 176.1.10, OpenFisca-Core 44.7.1, Python 3.9.6 (venv autorisé par l'auteur le 02/11/2026, voir `sources/rules-as-code-taux-marginaux.md`). **Depuis le 04/11/2026, `max_spiral_loops = 3`** (le 03/11 : valeur par défaut, 1), pour éviter la dépendance à l'ordre d'évaluation (§0). Barèmes 2026 ; barème de l'impôt : revenus 2025 appliqué tel quel (⚠️ V4105). SMIC mensuel brut : 12,02 × 151,67 = 1 823,07 €. Régime permanent : même salaire sur 2024, 2025 et 2026.
- **Cas types** (hypothèses de notre fabrication, ⚠️ V4385, V4386, V4387) :

| Clé | Cas | Particularités |
|---|---|---|
| celib_gratuit | Célibataire salarié logé gratuitement (sans logement aidé) | zone sans objet, un seul exemplaire |
| celib_locataire | Célibataire salarié locataire (avec logement aidé) | loyer 650 / 500 / 430 € (zones 1 / 2 / 3) |
| isole_1, isole_2, isole_3 | Parent isolé, 1, 2, 3 enfants | enfants : 12 ans (collège) ; 8 et 12 ans ; 4, 8 et 12 ans ; loyer majoré selon la taille du foyer (×1,2 ; ×1,35 ; ×1,5) |
| couple_monoactif_0/2/3 | Couple, un seul salarié (le conjoint est inactif), 0, 2, 3 enfants | mêmes enfants que ci-dessus |
| couple_biactif_0/2/3 | Couple dont le conjoint travaille à 1 SMIC (fixe), 0, 2, 3 enfants | l'axe est le salaire du premier adulte |
| etudiant_boursier | Étudiant de 21 ans, hors foyer parental, locataire, boursier sur critères sociaux | ressources parentales fixées à 22 000 € ; l'axe est son salaire |
| retraite_aspa | Retraité seul de 72 ans, locataire, au minimum vieillesse | l'axe est la **pension brute**, de 0 à 5 469 € |
| aah | Personne seule en AAH (80 % d'incapacité), salariée, locataire | l'axe est le salaire brut |

- **Zones de logement** : `zone_apl` 1, 2 et 3 (la version précédente n'avait que la zone 2). Loyer d'une personne seule : 650, 500 et 430 € ; majoré selon la taille du foyer ; hors charges.
- **Revenu disponible** : défini composante par composante comme dans OpenFisca (`revenu_disponible` = revenus nets du travail + pensions nettes + prestations sociales nettes de CRDS + impôt sur le revenu + taxe d'habitation), **plus les bourses** (collège, lycée, enseignement supérieur), absentes de la définition d'OpenFisca. Détail : `outils/droit/openfisca/taux_marginaux.py`.
- **Taux marginal effectif (TMEP)** entre deux pas : 1 - Δ(revenu disponible) / Δ(revenu net de l'axe). TMEP net : base le salaire net (ou la pension nette) ; TMEP brut : base le brut, cotisations salariales comprises (colonne `tmep_brut`). Cotisations patronales et TVA hors périmètre.
- **Attention au pas de 50 €** : un pic est une moyenne sur le pas (un pas = ~40 € de net) ; une aide qui perd 25 € donne déjà ~64 %. La **cause principale** d'un pas est la composante qui perd le plus (ou l'impôt qui monte le plus) ; quand plusieurs aides baissent ensemble (AAH, prime d'activité, aide au logement), la cause affichée est la plus forte et n'est pas la seule.

### Correction de l'écart non expliqué (V4103)

La version précédente sommait le salaire net, le RSA, la prime d'activité, l'aide au logement, des prestations familiales **brutes de CRDS**, et soustrayait l'impôt. L'écart de 13 à 32 € par mois avec `revenu_disponible` avait deux causes, trouvées en lisant la formule d'OpenFisca :
1. **la prime de Noël** (`aefa`, de 152 à 381 € par an selon la composition) était absente de notre somme : c'est l'essentiel de l'écart pour les foyers au RSA (26,7 € par mois pour un couple avec 2 enfants) ;
2. **la CRDS** : OpenFisca somme les prestations nettes de CRDS (`af_nettes_crds`, `ppa_nette_crds`, `ars_nette_crds`...), nous sommions les montants bruts (≈ 0,5 %, 2 à 4 € par mois).
Après correction, le **résidu** (`revenu_disponible` d'OpenFisca moins notre somme) est **inférieur à 0,001 € par mois sur les 4 400 lignes**. Conséquence : les taux du document précédent étaient sous-estimés à la sortie du RSA, car la perte de la prime de Noël n'était pas comptée (le célibataire logé gratuitement passe de 72 % à 104 %, le couple monoactif à 2 enfants de 114 % à 182 % à la sortie du RSA ; ce dernier chiffre est lui-même porté à 314 % par la correction du 04/11, §0) ; voir la note datée dans `sources/rules-as-code-taux-marginaux.md`.

Reproduire (venv OpenFisca) ; les tableaux de ce document sont ceux de la variante `loops3` (la commande `taux_marginaux.py` seule redonne l'atlas du 03/11, défaut `max_spiral_loops = 1`) :
```
cd /tmp
VENV/bin/python -I ~/Documents/langagement-politique/outils/droit/openfisca/atlas_spirale.py loops3 $DONNEES/resultats/droit/openfisca/atlas/spirale-2026-11-04/atlas_loops3.csv
VENV/bin/python -I ~/Documents/langagement-politique/outils/droit/openfisca/compare_spirale.py $DONNEES/resultats/droit/openfisca/atlas/spirale-2026-11-04 $DONNEES/resultats/droit/openfisca/atlas/atlas_taux_marginaux.csv
# atlas du 03/11 (valeur par défaut) :
VENV/bin/python -I ~/Documents/langagement-politique/outils/droit/openfisca/taux_marginaux.py 2026 $DONNEES/resultats/droit/openfisca/atlas/atlas_taux_marginaux.csv
VENV/bin/python -I ~/Documents/langagement-politique/outils/droit/openfisca/analyse_atlas.py $DONNEES/resultats/droit/openfisca/atlas/atlas_taux_marginaux.csv $DONNEES/resultats/droit/openfisca/atlas
```
Durée : quelques minutes (40 simulations de ~2 s). Sorties dans `$DONNEES/resultats/droit/openfisca/atlas/` : `atlas_taux_marginaux.csv` (4 400 lignes, 40 simulations), `atlas_intervalles.csv` (TMEP et perte par composante, par pas), `atlas_zones.csv` (185 plages à plus de 70 % ou 100 %), `atlas_synthese.csv`, `atlas_causes.csv`, `atlas_tableaux.md`, un PNG par type de cas (`atlas_isole_2.png`...) avec les trois zones superposées et la décomposition des aides en zone 2, et `atlas_synthese.png` (carte de chaleur des 40 simulations).

## 3. Résultats (barèmes 2026)

### Tableau 1. Synthèse par cas type et zone (TMEP net ; « pas » = 109 pas de 50 €)

| Cas type | Zone | Loyer (EUR) | TMEP net max (à quel brut) | Pas > 70 % | Pas > 100 % | TMEP moyen 0-1 SMIC | TMEP moyen 1-1,5 SMIC | Baisse max du revenu disponible sur un pas (EUR/mois) |
|---|---|---|---|---|---|---|---|---|
| Célibataire locataire (avec logement aidé) | 1 | 650 | 222 % (750 EUR) | 4 / 109 (4 %) | 1 (1 %) | 49 % | 45 % | -48 |
| Parent isolé, 1 enfant | 1 | 780 | 131 % (900 EUR) | 6 / 109 (6 %) | 1 (1 %) | 48 % | 53 % | -12 |
| Parent isolé, 2 enfants | 1 | 880 | 139 % (800 EUR) | 7 / 109 (6 %) | 2 (2 %) | 46 % | 58 % | -15 |
| Parent isolé, 3 enfants | 1 | 980 | 274 % (3100 EUR) | 6 / 109 (6 %) | 3 (3 %) | 41 % | 27 % | -69 |
| Couple monoactif, 0 enfant | 1 | 780 | 278 % (1050 EUR) | 1 / 109 (1 %) | 1 (1 %) | 49 % | 35 % | -70 |
| Couple biactif, 0 enfant | 1 | 780 | 62 % (2300 EUR) | 0 / 109 (0 %) | 0 (0 %) | 28 % | 37 % | 0 |
| Couple monoactif, 2 enfants | 1 | 980 | 319 % (1300 EUR) | 9 / 109 (8 %) | 2 (2 %) | 47 % | 60 % | -87 |
| Couple biactif, 2 enfants | 1 | 980 | 133 % (2300 EUR) | 13 / 109 (12 %) | 2 (2 %) | 40 % | 45 % | -13 |
| Couple monoactif, 3 enfants | 1 | 1070 | 313 % (2550 EUR) | 18 / 109 (17 %) | 2 (2 %) | 46 % | 75 % | -84 |
| Couple biactif, 3 enfants | 1 | 1070 | 279 % (1300 EUR) | 19 / 109 (17 %) | 3 (3 %) | 54 % | 33 % | -71 |
| Étudiant boursier | 1 | 650 | 64 % (2300 EUR) | 0 / 109 (0 %) | 0 (0 %) | -12 % | 36 % | 0 |
| Retraité au minimum vieillesse (axe : pension brute) | 1 | 650 | 140 % (800 EUR) | 21 / 109 (19 %) | 13 (12 %) | 75 % | 15 % | -22 |
| Personne en AAH (axe : salaire brut) | 1 | 650 | 285 % (50 EUR) | 41 / 109 (38 %) | 18 (17 %) | 68 % | 85 % | -73 |
| Célibataire logé gratuitement (sans logement aidé) | 2 | 0 | 104 % (750 EUR) | 1 / 109 (1 %) | 1 (1 %) | 29 % | 36 % | -1 |
| Célibataire locataire (avec logement aidé) | 2 | 500 | 218 % (750 EUR) | 4 / 109 (4 %) | 1 (1 %) | 46 % | 45 % | -47 |
| Parent isolé, 1 enfant | 2 | 600 | 131 % (900 EUR) | 6 / 109 (6 %) | 1 (1 %) | 48 % | 47 % | -12 |
| Parent isolé, 2 enfants | 2 | 680 | 139 % (800 EUR) | 5 / 109 (5 %) | 2 (2 %) | 46 % | 53 % | -15 |
| Parent isolé, 3 enfants | 2 | 750 | 273 % (3100 EUR) | 6 / 109 (6 %) | 3 (3 %) | 41 % | 26 % | -68 |
| Couple monoactif, 0 enfant | 2 | 600 | 273 % (1050 EUR) | 1 / 109 (1 %) | 1 (1 %) | 46 % | 35 % | -68 |
| Couple biactif, 0 enfant | 2 | 600 | 62 % (2300 EUR) | 0 / 109 (0 %) | 0 (0 %) | 28 % | 37 % | 0 |
| Couple monoactif, 2 enfants | 2 | 750 | 314 % (1300 EUR) | 7 / 109 (6 %) | 2 (2 %) | 47 % | 53 % | -85 |
| Couple biactif, 2 enfants | 2 | 750 | 133 % (2300 EUR) | 9 / 109 (8 %) | 2 (2 %) | 36 % | 45 % | -13 |
| Couple monoactif, 3 enfants | 2 | 820 | 314 % (2550 EUR) | 10 / 109 (9 %) | 2 (2 %) | 45 % | 74 % | -85 |
| Couple biactif, 3 enfants | 2 | 820 | 265 % (1300 EUR) | 8 / 109 (7 %) | 3 (3 %) | 50 % | 33 % | -65 |
| Étudiant boursier | 2 | 500 | 64 % (2300 EUR) | 0 / 109 (0 %) | 0 (0 %) | -12 % | 36 % | 0 |
| Retraité au minimum vieillesse (axe : pension brute) | 2 | 500 | 138 % (800 EUR) | 21 / 109 (19 %) | 13 (12 %) | 75 % | 15 % | -19 |
| Personne en AAH (axe : salaire brut) | 2 | 500 | 285 % (50 EUR) | 41 / 109 (38 %) | 15 (14 %) | 65 % | 85 % | -73 |
| Célibataire locataire (avec logement aidé) | 3 | 430 | 217 % (750 EUR) | 3 / 109 (3 %) | 1 (1 %) | 44 % | 45 % | -46 |
| Parent isolé, 1 enfant | 3 | 520 | 131 % (900 EUR) | 5 / 109 (5 %) | 1 (1 %) | 47 % | 43 % | -12 |
| Parent isolé, 2 enfants | 3 | 580 | 139 % (800 EUR) | 4 / 109 (4 %) | 2 (2 %) | 46 % | 49 % | -15 |
| Parent isolé, 3 enfants | 3 | 640 | 273 % (3100 EUR) | 6 / 109 (6 %) | 3 (3 %) | 40 % | 25 % | -68 |
| Couple monoactif, 0 enfant | 3 | 520 | 273 % (1050 EUR) | 1 / 109 (1 %) | 1 (1 %) | 44 % | 35 % | -68 |
| Couple biactif, 0 enfant | 3 | 520 | 62 % (2300 EUR) | 0 / 109 (0 %) | 0 (0 %) | 28 % | 37 % | 0 |
| Couple monoactif, 2 enfants | 3 | 640 | 310 % (1300 EUR) | 6 / 109 (6 %) | 2 (2 %) | 47 % | 49 % | -83 |
| Couple biactif, 2 enfants | 3 | 640 | 133 % (2300 EUR) | 7 / 109 (6 %) | 2 (2 %) | 34 % | 45 % | -13 |
| Couple monoactif, 3 enfants | 3 | 710 | 313 % (2550 EUR) | 11 / 109 (10 %) | 2 (2 %) | 45 % | 74 % | -84 |
| Couple biactif, 3 enfants | 3 | 710 | 265 % (1300 EUR) | 11 / 109 (10 %) | 3 (3 %) | 48 % | 33 % | -65 |
| Étudiant boursier | 3 | 430 | 64 % (2300 EUR) | 0 / 109 (0 %) | 0 (0 %) | -12 % | 36 % | 0 |
| Retraité au minimum vieillesse (axe : pension brute) | 3 | 430 | 137 % (650 EUR) | 21 / 109 (19 %) | 13 (12 %) | 74 % | 15 % | -18 |
| Personne en AAH (axe : salaire brut) | 3 | 430 | 285 % (50 EUR) | 41 / 109 (38 %) | 14 (13 %) | 64 % | 85 % | -73 |

### Tableau 2. Zones à plus de 100 % (zone 2 ; zones 1 et 3 aux mêmes positions sauf l'AAH, voir §1 ; maxima des trois zones dans le tableau 1 ; valeurs corrigées le 04/11, §0)

| Cas | Zone | Brut de... à... | TMEP max | Cause(s) |
|---|---|---|---|---|
| Célibataire logé gratuitement (sans logement aidé) | 2 | 700 à 750 | 104 % | RSA x1 |
| Célibataire locataire (avec logement aidé) | 2 | 700 à 750 | 218 % | aides au logement x1 |
| Parent isolé, 1 enfant | 2 | 850 à 900 | 131 % | RSA x1 |
| Parent isolé, 2 enfants | 2 | 750 à 800 | 139 % | prime de Noël x1 |
| Parent isolé, 2 enfants | 2 | 4050 à 4100 | 108 % | allocation de rentrée scolaire x1 |
| Parent isolé, 3 enfants | 2 | 450 à 500 | 141 % | prime de Noël x1 |
| Parent isolé, 3 enfants | 2 | 3050 à 3100 | 273 % | complément familial x1 |
| Parent isolé, 3 enfants | 2 | 4800 à 4850 | 107 % | allocation de rentrée scolaire x1 |
| Couple monoactif, 0 enfant | 2 | 1000 à 1050 | 273 % | aides au logement x1 |
| Couple monoactif, 2 enfants | 2 | 1250 à 1300 | 314 % | aides au logement x1 |
| Couple monoactif, 2 enfants | 2 | 4050 à 4100 | 133 % | allocation de rentrée scolaire x1 |
| Couple biactif, 2 enfants | 2 | 2200 à 2300 | 133 % | allocation de rentrée scolaire x2 |
| Couple monoactif, 3 enfants | 2 | 1100 à 1150 | 173 % | prime de Noël x1 |
| Couple monoactif, 3 enfants | 2 | 2500 à 2550 | 314 % | complément familial x1 |
| Couple biactif, 3 enfants | 2 | 1250 à 1300 | 265 % | complément familial x1 |
| Couple biactif, 3 enfants | 2 | 4500 à 4600 | 118 % | complément familial x2 |
| Retraité au minimum vieillesse (axe : pension brute) | 2 | 0 à 50 | 100 % | minimum vieillesse (ASPA) x1 |
| Retraité au minimum vieillesse (axe : pension brute) | 2 | 450 à 1050 | 138 % | minimum vieillesse (ASPA) x12 |
| Personne en AAH (axe : salaire brut) | 2 | 0 à 50 | 285 % | complément d'AAH / majoration vie autonome x1 |
| Personne en AAH (axe : salaire brut) | 2 | 700 à 1400 | 111 % | AAH x14 |

### Tableau 3. Zones à plus de 70 % (zone 2 ; les plages des zones 1 et 3 diffèrent de quelques pas)

| Cas | Zone | Brut de... à... | TMEP max | Cause(s) |
|---|---|---|---|---|
| Célibataire logé gratuitement (sans logement aidé) | 2 | 700 à 750 | 104 % | RSA x1 |
| Célibataire locataire (avec logement aidé) | 2 | 700 à 900 | 218 % | prime d'activité x3; aides au logement x1 |
| Parent isolé, 1 enfant | 2 | 400 à 450 | 80 % | RSA x1 |
| Parent isolé, 1 enfant | 2 | 850 à 900 | 131 % | RSA x1 |
| Parent isolé, 1 enfant | 2 | 1100 à 1150 | 91 % | bourses x1 |
| Parent isolé, 1 enfant | 2 | 2000 à 2050 | 75 % | aides au logement x1 |
| Parent isolé, 1 enfant | 2 | 3250 à 3350 | 98 % | allocation de rentrée scolaire x2 |
| Parent isolé, 2 enfants | 2 | 450 à 500 | 80 % | RSA x1 |
| Parent isolé, 2 enfants | 2 | 750 à 800 | 139 % | prime de Noël x1 |
| Parent isolé, 2 enfants | 2 | 1350 à 1400 | 88 % | bourses x1 |
| Parent isolé, 2 enfants | 2 | 2200 à 2250 | 73 % | prime d'activité x1 |
| Parent isolé, 2 enfants | 2 | 4050 à 4100 | 108 % | allocation de rentrée scolaire x1 |
| Parent isolé, 3 enfants | 2 | 400 à 500 | 141 % | RSA x1; prime de Noël x1 |
| Parent isolé, 3 enfants | 2 | 550 à 600 | 80 % | prime d'activité x1 |
| Parent isolé, 3 enfants | 2 | 1600 à 1650 | 75 % | bourses x1 |
| Parent isolé, 3 enfants | 2 | 3050 à 3100 | 273 % | complément familial x1 |
| Parent isolé, 3 enfants | 2 | 4800 à 4850 | 107 % | allocation de rentrée scolaire x1 |
| Couple monoactif, 0 enfant | 2 | 1000 à 1050 | 273 % | aides au logement x1 |
| Couple monoactif, 2 enfants | 2 | 450 à 500 | 80 % | RSA x1 |
| Couple monoactif, 2 enfants | 2 | 1250 à 1300 | 314 % | aides au logement x1 |
| Couple monoactif, 2 enfants | 2 | 1350 à 1400 | 88 % | bourses x1 |
| Couple monoactif, 2 enfants | 2 | 2200 à 2250 | 73 % | prime d'activité x1 |
| Couple monoactif, 2 enfants | 2 | 4000 à 4150 | 133 % | allocation de rentrée scolaire x3 |
| Couple biactif, 2 enfants | 2 | 50 à 200 | 75 % | prime d'activité x3 |
| Couple biactif, 2 enfants | 2 | 250 à 450 | 75 % | prime d'activité x4 |
| Couple biactif, 2 enfants | 2 | 2200 à 2300 | 133 % | allocation de rentrée scolaire x2 |
| Couple monoactif, 3 enfants | 2 | 550 à 600 | 80 % | RSA x1 |
| Couple monoactif, 3 enfants | 2 | 1100 à 1150 | 173 % | prime de Noël x1 |
| Couple monoactif, 3 enfants | 2 | 1600 à 1650 | 90 % | bourses x1 |
| Couple monoactif, 3 enfants | 2 | 2500 à 2550 | 314 % | complément familial x1 |
| Couple monoactif, 3 enfants | 2 | 4800 à 4850 | 93 % | allocation de rentrée scolaire x1 |
| Couple monoactif, 3 enfants | 2 | 5050 à 5300 | 93 % | complément familial x5 |
| Couple biactif, 3 enfants | 2 | 1250 à 1300 | 265 % | complément familial x1 |
| Couple biactif, 3 enfants | 2 | 2950 à 3050 | 93 % | allocation de rentrée scolaire x2 |
| Couple biactif, 3 enfants | 2 | 4350 à 4600 | 118 % | complément familial x5 |
| Retraité au minimum vieillesse (axe : pension brute) | 2 | 0 à 1050 | 138 % | minimum vieillesse (ASPA) x21 |
| Personne en AAH (axe : salaire brut) | 2 | 0 à 50 | 285 % | complément d'AAH / majoration vie autonome x1 |
| Personne en AAH (axe : salaire brut) | 2 | 650 à 2650 | 111 % | AAH x39; aides au logement x1 |

### Tableau 4. Causes par variable (pas à plus de 70 %, 40 simulations)

| Variable | Pas > 70 % dont elle est la cause principale | Part | dont pas > 100 % | Perte moyenne sur le pas (EUR/mois) |
|---|---|---|---|---|
| AAH | 117 | 31 % | 44 | 24 |
| minimum vieillesse (ASPA) | 63 | 17 % | 39 | 50 |
| prime d'activité | 63 | 17 % | 0 | 16 |
| complément familial | 39 | 10 % | 15 | 51 |
| allocation de rentrée scolaire | 36 | 9 % | 15 | 30 |
| RSA | 19 | 5 % | 4 | 38 |
| aides au logement | 16 | 4 % | 9 | 39 |
| bourses | 15 | 4 % | 0 | 18 |
| prime de Noël | 9 | 2 % | 9 | 28 |
| complément d'AAH / majoration vie autonome | 3 | 1 % | 3 | 105 |

Lecture : l'**AAH** pèse 30 % des pas à plus de 70 % parce que, dans le code, elle diminue d'environ 60 % du salaire net au-delà d'un abattement (⚠️ V4382 : taux et abattement lus dans les sorties du code, pas sur l'article), avec la prime d'activité et l'aide au logement qui baissent en même temps, et sur une plage très longue ; le **minimum vieillesse** (16 %) est un différentiel à 100 % auquel s'ajoute l'aide au logement. Le **complément familial**, l'**allocation de rentrée scolaire**, la **prime de Noël** et la **majoration pour la vie autonome** sont des seuils secs : peu de pas, mais les plus grosses pertes (51 € en moyenne par pas pour le complément familial, 105 € pour la majoration). La **prime d'activité** est à l'origine de 63 pas à plus de 70 %, jamais à plus de 100 % : elle est la cause du « plateau » de 70 à 80 % de 0 à 0,5 SMIC. L'**impôt sur le revenu** n'est la cause principale d'aucun pas à plus de 70 % ; il n'apparaît (zone 2) qu'à partir de 2 000 € (célibataire) et de 5 000 € (couple 2 enfants).

## 4. Comparaison avec ce qui est publié

- L'INSEE (Insee Analyses n° 32, 2017, législation 2014) donnait un TMEP médian de 57 % du coût du travail et 1,5 % des personnes à plus de 100 % ; notre atlas est sur des cas types bas revenus (3,1 % des pas à plus de 100 %), sur le salaire et non le coût du travail : pas de comparaison terme à terme (voir `sources/rules-as-code-taux-marginaux.md` §4). Le profil non monotone et le rôle des aides au logement concordent.
- Les seuils de l'atlas (complément familial, prime de Noël, majoration AAH) ne sont pas dans l'étude de l'INSEE ; ils ne sont pas comparés à une publication : ⚠️ V4380.
- IPP, DREES et France Stratégie : voir §4 bis (DREES fiche 30 lue et reproduite ; Insee, Trésor et CAE lus ; IPP/France Stratégie non lisible, ⚠️ V5120 ; V4102 reste ouvert pour l'IPP).

## 4 bis. Confrontation aux sources primaires (03/11/2026, T55)

Question : nos taux sont-ils cohérents avec ce que publient les institutions qui font le même calcul ? Réponse courte : **la mécanique concorde partout où une source primaire permet de comparer** (prime d'activité reproduite à 0,5 € près, pente des aides au logement, pente de l'AAH, position de la sortie du RSA) ; **les « records » sont réels dans leur nature (des marches) mais le pourcentage affiché est un artefact de la largeur du pas** ; **aucune source primaire retrouvée ne confirme le montant des marches du complément familial, de la prime de Noël et de la majoration pour la vie autonome** (⚠️ V5121, V5122, V5124).

### Publications retrouvées et lues (PDF dans `$DONNEES/sources/fiscalite/`)

| Source | Année de la législation | Ce qui est comparable | Lue |
|---|---|---|---|
| DREES, *Minima sociaux et prestations sociales*, édition 2025, fiche 30 « La prime d'activité » (<https://www.drees.solidarites-sante.gouv.fr/sites/default/files/2025-12/MS2025%20-%20Fiche%2030%20-%20La%20prime%20d%27activit%C3%A9.pdf>, consulté le 03/11/2026) | barèmes au 1er avril 2025 | 3 cas types chiffrés (encadré 1) ; taux de 59,85 % | oui, intégralement |
| Insee, Sicsic et Vermersch, *Insee Analyses* n° 66, juillet 2021 (<https://www.insee.fr/fr/statistiques/5411761>, consulté le 03/11/2026), microsimulation Ines | 2019 (et 2014) | profil des TMEP selon le niveau de revenu, décomposition par prestation, part des taux > 100 % | oui, intégralement |
| Insee, Sicsic, *Les incitations monétaires au travail en France entre 1998 et 2014*, Direction générale du Trésor, juillet 2017 (version de *Économie et statistique* n° 503-504, 2018) (<https://www.tresor.economie.gouv.fr/Articles/231ab136-d997-4563-9ece-f885dac3c8a5/files/340690b5-56f8-4104-a71c-18705c23468b>, consulté le 03/11/2026), complément C1 | 2014 | taux de chaque prestation (tableau C1.5), cas types (figure C1-IV) | oui, texte (les figures ne sont pas lues graphiquement) |
| Insee, Fourcot et Sicsic, document de travail F1701, 2017 (<https://www.insee.fr/fr/statistiques/fichier/2581807/F1701.pdf>, consulté le 03/11/2026) | 2014 | description des prestations forfaitaires puis différentielles (complément familial, ARS, ASI) | oui, texte |
| Conseil d'analyse économique, Bozio et Wasmer, note n° 91, et Focus n° 137 (Wasmer, Aleman-Pericon, Mimani, Santaeulàlia-Llopis), juin 2026 (<https://cae-eco.fr/static/pdf/CAE091_Strategie-emploi-salaires_260623.pdf>, <https://cae-eco.fr/static/pdf/Focus_137_Wasmer_TMIP_260623.pdf>, consultés le 03/11/2026) | 2026 (cadre simplifié) | coin fiscal marginal de 3 à 5 entre 1 et 1,4 SMIC ; hypothèse de décision sur moyenne mobile | oui, texte ; pas de cas type chiffré comparable |

**Non retrouvé ou non lisible** : l'étude de l'IPP sur la réforme 2019 de la prime d'activité (hébergée par France Stratégie : le serveur renvoie une page HTML, ⚠️ V5120) ; les autres fiches DREES (⚠️ V5121) ; toute publication de la Cour des comptes, du Conseil d'orientation des retraites, du Sénat ou de l'Assemblée chiffrant un taux marginal sur le minimum vieillesse, le complément familial ou l'AAH (⚠️ V5122). Je n'ai trouvé par la recherche web aucune note IPP, DREES ou France Stratégie récente (2023-2026) qui publie des TMEP par cas types : cela reste à vérifier sur les sites eux-mêmes, et ne prouve pas qu'elles n'existent pas.

### A. Test direct : les trois cas types de la prime d'activité de la DREES (avril 2025)

La DREES publie trois exemples de calcul. Je les ai reproduits dans OpenFisca-France 176.1.10 avec les barèmes 2025 (script `outils/droit/openfisca/replique_drees_ppa.py`, les salaires bruts étant déduits des nets par dichotomie) :

| Cas (DREES, encadré 1) | DREES (EUR/mois) | OpenFisca, avant CRDS | Écart |
|---|---|---|---|
| 1. Personne seule, net 800 €, aide au logement | 261,22 | 261,04 | -0,18 (0,07 %) |
| 2. Couple sans enfant, nets 400 + 1 000 €, propriétaire | 311,79 | 312,29 | +0,50 (0,16 %) |
| 3. Couple, 2 enfants, nets 750 + 900 €, aide au logement | 390,50 | 390,97 | +0,47 (0,12 %) |

Fait établi : le code reproduit la prime d'activité (forfait, 59,85 % des revenus, bonifications) à moins de 0,2 %. L'écart résiduel n'est pas attribué à une cause précise (V5125 vérifié le 03/11/2026) ; il peut venir du forfait logement ou des allocations familiales calculés par le code et non imposés. Conséquence : la composante prime d'activité de tous nos taux (cause de 16 % des pas à plus de 70 %, tableau 4) est validée sur le barème 2025 ; pour 2026, il faut faire confiance au code OpenFisca pour la revalorisation d'avril.

### B. Comparaison cas type par cas type

| Cas type | Notre résultat (barèmes 2026, zone 2, pas de 50 €) | Source primaire | Écart et explication |
|---|---|---|---|
| Célibataire au SMIC (1 823 € brut), hors prestations | TMEP net 15 % à 1 000 € de brut (impôt nul, PPA qui baisse) ; 23 % à 1 850 € ; 42 % à 2 000 € (entrée dans l'impôt) | Insee Analyses n° 66 : à 1 SMIC, TMEP moyen de 60,4 % du **coût du travail**, dont 12,4 points d'impôt et de prestations (IR 3,8 + minima 0,7 + prime d'activité 5,2 + aides au logement 2,4 + prestations familiales 0,3) ; hausse jusqu'à 63 % vers 1,1 SMIC | Définitions différentes (coût du travail et cotisations patronales chez l'Insee, population entière, hausse de 3 %, législation 2019). Ordre de grandeur de la part « impôt + prestations » : 12,4 % du coût, soit environ 17 % du brut, contre 17,6 % du brut chez nous (célibataire, 1 800 à 1 850 €) ; concordance de niveau, pas démontrée (⚠️ V5127) |
| Célibataire locataire, début de la zone de dégressivité des aides au logement | pente de l'aide au logement : -69 € pour +197 € de net (de 1 000 à 1 250 € brut), soit 35 % | Insee 2017 (Sicsic), texte : « environ 35 % dans la zone de dégressivité des APL » (législation 2014) | concordance (V5126 vérifié le 03/11/2026 : barème modifié en 2021, comparaison sur deux points) |
| Personne en AAH (salariée) | réduction de l'AAH de l'ordre de 60 % du net au-delà de l'abattement ; TMEP net de 100 à 110 % de 750 à 1 300 € (avec aide au logement et prime d'activité) | Insee 2017, texte : revenus d'activité pris en compte à 20 % jusqu'à 0,3 SMIC, 60 % au-delà (législation 2014) ; relu dans le code : D821-9, 80 % puis 40 % d'abattement (fiche AN113) | concordance sur la pente de l'AAH ; la majoration pour la vie autonome (285 % au premier euro) n'est pas dans l'étude de l'Insee (⚠️ V5121) |
| Couple monoactif, 2 enfants, sortie du RSA | ~~182 %~~ **314 %** à 1 250-1 300 € de brut (0,70 SMIC) (correction du 04/11 : 182 % était la valeur avant la mesure du bogue d'ordre d'évaluation, §0) | Insee 2017, complément C1, figure C1-IV (lecture du texte) : 140 % pour un couple monoactif à deux enfants à 68 % d'un SMIC (législation 2014) | **même cas, même position (0,68 contre 0,70 SMIC)** ; l'**ordre de grandeur ne concorde plus** depuis la correction du 04/11 (140 % chez l'Insee contre 270 % du brut et 314 % du net chez nous, l'aide au logement maintenue puis perdue d'un coup pesant pour environ 60 points du net) ; la concordance de position tient, celle du niveau tombe ; écarts : année (RSA activité en 2014, prime d'activité et prime de Noël revalorisées en 2026), base du taux non précisée (V5123 vérifié le 03/11/2026), pas de calcul (voir D) |
| Parent isolé, 3 enfants ; couple, 3 enfants (complément familial) | marche de 99 € : 273 % à 314 % sur un pas de 50 € | Insee 2014 et 2017 : le complément familial est « forfaitaire jusqu'à un certain niveau de ressources puis différentiel » ; l'Insee note aussi des « taux infinis au seuil de non-versement » pour la PAJE et des seuils secs | le **principe** est confirmé (seuil de non-versement) ; le **montant de la marche du majoré** n'est pas dans ces textes, qui ne citent qu'un complément familial de 167,34 € à zone différentielle (⚠️ V5124). Notre atlas retrouve bien la zone différentielle du plafond principal (couple 3 enfants, 5 050 à 5 300 € : 93 %) |
| Retraité au minimum vieillesse | 100 % (ASPA, différentiel) + aide au logement : 138 % | Insee 2014 et 2017 : « zone différentielle jusqu'au montant de l'allocation, taux marginal de 100 % » pour l'ASPA, AAH, RSA ; aides au logement à 35 % | concordance (100 + environ 38 % ≈ 138 %) ; pas de source COR ou Cour des comptes (⚠️ V5122) |

### C. Écarts d'ensemble avec l'Insee, expliqués

1. **Année et barème** : 2014 (RSA activité, PPE, pas de prime d'activité), 2019 (prime d'activité revalorisée, IR de 2019) contre 2026 chez nous. La forme des courbes change quand le dispositif change : l'Insee montre lui-même que le pic des taux est passé de 0,3 SMIC (2014) à 1,1 SMIC (2019) avec la prime d'activité.
2. **Définition du taux** : l'Insee mesure la part d'une hausse du **coût du travail** captée par le système (cotisations patronales comprises, médiane de 56 % en 2019) ; nous mesurons la part du **salaire net** supplémentaire perdue en impôt et en prestations (cotisations patronales exclues). Un taux net de 40 % peut correspondre à 60 % du coût du travail. Les deux chiffres ne se comparent pas.
3. **Population** : l'Insee prend toutes les personnes en emploi (médiane) ; nous prenons 14 cas types choisis dans les bas revenus, ce qui gonfle la part des pas à plus de 100 % (3,1 % de nos pas contre 1,1 % des personnes chez l'Insee en 2019, 1,5 % en 2014).
4. **Aides prises en compte** : l'Insee (Analyses n° 66) exclut les aides locales, la taxe d'habitation, les taxes indirectes et les prestations en nature, comme nous (nous ne comptons pas non plus la complémentaire santé solidaire, éligibilité seulement). Nous comptons la prime de Noël (`aefa`), que l'Insee range dans les minima sociaux (Sicsic 2017), et les bourses ; la liste de l'Insee ne mentionne pas les bourses (liste lue : cotisations, impôt sur le revenu, prime d'activité, prestations familiales, aides au logement, minima sociaux).
5. **Largeur du pas** : l'Insee augmente le revenu de 3 % du coût du travail (note 20 de Sicsic : une hausse plus faible donne des taux élevés plus extrêmes mais moins nombreux) ; nous prenons 50 € de brut, soit environ 40 € de net. Le même effet joue sur nos pourcentages (voir D).
6. **Cotisations patronales** : le tilde aplati de l'Insee vient surtout d'elles (taux constants hors allègements) ; nos courbes n'en ont pas, donc elles sont plus bossues. Le CAE (note n° 91, juin 2026) mesure, lui, un coin fiscal marginal de 3 à 5 entre 1 et 1,4 SMIC une fois les allègements dégressifs comptés : cela correspond à des taux de 67 à 80 % du coût du travail, compatibles avec nos 53 à 63 % de net au même niveau (parent isolé, 1 800 à 2 000 €) plus la part patronale, sans que j'aie fait le calcul terme à terme.

### D. Les records de l'atlas sont-ils plausibles ? Effet de seuil réel ou artefact ?

J'ai recalculé les trois cas les plus extrêmes avec un pas de **5 €** de brut au lieu de 50 € (script jetable, ⚠️ V5128) :

- **Complément familial (couple, 3 enfants)** : la perte est un point unique : le complément passe de 296,67 € à 197,76 € (-98,91 €) entre 2 525 et 2 530 € de brut, ce qui donne un taux de 2 592 % sur le pas de 5 €, 314 % sur 50 €, et **108 % en moyenne de 2 400 à 2 700 € de brut** (le revenu disponible baisse de 18 € quand le salaire net monte de 240 €). Verdict : **effet de seuil réel** (marche de 1 188 € par an, vérifiée sur le texte dans la fiche AN112), **pourcentage artefact** du pas : un taux marginal n'a pas de sens sur une marche, la bonne mesure est la perte en euros (99 € par mois) et la plage de revenus qui en souffre. Réserves : la marche se lit sur les ressources de l'année N-2 (R532-3), donc elle n'arrive pas l'année du gain de salaire ; et l'Insee 2014 ne documente pas la marche du majoré (⚠️ V5124).
- **Couple monoactif, 2 enfants, 182 % (valeur du 03/11 ; 314 % depuis la correction du §0, les chiffres de cette puce sont ceux du 03/11 et ne sont pas recalculés au pas de 5 € ; ⚠️ V12090)** : à 5 €, la perte se concentre entre 1 280 et 1 285 € de brut (RSA qui tombe à zéro, prime de Noël de 26,7 € par mois perdue, aide au logement qui baisse) ; sur une fenêtre de 1 200 à 1 400 €, le taux moyen est de **88 %**. La prime de Noël pèse environ 67 points des 182 % : 26,7 € de perte pour 40 € de net en plus ; elle est annuelle et versée en décembre, répartie ici sur 12 mois (⚠️ V4383). Verdict : **seuil réel** (RSA différentiel et prime de Noël, à la même position que le 140 % de l'Insee de 2014), **intensité exagérée par le pas de 50 €** ; la moyenne lissée de 88 % est du niveau des 70-90 % que d'autres plages de l'atlas affichent. **Cette conclusion tombe avec la correction du 04/11** : le taux moyen de 1 200 à 1 400 € de brut est alors de 114 % (§0), et le seuil est plus raide, pas moins.
- **Parent isolé, 3 enfants, 141 % à 450-500 €** et **AAH, 285 % au premier euro** : même nature : marche réelle (fin du RSA et de la prime de Noël ; majoration pour la vie autonome de 104,77 € supprimée dès qu'il y a un revenu d'activité, L821-1-2) ; pourcentage dépendant du pas.

À retenir : les 135 pas à plus de 100 % de l'atlas ne sont pas des erreurs du code, mais **le seuil de 100 % n'est pas un indicateur robuste** : un pas plus fin donne moins de pas, beaucoup plus extrêmes (l'Insee le signale dans une note de bas de page). Pour le manifeste, il faut présenter la perte en euros par marche et le taux moyen sur 200 à 300 € de brut, et ne pas citer « 314 % » sans cette explication. Le CAE (Focus n° 137) fait l'hypothèse que le ménage décide sur une moyenne mobile (par exemple -10 % à +20 % autour de son salaire) qui efface les discontinuités : à cette aune, la lecture pertinente est le taux moyen (108 % pour le complément familial ; 114 % et non plus 88 % pour la sortie du RSA du couple à 2 enfants depuis le 04/11), pas le pic.

### E. Ce qui reste ouvert

Pas de source primaire pour la marche du complément familial majoré, la prime de Noël, l'ARS et la majoration pour la vie autonome (V5121, V5122, V5124) ; IPP et France Stratégie non lus (V5120) ; pas de relecture de l'Insee sur 2026 (la microsimulation Ines la plus récente lue porte sur 2019) ; comparaison de conversion de base à refaire proprement (V5127) ; pas de test à 1 € ni sur les 14 cas (V5128) ; les tests au pas de 5 € de §D n'ont pas été refaits avec `max_spiral_loops = 3` (V12090). Les statuts des fiches AN111 à AN113 restent « vérifiée sur le texte » (ligne de relecture ajoutée, statut inchangé).

## 5. Anomalies tirées de l'atlas (registre T55)

Trois fiches nouvelles, créées « détectée » (montants calculés par OpenFisca, pas relus sur les articles) et **passées à « vérifiée sur le texte » le 03/11/2026** après relecture des articles, recalcul à la main et comparaison avec le code (écarts consignés dans `sources/ecarts-openfisca.md`) :
- **AN111** : minimum vieillesse, la pension monte de 50 € et le revenu disponible baisse de 5 à 19 € (de 450 à 1 050 € de pension brute) ;
- **AN112** : complément familial, 99 € par mois d'un coup, TMEP de 273 % à 314 % (trois enfants) ;
- **AN113** : AAH, majoration pour la vie autonome perdue au premier euro de salaire, puis 70 à 110 % de 700 à 1 400 €.

**Corrections apportées à l'atlas par cette vérification (03/11/2026).** (1) Complément familial : seuil sec confirmé sur L522-2, L522-3, R522-3 et R522-4 (le complément différentiel n'est écrit que pour le plafond principal) ; deux points recalculés à la main (314 % et 272 %). (2) Minimum vieillesse : différentiel à 100 % confirmé (L815-9, D815-2) ; la perte de l'aide au logement vient de la base R822-4, qui compte la pension et pas l'ASPA. (3) AAH : OpenFisca prend le salaire net comme base de ressources, le texte prend le salaire imposable après 10 % de frais professionnels (écart E1) ; avec la base du texte, le TMEP maximal de l'AAH passe de 285 % à 283 % et le nombre de pas à plus de 100 % de 15 à 11 en zone 2 ; la majoration de 104,77 € perdue au premier euro et le plateau du revenu disponible subsistent. Les tableaux 1 à 4 ci-dessus n'ont pas été recalculés : ils donnent les valeurs d'OpenFisca.
Les anomalies A1 à A5 de `sources/rules-as-code-taux-marginaux.md` restent valables, avec les chiffres corrigés ci-dessus.

## 6. Limites

- **Moteur** : OpenFisca-France 176.1.10 a un bogue d'ordre d'évaluation (prime d'activité et aide au logement, quasi-boucle coupée par `max_spiral_loops = 1`). L'atlas est corrigé avec 3 boucles (valeurs identiques à 6 boucles) ; sur un atlas complet, 3 boucles laissent un résidu de prime d'activité de 5,2 € au plus dans l'ordre inversé (§0). Non testés : autres années de barème, autres variables, temps de calcul. L'effet de la correction sur la forme des courbes vient du droit codé (neutralisation de l'aide au logement tant que le RSA est perçu), recoupé avec la loi exécutable sur 5 pas, pas relu sur l'article (V12089).
- **Non-recours** (RSA, prime d'activité, AAH, aides au logement) : non modélisé ; il réduit les taux réellement vécus.
- **Régime permanent** : en réalité, les ressources de référence décalent (trimestre, N-2) : le seuil existe, son calendrier n'est pas celui du modèle (⚠️ V4107). La prime de Noël, versée à un mois donné, est ici répartie sur l'année (⚠️ V4383).
- **Pas de 50 €**, **cas types** (14 profils, 3 zones) : aucune représentativité statistique ; l'atlas ne dit pas combien de personnes sont concernées.
- **Hypothèses** : loyers, âges des enfants, conjoint biactif à 1 SMIC fixe, ressources parentales de l'étudiant à 22 000 €, retraité sans autre ressource.
- **Non pris en compte** : complémentaire santé solidaire (éligibilité seulement : `cmu_c` dans le CSV), aides locales et facultatives, cotisations patronales, TVA, chômage, indépendants, frais de garde (aucun enfant de moins de 3 ans sauf un de 4 ans), droits à la retraite acquis.
- **Les montants et les seuils sont ceux d'OpenFisca-France** ; les articles de loi n'ont pas été relus un à un (⚠️ V4380 à V4384).

## 7. Sources

- OpenFisca-France 176.1.10, <https://pypi.org/project/OpenFisca-France/> et <https://github.com/openfisca/openfisca-france> (code lu dans le paquet installé, 03/11/2026) : ce que le code actuel établit.
- INSEE, Insee Analyses n° 32, 13/02/2017 : <https://www.insee.fr/fr/statistiques/2583050> (consulté le 02/11/2026) : ce que mesurait le TMEP sur la législation de 2014.
- Sources de la confrontation (§4 bis) : DREES, MS2025 fiche 30 ; Insee Analyses n° 66 (2021) ; Trésor/Insee, Sicsic (2017) ; Insee F1701 (2017) ; CAE, note n° 91 et Focus n° 137 (juin 2026) : liens dans §4 bis.
- Code de l'outil : `outils/droit/openfisca/replique_drees_ppa.py` (réplique des cas types DREES), `outils/droit/openfisca/taux_marginaux.py` (calcul), `outils/droit/openfisca/analyse_atlas.py` (zones, causes, graphiques).
