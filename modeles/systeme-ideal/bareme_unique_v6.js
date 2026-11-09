/*
 * modeles/systeme-ideal/bareme_unique_v6.js — v6 (05/11/2026, nuit) : « une seule fonction » (décision du 05/11/2026). PROPOSITION, NON ADOPTÉE.
 *   Remplace la présentation en pièces de la v5.10 (taux de base 43/42 %, impôt progressif au-dessus de R0, socle de 350 €, bonus d'activité de 100 €, reprise du socle entre 4 700
 *   et 9 400 €) par UNE fonction par adulte, de son revenu mensuel individuel R (coût employeur + revenus du capital) :
 *       B(R) = S − T(R),   T(R) = m∞·R − (m∞ − m0)·K·(1 − e^(−R/K)),   taux marginal m(R) = m∞ − (m∞ − m0)·e^(−R/K)
 *   (B > 0 : l'État verse ; B < 0 : l'adulte paie). Le taux marginal part de m0 au premier euro et monte continûment vers m∞, sans marche ni seuil (dérivée continue partout).
 *   Paramètres v6 (H6.1) : S = 350 €, m∞ = t + 30 points, m0 = t − 26 points, K = 2 000 €/mois, t = taux du plan (43 % de 2029 à 2044, puis 42 %) : à 43 %, m0 = 17 %, m∞ = 73 %.
 *   Une seule règle de ménage (H6.2) reste à côté : le plancher (877 € par adulte seul, 1 300 € pour un parent seul, 1 754 € pour un couple, montants par enfant compris), retiré
 *   à 25 % du revenu net gagné (la règle de la v5.10, sans son bonus) ; il ne peut pas être fondu dans B sans coût (voir sources/bareme-unique-v6.md § 5).
 * MOTEUR (réutilisé par bareme_deux_fonctions_v7.js) : tout barème `sched` = { S, T(r), m(r) } est comparé à la v5.10 par la même méthode que la v5.10 elle-même (H6.3 à H6.6) :
 *   - bas de la distribution (R < 4 000 €/mois) : adultes non retraités des dixièmes de palier 1 (quadrature de GagnantsPerdantsPalier1.deciles, dispersion 0,3 / 0,6 / 0,9 selon le
 *     scénario), SANS réaction, comme le coût du bonus de la v5.10 (Correctifs.massesDeciles) ;
 *   - haut (R ≥ 4 000 €/mois) : bandes de salariés de modele.js après réactions au taux de la v5.8, réaction du revenu d'activité au changement de taux marginal (élasticités de
 *     hauts_revenus.js H132) et exil des 1 % et 0,1 % supérieurs, comme la reprise du socle de la v5.10 (Decisions0511i.recetteHaut) ;
 *   - plancher : masse « personne seule » × k (k = coût du plancher de la v5.10 / même masse recalculée, ≈ 0,21, calage sur la dépense de prime d'activité, H566 d'optimum.js) ;
 *   - fermeture (H6.6) : la même méthode appliquée au barème de la v5.8 (sans bonus ni reprise) doit retrouver −(résidu officiel de la v5.10) ; l'écart (≈ +0,6 Md€) est retranché.
 * Le module sort : la table et la courbe de B, l'effet sur le solde, le plan de taux, la dette à 10, 20 et 30 ans, les cas types, les taux marginaux, les dixièmes, les pensions.
 * Euros de 2025-2026 ; €/mois pour les cas types, Md€/an pour les masses. Des hypothèses et des ordres de grandeur, jamais des prédictions. Ne modifie AUCUN module existant.
 * Charger (depuis modeles/systeme-ideal/, jsc) : la liste de test_decisions_0511j.js (jusqu'à decisions_0511j.js), puis bareme_unique_v6.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var J = root.Decisions0511j || (req ? req('./decisions_0511j.js') : null);
  var I = root.Decisions0511i || (req ? req('./decisions_0511i.js') : null);
  var H = root.Decisions0511h || (req ? req('./decisions_0511h.js') : null);
  var X = root.DiagnosticCoupleSmic || (req ? req('./diagnostic_couple_smic.js') : null);
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var M = root.SystemeIdeal || (req ? req('./modele.js') : null);
  var GP = root.GagnantsPerdantsPalier1 || (req ? req('../gagnants-perdants/palier1.js') : null);
  var C = root.Correctifs || (req ? req('../gagnants-perdants/correctifs.js') : null);
  var HR = root.HautsRevenus || (req ? req('./hauts_revenus.js') : null);
  var F = (root.Voies || (req ? req('./voies.js') : null)).fus;
  var DM = M.DONNEES, SCS = ['bas', 'central', 'haut'];
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };

  var HYP = {
    t43: 0.43, t42: 0.42, annee1: 2029, anneeFin: 2070,
    // H6.1 : forme et paramètres de la v6 (choisis sous contraintes : solde ≥ v5.10, taux marginal effectif ≤ 75 %, aucun cas modeste perdant, haut contributeur ≥ v5.10)
    S: 350, a: 0.30, b: 0.26, K: 2000,
    // H6.2 : règle de ménage unique (v5.10 sans bonus) : planchers par situation, retrait à α du revenu net gagné
    alpha: 0.25, planchers: { seul: 877, parent: 1300, couple: 1754 }, enfant: 200, majParentIsole: 345,
    // H6.3 : coupure entre la population des dixièmes (bas) et les bandes de salariés (haut), €/mois de R
    coupure: 4000, DISP: { bas: 0.3, central: 0.6, haut: 0.9 },
    // H6.5 : grille de taux du plan (comme la v5.10) ; l'effet est interpolé linéairement entre les points
    grille: [0.38, 0.39, 0.40, 0.41, 0.42, 0.43],
    plafond: 0.75,
    // H6.7 : AAH à taux plein (montant mensuel au 01/04/2025, ⚠️ V14801) ; allocation différentielle maintenue dans la v5.10 (aahDifferentielle) et dans la v6
    aahTauxPlein: 1033.32,
    // v5.10 (decisions_0511j.js) : bonus 100 €, éteint à 1,25 Smic ; reprise du socle de 4 700 à 9 400 €
    bonus: 100, bonusFin: 1.25, ra: 4700, rb: 9400
  };
  var CORR = HR.corr({ ra: HYP.ra, rb: HYP.rb });

  // ======================================================================================================================================
  // 1. La fonction
  // ======================================================================================================================================
  /** Barème à forme exponentielle : q = { S, mInf, m0, K } (taux absolus). */
  function bareme(q) {
    return { S: q.S, mInf: q.mInf, m0: q.m0, K: q.K, creditIS: q.creditIS || 0, kappa: q.kappa === undefined ? 1 : q.kappa, majParentIsole: q.majParentIsole === undefined ? HYP.majParentIsole : q.majParentIsole, enfant: q.enfant === undefined ? HYP.enfant : q.enfant,
      T: function (r) { return q.mInf * r - (q.mInf - q.m0) * q.K * (1 - Math.exp(-r / q.K)); },
      m: function (r) { return q.mInf - (q.mInf - q.m0) * Math.exp(-r / q.K); } };
  }
  function paramsV6(t) { var tt = t === undefined ? HYP.t43 : t; return { S: HYP.S, mInf: tt + HYP.a, m0: tt - HYP.b, K: HYP.K }; }
  function v6(t) { return bareme(paramsV6(t)); }
  function B(r, t) { var s = v6(t); return s.S - s.T(r); }
  /** Table de lecture (€/mois) : B, taux moyen T/R, taux marginal. */
  function table(sched, pts) {
    var s = sched || v6();
    return (pts || [0, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 10000, 20000, 50000]).map(function (r) {
      return { R: r, B: s.S - s.T(r), net: r + s.S - s.T(r), tauxMoyen: r > 0 ? (s.T(r) - s.S) / r : null, marginal: s.m(r) };
    });
  }
  /** Revenu où B s'annule (bissection). */
  function pointNeutre(sched) { var s = sched || v6(), lo = 0, hi = 20000, k; for (k = 0; k < 60; k++) { var m = (lo + hi) / 2; if (s.S - s.T(m) > 0) lo = m; else hi = m; } return lo; }

  // ======================================================================================================================================
  // 2. La v5.10 de référence, adulte par adulte
  // ======================================================================================================================================
  var _P = {};
  function P510(t, sc) { var k = t + '|' + (sc || 'central'); return _P[k] || (_P[k] = M.param(F(GP.config(Z.versOF(Z.archi(J.base(t)))).p, { scenario: sc || 'central' }))); }
  /** Impôt net mensuel de la v5.10 (hors socle) : taux de base + impôt progressif + reprise du socle − bonus d'activité. */
  function N510(r, t, sansReprise) {
    var P = P510(t), v = M.impot(12 * r, P) / 12 - C.bonus(C.brutDeCout(r), HYP.bonus, HYP.bonusFin);
    if (!sansReprise) v += HYP.S * (1 - HR.partSocle(r, CORR));
    return v;
  }
  function m510(r, t) { var P = P510(t); return M.marginal(12 * r, P) + ((r > CORR.ra && r < CORR.rb) ? HYP.S / (CORR.rb - CORR.ra) : 0); }
  function sched510(t) { return { S: HYP.S, T: function (r) { return N510(r, t); }, m: function (r) { return m510(r, t); } }; }
  function sched58(t) { var P = P510(t); return { S: HYP.S, T: function (r) { return M.impot(12 * r, P) / 12; }, m: function (r) { return M.marginal(12 * r, P); } }; }
  /** Plancher de la v5.10 (personne seule) : 527 € retirés à 25 % du gain net, bonus compris. */
  function compl510(r, t) { if (r <= 0) return HYP.planchers.seul - HYP.S; var g = r - M.impot(12 * r, P510(t)) / 12 + C.bonus(C.brutDeCout(r), HYP.bonus, HYP.bonusFin); return Math.max(0, HYP.planchers.seul - HYP.S - HYP.alpha * g); }
  function complS(r, s) { var c0 = Math.max(0, HYP.planchers.seul - s.S); if (r <= 0) return c0; return Math.max(0, c0 - HYP.alpha * (r - s.T(r))); }

  // ======================================================================================================================================
  // 3. Moteur : effet sur le solde par rapport à la v5.10 (Md€/an, croisière)
  // ======================================================================================================================================
  var _dec = {};
  function dec(disp) { return _dec[disp] || (_dec[disp] = GP.deciles(Z.versOF(Z.archi({})), undefined, { dispersion: disp })); }
  function nonRetraites() { return DM.adultes - DM.retraites; }
  function nPlancher() { return DM.rsa.n; }
  /** Bas : Σ (impôt v5.10 − impôt du barème) sur les adultes des dixièmes sous la coupure (coût pour l'État si > 0). */
  function bas(s, t, sc) {
    var d = HYP.DISP[sc], tot = 0;
    dec(d).deciles.forEach(function (x) {
      var nb = x.nonRetraitesM * 1e6 * (1 - x.partSousPlancher), g;
      for (g = 0; g < 5; g++) { var r = x.detail.Rpers * Math.exp(d * GH.z[g] - d * d / 2) / 12; if (r < HYP.coupure) tot += GH.w[g] * nb * 12 * (N510(r, t) - s.T(r)); }
    });
    return tot / 1e9;
  }
  /** Haut : recette supplémentaire (barème − v5.10) sur les bandes de salariés au-dessus de la coupure, après réactions. */
  function haut(s, t, sc) {
    var P = M.param(F(GP.config(Z.versOF(Z.archi(J.base(t)))).p, { scenario: sc })), Sc = M.SCENARIOS[sc], rc = M.recettesCourants(P), tot = 0;
    rc.parBande.forEach(function (b, i) {
      var top = i >= 9, rang = i - 9, sg = top ? 0.15 : P.dispersion, g;
      for (g = 0; g < 5; g++) {
        var mm = Math.exp(sg * GH.z[g] - sg * sg / 2), L = b.L * mm, K = b.K * mm, r = (L + K) / 12; if (r < HYP.coupure) continue;
        var t0 = Math.min(0.99, m510(r, t)), t1 = Math.min(0.99, s.m(r)), f = Math.pow((1 - t1) / (1 - t0), HR.etiBande(i, sc, {}));
        var kap = s.kappa === undefined ? 1 : s.kappa, r1 = (L * f + kap * K) / 12, base = 12 * N510(r, t), ex = 12 * s.T(r1) - base;   // kappa : part des revenus du capital comptée dans R (option H6.10, défaut 1)
        // option « crédit d'IS » (H6.9) : la part φ des revenus du capital qui a déjà supporté l'IS entre dans B pour son montant avant IS, et l'IS payé est déduit (avoir fiscal)
        if (s.creditIS > 0) { var kIS = s.creditIS * K, tIS = DM.isTaux; ex = 12 * s.T((L * f + kap * K + kIS * tIS / (1 - tIS)) / 12) - kIS * tIS / (1 - tIS) - base; }
        if (top && rang >= 3) {
          var q0 = (1 - t0) / (1 - DM.tmefActuel[9]), q1 = (1 - t1) / (1 - DM.tmefActuel[9]);
          var e0 = q0 < 1 ? 1 - 0.8 * (1 - Math.pow(q0, Sc.mobil)) : 1, e1 = q1 < 1 ? 1 - 0.8 * (1 - Math.pow(q1, Sc.mobil)) : 1, qq = e1 / e0;
          ex = qq * ex - (1 - qq) * base;
        }
        tot += GH.w[g] * b.n * ex;
      }
    });
    return tot / 1e9;
  }
  var _k = {};
  /** Facteur de calage du plancher à la dispersion d (coût v5.10 d'optimum.js / masse brute recalculée ici). */
  function kPlancher(t, d) {
    var key = t + '|' + d; if (_k[key]) return _k[key];
    var off = Z.massesPlancher(J.archi(t), d).reduce(function (u, x) { return u + x; }, 0) / 1e9;
    return (_k[key] = off / massePlancher(function (r) { return compl510(r, t); }, d));
  }
  function massePlancher(fn, d) {
    var tot = 0;
    dec(d).deciles.forEach(function (x) { var nb = x.nonRetraitesM * 1e6 * (1 - x.partSousPlancher), g; for (g = 0; g < 5; g++) { var r = x.detail.Rpers * Math.exp(d * GH.z[g] - d * d / 2) / 12; tot += GH.w[g] * nb * 12 * fn(r); } });
    return tot / 1e9;
  }
  /** Coût supplémentaire du plancher (barème − v5.10), Md€ ; les bénéficiaires sans revenu gardent 877 € (le socle et le complément se compensent). */
  function plancher(s, t, sc) {
    var d = HYP.DISP[sc];
    return kPlancher(t, d) * (massePlancher(function (r) { return complS(r, s); }, d) - massePlancher(function (r) { return compl510(r, t); }, d)) - (s.S - HYP.S) * 12 * nPlancher() / 1e9;
  }
  /** Coût du socle différent de 350 € pour tous les adultes non retraités. */
  function socle(s) { return (s.S - HYP.S) * 12 * nonRetraites() / 1e9; }
  /** Coût d'un montant par enfant différent de 200 € (13,855 M d'enfants ; la majoration parent isolé reste à 345 €). */
  function enfants(s) { return ((s.enfant === undefined ? HYP.enfant : s.enfant) - HYP.enfant) * 12 * DM.enfants / 1e9 + ((s.majParentIsole === undefined ? HYP.majParentIsole : s.majParentIsole) - HYP.majParentIsole) * 12 * C.HYP.enfantsMonop / 1e9; }
  function brut(s, t, sc) { var h = haut(s, t, sc), b = bas(s, t, sc), p = plancher(s, t, sc), so = socle(s), en = enfants(s); return { haut: h, bas: b, plancher: p, socle: so, enfants: en, net: h - b - p - so - en }; }
  var _f = {};
  /** Écart de fermeture de la méthode (H6.6) : méthode appliquée à la v5.8 − (−résidu officiel de la v5.10). */
  function fermeture(t, sc) { var k = t + '|' + sc; if (_f[k] !== undefined) return _f[k]; return (_f[k] = brut(sched58(t), t, sc).net + J.mesure(t, sc).residu); }
  /** Effet sur le solde (Md€/an) du barème s par rapport à la v5.10, au taux de référence t et au scénario sc. */
  function effet(s, t, sc) { var tt = t === undefined ? HYP.t42 : t, ss = sc || 'central', r = brut(s, tt, ss); r.fermeture = fermeture(tt, ss); r.effet = r.net - r.fermeture; return r; }

  // ======================================================================================================================================
  // 4. Solde, plan de taux, dette de la v6
  // ======================================================================================================================================
  var _e6 = {};
  function effetV6Point(t, sc) { var k = t + '|' + sc; return _e6[k] !== undefined ? _e6[k] : (_e6[k] = effet(v6(t), t, sc).effet); }
  function effetV6(t, sc) {
    var g = HYP.grille, n = g.length, j = Math.min(n - 2, Math.max(0, Math.floor((t - g[0]) / 0.01 + 1e-9))), w = (t - g[j]) / (g[j + 1] - g[j]);
    return effetV6Point(g[j], sc) * (1 - w) + effetV6Point(g[j + 1], sc) * w;
  }
  function solde(sc, an, t) { var tt = t === undefined ? HYP.t42 : t; return J.solde(sc, an, tt) + (an < HYP.annee1 ? 0 : effetV6(tt, sc)); }
  function soldeGrille(y, t) { return J.soldeGrille(y, t) + effetV6(t, 'central'); }
  function parcours(ft) {
    var y, cum = 0, pic = 0, picAn = null;
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) { cum += soldeGrille(y, ft(y)); if (cum < pic - 1e-9) { pic = cum; picAn = y; } }
    return { picDuCumul: pic, picAn: picAn, cumulFinal: cum };
  }
  function periodeMinimale43() { var b; for (b = HYP.annee1; b <= HYP.anneeFin; b++) if (parcours(J.planTaux(b)).picAn === null) return b; return null; }
  function dette(sc, ft) {
    var f = ft || J.planTaux(periodeMinimale43());
    return H.jalonsDette(sc, { taux: f, net: function (s, y) { return H.net(s, y) + (y < HYP.annee1 ? 0 : J.residu(f(y), s) + effetV6(f(y), s)); } });
  }
  function planTransition() {
    var b = periodeMinimale43(), ft = J.planTaux(b), out = { b: b, ans: b === null ? null : b - HYP.annee1 + 1, parcours: parcours(ft), dette: {}, detteV510: {} };
    SCS.forEach(function (s) { out.dette[s] = dette(s, ft); out.detteV510[s] = J.dette(s); });
    return out;
  }

  // ======================================================================================================================================
  // 5. Ménages : cas types (€/mois)
  // ======================================================================================================================================
  /** Règle de ménage de la v6 : celle de la v5.10 (planchers 877 / 1 300 / 1 754 €, α = 25 %), avec sa convention pour les couples biactifs (H6.2). */
  var REGLE_V6 = { planchers: HYP.planchers, alpha: HYP.alpha, conventionV510: true };
  /** Revenu disponible d'un ménage sous le barème s : spec = { revenus: [R par adulte], enfants, situation: 'seul' | 'parent' | 'couple' }. Retraités : voir pensions(). */
  function menage(s, spec, regle) {
    var R = regle || REGLE_V6, n = spec.revenus.length, e = spec.enfants || 0, sit = spec.situation || (n === 2 ? 'couple' : (e > 0 ? 'parent' : 'seul'));
    var enf = (s.enfant === undefined ? HYP.enfant : s.enfant) * e + (sit === 'parent' ? (s.majParentIsole === undefined ? HYP.majParentIsole : s.majParentIsole) * e : 0), ind = 0, gain = 0, kap = s.kappa === undefined ? 1 : s.kappa;
    spec.revenus.forEach(function (r, i) { var k = (spec.capital && spec.capital[i]) || 0, rr = r + kap * k; ind += r + k + s.S - s.T(rr); gain += r + k - s.T(rr); });
    var c0 = Math.max(0, R.planchers[sit] - (n * s.S + (R.horsEnfants ? 0 : enf))), compl = c0 > 0 ? Math.max(0, c0 - R.alpha * gain) : 0;
    // convention de la v5.10 (cas types de decisions_0511i.js) : pas de plancher pour un couple dont les deux adultes ont un revenu
    if (R.conventionV510 && n === 2 && spec.revenus[0] > 0 && spec.revenus[1] > 0) compl = 0;
    return { revenu: ind + enf + compl, individuel: ind, enfants: enf, plancher: compl };
  }
  // Droit actuel des salariés seuls par salaire net (OpenFisca-France 2026, locataire zone 2 ; generer_variante_seuil_0511.py, repris de variante_seuil_0511.js)
  var NET_ACTUEL = {
    1500: { brut: 1894.91, rd: 1722.75 }, 1750: { brut: 2210.72, rd: 1868.44 }, 2000: { brut: 2526.55, rd: 1976.51 }, 2500: { brut: 3158.16, rd: 2356.75 }, 3000: { brut: 3790.30, rd: 2735.50 }
  };
  var OFFICIELS = ['couple_2smic_2enf', 'couple_2smic_0enf', 'parent_isole_smic', 'smic_seul', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000'];
  function specOfficiel(id) { var sp = I.spec(id); return { revenus: sp.couts, enfants: sp.enfants, situation: sp.adultes === 2 ? 'couple' : (sp.enfants > 0 ? 'parent' : 'seul') }; }
  /** v5.10 d'un salarié seul au brut b (méthode de variante_seuil_0511.js casNet). */
  function seul510(brut, t) {
    var a = J.archi(t), c = I.coutMois(brut), sp = { adultes: 1, enfants: 0, couts: [c], type: 'seul', isole: false, ppa: 0 };
    return X.foyer(a, sp, {}).apres - I.impotHaut(12 * c, J.CORR, X.pSys(a).socle) / 12;
  }
  /**
   * Cas types : avant (droit actuel), v5.10 et barème s. Les cas sans droit actuel calculé (indépendant) ont avant = null. Sans emploi : 877 € (T14) partout ;
   * AAH : allocation différentielle maintenue dans la v5.10 et ici (écart nul par construction, H6.7) ; retraités : voir pensions().
   */
  function casTypes(s, t, regle) {
    var tt = t === undefined ? HYP.t43 : t, a510 = J.archi(tt), out = [];
    OFFICIELS.forEach(function (id) {
      var av = I.avant(id, a510), v5 = I.apres(a510, id, {}, J.CORR), v = menage(s, specOfficiel(id), regle).revenu;
      out.push({ id: id, libelle: I.HYP.OF_CAS[id].libelle, avant: av, v510: v5, apres: v, ecartV510: v5 - av, ecart: v - av, versV510: v - v5 });
    });
    [1500, 1750, 2000, 2500, 3000].forEach(function (n) {
      var o = NET_ACTUEL[n], c = I.coutMois(o.brut), v5 = seul510(o.brut, tt), v = menage(s, { revenus: [c] }, regle).revenu;
      out.push({ id: 'net_' + n, libelle: 'Salarié seul à ' + n + ' € net actuels', avant: o.rd, v510: v5, apres: v, ecartV510: v5 - o.rd, ecart: v - o.rd, versV510: v - v5 });
    });
    var v0 = menage(s, { revenus: [0] }, regle).revenu;
    out.push({ id: 'sans_emploi', libelle: 'Personne seule sans emploi (RSA + aide au logement)', avant: 877, v510: 877, apres: v0, ecartV510: 0, ecart: v0 - 877, versV510: v0 - 877 });
    var aah = HYP.aahTauxPlein, aa = Math.max(aah, v0);
    out.push({ id: 'aah', libelle: 'Allocataire de l\'AAH à taux plein, seul, sans autre revenu (allocation différentielle maintenue)', avant: aah, v510: aah, apres: aa, ecartV510: 0, ecart: aa - aah, versV510: aa - aah });
    // Indépendant : 3 000 € par mois de revenu d'activité (assiette du modèle : revenu mixte avant prélèvements) ; rentier : 5 000 € par mois de revenus du capital
    var ind5 = 3000 + HYP.S - N510(3000, tt), ind6 = menage(s, { revenus: [3000] }, regle).revenu;
    out.push({ id: 'independant_3000', libelle: 'Indépendant, 3 000 € par mois de revenu d\'activité (avant prélèvements)', avant: null, v510: ind5, apres: ind6, ecartV510: null, ecart: null, versV510: ind6 - ind5 });
    var ren5 = 5000 + HYP.S - (M.impot(12 * 5000, P510(tt)) / 12 + HYP.S * (1 - HR.partSocle(5000, CORR))), ren6 = menage(s, { revenus: [0], capital: [5000] }, regle).revenu, renAv = 5000 * (1 - 0.314);
    out.push({ id: 'rentier_5000', libelle: 'Rentier, 5 000 € par mois de dividendes et d\'intérêts (actuel : PFU de 31,4 %)', avant: renAv, v510: ren5, apres: ren6, ecartV510: ren5 - renAv, ecart: ren6 - renAv, versV510: ren6 - ren5 });
    return out;
  }
  function casTypesObjet(s, t, regle) { var o = {}; casTypes(s, t, regle).forEach(function (c) { o[c.id] = c; }); return o; }

  // ======================================================================================================================================
  // 6. Taux marginaux effectifs
  // ======================================================================================================================================
  /** TME d'une personne seule à R (plancher compris) : 1 − Δrevenu / ΔR sur +10 €. */
  function tmeSeul(s, r, R) { var h = 10; return 1 - (menage(s, { revenus: [r + h] }, R).revenu - menage(s, { revenus: [r] }, R).revenu) / h; }
  /** Profil et maximum du TME (personne seule, second adulte d'un couple dont l'autre est au Smic, et sommet). */
  function tme(s, R) {
    var Mn = function (sp) { return menage(s, sp, R).revenu; };
    var cs = I.coutMois(I.HYP.OF_CAS.smic_seul.brut[0]), best = { taux: 0, R: 0, cas: '' }, RR, pts = [];
    for (RR = 0; RR <= 200000; RR += RR < 10000 ? 25 : 500) {
      var ts = tmeSeul(s, RR, R), tc = RR === 0 ? 0 : 1 - (Mn({ revenus: [cs, RR + 10] }) - Mn({ revenus: [cs, RR] })) / 10;   // R = 0 du second adulte : falaise de la convention v5.10, rapportée par participation
      if (ts > best.taux) best = { taux: ts, R: RR, cas: 'seul' }; if (tc > best.taux) best = { taux: tc, R: RR, cas: 'second adulte' };
    }
    [500, 1000, 1500, 1988, 2500, 3000, 4000, 5000, 7000, 10000, 20000, 50000].forEach(function (r) { pts.push({ R: r, seul: tmeSeul(s, r, R), bareme: s.m(r) }); });
    var b0 = I.HYP.OF_CAS.smic_seul.brut[0], b1 = I.HYP.OF_CAS.smic_seul_1_1.brut[0], c0 = I.coutMois(b0), c1 = I.coutMois(b1);
    var smic = 1 - (Mn({ revenus: [c1] }) - Mn({ revenus: [c0] })) / (c1 - c0);
    // participation : part du coût employeur perdue en passant de 0 à x Smic (personne seule ; second adulte d'un couple au Smic, 2 enfants)
    var part = [0.25, 0.5, 1].map(function (x) { var c = I.coutMois(x * b0), r0 = Mn({ revenus: [0] }), r1 = Mn({ revenus: [c] }), q0 = Mn({ revenus: [cs, 0], enfants: 2 }), q1 = Mn({ revenus: [cs, c], enfants: 2 });
      return { x: x, seul: 1 - (r1 - r0) / c, gainSeul: r1 - r0, secondAdulte: 1 - (q1 - q0) / c, gainSecond: q1 - q0 }; });
    var trappes = part.filter(function (p) { return p.gainSeul <= 0 || p.gainSecond <= 0 || p.seul >= 0.9 || p.secondAdulte >= 0.9; });
    return { max: best, smic: smic, profil: pts, participation: part, trappes: trappes, asymptote: s.mInf };
  }

  // ======================================================================================================================================
  // 7. Gagnants et perdants par dixième de niveau de vie (adultes non retraités, quadrature de palier 1, central)
  // ======================================================================================================================================
  /** Écart barème − v5.10 par dixième (€/UC/mois) et part des adultes perdants ; sansReprise : référence = v5.10 sans la reprise (pour combiner avec optimum.deciles). */
  function deciles(s, t, sansReprise) {
    var tt = t === undefined ? HYP.t42 : t, d = HYP.DISP.central, k = kPlancher(tt, d), out = [];
    dec(d).deciles.forEach(function (x) {
      var nb = x.nonRetraitesM * 1e6 * (1 - x.partSousPlancher), g, tot = 0, perd = 0;
      for (g = 0; g < 5; g++) {
        var r = x.detail.Rpers * Math.exp(d * GH.z[g] - d * d / 2) / 12;
        var dl = (N510(r, tt, sansReprise) - s.T(r)) + (s.S - HYP.S) + k * (complS(r, s) - compl510(r, tt)) + ((s.enfant === undefined ? HYP.enfant : s.enfant) - HYP.enfant) * DM.enfants / (DM.adultes - DM.retraites);
        tot += GH.w[g] * nb * dl; if (dl < -1) perd += GH.w[g];
      }
      out.push({ decile: x.decile, ecartMoisUC: tot / (x.uc * 1e6), partPerdants: perd, rdbMoisUC: x.rdbMois });
    });
    return out;
  }
  /** Écart barème − v5.10 par bande de salariés (€/mois par adulte, mécanique, avant réactions) : le haut que les dixièmes représentent mal. */
  function bandes(s, t) {
    var tt = t === undefined ? HYP.t42 : t, rc = M.recettesCourants(P510(tt));
    return rc.parBande.map(function (b) { var r = (b.L + b.K) / 12; return { id: b.id, R: r, ecart: N510(r, tt) - s.T(r), part: (N510(r, tt) - s.T(r)) / (r + HYP.S - N510(r, tt)) }; });
  }

  // ======================================================================================================================================
  // 8. Pensions dans la fonction (option, H6.8) : regroupement à net constant jusqu'au seuil protégé P*, au-delà part ρ du dépassement regroupée
  // ======================================================================================================================================
  function interp(pts, x) { var n = pts.length, i; if (x <= pts[0][0]) return pts[0][1]; if (x >= pts[n - 1][0]) return pts[n - 1][1]; for (i = 1; i < n; i++) if (x <= pts[i][0]) return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); return pts[n - 1][1]; }
  /** Pension nette actuelle (€/mois) d'une pension brute p : CSG + IR lus sur les cas types T14 (modele.js tauxPensionActuel). */
  function pensionNetteActuelle(p) { return p * (1 - interp(DM.tauxPensionActuel, p)); }
  /** Pension « regroupée » x telle que x + B(x) = y (bissection ; B croissante en net car m < 1). */
  function regrouper(s, y) { var lo = 0, hi = 50000, k; for (k = 0; k < 80; k++) { var m = (lo + hi) / 2; if (m + s.S - s.T(m) < y) lo = m; else hi = m; } return (lo + hi) / 2; }
  /** Pension nette dans la fonction pour une pension brute actuelle p, seuil protégé Pstar (€ brut), part regroupée ρ du dépassement. */
  function pensionDansB(s, p, Pstar, rho) {
    var Ps = Pstar === undefined ? 2500 : Pstar, rh = rho === undefined ? 1 : rho;
    if (p <= Ps) { var x = regrouper(s, pensionNetteActuelle(p)); return { brutB: x, net: x + s.S - s.T(x) }; }
    var xs = regrouper(s, pensionNetteActuelle(Ps)), xf = regrouper(s, pensionNetteActuelle(p)), x2 = xs + rh * (xf - xs) + (1 - rh) * (p - Ps);
    return { brutB: x2, net: x2 + s.S - s.T(x2) };
  }
  /** Gagnants et perdants par dixième de pension (16,5 M de retraités, valeurs de modele.js pensionDecile) et rendement (Md€/an, sans comportement). */
  function pensions(s, Pstar, rho) {
    var Nr = DM.retraites / 10, tot = 0, out = [], d;
    for (d = 0; d < 10; d++) {
      var p = M.pensionDecile(d), av = pensionNetteActuelle(p), r = pensionDansB(s, p, Pstar, rho), e = r.net - av;
      tot += -e * Nr * 12 / 1e9; out.push({ decile: d + 1, pensionBrute: p, netActuel: av, brutDansB: r.brutB, netDansB: r.net, ecart: e, ecartPct: e / av });
    }
    return { parDecile: out, rendementMd: tot, Pstar: Pstar === undefined ? 2500 : Pstar, rho: rho === undefined ? 1 : rho };
  }

  var API = { HYP: HYP, CORR: CORR, SCS: SCS, bareme: bareme, paramsV6: paramsV6, v6: v6, B: B, table: table, pointNeutre: pointNeutre, P510: P510, N510: N510, m510: m510,
              sched510: sched510, sched58: sched58, compl510: compl510, complS: complS, bas: bas, haut: haut, plancher: plancher, socle: socle, enfants: enfants, kPlancher: kPlancher, brut: brut,
              fermeture: fermeture, effet: effet, effetV6: effetV6, solde: solde, soldeGrille: soldeGrille, parcours: parcours, periodeMinimale43: periodeMinimale43, dette: dette,
              planTransition: planTransition, REGLE_V6: REGLE_V6, menage: menage, NET_ACTUEL: NET_ACTUEL, OFFICIELS: OFFICIELS, casTypes: casTypes, casTypesObjet: casTypesObjet, tme: tme, tmeSeul: tmeSeul,
              deciles: deciles, bandes: bandes, pensionNetteActuelle: pensionNetteActuelle, regrouper: regrouper, pensionDansB: pensionDansB, pensions: pensions };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.BaremeUniqueV6 = API;
})(this);
