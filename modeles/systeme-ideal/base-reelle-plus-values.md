# Base réelle des plus-values et fin de la purge de l'assurance-vie au décès (03/11/2026)

Décisions de l'auteur du 03/11/2026 :
- **Q4** : toutes les plus-values (immobilier et financier) sont imposées sur la **base réelle** : prix de vente frais déduits − prix d'achat frais compris, **indexé sur l'inflation (IPC) depuis l'acquisition**. Question posée : « à quel point l'État perd, ou à quel point les gens perdent ».
- **Q5** : fin de l'effacement (« purge ») des plus-values de l'assurance-vie au décès.

## 1. Ce qui est devenu le défaut dans le code

| Fichier | Avant | Maintenant (défaut) | Variante gardée |
|---|---|---|---|
| `patrimoine_financier.js` | base nominale ; `reel: true` en option | base réelle ; AV au décès : gains latents taxés | `reel: false` ; `deces: 'statuQuo'` |
| `patrimoine_immobilier.js` | réelle (déjà) | réelle | `base: 'nominale'` (nouvelle variante de comparaison, `profil`, `plusValues`, `reportPertes`) |
| `deces_realisation.js` | réelle pour l'immobilier et la RP, nominale pour titres, entreprises, AV | réelle pour toutes les classes | `reel: false` |
| `simulations/ma-situation-financier.js` (+ `ma-situation.html`) | `base: 'nominale'`, `avDeces: 'statuQuo'` | `base: 'reelle'`, `avDeces: 'gainsLatents'` | `base: 'nominale'`, `avDeces: 'statuQuo'` |
| `simulations/ma-situation-patrimoine.js` | pas d'option de base (réelle) | inchangé | — |
| `options_financement.js` | — | option `finPurgeAV` (défaut `false` dans la référence du palier 1, voir § 3) | — |

Tests : `test_patrimoine_financier.js` 323, `test_deces_realisation.js` 231, `test_patrimoine_immobilier.js` 214, `test_options_financement.js` 75, `simulations/test_ma_situation_financier.js` 260, `simulations/test_ma_situation_patrimoine.js` 137 contrôles, tous verts. Les cas qui testaient le nominal passent `reel: false` / `base: 'nominale'` ; un test vérifie chaque nouveau défaut.

## 2. Coût pour l'État de la base réelle (Md€/an, régime de croisière, taux de 50 %, report des crédits 10 ans)

**Estimation** (méthode : mêmes fonctions du modèle avec et sans la base réelle ; scénarios du modèle de patrimoine : « bas » = hypothèses les moins favorables au solde public, comme dans `patrimoine_*.js`).

| Poste | bas | central | haut |
|---|---|---|---|
| Financier (hors fin de purge) : nominal → réel | −4,1 | **−6,6** | −9,3 |
| dont assurance-vie (rachats) | −3,1 | −4,8 | −6,4 |
| dont portefeuille / PEA / entreprise / pro / crypto | −1,0 | −1,8 | −2,9 |
| Immobilier hors RP : recettes de la réforme (brut) | −2,0 | −4,4 | −6,1 |
| Immobilier : coût du report des pertes (crédits plus élevés en réel, car les moins-values réelles sont plus grandes) | −2,2 | −0,5 | −0,2 |
| **Immobilier net** | −4,2 | **−4,9** | −6,3 |
| **Total base réelle vs nominale (financier + immobilier)** | **−8,3** | **−11,5** | **−15,6** |

Lecture : à base nominale, le prélèvement de 50 % rapporterait environ 11,5 Md€ de plus au central ; la base réelle les laisse aux contribuables. Les deux tiers du coût financier viennent de l'assurance-vie (le fonds euros rapporte à peine plus que l'inflation, donc une grande partie du « gain » nominal est de l'érosion monétaire). Facteurs gain réel / gain nominal du modèle (H320, hypothèses non sourcées pour r et d sauf d de l'AV) : portefeuille et PEA 0,76 ; AV 0,56 ; entreprise 0,86 ; pro 0,82 ; crypto 0,94 ; immobilier central : le gain par euro de vente passe de 0,29 à 0,17.

*Élasticité 0,5 / 1,0 / 2,0 adoptée le 03/11/2026* (H252, `sources/elasticite-plus-values.md` § 5) : les lignes immobilières du tableau ci-dessus sont recalculées (avant : recettes −4,9 / −6,6, report −0,6 / −0,2, immobilier net −5,5 / −6,8, total −12,1 / −16,1 au central / haut ; le scénario bas est inchangé, le taux actuel moyen sur le gain réel y dépasse 50 %, donc pas de verrouillage). Le verrouillage du défaut immobilier passe de 15,9 % à 29,2 % des ventes gagnantes hors RP au central (coût 0,80 → 1,47 Md€).

Ces montants n'incluent pas les effets de comportement propres à la base nominale (le modèle immobilier recalcule le verrouillage avec la même élasticité : limite, voir § 6).

