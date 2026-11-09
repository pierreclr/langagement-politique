---
titre: Sécurité et justice : la chaîne pénale et ses options
theme: protéger
statut: brouillon ; dernier calcul le 03/11/2026
---

## La question

Où se perdent les affaires entre la plainte et la peine exécutée ? Que coûterait chacune des options discutées (plus de places de prison, bracelet à la place des courtes peines, travail en prison, plus de police, éloignement anticipé d'étrangers condamnés, procédure pénale numérique) et que donnerait-elle, d'après la littérature ?

## Ce qui entre

- Statistiques publiques du ministère de la Justice (Chiffres clés 2026 : chaîne pénale 2025, détention au 1er janvier 2026, budget) et base des faits enregistrés par la police et la gendarmerie (2025).
- Des coûts trouvés par recherche en ligne : coût d'une journée de détention (105, 117 ou 130 €), coût d'une place neuve (350 000, 270 000 ou 200 000 €), plan numérique de la justice (530 M€). Ils n'ont pas été confirmés à la source.
- Des effets tirés de la littérature, cités de mémoire et non relus : effet de la police sur le crime (élasticité de −0,34 pour les crimes violents, −0,17 pour les atteintes aux biens), effet de la prison supplémentaire, effet du bracelet sur la récidive.
- Règle du modèle : aucune donnée par origine, religion ou quartier. La nationalité enregistrée n'entre que par deux totaux officiels.

## Comment il calcule

1. **Entonnoir.** Rapports successifs : affaires sans auteur (59,6 %), mis en cause poursuivables (63,3 %), réponse pénale (87,8 %), condamnés sur mis en cause (22,8 %). Les unités diffèrent (personnes, condamnations) : ce sont des ordres de grandeur de pertes, pas un suivi de cohorte.
2. **Places manquantes** = détenus / densité cible − places. Au 1er janvier 2026 : 84 741 / 1,00 − 62 284 = 22 457 places. Coût = annuité de l'investissement (40 ans, 3 %) + fonctionnement variable.
3. **Courtes peines.** Détenus à 1 an ou moins : 11 278. Au central, 40 % passent au bracelet : 4 511 places libérées. Gain net = 4 511 × 117 € × 0,5 (part évitable) × 365 − 4 511 × 25 € × 365, soit +55 M€ par an.
4. **Police.** Faits évités = −élasticité × hausse (10 %) × faits enregistrés. Coût : 25 000 agents × 65 000 €, soit 1 625 M€.
5. **Prison supplémentaire, travail, éloignement, numérique** suivent le même schéma : un coût, un nombre de personnes ou de faits touchés, un effet multiplié par une valeur de la littérature.
6. **Numérique.** ETP libérés = procédures (1,71 M) × minutes gagnées / 60 / 1 607 heures.

## L'hypothèse qui porte le résultat

La part du coût journalier de détention qui est réellement évitée quand une personne sort (0,3 / 0,5 / 0,8). Une journée de moins ne ferme pas une aile : seule une part est économisée. Si elle est de 0,3, le bracelet donne −7 M€ au lieu de +55 M€ (resultats.md, § 3). Pour police et prison, ce sont les élasticités américaines transposées à la France qui portent tout : elles sont citées de mémoire.

## Ce que l'IA a choisi elle-même

La méthode numérote 26 hypothèses. Onze sont posées sans source : part évitable du coût (H7), coût de la place neuve (H9), amortissement et cible de densité (H10, H11), surcoût d'un poste de travail (H12), part de courtes peines converties (H14), part d'étrangers éloignables et restant à purger (H17, H18), minutes gagnées (H20), part du délai due au papier (H21), coût d'un agent (H22). Onze autres sont signalées comme non confirmées (coût journalier, élasticités, récidive). L'IA a aussi sommé des unités différentes pour définir les faits « violents » et « biens » (H8), et déduit la ventilation du budget de l'ordre des chiffres d'un PDF (H5). La plupart des choix de gains sont dits prudents au « bas » et optimistes au « haut » : « bas » ne veut pas dire peu de crimes.

## Ce qu'il ne fait pas

Pas de coût social du crime (victimes, santé, travail perdu) : sans lui, le « coût par fait évité » ne se compare à aucun bénéfice. Pas d'incapacitation perdue quand une personne est sous bracelet. Pas de détention provisoire, de justice des mineurs, de sites pénitentiaires ouverts. Flux d'entrées supposé constant : les places neuves pourraient se remplir. L'entonnoir mélange des unités.

## Ce qu'il donne

- Affaires sans auteur : 59,6 % ; réponse pénale 87,8 % une fois l'auteur identifié (resultats.md, § 1).
- Densité carcérale : 136,1 % au 1er janvier 2026 ; 22 457 places à créer pour 100 % (§ 2).
- Construire pour 100 % : 4,5 à 7,9 Md€ d'investissement (§ 3).
- Courtes peines vers bracelet : 2 256 / 4 511 / 6 767 places, gain net −7 / +55 / +220 M€ par an.
- Police +10 % : 1 625 M€, 19 800 à 60 000 faits évités, 27 000 à 82 000 € par fait évité.
- Éloignement anticipé : gain net −1 / +14 / +106 M€ ; numérique : 178 à 711 ETP, valeur 9 à 36 M€ contre un plan de 530 M€ (borne haute).

## Comment le refaire

Depuis le dossier : `python3 -m unittest test_modele -v` (33 tests, passent) puis `python3 rapport.py`, qui produit les tableaux de resultats.md. Les données légères sont dans `donnees/`.
