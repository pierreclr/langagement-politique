---
titre: Éducation : un tuteur IA à l'école et le supérieur
theme: construire
statut: brouillon ; dernier calcul le 03/11/2026
---

## La question

Que coûte l'éducation aujourd'hui, et que coûterait un tuteur IA proposé à tous les élèves ? Que devient alors le besoin en enseignants ? Le modèle chiffre aussi une variante où des surveillants, et non des enseignants, encadrent le tuteur, et le coût d'un supérieur où l'on apprend librement et où l'on certifie de façon exigeante.

## Ce qui entre

- Statistiques publiques (ministère de l'Éducation, 2025) : dépense intérieure d'éducation de 199,2 Md€, élèves (6,155 M au premier degré, 5,6 M au second), coût par élève et par étudiant, 756 000 enseignants en équivalent temps plein.
- Études citées pour l'effet du tuteur : un essai au Nigeria (+0,29 écart-type), un essai en Turquie où un robot de conversation sans garde-fous fait baisser l'examen sans l'outil, des méta-analyses du tutorat humain (0,29). Elles ont été lues dans des résumés, pas dans leur texte complet.
- Hypothèses : prix de la licence (15, 60 ou 200 € par élève et par an), matériel, nombre d'élèves par adulte, part du temps d'enseignement que le tuteur reprend, effet du tuteur (0, 0,15 ou 0,30 écart-type).

## Comment il calcule

1. **Dépense aujourd'hui.** Pour chaque niveau : nombre d'élèves multiplié par le coût d'un élève. Le total (165,2 Md€) est comparé à la dépense totale (199,2 Md€) : il reste 34 Md€ non expliqués (formation continue, effectifs plus larges).
2. **Coût du tuteur par élève.** Licence, plus matériel divisé par sa durée d'amortissement, plus un adulte : 35 000 € divisés par le nombre d'élèves qu'il suit. Au scénario central : 60 + 300/4 + 35 000/100 = 485 € par élève et par an. Multiplié par 11,78 M d'élèves, cela donne 5,7 Md€ par an.
3. **Coût d'un dixième d'écart-type.** Coût par élève divisé par (effet / 0,1) : 323 € au central, contre 517 € pour du tutorat humain intensif.
4. **Enseignants.** Heures reprises par le tuteur : 756 000 × part de temps libéré (0, 5 ou 15 %). Excès dû à la baisse du nombre d'élèves : 756 000 × 1,7 M / 11,78 M, soit 109 138 postes. Les années nécessaires pour tout absorber sans licenciement se calculent avec un taux de départ de 3 % par an : de 5,1 à 11,4 ans.
5. **Variante surveillants.** Un assistant d'éducation coûte 1 801,74 € bruts par mois × 12 × 1,40 = 30 269 € par an. On remplace l'adulte par ce coût divisé par 200, 100 ou 50 élèves.
6. **Supérieur.** Économie = étudiants × coût × 60 % (part de l'enseignement) × part en ligne × réduction de coût. On retire le coût des abandons en plus et celui d'une certification surveillée. Solde central : +2,58 Md€ par an.
7. **Expérimentation.** Nombre d'établissements par groupe pour détecter un effet donné, selon une formule d'essai en grappes.

## L'hypothèse qui porte le résultat

Le nombre d'élèves par adulte (1 pour 100 au central). Il fait 72 % du coût du tuteur central. Au ratio 1 pour 200, le tuteur surveillé coûte 3,37 Md€ au lieu de 5,15 ; au ratio 1 pour 50, 8,72 Md€ (resultats.md, § 2). Cette valeur n'a pas de source. Pour le supérieur, c'est la baisse de coût de l'enseignement en ligne (20 à 60 %), également sans source.

## Ce que l'IA a choisi elle-même

Une quinzaine de valeurs sont posées par l'IA sans source qui tranche : coût du matériel (H7), un adulte pour N élèves (H8), coût de 1 500 € du tutorat humain (H10), part du temps repris par le tuteur (H14), taux de départ de 3 % (H16), entrants en première année (H17), part de l'enseignement dans le coût étudiant (H18), part et coût de l'enseignement en ligne (H19), certification (H21), coefficient de charges de 1,40 (H22), élèves par surveillant (H23), paramètres de l'expérimentation (H25). Elle a aussi décidé que le tuteur s'ajoute à l'école actuelle (H12), et fixé des seuils de décision (effet du surveillant au moins la moitié de celui d'un enseignant, et au moins +0,10 écart-type sur l'enseignement actuel). La plupart poussent le coût vers le haut (adulte, matériel). Les valeurs du supérieur poussent l'économie vers le haut.

## Ce qu'il ne fait pas

Il ne mesure pas l'effet selon l'origine sociale, ni l'effet sur l'emploi ou la croissance. Il ne chiffre ni le chèque éducation, ni l'université ouverte à tous (places d'accueil). Le coût du surveillant tombe dès la première année alors que les postes se libèrent sur dix ans : ce décalage n'est pas modélisé. Aucune étude ne compare un tuteur avec surveillant et un tuteur avec enseignant. Le choix des établissements n'est pas chiffré.

## Ce qu'il donne

- Tuteur central : 485 € par élève, 5,7 Md€ par an (0,2 à 12,4 selon les scénarios), soit 2,9 % de la dépense d'éducation (resultats.md, § 2).
- Variante surveillants : 1,96 / 5,15 / 11,25 Md€ par an (resultats.md, dix lignes, n° 3). À ratio égal, le surveillant ne fait gagner que 8 à 11 %.
- Non-remplacement des 109 000 postes : 2,2 / 3,9 / 5,5 Md€ d'économie par an à dix ans. Net avec tuteur surveillé : +0,24 / −1,25 / −5,75 Md€.
- Supérieur : solde de +1,38 / +2,58 / +1,47 Md€ par an (resultats.md, § 4).
- Protocole : 35 établissements par groupe détectent 0,15 écart-type ; 78 détectent 0,10 ; environ 32 à 75 M€ au total.

## Comment le refaire

Depuis le dossier du modèle : `python3 -m unittest test_modele` (20 tests, passent) puis `python3 modele.py`, qui affiche les chiffres de resultats.md (vérifiés : mêmes valeurs). Aucune donnée lourde n'est nécessaire. Une divergence : la méthode (§ 5) écrit 730 000 enseignants pour le calcul des postes libérés, alors que le code et les résultats utilisent 756 000.
