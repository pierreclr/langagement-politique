---
titre: Modèle « Éducation » : résultats
statut: premier jet, à valider par l'auteur
consultation: 2026-11-03
---

# Éducation : résultats

## Dix lignes (mise à jour du 03/11, variante « surveillants »)

1. Décision de l'auteur (03/11) : non-remplacement des 109 000 postes libérés par la démographie ; le tuteur est l'IA seule, cadrée en « moteur d'accompagnement » ; des **surveillants**, pas des pédagogues.
2. Coût employeur d'un assistant d'éducation : **≈ 30 300 €/an** (brut 1 801,74 €/mois, page officielle rapportée par résumé, ⚠️ V9200 ; coefficient de charges 1,40, hypothèse ⚠️ V9201), contre 35 000 € pour l'accompagnateur enseignant (H8) : **−14 %**.
3. Variante surveillants (licence et matériel inchangés), 1 pour 200 / 100 / 50 élèves : **1,96 / 5,15 / 11,25 Md€ par an** (166 / 438 / 955 € par élève), contre 0,2 / 5,7 / 12,4 pour les accompagnateurs enseignants (1 pour aucun / 100 / 50).
4. **À ratio égal, le surveillant ne fait gagner que 8 à 11 % (0,3 à 1,1 Md€)** ; ce qui pèse est le ratio : de 1 pour 100 à 1 pour 200, −1,8 Md€ (central).
5. Non-remplacement pur (sans tuteur) : **+2,2 / +3,9 / +5,5 Md€ par an à 10 ans** (`sources/economies-depense-publique.md`).
6. **Économie nette** par rapport au droit actuel (non-remplacement moins coût du tuteur surveillé, scénarios appariés) : **+0,2 / −1,3 / −5,8 Md€**. Le tuteur surveillé ne finance pas le non-remplacement : il en consomme l'essentiel (central) ou plus (haut).
7. Seul le ratio 1 pour 200 avec licence et matériel centraux (3,37 Md€) laisse un solde positif contre l'économie centrale (+0,5 Md€) ; avec les accompagnateurs enseignants à 1 pour 200 : 3,65 Md€ (+0,3).
8. Effet attendu inchangé (H9 : 0 / 0,15 / 0,30 écart-type) ; **aucun essai ne compare tuteur IA avec surveillant et tuteur IA avec enseignant** : c'est la lacune qui sépare 0,2 Md€ de 5 Md€ de dépense.
9. Protocole proposé (méthode § 4.5) : tirage au sort d'établissements, trois bras (tuteur + surveillant, tuteur + enseignant, sans tuteur) ; **35 établissements par bras** détectent 0,15 écart-type (tuteur contre sans), **78 par bras** détectent 0,10 (surveillant contre enseignant) ; deux ans ; **≈ 32 M€ (3 × 35 établissements) à ≈ 75 M€ (3 × 78)** de coût brut, 0,02 à 0,04 % de la dépense d'éducation.
10. Recommandation de Claude (à contredire) : ne pas inscrire « surveillants » dans le programme comme un fait établi ; l'inscrire comme **hypothèse à tester**, avec le non-remplacement seul en base chiffrée (+3,9 Md€ central) et le tuteur en pari séparé.

Sortie de `python3 modele.py` ; hypothèses H1 à H21 dans `methode.md`. **Ordres de grandeur, pas des prédictions.** Les chiffres d'entrée de la DIE, du coût par élève, de PISA maths, de TIMSS, des effectifs et des enseignants sont désormais lus à la source ; les autres restent ⚠️ (V6180 à V6219) ; les pages HTML de la DEPP et de l'OCDE renvoient HTTP 403, mais les PDF des notes DEPP 23.48, 24.47 et 26.42 et le jeu data.education.gouv.fr ont été lus le 03/11/2026 (voir `donnees/sources.csv`).

## 1. La dépense aujourd'hui (bloc A)

