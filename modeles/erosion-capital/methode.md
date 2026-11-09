---
titre: Modèle « Érosion du capital » : une grande fortune se disperse-t-elle d'elle-même en quelques générations ? Méthode
statut: brouillon chiffré ; hypothèses HER1 à HER18 ; ordres de grandeur, jamais des prédictions
date: 2026-11-09
---

# Érosion du capital sur plusieurs générations : méthode

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 09/11/2026. Origine : une thèse avancée par l'auteur le même jour, selon laquelle les grandes fortunes s'éroderaient et se disperseraient d'elles-mêmes sur plusieurs générations, et demande de la calculer sur une fortune de l'ordre de celle de Bernard Arnault. Revue de littérature, déclaration d'Elon Musk et verdict : `sources/erosion-capital-generations.md`.

**Risque propre à cette tâche** : confirmer la thèse de l'auteur parce qu'elle est la sienne, ou la démolir par réflexe. Le modèle sépare donc ce que fait l'arithmétique seule (partage, rendement) de ce que fait l'impôt, et donne les trois scénarios.

**Personnes réelles.** Le cas illustratif applique le droit à un montant public (classement Challenges 2026) et à un nombre d'enfants public. Il ne suppose rien sur les intentions, le calendrier, les donations déjà faites, ni l'organisation réelle de la famille ou de ses holdings. C'est un ordre de grandeur pour une fortune de cette taille, pas une estimation de ce qui arrivera à cette famille.

Code : `code/erosion.py` (fonctions pures, paramètres immuables), tests `tests/test_erosion.py` (14 contrôles, dont le recoupement du barème avec `modeles/systeme-ideal/test_cumul_patrimoine.js` et des fonctions avec `modeles/systeme-ideal/fonctions_csv_0811.py`), résultats `resultats.md`, qui font foi, produits par `code/rapport.py`.

Lancer, depuis la racine de l'atelier :
```
python3 -m pytest modeles/erosion-capital/tests -q -p no:cacheprovider
python3 -I modeles/erosion-capital/code/rapport.py > modeles/erosion-capital/resultats.md
```

## 1. Question

Une fortune W0 est transmise. Quelle part de W0 (en euros constants) détient **un descendant moyen** à chaque génération, de 1 (enfants) à 6 (≈ 150 ans plus tard), et quelle part détient **la famille entière** ? Sous quel régime fiscal : droit actuel (avec ou sans pacte Dutreil), notre système, aucun impôt ?

## 2. Chaîne de calcul

Pour chaque génération g = 1 … G :
1. **Transmission** du patrimoine de la génération g − 1 à n_g enfants, chaque enfant payant les droits sur sa part (droit français et notre système : impôt par bénéficiaire ; variante américaine : impôt sur la succession avant partage).
2. **Vie de la génération** pendant T années, année par année : W ← W (1 + r) − W c / (1 − t_div) − P(W). La consommation c est nette ; elle est financée par des revenus distribués, imposés au taux t_div. P(W) est le prélèvement annuel sur le patrimoine (nul en droit actuel pour un patrimoine professionnel).
3. **Déclin de l'entreprise familiale** en fin de vie, avec une probabilité p : la part s du patrimoine placée dans l'entreprise perd la fraction L.

La génération 1 reçoit W0 sans croissance préalable : W0 est la valeur au moment de la première transmission. Le déclin est commun à toute la branche (même entreprise). Les 2^(G−1) chemins de déclin sont **énumérés exactement**, sans tirage aléatoire, d'où l'espérance de la part d'un descendant et la probabilité qu'un descendant garde au moins 1 % de W0. La part familiale = part d'un descendant × nombre de descendants.

## 3. Hypothèses numérotées

Cotes : A = texte de loi ou donnée officielle lue ; B = source secondaire sérieuse ou recoupée ; C = ancrage indirect ; D = convention sans source. « bas » = érosion forte, « haut » = persistance forte.

