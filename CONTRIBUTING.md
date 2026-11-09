# Contribuer et auditer

Ce manifeste est écrit pour être contesté. Il contient des erreurs : c'est assumé, et c'est pour cela qu'il cherche des relecteurs compétents dans leur domaine. Une erreur trouvée par vous est une erreur de moins.

Vous n'avez besoin d'aucune compétence particulière pour signaler un doute. Plus votre contribution touche au cœur du système, plus on vous demande de preuves : quatre niveaux, du plus simple au plus exigeant.

## Vous avez trouvé une erreur ?

C'est le niveau 1, et c'est le plus simple. Ouvrez une *issue* avec le modèle « Signaler une erreur ou une source douteuse » (`.github/ISSUE_TEMPLATE/erreur.md`). Dites :

- **où** : chapitre et paragraphe, numéro de note `[^id]`, ou chemin de fichier et ligne ;
- **ce qui est affirmé**, en copiant la phrase, le chiffre ou la ligne de code ;
- **pourquoi c'est faux**, avec votre source (lien cliquable, auteur ou institution, date) ;
- **ce que vous proposez** à la place, si vous le savez.

La preuve suffit, rien d'autre. Si la correction est adoptée, le mainteneur reporte lui-même les conséquences dans le reste du programme avant de fusionner.

## Les quatre niveaux

| Niveau | Vous voulez | Ce qu'il faut apporter | Qui reporte les conséquences |
|---|---|---|---|
| 1 | Corriger une erreur, une source, une faute | La preuve, rien d'autre | Le mainteneur |
| 2 | Contredire une mesure | Un argument et une source | Le mainteneur |
| 3 | Proposer ou modifier une mesure | Une modélisation (voir plus bas) | Vous |
| 4 | Changer un modèle | Tout ce qui en dépend, relancé et montré | Vous |

### Niveau 2 : contredire une mesure

Dites quelle mesure, quel argument, quelle source. Séparez ce qui est un fait, ce qui est une estimation et ce qui est un choix de valeur (voir plus bas). Si votre désaccord est un désaccord de valeur, il va à la discussion, pas dans une demande de modification.

### Niveau 3 : proposer ou modifier une mesure

Toute mesure est modélisée avant d'être testée, et testée et validée avant d'être déployée à grande échelle. Sans modélisation, on ne peut pas juger comment l'estimation a été faite, donc on ne peut pas en discuter. Une proposition de niveau 3 apporte :

1. **Ce qu'on veut** et le principe retenu ;
2. **les outils qui existent déjà** (droit, services, expériences voisines) ;
3. **la modélisation** : effets attendus, boucles de rétroaction possibles, coût, ce que la mesure touche dans les autres mesures, dans les textes et dans les programmes ;
4. **comment la tester**, avec ses critères de succès, d'abandon et d'adaptation écrits d'avance ;
5. **la meilleure objection**, et la réponse.

Le dossier `atelier-modele/` est un squelette prêt à copier, avec des gabarits commentés.

### Niveau 4 : changer un modèle

Un modèle alimente des données, des résultats, des textes et des productions. Si vous le changez, relancez tout ce qui en dépend et montrez-le : commande lancée, résultat avant et après, textes mis à jour. Chaque modèle a une fiche en clair et une méthode détaillée : modifiez-les avec le code.

## Ce qu'on n'accepte pas dans une demande de modification

- Une demande purement idéologique, sans fait ni estimation.
- Une mesure non chiffrée.
- Une proposition incompatible avec le système sans dire ce qu'elle change ailleurs.

Une proposition sépare trois choses : ce qui est un **fait** (sourcé), ce qui est une **estimation** (avec sa méthode et ses hypothèses) et ce qui est un **choix de valeur** (assumé comme tel). Les désaccords de valeur vont à la discussion (issues, discussions), pas dans une demande de modification du texte. Ils comptent, mais ils ne se tranchent pas par une source.

## Un modèle produit par une IA

Un modèle écrit par une IA a l'air rigoureux même quand il ne l'est pas. Pour les niveaux 3 et 4, on exige :

- des **hypothèses numérotées et sourcées**, avec la cote de chaque source ;
- une hypothèse posée par une IA **marquée comme telle** ;
- un **calcul que chacun peut relancer** (fonctions pures, scénarios bas, central, haut) ;
- un **test qui vérifie un résultat**, pas seulement que le code tourne ;
- une **relecture adverse** : quelqu'un, ou une IA dans une séance séparée, cherche activement ce qui est faux.

Chaque modèle a aussi une **fiche en clair** : la question, ce qui entre, comment il calcule, l'hypothèse qui porte le résultat, ce que l'IA a choisi elle-même, ce qu'il ne fait pas, comment le refaire. Sur le site, les fiches sont sous `/fr/modeles/` et les choix de l'IA sont réunis sur `/fr/choix-de-l-ia.html`.

## Proposer par une pull request

