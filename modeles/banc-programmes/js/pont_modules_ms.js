/*
 * modeles/banc-programmes/js/pont_modules_ms.js : valeurs brutes des deux modules de notre système qui dépendent de l'exil et de l'évasion (M-PAT : fonction du patrimoine v7.5 ; M-TRANS : transmissions),
 * lues aux trois scénarios. Lancé deux fois par ponts.py : sans puis avec prelude_moins_severe.js ; le Python en tire les écarts de la variante. Aucune écriture de fichier.
 */
var Bt = this.BaseTravail0611, A = this.Decisions0611V74, T = this.Transmissions0611, R = this.RetraitesAisees0611, E = this.Decisions0811;
var AN = []; for (var yy = 2029; yy <= 2058; yy++) AN.push(yy);
var s = E.s3(), v75 = Bt.v75(), tInf = Bt.S.v75.tInf, old = A.HYP.patrimoine.tInf;
function rr(sc) { A.HYP.patrimoine.tInf = tInf; try { var rc = A.recettePatrimoine(sc); return rc.nette / rc.tauxEffectif; } finally { A.HYP.patrimoine.tInf = old; } }
var cfgT = { A: R.S.transReco.A, K: R.S.transReco.K, top: true, k: 1, nationalite: 'court' };
var tr3 = T.trois(cfgT).map(function (x) { return x.netActuel; });
function ramp(y) { return Math.max(0, Math.min(1, (y - R.S.rampe[0]) / (R.S.rampe[1] - R.S.rampe[0]))); }
print(JSON.stringify({ annees: AN, ramp: AN.map(ramp), fonction: v75.fonction, recette_v75: v75.recette, ratios: [rr('bas'), rr('central'), rr('haut')], trans: tr3 }));
