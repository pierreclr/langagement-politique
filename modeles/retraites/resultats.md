---
titre: Retraites — socle universel, complément de carrière et capitalisation (résultats)
tache: T13
date: 2026-10-25
statut: brouillon
---

## Âge de référence indexé (03/11/2026, décision de l'auteur : 2/3 de chaque année d'espérance de vie gagnée au travail)

Chiffres reproduits par `jsc modele.js age_libre.js test_age_reference.js` (sortie : `resultats-age-reference.txt`, 32 contrôles) ; hypothèses H61 à H70 dans `methode.md` § 12. Md€ de 2025 par an, points de PIB. Scénarios : favorable / central / défavorable (paramètres de comportement sourcés le 04/11/2026 sauf `passageLibre` : voir la mise à jour ci-dessous ; les « dix lignes » sont celles du 03/11).

**Mise à jour du 04/11/2026 (V12840 à V12859) : les paramètres de comportement sont désormais sourcés.** Les valeurs de `passage`, `partEnEmploi` et `partPenibilite` de `SCENARIOS_REF` sont celles de `sources/retraites-comportements.md` (faits de la littérature, pas des choix politiques ; les mesures 11 à 16 ne changent pas) ; un coût de substitution vers le chômage, l'invalidité et la maladie est ajouté (H71). Ancien → nouveau (favorable / central / défavorable) : `passage` 1,0 / 0,8 / 0,6 → **0,8 / 0,5 / 0,33** ; `partEnEmploi` 75 / 65 / 50 % → **75 / 50 / 35 %** ; `partPenibilite` 10 / 20 / 30 % → **5 / 10 / 20 %** (part nette du droit actuel) ; substitution 0 → **10 / 20 / 30 %** des gains de l'âge de référence. **Inchangés** : `contrepartie` (0 / 25 / 50 %) et **`passageLibre` (0,2 / 0,35 / 0,5)**, sans étude : hypothèse assumée de symétrie, premier levier du signe de 2040. La part en emploi des départs avancés (0,5) reste à son ancienne valeur (H72). Nouveaux chiffres (sortie : `resultats-age-reference.txt`, 32 contrôles) ; **les « dix lignes » ci-dessous sont celles du 03/11 (valeurs anciennes) et les remplacent seulement là où ce bloc les contredit** :

| central (Md€ de 2025 par an) | avant (03/11) | après (04/11) |
|---|---|---|
| âge effectif de départ de la cohorte 2040 / 2060 / 2070 | 64,9 / 65,8 / 66,2 | **64,8 / 65,3 / 65,6** (63,6 en 2030, inchangé) |
| âge de référence seul : économie sur pensions 2040 / 2060 / 2070 | 4,8 / 18,5 / 25,7 | **3,0 / 11,8 / 16,6** |
| âge de référence seul : solde public 2040 / 2060 | +7,4 / +30,0 | **+3,4 / +14,0** (net de la substitution ; brut +4,2 / +17,5) |
| dépense de pensions, âge de référence seul, 2040 / 2060 | 14,01 / 14,39 % du PIB | **14,06 / 14,56 %** (base COR : 14,15 / 14,86 %) |
| dispositif complet : solde 2030 / 2040 / 2060 / 2070 | −21,4 / −5,6 / +26,7 / +40,3 | **−20,8 / −5,9 / +20,1 / +28,8** |
| dispositif complet, fourchette 2040 (favorable à défavorable) | +28,5 à −26,5 | **+25,7 à −24,0** |
| dispositif complet, fourchette 2060 | +109,1 à −16,4 | **+96,9 à −12,7** |
| part de l'écart de 3 points avec l'Allemagne comblée (pensions), âge de référence seul, 2040 / 2060 / 2070 | 5 / 16 / 20 % | **3 / 10 / 13 %** |
| idem, dispositif complet, 2040 / 2060 / 2070 | 1 / 22 / 27 % | **3 / 24 / 29 %** |
| départ à 60 ans sans réduction (part de 10 % au lieu de 20 %) : dispense 2040 / 2060 | 7,4 / 18,8 | **3,7 / 9,4** (coût total 7,9 / 8,9) |
| report en 2060 et perte par décile | 1,16 an ; −3,2 % (D10) à −4,5 % (D1) | **0,73 an ; −2,0 % (D10) à −2,8 % (D1)** ; 6 à 7 mois de retraite en moins |
| pauvreté (taux supposés) : variation du nombre de pauvres 2040 / 2060 | +4 000 / +15 000 | **+7 000 / +29 000** (278 000 hors emploi en 2060, 50 % des reporteurs) |
| taux d'équilibre de la v5.1 avec l'option (`systeme-ideal`, § 20) : âge de référence seul / complet | 40,7 % / 41,9 % | **41,1 % / 41,9 %** (référence : 41,4 %) |

**Lecture.** Le sourçage **réduit de moitié l'effet de l'âge de référence** (passage 0,8 → 0,5, part en emploi 65 → 50 %) mais laisse presque inchangé le central du dispositif complet en 2040 (−5,6 → −5,9) : la pénibilité nette du droit actuel (20 → 10 %) compense. **Le signe ne change pas** : déficit en 2040, excédent en 2060 ; la fourchette de 2040 se resserre un peu. Reste le paramètre qui décide, `passageLibre`, sans étude (± 7,6 Md€ pour ± 0,15 en 2040). Le calcul de sensibilité qui a conduit à ces valeurs est dans `resultats-sensibilite-comportements.txt` (ses valeurs « actuelles » sont désormais les anciennes). ⚠️ V12840 à V12859.

**Dix lignes**

