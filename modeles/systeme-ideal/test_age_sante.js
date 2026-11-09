// Tests de age_sante.js. Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js test_age_sante.js
var M = this.SystemeIdeal, P1 = this.Palier1, DG = this.DemographieSI, TA = this.TrajectoiresAge, AS = this.AgeSante;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var st = P1.palier1().st, SC = ['bas', 'central', 'haut'], AN = [2035, 2045, 2065];
function somme(a, i, j) { var s = 0; for (var x = i; x <= j; x++) s += a[x]; return s; }

// Données embarquées et cohérence avec demographie.js (même moteur, même jeu Insee 2026)
SC.forEach(function (sc) {
  ok(TA.scenarios[sc].pop.length === 46 && TA.scenarios[sc].pop[0].length === 101 && TA.scenarios[sc].e65.length === 46, 'trajectoires_age ' + sc + ' : 46 années, 101 âges, e65 par année');
  [2025, 2045, 2065].forEach(function (a) {
    var p = AS.pop(sc, a), v = DG.volumes(sc, a);
    proche(somme(p, 0, 19), v.moins20, 100, sc + ' ' + a + ' : moins de 20 ans identique à trajectoires_demo.js');
    proche(somme(p, 20, 100), v.p20_64 + (DG.ligne(sc, a)[3]), 100, sc + ' ' + a + ' : 20 ans et plus identique (20-64 + 65 et plus)');
  });
});
proche(somme(AS.pop('central', 2025), 80, 100), 4209610, 5, '80 ans et plus en 2025 : 4 209 610 (trajectoires.csv, Insee 2026)');
proche(AS.e65('central', 2025), 22.21, 0.05, 'espérance de vie à 65 ans en 2025 : 22,2 ans (moyenne hommes-femmes ; CNSA : 23,6 femmes et 19,8 hommes en 2023)');
ok(AS.e65('haut', 2065) > AS.e65('central', 2065) && AS.e65('central', 2065) > AS.e65('bas', 2065), 'espérance de vie à 65 ans : haut (population âgée) > central > bas');

// Profil de santé : monotone avec l'âge, calage sur DREES 2023
var C = AS.DONNEES.classes, tot = 0, pers = 0, amo = 0;
C.forEach(function (c) { pers += c[4]; amo += c[2] * c[4]; });
proche(pers, AS.DONNEES.ensemble.personnes, 5, 'DREES 2023 : la somme des classes d\'âge = 68 454 594 personnes');
proche(amo / pers, AS.DONNEES.ensemble.amo, 3, 'DREES 2023 : remboursement moyen reconstitué = 2 496 € par personne (±3 € : arrondis)');
ok(C[8][2] / C[0][2] > 8 && C[8][2] / C[0][2] < 9, 'DREES 2023 : un 80 ans et plus coûte 8,5 fois un enfant de moins de 11 ans à l\'assurance maladie (7 858 € contre 925 €)');
ok(AS.profilSante(80) > AS.profilSante(60) && AS.profilSante(60) > AS.profilSante(40), 'profil de santé croissant avec l\'âge après 40 ans');
ok(AS.profilSante(100) === AS.profilSante(90), 'profil de santé constant au-delà de la dernière classe (plateau)');
proche(AS.profilDependance(89), 39.5, 1e-9, 'taux de dépendance France 85 ans et plus : 39,5 % (Ageing Report 2024, table I.AIII.4)');
proche(AS.profilDependance(79.5), 23.3, 1e-9, 'taux de dépendance France 75-84 ans : 23,3 %');
// reconstitution du total 2025 par le profil : proche de 2 496 € × 68,85 M
var p25 = AS.pop('central', 2025), recon = 0;
for (var x = 0; x < 101; x++) recon += AS.profilSante(x) * p25[x];
proche(recon / 1e9, AS.DONNEES.ensemble.amo * somme(p25, 0, 100) / 1e9, 2.5, 'profil interpolé × population 2025 = remboursements DREES rapportés à la population Insee, en Md€ (±2,5 : interpolation)');

// 2025 = point de départ : indices à 1, aucun effet
SC.forEach(function (sc) {
  var i = AS.indices(sc, 2025);
  proche(i.sante, 1, 1e-12, sc + ' 2025 : indice de santé = 1');
  proche(i.dependance, 1, 1e-12, sc + ' 2025 : indice de dépendance = 1');
  proche(AS.depenses(sc, 2025).variation, 0, 1e-9, sc + ' 2025 : aucune variation de dépense');
  proche(AS.solde(st, sc, 2025).avec, P1.solde(st, sc), 1e-9, sc + ' 2025 : solde avec santé = solde du palier 1');
});

