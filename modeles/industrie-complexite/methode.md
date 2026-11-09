---
titre: Modèle « L'industrie de la complexité » : méthode
tache: T6
statut: brouillon sourcé
consultation: 2026-10-25
---

# L'industrie de la complexité : méthode

## 1. Question posée

« L'industrie de la complexité » désigne, dans ce livre, **l'activité économique qui existe parce que les règles fiscales et sociales sont complexes**. Elle disparaîtrait, ou se transformerait, si trois tâches passaient automatiquement par un système public simple : la paie, la comptabilité de base et l'impôt. Ce système public suppose quatre éléments : la facturation électronique, un prélèvement unique à 50 %, un socle universel et l'absence de niches.

Le modèle pose quatre questions :

1. Quelle est la **taille** de cette industrie, en Md€ par an et en emplois ?
2. Quelle **part** disparaîtrait, quelle part se transformerait (audit, conseil de gestion, accompagnement), et quelle part resterait ?
3. Quel serait le **gain pour l'économie** ? Ce gain n'est pas un gain pour le budget public.
4. Combien de **personnes** faudrait-il reconvertir, vers quels métiers et avec quelles compétences transférables ? Le principe retenu est de « ne perdre personne ».

On décrit un système, pas des personnes. Les métiers comptés ici rendent un service réel à leurs clients : ce service répond à une complexité que ces métiers n'ont pas créée.

**Cadre théorique.** Mariana Mazzucato, *The Value of Everything* (2018), distingue **création** et **extraction** de valeur. La notion de « frontière de production » reste à vérifier dans le texte ⚠️. Gordon Tullock (1967) et Anne Krueger (1974) ont étudié la recherche de rente : les ressources dépensées pour obtenir ou préserver un transfert sont un coût social. Krueger estime ces rentes à 7,3 % du revenu national en Inde (1964) et à environ 15 % du PNB en Turquie (1968). Murphy, Shleifer et Vishny (1991) observent qu'une part plus élevée d'étudiants en ingénierie va de pair avec une croissance plus forte, et une part plus élevée en droit avec une croissance plus faible. Baumol (1990) distingue l'entrepreneuriat productif de l'entrepreneuriat improductif. Références exactes : `donnees/cadre_theorique.csv`.

**Nuance importante.** La conformité fiscale n'est pas une « rente » au sens strict de Krueger. C'est un **coût de transaction imposé par la règle**. Le parallèle tient sur un point : les ressources qu'elle mobilise ne produisent rien que le client désirerait si la règle était simple.

## 2. Périmètre et données

Toutes les données sont dans `donnees/`, à raison d'une source par ligne, avec les colonnes indicateur, valeur, unité, année, périmètre, source_url et remarque. Consultation : 25/10/2026. ⚠️ = non confirmé dans une source primaire.

