// Capitalisation progressive avec les cohortes réelles (T48) : tableaux de resultats.md § 20. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js trajectoires_demo.js demographie.js ../retraites/capitalisation.js capitalisation.js trajectoires_capi_cohortes.js capitalisation_cohortes.js rapport_capitalisation_cohortes.js > resultats-capitalisation-cohortes.txt
var CC = this.CapitalisationCohortes, K = this.CapitalisationSI, P1 = this.Palier1, TC = this.TrajectoiresCapiCohortes;
var log = (typeof print === 'function') ? print : console.log;
function r0(x) { return x === null || x === undefined ? '—' : (x < 0 ? '−' : '') + Math.round(Math.abs(x)).toString(); }
function f1(x) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(1).replace('.', ','); }
function f2(x) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(2).replace('.', ','); }
function pc(x) { return f2(100 * x) + ' %'; }
var st = P1.palier1().st, SC = ['bas', 'central', 'haut'], ANNEES = [2027, 2030, 2035, 2040, 2050, 2060, 2070];
var NOM = { bas: 'bas (population jeune)', central: 'central', haut: 'haut (population âgée)' };

log('# Capitalisation progressive : cohortes réelles, épargne et taux (resultats.md § 20)');
log('Euros constants de 2025, Md€ par an sauf mention. 3 points (φ_max = 3, +1 point tous les 3 ans), réforme en 2027, conversion en rente à 64 ans. Ordres de grandeur, jamais des prédictions.\n');

log('## 1. Démographie embarquée (prospective-demographie, Insee 2026, emploi calé sur le COR)');
log('| scénario | cotisants / retraités 2025 | 2040 | 2070 | cotisants 2027 (M) | 2070 (M) | espérance de vie à 64 ans, cohorte qui part en 2030 | 2050 | 2067 |');
log('|---|---|---|---|---|---|---|---|---|');
SC.forEach(function (sc) {
  var s = TC.scenarios[sc];
  function rp(a) { return f2(s.cotisants[a - 2025] / s.retraites[a - 2025]); }
  function e(a) { return f1(CC.facteurRenteCohorte(s, a, 64, 0).esperance); }
  log('| ' + NOM[sc] + ' | ' + rp(2025) + ' | ' + rp(2040) + ' | ' + rp(2070) + ' | ' + f1(s.cotisants[2] / 1e6) + ' | ' + f1(s.cotisants[45] / 1e6) + ' | ' + e(2030) + ' | ' + e(2050) + ' | ' + e(2067) + ' |');
});
log('Variante stylisée : masse salariale qui croît à g, 40 générations égales, rente de 22 ans à 65 ans.\n');

log('## 2. Double charge année par année, démographie centrale, rendement central (r 3,5 %, g 0,6 %, i 1,5 %), financement par la dette');
log('| année | points | versé au fonds | pensions de répartition évitées | rentes du fonds | double charge | dette de transition | dette / PIB | fonds | double charge (stylisée) | dette (stylisée) |');
log('|---|---|---|---|---|---|---|---|---|---|---|');
var dc = CC.doubleCharge({ demo: 'central' }), sty = CC.stylise({});
ANNEES.forEach(function (a) {
  var l = dc.lignes[a - 2027], m = sty.lignes[a - 2027];
  log('| ' + a + ' | ' + l.phi + ' | ' + r0(l.verseFondsMdE) + ' | ' + r0(l.economieRepartitionMdE) + ' | ' + r0(l.pensionsFondsMdE) + ' | ' + r0(l.doubleChargeMdE) + ' | ' + r0(l.detteMdE) + ' | ' + f1(l.dettePctPIB) + ' % | ' + r0(l.fondsMdE) + ' | ' + r0(m.doubleChargeMdE) + ' | ' + r0(m.detteMdE) + ' |');
});
log('');

