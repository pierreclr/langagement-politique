---
titre: Le taux d'intérêt qui suit la dette
theme: comptes et dette
statut: relu de façon adverse ; calcul du 9 novembre 2026
---

## La question

Le banc d'essai des programmes calcule la dette avec un taux d'intérêt fixe de 3,45 %. Que deviennent ses résultats si le taux est celui de novembre 2026, et s'il monte quand la dette et le déficit montent ? Quel effort budgétaire faut-il alors pour que la dette cesse de monter ? Le modèle ne change rien au banc : c'est une couche de sensibilité posée à côté.

## Ce qui entre

- **Statistique publique.** Taux à 10 ans de l'Allemagne (le taux « sans risque ») : 3,47 % en moyenne en septembre 2026 (Banque centrale européenne). Écart entre le taux français et le taux allemand : 0,69 à 0,84 point en 2025, 0,97 en septembre 2026 ; 1,53 à 1,76 point fin octobre 2026 selon la presse. Durée de vie moyenne de la dette de l'État : 8,5 ans (Agence France Trésor, 2025).
- **Études.** La pente du taux par point de dette vient de travaux économétriques : 1,7 à 4 points de base (centièmes de point) selon les études (Laubach 2009, Poghosyan 2012, Baldacci et Kumar 2010) ; 11,6 points de base dans la zone euro après 2009 (De Grauwe et Ji 2013).
- **Repris du banc** : dette de départ fin 2025 (3 460,5 Md€), solde hors intérêts de 2024 maintenu en part du produit intérieur brut, croissance nominale de 3 %, et les 10 000 tirages des programmes.
- **Hypothèses.** Taux sans risque de 3,4 % (bas 2,9, haut 3,9) ; écart de départ de 1,3 point (bas 0,8, haut 1,7) ; part de la dette refinancée chaque année : 13 %.

## Comment il calcule

Pour chaque année à partir de 2027 :

1. **L'écart de taux (la « prime »)** dépend de l'état de l'année précédente :
   prime = 1,3 point + 0,02 × (dette − dette de départ) + 0,10 × (déficit − déficit de départ) + 0,0003 × (dette au-delà de 130 %)².
   Dette et déficit sont en points de produit intérieur brut. L'état « de départ » est celui que la chaîne du banc donne fin 2026 : dette 118 %, déficit 5,9 %. La prime reste entre 0 et 15 points.
2. **Taux de marché** = taux sans risque (3,4 %) + prime. Le coût réel des émissions est 0,2 point plus bas, parce que l'État n'émet pas tout à 10 ans.
3. **Taux moyen de la dette** : chaque année, 13 % du stock est refinancé au coût d'émission, et la dette nouvelle est empruntée à ce coût. Le reste garde son ancien taux.
4. **Dette de l'année** = dette de l'année d'avant − solde primaire + intérêts. Le solde primaire est celui du « droit actuel » (−103,4 Md€ de 2025, qui suit le produit intérieur brut) plus l'effet du programme ou de l'effort testé.
5. **La boucle** : la dette et le déficit de l'année nourrissent la prime de l'année suivante.
6. **Zone de crise** : première année où la prime dépasse 3 points. Au-delà, les chiffres sont marqués « n.s. » (non significatifs) : le modèle ne sait plus dire ce qui se passe (aide européenne, intervention de la banque centrale, restructuration).
7. **Effort stabilisant** : on cherche, par pas de 1 Md€, le plus petit effort constant (montée de 2028 à 2032) pour lequel la dette ne monte plus entre 2038 et 2058.

**Exemple suivi : le fil de l'eau, sans effort.** En 2027, la prime vaut sa valeur de départ, 1,3 point, et le taux de marché 4,7 %. La dette atteint 136,6 % fin 2031 et le déficit 8,27 %. La prime de 2032 vaut donc 1,3 + 0,02 × (136,6 − 118,2) + 0,10 × (8,27 − 5,85) + 0,0003 × (136,6 − 130)² ≈ 1,92 point, et le taux de marché 5,32 %. La dette fin 2032 est de 141,3 %. La prime franchit 3 points en 2037 : c'est l'entrée en zone de crise (calcul relancé pour cette fiche avec les fonctions du dossier ; mêmes valeurs que `resultats.md`, § 1).

**Contrôle.** Réglé comme le banc (taux fixe 3,45 %, sans prime), le calcul redonne exactement les trajectoires du banc, programme par programme.

## L'hypothèse qui porte le résultat