// Calcul à la main : sans décalage (part = 0), indice = Σ profil × pop(t) / Σ profil × pop(2025)
var p45 = AS.pop('central', 2045), num = 0, den = 0, num2 = 0, den2 = 0;
for (x = 0; x < 101; x++) { num += AS.profilSante(x) * p45[x]; den += AS.profilSante(x) * p25[x]; num2 += AS.profilDependance(x) * p45[x]; den2 += AS.profilDependance(x) * p25[x]; }
proche(AS.indices('central', 2045, { part: 0 }).sante, num / den, 1e-12, 'indice de santé 2045 sans décalage = calcul à la main');
proche(AS.indices('central', 2045, { part: 0 }).dependance, num2 / den2, 1e-12, 'indice de dépendance 2045 sans décalage = calcul à la main');
proche(AS.depenses('central', 2045, { part: 0 }).varSante, 201.64 * (num / den - 1), 1e-9, 'variation de santé 2045 = 201,64 Md€ × (indice − 1)');
proche(AS.DONNEES.ltcPibPct2025 / 100 * AS.DONNEES.pib2025, 55.77, 0.01, 'dépendance 2025 : 1,9 % de 2 935 Md€ = 55,8 Md€');

// Décalage : « bonne santé »
proche(AS.decalage('central', 2065), 0.5 * (AS.e65('central', 2065) - AS.e65('central', 2025)), 1e-12, 'décalage central = la moitié du gain d\'espérance de vie à 65 ans (Ageing Report 2024)');
ok(AS.decalage('central', 2065) > 1.5 && AS.decalage('central', 2065) < 2, 'décalage central 2065 : environ 1,7 an');
proche(AS.decalage('haut', 2065), 0, 1e-12, 'scénario haut : aucun décalage (pas de bonne santé)');
AN.forEach(function (a) {
  var d0 = AS.depenses('central', a, { part: 0 }), d5 = AS.depenses('central', a), d1 = AS.depenses('central', a, { part: 1 });
  ok(d0.variation > d5.variation && d5.variation > d1.variation, 'central ' + a + ' : plus la part de bonne santé est grande, plus la dépense est faible (' + d0.variation.toFixed(1) + ' > ' + d5.variation.toFixed(1) + ' > ' + d1.variation.toFixed(1) + ')');
});
ok(AS.depenses('central', 2065, { part: 1 }).indices.sante < AS.depenses('central', 2045, { part: 1 }).indices.sante, 'part 1 : l\'indice de santé 2065 est plus bas que celui de 2045 (le décalage rattrape le vieillissement)');

// Sens et ordres de grandeur
AN.forEach(function (a) {
  var c = AS.depenses('central', a);
  ok(c.varSante > 0 && c.varDependance > 0, 'central ' + a + ' : la santé et la dépendance coûtent plus qu\'en 2025');
  ok(c.varSante > c.varDependance, 'central ' + a + ' : la santé pèse plus que la dépendance en variation absolue');
  ok(AS.depenses('haut', a).indices.dependance > AS.depenses('bas', a).indices.dependance, 'haut ' + a + ' : indice de dépendance supérieur au bas');
  ok(AS.depenses('haut', a).variation > AS.depenses('central', a).variation, 'haut ' + a + ' : variation supérieure au central');
});
ok(AS.depenses('central', 2065).variation > 30 && AS.depenses('central', 2065).variation < 45, 'central 2065 : variation de 30 à 45 Md€ (obtenu ' + AS.depenses('central', 2065).variation.toFixed(1) + ')');
ok(AS.depenses('haut', 2065).variation > 45 && AS.depenses('haut', 2065).variation < 60, 'haut 2065 : variation de 45 à 60 Md€ (obtenu ' + AS.depenses('haut', 2065).variation.toFixed(1) + ')');
proche(AS.depenses('central', 2065, { baseDependance: 29.5 }).varDependance / AS.depenses('central', 2065).varDependance, 29.5 / (0.019 * 2935), 1e-9, 'dépendance au périmètre CNSA : proportionnelle au niveau de départ');

