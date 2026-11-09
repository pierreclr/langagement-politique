// Export des montants de la v7.2 pour sources/calculs/bilan_global.py (dictionnaire V72). Même liste de chargement que test_decisions_0611_v72.js, fichier final : export_bilan_v72.js.
var Y = this.Decisions0611V72, out = { scenarios: {} };
['bas', 'central', 'haut'].forEach(function (s) {
  var e = Y.ecart(s), pd = Y.prelevementsDepenses(s), lp = e.lignesPatrimoine;
  out.scenarios[s] = { ecart: e.total, solde2060: Y.solde(s, 2060), dT: pd.dT, retraitesCapital: e.retraitesCapital, is: e.is, retenue: e.retenue, n03: e.n03, capitalDepart: e.capitalDepart,
    socle: pd.socle, enfants: pd.enfants, plancher: pd.plancher, bonus: pd.bonus, reprise: pd.reprise, surplus: Y.surplus(s),
    taxeAnnuelle: lp.taxeAnnuelle, recetteTaxe: lp.recetteTaxe, dmtgGardes: lp.dmtgGardes, dmto: lp.dmto, realisation: lp.realisation, plafonds: lp.plafonds, holdings: lp.holdings, trusts: lp.trusts, sci: lp.sci };
});
var t = Y.tau(); out.K = t.K; out.tauxEffectif = t.tauxEffectif; out.baissePatrimoine = t.baisse;
out.dette = {}; Y.MACROS.forEach(function (m) { var j = Y.jalons('central', m); out.dette[m] = [j.r0, j.r10, j.r20, j.r30]; });
out.economies = {}; Y.MACROS.forEach(function (m) { out.economies[m] = Y.economiesPourStabiliser('central', m); });
var c = Y.combinaison(); out.combinaison = { ids: c.ids, r2040: c.rendement[2040], manque: c.manque, dette: {} }; Y.MACROS.forEach(function (m) { out.combinaison.dette[m] = [c.dette[m].r10, c.dette[m].r20, c.dette[m].r30]; });
out.trajectoire = Y.trajectoireSolde('central').map(function (r) { return [r.an, r.solde]; });
var bq = Y.bascule(); out.bascule = { T: bq.T, patrimoine: bq.patrimoine, bloc: bq.bloc.partT, departements: bq.departements.partT, regions: bq.regions.partT, aom: bq.aom.partT };
print(JSON.stringify(out));
