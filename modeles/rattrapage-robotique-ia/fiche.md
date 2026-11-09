---
titre: Rattraper la Chine et les États-Unis en intelligence artificielle et en robotique
theme: construire
statut: brouillon ; sources consultées le 25/10/2026
---

## La question

Combien la France devrait-elle investir d'argent public, sur dix ans, selon trois ambitions : rester spectatrice, viser un rattrapage ciblé, ou chercher le leadership ? Combien d'emplois et d'ingénieurs cela suppose-t-il ? Un fonds alimenté par l'héritage d'entreprise payé en parts peut-il financer cet effort, ou faut-il emprunter ? Le modèle chiffre l'effort, pas la probabilité de devenir leader.

## Ce qui entre

- Investissements privés en intelligence artificielle en 2025 (Stanford AI Index 2026) : 286 Md$ aux États-Unis, 12 Md$ en Chine, 4,4 Md$ en France. Robots industriels installés (Fédération internationale de la robotique) : 38 400, 354 000 et 4 474.
- Coût d'un centre de données de 1 GW : 37,9 Md$ (Epoch AI, mai 2026, modèle américain stylisé), dont 26,12 Md$ de serveurs et de réseau à renouveler tous les 5 ans.
- Plans nationaux, effectifs d'ingénieurs et besoins estimés par des organisations professionnelles.
- Actifs professionnels transmis par an : 20 Md€ sous pacte Dutreil en 2024 (Cour des comptes). Les valeurs plus hautes sont des hypothèses.
- Fuite de l'assiette des transmissions (48 / 31 / 18 %), reprise du modèle `reactions-assiettes`.
- Hypothèses de l'IA : montants des trois scénarios, coût d'une usine de robots, liquidité des parts, taux d'emprunt.

## Comment il calcule

1. **Calcul.** Une capacité de G gigawatts est construite en linéaire sur N ans. Coût total = longue vie (11,77 Md$ par GW) + courte vie (26,12 Md$ par GW, rachetée tous les 5 ans). On divise par le taux de change (1,13 $ pour 1 €). Coût public = coût total × part publique.
2. **Autres postes publics** sur N ans : participations (montant annuel × N), usines (capacité × coût par unité × part publique), aides au déploiement de robots, formation, matériel et recherche.
3. **Emplois directs en régime.** Participations / 300 k€ par emploi, recherche / 150 k€, usines selon le chiffre d'affaires par emploi, calcul à 0,25 emploi par MW.
4. **Financement.** Chaque année, le fonds reçoit actifs transmis × 50 % × (1 − fuite), en parts d'entreprises non liquides. Le cash vient des dividendes (3 % du stock) et de cessions (3 %). Le besoin annuel est couvert d'abord par ce cash, le reste par l'emprunt à 3,3 %.
5. **Sensibilité.** Valeur du portefeuille investi au bout de N ans pour un rendement de −10 %, 0 % ou +7 % par an.

Exemple, 1 GW construit sur 10 ans à moitié public : coût total (11,77 + 39,18) / 1,13 = 45,1 Md€ ; coût public 22,5 Md€ (resultats.md, section 2 ; calcul refait à la main avec les valeurs du code).

## L'hypothèse qui porte le résultat

**La liquidité des parts reçues par le fonds : dividendes de 3 % par an et cessions de 3 % du stock (H17).** Ces valeurs sont posées par l'IA. Au rattrapage ciblé, le fonds couvre 55 % du besoin. Sans aucune cession, il n'en couvre que 30 % ; en cédant 10 % du stock par an, 81 % (resultats.md, section 4). L'héritage payé en parts finance donc des parts d'entreprises familiales, pas de l'argent. Au leadership, le fonds ne couvre que 14 % et il reste 257 Md€ à emprunter.

## Ce que l'IA a choisi elle-même

Sur 20 hypothèses numérotées, 14 sont explicitement des hypothèses de l'IA ou portent un ⚠️ :

- H8 à H12 : tous les montants des trois scénarios (par exemple 1 GW à 50 % public au ciblé, 5 GW au leadership, 2 puis 8 Md€ par an de participations). Ils sont calés sur des ordres de grandeur, pas sur un besoin mesuré.
- H13 : 10 k€ par unité de capacité d'une usine de robots, sans source primaire. Le poids est faible (au plus 2 Md€) : c'est en soi un résultat.
- H14 : coût de formation de 45 k€ par ingénieur et 24 k€ par technicien.
- H15 : rendement du portefeuille de −10 % à +7 % par an.
- H16 : 40 et 60 Md€ d'actifs transmis par an (au-delà des 20 sourcés).
- H17 : liquidité des parts.
- H18 : taux d'emprunt de 3,3 %. La méthode note elle-même qu'il est inférieur de 1,1 point au dernier taux publié (4,44 % en septembre 2026). Un taux plus haut augmenterait la charge d'intérêts.
- H19 : ratios d'emplois.
- H1 et H2 : taux de change et PIB, ordres de grandeur non relus.

## Ce qu'il ne fait pas

- Il ne dit rien du succès : il chiffre l'effort, pas la chance de devenir leader.
- Pas d'emplois indirects ni d'emplois supprimés par l'automatisation.
- Les coûts de calcul sont américains (électricité, foncier). Le capex est dominé par des serveurs au prix mondial, donc l'erreur est limitée sur l'investissement mais forte sur l'exploitation.
- Effet d'aubaine des aides au déploiement et éviction du privé non modélisés : le coût par robot additionnel est sous-estimé.
- Les montants des plans étrangers mélangent budgets votés, annonces et engagements privés : à ne pas additionner.
- Une prise de participation rentable n'est pas un déficit mais augmente la dette brute, selon une règle comptable à confirmer.
- Une partie de l'argent du calcul « souverain » part vers des fournisseurs étrangers (serveurs importés).

## Ce qu'il donne

- Écart de départ : 286 Md$ d'investissement privé aux États-Unis contre 4,4 Md$ en France en 2025 (resultats.md, section 1).
- Public sur 10 ans : 7 Md€ (spectateur), 76 Md€ (rattrapage ciblé, 0,26 % du PIB par an), 298 Md€ (leadership, 1,0 % du PIB par an) (section 2).
- Emplois directs en régime : environ 3 000, 15 000 et 64 000 ; un centre de 1 GW donne environ 250 emplois d'exploitation. À 76 Md€ pour 15 000 emplois, chaque emploi coûte environ 5 M€ (section 3).
- Financement : le fonds détiendrait environ 120 Md€ de parts au bout de 10 ans (44 à 209). Il couvre 55 % du rattrapage ciblé, 14 % du leadership, dont 257 Md€ à emprunter (environ 9 points de PIB) (section 4).
- Portefeuille investi en leadership : 268 Md€ à +7 % par an, 194 à 0 %, 126 à −10 %, pour une dette de 257 Md€ (section 4).

## Comment le refaire

Depuis le dossier du modèle, avec l'interpréteur JavaScript du système (`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc`) :

- `jsc modele.js test_modele.js` : 11 contrôles, lancés le 9 novembre 2026, ils passent.
