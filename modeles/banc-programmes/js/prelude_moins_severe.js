/*
 * modeles/banc-programmes/js/prelude_moins_severe.js : jeu d'hypothèses « moins sévères » sur l'exil, l'évasion et la planification des grandes fortunes (variante du banc, 08/11/2026).
 * Chargé APRÈS la liste de decisions_0811.js et AVANT le pont : il remplace en mémoire (jsc) quelques constantes ; AUCUN fichier de modeles/systeme-ideal/ n'est modifié.
 * Convention des triplets : [favorable, central, défavorable] (ordre des modules). Dossier de sources : sources/banc-variante-moins-severe.md.
 * Ancrages (lus dans sources/exil-patrimoines-preuves.md, cotes A-B) : DGFiP via France Stratégie 2023 (départs de 0,2 à 0,7 % de la base ISF par an) ; Jakobsen, Kleven, Kolsrud, Landais, Muñoz
 * (NBER 32153, AER 2026) : −2 % de riches par point d'impôt sur la fortune ; Jakobsen, Jakobsen, Kleven, Zucman (QJE 2020) : environ −30 % de patrimoine imposable après 8 ans pour les très riches,
 * −10 % pour les aisés ; Brülhart et al. (AEJ: Policy 2022) : environ −30 % de base déclarée par point, dont 24 % seulement par déménagement ; CAE n° 69 (2021) pour la déclaration des transmissions.
 */
(function () {
  var G = this.GrandesFortunes0511, TP = this.TaxePatrimoine, T = this.Transmissions0611;
  function mettre(arr, v) { for (var i = 0; i < v.length; i++) arr[i] = v[i]; }
  // érosion de l'assiette à 1 point d'impôt sur la fortune (module grandes_fortunes_0511, HG08) : 20 / 35 / 55 % -> 15 / 30 / 45 % (aucune étude lue ne dépasse 30 à 45 %)
  mettre(G.HYP.erosion1pt, [0.15, 0.30, 0.45]);
  // érosion du capital mobile (taxe_patrimoine.js ; « bas » = scénario le moins favorable à la recette) : top 1 % 74 / 40 / 20 % -> 45 / 30 / 15 % ; reste 30 / 15 / 5 % -> 20 / 10 / 4 % ; autres actifs financiers 15 / 8 / 3 % -> 10 / 5 / 2 %
  TP.PARAM.bas.erosionTop = 0.45; TP.PARAM.central.erosionTop = 0.30; TP.PARAM.haut.erosionTop = 0.15;
  TP.PARAM.bas.erosionReste = 0.20; TP.PARAM.central.erosionReste = 0.10; TP.PARAM.haut.erosionReste = 0.04;
  TP.PARAM.bas.erosionFin = 0.10; TP.PARAM.central.erosionFin = 0.05; TP.PARAM.haut.erosionFin = 0.02;
  // transmissions (HT5, HT6) : déclaration et planification 17 / 30 / 45 % -> 12 / 20 / 32 % ; départs des patrimoines mobiles 5 / 12 / 27 % -> 2 / 5 / 12 % (NBER 32153 : 2,5 points par an x 2 % = 5 % du stock)
  mettre(T.HYP.d, [0.12, 0.20, 0.32]);
  mettre(T.HYP.eMobile, [0.02, 0.05, 0.12]);
}).call(this);
