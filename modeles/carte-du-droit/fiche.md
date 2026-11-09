---
titre: La carte du droit : ce que le programme couvre du droit en vigueur
theme: décider
statut: brouillon ; dernier calcul le 06/11/2026
---

## La question

Pour chaque grand pan du droit codifié en vigueur, le programme a-t-il une position ou une mesure ? La carte sert à repérer ce qui n'a pas été traité et à dresser la liste des sujets à trancher. Ce n'est pas un modèle de calcul : c'est une donnée construite, ligne par ligne, par classement.

## Ce qui entre

- La structure des 78 codes en vigueur, lue dans les fichiers XML de la base officielle des codes (codes.droit.org, mise à jour du 03/11/2026) : 1 286 lignes (livre, partie ou titre de tête, puis subdivision suivante), avec le nombre d'articles en vigueur de chacune. Le script `sommaire.py` produit `sommaire.csv`.
- Le contenu du programme et de ses dossiers, interrogé par recherche de mots-clés.
- Ce qui n'entre pas : les lois et décrets non codifiés, les circulaires, les conventions collectives de branche, le droit européen, la jurisprudence.

## Comment il est construit

1. **Sommaire** : le script parcourt chaque code et compte, pour chaque subdivision de niveau 0 et 1, les articles à l'état « en vigueur ». Total : 165 655 articles ligne à ligne (la note chiffres.md donne 165 657, écart de 2 que je n'ai pas expliqué), soit 21,6 millions de mots.
2. **Classement en trois lots** : trois agents IA se partagent les 78 codes et classent chaque ligne, d'après son intitulé et des recherches de mots-clés. Aucun article n'est lu un par un ; aucun juriste n'a relu.
3. **Colonnes remplies pour chaque ligne** : sujet en mots simples ; couverture (traité, partiel, non traité, technique) ; où c'est traité ; effet du système proposé (supprimé, simplifié, inchangé, inconnu) ; question à trancher, avec une recommandation de l'IA ; priorité de 1 à 3.
4. **Synthèse** : regroupement par thème des sujets majeurs non traités.

Exemple : la ligne « Code électoral, livre Ier » (384 articles) est classée « partiel », effet « simplifié », priorité 1, avec la question de savoir quelles élections subsistent et avec quel mode de scrutin (carte-A.csv).

## L'hypothèse qui porte le résultat

La recherche par mots-clés : un sujet marqué « non traité » peut avoir une position écrite sous un autre vocabulaire. Dans le doute, les agents ont mis « partiel » ou « non traité ». Les chiffres de couverture sont donc des bornes imprécises, sans taux d'erreur mesuré.

## Ce que l'IA a choisi elle-même

Les 1 286 lignes, soit les trois classements de couverture, d'effet sur le système et de priorité, plus les questions et recommandations (une centaine). La part « technique » (413 lignes) est un jugement : « procédure ou détail sans enjeu politique propre ». Les lignes « Total de la section » comptent pour une ligne. Les deux versions d'un même livre (législatif et réglementaire) reçoivent le même classement. Une correction de l'IA est notée dans la synthèse (la Sécurité sociale à 100 % comptée « non tranchée » par un lot alors qu'elle l'est). Les trois lots ne se ressemblent pas : la part d'effets « inconnu » va de 36 % (lot B, 154 lignes sur 428) à 70 % (lot A, 302 sur 433), d'après un comptage des fichiers. Je n'ai pas vérifié si cela tient aux codes ou à la manière de classer de chaque agent.

## Ce qu'il ne fait pas

Il ne dit pas si une position est bonne, ni si un pan du droit est cohérent : le volume seul ne prouve pas l'incohérence. Il ne mesure pas le droit réellement applicable, nettement plus volumineux que les codes. Il ne dit pas combien de lois seraient à réécrire. Il ne remplace pas la relecture par un juriste.

## Ce qu'il donne

- 165 657 articles en vigueur, 21,6 millions de mots : environ 1 440 heures de lecture à 250 mots par minute (chiffres.md).
- Répartition par préfixe : 52 909 articles de loi, 72 019 de décret en Conseil d'État, 20 706 décrets simples, 2 854 arrêtés.
- Couverture sur 1 286 lignes : 90 traitées, 456 partielles, 327 non traitées, 413 techniques ; en articles de niveau 1 : 22 456, 87 446, 43 561 et 12 013 (synthese.md ; recompté à l'identique).
- Onze thèmes de sujets majeurs non traités : travail, santé, grand âge et handicap, logement, nationalité et asile, justice et sécurité, relations avec l'administration, institutions, économie, énergie, école (synthese.md).

## Comment le refaire

`python3 -I sommaire.py` depuis le dossier réécrit `sommaire.csv` ; il demande la copie locale des XML des codes, absente de cette copie. Je n'ai pas pu le relancer. Les décomptes de couverture se recalculent depuis `carte-A.csv`, `carte-B.csv` et `carte-C.csv` en comptant la colonne `couverture` : je l'ai fait. Le classement lui-même n'est pas reproductible à l'identique : il a été fait par des agents.
