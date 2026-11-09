// Sensibilité aux élasticités comportementales du patrimoine (T56, relecture du 04/11/2026) : sources/elasticites-patrimoine-relecture.md.
// Ne modifie AUCUN paramètre par défaut : chaque valeur est remplacée le temps d'un calcul, puis rétablie. Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js dvf_patrimoine.js patrimoine_immobilier.js patrimoine_financier.js deces_realisation.js sensibilite_elasticites.js
var PI = this.PatrimoineImmobilier, PF = this.PatrimoineFinancier, DR = this.DecesRealisation;
var log = (typeof print === 'function') ? print : console.log;
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function sg(x) { return (x >= 0 ? '+' : '−') + r2(Math.abs(x)); }

/** Remplace obj[cle] par val le temps de fn(), puis rétablit. */
function avec(obj, cle, val, fn) { var old = obj[cle]; obj[cle] = val; try { return fn(); } finally { obj[cle] = old; } }
function avecPlusieurs(liste, fn) { // liste : [[obj, cle, val], ...]
  var olds = liste.map(function (x) { return x[0][x[1]]; });
  liste.forEach(function (x) { x[0][x[1]] = x[2]; });
  try { return fn(); } finally { liste.forEach(function (x, i) { x[0][x[1]] = olds[i]; }); }
}
var SC = ['bas', 'central', 'haut'];

// ---- Immobilier : solde net (Md€/an) de bilan(sc) ------------------------------------------------------------------------------------------
function soldeImm(sc) { return PI.bilan(sc).soldeNet; }
function immAll() { return SC.map(soldeImm); }
log('## Immobilier (patrimoine_immobilier.js), solde net bas / central / haut');
var baseImm = immAll();
log('| base | ' + baseImm.map(r2).join(' | ') + ' |');
log('| H252 central = x (bas 2,0 et haut 0,5 inchangés) | solde central | écart |');
[0.5, 0.7, 1.0, 1.5, 2.0].forEach(function (x) {
  var s = avec(PI.PARAM.central, 'elasticiteRealisation', x, function () { return soldeImm('central'); });
  log('| ' + r2(x) + ' | ' + r2(s) + ' | ' + sg(s - baseImm[1]) + ' |');
});
log('| H252 plage entière décalée (bas / central / haut) | bas | central | haut |');
[[2.0, 1.0, 0.5], [2.0, 1.5, 1.0], [2.5, 1.5, 0.7], [1.5, 1.0, 0.7]].forEach(function (tri) {
  var r = SC.map(function (sc, i) { return avec(PI.PARAM[sc], 'elasticiteRealisation', tri[i], function () { return soldeImm(sc); }); });
  log('| ' + tri.map(r2).join(' / ') + ' | ' + r.map(r2).join(' | ') + ' |');
});
log('| H250 semiElDmto central = x | solde central | écart |');
[0, 0.03, 0.06, 0.07, 0.10, 0.136].forEach(function (x) {
  var s = avec(PI.PARAM.central, 'semiElDmto', x, function () { return soldeImm('central'); });
  log('| ' + r2(x) + ' | ' + r2(s) + ' | ' + sg(s - baseImm[1]) + ' |');
});
log('| H250 plage bas / central / haut proposée | bas | central | haut |');
[[0.0, 0.06, 0.136], [0.0, 0.07, 0.10], [0.03, 0.07, 0.136]].forEach(function (tri) {
  var r = SC.map(function (sc, i) { return avec(PI.PARAM[sc], 'semiElDmto', tri[i], function () { return soldeImm(sc); }); });
  log('| ' + tri.map(r2).join(' / ') + ' | ' + r.map(r2).join(' | ') + ' |');
});
log('| H251 capitalisation central = x | solde central | écart |');
[0, 0.25, 0.5, 0.8, 1.0].forEach(function (x) {
  var s = avec(PI.PARAM.central, 'capitalisation', x, function () { return soldeImm('central'); });
  log('| ' + r2(x) + ' | ' + r2(s) + ' | ' + sg(s - baseImm[1]) + ' |');
});

