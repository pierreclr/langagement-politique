# État numérique, complexité et corruption : état de la recherche

Recherche documentaire · consultation des sources : **2026-10-26** · rédaction : Claude, pour l'auteur.

Légende : **[F]** fait sourcé · **[E]** estimation ou résultat d'étude (avec sa méthode) · **[O]** opinion ou interprétation de Claude · ⚠️ non confirmé par une source primaire lue pendant cette recherche.

Objet : confronter cinq briques du projet de l'auteur à la recherche :
- État-plateforme unique et open source, code audité en permanence ;
- IA contre la corruption et comme guichet pour les personnes éloignées du numérique ;
- vote électronique décentralisé, identité par puce de carte d'identité et biométrie de l'appareil ;
- fiscalité si simple qu'on ne peut pas la contourner.

Ce document **ne refait pas** :
- les incidents de cybersécurité français (DGFiP, FICOBA, fuites 2020-2026) : voir [`recherche-cybersecurite-france.md`](recherche-cybersecurite-france.md) ;
- le coût de l'informatique publique, de l'entité logicielle unique et les échecs ONP / Sirhen / Louvois chiffrés : voir [`modeles/etat-plateforme/`](../modeles/etat-plateforme/methode.md) et [`recherche-simplification-et-depenses-interrogeantes.md`](recherche-simplification-et-depenses-interrogeantes.md) ;
- le nombre d'heures de conformité fiscale (Estonie 50 h…) : voir ce même fichier.

Limite de méthode : environ 25 recherches web. Plusieurs références sont citées à partir de leur résumé officiel (abstract, communiqué) et non de leur texte intégral ; c'est indiqué à chaque fois.

---

## 1. La complexité comme source de détournement

### 1.1 Ce que la recherche établit

