# Langagement politique

Un manifeste politique français, chiffré et sourcé, écrit par Pierre Clocher avec une intelligence artificielle (Claude, d'Anthropic). La coécriture est assumée et décrite dans la conclusion. Version 0.2, document de travail.

**Lire le manifeste : https://langagement-politique.vercel.app**

Ce dépôt contient tout ce qu'il faut pour **vérifier** le manifeste : les chapitres, les dossiers de sources, les modèles et simulations, leurs données, leurs tests et leurs résultats. Le but n'est pas de vous demander de nous croire : c'est que vous puissiez refaire chaque calcul et contester chaque source.

## L'idée

Remplacer des centaines d'impôts, d'aides et de guichets par quelques règles claires, des fonctions qu'on peut écrire en une ligne, dessiner et vérifier, pour un système plus simple et plus juste : moins de précarité en bas, une juste contribution en haut, et des citoyens qui votent eux-mêmes les lois. Le débat politique français est enfermé dans des oppositions dogmatiques pendant que la révolution de l'IA et de la robotique arrive ; les institutions, conçues après-guerre, n'exploitent pas ce que permettent les systèmes d'information.

## L'approche

On ne fait pas de politique avec les seuls idéaux. **Toute mesure est modélisée avant d'être testée, et testée et validée avant d'être déployée à grande échelle.** Les critères de succès, d'abandon et d'adaptation sont écrits d'avance. L'IA rend ce travail possible pour une personne seule ; ce qui le rend fiable, c'est que tout est ouvert et vérifiable.

Ce dépôt contient des erreurs, c'est assumé : il cherche des relecteurs compétents dans leur domaine. Un modèle produit par une IA a l'air rigoureux même quand il ne l'est pas ; on exige donc des hypothèses numérotées et sourcées, un calcul que chacun peut relancer, un test qui vérifie un résultat (pas seulement que le code tourne) et une relecture adverse.

### Quatre niveaux de contribution

| Niveau | Vous voulez | Il faut apporter |
|---|---|---|
| 1 | Corriger une erreur, une source, une faute | La preuve, rien d'autre |
| 2 | Contredire une mesure | Un argument et une source |
| 3 | Proposer ou modifier une mesure | Une modélisation : effets attendus, boucles de rétroaction possibles, coût, ce que la mesure touche ailleurs |
| 4 | Changer un modèle | Tout ce qui en dépend, relancé et montré |

Aux niveaux 1 et 2, le mainteneur reporte les conséquences dans le reste du programme avant de fusionner. Aux niveaux 3 et 4, c'est le contributeur qui apporte la modélisation. Détail dans `CONTRIBUTING.md`.

### L'atelier

Le dépôt se construit dans des ateliers : chacun réfléchit, sonde et modélise chez soi, avec son assistant s'il en a un, avant de proposer. `atelier-modele/` est un squelette à copier, avec des gabarits commentés et des instructions pour un assistant (`AGENTS.md`). Il se prend en main en dix minutes : voir `atelier-modele/LISEZMOI.md`.

### Où voir les modèles

Chaque modèle a une fiche en clair (la question, ce qui entre, comment il calcule, l'hypothèse qui porte le résultat, ce que l'IA a choisi elle-même, ce qu'il ne fait pas, comment le refaire), en plus de la méthode détaillée et du code. Sur le site : les modèles et leurs fiches sous `/fr/modeles/`, et ce que l'IA a choisi elle-même sur `/fr/choix-de-l-ia.html`. Dans ce dépôt : `modeles/<nom>/fiche.md` pour la fiche, `methode.md` pour la méthode.

## Comment lire

1. **Le manifeste** : `chapitres/` (15 fichiers, de `00-introduction.md` à `14-conclusion.md`). Chaque chapitre se lit à trois niveaux, au choix : l'essentiel (points clés), simplifié, complet (sources, formules, modèles). Les notes `[^id]` en bas de chapitre donnent les sources ; la synthèse en fin de chapitre dit ce que chaque source établit.
2. **Les dossiers de sources** : `sources/*.md`. Un dossier par question (retraites, logement, énergie, justice, démocratie directe, comparaison européenne…) avec les faits sourcés, les estimations, les opinions et les objections adverses.
3. **Les modèles** : `modeles/`. Chaque dossier contient la fiche en clair (`fiche.md`) quand elle existe, la méthode (`methode.md`, hypothèses numérotées), les données ouvertes (`donnees/`), le code, les tests et les résultats.
4. **Les calculs consolidés** : `sources/calculs/`, dont `bilan_global.py`, qui additionne les effets de chaque mesure poste par poste et vérifie par des tests que la somme redonne le solde des modèles.

Les chiffres sont des ordres de grandeur sous hypothèses, jamais des prédictions. Chaque fait est marqué comme **fait sourcé**, **estimation** (avec sa méthode de calcul) ou **opinion de l'auteur**. Les affirmations non vérifiées portent la mention `⚠️ À VÉRIFIER`.

## Organisation du dépôt

| Dossier | Contenu |
|---|---|
| `chapitres/` | Les 15 chapitres de la version 0.2 |
| `sources/` | Dossiers de sources et de chiffrage (Markdown), données en CSV (`sources/donnees/`, inventaires), calculs reproductibles (`sources/calculs/`, avec leurs résultats `*_resultats.txt`) |
| `modeles/systeme-ideal/` | Le système proposé : couches successives de simulation en JavaScript (de `modele.js` à `decisions_0811.js`), un test par couche (`test_*.js`), un rapport par couche (`rapport_*.js`), les résultats (`resultats*.txt`, `sorties/*.csv`), `lancer.py` pour tout exécuter |
| `modeles/gagnants-perdants/`, `capital-de-depart/`, `fiscalite-orientation/`, `risques/`, `retraites/`, `reactions-assiettes/` | Modules chargés par le système : cas types et droit actuel, capital de départ, fiscalité d'orientation, tests de résistance, retraites |
| `modeles/etat-as-code/` | « L'État comme code » : organismes, compétences, démarches, règles de droit, flux financiers, sous forme de tables liées (`datapackage.json`), invariants testés, rapport |
| `modeles/grand-livre/` | Grand livre des comptes publics : État, collectivités, organismes, associations, effectifs, instances ; rapports et bouclages avec les comptes nationaux |
| `modeles/carte-du-droit/` | Carte des codes juridiques : sommaire, classement par thème, sort proposé |
| `modeles/demographie/`, `prospective-demographie/` | Projection démographique (Insee 2026), validation, sensibilités |
| `modeles/grand-age/` | Financement de l'hébergement et de l'aide à domicile des personnes âgées |
| `modeles/loyers-energie/`, `loyer-energie/` | Loyers, diagnostic de performance énergétique et plafond lié à l'énergie |
| `modeles/securite-justice/`, `education/`, `etat-plateforme/`, `industrie-complexite/`, `reconversion/`, `bascule-existant/`, `acceleration/` | Autres modèles cités par les chapitres |
| `atelier-modele/` | Squelette d'atelier à copier : gabarits de proposition, de méthode, de fiche, de calcul et de test, instructions pour un assistant, liste de vérification |
| `registre-anomalies/` | Registre des incohérences relevées dans les textes de droit (fiches `AN*.md`, chacune avec une citation mot pour mot vérifiable) |
| `outils/droit/` | Outils d'analyse du corpus juridique et de contrôle du registre |
| `prototypes/referendum/` | Preuve de concept (non auditée) d'un référendum numérique vérifiable |
| `donnees-brutes/` | Quelques données brutes ouvertes nécessaires à un calcul (Eurostat) |
| `site/` | La page d'accueil du site |
| `INVENTAIRE.md` | Liste de tous les fichiers du dépôt et des renvois vers des documents non publiés, générée |

## Refaire les calculs

Prérequis : Python 3.9 ou plus (bibliothèque standard seulement pour presque tout), et pour le système proposé le moteur JavaScript `jsc` (déjà présent sur macOS à `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc` ; ailleurs, paquet WebKit « jsc », ou variable d'environnement `JSC`). Tout se lance depuis la racine du dépôt.

**Le système proposé** (dernière couche, décisions du 07 et du 08/11/2026) :

```sh
python3 -I modeles/systeme-ideal/lancer.py test      # les contrôles de la couche, code de retour 0 si tout passe
python3 -I modeles/systeme-ideal/lancer.py rapport   # doit redonner exactement modeles/systeme-ideal/resultats_decisions_0811.txt
python3 -I modeles/systeme-ideal/lancer.py export    # la ligne EXPORT recopiée dans sources/calculs/bilan_global.py (DECISIONS0811)
python3 -I modeles/systeme-ideal/lancer.py liste     # la commande jsc complète, pour la lancer à la main
```

Les couches se chargent les unes après les autres (l'ordre est celui de `lancer.py`). L'en-tête de chaque `test_*.js` indique la liste de fichiers à charger pour cette couche.

**Le bilan global avant/après** :

```sh
python3 -I sources/calculs/bilan_global.py          # tests puis synthèse (« Tests : tous passés. »)
python3 -I sources/calculs/bilan_global.py --md     # tableaux en Markdown
```

**Les chiffrages** de `sources/calculs/` : `python3 -I sources/calculs/<nom>.py` (la sortie attendue est dans `<nom>_resultats.txt`). Par exemple `nucleaire_budget.py`, `plan_de_bascule.py`, `petits_reacteurs_serie.py`, `reorientation_complexite.py`, `inventaire_niches.py`, `outre-mer-vie-chere.py`, `cout_votation.py`, `bascule_collectivites.py`, `economies_benchmark_europeen.py` (données Eurostat incluses dans `donnees-brutes/`).

**Les autres modèles** :

```sh
python3 -I modeles/demographie/tests/test_projection.py
python3 -I modeles/grand-age/tests/test_grand_age.py
python3 -I -m unittest discover -s modeles/etat-as-code/tests     # 6 « échecs attendus » : ils listent les défauts de l'État actuel
python3 -I modeles/etat-as-code/code/rapport.py
python3 -I outils/droit/registre.py --controle                    # les fiches du registre sont complètes
python3 -I outils/droit/test_registre.py
(cd modeles/securite-justice && python3 -m unittest test_modele)
(cd modeles/education && python3 -m unittest test_modele)
(cd modeles/loyers-energie && python3 -m unittest test_modele)
(cd modeles/acceleration && jsc modele.js test_modele.js)         # idem bascule-existant, etat-plateforme, industrie-complexite, reconversion
(cd modeles/retraites && jsc modele.js test_modele.js)            # puis capitalisation.js test_capitalisation.js ; age_libre.js test_age_libre.js
```

Chaque modèle a sa documentation dans `methode.md` (hypothèses numérotées, effets de comportement, scénarios bas, central et haut) et `resultats.md`.

**Le prototype de référendum** : `cd prototypes/referendum && npm install && npm test` (Node 24 ou plus ; il télécharge ses trois dépendances).

### Données à retélécharger

Les fichiers de plus de 20 Mo et les PDF de tiers ne sont pas dans le dépôt (licences de redistribution variables) : seuls l'URL et la référence sont gardées dans les fichiers de méthode et de sources. Les scripts qui reconstruisent un jeu de données depuis sa source officielle (par exemple `modeles/loyers-energie/telecharger_donnees.py`, `modeles/prospective-demographie/donnees/preparer_*.py`, `sources/calculs/energie_europe.py`, `eurostat_synthese_ue.py`, `infractions_ue_2026.py`, `seuils_signatures.py`, `modeles/grand-livre/code/recettes.py`, `outils/droit/registre.py --verifier`) lisent leurs entrées dans un dossier désigné par la variable d'environnement `DONNEES` (dans l'atelier d'origine, un dossier à part contenant les téléchargements bruts). Pour les refaire : télécharger le fichier source cité dans l'en-tête du script, le placer sous `$DONNEES/…` au chemin indiqué, exporter `DONNEES`, puis relancer. Les résultats déjà calculés sont publiés (`*_resultats.txt`, `resultats*.md`, `donnees/*.csv`) : **les tests et les calculs listés plus haut tournent sans ces téléchargements** ; seule la reconstruction des tables à partir des sources brutes les demande.

## Auditer avec Claude Code ou un autre assistant

Le dépôt est écrit pour être relu par une machine autant que par vous. Installez [Claude Code](https://claude.com/claude-code) (ou tout assistant de code), ouvrez le dossier et demandez par exemple :

- « Refais le calcul du cas type Smic et dis-moi si le chapitre 3 dit la même chose. »
- « Vérifie la source de la note `[^dila]` du chapitre 7 : le chiffre est-il bien dans le document cité, et quelle est sa fiabilité ? »
- « Lance `python3 -I sources/calculs/bilan_global.py` et dis-moi quelles lignes reposent sur une hypothèse sans source. »
- « Cherche les contradictions entre le chapitre 12 (les comptes) et `sources/chiffrage-decisions-0811.md`. »
- « Quelle est la meilleure objection à la fonction du patrimoine, et le chapitre y répond-il ? »

Voir `CONTRIBUTING.md` pour proposer ce que vous trouvez.

## État et limites

- **Version 0.2, document de travail.** Les chiffres sont des ordres de grandeur sous hypothèses. Il y a des erreurs : signalez-les (voir `CONTRIBUTING.md`).
- **Registres internes non publiés.** Les dossiers renvoient parfois à des registres de travail : numéros de vérification (`V1234`), registre des positions de l'auteur (`L762`, `P-198`). Ils ne sont pas encore publiés ; ces renvois sont des étiquettes, pas des liens. Les points non vérifiés restent marqués `⚠️ À VÉRIFIER` dans le texte lui-même.
- **Liens vers des documents non publiés.** Quelques fichiers en citent d'autres qui ne sont pas encore dans le dépôt (anciens chapitres, simulateurs, dossiers de sources secondaires) ; `INVENTAIRE.md` en donne la liste. Ils seront ajoutés au fil de la relecture.
- **Voix des dossiers.** Les dossiers de `sources/` et de `modeles/` sont des documents de travail écrits par l'IA pour l'auteur : ils s'adressent parfois à lui et signalent ses choix, ses tensions et les biais de l'IA elle-même (conflit d'intérêts : l'IA est produite par une entreprise qui vend des outils d'IA ; l'auteur travaille dans une entreprise de logiciel). C'est voulu : la règle est d'écrire pour que ce soit vrai, pas pour que ce soit aimable.
- **Aucun conseil juridique ni fiscal.** Le registre des anomalies du droit n'a pas été relu par un juriste.
- **Les modèles de simulation ne sont pas des prédictions.** Les effets de comportement et de rebond sont des hypothèses sourcées, avec trois scénarios.

## Licences

- **Texte** (`chapitres/`, `site/`, dossiers Markdown de `sources/`, `modeles/` et `registre-anomalies/`) : [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.fr), voir `LICENSE-TEXTE.md`.
- **Code et données produites par le projet** (scripts, modèles, tables dérivées, résultats) : licence MIT, voir `LICENSE`.
- **Données de tiers** reprises ou transformées (Insee, Eurostat, DGFiP, DREES, ADEME, OFGL, Légifrance, data.gouv.fr, OCDE, etc.) : elles restent sous la licence de leur producteur (le plus souvent Licence Ouverte 2.0 d'Etalab ou CC BY 4.0). Chaque fichier ou dossier cite sa source, sa date de consultation et, quand elle est connue, sa licence ; vérifiez-la avant toute réutilisation hors de ce projet.

## Qui maintient ce dépôt

Le manifeste et ses calculs sont préparés dans un espace de travail, puis publiés ici fichier par fichier, après relecture. `INVENTAIRE.md` liste ce qui est publié. Pierre Clocher est l'auteur et l'unique mainteneur de la branche principale.
