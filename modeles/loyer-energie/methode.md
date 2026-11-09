# Loyer « énergie comprise » : méthode

Modèle du 03/11/2026 · consultation des sources : 2026-11-03 · code : [`modele.js`](modele.js) · données : [`donnees/`](donnees/) et [`preparer_donnees.py`](preparer_donnees.py) · résultats : [`resultats.md`](resultats.md)

Légende : **fait sourcé** (lien) · **estimation** · **hypothèse** · ⚠️ non confirmé (registre `verifications.md`, V10200 à V10218).

## 1. Question posée

Proposition de l'auteur (03/11/2026) : un plafond de loyer haut et permissif pour un logement qui ne consomme rien (classe A), dont on déduit la consommation annuelle estimée par le DPE (kWh × prix du kWh, ramené au mois). Un logement G reste louable ; c'est le propriétaire qui supporte le coût de la mauvaise isolation. Exemple : Grenoble, 50 m², 1 000 €/mois avant déduction. Compléments du même jour : (a) l'isolation par l'intérieur réduit la surface et donc le loyer plafonné au m² ; (b) une pompe à chaleur améliore la classe à moindre coût qu'une isolation ; (c) le DPE paraît peu fiable (cas vécu d'une maison en pierre).

Questions : à quel niveau fixer le plafond ? Qui perd quoi, où le plafond mord-il ? La rénovation devient-elle rentable ? Comment cela se compare-t-il à l'interdiction de louer ? Que fait le bailleur entre isolation et pompe à chaleur ? Sur quelle base mesurer la consommation ?

## 2. Cadre légal actuel (fait sourcé, copie locale de la loi du 6 juillet 1989 consultée le 02/11/2026)

[Loi n° 89-462, art. 6](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000509310) (version en vigueur depuis le 01/01/2025, modifiée par la loi n° 2021-1104 du 22 août 2021, art. 160) : le niveau de performance d'un logement décent est compris entre A et F à compter du 01/01/2025, entre A et E à compter du 01/01/2028, entre A et D à compter du 01/01/2034 (Outre-mer : F en 2028, E en 2031). Les logements qui ne répondent pas aux critères sont « non décents ». Art. 17 II et 17-2 : gel du loyer des logements F et G à la relocation et au renouvellement (depuis août 2022). Art. 23-1 : le bailleur peut demander au locataire une contribution au partage des économies de charges, au plus la moitié de l'économie estimée, après travaux amenant le logement entre A et E. Lecture du code de la construction et de l'habitation (art. L. 173-1-1) : non refaite ⚠️ V10205 (la copie locale ne reflète peut-être pas des modifications de 2025-2026).

Zones de tension : le plafond « énergie comprise » doit s'articuler avec l'encadrement des loyers existant (art. 17, observatoires locaux) ; le modèle ne le fait pas.

## 3. Formule

Pour un logement de classe X, de surface de référence S, dans une commune de loyer moyen L (€/m²) :

- Plafond(A) = k × L × S, avec k fixé par le calibrage (§5).
- Déduction(X) = EF(X) × S × p ÷ 12, où EF est la consommation conventionnelle en **énergie finale** (kWh/m²/an, 5 usages) et p le prix moyen du kWh pondéré par le mix d'énergie de chauffage de la zone.
- Plafond(X) = Plafond(A) − Déduction(X).
- Loyer(X) = min(loyer de marché(X), Plafond(X)) ; baisse = max(0, marché − plafond).
- Propriété : si le plafond mord, loyer + énergie conventionnelle = Plafond(A) pour toutes les classes : le locataire paie la même chose.

**Énergie finale, pas primaire** : la classe du DPE se calcule en énergie primaire, mais le locataire paie l'énergie finale. Utiliser la primaire surévalue l'électricité (coefficient de conversion de 2,3, abaissé à 1,9 au 01/01/2026 ⚠️ V10209) et fait varier le loyer au gré d'un arrêté.

**Variante avec besoin** (§6) : Déduction = S × [ w × B × p_réf + (1 − w) × dépense en euros ] ÷ 12, où B est le besoin utile de chauffage et de froid du bâti (kWh/m²/an), p_réf = 0,15 €/kWh, w = 0,3 / 0,5 / 0,7.

## 4. Hypothèses numérotées