| Poste (2025) | Md€ |
|---|---|
| Premier degré (6,155 M élèves × 9 440 €) | 58,1 |
| Second degré (5,68 M élèves : collège 3,39 M, LGT 1,61 M, LP 0,67 M ; 10 580 / 13 200 / 14 590 €) | 67,0 |
| Supérieur (3,0 M étudiants × 13 350 €, coût 2025) | 40,0 |
| **Total reconstitué** | **165,2** |
| DIE 2025 (DEPP) | 199,2 |
| **Reste non expliqué** | **34,0** |

Lecture : 17 % de la DIE (34 Md€) ne se retrouve pas dans « effectif × coût par élève ». **La composition est établie** (DEPP, note 26.42, figure 5, lue le 03/11/2026) : la DIE se répartit en premier degré 30,1 % (60,0 Md€), second degré 37,0 % (73,7 Md€), supérieur 22,9 % (45,6 Md€) et formation continue et extrascolaire 9,9 % (19,7 Md€). Cette dernière part (20 Md€) n'a pas de pendant dans le tableau ; le reste (14 Md€) vient d'effectifs plus larges que ceux retenus ici (apprentis et étudiants des écoles hors université dans le supérieur : 45,6 Md€ ÷ 13 350 € ≈ 3,4 M, contre 3,0 M retenus).

**Résultats** (⚠️, résumés) : PISA 2022 mathématiques, France 474 contre OCDE 472, soit +2 points (dans la moyenne) ; mais **−21 points** par rapport à 2018 (0,21 écart-type) ; TIMSS 2023 CM1, France 484 contre 524 pour l'UE, soit **−40 points**, stable par rapport à 2019 (485). L'écart entre élèves favorisés et défavorisés est supérieur en France à la moyenne OCDE. Un résultat PISA 2025 de 458 points en mathématiques apparaît dans un résumé, non relu. **La France n'est pas mal classée à PISA et l'est à TIMSS CM1 : le problème est dans le primaire et les inégalités, pas dans le niveau moyen du secondaire.** C'est une lecture à confirmer.

## 2. Le tuteur IA (bloc B)

| Scénario | Coût par élève (€/an) | Coût national (Md€/an) | Part de la DIE | Effet (écart-type) | € par 0,1 écart-type |
|---|---|---|---|---|---|
| Bas (licence seule, effet nul) | 15 | 0,2 | 0,1 % | 0,00 | sans objet |
| Central | 485 (licence 60, matériel 75, accompagnateur 350) | 5,7 | 2,9 % | 0,15 | 323 |
| Haut | 1 050 (licence 200, matériel 150, accompagnateur 700) | 12,4 | 6,2 % | 0,30 | 350 |
| Tutorat humain intensif (référence) | 1 500 | n. a. | n. a. | 0,29 | 517 |

**Ce que montre le calcul.**
1. **Le logiciel est le poste le moins cher.** La licence représente 12 % du coût central ; **l'accompagnateur en représente 72 %**. L'hypothèse de l'auteur d'un dispositif peu coûteux tient pour le logiciel, **pas** si l'on place un adulte pour 100 ou 50 élèves. Le résultat dépend d'H8, non sourcée.
2. **À effet égal, le tuteur coûte environ 30 à 40 % de moins que le tutorat humain par dixième d'écart-type** (323 à 350 contre 517 €), **si** l'effet de 0,15 à 0,30 est confirmé. L'effet est une hypothèse (H9) : le Nigeria (0,29) est une expérience courte, à faible niveau de départ ; l'essai de Bastani montre un effet négatif sans garde-fous.
3. **Échelle PISA** : 0,15 écart-type correspond à 15 points, soit environ 70 % de la baisse française de 2018 à 2022 (21 points).
4. **Ordre de grandeur** : le tuteur central (5,7 Md€ par an) coûte 2,9 % de la DIE, soit un peu moins que les 7,9 Md€ de « autres administrations publiques » du financement de 2024 ; au scénario haut (12,4 Md€), 6,2 % de la DIE, comparable à la part des ménages (≈ 16 Md€, 8 % de la DIE, calcul).

### Variante « surveillants » (décision du 03/11) : tableaux

Coût national, Md€ par an, licence 60 € et matériel 75 € par élève (central), selon l'adulte et le ratio :

