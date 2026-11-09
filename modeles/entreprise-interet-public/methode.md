---
titre: Entreprise d'intérêt public et « pari » — méthode (premier chiffrage)
date: 2026-11-09
statut: brouillon ; écrit par Claude (IA d'Anthropic) pour l'auteur ; des ordres de grandeur sous hypothèses, jamais des prédictions
---

# Entreprise d'intérêt public : méthode

**Demande** : chiffrer la holding publique à capital commun décidée par l'auteur le 09/11/2026 (`chapitres-v02/16-ideologie-et-direction.md` ; pages `outils/publication/direction/entreprise.html` et `argent.html`) : quatre pôles, de petites équipes financées par tranches conditionnées aux résultats, une enveloppe annuelle fixe et plafonnée tirée des économies de structure (option b : elle ralentit d'autant la stabilisation de la dette), des bénéfices partagés entre réinvestissement, désendettement et reversement par le socle, des parts viagères ouvertes aux épargnants.

Légende : **fait** (source, cote A-D) · **estimation** (méthode donnée) · **hypothèse** (de Claude, H-EIP) · ⚠️ non vérifié. Rien n'est modifié dans les autres modèles : ce dossier lit le cache du banc (`modeles/banc-programmes/donnees/cache/systeme.json`) et appelle `modeles/taux-endogene/taux.py`.

## 1. Le modèle

Pour chaque pôle et chaque scénario, de 2029 (année 1 du système dans le banc) à 2058 :

1. **Tranches** : n projets parallèles ; tranche 1 (coût c1 par projet et par an jusqu'à t1) ; tranche 2 (démonstrateur, c2 jusqu'à t2) seulement pour les projets qui passent le premier jalon (probabilité p1) ; la **série** est lancée si au moins un projet passe le second jalon (p2) : P(série) = 1 − (1 − p1·p2)ⁿ. Ensuite, une équipe permanente.
2. **Série** : « rythme » unités lancées par an pendant « durée » années ; coût de la première unité capex0, baisse de « appr » à chaque doublement (loi de Wright) ; coût réparti sur le délai de construction ; mise en service ensuite.
3. **Exploitation** : chiffre d'affaires par unité en service, marge d'EBE, investissement de maintien (renouvellement) en part du capital en service.
4. **Espérances** : capex, revenus et emplois de série sont multipliés par P(série). Ce sont des moyennes : dans la réalité, un pôle réussit ou échoue, il ne réussit pas « à 58 % ».
5. **Holding** : frais de tête ; épargne en parts viagères (souscriptions plafonnées au besoin de financement, rendement servi, extinction au décès) ; si le flux est positif, 30 % reversés par le socle, 30 % au désendettement, le reste réinvesti.
6. **Finances publiques** : holding **consolidée** dans les administrations publiques (cas de référence, H-EIP24) : le solde primaire bouge du flux de la holding moins le reversement aux ménages ; l'épargne en parts réduit la dette sans être un déficit (choc de dette). **Enveloppe fixe** = le plus haut besoin annuel des tranches (R&D, équipes, frais) de 2029 à 2038 ; le capex de série non couvert est un **emprunt conditionné** aux résultats.
7. **Dette** : base = notre système (trajectoire de référence du banc) + l'effort supplémentaire qui le stabilise de 2038 à 2058 (`taux.effort_supplementaire`, ≈ 42 Md€/an au central) ; on ajoute le pari et on lit l'écart de dette, d'OAT, et l'effort stabilisant avec pari. Trois jeux de taux : banc (3,45 % fixe), endogène central, sensibilités hautes.

## 2. Hypothèses numérotées (prudent / central / ambitieux)