- **[F] Définition de travail (Slemrod).** Joel Slemrod mesure la complexité fiscale comme la somme des **coûts de conformité** (supportés par les contribuables) et des **coûts administratifs** (supportés par l'État)[^slemrod]. Cette définition rend la complexité chiffrable. C'est celle qu'il faut garder pour le livre.
- **[E] Les coûts de conformité augmentent.** Benzarti et Wallossek (NBER, déc. 2023) utilisent le nombre de mots des codes fiscaux de plusieurs pays depuis le début des années 1980 comme indicateur. Les coûts de conformité y augmentent régulièrement[^benzarti]. *Limite : le nombre de mots est un indicateur indirect.*
- **[E] Complexité réglementaire et corruption vont ensemble.** Djankov, La Porta, Lopez-de-Silanes et Shleifer (*QJE*, 2002) étudient 85 pays. Les pays où créer une entreprise exige le plus de procédures ont **plus de corruption et une économie informelle plus grande**, sans meilleure qualité des biens publics ou privés[^djankov]. Ils lisent ce résultat comme un argument contre la théorie de l'intérêt public : la réglementation d'entrée profiterait aux politiques et aux bureaucrates.
  - *Limite* : c'est une **corrélation entre pays**, pas une causalité démontrée. Les auteurs mesurent les exigences officielles, pas directement la corruption.
- **[O] Le mécanisme (Tanzi).** Vito Tanzi, ancien directeur des finances publiques au FMI, résume la chaîne : la complexité facilite la corruption, qui facilite l'évasion[^tanzi]. Chaque exception crée un pouvoir discrétionnaire, et chaque pouvoir discrétionnaire peut se vendre. C'est un argument de synthèse, pas une mesure.
- **[E] Attention à l'ordre des réformes (FMI).** Ivanyna, Mourmouras et Rangazas (document de travail FMI 2010, publié dans *Economic Inquiry* en 2016) modélisent une « culture de la corruption » : l'évasion des contribuables répond à la corruption des agents publics. Conséquence de leur modèle : **réprimer l'évasion avant de traiter la corruption peut être contre-productif**[^ivanyna]. Ils estiment aussi des effets négatifs sur la croissance significatifs mais modérés.

### 1.2 Ce que la simplification a réellement donné : les flat taxes

- **[E] Russie, 2001 : moins d'évasion, mais pas pour la raison attendue.** Gorodnichenko, Martinez-Vazquez et Sabirianova Peter (*Journal of Political Economy*, 2009) mesurent l'évasion par l'écart entre consommation et revenu déclaré des ménages (panel 1998-2004)[^gorodnichenko]. Trois résultats :
  1. l'évasion baisse nettement après le passage au taux unique de 13 % ;
  2. cette baisse tient à la **conformité volontaire**, pas à un renforcement des contrôles ;
  3. l'effet sur l'effort productif est **faible** comparé à l'effet sur l'évasion. Le gain d'efficacité est au moins 30 % plus faible que ne le prédisent les méthodes classiques.
- **[E] Bilan d'ensemble (FMI).** Keen, Kim et Varsano (*International Tax and Public Finance*, 2008) comparent les flat taxes d'Europe de l'Est[^keen]. Elles sont **très différentes entre elles**, et les preuves de leurs effets sont **minces**. Leur pronostic : la vraie question n'est pas de savoir si d'autres pays les adopteront, mais si ceux qui les ont adoptées les abandonneront.
  - **[F, relu le 31/10/2026 (V1546)]** C'est ce qui s'est passé en partie : la Slovaquie (flat tax de 19 % introduite en 2004) est passée en janvier 2013 à deux tranches (19 % et 25 % au-delà d'environ 34 400 €) ; la République tchèque a **conservé** son taux unique de 15 % mais y a ajouté en 2013 une surtaxe de solidarité de 7 % au-delà de 48 fois le salaire moyen, remplacée par une progressivité à partir de 2021 (⚠️ ce dernier point : source secondaire seulement, résumé de recherche). Source : LSE EUROPP, 18/03/2013 (résumé WebFetch, non lu intégralement).
- **[O] Ce qu'il faut en retenir pour le livre.**
  - Un barème simple **réduit l'évasion** quand il réduit l'intérêt de frauder : le cas russe est la meilleure preuve disponible.
  - Il ne produit pas le choc de croissance promis par ses défenseurs.
  - Et il ne rend pas le système **incontournable**. L'évasion des plus riches passe par l'assiette (holdings, transferts de bénéfices, résidence), pas par le barème.
- **[F] Avertissement sur les classements.** Le classement *Doing Business* de la Banque mondiale, d'où viennent les indicateurs « Paying Taxes » (heures de conformité), a été **arrêté en septembre 2021** à la suite d'irrégularités dans ses données (communiqué de la Banque mondiale du 16/09/2021 relu le 31/10/2026, V1547 : les irrégularités ont été signalées en interne en juin 2020 et concernent les éditions *Doing Business 2018 et 2020* ; la direction a décidé d'arrêter le rapport). Les comparaisons d'heures de conformité citées dans le dépôt doivent être présentées avec cette réserve.

### 1.3 Le contournement par le haut : la leçon de la transparence bancaire

- **[E] Johannesen et Zucman (*AEJ: Economic Policy*, 2014).** Ils évaluent la vague de traités d'échange d'informations imposée aux paradis fiscaux par le G20 en 2009[^zucman]. Résultat : les fraudeurs **n'ont pas rapatrié leurs dépôts**. Ils les ont **déplacés vers les paradis non couverts**.
  - Leçon directe pour la thèse « si simple qu'on ne peut pas contourner » : un système national, même simple, **se contourne par la frontière** tant que la couverture n'est pas complète.
  - Le projet doit donc être pensé avec l'échange automatique d'informations, le Pilier 2 de l'OCDE et la taxation des ressortissants ; voir V3 dans [`verifications.md`](../verifications.md).

---

## 2. Transparence et données ouvertes contre la corruption

### 2.1 Ce qui marche (avec preuves)

- **[E] Audits publiés au Brésil (Ferraz et Finan, *QJE*, 2008).** La CGU, le corps de contrôle fédéral brésilien, audite des communes **tirées au sort** et publie les résultats. Les maires corrompus audités avant l'élection de 2004 ont été **moins réélus**, surtout là où une radio locale relayait les audits[^ferraz]. C'est l'une des preuves causales les plus solides de la littérature : **la transparence agit quand elle est relayée et quand les électeurs peuvent sanctionner**.
- **[E] Marchés publics électroniques en Inde et en Indonésie (Lewis-Faupel, Neggers, Olken et Pande, *AEJ: Economic Policy*, 2016).** La passation en ligne réduit les contacts en face à face entre entreprises et fonctionnaires[^olken]. Résultats :
  - **aucune baisse des prix** ;
  - une **meilleure qualité** : routes de meilleure qualité en Inde, moins de retards en Indonésie ;
  - davantage de gagnants venus d'autres régions, que les auteurs lisent comme l'entrée d'entreprises plus compétentes.
- **[E] ProZorro (Ukraine).** Plateforme de marchés publics ouverte, généralisée en 2016, conçue avec la société civile, avec des données publiées en format *Open Contracting*.
  - Kyiv School of Economics (2022) : économies estimées à **plus de 5 %** pour les procédures d'appel d'offres et à **plus de 10 %** pour la place de marché, par rapport aux achats hors concurrence. Les écarts vont de 1 % à 20 % selon les marchés[^kse].
  - Open Contracting Partnership (2018) : économies **jusqu'à 30 %** quand il y a plus de cinq soumissionnaires, et des acheteurs qui élargissent leur base de fournisseurs de 20 %[^ocp]. *Ce sont des chiffres de suivi, pas une évaluation économétrique indépendante.*
  - **Contre-preuve** : des études ukrainiennes trouvent une concurrence d'environ **deux offres en moyenne, en baisse**, et soupçonnent des ententes[^dmytryshyn]. La transparence n'empêche pas la collusion. Elle la rend en revanche **détectable** : l'outil de veille citoyenne DOZORRO s'appuie sur ces données.
- **[O] Le schéma commun.** Ce qui marche, c'est une donnée **structurée, exhaustive et exploitable par des tiers** (presse, ONG, concurrents), **couplée à une sanction** (électorale, judiciaire ou commerciale). Publier sans personne pour lire ni sanctionner ne suffit pas.

### 2.2 Ce qui marche moins, ou se heurte au droit

- **[F] Registres des bénéficiaires effectifs : le coup d'arrêt de la CJUE.** Dans l'arrêt du **22 novembre 2022** (affaires jointes C-37/20 et C-601/20, *WM et Sovim*), la Cour de justice de l'UE a **invalidé l'accès du grand public** aux registres des bénéficiaires effectifs prévu par la 5ᵉ directive anti-blanchiment. Motif : atteinte disproportionnée à la vie privée et à la protection des données (articles 7 et 8 de la Charte)[^cjue]. Plusieurs registres nationaux ont été fermés ou restreints à un « intérêt légitime ».
  - Pour le projet, c'est une **contrainte juridique nommée** : la transparence totale se heurte à la Charte des droits fondamentaux. Une nouvelle Constitution française n'y change rien tant que la France reste dans l'UE.
- **[E] Efficacité des registres : preuves encore minces.** Selon le U4 (Chr. Michelsen Institute), les registres aident les enquêteurs, mais leur mise en œuvre est inégale et **les preuves d'efficacité restent limitées**, car les registres sont récents[^u4]. Les données sont souvent auto-déclarées et peu vérifiées.
  - **[F, corrigé le 31/10/2026, V1548]** L'étude *Puppet Masters* de la Banque mondiale (StAR, 2011) a examiné environ 150 dossiers de grande corruption et conclut que, **dans la grande majorité** d'entre eux, un véhicule juridique (le plus souvent une société) a été détourné pour masquer la propriété. Le chiffre de « plus de 70 % » est **retiré** : dans le texte du rapport lu (premières 100 000 signes, WebFetch sur la version texte, la suite non lue), « plus de 70 % » n'apparaît que dans une note et concerne la part des **pays évalués** par le GAFI qui n'exigeaient pas clairement l'identification du bénéficiaire effectif, pas la part des dossiers. Aucun pourcentage de dossiers n'est donné dans la partie lue ; un résumé de recherche avance 128 dossiers sur 150, non confirmé.

---

## 3. Les échecs de l'automatisation publique : ce qu'il faut connaître

Point commun aux cinq cas : **ce n'est pas l'informatique qui a échoué seule**. Une règle juridiquement fragile, appliquée en masse par une machine, a été couverte par une institution qui a refusé de croire les personnes concernées.

### 3.1 Robodebt (Australie, 2015-2020)

- **[F] Le mécanisme.** L'administration sociale (Centrelink) calculait automatiquement des « dettes » en **lissant** sur l'année le revenu annuel déclaré au fisc (*income averaging*), alors que les aides dépendent du revenu de chaque quinzaine. C'était ensuite **à l'allocataire de prouver** qu'il ne devait rien.
- **[F] La chute.** La Cour fédérale a jugé le dispositif **illégal fin 2019** ; il a pris fin en 2020[^robodebt-pm].
- **[F] La commission royale.** Rapport final du **7 juillet 2023**, présidé par Catherine Holmes : « un mécanisme grossier et cruel, ni juste ni légal, qui a fait se sentir criminelles de nombreuses personnes ». Il compte **57 recommandations** (**levé le 31/10/2026, V2230** : la page officielle de la commission, robodebt.royalcommission.gov.au/publications/report, lue dans Chrome le 31/10/2026, écrit « a list of 57 recommendations of this Commission » ; elle précise que le rapport, publié le 7/07/2023, a été corrigé et republié le 11/07/2023 ; le chiffre de 56 vient de la réponse du gouvernement, qui ne reprend pas le même décompte, selon des pages de presse et de Services Australia non relues) et un chapitre scellé de renvois pour poursuites[^robodebt-pm][^robodebt-jurist]. Le gouvernement parle de **plus de 500 000 victimes**.
- **[E, ⚠️ chiffre de presse non confirmé]** Sur plus de 780 000 dossiers réexaminés, 435 000 dettes étaient trop élevées ou inexistantes : **non retrouvé** en source primaire (V1549). **Corrigé** sur l'action collective : l'accord de 2021 approuvé par la Cour fédérale (11/06/2021) porte sur **112 M AUD** d'indemnisation (Services Australia, résumés de recherche) ; le « 1,8 Md AUD » est un total agrégé (remboursements, dettes annulées, indemnisation) cité par des communiqués ministériels (≈ 1,76 Md AUD, non lus : 403) et non le montant de la transaction. Une seconde transaction de 548,5 M AUD a été approuvée le 23/06/2026 après appel (Services Australia, résumé de recherche). Le rapport de la commission royale (7/07/2023) n'a pas pu être lu (délai dépassé) : « plus de 400 000 dettes annulées ou remboursées » selon ses lettres patentes.
- **Leçons de la commission** (d'après les comptes rendus) :
  - des **avis juridiques** sur l'illégalité ont été ignorés ou enterrés ;
  - la **charge de la preuve** a été inversée ;
  - il faut une base légale explicite pour toute décision automatisée.

### 3.2 Toeslagenaffaire (Pays-Bas, allocations de garde d'enfants)

- **[F] Le rapport.** Rapport de la commission d'enquête parlementaire *Ongekend onrecht* (« Une injustice sans précédent »), remis le **17 décembre 2020** (président : Chris van Dam)[^toeslagen]. Constat : **les principes fondamentaux de l'État de droit ont été violés**. La responsabilité est partagée :
  - par l'administration fiscale ;
  - par le législateur, qui avait voulu une loi « dure » contre la fraude ;
  - par les juridictions administratives, qui ont validé pendant des années une application rigide en écartant les principes de bonne administration jusqu'en octobre 2019.
- **[F] Les suites.** Le gouvernement Rutte III a démissionné le **15 janvier 2021**. Une indemnisation forfaitaire de **30 000 €** a été promise aux victimes[^toeslagen].
- **[F] La discrimination dans les données.** L'Autorité néerlandaise de protection des données a infligé une amende de **2,75 M€** (décembre 2021) : la **double nationalité** était traitée de façon « illicite et discriminatoire » et conservée alors qu'elle aurait dû être effacée en 2014. Elle concernait environ 1,4 million de personnes en 2018. Une autre amende de **3,7 M€** a sanctionné la « liste noire » de signalement de fraude (FSV)[^ap].
- **[F] Le précédent SyRI.** Le 5 février 2020, le tribunal de La Haye a jugé contraire à l'article 8 de la Convention européenne des droits de l'homme la loi néerlandaise **SyRI**, un système de croisement de données pour détecter la fraude sociale. Motifs : manque de transparence et de vérifiabilité, non-respect de la limitation des finalités et de la minimisation des données. Le tribunal ajoute que l'État a une **« responsabilité particulière »** quand il déploie de nouvelles technologies (ECLI:NL:RBDHA:2020:865 ; version anglaise ECLI:NL:RBDHA:2020:1878)[^syri].

### 3.3 Horizon (Post Office, Royaume-Uni, 1999-2015)

- **[F] Le scandale.** Le logiciel comptable Horizon (ICL, puis Fujitsu) produisait des **déficits fictifs** dans les bureaux de poste. Le Post Office a poursuivi des centaines de sous-postiers en soutenant que ses données étaient toujours exactes.
- **[F] Le rapport.** Volume 1 du rapport final de l'enquête publique (Sir Wyn Williams), **8 juillet 2025** (HC 1119)[^horizon] :
  - des personnes au Post Office, chez Fujitsu et chez ICL **savaient ou auraient dû savoir** que l'ancien Horizon avait des défauts ;
  - le Post Office a entretenu la fiction d'une donnée toujours exacte ;
  - environ **10 000 personnes** ont été touchées, et **13 suicides** sont mentionnés selon la presse[^horizon-reg].
- **[F, V1550]** Le jugement *Bates v Post Office* (n° 6, *Horizon Issues*, [2019] EWHC 3408 (QB), juge Fraser) a établi que le système contenait des bugs pouvant causer des écarts comptables (⚠️ jugement non relu : BAILII derrière une vérification anti-robot, **bloqué** ; page judiciary.uk introuvable). En 2024, une loi spéciale a annulé les condamnations pour les « infractions concernées » : *Post Office (Horizon System) Offences Act 2024* (2024 c. 14), relue sur legislation.gov.uk (article 1 : annulation de certaines condamnations ; articles 5 et 6 : effacement de certains avertissements en Angleterre-Galles et en Irlande du Nord). Périmètre : la loi vise des catégories d'infractions définies, pas « en bloc » toutes les condamnations.
- **Leçon clé** : la présomption, en droit anglais, que l'ordinateur fonctionne correctement sauf preuve contraire. **Une donnée produite par une machine doit pouvoir être contestée**, et c'est à l'opérateur du système d'en prouver la fiabilité.

### 3.4 Louvois (paie des militaires, France)

- **[F]** Chiffres déjà dans le dépôt : **358 M€ de trop-versés** selon la Cour des comptes (voir [`recherche-simplification-et-depenses-interrogeantes.md`](recherche-simplification-et-depenses-interrogeantes.md)). Abandon annoncé fin 2013, remplacement par Source Solde (Sopra Steria), retrait définitif de Louvois prévu en 2021, avec environ deux ans de retard[^louvois].
- **[F] Causes relevées** : absence de chef de projet unique et pression de la RGPP pour réduire les effectifs avant que l'outil ne fonctionne[^louvois]. En avril 2015, la Cour relevait encore 1 418 erreurs système non résolues.
- **[O] Leçon pour l'État-plateforme** : on a supprimé les agents qui savaient corriger à la main avant que la machine marche. C'est **l'inverse exact** de ce qu'il faut faire lors d'une bascule.

### 3.5 L'algorithme de contrôle de la CNAF (France)

- **[F] Le score de risque.** Chaque allocataire reçoit un score de 0 à 1 qui oriente les contrôles. Les variables incluent les revenus, la situation familiale, le statut de bénéficiaire du RSA ou de chômeur…[^cnaf-amnesty]
- **[F] La bataille du code source.** La Quadrature du Net a demandé le code en 2022. La CNAF a refusé, puis la CADA a rendu un avis favorable à la communication des versions antérieures (décembre 2022). Les associations ont analysé le code obtenu en 2023 : les variables pèsent davantage sur les plus précaires.
- **[F] Le recours.** Le **16 octobre 2024**, 15 organisations (La Quadrature du Net, Amnesty International France, Fondation Abbé Pierre…) ont saisi le **Conseil d'État** ; la coalition compte depuis 25 membres[^cnaf-amnesty][^cnaf-fap].
- **[F, V1551]** La CNAF a ensuite publié elle-même ses critères et le code source de ses programmes de score (le 15/01/2026 selon La Quadrature du Net, partie au litige ; « mi-janvier » selon Le Monde Informatique du 05/02/2026)[^cnaf-lmi]. Le recours devant le Conseil d'État (15 associations, fin 2024, rejointes par 10 autres le 20/01/2026) se poursuit. **Aucune décision du Conseil d'État n'a été trouvée** à la date de consultation (V1551) : ⚠️ à suivre.
- **[O] Leçon** : l'open source **n'a pas suffi**. La question restante n'est pas « le code est-il public ? » mais « **qui est ciblé, et est-ce juste ?** ». La transparence rend le débat possible ; elle ne le tranche pas.

### 3.6 Leçons transversales des commissions d'enquête

Synthèse [O] des rapports cités :

1. **Base légale d'abord** : Robodebt et SyRI sont tombés sur le droit, pas sur la technique.
2. **Charge de la preuve** : jamais sur le citoyen face à une donnée produite par une machine (Robodebt, Horizon).
3. **Voie de recours humaine, rapide et réelle** : pas un formulaire en boucle.
4. **Variables interdites ou surveillées** (nationalité, adresse, handicap) : Toeslagen, CNAF.
5. **Ne pas supprimer la capacité humaine avant que la machine marche** : Louvois.
6. **Protéger et écouter les lanceurs d'alerte** : Horizon, Robodebt.
7. **Pas d'objectif chiffré de recouvrement** imposé à un algorithme : la pression budgétaire a joué dans Robodebt et Toeslagen (⚠️ à documenter précisément dans les rapports ; non confirmé le 31/10/2026 : une recherche n'a pas retrouvé, pour Robodebt, de source disant qu'il s'agissait d'une mesure d'économie budgétaire, V1570).

---

## 4. L'IA dans l'administration, contre la fraude et la corruption

### 4.1 Cas réels en France

- **[F] DGFiP, détection de la fraude des particuliers (Cour des comptes, 15 novembre 2023)**[^ccomptes-fraude] :
  - **30 %** des contrôles fiscaux proviennent d'anomalies détectées par algorithme ;
  - 155 000 propositions de contrôle en 2022, environ trois fois plus qu'en 2018 ;
  - le projet de détection des **piscines** par images aériennes a coûté 25,9 M€ sur trois ans, pour 20 000 piscines détectées et environ 10 M€ recouvrés.
  - **Constats critiques** :
    - il n'existe pas d'estimation statistique de la fraude, ce que la Cour qualifie de « carence majeure » : on ne sait pas quelle part de la fraude est détectée ;
    - le système d'information **ne relie pas le motif d'un contrôle à son résultat**, si bien qu'on ne sait pas mesurer ce que l'IA rapporte réellement.
  - [F, corrigé le 31/10/2026, V1557] Selon le rapport d'activité 2023 de la DGFiP (page et cahier statistique du ministère, résumés de recherche, rapport complet non lu), **56 %** des contrôles seraient ciblés par IA (« +7 % » par rapport à 2022 : points ou pourcentage relatif non précisé). Le chiffre de **15,2 Md€** est le montant de droits et pénalités rappelés par le **contrôle fiscal dans son ensemble** en 2023 (10,6 Md€ encaissés), et **non** le produit des seuls contrôles issus du datamining : la phrase précédente était erronée. Ces chiffres ne sont pas comparables à ceux de la Cour (périmètres différents).
- **[F] CNAF** : voir §3.5.
- **[F] Cadre juridique français des décisions algorithmiques.**
  - Le **Conseil constitutionnel** (décision n° 2018-765 DC du 12 juin 2018) interdit de fonder **exclusivement** une décision administrative individuelle sur un algorithme **susceptible de réviser lui-même les règles qu'il applique** sans contrôle du responsable du traitement[^cc2018].
  - L'article L311-3-1 du code des relations entre le public et l'administration (CRPA) impose de **mentionner** l'usage d'un traitement algorithmique et d'en communiquer les règles sur demande.
  - Le **Défenseur des droits** (rapport du 13 novembre 2024, *Algorithmes, systèmes d'IA et services publics : quels droits pour les usagers ?*) constate que les décisions fondées sur des algorithmes se multiplient. Il demande un **droit à l'explication** des décisions automatisées ou partiellement automatisées, une **intervention humaine réelle** (pas une validation de façade) et des **sanctions** en cas de manquement aux obligations de transparence, qui n'existent pas aujourd'hui[^ddd].
- **[O]** Le projet de l'auteur parle de « logiciels auto-apprenants » (positions de l'auteur sur les ESN). Pour des **décisions individuelles**, c'est précisément ce que la décision de 2018 encadre. Contrainte constitutionnelle à nommer.

### 4.2 L'AI Act européen (règlement (UE) 2024/1689)

- **[F] Ce qui est interdit.** La **notation sociale** (par des acteurs publics comme privés, art. 5 §1 c) relu sur EUR-Lex le 31/10/2026, V1043) fait partie des pratiques interdites (article 5), applicables depuis le **2 février 2025**[^aiact][^aiact-dates].
- **[F] Ce qui est « à haut risque » (annexe III)**[^aiact-annexe] :
  - point 5 a) : les systèmes utilisés par les autorités publiques pour **évaluer l'éligibilité aux prestations et services d'assistance publique**, ou pour accorder, réduire, révoquer ou récupérer ces prestations. C'est exactement le terrain de Robodebt, de Toeslagen et de la CNAF ;
  - point 8 b) : les systèmes destinés à **influencer le résultat d'une élection ou d'un référendum**, ou le vote des électeurs. Texte relu le 31/10/2026 (V1552, reproduction de l'annexe III, non EUR-Lex) : « systèmes d'IA destinés à être utilisés pour influencer le résultat d'une élection ou d'un référendum ou le comportement électoral de personnes physiques », avec exclusion des systèmes dont les sorties n'exposent pas directement les personnes (outils logistiques de campagne). L'« espace préalable d'information par une IA sourcée » voulu par l'auteur devra être examiné au regard de ce point.
- **[F] Les obligations.**
  - Gestion des risques, qualité des données, journalisation, **contrôle humain** (article 14) ;
  - pour les déployeurs publics, une **analyse d'impact sur les droits fondamentaux** avant la première utilisation (article 27)[^aiact-dates].
- **[F, corrigé le 31/10/2026] Calendrier.** Le report n'est plus un projet : le **règlement (UE) 2026/1744** (omnibus numérique sur l'IA) a été publié au JOUE le **24 juillet 2026** et est entré en vigueur le **27 juillet 2026** (**texte officiel lu sur EUR-Lex dans le navigateur le 31/10/2026** : « RÈGLEMENT (UE) 2026/1744 DU PARLEMENT EUROPÉEN ET DU CONSEIL du 8 juillet 2026 modifiant les règlements (UE) 2024/1689, (UE) 2018/1139 et (UE) 2023/1230 [...] (train de mesures omnibus numérique sur l'IA) », JO série L, 24.7.2026 ; art. 4 : entrée en vigueur le troisième jour suivant la publication). Point 40 de l'article 1er, qui modifie l'article 113, troisième alinéa, du règlement 2024/1689 : (a) chapitres I et II au 2 février 2025, sauf l'article 5 §1 al. 1 points b bis) et b ter) et §§ 1 bis et 1 ter, applicables au **2 décembre 2026** (nouvelles interdictions, voir ci-dessous) ; (c) chapitre III sections 1 à 3 (hors art. 6 §5) : **2 décembre 2027** pour les systèmes à haut risque de l'article 6 §2 et de l'annexe III, **2 août 2028** pour ceux de l'article 6 §1 et de l'annexe I ; (d) articles 102 à 110 applicables au 27 juillet 2026. Les autres alinéas de l'article 113 (dont l'application générale, au 2 août 2026 dans le texte d'origine, et chapitre III section 4, chapitres V, VII, XII au 2 août 2025) ne sont pas modifiés par ces points : à relire dans la version consolidée ; le considérant 1 du règlement de report dit que toutes les règles s'appliqueront « au plus tard le 2 août 2027 »[^aiact-dates].

