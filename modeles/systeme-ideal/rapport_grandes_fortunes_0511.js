// Rapport des options grandes fortunes (05/11/2026). Même liste de fichiers que test_grandes_fortunes_0511.js, sans le test : ... grandes_fortunes_0511.js rapport_grandes_fortunes_0511.js
var G = this.GrandesFortunes0511, log = (typeof print === 'function') ? print : console.log, SCS = ['bas', 'central', 'haut'], NOM = { bas: 'favorable', central: 'central', haut: 'défavorable' };
function r(x, d) { var k = Math.pow(10, d === undefined ? 1 : d); return Math.round(x * k) / k; }
function ligne(t, f) { log(t + ' : ' + SCS.map(function (s) { return NOM[s] + ' ' + f(s); }).join(' ; ')); }
log('Un point de taux plat = ' + r(G.pointDeTaux(), 2) + ' Md€/an (central, v5.4)');
log('\n== 1. Holdings (Md€/an)');
['fluxImpute', 'imputationBrute', 'creditN04', 'imputationNette', 'protectionDeLaBase', 'valeurTotaleTransparence', 'netDuCredit', 'report150Flux', 'compte', 'stockUneFois', 'finPurge150', 'taxeActifsPassifs', 'plancherRevenu', 'mereFilleStatique'].forEach(function (k) { ligne(k, function (s) { return r(G.holdings(s)[k], 2); }); });
log('\n== 2. Sommet de la distribution');
['T1', 'T2', 'T3'].forEach(function (k) { ligne('tranche ' + k, function (s) { var t = G.tranches(s)[k]; return Math.round(t.n) + ' foyers, ' + r(t.W / 1e6, 1) + ' M€ en moyenne'; }); });
log('\n(a) Zucman fidèle, plancher de 2 % au-dessus de 100 M€, net de la taxe de 1 % et du prélèvement unique');
['foyers', 'patrimoineTotal', 'complement', 'brut', 'net', 'externalite', 'recetteNetteParPoint'].forEach(function (k) { ligne('(a) ' + k, function (s) { return r(G.varianteA(s)[k], k === 'complement' ? 4 : 2); }); });
ligne('(a) sensibilité érosion ×0,5 / ×1 / ×2', function (s) { return [0.5, 1, 2].map(function (m) { return r(G.sensibiliteA(s, m), 2); }).join(' / '); });
ligne('(a) sur le droit actuel (statique / net)', function (s) { var z = G.zucmanSurDroitActuel(s); return r(z.statique, 1) + ' / ' + r(z.net, 1); });
log('\n(b) barème 0 / 1 % / 2 % au-dessus de 10 M€ / 3 % au-dessus de 100 M€, seuil par adulte');
[300000, 500000].forEach(function (S) {
  ligne('(b) S=' + S + ' écart net de recette vs N07', function (s) { return r(G.varianteB(s, { seuilAdulte: S }).delta, 1); });
  ligne('(b) S=' + S + ' recette variante', function (s) { return r(G.varianteB(s, { seuilAdulte: S }).recetteVariante, 1); });
  ligne('(b) S=' + S + ' points de taux plat (négatif = à financer)', function (s) { return r(G.varianteB(s, { seuilAdulte: S }).pointsLiberables, 2); });
  ligne('(b) S=' + S + ' ménages imposés (millions) / exonérés', function (s) { var b = G.varianteB(s, { seuilAdulte: S }); return r(b.foyersImposes / 1e6, 2) + ' / ' + r(b.menagesExoneres * 100, 0) + ' %'; });
});
ligne('(b) décomposition à 300 000 € : dettes déduites (S=0) / seuil / haut du barème (S=0 brut)', function (s) { var n0 = G.varianteB(s, { seuilAdulte: 0 }).delta, b0 = G.varianteB(s, { seuilAdulte: 0, brut: true }).delta, b3 = G.varianteB(s, { seuilAdulte: 300000, brut: true }).delta; return r(n0 - b0, 1) + ' / ' + r(b3 - b0, 1) + ' / ' + r(b0, 1); });
ligne('(b) sans comportement, S=0 brut (statique du haut du barème)', function (s) { return r(G.varianteB(s, { seuilAdulte: 0, brut: true, sansComportement: true }).delta, 1); });
log('\n(c) à recette égale de la taxe de 1 %');
ligne('(c) taux du milieu avec seuil 300 000 € (assiette brute)', function (s) { var t = G.tauxMilieuRecetteEgale(s, { seuilAdulte: 300000, brut: true }); return t === null ? 'inatteignable' : r(t * 100, 2) + ' %'; });
ligne('(c) seuil par adulte à taux 1 / 2 / 3 % (assiette brute)', function (s) { var t = G.seuilRecetteEgale(s, { brut: true }); return t === null ? 'aucun (même 0 ne suffit pas)' : Math.round(t / 1000) + ' k€'; });
log('\nQui gagne, qui perd (central, seuil 300 000 € par adulte, € par ménage et par an avant comportement)');
G.gagnantsPerdants('central', { seuilAdulte: 300000 }).forEach(function (x) { log('  ' + x.tranche + ' : ' + Math.round(x.menages) + ' ménages, patrimoine brut moyen ' + Math.round(x.patrimoineBrutMoyen) + ' €, avant ' + Math.round(x.impotAvant) + ' €, après ' + Math.round(x.impotApres) + ' €, écart ' + Math.round(x.ecart) + ' €'); });
log('\n== 3. Héritage : taux de 60 % au-delà du seuil (héritage reçu à vie par héritier)');
var P = G.paretoHeritage(); log('Pareto : alpha ' + r(P.alpha, 2) + ' ; part du dernier millième ' + r(P.partTop01 * 100, 1) + ' % du flux');
[1e6, 3e6, 5e6, 10e6, 30e6].forEach(function (S) { ligne('seuil ' + S / 1e6 + ' M€ : héritiers / excédent ' + Math.round(G.heritiersAuDessus(S)) + ' / ' + r(G.excedentAuDessus(S), 1) + ' Md€ ; statique / net / départs', function (s) { var h = G.heritage(s, { seuil: S }); return r(h.statique, 2) + ' / ' + r(h.net, 2) + ' / ' + Math.round(h.departsAttendus); }); });
log('\n== 4. Montages (Md€/an) : coût actuel ; gain net ; statut');
SCS.forEach(function (sc) { log(NOM[sc]); G.montages(sc).forEach(function (m) { log('  (' + m.id + ') coût actuel ' + r(m.coutActuel, 2) + ' ; gain net ' + r(m.gainNet, 2) + ' ; à ajouter ' + r(m.aAjouter, 2) + ' ; ' + m.statut); }); log('  somme a+b+c+f dans N06 : ' + r(G.sommeDansN06(sc), 1)); });
