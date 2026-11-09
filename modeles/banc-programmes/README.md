# Banc d'essai commun des programmes

Décision de l'auteur (08/11/2026) : chiffrer chaque programme politique avec **nos** modèles, de sorte qu'affiner un modèle réexécute tous les chiffrages, le nôtre compris. Écrit par Claude (IA d'Anthropic) ; ordres de grandeur sous hypothèses, jamais des prédictions.

## Relancer
```
python3 -I modeles/banc-programmes/relancer.py            # lit les caches versionnés (donnees/cache/), écrit resultats.md et donnees/resultats.json
python3 -I modeles/banc-programmes/relancer.py --ponts    # relance d'abord jsc (modèles JS) et OpenFisca (venv) pour réécrire les caches
python3 -I modeles/banc-programmes/tests/test_banc.py     # tests unittest
```
OpenFisca : `python3 -m venv VENV && VENV/bin/pip install openfisca-france==176.1.10` (commande de `sources/rules-as-code-taux-marginaux.md`) ; chemin du Python du venv dans `ponts.py` ou variable `BANC_OPENFISCA_PYTHON`. jsc : `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc` (Node est absent).

## Contenu
| Fichier | Rôle |
|---|---|
| `moteur.py` | Fonctions pures : lois (tri, lognormale...), leviers branchés sur les modèles, évaluation d'une mesure, montée en charge, dette (même récursion que `modeles/systeme-ideal/`), relance, centiles, empilement des extrêmes |
| `ponts.py` | Lance nos modèles et écrit `donnees/cache/*.json` ; relit le cache si le moteur est absent |
| `js/pont_retraites.js` | Pont vers `modeles/retraites/age_libre.js` (coût d'un départ avancé, sans décote) |
| `js/pont_incertitudes.js` | Bornes favorable / défavorable de chaque module de notre système (30 modules), rejouées une par une avec les fonctions de `modeles/systeme-ideal/` ; cache `donnees/cache/incertitudes.json` |
| `js/diagnostic_saut_2041.js` | Isole le saut de 25 Md€ du solde primaire de notre système entre 2040 et 2041 (fin du report d'encaissement de 12 ans, V32012) et mesure la sensibilité (V32018) |
| `js/pont_systeme.js` | Pont vers `modeles/systeme-ideal/` : ISF, impôt plancher (type Zucman), transmissions, plafond d'héritage, trajectoire de dette de notre système S3 et du droit actuel |
| `leviers2.py` | Fonctions pures des quatre mesures ajoutées le 08/11/2026 : Smic à 1 700 € net (salaires lognormaux, allègements, grille OpenFisca), pension minimale (distribution DREES des carrières complètes), blocage des carburants, nationalisations (prix, dette, dividendes) |
| `leviers_rn.py` | Fonctions pures des deux leviers propres au Rassemblement national : impôt sur la fortune financière (`iff`, module d'ISF sur la part financière, net de l'IFI) et exonération d'IR des moins de 30 ans (`ir_jeunes`, grille OpenFisca) |
| `rn_openfisca.py` | Grille OpenFisca-France de l'IR d'un salarié seul par salaire (1 à 4 Smic) (cache `donnees/cache/rn_openfisca.json`) |
| `smic_openfisca.py` | Grille OpenFisca-France des effets publics par foyer type et salaire (cache `donnees/cache/smic_openfisca.json`) |
| `ir_openfisca.py` | Impôt sur le revenu avec OpenFisca-France : barème à 14 tranches, fin du quotient conjugal, réaction (élasticité du revenu imposable), population stylisée de foyers types |
| `programmes/<nom>/mesures.py` | Un programme = une liste de mesures (format ci-dessous) ; `lfi`, `rn` (Rassemblement national, contre-budget 2027 du 06/10/2026), `langagement`, `fil_de_l_eau`, `lr` (plan Retailleau du 12/10/2026, ajouté le 09/11/2026), `ps` (contre-budget 2027 du groupe socialiste du 16/09/2026, camp de Raphaël Glucksmann, ajouté le 09/11/2026) |
| `relancer.py`, `rapport.py` | Orchestration, Monte-Carlo (10 000 tirages, graine 20261108), écriture de `resultats.md` |
| `js/prelude_moins_severe.js`, `js/pont_isf_abs.js`, `js/pont_modules_ms.js` | Variante « modèles moins sévères » (exil, évasion, planification des grandes fortunes) : remplace en mémoire des constantes (aucun fichier de `modeles/systeme-ideal/` n'est modifié), recalcule les blocs ISF, plancher, transmissions et les modules M-PAT et M-TRANS de notre système ; caches `systeme_moins_severe.json` et `modules_moins_severes.json` ; dossier `sources/banc-variante-moins-severe.md` ; résultats § 10 de `resultats.md` |
| `tests/test_banc.py` | Tests |

## Format d'une mesure (`programmes/<nom>/mesures.py`)
`id`, `chapitre`, `libelle`, `citation` (courte), `lien`, `sens` (`recette` ou `depense`), `levier` (`cout_unitaire`, `produit`, `retraites_age`, `ir_openfisca`, `isf`, `plancher`, `succession`, `smic`, `pension_min`, `carburant`, `nationalisation`, `iff`, `ir_jeunes`, `zucman`),
`valeur` | `parametres` | `facteurs_produit` : lois `{forme, bas, central, haut}` (`tri` : support bas-haut et mode central ; `med` : support bas-haut et MÉDIANE = central, deux pans uniformes, utilisée pour les économies annoncées par le RN où « haut » = l'annonce ; `lognorm`/`normale` : bas et haut = centiles 10 et 90 ; `unif` ; `fixe`),
`interpretation` (noir sur blanc quand la mesure est vague), `an1` (montant de la 1re année dans le document du programme) ou `montee` (parts du régime atteintes chaque année),
`facteur` (`comportement` ou `cout`) et `lambda` (poids du facteur latent, 0 à 1), `hypotheses` : liste de `(identifiant, texte, source, cote A-D, conflits d'intérêts)`.
Un programme porte aussi `PROGRAMME` (nom, début, régime, macro, calendrier). Champs propres au RN : `theme`, `annonce` (montant annoncé en régime), `an1_rn`, `contrainte` (obstacle juridique ou pratique nommé). Pour ajouter un programme (camp présidentiel, droite) : créer `programmes/<nom>/mesures.py`, l'ajouter à la liste de `relancer.py` (et à `rapport.py` pour les colonnes du tableau).

## Notre système dans le banc (même méthode que LFI et le RN)
`programmes/langagement/mesures.py` lit `donnees/cache/incertitudes.json` : une liste de **modules** (garantie de transition, fonction du patrimoine v7.5 et ses comportements, transmissions, fonction des revenus, crédit d'IS, courbe des pensions, TVA, économies de fonctionnement, grand âge, chiffrage du 08/11, Sécurité sociale à 100 %, conversions en salaire, plancher en deux parts, outre-mer, retraites V6, fiscalité d'orientation, etc.), chacun avec ses écarts favorable et défavorable au central, année par année. Pour chaque module, `pont_incertitudes.js` rejoue la fonction du modèle qui le calcule au scénario favorable puis défavorable, tout le reste au central ; le niveau des leviers votés (F, calé au central pour une dette stable dès 2038) reste fixe ; la trajectoire du solde primaire exportée est linéaire dans ces écarts. Le moteur (`moteur.effet_modules`, `relancer.simuler_systeme`) tire les modules avec les mêmes facteurs communs que les deux autres programmes (comportement, coût), 10 000 tirages, graine fixe, puis refait la chaîne dette. Conventions marquées ⚠️ (centiles 10 et 90, modules comonotones en interne, lambda de 0,3 à 0,8) dans `mesures.py`. Ce qui n'est pas propagé (socle hérité de la v5, corrections du grand livre, impôt de suite, clause de dette) est fixé au central : intervalle sous-estimé (V32019).

## Variante « modèles moins sévères »
`relancer.py` rejoue les quatre programmes (mêmes tirages, même graine) avec des hypothèses d'exil et d'évasion plus basses (`ctx_moins_severe`, `mesures_systeme_moins_severes`) et les écrit en § 10 de `resultats.md` et sous `moins_severe` dans `donnees/resultats.json`. Pour notre système, les modules M-PAT et M-TRANS reçoivent un central décalé (`d_c`) ; les leviers votés (F) restent fixes. Pour régénérer les caches : `python3 -I modeles/banc-programmes/ponts.py`. Artefact de comptabilité de `grandes_fortunes_0511.varianteB` contourné par `pont_isf_abs.js` : voir `sources/banc-variante-moins-severe.md` § 3.

## Programmes ajoutés le 09/11/2026 (Les Républicains, PS et Place publique)
Demande de l'auteur du 09/11/2026. Recensement des programmes chiffrés au 09/11/2026 : `sources/chiffrage-programme-lr-2027.md` § 0. Deux programmes assez précis : le plan d'économies de Bruno Retailleau (`programmes/lr/`, dossier `sources/chiffrage-programme-lr-2027.md`) et le contre-budget 2027 du groupe socialiste (`programmes/ps/`, dossier `sources/chiffrage-programme-ps-2027.md` ; ce n'est pas le programme du candidat). Même format et même convention que le RN (loi `med` : médiane = estimation réalisable, haut = annonce ; champ `contrainte`). Nouveau levier `zucman` (`moteur.levier_zucman`) : impôt plancher de 2 % au-dessus de 100 M€ sans ISF, lu dans le cache `zucman_droit_actuel` (fonction `zucmanSurDroitActuel` de `grandes_fortunes_0511.js`). Le Smic du PS réutilise les paramètres de S01 (LFI), seule la hausse diffère. `relancer.PROGRAMMES` liste les programmes ; chaque programme a son propre générateur (même graine) : l'ajout ne change aucun résultat des autres (tests `TestAjouts0911`, dont la non-régression des médianes publiées le 08/11/2026). Résultats : `resultats.md` § 11 (avec la dette 2032, ajoutée pour tous dans `donnees/resultats.json`) ; sensibilité au taux endogène : `modeles/taux-endogene/resultats.md` § 2 (la liste des programmes y est lue dans `relancer.PROGRAMMES`). Non rejoués dans la variante « moins sévère » (§ 10).

## Programme d'Édouard Philippe (Horizons)
Pas de colonne : aucun document chiffré d'ensemble n'est publié (08/11/2026 ; rien de nouveau trouvé le 09/11/2026). Dossier `sources/chiffrage-programme-philippe-2027.md` (annonces, ordres de grandeur, carte des convergences, steelman). Quand un document paraît : créer `programmes/philippe/mesures.py` sur le modèle de `programmes/rn/mesures.py`, l'ajouter à la liste de `relancer.py` et à `rapport.py`.

## Méthode en bref
1. Chaque mesure actionne un levier : un modèle du dépôt quand il existe, sinon un coût unitaire sourcé (cote A-D) ou un ordre de grandeur marqué « grossier ».
2. Les scénarios favorable / central / défavorable de nos modèles sont lus comme centiles 10 / 50 / 90 ; un facteur latent commun « comportement » (érosion, exil, élasticité) les relie, un second « coût » relie les dérives de dépense.
3. Monte-Carlo : 10 000 tirages, graine fixe ; on publie la médiane et l'intervalle à 80 % ; l'empilement des extrêmes est gardé à part, pour mémoire.
4. Chaîne dette : même dette de départ (3 460,5 Md€ fin 2025, Insee), même macro (3 % ; 3,45 %), même récursion pour tous les programmes ; test de validité sur notre système (130,4 % en 2038, 124,6 % en 2058).
5. Relance macroéconomique : présentée à part, multiplicateurs de la littérature.

## Limites
Voir `resultats.md` § 9 : population stylisée pour l'impôt sur le revenu, convention des scénarios, intervalle de notre système propagé module par module mais sous-estimé (socle hérité fixé au central), test de validité qui valide la chaîne dette et non les leviers.
