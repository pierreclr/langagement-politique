// Génère les tableaux de resultats.md :  jsc modele.js fiscalite_actuelle.js rapport.js
var M = this.SystemeIdeal || require('./modele.js');
var log = (typeof print === 'function') ? print : console.log;
function r(x, d) { d = d === undefined ? 0 : d; var f = Math.pow(10, d); return (Math.round(x * f) / f).toString().replace('.', ','); }
function pc(x, d) { return r(100 * x, d === undefined ? 0 : d) + ' %'; }
function fus(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
var C2 = { archi: 'c2', tPlat: 0.40, tMax: 0.50 }, C1 = { archi: 'c1', tMax: 0.90 };

log('## T1. Variantes une à une, par rapport au simulateur (Δ solde en Md€/an, statique | central avec rétroactions)');
var base = { socle: 1000, archi: 'plat', tPlat: 0.5 };
var V = [
  ['Référence : simulateur (socle 1 000 €, plat 50 %)', {}],
  ['(a) socle 800 €', { socle: 800 }],
  ['(b) prime forfait 200 € dès 15 h', { prime: 'forfait' }],
  ['(b) prime progressive (13,3 €/h, plafond 200 €)', { prime: 'progressive' }],
  ['(c1) impôt continu seul, t_max 90 %', C1],
  ['(c2) 40 % plat + continu 50 %', C2],
  ['(d) transparence des holdings', { holdings: true }],
  ['(e) CIR remplacé par 4 Md€ de financement direct', { cir: true }],
  ['(f) retraites : cumul du socle (aucune économie)', { retraites: 'cumul' }],
  ['(f) retraites : sous-indexation de 1 pt/an (10 ans)', { sousIndexation: 0.01 }],
  ['(g) transition de l\'industrie de la complexité', { transition: true }],
  ['(h) retraite à 60 ans + activité exonérée jusqu\'à 70 ans', { retraite60: true }],
  ['(h) idem, activité taxée à demi-taux (exo 50 %)', { retraite60: true, exoSeniors: 0.5 }],
  ['(h) idem, surcote de 5 %/an au lieu d\'exonération', { retraite60: true, exoSeniors: 0, surcote: 0.05 }],
  ['(i) heures au-delà de 35 h exonérées', { hsExo: 1 }],
  ['(i) heures sup. à demi-taux', { hsExo: 0.5 }],
  ['(j) pensions + capital des retraités imposés ensemble', { imposerComplements: true }]
];
log('| Variante | Statique | Bas | Central | Haut |'); log('|---|---|---|---|---|');
var d0 = {};
V.forEach(function (v, i) {
  var p = fus(base, v[1]), st = M.solde(fus(p, { reactions: false })).delta;
  var b = M.solde(fus(p, { scenario: 'bas' })).delta, c = M.solde(fus(p, { scenario: 'central' })).delta, h = M.solde(fus(p, { scenario: 'haut' })).delta;
  if (i === 0) d0 = { st: st, c: c };
  log('| ' + v[0] + ' | ' + r(st, 1) + (i ? ' (' + (st - d0.st >= 0 ? '+' : '') + r(st - d0.st, 1) + ')' : '') + ' | ' + r(b, 1) + ' | ' + r(c, 1) + (i ? ' (' + (c - d0.c >= 0 ? '+' : '') + r(c - d0.c, 1) + ')' : '') + ' | ' + r(h, 1) + ' |');
});

log('\n## T2. Combinaisons : Δ solde (Md€/an) par scénario, solde public total, taux marginal max, dispositifs supprimés');
log('| # | Combinaison | Statique | Bas | Central | Haut | Solde public central (déficit actuel −169,1 inclus) | Taux marg. max | Dispositifs supprimés (net) |'); log('|---|---|---|---|---|---|---|---|---|');
M.COMBINAISONS.forEach(function (c) {
  var st = M.solde(fus(c.p, { reactions: false })).delta, o = {};
  ['bas', 'central', 'haut'].forEach(function (s) { o[s] = M.solde(fus(c.p, { scenario: s })); });
  log('| ' + c.id + ' | ' + c.nom + ' | ' + r(st) + ' | ' + r(o.bas.delta) + ' | ' + r(o.central.delta) + ' | ' + r(o.haut.delta) + ' | ' + r(o.central.soldePublic) + ' | ' + pc(o.central.margMax) + ' | ' + o.central.nDispositifsSupprimes + ' |');
});

log('\n## T3. Taux d\'équilibre par combinaison (solde public = 0 sur le Δ du système ; « aucun » = pas de solution sous le plafond)');
log('| # | Statique | Central | Haut |'); log('|---|---|---|---|');
function eqTxt(p, quoi, cap, sceneario, stat) {
  var q = fus(p, { scenario: sceneario || 'central' }); if (stat) q.reactions = false;
  var e = M.equilibre(q, quoi, cap);
  return e.existe ? pc(e.x, 1) : 'aucun (sommet ' + pc(e.xMaxRecette, 0) + ' : Δ = ' + r(e.deltaMax) + ' Md€)';
}
M.COMBINAISONS.forEach(function (c) {
  var p = c.p, quoi, cap, lab;
  if (p.archi === 'plat') { quoi = 'tPlat'; cap = 0.95; lab = 't plat'; }
  else if (p.archi === 'c1') { quoi = 'tMax'; cap = 0.95; lab = 't_max'; }
  else { quoi = 'tMax'; cap = 0.55; lab = 't_max (plat 40 %)'; }
  log('| ' + c.id + ' (' + lab + ') | ' + eqTxt(p, quoi, cap, 'central', true) + ' | ' + eqTxt(p, quoi, cap, 'central') + ' | ' + eqTxt(p, quoi, cap, 'haut') + ' |');
});
log('\nVariante c2 : taux PLAT d\'équilibre pour t_max = 45 % (plafond : plat + 45 % < 95 % → plat ≤ 50 %)');
log('| # | Statique | Central |'); log('|---|---|---|');
M.COMBINAISONS.forEach(function (c) {
  if (c.p.archi !== 'c2') return;
  var p = fus(c.p, { tMax: 0.45 });
  log('| ' + c.id + ' | ' + eqTxt(p, 'tPlat', 0.50, 'central', true) + ' | ' + eqTxt(p, 'tPlat', 0.50, 'central') + ' |');
});

log('\n## T4. Marge d\'investissement dégagée (scénario central ; taux de référence : c2 40 % + 50 %, c1 90 %, plat 50 %)');
log('| # | Δ solde du système vs loi actuelle | Solde public total (−169,1 + Δ) | Marge d\'investissement après déficit actuel | Δ aux taux optimaux (c2, grille ≤ 95 %) | Solde public total aux taux optimaux | Taux marg. max < 100 % | Personne sous le socle | Dispositifs supprimés | Effets humains signalés |'); log('|---|---|---|---|---|---|---|---|---|---|');
var hum = {
  K0: 'retraités sous 1 000 € perdent ASPA ; 0,9 M d\'arrêts d\'emploi (T4)', K1: 'seuil de 15 h, contrats regroupés', K2: 'prime progressive : coût de contrôle des heures',
  K3: 'impôt sur revenus non perçus (holdings) : trésorerie', K4: 'reconversion de ≈ 147 000 personnes', K5: 'taux de 90 % dès les hauts revenus : exil, holdings', K6: 'cohortes à 60 ans, pénibilité, niche salaires',
  K7: 'fausses heures sup., inégalité temps partiel', K8: 'retraités aisés contributeurs ; droits acquis', K9: 'pouvoir d\'achat des retraités (−1 pt/an)'
};
M.tableauMarge('central').forEach(function (t) {
  var ot2 = M.optimiserTaux(t.parametres);
  log('| ' + t.id + ' | ' + r(t.delta) + ' | ' + r(t.soldePublic) + ' | ' + r(t.marge) + ' | ' + r(ot2.delta) + ' (plat ' + r(ot2.tPlat * 100) + ' + ' + r(ot2.tMax * 100) + ') | ' + r(ot2.soldePublic) + ' | ' + pc(t.margMax) + ' (oui) | oui (socle universel) | ' + t.nDispositifs + ' | ' + hum[t.id] + ' |');
});
['central', 'haut'].forEach(function (s) {
  [true, false].forEach(function (a) {
    var m = M.meilleureCombinaison(a, s), p = m.meilleure.p;
    log('\nMeilleure combinaison (' + s + ', ' + (a ? 'âge de la retraite libre' : 'sans toucher à l\'âge') + ', ' + m.nCombinaisons + ' testées) : Δ ' + r(m.meilleure.delta, 1) + ' Md€, solde public ' + r(m.meilleure.soldePublic, 1) + ' Md€ ; socle ' + p.socle + ', prime ' + p.prime + ', archi ' + p.archi + (p.archi === 'c2' ? ' 40+50' : ' t_max 90') + ', holdings ' + p.holdings + ', CIR→enveloppe ' + p.cir + ', HS exo ' + p.hsExo + ', retraités imposés ' + p.imposerComplements + ', sous-indexation ' + p.sousIndexation + ', retraite60 ' + p.retraite60);
  });
});

var mm = M.meilleureCombinaison(false, 'central').meilleure.p, ot = M.optimiserTaux(mm);
log('\nMeilleure combinaison, taux optimisés (grille, marginal ≤ 95 %) : plat ' + ot.tPlat + ' + t_max ' + ot.tMax + ' → Δ ' + r(ot.delta, 1) + ' ; solde public ' + r(ot.soldePublic, 1));
var mmh = M.meilleureCombinaison(false, 'haut').meilleure.p, oth = M.optimiserTaux(mmh);
log('Idem scénario haut : plat ' + oth.tPlat + ' + t_max ' + oth.tMax + ' → Δ ' + r(oth.delta, 1));
var mmb = M.meilleureCombinaison(false, 'bas').meilleure, otb = M.optimiserTaux(mmb.p);
log('Idem scénario bas : combinaison Δ ' + r(mmb.delta, 1) + ' ; taux optimisés plat ' + otb.tPlat + ' + t_max ' + otb.tMax + ' → Δ ' + r(otb.delta, 1) + ' ; solde public ' + r(otb.soldePublic, 1));
var st = M.optimiserTaux(M.param({ socle: mm.socle, prime: mm.prime, holdings: mm.holdings, cir: mm.cir, hsExo: mm.hsExo, imposerComplements: mm.imposerComplements, sousIndexation: mm.sousIndexation, transition: true, reactions: false }));
log('Idem en statique : plat ' + st.tPlat + ' + t_max ' + st.tMax + ' → Δ ' + r(st.delta, 1));
log('\n## T5. Détail des postes, combinaison K4 (central)');
var k4 = M.solde(fus(M.COMBINAISONS[4].p, {}));
log(JSON.stringify({ rec: k4.recettes, post: { socle: k4.postes.socleAdultes, enf: k4.postes.enfants, eco: k4.postes.economieRetraites, prime: k4.postes.prime, rd: k4.postes.enveloppeRD, hold: k4.postes.holdingsImputes, tr: k4.postes.transition } }));
var k6 = M.solde(fus(M.COMBINAISONS[6].p, {})).postes.retraite60; log('K6 retraite60 : ' + JSON.stringify(k6));
var k7 = M.solde(fus(M.COMBINAISONS[7].p, {})).postes.heuresSup; log('K7 heures sup : ' + JSON.stringify(k7));

log('\n## T6. Par décile (K4, € par mois et par actif ; avant = loi actuelle approchée)');
log('| Bande | Avant | Après | Écart | Part de gagnants | Taux moyen | Taux marginal |'); log('|---|---|---|---|---|---|---|');
M.effetsParDecile(M.COMBINAISONS[4].p).forEach(function (d) {
  log('| ' + d.id + ' | ' + r(d.avantMois) + ' | ' + r(d.apresMois) + ' | ' + r(d.ecartMois) + ' | ' + pc(d.partGagnants) + ' | ' + pc(d.tauxMoyen) + ' | ' + pc(d.tauxMarginal) + ' |');
});
log('\n## T7. Cas types (€ par mois) : K0 simulateur | K4 | K8 (retraités imposés) | K6 (retraite 60) / K7 (heures)');
var cas = [['K0', M.COMBINAISONS[0].p], ['K4', M.COMBINAISONS[4].p], ['K8', M.COMBINAISONS[8].p]];
log('| Cas | Avant (loi actuelle) | K0 | K4 | K8 | Taux marg. heure K4 | Alertes (K4) |'); log('|---|---|---|---|---|---|---|');
M.CAS.forEach(function (c, i) {
  var x = cas.map(function (k) { return M.situation(c, k[1]); });
  log('| ' + c.libelle + ' | ' + r(x[0].avantMois) + ' | ' + r(x[0].apresMois) + ' | ' + r(x[1].apresMois) + ' | ' + r(x[2].apresMois) + ' | ' + pc(x[1].tauxMarginalHeure) + ' | ' + x[1].alertes.join(' ; ') + ' |');
});
var d1 = M.situation(M.CAS[5], M.COMBINAISONS[4].p);
log('Dirigeant (K4) revenu économique avant ' + r(d1.avantEcoMois) + ' → après ' + r(d1.apresEcoMois) + ' ; impôt/an ' + r(d1.impotAn) + ' ; taux moyen ' + pc(d1.tauxMoyen, 1));
var h60 = M.situation(M.CAS[6], fus(M.COMBINAISONS[6].p, {})), h60n = M.situation(M.CAS[6], M.COMBINAISONS[4].p);
log('Retraité 62 ans mi-temps : K6 (exonéré) ' + r(h60.apresMois) + ' vs K4 ' + r(h60n.apresMois));
var s39 = M.situation(M.CAS[7], M.COMBINAISONS[7].p), s39n = M.situation(M.CAS[7], M.COMBINAISONS[4].p);
log('Salarié 39 h : K7 (HS exo) ' + r(s39.apresMois) + ' vs K4 ' + r(s39n.apresMois) + ' ; taux marginal heure ' + pc(s39.tauxMarginalHeure) + ' vs ' + pc(s39n.tauxMarginalHeure));
var s15f = M.situation(M.CAS[0], fus(M.COMBINAISONS[4].p, { prime: 'forfait' }));
log('Smicard 15 h avec forfait : ' + r(s15f.apresMois) + ' ; alertes ' + s15f.alertes.join(' ; '));

log('\n## T8. Retraités par décile de pension (K4 sans / avec imposition des compléments), Md€/an');
[['K4', M.COMBINAISONS[4].p], ['K8', M.COMBINAISONS[8].p]].forEach(function (k) {
  var rt = M.retraites(k[1]);
  log(k[0] + ' : avant (CSG+IR+PFU) ' + r(rt.avantMd, 1) + ' ; après ' + r(rt.apresMd, 1) + ' ; D10 avant ' + r(rt.topAvantMd, 1) + ' ; après ' + r(rt.topApresMd, 1) + ' ; pension D10 ' + r(rt.deciles[9].pensionBrute) + ' €/mois, capital D10 ' + r(rt.deciles[9].capital) + ' €/an, R ' + r(rt.deciles[9].R));
});
log('\n## T9. Rétroactions détaillées K0 par scénario');
['bas', 'central', 'haut'].forEach(function (s) {
  var a = M.solde(fus(M.COMBINAISONS[0].p, { scenario: s })), b = M.solde(fus(M.COMBINAISONS[0].p, { reactions: false }));
  log(s + ' : recettes courants ' + r(a.recettes.courants) + ' (statique ' + r(b.recettes.courants) + '), transmissions ' + r(a.recettes.transmissions) + ' (statique ' + r(b.recettes.transmissions) + ')');
});
log('\n## T10. Volumes : coût prime forfait ' + r(M.coutPrime({ prime: 'forfait', actifs15h: 29e6, primeMontant: 200, primeSeuilH: 15, salariesMoins15h: 0, heuresMoyMoins15h: 8 }), 1) + ' ; progressive ' + r(M.coutPrime(M.param({ prime: 'progressive' })), 1));
log('Retraite 60 central : ' + JSON.stringify(M.coutRetraite60(M.param({ retraite60: true }))));
['bas', 'central', 'haut'].forEach(function (s) { log('Retraite60 ' + s + ' total ' + r(M.coutRetraite60(M.param({ retraite60: true, scenario: s })).total, 1) + ' ; HS ' + r(M.coutHS(M.param({ hsExo: 1, scenario: s })).cout + M.coutHS(M.param({ hsExo: 1, scenario: s })).niche, 1)); });
