# Outre-mer : pourquoi la vie est plus chère, et ce que coûterait une compensation

Statut : **brouillon, à relire**. Rédigé le 08/11/2026 ; toutes les consultations ont eu lieu le 08/11/2026 sauf mention contraire.
Calcul reproductible : `sources/calculs/outre-mer-vie-chere.py` (lancer avec `python3 -I`). Les PDF lus sont dans `sources/donnees/outre-mer/`.

Légende : **[F]** fait sourcé · **[E]** estimation (méthode dans le texte) · **[O]** opinion · **⚠️** non vérifié ou à compléter (repris dans la liste de la section 7).

---

## Résumé

- **Écart de prix [F]** : en 2022, les prix à la consommation dépassent ceux de la métropole de 16 % (Guadeloupe), 14 % (Martinique, Guyane), 9 % (La Réunion) et 10 % (Mayotte, hors loyers). L'écart est **de 30 à 42 % pour l'alimentation**, et il augmente depuis 2010.
- **Ce qui le fait [F, en partie E]** : l'essentiel vient de la chaîne d'approvisionnement, pas d'un seul acteur. En Martinique (2024), les frais d'approche pèsent **33,3 % du coût d'achat** des marchandises importées : logistique et port 12,8 points, transport maritime 10,9 points, octroi de mer 9,6 points. Les marges de la distribution sont inégales : faibles pour les supermarchés, élevées pour certaines centrales. Les compléments de rémunération des fonctionnaires (1,5 Md€ pour l'État en 2020) sont un facteur débattu, qui touche surtout les services et le logement.
- **Coût annuel pour l'État [E]**, en millions d'euros (scénarios bas / central / haut, cinq départements et régions) :
  - (a) compenser le fret maritime des biens de consommation courante : **200 / 320 / 610** ;
  - (b) supprimer l'octroi de mer et compenser les collectivités : **1 230 / 1 640 / 1 970** ;
  - (c) ramener les prix alimentaires au niveau métropolitain : **1 130 / 1 340 / 1 850**.
  - Les trois options **ne s'additionnent pas** : le fret et l'octroi de mer font partie de l'écart alimentaire de (c).
- **Lecture [O]** : la compensation est un coût budgétaire permanent. Elle ne baisse les prix que si la chaîne répercute la baisse, et la question des marges n'est pas réglée par la seule dépense publique.

---

## 1. Écarts de prix avec la métropole

### 1.1 Niveau général et par poste (Insee, 2022)

Source : Insee, *Insee Première* n° 1958, « En 2022, les prix restent plus élevés dans les DOM qu'en France métropolitaine, en particulier pour les produits alimentaires », juillet 2023. [A] Indices de Fisher, en % par rapport à la métropole, champ hors fioul, gaz de ville et transports ferroviaires ; Mayotte hors loyers.

| Poste | Guadeloupe | Martinique | Guyane | La Réunion | Mayotte |
|---|---|---|---|---|---|
| **Ensemble** | **15,8** | **13,8** | **13,7** | **8,9** | **10,3** |
| Produits alimentaires et boissons non alcoolisées | 41,8 | 40,2 | 39,4 | 36,7 | 30,2 |
| Boissons alcoolisées et tabac | 24,8 | 22,6 | −2,1 | 27,3 | 40,0 |
| Biens | 20,6 | 19,2 | 17,2 | 13,3 | 14,9 |
| Services | 10,5 | 7,5 | 9,9 | 3,8 | nd |
| Loyers | 4,4 | 2,5 | 9,7 | 4,7 | nd |
| Santé | 16,1 | 13,4 | 16,5 | 8,9 | 16,9 |
| Communications | 36,0 | 37,4 | 35,3 | 24,5 | 11,9 |
| Transports | 8,5 | −4,7 | 5,8 | −4,0 | −4,7 |

Évolution de l'écart global : Guadeloupe 8,3 % (2010), 12,5 % (2015), 15,8 % (2022) ; l'écart alimentaire a augmenté de +9 points en Guadeloupe et à La Réunion, +11 points à Mayotte entre 2015 et 2022 (Insee, même note). [F]

Autres constats de la même note : environ 60 % des biens consommés dans les DOM viennent de la métropole [F] ; l'écart des loyers est surtout dans le secteur libre, et à caractéristiques égales les loyers libres sont plus chers dans les quatre DOM [F].

**Lecture [E]** : l'écart est concentré sur les biens (et l'alimentation), beaucoup moins sur les services et le logement. Ce profil est important pour la section 2.4.

### 1.2 Régions dont l'écart est le plus fort

Le Protocole de Martinique (16/10/2024) reprend l'écart de 14 % global et 40 % alimentaire, et indique que 80 % des produits consommés en Martinique sont importés. [B, document signé par l'État et des acteurs économiques ; chiffres repris des parties.]

---

## 2. Décomposition du surcoût

Le surcoût n'a pas une cause unique. La meilleure source récente est l'avis de l'Autorité de la concurrence du 10 février 2026 (n° 26-A-01, Martinique), qui mesure la structure de coûts [A]. Les avis de 2009 (n° 09-A-45, 8 septembre 2009) et de 2019 (n° 19-A-12, 4 juillet 2019) donnent le cadre antérieur [A].

