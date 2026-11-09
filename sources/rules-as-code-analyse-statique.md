---
titre: Analyse statique de tous les codes en vigueur (T55, passage à l'échelle)
statut: brouillon sourcé (outil et mesures du 02/11/2026)
---

# Analyse statique du droit à l'échelle : 78 codes, 165 656 articles

Objet : passer le droit en revue comme du code, sans interprétation juridique, pour produire une liste d'**incohérences** (pas de choix politiques) à corriger. Cette page décrit la méthode, les chiffres, la précision mesurée, 15 anomalies vérifiées sur le texte, les limites et la suite. Outil : `outils/droit/analyse_corpus.py` (10 tests : `python3 -I outils/droit/test_analyse_corpus.py`). Mise à jour et relance : `outils/droit/maj_legi.py`. Résultats bruts (CSV) : `$DONNEES/resultats/droit/`. Le pilote sur les plus-values et la loi de 1989 (`outils/droit/revue_code.py`) est un autre chantier ; cette page ne le remplace pas.

## 1. Source et méthode

**Source.** XML des 78 codes de [codes.droit.org](https://codes.droit.org/) (build « Beta 0.95.6 », codes mis à jour entre juillet et novembre 2026), eux-mêmes dérivés de la base LEGI de la DILA (licence ouverte). Ils ne contiennent que le **droit en vigueur** et les renvois y sont déjà résolus par la DILA (attribut `idArticle` = identifiant stable de l'article cité). Copie locale : `$DONNEES/sources/legi/codes-droit-org/` (269 Mo). Consulté le 02/11/2026.

**Base LEGI brute rapatriée.** Export global « Freemium » du 13/07/2025 (1,17 Go) et tous les incréments quotidiens postérieurs (jusqu'au 01/11/2026), de [echanges.dila.gouv.fr/OPENDATA/LEGI](https://echanges.dila.gouv.fr/OPENDATA/LEGI/), dans `$DONNEES/sources/legi/dila/` (SHA-256 dans `LISEZMOI.md` et `MANIFESTE.tsv`). Elle contient aussi les versions **abrogées** : exploitée depuis le 02/11/2026 (voir la section « correction du 02/11 »).

**Détecteurs** (fonctions pures, flux XML, tout le corpus en 33 s) :

| Détecteur | Définition |
|---|---|
| Renvoi mort | article cité (cid) absent des articles en vigueur d'un code chargé. Séparé en « haute confiance » (numéro absent) et « numéro réutilisé » (même numéro en vigueur sous un autre identifiant : renumérotation à l'identique possible) |
| Cycles | composantes fortement connexes (Tarjan) du graphe des renvois ; et **cycles de report** : A et B se renvoient mutuellement pour définir leurs conditions (« dans les conditions prévues à l'article … ») |
| Décret absent | article de loi (L) annonçant un décret d'application sans aucun article R/D du même code de même numéro de chapitre, ni sous des titres identiques, ni cité par un article R/D |
| Montants | francs encore en vigueur ; euros dans une version vieille d'au moins 15 ans (âge = celle de la version, donc « inchangé depuis au moins ») ; pénal séparé |
| Exceptions | renvoi précédé de « sous réserve / par dérogation / sans préjudice / à l'exception / sauf… » ; plus longue chaîne ; densité de marqueurs |
| Dates | entrée en vigueur annoncée antérieure à la publication au JO ou à plus de 5 ans ; version postérieure de plus de 30 jours à l'entrée en vigueur annoncée |

## 2. Chiffres du corpus (02/11/2026)

- **78 codes, 165 656 articles en vigueur, 21,5 millions de mots** (annexes comprises : certaines annexes sont des tableaux de 25 000 à 40 000 mots).
- **186 470 renvois** vers un article, dont 182 806 résolus vers un article en vigueur (graphe) ; **chiffre corrigé le 02/11** : 1 669 renvois absents de codes.droit.org, dont 314 vivants dans LEGI ; **1 355 renvois morts classés** (abrogé 862, transféré 107, renuméroté 353, même numéro en vigueur 33 à vérifier). Les chiffres d'origine (1 575 ; 1 200 « haute confiance ») sont périmés.
- **Renvois morts par code cible** : Code de la santé publique 371, Code du travail 232, CGI 203, Code de la sécurité sociale 76 ; en moyenne 1 renvoi sur 118 pointe vers un article qui n'est plus en vigueur.
- **Cycles** : 1 335 composantes circulaires, 6 947 articles concernés ; une composante géante de **3 230 articles répartis sur 47 codes** ; **40 cycles de report** (paires qui se définissent l'une par l'autre).
- **Chaînes d'exceptions** : plus longue chaîne de 8 maillons (§ 4, n° 14).
- **7 892 articles** annoncent un décret ; **355 articles de loi** n'ont pas de texte d'application détectable (76 Code des transports, 23 fonction publique, 17 travail, 17 CGCT, 13 énergie).
- **Montants** : 1 063 montants en euros inchangés depuis 15 ans ou plus (âge médian 19,6 ans), dont 713 amendes ou peines ; **3 montants en francs** encore en vigueur.
- **Dates** : 203 entrées en vigueur antérieures à la publication au JO, 424 versions dont la date ne correspond pas à l'entrée en vigueur annoncée.
- Par code (extraits, `stats_par_code.csv`) : Code civil 2 899 articles / 181 614 mots / 0 renvoi mort ; Code du travail 11 590 / 1 065 166 / 43 ; Code de la sécurité sociale 7 429 / 1 210 995 / 169 ; CCH 4 126 / 761 126 / 21 ; CGI 2 407 / 793 088 / 50. Le Code de la santé publique est le plus long (13 667 articles, 1,82 million de mots).
- Plus renvoyé : CASF L312-1 (380 renvois entrants), puis Code pénal 121-2 (254), 226-13 (244).

## 3. Précision mesurée (vérification humaine, 02/11/2026)

43 détections tirées au hasard (graines 7, 11, 2026), relues sur le texte de l'article cité et, pour les renvois, sur le code cible. Échantillon petit : les taux sont indicatifs (⚠️ intervalles larges).

| Détection | Lues | Vrai | Faux | Non tranché | Précision |
|---|---|---|---|---|---|
| Renvoi mort, haute confiance (méthode d'origine, périmée) | 15 | 15 | 0 | 0 | 15/15 (voir correction) |
| Renvoi mort, « numéro réutilisé » | 4 | 1 | 3 | 0 | 1/4 (renumérotation à l'identique : R122-6 CCH, 302 M CGI, 222-22 CP) |
| Décret d'application absent | 10 | 4 | 0 | 6 | 4/10 certains ; aucun faux prouvé, mais la vérification hors code est impossible ici |
| Montant figé (euro ≥ 15 ans / franc) | 8 | 8 | 0 | 0 | 8/8 sur le fait ; le sens n'est une anomalie que pour les montants non pénaux |
| Date incohérente | 10 | 10 | 0 | 0 | 10/10 sur le fait ; 4 sur 10 sont une rétroactivité réelle, 6 une métadonnée contradictoire (gravité faible) |
| Cycle de report | 5 | 2 | 2 | 1 | 2/5 (CMF L313-29-2 et CPP 568-1 : renvois réciproques sans circularité de définition) |

**Corrections faites à l'outil à cause de ces relectures** : (1) le Code des douanes du site n'a **aucun article numérique** (1 à 500) : 3 faux renvois morts sur 10 d'un premier échantillon, code exclu comme cible ; (2) « numéro réutilisé » séparé du reste ; (3) extraction du numéro cité : « 302 M du » était lu comme un numéro ; (4) « 1 franchit » lu comme « 1 franc » : frontière de mot ajoutée ; (5) décret absent : ajout de la correspondance par titres de chapitre et par citation par un article R/D (numérotations L/R non parallèles, Code des postes par exemple : 497 → 355) ; (6) chaînes d'exceptions : les nœuds circulaires sont signalés (la chaîne affichait un représentant trompeur) ; (7) dates : comparaison à la date du JO (dans l'intitulé) et non à la date de début de version.

## 4. Les 15 anomalies les plus parlantes (vérifiées sur le texte)

Chaque ligne : article, version (début de version / texte modificatif), constat, cas où elle mord, gravité. Sources : XML codes.droit.org consultés le 02/11/2026 ; vérification d'existence faite dans l'ensemble des codes. « Corpus » = articles en vigueur de ces 78 codes.

1. **Code électoral L384** (version du 14/05/1991, loi 91-428 art. 3). « Des décrets en Conseil d'Etat détermineront les conditions d'application du présent livre » (futur de 1991). Aucun article R ou D de même numérotation, de titre jumeau, ni citant L384. Mord : une règle législative sans mode d'emploi codifié depuis 35 ans. Gravité : moyenne. ⚠️ Un décret non codifié peut exister (non vérifié).
2. **Code général de la fonction publique L714-15** (05/12/2021, ordonnance 2021-1574). « Les modalités d'application du présent chapitre sont déterminées par décret. » Rien dans le corpus. Gravité : moyenne ⚠️ même réserve.
3. **Code de la santé publique R2222-3** (27/05/2003, décret 2003-462). « La récidive des contraventions prévues aux articles R. 2222-1 et R. 2222-2… » : R2222-1 et R2222-3 existent, **R2222-2 n'existe plus**. Mord : une sanction de récidive vise une infraction qui n'existe plus ; le texte reste lisible mais incomplet. Gravité : faible à moyenne.
4. **CGI annexe II, art. 286 I** (07/06/2019, décret 2019-559). Le IX conditionne la validation des documents « mentionnés aux articles 302 M, 302 M bis et **302 M ter** du CGI » : 302 M ter n'est plus en vigueur (302 M et 302 M bis le sont). Mord : un entrepositaire de produits vitivinicoles doit respecter une comptabilité matières pour un document dont un des fondements a disparu. Gravité : moyenne.
5. **Code du sport L121-8** (25/05/2006, ordonnance 2006-596). L'association est constituée « conformément à l'article L. 121-1 du présent code et à l'article **L. 432-8 du code du travail** » : la numérotation d'avant la recodification de 2008 ; L432-8 n'existe plus dans le Code du travail du corpus. Mord : le texte d'un régime (association sportive d'entreprise) renvoie à une règle sans objet identifiable. Gravité : moyenne.
6. **Code de l'environnement R541-133 ↔ R541-139** (29/11/2020, décret 2020-1455 ; REP, prime au retour). R541-133 dispense de la prime au retour quand elle est démontrée inutile « dans les conditions prévues à R541-139 » ; R541-139 renvoie à R541-133 pour la démonstration. Renvoi mutuel pour définir la condition. Mord : un producteur ne trouve la règle dans aucun des deux articles. Gravité : moyenne.
7. **Code forestier (nouveau) R312-9 ↔ R312-12**. R312-9 : coupe soumise à autorisation « comme coupe extraordinaire, dans les conditions prévues aux articles R. 312-12 et R. 312-13 » ; R312-12 définit les coupes extraordinaires par « les coupes effectuées dans les conditions prévues à l'article R. 312-9 ». Gravité : moyenne (définition circulaire d'une catégorie qui déclenche une autorisation).
8. **Code rural et de la pêche maritime R753-7** (22/04/2005, décret 2005-368). Salaire annuel minimal pour la rente d'accident : « fixé à **2760 francs (420,76 euros)** ». Un montant en francs est en vigueur 23 ans après l'euro ; la conversion est aussi à vérifier : 2 760 F valent 420,76 euros au taux 6,55957. Mord : si le nombre est lu en francs, la base est dérisoire. Gravité : moyenne ; correction : réécrire en euros ou renvoyer à un barème indexé.
9. **Code de commerce, annexe 8-2** (19/09/2019, décret 2019-966). Compte général de la Caisse des dépôts : « limite d'un encours maximum de **100 000 francs** par affaire ». Un décret de 2019 écrit en francs. Mord : quelle devise, quel taux (⚠️ non lu : franc français ou franc CFP ?). Gravité : moyenne.
10. **Code pénal 131-13** (27/01/2005, loi 2005-47). Contraventions : « 38 euros au plus » (1re classe), 150, 450, 750, 1 500 euros ; plafond de 3 000 euros. Inchangé depuis 21 ans. Mord : dissuasion érodée par l'inflation (non chiffrée ici ⚠️, il faut l'indice des prix INSEE) ; il s'agit d'un choix de politique pénale autant que d'une anomalie : classé « montant figé », pas « bug ». Gravité : faible.
11. **Code de l'environnement R214-92** (23/03/2007, décret 2007-397). Le préfet consulte l'établissement public territorial de bassin « lorsque le projet a un coût supérieur à **1 900 000 euros** ». Seuil d'un chiffre non rond, figé depuis 19 ans (coût de travaux). Mord : de plus en plus de projets déclenchent la consultation sans que le législateur l'ait décidé. Gravité : faible à moyenne.
12. **Code rural L451-13 (et L451-4, L441-11, L451-8)** (version du 17/04/1991, décret 83-212 du 16/03/1983, JORF du 22/03/1983). L'intitulé annonce une entrée en vigueur au **1er décembre 1982**, quatre mois avant la publication. Mord : rétroactivité déclarée par décret pour des règles de droit fiscal de l'emphytéose (renvoi à l'art. 689 CGI). Gravité : moyenne ; ⚠️ l'effet juridique réel de cette mention n'est pas analysé.
13. **Code monétaire et financier L231-19** (16/12/2000, ordonnance 2000-916). L'intitulé de la version donne « JORF 22 septembre 2002 » pour une ordonnance du 19 septembre 2000. Erreur de métadonnée de la base ; effet : l'article apparaît comme en vigueur avant sa publication. Gravité : nulle sur le fond, utile pour fiabiliser les bases.
14. **Chaîne d'exceptions de 8 maillons (CGI/CMF)** : CGI 218 (« sous réserve des dispositions … de l'article 219 ») → CGI 219 (« sans préjudice de … 38 bis A ») → CGI 38 bis A (« par dérogation à l'article 38 ») → … → CMF L214-28 (« par dérogation à l'article L. 214-24-34 ») → L214-24-34 (« sous réserve de l'article L. 214-24-41 ») → L214-24-41 (« par dérogation à l'article L. 214-24-48 »). Six sauts sur sept relus ; le saut du nœud circulaire {38, voisin} vers le CMF n'est pas relu ⚠️. Mord : pour savoir l'impôt sur les sociétés d'un fonds, il faut empiler huit textes de deux codes. Gravité : moyenne (complexité plus que contradiction).
15. **Composante circulaire géante** : 3 230 articles de 47 codes (Code de commerce L123-28, L141-12…, Code du travail, CASF, environnement, …) sont accessibles les uns depuis les autres par renvois. Ce n'est pas une anomalie article par article (une très grande partie est bénigne : codes qui se citent) ; elle mesure l'impossibilité de lire ou de tester une règle isolément, donc le coût d'une revue manuelle. Gravité : structurelle.

À noter, hors des 15 : le Code des douanes du site est amputé de ses articles numériques ; l'annexe 10 du CESEDA fait 40 280 mots (plus long « article » du corpus, un tableau) ; la liste de 1 200 renvois morts de haute confiance (`renvois_morts.csv`) est le principal registre à transmettre.


## Correction du 02/11 (soir) : l'erreur et les chiffres revus

**Ce qui avait été dit.** Deux copies locales de codes.droit.org paraissaient tronquées (CCH : une seule L111-x ; Code du domaine public fluvial : un article), donc certains renvois « morts, haute confiance » semblaient des faux positifs, et les chiffres « 15/15 » et « 1 200 renvois morts de haute confiance » étaient à revoir.

**Ce que la base LEGI complète montre** (export global du 13/07/2025 + 483 incréments jusqu'au 02/11/2026, 556 156 versions d'articles de codes, `outils/droit/legi_complet.py`, 10 tests) :
- **Aucune copie n'est tronquée.** Les 165 656 articles en vigueur de codes.droit.org sont tous retrouvés dans LEGI (165 270 en vigueur aussi dans LEGI ; écarts : abrogations programmées, Code des douanes de Mayotte, V4304). Le CCH ne montre qu'une L111-1 parce que le livre Ier a été recodifié : L111-2 à L111-41 sont abrogés (dont L111-7, abrogé le 2021-07-01). L'article 176 du code du domaine public fluvial est abrogé depuis le 2014-05-28 ; ce code n'a plus aucun article en vigueur dans LEGI. La garde « code tronqué » (copie < 90 % de LEGI) ne signale qu'un code de 7 articles (marine marchande, 6 présents).
- **L'écart du matin était donc une erreur dans l'autre sens** : les deux « faux positifs » étaient de vrais renvois morts. L'absence d'un article dans un code complet signifie abrogation ou recodification, pas troncature.
- **La vraie source de faux positifs était ailleurs** : sur 1 669 renvois absents de codes.droit.org, **314 sont vivants** (293 en vigueur, 21 en vigueur futur) : le renvoi vise une version ancienne d'un article qui existe toujours sous un autre identifiant. La méthode d'origine les comptait comme morts.

**Chiffres corrigés** (`resultats/droit/renvois_morts.csv`, `synthese_renvois_morts.csv`) :

| Classe | Renvois |
|---|---|
| Abrogé (date d'abrogation donnée) | 862 |
| Transféré ou déplacé, sans successeur identifié | 107 |
| Renuméroté (lien LEGI vers un article en vigueur d'un autre numéro) | 353 |
| Même numéro en vigueur sous un autre identifiant (à vérifier, probablement vivants) | 33 |
| **Total classé** | **1 355** |
| Écartés : vivants dans LEGI | 314 |
| Inexistant dans LEGI | 0 (le repli par numéro retrouve toujours une version abrogée) |

Sur les 1 200 « haute confiance » d'origine : 24 étaient vivants, 817 abrogés, 104 transférés, 255 renumérotés. Sur les 375 « numéro réutilisé » : 290 vivants, 12 abrogés, 40 renumérotés, 30 même numéro, 3 transférés. Le Code des douanes, exclu jusque-là, ajoute 94 renvois.

**Précision corrigée.** 30 renvois classés tirés au hasard (graine 2026), relus sur le texte du renvoi et sur l'historique LEGI de l'article cité : **27 vrais sur 30 (90 %, intervalle de Wilson à 95 % : 74 % à 97 %)**. Par classe : abrogé 19/19, transféré 2/2, renuméroté 6/8, même numéro 0/1. Les trois faux : CCH L831-1 (renvoi vivant, la version citée est ancienne) et CSP R5121-167 (même numéro en vigueur), deux cas rangés depuis dans « même numéro en vigueur » ; et Code de l'environnement R123-23 (le lien DILA pointe vers le Code de l'urbanisme alors que le texte vise le même code, V4302). ⚠️ Cette règle a été ajustée après lecture de l'échantillon : à retester sur un échantillon indépendant (V4305). Le « 15/15 » d'origine ne vaut plus pour la liste actuelle. Précision hors « même numéro » : 27/29 (93 %). La vérification s'appuie sur LEGI, pas sur Légifrance en ligne (V4301).

**Fiches du registre.** Les 8 fiches de renvoi mort vers un code (AN037-039, AN049-052 ; AN001-002 visent la loi de 1989, AN016 le CGI) tiennent : `registre.py --verifier` donne 87 citations vérifiées, 0 échec, et l'historique LEGI confirme chaque article cité comme non en vigueur (R2222-2 abrogé 2021-04-18 ; L432-8 transféré 2008-05-01 ; R4623-29 abrogé 2022-04-28 ; R241-51 abrogé 1987-01-01 ; 302 M ter abrogé 2023-02-13). Une précision ajoutée à AN051 (1649 quater H : version annoncée au 01/01/2030). Aucune fiche rétrogradée.

## 5. Limites

- **Distinction abrogé / renuméroté** : faite depuis le 02/11 par LEGI (dates, liens de transfert et de concordance), avec les réserves de la section « correction ».
- **Renvois sans lien balisé** (« l'article suivant », « le même article », sous-divisions « 3° du II ») non pris en compte ; les renvois vers des textes non codifiés (lois, décrets) ne sont pas testés.
- **Un cid qui change sans changement de sens** (recodification à l'identique) produit un faux mort : d'où la séparation « numéro réutilisé ».
- **Décret absent** : seuls les décrets codifiés dans les codes chargés sont visibles ; arrêtés non détectables ; un décret non codifié ou classé sous une autre numérotation donne un faux positif possible (6 cas sur 10 non tranchés).
- **Montants** : l'âge est celui de la version de l'article, pas celui du montant (une version récente peut recopier un vieux montant : le constat reste « inchangé depuis au moins », mais l'inverse n'est pas vu). Aucune correction d'inflation faite ⚠️.
- **Cycles** : la plupart sont bénins ; seuls les cycles de report sont une alerte, avec 40 % de précision mesurée (n = 5).
- **Échantillon** de 43 détections ; la précision par type est indicative.
- Aucune lecture juridique : l'outil détecte des indices vérifiables, la décision appartient à la revue humaine, qui doit rester celle d'un juriste pour les anomalies publiées (⚠️ relecture juridique avant publication).
- Points non confirmés enregistrés dans `verifications.md` (V4050-V4057 ; V4300-V4305 pour la correction).

## 6. Suite : trois couches

0. **Exploiter LEGI brut** (fait le 02/11 pour les renvois ; reste les décrets absents, base JORF). Lire les versions abrogées pour distinguer abrogé / renuméroté / recodifié à l'identique, dater chaque renvoi mort, retrouver le texte d'application des décrets (base JORF), et mesurer l'érosion réelle des montants avec l'indice des prix (INSEE). Précision visée sur les renvois : > 99 %.
1. **Revue assistée par IA article par article**, ordonnée par le graphe : pour chaque article, fournir à un modèle son texte, les textes des articles cités et citants, et le catalogue d'anomalies (contradiction de seuils, définitions manquantes, exceptions imbriquées, effets de seuil) ; sortie structurée (article, version, constat, extrait, gravité, correction proposée, objection) ; échantillon relu par un juriste, précision mesurée par type avant toute publication (même protocole qu'au § 3, avec n ≥ 100 par type). Commencer par les 1 575 renvois morts, les 355 décrets, les 40 cycles de report, puis les composantes à forte densité d'exceptions. Aucun résultat de modèle n'est publié sans relecture.
2. **Loi exécutable sur les domaines de flux** (impôts sur le revenu, prestations, cotisations, retraites) en réutilisant [OpenFisca-France](https://github.com/openfisca/openfisca-france) (licence AGPL ; ⚠️ version et couverture non lues) : comparer le texte de loi (graphe des renvois), le code OpenFisca et des cas types, pour trouver les contradictions que seul le calcul révèle (taux marginaux supérieurs à 100 %, effets de seuil, discontinuités). Le pilote `outils/droit/loi_executable/` (plus-values) sert de gabarit. Les calculs restent reproductibles dans `sources/calculs/`.
3. **Registre public** : un fichier par anomalie, format fixe (article et version, constat vérifiable, cas où elle mord, gravité, correction, objection), ouvert aux contributions, avec pour chacune un état (détectée, relue, confirmée, signalée, corrigée).

## Vérification du 04/11/2026 : les tableaux des articles sont-ils perdus par le lecteur ? (T55)

**Contexte.** Le 04/11, `outils/droit/revue_code.py` s'est révélé aveugle aux tableaux (balises `<table>`, souvent sous `<center>`) : il ne lisait que les `<p>` enfants directs, d'où la perte des barèmes des articles 777 et 669 du CGI. Question : le lecteur de l'analyse du corpus (`analyse_corpus.py`) a-t-il le même défaut ?

**Mesure** (copie codes.droit.org du 02/11/2026, 165 657 articles en vigueur, 78 codes) : **2 416 articles contiennent un tableau** (1,5 %), pour **774 944 mots de tableaux** (3,6 % des 21,5 millions de mots). Dans 2 376 d'entre eux, un lecteur limité aux `<p>` directs perd le tableau (≈ 760 000 mots) ; dans 40, il ne lit rien.

**Verdict pour `analyse_corpus.py` : aucune perte.** `aplatir` parcourt récursivement tous les éléments (le texte des `<table>` est lu, comme celui des `<center>`). Les cellules restaient séparées par les espaces et sauts de ligne du XML (25 collisions sur 104 333 frontières de cellules). Durcissement sans enjeu : `tr`, `td`, `th` ajoutent désormais une espace (+28 mots au total, tous dans le Code de la sécurité intérieure ; test `test_tableaux_conserves`). Analyse relancée en entier (42 s) : **renvois morts (1 355), cycles (1 335 ; 6 947 articles), décrets sans application (355), montants figés (1 066 dont 3 francs), dates incohérentes (627) : identiques au chiffre publié** ; les CSV de renvois morts, décrets, dates sont identiques octet pour octet. Les montants figés ne changent qu'à la marge : le libellé de contexte de 2 lignes (annexe 7-4-1 du Code de commerce) est décalé de quelques caractères. Les chiffres des sections 2 à 4 restent donc valables ; les montants figés dans des barèmes étaient déjà lus.

**Autres lecteurs de `outils/droit/`.** Trois lisaient les seuls `<p>` directs : `bascule_2027.articles_xml` (et donc `bascules_futures.py`, qui l'importe), `substitutions.paragraphes_xml` et `relecture/dossier.py` (affichage des textes cités aux relecteurs). **Corrigés** le 04/11 (`texte_avec_tableaux` de `revue_code.py` ; lignes de tableau ajoutées en fin d'alinéas pour les substitutions). Effet mesuré sur les bascules : **aucun** (1 376 renvois cassés, 1 060 indéterminés, 212 morts, 104 prévus : fichiers identiques avant/après), parce que les liens `destinationid` étaient déjà lus dans les tableaux (`el.iter("a")`) et que les renvois « en clair » ne portent pas sur des tableaux ; effet attendu sur les substitutions : les chaînes situées dans un tableau cessent d'être classées « orphelines » à tort. Les lecteurs `seuils_effectifs.py`, `renvois_vers_abroges.py` et `cgi_articles_supprimes.py` lisaient déjà récursivement. `legi_complet.py` ne lit pas de texte d'article ; `revue_ia_niches_ir.py` lit le `BLOC_TEXTUEL/CONTENU` brut de LEGI en supprimant les balises, donc tableaux compris.

**Remarque annexe (non corrigée).** La colonne `articles_dans_cycles` de `stats_par_code.csv` par code varie d'une exécution à l'autre (ordre des ensembles, `PYTHONHASHSEED`) alors que le total (6 947) est stable : à lire comme un ordre de grandeur par code. À stabiliser plus tard (V11671).

Sources : mesures locales du 04/11/2026 sur `$DONNEES/sources/legi/codes-droit-org/` ; code `outils/droit/analyse_corpus.py`, `test_analyse_corpus.py` (13 tests), `test_bascule_2027.py` (18 tests).


## Contrôle de complétude de la base locale du 04/11/2026 (T55, V12560)

**Question.** La copie locale du code de l'éducation compte 1 038 articles législatifs en vigueur : est-elle tronquée ? Les autres codes le sont-ils, et quelles revues de la nuit ont pu manquer des articles ?

**Méthode** (`outils/droit/completude_base.py`, 4 tests ; tableau complet : `$DONNEES/sources/legi/extrait/completude_parties.tsv`, 262 lignes code × partie). Trois comptages indépendants des articles en vigueur au 04/11/2026 pour les 78 codes, par partie (L, R, D, A, annexes, numéros sans lettre, autres) : (1) XML de codes.droit.org (copie du 04/11, `lastup` du code de l'éducation : 31/10) ; (2) base LEGI de la DILA extraite en SQLite (export global du 13/07/2025 + 485 incréments jusqu'au 03/11/2026 : l'extraction avait un jour de retard, rattrapé) ; (3) **tables des matières de la DILA** (fichiers `section_ta`, listes `LIEN_ART` par section, dernière version de chaque section dans les incréments), qui ne passent pas par les fichiers d'articles. La date de contrôle est le 04/11 (`legi_complet` calcule « en vigueur » au 02/11 par défaut : les articles entrés en vigueur les 03 et 04/11 y sont encore « futurs »).

**Résultats.**
- **Total** : 165 657 articles en vigueur dans codes.droit.org, 165 355 dans LEGI (écart net 302), 165 306 dans les tables des matières. **72 codes sur 78 ont exactement le même nombre dans LEGI et dans les tables des matières** ; les 6 autres s'écartent de 29 (Code de la sécurité sociale) à 1 article.
- **Code de l'éducation : aucune troncature.** L 1 038 (identique dans les trois sources), R 1 740 (idem), D 2 272 (LEGI et tables) contre 2 273 (codes.droit.org), annexes 3 contre 1 ; total LEGI 5 054, tables 5 054, codes.droit.org 5 053. Le chiffre de 1 038 articles L est donc celui de la base de la DILA : 1 203 numéros L ont existé dans LEGI, 1 038 sont en vigueur (le Livre VII en compte 164 sur 500 versions historiques). Une retéléchargement du fichier du code (04/11) redonne 5 053 articles : pas d'échec de téléchargement. ⚠️ Je n'ai pas pu comparer à Légifrance : le site répond « 403 / Just a moment » à l'accès automatisé (Cloudflare) ; rien n'a été contourné. La comparaison à Légifrance reste à faire à la main (V12590).
- **Écarts codes.droit.org / LEGI par code** (hors Code des douanes de Mayotte, 328 articles dans codes.droit.org et 0 dans LEGI, déjà noté V4304) : le plus gros est l'ajout d'articles entrés en vigueur après la copie (Code de l'énergie D : 13, CIBS A et D : 21, 11/04), les abrogations de novembre (sécurité sociale D : 14), de juillet (forestier D : 21, dont 20 abrogés en 07/2026 et encore « en vigueur » dans codes.droit.org ; V12598) et 14 articles du Livre des procédures fiscales dont LEGI marque l'**abrogation au 01/05/2027** (état « ABROGE » avec date de fin future : 16 versions dans toute la base, traitées comme abrogées par `etat_resume`, comme « en vigueur » par codes.droit.org ; V12594).
- **Articles de LEGI absents de codes.droit.org** (aucune version de l'article dans la copie du code) : **112 sur 165 355 (0,07 %)**, liste dans `resultats/droit/articles_absents_codes_droit_org.csv` : **46 annexes** (Code de commerce 30, Code des transports 18, Code du travail 3, Code de l'éducation 2 annexes de 2006, pensions militaires 1…) que codes.droit.org n'exporte pas, **16 articles entrés en vigueur le 04/11** (D122-x du Code de l'énergie, D37 des pensions…), **23 le 10/10/2026** (A322-x et D322-x du CIBS : 21 ; D521-2-x de la consommation : 2), **6 sans numéro dans LEGI** (CIBS 1, CSP 1, procédure pénale 2, fonction publique 2) et 21 articles isolés ( L134-31 et R433-1 de l'énergie, R4422-2 du CGCT, L4312-8 du CSP, R161-19-1 de la sécurité sociale, L116-1 du service national, 302 B du CGI…).
- **Cause des écarts** : la conversion de codes.droit.org (annexes non exportées, articles sans numéro, retard de build), non nos outils. **Aucune erreur de chargement dans nos outils** : `legi_complet.extraire` retrouve tous les articles de codes des archives ; `analyse_corpus.py` lit les articles que codes.droit.org lui donne et classe les renvois avec LEGI. Seuls points à corriger : l'extraction LEGI doit être relancée après `maj_legi.py` (fait le 04/11 : 556 217 versions) et la date « en vigueur » de `legi_complet` (02/11) est en dur.
- **Articles « VIGUEUR_DIFF »** : 157 versions entrées dans la base avec cet état ; toutes ont une date de début postérieure au 04/11 : à venir, donc correctement exclues des articles « en vigueur ».

**Textes hors codes** (lois de 1983-1986, décret de décence, règlement d'assurance chômage) : absents de la base des codes par construction ; la base LEGI contient aussi des textes non codifiés (« TNC »), non chargés ici ; JORF et Légifrance non interrogés (V12595).

**Revues de la nuit.** Aucune revue n'a manqué d'articles à cause d'une copie tronquée, car aucune copie ne l'est ; le « 1 038 » du code de l'éducation est exact. Lacunes réelles, de 0,07 %, à compléter par une relecture ciblée : `revue-ia-cibs-accises-energie.md` (21 articles A322-x/D322-x du CIBS créés le 10/10/2026, 15 articles de l'énergie dont D122-15 à D122-34 du 04/11, L134-31, R433-1) ; `revue-ia-code-travail-chomage.md` (3 annexes du Code du travail) ; `revue-ia-code-fonction-publique.md` (2 articles sans numéro) ; `revue-ia-pensions-civiles-militaires.md` (D37 et D37 bis du 04/11) ; `revue-ia-code-education.md` (2 annexes de 2006) ; revues CGCT, CASF, CSP (1 à 2 articles chacune). Les autres revues (CGI, impôts, prestations, aides au logement, AAH, ASE, assurance maladie, CSS, RSA) ne sont touchées que par les annexes ou articles ci-dessus si elles les citent, soit aucune lacune connue. **Aucune revue n'est à refaire en entier.** Le registre est inchangé (`registre.py --verifier`).

**Limites.** Pas de référence officielle externe (Légifrance bloqué) : la validation repose sur trois comptages tous issus de la même base DILA, deux étant indépendants au niveau du fichier (articles / tables des matières) ; une erreur de la base elle-même ne serait pas vue. Les revues citées n'ont pas été relues pour savoir si elles s'appuient sur les articles absents : à vérifier par recherche du numéro (V12596).

Sources : `$DONNEES/sources/legi/` (dila/, codes-droit-org/, extrait/) consultés le 04/11/2026 ; `outils/droit/completude_base.py`, `test_completude_base.py`.

## Relecture de complétude (04/11/2026) : les 112 articles absents de codes.droit.org lus dans la base LEGI (T55, V12690-V12709)

**Méthode.** Les 112 articles de `articles_absents_codes_droit_org.csv` (46 annexes, 66 autres) ont été lus dans l'archive LEGI qui contient leur version en vigueur (`outils/droit/lire_legi.py`, nouveau, 3 tests ; tableaux compris). Les renvois de chaque texte ont été confrontés aux états LEGI (en vigueur, abrogé, différé) et aux textes de la copie du 31/10. Les numéros des 66 articles non annexes ont été cherchés dans les lignes `article:`, `titre:` et `verif:` des 438 fiches du registre.

**Les 39 articles récents (aucun ne vient directement d'une loi de finances, d'une LFSS ou d'une ordonnance : ce sont des textes d'application).**

| Entrée en vigueur | Texte | Articles | Objet |
|---|---|---|---|
| 10/10/2026 | décret n° 2026-936 du 8/10/2026 | CIBS D322-2, 3, 5, 8, 10, 13, 16 à 20 (11) | modalités de la taxe sur le mécanisme de capacité (loi n° 2025-127, art. 19) |
| 10/10/2026 | arrêté du 8/10/2026 | CIBS A322-4, 6, 7, 9, 11, 12, 14, 15, 21, 22 (10) | formulaires, échéances, information préalable |
| 10/10/2026 | décret n° 2026-935 du 7/10/2026 | consommation D521-2-2, D521-2-3 (2) | suspension des labels et agréments des professionnels de la rénovation (contradictoire, 15 jours) |
| 04/11/2026 | décret n° 2026-1020 du 2/11/2026 | énergie D122-15 à 17, 22, 26-1, 27 à 34 (13) ; L122-8 (version réduite) | aide aux électro-intensifs, R devenus D |
| 04/11/2026 | décret n° 2026-1017 du 2/11/2026 | pensions D37, D37 bis ; transports D5552-1 (3) | cumul emploi-retraite des pensions militaires et marins (L86, loi n° 2025-1403 art. 102) |

**Résultat.**

- **Trois nouvelles fiches** : [AN2400](../registre-anomalies/AN2400.md) (L122-8 de l'énergie réduit à son I alors que cinq articles D citent ses III et IX bis ; moyenne, détectée, V12690), [AN2401](../registre-anomalies/AN2401.md) (deux articles distincts numérotés D7351-3 du CGCT, dont la copie ne garde qu'un ; faible), [AN2402](../registre-anomalies/AN2402.md) (A322-11 cite le 1° bis de L322-8, pas encore en vigueur ; faible).
- **Aucune anomalie du registre n'a été corrigée par ces 39 textes** : aucun n'est cité par une fiche. Le fait « anomalie corrigée par le législateur » (passage en « corrigée par le texte du … », sans suppression) ne se produit donc pas ici ; il reste à chercher sur les articles dont une version est entrée en vigueur après la date de relecture de leur fiche. Balayage fait sur les 974 couples (code, article) cités par des lignes `verif:` : quatre ont une version en vigueur depuis le 01/10/2026 (CSS L136-1-1 le 22/10, fiche AN1210 ; CSS R160-21 le 02/10, AN2105 ; CGFP L332-4 le 01/10, AN1910 ; éducation D687-2 le 31/10, AN604). Les trois premiers sont dans la copie du 31/10 et leurs citations passent encore (`registre.py --verifier`) ; **AN604 reste vraie** (le 19° de D687-2 adapte toujours D636-21-4, abrogé), note ajoutée. Les autres versions récentes sont toutes différées (2027 à 2030, ou « 2222-02-22 »).
- **Autres articles lus (sans fiche)** : D37, D37 bis, D5552-1 et R161-19-1 du CSS (renvois exacts vers L86, D161-2-9, le sixième alinéa du A du III de L161-22, L634-6-1) ; D521-2-2 et D521-2-3 (renvois vers L521-28, L521-8 et L321-1 du CCH, en vigueur) ; 21 articles CIBS (hormis AN2402, cohérents) ; R6351-39 à 41 (balisage des aérodromes, dérogations aux R4215 et R4226 du code du travail) ; D121-4 du code forestier (diversité d'essences pour les aides au reboisement : 4 ha, 80 %, 2 puis 3 essences) ; A5352-1 et A5352-2 ; L3124-8 et L4316-3 des transports (versions différées liées aux lois n° 2026-534 et 2026-554) ; D344-5-14 et R422-7 du CASF ; R4422-2 du CGCT et R234-11 de la Nouvelle-Calédonie ; L134-31 et R433-1 de l'énergie ; D3212-5 du code de la propriété des personnes publiques ; L116-1 du service national (objection de conscience, 1997) ; L4312-8 du CSP ; R6351 ; 6 articles « sans numéro » (renvoi à D3621-1 du CSP pour l'un, chapitres « sans dispositions » du CGFP et de la procédure pénale, article 2 du code disciplinaire de la marine marchande) ; 46 annexes (code de commerce 30, transports 10, travail 3, éducation 2, pensions militaires 1 : listes, barèmes, référentiels sans renvoi vers un article du registre).
- **Point non tranché** : CGI 302 B (version du 01/01/2026) cite 438, 402 bis et 520 A abrogés depuis le 01/01/2022 : renvoi mort probable ou artefact de dates de LEGI, à lire dans Légifrance (V12694).
- **Revues relues** (section du même nom ajoutée à chacune) : cibs-accises-energie, code-travail-chomage, code-fonction-publique, pensions-civiles-militaires, code-education, cgct-finances-locales, casf, assurance-maladie (pour le CSP). **Aucune revue à refaire.**

**Limites.** Lecture dans LEGI, pas dans Légifrance ni au JORF (les décrets eux-mêmes n'ont pas été lus : V12690, V12691, V12692). Les 46 annexes n'ont été lues que par leur début. La convention « 2222-02-22 = date à fixer » de LEGI n'est pas confirmée par la DILA.

Sources : `$DONNEES/sources/legi/` (dila/, extrait/legi.sqlite, codes-droit-org/) et `resultats/droit/articles_absents_codes_droit_org.csv`, consultés le 04/11/2026 ; `outils/droit/lire_legi.py`, `registre.py`.
