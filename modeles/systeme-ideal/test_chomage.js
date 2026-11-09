// Tests de la rétroaction de la durée du chômage (H204 à H220 ; calculs à la main). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js test_chomage.js
var M = this.SystemeIdeal, O = this.Optimisation, P1 = this.Palier1, D = M.DONNEES, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

function pR(socle, chomage, extra) { return F(O.configR(F(P1.BASE, { socle: socle, chomage: chomage, tPlat: 0.35 })), F({ scenario: 'central' }, extra || {})); }

// 1. Défaut : aucun résultat existant ne change
ok(M.param({}).retroactionChomage === false, 'défaut : option désactivée');
ok(P1.OPT.retroChomage === false, 'palier 1 : option désactivée par défaut');
var p = pR(500, 'deg2');
proche(M.solde(p).delta, M.solde(F(p, { retroactionChomage: false })).delta, 1e-12, 'solde identique avec retroactionChomage absent ou false');
ok(M.solde(p).postes.retroactionChomage === null, 'poste de rétroaction nul par défaut');
proche(M.solde(F(p, { retroactionChomage: 'central', retraitesSanctuarises: false })).delta, M.solde(F(p, { retraitesSanctuarises: false })).delta, 1e-12, 'hors voie R : aucun effet (pas de complément chômage modélisé)');
var st = P1.palier1({}).st;
proche(P1.solde(st, 'central'), -163.05, 0.1, 'palier 1 central sans rétroaction inchangé : −163,05 (V11770 : 1,84 M au RSA ; −163,3 avec l\'ancien 1,9 M) Md€ (resultats.md § 13)');
proche(P1.platNecessaire(P1.stFor({})), 0.3455, 0.0005, 'taux plat exact du palier 1 inchangé : 34,55 %');

// 2. Calcul à la main, central, deg2, socle 500 € (borne atteinte)
var a = 37.1e9 / 2.62e6 / 12, x = M.retroactionChomage(p, 'central');
proche(x.allocationActuelle, a, 1e-9, 'B0 = 37,1 Md€ / 2,62 M / 12 = 1 180 €/mois');
proche(x.complementMoyen, M.coutChomage(p) * 1e9 / 2.62e6 / 12, 1e-9, 'complément moyen = coût deg2 / stock / 12');
proche(x.complementMoyen, 353, 1, 'complément moyen deg2 à 500 € ≈ 353 €/mois');
proche(x.generositeEffective, x.complementMoyen + 0.6 * 500, 1e-9, 'B1 = complément + 0,6 × 500 (H208)');
proche(x.rBrut, 0.553, 0.002, 'r brut ≈ 0,553');
proche(x.r, 0.7, 1e-12, 'r borné à 0,7 (H211)');
ok(x.horsDomaine === true, 'signalé hors du domaine observé');
proche(x.ratioStock, Math.exp(0.4 * Math.log(0.7)), 1e-12, 'stock × 0,7^(0,3 + 0,1) = 0,8670');
proche(x.stockEvite, 2.62e6 * (1 - Math.pow(0.7, 0.4)), 1e-6, 'stock évité ≈ 348 000');
proche(x.stockEviteNet, 0.75 * x.stockEvite, 1e-6, 'net d\'une éviction de 25 % ≈ 261 000');
proche(x.stockEviteNet, 261265, 50, 'stock évité net ≈ 261 300 personnes');
// recette par emploi : net 1 639 € → brut 2 101 € → coin 0,320 → coût 2 410 €/mois → 28 925 €/an → 35 % + continu (30 %, R0 24 000)
var net = a / 0.72, br = net / 0.78, coin = 0.268 + (br - 1867.02) / (2240.42 - 1867.02) * (0.351 - 0.268), L = 12 * net / (1 - coin);
var imp = 0.35 * L + 0.30 * ((L - 24000) - 24000 * Math.log(L / 24000));
proche(x.recetteParEmploi, imp, 1e-6, 'recette par emploi = impôt du modèle (plat 35 % + continu) sur le coût du travail retrouvé');
proche(x.recetteParEmploi, 10257, 2, 'recette par emploi ≈ 10 257 €/an');
proche(x.recettesMd, x.stockEviteNet * imp / 1e9, 1e-9, 'recettes = stock net × recette par emploi ≈ 2,7 Md€');
proche(x.economieComplementMd, M.coutChomage(p) * (1 - Math.pow(0.7, 0.4)) * 0.75, 1e-9, 'complément non versé ≈ 1,1 Md€');
proche(x.netMd, 3.79, 0.02, 'gain net central ≈ 3,8 Md€');