### 4.3 IA contre la corruption : ce qu'on sait

- **[O] Les preuves solides portent sur des outils simples** : publication structurée (ProZorro), audits aléatoires publiés (Brésil), passation électronique (Inde, Indonésie). Les indicateurs de risque (« drapeaux rouges » : offre unique, délais anormalement courts…) sont un usage établi des données ouvertes de marchés publics.
- **[⚠️ inconnu]** Cette recherche n'a trouvé **aucune évaluation d'impact rigoureuse** (essai randomisé ou quasi-expérience) montrant qu'une IA générative réduit la corruption dans une administration. **Le livre doit le dire** : c'est une hypothèse de l'auteur, plausible, pas un fait établi.
- **[O] Le paradoxe de la DGFiP** : elle a massivement automatisé le ciblage, mais ne sait pas mesurer ce que cela rapporte (Cour des comptes 2023). Une IA anticorruption devrait être **évaluée dès sa conception** : relier chaque signalement à son résultat, publier les taux de faux positifs par catégorie de population.

### 4.4 L'IA comme guichet pour les personnes éloignées du numérique

- **[⚠️ inconnu]** Aucune évaluation publique d'un guichet conversationnel par IA générative auprès des publics éloignés du numérique n'a été trouvée dans cette recherche. C'est une piste à creuser (Défenseur des droits, DINUM, retours d'expérience Albert / France services).
- **[O] Risques connus**, déduits des cas du §3 :
  - une IA qui **se trompe avec aplomb** sur un droit social reproduit l'asymétrie de Robodebt : la personne la moins armée est celle qui a le moins de moyens de vérifier ;
  - si le guichet IA **remplace** le guichet humain au lieu de s'y ajouter, il exclut ceux qui ne parlent pas, n'entendent pas ou se méfient de la machine.
  - Le Défenseur des droits rappelle depuis des années qu'il faut **toujours conserver une alternative humaine**.

