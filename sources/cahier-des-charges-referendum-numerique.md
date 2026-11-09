# Cahier des charges : preuve de concept open source et auditable du référendum numérique

*Tâche T54, demande de l'auteur du 02/11/2026. Consulté le 02/11/2026 sauf mention contraire. Passe de vérification aux sources primaires du 02/11/2026 (V3260 à V3301) : corrections signalées dans le texte (notification eIDAS du 09/09/2024, incidents de 2022 avec annulations, 50,2 M d'inscrits, 11,67 M de comptes ANTS, Springall 2014 et non 2024). Les points non lus à la source primaire, non confirmés ou donnés de mémoire sont marqués ⚠️ et numérotés V3260 et suivants dans `verifications.md`. Ce document prolonge `recherche-basculement-constitutionnel.md` (T53) et `recherche-systeme-institutionnel.md` (T52).*

Légende : **[Fait]** sourcé ; **[Étude]** recherche ; **[Estimation]** avec méthode ; **[Opinion de Claude]**.

Limite de méthode, à lire d'abord : la recherche a été faite par recherche web et lecture partielle. Une seule source officielle a été lue en entier (la page de la CNIL sur sa recommandation) ; le reste vient de résumés, de pages secondaires ou de la mémoire de Claude, et est marqué ⚠️. Ce cahier des charges est une base de travail, pas une expertise.

---

## 0. En bref

