---
titre: Reconversion : que deviennent les personnes dont le métier disparaît ? Résultats
statut: brouillon sourcé ; hypothèses et ordres de grandeur, jamais des prédictions
date: 2026-11-03
---

# Reconversion : résultats

> Écrit par Claude (IA d'Anthropic). Tableaux complets : `resultats.txt` (c'est lui qui fait foi), généré par `rapport.js`. Méthode et hypothèses H1 à H20 : [`methode.md`](methode.md). Sources : `donnees/sources.csv`. ⚠️ = non confirmé (V9900 à V9915). Scénarios : favorable = (taille T6 bas × marché favorable), central = (central × central), défavorable = (haut × défavorable). « Rapide » = calendrier de la bascule (2029-2032) ; « lent » = 2029-2038.

## Dix lignes

1. **Combien de personnes perdent vraiment leur emploi.** Sur les 260 000 postes de T6 (central), au rythme de la bascule, ≈ 95 000 disparaissent par départs non remplacés, ≈ 58 000 sont redéployés dans les entreprises et **≈ 106 000 personnes sont déplacées**. Au favorable, personne (107 000 postes, tous absorbés) ; au défavorable, **≈ 360 000**.
2. **Combien se retournent.** Au central, **47 % ont retrouvé un emploi après un an, 69 % après deux ans, 83 % après cinq ans**. Avant 50 ans : 53-57 % à un an, ≈ 93 % à cinq ans. **De 55 à 59 ans : 29 % à un an, 63 % à cinq ans ; de 60 à 63 ans, 72 % arrivent à la retraite sans avoir retrouvé d'emploi.** Au total, ≈ 8 000 personnes au central (≈ 48 000 au défavorable) finissent leur carrière sans retour. Les reconvertis gagnent 15 % de moins au retour, encore 7 % de moins à long terme.
3. **Combien ça coûte au budget** (impôt perdu à 41 %, complément dégressif, plancher de 877 €, formation) : **0,5 Md€ par an en moyenne de 2029 à 2035 au central** (pic 0,9 Md€ en 2032, 5,5 Md€ cumulés), **3,3 Md€ par an au défavorable** (pic 5,1 Md€, 38 Md€ cumulés), zéro au favorable. Le plancher de 877 € n'en représente qu'une petite part (0,4 Md€ cumulés au central, 3,4 au défavorable) : l'essentiel est l'impôt perdu.
4. **Combien ça coûte à la société** : la production manquante (non-emploi et salaires plus bas) est de **28 Md€ cumulés au central, soit ≈ deux ans du gain de T6** (15 Md€/an), et de **143 Md€ au défavorable, soit ≈ quatre ans et demi** du gain (33 Md€/an). Pour les personnes, la perte nette des transferts est de ≈ **3 ans de salaire par déplacé** au central (4,5 au défavorable).
5. **À partir de quand le gain net est positif.** Avec la convention de T6 (le travail de pure complexité ne produit rien de désirable), **dès 2029 dans tous les scénarios** : les départs non remplacés libèrent du travail tout de suite. Avec la convention prudente (ce travail rendait un service valant la moitié de son coût, le travail réalloué ne vaut que 70 %), le gain annuel devient positif **en 2032 au central (cumul positif en 2033)** et **en 2035 au défavorable (cumul positif seulement en 2041)**.
6. **L'étalement est de très loin la politique la plus efficace.** Sur dix ans au lieu de quatre, les déplacés passent de 106 000 à **16 000** au central, la production manquante de 28 à 4 Md€, le coût budgétaire de 5,5 à 0,8 Md€ cumulés ; sur quinze ans, presque zéro. Au défavorable, l'étalement divise le coût annuel par deux (3,3 → 1,6 Md€/an) mais laisse ≈ 300 000 déplacés : le choc est trop gros pour l'attrition seule.
7. **La formation ciblée et l'aide à la mobilité aident peu dans ce modèle** : −0,2 et −0,3 Md€ de production manquante pour 0,2 et 0,1 Md€ de coût, parce que la moitié des déplacés est déjà formée au central et que les études françaises ne mesurent pas d'effet causal fort (formation : +9 points à deux ans, surestimés ; mobilité : aucune évaluation causale). La vraie politique est d'**arrêter de former et de recruter des débutants dans ces métiers dès l'annonce** (c'est ce qui rend l'attrition possible) et de **protéger les 55 ans et plus** jusqu'à la retraite.
8. **Agents publics** : non-remplacement des départs, donc **aucun licenciement** par construction (3 500 / 33 000 / 197 000 postes sur dix ans). Le coût est reporté sur les jeunes non recrutés, qui trouvent ailleurs (hypothèse).
9. **Montants pour `systeme-ideal`** (coût budgétaire net, Md€/an, + = coût, calendrier de la bascule) : **[favorable 0,0 ; central 0,54 ; défavorable 3,30]** en moyenne 2029-2035 ; pics [0 ; 0,88 ; 5,13] en 2032 ; traîne en 2040 [0 ; 0,10 ; 0,91]. Sans récupération d'impôt sur les économies des clients : [0 ; 0,68 ; 3,30]. Avec un calendrier lent : [0 ; 0,03 ; 1,58]. Ce sont des coûts **de transition**, pas de croisière : à ajouter aux années 2029-2040 du chemin de dette, pas au solde de croisière.
10. **Ma recommandation** : présenter le central comme « ≈ 100 000 personnes à accompagner, dont ≈ 35 000 de 50 ans et plus ; 0,5 Md€ par an pendant sept ans », s'engager sur un **calendrier de suppression de dix ans** (annoncé, avec arrêt des recrutements de débutants), et une **garantie de revenu jusqu'à la retraite pour les plus de 57 ans déplacés** (≈ 16 000 personnes au central). Ne jamais écrire « personne ne perdra son emploi » : au rythme de la bascule, ce n'est vrai qu'au favorable.

