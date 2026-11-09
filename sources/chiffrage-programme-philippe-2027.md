# Programme d'Édouard Philippe (Horizons) pour 2027 : ce qui est publié, et pourquoi il n'est pas chiffré dans le banc

*Dossier du 08/11/2026, écrit par Claude (IA d'Anthropic) ; conflit d'intérêts : l'auteur du manifeste est partie prenante (candidat potentiel). Ordres de grandeur sous hypothèses, jamais des prédictions. Lecture limitée aux pages citées au § 5 ; la page officielle du candidat n'a pas été lue directement (V32101).*

## 0. Résultat en dix lignes
1. **Aucun document chiffré d'ensemble n'est publié à notre connaissance** au 08/11/2026 : ni liste de mesures avec montants, ni calendrier, ni contre-budget complet. Un agrégateur tiers relève une seule mesure avec un montant en euros et note que les neuf autres n'ont « ni chiffrage consolidé ni coût net établi ».
2. **Le banc n'a donc pas de colonne Philippe** : on ne peut pas chiffrer avec la même méthode un programme dont les montants ne sont pas publiés sans les inventer. Les annonces sont listées au § 1 avec ce qu'elles permettent de dire.
3. Seuls chiffres publics : un « pacte fiscal » de 50 Md€ de baisses d'impôts de production contre 50 Md€ de réduction d'aides (effet net nul sur le solde par construction, calendrier non précisé), une cible de déficit de 2 % du PIB à la fin du quinquennat, un « budget alternatif » de 10 Md€ d'économies supplémentaires pour 2027, un non-remplacement d'un fonctionnaire sur trois (environ 250 000 postes sur cinq ans), un âge légal de 65 ans et 45 annuités en moins de dix ans.
4. **Illustration (pas un chiffrage du programme)** : atteindre un déficit de 2 % du PIB en 2032 supposerait environ 145 Md€ par an d'effort par rapport au droit actuel (calcul du banc, § 3) ; les mesures annoncées au § 1 n'en couvrent qu'une fraction que les documents ne permettent pas de mesurer.
5. À refaire quand un document chiffré paraît : créer `programmes/philippe/mesures.py` sur le modèle de `programmes/rn/mesures.py` et l'ajouter à la liste de `relancer.py`.

## 1. Ce que Philippe et Horizons ont annoncé
| Thème | Annonce | Chiffre public | Date et source | Cote |
|---|---|---|---|---|
| Retraites | reprise de la réforme de 2023 (64 ans, 43 annuités), puis 65 ans et 45 annuités « en moins de 10 ans » ; un tiers des salariés exemptés ; capitalisation « mixte » (plan d'épargne-retraite pour chaque Français, 10 à 15 % des pensions d'ici quinze ans selon l'agrégateur) | aucun coût net ; Horizons évalue à environ 1 Md€ en 2027 le retour sur la suspension de 2023 | Public Sénat, 29/09/2026 ; Euronews, 09/10/2026 ; Moneyvox, 13/10/2026 | C |
| Dépenses de l'État et sociales | non-remplacement d'un fonctionnaire sur trois partant (environ 250 000 postes sur cinq ans) ; moitié de l'effort sur les dépenses sociales ; baisse de 3 % par an des dépenses des caisses de Sécurité sociale (budget alternatif) ; deux jours de carence pour les arrêts maladie dans la fonction publique | « 10 Md€ d'économies supplémentaires » en 2027, pour annuler 10 Md€ de hausses d'impôts prévues | Moneyvox, 13/10/2026 (Laurent Marcangeli, interview au *Figaro*) | C |
| Chômage | durée maximale d'indemnisation ramenée de 18 à 12 mois pour les moins de 50 ans | aucun | Euronews, 09/10/2026 | C |
| Fiscalité des entreprises | pacte fiscal : baisse des impôts de production contre réduction des aides | 50 Md€ contre 50 Md€ | dettedelafrance.fr (agrégateur ; pages du site de campagne consultées le 09/10/2026) | C à D |
| Pouvoir d'achat, familles | exonération de cotisations sociales sur deux heures supplémentaires par semaine (environ 1 000 € par an au Smic) ; allocation familiale unique de 350 € par mois dès le premier enfant, dégressive selon l'impôt ; réduction d'impôt d'environ 3 000 € pour les familles actives ; part fiscale au deuxième enfant ; prêt à taux zéro à l'arrivée d'un enfant | aucun coût publié | Euronews, 09/10/2026 | C |
| Déficit | règle d'or ; cible de 2 % du PIB en fin de quinquennat | aucune trajectoire annuelle ; objectif de 5 % en 2027 partagé avec le gouvernement | dettedelafrance.fr ; Moneyvox | C à D |
| Climat | fonds unique d'adaptation de 2 Md€ par an (annonce de la mi-septembre) ; doublement du Fonds vert (agrégateur) | 2 Md€ par an | Euronews, 09/10/2026 | C |
| Immigration | division par deux de l'immigration légale (« largement inférieur à 200 000 » titres par an) | aucun | Euronews, 09/10/2026 | C |
| Méthode | une vingtaine d'ordonnances lors d'une session extraordinaire du Parlement en juillet 2027, entrée en vigueur « dès l'automne » | | Euronews, 09/10/2026 | C |

## 2. Pourquoi ce n'est pas chiffré dans le banc
Le banc chiffre un programme à partir de ses montants publiés et de nos modèles. Ici, quatre obstacles : (a) la plupart des mesures n'ont aucun montant publié ; (b) la seule mesure chiffrée (50 contre 50) est neutre par construction sur le solde, et son effet réel dépend de l'incidence sur l'activité, qui n'est pas publiée ; (c) la cible de 2 % est un résultat, pas une mesure ; (d) les mesures de dépense nouvelle (allocation unique de 350 €, réduction d'impôt familiale, heures supplémentaires) sont publiées sans population ni coût. Inventer les paramètres ferait de notre colonne un programme qui n'est pas le leur. Les deux mesures pour lesquelles un ordre de grandeur est calculable à partir de données publiques sont au § 3.

## 3. Ordres de grandeur calculables (estimations de Claude, hors tirage)
1. **Non-remplacement de 250 000 postes** : masse salariale publique de 370 Md€ pour 5 876 700 agents (paramètres du modèle `variante_dette_stable.js`, HYP.masse) soit environ 63 000 € par agent ; 250 000 × 63 000 € ≈ **15,7 Md€ par an en régime**, avant coûts de transition, sans effet sur les services ni sur les rémunérations des autres agents (⚠️ ordre de grandeur brut ; le chiffre dépend du profil des postes supprimés).
2. **Cible de 2 % du PIB** : le banc fait la chaîne dette (même récursion que pour les autres programmes). Pour que le déficit public, intérêts compris, atteigne 2,0 % du PIB en 2032 depuis 5,65 % (169,1 Md€) au droit actuel, avec une montée linéaire de 2028 à 2032, il faut un effort statique d'environ **145 Md€ par an** par rapport au droit actuel ; la dette serait alors de 121 % du PIB en 2032, 113 % en 2038 et 93 % en 2058 (macro de référence : croissance nominale 3 %, taux de marché 3,45 %). Une cible de 3 % exigerait environ 80 Md€ de l'effort statique avant coût des intérêts (dette 2038 : 133 %). **Ce n'est pas le chiffrage du programme** : c'est ce que la cible, si elle était tenue, supposerait.
3. Pour comparaison, avec la même méthode : RN, −32 Md€ de solde en régime (aggravation) ; LFI, −247 Md€ ; notre système, +115 Md€ en 2038 (`modeles/banc-programmes/resultats.md` § 1).

## 4. Carte des convergences et des divergences avec notre manifeste
Catégories : (1) accord ; (2) rapprochement ; (3) même fond, méthode différente ; (4) divergence nette ou absence de position équivalente (l'absence d'une mesure n'est pas une opposition). Lecture limitée aux pages du § 5.

| Thème | Sujet | Cat. | Horizons | Manifeste | Réf. |
|---|---|---|---|---|---|
| Fiscalité | Impôts de production | 3 | baisse contre réduction d'aides (50 Md€ contre 50 Md€) | une partie des impôts de production disparaît dans la bascule des collectivités (neutre) ; IS conservé ; refonte des aides | ch. 3, 13 |
| Fiscalité | Simplification | 4 | pas de refonte d'ensemble lue | trois règles remplacent 269 prélèvements | intro, ch. 2 |
| Retraites | Âge et durée | 4 | 64 puis 65 ans, 43 puis 45 annuités, exemption d'un tiers des salariés | départ libre dès 60 ans avec pension ajustée ; âge de référence lié à l'espérance de vie | ch. 5 |
| Retraites | Capitalisation | 4 | épargne-retraite pour chacun, système mixte | pas de capitalisation : elle demande de payer deux fois pendant une génération | ch. 5 |
| Retraites | Gestion | 3 | partenaires sociaux sous « règle d'or d'équilibre » | règle de dette stable et clause de votation | ch. 5, 12 |
| Dépenses | Effectifs publics | 3 | non-remplacement d'un sur trois (250 000 postes) | non-remplacement chiffré dans les économies de gestion ; regroupement sans perte d'agent | ch. 7, 12 |
| Dépenses | Sécurité sociale | 4 | −3 % par an des dépenses des caisses | Sécurité sociale à 100 % du socle de soins ; économies par regroupement de la gestion | ch. 4, 10 |
| Dépenses | Congés maladie | 4 | deux jours de carence dans le public | garantie de transition (revenu dès le premier jour, ouvert à tous) | ch. 4 |
| Dépenses | Chômage | 4 | 18 mois ramenés à 12 mois pour les moins de 50 ans | garantie de transition : 100 % du revenu au premier jour, baisse en douze mois | ch. 4 |
| Famille | Allocations | 3 | allocation unique de 350 € dès le premier enfant, dégressive | 200 € par mois par enfant (+250 € parent seul), universel | ch. 4 |
| Famille | Part fiscale | 4 | part au deuxième enfant | le quotient familial disparaît pour l'essentiel | ch. 4 |
| Travail | Heures supplémentaires | 4 | exonération de cotisations (2 h par semaine) | pas de mesure équivalente lue ; statut unique de l'actif | ch. 4 |
| Climat | Fonds | 3 | fonds d'adaptation de 2 Md€ par an, doublement du Fonds vert | prix calibré sur le dommage plutôt qu'interdiction ; recette partagée | ch. 2, 11 |
| Budget | Règle budgétaire | 2 | règle d'or, cible de 2 % | règle de dette stable avec clause de sauvegarde ; déficit au-dessus de 3 % jusqu'en 2043, dit sans détour | ch. 12, 13 |
| Méthode | Décision | 4 | une vingtaine d'ordonnances en juillet 2027 | on vote d'abord la méthode ; lois votées par les citoyens quatre fois par an | intro, ch. 8 |

Bilan (15 lignes) : accord 0 ; rapprochement 1 ; même fond, méthode différente 5 ; divergence nette ou absence 9. **Convergences réelles à nommer** : le diagnostic de départ (dette, déficit, intérêts) ; l'idée d'une règle d'équilibre ; la réduction du nombre de postes par non-remplacement (nous la chiffrons à part dans les économies de gestion) ; l'allègement des impôts de production.

## 5. Steelman
**Les meilleurs arguments en faveur du programme** (comme ses partisans les formulent).
1. *La trajectoire annoncée est la plus ambitieuse sur le déficit* : 2 % du PIB en fin de quinquennat est une cible plus basse que celle des autres programmes lus ; elle répond à la charge d'intérêts, qui croît avec la dette.
2. *Travailler plus longtemps est la voie la plus documentée pour équilibrer les retraites sans hausse de cotisations*, et la reprise de la réforme de 2023 s'appuie sur un texte déjà voté.
3. *Il vaut mieux baisser les impôts de production et réduire les aides que l'inverse* : la baisse des impôts de production est défendue de longue date par les économistes de l'offre, et le tri des aides aux entreprises est demandé par la Cour des comptes (non relue ici, ⚠️).
4. *Le non-remplacement des départs est une voie sans licenciement* : elle suppose seulement de fixer le rythme (ce que le manifeste propose aussi, à une échelle plus faible).
5. *La concertation avec les partenaires sociaux est annoncée* avant les ordonnances ; c'est une méthode, même si elle diffère de la nôtre.

**Ce qui peut être retourné contre nous.**
1. *Notre déficit reste au-dessus de 3 % jusqu'en 2043, alors qu'ils annoncent 2 % en cinq ans* ; la comparaison des annonces est celle que les électeurs verront.
2. *Nous ne proposons pas de réforme des retraites au sens paramétrique* : notre départ libre dès 60 ans a un coût que notre banc chiffre à part ; une cible à 2 % exigerait un effort que nous ne demandons pas.
3. *Notre taux de prélèvements de 52,2 % contre un projet qui promet de limiter les hausses d'impôts* ; notre explication est comptable (écriture brute des versements), mais l'affichage brut est plus simple.
4. *Nous n'avons pas de mesure sur l'immigration chiffrée*, alors qu'ils fixent un plafond.

## 6. Sources mobilisées, cotes et conflits d'intérêts
| Source | Ce qu'elle établit | Cote | Conflit d'intérêts / orientation |
|---|---|---|---|
| [Euronews, 09/10/2026](https://fr.euronews.com/2026/10/09/presidentielle-2027-edouard-philippe-mise-sur-le-travail-et-la-reduction-des-depenses-publ) | retraites 65 ans et 45 annuités, 250 000 postes, indemnisation 12 mois, heures supplémentaires, allocation de 350 €, ordonnances de juillet 2027 | C | presse ; consultée le 08/11/2026 par résumé automatique de page |
| [Public Sénat, 29/09/2026](https://www.publicsenat.fr/actualites/politique/retraites-edouard-philippe-sort-du-bois-et-propose-un-age-de-depart-a-65-ans) | reprise de la réforme (64 ans, 43 annuités), cible 65 ans et 45 annuités, capitalisation, départs anticipés pour un tiers | C | presse du Sénat ; consultée le 08/11/2026 |
| [Moneyvox, 13/10/2026](https://www.moneyvox.fr/actu/110762/budget-2027-horizons-propose-un-budget-alternatif-avec-10-milliards-economies-supplementaires) | budget alternatif de 10 Md€ d'économies, mesures listées | C | presse financière grand public ; reprend une interview du *Figaro* de Laurent Marcangeli (Horizons) |
| [dettedelafrance.fr, page Horizons](https://dettedelafrance.fr/presidentielle-2027/horizons) | dix mesures, dont une seule avec un montant (50 Md€) ; cible de 2 % | C à D | outil tiers ; ne reflète pas un programme validé ; pages de campagne lues par ses auteurs le 09/10/2026 |
| Banc d'essai du dépôt (`modeles/banc-programmes/`) | chaîne dette, cible de 2 % (illustration) | B | écrit par une IA ; conflit d'intérêts déclaré |
