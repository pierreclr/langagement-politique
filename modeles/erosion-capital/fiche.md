---
titre: Une grande fortune se disperse-t-elle d'elle-même ?
theme: contribuer
statut: relu de façon adverse ; dernier calcul du 09/11/2026
---

## La question

La thèse examinée : sur plusieurs générations, les grandes fortunes se dispersent d'elles-mêmes. Le modèle calcule la part de la fortune de départ que détient un descendant moyen, puis la famille entière, de la première à la sixième génération (environ 150 ans), selon le régime fiscal : droit actuel, système proposé par le manifeste, ou aucun impôt. Il sert à savoir si l'impôt sur les transmissions et sur le patrimoine est nécessaire pour éviter la concentration.

## Ce qui entre

- Un cas illustratif : 121,2 Md€ transmis à 5 enfants (classement Challenges, 8 juillet 2026, relayé par la presse). Fait public, mais le classement appartient à une personne concernée. Le modèle ne suppose rien sur les intentions ni sur l'organisation réelle d'une famille.
- Le droit actuel : barème des droits de succession (5 à 45 %), abattement de 100 000 € par enfant, pacte Dutreil (exonération de 75 % des titres d'une entreprise familiale sous engagement de conservation). Texte de loi : statistique publique.
- Le système du manifeste, tel qu'il était arrêté le 8 novembre 2026 : un impôt sur les transmissions, une contribution annuelle de 3 % au plus sur le patrimoine, un taux de 65,15 % sur les revenus distribués.
- Hypothèses d'ensemble (par l'IA) : rendement réel 3 / 4,5 / 6 %, consommation 2 / 1 / 0,5 % du patrimoine par an, enfants par descendant 3 / 2 / 1,6, déclin de l'entreprise familiale.

## Comment il calcule

Pour chaque génération de 30 ans :

1. **Partage.** Le patrimoine est partagé entre les enfants. Chacun paie les droits sur sa part.
2. **Vie de la génération.** Année après année : patrimoine ← patrimoine × (1 + rendement) − patrimoine × consommation / (1 − taux sur les revenus distribués) − prélèvement annuel sur le patrimoine. La consommation est financée par des revenus distribués, donc taxés.
3. **Déclin.** En fin de vie, avec une probabilité p, la part du patrimoine placée dans l'entreprise familiale perd une fraction L de sa valeur. Les 2^(G−1) chemins possibles sont énumérés exactement, sans tirage aléatoire, d'où une espérance.
4. **Famille.** Part de la famille = part d'un descendant × nombre de descendants.

Exemple (calcul refait à la main, arrondi) : sans impôt, un des 5 enfants reçoit 24,2 Md€ soit 20 % de la fortune. Pendant 30 ans, 4,5 % de rendement moins 1 % de consommation multiplient le patrimoine par environ 2,8. Il est ensuite partagé entre 2 enfants. L'espérance du déclin retire environ 13 % (0,7 × 0,3 × 0,6). Résultat : environ 25 % par descendant à la deuxième génération, comme le tableau (resultats.md, section 1).

## L'hypothèse qui porte le résultat

**Le rendement réel et le nombre d'enfants, qui bougent ensemble dans les scénarios.** Le scénario bas combine 3 % et 3 enfants, le haut 6 % et 1,6 enfant : les fourchettes sont donc très larges et ne disent pas lequel des deux décide. Un essai de la relecture adverse du 9 novembre 2026, non repris dans les résultats du dossier, sépare les deux. Sans impôt, un descendant à la sixième génération garde 6,2 % de la fortune à 3 % de rendement, 56 % à 4,5 % et 481 % à 6 %. La part d'un descendant se maintient si le rendement dépasse environ 3,8 % avec deux enfants.

Par famille, sans impôt, la part reste au moins de dix fois la fortune de départ dans tous les cas testés. Ce qui disperse, c'est l'impôt.

## Ce que l'IA a choisi elle-même

Sur 18 hypothèses numérotées, au moins 7 ont la cote D (convention sans source) : consommation (HER3), part dans l'entreprise familiale (HER4), nombre d'enfants (HER6), déclin de l'entreprise (HER7), part éligible au pacte Dutreil (HER9), philanthropie nulle (HER14), croissance de l'économie (HER15). Trois autres sont des ancrages indirects (durée de 30 ans, rendement, impôt américain).

Sens des choix :

- Le haut des fourchettes est déjà optimiste sur 150 ans pour le rendement.
- Un seul parent transmet, le mariage entre héritiers est ignoré : cela accélère la dilution.
- L'exil n'est pas modélisé : dans le système du manifeste, une famille qui reste est supposée garder le même rendement. Le modèle ne dit donc pas ce que rapporterait cette fiscalité.

## Ce qu'il ne fait pas

- Pas de trust, de démembrement ni de donations tous les 15 ans : le droit actuel est une borne haute de l'impôt payé par une famille bien conseillée.
- Pas d'aléa sur le rendement (guerres, crises).
- Le droit est figé à 2026 sur 150 ans.
- Il ne contient aucune phrase de verdict : il ne dit pas que la thèse est vraie, et il ne dit pas qu'elle est fausse. Il ne faut pas le citer comme une confirmation.
- Le prélèvement sur le patrimoine et sur les revenus du système complet est supposé payé : une famille partie ne rapporte rien.

## Ce qu'il donne

- Part d'un descendant à la sixième génération, central : 56 % sans impôt, 0,69 % avec le droit actuel sans pacte Dutreil, 4,1 % avec le pacte, 0,39 % avec les transmissions du manifeste seules, moins de 0,001 % avec le système complet (resultats.md, section 1).
- Part de la famille entière à la sixième génération, central : 8 884 % sans impôt, 111 % avec le droit actuel sans pacte, 653 % avec le pacte, 0,16 % avec le système complet (section 1).
- Décomposition à la quatrième génération : le partage seul laisse 2,5 %, avec rendement et consommation 55 %, avec le déclin 37 %, avec le droit actuel et le pacte 6,8 % ; avec le système complet, 0,031 % (section 4).
- Taux effectif d'une transmission de 121,2 Md€ : 45 % sans pacte, 26 % avec, 50 % au système du manifeste (section 5).

## Comment le refaire

Depuis la racine du dépôt :

- `python3 -m pytest modeles/erosion-capital/tests -q -p no:cacheprovider` : pytest n'était pas installé ici ; les 14 fonctions de test, appelées une à une, passent (9 novembre 2026).
- `python3 -I modeles/erosion-capital/code/rapport.py > modeles/erosion-capital/resultats.md` : régénère les résultats (non relancé ici).
