# Cas types nets de la mutuelle et des titres-restaurant (base de travail du 06/11/2026)

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 06/11/2026. Couche ajoutée sur la base de travail (document de travail de l'atelier, non publié, `modeles/systeme-ideal/base_0611.js`), **non adoptée** : aucun résultat existant n'est modifié. Code : `modeles/systeme-ideal/cas_types_nets_0611.js` (fonctions pures), tests `test_cas_types_nets_0611.js` (55 vérifications), tableaux `rapport_cas_types_nets_0611.js` → `resultats_cas_types_nets_0611.txt` ; droit actuel avec mutuelle : `generer_cas_types_nets_0611.py` (OpenFisca-France 2026). Vérifications V18200 à V18210.

**Question.** Les cas types des jeux de réglages comparent seulement le revenu disponible. Or l'arbitrage 49 supprime la complémentaire santé obligatoire (la Sécu prend le socle à 100 %) et l'arbitrage 50 supprime les titres-restaurant. Principe de l'auteur : ne rien augmenter, rediriger. Que donne la comparaison une fois la mutuelle comptée ?

## En une minute

- **Indicateur** : revenu après dépenses contraintes de santé et avantages (« revenu net santé ») = revenu disponible − cotisation de complémentaire santé payée par le ménage (+ titres-restaurant, en option). À coût employeur constant, ce que l'employeur ne paie plus (part patronale de mutuelle, forfait social, titres-restaurant) va **au salaire** (mode S, central) ou **au budget commun** par une contribution employeur (mode C, variante).
- **Le bas de l'échelle repasse au-dessus de la cible une fois la mutuelle comptée** (central, mode S, sans surcomplémentaire) : jeu (a) Smic seul **+58 €/mois**, parent isolé +94, couple à deux Smic +83, couple à deux Smic avec deux enfants **+65** (contre −87 en revenu disponible) ; jeu (c) +62 / +98 / +95 / +78. La cible « bas revenus ≥ +20 € » est **tenue en revenu net santé, manquée en revenu disponible**.
- **Mais ce résultat est fragile** : il tombe si le ménage rachète une surcomplémentaire (couple à deux Smic avec enfants −6 € dans le jeu a), si la part patronale part au budget commun plutôt qu'au salaire (+5 €), ou si le salarié a aujourd'hui des titres-restaurant (−23 €). Dans ces trois variantes, la cible du bas est manquée.
- **Le haut reste loin de la cible** (−1 à −3 %) : cadre à 10 000 € brut **−926 €/mois (−14,9 %)** dans le jeu (a), −839 (−13,5 %) dans le jeu (c). La mutuelle ne pèse que ≈ 45 €/mois à ce niveau : elle ne change rien à la conclusion du § 000.6.
- **Les grands gagnants sont les retraités** : pension nette constante (convention du modèle) et contrat individuel qui disparaît : **+132 €/mois à 70 ans** (+12 % à 1 200 € de pension), +162 à 85 ans. C'est le transfert le plus net de la réforme : des actifs, qui paient la fonction des revenus, vers les retraités, qui paient aujourd'hui les contrats les plus chers.
- **Manque à financer** : 52,1 Md€ en comptabilité officielle. Si l'on ne compte pas comme prélèvement nouveau la part qui finance la Sécurité sociale à 100 % (25,5 Md€ nets, qui remplacent des cotisations de mutuelle), **le manque « réel » tombe à 26,6 Md€** (12,4 à 33,9 selon les lignes ; 55,6 en macro prudente). En prélèvements obligatoires élargis, le jeu (a) monte de 52,1 Md€ la fonction des revenus mais fait disparaître 34,9 Md€ de contrats collectifs obligatoires : **+17,3 Md€ de hausse nette**. Ce n'est pas une baisse du besoin de financement public (il reste 52,1 Md€ à lever) : c'est une autre façon de dire qui paie quoi.
- **Part employeur de la complémentaire (BT08)** : elle n'est **pas** dans le coût employeur des cas types (OpenFisca, montant nul par défaut) ; dans la base macro R, elle dépend de la comptabilité nationale (D121 compte les institutions de prévoyance, peut-être pas les mutuelles : V12872). Traitement cohérent retenu : la part employeur entre dans le R des cas types (salaire) ; la recette macro reste à 0 si elle est déjà dans D121, +6,5 Md€ sinon (manque 45,6).

## 1. Méthode

Pour chaque cas type, trois revenus mensuels : droit actuel, base de travail (fonction v7.2 de la v7.4 B), jeux (a) et (c) du § 000.6 (mêmes barèmes : a = 0,7096 et 0,7028, reconstruits par `B.jeuRevenus`, test à l'appui).

**Droit actuel, salariés** (huit cas types OpenFisca de `base_0611.js`) : le revenu disponible publié est calculé sans complémentaire (OpenFisca met le montant à 0 par défaut). J'ai relancé OpenFisca-France 2026 avec un contrat collectif obligatoire (prime adulte 84,36 € au central, part employeur 55 %, enfants sur le contrat du premier parent à 40 % chacun) : la part salariale sort du salaire net, la CSG frappe la part employeur, la part salariale est déduite du revenu imposable, la prime d'activité réagit. **Limite trouvée** : OpenFisca n'ajoute pas la part employeur au salaire imposable, alors qu'elle l'est depuis les revenus 2013 (loi de finances pour 2014) ; je la corrige au taux marginal d'IR du cas (HN8). Exemple : cadre à 10 000 € brut, OpenFisca −27,3 €/mois, plus 41 % de 46,4 € = −46 €.

**Droit actuel, autres cas** : retraités et indépendant paient un contrat individuel selon l'âge (DREES) ; le retraité au minimum vieillesse paie la C2S participative (30 €/mois à 70 ans).

**Nouveau système** : plus de complémentaire obligatoire ; surcomplémentaire facultative à 0 au central ; variante : le ménage garde une surcomplémentaire hors panier, payée en entier par lui, à 30 % de la prime actuelle (part des prestations non transférées : 1 − 23,05 / 33).

**Coût employeur constant (HN5)** : (S) la part employeur × (1 + forfait social 8 %) et les titres-restaurant entrent dans le R du salarié, qui passe par la fonction des revenus ; (C) l'employeur verse le même montant au budget commun (contribution santé, sur le modèle d'Alsace-Moselle côté employeur) : R inchangé, recette publique de 13,1 Md€.

## 2. La part employeur est-elle dans la base R ? (point « à vérifier » de BT08)

- **Cas types** : non. Le R des cas types est le super-brut OpenFisca (`I.HYP.OF_CAS[id].superBrut`), calculé avec un montant de complémentaire nul et des salariés « non cadres » (pas de prévoyance cadre). Le coût employeur réel d'un salarié couvert est plus élevé de ≈ 50 €/mois (46,4 € × 1,08 au central). **Les cas types publiés sous-estimaient donc légèrement le R des salariés couverts.**
- **Base macro** : la table T14 de `modele.js` (`coutSelonBrut`, API Urssaf mon-entreprise, cinq points) ne sert qu'à la **forme** de la distribution : le niveau est recalé sur `salairesCout` = 1 466,5 Md€ = salaires bruts D11 (1 137,2) + cotisations effectives des employeurs D121 (329,3), Insee, compte des ménages T_7401 (`modele.js` l. 18 et 221-222). La question est donc celle de V12872 : D121 comprend les versements aux institutions de prévoyance ; la base 95 de l'Insee classait les versements des employeurs aux mutuelles en D75 (hors D121) ; la base 2020 n'a pas été lue.
- **Traitement cohérent retenu** : dans les cas types, la part employeur va dans R (mode S). Côté recette : si elle est dans D121, rien à ajouter (BT08 = 0, la base macro la taxe déjà) ; si elle n'y est pas, sa conversion en salaire est une recette nouvelle : 23,8 × 55 % = 13,1 Md€ d'assiette × 0,50 = **+6,5 Md€** (BT08 de la base : 0 au central, 7,6 au favorable avec un marginal de 0,58). Les deux branches sont données au § 5.

## 3. Hypothèses

| N° | Hypothèse | Valeur (bas / central / haut) | Source ou méthode |
|---|---|---|---|
| HN1 | Indexation des primes 2023 → 2026 | ×1,00 / ×1,14 / ×1,20 | hausses annoncées de 2024 à 2026 (≈ 4,5 %/an au central) ⚠️ V18201 |
| HN2 | Part employeur du contrat collectif | 60 % / 55 % / 50 % | minimum légal 50 % ; moyenne non lue ⚠️ V18202 |
| HN3 | Enfants sur le contrat du premier parent | +40 % de la prime adulte par enfant, même part employeur | hypothèse ⚠️ V18203 |
| HN4 | Forfait social sur la part employeur, compté dans le coût constant | 0 / 8 % / 8 % | taux de 8 % (entreprises de 11 salariés et plus) |
| HN5 | Destination de ce que l'employeur ne paie plus | (S) salaire, central ; (C) contribution au budget commun | choix politique à trancher |
| HN6 | Titres-restaurant : part employeur par bénéficiaire | 76 €/mois (5,5 Md€ / 6 M / 12) | PLFSS 2026 annexe 4 ; CNTR ⚠️ V18207 |
| HN7 | Surcomplémentaire gardée (variante) | 30 % de la prime actuelle, payée en entier par le ménage | 1 − 23,05 / 33 (BT04) |
| HN8 | IR sur la part employeur (omis par OpenFisca) | 0 (Smic, couple avec enfants), 11 %, 30 %, 41 % | taux marginal du cas ⚠️ V18204 |
| HN9 | Âges | retraités 70 ans (et 85 ans), indépendant 40 ans | prime individuelle interpolée (DREES) |
| HN10 | Pensions | nettes constantes (convention H84 / H72.4) ; jeux (a) et (c) avec R1f | `decisions_0611_v72.js` ⚠️ V18208 |
| HN11 | Prime de l'« assuré de référence » DREES prise comme prime type | personne seule, tranche de revenus la plus basse, zone la plus chère | DREES ⚠️ V18200 |
| HN12 | « Bas revenus » de la cible | Smic seul, parent isolé, couples à deux Smic avec et sans enfants | cible H71.8 |

Primes retenues (2026, central) : collectif 84 €/mois par adulte (74 € en 2023) ; individuel 72 € à 40 ans, 132 € à 70 ans, 162 € à 85 ans.

## 4. Tableaux (€/mois ; Δ = écart au droit actuel)

### 4.1 Central : mode salaire, sans surcomplémentaire, sans titres-restaurant

| Cas type | Revenu disponible aujourd'hui | Mutuelle payée aujourd'hui | Revenu net santé aujourd'hui | Base : Δ rd | Base : Δ net santé | Jeu (a) : Δ rd | Jeu (a) : Δ net santé | Jeu (c) : Δ rd | Jeu (c) : Δ net santé |
|---|---|---|---|---|---|---|---|---|---|
| Célibataire au Smic | 1 706 | 32 | 1 674 | +48 | +97 (+5,8 %) | +10 | **+58** (+3,4 %) | +14 | **+62** (+3,7 %) |
| Parent isolé, 2 enfants, au Smic | 2 590 | 39 | 2 551 | +64 | +135 (+5,3 %) | +26 | **+94** (+3,7 %) | +30 | **+98** (+3,9 %) |
| Couple sans enfant, deux Smic | 3 088 | 67 | 3 022 | +75 | +189 (+6,3 %) | −26 | **+83** (+2,8 %) | −15 | **+95** (+3,2 %) |
| Couple, 2 enfants, deux Smic | 3 549 | 93 | 3 457 | +14 | +173 (+5,0 %) | −87 | **+65** (+1,9 %) | −76 | **+78** (+2,2 %) |
| Couple médian, 2 enfants (2 × 2 735 € brut) | 4 424 | 117 | 4 307 | +476 | +647 (+15,0 %) | +219 | **+383** (+8,9 %) | +249 | **+413** (+9,6 %) |
| Cadre seul à 5 000 € brut | 3 429 | 45 | 3 384 | +93 | +156 (+4,6 %) | −235 | **−174** (−5,2 %) | −197 | **−137** (−4,0 %) |
| Cadre seul à 10 000 € brut | 6 276 | 46 | 6 230 | −232 | −168 (−2,7 %) | −987 | **−926** (−14,9 %) | −900 | **−839** (−13,5 %) |
| Cadre seul à 20 000 € brut | 11 038 | 43 | 10 995 | −98 | −37 (−0,3 %) | −1 687 | **−1 629** (−14,8 %) | −1 505 | **−1 447** (−13,2 %) |
| Indépendant (micro libéral, 3 000 € de CA, R = 2 550 €), 40 ans | 1 743 | 72 | 1 670 | +217 | +290 (+17,3 %) | +158 | **+230** (+13,8 %) | +165 | **+237** (+14,2 %) |
| Retraité au minimum vieillesse (1 044 €), 70 ans, C2S participative | 1 044 | 30 | 1 014 | 0 | +30 (+3,0 %) | 0 | **+30** | 0 | **+30** |
| Retraité, 1 200 € nets, 70 ans | 1 200 | 132 | 1 068 | 0 | +132 (+12,3 %) | 0 | **+132** | 0 | **+132** |
| Retraité, 2 000 € nets, 70 ans | 2 000 | 132 | 1 868 | 0 | +132 (+7,0 %) | 0 | **+132** | 0 | **+132** |
| Retraité, 2 000 € nets, 85 ans | 2 000 | 162 | 1 838 | 0 | +162 (+8,8 %) | 0 | **+162** | 0 | **+162** |
| Retraité, 4 000 € nets, 70 ans | 4 000 | 132 | 3 868 | 0 | +132 (+3,4 %) | −43 (R1f) | **+89** (+2,3 %) | −43 | **+89** (+2,3 %) |

Lecture : « mutuelle payée aujourd'hui » = part salariale + CSG et IR sur la part employeur − effet sur la prime d'activité (salariés) ; contrat individuel (autres). Les colonnes « Δ rd » sont celles du § 000.6, retrouvées à l'euro (test). La personne au RSA et l'allocataire de l'AAH ont la C2S gratuite : rien ne change pour eux. Les salariés « à 1 500, 2 000, 3 000 € net » n'ont pas de super-brut OpenFisca (V17710) : non traités.

### 4.2 Variantes : jeu (a), revenu net santé des bas revenus et des cadres (€/mois)

| Variante | Smic seul | Parent isolé | Couple 2 Smic | Couple 2 Smic, 2 enfants | Cadre 10 000 | Cadre 20 000 | Cible du bas |
|---|---|---|---|---|---|---|---|
| Central (S, sans surcomplémentaire) | +58 | +94 | +83 | +65 | −14,9 % | −14,8 % | tenue |
| Surcomplémentaire gardée (30 % de la prime) | +32 | +48 | +32 | **−6** | −15,3 % | −15,0 % | manquée |
| Contribution employeur au budget commun (C) | +42 | +65 | +40 | **+5** | −15,1 % | −14,9 % | manquée |
| Salarié avec titres-restaurant aujourd'hui | **+6** | +41 | **−5** | **−23** | −15,5 % | −15,2 % | manquée |
| Scénario bas des primes (non indexées, part employeur 60 %) | +49 | +83 | +64 | +39 | −15,0 % | −14,9 % | tenue |
| Scénario haut des primes (+20 %, part employeur 50 %) | +62 | +99 | +91 | +77 | −14,8 % | −14,8 % | tenue |

Jeu (c), mêmes variantes : +62 / +98 / +95 / +78 au central ; surcomplémentaire +37 / +53 / +44 / +6 ; contribution employeur +46 / +69 / +52 / +17 ; titres-restaurant +10 / +46 / +8 / −10. Tableaux complets : `modeles/systeme-ideal/resultats_cas_types_nets_0611.txt`.

**Pourquoi les titres-restaurant coûtent cher au bas de l'échelle** : aujourd'hui, 76 € de part employeur arrivent nets d'impôt et de cotisations ; demain, convertis en salaire, ils passent par la fonction des revenus et, près du Smic, le taux marginal effectif du barème (extinction du bonus d'activité comprise) fait qu'il n'en reste que ≈ 28 € (37 %). C'est mécanique : un avantage exonéré qui devient du salaire est taxé ; l'arbitrage 50 le savait (recette BT09), les cas types le montrent.

