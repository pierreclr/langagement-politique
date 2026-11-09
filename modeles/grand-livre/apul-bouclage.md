---
titre: Grand livre T65, sous-secteur APUL : bouclage au total Insee 2024
statut: livré le 06/11/2026 ; code `modeles/grand-livre/code/apul.py` ; données `modeles/grand-livre/apul.csv` ; vérifications V16300 à V16310
---

# APUL 2024 : rapprochement au total Insee

Année 2024, Md€ courants, comptabilité nationale base 2020 (SEC 2010). Écrit par Claude (IA d'Anthropic) pour l'auteur. Cotes : voir la colonne `cote` de chaque ligne (règle 11 de la charte).

## 1. Total Insee et résultat du bouclage

**Total Insee des dépenses des APUL (S1313) en 2024 : 330,484 Md€** (tableau 3.205[^insee]). C'est le « 330,5 » du bilan.

| Contrôle | Montant (Md€) | Écart |
|---|---|---|
| Total Insee APUL 2024 (3.205) | 330,484 | |
| Somme des lignes de la couche A du grand livre (364 lignes, `additif = oui`) | 330,484 | **+0,000001** (arrondi), **0,0 %** |
| Contrôle par nature : somme des 5 niveaux × 14 natures SEC (couche B, avant consolidation) | 363,512 | = somme des totaux Insee des niveaux, écart 0 |
| Consolidation interne retirée (Insee : somme des niveaux moins S1313) | −33,028 | |
| Contrôle COFOG Eurostat (S1313, 2024, couche C) | 329,750 | −0,734 (−0,22 %) par rapport à l'Insee, écart de source non expliqué |

**Attention : le bouclage à 0 est obtenu par construction.** Chaque niveau retombe sur son total Insee grâce à une **ligne de passage explicite** (section 3). Ce n'est pas la preuve que les lignes fonctionnelles sont complètes : la preuve est la taille et la composition des lignes de passage et du résidu ODAL, que je donne ci-dessous.

### Par niveau (avant consolidation entre niveaux)

| Niveau Insee | Tableau | Total Insee | Lignes fonctionnelles (OFGL) + charges financières | Ligne de passage | ODAL : lignes chargées + résidu |
|---|---|---|---|---|---|
| Bloc communal (communes + groupements) S131311 | 3.207 | 179,064 | 188,826 | **−9,762** | |
| Départements S131312 | 3.208 | 78,569 | 77,971 | **+0,598** | |
| Régions et CTU S131313 | 3.209 | 40,985 | 39,650 | **+1,335** | |
| Syndicats S131314 | 3.210 | 17,041 | 21,987 | **−4,946** | |
| ODAL S13132 | 3.211 | 47,853 | 39,575 (SDIS 6,044 ; CCAS 8,556 ; Île-de-France Mobilités 14,771 ; autres EPL 3,204 ; EPLE 7,000 estimé) | résidu **+8,278** | |
| **Somme des niveaux** | | **363,512** | | | |
| Consolidation interne APUL | | **−33,028** | D73 −24,817 ; D9p −8,132 ; D41 −0,079 | | |
| **Total APUL** | | **330,484** | | | |

(Paris compté avec le bloc communal, la métropole de Lyon avec les départements : convention du rapprochement de `outils/argent-public/RAPPROCHEMENT.md`, non vérifiée contre la convention Insee, V16304.)

## 2. Par nature SEC (couche B, Insee 3.205 à 3.211, 2024)

| Nature SEC | Bloc communal | Départements | Régions | Syndicats | ODAL | Somme des niveaux | APUL consolidé (3.205) | Consolidation |
|---|---|---|---|---|---|---|---|---|
| D1 rémunérations | 59,350 | 14,617 | 4,825 | 2,633 | 13,836 | 95,261 | 95,261 | 0 |
| P2 consommations intermédiaires | 39,165 | 3,984 | 1,916 | 5,883 | 10,271 | 61,219 | 61,219 | 0 |
| D29 autres impôts sur la production | 1,601 | 0,169 | 0,058 | 0,246 | 0,651 | 2,725 | 2,725 | 0 |
| D4 hors D41 et D5 | 0,073 | 0,000 | 0,000 | 0,006 | 0,048 | 0,127 | 0,127 | 0 |
| D41 intérêts | 4,011 | 1,025 | 1,094 | 0,500 | 0,881 | 7,511 | 7,432 | −0,079 |
| D62 prestations sociales en espèces | 1,686 | 13,352 | 1,561 | 0,022 | 0,603 | 17,224 | 17,224 | 0 |
| D632 prestations en nature (achats marchands) | 0,927 | 9,874 | 2,839 | 0,007 | 0,185 | 13,832 | 13,832 | 0 |
| D3 subventions | 2,409 | 0,546 | 6,236 | 0,660 | 6,668 | 16,519 | 16,519 | 0 |
| D73 transferts courants entre APU | 15,351 | 6,812 | 6,861 | 0,412 | 1,311 | 30,747 | 5,930 | **−24,817** |
| D7 hors D73 autres transferts courants | 6,768 | 15,103 | 0,913 | 0,245 | 0,649 | 23,678 | 23,678 | 0 |
| D9p transferts en capital | 3,314 | 4,351 | 10,673 | 0,462 | 4,503 | 23,303 | 15,171 | **−8,132** |
| P51g formation brute de capital fixe | 42,371 | 8,651 | 3,976 | 5,947 | 7,440 | 68,385 | 68,385 | 0 |
| P52, P53, NP autres acquisitions | 2,038 | 0,085 | 0,033 | 0,018 | 0,807 | 2,981 | 2,981 | 0 |
| **Total** | **179,064** | **78,569** | **40,985** | **17,041** | **47,853** | **363,512** | **330,484** | **−33,028** |

Lecture : la consolidation de 33,0 Md€ ne porte que sur trois natures : les transferts courants (D73, 24,8), les transferts en capital (D9p, 8,1) et 0,08 d'intérêts. **Sur ces 33,0, seuls ≈ 20,0 sont identifiés** dans les comptes de gestion (section 3) ; ≈ 13 Md€ de flux internes (participations aux ODAL, subventions de fonctionnement et d'équipement aux EPL, EPLE, associations para-locales classées ODAL) ne sont pas retrouvés payeur par payeur.

