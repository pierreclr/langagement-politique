// Tests de la couche DECISIONS0811 (decisions_0811.js, décisions du 07/11 soir et du 08/11/2026). Liste de rapport_consolidation_0611.js sans le rapport, puis decisions_0711.js, decisions_0811.js et ce fichier (jsc).
var E = this.Decisions0811, D = this.Decisions0711, R = this.RetraitesAisees0611, Y = this.Decisions0611V72;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
// 1. Courbe des pensions relevée
var c = E.courbe(), o = c.o;
proche(D.recettePension(o, 1).net, 9.0, 1e-6, 'courbe relevée : 9,00 Md€ au central');
proche(o.m, D.courbe().o.m * 9 / D.courbe().cible, 1e-6, 'coefficient exact = proportionnalité (la recette est linéaire en k)');
proche(o.m, 0.418, 0.001, 'coefficient ≈ 0,418');
ok(o.Pg === 2000 && o.K === 1500, 'seuil 2 000 € et K = 1 500 € inchangés');
ok(D.Cp(2000, o) === 0 && D.Cp(1200, o) === 0, 'rien jusqu\'à 2 000 €');
proche(D.Cp(3000, o), 113, 1, 'courbe à 3 000 € : 113 € (estimation du 08/11 : 113)');
proche(D.Cp(4000, o), 374, 1, 'courbe à 4 000 € : 374 €');
proche(D.Cp(10000, o), 2719, 2, 'courbe à 10 000 € : 2 719 €');
ok(D.marginalP(1e6, o) < 0.4180 + 1e-3 && D.marginalP(1e6, o) > 0.417, 'marginal borné par 0,418 (plafond ≈ 42 %)');
var r = E.r1f(); ok(r.regime > 0.7 && r.regime < 0.8 && r.y2029 < r.regime, 'R1f rapportait 0,74 Md€ en régime (0,16 en 2029)');
ok(E.casRetraite(3000).r1f === 0 && E.casRetraite(4000).ecartNet < D.casRetraite(4000, D.courbe().o, false).ecartNet, 'R1f supprimée du cas retraité ; la courbe seule prend plus qu\'avant à 4 000 €');
ok(E.pensionBascule() > 3000 && E.pensionBascule() < 3208, 'on perd à partir de ≈ 3 090 € (3 208 € avec R1f et l\'ancienne courbe)');
// 2. Grand âge et vieillesse
var ga = E.grandAge(), v = E.vieillesse();
proche(ga.total[1], 4.1, 1e-9, 'grand âge central : 3,2 + 0,9 = 4,1 Md€');
ok(ga.total[0] <= ga.total[1] && ga.total[1] <= ga.total[2], 'grand âge : bas <= central <= haut');
proche(v.hausseCourbe, 9 - D.courbe().cible, 1e-6, 'ligne vieillesse : hausse de la courbe = 9 − 6,27');
ok(!v.couverture9 && v.reste > 1.5 && v.reste < 2.5, '9 Md€ ne couvrent pas R1f + grand âge : reste ≈ 2,1 Md€');
// 3. TVA, conversions, plancher, lieu
var tv = E.tvaAutres(); ok(tv.every(function (l) { return l.v[0] >= l.v[1] && l.v[1] >= l.v[2]; }), 'TVA : favorable >= central >= défavorable');
var tt = tv.reduce(function (a, l) { return a + l.v[1]; }, 0); ok(Math.abs(tt) < 0.5, 'TVA des autres taux : effet de l\'ordre de quelques centaines de millions (V20006) : ' + tt);
var cv = E.conversion(); proche(cv.assietteMutuelle, 23.8 * 0.55, 1e-9, 'assiette mutuelle = 23,8 × 55 %'); proche(cv.mutuelle[1], cv.assietteMutuelle * 0.58 * 0.5, 1e-9, 'mutuelle : moitié de 7,59 au central (0 au défavorable)');
ok(cv.mutuelle[2] === 0 && cv.transport[2] === 0, 'conversion en salaire : rien au défavorable (déjà dans R)');
var pl = E.plancher(); ok(pl.parts[0] + pl.parts[1] === 877, 'plancher en deux parts : 627 + 250 = 877'); ok(pl.economie[0] > pl.economie[1] && pl.economie[1] > pl.economie[2] && pl.economie[2] > 0, 'plancher : économie positive, décroissante du favorable au défavorable');
proche(pl.cas.proprietaire.ecart, -250, 1e-9, 'propriétaire sans loyer : −250 €/mois'); proche(pl.cas.locataire.ecart, 0, 1e-9, 'locataire : inchangé');
var li = E.lieu(); ok(li.coefMoyen > 1.09 && li.coefMoyen < 1.16, 'coefficient de lieu moyen entre 1,09 et 1,16 : ' + li.coefMoyen); ok(li.cout[0] < li.cout[1] && li.cout[1] < li.cout[2] && li.cout[2] < 1, 'coût du coefficient de lieu : sous 1 Md€');
// 4. Lignes
var L = E.lignesNouvelles(); var ids = L.map(function (l) { return l.id; }).join(',');
ok(ids === 'GA01,GA02,TV06,TV07,TV08,TV09,TV10,CS01,CS02,PL01,PL02,OM01,OM02,CL01,JU01,EN01,ZA01,ZA02,IM01,VI01', 'lignes de la couche : ' + ids);
var sn = D.somme(L); ok(sn[0] >= sn[1] && sn[1] >= sn[2], 'couche 0811 : favorable >= central >= défavorable');
proche(L.filter(function (l) { return l.id === 'ZA01'; })[0].v[1] + L.filter(function (l) { return l.id === 'ZA02'; })[0].v[1], 0, 1e-12, 'artificialisation : recette fléchée, net nul');
proche(D.somme(L.filter(function (l) { return ['CL01', 'JU01', 'EN01', 'IM01', 'VI01', 'ZA01', 'ZA02'].indexOf(l.id) >= 0; }))[1], -2.79, 0.02, 'lignes de sources/chiffrage-decisions-0811.md : −2,8 Md€ au central');
// 5. S3
var s = E.s3(), s7 = D.s3();
proche(s.F, s.revenus + s.credit + s.transmissions + s.patrimoineNat + s.pension + s.eco, 1e-6, 'S3 : F = somme des leviers');
proche(s.pension, 9.0, 1e-6, 'S3 : courbe des pensions à 9 Md€');
proche(s.F - s7.F, -(s.effetCouche - s7.effetCouche) + r.regime, 0.3, 'S3 : F(0811) − F(0711) = −(écart de couche) + recette de R1f perdue');
var i0 = 9, okS = true; for (var i = i0 + 1; i < 30; i++) if (s.traj.ratio[i] > s.traj.ratio[i0] + 1e-6) okS = false; ok(okS && s.picAn <= 2038, 'S3 0811 : dette stable à partir de 2038 (macro de référence)');
ok(s.cas.smic_seul.ecartNet > 0 && s.cas.couple_2smic_2enf.ecartNet > 0, 'Smic et couple à deux Smic avec deux enfants gagnent');
ok(s.retraites.filter(function (x) { return x.pn <= 2000; }).every(function (x) { return x.ecartNet > 0; }), 'retraités jusqu\'à 2 000 € : ne perdent pas');
ok(s.retraites[0].r1f === 0, 'R1f supprimée dans les cas retraités');
var sc = E.s3(undefined, { extra: D.HYP.gt.gtc_droite.comportement[1] }); ok(sc.F < s.F, 'comportement compté : moins de leviers');
// 6. Clause
var cl = E.clause(s);
ok(cl.L[0] === 0 && cl.L.every(function (x) { return x >= 0; }), 'clause : levier nul puis positif');
ok(cl.L.every(function (x, i) { return i === 0 || Math.abs(x - cl.L[i - 1]) <= E.HYP.clause.pas + 1e-9; }), 'clause : variation annuelle plafonnée');
ok(cl.avec[29] < cl.sans[29] && cl.avec[9] < cl.sans[9], 'clause : la dette est plus basse avec la clause (macro prudente)');
ok(cl.stable.retraites <= cl.pensMax + 1e-9 && cl.stable.m <= E.HYP.clause.mCap + 1e-9, 'clause : la courbe des pensions plafonnée à 0,5 ; le reste va à la fonction des revenus');
ok(cl.stable.a > s.a && cl.pic.a >= cl.stable.a, 'clause : a monte avec le levier');
var cl0 = E.clause(s, { seuil: 10 }); ok(cl0.maxL === 0, 'clause : jamais déclenchée si l\'écart reste sous le seuil');
log('Tests : ' + n + ' vérifications passées.');
