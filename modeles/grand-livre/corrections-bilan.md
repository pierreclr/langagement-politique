---
titre: Grand livre unique (T65), registre des corrections du bilan global
statut: 06/11/2026, synthèse T65 ; mis à jour après l'arbitrage 47 (C10) ; appliqué dans `sources/calculs/bilan_global.py` (couche CORR_T65) ; vérifications V16500 à V16599
---

# Registre des corrections du bilan global

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026. Point de départ : la demande de l'auteur de tout recalculer, pour vérifier qu'aucune dépense n'a été comptée deux fois. Les cinq chantiers du grand livre (`etat`, `odac`, `apul`, `asso`, `recettes`) ont relevé les doublons, oublis et incohérences du bilan (`sources/calculs/bilan_global.py`). Ce registre les reprend un par un.

**Comment lire.** Effet sur le **solde de croisière** (Md€/an, central ; « + » améliore le solde), base 2024. **Fait** : établi par une source lue (cote donnée). **Hypothèse** : dépend d'un choix de modélisation ou d'un chiffre non lu. Trois sorts :
- **Corrigé** : se tranche par les chiffres ; appliqué dans le bilan (couche `CORR_T65` : les lignes du modèle restent telles que les modules JS les calculent, la correction est une ligne à part, avec l'ancienne valeur et la source).
- **À arbitrer** : demande une décision de l'auteur ; la ligne du bilan reste **en l'état**, ma recommandation est donnée avec son effet.
- **À vérifier** : le chiffrage manque ; rien n'est changé.

**Verdict d'ensemble.** Aucun double compte de consolidation dans le bilan : il part du total consolidé de l'Insee (1 672,6 Md€) et ne recompte pas les flux entre administrations (`synthese.md` § 6). Les vrais problèmes sont d'une autre nature : **une dépense oubliée** (les crédits d'impôt sur le revenu, 8,9 Md€, restés en dépense alors que l'impôt est supprimé), **un montant périmé** (primes à l'apprentissage), et surtout **des recettes gardées et une dépense supprimée sans que personne l'ait décidé** (34,2 Md€ de recettes et 2,2 de dépense), qui embellissaient le solde. L'auteur a tranché la plus grosse (C10, arbitrage 47 : 27,2 Md€ fondus) ; les autres attendent sa décision.

## 1. Tableau du registre

