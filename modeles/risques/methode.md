---
titre: Risques et tests de résistance : méthode et hypothèses
tache: chantier 5 de la boucle « meilleur système »
date: 2026-11-03
statut: brouillon, ordres de grandeur sous hypothèses
---

# Risques et tests de résistance : méthode

Code : [`stress.js`](stress.js) (fonctions pures, 268 contrôles dans [`test_stress.js`](test_stress.js), 306 avec l'architecture v2, 344 avec la v3 si `capital-de-depart/modele.js` et `continu.js` précèdent `optimum.js`), tableaux : [`rapport_stress.js`](rapport_stress.js) → [`resultats-brut.txt`](resultats-brut.txt) (fait foi). Résultats commentés : [`resultats.md`](resultats.md). Ce module **ne modifie rien** dans `modeles/systeme-ideal/` : il le charge en lecture (`OptionsFinancement`, `Palier1`, `TaxePatrimoine`, `SystemeIdeal`). Deux états temporaires sont touchés pendant le calcul de l'exil (scénarios `__h0`, `__x`, `__c`, `__d` de `SystemeIdeal.SCENARIOS` et paramètres d'érosion de `TaxePatrimoine.PARAM`) ; ils sont restaurés dans un `finally` et un contrôle le vérifie.

Transparence : ce texte est écrit par Claude, une IA d'Anthropic. Le risque propre à cette tâche est double : la complaisance (le système est celui de l'auteur, donc j'ai envie qu'il résiste) et le chiffre d'apparence précise qui cache une hypothèse. Les hypothèses sont donc numérotées et les plus fragiles sont marquées ⚠️.

## 1. Principe

Un test = une trajectoire sur 10 ans (l'année 1 est 2029, premier bloc réel du plan de bascule) avec et sans choc, pour une architecture et un scénario.

1. **Solde structurel** de l'année t = solde de croisière de l'architecture (`OptionsFinancement.solde`) + création de valeur de l'année t (`Palier1.valeurPourScenario`) − transition (année 1) − report du paiement différé de la taxe (9,1 Md€/an non encaissés avant les premiers recouvrements, ramené à 8,6 net de la perte de croisière), le tout mis à l'échelle du PIB nominal.
2. **Intérêts** : le déficit du modèle contient déjà les intérêts de 2025 (65,7 Md€). On les retire pour obtenir un solde primaire, puis on recalcule les intérêts sur la dette de la trajectoire avec un taux moyen qui converge vers le taux de marché avec la durée de vie de la dette (1/8 par an).
3. **Dette** : D(t) = D(t−1) − solde(t). Ratio dette/PIB sur le PIB réel de l'année (écart de production compris).
4. **Chocs** ajoutés au solde (et, pour la récession, au dénominateur).
5. **Garde-fous** : appliqués avec un an de retard, en deux temps (marge de ± 2 points de taux plat, puis coupe du socle jusqu'à 150 €). Le manque restant est « manque résiduel ».
6. **Réserve** : cumul du manque des trois premières années (les chocs temporaires) ; « manque cumulé » : cumul sur dix ans (les chocs permanents).

Architectures testées (`ARCHS`) :
- **P1N** : palier 1 (35 %, 500 €) + réforme immobilière + taxe de 1 % nette de dettes avec paiement différé. Croisière : −99,6 Md€ au central.
- **C40** : chemin « 40 % / 500 € » documenté dans `taxe-patrimoine-1pc.md` (T5 : taxe brute, fin du report 150-0 B ter, décès avec report, PFU 50 %, économies volontaires, CIR supprimé). Croisière : +0,3.
- **C40N** : C40 avec la variante recommandée de la taxe (nette de dettes, paiement différé). Croisière : −15,2.
- **ACTUEL** : droit actuel, déficit de 2024 conservé (−169,1 Md€), pour comparer les stabilisateurs.

Toute autre architecture se teste en ajoutant une entrée à `ARCHS` (objet d'option de `options_financement.js`).
- **V2** (03/11, R31-R34) : architecture finale v2 d'`optimum.js` (41 %, socle 350 €, sortie « plat », exil défendable). Croisière : +2,2 au central. Présente seulement si `optimum.js` est chargé.

## 2. Hypothèses

| n° | hypothèse | valeur | source ou motif |
|---|---|---|---|
| R1 | Dette Maastricht fin 2025 ; PIB 2025 déduit | 3 460,5 Md€ ; 2 991 Md€ (115,7 %) | Insee Première 2106 (mai 2026) via `sources/calculs/cout_sortie_ue.py` |
| R2 | Intérêts 2025 (déjà dans le déficit du modèle) | 65,7 Md€ | Insee, `sources/plan-de-bascule.md` § 3.4 |
| R3 | Taux de marché de la dette : OAT 10 ans | 3,45 % ; taux moyen initial 1,9 % (65,7 / 3 460,5) | `sources/recherche-creer-de-la-valeur.md` (début 2026). **La dérive du taux moyen vers 3,45 % est dans toutes les trajectoires « sans choc »** : les intérêts passent de 66 Md€ (2025) à 103 Md€ en 2029 et 142 Md€ en 2038 (C40N, central), contre 88 Md€ en 2038 si le taux moyen restait à 2,2 %. Si le taux moyen restait à 2,2 %, la dette/PIB à 10 ans serait de 120 / 86 / 93 % (P1N / C40 / C40N) au lieu de 131 / 95 / 103 % |
| R4 | Durée de vie moyenne de la dette : 8 ans ; refinancement linéaire ; +100 pb = 4,3 Md€ en année 1 et 34,6 à plein régime | hypothèse | `cout_sortie_ue.py` ⚠️ (V7942) |
| R5 | Croissance nominale 3 % (1,2 réelle + 1,8 d'inflation) | hypothèse | `plan-de-bascule.md` § 3.4 ⚠️ |
| R6 | Écart de PIB après une récession type 2009 : −4,1 / −3,4 / −2,4 / −1,2 / 0 % de la tendance (−3 % la 1re année, puis rebond) | hypothèse calée sur 2009-2011 | PIB France 2009 ≈ −2,9 %, 2010 ≈ +1,9 %, 2011 ≈ +2,2 % ⚠️ de mémoire (V7943) |
| R7 | Semi-élasticité du solde au PIB, droit actuel : 0,63 (France), 0,50 (moyenne UE, scénario haut) | | Mourre et al. (Commission, 2014 et 2019) ; Girouard et André (OCDE, 2005) : environ 0,5 pour l'UE ; France 0,63 d'après Intereconomics 2019 ⚠️ source secondaire (V7943) |
| R8 | Semi-élasticité du nouveau système : 0,60 / 0,53 / 0,46 (bas / central / haut) | estimation de Claude | § 3 ci-dessous ⚠️ (V7944) |
| R9 | Coupe maximale du socle par la clause de sauvegarde : 150 € | | `plan-de-bascule.md` R2 (≈ 146 €) ; la pente (≈ 43 Md€ par 100 €) est celle du modèle (`Palier1.penteSocle`) |
| R10 | Marge de ± 2 points de taux plat par loi de finances | | `plan-de-bascule.md` R3 ; le gain par point est celui du modèle (11,1 à 12,6 Md€ au central, 5,5 à 7,3 au haut), réactions comprises |
| R11 | Provision du système d'information : 5 (central) / 13 (haut) Md€ | | `plan-de-bascule.md` R5, ⚠️ V7936 |
| R12 | Paiement différé : 9,1 Md€/an reportés pendant 15 ans, perte de croisière 0,5 | | `taxe-patrimoine-1pc.md` § 5 |
| R13 | Les années 2026-2028 se déroulent au droit actuel (déficit de −169,1 Md€ à l'échelle du PIB), d'où une dette de 4 037 Md€ et 123,5 % du PIB au départ de 2029 | hypothèse | le plan de bascule place le premier bloc réel au 01/01/2029 |
| R14 | Le solde structurel suit le PIB nominal (ratio constant) ; les flux de création de valeur (lignes A à E de `palier1.js`) suivent aussi le PIB nominal | hypothèse | simplification : le modèle de croisière est statique |
| R15 | Création de valeur : « sans E » = `sansE` de `Palier1.valeurPourScenario` ; « aucune » = A à E à zéro | | `palier1.js`, ligne E = croissance par l'IA (+0,3 %/an central) |
| R16 | Krach immobilier : −20 % trois ans, puis retour linéaire en trois ans ; krach boursier : −30 % la 1re année, −15 % la 2e, puis retour | hypothèse | choc de `taxe-patrimoine-1pc.md` (H520) ; le retour est une hypothèse |
| R17 | Les droits de succession (103,5 Md€ au central) suivent le patrimoine : part de l'immobilier 59 % du patrimoine brut (immobilier + terres 9 696 / 16 385 Md€), part des actions et OPC 13 % | | Insee Première 2081 (assiette « large ») ; **non compté dans la note sur la taxe**, qui chiffre seulement la taxe |
| R18 | Krach boursier : actions cotées −30 %, non cotées −15 % (la moitié du choc), OPC −24 % (80 % d'actions) | hypothèse | ⚠️ |
| R19 | Exil doublé par rapport au haut : (i) revenus du haut : on ajuste l'exposant de mobilité pour que la perte soit le double de celle du haut (5,6 → 11,2 Md€) ; (ii) fuite des transmissions 0,65 (= central + 2 × (haut − central) ; doubler la fuite elle-même donnerait 0,96) ; (iii) érosion du capital mobile de la taxe doublée (plafonnée à 100 %) | hypothèse | **la fuite des transmissions est le chiffre le plus lourd (−51 Md€ au central) et le moins étayé** ⚠️ (V7945) |
| R20 | Bloc 1 (salariés) = 90 % de la base de travail × taux plat : 517 Md€/an (17,3 % du PIB) | estimation | `modele.js` `recettesCourants` ; part de salariés dans les actifs ⚠️ |
| R21 | Échec du système d'information : l'année de recettes du bloc est perdue en année 1 ; 90 % sont recouvrés en années 2 et 3 (10 % définitivement perdus) | hypothèse | précédents ONP, Louvois, Sirhen (> 1,1 Md€ perdus) : ils ont coûté des dépenses, pas des recettes ; le recouvrement tardif est un ordre de grandeur ⚠️ (V7946) |
| R22 | Démographie : cotisants par retraité 1,8 (2025) → 1,41 (2060, interpolation COR du module capital commun) comme référence, → 1,1 en stress ; les pensions du palier 1 (392,5 Md€, 13,4 % du PIB du modèle) suivent le ratio pour garder le taux de remplacement | | COR 2026 : 1,8 en 2025, 1,3 en 2070 ; 1,1 en 2060 = demande de l'auteur ⚠️ (V7947) ; **le PIB n'est pas diminué** (moins de cotisants = moins de croissance : le choc est sous-estimé) |
| R23 | Garde-fous : contrôle intégral avec un an de retard (on corrige le manque constaté l'année précédente, sans dépasser la capacité) | hypothèse | |
| R24 | Clause « structurelle » : le manque dû au seul écart de production n'est pas compté | proposition | § 4 de `resultats.md` |
| R25 | Pas de multiplicateur budgétaire : couper le socle ou monter le taux pendant une récession aggrave l'écart de production (non modélisé) | limite | multiplicateurs de 0,9 à 1,7 en récession selon le FMI (Blanchard et Leigh, 2013) ⚠️ non lu |
| R26 | Les taux de marché ne dépendent pas du solde du système (aucune prime de risque endogène) | limite | **le risque le plus sous-estimé : un déficit de 5 à 8 % du PIB et une dette de 130 à 160 % ne gardent pas le taux à 3,45 %** |
| R27 | Chocs additifs, sans interaction (sauf les deux combinaisons) | limite | |
| R28 | Scénarios « bas » (favorable) / « central » / « haut » (défavorable) : ceux de `options_financement.js` ; les résultats sont donnés au central et au haut | | le « bas » est trop favorable pour un test de résistance |
| R31 | Chemin « V2 » (architecture finale v2 d'`optimum.js`) : solde de croisière = `Optimum.solde` (correctifs, capital de départ, prime d'activité, sortie « plat », exil défendable compris) ; leviers, transition et krachs lus sur l'objet `options_financement` équivalent (taxe brute) | +113,1 / +2,2 / −142,9 | chargé seulement si `optimum.js` l'est (liste longue du § 4) ; les 268 contrôles d'origine ne dépendent pas de lui |
| R32 | Droits perçus de la v2 = droits du palier 1 × part conservée par l'exemption « reçu à vie » − exception du conjoint ; les krachs et l'exil « doublé » portent sur eux | 59,6 Md€/an (central) | `optimum.js` H548, H533 |
| R33 | Trésorerie de la taxe plafonnée (v2) : la part différée et les non-cotés manquent pendant 12 ans (durée de la créance, H537) | 13,2 Md€/an (central) | `optimum.js` `taxe().tresorerieAn1` |
| R34 | Choc « exil au haut de la fourchette défendable » : au scénario considéré, fuite des transmissions 52 %, érosion du top 1 % 55 %, mobilité des très hauts revenus 0,40 (celle du haut, H16) ; permanent, dès l'année 1 ; nul au haut pour la v2 | −24,4 Md€/an (v2, central) | `sources/exil-patrimoines-preuves.md` §§ 6.2-6.3 ; remplace R19 (« exil doublé », 0,65) comme choc défavorable défendable, R19 gardé comme stress ⚠️ V8304 |

## 3. La semi-élasticité du nouveau système (R8)

**Fait sourcé** : le solde public français varie d'environ 0,63 point de PIB par point d'écart de production (Commission ; 0,5 en moyenne UE).

**Décomposition de Claude** (estimation) : en euros, ΔB = (r × η̄ + u) × écart × PIB, avec r = part des prélèvements dans le PIB (1 254 / 2 935 = 42,7 %, Insee tableau 3.216), η̄ = élasticité moyenne des recettes au PIB, u = part des dépenses cycliques.
- **Droit actuel** : u ≈ 0,10 (assurance chômage 37,1 Md€ ≈ 1,26 % du PIB ; un point d'écart de production ≈ 0,4 point de chômage ≈ +5 % de bénéficiaires, soit 0,07 ; plus RSA et prime d'activité ≈ 0,03 ⚠️), d'où η̄ = (0,63 − 0,10) / 0,427 = 1,24.
- **Nouveau système** : (a) l'IR progressif (≈ 90 Md€, 7 % des prélèvements ⚠️) disparaît dans un taux plat : son élasticité passe d'environ 1,9 ⚠️ à 1 : η̄ = 1,24 − 0,07 × 0,9 = 1,18 ; (b) le socle est versé à tous, qu'ils travaillent ou non : il ne bouge pas avec le cycle (aucune dépense cyclique) ; seul le complément dégressif du chômage reste cyclique (11,1 Md€ contre 37,1 : 30 %) : u ≈ 0,03. D'où ε = 0,427 × 1,18 + 0,03 = **0,53** (bas 0,60 si l'élasticité de l'IR était conservée sur l'impôt continu ; haut 0,46 si η̄ = 1,0).
- **Lecture** : le socle universel est **moins contracyclique** que le système actuel pour le budget (−16 % : 73 Md€ contre 87 Md€ de dégradation la première année). Il n'est pas procyclique : il ne stabilise simplement pas. L'écart est faible devant les autres chocs.

## 4. Reproduction

```
cd modeles/systeme-ideal
J=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
L="modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../risques/stress.js"
$J $L ../risques/test_stress.js            # 268 contrôles (sans la v2)
L2="modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js ../risques/stress.js"
$J $L2 ../risques/test_stress.js           # 377 contrôles (avec la v2, R31-R34, la v3, H609, et la v4, H624 ; chemin « V4 » : architecture v4 d’optimum.js)
$J $L2 ../risques/rapport_stress.js > ../risques/resultats-brut.txt
```
(En zsh, écrire `${=L}` ou lancer sous bash pour que la liste soit découpée.)

## Sources (consultées le 03/11/2026)

- Mourre, Astarita, Princen, « Adjustment of the European Commission's budgetary semi-elasticities », *Economic Papers* 536, 2014 : https://ec.europa.eu/economy_finance/publications/economic_paper/2014/pdf/ecp536_en.pdf (existence et méthode lues par recherche web ; valeurs par pays non relues, ⚠️ V7943).
- Mourre, Poissonnier, Lausegger, « The Semi-Elasticities Underlying the Cyclically-Adjusted Budget Balance: An Update and Further Analysis », *Discussion Paper* 098, Commission, 2019 : https://ideas.repec.org/p/euf/dispap/098.html.
- Girouard, André, « Measuring cyclically-adjusted budget balances for OECD countries », OCDE, ECO/WKP(2005)434 (sensibilité d'environ 0,5 point de PIB par point d'écart) : https://www.oecd.org/economics/new-tax-and-expenditure-elasticity-estimates-for-eu-budget-surveillance_5jxrh8f24hf2-en (page de l'OCDE sur les élasticités de recettes et de dépenses, ouverte par recherche, non relue).
- Intereconomics, 2019, n° 4, « What drives the responsiveness of the budget balance to the business cycle in EU countries ? » : https://www.intereconomics.eu/contents/year/2019/number/4/article/what-drives-the-responsiveness-of-the-budget-balance-to-the-business-cycle-in-eu-countries.html (France 0,63 ; UE 0,5 ; Bulgarie 0,29 : lu dans l'extrait de la recherche web).
- Modules du dépôt : `modeles/systeme-ideal/` (`options_financement.js`, `palier1.js`, `taxe_patrimoine.js`, `modele.js`), `sources/plan-de-bascule.md`, `sources/calculs/cout_sortie_ue.py`, `modeles/capital-commun-retraite/` (COR 2026 : 1,8 cotisant par retraité en 2025, 1,3 en 2070 ; 14,1 % du PIB).

Synthèse des sources : les chiffres de dette, de taux et de pente de socle viennent du dépôt ; seule la semi-élasticité est externe, et c'est la seule donnée de ce module qui vient d'une source primaire de l'UE ou de l'OCDE, lue ici de seconde main.
