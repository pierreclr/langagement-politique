# Agriculture : sortie des aides PAC, robotique, pollueur-payeur, revenu agricole : méthode

Chapitre 16 du plan (« Agriculture : les robots contre la monoculture ») · tâche : modèle « Agriculture » · consultation des sources : 2026-11-03 · code : [`modele.py`](modele.py) · tests : [`test_modele.py`](test_modele.py) (`python3 -m unittest test_modele -v`) · tables : [`rapport.py`](rapport.py) · résultats : [`resultats.md`](resultats.md) · données : [`donnees/`](donnees/) (copie dans `$DONNEES/sources/agriculture/`).

Légende : **fait sourcé** · **estimation** (calcul explicité) · **hypothèse** (de Claude ou de l'auteur, numérotée H1 à H24) · ⚠️ non confirmé (registre V6090-V6111 dans `verifications.md`). Des ordres de grandeur, jamais des prédictions.

## 1. Questions posées

1. **Sortie progressive des aides PAC** couplées et à l'hectare, remplacées par des paiements pour services environnementaux (PSE) et un fonds de transition « ne perdre personne » : coût net, exploitations touchées par filière, trajectoire sur 10 ans.
2. **Robotique agricole** : coût et tendance, gain de main-d'œuvre, effet sur les petites parcelles et la diversification. La thèse de l'auteur (« les robots contre la monoculture ») est **testée, pas adoptée**.
3. **Pollueur-payeur** (position de l'auteur : calibrer la fiscalité plutôt qu'interdire) : redevance sur les pesticides et sur l'azote.
4. **Revenu agricole** dans chaque scénario et part des exploitations sous le seuil de revenu positif.

Question liée : Q7 (agriculteurs salariés) n'est **pas modélisée**. Le plancher de revenu du fonds (H8, H22) est ce qui s'en rapproche le plus : un revenu minimum pour les exploitants en activité, sans propriété collective des fermes.

## 2. Périmètre

- **Inclus** : la sortie de l'aide de base (3 083 M€ en 2024) et des aides couplées (983 M€), soit 4 066 M€ (H1) ; les PSE ; le fonds de transition ; une hausse de la redevance pour pollutions diffuses (RPD) sur les pesticides ; une taxe sur l'azote minéral ; les robots de désherbage (grandes cultures, maraîchage) et de traite ; le revenu courant avant impôt (RCAI) de neuf filières.
- **Maintenus** : écorégime (1 744 M€), paiement redistributif (657), jeunes agriculteurs (133), ICHN (1 043), MAEC (269), bio (201), assurance récolte (366). Un modèle plus ambitieux sortirait aussi l'écorégime ; ce choix est celui de la question posée (couplées et à l'hectare).
- **Exclus** : prix de marché et effets sur la production et la balance commerciale ; sorties d'exploitations et concentration foncière (le modèle ne fait pas disparaître d'exploitations, il compte celles qui seraient en danger) ; Corse et DROM ; pêche ; effets sur l'aval ; salarisation des agriculteurs (Q7) ; clauses miroirs et mécanisme d'ajustement aux frontières (nommés, pas chiffrés).
- **Unités** : M€ courants par an, k€ de RCAI par exploitation, années 1 à 10 de la réforme (2027-2036 si la décision est prise en 2026).

## 3. Données (voir `donnees/`)

| Fichier | Contenu | Statut |
|---|---|---|
| `pac_aides_2024.csv` | 11 postes d'aides 2024 (MASA/ASP via Chatellier, INRAE, 27/05/2026) | fait sourcé |
| `filieres.csv` | 9 filières : part des exploitations, RCAI moyen, dépendance aux subventions, part de SAU louée, intensité en pesticides et en azote, part des aides qui sortent | **mélange** : RCAI de 4 filières et dépendance de 4 filières sourcés (Chatellier 2025) ; le reste est une hypothèse marquée dans les colonnes `statut_*` |
| `robots.csv` | prix de robots, parc, redressement de Naïo, parts de traite robotisée, résultats de Harper Adams | sourcé mais ancien ou secondaire ⚠️ |
| `pesticides_engrais.csv` | ventes de pesticides, produit de la RPD, taux, élasticités, Danemark, livraisons d'azote | partiellement sourcé ⚠️ |