log('## 3. Durée du double paiement (simulation prolongée jusqu\'en 2150, démographie figée après 2070)');
log('| démographie | rendement | pic (Md€) | année du pic | dette 2070 (Md€) | dette 2070 / PIB | double charge < 0,1 % du PIB dès | double charge négative dès | durée (ans depuis 2027) |');
log('|---|---|---|---|---|---|---|---|---|');
SC.forEach(function (sc) {
  [['central', 'central'], [CC.APPARIEMENT_CAPI[sc], 'apparié']].forEach(function (rs, k) {
    if (sc === 'central' && k === 1) return;
    var d = CC.doubleCharge({ demo: sc, scRet: rs[0] }), u = CC.duree({ demo: sc, scRet: rs[0] });
    log('| ' + NOM[sc] + ' | ' + rs[1] + ' (' + rs[0] + ') | ' + r0(d.resume.picMdE) + ' | ' + d.resume.anneePic + ' | ' + r0(d.resume.dette2070MdE) + ' | ' + f1(d.resume.dette2070PctPIB) + ' % | ' + u.anneeNegligeable + ' | ' + u.anneeDoubleChargeNegative + ' | ' + u.dureeAns + ' |');
  });
});
(function () {
  var s = this.RetraitesCapi.doubleCharge({ phiMax: 3, scenario: 'central', annees: 124 }), neg = null, t;
  // Tolérance : la double charge stylisée s'annule à un bruit flottant près (1e-14 Md€ en 2094 sous node, 0 sous jsc) ; « <= 0 » seul donnait 2095/68 au lieu de 2094/67.
  for (t = 1; t < 124; t++) if (s.lignes[t].doubleChargeMdE <= 1e-9) { neg = s.lignes[t].annee; break; }
  log('| stylisée | central | ' + r0(s.resume.picMdE) + ' | ' + s.resume.anneePic + ' | ' + r0(s.lignes[43].detteMdE) + ' | ' + f1(s.lignes[43].dettePctPIB) + ' % | ' + s.resume.anneeSurcoutNegligeable + ' | ' + neg + ' | ' + (neg - 2027) + ' |');
}).call(this);
log('');

[['palier1', 'base « palier 1 » (soldeBase et socleBase de capitalisation.js : création de valeur prolongée sans plafond, H119, démographie de 2025)'],
 ['demographie', 'base « démographie » (demographie.js : volumes du même scénario démographique, création de valeur comprise)']].forEach(function (b) {
  log('## 4. Effet sur le solde et le socle, ' + b[1] + ', 3 points, financement par la dette');
  log('| scénario | année | solde sans | solde avec | socle sans (€/mois) | socle avec | double charge | dette de transition | dette / PIB |');
  log('|---|---|---|---|---|---|---|---|---|');
  var tab = CC.tableau({ base: b[0], st: st });
  SC.forEach(function (sc) { tab[sc].forEach(function (e) {
    log('| ' + sc + ' | ' + e.annee + ' | ' + r0(e.soldeSans) + ' | ' + r0(e.soldeAvec) + ' | ' + r0(e.socleSans) + ' | ' + r0(e.socleAvec) + ' | ' + r0(e.doubleChargeMdE) + ' | ' + r0(e.detteMdE) + ' | ' + f1(e.dettePctPIB) + ' % |');
  }); });
  log('');
});

log('## 5. Comparaison avec les trois points actuels (resultats.md § 14 : variante stylisée, base palier 1, central, 3 points)');
log('| année (n) | socle stylisé | socle cohortes | solde stylisé | solde cohortes | dette stylisée | dette cohortes |');
log('|---|---|---|---|---|---|---|');
[5, 10, 20].forEach(function (n) {
  var a = K.effet(n, 'central', { phiMax: 3, st: st }), c = CC.effet(2026 + n, 'central', { st: st });
  log('| ' + (2026 + n) + ' (' + n + ') | ' + r0(a.socleAvec) + ' | ' + r0(c.socleAvec) + ' | ' + r0(a.soldeAvec) + ' | ' + r0(c.soldeAvec) + ' | ' + r0(a.detteMdE) + ' | ' + r0(c.detteMdE) + ' |');
});
log('');

log('## 6. Points capitalisés (démographie et rendement centraux, base démographie, dette)');
log('| φ_max | dette 2050 | dette 2070 | dette 2070 / PIB | socle 2050 (sans → avec) | socle 2070 (sans → avec) | double charge < 0,1 % du PIB dès |');
log('|---|---|---|---|---|---|---|');
[1, 3, 6].forEach(function (phi) {
  var e50 = CC.effet(2050, 'central', { phiMax: phi, base: 'demographie', st: st }), e70 = CC.effet(2070, 'central', { phiMax: phi, base: 'demographie', st: st }), u = CC.duree({ phiMax: phi });
  log('| ' + phi + ' | ' + r0(e50.detteMdE) + ' | ' + r0(e70.detteMdE) + ' | ' + f1(e70.dettePctPIB) + ' % | ' + r0(e50.socleSans) + ' → ' + r0(e50.socleAvec) + ' | ' + r0(e70.socleSans) + ' → ' + r0(e70.socleAvec) + ' | ' + u.anneeNegligeable + ' |');
});
log('');

