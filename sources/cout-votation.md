# Coût du système de votation proposé : élections actuelles, Parlement, plateforme, double canal papier

*Demande de l'auteur du 06/11/2026 (suite de ses positions sur la démocratie du même jour et de la tâche T69). Consulté le 06/11/2026. Calculs : `sources/calculs/cout_votation.py` (lancer `python3 -I sources/calculs/cout_votation.py` ; résultats archivés dans `sources/calculs/cout_votation_resultats.txt`). Téléchargements : `$DONNEES/sources/votation/`. Points non résolus : V18100 à V18110 dans `verifications.md`.*

Légende : **[Fait]** sourcé et lu ; **[Calcul]** reproductible à partir de faits ; **[Estimation]** hypothèse de Claude, à confirmer par devis ; **[Opinion]**. Cotes de fiabilité (règle 11) : A statistique ou texte officiel, B institution reconnue, C presse ou rapport d'acteur, D communication commerciale ou militante. Tous les montants sont en euros courants de l'année indiquée, sauf mention.

## 0. En bref

1. **Le système actuel coûte cher en papier, pas en urnes.** [Fait] Le programme 232 « Vie politique » a consommé 414,2 M€ pour l'organisation des élections en 2022 (présidentielle + législatives), contre 100,7 M€ en 2018 ; coût total pour l'État d'au moins 461,4 M€ en 2022 (Cour des comptes). La propagande écrite pèse 43 à 69 % du coût d'un scrutin. Les coûts des communes ne sont pas connus (la Cour le dit).
2. **Les deux chambres coûtent environ 1 Md€ par an.** [Fait] 2026 : dotations de 607,65 M€ (Assemblée) et 353,47 M€ (Sénat), soit 961,1 M€ ; budgets complets de 644,0 et 382,3 M€, soit 1 026,3 M€ (rapport du Sénat sur le PLF 2026).
3. **Le nouveau système, en central, coûte environ 270 M€ par an** [Estimation] (fourchette 93 à 680 M€), dont près de 100 M€ pour le double canal papier et bureaux, 60 M€ pour la contre-expertise, 75 M€ pour la plateforme et son exploitation.
4. **Solde annuel central : environ + 460 M€ d'économie** si les législatives disparaissent sans remplacement, **+ 410 M€** si l'élection de la liste de gouvernement coûte autant qu'une législative [Calcul + hypothèses]. La fourchette va de **− 200 M€** (coûts hauts, économies basses) à **+ 780 M€**. Le solde est positif dans huit cas sur neuf de la matrice de la variante A, mais **il dépend de l'hypothèse sur la part des deux chambres réellement économisée (70 % en central)**, qui est une hypothèse, pas un fait.
5. **Le coût n'est pas l'enjeu.** [Opinion] Même au mieux, l'économie est faible au regard de l'ensemble des dépenses publiques. L'argument décisif est la sécurité du vote à distance et le contre-pouvoir que la suppression des chambres retire ; ce document chiffre, il ne tranche pas ces deux points (§ 5).

## 1. Coût actuel

### 1.1 Organisation des élections

**Programme 232, action 2 « Organisation des élections » (crédits de paiement consommés, M€)** [Fait, Cour des comptes S2024-1302, tableau 16, cote A] :

| Année | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 (PAP) |
|---|---|---|---|---|---|---|---|
| Action 2 | 297,8 | 100,7 | 112,3 | 146,4 | 290,0 | 414,2 | 180,2 |

Autres crédits du programme : financement des partis 66 à 69 M€ par an (68,67 M€ en 2026), CNCCFP 6 à 9 M€ (même tableau). Pour 2024 et 2025, l'avis de l'Assemblée sur le PLF 2025 donne 257,6 M€ (2024) et 100,2 M€ (2025) pour l'ensemble du programme [résumé de recherche, non ouvert : V18102]. Pour 2026, le Sénat indique 300,9 M€ de crédits de paiement, dont 193,5 M€ pour les municipales et 3,7 M€ pour les sénatoriales, avec une hausse du coût postal de 90 % depuis 2020 (46,1 M€ pour les municipales 2026) [Fait, rapport sénatorial AGTE PLF 2026, cote B].

