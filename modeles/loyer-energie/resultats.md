# Loyer « énergie comprise » : résultats

Modèle du 03/11/2026 · code : [`modele.js`](modele.js) · test : [`test_modele.js`](test_modele.js) (56 vérifications) · sortie brute : [`resultats-sortie.txt`](resultats-sortie.txt) · méthode : [`methode.md`](methode.md)

Légende : **fait sourcé** · **estimation** · **hypothèse** · ⚠️ non confirmé (voir `verifications.md`, V10200 à V10218). Des ordres de grandeur, pas des prédictions.

## Dix lignes

1. **Formule** : plafond du logement de classe X = plafond(A) − (consommation DPE en énergie finale × surface × prix du kWh) ÷ 12 ; le loyer réel est le plus bas du loyer de marché et de ce plafond. Sous le plafond, loyer + énergie conventionnelle = plafond(A) : le locataire paie la même chose quelle que soit la classe.
2. **Alerte sur l'exemple de l'auteur** : à Grenoble, 1 000 € pour 50 m² (20 €/m²) est trop permissif pour mordre. Avec les consommations de l'ADEME (G : 341 kWh/m²/an en énergie finale) et un prix moyen de 0,154 €/kWh, la déduction d'un G est de **218 €/mois**, pas 417 € (le chiffre de départ, 400 kWh à 0,25 €, mélange énergie primaire et prix élevé). Plafond(G) = 782 € contre un loyer de marché de 736 € : **le plafond ne mord sur aucune classe**. Le loyer d'annonce d'un T1-T2 grenoblois est de 15,7 €/m² (783 €/mois pour 50 m²), pas de 20 €/m².
3. **Calibrage proposé** : plafond(A) = le plus petit montant qui ne mord sur aucun logement de classe A à D, soit **17,75 €/m² à Grenoble (887 €/mois pour 50 m², 1,13 fois le loyer moyen)** ; ordre de grandeur national : 1,17 fois le loyer moyen de la commune. Ce plafond est serré : il se fixe commune par commune, à 1,10-1,20 fois le loyer moyen (à k = 1,2 il ne mord presque plus).
4. **Effets à Grenoble (scénario central)** : le plafond mord sur 24,5 % des logements (E, F, G), baisse de loyer de 19 € (E), 44 € (F), 67 € (G) par mois ; moyenne 7 €/mois sur l'ensemble, 29 €/mois sur les logements concernés. Scénarios bas / haut : 7,5 % et 58 % des logements concernés.
5. **Effets en France (ordre de grandeur, loyer médian des communes ⚠️)** : 31 % du parc locatif privé concerné, baisse de 29 € (E), 60 € (F), 125 € (G) par mois ; si personne ne rénovait, transfert locataires vers bailleurs de l'ordre de 1,6 Md€/an (17 €/mois × 7,97 millions de logements).
6. **Rénover devient rentable** : pour un saut vers D ou E, retour de 9 à 10 ans à Grenoble (G vers E : 9,5 ans, E vers D : 10,7 ans) avec 120 €/m² par saut et 25 % d'aides ⚠️ ; **rien ne se rembourse au-dessus de D** (D vers B : 32 ans) : la formule ne pousse pas à la sur-rénovation, ce qui est un défaut ou une qualité selon le but.
7. **Contre l'interdiction (pour 100 000 logements locatifs privés, France, central)** : la formule fait rénover 31 400 logements pour 141 M€ nets et ne retire personne (hypothèse) ; l'interdiction E-F-G en D fait rénover 26 700 logements pour 195 M€ et en retire 4 700. À l'échelle du parc (7,97 millions) : environ 11 Md€ contre 15,5 Md€, et 375 000 logements retirés contre 0 ⚠️. Mais dans le scénario haut (aides nulles, 180 €/m², horizon 8 ans), la formule ne fait plus rénover personne et 14 500 logements pour 100 000 sortent (Grenoble) : tout dépend du coût et des aides.
8. **Deux aberrations corrigées** : (a) isolation par l'intérieur : 2 m² perdus sur 50 m² (4 %) annulent le gain de classe sur le loyer (+1 €/mois au lieu de +32 €/mois) et font perdre environ 5 600 € de valeur ; il faut une **surface de référence figée** (surface d'avant travaux). (b) pompe à chaleur : avec le coefficient électrique de 1,9 (depuis le 01/01/2026), un G à gaz passe en E par une pompe à chaleur à 4 500 €, moins cher que l'isolation (6 000 € après aides) ; avec 2,3 elle restait F. La formule en euros seule renforce même ce biais (retour 3,4 ans contre 6,0). Remède : déduction = 50 % de la dépense estimée en euros + 50 % du besoin utile de chauffage et de froid valorisé à 0,15 €/kWh : avec surface figée, le bailleur **isole** (retour 6,0 ans contre 7,5 pour la PAC).
9. **Risques** : fiabilité du DPE (la Cour des comptes juge l'outil « encore immature » : anomalies dans 70 % des diagnostics contrôlés par la DGCCRF en 2023, 0,2 % des DPE contrôlés ⚠️) ; consommation réelle bien moindre que conventionnelle (CAE : écart six fois plus faible ⚠️) ; manipulation du DPE ; retrait de logements (San Francisco : −15 % d'offre pour un encadrement classique, transposition non démontrée) ; petits bailleurs sans trésorerie (prêt à taux zéro adossé au loyer futur à prévoir). Base recommandée pour la déduction : **3CL comme référence, contre-expertise mesurée sur contestation, bornée à 50-150 %** (section « DPE mesuré » de `methode.md`).
10. **Question ouverte** : la formule **remplace-t-elle l'interdiction de louer les passoires, ou s'y ajoute-t-elle ?** Recommandation : s'y substituer pour E, F (le prix suffit si le plafond est assez mordant et les aides assurées), mais **garder l'interdiction pour les G qui menacent la santé** (décence, risques manifestes) : cohérent avec la règle de l'auteur : le prix par défaut, l'interdiction quand le prix ne suffit pas. À trancher par l'auteur.

