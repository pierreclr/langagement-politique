---
titre: "Les comptes"
statut: brouillon
version: 0.2
modele: DECISIONS0811, CORRECTION0811
sources_principales: [document de travail de l'atelier, non publié, modeles/systeme-ideal/resultats_decisions_0811.txt, modeles/systeme-ideal/resultats_correction_0811.txt, document de travail de l'atelier, non publié, sources/chiffrage-dette-stable-retraites-masse-salariale.md, sources/economies-benchmark-europeen.md, sources/exil-patrimoines-preuves.md]
---

# 12. Les comptes

## L'essentiel

### Ce que nous garantissons

Personne ne descend sous 877 € par mois quand il paie un loyer (627 € sinon). Les plus modestes gagnent un peu, la classe moyenne gagne davantage, et ceux qui gagnent beaucoup ou vivent de leur capital contribuent plus. Les chiffres qui suivent sont des ordres de grandeur sous hypothèses, jamais des prédictions.

### Ce que nous changeons, et pourquoi

| Aujourd'hui | Demain | Pourquoi |
|---|---|---|
| Des impôts, des cotisations et des aides empilés | Deux contributions, une TVA à trois taux, un montant par enfant | Pour que chacun sache ce qu'il paie et ce qu'il reçoit |
| Une mutuelle payée hors des comptes publics | Une Sécurité sociale qui rembourse le socle de soins | Pour que la santé ne dépende pas du contrat |
| Des collecteurs séparés pour chaque prélèvement | Une collecte regroupée | Pour réduire les coûts de gestion |
| Un déficit qui creuse la dette sans règle | Une trajectoire votée et une clause de dette | Pour que la dette cesse de grossir |

### Nos propositions

- Dépenser à peu près autant que l'État actuel, autrement, parce que la France ne dépense pas plus que ses voisins riches rapportée à sa richesse par habitant : la question est la répartition, non le gaspillage.
- Cesser de payer à crédit, sans faire payer plus le pays : la mesure officielle des prélèvements passerait de 42,7 % à 51,6 % du PIB, mais nette de ce que l'État reverse aux ménages elle passe de 38,0 % à 41,1 %, et cette hausse vient de la réduction du déficit (de 169 à environ 56 Md€ par an). Tout compris, y compris ce qui se paie aujourd'hui hors de l'État, l'écart est de 0,5 à 1,3 point.
- Demander 33,3 Md€ de contributions par an en régime (revenus, héritages, pensions élevées, impôt sur les sociétés), pour que la dette cesse de grossir.
- Viser une dette qui plafonne, pas une dette remboursée à marche forcée : sur 10 000 tirages, elle se situe vers 131 % du PIB en 2038 (entre 118 et 143 %) et 122 % en 2058 (entre 63 et 176 %), alors que sans changement elle atteindrait 157,1 % en 2038. La valeur centrale du modèle la fait culminer à 130,4 % en 2037, puis reculer à 124,6 % en 2058.
- Dire la limite de ce calcul : il suppose un taux d'intérêt fixe de 3,45 %. Au taux de novembre 2026 (environ 4,7 %), s'il monte encore avec la dette, il manque environ 40 Md€ par an pour stabiliser la dette, et nous n'avons pas encore décidé où les trouver.
- Voter une clause de dette : si la dette dérive de plus de 2 points de PIB, une votation obligatoire propose un ajustement chiffré d'avance. En cas de refus, des économies équivalentes doivent être votées.
- Ne pas compter sur des effets favorables incertains, comme la sortie plus rapide du chômage, parce qu'une promesse doit tenir sans eux.

### Ce que cela change pour vous

Par mois, une fois les efforts en place :

- Un salarié au Smic seul gagne 96 €. Un couple médian avec deux enfants gagne 641 €. Un retraité à 2 000 € de pension gagne 132 €.
- Un cadre à 10 000 € brut perd 187 €, un retraité à 4 000 € perd 243 €, un rentier de 5 000 € de dividendes nets perd 858 €.

### Ce que cela coûte ou rapporte

Avant toute mesure pour la dette, le système en régime a un déficit de 103 Md€ par an (169 en 2024). Les 33,3 Md€ de contributions et environ 14,8 Md€ d'économies de personnel (⚠️ À VÉRIFIER : somme reconstituée) le ramènent à environ 56 Md€, avant le coût des intérêts d'une dette plus lourde. Intérêts compris, le déficit reste au-dessus de 3 % du PIB jusqu'en 2057, contraire aux règles budgétaires européennes : nous l'écrivons. Si la croissance déçoit, la dette atteindrait 144 % en 2038 (médiane des tirages ; 143,4 % dans la valeur centrale du modèle). Si le taux d'intérêt reste à son niveau de novembre 2026 et monte avec la dette, elle atteindrait environ 146 % en 2038 au lieu de 131 %, et il faudrait environ 40 Md€ par an de plus pour la stabiliser (section « Le taux d'intérêt »).

---

## Ce que nous cherchons

Nous cherchons une dette qui cesse de grossir, non une dette que l'on rembourse à marche forcée. La première règle de ce chapitre est une règle de prudence : un système qui promet de rembourser vite promet aussi des impôts très hauts, et un gouvernement suivant les retirera. Nous visons donc la stabilité, et nous la mesurons en part du PIB.

Le point de départ est inconfortable. Le projet de loi de finances pour 2027 prévoit un déficit de 5,4 % du PIB en 2026 et de 5,0 % en 2027, une dette de 119,3 % puis 121,7 %, et une charge d'intérêts de 79,2 puis 91 Md€, soit 2,9 % du PIB[^hcfp]. Notre calcul démarre d'une dette de 123,5 % fin 2028, cohérente avec ce point de départ.

Une précision sur la méthode. Un modèle ne prédit pas. Il combine des hypothèses et montre ce qui en découle. Nous donnons trois jeux de croissance et de taux d'intérêt : prudent, de référence et favorable. Celui de référence n'est ni une moyenne ni une médiane, c'est le jeu que nous jugeons le plus probable. Tous les calculs sont reproductibles à partir du dépôt de code et en euros de 2026, à régime atteint sauf mention.

## Les dépenses : à peu près les mêmes, autrement

### Ce que nous ne disons pas

Nous ne disons pas que l'État coûte trop cher. Par habitant et en pouvoir d'achat, la France dépensait en 2024 22 380 unités de pouvoir d'achat, contre 22 928 pour l'Allemagne, 23 758 pour les Pays-Bas et 22 398 pour la Suède. L'écart de 57 % du PIB contre 49 % en Allemagne tient en grande partie à un PIB par habitant plus bas (39 294 contre 47 008)[^eurostat]. Le Fonds monétaire international et l'OCDE visent d'abord les retraites. Les écarts réels sont des transferts aux ménages : la vieillesse pèse 13,35 % du PIB contre 9,74 en Allemagne, soit 106 Md€ de plus.