1. **Ce que dit la loi aujourd'hui** (code de la sécurité sociale, art. L161-17-2, issu de la LFSS 2026) : l'âge légal est **62 ans 9 mois pour les nés de 1963 à mars 1965, puis 63 ans, 63 ans 3 mois, 6 mois, 9 mois pour 1965 (avril-déc.), 1966, 1967, 1968, et 64 ans à partir de 1969**. La suspension de la réforme de 2023 a décalé le calendrier d'une génération ; le taux plein automatique reste à 67 ans. Le point de départ retenu par l'auteur, 64 ans, est donc celui de la génération 1969 (60 ans en 2029, 64 ans en 2033). ⚠️ V10100
2. **La règle donne peu, et tard** : avec les projections de l'Insee 2026 (espérance de vie à 65 ans : +3,5 ans de 2025 à 2070 au central), l'âge de référence est **64 ans 4 mois pour la génération 1975, 64 ans 7 mois pour 1980, 65 ans 2 mois pour 1990, 65 ans 9 mois pour 2000, 66 ans 3 mois pour 2010** (haute : 67 ans 10 mois ; basse : 64 ans 10 mois ; espérance de vie constante : 64 ans). Elle ne mord pas avant 2034 : **aucun effet en 2030**.
3. **Effet sur l'âge réel de départ** (central, passage de 0,8 du report d'âge de référence à l'âge effectif) : de 63,6 ans (cohorte 2030) à 64,9 en 2040, 65,8 en 2060, 66,2 en 2070 (le COR suppose 64,6 stabilisé).
4. **Dépense de retraite** (âge de référence seul, central) : 14,10 % du PIB en 2030 (inchangée), **14,15 → 14,01 % en 2040 (−4,8 Md€)**, **14,86 → 14,39 % en 2060 (−18,5 Md€)**, 15,3 → 14,7 % en 2070 (−25,7 Md€). Avec les recettes des gens qui travaillent plus longtemps : **solde public +7 Md€ en 2040, +30 en 2060, +43 en 2070**.
5. **Retraités et cotisants** (central) : 0,22 M de retraités en moins et 0,15 M de cotisants en plus en 2040 ; 0,87 et 0,56 M en 2060 ; 1,19 et 0,78 M en 2070. Rapport cotisants/retraités du COR : 1,50 → 1,53 en 2040 ; 1,36 → 1,45 en 2060 ; 1,31 → 1,42 en 2070.
6. **Ce qui reste hypothétique** : le passage de l'âge légal à l'âge effectif (0,6 / 0,8 / 1,0), la part de ceux qui reportent et restent en emploi (50 / 65 / 75 %), la contrepartie sur la pension (0 / 25 / 50 % du coefficient neutre). Repères lus : la Drees (+2 ans 2 mois d'âge conjoncturel de 2010 à 2022 pour +2 ans d'âge légal), l'Insee (réforme de 2010, à 60 ans : +17 points d'emploi, +7 de chômage pour les hommes ; +16 et +6 pour les femmes), la Dares (+3,4 points d'emploi des 60-64 ans en 2024). Rien n'est calibré sur la réforme de 2023. ⚠️ V10103 à V10105
7. **Part de l'écart avec l'Allemagne** (≈ 3 points de PIB, COR 2019 ; dépense sur les pensions seule) : l'âge de référence indexé comble **5 % en 2040, 16 % en 2060, 20 % en 2070 au central** (1 / 4 / 5 % au défavorable ; 10 / 36 / 48 % au favorable). C'est un stabilisateur, pas un rattrapage : **l'écart ne se comble pas par cette règle**.
8. **Le dispositif complet** (âge de référence + âge libre à coefficient neutre + départ à 60 ans sans réduction pour 20 % des départs + indexation − 0,5 point au-dessus de 2 000 € + contribution de 20 % au-dessus de 2 500 € nets) : solde public **−21 Md€ en 2030, −6 en 2040, +27 en 2060, +40 en 2070 (central)** ; dépense 14,10 → 14,50 % du PIB en 2030, 14,11 % en 2040 (+0,04 point d'économie), 14,20 % en 2060. **Fourchette en 2040 : de +28 Md€ (favorable) à −27 Md€ (défavorable)** ; en 2060 : de +109 à −16 Md€. Part de l'écart de 3 points comblée sur les pensions : 1 / 22 / 27 % (2040 / 2060 / 2070, central) ; 27 / 75 / 91 % (favorable) ; négatif au défavorable.
9. **Qui paie** : en 2060, un report de 1,16 an coûte environ **10 mois de retraite** à chaque décile (−3,2 % de la valeur à vie de la pension au décile 10, **−4,5 % au décile 1** : l'espérance de vie à 60 ans des plus modestes est plus courte, hypothèse de ± 2,75 ans ⚠️ V10108). Parmi ceux qui reportent, 35 % sont hors emploi (304 000 personnes en 2060) : avec des taux de pauvreté supposés (30 % hors emploi, 7 % en emploi, 13,3 % chez les retraités), le nombre de pauvres varie de **+4 000 en 2040 et +15 000 en 2060** (+0,07 point de la population retraitée) : un effet faible mais qui touche les personnes déjà fragiles. Le plancher à 1 300 € nets protège le montant, pas l'âge d'accès. ⚠️ V10107
10. **Départ sans réduction : le vrai poste de coût.** Pénibilité à 60 ans pour 20 % des départs : dispense de réduction **7,4 Md€ en 2040 (0,22 pt) et 18,8 en 2060 (0,47 pt)** ; coût total (départs plus tôt) 16 Md€ en 2040, 19 en 2060. Définition « carrière longue » (âge de référence − 2 ans, 15 % des départs) : dispense de 2,6 Md€ en 2040 et 5,5 en 2060 (0,14 pt) : **le surcoût dépend surtout de la part et de la définition retenues, deux paramètres sans source** ⚠️ V10109.

**Les pays qui lient l'âge à l'espérance de vie** (OCDE, *Pensions at a Glance 2025*, tableaux 3.5 et 3.6 ; âge normal 2024 → âge normal futur pour ceux qui entrent sur le marché du travail en 2024) : **Danemark 67 → 74** (lien 1 pour 1, paliers de 5 ans ; 70 ans en 2040 voté le 22/05/2025, lien susceptible d'être assoupli), **Pays-Bas 67 → 70** (2/3 des gains, âge annoncé 5 ans à l'avance), **Suède 66 → 70** (âge de référence fixé 6 ans à l'avance, 67 ans de 2026 à 2031), **Finlande 65 → 68**, **Portugal 65,3 → 68** (ajustement annuel : 66 ans 9 mois en 2026, 66 ans 11 mois en 2027 ; fraction de 2/3 mentionnée par l'OCDE en 2021), **Norvège** (lien de 2/3 en préparation), contre **France 64,3 → 65** (aucun lien). Avec une fraction de 1 plutôt que 2/3, la génération 2010 aurait 67 ans 5 mois (au lieu de 66 ans 3 mois) ; avec 1/2, 65 ans 9 mois. Les règles nationales exactes (fraction en Suède et en Finlande, plafonds) n'ont pas été lues à la source primaire ⚠️ V10106.

**Limites** : cohorte moyenne et flux annuel constant de 0,77 M de départs (H48) ; mêmes distributions de pensions que § 11 ; variante d'espérance de vie sans coût de longévité (H70) ; aucun effet de la règle sur la pension des carrières longues déjà au taux plein à 62 ans ; coût d'indemnisation du chômage des seniors non chiffré ; **le dispositif complet est plus coûteux que bénéfique avant 2040 dans le central** : sans l'âge libre, la dispense de réduction et le plancher, l'âge de référence indexé et le niveau rapportent dès 2040 (7 Md€ + 13 Md€ de niveau), mais c'est la liberté de partir à 60 ans qui coûte. **Montants à intégrer plus tard dans `modeles/systeme-ideal/` (effet sur le solde public en 2040, Md€, [favorable, central, défavorable])** : âge de référence indexé seul **[16,9 ; 7,4 ; 1,6]** (pensions : [10,6 ; 4,8 ; 1,1]) ; dispositif complet **[28,5 ; −5,6 ; −26,5]** ; en 2060 : seul [69,5 ; 30,0 ; 6,9], complet [109,1 ; 26,7 ; −16,4].

## Âge libre et niveau (03/11/2026, demande de l'auteur : un âge libre avec pension ajustée, sans toucher l'âge légal)

Chiffres reproduits par `jsc modele.js age_libre.js test_age_libre.js` (sortie : `resultats-age-libre.txt`, 37 contrôles). Md€ 2025 par an, points de PIB (COR : 14,1 % en 2025). Comparaison avec l'Allemagne : `sources/retraites-france-allemagne.md` (écart de ≈ 3 points, soit ≈ 90 Md€).

1. **L'âge libre lui-même ne rapporte rien, il coûte pendant la transition.** Départ possible dès 60 ans avec un coefficient neutre à 0,7 % (croissance de la masse salariale) : coefficient **0,83** à 60 ans par rapport à 64 (0,82 pour un homme, 0,84 pour une femme), contre 0,80 pour la décote française (5 %/an) et 0,82 au taux suédois de 1,6 %. Au central (35 % des 2,75 ans de gap avec l'âge légal absorbés, soit un départ moyen **≈ 1 an plus tôt**) : **−13 Md€ en 2030, −6 en 2040, +3 en 2060** sur les pensions, et **−6 à −8 Md€ de recettes perdues** (travail en moins). Neutre à r = 0 : transition coûteuse puis effet nul.
2. **La neutralité se choisit** : le taux annuel neutre à 64 ans est 4,6 % (r = 0) à 5,6 % (r = 1,6 %), contre 5 % de décote/surcote française et 4,8 % de moyenne OCDE. La décote française est donc **proche de la neutralité** : l'âge libre n'est pas une économie, c'est une liberté. Seul un taux d'actualisation plus élevé que la croissance de la masse salariale (Suède : 1,6 %) fait baisser les pensions totales ; c'est un choix de politique, pas de la neutralité.
3. **Plancher** : jamais en dessous de min(pension d'origine, 1 044 €) ; coût ≈ 2 Md€ par an en régime (3,3 avec 1 300 €). **Pauvreté** : parmi ceux qui partent à 60 ans, la part dont la pension individuelle nette passe sous 1 216 € monte de 39 à 48 % (+9,8 points) ; avec un plancher de 1 300 € (au-dessus du seuil) la hausse est nulle. Comme 23 % d'une cohorte partirait à 60 ans au central, cela fait **au plus ≈ 2 points** de la part des retraités sous le seuil en régime (pension individuelle, pas niveau de vie du ménage). ⚠️
4. **Pénibilité et carrières longues** : départ à 60 ans sans réduction pour 20 % des départs : **surcoût de 3 Md€ en 2030, 9 en 2040, 16 en 2060 (0,4 point)** par rapport à un départ neutre (borne haute si une partie de ces départs existe déjà dans le dispositif « carrières longues »). C'est le principal coût de l'âge libre, plus que le coefficient.
5. **Niveau : c'est lui qui rapporte.** Indexation sur les prix moins 0,5 point par an de la part des pensions brutes **au-dessus de 2 000 €** à partir de 2028 : **1,3 Md€ en 2030, 6 en 2040, 16 en 2060** (masse concernée : 83 Md€ en 2025). Plus la contribution de 20 % au-dessus de 2 500 € nets (6,6 Md€ ; 0,2 point). **Total « niveau » : 8 Md€ en 2030, 13 en 2040 (0,38 point), 22 en 2060 (0,56 point).**
6. **Bilan central (âge libre + pénibilité + niveau)** : **−9 Md€ en 2030 (−0,28 pt), −2 en 2040 (−0,06 pt), +9 en 2060 (+0,23 pt)** sur les dépenses de pensions ; **net après recettes perdues : −15, −9, +2 Md€**. Sans la pénibilité : +25 Md€ en 2060 (0,64 pt). **Fourchette 2060 : de −9 Md€ (bas, −0,22 pt) à +48 Md€ (haut, +1,22 pt)**, le haut venant presque entièrement de l'indexation (écart de 1 point par an au-dessus de 1 500 €).
7. **Combien de l'écart avec l'Allemagne** (≈ 3 points) sans toucher l'âge légal : **8 % en 2060 au central** (0,23 pt), **jusqu'à 41 %** au haut, **négatif** au bas ; pour le niveau seul (indexation + hautes pensions) : 13 % en 2040 et 19 % en 2060 au central. **L'écart ne se comble pas sans toucher à l'âge ou à l'emploi des seniors ou au niveau général.** Le rapport cotisants/retraités du COR passe de 1,76 (2025) à 1,66 (2030), 1,50 (2040), 1,36 (2060) (valeurs intermédiaires interpolées, V10009).
8. **Qui perd (2040, par décile de pension brute)** : **les six premiers déciles ne perdent rien** (pensions jusqu'à ≈ 2 000 €) ; décile 7 (≈ 2 150 €) −0,4 % ; décile 8 (≈ 2 470 €) −1,2 % ; décile 9 (≈ 2 950 €) **−3,8 %** (indexation −2,0 %, contribution −1,7 %) ; décile 10 (≈ 4 380 €) **−11,1 %** (indexation −3,4 %, contribution −7,7 %). Seuil à 2 000 € brut : 1 500 € élargirait les pertes au décile 5 ; 2 500 € les réduirait.
9. **Comportement de départ (hypothèse, non calibrée)** : passage de 0,2 à 0,5 de l'écart avec l'âge légal absorbé ; références à lire avant de croire le chiffre : réforme de 2010 (60 → 62 ans, effet constaté sur l'âge conjoncturel de départ, ⚠️ non chiffré ici) ; réforme de 2023 : la Dares attribue à la réforme +3,4 points du taux d'emploi des 60-64 ans en un an (42,4 % en 2024) ; Mastrobuoni (2009, États-Unis) : relever de 2 mois l'âge normal fait partir ≈ 1 mois plus tard (passage de 0,5), non relu. ⚠️ V10008
10. **Limites** : pas de microsimulation (cohorte moyenne, 5 ms de calcul) ; pensions de la distribution 2020 revalorisées (V451) ; pas d'effet de l'âge libre sur l'âge de départ des cadres (déplacement vers le haut) ; pas de bonus pour ceux qui travaillent plus longtemps au-delà du coefficient ; indexation sans protection par la CSG ; recettes perdues avec 50 % de partants en emploi et 42 % de prélèvements (hypothèses) ; table de mortalité unique (2023) alors que l'espérance de vie progresse (les coefficients à 2040 sont à actualiser). **Ne pas relever l'âge n'est pas gratuit : c'est environ 3 points de PIB qu'il faut trouver ailleurs (niveau, emploi).**

## Mise à jour du 03/11/2026 : trois jeux de paramètres (socle, taux plat)

Chiffres reproduits par `jsc modele.js test_modele.js` (section « Trois jeux de paramètres », 32 contrôles). Ancien = 1 000 € / 50 % (pour mémoire) ; palier 1 = 500 € / 35 % ; architecture retenue le 03/11 = 350 € / 40 %. Md€ 2025 par an, ordres de grandeur.

1. **Économie de la règle « pension − socle » sur la pension brute** : 185 Md€ (ancien), **97** (palier 1), **69** (350 €). Plus le socle baisse, moins la règle rapporte : à 350 €, 7 % des retraités seulement sont sous le socle.
2. **Même règle, complément calculé sur le net** : 214 / **126** / **98** Md€. L'écart avec le brut (≈ 29 Md€) est la CSG-CRDS-Casa que la règle brute rend aux retraités (H8).
3. **Capitalisation du complément (rendement 3,5 %)** : double charge de 92 / **131** / **144** Md€ par an (3,1 / 4,4 / 4,8 % du PIB), toujours ≈ 28 ans ; cumul 1 740 / 2 481 / 2 718 Md€ ; fonds 2100 de 4 900 / 7 000 / 7 600 Md€. **Plus le socle est bas, plus le complément à capitaliser est gros** : la capitalisation de tout le complément est hors de portée dans les deux nouveaux jeux (fiche 05 : seule l'étape 2a, un point de cotisation, reste défendable).
4. **Le point qui change le signe : l'imposition du complément.** Variation du revenu net des retraités résidents (avant IR), selon que le complément est non imposé (brut), calculé sur le net, ou imposé au taux plat comme tout revenu du système (socle + (1 − t) × revenu) : ancien +47 / +21 / **−51** Md€ ; palier 1 +33 / +5 / **−66** ; architecture retenue +30 / +3 / **−93**.
5. **Imposé au taux plat, la grande majorité des retraités perd** : 73 % (ancien), 88 % (palier 1), **91 % (350 € / 40 %)**. Pension de 1 753 € (médiane) : −248 / −310 / **−433 €/mois** ; pension de 2 500 € : −567 / −517 / **−677 €** ; pension de 800 € : +259 / −46 / **−121 €** (le socle à 350 € ne compense plus la reprise).
6. **Choix retenu (Claude, à valider par l'auteur)** : le système idéal v2 (§ 3.4, décisions des 31/10 et 01/11) **ne ramène pas les retraités au minimum** : socle réservé aux adultes non retraités, pensions sanctuarisées, contribution de 20 % sur la part de pension nette au-dessus de 2 500 €. La règle « pension − socle » n'est donc **pas** celle du système ; elle ne reste qu'un levier chiffré.
7. **Si on la calcule malgré tout, la version de référence est « sur le net »** : c'est la seule où le signe est neutre (aucun perdant en net), sans cadeau de CSG. La version « brut non imposé » offre ≈ 29 Md€ aux retraités sans que personne ne l'ait décidé ; la version « imposé au taux plat » est incompatible avec « retraités protégés ». Choix documenté dans `methode.md` (H42).
8. **Règle réellement retenue par la v2** : 6,6 Md€ de recette au seuil de 2 500 € nets et 20 % (18,7 % des retraités touchés, pension seule, résidents), 3,8 Md€ à 3 000 € (10,3 %). Le calcul recoupe le 6,3 Md€ (5,8 à 6,6) de `modeles/systeme-ideal` (Rés. § 12.2) ; il ne dépend ni du socle ni du taux plat.
9. **Ce que le socle change pour les retraités dans le système retenu** : rien, sauf pour les pensions sous le socle si on adoptait la règle (ASPA conservée à 1 044 €, donc au-dessus de 350 et de 500 €).
10. **Limites** : distribution des pensions datée de 2020 (V451) ; rapport net/brut moyen constant (0,927, H41) ; IR non compté ; effets de comportement nuls ; l'impôt continu du système (jusqu'à 30 %) n'est pas appliqué aux pensions dans ce bilan.

# Retraites : ce que disent les chiffres

Tâche T13 · 2026-10-25 · méthode : [`methode.md`](methode.md) · chiffres reproduits par `jsc modele.js test_modele.js` (26 contrôles au vert). **Variante T48** (nouveau décompte + part capitalisée progressive de 1, 3 ou 6 points) : dernière section, `jsc capitalisation.js test_capitalisation.js` (36 contrôles).

Ce sont des **ordres de grandeur sous hypothèses**, en euros 2025, pas des prévisions. Les ⚠️ renvoient au registre `verifications.md` (V450 à V472).

## En bref

1. **La règle « pension − socle » économise environ 185 Md€ par an sur les pensions pour un socle de 1 000 €** (≈ 6,2 % du PIB), sur la distribution officielle des pensions. C'est presque exactement le chiffre du simulateur (184 Md€)… par chance : les trois groupes inventés se compensent à 1 000 €, mais s'écartent ailleurs (−7 Md€ à 500 €, +14 Md€ à 1 500 €, +20 Md€ à 2 000 €).
2. **Aucun retraité ne perd un euro brut** avec cette règle : chacun touche max(pension, socle). C'est sa force juridique. Mais c'est aussi une reprise à 100 % du socle sur les pensions : les retraités, contrairement aux actifs, ne reçoivent pas le socle *en plus*.
3. **Passer le complément en capitalisation coûte cher pendant une génération** : avec un rendement réel de 3,5 %, il faut verser au fonds **≈ 90 Md€ par an** (3 % du PIB) pendant que l'on continue de payer les droits acquis. La **double charge dure ≈ 28 ans** (23 à 35 selon le rendement) et cumule **≈ 1 700 Md€** (1 000 à 3 300).
4. **Le fonds nécessaire atteint ≈ 4 900 Md€** (1,6 fois le PIB 2025), soit **2,7 fois le fonds norvégien** et **20 fois toutes les réserves actuelles** des régimes français (245 Md€).
5. **Les parts d'entreprises reçues au titre de l'héritage ne couvrent qu'environ un cinquième de l'effort** (7 à 55 % selon les hypothèses, ⚠️), et elles sont **déjà comptées** comme recette budgétaire dans le simulateur.
6. **La capitalisation n'est pas un repas gratuit** : au taux du fonds, la valeur actualisée de la double charge égale exactement les gains futurs. Le gain final (≈ 170 Md€ par an après 2090) est payé par les générations de la transition.
7. **Le socle est une vraie assurance contre les krachs** : si le complément baisse de 40 %, le revenu du retraité médian baisse de 17 % (6 % avec un socle de 1 500 €), contre 40 % dans une capitalisation pure.

## 1. Les pensions aujourd'hui (fait sourcé)

- **422,2 Md€** de dépenses de retraite en 2025 (14,1 % du PIB), dont 361 Md€ de droits directs et 39 Md€ de réversions ; **17,4 M** de retraités de droit direct ([COR 2026](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf), p. 65 et 73).
- **Pension moyenne** fin 2023 : 1 666 € brut de droit direct pour les résidents en France (1 541 € net), 1 827 € avec la réversion ([DREES 2025, fiche 05](https://drees.solidarites-sante.gouv.fr/sites/default/files/2025-07/Fiche%2005%20-%20Le%20niveau%20des%20pensions.xlsx)).
- **Distribution (estimation 2025, pension brute totale)** : 10 % des retraités touchent moins de ≈ 500 €, 25 % moins de ≈ 1 110 €, la moitié moins de **≈ 1 750 €**, 10 % plus de ≈ 3 320 €. **21 %** sont sous 1 000 € (27,5 % fin 2020, avant les revalorisations).
- **Par régime** (fin 2023, pension brute de droit direct) : exploitants agricoles 910 €, régime général 1 530 €, fonctionnaires territoriaux et hospitaliers 1 760 €, fonctionnaires civils de l'État 2 440 €, régimes spéciaux 2 580 €, professions libérales 2 740 €. Le régime général à titre principal concerne 70 % des retraités.
- **≈ 0,9 M de retraités vivent à l'étranger** (5,4 %), avec des pensions faibles (carrières en partie hors de France).

## 2. Économie réelle sur les pensions selon le socle et la règle (Md€ 2025 par an)

| Socle | Complément intégral (brut) | Complément sur le net | Complément réduit à 80 % | Borne basse (sans réversion) | Simulateur actuel (3 groupes) | Compléments restant à payer | Retraités sous le socle |
|---|---|---|---|---|---|---|---|
| 500 € | 97 | 126 | 156 | 96 | 104 | 296 | 10 % |
| 800 € | 151 | 180 | 200 | 148 | 155 | 241 | 15 % |
| **1 000 €** | **185** | **214** | **227** | **179** | **184** | **207** | **21 %** |
| 1 200 € | 217 | 244 | 252 | 207 | 214 | 176 | 28 % |
| 1 500 € | 258 | 284 | 285 | 243 | 244 | 135 | 40 % |
| 2 000 € | 310 | 331 | 327 | 288 | 291 | 82 | 60 % |

Lecture : avec un socle de 1 000 €, la règle « pension − socle » réduit les pensions versées de 185 Md€ ; il reste 207 Md€ de compléments à payer. À 1 000 €, la décomposition est : 188 Md€ sur la distribution EIR, −6 Md€ parce que les retraités à l'étranger ne touchent pas le socle, +3 Md€ sur les réversions seules.

**Ce que changent les règles :**
- **Complément sur le net** (+28 Md€) : le complément est calculé sur la pension nette de CSG. Les retraités gardent leur revenu net actuel au lieu de gagner la CSG supprimée (≈ 29 Md€ au total avec la règle « sur le brut »).
- **Complément réduit à 80 %** (+42 Md€) : les pensions au-dessus du socle baissent ; les retraités au-dessus de 1 000 € perdent 20 % de l'écart. Juridiquement plus fragile (réduction de droits acquis).
- **Transition progressive sur 10 ans** (le socle déduit monte de 100 € par an) : manque à gagner cumulé d'**≈ 800 Md€** par rapport à l'application immédiate, car pendant ce temps les retraités cumulent une partie du socle avec leur pension.
- **Cumul** (socle en plus de la pension) : économie nulle ; c'est le scénario « droits acquis conservés en entier » du simulateur (déficit ≈ −380 Md€).

**Pour le simulateur** : remplacer l'expression des trois groupes par `Retraites.economiePourSimulateur(p.socle)` (fichier `modeles/retraites/modele.js`), ou par la table ci-dessous, puis appliquer le coefficient du curseur comme aujourd'hui. La légende peut devenir : « Distribution des pensions par tranches de 100 € (DREES, EIR 2020) ramenée en 2025 ; retraités à l'étranger exclus. »

`[[0,0],[100,20.2],[200,40],[300,59.4],[400,78.5],[500,97.2],[600,115.6],[700,133.7],[800,151.4],[900,168.8],[1000,185.5],[1100,201.6],[1200,216.8],[1300,231.4],[1400,245.1],[1500,258.1],[1600,270.3],[1700,281.6],[1800,292],[1900,301.6],[2000,310.4]]`

## 3. Coût et durée de la double charge (complément intégral, réforme en 2027)

| Socle | Scénario | Apport annuel au fonds | Double charge : durée | Cumul | Fonds en 2100 | Part couverte par l'héritage |
|---|---|---|---|---|---|---|
| 1 000 € | bas (r = 2 %) | 140 Md€ (4,7 % du PIB) | 35 ans (jusqu'en 2062) | 3 260 Md€ | 6 160 Md€ (206 % du PIB) | 7 % |
| **1 000 €** | **central (3,5 %)** | **92 Md€ (3,1 %)** | **28 ans (2055)** | **1 740 Md€** | **4 890 Md€ (163 %)** | **22 %** |
| 1 000 € | haut (5 %) | 63 Md€ (2,1 %) | 23 ans (2050) | 1 000 Md€ | 4 000 Md€ (134 %) | 55 % |
| 800 € | central | 107 Md€ | 28 ans | 2 030 Md€ | 5 700 Md€ | 19 % |
| 1 200 € | central | 78 Md€ | 28 ans | 1 480 Md€ | 4 160 Md€ | 26 % |
| 1 500 € | central | 60 Md€ | 28 ans | 1 130 Md€ | 3 180 Md€ | 33 % |

**Trajectoire centrale (socle 1 000 €), Md€ par an :**

| Année | Compléments dus | dont droits acquis (budget) | dont fonds | Actif du fonds | Double charge |
|---|---|---|---|---|---|
| 2027 | 210 | 210 | 0 | 92 | +92 |
| 2035 | 220 | 212 | 8 | 930 | +84 |
| 2045 | 232 | 193 | 39 | 2 130 | +53 |
| 2055 | 245 | 149 | 95 | 3 310 | −3 |
| 2065 | 257 | 94 | 163 | 4 220 | −71 |
| 2075 | 263 | 39 | 224 | 4 710 | −132 |
| 2090 | 263 | 1 | 263 | 4 890 | −171 |

Lecture : en 2045, l'État paie encore 193 Md€ de droits acquis **et** verse 92 Md€ au fonds, soit 53 Md€ de plus que ce qu'aurait coûté la répartition. À partir de 2055, la capitalisation devient moins chère ; en régime permanent, elle coûte 92 Md€ par an au lieu de 263 Md€.

- **Dette implicite des compléments** (valeur actualisée des droits acquis au-dessus du socle) : ≈ 4 300 Md€, **143 % du PIB** (118 à 179 %). Avec le cumul (droits acquis absolus), 272 % du PIB. Repère : Eurostat évalue l'ensemble des droits à pension déjà acquis en France à **397 % du PIB** fin 2021.
- **L'identité de Sinn** se vérifie : au taux du fonds (3,5 %), la valeur actualisée de la double charge vaut ≈ 0 (13 Md€ sur 1 740). Elle ne devient un gain (≈ 6 800 Md€) que si l'on actualise à 1 %, c'est-à-dire si l'on accepte que la génération de la transition paie pour les suivantes.
- **Variante « cumul »** : si l'on garde les pensions entières en plus du socle, l'apport monte à 174 Md€ par an et le fonds à 9 300 Md€.

### Sensibilité du rendement réel du fonds (03/11/2026, défaut inchangé à 3,5 %)

Le rapport annuel 2025 du fonds norvégien donne un rendement réel net de **4,34 %** par an depuis 1998 (V6773). La consigne de cette passe évoquait 3,96 % : ce chiffre ne figure pas dans le rapport (le plus proche est 3,99 % sur cinq ans), je calcule donc les deux. Socle de 1 000 €, complément intégral, réforme en 2027, scénario central pour tout le reste ; seul r change. Code : [`sensibilite_rendement.js`](sensibilite_rendement.js), sortie brute : [`resultats-sensibilite-rendement.txt`](resultats-sensibilite-rendement.txt).

| Rendement réel net | Apport annuel au fonds | Double charge moyenne 2027-2036 (ligne de la synthèse) | Durée | Cumul | Fonds en 2100 | Gain actualisé à 1 % |
|---|---|---|---|---|---|---|
| 4,34 % (NBIM, 1998-2025) | 74 Md€ (2,5 % du PIB) | 70,6 Md€/an | 25 ans (2052) | 1 264 Md€ | 4 360 Md€ | 8 328 Md€ |
| 3,96 % (valeur de la consigne) | 82 Md€ (2,7 %) | 78,1 Md€/an | 26 ans (2053) | 1 456 Md€ | 4 589 Md€ | 7 705 Md€ |
| **3,5 % (défaut, central)** | **92 Md€ (3,1 %)** | **88,5 Md€/an** | **28 ans (2055)** | **1 740 Md€** | **4 894 Md€** | **6 838 Md€** |
| 2,5 % | 121 Md€ (4,1 %) | 117,7 Md€/an | 32 ans (2059) | 2 620 Md€ | 5 685 Md€ | 4 415 Md€ |
| 2 % (bas) | 140 Md€ (4,7 %) | 136,6 Md€/an | 35 ans (2062) | 3 260 Md€ | 6 161 Md€ | 2 844 Md€ |

**Lecture.** Chaque point de rendement perdu coûte 20 à 30 Md€ par an de double charge au début de la transition (de 78 à 88,5 Md€ entre 3,96 % et 3,5 % ; de 88,5 à 117,7 entre 3,5 % et 2,5 %). Passer du défaut au rendement historique du fonds norvégien allège la ligne de la synthèse de 10 Md€ (3,96 %) à 18 Md€ (4,34 %) par an ; descendre à 2,5 % l'alourdit de 29 Md€. Les chiffres de 3,5 % et de 2 % retrouvent ceux du bilan de la synthèse (88,5 et 136,6). La sensibilité est asymétrique : le risque pèse plus sur le bas que le gain sur le haut.

**Pourquoi je ne change pas le défaut.** (1) Le fonds norvégien est un fonds d'actions à 71 % géré à 0,07 % de frais, sur 28 ans dont 2025 à +15 % ; son rendement n'est pas celui d'un fonds placé en partie en titres français (actions françaises : 3,25 % réel sur 1870-2015, V6774). (2) Un fonds de 1,5 fois le PIB ferait baisser les rendements qu'il vise (prix d'actifs, non chiffré). (3) Le modèle applique r sur 170 ans : une période de 28 ans, avec un point de départ favorable, ne l'établit pas. (4) Un défaut plus bas est plus prudent pour une décision de cette ampleur. Ce choix reste de Claude, pas une donnée : la fourchette 2 à 5 % couvre les repères sourcés.

**Effet sur les totaux de la synthèse.** Aucun : le défaut n'a pas bougé (les tests de `modeles/synthese/` passent inchangés). Si l'auteur retenait 3,96 %, la ligne T13 passerait de −88,5 à −78,1 Md€ par an, soit +10 Md€ sur le total central de la transition ; à 2,5 %, −117,7 (−29 Md€).

## 4. Taille du fonds nécessaire et comparaisons

| Fonds | Actif | Source |
|---|---|---|
| **Fonds nécessaire (central, socle 1 000 €)** | **≈ 4 900 Md€ (1,6 × PIB 2025)** | modèle |
| Fonds de pension global de l'État norvégien | 21 268 Md NOK fin 2025 (≈ 1 800 Md€ ⚠️) | [NBIM](https://www.nbim.no/en/news-and-insights/reports/2025/annual-report-2025/web-report-annual-report-2025/) |
| CPP Investments (Canada) | 793 Md CAD au 31/03/2026 | [communiqué](https://www.newswire.ca/news-releases/cpp-investments-net-assets-total-793-3-billion-at-2026-fiscal-year-end-814459989.html) |
| Réserves des régimes français + FRR | 244,6 Md€ fin 2025 (8,2 % du PIB), dont Agirc-Arrco 113,6 et FRR 20,7 | [COR 2026](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf), p. 98-99 |

Une capitalisation par comptes individuels détient environ **20 années de versements** à 3,5 % (16 à 5 %, 24 à 2 %) : pour 207 Md€ de compléments, ≈ 4 100 Md€. Les deux méthodes convergent vers **4 000 à 6 000 Md€**.

## 5. Krach, décennies perdues et rôle du socle

- **Aléa de marché** (σ = 12 %) : avec l'apport « juste suffisant » de 92 Md€, le fonds s'épuise avant 2100 dans **28 % des tirages**. Pour 90 % de réussite, il faut ≈ **115 Md€** par an ; pour 95 %, ≈ 123 Md€.
- **Krach de 40 % en 2060** : il faut relever l'apport à 115 Md€ par an (+23 Md€, pour toujours) ; sinon le fonds s'épuise vers 2094.
- **34 ans sans rendement à partir de 2060** (le Nikkei a mis 34 ans, de décembre 1989 à février 2024, à retrouver son record) : apport à 136 Md€ par an (+44 Md€) ; sinon épuisement vers 2090.
- **Le socle comme assurance** : avec un socle de 1 000 €, **52 %** de la masse des pensions est exposée au marché ; une baisse de 40 % du complément réduit le revenu du retraité médian (≈ 1 750 €) de **17 %**, contre 40 % sans socle. Avec 1 500 €, 34 % d'exposition et −6 %.

## 6. Précédents

- **Chili (1981)** : passage à la capitalisation individuelle. Coût de transition ≈ 3 à 4 points de PIB par an pendant des décennies (déficit opérationnel 3,2 % + bons de reconnaissance 0,6 % en moyenne 1981-2003, ≈ 7 % les premières années ⚠️). Le Chili a ensuite **ajouté un socle universel non contributif** (pension garantie universelle, 2022) puis, en 2025, une cotisation employeur de 7 points dont une partie finance une assurance sociale solidaire.
- **Suède (1999)** : la part capitalisée est restée petite (2,5 points de cotisation sur 18,5, confirmé par AP7, V6778), d'où une transition légère ; le fonds public par défaut (AP7 Såfa) a fait ≈ 7,4 % par an (nominal, 2000-2022 ; 8,4 % sur 2000-2025 selon le rapport AP7 2025), mieux que la moyenne des fonds privés (4,8 % ⚠️ non recontrôlé).
- **Retours en arrière** : Argentine (2008, ≈ 24 Md$ d'actifs repris), Hongrie (2010, ≈ 10 Md€), Pologne (2014, la moitié des actifs des fonds) ⚠️ sources secondaires.
- **France** : le Fonds de réserve pour les retraites, créé pour lisser le choc démographique, verse depuis 2011 2,1 Md€ par an (1,45 Md€ depuis 2025) au remboursement de la dette sociale ; il ne pèse plus que 20,7 Md€.

## 7. Ce qui appuie, nuance ou contredit l'auteur

**Appuie**
- **L'ordre de grandeur du simulateur est bon** à 1 000 € : 185 Md€ sourcés contre 184 supposés. L'hypothèse non sourcée peut être remplacée sans changer le bilan.
- **La règle « pension − socle » respecte les droits acquis en montant brut** : personne ne touche moins qu'aujourd'hui. C'est la version la plus défendable devant un juge (⚠️ V471).
- **L'architecture « socle + capitalisation » est celle vers laquelle le Chili a convergé** après 40 ans : capitalisation d'abord, puis socle universel ajouté (2022).
- **Un grand fonds public peut être géré pour presque rien** : 0,04 % de frais en 2025 pour le fonds norvégien, 4,3 % de rendement réel net depuis 1998 ; le fonds public suédois par défaut a battu les fonds privés.
- **Le socle protège réellement contre les krachs** : il divise par 2 à 7 la perte de revenu du retraité médian.
- **La thèse « la technologie doit financer les retraites »** a un sens précis : un fonds qui possède du capital touche la part des revenus qui va au capital. Si l'automatisation réduit la part du travail, c'est la seule source qui grandit.

**Nuance**
- **Le complément intégral revient à reprendre 100 % du socle sur les pensions.** Un actif garde son socle plus la moitié de ses revenus ; un retraité à 1 750 € garde 1 750 €. Il faudra l'expliquer, sous peine d'être perçu comme « on me retire 1 000 € pour me les rendre ».
- **Le complément sur le brut offre ≈ 29 Md€ aux retraités** (fin de la CSG sur leurs pensions). La règle « sur le net » est plus neutre et rapporte 28 Md€ de plus au budget.
- **La double charge est réelle et longue** : ≈ 3 % du PIB par an au départ, ≈ 28 ans, sans cotisations pour la financer puisque le projet les supprime. Elle s'ajoute au trou du simulateur.
- **L'héritage payé en parts ne suffit pas** et il est déjà dépensé une fois dans le simulateur : chaque part versée au fonds manque au budget.
- **Le gain de la capitalisation est un transfert entre générations, pas une création de richesse** (identité de Sinn) : il faut le présenter comme un choix — faire payer la transition par les héritiers d'aujourd'hui au profit des retraités de demain.
- **Les retraités à l'étranger** (0,9 M) posent une question d'éligibilité non tranchée : leur verser aussi le socle coûterait ≈ 11 Md€ (dont ≈ 6 récupérés sur leurs pensions) ; ne pas le verser et leur retirer la part « socle » de leur pension serait contraire aux droits acquis.

**Contredit**
- **« La Bourse est toujours au-dessus de l'immobilier »** : faux sur longue période. Sur 16 pays (1870-2015), le logement a rapporté autant que les actions (7,05 % contre 6,89 % réels par an) avec deux fois moins de volatilité, et **plus** en rendement composé (6,61 % contre 4,64 %). **En France, les actions ont rapporté 3,25 % réels par an contre 6,54 % pour le logement** ; l'inverse n'est vrai que depuis 1980 (11,07 % contre 6,39 %). Il est plus juste de dire : « un portefeuille mondial d'actions a historiquement rapporté 4 à 5 % réels par an sur longue période, avec des krachs ».
- **« La répartition est à bout de souffle »** : le COR projette des dépenses stables autour de 14 % du PIB jusqu'en 2045 (15,3 % en 2070) et un déficit de 0,2 point de PIB en 2030, 0,9 en 2045 et 2,4 en 2070. Le déséquilibre est réel et croissant, mais il est de l'ordre de 1 à 2 points de PIB, pas un effondrement. La vraie raison de changer est celle du chapitre 14 (si l'IA réduit la part du travail), pas la démographie seule.
- **« Un fonds souverain protégé »** : les précédents (Argentine, Hongrie, Pologne, et le FRR français lui-même) montrent que les fonds de long terme sont repris en période de déficit. Sans verrou constitutionnel, l'hypothèse d'un fonds de 5 000 Md€ intact pendant 70 ans est fragile.

## Steelman de l'objection principale

**Objection** : « Votre capitalisation ne rapporte rien de plus une fois la transition payée (Sinn) ; elle met les retraités à la merci des marchés ; et le Chili, modèle de la capitalisation, a dû ajouter un socle public et une cotisation patronale solidaire. Gardez la répartition et ajustez-la. »

**Réponse** : l'objection est juste sur le premier point, et ce modèle le confirme. Mais le projet ne repose pas sur un rendement « gratuit ». Il repose sur trois choix assumés : (1) un **socle public** qui porte le risque de base, ce que le Chili n'avait pas en 1981 et a dû ajouter ; (2) un **financement de la transition par l'héritage**, c'est-à-dire un transfert explicite des héritiers vers les retraités futurs ; (3) une **couverture contre l'automatisation** : si la part du travail dans la valeur ajoutée baisse, une retraite assise sur les salaires s'appauvrit, alors qu'un fonds détenant du capital en profite. Ce troisième argument est le seul qui rende la capitalisation supérieure *en soi* ; il dépend d'un scénario (bascule IA) qui reste une hypothèse.

## Pour aller plus loin (manques)
- Distribution EIR 2024 (dès sa publication) ; distribution de la pension totale des seuls résidents.
- Part des biens professionnels dans les successions (pour l'apport des parts d'entreprise).
- Table de mortalité et carrières différenciées (COR, modèle Trajectoire de la DREES).
- Lien avec T4 (offre de travail des seniors) et T14 (gagnants et perdants par niveau de pension).

## Capitalisation progressive (T48)

Tâche T48 · 01/11/2026 · méthode : [`methode.md`](methode.md) § 9 (hypothèses H21-H40) · code : [`capitalisation.js`](capitalisation.js), tests [`test_capitalisation.js`](test_capitalisation.js) (36 contrôles), tables complètes année par année : [`resultats-capitalisation.txt`](resultats-capitalisation.txt) (`jsc capitalisation.js rapport_capitalisation.js`). Recherche et sources : [`sources/recherche-retraite-capitalisation.md`](../../sources/recherche-retraite-capitalisation.md). Euros constants 2025 ; PIB 2025 ≈ 2 994 Md€ (⚠️ implicite : 422,2 / 0,141) ; scénarios **bas** (r 2 %, g 0 %, σ 14 %, dette 2 %), **central** (3,5 %, 0,6 %, 12 %, 1,5 %), **haut** (5 %, 1,0 %, 11 %, 1 %). Ordres de grandeur sous hypothèses, jamais des prédictions ; les ⚠️ non sourcés sont dans `methode.md` (H24, H28, H35, H36, H38-H40).

### Ce qu'il faut retenir (écrit pour être vrai)

1. **L'étape 0-1 (sanctuarisation + nouveau décompte) ne coûte rien par construction** (H30-H31) : mêmes pensions versées, mêmes cotisations. Elle ne crée pas d'argent non plus ; elle remplace le déficit annoncé par le COR (−0,9 % du PIB en 2045, −2,4 % en 2070) par une règle d'ajustement. Elle redistribue : la conversion à l'espérance de vie moyenne fait **perdre 13 % de valeur viagère** à qui vit 19 ans de retraite au lieu de 22, et **gagner 13 %** à qui en vit 25 (⚠️ durées illustratives).
2. **Pic de la double charge, central** : **15 Md€/an (0,48 % du PIB) pour 1 point, 45 Md€ (1,43 %) en 2034 pour 3 points, 91 Md€ (2,75 %) en 2042 pour 6 points.** Cela reprend T48 (44 et 83-91 Md€). Cumul sur 30 ans : 395, 1 113 et 1 946 Md€. La double charge ne tombe sous 0,1 % du PIB qu'en **2070 (1 pt), 2081 (3 pts), 2090 (6 pts)**, soit 43 à 63 ans, et seulement parce que la première génération entièrement servie par le fonds part en 2067 ; elle est déjà divisée par deux 25 à 30 ans après le pic.
3. **Le fonds** : au central, **1 760 Md€ à 30 ans (49 % du PIB) et 3 335 Md€ à 60 ans (77 %)** pour 3 points ; 651 / 1 115 Md€ pour 1 point ; 2 909 / 6 562 Md€ (152 % du PIB à 60 ans) pour 6 points. Réserves actuelles : 245 Md€.
4. **Le financement n'est pas gratuit.** Par la dette de transition à 1,5 %, 3 points laissent en 2086 **2 724 Md€ de dette (63 % du PIB), 41 Md€/an d'intérêts** ; le fonds (3 335 Md€) la couvre au central (actif net +611 Md€), **pas au bas** (−1 022 Md€ à 2 % de rendement, 0 % de croissance et 2 % de dette), car r − i y est nul. Par le prélèvement : **+3 points de cotisation temporaires au pic** (3,0 ; 5,7 pour 6 points), au-dessus de 2 points de 2033 à 2053 (21 ans) pour 3 points, et de 2033 à 2071 (39 ans) pour 6 points.
5. **Pension d'un salarié né en 2000 (3 points, central)** : **+11 % en espérance** par rapport à la répartition seule (Smic 1 491 contre 1 339 €/mois ; médian 2 334 contre 2 097 ; cadre 4 339 contre 3 906), **+4 % pour 1 point, +18 % pour 6**. Le fonds pèse 14 % du capital à 3 points (6 % à 1, 23 % à 6). Le rapport est le même aux trois niveaux de salaire (proportionnalité) : cette réforme n'est ni plus ni moins redistributive que le régime actuel, la redistribution passe par le socle (T47).
6. **Dispersion** (3 000 tirages, σ = 12 %) : à 3 points, le rapport pension mixte / répartition seule est de **1,00 au 5e centile, 1,09 à la médiane, 1,31 au 95e** ; la probabilité d'être en dessous de la répartition seule est de **4 %** au central, **18 %** au bas, **0,4 %** au haut. À 6 points : 1,01 / 1,15 / 1,48. Plus de points = plus d'espérance **et** plus de dispersion, mais la perte est bornée à quelques % tant que la part capitalisée reste petite.
7. **Stress** (médian, 3 points) : krach de −40 % l'année avant le départ : **+2,8 %** (le fonds a déjà cumulé 37 ans) ; 20 dernières années à rendement nul : **−0,4 %** ; rendement réel nul toute la carrière : **−1,4 %** (−2,3 % à 6 points). Une perte réelle ne vient que d'une décennie perdue **longue**, et elle est modeste, parce que 3 points ne représentent que 14 % du capital.
8. **Compartiment « entreprises d'intérêt commun »** : plafonné à 15 %, il retire au rendement attendu **au plus 0,3 point** (−2 points d'écart) et ajoute **0,03 à 0,24 point de volatilité** au fonds (2,4 points au test extrême) ; le rapport médian passe de 1,090 à 1,075 et la probabilité d'être perdant de 4,2 à 6,8 %. Le test extrême (écart −3,5 points, volatilité 30 %, corrélation 0,9) donne 11 % de probabilité d'être perdant. Le risque est faible par le plafond, mais le chiffre repose sur des écarts **non sourcés** (H35-H36) et ne mesure pas le risque politique (H37), qui est le vrai.
9. **Ce que le modèle ne montre pas** : le gain de 11 % est la **prime de risque des actions** (r − ρ) ; au niveau de la collectivité, il n'existe que si l'on compare un rendement risqué à un coût de dette sans risque (identité de Sinn : à i = r, la valeur actualisée de la double charge est nulle, test à 0,7 %). Le risque de la répartition (démographie, décision politique) est ici supposé nul.

### 1. Étape 0-1 : sanctuarisation et nouveau décompte

| Mécanisme | Effet financier | Effets redistributifs (qui gagne, qui perd) |
|---|---|---|
| Droits acquis convertis en points ou capital notionnel, garantis | 0 ; 422 Md€/an de pensions inchangés ; dette implicite de 397 % du PIB (Eurostat, 2021) reconnue, non créée | personne ne perd ; les générations anciennes sont protégées contre un ajustement futur, au prix d'un effort reporté sur les nouveaux droits |
| Compte unique, revalorisé sur la masse salariale (ρ) | 0 à l'entrée ; règle de frein symétrique (type suédois) à définir | ρ ≈ 0,6 % réel : proche du TRI du COR (0,8 %), donc pas de baisse en soi ; la baisse relative annoncée (pension moyenne de 54,6 à 45,3 % du revenu d'activité en 2070) existe déjà sans réforme |
| Conversion en rente à l'espérance de vie de la génération | 0 | à capital égal : **−13 %** de valeur viagère pour 19 ans de retraite, **+13 %** pour 25 ans (D = 22 pour la moyenne) : les catégories à espérance de vie courte financent les longues ; à compenser par le socle ou des bonifications explicites (⚠️ écart par catégorie sociale non sourcé ici) |
| Fin du calcul sur les 25 meilleures années (carrière entière) | 0 | favorise les carrières plates, pénalise les carrières en cloche ; **non chiffré** (⚠️ à calculer sur l'échantillon interrégimes de la DREES) |
| Droits familiaux, réversion, minimum contributif : financés explicitement | à chiffrer | les femmes et les carrières interrompues dépendent de ces bonifications ; sans elles, leur pension baisse ; non chiffré |

Exemple (fonction `compteNotionnel`) : salaire médian de 33 692 € brut, 43 ans de carrière, ρ = 0,6 % : capital notionnel de 460 676 €, rente de 1 857 €/mois (coefficient de conversion 4,84 % par an). Ce chiffre n'est pas comparable à la pension du tableau 5 ci-dessous, qui suppose en plus une pente de carrière de 0,5 % et des salaires croissant à g.

### 2. Double charge, fonds et dette année par année

Tableau A : synthèse par scénario. « Dette » : dette de transition cumulée à i ; « gain retraités » : pensions du fonds moins rentes de répartition évitées ; l'année finale est 2086 (t = 59).

| Scénario | Points | Pic Md€/an (% du PIB), année | Points temporaires au pic | Cumul 30 / 60 ans (Md€) | Fonds 30 / 60 ans (Md€ ; % PIB) | Dette 30 / 60 ans (Md€ ; % du PIB) | Intérêts 60 ans (Md€/an) | Gain retraités 60 ans (Md€/an) | Actif net 60 ans (Md€) | Double charge < 0,1 % du PIB dès |
|---|---|---|---|---|---|---|---|---|---|---|
| bas | 1 | 15 (0,49 %), 2027 | 1,0 | 366 / 455 | 482 (16 %) / 659 (22 %) | 510 / 1 059 (35 %) | 21 | 13 | −400 | 2070 |
| bas | 3 | 44 (1,45 %), 2033 | 3,0 | 1 022 / 1 362 | 1 316 (44 %) / 1 973 (66 %) | 1 370 / 2 995 (100 %) | 60 | 37 | −1 022 | 2081 |
| bas | 6 | 83 (2,79 %), 2042 | 5,7 | 1 763 / 2 701 | 2 203 (74 %) / 3 892 (130 %) | 2 259 / 5 480 (183 %) | 110 | 68 | −1 588 | 2091 |
| **central** | 1 | 15 (0,48 %), 2031 | 1,0 | 395 / 503 | 651 (18 %) / 1 115 (26 %) | 502 / 933 (22 %) | 14 | 31 | +181 | 2070 |
| **central** | **3** | **45 (1,43 %), 2034** | 3,0 | 1 113 / 1 534 | **1 760 (49 %) / 3 335 (77 %)** | 1 377 / 2 724 (63 %) | 41 | 90 | **+611** | 2081 |
| **central** | 6 | 91 (2,75 %), 2042 | 5,7 | 1 946 / 3 120 | 2 909 (81 %) / 6 562 (152 %) | 2 330 / 5 208 (121 %) | 78 | 163 | +1 355 | 2090 |
| haut | 1 | 15 (0,46 %), 2034 | 1,0 | 415 / 539 | 856 (21 %) / 1 759 (32 %) | 485 / 807 (15 %) | 8 | 66 | +952 | 2069 |
| haut | 3 | 47 (1,39 %), 2037 | 3,0 | 1 179 / 1 664 | 2 285 (56 %) / 5 259 (96 %) | 1 354 / 2 419 (44 %) | 24 | 191 | +2 841 | 2081 |
| haut | 6 | 97 (2,72 %), 2042 | 5,7 | 2 080 / 3 443 | 3 713 (91 %) / 10 314 (188 %) | 2 338 / 4 799 (87 %) | 48 | 347 | +5 515 | 2090 |

Tableau B : trajectoire année par année, **central** (Md€ de 2025 ; tout le détail, chaque année de 2027 à 2086, dans `resultats-capitalisation.txt`).

| Année | Points (3 pts / 6 pts) | Versé au fonds, 3 pts | Double charge, 1 pt | Double charge, 3 pts (% PIB) | Double charge, 6 pts (% PIB) | Fonds, 3 pts | Dette, 3 pts | Part des pensions servie par le fonds, 3 pts |
|---|---|---|---|---|---|---|---|---|
| 2027 | 1 / 1 | 14,7 | 14,7 | 14,7 (0,48 %) | 14,7 (0,48 %) | 15 | 15 | 0 % |
| 2032 | 2 / 2 | 30,2 | 14,8 | 29,9 (0,96 %) | 29,9 (0,96 %) | 148 | 138 | 0,1 % |
| 2037 | 3 / 4 | 46,7 | 14,6 | 45,0 (1,40 %) | 60,5 (1,88 %) | 424 | 381 | 0,6 % |
| 2042 | 3 / 6 | 48,1 | 13,8 | 43,5 (1,31 %) | 91,1 (2,75 %) | 740 | 638 | 1,5 % |
| 2047 | 3 / 6 | 49,6 | 12,5 | 40,5 (1,19 %) | 87,8 (2,57 %) | 1 088 | 903 | 3,0 % |
| 2057 | 3 / 6 | 52,6 | 8,9 | 30,6 (0,84 %) | 72,6 (2,00 %) | 1 835 | 1 428 | 7,8 % |
| 2067 | 3 / 6 | 55,9 | 4,8 | 18,5 (0,48 %) | 49,6 (1,29 %) | 2 542 | 1 917 | 14,4 % |
| 2077 | 3 / 6 | 59,3 | 1,4 | 7,0 (0,17 %) | 25,2 (0,62 %) | 3 058 | 2 353 | 21,4 % |
| 2086 | 3 / 6 | 62,6 | 0,1 | 1,2 (0,03 %) | 8,6 (0,20 %) | 3 335 | 2 724 | 25,1 % |

Lecture : (i) la charge est étalée sur ~55 ans parce qu'une génération qui partira dans 40 ans commence à cotiser aujourd'hui ; (ii) **à 6 points, la charge dépasse 2 % du PIB de 2039 à 2057 (jamais à 3 points)**, quand le déficit de départ de la voie R est déjà de 169 Md€ (`modeles/systeme-ideal/resultats.md` § 11) : l'étape 2c n'est pas finançable sans arbitrage explicite ; (iii) la part des pensions servie par le fonds (25 % en 2086 à 3 points, alors que 3 points représentent 10,8 % des cotisations) dépasse la part de cotisation parce que r > ρ : c'est ce gain qui rembourse la dette ; (iv) la dette de 2 724 Md€ n'est remboursée par personne dans le modèle : le fonds la couvre sur le papier, mais ses intérêts (41 Md€/an) doivent être prélevés sur le gain des retraités (90 Md€/an), c'est-à-dire que les retraités du futur financent la transition par un **prélèvement sur leur rente**, ou que l'État sert la dette indéfiniment.

Pour la voie R : le déficit de départ de 169 Md€ laisse une marge nulle ; 1 point (15 Md€/an, 0,5 % du PIB) est le seul palier dont le financement soit discutable sans arbitrage nouveau.

### 3. Pension future d'un salarié né en 2000 (retraite en 2065)

Tableau 5. €/mois, euros 2025 avec salaires croissant à g, scénario central, déterministe. Taux de remplacement = pension répartition seule / dernier salaire brut.

| Profil | Taux de remplacement (répartition) | Répartition seule | 1 point | 3 points | 6 points |
|---|---|---|---|---|---|
| Smic (21 876 €/an, pente 0) | 58 % | 1 339 | 1 399 (+4,5 %) | 1 491 (+11,4 %) | 1 578 (+17,8 %) |
| Salaire médian (33 692 €/an, pente 0,5 %) | 52 % | 2 097 | 2 189 (+4,4 %) | 2 334 (+11,3 %) | 2 473 (+17,9 %) |
| Cadre (60 000 €/an, pente 1,5 %) | 43 % | 3 906 | 4 071 (+4,2 %) | 4 339 (+11,1 %) | 4 607 (+18,0 %) |

Les taux de remplacement sont ceux du modèle (aucun plafond de cotisation, aucune décote, aucune bonification) ; le COR donne 54,6 % de pension moyenne relative en 2025 et 45,3 % en 2070 : l'ordre de grandeur est cohérent, pas le détail. Pension du Smic et du médian en scénario **bas** (3 points) : 991 → 1 059 €/mois (Smic, +6,9 %) ; 1 552 → 1 658 (médian, +6,8 %) ; en scénario **haut** : 1 634 → 1 941 (Smic, +18,8 %) ; 2 559 → 3 035 (médian, +18,6 %).

Tableau 6. Dispersion due au risque de marché, médian, 3 000 tirages, rapport pension mixte / répartition seule (1,00 = pas de gain) ; pensions en €/mois ; central sauf mention.

| Points | Scénario | Mixte p5 / p50 / p95 (€/mois) | Rapport p5 / p50 / p95 | Probabilité de faire moins bien que la répartition seule |
|---|---|---|---|---|
| 1 | central | 2 100 / 2 170 / 2 350 | 1,001 / 1,035 / 1,120 | 4,1 % |
| 3 | bas | 1 514 / 1 623 / 1 924 (répartition 1 552) | 0,976 / 1,046 / 1,240 | 17,5 % |
| **3** | **central** | **2 104 / 2 287 / 2 739** (répartition 2 097) | **1,003 / 1,090 / 1,306** | **4,2 %** |
| 3 | haut | 2 664 / 2 963 / 3 670 (répartition 2 559) | 1,041 / 1,158 / 1,434 | 0,4 % |
| 6 | central | 2 109 / 2 405 / 3 097 | 1,006 / 1,147 / 1,477 | 3,9 % |

Les Smic et cadre ont les mêmes rapports (à 0,01 près) ; leurs montants en €/mois sont dans `resultats-capitalisation.txt`, section D. **La dispersion est asymétrique** : la perte maximale au 5e centile est de 2,4 % au bas à 3 points, le gain au 95e de 24 à 43 % : cela tient à la part capitalisée limitée (14 % du capital) et à l'hypothèse de rendements indépendants d'une année à l'autre ; les marchés réels ont de la persistance (décennies perdues, §5 de T13) : les stress ci-dessous sont plus parlants.

Tableau 7. Stress (médian, central, répartition seule = 2 097 €/mois).

| Points | Krach −40 % l'année avant le départ | 20 dernières années à rendement réel nul | Rendement réel nul toute la carrière |
|---|---|---|---|
| 1 | 2 122 (+1,2 %) | 2 096 (−0,1 %) | 2 087 (−0,5 %) |
| 3 | 2 156 (+2,8 %) | 2 089 (−0,4 %) | 2 069 (−1,4 %) |
| 6 | 2 176 (+3,8 %) | 2 074 (−1,1 %) | 2 050 (−2,3 %) |

### 4. Compartiment « entreprises d'intérêt commun » (3 points, central, médian)

Écart Δ = rendement du compartiment − rendement du cœur indiciel ; σ_C = 20 %, κ = 0,6 sauf mention. ⚠️ Δ, σ_C et κ sont des hypothèses de Claude (H35-H36), sans source.

| Poids q | Δ | Rendement du fonds | Volatilité du fonds | Rapport mixte/répartition : déterministe / p5 / p50 | Probabilité de perdre | Fonds à 30 ans (dont compartiment), Md€ | Actif net à 60 ans, Md€ |
|---|---|---|---|---|---|---|---|
| 0 % | — | 3,50 % | 12,00 % | 1,113 / 1,003 / 1,090 | 4,2 % | 1 760 (0) | 611 |
| 5 % | −0,5 pt | 3,48 % | 12,03 % | 1,112 / 1,002 / 1,089 | 4,3 % | 1 754 (88) | 594 |
| 10 % | −2,0 pts | 3,30 % | 12,11 % | 1,102 / 0,998 / 1,080 | 5,6 % | 1 714 (171) | 479 |
| 10 % | −0,5 pt | 3,45 % | 12,11 % | 1,110 / 1,001 / 1,088 | 4,6 % | 1 748 (175) | 577 |
| 10 % | +0,5 pt | 3,55 % | 12,11 % | 1,116 / 1,004 / 1,093 | 4,1 % | 1 772 (177) | 645 |
| 15 % | −2,0 pts | 3,20 % | 12,24 % | 1,096 / 0,995 / 1,075 | 6,8 % | 1 692 (254) | 416 |
| 15 % | −0,5 pt | 3,43 % | 12,24 % | 1,109 / 1,000 / 1,086 | 5,0 % | 1 743 (261) | 561 |
| 15 % | +0,5 pt | 3,58 % | 12,24 % | 1,117 / 1,003 / 1,093 | 4,1 % | 1 777 (267) | 662 |
| 15 % | −3,5 pts (rendement nul en réel) | 2,98 % | 12,24 % | 1,085 / 0,990 / 1,065 | 8,7 % | 1 643 (246) | 278 |
| 15 % | −2,0 pts, σ_C 30 %, κ 0,9 | 3,20 % | 14,38 % | 1,096 / 0,984 / 1,068 | 11,2 % | 1 692 (254) | 416 |

Lecture : à 15 %, le compartiment représente **≈ 250 Md€ à 30 ans** pour 3 points, soit 10 fois les réserves du FRR. Il **ne change presque pas** le rendement du fonds (−0,02 à −0,5 point) tant que l'écart reste modeste ; ce qu'il change surtout, c'est l'**actif net à 60 ans** (611 → 416 Md€ à −2 points, soit −32 %), parce que l'écart r − i est faible (2 points) et que chaque dixième de point pèse sur 60 ans. Avec une corrélation à 0,9 et une volatilité de 30 % (concentration thématique, IA, énergie), la probabilité de perdre passe de 4 % à 11 %. Conclusion : le plafond de 10 à 15 % **borne** le risque financier ; il ne traite pas le risque de capture politique (H37), qui ne se mesure pas par un écart-type.

### Steelman de la section

**Objection** : « Ces chiffres sont trop beaux : +11 % de pension pour 3 points ; vous comparez un rendement risqué à un coût de dette sans risque, vous supposez la répartition certaine, vous oubliez que le fonds sera repris en temps de déficit. »
**Réponse** : juste sur les trois points, et la section le dit (point 9 ci-dessus, limites de `methode.md` § 9). Ce que le modèle établit est plus modeste : (1) l'ordre de grandeur de la **bosse** (0,5, 1,4 et 2,75 % du PIB au pic) et sa durée (≈ 55 ans) ; (2) le fait que la part capitalisée **ne met pas en danger** un salarié au Smic ou au médian, même au pire des stress testés (−1,4 % à 3 points, −2,3 % à 6) ; (3) le fait que le gain ne vient que d'un écart de rendement (r − ρ ≈ 3 points) qui n'existe que si le fonds est protégé de la ponction : sans verrou (§ 6 de la recherche), le modèle ne vaut rien. La règle 7 demande de le dire : **la proposition se joue sur la gouvernance, pas sur le rendement.**

### Ce qui manque
- Cohortes réelles (table de mortalité, démographie du COR), carrières différenciées par sexe, plafond de cotisation et régimes complémentaires.
- Effets sur l'épargne privée (V469) et sur les prix d'actifs d'un fonds de 50 à 150 % du PIB.
- Écart de rendement et risque des entreprises à participation publique (APE, Bpifrance) pour sourcer H35-H36.
- Fin des 25 meilleures années, réversion et droits familiaux : effets sur les femmes et les carrières interrompues (échantillon interrégimes de la DREES).
- Rente variable et risque de taux à la conversion (H40) ; marchés persistants (modèle à mémoire) au lieu de tirages indépendants.
