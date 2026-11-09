---
titre: Registre des anomalies du droit : les 15 plus parlantes pour un lecteur non juriste
statut: brouillon (dépôt privé, non publié ; relecture par des juristes obligatoire avant publication)
date: 2026-11-02
---

# Registre des anomalies : ce qu'on peut montrer au lecteur du manifeste

Tâche T55. Le registre complet (55 fiches, `registre-anomalies/`) reste interne tant qu'aucun juriste ne l'a relu. Cette page en tire 15 anomalies que n'importe quel lecteur comprend sans connaître le droit, en deux lignes chacune, avec le renvoi vers la fiche (texte cité mot pour mot, test, objection).

## Ce qu'est une « anomalie » (et ce qui n'en est pas une)

Une anomalie est une incohérence que l'on peut constater sur le texte, sans prendre parti : un renvoi vers un article qui n'existe plus, une règle qui annonce un décret que personne ne retrouve, un montant resté en francs, un seuil qui fait payer 500 € pour un euro, un taux marginal supérieur à 100 %, une règle écrite six fois. Ce n'est pas un choix politique : taxer fort ou peu les plus-values est un choix ; que l'impôt baisse quand le gain augmente, ou qu'une règle renvoie à un texte disparu, n'en est pas un. Quand la frontière est floue (une amende figée depuis vingt ans peut être voulue), la fiche le dit dans la rubrique « objection ».

## Méthode, en cinq temps

1. **Lire la loi comme du code** : le texte en vigueur de 78 codes (165 656 articles) est analysé par un programme (`outils/droit/analyse_corpus.py`), qui repère renvois morts, décrets absents, montants figés, dates contradictoires, cycles.
2. **Faire tourner la loi** : pour les plus-values immobilières (`outils/droit/loi_executable/`) et les taux marginaux (OpenFisca-France, `outils/droit/openfisca/`), on exécute les règles sur des cas types pour voir ce que le texte produit.
3. **Relire chaque alerte sur le texte** : seule une alerte confirmée sur le texte citée mot pour mot devient « vérifiée sur le texte » ; le reste reste « détectée ». Les citations sont recontrôlées par un script (`python3 -I outils/droit/registre.py --verifier`, 87 contrôles au 02/11/2026).
4. **Chaque fiche porte son contradicteur** : une objection ou une interprétation contraire, et la limite de la méthode (par exemple : un décret peut exister sans être codifié).
5. **Mesurer la précision** : sur un échantillon de 43 détections relues, les renvois morts « haute confiance » étaient exacts 15 fois sur 15, mais les « numéros réutilisés » 1 fois sur 4 et les cycles de report 2 fois sur 5 ; deux faux positifs de plus ont été écartés en préparant le registre (copies locales tronquées du CCH et du Code du domaine public fluvial : `registre-anomalies/ecartes.md`).

**Avant toute publication, une relecture par des juristes est indispensable** : aucune fiche n'a le statut « relue par un juriste ». Il manque la jurisprudence, la doctrine administrative (BOFiP), les décrets non codifiés, et la confrontation à la version à jour de Légifrance (les textes de départ sont des copies consultées le 02/11/2026). Les fiches fondées sur OpenFisca sont des ordres de grandeur sur des cas types, pas des prédictions, et les références d'articles de ces fiches sont à relire. Ne rien présenter comme une « erreur » sans cette relecture, et prévenir les rédacteurs des textes (secrétariat général du Gouvernement, DILA) avant toute communication.

## Les 15 anomalies

Statut entre crochets : V = vérifiée sur le texte ; D = détectée (non relue entièrement).

