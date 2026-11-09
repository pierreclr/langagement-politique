# Squelette d'atelier

Ce dossier est un modèle à copier. Il ne contient aucune mesure réelle : seulement des gabarits vides et commentés, et des instructions pour un assistant.

## À quoi sert un atelier

Le dépôt se construit dans des ateliers. Chacun réfléchit, sonde et modélise chez soi, dans son propre atelier, avec son assistant s'il en a un, avant de proposer quoi que ce soit. Ce qui arrive dans le dépôt public est alors déjà modélisé, sourcé, relancé, et attaqué par sa meilleure objection.

Le principe : toute mesure est modélisée avant d'être testée, et testée et validée avant d'être déployée à grande échelle. Les critères de succès, d'abandon et d'adaptation sont écrits d'avance.

## Comment s'en servir en dix minutes

1. **Copiez** le dossier `atelier-modele/` ailleurs et renommez-le (par exemple `mon-atelier/`).
2. **Copiez** `mesures/EXEMPLE/` en `mesures/<nom-de-votre-mesure>/`.
3. **Lisez** `CONTRIBUTING.md` du dépôt public : quatre niveaux de contribution, du plus simple au plus exigeant. Le niveau 3 (proposer ou modifier une mesure) demande tout ce que contient ce squelette.
4. **Remplissez dans cet ordre** :
   1. `proposition.md` : ce que vous voulez, le principe, les outils qui existent déjà, comment tester, les critères ;
   2. `modele/methode.md` : les hypothèses, numérotées, avec leurs sources cotées ;
   3. `modele/calcul.py` : le calcul, trois scénarios ; lancez-le avec `python3 -I modele/calcul.py` ;
   4. `modele/test_calcul.py` : un test qui vérifie un résultat ; lancez-le avec `python3 -I modele/test_calcul.py` depuis le dossier de la mesure ;
   5. `modele/fiche.md` : l'explication en clair ;
   6. `objections.md` et `impacts.md` ;
   7. la liste de vérification, `VERIFICATION.md`.
5. **Avec un assistant** : ouvrez ce dossier avec lui. Il lira `AGENTS.md` (les règles qu'il doit suivre). Demandez-lui de remplir les gabarits avec vous, puis de chercher la meilleure objection.
6. **Proposez** : quand la liste de vérification est cochée, ouvrez une pull request sur le dépôt public avec le niveau de la contribution.

## Contenu

| Fichier | Rôle |
|---|---|
| `AGENTS.md` | Instructions pour un assistant |
| Un fichier qui renvoie à `AGENTS.md` | Pour les assistants qui cherchent un autre nom de fichier |
| `VERIFICATION.md` | Liste de vérification avant de proposer |
| `mesures/EXEMPLE/proposition.md` | Ce qu'on veut, le principe, les outils, le test, les critères |
| `mesures/EXEMPLE/modele/methode.md` | Hypothèses numérotées, sources cotées |
| `mesures/EXEMPLE/modele/fiche.md` | La fiche en clair |
| `mesures/EXEMPLE/modele/calcul.py` | Le calcul, en fonctions pures |
| `mesures/EXEMPLE/modele/test_calcul.py` | Le test |
| `mesures/EXEMPLE/objections.md` | Les meilleures objections et les réponses |
| `mesures/EXEMPLE/impacts.md` | Ce que la mesure touche ailleurs |

## Limites

Un modèle fait par une IA a l'air rigoureux même quand il ne l'est pas. Ce squelette ne rend pas un modèle juste : il rend ses hypothèses visibles, son calcul relançable et ses faiblesses cherchées. La relecture par quelqu'un de compétent dans le domaine reste nécessaire.
