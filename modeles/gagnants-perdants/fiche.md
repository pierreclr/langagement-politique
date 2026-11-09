---
titre: Qui gagne, qui perd avec le socle et le taux plat
theme: contribuer
statut: brouillon ; premier calcul du 25 octobre 2026, recalage et correctifs du 3 novembre 2026
---

## La question
Combien chaque foyer gagnerait ou perdrait, en euros par mois, si l'on remplaçait les impôts et les aides actuels par un socle versé à chaque adulte et un taux plat sur les revenus ? Et combien coûterait de corriger les pertes, pour « ne perdre personne » ? Le modèle répond pour des foyers types et par dixième de niveau de vie.

Deux versions coexistent dans le dossier. La première (25 octobre) teste l'ancien système : socle de 1 000 €, taux de 50 %. La seconde (3 novembre) teste le « palier 1 » : socle de 500 €, taux plat de 35 %, retraités inchangés, plancher au niveau du revenu de solidarité active, et quatre chemins de financement (taux de 38 à 45 %, socle de 400 ou 500 €). Le système a encore changé après le 3 novembre ; ce modèle n'a pas été recalé sur la version du 8 novembre.

## Ce qui entre
- **Foyers types, droit actuel 2026** : revenu disponible calculé par OpenFisca-France (logiciel public qui applique la législation, version 175.0.45), complété par le simulateur de l'Urssaf pour le coût employeur. Contrôle : net au Smic 1 477,93 €, revenu de solidarité active d'une personne seule 573 €. Statistique publique recalculée.
- **Dixièmes de niveau de vie** : comptes nationaux distribués de l'Insee (2023), prestations par niveau de vie (*France, portrait social* 2025), très hauts revenus (Filosofi 2021). Statistiques publiques, d'années différentes.
- **Paramètres du système** : ceux du modèle du système idéal à la date du calcul.
- **Hypothèses** : logement des foyers modestes (locataire en zone 2), 1,9 million de personnes au plancher, dispersion des revenus dans un dixième, part des retraités parmi les bénéficiaires d'aides au logement, etc.

## Comment il calcule
**Foyers types.** Revenu actuel = revenus nets − impôt sur le revenu − prélèvements sur le capital + revenu de solidarité active + prime d'activité + aides au logement + prestations familiales + minimum vieillesse. Revenu proposé = socle × adultes + 200 € × enfants + (1 − taux) × (coût employeur + bénéfice + dividendes + loyers) + pensions selon la règle retenue. Écart = proposé − actuel. Le « point mort » est le taux au-delà duquel le foyer perd, trouvé par essais successifs.

Exemple (version du 3 novembre) : un salarié seul au Smic a 1 707 € aujourd'hui (1 478 € de salaire net, 230 € de prime d'activité). Au palier 1, il a 1 792 € (+85 €). Au chemin 4 (taux de 45 %, socle de 400 €), il a 1 493 € (−214 €). Il perd dès que le taux dépasse 39,3 % avec un socle de 500 €, 34,2 % avec 400 €.

**Dixièmes.** Pour chaque dixième, en euros par unité de consommation (unité qui compte 1 pour le premier adulte, 0,5 pour les autres personnes de 14 ans et plus, 0,3 pour les enfants plus jeunes) :
- avant = revenu disponible de l'Insee, moins les aides au logement (comptées à part, puisqu'elles disparaissent) ;
- après = socle des adultes non retraités, réparti selon les unités de consommation (H440) + revenus d'activité et du capital après impôt plat et impôt du haut + pensions inchangées + plancher pour ceux qui n'ont aucun autre revenu + part conservée de l'assurance chômage.
- Dans un dixième, les revenus suivent une courbe en cloche (dite log-normale) de dispersion 0,6, calculée en cinq points (H441).

**Correctifs.** Le coût de chaque correctif = effectif concerné × montant : (a) aides au logement des retraités, (b) majoration pour parent isolé, (c) bonus d'activité de 200 € par mois, (d) garantie « pas moins qu'aujourd'hui » pendant quelques années.

## L'hypothèse qui porte le résultat
**Le nombre de personnes au plancher (H444) : 1,9 million**, repris du modèle du système idéal et non vérifié. Le résultat des plus modestes en dépend directement. Au chemin 4, le dixième le plus modeste perd 81 € par mois avec 1,9 million de bénéficiaires, 125 € avec 1 million, 35 € avec 2,85 millions (resultats.md, § 10.2, tableau de sensibilité).
Plus largement, le calcul est **statique** (H1) : personne ne change son travail ni ses salaires, et l'employeur garde le même coût. Les réactions sont chiffrées dans d'autres modèles, pas ici.

