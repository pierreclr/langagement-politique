---
titre: Écarts entre OpenFisca-France et le texte de loi (relevés pendant la vérification des fiches AN109 à AN113)
statut: brouillon
date: 2026-11-03
---

# Écarts entre OpenFisca-France et le texte de loi

*Dépôt privé, rien n'est envoyé ni publié. Ce fichier pourra servir de base à une contribution à OpenFisca-France, après relecture et accord de l'auteur.*

Un écart ici est une différence entre ce que calcule OpenFisca-France 176.1.10 (code lu dans le paquet installé) et ce que dit le texte en vigueur (copie codes.droit.org du 31/10/2026). **C'est une anomalie du modèle, pas de la loi** : les anomalies de la loi sont dans `registre-anomalies/`. Trois niveaux : **confirmé** (le code fait autre chose que le texte), **probable** (la lecture du texte est claire, la doctrine de l'organisme n'a pas été lue), **non implémenté déclaré** (le code l'annonce lui-même en commentaire).

Méthode : pour chaque fiche, relecture mot pour mot des articles, recalcul à la main d'un ou deux points de l'atlas (`sources/atlas-taux-marginaux.md`), comparaison avec les variables d'OpenFisca (base de ressources, abattements, période de référence, plafonds de l'année), et pour l'écart E1 une simulation corrigée (`outils/droit/openfisca/ecart_aah_base.py`).

## Tableau

| N° | Sujet | Niveau | Effet sur l'atlas | Fiche |
|---|---|---|---|---|
| E1 | AAH : base de ressources sans les 10 % de frais professionnels | probable | modéré : 15 pas à plus de 100 % deviennent 11 (zone 2) | AN113 |
| E2 | AAH : neutralisation de six mois à la reprise d'activité non modélisée | non implémenté déclaré | faible : premier pas 264 % au lieu de 285 % (six mois) | AN113 |
| E3 | Majoration pour la vie autonome : « pas de revenu d'activité » lu comme « aucun salaire l'année civile précédente » | probable | nul en régime permanent ; décalage d'un an en transition | AN113 |
| E4 | AAH : SMIC pris dans le mois de calcul, pas le dernier jour du trimestre de référence | probable | très faible (mois de revalorisation) | AN113 |

## E1. AAH : base de ressources sans les 10 % de frais professionnels