1. **Un euro de plus, 500 € d'impôt de plus** [V, [AN019](../registre-anomalies/AN019.md)]. La surtaxe sur les plus-values élevées est nulle à 50 000 € et vaut 500,07 € à 50 001 € : le coefficient de la première tranche est 1/20 alors que les autres sont à 1/10.
2. **Vendre un jour plus tard et payer 17 840 € de moins** [V, [AN020](../registre-anomalies/AN020.md)]. Le forfait de travaux de 15 % s'applique dès le lendemain du cinquième anniversaire de l'achat, même sans travaux : l'impôt de l'exemple chiffré passe de 29 605 € à 11 765 €.
3. **Un impôt de 347 % du gain réel** [V, [AN024](../registre-anomalies/AN024.md)]. L'impôt sur une plus-value immobilière se calcule sur la différence nominale, sans tenir compte des prix : sur un gain réel de 2 000 €, une personne mutée paie 6 936 € (cas type, inflation en partie hypothétique).
4. **0 € d'impôt à 15 000 €, 3 485 € à 15 001 €** [V, [AN022](../registre-anomalies/AN022.md)]. L'exonération des petites cessions est un seuil sec : un euro de prix de vente en plus fait tout basculer.
5. **Gagner 50 € de plus et en perdre 6** [D, [AN028](../registre-anomalies/AN028.md)]. Pour un couple avec deux enfants et un seul salarié, le calcul d'OpenFisca donne un revenu disponible qui baisse quand le salaire brut passe de 1 250 à 1 300 € par mois (RSA, aide au logement et prime d'activité se chevauchent).
6. **110 % de prélèvement implicite pour un petit temps partiel** [D, [AN031](../registre-anomalies/AN031.md)]. Pour un célibataire locataire qui gagne 700 à 750 € brut par mois, trois dispositifs d'aide se retirent en même temps : on travaille plus pour ne rien gagner de plus.
7. **134 % sur une allocation de rentrée scolaire** [D, [AN029](../registre-anomalies/AN029.md)]. À environ 2,2 SMIC pour un couple avec deux enfants, l'allocation différentielle s'éteint euro pour euro et se cumule avec d'autres pertes ; l'écart de ressources de référence (deux ans) aggrave l'effet.
8. **Une loi qui renvoie à un article disparu depuis 2008** [V, [AN039](../registre-anomalies/AN039.md)]. Le Code du sport fait référence à l'article L. 432-8 du Code du travail, qui a changé de numéro lors de la recodification : le lecteur doit deviner où est la règle.
9. **Un décret annoncé en 1991** [V, [AN035](../registre-anomalies/AN035.md)]. Le Code électoral dit que des décrets en Conseil d'État détermineront les conditions d'application d'un livre entier ; aucun décret codifié n'est retrouvé (un décret hors code peut exister : à vérifier).
10. **Un montant écrit en francs en 2005** [V, [AN042](../registre-anomalies/AN042.md)]. Le Code rural fixe une base de rente à « 2760 francs (420,76 euros) » : la conversion est exacte, mais un texte en francs vit encore vingt ans après l'euro.
11. **La même règle écrite six fois** [V, [AN006](../registre-anomalies/AN006.md)]. Pour les logements énergivores (classes F et G), loyer à la relocation, révision, réévaluation, complément de loyer et décence sont dans six rédactions, avec trois calendriers.
12. **Le texte sur les baux ne dit pas où est l'encadrement des loyers** [V, [AN004](../registre-anomalies/AN004.md)]. Le « complément de loyer » apparaît 10 fois dans la loi ELAN et jamais dans la loi de 1989, que le locataire lit pour contester son loyer.
13. **Le statut du loueur en meublé non professionnel existe, mais seulement en creux** [V, [AN008](../registre-anomalies/AN008.md)]. Il est défini à contrario par l'article 155 IV du CGI (activité « exercée à titre professionnel » sous deux conditions), mais l'expression « loueur en meublé non professionnel » n'apparaît pas dans le CGI.
14. **Deux articles qui se définissent l'un par l'autre** [V, [AN041](../registre-anomalies/AN041.md)]. Dans le Code forestier, la coupe qui exige une autorisation « comme coupe extraordinaire » renvoie à un article qui définit la coupe extraordinaire par renvoi au premier.
15. **Des règles « en vigueur » quatre mois avant leur publication** [V, [AN046](../registre-anomalies/AN046.md)]. 83 articles du Code rural portent l'intitulé d'un décret publié le 22 mars 1983 « en vigueur le 1er décembre 1982 » ; l'effet juridique de cette mention n'est pas analysé.

## Comment les utiliser dans le manifeste

- Une ou deux anomalies par chapitre concerné, jamais la liste entière ; toujours la formulation prudente de la fiche (« le texte lu dit ... », « un décret hors code peut exister »).
- Les anomalies 1 à 4 et 11 à 13 se prêtent à un encadré avec le calcul reproductible ; les anomalies 5 à 7 à un graphique de taux marginal (voir `sources/rules-as-code-taux-marginaux.md`).
- Rappel du principe de la règle 7 : ces constats ne démontrent pas qu'une règle est mauvaise, seulement qu'elle est incohérente ; la correction proposée reste une proposition.
- Le registre complet est une brique du manifeste (« un État qui corrige ses propres incohérences ») : à ouvrir au public seulement après relecture par des juristes et information préalable des rédacteurs des textes.

Sources : registre `registre-anomalies/` et livrables T55 ; texte du droit en vigueur de [codes.droit.org](https://codes.droit.org/) (XML Légifrance, DILA, consulté le 02/11/2026), [Légifrance](https://www.legifrance.gouv.fr/) pour les lois non codifiées ; OpenFisca-France 176.1.10 ([PyPI](https://pypi.org/project/OpenFisca-France/), consulté le 02/11/2026).
