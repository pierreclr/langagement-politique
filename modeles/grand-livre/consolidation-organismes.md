---
titre: Consolidation des données des organismes publics (budget, effectifs, mission)
statut: généré par `modeles/grand-livre/code/instances3_rapport.py` (ne pas éditer à la main) ; vérifications V19200 à V19203
---

# Consolidation des organismes : ce qu'on sait maintenant, ce qui manque

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026. Constat de départ : sur 2 776 lignes, 647 avaient un budget et beaucoup n'avaient ni effectifs ni mission lisible, donc l'auteur ne pouvait pas juger. Ce chantier ouvre des sources de masse (au lieu d'un organisme à la fois), enrichit `instances.csv` sans écraser ce qui était lu, et dit ce qui reste sans donnée et pourquoi. **Conflit d'intérêts** : aucun lien particulier avec ces sources ; Claude est un modèle d'Anthropic, comme dans tout le grand livre.

## 1. Couverture avant et après

| Information | Avant | Après | Gain |
|---|---|---|---|
| Budget chiffré | 647 (23,3 %) | 873 (31,4 %) | +226 |
| Effectifs (ETP, ETPT ou plancher SIRENE) | 1328 (47,8 %) | 1335 (48,1 %) | +7 |
| Mission lisible (objet, fonction ou activité NAF) | 1898 (68,4 %) | 2702 (97,3 %) | +804 |
| Répartition fonctionnement ou redistribution (nouvelle colonne) | 0 | 396 (14,3 %) | +396 |
| Frais de personnel (nouvelle colonne) | 0 | 393 (14,2 %) | +393 |

« Mission lisible » compte une mission déduite du nom ou de la fonction ; elle ne remplace pas la lecture de l'objet statutaire (voir les limites). Le budget d'une ligne n'est jamais additionné aux autres sans précaution : années différentes, charges brutes, entités emboîtées (voir `instances.md`).

### Par type d'organisme

| Type | Lignes | Budget avant → après | Effectifs après | Mission lisible avant → après | Frais de personnel |
|---|---|---|---|---|---|
| GIP (groupement d'intérêt public) | 755 | 10 → 155 | 410 | 315 → 746 | 145 |
| EPIC local (établissement public local à caractère industriel ou commercial) | 498 | 0 → 62 | 298 | 398 → 494 | 60 |
| commission ou instance consultative | 316 | 316 → 316 | 0 | 316 → 316 | 0 |
| établissement public national (hors recensement des opérateurs) | 298 | 0 → 6 | 167 | 107 → 288 | 6 |
| régie locale à caractère industriel ou commercial | 233 | 0 → 13 | 53 | 86 → 182 | 13 |
| chambre consulaire | 218 | 1 → 1 | 174 | 218 → 218 | 0 |
| opérateur de l'État | 172 | 170 → 170 | 171 | 172 → 172 | 169 |
| association ou fondation financée par l'argent public | 79 | 62 → 62 | 0 | 79 → 79 | 0 |
| établissement public non opérateur | 73 | 4 → 4 | 0 | 73 → 73 | 0 |
| autorité administrative ou publique indépendante | 29 | 25 → 25 | 24 | 29 → 29 | 0 |
| organisme de sécurité sociale | 24 | 24 → 24 | 0 | 24 → 24 | 0 |
| caisse de crédit municipal | 18 | 0 → 0 | 18 | 18 → 18 | 0 |
| entreprise publique | 18 | 1 → 1 | 0 | 18 → 18 | 0 |
| autorité constitutionnelle, pouvoir public ou juridiction suprême | 16 | 9 → 9 | 10 | 16 → 16 | 0 |
| collectivité ou organisme local (APUL) | 16 | 16 → 16 | 0 | 16 → 16 | 0 |
| service à compétence nationale ou service interministériel | 11 | 8 → 8 | 8 | 11 → 11 | 0 |
| agence régionale | 1 | 1 → 1 | 1 | 1 → 1 | 0 |
| établissement public (institution) | 1 | 0 → 0 | 1 | 1 → 1 | 0 |

## 2. Méthode, source par source

| Chantier | Source | Cote | Conflit d'intérêts | Ce qui a été ajouté |
|---|---|---|---|---|
| Opérateurs de l'État : répartition des charges | [Jaune « Opérateurs de l'État » PLF 2025](https://cfdt-ufetam.org/wp-content/uploads/2025/01/plf_2025_jaune_operateurs.pdf) (budget initial 2024, extrait par `odac_jaune.py`, copie CFDT-UFETAM car budget.gouv.fr renvoie 403) | A | aucun pour le contenu | charges de personnel, de fonctionnement et d'intervention (la redistribution) pour 169 opérateurs |
| Opérateurs : ETPT manquants | même jaune, tableau des emplois | A | aucun | 7 opérateurs (INPI 768, OFB 2 775, IRSN 1 653 en LFI 2024, EPAURIF 69 ; AFITF, FNAP et ACTA : case vide, 0 ETPT propre) |
| Établissements publics locaux, GIP, syndicats | [OFGL](https://data.ofgl.fr/explore/dataset/ofgl-base-epl-consolidee/) (comptes de gestion DGFiP, tables `epl` et `collectivites`), rapprochés par SIREN, exercice 2024 puis 2025 puis 2023 | A | aucun connu (OFGL est financé par des collectivités et l'État ; données issues de la DGFiP) | dépenses totales hors remboursement de dette (budget principal et annexes consolidés), fonctionnement, intervention, frais de personnel : 0 budgets nouveaux à la dernière exécution (les lignes déjà chiffrées sont intactes, voir `consolidation` dans le csv) |
| Entités hors OFGL | [Balances comptables DGFiP](https://data.economie.gouv.fr/explore/dataset/balances-comptables-des-etablissements-publics-locaux-depuis-2010/) (établissements publics locaux, syndicats, présentation nature-fonction), agrégées côté serveur par SIREN et compte (`instances3_fetch_balances.py`) | A (donnée) ; le calcul est de Claude | aucun connu | charges réelles de fonctionnement = classe 6 hors comptes 675, 676 et 68 (net débit moins crédit) ; **investissement non compté, donc plancher** ; contrôle : sur 63 entités présentes à la fois dans l'OFGL et dans les balances 2024, ce calcul retrouve les « dépenses de fonctionnement » de l'OFGL au centième près (rapport médian 1,000, minimum 0,997) ; redistribution = comptes 655, 656 et 657 ; personnel = compte 64 |
| Missions | [NAF rév. 2](https://www.insee.fr/fr/information/2120875) (Insee) rapprochée par SIREN dans SIRENE (table `sirene`, 01/10/2026) ; fonction d'activité OFGL (`cacti`) pour les établissements publics locaux | A | aucun | activité principale déclarée, pas l'objet statutaire |
| Textes fondateurs des GIP | dump JORF de la DILA (Légifrance, Licence Ouverte) lu en flux jusqu'au 21/06/2026 (`instances3_jorf_gip.py`) : 2 467 textes visant un GIP ; titres seulement (le corps des arrêtés n'est pas dans les fichiers) | A | aucun | égalité exacte du nom (sans les mots vides) entre le titre d'un arrêté de création ou d'approbation et la ligne ; 55 GIP rapprochés ; marqué « à vérifier » (colonne `texte_fondateur`) |

**Reproduire** : `instances2.py`, puis `instances3_fetch_balances.py` (réseau), `instances3_jorf_gip.py` (une fois), `instances3_consolidation.py` (venv), `instances3_rapport.py`, puis `instances_liste.py`. Le script ne remplace jamais un budget ou un effectif lu ; il ne remplace une mission que si elle était un texte par défaut (« mission non lisible », « à documenter »).

## 3. Ce qui a été essayé et n'a pas marché

- **Chambres consulaires** : aucun jeu de données ouvert par chambre (recherche sur data.gouv.fr sans résultat utile). Seuls des plafonds de réseau sont publiés : taxe pour frais de chambres de CCI France 525 M€ en 2024 (réponse ministérielle à une question écrite, déjà dans la ligne CCI France) ; plafond de la taxe additionnelle à la taxe sur le foncier non bâti des chambres d'agriculture à 292 M€ selon un amendement parlementaire (cote C, non vérifié contre la loi de finances : V19200). Les plus gros établissements publics nationaux restés sans budget (CNAM, ACOSS, CNAV, CDC, RATP, AFD, universités) sont des entités dont les comptes sont des agrégats ou des comptes non locaux : V19201. Les budgets individuels restent à demander ou à lire dans les rapports de chaque chambre.
- **Effectifs** : l'Urssaf (open data) et la DSN ne publient pas d'effectifs par établissement public ; seules les tranches SIRENE existent (planchers, employeurs diffusés seulement). Pour les établissements publics locaux, les **frais de personnel** de l'OFGL sont donnés comme repère, sans les convertir en ETP (ce serait une estimation à coût moyen inconnu).
- **Objet des GIP** : le dump JORF ne contient pas le corps des arrêtés (champ vide) ; les GIP locaux (MDPH, CDAD, maisons des adolescents…) sont approuvés par des actes préfectoraux, hors JORF. L'objet statutaire n'est donc pas lu : la mission vient du code NAF, plus grossière.
- **Budgets des régies et EPIC locaux** : seuls ceux qui ont un comptable public figurent dans l'OFGL et les balances DGFiP ; les offices publics de l'habitat et sociétés assimilées relèvent d'autres sources (RPLS, ANCOLS), non traitées ici.
- **Jaune PLF 2026** : seuls les statuts sont extraits (le jaune 2026 n'a pas été exploité pour les comptes) ; le budget initial 2024 du jaune PLF 2025 reste la référence.

## 4. Limites

1. Les années diffèrent : 2024 de préférence, sinon 2025 ou 2023 (la colonne `budget_annee` le dit).
2. Un budget OFGL est consolidé (budget principal et annexes, flux entre eux retirés) ; un budget de balance DGFiP est un plancher (fonctionnement seul). Ne pas les mélanger sans lire `budget_note`.
3. Les GIP des MDPH sont aussi dans l'agrégat des syndicats : ne pas les compter deux fois avec les lignes agrégées de l'APUL.
4. Une mission « Activité principale déclarée (NAF…) » est un diagnostic d'activité, pas un mandat : un GIP classé 84.13Z (administration des activités économiques) peut avoir une mission très précise.
5. 22 lignes (agences de l'eau, écoles, FranceAgriMer, CNM, Campus France…) ont le même SIREN qu'un opérateur du jaune : doublons probables, signalés dans `recouvrements` ; leur budget est dans la ligne de l'opérateur.
6. Aucune donnée sur des personnes physiques n'a été lue ou conservée.

## 5. Organismes toujours sans donnée

2391 lignes manquent d'au moins une information (budget, effectifs ou mission) ; la liste complète avec la raison, ligne par ligne, est dans `consolidation-sans-donnees.csv`. Beaucoup de manques sont normaux : les commissions n'ont pas d'effectifs propres, les caisses de sécurité sociale sont des agrégats.

| Type | Sans budget | Sans effectifs | Sans mission lisible | Raison principale |
|---|---|---|---|---|
| GIP (groupement d'intérêt public) | 600 | 345 | 9 | tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune source ouverte d'effectifs par établissement (DSN non publiée à ce niveau) |
| EPIC local (établissement public local à caractère industriel ou commercial) | 436 | 200 | 4 | absent des comptes OFGL et des balances DGFiP 2023-2025 (comptable non public, GIP à comptabilité privée ou entité sans budget propre) |
| régie locale à caractère industriel ou commercial | 220 | 180 | 51 | absent des comptes OFGL et des balances DGFiP 2023-2025 (comptable non public, GIP à comptabilité privée ou entité sans budget propre) ; tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune s |
| établissement public national (hors recensement des opérateurs) | 292 | 131 | 10 | hors jaune des opérateurs et absent des balances locales : comptes non publiés en données ouvertes consolidées |
| commission ou instance consultative | 0 | 316 | 0 | tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune source ouverte d'effectifs par établissement (DSN non publiée à ce niveau) |
| chambre consulaire | 217 | 44 | 0 | budget individuel non publié en données ouvertes (taxe affectée versée au réseau ; comptes dans les rapports des chambres) ; tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune source ouvert |
| établissement public non opérateur | 69 | 73 | 0 | source budgétaire non lue ; tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune source ouverte d'effectifs par établissement (DSN non publiée à ce niveau) |
| association ou fondation financée par l'argent public | 17 | 79 | 0 | association : compte de résultat non publié dans le jaune ni en open data (comptes au Journal officiel des associations, non traités) ; tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune so |
| entreprise publique | 17 | 18 | 0 | source budgétaire non lue ; tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune source ouverte d'effectifs par établissement (DSN non publiée à ce niveau) |
| organisme de sécurité sociale | 0 | 24 | 0 | tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune source ouverte d'effectifs par établissement (DSN non publiée à ce niveau) |
| caisse de crédit municipal | 18 | 0 | 0 | source budgétaire non lue |
| collectivité ou organisme local (APUL) | 0 | 16 | 0 | tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune source ouverte d'effectifs par établissement (DSN non publiée à ce niveau) |
| autorité constitutionnelle, pouvoir public ou juridiction suprême | 7 | 6 | 0 | source budgétaire non lue |
| autorité administrative ou publique indépendante | 4 | 5 | 0 | tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune source ouverte d'effectifs par établissement (DSN non publiée à ce niveau) |
| service à compétence nationale ou service interministériel | 3 | 3 | 0 | source budgétaire non lue ; tranche d'effectifs non diffusée par SIRENE (non employeur ou diffusion partielle) ; aucune source ouverte d'effectifs par établissement (DSN non publiée à ce niveau) |
| opérateur de l'État | 2 | 1 | 0 | source budgétaire non lue |
| établissement public (institution) | 1 | 0 | 0 | source budgétaire non lue |

### Les plus gros organismes encore sans budget (par plancher d'effectifs SIRENE)

| Organisme | Type | Effectifs (plancher) | SIREN |
|---|---|---|---|
| Caisse Nationale de l'Assurance Maladie (CNAM) | établissement public national (hors recenseme | 10000 | 180035024 |
| Regie Autonome des Transports Parisiens (RATP) | établissement public national (hors recenseme | 10000 | 775663438 |
| Banque de France | établissement public (institution) | 5000 |  |
| Caisse des Depots et Consignations (CDC) | établissement public national (hors recenseme | 5000 | 180020026 |
| GIP Viapro | GIP (groupement d'intérêt public) | 2000 | 185921616 |
| Univ Paris Xiii Paris-nord Villetaneuse | établissement public national (hors recenseme | 2000 | 199312380 |
| Agence Centrale des Organismes de Securite Sociale (ACOSS) | établissement public national (hors recenseme | 2000 | 180035016 |
| Caisse Nationale d'Assurance Vieillesse (CNAV) | établissement public national (hors recenseme | 2000 | 180035032 |
| Etablissement Public National Antoine Koenigswarter (EPNAK) | établissement public national (hors recenseme | 2000 | 180036063 |
| Regie des Transports Metropolitains (RTM) | établissement public national (hors recenseme | 2000 | 059804062 |
| Agence Francaise de Developpement (AFD) | établissement public national (hors recenseme | 2000 | 775665599 |
| Paris Habitat-oph | EPIC local (établissement public local à cara | 2000 | 344810825 |
| Tisseo Voyageurs | EPIC local (établissement public local à cara | 2000 | 520807876 |
| Gouvernement (Premier ministre) : personne morale 7111 | autorité constitutionnelle, pouvoir public ou | 1000 | 110001013 |
| GIP Institut de Formation Professionnelle en Region Academique (GIP) | GIP (groupement d'intérêt public) | 1000 | 187609094 |
| GIP Samu-social de Paris | GIP (groupement d'intérêt public) | 1000 | 187509013 |
| Chambre de Commerce et D Industrie de Region Paris Ile de France (CCIR) | chambre consulaire | 1000 | 130017270 |
| Chambre de Commerce et D Industrie de Region Pays de la Loire (CCIR) | chambre consulaire | 1000 | 184401289 |
| Chambre de Commerce et D Industrie de Region Provence-alpes-cote D Azur (CCIR) | chambre consulaire | 1000 | 181300013 |
| Chambre de Commerce et d'Industrie de Region Auvergne-rhone-alpes (CCIR) | chambre consulaire | 1000 | 130022692 |
| Chambre de Commerce et d'Industrie de Region Bretagne (CCIR) | chambre consulaire | 1000 | 183500040 |
| Chambre de Commerce et d'Industrie de Region Hauts-de-france (CCIR) | chambre consulaire | 1000 | 130022718 |
| Chambre de Commerce et d'Industrie de Region Normandie (CCIR) | chambre consulaire | 1000 | 130021645 |
| Chambre de Commerce et d'Industrie de Region Nouvelle-aquitaine (CCIR) | chambre consulaire | 1000 | 130022494 |
| Chambre de Metiers et de l'Artisanat de Region Hauts-de-france (CMAR) | chambre consulaire | 1000 | 130023740 |
| Chambre de Metiers et de l'Artisanat de Region Ile-de-france (CMAR) | chambre consulaire | 1000 | 130027972 |
| Chambre de Metiers et de l'Artisanat de Region Nouvelle Aquitaine (CMAR) | chambre consulaire | 1000 | 130027923 |
| Chambre de Metiers et de l'Artisanat de Region Occitanie (CMAR) | chambre consulaire | 1000 | 130027931 |
| Chambre de Metiers et de l'Artisanat de Region Provence-alpes-cote d'Azur (CMAR) | chambre consulaire | 1000 | 130020878 |
| Centralesupelec | établissement public national (hors recenseme | 1000 | 130020761 |
| Institut National d'Enseignement Superieur pour l'Agriculture l'Alimentation et  | établissement public national (hors recenseme | 1000 | 130026222 |
| Institut National des Sciences et Industries du Vivant et de l'Environnement (AG | établissement public national (hors recenseme | 1000 | 130002850 |
| Centre Regional Oeuvres Univ Scolaires (CROUS) | établissement public national (hors recenseme | 1000 | 185911500 |
| Caisse Nationale des Allocations Familiales (CNAF) | établissement public national (hors recenseme | 1000 | 180035065 |
| Etablissement National des Produits de L Agriculture et de la Mer Franceagrimer  | établissement public national (hors recenseme | 1000 | 130006364 |
| Ctre Scientifique Technique du Batiment (CSTB) | établissement public national (hors recenseme | 1000 | 775688229 |
| Etablissement Public de la Reunion des Musees Nationaux et du Grand Palais des C | établissement public national (hors recenseme | 1000 | 692041585 |
| Grand Port Fluvio-maritime de l'Axe Seine | établissement public national (hors recenseme | 1000 | 899614804 |
| Grand Port Maritime de Marseille (GPMM) | établissement public national (hors recenseme | 1000 | 775558489 |
| Union des Groupements d'Achats Publics (UGAP) | établissement public national (hors recenseme | 1000 | 776056467 |

### Lignes sans budget ni effectifs ni mission par famille (échantillon de noms)

- **GIP (groupement d'intérêt public)** : 318 lignes sans budget ni effectifs (par exemple Groupement d'Interet Public la Konciergerie (GIP) ; GIP Action Prevention de Rue Jeunes Adultes ; GIP Actions Devel Initiat Faveur de l'Emploi (ADIF ; GIP Agence de Developpement Economique Perpignan M ; GIP Agence Fonciere de Saint-martin (AFSM) ; GIP Agence Nationale de l'Evaluation et de la Qual).
- **EPIC local (établissement public local à caractère industriel ou commercial)** : 175 lignes sans budget ni effectifs (par exemple Agce Reg Develop Tourisme Loisirs Guyane (ARDTLG) ; Agence de Gestion des Equipements Sportifs d'Inter ; Agence de la Region Centre pour le Developpement C ; Alter'alpa Tourisme ; Amenagement Etang de Berre (EPAREB) ; Base de Nautisme et de Plein Air Chorges Serre-pon).
- **régie locale à caractère industriel ou commercial** : 173 lignes sans budget ni effectifs (par exemple Abattoirs Municipaux ; Abattoirs Ville de Nevers ; Aeroport de Grand Case ; Agence Developpement Insertion Economiques Taverny ; Agorapole ; Auberge Communale).
- **établissement public national (hors recensement des opérateurs)** : 129 lignes sans budget ni effectifs (par exemple Casa de Velazquez de Madrid ; Ctre Etudes Superieures Techn Industrie (CESTI) ; Ctre Formation Educateurs Spec ; Ctre Reg Educat Physique Sportive Creps ; Ec Normale Nat Apprent Ennag Paris-nord ; Ecole Elementaire Publique Gatelliet).
- **établissement public non opérateur** : 69 lignes sans budget ni effectifs (par exemple FSI PME Portefeuille ; Caisse de la dette publique ; Centre informatique national de l'enseignement sup ; Centre national de gestion des praticiens hospital ; Collège de France ; centre d'imagerie cérébrale et de recherches en ne).
- **chambre consulaire** : 44 lignes sans budget ni effectifs (par exemple CCI de l'Ardeche Meridionale ; Chamb Commerce et Industrie Hautes Alpes ; Chambre Agriculture Commerce Industrie Metiers Art ; Chambre Commerc Industrie Nord-ardeche ; Chambre Commerce et D Industrie du Gers (CCI) ; Chambre Commerce et d'Industrie du Cher (CCI)).
- **entreprise publique** : 17 lignes sans budget ni effectifs (par exemple Bpifrance international capital ; Bpifrance Participations ; Société de prise de participations de l'Etat ; Bpifrance Assurance Export ; EPIC BPIFRANCE ; Bpifrance Investissement).
- **autorité constitutionnelle, pouvoir public ou juridiction suprême** : 5 lignes sans budget ni effectifs (par exemple Haut Conseil des finances publiques ; Assemblée de la Polynésie française ; Gouvernement de la Polynésie française ; Conseil économique, social, environnemental et cul ; Congrès de la Nouvelle-Calédonie).
- **service à compétence nationale ou service interministériel** : 3 lignes sans budget ni effectifs (par exemple ANSSI - Agence nationale de la sécurité des systèm ; VIGINUM - Service de vigilance et de protection co ; OSIIC - Opérateur des systèmes d'information inter).
- **autorité administrative ou publique indépendante** : 3 lignes sans budget ni effectifs (par exemple ARDP - Autorité de régulation de la distribution d ; Autorité de la concurrence de la Nouvelle-Calédoni ; Autorité polynésienne de la concurrence).
