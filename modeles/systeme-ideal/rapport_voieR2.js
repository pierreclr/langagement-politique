// Voie R2 : tableaux de resultats.md § 12. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js rapport_voieR2.js
var R2 = this.Retraites2, O = this.Optimisation, M = this.SystemeIdeal, D = M.DONNEES, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
function r0(x) { return Math.round(x).toString(); }
function pc(x) { return r0(100 * x) + ' %'; }

log('## A. Pensions : moyenne, queue, effectifs concernés par seuil (nets 2025 = nets 2020 × ' + R2.REVAL + ')');
log('pension moyenne nette 2025 : ' + r0(R2.pensionMoyenne()) + ' €/mois ; exposant de queue ' + r1(R2.exposantQueue()));
[2000, 2500, 3000, 4000].forEach(function (S) {
  var pts = R2.points(), part = 0, exc = 0;
  pts.forEach(function (p) { var x = p.x * R2.REVAL; if (x > S) part += p.w; exc += p.w * Math.max(0, x - S); });
  log('seuil ' + S + ' : ' + r1(100 * part) + ' % des retraités (' + r1(part * D.retraites / 1e6) + ' M) ; excédent total ' + r1(exc * 12 * D.retraites / 1e9) + ' Md€/an (pension seule, brut de toute fuite)');
});

log('\n## B. Contribution (Md€/an) : seuil S × taux sur l\'excédent, base pension seule ou pension + capital (majoration capital +10 pts), brute / nette bas / central / haut');
[2000, 2500, 3000].forEach(function (S) { [0.10, 0.20, 0.30].forEach(function (t) {
  var a = R2.contribution({ seuil: S, taux: t, base: 'pension' }, 'central'), b0 = R2.contribution({ seuil: S, taux: t, base: 'total', majCapital: 0 }, 'central'), b1 = R2.contribution({ seuil: S, taux: t, base: 'total', majCapital: 0.10 }, 'central');
  var n = function (o) { return ['bas', 'central', 'haut'].map(function (s) { return r1(R2.contribution(o, s).netMd); }).join(' / '); };
  log('S ' + S + ' taux ' + pc(t) + ' | pension seule : brut ' + r1(a.brutMd) + ', net ' + n({ seuil: S, taux: t, base: 'pension' }) + ' | + capital (maj 0) : brut ' + r1(b0.brutMd) + ', net ' + n({ seuil: S, taux: t, base: 'total', majCapital: 0 }) +
    ' | + capital (maj +10) : brut ' + r1(b1.brutMd) + ' (dont capital ' + r1(b1.capitalBruteMd) + '), net ' + n({ seuil: S, taux: t, base: 'total', majCapital: 0.10 }) + ' | concernés ' + r1(b1.concernes / 1e6) + ' M (' + pc(b1.partConcernes) + ')');
}); });

log('\n## C. Minimum garanti : coût (Md€/an, ASPA comprise) et surcoût vs ASPA actuelle');
[1043.59, 1100, 1200, 1300, 1400].forEach(function (m) { log('minimum ' + r0(m) + ' € : manque moyen ' + r1(R2.manque(m)) + ' €/mois par retraité ; coût ' + r1(R2.coutMinGaranti(m)) + ' ; surcoût ' + r1(R2.surcoutMinGaranti(m))); });

log('\n## D. Fraude : recettes nettes (Md€/an) bas / central / haut avec ' + R2.FRAUDE_ETP + ' postes : ' + ['bas', 'central', 'haut'].map(function (s) { return r1(R2.fraude(s)); }).join(' / '));
log('   sensibilité aux postes (central) : 1 000 → ' + r1(R2.fraude('central', 1000)) + ' ; 5 000 → ' + r1(R2.fraude('central', 5000)));

