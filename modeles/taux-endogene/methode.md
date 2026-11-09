---
titre: Taux d'intérêt endogène (T74) — méthode
date: 2026-11-09
statut: brouillon ; écrit par Claude (IA d'Anthropic) pour l'auteur ; des ordres de grandeur sous hypothèses, jamais des prédictions
---

# Taux d'intérêt endogène : méthode

**Demande de l'auteur (09/11/2026)** : recaler les résultats sur le nouveau taux et modéliser son évolution selon les efforts budgétaires.

**Ce que fait ce dossier.** Une couche de sensibilité, à côté du banc d'essai, qui remplace le taux de marché fixe (3,45 %) par un taux qui dépend de la dette et du déficit, et rejoue les mêmes tirages des programmes. **Rien n'est modifié** dans `modeles/banc-programmes/` ni dans `modeles/systeme-ideal/` : le banc reste au taux fixe, et ce dossier dit ce que deviennent ses résultats si l'on prend le taux au sérieux. Faits sourcés : `sources/taux-souverains-faits-2026.md`. Résultats : `resultats.md` (généré).

Légende : **fait** (source lue, cote A-D) · **estimation** (méthode donnée) · **hypothèse** (de Claude, H-TE) · ⚠️ non vérifié.

## 1. Où le taux entrait jusqu'ici

- **Banc d'essai** (`modeles/banc-programmes/moteur.py`, `trajectoire_dette`) : taux de marché `macro['r']` = 3,45 % (référence) ou 3,95 % (prudente), constant de 2026 à 2058 ; taux apparent de départ 65,7 / 3 460,5 = 1,90 % ; convergence `ieff += (r − ieff) / 8` ; intérêts = ieff × dette de l'année précédente. Paramètres lus dans `donnees/cache/systeme.json` (bloc `eco`), eux-mêmes repris de `modeles/risques/stress.js` (`ECO.imarche`, R3 : « OAT 10 ans, début 2026 »).
- **Système idéal** (`modeles/systeme-ideal/variante_dette_stable.js`, `retraites_aisees_0611.js`, `decisions_0511e/f/g.js`) : même récursion, `ST.ECO.imarche` = 0,0345 ; `macro` de référence, prudente (3,95 %) et favorable (3,0 %).
- **Aucun de ces modèles ne fait dépendre le taux de la dette.** Le seul effet de taux endogène du dépôt est `capitalisation_cohortes.js` (β de 0 / 2 / 4,5 pb par point de dette de transition, H233, H241), limité à la dette de transition des retraites.

## 2. Le modèle

Pour chaque année t ≥ 2027 :

1. **Taux de marché** (OAT à 10 ans) : r(t) = r_sf + prime(t), avec r_sf le taux sans risque (Bund à 10 ans) et
   prime(t) = prime0 + a_d × [d(t−1) − d0] + a_def × [déf(t−1) − déf0] + γ × ( max(0, d(t−1) − seuil)² − max(0, d0 − seuil)² ),
   bornée à [0 ; 15 points]. d = dette / PIB, déf = déficit total (intérêts compris) / PIB, en points ; (d0, déf0) = état simulé fin 2026 (ancrage).
2. **Option TPI** : si le pays est éligible (déficit ≤ 3 %, ou en baisse d'au moins 0,4 point sur un an), la prime est plafonnée (1,75 point dans la variante).
3. **Coût d'émission** = r(t) + écart d'émission (le programme de l'AFT n'émet pas tout à 10 ans).
4. **Taux apparent** : une part s du stock est renouvelée chaque année au coût d'émission ; l'emprunt net nouveau est émis au coût d'émission ; un remboursement net retire de la dette au taux moyen. Masse de coupons C : C ← (1 − s) C + s × r_ém × D(t−1) ; intérêts(t) = C ; puis C ← C + r_ém × (D(t) − D(t−1)).
5. **Dette** : D(t) = D(t−1) − solde primaire(t) + intérêts(t) + opérations financières(t) ; solde primaire = celui de 2024 maintenu en part du PIB (−103,4 Md€ de 2025) + effet du programme ou de l'effort.
6. **Boucle** : la dette et le déficit de l'année t nourrissent la prime de t + 1.

**Mode « banc »** : avec s remplacé par la convergence 1/8 du banc, sans prime ni écart d'émission et avec r fixé à 3,45 %, la fonction redonne la trajectoire du banc **au millième de point près** (test `test_reproduit_le_banc`) ; les médianes des quatre programmes, rejouées avec les mêmes 10 000 tirages et la même graine, sont identiques à celles du banc (contrôle écrit dans `resultats.md`).

## 3. Hypothèses numérotées

| N° | Hypothèse | bas / central / haut | Source, cote, statut |
|---|---|---|---|
| H-TE1 | **Taux sans risque** = Bund à 10 ans, constant sur la période | 2,9 / **3,4** / 3,9 % | Fait : Bund 3,47 % en moyenne de septembre 2026 (BCE, taux de convergence, A) ; ≈ 3,4 % fin octobre (presse financière, C). Bas = retour vers 2,9 % (printemps 2026, BCE) ; haut = +0,5 point (hausse de taux de la BCE anticipée par les marchés, C). Constance : hypothèse, pas une prévision. |
| H-TE2 | **Prime de départ** (écart OAT-Bund) | 0,8 / **1,3** / 1,7 point | Fait : 0,69 à 0,84 point en moyenne mensuelle 2025 (BCE, A) ; 0,97 en septembre 2026 (BCE, A) ; 1,53 à 1,76 point les 20-23/10/2026 (presse, C, plusieurs sources concordantes à ±0,2) ; OAT ≈ 4,8 % le 09/11/2026 (Trading Economics, C). Central = entre septembre et le pic d'octobre. |
| H-TE3 | **Taux de 2026** (année déjà largement écoulée) | 3,9 % | Estimation : moyenne des moyennes mensuelles BCE de janvier à septembre 2026 (3,40 à 4,44 %) et d'environ 4,85 % en octobre (presse). |
| H-TE4 | **Ancrage** : la prime de départ s'applique à l'état simulé fin 2026 (dette 118 %, déficit 5,9 % dans la chaîne du banc), et la prime ne varie qu'avec l'**écart** à cet état | — | Choix de méthode : il évite de prétendre expliquer le niveau de l'écart (qui contient une prime politique : budget, élection de 2027) et ne garde des études que les **pentes**, ce qu'elles mesurent. Conséquence : la part politique de l'écart est supposée persister ; elle peut retomber (bas) ou monter. |
| H-TE5 | **Sensibilité à la dette** a_d (pb par point de dette / PIB) | 1 / **2** / 4 | Études lues (V2982, V3050-V3052) : Laubach 2009 3-4 pb (États-Unis, A) ; Poghosyan 2012 2 pb (22 pays avancés, B) ; Baldacci-Kumar 2010 1,7 pb (G20 avancé, B), plus forte quand la dette de départ est élevée ; Kinoshita 2006 2 à 5 pb (B) ; zone euro : ≈ 0 avant 2009, puis significatif (Afonso et al. 2015, BCE, B ; De Grauwe-Ji 2013, A : 0,3 pb non significatif avant la crise, **11,6 pb après**, tableau 3). Central = celui déjà retenu dans le dépôt (H233, H241). |
| H-TE6 | **Sensibilité au déficit total** a_def (pb par point de déficit / PIB) | 0 / **10** / 25 | Laubach 2009 : ≈ 25 pb par point de déficit **projeté** (A), mais estimé **à la place** de la dette, pas en plus : additionner les deux surcompterait (le déficit d'aujourd'hui est la dette de demain). Baldacci-Kumar 2010 : effet du déficit d'environ 10 pb de plus dans les pays à déficit ou dette élevés (B). Afonso et al. 2015 : coefficient du déficit plus que doublé depuis 2009 (B). Central 10 pb = choix de Claude ⚠️. |
| H-TE7 | **Non-linéarité** : γ (pb par point² au-delà du seuil) et seuil | 0 au-dessous de 140 % / **0,03 au-delà de 130 %** / 0,09 au-delà de 120 % | De Grauwe et Ji 2013 (A, *JIMF* 34, tableau 1, zone euro 2000-2011) : terme au carré de 0,0009 point de spread par point² de dette, soit **0,09 pb par point²**, très significatif ; il porte sur une période de crise (Grèce, Irlande, Portugal compris), d'où son usage en haut seulement. Le signe du terme linéaire associé (0,0523, non significatif) n'est pas lisible dans la version texte ⚠️. Ghosh et al. 2013 (« fiscal fatigue », *Economic Journal*, A) modélisent un taux qui monte de façon convexe avec la dette jusqu'à une limite : cité de mémoire, non relu ⚠️. Seuils : choix de Claude ⚠️ (la France est à ≈ 118 % fin 2026). |
| H-TE8 | **Délai** : la prime de l'année t dépend de la dette et du déficit constatés fin t − 1 | — | Simplification. Les marchés regardent les dettes et déficits **projetés** (Laubach) : un plan crédible ferait baisser la prime plus tôt, un dérapage annoncé la ferait monter plus tôt. Le modèle est donc en retard d'un an environ dans les deux sens. |
| H-TE9 | **Écart d'émission** (coût moyen des émissions − OAT 10 ans) | −0,4 / **−0,2** / 0 point | Fait : AFT, rapport d'activité 2025 (copie vie-publique.fr, A) : taux moyen pondéré des émissions à plus d'un an à taux fixe 3,14 % en 2025, contre 3,37 % pour les émissions à 10 ans ; BTF 2,12 %. |
| H-TE10 | **Renouvellement** s (part du stock refinancée chaque année) | 11,8 / **13** / 14 % | Fait : AFT 2025 (A) : durée de vie moyenne de la dette négociable 8,50 ans (1 / 8,5 = 11,8 %) ; amortissements de titres à moyen et long terme 166,1 Md€ en 2025 et encours de BTF 195,9 Md€, pour un encours de 2 737 Md€ : (166,1 + 195,9) / 2 737 ≈ 13,2 %. Amortissements 2027 en hausse de 19,4 Md€ (AFT via presse, C). Le banc utilise 1/8 = 12,5 %. Hypothèse : appliqué à toute la dette des administrations publiques (3 460,5 Md€), pas seulement à celle de l'État. |
| H-TE11 | **TPI** : plafond de prime de 1,75 point si déficit ≤ 3 % ou en baisse de 0,4 point sur un an | option | Fait : communiqué de la BCE du 21/07/2022 (A) : achats « non restreints ex ante », pour contrer des évolutions « injustifiées et désordonnées » ; critères cumulatifs : respect du cadre budgétaire de l'UE (ne pas être en procédure pour déficit excessif **ou** ne pas avoir manqué d'agir), absence de déséquilibres graves, soutenabilité de la dette, politiques saines. La France est en procédure pour déficit excessif depuis le 26/07/2024 (dossier dette stable, A). Plafond de 1,75 point : ordre de grandeur cité par une conseillère d'émetteurs souverains (Boursier.com, 02/10/2026, C) ; la règle d'éligibilité est **une stylisation de Claude** ⚠️ : le TPI est discrétionnaire, jamais activé à ce jour (⚠️ à vérifier). |
| H-TE12 | **Zone de crise** = prime > 3 points ; prime plafonnée à 15 points | — | Repères : Italie ≈ 5,5 points et Espagne ≈ 6 points au pic de 2011-2012 ⚠️ (mémoire, à sourcer) ; au-delà de 3 points, la littérature décrit des équilibres multiples (De Grauwe-Ji 2013) : le modèle ne sait plus dire si le pays s'en sort (ajustement, aide du MES, BCE) ou non. Les valeurs postérieures à l'entrée en crise sont affichées « n.s. ». |
| H-TE13 | **Croissance nominale** 3 % (référence du banc), 2,5 % (prudente) ; **indépendante des taux** | — | Repris du banc (R5). Limite forte : un taux sans risque plus haut va souvent avec plus d'inflation, donc plus de croissance nominale (r − g compte, pas r seul) ; inversement, une prime de risque élevée freine l'activité. Ni l'un ni l'autre n'est modélisé. |
| H-TE14 | **Effort budgétaire** = amélioration du solde primaire par rapport au droit actuel du banc, en Md€ de 2025, montée linéaire 2028-2032 puis constante en part du PIB ; statique (pas d'effet sur l'activité) | 0, 30, 60, 100, 150 | Demande de l'auteur. 30 Md€ ≈ 1 point de PIB. Le « droit actuel » du banc garde le solde primaire de 2024 : il est plus pessimiste que la trajectoire officielle (PLF 2027 : 43 Md€ de mesures nouvelles), donc un effort de 60 à 100 Md€ ici recouvre en partie ce que le gouvernement présente déjà comme acquis ⚠️. |
| H-TE15 | **Multiplicateur** (option) : écart de production = 0,5 × écart précédent − 0,8 × variation de l'effort / PIB ; 45 % du PIB perdu manque en recettes | 0 (défaut) / 0,8 | Multiplicateur central de dépense du banc (`relancer.py`, M_DEP) ; taux de retour du banc (`moteur.TAUX_RETOUR`, ⚠️ V31008). Persistance de 0,5 : choix de Claude ⚠️. |
| H-TE16 | **Dette indexée sur l'inflation** : non distinguée | — | Fait : 306,6 Md€ d'OAT indexées fin 2025, soit 11,2 % de la dette négociable de l'État (AFT 2025, A). Le modèle les traite comme de la dette nominale au même taux : juste si l'inflation est celle qu'anticipaient les marchés ; une inflation plus forte alourdit la charge (supplément d'indexation de 15,5 Md€ en 2022, AFT, A). |

