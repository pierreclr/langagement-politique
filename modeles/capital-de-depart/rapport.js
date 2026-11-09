var Q = (typeof CD !== 'undefined') ? CD : require('./modele.js');
var log = (typeof print === 'function') ? print : console.log;
function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); } function f0(x) { return Math.round(x).toString(); } function pc(x, d) { return (x * 100).toFixed(d === undefined ? 0 : d) + ' %'; }
var p = Q.params(), B = Q.BASE;
log('== 1. Coût annuel en croisière (Md€) [favorable / central / défavorable] ; part de l\'héritage palier 1 (103,5) et points de taux plat (12,7 Md€/pt)');
['A', 'B', 'C', 'C100'].forEach(function (v) {
  var m = Q.montants(v), pm = Q.params({ p0: 0.1 });
  log(Q.VARIANTES[v].nom + ' | ' + f1(m.favorable) + ' / ' + f1(m.central) + ' / ' + f1(m.defavorable) + ' | central = ' + pc(m.central / B.recettePalier1) + ' de 103,5 ; ' + f1(m.central / B.pointTauxPlat) + ' pt de taux plat ; ' + pc(m.central / B.taxe1pc.central) + ' de la taxe à 1 % (93) | transfert moyen ' + f0(Q.transfertMoyen(v, pm)) + ' € ; bénéficiaires ' + pc(Q.partBeneficiaires(v, pm)) + ' ; taux implicite ' + pc(Q.tauxImplicite(v)));
});
log('== 2. Impôt sur les transmissions : flat dès le premier euro contre reçu à vie avec exemption E (taux 50 % au-dessus), fuite 31 / 35 / 40 %');
[0, 50000, 100000, 200000].forEach(function (e) {
  log('E = ' + e + ' | part imposable ' + pc(Q.partImposable(p, e), 1) + ' | recette ' + f1(Q.recette(p, e, 0.5, 0.31)) + ' / ' + f1(Q.recette(p, e, 0.5, 0.35)) + ' / ' + f1(Q.recette(p, e, 0.5, 0.40)) + ' Md€ | part de la cohorte qui paie ' + pc(Q.esperance(function (h) { return h > e ? 1 : 0; }, p)));
});
log('Sensibilité : échelle 1,63 (flux macro) E = 100 000 : part imposable ' + pc(Q.partImposable(Q.params({ echelle: 1.63 }), 100000), 1));
log('Taux nécessaire pour équilibrer variante B (20,8 à 25 000 €) avec E = 100 000 :');
[['A', 8.3], ['B', 20.75], ['C', Q.montants('C').central]].forEach(function (x) {
  var base = 300 * (1 - 0.35) * Q.partImposable(p, 100000);
  log('  ' + x[0] + ' (' + f1(x[1]) + ' Md€) : taux requis sur la part au-dessus de 100 000 € = ' + pc(x[1] / base, 1) + ' (fuite 35 %)');
});
log('== 3. Effet par décile de patrimoine des parents (€ par jeune sur la vie : héritage brut / impôt 50 % dès le 1er euro / capital / net) ; fuite ignorée (charge nominale)');
var R = { 'palier 1 sans capital': { exemption: 0, taux: 0.5 }, 'palier 1 + A': { exemption: 0, taux: 0.5, variante: 'A' }, 'palier 1 + B': { exemption: 0, taux: 0.5, variante: 'B' }, 'palier 1 + C': { exemption: 0, taux: 0.5, variante: 'C' }, 'reçu à vie E=100 000 + B': { exemption: 100000, taux: 0.5, variante: 'B' }, 'reçu à vie E=100 000 + C': { exemption: 100000, taux: 0.5, variante: 'C' } };
Object.keys(R).forEach(function (k) {
  var d = Q.parDecile(p, R[k]);
  log('-- ' + k + ' | part de gagnants nets (capital > impôt) ' + pc(Q.partGagnants(p, R[k])));
  log(d.map(function (x) { return 'D' + x.decile + ' ' + f0(x.heritage / 1000) + 'k/' + f0(x.impot / 1000) + 'k/' + f0(x.capital / 1000) + 'k/' + f0(x.net / 1000) + 'k'; }).join(' ; '));
});
log('== 4. Risque immobilier de B si fléché logement (hausse de prix de niveau, ordre de grandeur)');
['favorable', 'central', 'defavorable'].forEach(function (s) { var r = Q.risqueImmobilier(20.75, s); log(s + ' | demande ' + f1(r.demandeMd) + ' Md€ = ' + pc(r.partMarche, 1) + ' des ventes de 185 Md€ ; hausse de prix ' + pc(r.hausse, 1)); });
log('== 5. Cohorte');
log('bas ' + B.cohorte.bas + ' / central ' + B.cohorte.central + ' / haut ' + B.cohorte.haut);
log('== 6. Sensibilité : variante C selon p0 (part sans héritage) et échelle');
[0, 0.1, 0.2, 0.3].forEach(function (z) { log('p0=' + z + ' : C = ' + f1(Q.cout('C', Q.params({ p0: z }), 830000)) + ' Md€ ; C\' = ' + f1(Q.cout('C100', Q.params({ p0: z }), 830000))); });
log('échelle 1,63 : C = ' + f1(Q.cout('C', Q.params({ echelle: 1.63 }), 830000)) + ' Md€');
log('== 7. Paquets : coût pour le budget par rapport à « 50 % dès le premier euro » (fuite 35 %, central), Md€ par an et points de taux plat');
var r0 = Q.recette(p, 0, 0.5, 0.35);
[0, 50000, 100000, 200000].forEach(function (e) { ['A', 'B', 'C'].forEach(function (v) {
  var perte = r0 - Q.recette(p, e, 0.5, 0.35), c = Q.montants(v).central, tot = perte + c;
  log('E=' + e + ' + ' + v + ' | recette perdue ' + f1(perte) + ' + capital ' + f1(c) + ' = ' + f1(tot) + ' Md€ = ' + f1(tot / B.pointTauxPlat) + ' pt de taux plat');
}); });
log('Taux marginal cumulé maximal de C + exemption 100 000 : ' + pc(Math.max(0.5, 0.5)) + ' (dégressivité 50 % sur 0-80 000, impôt 50 % au-dessus de 100 000)');
