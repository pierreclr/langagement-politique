// Tests de la v5.6 (decisions_0511e.js) : dispositif retraites V6 complet compté dans le taux, année par année. Depuis ce dossier, avec jsc :
//   LIST=(la liste ci-dessous) ; /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre de chargement : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js test_decisions_0511e.js
// (attention : ../retraites/modele.js et modele.js sont deux fichiers différents ; l'un exporte Retraites, l'autre SystemeIdeal)
var E = this.Decisions0511e, D = this.Decisions0511d, C = this.Decisions0511c, Z = this.Optimum, ST = this.Stress, P1 = this.Palier1, TP = this.TaxePatrimoine, A = this.AgeLibre;
var log = (typeof print === 'function') ? print : console.log;
var n = 0, SC = ['bas', 'central', 'haut'], REFV = [0, 1, 2];
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var avantErosion = TP.PARAM.central.erosionTop;
// 1. Le dispositif V6 tel que chiffré par modeles/retraites : mêmes valeurs que Optimum.RETRAITES_V6 (arrondies au dixième) à 2030, 2040 et 2060
SC.forEach(function (sc, k) {
  [[2030, 'm2030'], [2040, 'm2040'], [2060, 'm2060']].forEach(function (p) {
    proche(E.v6Brut(sc, p[0]), Z.RETRAITES_V6.complet[p[1]][k], 0.051, 'V6 brut ' + p[0] + ' (' + sc + ') = valeur branchée dans optimum.js');
  });
});
proche(E.v6Brut('central', 2030), -20.8, 0.05, 'central 2030 : −20,8'); proche(E.v6Brut('central', 2040), -5.9, 0.05, 'central 2040 : −5,9'); proche(E.v6Brut('central', 2060), 20.1, 0.05, 'central 2060 : +20,1');
ok(E.v6Brut('central', 2028) === 0 && E.v6Net('central', 2028) === 0, 'aucun effet avant la première année du modèle (2029)');
ok(Math.abs(E.v6Brut('central', 2035) - Z.retraitesV6Annee('complet', 1, 2035)) > 0.3 && Math.abs(E.v6Brut('central', 2035) - Z.retraitesV6Annee('complet', 1, 2035)) < 3, 'l\'année par année diffère de l\'interpolation de optimum.js en 2035 (écart entre 0,3 et 3 Md€)');
// 2. Pas de double compte : contribution des hautes pensions
proche(E.hautesPensionsV6(), 6.6086, 0.001, 'contribution des hautes pensions du V6 : 6,61 Md€ (pension seule, retraités résidents)');
proche(E.hautesPensionsV55('central'), 11.9683, 0.001, 'contribution des hautes pensions déjà dans la v5.5 (N03) : 11,97 Md€');
ok(E.hautesPensionsV55('central') > E.hautesPensionsV6(), 'celle de la v5.5 est plus large (capital compris) : le V6 est un sous-ensemble, on retire 6,61 en entier');
SC.forEach(function (sc) { var y = 2040; proche(E.v6Net(sc, y), E.v6Brut(sc, y) - E.hautesPensionsV6() - E.plancher(sc, y), 1e-12, 'net = brut − hautes pensions − plancher (' + sc + ')'); });
// 3. Plancher de 1 300 €
proche(E.plancherRegime('bas'), 2.72, 0.01, 'plancher de 1 300 € en régime, favorable : 2,7'); proche(E.plancherRegime('central'), 4.76, 0.01, 'plancher en régime, central : 4,8'); proche(E.plancherRegime('haut'), 6.80, 0.01, 'plancher en régime, défavorable : 6,8');
ok(E.monteePlancher(2029) < E.monteePlancher(2040) && E.monteePlancher(2040) < E.monteePlancher(2060) && E.monteePlancher(2070) <= 1, 'montée en charge du plancher croissante, au plus 1');
ok(E.plancher('central', 2027) === 0 && E.plancher('central', 2060) < E.plancherRegime('central'), 'plancher nul avant le dispositif, inférieur au régime en 2060 (95 %)');
// 4. Composantes
[2029, 2030, 2040, 2060, 2070].forEach(function (y) {
  var c = E.composantes('central', y);
  proche(c.net, E.v6Net('central', y), 1e-9, 'composantes : somme = net (' + y + ')');
  proche(c.ageReference + c.ageLibre + c.penibilite + c.indexation + c.substitution + c.hautesPensions, c.brut, 1e-9, 'composantes : brut = somme + hautes pensions (' + y + ')');
});
// 5. Solde et taux d'équilibre
SC.forEach(function (sc) { proche(E.solde(sc, 2040), D.solde(sc) + E.v6Net(sc, 2040), 1e-12, 'solde v5.6 = solde v5.5 + effet net (' + sc + ', 2040)'); });
proche(E.solde('central', 2028), D.solde('central'), 1e-12, 'avant 2029, solde v5.6 = solde v5.5'); proche(D.solde('central'), 4.9086, 0.001, 'solde v5.5 : +4,91');
ok(E.solde('central', 2029) < 0 && E.solde('central', 2060) > D.solde('central'), 'le dispositif coûte en 2029 et rapporte en 2060 par rapport à la v5.5 (net, hautes pensions et plancher compris)');
proche(E.tauxPourSolde(0), D.tauxEquilibreFin(), 0.00005, 'grille : taux d\'équilibre v5.5 = 41,54 %');
[2029, 2030, 2035, 2040, 2050, 2060, 2070].forEach(function (y) {
  var t = E.tauxEquilibre(y); proche(D.solde('central', 0, t) + E.v6Net('central', y), 0, 0.001, 'taux d\'équilibre ' + y + ' : solde ≈ 0 à ce taux (' + Math.round(t * 10000) / 100 + ' %)');
});
var tr = E.trajectoire();
ok(tr.length === 42 && tr[0].an === 2029 && tr[41].an === 2070, 'trajectoire : 42 années, de 2029 à 2070');
ok(E.JALONS.join() === '2030,2035,2040,2050,2060', 'jalons 2030, 2035, 2040, 2050, 2060');
ok(tr[0].taux > tr[10].taux && tr[10].taux > tr[21].taux && tr[21].taux > tr[41].taux, 'le taux d\'équilibre baisse tout au long de la trajectoire (2029 > 2039 > 2050 > 2070)');
var cr = E.croisiere(), cx = E.creux(), c70 = E.croisiere(2070);
ok(cr.an === 2060 && cr.taux < D.tauxEquilibreFin() && c70.taux < cr.taux, 'taux de croisière (2060) sous celui de la v5.5, et plus bas encore en 2070');
ok(cx.an === 2029 && cx.taux > 0.43 && cx.taux < 0.46, 'taux maximal pendant le creux : première année, entre 43 et 46 %');
proche(cx.taux, Math.max.apply(null, tr.map(function (r) { return r.taux; })), 1e-12, 'le taux maximal est le maximum de la trajectoire');
// 6. Lissage du creux
var l42 = E.lissage();
ok(l42.marge > 4.9 && l42.manqueMax > l42.marge, 'la marge de 42 % (+4,9) ne suffit pas : le manque maximal est plus grand');
ok(l42.anneesDeficit >= 15 && l42.anneesDeficit <= 25 && l42.premiere === 2029, 'le déficit dure de 15 à 25 ans, à partir de 2029');
proche(l42.pointsManquants, l42.manqueMax / E.pointDeTaux(), 1e-9, 'points manquants = manque maximal / valeur d\'un point'); proche(E.pointDeTaux(), 10.4, 0.1, 'un point de taux vaut 10,4 Md€');
ok(l42.manqueCumule > 100 && l42.cumulSurPeriode > 0 && l42.anneeRetourDuCumul > l42.derniere, 'manque cumulé > 100 Md€ ; il est remboursé par la suite, mais après la fin du déficit annuel');
var l44 = E.lissage(0.44), l443 = E.lissage(Math.ceil(cx.taux * 1000) / 1000);
ok(l44.anneesDeficit < l42.anneesDeficit && l44.manqueMax < l42.manqueMax && l443.anneesDeficit === 0, 'à 44 % le déficit est plus court et plus faible ; au taux maximal arrondi il disparaît');
var tl = E.tauxLisse(2029, 2060); var cum = 0, y; for (y = 2029; y <= 2060; y++) cum += E.solde('central', y, tl);
ok(Math.abs(cum) < 0.5 && tl > cr.taux && tl < cx.taux, 'taux de lissage 2029-2060 : somme des soldes nulle, entre le taux de croisière et le taux maximal');
// 7. S04 et S05 : non comptés, réserve plafonnée
ok(E.reserveS04S05(2029) === 0 && E.reserveS04S05(2038) === 0 && E.reserveS04S05(2060) > 0 && E.reserveS04S05(2070) === E.HYP.s04 + E.HYP.s05, 'S04 + S05 : 0 avant 10 ans, pleine charge (2,45) à 35 ans');
proche(E.reserveS04S05(2070), 2.45, 1e-9, 'S04 + S05 = 0,45 + 2,0'); ok(E.reserveS04S05(2060) < 2.45, 'réserve S04-S05 inférieure au plafond en 2060');
proche(E.solde('central', 2060), D.solde('central') + E.v6Net('central', 2060), 1e-12, 'le solde ne contient ni S04 ni S05 (non comptés)');
// 8. Dette
SC.forEach(function (sc) {
  var ref = ST.test('V5', sc, { ajust: E.ajustementV55(0.42) }).ratio10, mine = E.dette(sc, { n: 10, gel: false }).ratio[9];
  proche(mine, ref, 1e-9, 'la récurrence prolongée reproduit stress.js à 10 ans sans V6 (' + sc + ')');
});
proche(E.ajustementV55(0.42)('central', 40) + Z.solde(Z.archi(Z.ARCHITECTURE_V5), 'central'), D.solde('central'), 1e-6, 'écart de chemin + solde de la v5 = solde de la v5.5 (année 40, sans report ni capital)');
var s0 = E.jalonsDette('central'), s1 = E.jalonsDette('central', { v6: 'net' }), sb = E.jalonsDette('central', { v6: 'brut' }), sg = E.jalonsDette('central', { gel: false }), sn = E.jalonsDette('central', { valeur: 'aucune' });
ok(s0.serie.length === 42, 'dette calculée sur 42 années (2029-2070)');
ok(s1.r10 > s0.r10 && s1.r20 > s0.r20 && s1.r30 > s0.r30, 'avec V6 (net), la dette est plus élevée à 10, 20 et 30 ans');
ok(s1.r10 - s0.r10 > 5 / 100 && s1.r10 - s0.r10 < 12 / 100, 'surcroît de dette à 10 ans entre 5 et 12 points de PIB');
ok(sb.r10 < s1.r10 && sb.r30 < s1.r30, 'la lecture brute (hautes pensions comptées deux fois, sans plancher) donne une dette plus faible : le net est plus prudent');
ok(sg.r30 < s0.r30 && sn.r30 > s0.r30, 'valeur extrapolée : dette plus basse à 30 ans ; sans création de valeur : plus haute');
proche(s0.r10, sg.r10, 1e-12, 'avant l\'année 10, le gel de la création de valeur ne change rien');
SC.forEach(function (sc) { var a = E.jalonsDette(sc, { v6: 'net' }), b = E.jalonsDette(sc); ok(a.r10 > b.r10, 'avec V6, dette à 10 ans plus élevée (' + sc + ')'); });
ok(E.jalonsDette('bas').r10 < s0.r10 && s0.r10 < E.jalonsDette('haut').r10, 'dette à 10 ans : bas < central < haut');
// 9. Levier D : effet chiffré, palier1.js non modifié
var dc = E.jalonsDette('central', { v6: 'net', levierD: 'corrige' });
ok(P1.VAL.D.central[0] === 15 && P1.VAL.D.bas[0] === 3.5 && P1.VAL.D.haut[0] === 33, 'palier1.js n\'est pas modifié (levier D : 3,5 / 15 / 33)');
ok(dc.r10 > s1.r10 && dc.r30 > s1.r30 && dc.r30 - s1.r30 > dc.r10 - s1.r10, 'levier D corrigé : dette plus haute, écart croissant avec l\'horizon');
proche(E.valeur('central', 10) - E.valeur('central', 10, { levierD: 'corrige' }), 6.405 - 4.1, 0.01, 'levier D corrigé : −2,3 Md€ de recettes par an en plein régime (6,4 → 4,1)');
proche(E.valeur('bas', 10) - E.valeur('bas', 10, { levierD: 'corrige' }), 14.091 - 8.4, 0.01, 'levier D corrigé, favorable : 14,1 → 8,4');
proche(E.solde('central', 2060), D.solde('central') + E.v6Net('central', 2060), 1e-12, 'le levier D n\'est pas dans le solde de croisière');
ok(TP.PARAM.central.erosionTop === avantErosion, 'les paramètres d\'exil sont restaurés (aucun effet de bord)');
log('Tests v5.6 : ' + n + ' contrôles passés.');