Piège de source corrigé : la table normalisée `apu.parquet` (chargée par `charger_apu.py`) **étiquette mal certaines lignes dépenses/recettes des communes et départements** (par exemple D41 des communes lu à 0,08 au lieu de 4,011 ; D7 hors D73 des départements lu à 0,89 au lieu de 15,103) parce que le même libellé apparaît dans les dépenses et dans les recettes ; ce grand livre relit directement les XLSX (V16301). Les sommes de totaux, elles, étaient bonnes.

## 3. Passage comptabilité publique locale → comptabilité nationale

Les lignes fonctionnelles viennent de l'annexe 2F de la DGCL/OFGL[^ofgl] : budgets principaux, opérations réelles, **fonctionnement hors charges financières + investissement hors remboursements de dette**, colonnes « N-1 » du millésime 2026 (= 2024) ; budgets annexes du bloc communal (F6a) ; syndicats (F6b, budgets principaux). Ce n'est pas la comptabilité nationale. La ligne de passage de chaque niveau est le **solde** entre le total Insee du niveau et la somme de ses lignes ; elle contient, mélangés :

- **Retirer de l'OFGL** (opérations qui ne sont pas des dépenses en SEC 2010), identifiées au niveau national dans `RAPPROCHEMENT.md`[^rapp] : opérations financières incluses dans l'investissement OFGL (comptes 26-27) −2,857 ; opérations sous mandat et fonds d'investissement −1,742 (estimation) ; produits de cessions d'immobilisations −2,332 (la CN compte les acquisitions nettes) ; total identifié **−6,931**.
- **Budgets annexes et flux budget principal vers annexes** : le bloc communal additionne budgets principaux et annexes, donc compte les subventions du principal vers les annexes deux fois ; la base OFGL « consolidée » les neutralise, pas l'annexe 2F.
- **Producteurs marchands reclassés hors APU** : la comptabilité nationale sort de l'APUL les syndicats et régies qui vendent à plus de 50 % de leurs coûts (eau, assainissement, déchets, transports en régie) ; c'est l'explication la plus probable des −4,946 des syndicats (la part « Environnement » des syndicats dans l'annexe 2F est de 13,6 Md€) et d'une partie des −9,762 du bloc communal (budgets annexes d'eau et d'assainissement : 13,9 Md€ d'« environnement » dans F6a). **Hypothèse non vérifiée (V16305).**
- À l'inverse **ajouter** : charges financières des communes de moins de 3 500 habitants (non isolées), D41 hors correction SIFIM, rattachements et droits constatés (la CN est en droits constatés).

Somme des passages des quatre niveaux de collectivités : −9,762 + 0,598 + 1,335 − 4,946 = **−12,775 Md€**. Part identifiée (−6,931) : 54 % ; **reste non expliqué : −5,844 Md€** (écart de bouclage à lire comme la limite de ce travail ; il recouvre le reclassement des producteurs marchands, non chiffrable avec les données ouvertes).