| # | Hypothèse | Source ou statut |
|---|---|---|
| H1 | Consommation EF et EP moyennes par classe, appartements, par zone (France, Grenoble 38185, Angers 49007) | [ADEME, base DPE logements existants depuis juillet 2021](https://data.ademe.fr/datasets/dpe03existant), agrégats par l'API du 03/11/2026, 10,7 millions d'appartements. Ce sont des **flux de diagnostics** (ventes, locations, doublons possibles), pas le parc ⚠️ V10200 |
| H2 | Seuils des classes en énergie primaire : A ≤ 70, B ≤ 110, C ≤ 180, D ≤ 250, E ≤ 330, F ≤ 420, G > 420 (hors critère GES) | ⚠️ V10201 (arrêté du 31/03/2021 non relu) |
| H3 | Prix TTC par kWh : électricité 0,20 ; gaz 0,13 ; réseau de chaleur 0,11 ; bois 0,09 ; autres 0,13 ; ×0,85 / 1 / ×1,25 selon le scénario | électricité : tarif réglementé Base 0,1940 €/kWh au 01/02/2026 (comparateurs, délibération CRE 2026-06 non lue) ; gaz : prix repère CRE de 0,125 à 0,145 ; autres : hypothèses ⚠️ V10202 |
| H4 | Loyer de marché de la classe X = loyer moyen de la commune × (1 + prime) : A +4 %, B +3 %, C +1 %, D 0, E −2 %, F −4 %, G −6 % | ⚠️ V10203, hypothèse sans source (la « valeur verte » sur les loyers est faible) |
| H5 | Loyer moyen de la commune : Grenoble 15,67 €/m² (T1-T2) et 13,41 (tous appartements) ; Angers 16,57 et 14,56 ; médiane des communes 11,97 et 10,00 | [Carte des loyers 2025 (DHUP/ministère)](https://www.data.gouv.fr/datasets/693aa2feed1bf4da603faa49/) : prédiction économétrique de loyers d'annonce charges comprises, pas des loyers en cours ⚠️ V10206 |
| H6 | Parc : résidences principales 2025 par classe ; locatif privé 7,97 millions, F + G = 13,8 %, G = 453 000 | [SDES, infographie, 12/11/2025](https://www.statistiques.developpement-durable.gouv.fr/infographies/8808) ; 453 000 : presse ⚠️ V10204 |
| H7 | Coût net de rénovation par saut de classe : 80 / 120 / 180 €/m² ; aides : 35 / 25 / 0 % | ⚠️ V10207, V10208 |
| H8 | Le bailleur rénove si le retour par le loyer récupéré est inférieur à l'horizon (15 / 12 / 8 ans) ; les autres gardent un loyer réduit ou sortent (5 / 15 / 25 %) | hypothèses ⚠️ V10218 |
| H9 | Cas type : G, 50 m², gaz 340 + eau chaude 60 + électricité 30 kWh EF/m²/an, besoin utile 299 ; isolation −45 % du besoin, 8 000 €, 2 m² perdus ; PAC SCOP 3,5, 4 500 € ; valeur 2 800 €/m² | hypothèses de cas ⚠️ V10216 |
| H10 | Scénario « bas » = plafond peu mordant (protège A à E) ; « central » protège A à D ; « haut » protège A à C | choix de conception |

## 5. Calibrage du plafond

« Calibré pour ne pas mordre sur les bons logements » est traduit ainsi : k est le plus petit coefficient pour lequel Plafond(X) ≥ marché(X) pour toutes les classes de A à la classe protégée. Résultat (central, 50 m²) : k = 1,13 à Grenoble, 1,12 à Angers, 1,17 pour la France. Le plafond de A doit donc rester très proche du loyer de marché d'un bon logement (13 % au-dessus) ; au-delà, le dispositif ne mord plus. Le calibrage dépend du prix de l'énergie : si p monte, k monte et la déduction grandit ; il faut **indexer** ou fixer p (moyenne glissante sur trois ans, par exemple) pour qu'un choc de prix ne change pas le loyer d'un jour à l'autre.

## 6. Isolation contre équipement : surface et besoin

**Surface de référence figée.** Le plafond est calculé sur la surface habitable d'avant travaux, inscrite dans le bail et le DPE ; les mètres carrés perdus par isolation intérieure (limite proposée : 15 cm d'épaisseur d'isolant sur les murs extérieurs) ne diminuent ni le plafond ni le loyer. Alternative : plafond par logement et non au m² pour la part d'isolant. Limite : la valeur vénale est mesurée sur la surface réelle (Carrez) ; le loyer est corrigé, pas le prix. L'isolation par l'extérieur n'enlève pas de surface mais coûte plus et dépend de la copropriété et du droit de l'urbanisme (non chiffré).

**Besoin et dépense.** En 3CL l'étiquette est une énergie primaire : un changement de coefficient ou l'installation d'une pompe à chaleur déplace la classe sans changer le bâti. La déduction mélange donc (poids w) la dépense en euros (reflet de l'équipement et des prix) et le besoin utile de chauffage et de froid du bâti, valorisé à un prix de référence. Le besoin existe dans la base ADEME (champs `besoin_chauffage`, `besoin_refroidissement`) mais les moyennes obtenues par l'API sont inexploitables (valeurs aberrantes), donc le cas type utilise un besoin stylisé ⚠️ V10200. Pour le neuf, l'équivalent est l'indicateur Bbio de la RE2020 (non utilisé ici).

## 7. Fiabilité du DPE et alternative mesurée

### 7.1 Ce que disent les études (sources secondaires, rapports primaires non lus ⚠️)

- **Écarts entre diagnostiqueurs.** [Cour des comptes, 3 juin 2025](https://www.ccomptes.fr) (via communiqués et presse ⚠️ V10212) : le DPE varie fortement d'un diagnostiqueur à l'autre (méthodes imprécises, formation, encadrement lacunaire) ; la DGCCRF a relevé des anomalies dans 70 % des diagnostics contrôlés en 2023 ; 0,2 % des DPE ont fait l'objet d'un contrôle ; recommandation : carte professionnelle des diagnostiqueurs d'ici fin 2026, détection automatique des valeurs suspectes (ADEME). Le gouvernement a lancé un plan d'action en mars 2025.
- **Tests d'associations.** UFC-Que Choisir : sept maisons, 34 diagnostics, aucune classe identique ; écart maximal de trois classes (E à G) ; estimation de consommation variant du simple au triple ; durée de visite de 20 minutes à 3 heures. La date de cette enquête n'est pas confirmée et peut précéder la réforme de 2021 ⚠️ V10213.
- **Après la réforme de 2021.** Réponses ministérielles : un même logement peut recevoir jusqu'à trois classes d'écart entre deux DPE ; le gouvernement affirme que la méthode est désormais homogène mais reconnaît des imprécisions. Pas de statistique indépendante consolidée trouvée sur la fréquence des écarts.
- **Réformes de convention.** Le passage du coefficient électrique de 2,3 à 1,9 au 01/01/2026 a fait sortir environ 850 000 logements des classes F et G sans aucun travail ⚠️ V10209 : la classe dépend d'une convention.
- **Bâti ancien et inertie.** Des réponses ministérielles disent que la méthode module les parois anciennes lourdes (pierre, terre, brique) ; des critiques disent qu'elle ne tient pas compte de l'épaisseur des murs ni du potentiel d'isolation. Le texte exact de la méthode 3CL (annexe 1 de l'arrêté du 31 mars 2021, inertie, bioclimatisme) n'a pas été lu ⚠️ V10214.
- **Poêle à bois.** L'annexe 1 contient une section dédiée aux installations avec insert ou poêle à bois « en appoint ». Un cas rapporté (poêle de 12 kW classé en appoint parce que des radiateurs électriques existaient) n'est pas vérifiable ici : c'est un témoignage, à confronter à la règle du texte ⚠️ V10214.
- **Écart avec la consommation réelle.** [CAE, focus n° 103, janvier 2024](https://www.cae-eco.fr/staticfiles/pdf/focus-103-dpe-230110.pdf) (avec Crédit Mutuel Alliance Fédérale, données bancaires de 178 110 ménages appariées aux DPE) : la consommation réelle augmente beaucoup moins vite avec la classe que la consommation théorique ; l'écart entre A-B et G est environ six fois plus faible ; un tiers vient de l'erreur de modèle, le reste du comportement (effet rebond) ; les ménages modestes consomment moins que prévu, les aisés plus ⚠️ V10210.

Ce qui manque : une étude indépendante, postérieure à 2021, qui fait réaliser plusieurs DPE du même logement par des diagnostiqueurs certifiés et compare à des mesures.

### 7.2 Alternative : un « DPE mesuré »

Principe : la consommation réelle de l'occupant (électricité Linky, gaz Gazpar ; bois, fioul, granulés sur factures ou déclaration), sur au moins 12 mois, normalisée.
- Normalisation : consommation de chauffage × DJU de référence ÷ DJU de l'année (`consoNormalisee`) ; part non climatique (eau chaude, cuisson) ramenée au nombre d'occupants ; vacance déduite.
- Accès : les données de comptage s'obtiennent avec l'accord de l'occupant (Enedis, service Data Connect, API ouverte à des tiers avec consentement du client ; GRDF non vérifié) ⚠️ V10215.
- Cas litigieux : test d'étanchéité à l'air (infiltrométrie) et thermographie ; coûts de l'ordre de quelques centaines d'euros ⚠️ V10217.

Avantages : mesure ce qui compte pour le portefeuille ; échappe aux conventions du 3CL (coefficient, inertie, bois) ; peu coûteux pour les logements équipés de compteurs communicants.

Limites, par ordre d'importance :
1. **Comportement de l'occupant.** Un ménage modeste sous-chauffe : un logement G occupé par un ménage pauvre apparaîtrait « sobre », la déduction serait faible et le bailleur profiterait de la privation du locataire (le CAE montre que les modestes consomment moins que prévu). Inversement, si la déduction augmente avec la consommation, le locataire a intérêt à chauffer davantage.
2. **Énergies non télérelevées** : bois, fioul, granulés, charbon : invisibles aux compteurs.
3. **Vacance, premier bail, turnover** : pas de mesure avant 12 mois ; des occupants différents donnent des mesures différentes.
4. **Normalisation imparfaite** : DJU et nombre d'occupants ne capturent ni le télétravail, ni les enfants, ni l'âge.
5. **Données personnelles.** La courbe de charge fine révèle des habitudes ; consentement libre, finalité limitée, durée limitée, avis de la CNIL ; le bailleur ne doit recevoir qu'un chiffre annuel normalisé, pas la courbe ⚠️ V10215. Le consentement du locataire est-il libre si le refus pénalise ?
6. **Manipulation** : compteur secondaire, appareils d'appoint non comptés, absence prolongée.

### 7.3 Base recommandée pour la déduction : hybride

Recommandation de Claude (opinion, à discuter) :
1. **Base par défaut : le 3CL**, parce qu'il est connu à la signature du bail, identique quel que soit l'occupant, comparable d'un logement à l'autre et ne donne au locataire ni intérêt à chauffer ni au bailleur intérêt à sa privation. Les imperfections se réduisent par la carte professionnelle, le contrôle par l'IA des valeurs suspectes (recommandations de la Cour) et, dans la formule, par la part « besoin » (§6).
2. **Contre-expertise mesurée sur contestation** par l'une ou l'autre partie : infiltrométrie, thermographie, mesure normalisée sur 12 mois quand elle existe (énergies télérelevées seulement) ; la valeur retenue est la mesure, **bornée entre 50 % et 150 % du 3CL** (`baseHybride`) pour que ni la privation ni le gaspillage ne pilotent le loyer. Frais à la charge de la partie qui perd.
3. **Étalonnage statistique à terme** : comparer le 3CL aux mesures (avec accord) pour corriger les biais par type de bâti (pierre, inertie, bois), par exemple facteurs correctifs publiés par l'ADEME.
Un DPE entièrement mesuré n'est pas recommandé : le loyer est un transfert entre deux personnes privées, et la base doit être indépendante du comportement de l'une d'elles.

## 8. Risques, steelman et réponses

| Objection (la meilleure) | Réponse |
|---|---|
| **Le plafond ne mord pas, ou il mord trop** : calibrage très étroit (k entre 1,10 et 1,20), instable avec le prix de l'énergie | Vrai (résultats §1). Fixer p en moyenne glissante, recalibrer chaque année par commune, publier le calcul. |
| **Le DPE est un mauvais instrument** pour fixer un prix : erreurs de classe, écart avec la facture | Hybride §7.3 ; contrôle ; la formule en euros est moins sensible à l'étiquette qu'un seuil de classe (pas d'effet de falaise). |
| **Manipulation** : DPE complaisant (le bailleur paie le diagnostiqueur) | Tirage au sort du diagnostiqueur, contrôle statistique, responsabilité engagée du diagnostiqueur (demandée par UFC-Que Choisir) ; qui vérifie ? l'ADEME et la DGCCRF aujourd'hui, 0,2 % de contrôles : il faudrait un ordre de grandeur supérieur. |
| **Retrait de logements du marché** : effet connu de l'encadrement des loyers ([Diamond, McQuade, Qian, AER 2019](https://www.nber.org/papers/w24181.pdf) : −15 % d'offre locative chez les bailleurs concernés à San Francisco, +5,1 % de loyers sur la ville ⚠️ V10211) | Dispositif différent (il ne plafonne que l'écart énergétique et laisse libre le loyer d'un logement économe) ; effet non mesuré en France ; études de Paris et de Berlin non lues. Suivi par expérimentation locale. |
| **Petits bailleurs modestes** : un seul logement G, pas de trésorerie, retraite complémentaire | Perte de 67 €/mois à Grenoble (9 % du loyer) pour un G ; prêt à taux zéro remboursé par le loyer récupéré, aides ciblées sur les bailleurs modestes ; ne pas confondre avec les multipropriétaires. |
| **Effet sur les locataires** : le bailleur sort du marché ou se rattrape en augmentant les loyers des bons logements | Le plafond de A est lui-même plafonné ; hausses limitées par l'encadrement existant ; à surveiller. |
| **Le locataire du G ne consomme pas ce qu'on déduit** (CAE) | Vrai : la déduction conventionnelle est plus forte que l'économie réelle (§5 de résultats) ; c'est un choix : faire payer le défaut du bâti plutôt que le comportement. |

## 9. Reproduire

```
cd modeles/loyer-energie
python3 -I preparer_donnees.py          # lit les agrégats et la carte des loyers (hors dépôt)
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc donnees.js modele.js test_modele.js
```

Données brutes (hors dépôt) : `$DONNEES/loyer-energie/` : agrégats de l'API ADEME (`dpe_agregats_ademe_2026-11-03.json`, `dpe_agregats_ademe_besoins_2026-11-03.json`) et carte des loyers 2025 (`pred-app-mef-dhup.csv`, `pred-app12-mef-dhup.csv`). Les sites d'ONRE/SDES (rapport complet) et de la CRE n'ont pas été lus directement : informations via moteur de recherche, notées ⚠️.

## 10. Option « seuil sanitaire mesuré » (04/11/2026, désactivée par défaut)

**Recommandation en tête** : la mesure 26 compense une facture, pas un risque sanitaire ; le complément recommandé est un seuil sanitaire **mesuré** (température atteignable, humidité, moisissures) qui déclenche l'interdiction ciblée de louer, loyer suspendu et relogement (variante A). État de la recherche, trois variantes et objections : `sources/logement-sante.md`. Ce paragraphe décrit seulement l'option chiffrée.

**Ce que fait le code** : `optionSanitaire(zone, scenario, N, { actif: true })` renvoie `null` tant que `OPTIONS.sanitaire.actif` est `false` (valeur par défaut) et que `actif` n'est pas passé. Rien d'autre n'en dépend : le calibrage de k, les tableaux par classe et les résultats existants sont inchangés (tests 1 à 8 verts, sortie des résultats antérieurs identique).

**Hypothèses numérotées** (toutes ⚠️ : `verifications.md`, V12010 à V12019)
- **S1** : le risque de franchir le seuil croît avec la classe : risque relatif A 0,2 ; B 0,2 ; C 0,5 ; D 1 ; E 2 ; F 4 ; G 8. Ne sert qu'à répartir un total ; le DPE ne mesure pas le risque sanitaire, il le corrèle (V12010).
- **S2** : part du parc locatif privé qui franchit le seuil : bas 0,31 % (313 pour 100 000, Ormandy, Angleterre) ; haut 7,5 % (600 000 logements inadaptés de Santé publique France sur 8 M, borne haute car tous parcs) ; central 2,7 % (moyenne géométrique, convention). Coût de travaux 5 975 / 8 000 / 10 833 € par logement ; santé évitée 20 400 / 4 100 / 833 € par logement et par an (V12011, V12012).
- **S3** : six mois de vacance pendant les travaux (V12013).
- **S4** : 30 % de perte de recouvrement pour les travaux d'office (V12014).
- Sortie du marché : celle du scénario (5 / 15 / 25 %).

**Résultats (parc locatif privé de 7,97 M)** : 24 949 / 215 217 / 597 826 logements concernés, dont 12 040 / 150 710 / 541 826 déjà touchés par le plafond du scénario ; travaux 0,14 / 1,46 / 4,86 Md€ ; santé évitée 0,51 / 0,88 / 0,50 Md€ par an ; retour 0,3 / 2 / 13 ans. Détail et variantes B et C : `sources/logement-sante.md` § 4 ; sortie brute : `resultats-sortie.txt`.

**Limites** : l'incertitude (facteur 24 entre bas et haut) est la vraie conclusion : aucune mesure représentative du parc n'est dans les sources lues. Les bénéfices non sanitaires ne sont pas comptés. Les seuils eux-mêmes ne sont pas fixés (à confier à une instance sanitaire).

