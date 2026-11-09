---
titre: Modèle « Réaction des assiettes » : méthode
tache: T5
statut: brouillon sourcé
consultation: 2026-10-25
---

# Réaction des assiettes : méthode

## 1. Question posée

Le simulateur calcule les recettes du prélèvement unique (≈ 50 % sur tous les flux de revenus nets, sans niches) **comme si personne ne réagissait** : 50 % de 2 169 Md€ d'assiette, soit ≈ 1 085 Md€ ([`sources/recherche-donnees-simulateur.md`](../../sources/recherche-donnees-simulateur.md) § 3.4). Ce modèle pose trois questions :

1. **Combien perd-on, assiette par assiette**, quand les contribuables optimisent (élasticité du revenu imposable), sous-déclarent (transmissions), gardent les bénéfices dans leurs sociétés (imposition à la distribution) ou partent (exil) ?
2. **Combien de contribuables sont susceptibles de partir**, et quels montants partent avec eux ?
3. **Que changerait une imposition selon la nationalité** (idée de l'auteur), et où s'arrête-t-elle (renonciation, conventions, application) ?

Les réponses sont des **hypothèses et des ordres de grandeur, pas des prédictions**. Les effets sont des effets de long terme (stock après une dizaine d'années), pas ceux de la première année.

## 2. Périmètre et données

Toutes les données sont dans `donnees/`. Chaque ligne a une `source_url` et un `statut` (mesure, estimation, non confirmé). Consultation : 25/10/2026.

| Fichier | Contenu | Collecte |
|---|---|---|
| `elasticite_revenu_imposable.csv` | Saez-Slemrod-Giertz (2012), Gruber-Saez, Kleven-Schultz (Danemark), Lehmann-Marical-Rioux (France), dividendes avant et après le PFU (France Stratégie 2021) | Texte intégral de SSG et de France Stratégie extrait du PDF ; résumés éditeur (IDEAS/RePEc) pour le reste |
| `mobilite_hauts_revenus.csv` | Footballeurs, inventeurs, régime danois des étrangers, régions espagnoles, Forbes 400 et droits de succession, impôt sur la fortune scandinave, CAE Focus 118 (exil fiscal en France) | Pages éditeur, NBER, IDEAS ; CAE : texte et étiquettes de graphiques extraits du PDF |
| `isf_exil_france.csv` | Départs et retours de redevables ISF/IFI, exit tax, renonciations américaines | France Stratégie 2021 (extraction partielle ⚠️), Sénat, Federal Register (repris de `sources/recherche-inventaire-impots.md` § 8) |
| `transmissions_reactions.csv` | CAE Note 69 (flux, écart de déclaration, contrainte migratoire, concentration), Goupille-Lebret & Infante (2018) | Texte du PDF du CAE extrait |
| `distribution_estonie_multinationales.csv` | Réforme estonienne de 2000 (Masso et al. 2013), IDE, transferts de bénéfices (Tørsløv-Wier-Zucman, Heckemeyer-Overesch) | Résumés éditeur |
| `nationalite_conventions.csv` | Imposition américaine des citoyens, FATCA, Monaco, Andorre, objection des binationaux, points de droit à vérifier | Repris de l'inventaire des impôts § 8 (sources primaires) |
| `parametres_assiettes.csv` | Tous les paramètres du modèle, par assiette et par scénario | Miroir exact de `modele.js` (le test vérifie l'égalité) |

**Limite de collecte à signaler.** Le budget de recherche web de la session était épuisé au début de la tâche. Les sources ont été lues en accédant directement à des adresses connues (pages d'éditeurs, NBER, CAE, France Stratégie), sans moteur de recherche. Trois études demandées n'ont donc **pas** pu être lues : Cabannes-Houdré-Landais (ETI en France), Muñoz (mobilité des hauts revenus européens) et Bach et al. 2021 (élasticité des dividendes, IPP). Aucune valeur n'en est tirée (⚠️, voir `verifications.md`).

## 3. Formules

Pour chaque assiette *a* de base statique *B* (Md€ 2024), avec le nouveau taux *t₁* (50 % par défaut) :

1. **Écart de déclaration** (transmissions seulement) : base déclarée = *B* × (1 − *g*).
2. On sépare la base déclarée entre le **groupe mobile** (part *p*, le top 1 %) et le **reste**.
3. **Optimisation (marge intensive)** : chaque partie devient base × ((1 − *t₁*) / (1 − *t₀*))^*e*, avec *t₀* le taux marginal actuel de la partie et *e* l'élasticité au taux net (forme iso-élastique standard de la littérature sur l'ETI).
4. **Exil (marge extensive)** : le groupe mobile varie de *m* = φ × (*r*^η_étr − 1) + (1 − φ) × (*r*^(η(1−k)) − 1), où *r* est le rapport des taux nets moyens du groupe (après/avant), φ la part des étrangers, η et η_étr les élasticités de mobilité, *k* l'efficacité de l'imposition selon la nationalité. La perte d'assiette vaut base du haut × *μ* × (−*m*), *μ* étant la part de l'impôt que la France perd quand la personne part.
   - Groupe A (revenus) : *r* calculé sur les revenus du haut, toutes assiettes de revenus confondues (une personne décide de partir sur sa charge totale).
   - Groupe B (patrimoines) : *r* calculé sur les transmissions.
   - Les familles qui partent à cause des transmissions emportent aussi leurs revenus : les assiettes de revenus subissent *m*_A + *h* × *m*_B (chevauchement *h*).
5. **Récupération différée** (dividendes, plus-values) : une part *ρ* de l'assiette « retenue » revient plus tard (plus-value réalisée, transmission) ; elle est remise dans la recette.
6. **Entreprises des partants** : baisse de la masse salariale = salaires × ε_E × Δ, où Δ est la hausse de l'« impôt-fortune équivalent » d'un droit de transmission payé une fois après *T* = 25 ans (1 − (1 − *t*)^(1/*T*)), et ε_E la baisse d'emploi par point d'impôt sur la fortune (Jakobsen et al.).

Recette = *t₁* × (base finale + part récupérée) ; perte = recette statique − recette. La perte se décompose exactement en écart de déclaration + optimisation + exil + entreprises (vérifié par le test).

## 4. Hypothèses numérotées

| # | Hypothèse | Valeur(s) | Source / statut |
|---|---|---|---|
| H1 | Bases statiques du simulateur (2024) | salaires 1 466,5 ; indépendants 121,9 ; loyers 40,9 ; intérêts 71,7 ; dividendes 74,9 ; assurance-vie 67,5 ; plus-values 25,6 ; transmissions 300 | `recherche-donnees-simulateur.md` § 3.4 (millésimes mélangés) |
| H2 | Réponses iso-élastiques au taux net, effets de long terme (≈ 10 ans) | — | Forme standard (Saez-Slemrod-Giertz 2012) ; hypothèse de Claude pour l'horizon |
| H3 | Groupe mobile = top 1 % (378 333 foyers en 2016 ; top 0,1 % : 37 800) ; part du top 1 % dans chaque assiette | salaires 7 %, indépendants 15 %, loyers 20 %, intérêts 15 %, dividendes 85 %, assurance-vie 20 %, plus-values 70 %, transmissions 25 % | Effectifs : simu_7 (IPP). Parts : **hypothèses de Claude ⚠️**, sauf dividendes (interpolation entre 62 % pour le top 0,1 % et 97 % pour 1,7 % des foyers, France Stratégie 2021) |
| H4 | Taux unique *t₁* = 50 % sur toutes les assiettes, sans abattement ni niche ; plus d'IS sur les bénéfices réinvestis | paramètre | Hypothèse de l'auteur (système modélisé) |
| H5 | Taux marginaux actuels du haut | salaires 61 % du coût employeur ; indépendants 55 % ; loyers 59 % ; intérêts, dividendes, plus-values 34 % (PFU 30 % + CEHR 4 %) ; assurance-vie 30 % ; transmissions 10 % (top) et 5 % (reste) | **Calculs de Claude ⚠️** à partir des barèmes (salaires : cotisations patronales déplafonnées ≈ 22 %, CSG-CRDS, IR 45 %, CEHR) ; transmissions : DMTG 20,9 Md€ / 300 Md€ ≈ 7 % en moyenne, Dutreil 5,6 % (IPP) |
| H5 bis | Charge totale actuelle sur un dividende du haut (pour la décision de partir) | 50,5 % (IS 25 % puis 34 %) | Calcul de Claude |
| H6 | Élasticité du revenu imposable du haut (salaires, indépendants) | 0,12 / 0,25 / 0,40 | Saez-Slemrod-Giertz : « best available estimates range from 0.12 to 0.40 ». La réaction du gros des salariés (offre de travail) est **laissée à T4** (curseur « masse salariale ») pour ne pas la compter deux fois |
| H7 | Loyers : immeubles imposés là où ils se trouvent (mobilité *μ* = 0), faible élasticité | e = 0,05 / 0,10 / 0,20 | Hypothèse de Claude ; règle de l'imposition à la source des revenus immobiliers dans les conventions ⚠️ à vérifier |
| H8 | Intérêts et assurance-vie : report vers des placements non taxés (résidence principale, bénéfices réinvestis, plus-values latentes) ; les livrets réglementés, aujourd'hui exonérés, passent à 50 % | e = 0,2 / 0,4 / 0,8 ; *t₀* du reste : 15 % (intérêts), 24,7 % (assurance-vie) | Hypothèse de Claude, cohérente avec « capital > travail » (Kleven-Schultz, résumé par SSG) |
| H9 | Dividendes : imposer la distribution à 50 % et la rétention à 0 % pousse à garder les bénéfices dans les sociétés | e = 0,5 / 1 / 2 | Hypothèse de Claude. Repères : élasticité implicite ≈ 3,7 lors du PFU 2017-2019 (calcul, borne haute de court terme ⚠️) ; Estonie : plus de liquidités et d'investissement après 2000 (Masso et al. 2013, sans chiffre de dividendes) |
| H10 | Une partie des bénéfices retenus et des plus-values bloquées revient plus tard (cession, transmission) | 50 % / 30 % / 10 % | Hypothèse de Claude ; dépend du bon fonctionnement de l'impôt sur les transmissions (« acheter, emprunter, mourir ») |
| H11 | Écart de déclaration des transmissions dans le nouveau système | 15 % / 25 % / 37,5 % | Aujourd'hui 35-40 % (CAE n°69). Hypothèse de Claude : un système sans niches et avec un vrai système d'information (préconisé par le CAE) réduit l'écart sans l'annuler |
| H12 | Réponses d'épargne et de donation aux droits de transmission | e = 0,05 / 0,10 / 0,20 | Goupille-Lebret & Infante (2018) : « small responses » ; valeurs : hypothèse de Claude |
| H13 | Élasticité de mobilité des nationaux du haut (stock) | 0,05 / 0,15 / 0,40 | CAE : « de l'ordre de 10 % » ; footballeurs nationaux 0,15 ; inventeurs nationaux 0,03 ; borne haute en deçà des 0,85 de la mobilité **intérieure** espagnole. Contrôle : Jakobsen et al. (−2 % de contribuables par point d'impôt sur la fortune) donne ≈ −4,6 % pour le choc modélisé (voir § 6), proche du scénario bas |
| H13 bis | Chevauchement : part des revenus du haut détenue par les familles qui partent à cause des transmissions | 0,3 / 0,5 / 0,7 | Hypothèse de Claude |
| H14 | Part des étrangers dans le groupe mobile, et leur élasticité | φ = 10 % ; η_étr = 0,5 / 1 / 1,5 | φ : **hypothèse sans donnée ⚠️**. η_étr : footballeurs 1, inventeurs 1, régime danois 1,5-2 |
| H15 | Effet des départs sur les entreprises | ε_E = 0 / 0,02 % / 0,05 % de masse salariale par point d'impôt-fortune équivalent ; *T* = 25 ans | Jakobsen et al. (emploi −0,02 % par point) ; valeur haute : hypothèse de Claude. CAE Focus 118 : l'entreprise d'un actionnaire qui part perd 15 à 34 % (lecture de graphiques ⚠️) |
| H16 | Imposition selon la nationalité : efficacité *k* = (1 − part qui renonce) × (part des destinations où une convention le permet) × (taux de recouvrement) | variantes k = 0 ; 0,05 ; 0,25 ; 0,6 | 0,05 ≈ exit tax française (2,4 % recouvré) ; 0,6 ≈ système américain avec conventions renégociées et échange d'informations type FATCA ; 0,25 : hypothèse de Claude. La nationalité ne joue que sur les sorties, pas sur les étrangers |
| H17 | Part de l'impôt perdue au départ (*μ*) | salaires et indépendants 1 ; loyers 0 ; intérêts et assurance-vie 0,8 ; dividendes 0,75 ; plus-values 0,9 ; transmissions 0,8 | Hypothèses de Claude : retenues à la source sur dividendes versés à l'étranger, immeubles situés en France ⚠️ |

## 5. Scénarios

| | Réaction faible (bas) | Centrale | Forte (haut) |
|---|---|---|---|
| ETI du haut (travail) | 0,12 | 0,25 | 0,40 |
| Élasticité capital (intérêts, assurance-vie) | 0,2 | 0,4 | 0,8 |
| Rétention des dividendes | 0,5 | 1 | 2 |
| Blocage des plus-values | 0,3 | 0,6 | 1 |
| Récupération différée | 50 % | 30 % | 10 % |
| Écart de déclaration (transmissions) | 15 % | 25 % | 37,5 % |
| Mobilité des nationaux / des étrangers | 0,05 / 0,5 | 0,15 / 1 | 0,40 / 1,5 |
| Chevauchement familles / revenus | 0,3 | 0,5 | 0,7 |
| Effet entreprises (par point) | 0 | 0,02 % | 0,05 % |

Le scénario « haut » n'est pas un pire cas : il cumule des valeurs hautes, mais des réponses plus fortes encore (évasion organisée, contournement par des sociétés étrangères) restent possibles. Le taux *t₁* et l'efficacité *k* se règlent à part.

## 6. Contrôles de cohérence

- **Sans réaction**, la recette du modèle est exactement la recette statique (≈ 1 085 Md€) : test automatique.
- **Décomposition** : écart de déclaration + optimisation + exil + entreprises = perte totale : test automatique.
- **Contrôle externe de l'exil (calcul de Claude)** : passer de 10 % à 50 % sur les transmissions équivaut, pour une transmission dans 25 ans, à +2,3 points d'impôt annuel sur la fortune. Avec −2 % de contribuables fortunés par point (Jakobsen et al.), on obtient ≈ −4,6 % du groupe, contre −5,2 % (bas), −12,0 % (central) et −24,7 % (haut) dans le modèle. Le scénario central est donc **plus pessimiste** que la meilleure preuve disponible sur les impôts sur la fortune ; il reflète le fait qu'un droit de 50 % sans niches est hors du champ observé.
- **Ordre de grandeur des départs** : 950 départs de redevables ISF par an en 2011-2016, pour 370 retours (France Stratégie 2021, ⚠️ extraction partielle). Le scénario central (≈ 45 500 foyers du top 1 % en dix ans, soit ≈ 4 500 par an) multiplierait par près de cinq le rythme observé sous l'ISF.

## 7. Effets non modélisés (et sens probable)

- **Offre de travail du gros des salariés** : traitée par T4 (curseur « masse salariale »).
- **Fin de l'IS et montant des dividendes** : sans IS, un même taux de distribution verserait davantage ; le simulateur garde 74,9 Md€ (dividendes après IS). Effet de sens contraire à H9, non chiffré.
- **Multinationales** (voir `resultats.md` § 5) : le simulateur abandonne déjà les 68 Md€ d'IS ; le risque porte sur les paiements sortants (dividendes, redevances, intérêts vers l'étranger) et sur l'impôt minimum mondial (Pilier 2). Non chiffré faute de données sur les distributions vers des actionnaires étrangers.
- **Consommation et TVA des partants**, revenus d'activité des étrangers attirés par un taux du haut plus bas, équilibre général.
- **Assurance-vie** : la base de 67,5 Md€ est un revenu couru, pas retiré ; le modèle ne corrige pas cette surestimation (déjà signalée dans le simulateur).
- **Résidence principale** : refuge non taxé (loyers imputés exclus) vers lequel se reporte une partie de l'épargne ; inclus implicitement dans H8.
- **Stock de Français déjà à l'étranger** : une imposition selon la nationalité les toucherait aussi ; recette non chiffrée (aucune donnée sur leurs revenus).
- **Transition** (bénéfices accumulés, plus-values latentes, Dutreil en cours) : tâche T16.

## 8. Ce qui manque

1. Une ETI française récente sur les hauts revenus (Cabannes-Houdré-Landais non lue) et l'élasticité des dividendes de l'IPP (Bach et al. 2021).
2. La part des étrangers parmi les 1 % les plus aisés en France (H14).
3. La répartition par centile des salaires au coût employeur, des intérêts, de l'assurance-vie et des transmissions (H3).
4. Des données sur l'Estonie et la Lettonie : évolution des dividendes versés après la réforme.
5. Le nombre et les revenus des Français à Monaco, et le rendement de la convention de 1963.
6. Le texte des règles GloBE (Pilier 2) sur les régimes d'imposition à la distribution.

## 9. Reproduire

`jsc modele.js test_modele.js`, à lancer depuis ce dossier (jsc = JavaScriptCore, fourni avec macOS ; chemin complet : `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc`). Le test vérifie les fonctions, l'égalité entre `parametres_assiettes.csv` et le code, puis imprime tous les chiffres de `resultats.md`. Pour contester une hypothèse : modifier la ligne du CSV **et** les `DEFAUTS` de `modele.js`, relancer le test.