## 1. Un appartement de 50 m², Grenoble, scénario central

Loyer de marché de référence : 15,67 €/m² (T1-T2, carte des loyers 2025, charges comprises), soit 783 €/mois. DPE : moyenne par classe des appartements de la base ADEME.

| Classe | Part (DPE ADEME) | kWh EF/m²/an | Déduction €/mois | Plafond €/mois | Marché €/mois | Baisse €/mois | Meilleure rénovation : cible, coût net, gain/an, retour |
|---|---|---|---|---|---|---|---|
| A | 0,8 % | 50 | 32 | 855 | 815 | 0 | |
| B | 6,9 % | 80 | 51 | 836 | 807 | 0 | A, 4 500 €, 94 €, 48 ans |
| C | 34,3 % | 112 | 72 | 815 | 791 | 0 | B, 4 500 €, 188 €, 24 ans |
| D | 33,5 % | 162 | 104 | 784 | 784 | 0 | B, 9 000 €, 282 €, 32 ans |
| E | 17,0 % | 217 | 139 | 749 | 768 | 19 | D, 4 500 €, 420 €, 10,7 ans |
| F | 5,2 % | 280 | 179 | 708 | 752 | 44 | E, 4 500 €, 486 €, 9,2 ans |
| G | 2,3 % | 341 | 218 | 669 | 736 | 67 | E, 9 000 €, 952 €, 9,5 ans |

Plafond(A) = 887 €/mois (17,75 €/m²), k = 1,132. Réserve : les parts sont celles des DPE récents de la base (ventes et locations), pas celles du parc (⚠️ V10200). Les parts de G à Grenoble (2,3 %) sont inférieures à la moyenne nationale (5-6 %).

