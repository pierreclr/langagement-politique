// Contrôles de stress.js. Reproduction (depuis modeles/systeme-ideal/) : voir methode.md § Reproduction (même liste de fichiers, avec test_stress.js à la fin).
var S = this.Stress, T = this.TaxePatrimoine, X = this.OptionsFinancement, log = (typeof print === 'function') ? print : console.log, n = 0, ko = 0;
function ok(c, m) { n++; if (!c) { ko++; log('ÉCHEC : ' + m); } }
function pres(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (' + a + ' vs ' + b + ')'); }
var ARCH = ['P1N', 'C40', 'C40N'], SCS = ['bas', 'central', 'haut'];

// 1. Cohérence avec les modules lus
pres(X.solde(S.ARCHS.P1N.o, 'central'), -104.80, 0.05, 'P1N central = −104,8 (−99,6 avant les corrections de données du 04/11, V12400-V12420 ; options-financement-palier1 / taxe-patrimoine-1pc)');
pres(X.solde(S.ARCHS.C40.o, 'central'), -5.94, 0.05, 'C40 central = −5,9 (T5 : +0,3 avant les corrections de données du 04/11, V12400-V12420)');
pres(X.solde(S.ARCHS.C40N.o, 'central'), -20.41, 0.05, 'C40N central = −20,4 (−15,2 avant les corrections de données du 04/11, V12400-V12420)');
pres(S.leviers('P1N', 'central').parPoint, 12.6, 0.1, 'un point de taux plat ≈ 12,6 Md€ (plan-de-bascule R3)');
pres(S.leviers('P1N', 'haut').parPoint, 7.3, 0.1, 'un point de taux plat ≈ 7,3 Md€ au haut');
pres(S.leviers('P1N', 'central').parEuroSocle * 100, 45.6, 4, '100 € de socle ≈ 45,6 Md€ (plan-de-bascule R2, ordre de grandeur)');
var c = S.surcoutInterets(3460.5, 100, 8); pres(c.an1, 4.3, 0.05, '+100 pb : 4,3 Md€ en année 1'); pres(c.plein, 34.6, 0.05, '+100 pb : 34,6 Md€ à plein régime');
pres(S.perteKrachImmo('C40', 'central', -0.2).taxe, -15.56, 0.2, 'krach −20 % : taxe brute −15,6 Md€/an (taxe-patrimoine-1pc § 5 : −16,7 avant la correction du rendement locatif, V12420)');

// 2. Invariants de la simulation
ARCH.forEach(function (a) { SCS.forEach(function (sc) {
  var r = S.test(a, sc, {}), i;
  pres(r.manqueCumule10, 0, 1e-9, a + ' ' + sc + ' : sans choc, manque nul');
  for (i = 0; i < 10; i++) pres(r.choc.B[i], r.base.B[i], 1e-9, a + ' sans choc, solde identique');
  var D = r.base.dette0, ok1 = true;
  for (i = 0; i < 10; i++) { D = D - r.choc.B[i]; if (Math.abs(D - r.choc.D[i]) > 1e-6) ok1 = false; }
  ok(ok1, a + ' ' + sc + ' : identité de dette D(t) = D(t−1) − B(t)');
}); });
ok(S.test('P1N', 'central', {}).base.ratio0 > 1.15 && S.test('P1N', 'central', {}).base.ratio0 < 1.3, 'dette/PIB de départ en 2029 entre 115 et 130 %');
// aucun effet quand le choc est nul
pres(S.test('C40N', 'central', { demo: { ratio2060: 1.41 } }).manqueCumule10, 0, 1e-6, 'démographie : ratio inchangé = pas de choc');
pres(S.test('C40N', 'central', { siEchec: { part: 0 } }).manqueCumule10, 0, 1e-6, 'système d\'information : part nulle = pas de choc');
pres(S.test('C40N', 'central', { taux: 0 }).manqueCumule10, 0, 1e-9, 'taux : 0 pb = pas de choc');

// 3. Sens et ordre des chocs
SCS.forEach(function (sc) { ARCH.forEach(function (a) {
  var r0 = S.test(a, sc, {}), r1 = S.test(a, sc, { taux: 100 }), r2 = S.test(a, sc, { taux: 200 });
  ok(r2.ratio10 > r1.ratio10 && r1.ratio10 > r0.ratio10, a + ' ' + sc + ' : +200 pb pire que +100 pb pire que rien');
  ok(S.test(a, sc, { sansValeur: true }).ratio10 >= S.test(a, sc, { sansE: true }).ratio10 - 1e-12 && S.test(a, sc, { sansE: true }).ratio10 >= r0.ratio10 - 1e-12, a + ' ' + sc + ' : sans E pire que le central, sans aucune valeur encore pire');
  ok(S.test(a, sc, { krachImmo: -0.2 }).manqueCumule10 > S.test(a, sc, { krachBourse: -0.3 }).manqueCumule10, a + ' ' + sc + ' : krach immobilier plus coûteux que krach boursier (86 % de l\'assiette est immobilière)');
  ok(S.test(a, sc, { recession: true }).manqueCumule10 > 0, a + ' ' + sc + ' : la récession dégrade le solde');
  ok(S.test(a, sc, { exil2: true }).manqueCumule10 > 0, a + ' ' + sc + ' : l\'exil doublé dégrade le solde');
  ok(S.test(a, sc, { demo: { ratio2060: 1.1 } }).manqueCumule10 > 0, a + ' ' + sc + ' : la démographie défavorable dégrade le solde');
  ok(S.test(a, sc, { siEchec: { part: 1 } }).reserve3 > S.test(a, sc, { siEchec: { part: 1 / 12 } }).reserve3, a + ' ' + sc + ' : un an perdu coûte plus qu\'un mois');
}); });
// récession : année 1 = semi-élasticité × écart × PIB
(function () {
  var r = S.test('C40N', 'central', { recession: true }), Y = S.ECO.pib0 * Math.pow(1.03, 1 + S.PREROLL);
  pres(r.base.B[0] - r.choc.B[0], S.SEMI.nouveau.central * 0.041 * Y, 1e-6, 'récession, année 1 : ε × écart × PIB');
  var ra = S.test('ACTUEL', 'central', { recession: true });
  ok(ra.base.B[0] - ra.choc.B[0] > r.base.B[0] - r.choc.B[0], 'le droit actuel est plus contracyclique que le nouveau système (ε 0,63 contre 0,53)');
})();
// taux : effet de l'année 1 ≈ dette / durée × choc
(function () { var r = S.test('C40N', 'central', { taux: 100 }); pres(r.base.B[0] - r.choc.B[0], r.base.dette0 * 0.01 / 8, 0.05, '+100 pb : surcoût de l\'année 1 = dette/8 × 1 %'); })();
// garde-fous : ne dégradent jamais la dette, sont bornés
ARCH.forEach(function (a) { SCS.forEach(function (sc) { [{ taux: 100 }, { recession: true }, { exil2: true }, { demo: { ratio2060: 1.1 } }].forEach(function (ch) {
  var s0 = S.test(a, sc, ch), s1 = S.test(a, sc, ch, true), lev = S.leviers(a, sc), i, bornes = true;
  ok(s1.ratio10 <= s0.ratio10 + 1e-9, a + ' ' + sc + ' : les garde-fous ne dégradent pas la dette à 10 ans');
  for (i = 0; i < 10; i++) if (s1.choc.margePts[i] > S.MARGE_PTS + 1e-9 || s1.choc.socleCoupe[i] > S.SOCLE_COUPE_MAX + 1e-6) bornes = false;
  ok(bornes, a + ' ' + sc + ' : marge de ± 2 points et coupe du socle dans leurs bornes');
}); }); });
// exil : décomposition, bornes
(function () { var e = S.perteExil2('C40N', 'central'); pres(e.total, e.revenus + e.transmissions + e.taxe, 1e-9, 'exil : total = somme des parties'); ok(e.revenus < 0 && e.transmissions < 0 && e.taxe < 0, 'exil : toutes les parties sont négatives'); pres(S.perteExil2('P1N', 'central').taxe, S.perteExil2('P1N', 'central').taxe, 0, 'exil : calcul déterministe');
  var T0 = T.PARAM.bas.erosionTop; S.perteExil2('C40N', 'central'); pres(T.PARAM.bas.erosionTop, T0, 0, 'exil : le paramètre du module est restauré'); ok(!('__h0' in this.SystemeIdeal.SCENARIOS), 'exil : scénarios temporaires supprimés'); })();
// krach : proportionnel, taxe nulle sans taxe
pres(S.perteKrachImmo('C40N', 'central', -0.4).taxe, 2 * S.perteKrachImmo('C40N', 'central', -0.2).taxe, 1e-9, 'krach : perte proportionnelle au choc');
ok(S.perteKrachImmo('C40N', 'central', -0.2).transmissions < 0, 'krach : les droits de succession baissent');
// lissage
(function () { var niv = [0.2, 0.2, 0.2, 0.1333, 0.0667, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], sm = S.lissage(niv, 5), a = 0, b = 0, i; for (i = 0; i < niv.length; i++) { a += niv[i]; b += sm[i]; }
  pres(a, b, 1e-9, 'lissage : la perte cumulée est conservée'); ok(Math.max.apply(null, sm) < Math.max.apply(null, niv), 'lissage : le pic baisse'); })();
// 4. Architecture finale v2 (R31-R34) : seulement si optimum.js est chargé (liste complète)
if (S.ARCHS.V2) (function () {
  var Z = this.Optimum, M = this.SystemeIdeal;
  SCS.forEach(function (sc) { pres(S.croisiere('V2', sc), Z.solde(Z.ARCHITECTURE_V2, sc), 1e-9, 'v2 ' + sc + ' : croisière = Optimum.solde'); });
  SCS.forEach(function (sc) { var r = S.test('V2', sc, {}), i, D = r.base.dette0, ok1 = true; pres(r.manqueCumule10, 0, 1e-9, 'v2 ' + sc + ' : sans choc, manque nul');
    for (i = 0; i < 10; i++) { D = D - r.choc.B[i]; if (Math.abs(D - r.choc.D[i]) > 1e-6) ok1 = false; } ok(ok1, 'v2 ' + sc + ' : identité de dette'); });
  ok(S.test('V2', 'bas', {}).ratio10 < S.test('V2', 'central', {}).ratio10 && S.test('V2', 'central', {}).ratio10 < S.test('V2', 'haut', {}).ratio10, 'v2 : dette à 10 ans bas < central < haut');
  ok(S.test('V2', 'central', {}).ratio10 < S.test('C40N', 'central', {}).ratio10, 'v2 : moins de dette à 10 ans que C40N au central');
  var e = S.perteExilHaut('V2', 'central'); pres(e.total, e.revenus + e.transmissions + e.taxe, 1e-9, 'v2 : exil au haut = somme des parties'); ok(e.revenus < 0 && e.transmissions < 0 && e.taxe < 0, 'v2 : exil au haut, toutes les parties négatives');
  pres(S.perteExilHaut('V2', 'haut').total, 0, 1e-9, 'v2 : au haut, l\'exil est déjà au haut de la fourchette (choc nul)');
  ok(Math.abs(e.total) < Math.abs(S.perteExil2('V2', 'central').total), 'v2 : l\'exil au haut de la fourchette coûte moins que l\'ancien stress « doublé »');
  pres(M.SCENARIOS.central.fuiteTransm, 0.31, 0, 'exil : fuite des modules restaurée'); pres(T.PARAM.bas.erosionTop, 0.74, 0, 'exil : érosion des modules restaurée'); pres(M.SCENARIOS.central.mobil, 0.15, 0, 'exil : mobilité restaurée');
  ['central', 'haut'].forEach(function (sc) { [{ sansE: true }, { recession: true }, { taux: 100 }, { krachImmo: -0.2 }, { exilHaut: true }].forEach(function (ch) {
    var r = S.test('V2', sc, ch); if (!(ch.exilHaut && sc === 'haut')) ok(r.manqueCumule10 > 0, 'v2 ' + sc + ' : le choc ' + Object.keys(ch)[0] + ' dégrade le solde');
    ok(S.test('V2', sc, ch, true).ratio10 <= r.ratio10 + 1e-9, 'v2 ' + sc + ' : les garde-fous ne dégradent pas la dette (' + Object.keys(ch)[0] + ')'); }); });
  ok(S.droitsTransmis('V2', 'central') < X.transmissionsMd('central', 'palier1'), 'v2 : droits perçus < droits du palier 1 (exemption, conjoint)');
}).call(this);
// 4. Architecture finale v3 (H609) : seulement si optimum.js est chargé (liste complète)
if (S.ARCHS.V3) (function () {
  var Z = this.Optimum, M = this.SystemeIdeal;
  SCS.forEach(function (sc) { pres(S.croisiere('V3', sc), Z.solde(Z.ARCHITECTURE_V3, sc), 1e-9, 'v3 ' + sc + ' : croisière = Optimum.solde'); });
  SCS.forEach(function (sc) { var r = S.test('V3', sc, {}), i, D = r.base.dette0, ok1 = true; pres(r.manqueCumule10, 0, 1e-9, 'v3 ' + sc + ' : sans choc, manque nul');
    for (i = 0; i < 10; i++) { D = D - r.choc.B[i]; if (Math.abs(D - r.choc.D[i]) > 1e-6) ok1 = false; } ok(ok1, 'v3 ' + sc + ' : identité de dette'); });
  ok(S.test('V3', 'bas', {}).ratio10 < S.test('V3', 'central', {}).ratio10 && S.test('V3', 'central', {}).ratio10 < S.test('V3', 'haut', {}).ratio10, 'v3 : dette à 10 ans bas < central < haut');
  ok(S.test('V3', 'central', {}).ratio10 < S.test('C40N', 'central', {}).ratio10, 'v3 : moins de dette à 10 ans que C40N au central');
  var e = S.perteExilHaut('V3', 'central'); pres(e.total, e.revenus + e.transmissions + e.taxe, 1e-9, 'v3 : exil au haut = somme des parties'); ok(e.revenus < 0 && e.transmissions < 0 && e.taxe < 0, 'v3 : exil au haut, toutes les parties négatives');
  pres(S.perteExilHaut('V3', 'haut').total, 0, 1e-9, 'v3 : au haut, l\'exil est déjà au haut de la fourchette (choc nul)');
  ok(Math.abs(e.total) < Math.abs(S.perteExil2('V3', 'central').total), 'v3 : l\'exil au haut de la fourchette coûte moins que l\'ancien stress « doublé »');
  pres(M.SCENARIOS.central.fuiteTransm, 0.31, 0, 'exil : fuite des modules restaurée'); pres(T.PARAM.bas.erosionTop, 0.74, 0, 'exil : érosion des modules restaurée'); pres(M.SCENARIOS.central.mobil, 0.15, 0, 'exil : mobilité restaurée');
  ['central', 'haut'].forEach(function (sc) { [{ sansE: true }, { recession: true }, { taux: 100 }, { krachImmo: -0.2 }, { exilHaut: true }].forEach(function (ch) {
    var r = S.test('V3', sc, ch); if (!(ch.exilHaut && sc === 'haut')) ok(r.manqueCumule10 > 0, 'v3 ' + sc + ' : le choc ' + Object.keys(ch)[0] + ' dégrade le solde');
    ok(S.test('V3', sc, ch, true).ratio10 <= r.ratio10 + 1e-9, 'v3 ' + sc + ' : les garde-fous ne dégradent pas la dette (' + Object.keys(ch)[0] + ')'); }); });
  ok(S.droitsTransmis('V3', 'central') < X.transmissionsMd('central', 'palier1'), 'v3 : droits perçus < droits du palier 1 (exemption, conjoint)');
}).call(this);
// 5. Architecture v4 (H624) : seulement si optimum.js est chargé (liste complète)
if (S.ARCHS.V4) (function () {
  var Z = this.Optimum, M = this.SystemeIdeal;
  SCS.forEach(function (sc) { pres(S.croisiere('V4', sc), Z.solde(Z.ARCHITECTURE_V4, sc), 1e-9, 'v4 ' + sc + ' : croisière = Optimum.solde'); });
  SCS.forEach(function (sc) { var r = S.test('V4', sc, {}), i, D = r.base.dette0, ok1 = true; pres(r.manqueCumule10, 0, 1e-9, 'v4 ' + sc + ' : sans choc, manque nul');
    for (i = 0; i < 10; i++) { D = D - r.choc.B[i]; if (Math.abs(D - r.choc.D[i]) > 1e-6) ok1 = false; } ok(ok1, 'v4 ' + sc + ' : identité de dette'); });
  ok(S.test('V4', 'bas', {}).ratio10 < S.test('V4', 'central', {}).ratio10 && S.test('V4', 'central', {}).ratio10 < S.test('V4', 'haut', {}).ratio10, 'v4 : dette à 10 ans bas < central < haut');
  ok(S.test('V4', 'central', {}).ratio10 < S.test('C40N', 'central', {}).ratio10, 'v4 : moins de dette à 10 ans que C40N au central');
  var e = S.perteExilHaut('V4', 'central'); pres(e.total, e.revenus + e.transmissions + e.taxe, 1e-9, 'v4 : exil au haut = somme des parties');
  pres(S.perteExilHaut('V4', 'haut').total, 0, 1e-9, 'v4 : au haut, l\'exil est déjà au haut de la fourchette (choc nul)');
  pres(M.SCENARIOS.central.fuiteTransm, 0.31, 0, 'v4 : fuite des modules restaurée');
  ['central', 'haut'].forEach(function (sc) { [{ sansE: true }, { recession: true }, { taux: 100 }, { krachImmo: -0.2 }, { exilHaut: true }].forEach(function (ch) {
    var r = S.test('V4', sc, ch); if (!(ch.exilHaut && sc === 'haut')) ok(r.manqueCumule10 > 0, 'v4 ' + sc + ' : le choc ' + Object.keys(ch)[0] + ' dégrade le solde');
    ok(S.test('V4', sc, ch, true).ratio10 <= r.ratio10 + 1e-9, 'v4 ' + sc + ' : les garde-fous ne dégradent pas la dette (' + Object.keys(ch)[0] + ')'); }); });
}).call(this);
// 6. Architecture v5 (H634) : calendrier de la gestion et déduction de T6 retirée ; seulement si optimum.js est chargé
if (S.ARCHS.V5) (function () {
  var Z = this.Optimum;
  SCS.forEach(function (sc) { pres(S.croisiere('V5', sc), Z.solde(Z.ARCHITECTURE_V5, sc), 1e-9, 'v5 ' + sc + ' : croisière = Optimum.solde'); });
  SCS.forEach(function (sc) { var r = S.test('V5', sc, {}), i, D = r.base.dette0, ok1 = true; pres(r.manqueCumule10, 0, 1e-9, 'v5 ' + sc + ' : sans choc, manque nul');
    for (i = 0; i < 10; i++) { D = D - r.choc.B[i]; if (Math.abs(D - r.choc.D[i]) > 1e-6) ok1 = false; } ok(ok1, 'v5 ' + sc + ' : identité de dette'); });
  ok(S.test('V5', 'bas', {}).ratio10 < S.test('V5', 'central', {}).ratio10 && S.test('V5', 'central', {}).ratio10 < S.test('V5', 'haut', {}).ratio10, 'v5 : dette à 10 ans bas < central < haut');
  pres(S.partGestion(1) + S.partGestion(2) + S.partCout(1) + S.partCout(2) + S.partInfo(1), 0, 0, 'v5 : rien en année 1 ni (gestion, coût) en année 2');
  ok(S.partGestion(10) <= 1 + 1e-12 && S.partGestion(5) > S.partGestion(3) && S.partCout(10) === 1 && S.partInfo(10) === 1, 'v5 : calendrier croissant, plafonné à 100 % (le plafond des départs est dans GESTION.supprimee depuis le 04/11, V12410 ; 84,7 % avant)');
  SCS.forEach(function (sc) { ok(S.ecartCalendrier('V5', sc, 1) < 0, 'v5 ' + sc + ' : l\'année 1, le solde est sous la croisière (économies non encore réalisées)'); });
  pres(S.ecartCalendrier('V4', 'central', 5), 0, 0, 'v5 : aucun calendrier sur les architectures sans gestion (v4)');
  ok(S.test('V5', 'central', { sansCalendrier: true }).ratio10 < S.test('V5', 'central', {}).ratio10, 'v5 : le calendrier réel laisse plus de dette que la croisière dès l\'année 1');
  ok(S.test('V5A', 'central', {}).ratio10base !== undefined && S.ARCHS.V5A.calendrier, 'v5 : variante « IA ambitieuse + réserves » présente');
  ['central', 'haut'].forEach(function (sc) { [{ recession: true }, { exilHaut: true }].forEach(function (ch) {
    ok(S.test('V5', sc, ch).manqueCumule10 > 0 || (ch.exilHaut && sc === 'haut'), 'v5 ' + sc + ' : le choc ' + Object.keys(ch)[0] + ' dégrade le solde'); }); });
}).call(this);
log(n + ' contrôles, ' + ko + ' échec(s)');
