---
titre: Modèle « Bâtisseurs et repas » : former les bâtisseurs (et les agriculteurs), repas à prix coûtant. Méthode
statut: brouillon sourcé ; hypothèses et ordres de grandeur, jamais des prédictions
date: 2026-11-09
consultation: 2026-11-09
---

# Bâtisseurs et repas : méthode

Écrit par Claude (IA d'Anthropic) à la demande de l'auteur (09/11/2026), pour chiffrer deux mesures des pages `outils/publication/direction/batisseurs.html` (« Le coût des formations payées n'est pas encore chiffré ») et `consommer.html` (« Manger sain, à prix coûtant »), d'après les positions de l'auteur du 09/11 (usines à repas, bâtir ensemble, former au plus vite). Code : `modele.js` (fonctions pures), `test_modele.js` (25 contrôles), `rapport.js` → `resultats.txt` (c'est lui qui fait foi). Sources : `donnees/sources.csv` (cotes A à D). Registre : `verifications.md`, V32300 à V32315. Légende : **[Lu]**, **[Relayé]**, **[Hypothèse]** 📐.

Lancer : `jsc modele.js test_modele.js` puis `jsc modele.js rapport.js > resultats.txt` (jsc : `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc` ; `node test_modele.js` marche aussi).

**Risque propre à cette tâche** : ces deux mesures sont des propositions de l'auteur et Claude est chargé de les rendre présentables. Deux pentes à surveiller : compter comme « recette » la valeur des travaux faits par les apprentis (ce n'est une économie que si ces travaux auraient été payés), et comparer un repas vendu 7 € à des repas subventionnés pour un public qui n'a pas les mêmes moyens.

## 1. Questions

1. **Bâtisseurs** : combien de passoires (F et G, puis E), combien de rénovations d'ampleur par an pour les traiter en 10, 20, 30 ans, combien de professionnels cela demande et combien en manque ; combien coûte une formation payée sur chantier-école ; combien coûte un programme qui forme N jeunes par an sur leur propre chantier (ou celui de la promotion). Agriculture : même logique, plus brève.
2. **Repas** : coût de revient d'un repas entrée-plat-dessert bio à emporter, prix sans marge, TVA réellement applicable, volume nécessaire pour amortir une cuisine, emplois d'insertion, coût public net, comparaison avec l'existant.

## 2. Hypothèses numérotées