| 1 adulte pour | Surveillant (AED, 30 269 €) | Accompagnateur enseignant (35 000 €) | Écart |
|---|---|---|---|
| 200 élèves | 3,37 | 3,65 | −0,28 |
| 100 élèves | 5,15 | 5,71 | −0,56 |
| 50 élèves | 8,72 | 9,83 | −1,11 |

Scénarios appariés (licence, matériel et ratio du même scénario), puis comparaison avec les deux autres options, Md€ par an à 10 ans :

| | Bas (1 pour 200) | Central (1 pour 100) | Haut (1 pour 50) |
|---|---|---|---|
| Coût du tuteur surveillé | 1,96 | 5,15 | 11,25 |
| Coût du tuteur avec accompagnateurs enseignants | 0,2 (licence seule) | 5,7 | 12,4 |
| Économie du non-remplacement pur | +2,2 | +3,9 | +5,5 |
| **Net : non-remplacement + tuteur surveillé** | **+0,24** | **−1,25** | **−5,75** |
| Net : non-remplacement + tuteur accompagnateurs | +2,0 (licence seule) | −1,8 | −6,9 |

Lecture : le droit actuel (aucun tuteur, aucun non-remplacement) est la référence à zéro. **Le non-remplacement pur rapporte 2,2 à 5,5 Md€ ; ajouter un tuteur surveillé en reprend 2 à 11.** Les scénarios appariés mélangent des économies hautes avec des coûts hauts : pour une fourchette croisée, le meilleur cas (économie haute, tuteur bas) est +3,5 Md€ et le pire (économie basse, tuteur haut) −9,1 Md€. Les 109 000 postes se libèrent sur dix ans ; le surveillant, lui, se paie dès la première année de déploiement : **un décalage de trésorerie qui n'est pas modélisé**.

### Enseignants : redéploiement, pas suppression

| Scénario | ETP libérés par le tuteur | ETP en excès par démographie | Total à redéployer | Années de non-remplacement pour tout absorber (départs 3 % par an) |
|---|---|---|---|---|
| Bas | 0 | 109 138 | 109 138 | 5,1 |
| Central | 37 800 | 109 138 | 146 938 | 7,1 |
| Haut | 113 400 | 109 138 | 222 538 | 11,4 |

