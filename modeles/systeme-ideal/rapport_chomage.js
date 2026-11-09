// Rétroaction de la durée du chômage (H204 à H220) : tableaux de resultats.md § 19. Reproduction (depuis ce dossier) :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js rapport_chomage.js > resultats-chomage.txt
var M = this.SystemeIdeal, O = this.Optimisation, P1 = this.Palier1, F = this.Voies.fus, D = M.DONNEES;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ','); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ','); }
function r0(x) { return Math.round(x).toString(); }
function k(x) { return r0(x / 1e3) + ' k'; }
function pc1(x) { return r1(100 * x) + ' %'; }
var NIV = ['bas', 'central', 'haut'], VAR = ['remplace', 'deg1', 'deg2', 'deg3', 'differentiel', 'cumul'];

log('# Rétroaction de la durée du chômage (option `retroactionChomage`, H204 à H220) — généré par rapport_chomage.js');
log('# bas = réactions faibles, haut = réactions fortes ; + = rapporte à l\'État ; Md€/an ; personnes = stock moyen d\'indemnisés en moins');
log('\n## A. Paramètres');
NIV.forEach(function (n) { var c = M.RETRO_CHOMAGE[n]; log(n + ' : εD ' + r2(c.epsD) + ', εE ' + r2(c.epsE) + ', λ (part de liquidité du socle) ' + r2(c.lambda) + ', éviction ' + r2(c.eviction) + ', bornes de r [' + r2(c.rPlancher) + ' ; ' + r2(1 / c.rPlancher) + ']'); });
var a = D.chomage.md * 1e9 / D.chomage.n / 12;
log('Allocation actuelle moyenne B0 = ' + r0(a) + ' €/mois ; stock ' + r2(D.chomage.n / 1e6) + ' M ; net antérieur moyen ' + r0(a / M.CHOMAGE_TAUX_NET) + ' € (H93)');

[500, 650].forEach(function (S) {
  log('\n## B. Variantes de chômage, socle ' + S + ' €/mois (structure du palier 1 : taux plat 35 %, t_max 30 %, R0 24 000 €)');
  log('variante | complément moyen €/mois | B1 = compl. + λS (central) | r brut → retenu | bas : stock net, Md€ | central : stock micro / net, compl., recettes, Md€ | haut : stock net, Md€');
  VAR.forEach(function (v) {
    var p = F(O.configR(F(P1.BASE, { socle: S, chomage: v, tPlat: 0.35 })), { scenario: 'central' });
    var x = {}; NIV.forEach(function (n) { x[n] = M.retroactionChomage(p, n); });
    var c = x.central;
    log(v + ' | ' + r0(c.complementMoyen) + ' | ' + r0(c.generositeEffective) + ' | ' + r2(c.rBrut) + ' → ' + r2(c.r) + (c.horsDomaine ? ' (borné)' : '') +
      ' | ' + k(x.bas.stockEviteNet) + ', ' + r1(x.bas.netMd) +
      ' | ' + k(c.stockEvite) + ' / ' + k(c.stockEviteNet) + ', ' + r1(c.economieComplementMd) + ' + ' + r1(c.recettesMd) + ' = ' + r1(c.netMd) +
      ' | ' + k(x.haut.stockEviteNet) + ', ' + r1(x.haut.netMd));
  });
  var p0 = F(O.configR(F(P1.BASE, { socle: S, tPlat: 0.35 })), { scenario: 'central' });
  log('Recette par emploi retrouvé (impôt du modèle sur un coût du travail de ' + r0(M.retroactionChomage(p0, 'central').coutTravailReprise) + ' €/mois) : ' + r0(M.retroactionChomage(p0, 'central').recetteParEmploi) + ' €/an');
});

log('\n## C. Palier 1 (deg2, socle 500 €, taux plat 35 %, santé, hautes pensions, plancher parents isolés)');
var st = P1.palier1({}).st;
log('solde public sans rétroaction (bas / central / haut) : ' + ['bas', 'central', 'haut'].map(function (sc) { return r1(P1.solde(st, sc)); }).join(' / '));
log('avec rétroaction alignée sur le scénario (bas → bas, …) : ' + ['bas', 'central', 'haut'].map(function (sc) { return r1(P1.solde(st, sc, { retroChomage: 'scenario' })); }).join(' / '));
NIV.forEach(function (n) { log('scénario central du modèle, rétroaction ' + n + ' : ' + r1(P1.solde(st, 'central', { retroChomage: n })) + ' (écart ' + r1(P1.solde(st, 'central', { retroChomage: n }) - P1.solde(st, 'central')) + ')'); });
var st0 = P1.stFor({});
log('taux plat nécessaire (Δ ≥ 0, central) : sans ' + pc1(P1.platNecessaire(st0)) + ' ; ' + NIV.map(function (n) { return n + ' ' + pc1(P1.platNecessaire(st0, undefined, { retroChomage: n })); }).join(' ; '));
log('socle finançable au taux de 35 % (central) : sans ' + r0(P1.socleFinancable(st)) + ' € ; ' + NIV.map(function (n) { return n + ' ' + r0(P1.socleFinancable(st, { retroChomage: n })) + ' €'; }).join(' ; '));
log('coût marginal du socle : ' + r2(P1.penteSocle(st)) + ' Md€ par €/mois');

log('\n## D. Sensibilité (palier 1, deg2, 500 €, central, un paramètre à la fois)');
var pC = F(O.configR(st), { scenario: 'central' }), base = M.RETRO_CHOMAGE.central;
[['central tel quel', {}], ['sans borne (rPlancher 0)', { rPlancher: 0 }], ['borne à −50 % (0,5)', { rPlancher: 0.5 }], ['λ = 0 (le socle n\'allonge pas la durée ; borne atteinte de toute façon)', { lambda: 0 }], ['λ = 1 (le socle compte comme une allocation)', { lambda: 1 }],
 ['sans éviction', { eviction: 0 }], ['éviction 50 %', { eviction: 0.5 }], ['sans effet sur les entrées (εE 0)', { epsE: 0 }], ['εD 0,5 (médiane internationale des niveaux, 0,53)', { epsD: 0.5 }]].forEach(function (s) {
  var x = M.retroactionChomage(pC, F(base, s[1]));
  log(s[0] + ' : r ' + r2(x.r) + ', stock net ' + k(x.stockEviteNet) + ', ' + r1(x.netMd) + ' Md€');
});

log('\n## E. Ancienne estimation hors solde (H94, `chomageR`, socle 650 €, ε 0,3 / 0,5 / 0,8, 25 k€ par personne, sans λ ni éviction) et nouvelle (bas ; central ; haut, stock net / Md€)');
['remplace', 'deg1', 'deg3'].forEach(function (v) {
  var old = [0.3, 0.5, 0.8].map(function (e) { return O.chomageR(650, e).filter(function (c) { return c.id === v; })[0]; });
  var p = F(O.configR(F(P1.BASE, { socle: 650, chomage: v, tPlat: 0.35 })), { scenario: 'central' });
  var nw = NIV.map(function (n) { return M.retroactionChomage(p, n); });
  log(v + ' : H94 ' + old.map(function (c) { return k(c.stockEviteMilliers * 1e3) + ' / +' + r1(c.gainRecettesRetroactionMd); }).join(' ; ') + ' | H204-H220 ' + nw.map(function (x) { return k(x.stockEviteNet) + ' / ' + r1(x.netMd); }).join(' ; '));
});
