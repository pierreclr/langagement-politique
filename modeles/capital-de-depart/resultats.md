---
titre: Capital de départ : résultats
tache: chantier 4 de la boucle « meilleur système »
date: 2026-11-03
statut: brouillon
---

# Capital de départ : résultats

Calculs : `rapport.js` (sortie complète : `resultats-brut.txt`), méthode et hypothèses : [`methode.md`](methode.md). Euros constants, croisière (une cohorte par an, 780 000 / 830 000 / 870 000 jeunes). Des ordres de grandeur, jamais des prédictions.

## Dix lignes

1. **Coût annuel en croisière [favorable / central / défavorable]** : A (10 000 € à 18 ans, universel, libre) **7,8 / 8,3 / 8,7 Md€** ; B (25 000 € à 25 ans, universel, fléché) **19,5 / 20,8 / 21,8** ; C (garantie de 40 000 € à 25 ans, dégressive à 50 % de l'héritage, libre) **10,1 / 11,5 / 13,0** ; C' (même garantie dégressive à 100 %) 6,1 / 7,8 / 9,9.
2. **Poids dans le budget** : de 0,7 à 1,6 point de taux plat au taux de 35 % du palier 1 d'origine (12,7 Md€ le point ; à 40,7 %, taux de la v5, un point vaut 10,8 Md€ au central : de 0,8 à 1,9 point, soit 1,36 point pour le central de 14,7 Md€) ; de 8 à 20 % des 103,5 Md€ d'héritage du palier 1 ; de 9 à 22 % de la taxe à 1 % (93 Md€). Le capital est donc **finançable**, mais pas gratuit : il entre en concurrence avec le taux plat pour la même recette.
3. **Le capital universel profite à tous les déciles de la même somme ; la garantie dégressive cible** : C verse 37 000 € au premier décile de patrimoine parental, 21 000 € au quatrième, 11 000 € au cinquième, 1 000 € au sixième, rien au-delà ; 53 % de la cohorte en reçoit (central), contre 100 % pour A et B.
4. **Le vrai problème n'est pas le capital, c'est l'impôt « 50 % dès le premier euro »** du palier 1 : le héritier médian (cinquième décile, 58 000 € reçus à vie) paierait 29 000 € d'impôt, soit plus que les 25 000 € de B. Avec ce régime, seuls 41 % de la cohorte sont gagnants nets de B. **Ce n'est pas « non confiscatoire » au sens de l'auteur.**
5. **Variante « héritage reçu à vie » (Atkinson, CAE) : exemption E par héritier, donations et héritages additionnés** (donation = héritage). À E = 100 000 € : 41 % de la cohorte paie, la recette tombe de 97,5 à 70,5 Md€ (fuite 35 %), soit −27 Md€ ou 2,1 points de taux plat ; avec C, 53 % de gagnants nets (B : 69 %).
6. **Paquet recommandé par Claude : C + « reçu à vie » à E = 100 000 €** : coût pour le budget **38,5 Md€ par an (3,0 points de taux plat)** par rapport au palier 1, dont 11,5 de capital. Variante moins chère : E = 50 000 € + C = 28,0 Md€ (2,2 points). Le taux marginal cumulé ne dépasse jamais 50 % (dégressivité de 0 à 80 000 €, impôt au-dessus de 100 000 €).
7. **Effets attendus** (littérature, § 4 de la méthode) : le capital crée de l'épargne (Child Trust Fund : 92 % de patrimoine financier positif contre 58 %) ; peu d'effet attendu sur la création d'entreprise (Hurst-Lusardi : relation plate sauf en haut de la distribution ; Holtz-Eakin et al. et Blanchflower-Oswald : liquidité) ; peu d'effet sur le travail (loteries suédoises : −0,11 par euro) ; aucune évaluation d'un capital de 10 à 40 k€ dans un pays riche. **Ne pas promettre « plus d'entreprises ».**
8. **Risques** : si 30 % de B finissent en apport immobilier, ≈ 12,5 Md€ de demande pour 185 Md€ de ventes annuelles, soit environ +7 % sur les prix (hypothèses non sourcées ; borne haute extrême : +34 %) ; d'où **ne pas flécher le logement** ; dissipation relativisée par la recherche (CAE) ; effet d'aubaine maximal pour A et B (versés aussi aux 50 % de jeunes les plus dotés).
9. **Calendrier** : l'impôt rend dès l'année 1 ; le versement de B et C commence à 25 ans, sept ans après A : une phase de plusieurs années d'excédent financeur, utilisable pour constituer un fonds ou réduire la dette.
10. **Limites** : taille de cohorte (population à 18 ans), distribution des héritages (log-normale calée sur CAE 2021, donnée fiscale de 2006), part de jeunes sans héritage (0 / 10 / 20 %, non sourcée), aucun effet de comportement, aucune évaluation de Singapour ni des baby bonds réels.

## Montants à intégrer comme option dans `modeles/systeme-ideal/`

| Option | Coût annuel [favorable / central / défavorable], Md€ | Points de taux plat (central) |
|---|---|---|
| A. 10 000 € à 18 ans | 7,8 / 8,3 / 8,7 | 0,7 |
| B. 25 000 € à 25 ans | 19,5 / 20,8 / 21,8 | 1,6 |
| **C. garantie de 40 000 € à 25 ans, dégressive à 50 %** | **10,1 / 11,5 / 13,0** | **0,9** |
| C'. dégressive à 100 % | 6,1 / 7,8 / 9,9 | 0,6 |
| « Reçu à vie » E = 50 000 € (recette perdue sur le palier 1, fuite 31 / 35 / 40 %) | 17,5 / 16,5 / 15,2 | 1,3 |
| « Reçu à vie » E = 100 000 € (recette perdue, fuite 31 / 35 / 40 %) | 28,6 / 27,0 / 24,9 | 2,1 |

Lecture : pour A, B, C, C' : favorable = cohorte basse et tous les jeunes reçoivent un héritage ; défavorable = cohorte haute et 20 % sans héritage. Pour les lignes « reçu à vie », ce sont des pertes de recette par rapport à « 50 % dès le premier euro » à fuite égale (31, 35, 40 %) : la perte baisse quand la fuite monte, parce qu'il y a moins de recette à perdre ; ces lignes ne s'ordonnent donc pas comme favorable / défavorable. Elles s'ajoutent au coût de A, B ou C.

## 1. Coût par variante

Voir le tableau. Sensibilités : C à 10,8 / 11,5 / 12,4 / 13,5 Md€ pour 0, 10, 20, 30 % de jeunes sans héritage ; C à 7,6 Md€ si les héritages sont 63 % plus élevés (flux macro de 300 Md€ au lieu du calage fiscal). **La garantie est plus chère quand la cohorte reçoit moins** ; elle est donc un indicateur d'incertitude plus qu'un coût.

## 2. Financement par l'impôt sur les transmissions

| Régime (taux 50 % au-dessus de l'exemption, fuite 31 / 35 / 40 %) | Part de la masse imposable | Part de la cohorte qui paie | Recette, Md€ |
|---|---|---|---|
| Flat dès le premier euro (palier 1) | 100 % | 100 % | 103,5 / 97,5 / 90,0 |
| Reçu à vie, E = 50 000 € | 83 % | 59 % | 86,0 / 81,0 / 74,8 |
| Reçu à vie, E = 100 000 € | 72 % | 41 % | 74,9 / 70,5 / 65,1 |
| Reçu à vie, E = 200 000 € | 58 % | 25 % | 60,5 / 57,0 / 52,6 |

Pour que le capital soit financé **à lui seul** par un impôt sur la part reçue au-dessus de 100 000 €, il faut un taux de 5,9 % (A), 14,7 % (B), 8,2 % (C) (fuite 35 %) : un taux bien plus bas que 50 %. Autrement dit, **le capital se finance par l'impôt à un taux faible ; ce qui coûte, c'est l'exemption qui rend l'impôt moins lourd pour les petits héritiers**.

## 3. Effet par décile de patrimoine des parents

Euros sur la vie, par jeune : héritage brut / impôt / capital / net (net = héritage − impôt + capital) ; hypothèse de rang H7 ; fuite ignorée.

| Décile | Héritage | Impôt, flat 50 % | Net, flat sans capital | Net, flat + B | Net, flat + C | Net, E=100 000 + C |
|---|---|---|---|---|---|---|
| D1 | 6 k | 3 k | 3 k | 28 k | 40 k | 43 k |
| D2 | 14 k | 7 k | 7 k | 32 k | 40 k | 47 k |
| D3 | 25 k | 13 k | 13 k | 38 k | 40 k | 53 k |
| D4 | 39 k | 19 k | 19 k | 44 k | 40 k | 59 k |
| D5 | 58 k | 29 k | 29 k | 54 k | 40 k | 69 k |
| D6 | 85 k | 43 k | 43 k | 68 k | 44 k | 86 k |
| D7 | 128 k | 64 k | 64 k | 89 k | 64 k | 114 k |
| D8 | 200 k | 100 k | 100 k | 125 k | 100 k | 150 k |
| D9 | 354 k | 177 k | 177 k | 202 k | 177 k | 227 k |
| D10 | 1 361 k | 681 k | 681 k | 706 k | 681 k | 731 k |

Le dixième décile reste le plus riche en net de très loin ; le capital et l'exemption n'abaissent pas l'écart entre D10 et D1 mais élèvent le plancher : D1 passe de 3 k à 40-43 k, un rapport D10/D1 de 227 à 17. Ces nombres supposent la concentration maximale (H7) ; une corrélation moins forte rapprocherait les déciles.

## 4. Paquets (coût pour le budget par rapport à « 50 % dès le premier euro », central, fuite 35 %)

| Exemption E | + A | + B | + C |
|---|---|---|---|
| 0 | 8,3 Md€ (0,7 pt) | 20,8 (1,6 pt) | 11,5 (0,9 pt) |
| 50 000 € | 24,8 (2,0) | 37,2 (2,9) | 28,0 (2,2) |
| 100 000 € | 35,3 (2,8) | 47,7 (3,8) | **38,5 (3,0)** |
| 200 000 € | 48,8 (3,8) | 61,3 (4,8) | 52,1 (4,1) |

## 5. Risque immobilier de B si fléché logement

Favorable : 3,1 Md€ de demande (1,7 % des ventes), +0,8 % de prix ; central : 12,5 Md€ (6,7 %), +6,7 % ; défavorable : 31,1 Md€ (16,8 %), +33,6 % (borne, cumul des extrêmes). Hypothèses H12-H14, non sourcées.

## Recommandation de Claude

**Tranché par Claude sur délégation (03/11), révisable.** **C : garantie de 40 000 € à 25 ans, dégressive à 50 % de l'héritage reçu ou attendu, libre (pas de flèchage), couplée à un impôt « reçu à vie » avec exemption de 100 000 € par héritier, donations et héritages additionnés.** Raisons :

1. C n'a un coût que de 11,5 Md€ (10,1-13,0) : la moitié de B, parce que les jeunes les mieux dotés n'en ont pas besoin ; 53 % de la cohorte en bénéficie, essentiellement ceux qui reçoivent peu ou rien (premier au cinquième décile).
2. Pas de flèchage : le CAE le déconseille et les études sur l'entrepreneuriat sont mitigées ; et flécher le logement risque de capitaliser le capital dans le prix des logements (6,7 % au central).
3. La dégressivité de 50 % et l'impôt de 50 % au-dessus de 100 000 € respectent le plafond fixé par l'auteur : le taux marginal cumulé ne dépasse jamais 50 %.
4. Le régime « reçu à vie » respecte « donation = héritage » : ni gain à donner tôt, ni avantage à ceux qui ont un patrimoine familial.
5. Prix : **38,5 Md€ par an, soit 3,0 points de taux plat** par rapport au palier 1 tel qu'il est écrit. **C'est le vrai dilemme à soumettre à l'auteur** : un palier 1 à « 50 % dès le premier euro » est incompatible avec « redistribuer sans confisquer » ; l'exemption de 100 000 € coûte 27 Md€ ; si l'on veut moins cher, E = 50 000 € (28,0 Md€, 2,2 points) ou la variante C' (7,8 Md€, dégressive à 100 %, au prix d'un taux implicite de 100 % sur les petits héritages, que Claude écarte).

**Ce que Claude ne sait pas** : l'effet réel d'un capital de cette taille sur le comportement des jeunes français ; la part de jeunes sans héritage ; la taille réelle de la cohorte éligible (nationalité, résidence) ; la réaction des familles aux seuils (donations déguisées, prêts, démembrement).
