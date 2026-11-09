---
titre: Risques et tests de résistance du système : ce que disent les chiffres
tache: chantier 5 de la boucle « meilleur système »
date: 2026-11-03
statut: brouillon, ordres de grandeur sous hypothèses
---

# Risques et tests de résistance : résultats

Méthode et hypothèses R1 à R28 : [`methode.md`](methode.md) · code : [`stress.js`](stress.js), [`test_stress.js`](test_stress.js) (268 contrôles verts, 306 avec l'architecture v2) · sortie complète : [`resultats-brut.txt`](resultats-brut.txt) (fait foi). Md€ de 2025, année 1 = 2029, ordres de grandeur sous hypothèses, jamais des prédictions. Les ⚠️ renvoient à `verifications.md` (V7943 à V7950).

Transparence : ce texte est écrit par Claude, une IA d'Anthropic. Le système est celui de l'auteur, donc j'ai une raison de vouloir qu'il résiste. J'ai donc mis les chocs qui le cassent avant ceux qu'il encaisse.

## Résumé en dix lignes

1. **Sans aucun choc, le système ne tient qu'au central.** Dette/PIB à 10 ans, central : 95 % pour le chemin documenté 40 % / 500 € (C40), 103 % pour sa variante recommandée (taxe nette de dettes, paiement différé : C40N), 131 % pour le palier 1 + taxe nette (P1N), contre 157 % au droit actuel ; **au haut : 147 / 155 / 169 %**. Aucune architecture ne tient au haut, même sans choc. Le départ est à 123,5 % du PIB en 2029 (trois ans de déficit actuel d'ici là, R13), et les intérêts passent de 66 à 142 Md€ en 2038 (R3) : c'est la dérive de la dette actuelle, pas celle du système.
2. **La variante recommandée de la taxe a déjà dépensé la marge de sécurité.** La taxe nette de dettes avec paiement différé coûte 25,7 Md€ par an de plus que la taxe brute, soit **2,1 points de taux plat** : exactement la marge de ± 2 points prévue comme garde-fou (R3 du plan de bascule). Si l'on garde la variante, il faut prévoir 42 % de taux plat, ou admettre que la marge est consommée avant le premier choc.
3. **Création de valeur par l'IA à zéro (ligne E)** : −31,8 Md€ à l'an 10 au central (28 de recettes, 4 d'intérêts), dette +3,5 points. C40 passe de **+7,6 à −24,3 Md€** : son équilibre à 10 ans repose sur la ligne la plus fragile. La marge de taux absorbe presque tout (manque résiduel de 29 Md€ sur 154 cumulés) ; si toute la création de valeur tombe à zéro : −42 pour C40, −85 pour C40N, dette +5,6 points.
4. **Récession type 2009** : −73 Md€ la première année (−216 sur quatre ans), contre −87 (−256) au droit actuel. **Le socle universel est environ 16 % moins contracyclique** pour le budget (semi-élasticité 0,53 contre 0,63, estimation de Claude ⚠️) : il ne stabilise pas moins par défaut, il stabilise moins parce que l'IR progressif et l'assurance chômage disparaissent. Le piège est ailleurs : une clause de sauvegarde sur le solde constaté couperait le socle de 95 € en pleine récession. **Il faut la calculer sur le solde corrigé du cycle** (coût : +5 points de dette à 10 ans).
5. **Choc de taux** : +100 pb coûtent 4,3 Md€ la première année et 34,6 à plein régime ; sur la trajectoire de C40N, −40,7 Md€ à l'an 10 et +5,4 points de dette ; **+200 pb : −84,6 Md€ et +11 points**. La marge de taux (2 points) absorbe l'essentiel de +100 pb (manque résiduel cumulé de 34 Md€ sur 237) ; +200 pb demande aussi une coupe du socle de 51 € et laisse 69 Md€ sur 485.
6. **Krach immobilier −20 %** : −29 Md€ par an pendant trois ans (taxe −16,7, **droits de succession −12,2 que la note sur la taxe ne comptait pas**). Réserve nécessaire sur trois ans : **104 Md€ (≈ 3 % du PIB), et non 50** (la note comptait la taxe seule, sans les droits ni les intérêts). Krach boursier −30 % : −7 Md€ la première année, négligeable (86 % de l'assiette est immobilière). Un indice lissé sur cinq ans ne réduit le pic que de 20 % : il retarde la perte, il ne l'évite pas.
7. **Exil des grands patrimoines doublé par rapport au haut : le choc le plus grave** : −77 Md€ par an (droits −51, taxe −15,7, revenus −10,4), dette +26 points à 10 ans. Même la marge de 2 points et la coupe de 127 € du socle laissent 117 Md€ de manque cumulé. Réserve : sans effet, le choc est permanent. **Le chiffre repose sur la fuite des transmissions (R19), la donnée la moins étayée** : sans elle, −26. Seules parades réelles : la base (exit tax solide en droit de l'UE, règle datée de l'annonce, décès = réalisation).
8. **Échec du système d'information** : un an de recettes du bloc des salariés = 517 Md€ (17,3 % du PIB) : le pic de dette monte à 139 % (+17 points par rapport aux 122 % sans choc) puis revient (+1,7 point à 10 ans, 10 % de perte définitive supposés). **Le garde-fou (bloc en parallèle 24 mois, provision de 5 à 13 Md€) coûte cent fois moins que l'exposition** ; un mois perdu (43 Md€) est supportable.
9. **Démographie à 1,1 cotisant par retraité** : −51 Md€ par an en 2038 par rapport à la référence (+37 sur trois ans, 275 cumulés sur dix ans) ; **en 2060, 3,8 % du PIB (113 Md€) pour garder le taux de remplacement, ou une baisse de 22 % de ce taux** (47,4 → 37,0 %). La capitalisation de 10 % des cotisations n'en retire que 10 %.
10. **À inscrire dans le système** : (a) clause de sauvegarde sur solde structurel ; (b) la marge de ± 2 points doit rester libre : financer la taxe nette autrement (+2,1 points) ; (c) une **réserve de liquidité d'environ 100 Md€ (3 % du PIB)**, constituée par ligne de trésorerie puis par les excédents au-delà de zéro (impossible à épargner tant que le déficit dure) ; (d) bloc en parallèle 24 mois et provision ; (e) règle d'ajustement automatique des pensions ; (f) un traitement de l'exil par la base. Et une honnêteté : **au scénario haut, aucun garde-fou ne suffit** ; la seule parade est de ne pas lancer le système avant d'avoir validé qu'on est plus près du central que du haut.

## 0. Architecture finale v2 (03/11, R31-R34 ; sortie brute : section « Architecture finale v2 » de `resultats-brut.txt`)

Chemin **V2** : l'architecture finale v2 d'`optimum.js` (41 %, socle 350 €, taxe à 1 % plafonnée, héritage « reçu à vie », capital C, prime d'activité à 100 %, sortie du plancher « plat », exil défendable ; `modeles/systeme-ideal/optimum.md`). Croisière : +113,1 / +2,2 / −142,9 Md€. Mêmes conventions que les autres chemins (départ en 2029 à ≈ 123,5 % du PIB).

| trajectoire | solde an 1 / an 5 / an 10 (Md€) | dette/PIB an 5 / an 10 | écart à 10 ans | avec garde-fous : dette/PIB 10 ; manque résiduel |
|---|---|---|---|---|
| sans choc, bas | +81,4 / +146,3 / +234,3 | 91 % / 57 % | — | — |
| **sans choc, central** | −49,6 / −33,7 / −13,7 | 112 % / **99 %** | — | — |
| sans choc, haut | −223,7 / −248,8 / −317,5 | 137 % / 151 % | — | — |
| IA à zéro (ligne E), central | −51,8 / −46,3 / −45,6 | 113 % / 102 % | +3,5 pts | 100 % ; 29 Md€ |
| récession type 2009, central | −122,8 / −40,0 / −21,7 | 117 % / 105 % | +5,9 pts | 99 % ; 0 (coupe du socle de 93 € avec la clause constatée, 0 avec la clause structurelle : 104 %) |
| taux +100 pb, central | −54,7 / −55,7 / −53,2 | 113 % / 104 % | +5,3 pts | 100 % ; 33 |
| taux +200 pb, central | −59,7 / −78,2 / −95,9 | 115 % / 110 % | +10,8 pts | 100 % ; 67 |
| krach immobilier −20 %, central | −76,4 / −46,8 / −18,0 | 115 % / 102 % | +3,2 pts | 99 % ; 0 (réserve sur 3 ans : 85 Md€) |
| **exil au haut de la fourchette défendable** (R34), central | −77,1 / −68,1 / −59,6 | 116 % / **107 %** | **+8,2 pts** | 100 % ; 37 |
| exil doublé (ancien stress R19), central | −120,1 / −122,0 / −131,3 | 122 % / 120 % | +21,0 pts | 101 % ; 95 |
| récession + krach immobilier, central | −149,6 / −53,1 / −26,0 | 121 % / 108 % | +9,1 pts | 99 % ; 0 (réserve sur 3 ans : 272) |

Lecture :
1. **Au central, la v2 ramène la dette à 99 % du PIB à 10 ans**, contre 95 % pour C40, 103 % pour C40N et 157 % au droit actuel. Elle fait un peu moins bien que C40 alors que sa croisière est meilleure (+2,2 contre +0,3), pour deux raisons : la trésorerie de la taxe plafonnée manque pendant 12 ans (13,2 Md€/an, R33), et le capital de départ ainsi que l'exemption « reçu à vie » pèsent dès l'année 1.
2. **Au haut, rien ne change : 151 %**, même sans choc. La règle de lancement du chantier 5 s'applique toujours.
3. **L'exil, avec une fourchette défendable, n'est plus le pire choc.** Au haut de la fourchette (fuite des transmissions de 52 %, érosion du top 1 % de 55 %, mobilité de 0,40), il coûte **24,4 Md€ par an** au central (revenus −4,7, transmissions −16,9, taxe −2,8), soit +8,2 points de dette à 10 ans. L'ancien stress coûtait 62,6 sur la v2 et 77 sur C40N. Sur le solde de l'an 10 (intérêts et croissance nominale compris), il coûte −46 Md€ : plus que +100 pb (−40) et que l'IA à zéro (−32), moins que +200 pb (−82) ; la récession coûte plus la première année (−73). La marge de taux ne l'absorbe pas entièrement (37 Md€ de manque résiduel sur 10 ans). Au haut, ce choc est nul : le scénario haut est déjà au haut de la fourchette.
4. **Le krach immobilier pèse moins sur la v2** (−23,8 Md€/an : taxe −16,7, droits −7,1, contre −29 sur C40N), parce que l'exemption de 100 000 € et le conjoint réduisent les droits exposés (59,6 Md€/an perçus au lieu de 103,5).
5. **Les garde-fous gardent la dette à 99-101 % à 10 ans pour tous les chocs centraux**, au prix de la marge de 2 points toujours utilisée et de coupes du socle jusqu'à 146 € (récession + krach). Au haut, ils ne font que tenir la dette à 151-153 %.

## 1. Ce qui est testé

Architectures : P1N (palier 1 + réforme immobilière + taxe nette avec différé), C40 (chemin T5 « 40 % / 500 € » documenté, taxe brute), C40N (même chemin avec la taxe recommandée), ACTUEL (droit actuel, comparaison). Treize chocs, dont deux combinaisons, au central et au haut. Détails : `methode.md`.

### Trajectoires sans choc (Md€ ; dette de départ 2029 : 4 037 Md€ = 123,5 % du PIB)

| architecture | scénario | solde an 1 | an 5 | an 10 | dette/PIB an 5 | an 10 |
|---|---|---|---|---|---|---|
| Droit actuel | tous | −218,9 | −276,8 | −359,6 | 139 % | 157 % |
| P1N | central | −157,5 | −168,8 | −193,6 | 128 % | 131 % |
| P1N | haut | −284,9 | −325,6 | −419,6 | 146 % | 169 % |
| C40 | central | −36,9 | −17,7 | +7,6 | 110 % | 95 % |
| C40 | haut | −212,2 | −234,5 | −298,5 | 135 % | 147 % |
| C40N | central | −62,6 | −49,9 | −35,3 | 114 % | 103 % |
| C40N | haut | −236,7 | −265,2 | −339,3 | 139 % | 155 % |

Le solde de l'an 1 est plus bas que le solde de croisière du modèle (−99,6 / +0,3 / −15,2) parce qu'il ajoute la transition (10 Md€), le report du paiement différé (8,6), l'échelle du PIB nominal et trois ans de dérive des intérêts. Le « bas » du modèle (favorable) est trop optimiste pour un test de résistance ; il est dans la sortie brute.

### Garde-fous : combien ils pèsent (Md€/an de croisière, central / haut)

| architecture | 1 point de taux plat | marge de ± 2 points | 100 € de socle | coupe maximale du socle (150 €) |
|---|---|---|---|---|
| P1N | 12,6 / 7,3 | 25,2 / 14,7 | 43,0 | 64,6 |
| C40, C40N | 11,1 / 5,5 | 22,1 / 11,1 | 43,3 | 64,9 |

**Au haut, marge + coupe maximale = 76 Md€ pour un déficit de 240 à 420 : les garde-fous ne rattrapent pas le scénario défavorable lui-même.** Ils sont dimensionnés pour des chocs de 20 à 80 Md€.

### Synthèse des chocs (C40N, le chemin recommandé ; autres architectures en colonnes)

| choc | C40N central : solde an 10 | dette/PIB 5 / 10 ans | dette/PIB à 10 ans vs sans choc | réserve 3 ans | C40N haut : solde an 10 | dette/PIB 10 ans | P1N central : solde an 10 | C40 central : solde an 10 |
|---|---|---|---|---|---|---|---|---|
| Sans choc | −35,3 | 114 % / 103 % | 0 | 0 | −339,3 | 155 % | −193,6 | +7,6 |
| 1a. Création de valeur : sans la ligne E (IA) | −67,1 | 114 % / 106 % | +3,5 pts | 13 | −349,9 | 156 % | −225,5 | −24,3 |
| 1b. Création de valeur : aucune | −85,0 | 115 % / 108 % | +5,6 pts | 23 | −350,0 | 156 % | −243,4 | −42,2 |
| 2. Récession type 2009 | −43,2 | 119 % / 109 % | +5,9 pts | 187 | −346,2 | 160 % | −201,6 | −0,4 |
| 3a. Taux +100 pb | −76,0 | 115 % / 108 % | +5,4 pts | 29 | −396,3 | 162 % | −243,3 | −30,7 |
| 3b. Taux +200 pb | −119,9 | 117 % / 114 % | +11,0 pts | 58 | −457,3 | 169 % | −296,5 | −72,1 |
| 4a. Krach immobilier −20 % | −40,5 | 117 % / 107 % | +3,9 pts | 104 | −343,7 | 158 % | −198,9 | +2,3 |
| 4b. Krach boursier −30 % | −35,7 | 114 % / 103 % | +0,3 pt | 12 | −339,6 | 155 % | −194,1 | +7,1 |
| 5. Exil doublé par rapport au haut | −179,9 | 126 % / 129 % | +25,8 pts | 275 | −411,3 | 168 % | −321,8 | −137,2 |
| 6a. Échec du système d'information, un an du bloc 1 | −37,5 | 115 % / 104 % | +1,7 pt | 59 | −341,6 | 156 % | −195,6 | +5,3 |
| 6b. Idem, un mois | −35,5 | 114 % / 103 % | +0,1 pt | 5 | −339,5 | 155 % | −193,8 | +7,4 |
| 7. Démographie 1,1 en 2060 | −86,3 | 116 % / 109 % | +6,3 pts | 37 | −390,4 | 161 % | −244,7 | −43,5 |
| 8a. Récession + taux +100 pb | −86,1 | 121 % / 114 % | +11,5 pts | 216 | −405,1 | 167 % | −253,4 | −40,9 |
| 8b. Récession + krach immobilier | −48,5 | 123 % / 113 % | +9,8 pts | 290 | −350,6 | 163 % | −206,8 | −5,6 |

(Les pics de dette/PIB et les lignes du droit actuel sont dans la sortie brute. Récession : dette/PIB au pic 129 % pour C40N.)

## 2. Choc par choc : garde-fou qui absorbe et coût

| choc | garde-fou | ce qu'il absorbe (C40N, central) | coût du garde-fou |
|---|---|---|---|
| 1. IA | marge de taux ; cliquet de recette constatée (le socle ne monte que sur recettes encaissées) | marge de 1,5 point : manque résiduel 29 Md€ cumulés sur 154 | 1,5 point de taux plat ≈ 17 Md€ ≈ −2,5 % du revenu net (1,5 / 60) ⚠️ estimation ; le cliquet ne coûte rien mais fige le socle à 500 € (au central, il n'a de toute façon pas monté, `resultats.md` du système idéal) |
| 2. Récession | stabilisateurs (nouveau : 0,53) ; réserve ; **clause sur solde structurel** | la réserve de 187 Md€ sur trois ans (≈ 6 % du PIB) ; avec la clause constatée : coupe de 95 € du socle en récession (procyclique, multiplicateur non modélisé R25) | clause structurelle : dette/PIB à 10 ans de 108 % au lieu de 103 % avec la clause constatée (+5 points), pour éviter une coupe de 95 € sur 500 € |
| 3. Taux | marge de taux, puis socle ; échéancier de dette plus long ; aucune promesse de baisse de taux | +100 pb : marge de 2 points, résiduel 34 Md€ ; +200 pb : marge + 51 € de socle, résiduel 69 Md€ | 2 points ≈ 22 Md€ ; 51 € de socle ≈ 22 Md€, retiré d'abord aux plus modestes |
| 4. Krach | réserve de lissage ; taxe sur indice local ou IPC ; indice lissé 5 ans (pic −20 %) | 104 Md€ sur trois ans = absorbé par la réserve ; marge 2 points + 16 € de socle sinon | réserve de 100 Md€ : portage ≈ 1 Md€/an (écart de 1 point entre la dette et le placement ⚠️) mais **impossible à constituer par l'épargne tant que le déficit dure** : ligne de liquidité |
| 5. Exil | exit tax différée, règle datée de l'annonce, décès = réalisation, publication des départs | **rien ne suffit** : marge + coupe max laissent 117 Md€ cumulés de manque ; la parade est de ne pas dépendre de ces bases | exit tax : contentieux UE ; règle datée : effet d'annonce ; 60 Md€ perdus sans règle, 12 avec (`bascule-existant`, central) |
| 6. Système d'information | bloc en parallèle 24 mois (shadow mode), provision 5-13 Md€, aucune suppression d'agents avant | l'exposition de 517 Md€ est ramenée à la provision de 5 à 13 Md€ | 5 à 13 Md€ plus 24 mois de double gestion ; complexité maximale en 2029-2032 |
| 7. Démographie | règle d'ajustement automatique (taux de remplacement ou âge) ; capitalisation partielle | la règle ferme le manque ; la capitalisation de 10 % n'en couvre que 10 % (≈ 11 Md€ en 2060) | une baisse de 22 % du taux de remplacement si l'on ne paie pas (politique) ; 3,8 % du PIB si l'on paie |
| 8. Combinaisons | clause structurelle + réserve | 8b : clause constatée coupe 150 € (le maximum), clause structurelle seulement 23 € | réserve de 290 Md€ sur trois ans (≈ 9 % du PIB) pour tout absorber par la réserve ; on ne la constituera pas : on absorbe par la dette |

(La ligne « clause structurelle » de la récession : le coût en dette à 10 ans est la différence entre 103 % (clause constatée, qui coupe) et 108 % (clause structurelle, qui ne coupe pas), soit +5 points ; ce n'est pas le choc, c'est le prix d'avoir refusé de couper en récession.)

## 3. Ce que ces chiffres disent du système

- **Le risque dominant est le niveau, pas le choc.** Au haut, le déficit sans choc est de 240 Md€ (an 1) à 340-420 Md€ (an 10) : aucun garde-fou de ce module ne le rattrape. Au central, C40 est proche de l'équilibre mais C40N non. Les garde-fous servent aux chocs de 20 à 80 Md€.
- **Les chocs permanents pèsent plus que les cycliques.** Le taux (+100 pb : −41 Md€ à 10 ans), la démographie (−51), l'exil (−77 Md€ à tout moment) et la perte de la ligne E (−32) coûtent chacun plus qu'une récession (−73 la première année, puis zéro). Une réserve ne couvre que les chocs temporaires : récession, krach, système d'information.
- **Les garde-fous se concurrencent entre eux.** La marge de ± 2 points sert déjà à financer la taxe nette (2,1 points) ; la coupe du socle est le dernier recours mais frappe D1 à D3, contre « ne perdre personne ». Il faut donc les hiérarchiser : (1) clause structurelle, (2) marge de taux, (3) coupe du socle jusqu'à 150 €, (4) vote populaire au-delà (déjà prévu par le plan de bascule).
- **La taxe à 1 % ajoute un risque que le droit actuel n'a pas** : elle suit le prix de l'immobilier (86 % de l'assiette), et les droits de succession aussi. Un krach de −20 % retire 29 Md€ par an, pas 17. C'est une corrélation, non un hasard : les deux recettes les plus neuves reposent sur la même population et la même classe d'actifs.

## 4. Garde-fous à inscrire et réserve à constituer

1. **Clause de sauvegarde calculée sur le solde corrigé du cycle** (écart de production publié par un organisme indépendant : HCFP ou Commission). Sans elle, la récession déclenche une coupe de 95 à 150 € du socle.
2. **Marge de taux de ± 2 points laissée libre** : financer la taxe nette autrement (taux de 42 % ou économies) ; sinon la marge est vide au jour 1.
3. **Cliquet de recette constatée** : le socle ne monte que si le solde constaté est au rendez-vous (aucun coût, déjà R1 du plan de bascule).
4. **Réserve de liquidité d'environ 100 Md€ (3 % du PIB)** : couvre un krach immobilier de −20 % sur trois ans (104), pas une récession (187) ni la combinaison (290). C'est une ligne de trésorerie plus une règle d'affectation des excédents (toute recette au-delà de l'équilibre alimente la réserve jusqu'à 3 % du PIB, puis 6 %). Une réserve à constituer par l'épargne n'est pas réaliste avec un solde négatif.
5. **Bloc en parallèle 24 mois et provision de 5 à 13 Md€** pour le système d'information (plan de bascule R4-R5).
6. **Règle d'ajustement automatique des pensions** (type suédois : taux de remplacement ou âge de départ selon le ratio cotisants/retraités), décidée avant le choc.
7. **Traitement de l'exil par la base** : décès = réalisation, exit tax différée, règle datée de l'annonce ; c'est le seul choc que la marge et la réserve ne couvrent pas.
8. **Une règle de lancement** : ne pas lancer le système si les tests de sensibilité de l'année 0 le placent plus près du haut que du central (déficit de croisière > 3 % du PIB au haut), c'est-à-dire tant que le haut n'est pas ramené à l'intérieur de la capacité des garde-fous.

**Réserve à constituer : environ 100 Md€ (≈ 3 % du PIB) en ligne de liquidité, 300 Md€ (≈ 9 %) si l'on veut tenir la combinaison récession + krach sans coupe du socle**, avec la contradiction nommée : on ne peut la constituer par l'épargne sans excédent, donc elle est un engagement de financement (émission autorisée, prêteur de dernier ressort), pas un coussin.

## 5. Steelman et limites

**Meilleure objection.** « Ces tests n'ont aucune valeur : le système n'a jamais existé, les élasticités viennent de systèmes différents, la fuite des transmissions de 0,65 est inventée, et les taux de marché ne resteraient pas à 3,45 % avec un déficit de 8 % du PIB. Votre résistance est une illusion de modélisation. » **Réponse partielle** : oui pour l'exil (R19) et pour les taux (R26) : ce sont les deux chocs les plus sous-estimés ici et ils sont les plus lourds. Non pour l'ordre de grandeur : même en divisant l'exil par deux, il reste le plus gros choc, et même avec des taux à 3,45 % le haut n'est pas tenu. Les tests servent à classer les risques et à dimensionner les garde-fous, pas à prédire.

**État de la recherche** (règle 9). Ce qui est établi : la semi-élasticité budgétaire de la France est élevée (0,5 à 0,63, Commission et OCDE) ; la base des impôts sur la fortune réagit surtout par optimisation et déclaration (Seim, Jakobsen et al., Brülhart et al., cités dans `taxe-patrimoine-1pc.md`) ; les grands projets numériques de l'État ont dérapé (ONP, Louvois, Sirhen). Ce qui est débattu : la taille de la fuite des plus riches, le multiplicateur budgétaire en récession (0,9 à 1,7 selon le FMI ⚠️ non lu), la sensibilité des taux au déficit. Ce qui manque : aucune étude ne porte sur un taux plat avec socle universel ni sur une taxe de 1 % sur la résidence principale.

**Limites.** Pas de multiplicateur (R25) ; pas d'effet de second tour sur les taux (R26) ; chocs additifs (R27) ; démographie sans effet sur le PIB (R22) ; création de valeur et solde structurel mis à l'échelle du PIB nominal (R14) ; recettes de plus-values immobilières et de capital courant non touchées par les krachs ; pas de stress sur les banques (un krach immobilier de −20 % touche leurs garanties et le taux de défaut ; la baisse de prix de −10 % que provoque la taxe elle-même retire environ 940 Md€ de patrimoine, `taxe-patrimoine-1pc.md` § 10) ; la clause constatée / structurelle est une règle de contrôle intégral simple (R23).

## Sources (consultées le 03/11/2026)

Voir `methode.md` : Commission (Mourre et al. 2014 et 2019), OCDE (Girouard et André 2005), Intereconomics 2019 (France 0,63 ; UE 0,5), et les modules du dépôt (`options_financement.js`, `palier1.js`, `taxe_patrimoine.js`, `sources/plan-de-bascule.md`, `sources/calculs/cout_sortie_ue.py`, `modeles/capital-commun-retraite/`).

Synthèse des sources : la structure du modèle de stress (dette, taux, pente du socle, taxe) vient du dépôt ; les semi-élasticités viennent de la Commission et de l'OCDE (lues de seconde main) ; tout le reste est hypothèse numérotée.
