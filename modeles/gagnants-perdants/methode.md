# Gagnants et perdants : méthode

> **Mise à jour du 03/11/2026 (recalage).** Les §§ 1 à 9 décrivent le système de l'ANCIEN débat (socle 1 000 €, taux 50 %, tout remplacé, retraités au complément de carrière) : ils sont gardés pour l'historique et leurs données de répartition servent encore. Le palier 1 de `modeles/systeme-ideal/` (socle 500 €, taux plat 35 %, retraités sanctuarisés, plancher RSA) et ses chemins de financement sont traités au **§ 10** ([`palier1.js`](palier1.js), [`resultats-palier1.txt`](resultats-palier1.txt)).


Tâche T14 · consultation des sources : 2026-10-25 · code : [`modele.js`](modele.js) · test : [`test_modele.js`](test_modele.js) · collecte : [`donnees/collecte.py`](donnees/collecte.py) · résultats : [`resultats.md`](resultats.md) · export : [`cas_types.json`](cas_types.json)

Légende : **fait sourcé** (lien) · **estimation** (calcul explicité) · **hypothèse** (de l'auteur ou de Claude) · ⚠️ non confirmé (registre V550 à V569).

## 1. Question posée

Qui gagnerait et qui perdrait, en euros par mois, si l'on remplaçait le système actuel par celui de l'auteur ?

**Le système proposé** (hypothèses de l'auteur, paramétrables) :
- un socle de **1 000 € par adulte et par mois**, non imposé, plus **200 € par enfant** (montant de départ du simulateur) ;
- un **prélèvement unique de 50 %** sur tous les revenus. Pour les salaires, il porte sur le **coût total employeur** : le salarié reçoit 50 % de ce que coûte aujourd'hui son poste ;
- la suppression de l'impôt sur le revenu, de la CSG-CRDS, des cotisations, et des aides remplacées : aides au logement, RSA, prime d'activité, prestations familiales, assurance chômage, minimum vieillesse ;
- l'**AAH est maintenue** ; la TVA et les accises ne changent pas ;
- les retraités reçoivent le socle et un **complément de carrière**, selon trois règles possibles (§ 4).

Deux niveaux de réponse :
1. **Cas types** : 27 foyers précis (sans emploi, Smic, cadres, indépendant, intermittent, familles, retraités, bailleur, rentier, héritier).
2. **Répartition** : par dixième de niveau de vie, puis pour le top 1 % et le top 0,1 %.

## 2. Revenu disponible actuel des cas types : méthode et sources

**Méthode principale : l'API web OpenFisca-France** (version 175.0.45, législation 2026), appelée par [`donnees/collecte.py`](donnees/collecte.py). Elle répondait le 2026-10-25. Chaque cas est décrit sur 2024, 2025 et 2026 (les prestations dépendent des revenus passés), puis les montants de 2026 sont sommés sur l'année et divisés par 12. Réponses brutes : [`donnees/reponses_api.json`](donnees/reponses_api.json). Tableau : [`donnees/cas_types_actuel.csv`](donnees/cas_types_actuel.csv).

**Contrôles réussis** :
- le net au Smic vaut 1 477,93 €, comme le montant indicatif de service-public.gouv.fr ;
- le RSA d'une personne seule logée vaut 573 € (651,69 € moins le forfait logement de 78,20 €).

**Compléments, là où OpenFisca ne convient pas ici** :

| Élément | Problème constaté | Solution retenue |
|---|---|---|
| Coût employeur | OpenFisca donne un « salaire super brut » **négatif** au Smic en 2026 (−1 603 €), signe d'une anomalie dans la réduction générale de 2026 (⚠️ V550) | API du simulateur Urssaf [mon-entreprise](https://mon-entreprise.urssaf.fr/api/v1/evaluate), comme T4 (1 987,76 € au Smic) |
| Pensions | OpenFisca calcule la CSG déductible, mais met à zéro la CSG imposable, la CRDS et la CASA (⚠️ V551) | Taux totaux déduits du taux de CSG déductible calculé par OpenFisca : 0 ; 4,3 % ; 7,4 % ; 9,1 % |
| Indépendant (micro) | La variable de chiffre d'affaires n'entre pas dans l'impôt | Impôt calculé par OpenFisca sur la case micro-BNC ; cotisations par l'API Urssaf (774 € pour 3 000 € de chiffre d'affaires) |
| Chômage d'un cadre | OpenFisca ne calcule pas l'allocation | Règlement d'assurance chômage : max(57 % du SJR ; 40,4 % du SJR + 13,18 €), plafonné à 75 % ; net calculé par OpenFisca, moins 3 % du SJR pour la retraite complémentaire (⚠️ V553) |
| Héritage | Hors du champ d'OpenFisca | Barème des articles 777 et 779 du CGI (abattement de 100 000 € en ligne directe) |

Le revenu disponible actuel est égal à :

> revenu net d'activité, de remplacement et du capital − impôt sur le revenu − prélèvements sociaux sur le capital + RSA + prime d'activité + aides au logement + prestations familiales + ASPA

Il est calculé hors taxe foncière, TVA et accises.

## 3. Revenu disponible dans le système proposé (cas types)

> **R' = S × adultes + E × enfants + (1 − t) × (coûts employeur + chiffre d'affaires × (1 − charges réelles) + dividendes + loyers nets) + compléments de retraite**

- Le chômage, le RSA, la prime d'activité, les aides au logement, les prestations familiales et l'ASPA sont supprimés.
- L'**héritage** est traité à part, comme un montant ponctuel : l'héritier garde H − t × max(0, H − abattement), avec un abattement nul par défaut (« taxer les héritages comme un revenu »).
- Le **point mort** est le taux t qui annule l'écart pour un foyer, trouvé par dichotomie.

## 4. Hypothèses numérotées

| # | Hypothèse | Source ou statut |
|---|---|---|
| H1 | **Statique** : coût employeur, salaires bruts, prix et comportements inchangés. Le salarié reçoit (1 − t) × son coût employeur actuel. | Hypothèse de l'auteur (taux de 50 % du coût total employeur) ; les effets de comportement sont chiffrés dans T4 et T5, pas ici |
| H2 | Logement des cas modestes : **locataire du parc privé, zone APL 2**. Loyer de 500 € (1 adulte) ou 650 € (2 adultes), plus 75 € par enfant. Les cadres, les retraités, le rentier et le bailleur sont propriétaires. | Hypothèse de Claude ⚠️ V552 |
| H3 | Salaire médian = **1,5 Smic brut** (2 800,53 €) : net de 2 217 € selon OpenFisca, contre un salaire net médian du privé en EQTP de 2 190 € en 2024 (Insee, repris de T4). Cadres : 3 et 6 Smic (2 et 4 fois le médian). Très haut salaire : 30 000 € brut. | Calcul |
| H4 | Indépendant : micro-entrepreneur libéral, 3 000 € de chiffre d'affaires par mois, **charges réelles de 15 %**, soustraites dans les deux systèmes. | Hypothèse de Claude ⚠️ V555 |
| H5 | Intermittent : allocation de **1 117,5 € brut par mois** (dépense moyenne 2025, [Unédic](https://www.unedic.org/publications/les-intermittents-du-spectacle-couverts-par-lassurance-chomage-en-2025)) et salaires de 1 366 € brut par mois. Les salaires sont déduits du fait que l'allocation représente 45 % des revenus totaux. Le coût employeur suppose 5 points de cotisation chômage patronale en plus. | ⚠️ V554 |
| H6 | Cadre au chômage : ancien salaire de 3 Smic brut ; allocation des six premiers mois. La dégressivité de 30 % au 7e mois n'est pas modélisée. | ⚠️ V553 |
| H7 | Enfants de 8, 11, 14 et 6 ans ; parents mariés. Parent isolé sans pension alimentaire, donc avec l'ASF. | Hypothèse de Claude ⚠️ V556 |
| H8 | Trois règles de retraite : **« brut »** (complément = pension brute − socle, non imposé ; règle du simulateur et de T13) ; **« net »** (complément = pension nette actuelle − socle) ; **« imposé »** (complément brut imposé au taux t). | T13, [`modeles/retraites/resultats.md`](../retraites/resultats.md) |
| H9 | Socle par unité de consommation (UC), identique dans tous les dixièmes : 55,2 M d'adultes et 13,9 M d'enfants répartis sur 47,1 M d'UC, soit **14 790 € par UC et par an**. | Population : Insee 2026 ; UC : calculées sur les vingtièmes de l'Insee ⚠️ V557 |
| H10 | Loyers réels (40,9 Md€) répartis entre dixièmes comme les revenus financiers. Le reste des loyers est imputé (propriétaires occupants), donc non imposé. | Hypothèse de Claude ⚠️ V559 |
| H11 | Prestations remplacées par dixième : prestations familiales + (1 − 0,334) × « prime d'activité et minima sociaux » + aides au logement (*France, portrait social 2025*). Les groupes de l'Insee (D1, Q1…) sont ramenés aux dixièmes. | ⚠️ V557 |
| H12 | Part de l'AAH dans « prime d'activité et minima sociaux » : 33,4 % dans tous les dixièmes. | Calcul sur les montants DREES 2024 ⚠️ V558 |
| H13 | 16,5 M de retraités résidents (17,4 M moins ≈ 0,9 M à l'étranger, T13). Leur répartition par dixième : effectif = pensions / (κ × RDB par UC), κ calé sur 16,5 M (κ = 0,67). L'économie sur les pensions (T13 : 185,5 Md€ « brut », 214 Md€ « net ») est répartie au prorata de effectif × min(pension moyenne ; 12 000 €). | Hypothèse de Claude ⚠️ V560 |
| H14 | Chômage par dixième = (pensions + chômage, par vingtième) − pensions. | Calcul |
| H15 | Aides au logement : transfert en nature en comptabilité nationale, donc absentes du RDB. Leur perte est retranchée à part. | Insee Analyses n° 119 |
| H16 | Dans un dixième, les actifs, les retraités et les chômeurs ont le même revenu par UC. Leurs poids sont leurs parts de revenu : (salaires nets + revenus mixtes), pensions, chômage. Le capital, les impôts et les prestations sont partagés également. | Hypothèse de Claude ⚠️ V561 |
| H17 | Dispersion dans un dixième : revenu uniforme entre les bornes tirées des vingtièmes. Seul le socle ne varie pas avec le revenu. | Hypothèse de Claude ⚠️ V561 |
| H18 | Ménage moyen = 1,52 UC (47,1 M d'UC pour 30,9 M de ménages). | Calcul ⚠️ V564 |
| H19 | Top 1 % et 0,1 % : revenu moyen = **2 × le seuil** (forme de Pareto ; 1,8 à 2,1 en sensibilité). Composition du revenu : Filosofi 2021. Autres paramètres : coût employeur = 1,6 × salaire net avant CSG (calculé sur les cas « cadre 4× » et « très haut salaire ») ; bénéfice des indépendants = 1,3 × revenu déclaré ; socle versé à 1,25 adulte par UC ; 30 % des pensions repris par le socle ; 1,6 UC par ménage. | Hypothèses de Claude ⚠️ V562 |
| H20 | Variante « IS reversé » : la suppression de l'IS (25 %) est intégralement versée en dividendes, soit 1 / 0,75 fois les dividendes actuels. Pour le top : 80 % des revenus mobiliers sont des dividendes. | Hypothèse de Claude |

## 5. Estimation par dixième : formules

**Sources** :
- comptes nationaux distribués de l'Insee, 2023 ([Insee Analyses n° 119](https://www.insee.fr/fr/statistiques/8973957), fichier `ia119.xlsx`) : salaires **super-bruts** (coût employeur), revenus mixtes, revenus financiers, loyers, impôts, cotisations, prestations et pensions, en € par UC et par dixième de niveau de vie ; [`donnees/insee_comptes_distribues_2023.csv`](donnees/insee_comptes_distribues_2023.csv) ;
- prestations familiales, aides au logement et minima sociaux par niveau de vie : [France, portrait social 2025](https://www.insee.fr/fr/statistiques/8612544) ; [`donnees/insee_redistribution_2024.csv`](donnees/insee_redistribution_2024.csv).

Pour un dixième d (€ par UC et par an) :

> **écart_d = socle_UC + (1 − t)(salaires super-bruts + revenus mixtes + revenus financiers + loyers réels) + loyers imputés + pensions nouvelles + prestations conservées + autres transferts − RDB_d − aides au logement_d**

avec :
- pensions nouvelles = pensions − économie T13 (règle « brut » ou « net »), multipliées par (1 − t) pour la règle « imposé » ;
- prestations conservées = prestations hors pensions et chômage − prestations remplacées (H11).

**Gagnants et perdants** (H16, H17) :
- pour chaque groupe g (actifs, retraités, chômeurs), on calcule l'écart moyen Δ_g ;
- on écrit Δ_g(m) = socle_UC − m × L_g, avec L_g = socle_UC − Δ_g et m le revenu relatif, uniforme entre les bornes du dixième ;
- la part de gagnants du groupe est P(m < socle_UC / L_g).

Cette méthode **ignore la diversité des familles** (parents isolés, ménages à l'ASPA, chômeurs bien indemnisés), qui fait justement les perdants dans les cas types. **Les parts de gagnants sont donc des bornes hautes.**

**Top 1 % et 0,1 %** ([Insee, « Très hauts revenus », Filosofi 2021](https://www.insee.fr/fr/statistiques/7941389), [`donnees/insee_tres_hauts_revenus_2021.csv`](donnees/insee_tres_hauts_revenus_2021.csv)) :
- niveau de vie NV = revenu moyen / (somme des composantes positives en % du niveau de vie) ;
- proposé = socle + NV × [(1 − t)(1,6 × salaires + 1,3 × indépendants + mobilier + foncier + financiers imputés) + 0,7 × pensions].

## 6. Effets de comportement et de rebond (non intégrés ici, renvois)

Les écarts sont **mécaniques**. Les réactions sont chiffrées ailleurs, en ordres de grandeur :

- **Offre de travail (T4)** : la masse salariale baisserait de 1 à 3 % (central −2,5 %). Un salarié qui réduit ses heures réduit lui-même son gain, mais l'effet sur le budget pèse sur le taux d'équilibre.
- **Assiettes (T5)** : 36 à 120 Md€ de recettes perdues ; le **taux d'équilibre** passe de ≈ 59 % (statique, [`sources/recherche-donnees-simulateur.md`](../../sources/recherche-donnees-simulateur.md)) à ≈ 61 / 63 / 66 %. C'est pourquoi les résultats sont donnés à **50 %, 59 % et 63 %**.
- **Incidence du prélèvement sur le coût employeur** : H1 suppose que les employeurs gardent le même coût. Si les salaires bruts étaient renégociés, la répartition entre salariés et entreprises changerait. Sur l'incidence des cotisations, Saez, Matsaganis et Tsakloglou (*Quarterly Journal of Economics*, 2012) trouvent qu'en Grèce les cotisations patronales ne se répercutaient pas sur les salaires nets à court terme ⚠️ (non chiffré ici).
- **Non-recours** : environ un tiers des foyers éligibles ne demandent pas le RSA (DREES ⚠️ V566). Pour eux, le gain réel du socle est **plus grand** que celui calculé, qui suppose que tout le monde touche ses droits actuels.

## 7. Scénarios

| Scénario | Taux | Sens |
|---|---|---|
| Proposé | 50 % | Système de l'auteur tel quel, **non financé** (≈ −196 Md€/an selon le simulateur) |
| Équilibre statique | 59 % | Taux qui équilibre le simulateur sans réactions |
| Équilibre après réactions centrales | 63 % | T5, scénario central |

Variantes : règle de retraite (brut / net / imposé) ; IS reversé ou non ; abattement sur les héritages ; facteur de Pareto 1,8 à 2,1.

## 8. Limites

1. **Cohérence avec le simulateur.** À 50 %, le modèle par dixièmes donne un gain total des ménages de ≈ +313 Md€ par an. Le bilan du simulateur suggère un chiffre plus bas, de l'ordre de +150 à +200 Md€ (calcul de Claude ⚠️ V563 : 196 Md€ de déficit, plus ≈ 130 Md€ de droits de succession supplémentaires, moins ≈ 115 Md€ d'IS et d'impôts de production qui profitent aux entreprises, et non aux ménages). Trois causes identifiées :
   - les cotisations des comptes distribués (542 Md€) comprennent des cotisations **imputées** (≈ 72 Md€ en 2024, fictives) que le simulateur ne compte pas ;
   - le chômage y est plus large (≈ 46 Md€, contre 37 + 1,7 Md€) ;
   - l'assiette du capital y est nette des intérêts versés.

   **Lire les dixièmes comme un profil (qui gagne relativement), pas comme un niveau.**
2. **Millésimes mélangés** : comptes distribués 2023, redistribution 2024, Filosofi 2021, cas types 2026. Les dixièmes des deux sources de l'Insee ne sont pas définis de la même façon (niveau de vie usuel ou avant redistribution).
3. **Pas de microsimulation** : l'enquête ERFS et les modèles Ines ou TAXIPP ne sont pas accessibles ici. Une vraie estimation des gagnants et des perdants exige des données individuelles (CASD).
4. **Hors champ** : la taxe foncière (supprimée, gain pour les propriétaires non compté), la TVA (inchangée), les transferts en nature, la transition et les droits acquis du chômage, les DOM et Mayotte.
5. **OpenFisca** : deux anomalies ont été contournées (V550, V551). Le barème de l'IR sur les revenus de 2026 est celui que contient la version 175.0.45 (⚠️ V567).

## 9. Ce qui manque

- Les distributions croisées « dixième × configuration familiale × statut » (Insee, ERFS), pour remplacer H16-H17.
- La distribution des pensions par dixième de niveau de vie (T13 la donne par montant de pension, pas par niveau de vie du ménage).
- Une validation des cas types sur le simulateur officiel de la CAF et sur [EDIFIS](https://drees.solidarites-sante.gouv.fr/) (DREES).
- Un signalement des anomalies V550-V551 au dépôt OpenFisca-France.

## 10. Recalage du 03/11/2026 sur le palier 1 et ses quatre chemins (`palier1.js`, `rapport_palier1.js`, `test_palier1.js` : 54 contrôles ; H440 à H449 ; V6850-V6859)

**Pourquoi.** `options-financement-palier1.md` § 6 tirait ses déciles de `effetsParDecile` (systeme-ideal), qui décrit les seuls **salariés par décile de salaire**, sans RSA, sans retraités et sans chômeurs, et dit que `modele.js` d'ici était « calé sur l'ancien système ». Ce paragraphe reprend les deux lectures sous un seul jeu de paramètres.

**Paramètres.** Ils viennent de `OptionsFinancement.stOption` (aucun défaut de systeme-ideal n'est modifié) : palier 1 = socle 500 €, taux plat 35 %, impôt continu à 30 % au-delà de R0 = 24 000 €, retraités sanctuarisés, plancher RSA. Un **chemin** est un objet `{ tPlat, socleFacteur, rampe }` : chemin 1 = 38 %, socle de 250 € (année 1) à 500 € (année 10) ; chemins 2 et 3 = 41,5 %, socle 400 € ; chemin 4 = 45 %, socle 400 € ; palier 1 = défaut. L'héritage, le patrimoine et les économies des chemins ne se répartissent pas par décile et ne changent pas les gagnants et perdants des ménages.

**Deux lectures, un même vocabulaire.**
1. **Dixièmes de niveau de vie** (tous les adultes, Insee 2023, `deciles`). *Avant* = revenu disponible de l'Insee : RSA, prime d'activité, prestations familiales, pensions et chômage y sont ; les aides au logement, hors RDB, sont comptées perdues. *Après* = pour chaque adulte non retraité, socle + (revenu d'activité et du capital − impôt à plat et continu) ; le plancher RSA monte à 877 € les 1,9 million de personnes sans autre revenu ; 200 € par enfant ; pensions, minimum vieillesse, AAH et loyers imputés inchangés ; l'impôt des retraités reste ; l'assurance chômage dégressive est conservée pour la part que le socle ne remplace pas. Le total des ménages n'est qu'un indicateur (§ 8, point 1 : un profil, pas un niveau).
2. **Cas types** (`casTypes`) : *avant* = OpenFisca-France 2026 (atlas zone 2 pour les familles, cas T14 pour le Smic, les cadres et les retraités) ; *après* = `SystemeIdeal.situation` + plancher RSA (877 €) ou plancher ciblé pour les parents isolés (1 300 €, H109).

| # | Hypothèse | Source ou statut |
|---|---|---|
| H440 | Le socle des adultes est réparti entre dixièmes au prorata des unités de consommation : adultes non retraités du dixième = adultes (au prorata des UC) − retraités du dixième (H13). Les enfants sont répartis aussi au prorata des UC. | ⚠️ simplification (V6850) |
| H441 | Les revenus d'activité et du capital des adultes non retraités d'un même dixième suivent une loi log-normale de dispersion 0,6 (quadrature à 5 points). Sensibilité 0,3 et 0,9 dans `resultats-palier1.txt`. | 📐 choix de modélisation (V6851) |
| H442 | 20 % du capital courant (financiers + loyers réels) appartient à des retraités (jeu « recherche » de systeme-ideal, clé par dixième de pension) et reste au PFU de 30 %. | reprise de systeme-ideal H134, ⚠️ clé par dixième de pension appliquée au dixième de niveau de vie |
| H443 | L'impôt des retraités reste : CSG-CRDS-Casa de 9,1 % sur la pension brute moyenne du dixième + IR calculé sur cette pension (`FiscaliteActuelle.irRetraiteSeul`). | ⚠️ pension moyenne, sans dispersion |
| H444 | Les bénéficiaires du plancher RSA sont 1,9 million de personnes sans autre revenu (effectif de systeme-ideal, ⚠️ à vérifier), réparties comme « prime d'activité et minima sociaux » (portrait social 2025) × UC. Les travailleurs à revenu partiel n'ont pas de plancher : ils perdent la prime d'activité. Le coût obtenu (8,6 Md€ à 500 €) est celui de `palier1.solde`. | ⚠️ V6850 |
| H445 | Part conservée de l'assurance chômage = `coutChomage` du palier / 37,1 Md€ (30 % à 500 €), répartie comme le chômage de chaque dixième. | 📐 |
| H446 | Les prestations familiales, le RSA et la prime d'activité (hors part AAH, H12) sont remplacés par le socle ; l'ASPA, l'AAH et les bourses sont conservées. | reprise de H12 |
| H447 | Les « avant » des cas types viennent d'OpenFisca 2026 (atlas : loyers de 500, 750 et 680 €, zone 2 ; Smic brut de 1 867,02 € lu sur la courbe de 1 823,07 €) et remplacent les estimations « de mémoire » de systeme-ideal (couple à un Smic 2 552 €, parent isolé sans emploi 1 650 €). Le plancher ciblé de 1 300 € s'applique aussi au parent isolé au Smic. | ✅ données / ⚠️ choix du plancher (V6856) |
| H448 | Le retraité locataire au minimum vieillesse perd son aide au logement : le palier 1 compte les 16,0 Md€ d'aides au logement comme remplacés (`depensesRemplacees`) et ne verse le socle qu'aux non-retraités. | ⚠️ lecture du code, question posée à l'auteur (V6852) |
| H449 | La contribution des hautes pensions (20 % au-delà de 2 500 € nets) n'est pas dans les dixièmes : elle ne toucherait que D9 et D10 (retraités). | ⚠️ V6853 |

**Régénérer** (depuis `modeles/gagnants-perdants/`, `jsc` = `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc`, `S=../systeme-ideal`) :
`jsc $S/modele.js $S/fiscalite_actuelle.js $S/voies.js $S/sante.js $S/optimisation.js $S/retraites2.js $S/palier1.js $S/patrimoine_financier.js $S/deces_realisation.js $S/options_financement.js cas_types_donnees.js droit_actuel.js modele.js palier1.js rapport_palier1.js > resultats-palier1.txt` (tests : même liste, `test_palier1.js` au lieu de `rapport_palier1.js`). Données du droit actuel : `python3 -I donnees/generer_droit_actuel.py <atlas_taux_marginaux.csv>`.

## 11. Correctifs « ne perdre personne » (03/11/2026 : `correctifs.js`, `rapport_correctifs.js`, `test_correctifs.js` : 52 contrôles ; H450 à H459 ; V6900-V6910)

**Pourquoi.** Même au palier 1, des cas types perdent (parent isolé, retraité locataire) ; au chemin 4, D1, le smicard et d'autres aussi. Le principe de l'auteur est « ne perdre personne ». Ce module chiffre quatre correctifs ciblés, seuls et combinés, sans changer aucun défaut : (a) aides au logement des retraités, (b) majoration pour parent isolé, (c) bonus d'activité, (d) plancher « pas moins qu'aujourd'hui » pendant N ans. Résultats : `resultats-correctifs.txt` ; lecture et coût ajouté au trou de chaque chemin : `systeme-ideal/options-financement-palier1.md` § 6ter.

**Méthode.** Les coûts de (a) et (b) sont des produits d'effectifs sourcés et de montants. Les coûts de (c) et (d) passent par la quadrature de la dispersion de `palier1.deciles` (H441) appliquée à un adulte seul sans enfant : *après* = `SystemeIdeal.situation` au chemin ; *avant* = atlas OpenFisca 2026 du célibataire locataire en zone 2, moins l'aide au logement pour la part de non-locataires. (d) y ajoute les parents isolés (pertes des cas types), les couples à un salaire avec enfants et les retraités locataires. Le taux marginal est la différence finie sur le coût employeur d'un adulte seul. Bas / central / haut : (a) 8 / 12 / 16 % des 16 Md€ ; (b) 50 % ciblé / 100 % / 100 % à 300 € ; (c) extrêmes sur trois dispersions (0,3 ; 0,6 ; 0,9) ; (d) dispersion, part de locataires, pertes des parents isolés et part de couples monoactifs.

| # | Hypothèse | Source ou statut |
|---|---|---|
| H450 | Les retraités reçoivent 8 / 12 / 16 % des aides au logement (16,0 Md€, 5,9 M de foyers allocataires fin 2023) ; l'aide moyenne par ménage retraité est celle de l'ensemble (226 €/mois). Le plafond de ressources est celui, dégressif, du droit actuel. | ⚠️ V6900-V6902 : part non trouvée, effectif lu dans un résumé |
| H451 | Majoration pour parent isolé = ASF 2026 (200,78 € par enfant et par mois, V6320) × 3,166 M d'enfants de familles monoparentales (Insee RP2023), versée sans condition de pension alimentaire ; haut = 300 € (T14). | ⚠️ V6903 |
| H452 | Bonus d'activité : 200 € par mois et par adulte, montée de 0 à 0,5 Smic brut, plateau jusqu'au Smic, extinction linéaire à 1,6 Smic (variantes 100 € ; extinction à 1,3 Smic ; réservé aux cinq premiers dixièmes). Remplace la prime d'activité, ne l'ajoute pas. | 📐 choix de calibrage, V6904 |
| H453 | Salaire brut et coût employeur : 6,5 % au Smic, 30 % à 1,6 Smic, 42 % au-delà de 3,5 Smic, interpolation linéaire. | ⚠️ V6905 : approximation des allègements |
| H454 | Chaque adulte non retraité hors plancher RSA est un adulte seul sans enfant pour le calcul de l'*avant* ; la part de locataires est de 30 / 50 / 100 %. | ⚠️ V6906 |
| H455 | L'atlas s'arrête à 5 450 € bruts (2,9 Smic) : au-delà, l'*avant* est plafonné et les pertes des hauts salaires ne sont pas comptées dans (d) (borne basse). | ⚠️ V6906 |
| H456 | 70 % des parents isolés travaillent ; les actifs portent 50 / 75 / 100 % de la perte du cas « parent isolé au Smic », les autres celle du cas « sans emploi ». | ⚠️ V6908 |
| H457 | Couples avec enfants mineurs : 5,95 M (7,937 M de familles − 1,985 M de familles monoparentales, Insee 2022) ; 15 / 25 / 35 % à un seul salaire, avec la perte du cas « couple, un Smic ». | ⚠️ V6907 |
| H458 | (a) est réparti entre dixièmes comme les aides au logement actuelles ; (b) comme les prestations familiales. | ⚠️ proxy |
| H459 | Le plancher (d) est un coût statique : pas de réaction de comportement ; la garantie de N ans compense 100 % de la perte pendant N ans puis plus rien (moyenne annuelle = coût × N / 10). | 📐 V6909 |

**Régénérer** (depuis `modeles/gagnants-perdants/`, `S=../systeme-ideal`) : même liste de fichiers que pour `rapport_palier1.js` (voir l'en-tête de `rapport_correctifs.js`), puis `correctifs.js rapport_correctifs.js > resultats-correctifs.txt` ; tests : `correctifs.js test_correctifs.js`.