---

## 5. Le vote électronique

### 5.1 Estonie (i-voting depuis 2005)

- **[F] Halderman et al. (ACM CCS 2014).** Springall, Finkenauer, Durumeric, Kitcat, Hursti, MacAlpine et Halderman ont observé le scrutin, lu le code et reproduit le système en laboratoire[^halderman]. Résultats :
  - des **attaques possibles côté serveur** (modifier des votes) et **côté client** (logiciel malveillant sur l'ordinateur de l'électeur) ;
  - des **failles de procédure** : logiciels téléchargés par des connexions non sûres, mots de passe filmés lors des vidéos de transparence.
  - Ils recommandaient d'**arrêter** le vote par internet. L'Estonie a contesté et poursuivi.
- **[F] Rapport de l'OSCE/BIDDH sur les législatives de 2023** (publié le 30 août 2023)[^osce] :
  - le vote par internet a été administré efficacement, avec des difficultés techniques mineures ;
  - la confiance reste élevée, mais certains partis ont contesté publiquement son intégrité ;
  - le BIDDH recommande de **répondre à ces doutes**, de renforcer les tests complets avant déploiement et la **transparence** du traitement.
  - Part des votes exprimés en ligne en 2023 : **51,1 %** des votants (313 514 votes électroniques, dont 312 182 comptés), valimised.ee, relu le 31/10/2026 (V1553). Pour mémoire : 43,8 % en 2019 (247 232).
- **[F, V734 + V1559 : chiffre confirmé en presse, RIA non lu] La puce de la carte d'identité n'est pas invulnérable.** En 2017, la faille « ROCA » (bibliothèque cryptographique Infineon) a touché les cartes d'identité estoniennes. **Corrigé le 31/10/2026 (V734)** : le chiffre est d'environ **760 000** cartes (et non 750 000) selon la presse de l'époque et les autorités estoniennes ; l'autorité estonienne RIA parle ensuite de « 800 000 » cartes ; l'équipe de Masaryk (CROCS) parle de « about 760,000 » clés vulnérables. Certificats suspendus début novembre 2017, mise à jour jusqu'à fin mars 2018 ; aucun usage frauduleux connu. Article scientifique : Nemec et al., *The Return of Coppersmith's Attack*, ACM CCS 2017. **Pertinence directe** pour la proposition « identité par puce de carte d'identité ».
- **[F, relu le 31/10/2026 sur valimised.ee, V1558] Le revote estonien** : un électeur peut revoter en ligne autant de fois qu'il veut, seul le dernier vote compte, et un bulletin papier déposé au bureau de vote l'emporte sur tout vote en ligne ; **depuis 2021**, ce bulletin papier peut être déposé jusqu'au soir du scrutin (le vote en ligne ferme le samedi à 20 h). Cela limite la coercition. C'est le principe que propose l'auteur (un vote modifiable jusqu'à la clôture) : il a un précédent réel.

### 5.2 Suisse

- **[F] Test public de 2019.** La Poste suisse a publié le code de son système (fourni par Scytl) et organisé un test d'intrusion public rémunéré du 25 février au 24 mars 2019[^scrt]. Des chercheurs (Sarah Jamie Lewis, Olivier Pereira, Vanessa Teague) ont alors montré une faille dans la **preuve de mélange** (*shuffle proof*) : quiconque détenait certains paramètres secrets pouvait produire une preuve valide **après avoir modifié des votes, sans que l'audit le détecte**. La faille avait été signalée dès 2017 et mal corrigée[^itnews].
- **[F, relu le 31/10/2026, V1554] Les suites.** La Poste a retiré son système. Le Conseil fédéral a renoncé, le 26 juin 2019, à faire du vote électronique un canal ordinaire et a refondu le cadre. Le nouveau système de La Poste, à **vérifiabilité complète**, est utilisé **depuis le 18 juin 2023** à Bâle-Ville, Saint-Gall et Thurgovie, et aux Grisons depuis le 3 mars 2024[^ch-lucerne].
- **[F] Un incident récent.** Le 8 mars 2026, **2 048 votes électroniques** à Bâle-Ville **n'ont pas pu être déchiffrés ni comptés**, à cause d'irrégularités avec des clés USB protégées par code PIN servant à la clé de déchiffrement[^ch-bale]. Suites :
  - la Chancellerie n'a pas mis en cause le système de La Poste, mais **n'exclut pas l'erreur humaine** ;
  - une procédure pénale a été ouverte ;
  - Bâle-Ville a suspendu ses essais jusqu'au 31 décembre 2026.
  - **Leçon** : la faille n'était pas dans la cryptographie, mais dans la **gestion des clés par des humains**.
- **[F] Une échelle limitée.** Le vote électronique suisse reste un **essai à électorat plafonné**, surtout pour les Suisses de l'étranger : environ 181 000 électeurs, soit 3,24 % du corps électoral, pour le scrutin du 27 septembre 2026[^ch-lucerne].

### 5.3 Ce que recommandent les chercheurs et les autorités

- **[F] Académies nationales des États-Unis, *Securing the Vote* (2018)**[^nasem] :
  - **bulletins papier lisibles par un humain** ;
  - **audits à limitation de risque** (*risk-limiting audits*) avant la certification ;
  - **pas de transmission des votes par internet** tant que des garanties robustes de sécurité et de vérifiabilité n'existent pas (recommandation 5.11).
  - Ronald Rivest, coauteur, résume les trois priorités : papier, audits, pas d'internet.
- **[E] Blockchain : « de mal en pis ».** Park, Specter, Narula et Rivest (*Journal of Cybersecurity*, 2021) concluent que le vote par internet et le vote par blockchain **augmentent le risque de défaillances non détectées à l'échelle d'un pays entier**[^park]. Autres conclusions :
  - les gains de participation ne sont **pas démontrés** ;
  - la blockchain **ne résout aucun** des problèmes de fond : l'appareil de l'électeur, la contrainte, la vérifiabilité ;
  - elle en ajoute de nouveaux.
  - Cas concrets (relus le 31/10/2026) : le chiffrement du système de Moscou (2019) a été cassé par Gaudry et Golovnev (Financial Cryptography 2020, p. 32-49 ; **confirmé** V1560, préprint arXiv 1908.05127 : clés trop petites et schéma ElGamal vulnérable, corrigés après signalement) ; l'application Voatz (utilisée en Virginie-Occidentale en 2018) a été jugée vulnérable par Specter, Koppel et Weitzner (USENIX Security 2020, p. 1535-1553 ; **confirmé** V1560, page USENIX via recherche).