| N° | Hypothèse | Valeurs | Source, cote, statut |
|---|---|---|---|
| H-EIP1 | Unités : Md€ de 2025 ; début 2029 ; 30 ans | — | Conventions du banc (`moteur.effet_systeme_md`, 2029-2058) |
| H-EIP2 | Projets indépendants ; un seul succès suffit à lancer la série | — | Simplification ; des échecs corrélés (même cause : talents, demande) rendraient P(série) plus faible |
| H-EIP3 | Coût d'un emploi de R&D | 150 k€ chargés/an | Hypothèse ⚠️ (petites équipes « bien payées ») |
| H-EIP4 | Emplois de chantier | 1 emploi-année par 200 k€ de capex dépensé en France ; part française 35 % (calcul), 80 % (atome), 60 % (robots), 70 % (objets) | Hypothèse ⚠️ ; calcul : les serveurs (56 % du coût) sont importés (Epoch AI, H3 de `rattrapage-robotique-ia`) |
| H-EIP5 | **Calcul** : unité de 100 MW à 3,35 Md€ | 33,5 M€/MW | Fait : Epoch AI, 37,9 Md$/GW tout compris (05/2026, C : modèle stylisé américain) ; 1 € = 1,13 $ (H1 du dépôt) |
| H-EIP6 | Calcul : renouvellement | 18 / 16 / 14 %/an | Serveurs et réseau (69 % du coût) à 5 ans, bâtiment à 14 ans (Epoch AI, C) ; estimation |
| H-EIP7 | Calcul : CA par unité et marge d'EBE | 0,67 / 0,86 / 1,07 Md€ ; 60 / 70 / 75 % → EBE = 12 / 18 / 24 % du capital | Estimation : ≈ 700 GPU par MW, 71 % d'utilisation (Epoch), location de l'ordre de 2 $/GPU-heure ⚠️ (prix de marché, C, en baisse rapide). Seuil de rentabilité de 19 % du capital (`capital-commun-retraite`, point 8) |
| H-EIP8 | Calcul : capacité | 200 / 300 / 1 000 MW lancés (3 projets : modèles ouverts, outils spécialisés, cloud public) ; p1·p2 = 0,30 / 0,42 / 0,56 | Hypothèse ; risque surtout commercial (Cloudwatt-Numergy : 2 et 6 M€ de CA en 2014 pour 75 M€ publics chacun, B/C) ; 0,25 emploi/MW (Randstad via Banque des Territoires, C ⚠️) |
| H-EIP9 | **Atome** : petit réacteur de 300 MWe, coût de la tête de série | 17 / 13 / 10 k€/kW (5,1 / 3,9 / 3,0 Md€) | Faits : OPG Darlington (BWRX-300), 20,9 Md C$ de 2024 pour 4 × 300 MW, 1re unité 6,1 Md C$ + 1,6 Md C$ de communs, 4e unité 4,1 Md C$ (World Nuclear News, NucNet, 2025, C, intérêts et aléas compris) ; NuScale-UAMPS : 9,3 Md$ pour 462 MW, projet abandonné en 11/2023 (IEEFA via E&E News, C) ; 1 C$ ≈ 0,65 € ⚠️ |
| H-EIP10 | Atome : apprentissage | 5 / 10 / 15 % par doublement | OPG prévoit −33 % de la 1re à la 4e unité (≈ 18 %/doublement, prévision, C) ; non démontré en Occident (`sources/nucleaire-ou-alternatives.md`) |
| H-EIP11 | Atome : prix et marge | 70 / 85 / 100 €/MWh ; coûts d'exploitation et combustible ≈ 30 €/MWh ; facteur de charge 90 % | Ordre de grandeur CRE 65 €/MWh pour 2027 (`energie-europe.md`, B) ; Flamanville : 122 €/MWh nécessaires pour 4 % (Cour des comptes 2025, A) ; marge : hypothèse ⚠️ |
| H-EIP12 | Atome : calendrier et taille | conception 3 ans, démonstrateur jusqu'en 2036-2038, construction 4-5 ans ; 5 / 10 / 20 réacteurs lancés ; p1·p2 = 0,16 / 0,25 / 0,36 ; 2-3 projets (start-up françaises, rachats négociés) | Hypothèse ; Nuward abandonné et refondu en 2024 ⚠️ ; 120 emplois d'exploitation par réacteur (≈ 0,4/MW) ⚠️ |
| H-EIP13 | **Robotique** : unité = 1 000 robots en flotte, exploités par l'entreprise (pas vendus au départ, décision de l'auteur) | coût 80 / 50 / 30 k€ par robot + 20 % d'usine | Hypothèse ⚠️ ; usine : 10 k€ par unité de capacité (H13 de `rattrapage-robotique-ia`, sans source primaire) ; Unitree ≈ 7 700 $ par unité de capacité (presse, C) |
| H-EIP14 | Robotique : CA par robot-an | 11 / 18 / 27 k€ = 25 / 40 / 60 % d'un poste à 45 k€ chargés | Hypothèse ⚠️ (le robot remplace une fraction d'un bûcheron, couvreur, ouvrier agricole) ; marge 20 / 35 / 50 % |
| H-EIP15 | Robotique : durée de vie | 5 / 6 / 7 ans (renouvellement 20 / 17 / 14 %) ; apprentissage 10 / 15 / 20 % | Hypothèse ⚠️ |
| H-EIP16 | Robotique : 4 projets (humanoïde, agricole, forestier, toits et mines) ; 500 / 2 000 / 8 000 robots par an pendant 25 ans ; p1·p2 = 0,16 / 0,25 / 0,36 | — | Hypothèse ; Aldebaran liquidée (2025), Naïo reprise pour 170 000 € (`rattrapage-robotique-ia`, C) ; Agility : 1,8 M$ de CA pour une usine de 10 000 robots/an (C) ; 1 technicien pour 10 robots |
| H-EIP17 | **Objets** : ligne de 100 000 appareils/an | 500 / 400 / 300 € par unité de capacité | Repère : usine Samsung de Newberry (Caroline du Sud), ≈ 380 M$ pour ≈ 1 million de lave-linge/an (presse 2017, C ⚠️ non relu) |
| H-EIP18 | Objets : prix 650 € (+10 % de pièces), utilisation 50 / 70 / 90 % | marge d'EBE 0 / 6 / 12 % | Hypothèse ; marges d'EBIT de 5 à 8 % chez les grands du secteur ⚠️ (de mémoire) |
| H-EIP19 | Objets : 5 / 10 / 30 lignes (0,5 / 1 / 3 million d'appareils/an) | CA ≈ 3 / 9 / 34 % du marché | Marché du gros électroménager ≈ 5,6 Md€ en 2024 (Xerfi, C) ; l'ambitieux suppose l'export (plans publiés) |
| H-EIP20 | Objets : 3 projets (lavage, eau chaude et chaleur, froid) ; p1·p2 = 0,30 / 0,42 / 0,56 ; 180 / 250 / 300 emplois par ligne | — | Hypothèse ; ≈ 200 k€ de CA par emploi industriel ⚠️ ; emplois de réparation **non comptés** |
| H-EIP21 | Holding : frais de tête et pôle de documentation | 0,03 / 0,05 / 0,08 Md€/an ; 150 / 250 / 400 emplois | Hypothèse |
| H-EIP22 | **Épargne** en parts viagères | 0,2 / 0,5 / 1,5 Md€/an souscrits à partir de 2030 ; rendement servi 3 % ; extinction 4 %/an (décès de porteurs âgés) | Hypothèse ⚠️ ; ordres de grandeur : livret A ≈ 440 Md€ d'encours ⚠️ ; ouverture du capital d'EDF en 2005 auprès de quelques millions de particuliers ⚠️. Une part qui s'éteint au décès vaut moins qu'une part héritable : public visé = épargnants sans héritier ou âgés |
| H-EIP23 | Partage du bénéfice | 30 % socle, 30 % désendettement, 40 % réinvesti | Hypothèse (règle publique à fixer par l'auteur) ; le reversement par le socle est compté comme une dépense en plus, pas comme une économie sur le socle existant ⚠️ |
| H-EIP24 | **Consolidation** : la holding est dans les administrations publiques tant que ses ventes couvrent moins de la moitié de ses coûts (critère SEC 2010 des 50 %) | référence : consolidée ; variante : hors APU (l'État ne verse que l'enveloppe) | Règle Eurostat (SEC 2010, A, de mémoire ⚠️) ; précédents : SNCF Réseau reclassé en 2014 ⚠️. Les parts viagères sont traitées comme des fonds propres, pas comme de la dette ⚠️ (un rendement garanti pourrait les faire requalifier) |
| H-EIP25 | Pas d'effet sur l'activité (multiplicateur), pas de valeur terminale des actifs en 2058, pas d'effet d'éviction sur le privé | — | Simplifications : sous-estime le pari gagnant (actifs encore productifs) et ignore les emplois détruits ailleurs |
| H-EIP26 | **Précédents** : 10 programmes industriels d'État français (`donnees/precedents.csv`) | réussite nette 20 % ; avec les partielles à moitié, 35 % | Cotes A à D selon les lignes ; 5 lignes de mémoire (D ⚠️) ; biais de sélection (grands programmes connus) |

## 3. Ce que le modèle ne fait pas

- Pas de corrélation des échecs ni de distribution (seulement des espérances) ; pas de faillite brutale d'un pôle.
- Pas de droit européen (aides d'État, concurrence) : une holding qui vend sous le prix de marché grâce à l'argent public serait contestée.
- Pas de baisse des prix du calcul au-delà de la marge retenue ; pas de recettes de défense (pôle accrédité non chiffré) ni des pôles mesure, repas, foncières.
- Des ordres de grandeur sous hypothèses, **jamais des prédictions**.

## 4. Fichiers

| Fichier | Rôle |
|---|---|
| `modele.py` | Fonctions pures : `p_succes`, `cout_unite`, `tranches`, `cout_echecs`, `cout_echec_total`, `serie_pole`, `horizon`, `holding`, `enveloppe_necessaire`, `effet_md`, `effet_hors_apu`, `taux_reussite` |
| `calculer.py` | Scénarios, effet sur la dette (taux endogène), écrit `resultats.md` et `donnees/resultats.json` |
| `donnees/precedents.csv` | Précédents cotés |
| `tests/test_modele.py` | 10 tests |

```
python3 -I modeles/entreprise-interet-public/tests/test_modele.py
python3 -I modeles/entreprise-interet-public/calculer.py
```
