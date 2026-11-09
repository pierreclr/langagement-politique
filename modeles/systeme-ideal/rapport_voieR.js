// Voie R (retraités sanctuarisés) : tableaux de resultats.md § 11. Reproduction :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js rapport_voieR.js
var O = this.Optimisation, M = this.SystemeIdeal, D = M.DONNEES;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
function r0(x) { return Math.round(x).toString(); }
function pc(x) { return r0(100 * x) + ' %'; }
function pc1(x) { return r1(100 * x) + ' %'; }
var SANTE = 9.7;

log('## A. Socle neutre');
[[0, 200], [0, 0], [57.2, 200], [57.2, 0]].forEach(function (a) { var n = O.socleNeutreR({ autresRemplacees: a[0], enfant: a[1] }); log('autres ' + a[0] + ' enfant ' + a[1] + ' : remplacées ' + r1(n.prestationsRemplaceesMd) + ' Md€, enfants ' + r1(n.enfantsMd) + ', socle neutre ' + r0(n.socle) + ' €/mois'); });

var NEUTRE = O.socleNeutreR().socle;
log('\n## B. Taux plat nécessaire (solde central avec santé ≥ −169,1 : « neutre », puis ≥ 0 : équilibre), t_max, IS, holdings');
[NEUTRE, 500, 650, 800].forEach(function (S) {
  [true, false].forEach(function (h) { [0.25, 0.30].forEach(function (is) { [0.20, 0.30, 0.45].forEach(function (tm) {
    var st = { socle: S, tMax: tm, tIS: is, holdings: h };
    var n = O.platNecessaireR(st, D.deficitActuel), e = O.platNecessaireR(st, 0);
    var tn = n.t === null ? null : n.t, f = function (x) { return x === null ? 'aucun (meilleur ' + pc(0) + ')' : pc1(x); };
    var m = tn === null ? null : O.evaluerR({ socle: S, tMax: tm, tIS: is, holdings: h, tPlat: tn });
    log('S ' + r0(S) + ' | holdings ' + (h ? 'H21' : 'non') + ' | IS ' + pc(is) + ' | t_max ' + pc(tm) + ' | plat neutre ' + (tn === null ? 'aucun (meilleur solde ' + r1(n.best.v + D.deficitActuel) + ' Md€ de Δ à ' + pc(n.best.t) + ')' : pc1(tn) + ', marginal max ' + pc1(m.marginal.personnel) + ', IS+div ' + pc1(m.marginal.combineDividende) + ', Δ bas/central/haut ' + r0(m.bilan.soldeBas - D.deficitActuel) + '/' + r0(m.bilan.soldeCentral - D.deficitActuel) + '/' + r0(m.bilan.soldeHaut - D.deficitActuel)) + ' | plat équilibre ' + (e.t === null ? 'aucun (meilleur solde ' + r1(e.best.v) + ' à ' + pc(e.best.t) + ')' : pc1(e.t)));
  }); }); });
});

log('\n## C. Plus haut socle finançable');
[[0.70, false, 'équilibre'], [0.70, true, 'équilibre'], [0.70, false, 'neutre'], [0.70, true, 'neutre']].forEach(function (a) {
  [true, false].forEach(function (h) { [0.25, 0.30].forEach(function (is) {
    var r = O.socleMaxR({ holdings: h, tIS: is }, a[0], a[2], a[1]);
    log('plafond ' + pc(a[0]) + (a[1] ? ' IS+dividende' : ' personnel') + ' | ' + a[2] + ' | holdings ' + (h ? 'H21' : 'non') + ' | IS ' + pc(is) + ' → socle max ' + (r.socle === null ? 'aucun (même 0 € ne tient)' : r0(r.socle)) + (r.structure ? ' (plat ' + pc(r.structure.tPlat) + ', t_max ' + pc(r.structure.tMax) + ')' : ''));
  }); });
});

log('\n## D. Gagnants et perdants (plat neutre, t_max 30 %, IS 25 %, holdings H21), chômage remplacé');
[NEUTRE, 500, 650, 800].forEach(function (S) {
  var n = O.platNecessaireR({ socle: S, tMax: 0.30 }, D.deficitActuel), t = n.t === null ? 0.70 : n.t;
  var e = O.evaluerR({ socle: S, tMax: 0.30, tPlat: t });
  log('S ' + r0(S) + ' plat ' + pc1(t) + (n.t === null ? ' (neutre inatteignable)' : '') + ' : ' + e.cas.map(function (c) { return c.id + ' ' + r0(c.apresMois) + ' (' + (c.ecartMois >= 0 ? '+' : '') + r0(c.ecartMois) + ')'; }).join(' ; '));
  var e2 = O.evaluerR({ socle: S, tMax: 0.30, tPlat: t, complRsa: true });
  log('   avec plancher RSA 877 : ' + e2.cas.filter(function (c) { return c.id === 'parentIsole' || c.id === 'rsa'; }).map(function (c) { return c.id + ' ' + r0(c.apresMois) + ' (' + r0(c.ecartMois) + ')'; }).join(' ; ') + ' ; Δ central ' + r0(e2.bilan.soldeCentral - D.deficitActuel) + ' (contre ' + r0(e.bilan.soldeCentral - D.deficitActuel) + ')');
});

