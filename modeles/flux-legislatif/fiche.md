---
titre: Le flux législatif : ce que chaque mandat ajoute aux codes
theme: État
statut: relu de façon adverse ; dernier calcul le 09/11/2026 (données au 02/11/2026)
---

## La question

Pour chaque mandat présidentiel depuis 2002, combien d'articles de codes ont été créés, modifiés et abrogés, combien de mots étaient en vigueur au début et à la fin, et quels codes ont le plus grossi ? Un petit pilote réécrit en outre un chapitre du Code du travail pour tester une réécriture « à droit constant ». Attention : les chiffres ne portent que sur les codes, soit environ 45 % des mots du droit en vigueur.

## Ce qui entre

- Base LEGI de la Direction de l'information légale et administrative : chaque version d'article avec ses dates de vigueur, son état et ses liens ; 1 830 895 versions, dont 526 814 de codes. Donnée publique, plus un calcul du nombre de mots.
- Base JORF : 1 277 813 textes publiés (nature, date, titre).
- Indicateurs du Secrétariat général du Gouvernement (4 mai 2026), pour la comparaison. Leurs tableaux sont des images : les valeurs ont été recopiées à la main, ce qui demande une relecture.
- Le dernier mandat est arrêté au 02/11/2026 (4,5 ans).

## Comment il calcule

1. **Un article** est la chaîne de ses versions successives, hors versions sans date valide.
2. **Événements** : création = début de la première version ; modification = début de chaque version suivante ; abrogation = fin de la dernière version ; transfert = renumérotation. Chaque événement est daté de son **entrée en vigueur**, pas du vote.
3. **Droit nouveau** : une création n'en est pas une si l'article est lié à un article en vigueur la veille (recodification) ou si sa première version est liée à une ordonnance ou un décret de codification (droit déjà en vigueur hors des codes, versé dans les codes). C'est une heuristique sur les liens de la base.
4. **Stock** : à une date, les articles dont une version valide est en vigueur, et la somme de leurs mots (texte de l'article, sans titres, notes ni tableaux).
5. **Attribution** au mandat en cours à l'entrée en vigueur. Un contrôle compare le solde (créés − abrogés ou transférés) à la variation du stock.

Exemple (resultats.md) : sous Macron 1, 26 488 articles créés dont 16 121 de droit nouveau, 16 588 abrogés ou transférés dont 12 357 hors recodification. Solde hors recodification : 16 121 − 12 357 = +3 764 articles.

## L'hypothèse qui porte le résultat

La règle qui sépare le droit nouveau de la codification et recodification (H5). Elle a été corrigée en cours de calcul : avant la correction, 97 % des créations de 2002-2007 passaient pour de la codification ; après, 66 % avec la recodification. Elle n'a été contrôlée que sur huit cas connus. Si elle est fausse, la part du « droit déjà là » change, pas le stock total.

## Ce que l'IA a choisi elle-même

Dix conventions numérotées (H1 à H10), dont deux heuristiques : la règle de codification (H5) et le repérage des traités et des décrets individuels par le titre (H10). Aussi : dater à l'entrée en vigueur (H3), les dates de mandat (H4), compter les mots du seul texte de l'article (H7), se limiter aux codes (H9). Dans le pilote, l'IA a écrit à la fois le droit actuel et la réécriture, et marqué trois interprétations comme à vérifier.

## Ce qu'il ne fait pas

- Il ne mesure que les codes, environ 45 % des mots du droit. Le droit total pèse 48,8 millions de mots selon le Secrétariat général, dont 26,1 hors des codes.
- Une part de la hausse est de la codification : du droit déjà en vigueur hors des codes y est versé (66 % des créations sous le premier mandat de la période, 39 à 47 % ensuite).
- « Aucun mandat n'a réduit le volume » n'est établi que pour les codes. Les abrogations de textes non codifiés ne sont pas mesurées. Le volume ne prouve pas l'incohérence.
- Rattachement à l'entrée en vigueur, avec décalage ; le droit européen transposé est inclus. Solde net et variation du stock diffèrent de 0 à 5 %.
- **Pilote.** Il passe de 33 articles et 1 666 mots à 6 articles et environ 420 mots, sur le chapitre « Conséquences du licenciement ». Avec toutes les options éteintes, la réécriture donne exactement le droit actuel dans les 3 328 situations testées. Mais ces situations sont des combinaisons de valeurs choisies, non un échantillon de salariés. Le droit actuel est une lecture non juriste, écrite par la même IA, et les deux fonctions partagent des briques de calcul (ancienneté, salaire de référence, barème) : le test montre une cohérence interne, pas une équivalence juridique. Aucun juriste n'a relu.

## Ce qu'il donne

- Les codes passent de 68 932 articles et 7,3 millions de mots (17/05/2002) à 165 388 articles et 21,55 millions de mots (02/11/2026) : ×2,4 en articles, ×3,0 en mots (resultats.md, « L'essentiel »).
- Chaque mandat crée de 1,6 à 2,9 articles pour 1 abrogé ou transféré et ajoute de 0,45 à 0,72 million de mots par an (resultats.md, tableau par mandat).
- Solde hors codification : +5 300 (Chirac 2), +13 200 (Sarkozy), +12 300 (Hollande), +3 800 (Macron 1), +4 900 (Macron 2, 4,5 ans).
- Pilote : 496 situations gagnantes, 104 perdantes (Alsace-Moselle), 2 720 changées dans la forme seule (pilote-licenciement/reecriture.md).

## Comment le refaire

Depuis le dossier : `python3 -I -m unittest discover -s tests` (16 tests, passent) et `python3 -I -m unittest discover -s pilote-licenciement/tests` (17 tests, passent). Le calcul des flux demande `code/extraire.py`, `code/flux.py`, `code/comparer.py` et les archives LEGI et JORF locales (environ 10 minutes) : absentes de cette copie, je n'ai pas pu le relancer.