Notre thèse est donc plus modeste, et selon nous plus solide : à richesse comparable, la France finance le même niveau de dépense, mais mal répartie (complexité, transferts croisés) et mal mesurée. Les économies de fonctionnement que nous chiffrons ne sont pas le cœur du financement.

### Ce que nous économisons

Les économies de personnel et de fonctionnement atteignent 24,4 Md€ par an nets dans le cas où un départ à la retraite sur quatre n'est pas remplacé, et 34,0 Md€ dans le scénario retenu, qui va à un départ sur deux. Ce sont des plafonds : certaines lignes ne produisent rien avant 2032, d'autres sont pleines en 2034 ou 2038.

| Famille | Poste | Md€ par an, net |
|---|---|---|
| Du fait du système | gestion de la collecte et des prestations, fin d'Urssaf comme collecteur | 3,0 |
| Démographie | éducation : 109 138 postes libérés par la baisse du nombre d'élèves | 3,9 |
| Choix de dépense | agences, collectivités, achats, supplément familial de traitement | 5,9 |
| Leviers de la dette (un départ sur quatre) | non-remplacement, point d'indice à moins 0,5 point des prix pendant quatre ans, 1 607 heures | 11,2 |
| Autres | fin des Jeux de 2024, informatique et IA | 0,3 |
| Total | | 24,4 |

Sur le scénario retenu, le non-remplacement d'un départ sur deux porte la ligne de personnel à 15,0 Md€ brut, et le cumul net à 34,0 Md€[^bilan]. Le système lui-même n'en porte que 3 Md€. Il concerne environ 47 600 postes sur environ 6 millions d'agents publics, qui sont ceux des caisses, des guichets et de la collecte séparée. Les seuls départs à la retraite en libèrent 38 200 en dix ans, et le reste passe par des reconversions : personne n'est licencié. Les deux tiers des économies viennent de décisions budgétaires que n'importe quel gouvernement peut prendre.

::: complet

