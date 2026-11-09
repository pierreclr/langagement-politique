// Tests des options grandes fortunes, héritage, holdings et montages (grandes_fortunes_0511.js, 05/11/2026). Depuis ce dossier, avec jsc :
//   LIST=(la liste de test_decisions_0511.js jusqu'à decisions_0511.js, puis) decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js test_grandes_fortunes_0511.js
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js test_grandes_fortunes_0511.js
var G = this.GrandesFortunes0511, Z = this.Optimum, C = this.Decisions0511c, OF = this.OptionsFinancement, M = this.SystemeIdeal, TP = this.TaxePatrimoine;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var SCS = ['bas', 'central', 'haut'];

// --- Raccord avec la v5.4 (rien n'est modifié)
var det = Z.detail(C.archiV54(), 'central');
proche(det.taxeDetail.nette, 86.417, 0.01, 'N07 central relu : taxe de 1 % nette = 86,4 Md€');
proche(det.taxeDetail.brute, 91.74, 0.01, 'N07 central relu : brute = 91,7 Md€');
proche(Z.avecExil('defendable', function () { return OF.transmissionsMd('central', { t: 0.5, ajout: 0 }); }), 100.5, 0.05, 'N06 central : 300 × 50 % × (1 − 33 %) = 100,5 Md€ avant fonction continue');
ok(Z.avecExil('defendable', function () { return M.SCENARIOS.central.fuiteTransm; }) === G.HYP.fuite[1], 'fuite défendable du module = HG10');
ok(Z.avecExil('defendable', function () { return TP.PARAM[OF.SC_PATRIMOINE.central].erosionTop; }) === G.HYP.erosion1pt[1], 'érosion défendable du module = HG08 (H572)');
proche(G.pointDeTaux(), 10.4, 0.5, 'un point de taux plat ≈ 10,4 Md€ (central, calculé sur la v5.4)');
ok(Z.detail(C.archiV54(), 'central').total > 0 && C.tauxEquilibre(false) <= 0.43, 'la v5.4 reste à l\'équilibre autour de 42 %');

// --- 1. Holdings
SCS.forEach(function (sc) {
  var h = G.holdings(sc);
  proche(h.imputationBrute, h.fluxImpute * 0.42, 1e-9, 'holdings ' + sc + ' : imputation brute = flux × 42 %');
  proche(h.creditN04, h.fluxImpute * 0.25, 1e-6, 'holdings ' + sc + ' : crédit N04 = flux × 25 % (IS)');
  proche(h.protectionDeLaBase + h.imputationBrute, h.valeurTotaleTransparence, 1e-9, 'holdings ' + sc + ' : valeur totale = imputation + protection de la base (H21)');
  proche(h.imputationNette, h.imputationBrute - h.creditN04, 1e-9, 'holdings ' + sc + ' : imputation nette du crédit');
  ok(h.mereFilleStatique > 0 && h.mereFilleNetteDeLaTransparence === 0, 'holdings ' + sc + ' : fin du mère-fille = gain statique positif, nul net de la transparence');
});
var h1 = G.holdings('central');
proche(h1.creditN04, 2.261, 0.01, 'holdings central : N04 = 2,3 Md€');
proche(h1.fluxImpute, 9.04, 0.01, 'holdings central : flux imputé 9,0 Md€ (H19)');
proche(h1.report150Flux, 3.70, 0.05, 'holdings central : fin du 150-0 B ter (flux) = +3,7 Md€ (N05)');
ok(G.holdings('bas').report150Flux > h1.report150Flux && h1.report150Flux > G.holdings('haut').report150Flux, 'holdings : 150-0 B ter ordonné bas > central > haut');
ok(h1.stockUneFois > 25 && h1.stockUneFois < 40, 'holdings : stock imposé une fois ≈ 31 Md€ au central (non compté)');

// --- 2. Sommet de la distribution
var T = G.tranches('bas');
proche(T.T3.n, 1800, 1e-9, 'sommet favorable : 1 800 foyers au-dessus de 100 M€ (Zucman, rapport AN)');
proche(T.T3.n * T.T3.W / 1e9, 1128 + 1300 * 0.150, 1e-6, 'sommet favorable : patrimoine > 100 M€ = Challenges 2025 (1 128) + 195 Md€');
proche(T.T1.n + T.T2.n + T.T3.n, 0.01 * G.HYP.menages, 1, 'les trois tranches font le P99 de l\'enquête (309 000 ménages)');
ok(T.T1.W > 3.02e6 && T.T1.W < 10e6, 'tranche 3-10 M€ : moyenne comprise entre 3 et 10 M€');
ok(G.tranches('haut').T3.n < G.tranches('central').T3.n && G.tranches('central').T3.n < T.T3.n, 'foyers du sommet : 1 800 / 1 440 / 1 080');
proche(G.erosion('central', 1), 0.35, 1e-12, 'érosion à 1 point = 35 % (H572)');
ok(G.erosion('central', 2) > G.erosion('central', 1) && G.erosion('central', 2) < 0.9, 'érosion croissante en τ, plafonnée');
proche(G.erosion('central', 2), 1 - 0.65 * 0.65, 1e-12, 'loi exponentielle : e(2) = 1 − 0,65²');

