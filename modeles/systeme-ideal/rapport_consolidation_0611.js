// Rapport de la consolidation du 06/11/2026 (consolidation_0611.js). Liste de test_retraites_aisees_0611.js sans le test, puis consolidation_0611.js et ce fichier ;
// sortie dans resultats_consolidation_0611.txt (qui fait foi) ; la dernière ligne (EXPORT) est recopiée dans sources/calculs/bilan_global.py (dictionnaire CONSO0611).
var K = this.Consolidation0611, Y = this.Decisions0611V72, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 2 : n).replace('.', ','); }
var EX = {};
var u = K.urssaf(), c = K.candidats();
EX.plafond = K.facteurPlafond(); EX.urssaf = u; EX.candidats = c.total;
log('Facteur du plafond des départs (3,7986 / 4,65) : ' + f(EX.plafond, 4));
log('Urssaf (arbitrage 44) : part ' + f(u.part, 4) + ' Md€ au lieu de 0,46 ; écart brut ' + f(u.brut, 4) + ' ; après plafond fav. / central / déf. : ' + u.v.map(function (x) { return f(x, 3); }).join(' / '));
log('Candidats de l\'inventaire (N10 exclu) : ' + c.total.map(function (x) { return f(x, 3); }).join(' / '));
EX.leviers = {};
['R1f', 'M1m', 'M1f', 'M2m', 'M3'].forEach(function (id) { EX.leviers[id] = [2030, 2035, 2038, 2040, 2060].map(function (y) { return Y.leviers([id])('central', y); }); });
log('Leviers (2030, 2035, 2038, 2040, 2060) : ' + JSON.stringify(EX.leviers));
EX.recouvrement = { M1m: [0, 1, 2].map(function (k) { return K.recouvrement('M1m', 2040, k); }), M1f: [0, 1, 2].map(function (k) { return K.recouvrement('M1f', 2040, k); }),
  M1m2030: K.recouvrement('M1m', 2030), M1f2030: K.recouvrement('M1f', 2030) };