- **[F, relu le 31/10/2026 sur bundesverfassungsgericht.de] Cour constitutionnelle fédérale allemande, 3 mars 2009** (2 BvC 3/07 et 2 BvC 4/07). Le principe de **publicité des élections** exige que les étapes essentielles du scrutin puissent être **vérifiées par un citoyen sans connaissances techniques particulières**. Texte du leitmotiv : les étapes essentielles doivent pouvoir être vérifiées « ohne besondere Sachkenntnis ». Nuance : c'est l'**usage des machines Nedap en 2005** et le règlement fédéral sur les appareils de vote qui ont été jugés contraires au principe de publicité (art. 38 et 20 de la Loi fondamentale) ; les élections n'ont **pas** été annulées. (Ce n'est pas la décision du 30 juin 2009 sur le traité de Lisbonne, 2 BvE 2/08, qui est autre.) C'est la contrainte de principe la plus forte contre un vote purement électronique : **l'open source ne suffit pas, car il faut savoir lire le code**.
- **[F, V1555]** Conseil de l'Europe, recommandation CM/Rec(2017)5 sur les normes du vote électronique, adoptée le 14/06/2017 par le Comité des Ministres (1289e réunion) ; elle remplace Rec(2004)11, couvre notamment les machines à voter et le vote par internet, et n'oblige aucun État à introduire le vote électronique (résumés de recherche ; texte non lu : 403).
- **[F] En France.**
  - La **CNIL** encadre le vote par internet (délibération n° 2019-053 du 25 avril 2019), avec trois niveaux de sécurité selon les enjeux. Un projet de mise à jour, élaboré avec l'ANSSI, a été soumis à consultation début 2025. **Corrigé le 31/10/2026 (V1556)** : la CNIL a adopté une recommandation actualisée le **19 mars 2026** (délibération n° 2026-045), publiée le 24/04/2026, avec trois niveaux de risque ; elle s'applique à tout nouveau scrutin, les scrutins déjà en préparation pour 2026 pouvant encore appliquer la version de 2019 (page CNIL relue)[^cnil].
  - L'**ANSSI** a publié un guide de recommandations pour le vote par internet **« pour les élections non politiques »** : projet soumis à consultation en 2025 (**dates expliquées, V2231** : la page de l'ANSSI « Appel à commentaires… [CLOS] », lue dans Chrome le 31/10/2026, est publiée le **10 mars 2025** et dit qu'un projet de **recommandation (CNIL)** a été publié le **20 janvier 2025** ; les deux dates désignent donc deux objets distincts, le projet de recommandation de la CNIL et l'appel à commentaires sur le guide de l'ANSSI), publication le **24/04/2026** (page MesServicesCyber relue ; PDF non lu)[^anssi]. Le guide précise qu'il « couvre uniquement » le vote par internet pour les **élections non politiques**. **Corrigé** : l'ancienne phrase « l'ANSSI ne cautionne pas le vote par internet pour les élections politiques » était une interprétation de Claude ; le guide les exclut de son périmètre, il ne dit pas (dans la page lue) qu'il les désapprouve (V1556).
  - **[F, V1568]** En 2017, le gouvernement a renoncé au vote par internet des Français de l'étranger aux législatives de juin 2017, sur recommandation de l'ANSSI (la sécurité n'était pas garantie malgré deux tests grandeur nature en décembre 2016 et février 2017) : rapport du Sénat n° 240 (2020-2021), page relue le 31/10/2026 (résumé WebFetch). Le moratoire sur les machines à voter depuis 2008 n'est pas mentionné dans cette page du Sénat. **Confirmé par une autre source primaire (V2232)** : question orale n° 0618S du sénateur Laurent Lafon, séance publique du 24/06/2025 (Sénat, page lue dans Chrome le 31/10/2026), https://www.senat.fr/questions/base/2025/qSEQ25060618S.html : « depuis 2008, un moratoire interdit tout renouvellement ou extension des machines à voter qu'utilisent encore 63 communes françaises représentant quelque 1,5 million d'électeurs » (propos d'un parlementaire, pas un chiffre ministériel ; la réponse du ministre n'a pas été lue en entier).

### 5.4 Ce que cela implique pour le projet de l'auteur

- **[O] Le consensus scientifique est défavorable** au vote politique contraignant par internet, et plus encore par blockchain. L'auteur compare au papier, et il a raison de ne pas exiger la perfection. Mais la recherche identifie trois asymétries que le papier n'a pas :
  1. **l'échelle** : une faille logicielle touche tout le pays d'un coup, alors qu'une fraude papier reste locale ;
  2. **la détectabilité** : une manipulation numérique peut ne laisser aucune trace (cas suisse de 2019) ;
  3. **la vérifiabilité par un non-spécialiste** : c'est le principe posé par la Cour allemande en 2009.
- **[O] Le maillage (« mesh ») et la décentralisation** améliorent la **disponibilité** (on peut voter si le réseau principal tombe). Ils ne règlent **ni l'intégrité** (l'appareil de l'électeur peut être compromis) **ni le secret face à la contrainte** (voter chez soi, c'est pouvoir voter sous le regard d'un proche ou d'un acheteur de voix). registre des positions de l'auteur (non publié) le reconnaît déjà pour Bitcoin : le point faible, c'est l'appareil.
- **[O] Une voie défendable** consisterait à séparer les usages :
  - **consultations, initiatives citoyennes, co-écriture** : numérique, à faible enjeu et réversible ;
  - **votes contraignants à fort enjeu** (Constitution, guerre, loi martiale) : vérifiabilité de bout en bout, **trace papier** ou équivalent auditable, audits à limitation de risque, et un canal physique qui annule le vote en ligne.
  - C'est un **compromis avec la vision de l'auteur**, à soumettre au vote selon sa propre règle.

---

## 6. Le projet de l'auteur face à la recherche

| Élément du projet | Verdict | Ce qui appuie | Ce qui contredit ou manque | Garde-fous recommandés |
|---|---|---|---|---|
| **Fiscalité si simple qu'on ne peut pas la contourner** | **Appuyé en partie, contredit sur « ne peut pas »** | Complexité ↔ corruption (Djankov 2002 ; Tanzi) ; flat tax russe : moins d'évasion par conformité volontaire (Gorodnichenko 2009) | Effets réels minces et hétérogènes (Keen 2008) ; contournement par la frontière (Johannesen et Zucman 2014) ; flat taxes abandonnées | Simplifier l'**assiette** autant que le barème ; échange automatique d'informations ; taxer la nationalité ; mesurer l'écart fiscal (*tax gap*) chaque année |
| **État-plateforme unique, open source, code audité en permanence** | **Appuyé sur la transparence, inconnu sur l'unicité** | Données structurées et ouvertes → contrôle par des tiers (ProZorro, Ferraz et Finan) ; obligation française de communiquer les codes sources (CADA, CRPA) | CNAF : le code publié n'a pas suffi ; Louvois : risque de bascule ; plateforme unique = point de défaillance unique (voir le fichier cybersécurité) | Publication du code **et des données d'entraînement et d'évaluation** ; journal public des changements ; cloisonnement ; jamais supprimer les capacités humaines avant que la machine marche |
| **IA contre la corruption** | **Inconnu (pas d'évaluation rigoureuse trouvée)** | Indicateurs de risque sur données ouvertes ; ciblage DGFiP en hausse | Cour des comptes 2023 : impossible de mesurer le rendement ; les algorithmes de fraude ont produit les pires scandales (Robodebt, Toeslagen, SyRI) | Évaluation intégrée (relier signalement et résultat) ; publication des taux de faux positifs par groupe ; IA = **signalement**, décision humaine motivée ; analyse d'impact (AI Act, article 27) |
| **IA comme guichet pour les personnes éloignées du numérique** | **Inconnu** | Hypothèse plausible : la langue naturelle abaisse la barrière d'entrée | Aucune évaluation trouvée ; risque d'erreur avec aplomb sur des droits | Alternative humaine garantie ; réponses sourcées vers le texte de loi ; l'IA informe mais ne décide pas d'un droit ; droit à l'explication (Défenseur des droits) |
| **Décisions automatisées par « logiciels auto-apprenants »** | **Contredit (droit)** | — | Conseil constitutionnel 2018-765 DC ; AI Act annexe III 5 a) | Règles figées et versionnées pour toute décision individuelle ; apprentissage seulement hors production, validé par un humain |
| **Vote électronique décentralisé, puce de la carte d'identité, biométrie de l'appareil** | **Contredit pour les votes politiques contraignants, en l'état de la recherche** | Estonie : fonctionne depuis 2005 avec une confiance élevée ; revote contre la coercition ; Suisse : vérifiabilité complète depuis 2023 | Halderman 2014 ; Suisse 2019 (faille non détectable) et 2026 (2 048 votes perdus) ; ROCA 2017 (puce) ; Académies américaines 2018 ; Park et al. 2021 ; Cour allemande 2009 ; ANSSI limitée aux élections non politiques | Vérifiabilité de bout en bout (individuelle et universelle) ; trace papier ou canal physique prioritaire ; audits à limitation de risque ; biométrie **uniquement locale** (déjà retenue par l'auteur) ; tests publics rémunérés **avant** usage ; montée en charge graduelle, comme en Suisse |
| **Vote modifiable jusqu'à la clôture** | **Appuyé** | C'est le mécanisme estonien contre la coercition | Ne protège pas contre une contrainte exercée à la dernière minute | Canal physique qui annule le vote en ligne |
| **Transparence totale des bénéficiaires et des patrimoines** | **Contredit en partie (droit de l'UE)** | Les registres aident les enquêteurs (U4) | CJUE, 22/11/2022 : l'accès du grand public est invalidé | Accès pour la presse, les ONG et les chercheurs justifiant d'un intérêt légitime ; vérification des données déclarées |

**[O] Synthèse, sans complaisance.**
- La thèse « la complexité nourrit l'extraction et la corruption » est **bien appuyée**.
- La thèse « la technologie rendra la fraude et la manipulation impossibles » est **contredite** par tous les grands cas d'automatisation publique de la décennie : la machine a **amplifié** l'injustice, à grande échelle et avec l'autorité de l'objectivité.
- La recherche ne dit pas « pas de technologie ». Elle dit : **transparence + voie de recours + vérifiabilité par des non-spécialistes + humain responsable**. Sans ces quatre éléments, l'outil devient l'arme du plus fort, y compris de l'État.
- Sur le vote, le risque est de surestimer la technique. Le livre gagnerait à présenter le système proposé comme un **pari à tester par étapes**, comme le fait la Suisse, et non comme une solution acquise.

---

## 7. Limites de cette recherche

- Plusieurs articles sont cités d'après leur résumé : Djankov, Gorodnichenko, Keen, Park, Lewis-Faupel, Ferraz et Finan. Les effets chiffrés détaillés sont à relire dans le texte intégral avant de rédiger un chapitre.
- Le règlement 2026/1744 et l'article 5 du règlement 2024/1689 ont été lus sur EUR-Lex dans le navigateur le 31/10/2026 (T21 suite, V1043) ; l'annexe III a été lue sur un site miroir non officiel (artificialintelligenceact.eu), à relire sur EUR-Lex. Relue le 01/11/2026 (V2781) sur ce même miroir (copie secondaire ; EUR-Lex répond par un contrôle anti-robot en accès simple) : le point 8 b) y figure (« influencing the outcome of an election or referendum or the voting behaviour of natural persons »), avec l'exclusion des systèmes dont la sortie ne touche pas directement les personnes (outils d'organisation de campagnes) ; l'article 113 y est présenté dans sa version modifiée : application du chapitre III, sections 1 à 3, au 02/12/2027 pour les systèmes de l'article 6, §2 et de l'annexe III, et au 02/08/2028 pour ceux de l'article 6, §1 et de l'annexe I (cohérent avec le règlement 2026/1744, V728). Texte consolidé officiel du JO non lu.
- Le PDF de l'ANSSI n'a pas pu être extrait ; le rapport de la commission Robodebt n'a pas pu être chargé (délai dépassé) ; la page de la Cour des comptes a renvoyé une erreur, et ses chiffres viennent du compte rendu de la Banque des Territoires.
- Rien n'a été recherché sur l'Inde (Aadhaar), le Brésil (urnes électroniques) ou la Corée.
- Aucune étude n'a été trouvée sur le **coût de la corruption en France** (à croiser avec l'AFA ou le SCPC, tâche distincte).

