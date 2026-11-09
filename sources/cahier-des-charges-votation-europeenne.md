# Cahier des charges : votation européenne non officielle (« ça vous dit, on fait un vote pour savoir ce qu'on voudrait ? »)

*Tâche T57, livrable 4 (décision de l'auteur du 02/11/2026). Écrit le 03/11/2026 ; sources consultées le 03/11/2026. Prolonge `cahier-des-charges-referendum-numerique.md` (T54) et le prototype `prototypes/referendum/` (non audité). Lu à la source primaire via CELLAR (publications.europa.eu, texte intégral en français) : règlement eIDAS 2 (UE) 2024/1183, règlements d'exécution (UE) 2024/2977, 2024/2979 et 2024/2981 (pour leur date seulement), RGPD (UE) 2016/679 (art. 2, 9, 35, 83), règlement ICE (UE) 2019/788, règlement (UE) 2019/1157 (cartes d'identité), règlement (UE) 2024/900 (publicité politique, date), règlement n° 1 de 1958 (langues, version consolidée du 01/07/2013), TUE art. 11 et 16, Eurostat (API, `demo_pjan`, `isoc_sk_dskl_i21`). Tout ce qui n'a pas été lu à la source est marqué ⚠️ et numéroté V4400 et suivants dans `verifications.md`. Aucun chapitre du manifeste n'est rédigé.*

Légende : **[Fait]** sourcé ; **[Étude]** recherche ; **[Estimation]** avec méthode ; **[Opinion de Claude]**.

---

## 0. En bref

1. **Ce qu'on construit** : une consultation **privée, non officielle**, ouverte à tous les Européens, qui demande « ce que vous voudriez » sur quelques propositions. Ce n'est **pas** un référendum (aucun effet juridique) ni une initiative citoyenne européenne (ICE, règlement 2019/788). Le mot « référendum » ne doit pas figurer dans l'interface.
2. **Le maillon identité est en retard sur le calendrier idéal.** Le portefeuille européen d'identité numérique (eIDAS 2) doit être fourni par chaque État **dans les 24 mois suivant l'entrée en vigueur des actes d'exécution**, soit vers le **24/12/2026** (calcul, V4400) ; sa disponibilité réelle dans les 27 reste à constater. Une consultation sérieuse ne peut pas dépendre de lui avant 2027-2028 ; plan en phases (§ 7.3).
3. **Le vote secret et vérifiable se réutilise presque tel quel** (signature aveugle, chiffrement homomorphe, autorités à seuil, vérificateur indépendant), avec des adaptations : plusieurs questions, dépouillement **par pays**, seuil de représentativité par pays, passage à l'échelle, 24 langues.
4. **La double majorité se publie en trois lectures** (brut, projetée par population, nombre de pays), jamais en un seul chiffre, avec la couverture du résultat. Calcul reproductible : `sources/calculs/double_majorite.py`.
5. **Le RGPD est le vrai obstacle juridique** : l'opinion politique est une donnée de l'article 9 ; une analyse d'impact (art. 35) est obligatoire ; un responsable de traitement clair et indépendant du candidat est indispensable.
6. **La meilleure objection est la légitimité** : une consultation en ligne attire des participants autosélectionnés et inégaux selon les pays. La réponse n'est pas de nier le biais, mais de le **mesurer** (comparaison avec un sondage représentatif en parallèle) et de **ne jamais prétendre représenter « les Européens »** (§ 8).
7. **Ordre de grandeur [Estimation]** : avec l'IA, 9 à 15 mois jusqu'à un pilote vérifié dans quelques pays, 300 000 à 900 000 € hors salaires (dominés par l'audit, le juridique, les langues) ; sans IA, 18 à 30 mois ⚠️ (V4411). La confiance, pas le code, fixe le calendrier.

---

## 1. Statut juridique : une consultation privée, pas un référendum

### 1.1 Ce que c'est et ce que ce n'est pas [Fait + Opinion de Claude]

- Les traités n'organisent **aucun référendum à l'échelle de l'Union** ; l'outil de démocratie directe est l'ICE, prévue à l'article 11, paragraphe 4, du TUE : un million de citoyens au moins, « ressortissants d'un nombre significatif d'États membres », peuvent inviter la Commission, « dans le cadre de ses attributions », à soumettre une proposition d'acte juridique « aux fins de l'application des traités »[^tue11]. Une consultation privée n'a donc **aucun fondement ni effet juridique** : elle produit une information politique, rien de plus. (L'absence de tout autre mécanisme référendaire dans les traités vient d'une lecture partielle de l'article 11 ; à confirmer sur l'ensemble des traités.)
- **Conséquence rédactionnelle** : titre « consultation », jamais « référendum », « élection » ou « vote officiel » ; pas de drapeau ni de logo d'institution ; mention permanente « consultation privée, sans valeur légale, organisée par [entité] ». Le risque est la **confusion avec un acte officiel** (usurpation de l'apparence d'une institution), pas la consultation elle-même.

### 1.2 Différences avec l'initiative citoyenne européenne [Fait, règlement 2019/788]

| | Consultation privée (ce cahier) | ICE (règlement 2019/788) |
|---|---|---|
| Nature | Mesure d'opinions, **anonyme** | Déclaration de soutien à une demande, **nominative**, vérifiée par les autorités nationales |
| Effet | Aucun | Communication de la Commission « dans un délai de six mois » après la publication, qui dit **si et pourquoi** elle agit ou non (art. 15, § 2) ; audition au Parlement dans les trois mois (art. 14, § 2) ; **aucune obligation de légiférer** |
| Seuil | Aucun (on mesure) | **Un million** de signataires, dans **au moins un quart des États (7 sur 27)**, avec un minimum par État égal au nombre de députés européens de l'État multiplié par le nombre total de députés (art. 3, § 1) ; chacun compte dans l'État de sa nationalité (art. 3, § 2) |
| Signataires | À définir (§ 2.4) | Âge de voter aux européennes, 16 ans au choix de l'État (art. 2, § 1) |
| Durée | À définir | Collecte de **douze mois** au plus (art. 8, § 1) |
| Objet | Libre | Ce qui peut relever d'un acte juridique de l'Union pour appliquer les traités (art. 11, § 4, TUE) ; la recevabilité de thèmes comme la révision des traités ou un État fédéral n'a pas été lue dans le règlement ⚠️ (V4410) |

**Articulation possible** [Opinion de Claude] : une proposition qui réunit un large soutien dans la consultation peut être ensuite portée **comme ICE** (collecte nominative officielle, avec ses garanties) si son thème est recevable. La consultation sert alors d'étude de marché politique, l'ICE de levier officiel. Ne pas mélanger les deux dans la communication.

### 1.3 Risques juridiques propres à la France ⚠️

Trois sujets de droit français n'ont **pas** été lus et doivent être confiés à un juriste avant toute ouverture (V4407) : (a) la loi du 19/07/1977 sur la publication et la diffusion de certains sondages (une consultation autosélectionnée est-elle un « sondage » ? pas établi) ; (b) le **financement de campagne** : si l'auteur est candidat, les coûts et la diffusion d'un outil qu'il promeut peuvent être regardés comme des dépenses ou des avantages de campagne (Code électoral, plafonnement et comptes de campagne) ; (c) la publicité à caractère politique : le règlement (UE) 2024/900 est **applicable depuis le 10/10/2025** (art. 30, lu), mais son application à la promotion payante d'une consultation n'a pas été analysée (V4408).

**Gouvernance recommandée** [Opinion de Claude] : une **entité distincte du candidat** (association ou fondation de droit d'un État membre, financement transparent, sans financement hors UE), avec un comité de pilotage pluraliste qui rédige les questions et un organe de contrôle séparé (T54 § 4.9). **Le candidat ne contrôle ni les questions, ni les clés, ni les chiffres** ; sans cela, la consultation devient un outil de campagne et perd sa valeur (§ 8.1, instrumentalisation).

### 1.4 Ingérence et manipulation [Étude + Opinion de Claude]

| Risque | Parade | Reste ouvert |
|---|---|---|
| Faux comptes, fermes à bots (attaque Sybil) | Seuls les votes à **identité forte** comptent dans la double majorité ; le « vote ouvert » (sans identité) est compté et publié **à part** | Fausses identités obtenues par un État ou par un fraudeur ; un titre = un droit |
| Mobilisation coordonnée d'un pays ou d'un camp | Publication de la participation par pays ; seuil de représentation ; poids par population | Une campagne massive reste une participation légitime |
| Ingérence étrangère (désinformation autour de la consultation, deepfakes) | Méthode et questions publiées **avant** l'ouverture ; observateurs ; communication sur un domaine unique ; pas d'achat publicitaire ciblé | Désinformation sur les réseaux : hors du contrôle de l'organisateur |
| Contrainte et achat de voix | Revote (parade partielle, T54) ; consultation sans enjeu matériel | Le bulletin n'est pas sans reçu (T54) |
| Divulgation des participants (identité liée au vote) | Séparation identité/bulletin (signature aveugle), aucune journalisation d'adresses | Corrélation temporelle (T54, menace 4) |
| Déni de service | Hébergement redondant, **fenêtre de vote longue** (plusieurs jours) | Non testé à l'échelle |

---

## 2. Identité : qui peut voter, comment le prouver

### 2.1 Ce qui existe [Fait]

**Règlement eIDAS 2 (UE) 2024/1183** (signé le 11/04/2024, publié au JO le 30/04/2024, en vigueur le vingtième jour suivant, soit le **20/05/2024** par calcul)[^eidas2] :

- **Calendrier (art. 5 bis, § 1)** : chaque État « fournit au moins un portefeuille européen d'identité numérique dans un délai de **vingt-quatre mois** à compter de la date d'entrée en vigueur des actes d'exécution » visés. Les règlements d'exécution 2024/2977 (données d'identification personnelle et attestations), 2024/2979 (intégrité et fonctionnalités) et 2024/2981 (certification) sont **parus le 04/12/2024** et entrent en vigueur « le vingtième jour » après publication, soit le **24/12/2024** par calcul[^exec]. **Échéance calculée : vers le 24/12/2026** ⚠️ (V4400 : d'autres actes d'exécution n'ont pas été lus ; l'état réel de déploiement dans les 27 à ce jour n'est pas vérifié).
- **Propriétés utiles à un vote** : niveau de garantie **élevé** (art. 5 bis, § 11) ; **gratuité** de la délivrance, de l'utilisation et de la révocation pour les personnes physiques (§ 13) ; **code source ouvert** des composants installés sur l'appareil (§ 3) ; **pseudonymes** générés et stockés localement (§ 4, point b) ; **divulgation sélective** de données (§ 4) ; garanties contre le **suivi et la corrélation** des transactions, avec des techniques garantissant « l'impossibilité d'établir des liens » (art. 5 bis) ; signature électronique qualifiée gratuite par défaut (§ 5, point g) ; usage **volontaire**, sans désavantage pour qui ne l'utilise pas (§ 15).
- **Acceptation** : les services publics en ligne qui exigent une identification doivent aussi accepter le portefeuille (art. 5 septies, § 1) ; les très grandes plateformes au plus tard 36 mois après les actes d'exécution, à la demande volontaire de l'utilisateur.

**Cartes d'identité à puce, règlement (UE) 2019/1157** (applicable depuis le **02/08/2021**, art. 16)[^cartes] : les cartes portent un support de stockage avec l'image faciale et **deux empreintes digitales** (considérant 18) ; les cartes non conformes cessent d'être valides à leur expiration et **au plus tard le 03/08/2031** (art. 5, § 1) ; celles sans zone de lecture automatique fonctionnelle ou hors normes OACI, **au plus tard le 03/08/2026** (art. 5, § 2, point a). **Limite** : le règlement porte sur l'identité physique et biométrique et n'affecte pas les règles d'eIDAS ni l'usage des cartes avec fonction eID par les États (considérant 15) : la fonction d'identification électronique reste du ressort des États. Quels États délivrent une carte d'identité (le Danemark et l'Irlande sont à vérifier) : ⚠️ V4402.

### 2.2 Options d'identité, de la plus forte à la plus faible [Opinion de Claude]

| Option | Atout | Limite | Lecture |
|---|---|---|---|
| **A. Portefeuille européen (eIDAS 2)** | Un seul standard pour 27 pays, niveau élevé, pseudonymes, divulgation sélective, gratuit, code ouvert | Pas déployé partout avant 2027 ; contenu exact de l'identifiant unique et des attributs (âge, nationalité) non lu (V4401, V4414) | Cible 2027-2028 |
| **B. Schémas nationaux d'eID notifiés** (reconnaissance mutuelle, règlement 910/2014) | Existent déjà dans plusieurs pays | Nombre et niveau de garantie par pays non vérifiés (V4403) ; fédération centralisée qui sait que la personne s'est connectée | Pilote par pays |
| **C. Carte d'identité à puce + application de lecture** (principes de la brique décrite en T54 § 1.5) | Fonctionne sans portefeuille ; cartes biométriques généralisées d'ici 2031 | Lecture NFC et biométrie sur appareil à industrialiser pays par pays ; **conflit d'intérêts de l'auteur** (T54 § 1.6) | Option de repli, à déclarer |
| **D. Agent en voie présentielle** (mairies, consulats, associations) | Inclut les personnes sans smartphone ni puce (T54 § 1.7) | Lourd à l'échelle de 27 pays | Pilotes |
| **E. « Vote ouvert »** (courriel, téléphone) | Participation maximale | Aucune garantie d'unicité : fraude triviale | **Publié à part, jamais dans la double majorité** |

### 2.3 Unicité entre pays : le point dur [Opinion de Claude]

Un vote par personne : dans un État, un titre = un droit (registre d'empreintes, T54). **Entre États**, rien ne relie les 27 registres ; une personne ayant deux nationalités ou deux titres peut en obtenir deux. Parades : (i) **le pays de rattachement se déclare une fois** à l'inscription (nationalité ou résidence, au choix publié) et l'identifiant porte l'État émetteur ; (ii) la fraude restante est **bornée** par le nombre de bi-nationaux, estimé et publié comme incertitude sur le résultat ; (iii) pas de registre central européen des votants (il serait lui-même un risque RGPD). C'est un compromis assumé de consultation, pas de scrutin officiel.

### 2.4 Qui sont « les Européens » ? [Opinion de Claude]

Quatre choix à trancher par le comité de pilotage, **publiés** : (a) citoyens de l'Union (comme l'ICE, art. 2) ou résidents ; (b) âge minimal (16 ou 18 ans : l'ICE retient l'âge de voter aux européennes, 16 ans au choix de l'État) ; (c) les non-Européens (la Suisse, que l'auteur voudrait voir rejoindre : un **registre séparé**) ; (d) les Européens expatriés (rattachement à la nationalité plutôt qu'à la résidence, comme l'ICE, art. 3, § 2).

---

## 3. Vote secret et vérifiable : réutiliser le prototype

### 3.1 Ce que le prototype fournit [Fait, `prototypes/referendum/README.md`]

Signature **aveugle RSA** (RFC 9474) qui sépare l'identité du bulletin ; **ElGamal exponentiel** avec preuve disjonctive 0-ou-1 ; **autorités à seuil** (2 sur 3 dans la démonstration) ; tableau public en ajout seul ; **vérificateur indépendant** qui recompte tout ; 12 tests, démonstration à 100 électeurs. **Prototype non audité**, auto-audit par la même IA (limite principale, README).

### 3.2 Adaptations pour l'échelle européenne [Opinion de Claude, ingénierie à valider]

1. **Plusieurs questions** : une série de questions oui/non indépendantes (chacune son bulletin chiffré) ; les choix multiples ou classements viendront ensuite (preuve « 1 parmi n »).
2. **Dépouillement par pays** : l'agrégat homomorphe est calculé **un par pays et par question** (nécessaire à la double majorité). Effet : le total d'un petit pays peut identifier des votants s'il y a très peu de votes ; règle : **aucun résultat publié pour un pays sous un seuil minimal de votes** (publier « non représenté »).
3. **Autorités de dépouillement à seuil, réparties entre pays** (par exemple 5 sur 9, issues d'universités ou d'institutions de pays différents), pour qu'aucun État, aucun camp ni l'organisateur ne puisse déchiffrer seul.
4. **Passage à l'échelle** : le prototype résout le logarithme discret final de façon linéaire, suffisante pour quelques millions de voix (README, menace 7) ; au-delà, pas de bébé et pas de géant.
5. **Interface** dans 24 langues (§ 5), avec les mêmes preuves vérifiables par tous.
6. **Remplacement du cœur maison** par une implémentation de référence auditée (Belenios ou ElectionGuard) avant tout usage réel, comme prévu au T54.

### 3.3 Ce qui reste non résolu (hérité de T54, à dire) [Fait]

Terminal de l'électeur compromis, liberté du vote à domicile (bulletin non sans reçu), émetteur d'éligibilité malhonnête, corrélation temporelle, disponibilité à l'échelle, absence d'audit externe. Une consultation **sans enjeu matériel** réduit l'intérêt d'acheter ou de contraindre les voix, **sans supprimer** les failles techniques. La CNIL (France) reste « très réservée » sur le vote en ligne pour les scrutins politiques (recommandation du 19/03/2026, lue au T54) ; son application à une consultation privée n'est pas établie (V4412).

⚠️ **Confidentialité de long terme** (V4413) : les bulletins chiffrés restent publics pour la vérification. Si les clés des autorités ou la cryptographie (ElGamal sur courbe elliptique, non résistant à un ordinateur quantique) tombent un jour, des **opinions politiques** pourraient être déchiffrées. Raisonnement non sourcé : détruire les clés de dépouillement après le décompte et publier un horizon de confidentialité.

---

## 4. Double majorité : définition et calcul

### 4.1 Les règles de référence [Fait]

- **Conseil de l'UE (art. 16, § 4, TUE)**, majorité qualifiée : au moins **55 %** des membres, **au moins quinze**, représentant **65 %** de la population ; une **minorité de blocage** exige au moins **quatre** membres[^tue16]. Population de référence UE-27 au 01/01/2025 : **450 646 971** (Eurostat `demo_pjan`)[^eurostat].
- **Modèle suisse** (majorité du peuple et des cantons) : cité par l'auteur comme modèle ; article de la Constitution fédérale non relu ⚠️ (V4409).

Ordre de grandeur utile [Estimation, calcul reproductible] : l'Allemagne (83 577 140) et la France (68 882 600) pèsent **33,83 %** de la population de l'UE-27, **moins** que les 35 % qui bloquent : à elles deux, elles ne suffisent pas à bloquer ; il faut une troisième (`double_majorite.py`).

### 4.2 Transposition à une consultation : trois lectures publiées ensemble [Opinion de Claude]

Une consultation n'a pas de population votante fixe : la participation diffère beaucoup d'un pays à l'autre. Un seul chiffre induirait en erreur ; on publie, pour chaque question :

1. **Brut** : oui / (oui + non), tous votes confondus. Dominé par les pays les plus participants.
2. **Projeté** : Σ (poids du pays × part de oui du pays) / Σ poids, sur les pays **représentés**. Corrige l'écart de participation **entre** pays, mais **pas** l'autosélection **dans** un pays.
3. **Pays** : nombre de pays représentés où le oui est majoritaire.

**Double majorité atteinte** si (2) dépasse le seuil citoyens **et** (3) dépasse le seuil pays. Seuils **publiés avant** l'ouverture (par défaut : majorité simple des deux, 50 % ; une variante alignée sur le Conseil, 55 % et 65 %, est possible, mais ces seuils n'ont de sens que pour un scrutin officiel). **Un pays est « représenté »** s'il atteint un nombre minimal de votes vérifiés (paramètre `seuil_votes`, valeur à fixer après le pilote). On publie toujours la **couverture** : la part de la population de l'UE vivant dans un pays représenté.

**Exemple factice** (`python3 sources/calculs/double_majorite.py`, 5 pays fictifs) : brut 68,2 % de oui ; projeté 52,6 % ; 2 pays sur 4 représentés disent oui, soit 50 %, pas plus de la moitié : **double majorité non atteinte**, alors que le brut semblait donner un oui net. C'est l'intérêt de la méthode, et sa limite : le résultat dépend de choix (seuil, poids) qui doivent être publiés d'avance.

---

## 5. Multilinguisme : 24 langues

- **Fait** : l'Union compte 24 langues officielles et de travail (liste du règlement n° 1/1958, version consolidée lue du 01/07/2013, qui compte l'irlandais ; le statut plein de l'irlandais depuis le 01/01/2022 n'a pas été relu ⚠️ V4404). Les textes adressés aux institutions peuvent l'être dans l'une quelconque (art. 2 du règlement)[^langues].
- **Risque principal** [Étude : effets de formulation, connus en sondage ; références à citer au chapitre, règle 9] : une question **traduite** n'est pas la même question. Une traduction qui incline le sens fausse le résultat de **un pays**, donc la double majorité.
- **Méthode proposée** [Opinion de Claude] : (1) **texte de référence rédigé en deux langues** par deux équipes, réconciliées ; (2) traduction par IA, puis **relecture par au moins deux locuteurs natifs indépendants** par langue, et **retraduction inverse** de contrôle ; (3) chaque électeur peut afficher la question dans sa langue **et** dans la langue de référence ; (4) toutes les versions publiées, versionnées et signées ; (5) aucune langue source privilégiée sur le plan politique : le choix des langues sources est annoncé et justifié.
- **Hors des 24** : langues régionales et minoritaires, langues de résidents non européens : interface bonus, la question restant dans les langues officielles.
- **Accessibilité** : lecture facile, lecteurs d'écran, langues des signes ; exigences européennes d'accessibilité des services numériques non relues ⚠️ (V4415).
- **Avec l'IA** : la traduction brute devient quasi gratuite ; **la validation par des humains ne l'est pas** et sert de goulot (24 langues × plusieurs relecteurs). Faire appel à des volontaires est possible mais crée une dépendance et un risque de camp.

---

## 6. RGPD et données sensibles

*Texte lu : art. 2, 9, 35, 83 du règlement (UE) 2016/679[^rgpd]. Art. 3, 6, 8, 17, 27, 37 et considérant 26 cités de mémoire ⚠️ (V4406).*

1. **L'opinion politique est une donnée de l'article 9.** « Le traitement des données à caractère personnel qui révèle […] les opinions politiques […] est interdit » (art. 9, § 1), sauf exception, ici le **consentement explicite** pour une ou plusieurs finalités spécifiques (art. 9, § 2, point a). Il faut un consentement **explicite, séparé et retirable** ; l'exception des organismes politiques pour leurs propres membres (§ 2, point d, de mémoire) ne vaut pas pour un public ouvert.
2. **Le chiffrement ne supprime pas la donnée personnelle.** Le bulletin est chiffré et dissocié de l'identité par signature aveugle, mais : (a) la **participation** (empreinte du titre, horodatage de délivrance) est une donnée personnelle ; (b) le bulletin chiffré peut redevenir une opinion si les clés sont compromises (V4413). Traiter l'ensemble comme **donnée de l'article 9 jusqu'à preuve du contraire**.
3. **Analyse d'impact obligatoire (art. 35, § 3, point b)** : traitement « à grande échelle de catégories particulières de données ». Avant toute ouverture, publiée.
4. **Délégué à la protection des données** ⚠️ (art. 37, § 1, point c, de mémoire, V4406) probablement obligatoire pour le même motif.
5. **Responsable de traitement** : l'entité du § 1.3. Si elle est établie dans l'UE, l'autorité chef de file est celle de son établissement principal ⚠️ (de mémoire : pas la CNIL par défaut si l'association est établie ailleurs). Le RGPD s'applique aussi, de mémoire, aux traitements visant des personnes dans l'UE même si l'organisateur est hors UE (art. 3, § 2).
6. **Exception domestique inapplicable** : l'article 2, § 2, point c vise « une activité strictement personnelle ou domestique » ; une plateforme publique en est loin.
7. **Minimisation** (principe) : identité en **divulgation sélective** (« âge supérieur à X », nationalité) plutôt qu'état civil complet ; **suppression** des données d'éligibilité après le scrutin, hors empreinte d'anti-doublon éventuelle ; aucune journalisation d'adresses ; aucun profilage ; **aucune revente**, aucune publicité.
8. **Âge** : le consentement numérique des mineurs varie selon les États ⚠️ (art. 8, de mémoire, V4406) : fixer 18 ans pour la double majorité ; éventuellement un registre 16-17 ans à part.
9. **Hébergement** dans l'UE, sans transfert hors UE ; **sanctions** : jusqu'à 20 millions d'euros ou 4 % du chiffre d'affaires mondial pour les violations des principes de base et des conditions du consentement (art. 83, § 5, lu).
10. **Droit à l'effacement et tableau public** (art. 17, de mémoire) : un bulletin chiffré sans lien avec l'identité n'est pas retirable sans casser la vérifiabilité ; à documenter dans l'information des participants et dans l'analyse d'impact. Risque juridique réel, à confier à un juriste.

