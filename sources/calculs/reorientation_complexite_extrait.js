// Extrait des résultats de modeles/reconversion (par ses fonctions) pour sources/calculs/reorientation_complexite.py.
// Lancer depuis modeles/reconversion/ :
//   jsc ../industrie-complexite/modele.js modele.js ../../sources/calculs/reorientation_complexite_extrait.js
// Sortie : JSON (scénario, calendrier) -> chiffres à 5 ans (2033) et 10 ans (2038) et synthèses.
var R = this.Reconversion, T6 = this.IndustrieComplexite;
var cas = [['bas', 'favorable'], ['central', 'central'], ['haut', 'defavorable']];
var out = {};
cas.forEach(function (c) {
  ['4', '7', '10'].forEach(function (cal) {
    var r = R.simuler({ taille: c[0], marche: c[1], calendrier: cal, T6: T6 }), s = r.synthese, a = r.annees;
    function an(i) { var o = a[i]; return { annee: o.annee, postesCumules: o.postesCumules, nonEmploi: o.nonEmploi, budgetNet: o.coutBudgetaireNet,
      prodManquante: o.productionManquante, allocations: o.allocations, formation: o.formation, mobilite: o.mobilite, impotPerduNet: o.impotPerduNet, gainV1: o.gainNet_v1, gainPrudente: o.gainNet_prudente, gainV2: o.gainNet_v2 }; }
    out[c[0] + '|' + cal] = { postes: s.postesSupprimes, absorbes: s.absorbes, redeployes: s.redeployes, deplaces: s.deplaces,
      retraiteSansRetour: s.retraiteSansRetour, picNonEmploi: s.picNonEmploi, prodManquanteCumulee: s.productionManquanteCumulee,
      budgetNetCumule: s.coutBudgetaireNetCumule, formationCumulee: s.formationCumulee, allocationsCumulees: s.allocationsCumulees,
      retour1: s.tauxRetour1an, retour5: s.tauxRetour5ans, coutSysteme: s.gainT6.coutSysteme, an5: an(4), an10: an(9), an2045: an(16) };
  });
});
print(JSON.stringify(out));
