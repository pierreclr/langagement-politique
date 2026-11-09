// Tests de la capitalisation avec les cohortes réelles (T48, H221 à H240). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js trajectoires_demo.js demographie.js ../retraites/capitalisation.js capitalisation.js trajectoires_capi_cohortes.js capitalisation_cohortes.js test_capitalisation_cohortes.js
var CC = this.CapitalisationCohortes, K = this.CapitalisationSI, P1 = this.Palier1, RC = this.RetraitesCapi, TC = this.TrajectoiresCapiCohortes, TD = this.TrajectoiresDemo, DS = this.DemographieSI;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var st = P1.palier1().st, empreinte = JSON.stringify(TC).length, stAvant = JSON.stringify(st);

// 1. Données embarquées (generer_capitalisation_cohortes.py)
['bas', 'central', 'haut'].forEach(function (sc) {
  var s = TC.scenarios[sc];
  ok(s.cot.length === 46 && s.sv.length === 46 && s.cot[0].length === 60 && s.sv[0].length === 51, 'données ' + sc + ' : 46 années, cotisants 15-74 ans, survie 50-100 ans');
  var somme = s.cot[45].reduce(function (a, b) { return a + b; }, 0);
  ok(somme / s.cotisants[45] > 0.985 && somme / s.cotisants[45] <= 1, 'données ' + sc + ' : les cotisants de 15 à 74 ans font plus de 98,5 % du total COR en 2070 (au-delà de 74 ans : le reste)');
});
var sc0 = TC.scenarios.central;
proche(sc0.cotisants[0] / sc0.retraites[0], 1.76, 0.005, 'central : 1,76 cotisant par retraité en 2025 (prospective-demographie)');
proche(sc0.cotisants[45] / sc0.retraites[45], 1.27, 0.005, 'central : 1,27 cotisant par retraité en 2070 (prospective-demographie)');
proche(sc0.retraites[25], TD.scenarios.central.annees[25][4], 1, 'retraités 2050 = trajectoires_demo.js (même moteur)');
ok(TC.scenarios.haut.cotisants[45] < sc0.cotisants[45] && sc0.cotisants[45] < TC.scenarios.bas.cotisants[45], 'cotisants 2070 : population âgée < central < population jeune');
ok(sc0.sv[45][30] > sc0.sv[0][30] && sc0.sv[0][30] > 0.9 && sc0.sv[0][30] < 1, 'survie à 80 ans : comprise entre 0,9 et 1, meilleure en 2070 qu\'en 2025');
var e30 = CC.facteurRenteCohorte(sc0, 2030, 64, 0).esperance;
ok(e30 > 22 && e30 < 27, 'espérance de vie à 64 ans de la cohorte qui part en 2030 : entre 22 et 27 ans (' + e30.toFixed(1) + ')');
ok(CC.facteurRenteCohorte(TC.scenarios.haut, 2050, 64, 0).esperance > CC.facteurRenteCohorte(sc0, 2050, 64, 0).esperance &&
   CC.facteurRenteCohorte(sc0, 2050, 64, 0).esperance > CC.facteurRenteCohorte(TC.scenarios.bas, 2050, 64, 0).esperance, 'espérance de vie à 64 ans en 2050 : âgée > centrale > jeune (hypothèses d\'espérance de vie haute / centrale / basse)');
ok(CC.facteurRenteCohorte(sc0, 2030, 64, 0.035).facteur < CC.facteurRenteCohorte(sc0, 2030, 64, 0).facteur, 'le facteur de rente baisse quand le taux technique monte');

// 2. Contrôle du moteur : avec une démographie plate (40 âges égaux, rente de 22 ans à 65 ans), on retrouve EXACTEMENT la variante stylisée
(function () {
  var cot = [], sv = [], a, x, ligneCot = [], ligneSv = [];
  for (x = 15; x <= 74; x++) ligneCot.push(x >= 25 && x <= 64 ? 1000 : 0);
  for (x = 50; x <= 100; x++) ligneSv.push(x === 86 ? 0 : 1);
  for (a = 0; a < 46; a++) { cot.push(ligneCot); sv.push(ligneSv); }
  TC.scenarios.test_plat = { cot: cot, sv: sv, cotisants: cot.map(function () { return 40000; }), retraites: cot.map(function () { return 20000; }) };
  ['bas', 'central', 'haut'].forEach(function (sr) {
    var c = CC.doubleCharge({ demo: 'test_plat', scRet: sr, ageDepart: 65 }), s = RC.doubleCharge({ phiMax: 3, scenario: sr, annees: 44 }), ecart = 0, ecartF = 0, t;
    for (t = 0; t < 44; t++) { ecart = Math.max(ecart, Math.abs(c.lignes[t].doubleChargeMdE - s.lignes[t].doubleChargeMdE)); ecartF = Math.max(ecartF, Math.abs(c.lignes[t].fondsMdE - s.lignes[t].fondsMdE)); }
    ok(ecart < 1e-9 && ecartF < 1e-8 && Math.abs(c.lignes[43].detteMdE - s.lignes[43].detteMdE) < 1e-8, 'démographie plate, rendement ' + sr + ' : double charge, fonds et dette identiques à capitalisation.js (écart max ' + ecart.toExponential(1) + ')');
  });
  delete TC.scenarios.test_plat;
})();