| N° | Lignes du bilan | Constat | Fait / hypothèse | Effet sur le solde (bas / central / haut) | Sort | Correction proposée |
|---|---|---|---|---|---|---|
| **C01** | D15 | Primes à l'apprentissage comptées sur 4,6 Md€ (IGF 2022). Exécution 2024 : **3,944** (aide unique et aide exceptionnelle, Jaune PLF 2026, cote A ; `sources/formation-professionnelle-depenses.csv` L09). Le « 9,0 » cité par le chantier État est le total des transferts aux entreprises du programme 103 (8,988), qui comprend 4,39 d'autres aides à l'emploi : ce n'est pas la base de D15. | fait | −0,656 | **corrigé** | économie de D15 ramenée à 3,944 (+0,656 de dépense) |
| **C02** | P03, P11, dépenses | Crédits d'impôt sur le revenu : 8,885 en 2024 (Insee 3.201 : 6,722 + 2,163). P03 dit « le modèle supprime l'impôt et ses crédits » (V6684), mais la dépense de crédits (comptée par l'Insee dans les 1 672,6) n'est retirée par aucune ligne ; la déduction de 8,885 reste dans P11 et son rétablissement dans les recettes hors prélèvements. | fait (Insee) ; hypothèse du modèle : tous les crédits d'impôt sur le revenu disparaissent | +8,885 (0 si tous les crédits étaient gardés) | **corrigé** | dépenses −8,885 ; prélèvements obligatoires +8,885 (la déduction disparaît) ; recettes hors prélèvements −8,885. Si l'auteur garde un crédit (emploi à domicile, garde d'enfants), la part gardée revient en dépense (V16506) |
| **C03** | D14, P11 | CIR : la dépense (8,0) est bien retirée par D14, mais sa déduction reste dans P11 et son rétablissement hors prélèvements. | fait (Insee 3.201 : crédits d'IS 10,739 dont CIR 8,0) | 0 (prélèvements obligatoires +0,27 point) | **corrigé** | prélèvements +8,0 ; recettes hors prélèvements −8,0 (présentation) |
| **C04** | P03, P10 (notes) | Notes inversées : crédits d'IR « 10,7 » et d'IS « 8,9 » ; l'Insee donne 8,885 (IR) et 10,739 (IS). | fait | 0 | **corrigé** (texte) | notes réécrites |
| **C05** | D03 | RSA compté plusieurs fois ? **Non dans le bilan** : D03 (12,4) est retiré une seule fois de la fonction « protection sociale ». Au grand livre, le RSA est compté une fois (APUL, départements) ; les lignes `ASSO-HT-09/10` sont hors total. Reste une base : départements 10,367 + État 1,617 = **11,984** en 2024, contre 12,4 (prime de Noël ? non vérifié). | fait (doublon écarté) ; hypothèse sur les 0,42 | −0,42 / 0 / 0 | à vérifier (V16507) | aucune ; si la base est 11,984, l'économie de D03 baisse de 0,42 |
| **C06** | — (grand livre) | APA en double entre l'ancien `lignes_asso.csv` (`ASSO-AUT-APA` 7,330) et l'APUL (7,343). Le nouveau `asso.csv` ne la compte plus (hors total, `GL-ASSO-HT-14`) ; le bilan n'a pas de ligne APA. | fait | 0 | sans effet | gardée une fois, chez les départements (APUL) |
| **C07** | D31, P06 | IDFM et gratuité : Île-de-France Mobilités (14,771) est compté une fois (ODAL, « reste ») ; D31 n'ajoute que le surcoût de la gratuité ; le versement mobilité (12,2) est supprimé une fois (P06) et compensé par la bascule (neutre). | fait | 0 | sans effet | aucune |
| **C08** | P11 / F01 | Prélèvements sur les revenus de capitaux mobiliers (3,884, `GL-REC-057`) gardés dans P11 alors que la fonction des revenus taxe le capital à 100 % : **doublon d'assiette**. Mais une partie est sans doute la retenue sur les non-résidents, que F03 suppose maintenue ; composition non lue. | fait (montant, Insee 3.217) ; hypothèse (composition) | 0 / −3,9 au plus / −3,884 | **à arbitrer** | **Recommandation** : fondre la part des résidents dans F01 ; garder les retenues sur les non-résidents (V16510) |
| **C09** | P11 / F05 | Taxe d'habitation des résidences secondaires et des logements vacants (3,153, `GL-REC-063`) gardée alors que la fonction du patrimoine taxe les mêmes biens : **doublon d'assiette**. | fait (montant) | 0 / −3,2 au plus / −3,153 | **à arbitrer** | **Recommandation** : fondre la part « résidences secondaires » dans F05 ; garder une taxe sur les logements vacants (incitation, dans l'esprit « calibrer plutôt qu'interdire ») ; partage non lu (V16511) |
| **C10** | P11 / P01, P06, F01 | **27,204 Md€** de contributions assises sur la masse salariale restées dans P11 (Insee D291 : formation 11,426 ; forfait social 6,300 ; FNAL 2,935 ; CSA 2,468 ; AGS 1,538 ; PEEC 1,504 ; stock-options 1,033). **Décision de l'auteur (arbitrage 47, 06/11/2026) : tout fondre dans la fonction des revenus** ; les usages restent en dépense, financés par le budget commun. La fonction n'en récupère rien de plus : sa base R est le coût employeur (table T14, OpenFisca / Urssaf), qui contient déjà formation, FNAL, CSA et AGS (18,367 : comptés deux fois jusqu'ici, dans T(R) et dans P11) ; forfait social, stock-options et PEEC (8,837) portent sur des assiettes hors de R. | fait (montants) ; hypothèse sur le contenu de la table T14 (V16515) | −27,204 | **corrigé (décision de l'auteur), trou à financer** | ligne visible dans la couche `CORR_T65` ; **aucun recalibrage adopté** ; réglage indicatif au § 4 (l'auteur attend la liste des trous et l'étude « qui paie plus sur le patrimoine ») |
| **C11** | D07 | Accueil du jeune enfant : 2,221 Md€ de prestations de service aux crèches (`GL-ASSO-PRE-CNAF-30-3-20`) **fondus sans décision** : D07 ne garde que le CMG et la PreParE. | fait (DREES 2024) | 0 / −2,221 / −2,221 | **à arbitrer** | **Recommandation** : garder le financement des crèches (c'est un service, pas une prestation monétaire que la fonction des revenus remplace) |
| **C12** | D30 / D02 | Le coût de substitution des seniors (3,499 en 2060) est chiffré sur les prestations actuelles ; sa part « chômage » devrait l'être sur le complément dégressif (12,56 / 37,1 = 34 % de l'allocation actuelle). Part du chômage dans D30 non lue. | hypothèse | 0 / +1,16 / +2,31 | à vérifier (V16508) | recalculer D30 dans `age_libre.js` avec le complément ; central : moitié de D30 en chômage |
| **C13** | P01, D02, D01 | Unédic → France Travail (4,820) et validation de points de retraite (2,488) : flux internes à l'ASSO financés par des cotisations que P01 supprime. Au solde consolidé, **aucun effet** : la dépense de France Travail reste (« reste »), les pensions sont dans D01. C'est une question d'affectation et de maintien des droits, pas de solde. | fait | 0 | sans effet | écrire au manifeste que la validation des droits pendant le chômage est maintenue et financée par le budget général (décision implicite à confirmer par l'auteur) |
| **C14** | D16 | La note disait « ODAC 142,6 Md€, 0,5 % touché » : l'assiette contient 28,1 Md€ d'éléments imputés, et les 0,54 du Sénat portent sur les opérateurs (périmètre du jaune), pas sur les ODAC. Montant de l'économie inchangé. | fait | 0 | **corrigé** (texte) | note réécrite ; recoupement avec D18 et B04 signalé |
| **C15** | D17 | MaPrimeRénov' comptée en engagements 2024 (3,3) ; l'Anah a distribué 3,77 Md€ en 2024, toutes aides confondues ? (budget initial 4,0). | fait (montants) ; hypothèse (part de MaPrimeRénov') | 0 / 0 / +0,47 | à vérifier (V16512) | passer aux paiements de MaPrimeRénov' seule (RAP 2024, programme 174 / Anah) |
| **C16** | D06 / P109 | FNAL : les 13,093 du programme 109 sont marqués « flux entre APU » dans `etat.csv`, mais le D62 de l'ODAC n'est que de 1,285 Md€ : les aides au logement (≈ 16) sont dans le D62 de l'État, pas dans un ODAC. **Pas de double compte** avec D06. | déduction (Insee 3.204) | 0 | sans effet (V16503) | retirer la marque `oui:?` de `GL-ETAT-BG-P109-C61` à la prochaine reconstruction de `etat.csv` |
| **C17** | D01, D1, recettes hors prélèvements | Cotisations imputées (D122 : 48,24 pour l'État, 51,242 pour les APU) : comptées en dépense et en recette. Une baisse des pensions de l'État (V6) les réduit des deux côtés : **neutre au solde**, mais dépenses et recettes en sont gonflées. | fait | 0 | sans effet | aucune ; le dire dans la lecture des ratios |
| **C18** | PO_AVANT, P11 | Prélèvements obligatoires calculés à 42,7 % × 2 935 = 1 253,245 contre 1 254,024 (Insee 3.217) : 0,779 tombe dans les recettes hors prélèvements. Même chose, plus petit, pour dépenses (1 672,6 contre 1 672,589), recettes (1 503,5 contre 1 503,471), déficit (−169,1 contre −169,118). | fait | 0 | gardé, nommé | pas de changement : toutes les réconciliations du modèle sont calées sur 42,7 % ; écart affiché ici, non absorbé en silence |
| **C19** | P01, D1 | Cotisations des employeurs publics (CNRACL 20,4 ; CAS Pensions hors budget général 7,1 ; inventaire, cote C) : recette supprimée par P01, dépense de rémunération inchangée. **Neutre** si la fonction des revenus prend aussi les salaires publics au coût employeur : c'est le cas, `modele.js` compte 27,02 M de salariés (tous, public compris). | fait (lecture du modèle) | 0 | sans effet (V16405 réduite) | aucune |
| **C20** | D01 | Réversions : la base de 392,0 (COFOG vieillesse) exclut les pensions de réversion (40,6), que le modèle de pensions et l'indexation V6 traitent. L'économie vient du modèle, pas de cette base : pas d'effet sur le solde, mais l'économie pourrait être sous-estimée si l'indexation ne s'applique pas aux réversions dans `age_libre.js`. | fait (bases) ; hypothèse (modèle) | 0 / 0 / non chiffré | à vérifier (V16509) | lire `age_libre.js` |
| **C21** | D18 (note) | « collectivités 0,05 (déjà dans D22) » : D22 est la justice ; lu comme D23 (collectivités). | fait (coquille vraisemblable) | 0 | **corrigé** (texte) | note réécrite (V16310) |
| **C22** | D20 / D23 | Recouvrement possible entre le non-remplacement des enseignants (État, D20) et celui des agents des collectivités affectés à l'enseignement (D23). | hypothèse | 0 / 0 / non chiffré | à vérifier (V16513) | isoler la part « enseignement » de D23 |
| **C23** | P11 / D11 | Remises pharmaceutiques (9,659, recette) et économies sur les médicaments (D11 : 3,4) : si les économies passent par des prix plus bas, la remise baisse. | hypothèse | ≤ 0, non chiffré | à vérifier (V16514) | — |
| **C24** | D15, P11 | Formation professionnelle, **variante B** (`sources/formation-professionnelle-cartographie.md`, recommandée, **pas validée par l'auteur : non intégrée**) : l'aide à l'embauche est gardée et ciblée, ce qui retire D15. | estimation | −1,95 / −2,33 / −2,97 (par rapport au bilan corrigé) | signalé, non intégré | à décider avec C10 (contribution formation 11,426) |
| **C25** | P10 / F02 | Autres crédits d'IS (2,739) gardés : cohérent, l'IS reste (F02). | fait | 0 | sans effet | aucune |

## 2. Effet total (mis à jour après l'arbitrage 47)

| | Md€/an (central, croisière 2060) |
|---|---|
| Solde de croisière v7.4 B (avant corrections) | −48,35 |
| Corrections factuelles (C01 + C02 ; C03 sans effet au solde) | +8,229 |
| C10 (arbitrage 47), trou à financer | −27,204 |
| **Solde de croisière corrigé** | **−67,33** |
| Prélèvements obligatoires | 50,7 % → **50,4 %** du PIB (+16,885 de C02 et C03, −27,204 de C10) |
| Dépenses publiques | 60,9 % → **60,6 %** du PIB (−8,229 Md€) |
| Si l'auteur suit mes trois recommandations restantes (C08, C09, C11) | −9,258 au plus → solde −76,58 |
| À vérifier, non compté (C05, C12, C15) | entre −0,42 et +2,78 |

Dette (`decisions_0611_v74.js`, export `export_bilan_v74.js` ; corrections appliquées comme un effet constant dès 2029 : ordre de grandeur) :

| Macro | v7.4 B : économies pour une dette stable ; manque avec la combinaison R1f + M1m + M2m + M3 | **Corrigé (C01-C03, C10)** : dette à 30 ans sans économies ; économies ; manque avec la combinaison | Corrigé + recommandations C08, C09, C11 : économies ; manque avec la combinaison |
|---|---|---|---|
| prudente | 37,6 ; 28,7 | 179,9 % ; 56,6 ; **47,6** | 65,8 ; 56,9 |
| référence | 6,9 ; 0,0 | 134,1 % ; 25,8 ; **18,7** (122,7 % à 30 ans avec la combinaison) | 35,1 ; **27,9** |
| favorable | 0,0 ; 0,0 | 101,0 % ; 0,0 ; 0,0 | 6,7 ; 4,2 |

**Ce que cela veut dire.** Avant l'arbitrage 47, le solde profitait de 18,4 Md€ comptés deux fois (dans la fonction des revenus et dans P11) et de 8,8 Md€ de recettes que personne n'avait décidé de garder. Une fois C10 appliquée, **la dette n'est plus stable en macro de référence** : il manque 18,7 Md€/an avec la combinaison. Ne pas écrire « dette stabilisée ».

## 4. Réglage minimal de la fonction des revenus (indicatif, NON adopté)

Pour rétablir les recettes d'avant C10 (27,204 Md€, réactions de comportement comprises ; `modeles/systeme-ideal/reglage_c10.js`), en gardant la forme T(R) = a·R − b − c·(1 − e^(−R/1 500)) :

| Réglage | ΔB(R), €/mois par adulte, à R = 0 / 1 500 / 2 000 / 3 000 / 5 000 / 10 000 (coût employeur) | Smic seul | Couple médian, 2 enfants | Cadre 10 000 € brut |
|---|---|---|---|---|
| **A** : a de 0,65 à **0,680** (m0 fixe, c de 675 à 720) | 0 / −16,6 / −26,9 / −51,2 / −106,8 / −255,5 | −20,0 | −124,1 | −381,6 |
| A' : a et m0 relevés de 0,0196 (c fixe) | 0 / −29,4 / −39,2 / −58,8 / −98,0 / −196,1 | −29,2 | −133,7 | −278,4 |
| B : b de 412,5 à **339,6** | −72,9 partout | 0 (plancher) | −145,7 | −72,9 |
| A, sur la seule part hors de R (8,837) : a = 0,6595 | 0 / −5,3 / −8,6 / −16,3 / −34,0 / −81,2 | −6,4 | −39,5 | −121,3 |

Lecture : A est le plus progressif (il épargne R = 0 et pèse surtout au-dessus de 3 000 €) ; B frappe uniformément et passe sous le plancher pour les plus modestes. Le cadre à 10 000 € brut, déjà à −3,5 % en v7.2, passerait vers −10 % avec A : hors de la cible validée.

## 3. Ce qui reste à arbitrer par l'auteur (questions, recommandation en tête)

1. **C10 : tranché** (arbitrage 47, tout fondre) ; reste à choisir **comment** financer le trou (fonction des revenus, fonction du patrimoine, économies) : l'auteur attend la liste des trous (tableau ci-dessous) et l'étude sur le patrimoine.
2. **C08 : prélèvements sur les revenus de capitaux mobiliers (3,9 Md€).** Je recommande de fondre la part des résidents dans la fonction des revenus et de garder les retenues sur les non-résidents.
3. **C09 : taxe d'habitation des résidences secondaires et logements vacants (3,2 Md€).** Je recommande de fondre les résidences secondaires dans la fonction du patrimoine et de garder une taxe sur les logements vacants.
4. **C11 : financement des crèches (2,2 Md€).** Je recommande de le garder.
5. **C02 (corrigé, mais avec un choix caché)** : la suppression de tous les crédits d'impôt sur le revenu rapporte 8,9 Md€. Chaque euro gardé revient en dépense.

### Trous à financer (par rapport à la dette stable en macro de référence, avec la combinaison ; Md€/an, + = creuse)

**Mise à jour du 06/11/2026** : le tableau final, avec la base de travail (v7.5, épargne réglementée exonérée, C09, arbitrages 48, 49 et 50, fantômes), est dans un document de travail non publié : solde de croisière −100,8 Md€, manque de **52,1 Md€/an** en macro de référence avec la combinaison. C09 et C24 y sont comptés (lignes BT03 et BT12) ; le tableau ci-dessous reste celui de la v7.4 B corrigée.

| N° | Trou | bas | central | haut | Statut |
|---|---|---|---|---|---|
| C10 | Contributions sur la masse salariale fondues (déjà dans le solde corrigé) | 27,20 | 27,20 | 27,20 | décidé (dont 18,37 comptés deux fois jusque-là) |
| — | **Manque en macro de référence avec la combinaison, C10 comprise** | | **18,7** | 47,6 (prudente) | calculé |
| C08 | Prélèvements sur les revenus de capitaux mobiliers fondus | 0 | 3,88 | 3,88 | à arbitrer |
| C09 | Taxe d'habitation des résidences secondaires fondue | 0 | 3,15 | 3,15 | à arbitrer |
| C11 | Crèches gardées | 0 | 2,22 | 2,22 | à arbitrer |
| C24 | Formation, variante B (principe adopté, arbitrage 48) | 1,95 | 2,33 | 2,97 | détails à valider |
| C02 | Crédits d'impôt sur le revenu gardés | 0 | 0 | 8,88 | hypothèse du modèle |
| C12 | D30 recalculé sur le complément (réduit le trou) | −2,31 | −1,16 | 0 | à vérifier |
| C05 | Base du RSA | 0 | 0 | 0,42 | à vérifier |
| C15 | MaPrimeRénov' en paiements (réduit le trou) | −0,47 | 0 | 0 | à vérifier |
| | **Manque de référence + trous non encore comptés** | **17,8** | **29,1** | **40,2** | ordre de grandeur (les effets en dette ne s'additionnent pas exactement) |
| | Même calcul en macro prudente | | 58,1 | | |

## Sources mobilisées

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts |
|---|---|---|---|
| Insee, comptes nationaux base 2020, tableaux 3.201, 3.203, 3.204, 3.215, 3.217 (édition 2026), https://www.insee.fr/fr/statistiques/8988845, lus le 06/11/2026 | crédits d'impôt en dépense (19,771) et en recette (19,624 ; IR 8,885, IS 10,739) ; D62 de l'ODAC (1,285) ; contributions D291 ; prélèvements obligatoires 1 254,024 | A | aucun connu |
| Jaune « Formation professionnelle » PLF 2026, tableau des crédits (via `sources/formation-professionnelle-depenses.csv`, L09) | aide à l'embauche d'apprentis exécutée en 2024 : 3,944 Md€ | A | document du gouvernement (partie prenante de la politique décrite) |
| DREES, comptes de la protection sociale 2024 (via `asso.csv`) | prestations de service aux crèches 2,221 ; RSA par financeur | A | aucun connu |
| `modeles/systeme-ideal/decisions_0611_v74.js`, `export_bilan_v74.js` | solde, prélèvements et dette de la v7.4 B, avec et sans corrections | B (modèle du dépôt) | coécrit par Claude et l'auteur |
| Chantiers T65 : `etat-bouclage.md`, `odac-bouclage.md`, `apul-bouclage.md`, `asso-bouclage.md`, `recettes-bouclage.md` | doublons suspects relevés, bases 2024 | A à C selon la ligne | voir chaque fichier |
