// Âge, santé et dépendance branchés sur le palier 1 : tableaux de resultats.md § 18. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js rapport_age_sante.js
var AS = this.AgeSante, DG = this.DemographieSI, P1 = this.Palier1;
var log = (typeof print === 'function') ? print : console.log;
function r0(x) { var v = Math.round(x); return (v < 0 ? '−' : '') + Math.abs(v); }
function r1(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
function r3(x) { return (Math.round(x * 1000) / 1000).toString().replace('.', ','); }
function sg(x) { return (x >= 0 ? '+' : '−') + r0(Math.abs(x)); }
var st = P1.palier1().st, ANNEES = [2035, 2045, 2065], SC = ['bas', 'central', 'haut'];
log('socle de départ ' + st.socle + ' €, santé 2025 (Sécurité sociale) ' + AS.DONNEES.csbmSecu2025 + ' Md€, dépendance 2025 ' + r1(AS.DONNEES.ltcPibPct2025 / 100 * AS.DONNEES.pib2025) + ' Md€');
log('');
log('## 1. Dépenses liées à l\'âge (Md€ de 2025 constants) : indices et variations par rapport à 2025');
log('| scénario | année | décalage du profil (ans) | indice santé | indice dépendance | santé : variation | dépendance : variation | total |');
SC.forEach(function (sc) { ANNEES.forEach(function (a) {
  var d = AS.depenses(sc, a);
  log('| ' + sc + ' | ' + a + ' | ' + r1(d.indices.delta) + ' | ' + r3(d.indices.sante) + ' | ' + r3(d.indices.dependance) + ' | ' + sg(d.varSante) + ' | ' + sg(d.varDependance) + ' | **' + sg(d.variation) + '** |');
}); });
log('');
function tab(titre, p) {
  log('## ' + titre);
  log('| scénario | année | solde sans santé/dépendance | effet santé + dépendance | solde avec | socle finançable sans (€/mois) | socle finançable avec (€/mois) |');
  var r = AS.resume(st, ANNEES, p);
  SC.forEach(function (sc) { r[sc].forEach(function (e) {
    log('| ' + sc + ' | ' + e.annee + ' | ' + r0(e.sans) + ' | ' + sg(e.effet) + ' | **' + r0(e.avec) + '** | ' + r0(e.socleSans) + ' | ' + r0(e.socleAvec) + ' |');
  }); });
  log('');
}
tab('2. Cas de base (g = 0, pensions sur les prix)', {});
tab('3. Productivité de 1 % par an, pensions sur les prix (variante B de § 17)', { g: 0.01 });
tab('4. Productivité de 1 % par an, pensions sur les salaires (variante C de § 17)', { g: 0.01, pensions: 'salaires' });
log('## 5. Hypothèse « bonne santé » : démographie centrale, part des années gagnées en bonne santé de 0 à 1');
log('| part | année | indice santé | indice dépendance | santé | dépendance | total | solde central avec | socle finançable avec |');
[0, 0.5, 1].forEach(function (pt) { ANNEES.forEach(function (a) {
  var d = AS.depenses('central', a, { part: pt }), s = AS.solde(st, 'central', a, { part: pt });
  log('| ' + pt + ' | ' + a + ' | ' + r3(d.indices.sante) + ' | ' + r3(d.indices.dependance) + ' | ' + sg(d.varSante) + ' | ' + sg(d.varDependance) + ' | ' + sg(d.variation) + ' | ' + r0(s.avec) + ' | ' + r0(AS.socleFinancable(st, 'central', a, { part: pt })) + ' |');
}); });
log('');
log('## 6. Repères : profil DREES contre Ageing Report 2024 (central, indices en euros constants, 2025 = 1)');
log('| année | santé : notre profil | santé : repère AR (démographique) | dépendance : notre profil | dépendance : repère AR (base, avec facteurs non démographiques) | effet santé : nous (Md€) | effet santé : repère AR (Md€) |');
ANNEES.forEach(function (a) {
  var d = AS.depenses('central', a), ar = AS.repereAR('central', a);
  log('| ' + a + ' | ' + r3(d.indices.sante) + ' | ' + r3(ar.sante) + ' | ' + r3(d.indices.dependance) + ' | ' + r3(ar.dependance) + ' | ' + sg(d.varSante) + ' | ' + sg(AS.DONNEES.csbmSecu2025 * (ar.sante - 1)) + ' |');
});
log('');
log('## 7. Périmètre de la dépendance : niveau 2025 de 29,5 Md€ (CNSA, personnes âgées, 2023) au lieu de 1,9 % du PIB (central)');
log('| année | variation dépendance (AR, 55,8 Md€) | variation dépendance (CNSA personnes âgées, 29,5 Md€) |');
ANNEES.forEach(function (a) { log('| ' + a + ' | ' + sg(AS.depenses('central', a).varDependance) + ' | ' + sg(AS.depenses('central', a, { baseDependance: 29.5 }).varDependance) + ' |'); });
log('');
log('## 8. Profil de santé (DREES 2023, remboursement AMO par personne) et âge moyen des classes en 2025');
AS.noeudsSante().forEach(function (n) { log('- âge moyen ' + r1(n[0]) + ' ans : ' + r0(n[1]) + ' €'); });
log('');
log('## 9. Écart avec l\'Ageing Report 2024 : étapes (central, santé hors dépendance, Md€ de 2025 constants)');
log('aplatissement lambda calé sur la Commission : ' + r3(AS.lambdaCommission()));
log('| année | profil DREES (Insee) | variante Commission (profil aplati, Insee) | Commission, ratio × population Insee | Commission, ratio × population Eurostat | effet de structure par tête : nous | effet de structure par tête : Commission | population 2025 = 1 : Insee | Eurostat |');
ANNEES.forEach(function (a) {
  var d = AS.depenses('central', a), c = AS.depensesCommission('central', a), ar = AS.repereAR('central', a), b = AS.DONNEES.csbmSecu2025;
  log('| ' + a + ' | ' + sg(d.varSante) + ' | ' + sg(c.varSante) + ' | ' + sg(b * (ar.sante - 1)) + ' | ' + sg(b * (ar.santeEurostat - 1)) + ' | ' + sg((d.indices.sante / ar.indicePopulation - 1) * 100) + ' % | ' + sg((ar.parTete - 1) * 100) + ' % | ' + r3(ar.indicePopulation) + ' | ' + r3(ar.indicePopulationEurostat) + ' |');
});
log('');
log('## 10. Variante Commission : dépenses de santé et de dépendance, solde et socle finançable (cas de base)');
log('| scénario | année | santé (DREES) | santé (Commission) | total (DREES) | total (Commission) | solde avec (DREES) | solde avec (Commission) | socle (DREES) | socle (Commission) |');
SC.forEach(function (sc) { ANNEES.forEach(function (a) {
  var d = AS.depenses(sc, a), c = AS.depensesCommission(sc, a), lam = AS.lambdaCommission();
  log('| ' + sc + ' | ' + a + ' | ' + sg(d.varSante) + ' | ' + sg(c.varSante) + ' | ' + sg(d.variation) + ' | ' + sg(c.variation) + ' | ' + r0(AS.solde(st, sc, a).avec) + ' | ' + r0(AS.solde(st, sc, a, { lambda: lam }).avec) + ' | ' + r0(AS.socleFinancable(st, sc, a)) + ' | ' + r0(AS.socleFinancable(st, sc, a, { lambda: lam })) + ' |');
}); });
