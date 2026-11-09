---
titre: Gagnants et perdants du socle universel et du prélèvement unique (résultats)
tache: T14
date: 2026-10-25 (recalage palier 1 : 2026-11-03)
statut: brouillon sourcé
---

# Qui gagne, qui perd ?

> **Mise à jour du 03/11/2026 (recalage).** Les §§ 1 à 9 ci-dessous portent sur l'ANCIEN système (socle 1 000 €, taux 50 %) et sont gardés pour l'historique. Pour le palier 1 de `modeles/systeme-ideal/` et ses quatre chemins de financement (taux 38 / 41,5 / 45 %, socle 400 ou 500 €, montée progressive), avec RSA, prime d'activité et cas types OpenFisca 2026, voir le **§ 10** en bas de page.


Tâche T14 · 2026-10-25 · méthode : [`methode.md`](methode.md) · chiffres reproduits par `jsc cas_types_donnees.js modele.js test_modele.js` (52 contrôles au vert) · données pour le simulateur : [`cas_types.json`](cas_types.json)

> **À lire d'abord.** Ce sont des **écarts mécaniques**, à comportements et coût employeur inchangés (H1) : des ordres de grandeur, pas des prédictions. Le revenu disponible actuel des cas types vient de l'**API OpenFisca** (législation 2026), complétée par l'API Urssaf et quelques calculs documentés. La répartition par dixième est une **estimation simple** à partir des comptes distribués de l'Insee, pas une microsimulation. ⚠️ = registre V550 à V569.

## 1. En bref

