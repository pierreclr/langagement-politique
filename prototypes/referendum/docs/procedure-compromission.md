# Procédure de compromission : annuler et retourner aux urnes

*Prototype T54, 02/11/2026. Principe posé par l’auteur et déjà inscrit dans document de travail de l'atelier, non publié : aucune décision irréversible si l'infrastructure est compromise. Ce document est une proposition de règle ; il n'a pas de valeur juridique tant qu'un texte ne la reprend pas.*

## 1. Principe

Le scrutin numérique ne se défend pas, il se **prouve**. S'il ne peut pas être prouvé, il est **annulé** et le vote a lieu **sur papier**, dans les bureaux de vote, à une date fixée d'avance. Le doute profite au papier, jamais au résultat numérique.

Pour que la règle soit crédible, la date de repli papier est **fixée avant** chaque scrutin numérique (par exemple trois semaines après), et le matériel (bulletins, listes d'émargement, bureaux) est **prévu au budget** de chaque scrutin.

## 2. Déclencheurs explicites (l'un d'eux suffit)

| N° | Déclencheur | Qui le constate | Effet |
|---|---|---|---|
| D1 | Le vérificateur de référence (`src/verifier.js`) ou **tout** vérificateur indépendant reconnu rend une **ERREUR** sur le tableau publié (chaîne rompue, bulletin invalide, agrégat ou résultat différent, bornes votants/droits/inscrits violées) | n'importe qui ; constat confirmé par l'organe de contrôle | **annulation** |
| D2 | **Divergence** entre deux vérificateurs indépendants sur le même tableau | organe de contrôle | **annulation** (on ne choisit pas le « bon » vérificateur après coup) |
| D3 | Faille démontrée permettant d'**ajouter, modifier ou retirer** un bulletin, ou de **lire** un bulletin individuel, **sans détection** par les vérificateurs, découverte avant la proclamation | prime aux failles, chercheurs, auditeurs | **annulation** si la faille était exploitable pendant le scrutin |
| D4 | **Fuite ou compromission** de parts de clé atteignant le seuil t (ou soupçon sérieux qu'une coalition de t autorités s'est formée) | autorités, organe de contrôle | **annulation** (le secret du vote ne peut plus être garanti) |
| D5 | Moins de t déchiffrements partiels **valides** (autorités absentes ou malhonnêtes) | tableau public | **annulation** du dépouillement numérique ; repli papier |
| D6 | Écart entre l'**audit statistique** de la trace papier (mode borne) et le décompte électronique au-delà de la tolérance fixée d'avance | organe de contrôle | **dépouillement intégral du papier** ; le papier fait foi |
| D7 | Nombre de **codes de suivi introuvables** signalés par des électeurs au-delà d'un seuil fixé d'avance (censure de l'urne), ou preuve d'une seule suppression | électeurs, organe de contrôle | **annulation** |
| D8 | **Indisponibilité** prolongée (déni de service, panne) ayant empêché de voter une part des électeurs supérieure à un seuil fixé d'avance | organe de contrôle | **annulation** |
| D9 | Compromission **avérée** d'un composant (serveur d'urne, émetteur de droits, chaîne de construction du logiciel, dépendance) pendant la période du scrutin | ANSSI, organe de contrôle | **annulation** |

Une **ALERTE** du vérificateur (par exemple une autorité écartée pour un faux déchiffrement, une signature de témoin manquante) n'annule pas à elle seule le scrutin si le total est prouvé par t autres autorités ; elle ouvre une **enquête publique** sous huit jours, et deux alertes de même nature sur deux scrutins excluent l'autorité concernée.

## 3. Déroulé après déclenchement

1. **Gel** : le tableau public est figé et répliqué chez tous les organes ; aucun résultat n'est proclamé (ou la proclamation est suspendue).
2. **Constat** par l'organe de contrôle sous 48 heures, publié en entier (y compris le détail technique).
3. **Annulation** prononcée par l'autorité compétente (juge de l'élection pour un scrutin officiel) ; pour la preuve de concept consultative, par l'organe de contrôle du projet.
4. **Repli papier** à la date fixée d'avance.
5. **Rapport public** sous 30 jours : cause, correctif, et décision de suspendre ou non le mode numérique pour les scrutins suivants. Le mode numérique ne reprend qu'après correction publiée, nouvel audit et nouveau défi public.

## 4. Mise à l'épreuve avant **chaque** usage

Le code ouvert est nécessaire mais pas suffisant (« beaucoup d'yeux » ne garantit pas qu'ils regardent : Heartbleed est resté deux ans dans OpenSSL, document de travail de l'atelier, non publié, 02/11). Avant chaque scrutin, dans cet ordre :

1. **Gel de la version** : étiquette Git signée, construction reproductible, empreintes des paquets publiées.
2. **Analyse automatisée par des IA de sécurité** :
   - analyse statique (règles de sécurité, recherche de secrets, dépendances vulnérables, licences) ;
   - revue de code par plusieurs modèles d'IA de fournisseurs **différents** (pour ne pas cumuler les mêmes biais), avec consigne de chercher les attaques contre chaque propriété (secret, intégrité, unicité, liberté, disponibilité) ;
   - **scénarios d'attaque** générés et exécutés comme tests : bulletins mal formés, valeurs hors {0, 1}, rejeu, nullifiers falsifiés, autorités coalisées sous le seuil, tableau tronqué ou réordonné, jetons d'un autre scrutin, entrées géantes (déni de service) ;
   - tests à données aléatoires (« fuzzing ») des fonctions de désérialisation et de vérification ;
   - publication intégrale des rapports, y compris les faux positifs.
   Limite : une IA ne remplace pas un cryptographe ; elle trouve des erreurs d'implémentation et de logique, rarement des failles de protocole nouvelles.
3. **Prime aux failles** ouverte en continu, barème publié (cahier § 4.5).
4. **Défi public** avant le scrutin : tableau d'essai publié, récompense à qui fait accepter par le vérificateur un tableau truqué ou déchiffre un bulletin (leçon suisse de 2019).
5. **Audit humain indépendant** (cryptographie, code, intrusion) à chaque version majeure.
6. **Critère de passage** : aucune faille ouverte de gravité « critique » ou « haute » ; sinon le scrutin a lieu sur papier.

## 5. Ce que la procédure ne règle pas

- Une fraude **sous le seuil de détection** (quelques bulletins sur des terminaux compromis) peut passer, comme une fraude papier locale.
- Le repli papier a un coût et un délai ; il faut l'assumer dans le budget de chaque scrutin numérique, sinon la règle ne sera pas appliquée le jour venu.
- La décision d'annuler est politique autant que technique : elle doit être **automatique** sur constat, pour ne pas dépendre du camp qui gagne.
