---
titre: Les vraies économies de fonctionnement de l'État, organisme par organisme (T66)
date: 2026-11-06
statut: brouillon sourcé ; ordres de grandeur sous hypothèses, jamais des prédictions ; couche « économies de fonctionnement » du bilan ajoutée (niveau 1 seulement, non adoptée) ; vérifications V18500 à V18511 ; données dans `economies-fonctionnement.csv`, code dans `modeles/grand-livre/code/economies_fonctionnement.py`
---

# Les vraies économies de fonctionnement de l'État

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026. **Demande** : trouver, organisme par organisme, les économies de fonctionnement réelles, pour réduire l'effort demandé aux cadres et aux héritiers.

**Mon risque ici : la complaisance.** La demande vise à alléger l'effort ; une liste de 20 lignes donne envie d'écrire « on trouve 5 Md€ ». Ce que je trouve est plus petit, et je le dis en tête.

## 1. Résultat en dix lignes

1. **Niveau 1 (chiffré, sourcé, prêt pour le bilan) : 0,445 / 0,447 / 0,453 Md€ par an.** C'est SOLIDEO (0,368), le comité d'organisation de Paris 2024 (0,075) et 22 commissions dormantes (0,004). Presque tout est la fin des Jeux de 2024 : **une normalisation de la base, pas une décision du système**.
2. **Niveau 2 (plausible, ordre de grandeur) : 0,9 / 4,9 / 11,0 Md€ en brut ; 1,9 Md€ au central une fois retirés les recouvrements identifiés.** Il ne se compte pas encore : aucune de ces lignes n'a de rendement mesuré (coefficients de Claude) et plusieurs recoupent M1m ou D16.
3. **Niveau 3 (idées sans chiffre) : 0 Md€ compté.** Audiovisuel public, trésorerie des opérateurs (un stock, pas un flux), déplacements professionnels, chambres consulaires, paie, GIP.
4. **Le gros des économies de fonctionnement est déjà dans le bilan**, sous d'autres noms : non-remplacement de 163 000 postes (M1m, 7,0), point d'indice (M2m, 3,75), 1 607 heures (M3), éducation (D20, 3,9), collectivités (D23, 4,5 ; D24, 3,5), gestion de la collecte et des prestations (D18, 3,8), formation (C24), agences (D16, 0,54). **Les 49 000 ETP publics rendus inutiles (DGFiP 16 300, prestations 25 100, Urssaf 5 200, douane 1 400, autres 1 000) sont le contenu de D18 : ne pas les recompter.**
5. **Les fusions d'organismes ne rapportent presque rien de plus** : les 0,54 Md€ de D16 sont, au chiffre près, la baisse de 20 % des fonctions support des opérateurs (2,7 Md€) du rapport du Sénat n° 807 ; les fusions de 2015 à 2019 n'ont retiré que 0,8 % des emplois (Cour des comptes, via ce rapport) ; la rapporteure dit qu'on ne trouvera pas de milliards sans arrêter des politiques (⚠️ V18503 : je n'ai pas relu D16 ligne à ligne, l'identité des deux chiffres est probable, pas prouvée).
6. **Effet sur le manque** (macro de référence, combinaison R1f + M1m + M2m + M3) : **52,13 → 51,69 Md€**, soit −0,45. Rien ne change à l'ordre de grandeur : il manque encore ≈ 52 Md€.
7. **Effet sur les cadres** (réglage JR rejoué : fonction des revenus rééquilibrée pour une dette stable) : cadre à 10 000 € brut **−622 → −615 € par mois** (−9,98 % → −9,88 %). Avec 2 Md€ d'économies de plus : −592 (−9,5 %) ; avec 5 Md€ : −548 (−8,8 %). **Il faut ≈ 1 Md€ pour gagner 15 € par mois à ce cadre.**
8. **Ce que la demande de l'auteur suppose et que les chiffres ne soutiennent pas** : que l'État a de grosses économies de fonctionnement cachées dans ses organismes. Les 2 776 organismes du grand livre ont des structures qui coûtent peu (dont 316 commissions pour 0,05 Md€ réels) ; l'argent est dans les flux qu'ils redistribuent et dans la masse salariale, déjà traités.
9. **La seule grosse ligne de niveau 2 est l'informatique de l'État-plateforme (2,1 Md€ central)** : c'est aussi la plus fragile (modèle de Claude, transition de ≈ 28 Md€ sur dix ans, dépassements ×2 à ×5 dans les grands projets). Je ne la compte pas.
10. **Rien ici ne touche la défense** (exclue des économies, arbitrage 40) ni les personnes (« ne perdre personne » : aucun licenciement supposé, tout passe par le non-remplacement).