---

## 7. Coût et calendrier réalistes, avec et sans IA

### 7.1 Base [Fait + Estimation, V4411]

Le T54 (§ 4.7, 4.8 et révision du 02/11) donne : développement du noyau en **4 à 8 semaines avec l'IA** (environ 60 jours pour un logiciel au périmètre plus large, selon le témoignage de l'auteur) ; confiance incompressible (audit, prime aux failles, certification, pilotes) ; **180 000 à 570 000 €** hors salaires pour un pays, ordres de grandeur sans source.

### 7.2 Ajouts propres à l'échelle européenne [Estimation, sans source]

| Poste | Hypothèse | Ordre de grandeur |
|---|---|---|
| Juridique multi-pays (RGPD, droit électoral, publicité politique, 3 à 5 pays pilotes) | avis d'avocats + analyse d'impact | 40 000 à 120 000 € |
| Validation linguistique (24 langues, 2 relecteurs natifs, ≈ 10 000 mots de questions et d'interface) | tarif de traduction professionnelle non sourcé | 20 000 à 60 000 € |
| Intégration d'identités par pays (portefeuille, eID nationales, cartes) | développement et tests par pays | 15 000 à 40 000 € par pays |
| Hébergement redondant, supervision, accessibilité | | 20 000 à 60 000 € par an |
| Sondage représentatif de calibration (§ 8.2), 27 pays | à demander à un institut | à chiffrer |
| Observateurs, comité, communication | hors périmètre ici | à chiffrer |

**Total ajouté [Estimation]** : ~100 000 à 350 000 € ; avec le T54 : **300 000 à 900 000 € hors salaires** ⚠️. Les variations les plus fortes viennent du nombre de pays d'identité intégrés et de l'audit.

### 7.3 Calendrier par phases [Estimation]

| Phase | Contenu | Avec IA | Sans IA ⚠️ |
|---|---|---|---|
| P0 | Gouvernance, entité distincte du candidat, avis juridique (France d'abord), modèle de menaces, analyse d'impact | 2 à 3 mois | 3 à 5 mois |
| P1 | Noyau de vote multi-questions et dépouillement par pays (sur Belenios ou ElectionGuard), vérificateur, 24 langues (traduction + relecture) | 2 à 3 mois | 6 à 10 mois |
| P2 | Audit cryptographique, test d'intrusion, prime aux failles, accessibilité | 3 à 5 mois | 4 à 7 mois |
| P3 | **Pilote** de quelques milliers de volontaires dans 2 à 5 pays, avec un type d'identité disponible, mesure du taux de vérification des codes | 1 à 2 mois | 2 à 3 mois |
| P4 | Ouverture à l'UE avec le **portefeuille européen** selon sa disponibilité réelle | à décider selon P3 | idem |

**Total** : 9 à 15 mois pour un pilote vérifié (avec IA), **18 à 30 mois sans IA** [hypothèse : l'écriture et la traduction du code ralentissent, l'audit et les pilotes non]. **L'IA compresse le développement (et la traduction brute), pas la confiance** (même conclusion que T54).

**Lien avec la stratégie du manifeste** (02/11) : la version Europe du manifeste doit sortir si la version française est lue ; **la consultation ne peut pas être prête et auditée en janvier 2027**. Option [Opinion de Claude] : ne pas lancer une version faible. Une consultation non vérifiée, étiquetée « sondage ouvert » (option E du § 2.2), peut accompagner la version Europe sans prétendre à la vérifiabilité ; la consultation vérifiée suivrait. Ne jamais annoncer comme « sécurisé » ce qui ne l'est pas.

---

## 8. Steelman : la meilleure objection, et la réponse honnête

### 8.1 L'objection [Étude + Opinion de Claude]

> « Une consultation ouverte en ligne n'est pas représentative : elle mesure ceux qui ont un smartphone, du temps, des opinions fortes et un intérêt pour la politique européenne, c'est-à-dire pas « les Européens ». Les pays les plus mobilisés dominent. Appeler cela un « vote » ou une « double majorité » lui donne une légitimité qu'il n'a pas, et fournit à un candidat un outil de campagne maquillé en démocratie. »

Éléments à l'appui :

- **Fracture numérique [Fait]** : en 2023, **55,6 %** des Européens (UE-27) avaient des compétences numériques de base ou supérieures, **60,4 %** en 2025 (Eurostat, `isoc_sk_dskl_i21`, indicateur `I_DSK2_BAB`, libellé déduit du code ⚠️ V4415) : **près de quatre personnes sur dix** sont exclues ou gênées dès l'entrée.
- **Précédent connu** ⚠️ (V4405, de mémoire, non relu) : la consultation publique de la Commission sur l'heure d'été en 2018 aurait reçu environ 4,6 millions de réponses, dont une très forte majorité venant d'Allemagne ; c'est l'exemple d'un pays qui domine par sa participation.
- **Autosélection** [Étude] : biais bien documenté des sondages en ligne volontaires, sans échantillonnage ; références à fournir au chapitre correspondant (règle 9).
- **Instrumentalisation** : l'auteur du manifeste est partie prenante (candidat potentiel) ; une consultation qu'il lance sur « ce qu'on voudrait en Europe » sert aussi sa notoriété. **La règle 7 s'applique** : ne pas le cacher.

### 8.2 Réponse honnête [Opinion de Claude]

1. **Ne jamais dire « les Européens ont voté »** : dire « N personnes vérifiées, dans X pays représentés, couvrant Y % de la population de l'UE, ont répondu ». Le biais de participation est affiché **à côté** du résultat, pas en note.
2. **Mesurer le biais** : lancer en parallèle un **sondage représentatif** sur les mêmes questions (quotas par pays, âge, sexe, niveau d'études) et publier l'écart. Si les deux concordent, la consultation gagne en crédibilité ; si elles divergent, on a appris quelque chose, ce qui est l'objectif.
3. **Séparer la consultation du candidat** (§ 1.3) : entité indépendante, questions choisies par un comité pluraliste (y compris des questions défavorables aux thèses de l'auteur), résultats publiés quels qu'ils soient, **sans reprise en campagne de chiffres non qualifiés**.
4. **Voie présentielle et lecture facile** (§ 2.2, option D) pour limiter l'exclusion ; publier la participation par pays et par tranche d'âge (attribut volontaire), et le niveau d'études seulement si l'électeur y consent (donnée à manier avec soin).
5. **Reconnaître la limite** : cette consultation ne remplace ni un sondage, ni un référendum, ni une élection. Elle peut **déclencher** une discussion, une ICE, une demande de traité ; c'est son rôle.

### 8.3 Tension à nommer (règle 7)

La thèse de l'auteur est qu'on devrait pouvoir **décider** directement. La consultation non officielle ne décide rien : elle risque donc de nourrir le cynisme (« on vote, et il ne se passe rien ») ou d'être lue comme une **démonstration de force**. À assumer : la valeur est de **montrer la méthode** (vote vérifiable, ouvert, auditable) bien plus que de mesurer l'opinion.

---

## Questions ouvertes

1. Faut-il que la consultation soit portée par une **entité distincte** de la candidature, sans que l'auteur contrôle les questions, les clés ni les chiffres ?
2. Qui rédige les questions, et quelle est la première ? (proposition : une seule, simple, sur la méthode de décision, avant les questions de fond.)
3. Entre un pilote vérifié, étroit et audité, et une grande consultation ouverte non vérifiée, lequel choisir pour accompagner la version Europe ?
4. Les non-citoyens (résidents, Suisse) : registre séparé ou exclus ?
5. Faut-il s'engager à publier un sondage représentatif de calibration, **même si l'écart est défavorable** ?

---

## Synthèse des sources mobilisées

| Source | Ce qu'elle établit |
|---|---|
| Règlement (UE) 2024/1183 (eIDAS 2)[^eidas2] | Portefeuille européen d'identité numérique, délai de 24 mois, niveau élevé, gratuité, pseudonymes, divulgation sélective, usage volontaire |
| Règlements d'exécution (UE) 2024/2977, 2024/2979, 2024/2981[^exec] | Publiés le 04/12/2024, entrée en vigueur le vingtième jour |
| Règlement (UE) 2019/1157[^cartes] | Cartes d'identité : biométrie, fins de validité 2026 et 2031 |
| Règlement (UE) 2019/788 (ICE)[^ice] | Seuils, délais, collecte, effets d'une ICE |
| Règlement (UE) 2016/679 (RGPD)[^rgpd] | Art. 2, 9, 35, 83 |
| TUE, art. 11 et 16[^tue11] [^tue16] | ICE ; majorité qualifiée du Conseil |
| Règlement (UE) 2024/900[^pub] | Publicité politique : applicable depuis le 10/10/2025 |
| Règlement n° 1/1958[^langues] | 24 langues officielles (version consolidée du 01/07/2013) |
| Eurostat `demo_pjan`, `isoc_sk_dskl_i21`[^eurostat] | Population au 01/01/2025 ; compétences numériques 2023 et 2025 |
| `prototypes/referendum/`, T54, `sources/calculs/double_majorite.py` | Primitives, menaces couvertes et non couvertes ; calcul de la double majorité |

[^eidas2]: Parlement européen et Conseil, règlement (UE) 2024/1183 du 11/04/2024, JO L du 30/04/2024. CELEX 32024R1183 (https://publications.europa.eu/resource/celex/32024R1183). Consulté le 03/11/2026. Lu : art. 5 bis, 5 quater, 5 sexies, 5 septies, art. 2 (entrée en vigueur).
[^exec]: Commission, règlements d'exécution (UE) 2024/2977, 2024/2979, 2024/2981 du 28/11/2024, JO L du 04/12/2024. CELEX 32024R2977, 32024R2979, 32024R2981 (https://publications.europa.eu/resource/celex/32024R2977). Consulté le 03/11/2026. Lu : en-tête et article d'entrée en vigueur.
[^cartes]: Parlement européen et Conseil, règlement (UE) 2019/1157 du 20/06/2019, JO L 188 du 12/07/2019. CELEX 32019R1157 (https://publications.europa.eu/resource/celex/32019R1157). Consulté le 03/11/2026. Lu : art. 5 et 16, considérants 15 et 18.
[^ice]: Parlement européen et Conseil, règlement (UE) 2019/788 du 17/04/2019, JO L 130 du 17/05/2019. CELEX 32019R0788 (https://publications.europa.eu/resource/celex/32019R0788). Consulté le 03/11/2026. Lu : art. 2, 3, 8, 14, 15, 28.
[^rgpd]: Parlement européen et Conseil, règlement (UE) 2016/679 du 27/04/2016, JO L 119 du 04/05/2016. CELEX 32016R0679 (https://publications.europa.eu/resource/celex/32016R0679). Consulté le 03/11/2026. Lu : art. 2, 9, 35, 83.
[^tue11]: Traité sur l'Union européenne, version consolidée (JO C 202 du 07/06/2016), art. 11. CELEX 12016M011 (https://publications.europa.eu/resource/celex/12016M011). Consulté le 03/11/2026.
[^tue16]: Traité sur l'Union européenne, version consolidée (JO C 202 du 07/06/2016), art. 16, § 4. CELEX 12016M016 (https://publications.europa.eu/resource/celex/12016M016). Consulté le 03/11/2026.
[^pub]: Parlement européen et Conseil, règlement (UE) 2024/900 du 13/03/2024, JO L du 20/03/2024. CELEX 32024R0900 (https://publications.europa.eu/resource/celex/32024R0900). Consulté le 03/11/2026. Lu : art. 30.
[^langues]: Conseil, règlement n° 1 de 1958 portant fixation du régime linguistique, version consolidée du 01/07/2013. CELEX 01958R0001-20130701 (https://publications.europa.eu/resource/celex/01958R0001-20130701). Consulté le 03/11/2026.
[^eurostat]: Eurostat, jeux `demo_pjan` (population au 01/01, mise à jour du 25/09/2026) et `isoc_sk_dskl_i21` (compétences numériques, mise à jour du 17/04/2026), API de diffusion (https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan). Consulté le 03/11/2026.
