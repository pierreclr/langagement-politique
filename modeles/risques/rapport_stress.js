// Tests de résistance : tableaux de resultats.md. Reproduction (depuis modeles/systeme-ideal/) : voir methode.md § Reproduction.
var S = this.Stress, F = this.Voies.fus, log = (typeof print === 'function') ? print : console.log;
function r0(x) { return (Math.round(x)).toString().replace('-', '−'); }
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function pc(x) { return r0(x * 100) + ' %'; }
var CHOCS = [
  ['1a. Création de valeur : sans la ligne E (croissance par l\'IA)', { sansE: true }],
  ['1b. Création de valeur : aucune (A à E à zéro)', { sansValeur: true }],
  ['2. Récession type 2009 (PIB −3 %, écart −4,1 %)', { recession: true }],
  ['3a. Taux +100 pb', { taux: 100 }],
  ['3b. Taux +200 pb', { taux: 200 }],
  ['4a. Krach immobilier −20 % (3 ans)', { krachImmo: -0.2 }],
  ['4b. Krach boursier −30 %', { krachBourse: -0.3 }],
  ['5. Exil des grands patrimoines doublé par rapport au haut', { exil2: true }],
  ['6a. Échec du système d\'information : un an de recettes du bloc 1 perdu', { siEchec: { part: 1, definitif: 0.1 } }],
  ['6b. Échec du système d\'information : un mois de recettes du bloc 1', { siEchec: { part: 1 / 12, definitif: 0.1 } }],
  ['7. Démographie : 1,1 cotisant par retraité en 2060', { demo: { ratio2060: 1.1 } }],
  ['8a. Combinaison : récession + taux +100 pb', { recession: true, taux: 100 }],
  ['8b. Combinaison : récession + krach immobilier −20 %', { recession: true, krachImmo: -0.2 }]
];
var AR = ['P1N', 'C40', 'C40N'];
log('# Tests de résistance : sortie brute');
log('\n## Trajectoires sans choc (solde public Md€, dette/PIB ; année 1 = premier plein régime ; dette de départ 3 460,5 Md€ = 115,7 % du PIB 2025)');
log('| architecture | scénario | solde an 1 | an 5 | an 10 | dette/PIB an 5 | an 10 |'); log('|---|---|---|---|---|---|---|');
['ACTUEL'].concat(AR).forEach(function (a) { ['bas', 'central', 'haut'].forEach(function (sc) { var r = S.test(a, sc, {}); log('| ' + a + ' | ' + sc + ' | ' + r1(r.soldeAn1) + ' | ' + r1(r.soldeAn5) + ' | ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5) + ' | ' + pc(r.ratio10) + ' |'); }); });
log('\n## Leviers de garde-fou (Md€/an, croisière)');
log('| architecture | scénario | 1 point de taux plat | marge de ± 2 points | 100 € de socle | coupe max du socle (150 €) |'); log('|---|---|---|---|---|---|');
AR.forEach(function (a) { ['bas', 'central', 'haut'].forEach(function (sc) { var l = S.leviers(a, sc); log('| ' + a + ' | ' + sc + ' | ' + r1(l.parPoint) + ' | ' + r1(2 * l.parPoint) + ' | ' + r1(100 * l.parEuroSocle) + ' | ' + r1(S.SOCLE_COUPE_MAX * l.parEuroSocle) + ' |'); }); });
['central', 'haut'].forEach(function (sc) {
  log('\n## Chocs, scénario ' + sc + ' (solde an 1 / an 5 / an 10 ; dette/PIB an 5 / an 10 ; manque cumulé 10 ans ; réserve 3 ans = manque cumulé des trois premières années ; avec garde-fous : dette/PIB an 10, marge de taux utilisée max (pts), coupe du socle max (€), manque résiduel cumulé)');
  log('| choc | archi | solde 1 / 5 / 10 | dette/PIB 5 / 10 | sans choc 5 / 10 | manque cumulé 10 ans | réserve 3 ans | pic dette/PIB | garde-fous : dette/PIB 10 | marge pts | coupe socle € | manque résiduel |'); log('|---|---|---|---|---|---|---|---|---|---|---|---|');
  CHOCS.forEach(function (c) {
    var archs = (c[1].exil2 || c[1].krachImmo || c[1].krachBourse || c[1].siEchec || c[1].sansE || c[1].sansValeur) ? AR : ['ACTUEL'].concat(AR);
    archs.forEach(function (a) {
      if (a === 'ACTUEL' && (c[1].sansE || c[1].sansValeur)) return;
      var r = S.test(a, sc, c[1]), g = S.test(a, sc, c[1], true), ptsMax = 0, socMax = 0, i;
      for (i = 0; i < 10; i++) { if (g.choc.margePts[i] > ptsMax) ptsMax = g.choc.margePts[i]; if (g.choc.socleCoupe[i] > socMax) socMax = g.choc.socleCoupe[i]; }
      var pm = ptsMax;
      log('| ' + c[0] + ' | ' + a + ' | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5) + ' / ' + pc(r.ratio10) + ' | ' + pc(r.ratio5base) + ' / ' + pc(r.ratio10base) + ' | ' + r0(r.manqueCumule10) + ' | ' + r0(r.reserve3) + ' | ' + pc(r.ratioPic) + ' | ' + pc(g.ratio10) + ' | ' + r1(pm) + ' | ' + r0(socMax) + ' | ' + r0(g.manqueCumule10) + ' |');
    });
  });
});
log('\n## Clause de sauvegarde sur le solde structurel (le manque dû au cycle seul ne déclenche pas la coupe)');
log('| choc | archi | scénario | clause sur solde constaté : coupe max du socle (€), dette/PIB 10 | clause sur solde structurel : coupe max (€), dette/PIB 10, pic dette/PIB |'); log('|---|---|---|---|---|');
[['2. Récession', { recession: true }], ['8a. Récession + taux +100 pb', { recession: true, taux: 100 }], ['8b. Récession + krach immobilier', { recession: true, krachImmo: -0.2 }]].forEach(function (c) { ['C40N'].forEach(function (a) { ['central', 'haut'].forEach(function (sc) {
  var g1 = S.test(a, sc, c[1], true), g2 = S.test(a, sc, c[1], 'structurelle'), m1 = Math.max.apply(null, g1.choc.socleCoupe), m2 = Math.max.apply(null, g2.choc.socleCoupe);
  log('| ' + c[0] + ' | ' + a + ' | ' + sc + ' | ' + r0(m1) + ' €, ' + pc(g1.ratio10) + ' | ' + r0(m2) + ' €, ' + pc(g2.ratio10) + ', ' + pc(g2.ratioPic) + ' |'); }); }); });
log('\n## Détails');
var e = S.perteExil2('C40N', 'central'); log('Exil doublé (C40N, central) : revenus ' + r1(e.revenus) + ', transmissions ' + r1(e.transmissions) + ', taxe ' + r1(e.taxe) + ', total ' + r1(e.total) + ' ; mobil ajusté ' + (Math.round(e.mFit * 100) / 100) + ' ; perte du haut ' + r1(e.perteHaut));
['central', 'haut'].forEach(function (sc) { var ee = S.perteExil2('C40N', sc); log('  exil2 C40N ' + sc + ' : ' + r1(ee.total) + ' (revenus ' + r1(ee.revenus) + ', transmissions ' + r1(ee.transmissions) + ', taxe ' + r1(ee.taxe) + ')'); });
AR.forEach(function (a) { var k = S.perteKrachImmo(a, 'central', -0.2), b = S.perteKrachBourse(a, 'central', -0.3); log('Krach ' + a + ' central : immo taxe ' + r1(k.taxe) + ', transmissions ' + r1(k.transmissions) + ' (part immobilière ' + pc(k.partImmo) + ') ; bourse taxe ' + r1(b.taxe) + ', transmissions ' + r1(b.transmissions)); });
log('Bloc 1 (recettes annuelles, C40N) : ' + r0(S.bloc1('C40N')) + ' Md€ = ' + r1(100 * S.bloc1('C40N') / S.ECO.pib0) + ' % du PIB');
log('Surcoût d\'intérêts +100 pb : ' + JSON.stringify(S.surcoutInterets(3460.5, 100, 8)));
var rec = S.test('ACTUEL', 'central', { recession: true }), rn = S.test('C40N', 'central', { recession: true }), cum = function (r) { var s = 0, i; for (i = 0; i < 4; i++) s += r.base.B[i] - r.choc.B[i]; return s; };
log('Récession, effet sur le solde (central) : droit actuel an 1 ' + r1(rec.base.B[0] - rec.choc.B[0]) + ', cumul 4 ans ' + r1(cum(rec)) + ' ; C40N an 1 ' + r1(rn.base.B[0] - rn.choc.B[0]) + ', cumul 4 ans ' + r1(cum(rn)));
log('Lissage de l\'indice sur 5 ans, krach −20 % trois ans (niveaux relatifs, pic) : ' + S.lissage([0.2, 0.2, 0.2, 0.1333, 0.0667, 0, 0, 0, 0, 0], 5).map(function (x) { return (Math.round(x * 1000) / 1000); }).join(' ; '));
log('\n## Synthèse (C40N au central et au haut ; P1N et C40 au central pour les soldes)');
log('| choc | C40N central : solde an 10 | dette/PIB 5 / 10 ans | écart de dette/PIB à 10 ans vs sans choc | réserve 3 ans | C40N haut : solde an 10 | dette/PIB 10 ans | P1N central : solde an 10 | C40 central : solde an 10 |'); log('|---|---|---|---|---|---|---|---|---|');
log('| Sans choc | ' + r1(S.test('C40N', 'central', {}).soldeAn10) + ' | ' + pc(S.test('C40N', 'central', {}).ratio5) + ' / ' + pc(S.test('C40N', 'central', {}).ratio10) + ' | 0 | 0 | ' + r1(S.test('C40N', 'haut', {}).soldeAn10) + ' | ' + pc(S.test('C40N', 'haut', {}).ratio10) + ' | ' + r1(S.test('P1N', 'central', {}).soldeAn10) + ' | ' + r1(S.test('C40', 'central', {}).soldeAn10) + ' |');
CHOCS.forEach(function (c) { var a = S.test('C40N', 'central', c[1]), h = S.test('C40N', 'haut', c[1]), p = S.test('P1N', 'central', c[1]), d = S.test('C40', 'central', c[1]);
  log('| ' + c[0] + ' | ' + r1(a.soldeAn10) + ' | ' + pc(a.ratio5) + ' / ' + pc(a.ratio10) + ' | ' + r1(100 * (a.ratio10 - a.ratio10base)) + ' pts | ' + r0(a.reserve3) + ' | ' + r1(h.soldeAn10) + ' | ' + pc(h.ratio10) + ' | ' + r1(p.soldeAn10) + ' | ' + r1(d.soldeAn10) + ' |'); });
log('\nÉcart de taux plat entre C40 et C40N (an 1, central) : ' + r1(S.test('C40', 'central', {}).soldeAn1 - S.test('C40N', 'central', {}).soldeAn1) + ' Md€ = ' + r1((S.test('C40', 'central', {}).soldeAn1 - S.test('C40N', 'central', {}).soldeAn1) / (S.leviers('C40N', 'central').parPoint * Math.pow(1.03, 1 + S.PREROLL))) + ' points de taux plat');
var Y0 = S.ECO.pib0, Mp = this.SystemeIdeal.DONNEES.massePensions, PIBm = this.SystemeIdeal.DONNEES.pib;
log('Démographie 2060 (régime établi) : surcoût de pensions pour garder le taux de remplacement = ' + r1(100 * Mp / PIBm * (1.41 / 1.1 - 1)) + ' % du PIB = ' + r0(Mp / PIBm * (1.41 / 1.1 - 1) * Y0) + ' Md€ de 2025 ; baisse du taux de remplacement si on ne paie pas : ' + r1(100 * (1 - 1.1 / 1.41)) + ' %');

// Architecture finale v2 (R31-R34, 03/11) : seulement si optimum.js est chargé (liste complète, methode.md § 4)
if (S.ARCHS.V2) {
  log('\n## Architecture finale v2 (R31-R34) : ' + S.ARCHS.V2.nom);
  log('Solde de croisière (Optimum.solde, Md€) bas / central / haut : ' + ['bas', 'central', 'haut'].map(function (sc) { return r1(S.croisiere('V2', sc)); }).join(' / ') + ' ; leviers : 1 point de taux plat ' + r1(S.leviers('V2', 'central').parPoint) + ' (central) / ' + r1(S.leviers('V2', 'haut').parPoint) + ' (haut), 100 € de socle ' + r1(100 * S.leviers('V2', 'central').parEuroSocle) + '.');
  log('\n### Trajectoires sans choc (v2)');
  log('| scénario | solde an 1 | an 5 | an 10 | dette/PIB an 5 | an 10 | pic dette/PIB |'); log('|---|---|---|---|---|---|---|');
  ['bas', 'central', 'haut'].forEach(function (sc) { var r = S.test('V2', sc, {}), pk = Math.max.apply(null, r.base.ratio); log('| ' + sc + ' | ' + r1(r.soldeAn1) + ' | ' + r1(r.soldeAn5) + ' | ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5) + ' | ' + pc(r.ratio10) + ' | ' + pc(pk) + ' |'); });
  var CV2 = [['1a. IA à zéro (sans la ligne E)', { sansE: true }], ['1b. Création de valeur : aucune', { sansValeur: true }], ['2. Récession type 2009', { recession: true }], ['3a. Taux +100 pb', { taux: 100 }], ['3b. Taux +200 pb', { taux: 200 }],
             ['4a. Krach immobilier −20 % (3 ans)', { krachImmo: -0.2 }], ['5b. Exil au haut de la fourchette défendable (R34)', { exilHaut: true }], ['5. Exil doublé (ancien stress R19, pour comparaison)', { exil2: true }],
             ['8a. Récession + taux +100 pb', { recession: true, taux: 100 }], ['8b. Récession + krach immobilier', { recession: true, krachImmo: -0.2 }]];
  ['central', 'haut'].forEach(function (sc) {
    log('\n### Chocs, v2, scénario ' + sc + ' (mêmes colonnes que ci-dessus)');
    log('| choc | solde 1 / 5 / 10 | dette/PIB 5 / 10 | écart dette/PIB 10 vs sans choc | manque cumulé 10 ans | réserve 3 ans | pic dette/PIB | garde-fous : dette/PIB 10 | marge pts | coupe socle € | manque résiduel |'); log('|---|---|---|---|---|---|---|---|---|---|---|');
    CV2.forEach(function (c) {
      var r = S.test('V2', sc, c[1]), g = S.test('V2', sc, c[1], true), ptsMax = 0, socMax = 0, i;
      for (i = 0; i < 10; i++) { if (g.choc.margePts[i] > ptsMax) ptsMax = g.choc.margePts[i]; if (g.choc.socleCoupe[i] > socMax) socMax = g.choc.socleCoupe[i]; }
      log('| ' + c[0] + ' | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5) + ' / ' + pc(r.ratio10) + ' | ' + r1(100 * (r.ratio10 - r.ratio10base)) + ' pts | ' + r0(r.manqueCumule10) + ' | ' + r0(r.reserve3) + ' | ' + pc(r.ratioPic) + ' | ' + pc(g.ratio10) + ' | ' + r1(ptsMax) + ' | ' + r0(socMax) + ' | ' + r0(g.manqueCumule10) + ' |');
    });
  });
  ['central'].forEach(function (sc) { var e = S.perteExilHaut('V2', sc), e2 = S.perteExil2('V2', sc), c = S.perteExilHaut('C40N', sc);
    log('\nExil au haut de la fourchette (v2, ' + sc + ', Md€/an de croisière) : revenus ' + r1(e.revenus) + ', transmissions ' + r1(e.transmissions) + ', taxe ' + r1(e.taxe) + ', total ' + r1(e.total) + ' ; ancien stress « doublé » sur la v2 : ' + r1(e2.total) + ' (transmissions ' + r1(e2.transmissions) + ') ; même choc sur C40N (depuis les valeurs des modules, 31 % / 40 %) : ' + r1(c.total) + '.'); });
  var kv = S.perteKrachImmo('V2', 'central', -0.2); log('Krach immobilier −20 % (v2, central) : taxe ' + r1(kv.taxe) + ', droits ' + r1(kv.transmissions) + ' (droits perçus après exemption et conjoint : ' + r1(S.droitsTransmis('V2', 'central')) + ' Md€/an).');
  var rc = S.test('V2', 'central', { recession: true }, true), rs = S.test('V2', 'central', { recession: true }, 'structurelle');
  log('Clause de sauvegarde, récession (v2, central) : solde constaté : coupe max ' + r0(Math.max.apply(null, rc.choc.socleCoupe)) + ' €, dette/PIB 10 ' + pc(rc.ratio10) + ' ; solde structurel : coupe max ' + r0(Math.max.apply(null, rs.choc.socleCoupe)) + ' €, dette/PIB 10 ' + pc(rs.ratio10) + '.');
}

// Architecture finale v3 (H609, 03/11) : seulement si optimum.js est chargé (liste complète, methode.md § 4)
if (S.ARCHS.V3) {
  log('\n## Architecture finale v3 (H609) : ' + S.ARCHS.V3.nom);
  log('Solde de croisière (Optimum.solde, Md€) bas / central / haut : ' + ['bas', 'central', 'haut'].map(function (sc) { return r1(S.croisiere('V3', sc)); }).join(' / ') + ' ; leviers : 1 point de taux plat ' + r1(S.leviers('V3', 'central').parPoint) + ' (central) / ' + r1(S.leviers('V3', 'haut').parPoint) + ' (haut), 100 € de socle ' + r1(100 * S.leviers('V3', 'central').parEuroSocle) + '.');
  log('\n### Trajectoires sans choc (v3)');
  log('| scénario | solde an 1 | an 5 | an 10 | dette/PIB an 5 | an 10 | pic dette/PIB |'); log('|---|---|---|---|---|---|---|');
  ['bas', 'central', 'haut'].forEach(function (sc) { var r = S.test('V3', sc, {}), pk = Math.max.apply(null, r.base.ratio); log('| ' + sc + ' | ' + r1(r.soldeAn1) + ' | ' + r1(r.soldeAn5) + ' | ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5) + ' | ' + pc(r.ratio10) + ' | ' + pc(pk) + ' |'); });
  var CV3 = [['1a. IA à zéro (sans la ligne E)', { sansE: true }], ['1b. Création de valeur : aucune', { sansValeur: true }], ['2. Récession type 2009', { recession: true }], ['3a. Taux +100 pb', { taux: 100 }], ['3b. Taux +200 pb', { taux: 200 }],
             ['4a. Krach immobilier −20 % (3 ans)', { krachImmo: -0.2 }], ['5b. Exil au haut de la fourchette défendable (R34)', { exilHaut: true }], ['5. Exil doublé (ancien stress R19, pour comparaison)', { exil2: true }],
             ['8a. Récession + taux +100 pb', { recession: true, taux: 100 }], ['8b. Récession + krach immobilier', { recession: true, krachImmo: -0.2 }]];
  ['central', 'haut'].forEach(function (sc) {
    log('\n### Chocs, v3, scénario ' + sc + ' (mêmes colonnes que ci-dessus)');
    log('| choc | solde 1 / 5 / 10 | dette/PIB 5 / 10 | écart dette/PIB 10 vs sans choc | manque cumulé 10 ans | réserve 3 ans | pic dette/PIB | garde-fous : dette/PIB 10 | marge pts | coupe socle € | manque résiduel |'); log('|---|---|---|---|---|---|---|---|---|---|---|');
    CV3.forEach(function (c) {
      var r = S.test('V3', sc, c[1]), g = S.test('V3', sc, c[1], true), ptsMax = 0, socMax = 0, i;
      for (i = 0; i < 10; i++) { if (g.choc.margePts[i] > ptsMax) ptsMax = g.choc.margePts[i]; if (g.choc.socleCoupe[i] > socMax) socMax = g.choc.socleCoupe[i]; }
      log('| ' + c[0] + ' | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5) + ' / ' + pc(r.ratio10) + ' | ' + r1(100 * (r.ratio10 - r.ratio10base)) + ' pts | ' + r0(r.manqueCumule10) + ' | ' + r0(r.reserve3) + ' | ' + pc(r.ratioPic) + ' | ' + pc(g.ratio10) + ' | ' + r1(ptsMax) + ' | ' + r0(socMax) + ' | ' + r0(g.manqueCumule10) + ' |');
    });
  });
  ['central'].forEach(function (sc) { var e = S.perteExilHaut('V3', sc), e2 = S.perteExil2('V3', sc), c = S.perteExilHaut('C40N', sc);
    log('\nExil au haut de la fourchette (v3, ' + sc + ', Md€/an de croisière) : revenus ' + r1(e.revenus) + ', transmissions ' + r1(e.transmissions) + ', taxe ' + r1(e.taxe) + ', total ' + r1(e.total) + ' ; ancien stress « doublé » sur la v3 : ' + r1(e2.total) + ' (transmissions ' + r1(e2.transmissions) + ') ; même choc sur C40N (depuis les valeurs des modules, 31 % / 40 %) : ' + r1(c.total) + '.'); });
  var kv = S.perteKrachImmo('V3', 'central', -0.2); log('Krach immobilier −20 % (v3, central) : taxe ' + r1(kv.taxe) + ', droits ' + r1(kv.transmissions) + ' (droits perçus après exemption et conjoint : ' + r1(S.droitsTransmis('V3', 'central')) + ' Md€/an).');
  var rc = S.test('V3', 'central', { recession: true }, true), rs = S.test('V3', 'central', { recession: true }, 'structurelle');
  log('Clause de sauvegarde, récession (v3, central) : solde constaté : coupe max ' + r0(Math.max.apply(null, rc.choc.socleCoupe)) + ' €, dette/PIB 10 ' + pc(rc.ratio10) + ' ; solde structurel : coupe max ' + r0(Math.max.apply(null, rs.choc.socleCoupe)) + ' €, dette/PIB 10 ' + pc(rs.ratio10) + '.');
}
