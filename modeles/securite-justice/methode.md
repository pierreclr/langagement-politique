# Sécurité et justice : la chaîne pénale, ses options et le numérique : méthode

Thème « sécurité » (positions de l'auteur qui n'avaient pas encore de modèle) · consultation des sources : 2026-11-03 · code : [`modele.py`](modele.py) · tests : [`test_modele.py`](test_modele.py) (`python3 -m unittest test_modele -v`, 33 tests) · tables : [`rapport.py`](rapport.py) · résultats : [`resultats.md`](resultats.md) · données : [`donnees/`](donnees/) (copie et PDF sources dans `$DONNEES/sources/securite/`).

Légende : **fait sourcé** · **estimation** (calcul explicité) · **hypothèse** (numérotée H1 à H26) · ⚠️ non confirmé (registre V6270-V6289 dans `verifications.md`). Des ordres de grandeur, jamais des prédictions. Scénarios : **bas** = hypothèses prudentes sur les gains (effets faibles, économies faibles), **central**, **haut** = hypothèses optimistes. Ce n'est pas « bas = peu de crimes ».

## 1. Questions posées

1. **La chaîne pénale aujourd'hui** : de l'affaire enregistrée à la peine exécutée, avec les déperditions, la prison et les budgets.
2. **Les options que l'auteur défend ou pourrait défendre**, chiffrées en coût et en effet selon la littérature : construire des places, convertir les courtes peines (bracelet, TIG), travail en prison, plus de police (certitude contre sévérité), prison supplémentaire, éloignement anticipé d'étrangers condamnés.
3. **Le numérique au service de la chaîne pénale** (État-plateforme) : temps gagné, jours gagnés sur le délai, coût du programme.

## 2. Périmètre et garde-fous

