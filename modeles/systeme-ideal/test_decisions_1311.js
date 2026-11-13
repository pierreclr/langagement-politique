// Tests de la couche DECISIONS1311 (decisions_1311.js). Charger la liste de ponts.py (LISTE_SYSTEME, jusqu'à decisions_1111d.js), puis fonction_unique_1311.js, decisions_1311.js et ce fichier (jsc, depuis modeles/systeme-ideal).
var N = this.Decisions1311, D = this.Decisions1111D, U = this.FonctionUnique1311, log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var s = N.s3(), d = D.s3(), c = N.chiffrage(), y;

// 1. Paramètre de la décision et chiffrage (fonction-unique-1311.md § 7-8 : coût ≈ 1,1 Md€ à μ = 0,38 ; écart de convention ≈ 1,95 Md€)
ok(N.MU === 0.38, 'premier euro à 38 % par défaut');
proche(U.taux(0, 877, { mu: N.MU }), 0.38, 1e-12, 'taux sur le premier euro de la courbe unique : 38 % (locataire)');
proche(U.taux(0, 627, { mu: N.MU }), 0.38, 1e-12, 'taux sur le premier euro : 38 % (sans loyer)');
proche(U.seul(0, 250, { mu: N.MU }).nouveau, 877, 1e-9, 'revenu nul, locataire : 877 €'); proche(U.seul(0, 0, { mu: N.MU }).nouveau, 627, 1e-9, 'revenu nul, sans loyer : 627 €');
proche(c.decision[1], -1.07, 0.05, 'décision seule (fonction unique − règle écrite), central ≈ −1,1 Md€');
proche(c.correctionPL01[1], 1.95, 0.05, 'correction de convention de PL01, central ≈ 1,95 Md€');
ok(c.correctionPL01[0] > c.correctionPL01[1] && c.correctionPL01[1] > c.correctionPL01[2] && c.correctionPL01[2] > 0, 'correction PL01 : favorable > central > défavorable > 0');
for (var i = 0; i < 3; i++) proche(c.net[i], c.correctionPL01[i] + c.decision[i], 1e-9, 'net = correction + décision, scénario ' + i);
ok(c.net[0] > c.net[1] && c.net[1] > c.net[2], 'net : favorable > central > défavorable : ' + c.net.map(function (x) { return x.toFixed(2); }).join(' / '));
proche(c.net[1], 0.88, 0.05, 'net central ≈ +0,9 Md€ (améliore le solde)');
proche(c.coutModele[1] - c.coutRegleEcrite[1], c.correctionPL01[1], 1e-9, 'convention du bilan (877 € partout) − règle écrite = correction');
proche(N.chiffrage(0.40).decision[1], -0.74, 0.02, 'contrôle : μ = 0,40 redonne −0,74 Md€ (rapport du 13/11)');
ok(N.chiffrage(0.36).decision[1] < c.decision[1], 'μ plus bas : plus coûteux');

// 2. Lignes
var L = N.lignes(); ok(L.length === 2 && L[0].id === 'FU01' && L[1].id === 'FU02', 'lignes FU01, FU02');
ok(L.every(function (l) { return l.sens === 'dep' && l.v.length === 3; }), 'format des lignes de la couche du 08/11');
var ids = s.lignes.map(function (l) { return l.id; }); ok(ids.indexOf('PL01') >= 0 && ids.indexOf('FU01') >= 0 && ids.indexOf('FU02') >= 0, 'S3 : PL01 gardée, FU01 et FU02 ajoutées');
ok(d.lignes.map(function (l) { return l.id; }).indexOf('FU01') < 0, 'DECISIONS1111D non modifiée (pas de FU01)');

// 3. Trajectoire : rien d'autre ne bouge
proche(s.F, d.F, 1e-12, 'leviers F inchangés'); proche(s.a, d.a, 1e-12, 'coefficient a inchangé'); proche(s.po.md, d.po.md, 1e-12, 'prélèvements obligatoires inchangés (HF3)');
proche(s.ecart1311, c.net[1], 1e-12, 'écart ajouté au solde = net central');
for (y = 2029; y <= 2058; y++) proche(s.sansCouche.deficit[y - 2029], d.traj.deficit[y - 2029], 1e-12, 'sans couche = DECISIONS1111D ' + y);
var r = N.s3(undefined, { fonctionUnique: false }); for (y = 2029; y <= 2058; y++) proche(r.traj.ratio[y - 2029], d.traj.ratio[y - 2029], 1e-12, 'couche retirée = DECISIONS1111D (dette) ' + y);
for (y = 2029; y <= 2058; y++) ok(s.traj.deficit[y - 2029] < d.traj.deficit[y - 2029], 'déficit plus bas avec la couche ' + y);
var pib = this.Stress.ECO.pib0; proche((d.traj.deficit[0] - s.traj.deficit[0]) * pib, c.net[1], 0.15, 'écart de déficit 2029 ≈ net central (Md€, au PIB de départ)');
ok(s.traj.ratio[9] < d.traj.ratio[9] && d.traj.ratio[9] - s.traj.ratio[9] < 0.01, 'dette 2038 un peu plus basse (moins de 1 point)');
ok(s.trajPrudente.ratio[9] < d.trajPrudente.ratio[9], 'macro prudente : dette 2038 plus basse');
var e = N.s3(undefined, { mu: 0.40 }); ok(e.traj.ratio[29] < s.traj.ratio[29], 'μ = 0,40 : dette 2058 plus basse qu\'à 0,38');
log('Tests : ' + n + ' vérifications passées.');
