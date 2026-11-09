// Tests des options du 04/11 (optimum_options_0411.js ; § 17 de resultats-optimum.txt). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js \
//       optimum_options_0411.js ../risques/stress.js test_options_0411.js
var Z = this.Optimum, X = this.OptionsDu0411, OF = this.OptionsFinancement, ST = this.Stress, G = this.GagnantsPerdants, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var SCS = ['bas', 'central', 'haut'], V5 = Z.archi(Z.ARCHITECTURE_V5), PAS = X.pointDeTaux(V5);

// 1. Rien ne change par défaut
SCS.forEach(function (s) { proche(X.cout(V5, s, {}).total, 0, 1e-12, 'aucune option : coût nul (' + s + ')'); proche(X.solde(V5, s, {}), Z.solde(V5, s), 1e-12, 'aucune option : solde de la v5 (' + s + ')'); });
ok(X.tauxEquilibre(V5, {}) === Z.tauxEquilibre(V5) && Z.tauxEquilibre(V5) === 0.414, 'taux d\'équilibre de la v5 : 41,4 % avec ou sans module (40,7 % avant les corrections du 04/11, V12400-V12411)');
proche(Z.solde(V5, 'central'), 0.6313, 0.001, 'v5 : solde central +0,28 Md€ (+0,75 avant les corrections de données du 04/11, V12400-V12404)'); // 04/11/2026 : ancienne valeur 0.2814, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 1.066, recalée après les corrections de données V12400-V12404
proche(Z.solde(V5, 'bas'), 120.9915, 0.1, 'v5 : solde bas +116,8'); proche(Z.solde(V5, 'haut'), -150.6466, 0.1, 'v5 : solde haut −144,8'); // 04/11/2026 : ancienne valeur 116.8, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -144.8, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -144.17, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 115.989, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -143.5924, recalée après les corrections de données V12400-V12404
proche(PAS, 10.5781, 0.05, '1 point de taux plat = 10,8 Md€ au central'); // 04/11/2026 : ancienne valeur 10.8, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 10.7441, recalée après les corrections de données V12400-V12404
ok(!('cmg' in Z.DEFAUT) && !('majDegressive' in Z.DEFAUT) && Z.DEFAUT.majParentIsole === 200.78, 'optimum.js : aucun champ d\'option du 04/11 dans les défauts');

// 2. Options 1 et 2 : montants repris des sources
SCS.forEach(function (s) { proche(X.cout(V5, s, { cmg: true }).total, 7.3, 1e-12, 'CMG : 7,3 Md€ (' + s + ')'); });
[1.7, 1.0, 0.5].forEach(function (v, i) { proche(X.cout(V5, SCS[i], { tvaTravaux: true }).total, v, 1e-12, 'TVA travaux : ' + v + ' (' + SCS[i] + ')'); });
SCS.forEach(function (s, i) { proche(X.HYP.tvaTravaux[i], Z.NICHES_TVA[i] * X.HYP.depenseFiscaleTravaux / X.HYP.bruteNiches, 0.06, 'TVA travaux = prorata de la mesure 23 (' + s + ')'); });
proche(X.cout(V5, 'central', { cmg: true, tvaTravaux: true }).total, 8.3, 1e-9, 'CMG + TVA : 8,3 Md€ (additif)');