**Pensions (sensibilité, HN10)** : si la caisse versait un brut fixe (regroupé sous le barème de la base) au lieu d'une pension nette constante, le jeu (a) retirerait 14 € (minimum vieillesse), 22 € (1 200 €), 96 € (2 000 €) et 407 € (4 000 €) par mois aux retraités : le gain de la mutuelle serait alors en partie repris. La recette des jeux ne compte pas de prélèvement sur les pensions : la convention « nette constante » est donc la cohérente.

## 5. La cible de répartition, mutuelle comptée

Cible validée (H71.8) : bas revenus ≥ +20 €/mois ; haut −1 à −3 %.

- **Bas** : en revenu disponible, aucun jeu ne tient la cible (couple à deux Smic avec enfants −87 / −76). En revenu net santé, au central (mode S, sans surcomplémentaire, sans titres-restaurant), **les jeux (a) et (c) la tiennent** (minimum +58 et +62), même dans les scénarios bas et haut des primes. **Elle est manquée** dès que l'une de trois conditions tombe : le ménage rachète une surcomplémentaire, la part patronale va au budget commun et pas au salaire, ou le salarié perd des titres-restaurant. La cible n'est donc tenue que si l'on **garantit** que l'employeur reverse sa part en salaire (une règle de transition à écrire, pas un acquis) et que le socle couvre vraiment ce que la mutuelle couvrait.
- **Haut** : manquée de très loin, mutuelle ou pas (−13 à −15 % pour les cadres à 10 000 et 20 000 € brut ; la base sans réglage est à −2,7 % et −0,3 %). La mutuelle (≈ 45 €/mois) ne change rien : le problème du haut vient du manque de 52 Md€ mis entièrement sur la fonction des revenus.
- **Hors cible** : retraités (+30 à +162 €/mois) et indépendant (+230 €) sont gagnants ; le couple médian gagne +383 €/mois dans le jeu (a). Le classement « qui paie » se fait entre les cadres (dès 5 000 € brut : −174 €) et tous les autres.

