// Démographie branchée sur le palier 1 : tableaux de resultats.md § 17. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js trajectoires_demo.js demographie.js rapport_demographie.js
var DG = this.DemographieSI, P1 = this.Palier1;
var log = (typeof print === 'function') ? print : console.log;
function r0(x) { return Math.round(x).toString(); }
function r1(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
function sg(x) { return (x >= 0 ? '+' : '−') + r0(Math.abs(x)); }
var st = P1.palier1().st, ANNEES = [2035, 2045, 2065];
function tab(titre, p) {
  log('## ' + titre);
  log('| scénario | année | retraités (M) | adultes non retraités (M) | emploi (M) | emploi par retraité | solde 2025 | assiette | socle | enfants | pensions | impôt retraités + hautes pensions | solde | socle finançable (€/mois) |');
  var r = DG.resume(st, ANNEES, p);
  ['bas', 'central', 'haut'].forEach(function (sc) {
    r[sc].forEach(function (e) {
      var v = e.volumes, d = e.variations;
      log('| ' + sc + ' | ' + e.annee + ' | ' + r1(v.retraites / 1e6) + ' | ' + r1(v.adultesNonRetraites / 1e6) + ' | ' + r1(v.emploi / 1e6) + ' | ' + (Math.round(v.emploiParRetraite * 100) / 100).toString().replace('.', ',') + ' | ' + r0(e.base) + ' | ' + sg(d.assiette) + ' | ' + sg(d.socle) + ' | ' + sg(d.enfants) + ' | ' + sg(d.pensions) + ' | ' + sg(d.impotRetraites) + ' | **' + r0(e.solde) + '** | ' + r0(e.socleFinancable) + ' |');
    });
  });
  log('');
}
log('socle de départ ' + st.socle + ' €, taux plat ' + (100 * st.tPlat) + ' %');
tab('A. Statique en euros constants (g = 0, pensions indexées sur les prix), sans création de valeur', {});
tab('B. Productivité de 1 % par an sur le revenu d\'activité, pensions indexées sur les prix', { g: 0.01 });
tab('C. Productivité de 1 % par an, pensions indexées sur les salaires', { g: 0.01, pensions: 'salaires' });
tab('D. Comme A, avec la création de valeur du palier 1 (extrapolée sans plafond après 10 ans ⚠️)', { valeur: true });
