---
titre: Agriculture : sortie des aides à l'hectare, robots, pollueur-payeur
theme: construire
statut: brouillon ; dernier calcul du 03/11/2026
---

## La question

Que coûterait ou rapporterait une sortie progressive des aides agricoles européennes à l'hectare (remplacées par des paiements pour services environnementaux et un fonds « ne perdre personne ») ? Les robots agricoles rendent-ils les petites parcelles diversifiées rentables, comme le suppose la thèse « les robots contre la monoculture » ? Une redevance sur les pesticides et l'azote réduit-elle vraiment leur usage ? La thèse sur les robots est testée, pas adoptée. Le modèle ne traite pas la salarisation des agriculteurs.

## Ce qui entre

- 11 postes d'aides de la politique agricole commune en 2024 (ministère de l'agriculture, INRAE, 2026) : statistique publique. Aides qui sortent : 4 066 M€ (aide de base et aides couplées).
- 282 182 exploitations réparties en 9 filières. Revenu courant moyen (RCAI) sourcé pour 4 filières (INRAE 2025) ; le reste est stylisé.
- Prix des robots (Naïo, 2017-2019, anciens), ventes de pesticides (65 300 t) et produit de la redevance actuelle (188 M€), élasticités tirées de la littérature.
- Un rapport de recherche sur une ferme maraîchère intensive (1 000 m², trois ans).

## Comment il calcule

1. **Aides perdues.** Subvention moyenne d'une filière = revenu moyen × dépendance aux subventions. Perte brute à l'année t = subvention × part qui sort × t/10. La sortie est linéaire sur dix ans.
2. **Perte nette.** Perte nette = perte brute × (1 − capitalisation foncière × part de terres louées) × (1 − adaptation). La capitalisation est la part de l'aide incluse dans les loyers, rendue aux fermiers quand l'aide disparaît. PSE reçus = 50 % de la perte brute.
3. **Taxes.** Pesticides : ventes à l'année 10 = ventes actuelles × (prix nouveau / prix actuel)^élasticité. Azote : même forme. Une partie des recettes est restituée aux exploitations.
4. **Robots.** Gain annuel = coût évité − (prix × annuité à 5 % + entretien). Prix d'équilibre = coût évité / (annuité + entretien).
5. **Fonds.** Compensation dégressive des pertes plus plancher permanent de 17,1 k€ par exploitation.
6. **Budget.** Deux cadres : « Union » (les aides sortantes sont économisées) et « France seule » (rien n'est économisé).
7. **Heures par hectare.** Profit par hectare = marge − heures × [(1 − part robotisée) × coût humain + part robotisée × coût du robot par heure équivalente].

Exemple, grandes cultures, central, année 10 (revenu 56,3 k€, dépendance 0,85, part sortante 0,5, terres louées 0,8) : subvention 47,9 k€, perte brute 23,9 k€. Perte nette = 23,9 × (1 − 0,25 × 0,8) × (1 − 0,15) = 16,3 k€, moins 12,0 k€ de PSE reçus : −4,3 k€ (resultats.md, « Lectures et limites »).

## L'hypothèse qui porte le résultat

**Le cadre budgétaire (H23) : dans le cadre « Union », la sortie dégage 1,3 / 1,8 / 2,2 Md€ par an à l'année 10. Dans le cadre « France seule », elle coûte 1,7 à 2,6 Md€ par an** (resultats.md, « En huit phrases », point 1). Le premier cadre suppose que les aides européennes économisées reviennent au budget. Le droit européen ne permet pas à la France de sortir seule de ces aides. Le vrai résultat est entre les deux et dépend de la négociation. C'est un choix de présentation de l'IA, non une valeur mesurée.

Pour les robots, l'hypothèse qui porte est le coût horaire du robot : 31 € par heure équivalente humaine au central, contre 16 € pour un salarié, avec un seuil de 5 à 9 €. Il faudrait robotiser plus de 80 à 90 % des heures pour qu'un exploitant en tire un revenu (resultats.md, section heures, points 4 à 6).

## Ce que l'IA a choisi elle-même

Sur 36 hypothèses numérotées, 32 portent ⚠️, « hypothèse » ou « choix » dans methode.md. Les principales :

- H2, H4, H7 : parts de filières, revenu et dépendance de six filières, part des aides qui sortent par filière. Le résultat par filière est un ordre de grandeur, pas une mesure.
- H5 : dispersion normale des revenus, avec un écart type de 0,9 fois la moyenne.
- H7 : la part des aides qui sortent est calée pour retrouver 4 066 M€ à 15 % près.
- H10 et H22 : 50 % des aides perdues sont recyclées en paiements environnementaux ; plancher de 17,1 k€.
- H11 : capitalisation foncière de 10 à 40 %, adaptation de 5 à 30 %, littérature non lue.
- H18 : élasticité de l'azote de −0,1 à −0,4.
- H24 : effet uniforme dans une filière, ce qui sous-estime les perdants extrêmes et surestime l'efficacité du fonds.
- H25 à H36 (module heures) : marges, heures, coût horaire du salarié, disponibilité du robot, parts d'heures robotisables, extrapolation à l'hectare d'une ferme de 1 000 m².

## Ce qu'il ne fait pas

- Pas de prix de marché, de production, de balance commerciale, ni de disparition d'exploitations.
- Pas de rebond de la robotique (le temps libéré sert à agrandir), nommé mais non modélisé.
- Le calibrage retrouve 28,4 k€ de subventions par exploitation contre 33,7 à 34,9 k€ mesurés : les aides sont sous-estimées de 16 %.
- Le fonds relève au plancher, mais pas au-dessus : un exploitant qui perd 18 % de son revenu « n'est pas perdu » au sens du modèle.
- Les chiffres de robotique datent de 2017-2019 pour Naïo, entreprise en redressement judiciaire en 2025. Les robots de récolte n'ont pas de prix publié.
- Seule une ferme de 1 000 m² a des marges et des heures mesurées (module heures).

## Ce qu'il donne

- Aides sortantes : 3,9 Md€ par an à l'année 10 ; budget net « Union » de 5,2 / 8,6 / 12,1 Md€ cumulés sur 10 ans ; « France seule » : 9,5 à 16,4 Md€ de coût cumulé (resultats.md, « En huit phrases »).
- Fonds : 0,8 / 0,4 / 0,05 Md€ par an à l'année 10 selon l'adaptation. 90 000 exploitations (32 %) sous leur plancher sans fonds, au central (point 4).
- Pesticides : multiplier la redevance par trois rapporte 0,35 Md€ de plus et ne baisse les ventes que de 2 à 8 %. Pour −40 %, il faudrait ×56 le taux (×20 à ×1 750 selon l'élasticité) (point 6).
- Robots : non rentables en grandes cultures avant 15 à 51 ans de baisse des prix ; rentables de peu en maraîchage (+0,7 à +3,4 k€ par an) (point 7).
- La thèse « robots contre monoculture » n'est pas soutenue à dix ans. Le seuil de 5 à 9 € l'heure serait atteint vers 2032 (haut), 2048 (central), jamais (bas) (point 8).

## Comment le refaire

Depuis le dossier du modèle :

- `python3 -m unittest test_modele -v` et `python3 -m unittest test_heures -v` : 38 et 18 tests, lancés le 9 novembre 2026 via `unittest discover` (56 tests au total), ils passent.
- `python3 rapport.py` et `python3 rapport_heures.py` : régénèrent les tableaux (non relancés ici).
