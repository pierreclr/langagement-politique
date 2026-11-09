---
titre: Nucléaire ou alternatives : quel chemin de décarbonation de l'électricité, et pour quel poids budgétaire
date: 2026-11-06
statut: brouillon sourcé ; sources primaires lues en local (RTE, Futurs énergétiques 2050, rapport complet ch. 11 et principaux résultats ; RTE, Bilan prévisionnel 2025, résumé exécutif ; RTE, consultation d'avril 2026 ; ADEME, note sur le mix électrique de Transition(s) 2050 ; Eurostat COFOG) ; EPR2, Cour des comptes sur les renouvelables, PPE3 en recherche web et presse (marqué ⚠️) ; négaWatt, Shift Project et AIE non lus à la source ; chiffres dans `sources/nucleaire-ou-alternatives.csv` ; calcul dans `sources/calculs/nucleaire_budget.py` (tests assert) ; vérifications V18000 à V18009
---

# Nucléaire ou alternatives : ce que coûte vraiment chaque chemin

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026. **Conflits d'intérêts de l'auteur de ce dossier (Claude)** : Anthropic vend de l'IA, et l'argument « l'IA consomme de l'électricité » sert mon employeur ; le projet déclare aussi un biais pro-technologie, et le sujet s'y prête. J'ai donc cherché d'abord ce qui contredit la ligne « construire du nucléaire ». Légende : **fait** (lu à la source) · **estimation** (calcul reproductible, hypothèses dites) · **analyse de Claude** (opinion argumentée) · ⚠️ non confirmé (`verifications.md`). Cotes de fiabilité : A à D (règle 11).

**Question posée (06/11)** : le nucléaire est-il un budget important par rapport au reste, et quelles autres options répondent à la décarbonation de façon financièrement soutenable ?

## 0. Synthèse sans détour

1. **Le poids budgétaire est modeste, et pas là où l'on le croit.** Les six EPR2, estimés par EDF à 72,8 Md€ de 2020 hors financement (⚠️ presse, non audité), représentent **≈ 5 Md€ par an** (estimation, lissé sur 16 ans), soit **0,3 % des dépenses publiques** (1 672 Md€, 2024) et **0,18 % du PIB** (2 918 Md€). Avec la remise à niveau du parc existant (≈ 4,6 Md€ par an) et une enveloppe de petits réacteurs (0,35 Md€), l'ensemble tourne autour de **10 Md€ par an, 0,6 % des dépenses publiques, 0,35 % du PIB**. C'est 1,3 % du budget des retraites (392 Md€) ou 9 % de la charge de la dette (58,9 Md€ de transactions de la dette, COFOG 2024). **Mais** presque rien de cela n'est une dépense budgétaire au sens strict : c'est de l'investissement d'EDF, financé par ses fonds propres et par un prêt d'État bonifié. Le vrai risque public est le **passif éventuel** (garantie, prix garanti), pas la ligne du budget.
2. **L'argument décisif n'est pas le budget, c'est la comparaison.** Selon RTE, le coût complet annuel du système électrique en 2060 serait de **59 à 66 Md€** dans les scénarios avec nouveau nucléaire contre **71 Md€ (100 % renouvelable en grands parcs) à 81 Md€** pour les autres scénarios 100 % renouvelables. L'écart de **≈ 10 Md€ par an** (fourchette 0 à 16) est le double de ce que coûte tout le programme EPR2. Donc : **choisir le 100 % renouvelable n'économise pas le budget du nucléaire, ça coûte plus cher**, selon RTE, dans la très grande majorité des variantes.
3. **Mais la préférence pour le nucléaire n'est pas robuste à tout.** Elle disparaît si le nouveau nucléaire se finance 3 points plus cher que les renouvelables (RTE : coût équivalent à M23) et elle fond de 10 à ≈ 4 Md€ par an si les EPR2 coûtent comme Flamanville 3. **Or l'estimation d'EDF (≈ 7 350 €/kW) est plus proche du stress test de RTE (7 900 €/kW) que de son hypothèse centrale (5 400 €/kW).** C'est le point faible principal, et il faut le dire.
4. **Ce qui est le moins cher selon RTE (décembre 2025) n'est pas le nouveau nucléaire** : c'est **la prolongation des réacteurs existants**, l'éolien terrestre et l'éolien en mer posé bien situés, puis le grand solaire au sol ; les petits parcs solaires et l'éolien flottant sont nettement plus chers. Réorienter vers ces filières ferait gagner jusqu'à 3 Md€ par an.
5. **La conclusion de Claude** (§ 6) : un mix, pas un pari unique. Prolonger le parc tant que la sûreté le permet, renouvelables de grande taille, un premier programme EPR2 plafonné et réversible à chaque jalon, flexibilité et réseaux ; les petits réacteurs restent de la recherche plafonnée, pas un pilier.

## 1. Les chemins de décarbonation de l'électricité française

### 1.1 RTE, Futurs énergétiques 2050 (octobre 2021 puis février 2022), cote A

**Source** : RTE, *Futurs énergétiques 2050*, rapport complet, chapitre 11 « Analyse économique », et *Principaux résultats* (octobre 2021). Fichiers lus en local le 06/11/2026 (`$DONNEES/sources/energie/rte-fe2050-chap11-analyse-economique.pdf`, `rte-fe2050-principaux-resultats.pdf`). **Conflit d'intérêts** : RTE est le gestionnaire du réseau de transport (filiale d'EDF à 50,1 %, CDC et CNP pour le reste ; ⚠️ V18005, à rafraîchir), régulé par la CRE, mandaté par l'État ; il gagne à un réseau plus grand, quel que soit le scénario, et dépend de coûts de nucléaire fournis par des audits d'État. Pas un acteur partisan, mais pas indépendant du système qu'il décrit. L'étude a fait l'objet d'une consultation publique de deux ans.