- **Texte.** CSS R821-4 II : « Les revenus pris en compte sont ceux définis aux articles R. 532-3 à R. 532-7 » ; R821-4-1 II (pour les personnes en activité) reprend ces revenus avec un trimestre de référence. R532-3 : « les ressources prises en considération s'entendent du total des revenus nets catégoriels retenus pour l'établissement de l'impôt sur le revenu » : pour un salaire, le salaire imposable après déduction forfaitaire de 10 % de frais professionnels. D821-9 applique ensuite l'abattement de 80 % (tranche jusqu'à 30 % du SMIC) puis 40 % aux « revenus d'activité professionnelle perçus ».
- **OpenFisca.** `openfisca_france/model/prestations/minima_sociaux/aah.py`, `aah_base_ressources_activite_eval_trimestrielle` : somme de `salaire_net` (net de cotisations et de CSG/CRDS, donc sans les 10 % et sans la CSG non déductible) sur les trois mois précédents, multipliée par 4. Variante annuelle (`aah_base_ressources_activite_eval_annuelle`) : `salaire_imposable` de l'année N-2, sans les 10 %. Pour comparaison, le complément familial applique bien les 10 % : `cf_base_ressources` = 22 142,70 € pour 24 602,70 € de salaire imposable.
- **Mesure.** Cas type AAH, zone 2, brut 1 000 € : salaire net 791,6 € (OpenFisca) contre 738,1 € dans la lecture du texte (820,09 × 0,9) ; AAH 786,4 € au lieu de 818,5 € ; à 2 000 € de brut : 311,5 au lieu de 375,7 € ; à 2 650 € : 4,4 au lieu de 87,8 €. Atlas, zone 2 : TMEP max 285 % → 283 % ; pas à plus de 70 % : 41 → 44 ; **pas à plus de 100 % : 15 → 11** (zone 1 : 18 → 17, zone 3 : 14 → 9). Reproduire : `ecart_aah_base.py`.
- **Incertitude.** La doctrine des caisses d'allocations familiales et la circulaire de la DSS n'ont pas été lues : elles peuvent retenir le net imposable avant ou après les 10 % (⚠️ V4434). Tant qu'elles ne sont pas lues, l'écart est « probable ». Contribution possible : remplacer `salaire_net` par `salaire_imposable` avec la déduction `abatpro` et ajouter un test sur un cas trimestriel.

## E2. AAH : neutralisation de six mois non modélisée

- **Texte.** CSS D821-9 I 1° : lorsque le bénéficiaire n'a pas perçu de revenus d'activité le mois précédent et débute ou reprend une activité, ces revenus « ne sont pas pris en compte pendant une durée maximale de six mois » (six mois cumulés par période de douze mois glissants ; non applicable si l'activité précède l'ouverture du droit).
- **OpenFisca.** Non implémenté, et le code le dit : commentaire `# TODO : ... Art. D. 821-9 1°` dans `aah_base_ressources_activite_eval_annuelle` et `# TODO: ... abattements temporaires sur les ressources en cas de changement de situation (6 mois pour retour à l'emploi, un an pour inactivité)` dans `aah_base_ressources_deconjugalisee`.
- **Effet.** Sans objet en régime permanent. À la reprise d'activité, l'AAH reste pleine pendant six mois et seule la majoration pour la vie autonome est perdue (L821-1-2) : premier pas à −104,8 € pour 39,6 € de salaire net, TMEP de 264 %.

## E3. Majoration pour la vie autonome : condition d'absence de revenu d'activité

- **Texte.** L821-1-2 : la majoration est versée aux bénéficiaires qui « ne perçoivent pas de revenu d'activité à caractère professionnel propre », sans durée de référence, et qui perçoivent l'AAH « à taux plein ou en complément d'un avantage de vieillesse ou d'invalidité ». Montant : D821-3, 104,77 € (inchangé depuis 2008, OpenFisca le reproduit).
- **OpenFisca.** `eligibilite_caah` (formule du 2015-07-01) exige `activite_12_mois == 0`, c'est-à-dire aucun `salaire_imposable` ni `rpns_imposables` sur **l'année civile précédente** (le code porte « substitution à vérifier ») ; la condition « AAH à taux plein » n'est pas codée. La formule semble reprendre la règle de l'ancien complément de ressources (douze mois sans activité), abrogé en 2019 (L821-1-1).
- **Effet.** Nul dans l'atlas (même salaire sur trois ans). En transition réelle, OpenFisca garderait la majoration jusqu'au 1er janvier suivant la reprise d'activité ; le texte la supprime dès le premier revenu d'activité (⚠️ V4435 : application réelle par les caisses non lue).

## E4. AAH : SMIC du mois de calcul

- **Texte.** D821-9 I 2° : seuil de 30 % du SMIC « en vigueur le dernier jour de la période de référence » (le trimestre de référence).
- **OpenFisca.** `aah_base_ressources_deconjugalisee` : `smic_b_horaire` pris à la période de calcul (le mois courant), pas au dernier jour des trois mois précédents.
- **Effet.** Au mois d'une revalorisation du SMIC, le seuil est celui du mois courant au lieu de celui du trimestre précédent. En 2026 : 12,02 €/h jusqu'au 31/05, 12,31 €/h à partir du 1er juin (arrêté du 22 mai 2026, paramètre OpenFisca). Effet de l'ordre de 5 € par mois sur l'AAH (la tranche à 80 % d'abattement s'élargit de 13 €, soit 0,4 × 13 €), limité aux mois de revalorisation.
- **Remarque propre à l'atlas, pas à OpenFisca** : l'axe de l'atlas utilise le SMIC de janvier (1 823,07 €) alors que la formule de l'AAH utilise celui de chaque mois (1 867,09 € dès juin) ; les moyennes annuelles de l'atlas mélangent donc deux SMIC.

## Points vérifiés sans écart

| Sujet | Texte | OpenFisca | Verdict |
|---|---|---|---|
| ASPA : différentiel à 100 % | CSS L815-9, D815-2 | `aspa` : plafond = montant maximum, `depassement` retranché | conforme (243,59 → 193,59 € pour 800 → 850 € de pension) |
| ASPA : ressources sur trois mois | R815-29 | `asi_aspa_base_ressources_individu` : `period.last_3_months` | conforme |
| ASPA : âge de 65 ans | R815-1 | `aspa.age_min` = 65 | conforme |
| ASPA : exclusion de l'aide au logement | R815-22 10° | aide au logement absente de la base | conforme à la lecture usuelle ; R815-22 10° ne nomme que l'allocation de logement sociale (⚠️ V4432) |
| Aide au logement : base et arrondi | CCH R822-4, D823-17 | pension − 10 %, arrondie à la centaine supérieure (8 640 → 8 700) | conforme |
| Aide au logement : période | R822-3 1° (douze mois glissants) | `annee_glissante` pour salaires et pensions | conforme à une lecture de R822-3 1° ; pensions en 3° (N-2) possible (⚠️) |
| CF : seuil du montant majoré | L522-3, R522-4 (moitié du plafond), D522-1, D522-2 | `cf_majore_plafond` = 0,5 × plafond ; majoré sans différentiel | conforme (aucun différentiel écrit pour le majoré) |
| CF : complément différentiel du plafond principal | L522-2, R522-3 | `plafond_diff = plafond + 12 × montant` | conforme |
| CF : ressources | R532-3 (10 %, avant-dernière année) | 22 142,70 = 24 602,70 × 0,9 ; N-2 en régime permanent | conforme (le décalage de deux ans n'est pas modélisé dans l'atlas) |
| AAH : différentiel et plafond | D821-2 | `min(montant_max, plafond − ressources)` | conforme |
| AAH : abattements 80 % / 40 % | D821-9 | `travail_ordinaire.abattement_30` = 0,8, `abattement_sup` = 0,4, tranche 0,3 SMIC | conforme (hors E1, E4) |
| AAH : montant et MVA | L821-3-1, D821-3 | 1 033,32 puis 1 041,59 € ; 104,77 € | conforme |

## Points à confirmer qui ne sont pas des écarts

- **Complément familial, majoration du plafond du majoré.** R522-4 renvoie la majoration du plafond (famille biactive ou parent isolé) à « un montant [...] fixé par décret » ; OpenFisca prend la moitié de la majoration du plafond principal (`cf_majore_plafond = 0,5 × cf_plafond`). Les arrêtés ne sont pas dans le corpus (⚠️ V4433).
- **Complément familial, coefficients par enfant.** R522-2 : « majoré de 25 % par enfant à charge à partir du premier et de 30 % par enfant à charge à partir du troisième ». OpenFisca : 1 + 0,25 × min(n, 2) + 0,30 × max(n − 2, 0) (3 enfants : 1,80). Une lecture littérale donne 25 % + 30 % pour le troisième enfant (2,05). La pratique n'a pas été lue ; si l'ambiguïté est réelle, c'est une anomalie de rédaction de la loi (à traiter hors de cette fiche) et OpenFisca suit la pratique (⚠️ V4433).
- **ASPA : pension brute.** OpenFisca compte `retraite_brute` ; R815-22 dit « tous les avantages d'invalidité et de vieillesse » sans préciser brut ou net (⚠️ V4432). Sans effet pour les pensions sous le seuil d'exonération de CSG.
- **Montants chiffrés** (plafonds, BMAF, montants de l'ASPA depuis 2021, taux Tp de l'aide au logement) : fixés par décrets et arrêtés hors du corpus de codes ; vérifiés seulement par la cohérence interne d'OpenFisca (V4380).
