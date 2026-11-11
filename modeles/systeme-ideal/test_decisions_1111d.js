// Tests de la couche DECISIONS1111D (decisions_1111d.js). Charger la liste de ponts.py (jusqu'à decisions_1111b.js), patrimoine_balayage_1111c.js, decisions_1111c.js, decisions_1111d.js puis ce fichier (jsc, depuis modeles/systeme-ideal).
var D = this.Decisions1111D, C = this.Decisions1111C, B = this.Decisions1111B, log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var s = D.s3(), c = C.s3(undefined, { tauxPatrimoine: 0.0125 }), g = C.s3(), b = B.s3();
ok(D.TAUX === 0.0125, 'taux par défaut 1,25 %');
for (var y = 2029; y <= 2058; y++) { if (y > 2058) break; proche(s.traj.deficit[y - 2029], c.trajC.deficit[y - 2029], 1e-12, 'défaut = DECISIONS1111C au taux 1,25 % ' + y); }
proche(s.F, b.F, 1e-9, 'leviers F inchangés (33,3)'); proche(s.a, b.a, 1e-12, 'coefficient a inchangé');
ok(Math.abs(s.F - 33.27) < 0.05, 'F ≈ 33,3 Md€ : ' + s.F.toFixed(3));
proche(s.ecartPatrimoine, D.ligne().central - D.ligne().reference, 1e-9, 'écart = nette 1,25 % − v7.5 à 3 %');
ok(s.ecartPatrimoine < -35 && s.ecartPatrimoine > -50, 'écart de recette nette ≈ −42 Md€ : ' + s.ecartPatrimoine.toFixed(2));
ok(s.grandMenage === 'central', 'grand ménage central branché');
var sg = D.s3(undefined, { tauxPatrimoine: null }); for (y = 2029; y <= 2038; y++) proche(sg.traj.deficit[y - 2029], g.trajC.deficit[y - 2029], 1e-12, 'taux retiré = DECISIONS1111C sans taux ' + y);
ok(s.traj.deficit[9] > g.trajC.deficit[9] + 0.01, 'déficit 2038 plus haut qu\'avec le grand ménage seul');
ok(s.trajPrudente.deficit[9] > b.trajPrudente.deficit[9], 'macro prudente : déficit 2038 plus haut que DECISIONS1111B');
proche(s.po.pct - s.po.avantPct, s.ecartPatrimoine / 2935, 1e-9, 'prélèvements obligatoires : écart / PIB du modèle');
var l = D.ligne(); ok(l.favorable > l.central && l.central > l.defavorable, 'scénarios favorable > central > défavorable : ' + [l.favorable, l.central, l.defavorable].map(function (x) { return x.toFixed(1); }).join(' / '));
ok(l.score.M === 1 && l.score.J === 1 && l.score.E === 1, 'score M/J/E de la ligne 1,25 % : 1/1/1');
log('Tests : ' + n + ' vérifications passées.');