Attention aux bases : les pourcentages ci-dessous ne sont pas toujours calculés sur la même base (coût d'achat, coût total, prix de détail). On ne les additionne pas.

### 2.1 Fret maritime et assurance

- Coût du transport maritime : **7,2 %** du coût d'achat des marchandises importées en moyenne, en 2018 (6 % pour les grossistes, 8 % pour les distributeurs), soit 10 % du prix FAB. [A, AdC 2019, cité par le rapport AN n° 1549, p. 110-115.]
- Décomposition du coût de transport [A, AdC 2019 §305-306] : le fret proprement dit représente environ **50 %**, la surcharge carburant (BAF) environ **25 %**, la manutention (THC) **15 à 22 %** selon les territoires. Le taux de fret pèse 52 % du total facturé en 2017 (rapport AN, p. 115).
- Mise à jour : en 2024, en Martinique, le **transport maritime pèse 10,9 %** du coût d'achat des marchandises importées (AdC 2026, p. 6). [A]
- Prix public contre coût pour le principal armateur [F, données fournies par l'entreprise et analysées par le rapporteur, rapport AN p. 114] : entre 2016 et 2022, le coût du fret maritime pour cet armateur augmente de 119 % ; le prix public du 40 pieds **double** en Guadeloupe et en Martinique, alors que les coûts n'augmentent que de 28 % et 29 % dans ces deux territoires. Le rapport en conclut qu'on ne peut pas établir de lien proportionnel direct. ⚠️ Donnée d'entreprise, non recoupée.
- Concentration : le rapport AN, dans la contribution du groupe Renaissance (p. 380), donne pour un armateur une part de marché du fret de 62 % (Martinique), 64 % (Guadeloupe) et 84 % (Guyane). ⚠️ Chiffre repris d'une contribution partisane, source d'origine non identifiée.
- Assurance : je n'ai pas trouvé de part publiée distincte. L'assiette de l'octroi de mer importé inclut le fret et l'assurance (CAF), ce qui crée un effet mécanique [A, Cour des comptes 2024, p. 18]. ⚠️

**Synthèse fret [E]** : fret et transport maritime pèsent entre **3,6 % et 10,9 %** du coût d'achat selon la base retenue. Avec la part centrale (5,7 %), le fret reste inférieur à l'octroi de mer (9,6 %) et à la logistique (12,8 %).

### 2.2 Octroi de mer et octroi de mer régional

- **Recette nette 2022 : 1 644 M€**, niveau historique, dont **410,7 M€** d'octroi de mer régional et environ **54 M€** d'octroi de mer interne (OMI, 3,3 %). Hausse moyenne de 4,65 % par an entre 2014 et 2022. [A, Cour des comptes, *L'octroi de mer*, mars 2024, p. 11-12, 50, 52, 60.]
- Répartition 2014-2022 : communes 75,8 %, régions 24,2 % (Cour, p. 52). Par habitant en 2022 : Guadeloupe 970 €, Martinique 949 €, La Réunion 640 €, Mayotte 520 € (Cour, p. 11-12). [A]
- Taux : la collectivité fixe un taux, entre 0 et 60 % en général (90 % pour l'alcool et le tabac, jusqu'à 135 % à Mayotte selon le rapport AN). Taux moyens relevés en 2019 : **Réunion 4 %, Guadeloupe 7 %, Martinique 7 %, Guyane 15 %** (AdC 2019, §33). Plafonds de l'octroi régional : 2,5 % (5 % en Guyane) (AdC 2019, §32). Plus de 15 000 lignes tarifaires, 7 à 16 taux différents (Cour, p. 14). [A]
- Poids dans le prix : l'octroi de mer pèse **9,6 %** du coût d'achat des marchandises importées en Martinique en 2024 (AdC 2026, p. 6) ; **en moyenne 7 %** du coût total des distributeurs et grossistes en 2018 (AdC 2019, §485), soit plus que le fret. [A]
- Exemple avancé par le ministre de l'Économie lors d'une audition en 2023 : la farine est taxée à 30 % en Martinique et en Guadeloupe contre une TVA de 5,5 % dans l'Hexagone. [O, déclaration ministérielle, à ne pas lire comme une mesure du prix final.]
- Coût des exonérations et différentiels (taxes non perçues) : **plus de 490 M€ par an** ; sur 100 € encaissés en 2015-2019, environ 37 € de recettes potentielles n'ont pas été perçues (Cour, p. 15). [A ; la Cour juge la reconstitution « complexe et non consensuelle ».]
- Dépendance des communes : l'octroi de mer représente en moyenne **32 %** des produits de gestion des communes ultramarines, et couvre **43 à 57 %** de leurs dépenses de personnel (Cour, p. 12). [A]
- Régime juridique : voir section 3 et 5.

**Synthèse octroi [E]** : l'octroi pèse environ **7 à 10 %** du coût d'achat des marchandises importées. C'est la troisième composante des frais d'approche identifiés par l'Autorité en 2026, après la logistique et le transport maritime.

### 2.3 Marges de l'importation, du gros et de la distribution

Les données de l'avis 26-A-01 (Martinique, exercice 2024 ; marges nettes sauf mention) [A] :

| Maillon | Marge nette (2024) | Remarque de l'Autorité |
|---|---|---|
| Hypermarchés | +1,2 % | Marge commerciale supérieure à la moyenne hexagonale (+1,7 point) |
| Supermarchés | −1,4 % | Marge commerciale inférieure à l'Hexagone (−3 points) |
| Grossistes-importateurs et centrales d'achat (intégrés) | +1,6 % | Marges voisines de l'Hexagone pour les intégrés |
| Grossistes-importateurs non intégrés | environ 2 fois celle des intégrés | « Surperformance notable » |
| Centrales de référencement | +28,8 % | Rentabilité très élevée ; l'Autorité note que les marges se répartissent entre entités d'un même groupe |

Autres éléments de l'avis 26-A-01 :
- la part des frais d'approche dans le coût d'achat des importés est passée de **28 % (2019, tous DROM) à 33,3 %** en 2024 ; les frais forfaitaires (au conteneur ou au volume) pèsent plus sur les produits à faible valeur, comme les produits alimentaires (AdC 2026, p. 5-6) ; [A]
- les charges refacturées entre entités du même groupe représentent **9 %** de la marge brute globale (AdC 2026, p. 8) ; [A]
- sept groupes interviennent dans la distribution ; trois d'entre eux possèdent des grossistes-importateurs (AdC 2026, p. 6-7). [A]

L'avis 2019 apporte deux points complémentaires [A] : les marges brutes vont de **moins de 5 %** (alcools) à **plus de 30 %** (produits d'entretien) ; et « les marges réalisées par certains distributeurs n'expliquent pas, en moyenne, l'essentiel des écarts de prix ». Il retient surtout le cumul des marges de toute la chaîne.

Le Protocole de 2024 attribue **67 %** de l'écart de prix aux frais d'approche. ⚠️ Chiffre du Protocole, non retrouvé dans les avis de l'Autorité, base de calcul inconnue.

**Synthèse marges [E]** : les marges de la distribution ne suffisent pas à expliquer l'écart moyen. Elles sont en revanche élevées à certains maillons intermédiaires (grossistes non intégrés, centrales de référencement), ce qui va dans le sens de l'objection de la section 5.

### 2.4 Foncier, salaires et rémunérations publiques

**Foncier et loyers.** Le rapport AN évoque « l'exiguïté du marché et la rareté du foncier » qui augmentent les coûts de production et empêchent les économies d'échelle (rapport, p. 68). [O, qualitatif.] Le loyer est un poste de +2,5 % (Martinique) à +9,7 % (Guyane) par rapport à la métropole (Insee 2022). [A]

**Rémunérations publiques.** Il faut distinguer trois choses :
- les **compléments de rémunération** (« prime de vie chère ») : majoration de 40 % en Martinique, Guadeloupe, Guyane et Mayotte, de 53 % à La Réunion (rapport AN, p. 54, selon les textes) ; pour les fonctionnaires hexagonaux, les primes représentent 20 à 22 % des revenus, pour les agents en poste outre-mer 50 à 60 % (Cour des comptes, cité par le rapport AN, p. 54-55). [A]
- le **coût budgétaire** : **1 511 M€ en 2020** pour la fonction publique de l'État (et les militaires), en hausse de **28 % entre 2012 et 2020**, alors que les effectifs n'augmentaient que de 9 % (Cour des comptes, référé S2023-0689, 8 juin 2023, p. 2-4). [A, copie du référé ; source officielle ccomptes.fr à citer en priorité.] Le rapport AN cite un coût de 1,178 Md€ en 2012 (Cour, rapport 2015). ⚠️ rapport de 2015 non lu directement.
- l'**effet sur les prix** : la Cour (référé 2023) estime que les compléments « créent un marché de consommation garanti » qui permet aux importateurs et distributeurs de maintenir des prix élevés dans un contexte oligopolistique, et qu'ils dépassent nettement l'écart réel du coût de la vie. [A pour le constat de la Cour ; l'effet est une hypothèse de la Cour, non chiffrée.] Un universitaire auditionné par l'Assemblée relativise le rôle de ces compléments (rapport AN, p. 55). [O]

**Inférence [E]** : les écarts de prix sont surtout sur les biens (20,6 % en Guadeloupe) et peu sur les services (10,5 %), alors que les rémunérations publiques agissent d'abord par la demande de services et de logement. Le surcoût salarial n'explique donc vraisemblablement qu'une partie de l'écart sur l'alimentaire. Cette inférence n'a pas été testée sur des données ; c'est une hypothèse à vérifier.

### 2.5 Concentration du marché

- Sept groupes de distribution en Martinique, dont trois possèdent aussi des grossistes-importateurs (AdC 2026). [A]
- En Polynésie française, quatre groupes détiennent la quasi-totalité du marché (rapport AN, contribution du groupe Renaissance). ⚠️ Territoire hors champ, cité pour illustration.
- L'avis 2026 recommande de renforcer le contrôle de la loi Lurel (interdiction des droits exclusifs d'importation, codifiée à l'article L420-2-1 du code de commerce) : son application « varie » en Martinique (AdC 2026, p. 6). [A]
- La Cour (2024) parle d'un « risque de limitation de la concurrence et de préservation de situations acquises » (p. 99). [A, risque, non mesuré.]

### 2.6 Bilan de la décomposition [E]

| Composante | Poids indicatif (base) | Source |
|---|---|---|
| Logistique et port | 12,8 % du coût d'achat importé (2024) | AdC 2026 |
| Transport maritime | 10,9 % (2024) ; 7,2 % (2018, moyenne DROM) | AdC 2026 ; AdC 2019 |
| Octroi de mer (importé) | 9,6 % (2024) ; 7 % du coût total (2018) | AdC 2026 ; AdC 2019 |
| Marges de distribution | nettes −1,4 % à +1,2 % (supermarchés et hypers, 2024) ; très variables selon la marge brute (5 à 30 %) | AdC 2026 ; AdC 2019 |
| Salaires publics | 1,5 Md€ de compléments pour l'État (2020), effet sur les prix débattu | Cour 2023 |
| Foncier et loyers | +2,5 à +9,7 % (loyers) | Insee 2022 |

Lecture [E] : les frais d'approche (33,3 % du coût d'achat) peuvent à eux seuls rendre compte d'une part importante d'un écart de 40 % sur l'alimentaire, à condition de les comparer avec une marge de détail ordinaire. Le calcul exact n'a pas été fait ; la comparaison d'une chaîne d'approvisionnement avec son homologue métropolitain manque (l'Autorité le relève en 2026 et en 2019).

---

## 3. Dispositifs existants

| Dispositif | Ce qu'il fait | Source | Remarque |
|---|---|---|---|
| **Bouclier qualité-prix (BQP)** | Plafonne le prix d'une liste de produits de grande consommation ; 134 produits en Martinique avant le Protocole | Protocole 16/10/2024 ; AdC 2026 | Créé par la loi n° 2012-1270 du 20 novembre 2012 (« loi Lurel »). ⚠️ Numéro cité par le rapport AN, texte de loi non lu directement. |
| **BQP+** | Extension après la démarche « Oudinot du pouvoir d'achat » (2022) | AdC 2026, p. 4 | Efficacité non évaluée dans les sources lues. |
| **Article L410-2 du code de commerce** | Pose la liberté des prix ; permet au gouvernement de les réglementer dans les situations de monopole, de difficultés d'approvisionnement ou de marché anormal | Secondaire (résumés) | ⚠️ Texte non lu sur Légifrance (403). Une fiche du Conseil d'État (21/10/2026, n° 512989) indique que l'article n'oblige pas à réglementer les prix (fiche lue, décision non lue). |
| **Article L410-5** | Négociation annuelle sur les prix outre-mer | Protocole 2024 | Le Protocole prévoit d'y inscrire progressivement davantage de produits. |
| **Article L420-2-1** | Interdit les droits exclusifs d'importation | AdC 2026 | Application jugée inégale en Martinique. |
| **Aide au fret (État)** | Rembourse une partie du fret de certaines marchandises | Rapport AN p. 316. (rapport du Sénat de 2019 cité) | Taux maximum 50 % (25 % quand l'aide européenne s'y ajoute). 4,2 M€ (État) et 22,1 M€ (européen) en 2019. ⚠️ Chiffres de 2019 repris du Sénat, non lus directement. |
| **Aide au fret, lignes budgétaires** | Dotations votées | Amendements parlementaires | ⚠️ LFI 2024 : 7,8 M€ en AE et 5,6 M€ en CP ; PLF 2026 : 5,37 M€ en AE et 4,38 M€ en CP. Chiffres d'amendements, non confirmés par le RAP. |
| **Protocole de Martinique (16/10/2024)** | 36 mois d'observation ; voir encadré | Protocole | Mise en œuvre à partir du 1er janvier 2025 selon le texte. |
| **Continuité territoriale** | Aide aux transports, surtout aériens | Rapport AN p. 318 (proposition 55) et p. 321 | 187 M€ par an selon le rapport AN, année non précisée. ⚠️ Ne couvre pas le fret de marchandises. |
| **Octroi de mer régional et communal** | Recette des collectivités | Cour 2024 | Voir 2.2 ; pas de frais de recouvrement prélevés sur l'octroi régional (manque à gagner 51,3 M€ sur 2014-2022, Cour). |

**Encadré — Protocole de Martinique (16 octobre 2024).** Signé par l'État, la collectivité, des élus, des distributeurs, des grossistes et le principal armateur. [B]
- **Octroi de mer à zéro** sur une liste de **54 familles de produits** (plus de 6 000 références). La collectivité s'engage à le proposer à son assemblée, compensé par une **péréquation** sur d'autres produits. Coût annoncé par la collectivité : **5,98 M€ par an** (AdC 2026, p. 5). Or l'assemblée a voté des hausses d'octroi sur d'autres produits « dépassant très largement » ce coût (AdC 2026, p. 5). [A, pour le fait ; l'effet net sur les prix n'est pas documenté.]
- **TVA à taux zéro** pour 69 familles de produits, compensée par la suppression d'exonérations sur des produits non alimentaires (smartphones et matériel informatique remis à 8,5 %). [A]
- **Hypermarchés** : baisse moyenne de **20 %** sur les 54 familles, gel des taux de marge, engagement de ne pas augmenter les marges. [B, engagement volontaire.]
- **Grossistes et distributeurs** : répercussion des baisses, transmission des données de prix et de marges tous les six mois à l'État. [B]
- **Mécanisme de compensation des frais d'approche** pour 69 familles, alimenté par des contributions volontaires et privées (dont l'armateur principal), sans montant fixé. [B]
- **POSEI** : expérimentation de soutien aux cultures locales, 2 M€ en 2025, 4 M€ et 6 M€ demandés pour 2026 et 2027. [B]
- Suivi : réunions trimestrielles, comité annuel, contrôle par l'OPMR (observatoire des prix, marges et revenus). [B]
- ⚠️ Un bilan préfectoral de juillet 2026 aurait conclu à un respect global des engagements par les distributeurs ; il n'a été lu que dans un article de presse, non vérifié.

