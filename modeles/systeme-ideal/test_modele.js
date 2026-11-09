// Tests de cohérence et cas types calculés à la main. Lancer depuis modeles/systeme-ideal/ :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc modele.js fiscalite_actuelle.js test_modele.js
var M = this.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// 1. Impôt continu (calculs à la main)
// R = 48 000, R0 = 24 000, t = 0,45 : 0,45 × (24 000 − 24 000 × ln 2) = 0,45 × 7 364,47 = 3 313,9
proche(M.impotContinu(48000, 0.45, 24000), 3313.9, 0.5, 'I(48 k€) = 3 313,9 €');
ok(M.impotContinu(24000, 0.45, 24000) === 0 && M.impotContinu(10000, 0.45, 24000) === 0, 'I = 0 à R0 et en dessous');
// Exemple de l'auteur (R0 = 22 400, t_max = 45 %) : 8,7 % à 50 k€, 19,8 % à 100 k€, 40,2 % à 1 M€
proche(M.impotContinu(50000, 0.45, 22400) / 50000, 0.0865, 0.0005, 'taux moyen 8,65 % à 50 k€ (exemple de l\'auteur)');
proche(M.impotContinu(100000, 0.45, 22400) / 100000, 0.1984, 0.0005, 'taux moyen 19,8 % à 100 k€');
proche(M.impotContinu(1e6, 0.45, 22400) / 1e6, 0.4016, 0.0005, 'taux moyen 40,2 % à 1 M€');
proche(M.margContinu(48000, 0.45, 24000), 0.225, 1e-9, 'taux marginal 22,5 % à 48 k€ (0,45 × (1 − 24/48))');
ok(M.margMax({ archi: 'c2', tPlat: 0.4, tMax: 0.5 }) < 1, 'c2 de référence : taux marginal total maximal 90 % < 100 %');
ok(M.impotContinu(53400, 0.45, 24000) > M.impotContinu(40000, 0.45, 24000) + M.impotContinu(13400, 0.45, 24000), 'convexe : pension + capital additionnés paient plus que séparés');

// 2. Prime d'activité
proche(M.primeMois(10, { prime: 'progressive', primeMontant: 200, primeSeuilH: 15 }), 133.33, 0.01, 'prime progressive à 10 h = 133,33 €');
ok(M.primeMois(14, { prime: 'forfait', primeMontant: 200, primeSeuilH: 15 }) === 0 && M.primeMois(15, { prime: 'forfait', primeMontant: 200, primeSeuilH: 15 }) === 200, 'forfait : 0 à 14 h, 200 € à 15 h (effet de seuil)');
proche(M.coutPrime({ prime: 'forfait', actifs15h: 29e6, primeMontant: 200, primeSeuilH: 15, salariesMoins15h: 0, heuresMoyMoins15h: 8 }), 69.6, 0.01, 'coût du forfait : 29 M × 2 400 € = 69,6 Md€');

// 3. Statique : reproduit le simulateur (≈ −196 Md€) — calcul à la main : 1 084,5 − 885,9 − (662,7 + 33,3 − 117,6 − 185,5) = −194,3
var s0 = M.solde({ reactions: false });
proche(s0.recettes.total, 1084.5, 0.1, 'recettes statiques du prélèvement unique à 50 % = 0,5 × 2 169 Md€');
proche(s0.delta, -194.3, 0.3, 'Δ solde statique du simulateur ≈ −194 Md€ (−196 dans le texte, table T13 à 1 000 €)');
proche(M.DONNEES.adultes * 100 * 12 / 1e9, 66.27, 0.01, '100 € de socle par adulte coûtent 66 Md€');
proche(M.economieRetraites(850, M.param({})), 160.1, 0.05, 'économie retraites interpolée à 850 € = 160,1 Md€');
proche(M.imputationHoldings(M.param({})), 1507.4 * 0.25 * 0.03 * 0.8, 1e-9, 'holdings imputés (central) = 1 507,4 × 25 % × 3 % × 80 % ≈ 9,0 Md€');
// t plat d'équilibre statique : (885,9 + 392,9 − 150) / 1 869 = 0,604
proche(M.equilibre({ reactions: false }, 'tPlat', 0.95).x, 0.604, 0.002, 't plat d\'équilibre statique ≈ 60,4 % (1 128,8 / 1 869)');
// avec rétroactions, il faut un taux plus élevé
var eqR = M.equilibre({}, 'tPlat', 0.99);
ok(!eqR.existe || eqR.x > 0.604, 'avec rétroactions, le taux plat d\'équilibre est plus élevé (ou n\'existe pas : sommet de la courbe de Laffer)');
// Transition : 6,5 Md€ + 147 000 × 25 k€ × 1 an = 10,175 Md€, sur 10 ans
proche(M.coutTransition({ transition: true, scenario: 'central' }).annualise, 1.0175, 1e-6, 'transition annualisée = (6,5 + 3,675) / 10');

