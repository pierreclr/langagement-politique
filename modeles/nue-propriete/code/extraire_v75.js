// Extraction (lecture seule) des agrégats par tranche de la v7.5 retenue, pour modeles/nue-propriete/.
(function () {
  var V = this.Decisions0611V75, TP = this.TaxePatrimoine, log = (typeof print === 'function') ? print : console.log;
  var REC = { regime: 'RP', X: 1e6, tInf: 0.03, K: 4e5, payeProrata: true, plancherPro: true };
  V.init();
  var a = V.agreger(REC), r = V.recette(REC), cal = V.calage(0.03);
  var out = { recette: r, calage: cal, noms: V.NOMS, bornes: V.BORNES.slice(0, 12), tranches: a.tranches.map(function (t) { return { n: t.n, net: t.net, Pp: t.Pp, paye: t.paye, differe: t.differe, chargeRP: t.chargeRP }; }),
              hvp: TP.HVP.tranches, hvpSeuils: TP.HVP.seuils };
  log(JSON.stringify(out));
})();