**Balayage du plafond (Grenoble)** : à 16,45 €/m² (k = 1,05) tout le parc est concerné, baisse moyenne de 61 €/mois ; à 17,74 €/m² (k arrondi à 1,132) 58 % (l'arrondi fait mordre la classe D à la marge ; au k exact, seuls E, F, G sont concernés : 24,5 %) ; à 18,8 €/m² (k = 1,2), 2,3 % ; à 20 €/m² (l'exemple de l'auteur), 0 %. Le plafond ne tolère donc pas de marge : **un plafond « haut et permissif » n'a pas d'effet** avec les chiffres actuels du DPE, ce qui oblige à choisir entre un plafond serré (donc un encadrement de fait) et un plafond lâche (donc inutile).

## 2. Trois scénarios, trois zones

| Zone | Scénario | Plafond A (€/m²) | Logements concernés | Baisse moyenne €/mois (tous / concernés) |
|---|---|---|---|---|
| Grenoble | bas (protège E) | 17,71 | 7,5 % | 1,8 / 24 |
| Grenoble | central (protège D) | 17,75 | 24,5 % | 7,1 / 29 |
| Grenoble | haut (protège C) | 17,62 | 58 % | 28,8 / 50 |
| Angers (ville moyenne, choisie par Claude) | central | 18,59 | 17,4 % | 6,5 / 37 |
| France (loyer médian des communes, parc locatif privé SDES) | bas | 14,17 | 13,8 % | 6,4 / 46 |
| France | central | 14,01 | 31,4 % | 17,1 / 55 |
| France | haut | 13,68 | 64,7 % | 50,1 / 78 |

Les scénarios combinent la classe protégée, le prix de l'énergie (×0,85 / 1 / ×1,25), le coût de rénovation, les aides et le comportement des bailleurs (voir `methode.md`). Les chiffres nationaux utilisent le loyer **médian non pondéré** des communes (11,97 €/m² pour 1-2 pièces), inférieur au loyer moyen pondéré : les euros nationaux sont des planchers ⚠️ V10206.

## 3. Comparaison avec l'interdiction (pour 100 000 logements locatifs privés)

| Zone | Scénario | Formule : rénovés | coût net | restants à loyer réduit | perte de loyer/an | retirés | Interdiction E-F-G vers D : rénovés | coût | retirés |
|---|---|---|---|---|---|---|---|---|---|
| Grenoble | bas | 7 482 | 25 M€ | 0 | 0 | 0 | 23 251 | 85 M€ | 1 224 |
| Grenoble | central | 24 475 | 120 M€ | 0 | 0 | 0 | 20 804 | 131 M€ | 3 671 |
| Grenoble | haut | 0 | 0 | 43 480 | 26 M€ | 14 493 | 18 356 | 231 M€ | 6 119 |
| France | bas | 13 800 | 36 M€ | 0 | 0 | 0 | 29 807 | 126 M€ | 1 569 |
| France | central | 31 376 | 141 M€ | 0 | 0 | 0 | 26 669 | 195 M€ | 4 706 |
| France | haut | 5 683 | 51 M€ | 44 226 | 35 M€ | 14 742 | 23 532 | 343 M€ | 7 844 |

Lecture : la formule déclenche des rénovations quand elles se remboursent en moins de l'horizon accepté par le bailleur, et laisse les autres au loyer réduit ; l'interdiction impose une rénovation (jusqu'en D) ou une sortie. Les parts de sortie (5/15/25 %) sont une **hypothèse unique pour les deux régimes** ⚠️ V10218 : la comparaison des retraits n'a pas de base empirique. Ce qui est robuste : (i) à coût de rénovation égal, la formule déclenche moins de travaux sur les logements où l'économie est faible et plus là où elle est forte ; (ii) elle n'oblige à rien, donc ne retire pas mécaniquement de logements, mais elle transfère de l'argent des bailleurs aux locataires (1,6 Md€/an en France si rien n'est rénové).

## 4. Deux cas types : G de 50 m² à Grenoble, isolation intérieure contre pompe à chaleur

Logement de départ (hypothèse de cas, non mesurée ⚠️ V10216) : chauffage gaz 340 kWh/m²/an, eau chaude gaz 60, électricité 30 ; EF = 430, EP = 457 (classe G), facture conventionnelle 242 €/mois, besoin utile 299 kWh/m²/an.
- **Option A, isolation par l'intérieur** (besoin de chauffage −45 %, 8 000 €, 6 000 € après 25 % d'aides, 2 m² perdus) : EP 304, classe E.
- **Option B, pompe à chaleur air/air réversible** (SCOP 3,5, 4 500 €, non éligible aux aides) : EP 287 (coefficient 1,9), classe E ; facture 132 €/mois contre 159 pour l'option A ; en 3CL avec 2,3, EP 335, classe F.