---

## 4. Volumes et coûts des trois options

### 4.1 Données et hypothèses

| Donnée | Valeur | Source | Statut |
|---|---|---|---|
| Consommation des ménages, La Réunion | 13 000 M€ (2022e) | IEDOM, *Rapport annuel économique 2024* (La Réunion), p. 33 imprimée | [A-B] |
| Consommation des ménages, Martinique | 6 141 M€ (2024) | Insee Analyses Martinique n° 79 (sept. 2025), figure 1 | [A] |
| Consommation des ménages, Guadeloupe, Guyane, Mayotte | 16 000 €, 16 000 € et 8 000 € par habitant × population | **Hypothèse** | ⚠️ population approximative (Guadeloupe 376 000 ; Guyane 290 000 ; Mayotte 321 000) à remplacer par Insee RP 2022 |
| Importations de biens non durables, La Réunion | 2 253 M€ (2024) ; durables 386 M€ | Insee Conjoncture Réunion n° 38 (juillet 2025), figure 1, source douanes | [A] |
| Importations totales, Martinique | 3 484 M€ (2024, « biens et services ») | Insee Analyses Martinique n° 79 | [A] ; ⚠️ inclut les services |
| Importations de biens non durables, Guadeloupe, Guyane, Mayotte | **non trouvées** | — | ⚠️ à extraire des données de la douane (statistiques départementales du commerce extérieur) |
| Part alimentaire dans le budget | 15 % (Mayotte davantage, non chiffré) | Insee 2023, n° 1958 | [A] |
| Écart alimentaire (Fisher, 2022) | 41,8 ; 40,2 ; 39,4 ; 36,7 ; 30,2 % | Insee 2023 | [A] |
| Coût du transport maritime | 7,2 % (2018) ; 10,9 % (Martinique, 2024) ; fret = 50-52 % du transport | AdC 2019 ; AdC 2026 ; rapport AN | [A] |
| Octroi de mer net 2022 | 1 644 M€ ; régional 410,7 M€ ; croissance 4,65 %/an | Cour 2024 | [A] |