**Moyenne annuelle sur un cycle complet 2018-2022** [Calcul] : **212,7 M€ par an** pour l'action 2, soit environ 4,4 € par inscrit et par an (48,8 M d'inscrits au 09/03/2022, Cour).

**Coût par scrutin, fonctionnement P232 (M€)** [Fait, Cour, tableau 8] :

| Scrutin | Total P232 | dont propagande écrite | Part de la propagande |
|---|---|---|---|
| Européennes 2019 | 131,4 | 90,4 | 68,8 % |
| Municipales 2020 | 150,9 | 65,2 | 43,2 % |
| Départementales 2021 | 143,4 | 72,8 | 50,8 % |
| Régionales 2021 | 151,8 | 81,9 | 53,9 % |
| **Présidentielle 2022** | **237,3** | 159,5 | 67,2 % |
| **Législatives 2022** | **164,4** | 96,2 | 58,5 % |

La propagande comprend la commission de propagande (mise sous pli : 48,0 M€ pour la présidentielle), l'acheminement par La Poste (53,5 M€) et le remboursement de l'impression aux listes ayant obtenu au moins 5 % (56,2 M€). Le remboursement forfaitaire des dépenses de campagne s'ajoute dans le reste du total (préfectures). La campagne audiovisuelle officielle est marginale : 1,6 M€ pour les deux scrutins de 2022.

**Coût réel pour l'État** [Fait, Cour] : le programme 232 ne retrace qu'une partie des coûts ; avec les personnels des préfectures, de la police, de la gendarmerie, de l'Insee et de la DILA, le coût pour l'État est **d'au moins 461,4 M€ en 2022** (349,2 M€ en 2017). Dont 16 M€ de transport de plis par la gendarmerie (2022), non comptés dans le programme.