log('\n## E. Hauts salaires : masse au-dessus de seuils (secteur privé, 2023, Pareto entre D9, top 1 % et top 0,1 %)');
[4000, 6000, 10000].forEach(function (s) { var m = R2.masseSalaires(s); log('> ' + s + ' € nets/mois : ' + r1(100 * m.part) + ' % des salariés (' + r0(m.effectifs / 1000) + ' k) ; masse nette ' + r0(m.masseNetteMd) + ' Md€/an ; excédent au-dessus du seuil ' + r1(m.excedentMd) + ' Md€/an'); });
var b0 = M.solde(F(O.configR({ socle: 650, tPlat: 0.40, tMax: 0.30 }), { scenario: 'central' })), b1 = M.solde(F(O.configR({ socle: 650, tPlat: 0.40, tMax: 0.40 }), { scenario: 'central' })), b2 = M.solde(F(O.configR({ socle: 650, tPlat: 0.40, tMax: 0.45 }), { scenario: 'central' }));
log('Recettes du modèle : t_max 30 → 40 % : ' + r1(b1.recettes.total - b0.recettes.total) + ' Md€ ; 30 → 45 % : ' + r1(b2.recettes.total - b0.recettes.total) + ' Md€ (central, plat 40 %, socle 650, rétroactions comprises)');

log('\n## F. Socle maximal finançable (non retraités), plafond de taux marginal 70 % : équilibre (solde central avec santé ≥ 0) | Δ ≥ 0 ; personnel / IS + dividende');
var V0 = { seuil: 99999, taux: 0, base: 'pension', majCapital: 0, minGaranti: D.aspa.plafond };
function ligne(nom, o, fr) {
  var out = [nom];
  [['equilibre', false], ['equilibre', true], ['neutre', false], ['neutre', true]].forEach(function (a) { var r = R2.socleMaxR2(o, 0.70, a[0], a[1]); out.push(r.socle === null ? 'aucun' : r0(r.socle)); });
  var rec = R2.recettesR2(o);
  out.push('recettes R2 ' + ['bas', 'central', 'haut'].map(function (s) { return r1(rec[s].total); }).join(' / '));
  log(out.join(' | '));
}
log('colonnes : équilibre personnel | équilibre IS+div | Δ≥0 personnel | Δ≥0 IS+div | recettes nouvelles bas/central/haut (Md€)');
ligne('R (référence : fraude comprise, aucune contribution)', V0);
[2000, 2500, 3000].forEach(function (S) { [0.10, 0.20, 0.30].forEach(function (t) {
  ligne('R2 S ' + S + ' taux ' + pc(t) + ' pension + capital (+10 pts)', { seuil: S, taux: t, base: 'total', majCapital: 0.10 });
}); });
ligne('R2 S 2500 taux 20 % pension seule', { seuil: 2500, taux: 0.20, base: 'pension' });
ligne('R2 S 2500 taux 20 % capital sans majoration', { seuil: 2500, taux: 0.20, base: 'total', majCapital: 0 });
ligne('R2 S 2500 taux 20 % + minimum garanti 1 200 €', { seuil: 2500, taux: 0.20, base: 'total', majCapital: 0.10, minGaranti: 1200 });
ligne('R2 S 2500 taux 20 % + minimum garanti 1 300 €', { seuil: 2500, taux: 0.20, base: 'total', majCapital: 0.10, minGaranti: 1300 });
ligne('R2 progressive : 15 % de 2 500 à 4 000 €, 30 % au-delà', { seuil: 2500, taux: 0.15, tauxHaut: 0.30, seuilHaut: 4000, base: 'total', majCapital: 0.10 });

log('\n## G. Perdants (retraités, avant fuite) selon la variante');
[[2000, 0.20], [2500, 0.20], [3000, 0.20], [2500, 0.30]].forEach(function (a) {
  var o = { seuil: a[0], taux: a[1], base: 'total', majCapital: 0.10 };
  log('S ' + a[0] + ' taux ' + pc(a[1]) + ' : ' + R2.casRetraites(o).map(function (c) { return c.id + ' ' + r0(c.avantMois) + ' → ' + r0(c.apresMois) + ' (' + r0(c.ecartMois) + ' €, ' + r1(100 * c.partEcart) + ' %, marginal total ' + pc(c.margTotal) + ')'; }).join(' ; '));
});

