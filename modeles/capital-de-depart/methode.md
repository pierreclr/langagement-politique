---
titre: Capital de départ pour chaque jeune : variantes, coût, financement, effets (méthode)
tache: chantier 4 de la boucle « meilleur système »
date: 2026-11-03
statut: brouillon
---

# Capital de départ : méthode

Demande de l'auteur (03/11/2026) : redistribuer vers les jeunes sans être confiscatoire ; **les donations ne sont pas moins taxées que l'héritage** (sinon on favorise ceux qui ont déjà un patrimoine familial) ; plafond de 50 % sur les transmissions tous impôts confondus (tranché par Claude). Ce module chiffre un capital versé à chaque jeune et son financement. Il ne modifie pas `modeles/systeme-ideal/` : il fournit des montants [favorable, central, défavorable] à y intégrer comme option.

Légende : fait sourcé (lien) · estimation (calcul de Claude) · hypothèse · ⚠️ non confirmé (registre `verifications.md`, V7800 à V7814). Des ordres de grandeur, jamais des prédictions. Code : `modele.js` (fonctions pures), `test.js` (20 contrôles), `rapport.js` ; sortie : `resultats-brut.txt`. Lancer : `jsc modele.js test.js` puis `jsc modele.js rapport.js`.

## 1. Données

