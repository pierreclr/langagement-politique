// Tests du chargement de la capitalisation (T48) dans le palier 1. Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js ../retraites/capitalisation.js capitalisation.js test_capitalisation.js
var K = this.CapitalisationSI, P1 = this.Palier1, RC = this.RetraitesCapi, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var st = P1.palier1().st;

// Base : sans capitalisation, on retrouve le palier 1 (resultats.md § 13)
var tr = P1.trajectoire(st, undefined, 'central');
proche(K.socleBase(st, 'central', 5), tr.annees[4].socle, 1e-9, 'socle de base à 5 ans = palier1.trajectoire (523 €)');
proche(K.socleBase(st, 'central', 10), tr.annees[9].socle, 1e-9, 'socle de base à 10 ans = palier1.trajectoire (546 €)');
proche(K.socleBase(st, 'bas', 10), P1.trajectoire(st, undefined, 'bas').annees[9].socle, 1e-9, 'socle de base favorable à 10 ans = 616 €');
var h = P1.horizons(st);
proche(K.soldeBase(st, 'central', 10), h.an10.central, 1e-9, 'solde de base à 10 ans = palier1.horizons (−134 Md€)');
proche(K.soldeBase(st, 'haut', 1, { holdingsDifferes: true }), h.an1.haut, 1e-9, 'solde de base année 1 (santé en montée, holdings différés) = horizons.an1');

// Cohérence avec modeles/retraites : double charge identique, scénarios appariés dans le bon sens
var d = RC.doubleCharge({ phiMax: 3, scenario: 'central', annees: 45 });
var e = K.effet(10, 'central', { phiMax: 3, st: st });
proche(e.doubleChargeMdE, d.lignes[9].doubleChargeMdE, 1e-9, 'double charge année 10 = capitalisation.js (retraites)');
ok(K.APPARIEMENT_CAPI.bas === 'haut' && K.APPARIEMENT_CAPI.haut === 'bas', 'convention inversée : favorable du système = rendement élevé');
ok(K.effet(10, 'bas', { phiMax: 3, st: st }).fondsMdE > K.effet(10, 'haut', { phiMax: 3, st: st }).fondsMdE, 'le scénario favorable accumule plus de fonds que le défavorable');

// Dette : la variation de la dette est la double charge plus les intérêts
var e1 = K.effet(1, 'central', { phiMax: 3, st: st }), e2 = K.effet(2, 'central', { phiMax: 3, st: st });
proche(e1.detteMdE, e1.doubleChargeMdE, 1e-9, 'année 1 : dette = double charge (pas d\'intérêts)');
proche(K.ligne(2, 'central', 3).impactDetteMdE, e2.doubleChargeMdE + e1.detteMdE * 0.015, 1e-9, 'année 2 : variation de la dette = double charge + 1,5 % de la dette précédente');
ok(e1.doubleChargeMdE > 14 && e1.doubleChargeMdE < 15.5, 'année 1, 1 point : double charge ≈ 14,7 Md€ (1 point = 14,665 Md€, aucune rente évitée)');

// Effet sur le solde et le socle : toujours dégradé en financement par la dette, nul en prélèvement
['bas', 'central', 'haut'].forEach(function (sc) {
  [5, 10, 20].forEach(function (a) {
    var ed = K.effet(a, sc, { phiMax: 3, st: st }), ep = K.effet(a, sc, { phiMax: 3, st: st, financement: 'prelevement' });
    ok(ed.soldeAvec < ed.soldeSans, 'dette ' + sc + ' an ' + a + ' : le solde se dégrade');
    ok(ed.socleAvec < ed.socleSans, 'dette ' + sc + ' an ' + a + ' : le socle baisse');
    ok(ep.soldeAvec === ep.soldeSans && ep.socleAvec === ep.socleSans && ep.pointsPreleves > 0, 'prélèvement ' + sc + ' an ' + a + ' : solde et socle inchangés, points de cotisation en plus');
  });
});
// Plus de points = plus de dégradation
['central'].forEach(function (sc) { [5, 10, 20].forEach(function (a) {
  var a1 = K.effet(a, sc, { phiMax: 1, st: st }), a3 = K.effet(a, sc, { phiMax: 3, st: st }), a6 = K.effet(a, sc, { phiMax: 6, st: st });
  ok(a1.perteSocle <= a3.perteSocle + 1e-9 && a3.perteSocle <= a6.perteSocle + 1e-9, 'perte de socle croissante avec les points, an ' + a);
}); });
// Valeurs de référence (resultats.md § 14), central, 3 points, dette
proche(K.effet(5, 'central', { phiMax: 3, st: st }).socleAvec, 451, 1, 'central, 3 points, an 5 : socle 523 → 451 €');
proche(K.effet(10, 'central', { phiMax: 3, st: st }).socleAvec, 432, 1, 'central, 3 points, an 10 : socle 546 → 432 €');
proche(K.effet(10, 'central', { phiMax: 3, st: st }).soldeAvec, -183, 1, 'central, 3 points, an 10 : solde → −183 Md€ (H176 à H180 ; −185 avant)');
proche(K.effet(20, 'central', { phiMax: 3, st: st }).detteMdE, 850, 3, 'central, 3 points, an 20 : dette de transition ≈ 850 Md€');
// Tableau et pureté
var tab = K.tableau({ phiMax: 3, st: st });
ok(tab.bas.length === 3 && tab.central[2].n === 20, 'tableau : 3 scénarios x années 5, 10, 20');
var avant = JSON.stringify(P1.palier1().st); K.effet(10, 'haut', { phiMax: 6 }); ok(avant === JSON.stringify(P1.palier1().st), 'fonctions pures : le palier 1 n\'est pas modifié');
log('\n' + n + ' contrôles au vert');
