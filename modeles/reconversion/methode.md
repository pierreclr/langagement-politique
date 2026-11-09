---
titre: Modèle « Reconversion » : que deviennent les personnes dont le métier disparaît ? Méthode
statut: brouillon sourcé ; hypothèses et ordres de grandeur, jamais des prédictions
date: 2026-11-03
consultation: 2026-11-03
---

# Reconversion : méthode

Écrit par Claude (IA d'Anthropic) à la demande de l'auteur (03/11/2026). **Risque propre à cette tâche** : vouloir montrer que la simplification « ne coûte rien », alors que le coût humain du déplacement est l'un des faits les mieux établis de l'économie du travail. Code : `modele.js` (fonctions pures), `test_modele.js` (26 contrôles), `rapport.js` → `resultats.txt` (c'est lui qui fait foi). Sources : `donnees/sources.csv`. Registre : `verifications.md`, V9900 à V9915. Légende : **[Lu]**, **[Relayé]**, **[Hypothèse]** 📐.

Lancer : `jsc ../industrie-complexite/modele.js modele.js test_modele.js` puis `jsc ../industrie-complexite/modele.js modele.js rapport.js > resultats.txt` (jsc : `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc`).

## 1. Question

Quand la paie, la comptabilité de base et l'impôt passent par un système public simple (T6, `modeles/industrie-complexite/`), des postes disparaissent. **Que deviennent les personnes ? Combien reviennent à l'emploi, à quelle vitesse, avec quelle perte de salaire ? Combien cela coûte-t-il en production, au budget (impôt perdu au taux plat de 41 %, complément dégressif, plancher de 877 €, formation) et aux personnes elles-mêmes ? À partir de quand le gain de conformité l'emporte-t-il ?**

## 2. Chaîne de calcul (par trimestre, 2029-2064)

1. **Postes à supprimer** : ceux de T6, par bloc (marché externe : cabinets, éditeurs, conseil ; travail interne des employeurs), lus dans le module T6 s'il est chargé (`postesT6`) : 107 k / 260 k / 479 k (tailles bas / central / haut de T6). Ce sont des **équivalents temps plein**, pas des personnes.
2. **Calendrier** : « rapide » = suppressions réparties de 2029 à 2032 (calendrier de la bascule, `sources/plan-de-bascule.md`) ; « lent » = 2029-2038 ; « très lent » = 2029-2043.
3. **Absorption** : chaque année, une partie des postes disparaît sans licenciement, parce que les départs (retraite, mobilité volontaire) ne sont pas remplacés et que les débutants ne sont plus recrutés dans ces métiers. Capacité = efficacité × (taux de retraite + taux de mobilité) × effectif du métier.
4. **Séparations** : le reste devient en partie des séparations (personnes déplacées) ; l'autre partie est redéployée en interne (conseil, audit, données).
5. **Survie dans le non-emploi** par classe d'âge, mélange de deux types : « mobile » (retour rapide) et « éloigné » (retour lent). Formation (avec effet d'enfermement), aide à la mobilité, sortie en retraite à 64 ans.
6. **Perte de salaire** au retour, décroissante avec le temps, plus forte après 50 ans.
7. **Sorties** : (a) production manquante ; (b) coût budgétaire ; (c) perte des personnes ; (d) gain net pour la société selon trois conventions.

## 3. Hypothèses numérotées

| n° | Hypothèse | Favorable / central / défavorable | Source ou statut |
|---|---|---|---|
| H1 | Postes qui disparaissent = T6 (`emploisDisparait`), par bloc | 107 k / 260 k / 479 k (tailles T6 bas / central / haut) | T6, `resultats.md` § 3 |
| H2 | Effectif du métier servant de base à l'absorption : 1 424 000 (métiers de la comptabilité et de la gestion, 2019) ; départs en fin de carrière 2,59 %/an | — | Métiers 2030 via T6 (`D.metiersCompta2019`, `D.tauxDepartAnnuel`) |
| H3 | **Efficacité de l'absorption** : part des départs qui peuvent ne pas être remplacés là où le travail disparaît (géographie, taille des entreprises, compétences) | 0,7 / 0,5 / 0,3 | 📐 hypothèse ; **paramètre décisif** (§ 6) |
| H4 | Mobilité volontaire hors du métier, par an | 1,5 / 1 / 0,5 % | 📐 hypothèse prudente (V9914) |
| H5 | Part du non-absorbé qui devient séparation (le reste est redéployé dans l'entreprise) : interne / externe | 0,4 / 0,6 / 0,8 ; 0,6 / 0,75 / 0,9 | 📐 ; les employeurs réaffectent plus facilement qu'un cabinet dont c'est le produit |
| H6 | Retour à l'emploi par âge (20-29, 30-39, 40-49, 50-54, 55-59, 60-63) : part « éloignée » π et probabilité de retour en un an du type mobile r12 ; type éloigné : taux trimestriel hL | central π = 0,11 / 0,12 / 0,13 / 0,20 / 0,35 / 0,70 ; r12 = 0,65 / 0,62 / 0,62 / 0,53 / 0,40 / 0,22 ; hL = 0,06 / 0,035 / 0,02 | Calé sur : 43 % en emploi à 1 an et 58 % à 2 ans pour les licenciés économiques (Trésor-OCDE 2017) ; non-emploi ≈ 10 % à 5 ans en France (Bertheau et al. 2023) ; rapport des âges de France Travail (55+ ≈ 0,6 fois les 35-49 ans à 6 mois) |
| H7 | Structure par âge des déplacés = celle du métier : 16 / 25 / 26 / 13 / 13 / 7 % (33 % de 50 ans et plus) | — | ⚠️ V9913 : Portraits de la Dares refusés (CAPTCHA) ; repère : 30 % des employés de la comptabilité partent en fin de carrière entre 2019 et 2030 (Métiers 2030) |
| H8 | Salaire net moyen des déplacés : 2 100 €/mois ; coût du travail = 1,47 × net (2 410 / 1 639, `systeme-ideal` H214) | — | ⚠️ V9913 ; ordre de grandeur pour des employés et techniciens comptables |
| H9 | Perte de salaire au retour : L(y) = L∞ + (L0 − L∞) e^(−y/3), y = années depuis la séparation ; × 1,2 / 1,3 / 1,5 après 50 ans | L0 = 10 / 15 / 20 % ; L∞ = 4 / 7 / 10 % | Bertheau et al. : 5 à 10 % de perte de salaire à 5 ans ; Nafilyan (OCDE, 2016, résumé) : 15 à 20 % à la réembauche ; Schmieder et al. : −8 % puis −6 % |
| H10 | Retraite à 64 ans ; les non-employés qui l'atteignent sortent du modèle (plus de coût imputé) | — | Âge légal après la réforme de 2023 (suspension 2026-2027 non modélisée) |
| H11 | Formation : part formée 60 / 50 / 40 % ; coût 5 / 10 / 29 k€ (T6 H12) ; effet : taux de retour × (1 + 0,30 / 0,15 / 0,05) après 2 trimestres d'enfermement à 60 % du taux ; s'applique aux deux types | — | Card-Kluve-Weber 2018 (effets faibles à 1 an, plus forts à 2-3 ans) ; PIC (+9 points à 2 ans, +16 pour les seniors, surestimé selon les auteurs) |
| H12 | Revenu de remplacement de l'architecture v4 : socle de 350 € versé à tous (donc **pas un coût marginal** du déplacement) ; complément dégressif « deg2 » : 60 % puis 40 % puis 20 % de (net − socle) les mois 1-3, 4-6, 7-12, net plafonné à 3 000 € ; non imposé | — | `systeme-ideal` H92, H107 ; ⚠️ V9915 : maintien de deg2 dans la v4 à confirmer |
| H13 | Plancher de 877 € (allocation unique) : complément = 877 − 350 − deg2 si le ménage y a droit ; part des déplacés dont le ménage y a droit en entier | 0,30 / 0,45 / 0,60 | 📐 ; le plancher est familial, un conjoint qui travaille le réduit ou l'annule |
| H14 | Impôt perdu = 41 % du coût du travail perdu (non-emploi + perte de salaire) | — | Architecture v4 (`optimum.md`), impôt sur le coût du travail comme `systeme-ideal` H214 ; la v5 (40,7 %) change < 1 % |
| H15 | **Récupération** : part de l'impôt perdu retrouvée par l'impôt sur les économies des clients (profits, baisse de prix, revenus dépensés ailleurs) | 0,5 / 0,3 / 0 | 📐 ; brut (0) donné partout à côté |
| H16 | Production manquante = VA par emploi (77 488 €, NAF 69.20) × (non-employés + équivalent perte de salaire) : c'est l'écart à une réallocation complète, **pas une baisse du PIB par rapport à aujourd'hui** (§ 4) | — | T6 |
| H17 | Gain net pour la société = VA × [a × (postes supprimés − non-employés − perte de salaire) − i × postes supprimés] − coût du système public − formation − aides ; trois conventions (a, i) : v1 (1 ; 0) = T6 ; v2 (0,85 ; 0,25) = T6 v2 central ; prudente (0,7 ; 0,5) = T6 v2 bas | — | T6 `gainEconomie` et `PARAMS_OPPORTUNITE` |
| H18 | Politiques : formation ciblée des 50 ans et plus (90 % formés, effet 0,25, 12 k€) ; aide à la mobilité (30 % des déplacés, taux de retour +10 %, 1 500 €) | — | 📐 ; l'effet de l'aide à la mobilité n'est pas mesuré causalement en France (V9910) |
| H19 | Actualisation 2,5 % pour la production manquante | — | 📐 choix de Claude |
| H20 | Agents publics : non-remplacement des départs, donc **aucun licenciement** par construction (postes = min(cible, départs)) | 3,5 k / 33 k / 197 k postes sur 10 ans | `sources/economies-effectifs-publics-ia.md` |

**Combinaisons.** Deux dimensions : la **taille** du choc (T6 bas / central / haut) et le **marché du travail** (favorable / central / défavorable, H3 à H15). Les trois scénarios principaux sont la diagonale : favorable = (bas × favorable), central = (central × central), défavorable = (haut × défavorable). La grille complète 3 × 3 est dans `resultats.txt` § C.

## 4. Ce que mesure « la perte de PIB »

Les honoraires de comptabilité et le temps interne consacré à la complexité sont des **consommations intermédiaires** des entreprises : quand ils disparaissent, la valeur ajoutée du cabinet baisse et celle du client monte d'autant. Le PIB mesuré ne baisse donc pas mécaniquement ; il **monte** à mesure que les personnes libérées produisent autre chose. Ce que le modèle appelle **production manquante**, c'est ce qui manque par rapport à une réallocation instantanée : non-emploi et perte de salaire. Deux réserves : (1) à court terme, si les clients épargnent leur économie au lieu de la dépenser, la demande baisse (effet keynésien non modélisé) ; (2) les ménages qui payaient un conseiller fiscal (consommation finale) sont un petit poste (T6 : 0,5 à 2 Md€).

## 5. Ce que dit la recherche (état de la recherche)

**Établi.**
- **Le licenciement coûte cher et longtemps.** Aux États-Unis, la perte actualisée d'un homme licencié collectivement est de 1,4 an de revenu quand le chômage est bas et de 2,8 ans quand il dépasse 8 % (Davis et von Wachter 2011 [Lu]) ; 10 à 20 ans après, l'écart reste de 10 à 20 %. Jacobson, LaLonde et Sullivan (1993) trouvaient ≈ 25-30 % de perte cinq ans après [Relayé]. En Allemagne : ≈ −30 % la première année, −15 % dix ans après (Schmieder, von Wachter, Heining 2023 [Lu, version NBER]).
- **La France est au milieu de l'Europe.** Avec un protocole harmonisé, la perte de revenu cinq ans après est ≈ 10 % au Danemark et en Suède, ≈ 30 % en Italie, en Espagne et au Portugal ; la France est à **−12 %** (−20 % la première année pleine), avec ≈ **10 % de non-emploi** à cinq ans ; les salaires perdent 5 à 10 % et l'essentiel de l'écart entre pays vient du non-emploi (Bertheau et al. 2023 [Lu]). Seuls 43 % des licenciés économiques français ont un emploi après un an, contre près de 90 % en Finlande (Trésor-OCDE 2017 [Lu, chiffre relayé de l'OCDE]).
- **L'âge est le premier facteur.** Six mois après l'inscription, 47,5 % des 26-49 ans ont accédé à un emploi, contre 37,2 % des 50 ans et plus (France Travail 2026 [Lu]) ; 26 % pour les 55 ans et plus en 2019 [Lu].
- **La vitesse du choc décide.** Quand l'automatisation est progressive, l'ajustement passe par les entrants : en Allemagne, les robots n'ont pas fait perdre leur emploi aux salariés en place, la baisse de l'emploi industriel vient « uniquement » de moins de recrutements de jeunes (Dauth et al. 2021 [Lu, version de travail]). En Suède, les travailleurs des métiers en déclin perdent 2 à 5 % de revenu cumulé sur 28 ans, 8 à 11 % pour le tiers inférieur du métier (Edin et al. 2023 [Lu]). À l'inverse, un choc concentré et rapide laisse des traces durables sur les territoires (choc chinois : Autor, Dorn, Hanson 2013 [Lu], 2016-2021 [Relayé] ; robots aux États-Unis : −0,2 à −0,34 point d'emploi par robot pour 1 000 travailleurs, Acemoglu et Restrepo [Lu, version de travail]).