// ---- Financier : solde net central de bilan(sc) --------------------------------------------------------------------------------------------
function soldeFin(sc, o) { return PF.bilan(sc, o).soldeNet; }
function finAll() { return SC.map(function (sc) { return soldeFin(sc); }); }
var baseFin = finAll();
log('\n## Financier (patrimoine_financier.js), solde net bas / central / haut');
log('| base | ' + baseFin.map(r2).join(' | ') + ' |');
function balayageFin(actif, cle, valeurs, etiq) {
  valeurs.forEach(function (x) {
    var s = avec(PF.PARAM.central[actif], cle, x, function () { return soldeFin('central'); });
    log('| ' + etiq + ' = ' + r2(x) + ' | ' + r2(s) + ' | ' + sg(s - baseFin[1]) + ' |');
  });
}
log('| paramètre (central) | solde central | écart |');
balayageFin('dividendes', 'eps', [0.47, 0.66, 1.0, 1.5], 'H289 dividendes ε');
balayageFin('portefeuille', 'eps', [0.5, 1.0, 1.5, 2.0], 'H293 portefeuille ε');
balayageFin('av', 'eps', [0, 0.25, 0.5, 1.0], 'H299 assurance-vie ε');
balayageFin('pea', 'eps', [0, 0.25, 0.5, 1.0], 'H302 PEA ε');
balayageFin('entreprise', 'eps', [1.0, 1.5, 2.5], 'H308 entreprise ε');
balayageFin('pro', 'eps', [0.8, 1.5, 2.5], 'H310 pro ε');
balayageFin('crypto', 'eps', [0.5, 1.0, 2.0], 'H314 crypto ε');
balayageFin('per', 'baisseVersements', [0.25, 0.48, 0.5, 0.75, 1.0], 'H306 PER baisse des versements');
log('| fuite η (tous actifs), facteur sur le central | solde central | écart |');
[0, 0.5, 1, 2].forEach(function (k) {
  var liste = [];
  ['dividendes', 'portefeuille', 'av', 'pea', 'entreprise', 'pro', 'crypto'].forEach(function (a) { liste.push([PF.PARAM.central[a], 'eta', PF.PARAM.central[a].eta * k]); });
  var s = avecPlusieurs(liste, function () { return soldeFin('central'); });
  log('| η × ' + r2(k) + ' | ' + r2(s) + ' | ' + sg(s - baseFin[1]) + ' |');
});
log('| toutes les ε du central × k | solde central | écart |');
[0.5, 1, 1.5, 2].forEach(function (k) {
  var liste = [];
  ['dividendes', 'portefeuille', 'av', 'pea', 'entreprise', 'pro', 'crypto'].forEach(function (a) { liste.push([PF.PARAM.central[a], 'eps', PF.PARAM.central[a].eps * k]); });
  var s = avecPlusieurs(liste, function () { return soldeFin('central'); });
  log('| ε × ' + r2(k) + ' | ' + r2(s) + ' | ' + sg(s - baseFin[1]) + ' |');
});
// Correction groupée proposée : ε des dividendes centrés sur Boissel et Matray (0,66), portefeuille 1,0, PER 0,48 (Chetty et al.), le reste inchangé
var grp = avecPlusieurs([[PF.PARAM.central.dividendes, 'eps', 0.66], [PF.PARAM.central.per, 'baisseVersements', 0.48]], function () { return soldeFin('central'); });
log('| groupe : dividendes ε 0,66 + PER 0,48 | ' + r2(grp) + ' | ' + sg(grp - baseFin[1]) + ' |');

// ---- Décès et donation : option (i), net (Md€/an) ------------------------------------------------------------------------------------------
log('\n## Décès et donation (deces_realisation.js), option (i) net bas / central / haut');
function netI(sc) { return DR.realisationDeces(sc).nettes; }
var baseDR = SC.map(netI);
log('| base | ' + baseDR.map(r2).join(' | ') + ' |');
log('| paramètre (central) | option (i) net central | écart |');
[0, 0.05, 0.15, 0.30, 0.50].forEach(function (x) {
  var s = avec(DR.PARAM.central.av, 'anticipation', x, function () { return netI('central'); });
  log('| H355 assurance-vie, part anticipée = ' + r2(x) + ' | ' + r2(s) + ' | ' + sg(s - baseDR[1]) + ' |');
});
[0, 0.5, 1, 2].forEach(function (k) {
  var liste = [];
  ['imm', 'titres', 'ent'].forEach(function (c) { liste.push([DR.PARAM.central[c], 'eta', DR.PARAM.central[c].eta * k]); });
  var s = avecPlusieurs(liste, function () { return netI('central'); });
  log('| H354 fuite η (immobilier, titres, entreprises) × ' + r2(k) + ' | ' + r2(s) + ' | ' + sg(s - baseDR[1]) + ' |');
});
// H369 (non intégré) : facteur sur le verrouillage pendant la vie si l'effacement au décès disparaît
log('| H369 facteur EPS_VIE (non intégré) | ' + DR.EPS_VIE.bas + ' / ' + r2(DR.EPS_VIE.central) + ' / ' + r2(DR.EPS_VIE.haut) + ' | |');
