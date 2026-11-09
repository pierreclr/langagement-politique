// Options de financement du palier 1 : tableaux de resultats.md § 29 et de options-financement-palier1.md. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js options_financement.js rapport_options_financement.js > resultats-options-financement.txt
var X = this.OptionsFinancement, P1 = this.Palier1, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r0(x) { return Math.round(x).toString().replace('-', '−'); }
function sg(x) { return (x >= 0 ? '+' : '−') + r1(Math.abs(x)); }
function pc(x) { return x === null ? 'inaccessible (≤ 80 %)' : r1(100 * x) + ' %'; }
var SCS = X.SCS;
function trip(f, fmt) { return SCS.map(function (s) { return (fmt || r1)(f(s)); }).join(' / '); }
var BASE = X.soldes({});

log('## A. Options seules : solde public total (déficit actuel de −169,1 compris, santé comprise), Md€/an, régime de croisière, bas (favorable) / central / haut (défavorable)');
log('| Option | solde bas / central / haut | Δ central vs palier 1 | érosion par réaction (central) | taux plat d\'équilibre (central, option seule) |');
log('|---|---|---|---|---|');
var A = [
  ['Palier 1 (35 %, socle 500 €, héritage à 50 %)', {}],
  ['(a1) taux plat 36 %', { tPlat: 0.36 }], ['(a2) taux plat 38 %', { tPlat: 0.38 }], ['(a3) taux plat 40 %', { tPlat: 0.40 }], ['(a4) taux plat 41,5 %', { tPlat: 0.415 }],
  ['(b1) socle −10 % (450 €)', { socleFacteur: 0.9 }], ['(b2) socle −20 % (400 €)', { socleFacteur: 0.8 }],
  ['(d1) fin du report 150-0 B ter (flux futur)', { report150: true }],
  ['(d2) décès = réalisation, prix d\'acquisition reporté (valeur à 10 ans)', { deces: 'carryover' }],
  ['(d2b) décès = réalisation avec crédit sur les droits (héritage à 50 % : le crédit absorbe tout)', { deces: 'credit' }],
  ['(d2c) décès = réalisation SANS crédit (cumul avec les droits), net de la déductibilité', { deces: 'cumul' }],
  ['(d3) PFU à 50 % (surplus sur le taux plat)', { pfu50: true }],
  ['(e1) économies prudentes (agences, SNU)', { economies: 'prudentes' }], ['(e2) économies volontaires (+ primes à l\'apprentissage)', { economies: 'volontaires' }],
  ['(e3) CIR recentré (3,4)', { cir: 'recentre' }], ['(e4) CIR supprimé (8,0)', { cir: 'supprime' }],
  ['(f1) héritage : écart de déclaration de 35 %', { heritage: 'ecart35' }], ['(f2) héritage : écart de 40 %', { heritage: 'ecart40' }],
  ['(f3) héritage : impôt de 40 %, écart de 35 %', { heritage: 'taux40ecart35' }], ['(f4) héritage : droits actuels (20,8 Md€)', { heritage: 'actuels' }]
];
A.forEach(function (a) {
  var s = X.soldes(a[1]), e = X.erosion(a[1]);
  var er = (a[1].tPlat || a[1].socleFacteur) && e.part !== null ? r0(100 * e.part) + ' %' : '—';
  log('| ' + a[0] + ' | ' + trip(function (c) { return s[c]; }) + ' | ' + sg(s.central - BASE.central) + ' | ' + er + ' | ' + (a[1].tPlat ? '—' : pc(X.platEquilibre(a[1]))) + ' |');
});

log('\n## A2. Les mêmes options, Δ par scénario (écart au palier 1, Md€/an)');
log('| Option | Δ bas | Δ central | Δ haut |');
log('|---|---|---|---|');
A.slice(1).forEach(function (a) { var s = X.soldes(a[1]); log('| ' + a[0] + ' | ' + SCS.map(function (c) { return sg(s[c] - BASE[c]); }).join(' | ') + ' |'); });

