# Fiscalité d'orientation : résultats

Tâche T8 · 2026-10-25 · méthode : [`methode.md`](methode.md) · chiffres reproduits par `jsc modele.js test_modele.js`

**Ce sont des ordres de grandeur conditionnels aux hypothèses H1 à H20, pas des prévisions.**

Le paquet central comprend :
- 0 % de TVA sur l'alimentation hors viande et poisson, sur l'eau et sur les médicaments ;
- des hausses de prix par accise : viande +25 %, carburants +15 %, gaz et fioul +15 %, billets d'avion +60 %, voitures lourdes +25 %.

Le scénario « règles européennes dépassées » ajoute une taxe carbone de 200 €/t sur toutes les importations de biens de consommation.

## 1. L'essentiel

- **Recettes nettes supplémentaires** :
  - **12 à 18 Md€ par an dans le cadre européen** (central 15 Md€) ;
  - 25 à 32 Md€ en dépassant les règles (central 29 Md€).
- **Valeur proposée pour le curseur « Fiscalité d'orientation en plus » du simulateur : 15 Md€** (conforme, central). Ce serait 30 Md€ dans le scénario hors règles.
- **Émissions évitées après effets rebond** : 7 à 19 Mt CO2e par an (central 12 Mt), soit **1 à 3 % de l'empreinte carbone** de la France (575 Mt en 2024). Le scénario hors règles **n'en évite pas davantage** : 4 à 18 Mt.
- **Par décile.**
  - Les taxes seules sont **régressives** : 2,1 % du revenu disponible pour le premier décile, 1,1 % pour le dernier.
  - Avec le 0 % sur la nécessité, la charge devient **à peu près proportionnelle** : 0,8 à 1,1 % du revenu dans tous les déciles.
  - Avec un reversement égal des recettes, le paquet devient **progressif** : +1,7 % de revenu pour le premier décile, −0,45 % pour le dernier.

## 2. Par scénario (Md€ par an, Mt CO2e par an)

| Scénario | Recettes nettes | Émissions évitées (brutes) | Rebond de budget | Rebond de recyclage | Émissions évitées (nettes) | % empreinte | Curseur |
|---|---|---|---|---|---|---|---|
| Conforme — réactions faibles | 17,8 | −8,6 | −2,6 | +4,2 | **−7,0** | −1,2 % | 20 |
| **Conforme — central** | **14,9** | **−14,7** | −1,2 | +3,5 | **−12,4** | **−2,2 %** | **15** |
| Conforme — réactions fortes | 11,9 | −21,7 | +0,4 | +2,8 | **−18,5** | −3,2 % | 10 |
| Hors règles — réactions faibles | 32,1 | −9,3 | −2,6 | +7,6 | **−4,3** | −0,7 % | 30 |
| Hors règles — central | 28,7 | −16,0 | −1,2 | +6,8 | **−10,4** | −1,8 % | 30 |
| Hors règles — réactions fortes | 24,5 | −24,1 | +0,4 | +5,8 | **−17,9** | −3,1 % | 25 |

**Lecture.** Les recettes et les émissions évitées varient en sens inverse : plus les ménages réagissent, moins la taxe rapporte et plus elle réduit les émissions. Une fiscalité d'orientation qui « marche » finit par rapporter peu.

**Le rebond de recyclage.** Rendre l'argent aux ménages (par le socle ou par la baisse d'un autre prélèvement) fait réapparaître 3 à 8 Mt d'émissions, au contenu moyen de la consommation. Ce rebond n'est pas un argument contre le reversement : sans lui, la mesure est régressive.

### Détail par poste (conforme, central)

| Poste | Base 2024 | Prix | Volume | Recette nette | Émissions | Prix implicite du carbone |
|---|---|---|---|---|---|---|
| Viande (à domicile) | 33,3 Md€ | +25 % | −14,5 % | +6,7 Md€ | −4,8 Mt | ≈ 250 €/t |
| Carburants | 52,0 Md€ | +15 % | −6,1 % | +5,4 Md€ | −5,3 Mt | ≈ 90 €/t, **en plus** d'environ 200 €/t déjà payés (estimation ⚠️) |
| Gaz et fioul (chauffage) | 19,8 Md€ | +15 % | −2,8 % | +2,6 Md€ | −1,2 Mt | ≈ 70 €/t |
| Billets d'avion | 15,7 Md€ | +60 % | −31 % | +6,1 Md€ | −4,4 Mt (CO2 seul ; ≈ −8 Mt avec les traînées) | ≈ 600 €/t |
| Voitures lourdes | 14,4 Md€ | +25 % | −20 % | +2,3 Md€ | −0,7 Mt (fabrication seule) | sans signification (usage non compté) |
| 0 % alimentation | 131,3 Md€ | −5,2 % | +3,2 % | −6,6 Md€ | +1,7 Mt | — |
| 0 % eau | 7,8 Md€ | −5,2 % | +0,5 % | −0,4 Md€ | ≈ 0 | — |
| 0 % médicaments | 21,6 Md€ | −5,6 % | +0,6 % | −1,1 Md€ | ≈ 0 | — |
| *Hors règles : biens manufacturés importés* | 196,5 Md€ | +5,4 % | −7,5 % | +9,7 Md€ | −1,4 Mt | 200 €/t |
| *Hors règles : alimentation importée* | 58,1 Md€ | +7,7 % | −10,6 % | +4,0 Md€ | **+0,1 Mt** | 200 €/t |

