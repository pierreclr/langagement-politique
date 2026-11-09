---
titre: Afflux vers la foncière et effets sur les prix — résultats
statut: brouillon ; généré par code/calculer.py ; ne pas éditer à la main ; des ordres de grandeur sous hypothèses, jamais des prédictions
---

# Afflux vers la foncière et effets sur les prix : résultats

**Écrit par Claude (IA d'Anthropic) pour l'auteur.** Généré le 09/11/2026 par `python3 -I modeles/fonciere-afflux/code/calculer.py`. Méthode et hypothèses numérotées H-FA1 à H-FA60 : `methode.md` ; valeurs et sources : `donnees/parametres.json`. Euros de 2026.

**Précaution de méthode.** Ce modèle ne présente jamais une hausse des prix comme un avantage sans dire qui la paie et qui en profite. Claude, qui l'a écrit, est un modèle d'Anthropic ; il n'a pas d'intérêt financier connu dans le logement, mais il a tendance à vouloir aider l'auteur, ce qui est un biais à surveiller.

## Dix lignes

1. **Afflux** : à f = 85 % (25 ans), environ 284 000 jeunes par an (bas–haut 220 000 à 319 000), 20 % des ventes de logements ; à 70 %, 377 000. Porté par la part qui veut se fixer et l'accès bancaire (hypothèses).
2. **Déclencheur** : 88 % d'une génération a un emploi stable avant 36 ans (≈ 24,6 ans en moyenne, inférence sur le Céreq) ; les autres sont hors dispositif.
3. **Accès** : propriétaires ou usufruitiers à 35 ans de 17 % à 45 % ; moitié qui hérite le moins : de 10 % à 54 %. Paris reste dehors ; le premier décile de revenu entre moins.
4. **Prix, foncière seule** : +17,2 % en villes moyennes, +13,2 % en métropoles (bas–haut +9,5 % à +33,1 % dans le secteur le plus touché). Porté par l'élasticité de l'offre (0,3-0,5, études françaises).
5. **Hausse limitée parce que les surfaces sont modestes ?** : vrai en euros (les T1-T2 font 25 % de la valeur des ventes), faux en pourcentage sur le segment des jeunes (jusqu'à +19,5 % sur les T1-T2 hors Paris).
6. **Réforme locative** : 518 000 ventes de bailleurs sur dix ans (hypothèse non sourcée) ; elle fait baisser les prix à Paris et dans les métropoles, atténue la foncière les premières années, surtout dans les métropoles, mais la vague de ventes est passée quand la foncière atteint son régime. Le plafond mord par son seuil de 120 %, peu par l'énergie.
7. **La hausse compense-t-elle l'injustice ?** Non. Elle transfère ≈ 33 Md€ par an des acheteurs (foncière, jeunes, autres acheteurs) vers les vendeurs et enrichit les propriétaires en place ; ceux qui n'ont rien la paient.
8. **Foncière** : dette ≈ 531 Md€ à 30 ans à 3,5 % (641 à 4,7 %) ; test des 50 % raté (48 %). Il faut un forfait de 87 % ou une marge de 0,1 pt sur 30 ans ; 97 % ou 0,9 pt sur 60 ans ; à 4,7 %, beaucoup plus.
9. **Réglage sous contraintes** (prix ≤ 5 %, 50 % sur 30 ans, capital ≤ 14,7 Md€) : f = 70 %, 30 ans, marge 2 pt, plafond 6 % d'une génération (50 000 jeunes par an) : 23 % de propriétaires dans la moitié qui hérite le moins (contre 10 %). La contrainte de prix impose un plafond d'entrées bas.
10. **Fragile** : la part des bailleurs qui vendent, l'effet d'appel et la ventilation des élasticités par zone ne sont mesurés par aucune étude ; la Banque de France (2026) et l'OCDE contredisent l'idée d'un soutien à l'achat sans hausse des prix. Un point de taux pèse autant que la mesure.

## 1. Le déclencheur : premier emploi stable et revenus

Un jeune demande l'entrée à son premier emploi stable (emploi à durée indéterminée), au plus tard à 35 ans. Répartition d'une génération (H-FA2, calée sur le Céreq et l'Insee : sortie de formation à 22 ans en moyenne, 19 mois pour le premier emploi à durée indéterminée, 84 % en ont eu un environ six ans après la sortie) et revenu net au centre de chaque décile (H-FA3, médiane 1 800 € au premier emploi stable, qui remplace H-CO3 non sourcée).

| Scénario | ≤ 23 ans | 24-26 | 27-29 | 30-32 | 33-35 | pas avant 36 ans | âge moyen (ans) |
|---|---|---|---|---|---|---|---|
| bas | 30 % | 30 % | 14 % | 7 % | 5 % | 14 % | 25,5 |
| central | 40 % | 30 % | 10 % | 5 % | 3 % | 12 % | 24,6 |
| haut | 45 % | 30 % | 8 % | 4 % | 3 % | 10 % | 24,3 |

| Décile de revenu | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 |
|---|---|---|---|---|---|---|---|---|---|---|
| € nets / mois (25 ans) | 1 100 | 1 319 | 1 470 | 1 604 | 1 733 | 1 869 | 2 021 | 2 204 | 2 456 | 2 948 |

**Lecture.** Au central, 88 % d'une génération trouve un emploi stable avant 36 ans, à 24,6 ans en moyenne : c'est la population qui peut demander. Les 12 % restants (non-diplômés surtout) sont hors dispositif et reçoivent la moitié de leur capital en parts à vie. **Aucune distribution de l'âge au premier emploi stable n'est publiée** : celle-ci est une inférence ; le chiffre souvent cité de « 27 ans pour le premier CDI » (CESE 2012) n'a pas de source primaire et n'est pas utilisé.

## 2. L'afflux : combien de jeunes, pour quels logements

Choix de chaque ménage (héritage × revenu × secteur × âge au premier emploi stable × seul, couple ou famille) : foncière, achat bancaire ou location (H-FA9 à H-FA17). Mensualité foncière = prêt sur (f × prix − capital de départ) au taux bancaire de 3,32 % ; financement mixte au-delà de f × prix du T3 médian du secteur (H-FA15). « Contrats » = ménages (un couple = un contrat). « Propriétaires » : propriétaires ou usufruitiers à 35 ans parmi ceux qui ont un emploi stable avant 36 ans ; « sans dispositif » : même calcul, banque seule, sans capital.

| Forfait f | Durée | Jeunes par an | Part d'une génération | Contrats par an | Part des ventes | Prix moyen (€) | Capital apporté (€/contrat) | Part bancaire (€/contrat) | Montée en gamme | Propriétaires à 35 ans | sans dispositif | idem, moitié qui hérite le moins | sans dispositif |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 70 % | 25 | 377 k | 45 % | 296 k | 27 % | 152 636 | 25 735 | 855 | 31 % | 51 % | 17 % | 59 % | 10 % |
| 70 % | 30 | 392 k | 47 % | 310 k | 28 % | 154 473 | 25 252 | 885 | 34 % | 53 % | 17 % | 61 % | 10 % |
| 80 % | 25 | 312 k | 38 % | 242 k | 22 % | 150 033 | 29 121 | 723 | 26 % | 47 % | 17 % | 56 % | 10 % |
| 80 % | 30 | 335 k | 40 % | 263 k | 24 % | 151 924 | 28 003 | 812 | 29 % | 50 % | 17 % | 59 % | 10 % |
| 85 % | 25 | 284 k | 34 % | 218 k | 20 % | 148 926 | 30 459 | 723 | 24 % | 45 % | 17 % | 54 % | 10 % |
| 85 % | 30 | 311 k | 38 % | 243 k | 22 % | 150 702 | 29 007 | 838 | 27 % | 48 % | 17 % | 57 % | 10 % |
| 90 % | 25 | 251 k | 30 % | 190 k | 17 % | 148 101 | 32 323 | 752 | 23 % | 42 % | 17 % | 51 % | 10 % |
| 90 % | 30 | 287 k | 35 % | 222 k | 20 % | 149 619 | 29 946 | 864 | 25 % | 46 % | 17 % | 55 % | 10 % |

Scénarios (f = 85 %, 25 ans) : 

| Scénario | Jeunes par an | Part d'une génération | Contrats | Part des ventes | dont sans accès bancaire | dont avaient accès à la banque | dont effet d'appel | Propriétaires à 35 ans | sans dispositif |
|---|---|---|---|---|---|---|---|---|---|
| bas | 220 k | 26 % | 163 k | 14 % | 77 % | 18 % | 5 % | 34 % | 12 % |
| central | 284 k | 34 % | 218 k | 20 % | 76 % | 17 % | 7 % | 45 % | 17 % |
| haut | 319 k | 38 % | 250 k | 25 % | 80 % | 11 % | 9 % | 54 % | 20 % |

Contrats par secteur et par taille (central, f = 85 %, 25 ans) :

| Secteur | T2 | T3 | T4 | Part des ventes du secteur | Part des jeunes du secteur qui entrent |
|---|---|---|---|---|---|
| Paris | 0,0 k | 0,0 k | 0,0 k | 0 % | 0 % |
| Métropoles | 35,4 k | 12,7 k | 8,3 k | 16 % | 32 % |
| Villes moyennes | 61,3 k | 29,5 k | 18,7 k | 23 % | 45 % |
| Rural | 22,4 k | 19,9 k | 9,8 k | 23 % | 44 % |

**Lecture.** À f = 85 % (25 ans), environ 284 000 jeunes par an entrent (bas–haut : 220 000 à 319 000), soit 218 000 contrats, 20 % des ventes annuelles de logements ; à 70 %, 377 000. Le premier essai (essais/afflux_forfait.py : ≈ 300 000 jeunes, 20 % des ventes) est du même ordre. **Paris est hors de portée** : le T2 médian y vaut 347 800 € ; même avec le financement mixte, l'effort dépasse 35 % pour presque tous. La majorité des entrants n'a pas accès à la banque (76 %) : la foncière élargit l'accès plus qu'elle ne détourne des acheteurs bancaires. Les revenus plus élevés montent en gamme dans 24 % des contrats ; la part prêtée par une banque dans le financement mixte reste faible en moyenne (723 € par contrat) parce que les biens au-dessus du T3 médian sont rares chez ces jeunes. Le forfait agit surtout sur la demande des bancarisés : plus il monte, moins ils viennent ; les non-bancarisés viennent tant qu'ils peuvent payer.

## 3. L'offre : les bailleurs qui vendent

Parc locatif privé : 8,3 millions de résidences principales (SDES/ONRE, 01/01/2025), réparti par classe DPE et surface ; classes réparties entre secteurs d'après les DPE des villes témoins (H-FA30-32). Le plafond de loyer (formule du chapitre 6, k = 1,2, scénario central de `loyers-energie`) joue à la relocation (rotation 21 % par an) ; le bailleur dont le loyer est coupé vend avec une probabilité proportionnelle à sa perte de revenu net (H-FA33, ⚠️ non sourcée). La suppression des avantages fiscaux fait vendre de la même façon (H-FA34). En droit actuel, l'interdiction de louer (G depuis 2025, F en 2028, E en 2034) fait déjà vendre ; la réforme la remplace : ces ventes-là disparaissent (H-FA35).

| Année | Plafond de loyer (total) | dont dû à l'énergie | Fin des avantages fiscaux | Ventes de l'interdiction (droit actuel, supprimées) | Offre nette de la réforme |
|---|---|---|---|---|---|
| 2027 | 78 k | 18 k | 37 k | 10 k | 105 k |
| 2028 | 61 k | 14 k | 37 k | 22 k | 76 k |
| 2029 | 48 k | 11 k | 37 k | 17 k | 68 k |
| 2031 | 30 k | 7 k | 37 k | 11 k | 56 k |
| 2033 | 19 k | 4 k | 0 k | 7 k | 12 k |
| 2034 | 15 k | 3 k | 0 k | 39 k | -24 k |
| 2036 | 9 k | 2 k | 0 k | 24 k | -15 k |
| 2041 | 3 k | 1 k | 0 k | 7 k | -5 k |

| Surface | Parc locatif privé | dont E, F, G | Part E-F-G | Ventes de la 1re année (plafond) |
|---|---|---|---|---|
| Moins de 30 m² | 1 163 k | 504 k | 43 % | 9,7 k |
| De 30 à moins de 60 m² | 3 147 k | 1 103 k | 35 % | 20,3 k |
| De 60 à moins de 100 m² | 3 068 k | 886 k | 29 % | 27,3 k |
| Plus de 100 m² | 923 k | 245 k | 26 % | 20,3 k |

| Classe | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| Ventes de la 1re année (plafond) | 0,8 k | 2,8 k | 16,2 k | 23,8 k | 15,5 k | 8,8 k | 9,7 k |

**Lecture.** La réforme locative ferait vendre de l'ordre de 518 000 logements loués sur dix ans (central), surtout les premières années, contre 183 000 que l'interdiction aurait fait vendre sur la même période. **Le plafond mord d'abord par son seuil de 120 % du loyer médian, pas par l'énergie** : la part due à l'énergie n'est que 23 % des ventes provoquées par le plafond (comme dans `loyers-energie`, où l'énergie ajoute 0 à 4 points aux loyers coupés). Les petites surfaces sont les plus mal classées (21 % de E-F-G... voir la part par surface) ; elles représentent 39 % des ventes. **Par rapport au droit actuel**, la réforme fait moins vendre les passoires (elle supprime l'interdiction) mais fait vendre d'autres logements (plafond général, fin des avantages fiscaux). La part des bailleurs qui vendent n'est mesurée par aucune étude : c'est l'hypothèse la plus fragile de cette partie, et la contribution sur le patrimoine (le locatif entre dans la courbe du chapitre 3, jusqu'à près de 3 % par an) pourrait faire vendre bien davantage : elle n'est pas modélisée ici ⚠️.

## 4. Les prix : trois mondes, par secteur et par taille

Effet de niveau = (demande additionnelle − offre additionnelle) / ventes du segment × réponse du prix (1 / (élasticité de l'offre + élasticité de la demande), H-FA21, fourchettes du dossier `sources/prix-immobilier-effets-mesures.md`), avec diffusion de 50 % entre tailles (H-FA22). Foncière en régime ; offre de la réforme : moyenne des dix premières années. Effet de niveau atteint en 5 à 10 ans, pas une trajectoire.

| Monde | Secteur | T1-T2 | T3 | T4 et plus | Moyenne du secteur | bas à haut |
|---|---|---|---|---|---|---|
| Réforme locative seule | Paris | -3,2 % | -5,4 % | -6,0 % | -4,4 % | -11,7 % à +3,3 % |
| Réforme locative seule | Métropoles | -4,0 % | -4,5 % | -4,4 % | -4,3 % | -10,9 % à +0,2 % |
| Réforme locative seule | Villes moyennes | -2,2 % | -2,8 % | -3,0 % | -2,7 % | -6,1 % à +0,0 % |
| Réforme locative seule | Rural | +0,1 % | -0,0 % | -0,4 % | -0,2 % | -1,8 % à +1,5 % |
| Foncière seule | Paris | 0,0 % | +0,0 % | 0,0 % | 0,0 % | 0,0 % à +0,1 % |
| Foncière seule | Métropoles | +16,3 % | +12,3 % | +11,3 % | +13,2 % | +6,6 % à +33,1 % |
| Foncière seule | Villes moyennes | +19,5 % | +18,2 % | +14,9 % | +17,2 % | +9,5 % à +24,3 % |
| Foncière seule | Rural | +11,4 % | +14,6 % | +10,1 % | +11,7 % | +5,1 % à +13,9 % |
| Les deux | Paris | -3,2 % | -5,4 % | -6,0 % | -4,4 % | -11,7 % à +3,4 % |
| Les deux | Métropoles | +12,3 % | +7,8 % | +6,9 % | +8,9 % | -4,4 % à +33,3 % |
| Les deux | Villes moyennes | +17,3 % | +15,4 % | +11,9 % | +14,5 % | +3,4 % à +24,3 % |
| Les deux | Rural | +11,5 % | +14,5 % | +9,8 % | +11,5 % | +3,3 % à +15,4 % |

Trajectoire des deux réformes ensemble (foncière montée linéairement en 10 ans ; offre des bailleurs de l'année) :

| Année | Foncière (part du régime) | Paris | Métropoles | Villes moyennes | Rural |
|---|---|---|---|---|---|
| 2027 | 10 % | -15,2 % | -10,0 % | -5,9 % | -2,4 % |
| 2029 | 30 % | -9,3 % | -4,5 % | +0,1 % | +2,6 % |
| 2031 | 50 % | -7,5 % | -0,6 % | +4,6 % | +5,1 % |
| 2033 | 70 % | -1,8 % | +8,0 % | +10,8 % | +8,1 % |
| 2036 | 100 % | +2,8 % | +14,2 % | +17,9 % | +13,1 % |
| 2041 | 100 % | +0,9 % | +13,5 % | +17,4 % | +12,1 % |

Le calendrier joue contre l'équilibre : les bailleurs vendent surtout les premières années, quand la foncière démarre à peine ; quand elle atteint son régime, la vague est passée, et la suppression de l'interdiction (qui aurait fait vendre les E à partir de 2034) retire même de l'offre par rapport au droit actuel.


Logements qui changent de mains par an (ventes de base + ventes additionnelles des bailleurs + achats additionnels de la foncière ; les achats non additionnels de la foncière remplacent des ventes existantes) :

| Secteur | Sans réforme | Réforme locative seule | Foncière seule | Les deux |
|---|---|---|---|---|
| Paris | 43 k | 44 k | 43 k | 44 k |
| Métropoles | 360 k | 376 k | 412 k | 429 k |
| Villes moyennes | 467 k | 481 k | 563 k | 577 k |
| Rural | 231 k | 232 k | 276 k | 277 k |

Droits de mutation et taux (central) :

| Secteur | Foncière seule, droits actuels | Foncière seule, ventes plus nombreuses sans droits (+10 %) | Suppression des droits seule (κ = 70 % de 5,8 %) | Foncière + suppression des droits | +1 point de taux | −1 point de taux |
|---|---|---|---|---|---|---|
| Paris | 0,0 % | 0,0 % | +4,1 % | +4,1 % | -5,0 % | +5,0 % |
| Métropoles | +13,2 % | +12,0 % | +4,1 % | +16,0 % | -5,0 % | +5,0 % |
| Villes moyennes | +17,2 % | +15,6 % | +4,1 % | +19,7 % | -5,0 % | +5,0 % |
| Rural | +11,7 % | +10,6 % | +4,1 % | +14,7 % | -5,0 % | +5,0 % |

**Recoupement par une autre méthode** : si 30 % du capital apporté chaque année (6,6 Md€) passait dans les prix (Help to Buy à Londres ; 0 % là où l'offre suit, 50-80 % pour les aides au logement dans les loyers), le niveau moyen des prix monterait de +0,8 % (bas–haut : 0,0 % à +1,7 %). Cette méthode ne compte que le capital ; la méthode principale compte aussi le crédit de la foncière, qui solvabilise des ménages refusés par les banques : c'est pourquoi elle donne bien plus.

**Position de l'auteur testée : la hausse resterait limitée, parce qu'elle porte sur des surfaces modestes.** Les deux sens, chiffrés (foncière seule, central) :
- **Pour** : les T1-T2 ne font que 25 % de la valeur des ventes ; en euros, la hausse qui porte sur eux pèse 28 % du total ; l'offre de petites surfaces s'ajuste mieux (Grislain-Letrémy et Trevien) ; et le plafond de loyer met en vente surtout des petites surfaces.
- **Contre** : 55 % des contrats portent sur des T2 ; concentrée sur un segment étroit, la même demande y fait plus monter les prix en pourcentage (jusqu'à +19,5 % sur les T1-T2 hors Paris) ; et ce sont précisément les logements des jeunes, des étudiants et des primo-accédants hors dispositif. La diffusion entre tailles (50 %) propage ensuite la hausse aux autres segments.
- **Verdict** : en euros et pour l'ensemble du parc, l'affirmation tient en partie ; en pourcentage, sur le segment qui compte pour les jeunes, elle ne tient pas. Au central, la foncière seule fait monter les prix de +17,2 % dans le secteur hors Paris le plus touché, bien au-dessus de 5 %.

**Lecture.** (1) **La foncière seule fait monter les prix nettement** : +17,2 % en villes moyennes, +13,2 % dans les métropoles (central ; bas–haut dans le tableau). C'est plus que les modèles précédents (4 à 7 %), pour deux raisons : la demande est plus forte (financement à 85 % sans banque) et les élasticités sont désormais tirées des études françaises (offre ≈ 0,3 à 0,5), alors que H-FU40 supposait une offre deux à quatre fois plus souple. (2) **La réforme locative seule fait baisser les prix**, surtout à Paris et dans les métropoles, où les bailleurs vendent et où la foncière n'achète presque rien (Paris). (3) **Les deux ensemble** : dans les métropoles, les deux effets se compensent à peu près ; en villes moyennes et dans le rural, la demande de la foncière l'emporte ; à Paris, la baisse domine. (4) **Ordre de grandeur des taux** : un point de taux bouge les prix d'environ -5,0 % (BCE ; recoupement -5,5 %) partout, autant ou plus que la foncière dans les métropoles, moins qu'elle en villes moyennes. (5) **Suppression des droits de mutation** : elle ajoute de l'ordre de +4,1 % au prix des vendeurs (capitalisation de 40 à 100 %), un gain pour les propriétaires en place, financé par la perte de 14,7 Md€ de recettes ; les ventes plus nombreuses n'atténuent que faiblement l'effet de la foncière. (6) **Ce que disent les études** : la Banque de France (Bloc-notes Éco 441, mars 2026) conclut qu'un soutien à l'achat face à une offre inélastique fait monter les prix sans effet notable sur l'accession, et l'offre française est parmi les plus inélastiques de l'OCDE (0,49). Le modèle va dans le même sens pour les prix ; il prédit en plus un effet sur l'accession parce que la foncière prête à des ménages que les banques refusent, ce qu'aucune étude ne mesure.

## 5. Qui gagne, qui perd

### 5.1 Les jeunes entrants

| Secteur | Entrent à la foncière | Propriétaires à 35 ans | sans dispositif | Mensualité foncière moyenne (€) | Mensualité bancaire du même bien (90 %) | Loyer de marché du même bien | Effort (mensualité + contribution) |
|---|---|---|---|---|---|---|---|
| Paris | 0 % | 0 % | 0 % | — | — | — | — |
| Métropoles | 32 % | 42 % | 13 % | 643 | 868 | 910 | 26 % |
| Villes moyennes | 45 % | 60 % | 23 % | 405 | 602 | 681 | 20 % |
| Rural | 44 % | 58 % | 23 % | 359 | 557 | 569 | 18 % |

Par décile de revenu :

| Décile de revenu | Foncière | Propriétaires à 35 ans | sans dispositif | Mensualité (€) | Effort |
|---|---|---|---|---|---|
| D1 | 29 % | 30 % | 2 % | 369 | 25 % |
| D2 | 35 % | 38 % | 6 % | 405 | 24 % |
| D3 | 40 % | 43 % | 7 % | 430 | 24 % |
| D4 | 45 % | 51 % | 11 % | 458 | 24 % |
| D5 | 41 % | 53 % | 21 % | 458 | 22 % |
| D6 | 42 % | 55 % | 22 % | 468 | 21 % |
| D7 | 43 % | 58 % | 24 % | 485 | 21 % |
| D8 | 42 % | 61 % | 28 % | 493 | 19 % |
| D9 | 37 % | 61 % | 33 % | 490 | 17 % |
| D10 | 33 % | 60 % | 36 % | 505 | 15 % |

Par décile d'héritage :

| Décile d'héritage | Capital de départ moyen (€) | Foncière | Propriétaires à 35 ans | sans dispositif |
|---|---|---|---|---|
| D1 | 40 000 | 56 % | 56 % | 5 % |
| D2 | 36 043 | 56 % | 56 % | 8 % |
| D3 | 30 692 | 54 % | 54 % | 10 % |
| D4 | 25 315 | 52 % | 53 % | 13 % |
| D5 | 19 610 | 50 % | 52 % | 16 % |
| D6 | 13 710 | 40 % | 49 % | 20 % |
| D7 | 8 025 | 28 % | 48 % | 23 % |
| D8 | 3 324 | 21 % | 47 % | 27 % |
| D9 | 617 | 17 % | 47 % | 31 % |
| D10 | 10 | 14 % | 50 % | 37 % |

**Lecture.** La foncière fait passer la part de propriétaires (ou usufruitiers) à 35 ans de 17 % à 45 % (moitié qui hérite le moins : de 10 % à 54 %). Hors Paris, la mensualité est inférieure au loyer de marché du même logement : c'est ce qui rend l'afflux massif. Le premier décile de revenu entre moins (29 % contre 39 % en moyenne) et Paris pas du tout. Au-delà du 5e décile d'héritage, le capital fond et la foncière attire peu : le dispositif sert bien ceux qui héritent peu. Ces chiffres ne tiennent pas compte de la hausse des prix que l'afflux provoque (section 4) : à +10 % de prix, la mensualité monte d'environ 10 % × f.


### 5.2 Les transferts (central, Md€ par an en régime, foncière seule sauf mention)

| Qui | Montant | Sens |
|---|---|---|
| Vendeurs de l'année (tous logements vendus) | 33,3 | gagnent : la hausse sur ce qu'ils vendent |
| Tous les propriétaires (valeur du parc, plus-value latente, une fois) | 1 362 (stock) | gagnent sur le papier |
| dont payé par la foncière (1 − f de la hausse sur ses achats → dette) | 0,7 | paie |
| dont payé par les jeunes entrants (f de la hausse, sur 25 ans) | 4,1 | paient |
| dont payé par les autres acheteurs (déjà propriétaires, plus de 35 ans, investisseurs, primo-accédants à la banque) | 28,5 | paient |
| Bailleurs : baisse des loyers à pleine relocation (plafond total) | 1,9 | perdent ; locataires gagnent |
| dont part due à l'énergie | 0,4 |  |
| État : impôt sur les revenus fonciers perdu | 0,8 | perd |
| Suppression des droits de mutation : gain des vendeurs (κ × 5,8 % des ventes) | 10,3 | gagnent |
| Suppression des droits de mutation : recette perdue | 14,7 | perd (remplacée au chapitre 3) |

**Lecture, sans détour.** L'auteur avançait qu'une hausse des prix compenserait l'injustice faite à ceux qui sont hors du dispositif. Le calcul dit autre chose : la hausse transfère chaque année environ 33 Md€ des acheteurs vers les vendeurs. Elle est payée par la foncière (donc par sa dette, 0,7 Md€), par les jeunes entrants (4,1 Md€, étalés sur leur mensualité) et surtout par tous les autres acheteurs (28,5 Md€), parmi lesquels les jeunes hors dispositif qui achètent après 35 ans ou à la banque. Elle profite à ceux qui possèdent déjà : les propriétaires en place, plus âgés et plus riches, et les bailleurs qui vendent. Les « hors dispositif » qui possèdent déjà y gagnent ; ceux qui ne possèdent pas encore (locataires de plus de 35 ans, jeunes sans emploi stable, Parisiens) y perdent. **La hausse ne compense pas l'injustice : elle la déplace vers ceux qui n'ont pas de patrimoine, et elle enrichit les propriétaires en place.** Côté loyers : les entrants qui auraient loué libèrent environ 181 000 logements par an, les bailleurs qui vendent en retirent 34 000 (moyenne des dix premières années) : effet sur les loyers de marché de l'ordre de -2,7 % par an d'écart (réponse des loyers ≈ 1,5, Friggit, ⚠️ ordre de grandeur), à ajouter à la baisse directe du plafond pour les logements concernés.

## 6. Finances publiques

### 6.1 La foncière (fonciere-usufruit/code/fonciere.py, mode « forfait », non modifié)

Entrants de la section 2 (contrats, âges, prix moyen, apport moyen = capital + part bancaire) ; montée linéaire sur 10 ans ; sans viagers ni dations (H-FA42). Coût de l'argent : 3,5 % (central de la foncière), 4,7 % (OAT exogène) et 5,3 % (OAT 2032 endogène, `taux-endogene`). Test des 50 % : plus bas de la moyenne sur 3 ans du ratio intérêts reçus / (intérêts payés + gestion + impayés), de l'an 5 à l'an 30 et à l'an 60.

| f | Durée | Coût de l'argent | Besoin an 10 (Md€) | Dette an 10 | Dette an 30 | Dette an 30 (% PIB) | Ratio min 5-30 ans | Ratio min 5-60 ans | Coût cumulé pour l'État an 30 (gestion − aides évitées) |
|---|---|---|---|---|---|---|---|---|---|
| 70 % | 25 | 3,5 % | 42 | 216 | 888 | 22 % | 35 % | 19 % | 36 |
| 70 % | 25 | 4,7 % | 45 | 224 | 1 060 | 26 % | 23 % | 10 % | 40 |
| 70 % | 25 | 5,3 % | 46 | 228 | 1 161 | 28 % | 19 % | 7 % | 43 |
| 70 % | 25 | 4,7 % (taux bancaire suit) | 44 | 220 | 989 | 24 % | 34 % | 16 % | 40 |
| 70 % | 30 | 3,5 % | 46 | 232 | 998 | 24 % | 37 % | 22 % | 38 |
| 70 % | 30 | 4,7 % | 48 | 241 | 1 188 | 29 % | 25 % | 11 % | 42 |
| 70 % | 30 | 5,3 % | 50 | 245 | 1 299 | 31 % | 21 % | 8 % | 45 |
| 70 % | 30 | 4,7 % (taux bancaire suit) | 47 | 237 | 1 108 | 27 % | 37 % | 18 % | 42 |
| 80 % | 25 | 3,5 % | 32 | 165 | 634 | 15 % | 43 % | 27 % | 29 |
| 80 % | 25 | 4,7 % | 34 | 172 | 762 | 18 % | 29 % | 14 % | 33 |
| 80 % | 25 | 5,3 % | 35 | 175 | 837 | 20 % | 24 % | 10 % | 35 |
| 80 % | 25 | 4,7 % (taux bancaire suit) | 33 | 169 | 696 | 17 % | 43 % | 23 % | 33 |
| 80 % | 30 | 3,5 % | 37 | 186 | 755 | 18 % | 46 % | 30 % | 32 |
| 80 % | 30 | 4,7 % | 39 | 193 | 903 | 22 % | 31 % | 15 % | 36 |
| 80 % | 30 | 5,3 % | 40 | 197 | 990 | 24 % | 25 % | 11 % | 38 |
| 80 % | 30 | 4,7 % (taux bancaire suit) | 38 | 190 | 826 | 20 % | 46 % | 25 % | 36 |
| 85 % | 25 | 3,5 % | 28 | 145 | 531 | 13 % | 48 % | 32 % | 27 |
| 85 % | 25 | 4,7 % | 30 | 150 | 641 | 16 % | 32 % | 16 % | 30 |
| 85 % | 25 | 5,3 % | 31 | 153 | 706 | 17 % | 27 % | 11 % | 32 |
| 85 % | 25 | 4,7 % (taux bancaire suit) | 29 | 147 | 579 | 14 % | 49 % | 28 % | 30 |
| 85 % | 30 | 3,5 % | 33 | 168 | 656 | 16 % | 51 % | 35 % | 30 |
| 85 % | 30 | 4,7 % | 35 | 174 | 788 | 19 % | 34 % | 17 % | 33 |
| 85 % | 30 | 5,3 % | 36 | 177 | 864 | 21 % | 28 % | 12 % | 36 |
| 85 % | 30 | 4,7 % (taux bancaire suit) | 34 | 170 | 713 | 17 % | 52 % | 30 % | 33 |
| 90 % | 25 | 3,5 % | 24 | 122 | 428 | 10 % | 53 % | 38 % | 23 |
| 90 % | 25 | 4,7 % | 25 | 126 | 519 | 13 % | 36 % | 19 % | 27 |
| 90 % | 25 | 5,3 % | 26 | 129 | 573 | 14 % | 30 % | 13 % | 28 |
| 90 % | 25 | 4,7 % (taux bancaire suit) | 24 | 124 | 462 | 11 % | 55 % | 34 % | 27 |
| 90 % | 30 | 3,5 % | 29 | 149 | 565 | 14 % | 56 % | 41 % | 27 |
| 90 % | 30 | 4,7 % | 31 | 155 | 680 | 16 % | 38 % | 20 % | 31 |
| 90 % | 30 | 5,3 % | 32 | 158 | 748 | 18 % | 31 % | 14 % | 33 |
| 90 % | 30 | 4,7 % (taux bancaire suit) | 30 | 152 | 608 | 15 % | 58 % | 37 % | 31 |

Ce qu'il faut pour couvrir plus de la moitié des coûts (un levier à la fois ; entrants tenus fixes : un forfait plus haut ferait venir moins de monde, ce qui aide aussi) — « — » : la borne (forfait 100 %, marge 8 points, livret 3 000 Md€) n'y suffit pas :

| f | Durée | Coût de l'argent | Forfait, 30 ans | Marge de taux, 30 ans | Livret foncier à 2 %, 30 ans | Forfait, 60 ans | Marge de taux, 60 ans | Livret foncier, 60 ans |
|---|---|---|---|---|---|---|---|---|
| 85 % | 25 | 3,5 % | 86,8 % | 0,10 pt | 27 Md€ | 97,0 % | 0,94 pt | 268 Md€ |
| 85 % | 25 | 4,7 % | — | 1,27 pt | 187 Md€ | — | 2,51 pt | 380 Md€ |
| 85 % | 30 | 3,5 % | 85,0 % | 0,00 pt | 0 Md€ | 95,8 % | 0,74 pt | 271 Md€ |
| 85 % | 30 | 4,7 % | — | 1,09 pt | 201 Md€ | — | 2,26 pt | 444 Md€ |
| 70 % | 25 | 3,5 % | 86,2 % | 1,09 pt | 390 Md€ | 96,9 % | 2,47 pt | — |
| 70 % | 25 | 4,7 % | — | 2,58 pt | 508 Md€ | — | 4,50 pt | — |

**Lecture.** À f = 85 % et 25 ans, au coût de l'argent de 3,5 %, la dette de la foncière atteint 531 Md€ à 30 ans (13 % du PIB) ; à 4,7 %, 641 Md€. Le test des 50 % (48 % au plus bas sur 30 ans) est raté de peu à 3,5 % et largement à 4,7 % ou 5,3 % : la foncière prête au taux bancaire un argent qui lui coûte autant ou plus, et porte la nue-propriété à crédit. Le forfait surévalué crée une marge en capital (elle revient au décès), pas en trésorerie. **À 4,7 %, aucun forfait ne suffit sur 60 ans** ; il faut une marge de taux de l'ordre d'un à deux points, ou un livret foncier de plusieurs centaines de milliards d'euros. Si la foncière reste dans les administrations publiques, sa dette compte dans la dette publique.


### 6.2 Capital versé, recettes touchées (central, Md€ par an)

| Poste | Md€ par an | Remarque |
|---|---|---|
| Capital de départ apporté dans les achats | 6,6 | dépense de l'État, quel que soit le canal |
| Parts à vie (moitié du capital) pour qui n'entre pas | 4,0 | dont les jeunes sans emploi stable avant 36 ans |
| Total capital | 10,7 | plafond retenu : 14,7 Md€ (option D du chapitre 3) |
| Droits de mutation perdus (droit actuel : achats de la foncière exonérés qui auraient eu lieu) | 0,23 | nuls si les droits sont supprimés |
| Droits de mutation gagnés sur la hausse des prix (droit actuel) | 1,93 |  |
| Contribution sur la résidence principale payée par une cohorte d'entrants | 0,08 | remplace la taxe foncière : pas une recette nouvelle |
| Impôt sur les revenus fonciers perdu (plafond de loyer, pleine relocation) | 0,8 | taux 40 % ⚠️ |
| Aides au logement évitées, an 30 / an 60 | 0,06 / 1,65 | après remboursement seulement (H-CO31) |
| Gestion de la foncière payée par l'État, an 30 | 1,7 | 300 € par contrat (H-FU25) |

**Lecture.** Le capital de départ coûte à peu près ce que coûtait la garantie du chapitre 3 ; il n'est simplement plus versé en argent. Les aides au logement évitées restent faibles pendant 25 ans (elles ne cessent qu'après le remboursement) et ne couvrent pas la gestion. Le plafond de loyer coûte de l'impôt sur les revenus fonciers. La recette qui compte, à terme, est le patrimoine de la foncière (les logements qui reviennent au décès), qui ne se voit pas dans le budget annuel.


### 6.3 C'est le jeune qui négocie : surpaiement et prix gonflés

Le jeune trouve le bien et négocie ; la foncière entre dans la transaction. Le capital étant fixe, chaque euro de prix en plus coûte f au jeune (sur sa mensualité) et 1 − f à la foncière.

| Surpaiement moyen | Coût pour la foncière (Md€/an) | Coût pour les jeunes (Md€/an) | Mensualité en plus (€/mois) |
|---|---|---|---|
| 1 % | 0,05 | 0,28 | 6 |
| 3 % | 0,15 | 0,83 | 19 |
| 5 % | 0,24 | 1,38 | 31 |

Règle « la foncière ne finance que jusqu'à une valeur de référence indépendante × (1 + tolérance) » (prix réel dispersé de 10 % autour de la référence, ⚠️) :

| Tolérance | Transactions honnêtes bloquées (au-delà, le jeune paie comptant) | Prix gonflé encore finançable |
|---|---|---|
| 5 % | 31 % | 5 % |
| 10 % | 17 % | 10 % |
| 15 % | 8 % | 15 % |
| 20 % | 3 % | 20 % |

**Lecture.** L'incitation à négocier est forte (85 % de chaque euro pour le jeune), mais pas entière. Le risque sérieux est le **prix gonflé d'un commun accord** : une partie du prix rendue de la main à la main au jeune revient à sortir son capital en argent, et la foncière paie 15 % de chaque euro gonflé. La valeur de référence (ventes DVF comparables, évaluation indépendante) borne ce gonflement à la tolérance choisie, au prix de transactions honnêtes bloquées ; une tolérance de 10 à 15 % paraît un compromis, avec contrôle a posteriori.


### 6.4 La « sortie honnête » des bailleurs : ce que la collectivité reprend

| Poste (central, par an, dix premières années) | Valeur |
|---|---|
| Passoires (F, G) mises en vente par les bailleurs | 8 000 |
| Décote d'un appartement G par rapport à D (notaires, 2024) | 12 % |
| Coût de rénovation d'un T2 de 40 m² (450 €/m², ⚠️) | 18 000 €, soit 13 % du prix moyen d'un T2 |
| Hausse des prix due à la présence de la foncière, sur les ventes des bailleurs (transfert aux vendeurs : monde 3 − monde 1) | 0,7 Md€ |
| Si la foncière payait les prix « d'avant la réforme » (sans la baisse du monde 1) | 0,2 Md€ de plus |

**Lecture.** La décote des passoires (12 %) couvre à peu près le coût de leur rénovation (13 % du prix d'un T2) : acheter une passoire au prix du marché et la rénover n'est ni une bonne ni une mauvaise affaire en soi. Le risque repris est celui des prix : la foncière achète au moment où la réforme fait baisser les prix, et sa présence les soutient. Ce soutien est un transfert aux bailleurs qui vendent (≈ 0,7 Md€ par an au central). **Sortie honnête** = la foncière (ou le jeune) achète au prix de marché constaté, jamais au-dessus d'une évaluation indépendante ; **rachat avantageux** = acheter aux prix d'avant la réforme, soit ≈ 0,2 Md€ de plus par an versés aux vendeurs. L'auteur, bailleur, est du côté de ceux qui reçoivent ce transfert.

## 7. Les réglages

### 7.1 Un nombre de droits « neutre en prix » qui suit l'offre des bailleurs

Le levier n'est pas un volume d'achats (le jeune choisit le bien), mais le **nombre de droits ouverts par an**. Droits neutres : nombre d'entrants tel que l'effet net moyen du secteur (demande des entrants − offre nette des bailleurs) vaille +2 %, secteur par secteur.

| Offre des bailleurs | Année | Paris | Métropoles | Villes moyennes | Rural | Droits par an | Part de la demande servie |
|---|---|---|---|---|---|---|---|
| ×1,0 | 2027 | — | 77 k | 79 k | 32 k | 188 k | 66 % |
| ×1,0 | 2028 | — | 65 k | 64 k | 17 k | 147 k | 52 % |
| ×1,0 | 2029 | — | 60 k | 58 k | 17 k | 135 k | 48 % |
| ×1,0 | 2031 | — | 53 k | 48 k | 16 k | 118 k | 42 % |
| ×1,0 | 2033 | — | 19 k | 26 k | 12 k | 57 k | 20 % |
| ×1,0 | 2036 | — | 6 k | 10 k | 3 k | 20 k | 7 % |
| ×1,0 | 2041 | — | 10 k | 14 k | 9 k | 33 k | 12 % |
| ×0,5 | 2027 | — | 44 k | 47 k | 22 k | 114 k | 40 % |
| ×0,5 | 2028 | — | 38 k | 40 k | 14 k | 93 k | 33 % |
| ×0,5 | 2029 | — | 36 k | 37 k | 14 k | 87 k | 31 % |
| ×0,5 | 2031 | — | 32 k | 32 k | 14 k | 79 k | 28 % |
| ×0,5 | 2033 | — | 15 k | 21 k | 12 k | 48 k | 17 % |
| ×0,5 | 2036 | — | 9 k | 13 k | 7 k | 29 k | 10 % |
| ×0,5 | 2041 | — | 11 k | 15 k | 10 k | 36 k | 13 % |
| ×1,5 | 2027 | — | 109 k | 110 k | 42 k | 262 k | 92 % |
| ×1,5 | 2028 | — | 92 k | 89 k | 20 k | 201 k | 71 % |
| ×1,5 | 2029 | — | 85 k | 79 k | 19 k | 183 k | 64 % |
| ×1,5 | 2031 | — | 74 k | 64 k | 18 k | 157 k | 55 % |
| ×1,5 | 2033 | — | 23 k | 31 k | 13 k | 66 k | 23 % |
| ×1,5 | 2036 | — | 3 k | 8 k | 0 k | 11 k | 4 % |
| ×1,5 | 2041 | — | 9 k | 14 k | 8 k | 30 k | 11 % |

**Lecture.** Les « bons poids » existent, mais ils baissent vite : pour rester à +2 %, on peut ouvrir de l'ordre de 188 000 droits la première année, quand les bailleurs vendent beaucoup, puis 20 000 à l'an 10, la vague de relocations passée (et quand la suppression de l'interdiction des E retire de l'offre par rapport au droit actuel), pour une demande d'environ 284 000 jeunes par an. Si les bailleurs vendent deux fois moins que prévu, la première année tombe à 114 000 ; une fois et demie plus, elle monte à 262 000. La bande de 2 % autorise à elle seule une part importante de ces droits. Paris ne reçoit pas de droits (inaccessible) tandis que ses bailleurs vendent. Le système « se tient » donc au sens où le nombre de droits peut suivre la sortie des bailleurs sans faire monter les prix au-delà de la bande, mais à un rythme qui retombe bien en dessous de la demande des jeunes après quelques années : le plafond d'entrées devient le vrai réglage politique.


### 7.2 Le réglage qui maximise l'accès des jeunes qui héritent peu, sous contraintes

Contraintes (central, foncière seule, en régime) : hausse des prix ≤ 5 % dans chaque secteur ; test des 50 % tenu de l'an 5 à l'an 30 (argent à 3,5 %) ; capital ≤ 14,7 Md€ par an. Critère : part propriétaire ou usufruitière à 35 ans de la moitié qui hérite le moins. Plafond d'entrées servi par ordre d'héritage croissant (publics prioritaires).

| Hausse maximale admise | f | Durée | Marge | Plafond d'entrées (part d'une génération) | Jeunes par an | Propriétaires à 35 ans, moitié qui hérite le moins | Hausse (secteur le plus touché) | Ratio min 30 ans | Dette an 30 (Md€) | idem sans la contrainte des 50 % |
|---|---|---|---|---|---|---|---|---|---|---|
| 2 % | 70 % | 30 | 2 pt | 3 % | 25 k | 17 % | +1,6 % | 60 % | 47 | 17 % |
| 3 % | 70 % | 30 | 2 pt | 3 % | 25 k | 17 % | +1,6 % | 60 % | 47 | 17 % |
| 5 % | 70 % | 30 | 2 pt | 6 % | 50 k | 23 % | +3,1 % | 59 % | 96 | 23 % |
| 8 % | 70 % | 30 | 2 pt | 15 % | 124 k | 40 % | +7,5 % | 61 % | 247 | 41 % |
| 10 % | 70 % | 30 | 2 pt | 20 % | 166 k | 49 % | +9,8 % | 63 % | 334 | 49 % |
| 15 % | 70 % | 30 | 2 pt | 25 % | 208 k | 57 % | +12,0 % | 64 % | 423 | 58 % |
| sans plafond | 70 % | 30 | 1 pt | — | 376 k | 59 % | +20,2 % | 52 % | 879 | 61 % |

Sans dispositif, la moitié qui hérite le moins est propriétaire à 35 ans à 10 %. **Réglage retenu sous les trois contraintes** : f = 70 %, 30 ans, marge de 2 point(s), plafond d'entrées de 6 % d'une génération (50 000 jeunes par an, servis par héritage croissant) : 23 % de propriétaires dans la moitié qui hérite le moins, hausse de +3,1 %, ratio 59 %, dette de 96 Md€ à 30 ans.

**Lecture.** La frontière est raide : chaque point de hausse des prix admis « achète » quelques points d'accès pour les moins dotés. La contrainte qui mord est celle des prix ; elle impose un plafond d'entrées bas, très en dessous de la demande. Le test des 50 % impose ensuite une marge de taux d'au moins un point, ce qui rapproche la mensualité de celle d'un prêt bancaire et écarte des ménages modestes. Servir d'abord ceux qui héritent le moins rend le plafond efficace pour le critère choisi, mais crée un effet de seuil et un risque de déclarations d'héritage arrangées.


### 7.3 L'ouverture par cercles (bâtisseurs 3 000 par an pendant deux ans, puis montée)

Au lancement, les 25-35 ans déjà en emploi stable sans logement à eux attendent (H-CO27, `capital-de-depart-options`) ; droit conservé jusqu'à 40 ans ; les plus âgés d'abord. Hausse des prix au pic : effet de la section 4 (secteur hors Paris le plus touché) × entrées du pic / entrées de régime.

| Mise en place | Entrées an 1 | an 5 | an 10 | Pic / régime | Hausse des prix au pic | Attente moyenne (ans) | Droits perdus | Dette an 30 (Md€) |
|---|---|---|---|---|---|---|---|---|
| Sans plafond, ouverture en 5 ans | 3 k | 312 k | 312 k | 1,10 | +18,9 % | 8,1 | 0 k | 603 |
| Sans plafond, ouverture en 10 ans | 3 k | 119 k | 312 k | 1,10 | +18,9 % | 10,6 | 0 k | 574 |
| Plafond retenu (7.2), ouverture en 8 ans | 3 k | 29 k | 55 k | 0,19 | +3,3 % | 16,1 | 12 034 k | 102 |

**Lecture.** Sans plafond, la file du lancement (les générations de 25 à 35 ans qui n'ont pas pu acheter) fait dépasser le régime pendant plusieurs années : la hausse des prix y est plus forte qu'en régime. Un plafond fixé à l'avance et une montée lente l'évitent, au prix d'une attente.

## 8. Les logements que vendent les bailleurs sont-ils ceux que veulent les jeunes ?

Offre nette de la réforme (moyenne des dix premières années) et demande additionnelle de la foncière en régime, par secteur et taille :

| Secteur | Taille | Offre des bailleurs | Demande des jeunes | Qui domine |
|---|---|---|---|---|
| Paris | T1-T2 | 0,7 k | 0,0 k | offre des bailleurs (baisse) |
| Paris | T3 | 0,6 k | 0,0 k | offre des bailleurs (baisse) |
| Paris | T4+ | 0,6 k | 0,0 k | offre des bailleurs (baisse) |
| Métropoles | T1-T2 | 7,1 k | 33,8 k | demande des jeunes (hausse) |
| Métropoles | T3 | 4,8 k | 11,0 k | demande des jeunes (hausse) |
| Métropoles | T4+ | 4,8 k | 8,0 k | demande des jeunes (hausse) |
| Villes moyennes | T1-T2 | 4,9 k | 53,0 k | demande des jeunes (hausse) |
| Villes moyennes | T3 | 4,0 k | 25,6 k | demande des jeunes (hausse) |
| Villes moyennes | T4+ | 5,6 k | 17,5 k | demande des jeunes (hausse) |
| Rural | T1-T2 | -0,3 k | 18,6 k | demande des jeunes (hausse) |
| Rural | T3 | -0,1 k | 17,6 k | demande des jeunes (hausse) |
| Rural | T4+ | 0,9 k | 9,0 k | demande des jeunes (hausse) |

**Lecture.** Les bailleurs vendent surtout à Paris et dans les métropoles, des petites surfaces, souvent mal classées ; les jeunes demandent surtout en villes moyennes et dans les métropoles, des T2 mais aussi des T3 et T4 (familles, montée en gamme). Le décalage est donc double : **à Paris, l'offre domine** (baisse des prix) parce que les jeunes ne peuvent pas y entrer ; **en villes moyennes et dans le rural, la demande domine** (hausse). Comme c'est le jeune qui choisit le bien, l'appariement se fait là où les deux se croisent (métropoles, petites surfaces), sans garantie ailleurs. La foncière peut l'aider en préemptant avec les communes, mais elle ne stocke pas de logements vides : son parc ne se constitue qu'au rythme des entrées.

## 9. Quelle hypothèse porte le résultat ? (tornade)

Chaque hypothèse passe seule à sa valeur basse puis haute, les autres au central (f = 85 %, 25 ans). Mesures : jeunes par an, hausse des prix (foncière seule, secteur hors Paris le plus touché), effet net des deux réformes (même secteur), dette de la foncière à 30 ans.

| Hypothèse (bas / haut) | Jeunes par an | Hausse des prix, foncière seule | Effet net des deux réformes | Dette an 30 (Md€) |
|---|---|---|---|---|
| Élasticité de l'offre (H-FA21) | 284 k / 284 k | +13,7 % / +20,7 % | +11,5 % / +17,5 % | 531 / 531 |
| Part qui veut se fixer (H-FA11) | 244 k / 323 k | +14,9 % / +19,4 % | +12,2 % / +16,7 % | 458 / 605 |
| Ventes annuelles (H-FA20) | 284 k / 284 k | +15,7 % / +18,9 % | +13,3 % / +15,9 % | 531 / 531 |
| Effet d'appel (H-FA16) | 274 k / 303 k | +16,4 % / +18,7 % | +13,7 % / +16,0 % | 513 / 568 |
| Âge au premier emploi stable (H-FA2) | 279 k / 289 k | +16,5 % / +17,7 % | +13,8 % / +15,0 % | 518 / 544 |
| Valeur de la nue-propriété pour le jeune (H-FA13) | 304 k / 258 k | +17,6 % / +16,5 % | +14,9 % / +13,8 % | 574 / 482 |
| Additionnalité des bancarisés (H-FA17) | 284 k / 284 k | +16,8 % / +17,8 % | +14,1 % / +15,1 % | 531 / 531 |
| Écart de réponse selon la taille (H-FA22) | 284 k / 284 k | +16,7 % / +17,6 % | +14,0 % / +14,9 % | 531 / 531 |
| Diffusion entre tailles (H-FA22) | 284 k / 284 k | +17,5 % / +16,8 % | +14,8 % / +14,1 % | 531 / 531 |
| Revenus (H-FA3) | 267 k / 296 k | +16,8 % / +17,4 % | +14,1 % / +14,7 % | 485 / 569 |
| Montée en gamme (H-FA14) | 284 k / 284 k | +16,9 % / +17,4 % | +14,2 % / +14,7 % | 520 / 543 |
| Prime de liberté (H-FA13) | 275 k / 294 k | +17,0 % / +17,4 % | +14,3 % / +14,7 % | 514 / 552 |
| Refus bancaire (H-FA12) | 282 k / 285 k | +17,0 % / +17,3 % | +14,3 % / +14,7 % | 528 / 535 |
| Répartition des jeunes par secteur (H-FA7) | 284 k / 265 k | +17,2 % / +16,9 % | +14,5 % / +12,2 % | 531 / 513 |
| Adhérents (H-FA16) | 282 k / 285 k | +17,1 % / +17,2 % | +14,4 % / +14,5 % | 527 / 535 |
| Surcoût du prêt bancaire sur usufruit (H-FA15) | 284 k / 283 k | +17,2 % / +17,1 % | +14,5 % / +14,4 % | 532 / 531 |
| Part des bailleurs qui vendent (H-FA33) | 284 k / 284 k | +17,2 % / +17,2 % | +11,0 % / +16,8 % | 531 / 531 |
| Rotation locative (H-FA31) | 284 k / 284 k | +17,2 % / +17,2 % | +14,5 % / +14,5 % | 531 / 531 |
| Suppression des avantages en cours (H-FA34) | 284 k / 284 k | +17,2 % / +17,2 % | +13,5 % / +15,5 % | 531 / 531 |
| Coût de l'argent de la foncière (H-FA41) | 284 k / 284 k | +17,2 % / +17,2 % | +14,5 % / +14,5 % | 531 / 706 |

Référence centrale : 284 k jeunes, +17,2 %, +14,5 %, 531 Md€.

**Lecture.** Les hypothèses sont classées par leur effet sur la hausse des prix. L'élasticité de l'offre et la part qui veut se fixer portent l'essentiel ; pour la dette, le coût de l'argent domine ; pour l'effet net des deux réformes, la part des bailleurs qui vendent (non sourcée) pèse autant que les élasticités. Les hypothèses les mieux sourcées (revenus, âge au premier emploi stable) pèsent moins que les hypothèses de comportement, qui ne le sont pas.

## 11. Expérimentation, clause de sortie, garantie à la génération du lancement, capacité de rénovation

Décisions de l'auteur (09/11) : cinq ans d'expérimentation avec des « bâtisseurs » d'une vingtaine d'années, en alternance dans la filière publique de rénovation, formés avec les fédérations compagnonniques ; ils rénovent leur logement (et ceux de leur promotion) et y entrent dès qu'il est rénové, vers 21 ans ; critères d'arrêt et de généralisation écrits d'avance ; en cas d'abandon, rachat de la nue-propriété ; garantie à ceux qui ont 20 ans au lancement. Hypothèses H-FA70 à H-FA84 (`methode.md`).

### 11.1 Le cas type d'un bâtisseur (T2 de 40 m², passoire achetée 12 % sous le prix, rénovée en matériaux seulement)

Capital de départ : 30 332 € (moyenne de la moitié qui hérite le moins). Revenus nets : alternant de 20 ans, 1re année 803 € ; 21 ans, 2e année 1 094 €, 3e année 1 341 € (barème légal, service-public F2918, contrats depuis le 01/03/2025) ; ouvrier qualifié à la sortie 1 360 € (Céreq). Mensualités à 3,32 % sur 25 ans à partir de l'entrée dans le logement.

| Secteur | Achat (€) | Matériaux (€) | Financé par la foncière (€) | Mensualité (€) | Effort, alternant 2e année | Effort, alternant 3e année | Effort, ouvrier qualifié | Loyer de marché (€) |
|---|---|---|---|---|---|---|---|---|
| Métropole (secteur tendu) | 128 000 | 10 800 | 87 648 | 430 | 42 % | 34 % | 34 % | 735 |
| Ville moyenne | 95 200 | 10 800 | 59 768 | 293 | 29 % | 24 % | 23 % | 558 |
| Rural | 106 982 | 10 800 | 69 782 | 343 | 34 % | 27 % | 27 % | 490 |

**Lecture.** En ville moyenne et dans le rural, la mensualité d'un bâtisseur reste sous 35 % de son revenu, même pendant l'alternance ; en métropole, elle dépasse 35 % tant qu'il est alternant, et passe dessous une fois embauché. Le chantier comme lieu de formation baisse surtout le coût des travaux (main-d'œuvre fournie par la promotion, déjà payée comme formation : pas de double compte).

Deux régimes de revenus (€ par mois) : **système proposé** (revenu complété jusqu'au plancher de 877 €, part logement de 250 € retirée avec le revenu et maintenue pendant le remboursement, H-FA75 ; la fonction des revenus du chapitre 4 n'est pas dans la copie : approximation) ; **droit actuel** (aide au logement du locataire, ⚠️ montant non calculé au barème ; aucune aide pour un accédant depuis 2018). Coût du logement en accession = mensualité + contribution + entretien.

| Secteur | Revenu | Coût en accession | Loyer du même logement | Système : reste à vivre en accession | Système : reste à vivre en location | Système : effort en accession | Droit actuel, aide maintenue : reste à vivre en accession | Droit actuel : en location (aide comprise) | Droit actuel : effort en accession | Sensibilité : reste à vivre si l'aide était perdue | Coût du maintien de l'aide (€ par jeune et par an) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Métropole (secteur tendu) | alternant 2e année | 546 | 735 | 650 | 462 | 46 % | 728 | 539 | 43 % | 548 | 2 160 |
| Métropole (secteur tendu) | ouvrier qualifié | 546 | 735 | 881 | 692 | 38 % | 976 | 787 | 36 % | 814 | 1 944 |
| Ville moyenne | alternant 2e année | 382 | 558 | 815 | 638 | 32 % | 892 | 715 | 30 % | 712 | 2 160 |
| Ville moyenne | ouvrier qualifié | 382 | 558 | 1 045 | 868 | 27 % | 1 140 | 964 | 25 % | 978 | 1 944 |
| Rural | alternant 2e année | 441 | 490 | 756 | 706 | 37 % | 833 | 784 | 35 % | 653 | 2 160 |
| Rural | ouvrier qualifié | 441 | 490 | 986 | 937 | 31 % | 1 081 | 1 032 | 29 % | 919 | 1 944 |

**Lecture.** La bonne comparaison est mensualité contre loyer : dans les trois secteurs, le bâtisseur garde plus en accédant qu'en louant, dans les deux régimes ; le taux d'effort dépasse pourtant 35 % en métropole pendant l'alternance, ce qui montre que ce critère bancaire est mal adapté à un revenu qui va monter. Hypothèse centrale (décision de l'auteur) : l'aide au logement est maintenue pendant l'accession, par la loi d'expérimentation, alors que le droit actuel ne la verse plus aux accédants depuis 2018 ; son maintien coûte de l'ordre de 2 160 € par jeune et par an pendant l'alternance, soit ≈ 2,2 M€ par an pour une promotion de 1 000 (moins ensuite, l'aide baissant avec le salaire). Ce n'est pas un coût net : en location, le même jeune la toucherait aussi. Si elle était perdue (sensibilité), le reste à vivre baisse d'autant.

### 11.2 Coût et dette d'une expérimentation de cinq ans (M€ cumulés, central)

| Jeunes par an | Territoire | Logements | Formation (coût net, batisseurs-et-repas) | Capital de départ | Gestion et accompagnement | Coût public total | Dette de la foncière au bout de 5 ans | Mensualités reçues |
|---|---|---|---|---|---|---|---|---|
| 300 | Métropole (secteur tendu) | 1 500 | 51 | 45 | 8 | 105 | 161 | 15 |
| 300 | Ville moyenne | 1 500 | 51 | 45 | 8 | 105 | 112 | 11 |
| 300 | Rural | 1 500 | 51 | 45 | 8 | 105 | 130 | 12 |
| 1 000 | Métropole (secteur tendu) | 5 000 | 170 | 152 | 27 | 349 | 535 | 51 |
| 1 000 | Ville moyenne | 5 000 | 170 | 152 | 27 | 349 | 375 | 35 |
| 1 000 | Rural | 5 000 | 170 | 152 | 27 | 349 | 432 | 41 |
| 3 000 | Métropole (secteur tendu) | 15 000 | 510 | 455 | 81 | 1 046 | 1 606 | 154 |
| 3 000 | Ville moyenne | 15 000 | 510 | 455 | 81 | 1 046 | 1 124 | 105 |
| 3 000 | Rural | 15 000 | 510 | 455 | 81 | 1 046 | 1 297 | 123 |

Ville moyenne, 1 000 jeunes par an : coût public 195 à 619 M€ (bas–haut ; chantier de 6 à 18 mois, formation nette de 5 à 92 k€ par formé). **La formation est le premier poste du coût public** ; la dette de la foncière, de 75 à 110 k€ par logement selon le secteur, est adossée aux logements et aux créances sur les jeunes.

### 11.2 bis Une seule ville, avec son institut de formation (résultat principal ; ville non choisie)

Promotion réaliste pour un institut qui démarre (⚠️ hypothèse), logements rénovés par an rapportés aux ventes annuelles et au stock de logements E, F, G (30 % des résidences principales) d'une ville type (⚠️ ordres de grandeur à remplacer par les données DVF et du recensement de la ville choisie).

| Ville | Promotion par an | Ventes par an | Part des ventes | Logements E-F-G | Part du stock E-F-G rénovée par an | Effet attendu sur les prix | Coût public sur 5 ans (M€) | Dette de la foncière à 5 ans (M€) |
|---|---|---|---|---|---|---|---|---|
| Métropole régionale (exemple : Grenoble) | 300 | 2 338 | 12,8 % | 26 100 | 1,1 % | +12,0 % | 105 | 161 |
| Ville moyenne | 100 | 1 500 | 6,7 % | 9 000 | 1,1 % | +5,7 % | 35 | 37 |
| Petite ville | 30 | 300 | 10,0 % | 1 800 | 1,7 % | +6,0 % | 10 | 13 |

**Lecture.** Dans une seule ville, la promotion représente quelques pour cent des ventes : l'effet attendu sur les prix est de l'ordre d'un à quelques points, ce qui peut se voir dans une petite ville (où il peut aussi faire monter les prix) mais se confond avec le bruit dans une métropole. Une seule ville **ne permet pas** de comparer marchés tendus et détendus, et les résultats peuvent tenir à la ville choisie (marché, municipalité, entreprises locales). Elle permet de mesurer la formation, les chantiers, les impayés, l'énergie et la tenue des comptes. **Critères de choix proposés** : une ville moyenne (là où la demande des jeunes pèsera le plus après généralisation) ; part de logements E-F-G au-dessus de la moyenne ; une implantation compagnonnique existante ; des ventes DVF suffisantes pour un indice de prix fiable ; une **ville témoin** de même taille, même zone, même tendance de prix sur 5 ans et même part de passoires, sans dispositif, choisie et publiée avant le lancement. Les variantes à plusieurs territoires (ci-dessous) restent la référence pour comparer.

### 11.2 ter Un exemple chiffré parmi d'autres : Grenoble (la ville n'est pas choisie)

La règle fixée par l'auteur est seulement : une ville candidate, volontaire, de taille intermédiaire de préférence, qui dispose de locaux pour la formation. Grenoble est un exemple avec des données réelles, pas un choix. Quelle que soit la ville, la foncière n'achète aucun bien d'un responsable du projet ni de ses proches pendant l'expérimentation, ou seulement sous évaluation indépendante publiée.

Ventes d'un seul logement en 2024 (DVF, `donnees/grenoble.csv`, prix médians en €) :

| Zone | Ventes | Part d'appartements | Prix/m² appartement | T1 | T2 | T3 | T4 |
|---|---|---|---|---|---|---|---|
| Grenoble (commune) | 2 338 | 97 % | 2 500 | 78 425 | 120 150 | 165 000 | 185 000 |
| Grenoble-Alpes Métropole (22 communes principales) | 4 728 | 87 % | 2 442 | 76 770 | 120 000 | 165 375 | 185 000 |
| Clermont-Ferrand | 1 913 | 84 % | 2 065 | 58 900 | 92 750 | 134 500 | 152 000 |
| Dijon | 2 697 | 88 % | 2 552 | 73 500 | 108 550 | 152 000 | 187 000 |
| Médiane des grandes métropoles (secteur du modèle) | 212 308 | — | 3 560 | 111 000 | 160 000 | 218 400 | 270 000 |

À Grenoble, le m² d'appartement (2 500 €) est au niveau des villes moyennes, sous la médiane des grandes métropoles (3 560 €), voisin de Dijon et au-dessus de Clermont-Ferrand ; loyer d'annonce 15,7 €/m² (rendement brut ≈ 7,5 % contre 6,2 % en médiane des métropoles) ; 18 % des DPE d'appartements récents en E, F ou G. Bâtisseur : achat 96 120 €, mensualité 297 € contre un loyer de 627 € ; une promotion de 300 par an ferait 13 % des ventes d'un seul logement de la commune (coût public sur 5 ans 105 M€). En une phrase pour chaque point local : dans une ville d'appartements en copropriété, le rénovateur ne traite seul que l'intérieur (isolation intérieure, ventilation, chauffage individuel), l'enveloppe relève d'un vote, ce qui limite le gain à une ou deux classes sauf achat d'un immeuble entier ; l'encadrement des loyers s'y applique déjà en partie (Service-public F1314, via `loyers-energie`) ; la ville témoin se choisit et se publie avant le lancement, de même taille et de même tendance de prix.

### 11.3 Ce que cinq ans permettent d'apprendre

Prix locaux : effet attendu (demande des bâtisseurs / ventes des communes traitées × réponse du prix) comparé au plus petit effet détectable (communes témoins deux fois plus nombreuses, écart-type des évolutions communales de 6 % ⚠️, risque 5 %, puissance 80 %).

| Jeunes par an | Communes traitées | Effet attendu sur les prix | Plus petit effet détectable | Détectable ? |
|---|---|---|---|---|
| 300 | 10 | +1,5 % | 6,5 % | non |
| 300 | 30 | +0,5 % | 3,8 % | non |
| 300 | 100 | +0,1 % | 2,1 % | non |
| 1 000 | 10 | +4,9 % | 6,5 % | non |
| 1 000 | 30 | +1,6 % | 3,8 % | non |
| 1 000 | 100 | +0,5 % | 2,1 % | non |
| 3 000 | 10 | +14,8 % | 6,5 % | oui |
| 3 000 | 30 | +4,9 % | 3,8 % | oui |
| 3 000 | 100 | +1,5 % | 2,1 % | non |

| Indicateur | 300 / an | 1 000 / an | 3 000 / an | Remarque |
|---|---|---|---|---|
| Impayés (précision à ±, taux annuel de 1 %) | 0,56 % | 0,31 % | 0,18 % | contrats-années ≈ 4 × promotion |
| Emploi à la sortie (précision à ±, 65 %) | 3,1 % | 1,7 % | 1,0 % | trois promotions sorties ; sans groupe témoin tiré au sort, l'effet propre n'est pas mesurable |
| Achèvement de la formation (précision à ±, 70 %) | 2,6 % | 1,4 % | 0,8 % |  |
| Énergie économisée | mesurable logement par logement | mesurable logement par logement | mesurable logement par logement | relevés avant et après ; l'écart réel est souvent moitié du conventionnel (H16 de batisseurs-et-repas) |
| Part des coûts couverte (test des 50 %) | comptable, exacte | comptable, exacte | comptable, exacte | mais à l'échelle d'essai : ne dit rien du coût de l'argent d'une foncière de 500 Md€ |

**Lecture, franchement.** Avec 300 à 3 000 jeunes par an, l'expérimentation peut mesurer les impayés, l'achèvement de la formation, l'emploi à la sortie (à condition de tirer au sort entre candidats pour avoir un groupe témoin), l'énergie économisée et la tenue des comptes. Elle **ne peut pas** mesurer l'effet sur les prix d'un dispositif ouvert à un tiers d'une génération : à cette échelle, l'effet local est sous le seuil de détection dès qu'on répartit les bâtisseurs sur plus de quelques communes, et s'il est détectable c'est qu'on les a concentrés (ce qui fait monter les prix localement). Elle ne dit rien non plus de l'effet d'appel, du comportement des banques, ni du coût de l'argent à grande échelle. Ces trois points se décident sur modèle, pas sur essai.

### 11.4 Clause de sortie en cas d'abandon (règle retenue : variante 2)

Cas type du bâtisseur en ville moyenne, € de l'année de sortie. « Jeune » = ce qu'il a gagné ou perdu par rapport à la location du même logement pendant ces années (loyers évités − mensualités, contribution et entretien payés, + valeur acquise) ; « collectivité » = position nette de la foncière et de l'État (dette de portage, capital versé, ce qui est récupéré). (1) contrat honoré jusqu'au décès ; (2) **rachat de la nue-propriété au prix fixé à l'entrée ((1 − f) × transaction) et remboursement du capital de départ**, le jeune devient propriétaire ordinaire ; (2 bis) même rachat étalé sur la durée restante du contrat aux mêmes conditions ; (3) revente et solde : le jeune récupère le capital remboursé et la valeur de ses travaux.

| Années de mensualités | (1) jeune | (1) collectivité | (2) jeune | (2) collectivité | (2) somme du rachat | (2 bis) mensualité étalée | (2 bis) effort | (3) jeune | (3) collectivité |
|---|---|---|---|---|---|---|---|---|---|
| 3 | 6 864 | -2 395 | 19 857 | -2 130 | 101 157 | 540 | 37 % | 22 507 | -10 487 |
| 5 | 12 313 | -1 604 | 34 592 | -3 666 | 97 651 | 557 | 36 % | 31 462 | -6 533 |
| 10 | 29 255 | 450 | 77 148 | -7 959 | 87 796 | 620 | 34 % | 58 259 | 4 146 |

Rachat étalé après 5 ans, par secteur (bâtisseur, ouvrier qualifié) :

| Secteur | Mensualité avant | Somme du rachat | Mensualité après rachat étalé | Effort |
|---|---|---|---|---|
| Métropole (secteur tendu) | 430 | 126 556 | 722 | 47 % |
| Ville moyenne | 293 | 97 651 | 557 | 36 % |
| Rural | 343 | 108 033 | 617 | 40 % |

Part des entrants du dispositif généralisé (section 2) pour qui la mensualité du rachat étalé dépasserait 35 % du revenu : après 3 ans 34 %, après 5 ans 28 %, après 10 ans 18 % (revenus +3,5 % par an ⚠️). Pour eux, la règle doit prévoir le **maintien du droit signé** (variante 1).

**Lecture.** La variante 2 est la plus favorable au jeune quand les prix ont monté (il rachète à un prix fixé à l'entrée) et elle rembourse la collectivité de ce qu'elle a avancé ; c'est aussi la plus coûteuse en manque à gagner pour la collectivité, qui cède la hausse des prix au jeune. Son point faible est celui qu'a relevé l'auteur : le jeune que les banques refusaient ne peut pas financer d'un coup le rachat ; étalé par la foncière (ou l'organisme qui lui succède), il fait monter la mensualité de près de moitié, au-delà de 35 % pour une part notable : ceux-là gardent leur droit d'usufruit. La variante 3 ne lèse pas le jeune sur ses travaux mais le fait déménager ; la variante 1 laisse un parc public s'éteindre sur 60 ans. Dans tous les cas, la compétence acquise reste au jeune.

### 11.5 La garantie à ceux qui ont 20 ans au lancement

Règle : si l'expérimentation aboutit (généralisation à l'an 5), tous ceux qui avaient 20 ans ou moins au lancement (25 ans ou moins à la généralisation) ont droit au dispositif ; **le droit ne s'éteint jamais du seul fait de la file** (borne d'âge suspendue pendant l'attente) ; un jeune non servi peut choisir à tout moment la forme adossée (moitié du capital en parts à vie). Transition de `capital-de-depart-options` (fonction `transition`, règle « générations entrantes », borne d'âge levée), entrants de la section 2.

| Capacité d'entrée | Droit réalisé, génération des 20 ans | Attente moyenne (ans) | Droit réalisé, générations suivantes (moyenne) | Attente moyenne | Pic d'entrées par an | File résorbée (année) | Capital, 5 premières années (Md€) | Besoin de financement, 5 premières années (Md€) |
|---|---|---|---|---|---|---|---|---|
| Capacité = demande + 10 %, montée 5 ans | 92 % | 1,9 | 100 % | 1,6 | 312 k | 36 | 14,8 | 62 |
| Capacité = demande + 10 %, montée 10 ans | 92 % | 2,6 | 100 % | 4,0 | 312 k | 55 | 5,8 | 23 |
| Plafond « prix » (7.2), montée 8 ans | 92 % | 4,8 | 28 % | 28,8 | 55 k | > 60 | 1,6 | 5 |

**Lecture.** Si la capacité suit la demande (≈ 284 000 jeunes par an), la génération des 20 ans est servie (le reste avait acheté à la banque) après deux à trois ans d'attente, et les suivantes aussi ; mais c'est le scénario de la section 4, avec sa hausse des prix. **Avec le plafond « prix » de la section 7.2**, la génération des 20 ans est encore servie, parce que les plus âgés passent en premier et que son droit ne s'éteint pas (attente de l'ordre de cinq ans) ; ce sont **les générations suivantes qui paient la promesse** : un peu plus d'un quart seulement de leur demande est servi, après des décennies d'attente, la file ne se résorbant jamais. Tenir la promesse sans casser le plafond suppose que la plupart des générations suivantes prennent la forme adossée (parts à vie) au lieu du logement. Il faut donc choisir, et le dire avant le lancement : promettre l'accès à tous et accepter la hausse des prix, ou plafonner et promettre seulement un droit à attendre. Ceux qui avaient 21 à 35 ans au lancement sont hors promesse : de l'ordre de 2,8 million de jeunes qui auraient demandé (sans accès bancaire) ; les inclure coûterait environ 66 Md€ de capital de départ et autant de file d'attente en plus.

### 11.6 La capacité de rénovation comme contrainte de l'ouverture

Une rénovation d'ampleur demande 0,35 année-ETP (H5 de batisseurs-et-repas, 0,28 à 0,45, ⚠️ V32308) ; 60 % des formés restent dans la filière un an après, puis 8 % partent chaque année (H14, H15) ; 40 % des logements entrants sont à rénover (E, F, G ; 15 % si seuls F et G). Promotions constantes à partir du lancement.

| Promotion par an | Scénario | Bâtisseurs actifs an 5 | Entrées permises an 5 | an 10 | Entrées an 10 | an 20 | Entrées an 20 | Ce qui limite à l'an 10 (capacité ou prix) |
|---|---|---|---|---|---|---|---|---|
| 300 | bas | 779 | 24,1 k | 1 553 | 48,1 k | 2 615 | 81,0 k | capacité |
| 300 | central | 638 | 5,9 k | 1 188 | 11,0 k | 1 789 | 16,6 k | capacité |
| 300 | haut | 450 | 2,6 k | 769 | 4,4 k | 1 026 | 5,9 k | capacité |
| 1 000 | bas | 2 597 | 80,4 k | 5 177 | 160,3 k | 8 717 | 270,0 k | prix |
| 1 000 | central | 2 127 | 19,8 k | 3 959 | 36,8 k | 5 962 | 55,4 k | capacité |
| 1 000 | haut | 1 501 | 8,7 k | 2 563 | 14,8 k | 3 419 | 19,8 k | capacité |
| 3 000 | bas | 7 791 | 241,3 k | 15 530 | 481,0 k | 26 151 | 810,0 k | prix |
| 3 000 | central | 6 381 | 59,3 k | 11 876 | 110,4 k | 17 885 | 166,2 k | prix |
| 3 000 | haut | 4 503 | 26,0 k | 7 690 | 44,5 k | 10 258 | 59,3 k | capacité |

| Ouverture visée (part d'une génération) | Jeunes par an | Bâtisseurs nécessaires | Promotion annuelle en régime |
|---|---|---|---|
| 5 % | 42 k | 4 466 | 595 |
| 10 % | 83 k | 8 932 | 1 191 |
| 20 % | 166 k | 17 865 | 2 382 |

**Lecture.** Le plafond « prix » de la section 7.2 (50 000 jeunes par an) est atteint par la capacité de rénovation avec des promotions de l'ordre de 1 000 à 3 000 par an, au bout de cinq à dix ans : **au début, c'est la capacité qui limite ; ensuite, ce sont les prix.** Pour ouvrir à 10 ou 20 % d'une génération, il faut des promotions de plusieurs milliers par an pendant dix ans. Repère : les Compagnons du Devoir forment plus de 11 000 jeunes par an dans 35 métiers et ont signé 2 552 nouveaux contrats en juin 2024 (sources d'acteur, C ; part du bâtiment non publiée ; Fédération et Union compagnonniques non chiffrées ⚠️). Une promotion de 300 par an est réaliste dès le départ ; 1 000 demanderait d'absorber de l'ordre de 40 % de leurs entrées annuelles, donc une montée sur plusieurs années ; 3 000 dépasse leurs entrées actuelles et suppose d'autres organismes (centres de formation du bâtiment, AFPA). Ne pas confondre avec l'association Compagnons Bâtisseurs (auto-réhabilitation accompagnée).

### 11.7 Seuils écrits d'avance (proposition)

| Indicateur | Généraliser si | Arrêter si | D'où viennent les bornes |
|---|---|---|---|
| Part des coûts couverte par les recettes (moyenne sur 3 ans) | ≥ 50 % | < 35 % | test d'Eurostat ; au central 48 %, au bas 48 %, au haut (argent à 4,7 %) 32 % |
| Impayés (perte annuelle sur l'encours) | ≤ 0,5 % | > 1 % | H-FU27 (0,2 / 0,5 / 1 %) |
| Écart de prix avec les communes témoins | ≤ +2 % | > +5 % | bande neutre (7.1) et contrainte de prix (7.2) ; à n'utiliser que si la taille rend l'écart détectable (11.3) |
| Achèvement de la formation | ≥ 70 % | < 50 % | ⚠️ non sourcé (ruptures de contrats d'apprentissage : Dares, non relu) |
| Emploi à la sortie (6 mois) | ≥ 65 % | < 50 % | ⚠️ ordre de grandeur de l'insertion des apprentis, non relu ; groupe témoin tiré au sort |
| Énergie économisée réelle / conventionnelle | ≥ 50 % | < 30 % | H16 de batisseurs-et-repas (0,7 / 0,5 / 0,3) |

**Lecture.** Le seul seuil que l'expérimentation ne peut pas tester honnêtement est celui des prix à grande échelle (11.3) : il faut l'écrire comme une règle de pilotage de la généralisation (le plafond d'entrées baisse si l'écart avec les communes témoins dépasse la borne), pas comme un critère d'essai.

## 12. Ce que ces chiffres ne disent pas

- Ce sont des **effets de niveau** atteints en 5 à 10 ans, pas une trajectoire ; ni récession, ni choc de taux, ni construction induite au-delà de l'élasticité.
- Les comportements (vouloir se fixer, refus bancaires, ventes des bailleurs, montée en gamme) sont des règles de décision, pas des estimations : les parts sont des hypothèses mises en forme.
- Le plafond de loyer est pris du scénario central de `loyers-energie` (cinq villes témoins), étendu aux secteurs ; la contribution sur le patrimoine des bailleurs (chapitre 3) n'est pas modélisée et pourrait faire vendre bien plus.
- La foncière est simulée avec un prix moyen national (fonciere.py) ; les prix montent dans la section 4 mais la simulation financière ne les reprend pas (une hausse de 10 % des prix d'achat augmente la dette d'environ 10 % × (1 − f) des achats, et la valeur des logements rendus).
- Paris : presque personne n'entre ; les conclusions sur Paris portent sur la réforme locative.