Sur 756 000 ETP (enseignants en établissement, rentrée 2025, public + privé sous contrat, lus le 03/11/2026 dans data.education.gouv.fr), **la démographie seule (−1,7 M élèves en dix ans, ⚠️) libère déjà 109 000 ETP à encadrement constant**, soit plus que le tuteur au scénario central. Aucune suppression de poste ni licenciement n'est nécessaire dans aucun scénario si l'on accepte 5 à 11 ans de non-remplacement partiel. **Mais le choix réel est autre** : utiliser ce potentiel pour **réduire les classes** (aujourd'hui 21,6 élèves par heure de cours au second degré et 18,2 par enseignant au premier degré public, ⚠️) ou l'économiser. À titre d'illustration, aujourd'hui 11,78 M élèves pour 756 000 ETP font 15,6 élèves par ETP (ratio global, pas une taille de classe) ; si le scénario central est absorbé par le non-remplacement (−146 938 ETP) et que les effectifs baissent de 1,7 M, on obtient 10,08 M / 609 062 = 16,6 ; si l'on garde tous les ETP face à la baisse démographique, 10,08 M / 756 000 = 13,3. L'arbitrage entre classes réduites et économies est **à trancher par l'auteur** ; le modèle ne le tranche pas.

## 3. Choix et autonomie (bloc C)

Aucun chiffrage de coût : la littérature ne donne ni gain net certain ni économie (voir `methode.md` § 4.3). **Trois résultats** :
1. Les gains moyens sont **faibles** (charter schools : 50e vers 51e percentile) ou **conditionnels** (academies sponsorisées : +0,2 écart-type, pour des écoles en échec).
2. **Aucune économie** de dépense à attendre (Suède) ; l'effet apparaît après une dizaine d'années.
3. **La ségrégation augmente** quand l'admission suit les notes ou le choix (Suède) ; d'où `indice_dissimilarite` : exemple de calcul, deux écoles, 30 + 10 élèves défavorisés et 10 + 30 autres : D = 0,50.

## 4. Le supérieur (bloc D)

| Scénario | Économie (cours en ligne) | Abandons en plus | Certification indépendante | **Solde** | Coût de l'échec en L1 (référence) |
|---|---|---|---|---|---|
| Bas | 1,44 | 0,00 | 0,06 | **+1,38** | 0,87 |
| Central | 2,88 | 0,06 | 0,24 | **+2,58** | 1,04 |
| Haut | 2,40 | 0,21 | 0,72 | **+1,47** | 1,21 |

Md€ par an. Lecture : **la certification indépendante ne coûte que 0,06 à 0,72 Md€** (de 0,2 à 1,8 % du coût du supérieur, 40 Md€) ; **elle ne se finance donc pas à elle seule d'une économie**, et le solde positif vient presque entièrement de l'hypothèse que l'enseignement en ligne coûte 20 à 60 % de moins (H19, non sourcée). Le solde est donc **fragile** : l'étude de Bettinger et al. (notes et maintien en baisse) est la meilleure objection et n'est que partiellement intégrée (H20). Les bornes « bas » et « haut » ne sont pas des bornes de confiance : le central est le plus favorable parce que l'économie croît avec la part en ligne tandis que les coûts de certification et d'abandon croissent aussi.

## 5. Ce que le modèle suggère (opinion de l'auteur du modèle, pas un fait)

- **Le tuteur est un pari à tester, pas une mesure à généraliser** : l'essai le plus négatif (Bastani) et le plus positif (Nigeria) portent sur le même type d'outil. Une expérimentation dans quelques académies, avec groupe témoin, effets par origine sociale et mesure des écrans (usage récréatif), précède toute généralisation.
- **L'humain est le coût et la valeur.** Si les accompagnateurs sont supprimés pour « économiser », le coût tombe à 15-135 € par élève, mais le modèle perd ce qui le distingue du simple « chatbot sans garde-fous ».
- **Choix des établissements** : ne pas l'ouvrir sans publier l'indice de mixité.
- **Supérieur** : « certifier exigeant » coûte peu ; le risque est ailleurs (abandon, valeur du diplôme, fraude par IA aux épreuves non surveillées).

## 6. Contre le biais pro-technologie : ce que disent les études

1. **Un seul résultat majeur est en faveur du tuteur dans un contexte comparable à la France** : aucun. Le Nigeria (niveau de départ bas, encadrement) et Harvard (étudiants d'élite) ne ressemblent pas à un collège français.
2. **La seule étude de grande taille d'un chatbot sans garde-fous trouve un effet négatif sur l'examen.** La conception pédagogique fait la différence ; elle est coûteuse et rare.
3. **Les corrélations PISA sur les écrans pointent vers l'usage borné**, pas vers l'autonomie sur ordinateur sans cadre.
4. **Les inégalités d'accès et d'usage** (famille, motivation) sont la première objection ; le modèle ne les chiffre pas (limite § 6 de la méthode).
5. **Le rôle de l'enseignant** : l'auteur défend le lien humain mais propose des accompagnateurs plutôt que des professeurs ; ce choix est à clarifier, car les meilleurs résultats du tutorat humain sont avec des enseignants (méta-analyse de Nickow et al.).

## 7. À faire

- Lire les sources primaires (DEPP RERS 2026, OCDE « Regards sur l'éducation » 2025, rapports PISA et TIMSS, articles cités) : V6180 à V6219.
- Affiner le « reste non expliqué » de 34 Md€ (effectif étudiant réel, apprentis).
- Données de ségrégation scolaire françaises (indices sociaux des collèges, DEPP).
- Chiffrer le chèque éducation et la capacité d'accueil de l'université ouverte.
- Faire valider les arbitrages par l'auteur : accompagnateurs, usage du potentiel de redéploiement, choix des établissements.