La matière PAC (montants, concentration, dépendance, steelman des agriculteurs) vient de `sources/pac-france-europe.md`, qui n'est pas répétée ici.

## 4. Hypothèses numérotées

| # | Hypothèse | Valeur | Statut |
|---|---|---|---|
| H1 | Aides qui sortent : base + couplées, en 10 ans, linéairement (H9) | 4 066 M€ ; le modèle en retrouve 3 929 | fait (montants) + hypothèse (périmètre) |
| H2 | 9 filières ; part des 282 182 exploitations (RICA 2024) | grandes cultures 22 %, bovins lait 10 %, bovins viande 13 %, ovins-caprins 6 %, polyculture-élevage 10 %, viticulture 14 %, maraîchage-horticulture 5 %, hors-sol 5 %, fruits et autres 15 % | hypothèse ⚠️ V6090 (recensement 2020 par orientation non obtenu) |
| H3 | Chiffre d'affaires moyen par exploitation | 210 k€ (33,7 k€ de subventions = 16 % du CA) | estimation (Chatellier 2025) |
| H4 | RCAI moyen et dépendance par filière | voir `filieres.csv` | sourcé pour bovins viande (197 %, 20,2 k€), ovins-caprins (160 %), viticulture (16 %, 52,0 k€), maraîchage (≈ 15-21 %), grandes cultures (56,3 k€), bovins lait (29,5 k€) ; **hypothèse** pour le reste ⚠️ V6094 |
| H5 | Dispersion du revenu dans une filière : loi normale, écart type = 0,9 × moyenne | CV 0,90 | estimation sur les déciles RICA (D1 −4,6 k€, D9 80,3 k€, moyenne 34,1 k€, Chatellier 2025) ; une loi normale est un choix ⚠️ V6093 |
| H6 | Calibrage : 42 % des exploitations à revenu négatif sans aides | le modèle donne 43,3 % ; 13,5 % avec aides | fait (42 %) + test |
| H7 | Part des aides de chaque filière qui sort | 60 % bovins viande et ovins-caprins, 55 % polyculture-élevage, 50 % grandes cultures et bovins lait, 30 % fruits, 15 % le reste (viticulture et maraîchage touchent peu d'aides à l'hectare) | hypothèse ⚠️ V6091 ; calée pour retrouver 4 066 M€ à 15 % près (test) |
| H8 | Plancher de revenu du fonds | 17,1 k€ par exploitation (ordre de grandeur d'un SMIC net annuel) | hypothèse ⚠️ V6105 |
| H9 | Calendrier | sortie linéaire en 10 ans ; année 10 = régime de croisière | choix |
| H10 | PSE : part des aides perdues recyclée, répartie comme les pertes (neutralité) ; frais de mesure et de contrôle en % du PSE | 50 % ; frais 15 / 10 / 5 % (bas / central / haut) | choix de politique (même partout) ; frais ⚠️ (la Cour des comptes européenne juge le suivi actuel peu fiable) |
| H11 | Capitalisation foncière : part de l'aide incluse dans les loyers, rendue aux fermiers quand l'aide disparaît (× part de SAU louée) ; adaptation (baisse des coûts, hausse des prix) | capitalisation 10 / 25 / 40 % ; adaptation 5 / 15 / 30 % | hypothèse ⚠️ V6093 ; littérature citée de mémoire, non lue (`sources/pac-france-europe.md`, V5792, V5794) |
| H12 | Dépense nationale en pesticides, répartition par filière | 2 000 M€ ; répartition dans `filieres.csv` | hypothèse ⚠️ V6100 |
| H13 | Robots : prix, surface couverte, coût évité, durée | désherbage grandes cultures 85 000 € pour 50 ha (Dino : 75-100 k€) contre 65 €/ha d'herbicide ; maraîchage 23 000 € (Oz : 21-25 k€) pour 8 ha contre 600 €/ha de main-d'œuvre évitée ; traite 150 000 € contre 550 h par an à 15 €/h | prix de Naïo sourcés mais datés de 2017-2019 ⚠️ V6095 ; le reste est une hypothèse ⚠️ V6109 |
| H14 | Plafond d'adoption à 10 ans (part des exploitations de la filière) × coefficient de scénario (0,5 / 1,0 / 1,5) | grandes cultures 10 %, maraîchage 20 %, lait 30 % | hypothèse ; calcul d'adoption logistique |
| H15 | Surcoût de l'herbicide pour l'adoptant : taxe additionnelle par kg × 1,5 kg d'herbicide par hectare | | hypothèse ⚠️ V6108 |
| H16 | Part des herbicides dans la dépense en pesticides | 35 % | hypothèse ⚠️ V6108 |
| H17 | Prix de l'azote | 0,9 €/kg d'azote | hypothèse ⚠️ V6102 |
| H18 | Taxe azote 0,30 €/kg en 10 ans (+33 % du prix) ; élasticité −0,10 / −0,20 / −0,40 | plage de la littérature : −0,1 à −0,5 (Rougoor et al. 2001) ; Bel et al. : effet très faible sur 16 pays | élasticités ⚠️ V6106 |
| H19 | N2O direct : 1 % de l'azote appliqué, PRG 273 | 4,29 kg CO2e par kg d'azote ; production des engrais et N2O indirect non comptés | hypothèse (facteurs GIEC de mémoire) ⚠️ V6107 |
| H20 | Pertes de rendement dues à la baisse des intrants : coefficient × baisse relative × CA moyen × exposition de la filière | 5 / 2 / 0 % du CA par unité de baisse relative | hypothèse ⚠️ V6104 |
| H21 | Part des recettes des taxes restituée aux exploitations, forfaitairement par exploitation | 50 % (le Danemark a restitué les recettes au secteur) | choix de politique ⚠️ V6101 |
| H22 | Règle du fonds | compensation dégressive des pertes (100 % l'année 1, 10 % l'année 10) ET plancher permanent : nul ne finit sous min(revenu avant, 17,1 k€) | choix de politique |
| H23 | Deux cadres budgétaires : **Union** (UE + France consolidés : les aides sortantes sont économisées) et **France seule** (aucune économie, PSE et fonds sur crédits nationaux) | | choix ; le vrai résultat est entre les deux et dépend de la négociation |
| H24 | Effet uniforme dans la filière : tous les agriculteurs d'une filière subissent la même variation moyenne ; la dispersion vient de la loi de H5 | | simplification (elle sous-estime les perdants extrêmes et surestime l'efficacité du fonds) |