**Opinion de Claude (à discuter)** : « on n'augmente rien, on redirige » est **vrai pour les ménages modestes salariés et pour les retraités**, à condition que l'employeur reverse sa part ; c'est **faux pour les cadres**, qui paient bien plus que la mutuelle qu'ils économisent. Et c'est faux pour les finances publiques : la redirection ne réduit pas le besoin de 52 Md€, elle le rend plus acceptable.

## 6. Le manque à financer en prélèvements élargis

| Convention (Md€/an) | Référence | Prudente | Favorable |
|---|---|---|---|
| Officiel (base de travail, § 000.5) | 52,1 | 81,1 | 28,4 |
| (S) part employeur hors de D121, convertie en salaire taxé à 0,50 | 45,6 | 74,6 | 21,8 |
| (C) contribution employeur santé au budget commun (13,1) | 39,0 | 68,0 | 15,3 |
| **PO élargis : la Sécu à 100 % nette (25,5) n'est pas un prélèvement nouveau** | **26,6** | 55,6 | 2,8 |
| PO élargis et contribution employeur | 13,5 | 42,5 | 0,0 |

Selon les lignes de la base (favorable / central / défavorable), macro de référence : officiel 32,5 / 52,1 / 62,1 ; PO élargis 12,4 / 26,6 / 33,9.