---

## Sources

[^slemrod]: J. Slemrod, travaux sur la complexité fiscale (Brookings, 2000), définition : coûts de conformité + coûts administratifs. https://www.brookings.edu/wp-content/uploads/2016/06/20001201.pdf — consulté le 2026-10-26 (via un résumé de recherche ; ⚠️ le document Brookings n'a pas pu être relu : une note de W. Gale cite plutôt Slemrod, « Complexity, Compliance Costs, and Tax Evasion », 2000, chapitre de *Taxpayer Compliance*, vol. 2 ; la définition « conformité + administration » est attribuée à Slemrod 1984 — V1561).
[^benzarti]: Y. Benzarti, L. Wallossek, NBER Working Paper 31944, déc. 2023. https://www.nber.org/papers/w31944 — consulté le 2026-10-26.
[^djankov]: S. Djankov, R. La Porta, F. Lopez-de-Silanes, A. Shleifer, « The Regulation of Entry », *Quarterly Journal of Economics* 117(1), 2002, p. 1-37. https://shleifer.scholars.harvard.edu/publications/regulation-entry — NBER WP 7892 : https://www.nber.org/papers/w7892 — consulté le 2026-10-26.
[^tanzi]: V. Tanzi, « Corruption, Complexity and Tax Evasion », *eJournal of Tax Research*, vol. 15, n° 2, décembre 2017, p. 144-160 (numéro spécial « Tax and Corruption », vérifié le 31/10/2026 par recherche, V1562). Notice : https://cyberleninka.ru/article/n/corruption-complexity-and-tax-evasion — consulté le 2026-10-26.
[^ivanyna]: M. Ivanyna, A. Mourmouras, P. Rangazas, « The Culture of Corruption, Tax Evasion, and Economic Growth », *Economic Inquiry* 54(1), 2016, p. 520-542 (version FMI 2010). https://ideas.repec.org/a/bla/ecinqu/v54y2016i1p520-542.html — consulté le 2026-10-26.
[^gorodnichenko]: Y. Gorodnichenko, J. Martinez-Vazquez, K. Sabirianova Peter, « Myth and Reality of Flat Tax Reform: Micro Estimates of Tax Evasion Response and Welfare Effects in Russia », *Journal of Political Economy* 117(3), 2009, p. 504-554. NBER WP 13719 : https://www.nber.org/papers/w13719 — consulté le 2026-10-26.
[^keen]: M. Keen, Y. Kim, R. Varsano, « The "flat tax(es)": principles and experience », *International Tax and Public Finance* 15(6), 2008, p. 712-751, DOI 10.1007/s10797-007-9050-z. https://ideas.repec.org/a/kap/itaxpf/v15y2008i6p712-751.html — FMI WP/06/218 : https://www.imf.org/en/Publications/WP/Issues/2016/12/31/The-Flat-Tax-es-Principles-and-Evidence-19892 — consulté le 2026-10-26.
[^zucman]: N. Johannesen, G. Zucman, « The End of Bank Secrecy? An Evaluation of the G20 Tax Haven Crackdown », *American Economic Journal: Economic Policy* 6(1), 2014, p. 65-91, DOI 10.1257/pol.6.1.65. https://eml.berkeley.edu/~saez/course/johannesen-zucmanAEJ14.pdf — consulté le 2026-10-26.
[^ferraz]: C. Ferraz, F. Finan, « Exposing Corrupt Politicians: The Effects of Brazil's Publicly Released Audits on Electoral Outcomes », *QJE* 123(2), 2008, p. 703-745. Résumé J-PAL : https://www.povertyactionlab.org/evaluation/politicians-publicly-released-audits-corruption-and-electoral-outcomes-brazil — consulté le 2026-10-26.
[^olken]: J. Lewis-Faupel, Y. Neggers, B. Olken, R. Pande, « Can Electronic Procurement Improve Infrastructure Provision? Evidence from Public Works in India and Indonesia », *AEJ: Economic Policy* 8(3), 2016, p. 258-283. https://www.nber.org/system/files/working_papers/w20344/w20344.pdf — consulté le 2026-10-26.
[^kse]: Kyiv School of Economics, « The Prozorro impact: what real savings an electronic system delivers », note de politique publique, 2022. https://kse.ua/about-the-school/news/the-prozorro-impact-what-real-savings-an-electronic-system-delivers-policy-brief/ — consulté le 2026-10-26.
[^ocp]: Open Contracting Partnership, « Learning insights: The latest impacts emerging from Ukraine's Prozorro reforms », 12/01/2018. https://www.open-contracting.org/2018/01/12/learning-insights-latest-impacts-emerging-ukraines-prozorro-reforms/ — consulté le 2026-10-26.
[^dmytryshyn]: B. Dmytryshyn et al., *Problems and Perspectives in Management*, 2018 (concurrence en baisse après ProZorro). https://businessperspectives.org/component/zoo/author/bohdan-dmytryshyn — ⚠️ **non retrouvé le 31/10/2026** (V1563) ; repère de remplacement : Transparency International Ukraine note une concurrence passée de 2,3 à 2,05 offres en moyenne (août-décembre 2016, achats sous seuil), https://ti-ukraine.org/en/research/behind-the-scenes-of-prozorro-does-ukrainian-business-trust-public-procurement/ (résumé de recherche, non lu) ; consulté le 2026-10-26.
[^cjue]: CJUE, grande chambre, 22/11/2022, affaires jointes C-37/20 et C-601/20, *WM et Sovim SA c. Luxembourg Business Registers*. Résumé : https://eucrim.eu/news/cjeu-no-unrestricted-access-to-data-of-beneficial-owners/ — communiqué de la Cour (curia.europa.eu, cp220188) : la disposition donnant accès à tout public aux informations sur les bénéficiaires effectifs est invalide (titre lu ; motifs non lus, V1564) ; consulté le 2026-10-26.
[^u4]: U4 Anti-Corruption Resource Centre, « Beneficial ownership registers: progress to date ». https://www.u4.no/publications/beneficial-ownership-registers-progress-to-date/fullversion — et « The uses and impact of beneficial ownership information » : https://www.u4.no/publications/the-uses-and-impact-of-beneficial-ownership-information.pdf — consulté le 2026-10-26.
[^robodebt-pm]: Premier ministre d'Australie, « Final report of the Royal Commission into the Robodebt Scheme », 07/07/2023. https://pm.gov.au/media/final-report-royal-commission-robodebt-scheme — rapport : https://robodebt.royalcommission.gov.au/publications — consulté le 2026-10-26.
[^robodebt-jurist]: JURIST, « Australia Robodebt royal commission hands down findings, recommends referrals for prosecution », 07/2023 (57 recommandations ; 780 000 / 435 000 dossiers). https://www.jurist.org/news/2023/07/australia-robodebt-royal-commission-hands-down-findings-recommends-referrals-for-prosecution/ — consulté le 2026-10-26.
[^toeslagen]: Tweede Kamer, « Eindverslag onderzoek kinderopvangtoeslag overhandigd » (*Ongekend onrecht*), 17/12/2020. https://www.tweedekamer.nl/nieuws/kamernieuws/eindverslag-onderzoek-kinderopvangtoeslag-overhandigd — discours du président : https://www.tweedekamer.nl/sites/default/files/atoms/files/20201217_toespraak_chris_van_dam_parlementaire_ondervragingscommissie_kinderopvangtoeslag_0.pdf — synthèse : https://www.parlement.com/id/vla6g4unpswa — consulté le 2026-10-26.
[^ap]: NOS, « Recordboete voor Belastingdienst vanwege zwarte lijst ». https://nos.nl/l/2424861 — Taxlive, « 2,75 miljoen euro boete voor Belastingdienst om toeslagenaffaire », 12/2021 : https://www.taxlive.nl/nl/documenten/nieuws/2-75-miljoen-euro-boete-voor-belastingdienst-om-toeslagenaffaire/ — source primaire : Autoriteit Persoonsgegevens, décision du 25/11/2021, annonce du 07/12/2021, amende de 2,75 M€ pour traitement discriminatoire et illicite de la double nationalité (résumé de recherche des pages de l'AP, V1565) : https://www.autoriteitpersoonsgegevens.nl/en/current/tax-administration-fined-for-discriminatory-and-unlawful-data-processing ; consulté le 2026-10-26.
[^syri]: Rechtspraak.nl, « SyRI-wetgeving in strijd met het Europees Verdrag voor de Rechten voor de Mens », 05/02/2020. https://www.rechtspraak.nl/organisatie-en-contact/organisatie/rechtbanken/rechtbank-den-haag/nieuws/2020/02/syri-wetgeving-in-strijd-met-het-europees-verdrag-voor-de-rechten-voor-de-mens — consulté le 2026-10-26.
[^horizon]: Post Office Horizon IT Inquiry, *Final Report, Volume 1*, HC 1119, 08/07/2025. https://www.postofficehorizoninquiry.org.uk/volume-1-post-office-horizon-it-inquirys-final-report — PDF : https://www.postofficehorizoninquiry.org.uk/sites/default/files/2025-07/Post%20Office%20Horizon%20IT%20Inquiry%20Final%20Report%20Volume%201.pdf — consulté le 2026-10-26.
[^horizon-reg]: The Register, « Post Office and Fujitsu execs 'should have known' Horizon IT system was flawed », 08/07/2025. https://www.theregister.com/2025/07/08/post_office_horizon_inquiry/ — consulté le 2026-10-26.
[^louvois]: Le Monde Informatique, « La Cour des comptes épingle Source Solde (ex-Louvois) avant sa naissance ». https://www.lemondeinformatique.fr/actualites/lire-la-cour-des-comptes-epingle-source-solde-ex-louvois-avant-sa-naissance-63904.html — Acteurs publics, « Louvois, une succession de responsabilités » : https://acteurspublics.fr/articles/louvois-une-succession-de-responsabilites/ — Cour des comptes, conduite des grands projets numériques (2020) : https://www.ccomptes.fr/sites/default/files/2023-10/20201014-58-2-conduite-grands-projets-numeriques-Etat.pdf — consulté le 2026-10-26.
[^cnaf-amnesty]: Amnesty International France, « France : l'algorithme de la Caisse nationale des allocations familiales cible les plus précaires », 10/2024. https://www.amnesty.fr/actualites/france-l-algorithme-de-la-caisse-nationale-des-allocations-familiales-cible-les-plus-precaire — consulté le 2026-10-26.
[^cnaf-fap]: Fondation Abbé Pierre, « Contentieux CNAF – dossier de presse », 10/2024. https://fondation-abbe-pierre.fr/sites/default/files/2024-10/Contentieux%20CNAF%20-%20Dossier%20de%20presse.pdf — consulté le 2026-10-26.
[^cnaf-lmi]: Le Monde Informatique, « La Cnaf publie le code source de ses programmes de scoring ». https://www.lemondeinformatique.fr/actualites/lire-la-cnaf-publie-le-code-source-de-ses-programmes-de-scoring-99258.html — article du 05/02/2026 (V1551) ; consulté le 2026-10-26.
[^ccomptes-fraude]: Cour des comptes, *La détection de la fraude fiscale des particuliers*, 15/11/2023. https://www.ccomptes.fr/fr/publications/la-detection-de-la-fraude-fiscale-des-particuliers — compte rendu : Banque des Territoires (Localtis), 24/11/2023, https://www.banquedesterritoires.fr/la-cour-des-comptes-tire-un-bilan-nuance-de-lusage-des-algorithmes-de-detection-de-la-fraude — consulté le 2026-10-26 (la page de la Cour était inaccessible ; chiffres repris du compte rendu).
[^cc2018]: Conseil constitutionnel, décision n° 2018-765 DC du 12 juin 2018, *Loi relative à la protection des données personnelles*. https://www.conseil-constitutionnel.fr/decision/2018/2018765DC.htm — relue le 31/10/2026 (WebFetch, 100 000 premiers signes sur 119 188) : l'art. 21 de la loi (décision administrative fondée sur un algorithme) est jugé conforme sous trois conditions (cons. 70) : mention de l'algorithme et communicabilité de ses caractéristiques, recours administratif sans fondement exclusif sur l'algorithme, exclusion des données sensibles ; cons. 71 : le responsable doit maîtriser l'algorithme et ses évolutions (V1566) ; consulté le 2026-10-26.
[^ddd]: Défenseur des droits, *Algorithmes, systèmes d'IA et services publics : quels droits pour les usagers ?*, 13/11/2024. https://www.vie-publique.fr/files/rapport/pdf/296845.pdf — consulté le 2026-10-26.
[^aiact]: Règlement (UE) 2024/1689 du 13 juin 2024 (AI Act), *JOUE* L du 12/07/2024. https://eur-lex.europa.eu/eli/reg/2024/1689/oj — consulté le 2026-10-26 (page non rendue).
[^aiact-annexe]: AI Act, annexe III (texte reproduit). https://artificialintelligenceact.eu/annex/3/ — consulté le 2026-10-26.
[^aiact-dates]: Règlement (UE) 2026/1744 du Parlement européen et du Conseil du 8 juillet 2026 (omnibus numérique sur l'IA), JO série L, 24.7.2026, art. 1er point 40 (art. 113) et art. 4. https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=OJ:L_202601744 — lu dans le navigateur, consulté le 2026-10-31. Source secondaire de la première lecture : Gibson Dunn, « EU AI Act Omnibus Agreement — Postponed High-Risk Deadlines and Other Key Changes », 2026. https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/ — consulté le 2026-10-26.
[^halderman]: D. Springall, T. Finkenauer, Z. Durumeric, J. Kitcat, H. Hursti, M. MacAlpine, J. A. Halderman, « Security Analysis of the Estonian Internet Voting System », ACM CCS 2014. https://estoniaevoting.org/findings/paper/ — PDF : https://verifiedvoting.org/wp-content/uploads/2020/07/Estonia_2014_IVotingReport.pdf — consulté le 2026-10-26.
[^osce]: OSCE/BIDDH, *Estonia, Parliamentary Elections, 5 March 2023: ODIHR Election Expert Team Final Report*, 30/08/2023. https://www.osce.org/odihr/elections/estonia/551251 — consulté le 2026-10-26.
[^scrt]: SCRT, « Public Intrusion Test of Swiss Post's E-Voting System », 07/02/2019. https://blog.scrt.ch/2019/02/07/public-intrusion-test-of-swiss-posts-e-voting-system/ — consulté le 2026-10-26.
[^itnews]: iTnews, « Crypto defect found in Swiss e-voting system », 03/2019 (Lewis, Pereira, Teague). https://www.itnews.com.au/news/crypto-trapdoor-found-in-swiss-e-voting-system-520440 — source primaire des chercheurs : S. J. Lewis, O. Pereira, V. Teague, « Ceci n'est pas une preuve », https://sarahjamielewis.com/log/2019/swiss-post-1.html (existence et conclusion confirmées par recherche, V1567) ; consulté le 2026-10-26.
[^ch-lucerne]: Conseil fédéral, « Le Conseil fédéral autorise le recours au vote électronique dans le canton de Lucerne », 24/06/2026. https://www.admin.ch/fr/newnsb/2iAmj7WTEEDAqazAiyeMD — consulté le 2026-10-26.
[^ch-bale]: Chancellerie fédérale, « Essais de vote électronique : suite des opérations après l'incident survenu à Bâle-Ville », 11/03/2026. https://www.admin.ch/fr/newnsb/BJBC_FWncn8p8fGeNrWHZ — consulté le 2026-10-26.
[^nasem]: National Academies of Sciences, Engineering, and Medicine, *Securing the Vote: Protecting American Democracy*, 2018. Synthèse officielle : https://sites.nationalacademies.org/cs/groups/pgasite/documents/webpage/pga_188969.pdf — MIT News, 25/09/2018 : https://news.mit.edu/2018/report-keys-election-security-0925 — consulté le 2026-10-26.
[^park]: S. Park, M. Specter, N. Narula, R. L. Rivest, « Going from bad to worse: from Internet voting to blockchain voting », *Journal of Cybersecurity* 7(1), 2021, tyaa025, DOI 10.1093/cybsec/tyaa025. https://people.csail.mit.edu/rivest/pubs/PSNR21.pdf — consulté le 2026-10-26.
[^cnil]: CNIL, « Sécurité des systèmes de vote par internet : la CNIL actualise sa recommandation de 2010 » (délibération n° 2019-053 du 25/04/2019). https://cnil.fr/fr/securite-des-systemes-de-vote-par-internet-la-cnil-actualise-sa-recommandation-de-2010 — projet de mise à jour (2025) : https://www.cnil.fr/sites/default/files/2025-01/projet_de_recommandation_securite_des_systemes_de_vote_par_correspondace_electronique.pdf — consulté le 2026-10-26.
[^anssi]: ANSSI, *Recommandations pour la mise en œuvre du vote par Internet pour les élections non politiques*. https://messervices.cyber.gouv.fr/documents-guides/anssi-guide-vote-internet-elections-non-politiques.pdf — version de consultation : https://cyber.gouv.fr/sites/default/files/document/GuideVPI_consultation_publique.pdf — page MesServicesCyber relue le 31/10/2026 (publication du 24/04/2026, périmètre « élections non politiques ») ; PDF non extrait ; consulté le 2026-10-26.

---

## Entrées pour le registre

À reporter dans [`verifications.md`](../verifications.md). Le chapitre est indiqué « ? » quand il n'est pas encore attribué.

| # | Affirmation initiale | Ch. | Première note | Statut |
|---|---|---|---|---|
| V700 | « La complexité fiscale favorise la corruption et l'évasion » | ? | Appuyé par Djankov et al. 2002 (corrélation sur 85 pays, réglementation d'entrée) et Tanzi (synthèse). Corrélation, pas causalité : le formuler ainsi. | à vérifier |
| V701 | « La flat tax réduit l'évasion » | ? | Russie 2001 : baisse de l'évasion par conformité volontaire (Gorodnichenko et al., JPE 2009) ; effet sur la production faible. Relire les tableaux dans le texte intégral. | à vérifier |
| V702 | « Les flat taxes d'Europe de l'Est ont réussi » | ? | Keen et al. 2008 : systèmes hétérogènes, preuves minces. Plusieurs abandons (Slovaquie 2013, République tchèque) Slovaquie : deux tranches en 2013 (confirmé, V1546) ; Tchéquie : taux unique conservé + surtaxe de 7 % en 2013, progressivité en 2021. | vérifié partiellement |
| V703 | « Un système fiscal simple ne peut pas être contourné » | ? | Contredit par Johannesen et Zucman 2014 : les dépôts migrent vers les paradis non couverts. Nommer le contournement par la frontière. | à vérifier |
| V704 | « Réprimer la fraude avant la corruption peut être contre-productif » | ? | Résultat de modèle (Ivanyna et al., FMI 2010 / Economic Inquiry 2016), pas empirique. | à vérifier |
| V705 | Classements « Paying Taxes » (heures de conformité) | ? | Doing Business arrêté en septembre 2021 (irrégularités) communiqué du 16/09/2021 lu (V1547) ; ajouter la réserve partout où ces chiffres sont cités. | vérifié |
| V706 | « Les coûts de conformité augmentent » | ? | Benzarti et Wallossek, NBER 31944 (2023) : indicateur = nombre de mots des codes. Indicateur indirect. | à vérifier |
| V707 | « La transparence fait reculer la corruption » | ? | Ferraz et Finan, QJE 2008 : audits publiés → moins de réélections des maires corrompus, surtout avec une radio locale. Effet électoral, pas baisse directe de la corruption. | à vérifier |
| V708 | « Les marchés publics en ligne réduisent les coûts » | ? | Lewis-Faupel et al. 2016 : pas de baisse des prix, mais une meilleure qualité et moins de retards. Ne pas promettre d'économies sur cette base. | à vérifier |
| V709 | ProZorro : économies de 5 à 10 % et plus | ? | KSE 2022 (note de politique publique) ; OCP 2018 : jusqu'à 30 % avec plus de 5 offres (données de suivi). Concurrence en baisse (Dmytryshyn 2018). | à vérifier |
| V710 | Accès public aux registres des bénéficiaires effectifs | ? | Invalidé par la CJUE le 22/11/2022 (C-37/20, C-601/20). Citer l'arrêt sur curia.europa.eu. | à vérifier |
| V711 | « Plus de 70 % des grands cas de corruption passent par des sociétés anonymes » | ? | Chiffre de TI UK attribué à *Puppet Masters* (Banque mondiale, StAR, 2011). Non relu dans la source primaire. | à vérifier |
| V712 | Robodebt : illégal, plus de 500 000 victimes, 57 recommandations | ? | Communiqué du Premier ministre (07/07/2023) ; JURIST. Relire le rapport sur robodebt.royalcommission.gov.au. | à vérifier |
| V713 | Robodebt : 435 000 dettes erronées sur 780 000 ; transaction d'environ 1,8 Md AUD | ? | Chiffres de presse ; transaction non vérifiée. | à vérifier |
| V714 | Toeslagenaffaire : État de droit violé, démission du gouvernement le 15/01/2021, 30 000 € par victime | ? | Tweede Kamer, *Ongekend onrecht*, 17/12/2020. Nombre de victimes non établi ici. | à vérifier |
| V715 | Amendes de l'AP néerlandaise : 2,75 M€ (double nationalité) et 3,7 M€ (liste FSV) | ? | Presse (Taxlive, NOS). Citer les décisions de l'AP. | à vérifier |
| V716 | SyRI jugé contraire à l'article 8 de la CEDH (05/02/2020) | ? | ECLI:NL:RBDHA:2020:865 / 1878. Citer le jugement. | à vérifier |
| V717 | Horizon : environ 10 000 personnes touchées, 13 suicides ; Post Office et Fujitsu « savaient ou auraient dû savoir » | ? | Rapport, volume 1 (08/07/2025), cité via The Register. Relire le PDF officiel pour les chiffres exacts. | à vérifier |
| V718 | *Bates v Post Office* [2019] EWHC 3408 (QB) ; Offences Act 2024 annulant les condamnations | ? | Connaissance de l'IA, non relue. Trouver l'URL du jugement (BAILII ou judiciary.uk) et legislation.gov.uk. | à vérifier |
| V719 | Louvois : causes = absence de chef de projet unique et pression de la RGPP | ? | Acteurs publics, rapport parlementaire. Croiser avec la Cour des comptes. | à vérifier |
| V720 | Algorithme de la CNAF : score de 0 à 1 ; recours au Conseil d'État le 16/10/2024 | ? | Amnesty, Fondation Abbé Pierre. Statut du recours à suivre. | à vérifier |
| V721 | La CNAF a publié le code source de son score | ? | Le Monde Informatique ; date (« mi-janvier », 2026 ?) à confirmer. | à vérifier |
| V722 | DGFiP : 30 % des contrôles viennent d'algorithmes (2022) ; piscines 25,9 M€ pour 10 M€ recouvrés | ? | Cour des comptes, 15/11/2023, via Banque des Territoires. Relire le rapport. | à vérifier |
| V723 | DGFiP : 56 % des contrôles ciblés par IA ; 15,2 Md€ issus du datamining (2023) | ? | Presse (actu-juridique) citant le rapport d'activité 2023. Périmètre incertain. | à vérifier |
| V724 | « On ne sait pas mesurer ce que rapporte l'IA fiscale » | ? | Cour des comptes 2023 : motif du contrôle non relié au résultat ; pas d'estimation de la fraude. | à vérifier |
| V725 | Interdiction des décisions administratives fondées exclusivement sur un algorithme auto-apprenant | ? | Conseil constitutionnel n° 2018-765 DC. Relire le considérant exact. | à vérifier |
| V726 | Défenseur des droits : droit à l'explication, alternative humaine | ? | Rapport du 13/11/2024. | à vérifier |
| V727 | AI Act : les prestations d'assistance publique et l'influence électorale sont « à haut risque » | ? | Annexe III, points 5 a) et 8 b). Lire sur EUR-Lex (lu sur un miroir). | à vérifier |
| V728 | AI Act : obligations à haut risque au 02/08/2026, report au 02/12/2027 | ? | **Corrigé le 31/10/2026** (T21) : règlement (UE) 2026/1744, JOUE 24/07/2026, en vigueur 27/07/2026 ; annexe III : 02/12/2027 ; annexe I : 02/08/2028. EUR-Lex non rendu, lu via artificialintelligenceact.eu et NatLawReview. | corrigé |
| V729 | AI Act : notation sociale interdite depuis le 02/02/2025 | ? | **Vérifié le 31/10/2026** (T21 suite, V1043) : art. 5 §1 c) du règlement 2024/1689 relu sur EUR-Lex : interdit « la mise sur le marché, la mise en service ou l'utilisation de systèmes d'IA pour l'évaluation ou la classification de personnes physiques [...] en fonction de leur comportement social ou de caractéristiques personnelles [...] », la note sociale conduisant à un traitement défavorable dans des contextes dissociés (i) ou injustifié ou disproportionné (ii) ; aucune restriction aux autorités publiques (vise aussi le privé) ; chapitres I et II applicables depuis le 02/02/2025 (art. 113 a). | vérifié |
| V730 | « Aucune évaluation rigoureuse ne montre qu'une IA générative réduit la corruption » | ? | Absence constatée dans cette recherche limitée ; une recherche dédiée (OCDE, Banque mondiale, U4) est nécessaire avant de l'affirmer. | à vérifier |
| V731 | Estonie : vote par internet attaquable côté serveur et client (2014) | ? | Springall, Halderman et al., ACM CCS 2014. | à vérifier |
| V732 | Estonie 2023 : vote par internet administré efficacement ; recommandations de transparence (OSCE) | ? | Rapport du BIDDH, 30/08/2023. Relire les recommandations sur le vote en ligne. | à vérifier |
| V733 | Estonie 2023 : environ 51 % des votes exprimés en ligne | ? | Source secondaire. Confirmer sur valimised.ee. | à vérifier |
| V734 | Faille ROCA (2017) : environ 750 000 cartes d'identité estoniennes concernées | ? | **Corrigé le 31/10/2026** (T21) : environ 760 000 (presse 2017) puis 800 000 (RIA, 2018) ; Nemec, Sys, Svenda, Klinec, Matyas, ACM CCS 2017 confirmé (crocs.fi.muni.cz). | corrigé |
| V735 | Revote estonien : le dernier vote compte, contre la coercition | ? | Connaissance de l'IA. Sourcer (valimised.ee, loi électorale estonienne). | à vérifier |
| V736 | Suisse 2019 : faille dans la preuve de mélange, manipulation non détectable | ? | Lewis, Pereira, Teague. Citer leur article (pas la presse). | à vérifier |
| V737 | Suisse : système à vérifiabilité complète utilisé depuis le 18/06/2023 | ? | Conseil fédéral, 24/06/2026. | à vérifier |
| V738 | Suisse : 2 048 votes non déchiffrés à Bâle-Ville le 08/03/2026 | ? | Chancellerie fédérale, 11/03/2026. | à vérifier |
| V739 | Suisse : environ 181 000 électeurs (3,24 %) admis au vote électronique en septembre 2026 | ? | Conseil fédéral, 24/06/2026 (demande de Lucerne incluse). | à vérifier |
| V740 | Conseil fédéral : renonciation en juin 2019 au vote électronique comme canal ordinaire | ? | Date et portée à confirmer (admin.ch). | à vérifier |
| V741 | Académies américaines : bulletins papier, audits à limitation de risque, pas d'internet | ? | *Securing the Vote*, 2018. Relire la recommandation 5.11 dans le rapport complet. | à vérifier |
| V742 | « La blockchain aggrave les risques du vote par internet » | ? | Park et al., J. Cybersecurity 2021. | à vérifier |
| V743 | Moscou 2019 (Gaudry et Golovnev) et Voatz (Specter et al. 2020) : systèmes cassés | ? | Connaissance de l'IA, non relue. | à vérifier |
| V744 | Cour constitutionnelle allemande, 03/03/2009 : vérifiabilité par un citoyen non spécialiste | ? | **Vérifié le 31/10/2026** (T21) : arrêt du 03/03/2009 relu sur bundesverfassungsgericht.de ; nuance : élection non annulée. | vérifié |
| V745 | Conseil de l'Europe CM/Rec(2017)5 sur le vote électronique | ? | Non relu. | à vérifier |
| V746 | ANSSI : guide du vote par internet limité aux élections non politiques (v1.0 du 24/04/2026) | ? | PDF non extrait. Relire, notamment le périmètre. | à vérifier |
| V747 | CNIL : délibération n° 2019-053 ; mise à jour de 2025 en projet | ? | Adoption de la mise à jour à confirmer. | à vérifier |
| V748 | France : vote par internet des Français de l'étranger suspendu en 2017 sur alerte de l'ANSSI ; moratoire sur les machines à voter depuis 2008 | ? | Connaissance de l'IA. Sourcer (ministère de l'Europe et des Affaires étrangères, ministère de l'Intérieur). | à vérifier |
| V749 | « La technologie rend la fraude et la manipulation impossibles » (thèse implicite) | ? | Contredite par Robodebt, Toeslagen, Horizon, SyRI et la Suisse 2019. Reformuler : la technologie **déplace** le risque (échelle, détectabilité) et exige recours et vérifiabilité. Lien avec V7. | à vérifier |