| n° | Hypothèse | Favorable / central / défavorable | Source ou statut |
|---|---|---|---|
| H1 | Résidences principales 30,9 M ; E 17,8 %, F 7,9 %, G 4,8 % | — | SDES, 01/01/2025 [Lu, A] |
| H2 | Cible = **résidences principales** (3,9 M F+G ; 9,4 M E+F+G). Le parc entier compte 5,4 M de F+G (vacants et résidences secondaires compris), non visés ici | — | 📐 ; la foncière préempte à la vente, elle touche aussi des logements vacants |
| H3 | Rénovations par an = stock / horizon. On ignore : les sorties sans travaux (changement de coefficient, nouveau DPE), les démolitions, et les logements qui **deviennent** E ou F en vieillissant | — | 📐 ; le stock F+G a baissé de 327 000 en un an surtout par la convention (V10303) |
| H4 | Une rénovation d'ampleur coûte 41 500 € de travaux ; elle économise 17,1 MWh/an conventionnels | — | SDES, Anah 2024 [Lu, A] ; HT/TTC ⚠️ V32301 |
| H5 | **Années-ETP de travail par rénovation d'ampleur** | 0,28 / 0,35 / 0,45 | 📐 ⚠️ V32308 ; recoupement : 41 500 € ÷ 90 à 150 k€ de chiffre d'affaires par ETP du second œuvre ; et Métiers 2030 : +170 à +250 k ETP pour passer de ≈ 66 000 à ≈ 700 000 rénovations par an, soit ≈ 0,27 à 0,39 |
| H6 | ETP actuels dans la rénovation d'ampleur = rythme 2024 (91 900) × H5 ; les 227 000 personnes « de la rénovation énergétique » (Ademe, relayé) font surtout des gestes isolés | 26 k / 32 k / 41 k | 📐 |
| H7 | Durée de la formation payée (titre professionnel ou CAP adulte, sur chantier-école) | 12 / 18 / 24 mois | 📐 ; titres professionnels du bâtiment de 6 à 12 mois, CAP en 1 à 2 ans |
| H8 | Rémunération pendant la formation, coût employeur (≈ Smic) | 1 800 / 2 100 / 2 400 €/mois | 📐 ⚠️ V32313 ; décision de l'auteur : formation payée |
| H9 | Encadrement technique : un formateur pour 10 / 8 / 6 stagiaires, à 55 / 60 / 65 k€ chargés | — | 📐 ; ordre des chantiers d'insertion (encadrement inclus dans l'aide au poste ACI de 24 203 €) |
| H10 | Pédagogie hors chantier 3 / 4 / 6 k€ par an ; outillage, assurance, protections 1,5 / 2 / 3 k€ | — | 📐 |
| H11 | Frais de structure 10 / 15 / 20 % | — | 📐 |
| H12 | Production d'un apprenti, en part d'un professionnel | 0,5 / 0,4 / 0,25 | 📐 ; **pas une recette** : une économie seulement si ces travaux auraient été payés |
| H13 | Valeur de la main-d'œuvre d'un professionnel | 60 / 55 / 50 k€ par ETP-an | 📐 |
| H14 | Formés encore dans la rénovation un an après | 70 / 60 / 45 % | 📐 ⚠️ V32308 ; fuite connue des apprentis du BTP, non chiffrée ici |
| H15 | Départs annuels du métier ensuite | 5 / 8 / 12 % | 📐 |
| H16 | Économie réelle / économie conventionnelle | 0,7 / 0,5 / 0,3 | 📐 ; la littérature trouve des économies réelles nettement inférieures aux promesses (CAE, focus 2023, `sources/dpe-instrumente-et-fraude.md`) ⚠️ V32314 |
| H17 | Prix moyen 0,15 €/kWh TTC | — | `modeles/loyer-energie` H3 |
| H20 | Agriculture : formation adulte (BPREA) 9 / 12 / 12 mois, payée comme H8 | — | 📐 |
| H21-H23 | Pédagogie 5 / 7 / 9 k€ ; tutorat chez un paysan 3 / 4 / 6 k€ ; accompagnement 3 ans après installation 2 / 3 / 4 k€ par an | — | 📐 |
| H24 | Part des formés qui s'installent | 75 / 60 / 45 % | 📐 ; la terre (foncière agricole) n'est **pas** comptée ici |
| H25 | Écart à combler : ≈ 21 000 départs (2022) − 12 661 installations (2024) ≈ 8 300 par an | — | MSA [Lu, A] ; départs [Relayé, C] ⚠️ V32305 |
| H30 | Denrées d'un repas entrée-plat-dessert bio, portion adulte | 2,6 / 3,0 / 3,6 € HT | 📐 ; cantines : 2,78 € (AMF 2020, enfant, peu de bio), 2,14 € à 36 % de bio (Observatoire) ⚠️ V32310 |
| H31 | Repas par ETP de production et par jour, avec des salariés en insertion | 90 / 70 / 50 | 📐 ⚠️ V32311 |
| H32 | Coût d'un ETP en insertion | 23 / 25,2 / 27 k€ | 📐 (≈ Smic chargé) |
| H33 | Un encadrant technique pour 8 / 6 / 5 salariés en insertion ; un accompagnateur socio-professionnel pour 24 | — | 📐 |
| H34-H36 | Vente (comptoirs de retrait, commande en ligne publique) 0,5 / 0,8 / 1,2 € ; énergie 0,3 / 0,4 / 0,5 € ; contenant consigné et lavage 0,2 / 0,3 / 0,45 € par repas | — | 📐 ; pas de livraison (sinon +3 à +6 € par commande, non chiffré) |
| H37 | Investissement = 1,0 / 1,5 / 2,0 M€ + 1 000 / 1 200 / 1 500 € par repas/jour de capacité ; 25 / 20 / 15 ans à 2 / 3 / 4 % ; 3 / 4 / 5 ETP fixes (direction, qualité-diététique, gestion) | 3 000 repas/j : 4,0 / 5,1 / 6,5 M€ | Cholet 5,4 M€ pour 4 000 repas/j, Vauvert 5,8 M€ HT pour 2 700 [Relayé, C] |
| H38 | Taux de remplissage | 85 / 75 / 60 % ; 300 jours par an | 📐 ; **paramètre décisif** pour le prix |
| H39 | Salariés en insertion qui seraient sinon au RSA | 60 / 50 / 30 % ; RSA 646 €/mois | 📐 ⚠️ V32313 |
| H40 | TVA : **10 %** (CGI art. 279 n) pour un plat préparé en vue d'une consommation immédiate, à emporter ou à livrer ; 5,5 % (art. 278-0 bis A) seulement si le conditionnement permet de le conserver (et pas pour un repas complet avec couverts, servi chaud) | — | BOFiP, BOI-TVA-LIQ-30-10-10-20241009 [Relayé, A] ⚠️ V32309 |