// 3. Double charge avec les cohortes réelles
var dc = CC.doubleCharge({ demo: 'central' }), sty = CC.stylise({});
['bas', 'central', 'haut'].forEach(function (sc) { proche(CC.doubleCharge({ demo: sc }).lignes[0].doubleChargeMdE, 14.665, 1e-9, 'année 2027, ' + sc + ' : double charge = 1 point = 14,665 Md€'); });
ok(dc.lignes.every(function (l) { return l.doubleChargeMdE > 0; }), 'central : la double charge reste positive de 2027 à 2070');
ok(dc.resume.anneePic >= 2034 && dc.resume.anneePic <= 2042 && dc.resume.picMdE > 44 && dc.resume.picMdE < 50, 'central : pic de 44 à 50 Md€ entre 2034 et 2042 (' + dc.resume.picMdE.toFixed(1) + ' en ' + dc.resume.anneePic + ')');
ok(dc.lignes[20].detteMdE > sty.lignes[20].detteMdE, 'cohortes : dette de transition 2047 plus élevée qu\'en stylisé (espérance de vie plus longue que 22 ans)');
ok(dc.lignes[43].doubleChargeMdE > sty.lignes[43].doubleChargeMdE, 'cohortes : double charge 2070 plus élevée qu\'en stylisé');
proche(dc.resume.dette2070MdE, 2234, 5, 'central : dette de transition 2070 ≈ 2 234 Md€');
proche(dc.resume.dette2070PctPIB, 61.3, 0.5, 'central : dette de transition 2070 ≈ 61 % du PIB');
ok(CC.doubleCharge({ demo: 'bas' }).lignes[43].verseFondsMdE > dc.lignes[43].verseFondsMdE && dc.lignes[43].verseFondsMdE > CC.doubleCharge({ demo: 'haut' }).lignes[43].verseFondsMdE, 'versements 2070 : population jeune > central > âgée');
ok(CC.doubleCharge({ demo: 'haut' }).resume.dette2070PctPIB > dc.resume.dette2070PctPIB && dc.resume.dette2070PctPIB > CC.doubleCharge({ demo: 'bas' }).resume.dette2070PctPIB, 'dette 2070 / PIB : population âgée > central > jeune');
var du = CC.duree({ demo: 'central' }), dsty = RC.doubleCharge({ phiMax: 3, scenario: 'central', annees: 124 });
ok(du.anneeDoubleChargeNegative >= 2080 && du.anneeDoubleChargeNegative <= 2095, 'central : double charge négative à partir de ' + du.anneeDoubleChargeNegative + ' (entre 2080 et 2095)');
ok(Math.abs(du.anneeNegligeable - dsty.resume.anneeSurcoutNegligeable) <= 5, 'central : double charge sous 0,1 % du PIB à ±5 ans de la variante stylisée (' + du.anneeNegligeable + ' contre ' + dsty.resume.anneeSurcoutNegligeable + ')');
ok(CC.duree({ demo: 'haut' }).anneeNegligeable <= du.anneeNegligeable, 'population âgée : la double charge devient négligeable plus tôt (plus de retraités par cotisant)');
ok(CC.doubleCharge({ phiMax: 1 }).resume.dette2070MdE < dc.resume.dette2070MdE && dc.resume.dette2070MdE < CC.doubleCharge({ phiMax: 6 }).resume.dette2070MdE, 'dette 2070 croissante avec les points (1 < 3 < 6)');
proche(CC.doubleCharge({ profil: 'age' }).resume.dette2070MdE / dc.resume.dette2070MdE, 1, 0.1, 'profil de salaire par âge : dette 2070 à moins de 10 % de la référence');

