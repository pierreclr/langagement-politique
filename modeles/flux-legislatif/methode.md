---
titre: Flux législatif par mandat — méthode
date: 2026-11-09
taches: T67 (réécriture des codes), T70 (État as code)
statut: v0, calcul reproductible, non relu par un juriste
---

# Ce qui entre dans les codes et ce qui en sort, mandat par mandat : méthode

## Question

Pour chaque mandat présidentiel depuis 2002, combien d'articles de codes ont été créés, modifiés et abrogés (parties L, R, D), combien de mots étaient en vigueur au début et à la fin, combien de lois et de décrets ont été publiés, et quels codes ont le plus grossi ?

## Données (toutes sur le M5, rien n'est copié ailleurs)

| Donnée | Emplacement | Cote |
|---|---|---|
| Base LEGI de la DILA : export global du 13/07/2025 et 486 incréments quotidiens jusqu'au 03/11/2026, **versions abrogées comprises** (chaque version d'article porte sa date de début et de fin de vigueur, son état et ses liens) | `langagement-donnees/sources/legi/dila/` ; extraction existante `legi/extrait/legi.sqlite` (T55, 02/11/2026) | A |
| Nombre de mots de chaque version (1 830 895 versions, dont 526 814 de codes) | `langagement-donnees/sources/flux-legislatif/legi_mots.sqlite`, produit par `code/extraire.py legi` | A (calcul) |
| Base JORF de la DILA : export global du 13/07/2025 et 878 incréments (1 277 813 textes : nature, date de publication, titre) | `sources/jorf_global/`, `sources/jorf_increments/` ; extraction `flux-legislatif/jorf_textes.sqlite` (`code/extraire.py jorf`) | A |
| Secrétariat général du Gouvernement, *Indicateurs de suivi de l'activité normative*, édition du 4 mai 2026 | PDF : `langagement-donnees/sources/flux-legislatif/references/` (SHA-256 eaea200a…edc5) ; valeurs transcrites : `references/sgg_indicateurs_2026.csv` | A |

Le PDF du SGG a été téléchargé le 09/11/2026 depuis https://www.legifrance.gouv.fr/contenu/Media/files/autour-de-la-loi/legislatif-et-reglementaire/statistiques-de-la-norme/indicateurs-de-suivi-de-l-activite-normative-2026.pdf (adresse citée par le rapport annuel 2025 de la Commission supérieure de codification). Ses tableaux sont des images : les valeurs ont été recopiées à la main (pages 7, 21, 28 à 31, 33 et 35). ⚠️ Une relecture de la transcription est souhaitable.

## Définitions (hypothèses numérotées)

