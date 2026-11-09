# L'État-plateforme : résultats

Tâche T7 · 2026-10-25 · méthode : [`methode.md`](methode.md) · chiffres reproduits par `jsc modele.js test_modele.js`

**Ce sont des ordres de grandeur conditionnels aux hypothèses H1 à H18, pas des prévisions.** Le coût actuel est lui-même une reconstitution (⚠️ V250). Les paramètres d'organisation sont des hypothèses de Claude, faute d'études.

## 1. L'essentiel

- **Coût actuel.** L'informatique publique coûte de l'ordre de **11 à 18 Md€ par an** (central : 14 Md€), toutes sphères confondues : État et opérateurs, sécurité sociale et France Travail, collectivités, hôpitaux. C'est **moins de 1 % de la dépense publique** (1 714 Md€ en 2025, Insee). Personne ne connaît ce chiffre précisément : la Cour des comptes dit ne pas pouvoir le consolider.
- **Économies.** Une entité commune construite en interne avec l'IA économiserait :
  - de l'ordre de **2 à 5 Md€ par an** en régime de croisière dans le scénario central, selon la productivité de l'IA, soit 14 à 36 % du budget ;
  - **jusqu'à 7 à 8 Md€** dans les hypothèses les plus favorables, vision de l'auteur comprise ;
  - **zéro, voire une perte**, si la mutualisation est faible et la transition mal conduite.
- **Transition.** De l'ordre de **25 à 30 Md€** sur une dizaine d'années dans le scénario central, soit **5 à 16 ans** pour la rembourser.
- **Le gain de l'IA n'est pas le premier levier.** Dans le scénario central, la mutualisation et l'internalisation rapportent ensemble environ 2,7 Md€/an, quelle que soit l'IA. L'IA ajoute de −0,2 à +2,7 Md€. Passer de ×5 à ×100 ne rapporte que 0,7 Md€ de plus : le gain est plafonné par la part du travail que l'IA accélère vraiment (loi d'Amdahl).

## 2. Par scénario (coût actuel central : 14,2 Md€/an)

Économie annuelle en régime de croisière, en Md€ (et en % du coût actuel) :

| Organisation \ productivité de l'IA | ×1,2 (mesuré) | ×2 | ×5 (extrapolé) | ×100 (témoignage) |
|---|---|---|---|---|
| **Bas** (prudent, p = 0,4) | −1,0 (−7 %) | 0,1 (1 %) | 1,2 (8 %) | 1,9 (13 %) |
| **Central** (p = 0,6) | **2,0 (14 %)** | **3,3 (23 %)** | **4,4 (31 %)** | **5,1 (36 %)** |
| **Haut** (favorable, p = 0,8) | 4,5 (32 %) | 5,6 (40 %) | 6,6 (47 %) | 7,3 (51 %) |
| Vision de l'auteur (×100, p = 0,95, organisation haute) | | | | 7,9 (56 %) |

Avec un coût actuel bas (10,9 Md€) ou haut (18,1 Md€), toutes ces valeurs se multiplient par environ 0,77 ou 1,27. Le scénario central couvre ainsi 1,6 à 6,6 Md€/an.

Productivité effective sur l'ensemble du travail (m_eff) :

| p (part accélérée) | ×1,2 | ×2 | ×5 | ×100 | plafond (m infini) |
|---|---|---|---|---|---|
| 0,4 | 1,07 | 1,25 | 1,47 | 1,66 | 1,67 |
| 0,6 | 1,11 | 1,43 | 1,92 | 2,46 | 2,5 |
| 0,8 | 1,15 | 1,67 | 2,78 | 4,81 | 5 |
| 0,95 | | | | 16,8 | 20 |

Pour lire ce tableau : un ×100 sur le code devient un ×2,5 sur l'organisation si 40 % du travail (besoin, droit, recette, conduite du changement, achats) n'est pas accéléré.

### D'où viennent les économies (central, ×2, Md€/an)

| Levier | Montant |
|---|---|
| Mutualisation (une seule application par fonction au lieu de dizaines) | +1,4 |
| Internalisation (fin des marges des ESN et des éditeurs) | +1,3 |
| Productivité de l'IA (déduction faite du calcul d'IA) | +1,0 |
| Consolidation de l'infrastructure | +0,3 |
| Sécurité renforcée (red teaming permanent, supervision) | −0,7 |
| **Total** | **+3,3** |

À ×1,2, le levier de l'IA est **négatif** (−0,2) : le coût du calcul (15 k€ par ingénieur et par an) dépasse le gain mesuré.

## 3. Effectifs

