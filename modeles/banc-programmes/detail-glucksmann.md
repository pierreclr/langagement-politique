---
titre: "Chiffrage poste par poste : Glucksmann, Place publique (livret climat, chiffrage partiel)"
statut: généré par detail.py (ne pas éditer à la main) ; ordres de grandeur sous hypothèses, jamais des prédictions
---

# Chiffrage poste par poste : Glucksmann, Place publique (livret climat, chiffrage partiel)

Cette page détaille, ligne par ligne, comment le banc d'essai chiffre ce programme : ce que dit la mesure, ce que le parti annonce, ce que nous estimons, comment nous l'estimons, avec quel modèle, et si le même modèle sert aux autres programmes quand les mesures se ressemblent. Ce sont des ordres de grandeur sous hypothèses, jamais des prédictions. Le même banc chiffre notre propre programme : l'auteur est partie prenante de la comparaison, et les écarts de méthode entre programmes sont listés dans [les mêmes modèles pour tous](./memes-modeles.md).

Programme lu : Place publique / campagne de Raphaël Glucksmann, « Révolution écologique : les premiers 100 jours pour sortir des énergies fossiles », livret de 24 p., présenté le 09/11/2026 (https://glucks2027.fr/wp-content/uploads/2026/11/livret_progr_revolution_ecologique_2027.pdf), lu en entier le 11/11/2026 (pp. 6, 8, 9, 12, 18) (cote D, auteur = le programme).

**Chiffrage partiel : à lire avant tout chiffre.** Le livret ne couvre que la partie climat et énergie du projet de Raphaël Glucksmann ; la seconde partie (biodiversité, eau, agriculture, pêche, alimentation, pollutions, santé) est annoncée « dans quelques semaines » et le programme complet (« Acte Un », 88 pages) n'est pas chiffré. Le livret ne donne que **deux montants** : 200 Md€ d'argent public sur le quinquennat et 50 Md€ de contribution exceptionnelle sur les plus hauts patrimoines, une seule année. Tout le reste est à zéro dans cette colonne, qui est **distincte** de celle du PS (contre-budget du groupe socialiste) : elle ne dit pas ce que coûterait le programme, elle dit ce que deviennent la dette et le déficit avec ces deux seuls montants. L'effet sur le solde s'arrête en 2032, faute de montant au-delà : lire l'effet année par année (`resultats-v2.md`, § 4) plutôt que « en régime », qui additionne ici un coût de cinq ans et une recette d'un an.

Unités : milliards d'euros (Md€) par an, euros de 2025 ; un nombre positif améliore le solde public, un nombre négatif l'aggrave. Chaque estimation est une médiane de 10 000 tirages, suivie entre crochets de l'intervalle qui en contient 80 % (centiles 10 et 90). Régime : 2032. Résultats complets : `modeles/banc-programmes/resultats.md`. Pages voisines : [La France insoumise](./detail-lfi.md), [Rassemblement national](./detail-rn.md), [Les Républicains (plan Retailleau)](./detail-lr.md), [PS et Place publique (contre-budget 2027)](./detail-ps.md), [notre système](./detail-langagement.md).

## Le total

| | Glucksmann, Place publique (livret climat, chiffrage partiel) |
|---|---|
| Réduction (+) ou aggravation (−) du déficit par rapport au droit actuel, en régime (Md€) | **−35 [−40 ; −1]** |
| dont recettes nouvelles et économies | 6 [1 ; 41] |
| dont dépenses nouvelles et baisses d'impôts | 41 [39 ; 44] |
| Somme des médianes des postes ci-dessous | −36 |
| Somme des montants annoncés par le parti, ligne par ligne (même signe) | 10 |
| Part des tirages où le programme aggrave le déficit | 91 % |
| Dette publique en 2038 (% du PIB ; taux d'intérêt fixe de 3,45 %) | 164 [163 ; 164] |
| Dette publique en 2058 (% du PIB) | 247 [246 ; 248] |

Lecture. La médiane du total n'est pas la somme des médianes des postes : les postes sont tirés ensemble, avec des lois souvent asymétriques (pour une économie passée par le filtre, la moitié des tirages tombe entre la médiane et l'annonce, plus haut : la médiane du total est donc au-dessus de la somme des médianes). Le total est celui du tableau comparatif des résultats (§ 1 et § 11.1 de `modeles/banc-programmes/resultats.md`) ; un test vérifie qu'il est recopié sans écart.

## Ce que nous n'avons pas pu chiffrer

- taxe européenne sur les superprofits pétroliers et gaziers (proposition ; aucun montant ; unanimité européenne probable).
- fin des exonérations sur le carburant des vols intérieurs et hausse de la taxe sur les billets d'avion (aucun montant).
- doublement du plafond du livret A, livret fusionné avec le LDDS en « Livret de souveraineté écologique et sociale » à 2,5 % (aucun montant ; effet sur le déficit non établi).
- grand emprunt européen pour la transition (aucun montant ; hors budget national).
- leasing social (1 million de véhicules électriques sur 5 ans à 100 €/mois), pompes à chaleur (1 million à 1 €/jour), 5 000 lignes de covoiturage, Pass mobilité durable jeunes à 1 €/jour (aucun montant ; probablement inclus dans les 200 Md€).
- moratoire sur les hausses de taxes sur l'électricité, prix qui ne progresse pas plus vite que l'inflation (aucun montant).
- rénovation de 4 000 écoles primaires par an et plus de 2 800 collèges et lycées (aucun montant).
- chèque énergie de 500 € (6 millions de familles) et 200 € (10 millions) : 5 Md€ par calcul de Claude, inclus dans les 200 Md€ (non ajouté).
- sécurité civile : 1 Md€ d'investissement dès juin 2027 (inclus dans les 200 Md€, non ajouté).
- toute la seconde partie du projet écologique (biodiversité, eau, agriculture, pêche, alimentation, pollutions, santé) et le programme « Acte Un » de 88 p. (pas de chiffrage).
- objectifs sans montant : stabilisation de la dette à l'horizon 2032 (p. 8), neutralité carbone 2050, doublement des capacités renouvelables d'ici 2035.

## La meilleure objection à notre chiffrage

Ce que Raphaël Glucksmann peut opposer à ce chiffrage, dit aussi loyalement que possible :

- **C'est un chiffrage partiel, et le dire en premier ne suffit pas à le rendre juste.** Le livret ne donne que deux montants ; tout le reste du programme (retraites, impôts, santé, seconde partie écologique) est à zéro ici. Le résultat ci-dessus n'est donc ni le coût ni le bénéfice du programme de Raphaël Glucksmann : un programme complet pourrait l'aggraver comme l'améliorer.
- **Les 200 Md€ ne sont peut-être pas tous nouveaux.** Nous les lisons comme de la dépense en plus du droit actuel (40 Md€ par an de 2028 à 2032) ; le texte dit seulement « nous investirons », et une partie peut être déjà au budget ou financée hors du budget de l'État (livret d'épargne, emprunt européen, investissements privés « mobilisés »). Si la moitié seulement est nouvelle, le coût est surestimé de moitié.
- **La contribution exceptionnelle de 50 Md€ est notre point le plus sévère.** Le livret ne donne ni seuil, ni taux, ni assiette : nous la lisons avec le score le plus bas de la règle commune (M 0, J 0, E 0), soit 5,5 [1,0 ; 41,0] Md€ en médiane contre 50 annoncés. Ses défenseurs diront qu'un prélèvement unique sur quelques milliers de foyers est conçu pour passer, et que des études (non relues ici) évaluent l'assiette à plus de 1 000 Md€ ; un prélèvement de l'ordre de 4 % serait alors possible sur le papier. Le banc ne dit pas qu'il est impossible : il dit que le texte ne permet pas de savoir s'il est conforme à la Constitution.
- **Le livret promet la stabilisation de la dette à l'horizon 2032 ; nous trouvons une dette de 142 [141 ; 143] % du PIB en 2032** (à taux fixe, avec ces deux seuls montants). Ce n'est pas une réfutation : l'objectif repose sur des mesures non chiffrées (effet d'entraînement, croissance, seconde partie du programme).

