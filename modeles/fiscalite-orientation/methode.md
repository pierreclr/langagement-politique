# Fiscalité d'orientation : méthode

Tâche T8 · consultation des sources : 2026-10-25 · code : [`modele.js`](modele.js) · test : [`test_modele.js`](test_modele.js) · résultats : [`resultats.md`](resultats.md)

Légende : **fait sourcé** (lien) · **estimation** (calcul explicité) · **hypothèse** (de l'auteur ou de Claude) · ⚠️ non confirmé (registre `verifications.md`, lignes V300 à V313).

## 1. Question posée

L'auteur veut une fiscalité « pollueur-payeur », sans interdiction :
- 0 % de taxe sur les produits de première nécessité ;
- de fortes taxes sur ce qui est très carboné (viande, SUV, carburants, avion, croisières) ou vient de loin.

Trois questions en découlent :
1. Combien cela rapporte-t-il **en plus** par rapport à aujourd'hui, une fois les comportements pris en compte ? La réponse alimente le curseur « Fiscalité d'orientation en plus » de [`simulations/simulateur.html`](../../simulations/simulateur.html) : entier de 0 à 100 Md€, par pas de 5.
2. De combien baissent les émissions de gaz à effet de serre, après effets rebond ?
3. Qui paie, en % du revenu, par décile de niveau de vie, et comment un versement universel compense-t-il ?

Deux scénarios juridiques sont traités :
- **(1) conforme** au droit de l'Union européenne ;
- **(2) « règles européennes dépassées »**, explicitement hors du droit actuel.

## 2. Périmètre

- **Inclus** : la consommation des ménages (1 527 Md€ en 2024, [Insee](https://www.insee.fr/fr/statistiques/fichier/8988813/T_CONSO_EFF_FONCTION_fr.xlsx)) sur huit postes, plus les importations de biens de consommation dans le scénario (2).
- **Exclus** :
  - les achats des entreprises et des administrations (gazole des camions, kérosène du fret, viande servie en restauration) ;
  - les croisières, faute de base et d'élasticité (renvoyées à T10, ⚠️ V308) ;
  - le calcul informatique (« usages futiles ») : aucune donnée ;
  - les effets macroéconomiques (emploi dans l'élevage, le transport aérien, le tourisme) et les rétorsions commerciales.
- **Année de référence** : 2024 (comptes nationaux et comptes carbone Insee-SDES). Les comportements sont de **court ou moyen terme** : sur le long terme (équipement, logement, véhicules), les réactions sont plus fortes.

## 3. Données

| Fichier | Contenu | Source |
|---|---|---|
| [`consommation_menages_2024.csv`](donnees/consommation_menages_2024.csv) | Consommation des ménages par fonction (COICOP), 2024 et 2025 | Insee, comptes nationaux base 2020 |
| [`consommation_par_decile_bdf2017.csv`](donnees/consommation_par_decile_bdf2017.csv) | Dépense par ménage et par poste, par décile de niveau de vie | Insee, Budget de famille 2017 (TF106) |
| [`revenu_par_decile_dina2023.csv`](donnees/revenu_par_decile_dina2023.csv) | Revenu disponible net par décile | Insee, comptes nationaux distribués 2023 (Insee Analyses n°119) |
| [`empreinte_carbone.csv`](donnees/empreinte_carbone.csv) | Empreinte, émissions directes, contenu par produit et selon l'origine, facteurs Ademe | Insee-SDES (comptes carbone, émissions Citepa-SDES) ; Ademe Impact CO2 |
| [`elasticites_prix.csv`](donnees/elasticites_prix.csv) | Élasticités-prix par poste | Douenne (2020), Andreyeva et al. (2010), InterVISTAS (2007), Caillavet et al. (2016, 2019), méta-analyses citées |
| [`recettes_actuelles.csv`](donnees/recettes_actuelles.csv) | TVA (totale et estimée par taux), accises, billets d'avion, quotas, malus | Insee ; Voies et moyens PLF 2026 ; inventaire T1 |
| [`cadre_juridique.csv`](donnees/cadre_juridique.csv) | Ce que permet et interdit le droit de l'UE | Directives 2022/542, 2020/262, 2003/96 ; règlement 2023/956 |

**Méthode de collecte.**
- Les tableaux Insee ont été téléchargés depuis les pages des comptes nationaux 2025 (8988813 et 8988801) et de l'enquête Budget de famille (4648335), puis lus par un petit lecteur xlsx sans dépendance.
- Les textes européens ont été lus dans le dépôt Cellar de l'Office des publications.
- Les élasticités viennent de textes intégraux librement accessibles (HAL, PMC, IATA). Les articles payants cités de mémoire sont marqués ⚠️.
- Le budget de recherche web était épuisé : aucune recherche par moteur n'a été faite ; seules des adresses connues de sources primaires ont été lues.

## 4. Formules

Pour chaque poste i on note :
- C_i : la dépense TTC de 2024 ;
- τ_i : la hausse de prix décidée, en part du prix TTC actuel ;
- ε_i : l'élasticité-prix (négative) ;
- t0_i : la part des taxes actuelles dans le prix ;
- I_i : l'intensité en kg CO2e par euro de dépense initiale.

### 4.1 Accise (viande, carburants, chauffage fossile, billets d'avion, voitures lourdes)

- Volume : q = (1 + τ)^ε.
- Recette nouvelle : τ · C · q.
- Recettes anciennes perdues (TVA et accises sur les volumes qui disparaissent) : t0 · C · (1 − q).
- Variation de la dépense sur le poste : ΔE = C · [(1 + τ) · q − 1]. Le même montant est dépensé en moins (ou en plus) ailleurs.
- Effet budget : −t_reste · ΔE, où t_reste est la part des taxes dans le prix du reste de la consommation.
- **Recette nette** = recette nouvelle − recettes perdues + effet budget.
- Émissions évitées : I · C · (q − 1). Pour l'aérien, elles sont multipliées par (1 − fuite), car une part des vols évités part d'aéroports voisins.

### 4.2 TVA à 0 % (alimentation hors viande et poisson, eau, médicaments)

- TVA perdue : C · r / (1 + r), où r est le taux actuel.
- Baisse de prix : −p · r / (1 + r), où p est la part répercutée aux consommateurs.
- Le volume augmente avec l'élasticité : q = (1 + Δprix)^ε. Cette hausse de volume entraîne une hausse d'émissions, c'est le premier **effet rebond**.
- Les ménages ne gagnent que p × TVA perdue ; le reste (1 − p) va aux marges des entreprises.

### 4.3 Taxe carbone sur les importations (scénario 2 seulement)

- Hausse de prix : τ = P × I_importé / 1000, où P est le prix du carbone en €/t.
- Une part des achats importés (1 − q, avec q = (1 + τ)^(−σ)) est remplacée par des produits français au même prix.
- Effet sur les émissions : volume substitué × (I_français − I_importé).

### 4.4 Effets rebond

1. **Rebond de prix** (TVA à 0 %) : on achète plus de ce qui devient moins cher.
2. **Rebond de budget** : ce qu'on ne dépense plus en viande ou en avion est dépensé ailleurs, au contenu moyen de 0,2 kg/€. Inversement, quand la demande est peu élastique, on dépense plus pour le poste taxé et moins ailleurs.
3. **Rebond de recyclage** : les recettes nettes rendues aux ménages (socle ou baisse d'un autre impôt) sont dépensées. On compte 90 % × 0,263 kg/€, le contenu moyen de la consommation des ménages, émissions directes comprises.

### 4.5 Effets par décile

- La charge nette de chaque poste est répartie entre déciles selon la part du décile dans la dépense de ce poste (Budget de famille 2017).
- Elle est rapportée au revenu disponible net (RDN) du décile (comptes distribués 2023) et au nombre de ménages par décile (30,9 millions / 10).
- **Compensation** : on simule le versement des recettes nettes à parts égales entre déciles (« chèque vert » ou majoration du socle).

### 4.6 Sortie pour le simulateur

Valeur du curseur = recettes nettes arrondies à 5 Md€ et bornées entre 0 et 100 (fonction `valeurCurseur`).

## 5. Hypothèses numérotées

| # | Hypothèse | Source ou statut |
|---|---|---|
| H1 | Bases 2024 (Md€ TTC) : viande 33,3 (CP0112) ; alimentation hors viande et poisson 131,3 (CP011 − CP0112 − CP0113) ; eau 7,8 (CP0441 + CP0125) ; médicaments 21,6 (CP061) ; carburants 52,0 (CP0722) ; gaz et fioul 19,8 (CP0452 + CP0453) ; transport aérien 15,7 (CP0733) ; voitures 35,9 (CP0711). | [Insee, consommation par fonction](https://www.insee.fr/fr/statistiques/fichier/8988813/T_CONSO_EFF_FONCTION_fr.xlsx) |
| H2 | Voitures « lourdes » (SUV) : 40 % des achats de voitures des ménages. | Hypothèse de Claude ⚠️ V309. Sensibilité à 60 % |
| H3 | Intensité de la viande consommée à domicile : 1,0 kg CO2e/€ (0,6 à 1,4). | Hypothèse de Claude ⚠️ V300, à partir des facteurs Ademe par kg (bœuf 28, porc 6,7, poulet 4,6) et de prix de détail supposés |
| H4 | Carburants : 1,68 kg/€, soit (64,9 Mt de combustion + part de l'amont du raffinage) / 52,0 Md€. Chauffage gaz et fioul : 2,2 kg/€. Électricité : 0,2 kg/€ (non taxée). | Calculs de Claude sur les comptes carbone Insee-SDES ⚠️ V301 (partage de l'amont « électricité-gaz » D35) |
| H5 | Aérien : 1,0 kg/€ (Insee H51, CO2e sans effets hors CO2) ; 1,8 kg/€ en variante avec les traînées. | [Insee GES.413](https://www.insee.fr/fr/statistiques/fichier/8988801/T_ges_413_empreinte_par_secteur_institutionnel.xlsx) ; facteur ≈ 1,8 tiré de l'[API Ademe Impact CO2](https://impactco2.fr/api/v1/transport?km=1000&displayAll=1&ignoreRadiativeForcing=0) |
| H6 | Voitures neuves : 0,23 kg/€, émissions de fabrication seulement. Les émissions évitées à l'usage (véhicules plus légers) ne sont pas comptées. Le résultat est donc sous-estimé pour ce poste. | Insee C29 |
| H7 | Alimentation hors viande : 0,4 kg/€ ; eau : 0,1 ; médicaments : 0,3. Ces intensités ne servent qu'au rebond du 0 %. | Hypothèse de Claude ⚠️ V300 |
| H8 | Part actuelle des taxes dans le prix TTC (t0) : viande 5,2 % (TVA 5,5 %) ; carburants 50 % ; chauffage fossile 25 % ; aérien 5 % ; voitures 20 %. | Hypothèses de Claude ⚠️ V302 (taux d'accise non relus) |
| H9 | La baisse de TVA est entièrement répercutée dans les prix ; test à 50 %. | Hypothèse ⚠️ V304 ; la littérature trouve des baisses moins répercutées que les hausses |
| H10 | Élasticités, en valeur absolue (bas / central / haut) : viande 0,4 / 0,7 / 1,0 ; carburants 0,2 / 0,45 / 0,7 ; chauffage 0,1 / 0,2 / 0,5 ; aérien 0,5 / 0,8 / 1,2 ; voitures lourdes 0,5 / 1,0 / 1,5 ; alimentation 0,3 / 0,59 / 0,8 ; eau et médicaments 0,05 / 0,1 / 0,3. | Viande et alimentation : [Andreyeva et al. 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC2804646/) (États-Unis ; la France donne environ −1,2 en élasticité compensée, V313 : sensibilité dans resultats.md § 4). Énergie : [Douenne 2020](https://theses.hal.science/tel-03131425/file/Douenne.pdf) (France). Aérien : [InterVISTAS 2007](https://www.iata.org/en/iata-repository/publications/economic-reports/estimating-air-travel-demand-elasticities---by-intervistas/) (niveau national −0,8, étendue −0,48 à −1,23). Voitures, eau, médicaments : hypothèses ⚠️ V304 |
| H11 | La répartition entre déciles de 2017 vaut pour 2024. Clé de l'aérien : voyages à forfait (BDF 096), faute de ligne « avion » dans l'enquête. Clé des biens importés : habillement, équipement du logement, voitures et biens de loisirs. | Hypothèses de Claude ⚠️ V307, V312 |
| H12 | 10 % des vols évités partent d'aéroports étrangers (Genève, Bâle-Mulhouse, Bruxelles, Barcelone) : 0 % / 10 % / 20 % selon le scénario. Ces vols ne réduisent pas les émissions. | Hypothèse de Claude ⚠️ V307 |
| H13 | Scénario (2) : ménages, 196,5 Md€ de biens manufacturés importés (52,7 Mt, 0,268 kg/€ contre 0,177 pour les mêmes produits français) et 58,1 Md€ d'alimentation importée (0,386 contre 0,402 kg/€). | Calcul de Claude ⚠️ V306 sur [Insee GES.412](https://www.insee.fr/fr/statistiques/fichier/8988801/T_ges_412_empreinte_par_produit_final.xlsx) et GES.413 (part importée des ménages = part importée de la demande finale totale) |
| H14 | Taxes dans le prix du reste de la consommation : 9 %. | Hypothèse ⚠️ V302 : TVA des ménages estimée à 127 Md€ / 1 527 Md€ = 8,3 %, plus des accises |
| H15 | Contenu carbone de la dépense reportée ailleurs : 0,2 kg/€. | Moyenne Insee hors émissions directes (0,197) |
| H16 | 90 % des recettes nettes sont rendues aux ménages et dépensées, à 0,263 kg/€. | Hypothèse de Claude (contenu : Insee) |
| H17 | Substitution des importations vers la production française : σ = 0,75 / 1,5 / 3 ; prix français égal au prix importé hors taxe. | Hypothèse de Claude ⚠️ V304 |
| H18 | Ménages par décile : 30,9 millions / 10 ; RDN des dixièmes de personnes (DINA) associé aux déciles de ménages (BDF). | Insee RP 2022 ; IA n°119 ; approximation ⚠️ V312 |
| H19 | Niveaux de taxe du scénario central, identiques en (1) et (2) : viande +25 % (≈ 250 €/t) ; carburants +15 % (≈ 90 €/t en plus de l'existant) ; gaz et fioul +15 % ; billets d'avion +60 % ; voitures lourdes +25 %. Multiplicateur « niveau » de 0,5 à 1,5 en sensibilité : au niveau 1,5, l'aérien prend +90 %, soit le doublement évoqué par l'auteur. | Hypothèse de Claude, calibrée sur la demande de l'auteur (des taxes fortes) |
| H20 | Scénario (2) : prix de 200 €/t sur le contenu carbone de toutes les importations de biens de consommation, y compris intra-UE. | Hypothèse de Claude |

## 6. Le droit : ce que chaque scénario suppose

### Scénario (1), conforme

- **0 % de TVA sur l'alimentation, l'eau et les médicaments : c'est permis depuis 2022.** La [directive (UE) 2022/542](http://publications.europa.eu/resource/celex/32022L0542), à l'article 98 § 2, autorise un taux inférieur à 5 % et un taux zéro sur sept points au plus de l'annexe III, choisis parmi les besoins fondamentaux (denrées alimentaires, eau, médicaments, hygiène, transport de personnes, livres).
- **Viande.** La sortir du taux réduit pour la taxer au taux normal de 20 % est juridiquement plausible. Le principe de neutralité, qui veut qu'on taxe de la même façon des produits concurrents, peut toutefois être invoqué (⚠️ V310). Une TVA supérieure au taux normal est impossible. **Une accise nationale est en revanche possible** ([directive 2020/262](http://publications.europa.eu/resource/celex/32020L0262), art. 1 § 3), à condition de n'imposer aucune formalité au passage des frontières entre États membres. Le modèle utilise donc une accise.
- **Avion.**
  - Le kérosène des vols commerciaux est exonéré ([directive 2003/96](http://publications.europa.eu/resource/celex/32003L0096), art. 14 § 1 b).
  - L'État peut le taxer sur les vols intérieurs, et sur les vols intra-UE par accord bilatéral (art. 14 § 2).
  - Une **taxe par billet**, comme la taxe de solidarité, est libre : doubler le prix d'un billet par une taxe nationale reste possible.
- **Carburants, gaz, fioul.**
  - La hausse des accises nationales est libre au-dessus des minima européens.
  - Les taux réduits de TVA sur les combustibles fossiles et le bois doivent disparaître au plus tard en 2030 (directive 2022/542). Le droit européen va ici dans le sens de l'auteur.
- **« Lointain ».** Le [mécanisme d'ajustement carbone aux frontières](http://publications.europa.eu/resource/celex/32023R0956) ne couvre que le ciment, l'acier, l'aluminium, les engrais, l'hydrogène et l'électricité, en phase définitive depuis 2026. Aucun bien de consommation n'est couvert. Le scénario (1) ne taxe donc pas l'origine.

### Scénario (2), « règles européennes dépassées »

- **Taxer selon l'origine est interdit :**
  - dans l'UE, par les articles 30 et 110 du TFUE, et parce que la politique commerciale relève de la compétence exclusive de l'Union ;
  - à l'OMC, par le traitement national (GATT art. III) et la clause de la nation la plus favorisée (art. I). L'exception environnementale (art. XX) exige l'absence de discrimination arbitraire. Une taxe fondée sur le **contenu carbone réel**, appliquée aussi aux produits français, serait la seule piste défendable. (⚠️ V310 : textes non relus.)
- **Taxer les importations intra-UE suppose de sortir du marché unique**, ou de le violer et de s'exposer à des recours en manquement, à des astreintes et à des représailles.
- **Rétorsions.** La France exporte des avions, du vin, des spiritueux, du luxe et des produits agricoles : ce sont des cibles habituelles des représailles commerciales. Ces pertes ne sont **pas modélisées**.
- **Ce qui ne change pas.** Le scénario (2) n'ajoute rien sur la TVA par produit : économiquement, une TVA à 33 % sur la viande équivaut à une accise. La seule vraie différence entre (1) et (2), c'est la **discrimination selon l'origine**.

## 7. Scénarios

- **Politiques** : (1) conforme ; (2) hors règles = (1) + une taxe carbone de 200 €/t sur les importations de biens de consommation.
- **Comportements** :
  - bas : réactions faibles, plus de recettes et moins d'émissions évitées ;
  - central ;
  - haut : réactions fortes, ce qui ressemble davantage au long terme.
- **Sensibilités** :
  - niveau des taxes × 0,5 et × 1,5 ;
  - intensités basses et hautes, dont les traînées de l'aviation ;
  - répercussion de la TVA à 50 % ;
  - part de voitures lourdes à 60 %.

## 8. Limites

- **Élasticités transposées.** Celles de la viande sont américaines. Celles des carburants et de l'énergie, françaises mais de court terme. Celles de l'aérien datent d'une étude de 2007 commandée par l'IATA. Aucune estimation n'existe pour les croisières.
- **Élasticités constantes.** Les grandes hausses (+60 % sur l'avion) sortent du domaine où ces élasticités ont été estimées.
- **Enquête de 2017.** La répartition par décile repose sur Budget de famille 2017. Les élasticités sont supposées identiques dans tous les déciles, alors que Douenne (2020) trouve des réactions plus fortes chez les ménages modestes et ruraux. Les effets « horizontaux » (rural ou urbain, chauffage au fioul ou non) sont **plus importants que les effets entre déciles** ([Douenne 2020](https://theses.hal.science/tel-03131425/file/Douenne.pdf)) et ne sont pas modélisés.
- **Bases trop étroites.** La viande et le gazole achetés par les restaurants, les cantines et les entreprises ne sont pas dans la base, alors qu'une accise prélevée en amont les toucherait. Les recettes sont donc sous-estimées.
- **Bases qui se recouvrent.** Les voitures sont aussi dans les biens importés : il y a un double compte mineur dans le scénario (2).
- **Effets macroéconomiques absents.** Le modèle ignore l'emploi dans l'élevage et l'aérien, les fuites transfrontalières de carburant, la contrebande et les rétorsions commerciales.
- **Une assiette qui fond.** Le modèle est statique : si l'orientation réussit, la base fond, et les recettes baissent avec le temps.
- **Ce qui manque** :
  - une élasticité française de la viande non compensée et publiée : le working paper de Caillavet, Fadhuile et Nichèle (AAEA 2014, scanner Kantar 1998-2010) donne des élasticités propres compensées d'environ −1,2 pour le bœuf, la viande cuite et le poisson, donc plus fortes que les −0,7 du central (Andreyeva et al., États-Unis). Le central n'est pas modifié ; une sensibilité à −1,2 est calculée (resultats.md § 4, test_modele.js, V313) ; l'article de 2016 est payant et reste non lu ;
  - les tarifs d'accise 2026 : relus le 03/11/2026 dans le CIBS (art. L. 312-35 à L. 312-37), voir `sources/chapitre10-etat-des-preuves.md` ; seule la part des taxes dans les prix (H14) reste une hypothèse ;
  - le rendement de la taxe sur les billets d'avion après son relèvement de 2025 : la DGAC l'estime à environ 1,3 Md€ en année pleine (étude de novembre 2025) ; le montant constaté en 2025 n'est pas publié dans les sources lues (V6872) ;
  - les données de croisières (CLIA, DGITM) ;
  - la part des SUV dans les ventes ;
  - les recettes de TVA par taux publiées par la DGFiP ;
  - le Citepa, mobilisé seulement via les comptes Insee-SDES.
