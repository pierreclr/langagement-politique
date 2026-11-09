// Tests de la couche CORRECTION0811 (correction_0811.js). Liste de rapport_consolidation_0611.js sans le rapport, puis decisions_0711.js, decisions_0811.js, correction_0811.js et ce fichier (jsc).
var C = this.Correction0811, E = this.Decisions0811, D = this.Decisions0711, ST = this.Stress;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
// 1. Reports hérités et trésorerie de la v7.4
var h = C.reportsHerites(), q = C.tresorerieV74();
proche(h.diff, 13.5, 0.05, 'report hérité 1 (Stress.pbStruct, terme diff) ≈ 13,5 Md€'); proche(h.plafonds, 11.5, 0.05, 'report hérité 2 (Decisions0511b.ajustement, flux des plafonds) ≈ 11,5 Md€'); proche(h.total, 25.0, 0.05, 'somme des reports hérités ≈ 25,0 Md€');
ok(h.duree === 12 && q.duree === 12, 'durée de 12 ans dans les deux (H537 et HYP.paiement.duree de la v7.4)');
proche(q.flux, 12.4, 0.05, 'trésorerie de la v7.4 : flux ≈ 12,4 Md€ par an'); proche(q.encours, 149, 0.5, 'encours de croisière de la v7.4 ≈ 149 Md€');
var Z = this.Optimum, D5 = this.Decisions0511; ok(Z.HYP.dureeCreance === 12 && D5.HYP.dureeFlux === 12, 'H537 restauré après la mesure des reports hérités');
// 2. Coût de trésorerie (stock qui se rembourse)
proche(C.coutTresorerie(1), q.flux, 1e-9, 'première année : tout le flux est un coût (rien n\'est encore recouvré)');
var okDec = true; for (var t = 2; t <= 40; t++) if (!(C.coutTresorerie(t) < C.coutTresorerie(t - 1) && C.coutTresorerie(t) > 0)) okDec = false; ok(okDec, 'coût de trésorerie strictement décroissant et positif : pas de marche');
proche(C.coutTresorerie(13) / C.coutTresorerie(12), 1 - 1 / 12, 1e-9, 'décroissance régulière de 1/12 par an, y compris en 2041');
proche(C.encoursAnnee(200), q.encours, 0.01, 'l\'encours tend vers flux × durée = 149 Md€');
proche(C.correction(2029), h.total - q.flux, 1e-9, 'correction 2029 = reports retirés − flux de la v7.4'); ok(C.correction(2041) < 0 && C.correction(2040) > 0, 'la correction change de signe en 2041 : le coût de trésorerie reste, les reports hérités ont disparu');
proche(C.coutTresorerie(5, { dureeFixe: true }), q.flux, 1e-9, 'variante à durée fixe : coût constant'); proche(C.coutTresorerie(13, { dureeFixe: true }), 0, 1e-9, 'variante à durée fixe : extinction brutale après 12 ans');
// 3. S3 recalibré
var s = C.s3(), s0 = C.s3(undefined, { sansCorrection: true, top: true }), s8 = E.s3();
proche(s0.F, s8.F, 1e-9, 'sans correction et avec la montée à 60 % : on retrouve exactement S3 de la couche 0811 (leviers)'); proche(s0.a, s8.a, 1e-12, '... et le coefficient a');
proche(s.F, s.revenus + s.credit + s.transmissions + s.patrimoineNat + s.pension + s.eco, 1e-6, 'S3 corrigé : F = somme des leviers');
ok(s.F < s8.F - 10, 'les leviers nécessaires baissent nettement (' + s8.F + ' → ' + s.F + ')'); ok(s.a < s8.a, 'le coefficient a baisse');
var i0 = 9, okS = true; for (var i = i0 + 1; i < 30; i++) if (s.traj.ratio[i] > s.traj.ratio[i0] + 1e-6) okS = false; ok(okS && s.picAn <= 2038, 'dette stable à partir de 2038 (macro de référence)');
proche(s.pension, 9.0, 1e-6, 'courbe des pensions inchangée : 9,00 Md€');
var sb = C.s3(undefined, { sansCorrection: true }); ok(sb.transmissions > s0.transmissions && sb.transmissions - s0.transmissions < 0.5, 'plafond à 50 % sans montée à 60 % : recette de transmissions de l\'ordre de +0,1 Md€ (moins d\'évitement) : ' + (sb.transmissions - s0.transmissions));
// 4. Le saut de 2040-2041
var sa = C.saut(s, 2040), sv = C.saut(s0, 2040), sf = C.s3(undefined, { dureeFixe: true });
ok(sv.md > 20, 'avant correction : saut de +24 Md€ du solde primaire entre 2040 et 2041 (V32012) : ' + sv.md); ok(Math.abs(sa.md) < 1, 'après correction : plus de saut (' + sa.md + ' Md€)');
ok(C.saut(sf, 2040).md > 10, 'durée fixe de 12 ans : un saut de 12 Md€ subsiste (variante pour mémoire) : ' + C.saut(sf, 2040).md);
proche(sf.F, 40.07, 0.05, 'variante à durée fixe : leviers 40,1 Md€ (valeur annoncée en V32018)');
var maxApres = 0; for (var y2 = 2038; y2 < 2058; y2++) maxApres = Math.max(maxApres, Math.abs(C.saut(s, y2).md)); ok(maxApres < 3, 'de 2038 à 2058, le solde primaire varie de moins de 3 Md€ d\'une année à l\'autre : ' + maxApres);
// 5. Cas types, retraités, prudente, clause
ok(s.cas.smic_seul.ecartNet > 0 && s.cas.couple_2smic_2enf.ecartNet > 0, 'Smic et couple à deux Smic avec deux enfants gagnent');
ok(s.retraites.filter(function (x) { return x.pn <= 2000; }).every(function (x) { return x.ecartNet > 0; }), 'retraités jusqu\'à 2 000 € : ne perdent pas');
var p = C.prudente(); ok(p.F > s.F && p.a > s.a, 'macro prudente : plus de leviers et a plus élevé que la référence');
var cl = C.clause(s); ok(cl.L.every(function (x) { return x >= 0; }) && cl.avec[29] < cl.sans[29], 'clause : levier positif, dette plus basse avec la clause (macro prudente)');
ok(cl.stable.m <= 0.5 + 1e-9, 'clause : coefficient de la courbe des pensions plafonné à 0,5');
log('Tests : ' + n + ' vérifications passées.');