**Le 0 % sur la nécessité.** Seul, il coûte environ 8 Md€ de recettes. La viande et l'avion le financent largement.

## 3. Qui paie ? (conforme, central)

| Décile de niveau de vie | Taxes seules, % du revenu disponible | Paquet complet, % du revenu | Paquet complet, €/ménage/an | Après versement égal, % du revenu |
|---|---|---|---|---|
| D1 (les plus modestes) | 2,1 % | 1,1 % | 186 € | **+1,7 % (gagnant)** |
| D2 | 1,6 % | 0,8 % | 238 € | +0,9 % |
| D3 | 1,4 % | 0,8 % | 276 € | +0,6 % |
| D4 | 1,5 % | 0,9 % | 376 € | +0,3 % |
| D5 | 1,4 % | 0,9 % | 410 € | +0,2 % |
| D6 | 1,4 % | 0,9 % | 469 € | ≈ 0 |
| D7 | 1,4 % | 1,0 % | 535 € | −0,1 % |
| D8 | 1,4 % | 0,9 % | 592 € | −0,2 % |
| D9 | 1,4 % | 0,9 % | 702 € | −0,3 % |
| D10 (les plus aisés) | 1,1 % | 0,8 % | 1 040 € | −0,45 % (perdant) |

*Le versement égal vaut 1,5 Md€ par décile, soit environ 480 € par ménage et par an.*

**Ce qu'il faut retenir.**
- **En euros, les plus aisés paient 5 à 6 fois plus.** Ils prennent plus l'avion, achètent plus de voitures neuves et consomment plus de viande en valeur.
- **En % du revenu, ce sont les plus modestes qui paient le plus** tant qu'on ne regarde que les taxes, comme pour la taxe carbone de 2018 ([Douenne 2020](https://theses.hal.science/tel-03131425/file/Douenne.pdf)).
- **Le 0 % (alimentation, eau, médicaments) corrige l'essentiel de cette régressivité.** Il rend 1 % de son revenu au premier décile, contre 0,3 % au dernier.
- **Le reversement égal rend le tout progressif.** Six déciles sur dix y gagnent ou sont à l'équilibre. Douenne (2020) trouvait de même que 70 % des ménages gagneraient à une taxe carbone avec dividende égal, mais que seuls 14 % le croyaient.

**Hors règles.** La charge double : 2,4 % du revenu pour le premier décile, 1,5 % pour le dernier, parce que les biens importés pèsent plus dans le budget des modestes. Après versement égal, le premier décile gagne 3 % de son revenu.

### Et le socle universel ?

- **Ordre de grandeur.** Le socle de 1 000 €/mois par adulte représente environ 12 000 € par an et par adulte. La charge moyenne du paquet central (186 € par ménage et par an pour le premier décile, 1 040 € pour le dernier) en est une petite fraction. En niveau de vie, le socle « compense » donc largement.
- **Mais la compensation n'est pas automatique.** Le socle est financé par le prélèvement unique. La fiscalité d'orientation n'en réduit le besoin de financement que de 15 Md€ sur un trou statique d'environ 196 Md€, soit 8 %.
- **Conséquence pratique.** Pour que le paquet reste juste, il faut l'écrire explicitement : soit une part des recettes est reversée à parts égales (environ 20 € par adulte et par mois dans le scénario central), soit le socle est relevé d'autant. Le versement à parts égales a l'avantage de **ne pas affaiblir le signal-prix** : chacun reçoit la même somme, quoi qu'il consomme.

## 4. Sensibilités (conforme, central sauf mention)