## Ce que l'IA a choisi elle-même
Environ dix-huit hypothèses sont posées par l'IA sans source qui tranche :
- version du 25 octobre (9) : H2 (logement et loyers des foyers modestes), H4 (charges de 15 % pour l'indépendant), H7 (âge des enfants, parents mariés), H10 (répartition des loyers), H13 (répartition des retraités par dixième), H16 et H17 (même revenu pour actifs, retraités et chômeurs d'un dixième ; dispersion uniforme), H19 (forme du haut de la distribution), H20 (l'impôt sur les sociétés reversé en dividendes) ;
- recalage du 3 novembre (3) : H440 (socle réparti selon les unités de consommation), H441 (dispersion de 0,6), H445 (part conservée de l'assurance chômage) ;
- correctifs (6) : H450 (part des retraités dans les aides au logement, introuvable), H452 (calibrage du bonus), H454 (chaque adulte compté comme une personne seule), H456 (70 % des parents isolés travaillent), H457 (part des couples à un salaire), H459 (garantie sans réaction).

Sens connu : H16 et H17 ignorent la diversité des familles, qui fait justement les perdants ; les parts de gagnants par dixième sont donc des bornes hautes (favorable au système). H455 (au-delà de 2,9 Smic, les pertes ne sont pas comptées dans la garantie) donne un coût en borne basse. H448 (le retraité locataire au minimum vieillesse perd son aide au logement) est une lecture du code du système, posée comme question à l'auteur.

## Ce qu'il ne fait pas
- Pas de microsimulation : pas de données individuelles, seulement des moyennes par dixième et des foyers types. Les dixièmes se lisent comme un profil (qui gagne relativement), pas comme un niveau : leur somme (+136 Md€ au palier 1) dépasse ce qu'impliquerait le solde public (cotisations fictives incluses, assiettes différentes).
- Pas de réaction des comportements, pas d'héritage ni de patrimoine dans les dixièmes, pas de taxe foncière ni de TVA.
- Pas de contribution des hautes pensions dans les dixièmes (H449).
- Années mélangées (2021, 2023, 2024, 2026).
- La version du 25 octobre (socle de 1 000 €, taux de 50 %) est gardée pour l'historique ; ses chiffres ne décrivent plus le programme.
- Le modèle ne couvre pas la version du 8 novembre du système.

## Ce qu'il donne
- Palier 1 : gain de 9 à 13 % du revenu pour les dixièmes 2 à 9, presque nul pour le premier (+21 €, +2 %) ; le 1 % le plus aisé perd 23 % (resultats.md, § 10.1 et 10.2).
- Chemin 4 (45 %, socle de 400 €) : premier dixième −81 €, deuxième −17 €, troisième +35 € par mois ; le haut (dixièmes 8 à 10) perd aussi (resultats.md, § 10.1).
- Le plancher protège ceux qui n'ont aucun revenu (−13 € pour la personne seule au revenu de solidarité active), pas ceux qui travaillent peu : le parent isolé au Smic perd de 398 € (palier 1) à 697 € (chemin 4) ; le parent isolé sans emploi perd 496 € (resultats.md, § 10.1).
- Correctifs, au central : aides au logement des retraités 1,9 Md€ par an, majoration pour parent isolé 7,6 Md€, bonus d'activité 40,7 Md€ (28 Md€ s'il est réservé aux cinq premiers dixièmes) ; tous ensemble, 55 à 65 Md€ par an selon le chemin (resultats-correctifs.txt, § 1 et 2).

## Comment le refaire
Depuis le dossier du modèle, sous bash, avec `J=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc` et `S=../systeme-ideal` :
```
$J cas_types_donnees.js modele.js test_modele.js
L="$S/modele.js $S/fiscalite_actuelle.js $S/voies.js $S/sante.js $S/optimisation.js $S/retraites2.js $S/palier1.js $S/patrimoine_financier.js $S/deces_realisation.js $S/options_financement.js cas_types_donnees.js droit_actuel.js modele.js palier1.js"
$J $L test_palier1.js
$J $L correctifs.js test_correctifs.js
$J $L rapport_palier1.js > resultats-palier1.txt
```
Relancé le 9 novembre 2026 : 52, 54 et 52 contrôles au vert, en quelques secondes. Les rapports n'ont pas été régénérés ici. Les revenus du droit actuel se recollectent, depuis la racine du dépôt et avec le réseau, par `python3 -I modeles/gagnants-perdants/donnees/collecte.py` (appel à l'interface en ligne d'OpenFisca, non relancé).
