/*
 * modeles/systeme-ideal/correction_0811.js — COUCHE DATÉE CORRECTION0811 : correction du double compte du différé (V32012, V32018) et plafond des transmissions à 50 %. Décisions de l'auteur du 08/11/2026.
 * Posée sur la couche DECISIONS0811 sans modifier aucun module existant.
 *
 *   1. UNE SEULE SOURCE DE VÉRITÉ pour le report d'encaissement : la trésorerie de la fonction du patrimoine actuelle (v7.4 / v7.5, Decisions0611V74.tresorerie : flux annuel du différé, encours = flux × durée).
 *      Les deux reports hérités de la v5 sont retirés : terme `diff` de Stress.pbStruct (≈ +13,5 Md€ de 2029 à 2040) et flux des plafonds de Decisions0511b.ajustement (≈ +11,5 Md€ de 2029 à 2040),
 *      tous deux bornés par H537 (durée fixe de 12 ans, d'où le saut du solde primaire de 2040 à 2041).
 *   2. HC1 (nouvelle hypothèse, ⚠️ à relire par l'auteur) : la trésorerie du différé est écrite comme un STOCK qui se rembourse chaque année du 1/durée de son encours (durée moyenne 12 ans, `HYP.paiement.duree` de la v7.4,
 *      la même que H537) : l'encours part de zéro, reçoit le flux chaque année et tend vers flux × durée (149 Md€) ; le coût de trésorerie de l'année t est le flux moins les recouvrements (flux × exp(−(t−1)/durée)).
 *      Avec une durée FIXE de 12 ans (sans étalement), le coût serait constant puis s'éteindrait d'un coup en 2041 : le saut reviendrait (variante `dureeFixe`, donnée pour mémoire).
 *   3. HC2 : plafond des transmissions : la montée du taux marginal de 50 à 60 % entre 10 et 20 M€ reçus est supprimée (le marginal reste borné par 50 %) ; décision du 08/11/2026.
 *   Recalibrage de S3 avec la même règle de dette (dette stable à partir de 2038, macro de référence, garantie à coût constant) : nouveaux leviers F, nouveau coefficient a de la fonction des revenus.
 * Fonctions pures (les mesures des deux reports hérités basculent temporairement H537 puis le restaurent). Charger (jsc) : la liste de decisions_0811.js, puis decisions_0811.js, ce fichier, puis rapport_correction_0811.js ou test_correction_0811.js.
 */
