---
titre: Contrôle de complétude du grand livre (T65)
statut: généré le 2026-11-06 par `modeles/grand-livre/code/completude.py --ecrire` (ne pas éditer à la main) ; vérifications V17600 à V17606
---

# Contrôle de complétude : qui a-t-on oublié ?

Écrit par Claude (IA d'Anthropic) pour l'auteur. Demande du 06/11/2026 : avant d'écrire qu'on a trouvé la réalité, s'assurer qu'aucun organisme public ne devient « fantôme » (sans financement ni rattachement dans le nouveau système) et qu'aucun flux n'est oublié. Trois contrôles : (a) les personnes morales publiques de référence que nos recensements ne contiennent pas ; (b) les organismes dont la source de financement disparaît ; (c) les flux du grand livre sans organisme rattaché. Les propositions sont de Claude, aucune n'est une décision.

**Conflit d'intérêts** : Claude est un modèle d'Anthropic ; certaines propositions de fusion visent des organismes dont le sort touche des partenaires sociaux et des élus : c'est à l'auteur de trancher.

## 1. Liste de référence et méthode

| Référence | Contenu | Source | Cote | Conflit d'intérêts |
|---|---|---|---|---|
| SIRENE, catégories juridiques publiques, unités actives | 96032 personnes morales dans 68 catégories (stock au 01/10/2026, table `sirene` de la base) | [data.gouv.fr, base SIRENE (Insee)](https://www.data.gouv.fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret), lue en local le 06/11/2026 | A | aucun connu |
| Liste Insee des ODAC (S13112) | 730 lignes (726 libellés distincts) | [Insee, liste des ODAC](https://www.insee.fr/fr/information/2028129), table `odac_insee_liste` | A | aucun connu |
| OFGL / DGCL (collectivités, syndicats, EPL) | présence du SIREN dans les comptes locaux 2024 (EPL 2025) | [OFGL](https://www.ofgl.fr/), tables `collectivites`, `epl` | A | aucun connu |
| Nos recensements | `instances.csv`, `odac.csv`, `etat.csv`, `apul.csv`, `asso.csv`, `recettes.csv`, jaune des opérateurs (`etat_operateurs`, `odac`) | grand livre | A à C | voir chaque fichier |

**Six statuts** pour chaque entité de référence : *nommée* (rapprochée par nom exact à une instance, une ligne du grand livre, un opérateur du jaune ; pas d'ambiguïté) ; *rapprochement* (même entité probable, rapprochée par sigle ou par recouvrement partiel des noms : taux d'erreur ci-dessous) ; *fermeture* (la catégorie n'a pas de ligne propre : elle est dans une ligne de fermeture « par différence », comme le résidu ODAL de `apul.csv` ou GL-ODAC-099) ; *agrégée* (la catégorie entière est portée par une ligne agrégée du grand livre qui retombe sur l'Insee : les communes, par exemple, sont dans `apul.csv` par catégorie, avec leur SIREN dans les tables OFGL) ; *absente* (rien de tout cela). Un statut « agrégée » garantit le **montant**, pas l'**instance** : l'organisme n'a pas de ligne propre, donc pas de sort propre dans le nouveau système.

**Limites.** (1) Le périmètre « public » de SIRENE (catégories juridiques) n'est pas le périmètre S13 de l'Insee : des producteurs marchands (régies, EPIC locaux, bailleurs sociaux) sont publics au sens juridique sans être des APU. Une entité « absente » n'est donc pas forcément une dépense oubliée ; c'est une entité à classer. (2) Seule la liste des ODAC de l'Insee est dans notre base : les listes des ODAL et des ASSO (S1313, S1314) manquent (V17607). (3) Les effectifs sont des planchers (tranche SIRENE, borne basse ; « NN » compté 0), seulement pour les employeurs diffusés.

## 2. Résultat global

| Statut | Entités | Part |
|---|---|---|
| nommée | 181 | 0,2 % |
| rapprochement | 97 | 0,1 % |
| agrégée | 72037 | 75,0 % |
| fermeture | 4543 | 4,7 % |
| listée Insee seulement | 136 | 0,1 % |
| absente | 19038 | 19,8 % |
| **Total** | **96032** | 100 % |

Liste Insee des ODAC (730 lignes) :

| Statut | Lignes | Part |
|---|---|---|
| nommée (instance, ligne du grand livre ou opérateur du jaune) | 142 | 19,5 % |
| rapprochement (sigle ou nom partiel) | 166 | 22,7 % |
| agrégée (universités, ARS) | 141 | 19,3 % |
| seulement dans la ligne de fermeture GL-ODAC-099 | 281 | 38,5 % |

**Lecture.** Les 281 entités de l'Insee « seulement dans GL-ODAC-099 » sont comptées en montant (la ligne de fermeture porte 9,253 Md€) mais n'ont ni ligne ni sort : elles sont à classer, par fonction, ci-dessous.

### Taux d'erreur des rapprochements

Échantillon relu à la main : **59 rapprochements** non exacts tirés au hasard (graine 20261106), `completude-echantillon.csv` ; verdict « ok » (même entité ou même famille d'instances), « incertain » (homonymes, impossible de trancher sans ouvrir la fiche) ou « faux » (entité différente). **0 faux et 3 incertains sur 59 : taux d'erreur estimé 0,0 % en comptant les faux seuls, 5,1 % en comptant aussi les incertains** ; borne haute à 95 % pour l'erreur réelle (règle de trois, 3 cas sur 59) : environ 8 %. Attention : le tirage porte sur des noms distincts ; une version antérieure du script rapprochait par le sigle « GIP » (générique) et donnait des rapprochements faux en série (par exemple des dizaines de GIP rattachés à « Maisons des adolescents ») : le sigle est désormais exclu de l'index, d'autres sigles génériques aussi (liste `SIGLES_GENERIQUES`).

| Type de rapprochement | Relus | Faux ou incertains | Taux |
|---|---|---|---|
| nom | 34 | 3 | 8,8 % |
| sigle | 25 | 0 | 0,0 % |

Sur l'ensemble : 393 rapprochements non exacts (SIRENE : 227, liste Insee : 166). Liste complète dans `completude-rapprochements.csv` (colonne de verdict remplie pour l'échantillon). Les rapprochements faux relus sont corrigés dans les compteurs en lisant le fichier (ils restent marqués) : les compteurs ci-dessus sont **bruts**.

⚠️ 6 lignes de l'échantillon ne correspondent plus au tirage actuel (données changées) : à retirer.

## 3. (a) Entités publiques absentes de nos recensements, par catégorie

Effectifs : plancher de la tranche SIRENE, employeurs diffusés seulement. « agrégée » : portée par une ligne agrégée ; « absente » : à classer.

| Cat. | Libellé | Actives | nommées | rapprochement | agrégées | absentes | effectif plancher des absentes |
|---|---|---|---|---|---|---|---|
| 7323 | Association foncière de remembrement | 6311 | 0 | 0 | 0 | **6311** | 658 |
| 7321 | Association syndicale autorisée | 6284 | 0 | 0 | 0 | **6284** | 733 |
| 7430 | Établissement public des cultes d'Alsace-Lorraine | 1927 | 0 | 0 | 0 | **1927** | 1 660 |
| 7313 | Section de commune | 916 | 0 | 0 | 0 | **916** | 0 |
| 7410 | Groupement d'intérêt public (GIP) | 875 | 6 | 9 | 0 | **860** | 18 463 |
| 4140 | Établissement public local à caractère industriel ou commercial | 1077 | 0 | 0 | 579 | **498** | 37 011 |
| 7450 | Etablissement public administratif, cercle et foyer dans les armées | 354 | 0 | 0 | 0 | **354** | 0 |
| 7345 | Syndicat intercommunal à vocation multiple (SIVOM) | 1503 | 0 | 0 | 1220 | **283** | 1 |
| 7322 | Association foncière urbaine | 246 | 0 | 0 | 0 | **246** | 11 |
| 4150 | Régie d'une collectivité locale à caractère industriel ou commercial | 425 | 0 | 0 | 192 | **233** | 5 107 |
| 7353 | Syndicat intercommunal à vocation unique (SIVU) | 4151 | 0 | 0 | 3927 | **224** | 561 |
| 7381 | Organisme consulaire | 218 | 0 | 0 | 0 | **218** | 26 686 |
| 7210 | Commune et commune nouvelle | 34960 | 0 | 0 | 34822 | **138** | 63 |
| 7354 | Syndicat mixte fermé | 1961 | 0 | 0 | 1831 | **130** | 32 |
| 7389 | Établissement public national à caractère administratif | 188 | 84 | 7 | 0 | **97** | 27 353 |
| 7355 | Syndicat mixte ouvert | 825 | 0 | 0 | 742 | **83** | 0 |
| 7384 | Autre établissement public national d'enseignement | 124 | 18 | 8 | 38 | **60** | 5 700 |
| 4110 | Établissement public national à caractère industriel ou commercial dot | 77 | 17 | 6 | 0 | **54** | 11 860 |
| 7490 | Autre personne morale de droit administratif | 80 | 3 | 39 | 0 | **38** | 5 266 |
| 7383 | Établissement public national à caractère scientifique culturel et pro | 157 | 19 | 2 | 102 | **34** | 11 200 |
| 7385 | Autre établissement public national administratif à compétence territo | 63 | 11 | 19 | 0 | **33** | 11 650 |
| 7356 | Commission syndicale pour la gestion des biens indivis des communes | 203 | 0 | 0 | 171 | **32** | 0 |
| 7346 | Communauté de communes | 1014 | 0 | 0 | 986 | **28** | 0 |
| 7351 | Institution interdépartementale ou entente | 39 | 0 | 0 | 15 | **24** | 0 |
| 7363 | Caisse de crédit municipal | 18 | 0 | 0 | 0 | **18** | 454 |
| 4120 | Établissement public national à caractère industriel ou commercial non | 18 | 4 | 2 | 0 | **12** | 12 900 |
| 7111 | Autorité constitutionnelle | 12 | 0 | 0 | 0 | **12** | 4 870 |
| 7112 | Autorité administrative ou publique indépendante | 31 | 19 | 4 | 0 | **8** | 2 300 |
| 7229 | (Autre) Collectivité territoriale | 12 | 0 | 0 | 6 | **6** | 100 |
| 7225 | Collectivité et territoire d'Outre Mer | 5 | 0 | 0 | 0 | **5** | 10 |
| 7348 | Communauté d'agglomération | 231 | 0 | 0 | 229 | **2** | 0 |
| 7340 | Pôle métropolitain | 23 | 0 | 0 | 21 | **2** | 0 |
| 7349 | Autre établissement public local de coopération non spécialisé ou ente | 2 | 0 | 0 | 0 | **2** | 0 |
| 4160 | Institution Banque de France | 1 | 0 | 0 | 0 | **1** | 5 000 |
| 7382 | Établissement public national ayant fonction d'administration centrale | 2 | 0 | 1 | 0 | **1** | 0 |

Catégories **entièrement couvertes** (nommées, rapprochées ou agrégées) : 7113 (36), 7120 (174), 7150 (21), 7160 (120), 7171 (194), 7172 (833), 7179 (383), 7220 (94), 7230 (14), 7312 (403), 7331 (8097), 7343 (14), 7344 (21), 7357 (121), 7361 (12367), 7362 (4356), 7364 (776), 7366 (1276), 7367 (353), 7372 (101), 7373 (75), 7378 (131), 7379 (284), 7470 (483), 7510 (1), 8110 (397), 8120 (114), 8130 (236), 8140 (129), 8150 (8), 8160 (30), 8170 (47), 8190 (10).

**À retenir.**

- **GIP (7410)** : 875 actifs, 755 absents de nos listes (nous en recensons 29 dans `instances.csv`). Beaucoup sont locaux (maisons départementales des personnes handicapées, groupements de formation, développement territorial) et relèvent de l'APUL ou de l'ODAL, mais cela n'est pas établi ligne à ligne : **le plus gros trou d'instances**.
- **Organismes consulaires (7381)** : 218 actifs, 218 absents ; la recette (taxes pour organismes consulaires, 1,271 Md€) est dans `recettes.csv` mais aucune chambre n'a de ligne de dépense ni de sort (voir F10).
- **Établissements publics nationaux (7383, 7384, 7385, 7389)** : 532 actifs, 196 absents après rapprochement ; beaucoup sont des écoles, des conservatoires et des établissements à effectifs réduits, ou des établissements déjà dans le jaune sous un autre nom (rapprochement par nom seul).
- **Catégories locales (OFGL)** : communes, syndicats, CCAS, SDIS, EPLE : voir tableau ; les absents sont des SIREN sans comptes OFGL 2024 (entités sans budget publié, entités fusionnées, ou hors du champ de la DGCL) ; ils ne pèsent pas dans les 330,484 Md€ de l'APUL mais leur sort n'est pas défini.
- **Associations syndicales (7321, 7322, 7323)** : 12841 actives ; le classement S13 n'est pas établi par nos fichiers : à vérifier avant de dire qu'elles sont dans ou hors de la dépense publique (V17608).

Liste nominative complète des absentes : `completude-absents.csv` (SIREN, dénomination, catégorie, tranche d'effectifs). Aucune donnée sur des personnes physiques.

### Liste Insee des ODAC non portés individuellement, par fonction

| Fonction COFOG (Insee) | Entités « seulement dans GL-ODAC-099 » | Exemples |
|---|---|---|
| Services généraux des administrations publiques | 96 | BPI_PARTICIP  Bpifrance Participations ; CDAD GIP Conseil départemental de laccès au droi ; CDAD GIP Conseil départemental de l'accès au dro |
| Enseignement | 92 | AGRO Institut national d'enseignement supérieur  ; l'environnement (INESAAE) ; support à l'enseign. sup. ou à la re |
| Loisirs, culture et culte | 57 | ABES Agence bibliographique de l'enseignement su ; ACADE académie agriculture de France ; ACADE académie de chirurgie |
| Affaires économiques | 21 | ACTA association de coordination des techniques  ; AFDPAB Groupement d'intérêt public Agence frança ; l'agriculture biologique |
| Santé | 11 | AASPEG Groupement d'intérêt public Réseau addict ; sociaux ; et du travail |
| Protection sociale | 3 | AGS association pour la gestion du régime d'assu ; CLEISS Centre des liaisons européennes et intern ; ONAC Office national des anciens combattants et  |
| Protection de l’environnement | 1 | ECOFOR Groupement d'intérêt public Ecosystèmes f |

## 4. (b) Fantômes potentiels : le financement disparaît, le rattachement reste flou

Méthode : pour chaque flux de `recettes.csv` dont le sort est « supprimé », « remplacé » ou « à arbitrer », on cherche l'organisme bénéficiaire (rapprochement de noms dans les fichiers de dépense, instances à l'appui), on lit le sort de sa dépense dans le grand livre, et on confronte aux arbitrages 44 et 47 à 50 des arbitrages du 05/11/2026. Montants de recette : Insee 2024, cote A. Montants de dépense : somme des lignes qui contiennent le nom (rapprochement par nom, à relire : un total fort peut mêler des lignes sans rapport).

| Réf. | Flux et bénéficiaires | Recette qui disparaît (Md€, 2024) | Sort des recettes | Dépense jumelle dans le grand livre (lignes ; Md€ ; sorts) | État dans le nouveau système | Proposition de Claude | Statut |
|---|---|---|---|---|---|---|---|
| F1 | Contribution formation professionnelle et apprentissage (11,426) : France compétences, OPCO | 11,426 | à_arbitrer 1 | 3 ; 17,095 ; à_arbitrer 2, fondu:opco 1 (GL-ODAC-FC, GL-ODAC-FC-OPCO, GL-ODAC-OPCO) | fondue dans la fonction des revenus (arbitrage 47, 06/11) ; un seul organisme (arbitrage 48) ; le trou de 27,2 Md€ (ligne C10 du bilan) n'est pas encore financé | reprendre par le budget commun ; fusionner France compétences et les 11 OPCO dans l'organisme unique de la formation (arbitrage 48) ; l'alternance et le CPF deviennent des lignes de ce budget | proposition de Claude, conforme aux arbitrages 47-48 |
| F2 | CNSA : contribution de solidarité pour l'autonomie (2,468) | 2,468 | à_arbitrer 1 | 6 ; 23,158 ; reste 6 (GL-ASSO-PRE-CNSA-11-4-01, GL-ASSO-PRE-CNSA-11-4-02, GL-ASSO-PRE-CNSA-12-3-33, GL-ASSO-PRE-CNSA-12-4-01) | fondue dans la fonction des revenus (arbitrage 47) ; CSG qui finance aussi la CNSA remplacée par la fonction des revenus ; dépense CNSA 'reste' (non modélisée) | reprendre par le budget commun : la CNSA devient une ligne du budget (autonomie), ses concours aux départements (APA, PCH) restent | à décider par l'auteur (la CNSA est aussi une caisse : la fusionner avec le régime général ou la garder comme fonds) |
| F3 | AGS : régime de garantie des salaires (1,538) | 1,538 | à_arbitrer 1 | 0 ; 0,000 ; aucune ligne () | fondue dans la fonction des revenus (arbitrage 47) ; l'AGS figure dans la liste Insee des ODAC mais n'a aucune ligne de dépense nommée dans nos fichiers (portée par GL-ODAC-099) | reprendre par le budget commun ; garder la mission (payer les salaires en cas de faillite) et la confier à l'organisme de l'assurance chômage / complément chômage ; ne pas la supprimer sans remplacement | à décider par l'auteur ; ⚠️ la dépense AGS n'est pas isolée dans le grand livre (V17600) |
| F4 | Action Logement : PEEC (1,504) et FNAL (2,935) | 4,439 | à_arbitrer 2 | 3 ; 15,202 ; remplacé:fonction_revenus 1, reste 2 (GL-ETAT-BG-P109-C61, GL-ETAT-BG-P109-C64, GL-ODAC-ANRU) | PEEC et FNAL fondus (arbitrage 47) ; l'aide au logement (APL, D06) est « remplacée » par la fonction des revenus (etat.csv P109) ; Action Logement Services n'a pas de ligne propre (GL-ODAC-099) | reprendre par le budget commun la part qui finance l'ANRU et les aides aux salariés ; fusionner Action Logement Services avec l'ANAH et le bailleur d'État unique ; supprimer le reste avec sa mission | à décider par l'auteur (Action Logement est gouverné par les partenaires sociaux : sortie de la gouvernance paritaire à arbitrer) |
| F5 | Forfait social (6,300) et contribution sur stock-options (1,033) | 7,333 | à_arbitrer 2 | 0 ; 0,000 ; non isolée (dépenses par fonction ou par régime) () | fondus dans la fonction des revenus (arbitrage 47) ; recette de la Sécurité sociale, sans organisme bénéficiaire distinct | reprendre par le budget commun (pas d'organisme fantôme : c'est une recette générale de la Sécurité sociale) | proposition de Claude ; montant à reprendre : 7,333 Md€ |
| F6 | Taxe sur les salaires (17,315), C3S (5,228) | 22,543 | supprimé 2 | 0 ; 0,000 ; non isolée (dépenses par fonction ou par régime) () | supprimées (ligne P06 du bilan, comptées dans le solde) ; recettes de la Sécurité sociale (ASSO) | déjà dans le solde (P06) ; aucun organisme fantôme, mais vérifier le rattachement de la C3S au régime des indépendants | proposition de Claude ; ⚠️ rattachement par branche non vérifié (V17601) |
| F7 | Versement mobilité (12,244) : autorités organisatrices de la mobilité, Île-de-France Mobilités | 12,244 | supprimé 1 | 1 ; 14,771 ; reste 1 (GL-APUL-ODAL-IDFM) | supprimé (P06) ; gratuité des transports urbains comptée (arbitrage 2) ; 1,2 % de la fonction des revenus aux autorités de la mobilité (systeme-en-une-page § collectivités, v7.2) | reprendre par le budget commun via la part de 1,2 % de la fonction des revenus ; vérifier que cette part rend 12,244 + le coût de la gratuité (non rapproché ici) | à décider par l'auteur ; ⚠️ montant de la part de 1,2 % non rapproché de 12,244 (V17602) |
| F8 | Taxe foncière (42,940), CFE (7,708), CVAE (3,868), taxe d'habitation résiduelle (3,153), DMTO (dans 17,199) | 74,868 | remplacé:fonction_patrimoine 2, supprimé 2, à_arbitrer 1 | 0 ; 0,000 ; non isolée (dépenses par fonction ou par régime) () | taxe foncière, IFI, DMTO remplacés par la fonction du patrimoine, versée entièrement au bloc communal (26,3) ; CFE et CVAE supprimées ; départements 1,0 % et régions 0,02 % de la fonction des revenus | départements et régions : la compensation du DMTO (14,742) et de la CVAE n'est pas démontrée ; reprendre par le budget commun une dotation de péréquation ; à chiffrer avant d'écrire que la bascule est neutre pour eux | à décider par l'auteur ; ⚠️ neutralité par échelon non démontrée (V17603) |
| F9 | Taxes adossées au foncier : GEMAPI (0,532), taxes spéciales d'équipement et autres (0,724), taxe d'aménagement (dans 1,706), taxes sur les bureaux (1,055) | 4,017 | à_arbitrer 4 | 0 ; 0,000 ; aucune ligne () | recettes « conservées dans P11 sans assiette ni taxe de substitution » (recettes.csv) : les établissements publics fonciers, les syndicats de rivières, la Société des grands projets en dépendent | reprendre par le budget commun la GEMAPI (compétence du bloc communal : l'ajouter à sa part) ; fusionner les établissements publics fonciers dans une agence unique de maîtrise d'ouvrage immobilière (pré-classement existant) ; la Société des grands projets : à décider | à décider par l'auteur ; ⚠️ part de chaque taxe par organisme non identifiée dans nos fichiers (V17604) |
| F10 | Taxes pour organismes consulaires (1,271) : chambres de commerce et d'industrie, des métiers, d'agriculture | 1,271 | reste 1 | 0 ; 0,000 ; aucune ligne () | taxe classée D29 et laissée 'reste' dans le grand livre : aucune décision de l'auteur ; la suppression des « impôts de production » (P06) n'en cite pas ; les chambres n'ont aucune ligne de dépense propre : elles sont dans le résidu ODAL de apul.csv (GL-APUL-ODAL-RESIDU, 8,278 Md€, « caisses des écoles, chambres consulaires, offices de tourisme… ») | décision à prendre : (a) reprendre par le budget commun ce qui finance des missions de service public (registres, apprentissage, formalités) et laisser le reste à l'adhésion volontaire ; ou (b) maintenir la taxe affectée comme exception ; je recommande (a) | à décider par l'auteur |
| F11 | Cotisations sociales effectives (432,389) : caisses, URSSAF, MSA, régimes spéciaux, retraites complémentaires, assurance chômage | 432,389 | remplacé:fonction_revenus 1 | 1 ; 10,020 ; reste 1 (GL-ASSO-REG-D1) | remplacées par la fonction des revenus (recette) ; « plus d'URSSAF » (arbitrage 44) ; regroupements pré-classés dans instances.csv (régime général, régime unique de retraite) | pas de fantôme de financement ; mais les 10,02 Md€ de rémunérations des organismes de sécurité sociale (GL-ASSO-REG-D1) restent 'reste' alors que l'URSSAF disparaît : à rapprocher de l'économie de gestion annoncée | à décider par l'auteur ; ⚠️ économie de gestion non chiffrée par ligne (V17605) |
| F12 | Taxe de solidarité additionnelle sur les complémentaires santé (6,170) et taxes sur conventions d'assurance (11,288) | 17,458 | reste 2 | 0 ; 0,000 ; non isolée (dépenses par fonction ou par régime) () | laissées 'reste' ; or la complémentaire d'entreprise obligatoire est supprimée (arbitrage 49) : l'assiette diminue | recalculer l'assiette après l'arbitrage 49 ; pas d'organisme fantôme, mais une recette à revoir | à vérifier ; ⚠️ (V17606) |

**Trou déjà nommé au bilan** : les contributions assises sur la masse salariale (F1 à F5 : formation 11,426 ; forfait social 6,300 ; FNAL 2,935 ; CSA 2,468 ; AGS 1,538 ; PEEC 1,504 ; stock-options 1,033, total 27,204 Md€) sont fondues dans la fonction des revenus sans recalibrage (arbitrage 47, ligne C10) ; **leurs usages doivent donc être repris par le budget commun, soit 27,204 Md€ par an dans le grand livre**, dont 18,4 déjà dans la base R de la fonction (bilan, § C10).

**Impôts de production supprimés** (F6 et F7 : 17,315 + 12,244 + 7,708 + 5,228 + 3,868 = 46,363 Md€, ligne P06) : la perte de recette est dans le solde ; il reste à vérifier que chaque bénéficiaire (Sécurité sociale, autorités de la mobilité, bloc communal, départements) a bien une part dans la fonction des revenus ou celle du patrimoine.

### Opérateurs de l'État financés par une fiscalité affectée (jaune, budget initial 2024)

Aucun de ces opérateurs ne peut être déclaré fantôme sans connaître la taxe qui les finance : nos fichiers ne donnent que le montant (`fiscalite_affectee_eur`), pas l'identité de l'impôt. Si l'impôt est supprimé ou fondu (liste F1 à F9), l'opérateur perd ce financement ; sinon il le garde. **À identifier ligne à ligne** (V17604).

| Opérateur | Charges (M€) | Fiscalité affectée (M€) | Part | Subvention de l'État (M€) |
|---|---|---|---|---|
| France Compétences | 15 181 | 11 488 | 76 % | 2 362 |
| AFITF - Agence de financement des infrastructures de transport de Fran | 4 614 | 4 124 | 89 % | 0 |
| Agences de l'eau | 2 652 | 2 242 | 85 % | 0 |
| SGP - Société des Grands Projets | 1 848 | 883 | 48 % | 1 |
| CNC - Centre national du cinéma et de l'image animée | 821 | 759 | 92 % | 0 |
| CGLLS - Caisse de garantie du logement locatif social | 447 | 400 | 90 % | 0 |
| ANTS - Agence nationale des titres sécurisés | 353 | 289 | 82 % | 26 |
| ANS - Agence nationale du sport | 491 | 159 | 32 % | 130 |
| ANDRA - Agence nationale pour la gestion des déchets radioactifs | 308 | 133 | 43 % | 3 |
| Universités et assimilés | 17 521 | 109 | 1 % | 12 625 |
| FNAP - Fonds national des aides à la pierre | 380 | 75 | 20 % | 0 |
| IRSN - Institut de radioprotection et de sûreté nucléaire | 326 | 61 | 19 % | 182 |
| ENIM - Etablissement national des invalides de la marine | 1 541 | 42 | 3 % | 918 |
| CELRL - Conservatoire de l'espace littoral et des rivages lacustres | 41 | 40 | 97 % | 7 |
| CNM - Centre national de la musique | 145 | 34 | 23 % | 28 |
| ANSéS - Agence nationale de sécurité sanitaire, de l'alimentation, de  | 175 | 25 | 14 % | 139 |
| Réseau des œuvres universitaires et scolaires | 1 536 | 22 | 1 % | 490 |
| ANCOLS - Agence nationale de contrôle du logement social | 19 | 18 | 93 % | 0 |
| CNPF - Centre national de la propriété forestière | 39 | 10 | 26 % | 19 |
| AGRASC - Agence de gestion et de recouvrement des avoirs saisis et con | 25 | 10 | 40 % | 11 |
| OFB - Office français de la biodiversité | 621 | 9 | 1 % | 555 |
| INAO - Institut national de l'origine et de la qualité | 26 | 7 | 26 % | 18 |

Parmi eux, les rapprochements de nom avec des flux de la liste F : France Compétences (F1) ; Société des grands projets (taxes sur les bureaux et taxes spéciales d'équipement, F9, à vérifier) ; CGLLS, ANCOLS, FNAP (cotisations de bailleurs sociaux : à rapprocher de la fonction du patrimoine, non traité). Les autres taxes affectées (TICPE, redevances des agences de l'eau, taxe sur les billets de cinéma, droits de timbre) n'ont pas de décision dans nos fichiers : le grand livre les laisse « reste ».

## 5. (c) Flux du grand livre sans organisme rattaché

Lignes dont l'entité est générique (« autres… », « par différence », « écart », « résidu », « ODAL non couverts », « organismes divers d'administration locale ») : la dépense ou la recette existe, aucun organisme nommé n'en répond. Les lignes de contrôle (totaux ODAL) sont exclues pour éviter le double compte. Les recettes à bénéficiaires multiples (TVA, CSG) ne sont pas comptées ici : elles vont à plusieurs bénéficiaires nommés dans leur note.

| Fichier | Lignes | Md€ (valeur absolue) | dont sort « reste » | dont « à_arbitrer » |
|---|---|---|---|---|
| etat.csv | 7 | 33,134 | 1 | 6 |
| odac.csv | 4 | 14,978 | 3 | 1 |
| apul.csv | 18 | 59,702 | 18 | 0 |
| asso.csv | 110 | 26,238 | 107 | 1 |

Les plus gros :

| Fichier | Id | Entité | Libellé | Md€ | Sort |
|---|---|---|---|---|---|
| etat.csv | GL-ETAT-ECART-INTERV | Écart de bouclage | Écart non expliqué : Interventions (D62, D632, D3, D29, D71-D75, D73, D9p) et cr | 20,282 | à_arbitrer |
| apul.csv | GL-APUL-SEC-ODAL-D1 | Organismes divers d'administration locale (ODAL) | Insee S13132 : Rémunération des salariés (D1) | 13,836 | reste |
| asso.csv | GL-ASSO-HOP-D1-AUTRES | Hôpitaux publics et autres ODASS (S13142) | Rémunérations des autres personnels des ODASS (budgets annexes des hôpitaux, ESP | 10,563 | reste |
| apul.csv | GL-APUL-SEC-ODAL-P2 | Organismes divers d'administration locale (ODAL) | Insee S13132 : Consommation intermédiaire (P2) | 10,271 | reste |
| odac.csv | GL-ODAC-099 | Autres ODAC (par différence) | Tout ce qui n'est pas dans les lignes nommées : entités ODAC hors jaune (Action  | 9,253 | reste |
| apul.csv | GL-APUL-ODAL-RESIDU | ODAL non couverts | ODAL non chargés (caisses des écoles, chambres consulaires, offices de tourisme  | 8,278 | reste |
| apul.csv | GL-APUL-SEC-ODAL-P51g | Organismes divers d'administration locale (ODAL) | Insee S13132 : Formation brute de capital fixe (P51g) | 7,440 | reste |
| apul.csv | GL-APUL-SEC-ODAL-D3 | Organismes divers d'administration locale (ODAL) | Insee S13132 : Subventions (D3) | 6,668 | reste |
| apul.csv | GL-APUL-SEC-ODAL-D9p | Organismes divers d'administration locale (ODAL) | Insee S13132 : Transferts en capital à payer (D9p hors D995p) | 4,503 | reste |
| etat.csv | GL-ETAT-ECART-D41 | Écart de bouclage | Écart non expliqué : D41 intérêts (Insee 45.768 − lignes 50.102) | -4,334 | à_arbitrer |
| odac.csv | GL-REC-ODAC-003 | Autres opérateurs ODAC | Autres taxes affectées des opérateurs ODAC du jaune PLF 2025 (budget initial 202 | 4,041 | à_arbitrer |
| apul.csv | GL-APUL-ODAL-EPLX | Autres établissements publics locaux non marchands | Autres établissements publics locaux non marchands (EPA, EPCC, GIP hors MDPH, EP | 3,204 | reste |
| etat.csv | GL-ETAT-CRED-IS-AUTRES | Crédits d'impôt (impôt sur les sociétés) | Autres crédits d'impôt sur les sociétés enregistrés en dépense (hors CIR) | 2,739 | reste |
| etat.csv | GL-ETAT-ECART-D1 | Écart de bouclage | Écart non expliqué : D1 rémunérations (Insee 151.598 − lignes 154.119) | -2,520 | à_arbitrer |

Lignes de `odac.csv` qu'aucune instance de `instances.csv` ne porte : 3 (GL-REC-ODAC-001 France compétences 11,360 Md€ à_arbitrer ; GL-REC-ODAC-002 AFITF 2,100 Md€ reste ; GL-REC-ODAC-003 Autres opérateurs ODAC 4,041 Md€ à_arbitrer). Ce sont des lignes de recette de l'ODAC (France compétences, AFITF, autres opérateurs) : pas des organismes oubliés, mais **4,041 Md€ d'« autres opérateurs ODAC » sans identité** (recette à_arbitrer).

Autres constats :

- **L'ODAL (organismes divers d'administration locale, S13132) pèse 47,853 Md€, presque entièrement sans organisme nommé** : 15 lignes par nature SEC, quelques ensembles nommés (Île-de-France Mobilités, établissements publics locaux non marchands, MDPH) et un résidu de 8,278 Md€ (« caisses des écoles, chambres consulaires, offices de tourisme… ») ; la liste Insee des ODAL n'est pas dans la base (V17607). C'est le plus gros flux sans rattachement.
- Les lignes d'écart de l'État (interventions 20,282 Md€, D9 non isolés 25,6 Md€) et de la fermeture ODAC (9,253 Md€) portent des montants sans bénéficiaire : tant qu'ils ne sont pas ventilés, on ne peut pas dire ce qu'ils deviennent.
- `instances.csv` ne contient que 24 lignes de sécurité sociale (agrégats) contre 397 organismes actifs du régime général, 236 institutions de retraite complémentaire, 129 de la MSA et 114 régimes spéciaux dans SIRENE : leur sort (arbitrage 44, « plus d'URSSAF ») est décidé par régime, pas par caisse.

## 6. Propositions de Claude (synthèse)

| Cas | Proposition |
|---|---|
| Contributions fondues (F1 à F5) | reprendre par le budget commun (27,204 Md€) ; fusionner France compétences et OPCO dans l'organisme unique ; garder les missions CNSA et AGS comme lignes du budget |
| Impôts de production supprimés (F6, F7) | déjà dans le solde ; vérifier la part de chaque bénéficiaire |
| Taxes adossées au foncier (F9) | reprendre la GEMAPI dans la part du bloc communal ; fusionner les établissements publics fonciers ; décider pour la Société des grands projets |
| Chambres consulaires (F10) | décision à prendre ; recommandation : budget commun pour les missions de service public, adhésion volontaire pour le reste |
| Départements et régions (F8) | dotation de péréquation à chiffrer avant d'affirmer la neutralité |
| Gros trou d'instances : GIP, établissements publics nationaux non listés, catégories locales absentes d'OFGL | classer par lots (même méthode que `instances.csv`), après rapprochement avec les listes Insee des ODAL et ASSO (à télécharger) |

## 7. Ce que ce contrôle ne dit pas

- Il ne dit pas que l'argent public est entièrement recensé : il dit que le **montant** de chaque sous-secteur retombe sur l'Insee (les lignes de fermeture portent le reste) ; l'**instance** n'est pas toujours identifiée.
- Le rapprochement par nom est imparfait : faux positifs (deux entités distinctes de même nom) et faux négatifs (même entité sous deux noms) ; un faux négatif gonfle la liste des « absentes ».
- La liste des fantômes repose sur les sorts du grand livre et sur les arbitrages écrits ; elle ne vaut pas pour une décision non encore prise par l'auteur.

## Vérifications ouvertes (V17600 à V17608)

- **V17600** : la dépense du régime de garantie des salaires (AGS) n'est isolée dans aucun fichier du grand livre. Statut : à vérifier.
- **V17601** : rattachement de la C3S et de la taxe sur les salaires par branche de la Sécurité sociale (ASSO). Statut : à vérifier.
- **V17602** : montant de la part de 1,2 % de la fonction des revenus aux autorités de la mobilité, comparé à 12,244 Md€ de versement mobilité et au coût de la gratuité. Statut : à vérifier.
- **V17603** : neutralité de la bascule par échelon (départements, régions) : DMTO 14,742 et CVAE contre 1,0 % et 0,02 % de la fonction des revenus. Statut : à vérifier.
- **V17604** : identité de la taxe affectée de chaque opérateur du tableau (jaune : seul le montant est dans nos fichiers) et part de chaque taxe foncière annexe par organisme. Statut : à vérifier.
- **V17605** : économie de gestion réelle de la fin des URSSAF au regard des 10,02 Md€ de rémunérations des organismes de sécurité sociale. Statut : à vérifier.
- **V17606** : assiette de la taxe de solidarité additionnelle après la suppression de la complémentaire d'entreprise obligatoire (arbitrage 49). Statut : à vérifier.
- **V17607** : listes Insee des ODAL et des ASSO absentes de la base ; à télécharger (curl sans en-têtes truqués, dans `$DONNEES/sources/grand-livre/completude/`). Statut : à faire.
- **V17608** : classement S13 des associations syndicales autorisées et des associations foncières. Statut : à vérifier.

## Sources mobilisées

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts |
|---|---|---|---|
| [Insee, SIRENE](https://www.data.gouv.fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret), stock du 01/10/2026, table `sirene` | personnes morales publiques actives par catégorie juridique, tranche d'effectifs | A | aucun connu |
| [Insee, liste des ODAC](https://www.insee.fr/fr/information/2028129) | 730 lignes d'ODAC par fonction COFOG | A | aucun connu |
| OFGL / DGCL, comptes locaux 2024 | présence des collectivités, syndicats et EPL par SIREN | A | aucun connu |
| Jaune « Opérateurs de l'État » PLF 2025 (copie CFDT-UFETAM) | charges, subvention, fiscalité affectée par opérateur | A (copie hébergée par un syndicat) | aucun pour le contenu |
| `recettes.csv`, `instances.csv`, `etat.csv`, `odac.csv`, `apul.csv`, `asso.csv`, arbitrages du 05/11/2026 et description du système (documents de travail), `sources/calculs/bilan_global.py` (lu, non modifié) | sorts, arbitrages et parts du nouveau système | A à C | décisions de l'auteur pour les arbitrages |
