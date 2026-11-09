---
titre: Grand livre unique (T65), synthèse consolidée 2024
statut: généré le 2026-11-06 par `modeles/grand-livre/code/synthese.py --ecrire` (ne pas éditer à la main) ; vérifications V16500 à V16599
---

# Synthèse consolidée du grand livre, 2024

Écrit par Claude (IA d'Anthropic) pour l'auteur. Année 2024, Md€ courants, comptabilité nationale base 2020 (SEC 2010). Sources : Insee, comptes nationaux annuels, tableaux 3.201, 3.203, 3.204, 3.205, 3.212 et 3.215 (édition 2026), https://www.insee.fr/fr/statistiques/8988845, fichiers lus en local le 06/11/2026 ; cote A ; aucun conflit d'intérêts connu (statistique publique). Les lignes viennent des cinq chantiers : `etat.csv`, `odac.csv`, `apul.csv` (lignes `additif = oui`), `asso.csv`, `recettes.csv` ; leurs sources et cotes sont ligne par ligne. Le registre des corrections du bilan est dans `corrections-bilan.md`.

## 1. Dépenses par sous-secteur, avant consolidation

| Sous-secteur | Lignes | Somme des lignes | Total Insee | Écart (lignes − Insee) |
|---|---|---|---|---|
| État (S13111) | 856 | 600,701 | 600,702 | −0,0000 |
| ODAC (S13112) | 173 | 142,637 | 142,631 | 0,0063 |
| APUL (S1313) | 364 | 330,484 | 330,484 | 0,0000 |
| ASSO (S1314) | 291 | 777,288 | 777,288 | 0,0001 |
| **Somme** | 1684 | **1851,111** | **1851,104** | 0,0064 |

L'écart de l'ODAC (0,0063 Md€) est un arrondi des 166 lignes nommées, gardé tel quel. Dans `odac.csv`, les identifiants `GL-ODAC-098`, `GL-ODAC-099` sont employés deux fois (un opérateur du jaune et une ligne de fermeture) : défaut à corriger dans `code/odac.py` (V16501), sans effet sur les montants.

## 2. Consolidation : élimination des flux entre administrations publiques

L'Insee consolide chaque sous-secteur en interne, pas entre sous-secteurs (note du tableau 3.215). La différence entre la somme des quatre sous-secteurs et le total des APU est donc exactement l'ensemble des flux entre sous-secteurs.

| Élimination (Insee 2024) | Md€ | Comment elle est mesurée |
|---|---|---|
| Transferts courants entre APU (D73) | 145,891 | côté receveur (recettes D73 des quatre sous-secteurs ; l'APU consolidé a D73 = 0) ; côté payeur : 145,891, identique |
| Transferts en capital entre APU (D9) | 31,615 | côté receveur : recettes D9 hors D91 des sous-secteurs moins APU consolidé ; côté payeur, même calcul : 31,615 |
| Intérêts entre APU (D41) | 1,009 | côté receveur ; côté payeur : 1,009 |
| **Total éliminé** | **178,515** | = somme des sous-secteurs (1851,104) − APU (1672,589) |

### Rapprochement des flux marqués `flux_inter_apu` avec ces éliminations

| Sous-secteur payeur | D73 payé (Insee) | dont lignes marquées (payeur) | D9 payé, tous bénéficiaires (Insee) | dont lignes marquées D9 | Non rapproché ligne à ligne |
|---|---|---|---|---|---|
| État (S13111) | 107,508 | 102,046 | 41,839 | 6,136 | D73 : 5,462 |
| ODAC (S13112) | 12,941 | 0,000 | 14,782 | 0,000 | D73 : 12,941 |
| APUL (S1313) | 5,930 | 0,000 | 15,171 | 0,000 | D73 : 5,930 |
| ASSO (S1314) | 19,512 | 19,512 | 1,934 | 0,000 | D73 : 0,000 |
| **Total** | **145,891** | **121,558** | | **6,136** | D73 : **24,333** ; D9 entre APU : 31,615 − 6,136 = **25,479** ; D41 : **1,009** |

**Part de l'élimination rapprochée de lignes nommées : 127,694 sur 178,515 Md€ (71,5 %).** Ce qui ne se rapproche pas, listé (V16502) :

1. **État, D73 : 5,462 Md€** sans ligne marquée. C'est l'écart « interventions » du chantier État (`GL-ETAT-ECART-INTERV`, 20,282 au total) : les catégories budgétaires ne séparent pas les transferts aux APU des autres (régimes spéciaux, compensations d'exonérations).
2. **ODAC, D73 : 12,941 Md€** et **APUL vers l'État et l'ASSO, D73 : 5,930 Md€** : les lignes de ces deux chantiers sont par organisme ou par fonction (natures mêlées), le transfert payé n'y est pas isolé. Les marques de `odac.csv` (164 lignes, 108,125 Md€) désignent le **financeur** (programme de l'État) d'une dépense qui reste : elles ne sont pas éliminées. Les marques de `apul.csv` (SDIS, EPLE, lignes `CONSO`) sont des flux internes à l'APUL, déjà retirés des 330,484.
3. **D9 entre APU : 25,479 Md€** non attribués à un payeur ligne à ligne. L'essentiel est très probablement chez l'État : son D9 Insee (41,839) dépasse ses lignes D9 (16,283) de 25,556 (aides à l'investissement des catégories 61 à 64, non isolables sans les actions ; `etat-bouclage.md` § 6). Hypothèse, non vérifiée.
4. **D41 : 1,009 Md€** d'intérêts entre APU, non identifiés.
5. **P109 (FNAL, 13,093)** est marqué `oui:?` dans `etat.csv` mais n'est **pas** un flux entre APU dans les comptes : le D62 de l'ODAC n'est que de 1,285 Md€, il ne peut pas contenir les aides au logement (≈ 16 Md€), qui sont donc comptées dans le D62 de l'État. Pas d'élimination, pas de double compte avec D06 (déduction, V16503).

## 3. Total consolidé comparé à l'Insee

| | Grand livre | Insee | Écart |
|---|---|---|---|
| Dépenses, somme des sous-secteurs | 1851,111 | 1851,104 | 0,0064 |
| − flux entre APU | −178,515 | −178,515 | 0 (élimination Insee reprise) |
| **Dépenses consolidées des APU** | **1672,596** | **1672,589** (3.201) | 0,0064 |
| **Recettes consolidées des APU** (`recettes.csv`, 77 lignes, périmètre APU) | **1503,471** | **1503,471** (3.201) | −0,0001 |
| **Solde (besoin de financement)** | **−169,125** | **−169,118** (B9NF) | −0,0065 |

Remarques. (1) Le tableau 3.215 donne pour l'ensemble des APU 1 672,708 Md€ de dépenses, contre 1672,589 dans le 3.201 : écart interne à l'Insee de 0,119 Md€, non expliqué (V16504) ; le grand livre suit le 3.201, cohérent avec le solde publié. (2) Le bilan (`sources/calculs/bilan_global.py`) arrondit : dépenses 1 672,6 (+0,011), recettes 1 503,5 (+0,029), déficit −169,1 (+0,018), prélèvements obligatoires 42,7 % × 2 935 = 1 253,245 contre 1 254,024 (−0,779, absorbé dans les recettes hors prélèvements : nommé au registre, ligne C18). (3) Les recettes portent 2,600 Md€ de prélèvements obligatoires hors APU (droits de douane de l'UE), non additionnés, et une ligne mémo de crédits d'impôt (−19,624), non additionnée.

Dans ces dépenses consolidées, 103,025 Md€ sont des **écritures sans flux d'argent** (cotisations imputées 51,242, production pour emploi propre 32,012, crédits d'impôt 19,771 ; 3.201) : la dépense « hors éléments imputés » est de 1569,564 Md€.

## 4. Qualité du recensement par sous-secteur

Chaque sous-secteur retombe sur l'Insee **par construction** (des lignes de fermeture explicites portent ce qui n'est pas recensé). Le chiffre qui mesure la qualité est donc la part des lignes de fermeture et des estimations, pas l'écart nul.

| Sous-secteur | Total | fait | calcul | estimation | ⚠️ | Lignes de fermeture (net ; brut en valeur absolue) | Part brute du total |
|---|---|---|---|---|---|---|---|
| État (S13111) | 600,701 | 22,276 | 523,331 | 44,916 | 10,178 | 6 lignes : 10,178 ; 30,395 | 5,1 % |
| ODAC (S13112) | 142,637 | 40,527 | 13,898 | 88,212 | 0,000 | 1 lignes : 9,253 ; 9,253 | 6,5 % |
| APUL (S1313) | 330,484 | 361,009 | −37,525 | 7,000 | 0,000 | 6 lignes : 2,503 ; 31,919 | 9,7 % |
| ASSO (S1314) | 777,288 | 639,661 | 28,899 | 108,728 | 0,000 | 91 lignes : 28,899 ; 28,899 | 3,7 % |

Lecture, sous-secteur par sous-secteur (détails dans chaque `*-bouclage.md`) :

- **État** : 590,5 Md€ de lignes d'exécution 2024 (cote A) ; six écarts explicites (net +10,178 ; brut 30,4), dont 20,282 sur les interventions et 25,6 de D9 non isolés. La nature SEC est **dérivée** des catégories budgétaires (statut `calcul`) : le recensement est complet en montant, approximatif en nature.
- **ODAC** : 28,077 d'éléments imputés (fait Insee), 105,300 de lignes nommées en **budget initial** 2024 (statut `estimation`), 9,253 par différence. Les flux internes AFITF → SNCF Réseau, ANR → universités, ANAH restent comptés deux fois dans les lignes nommées, ce qui sous-estime le vrai reste.
- **APUL** : lignes fonctionnelles OFGL (fait) ; passages comptabilité locale → nationale de −12,775 dont 5,844 non expliqués (reclassement probable des producteurs marchands) ; EPLE 7,0 estimé (2018) ; résidu ODAL 8,278 ; consolidation interne −33,028 dont ≈ 13 non retrouvés payeur par payeur.
- **ASSO** : 699,6 Md€ sur source indépendante (DREES, CCSS, Cades), 48,8 repris de l'Insee sans décomposition, 27,0 reconstitués par différence et 1,9 d'écart DREES / Insee. Meilleur taux de recensement des quatre.

## 5. Recettes

| Statut | Md€ |
|---|---|
| calcul | 11,246 |
| fait | 1492,225 |
| **Total (périmètre APU)** | **1503,471** |

L'élimination des flux entre APU côté recettes (178,515 = D73 145,891 + D9 31,615 + D41 1,009, `recettes-bouclage.md` § 1) est égale, à l'euro, à celle des dépenses ci-dessus : les deux côtés du grand livre sont consolidés de la même façon.

## 6. Ce que la synthèse dit du bilan

Le bilan part du total consolidé de l'Insee (1 672,6) et le découpe par fonction COFOG ; il ne recompte donc pas les flux entre APU : **aucun double compte de consolidation n'a été trouvé dans le bilan**. Les doublons et oublis réels sont des lignes du bilan qui retirent, gardent ou oublient une dépense ou une recette sans cohérence entre elles : voir `corrections-bilan.md` (registre, effets sur le solde, ce qui est corrigé et ce qui reste à arbitrer).

## Sources mobilisées

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts |
|---|---|---|---|
| Insee, comptes nationaux annuels base 2020, tableaux 3.201, 3.203, 3.204, 3.205, 3.212, 3.215 (édition 2026), https://www.insee.fr/fr/statistiques/8988845, lus le 06/11/2026 | totaux de dépenses et de recettes par sous-secteur ; flux entre APU (D73, D9, D41) ; solde 2024 | A | aucun connu |
| `etat.csv`, `odac.csv`, `apul.csv`, `asso.csv`, `recettes.csv` (chantiers T65 du 06/11/2026) | lignes et leurs sources (PLRG 2024, jaune opérateurs PLF 2025, OFGL/DGCL, DREES, Insee 3.217) | A à C selon la ligne | voir chaque fichier |