log('\n## E. Chômage (S = 650)');
O.chomageR(650).forEach(function (c) {
  log(c.id + ' : ' + c.nom + ' | coût ' + r1(c.coutMd) + ' Md€ (actuel 37,1 : économie ' + r1(c.economieVsActuelMd) + ') | revenu moyen indemnisé ' + r0(c.revenuMoyenIndemnise) + ' | rétroaction durée (ε 0,5) : ' + r0(c.stockEviteMilliers) + ' k personnes de moins, +' + r1(c.gainRecettesRetroactionMd) + ' Md€ de recettes');
  c.cas.forEach(function (x) { log('   ' + x.libelle + ' : ' + x.mois.map(function (m) { return 'mois ' + m.m + ' ' + r0(m.voieR) + ' vs ' + r0(m.actuel) + ' (' + (m.ecart >= 0 ? '+' : '') + r0(m.ecart) + ')'; }).join(' ; ')); });
});
log('\n## F. Effet du chômage sur le Δ central (S 650, plat 40 %, t_max 30 %)');
['remplace', 'deg1', 'deg3', 'differentiel', 'cumul'].forEach(function (id) { var e = O.evaluerR({ socle: 650, tMax: 0.30, tPlat: 0.40, chomage: id }); log(id + ' : Δ central ' + r1(e.bilan.soldeCentral - D.deficitActuel) + ' Md€'); });

log('\n## G. Soldes aux socles maximaux (plafond 70 % personnel, H21, IS 25 %)');
['equilibre', 'neutre'].forEach(function (c) { [false, true].forEach(function (inc) {
  var r = O.socleMaxR({}, 0.70, c, inc), e = O.evaluerR(r.structure);
  log(c + (inc ? ' IS+dividende ≤ 70 %' : ' personnel ≤ 70 %') + ' : socle ' + r0(r.socle) + ', plat ' + pc(r.structure.tPlat) + ', t_max ' + pc(r.structure.tMax) + ' | solde bas/central/haut ' + r0(e.bilan.soldeBas) + '/' + r0(e.bilan.soldeCentral) + '/' + r0(e.bilan.soldeHaut) + ' | marginal ' + pc1(e.marginal.personnel) + ', IS+div ' + pc1(e.marginal.combineDividende) + ' | ' + e.cas.map(function (x) { return x.id + ' ' + (x.ecartMois >= 0 ? '+' : '') + r0(x.ecartMois); }).join(' ; '));
}); });

log('\n## H. Chômage : plus haut socle finançable selon la variante (plafond 70 %, équilibre puis Δ ≥ 0, personnel)');
['remplace', 'deg1', 'deg3', 'differentiel', 'cumul'].forEach(function (id) {
  var a = O.socleMaxR({ chomage: id }, 0.70, 'equilibre', false), b = O.socleMaxR({ chomage: id }, 0.70, 'neutre', false);
  var n = O.platNecessaireR({ socle: 650, tMax: 0.30, chomage: id }, D.deficitActuel);
  log(id + ' : équilibre ' + (a.socle === null ? 'aucun' : r0(a.socle)) + ' | Δ ≥ 0 ' + (b.socle === null ? 'aucun' : r0(b.socle)) + ' | plat neutre à S = 650 : ' + (n.t === null ? 'aucun' : pc1(n.t)));
});

log('\n## I. Sensibilité de la rétroaction sur la durée (S = 650, deg1) : ε bas / central / haut');
[0.3, 0.5, 0.8].forEach(function (e) { O.chomageR(650, e).filter(function (c) { return c.id === 'remplace' || c.id === 'deg1' || c.id === 'deg3'; }).forEach(function (c) { log('ε ' + e + ' ' + c.id + ' : ' + r0(c.stockEviteMilliers) + ' k personnes de moins, +' + r1(c.gainRecettesRetroactionMd) + ' Md€'); }); });

log('\n## J. Périmètre large (autres prestations remplacées 57,2 Md€, enfant 200) : socle neutre et plat nécessaire S = 650 / 800');
[650, 800].forEach(function (S) { var n = O.platNecessaireR({ socle: S, tMax: 0.30, autresRemplacees: 57.2 }, D.deficitActuel); log('S ' + S + ' : plat neutre ' + (n.t === null ? 'aucun' : pc1(n.t))); });
log('socle max équilibre : ' + r0(O.socleMaxR({ autresRemplacees: 57.2 }, 0.70, 'equilibre', false).socle) + ' ; Δ ≥ 0 : ' + r0(O.socleMaxR({ autresRemplacees: 57.2 }, 0.70, 'neutre', false).socle));