log('\n## H. Actifs (structure : socle 500, plat 45 %, t_max 20 % / plat 40 %, t_max 30 %)');
[{ socle: 500, tPlat: 0.45, tMax: 0.20 }, { socle: 650, tPlat: 0.40, tMax: 0.30 }, { socle: 650, tPlat: 0.30, tMax: 0.40 }].forEach(function (st) {
  log('socle ' + st.socle + ' plat ' + pc(st.tPlat) + ' t_max ' + pc(st.tMax) + ' : ' + R2.casActifs(st).map(function (c) { return c.id + ' ' + r0(c.avantMois) + ' → ' + r0(c.apresMois) + ' (' + r0(c.ecartMois) + ', ' + r1(100 * c.partEcart) + ' %)'; }).join(' ; '));
});

log('\n## I. Taux plat nécessaire (Δ ≥ 0 puis équilibre), socle 500 / 650 / 800, t_max 30 %');
[500, 650, 800].forEach(function (S) {
  [['R (référence)', { seuil: 99999, taux: 0, base: 'pension' }], ['R2 S 3000 20 %', { seuil: 3000, taux: 0.2, base: 'total', majCapital: 0.1 }], ['R2 S 2500 20 %', { seuil: 2500, taux: 0.2, base: 'total', majCapital: 0.1 }], ['R2 S 2000 30 %', { seuil: 2000, taux: 0.3, base: 'total', majCapital: 0.1 }]].forEach(function (a) {
    var n = R2.platNecessaireR2({ socle: S, tMax: 0.30 }, a[1], D.deficitActuel), e = R2.platNecessaireR2({ socle: S, tMax: 0.30 }, a[1], 0);
    log('S ' + S + ' | ' + a[0] + ' | plat Δ ≥ 0 : ' + (n === null ? 'aucun' : r1(100 * n) + ' %') + ' | plat équilibre : ' + (e === null ? 'aucun' : r1(100 * e) + ' %'));
  });
});

log('\n## J. Soldes bas / central / haut de R2 à S 2500, taux 20 %, socle 650, plat Δ ≥ 0 central');
var oo = { seuil: 2500, taux: 0.2, base: 'total', majCapital: 0.1 }, tn = R2.platNecessaireR2({ socle: 650, tMax: 0.30 }, oo, D.deficitActuel);
['bas', 'central', 'haut'].forEach(function (s) { log(s + ' : solde ' + r0(R2.soldeR2({ socle: 650, tMax: 0.30, tPlat: tn }, oo, s)) + ' Md€ (plat ' + r1(100 * tn) + ' %)'); });

log('\n## K. Recalage du capital des retraités (H134) et variante de patrimoine (H135) : contribution à 20 % au-dessus de 2 500 €, capital sans majoration, Md€/an');
log('Jeu | assiette capital | brut central | net bas / central / haut | concernés');
[['ancien (H20 : 25 % du capital, clé 1-2-3-4-6-8-10-14-20-32 %)', 'ancien', null], ['recalé (H134 : 20 %, clé 3-5-6-6-7-9-10-12-16-26 %)', 'recherche', null],
 ['recalé + seuil de patrimoine hors résidence principale 300 k€ (H135)', 'recherche', 300000], ['ancien + seuil 300 k€ (comparaison)', 'ancien', 300000]].forEach(function (j) {
  var o = { seuil: 2500, taux: 0.2, base: 'total', majCapital: 0, jeuCapital: j[1], seuilPatri: j[2] }, c = R2.contribution(o, 'central');
  log(j[0] + ' | ' + (j[2] ? 'retraités à patrimoine hors RP > 300 k€' : 'tous les retraités') + ' | ' + r1(c.brutMd) + ' | ' + ['bas', 'central', 'haut'].map(function (s) { return r1(R2.contribution(o, s).netMd); }).join(' / ') + ' | ' + r1(c.concernes / 1e6) + ' M');
});
log('Repère de la recherche (`sources/recherche-pensions-patrimoine.md` § 1, individus simulés) : brut 16,2, net 13,3 (8,1 à 24,7) ; le modèle, qui lisse le capital à la moyenne de chaque décile de pension, retombe plus bas (H135, limite 1).');
