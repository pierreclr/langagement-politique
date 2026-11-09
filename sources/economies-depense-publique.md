---
titre: Économies de dépense publique faisables et sourcées, au-delà du modèle (boucle « meilleur système », chantier 3)
date: 2026-11-03
statut: brouillon sourcé ; ordres de grandeur sous hypothèses, jamais des prédictions ; à valider par l'auteur
---

# Économies de dépense publique faisables et sourcées, au-delà du modèle

Écrit par Claude (IA d'Anthropic) sur délégation de l'auteur (boucle du 03/11/2026, document de travail de l'atelier, non publié, chantier 3). Il ne décide rien. **Risque propre à cette tâche** : la complaisance. Une liste « chiffrée » donne envie de trouver de quoi boucler le déficit ; les chiffres disent le contraire (voir 0.9). Calcul reproductible : `sources/calculs/economies_depense_publique.py` (sortie : `economies_depense_publique_resultats.txt`). Ce fichier **complète** `sources/recherche-economies-depenses.md` (T47, 01/11) sans le refaire : il en reprend les gisements, **retire ce que le modèle compte déjà**, ajoute l'immobilier, l'éducation (deux variantes), les niches qui survivent au prélèvement unique, et classe le tout par solidité.

Légende. **A** : chiffrage officiel (Cour des comptes, IGF, Sénat, PLF), repris avec une décote. **B** : estimation de Claude, reproductible, sur une base officielle et un coefficient annoncé. **C** : piste non chiffrée. **[Lu]** document ouvert ; **[Résumé]** résumé de recherche web, non lu à la source ; **[Calcul]** ; **[Hypothèse]**. ⚠️ non confirmé (registre : `verifications.md`, V7450 à V7457). « Bas / central / haut » désigne l'**ampleur de l'économie** (bas = prudent), **l'inverse de la convention du modèle** (voir § 6).

---

## 0. Résumé en dix lignes

1. **Au-delà du modèle**, en régime de croisière (10 ans), Md€/an, bas / central / haut : **A (officiel) 5,8 / 11,7 / 16,1** ; **B (estimations de Claude) 1,4 / 5,1 / 13,2** ; **A + B : 7,2 / 16,8 / 29,3**. À 3 ans, central : A 5,6 ; A + B 7,6. À 1 an, central : 2,1.
2. Le central A + B (16,8) vaut **10 % du déficit du palier 1** (163,3), **1,3 point de taux plat**, **+39 €/mois de socle** : cela ne change pas la conclusion de T47 (« réserve documentée », pas un moyen de boucler).
3. **Déjà dans le modèle, donc exclu ici** : agences 0,54 et SNU 0,16 (e1), primes à l'apprentissage 4,6 (e2), CIR 3,4 ou 8,0 (e3, e4), santé 9,7, prestations remplacées 117,6, niches de l'IR et allègements de cotisations (dans les 885,9 supprimés).
4. **Correction d'un double compte de T47 et de sa lecture des niches** : T47 § 1.1 et § 6 disent que « toutes » les niches sont déjà dans le taux plat. C'est faux pour celles qui survivent : l'IS, la TVA et les accises sont conservés (H36, H171). Leurs niches (≈ 38 Md€) sont hors de l'assiette supprimée ; le modèle compte d'ailleurs le CIR (e3, e4) en supplément, ce qui confirme que T47 § 6 est à corriger. T47 comptait aussi les primes à l'apprentissage (c) : retirées ici, déjà en e2.
5. **Niches de TVA et d'accises** (recettes, pas dépenses) : 2,4 / 4,7 / 8,5 Md€, **sorties du total** : ce sont des hausses de prélèvement sur des bénéficiaires identifiés (transfert), pas des économies.
6. **Éducation** (Q10 tranchée par Claude : redéployer les 109 138 ETP vers l'accompagnement du tuteur IA) : **économie nulle**, et le tuteur coûte en plus 0,2 / 1,6 / 4,1 Md€ (licence et matériel). **Variante « économie »** (non-remplacement sans tuteur) : +2,2 / +3,9 / +5,5 Md€ à 10 ans, 1,2 à 3 ans. Le choix de l'auteur pèse donc **de 4 à 5 Md€ par an** (3,9 + 1,6 en central).
7. **Immobilier de l'État** : 0,14 / 0,66 / 1,8 Md€ si les bureaux (25,25 m² par poste, cible 16 à 18) se densifient. La cible officielle n'a jamais été atteinte depuis 2009 ; la rénovation (≈ 5,2 Md€/an, Cerema) joue en sens inverse.
8. **Les trois mesures les mieux étayées** (collectivités, achats locaux, logement social) valent ensemble 10 Md€ central ; **aucune n'est une suppression de poste ni de service massif** : ce sont des non-remplacements, des centrales d'achat, un recentrage.
9. **Aucun scénario ne ferme le déficit** (haut A + B : 18 % du déficit). Le plus gros gisement pressenti, la masse salariale par l'IA, **n'est chiffré par aucune source officielle** (rapport IGF-IGAS-IGA 2026 : gains « diffus et rarement mesurés ») : 1,1 Md€ central, 4,6 au plus.
10. **Recommandation** (à valider par l'auteur) : intégrer au modèle l'option « structurelles A » (11,7 central), garder A + B comme réserve affichée mais non comptée au solde, et ne jamais écrire « on finance par les économies de l'État ».

---

## 1. Périmètre et doubles comptes évités

| Poste | Où il est déjà | Traitement ici |
|---|---|---|
| Agences (Sénat, 0,54) et SNU (Cour, 0,16) | `options_financement.js` ECO.prudentes (H428) | **Exclus** (T47 § 3.1 : même chiffre) |
| Primes à l'apprentissage 4,6 (2,2 au PLF 2026) | ECO.volontaires | **Exclus** (T47 § 7.2 c les comptait aussi : retirés) |
| CIR 8,0 (recentré 3,4) | CIR.supprime / recentre | **Exclu** (IS conservé, le CIR reste hors de l'assiette supprimée : cohérent avec H428) |
| Santé 9,7 | `sante.js`, palier 1 | **Exclue** (renvoi, T47 § 8) |
| 117,6 Md€ de prestations remplacées, non-recours, indus (6,2 à 8,0 Md€ d'erreurs CAF) | H86, socle | **Exclus** ; non-recours et indus ne sont pas des économies (le socle supprime l'« économie » du non-recours : c'est un coût, déjà dans le socle) |
| Niches de l'IR (dont emploi à domicile 7,2, dons 2,2, garde d'enfants 1,8, heures supplémentaires 2,25) et allègements de cotisations (74,1) | dans les 885,9 supprimés | **Exclues** : un euro de niche supprimée est déjà un euro d'assiette |
| Création de valeur, levier D « simplification » (+0,5 / +3,2 / +14,1) | `recherche-creer-de-la-valeur.md` § 3.1 | **Recouvre B1** (gestion devenue inutile) : ne pas additionner les deux ⚠️ V7452 |
| Taxe foncière 42,9 et IFI 2,7 (supprimés), DMTO | H500 | Les exonérations de TFPB du logement social en dépendent : recouvrement possible avec A3, non chiffré ⚠️ |
| Revues de dépenses 2025 : 3,7 Md€ pérennes (Cour, 22/04/2026) | déjà dans la base 2025 | **Pas additionnel** : à ne pas recompter |
| PLF 2026 : suppressions de niches, solde +2,07 Md€ en 2026 (Voies et moyens T2) | déjà dans la base | idem |

---

## 2. Tableau principal (Md€/an ; régime à 10 ans bas / central / haut ; central à 3 ans et à 1 an)

| N° | Mesure | Classe | 10 ans bas / central / haut | 3 ans | 1 an |
|---|---|---|---|---|---|
| A1 | Collectivités : non-remplacement ciblé (Cour 4,1) + 1 607 h (Cour 1,3), recouvrement déduit | A | 2,2 / 4,5 / 4,9 | 1,8 | 0,3 |
| A2 | Achats des collectivités (Cour : 10 % ≈ 5) | A | 2,0 / 3,5 / 5,0 | 1,8 | 0,6 |
| A3 | Logement social (IGF : 1 à 3) | A | 1,0 / 2,0 / 3,0 | 1,0 | 0,3 |
| A4 | Sport, jeunesse, vie associative (IGF-IGESR 2025 : 1 à 3) | A | 0,5 / 1,5 / 3,0 | 0,8 | 0,3 |
| A5 | CPF : ticket modérateur (IGF 2024 : 0,19) | A | 0,1 / 0,2 / 0,2 | 0,2 | 0,1 |
| | **Total A** | | **5,8 / 11,7 / 16,1** | **5,6** | **1,6** |
| B1 | Gestion devenue inutile (prélèvement unique, socle) | B | 0,3 / 1,0 / 2,6 | 0,4 | 0,05 |
| B2 | Masse salariale d'administration (numérique, départs non remplacés) | B | 0,1 / 1,1 / 4,6 | 0,1 | 0 |
| B3 | Dépenses qui interrogent (conseil acheté, France Travail, culture, compléments outre-mer) | B | 0,5 / 1,5 / 2,7 | 0,9 | 0,3 |
| B4 | Immobilier de bureaux de l'État | B | 0,14 / 0,66 / 1,8 | 0,2 | 0,05 |
| B5 | Achats de l'État et des opérateurs | B | 0,4 / 0,8 / 1,5 | 0,4 | 0,1 |
| | **Total B** | | **1,4 / 5,1 / 13,2** | **2,0** | **0,5** |
| | **Total A + B** | | **7,2 / 16,8 / 29,3** | **7,6** | **2,1** |
| E | Éducation (variante A) : voir § 4, **non comptée** (Q10 tranchée en redéploiement) | B | (2,2 / 3,9 / 5,5) | (1,2) | (0,4) |
| R | Niches de TVA et d'accises : voir § 5, **recettes, non comptées** | B | (2,4 / 4,7 / 8,5) | | |

Les 3 ans et 1 an sont des valeurs centrales (une valeur par ligne : pas de bas ni de haut). Les arrondis sont ceux du script.

---

## 3. Fiche par mesure

Pour chaque mesure : **qui est touché** ; **obstacle juridique** ; **vraie économie ou transfert** ; **meilleure objection**.

### A1. Collectivités : effectifs et temps de travail
- **Source** : Cour des comptes, *Finances publiques locales 2024, fascicule 2* (oct. 2024) [Lu, repris de T47 § 4] : ramener les effectifs à leur niveau de 2011 (« un peu plus de 100 000 » agents, −5,5 %) par non-remplacement : 4,1 Md€/an à partir de 2030 ; alignement sur 1 607 h : 1,3 Md€/an. Bas : la moitié du scénario de la Cour ; haut : la Cour sans le recouvrement des deux leviers (0,4 déduit au central).
- **Touchés** : 2,04 millions d'agents territoriaux (aucun licenciement : départs non remplacés) ; usagers des services de proximité (écoles, petite enfance, aide sociale).
- **Obstacle** : libre administration (art. 72 de la Constitution) : l'État ne commande pas les effectifs locaux, il peut conditionner des dotations ; le temps de travail passe par le dialogue social local.
- **Nature** : vraie économie de masse salariale (hors restitution aux agents, risque de ne pas se matérialiser ; la Cour calcule en euros 2023).
- **Objection** : « ces agents tiennent la proximité ; le CNRACL se déséquilibre déjà ». **Réponse** : un non-remplacement ciblé sur les fonctions support, pas un plafond uniforme ; mais la charge de travail des services qui perdent des postes avant leurs outils est le vrai risque.

### A2. Achats des collectivités
- **Source** : Cour 2024 [Lu] : 48,9 Md€ d'achats (2023) ; objectif de 10 %, ≈ 5 Md€/an à terme, 1 Md€ en 2025 et 3 Md€ en 2027. Haut = la Cour ; central = 70 % ; bas = 40 %. DAE : gains mesurés par rapport à un prix de référence, **pas** par rapport à la dépense (T47 § 1.2).
- **Touchés** : fournisseurs locaux, PME (risque d'éviction par la massification ; allotissement).
- **Obstacle** : directive 2014/24/UE et code de la commande publique ; mutualisation facultative aujourd'hui (schémas supprimés).
- **Nature** : économie si mesurée sur la dépense réelle ; le même euro peut être un transfert depuis les marges des fournisseurs.
- **Objection** : « tout rapport promet 10 % depuis vingt ans ». **Réponse** : d'où 70 % de la cible au central et une mesure ex post sur la dépense.

### A3. Logement social
- **Source** : IGF, scénarios de 1 à 3 Md€ sur 14,8 Md€ (T47 § 7.2 a [Note]). Rapport non rouvert ici ⚠️ V7451.
- **Touchés** : bailleurs, demandeurs de logement (file d'attente), chantiers.
- **Obstacle** : loi SRU et engagements aux collectivités ; recentrage plutôt que coupe.
- **Nature** : économie de subvention ; **recouvrement possible avec la taxe foncière supprimée** (exonération de TFPB du logement social) ⚠️.
- **Objection** : la demande monte. **Réponse** : recentrer ne revient pas à supprimer ; c'est le risque de l'allongement des files.

### A4. Sport, jeunesse, vie associative
- **Source** : IGF-IGESR, mai 2025 : 1 à 3 Md€, « peu de suites » [Note]. Revue de dépenses de 27,4 Md€ de soutien public aux associations (2025, ⚠️).
- **Touchés** : associations, emplois locaux. **Obstacle** : aucun juridique ; politique (maillage local). **Nature** : économie si l'évaluation précède (règle : pas de reconduction à l'identique sans évaluation publiée).

### A5. CPF : ticket modérateur
- **Source** : IGF 2024 : 0,19 Md€ [Note]. Très petit ; gardé car chiffré officiellement.

### B1. Gestion devenue inutile
- **Base** : gestion de la branche famille 3,2 Md€ (35 226 agents), DGFiP particuliers et PME 3,69 Md€ (46 583 ETPT), Urssaf 1,85 Md€ [Note, `recherche-simplification-et-depenses-interrogeantes.md`].
- **Estimation** : on retient la fourchette prudente de T47 (0,3 / 1,0 / 2,6 à 10 ans), plus basse que `sources/cout-complet-prelevement.md` (0 / 2,6 / 5,2 d'économie budgétaire des administrations de prélèvement). Le gros du coût de la complexité (16,4 Md€ central d'économie totale) est **privé** (entreprises, ménages) : **ce n'est pas une économie du budget** et elle n'est pas comptée ici (`modeles/industrie-complexite/resultats.md` : 25 / 41 / 57 Md€ de coût total).
- **Touchés** : jusqu'à 20 000 à 40 000 postes CNAF et DGFiP (étalés sur les départs), reconversion vers contrôle et accompagnement.
- **Obstacle** : le système d'information doit exister d'abord (grands projets du public : dérive de 30 % en moyenne, Cour 2020 [Note]). **Nature** : vraie économie de gestion, mais **recouvrement avec le levier D de la création de valeur** (voir § 1). **Objection** : la collecte française est déjà bon marché (0,54 € pour 100 € à la DGFiP). **Réponse** : exact ; l'économie vient de la gestion des **prestations supprimées**.

### B2. Masse salariale d'administration
- **Base** : T47 § 2 : vivier d'un agent sur sept (466 000), 2,3 % de départs par an (DGAFP : 136 700 pensions en 2024), 41 à 50 k€ par poste. 0,1 / 1,1 / 4,6 Md€ ; plafond physique 7,9 Md€. **Aucune source officielle ne chiffre l'économie de l'IA** (IGF-IGAS-IGA, avril 2026 [Lu]). Biais pro-technologie du projet : ne jamais écrire « l'IA supprime x postes » avant mesure.
- **Obstacle** : statut de la fonction publique (pas de licenciement, donc départs seulement). **Nature** : économie nette de la restitution aux agents (jusqu'à 63 % en 2009-2011 pour la RGPP, Sénat 2012 [Lu, T47]).

### B3. Dépenses qui interrogent
- **Base** : conseil acheté par l'État ≈ 1 Md€ (2021), dispositifs emploi de France Travail 7,8 Md€ (IGF-IGAS 2024), culture (Pass Culture 0,244), compléments de rémunération outre-mer 1,5 Md€ [Note]. T47 § 7.2 d à g : **le coefficient (3 à 40 % de la base) est une hypothèse de Claude**, pas une source ⚠️ V7453. La part chiffrée par une source officielle (a, b, CPF) est en A.
- **Touchés** : cabinets de conseil, publics éloignés de l'emploi, territoires ultramarins (sensible). **Nature** : économie ou recentrage ; les compléments outre-mer sont un revenu pour des agents (transfert).

### B4. Immobilier de bureaux de l'État (nouveau)
- **Faits** [Lu : Sénat, *L'essentiel* PPL n° 319, commission des finances, 03/06/2026, qui cite le DPT et la Cour de décembre 2023] : patrimoine de 96,7 M m² de surface utile brute au 31/12/2024, dont **23,1 M m² de bureaux**, 18,5 de logements, 20,2 d'enseignement ; **25,25 m² par poste de travail en 2024** (24,57 en 2019) contre 12 m² (circulaire de 2009, jamais respectée) puis **cible de 16 m² et plafond de 18** (circulaire de 2023) ; cessions en baisse (1 044 biens en 2014, 549 en 2023) ; trois quarts des 1 636 biens déclarés inutiles fin 2022 sont difficiles ou improbables à céder ; travaux de planification écologique 140 à 150 Md€ à l'horizon 2050 (Cerema : ≈ 5,2 Md€/an) ; 13 804 ETPT dédiés à l'immobilier de l'État ; foncière de l'État (EPIC) votée à l'Assemblée (28/01/2026), adoptée en commission au Sénat (03/06/2026).
- **Estimation [Calcul]** : surface libérable = 23,1 M m² × (1 − ratio visé / 25,25). Bas : ratio 21, 30 % réellement libéré, 120 €/m²/an ; central : ratio 18 (6,6 M m² libérables), 50 %, 200 €/m² ; haut : ratio 16, 70 %, 300 €/m². Résultat : 0,14 / 0,66 / 1,8 Md€. **Les coûts au m² sont des hypothèses de Claude** (seul repère : plafond de loyer de 400 €/m²/an à Paris, ministre, [Résumé]) ⚠️ V7454. **Cession** : un capital, pas une économie récurrente ; non compté. Objectif ministériel de 1 Md€/an à terme [Résumé] : cohérent avec le haut.
- **Touchés** : agents (télétravail, bureaux partagés), promoteurs locaux. **Obstacle** : domaine public (inaliénabilité), fiscalité locale à neutraliser pour la foncière (PPL). **Nature** : vraie économie de loyers et de charges **si** les m² sont rendus ou loués ; **contre-pression** : le « mur d'investissement » de rénovation (≈ 5,2 Md€/an) peut absorber l'économie, non netté ici.
- **Objection** : la cible est inatteinte depuis 2009. **Réponse** : c'est pourquoi le central ne retient que 50 % de la surface libérable.

### B5. Achats de l'État et des opérateurs
- T47 § 5 : 2 à 6 % de ≈ 25 Md€ d'achats de l'État à 10 ans (gains DAE mesurés : 0,36 à 0,41 Md€/an par rapport à un prix de référence). Hôpitaux de santé exclus (comptés dans la santé).

---

## 4. Éducation : deux variantes (Q10)

Base : `modeles/education/resultats.md` (03/11/2026) : 756 000 ETP d'enseignants en établissement ; **la démographie libère 109 138 ETP** à encadrement constant (−1,7 M élèves en dix ans, ⚠️ résumé) ; 11,78 M élèves ; tuteur central 485 €/élève (licence 60, matériel 75, accompagnateur 350), bas 15, haut 1 050 [hypothèses non sourcées du modèle]. Coût d'un ETP hors CAS Pensions : 41 / 45 / 50 k€ [Hypothèse : repère de 41 k€ de la Cour pour la territoriale, T47 ; le coût moyen d'un enseignant n'a pas été relu ⚠️ V7455] (la cotisation au CAS Pensions paie les pensions déjà dues : ce n'est pas une économie pour l'ensemble des administrations).

| | Bas | Central | Haut |
|---|---|---|---|
| **Variante A (économie)**, part des 109 138 ETP réellement économisée | 50 % | 80 % | 100 % |
| Économie à 10 ans (Md€/an) | **2,2** | **3,9** | **5,5** |
| à 3 ans (30 % du régime : baisse linéaire des effectifs) / à 1 an | | 1,2 / 0,4 | |
| **Variante B (Q10 tranchée : redéploiement vers le tuteur IA)** : économie | **0** | **0** | **0** |
| Coût du tuteur non couvert (licence + matériel, Md€/an) | −0,2 | **−1,6** | −4,1 |
| Coût de l'accompagnement (Md€/an) | 0 | 4,1 | 8,2 |
| ETP libérés valent (Md€/an) | 4,5 | 4,9 | 5,5 |
| Accompagnement couvert par les ETP libérés | oui | oui (4,1 < 4,9) | non (8,2 > 5,5 : 67 %) |

Lecture. (1) Variante B : le budget ne gagne rien, le tuteur coûte 1,6 Md€ en plus (central) **si les ETP financent les accompagnateurs** ; sans redéploiement, le même tuteur coûterait 5,7 Md€. (2) Variante A : +3,9 Md€ central, mais **sans tuteur** ni classes réduites ; le ratio élèves par ETP passerait de 15,6 à 16,6 (modèle). (3) **L'écart entre les deux choix est de 5,5 Md€ en central (3,9 + 1,6)**, soit 0,43 point de taux plat. (4) Un non-remplacement de 109 138 ETP absorbe 4,8 ans de départs à 3 %/an (22 700 par an sur 756 000) : faisable sans licenciement, **mais** la baisse démographique n'est pas uniforme (rural, premier degré). **Obstacle juridique** : statut des enseignants (pas de licenciement), carte scolaire. **Objection** : « 15,6 élèves par ETP ne dit rien de la taille des classes ». **Réponse** : exact ; ce ratio n'est qu'un ordre de grandeur.

---

## 5. Niches qui survivent au prélèvement unique (recettes, non comptées)

**Constat [Lu : Voies et moyens, tome 2, PLF 2026, p. 16]** : dépenses fiscales 2026 : 88,3 Md€ (465 dispositifs), dont IR 41,3 ; IR ou IS 14,4 (dont CIR 8,0) ; IS 3,7 ; TVA 12,4 ; accises énergétiques 5,8 + 1,1 + 0,6 ; droits d'enregistrement 4,5 ; autres 2,7. Les niches de l'IR et des droits de mutation sont dans l'assiette supprimée ; **celles de l'IS (18,1 avec la ligne IR-IS), de la TVA (12,4) et des accises (7,5) subsistent** : ≈ 38 Md€ hors du taux plat. Le CIR est traité par e3 et e4.

| Niche | Coût 2026 | Retenu bas / central / haut | Nature |
|---|---|---|---|
| Accises : gazole agricole et forestier 1,69, outre-mer 1,47, poids lourds 1,18, gazole non routier, taxis, électricité et gaz (total 7,5) | 7,5 | 1,5 / 3,0 / 4,9 (20 / 40 / 65 %) | **Transfert** : agriculteurs, transporteurs, outre-mer, particuliers (carburants). Cohérent avec « pollueur-payeur » de l'auteur |
| TVA 10 % restauration 2,28 ; TVA 10 % travaux 2,47 | 4,7 | 0,9 / 1,7 / 3,6 (décote de 25 % pour les réactions ; bas : moitié de la restauration) | **Transfert** : consommateurs et restaurateurs |
| **Total R** | 12,2 | **2,4 / 4,7 / 8,5** | |

- **Obstacle juridique** : directive TVA 2006/112/CE (les taux réduits sont une faculté encadrée, annexe III : relever est permis) ; directive accises sur l'énergie 2003/96/CE ; outre-mer : art. 73 de la Constitution et régimes de l'article 349 TFUE (adaptation).
- **Efficacité évaluée** : la restauration (mesure de 2009 puis 2012) est un cas classique de faible efficience emploi ([Résumé], évaluations non relues ⚠️ V7456) ; la Cour dit que 13 % des dépenses fiscales n'ont pas de coût connu et 42 % pas de nombre de bénéficiaires connu (22/04/2026, [Note]). Dépenses fiscales **défavorables à l'environnement** : chiffres du budget vert non relus ⚠️ V7457.
- **Pourquoi hors total** : une hausse de prélèvement n'est pas une économie ; elle se compare au taux plat (12,7 Md€ par point au taux de 35 % du palier 1 d'origine ; 10,8 Md€ à 40,7 %, taux de la v5, valeur à citer). Elle est présentée ici car « calibrer plutôt qu'interdire » en fait une option naturelle. **Contradiction à nommer** : l'auteur veut un prélèvement simple et lisible ; garder la TVA et ses niches est l'inverse. Sinon : supprimer les niches de TVA et d'accises *et* acter qu'elles ne sont pas dans le palier 1.
- Autres niches de l'IS (C) : IP Box 1,26, taxe au tonnage 0,62, mécénat des entreprises 1,73 (`subventions.csv`) : efficacité non évaluée ici, **non chiffrées**.

---

## 6. Pistes non chiffrées (C), ce qui n'est pas dans le total

| Piste | Base | Pourquoi pas de chiffre | Sens |
|---|---|---|---|
| **Aides budgétaires aux entreprises** hors niches | 44,1 Md€ en 2022 dont 12,4 énergie de crise (`subventions.csv`) ; France 2030 54 Md€ sur 2021-2030 ; Sénat (rapport 808, 2025) : 211 Md€ « sens large », 108 « sens strict », Haut-Commissariat 111,9 [Résumé] | Le Sénat dit ne pas pouvoir mesurer précisément ce qui va aux grandes entreprises et ne propose **aucune économie chiffrée** ; ordre de grandeur illustratif non compté : 10 % des aides non énergétiques ≈ 3 Md€ ⚠️ | Transfert (entreprises) ; vraie économie seulement si évaluée inefficace |
| **Fusion des niveaux** (communes, EPCI, départements, régions) | 34 935 communes, 1 254 EPCI, 101 départements, 18 régions | Cour (2019, 2024) et IPP (2021) : **aucun gain d'efficience** après la fusion des régions, hausse de coûts ; communes nouvelles : dépenses d'abord plus élevées | **0** : argument de lisibilité, pas de budget. Les doublons de compétences, eux, sont constatés mais **jamais chiffrés** |
| **Fusion des caisses** (retraite, chômage, etc.) | Cnav 1,73 Md€ de gestion (0,9 % des prestations), Unédic 0,16 ; nombre de régimes (« 42 ») ⚠️ | Aucun coût total de gestion des régimes publié ; chiffres iFRAP non neutres | Vraie économie, petite : 0,3 à 0,6 Md€ évocation non comptée ⚠️ |
| **Opérateurs : réduire les missions** | Fonctionnement ≈ 27 Md€, 8 % = 2,2 Md€ (Sénat 807) | « Ne pourrait être à missions constantes » : c'est une réduction de politiques, pas de structures | Dépend du périmètre voulu |
| **Coût de la cotutelle** (63 opérateurs à cotutelle absente du jaune) | `GRAPHE.md` | Aucun coût | Plaide pour une seule tutelle |
| **Fraude sociale et fiscale** | Fraude famille estimée 3,8 à 4,7 Md€, détectée 0,5 | C'est une recette ou un indu, pas une économie de dépense ; déjà dans les prestations remplacées | Hors périmètre |
| **Autoroutes** (dividendes 4,4 Md€ en 2024) | `commande_publique.csv` | Recette de fin de concession, pas une dépense | Hors périmètre |
| **Retraites, défense, dette, enseignement hors démographie** | | Hors périmètre de T47 et de cette note | |

---

## 7. Ce que cela change pour le palier 1

Conversion : un point de taux plat = 12,7 Md€ à 35 % (palier 1 d'origine), 10,8 Md€ à 40,7 % (v5 : valeur à citer, RO § 15.2) ; un euro de socle par mois = 0,430 Md€ par an.

| | Bas (7,2) | Central (16,8) | Haut (29,3) |
|---|---|---|---|
| Solde du palier 1, central du modèle (−163,3) | −156,1 | −146,5 | −134,0 |
| Équivalent en taux plat | 0,6 pt | 1,3 pt | 2,3 pt |
| Équivalent en socle | +17 € | +39 € | +68 € |
| En % du déficit du palier 1 | 4 % | 10 % | 18 % |
| A seul (5,8 / 11,7 / 16,1) : solde | −157,5 | −151,6 | −147,2 |

Convention du modèle (§ 6 de T47) : l'économie « haute » va avec le scénario « bas » du modèle, favorable. L'ordre `[favorable, central, défavorable]` est donc `[29,3 ; 16,8 ; 7,2]` pour A + B et `[16,1 ; 11,7 ; 5,8]` pour A seul.

**Cumul avec T47** : T47 donnait 17,5 Md€ central à 10 ans ; ici 16,8 : on retire l'apprentissage et les agences (modèle), on ajoute l'immobilier et on fusionne les deux leviers des collectivités (recouvrement). **Ne pas additionner T47 et cette note.**

---

## 8. Option proposée à intégrer plus tard : « économies structurelles »

Ne modifie pas `options_financement.js` (autre agent). Description pour intégration :

- **Option `structurelles`** (nouvelle clé de `economies`) : **additive** à `prudentes` ou `volontaires`, sans les remplacer (aucun poste en commun après le § 1). Deux niveaux :
  - `structurellesA` : `[16,1 ; 11,7 ; 5,8]` (favorable, central, défavorable) ; à 3 ans, central 5,6 ; à 1 an, 1,6. **Recommandation : c'est celui qu'on peut afficher dans le solde.**
  - `structurellesAB` : `[29,3 ; 16,8 ; 7,2]` ; à 3 ans, 7,6 ; à 1 an, 2,1. Réserve non comptée au solde affiché (T47, recommandation 1).
- **Option liée** `niches` (recettes, `[8,5 ; 4,7 ; 2,4]`) : à ne pas fusionner avec les économies ; elle remplace une hausse du taux plat (≈ 0,4 point au central).
- **Option liée** `education` : variante `economie` `[5,5 ; 3,9 ; 2,2]` ou `tuteurRedeploye` `[−0,2 ; −1,6 ; −4,1]` (ordre favorable, central, défavorable : au haut du tuteur, le coût de l'accompagnement dépasse les ETP libérés, voir § 4).
- **Montée en régime** : 1 an, 3 ans, 10 ans comme dans le tableau ; la marche entre 3 et 10 ans est linéaire (hypothèse).
- **Contrôles à prévoir** : somme A + B égale 7,2 / 16,8 / 29,3 ; aucune ligne ne reprend 0,54, 0,16, 4,6 ou 3,4 ; la variante éducation n'est jamais ajoutée à `tuteurRedeploye`.

---

## 9. Contradictions, points fragiles et questions à l'auteur (règle 7)

1. **La thèse « on gaspille » ne se vérifie pas ici.** Les gisements documentés (collectivités, achats, mal évalué) pèsent ensemble moins de 1 % de la dépense publique (1 714 Md€) à 10 ans. L'écart avec la zone euro vient surtout des retraites et de la santé. Cela ne contredit pas l'objectif de « rendre des comptes » ; cela contredit l'idée qu'une administration plus efficace suffit à financer le socle.
2. **Contradiction avec la lisibilité du prélèvement unique** (§ 5). 
3. **Le biais pro-technologie** : B2 repose sur l'IA, et le seul rapport officiel ne chiffre rien.
4. **L'ego de la formule** : « moins de fonctionnaires » rapporte quelques Md€ au plus ; dans la logique « ne perdre personne », seuls les départs non remplacés sont compatibles, et la restitution aux agents peut diviser l'économie par deux.
5. **Q10** : le choix de redéployer vers le tuteur est un pari sur un outil dont l'effet n'est pas établi en France (essais contrastés ; biais pro-tech). Si le tuteur est écarté après expérimentation, la variante A (+3,9) redevient disponible : **le choix est réversible, pas l'argent déjà dépensé en accompagnateurs**.
6. **Deux erreurs de ma part possibles** : (a) j'ai déduit le coût d'un enseignant de la Cour pour la territoriale : à relire ; (b) mon immobilier repose sur des €/m² non sourcés : son poids est faible (0,66), mais c'est de l'hypothèse nue.

**Questions** (recommandation d'abord) :
1. Intégrer `structurellesA` au solde ? *Oui, 11,7 central ; A + B en réserve.*
2. Garder l'option niches TVA et accises ? *Oui, mais comme alternative à 0,4 point de taux plat, pas comme économie ; à arbitrer avec « un prélèvement simple ».*
3. Éducation : garder la Q10 (redéploiement) ? *Oui pendant l'expérimentation, avec clause de bascule en variante A si l'effet n'est pas mesuré à trois ans.*

---

## 10. Limites

- Modèle statique, base 2024-2025 : les économies sont des niveaux ; la dépense tendancielle peut les absorber. Aucune réaction macroéconomique (multiplicateur).
- Aucun coût de transition propre (reconversions des agents publics, investissement numérique) n'est ajouté aux 4 / 10 / 22 Md€ du modèle ⚠️.
- Les bas, central, haut ne sont pas des intervalles de confiance.
- Non relus à la source : rapport IGF logement social, IGF-IGESR sport, DAE, IPP, Cour décembre 2023 (via le Sénat), évaluations de la restauration, budget vert. Recherche web de cette session : plusieurs résultats incomplets (aucun chiffre d'économie dans le rapport du Sénat sur les aides, aucun chiffre de loyer dans la Cour de 2023).

---

## Synthèse des sources mobilisées

| Source | Quoi | Ce qu'elle établit |
|---|---|---|
| [`sources/recherche-economies-depenses.md`](recherche-economies-depenses.md) (T47, 01/11/2026), qui cite [Cour, FPL 2024 fasc. 2](https://www.vie-publique.fr/files/rapport/pdf/295578.pdf), [Sénat n° 807](https://www.senat.fr/rap/r24-807-1/r24-807-1_mono.html), [IGF-IGAS-IGA IA 2026](https://www.igas.gouv.fr/sites/igas/files/2026-07/Rapport%20IGF-IGAS-IGA%20D%C3%A9ploiement%20IA%20dans%20AP%20%28synth%C3%A8se%20et%20recommandations%29_0.pdf), DGAFP | Collectivités, achats, agences, IA, dépenses qui interrogent | Gisements A et B1 à B3, B5 ; décote ; « pas de miracle arithmétique » |
| [Sénat, *Moderniser la gestion du patrimoine immobilier de l'État*](https://www.senat.fr/lessentiel/ppl25-319.pdf) (juin 2026), consulté le 03/11/2026 [Lu] | 96,7 M m², 23,1 M m² de bureaux, 25,25 m² par poste, cessions, 140-150 Md€ de travaux, foncière | Base de B4 |
| Ministère des finances, *Évaluation des voies et moyens, tome 2, dépenses fiscales* (PLF 2026), fichier `$DONNEES/sources/depenses_fiscales/VM-T2-2026.pdf`, lu le 03/11/2026 (URL d'origine non consignée ⚠️) | 88,3 Md€ en 2026, répartition par impôt, 15 niches = 52 % | Niches qui survivent (§ 5) |
| `modeles/education/resultats.md` et `methode.md` (03/11/2026), DEPP (data.education.gouv.fr) | 756 000 ETP, 109 138 libérés, tuteur 485 € | Variantes A et B (§ 4) |
| `modeles/systeme-ideal/options-financement-palier1.md`, `options_financement.js`, `methode.md` (H36, H171, H428, H500) | Ce qui est déjà compté | Doubles comptes (§ 1) |
| `sources/cout-complet-prelevement.md`, `modeles/industrie-complexite/resultats.md`, `sources/recherche-simplification-et-depenses-interrogeantes.md` | Coût public (7,6) et privé (25,3) de la collecte, gestion des prestations | B1 ; la complexité est surtout privée |
| `modeles/depenses/subventions.csv`, `commande_publique.csv` | Aides aux entreprises, associations, achats | Pistes C |
| [Sénat, rapport n° 808 (2025), aides publiques aux entreprises](https://www.senat.fr/rap/r24-808-1/r24-808-1_mono.html) [Résumé de recherche web, non rouvert] | 211 Md€ sens large, 108 strict ; aucun chiffrage d'économie | Piste C |

Ces sources établissent que **les économies de dépense documentées sont réelles mais de l'ordre d'un point de dépense à dix ans**, qu'elles se concentrent dans les collectivités, les achats et les dépenses mal évaluées, que les niches restantes (TVA, accises, IS) sont un levier de recettes plus qu'un levier de dépenses, et que **l'arbitrage éducation (Q10) pèse plus (5,5 Md€) que l'immobilier, les agences et le CPF réunis**.
