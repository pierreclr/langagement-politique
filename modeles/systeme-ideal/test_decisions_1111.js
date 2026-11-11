// Tests de la couche DECISIONS1111 (decisions_1111.js). Charger la liste de ponts.py (LISTE_SYSTEME), decisions_1111.js et ce fichier (jsc).
var N = this.Decisions1111, C = this.Correction0811, G = this.Decisions0511g, H = this.Decisions0511h, E5 = this.Decisions0511e, AL = this.AgeLibre;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
// 1. Retraites : la couche reproduit la règle précédente quand on lui redonne l'indexation, et supprime les blocs décidés
['bas', 'central', 'haut'].forEach(function (sc) {
  var a = N.penibiliteLoi(sc, [2035, 2050], { partIndexation: 2 / 3 }), b = AL.penibiliteIndexee({ scenario: { bas: 'favorable', central: 'central', haut: 'defavorable' }[sc], annees: [2035, 2050] });
  proche(a[2050].surcoutDispenseMdE, b.annees[2050].surcoutDispenseMdE, 1e-9, 'pénibilité (' + sc + ') : même code que AgeLibre.penibiliteIndexee avec la règle indexée');
  proche(a[2035].surcoutDispenseMdE, b.annees[2035].surcoutDispenseMdE, 1e-9, 'pénibilité (' + sc + ') 2035 : idem');
});
var c = N.composantes('central', 2038), c0 = E5.composantes('central', 2038);
ok(c.ageReference === 0 && c.ageLibre === 0 && c.substitution === 0 && c.plancher === 0, 'âge de référence indexé, âge libre, substitution et plancher modélisé : à zéro');
proche(c.indexation, c0.indexation, 1e-12, 'indexation au-dessus de 2 000 € inchangée (decisions_0511e.js)'); proche(c.net, c.penibilite + c.indexation, 1e-12, 'net = pénibilité + indexation');
proche(c.hautesPensions, c0.hautesPensions, 1e-12, 'hautes pensions : même contribution, retirée du net comme avant');
ok(N.v6('central', 2038) > 0 && G.v6('central', 2038) < -15, 'le net passe de −18 Md€ (2038, âge libre au trimestre) à un petit gain : ' + G.v6('central', 2038) + ' → ' + N.v6('central', 2038));
ok(Math.abs(N.penibilite('central', 2038)) <= Math.abs(c0.penibilite) + 1e-9, 'sans indexation, la pénibilité ne coûte pas plus qu\'avec (âge de référence plus bas)');
ok(N.v6('central', 2028) === 0 && N.delta('central', 2028) === 0, 'rien avant 2029');
ok(N.v6('bas', 2038) >= N.v6('central', 2038) && N.v6('central', 2038) >= N.v6('haut', 2038), 'ordre des scénarios : favorable ≥ central ≥ défavorable');
// 2. Entreprise d'État
proche(N.cir(2029), 1.0, 1e-12, 'entreprise d\'État : 1,0 Md€ par an'); proche(H.cir(2029), 3.0, 1e-12, 'la couche précédente (H807) reste à 3,0 Md€ (non écrasée)');
proche(N.deltaDetail('central', 2035).entrepriseEtat, 2.0, 1e-12, 'écart d\'entreprise d\'État : +2,0 Md€ par an'); proche(N.delta('central', 2035), N.deltaDetail('central', 2035).retraites + 2.0, 1e-12, 'écart total = retraites + entreprise d\'État');
// 3. S3 recalibré
var a = C.s3(), s = N.s3(), z = N.s3(undefined, { sansCouche: true });
proche(z.F, a.F, 1e-9, 'sans la couche : on retrouve exactement CORRECTION0811 (leviers)'); proche(z.a, a.a, 1e-12, '... et le coefficient a'); proche(z.traj.ratio[29], a.traj.ratio[29], 1e-9, '... et la dette 2058');
proche(s.F, s.revenus + s.credit + s.transmissions + s.patrimoineNat + s.pension + s.eco, 1e-6, 'F = somme des leviers');
ok(s.F < a.F - 10, 'les leviers nécessaires baissent nettement : ' + a.F + ' → ' + s.F); ok(s.a < a.a, 'le coefficient a baisse : ' + a.a + ' → ' + s.a);
var okS = true; for (var i = 10; i < 30; i++) if (s.traj.ratio[i] > s.traj.ratio[9] + 1e-6) okS = false; ok(okS && s.picAn <= 2038, 'dette stable à partir de 2038 (macro de référence)');
proche(s.pension, 9.0, 1e-6, 'courbe des pensions inchangée : 9,00 Md€'); proche(s.transmissions, a.transmissions, 1e-9, 'transmissions inchangées');
var fx = N.s3(undefined, { F: a.F }); ok(fx.traj.ratio[9] < a.traj.ratio[9] - 0.05, 'variante à leviers inchangés : dette 2038 plus basse (' + a.traj.ratio[9] + ' → ' + fx.traj.ratio[9] + ')');
var maxS = 0; for (var y = 2038; y < 2058; y++) maxS = Math.max(maxS, Math.abs(N.saut(s, y).md)); ok(maxS < 3, 'pas de saut du solde primaire de 2038 à 2058 : ' + maxS);
ok(s.cas.smic_seul.ecartNet > 0, 'le Smic seul gagne encore'); ok(s.retraites.filter(function (x) { return x.pn <= 2000; }).every(function (x) { return x.ecartNet > 0; }), 'retraités jusqu\'à 2 000 € : ne perdent pas');
var p = N.prudente(); ok(p.F > s.F, 'macro prudente : plus de leviers que la référence');
log('Tests : ' + n + ' vérifications passées.');
