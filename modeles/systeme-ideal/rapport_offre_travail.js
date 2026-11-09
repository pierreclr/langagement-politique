// Rapport « offre de travail » (H202) : réactions D1-D9 déjà comptées par le modèle, option offreTravail, points de rupture, frontière. Depuis ce dossier :
//   jsc modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js croissance.js trajectoires_age_depart.js soutenabilite.js rapport_offre_travail.js
// Sortie : sources/recherche-revenu-de-base-travail.md §§ 2, 3 et 6.
var M = this.SystemeIdeal, P1 = this.Palier1, S = this.Soutenabilite, F = this.Voies.fus, O = this.Optimisation, sv = S.solveur();
var log = (typeof print === 'function') ? print : console.log;
log('== 3. Réactions D1-D9 déjà comptées (écart avec / sans réactions)');
[[500, 0.35], [500, 0.52], [780, 0.35], [780, 0.52]].forEach(function (c) {
  var tm = S.tMaxPour(c[1], 'combine') || 0.06, st = F(P1.stFor({}), { socle: c[0], tPlat: c[1], tMax: tm }), line = c.join(' / ') + ' : ';
  ['bas', 'central', 'haut'].forEach(function (sc) {
    var p = F(O.configR(st), { scenario: sc }), a = M.recettesCourants(M.param(p)), b = M.recettesCourants(M.param(F(p, { reactions: false }))), la = 0, lb = 0, ra = 0, rb = 0;
    a.parBande.forEach(function (x, i) { if (i < 9) { la += x.n * x.L; lb += b.parBande[i].n * b.parBande[i].L; ra += x.recetteMd; rb += b.parBande[i].recetteMd; } });
    line += sc + ' : revenus D1-D9 ' + (100 * (la / lb - 1)).toFixed(1) + ' %, recettes ' + (ra - rb).toFixed(1) + ' Md€ | ';
  });
  log(line);
  var p0 = F(O.configR(st), { scenario: 'central' });
  [{ id: 'smic', cout: 1987.76, actuel: 1707.45 }, { id: 'median', cout: 3676.54, actuel: 2115.89 }].forEach(function (z) {
    var w = M.situation({ id: z.id, adultes: 1, enfants: 0, age: 40, heuresSemaine: 35, coutMensuelPlein: z.cout }, p0).apresMois;
    var nw = Math.max(M.situation({ id: 'nw', adultes: 1, enfants: 0, age: 40, heuresSemaine: 0, coutMensuelPlein: z.cout }, p0).apresMois, 877);
    log('    ' + z.id + ' : taux de participation système ' + (100 * (1 - (w - nw) / z.cout)).toFixed(1) + ' %, actuel ' + (100 * (1 - (z.actuel - 877) / z.cout)).toFixed(1) + ' %');
  });
});
log('== 6. Option offreTravail sur P1 à P8 (dette/PIB 2065)');
Object.keys(S.PISTE_SOCLE).forEach(function (k) {
  var d = S.PISTE_SOCLE[k], tm = S.tMaxPour(d.c.tPlat, 'combine'), line = k + ' ' + d.c.socle + ' € / ' + (100 * d.c.tPlat) + ' % : ';
  ['aucune', 'bas', 'central', 'haut'].forEach(function (l) { var e = sv.evaluer(F(d.c, { offreTravail: l }), tm); line += l + ' ' + (100 * e.r2065).toFixed(1) + ' % ' + (e.stable ? 'stable' : 'non') + ' | '; });
  var lo = -0.1, hi = 0.1, i, mid;
  for (i = 0; i < 40; i++) { mid = (lo + hi) / 2; if (sv.evaluer(F(d.c, { offreTravail: mid }), tm).stable) lo = mid; else hi = mid; }
  log(line + 'rupture à ' + (100 * lo).toFixed(2) + ' point(s)');
});
['aucune', 'bas', 'central', 'haut'].forEach(function (l) {
  var fr = sv.frontiereSocle('socleHaut', { offreTravail: l }), best = {}, minPlat = null;
  [0.40, 0.44, 0.48, 0.50, 0.52, 0.54, 0.57, 0.60].forEach(function (tp) { var m = null; fr.forEach(function (r) { if (Math.abs(r.plat - tp) < 1e-6 && (!m || r.socle > m.socle)) m = r; }); best[tp] = m ? m.socle : '-'; });
  fr.forEach(function (r) { if (!minPlat || r.plat < minPlat.plat) minPlat = r; });
  log('frontière offreTravail=' + l + ' : ' + fr.length + ' points, taux plat minimal ' + (minPlat ? minPlat.plat + ' (socle ' + minPlat.socle + ')' : 'aucun') + ', socle maximal par taux plat ' + JSON.stringify(best));
});
