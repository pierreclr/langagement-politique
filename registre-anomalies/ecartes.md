# Signalements écartés du registre

Détections de l'analyse statique (`sources/rules-as-code-analyse-statique.md`) qui n'ont pas été retenues, avec la raison. Un faux positif écarté est une information : il mesure la précision de l'outil.

## Faux positifs mesurés (échantillon de vérification du 02/11/2026)

| Détection | Raison de l'écart |
|---|---|
| Renvois « numéro réutilisé » : CCH R122-6, CGI 302 M (depuis CGI annexe III 111 H undecies), Code pénal 222-22 | Renumérotation à l'identique : le numéro cité existe encore en vigueur sous un autre identifiant (3 faux sur 4). |
| Cycles de report : CMF L313-29-2 et Code de procédure pénale 568-1 | Renvois réciproques sans circularité de définition (2 faux sur 5 ; 1 non tranché). |
| Code des douanes (renvois vers ses articles numériques) | Le fichier du Code des douanes sur codes.droit.org n'a aucun article numérique (1 à 500) : code exclu comme cible de renvois morts. |

## Signalements écartés à la relecture de ce registre (02/11/2026)

| Détection | Raison de l'écart |
|---|---|
| Code de l'urbanisme R*431-2 → CCH L. 111-7 et Code de l'urbanisme L240-2 → art. 176 du Code du domaine public fluvial | **Écart annulé le 02/11/2026 (correction)** : ces copies ne sont pas tronquées. Base LEGI complète : CCH L111-7 abrogé le 2021-07-01 (recodification du livre Ier du CCH) ; article 176 du code du domaine public fluvial abrogé le 2014-05-28. Ce sont de vrais renvois morts (voir `sources/rules-as-code-analyse-statique.md`, section « correction du 02/11 »). |

Conséquence pour l'outil (mise à jour du 02/11/2026) : `analyse_corpus.py` vérifie désormais les renvois contre l'index LEGI complet (`outils/droit/legi_complet.py`) et porte une garde « code tronqué » (copie locale < 90 % des articles en vigueur de LEGI) : sur les 78 codes, aucun n'est tronqué de façon significative (seul le Code disciplinaire et pénal de la marine marchande, 6 articles contre 7). `registre.py` garde son seuil de 100 articles. Le diagnostic « copie tronquée » du matin était une erreur de lecture : une absence signifiait ici abrogation ou recodification.

## Fiches « détectées » traitées le 03/11/2026 (T55) : écartées

| Fiche | Raison de l'écart |
|---|---|
| AN015 (articles « monstres ») | Statistique de longueur, pas une anomalie : déplacée vers [mesures.md](mesures.md), M1. |
| AN048 (chaîne de huit exceptions) | Mesure de complexité ; les renvois sont corrects : déplacée vers [mesures.md](mesures.md), M2. |
| AN026 (verrouillage de la détention) | Effet d'incitation voulu par le législateur (l'abattement pour durée encourage la détention) : choix de politique, non incohérence du texte ; calculs conservés dans [mesures.md](mesures.md), M3. |
| AN033 (cotisation maladie du non-résident, 3,2 à 4,2 % contre 8,3 % de CSG) | Le texte est cohérent : CSS L136-1 assujettit à la CSG les seules personnes « domiciliées en France pour l'établissement de l'impôt sur le revenu » et L131-9 prévoit expressément des « taux particuliers » pour celles qui ne remplissent pas la condition de résidence (relus le 03/11/2026). L'écart de taux est la conséquence assumée du critère de résidence fiscale ; les taux eux-mêmes (décret n° 2018-821, D242-8, D621-5) viennent d'un texte hors du corpus lu. Question de politique, pas défaut de rédaction. |
| AN034 (pension française au Maroc, double non-imposition) | Convention fiscale franco-marocaine hors du corpus de codes lu et non relue ; le Gouvernement a répondu (question écrite n° 31742, 2008) que le résultat est conforme aux principes de l'OCDE : partage des droits d'imposer voulu, non erreur. Non vérifiable sur le texte local ; pas d'estimation de manque à gagner. |

Précisions du même jour sur des fiches maintenues : AN032 abaissée de gravité haute à moyenne (la loi borne la participation à 5 % du plafond et prévoit une bande de 35 %) ; AN013 refixée à 2003 (date de création de l'article) ; AN010 corrigée (ELAN 140 prévoit un rapport d'évaluation).