## 5. Scénarios

**bas / central / haut désignent la capacité d'adaptation, pas le coût** : bas = adaptation faible (peu d'élasticité, peu de capitalisation foncière, robots lents à baisser), haut = forte adaptation. La **politique est identique** dans les trois (50 % de PSE, plancher, calendrier) : on isole l'incertitude de comportement. La sensibilité à la politique est donnée à part (résultats, tableau L).

| Paramètre | bas | central | haut |
|---|---|---|---|
| Capitalisation foncière | 10 % | 25 % | 40 % |
| Adaptation des exploitations | 5 % | 15 % | 30 % |
| Élasticité-prix des pesticides | −0,10 | −0,28 | −0,50 |
| Élasticité-prix de l'azote | −0,10 | −0,20 | −0,40 |
| Perte de rendement par unité de baisse des intrants | 5 % du CA | 2 % | 0 |
| Baisse annuelle du prix des robots | 3 % | 6 % | 10 % |
| Valeur du temps de travail libéré (× salaire) | 1,0 | 1,5 | 2,5 |
| Frais de mesure des PSE | 15 % | 10 % | 5 % |

Élasticité centrale des pesticides : **−0,28**, médiane de la méta-analyse de Böcker et Finger (2017) ; les études de court terme sont moins élastiques et celles revues par les pairs aussi. Les bornes −0,10 et −0,50 sont des hypothèses.

## 6. Formules

