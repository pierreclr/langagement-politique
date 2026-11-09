# Agriculture : résultats

Générés par `python3 rapport.py` (hypothèses H1 à H24 dans [`methode.md`](methode.md) ; tests : 38 + 18 au vert (module heures)). **Ordres de grandeur, jamais des prédictions.** « bas / central / haut » = capacité d'adaptation faible / moyenne / forte, politique identique. Les valeurs non confirmées sont dans le registre V6090-V6111 de `verifications.md`.

## En huit phrases

1. **Le chiffrage tient à un choix de cadre.** Dans le cadre « Union » (les aides sortantes économisées), la sortie dégage **1,3 / 1,8 / 2,2 Md€ par an à l'année 10** (bas / central / haut), soit **5,2 / 8,6 / 12,1 Md€ cumulés sur 10 ans**. Dans le cadre « France seule » (rien n'est économisé, PSE et fonds sur crédits nationaux), elle **coûte 1,7 à 2,6 Md€ par an** (9,5 à 16,4 Md€ cumulés). Une sortie unilatérale n'existe pas en droit, et si elle existait, elle serait une dépense.
2. **Aides sortantes** : 3,9 Md€ par an à l'année 10 (base et couplées), contre 4,1 Md€ dans les chiffres 2024.
3. **Le fonds « ne perdre personne »** coûte, avec 50 % de recyclage en PSE, **0,8 / 0,4 / 0,05 Md€ par an** à l'année 10 (pic à l'année 7). Sans aucun PSE, il passe à 1,4 Md€ ; avec 100 % de PSE, il tombe à 0 mais le budget net aussi (tableau L) : **on ne peut pas à la fois économiser et ne perdre personne**, l'arbitrage est un curseur.
4. **Exploitations touchées** (année 10, sans fonds) : **90 000** exploitations (32 %) tomberaient sous leur plancher dans le scénario central (105 000 en bas, 23 000 en haut), surtout en bovins viande (19 000), grandes cultures (17 000) et bovins lait (10 000).
5. **Revenu négatif** : 14 % des exploitations avant réforme ; sans fonds 16 % (bas 19 %, haut 12,7 %) ; avec fonds, jamais plus qu'avant.
6. **Pollueur-payeur** : multiplier la RPD par trois en 10 ans rapporte 0,35 Md€ de plus et ne baisse les ventes que de **2 à 8 %** ; la taxe azote de 0,30 €/kg rapporte 0,5 Md€ et baisse l'usage de 3 à 11 %. Pour une baisse de 40 % des ventes de pesticides (objectif danois de 2013), il faudrait **×56** le taux actuel (×20 à ×1750 selon l'élasticité) : l'outil est lent, ou l'élasticité est sous-estimée, ou il faut une interdiction ciblée, que l'auteur refuse.
7. **Robots** : en grandes cultures, **non rentables** face à l'herbicide avant 15 à 51 ans de baisse des prix ; en maraîchage, rentables d'extrême justesse (+0,7 à +3,4 k€ par an) ; pour la traite, rentables seulement si le temps libéré est valorisé à 2,5 fois le salaire (haut).
8. **La thèse « robots contre monoculture » n'est pas soutenue à dix ans** : les robots évitent au plus 0,2 à 0,6 % des pesticides contre 1,7 à 8,3 % pour la redevance. Elle reste plausible à plus long terme (voir la section « Heures par hectare et robots » : seuil de 5 à 9 € l'heure, 2032 à 2048 ou jamais) et pour les petites parcelles (une modélisation britannique), mais le modèle ne peut ni la confirmer ni la réfuter.

## Heures par hectare et robots (ajout du 03/11/2026)

Module [`heures.py`](heures.py) · tests [`test_heures.py`](test_heures.py) (18 au vert) · tables : `python3 rapport_heures.py` · données : [`heures_par_hectare.csv`](donnees/heures_par_hectare.csv), [`robots_cout_horaire.csv`](donnees/robots_cout_horaire.csv) · hypothèses H25 à H36 dans [`methode.md`](methode.md) § 11 · ⚠️ V10600-V10613. **Ordres de grandeur sous hypothèses, jamais des prédictions.**

### Dix lignes

