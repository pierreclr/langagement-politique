---
titre: Entreprise d'intérêt public et pari : résultats
date: 2026-11-09
statut: généré par calculer.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Entreprise d'intérêt public : premier chiffrage

Généré par `python3 -I modeles/entreprise-interet-public/calculer.py`. Écrit par Claude (IA d'Anthropic) pour l'auteur. Méthode et hypothèses H-EIP1 à H-EIP26 : `methode.md`. Montants en **Md€ de 2025**, **espérances** (pondérées par les probabilités de réussite des projets), pari lancé en 2029. Les trois scénarios mêlent **taille** du programme et **réussite** : le prudent est petit et malchanceux, l'ambitieux grand et heureux.

**Calibrage sur les précédents** (`donnees/precedents.csv`, 10 programmes industriels d'État français) : réussite nette 20 % ; en comptant les réussites partielles pour moitié, 35 %. Probabilité qu'**un** projet passe les deux jalons dans le modèle : 16 à 56 % selon le pôle et le scénario ; la série est lancée si **au moins un** des projets parallèles réussit. ⚠️ Échantillon petit et biaisé (on se souvient des grands programmes).

## Scénario prudent

| Pôle | P(série lancée) | Investissement 2029-2038 | Investissement 2029-2058 | CA 2038 | CA 2058 | Emplois 2038 | Emplois 2058 | 1re année de flux positif | Flux cumulé positif (non actualisé) | Flux cumulé 2058 | Perdu en projets arrêtés | Tout échoue |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Calcul et IA | 66 % | 8,9 | 26,1 | 0,88 | 0,88 | 471 | 471 | > 2058 | > 2058 | −13,1 | 0,23 | 0,72 |
| Énergie atomique (petits réacteurs) | 29 % | 2,1 | 10,7 | 0,00 | 0,24 | 797 | 373 | 2052 | > 2058 | −9,1 | 1,15 | 4,08 |
| Robotique des métiers dangereux (humanoïde, agricole, forestière) | 50 % | 1,3 | 3,8 | 0,01 | 0,07 | 496 | 986 | > 2058 | > 2058 | −3,6 | 0,54 | 1,76 |
| Objets du quotidien réparables | 66 % | 0,3 | 0,9 | 0,07 | 0,12 | 494 | 679 | > 2058 | > 2058 | −0,9 | 0,06 | 0,18 |

- **Coût public net** (holding consolidée dans les administrations, après ventes, épargne exclue) : 10,8 Md€ sur 2029-2038 (1,08 Md€/an en moyenne), 29,4 Md€ sur 2029-2058 ; pic 1,77 Md€ en 2035 ; solde annuel positif à partir de > 2058.
- **Enveloppe fixe des tranches** (R&D, équipes, frais de la holding, première décennie) : 0,61 Md€/an ; **emprunt conditionné aux résultats** (capex de série non couvert par l'enveloppe ni l'épargne) : 3,7 Md€ cumulés sur 2029-2038.
- **Épargne en parts viagères** : 1,8 Md€ sur 10 ans, 5,8 Md€ sur 30 ans ; encours 3,5 Md€ en 2058 (les parts s'éteignent au décès des porteurs).
- **Ensemble** : CA 1,0 Md€ en 2038, 1,3 Md€ en 2058 ; emplois directs 2408 en 2038, 2659 en 2058 ; reversement par le socle 0,00 Md€ en 2058, désendettement 0,00 Md€.
- **Si tout échoue au second jalon** (pire cas des tranches) : 6,7 Md€ dépensés au total.

**Effet sur la dette** (base : notre système + l'effort qui le stabilise de 2038 à 2058, croissance nominale 3 %) :

| Taux | Effort stabilisant sans pari (Md€/an) | avec pari | Δ dette 2033 | Δ 2038 | Δ 2048 | Δ 2058 (points de PIB) | Δ OAT 2038 | Δ OAT 2058 (pb) | Pic de Δ dette |
|---|---|---|---|---|---|---|---|---|---|
| banc (3,45 % fixe) | 0 | 1 | 0,14 | 0,30 | 0,64 | 0,83 | 0,0 | 0,0 | 0,83 pt en 2058 |
| endogène central | 42 | 43 | 0,15 | 0,36 | 0,94 | 1,62 | 1,1 | 4,3 | 1,62 pt en 2058 |
| sensibilités hautes | 45 | 46 | 0,16 | 0,44 | 1,51 | 3,60 | 3,9 | 24,3 | 3,60 pt en 2058 |

Variante **holding hors des administrations** (unité marchande, H-EIP24) : coût public 18,0 Md€ sur 30 ans ; dette propre de la holding au plus 7,4 Md€ ; Δ dette publique 2038 0,24 pt, 2058 1,14 pt (endogène central).

## Scénario central

| Pôle | P(série lancée) | Investissement 2029-2038 | Investissement 2029-2058 | CA 2038 | CA 2058 | Emplois 2038 | Emplois 2058 | 1re année de flux positif | Flux cumulé positif (non actualisé) | Flux cumulé 2058 | Perdu en projets arrêtés | Tout échoue |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Calcul et IA | 80 % | 16,5 | 45,6 | 2,08 | 2,08 | 1134 | 1134 | > 2058 | > 2058 | −9,2 | 0,30 | 1,05 |
| Énergie atomique (petits réacteurs) | 58 % | 4,6 | 26,5 | 0,00 | 1,16 | 4005 | 1272 | 2050 | > 2058 | −17,1 | 1,58 | 5,40 |
| Robotique des métiers dangereux (humanoïde, agricole, forestière) | 68 % | 2,4 | 8,2 | 0,10 | 0,59 | 1604 | 4291 | > 2058 | > 2058 | −5,6 | 0,65 | 2,20 |
| Objets du quotidien réparables | 80 % | 0,6 | 1,5 | 0,24 | 0,40 | 1466 | 2173 | > 2058 | > 2058 | −1,0 | 0,06 | 0,21 |

- **Coût public net** (holding consolidée dans les administrations, après ventes, épargne exclue) : 17,6 Md€ sur 2029-2038 (1,76 Md€/an en moyenne), 38,4 Md€ sur 2029-2058 ; pic 3,74 Md€ en 2032 ; solde annuel positif à partir de 2056.
- **Enveloppe fixe des tranches** (R&D, équipes, frais de la holding, première décennie) : 1,03 Md€/an ; **emprunt conditionné aux résultats** (capex de série non couvert par l'enveloppe ni l'épargne) : 6,4 Md€ cumulés sur 2029-2038.
- **Épargne en parts viagères** : 4,5 Md€ sur 10 ans, 10,5 Md€ sur 30 ans ; encours 5,2 Md€ en 2058 (les parts s'éteignent au décès des porteurs).
- **Ensemble** : CA 2,4 Md€ en 2038, 4,2 Md€ en 2058 ; emplois directs 8458 en 2038, 9120 en 2058 ; reversement par le socle 0,01 Md€ en 2058, désendettement 0,01 Md€.
- **Si tout échoue au second jalon** (pire cas des tranches) : 8,9 Md€ dépensés au total.

**Effet sur la dette** (base : notre système + l'effort qui le stabilise de 2038 à 2058, croissance nominale 3 %) :

| Taux | Effort stabilisant sans pari (Md€/an) | avec pari | Δ dette 2033 | Δ 2038 | Δ 2048 | Δ 2058 (points de PIB) | Δ OAT 2038 | Δ OAT 2058 (pb) | Pic de Δ dette |
|---|---|---|---|---|---|---|---|---|---|
| banc (3,45 % fixe) | 0 | 1 | 0,27 | 0,44 | 0,95 | 0,99 | 0,0 | 0,0 | 0,99 pt en 2058 |
| endogène central | 42 | 44 | 0,29 | 0,54 | 1,44 | 2,19 | 1,7 | 5,6 | 2,19 pt en 2058 |
| sensibilités hautes | 45 | 47 | 0,30 | 0,67 | 2,37 | 5,40 | 5,9 | 36,7 | 5,40 pt en 2058 |

Variante **holding hors des administrations** (unité marchande, H-EIP24) : coût public 21,0 Md€ sur 30 ans ; dette propre de la holding au plus 9,3 Md€ ; Δ dette publique 2038 0,38 pt, 2058 1,53 pt (endogène central).

## Scénario ambitieux

| Pôle | P(série lancée) | Investissement 2029-2038 | Investissement 2029-2058 | CA 2038 | CA 2058 | Emplois 2038 | Emplois 2058 | 1re année de flux positif | Flux cumulé positif (non actualisé) | Flux cumulé 2058 | Perdu en projets arrêtés | Tout échoue |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Calcul et IA | 91 % | 51,5 | 144,6 | 9,79 | 9,79 | 2668 | 2668 | 2037 | 2047 | 31,6 | 0,32 | 1,38 |
| Énergie atomique (petits réacteurs) | 74 % | 9,5 | 40,6 | 0,00 | 3,50 | 11361 | 2755 | 2047 | > 2058 | −5,1 | 1,44 | 5,28 |
| Robotique des métiers dangereux (humanoïde, agricole, forestière) | 83 % | 4,3 | 15,0 | 0,72 | 4,31 | 5108 | 18329 | 2040 | 2048 | 12,0 | 0,77 | 2,88 |
| Objets du quotidien réparables | 91 % | 1,2 | 3,2 | 1,06 | 1,77 | 5476 | 8538 | 2039 | 2047 | 1,4 | 0,07 | 0,28 |

- **Coût public net** (holding consolidée dans les administrations, après ventes, épargne exclue) : 38,0 Md€ sur 2029-2038 (3,80 Md€/an en moyenne), −10,2 Md€ sur 2029-2058 ; pic 7,89 Md€ en 2032 ; solde annuel positif à partir de 2037.
- **Enveloppe fixe des tranches** (R&D, équipes, frais de la holding, première décennie) : 1,60 Md€/an ; **emprunt conditionné aux résultats** (capex de série non couvert par l'enveloppe ni l'épargne) : 18,3 Md€ cumulés sur 2029-2038.
- **Épargne en parts viagères** : 10,8 Md€ sur 10 ans, 12,4 Md€ sur 30 ans ; encours 4,7 Md€ en 2058 (les parts s'éteignent au décès des porteurs).
- **Ensemble** : CA 11,6 Md€ en 2038, 19,4 Md€ en 2058 ; emplois directs 25014 en 2038, 32691 en 2058 ; reversement par le socle 1,81 Md€ en 2058, désendettement 1,81 Md€.
- **Si tout échoue au second jalon** (pire cas des tranches) : 9,8 Md€ dépensés au total.

**Effet sur la dette** (base : notre système + l'effort qui le stabilise de 2038 à 2058, croissance nominale 3 %) :

| Taux | Effort stabilisant sans pari (Md€/an) | avec pari | Δ dette 2033 | Δ 2038 | Δ 2048 | Δ 2058 (points de PIB) | Δ OAT 2038 | Δ OAT 2058 (pb) | Pic de Δ dette |
|---|---|---|---|---|---|---|---|---|---|
| banc (3,45 % fixe) | 0 | 0 | 0,44 | 0,91 | 0,59 | −0,73 | 0,0 | 0,0 | 0,92 pt en 2041 |
| endogène central | 42 | 43 | 0,46 | 1,11 | 1,34 | 0,48 | 2,9 | 0,3 | 1,40 pt en 2046 |
| sensibilités hautes | 45 | 47 | 0,48 | 1,35 | 2,90 | 4,79 | 10,8 | 30,4 | 4,79 pt en 2058 |

Variante **holding hors des administrations** (unité marchande, H-EIP24) : coût public −7,5 Md€ sur 30 ans ; dette propre de la holding au plus 18,3 Md€ ; Δ dette publique 2038 0,50 pt, 2058 0,35 pt (endogène central).

## Lecture

1. **Les tranches protègent contre l'échec technique, pas contre l'échec commercial.** Si tout échoue au second jalon, le pari coûte 7 à 10 Md€ au total ; mais si les séries sont lancées et ne trouvent pas leur marge (calcul au prudent et au central), la perte est le coût complet (29 à 38 Md€ sur 30 ans).
2. **Le calcul est le poste le plus lourd et le moins sûr** : il ne rapporte que si l'EBE dépasse son renouvellement (serveurs à 5 ans), ce qui n'arrive qu'à l'ambitieux.
3. **Les petits réacteurs n'ont un flux annuel positif qu'entre 2047 et 2052** et leur flux cumulé reste négatif en 2058 dans les trois scénarios : c'est un investissement d'infrastructure à 60 ans, pas un pari rentable sur 30 ans.
4. **Les objets réparables coûtent peu** (moins de 1,5 Md€ sur 30 ans au central) et créent le plus d'emplois par euro ; ils ne sont rentables qu'avec une marge de l'ordre de 10 %, au-dessus des marges d'EBIT de 5 à 8 % des grands du secteur (⚠️ de mémoire).
5. **Effet sur la dette** : de l'ordre de 0,5 point de PIB en 2038 et 1 à 2 points en 2058 (taux endogène central), soit 1 à 2 Md€ par an d'effort stabilisant en plus ; davantage si les marchés sont réactifs.