// 3. Sans borne : différentiel à 500 € (r = (680 + 300) / 1 180)
var xd = M.retroactionChomage(pR(500, 'differentiel'), 'central');
proche(xd.rBrut, (Math.max(0, a - 500) + 300) / a, 1e-9, 'différentiel : r = (max(0 ; 1 180 − 500) + 0,6 × 500) / 1 180');
ok(xd.horsDomaine === false && xd.r === xd.rBrut, 'différentiel : dans le domaine, pas de borne');
proche(xd.stockEvite, 2.62e6 * (1 - Math.pow(xd.rBrut, 0.4)), 1e-6, 'différentiel : stock évité = n (1 − r^0,4)');

// 4. Symétrie : le cumul allonge le chômage et coûte
var xc = M.retroactionChomage(pR(500, 'cumul'), 'central');
ok(xc.r > 1 && xc.stockEvite < 0 && xc.netMd < 0, 'cumul : générosité accrue, chômage plus long, coût net');
proche(xc.r, (a + 300) / a, 1e-9, 'cumul : r = (1 180 + 300) / 1 180 = 1,25');
var xcb = M.retroactionChomage(pR(650, 'cumul'), 'bas');
proche(xcb.r, 1 / 0.7, 1e-12, 'cumul à 650 €, bas (λ 0,8) : r borné à 1/0,7');

// 5. Ordre des niveaux et option 'scenario'
var b = M.retroactionChomage(p, 'bas'), h = M.retroactionChomage(p, 'haut');
ok(b.netMd < x.netMd && x.netMd < h.netMd, 'bas < central < haut');
ok(b.netMd > 0, 'même en bas, la dégressivité rapporte (≈ 1,0 Md€)');
proche(M.retroactionChomage(F(p, { scenario: 'haut' }), 'scenario').netMd, h.netMd, 1e-12, '\'scenario\' suit P.scenario (haut)');
proche(M.retroactionChomage(p, true).netMd, x.netMd, 1e-12, 'true équivaut à \'scenario\'');
var perso = M.retroactionChomage(p, F(M.RETRO_CHOMAGE.central, { rPlancher: 0 }));
proche(perso.r, perso.rBrut, 1e-12, 'objet de paramètres : sans borne si rPlancher = 0');
ok(perso.netMd > x.netMd, 'sans borne, l\'effet est plus grand (extrapolation, non retenue)');
ok(M.retroactionChomage(p, 'inconnu').actif === false && M.retroactionChomage(p, 'inconnu').netMd === 0, 'niveau inconnu : aucun effet');

// 6. Intégration dans le solde du modèle et du palier 1
proche(M.solde(F(p, { retroactionChomage: 'central' })).delta - M.solde(p).delta, x.netMd, 1e-9, 'modele.solde : Δ augmente exactement du gain net');
proche(M.solde(F(p, { retroactionChomage: 'central' })).postes.retroactionChomage.netMd, x.netMd, 1e-12, 'poste exposé dans solde().postes');
proche(P1.solde(st, 'central', { retroChomage: 'central' }) - P1.solde(st, 'central'), x.netMd, 1e-9, 'palier 1 : solde central + 3,8 Md€');
proche(P1.solde(st, 'central', { retroChomage: 'central' }), -159.2644, 0.05, 'palier 1 central avec rétroaction : −159,5 Md€'); // 04/11/2026 : ancienne valeur -159.5, recalée après les corrections de données V12400-V12404
proche(P1.solde(st, 'haut', { retroChomage: 'scenario' }) - P1.solde(st, 'haut'), M.retroactionChomage(F(O.configR(st), { scenario: 'haut' }), 'haut').netMd, 1e-9, 'palier 1, scénario haut aligné : gain de la rétroaction haute');
var t1 = P1.platNecessaire(P1.stFor({}), undefined, { retroChomage: 'central' });
ok(t1 < 0.3455 && t1 > 0.340, 'taux plat nécessaire avec rétroaction centrale ≈ 34,3 % (−0,3 point)');
proche((0.3455 - t1) * 100, 3.79 / 13, 0.1, 'cohérent avec 13 Md€ par point de taux plat');
var s1 = P1.socleFinancable(st, { retroChomage: 'central' }), s0 = P1.socleFinancable(st);
proche(s1 - s0, 3.79 / P1.penteSocle(st), 1, 'socle finançable + ≈ 9 €/mois (3,8 Md€ / 0,43 Md€ par €)');

log('\n' + n + ' contrôles passés.');
