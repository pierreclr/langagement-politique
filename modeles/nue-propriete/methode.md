---
titre: Modèle « Nue-propriété » : payer la contribution sur le patrimoine en cédant la nue-propriété (T82). Méthode
statut: brouillon chiffré ; hypothèses HNP1 à HNP20 ; ordres de grandeur, jamais des prédictions ; rien n'est intégré à la fonction du patrimoine ni au banc
date: 2026-11-09
---

# Payer la contribution sur le patrimoine en nue-propriété : méthode

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 09/11/2026. Origine : trois positions de l'auteur du 09/11 (payer l'impôt sur le patrimoine en nue-propriété, récompenser ceux qui font circuler le capital, faire converger l'épargne salariale) et sa remarque du même jour : ces mécanismes réduisent les prélèvements à court terme. Tâche T82. Sur le site, l'idée est présentée comme étudiée puis écartée, dans la page « Notre méthode ».

**Risque propre à cette tâche** : l'idée est celle de l'auteur et elle est séduisante (reprendre la main sur le capital sans prélèvement brutal). Le modèle sépare donc trois choses qui se confondent facilement : l'argent qui manque (trésorerie), les biens reçus (patrimoine), et le prix que les marchés font payer à la dette brute (taux endogène).

Code : `code/nue_propriete.py` (fonctions pures ; lignées tirées avec une graine fixe), `code/rapport.py` (écrit `resultats.md`, qui fait foi, et `donnees/resultats.json`), tests `tests/test_nue_propriete.py` (12 contrôles). Données : `donnees/v75_tranches.json`, extrait de la v7.5 retenue par `code/extraire_v75.js` (lecture seule, même liste de chargement que `modeles/systeme-ideal/test_decisions_0611_v75.js`, avec ce fichier à la place du test).

Lancer, depuis la racine de l'atelier :
```
python3 -m pytest modeles/nue-propriete/tests -q -p no:cacheprovider
python3 -I modeles/nue-propriete/code/rapport.py
```

## 1. Question

Si une part des assujettis paie la contribution sur le patrimoine en cédant à l'État la nue-propriété de biens, avec un coefficient c < 1 pour les biens démembrés, que perd le budget chaque année en argent, que récupère l'État au décès et quand, et que devient la dette (brute, puis nette des actifs) ?

## 2. Chaîne de calcul

