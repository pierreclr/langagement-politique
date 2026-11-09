---
titre: D'où viennent les 9 points de prélèvements obligatoires (42,7 % → 51,6 % du PIB) : décomposition et indicateurs comparables
date: 2026-11-08
statut: décomposition reproductible du système arrêté (couches DECISIONS0811 et CORRECTION0811, différé corrigé le 08/11/2026), central, régime de croisière, Md€ par an, euros 2024-2025 sans croissance ; ordres de grandeur sous hypothèses, jamais des prédictions ; non intégré aux chapitres
---

# D'où viennent les 9 points de prélèvements obligatoires

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 08/11/2026. **Reproduire** : `python3 -I sources/calculs/decomposition_prelevements_0811.py` (« Tests : tous passés » ; relit `bilan_global.py`, couches DECISIONS0811 et CORRECTION0811, et n'en recopie aucun chiffre). **Mise à jour du 08/11/2026 (nuit) : le double compte du report d'encaissement est corrigé (V32012, V32018 ; `modeles/systeme-ideal/correction_0811.js`) ; les leviers de la règle de dette passent de 52,76 à 33,27 Md€, donc les prélèvements de 52,2 à 51,6 % du PIB et la réduction du déficit en régime de 132,7 à 113,2 Md€ ; les dépenses ne bougent pas, ni les lignes « à déficit inchangé ».**. Convention : Md€ par an ; points = % du PIB 2024 (2 935 Md€, Insee) ; **fait sourcé** / **estimation** (méthode dite) / **opinion** ; ⚠️ = non vérifié ou non isolé dans le modèle.

## Méthode : pourquoi la mesure officielle compare mal

Le taux de prélèvements obligatoires (PO) compare deux systèmes qui n'écrivent pas leurs comptes de la même façon. Trois biais, du plus gros au plus petit.

1. **Le déficit est financé par l'emprunt aujourd'hui, par l'impôt demain.** En 2024 l'État dépense 169,1 Md€ de plus qu'il ne reçoit (Insee, comptes des administrations publiques, t. 3.201). Le système arrêté réduit ce déficit à environ 56 Md€ en régime (1,9 % du PIB) : **113,2 Md€ de prélèvements en plus (3,9 points) servent à ne plus emprunter**, pas à dépenser. C'est le biais le plus lourd.
2. **Un allègement réduit les prélèvements, un versement s'écrit en dépense.** Aujourd'hui, 64,9 Md€ d'allègements généraux de cotisations (PLFSS 2026, cote A), le quotient familial, la décote ou les crédits d'impôt diminuent les prélèvements : ils n'apparaissent nulle part en dépense. Dans le système, la même idée (un versement à chaque adulte, par enfant, un plancher) est écrite comme un versement : elle gonfle les prélèvements bruts **et** la dépense publique du même montant. Rien n'est pris aux ménages en plus : l'écriture change. Une mesure honnête retranche les transferts reçus.
3. **Les mutuelles et la complexité sont hors prélèvements aujourd'hui.** 46,5 Md€ de complémentaires santé (dont 75 % de contrats obligatoires, ⚠️ borne 50-100 %), environ 10 Md€ de paiements réglementés (notaires, greffes, annonces légales), les commissions des titres-restaurant, et un coût de la complexité des règles fiscales et sociales (estimation du dépôt : 41 Md€ par an, fourchette 25 à 57) sont payés par obligation, mais à des acteurs privés. Le système les internalise (Sécurité sociale à 100 %, prélèvement unique) : ils **entrent** dans les prélèvements. La lecture « élargie » du dépôt corrige déjà une partie (44,2 % → 51,9 %).

## 1. Du taux officiel à 51,6 % : où va l'argent (identité comptable)

Identité : **PO après − PO avant = (dépense après − dépense avant) + réduction du déficit − variation des recettes hors prélèvements**. Les recettes hors PO baissent de 16,9 Md€ (reclassement de crédits d'impôt et du CIR, corrections C02 et C03 du grand livre, solde nul : PO +16,9, dépense −16,9 ; ces deux lignes se compensent et sortent du pont). Fermeture vérifiée par le script : la dépense reconstruite ligne par ligne (toute la chaîne L, L510, L72, CORR, BASE, CONSO, D7, D8, leviers S3) égale la dépense déduite du solde, **reste nul** (écart < 0,01 Md€). Ce test valide la cohérence de la chaîne, pas la vérité des hypothèses de chaque ligne.

| | Md€ | Points de PIB | Statut |
|---|---|---|---|
| **PO aujourd'hui (2024)** | 1 253,2 | **42,7** | fait (Insee 3.216-3.217) |
| (c) Réduction du déficit : −169,1 → −55,9 en régime | +113,2 | +3,86 | estimation ; voir § 5 |
| (a1) Allègements généraux devenus versements | +64,9 | +2,21 | **comptable** (borne basse isolée) ; fait pour le montant (PLFSS 2026) |
| (a2) Autres versements en brut, nets des prestations remplacées | +103,4 | +3,52 | ⚠️ non isolé : mélange de comptable (quotient familial, décote, réductions d'impôt) et de redistribution réelle vers les bas revenus et les familles |
| (b) Sécurité sociale à 100 % (+21,2) nette des économies de santé (−10,4) | +10,8 | +0,37 | estimation (BT04, BT06, BT07, D11, D12) |
| (d) Nouvelles dépenses (gratuité urbaine 6,2, grand âge 4,1, protection de l'enfance 2,5, crèches 2,2, CIR réorienté 3,0, justice 1,1, imprévus 0,8, outre-mer et plancher en deux parts, net) | +17,5 | +0,60 | estimation, cote C |
| (e) Taxe d'artificialisation fléchée vers la renaturation (recette brute = dépense) | +6,5 | +0,22 | estimation ; neutre au solde |
| Retraites : dispositif V6 (âge libre, plancher, substitution), dépense en moins | −11,7 | −0,40 | estimation |
| Économies de dépense (structurelles −27,2 ; leviers de la règle de dette −17,0) | −44,1 | −1,50 | estimation |
| (f) Reste non expliqué | 0,0 | 0,00 | fermeture du modèle ; ne prouve pas l'exactitude des lignes |
| **PO dans le système (S3, régime)** | **1 513,7** | **51,6** | estimation, cote B |

Le total fait +260,5 Md€ (+8,87 points). Lecture : **sur les 8,9 points, 3,9 sont l'arrêt de l'emprunt, 5,7 sont des versements aux ménages écrits en brut (dont au moins 2,2 purement comptables), 1,2 sont des dépenses nouvelles, de santé ou fléchées (artificialisation), et 1,9 en moins viennent des économies et des retraites.** Les 9 points ne sont donc pas une charge nouvelle de 9 points pour les ménages. Ce que la mesure officielle ne montre pas : ces points restent financés par quelqu'un (hauts revenus, patrimoines, transmissions, crédit d'IS : voir les cas types, un cadre à 10 000 € brut perd 187 € par mois). C'est la question de la répartition, pas du niveau.

**Sources de l'argent.** Le pont ci-dessus classe l'emploi, pas l'origine. Une partie des recettes est une simple conversion d'avantages en salaire à coût employeur inchangé : titres-restaurant 3,4 + mutuelle part patronale 3,8 + transport 0,4 = **7,6 Md€ (0,26 point)** de prélèvements qui apparaissent sans que l'employeur paie plus (lignes BT09, CS01, CS02 ; BT08 vaut 0 au central).

**Note sur une estimation antérieure du 05/11** (+6,2 points de PIB nets, pour l'essentiel la fin du déficit de 169 Md€) : elle datait d'une version antérieure (v5.x). Le calcul actuel donne +8,9 points bruts et **+3,1 points nets des transferts**, dont 3,9 points d'arrêt de l'emprunt compensés de 0,7 point par les autres dépenses en baisse. L'idée reste exacte (l'essentiel est l'arrêt du déficit), mais « la fin du déficit » est trop forte : le déficit **ne disparaît pas**, il tombe à 1,9 % du PIB en statique de régime.

## 2. Indicateur comparable : prélèvements nets des transferts monétaires

Définition retenue : **PO moins prestations en espèces hors retraites** (chômage, RSA, ASS, prime d'activité, APL, famille, AAH, indemnités journalières aujourd'hui ; versements de la fonction des revenus, plancher, enfants, garantie de transition, compléments résiduels dans le système). Pourquoi hors retraites : les pensions sont comptées à l'identique des deux côtés (brutes, soumises aux prélèvements). Avantage : l'indicateur ne dépend pas de la convention d'écriture (un allègement ou un versement donnent le même résultat net).

| % du PIB (Md€) | Aujourd'hui | Système (régime) | Écart |
|---|---|---|---|
| Transferts monétaires hors retraites | 4,7 % (139,0) | 10,5 % (307,0) | +5,7 points |
| **PO − transferts** | **38,0 % (1 114,2)** | **41,1 % (1 206,7)** | **+3,1 points** |
| même indicateur, **à déficit inchangé** (169,1 Md€) | 38,0 % | **37,3 %** (1 093,5) | −0,7 point |
| Santé : PO − transferts − dépense publique de santé (261,2 → 272,0 ; ⚠️ santé = COFOG 2024 plus lignes BT04, BT06, BT07, D11, D12) | 29,1 % (853,0) | 32,5 % (954,2) | +3,4 points |

Détail des transferts après : versements 250,7 + RSA, famille et AAH résiduels 27,6 + garantie de transition (chômage et arrêts maladie) 28,7 (⚠️ 28,69 repris de `sources/garantie-transition.md` § 12). Avant : D02 à D08 (126,9) + indemnités journalières 12,1.
**Conclusion exacte** : à déficit inchangé, le système prélève **moins** (net des transferts) qu'aujourd'hui (37,3 contre 38,0 %) ; il prélève plus (41,1 contre 38,0 %) parce qu'il arrête d'emprunter à hauteur de 3,9 points.

## 3. Deux lectures côte à côte : officielle et réelle (central ; bornes entre parenthèses)

« Réelle » = tout ce que l'on paie **par obligation**, y compris ce qui passe par le privé et par la complexité. Lignes du prélèvement caché d'aujourd'hui (Md€/an) :

| Prélèvement caché | Aujourd'hui | Système | Source, cote |
|---|---|---|---|
| Complémentaires santé (cotisations HT, obligatoires et facultatives ; part obligatoire 34,9 si 75 %) | 46,5 | 0 | `sources/economies-cachees-et-transition.md` § 6.1, cote B ; ⚠️ part obligatoire inconnue (V17312), Sécurité sociale à 100 % sur le panier opposable, facultatif résiduel supposé nul |
| Prévoyance obligatoire d'entreprise, chèques-vacances | ⚠️ non chiffrés | | absents du dépôt |
| Paiements réglementés (notaires 9,8 ; greffes 0,22 ; annonces 0,19) | 10,2 | 9,7 | idem ; notaires −0,3, greffes et annonces −0,2 après |
| Commissions des titres-restaurant (0,35 à 0,56) | 0,4 | 0 | idem ; fin des titres-restaurant (arbitrage 50) |
| Billetterie des transports urbains supprimée par la gratuité | 4,6 | 0 | `bilan_global.py` (tu58_recettes) ; ⚠️ part payée par les ménages non isolée |
| Coût de la complexité (conformité fiscale et sociale des ménages et entreprises) | **41,2** (25,6 à 57,2) | **16,7** (15,5 à 11,8) | `modeles/industrie-complexite/resultats.md`, cote B ; ⚠️ la disparition de 24,5 (80 % au-dessus du meilleur précédent observé, Estonie 64 %) est une hypothèse |
| **Total caché** | **102,9** (87,3 à 118,9) | **26,4** (25,2 à 21,5) | |

| % du PIB | Aujourd'hui | Système | Écart |
|---|---|---|---|
| **Officielle** : prélèvements obligatoires | 42,7 % | 51,6 % | **+8,9** |
| Officielle élargie (mutuelles à 75 %, paiements réglementés) | 44,2 % | 51,9 % | +7,7 |
| **Réelle, brute** (PO + caché) | **46,2 %** (45,7 à 46,8) | **52,5 %** (52,4 à 52,3) | **+6,3** |
| **Réelle, nette des transferts** | **41,5 %** (40,9 à 42,0) | **42,0 %** (42,0 à 41,8) | **+0,5** (+1,1 à −0,2) |
| Réelle, nette, **à déficit inchangé** | 41,5 % | 38,2 % | **−3,3** |
| Réelle nette en % du revenu disponible brut des ménages (⚠️ RDB ≈ 1 700 Md€ non vérifié, en part du PIB si absent) | ≈ 71,6 % | ≈ 72,5 % | ≈ +0,9 |

**La conclusion attendue est-elle confirmée ?** Oui pour la lecture nette, **à nuancer pour la lecture brute**. Passer de +8,9 à +0,5 point se fait en deux étapes d'inégale solidité : retrancher les transferts (−5,7 points) est de la comptabilité, solide ; compter le prélèvement caché des deux côtés (−2,6 points : 102,9 → 26,4 Md€) repose sur une disparition de 24,5 Md€ de complexité qui est la partie la plus fragile (cote B, ⚠️). **Sans aucune disparition de complexité, l'écart réel net serait de +1,3 point** (au lieu de +0,5), toujours très inférieur aux neuf points officiels. En brut (sans retrancher les transferts), l'écart reste de **+6,3 points** : il n'est pas « bien plus faible » que 8,9, il est réduit d'environ trois dixièmes. Le nouveau système rend visible ce qui était caché : 87 à 119 Md€ passent de poches privées ou de temps perdu à des lignes publiques ou disparaissent ; c'est exact, mais seule la moitié du chiffre (les mutuelles, 46,5) est une dépense contrainte qui devient publique ; l'autre moitié (la complexité) est un coût qui disparaît en partie, pas un prélèvement.

## 4. La dépense publique en comptabilité nationale : « à peu près autant » est inexact

| % du PIB (Md€) | Avant (2024) | Système (régime) | Écart |
|---|---|---|---|
| Dépense publique (APU, Insee 3.201) | **57,0 %** (1 672,6) | **61,4 %** (1 803,0) | **+4,4 points** (+130,4) |
| à convention égale (les 64,9 d'allègements comptés en dépense avant) | 59,2 % (1 737,5) | 61,4 % | +2,2 points |
| hors transferts monétaires aux ménages | 52,3 % (1 533,6) | 51,0 % (1 496,0) | −1,3 point |

L'affirmation « le système dépense à peu près autant que l'État d'aujourd'hui » est **fausse en comptabilité nationale** : la dépense publique monte de 4,4 points parce que les versements sont comptés bruts (et que la Sécurité sociale passe à 100 % : +0,7 point). Elle est **vraie à une condition à dire** : hors versements aux ménages, l'État dépense moins (51,0 contre 52,3 % du PIB). Formulation correcte : « La dépense publique passe de 57,0 à 61,4 % du PIB parce que nous comptons en dépense les versements que le droit actuel déduit des prélèvements ; hors versements aux ménages, elle passe de 52,3 à 51,0 %. »

## 5. Le déficit : de combien, sur quel horizon

- **En régime (statique)** : −169,1 Md€ (5,8 %) → **−55,9 Md€ (1,9 %)**. Formule : solde de la base consolidée (−100,65) + effet des décisions du 07 et 08/11 (−3,17) + économies des leviers de la règle de dette (+14,64) + leviers de recettes S3 corrigés (+33,27) = −55,91 (avant la correction du différé : +52,76 et −36,42). **Le déficit n'est pas supprimé.**
- **Trajectoire macro de référence** : déficit 5,0 % en 2029, **encore au-dessus de 3 % jusqu'en 2057**, 2,9 % en 2058 (l'écart avec le statique : charge d'intérêts d'une dette à 125 %) ; dette 130,4 % en 2038 puis 124,6 % en 2058 (avant la correction : 132,6 % puis 113,4 %, mais cette baisse venait de l'extinction brutale des deux reports hérités en 2041, voir V32012). La règle retenue stabilise le ratio dette sur PIB, elle ne rembourse pas la dette.
- ⚠️ Le solde statique garde les intérêts de la dette de 2024 (58,9 Md€) : en régime avec dette à 125 % et taux plus élevés, il serait plus mauvais. Le passage de 169,1 à 55,9 est donc un haut de fourchette du progrès à l'horizon 2060 ; la trajectoire (2,9 %) est plus prudente.

## 6. Phrase publique (introduction) et paragraphe du chapitre 12

**Remplacement proposé pour la phrase de l'introduction (trois lignes).**
« Mesurés à la façon officielle, les prélèvements obligatoires passent d'environ 42,7 % à 51,6 % du PIB, mais cette mesure compare mal : nos versements aux ménages sont comptés en dépense alors que les allègements actuels réduisent les prélèvements, les mutuelles sont hors prélèvements, et le déficit de 169 Md€ est aujourd'hui payé par l'emprunt. Une fois les versements retranchés et ce qui était caché compté des deux côtés, ce que l'on paie par obligation passe d'environ 41,5 % à 42,0 % du PIB (+0,5 point) ; à déficit inchangé, il baisserait d'environ 3 points. »

**Proposition de paragraphe pour le chapitre 12.**
« D'où viennent les neuf points ? Sur +8,9 points de prélèvements obligatoires, 3,9 servent à ramener le déficit de 169 à environ 56 Md€ en régime (il ne disparaît pas : il reste au-dessus de 3 % du PIB jusqu'en 2057 et la dette n'est pas remboursée, seulement stabilisée). 5,7 points sont des versements aux ménages (un versement à chaque adulte, par enfant, un plancher) que nous écrivons en dépense, alors que le droit actuel les déduit des prélèvements sous forme d'allègements de cotisations (64,9 Md€ en 2024), de quotient familial et de crédits d'impôt : l'argent change d'écriture, pas de poche. Le reste (+1,2 point de santé et de dépenses nouvelles) est compensé par 1,9 point d'économies et de retraites. En comptabilité nationale la dépense publique passe de 57,0 à 61,4 % du PIB ; hors versements aux ménages, elle passe de 52,3 à 51,0 %. Mesuré net des transferts et en comptant des deux côtés les mutuelles, les paiements réglementés et le coût de la complexité, ce que l'on paie par obligation passe de 41,5 à 42,0 % du PIB, et de 41,5 à 38,2 % à déficit inchangé. Cette moyenne cache la répartition : un cadre à 10 000 € brut y perd 187 € par mois, un salarié au Smic gagne 96 €. »

## 7. Fragilités et ce que je ne sais pas (Claude)

1. **(a2) n'est pas isolé.** Je ne sais pas quelle part des 103,4 Md€ est comptable (quotient familial, décote, tranche à 0 %, réductions d'impôt : aucun montant dans le dépôt ⚠️) et laquelle est de la redistribution réelle. Le montant comptable est au moins de 64,9 (allègements) ; à l'auteur ou à une étude de décomposer le reste avec l'OpenFisca du dépôt.
2. **Le déficit en régime est statique** (voir § 5) et dépend des leviers de la règle de dette (14,6 Md€ d'économies de personnel et de fonctionnement, 33,3 Md€ de leviers de recettes). Si ces leviers ne sont pas votés, le déficit de régime est de 104 Md€ (3,5 %), pas de 56.
3. **Prévoyance obligatoire, chèques-vacances, péages réglementés** : non chiffrés ou non comptés par la base ; le prélèvement caché d'aujourd'hui est donc **sous-estimé**, ce qui joue contre ma conclusion (en faveur d'un écart réel encore plus faible), pas pour elle.
4. **Le coût de la complexité n'est pas un prélèvement** au sens strict (temps de travail et marché des cabinets) : l'inclure dans une lecture « réelle » est un choix de présentation que le lecteur doit pouvoir refuser ; je donne donc aussi la lecture sans complexité (+1,3 point net sans disparition, +0,5 avec).
5. **Complémentaires après : zéro supposé.** Si une partie des Français garde une complémentaire facultative, le prélèvement caché du système est plus élevé (jusqu'à 46,5 Md€ de plus au pire, aucun ne passant par le public).
6. **Dénominateur « revenu des ménages »** : le RDB (≈ 1 700 Md€) n'est pas dans le dépôt ⚠️ ; à vérifier (Insee, comptes nationaux 2024) avant publication. Une partie des prélèvements est payée par les entreprises, pas par les ménages.
7. **Biais possible de ma part** : j'ai tendance à vouloir produire un chiffre rassurant. Les trois choix qui font le plus baisser l'écart (compter la complexité, la disparition à 80 %, le zéro de complémentaires) sont aussi ceux que je ne peux pas vérifier. Les deux solides sont : l'arrêt de l'emprunt (3,9 points) et la retranche des transferts (5,7 points).

## 8. Sources mobilisées

| Source | Ce qu'elle établit | Cote |
|---|---|---|
| Insee, comptes des administrations publiques 2024, t. 3.201, 3.216-3.217 (via `bilan_global.py`) | PO 42,7 % (1 253,2), dépense 57,0 %, déficit 169,1, recettes hors PO | A |
| PLFSS 2026, annexe sur les allègements généraux (via `sources/economies-cachees-et-transition.md`) | 64,9 Md€ d'allègements en 2024 | A |
| `sources/calculs/bilan_global.py` (DECISIONS0811, CORRECTION0811, CONSO0611) et `modeles/systeme-ideal/resultats_correction_0811.txt` | PO 51,6 %, leviers S3 33,27, lignes de la chaîne, trajectoire du déficit | B (modèle du dépôt, tests passés) |
| `sources/economies-cachees-et-transition.md` § 6.1 (46,5 Md€ de complémentaires ; notaires, greffes, annonces ; titres-restaurant) | prélèvements élargis et prélèvement caché | B ; conflits d'intérêts : chiffres France Assureurs relayés pour les assurances, cote C |
| `modeles/industrie-complexite/resultats.md` | 41 Md€ (25-57) de coût de complexité, dont 24,5 qui disparaissent | B ; hypothèses de Claude, ⚠️ |
| `sources/garantie-transition.md` § 12 | garantie de transition à 28,7 Md€ contre 49,2 | C |

**Note du 08/11/2026 (banc d'essai commun, mise à jour après la correction du différé) : 113,2 Md€ ici, 113 Md€ dans `modeles/banc-programmes/resultats.md`.** Les deux chiffres se rejoignent depuis la correction du double compte du report d'encaissement (V32012, V32018) : avant, ce document donnait 132,7 Md€ et le banc 113 Md€, parce que la trajectoire de nos modèles sautait de +24,4 Md€ entre 2040 et 2041 (deux reports hérités de la v5 qui s'éteignaient ensemble). Il n'y a plus de saut (−0,2 Md€). Ici, 113,2 Md€ est écrit en euros de 2024 sans croissance, sur le PIB de 2024, en régime statique ; le banc lit l'effet en 2038, en euros de 2025 constants, trajectoire comprise (coût de trésorerie du différé, hypothèse HC1). Détail : `modeles/banc-programmes/resultats.md` § 1.