log('Recouvrement M1m en régime (2040) : ' + JSON.stringify(EX.recouvrement.M1m[1]) + ' ; M1f : ' + JSON.stringify(EX.recouvrement.M1f[1]));
EX.manqueBase = K.manqueBase(0); EX.manqueBaseCand = K.manqueBase(c.total[1]); EX.manqueBaseDef = K.manqueBase(0, 2);
log('Manque de la base avec la combinaison, recouvrement retiré, Urssaf comprise (prudente, référence, favorable) : ' + JSON.stringify(EX.manqueBase) + ' ; avec les candidats : ' + JSON.stringify(EX.manqueBaseCand));
var IDS = ['smic_seul', 'parent_isole_smic', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'rentier_div_5000'];
function resume(s) {
  var o = { a: s.a, po: s.po, traj: s.traj.ratio, def: s.traj.deficit, r0: s.traj.ratio0, cas: {}, retraites: s.r.retraites.map(function (x) { return { avant: x.avantNet, v: x.ecartNet, p: x.pctNet }; }) };
  IDS.forEach(function (id) { var x = s.r.cas[id]; o.cas[id] = { avant: x.avantNet, v: x.ecartNet, p: x.pctNet }; });
  return o;
}
var S1 = K.s1(), S2 = K.s2(), S3 = K.s3(), S2c = K.s2(c.total[1]), S3c = K.s3(c.total[1]);
EX.S1 = resume(S1); EX.S1.marge = S1.marge;
EX.S2 = resume(S2); EX.S2.E = S2.E; EX.S2.Epru = S2.Eprudente; EX.S2.aAvant = S2.aAvant; EX.S2.revenus = S2.revenus; EX.S2.credit = S2.credit;
EX.S3 = resume(S3); EX.S3.F = S3.F; EX.S3.pic = S3.pic; EX.S3.picAn = S3.picAn; EX.S3.neutre = S3.neutre; EX.S3.revenus = S3.revenus; EX.S3.credit = S3.credit;
EX.S2cand = { E: S2c.E, a: S2c.a, cadre10000: S2c.r.cas.cadre_10000.ecartNet, pct10000: S2c.r.cas.cadre_10000.pctNet };
EX.S3cand = { F: S3c.F, a: S3c.a, pic: S3c.pic, cadre10000: S3c.r.cas.cadre_10000.ecartNet, pct10000: S3c.r.cas.cadre_10000.pctNet };
function ligne(n, s) { var i38 = 9, i58 = 29; return n + ' : a = ' + f(s.a, 4) + ' ; PO ' + f(100 * s.po.pct, 1) + ' % (élargis ' + f(100 * s.po.elargisPct, 1) + ' %) ; dette 2038 ' + f(100 * s.traj.ratio[i38], 1) + ' %, 2058 ' + f(100 * s.traj.ratio[i58], 1) + ' % ; cadre 10 000 € ' + f(s.r.cas.cadre_10000.ecartNet, 0) + ' €/mois (' + f(100 * s.r.cas.cadre_10000.pctNet, 1) + ' %)'; }
log(ligne('S1 corrigé (marge ' + f(S1.marge, 2) + ')', S1));
log(ligne('S2 corrigé (manque rouvert ' + f(S2.E, 2) + ', prudente ' + f(S2.Eprudente, 2) + ')', S2));
log(ligne('S3 corrigé (F ' + f(S3.F, 2) + ', pic ' + f(100 * S3.pic, 1) + ' % en ' + S3.picAn + ')', S3));
log('Avec les candidats de l\'inventaire : S2 manque ' + f(S2c.E, 2) + ', cadre 10 000 ' + f(S2c.r.cas.cadre_10000.ecartNet, 0) + ' ; S3 F ' + f(S3c.F, 2) + ', cadre 10 000 ' + f(S3c.r.cas.cadre_10000.ecartNet, 0));
// Variante : contribution des retraités aisés sur la pension seule (question ouverte à l'auteur ; recommandation de Claude)
K.C.contrib = { seuil: 2500, taux: 0.2, capital: false };
var S2p = K.s2(), S3p = K.s3();
EX.S2pension = { E: S2p.E, a: S2p.a, po: S2p.po, cadre10000: S2p.r.cas.cadre_10000.ecartNet, pct10000: S2p.r.cas.cadre_10000.pctNet, cadre20000: S2p.r.cas.cadre_20000.ecartNet, rentier: S2p.r.cas.rentier_div_5000.ecartNet, traj2058: S2p.traj.ratio[29] };
EX.S3pension = { F: S3p.F, a: S3p.a, po: S3p.po, pic: S3p.pic, picAn: S3p.picAn, cadre10000: S3p.r.cas.cadre_10000.ecartNet, pct10000: S3p.r.cas.cadre_10000.pctNet, cadre20000: S3p.r.cas.cadre_20000.ecartNet, cadre5000: S3p.r.cas.cadre_5000.ecartNet, smic: S3p.r.cas.smic_seul.ecartNet, rentier: S3p.r.cas.rentier_div_5000.ecartNet, traj2058: S3p.traj.ratio[29] };
log('Contribution sur la pension seule : S2 a = ' + f(S2p.a, 4) + ', cadre 10 000 ' + f(S2p.r.cas.cadre_10000.ecartNet, 0) + ' (' + f(100 * S2p.r.cas.cadre_10000.pctNet, 1) + ' %) ; S3 a = ' + f(S3p.a, 4) + ', cadre 10 000 ' + f(S3p.r.cas.cadre_10000.ecartNet, 0) + ' (' + f(100 * S3p.r.cas.cadre_10000.pctNet, 1) + ' %), pic ' + f(100 * S3p.pic, 1) + ' %');
K.C.contrib = { seuil: 2500, taux: 0.2, capital: true };
log('EXPORT ' + JSON.stringify(EX));
