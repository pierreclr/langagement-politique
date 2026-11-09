// Tests du modèle bâtisseurs et repas. Lancer depuis modeles/batisseurs-et-repas/ :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc modele.js test_modele.js
var M = this.BatisseursRepas || (typeof require !== 'undefined' ? require('./modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol) { return Math.abs(a - b) <= tol; }
var D = M.D;

// 1. Données
var somme = 0; for (var c in D.partsClasses) somme += D.partsClasses[c];
ok(proche(somme, 1, 0.002), 'parts des classes DPE : somme = 1 (arrondis SDES)');
ok(proche(M.logementsCibles('FG'), 3.92e6, 0.02e6), 'F + G = 12,7 % de 30,9 M ≈ 3,9 M (SDES : 3,9 M)');
ok(proche(M.logementsCibles('EFG') - M.logementsCibles('FG'), 5.5e6, 0.05e6), 'classe E ≈ 5,5 M');

// 2. Bâtisseurs
ok(M.renovationsParAn(3.9e6, 10) === 390000, 'rénovations par an = stock / horizon');
var b = M.besoinsRenovation('central');
ok(b.length === 6 && b[0].renovAn > b[1].renovAn && b[1].renovAn > b[2].renovAn, 'besoin annuel décroissant avec l\'horizon');
ok(b.every(function (x) { return x.manque >= 0 && x.formesParAn >= 0; }), 'manque et formés positifs');
ok(proche(b[0].etpActuels, 91900 * 0.35, 1), 'ETP actuels = rythme 2024 × ETP par rénovation');
var cf = M.coutFormationBatisseur('central');
ok(proche(cf.brut, cf.parAn * 1.5, 1e-6), 'coût brut = coût annuel × durée');
ok(cf.net === cf.brut - cf.valeurTravaux, 'coût net = brut − valeur des travaux');
ok(M.coutFormationBatisseur('favorable').brut < cf.brut && cf.brut < M.coutFormationBatisseur('defavorable').brut, 'coût de formation ordonné par scénario');
ok(proche(M.stockProfessionnels(1, 10, 'central'), 0.6 * (1 - Math.pow(0.92, 8)) / 0.08, 1e-9), 'stock = somme géométrique des cohortes maintenues');
var N = M.formesParAnPourCombler(10000, 10, 'central');
ok(proche(M.stockProfessionnels(N, 10, 'central'), 10000, 1e-6), 'formés par an : réciproque du stock');
var pb = M.programmeBatisseurs(10000, 'central');
ok(proche(pb.coutBrutAn, 10000 * cf.brut, 1e-3) && proche(pb.stagiairesEnFormation, 15000, 1e-9), 'programme : coût et effectif en formation');
ok(pb.economieParRenovAn > 0 && pb.economieParRenovAn < 17.1 * 1000 * 0.15, 'économie réelle < économie conventionnelle');

// 3. Agriculture
var ca = M.coutInstallationAgricole('central');
ok(proche(ca.parInstalle * 0.6, ca.parForme, 1e-6), 'coût par installé = coût par formé / taux d\'installation');
ok(M.programmeAgricole(0, 'central').ecartDepartsInstallations === 21000 - 12661, 'écart départs − installations');

// 4. Repas
ok(proche(M.annuite(1000, 0, 10), 100, 1e-12) && M.annuite(1000, 0.03, 10) > 100, 'annuité');
var r = M.coutRevientRepas(3000, 'central');
var sp = 0; for (var k in r.postes) sp += r.postes[k];
ok(proche(r.coutHT, sp * 1.08, 1e-9), 'coût HT = somme des postes + frais généraux');
ok(proche(r.prixTTC, (r.coutHT - r.aideAuPosteParRepas) * 1.1, 1e-9), 'prix TTC = (coût − aide au poste) × 1,10');
ok(M.coutRevientRepas(3000, 'central', { tva: 0.055 }).prixTTC < r.prixTTC, 'TVA à 5,5 % moins chère');
ok(M.coutRevientRepas(500, 'central').coutHT > M.coutRevientRepas(3000, 'central').coutHT, 'économies d\'échelle');
var cm = M.capaciteMinPourPrix(8, 'central');
ok(cm !== null && M.coutRevientRepas(cm, 'central').prixTTC <= 8 && M.coutRevientRepas(cm - 50, 'central').prixTTC > 8, 'capacité minimale pour 8 € TTC');
var cp = M.coutPublicRepas(100, 3000, 'central');
ok(proche(cp.netAvecTva, cp.aideAuPoste - cp.rsaEvite - cp.tvaCollectee, 1e-3), 'coût public net = aide − RSA évité − TVA');
ok(proche(cp.aideAuPoste / cp.repasAn, r.aideAuPosteParRepas, 1e-9), 'aide au poste par repas cohérente');
var cmp = M.comparaisonRepas('central');
ok(proche(cmp.crous1, 6.89, 1e-9) && proche(cmp.crous330, 4.59, 1e-9), 'Crous : 7,89 − 1 et 7,89 − 3,30');
log(n + ' contrôles réussis');
