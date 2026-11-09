// Tests de demographie.js. Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js trajectoires_demo.js demographie.js test_demographie.js
var M = this.SystemeIdeal, P1 = this.Palier1, DG = this.DemographieSI, T = this.TrajectoiresDemo, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var st = P1.palier1().st, SC = ['bas', 'central', 'haut'];

// Données embarquées
ok(T.scenarios.central.annees.length === 46 && T.scenarios.central.annees[0][0] === 2025 && T.scenarios.central.annees[45][0] === 2070, 'trajectoires : 46 années, 2025 à 2070');
proche(T.scenarios.central.annees[0][T.colonnes.indexOf('p65plus')], 15038010, 1, 'central 2025 : 15 038 010 personnes de 65 ans et plus (trajectoires.csv)');
proche(T.scenarios.central.annees[40][T.colonnes.indexOf('p20_64')], 34157740, 1, 'central 2065 : 34 157 740 personnes de 20-64 ans (trajectoires.csv)');
ok(T.scenarios.haut.scenario_insee === 'population_agee' && T.scenarios.bas.scenario_insee === 'population_jeune', 'appariement : haut = population âgée, bas = population jeune');

// 2025 = point de départ : le solde est exactement celui du palier 1
SC.forEach(function (sc) {
  var s = DG.solde(st, sc, 2025);
  proche(s.solde, P1.solde(st, sc), 1e-9, 'année 2025 ' + sc + ' : solde = solde du palier 1');
  proche(s.variationTotale, 0, 1e-9, 'année 2025 ' + sc + ' : aucune variation');
  proche(DG.socleFinancable(st, sc, 2025), st.socle, 1e-9, 'année 2025 ' + sc + ' : socle finançable = socle de départ');
});
proche(P1.solde(st, 'central'), -163.051, 0.1, 'palier 1 central, jeu de capital recalé partout (H176) : −163 Md€ (−167 avant)'); // 04/11/2026 : ancienne valeur -163.3, recalée après les corrections de données V12400-V12404

// Calcul à la main : assiette, pensions
var L = DG.lignes2025(st, 'central'), v = DG.volumes('central', 2045), s45 = DG.solde(st, 'central', 2045);
proche(s45.variations.assiette, L.assiette * (v.idx.emploi - 1), 1e-9, 'assiette 2045 = recettes courantes × (indice d\'emploi − 1)');
proche(s45.variations.pensions, -392.5 * (v.idx.retraites - 1), 1e-9, 'pensions 2045 = −392,5 Md€ × (indice des retraités − 1)');
proche(v.idx.retraites, 20.58 / 17.4, 0.01, 'retraités 2045 : 20,6 M contre 17,4 M (COR calé), indice 1,18');
proche(L.socle, 232.356, 0.01, 'socle des adultes non retraités 2025 : 232,4 Md€ (38,7 M × 500 € × 12)');
var somme = 0; for (var k in s45.variations) somme += s45.variations[k];
proche(somme, s45.variationTotale, 1e-9, 'la somme des lignes = la variation totale');
proche(s45.solde, s45.base + s45.variationTotale, 1e-9, 'solde = base + variation (sans création de valeur)');

// Sens des effets
ok(DG.volumes('central', 2065).retraites > DG.volumes('central', 2025).retraites, 'plus de retraités en 2065 qu\'en 2025');
ok(DG.volumes('central', 2065).emploi < DG.volumes('central', 2025).emploi, 'moins d\'emploi en 2065 (central)');
ok(DG.volumes('haut', 2065).adultesNonRetraites < DG.volumes('bas', 2065).adultesNonRetraites, 'population âgée : moins d\'adultes non retraités que population jeune en 2065');
[2035, 2045, 2065].forEach(function (a) {
  var b = DG.solde(st, 'bas', a), c = DG.solde(st, 'central', a), h = DG.solde(st, 'haut', a);
  ok(b.solde > c.solde && c.solde > h.solde, 'ordre bas > central > haut en ' + a);
});
ok(DG.solde(st, 'central', 2065).solde < DG.solde(st, 'central', 2025).solde - 50, 'central 2065 : solde plus mauvais de plus de 50 Md€ qu\'en 2025 à taux constant');
ok(DG.socleFinancable(st, 'central', 2065) < DG.socleFinancable(st, 'central', 2035), 'socle finançable central décroissant de 2035 à 2065 en statique');
ok(DG.socleFinancable(st, 'haut', 2065) >= 0, 'socle finançable jamais négatif');

// Productivité et indexation
var g0 = DG.solde(st, 'central', 2045), g1 = DG.solde(st, 'central', 2045, { g: 0.01 }), g2 = DG.solde(st, 'central', 2045, { g: 0.01, pensions: 'salaires' });
ok(g1.solde > g0.solde, 'productivité 1 % : solde meilleur');
ok(g2.solde < g1.solde, 'pensions indexées sur les salaires : solde moins bon qu\'avec indexation sur les prix');
proche(g1.variations.assiette, L.assiette * (v.idx.emploi * Math.pow(1.01, 20) - 1), 1e-9, 'assiette avec g : emploi × (1,01)^20');
var gv = DG.solde(st, 'central', 2035, { valeur: true });
proche(gv.valeur, P1.valeurPourScenario(9, 'central').total, 1e-9, 'création de valeur 2035 = année 9 (2027 = 1)');
ok(gv.solde > DG.solde(st, 'central', 2035).solde, 'création de valeur : solde meilleur');

// Pureté, bornes
var avant = JSON.stringify(st), t1 = DG.resume(st), t2 = DG.resume(st);
ok(JSON.stringify(t1) === JSON.stringify(t2) && JSON.stringify(st) === avant, 'fonctions pures : mêmes résultats, entrée inchangée');
ok(t1.central.length === 3 && t1.central[2].annee === 2065, 'résumé : 3 années (2035, 2045, 2065)');
var err = false; try { DG.solde(st, 'central', 2080); } catch (e) { err = true; }
ok(err, 'année hors trajectoire : erreur explicite');
err = false; try { DG.solde(st, 'inconnu', 2040); } catch (e) { err = true; }
ok(err, 'scénario inconnu : erreur explicite');
log('\n' + n + ' contrôles passés');