1. **Tranches** : les sept tranches de patrimoine net de 500 000 € et plus de la v7.5 retenue (ménages, patrimoine net moyen, dû statique après impôt plancher, part différée). Part dans la courbe w = patrimoine net − résidence principale sous 1 M€ (déduite de la charge RP de la v7.5) ; facteur d'échelle s = dû statique / P(w), qui garde l'impôt plancher et la composition.
2. **Lignées** : 3 000 lignées représentatives par tranche, tirées une fois (graine 20261109) : âge de la personne de référence, absence d'héritier, tirages de décès et de choix. Les mêmes lignées servent à tous les scénarios : les écarts entre scénarios ne sont pas du bruit d'échantillonnage.
3. **Choix** : chaque lignée choisit la nue-propriété avec la probabilité min(1, λ × propension) ; λ est calé pour que la part des assujettis (en nombre) qui participent vaille 5, 20 ou 50 %. À chaque décès, l'héritier refait le choix.
4. **Chaque année**, pour un participant : dû = s × P(X + c × D) × 0,567 ; il cède une valeur pleine V = dû / (1 − u(âge)), u étant la part de l'usufruit (art. 669) ; X baisse, D monte. Il ne verse rien en argent. Pour un non-participant : il paie comme aujourd'hui, comptant et différé.
5. **Décès** (dernier survivant du couple) : l'État devient plein propriétaire de D ; l'héritier reçoit X (et paiera désormais sur X seulement) ; les droits de transmission ne portent plus que sur X.
6. **Trésorerie** = écart de comptant + écart de recouvrement du différé (1/12 de l'encours par an, comme la couche CORRECTION0811, perte de 5 %) + écart de droits de transmission + revenus des biens en pleine propriété publique.
7. **Dette** : la série de notre système (banc, trajectoire de référence) plus l'effort qui la stabilise au taux endogène central (42 Md€) sert de référence ; on y ajoute l'écart de trésorerie et l'on relance `modeles/taux-endogene/taux.py` (central, et variante à taux fixe 4,7 %).
8. **Patrimoine net des administrations** = − écart de dette + nue-propriété détenue (barème de l'art. 669) + biens en pleine propriété publique − créances de différé qui n'existent plus.

## 3. Hypothèses numérotées

Cotes : A = texte de loi ou donnée officielle lue ; B = source secondaire sérieuse ou recoupée ; C = ancrage indirect ; D = convention sans source.

| n° | Hypothèse | Valeur | Source, cote |
|---|---|---|---|
| HNP1 | Fonction du patrimoine : v7.5 retenue, P(W) = 3 % W² / (W + 400 000 €), résidence principale à part, règle de paiement et différé de la v7.5 | — | chapitre 3 ; `resultats_decisions_0611_v75.txt` ; A (pour le code) |
| HNP2 | Base d'un participant : X + c × D (c = 0,5 / 0,3 / 0,1) ; la pleine propriété compte 1 | — | demande de l'auteur (09/11) ; D |
| HNP3 | Valeur de la nue-propriété cédée : barème fiscal de l'usufruit selon l'âge (CGI, art. 669 : 50 % d'usufruit de 51 à 60 ans, 30 % de 71 à 80 ans…) ; pour un couple, l'âge du ménage | — | CGI art. 669, ⚠️ texte non relu ce jour ; A |
| HNP4 | Comportements : recette nette = 0,567 × dû statique, dans les deux mondes (calage de la v7.5). Un participant qui ne paie plus en argent s'exile peut-être moins : non modélisé (favorable au mécanisme) | 0,567 | v7.5 ; C |
| HNP5 | Âge des assujettis : part de la masse de patrimoine net par âge (Insee, HVP 2023-2024) : moins de 40 ans 9,3 %, 40-49 13,9 %, 50-59 23,7 %, 60-69 22,8 %, 70 ans et plus 30,3 % (découpés 18,2 % / 12,1 % entre 70-79 et 80 ans et plus) | — | `sources/patrimoine-generations.md` § 1 ; découpage des 70 ans et plus : D ⚠️ |
| HNP6 | Mortalité : loi de Gompertz (pente 0,105) calée sur une espérance de vie à 65 ans de 21,6 ans (moyenne femmes-hommes) ; pas de gain futur (variante + 3 ans) | 21,6 ans | ordre de grandeur Insee 2023, ⚠️ non relu ce jour ; C |
| HNP7 | 60 % des ménages assujettis en couple ; usufruit réversible sur le conjoint : l'État attend le second décès | 60 % | D ⚠️ |
| HNP8 | 15 % des ménages sans descendant ; âge à l'héritage 50 ans | — | âge : CAE note n° 69 et France Stratégie (`sources/patrimoine-generations.md` § 2) ; B. Sans descendant : D ⚠️ |
| HNP9 | « Assujettis » : ménages de 500 000 € de patrimoine net et plus (8,57 M), qui paient 99,6 % de la courbe | — | D |
| HNP10 | Participation : 5 / 20 / 50 % des assujettis en nombre, au départ et à chaque héritage | — | scénarios demandés ; D |
| HNP11 | Propension relative : (1 − u(âge)) × (3 sans héritier, 1 sinon) × (1 + 2 × part productive) : plus on est âgé, moins la nue-propriété coûte à soi-même ; sans héritier, elle ne coûte rien à personne ; un patrimoine illiquide se paie mal en argent | — | D (variante : choix indépendant) |
| HNP12 | Le patrimoine de chaque lignée suit le PIB nominal (unités du banc) ; aucun rendement propre ni consommation | — | convention du banc ; D |
| HNP13 | Droits de transmission perdus : fonction du système (50 % (x − K ln(1 + x/K)), abattement 300 000 €), deux héritiers, base après comportements 61,6 % au-delà de l'abattement | — | chapitre 3 (déclaration 30 %, exil 12 %) ; `modeles/erosion-capital` ; C |
| HNP14 | Un bien revenu en pleine propriété publique rapporte 2 % par an en argent (dividendes, loyers nets) ; l'État ne le vend pas ; variantes 1 % et 3 % | 2 % | rendement distribué central de la v7.4 (dividendes 2 %, loyers nets 2 %) ; C |
| HNP15 | Part productive de la courbe : biens professionnels + φ × financier (Insee Focus n° 371 et φ de `taxe_patrimoine.js`), rapportée à la courbe ; les participants cèdent un panier proportionnel | 26 à 77 % | B (composition) ; D (panier) |
| HNP16 | Variante salariés : 20 % des participants de 1 M€ et plus cèdent d'emblée leur part productive (usufruit aux salariés, nue-propriété à l'État) ; l'usufruit d'une personne morale dure 30 ans au plus (C. civ., art. 619) ; les salariés ne paient rien sur cet usufruit (sous les seuils) | — | art. 619, ⚠️ non relu ; D |
| HNP17 | Différé de la fonction actuelle : recouvré de 1/12 de l'encours par an, 5 % jamais recouvré | — | couche CORRECTION0811 (HC1) ; v7.4 ; C |
| HNP18 | Référence de dette : série du système (banc) + 42 Md€ d'effort stabilisant, taux endogène central (T74) ; prolongée à plat après 2058 | — | `modeles/taux-endogene/` ; D pour le prolongement |
| HNP19 | Dénominateur de la « part du capital productif » : titres et biens professionnels de la courbe des assujettis dans le modèle (cohérent avec les cessions). Pour mémoire, les comptes de patrimoine donnent 2 424 Md€ (actions et participations hors OPC 1 745 + OPC 409 + actifs produits des entrepreneurs individuels 270, fin 2024) pour tous les ménages, moins que le modèle : la composition par tranche de l'enquête et la valeur des non cotés pèsent plus dans le haut. Le capital productif national n'est pas chiffré ⚠️ | — | Insee Première n° 2081 (lu dans `taxe_patrimoine.js`) ; A pour le fait, D pour le choix |
| HNP20 | Le reste du système ne bouge pas (pas d'effet sur les prix des actifs, sur l'investissement, ni sur la fonction des revenus de l'usufruitier) | — | D |

## 4. Effets de comportement et de rebond (non modélisés, à lire avec les résultats)

- **Sélection des biens** : le contribuable choisit ce qu'il cède. Il cédera la nue-propriété des biens qu'il juge surévalués, les moins liquides, les parts minoritaires de sociétés non cotées. Sans règle (panier imposé, évaluation indépendante, droit de refus de l'État), l'État reçoit les plus mauvais actifs au prix fiscal.
- **Usufruitier sans intérêt à long terme** : un usufruitier âgé a intérêt à distribuer tout le résultat et à ne plus investir ; la valeur que l'État reçoit au décès en souffre (problème classique du démembrement ; le Code civil oblige l'usufruitier à conserver la substance, art. 578, mais le contrôle d'une société est difficile).
- **Exil** : payer sans sortir d'argent rend la contribution moins douloureuse ; une partie de l'érosion de 59 % du capital mobile du 1 % pourrait baisser : la recette des non-participants augmenterait. Non chiffré, favorable au mécanisme.
- **Effet sur les héritiers** : ce sont eux qui paient vraiment (ils reçoivent X au lieu de W). Une partie des assujettis avec héritiers refusera ; c'est ce qu'exprime la propension (HNP11).

## 5. Points juridiques (signalés, non tranchés)

1. **Droit de vote des titres démembrés** (C. civ., art. 1844, al. 3) : le vote appartient au nu-propriétaire, sauf pour l'affectation des bénéfices, réservée à l'usufruitier ; les statuts peuvent déroger, mais la Cour de cassation garde au nu-propriétaire le droit de participer aux décisions collectives. Promettre que le cédant « garde le contrôle » suppose une loi ou des statuts qui donnent le vote à l'usufruitier. À l'inverse, à 50 % de participation, l'État nu-propriétaire d'une part à deux chiffres du capital productif des assujettis en 20 à 40 ans (`resultats.md` § 3) poserait une question de neutralité de l'État actionnaire. ⚠️ À instruire avec un juriste.
2. **Évaluation des non cotés** : la valeur de la nue-propriété cédée repose sur la valeur pleine (expertise) et sur le barème de l'âge. Les parts de holdings et de sociétés non cotées sont l'essentiel des tranches de 2 M€ et plus (part productive 58 à 77 % de la courbe ici). Une surévaluation de 20 % reçue en paiement est une perte de 20 % pour l'État.
3. **Usufruit des salariés** : un usufruit au profit d'une personne morale (fonds, SCOP, société des salariés) est limité à 30 ans (C. civ., art. 619) ; un usufruit à chaque salarié pose la question de la mobilité (départ de l'entreprise) et du traitement fiscal de l'avantage (⚠️ non instruit).
4. **Égalité devant l'impôt et droit de l'UE** : une option de paiement en nature réservée à certains biens et un coefficient de faveur doivent être justifiés (Conseil constitutionnel, art. 13 de la Déclaration de 1789) ; la prise de participation publique dans des sociétés soulève le droit des aides d'État si l'usufruitier reçoit un avantage. ⚠️ Non instruit.
5. **Précédent** : la dation en paiement (CGI, art. 1716 bis) existe pour les œuvres d'art et quelques biens, sur agrément ; elle porte sur la pleine propriété.

## 6. Limites

1. Lignées représentatives par tranche : la dispersion des patrimoines à l'intérieur d'une tranche est ignorée (la fonction est presque linéaire au-dessus de 2 M€, l'erreur y est faible).
2. Âge des assujettis approché par la masse de patrimoine par âge de l'ensemble des ménages, pas des seuls patrimoines de 500 000 € et plus (⚠️ fichier détail HVP à exploiter).
3. Pas de retour macroéconomique ni d'effet de prix des actifs ; pas de vente par l'État.
4. Au-delà de 2058, le modèle de taux n'est plus dans son horizon : les chiffres de 2068 et 2088 sont donnés pour le calendrier des actifs, pas pour la dette.
