// Réglage minimal de la fonction des revenus après C10 (arbitrage 47 du 06/11/2026 : 27,204 Md€ de contributions sur la masse salariale fondus).
// PRÉSENTÉ, NON ADOPTÉ. Même liste de chargement que test_decisions_0611_v74.js, ce fichier à la place du test.
// Forme gardée : T(R) = a·R − b − c·(1 − e^(−R/1500)), B(R) = −T(R) ; v7.2/v7.4 B : a = 0,65 ; b = 412,5 ; c = (a − m0)·K = 675 (m0 = 0,20).
// Trois réglages à un seul paramètre : (A) a seul, m0 fixe (c monte avec a : touche surtout les hauts revenus) ; (A') a et m0 ensemble (c fixe : +Δ de taux partout) ; (B) b seul (le versement de base baisse pour tous).
var A = this.Decisions0611V74;
var B0 = JSON.parse(JSON.stringify(A.VARIANTES.B.bareme));
function regle(q) { A.VARIANTES.B.bareme = q; A.variante('B'); return A.ecart('central').total; }
function cas(q) { A.VARIANTES.B.bareme = q; A.variante('B'); var s = A.sched(), out = {}; [0, 1500, 2000, 3000, 5000, 10000].forEach(function (R) { out[R] = s.S - s.T(R); }); var ct = {}; A.casTypesRevenus().forEach(function (c) { ct[c.id] = [c.ecart, c.ecartPct]; }); out.casTypes = ct; return out; }
var e0 = regle(B0), base = cas(B0), res = { e0: e0, base: base, cibles: {} };
function bisect(f, lo, hi) { for (var k = 0; k < 60; k++) { var m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; } return (lo + hi) / 2; }
[27.204, 27.204 - 18.367].forEach(function (cible) {
  var mk = {
    A: function (x) { var q = JSON.parse(JSON.stringify(B0)); q.mInf = x; return q; },
    Ap: function (x) { var q = JSON.parse(JSON.stringify(B0)); q.mInf = x; q.m0 = B0.m0 + (x - B0.mInf); return q; },
    B: function (x) { var q = JSON.parse(JSON.stringify(B0)); q.S = x; return q; }
  }, o = {};
  o.A = bisect(function (x) { return regle(mk.A(x)) - e0 - cible; }, 0.65, 0.80);
  o.Ap = bisect(function (x) { return regle(mk.Ap(x)) - e0 - cible; }, 0.65, 0.80);
  o.B = bisect(function (x) { return -(regle(mk.B(x)) - e0 - cible); }, 300, 412.5);
  var r = {};
  ['A', 'Ap', 'B'].forEach(function (k) { var q = mk[k](o[k]); r[k] = { param: o[k], q: q, ecart: regle(q) - e0, cas: cas(q) }; });
  res.cibles[cible.toFixed(3)] = r;
});
A.VARIANTES.B.bareme = B0; A.variante('B');
print(JSON.stringify(res));