## 1. Calibrage (cohorte de 40-49 ans)

| marché | perte de revenu, année 1 | année 2 | année 5 | année 10 | non-emploi à 5 ans | valeur actuelle 20 ans à 5 % |
|---|---|---|---|---|---|---|
| favorable | 67 % | 25 % | 8 % | 5 % | 2 % | 1,6 an de revenu |
| central | 78 % | 42 % | 16 % | 11 % | 7 % | 2,6 ans |
| défavorable | 86 % | 58 % | 28 % | 18 % | 15 % | 3,8 ans |

Repères : France, −20 % la première année pleine après la séparation et −12 % à cinq ans (−25 % contre des témoins toujours employés), ≈ 10 % de non-emploi à cinq ans (Bertheau et al. 2023) ; États-Unis, 1,4 an (chômage bas) à 2,8 ans (récession) en valeur actuelle (Davis et von Wachter 2011). **Le favorable est proche de la France de Bertheau ; le central est plus dur, calé sur les 43 % en emploi à un an des licenciés économiques (Trésor-OCDE)** ; le défavorable ressemble à une récession américaine. L'année 1 du modèle part du jour de la séparation, ce qui la rend plus lourde que l'année t+1 des études.

## 2. Scénarios principaux

| | favorable | central | défavorable |
|---|---|---|---|
| Postes supprimés (T6) | 107 k | 260 k | 479 k |
| Absorbés / redéployés / déplacés (rapide) | 107 k / 0 / 0 | 95 k / 58 k / **106 k** | 46 k / 74 k / **359 k** |
| Déplacés (lent) | 0 | 16 k | 304 k |
| En emploi à 1 / 2 / 5 ans | — | 47 / 69 / 83 % | 33 / 53 / 73 % |
| Retraite sans retour | 0 | 8 k | 48 k |
| Pic de non-emploi | 0 | 41 k (2032) | 178 k |
| Production manquante cumulée (actualisée à 2,5 %) | 0 | 28 Md€ (24) | 143 Md€ (116) |
| Coût budgétaire net moyen 2029-2035 / pic | 0 | 0,54 / 0,88 Md€ | 3,30 / 5,13 Md€ |
| Cumul brut / net | 0 | 7,2 / 5,5 Md€ | 38 / 38 Md€ |
| dont allocations (plancher) / formation | 0 | 1,1 (0,4) / 0,5 Md€ | 5,8 (3,4) / 4,2 Md€ |
| Perte des personnes (nette des transferts) | 0 | 8,2 Md€ (3,1 ans de salaire par déplacé) | 41 Md€ (4,5 ans) |
| Gain net, convention T6 / prudente : cumul 2029-2040 | 71 / 1,6 Md€ | 179 / 16 Md€ | 279 / −2 Md€ |
| Gain net en croisière (2045), T6 / prudente | 6,8 / 0,2 | 18,7 / 2,7 | 33,9 / 5,0 |

Le gain de croisière en convention T6 (18,7 Md€ au central) dépasse le « gain réel net » de T6 (15,1) parce que T6 supposait 80 % de réemploi alors qu'ici l'absorption et le redéploiement remettent ≈ 97 % du travail en usage à long terme. Grille taille × marché : `resultats.txt` § C (par exemple central × défavorable : 175 000 déplacés, 1,6 Md€/an).

## 3. Steelman

**« Vous détruisez 100 000 à 360 000 emplois qualifiés pour une économie que personne ne verra. »** C'est la meilleure objection, et le modèle lui donne en partie raison : au rythme de la bascule, il y a des déplacés dans tous les scénarios sauf le favorable, et les plus de 55 ans en paient l'essentiel (la recherche est solide là-dessus, en France comme ailleurs). Réponse : (1) la perte de production cumulée vaut deux ans du gain au central et le gain est permanent ; (2) le coût budgétaire (0,5 Md€/an) est petit à côté du gain pour l'économie (15 Md€/an) ; (3) l'essentiel du coût disparaît si l'on étale sur dix ans et qu'on cesse de recruter des débutants dès l'annonce, comme l'Allemagne l'a fait sans le vouloir avec les robots ; (4) une partie de ces emplois disparaîtra de toute façon avec l'IA (Métiers 2030 prévoyait déjà −24 % d'employés de la comptabilité de 2019 à 2030) : la réforme organise un déclin qui sinon serait subi. **Ce que la réponse ne règle pas** : la promesse « ne perdre personne » n'est tenable qu'avec un calendrier lent, ce qui contredit le calendrier rapide de la bascule fiscale. Il faut dissocier les deux : la loi peut basculer en 2029-2032, la suppression des postes suit au rythme des départs.

**Contre-objection libérale** : « laissez faire, le marché réalloue ». Le modèle dit que oui, en moyenne, mais lentement et avec des cicatrices (4 à 10 % de salaire en moins durablement) ; le coût d'accompagnement est faible au regard du gain, c'est un argument pour l'accompagnement, pas contre la réforme.

## 4. Ce qui manque

- Structure par âge et salaires des métiers (Portraits de la Dares refusés par CAPTCHA : V9913) ; le nombre d'experts-comptables (≈ 22 000) n'est que relayé.
- Le paramètre décisif (efficacité de l'absorption, H3) n'est mesuré nulle part (V9914).
- Aucune évaluation causale française de l'aide à la mobilité ; effets de la formation probablement surestimés.
- Coûts humains (santé, mortalité, statut) non chiffrés ; effets de demande à court terme non modélisés.
- Le maintien du complément dégressif « deg2 » dans l'architecture v4 est à confirmer (V9915).
