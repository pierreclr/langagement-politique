/*
 * modeles/banc-programmes/js/pont_isf_abs.js : recette ABSOLUE de l'ISF rétabli sur les trois tranches du sommet (T1 : P99 à 10 M€, T2 : 10 à 100 M€, T3 : au-dessus de 100 M€), nette de l'érosion de l'assiette et de l'externalité
 * de l'exil (mêmes formules que grandes_fortunes_0511.varianteB, sans la soustraction de la taxe de 1 % de la v5.4). Lancé deux fois par ponts.py (sans puis avec prelude_moins_severe.js) : le Python en tire la
 * variation due aux hypothèses moins sévères, qui est ajoutée à la recette de base. Pourquoi : la recette de varianteB est nette de la taxe de 1 % de la v5.4, elle-même calculée avec d'autres érosions
 * (taxe_patrimoine.js), de sorte que baisser l'érosion y fait paraître la recette de l'ISF plus FAIBLE (la base de 1 % remplacée devient plus grosse) : artefact de comptabilité, pas un effet économique.
 */
var G = this.GrandesFortunes0511, ADULTES = G.HYP.adultesParMenage, SEUIL = 1.3e6;
var VAR = { sobre: { tauxMilieu: 0.008, taux2: 0.015, taux3: 0.015 }, renforce: { tauxMilieu: 0.01, taux2: 0.02, taux3: 0.03 } }, out = {};
Object.keys(VAR).forEach(function (nom) {
  out[nom] = ['bas', 'central', 'haut'].map(function (sc) {
    var o = { seuilAdulte: SEUIL / ADULTES, tauxMilieu: VAR[nom].tauxMilieu, taux2: VAR[nom].taux2, taux3: VAR[nom].taux3 };
    var S = o.seuilAdulte * ADULTES, TR = G.tranches(sc), pa = G.HYP.partAssiette1pc, tot = 0;
    ['T1', 'T2', 'T3'].forEach(function (k) {
      var T = TR[k], W1 = T.W * pa, tx = G.impotBareme(W1, S, o), eV = G.erosion(sc, tx / W1 * 100);
      tot += T.n * tx * (1 - eV) / 1e9 - T.n * W1 * G.HYP.partExil * eV * G.HYP.externalite / 1e9;
    });
    return tot;
  });
});
print(JSON.stringify(out));
