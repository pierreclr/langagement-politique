var Q = (typeof CCR !== 'undefined') ? CCR : require('./modele.js');
var log = (typeof print === 'function') ? print : console.log;
function f0(x) { return Math.round(x).toString(); } function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); } function pc(x, d) { return (x * 100).toFixed(d === undefined ? 1 : d) + ' %'; }
var SC = ['bas', 'central', 'haut'];
log('== 1. Trajectoires 10 % et 20 % des cotisations vers un fonds (montée en 10 ans dès 2027)');
[0.1, 0.2].forEach(function (s) { SC.forEach(function (sc) {
  var d = Q.doubleCharge({ smax: s, scenario: sc, annees: 170 }), r = d.resume, L = d.lignes, q = d.q;
  var y = function (a) { return L[a - 2027]; };
  var rr = Q.remplacement({ smax: s, scenario: sc }, 2060);
  log('s=' + pc(s, 0) + ' ' + sc + ' | pic ' + f1(r.picMdE) + ' Md€ (' + pc(r.picPctPIB, 2) + ' PIB) en ' + r.picAn + ' | cumul max ' + f0(r.cumulMaxMdE) + ' Md€ (' + pc(r.cumulMaxMdE / 2994, 0) + ' du PIB 2025) | D 2035/2045/2060/2075/2090 : ' + [2035, 2045, 2060, 2075, 2090].map(function (a) { return f0(y(a).D); }).join('/') + ' | 1re année D<0 : ' + r.premiereAnneeNegative + ' | fonds 2057 ' + f0(y(2057).fonds) + ' (' + pc(y(2057).fonds / y(2057).pib, 0) + ' PIB) 2087 ' + f0(y(2087).fonds) + ' (' + pc(y(2087).fonds / y(2087).pib, 0) + ') | part des pensions servie par le fonds 2060 ' + pc(y(2060).f, 1) + ', 2090 ' + pc(y(2090).f, 1));
  log('   dette si tout est emprunté à ' + pc(q.dette) + ' : 2045 ' + f0(y(2045).dette) + ' (' + pc(y(2045).dette / y(2045).pib, 0) + ' PIB), 2060 ' + f0(y(2060).dette) + ' (' + pc(y(2060).dette / y(2060).pib, 0) + '), 2087 ' + f0(y(2087).dette) + ' (' + pc(y(2087).dette / y(2087).pib, 0) + ') ; intérêts 2045 ' + f0(y(2045).interets) + ', 2060 ' + f0(y(2060).interets) + ' Md€/an ; net fonds-dette 2060 : ' + [0.015, 0.025, 0.035].map(function (i) { var z = Q.doubleCharge({ smax: s, scenario: sc, dette: i }).lignes[33]; return 'i=' + pc(i) + ' -> ' + f0(z.fonds - z.dette); }).join(', '));
  log('   cohorte 2060 : s effectif ' + pc(rr.sEff, 1) + ', rapport pension mixte/répartition ' + rr.rapport.toFixed(3) + ' -> taux de remplacement ' + pc(rr.taux, 1) + ' (répartition seule ' + pc(0.474, 1) + ')');
}); });
log('== 1b. Grille de rendement réel net r (s = 10 %, 20 % ; ρ = 0,6 %), cohorte 2060 et cohorte 2090');
[0.0083, 0.015, 0.02, 0.035, 0.0434, 0.055].forEach(function (r) { [0.1, 0.2].forEach(function (s) {
  var a = Q.remplacement({ smax: s, r: r, rho: 0.006 }, 2060), b = Q.remplacement({ smax: s, r: r, rho: 0.006 }, 2090), d = Q.doubleCharge({ smax: s, r: r, rho: 0.006 }).resume;
  log('r=' + pc(r, 2) + ' s=' + pc(s, 0) + ' | rapport 2060 ' + a.rapport.toFixed(3) + ' (taux ' + pc(a.taux, 1) + ') | rapport 2090 ' + b.rapport.toFixed(3) + ' | pic ' + f0(d.picMdE) + ' | cumul max ' + f0(d.cumulMaxMdE));
}); });
log('== 1c. Stress (central, cohorte 2090 pour s effectif plein ; 2060 entre parenthèses)');
[0.1, 0.2].forEach(function (s) { [2090, 2060].forEach(function (v) {
  var base = Q.remplacement({ smax: s }, v), k30 = Q.remplacement({ smax: s }, v, { krachPerte: 0.3 }), k40 = Q.remplacement({ smax: s }, v, { krachPerte: 0.4 }), pd = Q.remplacement({ smax: s }, v, { perdu: 20 }), z = Q.remplacement({ smax: s, r: 0 }, v);
  log('s=' + pc(s, 0) + ' v=' + v + ' | central ' + base.rapport.toFixed(3) + ' | krach -30 % la veille ' + k30.rapport.toFixed(3) + ' | -40 % ' + k40.rapport.toFixed(3) + ' | 20 dernières années à 0 % ' + pd.rapport.toFixed(3) + ' | r=0 toute la carrière ' + z.rapport.toFixed(3) + ' | sEff ' + pc(base.sEff, 1));
  var mc = Q.monteCarlo({ smax: s }, v, 4000); log('   Monte-Carlo (σ 12 %, 4000 tirages) p5/p50/p95 ' + mc.p5.toFixed(3) + ' / ' + mc.p50.toFixed(3) + ' / ' + mc.p95.toFixed(3) + ' ; P(moins bien que répartition) ' + pc(mc.probMoins, 1));
}); });
log('== 1d. Krach du fonds de -30 % en 2045 et en 2060 (s = 20 %, central)');
[null, 2045, 2060].forEach(function (an) {
  var d = Q.doubleCharge({ smax: 0.2, choc: an ? { annee: an, perte: 0.3 } : null }), L = d.lignes;
  log('choc ' + an + ' | fonds 2060 ' + f0(L[33].fonds) + ' | 2070 ' + f0(L[43].fonds) + ' | 2087 ' + f0(L[60].fonds) + ' | perte en Md€ vs sans choc 2070 : ' + f0(Q.doubleCharge({ smax: 0.2 }).lignes[43].fonds - L[43].fonds));
});
log('== 2. Dette de transition : cumul des doubles charges positives (intérêts à 1,5 %) – voir dette max ci-dessus');
log('== 3. Démographie : cotisants par retraité X (COR : 2,1 en 2002, 1,8 en 2025, 1,3 en 2070 ; X0 = 1,41 en 2060)');
[2.1, 1.8, 1.5, 1.41, 1.3, 1.1].forEach(function (X) {
  var a = Q.demographie({ smax: 0 }, X, 1.41), b = Q.demographie({ smax: 0.1 }, X, 1.41), c = Q.demographie({ smax: 0.2 }, X, 1.41);
  log('X=' + X + ' | répartition ' + pc(a.repartition, 1) + ' (cotisation pour tenir ' + pc(a.cotisationPourTenir, 1) + ') | 10 % ' + pc(b.mixte, 1) + ' | 20 % ' + pc(c.mixte, 1));
});
log('== 4. Mérite : part du fonds par dixième de niveau de vie (revenu disponible net, DINA 2023, proxy des contributions)');
var rdn = [53.19, 86.94, 110.49, 127.61, 140.93, 156.18, 174.5, 198.54, 232.42, 385.4];
[0, 0.25, 0.5, 0.75, 1].forEach(function (phi) { var m = Q.merite(rdn, phi); log('plancher ' + pc(phi, 0) + ' | ' + m.map(function (x) { return (x * 100).toFixed(1); }).join(' ') + ' | D10/D1 = ' + (m[9] / m[0]).toFixed(1)); });
log('== 4b. Générations : points au fonds (part de masse cotisée détournée × années actives) et charge nette de double charge, par tête, s = 20 %, central');
var g = Q.generations({ smax: 0.2 }, [1950, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010]);
g.forEach(function (x) { log('né ' + x.naissance + ' | années actives dans la période ' + x.anneesDansLeFonds + ' | points ' + x.pointsParTete.toFixed(3) + ' | charge nette ' + x.chargeNetteParTete.toFixed(3) + ' (unités de masse cotisée par tête-année)'); });
log('== 5. Colosse : TRI d\'un actif de calcul (capex 1, durée 6 ans, valeur résiduelle 0), selon EBITDA/capex e (année 1) et baisse annuelle des prix d\'inférence delta');
[0.18, 0.25, 0.33, 0.45].forEach(function (e) { log('e=' + pc(e, 0) + ' | ' + [0, 0.1, 0.2, 0.3].map(function (d) { return 'delta ' + pc(d, 0) + ' : ' + pc(Q.tri(e, d, 6, 0), 1); }).join(' | ') + ' | bâtiment+énergie 20 ans à e/2 : ' + pc(Q.tri(e / 2, 0, 20, 0), 1)); });
log('== 5b. Capital pour dividende (N = 68,6 M) : 100 €/mois');
[0.03, 0.04, 0.06].forEach(function (r) { log('r=' + pc(r, 0) + ' -> ' + f0(Q.capitalPourDividende(100, 68.6, r)) + ' Md€'); });
log('== 5c. Fonds de la trajectoire en % du PIB vs capital des colosses : 20 % -> fonds 2087 ; compartiment colosses 15 % du fonds 2087 :');
var d20 = Q.doubleCharge({ smax: 0.2 }).lignes[60]; log('fonds 2087 ' + f0(d20.fonds) + ' Md€ ; 15 % = ' + f0(0.15 * d20.fonds) + ' Md€ ; à 12 % de rendement : ' + f0(0.15 * d20.fonds * 0.12) + ' Md€/an ; à 2 % : ' + f0(0.15 * d20.fonds * 0.02));