// 3. Option 3 : majoration dégressive
var P = X.paramsMaj(V5), ct = Z.casTypes(V5);
proche(P.nv0, (ct.parent_isole_smic.avantMois + ct.parent_isole_smic.ecartMois) * 12 / 1.6, 1e-6, 'plateau = niveau de vie du parent isolé au Smic après la v5');
proche(P.nv1 - P.nv0, 24000, 1, 'pente 25 % : 24 000 € par UC de plage pour 2 enfants (9 600 € de perte sur 1,6 UC)');
proche(X.pentePourCas(P, 2, 1.6), 0.25, 1e-9, 'pente du parent isolé de 2 enfants = 25 %');
ok(X.majEnfant(P, 0) === 400 && X.majEnfant(P, P.nv0) === 400 && X.majEnfant(P, P.nv1) === 0 && X.majEnfant(P, 1e6) === 0, 'majoration : 400 € sur le plateau, 0 au-delà de nv1');
proche(X.majEnfant(P, (P.nv0 + P.nv1) / 2), 200, 1e-9, 'majoration : 200 € au milieu de la plage');
var e1 = X.enfantsVingtiemes(1).reduce(function (s, x) { return s + x; }, 0), e0 = X.enfantsVingtiemes(0).reduce(function (s, x) { return s + x; }, 0), e2 = X.enfantsVingtiemes(2).reduce(function (s, x) { return s + x; }, 0);
proche(e1, 13.855, 1e-9, '13,855 millions d\'enfants (central)'); proche(e0, 13.855, 1e-9, 'total conservé (favorable)'); proche(e2, 13.855, 1e-9, 'total conservé (défavorable)');
ok(X.enfantsVingtiemes(2)[0] > X.enfantsVingtiemes(1)[0] && X.enfantsVingtiemes(0)[0] < X.enfantsVingtiemes(1)[0], 'défavorable = plus d\'enfants en bas ; favorable = moins');
proche(X.coutMajActuelle(V5, 'central'), 3.166e6 * 400 * 12 / 1e9, 1e-6, 'majoration actuelle : 3,166 M d\'enfants × 400 € × 12 = 15,2 Md€');
var pentes = [0.5, 0.25, 0.15, 0.08].map(function (s) { return X.coutMajDeg(X.paramsMaj(V5, { pente: s }), 1); });
ok(pentes[0] < pentes[1] && pentes[1] < pentes[2] && pentes[2] < pentes[3], 'le coût croît quand la pente baisse (' + pentes.map(function (x) { return x.toFixed(1); }).join(' < ') + ')');
ok(X.coutMajDeg(X.paramsMaj(V5, { nv1: P.nv0 + 1 }), 1) < X.coutMajActuelle(V5, 'central'), 'la marche au niveau de vie du parent isolé coûte moins que la majoration actuelle');
var lo = P.nv0 + 1, hi = P.nv0 + 4e5, i, cible = X.coutMajActuelle(V5, 'central');
for (i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (X.coutMajDeg(X.paramsMaj(V5, { nv1: m }), 1) > cible) hi = m; else lo = m; }
var pEgal = X.pentePourCas(X.paramsMaj(V5, { nv1: lo }), 2, 1.6);
ok(pEgal > 0.9, 'à coût égal, la pente implicite dépasse 90 % de chaque euro (obtenu ' + pEgal.toFixed(2) + ')');
var c3 = X.casTypes(V5, { majDegressive: true });
ok(c3.parent_isole_smic.ecartMois >= ct.parent_isole_smic.ecartMois - 1e-6 && c3.parent_isole_smic.ecartMois >= 124, 'contrainte : le parent isolé au Smic garde +124 €/mois (+138 avant les corrections du 04/11, V12400-V12420 : taux plat de 40,7 à 41,4 %)');
ok(c3.parent_isole_sans_emploi.ecartMois >= ct.parent_isole_sans_emploi.ecartMois - 1e-6, 'le parent isolé sans emploi ne perd rien');
['rsa_seul', 'smic_seul', 'retraite_aspa', 'cadre_2x', 'cadre_4x'].forEach(function (id) { proche(c3[id].ecartMois, ct[id].ecartMois, 1e-9, 'sans enfant, aucun changement : ' + id); });
proche(c3.couple_1smic_2enf.ecartMois - ct.couple_1smic_2enf.ecartMois, 800, 1e-6, 'couple à 1 Smic, 2 enfants : +800 € (plateau)');
var dd = X.decilesMajDeg(V5), d0 = Z.deciles(V5);
ok(dd.length === 10 && dd.every(function (x, j) { return Math.abs(x.avant - d0[j].ecart) < 1e-9; }), 'dixièmes : la référence est celle de la v5');
ok(dd[0].apres > dd[0].avant && dd[9].apres < dd[9].avant + 5, 'dixièmes : D1 gagne, D10 ne bouge presque pas');
var surcout = X.surcoutMajDeg(V5, 'central');
proche(surcout, X.coutMajDeg(P, 1) - X.coutMajActuelle(V5, 'central'), 1e-9, 'surcoût net = dégressive − actuelle');
ok(surcout > 10 && surcout < 20, 'surcoût net à pente 25 % : entre 10 et 20 Md€ au central (obtenu ' + surcout.toFixed(1) + ')');
var tm = X.tmeMajDeg(V5, 'parent', {}), tm8 = X.tmeMajDeg(V5, 'parent', { pente: 0.08 });
ok(tm.tme > 0.75 && tm.tme > tm.v5.tme + 0.2, 'pente 25 % : le taux marginal du parent isolé dépasse 75 % (' + tm.tme.toFixed(2) + ')');
ok(tm8.tme <= 0.76, 'pente 8 % : le taux marginal du parent isolé est à 75,6 % après V12400-V12420 (dépasse de 0,6 point le plafond de 75 % ; 74,9 % avant) (' + tm8.tme.toFixed(3) + ')');