**Communes** [Fait + Estimation] : la Cour écrit que les coûts communaux ne sont pas connus (DGCL). L'État verse des frais d'assemblée électorale : 15,3 à 15,5 M€ par scrutin national en 2022, à raison de 44,73 € par bureau et par tour et 0,10 € par inscrit, montants inchangés depuis 2006. L'AMF estimait en 2017 que cela couvre 15 % du coût réel (cité par la Cour, non vérifié par elle). [Calcul] Si c'est exact, le coût réel d'un scrutin à deux tours est d'environ 102 M€, dont **environ 87 M€ nets à la charge des communes** ; par bureau et par tour, environ 790 €. Le nombre de bureaux de vote, **dérivé** des frais d'assemblée de la présidentielle 2022, est d'environ **64 500** (hypothèse : deux tours, 48,7 M d'inscrits ; V18100).

**Législatives, coût annualisé** [Calcul] : 164,4 M€ (P232) mis à l'échelle du coût total État (× 461,4 / 422,3) donne **179,6 M€ pour l'État** par scrutin, plus 86,9 M€ nets pour les communes, soit 266 M€ par législatives, **53,3 M€ par an** sur un cycle de cinq ans. **Sénatoriales** : 3,7 M€ par série tous les trois ans, soit **1,2 M€ par an** (hors coût pour les communes et les grands électeurs, non chiffré).

**Législatives anticipées de 2024** : 171,49 M€ selon le ministère de l'Intérieur relayé par la presse (cote C, déjà noté V7478 dans `architecture-democratique.md`, non relu à la source). Exécution 2024 de l'action 2 non lue (V18102).

### 1.2 Remboursement des campagnes

Le remboursement forfaitaire des dépenses de campagne et le remboursement de la propagande sont inclus dans les totaux ci-dessus (préfectures et bureau des élections). Plafonds de dépenses et comptes de campagne contrôlés par la CNCCFP (8,1 M€ en 2022). Pas de décomposition distincte du remboursement forfaitaire dans les documents lus : **à isoler** (V18102).

### 1.3 Assemblée nationale et Sénat

[Fait, Sénat, rapport sur la mission « Pouvoirs publics » du PLF 2026, cote B ; M€, 2026]

| Institution | Dotation de l'État | Budget complet | Détails |
|---|---|---|---|
| Assemblée nationale | 607,65 | 644,01 | fonctionnement 604,8 ; investissement 39,3 ; charges parlementaires 347 ; masse salariale 203,2 ; déficit couvert par prélèvement sur disponibilités (34,6) |
| Sénat | 353,47 (dont Jardin du Luxembourg 11,61) | 382,28 | fonctionnement 366,1 ; investissement 16,2 ; prélèvement sur disponibilités 22,1 |
| Chaînes parlementaires (LCP-AN, Public Sénat) | 35,6 | | non comptées dans l'économie ci-dessous |
| **Total AN + Sénat** | **961,1** | **1 026,3** | |

Les « charges parlementaires » de l'Assemblée (347 M€) recouvrent indemnités, frais de mandat, collaborateurs et groupes ; la ventilation fine par poste (indemnités, avance de frais de mandat, effectifs) n'a pas été extraite ici : **à compléter** à partir des comptes de l'Assemblée et du Sénat (V18101 en partie). Les deux budgets sont gelés en 2026 mais déficitaires (prélèvements sur réserves).

### 1.4 Référendums passés

- **Référendum du 29/05/2005** [Fait, cote A : réponse du ministre de l'Intérieur à la question écrite n° 70440, JO du 11/10/2005] : **130,6 M€** (euros de 2005) à la charge du ministère : impression 35,8, mise sous pli 19,7, envoi aux électeurs 58,8, subventions aux communes 7,0, campagne audiovisuelle et remboursement des partis 9,3. Une campagne d'information préalable de 10 M€ avait été annoncée fin 2004 (Maire-info, cote C).
- Référendum de 2000 (quinquennat) : coût non trouvé.
- Enseignement [Calcul] : un référendum à l'ancienne coûte environ 2,7 € par inscrit en 2005 (130,6 / 48 M d'inscrits environ ⚠️ nombre d'inscrits de 2005 de mémoire), dont 90 % de papier. C'est l'ordre de grandeur de ce que le papier ferait coûter si chaque votation était envoyée à tous les électeurs : quatre fois par an, soit plus de 500 M€.

## 2. Coût du nouveau système

### 2.1 Architecture chiffrée

Quatre échéances par an un dimanche ; vote numérique continu (identité numérique) ; canal papier permanent pour environ 15 % des inscrits (brochures et synthèses par courrier, bureaux communaux moins nombreux) ; plateforme de débat avec synthèses, sources et contre-expertise ; instance de transparence ; suppression des deux chambres, le gouvernement élu par listes proposant les lois (positions du 06/11/2026).

### 2.2 Repères publics pour calibrer

| Repère | Chiffre | Source (cote) |
|---|---|---|
| **France Identité** (application d'identité numérique) | plus de 70 M€ engagés depuis le lancement ; 12 M€ par an d'entretien ; 7 M€ par an de développement sur quatre ans | ministre délégué à l'Intérieur, Sénat, 19/05/2026, rapporté par Acteurs publics (C) |
| Programme d'identité numérique, FranceConnect compris | environ 500 M€ sur dix ans (estimation de presse, 2021) | Next.ink citant Acteurs publics (C) ; périmètre flou |
| **Genève, CHVote** (un canton, ~350 000 électeurs ⚠️) | développement 4,74 M CHF (+ 2,6 M CHF de surcoût, 17 mois de retard) ; exploitation annuelle estimée de 2,1 à 3,64 M CHF ; abandon en 2018 | rapport du Grand Conseil de Genève, via recherche web (B, non relu : V18105) |
| **Confédération suisse**, phase d'essais | 1,9 M CHF | Inside-IT cité par swissinfo (C, déjà noté dans `democratie-directe-suisse-chiffres.md`) |
| **Estonie, 2017**, coût administratif par vote | internet 2,32 € ; papier le jour du scrutin 4,37 € ; vote anticipé en comté 6,24 € ; bureau local 20,41 € ; 186 034 votes par internet sur 586 000 environ | étude TalTech (Krimmer et al.), via ERR (C/B, non lue : V18104) |
| **CBO américain** | demande 2025 : 73,5 M$, 278 équivalents temps plein (soit environ 68 M€ au taux de 0,92, hypothèse) | cbo.gov (A, résumé de recherche, V18106) |
| **CPB néerlandais** | budget et effectifs non trouvés ; le CPB publie une perspective à quatre ans utilisée par les partis et les négociations de coalition | cpb.nl (B) ; V18106 |
| **HATVP** (transparence) | budget non trouvé (programme 308, action 10) | V18107 |

**Leçon de calibrage** [Opinion] : l'application d'identité de l'État a coûté plusieurs dizaines de millions d'euros ; les projets de vote électronique suisses ont dépassé leurs budgets de plus de 50 % (Genève : + 55 % en développement, + 73 % en exploitation) avant d'être abandonnés ; l'Estonie, où le système est installé depuis 2005, obtient un vote par internet deux fois moins cher que le papier. Les coûts de la plateforme dépendent donc de la maturité, pas de la technique : un premier système coûte plus qu'un système rodé.

### 2.3 Hypothèses et résultats [Estimation + Calcul], M€ par an

Capex amorti sur cinq ans. « Bas » et « haut » désignent des coûts bas et hauts.

| Ligne | Bas | **Central** | Haut | Justification |
|---|---|---|---|---|
| Plateforme, développement amorti (capex 40 / 100 / 250 M€) | 8 | **20** | 50 | central ≈ 1,4 fois le cumul France Identité ; haut = × 3,5 avec dépassement type Genève |
| Plateforme, exploitation | 12 | **30** | 70 | bas = entretien de France Identité ; haut = × 6 pour une charge de pointe 48,8 M d'inscrits |
| Rédaction, vérification des sources, lecture facile (dès 15 ans) | 10 | **25** | 60 | équipe éditoriale + modération ; IA pour les premiers jets, relecture humaine |
| Sécurité et audits (plusieurs audits indépendants, prime aux failles, certification, test d'intrusion à chaque session) | 3 | **8** | 20 | la preuve de concept seule est chiffrée à 0,18-0,57 M€ dans `cahier-des-charges-referendum-numerique.md` § 4.8 |
| Contre-expertise indépendante | 20 | **60** | 120 | central ≈ CBO (68 M€) ; haut = double, car elle couvrirait toute loi |
| Instance de transparence (élection et budget propres) | 5 | **15** | 30 | pas de repère chiffré (V18107) |
| Inclusion numérique (médiateurs, assistance) | 5 | **15** | 40 | |
| **Courrier papier** : 15 % des inscrits (10 / 15 / 25 %), 4 sessions, 1,00 / **1,64** / 2,50 € par inscrit et par session | 19,5 | **47,9** | 122,0 | 1,64 € = propagande de la présidentielle 2022 par inscrit et par tour (159,45 M€ / 97,4 M) ; 1,04 € hors impression |
| **Bureaux papier** : 5 000 / 15 000 / 35 000 bureaux, 4 sessions, 500 / **792** / 1 200 € par bureau et session | 10,0 | **47,5** | 168,0 | 792 € = coût réel communal dérivé de la méthode du § 1.1 ; 35 000 = un bureau par commune |
| **Total** | **92,5** | **268,5** | **680,0** | |

**Contrôle de cohérence** [Calcul] : le central revient à **3,06 € par bulletin** déposé si la participation moyenne est de 45 % (le script donne 1,05 € en bas et 7,74 € en haut). La participation moyenne des dimanches de votation fédérale suisses depuis 2015 est de 47,7 % (36 dimanches, Swissvotes, Université de Berne, cote B). L'Estonie : 2,32 € par vote par internet et 4,37 à 20,41 € en papier en 2017. Le central est donc cohérent avec l'Estonie, à ceci près que **le papier de 15 % des inscrits coûte ici bien plus par bulletin que le numérique**, ce qui est attendu.

### 2.4 Économie : suppression des deux chambres et des élections législatives et sénatoriales

- **Parlement** [Estimation] : on ne supprime pas tout le budget. Resteraient l'entretien du patrimoine (Palais Bourbon, Palais du Luxembourg, jardin), les archives, la sécurité, des services de rédaction juridique (que le gouvernement doit assumer s'il propose les lois), et le reclassement des personnels (principe « ne perdre personne » du manifeste, qui retarde l'économie, non chiffré). Part économisée des 961,1 M€ de dotations : **50 % / 70 % / 85 %** (bas / central / haut), soit **481 / 673 / 817 M€**.
- **Législatives** : 53,3 M€ par an (§ 1.1) si elles disparaissent **sans remplacement**. Si l'élection de la liste de gouvernement (deux tours, « comme des législatives ») coûte autant qu'une législative, cette économie tombe à zéro : variante B.
- **Sénatoriales** : 1,2 M€ par an.
- **Économie brute** [Calcul] : variante A (sans remplacement) **535 / 727 / 871 M€** ; variante B **482 / 674 / 818 M€**.

Le cas de l'élection de la liste est une contradiction à trancher (**question ouverte**) : supprimer « les élections législatives » (consigne) et élire « une liste portée par un ministre à deux tours comme des législatives » (entrée du 06/11) sont deux choses différentes pour le budget. La variante B est la plus prudente ; elle est aussi la plus cohérente avec le texte de l'auteur.

## 3. Solde annuel et comparaison avec la Suisse

### 3.1 Solde [Calcul], M€ par an (positif = économie nette)

Variante A (législatives supprimées sans remplacement) ; lignes = coûts du nouveau système, colonnes = part des chambres économisée :

| | Économies basses | centrales | hautes |
|---|---|---|---|
| Coûts bas | + 443 | + 635 | + 779 |
| **Coûts centraux** | + 267 | **+ 459** | + 603 |
| Coûts hauts | − 145 | + 47 | + 191 |

Variante B (élection de la liste de gouvernement au coût d'une législative) : central **+ 406** ; favorable + 726 ; défavorable − 198 ; coûts hauts et économies centrales : − 6.

**Lecture** [Opinion] : en central, le système coûte environ 270 M€ par an et économise environ 700 M€, soit un solde de **400 à 460 M€ par an**. L'économie disparaît si trois choses se cumulent : la plateforme dérape comme les projets suisses, le papier est utilisé massivement (25 % des inscrits, un bureau par commune) et les chambres gardent la moitié de leurs moyens. Ce sont des hypothèses non sourcées sur le Parlement et sur la plateforme : **ne pas citer ces soldes dans le manifeste sans les marquer comme estimations**.

**Ce qui n'est pas dans le solde** : le coût de transition (reclassement des collaborateurs, indemnités éventuelles, double fonctionnement), les élections qui restent (présidentielle, européennes, municipales, régionales, départementales), et l'économie, indépendante du reste, de la dématérialisation de la propagande électorale que recommande la Cour (renonciation de 50 % des électeurs au papier : 250 M€ par cycle ; 110 M€ pour une année présidentielle + législatives, tableaux 10 et 11) : elle vaut avec ou sans la réforme.

### 3.2 Comparaison avec la Suisse

[Fait secondaire, cote C : calcul de RTS repris par Le News, 17/10/2019, année de référence non précisée, V18103] Le niveau fédéral suisse coûterait environ 233 M CHF par an, dont **106 M CHF pour l'Assemblée fédérale** et **54 M CHF pour « élections et votations »**. Le Conseil fédéral estimait en 2017 à environ 1 M CHF l'affranchissement des enveloppes-réponses pour tous les scrutins fédéraux (pièce parlementaire non lue, V6064). Pas de coût officiel d'un dimanche de votation trouvé (`democratie-directe-suisse-chiffres.md`, V6064). L'électorat suisse est d'environ 5,5 M d'électeurs (dérivé de « 77 000 = 1,4 % », même fichier).

| | Suisse (fédéral, ~2019) | France, système actuel | France, système proposé (central) |
|---|---|---|---|
| Parlement | 106 M CHF (≈ 19 CHF par électeur) | 961 M€ de dotations (≈ 20 € par inscrit) | 1/3 de l'économie non réalisée : ≈ 290 M€ restants (≈ 6 € par inscrit) |
| Élections et votations | 54 M CHF (≈ 9,8 CHF par électeur) | 213 M€ par an hors communes (≈ 4,4 € par inscrit) | 268,5 M€ (≈ 5,5 € par inscrit) |

[Calcul] Les montants par électeur sont à lire comme des ordres de grandeur : les francs ne sont pas convertis, les périmètres diffèrent (la Suisse a 4 dates par an, un Parlement conservé, 26 cantons). **Constat** : le Parlement fédéral suisse coûte à peu près autant par électeur que le Parlement français ; la Suisse fait voter quatre fois par an pour environ 10 CHF par électeur, ce qui est du même ordre que les 5,5 € du système proposé. Le coût du vote direct n'est donc pas le problème ; **la Suisse garde son Parlement**.

## 4. Steelman : la meilleure objection et la réponse

**Objection** : « Vous économisez un milliard sur un budget public de plus de mille milliards, au prix d'un système de vote que la CNIL déconseille et d'un gouvernement qui écrit seul les lois. L'argent n'est pas la bonne justification. » [Opinion de Claude] **Réponse** : l'objection est largement juste sur l'argent. Le chiffrage montre que le coût n'empêche pas la réforme et que l'économie est un bénéfice secondaire, pas l'argument. L'argument à tenir est démocratique (vote des lois par les citoyens) et il doit s'appuyer sur les garanties de sécurité du § 5, pas sur 400 M€.

**Contraintes juridiques à nommer** : suppression des deux chambres = révision constitutionnelle (titres IV et V de la Constitution, et article 3 sur le suffrage) ; vote en ligne politique : la CNIL « reste très réservée » pour les référendums (recommandation du 19/03/2026, lue dans `cahier-des-charges-referendum-numerique.md` § 2.3) ; le vote par correspondance est prohibé en droit français hors cas limités. Détail dans `recherche-basculement-constitutionnel.md`.

## 5. Risques

1. **Sécurité du vote électronique.** [Fait] La Cour (2024) rappelle que seule l'Estonie recourt massivement au vote par internet et que, « dans le reste du monde, le vote par internet est en recul pour les élections politiques » ; la CNIL (2019) « déconseille » le vote par internet quand les menaces sont fortes ; en 2017, le système des Français de l'étranger n'avait pas pu être homologué par l'ANSSI (architecture insuffisamment robuste) ; en 2022, le Conseil constitutionnel a annulé des législatives de Français de l'étranger après des dysfonctionnements du vote électronique (2e et 9e circonscriptions) et pour pressions de permanences d'aide (8e circonscription) ; la Cour juge la généralisation du vote à distance « pas envisageable, au moins à court terme ». Suisse : après le test public d'intrusion de 2019 (trois failles critiques trouvées dans le code), suspension puis reprise en 2023 avec audit indépendant, code public et prime aux failles ; incident de Bâle-Ville le 08/03/2026 (2 048 suffrages non déchiffrés) ; plafond de 10 % de l'électorat suisse. Estonie : analyse de Springall et al. (2014) qui demandait l'arrêt ; le système a évolué depuis, 51,1 % des votants en 2023 ; seulement 5,5 % des i-votes vérifiés par l'électeur (tout cela est détaillé et sourcé dans `cahier-des-charges-referendum-numerique.md` § 2.3, à ne pas redoubler). **ODIHR/OSCE, élections de 2023 en Estonie** : constat d'un vote par internet géré efficacement, avec une recommandation de renforcer la confiance du public ; texte intégral non lu (V18108). **Surcoût associé** : un audit et une certification à chaque session, déjà dans la ligne « sécurité » (8 M€ central) : c'est peut-être sous-estimé si la CNIL impose le niveau le plus élevé (vérifiabilité de bout en bout, expertise indépendante à chaque élection).
2. **Secret du vote et pressions.** [Fait + Opinion] La Cour : l'absence d'isoloir ne protège pas des pressions familiales, et la confiance dans le résultat est en jeu. Le secret numérique repose sur la séparation de l'identité et du bulletin (signature aveugle, clés réparties : `cahier-des-charges-referendum-numerique.md` §§ 1.4, 4.9). **Limite** : un vote continu pendant des semaines multiplie les occasions d'achat ou de contrainte, que seule atténue la possibilité de revoter jusqu'à la clôture, et de voter ensuite au bureau.
3. **Règle de priorité (vote en ligne puis au bureau).** En Estonie, le vote en personne annule le vote électronique (de mémoire, V3273) ; c'est la règle recommandée ici, car elle protège l'électeur contraint, qui peut voter en ligne devant son agresseur puis au bureau. **Coût de la règle** : l'émargement doit être relié en direct au registre des votes en ligne (un terminal par bureau, intégré aux lignes « bureaux » et « plateforme » : aucun poste dédié n'est chiffré) ; et l'électeur inscrit au papier ne peut pas voter en ligne.
4. **Accessibilité et fracture numérique.** [Fait, Insee, cote A] 15,4 % des personnes de 15 ans ou plus étaient en situation d'illectronisme en 2021 (Insee Première n° 1953, juin 2023) ; 15,7 % en 2023 (Insee). L'hypothèse de 15 % de papier correspond à ce taux ; mais l'illectronisme est concentré chez les personnes âgées et modestes, qui votent aussi plus à gauche ou à droite selon les cas : un biais de participation à surveiller. Les personnes handicapées et celles sans smartphone ou sans carte d'identité électronique (France Identité : 4 millions d'utilisateurs au 27/03/2026, `cahier-des-charges-referendum-numerique.md`) sont les plus exposées. Le papier est donc **permanent**, pas transitoire, et le niveau « haut » (25 %) n'est pas absurde.
5. **Risque de coût.** [Fait + Opinion] Genève : développement + 55 %, exploitation + 73 %, 17 mois de retard, abandon. Le niveau « haut » prend en compte ce type de dérive ; la leçon est de ne pas lancer un développement national avant un pilote ouvert et audité.
6. **Risque démocratique non chiffré.** La suppression des deux chambres retire un contre-pouvoir ; la contre-expertise indépendante est chiffrée (60 M€ central) mais **ne remplace pas** le juge constitutionnel ni la navette parlementaire. La Suisse garde son Parlement. Les synthèses éditoriales de la plateforme (rédaction, IA, sources) deviennent un point de capture : qui choisit ce qui est « un fait » ? À traiter dans `architecture-democratique.md`, non ici.

## 6. Ce qui reste à faire

- Isoler le remboursement forfaitaire des dépenses de campagne et les dépenses du programme 232 en 2024-2025 (V18102).
- Trouver un coût officiel d'une votation suisse (budget de la Chancellerie fédérale, ligne « droits politiques ») et les chiffres du vote électronique fédéral (V18103, V18105).
- Obtenir les budgets du CPB et de la HATVP (V18106, V18107).
- Ventiler les charges parlementaires (indemnités, collaborateurs, groupes) à partir des comptes des deux assemblées (V18101).
- Demander à l'auteur de trancher le statut de l'élection de la liste de gouvernement (variantes A et B, § 2.4).

## Synthèse des sources mobilisées

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts connu |
|---|---|---|---|
| Cour des comptes, *L'organisation des élections : un dispositif robuste, des évolutions nécessaires*, S2024-1302, 20/11/2024 (https://www.ccomptes.fr/sites/default/files/2024-11/20241120-S2024-1302-Organisation-des-elections.pdf), lu en entier par extraction, consulté le 06/11/2026 | Coût des élections 2017-2023 par action et par scrutin ; coût État 461,4 M€ (2022) ; propagande ; frais d'assemblée ; économies de la dématérialisation ; réserves sur le vote à distance | A | aucun ; la Cour contrôle l'État |
| Assemblée nationale, commission d'enquête sur l'organisation des élections, audition de la Cour (compte rendu n° 6, 2024-2025) (https://www.assemblee-nationale.fr/dyn/17/comptes-rendus/ceelec/l17ceelec2425006_compte-rendu.pdf), lu | 414 M€ en 2022 ; périmètre de l'enquête | A | aucun |
| Sénat, commission des finances, rapport spécial « Pouvoirs publics » PLF 2026 (https://www.senat.fr/rap/a25-145-10/a25-145-10-syn.pdf), lu | Dotations et budgets 2026 de l'Assemblée et du Sénat ; chaînes parlementaires | B | organe parlementaire jugeant d'autres pouvoirs publics ; le Sénat est partie |
| Sénat, avis AGTE PLF 2026 (https://www.senat.fr/fileadmin/cru-1762483659/Commissions/Finances/2025-2026/PLF_2026/Essentiel/AGTE_PLF_2026_Essentiel_post_commission.pdf), lu | Programme 232 en 2026 : 300,9 M€ ; municipales 193,5 M€ ; coût postal | B | aucun |
| Ministère de l'Intérieur, réponse à la QE n° 70440 (JO 11/10/2005, https://questions.assemblee-nationale.fr/q12/12-70440QE.htm), lue | Coût du référendum de 2005 : 130,6 M€ | A | auteur de l'organisation |
| Maire-info, 2024 (https://www.maire-info.com/organisation-des-elections-les-propositions-d%27evolution-de-la-cour-des-comptes%C2%A0-article2-29148), lu | Dotation de 15 M€ ; couverture de 15 % selon l'AMF | C | Maire-info est liée à l'AMF (association d'élus) |
| Acteurs publics, 20/05/2026 (https://acteurspublics.fr/articles/plus-de-70-millions-deuros-jusquici-engages-pour-financer-france-identite/) ; Next.ink, 27/04/2021 | Coûts de France Identité (70 M€ engagés, 12 + 7 M€ par an) ; 500 M€ sur dix ans, estimation | C | médias spécialisés |
| Insee Première n° 1953, juin 2023 (https://www.insee.fr/fr/statistiques/7633654) | Illectronisme : 15,4 % en 2021 | A | aucun ; résumé de recherche |
| CBO, demande de crédits 2025 (https://www.cbo.gov/publication/60150) | 73,5 M$ ; 278 ETP | A | organisme évalué qui demande son propre budget |
| ERR News, 2018 (https://news.err.ee/863027/scientists-calculate-administrative-cost-to-state-of-electronic-votes) ; étude TalTech, Krimmer et al. | Coût par vote en Estonie, 2017 | C (presse) ; étude B | l'étude associe le chef de l'office électoral estonien (Vinkel) : auteur lié à l'organisateur |
| Le News, 17/10/2019, d'après RTS (https://lenews.ch/2019/10/17/the-cost-of-democracy-what-switzerland-spends-on-its-federal-government/) | Coût fédéral suisse : Parlement 106 M CHF ; élections et votations 54 M CHF | C | année de référence non précisée |
| Swissvotes, Université de Berne (jeu de données local `$DONNEES/sources/democratie/swissvotes_dataset.csv`) | Participation moyenne par dimanche | B | projet universitaire reprenant les chiffres officiels |
| `sources/cahier-des-charges-referendum-numerique.md` ; `sources/democratie-directe-suisse-chiffres.md` ; `sources/architecture-democratique.md` | CNIL, ANSSI, Suisse, Estonie, Springall, Bâle-Ville 2026 ; votation suisse | voir ces fichiers | voir ces fichiers |

Rapports non lus à la source : ODIHR/OSCE Estonie 2023 (https://www.osce.org/odihr/elections/estonia/551251, résumés de recherche seulement) ; rapport du Grand Conseil de Genève sur CHVote (https://ge.ch/grandconseil/grandconseil/data/texte/PL12866A.pdf) ; avis de l'Assemblée sur le PLF 2025 pour les crédits 2024-2025 du programme 232. Voir `verifications.md`.
