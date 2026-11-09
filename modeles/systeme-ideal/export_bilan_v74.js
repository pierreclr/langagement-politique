// Export des montants de la v7.4 B (ADOPTÉE, arbitrage 45 du 06/11/2026) pour sources/calculs/bilan_global.py (dictionnaire V74).
// Même liste de chargement que test_decisions_0611_v74.js, fichier final : export_bilan_v74.js à la place du test.
var A = this.Decisions0611V74, Y = this.Decisions0611V72, out = { variante: A.formulePatrimoineCourte(), scenarios: {} };
A.variante('B');
['bas', 'central', 'haut'].forEach(function (s) {
  var e = A.ecart(s), pd = A.prelevementsDepenses(s), lp = e.lignesPatrimoine, rp = A.recettePatrimoine(s);
  out.scenarios[s] = { ecart: e.total, solde2060: A.solde(s, 2060), dT: pd.dT, retraitesCapital: e.retraitesCapital, is: e.is, retenue: e.retenue, n03: e.n03, capitalDepart: e.capitalDepart,
    socle: pd.socle, enfants: pd.enfants, plancher: pd.plancher, bonus: pd.bonus, reprise: pd.reprise, surplus: A.surplus(s), controle: pd.controle,
    taxeAnnuelle: lp.taxeAnnuelle, recetteTaxe: lp.recetteTaxe, dmtgGardes: lp.dmtgGardes, dmto: lp.dmto, realisation: lp.realisation, plafonds: lp.plafonds, holdings: lp.holdings, trusts: lp.trusts, sci: lp.sci,
    differe: rp.differe, perteDiffere: rp.perteDiffere, effetPrix: rp.effetPrix };
});
out.po = A.prelevementsObligatoires(); out.tresorerie = A.tresorerie('central');
out.dette = {}; A.MACROS.forEach(function (m) { var j = A.jalons('central', m); out.dette[m] = [j.r0, j.r10, j.r20, j.r30]; });
out.economies = {}; A.MACROS.forEach(function (m) { out.economies[m] = A.economiesPourStabiliser('central', m); });
var c = A.combinaison(); out.combinaison = { ids: c.ids, manque: c.manque, dette: {} }; A.MACROS.forEach(function (m) { out.combinaison.dette[m] = [c.dette[m].r10, c.dette[m].r20, c.dette[m].r30]; });
out.marge = A.marge('reference');
out.trajectoire = []; for (var y = 2029; y <= 2070; y++) out.trajectoire.push([y, A.solde('central', y)]);
print(JSON.stringify(out));
// Corrections factuelles du grand livre (T65, 06/11/2026 ; registre modeles/grand-livre/corrections-bilan.md, lignes appliquées C01-C03) :
// effet constant sur le solde à partir de 2029, en Md€ de 2024-2025. Doit égaler EFFET_CORR de sources/calculs/bilan_global.py (contrôlé par ses tests).
// C10 ajoutée le 06/11/2026 (arbitrage 47 : 27,204 Md€ de contributions sur la masse salariale fondues, trou à financer, sans recalibrage adopté)
var CORR_T65 = 8.885 - (4.6 - 3.944) - 27.204;
var levC = function (s, y) { return CORR_T65; }, lvComb = Y.leviers(A.HYP.combinaison);
var corr = { effet: CORR_T65, solde2060: A.solde('central', 2060) + CORR_T65, dette: {}, economies: {}, combinaison: { dette: {}, manque: {} } };
A.MACROS.forEach(function (m) {
  var levCC = function (s, y) { return lvComb(s, y) + CORR_T65; };
  var j = A.jalons('central', m, levC); corr.dette[m] = [j.r0, j.r10, j.r20, j.r30];
  corr.economies[m] = A.besoin('central', m, levC);
  var jc = A.jalons('central', m, levCC); corr.combinaison.dette[m] = [jc.r10, jc.r20, jc.r30];
  corr.combinaison.manque[m] = A.besoin('central', m, levCC);
});
print(JSON.stringify(corr));
// Scénario « recommandations de Claude adoptées » sur les lignes à arbitrer du registre (C08 −3,884 au plus, C09 −3,153, C11 −2,221 ; C10 tranchée par l'arbitrage 47) : pour information, rien n'est décidé.
var RECO_T65 = -(3.884 + 3.153 + 2.221), levR = function (s, y) { return CORR_T65 + RECO_T65; };
var reco = { effet: RECO_T65, solde2060: A.solde('central', 2060) + CORR_T65 + RECO_T65, economies: {}, manque: {}, dette: {} };
A.MACROS.forEach(function (m) {
  reco.economies[m] = A.besoin('central', m, levR);
  reco.manque[m] = A.besoin('central', m, function (s, y) { return lvComb(s, y) + CORR_T65 + RECO_T65; });
  var j = A.jalons('central', m, function (s, y) { return lvComb(s, y) + CORR_T65 + RECO_T65; }); reco.dette[m] = [j.r10, j.r20, j.r30];
});
print(JSON.stringify(reco));