1. **Correction d'ordre de grandeur.** Le Bec-Hellouin, c'est **33 000 € (2013) puis 57 000 € (2014) TTC sur 1 000 m², pas sur 10 000 m²**, pour **2 006 puis 3 026 heures par an** (rapport final INRA-AgroParisTech, 30/11/2015, lu). Le rapport précise que ces 1 000 m² (zone la plus intensive, 42 % sous serre) « ne doivent en aucun cas être considérés comme suffisants pour établir une microferme ». À l'hectare, ce serait 20 000 à 30 000 heures : 12 à 19 personnes à temps plein.
2. **Intensif à l'hectare, pas à l'heure.** Après amortissements, le travail y est rémunéré **5,4 à 9,5 € de l'heure** (rapport, 2013-2014), soit 898 à 1 571 € par mois pour l'exploitant : sous le salaire chargé d'un salarié (16 € par heure, hypothèse).
3. **La céréale rapporte 30 à 50 € de marge par heure**, contre 5 à 9 € pour le maraîchage bio-intensif. La monoculture ne tient pas seulement parce que l'heure coûte cher : elle tient parce qu'une heure y produit cinq à dix fois plus. Par hectare, c'est l'inverse (108 000 à 287 000 € contre 167 à 560 €).
4. **Le robot aujourd'hui coûte plus qu'un salarié** : 31 € par heure équivalente humaine au central (16 à 70 selon l'usage et la fiabilité), contre 16 €. Essai Arvalis 2023-2024 (blé, 3 ha) : le robot demande 3,7 h/ha contre 3,5 au tracteur, laisse 36 adventices/m² et rapporte 34 €/ha contre 167.
5. **Seuil par hectare** : il faut un robot à **5 à 9 € l'heure équivalente** (8,1 au central, avec 95 % des heures robotisées). Atteint vers **2032 (haut), 2048 (central), jamais (bas)**. Si le robot ne sait faire que 40 % des heures (central), même gratuit il ne suffit pas : il en faut au moins 47 %.
6. **Seuil par actif** (le critère qui compte pour un exploitant) : il faut robotiser **plus de 80 à 90 % des heures** ; à 95 %, le seuil est 3 à 7 € l'heure, vers 2034 (haut), 2052 (central), jamais (bas).
7. **Débouchés** : à 330 000-570 000 € de chiffre d'affaires par hectare, **12 000 à 21 000 hectares** suffiraient à produire toute la valeur des fruits et légumes français (0,04 à 0,08 % de la SAU). Offre ×2 : prix ÷ 3,3 (élasticité de mémoire ⚠️). Ce système ne peut pas remplacer la monoculture, il peut en occuper une marge.
8. **Agroforesterie** : 1 à 4 heures par hectare et par an de travail en plus (taille) : ce n'est pas un problème d'heures, donc pas un problème de robots (freins : foncier loué, capital, horizon de 30 ans, aides). **Forêt jardinée** : aucun chiffre de coût comparatif trouvé ; je ne le chiffre pas. **Élevage herbager** : 21 heures par vache et par an ; marge par hectare non trouvée.
9. **Verdict.** La thèse est **vraie pour une partie** (l'heure humaine bloque les systèmes très intensifs en main-d'œuvre) et **fausse pour l'essentiel** (la rentabilité du complexe dépend de robots capables de semer, repiquer et récolter à 5-9 € l'heure en milieu non structuré, ce qui n'existe pas). À dix ans : non. Horizon plausible : 2032 si tout va très bien, 2048 au central, sans date au bas.
10. **Ce que l'État peut financer dès maintenant** sans bâtir le budget dessus : mesure en fermes réelles (heures par hectare dans le RICA, essais comme Hands Free Hectare), recherche sur la manipulation de cultures délicates, fermes de référence en agroforesterie et en forêt jardinée avec comptabilité du travail. **Aucune recette de budget ne doit en dépendre.**

### Ce que le module établit, détaillé

#### 1. Les systèmes mesurés (par hectare-équivalent et par an)
| Cas | Marge avant travail (€/ha) | Heures/ha | Marge par heure (€/h) | Actifs/ha (ETP) |
|---|---|---|---|---|
| Bec-Hellouin extrapolé à 1 ha (bas) | 107 722 | 20 060 | 5,37 | 12,5 |
| Bec-Hellouin extrapolé à 1 ha (central) | 258 810 | 30 260 | 8,55 | 18,8 |
| Bec-Hellouin extrapolé à 1 ha (haut) | 286 510 | 30 260 | 9,47 | 18,8 |
| Monoculture céréalière (bas) | 167 | 3,5 | 47,7 | 0,002 |
| Monoculture céréalière (central) | 300 | 6,0 | 50,0 | 0,004 |
| Monoculture céréalière (haut) | 560 | 17,7 | 31,6 | 0,011 |

Revenu par actif d'un céréalier seul, sans robot (central) : 268 ha × 300 €/ha = 80,3 k€

#### 2. Coût horaire du robot aujourd'hui (€ par heure équivalente humaine) contre le travail humain
| Scénario | Utilisation (h/an) | Disponibilité réelle | Robot aujourd'hui (€/h) | Humain chargé (€/h) | Baisse annuelle | Robot en 2036 (€/h) | Robot en 2046 (€/h) |
|---|---|---|---|---|---|---|---|
| bas | 500 | 50 % | 70,4 | 14 | 3 % | 51,9 | 38,3 |
| central | 800 | 70 % | 31,4 | 16 | 6 % | 16,9 | 9,1 |
| haut | 1 200 | 90 % | 16,3 | 22 | 10 % | 5,7 | 2,0 |

#### 3. Seuil : coût horaire du robot (€/h équivalent humain) en dessous duquel le maraîchage bio-intensif bat la céréale
Monoculture : scénario central (300 €/ha, 6 h/ha), humain à 16 €/h. « jamais » : même un robot gratuit ne suffit pas à cette part robotisée.

**Critère par hectare**
| Part des heures robotisées r | seuil c* (bas) | seuil c* (central) | seuil c* (haut) | date (bas) | date (central) | date (haut) |
|---|---|---|---|---|---|---|
| 40 % | jamais | jamais | jamais | jamais | jamais | jamais |
| 70 % | 0,8 | 5,4 | 6,7 | jamais | 2055 | 2035 |
| 80 % | 2,7 | 6,7 | 7,8 | jamais | 2052 | 2033 |
| 90 % | 4,2 | 7,7 | 8,7 | jamais | 2049 | 2032 |
| 95 % | 4,8 | 8,2 | 9,1 | jamais | 2048 | 2032 |
| 99 % | 5,3 | 8,5 | 9,4 | jamais | 2048 | 2032 |

**Critère par actif**
| Part des heures robotisées r | seuil c* (bas) | seuil c* (central) | seuil c* (haut) | date (bas) | date (central) | date (haut) |
|---|---|---|---|---|---|---|
| 40 % | jamais | jamais | jamais | jamais | jamais | jamais |
| 70 % | jamais | jamais | jamais | jamais | jamais | jamais |
| 80 % | jamais | jamais | jamais | jamais | jamais | jamais |
| 90 % | 0,4 | 3,9 | 5,0 | jamais | 2060 | 2038 |
| 95 % | 3,0 | 6,4 | 7,3 | jamais | 2052 | 2034 |
| 99 % | 4,9 | 8,1 | 9,1 | jamais | 2048 | 2032 |

**Part robotisée minimale avec un robot gratuit** : bas : 67 % par ha, 89 % par actif ; central : 47 % par ha, 83 % par actif ; haut : 41 % par ha, 81 % par actif

#### 4. Table générique : marge par hectare (avant travail) qu'un système doit atteindre pour égaler la céréale (profit 204 €/ha à 16 €/h)
| Heures/ha | Au coût humain 16 €/h (€/ha) | Au coût robot 8 €/h (€/ha) | Marge par heure requise à 16 €/h |
|---|---|---|---|
| 10 | 364 | 284 | 36,4 |
| 30 | 684 | 444 | 22,8 |
| 100 | 1 804 | 1 004 | 18,0 |
| 300 | 5 004 | 2 604 | 16,7 |
| 1 000 | 16 204 | 8 204 | 16,2 |
| 3 000 | 48 204 | 24 204 | 16,1 |
| 20 000 | 320 204 | 160 204 | 16,0 |

#### 5. Contraintes de débouchés
- À 328 k€ de chiffre d'affaires par hectare, **20 732 ha** suffiraient à produire toute la valeur des fruits et légumes français (6,8 Md€, 2021, fruits inclus) : 0,077 % de la SAU.
- À 573 k€ de chiffre d'affaires par hectare, **11 867 ha** suffiraient à produire toute la valeur des fruits et légumes français (6,8 Md€, 2021, fruits inclus) : 0,044 % de la SAU.
- Offre multipliée par 2 : prix divisé par 3,3 (élasticité −0,58 ⚠️).
- Offre multipliée par 5 : prix divisé par 16,0 (élasticité −0,58 ⚠️).
- Offre multipliée par 10 : prix divisé par 53,0 (élasticité −0,58 ⚠️).
- Offre maximale pour ne pas perdre plus de 20 % de prix : ×1,14.

### Contraintes non chiffrées (nommées)

- **Foncier** : le modèle suppose 30 à 80 % de SAU louée selon la filière (hypothèse H2-H4, `filieres.csv`) ; un fermier ne plante pas d'arbres et n'investit pas à 30 ans sans bail adapté.
- **Savoir-faire** : le rapport du Bec-Hellouin attribue la hausse de 33 000 à 57 000 € aux compétences acquises ; la ferme est un lieu d'expérimentation permanent, « loin des exploitations en routine ».
- **Capital** : amortissements de 1 900 à 5 700 € par an pour 1 000 m² (rapport) ; robot de 75 000 à 97 000 € (constructeur).
- **Rendement réel des robots en milieu non structuré** : modélisé par la disponibilité (50, 70, 90 %) ; non mesuré hors essais.
- **Marges de la monoculture** : hypothèse non sourcée (167 à 560 €/ha) ; si elle est plus faible (hors aides), le seuil monte, mais le résultat par actif change peu.

### Conclusion honnête

La thèse « si la robotique neutralise le coût du travail, les systèmes complexes deviennent rentables » **est arithmétiquement exacte et pratiquement conditionnelle** : elle exige un robot à 5-9 € l'heure équivalente capable de 90-95 % du travail manuel d'un système qui demande 20 000 heures par hectare. Les chiffres lus (Arvalis, FarmDroid, Naïo en redressement) montrent des robots de désherbage, pas des robots de repiquage ou de récolte de légumes variés. Le modèle ne mesure pas les robots de récolte (aucun prix publié). Il ne dit rien non plus des raisons de la monoculture qui ne sont pas des heures : contrats d'aval, logistique, prix du foncier, aides couplées. L'auteur peut garder cette thèse comme **horizon de recherche à vingt ou trente ans**, pas comme argument de chiffrage.

## A. Calibrage
- Exploitations : 282 182 ; revenu moyen modélisé 39,6 k€ ; subventions moyennes 28,4 k€ (72 % du revenu)
- Part à revenu négatif avec aides : 13,5 % ; sans aides : 43,3 % (fait : 42 %)
- Aides sortantes à 100 % : 3 929 M€ par an (cible base + couplées : 4 066 M€)

## B. Budget net annuel (M€, positif = gain), cadre Union (UE + France consolidés)
| Année | bas | central | haut |
|---|---|---|---|
| 1 | 12 | 108 | 214 |
| 2 | 53 | 233 | 430 |
| 3 | 123 | 375 | 647 |
| 4 | 221 | 533 | 867 |
| 5 | 346 | 706 | 1 089 |
| 6 | 497 | 895 | 1 312 |
| 7 | 672 | 1 098 | 1 538 |
| 8 | 871 | 1 315 | 1 765 |
| 9 | 1 089 | 1 547 | 1 995 |
| 10 | 1 327 | 1 790 | 2 226 |
| cumul 10 ans (Md€) | 5,2 | 8,6 | 12,1 |

## C. Budget net annuel (M€), cadre France seule (aucune économie de fonds européens, PSE sur fonds nationaux)
| Année | bas | central | haut |
|---|---|---|---|
| 1 | -381 | -284 | -179 |
| 2 | -733 | -552 | -356 |
| 3 | -1 056 | -804 | -531 |
| 4 | -1 351 | -1 039 | -704 |
| 5 | -1 619 | -1 258 | -876 |
| 6 | -1 860 | -1 463 | -1 045 |
| 7 | -2 078 | -1 652 | -1 212 |
| 8 | -2 272 | -1 828 | -1 378 |
| 9 | -2 446 | -1 989 | -1 541 |
| 10 | -2 602 | -2 139 | -1 703 |
| cumul 10 ans (Md€) | -16,4 | -13,0 | -9,5 |

## D. Décomposition de l'année 10 (M€, cadre Union, scénario central)
- sortie_meur : 3 929
- pse_meur : 1 964
- admin_meur : 196
- fonds_meur : 415
- taxes_meur : 873
- restitution_meur : 437
- net_meur : 1 790

## E. Exploitations touchées par filière, année 10

### Scénario bas
| Filière | Exploitations | Variation moyenne du revenu (k€) | Sous le plancher sans fonds | Perte > 25 % du revenu moyen | Revenu < 0 avant | Revenu < 0 sans fonds | Revenu < 0 avec fonds |
|---|---|---|---|---|---|---|---|
| grandes_cultures | 62 080 | -16,5 | 19 866 | 62 080 | 14 % | 22 % | 14 % |
| bovins_lait | 28 218 | -5,9 | 11 287 | 0 | 14 % | 18 % | 14 % |
| bovins_viande | 36 684 | -8,2 | 22 744 | 36 684 | 14 % | 26 % | 14 % |
| ovins_caprins | 16 931 | -5,6 | 10 497 | 16 931 | 14 % | 22 % | 14 % |
| polyculture_elevage | 28 218 | -10,8 | 10 723 | 28 218 | 14 % | 22 % | 14 % |
| viticulture | 39 505 | -0,8 | 9 481 | 0 | 14 % | 14 % | 14 % |
| maraichage_horticulture | 14 109 | -1,4 | 3 951 | 0 | 14 % | 14 % | 14 % |
| hors_sol | 14 109 | -0,2 | 3 386 | 0 | 14 % | 14 % | 14 % |
| fruits_autres | 42 327 | -1,0 | 12 698 | 0 | 14 % | 14 % | 14 % |
| **Total** | 282 182 | | 104 633 | 143 913 | 14,0 % | 19,0 % | 14,0 % |

### Scénario central
| Filière | Exploitations | Variation moyenne du revenu (k€) | Sous le plancher sans fonds | Perte > 25 % du revenu moyen | Revenu < 0 avant | Revenu < 0 sans fonds | Revenu < 0 avec fonds |
|---|---|---|---|---|---|---|---|
| grandes_cultures | 62 080 | -10,6 | 17 382 | 0 | 14 % | 18 % | 14 % |
| bovins_lait | 28 218 | -3,0 | 10 159 | 0 | 14 % | 16 % | 14 % |
| bovins_viande | 36 684 | -3,8 | 19 076 | 0 | 14 % | 18 % | 14 % |
| ovins_caprins | 16 931 | -2,4 | 9 143 | 0 | 14 % | 16 % | 14 % |
| polyculture_elevage | 28 218 | -6,0 | 9 594 | 0 | 14 % | 18 % | 14 % |
| viticulture | 39 505 | -0,3 | 9 481 | 0 | 14 % | 14 % | 14 % |
| maraichage_horticulture | 14 109 | -0,6 | 3 668 | 0 | 14 % | 14 % | 14 % |
| hors_sol | 14 109 | 0,1 | 0 | 0 | 14 % | 14 % | 14 % |
| fruits_autres | 42 327 | -0,2 | 11 852 | 0 | 14 % | 14 % | 14 % |
| **Total** | 282 182 | | 90 355 | 0 | 14,0 % | 16,1 % | 14,0 % |

### Scénario haut
| Filière | Exploitations | Variation moyenne du revenu (k€) | Sous le plancher sans fonds | Perte > 25 % du revenu moyen | Revenu < 0 avant | Revenu < 0 sans fonds | Revenu < 0 avec fonds |
|---|---|---|---|---|---|---|---|
| grandes_cultures | 62 080 | -2,7 | 14 899 | 0 | 14 % | 14 % | 14 % |
| bovins_lait | 28 218 | 6,1 | 0 | 0 | 14 % | 10 % | 10 % |
| bovins_viande | 36 684 | 1,0 | 0 | 0 | 14 % | 12 % | 12 % |
| ovins_caprins | 16 931 | 1,1 | 0 | 0 | 14 % | 12 % | 12 % |
| polyculture_elevage | 28 218 | -0,2 | 7 901 | 0 | 14 % | 14 % | 14 % |
| viticulture | 39 505 | 0,5 | 0 | 0 | 14 % | 14 % | 14 % |
| maraichage_horticulture | 14 109 | 1,0 | 0 | 0 | 14 % | 12 % | 12 % |
| hors_sol | 14 109 | 0,6 | 0 | 0 | 14 % | 12 % | 12 % |
| fruits_autres | 42 327 | 0,9 | 0 | 0 | 14 % | 12 % | 12 % |
| **Total** | 282 182 | | 22 800 | 0 | 14,0 % | 12,7 % | 12,7 % |

## F. Trajectoire de la part d'exploitations à revenu négatif (%), sans fonds / avec fonds
| Année | bas sans | bas avec | central sans | central avec | haut sans | haut avec |
|---|---|---|---|---|---|---|
| 1 | 14,0 | 14,0 | 14,0 | 14,0 | 14,0 | 14,0 |
| 3 | 15,0 | 14,0 | 14,0 | 14,0 | 13,4 | 13,4 |
| 5 | 16,2 | 14,0 | 14,9 | 14,0 | 13,1 | 13,1 |
| 7 | 17,1 | 14,0 | 15,2 | 14,0 | 12,8 | 12,8 |
| 10 | 19,0 | 14,0 | 16,1 | 14,0 | 12,7 | 12,7 |

## G. Fonds de transition (M€ par an)
| Année | bas | central | haut |
|---|---|---|---|
| 1 | 201 | 114 | 18 |
| 3 | 516 | 291 | 45 |
| 5 | 718 | 402 | 61 |
| 7 | 816 | 450 | 65 |
| 10 | 796 | 415 | 53 |

## H. Pollueur-payeur, année 10
| Scénario | Pesticides : baisse des ventes | Pesticides : recette additionnelle (M€) | Azote : baisse | Azote : recette (M€) | Azote : CO2e évité (Mt) |
|---|---|---|---|---|---|
| bas | 1,7 % | 366 | 2,8 % | 539 | 0,23 |
| central | 4,7 % | 349 | 5,6 % | 524 | 0,44 |
| haut | 8,3 % | 329 | 10,9 % | 495 | 0,86 |

## I. Robots : équilibre économique (gain annuel d'un adoptant en €, prix d'équilibre, année d'équilibre)
| Cas | Scénario | Gain année 0 (€) | Gain année 10 (€) | Prix d'équilibre (€) | Prix actuel retenu (€) | Année d'équilibre | Année avec taxe pesticides ×3 |
|---|---|---|---|---|---|---|---|
| grandes_cultures | bas | -12 008 | -7 570 | 18 105 | 85 000 | 50,8 ans | 46,7 ans |
| grandes_cultures | central | -12 008 | -4 536 | 18 105 | 85 000 | 25,0 ans | 23,0 ans |
| grandes_cultures | haut | -12 008 | -1 638 | 18 105 | 85 000 | 14,7 ans | 13,5 ans |
| maraichage_horticulture | bas | 671 | 1 755 | 26 740 | 23 000 | déjà rentable | déjà rentable |
| maraichage_horticulture | central | 671 | 2 576 | 26 740 | 23 000 | déjà rentable | déjà rentable |
| maraichage_horticulture | haut | 671 | 3 360 | 26 740 | 23 000 | déjà rentable | déjà rentable |
| bovins_lait | bas | -14 674 | -8 655 | 53 983 | 150 000 | 33,6 ans | 33,6 ans |
| bovins_lait | central | -10 549 | 28 | 80 975 | 150 000 | 10,0 ans | 10,0 ans |
| bovins_lait | haut | -2 299 | 12 632 | 134 958 | 150 000 | 1,0 ans | 1,0 ans |

## J. Pesticides évités : redevance contre robots, année 10
| Scénario | Baisse par la redevance (×3) | Baisse par les robots (borne haute) |
|---|---|---|
| bas | 1,7 % | 0,2 % |
| central | 4,7 % | 0,4 % |
| haut | 8,3 % | 0,6 % |

## K. Sensibilité de la redevance sur les pesticides (scénario central, année 10) : multiple du taux effectif actuel
| Multiple | Taux effectif (€/kg) | Hausse du prix payé | Baisse des ventes | Recette additionnelle (M€) | Surcoût net pour les exploitations (M€) |
|---|---|---|---|---|---|
| ×1 | 2,9 | 0 % | 0,0 % | 0 | 0 |
| ×2 | 5,8 | 9 % | 2,5 % | 179 | 134 |
| ×3 | 8,6 | 19 % | 4,7 % | 349 | 264 |
| ×5 | 14,4 | 38 % | 8,5 % | 672 | 517 |
| ×10 | 28,8 | 85 % | 15,8 % | 1 395 | 1 110 |
| ×20 | 57,6 | 179 % | 24,9 % | 2 634 | 2 182 |

## L. Sensibilité de la politique (scénario central, année 10, cadre Union) : part des aides sortantes recyclée en paiements pour services environnementaux
| Part PSE | PSE (M€) | Fonds (M€) | Budget net (M€) | Exploitations sous le plancher sans fonds |
|---|---|---|---|---|
| 0 % | 0 | 1 358 | 3 008 | 120 322 |
| 25 % | 982 | 860 | 2 425 | 106 552 |
| 50 % | 1 964 | 415 | 1 790 | 90 355 |
| 75 % | 2 947 | 95 | 1 030 | 35 160 |
| 100 % | 3 929 | 1 | 43 | 3 668 |

## Lectures et limites

**Qui perd quoi (central, année 10, avant fonds).** Les grandes cultures perdent le plus (−10,6 k€ par exploitation) : −4,3 k€ viennent de la sortie des aides (nette de capitalisation, d'adaptation et de PSE) et −6,3 k€ de la hausse des taxes (le modèle leur attribue 55 % de la dépense en pesticides et 62 % de l'azote, hypothèses H12 et `filieres.csv` ⚠️ V6100). L'élevage allaitant perd −3,8 k€, mais part de plus bas (20,2 k€ de revenu, 197 % de dépendance) : c'est lui qui bascule sous le plancher (19 000 exploitations). Ce résultat est dû aux hypothèses d'intensité ; il dit qu'**un pollueur-payeur appliqué au vrai pollueur frappe les céréaliers, qui sont aussi les plus riches** (56,3 k€), pas les éleveurs. C'est cohérent avec la logique de l'auteur, et c'est à vérifier avec les microdonnées.

**Ce que le fonds ne couvre pas.** Il relève chaque exploitation type au plancher ; il ne couvre pas la perte de revenu au-dessus du plancher à long terme (H22). Une exploitation qui gagnait 56 k€ et en gagne 46 après 10 ans « n'a perdu personne » au sens du modèle, mais a perdu 18 % de son revenu : à nommer dans le texte.

**Ce que la distribution cache.** L'effet est uniforme dans la filière (H24) : l'indicateur « perte > 25 % du revenu moyen » vaut donc 0 ou 100 % d'une filière. Seul le scénario bas (grandes cultures, bovins viande, ovins-caprins, polyculture-élevage : 144 000 exploitations) dépasse ce seuil.

**Robots : le seul cas rentable est le moins massif.** Le maraîchage et l'horticulture représentent 5 % des exploitations (H2). La traite robotisée progresse sans être rentable en revenu (8 % des élevages laitiers en 2018 ⚠️ V6097) : l'adoption se fait pour le temps et le confort, ce que ce modèle ne représente pas.

## Reproduire

```
cd modeles/agriculture
python3 -m unittest test_modele -v
python3 -m unittest test_heures -v
python3 rapport.py
python3 rapport_heures.py
```

## Sources mobilisées (synthèse)

| Source | D'où | Ce qu'elle établit |
|---|---|---|
| Chatellier (INRAE), présentation du 27/05/2026 et note n° 72 (2025) | [PDF](https://www.academie-agriculture.fr/system/files_force/seances-colloques/20260527presentation3.pdf?download=1) | Aides 2024 par type, dépendance, 42 % de revenus négatifs sans aides |
| Agreste, RICA 2024 | [flyer](https://draaf.occitanie.agriculture.gouv.fr/IMG/pdf/flyer_rica_vd.pdf) | 282 182 exploitations représentées, subventions et RCAI 2024 |
| SDES, ventes de produits phytosanitaires 2023 | [page](https://www.statistiques.developpement-durable.gouv.fr/etat-des-lieux-des-ventes-et-des-achats-de-produits-phytosanitaires-en-france-en-2023) | ≈ 65 300 à 65 600 t de substances actives |
| Reporterre (cite le PLF 2024) | [article](https://reporterre.net/Pas-de-hausse-des-taxes-pour-les-agriculteurs-utilisant-des-pesticides) | RPD ≈ 188 M€ en 2023 ; hausse de 37 M€ abandonnée (secondaire) |
| Sénat, amendement I-678 au PLF 2026 | [page](https://www.senat.fr/enseance/2025-2026/138/Amdt_I-678.html) | Taux actuels de la RPD, de 0,9 à 9,0 €/kg (secondaire, amendement rejeté) |
| Böcker et Finger, *Journal of Agricultural Economics* (2017) ; *Sustainability* 8(4) (2016) | [2017](https://zendy.io/title/10.1111/1477-9552.12198) | Élasticité médiane −0,28 ; taxes basses peu efficaces |
| Nielsen et al., *Environmental Impact Assessment Review* (2023) | [PDF](https://pure.au.dk/ws/files/338611847/1-s2.0-S0264837723000157-main.pdf) | Danemark 2013 : taux au moins doublés ; résultat chiffré non lu |
| Rougoor et al. (2001) ; Bel et al. (2004) | [Rougoor](https://econpapers.repec.org/RePEc:taf:jenpmg:v:44:y:2001:i:6:p:877-887) | Élasticités de l'azote −0,1 à −0,5 ; effet des prix faible |
| UNIFA via Pleinchamp (31/10/2025) | [article](https://www.pleinchamp.com/actualite/stabilite-du-marche-des-engrais-azotes-et-reprise-pour-le-phosphate-et-la-potasse-en-2024-2025) | 1,85 Mt d'azote livrées en 2024-2025 |
| Réussir ; Techniques de l'ingénieur | [Naïo en redressement](https://www.reussir.fr/machinisme/naio-technologies-place-en-redressement-judiciaire) | Redressement de Naïo (06/2025) ; prix d'Oz et Dino (2017-2019) |
| Lowenberg-DeBoer et al. (2020, 2021, 2023), Harper Adams | [2023](https://hau.repository.guildhe.ac.uk/id/eprint/17937/) | Robots rentables sur petites parcelles (modèle, un projet) ; revue de 18 études |
| Idele, Sorel (2019) | [HAL](https://hal.inrae.fr/hal-04123285v1/document) | Plus de 8 % des élevages laitiers équipés d'un robot de traite en 2018 |
| `sources/pac-france-europe.md` | local | Aides, concentration, dépendance, steelman des agriculteurs |
| Léger et Guégan, INRA-AgroParisTech-Sylva-Ferme du Bec-Hellouin, rapport final (30/11/2015) | [PDF](https://www.inrae.fr/sites/default/files/pdf/Rapport%20final_etude_2011-2015_Bec_Hellouin_30112015_0.pdf) | 1 000 m², CA 32 788 € (2013) et 57 284 € (2014) TTC, 2 006 et 3 026 h, rémunération nette du travail 5,4 à 9,5 €/h |
| Terre-net (04/02/2025), essai Arvalis du robot Orio | [article](https://www.terre-net.fr/robots/article/878139/la-robotisation-en-grandes-cultures-demeure-au-stade-de-prototype) | 3,7 h/ha (robot) contre 3,5 (tracteur) ; marge 34 contre 167 €/ha |
| FAO Agritech Observatory, FarmDroid FD20 (constructeur) | [page](https://agritechobservatory.review.fao.org/en/farmdroid-fd20) | 75 000-97 000 € ; 6,5 ha/jour ; plus de 500 robots (09/2025) |
| INSEE, Main-d'œuvre agricole (recensement 2020) | [page](https://www.insee.fr/fr/statistiques/7728865) | ETP par exploitation par orientation ; 1 ETP = 1 607 h |
| Pleinchamp (18/10/2018) d'après Berry, Chambre d'agriculture du Rhône | [article](https://www.pleinchamp.com/actualite/fruits-legumes~med-agri-l-heure-et-les-horaires-de-verite-pour-le-maraichage-sur-1-ha) | 2 376 h par exploitant, EBE 15 637 € (secondaire) |
| Réussir (20/03/2020), INRAE | [article](https://www.reussir.fr/fruits-legumes/353-euha) | +353 €/ha pour le désherbage mécanique en arboriculture |
| AFAF, Agroforesterie en 10 questions | [PDF](https://www.agroforesterie.fr/wp-content/uploads/2022/07/afaf-agroforesterie-en-10-questions.pdf) | Travail de taille, rendement quasi inchangé jusqu'à 50 arbres/ha (résumé) |
| FranceAgriMer, fiche filière légumes 2026 et 2023 | [2026](https://www.franceagrimer.fr/sites/default/files/2026-02/04_FICHE_FILIERE_LEGUMES_2026.pdf) | 256 000 ha de légumes (2024) ; 6,8 Md€ de fruits et légumes (2021) (résumés) |
| info.gouv.fr, Smic au 01/01/2026 | [page](https://www.info.gouv.fr/actualite/le-smic-revalorise-au-1er-janvier-2026) | 12,02 € brut par heure (résumé) |
