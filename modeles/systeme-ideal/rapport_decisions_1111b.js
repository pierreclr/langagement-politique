// Rapport de la couche DECISIONS1111B : gains d'abord au déficit (leviers F gardés), 11/11/2026. Charger la liste de ponts.py, decisions_1111b.js et ce fichier ; sortie dans resultats_decisions_1111b.txt.
var B = this.Decisions1111B, N = this.Decisions1111, C = this.Correction0811, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 2 : n).replace('.', ','); }
function pc(x, n) { return f(100 * x, n === undefined ? 1 : n) + ' %'; }
var a = C.s3(), r = N.s3(), s = B.s3(), p = B.prudente();
log('# Décision du 11/11/2026 (couche DECISIONS1111B) : les gains d\'abord au déficit, pas aux baisses d\'impôts');
log('leviers F : ' + f(s.F) + ' (DECISIONS1111 recalibrée : ' + f(r.F) + ') ; coefficient a : ' + f(s.a, 4) + ' (' + f(r.a, 4) + ') ; fonction des revenus ' + f(s.revenus) + ' (' + f(r.revenus) + ')');
log('PO : ' + pc(s.po.pct) + ' (recalibrée ' + pc(r.po.pct) + ' ; CORRECTION0811 ' + pc(a.po.pct) + ')');
[2029, 2033, 2038, 2043, 2058].forEach(function (y) { var i = y - 2029; log('  ' + y + ' : dette ' + pc(s.traj.ratio[i]) + ' (recalibrée ' + pc(r.traj.ratio[i]) + ' ; avant 11/11 ' + pc(a.traj.ratio[i]) + ') ; déficit ' + pc(s.traj.deficit[i]) + ' (' + pc(r.traj.deficit[i]) + ' ; ' + pc(a.traj.deficit[i]) + ')'); });
log('année de passage durable sous 3 % de déficit : ' + B.sous3(s.traj) + ' (recalibrée : ' + B.sous3(r.traj) + ' ; CORRECTION0811 : ' + B.sous3(a.traj) + ')');
log('pic de dette : ' + pc(s.pic) + ' en ' + s.picAn + ' ; macro prudente : dette 2038 ' + pc(p.traj.ratio[9]) + ', déficit 2038 ' + pc(p.traj.deficit[9]) + ', passage sous 3 % : ' + B.sous3(p.traj));
log('EXPORT ' + JSON.stringify({ F: s.F, a: s.a, po: s.po.pct, sous3: B.sous3(s.traj), sous3_prudente: B.sous3(p.traj) }));