Le contrôle national déjà fait dans `RAPPROCHEMENT.md` (partie du total OFGL consolidé 344,394 vers l'Insee) aboutit à −2,7 Md€ ; il retire 8,7 + 2,1 + 1,8 Md€ de flux entre collectivités du côté des dépenses, ce que fait ici la ligne de consolidation Insee (33,0), plus large.

## 4. Reconstitutions (lignes dont le montant n'est pas lu directement)

| Ligne | Méthode | Cote | Statut |
|---|---|---|---|
| ODAL : SDIS (6,044), CCAS (8,556), autres EPL (3,204), Île-de-France Mobilités (14,771) | totaux OFGL (jeux `ofgl-base-sdis`, `ofgl-base-ccas-cias`, `ofgl-base-epl-consolidee`) moins remboursements d'emprunts | A | fait/calcul |
| **ODAL : EPLE (collèges et lycées) 7,000** | **estimation** : budget de fonctionnement des EPLE ≈ 7 Md€ en 2018 (DEPP[^depp]), non actualisé ; aucun jeu ouvert plus récent trouvé | C | estimation ⚠️ V16302 |
| **ODAL : résidu 8,278** | total Insee ODAL moins les cinq lignes ci-dessus ; caisses des écoles (1 164), chambres consulaires (273), offices de tourisme (439), centres de gestion, établissements fonciers, associations classées ODAL | A (calcul) | calcul |
| Communes de moins de 3 500 habitants (17,05 F + 9,27 I en 2025 ; 25,573 en 2024) | non ventilées par fonction dans l'annexe 2F ; **la répartition par fonction n'est pas reconstituée** (V16306) | A | fait |
| Fonctions COFOG des lignes | correspondance OFGL → COFOG posée par moi (fonction « transports » → 04.5, « environnement » → 05, etc.) : à 3 à 10 Md€ près de l'Eurostat (couche C) : 01 57,5 contre 62,9 ; 03 15,0 contre 10,3 ; 04 66,4 contre 56,4 ; 05 39,6 contre 26,0 ; 06 20,0 contre 36,4 ; 07 4,0 contre 2,4 ; 08 26,2 contre 30,0 ; 09 41,9 contre 46,0 ; 10 66,1 contre 59,4 (les lignes de passage, de consolidation et du résidu ODAL n'ont pas de COFOG : −6,2) | C | estimation |
| RSA, APA, PCH, hébergement (ASE, personnes âgées et handicapées), contributions aux SDIS | lignes « dont » (couche D, non additives) : OFGL 2024 agrégé départements + Paris + métropole de Lyon + CTU : RSA versé 10,350 ; APA 7,343 ; PCH 3,661 ; frais d'hébergement 16,898 ; SDIS 3,335 | A | fait |
| Sous-lignes de l'action sociale des départements (annexe 2F, 2024) | famille et enfance (aide sociale à l'enfance) 11,07 ; personnes handicapées 10,36 ; personnes âgées 2,65 ; services communs 2,98 ; autres 0,65 ; APA 7,09 ; RSA : allocations 9,02, insertion sociale 0,58, insertion professionnelle 0,55, autres 0,35 | A | fait |
| Écart « non détaillé » de 0,018 sur le RSA | la ligne mère de l'annexe 2F dépasse la somme de ses « dont » : ligne explicite | A | calcul |

## 5. Transferts inter-APU marqués (colonne `flux_inter_apu`)

