---
titre: Capital de départ pour les jeunes : coût et financement
theme: contribuer
statut: relu de façon adverse ; dernier calcul du 03/11/2026
---

## La question

Ce modèle date du 3 novembre 2026 et chiffre un capital versé en argent. La règle retenue depuis le 9 novembre est différente : le capital n'est plus versé en argent, il devient un apport dans l'achat du logement. Les chiffres de coût de ce modèle restent un repère, pas le chiffre du programme. Le modèle à jour pour la forme « apport » est `fonciere-afflux`.

Le modèle cherche à savoir ce que coûterait un capital offert à chaque jeune, combien de jeunes en bénéficieraient, et si une réforme de l'impôt sur les héritages pourrait le financer.

## Ce qui entre

- Taille d'une génération : 780 000 / 830 000 / 870 000 jeunes (Eurostat, population de 2024 par âge : statistique publique).
- Héritages reçus à vie : médiane de 70 000 €, moins de 10 % au-dessus de 500 000 € (étude du Conseil d'analyse économique, 2021, donnée fiscale de 2006).
- Flux annuel de successions et donations : 300 Md€ (même étude, ordre de grandeur).
- Droits de succession actuels : 20,8 Md€.
- Hypothèses de l'IA : part des jeunes sans héritage (0 / 10 / 20 %), lien entre héritage et patrimoine des parents, effets sur l'immobilier.

## Comment il calcule

1. **Les héritages.** On suppose qu'ils suivent une loi log-normale (beaucoup de petits, quelques très gros), calée sur la médiane et le dixième supérieur. On en tire un héritage pour chaque rang dans la génération.
2. **Le capital.** Quatre variantes : A (10 000 € à 18 ans, pour tous), B (25 000 € à 25 ans, pour tous, fléché), C (garantie de 40 000 € à 25 ans, diminuée de 50 % de l'héritage : capital = max(0 ; 40 000 − 0,5 × héritage)), C' (diminuée de 100 %).
3. **Le coût.** Coût = taille de la génération × capital moyen. Pour C, le capital moyen est de 13 897 €, soit 11,5 Md€ pour 830 000 jeunes.
4. **Le financement.** Recette de l'impôt = flux × part imposable × 50 % × (1 − fuite). La fuite (31 à 40 %) est la part qui échappe à l'impôt.
5. **Une forme lisse.** Pour éviter un coude à 80 000 €, un second fichier remplace C par capital = 40 000 € × e^(−héritage / K). Avec K = 80 000 €, le coût passe à 13,3 / 14,7 / 16,1 Md€, d'après le modèle `systeme-ideal`.

Exemple : un jeune dont l'héritage vaut 70 000 € (la médiane) reçoit 5 000 € avec la variante C. Avec la forme lisse de la règle actuelle (K = 80 000 €), il reçoit 16 674 €. Calcul refait à la main.

## L'hypothèse qui porte le résultat

**La loi des héritages et la part de jeunes qui ne reçoivent rien** (H2, H3). La garantie coûte d'autant plus que la génération reçoit peu : C passe de 10,8 à 13,5 Md€ quand la part sans héritage passe de 0 à 30 %. Si les héritages sont 63 % plus élevés (flux de 300 Md€ au lieu du calage fiscal), C tombe à 7,6 Md€ (resultats.md, section 1). La part sans héritage (10 % au central) n'a pas de source.

## Ce que l'IA a choisi elle-même

Une dizaine de choix, relevés à la main dans methode.md :

- Plafond de 50 % sur les transmissions, tous impôts confondus : « tranché par Claude ».
- H1 : les trois tailles de génération.
- H3 : 0 / 10 / 20 % de jeunes sans héritage, source non trouvée. Plus c'est haut, plus la garantie coûte.
- H7 : l'héritage suit le rang du patrimoine des parents (borne haute de la concentration).
- H11, H15, H16 : pas de rendement du capital, pas d'effet sur le travail ni sur l'exil.
- H12 à H14 : si le capital finit en apport immobilier, 30 % de B, deux fois plus de demande par euro, élasticité de 1 : non sourcés.
- La recommandation finale (C avec un impôt « reçu à vie » à 100 000 €) est « tranchée par Claude sur délégation, révisable ».
- Le coefficient K des formes lisses.

## Ce qu'il ne fait pas

- Il ne chiffre pas la règle actuelle (apport dans un logement). Le coût de la même mesure est donné à quatre valeurs selon les endroits : 15 Md€ (13,3 à 16,1), 14,7, 11,5 et 9,3 selon la règle.
- Aucun effet de comportement : donations avant la loi, exil, gel des transmissions.
- Aucune évaluation d'un capital de 10 à 40 k€ dans un pays riche n'existe. Ne pas promettre « plus d'entreprises ».
- La part qui peut y accéder (nationalité, résidence) n'est pas modélisée.
- Si le capital n'est accessible que par la foncière, il cesse d'être universel. C'est un point ouvert : universel, ou réservé à qui entre dans la foncière avec deux formes adossées à l'étude.

## Ce qu'il donne

- Coût annuel en croisière [favorable / central / défavorable] : A 7,8 / 8,3 / 8,7 Md€ ; B 19,5 / 20,8 / 21,8 ; C 10,1 / 11,5 / 13,0 ; C' 6,1 / 7,8 / 9,9 (resultats.md, « Dix lignes », point 1).
- La garantie C verse 37 000 € au premier dixième du patrimoine parental, 11 000 € au cinquième, rien au-delà du sixième ; 53 % d'une génération en reçoit (point 3).
- Un impôt à 50 % dès le premier euro ferait payer 29 000 € à l'héritier médian, plus que le capital B : seuls 41 % seraient gagnants nets (point 4).
- Avec une exemption de 100 000 € par héritier, la recette tombe de 97,5 à 70,5 Md€ (point 5).
- Si 30 % de B finissent en apport immobilier : environ +7 % sur les prix, jusqu'à +34 % en cumulant les extrêmes (section 5).

## Comment le refaire

Depuis le dossier du modèle, avec l'interpréteur JavaScript du système :

- `jsc modele.js test.js` : 20 contrôles, tous passent (lancé le 9 novembre 2026).
- `jsc modele.js continu.js test_continu.js` : passe aussi ; la méthode annonce 46 contrôles, le programme en affiche 69.
- `jsc modele.js rapport.js` : régénère les chiffres (non relancé ici).
