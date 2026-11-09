// Tables de la section « Capitalisation progressive (T48) » de resultats.md.
// Lancer depuis modeles/retraites/ : jsc capitalisation.js rapport_capitalisation.js > resultats-capitalisation.txt
var Q = this.RetraitesCapi || require('./capitalisation.js');
var log = (typeof print === 'function') ? print : console.log;
function f(x, d) { return (Math.round(x * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toFixed(d || 0); }
var SC = ['bas', 'central', 'haut'], PT = [1, 3, 6];

log('== A. Double charge : pic, cumul, fonds, dette (annees = 90) ==');
log('scenario | points | pic Md/an (% PIB) annee | points de cotisation temporaires au pic | cumul 30 ans / 60 ans (Md) | fonds 30 / 60 ans (Md ; % PIB) | dette 30 / 60 ans (Md ; % PIB 60 ans) | service de la dette 60 ans (Md/an) | gain des retraites 60 ans (Md/an ; % PIB) | actif net 60 ans (Md) | double charge < 0,1 % PIB des');
SC.forEach(function (sc) { PT.forEach(function (n) {
  var o = Q.doubleCharge({ phiMax: n, scenario: sc, annees: 90 }), r = o.resume;
  log([sc, n, f(r.picMdE) + ' (' + f(r.picPctPIB, 2) + ' %) ' + r.anneePic, f(r.pointsPrelevesPic, 1), f(r.cumul30MdE) + ' / ' + f(r.cumul60MdE),
    f(r.fonds30MdE) + ' (' + f(r.fonds30PctPIB) + ' %) / ' + f(r.fonds60MdE) + ' (' + f(r.fonds60PctPIB) + ' %)',
    f(r.dette30MdE) + ' / ' + f(r.dette60MdE) + ' (' + f(r.dette60PctPIB) + ' %)', f(r.service60MdE), f(r.gain60MdE) + ' (' + f(r.gain60PctPIB, 1) + ' %)', f(r.net60MdE), r.anneeSurcoutNegligeable].join(' | '));
}); });

log('\n== B. Annee par annee, central (annee ; points ; verse Md ; pensions fonds Md ; economie repartition Md ; double charge Md ; % PIB ; cumul Md ; fonds Md ; dette Md ; part des pensions servie par le fonds %) ==');
PT.forEach(function (n) {
  log('-- ' + n + ' point(s) --');
  var o = Q.doubleCharge({ phiMax: n, scenario: 'central', annees: 90 });
  o.lignes.forEach(function (l) { if (l.t < 60) log([l.annee, l.phi, f(l.verseFondsMdE, 1), f(l.pensionsFondsMdE, 1), f(l.economieRepartitionMdE, 1), f(l.doubleChargeMdE, 1), f(l.doubleChargePctPIB, 2), f(l.cumulMdE), f(l.fondsMdE), f(l.detteMdE), f(100 * l.partPensionsServieParFonds, 1)].join(' ; ')); });
});

log('\n== C. Salarie ne en 2000, retraite en 2065 (EUR/mois, euros 2025 avec salaires croissant a g) ==');
log('profil | points | scenario | repartition seule | mixte (deterministe) | rapport | taux de remplacement repartition | part capitalisee du capital');
['smic', 'median', 'cadre'].forEach(function (k) { var P = Q.PROFILS[k]; PT.forEach(function (n) { SC.forEach(function (sc) {
  var x = Q.pensionSalarie({ brut: P.brut, pente: P.pente, phiMax: n, scenario: sc });
  log([P.nom, n, sc, f(x.repartitionSeuleMois), f(x.mixteMois), f(x.rapport, 3), f(100 * x.tauxRemplacementRepartition) + ' %', f(100 * x.partCapitaliseeDuCapital) + ' %'].join(' | '));
}); }); });

log('\n== D. Dispersion due au risque de marche (3000 tirages, graine 12345, sigma du scenario) : EUR/mois ==');
log('profil | points | scenario | repartition seule | mixte p5 / p50 / p95 | rapport p5 / p50 / p95 | proba mixte < repartition seule');
['smic', 'median', 'cadre'].forEach(function (k) { var P = Q.PROFILS[k]; PT.forEach(function (n) { ['bas', 'central', 'haut'].forEach(function (sc) {
  var d = Q.dispersionSalarie({ brut: P.brut, pente: P.pente, phiMax: n, scenario: sc }, 3000, 12345);
  log([P.nom, n, sc, f(d.base.repartitionSeuleMois), f(d.mixteP5) + ' / ' + f(d.mixteP50) + ' / ' + f(d.mixteP95), f(d.rapportP5, 3) + ' / ' + f(d.rapportP50, 3) + ' / ' + f(d.rapportP95, 3), f(100 * d.probaMoinsQueRepartition, 1) + ' %'].join(' | '));
}); }); });

log('\n== E. Stress (median, scenario central, repartition seule = reference) ==');
var Pm = Q.PROFILS.median;
PT.forEach(function (n) { ['krach', 'japon', 'zero'].forEach(function (t) {
  var x = Q.stressSalarie({ brut: Pm.brut, pente: Pm.pente, phiMax: n }, t);
  log([n + ' pts', t, f(x.repartitionSeuleMois), f(x.mixteMois), f(x.rapport, 3)].join(' | '));
}); });

log('\n== F. Compartiment entreprises d\'interet commun (3 points, central ; sigmaC 20 %, corr 0,6 sauf mention) ==');
log('q | ecart de rendement du compartiment | rendement fonds | volatilite fonds | rapport mixte/repartition (median) deterministe / p5 / p50 | proba perdante | fonds 30 ans (Md) | dont compartiment (Md) | actif net 60 ans (Md)');
[[0, 0, 0.2, 0.6], [0.05, -0.005, 0.2, 0.6], [0.1, -0.02, 0.2, 0.6], [0.1, -0.005, 0.2, 0.6], [0.1, 0.005, 0.2, 0.6], [0.15, -0.02, 0.2, 0.6], [0.15, -0.005, 0.2, 0.6], [0.15, 0.005, 0.2, 0.6], [0.15, -0.035, 0.2, 0.6], [0.15, -0.02, 0.3, 0.9]].forEach(function (a) {
  var c = Q.compartiment({ q: a[0], dRend: a[1], sigmaC: a[2], corr: a[3] });
  var d = Q.dispersionSalarie({ brut: Pm.brut, pente: Pm.pente, phiMax: 3, q: a[0], dRend: a[1], sigmaC: a[2], corr: a[3] }, 3000, 12345);
  var o = Q.doubleCharge({ phiMax: 3, q: a[0], dRend: a[1], sigmaC: a[2], corr: a[3] });
  log([f(100 * a[0]) + ' %', f(100 * a[1], 1) + ' pt (sigmaC ' + f(100 * a[2]) + ' %, corr ' + a[3] + ')', f(100 * c.r, 2) + ' %', f(100 * c.sigma, 2) + ' %', f(d.base.rapport, 3) + ' / ' + f(d.rapportP5, 3) + ' / ' + f(d.rapportP50, 3), f(100 * d.probaMoinsQueRepartition, 1) + ' %', f(o.resume.fonds30MdE), f(a[0] * o.resume.fonds30MdE), f(o.resume.net60MdE)].join(' | '));
});

log('\n== G. Nouveau decompte : compte notionnel (median, 43 ans, rho central 0,6 %) et transfert de longevite ==');
var cn = Q.compteNotionnel(Pm.brut, 0.006, 43);
log('capital ' + f(cn.capital) + ' EUR ; pension ' + f(cn.pensionMois) + ' EUR/mois ; coefficient de conversion ' + f(100 * cn.coefficientConversion, 2) + ' % du capital par an (D = 22)');
[[19, 'duree de retraite 19 ans (moins aisés, ⚠️)'], [22, 'moyenne'], [25, '25 ans (plus aisés, ⚠️)']].forEach(function (a) { log(a[1] + ' : valeur viagere / valeur a esperance moyenne = ' + f(Q.transfertLongevite(a[0], 22, 0.006), 3)); });
