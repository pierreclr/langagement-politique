---
titre: Chiffrage de la réorientation de l'industrie de la complexité
date: 2026-11-05
statut: brouillon sourcé ; assemblage de modèles existants (T6, reconversion, coût complet du prélèvement, bilan global) ; hypothèses et ordres de grandeur, jamais des prédictions ; vérifications V13250 à V13262
---

# Réorienter l'industrie de la complexité : emplois, heures, reconversion, PIB, recettes

Écrit par Claude (IA d'Anthropic) pour l'auteur, le 05/11/2026. Calculs : `sources/calculs/reorientation_complexite.py` (assert de réconciliation avec T6 et la reconversion) ; extraction de la reconversion : `sources/calculs/reorientation_complexite_extrait.js` → `.json`. Légende : **fait sourcé** · **estimation** (calcul reproductible) · **opinion** · ⚠️ non confirmé. On décrit un système, pas des personnes : les comptables, gestionnaires de paie et fiscalistes rendent un service réel, c'est la règle qui crée le besoin. Principe : ne perdre personne.

**Ce que ce document n'est pas** : un nouveau modèle. Il assemble `modeles/industrie-complexite/` (T6 : taille et activités), `modeles/reconversion/` (que deviennent les personnes), `sources/cout-complet-prelevement.md` (périmètre strict) et le bilan global, et ajoute trois choses : les **heures**, le **calendrier à 5 et 10 ans**, et la **conversion en PIB et en recettes** au taux de la v5.3. **Mon risque ici : la complaisance** (un gain de productivité est la promesse la plus facile à écrire). Le résultat honnête est plus mince que le chiffre « coût évité ».

## 0. Tableau de synthèse (régime de croisière, central sauf mention ; Md€ de 2024-2025 ; année 1 = 2029)

| | Bas | Central | Haut | Nature |
|---|---|---|---|---|
| **Emplois (ETP) libérés en régime** | 107 k | **260 k** | 479 k | estimation (T6) |
| dont secteur externe (cabinets, juridique, paie, CIR, patrimoine) | 34 k | 79 k | 142 k | |
| dont services internes des entreprises (du temps, pas des postes entiers) | 72 k | 180 k | 337 k | |
| **Heures libérées par an** (M h) : temps des entreprises et des ménages | 137 | **348** | 690 | estimation (1 607 h par ETP ; 12 €/h ménages) |
| Heures libérées : emplois du secteur externe (M h) | 55 | 127 | 228 | |
| **Libéré à 5 ans (2033)** : bascule rapide (4 ans) / annoncée sur 10 ans | 107 k / 53 k | 260 k / 130 k | 479 k / 239 k | calendrier |
| **Libéré à 10 ans (2038)** | 107 k | 260 k | 479 k | |
| Personnes **déplacées** (calendrier rapide / dix ans) | 0 / 0 | 106 k / **16 k** | 359 k / 304 k | reconversion (marché favorable / central / défavorable) |
| Retraite sans retour (rapide / dix ans) | 0 | 8 k / 1 k | 48 k / 40 k | |
| **Coût public de la reconversion** : budget net cumulé (rapide / dix ans) | 0 | **5,5 / 0,8 Md€** | 38 / 32 Md€ | reconversion ; impôt perdu compris |
| Production perdue pendant la transition (cumul, rapide / dix ans) | 0 | 28 / 4 Md€ | 143 / 120 Md€ | |
| **Gain « comptable »** (coût de conformité évité, pas une richesse) | 10,0 | 24,3 | 45,3 | T6 |
| **Gain « réel » : production nouvelle** (PIB, convention v2) | **5,0** (0,17 % du PIB) | **12,0** (0,41 %) | **19,6** (0,67 %) | estimation |
| même, convention prudente / v1 (central) | | 4,0 / 20,0 | | sensibilité |
| **Recettes publiques** au taux marginal (30 / 34 / 43 %) | **1,5** | **4,1** | **8,4** | estimation |
| à 5 ans (dix ans / rapide), central | | 2,0 / 3,3 | | |

**À retenir.** (1) Le chiffre « 24 Md€ évités » n'est pas du PIB : la production réelle nouvelle est de l'ordre de la moitié au central (12 Md€), et du sixième si l'on suppose, prudemment, que la moitié du travail de complexité était déjà utile (4 Md€). (2) Les recettes qui en découlent sont de **4 Md€ au central, pas 6,4** : le chemin de dette de `palier1.js` (levier D) applique le taux moyen de 42,7 % à un gain de 15 Md€ ; au taux marginal, c'est 4,1. L'écart de −2,3 Md€ doit être corrigé dans la trajectoire, pas dans le solde de croisière. (3) Ce qui est vraiment **nouveau** par rapport au modèle : les heures, le calendrier à 5 ans, le taux marginal ; le reste est de la consolidation. (4) Le plus dur n'est pas le coût budgétaire (0,8 Md€ si étalé sur dix ans), c'est le **calendrier** : au rythme de la bascule, 106 000 personnes sont déplacées au central.

## 1. Emplois et heures libérés, par activité

**Fait sourcé** (bases) : activités comptables (NAF 69.20) 221 053 personnes, 28,0 Md€ en 2024 ([Eurostat SBS](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_ovw_act?geo=FR&nace_r2=M692&lang=en)) ; 1,57 M d'employeurs privés ([Urssaf](https://open.urssaf.fr/explore/dataset/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/)). **Estimation** : les parts « complexité » et « disparaît » sont les hypothèses H3 à H8 de T6 (`modeles/industrie-complexite/methode.md`), non des mesures.

| Activité (ETP qui disparaissent en régime) | Bas | Central | Haut | Heures, central (M h/an) |
|---|---|---|---|---|
| Expertise comptable (hors audit) | 28 k | 59 k | 103 k | 95 |
| Activités juridiques, part fiscale et sociale (notaires compris) | 3 k | 10 k | 20 k | 15 |
| Conseil en défiscalisation patrimoniale | 2 k | 5 k | 9 k | 8 |
| Cabinets de CIR et d'optimisation des charges | 1 k | 3 k | 5 k | 5 |
| Éditeurs et prestataires de paie | 0,4 k | 1,4 k | 3,1 k | 2 |
| Audit légal | 0,2 k | 0,7 k | 1,4 k | 1 |
| **Sous-total secteur externe** | **34 k** | **79 k** | **142 k** | **127** |
| Services internes des employeurs (paie, comptabilité, fiscalité) | 72 k | 180 k | 337 k | 290 |
| Temps des ménages (déclarations et démarches, 1 / 2 / 4 h par foyer) | 21 M h | 58 M h | 149 M h | 58 |
| **Total emplois** | **107 k** | **260 k** | **479 k** | |

**Deux natures à distinguer.** (a) **Temps libéré chez les entreprises et les ménages** : 348 M h par an au central (290 d'internes + 58 des ménages). Ce ne sont pas 180 000 postes entiers : T6 compte des équivalents ; c'est environ le quart du temps de 1,2 M de personnes. Cela se réaffecte dans l'entreprise, sans licenciement si la loi est annoncée. (b) **Emplois du secteur** (cabinets, éditeurs, conseil) : 79 000 ETP au central, 127 M h. Ce sont des **postes**, qui disparaissent quand les clients cessent d'acheter ; l'État ne peut pas y faire d'attrition (contrairement aux agents publics) : seul le **rythme de la loi** les protège.

**Contrôle qui tire vers le bas (à lire).** Le bloc interne libère 185 h par employeur et par an au central (290 M h / 1,566 M employeurs), alors que la PME type de Doing Business passe 139 h par an sur les trois impôts (2018, source arrêtée en 2021, PME « moyenne »). T6 compte plus (comptabilité de base, grandes entreprises), mais cela montre que le central interne est probablement **généreux** ; le périmètre strict de `cout-complet-prelevement.md` (conformité fiscale et sociale seule) donne 147 000 ETP privés au central (57 % de T6). Je donne donc les deux dans la § 3 : **opinion de Claude : retenir T6 central comme borne haute du central, et le périmètre strict comme central prudent** (PIB 6,8 Md€, recettes 2,3).

**Ce qui ne figure pas dans T6** (nouveau, non chiffré en dur) : les intermédiaires des aides énergétiques et de rénovation (courtiers et mandataires des CEE, accompagnateurs de MaPrimeRénov'). La fin des CEE (≈ 4,0 Md€ de prélèvement caché, ligne N12 du bilan) supprime leur raison d'être. Aucun chiffre d'emploi n'a été trouvé (recherche web du 05/11 : seulement la position de la FFB, sans effectif ; Cour des comptes 2024 sur la structure du dispositif, sans emplois) ⚠️ V13253. **Hypothèse** (non ajoutée aux totaux) : 5 / 10 / 20 % du coût capté par les intermédiaires, soit 0,2 / 0,4 / 0,8 Md€ de chiffre d'affaires et 2 000 / 3 000 / 6 000 emplois au CA par emploi de l'expertise comptable (127 k€). Petit, dans le bruit de T6 ; à confirmer avant tout usage.

## 2. Calendrier : 5 ans et 10 ans

La part libérée suit la montée en charge de la loi (année 1 = 2029) : montée en 4 ans (bascule rapide du modèle de reconversion), en 7 ans, en 10 ans (bascule annoncée).

| Part libérée | à 5 ans (2033) | à 10 ans (2038) |
|---|---|---|
| Bascule rapide (4 ans) | 100 % | 100 % |
| Sur 7 ans | 71 % | 100 % |
| Annoncée sur 10 ans | 50 % | 100 % |

Au central : à 5 ans, **260 000 ETP et 476 M h** libérés si la bascule est rapide, **130 000 et 238 M h** si elle est annoncée sur dix ans ; à 10 ans, 260 000 et 476 M h dans les deux cas. **Réserve** : le bilan global ne compte aucune économie de gestion avant 2032 (la fermeture de l'ancien système) ; si la simplification pour les entreprises attend aussi ce système, les chiffres « à 5 ans » baissent d'environ 2 ans de montée (opinion, non modélisée) ⚠️ V13254.

## 3. Ce que deviennent ces personnes

**Faits sourcés** (modèle de reconversion, `modeles/reconversion/resultats.md`) : perte de revenu des licenciés économiques −20 % l'année suivante et −12 % à cinq ans, non-emploi ≈ 10 % à cinq ans en France (Bertheau et al. 2023, repris du dépôt) ; 43 % des licenciés économiques en emploi à un an (Trésor-OCDE) ; aux États-Unis, 1,4 à 2,8 années de revenu perdues en valeur actuelle (Davis et von Wachter 2011). **Estimation** : le modèle fait absorber d'abord par les départs en retraite (2,6 %/an, Métiers 2030), puis redéployer, puis il suit les déplacés. Les métiers d'arrivée (contrôle de gestion et conseil aux TPE-PME 35 %, numérique 15 %, santé et aide à la personne 15 %, enseignement 10 %, contrôle et accompagnement des usagers 10 %, création d'entreprise 10 %, industrie 5 %) et les besoins sourcés (113 000 cadres administratifs, comptables et financiers de déficit en 2030, 224 000 aides à domicile, 104 000 aides-soignants, 68 000 enseignants) sont dans `modeles/industrie-complexite/resultats.md` § 5 : **je ne les refais pas**.

| Reconversion, scénario (taille × marché) | Calendrier rapide (4 ans) | Sur 7 ans | Annoncé sur 10 ans |
|---|---|---|---|
| Bas (107 k, marché favorable) : déplacés | 0 | 0 | 0 |
| **Central (260 k, marché central) : déplacés** | **106 k** | 61 k | **16 k** |
| Central : en emploi à 1 / 5 ans | 47 % / 83 % | idem | idem |
| Central : retraite sans retour | 8 k | 5 k | 1 k |
| Central : production perdue cumulée | 28,4 Md€ | 16,3 | 4,2 |
| Central : **budget net cumulé** (impôt perdu 41 %, complément, plancher 877 €, formation) | **5,5 Md€** (0,54/an 2029-2035, pic 0,88 en 2032) | 3,2 | **0,8** |
| dont formation | 0,5 | 0,3 | 0,1 |
| Haut (479 k, défavorable) : déplacés ; budget net cumulé | 359 k ; 38 Md€ | 332 k ; 35 | 304 k ; 32 |

**Durée de transition** (central, rapide) : le non-emploi culmine à 41 000 personnes en 2032 et vaut 29 600 à cinq ans de la bascule ; de 55 à 59 ans, 29 % sont en emploi à un an et 63 % à cinq ans, et 72 % des 60-63 ans atteignent la retraite sans emploi. **Réallocations sectorielles** : la littérature dit que des chocs sectoriels peuvent expliquer une part du chômage (Lilien 1982, [JPE 90(4)](https://www.journals.uchicago.edu/doi/10.1086/261003) ⚠️ DOI non relu ; la part, de l'ordre de 30 % à horizon 3-5 ans selon une étude de la Fed de San Francisco, est débattue : Abraham et Katz 1986 y voient l'effet de la demande agrégée) ; les cicatrices salariales durables (−7 % à long terme au central) sont solides. **Opinion** : le calendrier est le seul vrai levier ; la formation ciblée et l'aide à la mobilité changent peu dans le modèle (−0,2 et −0,3 Md€ de production perdue).

**Public** : l'attrition des 23 900 ETPT fiscaux et sociaux (central de `cout-complet-prelevement.md`) ne fait aucun licenciement et est **déjà dans le bilan** (D18, D19) ; je ne la recompte pas.

## 4. Gain économique : comptable ou réel

**Comptable** (ce qu'on économise) : 10,0 / 24,3 / 45,3 Md€ par an de coûts de conformité et d'activités qui disparaissent (T6), dont 0,25 / 0,7 / 1,8 pour les ménages. **C'est un transfert** : ce que le client économise, le secteur le perd, tant que les personnes n'ont pas retrouvé une production ailleurs.

**Réel** (production nouvelle) : les ETP libérés qui retrouvent un emploi produisent la valeur ajoutée moyenne (77 488 € par personne, NAF 69.20, Eurostat SBS 2024) ; le travail de complexité qui disparaît valait quelque chose (v2 : 25 %). **Méthode** : gain du modèle de reconversion, auquel j'ajoute le coût du système public (1,0 Md€ au central ; retiré parce que le coût de paiement du socle est déjà compté en D18) et la formation (coût public, comptée à part).

| PIB réel nouveau (Md€/an) | Bas | Central | Haut |
|---|---|---|---|
| à 5 ans (2033), annoncé sur 10 ans | 2,5 | 5,9 | 6,2 |
| à 5 ans, bascule rapide | 5,0 | 9,6 | 10,6 |
| à 10 ans (2038), annoncé sur 10 ans | 5,0 | 11,7 | 15,0 |
| **En croisière (2045), convention v2** | **5,0** | **12,0** | **19,6** |
| en % du PIB (2 935 Md€) | 0,17 | 0,41 | 0,67 |
| Central, convention v1 / prudente | | 20,0 / 4,0 | |

**Recettes** (estimation) : la part qui revient à l'État est le **taux marginal** de la v5.3, pas le taux moyen. Bas : 30 % = 42 % × l'assiette du prélèvement unique (887,2 / 0,42 = 2 112 Md€, soit 72 % du PIB) ; central : 34 % (+ TVA et accises sur la part consommée, +4 points : hypothèse de Claude ⚠️ V13256) ; haut : 43 % (le PO de 0,427 de `palier1.js`). Recettes en croisière : **1,5 / 4,1 / 8,4 Md€**. À 5 ans au central : 2,0 (dix ans) ou 3,3 (rapide). Le coût public de transition **qui s'y ajoute** (allocations, formation, hors impôt perdu, déjà dans le gain net) est de 0,0 à 0,1 Md€ au central à 5 ans et de 0,6 à 0,8 Md€ au haut ; l'impôt perdu pendant la transition est inclus dans le budget net de la § 3, il ne faut pas le retrancher deux fois.

**Sensibilités.** Périmètre strict (central prudent) : PIB 6,8, recettes 2,3. Bloc interne divisé par deux : 169 000 ETP, PIB 7,8, recettes 2,7. Convention prudente : PIB 4,0, recettes 1,4 (0,34 × 4,0). Le chiffre est **très sensible** à deux paramètres que personne n'a mesurés : la part de temps interne et la valeur du travail réalloué (⚠️ V13251, V13252).

## 5. Ce qui est déjà compté et ce qui serait nouveau

| Poste | Déjà dans le bilan / le modèle | Ici |
|---|---|---|
| Coût public de la collecte (7,6 Md€), gestion supprimée (4,9 brut, 3,1 net, D18), 23 900 ETPT de l'État | **Oui** (D18, D19 ; économie budgétaire de 2,6 de `cout-complet-prelevement.md`) | **non recompté** |
| Coût du système public qui remplace (1,0) | Oui (coût de paiement du socle −0,64, D18) | rajouté au gain brut pour ne pas le déduire deux fois |
| Impôt perdu et allocations des déplacés | Non au solde de croisière ; oui en transition (H16, reconversion, ≈ 0,5 Md€/an 2029-2035) | repris, pas recompté |
| Gain « réel » de T6 | **Oui, dans le chemin de dette** : levier D de `palier1.js` = 3,5 / 15 / 33 Md€ × 42,7 % = 1,5 / 6,4 / 14,1 Md€ de recettes (⚠️ V13257 : le bilan H11 écrit « ≈ 3,2 », que je ne retrouve pas) ; **pas dans le solde de croisière** | **remplacerait D** ; ne pas additionner |
| CIR (8,0), niches, CEE, MaPrimeRénov' (suppressions de dépense) | Oui (D14, N10-N12, D17) : ce sont des économies de **l'État** | ici, seulement l'**emploi privé** qui s'y attache (CIR : 3 k ETP déjà dans T6 ; CEE : hors T6) |
| Rente des notaires (0,9 à 1,5 Md€) | `modeles/numerus-orientation` (tarif) | **non comptée** : c'est un transfert |
| **Nouveau** | | heures par activité ; calendrier 5 et 10 ans ; taux marginal ; intermédiaires des CEE (non chiffrés) ; comparaison avec le contrôle Doing Business |

**Conclusion sur le double compte.** Aucune ligne **du solde de croisière** ne change : le gain de production est une « création de valeur » qui va dans la trajectoire de dette, comme le dit le bilan (H11, H16).

## 6. Meilleure objection, et réponse

**« Le gain de productivité ne se matérialise pas : un comptable libéré n'est pas un aide-soignant ; on aura des chômeurs de cols blancs et un PIB inchangé. »** C'est la meilleure objection, et les chiffres lui donnent en partie raison : en convention prudente, le gain réel tombe à 4,0 Md€ et au défavorable le cumul 2029-2040 est négatif (−2 Md€, `modeles/reconversion/resultats.md`). Le temps libéré chez les entreprises peut aussi se diluer en réunions sans être réaffecté. **Réponse** : (1) le temps des ménages et des petites entreprises est du temps déjà « libre » dès que la règle disparaît ; (2) l'étalement sur dix ans ramène les déplacés à 16 000 au central ; (3) une partie du déclin viendrait de l'IA de toute façon (Métiers 2030 : −24 % d'employés de la comptabilité de 2019 à 2030) : la réforme le rend ordonné ; (4) le coût budgétaire est faible (0,8 Md€ sur dix ans au central) ; ce n'est pas lui qui décide de la réforme, c'est la justice entre petits et grands. **Ce que la réponse ne règle pas** : 55 ans et plus, haut de la fourchette (304 000 déplacés), et la promesse « ne perdre personne », tenable seulement avec un calendrier lent.

**Lobbying des professions.** L'industrie se défend (Tullock, Krueger) : aux États-Unis, le pilote public IRS Direct File a été suspendu en 2025 alors que TurboTax pèse 5,3 Md$ (T6). Réponse de méthode : associer les professions plutôt que les désigner, annoncer le calendrier tôt, arrêter de former des débutants dans les métiers qui disparaissent (excédent de 61 000 jeunes en 2030 chez les employés de la comptabilité). **Contre-exemple utile** : les Pays-Bas ont réduit de 25 % la charge administrative des entreprises, et le CPB y a projeté jusqu'à 1,4 % de PIB (projection, non mesure ; [revue du programme](https://archive.doingbusiness.org/en/reports/thematic-reports/review-of-the-dutch-administrative-burden-reduction-programme), page lue le 05/11 : objectif de 4 Md€, sans la projection de PIB, relayée par des sources secondaires ⚠️ V13258) ; c'est bien supérieur à mon central (0,41 %), et je ne le retiens pas : périmètre plus large (toutes normes), projection de modèle.

**Professions réglementées (notaires).** L'activité juridique (NAF 69.10, 190 000 personnes, notaires compris) est comptée à 5 / 10 / 15 % de complexité fiscale et sociale : 3 000 / 10 000 / 20 000 ETP qui disparaissent. Le modèle `numerus-orientation` chiffre la rente des notaires à 0,9 à 1,5 Md€ (10 à 18 % du CA de 8,5 Md€) et recommande d'**agir par le tarif et l'automatisation, pas par un numerus de fermeture**. Les deux sont cohérents : ici, la simplification des successions et des droits de mutation (N06, N08) réduit la matière taxable ; là, un tarif plus bas réduit la rente. **À ne pas additionner** : une baisse de tarif réduit le chiffre d'affaires sur lequel mes emplois sont calculés, et la rente est un transfert, pas un gain de production. La libéralisation de 2015 (+64 % d'offices, CA +33 %) montre que le notariat absorbe plus qu'il n'est prévu quand l'accès s'ouvre.

## 7. Limites

Les parts de T6 sont des hypothèses ; le bloc interne (le plus lourd) est le moins bien mesuré et paraît généreux au regard de Doing Business ; le taux marginal central (34 %) est un choix ; l'effet dynamique d'allocation des talents (Murphy, Shleifer et Vishny 1991 ; Philippon et Reshef 2012) n'est pas chiffré ; les effets de demande de court terme ne le sont pas non plus ; les calendriers à 5 ans supposent que la simplification démarre en 2029 (voir § 2).

## 8. Synthèse des sources mobilisées

| Source | D'où | Ce qu'elle établit |
|---|---|---|
| [Eurostat SBS](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_ovw_act?geo=FR&nace_r2=M692&lang=en) | Eurostat, 2024 | 221 053 personnes, 28,0 Md€, VA par personne (77 488 €) |
| [Urssaf open data](https://open.urssaf.fr/explore/dataset/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/) | Urssaf, 2024 | 1,57 M d'employeurs privés |
| `modeles/industrie-complexite/` | T6 | emplois et Md€ qui disparaissent, par activité |
| `modeles/reconversion/` | reconversion | déplacés, coût, gain selon trois conventions |
| `sources/cout-complet-prelevement.md` | 03/11/2026 | périmètre strict (147 000 emplois privés central), VVA/KPMG, Doing Business |
| document de travail de l'atelier, non publié ; `modeles/systeme-ideal/palier1.js` | 05/11/2026 | lignes D18, D19, H11, H16 ; levier D ; PO = 0,427 |
| [Revue du programme néerlandais](https://archive.doingbusiness.org/en/reports/thematic-reports/review-of-the-dutch-administrative-burden-reduction-programme) | Banque mondiale, lue le 05/11/2026 | objectif de 4 Md€ de charge en moins ; pas de chiffre de PIB sur la page |
| Lilien (1982), Abraham et Katz (1986) | JPE (via recherche web du 05/11) | chocs sectoriels et chômage : part débattue |

## À intégrer au bilan global (propositions de lignes ; le bilan n'est pas modifié)

1. **Aucune ligne au solde de croisière.** Le gain de production est une création de valeur (trajectoire de dette), comme H11 et H16 le disent déjà.
2. **Corriger le levier D du chemin de dette** (palier1.js) : remplacer « gain T6 × 42,7 % » (1,5 / 6,4 / 14,1 Md€) par « gain de production (v2, avec coût du système rajouté) × taux marginal » : **1,5 / 4,1 / 8,4 Md€** en croisière (central −2,3 Md€) ; à 5 ans : 0,7 / 2,0 / 2,6 (annoncé sur dix ans). À décider par l'auteur.
3. **H11 (ligne hors taux)** : remplacer « ≈ 3,2 de recettes via le PIB » par **4,1 Md€ (1,5 à 8,4)**, ou par 2,3 au périmètre strict.
4. **H16 (transition)** : conserver 0,54 Md€/an 2029-2035 pour la bascule rapide (5,5 Md€ cumulés) ; recommander la **bascule annoncée sur dix ans : 0,8 Md€ cumulés**, 16 000 déplacés. **Ajouter une ligne de lecture** : « 348 M h de temps libéré par an chez les entreprises et les ménages ; 260 000 ETP dont 79 000 emplois du secteur ».
5. **Hors totaux** : intermédiaires des CEE (2 000 à 6 000 emplois, ⚠️), rente des notaires (transfert).