// 4. Constat : l'impôt continu seul ne finance pas le système sous un taux marginal < 100 %
var e1 = M.equilibre({ archi: 'c1', socle: 1000 }, 'tMax', 0.95);
ok(e1.existe === false, 'c1 seul : aucun t_max ≤ 95 % n\'équilibre le système (constat)');
ok(M.solde({ archi: 'c1', tMax: 0.9, reactions: false }).delta > M.solde({ archi: 'c1', tMax: 0.6, reactions: false }).delta, 'statique : plus de t_max, plus de recettes');
M.solde({ archi: 'c2', tPlat: 0.4, tMax: 0.5 }).parBande.forEach(function (b) { if (b.tauxMarginal >= 1) throw new Error('taux marginal ≥ 100 % en ' + b.id); });
ok(true, 'aucune bande ne dépasse 100 % de taux marginal en c2 de référence');

// 5. Cas types calculés à la main
var C2 = { socle: 800, prime: 'progressive', archi: 'c2', tPlat: 0.4, tMax: 0.5 };
var smic35c1 = M.situation(M.CAS[1], { socle: 1000, archi: 'c1', tMax: 0.45 });
proche(smic35c1.apresMois, 2987.76, 0.01, 'smicard 35 h, c1 : R = 23 853 € < 24 000 € → aucun impôt : 1 000 + 1 987,76 = 2 987,76 €');
var smic15 = M.situation(M.CAS[0], C2);
// 15 h : coût 13,1058 €/h × 15 × 52 = 10 223,5 €/an ; impôt 40 % = 4 089,4 ; prime 200 ; net = 800 + 200 + (10 223,5 − 4 089,4)/12 = 1 511,2
proche(smic15.apresMois, 1511.2, 0.3, 'smicard 15 h (800 + prime 200 + 60 % du coût) = 1 511,2 €');
var smic35 = M.situation(M.CAS[1], C2);
// 35 h : 1 987,76 − 40 % = 1 192,66 ; + 800 + 200 = 2 192,66
proche(smic35.apresMois, 2192.66, 0.05, 'smicard 35 h en c2 = 800 + 200 + 1 192,66 = 2 192,66 €');
var ra = M.situation(M.CAS[4], { socle: 1000, archi: 'c1', tMax: 0.45, imposerComplements: true });
// R = 12 × 3 000 + 15 000 = 51 000 (complément = 4 000 − 1 000) ; I = 0,45 × (27 000 − 24 000 ln 2,125) = 0,45 × (27 000 − 24 000 × 0,75377 = 18 090,5) = 4 009,3
proche(ra.impotAn, 4009.3, 1.0, 'retraité aisé : l\'impôt continu porte sur pension (complément) + capital ensemble : 4 009 €');
var r62 = M.situation(M.CAS[6], { archi: 'c2', tPlat: 0.4, tMax: 0.5, socle: 800, retraite60: true, exoSeniors: 1, imposerComplements: true });
var r62n = M.situation(M.CAS[6], { archi: 'c2', tPlat: 0.4, tMax: 0.5, socle: 800, retraite60: false, imposerComplements: true });
ok(r62.impotAn < r62n.impotAn - 1000, 'retraité de 62 ans à mi-temps : l\'exonération supprime l\'impôt sur son salaire');
var s39 = M.situation(M.CAS[7], { archi: 'plat', tPlat: 0.4, socle: 800, hsExo: 1 });
var s39n = M.situation(M.CAS[7], { archi: 'plat', tPlat: 0.4, socle: 800, hsExo: 0 });
// base 35 h : 24,24 × 35 × 52 = 44 116,8 ; 4 h sup. à 125 % : 24,24 × 1,25 × 4 × 52 = 6 302,4
proche(s39.impotAn, 0.4 * 44116.8, 5, 'salarié à 39 h, heures sup. exonérées : impôt = 40 % de 44 117 €');
proche(s39n.impotAn - s39.impotAn, 0.4 * 6302.4, 5, 'coût de l\'exonération pour ce salarié = 40 % de 6 302 €');
var dir = M.situation(M.CAS[5], C2), dirH = M.situation(M.CAS[5], { socle: 800, prime: 'progressive', archi: 'c2', tPlat: 0.4, tMax: 0.5, holdings: true });
ok(dirH.impotAn > dir.impotAn + 100000, 'dirigeant : la transparence des holdings impose les 300 k€ retenus');
['smic15', 'smic35', 'cadre60', 'retraiteModeste', 'retraiteAise', 'dirigeantHolding', 'retraite62mt', 'salarie39h', 'couple2enfants'].forEach(function (id, i) {
  var x = M.situation(M.CAS[i], C2);
  ok(!x.sousLeSocle && x.tauxMarginalHeure < 1, 'cas ' + id + ' : jamais sous le socle, taux marginal < 100 %');
});

// 6. Retraités : contribution du dixième le plus aisé
var rp = M.retraites({ socle: 800, archi: 'c2', tPlat: 0.4, tMax: 0.5, imposerComplements: true });
var rp0 = M.retraites({ socle: 800, archi: 'c2', tPlat: 0.4, tMax: 0.5, imposerComplements: false });
ok(rp.topApresMd > rp0.topApresMd, 'imposer pensions + capital ensemble augmente la contribution du dixième aisé');
ok(M.pensionDecile(9) > 3320 && M.pensionDecile(0) < 1000, 'pension moyenne du D10 > q90 (3 320 €), du D1 < 1 000 €');

log('\n' + n + ' contrôles au vert');
