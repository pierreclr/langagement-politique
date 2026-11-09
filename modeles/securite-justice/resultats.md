# Sécurité et justice : résultats

Produits par `python3 rapport.py` (hypothèses H1-H26 de [`methode.md`](methode.md)). Des ordres de grandeur, jamais des prédictions ; plusieurs paramètres sont ⚠️ (V6270-V6289). Aucune donnée par origine : la nationalité n'entre que par deux totaux officiels (§ 4).

## 1. La chaîne pénale en 2025 (faits sourcés, Chiffres clés de la Justice 2026)

| Étape | Effectif | Lecture |
|---|---|---|
| Affaires nouvelles enregistrées par les parquets | 4 562 900 | |
| Affaires traitées | 4 240 265 | dont **59,6 % sans mis en cause** (2 527 313) |
| Mis en cause dans les affaires traitées | 1 917 263 | |
| Mis en cause « poursuivables » | 1 213 435 | **63,3 %** ; le reste (703 828) est non poursuivable, surtout pour infraction mal caractérisée (431 621) ou défaut d'élucidation (89 253) |
| Poursuivis, ou alternative réussie, ou composition pénale | 1 065 120 | **taux de réponse pénale 87,8 %** des poursuivables |
| Condamnés (personnes) / condamnations | 437 059 / 555 955 | 22,8 % des mis en cause ; 36 % des poursuivables (ordre de grandeur, unités différentes, H1) |
| Condamnations avec prison ferme en tout ou partie | 122 339 | quantum moyen ferme 11,2 mois ; 99 800 peines fermes mises à exécution en 2025, dont 41 % aménagées avant incarcération ⚠️ V6273 |
| Récidivistes (récidive légale) / réitérants parmi les condamnés pour délit | 21,4 % / 23,6 % | |

**Lecture.** La plus grosse perte n'est pas en fin de chaîne : c'est **en amont** (60 % des affaires sans auteur identifié ; élucidation à un an ≤ 8 % pour cambriolages et vols sans violence, 68 % pour les homicides ⚠️ V6131). Une fois un auteur identifié et poursuivable, la réponse pénale est élevée (88 %). Cela appuie l'idée de Nagin : la certitude se joue à l'enquête, pas à la peine.

Délais (2024) : 13,3 mois en moyenne de la commission des faits à la condamnation pour un délit, 68,8 mois pour un crime (ministère de la Justice, *Les condamnations en France en 2024*, via recherche antérieure).

## 2. La prison

| | 1/1/2026 | 1/9/2026 |
|---|---|---|
| Détenus | 84 741 (62 610 condamnés, 22 131 prévenus) | 90 020 |
| Places | 62 284 | 63 348 |
| Densité | **136,1 %** (maisons d'arrêt 157,7 %) | **142,1 %** (maisons d'arrêt 176,1 %) |
| Places à créer pour 100 % | **22 457** | 26 672 |

