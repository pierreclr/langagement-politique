---
titre: Inventaire des démarches et prestations, et leur sort dans le système proposé
date: 2026-11-07
statut: v0, brouillon de travail ; classement par règles puis relu par échantillon, non exhaustivement ; durées et populations en grande partie des hypothèses ; non adopté par l'auteur
vérifications: V19900 à V19914
---

# Inventaire des démarches : ce qui disparaît, ce qui devient automatique, ce qui reste

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 07/11/2026, sur sa demande : lister toutes les démarches de ce type, avec une indemnité unique, un calcul unique et une application unique. Le fichier complet, une ligne par fiche, est `sources/inventaire-demarches.csv`. Les chiffres de durée sont des **hypothèses de Claude, pas des mesures** : aucune source publique trouvée ne donne le temps annuel passé par les Français sur leurs démarches (voir § 1).

## En tête : le temps rendu aux Français

- **Ordre de grandeur central : 463 millions d'heures par an rendues**, soit l'équivalent de **13.2 millions de semaines de travail de 35 heures** (hypothèse). Fourchette : 231 à 926 millions d'heures (durées divisées ou multipliées par deux). Pour les particuliers seuls : 335 millions d'heures ; pour les entreprises (employeurs, TVA, indépendants) : 128 millions.
- **Par personne concernée** (durées hypothétiques) : un salarié au Smic locataire gagne environ 14 heures par an, soit 0,4 semaine ; un chômeur indemnisé locataire environ 18 heures (0,5 semaine) ; un bailleur en meublé (LMNP) environ 16 heures (0,5 semaine), plus le comptable qu'il paie souvent ; un employeur, environ 46 heures (1,3 semaine). Ramené à chaque foyer fiscal (41,6 millions), les particuliers gagnent 8 heures par an, soit 0.23 semaine.
- **Ce que ce total ne contient pas** : les démarches sans profil chiffré (cartes et titres, justice, logement, famille, etc.), les attentes au guichet et au téléphone au-delà des durées retenues, et le coût du stress ; il est donc plutôt bas sur le périmètre, mais chaque durée est une hypothèse qui peut être fausse dans les deux sens.
- **Postes publics libérés** : déjà comptés dans le bilan, ligne D18 (47 600 équivalents temps plein concernés, 3,80 Md€ de gestion en régime, dont ≈ 38 200 postes absorbables par les départs en dix ans, document de travail de l'atelier, non publié). Ils ne sont pas recomptés ici ; ce document rattache simplement chaque démarche supprimée à cette ligne.

## 1. Méthode, limites

**Source des démarches** : le flux officiel des fiches de service-public.gouv.fr (DILA), version du 05/11/2026, téléchargé dans `$DONNEES/sources/etat-as-code/` : 3 005 fiches « particuliers » et 775 « professionnels », dont 1 511 + 611 = **2 122 fiches pratiques** (les questions-réponses, recherches guidées et fiches « Comment faire si » ne sont pas des démarches et sont écartées). Chaque fiche pratique est une ligne du CSV. **Cote B** (synthèse officielle de la DILA ; les textes de loi qu'elle cite sont de cote A) ; conflit d'intérêts : aucun connu, l'État décrit ses propres règles, mais le flux décrit les démarches telles qu'elles sont et n'est pas une mesure de leur usage.
**Ce qui est extrait du flux** : titre, dossier et thème, organismes (sources des téléservices et mots-clés du texte), pièces demandées (seulement quand la fiche a un chapitre « pièces » ou « justificatifs » : 110 fiches), numéros de formulaires, services en ligne, fréquence quand le texte l'énonce. **Le volume annuel n'est pas publié dans le flux** : la colonne le dit ; les seuls volumes cités sont ceux des populations du § 4, avec leur source.
**Nature de la fiche** (démarche, prestation, règle ou information) : classée par mots du titre, donc approximative. On ne compte comme « démarche ou prestation » que les fiches classées ainsi (847 fiches) ; les 1 275 autres décrivent des règles ou des informations et sont comptées à part.
**Sort dans le système** : attribué par des règles écrites à partir des arbitrages 47 à 57, de document de travail de l'atelier, non publié et de document de travail de l'atelier, non publié. La colonne `fondement` dit sur quoi chaque ligne repose : un arbitrage numéroté, le texte « système en une page », ou « extension proposée par Claude (non tranchée) » quand je prolonge une logique sans que l'auteur l'ait tranchée (retraites, congés, carte Vitale, etc.). **Le classement n'a pas été relu fiche par fiche** : je l'ai relu sur la liste des 847 démarches et prestations et corrigé là où j'ai vu des erreurs, des erreurs subsistent sûrement dans les 1 275 fiches de règles. Chiffres à prendre comme un ordre de grandeur de ce qui change, pas comme un décompte juridique.
**Définitions** : *Disparaît* = la prestation ou la formalité n'existe plus à part, il n'y a plus de dossier, de déclaration ni de règle propre (ex. prime d'activité, déclaration de revenus, remboursement de soins). *Devient automatique* = le droit ou l'obligation subsiste sous une autre forme, calculé et versé ou prélevé sans démarche (ex. indemnité de chômage, arrêt maladie, taxe foncière). *Reste, via l'application unique* = la démarche subsiste mais en un seul endroit, préremplie par le NIR. *Reste, inchangée* = acte d'état civil, justice, sécurité, régalien, droit privé. *À décider* = non arbitré.
**Temps rendu** : par profil de démarches (§ 4), jamais fiche par fiche, pour ne pas compter deux fois la même personne. Hypothèses : durée annuelle par personne (formulaires, pièces, déplacements, attentes, appels, recherche d'information, conseil payé), choisie par Claude et marquée comme telle ; populations tirées de sources quand j'en ai trouvé. Les baromètres de la DITP mesurent la complexité ressentie, pas les heures ; l'OCDE (Administration fiscale) ne donne pas de durée par particulier pour la France ; seul repère trouvé : la Banque mondiale, *Paying Taxes*, évalue à 132 heures (édition 2014) puis 139 heures (édition 2018) par an la conformité fiscale et sociale d'une entreprise type française (cote B ; PwC, partenaire de l'étude, tire des revenus du conseil fiscal ; étude arrêtée depuis). Il sert de borne haute à la ligne employeurs : 40 heures pour les cotisations, soit moins du tiers.

## 2. Totaux

| Périmètre | Disparaît | Automatique | Reste, application unique | Reste, inchangée | À décider | Total |
|---|---|---|---|---|---|---|
| **Démarches et prestations (particuliers et professionnels)** | 173 | 94 | 185 | 250 | 145 | 847 |
| dont particuliers | 135 | 84 | 124 | 159 | 118 | 620 |
| dont professionnels | 38 | 10 | 61 | 91 | 27 | 227 |
| Règles et informations (hors démarche) | 91 | 59 | 180 | 780 | 165 | 1275 |
| **Toutes les fiches pratiques** | 264 | 153 | 365 | 1030 | 310 | 2122 |

Lecture : sur 847 démarches et prestations, **173 disparaissent** (20 %), **94 deviennent automatiques** (11 %), **435 restent** (51 %, dont 185 regroupées dans l'application unique et 250 inchangées), **145 sont à décider** (17 %). Une même prestation générant plusieurs fiches (par exemple 28 fiches sur la déclaration de revenus), le nombre de fiches n'est pas le nombre de démarches distinctes que vit un citoyen : voir § 4 pour ce qui compte en heures.

Nature et sort, détail :

| Nature | Disparaît | Automatique | Reste, appli | Reste, inchangée | À décider | Total |
|---|---|---|---|---|---|---|
| démarche | 51 | 32 | 158 | 190 | 25 | 456 |
| prestation | 122 | 62 | 27 | 60 | 120 | 391 |
| règle ou information | 91 | 59 | 180 | 780 | 165 | 1275 |

Où les décisions de l'auteur pèsent le plus : la Sécurité sociale à 100 % (arbitrage 49) et la fonction des revenus (impôt, cotisations, aides au logement, prime d'activité, allocations) font disparaître l'essentiel ; la garantie de transition (56) et les arrêts maladie (57) rendent automatiques les démarches de rupture et de maladie. Ce qui reste est l'état civil, la justice, le droit des étrangers, le droit privé (bail, assurance, contrats commerciaux), la sécurité routière et la réglementation sectorielle des entreprises : le système n'y change rien, sauf par l'application unique.

## 3. Par événement de vie

| Événement de vie | Fiches | Démarches et prestations | Disparaissent | Automatiques | Restent | À décider |
|---|---|---|---|---|---|---|
| Associations, loisirs et vie quotidienne | 75 | 27 | 4 | 0 | 23 | 0 |
| Cessation et difficultés d'entreprise | 54 | 27 | 4 | 0 | 23 | 0 |
| Couple et séparation | 33 | 9 | 0 | 0 | 9 | 0 |
| Création d'entreprise | 49 | 25 | 1 | 0 | 24 | 0 |
| Décès, succession et héritage | 33 | 18 | 0 | 10 | 3 | 5 |
| Embauche et gestion du personnel | 95 | 40 | 26 | 2 | 3 | 9 |
| Emploi et carrière | 185 | 67 | 8 | 5 | 11 | 43 |
| Financement et aides aux entreprises | 14 | 4 | 1 | 1 | 0 | 2 |
| Fonctionnement et vie juridique de l'entreprise | 85 | 23 | 0 | 0 | 23 | 0 |
| Handicap, invalidité et dépendance | 40 | 19 | 3 | 5 | 5 | 6 |
| Impôts et taxes de l'entreprise | 77 | 30 | 2 | 6 | 9 | 13 |
| Impôts, argent et consommation | 195 | 103 | 49 | 5 | 46 | 3 |
| Justice et infractions | 149 | 26 | 0 | 0 | 26 | 0 |
| Logement | 157 | 41 | 6 | 0 | 21 | 14 |
| Maladie et santé | 160 | 70 | 26 | 15 | 5 | 24 |
| Naissance, enfant et famille | 40 | 20 | 14 | 0 | 4 | 2 |
| Papiers, identité et citoyenneté | 104 | 49 | 0 | 9 | 40 | 0 |
| Perte d'emploi et rupture du contrat | 60 | 43 | 22 | 13 | 1 | 7 |
| Reprise et transmission d'entreprise | 33 | 17 | 0 | 0 | 16 | 1 |
| Retraite | 22 | 22 | 0 | 22 | 0 | 0 |
| Réglementation, secteurs et environnement (entreprise) | 204 | 61 | 4 | 1 | 54 | 2 |
| Scolarité et études | 75 | 28 | 1 | 0 | 14 | 13 |
| Transports et véhicule | 102 | 50 | 0 | 0 | 50 | 0 |
| Étranger et Europe | 81 | 28 | 2 | 0 | 25 | 1 |

Liste par événement des démarches et prestations qui **disparaissent** (D) ou **deviennent automatiques** (A), avec le titre exact de la fiche. La règle du système qui les absorbe et le temps rendu sont dans le CSV (colonnes `regle_absorbante`, `heures_an_personne`) et, par profil, au § 4. Les fiches qui restent ou sont à décider sont dans le CSV seulement.

### Associations, loisirs et vie quotidienne

**Disparaissent (4)** : Aide aux vacances enfants ou familles (AVE ou AVF) ; Chèques-vacances pour un salarié du secteur privé ; Chèques-vacances pour un agent public ; Aide aux loisirs pour les enfants (aide au temps libre, bons loisirs, forfait loisirs jeunes, carte tickets loisirs...).

### Cessation et difficultés d'entreprise

**Disparaissent (4)** : Obtenir des délais de paiement auprès de l'Urssaf en tant qu'employeur ; Demander une remise des majorations de retard auprès de l'Urssaf ; Obtenir des délais de paiement pour ses cotisations sociales personnelles (entrepreneur individuel) ; Obtenir des délais de paiement pour ses cotisations sociales personnelles (micro-entrepreneur).

### Création d'entreprise

**Disparaissent (1)** : Création d'une entreprise : mettre en place les services nécessaires à l'activité (électricité, téléphone, internet).

### Décès, succession et héritage

**Deviennent automatiques (10)** : Pension de réversion de l'Assurance retraite ; Capital décès dans la fonction publique ; Pension de réversion en cas de décès d'un fonctionnaire ; Pension d'orphelin au décès d'un fonctionnaire ; Pension de veuf ou de veuve invalide ; Capital décès versé pour le décès d'un salarié du secteur privé ; Rente temporaire d'éducation pour l'enfant d'un agent public de l'État décédé ; Rente viagère pour handicap de l'enfant d'un agent public de l'État décédé ; Pension d'orphelin au décès d'un salarié ; Allocation veuvage.

### Embauche et gestion du personnel

**Disparaissent (26)** : Licenciement d'un salarié en arrêt maladie dans le secteur privé ; Aides financières pour l'embauche d'un travailleur handicapé ; Contrat de professionnalisation ; Aide au financement d’une formation avant embauche ; Licenciement pour motif personnel nul, sans cause réelle et sérieuse ou irrégulier ; Rupture conventionnelle d'un salarié du secteur privé ; Remboursement des frais de transport domicile-travail d'un salarié du secteur privé ; Déclaration obligatoire d'emploi des travailleurs handicapés (DOETH) ; Prêt de main-d'œuvre entre entreprises ; Régime de retraite du micro-entrepreneur ; Aides à l'embauche en contrat d'apprentissage ; Déclarer et payer les cotisations et contributions sociales des salariés ; Licenciement économique : obligations de l'employeur ; Plan de sauvegarde de l'emploi (PSE) - Licenciement économique ; Motifs du licenciement personnel d’un salarié du secteur privé ; Procédure de licenciement d’un salarié pour motif personnel ; Préavis de licenciement d'un salarié ; Contrat d'apprentissage ; Accompagnement au départ à la retraite (ADR) d'un travailleur indépendant ; Régime de garantie des salaires (AGS) ; Régime de retraite de l'entrepreneur individuel (EI) ; Aides à l'embauche en contrat de professionnalisation ; Bassin d'emploi à redynamiser (BER) : exonérations de cotisations sociales ; Hébergement touristique et micro-entreprise : règles applicables aux revenus 2026 ; Congé supplémentaire de naissance pour un travailleur indépendant ; Indemnité de licenciement du salarié en CDI.

**Deviennent automatiques (2)** : Attestation employeur destinée à France Travail (anciennement Pôle emploi) ; Déclaration sociale nominative (DSN).

### Emploi et carrière

**Disparaissent (8)** : Remboursement des frais de transport domicile-travail (fonction publique) ; Prise en charge des frais de changement de résidence d’un agent public ; Contrat de professionnalisation ; Remboursement des frais de transport domicile-travail d'un salarié du secteur privé ; Modification du contrat de travail d'un salarié ; Contrat d'apprentissage ; Renouvellement d'un contrat de travail à durée déterminée (CDD) ; Remboursement des frais de déplacement dans la fonction publique.

**Deviennent automatiques (5)** : Particulier employeur : congés du salarié employé à domicile ; Contrat de travail et formalités d'embauche de l'assistante maternelle ; Aide à domicile (services à la personne) : recrutement d'un salarié ; Licenciement du salarié à domicile employé par un particulier ; Congés payés d'une assistante maternelle.

### Financement et aides aux entreprises

**Disparaissent (1)** : Aide à la création ou à la reprise d'une entreprise (Acre).

**Deviennent automatiques (1)** : Aide à la reprise ou à la création d'entreprise (Arce).

### Handicap, invalidité et dépendance

**Disparaissent (3)** : Allocation de solidarité aux personnes âgées (Aspa) ; Allocation supplémentaire d'invalidité (Asi) ; Allocation simple d'aide sociale aux personnes âgées.

**Deviennent automatiques (5)** : Allocation aux adultes handicapés (AAH) ; Allocation d'invalidité temporaire (AIT) dans la fonction publique ; Pension d'invalidité : majoration pour tierce personne (MTP) ; Retraite pour invalidité du fonctionnaire ; Pension d'invalidité de la Sécurité sociale.

### Impôts et taxes de l'entreprise

**Disparaissent (2)** : Déclaration d'honoraires ou de commissions ; Entrepreneur individuel : passer de l'impôt sur le revenu (IR) à l'impôt sur les sociétés (IS).

**Deviennent automatiques (6)** : Vente en détaxe aux touristes ; Déclarer et payer la TVA ; Remboursement de la TVA intracommunautaire ; Création et dissolution d'un groupe TVA ; TVA applicable aux échanges de prestations de services dans l'Union européenne ; Formalités douanières concernant la TVA des échanges de biens et services intracommunautaires.

### Impôts, argent et consommation

**Disparaissent (49)** : Impôt sur le revenu - Versement de cotisations syndicales (crédit d'impôt) ; Impôt sur le revenu - Travaux d'adaptation du logement à la perte d'autonomie liée à l'âge ou au handicap (crédit d'impôt) ; Impôt sur le revenu - Crédit d'impôt pour l'emploi d'un salarié à domicile ; Impôt sur le revenu - Salaire et autres revenus d'activité salariée imposables ; Impôt sur le revenu - Avantages en nature ; Impôt sur le revenu - Déclarer les sommes perçues par un jeune ; Impôt sur le revenu - Cotisations d'épargne retraite (déduction) ; Impôt sur le revenu - Frais d'accueil liés à la dépendance (réduction d'impôt) ; Impôt sur le revenu - Primes de rente survie ou d'épargne handicap (réduction d'impôt) ; Impôt sur le revenu - Frais professionnels : forfait ou frais réels (déduction) ; Impôt sur le revenu - Revenus locatifs (location non meublée) ; Impôt sur le revenu - Pensions alimentaires versées aux enfants (déduction) ; Impôt sur le revenu - Plus-values sur valeurs mobilières ; Prélèvements sociaux (CSG, CRDS...) sur les revenus du patrimoine et de placements ; Impôt sur le revenu - Revenus d'épargne et de placement ; Impôt sur le revenu - Enfant mineur à charge ; Impôt sur le revenu - Enfant handicapé à charge ; Impôt sur le revenu - Quotient familial d'une personne seule ; Impôt sur le revenu - Quotient familial d'un couple marié ou pacsé ; CSG et CRDS sur les revenus d'activité et de remplacement ; Impôt sur le revenu - Revenus et rattachement d'un enfant majeur ; Impôt sur le revenu - Investissement locatif loi Pinel/Duflot (réduction d'impôt) ; Impôt sur le revenu - Pension alimentaire perçue par un conjoint ou un ex-conjoint ; Impôt sur le revenu - Déclarer les rentes viagères ; Impôt sur le revenu - Revenus d'une location meublée ; Impôt sur le revenu - Prélèvement à la source ; Impôt sur le revenu - Quotient familial d'une personne en concubinage ; Impôt sur le revenu - Revenus locatifs d'un logement conventionné Anah ; Impôt sur le revenu - Calcul de l'impôt ; Impôt sur le revenu - Investissement locatif dans l'ancien « loi Denormandie » (réduction d'impôt) ; Impôt sur le revenu - Quotient familial d'un parent isolé ; Impôt sur le revenu - Quotient familial d'une personne veuve ; Impôt sur le revenu - Installation de bornes de charge pour véhicule électrique (crédit d'impôt) ; Impôt sur le revenu - Pension alimentaire perçue par un enfant ; Impôt sur le revenu - Pension alimentaire perçue par un parent ou grand-parent ; Impôt sur le revenu - Déclaration de revenus annuelle ; Impôt sur le revenu - Première déclaration de revenus ; Impôt sur le revenu - Personne invalide à charge ; Impôt sur le revenu - Déclarer un changement de situation familiale ; Investissement locatif Relance logement - Jeanbrun (déduction des revenus fonciers) ; Impôt sur le revenu - Indemnités de fin de contrat, licenciement, retraite ; Impôt sur le revenu - Déclarer les pensions de retraite ; Impôt sur le revenu - Dons aux associations et organismes d'intérêt général ; Impôt sur le revenu - Don à un parti politique (réduction d'impôt) ; Impôt sur le revenu - Pension alimentaire versée à un parent ou un grand-parent (déduction) ; Impôt sur le revenu - Pension versée à son époux(se) ou ex-époux(se) ; Impôt sur le revenu - Frais d'accueil d'une personne âgée (déduction) ; Impôt sur le revenu - Frais de garde d'enfant hors du domicile (crédit d'impôt) ; Impôt sur le revenu - Frais de scolarité des enfants (réduction d'impôt).

**Deviennent automatiques (5)** : Impôt sur le revenu - Plus-value immobilière ; Impôt sur la fortune immobilière (IFI) - Déclaration et paiement ; Impôt sur le revenu - Déclarer les sommes liées à l'invalidité ; Taxe d'habitation sur les résidences secondaires (THRS) ; Taxe foncière sur les propriétés bâties (TFPB).

### Logement

**Disparaissent (6)** : Aide personnalisée au logement (APL) ; Allocation de logement sociale (ALS) ; Allocation de logement familiale (ALF) ; Avance Loca-Pass : aide au locataire pour le dépôt de garantie ; Garantie Visale : caution pour le locataire (impayés et dégradations) ; Chèque énergie.

### Maladie et santé

**Disparaissent (26)** : Complémentaire santé solidaire (ex-CMU-C) ; Remboursement d'une consultation médicale ; Remboursement d'une consultation médicale pour un enfant de moins de 16 ans ; Licenciement d'un salarié en arrêt maladie dans le secteur privé ; RSA parent isolé ; Femme enceinte : prise en charge à 100 % (Assurance maladie) ; RSA : demandeur de 25 ans et plus ; Information du patient sur les coûts et la prise en charge des frais de santé ; Déroulement d'une hospitalisation et prise en charge par l'Assurance maladie ; Couverture maladie complémentaire (mutuelle) ; Complémentaire santé d'entreprise (mutuelle santé) ; Remboursement des soins à l'étranger (vacances ou court séjour) ; Remboursement des médicaments ; RSA jeune actif ; Prime d'activité : salarié ou fonctionnaire ; Remboursement des frais de transports par l'Assurance maladie ; Prime d'activité : étudiant, stagiaire, apprenti ; RSA jeunes parents ; Remboursement des soins dentaires ; Prise en charge d'une affection de longue durée (ALD) par l'Assurance maladie ; Prime d'activité : congé parental, sabbatique, sans solde ou disponibilité ; Prime d'activité : travailleur indépendant ; Complémentaire santé et prévoyance dans la fonction publique d'État ; Complémentaire santé et prévoyance dans la fonction publique territoriale ; Complémentaire santé et prévoyance dans la fonction publique hospitalière ; Cure thermale : prise en charge par l'assurance maladie.

**Deviennent automatiques (15)** : Immatriculation à la Sécurité sociale pour un salarié qui arrive en France ; Rattachement d'un mineur en tant qu'ayant droit d'un assuré social ; Accident du travail : indemnités journalières pendant l'arrêt de travail ; Congé de longue maladie (CLM) du fonctionnaire ; Congé de longue durée (CLD) du fonctionnaire ; Réclamation contre une décision d'un organisme de Sécurité sociale (invalidité, incapacité, inaptitude) ; Arrêt maladie : indemnités journalières versées au salarié ; Maladie professionnelle : indemnités journalières pendant l'arrêt de travail ; Congé pour invalidité temporaire imputable au service (Citis) du fonctionnaire ; Congé de maladie du fonctionnaire ; Congé de maladie du contractuel de la fonction publique ; Sécurité sociale : changement de situation professionnelle ; Sécurité sociale d'un étudiant sans activité professionnelle ; Sécurité sociale : changement de situation personnelle ; Déclaration de grossesse.

### Naissance, enfant et famille

**Disparaissent (14)** : Allocations familiales (famille de 2 enfants ou plus) ; Famille de 3 enfants et plus : complément familial ; Prestation d'accueil du jeune enfant (Paje) : prime à l'adoption ; Prime de déménagement ; Prestation d'accueil du jeune enfant (Paje) : prime à la naissance ; Allocation de base de la Paje versée à la naissance d'un enfant ; Allocation de base de la Paje en cas d'adoption d'un enfant ; Allocation de soutien familial (ASF) : enfant non reconnu ; Allocation de soutien familial (ASF) : enfant orphelin ; Allocation de soutien familial (ASF) : enfant recueilli ; Complément de libre choix de mode de garde (CMG) : structure ; Allocation versée en cas de décès d'un enfant ; Complément de libre choix de mode de garde (CMG) : emploi direct ; Allocation de soutien familial (ASF) : parents séparés.

### Papiers, identité et citoyenneté

**Deviennent automatiques (9)** : Listes électorales : en cas de première inscription ; Inscription sur la liste électorale : en cas de déménagement ; Attestation des services accomplis (service militaire ou service national) ; Vote d'un Français installé à l'étranger ; Élections : droit de vote d'un citoyen européen en France ; Liste électorale : inscription d'office à 18 ans si le recensement citoyen a été fait à 16 ans ; Inscription sur la liste électorale d'une personne devenue française ; Recensement citoyen ; Journée défense et citoyenneté (JDC).

### Perte d'emploi et rupture du contrat

**Disparaissent (22)** : Aide à la création ou à la reprise d'une entreprise (Acre) ; Licenciement économique collectif de salariés : information et consultation obligatoires ; Licenciement économique d'un salarié : entretien préalable ; Licenciement pour motif économique : adaptation et reclassement des salariés ; Congé de mobilité d'un salarié ; Licenciement pour motif personnel nul, sans cause réelle et sérieuse ou irrégulier ; Rupture conventionnelle d'un salarié du secteur privé ; Licenciement économique : lettre de licenciement ; Licenciement d'un représentant du personnel ; Résiliation judiciaire du contrat de travail d'un salarié ; Indemnité compensatrice de préavis pour un salarié (licenciement, démission...) ; Indemnité compensatrice de congés payés ; Plan de sauvegarde de l'emploi (PSE) - Licenciement économique ; Motifs du licenciement personnel d’un salarié du secteur privé ; Procédure de licenciement d’un salarié pour motif personnel ; Préavis de licenciement d'un salarié ; Licenciement d'une salariée enceinte ou en congé de maternité ; Congé de reclassement du salarié ; Licenciement économique nul, injustifié ou irrégulier ; Licenciement économique : préavis de licenciement et fin du contrat de travail ; Congé de conversion ; Indemnité de licenciement du salarié en CDI.

**Deviennent automatiques (13)** : Allocation chômage d'aide au retour à l'emploi (ARE) d'un agent public dont la fin de contrat de travail intervient avant le 1er avril 2025 ; Allocation de solidarité spécifique (ASS) ; Allocation chômage d'aide au retour à l'emploi (ARE) d'un salarié du secteur privé dont la fin de contrat de travail intervient avant le 1er avril 2025 ; Chômage : contrat d'engagement du demandeur d'emploi inscrit à France Travail ; Aide à la reprise ou à la création d'entreprise (Arce) ; Chômage : inscription à France Travail (anciennement Pôle emploi) ; Chômage : radiation par France Travail (anciennement Pôle emploi) ; Aide à la garde d'enfants (AGE) pour le demandeur d'emploi ; Attestation employeur destinée à France Travail (anciennement Pôle emploi) ; Allocation d'aide au retour à l'emploi formation (Aref) ; Allocation de sécurisation professionnelle (ASP) ; Allocation chômage d'aide au retour à l'emploi (ARE) d'un salarié du secteur privé dont la fin de contrat de travail intervient à compter du 1er avril 2025 ; Allocation chômage d'aide au retour à l'emploi (ARE) d'un agent public dont la fin de contrat de travail intervient à compter du 1er avril 2025.

### Retraite

**Deviennent automatiques (22)** : Rachat des années d'études pour la retraite de la fonction publique ; Retraite complémentaire d'un fonctionnaire (Rafp) ; Retraite complémentaire d'un contractuel de la fonction publique (Ircantec) ; Cumul emploi-retraite du fonctionnaire ; Retraite progressive du salarié ; Cumul emploi-retraite du salarié ; Durée d'assurance retraite du fonctionnaire ; Retraite anticipée pour carrière longue du salarié ; Retraite anticipée pour carrière longue de l'agent public ; Pension de retraite de base à taux plein du salarié ; Retraite anticipée pour handicap dans la fonction publique ; Retraite complémentaire dans le privé : Agirc-Arrco ; Retraite du salarié dans le secteur privé : rachat de trimestres ; Retraite du salarié handicapé ; Durée d'assurance retraite du salarié du secteur privé ; Pension de retraite à taux plein d'un agent public ; Préretraite amiante du salarié du secteur privé ; Montant de la retraite de l'agent public ; Montant de la retraite du salarié du secteur privé ; Préretraite amiante d'un agent de la fonction publique ; Utilisation du compte professionnel de prévention (C2P) pour la retraite du salarié ; Retraite progressive de l'agent public.

### Réglementation, secteurs et environnement (entreprise)

**Disparaissent (4)** : Aide à l'embauche de travailleurs saisonniers agricoles ; Remboursement partiel de l'accise sur les énergies (gazole) pour transporteurs routiers de marchandises et de personnes (ex-TICPE) ; Prise en charge obligatoire des frais de transports publics des salariés ; Prise en charge des frais de carburant et d'alimentation des véhicules (prime carburant).

**Deviennent automatiques (1)** : Artiste-auteur : fiscalité (déclaration de revenus, TVA et CFE).

### Scolarité et études

**Disparaissent (1)** : Allocation de rentrée scolaire (ARS).

### Étranger et Europe

**Disparaissent (2)** : Impôt sur le revenu d'un Français qui part vivre ou travailler à l'étranger ; Impôt sur le revenu - Retour d'expatriation.

## 4. Le temps rendu, profil par profil

Colonne « statut » : *population sourcée* signifie que le nombre de personnes vient d'une source citée ; la durée par personne est toujours une hypothèse de Claude. Total = personnes × heures. Rattachement au coût public : D18 (déjà compté, non recompté).

| Profil | Personnes concernées (millions) | Source ou base | Heures par an et par personne (hypothèse) | Total (millions d'heures) | Règle du système qui l'absorbe |
|---|---|---|---|---|---|
| P1 Déclaration annuelle de revenus, niches et prélèvement à la source | 41.6 | 41,6 M de foyers fiscaux en 2025 (DGFiP, rapport d'activité 2025) | 3.0 | 124.8 | Votre revenu est connu à la source et la contribution est prélevée quand vous le touchez : plus de déclaration annuelle, de case à cocher ni de niche à optimiser. |
| P2 Revenus de location (LMNP, meublé, nu) | 1.37 | 1,37 M de contribuables LMNP déclarants en 2024 (Observatoire de la location meublée, d'après DGFiP, cote C) | 12.0 | 16.4 | Vos loyers sont un revenu comme un autre, compté dans la fonction des revenus : plus de régime LMNP, de liasse ni de choix entre micro et réel ; le bien lui-même est taxé sur sa valeur. |
| P3 Aides au logement (APL, ALS, ALF), dossier et déclarations de ressources | 5.5 | 5,48 M de foyers fin septembre 2025 (DREES, série à vérifier) | 5.0 | 27.5 | L'aide au logement n'existe plus à part : le filet de ménage complète les bas revenus à partir du revenu connu, sans dossier ni déclaration trimestrielle. |
| P4 Prime d'activité, demande et déclarations trimestrielles | 4.6 | 4,56 à 4,76 M de foyers fin 2025 (CNAF ; DREES) | 4.0 | 18.4 | La contribution devient négative en bas de l'échelle : l'État verse la différence, recalculée chaque mois sur votre revenu réel, sans demande. |
| P5 RSA, demande, déclarations et rendez-vous | 1.84 | 1,84 M de foyers fin 2025 (CNAF) | 8.0 | 14.7 | Le plancher (877 € pour une personne seule) est versé automatiquement à qui n'a pas de revenu : pas de dossier, pas de déclaration trimestrielle. |
| P6 Allocations familiales, ARS, PAJE, complément familial | 6.0 | hypothèse (à sourcer, CNAF) | 2.0 | 12.0 | Un montant fixe par enfant (200 €, 250 € de plus pour un parent seul) est versé avec le reste, dès que la naissance est déclarée à l'état civil. |
| P7 Arrêt maladie court : consultation, envoi à l'employeur et à la caisse | 3.9 | ≈ 47 % de 8,4 M d'arrêts maladie indemnisés en 2024 durent moins de 8 jours (DREES, Assurance maladie) ; la part exacte est une hypothèse | 3.0 | 11.7 | Un arrêt court se déclare soi-même, un arrêt long est déclaré par le médecin ; le système verse l'indemnité, sans jour de carence ni formalité d'employeur. |
| P8 Inscription, actualisation et dossiers France Travail | 5.5 | ≈ 5,5 M d'inscrits en catégories A, B, C (⚠️ à vérifier, DARES) | 10.0 | 55.0 | Votre revenu d'activité est connu chaque mois : quand il baisse, la garantie de transition démarre seule sur la moyenne glissante, sans inscription ni actualisation. |
| P9 Remboursements, mutuelle, complémentaire santé solidaire, justificatifs | 67.0 | ≈ 67 M d'assurés (hypothèse, population française) | 0.5 | 33.5 | La Sécurité sociale rembourse tout le socle de soins : plus de feuille de soins, de mutuelle obligatoire ni de justificatif à fournir. |
| P10 Cotisations, DSN, paie et formalités d'embauche (employeurs) | 2.0 | hypothèse (≈ 2 M d'employeurs, à sourcer, Urssaf) | 40.0 | 80.0 | Une seule contribution sur le coût employeur remplace cotisations, taxes sur salaires et déclarations séparées : le revenu est connu au paiement. |
| P11 TVA : déclarations et remboursements | 3.0 | hypothèse (≈ 3 M d'assujettis, à sourcer, DGFiP) | 6.0 | 18.0 | La déclaration de TVA est préremplie à partir des factures électroniques : vous vérifiez au lieu de saisir. |
| P12 Déclaration de résultat et de revenus des indépendants | 3.0 | hypothèse (≈ 3 M d'indépendants, à sourcer, Insee) | 10.0 | 30.0 | Le revenu d'un indépendant est connu par ses factures ; un forfait de frais s'applique par défaut, le réel reste possible : plus de liasse séparée. |
| P16 Allocation aux adultes handicapés : renouvellements et dossiers CAF | 1.3 | hypothèse (≈ 1,3 M d'allocataires, à sourcer, DREES) | 3.0 | 3.9 | Le complément handicap est versé par le même circuit que tout le reste dès que le handicap est reconnu ; la reconnaissance se fait au guichet de proximité. |
| P17 Liquidation de la retraite : dossiers et justificatifs de carrière | 0.8 | hypothèse (≈ 0,8 M de nouveaux retraités par an, à sourcer, Cnav) | 6.0 | 4.8 | Votre carrière est connue par le NIR : la pension est calculée et versée à l'âge ouvrant le droit, sans dossier. |
| P20 Renseignements et réclamations fiscales (gain partiel : moins de règles, moins de questions) | 8.0 | hypothèse (à sourcer, DGFiP) | 1.5 | 12.0 | Sans niches ni cas particuliers, la plupart des questions fiscales n'ont plus d'objet ; la contestation reste possible en un clic. |
| **Total** | | | | **463** | |

Ce qu'il y a derrière les durées (hypothèse, à confronter à des enquêtes) : déclaration annuelle = rassembler les justificatifs, remplir, corriger, ouvrir l'avis, contester ; aides sociales = dossier initial, justificatifs, déclarations trimestrielles de ressources, relances, rendez-vous ; arrêt maladie court = trajet, attente et consultation, puis envoi à l'employeur et à la caisse ; France Travail = inscription, actualisation mensuelle, convocations, attestation de l'employeur. Coûts privés évités (comptable, conseil fiscal, plateformes d'aide aux démarches) : **non chiffrés faute de source** ; le seul repère cité est celui des bailleurs en meublé, dont une partie recourt à un comptable (Observatoire de la location meublée, cote C) sans tarif publié ici.

### Les exemples en détail

- **Revenus de location meublée (LMNP)** : aujourd'hui, un régime spécial (micro-BIC ou réel), une immatriculation, une déclaration annexe, des amortissements, souvent un comptable. 1,37 million de contribuables déclarent ces revenus en 2024. *Règle* : « vos loyers sont un revenu comme un autre, compté dans la fonction des revenus » ; le bien est taxé sur sa valeur par la fonction du patrimoine (au-delà de la résidence principale). *Temps* : 12 heures par an et par bailleur (hypothèse), soit 16 millions d'heures.
- **Questions aux impôts et réclamations** : sans niches ni cas particuliers, la plupart des questions n'ont plus d'objet ; la contestation reste possible, en un clic, avec réponse motivée (conception du prélèvement automatique). Gain partiel : 1,5 heure par an pour 8 millions de personnes (hypothèse non sourcée).
- **Aides au logement** : 5,5 millions de foyers (DREES, fin septembre 2025). Plus de dossier ni de déclaration trimestrielle : le filet de ménage complète les bas revenus. 5 heures par an (hypothèse).
- **Prime d'activité** : 4,6 à 4,8 millions de foyers (CNAF, DREES, fin 2025). Une contribution négative en bas de l'échelle remplace la demande et les déclarations trimestrielles. 4 heures par an (hypothèse). Le RSA (1,84 million de foyers) suit la même logique.
- **Arrêt maladie** : 8,4 millions d'arrêts maladie indemnisés en 2024, dont près de la moitié de moins de 8 jours (DREES). Exemple : la personne fiévreuse au fond de son lit n'a plus à aller chez le médecin pour une grippe. 3 heures économisées par arrêt court (hypothèse : trajet, attente, consultation, envois).
- **Inscription à France Travail** : plus d'inscription ni d'actualisation, car le revenu d'activité est connu chaque mois et la garantie de transition (arbitrage 56) part de la moyenne glissante. Réserve : l'accompagnement vers l'emploi n'est pas arbitré (« à décider »). 10 heures par an pour 5,5 millions d'inscrits (hypothèse, ⚠️ population à vérifier).

## 5. Cartes et titres : vers un seul identifiant numérique

Principe proposé : une personne est identifiée par son NIR ; l'application unique (point de départ : France Identité, déjà ouverte à l'application carte Vitale) porte tous ses titres sous forme numérique ; la carte physique reste disponible, jamais obligatoire à remplacer par un téléphone. Ce que dit le flux officiel de la DILA (fiches lues le 07/11/2026), les coûts et le sort de chaque titre :

| Titre | Existe déjà en numérique | Coût pour la personne (fiche DILA) | Coût public (si source) | Sort proposé | Doit rester physique |
|---|---|---|---|---|---|
| Carte Vitale | Oui : appli carte Vitale, ouverte à tous le 18/11/2025, 3,5 millions d'activations selon un communiqué de l'Assurance maladie du 21/09/2026 (relayé par un site tiers, ⚠️ V19902) | Gratuite ; 5 € à partir de la 4e demande annuelle de remplacement, 2 € à partir de la 11e en version appli | ≈ 3 € la carte actuelle (rapport IGAS-IGF, avril 2023, rapporté par Acteurs Publics, cote C, ⚠️ V19901) ; 4,40 € cité pour la CNAM sans date ; fabrication et envoi compris selon les sources | Absorbée dans l'application unique, droits lus par le NIR (Sécurité sociale à 100 %) | Carte physique en secours (équipement des professionnels progressif) |
| Carte nationale d'identité | Oui : France Identité (4 millions d'utilisateurs fin mars 2026 selon l'IFRAP, ⚠️ V19903) | Gratuite ; timbre de 25 € en cas de perte ou de vol | Non trouvé (⚠️ V19904) | Titre numérique par défaut ; version physique conservée | Oui pour les voyages hors UE et pour les personnes non numérisées ; validité 10 ans (fiche DILA) |
| Passeport | Non (France Identité acceptée dans les aéroports pour vols intérieurs et européens dès l'été 2026 selon la presse, ⚠️ V19903) | Timbre de 86 € pour un majeur (96 € à l'étranger) ; validité 10 ans (fiche DILA F14929) | Estimé 55 € par passeport par la Cour des comptes en 2009, 38 € reconstitué ; coût de production ≈ 11 € (Imprimerie nationale de Douai, question parlementaire 2013) : anciens (⚠️ V19904) | Reste physique ; demande pré-remplie par le NIR | Oui, voyage hors UE |
| Permis de conduire | Non (permis numérique non vérifié) | Timbre de 25 € en cas de perte, vol ou détérioration (fiche DILA F1727) | Non trouvé | Gestion dans l'application unique ; titre physique sur demande ; échange et reconnaissance européens à vérifier | Oui à l'étranger tant que les pays tiers n'acceptent pas le numérique |
| Carte grise (certificat d'immatriculation) | Démarche entièrement en ligne ; document papier | 13,76 € pour un duplicata (11 € de taxe fixe + 2,76 € d'acheminement, fiche DILA F1726) ; taxe régionale en plus pour une immatriculation | Non trouvé | Dématérialisée dans l'application unique | Non (la plaque reste) |
| Carte européenne d'assurance maladie (CEAM) | Via ameli ; carte physique valable 2 ans | Gratuite (fiche DILA F34441) | Non trouvé | Attestation dans l'application, version papier possible | Oui pour le voyage dans les pays qui l'exigent |
| Carte mobilité inclusion, carte de transport, attestations diverses | Partiellement | Variable | Non trouvé | Dans l'application unique | Papier sur demande |

**Coûts évitables chiffrés** : je n'ai pas trouvé de volume annuel de cartes Vitale délivrées ni de coût actuel (hors le repère de 3 € la carte), donc **aucun chiffre agrégé n'est donné** : l'évitable se calcule en multipliant le coût unitaire par le nombre de cartes fabriquées chaque année, à demander à l'Assurance maladie (⚠️ V19905). Le rapport IGAS-IGF écarte la carte Vitale biométrique pour son coût (au moins 246 M€ par an en régime, 10 € la carte, plus de 1,2 Md€ pour recueillir les empreintes) et recommande d'inscrire le numéro de sécurité sociale dans la carte d'identité électronique : c'est proche de l'identifiant unique proposé, mais par ce biais un seul titre physique. Ne pas confondre : ce coût écarté n'est pas un coût évité par notre proposition.

**Règles européennes** : le règlement (UE) 2024/1183 (eIDAS 2), entré en vigueur le 20/05/2024, impose à chaque État membre de proposer au moins un portefeuille européen d'identité numérique avant le 24/12/2026 ; l'acceptation par des acteurs privés réglementés viendrait un an plus tard (sources secondaires, ⚠️ V19906). Selon Euronews (18/09/2026), 24 États sur 27 manqueraient l'échéance (⚠️ V19907). Notre application unique doit être compatible avec ce portefeuille, pas le remplacer : c'est aussi la voie pour une version européenne du manifeste. Contrainte juridique : l'accès aux services publics ne peut être subordonné à la détention d'un smartphone (principe d'égal accès, à documenter ⚠️ V19908).

**Illectronisme** : 15 % de la population en 2021 (Insee Première n° 1953, juin 2023, cote A) ; l'enquête 2025 donne 46 % de personnes de 15 ans ou plus en illectronisme ou compétences numériques faibles (Insee, NUM25, année et périmètre à préciser, ⚠️ V19909). La carte physique et le guichet de proximité ne sont donc pas des concessions : ils sont obligatoires.

## 6. Garde-fous

- **Panne ou perte du téléphone** : chaque titre numérique est récupérable au guichet de proximité avec une pièce d'identité, sans délai de carte ; un titre papier à code est toujours imprimable ; l'application ne doit jamais être la seule preuve de droit (un professionnel de santé ou un agent peut retrouver le droit par le NIR et une pièce d'identité). Des pannes d'activation et de mise à jour de l'appli carte Vitale ont été signalées par la presse et des usagers en 2026, dont une mise à jour du 30/03/2026 qui a fermé l'accès à certains utilisateurs (Clubic, cote C, ⚠️ V19910).
- **Usurpation d'identité** : un identifiant unique concentre le risque. Mesures proposées : authentification forte à deux facteurs et biométrie locale sur le téléphone (jamais de base centrale d'empreintes, ce que le rapport IGAS-IGF juge coûteux et peu efficace), révocation immédiate en un clic, alerte à chaque usage inhabituel, plafond de ce qu'un titre numérique permet sans présence physique (changement d'IBAN, par exemple). Le rapport IGAS-IGF note que l'usurpation d'identité à la carte Vitale est résiduelle parmi les fraudes détectées : le risque principal est donc ailleurs, dans la concentration des données.
- **Vie privée : le NIR comme clé unique** : le droit actuel encadre l'usage du NIR par le décret n° 2019-341 du 19 avril 2019 (« décret cadre NIR », pris après avis de la CNIL, délibération n° 2019-029) qui liste les finalités autorisées, dans le champ social. Utiliser le NIR comme clé de tous les services demande de modifier ce cadre ; l'avis de la CNIL sera nécessaire ; la règle de conception du dépôt est de ne pas croiser les fichiers : un identifiant par service dérivé du NIR (identifiants sectoriels), aucune base centrale de tous les services, journal public des accès (voir document de travail de l'atelier, non publié). Position actuelle de la CNIL sur un NIR unique : non lue (⚠️ V19911).
- **Alternative papier permanente** : tout droit s'exerce sans téléphone ni internet, au guichet de proximité (mairie ou structure France services), avec une pièce d'identité et le NIR ; les courriers et formulaires papier restent valables ; la DILA a une fiche « Envoyer une demande à l'administration par courrier ou formulaire papier » (non relue en détail, ⚠️ V19912).
- **Droit à l'erreur et au contestable** : versement provisoire en cas de doute, jamais de suspension automatique d'un revenu minimal ; contestation en un clic avec réponse motivée.

## 7. Ce que je n'ai pas pu faire, et mes doutes

- Le classement est fait par règles de mots-clés ; la relecture a porté sur les 847 démarches et prestations, pas sur les 1 275 règles et informations. Le taux d'erreur n'est pas mesuré.
- Les durées et la plupart des populations sont des hypothèses : le total (≈ 463 millions d'heures) a une incertitude d'un facteur deux au moins, dans les deux sens. Il suppose que le système fonctionne : si le revenu connu à la source est faux ou incomplet, le temps passé à contester ou à corriger peut annuler une part du gain.
- Les pièces demandées ne sont extraites que pour 110 fiches ; les autres demandent de lire le texte de la fiche (lien dans le CSV).
- Pas de relecture des sources secondaires (presse spécialisée, blogs) citées dans les chiffres de cartes ; toutes marquées ⚠️.
- Contradiction à nommer : l'application unique et le NIR comme clé augmentent la capacité de contrôle de l'État (le risque d'un « compte d'État » unique). Le système n'y échappe que par des règles de droit et des audits, pas par la technique seule.

## 8. Sources

- DILA, service-public.gouv.fr, flux « vosdroits » particuliers et professionnels, version du 05/11/2026, consulté le 06 et 07/11/2026 (cote B, textes cités A) ; fiches F265 (carte Vitale), F34441 (CEAM), F14929 (passeport), F1341/F1153 (carte d'identité), F1727 (permis), F1726 (carte grise).
- DGFiP, rapport d'activité 2025 : 41 635 259 foyers fiscaux (rapporté par MoneyVox et Meilleurtaux, cote C pour les relais ; impots.gouv.fr pour la source).
- DREES, suivi mensuel des prestations de solidarité ; CNAF, conjoncture RSA et prime d'activité 2025 T4 (cote A/B).
- DREES, Études et résultats n° 1321 (déc. 2024) ; Assurance maladie, arrêts maladie 2024 : 8,4 millions d'arrêts maladie indemnisés (cote A/B).
- Observatoire de la location meublée (Amarris Immo, d'après DGFiP et Sirene), 1 373 365 contribuables LMNP en 2024 (cote C ; conflit : acteur de l'immobilier).
- IGAS-IGF, rapport sur la carte Vitale biométrique, avril 2023, rapporté par Acteurs Publics et Le Quotidien du médecin (cote C pour les relais ; rapport primaire non relu).
- Cour des comptes (2009), question écrite du Sénat (2013) : coût du passeport biométrique ; Sénat, rapport sur la délivrance des titres (2023-2024). Anciens.
- Règlement (UE) 2024/1183 (eIDAS 2), EUR-Lex ; Euronews, 18/09/2026 (cote C).
- Insee Première n° 1953 (juin 2023) ; Insee, NUM25 (2026) ; Banque mondiale et PwC, *Paying Taxes* 2014 et 2018 (cote B ; PwC a un intérêt commercial dans le conseil fiscal).
- CNIL, délibération n° 2019-029 du 14/03/2019 ; décret n° 2019-341 du 19/04/2019 (cote A).
