---
titre: Tests de résistance du système
theme: comptes et dette
statut: brouillon ; résultats commentés datés du 3 novembre 2026 (sortie brute régénérée depuis, voir « Point à vérifier »)
---

## La question
Que devient la dette publique sur dix ans si le système proposé subit un choc : récession, hausse des taux, krach immobilier ou boursier, départ des grandes fortunes, panne informatique, vieillissement plus rapide ? Et les garde-fous prévus (marge de taux, baisse temporaire du socle, réserve) suffisent-ils ? Le modèle sert à classer les risques et à dimensionner les garde-fous, pas à prédire.

## Ce qui entre
- Dette publique fin 2025 : 3 460,5 Md€, soit 115,7 % du produit intérieur brut (statistique publique, Insee, mai 2026). Charge d'intérêts 2025 : 65,7 Md€ (Insee).
- Taux de l'État à dix ans : 3,45 % (relevé début 2026), fixe dans tous les calculs sauf les chocs de taux.
- Croissance nominale de 3 % par an (1,2 % en volume, 1,8 % d'inflation) : hypothèse.
- Sensibilité du solde public à la conjoncture : 0,63 point de produit intérieur brut par point d'écart de production pour le droit actuel (étude de la Commission européenne, lue de seconde main) ; 0,53 pour le nouveau système (estimation de l'IA).
- Le solde « de croisière » de chaque version du système (palier 1, chemin à 40 %, architecture du 3 novembre…) vient du modèle du système idéal tel qu'il était à cette date.
- Les chocs eux-mêmes (ampleur d'une récession type 2009, krach de −20 %, exil, panne) : hypothèses numérotées R6, R16, R18, R19, R21, R22, R34.

## Comment il calcule
1. **Point de départ.** Les années 2026 à 2028 se passent au droit actuel (déficit de 169,1 Md€ mis à l'échelle de l'économie). La dette atteint 4 037 Md€, 123,5 % du produit intérieur brut, au début de 2029, année 1 du système.
2. **Solde hors intérêts de l'année t** = (solde de croisière de la version testée + gains attendus de la « création de valeur », dont la croissance par l'intelligence artificielle − coût de transition la première année − part de la taxe sur le patrimoine encaissée en retard + intérêts de 2025) × taille de l'économie l'année t. On ajoute les intérêts de 2025 parce que le solde de croisière les contient déjà ; on les recalcule ensuite.
3. **Taux moyen de la dette.** Il part de 1,9 % (65,7 / 3 460,5) et rejoint le taux de marché d'un huitième de l'écart chaque année (durée de vie moyenne de la dette : 8 ans). Intérêts de l'année = taux moyen × dette.
4. **Choc.** On ajoute la perte du choc au solde. Pour une récession, perte = sensibilité × écart de production × produit intérieur brut ; l'écart vaut −4,1 %, −3,4 %, −2,4 %, −1,2 % puis 0 sur cinq ans.
5. **Dette.** Dette de l'année = dette de l'année d'avant − (solde hors intérêts − intérêts + choc + correction des garde-fous). Le ratio se calcule sur le produit intérieur brut de l'année, récession comprise.
6. **Garde-fous**, avec un an de retard : on corrige le manque constaté l'année précédente, d'abord par une hausse du taux plat d'au plus 2 points, puis par une baisse du socle d'au plus 150 € par mois. Ce qui reste est le « manque résiduel ».
7. **Réserve nécessaire** = cumul du manque des trois premières années.

Exemple (sortie brute, chemin « 40 % / 500 € » avec taxe nette de dettes, scénario central) : sans choc, la dette passe de 123,5 % en 2029 à 114 % à cinq ans et 104 % à dix ans. Une hausse des taux de 1 point coûte 4,3 Md€ la première année (4 037 / 8 × 1 %) et 34,6 Md€ à plein régime ; à dix ans, la dette monte de 5,4 points.

## L'hypothèse qui porte le résultat
**Le niveau du scénario, puis le taux fixe.** Au scénario central (réactions moyennes des contribuables), les versions testées ramènent la dette vers 97 à 104 % en dix ans (sauf le palier 1 seul, 133 %). Au scénario haut (réactions fortes), aucune ne tient, même sans choc : 150 à 171 % (sortie brute). Les garde-fous valent au plus 76 Md€ par an au haut, pour un déficit de 240 à 420 Md€ : ils ne rattrapent pas un mauvais scénario, seulement des chocs de 20 à 80 Md€.
Le taux de 3,45 % ne réagit pas à la dette (limite R26, que la méthode juge elle-même « le risque le plus sous-estimé »). Avec +1 point, la dette à dix ans gagne 5,4 points ; avec +2 points, 11 points (résultats.md, § 1). Le modèle de taux qui suit la dette, publié à part, montre que ce n'est pas un cas d'école.