Effectifs actuels du travail applicatif, reconstitués par le modèle (central) :
- environ **36 000 agents** ;
- environ **15 000 ETP de prestataires** ;
- environ **12 000 ETP « contenus » dans les licences** ;
- soit environ **63 000 ETP**.

Ce chiffre ne compte pas les personnels d'infrastructure. Il est cohérent avec les 18 500 agents de la filière numérique civile de l'État en 2016, auxquels s'ajoutent environ 20 000 personnels aux Armées, plus les collectivités et la sécurité sociale. Il reste ⚠️.

Ingénieurs publics nécessaires dans la cible :

| Organisation | ×1,2 | ×2 | ×5 | ×100 |
|---|---|---|---|---|
| Bas | 57 000 | 49 000 | 42 000 | 37 000 |
| **Central** | **46 000** | **36 000** | **27 000** | **21 000** |
| Haut | 35 000 | 24 000 | 14 000 | 8 000 |
| Vision de l'auteur | | | | 2 400 |

- Il faudrait donc **recruter ou reconvertir de l'ordre de 20 000 à 45 000 ingénieurs publics** de haut niveau dans le scénario central. Les besoins sont en partie couverts par les agents actuels, mais au niveau de salaire visé (100 k€ chargés), pas à celui d'aujourd'hui.
- C'est **20 à 50 fois le rythme actuel** de recrutement numérique de l'État : 409 postes prévus d'ici 2027, environ 1 000 par an en 2022 (⚠️).
- **Le recrutement, plus que le budget, est la contrainte qui lie.**
- Environ 15 000 ETP de prestataires et une partie des salariés des éditeurs pour collectivités verraient leur activité disparaître. Principe « ne perdre personne » : l'entité est leur débouché naturel.

## 4. Transition (coût actuel central)