**Débattu.**
- **La formation** : effets faibles la première année, plus nets à deux ou trois ans (Card, Kluve, Weber 2018 : 0,04 puis 0,12 puis 0,19 écart-type [Lu]) ; le TAA américain fait perdre ≈ 10 000 $ pendant la formation puis gagner ≈ 50 000 $ cumulés en dix ans, gains qui se dissipent (Hyman 2022 [Lu]) ; en France, la formation qualifiante est associée à +9 points d'emploi à deux ans (+16 pour les seniors), probablement surestimés (PIC [Lu]). Le CPF ne retrace pas l'accès à l'emploi.
- **L'aide à la mobilité** : 60 % des bénéficiaires déclarent qu'ils n'auraient pas accepté ou auraient hésité sans l'aide, mais il n'y a pas de groupe témoin (Pôle emploi 2020 [Lu]).
- **Les transitions françaises** (sidérurgie, mines) ont été gérées surtout par des **mesures d'âge** (dispenses entre 50 et 55 ans en sidérurgie, congé charbonnier de fin de carrière à 80 % du salaire) [Relayé, chiffres non trouvés, V9908] : socialement amorties, très coûteuses, et elles ont sorti durablement des gens de l'emploi.

**Ce qui manque.** Aucune étude sur des comptables ou des gestionnaires de paie déplacés par une simplification ; pas de structure par âge publique accessible (Dares refusé) ; pas d'évaluation causale française de l'aide à la mobilité ; coûts humains non monétisés (santé : Sullivan et von Wachter 2009, surmortalité de 50 à 100 % la première année chez les hommes à forte ancienneté, `sources/recherche-persuasion-et-transition.md`).

