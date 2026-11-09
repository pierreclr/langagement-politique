// Contrôles de continu.js. Lancer : jsc modele.js continu.js test_continu.js
var Q = (typeof CD !== 'undefined') ? CD : require('./modele.js'), X = (typeof CDC !== 'undefined') ? CDC : require('./continu.js');
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function proche(a, b, t) { return Math.abs(a - b) <= t; }
var p = Q.params();
['hyper', 'exp', 'marg'].forEach(function (f) {
  var K = 150000, x;
  ok(X.impot(f, K, 0) === 0, f + ' : impôt nul à 0');
  ok(X.impot(f, K, 1e4) > 0 && X.impot(f, K, 1e4) < X.impot(f, K, 1e5) && X.impot(f, K, 1e5) < X.impot(f, K, 1e6), f + ' : impôt strictement croissant, positif dès le premier euro');
  ok(X.impot(f, K, 1e9) / 1e9 < 0.5 + 1e-12 && X.impot(f, K, 1e9) / 1e9 > 0.49, f + ' : taux moyen < 50 % et proche de 50 % à 1 Md€');
  var maxEcart = 0, h; for (x = 1000; x < 1e8; x *= 1.07) { h = x * 1e-5; maxEcart = Math.max(maxEcart, Math.abs((X.impot(f, K, x + h) - X.impot(f, K, x - h)) / (2 * h) - X.marginal(f, K, x))); }
  ok(maxEcart < 1e-4, f + ' : taux marginal analytique = dérivée numérique (écart max ' + maxEcart + ')');
  ok(X.impot(f, K, 1e3) / 1e3 < 0.5 * 1e3 / (1e3 + K) + 1e-9 || f !== 'hyper', f + ' : taux moyen faible aux petits montants');
  ok(proche(X.marginal(f, K, 0), 0, 1e-12), f + ' : taux marginal nul à 0 (aucun seuil, aucun saut)');
});
ok(X.margMax('hyper', 190000) <= 0.5 && X.margMax('marg', 64000) <= 0.5, 'hyper et marg : taux marginal ≤ 50 % partout');
ok(proche(X.margMax('exp', 390000), 0.5 * (1 + Math.exp(-2)), 1e-3), 'exp : taux marginal maximal 56,8 % (à x = 2K) : dépasse 50 %');
ok(proche(X.impot('hyper', 190000, 58000), 0.5 * 58000 * 58000 / 248000, 1e-6), 'hyper K = 190 000 : impôt à 58 000 €');
[100000, 50000].forEach(function (E) { ['hyper', 'exp', 'marg'].forEach(function (f) {
  var K = X.calibrer(f, E); ok(proche(X.partConservee(f, K, p), Q.partImposable(p, E), 1e-9), f + ', E = ' + E + ' : même recette que l\'exemption (K = ' + Math.round(K) + ')');
  ok(proche(X.recette(f, K, 0.31), Q.recette(p, E, 0.5, 0.31), 1e-6), f + ', E = ' + E + ' : recette identique à fuite 31 %');
  var c = X.comparaison(f, K, E, p); ok(c.plus > 0.5 && c.moins > 0.1 && c.plus + c.moins + c.egal > 0.999, f + ', E = ' + E + ' : la majorité paie plus, les plus gros héritages paient moins (' + Math.round(c.plus * 100) + ' % / ' + Math.round(c.moins * 100) + ' %)');
}); });
ok(proche(X.partConservee('hyper', 1, p), 1, 1e-3) && X.partConservee('hyper', 1e11, p) < 1e-3, 'part conservée : 1 quand K → 0 (50 % dès le premier euro), 0 quand K → ∞');
// capital
ok(proche(X.transfert({ forme: 'exp', K: 47000 }, 0), 40000, 1e-9) && X.transfert({ forme: 'exp', K: 47000 }, 1e5) < X.transfert({ forme: 'exp', K: 47000 }, 5e4), 'capital exp : 40 000 € au premier euro, décroissant');
['exp', 'hyper', 'gauss'].forEach(function (f) { var K = X.calibrerCapital(f), c = X.coutCapital({ forme: f, K: K });
  ok(proche(c[1], Q.montants('C').central, 1e-6) && c[0] < c[1] && c[1] < c[2], 'capital ' + f + ' : même coût central que la variante C (' + c[1].toFixed(2) + ' Md€) et favorable < central < défavorable'); });
ok(proche(X.penteMax({ forme: 'exp', K: 80000 }).pente, 0.5, 1e-9), 'capital exp K = 80 000 : pente initiale 50 %, comme C');
ok(X.penteMax({ forme: 'hyper', K: X.calibrerCapital('hyper') }).pente > 1, 'capital hyper à coût égal : pente > 100 % (H + g(H) non monotone) : rejeté');
// formes D, E (taux moyen convexe) et D', E' (taux marginal convexe), H610-H611
ok(proche(X.margMax('hyper2', 250000), 0.5625, 2e-3), 'hyper2 (D) : taux marginal maximal 56,25 % (à √3·K) : dépasse 50 %');
ok(proche(X.margMax('hyper3', 250000), 0.5 * 4 / 3, 2e-3), 'hyper3 (E) : taux marginal maximal 66,7 % : dépasse 50 %');
['hyper2', 'hyper3', 'marg2', 'marg3'].forEach(function (f) {
  var K = 100000, x, maxEcart = 0, h;
  ok(X.impot(f, K, 0) === 0 || proche(X.impot(f, K, 0), 0, 1e-9), f + ' : impôt nul à 0');
  for (x = 1000; x < 1e8; x *= 1.07) { h = x * 1e-5; maxEcart = Math.max(maxEcart, Math.abs((X.impot(f, K, x + h) - X.impot(f, K, x - h)) / (2 * h) - X.marginal(f, K, x))); }
  ok(maxEcart < 1e-4, f + ' : taux marginal analytique = dérivée numérique (écart max ' + maxEcart + ')');
  ok(X.impot(f, K, 1e9) / 1e9 < 0.5 + 1e-9 && X.impot(f, K, 1e9) / 1e9 > 0.49, f + ' : taux moyen proche de 50 % à 1 Md€');
  var Kc = X.calibrer(f, 100000); ok(proche(X.partConservee(f, Kc, p), Q.partImposable(p, 100000), 1e-9), f + ' : même recette que l\'exemption de 100 000 € (K = ' + Math.round(Kc) + ')');
});
ok(X.margMax('marg2', 87132) <= 0.5 && X.margMax('marg3', 93690) <= 0.5, 'marg2 et marg3 (D\', E\') : taux marginal ≤ 50 % partout');
ok(X.impot('marg3', 94000, 58000) < X.impot('hyper', 190000, 58000) / 3, 'E\' fait payer l\'héritier médian moins de 1/3 de ce que fait payer A');
ok(X.impot('marg3', X.calibrer('marg3', 100000), 1e6) - X.impotExemption(1e6, 100000) > -10000, 'E\' : les très gros héritages (1 M€) paient à moins de 10 000 € de l\'exemption (A : −29 000 €)');
ok(X.margCumuleMax({ forme: 'exp', K: 80000 }, { forme: 'marg3', K: 94000 }).taux <= 0.5 + 1e-9, 'capital exp K = 80 000 + impôt E\' : taux marginal cumulé ≤ 50 % (objectif ≤ 75 %)');
ok(proche(X.coutCapital({ forme: 'exp', K: 80000 })[1] - Q.montants('C').central, 3.2, 0.1), 'capital exp K = 80 000 : +3,2 Md€ par rapport à la variante C');
log('TOUS LES CONTRÔLES PASSENT');