## 4. Ce que le modèle ne fait pas

- Pas d'effet de la prime sur la croissance, l'investissement ou le crédit (canal bancaire), ni de contagion à la zone euro.
- Pas de réaction de la politique budgétaire à la crise : un gouvernement qui voit la prime monter consolide ; le modèle ne le fait pas (il dit combien il faudrait).
- Pas de calendrier réel des tombées (renouvellement uniforme), pas de courbe des taux (un seul taux d'émission), pas de distinction État / Sécurité sociale / collectivités.
- Les sensibilités viennent de panels qui mêlent pays et époques : elles ne disent pas comment les marchés réagiront à la France de 2027. **Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions.**
- « Sensibilités hautes » n'est pas uniformément défavorable : des marchés plus réactifs punissent plus vite un dérapage, mais récompensent plus vite une consolidation (effort de 150 Md€ : dette 2058 plus basse qu'au central). Il faut les lire comme « marchés plus réactifs ».

## 5. Fichiers

| Fichier | Rôle |
|---|---|
| `taux.py` | Fonctions pures : `params`, `prime_fondamentale`, `prime`, `eligible_tpi`, `effort_md`, `trajectoire`, `annee_crise`, `effort_stabilisant`, `effort_supplementaire` |
| `calculer.py` | Grille d'efforts ; rejoue les 10 000 tirages du banc (graine 20261108, même ordre de consommation du générateur) pour LFI, RN, notre système et le fil de l'eau ; lit les caches du banc en lecture seule ; écrit `resultats.md` et `donnees/resultats.json` |
| `tests/test_taux.py` | 10 tests (reproduction du banc, ancrage et pentes de la prime, convexité, TPI, convergence du taux apparent, monotonie de l'effort, effet de la boucle, multiplicateur, effort stabilisant) |

```
python3 -I modeles/taux-endogene/tests/test_taux.py
python3 -I modeles/taux-endogene/calculer.py            # ≈ 30 s
```