log('## 7. Épargne nationale (variation, Md€ et % du PIB) : fonds + administrations + ménages, démographie et rendement centraux');
log('| hypothèses d\'épargne | financement | δ (déplacement) | 2030 | 2040 | 2050 | 2070 | 2070 (% PIB) | cumul 2027-2070 |');
log('|---|---|---|---|---|---|---|---|---|');
SC.forEach(function (se) { ['dette', 'prelevement'].forEach(function (fin) {
  var d = CC.doubleCharge({ demo: 'central', scEpargne: se, financement: fin }), L = function (a) { return d.lignes[a - 2027].epargne; };
  log('| ' + se + ' | ' + fin + ' | ' + f2(d.parametres.delta) + ' | ' + r0(L(2030).nationale) + ' | ' + r0(L(2040).nationale) + ' | ' + r0(L(2050).nationale) + ' | ' + r0(L(2070).nationale) + ' | ' + f2(L(2070).pctPIB) + ' % | ' + r0(d.resume.epargneCumuleeMdE) + ' |');
}); });
log('Décomposition, central, dette, 2030 : fonds ' + r0(dc.lignes[3].epargne.fonds) + ', administrations ' + r0(dc.lignes[3].epargne.publique) + ', ménages ' + r0(dc.lignes[3].epargne.menages) + ' ; 2070 : fonds ' + r0(dc.lignes[43].epargne.fonds) + ', administrations ' + r0(dc.lignes[43].epargne.publique) + ', ménages ' + r0(dc.lignes[43].epargne.menages) + '.\n');

log('## 8. Effet de la dette de transition sur le taux d\'intérêt (β pb par point de dette de transition / PIB), démographie et rendement centraux, financement par la dette');
log('| hypothèse | β (pb / point) | taux 2050 | taux 2070 | dette 2070 (Md€) | dette 2070 / PIB | surcoût sur la dette existante 2050 | 2070 | impact sur le déficit 2070 | socle 2070 (base démographie) | épargne nationale cumulée |');
log('|---|---|---|---|---|---|---|---|---|---|---|');
SC.forEach(function (se) {
  var p = { demo: 'central', scEpargne: se, effetTaux: true }, d = CC.doubleCharge(p), l50 = d.lignes[23], l70 = d.lignes[43];
  var e70 = CC.effet(2070, 'central', { scEpargne: se, effetTaux: true, base: 'demographie', st: st });
  log('| ' + se + ' | ' + f1(d.parametres.beta * 1e4) + ' | ' + pc(l50.tauxDette) + ' | ' + pc(l70.tauxDette) + ' | ' + r0(l70.detteMdE) + ' | ' + f1(l70.dettePctPIB) + ' % | ' + r0(l50.surcoutDetteExistanteMdE) + ' | ' + r0(l70.surcoutDetteExistanteMdE) + ' | ' + r0(l70.impactDeficitMdE) + ' | ' + r0(e70.socleSans) + ' → ' + r0(e70.socleAvec) + ' | ' + r0(d.resume.epargneCumuleeMdE) + ' |');
});
log('');

log('## 9. Frais de gestion (rendement net = r + 0,21 % − frais), démographie et rendement centraux');
log('| frais | rendement net | fonds 2070 | rentes du fonds 2070 | gain des retraités 2070 (rentes − répartition évitée) | dette 2070 |');
log('|---|---|---|---|---|---|');
[0.0005, 0.0021, 0.01].forEach(function (fr) {
  var d = CC.doubleCharge({ demo: 'central', frais: fr }), l = d.lignes[43];
  log('| ' + pc(fr) + ' | ' + pc(d.parametres.r) + ' | ' + r0(l.fondsMdE) + ' | ' + r0(l.pensionsFondsMdE) + ' | ' + r0(l.gainRetraitesMdE) + ' | ' + r0(l.detteMdE) + ' |');
});
log('');

log('## 10. Sensibilités (démographie et rendement centraux, dette)');
log('| variante | double charge 2040 | dette 2070 | double charge < 0,1 % du PIB dès |');
log('|---|---|---|---|');
[['référence (64 ans, profil plat)', {}], ['conversion à 63 ans', { ageDepart: 63 }], ['conversion à 65 ans', { ageDepart: 65 }], ['profil de salaire par âge (H226 ⚠️)', { profil: 'age' }]].forEach(function (v) {
  var d = CC.doubleCharge(v[1]), u = CC.duree(v[1]);
  log('| ' + v[0] + ' | ' + r0(d.lignes[13].doubleChargeMdE) + ' | ' + r0(d.resume.dette2070MdE) + ' | ' + u.anneeNegligeable + ' |');
});
