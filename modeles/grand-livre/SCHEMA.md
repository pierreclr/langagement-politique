---
titre: Grand livre unique de l'argent public (T65)
statut: schéma de travail, 06/11/2026
---

# Grand livre unique : schéma commun

Demande de l'auteur (06/11/2026) : recenser **toutes** les dépenses publiques de façon exhaustive, reconstituer ce qui manque, retrouver chaque ligne dans les comptes de l'Insee, puis dire pour chacune ce qu'elle devient dans le nouveau système. But : un budget à financer sans oubli ni double compte, puis la comparaison avec ce que le système rapporte, puis la décision sur la dette. Règle : on n'écrit jamais « il manque X Md€ » quand X est seulement fondu ailleurs.

## Année et cadre de référence

- **Année de référence : 2024** (derniers comptes nationaux définitifs ou semi-définitifs de l'Insee). Les montants d'une autre année sont gardés dans leur colonne d'année, sans les convertir en silence.
- **Total de bouclage** : la dépense publique consolidée des administrations publiques (APU) de l'Insee pour 2024, par sous-secteur (État, ODAC, APUL, ASSO) et par nature SEC 2010. Chaque sous-secteur doit retomber à 100 % sur son total Insee **avant consolidation** ; l'écart restant est une ligne explicite « écart non expliqué », jamais absorbé.
- **Consolidation** : les transferts entre administrations publiques (État vers Sécurité sociale, État vers collectivités, collectivités entre elles, ODAC…) sont comptés une fois chez le payeur et une fois chez le receveur ; ils sont **marqués** (colonne `flux_inter_apu`) avec leur contrepartie, pour être éliminés au total consolidé. C'est la première source de doubles comptes.

## Table : `<sous_secteur>.csv` (séparateur « ; », UTF-8)

| colonne | contenu |
|---|---|
| id | identifiant stable : `GL-ETAT-…`, `GL-ODAC-…`, `GL-APUL-…`, `GL-ASSO-…`, `GL-REC-…` (recettes) |
| sous_secteur | ETAT, ODAC, APUL, ASSO ; REC pour les recettes |
| entite | ministère, opérateur, caisse, régime, collectivité |
| libelle | ce que c'est, en clair |
| nature_sec | code SEC 2010 de l'Insee : D1 rémunérations, P2 consommations intermédiaires, D62/D632 prestations, D3 subventions, D7 autres transferts courants, D9 transferts en capital, P51g investissement, D41 intérêts, autre (préciser) |
| cofog | division COFOG (01 à 10) et groupe si connu |
| montant_md_eur | Md€ courants |
| annee | année du montant |
| source_url ; source_nom ; cote ; date_consultation | traçabilité ; cote A-D (règle 11 de la charte) |
| statut_chiffre | fait ; calcul ; estimation ; ⚠️ |
| flux_inter_apu | non ; ou `oui:<id de la contrepartie>` (ou `oui:?` si non trouvée) |
| ligne_insee | tableau et ligne de l'Insee où ce montant est compris (ex. `t_3201 ODAC D1`) |
| ligne_bilan | identifiant de la ligne de `sources/calculs/bilan_global.py` qui traite ce montant (ex. `D15`, `P01`), ou `aucune` |
| sort | reste ; fondu:<dans quoi> ; remplacé:fonction_revenus ; remplacé:fonction_patrimoine ; remplacé:complement_chomage ; supprimé ; à_arbitrer |
| montant_apres_md_eur | montant dans le nouveau système si chiffré (bilan v7.4), sinon vide |
| doublon_suspect | vide ; ou id de la ligne avec laquelle ce montant semble compté deux fois (dans le bilan ou entre fichiers) |
| note | remarque courte |

## Fichiers de chaque chantier

- `<sous_secteur>.csv` : les lignes.
- `<sous_secteur>-bouclage.md` : rapprochement au total Insee (tableau : nature SEC × montant des lignes × total Insee × écart), liste des reconstitutions, doublons suspects trouvés dans le bilan, questions ouvertes.
- Code de construction versionné dans `modeles/grand-livre/code/` (fonctions pures, `python3 -I`), relançable.