| Fichier | Contenu | Collecte |
|---|---|---|
| `comptabilite_audit_droit.csv` | NAF 69.20 (activités comptables) et 69.10 (juridiques) : entreprises, CA, VA, emplois (Eurostat SBS 2024) ; commissaires aux comptes et honoraires d'audit légal (H2A 2025) ; avocats (CNB 2026) | API Eurostat, rapports officiels |
| `paie_editeurs_prestataires.csv` | Employeurs, salariés, masse salariale (Urssaf 2024) ; DSN ; CA des éditeurs et prestataires (Cegid, Sage, ADP, Silae, Lucca, Nibelis, Talentia, Fiducial) ; bulletins traités ; PayFit, Cegid-Silae | Comptes déposés (API Recherche d'entreprises), communiqués officiels, presse ⚠️ |
| `cir_cabinets_conseil.csv` | Coût du CIR et du CII (2026) ; honoraires et recours aux cabinets (IGF 2010 via le rapport Berson 2012 ; rapport Gonthier-Maurin 2015) ; CA des principaux cabinets | Rapports du Sénat, comptes déposés |
| `patrimoine_defiscalisation.csv` | CIF (ORIAS), ANACOFI ⚠️ ; trous signalés (FIP/FCPI, Pinel, notaires) | Rapports annuels |
| `controle_contentieux_fiscal.csv` | Contrôle fiscal 2025 (DGFiP), affaires fiscales devant la juridiction administrative (Conseil d'État 2025), ETPT DGFiP | Dossier de presse DGFiP, chiffres clés du Conseil d'État, PAP 2026 |
| `pmr_ocde.csv` | Indicateurs OCDE de réglementation des marchés de produits (PMR), 2018 et 2023, France et sept comparateurs : contrôle de remplacement (§2 bis) | API OCDE (SDMX), consultée le 31/10/2026 |
| `temps_conformite.csv` | Doing Business 2020 (France, par impôt ; source arrêtée en 2021, conservée pour comparaison), B-READY, déclaration automatique, enquêtes auprès des dirigeants (CJD, SDI ⚠️), mission Margueritte, DITP ⚠️ | Banque mondiale, Sénat, communiqués |
| `comparaison_etats_unis.csv` | TurboTax, H&R Block, IRS Direct File (pilote, suspension) | 10-K (SEC), IRS |
| `cadre_theorique.csv` | Mazzucato, Tullock, Krueger, Murphy-Shleifer-Vishny, Baumol, Philippon-Reshef | DOI, éditeurs |
| `reconversion_metiers.csv` | BMO 2026 (France Travail), Les Métiers en 2030 (France Stratégie-Dares), Frey-Osborne, Eloundou et al., précédents (vignette, douanes 1993, taxe d'habitation) | Rapports officiels, réponses ministérielles |
| `references_projet.csv` | Lignes reprises de T3 (charge administrative de 60 à 70 Md€, Commission européenne, ViDA, facturation électronique) et PIB 2024 | Fichiers du projet, non refaits |

**Méthode de collecte.** Trois recherches web ont été menées en parallèle le 25/10/2026. Le quota de recherche s'est épuisé presque tout de suite. Les agents ont donc lu directement les pages primaires : API Eurostat, API Recherche d'entreprises (comptes déposés à l'INPI), PDF du Sénat, de la H2A, du Conseil d'État, de l'IRS et de la SEC. Plusieurs sites étaient bloqués (economie.gouv.fr, budget.gouv.fr, urssaf.org, ccomptes.fr, site de la Dares, extranet de l'Ordre des experts-comptables). Les trous qui en résultent sont signalés dans les CSV (« non trouvé ») et dans `verifications.md` (V148 à V162).

**Ce qui n'est pas refait.** La charge administrative des entreprises (≈ 60 Md€ mesurés en 2007, 70 Md€ selon la mission Margueritte en 2024) figure déjà dans `sources/donnees/simplification_5_conformite_privee.csv`. Elle couvre **toutes** les normes, pas seulement les normes fiscales et sociales. Elle sert ici de **plafond de contrôle**, pas d'entrée. Les résultats de ce modèle **ne s'ajoutent pas** à ces 60-70 Md€ : ils en sont en grande partie un sous-ensemble.

## 2 bis. Doing Business : source arrêtée, et contrôle de remplacement (T22, 31/10/2026)

**Ce qui s'est passé.** Le 16/09/2021, la direction du Groupe de la Banque mondiale a décidé d'arrêter le rapport *Doing Business* ([communiqué du 16/09/2021](https://www.worldbank.org/en/news/statement/2021/09/16/world-bank-group-to-discontinue-doing-business-report), consulté le 31/10/2026). Le communiqué signale des irrégularités de données dans les éditions 2018 et 2020, remontées en interne en juin 2020, puis des revues et audits ; il ne nomme aucune économie et ne décrit pas les irrégularités. Le communiqué du 16/12/2020 ([page](https://www.worldbank.org/en/news/statement/2020/12/16/world-bank-group-statement-on-doing-business-data-corrections-and-findings-of-internal-audit)) parle de corrections pour « quatre pays » sans les nommer ni citer d'indicateur. Les deux rapports de la Banque mondiale, lus en PDF le 31/10/2026 (V2601), nomment les économies : la **Chine** (édition 2018 ; indicateurs Starting a Business, Getting Credit, Paying Taxes ; rang publié 78, rang corrigé 85), l'**Arabie saoudite** (édition 2020 ; Getting Credit, Paying Taxes ; 62 puis 63), les **Émirats arabes unis** (2020 ; Paying Taxes ; 16, inchangé) et l'**Azerbaïdjan** (2020 ; Getting Electricity, Enforcing Contracts, Trading Across Borders ; 34 puis 28). Sources : *Review of Data Irregularities in Doing Business* (direction DEC, 16/12/2020, [PDF](https://thedocs.worldbank.org/en/doc/791761608145561083-0050022020/original/DBDataIrregularitiesReviewDec2020.pdf), pp. 1 et 5-12) et rapport WilmerHale du 15/09/2021 ([PDF](https://thedocs.worldbank.org/en/doc/84a922cc9273b7b120d49ad3b9e9d3f9-0090012021/original/DB-Investigation-Findings-and-Report-to-the-Board-of-Executive-Directors-September-15-2021.pdf)). La revue de décembre 2020 écrit n'avoir identifié aucune autre irrégularité précise parmi les modifications tardives des éditions 2016 à 2020.

**La France n'est pas parmi les économies visées** (confirmé le 31/10/2026 par le rapport WilmerHale du 15/09/2021, p. 2 du PDF, § 1 : champ de l'enquête limité à la Chine (édition 2018) et à l'Arabie saoudite, aux Émirats arabes unis et à l'Azerbaïdjan (édition 2020) ; V2498), et le communiqué ne mentionne ni la France ni l'indicateur « Paying Taxes ». Ce n'est pas une preuve de fiabilité : WilmerHale n'a pas audité l'exactitude de toutes les données, et l'arrêt de la série a une portée plus large que les quatre cas (confiance dans la méthode et dans la gouvernance).

**Conséquence pour le modèle.** Les 139 h de conformité (80 h travail, 31 h TVA, 28 h IS, millésime 2018, PME type) ne servent qu'à un recoupement (plancher de 135 000 ETP du bloc B, H8), jamais à un résultat. Elles sont conservées, marquées « source arrêtée, conservée pour comparaison », et ne doivent pas être citées seules. Le recoupement a été reformulé en fonction pure (`etpConformite`).

**Sources de remplacement examinées.**
- **B-READY** (Banque mondiale) : la France est dans l'édition 2026 (62 économies ajoutées ; Allemagne et Pays-Bas aussi), et pas dans les éditions 2024 ni 2025 ; Italie, Espagne, Suède et Royaume-Uni sont dans l'édition 2025 ([économies couvertes](https://www.worldbank.org/en/businessready/about-us/covered-economies)). **Vérifié le 01/11/2026 (V2782)** : le paquet de données officiel B-READY 2025 (`B_READY_ALL_DATA_2025.zip`, scores par pilier et par thème, dont « 07_Taxation ») ne contient ni la France, ni l'Allemagne, ni les Pays-Bas (présentes : Italie, Espagne, Suède, Royaume-Uni, Pologne) ; la page de couverture place la France dans l'édition 2026, mais aucun fichier de données 2026 n'était publié sur le site à cette date (les adresses du fichier 2026 répondent 404, la page de données est dynamique) : aucune donnée B-READY pour la France n'est donc exploitable, à reprendre à la publication des données 2026. Sa couverture fiscale diffère aussi de celle de Doing Business (pas d'équivalent direct des heures par impôt).
- **OCDE PMR** (dataflow `OECD.ECO.GCRD,DSD_PMR@DF_PMR,1.4`) : couvre la France, l'Allemagne, l'Italie, l'Espagne, les Pays-Bas, le Royaume-Uni, la Suède et les États-Unis en 2018 et 2023 (pas d'agrégat OCDE dans l'extraction). **Retenu comme contrôle**, `donnees/pmr_ocde.csv`. Limite : c'est un indice de réglementation (0 à 6), pas un temps de conformité.
- **Paying Taxes (PwC/Banque mondiale)** : la page PwC répond 403 ; la série repose de toute façon sur les données de Doing Business, donc elle est touchée par le même arrêt. Non retenue.

**Ce que dit le contrôle PMR (2023, rang sur 8, 1 = le moins restrictif).** France : indice global 1,23 (moyenne des sept comparateurs 1,11 ; 6e) ; charge administrative et réglementaire 1,51 (1,46 ; 5e) ; réglementation de la profession comptable 2,29 (0,91 ; 7e) ; réglementation de la profession d'avocat 3,36 (2,52 ; 8e). Lecture : la charge administrative française est dans la moyenne du groupe, ce qui rejoint le constat de Doing Business (139 h contre 159 h : « pas un cas extrême »). En revanche, l'entrée dans les professions comptable et juridique est nettement plus encadrée qu'ailleurs, ce qui est cohérent avec la taille de l'industrie estimée, sans la prouver (corrélation, pas causalité ; un indice de règles ne mesure ni heures ni emplois). Aucun résultat du modèle ne change.

## 3. Formules (`modele.js`)

L'industrie est découpée en huit segments, répartis en trois blocs :

- **A. Marché externe** : chiffre d'affaires facturé par des prestataires ;
- **B. Travail interne des employeurs** : salariés qui font la paie, la comptabilité et les déclarations en interne ;
- **C. Temps des ménages** : temps non marchand.

Pour chaque segment *s* et chaque scénario :

- activité « complexité » = base × partComplexite ;
- disparaît = complexité × partDisparait ;
- se transforme = complexité × partTransforme ;
- reste = complexité × (1 − partDisparait − partTransforme).

Ces trois formules s'appliquent aux montants (Md€) comme aux emplois.

**Gain pour l'économie** (`gainEconomie`) :

- **coût évité** = montant qui disparaît. Les clients n'ont plus à payer ce montant. À court terme, c'est un transfert : ce que le client économise, le secteur le perd ;
- **gain réel** = emplois qui disparaissent × taux de réemploi × valeur ajoutée par emploi. La richesse nouvelle vient du travail libéré puis réemployé ailleurs ;
- **gain réel net** = gain réel − coût annuel du système public qui remplace ;
- **coût de transition ponctuel** = emplois qui disparaissent × coût d'une reconversion.

**Reconversion** (`fluxAnnuel`, `reconversion`) :

- suppressions par an = emplois qui disparaissent ÷ durée de la transition ;
- départs en retraite par an = emplois « complexité » × taux de départ ;
- à reconvertir = suppressions − départs non remplacés (au minimum zéro) ;
- les personnes à reconvertir sont ensuite réparties entre des métiers d'arrivée.

Lancer : `jsc modele.js test_modele.js`, depuis ce dossier. jsc se trouve à `/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc`.

## 4. Hypothèses numérotées

- **H1 — Périmètre** (hypothèse de l'auteur). Le système cible automatise la paie (le prélèvement unique est calculé par le système public à partir de la DSN), la comptabilité de base (elle est déduite de la facture électronique) et l'impôt (pas de niches, donc pas de déclaration à optimiser). Ce qui ne dépend pas de la règle fiscale reste : la gestion, l'audit de fiabilité, le droit des contrats, les successions.
- **H2 — Audit légal** (hypothèse de Claude). Les honoraires de certification (2,97 Md€, H2A) sont retirés du NAF 69.20. Leurs emplois (≈ 23 000) sont estimés au prorata du CA, à 7 884 personnes par Md€ (Eurostat 69.20). L'audit est une demande de **fiabilité**, pas de complexité. On ne lui attribue donc que 5 à 15 % d'activité liée à la complexité.
- **H3 — Expertise comptable** (hypothèse de Claude, ⚠️ aucune répartition du CA par mission n'a été trouvée). Hors audit, la base est de 25,1 Md€ pour ≈ 198 000 personnes. La part liée à la complexité fiscale et sociale (tenue de base, paie, déclarations, social) vaut 35 / 50 / 65 %. Il en disparaît 40 / 60 / 80 % ; il s'en transforme 40 / 30 / 15 %, vers le conseil de gestion, le pilotage et l'accompagnement des créateurs.
- **H4 — Activités juridiques** (hypothèse de Claude, appui faible). Le NAF 69.10 (31,9 Md€, 190 000 personnes) comprend aussi les notaires et les commissaires de justice. La part fiscale et sociale est fixée à 5 / 10 / 15 %. Seul repère trouvé : en 2003, 15,3 % des mentions de spécialisation d'avocat concernaient le droit fiscal (Infostat n° 72). Une partie disparaît (optimisation, contentieux d'assiette) : 30 / 50 / 70 %.
- **H5 — Éditeurs et prestataires de paie.** La somme des CA des entités françaises observées vaut 1,87 Md€ (comptes déposés de 2022 à 2025, plus l'ARR de PayFit ⚠️). C'est un **plancher** du marché : les études de marché sont payantes et n'ont pas été lues. Ces CA comprennent aussi la comptabilité, les RH et l'ERP. **Correction V6655 (03/11/2026)** : une partie de ce CA est payée par les cabinets d'expertise comptable (Cegid, Sage, Silae vendent surtout aux cabinets) et figure déjà dans le CA du NAF 69.20, donc dans le segment « expertise » : on la retire (consommation intermédiaire). Part retenue : 60 / 40 / 20 % du CA vendu aux cabinets (bas / central / haut), 📐 hypothèse de Claude, aucune donnée de ventilation publique ; l'ordre de grandeur est borné par les achats de biens et services du NAF 69.20 (10,6 Md€ en 2024, Eurostat). Les ventes directes aux employeurs restent comptées. La part liée à la paie réglementaire vaut 40 / 50 / 60 %. Les emplois sont estimés à 200 000 € de CA par emploi (hypothèse de Claude, cohérente avec ADP GSI France : 314 M€ de CA pour 1 000 à 1 999 salariés). Les logiciels de RH, de temps de travail et de planning restent.
- **H6 — Cabinets de crédit d'impôt et d'optimisation des charges.**
  - Base : 0,26 Md€ dans le scénario bas (somme des CA observés d'Ayming, Leyton, FI, ABGI, GAC et Abington, années diverses) ; 7 % du CIR + CII dans le scénario central ; 10 % dans le scénario haut (CIR + CII = 8,27 Md€ en 2026).
  - Repères : selon l'IGF (2010), les six plus gros cabinets font 4 % des créances, 25 % des entreprises recourent à un cabinet, et les honoraires valent 20 % du crédit en moyenne. Le rapport Gonthier-Maurin (2015) avance une « perte en ligne » d'environ 10 %, mais c'est une hypothèse de la rapporteure.
  - Toute l'activité tient à la complexité. Il en disparaît 60 / 80 / 95 %. Le reste se transforme en conseil en subventions, si les « modulations » du chapitre 9 recréent des aides.
  - Emplois : 150 000 € de CA par emploi (hypothèse de Claude).
- **H7 — Gestion de patrimoine** (⚠️ chiffres auto-déclarés). Les membres de l'ANACOFI déclarent plus de 3 Md€ de CA et environ 30 000 emplois. La part liée à la défiscalisation (Pinel, FIP/FCPI, Girardin, montages de transmission) vaut 15 / 25 / 35 % (hypothèse de Claude ; la part réelle n'a pas été trouvée). Il en disparaît 50 / 70 / 90 %.
- **H8 — Travail interne des employeurs** (hypothèse de Claude, poste le plus incertain et le plus lourd).
  - Effectif : 1,42 M d'emplois dans les métiers comptables et administratifs en 2019 (Métiers 2030 : employés de la comptabilité 284 000, techniciens 452 000, cadres 688 000). On en retire les 221 000 personnes du NAF 69.20, ce qui laisse 1,20 M de personnes. **Correction V6651 (03/11/2026)** : la phrase « ce total englobe le secteur public » était fausse. Dans la nomenclature de *Les Métiers en 2030* (tableau A3, p. 148 du PDF), les familles L1Z, L4Z et L5Z sont celles des employeurs privés ; les agents administratifs de la fonction publique sont dans P0Z (cat. C), P1Z (cat. B) et P2Z (cat. A), et la banque dans Q0Z-Q2Z. Les agents de la DGFiP ne sont donc pas dans ce 1,2 M : **pas de double compte avec le coût public du prélèvement** (`sources/cout-complet-prelevement.md`). En revanche, les familles « services administratifs, comptables et financiers » contiennent aussi des fonctions sans lien avec la conformité (RH, achats, contrôle de gestion, trésorerie) : d'où la part de 15 / 25 / 35 %, qui reste une hypothèse. Autre limite : on retire les 221 000 personnes du NAF 69.20, qui comprennent aussi des non-comptables, d'un effectif défini par métier.
  - Part du temps consacrée à la conformité fiscale et sociale (paie, TVA, liasses, DSN, contrôles) : 15 / 25 / 35 %.
  - Coût : 72 900 € par ETP (frais de personnel du NAF 69.20 rapportés aux ETP).
  - **Recoupement (requalifié 📐, V6650)** : 139 h par an (Doing Business 2020, source arrêtée, trois impôts ; fonction `etpConformite`) × 1,57 M d'employeurs ÷ 1 607 h ≈ 135 000 ETP. Le « plancher » n'est pas démontré : l'entreprise type de Doing Business est une entreprise **moyenne** (« medium-size », profil France p. 39), alors que 83 % des employeurs ont moins de 10 salariés (Urssaf 2024 : 1 302 504 sur 1 566 209) ; seuls trois impôts sont comptés, mais la durée n'est pas proportionnelle à la taille (VVA/KPMG : 13 897 € pour une micro-entreprise, 33 917 € pour une grande). Ce n'est qu'un ordre de grandeur. Le contrôle principal est désormais celui de la § 4 bis. Le bloc B va de 180 000 (bas) à 421 000 (haut).
- **H9 — Temps des ménages** (hypothèse de Claude, ⚠️ aucune mesure française trouvée). 41,5 M de déclarations de revenus (⚠️ presse) × 1 / 2 / 4 h par an (impôt, plus démarches sociales liées aux ressources) × 12 € de l'heure. Ce montant de 12 € est proche du Smic horaire brut ⚠️. Repères : 8 h et 160 $ pour une déclaration américaine sans activité professionnelle (IRS) ; plus de 10 M de foyers en déclaration automatique en France. Ce bloc ne compte aucun emploi.
- **H10 — Départs en retraite** (Métiers 2030). 406 000 départs en fin de carrière entre 2019 et 2030 dans les trois familles comptables et administratives, soit 2,6 % de l'effectif par an. Ce taux est appliqué aux emplois « complexité ». On suppose qu'aucun départ n'est remplacé dans les fonctions qui disparaissent.
- **H11 — Métiers d'arrivée** (parts indicatives, hypothèse de Claude, à soumettre au débat) :
  - contrôle de gestion, audit et conseil aux TPE-PME : 35 % ;
  - numérique, qualité des données et support du système public : 15 % ;
  - contrôle, lutte contre la fraude et accompagnement des usagers : 10 % ;
  - enseignement et formation : 10 % ;
  - santé et aide à la personne : 15 % ;
  - industrie : 5 % ;
  - création ou reprise d'entreprise : 10 %.
  Les besoins de recrutement sont sourcés dans `reconversion_metiers.csv`.
- **H12 — Gain et coûts** (hypothèses de Claude) :
  - taux de réemploi : 60 / 80 / 90 % ;
  - valeur ajoutée par emploi réemployé : 77 500 €. C'est la VA par personne du NAF 69.20, utilisée comme approximation de la productivité de ces personnes ailleurs ;
  - coût annuel du système public qui remplace : 1,5 / 1 / 0,5 Md€. À remplacer par les résultats de T7. Pour repère, le projet de facturation électronique a coûté 268 M€ à l'État ;
  - coût d'une reconversion : **29 / 10 / 5 k€** par personne (valeurs ci-dessous, remplaçant 40 / 25 / 15 k€ sans source). Fourchette sourcée (sources primaires, lues le 01/11/2026 ; V2886-V2891) :
    - *Formation seule* : bas 1,6 k€ (CPF, coût unitaire d'une action en 2023 : 1 610 €, durée courte)[^reconv-cpf] ; central 4,7 k€ (formation de demandeur d'emploi achetée par France Travail, coût pédagogique moyen par entrée en 2023, contre 2,7 k€ en 2018)[^reconv-pic] ; haut 7,3 k€ (coût pédagogique moyen d'un projet de transition professionnelle en 2023, 943 heures en moyenne)[^reconv-ptp]. En ajoutant la mise en œuvre et les aides (2,9 k€), un PTP hors rémunération coûte 10,4 k€.
    - *Formation et maintien de revenu* : le projet de transition professionnelle coûte 29 220 € par dossier en 2023 (17 762 projets, 519 M€ net engagé), dont 18 863 € de rémunération (65 %), 7 274 € de coût pédagogique (25 %), 2 694 € de mise en œuvre (9 %)[^reconv-ptp]. C'est le seul coût unitaire complet publié en France ; il vaut pour des salariés en congé rémunéré de longue durée (la prise en charge est plafonnée au-delà de 2 Smic), et plafonne donc la fourchette.
    - *Choix pour le modèle* : le revenu des personnes sans emploi est couvert par le socle (L5), donc le paramètre porte sur la formation et l'accompagnement. Bas du modèle (pessimiste) = 29 k€ (parcours long avec maintien intégral du salaire, ce qui est la borne haute observée) ; central = 10 k€ (formation longue certifiante et sa mise en œuvre, hors rémunération) ; haut du modèle (optimiste) = 5 k€ (formation courante des demandeurs d'emploi). Ce sont des choix de Claude entre des bornes sourcées, pas une mesure.
    - *Effets observés* (le coût n'a de sens qu'avec le résultat) : six mois après un PTP, 59 % occupent un poste en lien avec la formation, 15 % n'ont pas d'emploi, 32 % poursuivent leur projet, 9 % ont renoncé (enquête OTP 2023)[^reconv-ptp]. Pour les demandeurs d'emploi, le comité scientifique du PIC trouve que la formation qualifiante accroît l'accès à l'emploi d'environ 9 points à deux ans, à caractéristiques observables comparables (67 % en emploi), mais seulement de 4 points pour la formation préparatoire[^reconv-pic] ; ces effets ne sont pas purement causaux (biais de sélection sur l'inobservable).
    - *Comparaison étrangère* : le programme américain TAA a coûté à la société 8 086 $ par participant (dollars 2006, hors transferts de revenu) et 15 694 $ au reste de la société, transferts compris, dont 5 786 $ de formation et allocations ; son effet est négatif sur le revenu total à quatre ans (valeur actuelle nette pour la société : −53 802 $, surtout du revenu perdu pendant 79,8 semaines de formation en moyenne) mais l'écart d'emploi se referme en quatrième année pour les formés[^reconv-taa]. L'ordre de grandeur de la formation (5-6 k$) est cohérent avec la fourchette française ; la leçon est que le coût de reconversion est dominé par le revenu perdu, pas par la formation. Non trouvé : coût par bénéficiaire et effets mesurés au Danemark et dans l'OCDE (⚠️ À VÉRIFIER, V2891).

## 4 bis. Contrôles externes, part liée à la norme et part irréductible (V6650-V6659, 03/11/2026)

**Contrôle VVA/KPMG (Commission européenne, 2022).** Les entreprises des 28 pays étudiés dépensent environ **204 Md€ par an** pour se conformer aux impôts et cotisations les plus lourds, soit **1,3 % du PIB**, dont 87 % supporté par les micro-entreprises et 10 % par les petites (rapport final, p. 21 ; enquête 2019, 2 479 entreprises ; le coût inclut le temps interne valorisé et les honoraires). Appliqué au PIB français de 2024 (2 935 Md€) : **38 Md€** brut, **31 Md€** si on ajuste par les heures de conformité (139 sur 170 en moyenne UE ; Doing Business). Fonction `coutConformiteVVA`. Comparable côté T6 (expertise, audit, juridique, paie, interne ; hors CIR, patrimoine et ménages) : **38,5 Md€** au central. Les ordres de grandeur sont donc compatibles ; ce n'est pas une confirmation indépendante (VVA mesure le coût de conformité total, pas la part due à la complexité ; pays et périmètre différents ; PME surtout, sans les grandes entreprises ; dispersion forte). Le Parlement européen (PE 642.353, p. 26) donne 1,9 % du chiffre d'affaires en moyenne, le plus souvent entre 1 et 2 %, et note que le coût relatif décroît avec la taille.

**Part liée à la norme, part irréductible.** Le modèle sépare déjà, par segment, la part « complexité » (`partComplexite`), puis ce qui disparaît, se transforme ou reste. Ce qui est hors de `partComplexite` est l'**irréductible** : comptabilité de base, paie qui reste nécessaire, droit des contrats, conseil de gestion utile. Au central : expertise comptable, 50 % de complexité et 50 % d'irréductible ; audit, 10 % et 90 % ; juridique, 10 % et 90 % ; interne, 25 % et 75 % ; paie, 50 % et 50 % ; CIR et ménages, 100 % de complexité. Seul repère observé pour la borne de disparition : Doing Business 2020 donne 50 h en Estonie contre 139 h en France, soit **64 % de temps de conformité fiscale en moins** (source arrêtée, trois impôts, entreprise moyenne). Le central (60 % de disparition de la part « complexité ») est sous cette borne ; le **haut (80 %) la dépasse** : il suppose un système plus automatisé que le meilleur précédent observé. Sensibilité : avec 64 % au lieu de 80 % pour l'expertise et l'interne dans le haut, ce qui disparaît passe de 45,3 à 37,8 Md€.

**Double comptes examinés.**
1. *Avec le coût public du prélèvement* : aucun par les effectifs (voir H8, familles privées) ; T6 est un coût privé, le coût public est compté à part (7,6 Md€) ; les deux ne s'additionnent pas pour autant dans un résultat commun sans le dire (les ménages 0,5 / 1 / 2 Md€ et les taux de disparition sont partagés).
2. *Avec T7 (État-plateforme)* : T6 ne compte aucune dépense informatique publique, donc le budget informatique de la DGFiP n'y figure pas ; le double compte du chapitre 4 est entre T7 et le coût public du prélèvement. Reste un seul point commun : le coût du système public qui remplace (H12, 0,5 / 1 / 1,5 Md€ par an, 📐 hypothèse sans source) ; il ne doit être déduit qu'une fois dans un bilan qui réunit T6 et T7.
3. *Éditeurs de paie et cabinets* : corrigé (H5, V6655).
4. *T6 v2 (patrimoine)* : les segments CGP et juristes/notaires de la v2 recouvrent « patrimoine » et « juridique » de la v1 : les résultats v2 ne s'ajoutent pas aux 26 / 41 / 57.

**Sources primaires relues le 03/11/2026** : Eurostat SBS 2024 (API, NAF 69.20 et 69.10 : valeurs des CSV confirmées ; le CA de 2021 de l'API, 22 022 M€, 21 690 entreprises, 166 196 ETP, est identique à la fiche Insee-Ésane n° 692, publiée le 11/03/2024) ; Urssaf open data 2024 (1 566 209 employeurs, 20 273 475 salariés, 726,5 Md€ de masse salariale : confirmés) ; H2A 2025, p. 49-50 (18 978 CAC, 208 128 mandats, 2 968 396 282 € d'honoraires : confirmés) ; CNB 2026 (78 938 avocats : confirmé) ; comptes déposés (API Recherche d'entreprises : Cegid 664,2 M€ en 2024, Sage 380,3 M€ en 2025, ADP GSI 314,3 M€ en 2024, Silae 56,5 M€ en 2022 : confirmés) ; Doing Business 2020, profil France (139 h = 80 + 31 + 28 ; confirmé) ; Métiers 2030, tableau A3 (284 000, 452 000, 688 000 : confirmés). Non obtenus : ventilation du CA des cabinets par mission et effectif des experts-comptables (Ordre : infographie en image, rapport moral de l'Ordre de Paris sans chiffre national), nombre de déclarants de l'impôt sur le revenu (reste ⚠️).

## 5. Ce qui disparaît, ce qui se transforme, ce qui reste

| Activité | Disparaît | Se transforme | Reste |
|---|---|---|---|
| Saisie comptable, rapprochements, TVA | oui : la facture électronique produit l'écriture et la TVA | contrôle de la qualité des données | — |
| Calcul de la paie, DSN, taux et exonérations, conventions collectives (900 dans le moteur de Silae) | le calcul des prélèvements et le paramétrage des allègements | gestion du temps de travail, des absences, des contrats | droit du travail, conventions sur les salaires |
| Liasses fiscales, optimisation, niches | oui, s'il n'y a pas de niches | conseil en structuration économique (pas fiscale) | fiscalité internationale résiduelle, transition (T16) |
| Dossiers de CIR et de CII, optimisation des charges sociales | oui | montage de demandes de subventions, si elles existent | — |
| Défiscalisation patrimoniale | oui | conseil en épargne et en allocation | successions, transmission |
| Contentieux d'assiette et de taux | en grande partie | — | contentieux de fraude, de valeur (évaluations), de procédure |
| Audit légal | peu | audit des données et des systèmes | certification des comptes |
| Démarches des ménages (déclaration, justificatifs CAF) | oui (socle sans condition) | — | changements de situation |

## 6. Effets de comportement et de rebond

Aucune élasticité directement applicable n'a été trouvée dans la littérature : ni élasticité de la demande de services comptables au coût de conformité, ni élasticité de l'offre de complexité. On le dit plutôt que d'en inventer une. Cinq effets sont pris en compte de façon qualitative ou par les scénarios :

1. **Contrefactuel de l'automatisation (effet le plus important).** Ces métiers déclinent déjà sans réforme :
   - Frey et Osborne (2013) estiment la probabilité d'automatisation à 0,99 pour les préparateurs fiscaux, 0,98 pour les aides-comptables, 0,97 pour les agents de paie et 0,94 pour les comptables ;
   - Eloundou et al. (2023) jugent les préparateurs fiscaux exposés à 100 % aux grands modèles de langage ;
   - les projets de recrutement d'employés de la comptabilité ont baissé de 7 043 en six ans (BMO 2026) ;
   - Métiers 2030 prévoit −24 % d'emplois chez les employés de la comptabilité d'ici 2030, avec un excédent de 61 000 débutants.
   Une partie de la « disparition » est donc **attribuée à tort à la réforme**. Le modèle mesure ce que la complexité fait vivre aujourd'hui, pas l'effet propre de la réforme. Inversement, des règles simples rendent l'automatisation plus facile et plus fiable.
2. **Migration de la complexité.** Chaque « modulation » réintroduite (chapitre 9) est une niche, donc une activité de conseil. Ce risque est représenté par la part « reste » et par le scénario bas.
3. **Rente défensive (Tullock, Krueger).** Une industrie menacée dépense pour se maintenir. Précédent américain : Intuit (TurboTax : 5,3 Md$ de revenus en 2026) et H&R Block (3,9 Md$). Le pilote public IRS Direct File (140 803 déclarations en 2024, 30 M de contribuables éligibles en 2025) a été suspendu en 2025. Les montants de lobbying n'ont pas été trouvés en source primaire ⚠️. Précédent français : l'encadrement des honoraires des cabinets de CIR en 2011 a eu un effet jugé faible (rapport Berson).
4. **Effet de transition.** Pendant la bascule, la demande de conseil **augmente** : double système, droits acquis, montages à dénouer (T16). Les scénarios supposent une disparition progressive sur 5, 10 ou 15 ans.
5. **Effet de concentration.** Le marché se concentre déjà : le rapprochement Cegid-Silae (09/2026) vise plus de 10 Md€ de valeur d'entreprise et 13 M de bulletins par mois en Europe. Une partie de la valeur captée tient aux effets de réseau autour de la complexité. Un député a affirmé un triplement des prix de Silae en deux ans, sans confirmation ⚠️.

## 7. Scénarios

| Paramètre | Bas | Central | Haut |
|---|---|---|---|
| Part « complexité » de l'expertise comptable | 35 % | 50 % | 65 % |
| Part du temps interne consacrée à la conformité | 15 % | 25 % | 35 % |
| Part qui disparaît (expertise, interne) | 40 % | 60 % | 80 % |
| Cabinets de CIR (base) | 0,26 Md€ (observé) | 7 % du CIR | 10 % du CIR |
| Heures par foyer | 1 h | 2 h | 4 h |
| Durée de la transition | 15 ans | 10 ans | 5 ans |
| Taux de réemploi | 60 % | 80 % | 90 % |
| Coût annuel du système public | 1,5 Md€ | 1 Md€ | 0,5 Md€ |
| Coût par reconversion | 29 k€ | 10 k€ | 5 k€ |

« Bas » combine une industrie petite, peu de disparition et une transition lente. « Haut » combine l'inverse. Les scénarios encadrent un ordre de grandeur : ce ne sont pas des prévisions.

## 8. Limites

- **L1. Les parts « complexité » (H3, H4, H7, H8) sont des hypothèses**, non des mesures. Elles déterminent l'essentiel du résultat. Passer la part du travail interne de 25 à 35 % fait passer les emplois qui disparaissent de 261 000 à 333 000.
- **L2. Le bloc B (travail interne) est le plus lourd et le plus fragile.** Il repose sur des familles de métiers très larges, et aucune enquête française de temps n'a été trouvée.
- **L3. Doubles comptes possibles.** Les CA des éditeurs de paie comprennent des ventes aux cabinets comptables. Les emplois de l'ANACOFI recoupent peut-être ceux du NAF 66 ou 69. Le bloc B recoupe en partie les métiers du NAF 69.20, retirés en bloc.
- **L4. Données anciennes.** Les honoraires de CIR datent de l'IGF 2010. La charge administrative de contrôle date de 2007. Doing Business date de 2020 et a été arrêté en 2021 pour irrégularités (§2 bis) ; le contrôle OCDE PMR (2018-2023) mesure des règles, non des heures.
- **L5. Le gain réel suppose le réemploi.** Sans politique de reconversion, une partie du « coût évité » n'est qu'un transfert vers des personnes sans emploi, alors couvertes par le socle.
- **L6. Le modèle ne chiffre pas les bénéfices de la complexité** : ciblage des aides, progressivité fine, incitations sectorielles. Le steelman est à écrire dans le chapitre.
- **L7. Contrefactuel IA non soustrait** (voir l'effet 1). C'est la principale raison de lire « disparaît » comme « ne serait plus nécessaire », et non comme « supprimé par la réforme ».

## 9. Ce qui manque

- Une répartition du CA des cabinets d'expertise comptable par mission (Ordre des experts-comptables, Xerfi).
- Le nombre de gestionnaires de paie et les portraits statistiques de la Dares (site derrière un captcha).
- La taille du marché de la paie externalisée et des SIRH (études payantes).
- Le CA des grands cabinets d'avocats fiscalistes et le nombre d'avocats titulaires de la mention de spécialisation en droit fiscal.
- La collecte FIP/FCPI, le coût récent du Pinel, du Girardin et des Sofica, la part de la défiscalisation dans la rémunération des CGP.
- Les réclamations contentieuses, les rescrits et le nombre de contrôles : le rapport d'activité de la DGFiP n'était pas accessible (erreur 403).
- Le contentieux Urssaf.
- Une mesure française du temps passé par les ménages (enquête Insee) et par les dirigeants (baromètres CPME ou Bpifrance).
- Le coût d'une reconversion : traité au 01/11/2026 (H12) ; reste le Danemark, l'OCDE, le coût de l'apprentissage et de Pro-A, et un coût complet pour les demandeurs d'emploi (formation + allocation de retour à l'emploi).
- Les données OCDE *Tax Administration* sur la France (site en erreur 403).
- Les indicateurs B-READY 2026 pour la France.

[^reconv-ptp]: France compétences, *Rapport sur l'usage des fonds de la formation professionnelle et du CEP, 2024 : projet de transition professionnelle* (données 2023 ; coût unitaire 29 220 €, durée moyenne 943 h, enquête OTP), [PDF](https://francecompetences.fr/app/uploads/2025/02/09-rapport-usage-fonds-2024-ptp.pdf), 02/2025, consulté le 01/11/2026 ; même rapport pour 2022 (28 706 €), [PDF](https://www.francecompetences.fr/app/uploads/2024/01/20240124_belazar_FC_RUF23_PTP-cout.pdf), 01/2024, consulté le 01/11/2026.
[^reconv-cpf]: France compétences, *Rapport sur l'usage des fonds, 2024 : compte personnel de formation* (données 2023 : 1,34 M de dossiers, 2,091 Md€, 1 610 € par action, dont 1 504 € de coût pédagogique), [PDF](https://francecompetences.fr/app/uploads/2025/01/07-rapport-usage-fonds-2024-cpf.pdf), 01/2025, consulté le 01/11/2026. La rémunération pendant la formation n'est pas incluse.
[^reconv-pic]: Comité scientifique de l'évaluation du Plan d'investissement dans les compétences (Dares), *Rapport final*, avril 2025, copie hébergée par [newstank](https://rh.newstank.fr/file/public/c7f3165a8694223d4f7c0fb567d038ce/rapport-final-comite-scientifique-evaluation-pic.pdf) (exemplaire à comparer au PDF officiel Dares), consulté le 01/11/2026 : coût moyen d'une entrée en formation France Travail 2 700 € (2018) à 4 700 € (2023), source France Travail, direction du contrôle de gestion, juillet 2024 ; effets de la formation qualifiante et préparatoire : synthèse du rapport.
[^reconv-taa]: D'Amico R., Schochet P. (Social Policy Research Associates et Mathematica), *The Evaluation of the Trade Adjustment Assistance Program : A Synthesis of Major Findings*, décembre 2012, [PDF](https://www.dol.gov/sites/dolgov/files/ETA/publications/ETAOP_2013_08.pdf) ; et Dolfin S., *The Benefits and Costs of the TAA Program* (tableau VI.1, dollars 2006), [PDF](https://www.dol.gov/sites/dolgov/files/ETA/publications/ETAOP_2013_09.pdf), U.S. Department of Labor, consultés le 01/11/2026.

## 10. v2 : optimisation patrimoniale et successorale (T6 v2, 02/11/2026)

**Origine.** Position de l'auteur du 02/11/2026 sur la valeur des savoirs d'optimisation. L'auteur pose que connaître les régimes fiscaux et matrimoniaux complexes n'a pas de valeur propre : ce savoir n'existe que par la complexité de la règle. Il y voit une **double captation de valeur** : (1) des recettes perdues par le pot commun, (2) du temps humain qualifié mobilisé à optimiser plutôt qu'à produire. Il demande un chiffrage inhabituel, avec avertissements sur les effets de bord. Consultation des sources : 02/11/2026. Données : `donnees/optimisation_patrimoniale.csv`. Code : `modele.js` (section v2). Tests : `test_modele.js` § 4.

**Principe retenu (opinion de l'auteur, reprise ici comme cadre, non comme résultat).** La cible est la règle et ceux qui la votent, pas ceux qui la conseillent ou l'utilisent : c'est la règle qu'il faut changer, pas la vertu individuelle qu'il faut invoquer. Le modèle décrit un système.

### 10.1 Question posée

1. **Recettes en jeu.** Combien coûtent au pot commun les régimes de faveur à la transmission (Dutreil, assurance-vie hors succession, démembrement, exonérations classées), et combien rapporterait réellement leur suppression ou leur plafonnement une fois les réactions prises en compte ?
2. **Matière grise mobilisée.** Combien d'emplois qualifiés, et quelle valeur ajoutée, l'optimisation patrimoniale et successorale mobilise-t-elle (conseil en gestion de patrimoine, notariat, juristes) ?
3. **Coût d'opportunité.** Que gagnerait la société si ce temps était réalloué, avec une méthode prudente ?

### 10.2 Hypothèses numérotées (suite de H1-H12)

- **H13 — Recettes en jeu : somme de quatre postes** (`POSTES_RECETTES`), en Md€/an, avant réaction : (a) **Pacte Dutreil** 4,0 / 5,0 / 5,7. Le PLF 2026 (Voies et moyens t.2, ligne 520110, p. 138 du tome) donne 5 000 M€ en 2024 puis 4 000 M€ en 2025 et 2026, fiabilité « ordre de grandeur » ; la Cour des comptes (18/11/2025) 5,5 Md€ ; l'IPP 4,85 à 5,7. Le tome note lui-même une révision de +4,2 Md€ « résultant d'une nouvelle actualisation de son chiffrage » : l'ancien chiffrage officiel (0,8 Md€) était très bas. (b) **Assurance-vie hors succession** 4,0 / 4,5 / 5,0 (CAE n°69, 2021 : « 4 à 5 milliards », données 2017-2018 ; **non classée** dépense fiscale). (c) **Démembrement** 2,0 / 2,5 / 3,0 (CAE n°69, données vers 2006 ⚠️ ancien). (d) **Autres exonérations et abattements classés** 0,3 (somme de lignes du PLF 2026 : 100 + 50 + 12 + 120 = 282 M€ ; plusieurs lignes sont « nc »).
- **H14 — Ce qui n'est pas dans la somme.** (a) L'**abattement de 100 000 € par parent et par enfant** (CGI 779) ne figure pas en dépense fiscale : le tome 2 explique que « de nombreux abattements et exonérations structurels ont été assimilés à la norme » et déclassés au PLF 2009. Son coût n'est donc **pas chiffré** par l'État ; la v2 ne l'inclut pas et ne l'invente pas ⚠️. (b) Les montages de **SCI endettée** (donation de parts à valeur nette du passif) ne sont chiffrés nulle part ⚠️. (c) La **sous-déclaration** : le CAE estime le patrimoine transmis déclaré 35 à 40 % plus faible que le flux économique (1994-2006), ce qui mélange sous-évaluation, exonérations et dissimulation. (d) L'IFI : 205 M€ de dépenses fiscales classées, mais l'exonération des biens professionnels est « nc ».
- **H15 — Double compte possible.** Dutreil et démembrement peuvent s'appliquer à la même transmission (donation de la nue-propriété de titres sous pacte). La somme est donc un **majorant** ; le scénario bas retient les valeurs basses des deux. Aucune étude du recouvrement n'a été trouvée ⚠️.
- **H16 — Rendement net** : `brut × part récupérée × (1 − fuite)`. Part récupérée 0,4 / 0,6 / 0,8 : une partie du coût migre vers d'autres montages ou est ré-exonérée par le législateur (migration de la complexité, v1 § 6 point 2). Fuite (expatriation, renoncement) 20 / 10 / 5 % : le CAE cite une élasticité migratoire « de l'ordre de 10 % » (Kleven et al.) ⚠️ texte d'origine non lu ; Brülhart et Parchet (2014) trouvent, sur les cantons suisses, que les recettes de droits de succession ne baissent pas quand le taux monte (élasticité-revenu non différente de 1) ⚠️ résumé lu. Ce sont des choix de Claude entre ces repères.
- **H17 — Matière grise : trois segments** (`SEGMENTS_PATRIMOINE`). **CGP** : périmètre ANACOFI (3 Md€, 30 000 emplois, auto-déclarés ⚠️, qui incluent courtiers et immobilier) ; part « complexité patrimoniale » 10 / 20 / 30 % (hypothèse de Claude : les CNCGP indiquent 67 % de revenus d'assurance, dont l'assurance-vie est le principal véhicule fiscal ; la part liée à l'optimisation n'a pas été trouvée). **Notariat** : CA 2024 ≈ 8,5 Md€ (calcul : pic 2022 « plus de 10 Md€ », −11 % en 2023, −4 % en 2024, Autorité de la concurrence 25/02/2026), dont 45 % d'immobilier ; effectif 51 000 par calcul sur le CA par personne du NAF 69.10 (aucun effectif salarié lu ⚠️) ; part famille-successions-patrimoine hors immobilier 10 / 15 / 20 % du CA (hypothèse, non publiée), dont part « complexité » 30 / 50 / 70 %. **Juristes hors notariat** (69.10 moins notariat : 23,4 Md€, 139 000 personnes, incluant commissaires de justice et autres) : part fiscalité et droit patrimonial des particuliers et dirigeants 4 / 6 / 8 % (hypothèse ; le seul repère, 15,3 % de mentions de spécialisation en droit fiscal en 2003, est obsolète), dont part « complexité » 30 / 50 / 70 %.
- **H18 — Segments non chiffrés.** Banque privée et ingénierie patrimoniale des banques : aucune donnée primaire trouvée. Experts-comptables de dirigeants, family offices, assureurs (conception des produits) : non comptés. La matière grise est donc **sous-estimée**, dans un sens qu'on ne sait pas mesurer.
- **H19 — Disparaît / se transforme.** 30 / 50 / 70 % de l'activité « complexité » disparaît ; 40 / 30 / 20 % se transforme (conseil en épargne, en transmission d'entreprise, en protection du conjoint, médiation familiale). Hypothèses de Claude, par analogie avec H7 de la v1.
- **H20 — Valeur ajoutée.** VA = CA « complexité » × 0,69 (ratio VA/CA du NAF 69.10, 22 107 / 31 892, Eurostat SBS 2024). Appliqué aussi au CGP faute de mieux ⚠️.
- **H21 — Coût d'opportunité** (`coutOpportunite`) : `emplois qui disparaissent × taux de réallocation × valeur ajoutée par emploi × (produit social ailleurs − produit social ici)`. Le **ratio produit social / produit privé** vient de Lockwood, Nathanson et Weyl (2017), qui reprennent de la littérature l'idée que ce ratio est plus faible dans les professions très rémunérées que dans les autres, sans l'estimer eux-mêmes ; leurs résultats sont très sensibles à ces valeurs. Choix de Claude : produit social ici 0,5 / 0,25 / 0 (0 = pure complexité ; 1 = service pleinement utile), ailleurs 0,7 / 0,85 / 1 ; valeur par emploi 90 / 116 / 140 k€ (116 k€ = VA par personne du NAF 69.10, calcul) ; taux de réallocation 50 / 70 / 90 % (repère : 59 % en poste lié à leur projet six mois après un projet de transition professionnelle, enquête OTP 2023, v1 H12) ; coût de reconversion 29 / 10 / 5 k€ (bornes de la v1). La part non réemployée ne produit aucun gain, par prudence.
- **H22 — Ce que le modèle ne mesure pas** : l'effet **dynamique** d'allocation des talents (Murphy, Shleifer, Vishny 1991 : plus la part d'étudiants en droit est forte, plus la croissance est faible, coefficients non extraits ⚠️ ; Philippon et Reshef 2012 : 30 à 50 % du différentiel de salaire de la finance américaine serait de la rente). Il s'agirait de ce que choisiraient les **futurs** étudiants, pas des emplois actuels. On ne chiffre pas cet effet : il demanderait une élasticité du choix de carrière aux rémunérations relatives, introuvable pour la France.

### 10.3 Formules

`recettesEnJeu(postes, sc)` somme les postes ; `rendementReforme(brut, partRecuperee, fuite)` ; `produitParts(a, b)` ; `evaluerPatrimoine(sc, ratioVA)` réutilise `evaluer` (v1) sur `SEGMENTS_PATRIMOINE` ; `coutOpportunite(emplois, valeurEmploi, ici, ailleurs, taux, coutReconversion)` ; `bilanPatrimoine(sc)` assemble le tout. Fonctions pures, sans dépendance.

### 10.4 Effets de bord à garder en tête

1. **Transfert, pas création.** Les recettes récupérées sont un transfert des héritiers vers le pot commun. Le gain économique net est celui des distorsions évitées, non de la recette.
2. **Rebond.** Chaque exception réintroduite (par exemple une exonération des entreprises familiales « pour ne pas détruire l'emploi ») recrée une niche et son conseil.
3. **Le Dutreil a une logique de politique publique** (éviter la vente forcée d'une entreprise familiale à la mort du dirigeant). Le supprimer sans mécanisme de paiement différé ou fractionné peut produire ce qu'il veut prévenir (voir § 10.5).
4. **Transition.** Tant que la règle change, la demande de conseil augmente (v1 § 6 point 4).
5. **Données anciennes.** Deux des quatre postes (assurance-vie, démembrement) reposent sur des estimations de 2006 à 2018.
6. **Les emplois comptés ne sont pas des personnes à licencier** : le principe est de « ne perdre personne » (reconversion, départs en retraite, v1 § 6).

### 10.5 Steelman

- **La complexité est voulue par le législateur.** Le tome 2 des Voies et moyens le dit : sont classées en dépenses fiscales « les exonérations et abattements répondant à des objectifs poursuivis par le Gouvernement en matière de politique publique ». Le Dutreil protège la continuité d'entreprises familiales ; l'abattement entre parent et enfant protège la transmission du logement ; l'assurance-vie protège le conjoint et les proches. Supprimer ces dispositifs, c'est trancher le désaccord politique, pas corriger une erreur technique. La réponse du modèle : il chiffre ce que coûtent ces choix, il ne dit pas qu'ils sont faux. Le Dutreil a toutefois été jugé par la Cour des comptes à « faible retour économique », avec 110 donataires pour 65 % de l'avantage (⚠️ repris de `simu_3_transmissions.csv`).
- **Le service rendu aux ménages ordinaires.** Une partie du conseil sert à des successions simples, des divorces, des protections de conjoint, des régimes matrimoniaux, des mesures de protection de personnes vulnérables. Aucune de ces activités ne disparaît avec une règle simple ; c'est pourquoi la part « complexité » est de 15 à 50 % et non de 100 %. Les notaires ont aussi des tarifs réglementés (service rendu à tous, quelle que soit la complexité).
- **La fuite des patrimoines.** Le risque d'expatriation (Suisse, Belgique, Portugal, Italie, Luxembourg) est réel pour les très gros patrimoines. Les études citées donnent des élasticités modérées (≈ 10 % pour le CAE ; revenus stables en Suisse), mais elles portent sur des taux d'imposition, non sur la **suppression d'un cadre d'optimisation** ; on ne sait pas si l'effet est le même ⚠️. Le scénario bas retient une fuite de 20 %.
- **« Simplifier est aussi un choix de classe. »** Une règle simple avec un barème élevé fait peser le coût sur les patrimoines importants ; l'objection de propriété (droit de propriété et liberté de transmission, art. 2 et 17 de la Déclaration de 1789) est posée dans `sources/recherche-generations-patrimoine.md` § 6 ; la jurisprudence constitutionnelle n'a pas été relue ici ⚠️.

### 10.6 Limites

- Les parts de matière grise (H17, H19, H21) sont des hypothèses : aucun effectif ni CA du conseil patrimonial n'a été trouvé en source primaire. Elles sont à remplacer dès qu'une donnée existe (CSN, ANACOFI, ORIAS, Urssaf par code NAF).
- Les recettes ne tiennent compte ni de l'élasticité de l'épargne ni de l'effet sur la répartition (les 99 % de héritiers touchés ou non du CAE).
- Le modèle n'est pas relié au simulateur : l'effet de ces recettes sur le solde est déjà traité dans `sources/recherche-generations-patrimoine.md` § 6 (+9 Md€ CAE) et dans le système idéal (H3, H17, H178) : **ne pas les additionner** (double compte).
