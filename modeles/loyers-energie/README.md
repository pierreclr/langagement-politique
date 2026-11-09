# Loyers « énergie comprise » sur données réelles : plafond = base + variable au m² − coût théorique de l'énergie

Modèle du 08/11/2026 · consultation des sources : 2026-11-08 · code : [`modele.py`](modele.py) (fonctions pures), [`simuler.py`](simuler.py), [`cas_types.py`](cas_types.py), [`test_modele.py`](test_modele.py) (10 tests) · résultats : [`resultats-sortie.txt`](resultats-sortie.txt), [`resultats/synthese.csv`](resultats/synthese.csv), [`resultats/tables.md`](resultats/tables.md) · données : [`donnees/`](donnees/) · suite du modèle agrégé du 03/11 : [`../loyer-energie/`](../loyer-energie/)

Légende : **fait sourcé** (lien) · **estimation** (méthode dite) · **hypothèse** (H1 à H15) · **opinion** · ⚠️ non vérifié (registre `verifications.md`, V29001 à V29012). Ce sont des ordres de grandeur, pas des prédictions.

## 0. En dix lignes

1. **Formule testée** (proposition de l'auteur du 07-08/11, précisée le 08/11) : plafond mensuel = **base selon la taille + variable × surface de référence − déduction d'énergie**. La déduction est celle de la section 1 : *autres usages au coût réel + 30 % du coût réel du chauffage + 70 % du coût du besoin de chauffage du bâti*. La surface de référence est celle d'avant isolation intérieure.
2. **Calibrage** : la base de chaque taille est choisie pour que le plafond d'un logement de performance moyenne de cette taille vaille **1,2 fois le loyer médian local** ; la variable par m² vaut 1,2 fois la pente du marché local. À Grenoble : variable ≈ 8,6 €/m²/mois, bases de 302 € (studio) à 388 € (T4) ; à Paris : ≈ 27 €/m² (20 à 33 selon l'arrondissement) ; en Creuse : ≈ 3,2 à 3,7 €/m² (section 4).
3. **Les DPE pris comme vrais** : 71 200 DPE d'appartements retenus (Paris, Lyon, Grenoble, Angers, 2026 ; 71 400 téléchargés) et 5 600 DPE de maisons et d'appartements de la Creuse (2025-2026 ; 5 900 téléchargés), données de l'ADEME. Les loyers viennent de la carte des loyers 2025 (annonces, charges comprises), **recalée** sur les observatoires locaux des loyers (parc en cours, hors charges : Paris 2025, Lyon et Grenoble 2024) : les annonces sont 16 à 41 % au-dessus des loyers en cours.
4. **Effet de l'énergie seule, scénario central** (écart entre le plafond et le même plafond sans différenciation énergétique) : pour une passoire G, **−64 € par mois à Paris, −102 à Lyon, −93 à Grenoble, −85 à Angers, −145 à −146 € en Creuse** ; pour F : −33 à −76 € ; pour A à C : **+20 à +87 € en ville**, +47 à +255 € en Creuse. Par construction l'effet moyen sur l'ensemble est nul.
5. **Part des loyers actuels au-dessus du plafond** : 20 à 22 % dans les quatre villes et les appartements de Creuse (27 % pour les maisons de Creuse) au scénario central, mais **presque tout cela vient du seuil de 120 %** et de la dispersion naturelle des loyers (sans effet énergie : 18 à 23 %). L'énergie ajoute 0 à 4 points en moyenne ; pour les seuls G : +7 points à Paris, +22 à Lyon, +25 à Grenoble, +23 à Angers, **+46 points en Creuse (appartements), +30 (maisons)**.
6. **Baisse moyenne pour une passoire G** (tous logements G, y compris ceux qui ne dépassent pas) : 42 € par mois à Paris, 34 à Lyon, 28 à Grenoble, 29 à Angers ; **82 € en Creuse (maisons)**. Pour ceux qui dépassent : 190 € (Paris), 80 à 105 € (Lyon, Grenoble, Angers), 130 à 170 € (Creuse).
7. **Hausse possible** : pour A à C, la marge entre le plafond et le loyer médian est de 100 à 400 € par mois ; ce n'est qu'une marge permise, le marché n'y monte pas de lui-même.
8. **Coût total loyer + énergie** : à taille égale, l'écart G moins D passe (central) de +52 à +40 € (T2 Grenoble), de +89 à +64 € (T3 Grenoble), de +65 à +48 € (T2 Lyon). Il **diminue de 10 à 60 % selon le scénario, sans s'annuler** : le plafond n'égalise que les loyers qui l'atteignent.
9. **Paradoxe nommé et corrigé (section 7)** : sur un G à Grenoble (51 m², gaz) la pompe à chaleur seule fait passer en D pour 4 600 € sans perdre de surface ; l'isolation seule fait passer en E pour 8 200 € et retire 2 m². Avec la déduction en coût réel seul, la pompe à chaleur rapporte +129 €/mois de plafond contre +96 € ; **avec 30/70, l'isolation rapporte +89 € contre +39 € pour la pompe à chaleur seule**, et son retour est de 7,7 ans contre 9,9 ans. Sans surface de référence figée, le retour de l'isolation passe à 10,1 ans (plus long que la pompe à chaleur) : la surface figée est nécessaire.
10. **Verdict : pas une tempête urbaine du fait de l'énergie ; une tempête localisée pour les passoires rurales, et une tempête de seuil si k = 1,1.** Le seuil de 120 % mord à lui seul 20 % des loyers actuels (11 à 14 % à 1,3 ; 32 à 36 % à 1,1) ; c'est le paramètre politique, avant l'énergie. En Creuse, le plafond d'une maison G chauffée au fioul (≈ 500 €) égale le loyer médian de marché : 49 % de ces loyers seraient coupés (section 9).

## 1. Énoncé de la règle

**Plafond mensuel du loyer (hors charges) = Base(taille) + v × S_réf − D**

- **Base(taille)** : montant par logement selon la taille, par proxy de surface (la base DPE ne donne pas le nombre de pièces : studio < 27 m², T2 de 27 à 45, T3 de 45 à 70, T4 de 70 à 110, T5+ au-delà ; H5). Dans la plateforme, le vrai nombre de pièces serait déclaré.
- **v** : variable par m² de surface de référence.
- **S_réf** : surface habitable avant toute isolation intérieure, inscrite au bail et reprise à chaque revalorisation.
- **D** : déduction mensuelle d'énergie = [ coût réel des usages hors chauffage + **0,3 × coût réel du chauffage + 0,7 × coût du besoin de chauffage et de refroidissement du bâti** (kWh utiles par an × 0,15 €/kWh) ] ÷ 12.
  - coût réel = consommation d'énergie finale du DPE × prix du kWh de chaque énergie (électricité : tarif réglementé de la CRE, autres : hypothèses) ;
  - besoin du bâti = quantité de chaleur (et de froid) que le logement réclame, avant le rendement du système de chauffage : il ne change pas quand on remplace la chaudière, il baisse quand on isole.
- Revalorisation annuelle des prix de l'énergie (moyenne glissante sur trois ans recommandée pour qu'un choc de prix ne change pas les loyers d'un mois à l'autre).

**Énoncé en une phrase** : « le propriétaire peut louer au prix du marché local plus 20 %, moins ce que coûte l'énergie du logement ; et cette énergie se compte à 70 % selon la qualité de l'isolation et à 30 % selon la facture réelle. »