// 4. Option 4 : plafonds
proche(X.partDifferee(V5, X.regleCap('actuel', V5.tPlat)), Z.distributionTaxe(V5.taxe).partDifferee, 1e-12, 'règle actuelle (5 % sous la médiane) : redonne la part différée d\'optimum.js');
var pa = X.partDifferee(V5, X.regleCap('actuel', V5.tPlat)), p75 = X.partDifferee(V5, X.regleCap('annuel75', V5.tPlat)), pc_ = X.partDifferee(V5, X.regleCap('continu', V5.tPlat));
ok(pa <= p75 + 1e-12 && p75 <= pc_ + 1e-12, 'plus la règle plafonne, plus on diffère (' + pa.toFixed(3) + ' ≤ ' + p75.toFixed(3) + ' ≤ ' + pc_.toFixed(3) + ')');
var med = Z.seuilPlafond(), mm = med * Z.HYP.ucParMenage, cc = X.regleCap('continu', V5.tPlat), ca = X.regleCap('annuel75', V5.tPlat);
proche(cc(mm - 1e-6) / mm, cc(mm + 1e-6) / mm, 1e-9, 'plafond continu : aucun saut à la médiane');
ok(ca(mm - 1, med - 1e-6) / mm < ca(mm + 1, med + 1) / mm - 0.2, 'plafond annuel de 75 % : saut à la médiane (5 % → 34,3 %)');
proche(cc(10 * mm) / (10 * mm), 0.75 - V5.tPlat, 1e-9, 'plafond continu : 75 % − taux plat au-delà de deux médianes');
proche(cc(0.5 * mm) / (0.5 * mm), 0.05, 1e-12, 'plafond continu : 5 % sous la médiane');
SCS.forEach(function (s) {
  var r = X.coutPlafonds(V5, s, { mode: 'continu', transmission: true }), r2 = X.coutPlafonds(V5, s, { mode: 'annuel75' }), r3 = X.coutPlafonds(V5, s, { transmission: true });
  ok(r.croisiere >= 0 && r.flux >= 0 && r3.abandon > 0, 'plafonds : coûts positifs (' + s + ')');
  proche(r.croisiere, X.coutPlafonds(V5, s, { mode: 'continu' }).croisiere + r3.croisiere, 1e-9, 'plafonds : continu + transmission additifs (' + s + ')');
  ok(r.flux >= r2.flux, 'plafond continu : report ≥ plafond annuel (' + s + ')');
});
ok(X.coutPlafonds(V5, 'central', {}).croisiere === 0, 'plafonds sans règle : coût nul');

// 5. Option 5 : chômage deg2 déjà en v5
SCS.forEach(function (s) { var c = X.chomageV5(V5, s); ok(c.modele === 'deg2' && c.cout > 12 && c.cout < 13 && c.remplace === 37.1, 'v5 : chômage deg2, coût 12,6 Md€ pour 37,1 remplacés (' + s + ')'); });
SCS.forEach(function (s) { proche(X.cout(V5, s, { chomage: true }).total, 0, 1e-12, 'option 5 : surcoût nul (' + s + ')'); });

// 6. Assemblage
var tout = { cmg: true, tvaTravaux: true, majDegressive: true, plafonds: { mode: 'continu', transmission: true }, chomage: true };
SCS.forEach(function (s) { var d = X.cout(V5, s, tout); proche(d.total, d.cmg + d.tvaTravaux + d.majDegressive + d.plafonds, 1e-12, 'ensemble : somme des options (' + s + ')'); proche(X.solde(V5, s, tout), Z.solde(V5, s) - d.total, 1e-9, 'ensemble : solde = v5 − coût (' + s + ')'); });
var te = X.tauxEquilibre(V5, tout); ok(te > 0.414 && X.solde(F(V5, { tPlat: te }), 'central', tout) >= 0 && X.solde(F(V5, { tPlat: Math.round((te - 0.001) * 1000) / 1000 }), 'central', tout) < 0, 'ensemble : taux d\'équilibre au dixième de point (' + te + ')');
proche(X.aTrouver(V5, tout), -X.solde(V5, 'central', tout), 1e-9, 'à trouver ailleurs = − solde central');
proche(X.aTrouver(V5, {}), 0, 1e-12, 'v5 : rien à trouver');
['cmg', 'tvaTravaux', 'majDegressive', 'plafonds'].forEach(function (k) { var o = {}; o[k] = k === 'plafonds' ? { mode: 'continu', transmission: true } : true; ok(X.tauxEquilibre(V5, o) >= 0.407, 'chaque option seule : le taux d\'équilibre ne baisse pas (' + k + ')'); });

// 7. Dette (stress.js)
if (ST && ST.ARCHS && ST.ARCHS.V5) {
  var d0_ = ST.test('V5', 'central', {}).ratio10, d1_ = ST.test('V5', 'central', { ajust: X.ajustement(V5, tout) }).ratio10, d2_ = ST.test('V5', 'central', { ajust: X.ajustement(V5, { cmg: true }) }).ratio10;
  proche(d0_, 1.0001, 0.002, 'dette à 10 ans de la v5 inchangée : 100,1 % au central'); // 04/11/2026 : ancienne valeur 1.001, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 1.0046, recalée après les corrections de données V12400-V12404
  ok(d1_ > d2_ && d2_ > d0_, 'dette : ensemble > CMG seul > v5 (' + d0_.toFixed(3) + ' < ' + d2_.toFixed(3) + ' < ' + d1_.toFixed(3) + ')');
  proche(X.ajustement(V5, { cmg: true })('central', 3), -7.3, 1e-12, 'ajustement : −7,3 Md€ par an (CMG)');
  ok(X.ajustement(V5, { plafonds: { mode: 'continu' } })('central', 1) < X.ajustement(V5, { plafonds: { mode: 'continu' } })('central', 13), 'ajustement : le report d\'encaissement s\'arrête après 12 ans');
  proche(ST.test('V5', 'central', { ajust: function () { return 0; } }).ratio10, d0_, 1e-12, 'ajustement nul : aucun effet');
} else log('stress.js non chargé : dette non testée.');
log('\n' + n + ' contrôles passés.');
