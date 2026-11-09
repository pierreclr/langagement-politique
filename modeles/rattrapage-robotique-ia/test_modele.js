// Test de cohérence et calculs de resultats.md. Lancer depuis modeles/rattrapage-robotique-ia/ :
//   jsc modele.js test_modele.js
//   (macOS : /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
//   ou : node test_modele.js
var M = this.RattrapageRobotiqueIA || (typeof require !== 'undefined' ? require('./modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r(x, d) { var f = Math.pow(10, d === undefined ? 1 : d); return Math.round(x * f) / f; }

// 1. Tests de cohérence
var D = M.DONNEES;
var c1 = M.coutCalcul(1, 1, 10);
ok(Math.abs(M.coutCalcul(0, 1, 10).capexTotalMdE) < 1e-12, '0 GW → coût nul');
ok(Math.abs(M.coutCalcul(2, 1, 10).capexTotalMdE - 2 * c1.capexTotalMdE) < 1e-9, 'coût du calcul proportionnel aux GW');
// 1 GW sur 5 ans : aucun renouvellement → capex = 37,9 Md$ / taux
var c5 = M.coutCalcul(1, 1, 5);
ok(Math.abs(c5.capexTotalMdE - (D.dc.capexLongueVieUsdParGw + D.dc.capexCourteVieUsdParGw) / D.usdParEur) < 1e-9, 'sur 5 ans, pas de renouvellement des serveurs');
ok(c1.capexTotalMdE > c5.capexTotalMdE, 'sur 10 ans, le renouvellement des serveurs augmente le coût');
ok(Math.abs(M.coutCalcul(1, 0.5, 10).capexPublicMdE - c1.capexTotalMdE / 2) < 1e-9, 'part publique appliquée');
var sp = M.simuler({ scenario: 'spectateur' }), ci = M.simuler({ scenario: 'cible' }), le = M.simuler({ scenario: 'leadership' });
ok(sp.publicTotalMdE < ci.publicTotalMdE && ci.publicTotalMdE < le.publicTotalMdE, 'spectateur < ciblé < leadership');
var somme = 0; for (var k in ci.postesMdE) somme += ci.postesMdE[k];
ok(Math.abs(somme - ci.publicTotalMdE) < 1e-9, 'les postes somment au total public');
var f = ci.financement;
ok(f.cashFondsCumuleMdE + f.detteFinMdE - ci.publicTotalMdE < 1e-9 && Math.abs(f.cashFondsCumuleMdE + f.detteFinMdE - ci.publicTotalMdE) < 1e-9, 'fonds + emprunt = besoin public');
var sansHeritage = M.simuler({ scenario: 'cible', parametres: { actifsProTransmisMdE: [0, 0, 0] } });
ok(Math.abs(sansHeritage.financement.detteFinMdE - ci.publicTotalMdE) < 1e-9, 'sans héritage en parts, tout est emprunté');
ok(M.simuler({ scenario: 'cible', niveau: 'haut' }).financement.detteFinMdE <= f.detteFinMdE, 'plus de parts d\'héritage → moins de dette');
ok(M.valeurPortefeuille(ci, 0) <= ci.publicTotalMdE + 1e-9, 'à rendement nul, le portefeuille ne dépasse pas la mise');

// 2. Résultats
['spectateur', 'cible', 'leadership'].forEach(function (sc) {
  var x = M.simuler({ scenario: sc });
  log('\n=== ' + sc + ' — ' + x.libelle + ' ===');
  var ps = []; for (var k in x.postesMdE) ps.push(k + ' ' + r(x.postesMdE[k]));
  log('public ' + r(x.publicTotalMdE) + ' Md€ sur ' + x.dureeAns + ' ans = ' + r(x.publicParAnMdE, 2) + ' Md€/an (' + r(x.publicParAnPctPib, 2) + ' % du PIB) [' + ps.join(', ') + ']');
  log('privé induit ' + r(x.priveInduitMdE) + ' Md€ ; total ' + r(x.totalMdE) + ' Md€ ; calcul : ' + r(x.calcul.energieTWhAn) + ' TWh/an (' + r(x.energieVsExportPct, 0) + ' % du solde exportateur 2025)');
  log('emplois directs ≈ ' + r(x.emploisDirects / 1e3) + ' k (calcul ' + r(x.emplois.calcul / 1e3, 2) + ', champions ' + r(x.emplois.champions / 1e3) + ', recherche ' + r(x.emplois.recherche / 1e3) + ', usines ' + r(x.emplois.usines / 1e3) + ') ; ingénieurs requis ≈ ' + r(x.ingenieursRequis / 1e3) + ' k ; formés en plus/an ' + r(x.ingenieursFormesSup / 1e3) + ' k');
  ['bas', 'central', 'haut'].forEach(function (niv) {
    var y = M.simuler({ scenario: sc, niveau: niv }).financement;
    log('  financement ' + niv + ' : parts d\'héritage ' + r(y.partsHeritageAnMdE) + ' Md€/an ; cash du fonds ' + r(y.cashFondsCumuleMdE) + ' Md€ (' + r(y.partCouverteParFonds * 100, 0) + ' %) ; dette ' + r(y.detteFinMdE) + ' Md€ ; intérêts cumulés ' + r(y.interetsCumulesMdE) + ' ; charge an 10 ' + r(y.chargeInteretsFinAnMdE, 2) + ' Md€ ; stock de parts ' + r(y.stockPartsFinMdE) + ' Md€');
  });
  log('  portefeuille investi (calcul + champions + usines) à 10 ans : r = −10 % → ' + r(M.valeurPortefeuille(x, -0.10)) + ' ; 0 % → ' + r(M.valeurPortefeuille(x, 0)) + ' ; +7 % → ' + r(M.valeurPortefeuille(x, 0.07)) + ' Md€');
});

log('\n--- Repères ---');
log('1 GW sur 10 ans (capex total) : ' + r(c1.capexTotalMdE) + ' Md€ ; énergie ' + r(c1.energieTWhAn, 1) + ' TWh/an ; emplois d\'exploitation ' + r(c1.emploisExploitation, 0));
log('18 GW demandés (RTE) : ' + r(18 * c1.energieTWhAn) + ' TWh/an, soit ' + r(18 * c1.energieTWhAn / D.soldeExportateurTWh * 100, 0) + ' % du solde exportateur');
var C = D.comparaisons;
log('Privé IA 2025 : USA ' + r(C.priveIaUsaMdUsd2025 / D.usdParEur) + ' Md€ ; France ' + r(C.priveIaFranceMdUsd2025 / D.usdParEur, 2) + ' Md€ ; Chine ' + r(C.priveIaChineMdUsd2025 / D.usdParEur) + ' Md€');
log('Leadership public/an vs privé USA 2025 : ' + r(le.publicParAnMdE / (C.priveIaUsaMdUsd2025 / D.usdParEur) * 100, 0) + ' %');

log('\n--- Sensibilités (ciblé, central) ---');
function sens(nom, opt) { var x = M.simuler(opt); log(nom + ' : public ' + r(x.publicTotalMdE) + ' Md€ ; dette ' + r(x.financement.detteFinMdE) + ' Md€ ; part fonds ' + r(x.financement.partCouverteParFonds * 100, 0) + ' %'); }
sens('référence', { scenario: 'cible' });
sens('usines à 20 k€/unité de capacité', { scenario: 'cible', surcharges: { capexParUniteKE: 20 } });
sens('sans cession de parts (dividendes seuls)', { scenario: 'cible', parametres: { tauxCessionAn: 0 } });
sens('cession de 10 %/an', { scenario: 'cible', parametres: { tauxCessionAn: 0.10 } });
sens('leadership, cession 10 %/an, héritage haut', { scenario: 'leadership', niveau: 'haut', parametres: { tauxCessionAn: 0.10 } });
sens('leadership sur 15 ans', { scenario: 'leadership', parametres: { dureeAns: 15 } });