- **Méthode** : le manque de dette est linéaire dans l'effet au solde (`B.dette`) ; on ajoute à l'effet de la base le coût net de la Sécu à 100 % (BT04 + BT05 + BT06 + BT07 = 23,05 + 4,31 + 1,15 − 2,96 = 25,5 Md€).
- **Recoupement** : les primes du panier transféré (70 % de 46,5 Md€) font 32,5 Md€, dont 24,4 dans les contrats collectifs obligatoires : la Sécu à 100 % (25,5 Md€ nets) coûte moins que les primes qu'elle remplace, grâce aux frais de gestion évités (5,2 à 7,0 Md€, privés) ; le reste des primes (hors panier) devient une dépense facultative.
- **Statique** : jeu (a) = +52,1 Md€ de fonction des revenus − 34,9 Md€ de contrats collectifs obligatoires disparus (HB10, 75 % de 46,5) = **+17,3 Md€ de prélèvements élargis** (+5,6 à +28,9 selon HB10).
- **Ce que cela ne dit pas** : le déficit public à combler reste de 52,1 Md€. Lire 26,6 comme « le vrai effort » suppose que chaque ménage retrouve, en cotisations de mutuelle évitées, ce qu'il paie en plus : c'est vrai en moyenne, pas cas par cas (les cadres paient bien plus, les retraités gagnent sans payer).