// Solde et socle finançable
AN.forEach(function (a) {
  SC.forEach(function (sc) {
    var s = AS.solde(st, sc, a), d = DG.solde(st, sc, a);
    proche(s.sans, d.solde, 1e-9, sc + ' ' + a + ' : solde « sans » = demographie.solde (§ 17 intact)');
    proche(s.avec, s.sans - AS.depenses(sc, a).variation, 1e-9, sc + ' ' + a + ' : solde avec = solde sans − variation de dépense');
    ok(s.avec < s.sans, sc + ' ' + a + ' : la dépense liée à l\'âge dégrade le solde');
    ok(AS.socleFinancable(st, sc, a) <= DG.socleFinancable(st, sc, a) + 1e-9, sc + ' ' + a + ' : le socle finançable avec santé ne dépasse pas celui sans santé');
  });
});
proche(AS.solde(st, 'central', 2035).avec, -192.5, 1, 'central 2035 : solde −192 Md€ (−170 − 22 ; recalage H176 : −196 avant)');
proche(AS.socleFinancable(st, 'central', 2065), 181, 2, 'central 2065 : socle finançable 181 € (186 avant le recalage H176)');
ok(AS.socleFinancable(st, 'haut', 2065) === 0, 'haut 2065 : le socle finançable tombe à 0 (plancher)');
// productivité : l'effet de santé en euros constants ne change pas (pas de productivité sur le coût), seul le solde de départ change
proche(AS.solde(st, 'central', 2045, { g: 0.01 }).effet, AS.solde(st, 'central', 2045).effet, 1e-9, 'avec productivité 1 % : même effet santé en euros constants (H160)');

// Repères Ageing Report
var ar = AS.repereAR('central', 2045);
ok(ar.sante > 1 && ar.sante < AS.indices('central', 2045).sante, 'repère AR 2045 : indice de santé plus bas que le nôtre (le profil DREES est plus raide) : ' + ar.sante.toFixed(3));
ok(AS.repereAR('central', 2025).sante === 1 && AS.repereAR('central', 2025).dependance === 1, 'repère AR 2025 = 1');
// Variante « méthode Commission » et repères corrigés (02/11/2026 : § 17.bis F, H163)
ok(AS.DONNEES.arSante.demographique[2065] === 8.9 && AS.DONNEES.arSante.demographique[2035] === 8.6, 'Ageing Report 2024, table II.1.109, France : 8,6 % (2035) et 8,9 % (2065) en scénario démographique (8,8 transcrit à tort avant)');
ok(AS.DONNEES.arLtc.pasBonneSante[2035] === 2.2 && AS.DONNEES.arLtc.pasBonneSante[2065] === 2.7 && AS.DONNEES.arLtc.bonneSante[2045] === 2.3, 'Ageing Report 2024, tables II.1.119 et II.1.120, France : dépendance 2,2 % (2035) et 2,7 % (2065) sans bonne santé, 2,3 % (2045) avec');
proche(AS.repereAR('central', 2065).parTete, 8.9 / 8.4, 1e-12, 'repère AR 2065 par tête : 8,9 / 8,4');
proche(AS.repereAR('central', 2030).indicePopulationEurostat, 69453 / (68050 + 3 / 8 * (69453 - 68050)), 1e-12, 'population Eurostat 2030 / 2025 (fiche France, tableau 3, interpolée)');
proche(AS.repereAR('central', 2045).sante, AS.repereAR('central', 2045).parTete * AS.indicePop('central', 2045), 1e-12, 'repère AR (population Insee) = indice par tête × indice de population');
var lc = AS.lambdaCommission();
ok(lc > 0.3 && lc < 0.5, 'aplatissement calé sur la Commission entre 0,3 et 0,5 (obtenu ' + lc.toFixed(3) + ')');
AN.forEach(function (a) {
  var d = AS.depenses('central', a), c = AS.depensesCommission('central', a), ip = AS.indicePop('central', a);
  proche(c.indices.sante, ip + lc * (d.indices.sante - ip), 1e-12, 'central ' + a + ' : indice Commission = population + lambda × (effet de structure)');
  ok(c.varSante < d.varSante, 'central ' + a + ' : la variante Commission donne moins de dépense de santé que le profil DREES (' + c.varSante.toFixed(1) + ' < ' + d.varSante.toFixed(1) + ')');
  proche(c.varDependance, d.varDependance, 1e-12, 'central ' + a + ' : la dépendance ne change pas dans la variante');
  proche(AS.depenses('central', a, { lambda: 1 }).variation, d.variation, 1e-12, 'central ' + a + ' : lambda = 1 redonne le profil DREES');
  proche(AS.indices('central', a, { lambda: 0 }).sante, ip, 1e-12, 'central ' + a + ' : lambda = 0 : seule la population compte');
});
proche(AS.depensesCommission('central', 2045).varSante, 10.4, 1, 'variante Commission 2045 : +10 Md€ de santé (contre +25 au profil DREES, +16 pour le repère AR en population Eurostat)');
proche(AS.solde(st, 'central', 2045, { lambda: lc }).avec, AS.solde(st, 'central', 2045).sans - AS.depensesCommission('central', 2045).variation, 1e-9, 'solde avec variante Commission = solde sans − variation');
log(n + ' contrôles passés');