| Organisation | Durée | Coût de transition, ×2 | Dont double fonctionnement | Retour sur investissement |
|---|---|---|---|---|
| Bas (dépassement +100 %) | 15 ans | ≈ 84 Md€ | 19 | jamais à ×1,2 ; plus de 600 ans à ×2 ; 39 ans à ×100 |
| **Central (+27 %)** | **10 ans** | **≈ 28 Md€** (23 à 32 selon l'IA) | 12 | **16 ans à ×1,2 ; 9 ans à ×2 ; 6 ans à ×5 ; 4,5 ans à ×100** |
| Haut (sans dépassement) | 6 ans | ≈ 11 Md€ (8 à 13) | 6 | 1 à 3 ans |

- **Le double fonctionnement pèse davantage que la construction**, et l'IA ne le réduit pas : il faut faire tourner l'ancien système tant que le nouveau n'a pas fait ses preuves. C'est la leçon de Louvois, de l'ONP et de Phénix.
- **Le risque de « cygne noir »** (1 projet informatique sur 6 dépasse de 200 %, Flyvbjerg & Budzier) porte la transition centrale à environ 67 Md€ et le retour à **20 ans**.

### Sensibilités (central, ×2 ; économie / retour)

| Variante | Économie (Md€/an) | Retour |
|---|---|---|
| Référence | 3,3 | 8,6 ans |
| Sans IA (m = 1, pas de calcul d'IA) | 2,2 | 14 ans |
| Cygne noir (+200 %) | 3,3 | 20 ans |
| Sans mutualisation (r = 0) | 2,3 | 13 ans |
| Ingénieurs à 130 k€ | 2,1 | 14 ans |
| Calcul d'IA à 50 k€ par ingénieur | 1,9 | 16 ans |
| Peu de sous-traitance actuelle (e = 0,2) | 2,4 | 12 ans |
| Sous-traitance des grands projets de l'État (e = 0,68, Cour 2020) | 3,8 | 7 ans |
| Sécurité à 15 % du budget | 2,5 | 12 ans |

## 5. Ce que ça appuie, nuance ou contredit dans la thèse de l'auteur

**Appuie.**
- **La redondance et la sous-traitance sont réelles et coûteuses.**
  - Environ la moitié du travail applicatif est sous-traitée (CNAM 55 à 65 %, Justice environ 60 %, AIFE 71 %).
  - Un prestataire coûte environ deux fois un agent (Sénat 2016 ; ministre en 2026 ⚠️).
  - Environ 35 000 communes achètent les mêmes fonctions à une poignée d'éditeurs.
  - Ces deux leviers rapportent environ 2,7 Md€/an, **sans aucun pari sur l'IA**. Une fois payée la sécurité renforcée, il reste environ 2,2 Md€/an (scénario central sans IA : retour en 14 ans).
- **L'État sait réussir quand il internalise et standardise.** Exemples : Chorus, le prélèvement à la source, FranceConnect (45 millions d'utilisateurs), Démarches simplifiées (22,7 millions de dossiers), La Suite (environ 40 M€ sur 5 ans), KOMBIT au Danemark, X-Road en Estonie.
- **Les échecs français sont surtout des échecs de maîtrise d'ouvrage et de sous-traitance** : Sirhen (60 M€ prévus, environ 400 à 500 M€ dépensés, abandonné), ONP (346 M€, abandonné), Louvois. Ils ne prouvent pas que l'État ne peut pas faire.
- **L'IA rend la cible moins chère et plus rapide à construire** dès qu'elle dépasse environ ×1,5 sur le travail réel.

**Nuance.**
- **L'enjeu budgétaire direct est modeste** : de l'ordre de 2 à 5 Md€/an, soit 0,1 à 0,3 % de la dépense publique. Le vrai gain est ailleurs : les **agents non informaticiens** libérés par des logiciels meilleurs et plus simples. Les chiffres de MAREVA (64 ETP économisés par million de télédéclarants) et la revue britannique de 2025 (plus de 45 Md£ d'économies potentielles par an, pour 26 Md£ de dépense numérique ⚠️) vont dans ce sens. Ce gain relève de T3 et de la simplification des règles, pas du budget informatique.
- **« Une entité unique » doit s'entendre comme « des briques et des standards communs »**, pas comme un système unique. C'est ce qui a marché (X-Road, FranceConnect, KOMBIT) et ce que recommande l'ANSSI (cloisonnement).
- **Les collectivités ne peuvent pas être contraintes** (libre administration). Il faut une adhésion volontaire, donc une offre meilleure et moins chère que celle des éditeurs.

**Contredit.**
- **Le ×100 ne se transpose pas à l'échelle de l'État.**
  - Les études mesurées donnent ×0,8 à ×1,3 sur le travail réel ; METR estime environ ×1,5 fin 2026 pour la R&D en IA ; ×5 n'est mesuré nulle part.
  - Même à ×100 sur le code, l'organisation plafonne vers ×2,5 (p = 0,6), car le reste du travail n'est pas accéléré.
  - Le témoignage de l'auteur décrit sans doute un **gain de capacité** (faire seul ce qu'on n'aurait pas pu faire), pas un gain sur un travail existant soumis à la recette, au droit et à la reprise de données.
  - La différence entre ×5 et ×100 vaut 0,7 Md€/an dans le scénario central : **le ×100 n'est pas nécessaire à la thèse**, et la thèse ne devrait pas s'appuyer dessus.
- **Une refonte rapide et centrale est le scénario historique de l'échec** : Phénix (310 M CAD prévus, plus de 2,2 Md CAD imprévus), NPfIT, Louvois. Le double fonctionnement et le risque de dépassement dominent le coût de transition.
- **La monoculture accroît le risque systémique.** Le red teaming permanent par IA est une bonne réponse, mais il ne supprime pas ce risque : l'attaquant dispose des mêmes IA. Les incidents français de 2026 (DGFiP via le RIE, HubEE) montrent qu'une brique commune devient une cible commune.

## 6. Conditions de réussite (ce que le modèle suggère)

1. **Commencer par la mutualisation et l'internalisation**, qui rapportent sans pari technologique. Mesurer ensuite le gain réel de l'IA dans une équipe publique, par exemple par un essai randomisé à beta.gouv.fr, avant de dimensionner les effectifs.
2. **Remplacer par briques et par fonction** (état civil, paie, urbanisme, prestations), avec bascule progressive et réversible. Pas de « big bang ».
3. **Payer les ingénieurs au prix du marché** et recruter massivement : c'est la contrainte qui lie.
4. **Cloisonner, ouvrir le code et budgéter la sécurité au-delà de 5 %**, avec des équipes rouges indépendantes de l'équipe qui construit.
5. **Offrir le socle aux collectivités sans l'imposer**, sur le modèle KOMBIT et des opérateurs publics de services numériques (Déclic : 80 structures, 27 000 collectivités).
6. **Publier un « jaune » budgétaire du numérique** : sans lui, aucune économie ne pourra être vérifiée.

## 7. À retenir pour le livre et le simulateur

- Chiffre à citer : « L'informatique publique coûte de l'ordre de 11 à 18 Md€ par an ; une plateforme commune construite en interne pourrait en économiser de l'ordre de 2 à 5 Md€ par an après une transition d'une dizaine d'années et de 25 à 30 Md€. Sans aucun pari sur l'IA, la mutualisation et la fin de la sous-traitance en apportent environ 2 Md€. »
- Le ×100 est présenté comme **témoignage**, à côté des mesures, en assumant l'écart.
- Paramètres exposés pour le simulateur : `EtatPlateforme.simuler({ productivite, organisation, niveauCout, surcharges })`.
