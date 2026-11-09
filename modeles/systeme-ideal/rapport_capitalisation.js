// Capitalisation progressive dans le palier 1 : tableaux de resultats.md § 14. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js ../retraites/capitalisation.js capitalisation.js rapport_capitalisation.js
var K = this.CapitalisationSI, P1 = this.Palier1;
var log = (typeof print === 'function') ? print : console.log;
function r0(x) { return Math.round(x).toString(); }
function sg(x) { return (x >= 0 ? '+' : '−') + r0(Math.abs(x)); }
var st = P1.palier1().st;
[1, 3, 6].forEach(function (phi) {
  ['dette', 'prelevement'].forEach(function (fin) {
    log('## φ_max = ' + phi + ' point(s), financement : ' + fin);
    log('| scénario | année | points | solde sans | solde avec | socle sans | socle avec | double charge | dette | points prélevés |');
    var tab = K.tableau({ phiMax: phi, financement: fin, st: st });
    ['bas', 'central', 'haut'].forEach(function (sc) {
      tab[sc].forEach(function (e) {
        log('| ' + sc + ' | ' + e.n + ' | ' + e.points + ' | ' + r0(e.soldeSans) + ' | ' + r0(e.soldeAvec) + ' | ' + r0(e.socleSans) + ' | ' + r0(e.socleAvec) + ' | ' + sg(e.doubleChargeMdE) + ' | ' + r0(e.detteMdE) + ' | ' + e.pointsPreleves.toFixed(2).replace('.', ',') + ' |');
      });
    });
    log('');
  });
});