| Régime | Choix du bailleur | Option A (isolation) | Option B (PAC) |
|---|---|---|---|
| Aujourd'hui, coefficient 1,9 : objectif rester louable (≤ E en 2028) au moindre coût | **PAC** | loyer 737 €, gain 8 €/an | loyer 768 €, gain 376 €/an, retour 12 ans |
| Aujourd'hui, coefficient 2,3 (avant 2026) | **isolation** (la PAC reste F) | classe E | classe F |
| Formule en euros seulement | **PAC** | gain 569 €/an, retour 10,6 ans | gain 1 313 €/an, retour 3,4 ans |
| Formule en euros seulement, surface figée | **PAC** | retour 6,0 ans | retour 3,4 ans |
| Euros + besoin (50/50), surface réelle | **PAC** | retour 10,6 ans | retour 7,5 ans |
| **Euros + besoin (50/50), surface figée** | **isolation** | loyer 756 €, gain 992 €/an, **retour 6,0 ans** | loyer 723 €, gain 600 €/an, retour 7,5 ans |

Le basculement dépend du poids w du besoin dans la déduction : avec la surface figée, l'isolation l'emporte à partir de w = 0,4 ; avec la surface réelle, à partir de w = 0,7. **L'auteur a donc raison sur les deux points, et les chiffres le montrent** : sans correction, le bailleur pose la PAC (plus rentable aujourd'hui) et le loyer plafonné au m² ne rémunère pas l'épaisseur d'isolant ; la formule en euros pure aggrave le choix de la PAC. Limites : le besoin utile et les coûts sont des hypothèses de cas ; une PAC sur un logement non isolé fait grimper la puissance appelée en hiver et ne règle pas l'inconfort d'été (le besoin de froid est compté), ce qui n'apparaît pas dans un calcul annuel ⚠️.

Perte de valeur vénale d'une isolation intérieure de 2 m² à 2 800 €/m² : 5 600 € ⚠️ (prix hypothétique). La surface figée corrige le loyer, pas le prix de vente : pour la valeur, seule une règle de mesurage (surface hors épaisseur d'isolant ajoutée) ou une aide compense.

## 5. Consommation réelle contre consommation conventionnelle

La déduction est conventionnelle (3CL) : un locataire qui sous-chauffe économise moins que prévu. Selon l'étude du CAE (2024, 178 110 ménages) l'écart de consommation réelle entre A-B et G est environ six fois plus faible que l'écart théorique ⚠️ V10210. Pour G vers D à Grenoble, l'écart conventionnel (115 €/mois) correspondrait à environ 19 €/mois réalisés si le rapport de un sixième se vérifiait, 46 €/mois à 40 %. **La déduction est donc plus forte que l'économie réelle du locataire** : elle fait payer au bailleur un coût en partie fictif. Argument pour une base mesurée ; argument contre : voir `methode.md`, section 7.

## 6. Limites

Les parts par classe locales sont des flux de DPE ; les prix de l'énergie sont des comparateurs ; les coûts de rénovation, les primes de loyer par classe, les parts de sortie et le cas type sont des hypothèses ; le DPE conventionnel ne prédit pas la facture ; aucun effet d'équilibre général (hausse des loyers de tous, valeur des biens, report vers la vente). Rien ici ne prouve que le plafond « énergie comprise » marcherait : le modèle montre ce qu'il faudrait pour qu'il morde et ce que ça coûte à chacun.