## Les postes en un tableau

| N° | Poste | Annoncé par le parti (Md€) | Notre estimation (Md€) | Modèle ou traitement |
|---|---|---|---|---|
| [GL02](#gl02) | Contribution exceptionnelle pour l'investissement climatique sur les plus hauts patrimoines : 50 Md€, une seule année (fonds dédié) | 50 | 5,5 [1,0 ; 41,0] | annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce |
| [GL01](#gl01) | Investissement public climat : 200 Md€ d'argent public sur le quinquennat (40 Md€ par an, 2028-2032) | 40 | −41,1 [−43,8 ; −39,2] | montant du parti, 0,95 à 1,15 fois |

## Le détail, poste par poste

### Patrimoine et héritages

#### GL02 · Contribution exceptionnelle pour l'investissement climatique sur les plus hauts patrimoines : 50 Md€, une seule année (fonds dédié) {#gl02}

- **La mesure, dans les mots du programme.** « Cette contribution concernera une infime minorité de foyers, tout en haut de l'échelle des patrimoines, et rapportera 50 milliards d'euros. […] une recette exceptionnelle, une seule année » [livret, p. 9]. Source : [livret](https://glucks2027.fr/wp-content/uploads/2026/11/livret_progr_revolution_ecologique_2027.pdf), Fiscalité du patrimoine. Livret « Révolution écologique » (24 p., 09/11/2026), lu en entier (cote D, auteur = le programme).
- **Annoncé par le parti.** 50 Md€ par an (recette ou économie) ; le livret donne le total (50 Md€ sur le quinquennat, ou 50 Md€ en une fois), la répartition par année est celle du fichier des mesures.
- **Notre estimation.** **5,5 [1,0 ; 41,0]** Md€ par an en 2032 : améliore le solde public (recette nouvelle ou économie).
- **Comment nous l'évaluons.** Le plafond est l'annonce du parti (50 Md€) ; la médiane (5 Md€) est notre estimation de ce qui est réalisable compte tenu de l'obstacle nommé ; plancher 0. Loi en deux pans uniformes : la moitié des tirages entre le plancher et la médiane, l'autre moitié entre la médiane et le plafond. Calendrier : part du régime atteinte de 2028 à 2032 : 100 %, 0 %, 0 %, 0 %, 0 % ; le flux s'arrête après 2028.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** Ni seuil, ni taux, ni assiette dans le livret : le montant est une annonce, pas un mécanisme. Ordre de grandeur (⚠️ calcul de coin de table) : l'assiette des foyers de plus de 100 M€ de patrimoine (de l'ordre de 1 800 foyers pour 735 M€ en moyenne dans notre module de patrimoine, soit environ 1 300 Md€) supposerait un prélèvement d'environ 3,8 % de cette assiette en une fois, avant érosion et exil. Une contribution unique sur le patrimoine n'a pas de précédent récent en France ; le Conseil constitutionnel a censuré en 2012 la taxe à 75 % sur les revenus au nom de l'égalité devant les charges publiques (⚠️ décision relue ailleurs, non relue ici). Score de faisabilité (règle commune, voir faisabilite.py) : M 0, J 0, E 0 : médiane à 10 % de l'annonce, soit 5 Md€.
- **Modèle utilisé.** Aucun : annonce plafonnée, médiane jugée réalisable à 10 % de l'annonce (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI R01a](./detail-lfi.md#r01a), [LFI R04](./detail-lfi.md#r04) (module des grandes fortunes, érosion et exil) ; [LFI R05](./detail-lfi.md#r05) (module des transmissions, planification et départs) — Rassemblement national : [RN T07](./detail-rn.md#t07) (montant du parti, 0,95 à 1,15 fois) ; [RN F02](./detail-rn.md#f02) (module des grandes fortunes, érosion et exil) — PS et Place publique (contre-budget 2027) : [PS01](./detail-ps.md#ps01) (module des grandes fortunes, érosion et exil) ; [PS02](./detail-ps.md#ps02) (annonce plafonnée, médiane jugée réalisable à 50 % de l'annonce) — notre système : [M-TH](./detail-langagement.md#m-th), [M-PAT](./detail-langagement.md#m-pat), [M-TRANS](./detail-langagement.md#m-trans) (notre modèle, rejoué à ses bornes). Ce que le code confirme et ce qui diffère : [note de famille « Patrimoine et héritages »](./memes-modeles.md#f-patrimoine).
- **Fiabilité.** Pas de modèle : la médiane est un jugement sur l'annonce, écrit ligne par ligne. Cotes des sources de la ligne : D. 2 points marqués ⚠️ (non vérifié). Obstacle nommé : Conseil constitutionnel : égalité devant les charges publiques, caractère confiscatoire, rétroactivité ; mobilité des contribuables.
- **Choix posés par l'IA.** la médiane réalisable et le plancher (jugement écrit dans la lecture et la contrainte) ; le poids 0,5 sur le facteur commun « coût ».

### Logement et transition écologique

#### GL01 · Investissement public climat : 200 Md€ d'argent public sur le quinquennat (40 Md€ par an, 2028-2032) {#gl01}

- **La mesure, dans les mots du programme.** « Nous investirons, sur la durée du quinquennat, 200 milliards d'euros d'argent public. » [livret, p. 8] ; emplois cités p. 12-18 : chèque énergie (500 € pour 6 millions de familles, 200 € pour 10 millions, soit 5 Md€ : calcul de Claude), sécurité civile 1 Md€ (p. 18). Source : [livret](https://glucks2027.fr/wp-content/uploads/2026/11/livret_progr_revolution_ecologique_2027.pdf), Climat et énergie. Livret « Révolution écologique » (24 p., 09/11/2026), lu en entier (cote D, auteur = le programme).
- **Annoncé par le parti.** 40 Md€ par an (coût) ; le livret donne le total (200 Md€ sur le quinquennat, ou 50 Md€ en une fois), la répartition par année est celle du fichier des mesures.
- **Notre estimation.** **−41,1 [−43,8 ; −39,2]** Md€ par an en 2032 : aggrave le solde public (dépense nouvelle ou baisse d'impôt).
- **Comment nous l'évaluons.** Coût certain une fois la mesure votée : le montant du parti (40 Md€) est la valeur la plus probable, dans une fourchette de 0,95 à 1,15 fois (convention, sans source). Aucune réaction de comportement. Calendrier : plein effet dès 2028 ; le flux s'arrête après 2032.
- **Lecture retenue, telle qu'écrite dans le fichier des mesures.** 200 Md€ divisés en cinq budgets annuels égaux (rien n'est dit sur le profil) ; lus comme dépense nouvelle (hypothèse haute : le texte ne précise pas si une partie est déjà au budget actuel) ; arrêtés après 2032 (rien n'est chiffré au-delà). Le livret dit que l'argent public « mobilisera les investissements » privés : cet effet d'entraînement, non chiffré, n'est pas compté. Fourchette : celle de la règle commune aux dépenses nouvelles (0,9 à 1,3 fois).
- **Modèle utilisé.** Aucun : montant du parti, 0,95 à 1,15 fois (loi de la ligne, tirée par `moteur.evaluer_mesure`).
- **La même famille ailleurs.** La France insoumise : [LFI D03](./detail-lfi.md#d03) (montant de LFI, 0,9 à 1,3 fois) ; [LFI D14](./detail-lfi.md#d14) (fourchette propre à la ligne) ; [LFI D16](./detail-lfi.md#d16) (ordre de grandeur sans source primaire, dit « grossier ») — Rassemblement national : [RN G05](./detail-rn.md#g05) (annonce plafonnée, médiane jugée réalisable à 17 % de l'annonce) — PS et Place publique (contre-budget 2027) : [PS11](./detail-ps.md#ps11) (montant du parti, 0,95 à 1,15 fois). Ce que le code confirme et ce qui diffère : [note de famille « Logement et transition écologique »](./memes-modeles.md#f-logement).
- **Fiabilité.** Pas de modèle : montant du parti, repris tel quel. Cotes des sources de la ligne : D. 1 point marqué ⚠️ (non vérifié).
- **Choix posés par l'IA.** H-GL-NOUVEAU : Les 200 Md€ sont lus comme additionnels au droit actuel (⚠️ le livret ne le dit pas) : si une partie est déjà au budget, le coût est surestimé. Le chèque énergie (5 Md€) et la sécurité civile (1 Md€) sont inclus dans les 200 Md€ (p. 12), non ajoutés ; la largeur de la fourchette autour du montant du parti ; le poids 0,3 sur le facteur commun « coût ».

---

Page générée par `modeles/banc-programmes/detail.py` à partir de `programmes/gl/mesures.py` et de `donnees/resultats.json` ; aucun chiffre n'y est tapé à la main. Écrite par Claude (IA d'Anthropic) pour l'auteur ; même banc pour tous, conflit d'intérêts déclaré.