**Effet sur le décès = réalisation** (option non retenue dans la référence du palier 1, `deces_realisation.js`, option (i), recette nette, base réelle moins base nominale) : −7,2 / **−9,7** / −11,3 Md€ (dont immobilier −4,4 au central, déjà réel avant ; titres −0,9, entreprises −1,8, assurance-vie −2,6 : l'effet nouveau de Q4 est donc −5,3 au central).

## 3. Fin de la purge de l'assurance-vie au décès (Q5)

`PF.assuranceVieDeces` : capitaux décès × part de gains latents × (1 − anticipation) × (1 − fuite), × facteur réel, × 50 %.

| | bas | central | haut |
|---|---|---|---|
| Base réelle (nouveau défaut) | +1,5 | **+2,2** | +2,9 |
| Base nominale (variante) | +2,7 | **+3,9** | +5,3 |

Le chiffre de 3,9 Md€ cité dans le topo correspond à la base nominale ; combiné à la décision Q4, le chiffre cohérent est **+2,2 Md€ au central** (le gain latent est lui aussi indexé sur l'inflation ; hypothèse du modèle : 12,8 ans de détention, rendement 4 %, H320). Écart de 1,75 Md€ à lire comme une conséquence directe de Q4.

## 4. Effet sur le solde du palier 1

- Le palier 1 de référence (`palier1.js`, taux plat 35 %, socle 500 €, héritage à 50 %) **ne comptait aucune** de ces recettes : solde central **−163,3 Md€** (bas −119,8, haut −235,7), **inchangé** par Q4 et Q5. Ni le modèle gagnants-perdants (`modeles/gagnants-perdants/`), qui taxe le capital courant au taux plat et le capital des retraités au PFU, ni la référence n'ont de poste « plus-values » à base nominale.
- Ce qui bouge, ce sont les **options** de `options-financement-palier1.md` (central) : (d2) décès = réalisation avec report du prix d'acquisition : +6,3 → **+4,6** ; (d2c) décès = réalisation sans crédit : +8,5 → **+5,8** ; (d3) PFU à 50 % : +2,8 → **+2,3** (surplus sur le taux plat, hors fin de purge). Les valeurs régénérées sont dans `resultats-options-financement.txt` ; le texte de `options-financement-palier1.md` garde les anciens chiffres nominaux (à relire).
- Option `finPurgeAV` (nouvelle) : ajoute, au taux plat de 35 % : **+1,5 Md€ au central** (palier 1 central −163,3 → −161,8 ; bas −119,8 → −117,7 ; haut −235,7 → −234,7). Laissée à `false` dans la référence pour ne pas modifier les soldes publiés ; à passer à `true` si l'auteur veut que la référence l'intègre.
- Bilan du déficit : la base réelle est une **perte de recettes potentielles** (12 Md€ au central) par rapport à un système nominal qui n'a jamais été dans la référence ; elle ne creuse donc pas le −163 Md€ de départ, mais elle réduit d'autant ce que les options patrimoniales peuvent rapporter.

## 5. Qui y gagne : ordres de grandeur par durée de détention

**Estimation** (calcul reproductible : gain nominal = P((1+r)^d − 1), gain réel = P((1+r)^d − (1+π)^d), π = 2 % ⇒ H249 ; impôt à 50 %, sans frais ni pertes ; rendements r : **hypothèses non sourcées** sauf π). Comparaison avec le droit actuel : PFU de 31,4 % sur le gain nominal (financier).

| Cas | d | Gain nominal | Gain réel | Impôt 50 % nominal | Impôt 50 % réel | Économie du détenteur | PFU actuel (31,4 %) |
|---|---|---|---|---|---|---|---|
| Petit épargnant, 10 000 € en actions à 7 %/an (hypothèse non sourcée) | 2 | 1 449 | 1 045 | 725 | 523 | 202 (28 %) | 455 |
| | 10 | 9 672 | 7 482 | 4 836 | 3 741 | 1 095 (23 %) | 3 037 |
| | 20 | 28 697 | 23 837 | 14 348 | 11 919 | 2 430 (17 %) | 9 011 |
| | 30 | 66 123 | 58 009 | 33 061 | 29 004 | 4 057 (12 %) | 20 762 |
| Petit épargnant, 10 000 € en fonds euros à 2,6 %/an (hypothèse non sourcée) | 2 | 527 | 123 | 263 | 61 | 202 (77 %) | 165 |
| | 10 | 2 926 | 736 | 1 463 | 368 | 1 095 (75 %) | 919 |
| | 20 | 6 709 | 1 849 | 3 354 | 925 | 2 430 (72 %) | 2 107 |
| | 30 | 11 598 | 3 485 | 5 799 | 1 742 | 4 057 (70 %) | 3 642 |
| Propriétaire bailleur, bien de 200 000 € à +3,02 %/an (inflation 2 % + dérive de 1 % ; hypothèse non sourcée, H246 de mémoire) | 2 | 12 262 | 4 182 | 6 131 | 2 091 | 4 040 (66 %) | — |
| | 10 | 69 306 | 25 507 | 34 653 | 12 753 | 21 899 (63 %) | — |
| | 20 | 162 628 | 65 438 | 81 314 | 32 719 | 48 595 (60 %) | — |
| | 30 | 288 288 | 126 016 | 144 144 | 63 008 | 81 136 (56 %) | — |
| Gros patrimoine, 5 M€ d'actions à 7 %/an | 10 | 4 835 757 | 3 740 785 | 2 417 878 | 1 870 392 | 547 486 (23 %) | 1 518 428 |
| | 30 | 33 061 275 | 29 004 467 | 16 530 638 | 14 502 234 | 2 028 404 (12 %) | 10 381 240 |

Lectures :
1. L'avantage relatif de la base réelle est **le plus fort sur les durées courtes et les rendements proches de l'inflation** (fonds euros, immobilier) ; il diminue avec la durée pour les actifs à fort rendement (23 % à 10 ans, 12 % à 30 ans sur les actions). C'est mécanique : l'inflation pèse moins dans le gain quand le capital a beaucoup crû.
2. **Le fonds euros et l'immobilier** sont les grands bénéficiaires relatifs : l'épargnant « prudent » et le propriétaire qui détient un bien à rendement réel faible ; le gain en valeur absolue est proportionnel au capital (le gros patrimoine économise le plus en euros, le petit épargnant en pourcentage identique à rendement égal).
3. À 50 %, même en base réelle, le prélèvement dépasse le PFU actuel de 31,4 % sur un gain nominal : à 10 ans sur actions, 3 741 € contre 3 037 € (+23 %) pour le petit épargnant ; la base réelle ne compense donc qu'en partie la hausse du taux (50 % contre 31,4 %). Sur le fonds euros, elle la compense largement (368 € contre 919 €).
4. Quand le rendement nominal est inférieur à l'inflation, l'impôt nominal frappe une perte réelle ; la base réelle ramène l'impôt à zéro (et ouvre un crédit de 50 % reportable, pas remboursé).

## 6. Dette, inflation et intérêts (sans chiffrage)

L'inflation érode la valeur réelle d'une dette à taux fixe : l'emprunteur rembourse en euros plus faibles et gagne, en valeur réelle, sur le capital emprunté, alors que les intérêts versés sont nominaux (une part de ces intérêts compense l'érosion du capital pour le prêteur). La base réelle indexe le prix d'achat sur l'IPC, mais **ne tient pas compte de ce gain de l'emprunteur** : un bailleur qui finance 80 % d'un bien par un prêt à taux fixe a un rendement réel sur fonds propres bien supérieur au rendement réel du bien, et la base réelle ne l'impose pas (l'indexation de tout le prix d'achat, financé par dette inclus, avantage le propriétaire endetté). Symétriquement, les intérêts payés sont, pour la fraction qui ne fait que compenser l'inflation, du remboursement de capital réel : certaines écoles proposent de ne déduire que les intérêts réels. Le modèle ne chiffre ni l'un ni l'autre : il n'a pas la distribution des taux d'endettement et des taux d'emprunt par date d'acquisition (données non intégrées, hypothèse non sourcée à ne pas inventer). À faire : s'appuyer sur les statistiques de la Banque de France sur les crédits à l'habitat et sur l'enquête Patrimoine de l'Insee.

## 7. Limites

- Rendements et durées de détention des actifs financiers : H320, hypothèses non sourcées pour r et d (sauf d de l'AV, France Assureurs) ; l'inflation de 2 % est constante (H249), alors que l'indexation sur l'IPC réel varie selon l'année d'acquisition (2022-2023 : forte inflation, base réelle plus favorable aux acheteurs de ces années).
- Variante nominale immobilière : seul le gain par euro est recalculé ; le comportement (verrouillage, volume) reprend les mêmes élasticités (`comportement` est fonction du taux effectif actuel, non recalibré).
- Frais d'acquisition réels pris en compte au niveau du modèle (forfait 7,5 % avant réforme, 2,5 % après) ; les cas types du § 5 les ignorent.
- Assurance-vie au décès : le facteur réel reprend la durée de détention de l'AV (12,8 ans), pas la durée jusqu'au décès, qui est plus longue (le gain réel serait probablement plus faible : le chiffre de +2,2 est un majorant du réel, +3,9 le majorant nominal).
- Les montants ne sont ni des prédictions ni des estimations dynamiques (régime de croisière, sans transition).
- Contraintes juridiques de la fin de la purge (CGI 150-0 B, 757 B ; rétroactivité) : non examinées ici.

## 8. Reproduire

```
cd modeles/systeme-ideal
jsc patrimoine_financier.js test_patrimoine_financier.js
jsc patrimoine_financier.js deces_realisation.js test_deces_realisation.js
jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js dvf_patrimoine.js patrimoine_immobilier.js test_patrimoine_immobilier.js
jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js options_financement.js test_options_financement.js
```
Chiffres du § 2 : `PF.bilan(sc, {reel: false, deces: 'statuQuo'})` contre `PF.bilan(sc, {deces: 'statuQuo'})` ; `PI.plusValues(sc, {base: 'nominale'})` et `PI.reportPertes(sc, 10, {base: 'nominale'})` contre le défaut.
