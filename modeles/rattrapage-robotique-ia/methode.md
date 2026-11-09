# Rattraper la Chine et les États-Unis en IA et en robotique : méthode

Tâche T12 · consultation des sources : 2026-10-25 · code : [`modele.js`](modele.js) · test : [`test_modele.js`](test_modele.js) (`jsc modele.js test_modele.js`) · résultats : [`resultats.md`](resultats.md)

Légende : **fait sourcé** (lien ou CSV) · **estimation** (calcul explicité) · **hypothèse** (de l'auteur ou de Claude) · ⚠️ non confirmé (registre V400-V427).

## 1. Question posée

Le chapitre 14 du plan (« Le capital commun ») propose des entreprises d'IA et de robotique **à capital public, gérées comme des entreprises privées**, et un **fonds souverain** à la norvégienne (« l'IA est le nouveau pétrole »). Le chapitre 5 prévoit que l'héritage d'entreprise soit taxé à 50 %, **payé en parts versées au fonds**. Le chapitre 14 bis objecte que l'IA devient une commodité et que le pouvoir se joue sur le matériel et l'énergie.

Questions :
1. Où en sont les investissements publics et privés en IA et en robotique (Chine, États-Unis, UE, France, Corée, Japon) ?
2. Combien la France devrait-elle investir, et sur quelle durée, selon trois ambitions : **rester spectateur**, **rattrapage ciblé**, **ambition de leadership** ?
3. Combien d'emplois directs, et combien d'ingénieurs et de techniciens ?
4. Le fonds alimenté par l'héritage payé en parts peut-il financer cela, et quelle part doit venir de l'emprunt ?
5. Quelles contraintes (aides d'État, énergie, compétences) ?

## 2. Périmètre

- **Inclus** : les dépenses publiques (ou du fonds) d'investissement en calcul, en participations, en usines de robots, en aides au déploiement de robots, en formation, en matériel (puces, projets européens) et en recherche ; l'investissement privé directement entraîné (co-financement) ; les emplois **directs** en régime ; le financement.
- **Exclus** : les emplois indirects et induits ; **les emplois supprimés par l'automatisation** (voir [`modeles/offre-de-travail/`](../offre-de-travail/) et le chapitre 12) ; les recettes fiscales futures ; la défense ; la valeur stratégique (souveraineté), non chiffrable ici.
- **Unité** : Md€ courants, sur une durée de 10 ans (2027-2036, paramétrable).

## 3. Formules

**Calcul (centres de données d'IA).** Une capacité `G` (GW) est construite linéairement sur `N` ans. Par GW (Epoch AI, modèle stylisé du 14/05/2026, [`calcul_centres_donnees.csv`](donnees/calcul_centres_donnees.csv)) :
- longue vie (bâtiment, terrain, raccordement, 14 ans) : 11,77 Md$ ;
- courte vie (serveurs et réseau, 5 ans) : 26,12 Md$, **rachetés à chaque fin de vie** tant que la période n'est pas finie.
- Coût public = capex total × part publique. Énergie = `G × 8,76 TWh × 0,71` (utilisation d'Epoch). Emplois d'exploitation = 0,25 par MW.

**Autres postes publics** (sur `N` ans) : participations `= champions × N` ; usines `= capacité (unités/an) × capex par unité de capacité × part publique` ; déploiement `= robots aidés/an × coût installé × taux d'aide × N` ; formation `= (ingénieurs en plus × coût + techniciens en plus × coût) × N` ; matériel et recherche `= montant annuel × N`.

**Emplois directs en régime** : participations `/ 300 k€ par emploi` ; recherche `/ 150 k€` ; usines `= capacité × utilisation × prix d'un robot / CA par emploi` ; calcul `= MW × 0,25`. Ingénieurs requis = emplois × part d'ingénieurs par poste (H19).

**Financement.** Chaque année, le fonds reçoit `P = actifs professionnels transmis × 50 % × (1 − fuite)` **en parts d'entreprises** (non liquides). Le cash disponible vient seulement des dividendes (`d × stock`) et de cessions progressives (`c × stock`). Le besoin public annuel (`total / N`) est couvert d'abord par ce cash, le reste par **emprunt** au taux `i`. On suit le stock de parts, la dette et les intérêts.

**Sensibilité du portefeuille** : valeur au bout de `N` ans des sommes réellement investies en capital (calcul, participations, usines), selon un rendement annuel de −10 %, 0 % ou +7 %.

## 4. Hypothèses numérotées

| # | Hypothèse | Valeur | Source / statut |
|---|---|---|---|
| H1 | Taux de change | 1 € = 1,13 $ | Hypothèse de Claude ⚠️ (ordre de grandeur 2025-2026) |
| H2 | PIB de la France | 2 920 Md€ | Ordre de grandeur Insee 2024 ⚠️ (non relu) |
| H3 | Coût d'un centre de données d'IA de 1 GW | 37,9 Md$ dont serveurs 21,2, bâtiment 11,4, réseau 4,9 ; opex 0,9 Md$/an | [Epoch AI, 05/2026](https://epoch.ai/data-insights/ai-datacenter-cost-breakdown) — modèle **stylisé** américain (électricité à 8,3 c$/kWh) |
| H4 | Durées de vie | serveurs et réseau 5 ans ; bâtiment 14 ans | Epoch AI |
| H5 | Utilisation | 71 % → 6,2 TWh/an par GW | Epoch AI |
| H6 | Emplois d'exploitation | 0,25 par MW (0,2-0,3) | Randstad via [Banque des Territoires](https://www.banquedesterritoires.fr/centres-de-donnees-un-ratio-coutemplois-qui-interroge) ⚠️ |
| H7 | Le calcul public s'autofinance en exploitation (location du calcul) | opex couvert par les recettes | Hypothèse de Claude ⚠️ : fausse si le calcul public ne trouve pas de clients (voir H15) |
| H8 | Spectateur | 0,7 Md€/an public : participations 0,2, matériel 0,2, recherche 0,3 ; pas de calcul public | Calé sur l'ordre de grandeur de France 2030 (IA 2,2 Md€ sur 5 ans ; robotique 0,8 Md€ sur ≈ 9 ans) — [`plans_nationaux.csv`](donnees/plans_nationaux.csv) |
| H9 | Ciblé : calcul | 1 GW à 50 % public | Hypothèse de Claude ; ordre de grandeur du Campus IA de Fouju (1,4 GW, MGX-Bpifrance-Mistral-Nvidia) |
| H10 | Ciblé : participations, recherche, matériel | 2, 1 et 1 Md€/an | Hypothèse de Claude (× 10 environ le rythme actuel ; ≈ la moitié de l'investissement privé français en IA de 2025, 4,4 Md$) |
| H11 | Ciblé : robots | usines de 20 000 robots/an (30 % public) ; 10 000 robots aidés/an à 20 % de 100 k€ installé | Hypothèse de Claude. 10 000/an ≈ doubler les installations françaises (4 474 en 2025, IFR) ; coût installé ≈ 3 fois le prix implicite d'un robot industriel (30 800 $) ⚠️ |
| H12 | Leadership | 5 GW à 50 % public ; participations 8 Md€/an ; usines de 200 000 robots/an (50 % public) ; 30 000 robots aidés/an à 30 % ; matériel 4 ; recherche 3 | Hypothèse de Claude : ≈ 12 % de l'investissement privé américain en IA de 2025 en argent public chaque année |
| H13 | Capex d'une usine de robots | 10 k€ par unité de capacité annuelle (test : 20 k€) | ⚠️ **Aucune source primaire** ; seul repère : 580 M$ levés par Unitree pour 75 000 unités/an (presse, ≈ 7 700 $/unité) |
| H14 | Formation | +15 000 ingénieurs et +20 000 techniciens/an (ciblé) ; +30 000 et +50 000 (leadership) ; coût complet 45 k€ par ingénieur, 24 k€ par technicien | Écart de 10 000 à 28 000 ingénieurs/an selon UIMM, Syntec, Institut Montaigne ([`competences_financement.csv`](donnees/competences_financement.csv)) ; coûts : hypothèse de Claude ⚠️ |
| H15 | Le portefeuille public peut perdre ou gagner | rendement de −10 % à +7 % par an | Hypothèse de Claude ; le FMI chiffre un risque de correction de l'IA ([recherche-ia-robotique.md §1.5](../../sources/recherche-ia-robotique.md)) |
| H16 | Actifs professionnels transmis par an | 20 / 40 / 60 Md€ | 20 = actifs transmis sous pacte Dutreil en 2024 ([Cour des comptes](https://www.ccomptes.fr/fr/publications/le-pacte-dutreil-un-dispositif-fiscal-en-forte-croissance-mieux-cibler)) ; 40 et 60 : hypothèses de Claude ⚠️ (13 à 20 % des 300 Md€ du flux total, CAE) |
| H17 | Liquidité des parts | dividendes 3 %/an ; cessions 3 %/an du stock | Hypothèses de Claude ⚠️ ; l'auteur exclut la vente forcée par les héritiers, pas les cessions par le fonds |
| H18 | Taux d'emprunt de l'État | 3,3 % | Hypothèse de Claude. Relu le 01/11/2026 (Eurostat `irt_lt_mcby_m`, France, V2709) : moyenne 2025 3,37 % (cohérent avec 3,3 %), mais 4,00 % en août et 4,44 % en septembre 2026 : **3,3 % est inférieur de 1,1 point au dernier point publié** ; tester 4,5 % en scénario haut |
| H19 | Emplois directs | 300 k€ de dépense par emploi dans les participations, 150 k€ en recherche ; usines : 250 k€ de CA par emploi, robot à 40 k€, utilisation 50 % ; parts d'ingénieurs 70 / 80 / 15 / 30 % | Hypothèses de Claude ⚠️ |
| H20 | Fuite de l'assiette des transmissions | 48 / 31 / 18 % | Modèle T5 ([`reactions-assiettes`](../reactions-assiettes/resultats.md)) |

## 5. Effets de comportement et de rebond

- **Effet d'aubaine des aides au déploiement** : une partie des robots aidés auraient été achetés sans aide. Pas d'élasticité solide trouvée pour la France ; l'évaluation de la Cour des comptes sur la stratégie IA (2023) note que 81 % des fonds passent par appels à projets, sans mesure d'additionnalité. Non modélisé : le coût par robot *additionnel* est donc sous-estimé.
- **Éviction** : de l'argent public dans des laboratoires peut remplacer de l'argent privé (Mistral lève déjà 3 Md€ en 2026 sans l'État en tête de table). L'éviction est plus faible pour le calcul (infrastructure lourde, rentabilité lente) et la formation.
- **Fuite des parts** : la perspective d'un héritage payé à 50 % en parts pousse à transmettre avant (donations), à délocaliser la holding ou à vendre l'entreprise avant le décès (T5 : 18 à 48 % de fuite, appliquée ici).
- **Rebond énergétique** : un calcul abondant et bon marché attire des usages ; la contrainte est l'électricité (§6).
- **Course mondiale** : les montants des concurrents bougent chaque année (+160 % d'investissement privé américain en 2025). Un plan figé sur 10 ans prend du retard s'il ne s'ajuste pas.

## 6. Contraintes

1. **Aides d'État (UE)** : les articles 107-108 TFUE interdisent les aides sélectives sauf exemption (RGEC) ou autorisation (PIIEC/IPCEI, encadrement RDI). Deux voies compatibles : (a) l'État **investisseur avisé** (« investisseur en économie de marché ») qui prend des participations aux conditions qu'accepterait un privé, ce qui correspond à la volonté de l'auteur de les gérer comme des entreprises privées ; (b) les projets européens communs (PIIEC, gigafactories d'IA, EuroHPC). Une aide sectorielle massive et non notifiée serait illégale. Comptabilité publique : une prise de participation à rendement attendu est une opération financière (pas de déficit, mais de la dette brute) ; une subvention, une dépense ⚠️ (règle Eurostat à confirmer, V426).
2. **Énergie** : 1 GW consomme ≈ 6,2 TWh/an. La France a exporté 92 TWh nets en 2025 (RTE) : 5 GW tiennent dans le surplus actuel (34 %), mais les 18 GW de demandes de raccordement recensées (≈ 112 TWh) le dépasseraient.
3. **Compétences** : 47 700 ingénieurs diplômés en 2023 ; écoles remplies à 73 % en 2025 ⚠️ ; baisse du niveau en mathématiques. Le goulot n'est pas le nombre de jeunes ingénieurs mais les **chercheurs et ingénieurs seniors de rang mondial**, que les laboratoires américains paient bien plus cher.
4. **Matériel** : les puces d'IA de pointe sont conçues aux États-Unis (Nvidia) et fabriquées à Taïwan ; l'Europe tient un maillon critique (ASML, lithographie), et ASML est actionnaire de Mistral. 50 % à 60 % du capex d'un centre d'IA part en serveurs importés : **l'essentiel de la valeur du calcul « souverain » est payé à des fournisseurs étrangers.**
5. **Demande** : une usine de robots sans clients reste vide (Agility : capacité de 10 000 robots/an, 1,8 M$ de CA en 2025 ; UBTech : 10 000/an visés, 921 vendus au S1 2026).

## 7. Scénarios

| | Spectateur | Rattrapage ciblé | Leadership |
|---|---|---|---|
| Calcul public | 0 (le privé étranger construit) | 1 GW, 50 % public | 5 GW, 50 % public |
| Participations | 0,2 Md€/an | 2 Md€/an | 8 Md€/an |
| Robots | rien de plus | usines de 20 000/an ; 10 000 robots aidés/an | usines de 200 000/an ; 30 000 aidés/an |
| Formation | rien de plus | +15 000 ingénieurs, +20 000 techniciens/an | +30 000, +50 000 |
| Matériel, recherche | 0,2 ; 0,3 Md€/an | 1 ; 1 Md€/an | 4 ; 3 Md€/an |

Le niveau **bas / central / haut** porte sur le financement (actifs transmis et fuite, H16 et H20).

## 8. Limites

- Coûts de calcul **américains** (électricité, foncier, taxes) ; le capex est dominé par des serveurs au prix mondial, donc l'erreur est limitée sur l'investissement mais forte sur l'opex.
- **Aucune source sur le coût d'une usine d'humanoïdes** : H13 est une hypothèse ; elle pèse peu dans le total (≤ 2 Md€ même en leadership), ce qui est en soi un résultat.
- Emplois : ratios grossiers (H19), emplois indirects et destructions non comptés.
- Le modèle ne dit **rien du succès** : il chiffre l'effort, pas la probabilité de devenir leader.
- Les montants des plans étrangers mélangent budgets votés, annonces, fonds mixtes et engagements privés (colonne `nature_montant`) : ne pas les additionner.

## 9. Ce qui manque

Montants **décaissés** de France 2030 pour l'IA et la robotique ; texte officiel du MIIT (2023) et du 15e plan chinois ; budget fédéral américain d'IA non militaire (supplément NITRD, non lu) ; effectifs officiels des entreprises françaises ; coût réel d'une usine de robots ; prix de l'électricité pour un centre de données en France ; règle Eurostat sur les injections de capital ; données sur la part des titres d'entreprise dans les successions (DGFiP).