| n° | Hypothèse | bas / central / haut | Source, cote |
|---|---|---|---|
| HER1 | Durée d'une génération | 30 ans | âge moyen à la maternité ≈ 31 ans en France (Insee, ⚠️ non relu ce jour) ; C |
| HER2 | Rendement réel du patrimoine, net d'IS, avant impôt personnel | 3 / 4,5 / 6 % | Jordà, Knoll, Kuvshinov, Schularick et Taylor, *QJE* 2019 : ≈ 7 % réel pour actions et immobilier, 1870-2015 (diversifié, sans frais) ; Piketty : r ≈ 4-5 % ; Arnott, Bernstein et Wu (2015) : les fortunes dynastiques font moins bien que le marché. Le haut est déjà optimiste sur 150 ans ; C |
| HER3 | Consommation nette, part du patrimoine par an | 2 / 1 / 0,5 % | convention (1 % de 24 Md€ = 240 M€ par an) ; D |
| HER4 | Part du patrimoine placée dans l'entreprise familiale | 90 / 70 / 50 % | convention ; pour le cas illustratif, le classement Challenges est un classement de fortunes professionnelles ; D |
| HER5 | Enfants de la première transmission | générique : = HER6 ; illustratif : 5 | cas illustratif : fait public (cinq enfants) ; B |
| HER6 | Enfants par descendant ensuite (moyenne, sans enfant compris) | 3 / 2 / 1,6 | indicateur de fécondité en France ≈ 1,6 (Insee, ⚠️ non relu ce jour) ; les familles très riches peuvent en avoir plus ; D |
| HER7 | Déclin de l'entreprise : probabilité par génération ; perte de valeur | 50 % ; 70 % / 30 % ; 60 % / 15 % ; 50 % | ancrage : 34 noms seulement de la liste Forbes 400 de 1982 encore présents en 2014 (Arnott et al., relayé) ; mais grandes entreprises familiales centenaires (Hermès, Michelin, Wendel) ; D |
| HER8 | Droit actuel : barème de l'art. 777 (5 à 45 %), abattement de 100 000 € par parent et par enfant (art. 779), un seul parent compté ; rappel fiscal de 15 ans ignoré (négligeable à cette échelle) | — | CGI, barème recoupé avec `modeles/systeme-ideal/cumul_patrimoine.js` (V11300 ✅) ; A |
| HER9 | Pacte Dutreil (art. 787 B) : 75 % de la valeur des titres exonérés ; part du patrimoine éligible = HER4 × part éligible | part éligible 50 / 80 / 100 % | règle : CGI lu par `sources/deces-realisation-plus-values.md` (engagement collectif 2 ans, individuel 6 ans) ; A. Part éligible (holding animatrice, actifs non professionnels exclus) : convention ⚠️ ; D |
| HER10 | Variante « donation avant 70 ans » : réduction de 50 % des droits sur les titres Dutreil donnés en pleine propriété (art. 790) ; démembrement non modélisé (il baisserait encore la base) | — | marginal effectif 45 % × 25 % × 50 % = 5,6 %, comme le rapport AN n° 3056 (p. 165) ; A |
| HER11 | Droit actuel : aucun impôt annuel sur le patrimoine professionnel (l'IFI ne porte que sur l'immobilier) | — | CGI 964 et suivants ; A. Toute taxe récente sur les holdings patrimoniales est ignorée ⚠️ |
| HER12 | Impôt sur les revenus qui financent la consommation : droit actuel 35,4 % (PFU 31,4 % + CEHR 4 %) ; notre système 65,15 % (taux marginal du sommet de la fonction des revenus, a = 0,6515) | — | `sources/cumul-prelevements-patrimoine.md`, `fonctions_csv_0811.py` ; B |
| HER13 | Variante États-Unis : 40 % au-delà de ≈ 13 M€ (≈ 15 M$), sur la succession avant partage ; dividendes 23,8 % ; **sans trusts, GRAT ni fondation**, donc une borne haute de l'impôt réel | — | barème fédéral 2026 (⚠️ non relu) ; C |
| HER14 | Philanthropie à chaque transmission | 0 | paramètre ; D |
| HER15 | Croissance réelle de l'économie, pour exprimer la part d'un descendant « en part de l'économie » | 1,2 %/an | convention ; D |
| HER16 | Fortune initiale du cas illustratif | 121,2 Md€ | classement Challenges du 08/07/2026 (relayé par AFP et FashionUnited) ; **Challenges appartient à Bernard Arnault depuis fin 2025** (même dépêche) ; Forbes en temps réel non lu ; B ⚠️ |
| HER17 | Pas d'hypothèse sur le calendrier : W0 est la fortune au moment de la première transmission, en euros constants | — | choix de méthode |
| HER18 | Notre système, arrêté du 08/11/2026 : fonction des transmissions 50 % (x − K ln(1 + x/K)), x = cumul reçu − 300 000 €, K = 100 000 € ; fonction du patrimoine P(W) = 3 % W² / (W + 400 000 €) sur le patrimoine de chaque descendant, payée chaque année (le différé, porté au taux de l'État, est supposé équivalent) ; aucune exonération d'entreprise (paiement étalé ou en titres, ce qui ne change pas le montant) | — | `modeles/systeme-ideal/fonctions_csv_0811.py`, `sources/transmissions-credit-is-0611.md`, `sources/fonction-patrimoine-v75.md` ; A (pour le code) |

## 4. Effets de comportement et de rebond (non modélisés, à lire avec les résultats)

- **Exil** : dans notre système complet, le prélèvement annuel de 3 % plus 65 % sur les revenus distribués dépasse le rendement central. Le modèle calcule ce que perdrait une famille **qui reste**. Nos propres hypothèses d'exil (`sources/exil-patrimoines-preuves.md` ; érosion de 59 % du capital mobile du 1 % à 3 %, `sources/fonction-patrimoine-v75.md`) disent qu'une partie partirait : l'« érosion » serait alors en partie un départ, pas une dispersion. Moretti et Wilson (*AEJ: Policy* 2023) : les milliardaires du Forbes 400 quittent les États à impôt successoral (relayé par `sources/chiffrage-grandes-fortunes-holdings.md`).
- **Optimisation** : démembrement, assurance-vie, donations tous les 15 ans, holdings, trusts. Le droit actuel « avec Dutreil » est donc une borne haute de l'impôt payé par une famille bien conseillée ; le CAE (note n° 69) estime que le 0,1 % des héritiers les mieux dotés paie environ 10 % de droits sur ce qu'il reçoit.
- **Mariage assortatif** : les descendants épousent souvent d'autres héritiers. Le modèle compte chaque descendant seul ; les conjoints apportent du patrimoine, ce qui ralentit la dilution (argument central de Clark).
- **Mise en commun** : une holding de contrôle (société en commandite, association familiale) évite la vente des titres au partage. Elle ne change pas la part économique de chacun, mais garde la fortune familiale unie et la protège du déclin dû aux cessions.
- **Le rendement d'une fortune n'est pas indépendant de sa taille** : sur 150 ans, une fortune ne peut pas croître durablement plus vite que l'économie sans finir par la posséder. Les scénarios hauts sans impôt (× 2 500 pour la famille en 150 ans) montrent la limite de l'hypothèse de rendement constant, pas une prévision.

## 5. Limites

1. Espérance sur le déclin de l'entreprise, mais pas d'aléa sur le rendement (une crise de type 1914-1945 détruit plus que HER7 : Piketty mesure un flux successoral tombé sous 5 % du revenu national en 1950).
2. Le nombre d'enfants est une moyenne fractionnaire, identique dans toutes les branches.
3. Un seul parent transmet ; pas de conjoint survivant, pas de second décès.
4. Le droit est figé à 2026 sur 150 ans : c'est une lecture du droit actuel, pas une projection.
5. Pas de prise en compte de l'inflation sur les seuils (le barème n'est pas indexé ; à cette échelle, cela ne change rien).