// (a) Zucman fidèle
var A = {}; SCS.forEach(function (sc) { A[sc] = G.varianteA(sc); });
proche(A.central.complement, 0.02 - 0.0085 - 0.42 * 0.015, 1e-9, '(a) central : complément = 2 % − 0,85 % (taxe de 1 % sur l\'assiette) − 42 % × 1,5 %');
proche(A.central.brut, A.central.foyers * A.central.patrimoineMoyen * A.central.complement / 1e9, 1e-9, '(a) central : brut = foyers × patrimoine × complément');
ok(A.bas.net > A.central.net && A.central.net > A.haut.net, '(a) net ordonné favorable > central > défavorable');
ok(A.central.net < A.central.brut, '(a) le net est inférieur au brut (érosion, exil)');
proche(G.varianteA('central', { sansComportement: true }).net, A.central.brut, 1e-9, '(a) sans comportement, net = brut');
ok(G.sensibiliteA('central', 0.5) > A.central.net && A.central.net > G.sensibiliteA('central', 2), '(a) la recette décroît avec l\'érosion (×0,5 > ×1 > ×2)');
ok(G.zucmanSurDroitActuel('central').statique > 14 && G.zucmanSurDroitActuel('central').statique < 18, '(a) sur le droit actuel, statique ≈ 16 Md€ (ordre de la fourchette 15-25 du rapport AN)');
ok(Math.abs(A.central.net) < 3, '(a) sur la v5.4, le complément net est faible au central : la taxe de 1 % et le prélèvement unique couvrent déjà ≈ 1,5 % du patrimoine');

// barème
proche(G.impotBareme(100e6, 0.51e6), 0.01 * (10e6 - 0.51e6) + 0.02 * 90e6, 1e-6, 'barème : 100 M€ = 1 % de 0,51 à 10 M€ + 2 % de 10 à 100 M€');
proche(G.impotBareme(200e6, 0.51e6) - G.impotBareme(100e6, 0.51e6), 3e6, 1e-6, 'barème : 3 % au-delà de 100 M€');
proche(G.impotBareme(400000, 510000), 0, 1e-12, 'barème : 0 sous le seuil');
var B = {}; SCS.forEach(function (sc) { B[sc] = G.varianteB(sc, { seuilAdulte: 300000 }); });
SCS.forEach(function (sc) {
  proche(B[sc].recetteVariante, B[sc].n07 + B[sc].delta, 1e-9, '(b) ' + sc + ' : recette = N07 + écart');
  ok(B[sc].delta < 0, '(b) ' + sc + ' : un seuil de 300 000 € par adulte coûte plus que le haut du barème ne rapporte');
  ok(G.varianteB(sc, { seuilAdulte: 500000 }).delta < B[sc].delta, '(b) ' + sc + ' : un seuil plus haut coûte plus');
});
ok(B.central.menagesExoneres > 0.85 && B.central.menagesExoneres < 0.93, '(b) central : ≈ 89 % des ménages exonérés à 300 000 € par adulte');
ok(B.central.foyersT3 === G.tranches('central').T3.n && B.central.foyersT2 === G.tranches('central').T2.n, '(b) central : foyers concernés par les tranches 10 M€ et 100 M€');
var B0 = G.varianteB('central', { seuilAdulte: 0, brut: true });
ok(Math.abs(B0.delta) < 1.5, '(b) central, sans seuil et sans déduction de dettes : le haut du barème ajoute ≈ 0 au net (érosion)');
ok(G.varianteB('central', { seuilAdulte: 0, brut: true, sansComportement: true }).delta > 3, '(b) central sans comportement : le haut du barème ajoute plusieurs Md€ (statique)');
// (c) recette égale
var tm = G.tauxMilieuRecetteEgale('central', { seuilAdulte: 300000, brut: true });
ok(tm !== null && tm > 0.03 && tm < 0.08, '(c) central : le taux du milieu à recette égale avec un seuil de 300 000 € est supérieur à 3 % (obtenu ' + tm + ')');
proche(G.varianteB('central', { seuilAdulte: 300000, brut: true, tauxMilieu: tm }).delta, 0, 0.01, '(c) : à ce taux, écart nul');
var se = G.seuilRecetteEgale('central', { brut: true });
ok(se !== null && se >= 0 && se < 300000, '(c) central : seuil à recette égale (assiette brute) inférieur à 300 000 €');
proche(G.varianteB('central', { seuilAdulte: se, brut: true }).delta, 0, 0.05, '(c) : à ce seuil, écart nul');
proche(B.central.pointsLiberables, B.central.delta / G.pointDeTaux(), 1e-9, '(c) points de taux = écart / valeur d\'un point');
// qui gagne, qui perd
var GP = G.gagnantsPerdants('central', { seuilAdulte: 300000 });
ok(GP.length === 14, 'gagnants et perdants : 11 tranches de l\'enquête + 3 tranches du sommet');
ok(Math.abs(GP[0].ecart) < 5 && Math.abs(GP[1].ecart) < 10, 'gagnants et perdants : D1 et D2 sans changement (patrimoine très bas)');
ok(GP[4].ecart < 0 && GP[8].ecart < 0 && GP[10].ecart < 0, 'gagnants et perdants : les classes moyennes et aisées paient moins');
ok(GP[13].ecart > 1e6 && GP[12].ecart > 0, 'gagnants et perdants : les foyers de plus de 10 M€ paient plus');