**Périmètre** : coût complet annualisé du système électrique national en 2060, production, flexibilités, réseaux, **hors** coût de l'électrification des usages finals (voitures, pompes à chaleur). Neutralité carbone en 2050 avec la même trajectoire de consommation de référence (≈ 645 TWh en 2050, Md€ de 2021, coût moyen pondéré du capital (CMPC) de 4 % par défaut). Les valeurs ci-dessous sont lues sur les figures 11.37 de RTE (le texte extrait des PDF mélange l'ordre des barres, j'ai recoupé avec les écarts écrits dans le texte : M23 − N2 ≈ 10 Md€) : ⚠️ V18001, lecture visuelle à confirmer dans le fichier Excel de RTE.

| Scénario | Description (RTE) | Coût complet 2060, CMPC 4 % (Md€/an) | à 7 % | à 1 % |
|---|---|---|---|---|
| **M0** | 100 % renouvelable, sortie du nucléaire accélérée en 2050 | ≈ 77 | 96 | 60 |
| **M1** | 100 % renouvelable, production diffuse (petit solaire) | ≈ 81 | 101 | 63 |
| **M23** | 100 % renouvelable, grands parcs, nucléaire existant jusqu'au bout | ≈ 71 | 90 | 55 |
| **N1** | nouveau nucléaire plus limité | ≈ 66 | 86 | 50 |
| **N2** | parc nucléaire proche de 40 GW avec nouveaux EPR | ≈ 61 | 82 | 45 |
| **N03** | le plus nucléaire | ≈ 59 | 81 | 42 |