## 2. Ce qui est déjà compté (et que je ne recompte pas)

| Poste déjà au bilan | Md€ | Ce que je ne chiffre donc pas |
|---|---|---|
| D18 gestion de la collecte et des prestations | −3,80 net | DGFiP particuliers, Urssaf, MSA et Agirc-Arrco comme collecteurs, CAF, France Travail (part indemnisation) ; les 49 000 ETP ; la collecte unique ; la fin des niches (gestion) ; la Sécu à 100 % (BT06 compte même un coût de gestion en plus : +1,15) |
| D16 agences et SNU | −0,7 | fonctions support des opérateurs (−20 % de 2,7 Md€), donc les fusions d'opérateurs (ANFr/ARCEP, IRSN/ASNR, FranceAgriMer/ASP, 14 petits établissements vers l'OFB, etc.) |
| D19 effectifs et IA | −0,1 | l'IA dans les administrations |
| D20 éducation | −3,9 | 109 138 postes |
| D23, D24 collectivités | −4,5, −3,5 | effectifs, 1 607 h, achats des collectivités (IGF : 51,3 Md€ d'achats) |
| M1m, M2m, M3 (combinaison du manque) | 7,0 + 3,75 + 0,8 à 1,3 | non-remplacement d'un départ sur quatre sur 2,95 M d'agents, point d'indice, temps de travail |
| C24 / BT12 formation | −2,33 | OPCO, France compétences, 49 fonds et opérateurs de formation |
| D13 SFT | compté | supplément familial de traitement |
| BT07 | +2,96 | complémentaire santé solidaire |
| P06 | −46,3 de recettes | impôts de production : leurs coûts de gestion sont dans D18 |

## 3. Niveau 1 : prêt pour le bilan

| N° | Organisme ou poste | Ligne du grand livre | Bas / central / haut (Md€) | Délai | ETP | Nature | Source, cote | Recouvrement |
|---|---|---|---|---|---|---|---|---|
| EF01 | SOLIDEO | INS-OP-177 ; GL-ODAC-099 (par différence) | 0,368 / 0,368 / 0,368 | année 1 | 33 | fin d'un dispositif (base 2024) | jaune « Opérateurs de l'État » PLF 2025, budget initial 2024 (copie CFDT-UFETAM), **A** | aucun |
| EF02 | Comité d'organisation Paris 2024 | INS-ASSO-030 ; interventions des programmes 102, 185, 209, 219, 350 | 0,075 / 0,075 / 0,075 | année 1 | 0 | fin d'un dispositif | même jaune, subventions 2023, **A** | aucun |
| EF03 | 22 commissions consultatives dormantes ou rendues inutiles | INS-COM-002, 050, 064, 067, 070, 085, 106, 142, 145, 149, 158, 185, 196, 197, 199, 259, 288, 295… | 0,002 / 0,0035 / 0,010 | année 1 | 0 | suppression de structures | Sénat n° 807 (2025) : coût réel 50 M€ pour 317 commissions, **B** | aucun |
| | **Total niveau 1** | | **0,445 / 0,447 / 0,453** | | 33 | | | |

**Fait / estimation / opinion.** Faits : les budgets 2024 (jaune) ; estimation : le coût réel des commissions (50 M€, estimation du rapporteur du Sénat) et la proportion 22/316 ; opinion : que SOLIDEO et le COJO « économisent » quelque chose. Sans honnêteté sur ce point, EF01 et EF02 sont un cadeau : la dépense de 2024 ne serait pas revenue en 2030 avec ou sans nous. Ils réduisent le manque parce que le bilan part de 2024, pas parce que le système serait plus efficace.

## 4. Niveau 2 : plausible, ordre de grandeur (non compté)

| N° | Organisme ou poste | Bas / central / haut | Net de recouvrement (central) | Délai | Nature | Source, cote | Recouvrement avec le bilan |
|---|---|---|---|---|---|---|---|
| EF12 | Informatique de l'État-plateforme | 0,10 / 2,12 / 5,34 | 0,10 | 5-10 ans | mutualisation (informatique) | `economies-gestion-simplification.md` L3 ; Cour 2024 (rec. 11), **C** | D18 (0,1-0,3) ; transition de 28 Md€ non comptée |
| EF10 | Achats de l'État et de ses opérateurs (≈ 49 Md€) | 0,5 / 0,8 / 2,0 | 0,39 | 2-5 ans | mutualisation (achats) | Cour, achats de l'État (déc. 2024, p. 19), **B** pour la base, **C** pour le rendement | D16 (opérateurs) : on ne garde que les ministères |
| EF11 | Immobilier de bureaux (−25 % de surface) | 0,14 / 0,66 / 0,91 | 0,33 | 5-10 ans | mutualisation (immobilier) | Cour, politique immobilière (déc. 2023, p. 84-85), **A/B** | M1m (moins d'agents = moins de bureaux) |
| EF15 | Régimes de retraite : paiement des pensions unifié | 0 / 0,5 / 1,0 | 0,25 | 5-10 ans | fusion | iFRAP (secondaire), **C** | D18 (collecte des caisses) |
| EF13 | Cabinets de conseil (1,07 Md€ en 2021) | 0,2 / 0,4 / 0,6 | 0,40 | 1-2 ans | mutualisation (achats) | Sénat, mars 2022, **A** (base), **C** | EF10 |
| EF14 | Assemblée nationale et législatives (position du 06/11, à confirmer) | 0,10 / 0,20 / 0,31 | 0,20 | 2-4 ans | suppression rendue possible par le système | `chiffrage-regroupements-organismes.md` P-010, **B/C** | aucun ; **révision constitutionnelle** |
| EF18 | Élus municipaux (1,05 Md€ d'indemnités) | 0 / 0,105 / 0,26 | 0,105 | 2 ans | suppression de structures | P-040, **C** | aucun ; la loi de décembre 2025 relève les plafonds |
| EF16 | Éco-organismes : frais de gestion | 0 / 0,07 / 0,13 | 0,07 | 3-5 ans | fusion | Refashion, Sénat n° 11, **B** | aucun |
| EF17 | Systèmes d'information des mairies | −0,18 / 0,06 / 0,30 | 0,06 | 5 ans | mutualisation (informatique) | P-039, **C** | D23 |
| EF19 | CNIL ; ANSSI + DINUM + beta.gouv | −0,002 / 0,006 / 0,017 | 0,006 | 2-3 ans | mutualisation | P-055, P-035, **C** | D16 |
| EF20 | Fusions d'opérateurs au-delà des fonctions support | 0 / 0 / 0,11 | 0 | 3-5 ans | fusion | Sénat n° 807 ; Cour (−0,8 % d'emplois), **B** | D16 couvre le gain mesuré |
| | **Total niveau 2** | **0,86 / 4,92 / 10,98** | **1,91** | | | | |

Pour mémoire, **hors fonctionnement** (reprises de `economies-10-milliards.md` P5, non comptées) : France Travail, dispositifs d'emploi (IGF-IGAS, avril 2024) 0,39 / 0,61 / 1,03 (mais en moindre hausse par rapport à une trajectoire qui baisse déjà de 4,5 % : pas une baisse par rapport à 2024) ; Pass Culture 0,03 / 0,04 / 0,10 ; compléments outre-mer 0 / 0,3 / 0,5.

## 5. Niveau 3 : idées sans chiffre (0 compté)

| N° | Idée | Pourquoi pas de chiffre |
|---|---|---|
| EF30 | Audiovisuel public : holding, support mutualisé (3,2 Md€ d'avances) | la Cour dit « économies d'échelle limitées dans un premier temps » ; le rapport parlementaire Alloncle évoque ≈ 1 Md€, non lu ; V18510 |
| EF31 | Trésorerie des opérateurs (56,6 Md€ fin 2022, IGF) | un stock, pas un flux : il joue sur la dette, pas sur le solde ; source secondaire ; V18511 |
| EF32 | Déplacements professionnels (≈ 1,4 Md€ par an) | mission d'inspection de février 2026, sans résultat |
| EF33 | Chambres consulaires (218 lignes) | la Cour (2021, 2025) note l'absence de gains d'efficience des fusions ; côté recette, voir BT14 |
| EF34 | Opérateur unique de paie, parc automobile, communication, études, 755 GIP | aucune source ; le précédent de l'ONP incite à la prudence |
| EF35 | Fusion des niveaux de collectivités | Cour 2019 et 2024, IPP 2021 : aucun gain établi (donc 0) |
| EF36 | Sénat remplacé aussi (0,06 / 0,12 / 0,17) | position non tranchée : hors totaux |

## 6. Ce qui peut s'additionner au bilan, et quand

- **Maintenant** : le niveau 1, **+0,447 Md€** (couche EF01-EF03, déjà dans `bilan_global.py`, non adoptée).
- **Après arbitrage, sans double compte** : au maximum **1,9 Md€** de niveau 2 net de recouvrement, à condition que l'auteur (a) confirme EF14 (constitution), (b) fasse mesurer EF10 et EF12 (un essai) avant de les écrire au solde. **Je ne recommande pas d'ajouter le niveau 2 au solde avant ces mesures.**
- **Jamais** : les 49 000 ETP et la collecte unique (D18), les fusions d'opérateurs au-delà de D16, la formation (C24), les OPCO.

**Calendrier de montée en charge (central, Md€)** : année 1 : 0,45 (niveau 1 acquis dès la dissolution des deux structures olympiques) ; année 3 : ≈ 0,45 + 0,5 (conseil, commissions, élus, éco-organismes) ; année 5 : ≈ 0,45 + 1,2 ; année 10 : ≈ 0,45 + 1,9 (niveau 2 net). Les années 3 à 10 sont une hypothèse de calendrier, pas un calcul.

## 7. Effet sur le manque et sur les cadres

| | Sans la couche | Avec le niveau 1 (+0,447) | Avec 2 Md€ (illustration) | Avec 5 Md€ (illustration) |
|---|---|---|---|---|
| Manque de la base, macro de référence | 52,13 | 51,69 | | |
| Manque, macro prudente | 81,11 | 80,66 | | |
| Fonction des revenus : a (jeu JR) | 0,6857 | 0,6852 | 0,6834 | 0,6799 |
| Cadre à 10 000 € brut, €/mois | −622 (−9,98 %) | **−615 (−9,88 %)** | −592 (−9,5 %) | −548 (−8,8 %) |

Méthode : `modeles/systeme-ideal/transmissions_0611.js` rejoué par jsc avec la fonction du patrimoine à 2,28 + E ; la fonction des revenus est recalée pour une dette stable en macro de référence (les cas types sont ceux d'OpenFisca, revenu net santé). Les colonnes à 2 et 5 Md€ sont des illustrations de sensibilité, pas des économies trouvées. **Conclusion : les économies de fonctionnement n'allègent pas l'effort des cadres de manière sensible (≈ 1 point de taux de la fonction des revenus coûte 10 Md€).**

## 8. Meilleure objection et réponse (règle 5)

**Objection** : « L'État compte 2 776 organismes et 1 169 structures nationales selon la direction du Budget ; il y a forcément 5 à 10 Md€ de gras. » Le gouvernement a annoncé 2 à 3 Md€ sur les agences. **Réponse** : le Sénat a demandé à la ministre comment elle calculait ce chiffre ; elle n'a pas pu le dire. Le Sénat trouve 0,54 Md€ sur les fonctions support et 0,01 sur les commissions ; au-delà, c'est arrêter des politiques (8 % de 27,5 Md€ = 2,2 Md€ « pas à missions constantes »). Les constructions de ce dossier suivent les mêmes bases : **les 2,2 Md€ ne sont pas du fonctionnement, ce sont des missions**. Autre objection : « les Jeux, ce n'est pas de l'économie ». Exact : voir § 3.

**Contraintes juridiques nommées** : libre administration des collectivités (art. 72 de la Constitution) pour EF17 et EF18 ; article 24 pour EF14 ; RGPD art. 51-52 pour la CNIL (EF19) ; droits acquis des régimes de retraite (EF15).

## 9. État de la recherche (règle 9)

- **Établi** : les fusions d'agences et d'opérateurs produisent peu d'économies budgétaires (0,8 % d'emplois en 2015-2019 ; Cour des comptes via Sénat 2025 ; chambres d'agriculture, Cour 2025 : « absence de gains d'efficience ») ; les gains de mutualisation des achats sont mesurés par rapport à un prix de référence, pas à la dépense (note T47).
- **Débattu** : le potentiel de l'informatique mutualisée (la Cour déplore qu'on ne puisse pas consolider les dépenses numériques de l'État) ; l'ampleur des fonctions support (15 à 20 % des effectifs des gros opérateurs, selon un audit cité).
- **Manque** : aucune mesure du coût complet des 1 169 structures ; pas de revue de dépenses 2025-2026 de l'IGF sur l'État lue (je n'ai trouvé que les revues sur les collectivités de 2024) ; frais de gestion des régimes de retraite (primaire).

## 10. Ce que je ne sais pas

La recherche en ligne a été faite en quatre passes ; aucun PDF de la Cour 2025 sur les chambres, ni de l'IGF 2025, n'a été ouvert. Les chiffres du Sénat n° 807 viennent des pages web du rapport (extraits lus le 06/11/2026), pas du PDF complet. L'identité 0,54 de D16 = 0,54 du Sénat (support) est à vérifier (V18503). Je ne suis pas sûr que SOLIDEO soit comptée dans les 142,6 Md€ de l'ODAC du grand livre (« par différence », GL-ODAC-099).

## Vérifications ouvertes (V18500 à V18511)

- **V18500** : SOLIDEO : dissolution actée, budget 2024 (0,3683 de charges initiales, part publique 18 %) comparé à la dépense réellement comptée dans les 142,6 Md€ de l'ODAC. Statut : à vérifier.
- **V18501** : COJO : la subvention de 0,075 est celle de 2023 ; montant de 2024 non lu. Statut : à vérifier.
- **V18502** : commissions : coût réel de 50 M€ (estimation du rapporteur) ; liste des 22 à confirmer (« dormante » = 0 réunion 2022-2024). Statut : à vérifier.
- **V18503** : D16 (0,54, « Sénat 2025 ») est-il bien la baisse de 20 % des fonctions support (2,7 Md€) ? Et les fusions d'opérateurs de `instances.csv` sont-elles incluses ? Statut : à vérifier.
- **V18504** : achats de l'État : aucun rendement mesuré ; les gains publiés par la direction des achats de l'État sont à lire. Statut : à faire.
- **V18505** : immobilier : le gain net de la rénovation (2,4 Md€ par an à trouver, Cour) peut annuler l'économie. Statut : à vérifier.
- **V18506** : informatique de l'État-plateforme : essai à beta.gouv.fr non fait ; recouvrement avec D18. Statut : à vérifier.
- **V18507** : cabinets de conseil : base de 2021, avant la circulaire de 2022. Statut : à vérifier.
- **V18508** : Assemblée nationale : décomposition des 348,8 M€ de charges parlementaires non lue ; financement des partis. Statut : à vérifier.
- **V18509** : frais de gestion des régimes de retraite : source primaire (DREES) à lire. Statut : à faire.
- **V18510** : audiovisuel public : rapport Alloncle à lire. Statut : à faire.
- **V18511** : trésorerie des opérateurs (56,6 Md€, IGF) : étude à retrouver. Statut : à faire.

## Sources mobilisées

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts |
|---|---|---|---|
| [Sénat, rapport n° 807 (2024-2025), agences, opérateurs et organismes consultatifs](https://www.senat.fr/rap/r24-807-1/r24-807-15.html), consulté le 06/11/2026 | 540 M€ sur les fonctions support (base 2,7 Md€), 10 M€ sur les commissions, 2,2 Md€ non à missions constantes, fusions 2015-2019 : −0,8 % d'emplois | B | rapporteure d'un groupe d'opposition à l'époque ; estimations du rapporteur |
| [Sénat, même rapport, § C](https://www.senat.fr/rap/r24-807-1/r24-807-122.html) | bases (14 Md€ de personnel, 13,2 Md€ de fonctionnement), annonce gouvernementale de 2 à 3 Md€ non étayée | B | idem |
| `modeles/grand-livre/instances.csv` et `jaune2025_bi2024_operateurs.csv` (jaune « Opérateurs de l'État » PLF 2025) | budgets, effectifs et sorts des organismes | A | aucun connu |
| Cour des comptes, [politique immobilière de l'État](https://www.ccomptes.fr/sites/default/files/2023-12/20231207-Politique-immobiliere-Etat_0.pdf) (2023) et [achats de l'État](https://www.ccomptes.fr/sites/default/files/2024-12/20241206-Prise-en-compte-des-enjeux-developpement-durable-dans-achats-de-l-Etat.pdf) (2024), via `economies-10-milliards.md` | surfaces, 25,4 Md€ à 2051, achats 24 + 25 Md€ | A | aucun connu |
| `sources/chiffrage-regroupements-organismes.md`, `economies-gestion-simplification.md`, `economies-cachees-et-transition.md`, `economies-10-milliards.md` | pistes P-0xx, L3, 49 000 ETP, P5 | B/C | modèles de Claude |
| Recherche web du 06/11/2026 (Public Sénat, Acteurs publics, Terre-net, IFRAP) | contexte : annonce 2 à 3 Md€, chambres d'agriculture, IGF 2024 | C | presse et think tank, recoupées |
| `sources/calculs/bilan_global.py` (couche ECOFONC0611), `modeles/systeme-ideal/transmissions_0611.js` | effet sur le manque et les cadres | calcul | — |