## 7. Questions ouvertes pour l'auteur

1. **Part patronale de la mutuelle** : obligation de la reverser en salaire pendant une transition (mode S, cible du bas tenue) ou contribution employeur au budget commun (mode C, 13,1 Md€ de recette, cible du bas manquée) ?
2. **Titres-restaurant** : la fin des titres coûte ≈ 48 €/mois nets à un salarié au Smic qui en a ; faut-il une compensation (bonus d'activité relevé) pour les 6 M de bénéficiaires ?
3. **Retraités** : ils gagnent 132 à 162 €/mois sans contribuer au financement (pension nette constante). Faut-il qu'une partie de la Sécu à 100 % soit financée par eux (par exemple une contribution santé proportionnelle sur les pensions, à la manière de l'Alsace-Moselle à 1,3 %, qui leur laisserait l'essentiel du gain) ?

## Sources mobilisées

| Source | Ce qu'elle établit | Cote | Conflit d'intérêts |
|---|---|---|---|
| [DREES, jeu de données « organismes offrant des couvertures complémentaires santé », paru le 23/09/2025](https://drees.solidarites-sante.gouv.fr/communique-de-presse-jeux-de-donnees/jeux-de-donnees/250923_DATA_organismes-couvertures-compl%C3%A9mentaires-sant%C3%A9) (consulté le 06/11/2026) | enquête OC 2023 : prime individuelle 36 € à 20 ans, 142 € à 85 ans ; prime collective moyenne 74 € quel que soit l'âge ; +6 à +9 % sous 60 ans, −2 à +3 % au-delà, depuis 2021 | A | aucun connu |
| [DREES, Études et résultats n° 1338, avril 2025](https://www.drees.solidarites-sante.gouv.fr/sites/default/files/2025-04/ER1338-MEL%20%283%29.pdf) (PDF lu avec pypdf le 06/11/2026) | primes 2021 de l'assuré de référence : 33 € (20 ans), 59 € (40 ans), 93 € (60 ans), 127 € (75 ans), 146 € (85 ans) ; collectif 68 € (66 € en 2019), parts employeur et salarié comprises ; définition de l'assuré de référence | A | aucun connu |
| [DREES, La complémentaire santé, édition 2024](https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/panoramas-de-la-drees/240710_Panorama_ComplementaireSante2024) (via résumé de recherche) | 104 € à 65 ans (2021) | A (non relu) | aucun connu |
| OpenFisca-France (venv de la session, barème 2026), `generer_cas_types_nets_0611.py` | effet de la complémentaire collective sur le revenu disponible et le super-brut des huit cas types ; part employeur absente du salaire imposable (code `salaire_imposable`) | B (modèle de microsimulation ouvert) | aucun connu |
| PLFSS 2026, annexe 4 (via `base_0611.js`, lu le 06/11/2026) | assiettes exemptées 2024 : santé et prévoyance 23,8 Md€ ; titres-restaurant 5,5 Md€ | A | document du gouvernement |
| `sources/avantages-nature-frais-pro.md` (CNTR via rapport AN) | 6 M de salariés bénéficiaires des titres-restaurant ; plus de 10 Md€ de valeur faciale | B/C | CNTR : organe de place (émetteurs, restaurateurs) |
| `sources/assurances-dossier.md`, `base_0611.js` (DREES, HCAAM) | 46,5 Md€ de cotisations, 33 Md€ de prestations, coût de la Sécu à 100 % 23,05 Md€ ; contrats collectifs 75 % (HB10) | A/C | aucun connu |
| `sources/economies-10-milliards.md` § 7 (Insee base 95, définitions c2294, c1399) | base R du modèle = D11 + D121 ; versements des employeurs aux mutuelles classés hors D121 en base 95 | A | aucun connu |
| `modeles/systeme-ideal/base_0611.js`, `decisions_0611_v72.js`, `variante_dette_stable.js` | barèmes des jeux, dette, R1f, convention des pensions | B (modèle du dépôt) | coécrit par Claude (Anthropic) et l'auteur |