- **Sortie** : aides perdues par exploitation à l'année t = RCAI × dépendance × part sortante × t/10.
- **Perte nette** = perte × (1 − capitalisation × part de SAU louée) × (1 − adaptation). **PSE reçus** = 50 % × perte brute.
- **Pesticides** : multiple m de la RPD (de ×1 à ×3 en 10 ans). Taux effectif actuel = 188 M€ ÷ 65 300 t = 2,88 €/kg ; prix payé = 2 000 M€ ÷ 65 300 t = 30,6 €/kg. Nouveau prix p1 = p0 + (m − 1) × 2,88 ; ventes Q1 = Q0 × (p1/p0)^ε ; recette = m × 2,88 × Q1 ; surcoût pour les exploitations = Q1 × p1 − dépense actuelle, réparti selon l'intensité de la filière.
- **Azote** : taxe τ × phase(t) ; Q1 = Q0 × ((p+τ)/p)^ε ; recette = τ × Q1 ; CO2e évité = (Q0 − Q1) × 4,29 kg/kg.
- **Robot** : coût annuel = prix × annuité(5 %, durée) + entretien (5 % ou 4 % du prix) ; gain = coût évité − coût annuel ; **prix d'équilibre** = coût évité ÷ (annuité + entretien) ; année d'équilibre = ln(prix d'équilibre ÷ prix actuel) ÷ ln(1 − baisse annuelle). Un adoptant rationnel n'achète que si le gain est positif.
- **Revenu** par exploitation type (50 par filière) = RCAI × (1 + 0,9 z) + variation moyenne ; **fonds** = max(compensation dégressive, remontée au plancher), compté pour chaque exploitation type.
- **Budget** (Union) = aides sortantes économisées + taxes additionnelles − restitution − PSE − frais − fonds.

## 7. Effets de comportement pris en compte (et sourcés)

| Effet | Traitement | Source |
|---|---|---|
| Les pesticides se substituent peu : demande inélastique | élasticité −0,28 (médiane) | Böcker et Finger 2017 |
| Une taxe basse n'a presque pas d'effet ; une taxe élevée sur un produit précis, oui ; stockage avant l'introduction | table de sensibilité ×1 à ×20 ; stockage non modélisé | Böcker et Finger 2016 (Sustainability 8(4)) |
| Danemark 2013 : taux au moins doublés, objectif −40 % de la charge, recettes restituées | repère pour le multiple et la restitution ; résultat chiffré **non lu** ⚠️ V6101 | Nielsen et al. 2023, Agence danoise de l'environnement 2018 |
| Azote : effet-prix faible, −0,1 à −0,5 | élasticités H18 | Rougoor et al. 2001, Bel et al. 2004 |
| Capitalisation des aides dans les loyers | H11, loyers qui baissent pour la part de SAU louée | littérature non lue ⚠️ V6093 |
| **Rebond de la robotique : le temps libéré peut servir à agrandir** (concentration), pas à diversifier | **non modélisé**, nommé dans l'état de la recherche | raisonnement de Claude ⚠️ V6110 |
| Effet-prix de marché de la sortie (offre qui baisse, prix qui monte) | **non modélisé** : sous-estime l'adaptation si la sortie est européenne, surestime les pertes | |

## 8. Contraintes juridiques (règle 5)

- **PAC** : règlement (UE) 2021/2115 (plans stratégiques) ; la France ne peut pas sortir seule d'une aide européenne (cadre « France seule » du modèle). Proposition de la Commission du 16/07/2025 : fonds unique, plans de partenariat nationaux et régionaux (`sources/pac-france-europe.md` § 4).
- **OMC** : les aides découplées relèvent de la « boîte verte » ; les couplées, d'une catégorie plus contrainte ⚠️ V6112 (de mémoire).
- **Aides d'État** : les PSE nationaux et le fonds doivent être notifiés ou entrer dans un règlement d'exemption ⚠️ V6112.
- **Taxes** : la RPD existe (L. 213-10-8 du code de l'environnement) ; des taxes sur les pesticides existent au Danemark, en Suède, en Norvège et en France, et sur l'azote ont existé en Autriche, en Finlande et en Suède : pas d'obstacle de principe en droit de l'Union.
- **Concurrence** : une taxe nationale seule déplace la production et les importations (« fuite ») ; d'où l'argument de réciprocité des normes, qui n'est pas chiffré.

## 9. Biais pro-technologie : ce que fait le modèle

Le risque est un biais pro-technologie. La thèse « les robots remplacent la monoculture » contient **trois maillons** que le modèle sépare :

1. *Le robot est économiquement meilleur que la chimie ou le travail* : **testé** (tableau I de resultats.md). Sur les grandes cultures, le robot de désherbage coûte 12 000 € par an de plus qu'il ne fait économiser, et la rentabilité n'arrive qu'après 15 à 51 ans de baisse des prix.
2. *Le robot réduit la taille minimale rentable d'une parcelle* : appuyé par une modélisation sur un seul projet britannique (Harper Adams : −15 à −29 € par tonne de blé sur petites parcelles rectangulaires, −24 à −46 € sur parcelles irrégulières) ; **non transposé à la France, non testé sur ferme réelle**.
3. *Un moindre coût des petites parcelles produit de la diversité, pas de l'agrandissement* : **aucune preuve lue**, et un argument contraire (rebond d'agrandissement, verrouillage par l'investissement, dépendance à un fournisseur).

Preuves contraires lues : redressement judiciaire de Naïo Technologies (06/06/2025, pionnier français, 20 salariés sur 49 repris) ; revue de Lowenberg-DeBoer et al. (2020) : 18 études, beaucoup en budget partiel sur des prototypes, appel à des données de fermes réelles. Ce que le modèle ne sait pas : le marché mondial (IFR, Robagri), les travaux de l'INRAE et de la FAO sur l'adoption n'ont **pas été lus** ⚠️ V6092.

## 10. Limites

1. Les parts de filières, la dépendance de six filières et les parts sortantes sont des hypothèses : le résultat par filière est un ordre de grandeur, pas une mesure. Les microdonnées du RICA permettraient de remplacer H2, H4 et H7 (accès à demander).
2. La loi normale de H5 et l'effet uniforme de H24 simplifient la dispersion ; le fonds compense au plus juste par exploitation type, ce qui sous-estime son coût réel (contrôle, effets d'aubaine, fraude).
3. Le modèle ne dit rien de la production, des prix et de la balance commerciale, ni de la survie des exploitations après dix ans.
4. Les chiffres de robotique datent de 2017-2019 pour les prix de Naïo ; le prix du FarmDroid, celui d'un robot de traite et leur parc actuel n'ont pas été trouvés.
5. Le calibrage retrouve 28,4 k€ de subventions par exploitation, contre 33,7 k€ (2020-2022) et 34,9 k€ (2024) dans le RICA : −16 % ⚠️ V6111. Les aides sont donc légèrement sous-estimées, sans que cela change l'ordre de grandeur.

## 11. Heures par hectare et robots (ajout du 03/11/2026)

Question de l'auteur : la monoculture existe parce que l'heure de travail humain coûte trop cher ; si la robotique neutralise ce coût, les systèmes complexes (maraîchage permacole bio-intensif, agroforesterie, polyculture-élevage, forêt jardinée) deviennent rentables. Code : [`heures.py`](heures.py) ; résultats : section « Heures par hectare et robots » de [`resultats.md`](resultats.md) ; données : `donnees/heures_par_hectare.csv`, `donnees/robots_cout_horaire.csv` ; ⚠️ V10600-V10613.

**Notation** : M = marge par hectare avant rémunération du travail ; h = heures par hectare et par an ; w = coût horaire humain ; c = coût horaire du travail robotisé (€ par heure équivalente humaine) ; r = part des heures que le robot sait faire ; H = 1 607 h (un ETP, INSEE).

**Formules** : profit par hectare = M − h × [(1 − r) w + r c] ; seuil par hectare : c* = [(M_c − profit_mono) / h_c − (1 − r) w] / r ; surface par actif = H / [(1 − r) h] ; revenu par actif = surface × (M − h r c) (l'exploitant fournit les heures humaines) ; seuil par actif : c* = [M − revenu_mono (1 − r) h / H] / (h r) ; coût du robot = (annuité 5 % sur 8 ans + 5 % d'entretien) × prix / (heures d'usage × heures humaines remplacées par heure de robot × disponibilité) ; année du seuil = ln(c*/c0) / ln(1 − baisse annuelle), horizon 60 ans.

| # | Hypothèse | Valeur (bas / central / haut = défavorable / médian / favorable à la thèse) | Statut |
|---|---|---|---|
| H25 | Monoculture céréalière : marge avant travail ; heures | 167 / 300 / 560 €/ha ; 3,5 / 6 / 17,7 h/ha | 167 = marge nette avec aides, Arvalis blé 2023-2024 ; 560 = RCAI 56,3 k€ sur 100 ha supposés ; 300 et 6 choisis ; 17,7 = 1,10 ETP × 1 607 h / 100 ha supposés ⚠️ V10601, V10602 |
| H26 | Coût horaire chargé d'un salarié agricole | 14 / 16 / 22 € | hypothèse (Smic 12,02 € brut au 01/01/2026 + charges, congés, temps improductifs) ⚠️ V10605 |
| H27 | Robot de référence : FarmDroid FD20, 86 000 €, 8 ans, entretien 5 % par an, taux 5 % | milieu de 75-97 k€ | constructeur (FAO) ⚠️ V10606 |
| H28 | Heures d'usage par an | 500 / 800 / 1 200 | hypothèse ⚠️ V10606 |
| H29 | Heures humaines remplacées par heure de robot k | 1 | hypothèse ; l'essai Arvalis donne 3,5/3,7 < 1 |
| H30 | Disponibilité en milieu non structuré | 50 / 70 / 90 % | hypothèse, sans mesure hors essais ⚠️ V10606 |
| H31 | Baisse annuelle du coût du robot | 3 / 6 / 10 % | 6 et 10 repris du modèle (H13) ; 3 = prévision Interact Analysis pour les robots industriels ; ARK (50 % par doublement) non retenu ⚠️ V10607 |
| H32 | Part r des heures robotisables à dix ans | 20 / 40 / 70 % ; table de 40 à 99 % | hypothèse ; le résultat est donné pour toute valeur de r |
| H33 | SAU France métropolitaine | 27 Mha | ordre de grandeur non relu ⚠️ V10608 |
| H34 | Élasticité-prix des légumes | −0,58 | de mémoire (Andreyeva, Long et Brownell 2010), non relue ⚠️ V10608 |
| H35 | Bec-Hellouin : cas bas = 2013 amortissements hauts ; central = 2014 H ; haut = 2014 B ; marge = « rémunération totale nette du travail » du rapport (salarié compris) | 10 772 € / 25 881 € / 28 651 € par 1 000 m² ; 2 006 / 3 026 / 3 026 h | sourcé (rapport final) ; chiffre d'affaires TTC ⚠️ V10613 |
| H36 | Extrapolation du Bec-Hellouin à l'hectare : × 10 | | **illustration irréaliste** (le rapport l'exclut) ; sert à comparer les ordres de grandeur d'heures |

**Limites propres au module** : (1) un seul système a des données de marge et d'heures mesurées (le Bec-Hellouin, sur 1 000 m², trois ans, ferme d'expérimentation) ; le maraîchage conventionnel et l'arboriculture n'ont que des ETP par exploitation, sans SAU par orientation (non trouvée) ; l'agroforesterie, l'élevage herbager et la forêt n'ont pas de marge sourcée ; (2) le coût du robot est celui d'un robot de semis et de désherbage, extrapolé à tout le travail manuel ; les robots de récolte n'ont pas de prix publié ; (3) les parts r sont des scénarios, pas des mesures ; (4) la monoculture est supposée sans robot (r = 0) : si elle se robotise aussi, l'écart d'heures reste de trois ordres de grandeur ; (5) les effets de prix sont une seule élasticité de mémoire ; (6) pas de rebond d'agrandissement, pas d'effet des aides PAC sur la marge de la monoculture (167-560 €/ha comprennent des aides).

**Steelman** : la meilleure objection à ma conclusion est que les systèmes complexes n'ont pas besoin d'égaler le Bec-Hellouin : une polyculture-élevage à 100 heures par hectare doit seulement atteindre 1 800 €/ha de marge à 16 €/h, ou 1 000 €/ha à 8 €/h (table 4). Ce sont des ordres de grandeur accessibles pour un vrai système mixte ; le modèle n'a pas de donnée de marge pour le dire.
