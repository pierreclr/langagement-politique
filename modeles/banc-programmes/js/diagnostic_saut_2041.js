/*
 * modeles/banc-programmes/js/diagnostic_saut_2041.js : saut du solde primaire de notre système entre 2040 et 2041 (V32012), avant et après la correction du double compte du différé (V32018, 08/11/2026 nuit).
 * Lancé comme pont_systeme.js (jsc, liste de ponts.LISTE_SYSTEME, qui contient correction_0811.js). Avant : +24,4 Md€ (13,5 de Stress.pbStruct + 11,5 de Decisions0511b.ajustement, H537, durée 12 ans) ;
 * après : un seul report, la trésorerie de la v7.4 (flux 12,4 Md€, durée 12 ans) écrite comme un stock remboursé de 1/12 par an : plus de saut. Variante à durée fixe : saut de 11,8 Md€.
 */
var C = this.Correction0811, out = [];
var avant = C.s3(undefined, { sansCorrection: true, top: true }), apres = C.s3(), fixe = C.s3(undefined, { dureeFixe: true });
var h = C.reportsHerites();
out.push('reports hérités retirés : pbStruct ' + h.diff.toFixed(2) + ' + plafonds ' + h.plafonds.toFixed(2) + ' = ' + h.total.toFixed(2) + ' Md€ (2029-2040)');
out.push('trésorerie de la v7.4 : ' + JSON.stringify(C.tresorerieV74()));
[['avant', avant], ['après (étalé, retenu)', apres], ['durée fixe 12 ans', fixe]].forEach(function (x) {
  out.push(x[0] + ' : F = ' + x[1].F.toFixed(2) + ', a = ' + x[1].a.toFixed(4) + ', dette 2038 ' + (100 * x[1].traj.ratio[9]).toFixed(1) + ' %, 2058 ' + (100 * x[1].traj.ratio[29]).toFixed(1) + ' %, saut 2040-2041 ' + C.saut(x[1], 2040).md.toFixed(2) + ' Md€');
});
print(out.join('\n'));
