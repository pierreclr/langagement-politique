---
titre: Incidents de cybersécurité et fuites de données touchant la France (2020 → octobre 2026)
statut: recherche (sourcé, à relire)
date: 2026-10-25
consultation: toutes les sources ont été consultées le 2026-10-25 sauf mention contraire
---

# Incidents de cybersécurité et fuites de données en France, 2020 → octobre 2026

**Thèse testée** : l'hétérogénéité et la sous-traitance des SI publics causent l'insécurité ; il faudrait centraliser les SI de l'État, avec un langage, une surveillance unique et des IA qui attaquent en permanence nos propres systèmes.

**Légende de la colonne « Thèse »** :
- **A** = appuie la thèse.
- **C** = la contredit.
- **N** = la nuance : le fait pointe une autre cause, ou ne joue que pour une partie de la thèse.

**Niveau de confirmation** :
- **Officiel** : confirmé par l'entité, la CNIL, l'ANSSI ou le Parlement.
- **Presse** : rapporté par la presse sérieuse, mais je n'ai pas lu la source primaire.
- **Revendiqué** : chiffre avancé par l'attaquant, non confirmé.

> Mise en garde méthodologique : une bonne partie des chiffres de 2025-2026 viennent de **revendications de pirates**. L'ANSSI rappelle que, parmi les incidents d'exfiltration qu'elle a traités en 2025, environ 65 % relevaient du bluff ou du recyclage de données déjà publiques (chiffre rapporté par *Le Monde Informatique*, voir [^anssi2025]). Les volumes « revendiqués » ne doivent donc **jamais** être cités comme des faits.

---

## 1. « Les impôts ont été hackés » : ce qui s'est réellement passé à la DGFiP

**Verdict : c'est vrai, mais il faut décrire le mécanisme avec précision.** La DGFiP a subi plusieurs intrusions confirmées en 2026, avec vol de données fiscales et cadastrales. Ce n'était pas une attaque sophistiquée contre le cœur d'impots.gouv.fr. Il s'agit surtout d'**identifiants légitimes volés**, utilisés sur des portails sans double authentification et sans détection des extractions massives.

### 1.1 FICOBA (fin janvier → 13 février 2026)

FICOBA est le fichier national des comptes bancaires.

- **Faits (officiel)** : à partir de fin janvier 2026, un acteur malveillant a utilisé les identifiants d'un **fonctionnaire d'un autre ministère**, qui disposait d'un accès habilité, pour consulter une partie de FICOBA. La DGFiP l'a annoncé par un communiqué le 18 février 2026.
- **Volume** : environ **1,2 million de comptes**, soit moins de 1 % du fichier.
- **Données** : RIB/IBAN, identité, adresse et parfois identifiant fiscal. Les soldes n'ont pas été consultés.
- **Suites** : les accès externes ont été coupés, puis rétablis le 23 mars 2026 à des conditions plus restrictives. La CNIL a été notifiée.
- Sources : [^ficoba-bdf] [^ficoba-futura] [^an-q13370].

### 1.2 « Été noir » 2026 : trois intrusions

Les intrusions ont commencé en mai et ont été découvertes en août 2026.

**Chronologie selon le rapport d'incident de l'ANSSI** (daté du 23 septembre et publié le 29 septembre 2026 [^anssi-dgfip], détaillé par *Next* [^next-dgfip] et *Localtis* [^localtis-anssi-dgfip]) :

1. **Mai 2026** : début de l'infiltration.
2. **9 juin** : l'Éducation nationale transmet des indices. Selon l'ANSSI, ils « auraient dû circuler plus vite ».
3. **15 juin** : deux signalements de partenaires sur des comptes DGFiP compromis restent sans suite.
4. **22-25 juin** : environ **11 Go** exfiltrés depuis l'application **E-Contact**, l'outil de relation usager, via le portail **ADER**. Une réinitialisation du mot de passe le 24 juin **ne coupe pas la session en cours**.
5. **1er juillet** : le prestataire de la DGFiP signale deux comptes mis en vente.
6. **21-23 juillet** : environ **3 Go** de plus exfiltrés.
7. **27 juillet-8 août** : le compte compromis d'un **géomètre-expert d'un cabinet privé** contourne la double authentification par courriel. Les données cadastrales du serveur SPDC sont exfiltrées.
8. **12-13 août** : l'attaquant « ZeroBytes » revendique l'intrusion sur un forum. **Bercy la confirme le 13-14 août** (communiqué n° 953), soit environ sept semaines après les faits.
9. **17-18 août** : découverte d'une **faille logicielle** sur le portail des successions vacantes, permettant un accès sans authentification. L'accès est coupé.
10. **Fin août** : deux suspects de 16 et 18 ans sont interpellés, l'un d'eux est mis en examen et placé en détention. Ce point vient de *Next*, je ne l'ai pas recoupé avec une source judiciaire.

**Volumes** :
- **Volet E-Contact (officiel)** : **678 000** particuliers et professionnels selon le communiqué. La DGFiP et l'ANSSI détaillent ensuite environ **350 000 particuliers** et **250 000 comptes professionnels**. La somme ne correspond pas exactement au total de 678 000, et l'écart n'est pas expliqué.
- **Volet cadastre (officiel)** : au maximum **433 485 particuliers et 1 082 professionnels**. L'attaquant revendiquait environ 2 millions de propriétaires.
- **Volet successions** : volume non établi.

**Données** :
- Volet E-Contact : numéro fiscal, état civil, coordonnées, revenu fiscal de référence, quotient familial, taux de prélèvement à la source, messages échangés avec la DGFiP.
- Volet cadastre : identités, dates et lieux de naissance, adresses, références parcellaires.
- **Selon la DGFiP et la CNIL, les mots de passe et les espaces personnels impots.gouv.fr n'ont pas été compromis** [^cnil-dgfip] [^franceinfo-dgfip].

**Causes établies par l'ANSSI** :
- **Identité** : l'attaquant avait des identifiants valides ou expirés, sans aucune attaque par force brute. Ils avaient probablement été volés par des **infostealers** (logiciels espions) sur des **postes personnels** non administrés. Les portails PIGP et ADER n'avaient **pas de MFA** (authentification multifacteur).
- **Architecture** :
  - Des applications sensibles étaient exposées sur Internet ou joignables depuis le **Réseau interministériel de l'État (RIE)** sans cloisonnement.
  - L'attaquant est entré par des infrastructures **compromises de l'Éducation nationale reliées au RIE**. L'ANSSI juge cette approche « trop permissive ».
- **Détection** :
  - **Aucune exfiltration n'a été détectée**, ni par la DGFiP ni par l'ANSSI.
  - Le SOC (centre de supervision de sécurité) ne surveillait pas ADER.
  - Plusieurs signaux n'ont pas été recoupés : connexions de nuit, IP connues comme malveillantes, volumes anormaux.