Voici le détail des 24,4 Md€. La gestion de la collecte et des prestations 3,11 (2,89 net de recouvrement), Urssaf 0,15, éducation 3,86, agences 0,70, collectivités 0,40 (non-remplacement 4,5 moins 4,1 de recouvrement avec la ligne de personnel), achats des collectivités 3,50, supplément familial de traitement 1,34, non-remplacement d'un départ sur quatre (163 000 postes) 7,05, point d'indice 3,75, 1 607 heures 0,43 net, fin des Jeux 0,45, informatique et IA −0,11. Cumul brut 29,13 moins 4,72 de recouvrement. Pour le scénario retenu, le non-remplacement d'un départ sur deux (15,02 brut au lieu de 7,05) et 1,9 Md€ d'économies de fonctionnement de second niveau portent le cumul à 39,01 brut, 34,04 net après 4,97 de recouvrement. Les leviers de personnel de la dette (non-remplacement d'un départ sur deux, point d'indice, 1 607 heures, moins recouvrement, plus 0,15 d'Urssaf) valent environ 14,8 Md€ net (⚠️ À VÉRIFIER : somme reconstituée à partir de `decisions_0811.js` et du bilan, § 0000.2) ; les 2,35 Md€ d'économies de fonctionnement des niveaux 1 et 2 sont comptés dans les 33,3 Md€ de contributions[^bilan][^effectifs].

Le chiffre de 34,0 est un plafond. Le recouvrement entre non-remplacement, collectivités et gestion est borné, la ligne informatique de l'État-plateforme (2,1 Md€) est la plus fragile, car elle suppose une transition de l'ordre de 28 Md€ sur dix ans et des dépassements de 2 à 5 fois dans les grands projets informatiques (⚠️ non compté dans le cumul).

:::

## Les prélèvements : pourquoi ils montent

En régime, les prélèvements obligatoires représentent 51,6 % du PIB (1 514 Md€ dans le PIB de référence de 2 935 Md€), contre 42,7 % en 2024. En comptant les cotisations de complémentaire santé obligatoires, la hausse va de 44,2 % à 51,9 %. Un lecteur hostile citera cette lecture brute, et il aura raison de la citer. Voici ce qu'elle contient.

D'où viennent les neuf points ? Sur +8,9 points de prélèvements obligatoires, 3,9 servent à ramener le déficit de 169 à environ 56 Md€ par an en régime : il ne disparaît pas, il reste au-dessus de 3 % du PIB jusqu'en 2057, et la dette est stabilisée, pas remboursée. 5,7 points sont des versements aux ménages (le versement en bas de la courbe, les montants par enfant, le plancher) que nous écrivons en dépense, alors que le droit actuel les déduit des prélèvements sous forme d'allègements de cotisations (64,9 Md€ en 2024), de quotient familial et de crédits d'impôt : l'argent change d'écriture, pas de poche. Le reste, 1,2 point de santé et de dépenses nouvelles, est compensé par 1,9 point d'économies et de retraites.[^decompo]

| En % du PIB | Aujourd'hui | Système | Écart |
|---|---|---|---|
| Prélèvements obligatoires, mesure officielle | 42,7 | 51,6 | +8,9 |
| Prélèvements nets de ce que l'État reverse aux ménages (hors retraites) | 38,0 | 41,1 | +3,1 |
| Même mesure, à déficit inchangé | 38,0 | 37,3 | −0,7 |
| Tout ce que l'on paie par obligation (mutuelles, paiements réglementés, coût de la complexité compris), net des versements | 41,5 | 42,0 | +0,5 |
| Dépense publique hors versements aux ménages | 52,3 | 51,0 | −1,3 |

La dernière lecture est la plus fragile : elle suppose qu'une partie du coût de la complexité (24,5 Md€) disparaît avec les règles simples ; sans cette hypothèse, l'écart est de deux points. La plus solide est la deuxième : une fois retranché ce que l'État reverse, la hausse vient de ce que l'on cesse d'emprunter. Cette moyenne cache la répartition : un cadre à 10 000 € brut y perd 187 € par mois, un salarié au Smic gagne 96 €.

La Sécurité sociale à 100 % fait entrer dans les prélèvements 25,5 Md€ nets qui remplacent des cotisations de mutuelle payées jusqu'ici aux complémentaires, hors des comptes publics (chapitre 4). La taxe d'artificialisation ajoute 6,5 Md€ de recette, entièrement fléchés vers la renaturation de friches : le solde est nul, mais le prélèvement apparaît, soit 0,2 point de PIB. Les 33,3 Md€ de contributions pour la dette font le reste. La lecture nette des transferts, que nous préférons parce qu'elle mesure ce que paie réellement un ménage, avait donné dans une version antérieure +6,5 points au lieu de +9,9 : nous ne l'avons pas recalculée pour le système du 08/11 (⚠️ À VÉRIFIER).

Le chiffre d'« avant » et le chiffre d'« après » ne comparent pas des années comparables : « avant » est 2024 (comptes de l'Insee) et « après » est un régime atteint vers 2032 au plus tôt, en euros de 2024-2026 sans croissance[^bilan].

## Ce que nous demandons : le trou et les leviers

Sans aucune mesure pour la dette, le système en régime a un déficit de 103 Md€ par an (169 en 2024)[^bilan]. Une bonne part vient de décisions que nous avons prises, et que nous préférons nommer : la Sécurité sociale à 100 % (25,5 Md€ nets), l'exonération de l'épargne réglementée (8,8), la TVA de la restauration à 5 % (4,1), la formation regroupée (2,3), les crèches gardées (2,2). La TVA de l'alimentation à 5 % plutôt qu'à 0 % rend 7,2 Md€.

Le scénario retenu, que nous appelons S3, comporte quatre éléments. Le système bascule le 1er janvier 2028 sans rien prendre de plus la première année. Des leviers, votés d'avance dans la loi de bascule, montent seuls de 2029 à 2038. La dette cesse de monter ensuite. « Seuls » veut dire sans nouveau vote chaque année, pas sans vote : leur montant et leur calendrier sont dans la loi de bascule, que nous voulons soumettre au peuple (chapitre 8). Ce que nous refusons, c'est un prélèvement qui monterait au-delà de ce qui a été voté sans repasser par un vote ; c'est l'objet de la clause de dette, plus bas. Le point de départ est une dette de 123,5 % du PIB fin 2028.

| Levier, en régime | Md€ par an | Qui paie | Chapitre |
|---|---|---|---|
| Contribution sur les revenus, au-delà du paramètre de base | 1,41 | les actifs les mieux payés | 3 |
| Crédit d'impôt sur les sociétés à 50 % | 9,31 | les actionnaires | 3 |
| Héritages : abattement de 300 000 € et impôt de suite | 8,92 | les héritiers de plus d'1 M€ | 3 |
| Patrimoine : impôt de suite | 2,28 | les expatriés très fortunés | 3 |
| Courbe des pensions | 9,00 | 5,5 millions de retraités, au-dessus de 2 000 € | 5 |
| Économies de fonctionnement | 2,35 | l'État | |
| Total | 33,27 | | |

Le taux de l'euro marginal tout en haut de la contribution sur les revenus, que nous appelons le taux du haut (le paramètre a du chapitre 3), vaut 0,6515 en régime, soit 65,15 %[^res0811]. Il a baissé (0,6733 avant la correction du 08/11 au soir) parce que le report d'encaissement de la contribution sur le patrimoine était compté deux fois dans la trajectoire : en ne gardant qu'une écriture, la règle de dette demande 19,5 Md€ de moins, et la contribution sur les revenus ne porte presque plus rien au-delà du paramètre de base.

### Les 2,11 Md€ de la vieillesse

Les 9 Md€ de la courbe des pensions ne couvrent pas tout ce que nous demandons à la vieillesse. Le besoin est de 4,84 Md€ : 4,10 pour le grand âge (hébergement 3,2, aide à domicile 0,9) et 0,74 pour la fin de la sous-indexation des hautes pensions. La hausse de la courbe, de 6,27 à 9,00, en apporte 2,73. Il manque 2,11 Md€, que la règle de dette demande à la contribution sur les revenus des actifs. Nous avions voulu que le grand âge soit financé par la vieillesse ; il ne l'est qu'en partie, et nous le disons. Pour tout couvrir par la courbe seule, il faudrait la relever à environ 11,1 Md€, avec un taux marginal de 52 % : nous avons jugé que c'était trop demander aux retraités les mieux dotés, au-dessus des 42 % que nous nous sommes fixés comme limite[^res0811].

## La trajectoire de la dette

| Année | 2028 | 2029 | 2033 | 2037 | 2038 | 2043 | 2048 | 2058 |
|---|---|---|---|---|---|---|---|---|
| Dette en % du PIB, avec nos leviers (valeur centrale du modèle) | 123,5 | 125,0 | 128,9 | 130,4 | 130,4 | 130,3 | 129,5 | 124,6 |
| Déficit en % du PIB | | 5,0 | 4,6 | 3,9 | 3,7 | 3,8 | 3,5 | 2,9 |
| Dette avec le droit actuel | | | | | 157,1 | | | 240,2 |

Dans la valeur centrale du modèle, la dette culmine à 130,4 % en 2037, puis redescend très lentement (124,6 % en 2058). Le déficit reste au-dessus de 3 % jusqu'en 2057[^res0811][^tdb]. Quand nous comparons notre système aux autres programmes (chapitre 15), nous citons la médiane de 10 000 tirages, qui fait varier chaque module à ses bornes : 131 % en 2038 (intervalle à 80 % : 118 à 143 %) et 122 % en 2058 (63 à 176 %)[^banc]. Les deux lectures supposent un taux d'intérêt fixe de 3,45 % ; la section « Le taux d'intérêt », plus bas, donne la lecture au taux d'aujourd'hui.

Deux remarques d'honnêteté. La première : la dette ne baisse pas assez vite pour respecter les règles budgétaires de l'Union, qui exigeraient, d'après notre dossier de travail, qu'une dette supérieure à 90 % du PIB baisse d'un point par an en moyenne (⚠️ À VÉRIFIER), et qui fixent un plafond de déficit à 3 %. Nous serions exposés à une procédure pour déficit excessif jusqu'en 2057. Respecter strictement ces règles demanderait davantage de leviers que les 33,3 Md€ ; nous ne l'avons pas chiffré pour le système du 08/11 (⚠️ À VÉRIFIER)[^ue].

La seconde remarque porte sur les taux. Toute cette trajectoire est calculée avec un taux d'emprunt fixe de 3,45 %. Les taux de marché sont plus hauts : l'adjudication du 3 septembre 2026 s'est faite à 4,23 %, et en novembre 2026 l'emprunt d'État à dix ans se situe autour de 4,7 %, la valeur que retient notre modèle de taux[^taux]. Ces deux niveaux dépassent aussi notre hypothèse prudente (3,95 %). La section « Le taux d'intérêt », plus bas, dit ce que cela change.

## La clause de dette : une votation, pas un automatisme

La loi de bascule fixe d'avance une trajectoire de dette, celle du tableau ci-dessus. Chaque année, on compare la dette réelle à cette trajectoire. Si l'écart dépasse 2 points de PIB, une votation obligatoire est déclenchée. Le texte soumis au vote contient un ajustement déjà chiffré : une hausse de la contribution sur les revenus et de la courbe des pensions, de 0,5 × le PIB × l'écart, au plus 8 Md€ par an, la courbe des pensions étant plafonnée à un coefficient de 0,50 (au plus +1,77 Md€). L'ajustement s'éteint dès que la dette repasse sous la trajectoire. Si le peuple refuse, il doit voter des économies équivalentes : la loi fixe les impôts (article 34 de la Constitution), et un prélèvement ne peut pas s'imposer sans un vote.

Pourquoi une votation, et non un automatisme ? Parce que ce serait contraire à ce que nous défendons : le peuple décide de l'effort. La règle est connue d'avance, ce qui évite le vote du dernier moment sous la pression des marchés, et le choix est restitué à ceux qui paient. On nous objectera que les leviers de la loi de bascule montent seuls de 2029 à 2038. C'est vrai, et c'est une tension que nous nommons : ils montent sans nouveau vote, mais ils ont été votés une fois, avec leur montant et leur calendrier, et un vote suivant peut les défaire. La clause, elle, porterait sur un effort que personne n'a encore voté : c'est pourquoi elle passe par la votation.

Voici ce que cela donnerait dans l'hypothèse prudente, où la croissance déçoit, si l'ajustement était accepté. Le levier ajouté monterait de 8 Md€ par an jusqu'à un pic de 52,3 Md€ en 2036, puis redescendrait vers 37,8 Md€, où il se stabiliserait : 36,1 sur les actifs et 1,8 sur les pensions. Le taux du haut passerait de 0,6515 à 0,6925 en niveau stable, et à 0,7103 au pic. Le cadre à 10 000 € brut perdrait 709 € par mois en niveau stable et 935 € au pic, au lieu de 187 €. La dette atteindrait 132,9 % en 2038 et 127,2 % en 2058, au lieu de 143,4 % et 169,3 % sans clause (valeurs centrales du modèle ; sans clause, la médiane des tirages est de 144 % en 2038 et 166 % en 2058, entre 100 et 227 %). L'écart maximal à la trajectoire serait de 4,3 points. La clause arrête la dérive sans ramener la dette sur la trajectoire.

La meilleure objection est que le peuple refusera toujours l'effort, et que la clause ne servira à rien. Notre réponse a deux parties : il aura à choisir entre un prélèvement chiffré et des économies équivalentes, et non entre un prélèvement et rien ; et un vote obligatoire sur la dette, avec une alternative chiffrée, est à notre connaissance inédit. Nous ne savons pas si elle tiendra : aucun pays n'a testé un vote obligatoire sur sa trajectoire de dette (⚠️ À VÉRIFIER : à documenter, les mécanismes suisses de frein à l'endettement ne sont pas les mêmes).

::: complet

Pour la clause, on note e l'écart entre la dette et la trajectoire votée, en points de PIB. Si e > 2 points, le levier cible vaut L = 0,5 × PIB × e (PIB constant à 2 935 Md€ dans le calcul), et sa variation annuelle est bornée à 8 Md€ (0,27 point de PIB) dans les deux sens ; il s'éteint quand e ≤ 0. La part des retraités est proportionnelle aux recettes (environ 30 %) mais plafonnée par un coefficient de courbe de 0,50. Calcul en hypothèse prudente : levier par année de 2029 à 2058 : 0, 8, 16, 24, 32, 40, 48, 52, 44, 39, 37 puis 37 à 38. Un pas de 4 Md€ au lieu de 8 laisserait l'écart monter à 6,8 points ; un pas de 10 Md€ le limiterait à 3,9 points avec un pic de 50 Md€ (⚠️ V30010). Le calibrage proposé (seuil de 2 points, pas de 8 Md€, gain de 0,5, plafond de 0,50 sur les pensions) est un choix de conception[^res0811].

:::

## Ce que nous ne comptons pas

Voici ce qui pourrait nous être favorable, et que nous ne mettons pas dans le calcul.

La première réserve est le comportement des chômeurs. La garantie de transition est plus courte que l'assurance chômage, ce qui devrait accélérer le retour à l'emploi. Si on le comptait, les recettes augmenteraient de 5,9 Md€ (entre 1,9 et 13,7) : les leviers nécessaires passeraient de 33,3 à 27,3 Md€, le taux du haut de 0,6515 à 0,6450, la dette de 2038 à 129,4 %. L'élasticité qui le fonde, 0,27, est une estimation de qualité moyenne, et une part de l'allongement du chômage tient à la liquidité (avoir de quoi chercher)[^garantie]. Nous ne le comptons pas.

La deuxième est le temps rendu. Si l'industrie de la complexité, dont les déclarations, les formulaires et les montages mobilisent des centaines de milliers de personnes, retrouve ce temps, nous estimons à environ 260 000 équivalents temps plein libérés (de 107 000 à 479 000), dont 180 000 dans le temps interne des entreprises, pour un gain de PIB de l'ordre de 12 Md€ et des recettes de 4 Md€[^complexite]. Ce n'est pas dans le calcul. Les économies de gestion des complémentaires de santé (3,7 à 6,2 Md€, chapitre 4) baissent les cotisations des ménages sans améliorer le solde public.

La troisième est l'entreprise publique de technologie (chapitres 11 et 16). Nous comptons son coût, pas ses recettes : 3 Md€ par an de dépense, pris sur le crédit d'impôt recherche réorienté, sont dans la trajectoire de dette[^eip-bilan]. Si elle réussit, elle rapportera de quoi alléger encore les contributions, et ce gain n'est pas dans nos chiffres. Si elle échoue, elle aura coûté de l'argent : selon notre modèle de l'entreprise, de 7 à 10 Md€ au total si tout s'arrête au second jalon, et de 29 à 38 Md€ sur trente ans si des séries sont lancées sans trouver leur marge[^eip]. Le même modèle donne un coût public net moyen de 1,1 à 3,8 Md€ par an sur les dix premières années selon le scénario, avec une année de pointe à 3,7 Md€ au central et 7,9 Md€ au scénario ambitieux : proche des 3 Md€ comptés en moyenne, au-dessus certaines années.

## Ce qui peut jouer contre nous

Ce qui suit est plus important que ce qui précède.

### La croissance

Notre référence suppose une croissance de 1,2 % réelle plus 1,8 % d'inflation, et un taux d'emprunt de 3,45 %. Le programme officiel de stabilité retient une croissance potentielle de 1,2 % en 2027-2028 puis 1,0 % en 2029, et une inflation de 1,6 à 1,75 % ; le Haut Conseil des finances publiques juge la croissance de 1,0 % de 2027 optimiste[^hcfp][^tresor]. Notre hypothèse prudente (0,9 % réelle plus 1,6 %, taux de 3,95 %) est donc plus proche du programme officiel que la nôtre de référence. Elle n'est pas pessimiste.

Dans cette hypothèse, avec les mêmes leviers, la dette ne se stabilise pas : 143,4 % du PIB en 2038 et 169,3 % en 2058 dans la valeur centrale du modèle (médiane des tirages : 144 % et 166 %, avec en 2058 un intervalle de 100 à 227 %)[^banc]. Pour respecter la même règle, il faudrait 71,2 Md€ de leviers au lieu de 33,3, un taux du haut de 0,6947, et un cadre à 10 000 € brut qui perdrait 737 € par mois (−11,8 %). C'est ce que la clause de dette doit traiter, par un vote, et non en cachette.

### Le taux d'intérêt

Tous nos chiffres de dette, comme ceux des autres programmes au chapitre 15, supposent un taux d'emprunt fixe de 3,45 %, qui ne réagit ni à la dette ni au déficit. C'est une hypothèse favorable : en novembre 2026, l'emprunt d'État à dix ans se situe autour de 4,7 %, et les études mesurent que la prime demandée à un État monte avec sa dette. Nous avons donc refait le calcul avec un modèle où le taux part de 4,7 % et monte avec la dette et le déficit[^taux].

Voici la seconde lecture, à côté de la première. À 3,45 % fixe, notre dette se situe vers 131 % en 2038. Au taux d'aujourd'hui, avec un taux qui suit la dette, elle atteint environ 146 % en 2038 (entre 131 et 161 %), et le programme entre en zone de crise (une prime de risque de plus de 3 points) avant 2058 dans deux tirages sur trois si rien n'est ajouté. Pour stabiliser la dette dans ce cas, il manque environ 40 Md€ par an d'effort (de 37 à 44 selon la sensibilité des marchés). Le modèle applique la même règle aux autres programmes : il leur manque bien davantage (chapitre 15).

Où trouver ces 40 Md€ par an ? C'est un point ouvert, que l'auteur n'a pas encore tranché. Trois voies existent : l'impôt (une hausse de 0,01 du taux du haut rapporte de l'ordre de 9 Md€ par an, il faudrait donc le porter d'environ 0,65 à environ 0,70, chapitre 3), des économies qu'il faudrait nommer, ou un programme plus petit. Nous le disons plutôt que de le cacher : au taux d'aujourd'hui, notre système ne boucle pas encore. Et ce n'est pas le seul poste qui manque (section suivante).

### Ce qui n'est pas encore dans les comptes

La trajectoire de dette de ce chapitre ne contient pas tout ce que le manifeste propose. Voici ce qui manque, poste par poste, pour que personne ne croie le programme plus financé qu'il ne l'est.

- **Le taux qui suit la dette** : environ 40 Md€ par an (de 37 à 44), section précédente[^taux].
- **Le capital de départ** (chapitre 3 et chapitre 16) : il figure au bilan, mais il a été retiré de la trajectoire de dette lors du passage aux deux fonctions[^bilan-cd]. Il coûte de l'ordre de 15 Md€ par an dans sa version en argent (14,7 au central), et de l'ordre de 9 à 11 Md€ sous sa forme d'apport dans un logement, selon le réglage à l'étude (9,3 au réglage recommandé du modèle des options, 10,7 au central du modèle de la foncière)[^cd]. Les héritages n'en paient qu'une partie : leur refonte rapporte 4,3 Md€ de plus qu'aujourd'hui, environ 8,9 avec l'impôt de suite, et cette recette sert déjà aux leviers de la dette. Le reste est à financer ; le remettre dans la trajectoire demanderait de l'ordre de 1,6 point de taux du haut (⚠️ À VÉRIFIER, chapitre 3).
- **La formation des rénovateurs, l'installation agricole et les repas à prix coûtant** (chapitre 16) : environ 2,6 Md€ par an (2,0 de formation, 0,55 d'installation, 0,06 de repas), d'après un modèle relu par un seul lecteur[^batisseurs].
- **L'entreprise publique au-delà des 3 Md€ comptés** : rien en moyenne au central, mais jusqu'à environ 5 Md€ de plus les années de pointe du scénario ambitieux[^eip].
- **La dette de la foncière du logement** : sans plafond d'entrées, de l'ordre de 530 Md€ à trente ans ; elle resterait hors de la dette publique seulement si ses recettes couvrent la moitié de ses coûts, ce que le modèle ne trouve pas sans un prix du droit d'habiter plus haut ou une marge de taux (chapitre 16).

Additionnés, les postes chiffrés dépassent 50 Md€ par an, plus de 1,7 point de PIB. Comment les financer (impôt, économies, programme plus petit) est un point ouvert, que l'auteur n'a pas tranché.

### Les départs de grands patrimoines

Le modèle suppose des réactions. Pour les héritages, la fuite totale (déclaration et exil) est de 18 %, 33 % ou 52 % du flux selon l'hypothèse. Pour le patrimoine, 59 % du capital mobile du 1 % le plus riche s'érode, et la recette nette ne vaut que 57 % du montant dû[^v75]. Les exils mesurés en France sont petits (environ 950 foyers par an de 2011 à 2016, 370 retours), et la majeure partie de la fuite est déclarative, non géographique. Mais aucune étude ne mesure la réaction à un taux national de 50 % sur les héritages ou de 3 % sur le patrimoine[^exil]. Sur la fonction du patrimoine, le module ne calcule pas de fourchette basse ou haute : c'est une valeur unique (⚠️ V16902). La recette du patrimoine (62,5 Md€) comprend 26 Md€ différés, encaissés à la vente ou à la succession : la trésorerie de l'année est de 36,6 Md€.

### Les économies à réaliser

Les 34,0 Md€ sont un plafond. Les coûts de transition ne sont pas dans le solde de croisière : la fusion des collectivités coûterait de 1 à 3 Md€ une fois, l'outil numérique de la justice de 0,3 à 1 Md€[^chiffrage0811]. Le bouclier de transition de la contribution sur le patrimoine coûterait environ 3,4 Md€ la première année. Le surcoût du grand âge croît avec le vieillissement (21,9 Md€ de dépense nette en 2023, 32,7 en 2040 dans le modèle), et nous l'avons calculé sur les résidents de 2023 : il n'est pas intégré (⚠️ V30001). Le non-remplacement est un levier que l'on peut défaire : un gouvernement suivant le retire en un budget, et c'est la limite de tout plan fondé sur des économies de personnel.

### Les lignes récentes

Les lignes ajoutées le 07/11 au soir et le 08/11 (grand âge, TVA des autres taux, conversions en salaire, plancher en deux parts, outre-mer, collectivités, justice, protection de l'enfance, enveloppe pour imprévus, artificialisation, retenue sur les détenus) pèsent −0,93 Md€ au solde dans l'hypothèse de référence, entre +3,09 et −14,76 aux bornes. Avec les décisions du 07/11 (garantie de transition, pont, crèches, capitaux mobiliers), le total est de −3,17 Md€. Aux bornes, il faudrait de 29,2 à 47,3 Md€ de leviers, avec un taux du haut de 0,6471 à 0,6670. La garantie de transition, si elle coûtait autant que l'assurance chômage actuelle, demanderait 66,0 Md€ de leviers et un taux du haut de 0,6886 (calcul du 08/11, après correction du report d'encaissement)[^res0811].

::: complet

Bornes de chaque ligne en Md€ par an (favorable, référence, défavorable ; positif améliore le solde) : collectivités +3,0 / +1,5 / +0,5 ; justice −0,74 / −1,09 / −1,35 ; protection de l'enfance −1,3 / −2,5 / −3,8 ; imprévus −0,3 / −0,8 / −1,8 ; retenue sur les détenus +0,2 / +0,1 / +0,05 ; artificialisation +3,1 / +6,5 / +10,3, entièrement fléchée vers la renaturation. Grand âge −1,0 / −3,2 / −6,5 (hébergement) et −0,9 (domicile). TVA des autres taux +0,02 / −0,10 / −0,22. Conversion en salaire (mutuelle, transport) 0 / +4,2 / 0,0 à 1,2. Plancher en deux parts +2,67 / +1,88 / +0,69. Coefficient de lieu −0,09 / −0,18 / −0,34. Outre-mer : sur-rémunérations +1,5 / +1,5 / +0,75 et prix alimentaires −1,13 / −1,34 / −1,85[^res0811][^chiffrage0811].

Les chiffres des collectivités, de la justice, de l'enfance et des imprévus reposent sur des hypothèses que nous marquons : régions (25 Md€ de fonctionnement supposés), coût chargé d'un magistrat (90 000 €) et d'un greffier (50 000 €), jeunes majeurs suivis (10 000 € par an chacun), enveloppe d'imprévus (0,5 à 2,0 Md€ brut). Chaque hypothèse est à remplacer par une donnée publiée avant la version finale (liste dans `sources/chiffrage-decisions-0811.md`).

:::

## Qui gagne et qui perd

Les montants sont des écarts au droit actuel, en euros par mois, une fois les leviers montés, en « revenu net santé » : le revenu disponible, moins la mutuelle payée par le ménage[^cas].

| Ménage | Aujourd'hui | Écart |
|---|---|---|
| Célibataire au Smic | 1 674 | +96 (+5,8 %) |
| Couple, deux Smic, deux enfants | 3 457 | +170 (+4,9 %) |
| Couple médian, deux enfants | 4 307 | +641 (+14,9 %) |
| Cadre seul, 5 000 € brut | 3 384 | +147 (+4,4 %) |
| Cadre seul, 10 000 € brut | 6 230 | −187 (−3,0 %) |
| Cadre seul, 20 000 € brut | 10 995 | −78 (−0,7 %) |
| Retraité, 1 200 € | 1 068 | +132 (+12,3 %) |
| Retraité, 2 000 € | 1 868 | +132 (+7,0 %) |
| Retraité, 2 500 € | 2 368 | +100 (+4,2 %) |
| Retraité, 3 000 € | 2 868 | +19 (+0,7 %) |
| Retraité, 4 000 € | 3 868 | −243 (−6,3 %) |
| Retraité, 6 000 € | 5 868 | −957 (−16,3 %) |
| Rentier, 5 000 € de dividendes nets par mois | 3 430 | −858 (−25,0 %) |

Un retraité commence à perdre à partir de 3 090 € de pension. Le rentier perd parce que le système ne crédite que la moitié de l'impôt sur les sociétés et que son capital n'ouvre aucun droit social (chapitre 3).

Prenons deux situations identiques dans l'ancien et dans le nouveau système. Un couple de deux salariés médians avec deux enfants garde aujourd'hui 4 307 € par mois, une fois la mutuelle payée. Demain, il en garde 4 948 : il ne paie plus de cotisations ni d'impôt sur le revenu, il paie la contribution, et chaque enfant lui rapporte 200 €. Un cadre seul à 10 000 € brut garde 6 230 € aujourd'hui, et 6 043 € demain, dans notre référence ; dans l'hypothèse prudente, avec le même système et l'ajustement voté, il en garderait entre 5 521 et 5 295.

Trois limites. La première : nous n'avons pas recalculé la répartition par dixième de la population pour le système du 08/11, seulement des cas types (⚠️ À VÉRIFIER). La deuxième : les cas types sont des célibataires sans enfant pour les cadres et des retraités de 70 ans sans capital (⚠️ V19110) : un retraité avec un patrimoine important est dans un autre cas. La troisième : les cas salariés ne comptent pas la garantie de transition ni la TVA, que l'on connaît par ailleurs.

## Les meilleures objections

« Vos chiffres sont trop beaux, parce qu'une intelligence artificielle ne sait pas dire non. » Elle sait dire ce qu'elle trouve, et elle a un conflit d'intérêts que nous déclarons : un système conçu pour tenir est consolidé par un outil qui est exposé à vouloir le faire tenir. Le bilan contient des tests qui échouent si ses totaux s'écartent de leur référence au-delà d'une tolérance de 0,05 Md€, et les hypothèses défavorables sont affichées à côté des hypothèses de référence. Vous pouvez refaire chaque chiffre : le code est dans `sources/calculs/bilan_global.py` et `modeles/systeme-ideal/`.

« Vous prélevez près de 9 points de PIB de plus. » Nous prélevons davantage, nous l'avons dit, et il faut distinguer ce qui est un changement de comptabilité de ce qui est un effort réel. Le système fait payer ceux qui échappaient à l'impôt et ceux qui ont le plus, et il rend à ceux qui ont le moins.

« L'Union européenne vous mettra en procédure. » Peut-être. Nous serions au-dessus de 3 % de déficit jusqu'en 2057, et nous ne croyons pas que le chemin soit simple. Nous préférons le dire.

## Contraintes juridiques

Les règles budgétaires de l'Union (traité sur le fonctionnement de l'Union européenne, protocole sur la procédure de déficit excessif, règlement (UE) 2024/1263 sur la gouvernance économique) fixent un plafond de déficit de 3 % du PIB et un objectif de dette de 60 % (⚠️ À VÉRIFIER : textes non relus, repris d'un dossier de travail)[^ue]. La loi fixe seule l'assiette et le taux des impositions (article 34 de la Constitution), ce qui interdit qu'une clause fasse monter un prélèvement sans vote : c'est le motif de la votation. Le vote du budget relève aujourd'hui du Parlement (article 47) ; la votation que nous proposons suppose une révision de la Constitution (chapitre 8) et ne peut s'appliquer qu'une fois celle-ci faite (⚠️ À VÉRIFIER : analyse juridique à faire). Le repère de 75 % de prélèvement marginal que la jurisprudence constitutionnelle laisse apparaître ne doit pas être dépassé : notre taux du haut est de 65,15 % en régime, et de 71,0 % au pic de la clause en hypothèse prudente, sous ce repère (chapitre 3)[^cc2012]. Il y a une exception, que nous ne cachons pas : sur un dividende, l'impôt sur les sociétés déjà payé s'ajoute à la contribution, dont il n'est crédité qu'à moitié, et le cumul atteint environ 77,7 %, au-dessus du repère (chapitre 13) ; il monterait encore si la clause relevait le taux du haut. Faut-il baisser ce cumul sous 75 % ou le publier tel quel, en l'argumentant ? C'est un point ouvert, que l'auteur n'a pas tranché.

## État de la recherche

Ce qui est établi. À richesse comparable, la dépense publique française est proche de celle de ses voisins riches, et le gisement d'économies de fonctionnement est mince : les gisements documentés représentent moins de 1 % de la dépense à dix ans[^eurostat][^bilan]. Les règles budgétaires qui lient la dette, la croissance et le taux d'intérêt sont de l'arithmétique : une dette est stable si le déficit vaut sa part de PIB multipliée par la croissance nominale, divisée par un plus cette croissance[^dette]. Les fusions d'organismes ont rapporté peu : les fusions de 2015 à 2019 n'ont retiré que 0,8 % des emplois selon la Cour des comptes citée par le Sénat[^effectifs].

Ce qui est débattu. La croissance de long terme de la France et le niveau des taux ; la part de la hausse des prélèvements qui est comptable ou réelle ; la réaction des grandes fortunes à un impôt national.

Ce qui manque. Aucune mesure de la réaction à un vote obligatoire sur la trajectoire de dette ; aucune projection par dixième de la population du système du 08/11 ; peu de données sur l'efficacité réelle des fusions et des reconversions dans la fonction publique.

## Synthèse des sources mobilisées

| Source | Ce qu'elle établit | Cote, conflit d'intérêts |
|---|---|---|
| Haut Conseil des finances publiques, avis n° 2026-5 | déficit 5,4 % en 2026, 5,0 % en 2027, dette 119,3 puis 121,7 % | A, institution indépendante |
| Trésor, rapport d'avancement annuel 2026 | croissance potentielle, inflation | A, administration qui présente ses propres hypothèses |
| Eurostat, dépenses des administrations publiques par fonction (2024) | niveau comparé de la dépense | A |
| Insee, comptes nationaux | prélèvements obligatoires 2024 | A |
| Modèle du projet (`bilan_global.py`, `decisions_0811.js`, `correction_0811.js`) | leviers, trajectoire, clause, cas types | B à C, rédigé par une IA, risque de complaisance déclaré |
| Dossiers `chiffrage-dette-stable-retraites-masse-salariale`, `economies-benchmark-europeen`, `economies-fonctionnement`, `exil-patrimoines-preuves`, `chiffrage-decisions-0811` | hypothèses macro, économies, exil, lignes récentes | B à C, voir chaque note |
| France Stratégie, CAE, NBER 32153 | exils, héritages | A |

## Notes

[^hcfp]: Haut Conseil des finances publiques, avis n° 2026-5 du 25/09/2026 sur le PLF et le PLFSS 2027 (§ 92, 113, 115 ; croissance de 1,0 % en 2027 jugée optimiste), http://www.hcfp.fr/sites/default/files/2026-10/Avis%20HCFP%202026-5%20-%20PLF-PLFSS%202027.pdf ; consulté le 05/11/2026. Cote A. Aucun conflit d'intérêts connu.
[^tresor]: Direction générale du Trésor, rapport d'avancement annuel 2026 (tableau 2, p. 20), https://www.tresor.economie.gouv.fr/Articles/b16f3103-ed47-4c37-9362-11ff01e12ae5/files/1d29351b-0187-4837-a3cd-e4ea7b0e4ce1 ; consulté le 05/11/2026. Cote A. Conflit d'intérêts : l'administration présente les hypothèses du gouvernement. L'adjudication du 03/09/2026 à 4,23 % vient de la presse (cote C, ⚠️ V9806).
[^eurostat]: Eurostat, dépenses des administrations publiques par fonction COFOG (`gov_10a_exp`, 2024), https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp ; calcul `sources/economies-benchmark-europeen.md` et `sources/calculs/economies_benchmark_europeen.py` ; consulté le 03/11/2026. Cote A pour les données, B pour le calcul. `sources/economies-depense-publique.md` (gisements documentés inférieurs à 1 % de la dépense à dix ans) ; FMI, déclaration de fin de mission de l'article IV pour la France, 21/05/2026, https://www.imf.org/en/news/articles/2026/05/21/mcs-052126-france-staff-concluding-statement-of-the-2026-article-iv-mission, cote A.
[^bilan]: document de travail de l'atelier, non publié, code `sources/calculs/bilan_global.py` (« Tests : tous passés »), 07 et 08/11/2026. Cote B, estimations du projet. Rédigé par Claude (Anthropic) : conflit d'intérêts déclaré, une IA qui consolide un système conçu pour tenir est exposée à la complaisance.
[^res0811]: `modeles/systeme-ideal/resultats_correction_0811.txt` (code `correction_0811.js`, 33 vérifications : double compte du report d'encaissement retiré, V32012 et V32018, plafond des transmissions à 50 %) et `resultats_decisions_0811.txt` (code `decisions_0811.js`, 45 vérifications), 08/11/2026 : leviers, trajectoire, clause, cas types, bornes. Le remboursement étalé du différé (stock remboursé de 1/12 par an) est une hypothèse de modélisation. Cote B à C selon les lignes. Même conflit d'intérêts déclaré.
[^tdb]: document de travail de l'atelier, non publié : dette 2038 et 2058, déficit au-dessus de 3 % jusqu'en 2057, droit actuel à 157,1 % et 240,2 %. Cote B. Même conflit d'intérêts déclaré.
[^ue]: `sources/chiffrage-dette-stable-retraites-masse-salariale.md` § 0 et 3.2 (05/11/2026) : règlement (UE) 2024/1263, art. 7, et traité de l'Union ; textes cités d'après le dossier, non relus (⚠️ À VÉRIFIER). Cote B.
[^dette]: `sources/chiffrage-dette-stable-retraites-masse-salariale.md` § 1 (formule du déficit stabilisant d × g / (1 + g), sensibilité aux taux), 05/11/2026, calculé sur la version précédente du modèle (v5.10) et non recalculé. Cote B.
[^effectifs]: `modeles/grand-livre/agents-publics.md` § 5 (47 600 postes sur environ 6 millions d'agents) et `sources/economies-fonctionnement.md` (06/11/2026) ; Sénat, rapport n° 807 sur les opérateurs (fusions de 2015 à 2019, citant la Cour des comptes), lu par le dossier. Cote B. ⚠️ V18503 : rapprochement avec D16 probable, non prouvé.
[^complexite]: `sources/chiffrage-reorientation-complexite.md` (05/11/2026, modèle `modeles/industrie-complexite/`) : 260 000 équivalents temps plein (107 000 à 479 000), reconversion de 0,8 à 5,5 Md€ selon la rapidité de la bascule. Cote B à C. Estimation non comptée dans le calcul.
[^garantie]: `sources/garantie-transition.md` § 3 et 12 (07/11/2026) : comportement, élasticités ; CAE, note n° 90, https://cae-eco.fr/static/pdf/CAE090_Assurance-chomage_260414.pdf ; consulté le 05/11/2026. Cote B pour le dossier, A pour le CAE (organisme public, recommandations assumées).
[^v75]: `sources/fonction-patrimoine-v75.md` § 0 (06/11/2026) : différé de 26,0 Md€, érosion de 59 % du capital mobile du 1 % à 3 %, recette nette de 57 % du dû statique ; encours différé de la version précédente (149 Md€, 5,1 % du PIB) non recalculé. Cote B.
[^exil]: `sources/exil-patrimoines-preuves.md` (03/11/2026) : France Stratégie, rapport final du Comité d'évaluation des réformes de la fiscalité du capital, octobre 2023, https://www.strategie.gouv.fr/sites/strategie.gouv.fr/files/atoms/files/fs-2023-rapport-isf-quatrieme_rapport_complet_17octobre_avis.pdf ; CAE, note n° 69, https://cae-eco.fr/static/pdf/cae-note069.pdf ; Jakobsen et al., NBER 32153, https://www.nber.org/papers/w32153 ; consultés le 03/11/2026. Cote A pour les études, C pour la fourchette de fuite (combinaison d'ancrages du projet).
[^chiffrage0811]: `sources/chiffrage-decisions-0811.md` (08/11/2026) : DGCL/OFGL, BIS n° 212 (départements, 2025) ; CEPEJ 2024 (données 2022) ; DREES, Dossier n° 138 (30/06/2026) ; Cerema (artificialisation). Cote A pour les données, C pour les hypothèses d'estimation.
[^cas]: `sources/cas-types-nets-sante.md` et `modeles/systeme-ideal/cas_types_nets_0611.js` ; droit actuel calculé avec OpenFisca-France 2026 ; consulté le 06/11/2026. Cote B. Même conflit d'intérêts déclaré.
[^cc2012]: Conseil constitutionnel, décision n° 2012-662 DC du 29 décembre 2012, https://www.conseil-constitutionnel.fr/decision/2012/2012662DC.htm ; consulté le 05/11/2026. Cote A. Le repère de 75 % est une lecture de la jurisprudence, pas un seuil écrit (⚠️ V13800).
[^decompo]: `sources/decomposition-prelevements-0811.md` et `sources/calculs/decomposition_prelevements_0811.py` (08/11/2026, « Tests : tous passés ») : identité comptable reconstruite ligne par ligne, reste nul ; fragilités au § 7 (versements comptés en brut non tous isolés, revenu disponible des ménages à vérifier, disparition d'une partie du coût de la complexité). Estimation cote B. Conflit d'intérêts : modèle de l'auteur et d'une IA.
[^banc]: Banc d'essai des programmes, [page du modèle](https://langagement-politique.vercel.app/fr/modeles/banc-programmes/) (résultats générés le 09/11/2026, 10 000 tirages), § 1 (médianes et intervalles à 80 % : dette 2038 de 131 % [118 ; 143], 2058 de 122 % [63 ; 176] ; macro prudente 144 % [130 ; 157] et 166 % [100 ; 227]) et § 4 (valeur centrale du modèle : 130,35 % et 124,60 % ; prudente 143,36 % et 169,30 %). Cote B, estimations ; l'intervalle de notre système est sous-estimé (chapitre 15). Conflit d'intérêts : le même moteur chiffre notre système et ses concurrents.
[^taux]: Modèle du taux qui suit la dette, [page du modèle](https://langagement-politique.vercel.app/fr/modeles/taux-endogene/) (résultats du 09/11/2026), § 2 : notre système, taux de départ 4,7 % (taux allemand de 3,4 % plus une prime de 1,3 point, hypothèses H-TE1 et H-TE2), prime fonction de la dette et du déficit ; dette 2038 de 145,9 % [130,8 ; 161,3] contre 130,6 % à 3,45 % fixe ; zone de crise avant 2058 dans 67 % des tirages ; effort supplémentaire qui stabilise la dette de 2038 à 2058 : 40 Md€ par an (37 à taux fixe de 4,7 %, 44 avec des marchés plus réactifs). Le taux de 4,7 % est une hypothèse centrale calée sur septembre et octobre 2026 ; l'emprunt à dix ans cotait environ 4,8 % le 09/11/2026 (presse financière, cote C). Cote B, estimations sous hypothèses. Effet de 0,01 du taux du haut : chapitre 3. Conflit d'intérêts : modèle écrit par Claude (Anthropic) pour l'auteur.
[^bilan-cd]: Bilan global du projet : ligne N26 (capital de départ, +14,7 Md€ de dépense) et ligne F25 (« capital de départ retiré (hors plan A) », −14,72 Md€) ; code du modèle du système (`bareme_deux_fonctions_v7.js`, paramètre `capitalDepart510`, « hors du plan A »). Les versions du 07 et du 08/11/2026 reposent sur ces fichiers. Cote B.
[^cd]: Capital de départ : chapitre 3 (14,7 Md€, de 13,3 à 16,1, version en argent) ; [modèle des options du capital de départ](https://langagement-politique.vercel.app/fr/modeles/capital-de-depart-options/) (9,3 Md€ au réglage recommandé) ; [modèle de l'afflux vers la foncière](https://langagement-politique.vercel.app/fr/modeles/fonciere-afflux/), § 6.2 (10,7 Md€ au central : 6,6 d'apport, 4,0 de parts à vie). Héritages : chapitre 3 (+4,3 Md€ nets, environ 8,9 avec l'impôt de suite). Cote B à C, hypothèses de comportement non sourcées (⚠️).
[^batisseurs]: [Modèle des bâtisseurs et des repas](https://langagement-politique.vercel.app/fr/modeles/batisseurs-et-repas/) (09/11/2026) : formation des bâtisseurs 2,0 Md€ brut par an [1,0 ; 3,5], installation agricole environ 0,55, repas 0,06 (coût public net 56 M€). Somme d'environ 2,6 Md€ relevée par la relecture du 09/11/2026 ; non relue ligne à ligne (⚠️). Cote C.
[^eip-bilan]: Bilan global du projet, ligne D32 (crédit d'impôt recherche réorienté vers l'entreprise publique, +3,0 Md€ de dépense par an, compté) et ligne D14 (fin du crédit d'impôt recherche, −8,0 Md€), 05/11/2026. Cote B. Conflit d'intérêts : modèle de l'auteur écrit avec une IA.
[^eip]: Modèle de l'entreprise d'intérêt public, [page du modèle](https://langagement-politique.vercel.app/fr/modeles/entreprise-interet-public/) (résultats du 09/11/2026) : si tout échoue au second jalon, 6,7 / 8,9 / 9,8 Md€ dépensés au total (prudent, central, ambitieux) ; coût complet de 29,4 à 38,4 Md€ sur 2029-2058 au prudent et au central ; coût public net moyen de 1,08 / 1,76 / 3,80 Md€ par an sur 2029-2038, pic de 1,77 / 3,74 / 7,89 Md€. Probabilités de réussite calées sur dix programmes industriels français (échantillon petit, ⚠️). Cote B à C. Conflit d'intérêts : Claude (Anthropic) a écrit ce modèle, sur un sujet où son éditeur n'est pas neutre.
