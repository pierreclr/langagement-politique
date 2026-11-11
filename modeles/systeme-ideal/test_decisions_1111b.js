// Tests de la couche DECISIONS1111B (decisions_1111b.js). Charger la liste de ponts.py (LISTE_SYSTEME), decisions_1111b.js et ce fichier (jsc).
var B = this.Decisions1111B, N = this.Decisions1111, C = this.Correction0811;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var a = C.s3(), r = N.s3(), s = B.s3();
proche(s.F, a.F, 1e-9, 'leviers F gardés à la valeur d\'avant le recalibrage (CORRECTION0811)');
proche(s.a, a.a, 1e-4, 'coefficient de la fonction des revenus : retrouvé à la valeur d\'avant (0,65), non réglé à la main');
ok(r.F < s.F - 10, 'DECISIONS1111 reste inchangée et reproductible (F recalibré ' + r.F + ' < ' + s.F + ')');
proche(s.transmissions, a.transmissions, 1e-9, 'transmissions inchangées'); proche(s.pension, 9.0, 1e-6, 'courbe des pensions inchangée'); proche(s.credit, a.credit, 1e-6, 'crédit d\'IS inchangé');
proche(B.v6('central', 2038), N.v6('central', 2038), 1e-12, 'même dispositif retraites que DECISIONS1111'); proche(B.cir(2035), 1.0, 1e-12, 'entreprise d\'État : 1 Md€');
ok(s.traj.deficit[9] < a.traj.deficit[9] - 0.005 && s.traj.ratio[9] < a.traj.ratio[9] - 0.03, 'les gains vont au déficit : déficit et dette 2038 plus bas que CORRECTION0811');
ok(s.traj.ratio[9] < r.traj.ratio[9], 'dette 2038 plus basse que la version recalibrée');
for (var y = 2029; y <= 2038; y++) ok(s.traj.deficit[y - 2029] <= a.traj.deficit[y - 2029] + 1e-9, 'déficit ' + y + ' pas plus haut qu\'avant');
var t = B.sous3(s.traj); ok(t === null || (t >= 2029 && t <= 2058), 'année de passage sous 3 % : ' + t);
if (t !== null) { ok(s.traj.deficit[t - 2029] <= 0.03 + 1e-12 && (t === 2029 || s.traj.deficit[t - 2030] > 0.03), 'sous3 : première année du passage durable'); for (var k = t - 2029; k < 30; k++) ok(s.traj.deficit[k] <= 0.03 + 1e-12, 'sous 3 % durablement ' + (2029 + k)); }
ok(B.sous3({ deficit: [0.05, 0.04, 0.02, 0.04, 0.02] }) === 2033, 'sous3 sur série synthétique : ignore une rechute'); ok(B.sous3({ deficit: [0.02, 0.02] }) === 2029, 'toujours sous 3 %'); ok(B.sous3({ deficit: [0.05, 0.04] }) === null, 'jamais sous 3 %');
var p = B.prudente(); proche(p.F, a.F, 1e-9, 'macro prudente : mêmes leviers (pas de recalibrage)'); ok(p.traj.ratio[9] > s.traj.ratio[9] - 1e-9, 'prudente : dette 2038 pas plus basse que la référence');
var maxS = 0; for (var j = 2038; j < 2058; j++) maxS = Math.max(maxS, Math.abs(B.saut(s, j).md)); ok(maxS < 3, 'pas de saut du solde primaire de 2038 à 2058 : ' + maxS);
log('Tests : ' + n + ' vérifications passées.');
