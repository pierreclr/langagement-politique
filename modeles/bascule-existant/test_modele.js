// Tests de cohérence et calculs de resultats.md. Lancer depuis modeles/bascule-existant/ :
//   jsc modele.js test_modele.js
//   (macOS : /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
//   ou : node test_modele.js
var M = this.BasculeExistant || (typeof require !== 'undefined' ? require('./modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r(x, d) { var f = Math.pow(10, d === undefined ? 0 : d); return Math.round(x * f) / f; }
var D = M.DONNEES, NIV = ['bas', 'central', 'haut'];

// 1. Tests de cohérence
var p = M.profil(0.1, 2000).reduce(function (a, b) { return a + b; }, 0);
ok(Math.abs(p - 1) < 1e-9, 'le profil de réalisation somme à 1 sur un horizon long');
ok(Math.abs(M.facteurActualise(0.1, 0, 2000) - 1) < 1e-9, 'sans actualisation, le facteur vaut 1');
ok(M.facteurActualise(0.04, 0.03, 30) < M.facteurActualise(0.08, 0.03, 30), 'réaliser plus vite → facteur actualisé plus élevé');
ok(Math.abs(M.tauxVente(D.stocks.titres_non_cotes, 'recommandee', D) - 1 / 3) < 1e-12, 'crédit d\'IS : 50 % avant IS − 25 % d\'IS = 1/3 de la distribution');
ok(Math.abs(M.seuilPurgeAns(0.5, 0.5, 0.03)) < 1e-12, 'purge au taux plein : seuil nul');
var sP = M.simuler({ politique: 'strict' }), sR = M.simuler({ politique: 'recommandee' }), sG = M.simuler({ politique: 'grand_pere' });
var sRs = M.simuler({ politique: 'recommandee_sans_purge' });
ok(Math.abs(sG.pvMdE - sG.pvAncienMdE) < 1e-9, 'grand-père large = recettes de l\'ancien régime');
ok(sP.pvMdE > sR.pvMdE && sR.pvMdE > sG.pvMdE, 'recettes : strict > recommandée > grand-père');
ok(sRs.gainCumule5ansMdE < sR.gainCumule5ansMdE, 'la purge avance des recettes sur les 5 premières années');
ok(Math.abs((sR.pvMdE - sRs.pvMdE) - (sR.purge.recetteMdE - sR.purge.manqueAGagnerMdE)) < 1e-9, 'effet de la purge = recette encaissée − manque à gagner');
var e = M.evaluerStock('assurance_vie', 'recommandee_sans_purge', 1);
ok(Math.abs(e.pvVenteMdE + e.pvTransmissionMdE - e.pvMdE) < 1e-9, 'sans purge : vente + transmission = total');
var noAA = M.anticipation('strict', 1), aa = M.anticipation('recommandee', 1);
ok(Math.abs(-aa.perteMdE + aa.evitableMdE - noAA.perteSansAntiAbusMdE) < 1e-9, 'anti-abus : perte résiduelle + perte évitée = perte sans règle');
var tot = 0; sP.risques.detail.forEach(function (x) { tot += x.esperanceActuelleMdE; });
ok(Math.abs(tot - sP.risques.esperanceActuelleMdE) < 1e-9, 'le risque total est la somme des mesures');
ok(sG.risques.detail.length === 0, 'grand-père large : aucune mesure exposée');

// 2. Résultats
log('\n=== Stocks (central) : valeur, plus-value latente, durée pour réaliser 90 % ===');
for (var k in D.stocks) {
  var x = M.evaluerStock(k, 'recommandee', 1);
  log(x.libelle + ' : ' + r(x.valeurMdE) + ' Md€ ; PV latente ' + r(x.plusValueLatenteMdE) + ' ; 90 % réalisé en ' + r(x.duree90Ans) + ' ans ; taux de vente recommandé ' + r(100 * x.tauxVente, 1) + ' % ; seuil de purge ' + r(x.seuilPurgeAns) + ' ans');
}
var dm = M.demembrements('strict', 1), cr = M.credits('recommandee', 1);
log('Usufruits en cours (central) : ' + r(dm.usufruitEnCoursMdE) + ' Md€ [bas ' + r(M.demembrements('strict', 0).usufruitEnCoursMdE) + ', haut ' + r(M.demembrements('strict', 2).usufruitEnCoursMdE) + ']');
log('Réductions d\'impôt restant dues (central) : ' + r(cr.restantMdE, 1) + ' Md€ [bas ' + r(M.credits('recommandee', 0).restantMdE, 1) + ', haut ' + r(M.credits('recommandee', 2).restantMdE, 1) + ']');

log('\n=== Valeur actualisée sur 30 ans des recettes tirées des stocks pré-réforme (Md€) ===');
var g = M.grille();
for (var pol in g) {
  log('\n-- ' + pol + ' : ' + M.POLITIQUES[pol].libelle);
  g[pol].forEach(function (s, n) {
    log(NIV[n] + ' : VA ' + r(s.pvMdE) + ' | ancien ' + r(s.pvAncienMdE) + ' | strict ' + r(s.pvStrictMdE) +
      ' | gain sur l\'ancien ' + r(s.gainSurAncienMdE) + ' | coût vs strict ' + r(s.coutSurStrictMdE) +
      ' | en plus sur 5 ans ' + r(s.gainCumule5ansMdE) + ' / 10 ans ' + r(s.gainCumule10ansMdE) +
      ' | année 1 ' + r(s.annuel[0], 1) + ' vs ancien ' + r(s.annuelAncien[0], 1) +
      ' | purge ' + r(s.purge.recetteMdE) + ' (manque à gagner ' + r(s.purge.manqueAGagnerMdE) + ', si sélection ' + r(s.purge.manqueSiSelectionMdE) + ')' +
      ' | anticipation ' + r(s.anticipation.perteMdE) + ' | risque (actuelle) ' + r(s.risques.esperanceActuelleMdE) + ' / (nouvelle) ' + r(s.risques.esperanceNouvelleMdE) +
      ' | VA nette du risque ' + r(s.pvNetteDuRisqueActuelleMdE) + ' / ' + r(s.pvNetteDuRisqueNouvelleMdE));
  });
}

log('\n=== Décomposition par stock (central) : VA ancien / recommandée / strict ===');
for (k in D.stocks) {
  var a = g.grand_pere[1].parStock[k], b = g.recommandee[1].parStock[k], c = g.strict[1].parStock[k];
  log(a.libelle + ' : ' + r(a.pvMdE) + ' / ' + r(b.pvMdE) + ' / ' + r(c.pvMdE) + ' (dont transmission recommandée ' + r(b.pvTransmissionMdE) + ' ; purge ' + r(b.pvPurgeMdE) + ' − manque ' + r(b.manqueAGagnerPurgeMdE) + ')');
}
var dT = 0, dV = 0, dP = 0; for (k in D.stocks) { var q = g.recommandee[1].parStock[k]; dT += q.pvTransmissionMdE - q.pvAncienTransmissionMdE; dV += q.pvVenteMdE + q.pvPurgeMdE - q.pvAncienVenteMdE; dP += q.pvPurgeMdE; }
log('Gain recommandée sur l\'ancien (central) : transmissions ' + r(dT) + ' ; ventes, purge comprise ' + r(dV) + ' (dont purge encaissée ' + r(dP) + ')');
var dT2 = 0, dV2 = 0; for (k in D.stocks) { var q2 = g.strict[1].parStock[k]; dT2 += q2.pvTransmissionMdE - q2.pvAncienTransmissionMdE; dV2 += q2.pvVenteMdE - q2.pvAncienVenteMdE; }
log('Gain strict sur l\'ancien (central) : transmissions ' + r(dT2) + ' ; ventes ' + r(dV2));
log('Démembrements : grand-père 0 / taxés ' + r(g.strict[1].demembrements.pvMdE));
log('Crédits : honorés ' + r(g.recommandee[1].credits.pvMdE, 1) + ' / supprimés 0');
log('Anticipation (central) : volume ' + r(g.strict[1].anticipation.volumeMdE) + ' Md€ ; perte sans anti-abus ' + r(g.strict[1].anticipation.perteSansAntiAbusMdE) + ' ; avec ' + r(-g.strict[1].anticipation.perteMdE));
[0, 2].forEach(function (n) { var t = M.anticipation('strict', n); log('Anticipation (' + NIV[n] + ') : volume ' + r(t.volumeMdE) + ' ; sans anti-abus ' + r(t.perteSansAntiAbusMdE) + ' ; avec ' + r(-t.perteMdE)); });

log('\n=== Risque contentieux (central), Md€ exposés et espérance (hypothèse) ===');
['strict', 'recommandee'].forEach(function (pp) {
  log('-- ' + pp);
  g[pp][1].risques.detail.forEach(function (d) {
    log(d.mesure + ' : exposé ' + r(d.exposeMdE) + ' ; niveau ' + d.niveauActuel + ' → ' + d.niveauNouvelle + ' ; espérance ' + r(d.esperanceActuelleMdE) + ' → ' + r(d.esperanceNouvelleMdE));
  });
});

log('\n=== Profil annuel (central, Md€/an) : recommandée vs ancien ===');
var R1 = g.recommandee[1], S1 = g.strict[1];
[0, 1, 2, 4, 9, 19, 29].forEach(function (y) {
  log('année ' + (y + 1) + ' : recommandée ' + r(R1.annuel[y], 1) + ' ; strict ' + r(S1.annuel[y], 1) + ' ; ancien ' + r(R1.annuelAncien[y], 1));
});

log('\n=== Seuils de purge (années de détention au-delà desquelles payer maintenant coûte moins) ===');
[[0.155, 0.5], [0.08, 0.5], [0.08, 1 / 3], [0.155, 1 / 3], [0.25, 0.5]].forEach(function (t) {
  log('purge ' + r(100 * t[0], 1) + ' % vs ' + r(100 * t[1], 1) + ' % plus tard : r = 3 % → ' + r(M.seuilPurgeAns(t[0], t[1], 0.03)) + ' ans ; r = 6 % → ' + r(M.seuilPurgeAns(t[0], t[1], 0.06)) + ' ans');
});

log('\n=== Sensibilité : purge « neutre » (taux = taux recommandé × facteur actualisé) ===');
var Dn = JSON.parse(JSON.stringify(D));
for (k in Dn.stocks) { var s = Dn.stocks[k]; s.tauxPurge = M.tauxVente(s, 'recommandee', Dn) * M.facteurActualise(s.realisation[1], Dn.actualisation, Dn.horizonAns); log(k + ' : taux de purge neutre ≈ ' + r(100 * s.tauxPurge, 1) + ' %'); }
var sn = M.simuler({ politique: 'recommandee', donnees: Dn });
log('Recommandée + purge neutre (central) : VA ' + r(sn.pvMdE) + ' ; purge ' + r(sn.purge.recetteMdE) + ' (manque ' + r(sn.purge.manqueAGagnerMdE) + ') ; en plus sur 5 ans ' + r(sn.gainCumule5ansMdE));
