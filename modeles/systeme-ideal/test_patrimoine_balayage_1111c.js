// Tests du balayage du taux de la fonction du patrimoine (patrimoine_balayage_1111c.js). Charger la liste de ponts.py (jusqu'à decisions_1111b.js), ce module, puis ce fichier (jsc).
var P = this.PatrimoineBalayage1111C, V = this.Decisions0611V75, log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var L = P.balayage();
ok(L.length === 6 && Math.abs(L[0].t - 0.005) < 1e-12 && Math.abs(L[5].t - 0.02) < 1e-12, 'balayage : 0,5 / 0,75 / 1 / 1,25 / 1,5 / 2 %');
// score M/J/E : J = 1 jusqu'à 1,5 % (taux validé en 2012), 0 au-delà
ok(P.score(0.015).s === 3 && P.score(0.0151).s === 2 && P.score(0.03).s === 2, 'score : 3 jusqu\'à 1,5 %, 2 au-delà (J = 0)');
proche(P.retenu(10, 3).central, 10, 1e-12, 'grille : score 3, part médiane 100 %'); proche(P.retenu(10, 2).central, 7, 1e-12, 'grille : score 2, part médiane 70 %'); proche(P.retenu(10, 1).bas, 1, 1e-12, 'grille : score 1, bas 10 %');
// la part RP (régime propre à la résidence principale) ne dépend pas du taux et vaut celle de la variante v7.5
proche(L[0].rpNette, V.recette({ regime: 'RP', X: 1e6, tInf: 0.03, K: 4e5, payeProrata: true, plancherPro: true }).rpNette, 1e-9, 'part RP identique à la v7.5 (0,25 % jusqu\'à 1 M€)');
// dû statique de la fonction croissant avec le taux
for (var i = 1; i < L.length; i++) ok(L[i].fonctionStatique >= L[i - 1].fonctionStatique - 1e-9, 'dû statique de la fonction croissant avec le taux (' + L[i].t + ')');
// scénarios de comportement : favorable ≥ central ≥ défavorable pour la recette nette à 2 % (érosion 20 / 40 / 74 % pour 1 %)
var l2 = P.ligne(0.02); ok(l2.sc.favorable.nette >= l2.sc.central.nette && l2.sc.central.nette >= l2.sc.defavorable.nette, 'recette nette : favorable ≥ central ≥ défavorable à 2 %');
// plafonnement : nette = RP + fonction × (1 − p) × ratio ; la fonction nette est plus basse que le dû plafonné
var c = l2.sc.central; proche(c.fonctionStatiquePlafonnee, l2.fonctionStatique * 0.85, 1e-9, 'plafonnement central : −15 % de la fonction'); ok(c.fonctionNette < c.fonctionStatiquePlafonnee, 'la chaîne de comportement retire de la recette');
proche(c.nette, l2.rpNette + c.fonctionNette, 1e-9, 'nette = part RP + fonction nette');
// départs : croissants avec le taux (central), nuls ou presque aux taux bas
ok(L[0].sc.central.departsModele < 10 && L[0].sc.central.departsISF < 50, 'départs négligeables à 0,5 %');
for (var j = 1; j < L.length; j++) ok(L[j].sc.central.departsISF >= L[j - 1].sc.central.departsISF - 1e-9 && L[j].sc.central.departsModele >= L[j - 1].sc.central.departsModele - 1e-6, 'départs croissants avec le taux (' + L[j].t + ')');
proche(L[4].sc.central.departsISF, 190 * L[4].sc.central.fonctionStatiquePlafonnee, 1e-6, 'méthode ISF : 190 départs par Md€ dû');
// à l'ancien niveau de l'ISF : la recommandation respecte la contrainte et maximise le retenu parmi les taux admissibles
var rec = P.recommander(); ok(rec.best !== null && rec.best.departsMax <= 950 + 1e-9, 'recommandation sous le niveau de l\'ISF (950 départs par an) : ' + (100 * rec.best.t).toFixed(2) + ' %');
rec.tous.forEach(function (x) { if (x.ok) ok(x.retenu <= rec.best.retenu + 1e-9, 'recommandation : retenu maximal (' + (100 * x.t).toFixed(2) + ' %)'); });
var rec2 = P.recommander({ departsMax: 1e9 }); ok(rec2.best.t <= 0.0200001 && rec2.best.retenu >= rec.best.retenu - 1e-9, 'sans contrainte de départs, le retenu ne baisse pas');
// l'écart au système (v7.5 à 3 %) : négatif pour tous les taux balayés (la v7.5 recommandée rapporte plus, en nominal)
L.forEach(function (l) { ok(P.ecart(l.t) < 0, 'écart de recette nette vs v7.5 à 3 % négatif (' + l.t + ')'); });
proche(P.reference().nette, 62.5, 0.2, 'référence : v7.5 recommandée ≈ 62,5 Md€');
log('Tests : ' + n + ' vérifications passées.');