| Variante | Recettes nettes | Émissions nettes |
|---|---|---|
| Taxes divisées par deux | 4,4 Md€ | −6,5 Mt |
| Taxes × 1,5 (avion +90 %, le doublement évoqué par l'auteur) | 24,0 Md€ | −17,4 Mt |
| Intensités hautes (viande 1,4 kg/€, aviation avec traînées) | 14,9 Md€ | −18,2 Mt |
| Intensités basses | 14,9 Md€ | −9,9 Mt |
| Baisse de TVA répercutée à 50 % seulement | 14,7 Md€ | −13,8 Mt (mais la moitié du gain va aux marges des distributeurs) |
| Voitures lourdes = 60 % des achats | 16,1 Md€ | −12,5 Mt |
| Viande : élasticité française −1,2 au lieu de −0,7 (V313, Caillavet et coll., compensée) | 14,3 Md€ | −14,8 Mt (le poste viande passe de −14,5 % à −23,5 % de volume) |
| Hors règles, taxes × 1,5 | 43,8 Md€ | −14,5 Mt |

Aucune combinaison ne dépasse **≈ 45 Md€** ni **≈ 4 % de l'empreinte**.

## 5. Ce qui appuie, nuance ou contredit la thèse de l'auteur

**Appuie.**
- **Le 0 % de TVA sur les besoins fondamentaux est légal** depuis la directive 2022/542. Il est aussi l'outil le plus efficace contre la régressivité.
- **Le droit européen ne bloque presque rien du projet.** Une TVA par produit au-delà de 20 % est interdite, mais une accise nationale produit le même effet. Le seul vrai mur est la discrimination selon l'origine.
- **Les postes les plus rentables, pour le climat comme pour le budget, sont ceux que l'auteur vise :**
  - **l'avion** : il est taxé à environ 0 €/t aujourd'hui (kérosène exonéré, TVA nulle à l'international) et ses passagers sont surtout aisés ;
  - **la viande** : elle bénéficie aujourd'hui du taux réduit de 5,5 %, soit une subvention implicite par rapport au taux normal.
- **Pollueur-payeur avec reversement égal = mesure progressive.** C'est un argument fort face à l'objection « écologie punitive ».

**Nuance.**
- **Ce n'est pas une source de financement majeure.** 15 Md€, c'est 8 % du trou du simulateur, et la base fond si la politique réussit. La fiscalité d'orientation est un **outil de prix**, pas un pilier budgétaire comparable au prélèvement unique.
- **Les carburants sont déjà le produit le plus taxé par tonne de CO2** (environ 200 €/t implicites, estimation ⚠️). Un vrai principe pollueur-payeur, c'est-à-dire un même prix par tonne pour tout, taxerait d'abord l'avion et la viande, et **beaucoup moins les carburants**. Les gilets jaunes rappellent par ailleurs que la contrainte des ruraux sans alternative est réelle : les effets « horizontaux » dominent les effets par décile.
- **L'effet climat est modeste.** −2 à −3 % de l'empreinte, alors que la stratégie nationale bas carbone vise une baisse bien plus forte. Les prix seuls ne suffiront pas : il faut des alternatives (véhicules électriques, rénovation, train), ce qui rejoint T9 sur la gratuité des transports. La position « anti-interdiction » reste défendable, mais le prix n'est qu'un levier parmi d'autres.
- **Contradiction assumée à nommer.** Le paquet frappe d'abord le dernier décile en euros, notamment par l'avion. L'auteur dit être lui-même concerné par cette mesure, et il faut l'écrire.

**Contredit.**
- **« Local = bas carbone » est faux en moyenne pour l'alimentation.** Selon les comptes carbone Insee-SDES 2024, un euro d'alimentation importée contient 0,386 kg CO2e, contre 0,402 pour un euro d'alimentation française. La différence vient de *ce qu'on mange* (viande ou végétal), pas de *d'où ça vient*. L'idée est vraie en revanche pour les biens manufacturés : 0,268 kg/€ importés contre 0,177 kg/€ fabriqués en France (textile, électronique, meubles, voitures).
- **La taxe « lointain » du scénario hors règles est surtout un droit de douane.** Elle rapporte 14 Md€ mais n'évite qu'environ 1,3 Mt. Après recyclage, elle **réduit moins les émissions** que le scénario conforme. Elle expose de plus à des rétorsions sur les exportations françaises (aéronautique, vins et spiritueux, luxe) et à des procédures européennes. **Sur le seul critère climatique, elle ne vaut pas son coût juridique et commercial.** Taxer le contenu carbone de tous les produits, français et importés, ferait mieux et resterait défendable.

## 6. Pour le simulateur

- Curseur « Fiscalité d'orientation en plus » : **15 Md€** (conforme, central), avec une plage de 10 à 20. **30 Md€** si l'on suppose les règles européennes dépassées.
- Le simulateur ne doit pas additionner ce curseur avec une recette « taxe sur les vols » comptée ailleurs : l'avion est inclus ici (6 Md€). T10 affinera l'aviation et les croisières.
- Note proposée pour la légende : « Recettes nettes après réactions des consommateurs ; elles baissent si la politique réussit. Valeur centrale 15 Md€ (fourchette de 10 à 20) ; 30 Md€ en ignorant le droit européen, au prix de rétorsions commerciales non chiffrées. »