**Base commune des importations [E]** : le ratio importations de biens non durables / consommation des ménages est de **17,3 %** à La Réunion (2 253 / 13 000, années différentes : 2024 et 2022e). Appliqué à la Martinique, il donne 1 064 M€, contre 1 100 M€ par la part de 31,6 % des non durables dans les importations totales de 3 484 M€ : **contrôle à 3 % près**. On applique donc ce ratio aux cinq territoires : base de **5,6 Md€** pour l'ensemble. La base dépend fortement des estimations de Guadeloupe, Guyane et Mayotte.

### 4.2 Méthode

- **(a) Fret** = part du fret dans le coût d'achat × base des importations de biens non durables.
  - bas : 3,6 % (= 50 % × 7,2 %, AdC 2019) ; central : 5,7 % (= 52 % × 10,9 %, AdC 2026 et rapport AN) ; haut : 10,9 % (transport maritime entier, AdC 2026).
  - Repère : le principal armateur avait chiffré à **environ 80 M€ par an** le coût pour le groupe d'une aide au pouvoir d'achat (gel de la BAF en 2022-2023) pour l'ensemble des lignes ultramarines (rapport AN, p. 115). ⚠️ Chiffre d'entreprise. Il est cohérent avec les scénarios bas et central.
- **(b) Octroi de mer** : recette à compenser.
  - bas : 1 644 − 411 = **1 233 M€** (seule la part communale et départementale est compensée, les régions gardent leur part) ;
  - central : **1 644 M€** (recette nette 2022 complète) ;
  - haut : 1 644 × 1,0465⁴ = **1 972 M€** (extrapolation à 2026 au rythme 2014-2022).
  - Non compris : les 490 M€ de taxes non perçues (ce ne sont pas des flux à compenser) et les frais de recouvrement (1,5 %, environ 25 M€).