1. **L'identité est le maillon le plus avancé, et ce n'est pas le plus dur.** France Identité (CNIe + puce + application) est notifiée au niveau eIDAS « élevé » (09/09/2024, V3260 corrigé) et FranceConnect+ la relie à des services. Mais prouver qui on est ne règle pas le vote : le difficile est de **séparer l'identité du bulletin** et de rendre le vote **libre** hors d'un isoloir.
2. **Le consensus des spécialistes est défavorable au vote en ligne pour les scrutins politiques**, et la CNIL reste « très réservée » (recommandation du 19/03/2026, lue, V3261 : elle range expressément les **référendums** parmi les scrutins politiques). Les précédents (Estonie, Suisse, Français de l'étranger) montrent des systèmes utilisables mais contestés, jamais « prouvés sûrs ».
3. **Recommandation de Claude : une preuve de concept en trois modes, dans cet ordre.** (a) **consultatif, à domicile, vérifiable de bout en bout** (Belenios), entre volontaires, pour prouver la technique et ouvrir l'audit ; (b) **borne supervisée en mairie** avec trace papier, pour traiter la contrainte et l'achat de voix (idée de l'auteur, § 4.6) ; (c) le vote à domicile contraignant n'est **pas** proposé aujourd'hui (§ 5).
4. **Brique d'éligibilité possible : un logiciel de l'entreprise de logiciel où travaille l'auteur**, en lecture de puce et comparaison du visage sur l'appareil (§ 1.5), à condition de déclarer le conflit d'intérêts et d'ouvrir le code de cette brique (§ 1.6).
5. **Organe de contrôle et critère de réussite** : l'objectif de l'auteur (au moins aussi sûr que le papier) est testable ligne par ligne (§ 6) ; deux lignes résistent (échelle d'une fraude, liberté à domicile) et doivent être mesurées, non affirmées. Un organe de contrôle indépendant à clés partagées (§ 4.9) est la réponse structurelle.
6. **Ordre de grandeur [Estimation]** : un prototype fonctionnel par 2 ou 3 développeurs avec l'IA en 4 à 6 mois ; un audit sérieux, une prime aux failles et la conformité juridique exigent des tiers et coûtent de l'ordre de 150 000 à 500 000 € (§ 4.8, hypothèses explicites). Une preuve « crédible » dure plus d'un an, pas quelques semaines.

---

## 1. Identité

### 1.1 Ce qui existe [Fait]

- **Carte nationale d'identité électronique (CNIe)** : carte au format carte bancaire avec puce contenant l'état civil et la photographie, généralisée à toute la France le 02/08/2021 (V3262, en partie confirmé ; le standard ICAO 9303 de la puce n'est pas confirmé ⚠️).
- **Application France Identité** : lecture de la puce par NFC, justificatif d'identité sur le téléphone ; le niveau le plus élevé exige la CNIe, l'application et une **vérification de l'identité en mairie** (« certification »)[^ai-presse]. Adoption modeste : 2 millions d'utilisateurs en mai 2025 puis **4 millions au 27/03/2026** (annonce du ministère de l'Intérieur, relayée ; V3263) ; au lancement, 4 467 identités certifiées au niveau le plus élevé sur 525 000 utilisateurs actifs[^ai-presse]. Objectif de France Titres : 2,4 millions d'utilisateurs (contrat d'objectifs 2024-2026)[^ai-presse].
- **Niveaux eIDAS** : France Identité est certifiée au niveau « élevé » par l'ANSSI en février 2024, puis **notifiée à la Commission le 09/09/2024** (communiqué de France Titres, V3260 : le « 03/12/2024 » du blog d'un fournisseur[^didit] était faux). FranceConnect+ délivre le niveau de son fournisseur d'identité : substantiel pour La Poste, élevé pour France Identité[^didit]. Le ministère de l'Intérieur annonce l'intégration de France Identité dans FranceConnect[^interieur] (page du ministère non lue : refus 403 ; le fait est confirmé par la documentation DINUM, V3264).
- **Conditions d'accès d'un service tiers** : les moyens d'identification français sont utilisables via FranceConnect après contractualisation avec un fournisseur d'identité de niveau substantiel et inscription auprès de la DINUM[^esante]. Le détail est confirmé à la documentation DINUM (V3265, https://docs.partenaires.franceconnect.gouv.fr/fs/devenir-fs/pilotage-eligibilite/) : cadre de l'arrêté du 8 novembre 2018 ; habilitation par **DataPass**, puis bac à sable, qualification et mise en production ; **toute administration ou organisme public** est éligible, mais une **entreprise ou association privée** ne l'est que pour le changement d'adresse ou si un texte impose explicitement de vérifier l'identité de **ses propres** utilisateurs ; FranceConnect+ vise les données et fichiers sensibles, avec analyse de risques. **Conséquence** : un projet privé ou de campagne (entreprise, association) n'y a **pas** accès faute d'obligation légale ; un service de l'État ou d'une collectivité, si.
- **Règlement (UE) 2024/1183** (portefeuille européen d'identité numérique, échéance fin 2026) : déjà noté en T53 ⚠️ V3246 ; il rendrait à terme le portefeuille utilisable comme moyen d'authentification dans toute l'UE.

### 1.2 Ce que l'identité ne fait pas [Opinion de Claude, raisonnement]

- Elle prouve « cette personne est Camille Martin » ; elle ne prouve pas « Camille Martin est inscrite sur la liste électorale de telle commune », ni « il vote librement », ni « son téléphone n'est pas compromis ».
- FranceConnect est une **fédération** : le fournisseur sait vers quel service la personne se connecte. Si le même canal sert à voter, l'État saurait *qui a voté* (pas *quoi*), ce qui est déjà un risque (abstention fichée) et facilite des preuves de participation forcée. À éviter par conception (§ 1.4).

### 1.3 Ce qui reste à faire pour l'éligibilité

- **Lien avec les listes électorales** : le **répertoire électoral unique (REU)** est tenu par l'Insee (code électoral, art. L. 16 issu de la loi n° 2016-1048 du 01/08/2016 : « répertoire électoral unique et permanent » tenu par l'Insee, V3266 confirmé ; année de mise en service à relire). Il faut une interface « le titulaire de cette identité est-il électeur, dans quel scrutin » sans exposer le répertoire. Accès réservé aux administrations ; pour une preuve de concept privée, **non accessible** : on simule (liste de volontaires déclarés).
- **Une personne, un droit de vote** : conserver une empreinte irréversible de l'identité (par exemple un hachage salé du numéro de titre) pour interdire un second retrait de droit de vote, sans conserver de lien avec le bulletin.
- **Inclusion** : une part des électeurs n'a ni CNIe, ni smartphone récent, ni aisance numérique ; chemin sans biométrie obligatoire (revue humaine, mairie), comme dans la brique du § 1.5, avec RGPD art. 9 en tête (consentement libre à un traitement biométrique).

### 1.4 Séparer l'identité du bulletin : architecture proposée

Principe : **deux mondes qui ne se parlent que par un jeton anonyme.**

1. **Monde A, éligibilité** : l'électeur prouve son identité (France Identité/FranceConnect+, ou lecture de puce autonome, § 1.5), le serveur vérifie qu'il est inscrit et qu'il n'a pas déjà retiré son droit.
2. **Émission d'un droit de vote anonyme** : le serveur signe **à l'aveugle** un justificatif que l'électeur a lui-même généré (signature aveugle RSA, ou justificatif anonyme moderne de type BBS+ ou jeton de type Privacy Pass ⚠️ V3267 : choix de la primitive à valider avec des cryptographes). Le serveur certifie « un électeur éligible a demandé un droit » sans voir le justificatif.
3. **Monde B, scrutin** : l'électeur dépose son bulletin chiffré, signé avec le justificatif anonyme, via Belenios ou ElectionGuard. L'urne vérifie la validité du justificatif, jamais l'identité.
4. **Limites à traiter explicitement** :
   - *Corrélation par le temps et le réseau* : si l'émission du droit et le dépôt du bulletin ont lieu à quelques secondes d'intervalle depuis la même adresse IP, l'anonymat tombe. Mesures : fenêtre d'émission distincte de la fenêtre de vote, aucune journalisation d'adresses, passage par relais ou réseau d'anonymisation pour le dépôt.
   - *Bourrage par l'émetteur* : l'autorité qui émet les droits pourrait en émettre pour des électeurs fictifs. Mesure : publier le nombre de droits émis, la liste (anonymisée par empreinte) de ceux qui les ont retirés, et vérifier publiquement que bulletins ≤ droits retirés ≤ inscrits.
   - *Belenios fonctionne déjà avec un justificatif de vote* : chaque électeur reçoit un code de vote, et la sécurité repose sur au moins une personne honnête qui effectue les vérifications[^belenios]. La signature aveugle à l'émission est une **adaptation** à développer et à faire auditer (⚠️ V3268 : non vérifié que Belenios l'admet sans modification).

### 1.5 Brique « éligibilité » possible : un logiciel de l'entreprise de l'auteur

Base proposée par l'auteur ; description des principes d'après ses indications et la lecture de l'arborescence du logiciel (modules de lecture de pièce d'identité et de contrôle du visage) ; **aucun code recopié**, aucune relecture de sécurité faite par Claude (⚠️ V3269).

| Étape | Principe |
|---|---|
| Lecture de la bande MRZ | Champs lus par caméra, **clés de contrôle vérifiées** (détection d'erreurs de lecture) |
| Lecture de la puce (NFC) | Passeport, CNIe, titre de séjour ; accès par **BAC ou PACE** avec une clé tirée de la MRZ, ou le **CAN** imprimé sur la carte |
| Authenticité | Les données (DG1) sont **signées par l'État** (objet SOD) ; la signature est **vérifiée côté serveur** contre les certificats des États émetteurs ; « **la puce fait foi** » sur la lecture optique |
| Visage | Comparaison **sur l'appareil** avec la photo de la puce ; **test de présence par défi** ; clé de l'appareil **attestée** (Apple/Google) |
| Minimisation | Seul un **jeton signé** part au serveur (résultat, score, version, défi, empreinte de la photo de la puce) ; **jamais d'image ni de gabarit** biométrique ; liste fermée de messages, garde testée |

Avantages : déjà écrit, compatible avec la CNIe, pas de dépendance à l'habilitation FranceConnect+, biométrie qui ne quitte pas le téléphone (cohérent avec le RGPD).

Limites [Opinion de Claude] : (1) **le téléphone est la cible** : un téléphone compromis peut falsifier la comparaison du visage ou l'attestation ; l'attestation Apple/Google déplace la confiance vers ces entreprises (dépendance extra-européenne, point à nommer dans un manifeste souverainiste) ; (2) un score de comparaison faciale est probabiliste : prévoir taux de faux rejets et de fausses acceptations mesurés, et un recours humain ; (3) la lecture de puce prouve la possession physique de la carte, **pas** le consentement (cf. coercition, § 2.2) ; (4) la validation des certificats d'États émetteurs suppose de tenir à jour une liste de confiance (⚠️ V3270, détail de la source officielle à établir : listes maîtresses de l'OACI et de l'ANTS).

### 1.6 Conflit d'intérêts à déclarer [Fait + Opinion de Claude]

Utiliser une technologie de l'entreprise de logiciel où travaille l'auteur dans une plateforme d'État qu'il promeut est un **intérêt à déclarer** (cf. la charte de travail (CONTRIBUTING.md), « Conflits d'intérêts à déclarer »). Deux issues cohérentes avec le projet : **(a)** publier le code de cette brique sous licence libre, comme bien commun, en cohérence avec l'idée de don ; **(b)** à défaut, ne pas en faire un composant obligatoire, et prévoir une brique alternative (France Identité/FranceConnect+). Pour la crédibilité, la voie (a) vaut mieux : un auditeur doit pouvoir lire le code qui décide de l'éligibilité. Condition supplémentaire : aucun avantage commercial futur (contrat, licence payante) ne doit découler de la preuve de concept ; à écrire dans la charte du projet.

---

## 2. Exigences d'un scrutin

### 2.1 Les propriétés

| Exigence | Sens | Difficulté en ligne |
|---|---|---|
| **Secret** | Nul ne peut savoir pour qui j'ai voté, moi-même compris (pas de preuve de mon vote transmissible) | Élevée : le terminal de l'électeur voit le vote |
| **Liberté** | Aucune contrainte, aucun achat de voix | **La plus difficile** hors isoloir |
| **Sincérité** | Un électeur éligible, une voix, comptée comme exprimée | Moyenne à élevée |
| **Vérifiabilité individuelle** | Je peux vérifier que mon bulletin est dans l'urne comme exprimé | Moyenne ; conflit avec le secret |
| **Vérifiabilité universelle** | Chacun peut vérifier que le décompte est correct à partir de l'urne | Faisable par cryptographie |
| **Anonymat du dépouillement** | Le décompte ne relie pas bulletin et électeur | Chiffrement homomorphe ou réseaux de mélange |
| **Disponibilité** | Le scrutin tient face à une panne ou un déni de service | Élevée : surface d'attaque réseau |
| **Indépendance du logiciel** | Une erreur logicielle non détectée ne peut pas fausser un résultat sans trace (notion de Rivest et Wack, 2006 ⚠️ V3271) | Le papier la satisfait ; le vote en ligne seul non |

[Étude] Le papier a une propriété que le numérique peine à imiter : **un fraudeur doit agir à grande échelle physiquement** (bourrage, falsification), donc il se voit ; un logiciel malveillant agit à l'échelle de millions de bulletins par une seule modification. C'est le cœur de l'objection (§ 5).

### 2.2 Liberté : contrainte et achat de voix à domicile

- **Revote** : l'électeur peut revoter, seul le dernier bulletin compte ; le coercitif ne peut pas s'assurer de la dernière version. Belenios et l'Estonie le prévoient (⚠️ V3272 pour la règle exacte de Belenios). Limite : le coercitif peut confisquer l'identité ou rester présent jusqu'à la clôture.
- **Annulation en personne** : l'Estonie permet de voter ensuite en personne, ce qui annule le vote électronique (⚠️ V3273, de mémoire). Cette règle vaut surtout si le vote en personne reste facile : lien direct avec la borne en mairie (§ 4.6).
- **Votes de leurre** (systèmes dits « résistants à la contrainte », par exemple des travaux de type JCJ/Civitas) : l'électeur dispose d'un justificatif factice qui compte pour du vide ; très complexe, peu déployé ⚠️ V3274.
- **Aucune solution cryptographique complète** n'existe dans un déploiement grand public ; la solution la plus robuste reste **l'isoloir** (surveillé).

### 2.3 Cadre CNIL, ANSSI, Conseil de l'Europe

- **CNIL** : recommandation relative à la sécurité des systèmes de vote par correspondance électronique, délibération n° 2019-053 du 25/04/2019, « cadre de référence » ; elle est actualisée après consultation publique au premier semestre 2025, et la CNIL indique que la version de 2019 reste applicable jusqu'à fin 2026[^cnil]. La nouvelle recommandation, **adoptée le 19/03/2026** (PDF lu, 14 p. ; numéro 2026-045 et publication le 24/04/2026 donnés par une source secondaire seulement ⚠️ V3261), remplace celle de 2019. Au §10, la CNIL « reste très réservée » sur le vote électronique pour les scrutins politiques, **y compris les référendums** (« consulter les électeurs sur des projets de résolutions ou de textes »), et n'admet en France que les Français de l'étranger (législatives, consulaires), auxquels elle applique « a minima » le niveau de risque le plus élevé (niveau 3 : vérifiabilité du dépouillement « y compris par un outil tiers », secret de dépouillement jamais manipulé sur un serveur pouvant relier identité et bulletin, code source côté électeur public ; expertise indépendante à chaque élection). **Conséquence pour le projet** : un référendum en ligne officiel irait à l'encontre de la position de l'autorité de contrôle ; seule une consultation hors du cadre légal (expérimentation, consultation non décisionnelle) est envisageable aujourd'hui.
- **ANSSI** : guide sur le vote par internet pour les élections **non politiques** (ANSSI-PA-118, version 1.0 du 24/04/2026, 151 pages, **lu** : V3275)[^anssi]. Il décline les objectifs de la CNIL (niveaux 1 à 3) en recommandations techniques, traite la vérifiabilité individuelle et universelle, et précise que les élections politiques, **référendums compris**, « nécessitent des mesures de sécurité complémentaires non abordées dans ce guide » : plancher de sécurité, pas checklist suffisante.
- **Conseil de l'Europe** : recommandation CM/Rec(2017)5 sur les normes de vote électronique, adoptée le 14/06/2017 par les Délégués des Ministres, accompagnée de lignes directrices et d'un mémorandum explicatif ; référence internationale du domaine[^coe]. Contenu détaillé (certification, publication du code source, vérifiabilité) de mémoire ⚠️ V3276.
- **Loi et pratique françaises** (partiellement vérifié) :
  - *Machines à voter* : moratoire de 2008 sur de nouvelles machines ; 63 communes (environ 1,5 million d'électeurs) en utilisent encore, sans renouvellement possible[^moratoire] ; rapport sénatorial de 2018 (Deromedi, Détraigne) recommandant de lever le moratoire[^moratoire] ; rapport du Gouvernement au Parlement du 17/12/2021 (loi n° 2021-191)[^moratoire]. **La CNIe et l'ANSSI** : l'ANSSI jugeait que le maintien du moratoire était « sans doute la pire des solutions » (source secondaire).
  - *Français de l'étranger* : vote par internet utilisé aux législatives de 2012 (1er tour : 127 007 électeurs par internet, 57 % des votes ; 2d tour : 117 675, 54 % ; rapport AN n° 2235, V3277 corrigé) ; contestations devant le Conseil constitutionnel (décision n° 2012-4597/4626 AN du 15/02/2013, 4e circonscription, requêtes **rejetées** ; texte lu, V3278 ; pas d'annulation en 1re circonscription) ; **renonciation en 2017** pour les législatives : système non homologuable « en raison de menaces cybernétiques très élevées » et délai de développement trop court (13 mois pour 18 minimum), selon les réponses ministérielles (V3279)[^etranger]. **Incidents de 2022 (V3280 corrigé)** : le Conseil constitutionnel a **annulé** le 20/01/2023 les élections des 2e et 9e circonscriptions des Français de l'étranger parce que seuls 11 % (Argentine) et 38 % (Algérie) des SMS d'identifiants avaient été délivrés, empêchant « plusieurs milliers d'électeurs » de voter au 1er tour. Leçon : la défaillance n'était pas une intrusion mais un maillon d'authentification et d'accessibilité ; le vote à l'urne restait possible, et cela n'a pas suffi. En France, le revote est exclu pour ce scrutin (art. R. 176-3-9 : l'enregistrement du vote « le rend définitif »).
  - *Élections professionnelles* : le vote électronique est courant (arrêté du 24/04/2026, JORF du 13/05/2026, limité aux personnels des ministères de l'éducation nationale, de l'enseignement supérieur, de la recherche, de la jeunesse et des sports, pour les élections du 3 au 10/12/2026 ; lu, V3281 corrigé : il ne vaut pas pour toute la fonction publique), soumis à la recommandation de la CNIL.

---

## 3. État de l'art et précédents

### 3.1 Systèmes et recherche

- **Helios** (Adida, 2008, USENIX Security ⚠️ V3282) : vote en ligne vérifiable de bout en bout, pour scrutins à faible enjeu, à l'origine de nombreux dérivés.
- **Belenios** (Inria, CNRS, Loria ; développeurs principaux Véronique Cortier, Pierrick Gaudry, Stéphane Glondu) : logiciel libre, vérifiabilité de bout en bout, secret du vote, chiffrement homomorphe et réseaux de mélange pour d'autres modes de scrutin ; preuves formelles de confidentialité et de vérifiabilité (CSF 2018)[^belenios]. **Les développeurs écrivent eux-mêmes que le logiciel ne convient pas aux élections politiques**, le vote en ligne étant assimilable à un vote par correspondance ; un chercheur cité place le point faible dans l'ordinateur de l'électeur[^belenios].
- **ElectionGuard** (Microsoft, Josh Benaloh) : kit libre de chiffrement homomorphe et de vérifiabilité, conçu pour s'ajouter à des systèmes classiques (y compris papier) ; Galois précise ne plus travailler dessus pour Microsoft, le code restant public[^eg].
- **Estonie** : vote par internet depuis 2005, avec carte d'identité à puce et revote ; 51,1 % des votants en 2023 (313 514 i-électeurs sur 613 801), 41,7 % aux européennes de 2024, mais seulement 5,5 % des i-votes vérifiés par l'électeur en 2023 (valimised.ee, V3283 confirmé). **Springall et al. (CCS 2014)** : analyse de sécurité, observation du scrutin municipal de 2013, revue de code et tests adverses ; conclusion que l'architecture et les procédures laissent des failles, avec la recommandation d'arrêter le système[^springall]. L'Estonie a depuis fait évoluer son système (application avec empreinte en juin 2024, authentification Smart-ID et cryptographie sur courbes elliptiques pour les municipales 2025) ; des attaques restent jugées possibles par des chercheurs, tandis que l'autorité électorale classe les risques restants comme faibles[^estonie-ssa]. Le groupe de Springall, Halderman et al. a demandé l'arrêt avant les européennes de **2014** (pas 2024 : aucun appel de 2024 trouvé, V3284) ; l'autorité électorale a refusé.
- **Suisse** : test d'intrusion public de La Poste du 25/02 au 24/03/2019 (173 constats, 16 confirmés, pas de vote manipulé) ; mais des chercheurs (Lewis, Teague, Pereira) ont trouvé **trois failles critiques dans le code source** avant le test, dont une affectant aussi le système de vérification individuelle utilisé par plusieurs cantons depuis 2016 ; suspension du système, puis de l'inscription du vote électronique dans la loi[^suisse19]. Reprise : autorisation du Conseil fédéral le 03/03/2023 pour Bâle-Ville, Saint-Gall et Thurgovie ; premier scrutin le 18/06/2023 ; élections nationales d'octobre 2023 avec vérifiabilité complète ; Grisons ajoutés en novembre 2023[^suisse23]. Enseignement : **le code public a permis aux chercheurs de trouver ce que le test d'intrusion n'avait pas vu**, et la reprise a duré quatre ans avec expertises indépendantes.
- **Pays-Bas** : les ordinateurs de vote Nedap sont déclassés le 01/10/2007 par le tribunal d'Alkmaar (après l'avis de la commission Korthals Altes du 27/09/2007), le pays revenant au papier en 2008 (V3285, EDRi)[^nl]. **Belgique** : en Flandre, machines Smartmatic imprimant une trace papier insérée dans l'urne ; dysfonctionnement logiciel d'un centre de données lors du décompte d'un scrutin ; pas de source confirmant un abandon[^be] ⚠️ V3286. **Brésil** : urne électronique utilisée à l'échelle nationale depuis la fin des années 1990, sans trace papier vérifiable par l'électeur, combattue de longue date par le TSE lorsqu'on voulait y ajouter un justificatif imprimé (NDI, 2013) ; en 2022 le PL a demandé d'annuler des votes de machines, demande rejetée et sanctionnée (22,9 M R$) par le TSE (V3287, en partie confirmé).
- **Consensus de la recherche** : l'académie américaine des sciences (rapport *Securing the Vote*, 2018) déconseille le vote par internet pour les élections politiques tant qu'aucune technologie connue ne garantit « le secret, la sécurité et la vérifiabilité d'un bulletin marqué transmis par internet » (résumé officiel lu, V3288 ; rapport complet non lu).

### 3.2 Ce que le prototype hérite de ces précédents [Opinion de Claude]

1. Publier le code **avant** le test d'intrusion (leçon suisse). 2. Concevoir pour la vérifiabilité, pas pour la confiance dans le serveur. 3. Garder une alternative papier. 4. Ne pas annoncer « inviolable » : annoncer ce qu'on sait détecter.

---

## 4. Proposition de preuve de concept

### 4.1 Périmètre

- **Objet** : un référendum **consultatif** oui/non entre volontaires, **sans valeur juridique** (pas une élection au sens du code électoral). Cela évite d'engager le droit électoral, mais **pas le RGPD** : analyse d'impact (AIPD) et information des participants obligatoires.
- **Question de test** : sans enjeu partisan (ex. procédure de vote), pour que l'audit ne soit pas pollué par des intérêts de campagne.
- **Taille** : de 1 000 à 20 000 participants, avec une phase de montée en charge simulée à des millions de bulletins fictifs (test de disponibilité).

### 4.2 Architecture minimale (choix argumentés)

| Brique | Choix proposé | Raison | Alternative |
|---|---|---|---|
| Protocole de vote | **Belenios** | Libre, vérifiable de bout en bout, preuves formelles, utilisé réellement ; équipe française joignable (Inria) | ElectionGuard (pensé pour le papier et les bornes) |
| Éligibilité | Brique du § 1.5 ou France Identité/FranceConnect+ | Voir § 1.1 et 1.6 | Liste de volontaires avec courriel (niveau minimal) |
| Droit de vote anonyme | Signature aveugle à l'émission | § 1.4 | Générée par l'autorité de crédit de Belenios, séparée du serveur d'urne |
| Urne publique | Journal public en ajout seul, vérifiable par tous | Vérifiabilité universelle | |
| Vérificateurs | **Plusieurs programmes indépendants**, écrits par des tiers | Un seul vérificateur honnête suffit | |
| Dépouillement | Chiffrement homomorphe (oui/non) ; réseau de mélange pour d'autres questions | Anonymat du décompte | |
| Autorités de déchiffrement | **Seuil** : k parmi n détenteurs de clé, d'organisations différentes (CNIL, Inria, association de citoyens, etc.) | Aucun acteur ne peut déchiffrer seul | |
| Hébergement | Infrastructure européenne, déploiement reproductible | Souveraineté, audit | |
| Application | Web (Belenios) + application mobile pour la lecture de puce | | |

**Pourquoi Belenios plutôt que ElectionGuard ?** ElectionGuard est surtout un **kit** à intégrer dans une machine ; Belenios est un **système complet** déjà déployé, ce qui réduit l'effort et le risque d'erreur cryptographique pour une équipe de deux ou trois développeurs. **Contre** : les développeurs de Belenios le déconseillent pour le politique et sa licence et sa gouvernance sont celles d'un projet de recherche ; il faudra contribuer en amont plutôt que forker en silence.

### 4.3 Exigences de transparence

Code source complet (client, serveur, infrastructure), **construction reproductible** (le binaire publié correspond au code publié), modèle de menaces public, journal des décisions, rapport d'audit publié en entier (y compris les failles non corrigées).

### 4.4 Plan d'audit indépendant

1. **Revue cryptographique** du protocole et de l'adaptation (signature aveugle) par une équipe académique indépendante.
2. **Revue de code** par un prestataire différent.
3. **Test d'intrusion** en conditions réelles, après la publication du code (ordre inverse de la Suisse en 2019).
4. **Audit de conformité** CNIL/RGPD (AIPD) et accessibilité (RGAA).
5. **Audit post-scrutin** : vérification publique de l'urne par des vérificateurs tiers.

### 4.5 Prime publique aux failles

Prime publique, ouverte avant le pilote, barème publié, publication coordonnée ; précédent : la Suisse a ouvert une prime lors de ses essais de 2019 et 2022[^suisse19]. Barème proposé [Estimation] : de 500 € (faille mineure) à 20 000-50 000 € (compromission du secret ou de l'intégrité), à ajuster selon le financement.

### 4.6 Mode supervisé : mairies comme points de collecte (idée de l'auteur)

**Principe** : l'électeur se présente en mairie, son identité est vérifiée sur place, il vote dans un isoloir sur une borne ou un poste surveillé, en complément du vote à domicile. Cela règle la contrainte et l'achat de voix à domicile (le secret est physiquement protégé), et permet de garder une trace papier.

**Précédents et leçons**
- *France, machines à voter* : 63 communes, environ 1,5 million d'électeurs, moratoire depuis 2008, matériel vieillissant[^moratoire]. Leçon : on a gelé la technique sans la remplacer ; le moratoire a figé l'insécurité.
- *Pays-Bas* : ordinateurs sans trace papier déclassés[^nl]. Leçon : **sans trace papier, pas de confiance**.
- *Belgique* : machines avec trace papier insérée dans l'urne[^be] ; leçon : l'hybride existe, il reste dépendant de logiciels de décompte (incident de décompte).
- *Brésil* : urne purement électronique (V3287) ; leçon : l'efficacité et la rapidité ne dispensent pas de la trace vérifiable par l'électeur.

**Conception recommandée (hybride)** [Opinion de Claude] : la borne imprime un **bulletin papier lisible** que l'électeur vérifie puis dépose ; elle produit aussi un **chiffrement vérifiable** (reçu cryptographique). Les deux sont comptés séparément, et un **audit statistique** compare un échantillon de papier au décompte électronique. C'est la logique d'ElectionGuard avec bulletins papier[^eg].

**L'argument de l'auteur sur le papier actuel** : la vérification d'identité aux urnes repose sur des assesseurs et une pièce d'identité regardée rapidement ; c'est **vrai** dans les faits (contrôle visuel, sans lecture de puce ; code électoral art. R. 60 : titre d'identité obligatoire dans les communes de 1 000 habitants et plus ; art. L. 73 : deux procurations maximum par mandataire, dont une seule établie en France ; V3289 confirmé). **Réponse honnête** : (1) un contrôle léger est tolérable parce que l'attaque est **peu extensible** (une personne usurpée à la fois, contrôle de l'émargement, signature sur la liste) ; (2) un contrôle numérique fort en mairie est donc **possible et meilleur** (puce lue, comparaison faciale), mais il crée un **fichier** qui n'existe pas dans l'urne papier ; (3) le bon argument n'est pas « le papier est aussi léger donc le numérique peut l'être », mais « on peut faire mieux qu'aujourd'hui sans perdre le secret ». À noter : **les procurations** sont le vrai point faible actuel du vote papier (⚠️ à documenter).

**Comparaison des trois modes** [Opinion de Claude, sur la base des sources de la section 3 ; notation indicative]

| Critère | Urne papier (bureau de vote) | Borne en mairie (hybride avec trace papier) | Vote à domicile (ligne) |
|---|---|---|---|
| Secret | Fort (isoloir, bulletin anonyme) | Fort (isoloir), risque logiciel de la borne atténué par le papier | **Faible** à moyen : terminal de l'électeur, tiers présents |
| Liberté (contrainte, achat) | Forte | Forte | **Faible** : revote partiel seulement |
| Vérifiabilité | Observation du dépouillement par tout citoyen ; pas de vérification individuelle | Vérification individuelle (reçu) **et** universelle (urne publique) + papier | Individuelle et universelle possibles, mais sur un terminal compromis |
| Identité | Légère (assesseurs, pièce) | **Forte** (puce, visage) | Forte seulement si le téléphone n'est pas compromis |
| Disponibilité | Robuste (pas d'électricité requise) | Dépend du courant et des bornes ; repli sur papier | Dépend du réseau et des attaques par déni de service |
| Coût | Élevé en personnel (nombre de bureaux de vote : ordre de grandeur ≈ 70 000 non confirmé ⚠️ V3290) | Équipement et maintenance à prévoir ; moins de personnel de dépouillement | Faible au scrutin, **élevé en audit et sécurité** |
| Accessibilité | Bonne, y compris sans équipement ; difficulté pour les mal-voyants, les personnes éloignées | Bonne si bornes adaptées ; encore un déplacement | **Meilleure** pour les éloignés et handicapés ; **exclut** les sans-équipement |
| Dépouillement | Lent, manuel, observable | Rapide, audité | Immédiat |

### 4.7 Étapes et durée [Estimation]

| Étape | Contenu | Durée |
|---|---|---|
| E0 | Modèle de menaces, charte, déclaration des intérêts, choix des auditeurs | 1 mois |
| E1 | Déploiement de Belenios, vote consultatif interne (équipe, amis) | 1 à 2 mois |
| E2 | Brique d'éligibilité (brique du § 1.5 ou FranceConnect+), signature aveugle, premiers tests | 2 à 3 mois |
| E3 | Publication du code, prime aux failles, audit cryptographique et de code | 3 à 4 mois |
| E4 | Test d'intrusion, correctifs, AIPD, accessibilité | 2 à 3 mois |
| E5 | Pilote consultatif (1 000 à 20 000 volontaires), puis audit public de l'urne | 1 à 2 mois |
| E6 | Borne supervisée : prototype, essai dans une ou deux mairies volontaires | 4 à 6 mois (en parallèle d'E3-E5) |

**Total** : 12 à 18 mois pour le mode à domicile consultatif ; plus pour la borne. L'essai suisse a pris quatre ans entre la suspension et la reprise[^suisse23]. **Conséquence politique** (T53) : si la preuve de concept est une condition de la candidature (position du 02/11), elle doit démarrer **avant** la campagne de 2027, et son calendrier conditionne la date de la candidature plus que l'inverse.

### 4.8 Coûts, ce qu'une petite équipe peut faire, et ce qui exige des tiers

Hypothèses [Estimation, non sourcée, à confirmer par devis] : audit cryptographique et revue de code, 80 000 à 200 000 € ; test d'intrusion, 30 000 à 80 000 € ; prime aux failles, 20 000 à 100 000 € ; avocat et AIPD, 15 000 à 40 000 € ; accessibilité, 10 000 à 30 000 € ; hébergement, 5 000 à 20 000 € par an ; bornes (matériel, 10 à 20 prototypes), 20 000 à 100 000 €. **Total : environ 180 000 à 570 000 €**, hors salaires. Ces chiffres sont des ordres de grandeur sans source.

- **Ce que deux ou trois développeurs avec l'IA peuvent produire** : déploiement et personnalisation de Belenios, applications (web et mobile), brique d'éligibilité, intégration de la signature aveugle (sous réserve de revue), documentation, modèle de menaces, tests automatisés, vérificateur indépendant de référence, site de transparence.
- **Ce qui exige des tiers** : (1) revue cryptographique académique (l'IA et l'auteur ne peuvent pas s'auditer eux-mêmes : même biais) ; (2) test d'intrusion ; (3) juriste et CNIL (AIPD) ; (4) accès DINUM/FranceConnect+ et REU pour un usage officiel, qui ne peut venir que de l'État ; (5) mairies volontaires ; (6) autorités de déchiffrement indépendantes ; (7) certification (voir ci-dessous).
- **Certification** : il n'existe pas, dans les textes lus, de dispositif français de certification du vote par internet pour les scrutins politiques : la CNIL recommande une expertise indépendante (V3291, en partie). Pour les élections professionnelles, la recommandation CNIL prévoit une expertise indépendante[^cnil]. Pistes : certification de sécurité de premier niveau de l'ANSSI (CSPN) ou critères communs pour des composants, après lecture du guide de l'ANSSI (V3275). Le cadre suisse est une référence vérifiée (V3292) : depuis le 01/07/2022, audit indépendant mandaté par la Confédération en remplacement de la certification, code source et documentation publics, bug bounty obligatoire. **Précédent récent** : le 08/03/2026, Bâle-Ville n'a pas pu déchiffrer ni compter **2 048 suffrages électroniques** (clés USB protégées par code NIP mal utilisées, double contrôle défaillant) ; la Chancellerie a jugé le système de La Poste non en cause et a agréé Saint-Gall, les Grisons et la Thurgovie pour le 14/06/2026 (communiqué du 17/04/2026) ; reprise des essais à Lucerne (24/06/2026) et Neuchâtel (02/09/2026).

---

### 4.9 Organe de contrôle séparé de l'État (ajout de l'auteur)

**Idée de l'auteur** : un organe de contrôle indépendant de l'État, avec des citoyens bénévoles techniciens, pour qu'aucun trucage ne soit possible hors attaque très sophistiquée, de l'ordre de celles du papier (fausses cartes, jumeau qui vote à la place de l'autre). Centralisé ou décentralisé : à étudier.

**Ce que la cryptographie permet déjà** [Fait pour Belenios, ⚠️ V3293 pour les détails] : la clé de déchiffrement de l'urne est **répartie par seuil** entre plusieurs « autorités » (k parmi n) ; Belenios appelle ainsi les détenteurs de clé et la sécurité repose sur au moins une personne honnête qui vérifie[^belenios]. Un **tableau d'affichage public** reçoit tous les bulletins chiffrés (journal en ajout seul) ; **n'importe qui** peut recompter à partir de l'urne publique (vérifiabilité universelle) et vérifier les preuves de déchiffrement ; **chaque électeur** peut vérifier la présence de son bulletin.

**Composition proposée** [Opinion de Claude] :
- **Détenteurs de clés (seuil)** : organisations de nature différente, sans intérêt commun : par exemple une autorité administrative indépendante, un organisme de recherche, des partis de bords opposés, des associations, **des citoyens tirés au sort** (précédent : assemblées tirées au sort, T52). Règle : aucune catégorie ne peut atteindre seule le seuil de déchiffrement, ni bloquer seule le dépouillement (seuil de type 5 sur 9, à calibrer).
- **Vérificateurs** : citoyens bénévoles techniciens, **plusieurs logiciels de vérification indépendants** ; le tirage au sort et la rotation évitent la capture.
- **Observateurs** de la cérémonie des clés et des audits (filmée, publique).

**Centralisé ou décentralisé ?** Recommandation : **gouvernance centrale légère, vérification décentralisée**. Le seuil de clés est centralisé par nécessité (cérémonie unique) mais réparti entre acteurs ; la **vérification** doit être ouverte à tous, donc décentralisée. Un organe unique de contrôle, même séparé de l'État, devient une cible de capture ; un contrôle uniquement bénévole se heurte à la fatigue et à la compétence.

**Statut et gouvernance, modèles** (à lire aux sources, non vérifiés ⚠️ V3294) : CNCCFP (Commission nationale des comptes de campagne, autorité administrative indépendante, membres issus du Conseil d'État, de la Cour de cassation et de la Cour des comptes) ; Conseil constitutionnel, juge de la régularité des élections nationales et du référendum (art. 58 et 60 de la Constitution, étudié en T53) ; observateurs citoyens et internationaux. Pour un organe **séparé de l'État** : statut législatif (autorité indépendante), financement garanti hors budget annuel discrétionnaire, mandats non renouvelables, publication intégrale des travaux, contrôle juridictionnel de ses décisions.

**Échelle d'une fraude : papier contre numérique** [Étude, raisonnement] : une fraude papier est **locale et limitée** (un bureau, quelques centaines de voix, observable physiquement) ; une fraude numérique peut être **massive et invisible** (un défaut logiciel, un seul point d'attaque). Le système la rend détectable par : (1) **vérifiabilité de bout en bout** : un bulletin modifié se voit au niveau de l'électeur qui vérifie son reçu ; (2) **audit statistique** de la trace papier (en mode borne) : un échantillon aléatoire de bulletins papier contre le décompte, qui détecte un écart même minime avec une probabilité calculable ; (3) **sondage de vérification** : si une fraction même faible d'électeurs vérifie, une modification à grande échelle est détectée presque sûrement ; (4) **plusieurs vérificateurs indépendants** sur le journal public. **Limite à dire** : la détection suppose qu'assez d'électeurs vérifient réellement, sur un appareil non compromis ; une attaque ciblée (quelques milliers de bulletins) peut passer sous le seuil de détection, comme une fraude papier locale. L'objectif est donc l'**équivalence d'échelle** : rendre la fraude massive au moins aussi détectable qu'une fraude papier, pas la rendre impossible.

### 4.10 Orientation de l'auteur : clusters de certificats, électeur « wallet », comptage public

**(1) Vérifier les certificats d'État par plusieurs « clusters » publics distincts.** Chaque puce contient une signature de l'État émetteur (objet SOD), vérifiable avec la chaîne de certificats (autorité racine nationale dite CSCA, puis signataires de documents). Si un seul serveur tient la liste de confiance, il peut être trompé ou corrompu (certificat injecté). Proposition de l'auteur, que Claude juge **solide** : plusieurs organes publics indépendants (par exemple l'Agence nationale des titres sécurisés, l'ANSSI, une autorité d'un autre État membre, un institut de recherche) tiennent chacun une copie de la liste et **doivent s'accorder** (règle de majorité) pour qu'un certificat soit accepté ; toute divergence est publiée. Point à vérifier : sources officielles de la liste des CSCA (OACI et ANTS) ⚠️ V3270. Limite : cela protège contre un faux certificat, pas contre une carte **authentique** obtenue frauduleusement (fraude documentaire déjà possible sur le papier).

**(2) Électeur anonyme « comme un wallet » : un droit de vote certifié, unique, sans identité.** Expliqué simplement : l'électeur reçoit une « pièce de monnaie électorale » qu'il est le seul à pouvoir dépenser, une fois, sans que la pièce porte son nom. Quatre techniques, du plus simple au plus puissant [Étude, ⚠️ V3295 : descriptions de mémoire, à valider par des cryptographes] :
- **Signature aveugle** (Chaum, 1982) : l'autorité signe un justificatif « sous enveloppe » sans le voir. Simple, éprouvée ; l'unicité vient d'un registre qui retient que cette personne a déjà demandé son justificatif.
- **Justificatifs anonymes** (de type idemix, BBS+) : l'électeur prouve « je détiens un justificatif valide délivré par l'autorité » sans le montrer ni l'identifier ; réutilisables sans lien entre usages.
- **Preuves à divulgation nulle de connaissance** : prouver une propriété (« je suis dans la liste des électeurs ») sans la révéler. Outil de base des deux suivantes.
- **Semaphore et « nullifier »** : un protocole libre où l'électeur prouve son appartenance à un groupe et publie un **nullifier**, une empreinte unique dérivée de sa clé secrète et du scrutin. Si le même électeur vote deux fois, le même nullifier apparaît et le second bulletin est rejeté ; personne ne peut relier le nullifier à une personne. C'est la solution moderne du problème « **unicité sans identité** ». Limite : les implémentations existantes viennent du monde de la blockchain, avec une maturité d'audit variable ; exige un registre des membres (la liste des électeurs éligibles).
Recommandation [Opinion de Claude] : pour la preuve de concept, **signature aveugle** (la plus simple à auditer), avec Semaphore comme piste de recherche ; ne pas innover en cryptographie sans cryptographes.

**(3) Comptage décentralisé et quasi public, « paradigme blockchain ».** Ce qui sert vraiment est un **registre public en ajout seul** (un tableau d'affichage) : chacun peut lire tous les bulletins chiffrés, nul ne peut en retirer ni modifier, chaque ajout est signé et enchaîné par empreintes (arbre de Merkle, journaux de type transparence des certificats). Belenios a déjà un tel « tableau d'affichage » (⚠️ V3293). **Blockchain ou non ?**
- Une chaîne **à preuve de travail** (type Bitcoin) sert à faire s'accorder des inconnus **sans autorité de confiance** ; ici, il existe des autorités identifiées, soumises à un seuil, et le nombre d'électeurs est connu : la preuve de travail **n'apporte rien** et coûte (énergie, lenteur, risque d'attaque à 51 %).
- Une chaîne à **autorisation** (validateurs identifiés) ressemble à un registre répliqué entre autorités indépendantes : utile si l'on veut que **plusieurs organes** tiennent chacun une copie et signent l'état du registre ; on peut obtenir le même effet par un simple journal signé et répliqué, plus simple à auditer.
- Précédent d'alerte : l'application Voatz, présentée comme « sécurisée par la blockchain », a révélé de graves failles (chercheurs du MIT, 2020). Une blockchain n'ajoute **pas** de sécurité au poste de l'électeur, ni au secret, ni à la contrainte.
Recommandation : **registre en ajout seul répliqué chez plusieurs organes indépendants, sans cryptomonnaie ni preuve de travail** ; le mot « blockchain » est inutile dans le manifeste, la propriété utile est « public, en ajout seul, vérifiable par tous ».

**La limite majeure : la « receipt-freeness ».** Un système est **sans reçu** (receipt-free) si l'électeur **ne peut pas prouver** pour qui il a voté ; sinon il peut **vendre** ou se faire **forcer** son vote (preuve à l'appui). Or la **vérifiabilité** (« je vérifie que mon bulletin est bien compté ») pousse vers la preuve ; **secret et vérifiabilité sont en tension** [Étude, ⚠️ V3296 : de mémoire]. Parades :
1. **Revote** : seul le dernier bulletin compte ; le preneur de preuve ne peut pas garantir qu'il n'y en aura pas d'autre. Faible si le coercitif surveille jusqu'à la clôture.
2. **Chiffrement réencryptable** : l'urne rechiffre chaque bulletin (même contenu, nouvel aspect), de sorte que l'électeur ne peut pas prouver quel chiffrement est le sien ; compatible avec un tableau d'affichage, mais demande des protocoles plus complexes et un audit spécialisé.
3. **Vote en mairie** : isoloir surveillé, pas de preuve emportée. C'est la parade **la plus sûre** ; elle justifie le mode supervisé (§ 4.6).
4. **Reçu non transférable** : vérification de bulletin faite sur place, ou « défi » de type Benaloh (l'appareil chiffre, l'électeur peut auditer ou lancer) qui ne livre pas de preuve exploitable du vote réel ⚠️ V3297.
Aucune parade logicielle seule ne suffit à domicile ; c'est la raison de la hiérarchie du § 5.

### 1.7 Qui n'a pas de puce ? La nécessité d'une voie en mairie

[Fait, partiel] La CNIe est délivrée depuis 2021 (V3262) ; depuis le 31/03/2025, tout citoyen peut renouveler gratuitement sa carte avant l'échéance pour obtenir une CNIe[^cnie-renouv], et les anciennes cartes (sans puce lisible) restent valides ; validité : 10 ou 15 ans selon la date de délivrance et l'âge (service-public.gouv.fr), avec une limite européenne de renouvellement des cartes non biométriques au plus tard le **03/08/2031** (Cour des comptes, citant le règlement (UE) 2019/1157 ; V3298 corrigé). L'ANTS évalue à 18-25 millions les anciennes cartes à renouveler d'ici là. Le nombre de CNIe en circulation n'a **pas** été trouvé : à demander à l'ANTS ou au ministère de l'Intérieur (⚠️ V3299). L'adoption de l'application reste faible : 4 millions d'utilisateurs en mars 2026 (V3263), avec 4 467 identités certifiées au niveau élevé au lancement[^ai-presse], loin de l'électorat (**50,2 millions d'inscrits** au 11/02/2026, Insee, V3300 corrigé ; l'ancien « 49 millions » était périmé).

**Quatre groupes sans accès direct** [Estimation de structure, sans chiffres sourcés] : (1) détenteurs d'**anciennes cartes** d'identité (sans puce) ; (2) détenteurs d'une CNIe mais **sans smartphone** ou avec un **téléphone sans NFC**, ou ne sachant pas l'utiliser ; (3) personnes **sans pièce d'identité** valide, ou à l'état civil incertain ; (4) personnes dont la **biométrie échoue** (faux rejets : handicap, âge). À quantifier par sondage et par les données ANTS.

**Conséquence** [Opinion de Claude] : **une voie en mairie est une condition d'existence du système, pas une option** : vérification de l'identité par un agent (comme pour la certification France Identité, qui se fait déjà en mairie), délivrance du droit de vote anonyme sur place, vote sur borne ou papier. Corollaire : ne jamais conditionner le droit de voter à la possession d'un smartphone ; sinon le numérique **exclut** et le système serait moins bon que le papier sur l'accessibilité (§ 6). Autre point à noter (V3301, vérifié en partie) : le portail ants.gouv.fr de France Titres a subi, détecté le 15/04/2026, une extraction de données personnelles de **11,67 millions de comptes** (identifiants, noms, courriels, parfois adresses et téléphones ; ni pièces justificatives ni biométrie selon le ministre délégué à l'Assemblée nationale, mai 2026). Le chiffre de « 18 à 19 millions d'enregistrements » est l'annonce des pirates, reprise par la presse spécialisée, et **non** un chiffre de l'État ; il ne s'agit pas d'une fuite de « documents d'identité ». L'incident pèse néanmoins sur la confiance dans toute base centralisée d'identités, et plaide pour la minimisation (§ 1.5) et le tirage du droit de vote sans identité (§ 4.10).

## 5. Steelman : l'objection et la réponse honnête

### 5.1 L'objection [Étude]

La majorité des spécialistes en sécurité informatique sont hostiles au vote politique par internet. Arguments : (1) l'**ordinateur de l'électeur** est hors contrôle (logiciel malveillant), et un seul défaut peut toucher des millions de bulletins ; (2) la **contrainte à domicile** n'a pas de solution générale ; (3) la **cible** : un scrutin national attire des États, dont les moyens dépassent ceux de tout auditeur ; (4) la **preuve** : un système vérifiable cryptographiquement n'est **compréhensible** que par très peu de personnes, alors qu'un dépouillement papier est observable par n'importe quel citoyen ; la légitimité d'un résultat dépend de la confiance du perdant, pas seulement de sa justesse ; (5) l'**histoire** : Springall et al. (Estonie), les failles suisses de 2019, les arrêts néerlandais, le retrait français de 2017. La CNIL est « très réservée » (V3261, texte lu) ; les développeurs de Belenios, qui défendent le vote en ligne vérifiable, le déconseillent eux-mêmes pour le politique[^belenios].

### 5.2 Réponse honnête [Opinion de Claude]

1. **L'objection est largement fondée**, et un manifeste « écrit pour être vrai » doit le dire sans détour. Le vote **à domicile contraignant** pour un scrutin national n'est pas un objectif défendable aujourd'hui.
2. **Elle ne vaut pas pour tout** : (a) les consultations à faible enjeu (la plateforme d'initiative, les sondages délibératifs) ; (b) le vote **supervisé** en mairie avec trace papier, qui réduit les points 1 et 2 ; (c) le **vote d'initiative et de pétition**, où la tricherie coûte peu mais où l'exclusion par le numérique est un risque réel.
3. **Quand ne pas l'utiliser** : pour toute décision irréversible (révision constitutionnelle, reconduction du président) tant que n'existent pas, publiquement : une vérifiabilité de bout en bout auditée, un mode papier de secours, une solution à la contrainte, et un historique d'au moins plusieurs scrutins à enjeu modéré. Règle déjà posée par l'auteur : aucune décision irréversible si l'infrastructure est compromise.
4. **Ce que la preuve de concept prouve et ne prouve pas** : elle prouve qu'on **sait** construire un système vérifiable et audité ; elle **ne prouve pas** qu'il est sûr contre un État adversaire. Annoncer « preuve de concept d'un système auditable » est honnête ; « preuve de la sûreté du vote en ligne » ne l'est pas.
5. **Risques pour le projet** : (i) un biais pro-technologie peut faire minimiser la contrainte à domicile ; (ii) une preuve de concept servant de **pièce de campagne** crée une pression à la montrer réussie ; la prime aux failles et le rapport d'audit **publié en entier** sont la garantie contre cela ; (iii) le conflit d'intérêts lié à l'entreprise de l'auteur (§ 1.6) ; (iv) une faille publique pendant la campagne coûterait cher politiquement, mais coûterait plus cher encore si elle était trouvée après l'élection.
6. **Posture suggérée** pour le manifeste : « le vote numérique à domicile viendra quand il sera prouvé ; d'ici là, la borne supervisée et le papier restent la règle des décisions irréversibles, et la plateforme décide du reste ».

---

## 6. Conclusion : grille de comparaison avec l'urne papier

Critère de réussite fixé par l'auteur : **prouver que le système est au moins aussi sûr que le vote papier actuel, voire plus**. La grille compare l'urne papier actuelle au **système proposé complet** : borne supervisée avec trace papier, vote à domicile vérifiable, organe de contrôle (§ 4). Verdicts [Opinion de Claude, avant toute preuve : ce sont des **hypothèses à tester**, aucune ligne n'est démontrée].

| Critère | Verdict du système proposé vs papier | Ce qu'il faut pour passer au moins à « égal » |
|---|---|---|
| **Secret** | Borne : **égal** ; domicile : **moins bon** | Domicile : à ne pas utiliser pour des décisions irréversibles, ou isoloir obligatoire ; séparation prouvée identité/bulletin (§ 1.4), audit des fuites par métadonnées |
| **Liberté (contrainte, achat de voix)** | Borne : **égal** ; domicile : **moins bon** | Pas de solution complète à domicile ; revote + annulation en personne facile (§ 2.2) ; en pratique, ne pas compter le domicile comme égal tant que ce n'est pas démontré |
| **Identité** | **Meilleur** (puce, visage, jeton signé) sous réserve | Taux de faux rejets/acceptations mesurés ; chemin sans biométrie ; téléphone non compromis (attestation) ; jumeaux : tests dédiés (le papier est aussi vulnérable) |
| **Intégrité du décompte** | **Meilleur** si la trace papier et l'audit statistique existent ; **moins bon** sans papier | Audit statistique obligatoire de la trace papier ; chiffrement vérifiable ; cérémonie publique de déchiffrement |
| **Vérifiabilité par les citoyens** | **Meilleur** en principe (vérification individuelle et universelle) ; **moins bon** en compréhensibilité | Vérificateurs multiples, interface simple, pédagogie ; mesurer le taux de citoyens qui vérifient réellement |
| **Échelle d'une fraude possible** | **Moins bon** (potentiel de fraude massive invisible) | Détection de bout en bout + audit papier + organe de contrôle (§ 4.9) ; objectif : fraude massive au moins aussi détectable que la fraude papier ; limite assumée pour les attaques ciblées |
| **Accessibilité** | **Meilleur** (éloignés, handicapés) ; **moins bon** pour les sans-équipement | Chemin physique garanti en mairie ; RGAA ; bornes adaptées |
| **Coût** | **Incertain** (moins de dépouillement, plus d'audit et de sécurité) | Étude de coût complète (modèle `modeles/`) avant toute promesse d'économie ; ne pas compter sur des économies au premier scrutin |

**Lecture honnête** : le système **ne peut pas** être déclaré « au moins aussi sûr » sur tous les critères aujourd'hui. Il peut l'être, **dans le mode borne supervisée avec trace papier**, sur le secret, la liberté et l'intégrité, et il peut faire **mieux** sur l'identité et la vérifiabilité. Les deux lignes qui résistent sont **l'échelle d'une fraude** et **la liberté à domicile** : pour elles, la preuve de concept doit produire des **mesures** (taux de détection par simulation d'attaque, taux de vérification par les participants, résultats de la prime aux failles), pas des affirmations. Un test d'arrêt est à fixer **avant** le pilote : par exemple, « si l'audit trouve une faille qui permet de modifier des bulletins sans détection, le mode à domicile est suspendu jusqu'à correction publique ».

---

## Questions ouvertes

1. Faut-il lier le projet à un calendrier de preuve de concept de 12 à 18 mois ?
2. Faut-il ouvrir le code de la brique d'éligibilité en bien commun, ou prévoir une brique alternative ?
3. Le mode supervisé en mairie doit-il être le mode **principal** (avec le domicile en option) plutôt que l'inverse ?
4. Qui seront les autorités de déchiffrement indépendantes, à approcher, et faut-il retenir la gouvernance « centrale légère, vérification décentralisée » (§ 4.9) ?
5. Quel test d'arrêt fixer avant le pilote (§ 6) ?

---

## Synthèse des sources mobilisées

| Source | Ce qu'elle établit | Statut |
|---|---|---|
| CNIL, page de présentation[^cnil] | Délibération 2019-053, mise à jour en cours, applicabilité jusqu'à fin 2026 | **Lue** |
| France Identité, presse et actualités[^ai-presse] | Fonctionnement, niveau le plus élevé via la mairie, chiffres d'adoption | Résumé de recherche (non lue) |
| Didit (blog)[^didit] | Notifications eIDAS (élevé, substantiel) | Secondaire |
| Ministère de l'Intérieur[^interieur] | Intégration de France Identité dans FranceConnect | Non lue (403) |
| eSanté (ANS)[^esante] | Conditions de contractualisation avec FranceConnect | Résumé de recherche |
| ANSSI, guide vote par internet[^anssi] | Existence du guide (151 pages) | Non lu (PDF illisible) |
| Conseil de l'Europe[^coe] | Recommandation CM/Rec(2017)5 | Résumé de recherche |
| Questions parlementaires, Sénat[^moratoire] | Moratoire de 2008, 63 communes, rapports de 2018 et 2021 | Résumé de recherche |
| Public Sénat et autres[^etranger] | Français de l'étranger : 2012, 2017 | Secondaire |
| Belenios (GitHub, Loria, LIMOS)[^belenios] | Propriétés, preuves, limites | Résumé de recherche |
| ElectionGuard (Microsoft, IACR)[^eg] | Kit homomorphe vérifiable, statut | Résumé de recherche |
| Springall et al. 2014[^springall] | Analyse de sécurité de l'Estonie | Résumé de recherche |
| Estonie (RIA, IACR)[^estonie-ssa] | Évolutions 2024-2025 | Résumé de recherche |
| La Poste, Chancellerie suisse, swissinfo[^suisse19][^suisse23] | Test de 2019, suspension, reprise de 2023 | Résumé de recherche |
| NDI, Computerworld[^nl][^be] | Pays-Bas, Belgique | Secondaire |

[^cnie-renouv]: Le Journal du Geek, 16/10/2026, https://www.journaldugeek.com/2026/10/16/vous-pouvez-demander-la-nouvelle-carte-didentite-gratuitement-meme-si-votre-ancienne-est-encore-valable/ ; ministère de l'Intérieur, FAQ nouvelle carte nationale d'identité, https://www.interieur.gouv.fr/actualites/actualites-du-ministere/nouvelle-carte-nationale-didentite/foire-aux-questions-nouvelle ; extraits de recherche, non lus, consultés le 02/11/2026.
[^ai-presse]: Acteurs publics, articles sur France Identité (« 2 millions d'utilisateurs pour France Identité », 2025 ; « 4 467 identités numériques sécurisées actives » ; « Un million d'utilisateurs ») : https://acteurspublics.fr/articles/2-millions-dutilisateurs-pour-france-identite/ ; https://acteurspublics.fr/articles/4-467-identites-numeriques-securisees-actives ; Banque des Territoires, https://www.banquedesterritoires.fr/france-identite-franchit-le-cap-des-4-millions-dutilisateurs (titre vu, **non lu** : le chiffre de 4 millions est postérieur aux 2 millions, ⚠️ V3263), consultés le 02/11/2026.
[^didit]: Didit, « eID verification France » et « FranceConnect+ integration », https://didit.me/blog/franceconnect-plus-integration/ ; blog d'un fournisseur commercial, consulté le 02/11/2026, **source secondaire, date erronée** (03/12/2024) : la notification est du 09/09/2024 selon France Titres, voir « Sources de la passe de vérification » ci-dessous.
[^interieur]: Ministère de l'Intérieur, communiqué « FranceConnect intègre France Identité pour offrir plus de choix et… », https://www.interieur.gouv.fr/actualites/communiques-de-presse/franceconnect-integre-france-identite-pour-offrir-plus-de-choix-et (accès refusé, 403, le 02/11/2026). Voir aussi DINUM, https://numerique.gouv.fr/uploads/CP_FRANCECONNECT%20_INTEGRE_FRANCE_IDENTITE.pdf (non lu).
[^esante]: Agence du numérique en santé, FAQ sur les moyens d'identification de niveau substantiel, https://esante.gouv.fr/faq/quels-sont-les-moyens-didentification-electronique-de-niveau-substantiel-eidas-qui-peuvent-etre-utilises-pour-identifier-un-usager, consulté le 02/11/2026 (extrait de résultat de recherche).
[^cnil]: CNIL, « Vote électronique par correspondance : une nouvelle recommandation en 2026 », 13/11/2025, https://www.cnil.fr/fr/vote-electronique-par-correspondance-une-nouvelle-recommandation-en-2026 (lue le 02/11/2026) ; texte de la recommandation de 2026 : https://www.cnil.fr/sites/default/files/2026-04/recommandation_vote_electronique.pdf (**lu en entier, 14 p.**, adoptée le 19/03/2026, §10 p. 3-4, consulté le 02/11/2026).
[^anssi]: ANSSI, guide sur la sécurité du vote par internet pour les élections non politiques, https://messervices.cyber.gouv.fr/documents-guides/anssi-guide-vote-internet-elections-non-politiques.pdf (**lu en entier** : 151 p., ANSSI-PA-118 v1.0 du 24/04/2026, texte extrait avec pypdf, consulté le 02/11/2026). Projet de guide : https://cyber.gouv.fr/sites/default/files/document/GuideVPI_consultation_publique.pdf (non lu).
[^coe]: Conseil de l'Europe, « Council of Europe adopts new Recommendation on Standards for E-Voting », https://www.coe.int/web/electoral-cooperation/-/council-of-europe-adopts-new-recommendation-on-standards-for-e-voting ; texte : https://rm.coe.int/1680726f6f (non lu), consultés le 02/11/2026.
[^moratoire]: Sénat, question écrite de Laurent Lafon, 19/06/2025, https://www.senat.fr/questions/base/2025/qSEQ25060618S.html ; Sénat, rapport de la commission des lois (Deromedi, Détraigne), 2018, https://www.senat.fr/presse/cp20181024.html ; Assemblée nationale, questions écrites, https://questions.assemblee-nationale.fr/dyn/17/questions/QANR5L17QE2847.pdf ; non lus, résumés par la recherche, consultés le 02/11/2026.
[^etranger]: Public Sénat, « Législatives : pas de vote électronique pour les Français de l'étranger », https://www.publicsenat.fr/actualites/politique/legislatives-pas-de-vote-electronique-pour-les-francais-de-l-etranger-56699 ; Public Sénat, « Le vote électronique, trop vulnérable pour les élections politiques ? », https://www.publicsenat.fr/actualites/politique/le-vote-electronique-trop-vulnerable-pour-les-elections-politiques-57331 ; Clubic, https://www.clubic.com/pro/technologie-et-politique/actualite-499012-legislatives-parti-pirate-demande-annulation-vote-internet.html ; non lus, consultés le 02/11/2026.
[^belenios]: Belenios, dépôt, https://github.com/glondu/belenios ; Loria, https://www.loria.fr/en/2017/04/e-voting-belenios-software-now-available-for-general-public-use/ ; Techniques de l'ingénieur, « Le vote en ligne : les experts en sécurité informatique s'abstiennent », https://www.techniques-ingenieur.fr/actualite/articles/le-vote-en-ligne-les-experts-en-securite-informatique-sabstiennent-110756/amp ; non lus en entier, consultés le 02/11/2026.
[^eg]: Microsoft, « Protecting democratic elections through secure, verifiable voting », 06/05/2019, https://blogs.microsoft.com/on-the-issues/2019/05/06/protecting-democratic-elections-through-secure-verifiable-voting/ ; Benaloh, Naehrig, Pereira, Wallach, IACR ePrint 2024/955, https://eprint.iacr.org/2024/955.pdf ; Free & Fair, https://freeandfair.us/?p=45249 ; non lus, consultés le 02/11/2026.
[^springall]: Springall, Finkenauer, Durumeric, Kitcat, Hursti, MacAlpine, Halderman, « Security Analysis of the Estonian Internet Voting System », ACM CCS 2014, https://estoniaevoting.org/findings/paper/ ; rapport : https://verifiedvoting.org/wp-content/uploads/2020/07/Estonia_2014_IVotingReport.pdf ; non lu (résumé de recherche), consulté le 02/11/2026.
[^estonie-ssa]: Autorité électorale d'Estonie, https://www.valimised.ee/en/internet-voting/frequently-asked-questions/questions-about-reliability-i-voting ; RIA, « I-voting: 20 years of progress », https://ria.ee/en/i-voting-20-years-progress ; IACR ePrint 2025/506, https://eprint.iacr.org/2025/506 ; Euronews, 08/03/2023, https://www.euronews.com/2023/03/08/estonia-election-i-voting-comes-of-age-in-the-worlds-digital-republic-with-record-ballots ; non lus, consultés le 02/11/2026.
[^suisse19]: La Poste suisse, communiqué « Swiss Post temporarily suspends its e-voting system », 2019, https://www.post.ch/en/about-us/media/press-releases/2019/swiss-post-temporarily-suspends-its-e-voting-system ; PortSwigger, https://portswigger.net/daily-swig/swiss-post-puts-e-voting-on-hold-after-researchers-uncover-critical-security-errors ; non lus en entier, consultés le 02/11/2026.
[^suisse23]: Conseil fédéral suisse, https://admin.ch/gov/en/start/documentation/media-releases.msg-id-93455.html ; La Poste, https://www.swisspost.ch/en/about-us/media/press-releases/2023/votes-now-possible-with-swiss-post-s-e-voting-system ; Chancellerie fédérale, https://www.admin.ch/gov/en/start/documentation/media-releases.msg-id-97361.html ; non lus en entier, consultés le 02/11/2026.
[^nl]: NDI, « Netherlands: Decision to End Electronic Voting », https://ndi.org/e-voting-guide/netherlands-CS/decision-to-end-e-voting ; The Register, 01/10/2007, https://www.theregister.co.uk/2007/10/01/dutch_pull_plug_on_evoting/ ; non lus en entier, consultés le 02/11/2026.
[^be]: Computerworld, « Belgian region's decision to use new voting machines reignites e-voting debate », https://www2.computerworld.com.au/article/437317/belgian_region_decision_use_new_voting_machines_reignites_e-voting_debate/ ; Network World, https://www.networkworld.com/article/691782/data-center-software-bug-disrupts-e-vote-count-in-belgian-election.html ; non lus en entier, consultés le 02/11/2026.

## Révision du calendrier et du coût (02/11/2026, objection de l'auteur)
L'auteur objecte que le développement lui-même est rapide avec l'IA (selon son témoignage, environ 60 jours de développement pour un logiciel au périmètre plus large). **Accord sur le développement** : la preuve de concept (identité par la puce, droit de vote anonyme, bulletin chiffré via une bibliothèque éprouvée, tableau public, recomptage) peut être codée en **quelques semaines** (estimation : 4 à 8 semaines), pour un coût de développement faible. **Ce qui ne se compresse pas** : la confiance, qui est le vrai produit d'un système de vote : audit cryptographique indépendant (plusieurs semaines par auditeur, plusieurs auditeurs souhaitables), période de prime aux failles assez longue pour être crédible (quelques mois), démarche de certification (ANSSI) et avis (CNIL), constitution des autorités de déchiffrement, scrutins pilotes consultatifs avec mesure des deux points faibles (ampleur d'une fraude, liberté du vote à domicile). Le calendrier de 12 à 18 mois et le coût de 180 000 à 570 000 € portaient surtout sur ces étapes ; avec un développement rapide, un calendrier de **6 à 12 mois** est plausible, dominé par l'audit et les pilotes ⚠️ (ordres de grandeur non sourcés). Règle de prudence : ne pas inventer de protocole cryptographique, s'appuyer sur des briques publiées et déjà analysées (Belenios, ElectionGuard).

## Sources primaires de la passe de vérification (02/11/2026)

- CNIL, Recommandation relative à la sécurité des systèmes de vote par correspondance électronique, adoptée le 19/03/2026 (14 p., §10 p. 3-4, §35-37 sur l'expertise) : https://www.cnil.fr/sites/default/files/2026-04/recommandation_vote_electronique.pdf
- ANSSI, ANSSI-PA-118, Recommandations pour la mise en œuvre du vote par Internet pour les élections non politiques, v1.0 du 24/04/2026 (151 p.) : https://messervices.cyber.gouv.fr/documents-guides/anssi-guide-vote-internet-elections-non-politiques.pdf
- France Titres / France Identité, notification eIDAS niveau élevé du 09/09/2024 : https://france-identite.gouv.fr/actualite/mie_eleve_eidas.html
- DINUM, documentation partenaires FranceConnect (éligibilité, DataPass, choix FC/FC+) : https://docs.partenaires.franceconnect.gouv.fr/fs/devenir-fs/pilotage-eligibilite/ ; https://docs.partenaires.franceconnect.gouv.fr/fs/devenir-fs/projet-datapass/ ; https://docs.partenaires.franceconnect.gouv.fr/fs/devenir-fs/projet-choix-fc-fc-plus/
- Cour des comptes (Sénat), annexe au rapport n° 413 (2023-2024), La délivrance des titres d'identité et de circulation, p. 45-46 : https://www.senat.fr/rap/r23-413/r23-413-annexe.pdf
- Conseil constitutionnel, décision n° 2012-4597/4626 AN du 15/02/2013 : https://www.conseil-constitutionnel.fr/decision/2013/20124597_4626AN.htm ; communiqué du 20/01/2023 (décisions 2022-5813/5814 AN et 2022-5760 AN) : https://webview-ccfr.sites.prod.conseilconstitutionnel.aquaray.com/sites/default/files/2023-01/2023-01-20-cp.pdf
- Assemblée nationale, rapport n° 2235 (2014), p. 9-10 : https://www.assemblee-nationale.fr/14/pdf/rapports/r2235.pdf ; QE n° 20779 : https://questions.assemblee-nationale.fr/dyn/15/questions/QANR5L15QE20779.pdf ; Sénat, question n° 17085 (réponse du 01/10/2020) : https://www.senat.fr/questions/base/2020/qSEQ200717085.html
- Code électoral (XML Légifrance, codes.droit.org, version du 01/07/2026) : art. L. 16, L. 73, L. 330-13, R. 60, R. 176-3-9 : https://codes.droit.org/payloads/Code%20%C3%A9lectoral.xml
- Insee, électeurs inscrits au 11/02/2026 : https://www.insee.fr/fr/statistiques/2389209 ; Insee Focus 03/2026 : https://www.insee.fr/fr/statistiques/8888278
- Assemblée nationale, QOSD n° 727 (fuite ANTS, JO du 05/05/2026) : https://www.assemblee-nationale.fr/dyn/17/questions/QANR5L17QOSD727 ; QE n° 15644 : https://questions.assemblee-nationale.fr/q17/17-15644QE.htm
- Chancellerie fédérale suisse, rapport explicatif ODP/OVotE du 27/06/2022 : https://www.newsd.admin.ch/newsd/message/attachments/71746.pdf ; communiqués du 17/04/2026 (incident de Bâle-Ville) https://www.admin.ch/fr/newnsb/Py-Tle6KOgfLZ0xglFMEz , du 25/06/2025 https://www.admin.ch/fr/newnsb/ZLw6w1GV_UdJKDocuT0sX , du 24/06/2026 https://www.admin.ch/fr/newnsb/2iAmj7WTEEDAqazAiyeMD , du 02/09/2026 https://www.admin.ch/fr/newnsb/QehXViiFPJAd
- Commission électorale estonienne, statistiques du vote par internet : https://www.valimised.ee/node/1667
- Belenios, FAQ : https://www.belenios.org/faq.html
- National Academies, Securing the Vote (2018), résumé : https://sites.nationalacademies.org/cs/groups/pgasite/documents/webpage/pga_188969.pdf
- Pays-Bas (EDRi, 24/10/2007) : https://edri.org/our-work/edrigramnumber5-20e-voting-machines-netherlands/ ; Brésil (NDI, 2013) : https://ndi.org/e-voting-guide/brazil-CS/debates-over-vvpat ; TSE, 12/2022 : https://www.tse.jus.br/comunicacao/noticias/2022/Dezembro/tse-confirma-multa-de-r-22-9-milhoes-ao-pl-por-litigancia-de-ma-fe
- Sites bloqués par anti-robot (à ouvrir à la main si besoin) : https://www.interieur.gouv.fr/actualites/communiques-de-presse/point-detape-du-21-avril-2026-concernant-lincident-de-securite-relatif-au-portail-antsgouvfr ; https://cyber.gouv.fr/lidentification-electronique ; https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32019R1157 ; https://eidas.ec.europa.eu/efda/notification-page
