---
titre: Afficher un code « actuel » et « réécrit » côte à côte (proposition pour le site)
date: 2026-11-09
statut: proposition de Claude, une page, non validée
---

# Un code, deux colonnes, un simulateur

**Principe** : le lecteur voit le droit actuel et le droit réécrit face à face, et peut vérifier lui-même, sur sa propre situation, ce qui change. La page se construit à partir de trois fichiers du pilote : les articles en vigueur (LEGI), `reecriture.md` et `regles.py`.

**1. En-tête du chapitre (une ligne de chiffres).** « Actuel : 33 articles, 1 666 mots. Réécrit : 6 articles, 421 mots. Sur 3 328 cas testés : 2 720 identiques (hors forme), 496 gagnants, 104 perdants. » Chaque chiffre ouvre sa méthode (niveau « complet » de la liseuse).

**2. Deux colonnes alignées par sujet, pas par numéro.** À gauche, les articles actuels regroupés (préavis : L1234-1 à L1234-8, L1234-15 à L1234-17-1 ; indemnité : L1234-9 à L1234-14, R1234-1 à R1234-5 ; documents : L1234-19, L1234-20, D1234-6 à R1234-12) ; à droite, l'article réécrit correspondant. Les passages que la réécriture modifie sont surlignés et portent leur étiquette (E1 à E5) ; un survol affiche l'effet mesuré (« E3 : 104 cas perdants, Alsace-Moselle »). Sur téléphone, les colonnes deviennent des onglets « Actuel / Réécrit » avec le même découpage par sujet.

**3. Le simulateur « ma situation ».** Un petit formulaire (contrat, ancienneté, faute, région, salaires, préavis effectué ou non) appelle les deux fonctions `actuel` et `reecrit` (portées en JavaScript, ou exécutées en Python dans le navigateur avec Pyodide) et affiche deux cartes : préavis, indemnités, documents, avec les articles appliqués et l'écart en euros. Aucune donnée ne quitte le navigateur.

**4. Les interrupteurs des options.** Chaque option (E1 à E5) est un interrupteur. Le lecteur coupe E3 et voit le nombre de perdants tomber à zéro ; il active E4 et voit apparaître les salariés récemment augmentés. C'est le « stress test avant le vote » rendu visible : la réforme n'est plus un texte à croire, c'est un choix d'options dont on voit les conséquences.

**5. Le registre des écarts.** Sous les colonnes, un tableau liste les cas qui changent (extrait de `resultats/stress_test.csv`), filtrable par option et par sens (gagnant, perdant, forme), avec pour chacun la phrase « pourquoi » tirée de `reecriture.md`. Un lien « Signaler un cas mal calculé » ouvre une proposition de correction (le modèle est open source).

**6. Les garde-fous affichés.** Bandeau permanent : « Lecture non juriste ; 3 interprétations à vérifier ; la grille donne des cas, pas des effectifs. » Le statut du texte (brouillon, relu par un juriste, avis du Conseil d'État) est affiché en tête, comme le statut des chapitres.

**Mise en œuvre** : un fichier de correspondance `correspondance.csv` (article actuel → article réécrit → options) suffit à générer les colonnes ; les fonctions de règles sont exportées telles quelles ; le test de fidélité (toutes options éteintes, le réécrit égale l'actuel) tourne à chaque publication et bloque la mise en ligne s'il échoue. Le même gabarit sert ensuite pour tout chapitre réécrit (T67), puis pour un code entier, avec, en tête, la courbe du flux législatif du code concerné (`modeles/flux-legislatif/resultats/par_mandat_et_code.csv`).