log('\n## B. Montée progressive du socle (départ 250 €, linéaire jusqu\'à 500 € ; taux plat 35 %) : année 1, moyenne sur 10 ans, régime');
log('| Montée | année 1 bas / central / haut | moyenne 10 ans bas / central / haut | régime (identique au palier 1) |');
log('|---|---|---|---|');
[5, 10].forEach(function (N) {
  var o = { rampe: { annees: N, depart: 250 } };
  log('| sur ' + N + ' ans (socle de l\'année 1 : ' + r0(X.socleAn(X.opt(o), 1)) + ' €, de l\'année 3 : ' + r0(X.socleAn(X.opt(o), 3)) + ' €) | ' + trip(function (c) { return X.solde(o, c, 1); }) + ' | ' + trip(function (c) { return X.soldeMoyen(o, c); }) + ' | ' + trip(function (c) { return X.solde(o, c); }) + ' |');
});
log('Aucune rampe ne change le régime : elle reporte le coût du socle et laisse le solde de croisière intact (dette cumulée moindre pendant la montée : moyenne 10 ans central ' + sg(X.soldeMoyen({ rampe: { annees: 10, depart: 250 } }, 'central') - BASE.central) + ' Md€/an pour 10 ans, ' + sg(X.soldeMoyen({ rampe: { annees: 5, depart: 250 } }, 'central') - BASE.central) + ' pour 5 ans).');

log('\n## C. Taux plat × socle (régime de croisière, héritage à 50 %) : solde central et solde haut, Md€/an');
var TP = [0.35, 0.36, 0.38, 0.40, 0.415], SO = [1, 0.9, 0.8];
['central', 'haut', 'bas'].forEach(function (c) {
  log('| solde ' + c + ' | socle 500 € | socle 450 € | socle 400 € |'); log('|---|---|---|---|');
  TP.forEach(function (t) { log('| taux plat ' + r1(100 * t) + ' % | ' + SO.map(function (f) { return r1(X.solde({ tPlat: t, socleFacteur: f }, c)); }).join(' | ') + ' |'); });
  log('');
});