// 4. Financement par prélèvement, épargne, taux, frais
var pr = CC.doubleCharge({ demo: 'central', financement: 'prelevement' });
ok(pr.lignes.every(function (l) { return l.detteMdE === 0; }) && pr.lignes[10].pointsPreleves > 2.5, 'prélèvement : pas de dette de transition, environ 3 points prélevés en 2037');
ok(dc.lignes.every(function (l) { return Math.abs(l.epargne.nationale - (l.epargne.fonds + l.epargne.publique + l.epargne.menages)) < 1e-9; }), 'épargne nationale = fonds + administrations + ménages, chaque année');
var d0 = CC.doubleCharge({ demo: 'central', scEpargne: 'bas' });
ok(Math.abs(d0.lignes[0].epargne.nationale) < 1, 'dette, sans déplacement (δ = 0) : épargne nationale presque inchangée la première année (le fonds épargne ce que l\'État emprunte)');
ok(dc.lignes[3].epargne.nationale < 0, 'dette, δ = 0,2 : épargne nationale en baisse en 2030 (le déplacement l\'emporte au début)');
ok(pr.lignes[23].epargne.pctPIB > 1 && pr.lignes[23].epargne.pctPIB > dc.lignes[23].epargne.pctPIB, 'prélèvement : l\'épargne nationale monte de plus de 1 % du PIB en 2050, bien plus qu\'avec la dette');
ok(CC.doubleCharge({ demo: 'central', scEpargne: 'haut' }).resume.epargneCumuleeMdE < 0, 'dette, δ = 0,75 (Attanasio-Rohwedder) : épargne nationale cumulée négative');
var tx = CC.doubleCharge({ demo: 'central', effetTaux: true });
ok(tx.resume.dette2070MdE > dc.resume.dette2070MdE && tx.resume.taux2070 > 0.015 && tx.resume.surcout2070MdE > 0, 'effet de taux central (2 pb par point) : dette, taux et surcoût sur la dette existante plus élevés');
proche(CC.doubleCharge({ demo: 'central', effetTaux: true, scEpargne: 'bas' }).resume.dette2070MdE, dc.resume.dette2070MdE, 1e-9, 'effet de taux, β = 0 : dette inchangée');
proche(CC.parametres({ scRet: 'central' }).r, RC.SCENARIOS.central.r, 1e-12, 'frais par défaut : rendement identique à H24 (0,21 % déjà déduit)');
proche(CC.parametres({ scRet: 'central', frais: 0.01 }).r, 0.035 + 0.0021 - 0.01, 1e-12, 'frais de 1 % : rendement net 2,71 %');
ok(CC.doubleCharge({ frais: 0.01 }).lignes[43].fondsMdE < dc.lignes[43].fondsMdE && Math.abs(CC.doubleCharge({ frais: 0.01 }).lignes[43].detteMdE - dc.lignes[43].detteMdE) < 1e-9, 'frais de 1 % : fonds plus petit, dette inchangée (la double charge ne dépend pas du rendement)');

// 5. Effet sur le solde et le socle
proche(CC.effet(2036, 'central', { st: st }).soldeSans, K.soldeBase(st, 'central', 10), 1e-9, 'base palier 1 : solde sans = capitalisation.js (n = 10)');
proche(CC.effet(2046, 'central', { st: st }).socleSans, K.socleBase(st, 'central', 20), 1e-9, 'base palier 1 : socle sans = capitalisation.js (n = 20)');
proche(CC.effet(2050, 'central', { st: st, base: 'demographie' }).soldeSans, DS.solde(st, 'central', 2050, { valeur: true }).solde, 1e-9, 'base démographie : solde sans = demographie.js (2050, création de valeur comprise)');
['bas', 'central', 'haut'].forEach(function (sc) { [2030, 2050, 2070].forEach(function (a) {
  var e = CC.effet(a, sc, { st: st, base: 'demographie' }), p = CC.effet(a, sc, { st: st, base: 'demographie', financement: 'prelevement' });
  ok(e.soldeAvec < e.soldeSans && e.socleAvec <= e.socleSans && p.soldeAvec === p.soldeSans && p.socleAvec === p.socleSans, sc + ' ' + a + ' : la dette dégrade solde et socle, le prélèvement les laisse inchangés');
}); });
proche(CC.effet(2046, 'central', { st: st }).socleAvec, 482, 2, 'central, base palier 1, 2046 : socle 493 → 482 € (stylisé : 493)');
proche(CC.effet(2070, 'central', { st: st, base: 'demographie' }).socleAvec, 361, 2, 'central, base démographie, 2070 : socle 490 → 361 €');
proche(CC.effet(2070, 'central', { st: st, base: 'demographie' }).soldeAvec, -217, 2, 'central, base démographie, 2070 : solde −167 → −217 Md€');
ok(CC.tableau({ st: st }).central.length === 6, 'tableau : 6 années (2030 à 2070)');

// 6. Pureté
ok(JSON.stringify(TC).length === empreinte && JSON.stringify(P1.palier1().st) === stAvant, 'fonctions pures : données embarquées et palier 1 inchangés');
log('\n' + n + ' contrôles au vert');