- **Inclus** : France entière, 2025 pour les flux, 1er janvier 2026 pour les stocks de détention (et septembre 2026 pour la surpopulation), faits enregistrés SSMSI 2025.
- **Exclus** : justice civile, justice des mineurs (citée, pas modélisée), cybercriminalité, délinquance financière, justice administrative ; effets sur la sécurité ressentie ; coûts sociaux du crime (non chiffrés ici, voir limites) ; sites pénitentiaires ouverts, peine maximale mixte, vidéosurveillance algorithmique (positions de l'auteur qui restent hors modèle, voir § 8).
- **Pas de profilage par origine (règle du modèle).** Aucune donnée ni fonction ne porte sur l'origine, la religion, l'ethnie, le quartier ou le patronyme ; `verifier_sans_profilage()` et un test le vérifient sur chaque fichier. La **nationalité enregistrée** n'entre que sous forme de **deux totaux officiels** (étrangers prévenus et condamnés détenus au 1/1/2026, ministère de la Justice) pour l'option d'éloignement, jamais par pays. Limites de cette donnée, à répéter à chaque usage : la nationalité est parfois déclarative ; elle ne dit rien de l'origine (un naturalisé est « français ») ; les étrangers sont plus jeunes et plus masculins que la population (la comparaison brute avec 9 % des résidents n'est donc pas une mesure de propension) ; ils comptent des non-résidents ; la détention provisoire et les aménagements pèsent différemment selon les garanties de représentation. Voir `sources/recherche-securite-justice-statistiques.md` § 2.2 et `sources/recherche-delinquance-origine-mesure.md`.

## 3. Données (voir `donnees/`)

| Fichier | Contenu | Statut |
|---|---|---|
| `chaine_penale_2025.csv` | affaires, mis en cause, poursuivables, réponse pénale, condamnations, récidive, délais | sourcé (Chiffres clés de la Justice 2026, lu en PDF avec pypdf) sauf lignes ⚠️ |
| `detention_2026.csv` | détenus, places, densité, quantum, durées d'écrou, milieu ouvert | sourcé (idem) ; septembre 2026 via recherche antérieure |
| `infractions_ssmsi.csv` | faits enregistrés par indicateur, 2016, 2024, 2025 | calcul de Claude : somme des régions de la base SSMSI (data.gouv.fr, produite le 25/06/2026) ⚠️ V6270 |
| `etrangers_agregat.csv` | deux totaux de nationalité enregistrée, éloignement | mélange sourcé et ⚠️ |
| `couts_budgets.csv` | budgets Justice, coût de la journée de détention, coût d'une place, plan numérique, effectifs de police | **mélange** : budgets sourcés ; coûts journaliers et d'une place trouvés par recherche web ou hypothèse ⚠️ |
| `litterature.csv` | élasticités, effet bracelet, travail, récidive de base (bas / central / haut) | citées **de mémoire** ⚠️, aucune étude relue |

Interstats a répondu 403 à la page du bilan 2025 : repli sur data.gouv.fr (base régionale), sans contournement. Les 254 217 peines d'emprisonnement viennent d'un graphique dont le rattachement chiffre-libellé n'est pas certain (V6272).

## 4. Hypothèses numérotées

| # | Hypothèse | Valeur (bas / central / haut) | Statut |
|---|---|---|---|
| H1 | Unités de la chaîne : **mis en cause** (1,92 M) sont des personnes (une personne peut compter plusieurs fois), **condamnations** (556 k) sont des condamnations, **condamnés** (437 k) des personnes ; les condamnations d'une année portent sur des faits de plusieurs années. L'entonnoir donne donc des **ordres de grandeur de déperdition**, pas un taux de cohorte. | — | estimation |
| H2 | Les « affaires sans mis en cause » (60 % des affaires traitées) ne sont pas toutes des délits non élucidés (certaines sont des plaintes sans suite, des procès-verbaux administratifs) | — | ⚠️ V6274 |
| H3 | Densité = détenus / places disponibles (définition du ministère, matelas au sol inclus dans les détenus) | 136,1 % au 1/1/2026 ; 142,1 % au 1/9/2026 | fait |
| H4 | Loi de Little : stock = flux x durée ; sert de **test de cohérence** (durée implicite 10,3 mois entre les 5,3 mois des prévenus et les 11,8 mois des condamnés) | — | estimation |
| H5 | Budget : les crédits de paiement de la mission Justice (12 380 M€ en 2025) sont un fait ; la ventilation par programme est **déduite de l'ordre** des chiffres du PDF | 4 584 M€ pénitentiaire | ⚠️ V6278 |
| H6 | Coût d'une journée de détention (moyenne par détenu) | 105 / 117 / 130 € (Cour des comptes 2023 ; maison d'arrêt ; réponse ministérielle) | ⚠️ V6279 |
| H7 | Part du coût **évitable** quand une personne sort de prison : une journée de moins ne ferme pas une aile. Seule la part variable (alimentation, santé, surveillance si des places ferment, évitement d'une construction) est une économie | 0,3 / 0,5 / 0,8 | hypothèse ⚠️ V6281 |
| H8 | Bases de faits SSMSI 2025 : « violences » = violences physiques (intrafamiliales et hors cadre) + violences sexuelles ; « biens » = cambriolages + vols sans violence contre personnes + vols de véhicule + vols dans les véhicules ; unités de compte différentes (victimes, infractions, véhicules) additionnées faute de mieux | 604 552 / 1 191 911 | estimation ⚠️ V6270 |
| H9 | Coût de la place neuve | 350 000 / 270 000 / 200 000 € | hypothèse ⚠️ V6281 (ordre de grandeur du programme de 15 000 places, mémoire) |
| H10 | Amortissement d'une place : 40 ans, taux 3 % ; places neuves cumulées à une part variable de fonctionnement (H7) | — | choix |
| H11 | Cible de densité | 100 % (régulation complète) et 120 % (cible intermédiaire) | choix |
| H12 | Surcoût d'encadrement d'un poste de travail en prison | 9 000 / 6 000 / 4 000 € par poste et par an | hypothèse ⚠️ V6288 |
| H13 | Coût d'une journée de suivi sous bracelet (matériel, SPIP, pose) | 40 / 25 / 15 € (12 € en 2013 selon un rapport parlementaire) | ⚠️ V6280 |
| H14 | Part des condamnés détenus à un quantum ferme de 1 an ou moins (11 278, 13 % des détenus) convertie en bracelet ou TIG | 20 / 40 / 60 % | hypothèse (choix de politique) |
| H15 | Police : +10 % d'effectifs sur 250 000 ETP (police nationale + gendarmerie, ordre de grandeur) à 65 000 € chargés | 25 000 agents, 1 625 M€/an | ⚠️ V6283 (effectif total non lu en source primaire) |
| H16 | Élasticités du crime : police (violent / biens), population carcérale | violent -0,17 / -0,34 / -0,50 ; biens -0,08 / -0,17 / -0,25 ; prison 0 / -0,05 / -0,15 | ⚠️ V6284, V6285 (littérature américaine, de mémoire) |
| H17 | Part des étrangers condamnés détenus qu'on parviendrait à éloigner avant la fin de peine (donc après obtention des laissez-passer, hors personnes protégées par la CEDH art. 8) | 5 / 15 / 30 % (taux d'éloignement forcé observé : 9,8 % des mesures) | hypothèse |
| H18 | Durée moyenne de peine restante à l'éloignement | 3 / 6 / 9 mois | hypothèse |
| H19 | Coût d'un éloignement forcé | 4 414 € | ⚠️ V6277 |
| H20 | Temps gagné par procédure grâce à la procédure pénale numérique (ressaisies, courriers, scans, transmissions entre police, parquet, greffe) | 10 / 20 / 40 minutes | hypothèse ⚠️ V6282 |
| H21 | Part du délai moyen d'un délit (13,3 mois, faits-condamnation) due aux transmissions papier | 5 / 10 / 20 % | hypothèse ⚠️ V6282 |
| H22 | Coût chargé d'un ETP de greffe ou de police administrative : 50 000 € ; 1 607 h par an (durée légale) | — | hypothèse |
| H23 | Investissement numérique : on compte, **par prudence, la totalité du plan de transformation numérique de la justice (530 M€)** alors que la procédure pénale numérique n'en est qu'une partie (borne haute du coût) ; amortissement 10 ans à 3 % | 530 M€ | ⚠️ V6282 |
| H24 | Reconviction à 5 ans des sortants de prison | 55 / 60 / 63 % | ⚠️ V6287 |
| H25 | Effet bracelet contre prison sur la reconviction | 0 / 4 / 7 points | ⚠️ V6286 |
| H26 | Travail : part des détenus qui travaillent aujourd'hui (25 / 28 / 31 %), cible (45 / 60 / 80 %), réduction relative de la reconviction (0 / 4 / 8 %) | — | ⚠️ V6288 |

## 5. Formules

- Entonnoir : ratios successifs (`entonnoir`).
- Places manquantes : `détenus / cible - places` ; coût = annuité(places x coût d'une place) + places x coût du jour x part variable x 365.
- Peines courtes : places libérées = stock éligible x part convertie ; gain net = places x coût du jour x part variable x 365 - places x coût du bracelet x 365 ; reconvictions évitées = (places / durée moyenne d'écrou en années) x effet bracelet.
- Travail : postes = (cible - actuel) x condamnés détenus ; reconvictions évitées = sortants x (cible - actuel) x reconviction de base x réduction relative.
- Police : faits évités = -élasticité x hausse x base de faits (violents et biens séparément).
- Prison supplémentaire : faits évités = -élasticité x hausse x tous les faits de la base.
- Éloignement : éloignés = étrangers condamnés détenus x part ; économie = éloignés x (restant / 12) x coût du jour x part variable x 365 ; coût = éloignés x coût d'un éloignement.
- Numérique : ETP = procédures x minutes / 60 / 1 607 ; jours gagnés = 13,3 mois x 30,4 x part papier.

## 6. Effets de comportement et de rebond (sourcés, ⚠️ de mémoire)

- **Certitude plutôt que sévérité** : la recherche de Nagin (2013, *Crime and Justice*) conclut que la probabilité perçue d'être pris dissuade nettement plus que la gravité de la peine ; l'allongement des peines a un effet dissuasif faible. Appliqué à la France, avec 8 % d'élucidation pour les cambriolages et les vols à un an (⚠️ V6131), la marge est en amont de la prison, côté police et enquête. C'est un argument, pas une mesure française.
- **Police** : Chalfin et McCrary (2018, *Review of Economics and Statistics*) trouvent aux États-Unis, sur des villes, des élasticités d'environ -0,34 pour les crimes violents et -0,17 pour les atteintes aux biens. Transposition à la France : forte incertitude (niveau initial d'effectifs, mode d'emploi des agents).
- **Prison** : l'effet de la détention supplémentaire sur le crime est faible à la marge (Johnson et Raphael 2012 ; Roodman 2017 le juge proche de zéro, voire négatif) ; l'incarcération a un effet d'incapacitation réel mais des effets criminogènes à la sortie pour les petits délinquants (Mueller-Smith 2015 aux États-Unis) et des effets inverses chez certains prévenus à la marge en Norvège (Bhuller et al. 2020). Les résultats **divergent selon les systèmes et les profils**.
- **Bracelet** : en France, Henneguelle, Monnery et Kensey (2016) trouvent une reconviction plus basse de quelques points sous bracelet que sous détention à profil comparable (ordre de 6 à 7 points) ; effet d'incapacitation perdu, non modélisé.
- **Rebond de la surpopulation** : construire des places sans changer le flux d'entrées conduit, dans l'expérience de plusieurs pays, à remplir les places neuves (effet « build it and they will come ») ⚠️ non sourcé ici ; le modèle suppose un flux constant, ce qui est optimiste pour le coût.

## 7. Steelman et contraintes juridiques

- **Objection à la thèse « moins de prison pour les courtes peines »** : l'incapacitation (une personne sous bracelet peut récidiver) et l'acceptabilité (les victimes y verront une impunité). Réponse : le gain en reconvictions évitées est faible, ce sont les places qui sont le bénéfice ; réservé aux courtes peines ; mais l'incapacitation perdue n'est pas modélisée.
- **Objection à « plus de police »** : le coût par fait évité est élevé (27 000 à 82 000 € par fait évité dans les scénarios) et dépend d'élasticités américaines. Réponse : l'élucidation est si basse que la police est probablement le levier de la certitude ; mais le modèle ne mesure pas le gain d'élucidation, seulement le crime évité.
- **Objection à l'éloignement anticipé** : il ne fait gagner presque rien (14 M€ au central), n'a pas d'effet dissuasif démontré, et se heurte aux laissez-passer. Contraintes : CESEDA L. 631-1 à L. 631-3, CEDH art. 3 et 8, Constitution (égalité devant la loi : aucune mesure par origine, seule la condamnation et le statut juridique comptent).
- **Objection au numérique** : la Cour des comptes (plan de transformation numérique) juge le coût global du plan inconnu et le suivi insuffisant ⚠️ V6282 ; le rattrapage a pris le pas sur la simplification. Le modèle ne dit pas que le numérique « rapporte » : il dit ce que vaudrait le temps gagné.
- **Peine maximale mixte, euthanasie du condamné** : hors modèle (voir § 8), car l'intérêt financier de l'État (23 M€ par an pour les 486 perpétuités, calculé à titre d'ordre de grandeur) est précisément ce que la CEDH interdit de faire peser sur un consentement.

## 8. Ce que le modèle ne fait pas

- Pas de **sites pénitentiaires ouverts ni de prisons agricoles** (Casabianda, Bastøy) : ni coût par place, ni effet causal robuste (biais de sélection des détenus) ne sont lus ; à instruire avec la DAP et les évaluations norvégiennes.
- Pas de **peine mixte**, de couvre-feux votés, de vidéosurveillance algorithmique : ce sont des choix de droit et de valeurs, pas des calculs.
- Pas de **coût social du crime** (victimes, santé, travail perdu) : sans lui, le « coût par fait évité » n'est pas comparable à un bénéfice. À ajouter avant toute décision.
- Pas de **détention provisoire** (22 131 prévenus détenus, 26 % des détenus) ni de réforme de la comparution immédiate : le levier est peut-être là.
- Pas d'effet du **revenu universel ou du cannabis régulé** sur la délinquance (liens relevés dans les positions de l'auteur) : à chiffrer dans leurs modèles.

## 9. État de la recherche (règle 9)

- **Établi** : la certitude dissuade plus que la sévérité (Nagin) ; la police a un effet à la baisse sur le crime (Chalfin et McCrary, villes américaines) ; l'effet marginal de la prison supplémentaire est faible.
- **Débattu** : les effets de l'incarcération sur la récidive (négatifs aux États-Unis chez Mueller-Smith, positifs en Norvège chez Bhuller) ; l'effet réel du bracelet selon le profil.
- **Manque** : toute étude française récente à grande échelle sur la dissuasion ; une évaluation indépendante des gains de la procédure pénale numérique ; l'appariement police-justice-Insee (pour la nationalité comme pour l'âge et le sexe, jamais comme profilage).

## 10. Synthèse des sources mobilisées

| Source | D'où | Ce qu'elle établit |
|---|---|---|
| [Chiffres clés de la Justice 2026](https://www.justice.gouv.fr/sites/default/files/2026-10/Chiffres_cles_Justice_2026.pdf) | ministère de la Justice, octobre 2026 | chaîne pénale 2025, détention au 1/1/2026, budget, durées d'écrou, quantums |
| [Les condamnations en France en 2024](https://www.justice.gouv.fr/sites/default/files/2026-02/Rapport%20annuel%20sur%20les%20condamnations%20en%20France%20en%202024.pdf) | ministère de la Justice, février 2026 | délais faits-condamnation (non relu en entier ici) |
| [Bases communale, départementale et régionale de la délinquance](https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/) | SSMSI, data.gouv.fr, 9/07/2026 | faits enregistrés 2016-2025 |
| `sources/recherche-securite-justice-statistiques.md`, `sources/recherche-immigration-chiffres.md` | dépôt, recherches antérieures | surpopulation de septembre 2026, élucidation, coût d'éloignement, nationalité des détenus (à vérifier) |
| Recherche web du 3/11/2026 (coût de la journée de détention, plan de transformation numérique) | résultats de moteur de recherche, pages non ouvertes | ordres de grandeur ⚠️ |