log('## D. Empilement (central ; bas / central / haut) : ce que chaque ajout apporte, dans l\'ordre, avec les interactions\n');
var steps = [
  ['palier 1', {}],
  ['+ taux plat 41,5 %', { tPlat: 0.415 }],
  ['+ socle −20 %', { tPlat: 0.415, socleFacteur: 0.8 }],
  ['+ fin du report 150-0 B ter', { tPlat: 0.415, socleFacteur: 0.8, report150: true }],
  ['+ décès = réalisation (prix d\'acquisition reporté, 10 ans)', { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'carryover' }],
  ['+ PFU à 50 %', { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'carryover', pfu50: true }],
  ['+ économies volontaires', { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires' }],
  ['+ CIR supprimé', { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime' }],
  ['+ héritage : écart de déclaration de 35 %', { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime', heritage: 'ecart35' }],
  ['+ héritage : impôt de 40 %, écart de 35 %', { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime', heritage: 'taux40ecart35' }],
  ['(variante) mêmes ajouts avec droits de succession actuels, décès = réalisation avec crédit (borne haute)', { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'creditHaut', pfu50: true, economies: 'volontaires', cir: 'supprime', heritage: 'actuels' }]
];
log('| étape | solde bas / central / haut | Δ central de l\'étape |'); log('|---|---|---|');
var prev = null;
steps.forEach(function (s, i) { var v = X.soldes(s[1]); log('| ' + s[0] + ' | ' + trip(function (c) { return v[c]; }) + ' | ' + (i === 0 || i === steps.length - 1 ? '—' : sg(v.central - prev)) + ' |'); if (i < steps.length - 1) prev = v.central; });
log('Détail du dernier chemin avant « héritage » (central) : ' + JSON.stringify(X.detail(steps[7][1], 'central'), function (k, v) { return typeof v === 'number' ? Math.round(v * 100) / 100 : v; }));

log('\n## E. Qui gagne et perd par décile (central ; écart de revenu disponible par rapport au droit actuel, €/mois ; effets par décile de modele.js)');
var DEC = [
  ['palier 1 (35 %, 500 €)', {}], ['taux 38 %', { tPlat: 0.38 }], ['taux 40 %', { tPlat: 0.40 }], ['taux 41,5 %', { tPlat: 0.415 }], ['taux 45 %', { tPlat: 0.45 }],
  ['socle 450 € (35 %)', { socleFacteur: 0.9 }], ['socle 400 € (35 %)', { socleFacteur: 0.8 }],
  ['taux 41,5 % + socle 400 €', { tPlat: 0.415, socleFacteur: 0.8 }], ['taux 45 % + socle 400 €', { tPlat: 0.45, socleFacteur: 0.8 }],
  ['année 1 de la montée (35 %, socle 250 €)', { rampe: { annees: 10, depart: 250 } }, 1], ['année 5 de la montée sur 10 ans (35 %, socle 361 €)', { rampe: { annees: 10, depart: 250 } }, 5]
];
var IDS = X.deciles({}).parDecile.map(function (b) { return b.id; });
function entete(extra) { log('| configuration | ' + IDS.join(' | ') + (extra || '') + ' |'); log('|---|' + IDS.map(function () { return '---'; }).join('|') + (extra ? '|---|---' : '') + '|'); }
entete();
DEC.forEach(function (d) { var x = X.deciles(d[1], d[2]); log('| ' + d[0] + ' | ' + x.parDecile.map(function (b) { return r0(b.ecartMois); }).join(' | ') + ' |'); });
log('\nTaux marginal effectif implicite (central ; impôt à plat + continu, hors IS, hors plancher RSA) par décile, et limite à l\'infini');
entete(' | limite (personnel) | avec IS');
DEC.slice(0, 9).forEach(function (d) { var x = X.deciles(d[1], d[2]); log('| ' + d[0] + ' | ' + x.parDecile.map(function (b) { return r0(100 * b.tauxMarginal) + ' %'; }).join(' | ') + ' | ' + r0(100 * x.marginalMax) + ' % | ' + r0(100 * x.marginalMaxIS) + ' % |'); });
log('\nPart de gagnants par décile (central)');
entete();
DEC.slice(0, 9).forEach(function (d) { var x = X.deciles(d[1], d[2]); log('| ' + d[0] + ' | ' + x.parDecile.map(function (b) { return r0(100 * b.partGagnants) + ' %'; }).join(' | ') + ' |'); });

log('\n## F. Les chemins');
var base = { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime' };
var CH = [
  ['Chemin 1 : montée lente (taux 38 % + socle de 250 à 500 € sur 10 ans + fin du 150-0 B ter)', { tPlat: 0.38, rampe: { annees: 10, depart: 250 }, report150: true }],
  ['Chemin 2 : taux 41,5 % + socle 400 € + patrimoine (150-0 B ter, décès, PFU 50 %) + économies volontaires + CIR supprimé, héritage à 50 %', base],
  ['Chemin 3 : chemin 2 avec écart de déclaration de 35 % sur l\'héritage', F(base, { heritage: 'ecart35' })],
  ['Chemin 4 : taux 45 % + socle 400 € + patrimoine + économies volontaires + CIR supprimé, écart de 35 %', { tPlat: 0.45, socleFacteur: 0.8, heritage: 'ecart35', report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime' }],
  ['Contre-épreuve : chemin 2 sans le pari de l\'héritage (droits actuels, décès avec crédit borne haute)', F(base, { heritage: 'actuels', deces: 'creditHaut' })]
];
log('| chemin | solde croisière bas / central / haut | moyenne 10 ans central | année 10 avec création de valeur (bas / central / haut) | année 10 sans la croissance par l\'IA | taux plat d\'équilibre (bas / central / haut) |'); log('|---|---|---|---|---|---|');
CH.forEach(function (c) {
  var o = c[1];
  log('| ' + c[0] + ' | ' + trip(function (s) { return X.solde(o, s); }) + ' | ' + r1(X.soldeMoyen(o, 'central')) + ' | ' + trip(function (s) { return X.soldeAn10(o, s); }) + ' | ' + trip(function (s) { return X.soldeAn10(o, s, true); }) + ' | ' + pc(X.platEquilibre(o, 0, 'bas')) + ' / ' + pc(X.platEquilibre(o)) + ' / ' + pc(X.platEquilibre(o, 0, 'haut')) + ' |');
});
log('\nDécomposition du solde central de chaque chemin (Md€/an) : palier 1 au taux et au socle du chemin / héritage / report 150-0 B ter / décès / PFU 50 % / économies');
CH.forEach(function (c) { var d = X.detail(c[1], 'central'); log('| ' + c[0].split(' :')[0] + ' | ' + [d.base, d.transmissions, d.report150, d.deces, d.pfu50, d.economies].map(r1).join(' | ') + ' | = ' + r1(d.total) + ' (socle ' + r0(d.socle) + ' €) |'); });
log('\nSolde par année de la montée du chemin 1 (central) : ' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return n + ' : ' + r0(X.solde(CH[0][1], 'central', n)); }).join(' ; '));
log('\nSeuils de lecture : solde ≥ 0 équilibre ; ≥ −88 (3 % du PIB 2024 de 2 935 Md€) ; ≥ −169,1 déficit actuel conservé.');
CH.forEach(function (c) { log('| ' + c[0].split(' :')[0] + ' | ' + SCS.map(function (s) { var v = X.solde(c[1], s); return s + ' ' + (v >= 0 ? 'équilibre' : v >= -0.03 * 2935 ? 'sous 3 % du PIB' : v >= -169.1 ? 'mieux qu\'aujourd\'hui' : 'pire qu\'aujourd\'hui'); }).join(' ; ') + ' |'); });