## 3. Chaîne de calcul

**Bâtisseurs.** Stock (H1, H2) → rénovations par an (H3) → ETP nécessaires (H5) → manque = ETP nécessaires − ETP actuels (H6) → jeunes à former par an pour combler le manque en dix ans au plus, avec maintien (H14) et attrition (H15). Coût par formé = durée × (rémunération + encadrement + pédagogie + équipement) × (1 + structure). Programme de N formés par an : coût brut, valeur des travaux faits pendant la formation (H12, H13), coût net, professionnels en poste à 10 ans, économie d'énergie réelle par rénovation (H4, H16, H17).

**Agriculture.** Coût par formé (H20-H23) ÷ taux d'installation (H24) = coût par installé, avec et sans la DJA existante.

**Repas.** Coût HT = (denrées + personnel + vente + énergie + emballage + amortissement) × (1 + frais généraux). Prix TTC = (coût HT − aide au poste ACI par repas) × (1 + TVA). « Sans marge » veut dire que le prix couvre l'amortissement de la cuisine : l'investissement est remboursé par les clients, pas par l'impôt. Coût public net = aide au poste − RSA évité (− TVA collectée, présentée à part).

## 4. Ce que dit la recherche (état de la recherche)

**Établi.** Le rythme des rénovations profondes est très en dessous des objectifs (≈ 66 000 en 2022, 91 900 rénovations d'ampleur aidées en 2024, dont 5 % seulement au niveau « performant » complet ; SDES, CAE). Les économies réelles des rénovations sont inférieures aux économies conventionnelles (CAE 2023, relayé dans `sources/dpe-instrumente-et-fraude.md`). L'insertion par l'activité économique a des taux de sortie vers l'emploi modestes et très dépendants du public (⚠️ chiffres non relus ici).
**Débattu.** L'efficacité de l'auto-réhabilitation accompagnée (Compagnons Bâtisseurs) : beaucoup d'évaluations qualitatives, peu de mesures d'impact ; le rapport du CGEDD (2014, n° 009350-01) consacre une partie à son coût, non relue (⚠️ V32315). La part de la pénurie de main-d'œuvre qui vient du nombre de formés plutôt que des salaires et des conditions de travail.
**Ce qui manque.** Un coût moyen national d'un chantier d'auto-réhabilitation ; le taux de maintien des formés dans la rénovation ; un coût de revient public d'un repas bio à emporter (aucun exemple trouvé à cette échelle).

## 5. Limites

1. Les ETP par rénovation (H5) décident tout le tableau des besoins : à 0,45, il faut 1,3 fois plus de monde qu'à 0,35.
2. Le modèle suppose que les apprentis travaillent sur des chantiers utiles (le leur ou ceux de la foncière) ; si les chantiers manquent, la valeur des travaux tombe et le coût net double.
3. La demande de repas à 7 € TTC n'est pas mesurée : le remplissage (H38) est une hypothèse.
4. Aides d'État : une entreprise publique qui vend sans marge et reçoit l'aide au poste fait concurrence aux traiteurs ; il faut un mandat de service d'intérêt économique général (droit de l'UE) ou une comptabilité séparée.