- **(c) Prix alimentaires** : l'écart mesuré est rapporté au prix métropolitain. Si le prix local est (1 + e) × P, ramener au prix P coûte e / (1 + e) de la dépense alimentaire locale. Dépense alimentaire = 15 % × consommation des ménages.
  - central : e / (1 + e) avec l'écart propre à chaque territoire ;
  - bas : e / (1 + e) avec l'écart de Mayotte (30,2 %) pour tous les territoires ;
  - haut : e × dépense alimentaire (la formule proposée dans la consigne, qui surestime car elle applique l'écart au prix local).

### 4.3 Résultats (M€ par an, arrondis)

| Option | Bas | Central | Haut | Remarque |
|---|---|---|---|---|
| (a) Compenser le fret des biens de consommation courante | **200** | **320** | **610** | Réunion seule : 80 / 130 / 250 |
| (b) Supprimer l'octroi de mer, compenser les collectivités | **1 230** | **1 640** | **1 970** | Martinique 2022 seule : 346 M€ (AdC 2026, citant la Cour) |
| (c) Ramener les prix alimentaires au niveau métropolitain | **1 130** | **1 340** | **1 850** | Réunion : 520 (central), 720 (haut) ; Martinique : 260 (central), 370 (haut) |

**Mise en garde** : (a), (b) et (c) ne s'additionnent pas. Le fret et l'octroi sont des parties de l'écart alimentaire mesuré en (c). Une compensation des frais d'approche devrait donc être comparée à (c), pas ajoutée à (c).

**Sensibilité [E]** :
- Le total dépend des hypothèses sur Guadeloupe, Guyane et Mayotte (environ 13,2 Md€ de consommation des ménages sur 32,4 Md€ au total, soit 40 %). Faute de données, cette part est estimée.
- Si les marges absorbent une part de la baisse, le coût pour l'État diminue d'autant. Le Protocole cherche justement ce partage (gel des marges, répercussion des baisses).
- Le coût pour l'État dépend du mode de financement : aide directe aux importateurs, compensation des collectivités, ou baisse de la TVA. La TVA à taux zéro du Protocole, pour 69 familles, est une autre option, non chiffrée ici.

**Lecture [O]** : le coût de la compensation (environ 1 à 2 Md€ par an) représente une dépense permanente, comparable au coût budgétaire des compléments de rémunération (1,5 Md€ en 2020). La Cour recommande précisément de réduire ces compléments au différentiel réel de coût de la vie. Les deux questions sont liées.

---

## 5. Meilleures objections

**1. La subvention est captée par les marges.**
- *Objection* : la compensation profite aux intermédiaires. Les centrales de référencement affichent 28,8 % de marge nette, les grossistes non intégrés sont deux fois plus rentables que les intégrés, et la Cour estime que les compléments de rémunération « créent un marché de consommation garanti ». Une baisse de l'octroi ou du fret peut être absorbée sans baisse de prix.
- *Réponse* : c'est le point le plus solide. Il ne tient que si la compensation n'est pas conditionnée. Le Protocole (gel des marges, répercussion obligatoire, données transmises à l'État, contrôle OPMR) répond en partie. Il faut une condition de répercussion mesurée par l'OPMR, une clause de retour et un test sur les 54 familles avant d'étendre (proposition 4 du rapport AN : baisse de 10 à 20 % négociée). [O]

**2. L'octroi protège la production locale.**
- *Objection* : le différentiel entre produits locaux et importés protège l'industrie ultramarine. Le Conseil constitutionnel (décision de 2018, citée par le rapport AN, p. 218-219) a jugé que ce différentiel préserve le tissu économique local.
- *Réponse* : le différentiel est encadré par l'Union européenne (plafonds de 20 et 30 points, décision 2021/991, article 1er). On peut donc garder la protection des produits locaux et baisser l'octroi sur les seuls produits importés sans équivalent local, ce que recommande l'Autorité (recommandation n° 5, 2026). Le Protocole promet aussi de préserver la production locale.

**3. Le droit de l'Union limite la réforme.**
- *Objection* : l'octroi de mer est une dérogation aux articles 28, 30 et 110 TFUE, accordée jusqu'au 31 décembre 2027 par la décision 2021/991 ; la Commission peut la remettre en cause ; une aide au fret ou une compensation peut constituer une aide d'État (article 107 TFUE) soumise à notification.
- *Réponse* : c'est exact. Toute réforme au-delà de 2027 suppose une nouvelle décision du Conseil, et le rapport d'évaluation à remettre avant le 30/09/2025 n'a pas été lu. L'article 349 TFUE permet des mesures adaptées aux régions ultrapériphériques, et l'arrêt Hansen (1978, cité par le rapport AN) avait déjà fait naître la question. ⚠️ La compatibilité d'une aide au fret avec les règles d'aides d'État n'a pas été vérifiée.

**4. La compensation coûte cher et s'installe.**
- *Objection* : (b) transfère environ 1,6 Md€ par an de l'État vers les collectivités, sans obligation de baisse des prix, et sans rien garantir sur la durée.
- *Réponse* : c'est un argument fort [O]. Le coût est permanent, et la Cour a déjà montré que les aides ponctuelles (aide au fret) sont sous-dotées et fluctuantes. Une compensation qui serait liée à une baisse vérifiée de prix serait plus défendable.

**5. Les prix ne réagiront pas comme prévu.**
- *Objection* : la baisse de prix est incertaine. La Ferdi (2020) estime une baisse de 4,6 % (Martinique) à 9 % (Guyane) sous réserve de répercussion ; le modèle EGC de Mathouraparsad (2016) donne −7 % des prix pour une suppression totale de l'octroi, avec +4,3 % de pouvoir d'achat, et le gain profite surtout aux ménages pauvres.
- *Réponse* : les deux estimations reposent sur une répercussion complète, qui n'est pas acquise. Elles sont citées par la Cour, non lues directement. ⚠️ Ces ordres de grandeur sont à confronter aux 40 % d'écart alimentaire : même une baisse de 7 à 9 % ne ferme qu'une partie de l'écart.

**6. Le surcoût des fonctionnaires est mal analysé.**
- *Objection* : le rapport AN évite le mot « surrémunération » ; la contribution du groupe Renaissance le reproche au rapporteur et évoque un effet de contagion sur le secteur privé. Le sujet est sensible.
- *Réponse* : c'est un angle non tranché dans les sources. La Cour (2023) le traite comme un facteur de coût de la vie, sans chiffrer l'effet sur les prix. L'inférence de la section 2.4 suggère qu'il pèse surtout sur les services et le logement. ⚠️ Le sujet mérite une étude dédiée.

---

## 6. Sources (cote de fiabilité et conflits d'intérêts)

Pages : numérotation du PDF lu, sauf mention. Cotes : A statistique publique, texte officiel, publication à comité ; B institution reconnue, rapport parlementaire, organisme international, accord public ; C presse, think tank, rapport d'acteur ; D communication commerciale ou militante, blog.

| # | Source | Cote | Date | Lien | Conflits d'intérêts / orientation | Statut de lecture |
|---|---|---|---|---|---|---|
| 1 | Insee, *Insee Première* n° 1958, comparaison spatiale des prix 2022 | A | juillet 2023 | https://insee.fr/fr/statistiques/fichier/7648939/ip1958.pdf (copie : `donnees/outre-mer/insee-ip1958-comparaison-prix-2022.pdf`) | Aucun | Lu |
| 2 | Insee Analyses Martinique n° 79 (consommation et importations 2024) | A | sept. 2025 | https://www.insee.fr/fr/statistiques/8649134 | Aucun | Lu (figure 1 par WebFetch) |
| 3 | Insee Conjoncture Réunion n° 38, *Commerce extérieur* | A | juillet 2025 | https://www.insee.fr/fr/statistiques/8596099 | Aucun | Lu (figure 1 par WebFetch) |
| 4 | IEDOM, *Rapport annuel économique 2024, La Réunion* | B | 2025 | https://www.iedom.fr/IMG/pdf/rapport_annuel_2024.pdf (copie : `donnees/outre-mer/iedom-rapport-annuel-2024.pdf`) | Banque centrale déléguée (Banque de France) ; aucun conflit | Lu (p. 35 du PDF, p. 33 imprimée ; p. 50 du PDF, p. 48 imprimée) |
| 5 | IEDOM, synthèse économique Guadeloupe 2024 | B | avr. 2025 | https://www.iedom.fr/IMG/pdf/gp_-_synthese_economique_2024_vf.pdf (copie locale) | Aucun | Lu (texte seulement, graphiques non lus) |
| 6 | Cour des comptes, *L'octroi de mer*, rapport public thématique | A | mars 2024 | https://www.vie-publique.fr/rapport/293335 (copie : `donnees/outre-mer/cour-comptes-octroi-de-mer-2024.pdf`) | Aucun ; cite un modèle EGC du DGOM non communiqué à la Cour | Lu (pp. 11-12, 14-15, 18, 50, 52, 60, 98-99) |
| 7 | Cour des comptes, référé S2023-0689 sur les compléments de rémunération outre-mer | A | 8 juin 2023 | ccomptes.fr (à citer) ; copie : https://www.karibinfo.com/wp-content/uploads/2023/09/20230912-refere-S2023-0689-Complements-remuneration-fonctionnaires-outre-mer.pdf | Aucun | Lu (copie ; ⚠️ vérifier la version officielle) |
| 8 | Autorité de la concurrence, avis n° 19-A-12 (fonctionnement de la concurrence en outre-mer) | A | 4 juil. 2019 | https://www.autoritedelaconcurrence.fr/sites/default/files/integral_texts/2019-08/19a12.pdf (copie : `donnees/outre-mer/ac-avis-19-a-12.pdf`) | Auditions d'entreprises (anonymisées dans l'avis) | Lu (§32-36, 305-306, 483-485) |
| 9 | Autorité de la concurrence, avis n° 26-A-01 (marges des grossistes-importateurs et distributeurs, Martinique) | A | 10 févr. 2026 | https://www.autoritedelaconcurrence.fr/sites/default/files/integral_texts/2026-02/avis_26-A-01_compressed.pdf (copie : `donnees/outre-mer/ac-avis-26-a-01-marges-martinique.pdf`) | Saisine du gouvernement (2025) ; auditions d'entreprises actives en Martinique | Lu (résumé, pp. 2-9) |
| 10 | Assemblée nationale, rapport n° 1549 de la commission d'enquête sur le coût de la vie dans les collectivités des articles 73 et 74 (président : M. Vuilletet ; rapporteur : M. Hajjar) | B | enregistré 20 juil. 2023 | https://www.assemblee-nationale.fr/dyn/16/rapports/cecvom/l16b1549_rapport-enquete.pdf (copie : `donnees/outre-mer/an-rapport-1549-vie-chere.pdf`) | Contributions de groupes politiques partisanes (divergence sur la surrémunération) ; données d'entreprises intégrées | Lu par extraits (pp. 54-55, 68, 103-105, 110-116, 218-221, 316, 318, 321, 363, 379-384) |
| 11 | Protocole d'objectifs et de moyens de lutte contre la vie chère (Martinique), signé le 16 octobre 2024 | B | 16 oct. 2024 | https://www.martinique.gouv.fr (copie : `donnees/outre-mer/protocole-martinique-16-10-2024.pdf`) | Signataires intéressés (distributeurs, armateur) ; chiffres repris des parties | Lu en entier |
| 12 | Décision (UE) 2021/991 du Conseil, octroi de mer | A | 7 juin 2021 | https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32021D0991 | Aucun | Lu (art. 1 à 5) |
| 13 | Traité sur le fonctionnement de l'UE, article 349 | A | — | https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:12012E349 | Aucun | Lu (premier et troisième alinéas) |
| 14 | Conseil d'État, fiche sur la décision n° 512989 (21/10/2026) | A | 21 oct. 2026 | https://www.conseil-etat.fr/fr/arianeweb/CE/analyse/2026-10-21/512989 | Aucun | Non lu (résumé de recherche seulement) ⚠️ |
| 15 | Ferdi (A.-M. Geourjon, B. Laporte), *Impact économique de l'octroi de mer* | C | juin 2020 | non lu (cité par la Cour) | Fondation de recherche ; financement non vérifié ⚠️ | Non lu |
| 16 | Mathouraparsad, *Revue économique* 67(4), 2016 | B | 2016 | cité par la Cour | Revue à comité de lecture | Non lu |
| 17 | Hoarau, *Géographie, économie, société* 2021/3 (vie chère et vulnérabilité structurelle) | B | 2021 | https://www.cairn.info/revue-geographie-economie-societe-2021-3-page-303.htm | Aucun connu | Cité par le rapport AN ; non lu |
| 18 | Données d'un armateur (fret, prix publics), reprises par le rapport AN | C | 2023 | via le rapport AN, pp. 104-105 | Intérêt direct de l'entreprise | Non recoupé ⚠️ |
| 19 | Aide au fret (chiffres 2019 du Sénat ; amendements de loi de finances 2024 et 2026) | B / C | 2019-2026 | via le rapport AN p. 113 et amendements AN | Amendements parlementaires : non exécutés ; Sénat 2019 non lu | Non lu ⚠️ |
| 20 | Presse spécialisée (Outremers 360, LCP, Acteurs publics, Maire-info, Weka, Le Courrier de l'Atlas) | C | 2023-2026 | pointeurs seulement | Orientation variable | Utilisée pour repérer les documents, jamais pour un chiffre |

---

## 7. Points à vérifier (⚠️)

Ces points sont à reporter dans `verifications.md` (non modifié ici, pour ne pas toucher au registre commun).

1. Consommation des ménages de la Guadeloupe, de la Guyane et de Mayotte (non publiée dans les sources lues) et population 2022 (hypothèse ; Insee RP 2022 à citer).
2. Importations de biens non durables de la Guadeloupe, de la Guyane et de Mayotte en 2024 : à extraire des statistiques départementales de la douane (open data). Sans elles, le total des cinq territoires reste une estimation.
3. Martinique : l'importation totale de 3 484 M€ inclut les services (Insee) ; la base des non durables est donc surestimée d'autant.
4. Écart d'année : consommation de La Réunion en 2022 et importations en 2024 ; consommation de la Martinique en 2024.
5. Part de 67 % des frais d'approche dans l'écart de prix (Protocole) : base de calcul inconnue.
6. Taux de fret sur le coût d'achat : 50 % (AdC 2019) et 52 % (rapport AN, 2017) ; la base diffère de celle de la BAF.
7. Part de marché de l'armateur (62, 64, 84 %) : contribution du groupe Renaissance, source d'origine non identifiée.
8. Prix du 40 pieds doublé contre coûts +28/29 % : données de l'entreprise non recoupées.
9. Aide au fret : chiffres de 2019 (4,2 et 22,1 M€, Sénat) ; dotations 2024 et 2026 (amendements) ; RAP 2024 à consulter.
10. Droite continuité territoriale (187 M€) : année et périmètre à préciser.
11. Coût de 1 511 M€ (référé 2023) et de 1,178 Md€ (2012, Cour 2015) : vérifier sur ccomptes.fr, et lire le rapport de 2015.
12. Article L410-2 du code de commerce et décision du Conseil d'État n° 512989 : texte à lire sur Légifrance (accès refusé pour l'instant) ; loi n° 2012-1270 : numéro à confirmer au Journal officiel.
13. Bilan préfectoral du Protocole (juillet 2026) : à retrouver dans le texte officiel.
14. Compatibilité d'une aide au fret ou d'une compensation avec les règles d'aides d'État : non vérifiée.
15. Rapport d'évaluation de la décision 2021/991 (dû au 30/09/2025) : non lu.
16. Effet sur les prix de la compensation des compléments de rémunération : non chiffré dans les sources lues.

## 8. Ce qui manque pour finaliser

- Extraire les importations par territoire de la douane (statistiques du commerce extérieur départementales), puis remplacer la base estimée de la section 4.1.
- Lire le référé de la Cour sur ccomptes.fr et le rapport de la Cour de 2015 sur les rémunérations.
- Faire le calcul de répercussion (frais d'approche contre écart) avec les données de l'avis 26-A-01, plutôt que la comparaison de pourcentages de bases différentes.
- Consulter le rapport d'évaluation de la décision 2021/991 pour le cadre européen à partir de 2028.