1. **État vers collectivités** (couche D, non additives, recettes reçues) : DGF 27,10 Md€ (bloc communal 18,60 ; départements 8,18 ; régions et CTU 0,30 ; syndicats 0,02) ; concours financiers de l'État 38,19 (dont DGF 27,10 et FCTVA 6,80) ; fractions de TVA 52,50 ; TSCA 9,73 ; TICPE 11,70. Contrepartie : dépense de l'État (prélèvements sur recettes, programme 119-122) ou impôt national partagé ; **à éliminer côté payeur** (`oui:?` : les identifiants État du chantier ETAT ne sont pas connus ici). Les 130,1 Md€ d'impôts locaux que la bascule remplace sont des recettes, hors périmètre de ce fichier (voir `sources/bascule-collectivites.md`).
2. **ASSO vers départements** : concours de la CNSA 5,35 Md€ (OFGL ; la ligne `ASSO-TRF-DEPARTEMENTS` du fichier ASSO donne 5,806 en 2025).
3. **APUL vers État et ASSO** : transferts courants 5,930 (dont 4,80 vers l'État et 0,96 vers les ASSO, Eurostat) ; transferts en capital 1,72 (1,56 et 0,16) : couche D, compris dans les lignes de la couche A.
4. **Entre collectivités et vers les ODAL** : couche D (flux identifiés payeur ou receveur : participations reçues 8,736 ; subventions d'investissement reçues 2,093 ; remboursements de frais 1,848 ; participations aux SDIS 5,304 ; aux CCAS 2,038 ; EPL 2,977 ; contributions aux syndicats ≈ 3,3) et lignes de la couche A marquées (`oui:GL-APUL-ODAL-SDIS` : incendie et secours des communes, GFP et départements ; `oui:GL-APUL-ODAL-EPLE` : enseignement du second degré des départements et régions). L'élimination se fait par les trois lignes `GL-APUL-CONSO-*` (−33,028). **Ne pas éliminer une seconde fois les flux marqués.**
5. **Attributions de compensation, DSC, dotations d'équilibre (≈ 15,6 Md€)** : absentes des dépenses OFGL (elles viennent en déduction des recettes de fiscalité) ; en SEC elles sont des D73 : leur traitement exact dans les tableaux Insee n'est pas lu (V16307).

## 6. `ligne_bilan` et `sort`

- **Par défaut** : `reste`, `ligne_bilan = aucune` (le bilan traite l'APUL comme « reste inchangé » : 330,5 Md€ par fonction COFOG, déduction faite des lignes à base connue).
- **RSA versé (9,021 en allocations dans l'annexe 2F ; 10,350 dans l'ensemble OFGL)** : `ligne_bilan = D03`, `sort = fondu:allocation_unique`. La bascule des collectivités avertit (V13810) que la clé ne retire pas ce montant aux départements.
- **Transports publics (communes, groupements, départements, régions hors TER, syndicats, Île-de-France Mobilités)** : `ligne_bilan = D31` (gratuité urbaine, dotation aux AOM), `sort = reste` : la dépense est maintenue, financée par la dotation et non plus par le versement mobilité (12,2 Md€, P06). TER (7,05) : D31 ne s'applique pas (RER et Transilien exclus de la variante A).
- **Natures D1 et P2** (couche B) : `D23` (−4,5 Md€ de non-remplacement et 1 607 heures) et `D24` (−3,5 Md€ d'achats) portent sur l'ensemble des collectivités et ne sont pas répartis par niveau ; dans la couche A (par fonction) ils n'apparaissent pas.
- **Charges financières** : `D28` (intérêts conservés à l'identique, 58,9 Md€ pour l'ensemble des APU).
- **SDIS** : fonction « ordre et sécurité » (D22, non modélisée).
- **Consolidation** : `fondu:consolidation_inter_apu`.
- Aucune ligne n'est `supprimé` : le bilan ne supprime aucune dépense propre des collectivités ; la taxe foncière remplacée par la fonction du patrimoine (P07, N07) est une recette.
- `montant_apres_md_eur` : vide partout. Le bilan ne chiffre aucun « après » par niveau de collectivité ; D23 et D24 (−8,0 au total) ne sont pas ventilables par ligne.

## 7. Doublons suspects dans le bilan (`bilan_global.py` non modifié)

1. **RSA : D03 (cur 12,4) contre le RSA des départements (≈ 10,35 Md€ OFGL ; 9,02 allocations dans l'annexe 2F) et contre la ligne `ASSO-MINI-RSA-DEP` (10,367, sous-secteur APUL) de `lignes_asso.csv`.** Le même RSA existe donc dans trois fichiers : bilan (D03), ASSO (ligne étiquetée APUL), APUL (cette base). Dans le bilan l'effet est évité parce que `cur` est retiré de la fonction « protection sociale » du reste inchangé, **mais il reste à vérifier que les 12,4 couvrent bien le RSA financé par les départements (10,35) en plus du RSA financé par l'État** (`ASSO-MINI-RSA-ETAT`) : si D03 = 12,4 inclut déjà les deux, la bascule doit retirer ≈ 10,35 aux départements et non 12 (V16308).
2. **APA : `ASSO-AUT-APA` (7,330, sous-secteur APUL) contre la ligne APA des départements (7,343 OFGL ; 7,09 annexe 2F)** : montants identiques à 0,02 près, même dépense dans deux fichiers : à ne garder qu'une fois au grand livre consolidé (je garde la ligne APUL, additive, et le fichier ASSO doit retirer la sienne).
3. **D20 éducation (148,6 Md€, COFOG 09 de toutes les APU) et D23 collectivités (−4,5)** : D20 est calculé sur 109 138 postes de l'Éducation nationale (État), D23 sur les effectifs des collectivités (ATSEM, agents des collèges et lycées, périscolaire) ; recouvrement possible sur les agents des collectivités affectés à l'enseignement (≈ 41,9 Md€ d'enseignement APUL, dont personnel non isolé) : à vérifier (V16309).
4. **D31 gratuité des transports et ODAL Île-de-France Mobilités (14,771)** : le bilan note lui-même qu'inscrire à nouveau la dotation aux AOM serait un double compte (`chiffrage-gratuite-transports-urbains.md`) ; le grand livre compte IDFM une fois (ODAL) et les contributions des régions et départements à IDFM sont dans leurs lignes de transport (flux intra-APUL, éliminé dans les 33,0).
5. **D18 (« collectivités 0,05 déjà dans D22 »)** : libellé incohérent (D22 est « Justice, police, prisons ») : à relire (V16310).
6. **Base de D23 et D24** : « APUL 330,5 Md€ » est le total **consolidé**. Les achats de 48,9 (2023, Cour des comptes) du D24 sont une somme brute de niveaux (la consommation intermédiaire Insee des niveaux est de 61,2 avant et après consolidation, donc non concernée) : cohérent, aucun doublon trouvé.
7. **Bascule v5.9 et dépenses des AOM** : confirmé, la dotation aux AOM n'est pas à recompter (déjà dans « reste inchangé »).

## 8. Questions ouvertes

- Reclassement des producteurs marchands hors APUL : lire la liste Insee des unités S13 (mai 2025) pour chiffrer les syndicats et régies sortis (explication probable de −5,8 Md€).
- EPLE : trouver le budget 2023 ou 2024 (note DEPP plus récente ?) et la part déjà comptée dans les dotations des départements et régions.
- Ventilation par fonction des communes de moins de 3 500 habitants (25,6 Md€) : hypothèse « même structure que F1 » non testée.
- Consolidation : retrouver les ≈ 13 Md€ de flux internes non identifiés (contributions aux EPL, associations para-locales, syndicats, AC/DSC).
- COFOG Insee par sous-secteur (tableaux 3.30x, publication prévue en décembre 2026) : remplacerait ma correspondance OFGL → COFOG.
- Convention de rattachement de Paris et de la métropole de Lyon dans les tableaux Insee.

## Sources[^insee]

[^insee]: Insee, Comptes nationaux annuels base 2020, « Dépenses et recettes des administrations publiques en 2025 », tableaux 3.205 à 3.211 (colonne 2024), https://www.insee.fr/fr/statistiques/8988845, fichiers `t_32NN_fr.xlsx` copiés dans `$DONNEES/sources/apu/brut/`, lus le 06/11/2026. Cote A (statistique publique). Conflit d'intérêts : aucun connu ; millésime de mai 2026 (tableaux 7.30x republiés en août 2026).
[^ofgl]: DGCL/OFGL, rapport sur les finances locales, pré-rapport 2026, annexe 2F « Ventilation fonctionnelle 2020-2025 » (comptes de gestion DGFiP), https://www.collectivites-locales.gouv.fr/files/files/Etudes-et-statistiques/OFGL/pre%20rapport%202026/Annexe%202F%20-%20Ventilation%20fonctionnelle%202020-2025.xlsx, copie `ofgl_v57/brut/annexe2F_2020_2025.xlsx`, lue le 06/11/2026. Cote A ; 2025 provisoire, 2024 en colonnes « N-1 ». Licence non relevée (V de la vague 57). Compléments SDIS, CCAS, EPL, grand-livre, flux : OFGL data.ofgl.fr (jeux cités dans `sources/collectivites/LISEZMOI.md`), cote A. Eurostat gov_10a_exp S1313 (COFOG), cote A.
[^rapp]: `outils/argent-public/RAPPROCHEMENT.md` (rapprochement APUL reconstitué 327,771 contre 330,484 en 2024), cote B (calcul interne).
[^depp]: DEPP, « Le budget de fonctionnement des établissements publics locaux d'enseignement » (2012 : 6,8 Md€) et note 2018 « les collèges et lycées publics gèrent 7 milliards d'euros », https://www.education.gouv.fr/depp/le-budget-de-fonctionnement-des-etablissements-publics-locaux-d-enseignement-en-2012-pres-de-7-3851 ; recherche web du 06/11/2026, chiffre 2018 repris d'un résumé de résultats de recherche, document non relu. Cote B pour le sens, C pour l'usage en 2024.
