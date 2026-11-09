// Rapport de la couche CORRECTION0811 (correction_0811.js) : double compte du différé corrigé (V32012, V32018) + plafond des transmissions à 50 % (08/11/2026).
// Charger : liste de rapport_consolidation_0611.js sans le rapport, puis decisions_0711.js, decisions_0811.js, correction_0811.js et ce fichier ; sortie dans resultats_correction_0811.txt (qui fait foi) ;
// la dernière ligne (EXPORT) est recopiée dans sources/calculs/bilan_global.py (dictionnaire CORRECTION0811).
var C = this.Correction0811, E = this.Decisions0811, D = this.Decisions0711, ST = this.Stress, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 2 : n).replace('.', ','); }
function pc(x, n) { return f(100 * x, n === undefined ? 1 : n) + ' %'; }
var EX = { date: '2026-11-08' }, PIB = ST.ECO.pib0;
log('# Correction du double compte du différé et plafond des transmissions à 50 % (couche CORRECTION0811) : résultats');
log('');
var h = C.reportsHerites(), q = C.tresorerieV74(); EX.herites = h; EX.tresorerie = q;
log('## 1. Les deux reports hérités de la v5 et la trésorerie de la fonction du patrimoine actuelle');
log('reports hérités retirés (Md€ de 2025, central, de 2029 à 2040) : Stress.pbStruct (terme diff) ' + f(h.diff) + ' + Decisions0511b.ajustement (flux des plafonds) ' + f(h.plafonds) + ' = ' + f(h.total) + ' ; durée H537 : ' + h.duree + ' ans');
log('trésorerie du différé de la v7.4 / v7.5 (source unique) : flux ' + f(q.flux) + ' Md€ par an, durée ' + q.duree + ' ans, encours de croisière ' + f(q.encours, 1) + ' Md€ (' + pc(q.encoursPctPib) + ' du PIB)');
var prof = []; for (var t = 1; t <= 30; t++) prof.push({ an: 2028 + t, cout: C.coutTresorerie(t), encours: C.encoursAnnee(t), herite: t <= h.duree ? h.total : 0, correction: C.correction(2028 + t) });
EX.profil = prof;
log('coût de trésorerie (stock qui se rembourse de 1/12 par an, HC1) : 2029 ' + f(prof[0].cout) + ' ; 2038 ' + f(prof[9].cout) + ' ; 2040 ' + f(prof[11].cout) + ' ; 2041 ' + f(prof[12].cout) + ' ; 2058 ' + f(prof[29].cout) + ' ; encours 2040 ' + f(prof[11].encours, 1) + ', 2058 ' + f(prof[29].encours, 1));
log('correction nette au solde (reports retirés − coût de trésorerie) : 2029 ' + f(prof[0].correction) + ' ; 2038 ' + f(prof[9].correction) + ' ; 2040 ' + f(prof[11].correction) + ' ; 2041 ' + f(prof[12].correction) + ' ; 2058 ' + f(prof[29].correction));
log('');
var s = C.s3(), a = C.s3(undefined, { sansCorrection: true, top: true }), b = C.s3(undefined, { sansCorrection: true }), fx = C.s3(undefined, { dureeFixe: true }), p = C.prudente(), pa = C.prudente(undefined, { sansCorrection: true, top: true });
var IDS = ['smic_seul', 'parent_isole_smic', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'rentier_div_5000'];
function resume(x) {
  var r = { F: x.F, a: x.a, effetCouche: x.effetCouche, revenus: x.revenus, credit: x.credit, transmissions: x.transmissions, patrimoineNat: x.patrimoineNat, pension: x.pension, eco: x.eco, po: x.po,
            traj: x.traj.ratio.slice(0, 31), def: x.traj.deficit.slice(0, 31), prim: x.traj.primaire.slice(0, 31), pic: x.pic, picAn: x.picAn, dep3: x.dep3, pru: x.trajPrudente.ratio.slice(0, 31), defPru: x.trajPrudente.deficit.slice(0, 31), cas: {},
            retraites: x.retraites.map(function (y) { return { pn: y.pn, avant: y.avantNet, v: y.ecartNet, p: y.pctNet, courbe: y.courbe, r1f: y.r1f }; }) };
  IDS.forEach(function (id) { var y = x.cas[id]; r.cas[id] = { avant: y.avantNet, v: y.ecartNet, p: y.pctNet }; });
  return r;
}
EX.S3 = resume(s); EX.S3avant = resume(a); EX.S3topSeul = { F: b.F, a: b.a, transmissions: b.transmissions }; EX.S3fixe = { F: fx.F, a: fx.a, traj: fx.traj.ratio.slice(0, 31), prim: fx.traj.primaire.slice(0, 31) };
EX.S3pru = { F: p.F, a: p.a, traj: p.traj.ratio.slice(0, 31), cadre10000: p.cas.cadre_10000.ecartNet, pct10000: p.cas.cadre_10000.pctNet, po: p.po }; EX.S3pruAvant = { F: pa.F, a: pa.a, cadre10000: pa.cas.cadre_10000.ecartNet };
EX.saut = { apres: C.saut(s, 2040), avant: C.saut(a, 2040), fixe: C.saut(fx, 2040) };
EX.primaire = [2038, 2039, 2040, 2041, 2042].map(function (y) { var i = y - 2029; return { an: y, apres: s.traj.primaire[i] * PIB, avant: a.traj.primaire[i] * PIB, fixe: fx.traj.primaire[i] * PIB, apresPct: s.traj.primaire[i], avantPct: a.traj.primaire[i] }; });
log('## 2. S3 recalibré (même règle de dette : dette stable à partir de 2038, macro de référence, garantie à coût constant)');
log('leviers F : ' + f(s.F) + ' (0811 : ' + f(a.F) + ') = fonction des revenus ' + f(s.revenus) + ' (0811 ' + f(a.revenus) + ') + crédit d\'IS ' + f(s.credit) + ' + transmissions ' + f(s.transmissions) + ' (0811 ' + f(a.transmissions) + ') + patrimoine (suite) ' + f(s.patrimoineNat) + ' + courbe des pensions ' + f(s.pension) + ' + économies ' + f(s.eco));
log('coefficient a de la fonction des revenus : ' + f(s.a, 4) + ' (0811 : ' + f(a.a, 4) + ')');
log('plafond des transmissions à 50 % (sans montée à 60 %), correction du différé non appliquée : F ' + f(b.F) + ' ; a ' + f(b.a, 4) + ' ; transmissions ' + f(b.transmissions) + ' (écart de recette ' + f(b.transmissions - a.transmissions) + ' ; écart de F ' + f(b.F - a.F) + ', écart de a ' + f(b.a - a.a, 4) + ')');
log('dette : 2038 ' + pc(s.traj.ratio[9]) + ' ; 2058 ' + pc(s.traj.ratio[29]) + ' (0811 : ' + pc(a.traj.ratio[9]) + ' ; ' + pc(a.traj.ratio[29]) + ') ; pic ' + pc(s.pic) + ' en ' + s.picAn + ' (0811 : ' + pc(a.pic) + ' en ' + a.picAn + ') ; déficit > 3 % du PIB jusqu\'en ' + s.dep3 + ' (0811 : ' + a.dep3 + ')');
log('déficit public (intérêts compris), % du PIB : 2029 ' + pc(s.traj.deficit[0]) + ' ; 2038 ' + pc(s.traj.deficit[9]) + ' ; 2041 ' + pc(s.traj.deficit[12]) + ' ; 2058 ' + pc(s.traj.deficit[29]) + ' (0811 : ' + pc(a.traj.deficit[0]) + ' ; ' + pc(a.traj.deficit[9]) + ' ; ' + pc(a.traj.deficit[12]) + ' ; ' + pc(a.traj.deficit[29]) + ')');
log('PO ' + pc(s.po.pct) + ' (élargis ' + pc(s.po.elargisPct) + ') ; 0811 : ' + pc(a.po.pct) + ' (' + pc(a.po.elargisPct) + ')');
log('macro prudente, mêmes leviers : 2038 ' + pc(s.trajPrudente.ratio[9]) + ', 2058 ' + pc(s.trajPrudente.ratio[29]) + ' (0811 : ' + pc(a.trajPrudente.ratio[9]) + ', ' + pc(a.trajPrudente.ratio[29]) + ') ; leviers à régler : F = ' + f(p.F) + ' (0811 ' + f(pa.F) + '), a = ' + f(p.a, 4) + ' (0811 ' + f(pa.a, 4) + '), cadre 10 000 € ' + f(EX.S3pru.cadre10000, 0) + ' (' + pc(EX.S3pru.pct10000) + ')');
log('cas types (revenu net santé, €/mois ; 0811 entre parenthèses) : ' + IDS.map(function (id) { return id + ' ' + f(EX.S3.cas[id].v, 0) + ' (' + f(EX.S3avant.cas[id].v, 0) + ')'; }).join(' ; '));
log('retraités : ' + EX.S3.retraites.map(function (x, i) { return x.pn + ' € ' + f(x.v, 0) + ' (' + pc(x.p) + ' ; 0811 ' + f(EX.S3avant.retraites[i].v, 0) + ')'; }).join(' ; '));
log('');
log('## 3. Le saut de 2040-2041');
log('solde primaire de 2040 à 2041 (référence) : après correction ' + f(EX.saut.apres.md) + ' Md€ de 2025 (' + f(100 * EX.saut.apres.points, 3) + ' point de PIB) ; avant ' + f(EX.saut.avant.md) + ' Md€ (' + f(100 * EX.saut.avant.points, 3) + ' point) ; variante à durée fixe de 12 ans ' + f(EX.saut.fixe.md) + ' Md€ (' + f(100 * EX.saut.fixe.points, 3) + ' point)');
EX.primaire.forEach(function (x) { log('  ' + x.an + ' : solde primaire ' + f(x.apres, 1) + ' Md€ (0811 : ' + f(x.avant, 1) + ' ; durée fixe : ' + f(x.fixe, 1) + ')'); });
log('variante à durée fixe de 12 ans (flux de la v7.4 seul, sans étalement) : F ' + f(fx.F) + ', a ' + f(fx.a, 4) + ', dette 2038 ' + pc(fx.traj.ratio[9]) + ', 2058 ' + pc(fx.traj.ratio[29]) + ' ; le saut reste de ' + f(EX.saut.fixe.md) + ' Md€ en 2041 (le flux de 12,4 Md€ s\'éteint d\'un coup)');
log('');
var cl = E.clause(s); EX.clause = { L: cl.L, voted: cl.voted, avec: cl.avec, sans: cl.sans, maxL: cl.maxL, L2038: cl.L2038, L2048: cl.L2048, L2058: cl.L2058, ecartMax: cl.ecartMax, ecartMin: Math.min.apply(null, cl.ecart), stable: cl.stable, pic: cl.pic, pensMax: cl.pensMax, partRetraites: cl.partRetraites, mCap: E.HYP.clause.mCap, seuil: cl.seuil, pas: cl.pas, kappa: E.HYP.clause.kappa };
log('## 4. Clause automatique (macro prudente, leviers de la référence)');
log('levier ajouté : 2038 ' + f(cl.L2038, 1) + ' ; 2048 ' + f(cl.L2048, 1) + ' ; 2058 ' + f(cl.L2058, 1) + ' Md€ (max ' + f(cl.maxL, 1) + ') ; dette 2038 ' + pc(cl.avec[9]) + ', 2058 ' + pc(cl.avec[29]) + ' (sans clause : ' + pc(cl.sans[9]) + ', ' + pc(cl.sans[29]) + ' ; votée : ' + pc(cl.voted[9]) + ', ' + pc(cl.voted[29]) + ')');
[['niveau stable (2048)', cl.stable], ['pic', cl.pic]].forEach(function (x) { log(x[0] + ' : levier ' + f(x[1].levier, 1) + ' ; a = ' + f(x[1].a, 4) + ' ; coefficient de la courbe des pensions ' + f(x[1].m, 4) + ' ; cadre à 10 000 € brut ' + f(x[1].cadre10000, 0) + ' €/mois'); });
EX.sensib = (function () { var c = D.HYP.gt.gtc_droite.comportement, x = C.s3(undefined, { extra: c[1] }); return { F: x.F, a: x.a, d2038: x.traj.ratio[9] }; })();
var sn = D.somme(s.lignes.slice(D.lignes(D.HYP.defaut).length)); var sf2 = C.s3(undefined, { extra: sn[0] - sn[1] }), sd2 = C.s3(undefined, { extra: sn[2] - sn[1] }); EX.bornes = { fav: { F: sf2.F, a: sf2.a }, def: { F: sd2.F, a: sd2.a } };
log('bornes des nouvelles lignes de la couche 0811 : favorable F = ' + f(sf2.F) + ', a = ' + f(sf2.a, 4) + ' ; défavorable F = ' + f(sd2.F) + ', a = ' + f(sd2.a, 4));
log('comportement des sorties du chômage compté : F = ' + f(EX.sensib.F) + ', a = ' + f(EX.sensib.a, 4) + ', dette 2038 ' + pc(EX.sensib.d2038));
var iMax = cl.L.indexOf(cl.maxL); log('clause : maximum en ' + (2029 + iMax) + ' ; écart maximal à la trajectoire votée ' + f(100 * cl.ecartMax, 1) + ' points ; levier sur les retraités ' + f(cl.stable.retraites, 2) + ' Md€ (plafonné à ' + f(cl.pensMax, 2) + ')');
EX.alt = {}; ['gtc_droite', 'a', 'b', 'c'].forEach(function (v) { var x = v === 'gtc_droite' ? s : C.s3(v), r = resume(x); EX.alt[v] = { F: r.F, a: r.a, d38: r.traj[9], d58: r.traj[29], po: r.po.pct, elargis: r.po.elargisPct, dep3: r.dep3, cas: r.cas }; });
log('variantes de la garantie (décisions du 08/11 et correction comprises ; F, a, dette 2038, 2058, PO) : ' + Object.keys(EX.alt).map(function (v) { var x = EX.alt[v]; return v + ' ' + f(x.F) + ', ' + f(x.a, 4) + ', ' + pc(x.d38) + ', ' + pc(x.d58) + ', ' + pc(x.po); }).join(' ; '));
var AN = [2029, 2033, 2037, 2038, 2043, 2048, 2058]; EX.tableau = AN.map(function (y) { return { an: y, dette: s.traj.ratio[y - 2029], deficit: s.traj.deficit[y - 2029] }; });
log('trajectoire (dette ; déficit, % du PIB) : ' + EX.tableau.map(function (x) { return x.an + ' ' + pc(x.dette) + ' ; ' + pc(x.deficit); }).join(' | '));
EX.pas = {}; [4, 8, 10].forEach(function (pp) { var c = E.clause(s, { pas: pp }); EX.pas[pp] = { ecartMax: c.ecartMax, maxL: c.maxL }; });
log('clause, variantes du pas annuel (Md€) : ' + [4, 8, 10].map(function (pp) { return pp + ' : écart max ' + f(100 * EX.pas[pp].ecartMax, 1) + ' points, pic ' + f(EX.pas[pp].maxL, 1); }).join(' ; '));
log('levier de la clause par année 2029-2058 : ' + cl.L.map(function (x) { return f(x, 0); }).join(' '));
log('EXPORT ' + JSON.stringify(EX));