**Faits clés** (RTE) :
- Les coûts de production **bruts** du nouveau nucléaire sont plus élevés que ceux des grands parcs renouvelables ; mais l'intégration d'un fort volume de renouvelables demande beaucoup de flexibilité (stockage, pilotage de la demande, centrales d'appoint, boucle hydrogène) et de réseau. Une fois ces coûts intégrés, les scénarios avec nouveaux réacteurs sont plus compétitifs.
- M23 est **de 5 à 15 % plus coûteux en 2050** et **de 8 à 20 % en 2060** que les scénarios avec nouveau nucléaire ; M0 et M1 de 20 à 30 % en 2060. Écart M23 − N2 : ≈ 10 Md€ par an, entre 0 et 16 selon les hypothèses.
- **Sensibilité** : +3 points de coût du capital font monter le coût du système de ≈ 20 Md€ par an (+30 %) ; si le nouveau nucléaire seul se finance 3 points plus cher, **N2 coûte autant que M23**. Le stress test « nouveau nucléaire au prix de Flamanville 3 » réduit l'écart de **6 Md€ par an** (il reste ≈ 4 : « nettement réduit, mais toujours existant ») ; l'échec de l'éolien flottant (100 €/MWh) l'élargit de 6.
- Seuil : N2 reste moins cher que M23 tant que le coût complet du nouveau nucléaire reste **sous ≈ 110 €/MWh** (≈ 100 si les renouvelables sont peu chères).
- Investissement : **750 à 1 000 Md€ sur 40 ans** selon le scénario (20 à 25 Md€ par an, le double d'aujourd'hui) ; coût du système en 2060 : 60 à 80 Md€ par an, soit +15 à +40 par rapport à aujourd'hui, à mettre en regard de 30 à 40 Md€ d'importations fossiles évitées.
- **Limites reconnues par RTE** : les coûts à 40 ans sont très incertains ; certains répondants à la consultation contestent que le nucléaire puisse être produit en série comme dans les années 1970-1980 ; RTE note que « la dynamique de baisse du coût du nouveau nucléaire ne peut pas être observée, trop peu de réacteurs étant en construction ».

### 1.2 Mises à jour RTE (2023 à 2026), cote A

- **Bilan prévisionnel 2025-2035** (RTE, 9 décembre 2025, résumé exécutif lu en local) : la consommation d'électricité plafonne (trajectoire « décarbonation lente » : 470 TWh en 2030, 505 TWh en 2035 ; « rapide » : 510 puis 580 TWh) ; l'électricité représente 26 % de l'énergie finale en 2024 et devrait passer à 40-45 % en 2035 dans la stratégie de l'État ; facture énergétique **61 Md€ en 2024** ; la France a **battu en 2024 son record d'exportations nettes (89 TWh)** et connaît une **surcapacité qui durera au moins quelques années**, avec prix bas ou négatifs et modulation du nucléaire. **Pas de pénurie à court terme** : le besoin vient après 2035, ce qui confirme la remarque de l'auteur.
- Même document : développer en priorité les filières les moins chères en coûts système (prolongation des réacteurs, éolien terrestre et en mer posé, grand solaire) réduirait le coût du système **jusqu'à 3 Md€ par an** à objectifs inchangés ; petits parcs solaires et éolien flottant sont nettement plus chers. Le nouveau nucléaire arrive « dès la fin de la décennie 2030 » (trois sites).
- **Actualisation des Futurs énergétiques 2050** : consultation publique ouverte le 03/04/2026 (synthèse et propositions détaillées lues en local) ; **publication prévue fin 2026**, avec un cadre de « mondialisation contrariée » par défaut et la méthode en coûts complets conservée. **Les chiffres actualisés n'existent pas encore** : c'est le rendez-vous qui peut changer cette analyse (déclencheur n° 1, § 6).

### 1.3 Autres analyses

| Source | Ce qu'elle dit | Cote | Conflits d'intérêts connus |
|---|---|---|---|
| **ADEME**, Transition(s) 2050, note « feuilleton mix électrique » (lue en local) | Avec une sobriété très ambitieuse (540 TWh en 2050), **86 % de renouvelables sans nouveaux EPR2** donne le coût du MWh le plus bas de ses scénarios (−12 % par rapport à 2020). Pour 650 TWh, l'éolien en mer posé et flottant (48 GW) ou 3 paires d'EPR2 donnent des coûts complets très proches (≈ 1 300 Md€ actualisés 2020-2060) ; le nucléaire serait moins cher à coût du capital égal. L'ADEME suppose **7,5 % pour le nucléaire et 5,25 % pour les renouvelables** même si l'État porte l'investissement. Elle estime la prolongation du parc existant à **42 €/MWh**. | B | Agence publique sous tutelle de l'État ; mission de promotion de la transition ; hypothèse de coût du capital différenciée qui désavantage le nucléaire : elle est **le** choix normatif qui explique l'écart avec RTE |
| **négaWatt**, scénario 2022 (non lu à la source ; diaporama 2025 consulté en recherche) | Sobriété forte, renouvelables en très grande majorité, sortie progressive du nucléaire ; compatible avec RTE sur la logique, pas sur la sobriété | C | Association militante, indépendante des industriels ; objectif affiché de sortie du nucléaire |
| **The Shift Project** (non lu à la source) | Scénarios plus favorables au nucléaire et fondés sur les contraintes physiques (énergie, matériaux) ; critiqué sur ses hypothèses économiques | C | Think tank financé par des mécènes d'entreprises (dont des acteurs de l'énergie, ⚠️ V18006) ; fondateur ancien dirigeant ; positions publiques sur le nucléaire |
| **AIE**, *Nuclear Power in a Clean Energy System* (2019) et étude de l'AEN-OCDE sur les coûts système (non lus à la source) | Sans nucléaire, la décarbonation est plus chère ; les prolongations sont compétitives avec le solaire et l'éolien neufs ; les coûts système des renouvelables variables sont réels | B | Organisation internationale d'États consommateurs ; l'AEN est l'agence nucléaire de l'OCDE (⚠️ conflit d'intérêts sectoriel) ; critiquée par des auteurs favorables aux renouvelables pour supposer que le gaz ou le charbon remplacent le nucléaire fermé |
| **Études académiques** (Breyer, Jacobson, Brook, Jenkins) | Des modèles à 100 % renouvelable mondiaux ou européens concluent à la faisabilité ; d'autres modèles montrent que garder une base pilotable fait baisser le coût | A/B | Disputées ; hypothèses sur la flexibilité (V2G, hydrogène) décisives. Non lues pour ce dossier : ⚠️ V18007 |

**Lecture croisée (analyse de Claude)** : les trois grands modèles (RTE, ADEME, AIE/AEN) **s'accordent sur le mécanisme** : les renouvelables sont moins chères à produire, le nucléaire neuf est moins cher à l'échelle du système à forte part. Ils **divergent sur trois paramètres** : le coût du capital, le niveau de sobriété, le coût du nouveau nucléaire. Aucun ne dit que le nouveau nucléaire est dix fois moins cher, aucun ne dit non plus qu'il est ruineux ; la fourchette est de quelques Md€ par an autour de 60-70.

## 2. Le poids budgétaire

### 2.1 Ce que coûte le programme

| Poste | Montant | Périmètre, année | Statut |
|---|---|---|---|
| **6 EPR2** : estimation initiale | 51,7 Md€2020 | gouvernement, 2022, hors financement | A (Cour des comptes, janvier 2025) |
| idem, fin 2023 | 67,4 Md€2020 (79,9 Md€2023) | hors financement | A |
| idem, **EDF déc. 2025** | **72,8 Md€2020** (+8 % ; +40 % sur 2022) | hors financement, **non audité** (audit d'État attendu T1 2026) | C ⚠️ V18002 |
| **Flamanville 3** | 23,7 Md€2023 contre 3,3 prévus | avec financement | A (Cour des comptes) |
| **Grand carénage** du parc existant | ≈ 100,8 Md€ sur 2014-2035, ≈ 4,6 Md€ par an | EDF ; courants ou constants non précisés | C ⚠️ V18004 |
| **Petits réacteurs** | ≈ 0,35 Md€ par an plafonné (recommandation) ; ≈ 0,9 Md€ publics mobilisés à ce jour | `sources/petits-reacteurs-france.md` | A/B |
| **Cigéo** | 33,4 Md€ (coût arrêté) | financé par les provisions d'EDF | `petits-reacteurs-france.md` |

**Estimation** (script `sources/calculs/nucleaire_budget.py`). Hypothèses : **H1** inflation 2020-2024 de +13 % (à vérifier) ; **H2** dépense lissée sur 16 ans (2027-2042, première paire en service en 2038 ⚠️) avec une pointe à 1,5 fois la moyenne ; **H3** haut = surcoût de +40 % (la hausse de 2022 à 2025) ; **H4** financement : intérêts intercalaires à 4 % sur 7 ans en moyenne.

| | EPR2 bas (67,4) | **central (72,8)** | haut (+40 %) |
|---|---|---|---|
| Dépense annuelle, Md€ 2024, hors financement | 4,8 | **5,1** | 7,2 |
| **% des dépenses publiques (1 672 Md€)** | 0,28 % | **0,31 %** | 0,43 % |
| **% du PIB (2 918 Md€)** | 0,16 % | **0,18 %** | 0,25 % |
| En année de pointe (× 1,5), Md€ | 7,1 | 7,7 | 10,8 |
| Total avec financement, Md€ 2024 | 100 | 108 | 152 |

**Chiffres de comparaison, 2024 (Eurostat COFOG, cote A)** : dépenses publiques 1 671,8 Md€ ; PIB 2 917,6 Md€ (déduit du même jeu) ; vieillesse 392,0 Md€ ; santé 261,2 Md€ ; transactions de la dette publique 58,9 Md€. L'EPR2 central pèse **1,3 % des retraites, 2,0 % de la santé, 8,7 % de la charge de la dette**. Programme complet (EPR2 + carénage + 0,35 de petits réacteurs) : **10,1 Md€ par an = 0,60 % des dépenses, 0,35 % du PIB**.

**Soutien public aux renouvelables, pour comparaison** (Cour des comptes, mars 2026, cote B, via AFP ⚠️ V18008) : **26,3 Md€ cumulés sur 2016-2024** (2,9 Md€ par an en moyenne), 3,9 Md€ en 2024, **≈ 7,3 Md€ en 2025 (prévisionnel)**, **87 Md€ d'engagements à long terme à fin 2024**, avec de fortes incertitudes, un risque de sur-rémunération et des contrôles insuffisants. **C'est déjà plus que ce que coûterait chaque année le programme EPR2 central.**

### 2.2 Qui paie

- **EDF (100 % État)**, avec ses flux d'exploitation du parc existant et des **fonds propres**.
- **Un prêt bonifié de l'État pour 60 % du programme** (≈ 44 Md€ sur 72,8, calcul de Claude), financé par les fonds d'épargne (Livret A), annoncé après le Conseil de politique nucléaire du 12/03/2026 ⚠️ V18003 ; l'accord de la Commission européenne sur les aides d'État est requis ; **décision finale d'investissement visée avant fin 2026**.
- **Un prix garanti plafonné à 100 €/MWh (€2024)** ⚠️ V18003 : si le marché est plus bas, c'est un soutien. **Estimation** : 6 EPR2 ≈ 74 TWh par an (9,9 GW, facteur de charge 85 %) ; avec un marché à 65 €/MWh (ordre de grandeur de la CRE pour 2027, `energie-europe.md`), **≈ 2,6 Md€ par an** de soutien potentiel ; à 50 €/MWh, ≈ 3,7. La charge est portée par les consommateurs ou les contribuables selon le mécanisme retenu (⚠️ non tranché).
- **Asymétrie qui désavantage les renouvelables dans le débat** : le soutien aux renouvelables est une **dépense de l'État** (charges de service public) ; le nucléaire existant et neuf passe, lui, par les comptes d'EDF et le prix de l'électricité. Un comparatif honnête met les deux dans le même périmètre.
- **Risque pour les finances publiques** : EDF est classé hors administrations publiques (⚠️ à vérifier) ; l'investissement ne creuse donc pas le déficit au sens de Maastricht ; **mais** une dérive de coûts remonte à l'État actionnaire et garant (précédent : recapitalisations d'Areva et d'EDF). Précédent : Flamanville 3, 23,7 Md€2023 au lieu de 3,3 prévus (Cour des comptes).

### 2.3 Lecture (analyse de Claude)

Face aux accusations « pro-technologie », le chiffre honnête est : **le programme complet est de l'ordre de 0,35 % du PIB par an, dont la moitié est déjà décidée (remise à niveau du parc)**. C'est le coût d'une ligne budgétaire moyenne, pas d'un changement de modèle. **Ce chiffre ne démontre pas que le nucléaire est le meilleur choix**, seulement qu'il n'est pas hors de portée. Ne pas laisser croire que « 0,3 % du budget » règle la question : une dérive de +40 % en ferait 0,43 %, et le vrai enjeu est le coût par MWh.

## 3. Steelman des deux côtés

### 3.1 Contre le nouveau nucléaire

| Objection (la meilleure) | Réponse la plus solide | Ce qui reste vrai |
|---|---|---|
| **Délais et dérives** : Flamanville 3 : 3,3 Md€ puis 23,7 Md€ (2023) et 12 ans de retard ; premier EPR2 en 2038 (au lieu de 2035) ; EPR2 passé de 51,7 à 72,8 Md€2020 en trois ans | L'EPR était une tête de série, la série baisse les coûts (hypothèse d'EDF, non prouvée en Occident) ; RTE a testé le coût Flamanville : N2 reste moins cher (écart ≈ 4 Md€ par an) | **L'estimation actuelle (7 350 €/kW) est proche du stress test** ; un programme qui dérive de 40 % annule l'avantage s'il est financé à 7 % |
| **Coût du capital** : le nouveau nucléaire est le plus sensible aux taux (60 ans de vie, 10 à 15 ans de construction) | Le prêt d'État à 60 % et le prix garanti déplacent le risque vers l'État : à 4 %, ≈ 86 €/MWh (estimation) | Déplacer le risque ne le supprime pas : c'est le contribuable ou le consommateur qui le porte |
| **Déchets** | Cigéo (33,4 Md€) provisionné ; volume total faible | Cigéo non autorisé (décret attendu fin 2027 ⚠️), mise en service vers 2050 ⚠️ |
| **Eau et canicules** | Modulation de production lors des canicules (été 2026 ⚠️) déjà vécue ; pertes limitées en volume | Les prélèvements et la chaleur des fleuves restent une contrainte croissante ; les nouveaux sites (Penly, Gravelines, Bugey) sont en bord de mer ou de fleuve |
| **Dépendance à l'uranium** | Coût peu sensible au cours de l'uranium (RTE) ; stocks et enrichissement diversifiés | Dépendance à l'enrichissement russe encore à documenter (⚠️ V18009) |
| **Concentration du risque** : 56 réacteurs similaires, défaut générique (corrosion sous contrainte 2022) | Le parc a fait la preuve de sa résilience ; RTE conserve des marges | Un défaut générique sur un parc standardisé est le risque central ; il justifie de ne pas dépendre à 100 % d'une filière |
| **Pas de besoin avant 2035** (surcapacité, exports record) | La construction prend 12 ans : il faut décider maintenant pour remplacer le parc 2040-2060 | Décider trop tôt coûte des intérêts ; **c'est un argument pour étaler, pas pour renoncer** |

### 3.2 Contre le 100 % renouvelable

| Objection | Réponse la plus solide | Ce qui reste vrai |
|---|---|---|
| **Intermittence et stockage saisonnier** | Batteries, STEP, pilotage de la demande, hydrogène, interconnexions ; l'ADEME modélise 86 à 97 % de renouvelables en 2050 | Le stockage saisonnier est le coût invisible : RTE : « boucle power-to-gas-to-power » très coûteuse ; l'ADEME le suppose faisable avec des électrolyseurs bon marché (330 €/kW en 2050), ce qui est un pari |
| **Réseaux** | Le réseau doit de toute façon doubler | Raccordements et renforcements pèsent beaucoup plus dans M0/M1 que dans N2 |
| **Matériaux et chaîne d'approvisionnement** (panneaux asiatiques, batteries) | Relocalisation européenne partielle (éolien en mer très français) | Dépendance extra-européenne sur le solaire et les batteries (RTE) |
| **Foncier** | L'éolien terrestre et le solaire sur toitures ont des surfaces disponibles | Acceptabilité locale, plafonds de la PPE3 (⚠️ solaire 48 GW en 2030, éolien terrestre 31 GW, éolien en mer 15 GW en 2035) |
| **Rythme** : M0 suppose un rythme très élevé dès maintenant | M23 atténue, avec 11 réacteurs encore en service en 2050 | Plus la sortie est rapide, plus c'est cher (RTE) |
| **Cannibalisation des prix et financement** | Contrats long terme, contrats pour différence | RTE : les renouvelables **non plus** ne se financent pas sans soutien public ; engagements actuels de 87 Md€ |

### 3.3 Établi, débattu, manquant

- **Établi (sources A)** : RTE, ADEME et AIE s'accordent sur le mécanisme ; la France est en surcapacité jusqu'au moins le début des années 2030 ; la prolongation des réacteurs existants est la source bas-carbone la moins chère ; l'électrification est en retard.
- **Débattu** : coût du capital (7,5 % chez l'ADEME contre 4 % chez RTE), niveau de sobriété, coût du nouveau nucléaire, faisabilité industrielle d'un programme de série en Occident, coût du stockage saisonnier.
- **Manquant** : l'actualisation RTE (fin 2026) ; l'audit d'État du coût EPR2 ; le coût complet du nucléaire prolongé après 60 ans ; une comparaison publique à périmètre égal du soutien au nucléaire et aux renouvelables ; l'effet des prix négatifs sur la rentabilité d'un parc nucléaire qui module ; des études de sciences sociales sur l'acceptabilité d'un grand programme nucléaire.

## 4. Les petits réacteurs dans cette comparaison

Voir `sources/petits-reacteurs-france.md`. **Aucun petit réacteur n'a prouvé un coût de série** (CRE, septembre 2025) ; la série rentable se compte en dizaines d'unités ; le prototype coûte ≈ 1 Md€. Pour le mix électrique français, ils n'apportent rien avant les années 2035-2040 et ne figurent dans aucun scénario RTE comme moyen principal. **Ils restent un pari de recherche et d'export plafonné à ≈ 0,35 Md€ par an**, pas un pilier de la décarbonation.

## 5. Ce que dirait un détracteur de la thèse de l'auteur, et la réponse

- « **Le manifeste est pro-nucléaire par goût de la technologie.** » Réponse défendable : ce n'est pas un goût, c'est ce qu'indiquent les études de coût complet **si** le financement est favorable ; l'auteur se dit ouvert à d'autres options ; la proposition est donc de comparer à périmètre égal et de s'engager sur des seuils publics de renoncement (§ 6).
- « **Les EPR2 dérivent déjà.** » C'est vrai (+40 % en trois ans). La réponse n'est pas de nier mais de **plafonner** : un plafond de coût voté et un point de sortie.
- « **Le nucléaire ne répond pas à l'urgence** (2038). » Vrai pour les EPR2 ; c'est pourquoi **les décennies 2025-2037 reposent sur le parc existant, l'éolien et le solaire, et la sobriété**, ce que le nucléaire neuf complète après.
- « **Le 100 % renouvelable est moins cher que RTE ne le dit.** » Possible : l'ADEME trouve des coûts proches avec ses hypothèses ; la bonne réponse est de publier les deux jeux d'hypothèses.

## 6. Conclusion (analyse de Claude)

**Quel mix paraît le moins mauvais au regard des coûts, des délais et des risques ?** Un **mix « prolonger, électrifier, construire avec garde-fous »** :

1. **Prolonger les réacteurs existants** tant que l'autorité de sûreté le permet : c'est le moyen bas-carbone le moins cher (42 €/MWh selon l'ADEME, économie possible jusqu'à 3 Md€ par an selon RTE en priorisant les filières les moins chères).
2. **Développer les renouvelables les moins chères à l'échelle du système** : éolien terrestre et en mer posé bien situés, grand solaire au sol ; **ne pas** subventionner largement le petit solaire diffus ni l'éolien flottant à ce stade (RTE : coûts complets nettement plus élevés).
3. **Lancer un premier programme EPR2 plafonné** : décision par paires, plafond de coût voté (par exemple 72,8 Md€2020 + marge de 15 %), prix garanti plafonné (100 €/MWh €2024), jalons de sortie. **Raison** : sans eux, RTE montre que le 100 % renouvelable en grands parcs coûte ≈ 10 Md€ de plus par an en 2060 ; et on garde l'option si le nucléaire dérape.
4. **Flexibilité et réseaux dans tous les cas** (pilotage de la demande, batteries, interconnexions) : c'est là que RTE trouve la différence de coût.
5. **Petits réacteurs : recherche plafonnée, pas un pilier.**

**Pourquoi pas le 100 % renouvelable ?** Selon la source primaire la plus complète (RTE, avec une comparaison ADEME cohérente à hypothèses égales), il coûte plus cher dans la grande majorité des variantes, **sauf** si le nouveau nucléaire se finance nettement plus cher (écart de trois points) ou dérive au-delà de Flamanville. **Pourquoi pas tout nucléaire ?** Parce que le coût d'un seul pari dérive, que le défaut générique est un risque, et que les renouvelables bien choisies sont déjà dans la zone la moins chère.

**Ce qui pourrait faire changer d'avis (déclencheurs chiffrés)** :
1. **L'actualisation RTE de fin 2026** montre que l'écart M23 − N2 tombe **sous 3 Md€ par an** à hypothèses actualisées → on préfère étaler ou réduire le programme EPR2.
2. **L'audit d'État du coût EPR2 dépasse ≈ 85 Md€2020** (+15 % sur 72,8 ; soit > 8 600 €/kW, au-dessus du stress test de RTE à 7 900) → pause avant la décision d'investissement.
3. **Le coût complet du nouveau nucléaire dépasse ≈ 110 €/MWh** (seuil de RTE ; à 4 %, j'estime ≈ 86 ; à 7 %, ≈ 141) → le programme perd son avantage.
4. **Le coût du capital pour le nucléaire dépasse celui des renouvelables de ≥ 3 points** (Commission européenne qui refuse le prêt d'État, taux d'emprunt ≥ 5 % durablement) → écart nul selon RTE.
5. **Les prix de gros restent durablement sous ≈ 50 €/MWh** : le prix garanti coûterait plus de ≈ 3,7 Md€ par an au contribuable ou au consommateur → réexaminer.
6. **Un défaut générique** sur le parc ou un retard de **plus de 3 ans** du premier EPR2 (au-delà de 2041) → renforcer l'éolien en mer et le stockage.
7. **Dans l'autre sens** : si la consommation d'électricité reste sous ≈ 505 TWh en 2035 (trajectoire lente de RTE), **le besoin d'EPR2 en 2038 baisse** ; le programme se justifie alors surtout par le remplacement du parc ancien après 2040, et on pourra étaler sans pénaliser le climat.

**Cohérence avec les positions de l'auteur (05/11)** : de nouveaux réacteurs parce que l'IA et l'électrification demanderont beaucoup d'électricité propre → **à nuancer** : les données RTE ne montrent pas de pénurie avant 2035 ; l'argument fort est le **remplacement du parc** et l'indépendance fossile (facture énergétique de 61 Md€ en 2024), pas la demande immédiate des centres de données. Construire moins cher → c'est la variable décisive ; le contrôle des coûts (plafond, jalons, pilotage) est plus important que le choix de la technologie.

## Synthèse des sources mobilisées

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts |
|---|---|---|---|
| RTE, Futurs énergétiques 2050, rapport complet ch. 11 (février 2022) et principaux résultats (octobre 2021), https://www.rte-france.com/analyses-tendances-et-prospectives/bilan-previsionnel-2050-futurs-energetiques (lus en local le 06/11/2026) | Coûts complets 2060 par scénario, sensibilités, stress tests | A | Gestionnaire de réseau, filiale d'EDF à 50,1 % ⚠️ ; mandaté par l'État |
| RTE, Bilan prévisionnel 2025-2035, résumé exécutif, 09/12/2025 | Surcapacité, exports 89 TWh en 2024, facture énergétique 61 Md€, filières les moins chères, 3 Md€ d'économie possible | A | idem |
| RTE, consultation publique actualisation des FE 2050, 03/04/2026 | Publication fin 2026 ; cadre de mondialisation contrariée | A | idem |
| ADEME, Transition(s) 2050, note sur le mix électrique (Penly, débat public, 2023) | 86 % EnR possibles ; écart faible à 650 TWh ; 7,5 % contre 5,25 % ; prolongation à 42 €/MWh | B | Agence d'État ; hypothèses de capital défavorables au nucléaire |
| Cour des comptes, EPR2 et Flamanville 3 (janvier 2025) via `recherche-energie-nucleaire-fusion.md` | 51,7 → 67,4 Md€2020 ; Flamanville 23,7 Md€2023 | A | aucun connu |
| EDF via AFP (Connaissance des énergies, 18/12/2025) ; Localtis/AFP 13/03/2026 | 72,8 Md€2020 non audité ; prêt 60 % ; prix garanti ≤ 100 €/MWh | C | EDF partie prenante ; presse |
| Cour des comptes, soutien aux renouvelables (mars 2026) via AFP | 26,3 Md€ en 2016-2024 ; 87 Md€ d'engagements | B | aucun connu ; synthèse de presse |
| Eurostat COFOG (gov_10a_exp), fichier local, dépenses publiques 2024 | 1 671,8 Md€ ; vieillesse 392 ; santé 261,2 ; dette 58,9 | A | aucun connu |
| `modeles/grand-livre/synthese.md` | Dépenses consolidées 1 672,6 Md€ (Insee) | A | aucun connu |
| `sources/petits-reacteurs-france.md` | Petits réacteurs : pas de coût de série prouvé | A/B | Conflit d'Anthropic déclaré |

Calcul : `sources/calculs/nucleaire_budget.py` (tests assert) ; résultats : `sources/calculs/nucleaire_budget_resultats.txt` ; données : `sources/nucleaire-ou-alternatives.csv` ; fichiers bruts : `$DONNEES/sources/energie/`.