## 2. Le paradoxe de la pompe à chaleur (nommé, sourcé)

**Constat de l'auteur (08/11/2026)** : poser une pompe à chaleur dans une passoire mal isolée suffit souvent à remonter la classe du DPE ; isoler par l'intérieur demande des travaux plus lourds et fait perdre des mètres carrés, donc du loyer au m² ; il est financièrement plus intéressant de ne pas isoler que d'isoler.

**La règle du DPE qui le produit** (fait sourcé, cote A, [ecologie.gouv.fr, page DPE](https://www.ecologie.gouv.fr/politiques-publiques/diagnostic-performance-energetique-dpe), consultée le 08/11/2026) : l'étiquette est fondée sur la quantité d'énergie consommée ou estimée **rapportée à la surface** du logement ; la surface de référence est la surface habitable ; l'énergie est comptée en énergie primaire, avec un facteur de conversion de l'électricité passé de 2,3 à 1,9 au 01/01/2026 ; les seuils ont été adaptés le 01/07/2024 pour les logements de 40 m² et moins. Trois conséquences (estimation par le modèle, section 7) : (a) une pompe à chaleur (rendement saisonnier supposé 3, contre 0,8 environ pour la chaudière du cas type) divise l'énergie finale de chauffage par près de 4 et l'énergie primaire de moitié (facteur 1,9 sur l'électricité), un peu plus qu'une isolation de 45 % du besoin ; (b) elle coûte à peu près moitié moins (4 600 € contre 8 200 € pour 51 m², H13 ⚠️) ; (c) l'isolation par l'intérieur retire de la surface habitable (H12 : 4 %), ce qui augmente la consommation par m² et fait baisser le loyer encadré au m². Sur le cas chiffré de la section 7 : pompe à chaleur seule G vers D ; isolation seule G vers E.

⚠️ À VÉRIFIER (V29003) : les seuils de classes utilisés (A ≤ 70 ... F ≤ 420 kWh d'énergie primaire par m² et par an, sans le critère GES) viennent de l'arrêté du 31/03/2021 non relu ; l'étiquette réelle est la moins bonne des classes énergie et GES, d'où des écarts (le G de la maison creusoise au fioul du cas type est estimé F par le seul critère énergie).

**Observation à signaler** (V29004) : dans la base ADEME, le rapport énergie primaire sur énergie finale des logements tout électriques est de 1,90 à chaque mois de janvier 2025 à novembre 2026 (médiane mensuelle des DPE de la Creuse, 54 à 120 DPE par mois), alors que la page du ministère situe le passage de 2,3 à 1,9 au 01/01/2026. Hypothèse : l'ADEME applique le coefficient courant à tous les DPE de la base ; non tranché.

**Correction proposée** : (1) la déduction mêle le coût réel (compte pour 30 %) et le coût du besoin du bâti (70 %) ; (2) la surface de référence est figée avant isolation. Le résultat (section 7) : pour un même logement de départ, **isoler rapporte plus de plafond, et se rembourse plus vite, que poser seulement une pompe à chaleur**, et poser les deux reste le plus rentable en valeur absolue. La pompe à chaleur reste récompensée (le locataire y gagne 130 € par mois de facture), mais plus faiblement que dans une formule en coût réel seul. Limite honnête : si le besoin du bâti n'est pas mesuré (sans instrumentation), il vient du DPE, qui l'estime de façon conventionnelle (section 10).

## 3. Données (téléchargées le 08/11/2026, aucune donnée hors des extraits listés)

| Donnée | Source (lien) | Contenu retenu | Cote | Conflits d'intérêts connus |
|---|---|---|---|---|
| DPE logements existants | [ADEME, base DPE03 existants (data.ademe.fr)](https://data.ademe.fr/datasets/dpe03existant), API, extraits par commune | Paris (20 arrondissements, DPE de janvier-février 2026, 24 841 appartements), Lyon (9 arrondissements, 2026, 30 652), Grenoble (2026, 10 480), Angers (2026, 5 444), Creuse (255 communes, DPE 2025 et 2026, 5 895 logements) ; 26 champs par DPE | B | établis par des diagnostiqueurs rémunérés par le donneur d'ordre (propriétaire), outil critiqué par la Cour des comptes ; flux de diagnostics (ventes et locations), pas le parc ; doublons possibles |
| Carte des loyers 2025 | [Ministère du logement (DHUP), data.gouv.fr](https://www.data.gouv.fr/datasets/693aa2feed1bf4da603faa49/), fichiers appartement T1-T2, T3+ et maison, extraits Paris, Lyon, Grenoble, Angers, Creuse | loyer prédit en €/m² charges comprises pour un bien de référence (T1-T2 : 37 m², T3+ : 72 m², maison : 92 m²), au T3 2025 | B | calculée sur des annonces de leboncoin et du groupe SeLoger ; ce sont des loyers d'annonce, pas des loyers en cours ; l'intervalle à 95 % est celui de l'indicateur, pas celui des loyers individuels |
| Observatoires locaux des loyers | [OLL, data.gouv.fr](https://www.data.gouv.fr/datasets/56fd90e8c751df174ac485cb/) : Paris intra-muros 2025 (L7501), Lyon 2024 (L6900), Grenoble 2024 (L3800) | quartiles (Paris), déciles (Lyon, Grenoble) du loyer mensuel hors charges par nombre de pièces, surface moyenne | B | données remontées par des gestionnaires de biens et des bailleurs ; parc locatif privé en cours au 1er janvier ; Angers et Creuse : non disponibles |
| Tarif réglementé de l'électricité | [CRE, option Base](https://www.cre.fr/fileadmin/Documents/Open_data/Marches_de_detail/Option_Base.csv) (jeu de données [data.gouv.fr](https://www.data.gouv.fr/datasets/5d31900f8b4c41338237ac8f/)) | part variable TTC 0,2001 €/kWh pour 6 kVA depuis le 01/08/2026 | A | aucun ; abonnement exclu |
| Gaz, fioul, bois, réseau, GPL | non obtenus : la base Pégase du ministère n'est pas disponible en téléchargement direct (aucun jeu repérable dans data.gouv.fr) ; valeurs de [`donnees/prix_energie.csv`](donnees/prix_energie.csv) | 0,13 / 0,12 / 0,09 / 0,11 / 0,16 €/kWh | C à D | hypothèses ⚠️ V29005 |
| Règles du DPE | [ecologie.gouv.fr](https://www.ecologie.gouv.fr/politiques-publiques/diagnostic-performance-energetique-dpe) | surface de référence, facteur 2,3 puis 1,9, seuils petites surfaces | A | aucun |
| Encadrement actuel des loyers | [Service-Public, F1314](https://www.service-public.fr/particuliers/vosdroits/F1314) | communes concernées dont une partie de Grenoble-Alpes Métropole, Lyon-Villeurbanne, Paris ; complément de loyer interdit et loyer de base gelé pour F et G depuis le 24/08/2022 | A | aucun |

Les fichiers lourds restent hors dépôt (`$DONNEES/loyers-energie/`) ; les extraits compressés (2,8 Mo en tout) sont dans `donnees/`. Pour tout retélécharger : `python3 -I telecharger_donnees.py` puis les trois `curl -O` indiqués (urllib est refusé par data.gouv.fr, curl non) puis `python3 -I preparer_donnees.py`, puis `python3 -I simuler.py > resultats-sortie.txt` et `python3 -I gen_tables.py`. Tests : `python3 -I test_modele.py`.

**Pas d'observatoire parisien en détail** : seuls les niveaux de l'OLL de Paris intra-muros (par nombre de pièces) ont été utilisés, pas les loyers de référence de l'encadrement par quartier ; Angers et Creuse n'ont pas d'OLL, d'où le recalage moyen H8.

## 4. Hypothèses numérotées

| # | Hypothèse | Statut |
|---|---|---|
| H1 | Les DPE existants sont pris comme **vrais** ; l'échantillon (DPE récents) représente le parc locatif de la ville | choix demandé ; l'échantillon est un flux de ventes et de locations ⚠️ V29002 |
| H2 | Prix du kWh TTC : électricité 0,2001 (CRE) ; gaz 0,13 ; fioul 0,12 ; GPL 0,16 ; bois 0,09 ; réseau 0,11 ; scénarios ×0,85 / ×1 / ×1,25 | électricité sourcé ; reste ⚠️ V29005 |
| H3 | Prix de référence du besoin de chauffage : 0,15 €/kWh | hypothèse, ordre de grandeur du mix ⚠️ |
| H4 | Poids du coût réel dans le chauffage α = 0,3 (coût du besoin : 0,7) | **paramètre de conception**, choisi pour que l'isolation batte la pompe à chaleur (section 7) ; α = 0,5 ne suffit pas |
| H5 | Tailles par surface habitable : studio < 27, T2 < 45, T3 < 70, T4 < 110, T5+ ≥ 110 m² | proxy du nombre de pièces |
| H6 | Plafond de performance moyenne = k × loyer médian local, k = 1,2 (bas 1,3 ; haut 1,1) | demande de l'auteur (≈ 120 %) |
| H7 | Loyer de marché = droite M(S) = a + v_m S passant par les deux biens de référence de la carte (37 m² : loyer T1-T2 ; 72 m² : loyer T3+) ; maisons : un seul point (92 m²), part de base empruntée aux appartements de la zone | estimation |
| H8 | **Recalage flux vers stock** : loyers de la carte × γ (Paris 0,79 ; Lyon 0,76 ; Grenoble 0,84 ; Angers et Creuse : moyenne 0,80), γ = loyer médian de l'OLL ÷ droite de la carte, moyenne sur 1 à 4 pièces | estimation ; sans recalage, voir 4 bis |
| H9 | Prime de classe sur le loyer actuel : A +4 %, B +3 %, C +1 %, D 0, E −2 %, F −4 %, G −6 % (scénario bas ×2, haut ×0) | ⚠️ V29006 hypothèse sans source (la valeur verte sur les loyers est faible) |
| H10 | Dispersion des loyers autour de la médiane de leur classe : lognormale, écart-type du logarithme par taille. OLL Lyon et Grenoble : studio 0,20, T2 0,18, T3 0,20, T4+ 0,30 (calcul : ln(D9/D1) ÷ 2,563) ; Paris : 0,21 / 0,25 / 0,26 / 0,36 (ln(Q3/Q1) ÷ 1,349) ; Angers et Creuse : valeurs de Lyon-Grenoble ⚠️ ; scénarios ×0,8 / ×1 / ×1,2 | estimation sur l'OLL ; mêle un peu d'effet énergie et de qualité |
| H11 | Besoin de chauffage : champ `besoin_chauffage` du DPE (kWh/an) s'il est plausible (15 à 450 kWh/m², conso/besoin de 0,25 à 2) ; sinon consommation de chauffage × rendement moyen (électricité 1 ; gaz 0,85 ; fioul 0,8 ; bois 0,7 ; réseau 0,9). **Imputé pour 22 % (Paris), 33 % (Lyon), 34 % (Grenoble), 16 % (Angers), 4 % (Creuse)** des DPE : le champ de la base est celui de l'immeuble entier pour une partie des lots en copropriété (47 120 kWh répétés pour des lots de 55 m²) | constat sur les données ; limite importante |
| H12 | Cas de travaux : pompe à chaleur de rendement saisonnier 3,0 ; isolation intérieure = −45 % du besoin de chauffage et −4 % de surface (≈ 2 m² sur 50 m², position de l'auteur du 07/11) | ⚠️ V29007 |
| H13 | Coûts des travaux : isolation 160 €/m² habitable, pompe à chaleur 90 €/m² (8 000 € et 4 500 € pour 50 m²), sans aides (la proposition supprime CEE et MaPrimeRénov') | ⚠️ V29007 |
| H14 | Loyers actuels : un loyer en cours est lognormal de médiane = marché × (1 + prime de classe) ; la part au-dessus du plafond est calculée par la loi, sans tirage | méthode |
| H15 | Scénarios : bas = k 1,3 ; prix ×0,85 ; primes ×2 ; dispersion ×0,8 ; central = 1,2 ; ×1 ; ×1 ; ×1 ; haut = 1,1 ; ×1,25 ; primes 0 ; dispersion ×1,2 | choix de conception |

**Paramètres calibrés (scénario central, k = 1,2, α = 0,3)** :

| Zone | Variable v (€/m²/mois) | Base studio | T2 | T3 | T4 | T5+ |
|---|---|---|---|---|---|---|
| Paris (moyenne des 20 arrondissements, v de 20,7 à 33,0) | 27,1 | 291 | 323 | 357 | 403 | 536 |
| Lyon (9 arrondissements, v de 8,4 à 12,1) | 10,2 | 310 | 344 | 374 | 409 | 503 |
| Grenoble | 8,6 | 302 | 335 | 363 | 388 | 508 |
| Angers | 8,8 | 305 | 327 | 349 | 384 | 473 |
| Creuse, appartements | 3,7 | 286 | 314 | 369 | 424 | 558 |
| Creuse, maisons | 3,2 | 390 | 466 | 527 | 594 | 736 |

Les bases (en €/mois) sont de l'ordre de la moitié du plafond d'un T2 (335 € sur 684 € à Grenoble) : le loyer est surtout un coût fixe par logement, pas par m² (la pente du marché local, 7,2 €/m² à Grenoble après recalage, est bien plus faible que le loyer moyen au m² de 10 à 13 €). C'est ce que montre la droite à deux points de la carte ; elle donne raison à l'auteur, pour qui un prix maximal fondé sur le seul m² est mal conçu (opinion de l'auteur ; constat sur les données : un loyer proportionnel à la surface surestime les grands logements et sous-estime les petits).

**4 bis. Sans recalage** (carte brute, annonces charges comprises) : les parts au-dessus du plafond ne changent pas (elles ne dépendent que de k et de la dispersion), mais les montants en euros sont multipliés par 1,2 à 1,3 : baisse moyenne de 97 € (Paris), 34 € (Lyon), 31 € (Grenoble), 29 € (Angers), 20 € et 48 € (Creuse).

**Recoupement carte / OLL** (rapport entre la droite de la carte, à la surface moyenne de l'OLL, et le loyer médian OLL) : Paris 1,20 / 1,27 / 1,26 / 1,35 (1, 2, 3, 4+ pièces) ; Lyon 1,28 / 1,28 / 1,31 / 1,41 ; Grenoble 1,21 / 1,16 / 1,18 / 1,24. L'écart est de nature : annonces contre stock (les loyers de relocation sont plus élevés que ceux des baux en cours), charges comprises contre hors charges. **C'est une limite directe pour le plafond : un plafond qui ne s'applique qu'à la relocation devrait se caler sur les annonces ; un plafond qui s'appliquerait au stock, sur les loyers en cours** (section 10).

## 5. Résultats par ville et par classe énergie (scénario central)

Lecture : « Loyers au-dessus du plafond » est la part des loyers actuels qui dépasseraient le plafond (probabilité sous H14), entre parenthèses la même part avec un plafond **sans effet énergie** (la même base et le même v, la même déduction pour tous) ; l'« écart dû à l'énergie » est la différence ; « marge de hausse » : plafond moins loyer médian, quand il est positif. Les parts de classes sont celles des DPE récents, pas celles du parc (H1). Les classes A et B de Paris ont peu de DPE (5 et 116) : à lire avec prudence.

#### Paris (scénario central)

| Classe | Logements (DPE) | Part | Énergie réelle €/mois | Plafond moyen €/mois | Loyer médian de marché €/mois | Loyers au-dessus du plafond (sans effet énergie) | Écart dû à l'énergie, loyers au-dessus | Baisse moyenne €/mois (tous) | Baisse moyenne (concernés) | Marge de hausse €/mois |
|---|---|---|---|---|---|---|---|---|---|---|
| A | 5 | 0.0% | 46 | 2446 | 2049 | 27% (32%) | -5 pts | 192 | 708 | 396 |
| B | 116 | 0.5% | 60 | 2401 | 1986 | 26% (30%) | -4 pts | 159 | 608 | 415 |
| C | 4163 | 16.9% | 73 | 1727 | 1415 | 23% (26%) | -3 pts | 95 | 416 | 312 |
| D | 7360 | 29.9% | 108 | 1658 | 1367 | 23% (24%) | -2 pts | 91 | 401 | 291 |
| E | 7661 | 31.1% | 131 | 1466 | 1207 | 22% (21%) | +1 pts | 72 | 328 | 258 |
| F | 3584 | 14.6% | 142 | 1233 | 1013 | 21% (18%) | +3 pts | 52 | 252 | 220 |
| G | 1731 | 7.0% | 161 | 1011 | 842 | 22% (15%) | +7 pts | 42 | 194 | 169 |

Par taille : T2 (n 8154) plafond 1136 € pour un loyer médian de 930 €, 21% au-dessus ; T3 (n 6280) plafond 1669 € pour un loyer médian de 1376 €, 23% au-dessus ; T4 (n 3345) plafond 2468 € pour un loyer médian de 2046 €, 30% au-dessus ; T5+ (n 1128) plafond 4370 € pour un loyer médian de 3612 €, 30% au-dessus ; studio (n 5713) plafond 727 € pour un loyer médian de 594 €, 17% au-dessus

#### Lyon (scénario central)

| Classe | Logements (DPE) | Part | Énergie réelle €/mois | Plafond moyen €/mois | Loyer médian de marché €/mois | Loyers au-dessus du plafond (sans effet énergie) | Écart dû à l'énergie, loyers au-dessus | Baisse moyenne €/mois (tous) | Baisse moyenne (concernés) | Marge de hausse €/mois |
|---|---|---|---|---|---|---|---|---|---|---|
| A | 78 | 0.3% | 38 | 1114 | 897 | 18% (27%) | -9 pts | 39 | 210 | 217 |
| B | 1841 | 6.0% | 38 | 757 | 620 | 18% (24%) | -5 pts | 22 | 122 | 137 |
| C | 12620 | 41.2% | 62 | 775 | 633 | 18% (21%) | -3 pts | 23 | 129 | 142 |
| D | 9520 | 31.1% | 109 | 820 | 687 | 20% (20%) | +1 pts | 30 | 147 | 132 |
| E | 4638 | 15.1% | 133 | 723 | 618 | 22% (16%) | +5 pts | 26 | 122 | 105 |
| F | 1379 | 4.5% | 169 | 678 | 597 | 26% (14%) | +12 pts | 30 | 117 | 80 |
| G | 546 | 1.8% | 193 | 568 | 525 | 32% (11%) | +22 pts | 34 | 104 | 50 |

Par taille : T2 (n 6668) plafond 635 € pour un loyer médian de 526 €, 15% au-dessus ; T3 (n 9409) plafond 841 € pour un loyer médian de 700 €, 18% au-dessus ; T4 (n 5395) plafond 1128 € pour un loyer médian de 943 €, 28% au-dessus ; T5+ (n 1041) plafond 1763 € pour un loyer médian de 1472 €, 27% au-dessus ; studio (n 8109) plafond 443 € pour un loyer médian de 371 €, 19% au-dessus

#### Grenoble (scénario central)

| Classe | Logements (DPE) | Part | Énergie réelle €/mois | Plafond moyen €/mois | Loyer médian de marché €/mois | Loyers au-dessus du plafond (sans effet énergie) | Écart dû à l'énergie, loyers au-dessus | Baisse moyenne €/mois (tous) | Baisse moyenne (concernés) | Marge de hausse €/mois |
|---|---|---|---|---|---|---|---|---|---|---|
| A | 150 | 1.4% | 37 | 923 | 741 | 18% (27%) | -9 pts | 30 | 165 | 182 |
| B | 1351 | 12.9% | 50 | 862 | 699 | 19% (26%) | -7 pts | 30 | 157 | 163 |
| C | 3951 | 37.7% | 61 | 695 | 568 | 18% (21%) | -4 pts | 20 | 115 | 127 |
| D | 3140 | 30.0% | 117 | 746 | 636 | 23% (20%) | +3 pts | 32 | 141 | 110 |
| E | 1275 | 12.2% | 138 | 655 | 568 | 24% (16%) | +7 pts | 27 | 115 | 87 |
| F | 413 | 3.9% | 166 | 586 | 529 | 29% (14%) | +15 pts | 32 | 112 | 58 |
| G | 192 | 1.8% | 170 | 477 | 446 | 36% (10%) | +25 pts | 28 | 79 | 34 |

Par taille : T2 (n 1895) plafond 572 € pour un loyer médian de 475 €, 16% au-dessus ; T3 (n 3384) plafond 763 € pour un loyer médian de 638 €, 19% au-dessus ; T4 (n 2485) plafond 978 € pour un loyer médian de 823 €, 29% au-dessus ; T5+ (n 317) plafond 1410 € pour un loyer médian de 1176 €, 27% au-dessus ; studio (n 2391) plafond 424 € pour un loyer médian de 355 €, 19% au-dessus

#### Angers (scénario central)

| Classe | Logements (DPE) | Part | Énergie réelle €/mois | Plafond moyen €/mois | Loyer médian de marché €/mois | Loyers au-dessus du plafond (sans effet énergie) | Écart dû à l'énergie, loyers au-dessus | Baisse moyenne €/mois (tous) | Baisse moyenne (concernés) | Marge de hausse €/mois |
|---|---|---|---|---|---|---|---|---|---|---|
| A | 20 | 0.4% | 27 | 864 | 691 | 15% (25%) | -10 pts | 19 | 125 | 174 |
| B | 235 | 4.3% | 55 | 841 | 691 | 18% (24%) | -6 pts | 23 | 130 | 150 |
| C | 2651 | 48.7% | 66 | 753 | 616 | 18% (21%) | -4 pts | 22 | 125 | 137 |
| D | 1543 | 28.3% | 100 | 689 | 584 | 21% (19%) | +2 pts | 25 | 119 | 105 |
| E | 701 | 12.9% | 121 | 606 | 525 | 23% (16%) | +7 pts | 24 | 103 | 80 |
| F | 208 | 3.8% | 143 | 534 | 479 | 27% (13%) | +14 pts | 26 | 96 | 56 |
| G | 85 | 1.6% | 152 | 446 | 416 | 34% (11%) | +23 pts | 29 | 84 | 37 |

Par taille : T2 (n 1293) plafond 572 € pour un loyer médian de 475 €, 16% au-dessus ; T3 (n 1900) plafond 769 € pour un loyer médian de 644 €, 19% au-dessus ; T4 (n 994) plafond 993 € pour un loyer médian de 832 €, 28% au-dessus ; T5+ (n 125) plafond 1376 € pour un loyer médian de 1149 €, 28% au-dessus ; studio (n 1131) plafond 432 € pour un loyer médian de 359 €, 18% au-dessus

#### Creuse, appartements (scénario central)

| Classe | Logements (DPE) | Part | Énergie réelle €/mois | Plafond moyen €/mois | Loyer médian de marché €/mois | Loyers au-dessus du plafond (sans effet énergie) | Écart dû à l'énergie, loyers au-dessus | Baisse moyenne €/mois (tous) | Baisse moyenne (concernés) | Marge de hausse €/mois |
|---|---|---|---|---|---|---|---|---|---|---|
| A | 6 | 0.4% | 58 | 765 | 518 | 8% (29%) | -21 pts | 9 | 112 | 248 |
| B | 19 | 1.3% | 59 | 592 | 428 | 10% (26%) | -16 pts | 9 | 91 | 164 |
| C | 268 | 18.1% | 68 | 466 | 353 | 11% (21%) | -10 pts | 7 | 61 | 113 |
| D | 532 | 36.0% | 109 | 463 | 364 | 14% (20%) | -5 pts | 10 | 69 | 99 |
| E | 336 | 22.7% | 144 | 429 | 354 | 20% (17%) | +2 pts | 14 | 73 | 75 |
| F | 203 | 13.7% | 209 | 405 | 367 | 33% (16%) | +17 pts | 28 | 84 | 41 |
| G | 115 | 7.8% | 304 | 317 | 363 | 60% (14%) | +46 pts | 79 | 131 | 11 |

Par taille : T2 (n 397) plafond 367 € pour un loyer médian de 303 €, 16% au-dessus ; T3 (n 480) plafond 444 € pour un loyer médian de 365 €, 20% au-dessus ; T4 (n 328) plafond 542 € pour un loyer médian de 446 €, 28% au-dessus ; T5+ (n 66) plafond 730 € pour un loyer médian de 598 €, 27% au-dessus ; studio (n 208) plafond 310 € pour un loyer médian de 256 €, 17% au-dessus

#### Creuse, maisons (scénario central)

| Classe | Logements (DPE) | Part | Énergie réelle €/mois | Plafond moyen €/mois | Loyer médian de marché €/mois | Loyers au-dessus du plafond (sans effet énergie) | Écart dû à l'énergie, loyers au-dessus | Baisse moyenne €/mois (tous) | Baisse moyenne (concernés) | Marge de hausse €/mois |
|---|---|---|---|---|---|---|---|---|---|---|
| A | 40 | 1.0% | 59 | 979 | 628 | 7% (31%) | -24 pts | 10 | 147 | 352 |
| B | 83 | 2.0% | 91 | 908 | 604 | 9% (30%) | -21 pts | 13 | 143 | 305 |
| C | 361 | 8.7% | 151 | 851 | 596 | 12% (27%) | -16 pts | 18 | 152 | 255 |
| D | 902 | 21.8% | 211 | 778 | 570 | 15% (26%) | -11 pts | 22 | 147 | 208 |
| E | 845 | 20.4% | 276 | 710 | 554 | 20% (23%) | -4 pts | 30 | 151 | 158 |
| F | 860 | 20.8% | 349 | 629 | 538 | 29% (21%) | +8 pts | 46 | 157 | 99 |
| G | 1047 | 25.3% | 442 | 503 | 507 | 49% (18%) | +30 pts | 82 | 168 | 34 |

Par taille : T2 (n 91) plafond 454 € pour un loyer médian de 366 €, 16% au-dessus ; T3 (n 590) plafond 521 € pour un loyer médian de 419 €, 19% au-dessus ; T4 (n 1804) plafond 620 € pour un loyer médian de 503 €, 28% au-dessus ; T5+ (n 1647) plafond 803 € pour un loyer médian de 654 €, 29% au-dessus ; studio (n 6) plafond 397 € pour un loyer médian de 325 €, 16% au-dessus


**Écart du plafond dû à l'énergie, par classe (€ par mois, plafond moins plafond sans effet énergie ; part des logements à moins de −50 €)** :

| Zone | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| Paris | +81 | +87 | +46 | +17 | −13 | −33 (20 %) | −64 (52 %) |
| Lyon | +79 | +35 | +23 | −5 | −34 (21 %) | −69 (55 %) | −102 (84 %) |
| Grenoble | +68 | +48 | +20 | −17 | −40 (28 %) | −76 (56 %) | −93 (80 %) |
| Angers | +67 | +36 | +21 | −12 | −38 (28 %) | −65 (47 %) | −85 (61 %) |
| Creuse, appartements | +168 | +93 | +47 | +26 | −5 | −54 (43 %) | −146 (81 %) |
| Creuse, maisons | +255 | +205 | +143 | +93 | +31 | −44 (37 %) | −145 (83 %) |

**Trois scénarios** (part au-dessus du plafond tous logements / baisse moyenne tous logements en €/mois ; entre parenthèses, sans effet énergie) :

| Zone | Bas (k 1,3) | Central (k 1,2) | Haut (k 1,1) |
|---|---|---|---|
| Paris | 8 % / 25 € (9 % / 25) | 22 % / 77 € (22 % / 77) | 38 % / 163 € (38 % / 162) |
| Lyon | 7 % / 7 € (7 % / 7) | 20 % / 26 € (20 % / 25) | 36 % / 60 € (35 % / 58) |
| Grenoble | 8 % / 8 € (8 % / 8) | 21 % / 27 € (21 % / 26) | 36 % / 59 € (36 % / 56) |
| Angers | 7 % / 7 € (7 % / 7) | 20 % / 23 € (20 % / 23) | 36 % / 54 € (35 % / 51) |
| Creuse, appartements | 7 % / 5 € (6 % / 3) | 21 % / 18 € (18 % / 13) | 37 % / 43 € (36 % / 33) |
| Creuse, maisons | 11 % / 12 € (9 % / 8) | 27 % / 43 € (23 % / 31) | 42 % / 95 € (39 % / 72) |

**Sensibilité au seuil et à la dispersion** (part au-dessus du plafond / baisse moyenne en €/mois, prix et primes centraux ; dispersion ×0,8, ×1, ×1,2) : à Grenoble, k = 1,1 : 30 %, 34 %, 36 % ; k = 1,2 : 16 %, 21 %, 25 % ; k = 1,3 : 8 %, 12 %, 16 % ; k = 1,5 : 2 %, 4 %, 7 %. Table complète pour les six zones : `resultats-sortie.txt`, rubrique « SENSIBILITÉ ». **Un plafond « haut et permissif » ne mord presque plus à k = 1,5 (1 à 9 % des loyers)**.

**Variante de la déduction** (section « VARIANTES alpha » de `resultats-sortie.txt`) : à l'échelle des villes entières, le choix de α (1, 0,5, 0,3, 0) change peu les écarts par classe (G à Grenoble : −93 € à α = 0,3 ; l'écart de plafond entre un logement chauffé à l'électricité et un logement chauffé au gaz de même classe passe de +46 € à α = 1 à +30 € à α = 0 pour la classe E) ; son effet porte sur la **décision de travaux** d'un propriétaire (section 7), pas sur la répartition d'ensemble. À classe et taille égales, les logements tout électriques ont un besoin plus faible (132 contre 155 kWh/m² pour les E à Grenoble) : leur plafond est supérieur de 25 à 60 € ; ce n'est pas l'effet d'une pompe à chaleur mais celui de bâtis différents.

**Coût total loyer + énergie** (écart G moins D en €/mois, avant puis après plafond) :

| Zone | Bas T2 / T3 | Central T2 / T3 | Haut T2 / T3 |
|---|---|---|---|
| Paris | −52→−46 / −74→−64 | +19→+17 / +30→+27 | +100→+56 / +151→+82 |
| Lyon | +18→+12 / +1→+1 | +65→+48 / +61→+41 | +122→+63 / +135→+53 |
| Grenoble | +10→+10 / +30→+30 | +52→+40 / +89→+64 | +102→+47 / +162→+68 |
| Angers | +9→+8 / n.d. | +50→+35 / n.d. | +101→+39 / n.d. |
| Creuse, appartements | +44→+42 / +126→+111 | +77→+57 / +177→+116 | +120→+59 / +247→+108 |
| Creuse, maisons | +66→+65 / +79→+76 | +109→+90 / +129→+104 | +164→+100 / +195→+116 |

À Paris l'écart G moins D est faible ou négatif avant plafond, parce que les primes de marché (H9) et les loyers élevés absorbent la facture : l'énergie y pèse peu (150 € de déduction sur 1 000 à 2 000 € de loyer). Plus la facture pèse dans le loyer (Creuse, villes moyennes), plus le plafond la fait compter.

## 6. Exemples concrets par ville (scénario central)

Un logement réel de la base par ligne (le plus proche de la médiane de surface et de besoin de son groupe, énergie de chauffage la plus fréquente du groupe) ; « plafond moins marché » compare au loyer médian de marché de ce type et de cette classe ; la dernière colonne donne la part des loyers de ce type de logement qui dépasseraient le plafond.

| Ville | Logement | Surface | Énergie | Énergie réelle €/mois | Déduction €/mois | Plafond €/mois | Loyer médian de marché | Plafond − marché | Au-dessus du plafond |
|---|---|---|---|---|---|---|---|---|---|
| Paris | studio E | 20 m² | électricité | 56 | 53 | 721 | 587 | +135 | 16 % |
| Paris | T2 C | 33 | électricité | 43 | 39 | 1 099 | 884 | +215 | 19 % |
| Paris | T2 G | 33 | électricité | 147 | 136 | 1 022 | 835 | +188 | 21 % |
| Paris | T3 D | 57 | gaz | 99 | 95 | 1 875 | 1 530 | +345 | 22 % |
| Paris | T3 F | 55 | gaz | 215 | 192 | 1 358 | 1 145 | +214 | 26 % |
| Paris | T4 G | 74 | gaz | 394 | 363 | 1 636 | 1 457 | +179 | 37 % |
| Lyon | T2 C | 36 | électricité | 49 | 46 | 638 | 521 | +117 | 13 % |
| Lyon | T2 G | 34 | électricité | 146 | 134 | 535 | 463 | +72 | 21 % |
| Lyon | T3 F | 56 | gaz | 203 | 201 | 725 | 665 | +60 | 33 % |
| Lyon | T4 G | 85 | gaz | 394 | 372 | 841 | 849 | −8 | 51 % |
| Grenoble | studio E | 20 | électricité | 60 | 55 | 420 | 358 | +63 | 21 % |
| Grenoble | T2 C | 35 | électricité | 46 | 43 | 590 | 473 | +117 | 11 % |
| Grenoble | T2 G | 33 | électricité | 151 | 137 | 481 | 429 | +52 | 26 % |
| Grenoble | T3 B | 63 | réseau | 51 | 55 | 849 | 691 | +158 | 15 % |
| Grenoble | T3 D | 58 | gaz | 124 | 105 | 760 | 639 | +121 | 19 % |
| Grenoble | T3 F | 55 | gaz | 217 | 192 | 643 | 589 | +53 | 33 % |
| Angers | T3 D | 58 | gaz | 102 | 101 | 759 | 643 | +116 | 20 % |
| Angers | T4 C | 81 | réseau | 73 | 81 | 1 012 | 816 | +196 | 24 % |
| Creuse (maison) | T4 C | 85 | électricité | 126 | 112 | 752 | 507 | +245 | 9 % |
| Creuse (maison) | T4 G | 89 | fioul | 373 | 392 | 485 | 482 | +3 | 49 % |
| Creuse (appartement) | T3 F | 60 | gaz | 261 | 224 | 365 | 365 | +1 | 50 % |
| Creuse (appartement) | T4 G | 90 | fioul | 365 | 373 | 382 | 443 | −61 | 69 % |

La liste complète (8 types par ville) est dans `resultats-sortie.txt`, rubrique « EXEMPLES CONCRETS ». Un T2 G électrique à Grenoble (33 m², 267 kWh/m² de besoin) voit son plafond à 481 € pour un marché de 429 € : plus 52 € de marge ; la même surface en C (42 kWh/m²) a 590 € pour 473 €. Le propriétaire du G peut louer 109 € de moins que celui du C pour la même surface, ce qui est l'effet voulu.

## 7. Variante de l'auteur : besoin du bâti, pompe à chaleur, isolation, surface perdue

Cas types construits à partir d'un DPE réel de la base (médiane de surface et de besoin des G de la zone, à chauffage au gaz ou au fioul), puis modifiés par les hypothèses H12 et H13. Plafond calculé avec le calibrage de la ville (Grenoble : base 414 €, v = 10,26 €/m² ; Creuse, maisons : base 680 €, v = 4,00 €/m², avec les recalages de la section 4). « Règle actuelle » : loyer encadré au m² sur la surface réelle : l'isolation fait perdre 18 € par mois (13 € en Creuse), la pompe à chaleur 0.

### 7.1 Appartement G chauffé au gaz, Grenoble, 51 m², besoin 297 kWh/m², consommation de chauffage 384 kWh EF/m²

**Formule proposée (α = 0,3, surface de référence figée)** :

| Cas | Surface | Classe DPE estimée | Énergie réelle €/mois | Déduction €/mois | Plafond €/mois | Gain de plafond | Coût des travaux | Retour (ans) | Retour sans surface figée |
|---|---|---|---|---|---|---|---|---|---|
| G sans travaux | 51,4 | G | 239 | 223 | 718 | — | — | — | — |
| G + pompe à chaleur seule | 51,4 | D | 110 | 184 | 757 | **+39** | 4 626 € | 9,9 | 9,9 |
| G + isolation seule | 49,3 | E | 143 | 134 | 807 | **+89** | 8 224 € | **7,7** | 10,1 |
| G + isolation + pompe à chaleur | 49,3 | C | 72 | 113 | 829 | **+110** | 12 850 € | 9,7 | 12,0 |

**Même cas avec la déduction en coût réel seul (α = 1)** : sans travaux 705 € ; pompe à chaleur seule 834 € (**+129**, retour 3,0 ans) ; isolation seule 802 € (+96, retour 7,1 ans) ; les deux 873 € (+167, retour 6,4 ans). C'est le paradoxe : la pompe à chaleur rapporte plus et coûte moins. À α = 0,5 (50/50), la pompe à chaleur reste devant en retour (6,0 ans contre 7,5 ans pour l'isolation) bien que l'isolation rapporte plus de plafond (+91 contre +65) : **α = 0,3 est le premier réglage simple où l'isolation gagne sur les deux mesures**. À α = 0 (besoin seul), la pompe à chaleur ne rapporte rien : trop sévère, car elle fait baisser réellement la facture du locataire.

### 7.2 Maison G chauffée au fioul, Creuse, 99 m², besoin 310 kWh/m², consommation de chauffage 344 kWh EF/m²

| Cas | Surface | Classe DPE estimée | Énergie réelle €/mois | Plafond (α = 0,3) | Gain | Coût des travaux | Retour (ans) | Retour sans surface figée | Gain (α = 1) |
|---|---|---|---|---|---|---|---|---|---|
| G sans travaux | 98,9 | F | 382 | 663 | — | — | — | — | — |
| + pompe à chaleur seule | 98,9 | D | 213 | 714 | +51 | 8 901 € | 14,6 | 14,6 | +169 (4,4 ans) |
| + isolation seule | 94,9 | D | 230 | 830 | **+167** | 15 824 € | **7,9** | 8,7 | +153 (8,6 ans) |
| + isolation + pompe à chaleur | 94,9 | C | 136 | 858 | +195 | 24 725 € | 10,6 | 11,5 | +246 (8,4 ans) |

(La classe « G » réelle de ce logement est estimée F par le seul critère énergie : l'étiquette réelle tient aussi compte du GES, très pénalisant pour le fioul.) **Dans les deux cas : isoler d'abord.** La pompe à chaleur ajoutée à l'isolation rapporte peu en plus (+21 € à Grenoble, +28 € en Creuse) pour 4 600 à 8 900 € : le bailleur n'y a intérêt que s'il y gagne autrement (confort, durée de vie de la chaudière).

**Surface de référence** : sans elle, l'isolation fait perdre v × 2 m² de plafond (21 € à Grenoble, 16 € en Creuse) ; avec α = 0,3 le retour de l'isolation passe de 7,7 à 10,1 ans à Grenoble, plus long que celui de la pompe à chaleur (9,9 ans). La surface de référence n'est pas un détail : elle fait la différence. La valeur vénale reste, elle, mesurée sur la surface réelle (Carrez) : le bailleur perd 4 % de valeur au m² ; ce que la formule ne corrige pas.

**Écart d'intérêt entre bailleur et locataire** : la pompe à chaleur fait gagner 129 € par mois au locataire de Grenoble (239 € à 110 €) et 39 € de plafond au bailleur ; l'isolation, 96 € au locataire et 89 € au bailleur. L'isolation est, parmi les deux, le travail où les intérêts s'alignent presque (le bailleur reçoit autant que le locataire économise) : un des arguments de la formule 30/70. L'article 23-1 de la loi de 1989 (contribution du locataire à hauteur de la moitié des économies, après travaux amenant le logement entre A et E) n'est pas repris ici ; il est à articuler ou à supprimer (V29011).

**Sensibilité aux données** : le besoin vient du DPE (champ `besoin_chauffage`, plausible pour 66 à 96 % des DPE selon la zone, imputé pour les autres) : c'est la donnée la plus fragile du modèle ; une mesure instrumentée (position de l'auteur du 03/11 : diagnostic mesuré, thermographie, test d'étanchéité) la remplacerait. Le modèle teste donc la **forme** de la règle, pas la **précision** de ses entrées.

## 8. Effet sur les loyers : avant et après la bascule

À la bascule, pour un logement donné, le plafond neuf se compare au loyer en cours. Notre mesure suppose que **tous** les loyers actuels sont soumis au plafond. Si le plafond ne s'applique qu'à la relocation, l'effet annuel est une fraction de celui-ci (le taux de rotation du parc locatif privé est de l'ordre de un quart à un tiers par an ⚠️ V29008, non sourcé ici), et la référence pertinente est la carte des loyers brute (annonces ; section 4 bis).

## 9. Conclusion : « tempête » ou non

**Opinion de l'auteur appuyée sur les chiffres ci-dessus.**

- **Du fait de l'énergie, non, pas dans les villes.** L'écart dû à l'énergie vaut en moyenne 0 sur le parc (il redistribue) ; pour les G de ville, −64 à −102 €/mois par rapport à un plafond neutre (5 % du loyer médian d'un T3 à Paris, 12 à 15 % à Lyon et Grenoble), pour les F −33 à −76 € ; les logements A à C gagnent 20 à 90 € de marge. 52 à 84 % des G urbains perdent plus de 50 €/mois. Le plafond d'un G est inférieur à celui d'un D de presque tout l'écart de facture d'énergie (48 € contre 53 € à Paris, 79 contre 84 à Lyon, 46 contre 54 à Grenoble) : c'est le but, le propriétaire supporte la différence de coût.
- **Du fait du seuil de 120 %, oui, un cinquième des loyers est touché**, avec près d'un T4 sur trois (dispersion de 0,30), quelle que soit la performance énergétique. Cette « tempête » est celle de l'encadrement lui-même : à k = 1,3 elle tombe à 11-14 % ; à k = 1,5 à 3-6 % ; à k = 1,1 elle monte à 33-36 %. Le paramètre à voter en priorité est k.
- **Pour les passoires rurales chauffées au fioul, oui, c'est une tempête localisée** : plafond égal au loyer médian de marché, 49 % des maisons G et 60 % des appartements G de Creuse au-dessus du plafond ; baisse moyenne de 82 € par mois (tous G) ; et ces classes pèsent 25 % des DPE de maisons de la zone (flux de DPE 2025-2026 : ventes surtout). Ces propriétaires sont aussi, en grande partie, des ménages modestes sans trésorerie (position du 05/11 : prêt public remboursé à la vente ou sur les économies d'énergie).
- **« Loyer + énergie » devient plus comparable entre classes**, d'un tiers à la moitié, sans s'égaliser (section 5).

**Recommandation (à trancher par l'auteur)** : (1) k = 1,3 au démarrage plutôt que 1,2 pour entrer sans choc, puis 1,2 au bout de trois ans (votation) ; (2) α = 0,3 et surface de référence figée ; (3) plafond appliqué à la relocation et au renouvellement, jamais rétroactivement au bail en cours ; (4) un prêt adossé au loyer futur pour les petits bailleurs de G ruraux.

## 10. Limites

- **Fiabilité du DPE** : l'outil est jugé « encore immature » par la Cour des comptes ([rapport 2025, copie de travail du dépôt](../../sources/cdc_dpe_2025.txt) ⚠️ V29009 : non relu pour cette note) ; la proposition prend pourtant le DPE comme vrai à la bascule, puis le remplace par un audit mesuré. Une erreur d'une classe vaut 30 à 100 € de plafond.
- **Loyers d'annonce contre loyers en cours** : la carte est un flux ; l'OLL est un stock (Paris 2025, Lyon et Grenoble 2024) ; recalage γ de 0,76 à 0,84 (H8). Pas d'OLL pour Angers et la Creuse (γ moyen). Les loyers de la carte sont charges comprises, ceux de l'OLL hors charges ; la partie « charges » n'est pas isolée.
- **L'échantillon de DPE n'est pas le parc locatif** : DPE récents de ventes et de locations ; les G de Creuse y pèsent 21 % (immobilier ancien vendu), plus que dans le parc locatif réel ; les studios de Paris y sont nombreux (toutes locations ; ⚠️ V29002).
- **Taille par surface** (H5) : proxy du nombre de pièces ; un T3 de 44 m² est classé T2.
- **Besoin du bâti imputé** pour 4 à 34 % des DPE selon la zone (H11), surtout les classes A à C en copropriété ; le champ de la base est celui de l'immeuble pour une partie d'entre eux.
- **Prix de l'énergie** : seule l'électricité est sourcée (A) ; gaz, fioul, bois, réseau : hypothèses (C à D) ; 30 à 40 % des logements urbains sont au gaz ou au réseau.
- **Primes de classe et dispersion** : H9 sans source ; H10 tiré de l'OLL pour trois villes seulement ; la dispersion mêle des effets de qualité qui recouvrent l'énergie (double comptage léger).
- **Pas d'effet de comportement** : pas de retrait de logements du marché, pas de hausse des loyers des classes A à C (effet rebond : un plafond haut peut tirer les loyers vers le haut), pas d'effet sur les ventes.
- **Une zone rurale, un département** (Creuse) ; Paris : arrondissements calibrés séparément mais DPE de deux mois seulement (janvier-février 2026).
- **Un DPE par logement ?** : plusieurs DPE d'un même logement sont possibles dans la base (non dédoublonné) ; pas d'adresse exploitable.

## 11. Meilleure objection (steelman) et réponses

1. **« Vous faites porter à un outil imparfait la fixation d'un prix. »** Un écart d'une classe de DPE déplace le plafond de 30 à 100 € par mois ; il y aura des contestations et des manipulations, déplacées vers la mesure du besoin. *Réponse partielle* : la formule borne l'enjeu (la part énergie est une déduction, pas le loyer entier) ; la mesure instrumentée à la première mise en location et la contestation encadrée (50 à 150 % de la valeur du DPE, `../loyer-energie/methode.md`) réduisent le risque ; il reste ouvert tant que la mesure de besoin n'existe pas.
2. **« Vous faites sortir des logements du marché. »** Un plafond à 120 % coupe un cinquième des loyers dès l'entrée (central). Le modèle n'a pas d'effet de comportement. *Réponse* : appliquer le plafond à la relocation seulement, k = 1,3 au départ ; la littérature sur l'encadrement (San Francisco, ⚠️ voir `../loyer-energie/methode.md`) montre un effet négatif sur l'offre, à ne pas écarter.
3. **« La pompe à chaleur est un bon investissement, vous la découragez. »** Non : elle reste récompensée (+39 à +51 € de plafond ; le locataire gagne 130 à 170 € de facture) ; elle l'est moins qu'une isolation, ce qui est le but.
4. **« Le plafond figé sur une surface d'avant travaux va contre la valeur vénale. »** Vrai : la valeur au m² baisse de 4 % après isolation intérieure ; une aide ou un prêt compense, ou l'isolation par l'extérieur (non chiffrée ici).
5. **« Un plafond au seuil 120 % imite l'encadrement existant : pourquoi le changer ? »** L'encadrement actuel fixe un loyer de référence au m² par zone, majoré de 20 % (⚠️ V29010, de mémoire) ; il ne dépend pas de la taille autrement que par catégories ni de l'énergie, interdit le complément de loyer pour F et G et gèle leur loyer à la relocation. La proposition donne un prix à l'énergie plutôt qu'un gel.

## 12. Contraintes juridiques

- **Décence et passoires** (fait sourcé, copie de la loi du 6 juillet 1989 consultée le 02/11/2026, [`../loyer-energie/methode.md`](../loyer-energie/methode.md) section 2 ; [Loi n° 89-462, art. 6](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000509310)) : seuil de décence en classes A à F depuis le 01/01/2025, A à E à compter du 01/01/2028, A à D à compter du 01/01/2034 (loi n° 2021-1104 du 22/08/2021, dite Climat et résilience, art. 160). La proposition de l'auteur remplace cette interdiction progressive par un prix ; elle exige donc d'abroger ou de modifier l'article 6 (décence énergétique) et l'article 160 de la loi de 2021. Aucune donnée de ce modèle ne tient compte de ces interdictions.
- **Gel des loyers F et G** (fait sourcé, cote A, [Service-Public, F1314](https://www.service-public.fr/particuliers/vosdroits/F1314), consulté le 08/11/2026) : pour les baux signés depuis le 24/08/2022, le loyer de base d'un logement F ou G ne peut dépasser le loyer du locataire précédent ; le complément de loyer est interdit pour un logement classé F ou G. La formule de l'auteur rend ce gel superflu : un G ne peut plus louer plus cher qu'un plafond abaissé de sa déduction.
- **Encadrement actuel** (fait sourcé, même page) : en zone tendue, communes dont Paris, Est Ensemble, Plaine Commune, Bordeaux, une partie de Grenoble-Alpes Métropole (dont une partie de Grenoble), Lille, Hellemmes et Lomme, Lyon et Villeurbanne, Montpellier, Pays Basque ; **Angers et la Creuse n'en font pas partie** (liste partielle lue, à relire ⚠️ V29010). La proposition « supprimer l'encadrement actuel » (07/11) concerne ces communes.
- **Constitution** : l'encadrement a été jugé conforme par le Conseil constitutionnel pour la loi ELAN (⚠️ V29012, de mémoire : décision n° 2018-772 DC du 15 novembre 2018, à relire), à condition qu'il soit limité dans l'espace et le temps ; une règle nationale permanente, plus mordante que le dispositif expérimental, devra se justifier au regard de la liberté contractuelle et du droit de propriété (proportionnalité). Non analysé.
- **Droit de l'Union** : la directive sur la performance énergétique des bâtiments (refonte de 2024) fixe des objectifs nationaux de rénovation que le prix remplace ou complète ; la compatibilité n'est pas analysée ⚠️ V29012. Les DPE restent ceux de la méthode française.
- **Plateforme** (position de l'auteur du 08/11) : le bail signé par la plateforme, l'enregistrement obligatoire des baux et la garantie de loyer (type Visale) sont des dispositifs à créer ; hors champ de ce modèle.

## 13. Synthèse des sources mobilisées

- **ADEME, base DPE logements existants** (cote B) : les consommations, besoins, énergies et classes de chaque logement ; établit l'état déclaré du bâti, pas sa mesure ; limites : échantillon récent, doublons, champ de besoin d'immeuble.
- **DHUP, carte des loyers 2025** (B) : niveau des loyers d'annonce par commune pour trois types de biens de référence ; établit le niveau relatif des loyers et la droite à deux points.
- **Observatoires locaux des loyers** (B) : loyers en cours et dispersion à Paris, Lyon, Grenoble ; établit le recalage γ et la dispersion σ.
- **CRE, tarif réglementé de l'électricité** (A) : 0,2001 €/kWh TTC depuis le 01/08/2026.
- **Ministère de la Transition écologique, page DPE** (A) : surface de référence, coefficient de l'électricité, seuils pour petites surfaces.
- **Service-Public, F1314** (A) : encadrement actuel, gel et complément de loyer pour F et G.
- **Modèle agrégé du 03/11** (`../loyer-energie/`) : cadre légal, comparaison avec l'interdiction, tests de fiabilité du DPE, que ce modèle prolonge sur microdonnées.