1. **À 50 %, presque tous les actifs gagnent, et beaucoup.** Un salarié au Smic gagne ≈ +290 € par mois, un salarié médian ≈ +720 €, un cadre ≈ +1 200 à +2 200 €, un très haut salaire ≈ +6 900 €. Ce n'est pas un miracle. Aujourd'hui, un salarié garde 36 à 86 % de son coût employeur, selon son niveau ; avec le système, il garderait 50 % **plus** 1 000 €. **Ce gain général est la contrepartie du trou budgétaire** : à 50 %, le système n'est pas financé (simulateur : ≈ −196 Md€ par an).
2. **Au taux qui équilibre le budget (59 % statique, ≈ 63 % après réactions), le tableau change.** Les gains des actifs fondent : le Smic ne gagne plus que +30 à +110 €, le cadre 4× le médian +65 à +700 €. Le haut de la distribution perd : à 63 %, ≈ −600 € par mois et par UC en moyenne pour les 10 % les plus aisés, −20 % pour le top 1 %, −31 % pour le top 0,1 %.
3. **Les perdants certains, à tout taux, sont souvent des personnes fragiles :**
   - les **chômeurs indemnisés** (cadre au chômage : −1 560 € par mois, −61 %) ;
   - les **intermittents** (−130 à −390 €) ;
   - les **parents isolés** (0 à −190 € à 50 %, jusqu'à −440 € à 63 %) ;
   - les **retraités au minimum vieillesse** (−44 € : l'ASPA, 1 043,59 €, dépasse le socle).

   Ces pertes sont fixes : un taux plus bas ne les répare pas. Il faut des règles dédiées.
4. **Le capital et l'héritage paient.** Un rentier à 100 000 € de dividendes perd ≈ 550 € par mois à 50 % (−1 630 € à 63 %), sauf si la suppression de l'IS lui revient en dividendes (+840 €). Un héritage de 300 000 € laisse 150 000 € à l'héritier, contre 262 000 € aujourd'hui.
5. **Les retraités gagnent ou perdent selon une seule règle**, celle du complément :
   - règle « brut » (simulateur) : ils gagnent, jusqu'à +880 € par mois à 4 000 € de pension, car ils ne paient plus ni CSG ni impôt ;
   - règle « net » : quasi neutre ;
   - règle « imposé » : ils perdent, −100 à −620 €.

   C'est un choix politique de premier ordre, aujourd'hui implicite dans le simulateur.

## 2. Cas types : revenu disponible par mois

Revenu actuel (2026) → proposé, avec l'écart, à trois taux. Le point mort est le taux au-delà duquel le foyer perd. Règle de retraite « brut ».

| Foyer | Actuel | Proposé à 50 % | Écart à 50 % | à 59 % | à 63 % | Point mort |
|---|---|---|---|---|---|---|
| Personne seule sans emploi (RSA + aide au logement) | 877 | 1 000 | **+123** | +123 | +123 | — (gagne toujours) |
| Mi-temps au Smic | 1 217 | 1 502 | +285 | +194 | +154 | 78 % |
| Smic temps plein | 1 707 | 1 994 | **+286** | +108 | +28 | 64 % |
| Salaire médian (1,5 Smic brut) | 2 116 | 2 838 | **+722** | +391 | +244 | 70 % |
| Cadre, 2 × médian | 3 777 | 5 017 | +1 240 | +517 | +196 | 65 % |
| Cadre, 4 × médian | 6 872 | 9 022 | +2 150 | +706 | +65 | 63 % |
| Très haut salaire (30 000 € brut) | 15 221 | 22 167 | **+6 946** | +3 136 | +1 443 | 66 % |
| Indépendant (micro, 3 000 € de chiffre d'affaires) | 1 743 | 2 275 | +532 | +303 | +201 | 71 % |
| Intermittent du spectacle | 2 112 | 1 980 | **−132** | −309 | −387 | 43 % |
| Cadre au chômage indemnisé | 2 559 | 1 000 | **−1 559** | −1 559 | −1 559 | — (perd toujours) |
| Couple Smic + médian, sans enfant | 3 577 | 4 832 | +1 255 | +745 | +519 | 72 % |
| idem, 1 enfant | 3 720 | 5 032 | +1 312 | +803 | +576 | 73 % |
| idem, 2 enfants | 3 951 | 5 232 | +1 282 | +772 | +545 | 73 % |
| idem, 3 enfants | 4 350 | 5 432 | +1 082 | +573 | +346 | 69 % |
| idem, 4 enfants | 4 611 | 5 632 | +1 021 | +512 | +285 | 68 % |
| Couple, un seul salaire au Smic, 2 enfants | 2 584 | 3 394 | **+810** | +631 | +551 | 91 % |
| Parent isolé au Smic, 1 enfant | 2 200 | 2 194 | **−6** | −185 | −264 | 50 % |
| Parent isolé au Smic, 2 enfants | 2 579 | 2 394 | **−186** | −364 | −444 | 41 % |
| Retraité, pension de 800 € brut (+ ASPA) | 1 044 | 1 000 | **−44** | −44 | −44 | — |
| Retraité, 1 200 € | 1 200 | 1 200 | 0 | 0 | 0 | — |
| Retraité, 1 600 € | 1 531 | 1 600 | +69 | +69 | +69 | — |
| Retraité, 2 500 € | 2 203 | 2 500 | +297 | +297 | +297 | — |
| Retraité, 4 000 € | 3 121 | 4 000 | **+879** | +879 | +879 | — |
| Couple de retraités (1 600 € + 800 €) | 2 297 | 2 600 | +303 | +303 | +303 | — |
| Salarié médian bailleur (12 000 € de loyers par an) | 2 699 | 3 338 | +639 | +218 | +31 | 64 % |
| Rentier (100 000 € de dividendes par an) | 5 717 | 5 167 | **−550** | −1 300 | −1 633 | 43 % |
| Salarié médian qui hérite (hors héritage) | 2 116 | 2 838 | +722 | +391 | +244 | 70 % |

Lecture : un salarié seul au Smic dispose aujourd'hui de 1 707 € par mois (1 478 € de salaire net et 230 € de prime d'activité). Avec le système à 50 %, il aurait 1 000 € de socle et 994 € de salaire (50 % de 1 988 € de coût employeur), soit +286 €. Il perdrait à partir d'un taux de 64 %.

**Pourquoi ces écarts ?**
- **Salariés** : aujourd'hui, le salarié garde de son coût employeur 86 % au Smic avec la prime d'activité, 58 % au médian, 47 % pour un cadre à 3 Smic et 36 % pour un très haut salaire. Avec 50 % + 1 000 €, tous gagnent à 50 %. Le gain absolu croît avec le salaire, parce que les taux actuels montent : **le système est moins progressif que l'actuel pour les salaires** (taux marginal de 50 %, contre 60 % et plus en haut aujourd'hui). Le socle rend le taux *moyen* progressif, mais le gain des très hauts salaires est le plus grand en euros.
- **Familles** : le socle de 1 000 € pour le second adulte avantage fortement les **couples**, et surtout ceux où un seul travaille (+810 €). Avec 200 € par enfant, la perte des allocations familiales, du complément familial et des aides au logement réduit le gain à partir du 3e enfant.
- **Parents isolés** : ils perdent l'allocation de soutien familial (≈ 200 € par enfant), la prime d'activité majorée et l'aide au logement ; un seul socle d'adulte ne compense pas. **Avec 200 € par enfant, le parent isolé est le grand perdant parmi les actifs modestes.** Une majoration de ≈ 300 à 400 € par enfant de parent isolé (estimation de Claude : ASF + écart observé) la neutraliserait.
- **Chômeurs indemnisés** : l'assurance chômage remplace aujourd'hui 57 à 75 % du salaire de référence. Le socle ne remplace que 1 000 €. Le cadre au chômage passe de 2 559 € à 1 000 €. **C'est la perte la plus forte de tous les cas types, et elle frappe un moment de fragilité.** Une assurance chômage contributive, même réduite, est la parade évidente ; elle n'est pas dans le système actuel de l'auteur.

## 3. Retraités : la règle du complément décide de tout

Écart mensuel à 50 % selon la règle (H8) :

| Retraité seul | « brut » (simulateur) | « net » | « imposé à 50 % » |
|---|---|---|---|
| 800 € (+ ASPA) | −44 | −44 | −44 |
| 1 200 € | 0 | 0 | −100 |
| 1 600 € | +69 | 0 | −231 |
| 2 500 € | +297 | +112 | −453 |
| 4 000 € | **+879** | +515 | **−621** |
| Couple 1 600 € + 800 € | +303 | +234 | +3 |

- **Règle « brut »** (celle du simulateur et de T13) : aucun retraité ne perd, sauf au minimum vieillesse. Les retraités aisés gagnent le plus, car ils ne paient plus ni CSG (9,1 %) ni impôt sur le revenu. C'est **une baisse d'impôt pour les retraités aisés**, financée par les actifs (≈ 29 Md€ de CSG, T13).
- **Règle « net »** : les pensions nettes sont maintenues. Les retraités ne gagnent que l'impôt sur le revenu supprimé. T13 chiffre l'économie supplémentaire à ≈ +28 Md€ par an.
- **Règle « imposé »** : cohérente avec « 50 % sur tous les revenus », elle fait perdre de 8 à 20 % de leur revenu à tous les retraités au-dessus du socle. Elle est juridiquement plus fragile (droits acquis, T13 et T16).
- **Minimum vieillesse** : le socle (1 000 €) est **inférieur** à l'ASPA (1 043,59 €). Un socle à 1 044 € ou un complément ASPA maintenu règle ce cas.

## 4. Héritiers (montant ponctuel, en ligne directe, d'un parent)

| Héritage | Garde aujourd'hui | Garde demain (50 %, sans abattement) | Écart | Avec un abattement de 100 000 € |
|---|---|---|---|---|
| 100 000 € | 100 000 (0 %) | 50 000 | −50 000 | 0 |
| 300 000 € | 261 806 (13 % d'impôt) | 150 000 | **−111 806** | −61 806 |
| 1 000 000 € | 787 038 (21 %) | 500 000 | −287 038 | −237 038 |

Aujourd'hui, la grande majorité des successions en ligne directe ne paient rien grâce à l'abattement. **« Taxer l'héritage comme un revenu » fait perdre tous les héritiers, y compris les plus modestes** : sur une maison de famille à 200 000 € partagée entre deux enfants, chacun paierait 50 000 € au lieu de 0. Un abattement par héritier est politiquement presque indispensable, mais il réduit la recette du simulateur (à chiffrer avec la distribution des successions, absente ici).

## 5. Par dixième de niveau de vie (estimation, € par mois et par unité de consommation)

Règle de retraite « brut ». Les montants par ménage valent environ 1,5 fois les montants par UC (H18). **Les parts de gagnants sont des bornes hautes** : la méthode ignore la diversité des familles (§ 8 de la méthode).

| Dixième | Revenu disponible actuel | Écart à 50 % | Part de gagnants à 50 % | Écart à 59 % | Écart à 63 % | Part de gagnants à 63 % |
|---|---|---|---|---|---|---|
| D1 | 1 033 | +420 (+41 %) | ≈ 86 % | +388 | +374 | ≈ 86 % |
| D2 | 1 633 | +401 (+25 %) | ≈ 85 % | +321 | +285 | ≈ 84 % |
| D3 | 2 067 | +458 (+22 %) | ≈ 94 % | +339 | +286 | ≈ 94 % |
| D4 | 2 350 | +467 (+20 %) | ≈ 96 % | +304 | +232 | ≈ 96 % |
| D5 | 2 633 | +542 (+21 %) | ≈ 96 % | +343 | +255 | ≈ 96 % |
| D6 | 2 942 | +542 (+18 %) | ≈ 98 % | +309 | +206 | ≈ 98 % |
| D7 | 3 267 | +615 (+19 %) | ≈ 98 % | +331 | +205 | ≈ 98 % |
| D8 | 3 733 | +635 (+17 %) | ≈ 98 % | +285 | +129 | ≈ 98 % |
| D9 | 4 417 | +720 (+16 %) | ≈ 98 % | +265 | +63 | ≈ 66 % |
| D10 | 7 367 | +751 (+10 %) | ≈ 99 % | **−189** | **−606 (−8 %)** | ≈ 27 % |
| Top 1 % (niveau de vie ≈ 14 300) | | +390 (+3 %) | | −1 820 (−13 %) | −2 800 (−20 %) | |
| Top 0,1 % (≈ 39 300) | | **−3 980 (−10 %)** | | −9 800 (−25 %) | −12 400 (−31 %) | |

**Dans chaque dixième, la moyenne cache trois groupes** (à 50 %, € par mois et par UC) :
- **actifs** : +640 à +870 dans tous les dixièmes ;
- **retraités** : +75 (D2) à +1 120 (D10), car les retraités aisés gagnent le plus avec la règle « brut » ;
- **chômeurs indemnisés** : +260 en D1 (petites allocations), puis de −60 (D2) à −4 500 (D10).

**Avec la règle « imposé »**, les retraités perdent de −115 € (D3) à −1 700 € (D10), et la part de gagnants tombe à 57-82 % selon les dixièmes. À 63 %, D6 à D10 perdent alors en moyenne (−46 à −1 207 €).

**Total des ménages** : +313 Md€ par an à 50 %, +152 Md€ à 59 %, +81 Md€ à 63 % (règle « brut »). Ces niveaux sont **plus favorables** que ce que suppose le bilan du simulateur, de l'ordre de 100 à 150 Md€ (⚠️ V563 : cotisations imputées, chômage plus large). Le **profil** est plus fiable que le niveau : le gain relatif décroît avec le niveau de vie, et seul le haut perd quand le budget est équilibré.

**Sensibilité du top** (taux 50 %) : si la suppression de l'IS revient aux actionnaires en dividendes, le top 1 % gagne +7 % et le top 0,1 % devient quasi neutre (−1 %). La forme de Pareto (1,8 à 2,1) change peu le résultat (±1 point).

## 6. Les perdants qui peuvent partir

- **Ceux qui perdent ne sont, pour la plupart, pas mobiles.** Chômeurs, intermittents, parents isolés et allocataires de l'ASPA perdent quel que soit le taux. Ce sont des perdants politiques (ils votent), pas des candidats à l'exil.
- **Ceux qui peuvent partir** :
  - le **top 0,1 %** (≈ 37 800 foyers, T5) : il perd ≈ 10 % de son niveau de vie à 50 % (≈ −6 400 € par mois et par ménage), 25 à 31 % au taux d'équilibre, sauf si la fin de l'IS lui revient en dividendes ;
  - les **rentiers** : −10 % à 50 %, −29 % à 63 % ;
  - surtout, les **familles qui transmettent** : de 13-21 % à 50 % de droits sur les gros héritages.
- **Effectifs et montants en jeu** : T5 ([`modeles/reactions-assiettes/resultats.md`](../reactions-assiettes/resultats.md)) estime à long terme le départ de **≈ 4 600 foyers du top 0,1 %** et ≈ 45 500 du top 1 % (scénario central ; 1 900 à 9 300 et 19 500 à 93 500 selon les réactions), avec 2 à 18 Md€ de recettes perdues par l'exil (central ≈ 7 Md€). T5 conclut que **le motif de départ, ce sont les transmissions, pas les revenus d'activité**. T14 le confirme : à 50 %, les **hauts salaires gagnent** (+46 % pour le très haut salaire) et n'ont aucune raison de partir ; à 63 %, ils gagnent encore un peu (+65 à +1 443 €).
- **Pays d'accueil** : la comparaison chiffrée avec la Suisse, la Belgique, le Portugal ou les Émirats reste à faire (lien T5). Point de repère non vérifié : la plupart des cantons suisses exonèrent les successions en ligne directe (⚠️ V565). Face à une taxe de 50 % sur l'héritage, c'est l'écart qui compte, pas le prélèvement sur les revenus.

## 7. Ce que chacun gagne hors argent

Ces gains ne sont pas chiffrés ici, mais ils sont réels :
- **La sécurité du socle** : 1 000 € inconditionnels, sans démarche, sans contrôle de ressources, sans rupture de droits. Aujourd'hui, environ un tiers des foyers éligibles ne demandent pas le RSA (DREES ⚠️ V566). Pour eux, le gain réel est bien supérieur aux +123 € du tableau.
- **La fin des effets de seuil** : un euro gagné en plus rapporte toujours 50 centimes. Aujourd'hui, 5,5 % des personnes en emploi ont un taux marginal effectif de plus de 80 % (Insee Analyses n° 66, repris de T4), et 1,1 % de plus de 100 %. Au Smic, 100 € de revenu disponible en plus coûtent 483 € à l'employeur (rapport Bozio-Wasmer, T4).
- **La fin des démarches** : plus de déclaration trimestrielle de la prime d'activité, plus de dossiers d'aide au logement, plus de régularisations ni d'indus.
- **Ce qui se perd** : l'assurance chômage proportionnelle au salaire, qui est une **sécurité pour les classes moyennes et supérieures**. Le cadre au chômage le paie au prix fort.

## 8. Ce qui appuie, nuance ou contredit la thèse de l'auteur

**Appuie :**
- Le socle **profite massivement au bas de la distribution** : D1 gagne +41 % à 50 % et encore +36 % à 63 %. La personne sans emploi gagne à tout taux.
- Le socle supprime les trappes : le passage du RSA à un emploi n'est plus taxé à 60-80 %.
- Les **hauts salaires n'ont pas de raison fiscale de partir** : à 50 % du coût employeur, ils paient moins qu'aujourd'hui. C'est cohérent avec T5.
- Les couples avec un seul revenu et les familles nombreuses modestes gagnent nettement.

**Nuance :**
- **Le gain quasi universel à 50 % est une illusion comptable** : c'est le déficit de ≈ 200 Md€ redistribué. La question honnête est « qui gagne au taux qui équilibre ? ». Réponse : le bas et le milieu gagnent encore (+60 à +370 € par UC à 63 %), et le haut perd (D10 : −8 % à 63 %, top 0,1 % : −31 %).
- Le système est **moins progressif que l'actuel pour les salaires** : en euros, le gain le plus fort va aux très hauts salaires. Un taux unique avec un socle est progressif en taux moyen, pas en taux marginal.
- Le traitement des retraités est **un choix implicite à rendre explicite** : la règle actuelle du simulateur offre aux retraités aisés un gain de 4 à 28 % de leur revenu disponible.

**Contredit :**
- **« Ne perdre personne »** (principe de l'auteur pour la transition) n'est pas tenu. Il y a des perdants certains, souvent fragiles : chômeurs indemnisés, intermittents, parents isolés, allocataires du minimum vieillesse, petits héritiers. Il faut au minimum :
  - une majoration pour les parents isolés ;
  - un socle au niveau de l'ASPA pour les plus de 65 ans ;
  - une assurance chômage contributive (même réduite) ;
  - un abattement sur les héritages.

  Chacune coûte de l'argent, qui monte le taux d'équilibre.
- **Steelman de l'objection** : « Votre système transfère de l'argent des chômeurs, des mères isolées et des petits héritiers vers les cadres et les retraités aisés. » À 50 %, c'est vrai en partie : le très haut salaire gagne +6 900 € par mois quand le cadre au chômage perd 1 560 €. **Réponse possible** : au taux d'équilibre, les gains des cadres fondent, et les pertes ciblées se corrigent par les quatre ajustements ci-dessus. Mais cette réponse n'existe que si ces ajustements sont dans le programme, chiffrés, et si le taux affiché est le taux d'équilibre (≈ 60-65 %), pas 50 %.
- **Biais à signaler** : les cas types sont modestes en patrimoine. Or la taxe foncière supprimée (gain pour tous les propriétaires, non compté) et la taxation des plus-values et de l'assurance-vie (perte pour les épargnants, mal captée) déplaceraient les résultats. Ces deux effets jouent en sens opposés.

## 9. Pour l'onglet « mon foyer » du simulateur

[`cas_types.json`](cas_types.json) contient, pour chaque cas :
- la composition et les entrées (salaires bruts et coûts employeur, pensions, capital, héritage) ;
- le revenu actuel détaillé (OpenFisca) ;
- le revenu proposé et l'écart à 50, 59 et 63 % ;
- les variantes de retraite et d'IS ;
- le taux de point mort.

Le calcul du proposé est une formule simple (`GagnantsPerdants.revenuPropose`), recalculable en direct quand on bouge les curseurs « socle », « enfant » et « taux ». Pour un foyer quelconque, le revenu **actuel** peut être demandé en direct à l'API OpenFisca, ouverte en CORS. Attention aux deux anomalies (V550, V551) : le coût employeur doit venir de l'API Urssaf, et la CSG des pensions doit être recalculée.

Régénérer : `python3 -I donnees/collecte.py` (réseau requis), puis `jsc cas_types_donnees.js modele.js exporter.js > cas_types.json`.

## 10. Recalage du 03/11/2026 : palier 1 et chemins de financement (`palier1.js`, 54 contrôles ; méthode § 10 ; H440-H449, V6850-V6859)

*Écrit par Claude, une IA d'Anthropic. Le risque propre à ce recalage est de chercher à rassurer sur « ne perdre personne » parce que le RSA est maintenant dans le calcul : les chiffres ci-dessous disent plutôt l'inverse pour les travailleurs modestes.*

### 10.1 Ce qu'il faut retenir

1. **Le constat « D1 à D3 perdent à 45 % et 400 € » ne tient qu'en partie.** Avec le RSA, la prime d'activité, les prestations et les retraités dans la référence (dixièmes de niveau de vie de tous les adultes), le chemin 4 donne **D1 −81 €/mois (−7,8 %), D2 −17 € (−1,0 %), D3 +35 € (+1,7 %)**, contre −118, −59 et −6 dans l'ancienne lecture. D1 perd de façon robuste (de −35 à −125 € selon le nombre de bénéficiaires du plancher, de 2,85 à 1 million) ; D2 est proche de zéro (de −34 à +2) ; D3 gagne (de +5 à +55).
2. **Le plancher RSA protège ceux qui n'ont aucun revenu, pas ceux qui travaillent peu.** La personne seule au RSA passe de 890 € (OpenFisca) à 877 € : −13 €, à tous les chemins. Mais le salarié au Smic perd 145 € (chemins 2 et 3) à 214 € (chemin 4), et le parent isolé au Smic perd de 398 € (palier 1) à 697 € (chemin 4) : ils perdent la prime d'activité, l'aide au logement et les prestations remplacées, et le socle ne compense pas.
3. **D1 est déjà presque à zéro au palier 1** (+21 €/mois, +2 %) quand on le mesure sur tous les adultes : l'ancienne lecture (+178 €) ne comptait que les salariés. Le gain du palier 1 est de 9 à 13 % du revenu pour D2 à D9.
4. **Les chemins 2, 3 et 4 font perdre le smicard** (point mort : 39,3 % de taux plat à 500 €, 34,2 % à 400 €) et, au chemin 4, **D8 à D10** (D6 et D7 sont à zéro). Le cadre à 6 Smic brut, qui gagnait +1 093 € au palier 1, perd 50 € au chemin 2 et 611 € au chemin 4 ; le cadre à 3 Smic brut gagne encore +66 € au chemin 4.
5. **Deux perdants que le modèle ne chiffrait pas** : le retraité locataire au minimum vieillesse perd son aide au logement (−197 € si le palier 1 la supprime sans compensation, ⚠️ H448, V6852), et le parent isolé sans emploi perd **496 €** au plancher ciblé de 1 300 € (« avant » OpenFisca de 1 796 € ; l'estimation de mémoire de 1 650 € donnait −350 €).
6. **Les niveaux d'ensemble ne sont pas fiables, les profils si** : la somme des dixièmes (+136 Md€ au palier 1) dépasse le gain qu'impliquerait le solde public, pour les raisons du § 8 (cotisations imputées, assiette). Lire les écarts entre dixièmes et entre chemins, pas le total (⚠️ V6855).
7. **Montée progressive** : en année 1 (socle de 250 €) D1 perd 159 € et D2 60 € au chemin 1, le smicard 225 € ; en année 10 (socle de 500 €) D1 est à +11 €. La montée reporte la perte sur les plus modestes au départ.

### 10.2 Résultats complets (sortie de `rapport_palier1.js`)

Écart de revenu disponible par rapport au droit actuel (Insee, comptes distribués 2023, RSA, prime d'activité et prestations familiales compris ; aides au logement perdues), central, par dixième de niveau de vie, € par unité de consommation et par mois. Plancher RSA : 877 € pour 1,9 million de personnes sans autre revenu. Dispersion 0,6. Statique : sans réaction de comportement, sans héritage, sans patrimoine.

#### Par dixième, € par mois

| configuration | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 (moyenne) | D10d (1 %) | D10e (0,1 %) | total ménages (Md€/an) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Palier 1 (35 %, socle 500 €) | 21 | 140 | 232 | 259 | 337 | 326 | 388 | 380 | 403 | −72 | −5 327 | −46 898 | 136 |
| Chemin 1, année 1 (38 %, socle 250 €) | −159 | −60 | 23 | 28 | 85 | 62 | 98 | 62 | 46 | −607 | −6 820 | −53 118 | −24 |
| Chemin 1, année 5 (38 %, socle 361 €) | −83 | 17 | 98 | 107 | 168 | 146 | 186 | 153 | 138 | −506 | −6 709 | −53 007 | 24 |
| Chemin 1, année 10 (38 %, socle 500 €) | 11 | 114 | 193 | 206 | 272 | 250 | 295 | 266 | 255 | −380 | −6 570 | −52 868 | 84 |
| Chemins 2 et 3 (41,5 %, socle 400 €) | −69 | 14 | 80 | 73 | 122 | 86 | 108 | 51 | −2 | −831 | −8 121 | −59 934 | −21 |
| Chemin 4 (45 %, socle 400 €) | −81 | −17 | 35 | 11 | 46 | −2 | 0 | −83 | −176 | −1 190 | −9 571 | −66 899 | −82 |

#### Par dixième, en % du revenu disponible actuel

| configuration | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 (moyenne) | D10d (1 %) | D10e (0,1 %) | total ménages (Md€/an) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Palier 1 (35 %, socle 500 €) | 2,0 % | 8,5 % | 11,2 % | 11,0 % | 12,8 % | 11,1 % | 11,9 % | 10,2 % | 9,1 % | −1,0 % | −23,4 % | −38,9 % | 136 |
| Chemin 1, année 1 (38 %, socle 250 €) | −15,4 % | −3,7 % | 1,1 % | 1,2 % | 3,2 % | 2,1 % | 3,0 % | 1,7 % | 1,0 % | −8,2 % | −30,0 % | −44,1 % | −24 |
| Chemin 1, année 5 (38 %, socle 361 €) | −8,1 % | 1,0 % | 4,8 % | 4,5 % | 6,4 % | 5,0 % | 5,7 % | 4,1 % | 3,1 % | −6,9 % | −29,5 % | −44,0 % | 24 |
| Chemin 1, année 10 (38 %, socle 500 €) | 1,0 % | 7,0 % | 9,3 % | 8,8 % | 10,3 % | 8,5 % | 9,0 % | 7,1 % | 5,8 % | −5,2 % | −28,9 % | −43,9 % | 84 |
| Chemins 2 et 3 (41,5 %, socle 400 €) | −6,7 % | 0,8 % | 3,9 % | 3,1 % | 4,6 % | 2,9 % | 3,3 % | 1,4 % | −0,1 % | −11,3 % | −35,7 % | −49,8 % | −21 |
| Chemin 4 (45 %, socle 400 €) | −7,8 % | −1,0 % | 1,7 % | 0,5 % | 1,7 % | −0,1 % | 0,0 % | −2,2 % | −4,0 % | −16,2 % | −42,1 % | −55,6 % | −82 |

Revenu disponible actuel par UC et par mois (Insee 2023) : D1 1 033 ; D2 1 633 ; D3 2 067 ; D4 2 350 ; D5 2 633 ; D6 2 942 ; D7 3 267 ; D8 3 733 ; D9 4 417 ; D10 7 367.

#### Part des adultes non retraités au plancher RSA et coût du plancher

| configuration | D1 | D2 | D3 | coût du plancher (Md€/an) |
|---|---|---|---|---|
| Palier 1 (35 %, socle 500 €) | 21,6 % | 10,0 % | 5,1 % | 8,6 |
| Chemin 1, année 1 (38 %, socle 250 €) | 21,6 % | 10,0 % | 5,1 % | 14,3 |
| Chemin 1, année 5 (38 %, socle 361 €) | 21,6 % | 10,0 % | 5,1 % | 11,8 |
| Chemin 1, année 10 (38 %, socle 500 €) | 21,6 % | 10,0 % | 5,1 % | 8,6 |
| Chemins 2 et 3 (41,5 %, socle 400 €) | 21,6 % | 10,0 % | 5,1 % | 10,9 |
| Chemin 4 (45 %, socle 400 €) | 21,6 % | 10,0 % | 5,1 % | 10,9 |

Le coût du plancher retrouve celui de `palier1.solde` (1,9 M × (877 − socle) × 12) : 8,6 Md€ à 500 €, 10,9 à 400 €, 14,3 à 250 €.

### Cas types, droit actuel OpenFisca 2026 contre palier 1 et chemins (€ par mois ; % du revenu actuel)

| cas type | avant (droit actuel) | palier 1 : après (écart, %) | ch. 1 an 1 : après (écart, %) | ch. 1 an 5 : après (écart, %) | ch. 1 an 10 : après (écart, %) | ch. 2-3 : après (écart, %) | ch. 4 : après (écart, %) |
|---|---|---|---|---|---|---|---|
| Personne seule au RSA (locataire, zone 2) | 890 | 877 (−13 ; −1,5 %) | 877 (−13 ; −1,5 %) | 877 (−13 ; −1,5 %) | 877 (−13 ; −1,5 %) | 877 (−13 ; −1,5 %) | 877 (−13 ; −1,5 %) |
| Salarié seul au Smic à temps plein | 1 707 | 1 792 (+85 ; 5,0 %) | 1 482 (−225 ; −13,2 %) | 1 594 (−114 ; −6,7 %) | 1 732 (+25 ; 1,5 %) | 1 563 (−145 ; −8,5 %) | 1 493 (−214 ; −12,5 %) |
| Couple, 2 enfants, deux Smic à temps plein | 3 523 | 3 984 (+461 ; 13,1 %) | 3 365 (−158 ; −4,5 %) | 3 587 (+64 ; 1,8 %) | 3 865 (+342 ; 9,7 %) | 3 526 (+2 ; 0,1 %) | 3 387 (−137 ; −3,9 %) |
| Couple, 2 enfants, un seul Smic | 2 593 | 2 692 (+99 ; 3,8 %) | 2 132 (−460 ; −17,8 %) | 2 355 (−238 ; −9,2 %) | 2 632 (+40 ; 1,5 %) | 2 363 (−230 ; −8,9 %) | 2 293 (−300 ; −11,6 %) |
| Retraité au minimum vieillesse (ASPA, pension 800 € brut), sans aide au logement | 1 044 | 1 044 (+0 ; 0,0 %) | 1 044 (+0 ; 0,0 %) | 1 044 (+0 ; 0,0 %) | 1 044 (+0 ; 0,0 %) | 1 044 (+0 ; 0,0 %) | 1 044 (+0 ; 0,0 %) |
| Retraité au minimum vieillesse, locataire (avec aide au logement de 305 €) | 1 241 | 1 044 (−197 ; −15,9 %) | 1 044 (−197 ; −15,9 %) | 1 044 (−197 ; −15,9 %) | 1 044 (−197 ; −15,9 %) | 1 044 (−197 ; −15,9 %) | 1 044 (−197 ; −15,9 %) |
| Cadre seul, 3 Smic brut (≈ 4 420 € nets) | 3 777 | 4 746 (+970 ; 25,7 %) | 4 255 (+479 ; 12,7 %) | 4 366 (+590 ; 15,6 %) | 4 505 (+729 ; 19,3 %) | 4 124 (+347 ; 9,2 %) | 3 843 (+66 ; 1,8 %) |
| Cadre seul, 6 Smic brut (≈ 8 300 € nets) | 6 872 | 7 965 (+1 093 ; 15,9 %) | 7 234 (+362 ; 5,3 %) | 7 345 (+473 ; 6,9 %) | 7 484 (+612 ; 8,9 %) | 6 822 (−50 ; −0,7 %) | 6 260 (−611 ; −8,9 %) |
| Parent isolé, 2 enfants, un Smic | 2 590 | 2 192 (−398 ; −15,4 %) | 1 882 (−708 ; −27,3 %) | 1 994 (−597 ; −23,0 %) | 2 132 (−458 ; −17,7 %) | 1 963 (−628 ; −24,2 %) | 1 893 (−697 ; −26,9 %) |
| Parent isolé, 2 enfants, sans emploi (RSA majoré) | 1 796 | 1 300 (−496 ; −27,6 %) | 1 300 (−496 ; −27,6 %) | 1 300 (−496 ; −27,6 %) | 1 300 (−496 ; −27,6 %) | 1 300 (−496 ; −27,6 %) | 1 300 (−496 ; −27,6 %) |

Notes des cas : 
- rsa_seul : RSA de base 651,69 € moins le forfait logement : 572,35 € versés, aide au logement 304,84 €, prime de Noël et autres : 890 € au total (OpenFisca 2026)
- smic_seul : cas T14 (OpenFisca 2026) : net 1 477,93 € + prime d'activité 229,52 €
- couple_2smic_2enf : atlas OpenFisca 2026, zone 2, loyer 750 € ; 2 Smic, prime d'activité, allocations familiales, aide au logement
- couple_1smic_2enf : atlas OpenFisca 2026, zone 2 : remplace l'estimation grossière de 2 552 € de systeme-ideal (⚠️ H447)
- retraite_aspa : cas T14 : ASPA 1 043,59 € ; sanctuarisé par le palier 1 : inchangé
- retraite_aspa_loc : ⚠️ H448 : le palier 1 compte les 16 Md€ d'aides au logement comme remplacés (depensesRemplacees) et ne verse le socle qu'aux non-retraités : l'aide au logement du retraité locataire disparaît dans le modèle, sans compensation
- cadre_2x : cas T14 (OpenFisca 2026) : 3 776,62 €
- cadre_4x : cas T14 (OpenFisca 2026) : 6 871,88 €
- parent_isole_smic : atlas OpenFisca 2026, zone 2 : Smic, prime d'activité, allocations familiales et ASF, aide au logement
- parent_isole_sans_emploi : atlas OpenFisca 2026 : RSA 610 €, aide au logement 494 €, prestations 626 € ; remplace l'« avant » de 1 650 € estimé de mémoire dans systeme-ideal (⚠️ H447)

#### Taux plat qui annule l'écart (point mort), socle 500 € et socle 400 €

| cas | socle 500 € | socle 400 € |
|---|---|---|
| smic_seul | 39,3 % | 34,2 % |
| couple_2smic_2enf | 46,6 % | 41,6 % |
| couple_1smic_2enf | 40,0 % | 29,9 % |
| cadre_2x | 47,1 % | 45,8 % |
| cadre_4x | 41,8 % | 41,2 % |
| parent_isole_smic | 15,0 % | 9,9 % |

### Sensibilité de D1 à D3 (central, chemin 4 : 45 %, socle 400 €, et chemins 2-3, € par UC et par mois)

| hypothèse | ch. 4 : D1 / D2 / D3 | ch. 2-3 : D1 / D2 / D3 | palier 1 : D1 / D2 / D3 |
|---|---|---|---|
| dispersion 0,3 | −81 / −12 / 55 | −69 / 18 / 100 | 21 / 144 / 251 |
| dispersion 0,6 (défaut) | −81 / −17 / 35 | −69 / 14 / 80 | 21 / 140 / 232 |
| dispersion 0,9 | −83 / −30 / 5 | −71 / 1 / 50 | 19 / 127 / 202 |
| plancher RSA : 1 M de personnes | −125 / −34 / 28 | −113 / −4 / 73 | −14 / 126 / 226 |
| plancher RSA : 1,9 M (défaut) | −81 / −17 / 35 | −69 / 14 / 80 | 21 / 140 / 232 |
| plancher RSA : 2,85 M de personnes | −35 / 2 / 42 | −23 / 32 / 87 | 57 / 154 / 237 |

### Comparaison avec l'ancienne lecture (salariés par décile de SALAIRE, sans plancher RSA, options-financement-palier1.md § 6), € par mois

| configuration | lecture | D1 | D2 | D3 | D4 | D5 | D8 | D9 |
|---|---|---|---|---|---|---|---|---|
| Palier 1 | salariés par décile de salaire (ancienne) | 178 | 293 | 381 | 536 | 569 | 556 | 467 |
| Palier 1 | tous les adultes par décile de niveau de vie (nouvelle) | 21 | 140 | 232 | 259 | 337 | 380 | 403 |
| Chemins 2-3 | salariés par décile de salaire (ancienne) | −49 | 29 | 94 | 217 | 227 | 66 | −124 |
| Chemins 2-3 | tous les adultes par décile de niveau de vie (nouvelle) | −69 | 14 | 80 | 73 | 122 | 51 | −2 |
| Chemin 4 | salariés par décile de salaire (ancienne) | −118 | −59 | −6 | 99 | 97 | −144 | −389 |
| Chemin 4 | tous les adultes par décile de niveau de vie (nouvelle) | −81 | −17 | 35 | 11 | 46 | −83 | −176 |

### 10.3 Limites propres au recalage

- Le plancher RSA et ses 1,9 million de bénéficiaires viennent de systeme-ideal (⚠️ effectif à vérifier, V6850) ; le résultat de D1 en dépend directement (tableau de sensibilité).
- Les dixièmes ne modélisent pas les ménages : socle, enfants et conjoints sont répartis au prorata des unités de consommation (H440), et la dispersion intra-dixième est un choix (H441).
- Pas de réaction de comportement, pas d'héritage ni de patrimoine, pas de contribution des hautes pensions (H449) : statique, régime de croisière.
- Cas types : atlas OpenFisca en zone 2, trois loyers ; aucune validation par le simulateur officiel de la CAF.
