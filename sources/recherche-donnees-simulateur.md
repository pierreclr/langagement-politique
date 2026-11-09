# Données pour le simulateur « socle universel + prélèvement unique »

Consultation : 2026-10-25. Chapitres concernés : 9 (prélèvement unique), 11 (revenu universel), 12 (travail choisi), 13 (retraites).

Les données détaillées, ligne par ligne avec leur source primaire, sont dans `sources/donnees/simu_*.csv` (voir le README de ce dossier). Ce document donne les chiffres clés, les incohérences entre sources, les hypothèses nécessaires, et un **premier ordre de grandeur** du bilan budgétaire.

Légende : **fait sourcé** (lien) · **estimation** (calcul explicité ici) · ⚠️ non confirmé.

---

## 1. Chiffres clés (fait sourcé, France)

### Population ([`simu_1_population.csv`](donnees/simu_1_population.csv))
- **Population au 1er janvier 2026** : 69,08 M (provisoire, Mayotte comprise) — [Insee Première n°2087, fichier ip2087.xlsx](https://www.insee.fr/fr/statistiques/fichier/8719824/ip2087.xlsx).
- **Adultes (18 ans ou plus)** : 55,23 M. **Enfants (moins de 18 ans)** : 13,86 M. Ce sont des sommes faites sur la pyramide des âges Insee 2026.
- **Adultes par âge** : 18-24 ans 5,61 M ; 25-39 ans 12,42 M ; 40-59 ans 17,51 M ; 60-64 ans 4,35 M ; 65 ans ou plus 15,34 M.
- **Familles avec enfants mineurs (RP2023)** : 7,88 M au total, dont 3,58 M avec 1 enfant, 3,04 M avec 2, 0,96 M avec 3 et 0,31 M avec 4 ou plus. Parmi elles, 2,00 M de familles monoparentales.
- **Ménages (RP2022)** : 30,9 M.
- **Géographie (aires d'attraction, RP2023)** :
  - aire de Paris : 13,3 M ;
  - 13 autres aires de plus de 700 000 habitants : 13,8 M ;
  - aires de 200 000 à 700 000 habitants : 16,1 M ;
  - communes hors attraction des villes : 4,5 M.
- **Aides au logement par zone APL (CNAF, décembre 2025, CAF seulement)** : zone 1, 1,01 M de foyers ; zone 2 + DOM, 2,84 M ; zone 3, 1,84 M. ⚠️ La population totale par zone APL n'a pas été trouvée.

### Revenus primaires, 2024 ([`simu_2_revenus_primaires.csv`](donnees/simu_2_revenus_primaires.csv))
Source : Insee, comptes nationaux base 2020, publication du 29/05/2026 ([page](https://www.insee.fr/fr/statistiques/8988861)). Les chiffres sont en Md€ 2024.

**Agrégats**
- **PIB** : 2 935.
- **Rémunération des salariés reçue par les ménages** : 1 539. Elle comprend les salaires bruts (1 137), les cotisations employeurs effectives (329) et les cotisations imputées (72), ces dernières étant fictives.

**Ménages**
- **Revenu mixte des indépendants** : 121,9 net (137,5 brut).
- **Revenus de la propriété** :
  - intérêts reçus : 71,7 (intérêts versés : 62,9) ;
  - dividendes : 74,9 ;
  - revenus de l'assurance-vie : 67,5.
- **Loyers** :
  - loyers réels déclarés au fisc (DGFiP, 2024) : 35,0 net au régime réel et 8,5 brut en micro-foncier ;
  - loyers imputés aux propriétaires occupants : 215 (SDES).
- **Plus-values déclarées au fisc** : 18,8 de plus-values mobilières, 4,7 avant abattement, 1,7 de plus-values immobilières après abattements. ⚠️ Elles sont absentes de la comptabilité nationale.

**Sociétés non financières (S11)**
- **Excédent brut d'exploitation (EBE)** : 500,5. **Excédent net** : 211,3.
- **Dividendes versés** : 304,4, en grande partie entre sociétés.
- **IS** : 65,1.
- **Épargne** : 311,0 brute, 21,8 nette.

**Distribution des revenus**
- **Revenu primaire en 2023** : 6 700 €/UC en moyenne pour les 10 % les plus modestes, contre 131 500 €/UC pour les 10 % les plus aisés ([Insee Analyses n°119](https://www.insee.fr/fr/statistiques/8973957)).
- **Revenu national avant impôt (WID 2023)** :
  - le top 10 % en reçoit 34,0 % ;
  - le top 1 %, 11,8 % ;
  - les 50 % du bas, 20,3 %.

### Transmissions ([`simu_3_transmissions.csv`](donnees/simu_3_transmissions.csv))
- **Flux successions + donations** : environ 300 Md€ par an « vers 2020 », soit plus de 15 % du PIB ([CAE, Note n°69, déc. 2021](https://www.cae-eco.fr/static/pdf/cae-note069s.pdf)).
  - Le fisc en voit 35 à 40 % de moins.
  - Les donations font près de la moitié du flux.
- **Droits de succession et donations (DMTG)** : 20,9 Md€ en 2024 (16,0 sur les successions et 4,9 sur les donations), d'après le PLF 2026, Voies et moyens tome I.
- **Pacte Dutreil** :
  - [Cour des comptes, 18/11/2025](https://www.ccomptes.fr/fr/publications/le-pacte-dutreil-un-dispositif-fiscal-en-forte-croissance-mieux-cibler) : coût de plus de 5,5 Md€ en 2024 et 20 Md€ d'actifs transmis ; 110 donataires concentrent 65 % de l'avantage.
  - IPP : 4,85 à 5,7 Md€.
  - Document budgétaire : 0,8 Md€.
- **Assurance-vie transmise au décès** : 44 Md€ en 2019, hors succession (CAE).

### Prestations ([`simu_4_prestations.csv`](donnees/simu_4_prestations.csv))
Montants 2024 en Md€, avec le nombre de bénéficiaires :

| Prestation | Md€ | Bénéficiaires | Source |
|---|---|---|---|
| Aides au logement (APL + ALF + ALS) | 15,99 | 5,8 M foyers | CNAF, DREES |
| RSA | 12,36 | 1,84 M foyers | DREES |
| Prime d'activité | 10,65 | 4,81 M foyers | CNAF |
| Prestations familiales légales | 35,2 (estimation) | — | CNAF : enfance-jeunesse 23,6 + PAJE 11,6 |
| dont allocations familiales | 13,77 | — | CNAF |
| Assurance chômage (allocations et aides) | 37,1 | ≈ 2,62 M indemnisés en moyenne (2025) | [Unédic, oct. 2026](https://s3.eusc-de-east-1.amazonaws.eu/unedic-eks-prod-cms/2026/10/21/situation-financiere-assurance-chomage-a-horizon-2028-octobre-2026_uid_6ad89d83e213b.pdf) |
| ASS | 1,71 | 0,27 M | DREES |
| Minimum vieillesse (ASPA, ASV) | 4,59 | 0,75 M | DREES |
| **AAH (non remplacée)** | 13,84 | 1,40 M | DREES |
| Retraites, tous régimes (2025) | 422,2 | 17,4 M retraités de droit direct | [COR, rapport annuel juin 2026](https://www.cor-retraites.fr/sites/default/files/2026-07/RA_2026_def_0.pdf) |

- **Pension moyenne de droit direct (fin 2022)** : 1 565 € brut et 1 457 € net.
- **Distribution des pensions (EIR 2020)** : 29,4 % des retraités ont une pension nette totale inférieure à 1 000 € ; 55,6 % sont sous 1 500 €.
- **Montants de référence en 2026** : RSA personne seule 651,69 €/mois depuis le 1/04/2026 ; ASPA personne seule 1 043,59 €/mois.
- **Protection sociale 2024 (DREES)** : 932,5 Md€ de prestations, dont :
  - vieillesse-survie 426,7 ;
  - santé 338,9 ;
  - famille 65,8 ;
  - emploi 51,1 ;
  - pauvreté 34,0 ;
  - logement 16,1.

### Prélèvements obligatoires ([`simu_5_prelevements.csv`](donnees/simu_5_prelevements.csv))
Source : Insee, tableaux 3.216 et 3.217 ([page](https://www.insee.fr/fr/statistiques/8988845)). Le total est de **1 254,0 Md€ en 2024 (42,7 % du PIB)** et de 1 305,1 Md€ en 2025 (43,6 %). Détail 2024 :

- **TVA** : 207,8.
- **Revenus et salaires** :
  - cotisations effectives : 432,4 ;
  - CSG : 153,1 ;
  - IR : 96,0 ;
  - CRDS : 9,1 ;
  - prélèvement de solidarité et autres contributions : 14,6.
- **Bénéfices des sociétés** : IS 68,0.
- **Patrimoine et stock** :
  - taxe foncière : 42,9 ;
  - DMTG : 20,8 ;
  - DMTO : 14,7 ;
  - IFI : 2,7.
- **Accises** : TICPE 30,2 ; tabacs 13,7 ; électricité 4,8 ; alcools 4,7.
- **Impôts de production** : taxe sur les salaires 17,3 ; versement mobilité 12,2 ; CFE 7,7 ; C3S 5,2 ; CVAE 3,9.
- **À part** :
  - dépenses fiscales : 89,4 Md€ (PLF 2026) ;
  - allègements généraux de cotisations : 64,9 Md€ (régimes de base, PLFSS 2026) ;
  - coût de collecte DGFiP + douanes : 0,55 € pour 100 € collectés (PAP 2026, programme 156).

### Dépenses publiques ([`simu_6_depenses_publiques.csv`](donnees/simu_6_depenses_publiques.csv))
- **Dépense totale** : 1 672,6 Md€ en 2024 (57,0 % du PIB) et 1 714,1 Md€ en 2025 (57,3 %).
- **Déficit** : −169,1 Md€ en 2024 (−5,8 %) et −151,6 Md€ en 2025 (−5,1 %).
- **Dette** : 3 460,5 Md€ fin 2025 (115,7 %).
- **Intérêts** : 60,1 Md€ en 2024 et 65,7 Md€ en 2025.
- **Dépenses par fonction (COFOG 2024)** :
  - protection sociale 693,0, dont vieillesse 392,0 ;
  - santé 261,2 ;
  - services généraux 181,1 ;
  - affaires économiques 166,1 ;
  - enseignement 148,6 ;
  - défense 54,2 ;
  - sécurité 52,1.

### Taux effectifs des plus riches ([`simu_7_taux_effectifs_riches.csv`](donnees/simu_7_taux_effectifs_riches.csv))
Source : [IPP, note n°92, juin 2023](https://www.ipp.eu/wp-content/uploads/2025/05/92_Note_IPP_Billionaires-version-actualisee.pdf), Bach, Bozio, Guillouzouic, Malgouyres, sur données 2016.
- **Taux global en % du revenu économique**, IS des sociétés contrôlées compris : 46 % au seuil du top 0,1 %, 26 % pour les 75 foyers les plus riches (0,0002 %).
- **Impôts personnels seuls (sans IS)** : environ 35 % à l'entrée du top 1 %, 2 % pour le top 0,001 %.
- **Barème appliqué à tout le revenu économique**, bénéfices non distribués des holdings compris : le taux des 75 foyers passerait de 26 % à 59 %.
- **Document de travail de 2025** : 45 % et 25 %. Les bénéfices non distribués font 96 % du revenu des 75 foyers.

### Outils ([`simu_8_outils.csv`](donnees/simu_8_outils.csv))
- **OpenFisca-France** : licence AGPL-3.0, active (v176.1.3 du 23/10/2026). Elle couvre l'IR, la CSG, les cotisations, le RSA, la prime d'activité, les APL, les AF et l'ASPA, avec 756 tests YAML.
- **API web OpenFisca** : ouverte en CORS, donc appelable depuis un navigateur.
- **LexImpact** : licence AGPL. Les barèmes sont exportés en JSON et **84 cas types prêts à l'emploi** sont disponibles (`openfisca-france/tests/leximpact/2024`).
- **Autres outils** :
  - EDIFIS (DREES, cas types, GPL) ;
  - Barèmes IPP (Licence Ouverte) ;
  - Ines (CeCILL, mais il exige l'enquête ERFS, à accès restreint) ;
  - TAXIPP (données accessibles seulement par le CASD).
- **Recommandation** : un petit moteur JS côté navigateur, alimenté par les agrégats ci-dessus, et validé sur les cas types LexImpact.

---

## 2. Incohérences entre sources

1. **Dividendes** : 74,9 Md€ reçus par les ménages en comptabilité nationale (2024), contre 50,1 Md€ déclarés au fisc. L'écart vient du PEA, des holdings et du champ couvert. ⚠️ Les valeurs 2025 des ménages (dividendes 64,3, intérêts 55,0) baissent fortement : c'est à vérifier avant usage.
2. **Loyers** : les loyers réels payés par les locataires valent 95 Md€ (SDES, HLM et bailleurs personnes morales compris). Les revenus fonciers déclarés par les particuliers valent environ 43 Md€. La comptabilité nationale ne sépare pas loyers imputés et loyers réels dans l'EBE des ménages.
3. **Plus-values** : elles sont absentes de la comptabilité nationale. Les données fiscales sont nettes d'abattements, donc très sous-estimées pour l'immobilier.
4. **Flux de transmissions** : environ 15 % du PIB selon le CAE (2021), contre environ 10 % selon France Stratégie (2018). L'estimation date d'environ 2020 et n'a pas été actualisée.
5. **Coût du Dutreil** : 0,8 Md€ selon le budget, contre 4,9 à 5,7 Md€ selon l'IPP et la Cour des comptes. La dépense fiscale officielle sous-estime donc le coût d'un facteur 6 à 7.
6. **IR et IS** : la comptabilité nationale et le budget de l'État ne donnent pas les mêmes montants (IR 96,0 contre 88,0 ; IS 68,0 contre 57,4). La différence vient des droits constatés, des crédits d'impôt et des transferts. Le simulateur utilise la comptabilité nationale.
7. **Cotisations** : la ventilation employeurs / salariés / non-salariés vaut 501 Md€ tous régimes, contre 432,4 Md€ de cotisations effectives reçues par les APU.
8. **Millésimes mélangés** : population 2026, revenus et PO 2024, retraites 2025, distribution des pensions 2020, transmissions vers 2020, IPP 2016. Le bilan ci-dessous est donc un **ordre de grandeur « vers 2024 »**, pas un compte d'une année donnée.
9. **Champs géographiques** : France avec Mayotte pour la démographie, hors Mayotte pour le recensement des familles, CAF sans la MSA pour plusieurs séries CNAF.

---

## 3. Premier ordre de grandeur (ESTIMATION, statique)

**Méthode.** C'est un calcul comptable simple, sans réaction des comportements, sur les agrégats 2024. On compare le nouveau système à l'actuel :

> Δ solde public = (recettes du prélèvement unique − prélèvements supprimés) − (coût du socle − dépenses supprimées)

Toutes les autres recettes (TVA, accises, DMTO…) et dépenses (santé, AAH, éducation, dette…) restent inchangées.

### 3.1 Coût brut du revenu universel
| Poste | Calcul | Md€/an |
|---|---|---|
| Socle adultes | 55,226 M × 1 000 € × 12 | **662,7** |
| Majoration enfants (hypothèse : 200 €/mois, à curseur) | 13,855 M × 200 € × 12 | 33,3 |
| Modulation géographique | supposée neutre (bonus en zone chère compensé ailleurs) | 0 |
| **Total** | | **≈ 696** |

Cela recoupe l'ordre de grandeur du plan (≈ 650 Md€ pour les adultes seuls).

### 3.2 Dépenses remplacées
| Poste | Md€ (2024) |
|---|---|
| Aides au logement | 16,0 |
| RSA | 12,4 |
| Prime d'activité | 10,7 |
| Prestations familiales (estimation) | 35,2 |
| Assurance chômage | 37,1 |
| ASS | 1,7 |
| Minimum vieillesse | 4,6 |
| **Sous-total hors retraites** | **117,6** |
| Retraites : part couverte par le socle (estimation ⚠️) | **≈ 184** |
| **Total** | **≈ 302** |

**Calcul de la part des retraites.** Hypothèse : le complément de carrière vaut la pension actuelle moins 1 000 €, avec un plancher à 0. L'économie est donc de min(pension, 1 000 €) par retraité.
- 70,6 % des 17,4 M retraités touchent au moins 1 000 € (EIR 2020) : 12,28 M × 12 000 € = 147,4 Md€.
- 29,4 % touchent moins de 1 000 €. ⚠️ Leur pension moyenne est supposée à 600 €/mois, une valeur non sourcée : 5,12 M × 7 200 € = 36,8 Md€.
- Plafond théorique, si tous les retraités dépassaient 1 000 € : 17,4 M × 12 000 € = 209 Md€.

**Coût net du socle** ≈ 696 − 302 = **≈ 394 Md€**.

### 3.3 Prélèvements supprimés (2024, Insee)
- **Sur les revenus et les salaires** : 705,2 Md€.
  - cotisations effectives : 432,4 ;
  - CSG : 153,1 ;
  - IR : 96,0 ;
  - prélèvement de solidarité et autres contributions : 14,6 ;
  - CRDS : 9,1.
- **Sur les sociétés et le stock** : 134,4 Md€. Il s'agit de l'IS (68,0), de la taxe foncière (42,9), des DMTG (20,8) et de l'IFI (2,7).
- **Sous-total** : **839,6 Md€**.
- **Impôts de production supprimés aussi (hypothèse)** : la taxe sur les salaires, le versement mobilité, la CFE, la C3S et la CVAE ajoutent 46,3, soit **885,9 Md€** au total.
- **Prélèvements maintenus** : TVA, accises, DMTO et le reste, soit environ 370 Md€.

### 3.4 Assiette et recettes du prélèvement à 50 %
| Assiette (2024 sauf mention) | Md€ | Remarque |
|---|---|---|
| Salaires au coût employeur | 1 466,5 | salaires bruts 1 137,2 + cotisations employeurs effectives 329,3. Cotisations imputées exclues |
| Revenu mixte net des indépendants | 121,9 | net de la consommation de capital fixe |
| Loyers réels nets | 40,9 | 35,0 au régime réel + 8,5 × 70 % en micro-foncier. Données fiscales, sous-estimées |
| Intérêts reçus | 71,7 | sans déduire les intérêts d'emprunt des ménages (62,9) ⚠️ |
| Dividendes reçus | 74,9 | comptabilité nationale |
| Revenus de l'assurance-vie | 67,5 | ⚠️ revenus courus, pas forcément retirés : à traiter comme flux seulement au rachat |
| Plus-values réalisées | 25,6 | fisc : 18,8 + 4,7 + 0,4 + 1,7. Sous-estimé |
| Transmissions | 300 | CAE, vers 2020. ⚠️ Le plus incertain |
| **Assiette totale** | **≈ 2 169** | |
| **Recettes à 50 %** | **≈ 1 085** | |

Le socle, les compléments de retraite et l'AAH sont supposés non imposés.

### 3.5 Solde
| Scénario | Δ solde public (Md€/an) | % du PIB 2024 |
|---|---|---|
| **Central** : impôts de production supprimés, enfants à 200 € | 1 085 − 886 − 394 = **≈ −196** | ≈ −6,7 % |
| Impôts de production maintenus | ≈ −149 | ≈ −5,1 % |
| Pas de majoration enfants | ≈ −162 | ≈ −5,5 % |
| Sans taxation des transmissions | ≈ −346 | ≈ −11,8 % |
| Retraites conservées entièrement (droits acquis, aucune économie) | ≈ −380 | ≈ −12,9 % |

Ce déficit **s'ajoute** au déficit actuel (−169 Md€ en 2024).

**Taux d'équilibre** = (prélèvements supprimés + coût net du socle) / assiette :
- scénario central : (885,9 + 394,2) / 2 169 ≈ **59 %** ;
- sans les transmissions : 1 280 / 1 869 ≈ **68,5 %**.

Ces taux sont statiques : ils ne tiennent compte ni de la baisse de l'assiette (exil, optimisation, moindre travail), ni des hausses éventuelles (fin des niches, assiette élargie).

---

## 4. Les hypothèses qui pèsent le plus
1. **Transmissions (≈ 150 Md€ de recettes).**
   - Le flux de 300 Md€ date d'environ 2020 et comprend les donations et l'assurance-vie.
   - Le taxer à 50 %, c'est passer de 21 à 150 Md€ par an. Une part serait payée en parts d'entreprise, donc sans recette budgétaire immédiate.
   - Les réactions attendues (donations anticipées, expatriation) sont fortes : ~~le CAE cite 54 centimes perdus par l'optimisation et 20 par l'exil pour 1 € de recette mécanique~~ **Corrigé le 25/10 (T5)** : ces chiffres ne figurent pas dans la note n° 69 du CAE ; ils semblent venir d'un Focus du CAE sur un impôt sur la fortune en Scandinavie (non revérifié). Voir `modeles/reactions-assiettes/resultats.md` : perte centrale ≈ 31 % du flux de transmissions.
2. **Retraites (0 à 209 Md€).**
   - Tout dépend de la règle « socle + complément » et du respect des droits acquis.
   - La distribution utilisée date de 2020 et la pension moyenne sous 1 000 € est supposée (⚠️).
3. **L'assiette « salaires au coût employeur » (1 466 Md€, deux tiers de l'assiette).**
   - L'hypothèse est que le coût employeur ne bouge pas. Si les employeurs répercutent la fin des cotisations, ou si l'offre de travail baisse avec un socle de 1 000 €, chaque baisse de 1 % de cette assiette coûte environ 7 Md€.
   - Les expériences (Finlande, OpenResearch, Kenya) indiquent des effets modestes sur l'emploi, mais à petite échelle.

Autres paramètres à curseur :
- montant du socle : chaque 100 €/mois par adulte coûte **66 Md€** ;
- majoration par enfant : chaque 100 €/mois par enfant coûte **16,6 Md€** ;
- sort des impôts de production ;
- fin des bénéfices non distribués taxés : l'IS perdu, 68 Md€, est en partie compensé par la hausse future des dividendes, que le calcul ne modélise pas.

## 5. Limites
- **Calcul statique et comptable.** Il ne modélise ni gagnants et perdants, ni effets de second tour. Il ne prend pas non plus en compte la transition (double charge retraites, droits acquis du chômage), l'évasion des multinationales (Pilier 2, directive mères-filiales), ni le financement des communes.
- **Les cotisations supprimées financent aujourd'hui aussi** la santé et la part non remplacée des retraites. Le calcul en tient compte implicitement, puisque ces dépenses restent à financer par le solde.
- **Assiettes fiscales** (loyers, plus-values) : elles sont **sous-estimées**. Assiettes de la comptabilité nationale (intérêts, assurance-vie) : elles sont **surestimées comme flux réalisés**. Les deux erreurs ne se compensent pas forcément.
- **Résidence principale** : l'exonération après 5 ans n'est pas chiffrée, faute de données sur les plus-values immobilières brutes (⚠️).
- **Éligibilité** : le socle est supposé versé à tous les adultes résidents (55,2 M). La règle de résidence et le cas des étrangers ne sont pas tranchés.
- **Données manquantes** (⚠️, voir les CSV) :
  - population par zone APL ;
  - distribution récente des pensions ;
  - plus-values immobilières brutes ;
  - recettes DMTG 2025 exécutées ;
  - coût de recouvrement de l'Urssaf ;
  - ventilation COFOG 2025 ;
  - PLF 2027 (non consulté).
- **Étape suivante** : coder ce calcul dans `simulations/` avec les CSV en entrée, puis le valider sur les cas types LexImpact avant d'en tirer une conclusion dans le texte.