- **H1 — Article.** Un article est la chaîne de ses versions successives (liste VERSIONS de LEGI), identifiée par sa plus ancienne version (même règle que `outils/droit/legi_complet.py`). Un article renuméroté dans un nouveau code est un *nouvel* article (H5 le repère).
- **H2 — Version valide.** On écarte les versions « mort-nées » (MODIFIE_MORT_NE : modifiées avant d'entrer en vigueur), celles sans date de début et celles dont la fin précède ou égale le début.
- **H3 — Événements.** Création = début de la première version valide ; modification = début de chaque version suivante ; abrogation = fin de la dernière version si son état est ABROGE, ABROGE_DIFF, PERIME, ANNULE ou DISJOINT ; transfert = même chose avec TRANSFERE ou DEPLACE. **Un événement est daté de son entrée en vigueur, pas du vote ni de la publication** : une loi votée en avril 2017 qui entre en vigueur en 2018 est comptée au mandat suivant.
- **H4 — Mandats.** Chirac 2 du 17/05/2002, Sarkozy du 16/05/2007, Hollande du 15/05/2012, Macron 1 du 14/05/2017, Macron 2 du 14/05/2022 au 02/11/2026 (date des données : le dernier mandat ne compte que 4,5 ans).
- **H5 — Recodification et codification.** Une création est « à droit constant présumé » (a) si l'article porte un lien de concordance, transfert, déplacement ou renumérotation vers un article de code en vigueur la veille (recodification : Code du travail de 2008), ou (b) si sa première version porte un lien CODIFICATION vers une ordonnance ou un décret de codification (le droit existait hors des codes et y est versé : partie réglementaire du Code de la santé publique en 2003-2005, Code de la commande publique en 2019, Code général de la fonction publique en 2022). Une abrogation est « de recodification » si l'article a un successeur en vigueur le jour de l'abrogation. Les créations par une loi portent en général un lien CREE. **Correction en cours de calcul** : la saisie ancienne de LEGI attache le lien CODIFICATION de l'ordonnance d'origine du code (par exemple ordonnance n° 2000-1249 pour le CASF) à des articles créés bien plus tard par une loi (lien CREATION vers cette loi) ; on ne retient donc la codification que si le texte créateur est le texte codificateur, ou s'il n'y a pas de lien de création (`est_codification`). Avant cette correction, 97 % des créations de 2002-2007 passaient pour de la (re)codification ; après, 52 % pour la codification seule et 66 % avec la recodification. Contrôle : les textes porteurs du plus grand nombre de liens CODIFICATION par mandat sont bien des textes de codification (décret n° 2004-802, ordonnance n° 2007-329, ordonnance n° 2021-1574, etc.).
- **H6 — Stock.** Le stock à une date compte les articles dont une version valide est en vigueur ce jour-là (début inclus, fin exclue) et la somme de leurs mots.
- **H7 — Mots.** Texte de l'article (bloc CONTENU), balises retirées, découpé sur les blancs : même convention que `outils/droit/analyse_corpus.py` (`modeles/carte-du-droit/chiffres.md`). Les titres, notes et numéros ne sont pas comptés.
- **H8 — Parties.** Le préfixe du numéro : L (et LO), R, D, A ; « autre » pour les articles sans préfixe (Code général des impôts et ses annexes, quelques codes anciens).
- **H9 — Périmètre.** Les codes au sens de LEGI (chemin `code_en_vigueur` ou `code_non_vigueur` de l'archive) : 76 codes vivants en 2026, plus les codes abrogés. Les lois et décrets **non codifiés** (environ 55 % des mots du droit en vigueur selon le SGG) ne sont pas dans la mesure du flux.
- **H10 — Lois et décrets publiés.** Textes JORF par nature (LOI, ORDONNANCE, DECRET) et date de publication. Lois « article 53 » (autorisation de ratifier un traité) repérées dans le titre (« autorisant l'approbation / la ratification / l'adhésion ») ; décrets individuels (nominations, promotions, naturalisations, délégations…) repérés par une liste de formules du titre : **heuristique**, voir la comparaison au SGG.

## Code et tests

- `code/extraire.py` : lecture en flux des archives (bibliothèque standard, reprenable) ; environ 10 minutes sur le M5 pour les deux bases, en parallèle.
- `code/flux.py` : fonctions pures (`partie`, `version_valide`, `en_vigueur`, `chaines`, `evenements`, `mandat_de`, `agreger_evenements`, `stock`, `categorie_jorf`) et écriture des CSV (30 secondes).
- `code/comparer.py` : écarts avec le SGG.
- `tests/test_flux.py` : 16 tests, dont l'identité comptable « stock final − stock initial = créations − retraits » (en articles et en mots, sur des chaînes sans trou ; sur les données réelles l'écart est de 0 à 5 %, voir resultats.md), la détection d'une recodification et la règle de codification sur des cas réels (CGFP, CASF).

Reproduire : `python3 -I code/extraire.py legi && python3 -I code/extraire.py jorf && python3 -I code/flux.py && python3 -I code/comparer.py && python3 -I -m unittest discover -s tests`.

## Sorties (`resultats/`)

`par_mandat.csv` (mandat × partie : stocks, créations, modifications, abrogations, recodifications, mots), `par_mandat_et_code.csv` (mandat × code), `stock_annuel.csv` (stock au 1er janvier 2002-2026 et au 02/11/2026, par partie), `stock_codes_suivis_sgg.csv`, `evenements_par_annee.csv`, `jorf_par_mandat.csv`, `jorf_par_annee.csv`, `comparaison_sgg.csv`.
