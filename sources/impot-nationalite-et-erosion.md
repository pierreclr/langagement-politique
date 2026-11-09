---
titre: Impôt lié à la nationalité, taxe de sortie et érosion « impôt bien conçu » — droit, chiffrage, variante de la fonction du patrimoine v7.5
date: 2026-11-06
statut: brouillon chiffré, VARIANTE NON ADOPTÉE ; hypothèses HN1 à HN14 ; vérifications V18300 à V18329
---

# Imposer selon la nationalité : ce que le droit permet, ce que ça rapporte, et ce que ça change à l'érosion

Transparence : texte et code écrits par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026. Demande de l'auteur du même jour : s'inspirer des États-Unis (imposition des nationaux où qu'ils vivent, par un impôt différentiel ; taxe de sortie à la renonciation, avec remboursement d'aides publiques reçues ; échange automatique d'informations bancaires) et dire comment surmonter les quelque 125 conventions fiscales. Code : `modeles/systeme-ideal/variante_nationalite_0611.js` (fonctions pures ; ne modifie aucun module ; `bilan_global.py` non touché), tests `test_variante_nationalite_0611.js` (25 vérifications), résultats `resultats_variante_nationalite_0611.txt`, qui font foi, produits par `rapport_variante_nationalite_0611.js`. Conventions : euros 2024-2026, Md€/an en croisière. Nature de chaque chiffre : **[fait]** sourcé (cote A à D), **[calcul]** reproductible, **[estimation]** sous hypothèses, **[opinion]** de Claude.

## 0. L'essentiel

1. **Le modèle existe, mais il est presque unique.** Les États-Unis imposent leurs citoyens partout depuis 1913. Ils évitent la double imposition par un crédit d'impôt étranger, une exclusion des revenus du travail, une clause de sauvegarde inscrite dans chacune de leurs conventions, FATCA (avec une retenue de 30 % comme menace) et une taxe de sortie pour les « covered expatriates » (patrimoine ≥ 2 M$ ou impôt moyen > 206 000 $ en 2025). Environ **4 700 personnes** ont renoncé à la nationalité ou au statut de résident de longue durée en 2025 [calcul sur les listes du Federal Register, B].
2. **La France a déjà un précédent dans son propre droit** : depuis la convention franco-monégasque de 1963, les Français installés à Monaco restent imposés en France comme s'ils y vivaient [fait, A]. L'Allemagne (10 ans après le départ vers un pays à faible fiscalité, § 2 AStG) et l'Espagne (l'année du départ vers un paradis fiscal et les 4 suivantes, art. 8.2 LIRPF) ont des « impôts de suite » limités dans le temps [fait, C, à vérifier].
3. **Ce qu'on peut faire seul, dès la première loi de finances** :
   - un impôt différentiel **de suite**, limité aux anciens résidents (au moins 6 ans de résidence sur 10, comme l'art. 167 bis), aux hauts revenus et aux hauts patrimoines, pendant 10 à 15 ans après le départ ;
   - une taxe de sortie élargie (fin du dégrèvement automatique au bout de 2 ou 5 ans) ;
   - une condition de quitus fiscal à la libération des liens d'allégeance (Code civil, art. 23-4 : la perte demandée de la nationalité passe déjà par un décret) ;
   - des clauses de remboursement dans les **futures** aides publiques.
   
   Mais **l'impôt différentiel ne s'applique que là où aucune convention ne l'interdit** : en pratique, les pays sans convention (dont plusieurs pays du Golfe) et Monaco.
4. **Ce qui demande des années** : la clause de sauvegarde dans les quelque **120 à 125 conventions** [fait, B]. Deux voies existent. **Renégocier**, une convention après l'autre, ou par un instrument multilatéral sur le modèle de l'instrument BEPS de 2016. **Dénoncer**, avec un préavis de 6 mois environ et un effet au 1er janvier suivant : précédent de la convention franco-suisse sur les successions, dénoncée le 17/06/2014 et sans effet depuis le 01/01/2015 [fait, A]. Il faut viser d'abord les destinations des départs : Suisse (19 % des partants IFI), Belgique, Royaume-Uni, États-Unis, Portugal, Italie, Israël.
5. **Ce qui demande l'Union européenne** :
   - l'échange automatique fondé sur la **nationalité** (la directive 2011/16/UE et la norme commune de l'OCDE reposent sur la **résidence** : la France ne reçoit rien sur les comptes de ses nationaux non résidents), avec modification à l'unanimité ;
   - la compatibilité avec la libre circulation pour les Français partis dans un autre État membre (jurisprudences de *Lasteyrie du Saillant* 2004, *N* 2006 et *National Grid Indus* 2011 : sursis jusqu'à la réalisation, pas d'imposition immédiate). Un impôt différentiel sur les seuls Français installés dans l'UE serait **très probablement contesté** et n'a jamais été jugé [opinion].