## 6. Le paramètre décisif

L'absorption (H3 × H2 × H4) décide presque tout. Le métier compte ≈ 1,4 million de personnes et perd ≈ 37 000 retraités par an : si la moitié de ces départs peut ne pas être remplacée là où le travail disparaît, la capacité est ≈ 25 000 postes par an. Au rythme de la bascule (65 000 postes par an au central), il reste 40 000 postes par an à traiter par séparation ou redéploiement ; sur dix ans (26 000 par an), presque tout est absorbé. **C'est le résultat le plus robuste du modèle, et il dépend d'un paramètre non mesuré** (V9914).

## 7. Limites

1. Les postes T6 sont des équivalents : un quart du temps de quatre personnes n'est pas une personne licenciée ; H5 le traduit grossièrement.
2. Un seul salaire moyen (H8) ; les experts-comptables (≈ 22 000, relayé) et les cadres ne sont pas distingués.
3. Une partie du déclin aurait lieu **sans la réforme** (Métiers 2030 : −24 % d'employés de la comptabilité entre 2019 et 2030 ; Frey-Osborne) : le modèle attribue tout à la réforme, ce qui surestime son coût et son gain.
4. Les jeunes non recrutés (absorption) ne sont pas suivis : on suppose qu'ils trouvent ailleurs, comme chez Dauth et al.
5. Pas d'effet de demande, pas d'effet sur les salaires des autres métiers, pas de géographie.
6. La santé, la mortalité et le statut social perdus ne sont pas chiffrés.
7. Le coût du système public (T6 H12) est déduit du gain ; il ne doit pas l'être une seconde fois dans `systeme-ideal` (V9956).