- Flux 2025 : 107 283 entrants, 99 110 sortants ; durée moyenne d'écrou 11,8 mois pour les condamnés détenus, 5,3 mois pour les prévenus. Test de cohérence (loi de Little) : durée implicite de 10,3 mois, entre les deux.
- **Quantums des condamnés détenus** : 11 278 (18 %) à 1 an ou moins ; 14 995 de 1 à 2 ans ; 486 à perpétuité. 175 782 personnes suivies en milieu ouvert ; 18 322 TIG en cours.
- **Coût** : détenir 84 741 personnes à 105-130 € par jour (⚠️ V6279) coûte **3,2 à 4,0 Md€ par an**, à rapprocher d'un budget de la mission Justice de 12,4 Md€ en 2025 (+4,7 %) dont ≈ 4,6 Md€ pour l'administration pénitentiaire (⚠️ V6278).
- Comparaison européenne : densité française de 124 au 1/1/2024 (Conseil de l'Europe) contre une médiane d'environ 94 ⚠️ V6275. Les deux dates et les deux sources ne se comparent pas sans le dire.

## 3. Les options (M€ par an sauf mention)

| Option | Bas | Central | Haut | Lecture |
|---|---|---|---|---|
| **Construire pour 100 %** (22 457 places) : investissement | 7 860 M€ | 6 063 M€ | 4 491 M€ | l'annuité (40 ans, 3 %) et le fonctionnement donnent 0,6 à 1,0 Md€ par an ; le « haut » a plus de fonctionnement (part variable 0,8), donc ne se lit pas comme moins cher |
| **Construire pour 120 %** (8 334 places) : investissement | 2 917 M€ | 2 250 M€ | 1 667 M€ | 0,2 à 0,4 Md€ par an |
| **Courtes peines → bracelet ou TIG** : places libérées | 2 256 | 4 511 | 6 767 | soit 10 à 30 % des places manquantes pour 100 % |
| idem : gain net | -7 | **+55** | +220 | négatif si la part évitable du coût est faible (le coût fixe reste) |
| idem : reconvictions évitées par an | 0 | 184 | 482 | effet de récidive faible : l'enjeu est la place, pas la récidive |
| **Travail en prison** (cible 45 / 60 / 80 %) : coût | 113 | 120 | 123 | 12 500 à 30 700 postes en plus |
| idem : coût par reconviction évitée | n.d. (effet 0) | 158 000 € | 50 000 € | très sensible à l'effet, qui est incertain (H26) |
| **Police +10 %** (25 000 agents) : coût | 1 625 | 1 625 | 1 625 | |
| idem : faits évités par an | 19 800 | 40 800 | 60 000 | sur 1,8 M de faits des bases violences et biens |
| idem : coût par fait évité | 82 000 € | 40 000 € | 27 000 € | |
| **Prison +10 %** (8 474 détenus) : coût | 325 | 362 | 402 | |
| idem : faits évités par an | 0 | 9 000 | 26 900 | élasticité à la marge, très incertaine |
| idem : coût par fait évité | n.d. | 40 000 € | 15 000 € | |
| **Éloignement anticipé** d'étrangers condamnés détenus (5 / 15 / 30 %) : personnes | 735 | 2 205 | 4 410 | agrégat de nationalité enregistrée (§ 4) |
| idem : gain net | -1 | **+14** | +106 | négatif si le restant à purger est court |
| **Numérique** (procédures 1,71 M) : ETP libérés | 178 | 355 | 711 | |
| idem : valeur | 9 | 18 | 36 | contre une annuité de 62 M€ pour 530 M€ (borne haute de coût, H23) |
| idem : jours gagnés sur le délai d'un délit | 20 | 40 | 81 | sur 13,3 mois |

Hors scénarios : **détenir à perpétuité 486 personnes coûte ≈ 23 M€ par an** (ordre de grandeur ; voir § 7 de methode.md sur ce que cela ne doit pas devenir).

## 4. Nationalité enregistrée : ce que le modèle utilise, et ce qu'il n'utilise pas

- Total officiel au 1/1/2026 : **21 187 détenus de nationalité étrangère** (6 486 prévenus + 14 701 condamnés), soit 25,0 % des détenus ; 17 % des condamnés de 2025 ; 9 % des résidents (SSMSI 2025). L'option d'éloignement n'utilise que les 14 701 condamnés détenus, en un seul total.
- **Ce que ces ratios ne disent pas** : ni une propension (âge, sexe, non-résidents, détention provisoire plus fréquente faute de garanties de représentation), ni l'origine (les naturalisés comptent comme français), ni aucun lien avec la religion ou le quartier. Aucune de ces variables n'est dans le modèle.
- **Lecture** : même à 30 % d'éloignement avant fin de peine, l'économie nette reste d'environ 100 M€ par an, soit moins de 3 % du coût de la détention. L'éloignement n'est pas un levier de maîtrise de la surpopulation ; sa justification est ailleurs (droit, exécution des décisions) et se discute dans `sources/recherche-immigration-chiffres.md`.

## 5. Ce que les résultats disent des positions de l'auteur

1. **Refus des positions extrêmes, côté chaîne pénale** : le goulot est l'élucidation (60 % des affaires sans auteur), pas la sévérité des peines ; l'allongement des peines a peu d'appui dans la littérature (Nagin). La position anti-interdiction (calibrer plutôt qu'interdire) rejoint le constat que ce qui dissuade est la probabilité d'être pris. Tension à lui poser : plus de moyens pour l'enquête, c'est plus de police, donc plus d'État régalien, dans un programme libéral.
2. **Peines courtes alternatives et travail** : cohérents avec l'objectif de réinsérer plutôt que de marginaliser ; le bracelet est la seule option qui ressort positive au central en argent (+55 M€) et qui soulage 20 % du manque de places, mais l'effet sur la récidive est modeste (184 reconvictions par an). Le travail en prison coûte ≈ 120 M€ pour un effet très incertain.
3. **Construire** : 22 457 places pour 100 % coûte 4,5 à 7,9 Md€ d'investissement, à flux constant ; avec le seul levier des courtes peines (central) on couvre 20 % du manque. Aucune option seule ne résorbe la surpopulation.
4. **Numérique** : le temps de greffe gagné (355 ETP, 18 M€) ne finance pas à lui seul le plan de 530 M€ ; le bénéfice attendu est dans les jours gagnés (≈ 40 sur 400) et la qualité des procédures, que le modèle ne valorise pas. La Cour des comptes juge le coût global du plan inconnu (⚠️ V6282) : c'est le premier argument pour des modèles ouverts et auditables.
5. **La peine maximale mixte** n'est pas modélisée : son seul chiffre accessible (23 M€ par an) ne doit pas servir d'argument.

## 6. Limites

Les élasticités et effets de comportement sont des citations de mémoire (V6284-V6288), les coûts journaliers et le coût d'une place des ordres de grandeur non vérifiés en source primaire, l'effectif total de police n'est pas lu ; l'entonnoir mélange des unités ; les coûts sociaux du crime ne sont pas chiffrés ; l'incapacitation perdue (bracelet, éloignement) non plus. Avant toute publication : lire les études citées, le programme « Sécurités » du PAP 2026 et les rapports de la Cour des comptes sur l'administration pénitentiaire et le plan de transformation numérique.
