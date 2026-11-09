// Croissance branchée sur le palier 1 : tableaux de resultats.md § 17.ter. Reproduction, depuis ce dossier :
//   jsc modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js croissance.js rapport_croissance.js
var C = this.Croissance, P1 = this.Palier1, DG = this.DemographieSI;
var log = (typeof print === 'function') ? print : console.log;
function r0(x) { var v = Math.round(x); return (v < 0 ? '−' : '') + Math.abs(v); }
function r1(x) { var v = Math.round(x * 10) / 10; return (v < 0 ? '−' : '') + Math.abs(v).toString().replace('.', ','); }
function r2(x) { var v = Math.round(x * 100) / 100; return (v < 0 ? '−' : '') + Math.abs(v).toString().replace('.', ','); }
function sg(x) { return (x >= 0 ? '+' : '−') + r0(Math.abs(x)); }
var st = P1.palier1().st, AN = [2035, 2045, 2065], PR = ['bas', 'central', 'haut', 'ec', 'ia_bas', 'ia', 'ia_haut'];
log('## 1. PIB (Md€ de 2025 constants) = emploi × productivité, démographie centrale');
log('| productivité | g (2035 / 2045 / 2065, effectif) | PIB 2035 | PIB 2045 | PIB 2065 | croissance moyenne 2025-2065 | pensions / PIB 2065 (prix) |');
PR.forEach(function (p) {
  var a = AN.map(function (y) { return C.pib('central', y, p); }), c = C.combinaison(st, 'central', 2065, { prod: p });
  log('| ' + p + ' | ' + AN.map(function (y) { return r2(C.gEffectif(p, y) * 100) + ' %'; }).join(' / ') + ' | ' + a.map(function (x) { return r0(x.pib); }).join(' | ') + ' | ' + r2(a[2].croissanceMoyenne * 100) + ' %/an | ' + r1(c.pensionsSurPib * 100) + ' % |');
});
log('PIB 2025 : ' + r0(C.pib('central', 2025, 'central').pib) + ' Md€ ; emploi central : indice ' + AN.map(function (y) { return r2(DG.volumes('central', y).idx.emploi); }).join(' / '));
log('');
function tab(titre, demo, pe, so, extra) {
  log('## ' + titre);
  log('| productivité | 2035 : solde | 2035 : socle | 2045 : solde | 2045 : socle | 2065 : solde | 2065 : socle |');
  PR.forEach(function (p) {
    var l = AN.map(function (y) { var cf = { prod: p, pensions: pe, socle: so }; for (var k in (extra || {})) cf[k] = extra[k]; var c = C.combinaison(st, demo, y, cf); return r0(c.soldeAvecSante) + ' | ' + r0(c.socleFinancableAvecSante); });
    log('| ' + p + ' | ' + l.join(' | ') + ' |');
  });
  log('');
}
[['prix', 'prix'], ['salaires', 'prix'], ['prix', 'salaires'], ['salaires', 'salaires']].forEach(function (c) {
  tab('2. Démographie centrale, avec santé et dépendance ; pensions sur les ' + c[0] + ', socle sur les ' + c[1] + ' (solde en Md€/an, socle finançable en €/mois)', 'central', c[0], c[1]);
});
tab('3a. Démographie basse (population jeune), pensions sur les prix, socle sur les prix', 'bas', 'prix', 'prix');
tab('3b. Démographie haute (population âgée), pensions sur les prix, socle sur les prix', 'haut', 'prix', 'prix');
tab('3c. Démographie haute (population âgée), pensions sur les salaires, socle sur les salaires', 'haut', 'salaires', 'salaires');
tab('2f. ANCIEN COMPORTEMENT (reste du budget figé en euros de 2025, publié le 01/11/2026) : démographie centrale, pensions sur les prix, socle sur les prix', 'central', 'prix', 'prix', { reste: 'fige' });
tab('2p. Reste du budget indexé sur la productivité seule (sans l\'emploi) : démographie centrale, pensions sur les prix, socle sur les prix', 'central', 'prix', 'prix', { reste: 'productivite' });
tab('2c. Pensions calées sur la pension relative du COR (54,6 % en 2025, 45,3 % en 2070), socle sur les prix : démographie centrale', 'central', 'cor', 'prix');
log('## 4. Sans santé ni dépendance (comparaison avec le § 17), central, pensions sur les prix / sur les salaires, socle sur les prix, RESTE FIGÉ (seul cas qui retrouve le § 17) : solde');
log('| productivité | 2035 | 2045 | 2065 |');
PR.forEach(function (p) {
  log('| ' + p + ' | ' + AN.map(function (y) { return r0(C.combinaison(st, 'central', y, { prod: p, pensions: 'prix', reste: 'fige' }).solde) + ' / ' + r0(C.combinaison(st, 'central', y, { prod: p, pensions: 'salaires', reste: 'fige' }).solde); }).join(' | ') + ' |');
});
log('');
log('## 5. Seuil de productivité en 2065 (central, socle sur les prix, avec santé) : plus petit g (%/an) pour lequel le critère est atteint');
log('| indexation des pensions | reste du budget | solde (2025 = −167, intérêts de 2024 figés) | solde primaire de 2025 | solde total avec intérêts (taux central) | dette/PIB 2065 ≤ 2025 (taux central) |');
function sq(x) { return x === null ? '> 5' : r2(x * 100); }
[['prix', 'fige'], ['prix', 'pib'], ['salaires', 'pib'], ['cor', 'pib']].forEach(function (c) {
  var b = { pensions: c[0], reste: c[1] }, bt = { pensions: c[0], reste: c[1], taux: 'central' };
  log('| ' + c[0] + ' | ' + c[1] + ' | ' + sq(C.seuil(st, 'central', 2065, b, 'solde')) + ' | ' + sq(C.seuil(st, 'central', 2065, b, 'primaire')) + ' | ' + sq(C.seuil(st, 'central', 2065, bt, 'solde')) + ' | ' + sq(C.seuil(st, 'central', 2065, bt, 'dette')) + ' |');
});
log('');
log('## 6. Valeur de l\'indexation en 2065 (central, productivité centrale / haute / IA) : écart de solde avec santé, pensions sur les prix moins pensions sur les salaires, socle sur les prix, reste indexé sur le PIB');
['central', 'haut', 'ia'].forEach(function (p) {
  var a = C.combinaison(st, 'central', 2065, { prod: p, pensions: 'prix' }).soldeAvecSante, b = C.combinaison(st, 'central', 2065, { prod: p, pensions: 'salaires' }).soldeAvecSante, c = C.combinaison(st, 'central', 2065, { prod: p, pensions: 'cor' }).soldeAvecSante;
  log(p + ' : ' + sg(a - b) + ' Md€/an (prix ' + r0(a) + ', salaires ' + r0(b) + ', COR ' + r0(c) + ')');
});
log('');
log('## 7. Dette et intérêts (dette de départ ' + C.DETTE.dette2025 + ' Md€ fin 2025 = ' + r1(C.DETTE.detteSurPib2025 * 100) + ' % du PIB ; PIB Insee 2025 déduit ' + r0(C.DETTE.pibInsee2025) + ' ; taux apparent 2025 ' + r2(C.DETTE.tauxApparent2025 * 100) + ' % ; maturité ' + C.DETTE.maturite + ' ans ; inflation ' + r1(C.DETTE.inflation * 100) + ' %)');
log('Taux apparent (nominal) du taux central : ' + AN.map(function (y) { return y + ' : ' + r2(C.tauxApparent('central', y) * 100) + ' %'; }).join(' ; '));
function tabDette(titre, demo, pe, tx, prods) {
  log('### ' + titre);
  log('| productivité | 2035 : solde primaire | 2035 : intérêts | 2035 : solde total | 2035 : socle | 2035 : dette/PIB | 2045 : solde total | 2045 : socle | 2045 : dette/PIB | 2065 : solde primaire | 2065 : intérêts | 2065 : solde total | 2065 : socle | 2065 : dette/PIB |');
  (prods || PR).forEach(function (p) {
    var l = AN.map(function (y) { var c = C.combinaison(st, demo, y, { prod: p, pensions: pe, taux: tx }); return c; });
    function f(c, long) { return (long ? r0(c.soldePrimaire) + ' | ' + r0(c.interets) + ' | ' : '') + r0(c.soldeTotal) + ' | ' + r0(c.socleFinancableTotal) + ' | ' + r0(c.detteSurPib * 100) + ' %'; }
    log('| ' + p + ' | ' + f(l[0], true) + ' | ' + f(l[1], false) + ' | ' + f(l[2], true) + ' |');
  });
  log('');
}
tabDette('7a. Démographie centrale, pensions sur les prix, socle sur les prix, taux de marché central (4,0 %) : solde en Md€/an avec intérêts, socle finançable en €/mois', 'central', 'prix', 'central');
tabDette('7b. Même cas, pensions calées sur le COR (pension relative 54,6 → 45,3 %)', 'central', 'cor', 'central');
tabDette('7c. Même cas, pensions sur les salaires', 'central', 'salaires', 'central', ['bas', 'central', 'haut', 'ia']);
['bas', 'haut'].forEach(function (tx) { tabDette('7d. Taux de marché ' + tx + ' (' + r1(C.TAUX[tx].r * 100) + ' %), pensions sur les prix', 'central', 'prix', tx, ['bas', 'central', 'haut', 'ia']); });
log('### 7e. Sensibilité au reste du budget et aux intérêts (central, pensions sur les prix, productivité centrale) : solde total / dette sur PIB en 2065');
['fige', 'productivite', 'pib'].forEach(function (rs) {
  log('| reste : ' + rs + ' | ' + ['bas', 'central', 'haut'].map(function (tx) { var c = C.combinaison(st, 'central', 2065, { prod: 'central', pensions: 'prix', reste: rs, taux: tx }); return tx + ' : ' + r0(c.soldeTotal) + ' / ' + r0(c.detteSurPib * 100) + ' %'; }).join(' | ') + ' |');
});
log('');
log('### 7f. Première année (2026) du central : intérêts ' + r1(C.chemin(st, 'central', { prod: 'central', taux: 'central' }, 2026)[1].interets) + ' Md€ (taux apparent ' + r2(C.chemin(st, 'central', { prod: 'central', taux: 'central' }, 2026)[1].taux * 100) + ' %) contre ' + r1(C.DETTE.interets2024) + ' (2024) et ' + r1(C.DETTE.interets2025) + ' (2025) observés');
log('');
log('### 7g. Solde en % du PIB (avec santé, démographie centrale, pensions sur les prix, reste indexé sur le PIB) : sans intérêts de la dette (intérêts de 2024 figés) / avec intérêts (taux central) ; 2025 : ' + r1(P1.solde(st, 'central') / C.pib('central', 2025, 'central').pib * 100) + ' % du PIB du modèle');
['bas', 'central', 'haut', 'ia'].forEach(function (p) {
  log('| ' + p + ' | ' + AN.map(function (y) { var c = C.combinaison(st, 'central', y, { prod: p, taux: 'central' }); return y + ' : ' + r1(c.soldeAvecSante / c.pib * 100) + ' % / ' + r1(c.soldeTotal / c.pib * 100) + ' %'; }).join(' | ') + ' |');
});
log('');
log('### 7h. Repère : dette/PIB si le solde PRIMAIRE reste, en % du PIB, à celui du palier 1 en 2025 (' + r1((P1.solde(st, 'central') + C.DETTE.interets2024) / C.pib('central', 2025, 'central').pib * 100) + ' % ; ni vieillissement ni santé), mêmes taux et mêmes PIB que 7a : 2035 / 2045 / 2065');
['bas', 'central', 'haut', 'ia'].forEach(function (p) {
  var dt = C.DETTE.dette2025, i = C.DETTE.tauxApparent2025, pb0 = (P1.solde(st, 'central') + C.DETTE.interets2024) / C.pib('central', 2025, 'central').pib, out = [], a;
  for (a = 2026; a <= 2065; a++) {
    i += (C.TAUX.central.r - i) / C.DETTE.maturite;
    var pib_ = C.pib('central', a, p).pib * C.DETTE.pibInsee2025 / 2935, def = i * dt / (1 + C.DETTE.inflation) - pb0 * C.pib('central', a, p).pib;
    dt = dt / (1 + C.DETTE.inflation) + def;
    if (a === 2035 || a === 2045 || a === 2065) out.push(r0(dt / pib_ * 100) + ' %');
  }
  log('| ' + p + ' | ' + out.join(' / ') + ' |');
});
