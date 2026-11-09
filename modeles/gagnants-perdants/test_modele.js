// Tests de cohérence et chiffres de resultats.md. Lancer depuis modeles/gagnants-perdants/ :
//   jsc cas_types_donnees.js modele.js test_modele.js
//   (macOS : /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
//   ou : node test_modele.js
var G = this.GagnantsPerdants || (typeof require !== 'undefined' ? require('./modele.js') : null);
var CAS = this.CAS_TYPES_DONNEES || (typeof require !== 'undefined' ? require('./cas_types_donnees.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r(x, d) { var f = Math.pow(10, d === undefined ? 0 : d); return Math.round(x * f) / f; }
function cas(id) { return CAS.filter(function (c) { return c.id === id; })[0]; }
function pct(x) { return r(100 * x, 0) + ' %'; }

// ---------- 1. Contrôles ----------
var smic = cas('smic');
ok(Math.abs(smic.actuel.salaires_nets - 1477.93) < 1, 'OpenFisca : net au Smic = 1 477,93 € (service-public.gouv.fr)');
ok(Math.abs(smic.couts_employeur[0] - 1987.76) < 0.5, 'Urssaf : coût employeur au Smic = 1 987,76 € (T4)');
ok(Math.abs(G.revenuPropose(smic).total - (1000 + 0.5 * 1987.76)) < 1e-9, 'proposé au Smic = 1 000 + 50 % du coût employeur');
var se = cas('sans_emploi_seul');
ok(Math.abs(se.actuel.rsa - (651.69 - 78.20)) < 5, 'RSA d\'une personne seule logée = 651,69 − forfait logement 78,20 € (à ±5 € : revalorisation d\'avril)');
ok(Math.abs(G.droitsSuccession(300000) - 38194.35) < 0.01, 'droits de succession sur 300 000 € en ligne directe = 38 194 €');
ok(G.droitsSuccession(100000) === 0, 'abattement de 100 000 € en ligne directe');
CAS.forEach(function (c) {
  ok(c.actuel.revenu_disponible > 0 && isFinite(G.comparer(c).propose), c.id + ' : revenus actuel et proposé définis');
});
var D = G.deciles();
var socleTotal = D.socleParUC * D.ucTotal * 1e6 / 1e9;
ok(Math.abs(socleTotal - 12 * (1000 * 55.226 + 200 * 13.855) / 1000) < 0.5, 'socle total réparti par UC = 696 Md€ (55,2 M adultes, 13,9 M enfants)');
ok(Math.abs(D.ucTotal - 47.1) < 0.3, 'UC totales ≈ 47,1 M (2 011 Md€ / 42 700 € par UC, Insee)');
var s = 0;
D.deciles.forEach(function (x) {
  var w = x.groupes.poids;
  ok(Math.abs(w.actifs + w.retraites + w.chomeurs - 1) < 1e-9 && x.partGagnants >= 0 && x.partGagnants <= 1, x.decile + ' : poids et parts cohérents');
  s += x.ecartAnUC * x.uc * 1e6 / 1e9;
});
ok(Math.abs(s - D.ecartTotalMd) < 1e-6, 'la somme des dixièmes égale l\'écart total');
ok(G.deciles({ taux: 0.6 }).ecartTotalMd < D.ecartTotalMd, 'taux plus élevé → gains plus faibles');
['retraite_1200', 'retraite_1600', 'retraite_2500', 'retraite_4000'].forEach(function (id) {
  ok(G.comparer(cas(id)).ecartMois >= -0.01, id + ' : règle « pension − socle » sur le brut, aucun retraité au-dessus du socle ne perd');
});
ok(G.comparer(cas('retraite_800')).ecartMois < 0, 'retraite_800 : le minimum vieillesse (1 043,59 €) dépasse le socle de 1 000 €');

// ---------- 2. Résultats ----------
var TAUX = [0.5, 0.59, 0.63];
log('\n=== Cas types : revenu disponible mensuel, actuel → proposé (écart), taux 50 % / 59 % / 63 % ===');
CAS.forEach(function (c) {
  var a = TAUX.map(function (t) { return G.comparer(c, { taux: t }); });
  var pm = G.tauxPointMort(c);
  log(c.id + ' | ' + r(c.actuel.revenu_disponible) + ' → ' + r(a[0].propose) + ' (' + (a[0].ecartMois >= 0 ? '+' : '') + r(a[0].ecartMois) + ', ' +
      pct(a[0].ecartPct) + ') | 59 % : ' + r(a[1].ecartMois) + ' | 63 % : ' + r(a[2].ecartMois) +
      ' | point mort : ' + (pm === null ? '—' : pct(pm)));
});
log('\n=== Retraités selon la règle du complément (écart mensuel, taux 50 %) ===');
CAS.filter(function (c) { return c.pensions; }).forEach(function (c) {
  log(c.id + ' | brut ' + r(G.comparer(c).ecartMois) + ' | net ' + r(G.comparer(c, { retraite: 'net' }).ecartMois) +
      ' | imposé ' + r(G.comparer(c, { retraite: 'impose' }).ecartMois));
});
log('\n=== Rentier : IS supprimé reversé en dividendes ===');
log('rentier | dividendes inchangés ' + r(G.comparer(cas('rentier')).ecartMois) + ' | IS reversé ' + r(G.comparer(cas('rentier'), { isRepercute: true }).ecartMois));
log('\n=== Héritage (ponctuel), taux 50 %, sans abattement / abattement 100 000 € ===');
[100000, 300000, 1000000].forEach(function (m) {
  var h0 = G.heritage(m), h1 = G.heritage(m, { abattementHeritage: 100000 });
  log(m + ' € | garde aujourd\'hui ' + r(h0.actuel) + ' (' + pct(h0.tauxActuel) + ') | demain ' + r(h0.propose) + ' (écart ' + r(h0.ecart) +
      ') | avec abattement ' + r(h1.propose) + ' (écart ' + r(h1.ecart) + ')');
});
['brut', 'net', 'impose'].forEach(function (regle) {
  TAUX.forEach(function (t) {
    var d = G.deciles({ taux: t, retraite: regle }), h = G.hautsRevenus({ taux: t, retraite: regle });
    log('\n=== Dixièmes : taux ' + pct(t) + ', retraites « ' + regle + ' » (écart total des ménages ' + r(d.ecartTotalMd) + ' Md€/an) ===');
    d.deciles.forEach(function (x) {
      log(x.decile + ' | RDB ' + r(x.rdbActuel / 12) + ' €/mois/UC | écart ' + r(x.ecartMoisUC) + ' €/mois/UC (' + pct(x.ecartPct) + ', ≈ ' +
          r(x.ecartMoisUC * 1.52) + ' €/mois par ménage) | gagnants ' + pct(x.partGagnants) + ' | actifs ' + r(x.groupes.ecartMoisUC.actifs) +
          ', retraités ' + r(x.groupes.ecartMoisUC.retraites) + ', chômeurs ' + r(x.groupes.ecartMoisUC.chomeurs));
    });
    for (var g in h) log(g + ' | niveau de vie ' + r(h[g].niveauDeVieAn / 12) + ' €/mois/UC | écart ' + r(h[g].ecartMoisUC) + ' €/mois/UC (' +
                         pct(h[g].ecartPct) + ', ≈ ' + r(h[g].ecartMoisMenage) + ' €/mois par ménage)');
  });
});
log('\n=== Hauts revenus : sensibilités (taux 50 %) ===');
[{ isRepercute: true }, {}].forEach(function (p, i) {
  [1.8, 2.0, 2.1].forEach(function (b) {
    var h = G.hautsRevenus(p, { pareto: b });
    log((i ? 'dividendes inchangés' : 'IS reversé') + ', Pareto ' + b + ' | top 1 % ' + pct(h.top1.ecartPct) + ' | top 0,1 % ' + pct(h.top01.ecartPct));
  });
});
var ret = D.retraites;
log('\nκ (pension moyenne / RDB par UC) = ' + r(ret.kappa, 2) + ' ; retraités par dixième (M) : ' + ret.effectifs.map(function (x) { return r(x / 1e6, 2); }).join(' / '));