// --- 3. Héritage
var P = G.paretoHeritage();
ok(P.alpha > 1.3 && P.alpha < 3, 'héritage : α de la queue de Pareto entre 1,3 et 3 (obtenu ' + P.alpha + ')');
proche(P.partTop01, 0.03, 0.005, 'héritage : le dernier millième reçoit ≈ 3 % du flux (13 M€ × cohorte de 700 000)');
ok(G.excedentAuDessus(1e6) > G.excedentAuDessus(5e6) && G.excedentAuDessus(5e6) > G.excedentAuDessus(30e6), 'héritage : l\'excédent décroît avec le seuil');
ok(G.heritiersAuDessus(1e6) > G.heritiersAuDessus(10e6), 'héritage : les héritiers au-dessus du seuil décroissent');
var H = {}; SCS.forEach(function (sc) { H[sc] = G.heritage(sc, { seuil: 5e6, taux: 0.6 }); });
ok(H.bas.statique > 0 && H.central.statique > 0, 'héritage : statique positif (60 % − 50 % sur l\'excédent)');
ok(H.bas.net > H.central.net && H.central.net > H.haut.net, 'héritage : net ordonné favorable > central > défavorable');
ok(H.central.net < H.central.statique, 'héritage : le net est inférieur au statique');
proche(G.heritage('bas', { seuil: 5e6, taux: 0.5 }).net, 0, 1e-9, 'héritage : au taux actuel de 50 %, rien ne change (favorable)');
ok(H.central.departsAttendus > 0 && H.haut.departsAttendus > H.bas.departsAttendus, 'héritage : départs attendus croissants avec l\'exil');
ok(Math.abs(H.central.net) < 1.5, 'héritage : le relèvement à 60 % rapporte peu ou rien net (50 % est près du sommet de la courbe dans le modèle)');

// --- 4. Montages
var mm = {}; SCS.forEach(function (sc) { mm[sc] = G.montages(sc); });
ok(mm.central.length === 7 && mm.central.map(function (l) { return l.id; }).join('') === 'abcdefg', 'montages : sept dispositifs a à g');
mm.central.forEach(function (l) { ok(l.risque.length > 20 && l.steelman.length > 20 && l.source.length > 10, 'montages ' + l.id + ' : risque juridique, steelman et source renseignés'); });
function ligne(sc, id) { return mm[sc].filter(function (l) { return l.id === id; })[0]; }
['a', 'b', 'c', 'f'].forEach(function (id) {
  ok(ligne('bas', id).gainNet > ligne('central', id).gainNet && ligne('central', id).gainNet > ligne('haut', id).gainNet, 'montage ' + id + ' : gain ordonné bas > central > haut');
  ok(ligne('central', id).aAjouter === 0, 'montage ' + id + ' : rien à ajouter au bilan (déjà dans N05 ou N06)');
});
proche(ligne('central', 'a').gainNet, 2.8 * 2.0 * (0.475 / 0.23) * (1 - 0.33), 1e-9, 'montage a : coût CAE 2,8 × 2 × (47,5 % / 23 %) × (1 − 33 %)');
proche(ligne('central', 'b').coutActuel, 4.0, 1e-12, 'montage b : coût actuel = 4,0 Md€ (Voies et moyens PLF 2026, 520110)');
proche(ligne('bas', 'b').coutActuel, 5.5, 1e-12, 'montage b : 5,5 Md€ en 2024 (Cour des comptes)');
proche(ligne('haut', 'b').coutActuel, 3.3, 1e-12, 'montage b : 3,3 Md€ en 2023 (Cour des comptes)');
proche(ligne('central', 'e').gainNet, h1.report150Flux, 1e-12, 'montage e : égal à la partie 1 (fin du 150-0 B ter, flux), pas compté deux fois');
ok(ligne('central', 'd').aAjouter === 0 && ligne('central', 'd').statut.indexOf('non compté') > 0, 'montage d : purge supprimée mais non comptée (le crédit absorbe)');
ok(ligne('central', 'g').aAjouter > 0 && ligne('central', 'g').aAjouter < 3, 'montage g : seul à ajouter au bilan, petit (⚠️ estimation)');
ok(G.sommeDansN06('central') < 38.8 && G.sommeDansN06('central') > 10, 'montages : a + b + c + f = ' + G.sommeDansN06('central').toFixed(1) + ' Md€ au central, inférieur aux 38,8 Md€ de N06 net des droits actuels');
ok(G.sommeDansN06('bas') > G.sommeDansN06('central') && G.sommeDansN06('central') > G.sommeDansN06('haut'), 'montages : somme ordonnée bas > central > haut');
log('Tests grandes fortunes : ' + n + ' contrôles passés.');