1. Faites une copie du dépôt (*fork*), créez une branche, modifiez, puis ouvrez une *pull request* vers la branche principale. Le modèle de la pull request vous demande le niveau et les cases correspondantes.
2. **Une correction de texte** : mettez la source et sa cote dans la note ; si un chiffre change, relancez le calcul qui le produit (voir le README, « Refaire les calculs ») et indiquez la commande et le résultat.
3. **Un calcul** : en code dans `modeles/` ou `sources/calculs/`, en fonctions pures (mêmes entrées, mêmes sorties), avec un test qui échoue si le résultat change. Les données brutes sont ouvertes et sourcées (un fichier `donnees/*.csv` avec colonnes `source`, `cote`, date de consultation).
4. **Un nouveau modèle** : `modeles/<nom>/` avec `methode.md` (hypothèses numérotées, effets de comportement et de rebond sourcés, scénarios bas, central, haut), `fiche.md`, `donnees/`, le code, un test et `resultats.md`.
5. Ne publiez rien qui touche à la vie privée de quelqu'un : pas de nom de personne privée, pas de donnée personnelle.

Le mainteneur de la branche principale est **Pierre Clocher**, seul : lui seul fusionne. Une pull request peut être refusée ; le motif est alors écrit dans la discussion. Une contradiction assumée est acceptée, mais elle doit être nommée et argumentée.

## Travailler dans un atelier

Le dépôt se construit dans des ateliers. Chacun réfléchit, sonde et modélise chez soi, dans son propre atelier, avec son assistant s'il en a un, avant de proposer quelque chose. Copiez `atelier-modele/` : le `LISEZMOI.md` s'y lit en dix minutes. Il contient des instructions pour l'assistant (`AGENTS.md`, et un fichier qui y renvoie pour les outils qui lisent un autre nom).

## Les règles éditoriales, en résumé

1. **Toute affirmation factuelle est sourcée.** Note `[^id]` en bas de chapitre, avec lien cliquable, auteur ou institution, date, date de consultation.
2. **Sources primaires d'abord** : Insee, DGFiP, Cour des comptes, projets de loi de finances et de financement de la sécurité sociale, Eurostat, OCDE, rapports parlementaires, publications scientifiques. La presse vient en complément.
3. **Fait, estimation ou opinion** : on distingue toujours le fait sourcé, l'estimation (avec sa méthode de calcul reproductible) et l'opinion de l'auteur.
4. **Chiffres** : toujours l'année, le périmètre et l'unité. Des ordres de grandeur sous hypothèses, jamais des prédictions.
5. **Steelman** : chaque proposition expose la meilleure objection adverse et y répond. Les contraintes juridiques (droit de l'Union, Constitution, OMC) sont nommées.
6. **Une affirmation non vérifiée** est marquée `⚠️ À VÉRIFIER`.
7. **Écrit pour être vrai, pas pour être aimé.** Les contradictions, raisonnements fragiles et biais de l'auteur (et de l'IA) sont signalés sans détour.
8. **Fiabilité et conflits d'intérêts de chaque source.** Chaque source reçoit une cote :
   - **A** : statistique publique ou texte officiel, publication à comité de lecture ;
   - **B** : institution reconnue, rapport parlementaire, organisme international ;
   - **C** : presse, think tank, rapport d'un acteur ;
   - **D** : communication commerciale ou militante, blog ;

   avec la mention des conflits d'intérêts connus (financement, auteur lié à une industrie ou à un parti, commanditaire). Une source orientée n'est pas écartée : son orientation est dite et elle est recoupée.
9. **Études en sciences humaines et sociales** : chaque chapitre dit ce que les études établissent, ce qui est débattu et ce qui manque.
10. **Ton** : clair, direct, sans jargon militant. Le texte doit pouvoir convaincre quelqu'un qui n'est pas d'accord.

## Auditer avec un assistant

Vous pouvez demander à un assistant de code de relire le dépôt avec vous. Installez [Claude Code](https://claude.com/claude-code) ou un autre, ouvrez le dossier du dépôt et posez des demandes précises. Des exemples :

- « Refais le calcul du cas type Smic (`modeles/systeme-ideal/`) et compare au chapitre 3. »
- « Lance `python3 -I modeles/systeme-ideal/lancer.py test` puis `lancer.py rapport` et dis-moi si le rapport redonne `resultats_decisions_0811.txt`. »
- « Vérifie la source de la note `[^dila]` du chapitre 7 : ouvre le lien, trouve le chiffre, dis-moi s'il y est et quelle est la cote de fiabilité. »
- « Liste les affirmations du chapitre 12 qui n'ont pas de note, ou dont la note ne dit pas ce que le texte lui fait dire. »
- « Trouve la meilleure objection à la fonction du patrimoine et vérifie si le chapitre y répond. »
- « Relance `python3 -I sources/calculs/bilan_global.py` et dis-moi quelles lignes du bilan reposent sur une hypothèse sans source. »

**Prudence avec l'assistant.** Il peut se tromper et il tend à approuver ce qu'on lui montre. Demandez-lui de chercher activement l'erreur et de citer le passage exact de la source, et vérifiez vous-même avant de proposer une correction. Dans une issue ou une pull request, indiquez que l'assistant vous a aidé, comme le fait ce manifeste.

## Ce que ce dépôt ne contient pas

Les registres de travail (vérifications, positions de l'auteur) ne sont pas encore publiés ; si une erreur vous semble venir d'un point « non vérifié » cité par un numéro `V…`, signalez-le quand même : il sera traité.
