---
titre: Articles du CGI rattachés aux impôts supprimés par le système (indicateur de simplification)
statut: brouillon, ordres de grandeur ; classement par règles reproductibles, aucun juriste n'a relu
date: 2026-11-03
tache: T55
---

# Articles du CGI rattachés aux impôts supprimés

Consultation : 03/11/2026. Auteur : Claude (IA d'Anthropic). Légende : **fait** (compte sur le texte local, reproductible) · **estimation** (règle de classement, voir plus bas) · ⚠️ non vérifié (V9000 à V9003 dans `verifications.md`).

## 1. Ce que le décompte dit (en six lignes)

1. **Sur 2 407 articles en vigueur du CGI (partie législative), 887 (36,9 %) portent sur un impôt que le plan de bascule nomme comme supprimé** (IR, CSG, CRDS, prélèvement de solidarité, taxe foncière, CFE, CVAE, taxe sur les salaires, IFI, droits de mutation à titre gratuit, droits de mutation à titre onéreux de la réforme immobilière). C'est la **borne basse**, 358 153 mots sur 793 838 (45 %) : les articles supprimés sont plus longs que la moyenne.
2. **Le « 55 % » (1 315 articles) de `plan-de-bascule.md` § 4.2 était un compte de titres entiers (IR 500 + enregistrement-timbre-IFI 433 + impôts locaux 382)**. Il mélangeait des impôts supprimés et des impôts conservés (TVA et IS ne sont pas dedans, mais les 97 articles d'exonérations d'enregistrement, les 276 d'enregistrement, la taxe d'aménagement ou les taxes affectées y sont). Le bon chiffre est une fourchette : **887 (36,9 %) à 1 650 (68,6 %)**, selon qu'on compte seulement les impôts nommés ou aussi les blocs mixtes et non tranchés ; **920 (38,2 %) au central** avec les droits de timbre et la TEOM convertis en redevances. Le 1 315 est dans la fourchette, mais ce n'est pas un résultat.
3. **Le plan oublie que le CGI est un tout** : 587 articles (24,4 %) sont conservés (TVA 159, IS 132, imposition minimale mondiale 184, accises 40...), et **516 articles (21,4 %) sont mixtes** (dispositions communes IR/IS, enregistrement, recouvrement des impôts directs) : ils ne disparaissent pas, ils sont à réécrire. 170 articles de procédure et de pénalités communes ne sont ni supprimés ni conservés.
4. **Un article supprimé n'est pas un article libre** : 176 des 887 articles supprimés (19,8 %) sont cités par au moins un article conservé. Surtout, **146 des 334 articles de détermination des bénéfices (BIC, BNC, BA) sont réutilisés par l'IS** : l'article 209 renvoie à « 34 à 45, 53 A à 57, 108 à 117 » ; supprimer l'IR sans reprendre ces règles désarme l'IS. Borne basse nette : **711 articles (29,5 %)**.
5. **Conséquence pour la cible de 300 articles du plan** : le CGI passerait de 2 407 à environ 1 520 articles (2 407 - 887) au minimum de suppression, ou 757 (2 407 - 1 650) au maximum. Aucune de ces valeurs n'atteint 300 : la cible suppose de **réécrire** les 587 articles conservés et les 516 mixtes (opinion : c'est le vrai chantier, pas l'abrogation).
6. **Ce que ce décompte ne mesure pas** : les annexes (I à IV : 2 336 articles réglementaires), le livre des procédures fiscales (919), le CIBS (1 763) et le code de la sécurité sociale (7 429, où sont les cotisations). Un article n'est pas une règle : le nombre de mots, donné ci-dessous, nuance.

## 2. Méthode (reproductible)

- Script : `outils/droit/cgi_articles_supprimes.py` (Python 3.9, bibliothèque standard) ; tests : `outils/droit/test_cgi_articles_supprimes.py` (10 tests : règles, renvois, données réelles). Commande : `python3 -I outils/droit/cgi_articles_supprimes.py > ...` ; `--tsv` donne la liste exacte article par article (article, impôt, statut, mots, articles conservés qui le citent, chemin dans le plan du code).
- Source : copie [codes.droit.org](https://codes.droit.org) du CGI (XML Légifrance/DILA, fichier du 31/10/2026, lu le 03/11/2026), articles `etat="VIGUEUR"`. « Partie législative » : le fichier ne contient que les articles de la loi ; les annexes sont des fichiers séparés, non comptés.
- **Classement** : chaque article reçoit un impôt et un statut d'après son chemin dans le plan du code (Livre > Partie > Titre > Chapitre > Section...), par 78 règles ordonnées (`REGLES`, première correspondance). Les statuts SUPPRIME / CONSERVE suivent `plan-de-bascule.md` § 1.1 et `recherche-inventaire-impots.md` § 6. **Un impôt que le plan ne nomme pas n'est pas classé supprimé** (statut « à trancher »), pour ne pas gonfler l'indicateur.
- **Renvois** : un article conservé est dit citer un article supprimé s'il contient « article N », « articles N, N et N » ou « articles N à N » (plage lue dans l'ordre du code, plafond 400) vers un article en vigueur ; les renvois suivis de « de l'annexe », « du code de commerce », « de la loi », « du décret » sont écartés. Cinq lectures à la main (209, 8, 151 octies D, 238 quindecies, 1383 H) : pas de faux renvoi trouvé ; rappel non mesuré (les renvois du type « les articles 34 à 45 » sont lus ; les formules « mentionnées au 3 du II » sans numéro ne le sont pas). Le compte des articles supprimés cités est donc une **borne basse**.

## 3. Résultats

Copie codes.droit.org du CGI, dernière mise à jour du fichier : 2026-10-31 ; 2407 articles en vigueur (partie législative, hors annexes).

### Décompte par statut

| Statut | Articles | Part | Mots |
|---|---:|---:|---:|
| Supprimé (nommé par le plan) | 887 | 36,9 % | 358 153 |
| Converti en redevance | 33 | 1,4 % | 3 577 |
| Mixte (communs à un impôt supprimé et à un conservé) | 516 | 21,4 % | 127 966 |
| À trancher (impôt non nommé par le plan) | 214 | 8,9 % | 67 173 |
| Commun (procédure, recouvrement, contrôle) | 170 | 7,1 % | 37 357 |
| Conservé | 587 | 24,4 % | 199 612 |
| **Total** | **2407** | 100 % | 793 838 |

**Bornes de l'indicateur** : basse 887 articles (36,9 %) ; centrale 920 (38,2 %) ; haute 1650 (68,6 %).

### Impôt par impôt (articles, mots, et dont cités par un article conservé)

**Supprimé (nommé par le plan)**

| Impôt ou bloc | Articles | Mots | Cités par un article conservé |
|---|---:|---:|---:|
| Impôt sur le revenu | 500 | 255 359 | 172 |
| Droits de mutation à titre gratuit | 101 | 19 496 | 0 |
| Taxe foncière | 92 | 26 545 | 3 |
| Cotisation foncière des entreprises | 54 | 18 155 | 0 |
| Valeur locative (taxe foncière, CFE) | 40 | 12 437 | 0 |
| IFI | 23 | 7 172 | 1 |
| Droits de mutation à titre onéreux (départements) | 22 | 4 259 | 0 |
| Droits de mutation à titre onéreux (immeubles) | 17 | 1 362 | 0 |
| Taxe sur les salaires | 12 | 1 726 | 0 |
| CVAE | 7 | 5 470 | 0 |
| CSG | 4 | 203 | 0 |
| CRDS | 4 | 169 | 0 |
| Taxe additionnelle communale aux droits de mutation | 3 | 758 | 0 |
| Prélèvement sur l'assurance-vie au décès | 2 | 2 373 | 0 |
| CFE / CVAE (dégrèvements, plafonnement) | 2 | 510 | 0 |
| Impôt sur le revenu (contribution hauts revenus) | 1 | 666 | 0 |
| Impôt sur le revenu (contribution différentielle) | 1 | 1 221 | 0 |
| Prélèvements de solidarité (revenus du capital) | 1 | 171 | 0 |
| Droits de mutation à titre onéreux (régions) | 1 | 101 | 0 |

**Converti en redevance**

| Impôt ou bloc | Articles | Mots | Cités par un article conservé |
|---|---:|---:|---:|
| Droits de timbre | 18 | 1 026 | 0 |
| Taxe d'enlèvement des ordures ménagères | 8 | 2 242 | 0 |
| Pénalités du timbre et autres droits | 7 | 309 | 0 |

**Mixte (communs à un impôt supprimé et à un conservé)**

| Impôt ou bloc | Articles | Mots | Cités par un article conservé |
|---|---:|---:|---:|
| Enregistrement et publicité foncière : formalités, obligations, exonérations communes | 183 | 17 019 | 0 |
| Dispositions communes IR / IS (titre premier, ch. IV) | 154 | 64 277 | 0 |
| Recouvrement des impôts directs (IR, IS, taxes locales) | 52 | 12 631 | 0 |
| Pénalités des impôts directs | 36 | 5 332 | 0 |
| Taxes locales : fixation des taux, frais de recouvrement | 28 | 19 652 | 0 |
| Recouvrement de l'enregistrement et de l'IFI | 24 | 2 200 | 0 |
| Pénalités de l'enregistrement | 13 | 1 517 | 0 |
| Dispositions communes impôts directs / TCA (titre II bis) | 9 | 1 057 | 0 |
| Dispositions communes (titre V) | 6 | 978 | 0 |
| Procédures de l'enregistrement | 6 | 505 | 0 |
| Taxes locales directes : généralités | 3 | 2 701 | 0 |
| Procédures des impôts directs | 2 | 97 | 0 |

**À trancher (impôt non nommé par le plan)**

| Impôt ou bloc | Articles | Mots | Cités par un article conservé |
|---|---:|---:|---:|
| Autres droits d'enregistrement (meubles, baux, partages, sociétés) | 72 | 7 841 | 0 |
| Taxes affectées (chambres, taxes spéciales d'équipement) | 20 | 13 669 | 0 |
| Taxe d'aménagement | 20 | 4 041 | 0 |
| Autres taxes diverses (titre premier, ch. III) | 18 | 13 341 | 0 |
| Droits et taxes affectés (fonds de garantie, timbres, aide juridique) | 13 | 2 399 | 0 |
| Taxe d'habitation (résidences secondaires) | 11 | 2 339 | 0 |
| Autres droits et taxes (titre IV, ch. III) | 10 | 2 324 | 0 |
| Autres taxes communales (mines, pylônes, éoliennes, friches...) | 8 | 5 341 | 0 |
| Impositions régionales (IFER, Île-de-France, Guyane) | 8 | 3 361 | 0 |
| Taxe sur les conventions d'assurances | 7 | 2 584 | 0 |
| IFER | 7 | 2 548 | 0 |
| Autres impositions départementales (mines, hydrocarbures, généralités) | 5 | 1 491 | 0 |
| Taxes affectées (musique, formation, paris hippiques) | 5 | 2 298 | 0 |
| IFER et champ d'application des impositions locales | 3 | 637 | 0 |
| Fonds de péréquation locaux | 2 | 976 | 0 |
| TASCOM (taxe additionnelle) | 1 | 452 | 0 |
| Taxe sur la vacance des locaux d'habitation | 1 | 670 | 0 |
| Contribution sur les eaux minérales | 1 | 580 | 0 |
| Taxes affectées : dispositions communes | 1 | 79 | 0 |
| Départements d'outre-mer (impôts locaux) | 1 | 202 | 0 |

**Commun (procédure, recouvrement, contrôle)**

| Impôt ou bloc | Articles | Mots | Cités par un article conservé |
|---|---:|---:|---:|
| Contrôle, obligations et commissions communs (troisième partie) | 80 | 19 551 | 0 |
| Pénalités : dispositions communes | 65 | 15 058 | 0 |
| Recouvrement : dispositions communes | 25 | 2 748 | 0 |

**Conservé**

| Impôt ou bloc | Articles | Mots | Cités par un article conservé |
|---|---:|---:|---:|
| Imposition minimale mondiale (pilier 2) | 184 | 35 772 | 0 |
| TVA | 159 | 61 128 | 0 |
| Impôt sur les sociétés | 132 | 77 645 | 0 |
| Accises, garantie, monopoles | 40 | 6 851 | 0 |
| Autres taxes sur le chiffre d'affaires (TGAP, jeux, redevances) | 36 | 10 627 | 0 |
| Pénalités de TVA | 11 | 1 750 | 0 |
| Recouvrement de la TVA | 10 | 1 801 | 0 |
| Pénalités des accises | 5 | 182 | 0 |
| Prélèvements sur les jeux | 4 | 904 | 0 |
| Accises affectées (boissons non alcoolisées, Cnaf) | 4 | 2 819 | 0 |
| Recouvrement des accises | 2 | 133 | 0 |

### Renvois : ce qui ne peut pas être supprimé sans être repris

176 des 887 articles supprimés (19,8 %) sont cités par au moins un des 83 articles conservés qui les mobilisent ; borne basse nette des articles réellement supprimables : 711 (29,5 % du CGI).

Impôt sur le revenu par section (articles, dont cités par un article conservé) :

| Section de l'IR | Articles | Cités par un article conservé |
|---|---:|---:|
| Section I : Dispositions générales | 14 | 6 |
| Section II > Définition générale du revenu imposable | 2 | 0 |
| Section II > 1re Sous-section : Détermination des bénéfices ou revenus nets des diverses catégories de revenus | 334 | 146 |
| Section II > 2e Sous-section : Revenu global | 36 | 2 |
| Section III : Déclarations des contribuables | 10 | 0 |
| Section V > I : Retenue à la source de l'impôt sur le revenu | 6 | 2 |
| Section V > II : Impôt sur le revenu | 72 | 15 |
| Section V > III : Plafonnement de certains avantages fiscaux au titre de l'impôt sur le revenu | 1 | 0 |
| Section V > IV : Imposition des gains nets réalisés à l'occasion de cessions de valeurs mobilières et de droit | 1 | 0 |
| Section V > V : Imposition des plus-values réalisées à l'occasion de cessions à titre onéreux de biens ou droi | 1 | 0 |
| Section V > VI : Imposition des plus-values réalisées à l'occasion de cessions à titre onéreux d'actifs numéri | 1 | 0 |
| Section VI : Dispositions spéciales applicables en cas de cession, de cessation ou de décès | 8 | 1 |
| Section VIII : Prélèvement à la source de l'impôt sur le revenu | 14 | 0 |

Articles supprimés les plus cités par des articles conservés (extrait, 25 premiers) :

| Article supprimé | Impôt | Cité par (extrait) |
|---|---|---|
| 39 | Impôt sur le revenu | 27 : 208 C, 209, 209-0 A, 209-0 B, 210 A |
| 8 | Impôt sur le revenu | 8 : 205 C, 206, 207, 208 C, 208 C ter |
| 39 duodecies | Impôt sur le revenu | 8 : 209, 209-0 B, 210, 210 E bis, 217 quinquies |
| 39 quindecies | Impôt sur le revenu | 7 : 209, 210, 210 E bis, 223 D, 223 E |
| 38 | Impôt sur le revenu | 6 : 206, 209, 210 B, 210-0 A, 219 |
| 39 terdecies | Impôt sur le revenu | 6 : 209, 210, 210 E bis, 217 octies, 219 |
| 115 | Impôt sur le revenu | 6 : 209, 210 B, 210-0 A, 220, 223 I |
| 145 | Impôt sur le revenu | 6 : 210 A, 216, 216 A, 219, 223 B |
| 39 duodecies A | Impôt sur le revenu | 5 : 209, 210, 210 A, 210 E bis, 223 D |
| 37 | Impôt sur le revenu | 4 : 209, 219, 223 A, 223 L |
| 39 B | Impôt sur le revenu | 4 : 209, 212 bis, 223 B bis, 223 F |
| 39 quaterdecies | Impôt sur le revenu | 4 : 209, 210, 210 E bis, 223 D |
| 44 sexies | Impôt sur le revenu | 4 : 208 D, 209, 220 quinquies, 220 terdecies |
| 57 | Impôt sur le revenu | 4 : 209, 209 B, 212 bis, 312 |
| 74 | Impôt sur le revenu | 4 : 1613 quater, 1613 ter, 299, 299 quinquies |
| 34 | Impôt sur le revenu | 3 : 206, 208 D, 209 |
| 39 bis A | Impôt sur le revenu | 3 : 209, 220 undecies, 223 ter |
| 44 sexies A | Impôt sur le revenu | 3 : 209, 220 quinquies, 220 terdecies |
| 44 octies A | Impôt sur le revenu | 3 : 209, 220 quinquies, 220 terdecies |
| 44 octies B | Impôt sur le revenu | 3 : 209, 220 quinquies, 220 terdecies |
| 44 quaterdecies | Impôt sur le revenu | 3 : 209, 217 undecies, 220 quinquies |
| 44 quindecies | Impôt sur le revenu | 3 : 209, 220 quinquies, 220 terdecies |
| 44 quindecies A | Impôt sur le revenu | 3 : 209, 220 quinquies, 220 terdecies |
| 44 sexdecies | Impôt sur le revenu | 3 : 209, 220 quinquies, 220 terdecies |
| 44 septdecies | Impôt sur le revenu | 3 : 209, 220 quinquies, 220 terdecies |


## 4. Limites et objections

- **Steelman : « compter des articles est trompeur »** : un article peut faire des pages, un autre tenir une ligne (moyenne : 330 mots, extrêmes non relevés) ; les articles supprimés pèsent 45 % des mots pour 36,9 % des articles, ce qui va dans le sens du plan. Mais le nombre de mots ne mesure pas non plus la difficulté (renvois, exceptions).
- **Le classement est une opinion de conception** : les règles ne sont pas la loi. Trois choix pèsent : (a) l'enregistrement hors successions et hors mutations immobilières est « à trancher » (72 articles) ; (b) les 154 articles « dispositions communes IR/IS » sont « mixtes » alors qu'une bonne part (crédits d'impôt, régimes de sociétés de personnes) disparaîtrait avec l'IR ; (c) l'imposition minimale mondiale (184 articles) est classée conservée parce qu'elle s'applique aux groupes et suit l'IS, mais elle relève d'une directive UE (directive 2022/2523 ⚠️ non relue ici), donc d'un cadre que la France ne peut pas abroger seule.
- **Les 887 comptent des articles de dispositifs, pas seulement des taux** : les niches de l'IR (réductions, crédits) sont dans l'IR ; elles ne disparaissent que si le plan les supprime aussi (il le prévoit : `plan-de-bascule.md` § 1, paragraphe « Niches »).
- **Plafond légal de 300 articles** (cible proposée) : voir point 5 ; sans réécriture, l'abrogation seule laisse au moins 757 à 1 520 articles.
- **Indicateur dans le temps** : le compteur est à publier chaque année (2 407 aujourd'hui, source locale du 31/10/2026 ; valeur à rapprocher de Légifrance avant publication, V9000). Il doit empirer pendant la double application (2029-2032) puis baisser : `plan-de-bascule.md` § 4.3.

## 5. À vérifier

- ⚠️ V9000 : le compte de 2 407 articles est celui de la copie codes.droit.org (« branches coupées ») ; non rapproché d'un décompte officiel Légifrance.
- ⚠️ V9001 : les règles de classement n'ont pas été relues par un fiscaliste ; les blocs « mixtes » sont l'estimation la plus fragile.
- ⚠️ V9002 : la précision du détecteur de renvois a été contrôlée sur cinq articles seulement ; le rappel n'est pas mesuré.
- ⚠️ V9003 : le « 1 315 articles, 55 % » de `plan-de-bascule.md` § 4.2 est remplacé par la fourchette 887 à 1 650 (central 920).

## 6. Sources mobilisées

- [codes.droit.org, Code général des impôts](https://codes.droit.org) (XML issu de Légifrance, DILA ; fichier lastup 2026-10-31, lu le 03/11/2026) : texte et plan des articles en vigueur ; établit le décompte et les renvois.
- `sources/plan-de-bascule.md` § 1.1 et § 4 : liste des prélèvements supprimés, décompte antérieur (1 315).
- `sources/recherche-inventaire-impots.md` § 6 : classement des prélèvements (maintenu, converti, à trancher).
- `sources/calculs/complexite_codes_fiscaux.py` : décomptes de référence par code (2 407, 500, 433, 382).
