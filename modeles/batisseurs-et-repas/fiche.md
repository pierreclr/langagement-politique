---
titre: Former des bâtisseurs et servir des repas à prix coûtant
theme: construire
statut: relu de façon adverse ; dernier calcul du 09/11/2026
---

## La question

Combien de rénovations par an faut-il pour traiter les passoires énergétiques, combien de professionnels cela demande, et combien coûte une formation payée sur chantier-école ? Même question, plus brève, pour installer des agriculteurs. Le modèle chiffre aussi un réseau de cuisines qui servent des repas bio à emporter, sans marge, en employant des personnes en insertion. Attention : le « coût net » de la formation affiché par le modèle déduit des travaux qui ne sont pas une recette publique. Le coût budgétaire est le coût brut.

## Ce qui entre

- Parc de logements au 1er janvier 2025 (SDES) : 30,9 millions de résidences principales, dont 4,8 % en classe G, 7,9 % en F, 17,8 % en E. Statistique publique.
- Coût d'une rénovation d'ampleur : 41 500 € de travaux (SDES, Anah 2024).
- 91 900 rénovations d'ampleur aidées en 2024 ; installations agricoles : 12 661 en 2024 contre 21 000 départs en 2022 (MSA).
- Aide au poste d'un atelier d'insertion : 24 203 € par poste.
- Hypothèses de l'IA : temps de travail par rénovation, durée et coût de la formation, rémunération, remplissage des cuisines.

## Comment il calcule

1. **Besoins.** Rénovations par an = nombre de logements à traiter / horizon. ETP (équivalents temps plein) nécessaires = rénovations × années de travail par rénovation (0,35). Manque = ETP nécessaires − ETP déjà en poste. Jeunes à former par an = manque, corrigé du maintien dans le métier (60 % un an après) et des départs (8 % par an).
2. **Coût d'un formé.** Durée × (rémunération + encadrement + pédagogie + outillage), plus les frais de structure.
3. **Valeur des travaux.** Production d'un apprenti = 0,4 × valeur de la main-d'œuvre d'un professionnel (55 k€ par ETP et par an) × durée.
4. **Repas.** Coût hors taxes = (denrées + personnel + vente + énergie + contenant + amortissement) × (1 + frais généraux). Prix TTC = (coût hors taxes − aide au poste par repas) × (1 + TVA de 10 %).
5. **Coût public.** Aide au poste moins RSA évité, moins TVA collectée, présentée à part.

Exemple, central (resultats.md, section 1) : formation de 18 mois, 67 k€ par personne ; travaux réalisés 0,4 × 55 000 × 1,5 = 33 k€ ; « coût net » 34 k€. Pour 30 000 formés par an : 2,0 Md€ brut. Repas : 3,00 + 1,82 + 1,50 + 0,51 = 6,83 € de coûts directs, 7,38 € avec frais généraux, moins 0,99 € d'aide au poste, soit 6,39 € hors taxes, soit 7,03 € TTC.

## L'hypothèse qui porte le résultat

**La valeur des travaux faits par les apprentis est présentée comme un « coût net ».** La méthode dit pourtant elle-même que ce n'est pas une recette : c'est une économie seulement si ces travaux auraient été payés, et ils l'auraient été par les ménages, pas par l'État. Le coût budgétaire est donc le brut : 2,0 Md€ par an pour 30 000 formés (1,0 à 3,5), et non 1,0 Md€ (resultats.md, section 1). Cette conclusion vient de la relecture adverse du 9 novembre 2026. Le modèle `fonciere-afflux` reprend le coût net de 34 k€ par formé pour l'expérimentation.

Pour les besoins, c'est le temps de travail par rénovation : à 0,45 année au lieu de 0,35, il faut 1,3 fois plus de monde (methode.md, limites).

## Ce que l'IA a choisi elle-même

Sur 30 lignes d'hypothèses (H1 à H40), 24 sont marquées comme hypothèses de l'IA. Les principales :

- H5 : années de travail par rénovation (0,28 / 0,35 / 0,45). Elles décident tout le tableau des besoins.
- H12 : un apprenti produit 0,4 d'un professionnel. Plus c'est haut, plus le coût « net » paraît bas.
- H14 et H15 : 60 % des formés restent dans le métier, 8 % partent chaque année.
- H7, H8 : formation de 12, 18 ou 24 mois, rémunération de 1 800 à 2 400 € par mois.
- H16 : l'économie réelle d'énergie vaut la moitié de l'économie conventionnelle.
- H24 : 60 % des formés agricoles s'installent.
- H30 : denrées bio à 3,00 € par repas, remplissage de 75 % (H38, « paramètre décisif pour le prix »).
- H39 : 50 % des salariés en insertion seraient sinon au RSA.

## Ce qu'il ne fait pas

- La TVA collectée est déduite du coût public (13 M€ pour 100 cuisines). Les repas vendus remplacent d'autres repas qui paient déjà de la TVA : c'est un double compte. Le chiffre à retenir est 56 M€ par an, selon la relecture. Un test du modèle valide cette convention.
- Le personnel est proportionnel aux repas servis. À 60 % de remplissage, le prix ne passe que de 7,03 € à 7,28 € ; une cuisine a un effectif minimal, donc le prix réel est plus sensible.
- Une rénovation coûte 41 500 € pour une économie réelle de 1 283 € par an : 32 ans de retour sans actualisation (essai de la relecture). Les résultats donnent les deux chiffres sans le rapport.
- Il n'est pas sûr que la structure relève du régime des ateliers (aide de 24 203 €) plutôt que de celui des entreprises d'insertion (environ 11 à 12 k€) : avec 11 800 €, le repas coûterait 7,58 € et le coût public 22 M€. À vérifier.
- Le « RSA évité » devrait suivre l'allocation unique du programme, non le droit actuel.
- Absent du bilan global : environ 2,6 Md€ par an (formation 2,0 brut, installation agricole 0,55, repas 0,06). Les travaux eux-mêmes (environ 13 Md€ par an) restent à financer.
- Demande réelle à 7 € non mesurée ; logement des apprentis, effet d'aubaine et concurrence avec les traiteurs non traités.

## Ce qu'il donne

- Besoins : 392 000 rénovations par an pour traiter les classes F et G en 10 ans, soit 4,3 fois le rythme de 2024 ; 29 000 jeunes à former par an (resultats.md, section 1).
- Formation de 18 mois : 67 k€ par personne (35 à 117), 34 k€ « nets » (5 à 92).
- Programme de 30 000 formés par an : 2,0 Md€ brut (1,0 à 3,5), 1,0 Md€ « net » (0,1 à 2,8). Cette dernière valeur ne se lit pas comme un coût budgétaire.
- Agriculture : 69 k€ par agriculteur installé, 0,55 Md€ par an pour 8 000 installations de plus (0,31 à 0,87).
- Repas : 7,03 € TTC sans marge pour une cuisine de 3 000 repas par jour ; 100 cuisines coûtent 56 M€ par an à la collectivité (aide au poste 67 M€ moins RSA évité 11 M€).

## Comment le refaire

Depuis le dossier du modèle, avec l'interpréteur JavaScript du système (`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc`) :

- `jsc modele.js test_modele.js` : 25 contrôles, lancés le 9 novembre 2026, ils passent. `node test_modele.js` est aussi annoncé ; node n'est pas disponible ici.
- `jsc modele.js rapport.js > resultats.txt` : régénère les résultats (non relancé ici).