| Donnée | Valeur | Source |
|---|---|---|
| Naissances France 2001-2008 | 804 052 ; 793 606 ; 793 893 ; 800 240 ; 807 787 ; 830 288 ; 819 605 ; 829 311 (moyenne 809 848) | [Eurostat demo_gind, LBIRTH](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_gind?geo=FR&indic_de=LBIRTH&time=2001&time=2008), mise à jour 27/10/2026, consulté le 03/11/2026 (copie `$DONNEES/sources/capital-de-depart/births.json`) ; ⚠️ périmètre Eurostat « France » (avec DOM) non recoupé avec les séries Insee (V7800) |
| Population par âge au 1er janvier 2024 | 18 ans : 827 859 ; 25 ans : 778 675 ; 13 à 17 ans : 859 104 à 872 680 ; moyenne 18-25 ans : 797 790 | [Eurostat demo_pjan](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?geo=FR&sex=T&time=2024), mise à jour 25/09/2026, consulté le 03/11/2026 (copie `pop_ages.json`) |
| Héritages reçus à vie | médiane 70 000 € ; moins de 10 % au-dessus de 500 000 € ; top 1 % : 4,2 M€ nets de droits en moyenne ; âge moyen à l'héritage 50 ans | [CAE, note n° 69, déc. 2021](https://cae-eco.fr/static/pdf/cae-note069.pdf) (copie locale lue le 03/11) |
| Flux successoral | environ 300 Md€ par an | CAE 2021 (ordre de grandeur macro) |
| Recette d'héritage du palier 1 | 103,5 Md€ = 300 × 50 % × (1 − 31 %) ; droits actuels 20,8 Md€ | `modeles/systeme-ideal/AUDIT-2026-11-01.md` A6 |
| Taxe à 1 % | 75 / 93 / 109 Md€ | `modeles/systeme-ideal/taxe-patrimoine-1pc.md` |
| Équivalence | 12,7 Md€ par point de taux plat, central à 35 % (palier 1 d'origine) ; 10,8 Md€ à 40,7 % (v5, retenu pour tout texte public) | `modeles/systeme-ideal/options-financement-palier1.md` |
| Ventes de logements anciens | 749 583 ventes, 185,2 Md€ (2024) | DVF, `modeles/systeme-ideal/resultats-dvf-patrimoine.txt` |

## 2. Hypothèses

- **H1 cohorte** : bas 780 000 / central 830 000 / haut 870 000, d'après la population à 25 ans (778 675), à 18 ans (827 859) et à 13-17 ans (jusqu'à 872 680). Ce n'est **pas** le nombre de naissances 2001-2008 (810 000) : la population à 18 ans le dépasse (solde migratoire). Condition de résidence ou de nationalité non modélisée (⚠️ V7801) : la restreindre baisserait les coûts.
- **H2 héritages** : loi log-normale calée sur la médiane (70 000 €) et le 90e centile (500 000 €) de la cohorte. Test : le top 1 % y reçoit 4,9 M€ en moyenne (CAE : 4,2 M€ nets de droits) : la queue est un peu trop lourde (+16 %) ; la médiane et le 90e centile sont exacts. Les montants du CAE reposent sur les droits de succession (DMTG) : environ 40 % du patrimoine transmis lui échappe (CAE), ce qui explique l'écart avec le flux macro.
- **H3** part de la cohorte qui ne reçoit rien : 0 / 10 % / 20 % (favorable / central / défavorable pour les variantes dépendant de l'héritage). Source non trouvée (⚠️ V7802). Le calage de la médiane et du P90 est maintenu.
- **H4** échelle des montants : 1 (calage CAE) ; sensibilité à 1,63 (flux macro de 300 Md€ au lieu des 184 Md€ implicites).
- **H5-H6** flux 300 Md€ ; fuite 31 / 35 / 40 % (palier 1 : 31 % ; CAE : 35-40 % ; V1 du modèle).
- **H7** rang des héritages = rang du patrimoine des parents (borne haute de la concentration par décile). Aucune corrélation parfaite dans la réalité ; l'héritage « attendu » se lirait dans le patrimoine des parents déclaré à la taxe à 1 % (le registre sert deux fois).
- **H8** variantes : A, 10 000 € à 18 ans, universel, libre ; B, 25 000 € à 25 ans, universel, fléché ; C, garantie de 40 000 € à 25 ans, transfert = max(0, 40 000 − 50 % × héritage), libre ; C', idem à 100 % de dégressivité (CAE « garantie 1 »).
- **H9** régime de l'impôt : (i) « flat » : 50 % dès le premier euro, palier 1 ; (ii) « reçu à vie » (Atkinson, CAE) : 50 % de la part cumulée au-dessus d'une exemption E par héritier, donations et héritages additionnés dans la même assiette (donation = héritage, décision de l'auteur).
- **H10** recette = flux × part imposable × 50 % × (1 − fuite) ; la part imposable est la part de la masse transmise au-dessus de E.
- **H11** coût en croisière : une cohorte par an, mêmes montants en euros constants ; le premier versement tarde de 7 ans pour B et C par rapport à A (la recette d'héritage arrive d'abord).
- **H12-H14** risque immobilier si le capital est fléché logement : part qui finit en apport 15 / 30 / 50 % ; demande créée par euro d'apport 1 / 2 / 3 (le marginal acheteur est limité par l'apport) ; élasticité 2,0 / 1,0 / 0,5 (même éventail que le modèle immobilier). **Hypothèses non sourcées** (⚠️ V7803) : à lire comme un ordre de grandeur et une borne, le cumul des extrêmes n'est pas une probabilité.
- **H15** pas de fiscalité du capital reçu, pas d'effet sur l'offre de travail ni sur la fuite à l'étranger (non chiffrés ; voir § 4).
- **H16** les chiffres de § 2-3 sont en euros constants, **sans rendement** entre le versement et l'usage.

## 3. Limites propres à ce module

- Le lien entre rang d'héritage et décile de patrimoine parental est une borne (H7).
- Les montants CAE sont calibrés sur des données fiscales de 2006 (cohorte) ; les inégalités ont pu évoluer.
- Aucun effet de comportement n'est inclus dans le coût : héritiers qui évitent les dons, déménagement, gel des transmissions.
- La part « fléchée » ne change pas le coût mais l'effet ; elle est traitée en § 4.

## 4. État de la recherche (règle 9)

**Ce que les études établissent.**
- **Contraintes de liquidité et création d'entreprise (preuves mixtes).** Holtz-Eakin, Joulfaian et Rosen (1994, *RAND Journal of Economics*, [NBER w4526](https://www.nber.org/papers/w4526)) : à partir de déclarations fiscales américaines, l'héritage augmente le passage à l'entrepreneuriat, lecture : contraintes de liquidité. Blanchflower et Oswald (1998, *Journal of Labor Economics*, [NBER w3252](https://www.nber.org/papers/w3252), working paper de février 1990 ; correction du 03/11/2026, V7804 : w5622 est le papier de Dunn et Holtz-Eakin, pas celui de Blanchflower et Oswald) : la probabilité d'être indépendant est plus élevée pour qui a reçu un héritage ou un don (résumé NBER lu le 03/11 : les personnes ayant reçu un don ou un héritage de 5 000 £ étaient « approximativement deux fois plus susceptibles, toutes choses égales par ailleurs, de créer une entreprise » ; V7804 levé). **Contre** : Hurst et Lusardi (2004, *Journal of Political Economy*, [RePEc](https://econpapers.repec.org/RePEc:ucp:jpolec:v:112:y:2004:i:2:p:319-347)) : la relation richesse-création est plate sur l'essentiel de la distribution, positive seulement vers le 95e centile ; les contraintes de crédit ne sont pas déterminantes pour la majorité des petites créations (d'après le résumé et les citations secondaires, article non relu). Fairlie et Krashinsky contestent cette lecture. **Conclusion : un capital libre de 10 000 à 25 000 € a peu de chances de produire beaucoup de créatrices et de créateurs supplémentaires ; l'argument « création d'entreprise » ne justifie pas à lui seul le coût.**
- **Child Trust Fund (Royaume-Uni, 2002-2011).** Compte ouvert à la naissance, dotation publique (au plus 500 £ environ, davantage pour les familles modestes, ⚠️ montants non relus). IFS : 92 % des jeunes disposant d'un CTF ont un patrimoine financier positif, contre 58 % de la cohorte née un an plus tôt ([IFS, « Coming of age: Labour's Child Trust Funds »](https://ifs.org.uk/articles/coming-age-labours-child-trust-funds), résumé de recherche, non relu). McKay, Tian et Lymer (2023, [Aston](https://publications.aston.ac.uk/id/eprint/45231)) : effets positifs modestes sur l'épargne des enfants concernés. Le rapport d'évaluation HMRC (Kempson, Finney et Davies, 2011, Research Report 143) n'a pas pu être lu (⚠️ V7805). **Établi : on peut créer l'épargne d'une génération avec un petit montant ; non établi : l'effet à l'âge adulte avec 10 000 à 40 000 €, le CTF n'ayant pas été versé à un montant comparable.**
- **Baby bonds (États-Unis, simulations).** Zewde (2019, *Panel Study of Income Dynamics*) projette de ramener le rapport de patrimoine médian blanc-noir des jeunes adultes de 15,8 à 1,4 avec des dotations de 500 à 50 000 $ selon la richesse familiale ; Weller, Maxwell et Solomon (2021) ≈ 2,7 à 1 en 2060 ; Mitchell et Szapiro ≈ 3,4 à 1 ([synthèse Policies for Action](https://policiesforaction.org/node/666)). **Ce sont des simulations, pas des évaluations ; critiquées (médiane contre moyenne).** Programme réel : le Connecticut place 3 200 $ par enfant né de la pauvreté, premier bénéficiaire en 2023 ([communiqué de l'État du Connecticut, 2021](https://portal.ct.gov/-/media/ott/press-room/press-releases/2021/070121ctmakeshistorytodayctbabybondsforctchildrenintopoverty.pdf)) : aucun résultat mesuré à ce jour trouvé (⚠️ V7806).
- **Transferts en capital aléatoires, pays à revenu faible.** Blattman, Fiala et Martinez, Ouganda (YOP) : revenus +41 % à quatre ans, effet disparu à neuf ans, gain temporaire d'environ 665 $ par personne, un petit surcroît d'actifs et un métier qualifié plus fréquent qui durent ([J-PAL](https://www.povertyactionlab.org/print/pdf/node/2021?lang=en)). **Non transposable à un montant de 10 à 40 k€ en France** (montants et marchés différents) ; indique que l'effet d'un capital peut être fort puis se dissiper.
- **Effet sur l'offre de travail.** Gains de loterie en Suède (249 278 joueurs de 21 à 64 ans, 1991-2010) : propension marginale à gagner −0,11 par euro de revenu non gagné, soit un effet modeste ([Cesarini, Lindqvist, Notowidigdo et Östling](https://www.ipr.northwestern.edu/our-work/working-papers/2015/ipr-wp-15-18.html)). Un capital de 10 à 40 k€ reçu à 18-25 ans : effet attendu faible. Banerjee et al. (2020, cité par le CAE) : les craintes paternalistes sur l'usage sont à relativiser ; le CAE conclut qu'un versement ne devrait pas être conditionné.
- **Garantie en capital.** CAE 2021 : un « demogrant » uniforme financé par une réforme d'assiette (assiette 2, barème 4) est de l'ordre de 10 000 € ; une garantie différentielle peut monter à 40 000 € (assiette 2, barème 4, garantie 1), au prix de taux marginaux implicites élevés sur les petits héritages. Le montant doit être suffisant pour lever les contraintes (Balboni et al. 2021, cité par le CAE).

**Ce qui est débattu.** L'ampleur des effets sur la création d'entreprise (Hurst-Lusardi contre Fairlie-Krashinsky) ; le rôle d'un flèchage (le CAE le déconseille, d'autres craignent la dissipation) ; l'effet d'aubaine.

**Ce qui manque.** Aucune évaluation expérimentale d'un capital de 10 à 40 k€ versé à tous les jeunes d'un pays riche. Pas de mesure française. Singapour (Child Development Accounts) : **aucun résultat quantifié trouvé**, non utilisé (⚠️ V7807).

## 5. Steelman et contraintes juridiques

- **Meilleure objection** : « c'est un cadeau aux jeunes aux dépens des vieux, financé par une fiscalité de transmission qui sera contournée ; mieux vaut baisser les prélèvements que distribuer un capital ». Réponse chiffrée : le capital coûte 8 à 21 Md€ contre 103,5 Md€ de recette attendue ; mais la recette est précisément le point fragile du palier 1 (c'est le pari de l'héritage, 6 à 83 Md€) ; si elle ne vient pas, le capital ne se finance pas par l'héritage mais par la taxe à 1 % ou le taux plat.
- **Objection 2** : « un capital libre sera dissipé ». Réponse : la recherche relativise (loteries, CAE), mais ne la supprime pas ; un compte bloqué jusqu'à des usages éligibles diminue le risque et augmente l'aubaine et l'inflation foncière si le logement en fait partie (§ risque).
- **Objection 3** : « les parents anticiperont : donations juste avant, ou héritage versé à l'avance pour toucher la garantie ». Réponse : l'assiette « reçu à vie » additionne donations et héritages ; l'héritage « attendu » se lit dans le patrimoine des parents déclaré à la taxe à 1 %.
- **Contraintes** : principe d'égalité et ciblage par l'héritage reçu (jurisprudence constitutionnelle sur les droits de mutation à vérifier, ⚠️ V7808) ; droit de l'Union : aucune entrave directe, mais une condition de résidence ou de nationalité s'apprécie au regard de la non-discrimination (⚠️ V7809). Confiscation : plafond de 50 % de la valeur transmise tous impôts confondus ; avec la variante C et E = 100 000 € le taux marginal cumulé ne dépasse jamais 50 % (dégressivité de 0 à 80 000 €, impôt au-dessus de 100 000 €).

## Fonctions continues (03/11, suite ; H600-H609 de `systeme-ideal/methode.md` § 33)

Principe de l'auteur (03/11) : pas de seuils ni de tranches. `continu.js` (fonctions pures, `test_continu.js`, 46 contrôles) remplace l'exemption par héritier (100 000 € ou 50 000 €) par un impôt lisse du cumul reçu x : forme A 50 % × x²/(x+K) (K = 188 845 € pour la même recette que 100 000 €, 80 781 € pour 50 000 €), B 50 % × x (1 − e^(−x/K)) (taux marginal jusqu'à 56,8 % : écartée), C à taux marginal lisse (K = 64 056 € / 24 849 €). Le capital C (« 40 000 € − 50 % de l'héritage ») devient g(H) = 40 000 € × e^(−H/K), K = 46 778 € pour le même coût central (11,53 Md€), au prix d'une pente initiale de 86 % (50 % avec K = 80 000 € : +3,2 Md€/an). Tableaux et intégration à l'architecture v3 : `../systeme-ideal/resultats-optimum.txt` § 12 (`rapport_continu.js`). `modele.js`, `test.js` et `rapport.js` ne changent pas. Reproduction : `jsc modele.js continu.js test_continu.js`.