(function (root) {
  'use strict';
  var R = root.RetraitesAisees0611, K = root.Consolidation0611, T = root.Transmissions0611, Y = root.Decisions0611V72, D = root.Decisions0711, E = root.Decisions0811,
      A = root.Decisions0611V74, ST = root.Stress, Z = root.Optimum, D5 = root.Decisions0511, B5 = root.Decisions0511b, C5 = root.Decisions0511c;

  var HYP = { annee1: 2029, topTransmissions: false };

  /** Les deux reports hérités de la v5 (Md€ de 2025, central, constants de 2029 à 2040) : mesurés en rejouant les deux fonctions avec H537 à zéro. */
  var _h = null;
  function reportsHerites() {
    if (_h) return _h;
    var adj = B5.ajustement(C5.archiV54(0.42), false), z0 = Z.HYP.dureeCreance, d0 = D5.HYP.dureeFlux, avant, apres, adjAvant, adjApres;
    avant = ST.pbStruct('V5', 'central', 6, { sansValeur: true }); adjAvant = adj('central', 6);
    Z.HYP.dureeCreance = 0; D5.HYP.dureeFlux = 0;
    try { apres = ST.pbStruct('V5', 'central', 6, { sansValeur: true }); adjApres = adj('central', 6); } finally { Z.HYP.dureeCreance = z0; D5.HYP.dureeFlux = d0; }
    _h = { diff: apres - avant, plafonds: adjApres - adjAvant, total: (apres - avant) + (adjApres - adjAvant), duree: z0 };
    return _h;
  }

  /** Trésorerie du différé de la fonction du patrimoine actuelle (v7.4 / v7.5) : flux, durée, encours de croisière. */
  function tresorerieV74() { var t = A.tresorerie('central'); return { flux: t.flux, encours: t.encours, duree: A.HYP.paiement.duree, encoursPctPib: t.encoursPctPib }; }

  /** Coût de trésorerie de l'année t (t = 1 pour 2029), Md€ de 2025 : flux − recouvrements. Étalé (HC1) ou à durée fixe (variante). */
  function coutTresorerie(t, o) {
    o = o || {}; var q = tresorerieV74(), flux = o.flux === undefined ? q.flux : o.flux, d = o.duree === undefined ? q.duree : o.duree;
    if (o.dureeFixe) return t <= d ? flux : 0;
    var st = 0, c = 0;
    for (var i = 1; i <= t; i++) { var rec = st / d; c = flux - rec; st = st - rec + flux; }
    return c;
  }
  function encoursAnnee(t, o) {
    o = o || {}; var q = tresorerieV74(), flux = q.flux, d = o.duree === undefined ? q.duree : o.duree, st = 0;
    for (var i = 1; i <= t; i++) st = st - st / d + flux;
    return st;
  }
  /** Écart de la correction au solde de l'année y (Md€ de 2025, + améliore) : on retire les deux reports hérités (jusqu'à 2040), on compte le coût de trésorerie de la v7.4. */
  function correction(y, o) {
    var t = y - 2028; if (t < 1) return 0;
    var h = reportsHerites(), herite = t <= h.duree ? h.total : 0;
    return herite - coutTresorerie(t, o);
  }

  // --- S3 recalibré : copie de Decisions0811.s3 avec (1) la correction du différé dans toutes les trajectoires, (2) transmissions sans montée à 60 % ---
  function pic(t) { var p = 0, a = 0; t.ratio.forEach(function (x, i) { if (i < 30 && x > p) { p = x; a = 2029 + i; } }); return { pic: p, an: a }; }
  function dep3(t) { var a = null; t.deficit.forEach(function (d, i) { if (i < 30 && d > 0.03) a = 2029 + i; }); return a; }
  function s3(v, opts) {
    opts = opts || {}; v = v || D.HYP.defaut;
    var m = opts.macro || 'reference', L = E.lignes(v), e = D.somme(L)[1] + (opts.extra || 0), sansCorr = !!opts.sansCorrection, fixe = !!opts.dureeFixe, top = opts.top === undefined ? HYP.topTransmissions : opts.top;
    var corr = function (y) { return sansCorr ? 0 : correction(y, { dureeFixe: fixe }); };
    var lc0 = Y.leviers(['M1f', 'M2m', 'M3']), u = K.urssaf().v[1] + e, r = R.S.rampe, i0 = r[1] - 2029;
    var lc = function (s, y) { return lc0(s, y) - K.recouvrement('M1f', y).total + u; }, ramp = function (y) { return Math.max(0, Math.min(1, (y - r[0]) / (r[1] - r[0]))); };
    var traj = function (F, mm, extraFn) { return R.trajReforme(function (s, y) { return lc(s, y) + ramp(y) * F + corr(y) + (extraFn ? extraFn(y) : 0); }, mm || m); };
    var ok = function (F) { var t = traj(F); for (var i = i0 + 1; i < 30; i++) if (t.ratio[i] > t.ratio[i0] + 1e-9) return false; return true; };
    var lo = -100, hi = 400; for (var k = 0; k < 55; k++) { var x = (lo + hi) / 2; if (ok(x)) hi = x; else lo = x; } var F = hi;
    var cc = E.courbe(), co = cc.o, tr = T.recette({ A: R.S.transReco.A, K: R.S.transReco.K, top: top, k: 1, nationalite: 'court' }).netActuel, rp = D.recettePension(co, 1).net, eco = R.S.ecoFonct + R.S.eco2[1];
    var autres = tr + R.S.patrimoineNat + rp + eco, f = R.aPourRecette(F - autres, D.HYP.credit), t = traj(F), p = pic(t);
    var prel = f.revenus + f.credit + tr + R.S.patrimoineNat + rp + D.poCouche(L), poMd = R.S.poBase + prel;
    var cas = T.objet(T.casTypesNets(f.bareme, D.HYP.credit)), ret = R.CAS.map(function (pn) { return D.casRetraite(pn, co, true); });
    return { v: v, macro: m, effetCouche: e, lignes: L, F: F, a: f.a, revenus: f.revenus, credit: f.credit, transmissions: tr, patrimoineNat: R.S.patrimoineNat, pension: rp, eco: eco, autres: autres,
             traj: t, pic: p.pic, picAn: p.an, dep3: dep3(t), po: { md: poMd, pct: poMd / R.S.pib, elargisPct: (poMd + R.S.ecartElargis) / R.S.pib }, cas: cas, retraites: ret, bareme: f.bareme,
             trajPrudente: traj(F, 'prudente'), fn: function (y) { return lc({}, y) + ramp(y) * F + corr(y); }, _traj: traj };
  }
  function prudente(v, opts) { var o = JSON.parse(JSON.stringify(opts || {})); o.macro = 'prudente'; return s3(v, o); }
  /** Saut du solde primaire de l'année y à l'année y+1 (points de PIB et Md€ de 2025), lu dans la trajectoire de référence. */
  function saut(s, an) { var i = an - 2029, p = s.traj.primaire, d = p[i + 1] - p[i]; return { points: d, md: d * ST.ECO.pib0 }; }
  /** Clause : celle de la couche 0811, sur les trajectoires corrigées (s._traj compose la correction avec le levier de la clause). */
  function clause(s, opts) { return E.clause(s, opts); }

  var API = { HYP: HYP, reportsHerites: reportsHerites, tresorerieV74: tresorerieV74, coutTresorerie: coutTresorerie, encoursAnnee: encoursAnnee, correction: correction, s3: s3, prudente: prudente, saut: saut, clause: clause };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Correction0811 = API;
})(this);