**La prime de départ de 1,3 point persiste, et elle monte de 2 points de base par point de dette** (hypothèses H-TE2, H-TE4 et H-TE5). La prime de départ contient une part politique (budget, élection de 2027) que le modèle suppose durable ; elle peut retomber. Si elle retombait au niveau de 2025 (0,8 point) avec un taux allemand de 2,9 %, l'effort qui stabilise la dette au fil de l'eau tomberait de 150 à 114 Md€ par an ; dans le cas le plus défavorable (3,9 % et 1,7 point), il monterait à 184 Md€. Pour le programme de l'auteur, l'effort manquant va de 37 Md€ (taux fixe de 4,7 %, sans boucle) à 44 Md€ (pentes hautes) ; il est nul si le taux revient à 3,45 %, mais par construction : le taux du haut de la contribution est réglé dans le modèle du système pour que la dette cesse de monter à 3,45 %.

## Ce que l'IA a choisi elle-même

Quatre valeurs sont marquées dans la méthode comme choix de l'IA ou stylisation ; cinq autres sont des choix de méthode sans source qui tranche. Neuf en tout :

- **H-TE6** : 10 points de base par point de déficit, en plus de la dette. Les études estiment souvent l'effet du déficit à la place de celui de la dette, pas en plus : additionner les deux peut surcompter. Ce choix pousse les taux vers le haut.
- **H-TE7** : le seuil de 130 % au-delà duquel le taux monte plus vite, et sa force (0,03 point de base par point au carré, au lieu de 0,09 dans l'étude, mesurée en période de crise).
- **H-TE11** : la règle d'éligibilité au mécanisme de protection de la Banque centrale européenne (déficit sous 3 % ou en baisse de 0,4 point). Le mécanisme est discrétionnaire et n'a jamais servi. Il ne change aucun résultat.
- **H-TE15** : persistance de 0,5 de l'effet d'une restriction budgétaire sur l'activité (variante seulement).
- **H-TE4** : la prime ne varie qu'avec l'écart à l'état de fin 2026 ; sa part politique est supposée durable.
- **H-TE8** : les marchés réagissent à la dette constatée l'année d'avant, pas à la dette annoncée. Le modèle a donc un an de retard, dans les deux sens.
- **H-TE10** : le taux de refinancement de l'État appliqué à toute la dette publique.
- **H-TE12** : le seuil de crise de 3 points, fondé sur des repères de 2011-2012 cités de mémoire.
- **H-TE13** : la croissance ne dépend pas des taux.

## Ce qu'il ne fait pas

- Pas d'effet de la prime sur la croissance, l'investissement ou le crédit ; pas de contagion à la zone euro.
- Pas de réaction du gouvernement : le modèle dit combien il faudrait faire, il ne le fait pas.
- Un seul taux d'émission, un renouvellement uniforme ; la dette indexée sur l'inflation est traitée comme les autres.
- Les pentes viennent de panels qui mêlent pays et époques : elles ne disent pas comment les marchés jugeront la France de 2027.
- **Ce que le résultat ne permet pas de dire** : la date exacte d'une crise. Il dit qu'à taux montant, le programme de l'auteur ne stabilise plus la dette sans environ 40 Md€ de plus par an.
- **Un chiffre à ne pas mal citer** : les 157 % de dette en 2038 au fil de l'eau sont la valeur à taux fixe de 3,45 %. Au taux de 4,7 %, c'est 171,3 %.

## Ce qu'il donne

- Fil de l'eau : dette 2038 de 157,1 % à 3,45 %, 171,3 % à 4,7 % fixe ; avec le taux qui suit la dette, zone de crise en 2037 (`resultats.md`, § 1).
- Effort qui stabilise la dette de 2038 à 2058 au fil de l'eau : 117 Md€ par an à 3,45 %, 154 à 4,7 % fixe, 150 au cas central, de 114 à 184 selon le niveau des taux (§ 1).
- Programme de l'auteur : dette 2038 de 145,9 % [130,8 ; 161,3] au cas central ; zone de crise avant 2058 dans 67 % des tirages ; dette 2058 non significative (§ 2).
- Effort supplémentaire pour que le programme de l'auteur stabilise la dette : 37 Md€ (4,7 % fixe), 40 (central), 41 (pentes basses), 44 (pentes hautes) ; 0 à 3,45 % (§ 2).
- Les autres programmes demandent bien plus : 123 Md€ pour Les Républicains, 162 pour le Parti socialiste, 184 pour le Rassemblement national, plus de 400 pour La France insoumise, au cas central (§ 2).
- Intérêts de 2027 : 91 Md€ dans le modèle, comme dans l'avis du Haut Conseil des finances publiques sur le budget 2027 ; la chaîne du banc en donnait 82 (§ 3).

## Comment le refaire

Depuis la racine du dépôt :

```
python3 -I modeles/taux-endogene/tests/test_taux.py   # 10 tests, moins d'une seconde
python3 -I modeles/taux-endogene/calculer.py          # environ 30 secondes, réécrit resultats.md
```

Les 10 tests passent (lancés le 9 novembre 2026 pour cette fiche). Le calcul complet n'a pas été relancé. Il lit en lecture seule les données en cache du banc d'essai.
