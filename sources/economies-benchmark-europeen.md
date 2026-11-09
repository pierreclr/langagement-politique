---
titre: Économies de dépense publique par benchmark européen (fonction COFOG, niveau 2)
date: 2026-11-03
statut: brouillon sourcé ; ordres de grandeur sous hypothèses, jamais des prédictions ; à valider par l'auteur
---

# Économies de dépense publique par benchmark européen

Écrit par Claude (IA d'Anthropic) sur délégation de l'auteur (03/11/2026). Il ne décide rien. **Risque propre à cette tâche** : la complaisance, car la demande porte sur un montant plus élevé que les 29 Md€ de `sources/economies-depense-publique.md` et le benchmark est un outil facile à tordre vers un chiffre rond. Les chiffres ne le soutiennent pas (voir les dix lignes).
Calcul reproductible : `sources/calculs/economies_benchmark_europeen.py` (`python3 -I`, sortie `economies_benchmark_europeen_resultats.txt`, 9 sections). Données : Eurostat `gov_10a_exp` (S13, 2024, M€, 27 États + UE-27, natures D1, P2, P51G, D3, D4, D62, D632, D7, D9), `nama_10_gdp`, `nama_10_pc`, `demo_pjan`, `hlth_sha11_hf`, téléchargés le 03/11/2026 dans `$DONNEES/sources/eurostat/t57d/` (API de diffusion, curl sans en-tête truqué). Légende : **A** chiffrage officiel, **B** estimation reproductible de Claude, **C** piste. **[Calcul]** produit par le script ; **[Lu]** document ouvert ; **[Résumé]** non lu à la source. Registre : `verifications.md`, V9700 à V9711.

---

## 0. Résumé en dix lignes

1. **Par habitant en pouvoir d'achat, la France ne dépense pas plus que ses voisins riches** : 22 380 SPA par habitant en 2024, contre 22 928 (Allemagne), 23 758 (Pays-Bas), 22 398 (Suède) [Calcul]. Les 57 % du PIB contre 49 % (Allemagne) tiennent en grande partie à un PIB par habitant plus bas (39 294 SPA contre 47 008). Le benchmark en % du PIB gonfle donc les « économies » ; c'est pourquoi chaque calcul est fait sur les deux échelles et on garde la plus basse.
2. **Écart total** (2024) : +8,2 points de PIB contre l'Allemagne (240 Md€), +12,3 contre les Pays-Bas, +6,9 contre la Suède, +6,8 contre l'Italie. Contre l'Allemagne : fonctionnement +4,6 points, prestations en espèces +3,0, autres (subventions, intérêts, transferts) +3,1, achats de soins aux marchands −2,5.
3. **Le fonctionnement F+ (rémunérations, achats, investissement, soins achetés) ne montre aucun excès contre les Pays-Bas ni la Suède** (somme signée −38 Md€ chacun sur l'échelle du PIB), **+48 Md€ contre l'Allemagne, mais −97 par habitant en SPA**. Il n'apparaît franchement que contre l'Italie (+221) et la médiane des 27 (+185), pays plus pauvres : un repère de rattrapage, pas une cible.
4. **Administration générale** : +0,7 point de PIB sur l'écart (déjà connu), dont presque rien en fonctionnement (France 2,93 % hors dette ; médiane 2,64 ; Allemagne 3,69 ; Pays-Bas 1,98). Le benchmark ne dit pas « l'État est obèse » : il dit « dans la moyenne, avec des classements internes très différents » (V9701).
5. **Santé** : dépenses totales (tous financeurs, 2023) 11,3 % du PIB, 4 319 SPA par habitant, **moins que l'Allemagne (5 381), les Pays-Bas (4 913) et la Suède (4 614)**. Écart d'économie « si la France dépensait comme X » : −9 Md€ (Allemagne), +38 (Pays-Bas) sur l'échelle du PIB, négatif sur l'échelle par habitant. Seul l'écart avec l'Italie (+87) est grand, pays dont le reste à charge est de 2,0 % du PIB. **Rien de plus que les 9,7 Md€ déjà au modèle ne s'appuie sur ce benchmark.**
6. **Ce qui sort du benchmark** : les aides aux entreprises (GF04, subventions + transferts en capital : 2,64 % du PIB, contre 1,71 Allemagne, 0,84 Pays-Bas, 1,18 Suède) et les services locaux de GF06 (0,88 contre 0,2 pour « développement communautaire », classement douteux, V9707).
7. **Fourchette prudente à 10 ans, brute** (fonctionnement et aides, hors transferts) : **7,9 / 20,0 / 33,4 Md€/an** (bas / central / haut) [Calcul], solidité **B/C**. Les coefficients de réalisation (10 à 60 % de l'écart) sont des hypothèses de Claude (V9704).
8. **Additionnelle** à `economies-depense-publique.md` (A + B = 7,2 / 16,8 / 29,3) et au modèle, après retrait des recoupements : **2,0 / 6,4 / 12,6**, soit **1 / 4 / 9** si on retire les déchets (service payé par une taxe, pas une économie de budget). **Les 29 Md€ ne sont donc pas « trop peu » au regard du fonctionnement** : le benchmark les confirme (administration, éducation, culture et sport, aides) et ajoute au plus 9 Md€.
9. **Les vrais écarts sont des transferts aux ménages, c'est-à-dire des choix** : prestations en espèces +5,1 points contre la médiane, +3,0 contre l'Allemagne ; **vieillesse +106 Md€ contre l'Allemagne** (13,35 % du PIB contre 9,74), chômage +29 contre la médiane, aides au logement +17, exclusion +20. Le socle remplace 113 Md€ de prestations (chômage 37,1, famille 35,2, logement 16,0, RSA 12,4, prime d'activité 10,7, ASS 1,7) : **ces écarts ne sont pas des économies supplémentaires, ils sont déjà dans le modèle** (double compte à éviter). Hors modèle : les retraites, que le FMI et l'OCDE visent, mais que cette note ne chiffre pas comme économie.
10. **Recommandation** (à valider par l'auteur) : garder A + B (central 16,8) comme base, ajouter **au plus 4 Md€ central** (classe C) issus du benchmark, ne jamais écrire « la France dépense 8 points de trop », et présenter l'argument central autrement : *à richesse par habitant comparable, la France finance le même niveau de dépense ; la question politique est la répartition (retraites, transferts) plus que le coût de l'administration.* Cela renforce la logique du système (socle, non-recours, simplicité) et affaiblit celle d'un « État qui gaspille ».

---

## 1. Méthode et pièges

| Point | Choix | Piège |
|---|---|---|
| Source | Eurostat `gov_10a_exp`, S13 (administrations publiques consolidées), COFOG 99 niveau 2, 2024 | Les fonctions ne sont pas des ministères ; un pays peut classer la même dépense dans une autre sous-fonction (V9701) |
| % du PIB | M€ de la dépense divisés par le PIB `nama_10_gdp` (pas l'arrondi à 0,1 de `PC_GDP`) | Total France 56,96 % ici contre 57,3 % publié : millésime de PIB (V9700) |
| Fonctionnement F | D1 (rémunérations) + P2 (consommations intermédiaires) + P51G (investissement) | Exclut les soins achetés aux marchands |
| D632 | Soins et services marchands achetés pour les ménages (remboursements) | Le même soin est F dans un pays à hôpitaux publics, D632 dans un pays à prestataires privés remboursés : **F+ = F + D632** neutralise ce périmètre (V9702) |
| Transferts aux ménages | D62 (prestations en espèces) (+ D632 pour les soins) | Ce sont des choix, pas des coûts de fonctionnement |
| Autres | TE − F − D62 − D632 : subventions D3, intérêts D4, transferts D7, capital D9 | Mélange hétérogène |
| Par habitant en SPA | % du PIB × PIB par habitant en SPA (base UE-27 2020) | Le PIB sert de déflateur, approximation (V9703) |
| Médiane | Médiane simple des 27 | Dominée par des pays plus pauvres (V9708) |
| Comparateurs | DE, NL, SE, IT, médiane des 27 (UE-27 agrégée en plus dans les tableaux) | Défense exclue du calcul d'économies (hors mission), intérêts exclus (ce n'est pas du fonctionnement) |

**Règle contre la cueillette** : les écarts négatifs (là où la France dépense moins) sont montrés mais **non compensés** dans le calcul prudent du § 5 ; c'est un biais haussier, que la décote par coefficient de réalisation et le plancher à zéro de chaque groupe ne suppriment pas entièrement. Le script donne aussi la somme signée.

---

## 2. Le contexte : par habitant et en % du PIB (niveau 1)

Dépense publique par habitant en SPA, 2024 [Calcul] :

| Fonction | France | Allemagne | Pays-Bas | Suède | Italie | Médiane 27 |
|---|---|---|---|---|---|---|
| Total | **22 380** | 22 928 | 23 758 | 22 398 | 19 679 | 16 400 |
| Services généraux (avec dette) | 2 424 | 2 978 | 2 201 | 2 436 | 3 023 | 2 113 |
| Ordre et sécurité | 698 | 757 | 1 029 | 708 | 694 | 694 |
| Affaires économiques | 2 223 | 2 513 | 2 358 | 2 142 | 1 994 | 1 978 |
| Environnement | 405 | 263 | 855 | 244 | 352 | 257 |
| Logement, équipements | 564 | 220 | 329 | 353 | 301 | 268 |
| Santé | 3 496 | 3 528 | 3 884 | 3 292 | 2 592 | 2 592 |
| Culture, sport | 577 | 493 | 640 | 621 | 333 | 493 |
| Enseignement | 1 990 | 2 085 | 2 724 | 3 229 | 1 582 | 1 973 |
| Protection sociale | 9 278 | 9 464 | 8 866 | 8 502 | 8 306 | 5 735 |

Lecture : la France n'est **pas** un cas à part contre l'Allemagne et la Suède en dépense par tête. Sa protection sociale par habitant est à peine au-dessus de la Suède (+9 %), sous l'Allemagne. En revanche **le logement et les équipements collectifs** (2,6 fois l'Allemagne) et l'**environnement** (1,5 fois) se détachent.

### Décomposition additive de l'écart total, % du PIB (point de PIB ; 1 point = 29,4 Md€) [Calcul, section 3 bis]

| France moins | Total | Fonctionnement F | Soins achetés D632 | Prestations en espèces D62 | Autres | Total, Md€ |
|---|---|---|---|---|---|---|
| Allemagne | 8,18 | 4,60 | −2,49 | 2,97 | 3,10 | 240 |
| Pays-Bas | 12,26 | 3,35 | −4,22 | 8,54 | 4,59 | 360 |
| Suède | 6,93 | −4,12 | 2,84 | 7,62 | 0,60 | 203 |
| Italie | 6,78 | 3,88 | 4,02 | −1,02 | −0,10 | 199 |

Contre la médiane des 27 (composantes non additives) : total +10,56 ; F +1,85 ; D632 +3,67 ; D62 +5,10 ; autres +3,10.

---

## 3. Tableau par fonction (niveau 1), avec décomposition de l'écart contre l'Allemagne et contre la médiane

Points de PIB, 2024 [Calcul, sections 1, 3 bis et 5]. « F+ » = fonctionnement + soins achetés. « Écart Md€ » : France moins X × PIB français.

| Fonction | France % PIB | DE | NL | SE | IT | Médiane | Écart total vs médiane | F+ vs DE / NL / SE / IT / médiane (Md€) | Transferts D62 vs DE / médiane (Md€) |
|---|---|---|---|---|---|---|---|---|---|
| Services généraux (GF01, avec dette) | 6,17 | 6,33 | 4,14 | 5,44 | 7,71 | 5,45 | +0,72 | −26 / +26 / +3 / +4 / +4 | 0 / 0 |
| Ordre et sécurité (GF03) | 1,78 | 1,61 | 1,94 | 1,58 | 1,77 | 1,72 | +0,06 | +3 / −6 / +9 / +1 / +1 | 0 / 0 |
| Affaires économiques (GF04) | 5,66 | 5,35 | 4,44 | 4,78 | 5,08 | 5,46 | +0,20 | −22 / −18 / −19 / +15 / −20 | −4 / 0 |
| Environnement (GF05) | 1,03 | 0,56 | 1,61 | 0,54 | 0,90 | 0,71 | +0,32 | +13 / −17 / +12 / +1 / +9 | 0 / 0 |
| Logement, équipements (GF06) | 1,44 | 0,47 | 0,62 | 0,79 | 0,77 | 0,60 | +0,83 | +24 / +18 / +14 / +23 / +18 | 0 / 0 |
| Santé (GF07) | 8,90 | 7,51 | 7,31 | 7,35 | 6,61 | 6,61 | +2,29 | +42 / +47 / +54 / +62 / +64 | −7 / 0 |
| Culture, sport (GF08) | 1,47 | 1,05 | 1,20 | 1,39 | 0,85 | 1,25 | +0,22 | +10 / +7 / +4 / +17 / +6 | 0 / 0 |
| Enseignement (GF09) | 5,06 | 4,44 | 5,12 | 7,21 | 4,03 | 4,95 | +0,11 | +27 / −6 / −42 / +29 / +5 | +4 / +2 |
| Protection sociale (GF10) | 23,61 | 20,13 | 16,68 | 18,99 | 21,18 | 17,05 | +6,56 | −27 / −91 / −77 / +66 / +48 | +94 / +167 |

Dans **affaires économiques**, l'excès français est dans la colonne « autres » (+35 Md€ contre l'Allemagne, +54 contre les Pays-Bas, +45 contre la Suède) : subventions D3 et transferts en capital D9, pas le fonctionnement (−22 contre l'Allemagne). Le niveau 2 complet (66 sous-fonctions × 5 comparateurs, % du PIB et SPA par habitant, F, D632, D62, autres) est dans le fichier de résultats, sections 2 et 4.

### Niveau 2 : les sous-fonctions demandées (% du PIB, 2024 ; total) [Calcul, section 2]

| Sous-fonction | France | DE | NL | SE | IT | Médiane | Lecture |
|---|---|---|---|---|---|---|---|
| Exécutif, finances, affaires étrangères (0101) | 1,46 | 2,04 | 2,05 | 1,89 | 1,96 | 2,04 | France **sous** tous |
| Services généraux divers (0103) | 1,83 | 1,51 | 0,45 | 0,59 | 0,94 | 0,65 | Écart énorme, classement douteux (V9701) |
| Recherche fondamentale (0104) | 0,68 | 0,98 | 0,52 | 1,46 | 0,58 | 0,52 | Choix politique |
| Police (0301) | 0,98 | 0,74 | 0,82 | 0,80 | 1,02 | 0,94 | +0,05 |
| Tribunaux (0303) | 0,28 | 0,37 | 0,29 | 0,26 | 0,35 | 0,29 | Dans la médiane |
| Prisons (0304) | 0,17 | 0,10 | 0,34 | 0,30 | 0,18 | 0,15 | +0,02 |
| Aides économiques générales, travail (0401) | 1,54 | 0,84 | 0,54 | 0,90 | 0,82 | 0,74 | +0,80, dont 0,97 en « autres » (subventions) |
| Transport (0405) | 2,07 | 2,64 | 2,20 | 3,45 | 2,34 | 2,77 | France **sous** |
| R&D économique (0408) | 0,73 | 0,28 | 0,47 | 0,06 | 0,28 | 0,20 | Plancher de 6,6 Md€ (toutes comparaisons) ; choix politique |
| Développement communautaire (0602) | 0,93 | 0,21 | 0,19 | 0,36 | 0,20 | 0,19 | Plancher 14,7 Md€ ; classement local à vérifier (V9707) |
| Logement (développement, 0601) | 0,29 | 0,13 | 0,35 | 0,21 | 0,38 | 0,22 | Dans la fourchette |
| Médicaments, dispositifs (0701) | 1,49 | 1,74 | 0,71 | 0,78 | 0,92 | 0,81 | Écart selon le périmètre |
| Consultations (0702) | 3,13 | 2,24 | 2,23 | 3,40 | 2,43 | 1,71 | Périmètre D632 (France : tout en soins achetés) |
| Hôpital (0703) | 3,73 | 2,82 | 3,44 | 2,60 | 2,73 | 3,36 | +0,36 vs médiane |
| Santé publique (0704) et divers (0706) | 0,33 | 0,61 | 0,52 | 0,38 | 0,43 | 0,36 | France **sous** |
| Primaire et préprimaire (0901) | 1,44 | 1,47 | 1,57 | 4,59 | 1,40 | 1,54 | Suède : classement atypique |
| Secondaire (0902) | 2,17 | 1,53 | 1,98 | 1,11 | 1,79 | 1,63 | +0,55 : France haute |
| Supérieur (0904) | 0,42 | 0,77 | 1,34 | 1,09 | 0,41 | 0,82 | France **basse** (contre l'idée reçue) |
| Services auxiliaires à l'éducation (0906) | 0,68 | 0,42 | 0,19 | 0,02 | 0,22 | 0,22 | Plancher 1,9 Md€ ; cantines, transport scolaire (collectivités) |
| Sport et loisirs (0801) | 0,53 | 0,28 | 0,50 | 0,68 | 0,30 | 0,34 | +0,19 |
| Culture (0802) | 0,65 | 0,41 | 0,45 | 0,52 | 0,34 | 0,54 | +0,11 |
| Vieillesse (1002) | 13,35 | 9,74 | 6,17 | 10,89 | 13,86 | 9,74 | +3,61, **entièrement transferts** |
| Maladie, invalidité (1001) | 2,86 | 3,28 | 4,35 | 3,54 | 1,71 | 2,17 | Sous les trois riches |
| Famille (1004) | 2,27 | 1,91 | 2,44 | 2,28 | 1,46 | 1,81 | +0,47 |
| Chômage (1005) | 1,65 | 1,64 | 0,68 | 1,07 | 0,92 | 0,68 | +0,98 vs médiane, égal à l'Allemagne |
| Logement social (1006) | 0,72 | 0,44 | 0,44 | 0,28 | 0,04 | 0,14 | +0,58 |
| Exclusion (1007) | 1,24 | 0,61 | 2,55 | 0,78 | 0,68 | 0,55 | +0,69 vs médiane ; Pays-Bas plus haut |

Seules **cinq sous-fonctions** sont au-dessus de la France contre les dix comparaisons (cinq comparateurs × deux échelles) : R&D économique (0408), développement communautaire (0602), culture (0802), enseignement non ventilable (0905) et services auxiliaires à l'éducation (0906). Aucune n'est « de l'administration ».

### Administration générale, détail [Calcul, section 3]
| Agrégat (% du PIB) | France | DE | NL | SE | IT | Médiane |
|---|---|---|---|---|---|---|
| Services généraux hors dette, total | 4,16 | 5,21 | 3,42 | 4,66 | 3,74 | 3,74 |
| dont fonctionnement F | 2,93 | 3,69 | 1,98 | 2,70 | 2,65 | 2,64 |

Hors dette, la France est **sous l'Allemagne et la Suède** et au-dessus de la médiane de 0,3 point (8,5 Md€). Comme le total GF01 comprend 2,01 % de charge de la dette (médiane 1,43), **le « +0,7 » de l'écart tient pour 0,58 à la dette**, pas à l'administration (V9701).

### Santé : le même soin dans deux colonnes [Calcul, section 8, SHA 2023]
| | Total tous financeurs % PIB | Régimes publics et obligatoires HF1 | Volontaire HF2 | Reste à charge HF3 | Total, SPA par habitant |
|---|---|---|---|---|---|
| France | 11,33 | 9,44 | 0,73 | 1,16 | 4 319 |
| Allemagne | 11,64 | 9,97 | 0,35 | 1,32 | 5 381 |
| Pays-Bas | 10,04 | 8,29 | 0,53 | 1,22 | 4 913 |
| Suède | 11,24 | 9,69 | 0,12 | 1,43 | 4 614 |
| Italie | 8,37 | 6,11 | 0,27 | 1,98 | 3 082 |
| UE-27 | 9,94 | 7,98 | 0,46 | 1,51 | 3 826 |

En COFOG, la France est à 8,9 % du PIB contre 7,5 % (Allemagne) : l'écart de 1,4 point (41 Md€) vient pour 3,2 points de **fonctionnement** (hôpitaux publics) compensés pour −1,8 par des soins achetés ailleurs. Autrement dit, ce n'est pas la dépense de santé qui diffère, c'est **qui la finance et qui la produit**. Une économie « comme l'Allemagne » est **négative** (−9 Md€ sur l'échelle du PIB). Seul le reste à charge est plus bas en France que chez les voisins (1,16 contre 1,22 à 1,43 % du PIB), ce qui est un choix de couverture, pas un gaspillage.

---

## 4. Calcul « si la France dépensait comme X » : fonctionnement F+ seul (Md€/an, 2024)

[Calcul, section 4] Positif = économie. Deux échelles : (a) % du PIB × PIB de la France ; (b) dépense par habitant en SPA × population × coefficient (1,0878 € par SPA).

| | Allemagne | Pays-Bas | Suède | Italie | Médiane UE-27 |
|---|---|---|---|---|---|
| (a) % du PIB, somme signée | **+48** | −39 | −38 | **+221** | **+185** |
| (b) par habitant en SPA, somme signée | −97 | −329 | −153 | +222 | +191 |
| (a) somme des seuls écarts positifs (cueillette, biais) | 202 | 174 | 237 | 263 | 263 |
| (b) somme des seuls écarts positifs | 132 | 105 | 206 | 263 | 261 |

Défense, dette et transferts entre niveaux exclus. **Lecture** : la somme signée est la seule honnête ; elle est proche de zéro ou négative contre les trois voisins riches. La cueillette (« France moins le meilleur de chaque fonction ») donne 100 à 260 Md€ : c'est un chiffre **sans valeur opérationnelle** (aucun pays ne fait le meilleur partout, et la comparaison suppose des périmètres identiques). Il est donné pour que l'auteur sache pourquoi on ne le reprend pas.

**Ce qui relève de différences de périmètre et non d'économies** :
- Santé : production publique ou privée (Pays-Bas, Allemagne : D632 ; France : hôpital public F) → F+ ; un écart subsiste sur le reste à charge, donc sur la répartition du financement.
- Soins de longue durée et services aux personnes âgées : en Suède, produits par les communes (F de la protection sociale : 4,59 % du PIB contre 1,61 en France) ; en France, partiellement par les ménages et le privé.
- Éducation : classement suédois atypique des écoles de la petite enfance (GF0901 : 4,59 %) ; ne pas lire « −79 Md€ ».
- Déchets (GF0501) et cantines (GF0906) : services que beaucoup de pays font payer à l'usager ou au privé.
- PIB : un pays plus riche dépense plus par tête (échelle b).

---

## 5. Fourchette prudente à 10 ans [Calcul, section 10]

Méthode : base = médiane des écarts de F+ de cinq comparateurs (échelle a) et des cinq mêmes sur l'échelle b ; on garde la plus petite ; plancher à zéro ; coefficient de réalisation par groupe **[Hypothèse de Claude]** (administration et collectivités 15 / 35 / 60 % ; autres fonctions 10 / 25 / 40 % ; aides aux entreprises 10 / 30 / 50 % de l'écart avec l'Allemagne ; santé 0 %).

| Ligne | Base a / b (Md€) | Brut bas / central / haut | Déjà compté ailleurs | **Additionnel** | Solidité |
|---|---|---|---|---|---|
| Administration générale hors dette | 8,3 / 7,2 | 1,1 / 2,5 / 4,3 | 5,1 / 11,6 / 20,4 (A1, A2, B1, B2, B4, B5) | 0 / 0 / 0 | B : confirme A + B |
| Logement et équipements collectifs, fonctionnement | 20,4 / 19,3 | 2,9 / 6,7 / 11,6 | 2,0 / 3,0 / 4,0 (A3, recoupe A1-A2) | 0,9 / 3,7 / 7,6 | **C** (classement 0602, V9707) |
| Enseignement | 14,2 / 6,3 | 0,6 / 1,6 / 2,5 | 2,2 / 3,9 / 5,5 (non-remplacement, v4) | 0 / 0 / 0 | B : confirme le modèle |
| Culture et sport | 10,0 / 5,0 | 0,5 / 1,2 / 2,0 | 1,0 / 3,0 / 5,7 (A4, B3) | 0 / 0 / 0 | B |
| Ordre et sécurité | 1,7 / 0,7 | 0,1 / 0,2 / 0,3 | 0 | 0,1 / 0,2 / 0,3 | C (négligeable) |
| Environnement (déchets, eau) | 11,5 / 9,9 | 1,0 / 2,5 / 4,0 | 0 | 1,0 / 2,5 / 4,0 | **C** : service payé par taxe et redevance, pas une économie de budget (retiré du retenu) |
| Santé | 54,1 / 26,9 | 0 | (9,7 au modèle) | 0 | Non soutenu par le benchmark |
| Aides aux entreprises (GF04, D3 + D9, écart avec l'Allemagne) | 27,4 / 17,6 | 1,8 / 5,3 / 8,8 | 8,0 (e2 apprentissage 4,6 + CIR recentré 3,4) | 0 / 0 / 0,8 | B/C |
| **Total** | | **7,9 / 20,0 / 33,4** | | **2,0 / 6,4 / 12,6** | |

**Fourchette retenue (hors déchets, arrondie, classe C, à 10 ans)** : **économie additionnelle de 1 / 4 / 9 Md€/an** sur A + B + modèle. Avec A + B, cela donne **8 / 21 / 38 Md€** à 10 ans, dont l'essentiel déjà documenté. À 3 ans, on ne retient rien de plus (les mesures additionnelles passent par les collectivités, à effet lent).

### Ce que disent les rapports (et leur limite)

- **FMI, déclaration de fin de mission, article IV 2026 (21/05/2026)** [Lu : https://www.imf.org/en/news/articles/2026/05/21/mcs-052126-france-staff-concluding-statement-of-the-2026-article-iv-mission] : dépense publique 57,5 % du PIB en 2025 (la plus haute de la zone euro) ; effort structurel de 0,8 % du PIB par an en 2027-2029 ; « rationaliser les dépenses inefficaces et réaffecter dépenses courantes et sociales vers les priorités » ; ticket modérateur sur les soins non urgents modulé par le revenu ou l'état de santé ; stratégie de réforme des retraites crédible, harmonisation des régimes ; resserrer l'éligibilité et la conditionnalité de l'assurance chômage, unifier l'allocation sociale. **Aucun montant en euros pour les revues de dépenses.** Rapport complet (Country Report n° 26/187, 22/07/2026) non ouvert : ⚠️ V9705.
- **OCDE, Étude économique de la France, juin 2026** [Résumé : communiqué du 30/06/2026, page refusée (403), résumés de presse] : réforme « profonde et durable » par la dépense, stabilisation de la dette à 122 % du PIB vers 2030 à partir de la baisse de la dépense, retraites. Texte non lu, aucune économie par poste lue ⚠️ V9705.
- **Cour des comptes, juin 2026 (situation et perspectives des finances publiques)** [Résumé : presse] : déficit 2025 ramené à 5,0 % du PIB, objectifs 2026 « menacés », demande de « mesures fortes », contribution des collectivités. Pas de liste d'économies par poste dans ce qui a été lu ⚠️ V9705.
- **IGF, revue des aides aux entreprises (2024)** [Résumé : presse] : 99 Md€ d'aides aux entreprises en 2022, 64 Md€ examinés ; économies évoquées de 3 Md€ sur les aides de l'État, et jusqu'à 10 Md€ avec les taux réduits de TVA selon une source. Ces 3 Md€ s'accordent avec la base basse ici (1,8 à 5,3 Md€) ⚠️ V9705.
- **IGESR-IGF, dépenses en direction des associations (mai 2025)** [Résumé] : trois scénarios d'économie de 1 à 3 Md€ : déjà en A4.
- **Cour des comptes 2024 (collectivités)** et **IGF logement social** : repris de `economies-depense-publique.md` (A1, A2, A3), non rouverts.

Aucun de ces documents ne chiffre une « économie de benchmark » de 50 ou 100 Md€ sur le fonctionnement. Quand le FMI dit 0,8 point de PIB par an, soit ≈ 23 Md€ par an d'effort sur trois ans, cela inclut recettes et dépenses : le même ordre de grandeur que le central brut ci-dessus (20 Md€) étalé sur dix ans, et bien en deçà d'un « rattrapage » sur l'écart de 8 points.

---

## 6. Transferts aux ménages : où est vraiment l'écart, et ce que le modèle remplace déjà

[Calcul, sections 5 et 6] Écarts France moins médiane, Md€ à l'échelle du PIB français (D62 = prestations en espèces) :

| Risque | Total vs médiane | dont D62 | Vs Allemagne | Vs Pays-Bas | Vs Suède | Vs Italie | Dans le socle (113 Md€) ? |
|---|---|---|---|---|---|---|---|
| Vieillesse (1002) | **+106** | +101 | **+106** | +211 | +72 | −15 | **Non** : pensions conservées (économie sur les pensions comptée à part au modèle) |
| Survivants (1003) | +13 | +13 | −14 | +39 | +37 | −30 | Non |
| Maladie, invalidité (1001) | +20 | −0,5 | −12 | −44 | −20 | +34 | Non |
| Famille (1004) | +14 | −4 | +11 | −5 | 0 | +24 | Allocations familiales (35,2) : oui, mais la part COFOG en espèces est petite (−4) : écart de périmètre ⚠️ V9709 |
| Chômage (1005) | +29 | +25 | +0,5 | +29 | +17 | +22 | Oui (37,1 + ASS 1,7) |
| Logement (1006) | +17 | +0,4 | +8 | +8 | +13 | +20 | Oui (16,0) ; en COFOG, D632 : l'aide est comptée en « soins achetés » ⚠️ V9709 |
| Exclusion (1007) | +20 | +19 | +19 | −38 | +14 | +17 | Oui (RSA 12,4 + prime d'activité 10,7) |

**Double compte** : le total COFOG des risques famille + chômage + logement + exclusion contre la médiane est de **≈ 80 Md€**, **inférieur aux 113 Md€** que le modèle supprime : ces écarts sont donc entièrement « consommés » par le socle, et **il ne reste pas d'économie de transferts à ajouter** sans compter deux fois. De même, les 885,9 Md€ de prélèvements supprimés portent sur les recettes : aucune recette n'entre dans cette note.
**Ce que le benchmark ne dit pas** : la vieillesse (106 Md€ contre l'Allemagne) est le seul grand écart qui reste hors du modèle. Il tient à l'âge de départ, au taux de remplacement et à la démographie (la part des plus de 65 ans) : ce n'est pas une inefficacité, c'est un choix (le FMI et l'OCDE recommandent de le réformer). Les pensions sortent du périmètre de la mission ; à traiter séparément, avec la démographie comparée avant tout chiffrage (V9710).

---

## 7. Contradictions et fragilités à nommer (règle 7)

1. **Le risque de complaisance** : la demande porte sur un chiffre plus grand. Le benchmark le donne si on prend la cueillette (260 Md€) ou la médiane des 27 (185 Md€). Les deux sont des artefacts : un comparateur pauvre ne fixe pas une cible pour un pays riche. Écrire ce chiffre serait un contresens.
2. **Contradiction avec la thèse « l'État coûte trop cher »** : par habitant, la France dépense autant que l'Allemagne et la Suède. La thèse plus défendable est : « le même niveau de dépense, mais **mal réparti** (retraites, complexité) et **mal mesuré** (aucun compte rendu par fonction) ».
3. **La France est sous les comparateurs** sur l'exécutif et les finances (0101), les transports, l'enseignement supérieur, la santé publique, les tribunaux : le benchmark invite aussi à *dépenser plus* à ces endroits, ce qui réduit le net.
4. **Les coefficients de réalisation** (15 à 60 %) sont des hypothèses ; avec 5 % à 15 %, le central brut passe à 3 à 8 Md€.
5. **Ce que l'IA ne sait pas ici** : la cause de l'écart sur GF0602 (0,93 % du PIB contre 0,2) : classement des communes, ou dépense réelle d'aménagement urbain ? À vérifier dans la nomenclature nationale (INSEE, comptes des APU) avant d'en tirer une mesure.
6. **Pro-technologie** : les gains par l'IA dans l'administration ne sont pas dans cette fourchette (déjà en B2) ; ne pas les ajouter ici.

---

## 8. Sources (récapitulatif)

| Source | D'où | Ce qu'elle établit |
|---|---|---|
| Eurostat, `gov_10a_exp` | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp (téléchargé le 03/11/2026) | Dépenses par fonction (COFOG) et par nature (D1, P2, P51G, D62, D632...), 2024 |
| Eurostat, `nama_10_gdp`, `nama_10_pc`, `demo_pjan` | idem, jeux de même nom | PIB (M€), PIB par habitant en SPA, population au 1er janvier 2024 |
| Eurostat, `hlth_sha11_hf` | idem | Dépense de santé par régime de financement, 2023 |
| FMI, déclaration de fin de mission, art. IV 2026 | https://www.imf.org/en/news/articles/2026/05/21/mcs-052126-france-staff-concluding-statement-of-the-2026-article-iv-mission (consulté le 03/11/2026) | Dépense 57,5 % du PIB en 2025 ; 0,8 point d'effort par an ; ticket modérateur, retraites, chômage |
| `sources/economies-depense-publique.md` | Dépôt | Lignes A et B, éducation, recoupements |
| `modeles/systeme-ideal/methode.md` (H86) | Dépôt | 113 Md€ de prestations remplacées |
| OCDE (juin 2026), Cour des comptes (juin 2026), IGF (2024), IGESR-IGF (2025) | Presse, non lus à la source | Cadre qualitatif ; aucun chiffre par poste repris à la source ⚠️ |

Fichiers bruts : `$DONNEES/sources/eurostat/t57d/` (hors dépôt ; SHA-256 dans le LISEZMOI.md de ce dossier).