6. **Recette de l'impôt différentiel sur les Français déjà partis** : **0,07 / 0,80 / 3,6 Md€/an** (bas / central / haut), nette d'un coût de gestion de 0,04 à 0,08 Md€ [estimation]. L'incertitude est forte : on ne connaît ni le nombre ni le patrimoine des Français riches établis à l'étranger. Repère : 7 480 redevables de l'ISF ou de l'IFI sont partis entre 2011 et 2021, pour ≈ 4 100 retours.
7. **Son effet principal est ailleurs : il freine l'érosion de la fonction du patrimoine.** Seul (départs neutralisés à 60 %), il ajoute **+2,4 Md€** à la v7.5, et jusqu'à **+9,3 Md€** avec le meilleur réglage (t∞ = 4,5 %, K = 700 k€). Avec le stock déjà parti, on obtient ≈ +3,2 Md€ à réglage inchangé [calcul].
8. **Variante « impôt bien conçu »**, avec une érosion à 1 point du 1 % le mieux doté de **17 / 12 / 7 %** (fourchette d'Advani et Tarrant), au lieu de 40 % :
   - avec la v7.5 inchangée : **+5,1 / +6,4 / +7,6 Md€** ;
   - avec le meilleur plafond : **+15,1 / +18,0 / +21,8 Md€** (t∞ = 5 % et K = 800 k€ au central ; t∞ = 5,5 % au haut), soit **29 / 35 / 42 % des 52,1 Md€** du manque [calcul].
   
   **Même dans le cas le plus optimiste, la fonction du patrimoine ne comble pas le manque à elle seule.**
9. **C'est une hypothèse optimiste, à dire sans détour.** Pour atterrir sur 12 %, il faut supprimer **78 %** du canal déclaratif **et** 78 % du canal des départs ; pour 7 %, 92 % des deux. La fourchette d'Advani et Tarrant porte sur l'**ensemble** de l'assiette d'un impôt bien conçu, pas sur le capital mobile du 1 % le plus riche, qui est plus élastique (Danemark : 25 % par point pour le top 1 %, contre 17 % pour les 98e-99e centiles). Aucun pays n'a réuni tous les leviers.
10. **Cas limites au-delà de 100 % du revenu** : ils ne dépendent pas de l'érosion et s'aggravent avec le plafond. Il y en a 6 sur 25 avec la v7.5 et 9 sur 25 à t∞ = 5 % : rentier en actions à 5 M€ (144 %), rentier à 2 M€ (119 %), château en holding (362 %), cryptoactifs (241 %), parent avant donation (128 % payé). **Plus la variante est « bien conçue », plus la tentation de monter le taux est forte, et plus ces cas deviennent la règle au sommet.** Le choix revient à l'auteur.

## 1. Droit et faisabilité

### 1.1 Le modèle américain [fait, A ou B sauf mention]

| élément | règle | ce qu'il faut retenir pour la France |
|---|---|---|
| Base | Les citoyens et les résidents permanents sont imposés sur leur revenu mondial (Internal Revenue Code, § 1 ; validé par la Cour suprême, *Cook v. Tait*, 265 U.S. 47, 1924 ⚠️ V18300) | Le rattachement par la nationalité est un choix politique ancien, pas une innovation technique |
| Double imposition | **Crédit d'impôt étranger** (§ 901) : l'impôt payé à l'étranger s'impute ; on paie la différence si l'impôt américain est plus élevé | C'est l'« impôt différentiel » de l'auteur |
| Revenus du travail | **Exclusion** (§ 911) d'environ 130 000 $ de revenus du travail étrangers en 2025 ⚠️ V18301 | Elle épargne la masse des expatriés ordinaires : c'est l'équivalent d'un seuil |
| Conventions | **Clause de sauvegarde** (« saving clause », modèle américain de convention, art. 1 § 4) : les États-Unis se réservent le droit d'imposer leurs citoyens comme si la convention n'existait pas, sauf exceptions listées ⚠️ V18302 | C'est **cette clause** qui manque aux conventions françaises |
| Information | **FATCA** (Hiring Incentives to Restore Employment Act, 2010 ; IRC § 1471-1474) : les banques étrangères déclarent les comptes des « US persons » (indices : citoyenneté, lieu de naissance), sinon **retenue de 30 %** sur leurs revenus de source américaine ; accords intergouvernementaux (accord France-États-Unis signé en 2013 ⚠️ V18303) | Le levier américain est la taille de son marché financier ; la France seule n'a pas cette force, l'UE l'aurait |
| Taxe de sortie | **§ 877A** : le « covered expatriate » (patrimoine net ≥ **2 M$**, non indexé ; ou impôt moyen sur 5 ans > **206 000 $** en 2025, ≈ 211 000 $ en 2026 ⚠️ V18304 ; ou défaut de certification de conformité sur 5 ans) est réputé avoir vendu tous ses biens la veille de la renonciation ; plus-value nette exonérée jusqu'à **890 000 $** (2025) [fait, A : instructions du formulaire 8854, 2025] | Modèle de « réalisation réputée » à la renonciation |
| Renonciations | Listes trimestrielles du Federal Register (citoyens et résidents de longue durée) : 1 235 + 1 024 + 1 556 + 930 = **≈ 4 745 lignes pour 2025** (trimestres clos du 31/03/2025 au 31/12/2025 ; comptage automatique, minorant) [calcul, B] ; pour ≈ 3 à 9 millions d'Américains à l'étranger ⚠️ V18305 | Les renonciations viennent surtout de la **charge déclarative** sur des expatriés modestes (« Américains accidentels ») : un dispositif français à seuils l'éviterait |
| Autre exemple | L'Érythrée prélève 2 % du revenu de sa diaspora ; la résolution 2023 (2011) du Conseil de sécurité de l'ONU en a condamné les méthodes de recouvrement ⚠️ V18306 | Ce n'est pas un modèle |

### 1.2 Précédents plus proches de nous

- **Monaco, depuis 1963** [fait, A] : la convention fiscale franco-monégasque du 18/05/1963 (art. 7, § 1) rend imposables en France les personnes de nationalité française qui transportent leur domicile ou leur résidence à Monaco (sauf résidence habituelle de 5 ans au 13/10/1962). Le Conseil d'État a jugé que les Français nés à Monaco et qui y ont toujours vécu n'entrent pas dans le champ de cette règle (CE, 11/04/2014, n° 362237). **La France applique donc déjà un impôt lié à la nationalité, par convention, avec un État voisin.** C'est l'argument le plus fort contre l'objection « c'est impossible ».
- **Allemagne** : imposition « étendue » limitée (§ 2 de la loi sur la fiscalité extérieure, AStG) pendant **10 ans** après le départ d'un ressortissant allemand vers un pays à faible fiscalité, s'il garde des intérêts économiques essentiels en Allemagne [fait, C : manuels universitaires et éditeurs fiscaux ⚠️ V18307].
- **Espagne** : un ressortissant espagnol qui s'installe dans une juridiction non coopérative reste contribuable espagnol l'année du départ et les **4 années suivantes** (art. 8.2 de la loi sur l'impôt sur le revenu, LIRPF) [fait, C ⚠️ V18307].
- **Suède, Norvège, Finlande** : des règles de suite sur les plus-values après le départ (« règle des dix ans » suédoise ; exit tax norvégienne de 2022) ⚠️ V18307.
- **Lecture** [opinion] : le droit européen tolère des impôts **de suite limités dans le temps et ciblés** sur les pays à faible fiscalité. Un impôt **à vie** sur tous les nationaux, à l'américaine, n'a pas d'équivalent en Europe. La forme qui tient : impôt de suite de 10 à 15 ans pour les anciens résidents, au-delà de seuils, puis impôt sur les nationaux là où une convention le permet.

### 1.3 Échange automatique d'informations : fondé sur la résidence, pas sur la nationalité

- **Norme commune de déclaration de l'OCDE** (2014) et **directive 2011/16/UE** modifiée par la directive 2014/107/UE (DAC2) : les institutions financières identifient la **résidence fiscale** du titulaire du compte et la déclarent à leur administration, qui transmet à l'État de résidence [fait, A pour les textes]. Environ **116 juridictions** échangent et **171 millions de comptes** pour ≈ 13 000 Md€ ont été échangés en 2024 [fait, D : synthèse non officielle attribuée à l'OCDE ⚠️ V18308]. L'extension aux cryptoactifs est la DAC8 (directive 2023/2226).
- **Conséquence** : un Français résident en Suisse est déclaré à la Suisse, pas à la France. **La France ne reçoit aujourd'hui aucune information sur les comptes de ses nationaux non résidents.**
- **Ce qu'il faudrait changer** :
  - (a) **dans l'UE**, ajouter la nationalité aux indices de diligence et à l'État destinataire dans la DAC, ce qui suppose une directive fiscale à l'**unanimité** (TFUE, art. 115) ;
  - (b) **hors UE**, des accords bilatéraux de type FATCA, sans la menace de retenue de 30 % dont disposent les États-Unis ; une retenue européenne sur les revenus de source européenne versés aux institutions non coopératives donnerait le levier ;
  - (c) **à l'OCDE**, une option « nationalité » dans la norme commune, qui demande des années de négociation ;
  - (d) **seul, tout de suite** : obligation déclarative pour les nationaux couverts (au-dessus des seuils), sanctions dissuasives, recoupement avec les données dont dispose déjà la France (biens situés en France, sociétés françaises, successions, registre des bénéficiaires effectifs, déclarations de comptes à l'étranger quand ils étaient résidents).
- Effet mesuré de l'échange automatique : −22 % de dépôts bancaires des non-résidents dans les centres financiers (OCDE, document de travail fiscal n° 46, 2019 ; résumé lu, `sources/exil-patrimoines-preuves.md` § 4) ; mais les actifs se déplacent vers ce qui n'est pas déclaré (immobilier étranger, sociétés non cotées, art, cryptoactifs).

### 1.4 Les conventions fiscales : supérieures à la loi

- **Constitution, art. 55** : les traités régulièrement ratifiés ont une autorité supérieure à celle des lois ; le juge écarte une loi postérieure contraire (CE, Ass., 20/10/1989, *Nicolo*) [fait, A]. Une loi ne peut donc pas imposer un résident suisse **que la convention franco-suisse attribue à la Suisse**. Il n'y a pas de « treaty override » possible en droit français, contrairement aux États-Unis, où une loi postérieure peut l'emporter sur un traité.
- **Nombre** : 120 conventions en vigueur selon la réponse de la France à l'examen par les pairs de l'OCDE (2024), 124 selon une source de 2026 citant le ministère des Affaires étrangères, « plus de 125 pays et territoires » selon d'autres [fait, B/C ⚠️ V18309 ; V14811].
- **Ce que disent les conventions** : sur le modèle de l'OCDE, la résidence (art. 4) décide qui impose les revenus (art. 6 à 21) et la fortune (art. 22) ; la nationalité n'intervient qu'en dernier critère pour départager un double résident. Sauf clause de sauvegarde, la France ne peut pas imposer un national résident dans l'autre État au-delà de ce que la convention lui laisse (revenus de source française, immeubles situés en France).
- **Voie 1 : renégocier.** Il faut ajouter une clause de sauvegarde « nationaux » (sur le modèle américain, limitée aux anciens résidents et au-delà de seuils), avec crédit d'impôt pour l'impôt payé dans l'État de résidence. **Délai** : une renégociation bilatérale prend en général plusieurs années entre l'ouverture et l'entrée en vigueur (signature, ratification par les deux parlements) [opinion, ⚠️ V18310]. **Accélérateur** : un **instrument multilatéral** sur le modèle de la convention BEPS de 2016 (ratifiée par la France en 2018), qui modifie d'un coup toutes les conventions des États signataires ; son art. 11 contient déjà une clause de sauvegarde, mais pour les **résidents**, pas pour les nationaux ⚠️ V18311. Il faut des partenaires prêts à signer : c'est le rôle de la version européenne du manifeste.
- **Voie 2 : dénoncer.** Une convention se dénonce par voie diplomatique, en général avec un préavis de 6 mois avant la fin d'une année civile, pour un effet au 1er janvier suivant (clause de dénonciation de chaque convention ⚠️ V18310). **Précédents** :
  - **convention franco-suisse sur les successions** du 31/12/1953 : dénoncée par la France le **17/06/2014** après le rejet par le Parlement suisse de la nouvelle convention ; sans effet pour les successions ouvertes depuis le **01/01/2015** (décret n° 2014-1270 ; BOFiP) [fait, A] ;
  - le Danemark a dénoncé ses conventions avec la France et l'Espagne en 2008, sur l'imposition des pensions ⚠️ V18312.
  
  **Coût** : sans convention, les contribuables risquent la double imposition, les entreprises perdent les taux réduits de retenue à la source, et la relation diplomatique se dégrade. La dénonciation est une **menace crédible pour ouvrir une renégociation**, pas un état durable.
- **Stratégie proposée** [opinion] :
  1. **pays sans convention et Monaco** : application immédiate ;
  2. **renégociation prioritaire** avec les destinations des départs (Suisse, Belgique, Royaume-Uni, États-Unis, Portugal, Italie, Israël, Émirats arabes unis : ces derniers ont une convention avec la France ⚠️ V18313), avec dénonciation en dernier recours ;
  3. **instrument multilatéral européen** porté par la version européenne du manifeste ;
  4. **impôt de suite** (1.2), qui ne heurte que les conventions qui attribuent l'imposition à l'État de résidence dès le premier jour ; il faut donc lui aussi une clause. La plupart des conventions françaises ne contiennent pas de clause de suite sur les plus-values (V14808).

### 1.5 Droit de l'Union européenne

- **Taxe de sortie** [fait, A] :
  - *de Lasteyrie du Saillant* (CJCE, C-9/02, 11/03/2004) : l'imposition immédiate des plus-values latentes au départ entrave la liberté d'établissement ;
  - *N* (C-470/04, 07/09/2006) : la constatation au départ est admise, avec paiement différé jusqu'à la réalisation, sans garantie disproportionnée et en tenant compte des moins-values ultérieures ;
  - *National Grid Indus* (C-371/10, 29/11/2011, pour une société) : la fixation de l'impôt au départ est justifiée par la répartition équilibrée du pouvoir d'imposer, mais le recouvrement immédiat est disproportionné ; le contribuable doit pouvoir choisir le report (avec intérêts et garanties proportionnées) ;
  - directive ATAD 2016/1164, art. 5 : taxe de sortie des sociétés, avec étalement en 5 ans dans l'UE.
- **Taxe de sortie française actuelle** (CGI, art. 167 bis, lu dans la copie locale du CGI) [fait, A] : 6 ans de domicile en France sur les 10 dernières années ; participations d'au moins 50 % des bénéfices d'une société ou titres de plus de 800 000 € ; sursis automatique vers l'UE ou un État lié par une convention d'assistance ; dégrèvement si les titres sont conservés 2 ans (5 ans au-delà de 2,57 M€). Rendement : 138 M€ encaissés en 2012-2017 pour 5,75 Md€ d'impositions théoriques (réponse ministérielle, Sénat, QE n° 05844, 27/02/2020 ; `sources/exil-patrimoines-preuves.md` § 1.2).
- **Impôt différentiel sur les nationaux installés dans un autre État membre** [opinion, ⚠️ V18314] : c'est une **entrave à la sortie** au sens des art. 21, 45, 49 et 63 du TFUE, puisqu'il retire l'avantage fiscal du départ. Il peut être défendu par la lutte contre l'évasion et la répartition équilibrée du pouvoir d'imposer s'il est **limité** (impôt de suite de durée finie, anciens résidents, seuils élevés, crédit intégral de l'impôt du pays d'accueil, pas de garantie disproportionnée). La Cour de justice n'a jamais jugé un tel dispositif. La perte de la nationalité d'un État membre entraîne celle de la citoyenneté européenne et elle est contrôlée sous l'angle de la proportionnalité (*Rottmann*, C-135/08, 2010 ; *Tjebbes*, C-221/17, 2019) : une taxe qui pèse sur la renonciation sera regardée sous cet angle ⚠️ V18315. **Sans accord européen, il faut s'attendre à un contentieux long sur le volet UE** ; le volet hors UE ne pose pas ce problème, à part la libre circulation des capitaux, qui vaut aussi envers les pays tiers (art. 63).

### 1.6 Constitution

- **Égalité devant l'impôt et les charges publiques** (DDHC, art. 6 et 13) : une différence de traitement doit reposer sur des critères objectifs et rationnels en rapport avec le but poursuivi, et tenir compte des facultés contributives [fait, A pour le principe]. La nationalité comme critère d'imposition d'un non-résident n'a jamais été jugée par le Conseil constitutionnel ⚠️ V18316. Arguments pour : le but (lutter contre l'exil fiscal) et le lien (ancien résident qui a profité des services publics, bénéficie de la protection consulaire et garde le droit de vote). Argument contre : le non-résident ne bénéficie plus de la plupart des dépenses financées. **Un impôt de suite limité dans le temps, sous seuils, et crédité de l'impôt étranger** a de bonnes chances [opinion] ; un impôt à vie sur tous les nationaux en a moins.
- **Taux confiscatoire** : le Conseil a censuré des cumuls excessifs (décision 2012-662 DC, ⚠️ V14810). Le cumul impôt étranger + différentiel ne dépasse jamais l'impôt français d'un résident : l'impôt différentiel ne crée pas en lui-même d'effet confiscatoire, mais il **hérite** des cas limites de la fonction du patrimoine (§ 3.4).

### 1.7 Renoncer à la nationalité : le Code civil, la taxe de sortie, les aides publiques

- **Droit actuel** (Code civil, copie locale, lu le 06/11/2026) [fait, A] :
  - art. 23 et 23-1 : le Français majeur qui réside habituellement à l'étranger et **acquiert volontairement** une nationalité étrangère peut perdre la nationalité française **par déclaration**, dans l'année de cette acquisition ;
  - **art. 23-4** : le Français qui a une autre nationalité peut **demander** à perdre la nationalité française ; l'autorisation est accordée **par décret** (libération des liens d'allégeance) ;
  - art. 23-7 : perte possible par décret, sur avis conforme du Conseil d'État, pour celui qui se comporte en fait comme le national d'un pays étranger.
  
  On ne peut pas renoncer sans avoir une autre nationalité (pas d'apatridie).
- **Ce que la loi peut faire seule** :
  - conditionner l'autorisation de l'art. 23-4 et l'enregistrement de la déclaration de l'art. 23 à un **quitus fiscal** (taxe de sortie payée ou garantie) ;
  - créer une **taxe de renonciation** pour les nationaux couverts (seuils de patrimoine ou de revenu, sur le modèle du § 877A). Elle combinerait la réalisation réputée de toutes les plus-values latentes (pas seulement des titres), sans dégrèvement automatique, et une soulte égale à quelques années d'impôt différentiel restant dû, de façon que la renonciation ne soit pas moins chère que de rester.
  
  ⚠️ V18315 (proportionnalité au regard de *Tjebbes* pour les binationaux d'un autre État membre).
- **Remboursement d'aides publiques** (demande de l'auteur) [opinion, ⚠️ V18317] :
  - **pour l'avenir seulement** : insérer dans les conventions d'aide (création d'entreprise, prêts d'honneur, subventions de Bpifrance) une clause de remboursement au prorata si le bénéficiaire renonce à la nationalité, ou s'il transfère l'activité hors de France, dans un délai fixé (par exemple 10 ans) ;
  - **rétroactivement, non** : réclamer une aide versée sans cette condition heurterait la sécurité juridique et la garantie des droits (DDHC, art. 16) ;
  - les aides fiscales aux entreprises (crédit d'impôt recherche, jeunes entreprises innovantes) sont accordées à la **société**, pas à la personne : la clause doit viser la société (transfert de l'activité, du siège ou de la propriété intellectuelle) ;
  - ordre de grandeur : faible en recette, utile comme principe (« ce qu'on a reçu de la collectivité, on le rend si on la quitte pour ne plus contribuer »).

### 1.8 Les propositions françaises antérieures [fait, C sauf mention]

- **2011-2012** : propositions de loi sur la perte de la nationalité pour les citoyens sans domicile fiscal en France (mai 2011) et « visant à conforter le lien entre impôt et citoyenneté » (n° 4492, avril 2012, Assemblée nationale) [A, textes non lus en entier ⚠️ V18318].
- **Mars 2012** : pendant la campagne présidentielle, le candidat de l'UMP propose un impôt lié à la nationalité sur le modèle américain, ciblé sur les pays où la fiscalité du capital est plus faible (presse).
- **Décembre 2012** : après l'annonce d'un départ médiatisé en Belgique, un député propose la déchéance de nationalité des exilés fiscaux ; le ministre du Budget qualifie l'indexation de l'impôt sur la nationalité de « piste » au Sénat ; le ministre de l'Économie souligne la difficulté de distinguer expatriés et exilés (presse ⚠️ V18318).
- **2024** : le programme du Nouveau Front populaire reprend l'idée d'un impôt universel sur les expatriés fiscaux (presse ⚠️ V18318).
- **Aucune n'a été adoptée.** Les obstacles cités à chaque fois sont les conventions, le droit de l'UE et la distinction entre l'expatrié qui travaille et l'exilé qui optimise. **Le dispositif ci-dessus y répond par les seuils, l'impôt de suite et le crédit d'impôt** [opinion].

### 1.9 Ce qu'on peut faire seul, avec l'UE, ou sur des années

| mesure | seul (loi de finances, 1 à 2 ans) | avec l'UE | long terme (5 à 10 ans) |
|---|---|---|---|
| Impôt de suite différentiel (anciens résidents ≥ 6/10 ans, 10-15 ans, seuils) | **oui** pour les pays sans convention et Monaco ; ailleurs, seulement là où la convention le permet | conforme au droit de l'UE seulement si proportionné ; contentieux probable | clause dans les conventions |
| Impôt sur tous les nationaux couverts (à vie, à l'américaine) | non (conventions, Constitution incertaine) | non sans accord | renégociation générale ou instrument multilatéral |
| Taxe de sortie élargie (fin du dégrèvement, tous actifs, prorata temporis, crédit à la vente) | **oui** (sursis jusqu'à la vente dans l'UE) | compatible si sursis | clauses de prorata dans les conventions |
| Taxe de renonciation + quitus (Code civil, art. 23 et 23-4) | **oui** | contrôle de proportionnalité (*Tjebbes*) | — |
| Remboursement des aides futures | **oui** (clauses contractuelles) | encadrement des aides d'État ⚠️ V18317 | — |
| Échange automatique fondé sur la nationalité | non (sauf obligation déclarative unilatérale) | **DAC à l'unanimité** | norme OCDE ; accords bilatéraux de type FATCA |
| Transparence des holdings, registre des bénéficiaires effectifs, facturation électronique, données croisées | **oui** (déjà en cours pour la facturation électronique) | registre des bénéficiaires effectifs : directive anti-blanchiment | — |

### 1.10 La meilleure objection, et la réponse

- **Objection (steelman)** : « L'impôt sur la nationalité punit les 2,8 à 3,2 millions de Français de l'étranger, dont l'immense majorité ne fuit rien ; il pousse les binationaux à renoncer, comme les Américains accidentels ; il est inapplicable sans FATCA ; il se heurte à 120 conventions et au droit de l'UE ; et il rapporte peu, puisque les vrais exilés fiscaux sont déjà partis ou restent par des montages. »
- **Réponse** [opinion] :
  1. **seuils élevés** (patrimoine ≥ 2 M€ ou revenu ≥ 250 000 €) et **ancienneté de résidence** : aucune déclaration pour les autres, donc pas d'« Américains accidentels » ;
  2. **crédit intégral** de l'impôt étranger : on ne paie jamais plus qu'en restant ;
  3. **dans les faits, la recette directe est faible** (0,8 Md€ au central) : le but est d'**ôter l'intérêt du départ**, ce qui réduit l'érosion et permet des taux plus élevés au sommet (§ 3) ;
  4. Monaco prouve que la France le fait déjà ;
  5. pour les conventions et l'UE, la réponse est le temps et la coalition, et il faut le dire : c'est un chantier de mandat, pas une mesure du premier budget.

## 2. Chiffrage

### 2.1 Les Français établis à l'étranger [fait, A/C]

- Registre des Français établis hors de France : **1 741 942** inscrits au 01/01/2025 (décret n° 2025-104, A) ; **1 784 975** au 31/12/2025 (+1,7 % ; rapport du MEAE de 2026 relayé par la presse, C). Nombre total estimé, avec les non-inscrits : **2,8 à 3,2 millions** (même source, C).
- Premiers pays (31/12/2025) : Suisse **168 881**, États-Unis 168 259, Royaume-Uni 141 242, Belgique 126 452, Canada 119 545 ; Émirats arabes unis : +12,7 % d'inscrits en 2025 (effectif non relevé ⚠️ V18319).
- **Pays à fiscalité plus faible pour les hauts patrimoines** [opinion] : presque tous, puisque seuls la Suisse (impôt cantonal sur la fortune), l'Espagne et la Norvège ont un impôt annuel sur la fortune comparable. **Pour les hauts revenus du travail**, l'écart est faible avec le Royaume-Uni, la Belgique ou les États-Unis, et fort avec les Émirats, Monaco, la Suisse (selon le canton) et Singapour. Aucune source ne croise nationalité, résidence et niveau de revenu ou de patrimoine : **c'est le premier trou de données** (⚠️ V18320).

### 2.2 Départs et retours de contribuables aisés [fait, A via France Stratégie 2023]

- Redevables de l'ISF ou de l'IFI partis : **7 480 de 2011 à 2021**, pour 32,4 Md€ d'actif net imposable, soit 4,33 M€ en moyenne, hors biens professionnels [calcul]. Retours moyens : 370 par an (ISF, 2011-2016) et 380 par an (IFI, 2018-2021), soit **≈ 4 100** sur la période et un solde de **≈ 3 400** foyers partis [calcul].
- CPO (décembre 2025) : **950 départs d'ISF par an (2011-2016) pour 370 retours ; 260 départs d'IFI pour 380 retours (2018-2021)** ; 19 % des partants vont en Suisse (`sources/taxe-1pc-fiabilisation.md` § 2 ; `sources/exil-patrimoines-preuves.md` § 1.1).
- **Ce qu'on ne mesure pas** : les départs d'entrepreneurs dont les titres professionnels étaient exonérés (non comptés par la DGFiP) ; les départs avant de devenir riche (fondateurs installés aux États-Unis ou au Royaume-Uni) ; les départs antérieurs à 2011.

### 2.3 Recette de l'impôt différentiel sur les Français déjà partis [estimation ; résultats § E]

Méthode (HN4 à HN11) :
- **Volet patrimoine** = ménages couverts × impôt moyen de la fonction v7.5 sur une loi de Pareto au-delà de 2 M€ (tronquée à 5 Md€) × (1 − part déjà taxée en France ou créditée) × (1 − part couverte par l'impôt plancher) × taux de recouvrement à l'étranger ;
- **volet revenus** = ménages au-delà de 250 000 €/an × différentiel moyen × recouvrement ;
- **taxe de renonciation** = renonciations de ménages couverts × impôt moyen ;
- moins le **coût de gestion** (service dédié de 300 à 600 ETP à 90 000 € de coût complet, plus 10 à 30 M€ de systèmes).

| | bas | central | haut |
|---|---|---|---|
| ménages couverts (patrimoine ≥ 2 M€) | 5 000 | 12 000 | 25 000 |
| α de Pareto ; patrimoine moyen | 1,9 ; 4,2 M€ | 1,7 ; 4,8 M€ | 1,5 ; 5,9 M€ |
| impôt dû moyen (fonction v7.5) | 115 926 € | 134 425 € | 165 663 € |
| crédit ou part déjà taxée ; impôt plancher ; recouvrement | 30 % ; 45 % ; 30 % | 20 % ; 40 % ; 50 % | 10 % ; 35 % ; 70 % |
| **volet patrimoine** | 0,07 | 0,39 | 1,70 |
| ménages au-delà de 250 000 €/an × différentiel moyen | 8 000 × 30 000 € | 15 000 × 50 000 € | 30 000 × 80 000 € |
| **volet revenus** | 0,07 | 0,38 | 1,68 |
| taxe de renonciation (50 / 150 / 300 par an) | 0,02 | 0,09 | 0,30 |
| coût de gestion | −0,08 | −0,06 | −0,04 |
| **net (Md€/an)** | **0,07** | **0,80** | **3,64** |

- Les nombres de ménages couverts sont des **hypothèses** encadrées par le solde des départs ISF/IFI (≈ 3 400 sur 2011-2021, ≈ 600 par an avant l'IFI), qu'on étend aux départs plus anciens, aux entrepreneurs non comptés et aux fortunes faites à l'étranger (⚠️ V18320). Le haut suppose un réseau de conventions renégocié ; le bas, des conventions inchangées (l'impôt ne s'applique alors que dans les pays sans convention et à Monaco).
- **Comparaison** : l'exit tax actuelle rapporte 23 M€/an en caisse ; la taxe de renonciation du central (0,09 Md€) suppose 150 renonciations de ménages couverts par an. Aux États-Unis, ≈ 4 700 renonciations par an pour plusieurs millions d'expatriés, surtout pour fuir la charge déclarative.
- **Coût privé** : obligations déclaratives des ménages couverts et des intermédiaires ; non chiffré ⚠️ V18321.

### 2.4 Effet sur l'érosion du modèle (H512, part des « départs réels »)

- Dans la chaîne de la v7.4 (et donc de la v7.5), l'érosion à 1 point du capital mobile du 1 % le mieux doté est de 40 %, dont **20/74 ≈ 27 % par l'exil** (H512) ; l'exil emporte en plus 2,2 %/an d'autres impôts par euro parti (H513).
- **Impôt différentiel seul**, avec départs neutralisés à 60 % (HN3) [calcul, § B et C] :
  - l'érosion à 1 point passe de 40 % à **33,5 %** ;
  - la part de l'exil dans l'érosion restante passe de 27 % à **12,9 %** ;
  - l'érosion effective du capital mobile du 1 % passe de 59 % à **51 %** dans la v7.5 ;
  - les autres impôts perdus par l'exil passent de 4,4 à **1,8 Md€** ;
  - la recette de la v7.5 passe de 62,52 à **64,93 Md€ (+2,41)** ;
  - avec le meilleur réglage (t∞ = 4,5 %, K = 700 k€) : **71,77 Md€ (+9,25)**, contre +5,87 sans l'impôt différentiel.
- **Le canal déclaratif reste dominant** (≈ 63 % de l'érosion, HN1) : l'impôt sur la nationalité ne le touche pas. C'est le rôle de la transparence (§ 3).

## 3. Variante « impôt bien conçu »

### 3.1 Méthode

- **Décomposition** (HN1) : e1 = 40 % × [d × (1 − rDecl) + x × (1 − couv) + r], avec d ≈ 0,63 (déclaratif), x = 0,27 (exil, H512) et r = 0,10 (réel : épargne, consommation, effet mécanique ; Brülhart et al. : ≤ 6 % d'épargne sur les 79 % de réponse hors logement). Le reste de la population (hors 1 %) suit le même facteur (15 % × facteur).
- **Leviers** :
  - **rDecl** (canal déclaratif) : transparence des holdings (valeur sous-jacente), registre des bénéficiaires effectifs, facturation électronique, déclarations par des tiers (banques, notaires, assureurs, plateformes de cryptoactifs DAC8), données croisées (DVF, cadastre, comptes de sociétés) ;
  - **couv** (canal des départs) : impôt différentiel et taxe de sortie.
- **Scénarios « bien conçu »** : leviers égaux, calculés pour atterrir sur la fourchette d'**Advani et Tarrant** (*Fiscal Studies* 42(3-4), 2021 : la base se réduit de 7 à 17 % par point pour un impôt bien conçu) : 17 % (bas : leviers à 64 %), 12 % (central : 78 %), 7 % (haut : 92 %).
- **Chaîne inchangée** : le calcul reprend la v7.5 (part RP nette + fonction statique × rapport net/statique de la chaîne v7.4 au même t∞). Seuls changent erosionTop, erosionReste et partExil, le temps du calcul. **Contrôle** : sans levier, on retrouve exactement 62,52 Md€ et la grille du bilan (§ 000.6 : 63,42 à 3 %, 68,39 à 4,5 %) [tests].

### 3.2 Recette de la v7.5 recommandée (3 %, K = 400 k€) [calcul, § B]

| scénario | e1 (1 %) | érosion effective du 1 % | recette | Δ v7.5 | part du manque (52,1) | différé |
|---|---|---|---|---|---|---|
| référence | 40 % | 59 % | 62,52 | 0 | 0 % | 26,0 |
| impôt différentiel seul | 33,5 % | 51 % | 64,93 | +2,41 | 5 % | 27,3 |
| court terme (30 % / 30 %) | 29,2 % | 45 % | 64,80 | +2,28 | 4 % | 27,3 |
| bien conçu, bas | 17 % | 28 % | 67,64 | +5,12 | 10 % | 28,9 |
| **bien conçu, central** | **12 %** | **20 %** | **68,87** | **+6,35** | **12 %** | 29,6 |
| bien conçu, haut | 7 % | 12 % | 70,16 | +7,64 | 15 % | 30,3 |

### 3.3 Plafonds de 3 à 6 % (K minimal sous la contrainte dure de la v7.5) [calcul, § C]

| t∞ (K minimal) | référence | impôt différentiel seul | bien conçu bas | **bien conçu central** | bien conçu haut |
|---|---|---|---|---|---|
| 3,0 % (375 k€) | +0,90 | +3,35 | +6,12 | +7,38 | +8,69 |
| 3,5 % (500 k€) | +3,24 | +6,05 | +9,65 | +11,31 | +13,06 |
| 4,0 % (600 k€) | +5,14 | +8,26 | +12,71 | +14,80 | +17,05 |
| 4,5 % (700 k€) | **+5,87** | **+9,25** | +14,48 | +16,98 | +19,75 |
| 5,0 % (800 k€) | +5,58 | +9,14 | **+15,07** | **+18,00** | +21,30 |
| 5,5 % (900 k€) | +4,37 | +8,06 | +14,61 | +17,94 | **+21,78** |
| 6,0 % (1 025 k€) | +1,88 | +5,63 | +12,66 | +16,34 | +20,68 |

(Écart à la v7.5, Md€/an ; en gras, le maximum de chaque colonne.)

- **Avec un impôt bien conçu, le plafond optimal monte de 4,5 % à 5-5,5 %** et la recette du patrimoine du haut plafonne à **+15 / +18 / +22 Md€**, au lieu de +5,9. C'est **29 / 35 / 42 % des 52,1 Md€**. En ajoutant le stock déjà parti (central 0,8), on atteint **≈ 18,8 Md€, soit 36 % du manque** au central.
- **Le différé grossit** avec la recette : 43 Md€/an au central à 5 % (contre 26 dans la v7.5) ; **l'encaissé dans l'année ne bouge presque pas** : 37,5 Md€ à t∞ = 5 % (bien conçu central), contre 36,6 dans la v7.5 ; presque toute la recette supplémentaire est différée jusqu'à la vente ou à la succession (V16902 reste ouvert).
- **Le reste du manque (≈ 33 à 37 Md€) doit venir de la fonction des revenus, d'économies, ou d'une révision des décisions qui l'ont creusé** (Sécurité sociale à 100 %, épargne réglementée, TVA de la restauration ; bilan § 000.6).

### 3.4 Cas limites au-delà de 100 % du revenu [calcul, § D ; statiques, ne dépendent pas de l'érosion]

| cas (v7.4 et v7.5) | v7.5 (3 %, 400 k€) payé / dû | 4,5 % (700 k€) | 5 % (800 k€) | 5,5 % (900 k€) |
|---|---|---|---|---|
| 5 M€ d'actions cotées à 3 %, sans autre revenu | < 100 % | 132 % | 144 % | 155 % |
| Rentier, 2 M€ d'actions cotées | < 100 % | 111 % | 119 % | 126 % |
| Château de 3 M€ en holding, aucun revenu versé | 253 % | 337 % | 362 % | 385 % |
| 3 M€ en cryptoactifs, salaire 5 000 €/mois | 176 % | 226 % | 241 % | 255 % |
| Parent seul avec 10 M€, avant donation | 98 % / 111 % | 118 % / 162 % | 128 % / 178 % | 137 % / 194 % |
| Chacun des trois enfants après donation | < 100 % | 89 % / 115 % | 94 % / 124 % | 99 % / 132 % |
| Chef d'entreprise, société de 10 M€ où il travaille | 65 % / 159 % | 65 % / 231 % | 65 % / 254 % | 65 % / 277 % |
| Collectionneur, 5 M€ d'art | 69 % / 153 % | 69 % / 193 % | 69 % / 206 % | 69 % / 219 % |
| Viticulteur, vignes de 6 M€ | < 100 % | < 100 % | < 100 % | 61 % / 101 % |
| Fondateur, 30 M€ au dernier tour, payé **en titres** | en titres | en titres | en titres | en titres |
| **nombre de cas au-delà de 100 % (sur 25)** | **6** | **9** | **9** | **10** |

Lecture [opinion] :
- un rentier dont le patrimoine rapporte 3 % paie plus que son revenu dès que le taux marginal du patrimoine dépasse ce rendement net de la fonction des revenus ; le stock se réduit alors, ce qui est l'objectif affiché d'une taxe sur la fortune au sommet, mais qui sera **attaqué comme confiscatoire** (décision 2012-662 DC, V14810) ;
- le différé (« dû » au-delà du « payé ») protège la trésorerie, pas le patrimoine ;
- **si l'auteur retient un plafond de 5 %, il faut un garde-fou explicite** : plafond de la charge payée à 100 % du revenu avec différé, ou taux marginal du patrimoine plafonné au rendement réel de l'actif. Les deux réduisent la recette de cette variante (non chiffré ⚠️ V18322).

### 3.5 Pourquoi c'est optimiste, et ce qui le justifie

**Ce qui justifie l'hypothèse** :
- (a) la littérature distingue nettement les impôts mal conçus (assiette trouée, auto-déclaration, pas de taxe de sortie : Suisse 43 % par point, Colombie) des impôts bien conçus (7 à 17 %, Advani et Tarrant) ;
- (b) l'essentiel de l'érosion est **déclaratif** (Seim : un tiers de sous-déclaration ; Brülhart : 49 % d'évasion des actifs financiers ; Londoño-Vélez : dettes gonflées, actifs cachés), donc sensible à l'information des tiers ;
- (c) la France dispose d'outils que les pays étudiés n'avaient pas : facturation électronique généralisée (2026-2027), registre des bénéficiaires effectifs, fichiers des comptes (FICOBA) et des contrats d'assurance-vie (FICOVIE), données de valeurs foncières (DVF) ;
- (d) la transparence des holdings (valeur sous-jacente) supprime le principal canal de sous-évaluation des actifs passifs ;
- (e) l'impôt différentiel neutralise une partie du canal des départs, et la taxe de sortie en ferme une autre.

**Ce qui le rend fragile** :
- (a) la fourchette de 7 à 17 % porte sur l'assiette entière ; ici, elle est appliquée au **capital mobile du 1 % le plus riche**, plus élastique (Jakobsen et al. : 25 % par point pour le top 1 %, Brülhart : 43 %) ;
- (b) il faut supprimer **64 à 92 %** du canal déclaratif **et** des départs : aucun pays n'a réuni tous les leviers ;
- (c) la **valorisation des titres non cotés**, des œuvres d'art et des cryptoactifs reste déclarative même avec des tiers déclarants ;
- (d) l'impôt différentiel ne couvre les départs qu'après renégociation des conventions (des années) et reste contestable dans l'UE ;
- (e) l'effet « réel » (épargne, effet mécanique) est gardé à 10 % de l'érosion ; Jakobsen et al. en attribuent un quart au mécanique chez les très riches : s'il est plus fort, l'érosion plancher monte ;
- (f) la chaîne garde ses autres fragilités (recalage × 1,4, loi jointe revenu × patrimoine, différé : V15205, V15302, V16902).

**Recommandation de Claude** :
- retenir le **court terme** (≈ +2,3 Md€ à réglage inchangé ; +9,4 au mieux) comme valeur prudente du programme ;
- garder le **bien conçu central** comme cible de fin de mandat, conditionnée à des jalons vérifiables (transparence des holdings en vigueur, conventions prioritaires renégociées, échange fondé sur la nationalité dans l'UE) ;
- ne jamais inscrire le bien conçu **haut** dans un chiffrage de campagne.

## 4. État de la recherche

- **Ce que les études établissent** :
  - l'érosion d'un impôt sur la fortune est surtout **déclarative** (Seim 2017 ; Brülhart et al. 2022 ; Londoño-Vélez et Ávila-Mahecha 2025) ;
  - l'exil des riches installés est réel mais minoritaire (NBER 32153 : −2 % de riches par point ; DGFiP : 0,3 à 0,7 % de la base par an) ;
  - l'échange automatique réduit les dépôts offshore mais déplace les actifs (OCDE 2019 ; Johannesen et Zucman 2014) ;
  - un quart de l'impôt des 0,01 % les plus riches est éludé (Alstadsæter, Johannesen et Zucman 2019).
- **Ce qui est débattu** :
  - l'effet de la **conception** de l'impôt sur l'élasticité (Advani et Tarrant le défendent par la revue des études, sans expérience naturelle qui fasse varier la conception seule) ;
  - l'effet dissuasif de l'imposition des citoyens américains sur l'émigration fiscale : les renonciations augmentent avec FATCA, mais aucune étude causale lue n'isole l'effet sur les riches ⚠️ V18323 ;
  - la compatibilité d'un impôt de suite avec le droit de l'UE.
- **Ce qui manque** : une mesure du patrimoine et des revenus des Français établis à l'étranger (nationalité × résidence × patrimoine) ; le rapport annuel au Parlement sur l'exit tax (non lu, V14812) ; une évaluation de l'impôt de suite allemand ou espagnol.

## 5. Hypothèses

- **HN1** décomposition de l'érosion : exil 20/74 (H512), réel 10 %, déclaratif ≈ 63 %.
- **HN2** érosion de référence à 1 point : 40 % (1 % le mieux doté), 15 % (reste).
- **HN3** leviers par scénario : impôt différentiel seul (0 / 60 %), court terme (30 / 30 %), bien conçu (64 / 78 / 92 %, égaux, calculés pour 17 / 12 / 7 %).
- **HN4** ménages couverts par le volet patrimoine à l'étranger : 5 000 / 12 000 / 25 000.
- **HN5** Pareto au-delà de 2 M€, α = 1,9 / 1,7 / 1,5, tronqué à 5 Md€.
- **HN6** part déjà taxée en France ou créditée : 30 / 20 / 10 %.
- **HN7** part couverte par l'impôt plancher : 45 / 40 / 35 %.
- **HN8** recouvrement à l'étranger : 30 / 50 / 70 %.
- **HN9** volet revenus : 8 000 / 15 000 / 30 000 ménages au-delà de 250 000 €, différentiel de 30 000 / 50 000 / 80 000 €.
- **HN10** gestion : 600 / 400 / 300 ETP à 90 000 €, plus 30 / 20 / 10 M€ de systèmes.
- **HN11** taxe de renonciation : 50 / 150 / 300 renonciations de ménages couverts par an à 0,3 / 0,6 / 1 M€.
- **HN12** comportement du stock compris dans HN8.
- **HN13** externalité de l'exil inchangée (H513), appliquée à la part non couverte.
- **HN14** cas limites statiques (base_0611.js).

## 6. Vérifications ouvertes (`verifications.md`, V18300 à V18323)

Arrêt *Cook v. Tait* ; exclusion § 911 de 2025-2026 ; clause de sauvegarde du modèle américain ; date de l'accord FATCA France-États-Unis ; seuils § 877A de 2026 et nombre d'Américains à l'étranger ; Érythrée ; impôts de suite allemand, espagnol et nordiques ; statistiques CRS ; nombre de conventions ; délais de renégociation et clauses de dénonciation ; art. 11 de l'instrument multilatéral ; dénonciation danoise de 2008 ; convention avec les Émirats ; droit de l'UE sur un impôt de suite ; *Tjebbes* et taxe de renonciation ; Constitution et critère de nationalité ; clauses de remboursement d'aides ; propositions de 2011-2013 et 2024 ; effectif aux Émirats ; patrimoine des Français de l'étranger ; coût privé ; garde-fou des cas limites ; effet de FATCA sur l'émigration des riches.

## 7. Sources et ce qu'elles établissent

| source | ce qu'elle établit | cote | conflits d'intérêts connus |
|---|---|---|---|
| IRS, instructions du formulaire 8854 (2025), irs.gov/instructions/i8854, consulté le 06/11/2026 | seuils § 877A 2025 (206 000 $, 2 M$, 890 000 $) | A | — |
| Federal Register, « Quarterly Publication of Individuals Who Have Chosen To Expatriate », 24/04/2025, 23/07/2025, 17/11/2025, 23/01/2026 (govinfo.gov), consulté le 06/11/2026 | ≈ 4 745 lignes en 2025 (comptage automatique, minorant) | B (comptage de Claude sur source A) | — |
| Sites de conseil fiscal (taxesforexpats.com, beancount.io), consultés le 06/11/2026 | seuil de 2026 ≈ 211 000 $ | D | vendent du conseil aux expatriés |
| Décret n° 2025-104 (JO du 05/02/2025) ; rapport du MEAE 2026 relayé par lepetitjournal.com (06/09/2026), consulté le 06/11/2026 | 1 741 942 inscrits (01/01/2025) ; 1 784 975 (31/12/2025) ; 2,8 à 3,2 M estimés ; top 5 des pays | A (décret) / C (presse) | média d'expatriés |
| France Stratégie, rapport final du comité d'évaluation de la fiscalité du capital, oct. 2023, annexe 9 (DGFiP) ; CPO, déc. 2025 | départs et retours ISF/IFI 2011-2021, actif des partants, destinations | A/B | — |
| Réponse ministérielle, Sénat, QE n° 05844, 27/02/2020 | exit tax : 138 M€ encaissés, 5,75 Md€ théoriques | A | — |
| CGI, art. 167 bis (copie codes.droit.org, à jour du 31/10/2026, lue localement le 06/11/2026) | conditions de la taxe de sortie | A | — |
| Code civil, art. 18-1, 23 à 23-8 (même copie, lue le 06/11/2026) | perte de la nationalité par déclaration, par décret (23-4), par déchéance | A | — |
| BOFiP et décret n° 2014-1270 ; impots.gouv.fr (avis de dénonciation de la convention franco-suisse sur les successions) | dénonciation du 17/06/2014, sans effet depuis le 01/01/2015 | A | — |
| Convention franco-monégasque du 18/05/1963, art. 7 ; CE, 11/04/2014, n° 362237 (via BOFiP et cabinets d'avocats) | Français à Monaco imposés en France | A (texte, non lu en entier ⚠️) / C | cabinets d'avocats |
| OCDE, examen par les pairs sur le chalandage fiscal, France, 2024 | 120 conventions en vigueur | B | — |
| CJCE/CJUE, C-9/02 (2004), C-470/04 (2006), C-371/10 (2011), C-135/08 (2010), C-221/17 (2019) | taxe de sortie et nationalité en droit de l'UE | A | — |
| Advani et Tarrant, *Fiscal Studies* 42(3-4), 2021 | 7 à 17 % par point pour un impôt bien conçu | A | — |
| Brülhart, Gruber, Krapf, Schmidheiny, *AEJ: Policy* 14(4), 2022 ; Seim, *AEJ: Policy* 2017 ; Jakobsen et al., *QJE* 2020 ; Londoño-Vélez et Ávila-Mahecha, *REStud* 2025 | canaux de l'érosion (via `sources/taxe-1pc-fiabilisation.md` § 2) | A | — |
| Presse (webmanagercenter.com 13/03/2012, dhnet.be 11/12/2012, economiematin.fr, journaldunet.com), Assemblée nationale (propositions n° 4492 de 2012 et n° 855 de 2013) | propositions françaises 2011-2013 et 2024 | C / A | — |
| Haufe, steuertipps.de, Université de la Sarre (cours), AEDAF, revue CEF (Espagne) | impôts de suite allemand (10 ans) et espagnol (année + 4) | C | éditeurs et conseils fiscaux |
| libertymundo.com (synthèse CRS 2025) | 116 juridictions, 171 M de comptes, ≈ 13 000 Md€ | D | site de conseil en expatriation |

## Reproduction

Depuis `modeles/systeme-ideal/`, avec jsc (zsh, liste en tableau) : la liste de `test_base_0611.js` sans le test, puis `variante_nationalite_0611.js test_variante_nationalite_0611.js` (25 vérifications) ; remplacer le test par `rapport_variante_nationalite_0611.js` pour régénérer `resultats_variante_nationalite_0611.txt`.