- **Verdict de l'ANSSI** : ce n'est **« pas une attaque sophistiquée »**. Selon la presse, cela contredit la présentation initiale de Bercy [^leto-anssi].
- **Recommandations de l'ANSSI** :
  - interdire les postes personnels ;
  - généraliser une MFA robuste, de préférence par clé matérielle ;
  - retirer les applications internes d'Internet, sauf via VPN ;
  - **filtrer plus finement les flux au sein du RIE et entre ministères** ;
  - surveiller toutes les applications, avec quotas et alertes ;
  - couper les sessions lors d'un changement de mot de passe.

**Constats du Parlement et du gouvernement** :
- **Sénat**, note de la commission des finances (MM. Raynal et Husson, septembre 2026) [^publicsenat-dgfip] [^acteurspublics-dgfip] :
  - des « fragilités structurelles » et une « dette technique » importante ;
  - la multiplication des accès de tiers et des canaux ouverts pendant le Covid, jamais refermés ;
  - aucune détection automatique des extractions anormales.
- **Attaques détectées par la DGFiP** : 2 579 en 2023, **6 972 en 2025**, **7 810 à fin août 2026**.
- **Moyens de la DGFiP** (déclaration d'Amélie Verdier le 18 août 2026, rapportée par la presse) : environ **100 postes dédiés à la cybersécurité sur 5 300 informaticiens**.
- **Niveau de conformité** : le *Journal du Net* indique qu'il est passé d'environ 25 % en 2020 à un peu plus de 50 % [^jdn-dgfip]. Ce chiffre vient d'une source secondaire et doit être **⚠️ À VÉRIFIER**.
- **Annonces gouvernementales** :
  - MFA généralisée pour tous les agents d'ici fin 2026 ;
  - quotas d'accès et détection des comportements anormaux ;
  - **simulations offensives assistées par IA** et recours accru à des « hackers éthiques » (bug bounty), annoncés par le ministre David Amiel [^jdn-dgfip] [^selectra-plan] ;
  - audit de l'ANSSI.
- **ANSSI** : création le 7 septembre 2026 de **Reactiv**, une cellule interministérielle de réponse aux fuites de données. Elle peut **imposer des mesures** aux administrations dans des délais contraints [^localtis-reactiv].
- **Assemblée nationale** : proposition de résolution déposée le 27 août 2026 (premier signataire Philippe Latombe) pour créer une commission d'enquête [^an-ppr3112].

### 1.3 Antécédent : 2019, environ 2 000 comptes impots.gouv.fr

En 2019, des **messageries personnelles** d'usagers ont été piratées. Les attaquants ont ensuite demandé la réinitialisation des mots de passe impots.gouv.fr. La DGFiP a bloqué environ 2 000 comptes [^lmi-2019]. Cet incident est antérieur à la période étudiée et n'a pas visé le SI de la DGFiP lui-même.

### 1.4 Formulation recommandée pour le manifeste

Ma proposition : « En 2026, la DGFiP a subi plusieurs intrusions confirmées. Des données fiscales d'environ 600 000 à 680 000 contribuables et des données cadastrales de plus de 430 000 personnes ont été dérobées, et 1,2 million de comptes du fichier FICOBA ont été consultés illégitimement. L'ANSSI conclut à une attaque *non sophistiquée* : des identifiants volés, l'absence de double authentification, un réseau insuffisamment cloisonné et aucune détection des extractions. »

À éviter : « le site des impôts a été piraté » ou « les comptes des contribuables ont été piratés ». C'est inexact pour 2026, car les espaces personnels n'ont pas été compromis selon la DGFiP.

---

## 2. Tableau chronologique

| Date | Entité | Nature | Volume | Cause connue | Conséquences | Confirmation | Thèse | Sources |
|---|---|---|---|---|---|---|---|---|
| Mars 2020 | Ville de Marseille, Aix-Marseille-Provence, Martigues | Rançongiciel (Pysa/Mespinoza) | Serveurs de la métropole chiffrés « à 90 % » selon la métropole | Non publiée | Coût direct d'environ 960 000 € pour la métropole (Cour des comptes) | Officiel (ANSSI, Cour des comptes) | A (collectivités isolées, faibles moyens) | [^marseille] [^ccomptes-2025] |
| Juil. 2020 | Département d'Eure-et-Loir | Rançongiciel | Réseau paralysé | Non publiée | Services dégradés | Presse | A | [^marseille] |
| Nov. 2020 | Ville de Bondy | Rançongiciel | — | Non publiée | Coût de plus de 1,5 M€ (Cour des comptes) | Officiel | A | [^ccomptes-2025] |
| Janv. 2021 | Ville et métropole d'Angers | Rançongiciel | — | Non publiée | Mode dégradé | Presse | A | [^marseille] |
| Févr. 2021 | CH de Dax, puis CH de Villefranche-sur-Saône | Rançongiciel | — | Non publiée | Déprogrammations. Coût d'environ 2,3 M€ pour Dax (presse) | Presse | A / N (obsolescence hospitalière) | [^hopitaux-qdm] [^futura-chsf] |
| Sept. 2021 | AP-HP | Vol de données | Environ **1,4 million** de personnes testées au Covid (2020) | Faille dans un outil de partage de fichiers hébergé par l'AP-HP (hypothèse de l'AP-HP) | Plainte. Données d'identité et résultats de tests | Officiel (AP-HP via la presse) | N (faille logicielle d'un outil tiers) | [^aphp] |
| Mars 2022 | Assurance maladie (Amelipro) | Usurpation de comptes | Environ **510 000** assurés | **19 comptes de professionnels de santé** piratés via leur messagerie | Données d'identité et NIR, sans données de santé | Officiel (CNAM via la presse) | A (accès de tiers) / N (identifiants) | [^amelipro] |
| 20-21 août 2022 | CH Sud Francilien (Corbeil-Essonnes) | Rançongiciel **LockBit** | Environ 11 Go publiés | Non publiée | Rançon de 10 M$ refusée, néonatalogie transférée. **Surcoût d'environ 7 M€** (rapport parlementaire cité par la presse) | Officiel / Presse | A / N | [^chsf] [^hopitaux-qdm] |
| Août 2023 | Pôle emploi | Fuite chez un **prestataire** (Majorel, numérisation) | Jusqu'à **10 millions** de personnes | Faille **MOVEit** (logiciel de transfert de fichiers) exploitée par le gang Clop chez un sous-traitant | Noms et NIR. Enquête du parquet | Officiel (via la presse) | **A** (sous-traitance) | [^pole-emploi] |
| Fin janv. 2024 | **Viamedis** et **Almerys** (tiers payant) | Intrusion | Plus de **33 millions** de personnes | Hameçonnage d'un compte de **professionnel de santé** (Viamedis). Portail pour professionnels (Almerys) | Enquête CNIL. Identité, NIR, contrat | **Officiel (CNIL)** | A (tiers) / **C** (concentration : 2 opérateurs pour la moitié du pays) | [^cnil-viamedis] |
| Févr.-mars 2024 | **France Travail** | Intrusion | **36,8 à 43 millions** de personnes (inscrits sur 20 ans) | **Ingénierie sociale** sur des comptes de conseillers **Cap emploi** (partenaires). Pas de MFA. 13 millions de fiches extraites en un jour sans alerte du SOC | **Amende CNIL de 5 M€** (22 janv. 2026). Injonction clôturée en sept. 2026 | **Officiel (CNIL)** | **A** (partenaires) / N (MFA, journalisation) | [^cnil-ft] [^cnil-ft-cloture] |
| Févr. 2024 | CH d'Armentières | Rançongiciel / vol de données | — | Non publiée | — | Presse | A / N | [^hopitaux-qdm] |
| 10-11 mars 2024 | Sites de l'État, via le **RIE** | **DDoS** (déni de service) revendiqué par « Anonymous Sudan » | « Au moins 200 sites » selon Ouest-France, cité par IT-Connect (⚠️ à vérifier) | Saturation, sans intrusion | Perturbations limitées. Enquête judiciaire | Officiel (Matignon) / Presse | **C** (cible centrale unique) | [^ddos2024] |
| 15-16 avril 2024 | CH Simone-Veil (Cannes) | Rançongiciel **LockBit** | 61 Go publiés le 1er mai | Non publiée | Rançon refusée. Mode dégradé | Officiel (CH) / Presse | A / N | [^cannes] |
| Oct. 2024 | **Free / Free Mobile** | Intrusion | Environ **24 millions** de contrats (19 millions annoncés), environ 5 millions d'IBAN | Sécurité du **VPN** d'accès interne insuffisamment robuste, données conservées trop longtemps | **Amende CNIL de 42 M€** (13 janv. 2026). Recours au Conseil d'État annoncé | **Officiel (CNIL)** | N (hygiène de base, secteur privé) | [^cnil-free] |
| 19 nov. 2024 | Établissement de santé francilien utilisant **Mediboard** (Softway Medical) | Vol de données | **758 912** patients (revendiqué) | Selon l'éditeur, identifiants volés à l'établissement et non une faille du logiciel | — | Revendiqué / Éditeur | N | [^mediboard] |
| 12-13 juil. 2025 | **France Travail** (application **Kairos**) | Intrusion | Environ **340 000** demandeurs d'emploi | **Infostealer** sur le poste d'un **organisme de formation partenaire** | Service fermé, MFA avancée. Alerte donnée par le CERT-FR | Officiel (via la presse) | **A** (partenaires) | [^ft-2025] |
| 25 juil. 2025 | **Orange** | Cyberattaque | Données jugées « obsolètes ou peu sensibles » par Orange. Environ 4 Go publiés par « Warlock » | Non publiée | Services aux entreprises perturbés | Officiel / Revendiqué | N | [^orange] |
| 4-6 août 2025 | **Bouygues Telecom** | Intrusion | **6,4 millions** de comptes clients, dont des IBAN | Non publiée | Plainte, notification à la CNIL | Officiel | N | [^bouygues] |
| 14 nov. 2025 | **Pajemploi** (réseau Urssaf) | Fuite | Jusqu'à **1,2 million** de salariés de particuliers | Non publiée | Notification à l'ANSSI et à la CNIL | Officiel (via la presse) | — | [^pajemploi] |
| 25 nov.-déc. 2025 | **Ministère de l'Intérieur** | Intrusion | 72 fiches TAJ et 23 fiches FPR exfiltrées. L'attaquant revendiquait 16 millions de fiches | Messageries policières piratées, puis **mots de passe échangés en clair par courriel**. Pas de MFA | Arrestation d'un suspect de 22 ans. MFA généralisée | **Officiel (ministre)** | N (hygiène) | [^interieur] [^localtis-serie] |
| Nov.-déc. 2025 | **Ministère des Sports** (Pass'Sport, « Compte Asso ») | Fuite | **3,5 millions** de foyers. L'attaquant revendiquait 22 millions de lignes, avec doublons | Non publiée officiellement | Fuite d'abord attribuée à tort à la CAF. La Cnaf dément toute intrusion | Officiel (ministère) | **A** (données de la CAF exposées chez un autre service public) | [^sports] [^caf] |
| Janv. 2026 | **OFII** | Fuite | Environ 2 millions de lignes (revendiqué) | **Prestataire** de cours de langue compromis | — | Confirmé par l'OFII. Volume revendiqué | **A** | [^localtis-serie] |
| 9 janv. 2026 | **HubEE** (Dinum, plateforme d'échange de documents entre administrations) | Intrusion | **70 000 dossiers, 160 000 documents** | Non détaillée | Plainte, alerte à l'ANSSI | **Officiel (Dinum)** | **C / N** (une brique *mutualisée* interministérielle devient un point de fuite commun) | [^hubee] [^localtis-serie] |
| 19 janv. 2026 | **Urssaf** (API DPAE) | Accès frauduleux | Environ **12 millions** de salariés (identité, date d'embauche, SIRET) | **Compte d'un partenaire** habilité, identifiants volés lors d'une attaque antérieure | Compte suspendu, habilitations revues | Officiel | **A** | [^urssaf] |
| Fin janv.-13 févr. 2026 | **DGFiP, FICOBA** | Consultation illégitime | **1,2 million** de comptes bancaires | Identifiants d'un **fonctionnaire d'un autre ministère** | Accès coupés puis restreints | **Officiel** | A (accès inter-administrations) / N (identifiants) | § 1.1 |
| Fin 2025, révélé le 14 avril 2026 | **Éducation nationale, ÉduConnect** | Intrusion | Non communiqué. Le groupe DumpSec revendique 3,5 millions d'élèves | **Compte d'agent habilité usurpé** et faille connue depuis décembre 2025, en cours de correction | Codes d'activation réinitialisés, MFA en déploiement | Officiel / Revendiqué | N | [^educonnect] |
| 15 avril 2026 | **ANTS / France Titres** | Fuite | **11,7 millions** de comptes (identifiants, noms, courriels, dates de naissance). Pas de pièces justificatives ni de biométrie | Vulnérabilité technique selon une source proche du dossier. Suspect mineur selon un média | Communication cinq jours après la détection | Officiel (communiqué de l'Intérieur via la presse) / cause non confirmée | N | [^ants] |
| 22-23 mai 2026 | **Almerys** (tiers payant) | Intrusion | Plus de 15 millions d'assurés selon une mutuelle cliente. Volume exact non communiqué par Almerys | Non publiée | Seconde attaque en deux ans | Presse / mutuelles | **C** (concentration) / A (prestataire) | [^almerys2026] |
| Juin-août 2026 | **DGFiP** (E-Contact, cadastre, successions vacantes) | Intrusions et vols de données | 678 000 et 433 485 personnes, plus un volume non établi pour les successions | Identifiants volés par infostealer, pas de MFA, **mouvement latéral via le RIE**, compte d'un géomètre privé, faille logicielle (successions) | Audit de l'ANSSI, Reactiv, plan MFA, proposition de commission d'enquête | **Officiel** | A (tiers, dette technique) / **C** (interconnexion centrale) / N (identité) | § 1.2 |
| 25 juil. 2026 | **Éducation nationale** (service de formation des agents) | Intrusion | Non chiffré par le ministère. Revendication de 346 millions de lignes | Compte usurpé | Plainte, ANSSI saisie | Officiel / Revendiqué | N | [^selectra-ete] [^itconnect-ete] |
| Été 2026 | AEFE ; Alaxione (prise de rendez-vous médicaux) | Revendications | Plus de 30 000 pour l'AEFE, 6,8 millions pour Alaxione (revendiqués) | — | — | **Revendiqué, non confirmé** | — | [^selectra-ete] [^tunisie-alaxione] |

**Non vérifié et donc exclu du tableau** :
- les fuites SFR de 2024-2025 (aucune source précise trouvée) ;
- la revendication de LulzSec de 2024 sur 600 000 comptes CAF (invérifiable) ;
- les fuites de la Fédération française de football et de grandes enseignes (non recherchées en détail).

Je n'ai trouvé **aucun incident de septembre-octobre 2026** dans mes recherches. Cela ne prouve pas qu'il n'y en a pas eu.

---

## 3. Chiffres agrégés

| Indicateur | Valeur | Source |
|---|---|---|
| Événements de sécurité traités par l'ANSSI en 2024 | **4 386** (+15 %), dont 1 361 incidents | Panorama 2024, communiqué officiel [^anssi2024] |
| Rançongiciels portés à la connaissance de l'ANSSI en 2024 | 144 (chiffre de *Next*, ⚠️ à vérifier dans le PDF). Les collectivités représentent 17 % des victimes | [^anssi2024] |
| Événements traités par l'ANSSI en 2025 | **3 586** (-18 %, retour à la normale après le pic des JO). Les **incidents avérés sont stables : 1 366** | Panorama 2025, publié le 11 mars 2026 [^anssi2025] |
| Rançongiciels en 2025 | **128**, en légère baisse. Collectivités : 11 % des victimes (une seule source, ⚠️) | [^anssi2025] |
| Exfiltrations de données en 2025 | 196 incidents (130 en 2024). Environ 65 % relevaient du bluff ou du recyclage | [^anssi2025] |
| Secteurs les plus touchés en 2025 (ANSSI) | Éducation et recherche 34 %, ministères et collectivités 24 %, santé 10 %, télécoms 9 % | [^anssi2025] |
| Violations de données notifiées à la CNIL | 5 629 en 2024 (+20 %), **6 167 en 2025 (record)**, plus de 2 730 au 1er trimestre 2026. **Un incident sur deux est un piratage** | [^cnil-ra2025] [^an-ppr3112] |
| Cybermalveillance.gouv.fr en 2025 | Plus de **504 000** parcours d'assistance (+20 %). En 2024, 3 945 collectivités et administrations assistées | [^cybermalv] |
| Collectivités : incidents traités par l'ANSSI | 187 incidents entre janvier 2022 et juin 2023, soit environ 10 par mois | [^cert-collectivites] |
| Hôpitaux | 30 établissements touchés par rançongiciel en 2022-2023, soit environ 10 % des rançongiciels traités par l'ANSSI | [^hopitaux-qdm] |
| Attaques détectées par la DGFiP | 2 579 (2023), 6 972 (2025), 7 810 (fin août 2026) | [^publicsenat-dgfip] |

## 4. Ce qu'on sait du coût pour l'État

**Il n'existe pas de chiffrage consolidé public** du coût des cyberattaques pour l'État. La Cour des comptes souligne elle-même que les coûts indirects sont difficiles à chiffrer [^ccomptes-2025].

**Coûts ponctuels documentés** :
- Aix-Marseille-Provence : environ 960 000 € ;
- Bondy : plus de 1,5 M€ ;
- CH Sud Francilien : surcoût d'environ 7 M€ ;
- Dax : environ 2,3 M€ (presse).

**Amendes CNIL infligées à des organismes publics ou parapublics** : 5 M€ pour France Travail. Il s'agit d'argent public qui passe d'un organisme public au budget de l'État.

**Investissements** :
- programme **CaRE** : 750 M€ prévus de 2023 à 2027 pour les hôpitaux, mais financement garanti seulement jusqu'à fin 2024 selon la Cour [^ccomptes-sante] ;
- 60 M€ annoncés pour les collectivités dans le cadre de France Relance (presse [^maireinfo-60m], année à préciser, ⚠️).

## 5. Causes structurelles pointées par les rapports

| Cause | Ce que disent les sources | Thèse |
|---|---|---|
| **Identifiants volés, absence de MFA** | **Cause dominante** des incidents de 2024-2026 : France Travail, Intérieur, Urssaf, FICOBA, DGFiP, ÉduConnect. La feuille de route SSI de l'État 2026-2027 en fait la priorité (MFA pour les SI « à enjeux » avant le 28 février 2027) [^fdr-ssi] | **N** : ni le langage ni l'hétérogénéité ne sont en cause |
| **Tiers, partenaires, prestataires** | Vecteur récurrent : Majorel/MOVEit, Cap emploi, organisme de formation (Kairos), partenaire Urssaf, prestataire de l'OFII, géomètre (DGFiP), professionnels de santé (Viamedis, Amelipro). La feuille de route 2026-2027 vise la chaîne d'approvisionnement. Le Sénat demande un « meilleur équilibre entre circulation des données et sécurisation des accès » | **A** (mais il s'agit surtout de *partenaires habilités* qui accèdent aux SI, pas de code sous-traité) |
| **Détection insuffisante** | Aucune alerte pour 13 millions de fiches extraites (France Travail), 11 Go extraits (DGFiP), SOC qui ne surveillait pas ADER | **A** pour « surveillance unique » |
| **Gouvernance éclatée** | Cour des comptes (juin 2025) : piliers « insuffisamment pilotés » par le SGDSN, CSIRT à articuler, capacités de l'ANSSI « limitées » en cas d'attaques simultanées [^ccomptes-2025]. Commission d'enquête proposée en raison de cette « gouvernance éclatée » [^an-ppr3112] | **A** |
| **Obsolescence, dette technique** | Hôpitaux publics : 19 % des postes ont plus de 7 ans ou un OS non maintenu, 23 % des équipements réseau ne sont plus maintenables, 22 % des applications métier sont obsolètes. Le numérique pèse 1,7 % du budget des hôpitaux contre 9 % dans la banque [^ccomptes-sante]. La DGFiP évoque une « dette technique » (Sénat, ministre). Les correctifs critiques sont appliqués tardivement dans les collectivités [^ccomptes-2025] | **A** |
| **Hétérogénéité** | Jusqu'à 1 000 applications dans un grand CHU. La Cour recommande la personnalité morale pour les GHT afin d'harmoniser leurs SI [^ccomptes-sante]. La Cour (octobre 2025) relève aussi une hétérogénéité d'outils et des clouds Pi et Nubo peu utilisés, et recommande leur **convergence**, tout en jugeant que **deux infrastructures se justifient pour la résilience** [^an-cr-ccomptes] | **A**, avec une réserve explicite de la Cour en faveur de la redondance |
| **Compétences et effectifs** | DGFiP : environ 100 postes cyber sur 5 300 informaticiens. La Cour (juin 2025) appelle à un « vivier » de compétences pour la fonction publique territoriale. La Cour (octobre 2025) juge l'internalisation complète « irréaliste » et pointe d'abord un défaut de maîtrise d'ouvrage | **A** (partiel) |
| **Équipements de bordure** (VPN, pare-feu) | Plus de la moitié des opérations de cyberdéfense de l'ANSSI en 2024 portaient sur des failles d'équipements de bordure (Ivanti, Fortinet…) [^cert-bordure] | **N** : il s'agit de produits du marché, et un langage unique n'y change rien |

## 6. Failles PHP et Node.js : quel lien avec des systèmes publics français ?

- **PHP, CVE-2024-4577** (PHP-CGI sous Windows) :
  - exploitation massive dans le monde, notamment par le rançongiciel TellYouThePass ;
  - alertes du CERT-FR et du CERT Santé en juin 2024 [^php-cve] ;
  - **je n'ai trouvé aucun incident public français attribué à cette faille**.
- **Node.js et React, « React2Shell » (CVE-2025-55182, décembre 2025)** :
  - faille de React Server Components (Next.js) qui permet d'exécuter du code à distance ;
  - environ 4 000 à 4 700 serveurs exposés en France selon Shadowserver [^react2shell]. Ce sont des serveurs *exposés*, pas des compromissions avérées ;
  - **aucune victime publique française identifiée**.
- **Logiciel tiers à l'origine d'incidents publics confirmés** :
  - **MOVEit** (Pôle emploi, 2023) ;
  - outil de partage de fichiers (AP-HP, 2021) ;
  - faille du portail des successions (DGFiP, 2026, de nature non publiée).
- **Conclusion factuelle** : aucun des grands incidents publics recensés n'est imputé à un **langage de programmation**. Les causes établies relèvent de la gestion des identités, des accès de tiers, de l'architecture (cloisonnement) et de la détection.

## 7. Synthèse : ce que les faits disent de la thèse

**Ce qui appuie la thèse (faits)** :
1. Les accès de **tiers et partenaires** sont la porte d'entrée la plus fréquente des fuites publiques de 2023-2026 (au moins 8 cas du tableau).
2. La Cour des comptes et le Parlement pointent une **gouvernance éclatée**, une **dette technique** et une **obsolescence** mesurée (hôpitaux).
3. La **détection** est défaillante partout : aucune grande fuite publique n'a été détectée en temps réel par l'organisme victime. Dans le cas de la DGFiP, l'information détenue par l'Éducation nationale n'a pas circulé. Cela plaide pour une **supervision et une coordination interministérielles fortes**. L'État y va déjà avec Reactiv (septembre 2026) et la feuille de route ANSSI 2026-2027.
4. L'idée d'**attaquer ses propres systèmes** est reprise par le gouvernement lui-même : bug bounty et simulations offensives assistées par IA annoncés après l'affaire DGFiP. Ce sont des annonces, sans résultats publiés à ce jour.

**Ce qui nuance la thèse (faits)** :
1. La cause n°1 est **banale** : des identifiants volés sans MFA. Selon l'ANSSI, l'attaque contre la DGFiP n'était « pas sophistiquée ». Une MFA robuste, l'interdiction des postes personnels et des quotas d'extraction auraient probablement suffi à empêcher ou limiter la plupart des fuites. C'est l'interprétation qu'on tire des recommandations de l'ANSSI et de la CNIL.
2. **Aucun incident n'est lié au choix d'un langage.** Imposer « un langage » à l'État n'aurait empêché aucun des incidents recensés (interprétation). Cela relève de la qualité logicielle et de la maintenabilité, pas de la cause des fuites observées.
3. Le secteur privé centralisé (Free, Bouygues, Orange) subit les mêmes fuites. L'hétérogénéité propre au secteur public n'est donc pas une condition nécessaire.

**Ce qui contredit la thèse, ou les arguments contraires à prendre au sérieux** :
1. **L'interconnexion centralisée a servi de vecteur.** À la DGFiP, l'attaquant est passé de l'Éducation nationale au fisc **par le réseau interministériel commun (RIE)**. L'ANSSI recommande *plus* de cloisonnement entre ministères, pas moins. Un SI unifié sans segmentation stricte aggrave le risque de mouvement latéral.
2. **Point unique de défaillance** :
   - le RIE a été la cible du DDoS de mars 2024 ;
   - HubEE, une brique mutualisée, a fuité en janvier 2026 ;
   - deux opérateurs de tiers payant concentraient les données d'environ 33 millions de personnes (2024), et Almerys a été de nouveau touché en 2026 ;
   - FICOBA est un fichier central unique.
   La concentration agrandit le butin et le rayon d'impact.
3. **Monoculture** : un même logiciel partout signifie qu'une seule faille touche tout le monde. Exemples : MOVEit (2023, des centaines d'organisations dans le monde), équipements Ivanti et Fortinet. L'incident CrowdStrike de juillet 2024 en est l'illustration mondiale, mais je ne l'ai pas documenté ici pour la France.
4. **La Cour des comptes elle-même** juge qu'il est justifié de garder **deux clouds distincts** (Pi et Nubo) pour la résilience, à condition de coordonner leur développement. Elle trouve aussi l'internalisation totale « irréaliste ».
5. Les capacités de l'ANSSI sont déjà « limitées » en cas d'attaques simultanées (Cour des comptes). Une surveillance « unique » doit être dimensionnée en conséquence, sinon elle devient un goulet d'étranglement.

**Reformulation plus défendable** (proposition, opinion) : il faut **centraliser la gouvernance, les standards et la détection**, c'est-à-dire une autorité capable d'imposer la MFA, des quotas et le cloisonnement, avec une supervision commune et des tests offensifs permanents. En revanche, il ne faut **pas fusionner les SI ni les données** : il faut les cloisonner, les rendre redondants et réduire les accès des tiers. « Un langage » est un argument de maintenabilité et de coûts, pas de sécurité, et il faut le présenter comme tel.

## 8. Limites de cette recherche

- **Sources primaires lues** : les pages de la CNIL (Free, France Travail, Viamedis-Almerys, DGFiP), une page de l'ANSSI et les textes de l'Assemblée nationale. **Le rapport PDF de l'ANSSI sur la DGFiP, les panoramas ANSSI 2024-2025 et le rapport de la Cour des comptes de juin 2025 n'ont pas pu être lus en texte intégral** (extraction PDF impossible ou page vide). Leurs chiffres viennent de la presse spécialisée (*Next*, *Localtis*, *Acteurs publics*, *Le Monde Informatique*) et doivent être revérifiés dans les PDF.
- Plusieurs articles de presse portent des **dates de publication erronées** (republications), ce qui a été relevé à chaque fois.
- La couverture des **collectivités 2022-2026** et des **hôpitaux 2025-2026** est partielle : il n'existe pas de liste exhaustive publique, la plus proche étant les données de l'ANSSI et de la CNIL.
- Il n'existe aucun chiffrage global du coût pour l'État.
- **⚠️ À VÉRIFIER** :
  - le chiffre « 144 rançongiciels en 2024 » ;
  - la part de 11 % des collectivités en 2025 ;
  - la conformité de la DGFiP passée de 25 % à 50 % ;
  - les 60 M€ pour les collectivités ;
  - l'interpellation des suspects de la DGFiP (16 et 18 ans) ;
  - la cause de la fuite de l'ANTS ;
  - le volume de la fuite Almerys 2026.

---

## Sources

[^ficoba-bdf]: Banque de France, « Fuite de données personnelles du fichier national des comptes bancaires (FICOBA) », 2026. https://www.banque-france.fr/fr/actualites/fuite-de-donnees-personnelles-du-fichier-national-des-comptes-bancaires-ficoba-la-banque-de-france — et communiqué DGFiP (PDF, illisible lors de la consultation car le site était en maintenance) : https://www.impots.gouv.fr/sites/default/files/media/2_actu/particulier/401---cp---acces-illegitimes-au-fichier-national-des-comptes-bancaires-ficoba.pdf
[^ficoba-futura]: Futura Sciences, « Piratage DGFiP : 1,2 million d'IBAN consultés », févr. 2026. https://www.futura-sciences.com/tech/actualites/cybersecurite-piratage-dgfip-12-million-iban-sepa-consultes-131701/
[^an-q13370]: Assemblée nationale, question écrite n° 13370 et réponse (FICOBA). https://www.assemblee-nationale.fr/dyn/17/questions/QANR5L17QE13370.pdf
[^anssi-dgfip]: ANSSI, « L'ANSSI publie le rapport d'incident sur les cyberattaques ayant touché la DGFiP », 29 sept. 2026. https://cyber.gouv.fr/actualites/lanssi-publie-le-rapport-dincident-sur-les-cyberattaques-ayant-touche-la-dgfip/
[^next-dgfip]: Next, « Piratage de la DGFiP : pas d'attaque sophistiquée, mais une série de défaillances techniques », 30 sept. 2026. https://next.ink/259041/piratage-de-la-dgfip-pas-dattaque-sophistiquee-mais-une-serie-de-defaillances-techniques/
[^localtis-anssi-dgfip]: Localtis (Banque des Territoires), « Piratage de la DGFiP : l'Anssi décrit une attaque révélatrice de fragilités structurelles », 30 sept. 2026. https://www.banquedesterritoires.fr/piratage-de-la-dgfip-lanssi-decrit-une-attaque-revelatrice-de-fragilites-structurelles
[^leto-anssi]: Leto, « Piratage de la DGFiP : l'ANSSI publie son rapport », 2026. https://www.leto.legal/news/anssi-rapport-incident-dgfip-defaillances-2026
[^cnil-dgfip]: CNIL, « Piratage du système d'information des impôts : les vérifications sont en cours », 18 août 2026. https://www.cnil.fr/fr/piratage-du-systeme-dinformation-des-impots-les-verifications-sont-en-cours
[^franceinfo-dgfip]: franceinfo (L. Chagnon), « Piratage du système d'information des impôts : quelques centaines de milliers d'usagers concernés », 14 août 2026. https://www.franceinfo.fr/internet/securite-sur-internet/cyberattaques/piratage-du-systeme-d-information-des-impots-quelques-centaines-de-milliers-d-usagers-sont-concernes-annonce-la-dgfip_8147609.html
[^publicsenat-dgfip]: Public Sénat (G. Jacquot), « Piratage du portail des impôts : un contrôle du Sénat relève des fragilités structurelles », 7 sept. 2026. https://www.publicsenat.fr/actualites/economie/piratage-du-portail-des-impots-un-controle-du-senat-releve-des-fragilites-structurelles-dans-le-systeme
[^acteurspublics-dgfip]: Acteurs publics, « Cyberattaque de la DGFiP : accès à distance, interconnexions et absence de double authentification en cause », 7 sept. 2026. https://acteurspublics.fr/articles/cyberattaque-de-la-dgfip-acces-a-distance-interconnexions-et-absence-de-double-authentification-en-cause/
[^jdn-dgfip]: Journal du Net (R. Jemai, tribune), « Cyberattaque de la DGFiP : l'électrochoc… », 24 août 2026. https://www.journaldunet.com/cybersecurite/1553815-cyberattaque-de-la-dgfip-l-electrochoc-qui-accelere-la-securisation-des-administrations/
[^selectra-plan]: Selectra, « Plan cybersécurité du fisc : authentification forte, bug bounty, audit ANSSI », août 2026. https://selectra.info/telecom/actualites/marche/plan-cybersecurite-fisc-authentification-forte-bug-bounty-audit-anssi
[^localtis-reactiv]: Localtis, « Cyberattaque de la DGFiP : l'Anssi lance Reactiv, le Sénat pointe les limites des accès partagés », 8 sept. 2026. https://www.banquedesterritoires.fr/cyberattaque-de-la-dgfip-lanssi-lance-reactiv-le-senat-pointe-les-limites-des-acces-partages
[^an-ppr3112]: Assemblée nationale, proposition de résolution n° 3112 tendant à créer une commission d'enquête (P. Latombe et al.), 27 août 2026. https://www.assemblee-nationale.fr/dyn/opendata/PNREANR5L17B3112.html
[^lmi-2019]: Le Monde Informatique, « Bercy a reconnu des activités suspectes sur 2 000 comptes de contribuables », 21 août 2019. https://www.lemondeinformatique.fr/actualites/lire-bercy-a-reconnu-des-activites-suspectes-sur-2000-comptes-de-contribuables-76191.html
[^selectra-ete]: Selectra, « Fuites de données des administrations, été 2026 : le point complet », 19 août 2026. https://selectra.info/finance/actualites/marche/fuites-donnees-administrations-ete-2026-point-complet
[^itconnect-ete]: IT-Connect, « Fuites de données de l'État français : DGFiP, Éducation nationale », 19 août 2026. https://www.it-connect.fr/fuites-donnees-etat-francais-dgfip-education-nationale/
[^tunisie-alaxione]: Tunisie Numérique, « France : un site médical ciblé, 6,8 millions de personnes concernées » (revendication). https://www.tunisienumerique.com/france-cyberattaque-un-site-medical-cible-68-millions-de-personnes-concernees/
[^marseille]: Solutions Numériques, « Les collectivités locales mises en garde par l'ANSSI après la cyberattaque contre Marseille », 2020. https://www.solutions-numeriques.com/les-collectivites-locales-mises-en-garde-par-lanssi-apres-la-cyberattaque-contre-marseille ; Acteurs publics, « Angers rejoint la longue liste des collectivités touchées », 2021. https://acteurspublics.fr/articles/angers-rejoint-la-longue-liste-des-collectivites-touchees-par-une-cyberattaque/
[^ccomptes-2025]: Cour des comptes, *La réponse de l'État aux cybermenaces sur les systèmes d'information civils*, 16 juin 2025. https://www.ccomptes.fr/fr/publications/la-reponse-de-letat-aux-cybermenaces-sur-les-systemes-dinformation-civils — résumé : Localtis, 17 juin 2025. https://www.banquedesterritoires.fr/les-cyberattaques-ciblent-de-plus-en-plus-les-collectivites-alerte-un-rapport-de-la-cour-des
[^hopitaux-qdm]: Le Quotidien du Médecin, « Trente hôpitaux français ont été visés par des cyberattaques en deux ans » (d'après l'ANSSI), 2024. https://cardiologie.lequotidiendumedecin.fr/hopital/securite-des-soins/trente-hopitaux-francais-ont-ete-vises-par-des-cyberattaques-en-deux-ans
[^futura-chsf]: Futura Sciences, « Paralysé par une cyberattaque, le CH de Corbeil-Essonnes ne versera pas de rançon », 2022. https://www.futura-sciences.com/tech/actualites/internet-paralyse-cyberattaque-centre-hospitalier-corbeil-essonnes-ne-versera-pas-rancon-100346/
[^aphp]: Le Quotidien du Médecin, « Piratage : les données de 1,4 million de tests Covid dérobées à l'AP-HP », sept. 2021. https://cancerologie.lequotidiendumedecin.fr/actus-medicales/esante/piratage-les-donnees-de-14-million-de-tests-covid-derobees-lap-hp
[^amelipro]: Le Monde Informatique, « Assurance maladie : vol de données de 510 000 assurés », mars 2022. https://www.lemondeinformatique.fr/actualites/lire-assurance-maladie-vol-de-donnees-de-510-000-assures-maj-86169.html
[^chsf]: Public Sénat, « Cyberattaque de l'hôpital de Corbeil-Essonnes : Lockbit… », 2022. https://www.publicsenat.fr/actualites/societe/cyberattaque-de-l-hopital-de-corbeil-essonnes-lockbit-contribue-a-attaquer-les ; Solutions Numériques, « Des données médicales du CH de Corbeil-Essonnes dévoilées par Lockbit ». https://www.solutions-numeriques.com/des-donnees-medicales-du-centre-hospitalier-de-corbeil-essonnes-devoilees-par-lockbit/
[^pole-emploi]: SecurityWeek, « 10 million likely impacted by data breach at French unemployment agency », août 2023. https://www.securityweek.com/10-million-likely-impacted-by-data-breach-at-french-unemployment-agency/ ; Europe 1. https://www.europe1.fr/societe/fuite-de-donnees-chez-pole-emploi-que-risquent-les-10-millions-de-francais-potentiellement-concernes-4200138
[^cnil-viamedis]: CNIL, « Violation de données de deux opérateurs de tiers payant : la CNIL ouvre une enquête », 7 févr. 2024. https://www.cnil.fr/fr/violation-de-donnees-de-deux-operateurs-de-tiers-payant-la-cnil-ouvre-une-enquete-et-rappelle-aux
[^cnil-ft]: CNIL, « Violation de données : sanction de 5 millions d'euros à l'encontre de France Travail », 29 janv. 2026. https://www.cnil.fr/fr/violation-de-donnees-sanction-5millions-france-travail
[^cnil-ft-cloture]: CNIL, « Closure of the order issued against France Travail », 2026. https://www.cnil.fr/en/closure-order-issued-against-france-travail
[^ddos2024]: Siècle Digital, « Plusieurs ministères perturbés par une cyberattaque menée par des hackers pro-russes », 12 mars 2024. https://siecledigital.fr/2024/03/12/plusieurs-ministeres-perturbes-par-une-cyberattaque-menee-par-des-hackers-pro-russes/
[^cannes]: The Record, « LockBit publishes data from Hôpital de Cannes », mai 2024. https://therecord.media/lockbit-ransomware-hopital-de-cannes-data-published
[^cnil-free]: CNIL, « Violation de données : sanction de 42 millions d'euros à l'encontre des sociétés Free Mobile et Free », janv. 2026. https://www.cnil.fr/fr/sanction-free-2026
[^mediboard]: Le Quotidien du Médecin, « Ce que l'on sait du vol de données de santé de plus de 750 000 patients », nov. 2024. https://www.lequotidiendumedecin.fr/hopital/ce-que-lon-sait-du-vol-de-donnees-de-sante-de-plus-de-750-000-patients-dun-etablissement-francilien
[^ft-2025]: Localtis, « France Travail victime d'une cyberattaque, 340 000 demandeurs d'emploi potentiellement concernés », juil. 2025. https://www.banquedesterritoires.fr/france-travail-victime-dune-cyberattaque-340000-demandeurs-demploi-potentiellement-concernes ; Next. https://next.ink/193279/un-incident-cyber-expose-les-donnees-de-340-000-usagers-france-travail/
[^orange]: CyberInsider, « Orange France reports cyberattack disrupting business services », juil. 2025. https://cyberinsider.com/orange-france-reports-cyberattack-disrupting-business-services/
[^bouygues]: BleepingComputer, « Bouygues Telecom confirms data breach impacting 6.4 million customers », août 2025. https://www.bleepingcomputer.com/news/security/bouygues-telecom-confirms-data-breach-impacting-64-million-customers/
[^pajemploi]: BleepingComputer, « French agency Pajemploi reports data breach affecting 1.2M people », nov. 2025. https://www.bleepingcomputer.com/news/security/french-agency-pajemploi-reports-data-breach-affecting-12m-people/
[^interieur]: Public Sénat, « Cyberattaque contre le ministère de l'Intérieur : Laurent Nuñez va généraliser la double identification », déc. 2025. https://www.publicsenat.fr/actualites/politique/cyberattaque-contre-le-ministere-de-linterieur-laurent-nunez-va-generaliser-la-double-identification-pour-lacces-aux-applications ; Solutions Numériques (72 fiches TAJ). https://www.solutions-numeriques.com/cyberattaque-au-ministere-de-linterieur-failles-dhygiene-numerique-72-fiches-taj-exfiltrees-et-generalisation-du-mfa-annoncee/
[^localtis-serie]: Localtis, « Fuite de données personnelles : la série noire continue pour l'État », 20 janv. 2026. https://www.banquedesterritoires.fr/fuite-de-donnees-personnelles-la-serie-noire-continue-pour-letat
[^sports]: Europe 1, « Cyberattaque : le ministère des Sports visé, 3,5 millions de foyers concernés », déc. 2025. https://www.europe1.fr/societe/cyberattaque-le-ministere-des-sports-vise-a-son-tour-par-un-vol-de-donnees-35-millions-de-foyers-concernes-875806
[^caf]: Solutions Numériques, « Cyberattaque à la CAF : la Cnaf dément toute intrusion », déc. 2025. https://www.solutions-numeriques.com/cyberattaque-a-la-caf-la-cnaf-dement-toute-intrusion-et-evoque-des-donnees-issues-de-partenaires-publics/
[^hubee]: IT-Connect, « Piratage HubEE : l'État confirme la fuite de 160 000 documents », janv. 2026. https://www.it-connect.fr/piratage-hubee-letat-confirme-la-fuite-de-160-000-documents-avec-des-donnees-sensibles/
[^urssaf]: Le Monde Informatique, « Piratage de l'Urssaf : les données de 12 millions de personnes exposées », janv. 2026. https://www.lemondeinformatique.fr/actualites/lire-piratage-de-l-urssaf-les-donnees-de-12-millions-de-personnes-exposees-99089.html
[^educonnect]: Localtis, « Cyberattaque : des données d'élèves piratées au ministère de l'Éducation nationale », avril 2026. https://www.banquedesterritoires.fr/cyberattaque-des-donnees-deleves-piratees-au-ministere-de-leducation-nationale ; IT-Connect. https://www.it-connect.fr/piratage-educonnect-les-donnees-personnelles-deleves-dans-la-nature/
[^ants]: Le Petit Journal, « Fuite de données à l'ANTS : 11,7 millions de comptes seraient concernés », avril 2026. https://lepetitjournal.com/expat-pratique/fuite-de-donnees-lants-117-millions-de-comptes-seraient-concernes-441096 ; Journal du Geek, 4 mai 2026. https://www.journaldugeek.com/2026/05/04/piratage-de-lants-11-millions-de-francais-pirates-le-gouvernement-annonce-une-mesure-radicale/
[^almerys2026]: Alan, « Incident de sécurité chez notre prestataire de tiers-payant », mai 2026. https://alan.com/fr-fr/blog/tout-alan/a/incident-securite-almerys ; Le Quotidien du Pharmacien. https://www.lequotidiendupharmacien.fr/exercice-pro/cyberattaque-dalmerys-quel-impact-sur-la-teletransmission
[^anssi2024]: ANSSI, communiqué « Panorama de la cybermenace 2024 », 11 mars 2025. https://cyber.gouv.fr/sites/default/files/document/ANSSI_20250311_CP_Panorama_cybermenace_2024.pdf ; Next. https://next.ink/175401/en-france-le-niveau-de-risque-des-cybermenaces-est-particulierement-eleve/
[^anssi2025]: ANSSI, « Panorama de la cybermenace 2025 », 11 mars 2026. https://cyber.gouv.fr/actualites/panorama-de-la-cybermenace-2025/ ; Le Monde Informatique. https://www.lemondeinformatique.fr/actualites/lire-un-niveau-de-menaces-toujours-tres-eleve-en-2025-selon-l-anssi-99602.html ; Solutions Numériques (bluff). https://www.solutions-numeriques.com/fuites-de-donnees-lanssi-evoque-beaucoup-de-bluff-derriere-certaines-revendications-de-vols-de-donnees/
[^cnil-ra2025]: CNIL, « Rapport annuel 2025 ». https://cnil.fr/fr/rapport-annuel-2025 ; Maire-info (6 167 notifications). https://www.maire-info.com/numerique/face-un-nombre-record-violations-donnees-en-2025-la-cnil-va-renforcer-ses-controles-article-30796
[^cybermalv]: Cybermalveillance.gouv.fr, communiqué du rapport d'activité 2025, mars 2026. https://www.cybermalveillance.gouv.fr/medias/2026/03/CP-RA2026.pdf
[^cert-collectivites]: CERT-FR, état de la menace sur les collectivités territoriales (CERTFR-2025-CTI-002). https://cert.ssi.gouv.fr/uploads/CERTFR-2025-CTI-002.pdf ; Localtis. https://www.banquedesterritoires.fr/lanssi-decrypte-les-cyberattaques-subies-par-les-collectivites-territoriales
[^ccomptes-sante]: Cour des comptes, *La sécurité informatique des établissements de santé*, 3 janv. 2025. https://www.ccomptes.fr/fr/publications/la-securite-informatique-des-etablissements-de-sante ; Le Monde Informatique, 6 janv. 2025. https://www.lemondeinformatique.fr/actualites/lire-la-cour-des-comptes-au-chevet-de-la-securite-des-etablissements-de-sante-95661.html
[^maireinfo-60m]: Maire-info, « Le gouvernement débloque 60 millions d'euros pour lutter contre les cyberattaques dans les collectivités locales ». https://www.maire-info.com/le-gouvernement-debloque-60-millions-d%27euros-pour-lutter-contre-les-cyberattaques-dans-les-collectivites-locales-article-25032
[^fdr-ssi]: ANSSI, *Feuille de route de sécurité numérique de l'État 2026-2027*, 9 avril 2026. https://cyber.gouv.fr/nous-connaitre/publications/feuilles-de-route-de-la-securite-numerique-de-letat/feuille-de-route-de-securite-numerique-2026-2027/ ; Localtis, 13 avril 2026. https://www.banquedesterritoires.fr/la-lutte-contre-les-fuites-de-donnees-priorite-de-la-nouvelle-feuille-de-route-ssi-de-letat
[^an-cr-ccomptes]: Assemblée nationale, commission d'enquête sur les dépendances structurelles dans le numérique, audition de la Cour des comptes, 17 mars 2026 (sur le rapport du 31 oct. 2025 *Enjeux de souveraineté des SI civils de l'État*). https://www.assemblee-nationale.fr/dyn/opendata/CRCANR5L17S2026PO878304N004.html ; rapport : https://www.ccomptes.fr/sites/default/files/2025-10/20251031-S2025-1479-Enjeux-souverainete-des-SI-civils-de-l-Etat.pdf
[^cert-bordure]: CERT-FR, retour d'expérience sur les vulnérabilités des équipements de bordure, juin 2024. https://cert.ssi.gouv.fr/uploads/20240612_NP_ANSSI-SDO_Retex-Vuln_vf.pdf ; Solutions Numériques. https://www.solutions-numeriques.com/les-attaques-via-des-equipements-de-bordure-en-hausse-selon-lanssi
[^php-cve]: CERT Santé, alerte CVE-2024-4577, juin 2024. https://cyberveille-sante.gouv.fr/alertes/php-cve-2024-4577-2024-06-10 ; IT-Connect (exploitation par TellYouThePass). https://www.it-connect.fr/le-ransomware-tellyouthepass-exploite-la-faille-critique-dans-php-pour-pirater-les-serveurs-web/
[^react2shell]: IT-Connect, « React2Shell : 4 700 serveurs vulnérables en France ». https://www.it-connect.fr/react2shell-4-700-serveurs-vulnerables-en-france-plus-de-77-000-dans-le-monde/