## Ce que l'IA a choisi elle-même
Treize hypothèses sont posées par l'IA sans source qui tranche : R4 (durée de vie de la dette, 8 ans), R6 (forme de la récession, chiffres de 2009 cités de mémoire), R8 (sensibilité du nouveau système, 0,53), R13 (trois ans au droit actuel avant le départ), R14 (le solde suit l'économie), R16 (forme et durée des krachs), R18 (krach boursier réparti entre titres), R19 (exil « doublé »), R20 (part des salariés), R21 (panne : 90 % des recettes recouvrées), R23 (garde-fous à un an de retard), R24 (clause sur le solde corrigé de la conjoncture), R34 (exil « défendable »). La croissance de 3 % (R5) vient d'un autre document du dépôt, lui aussi écrit par l'IA. Le ratio de 1,1 cotisant par retraité en 2060 (R22) a été demandé par l'auteur.
Sens connus : R8 rend le nouveau système un peu moins stabilisant que l'actuel (défavorable au système). R19 est le choix le plus lourd : la fuite des héritages compte pour −51 Md€ sur −77 ; sans elle, le choc d'exil tombe à −26 Md€. R13 fait partir tout le monde d'une dette plus haute. La méthode note le risque de complaisance (le système est celui de l'auteur) et place les chocs qui le cassent en premier.

## Ce qu'il ne fait pas
- Il ne teste pas la version du 8 novembre du système : les versions testées sont celles du 3 novembre (palier 1, chemins à 40 %, architectures v2 et v3).
- Pas de prime de risque : le taux de marché ne dépend pas du déficit (R26).
- Pas d'effet multiplicateur : baisser le socle en récession n'aggrave pas la récession dans le modèle (R25).
- Chocs additifs, sans interaction, sauf deux combinaisons (R27). Le vieillissement ne réduit pas la croissance (R22), ce qui sous-estime le choc.
- Pas d'effet d'un krach sur les banques.
- **Point à vérifier.** Le commentaire (resultats.md) et la sortie brute (resultats-brut.txt, qui « fait foi ») ne donnent plus les mêmes chiffres : chemin à 40 %, solde à dix ans +7,6 Md€ et dette 95 % dans le commentaire, −4,2 Md€ et 97 % dans la sortie brute ; variante recommandée −35,3 contre −44,1 Md€, 103 % contre 104 %. La sortie brute a été régénérée après des changements du modèle du système idéal ; le commentaire n'a pas suivi. La méthode annonce aussi une architecture v4 et 377 contrôles, absentes de la sortie brute.

## Ce qu'il donne
- Sans choc, dette à dix ans au central : 97 % (chemin à 40 %), 104 % (variante recommandée), 133 % (palier 1), contre 157 % au droit actuel ; au haut, 150 à 171 % (resultats-brut.txt, « Trajectoires sans choc »).
- Récession type 2009 : −73 Md€ la première année pour le nouveau système, −87 au droit actuel ; le socle stabilise environ 16 % moins (resultats-brut.txt, « Détails » ; resultats.md, § 3).
- Krach immobilier de −20 % : environ −28 Md€ par an pendant trois ans (taxe −15,6, droits de succession −12,2) ; réserve nécessaire de l'ordre de 100 Md€, environ 3 % du produit intérieur brut (resultats-brut.txt, « Détails » et « Synthèse »).
- Exil des grandes fortunes « doublé » : −77 Md€ par an, +26 points de dette à dix ans ; au haut de la fourchette jugée défendable, −24,7 Md€ par an et +8,3 points pour l'architecture du 3 novembre (resultats-brut.txt, « Détails » et « Architecture finale v2 »).
- Démographie à 1,1 cotisant par retraité : 3,8 % du produit intérieur brut en 2060 pour garder le niveau des pensions, ou une baisse de 22 % de leur taux de remplacement (resultats-brut.txt, fin de la « Synthèse »).
- Au scénario haut, aucun garde-fou ne suffit ; d'où la règle proposée de ne pas lancer le système tant que l'on n'est pas plus près du central que du haut (resultats.md, § 4).

## Comment le refaire
Depuis le dossier du modèle du système idéal, sous bash (en zsh, la liste doit être découpée) :
```
J=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
L="modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../risques/stress.js"
$J $L ../risques/test_stress.js
```
Relancé le 9 novembre 2026 : 268 contrôles, 0 échec, en 12 secondes. La liste longue (avec l'architecture du 3 novembre) et la commande qui régénère resultats-brut.txt sont dans methode.md, § 4 ; elles n'ont pas été relancées ici.
