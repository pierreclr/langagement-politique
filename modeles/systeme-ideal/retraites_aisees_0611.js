/*
 * modeles/systeme-ideal/retraites_aisees_0611.js — COUCHE posée sur la base de travail du 06/11/2026 (base_0611.js), la couche « mutuelle comptée » (cas_types_nets_0611.js),
 * la couche transmissions (transmissions_0611.js, jeu JR) et la couche économies de fonctionnement (T66, niveau 1 : 0,4465 Md€). NON ADOPTÉE : Claude propose, l'auteur tranche.
 *
 * Objet : une CONTRIBUTION DES RETRAITÉS AISÉS qui reprend une partie de leur gain (fin de la mutuelle, pension nette constante : +89 à +162 €/mois dans les cas types)
 * au-dessus d'un seuil de pension, dans l'esprit de la position de l'auteur du 01/11/2026 (un minimum garanti pour tous les retraités, des pensions comparables pour la plupart,
 * mais une contribution des hautes pensions, surtout quand le retraité a déjà du capital) et de l'arbitrage 40 (stabiliser la dette, baisser légèrement les retraites).
 *   - contribution = taux × (pension nette − seuil) si la pension dépasse le seuil ; rien en dessous (garde-fou : aucun retraité sous le seuil ne perd par rapport à aujourd'hui) ;
 *   - option « avec capital » : pour les retraités AU-DESSUS du seuil seulement, les revenus du capital entrent dans l'assiette, au même taux (le garde-fou tient : sous le seuil
 *     de pension, le capital n'est pas visé) ; réaction du capital par la règle de bareme_v71.js (X.reagir), recette nette de la perte induite sur la fonction des revenus ;
 *   - variantes : seuils 1 500 / 2 000 / 2 500 € nets par mois ; taux 10 / 20 / 30 % ; avec ou sans capital ;
 *   - jeu combiné : contribution + transmissions (A = 300 000 €) + impôt de suite « court terme » + crédit d'IS (50 % comme JR, ou entier) + économies de fonctionnement,
 *     fonction des revenus réglée au plus juste (a = m∞) pour une dette stable en macro de référence (transmissions_0611.js, jeu).
 * Hypothèses HRA1 à HRA10 : sources/retraites-aisees-0611.md ; vérifications V18600 à V18699. Fonctions pures ; ne modifie AUCUN module existant.
 * Charger (jsc) : la liste de test_transmissions_0611.js sans le test, puis ce fichier (ordre complet en tête de test_retraites_aisees_0611.js).
 */
(function (root) {
  'use strict';
  var B = root.BaseTravail0611, N = root.CasTypesNets0611, T = root.Transmissions0611, R2 = root.Retraites2, DS = root.VarianteDetteStable, M = root.SystemeIdeal,
      X = root.BaremeV71, V = root.BaremeUniqueV6, A = root.Decisions0611V74, Y = root.Decisions0611V72, ST = root.Stress;

  // ======================================================================================================================================
  // 0. Données et hypothèses
  // ======================================================================================================================================
  var S = {
    nRetraites: M.DONNEES.retraites,   // 16,5 M de retraités (modele.js ; DREES) ⚠️ V18600
    // distribution des pensions nettes totales (droit direct + réversion + majoration enfants), DREES EIR 2020 tableau 7 (retraites2.js), revalorisée × 1,155 vers 2025 (H96) ⚠️ V18601
    // revenus du capital des retraités : 20 % du capital courant du modèle (402,5 Md€), clé par décile de pension 3-5-6-6-7-9-10-12-16-26 % (H134, jeu « recherche ») ⚠️ V18602
    ecoFonct: 0.4465,                  // économies de fonctionnement, niveau 1 (sources/economies-fonctionnement.md ; couche ECOFONC0611 du bilan)
    patrimoineNat: 2.28,               // impôt de suite « court terme » sur la fonction du patrimoine (TR03)
    transReco: { A: 3e5, K: 1e5, top: true },   // fonction des transmissions du jeu JR (TR01)
    ageCas: 70,                        // âge des cas types retraités (prime individuelle de 132 €/mois en 2026, cas_types_nets_0611.js)
    // scénarios (demande de l'auteur, 06/11/2026) : prélèvements obligatoires de la base de travail (bilan_global.py PO_BASE) et écart « élargis » (po_elargis : réglementés 10,2175 − 0,5)
    poBase: 1467.9052702045717, ecartElargis: 10.2175 - 0.5, pib: 2935.0,
    eco2: [0.9, 1.9, 4.9],             // HRA9 : économies de fonctionnement de niveau 2 (sources/economies-fonctionnement.md § 1 : 1,9 Md€ net de recouvrements au central ; NON comptées dans S1, S2)
    rampe: [2029, 2038]                // HRA10 : S3 : leviers nouveaux montés linéairement de 0 (2029, bascule neutre) à 100 % (2038)
  };
  var HYP = {
    seuils: [1500, 2000, 2500],        // HRA1 : seuils de pension nette mensuelle (€ 2025)
    taux: [0.10, 0.20, 0.30],          // HRA2 : taux sur la part au-dessus du seuil
    // HRA3 : fuite sur la contribution assise sur les pensions (expatriation, cumul emploi-retraite en moins, optimisation) : 3 / 8 / 15 % (retraites2.js SCEN, H98)
    fuitePension: [R2.SCEN.bas.fuitePension, R2.SCEN.central.fuitePension, R2.SCEN.haut.fuitePension],
    // HRA4 : réaction du capital à la hausse du taux marginal (règle H71.4 de bareme_v71.js, scénarios bas / central / haut de modele.js) ; perte induite sur la fonction des revenus déduite ;
    //        défavorable = la plus forte des réactions « haut » et « central » (le plancher rk ≥ 0,2 de niveauCapital borne la réaction du scénario « haut » aux marginaux élevés)
    scenCapital: ['bas', 'central', 'haut'],
    // HRA5 : la contribution est assise sur la pension nette actuelle (avant R1f) ; la sous-indexation R1f (déjà dans la combinaison de la base) s'ajoute dans les cas types
    // HRA6 : effet constant dès 2029 (convention de base_0611.js dette) ; la hausse du nombre de retraités et des pensions n'est pas projetée
    // HRA7 : marginal de la fonction des revenus sur le capital d'un retraité = s.m(x), x = pension regroupée (comme BaremeV71.retraitesCapital)
    capitalCas: 15000                  // HRA8 : cas type « avec capital » : 500 000 € de patrimoine financier à 3 % = 15 000 €/an de revenus du capital
  };
  var SCN = ['favorable', 'central', 'defavorable'];

  // ======================================================================================================================================
  // 1. Points de la distribution (pension nette 2025, poids, décile de pension, revenus du capital annuels)
  // ======================================================================================================================================
  var _pts = null;
  function points() {
    if (_pts) return _pts;
    _pts = R2.points().map(function (p) { return { pn: p.x * R2.REVAL, w: p.w, decile: p.decile, K: R2.capitalDecile(p.decile, 'recherche') }; });
    return _pts;
  }
  /** Contribution mensuelle brute (avant fuite, avant réaction) d'un retraité de pension nette pn (€/mois) et de revenus du capital K (€/an). o = { seuil, taux, capital } */
  function contributionIndiv(pn, K, o) {
    if (pn <= o.seuil) return { pension: 0, capital: 0, total: 0 };
    var cp = o.taux * (pn - o.seuil), cc = o.capital ? o.taux * (K || 0) / 12 : 0;
    return { pension: cp, capital: cc, total: cp + cc };
  }
  var _s0 = null;
  function sched0() { if (!_s0) _s0 = X.sched(B.bareme0()); return _s0; }
  var _t0 = {};
  /** Marginal de la fonction des revenus sur le capital d'un retraité de pension nette pn (barème de la base). */
  function marginalCapital(pn) {
    var k = Math.round(pn); if (_t0[k] !== undefined) return _t0[k];
    var s = sched0(), x = V.regrouper(s, pn);
    return (_t0[k] = Math.min(0.99, s.m(x)));
  }
  var _R = {};
  /**
   * Recette annuelle (Md€) au scénario k (0 favorable, 1 central, 2 défavorable) :
   *   pension : brute × (1 − fuite) ; capital : taux × K1 − t0 × (K − K1), K1 = K réagi au passage de t0 à t0 + taux (perte induite sur la fonction des revenus déduite).
   * Rend aussi le nombre de retraités concernés et la part de la masse des pensions prélevée.
   */
  function recette(o, k) {
    k = k === undefined ? 1 : k;
    var key = o.seuil + '|' + o.taux + '|' + !!o.capital + '|' + k; if (_R[key]) return _R[key];
    var Sc = M.SCENARIOS[HYP.scenCapital[k]], bp = 0, bc = 0, nc = 0, cs = 0, masse = 0, cstat = 0;
    points().forEach(function (p) {
      masse += p.w * p.pn;
      if (p.pn <= o.seuil) return;
      nc += p.w; bp += p.w * o.taux * (p.pn - o.seuil);
      if (o.capital && p.K > 0) {
        var t0 = marginalCapital(p.pn), t1 = Math.min(0.99, t0 + o.taux), K1 = X.reagir(p.K, t0, t1, Sc);
        if (k === 2) K1 = Math.min(K1, X.reagir(p.K, t0, t1, M.SCENARIOS.central));   // plancher rk ≥ 0,2 de bareme_v71.js : le scénario « haut » peut réagir moins que le central (HRA4)
        bc += p.w * (o.taux * K1 - t0 * (p.K - K1)) / 12; cstat += p.w * o.taux * p.K / 12;
      }
    });
    var f = 12 * S.nRetraites / 1e9;
    return (_R[key] = { o: o, k: k, pensionBrute: bp * f, pensionNette: bp * f * (1 - HYP.fuitePension[k]), capitalStatique: cstat * f, capitalNet: bc * f,
                        net: bp * f * (1 - HYP.fuitePension[k]) + bc * f, statique: (bp + cstat) * f, concernes: nc * S.nRetraites, partConcernes: nc,
                        partMassePensions: bp / masse });
  }
  function trois(o) { return [0, 1, 2].map(function (k) { return recette(o, k); }); }
  /** Grille des 18 variantes (3 seuils × 3 taux × avec / sans capital). */
  function variantes() {
    var out = [];
    HYP.seuils.forEach(function (s) { HYP.taux.forEach(function (t) { [false, true].forEach(function (c) { var o = { seuil: s, taux: t, capital: c }; out.push({ o: o, r: trois(o) }); }); }); });
    return out;
  }
  /** Part des retraités sous un seuil (contrôle : 82 % sous 2 500 €, arbitrage 10 / HDS6). */
  function partSous(seuil) { return points().reduce(function (a, p) { return a + (p.pn <= seuil ? p.w : 0); }, 0); }
  function pensionMoyenne() { return points().reduce(function (a, p) { return a + p.w * p.pn; }, 0); }

  // ======================================================================================================================================
  // 2. Cas types retraités (revenu net santé, mutuelle comptée : prime individuelle à 70 ans ; R1f de la combinaison)
  // ======================================================================================================================================
  var CAS = [1200, 2000, 3000, 4000];
  /** Écart mensuel au droit actuel (revenu net santé) d'un retraité seul de pension nette pn, sans capital, sous la contribution o (null = sans contribution). */
  function casRetraite(pn, o, age, sansR1f) {
    var prime = N.primeIndividuelle(age || S.ageCas, 1), r1 = sansR1f ? 0 : DS.perteIndiv('R1f', pn, 0), c = o ? contributionIndiv(pn, 0, o).total : 0, avantNet = pn - prime;
    return { pn: pn, prime: prime, r1f: r1, contribution: c, avantNet: avantNet, ecartNet: prime - r1 - c, pctNet: (prime - r1 - c) / avantNet, partGainRepris: c / prime };
  }
  /** Pension à partir de laquelle le retraité (sans capital) perd par rapport à aujourd'hui : prime = R1f + contribution. */
  function pensionBascule(o, age) {
    var lo = o.seuil, hi = 50000;
    if (casRetraite(hi, o, age).ecartNet > 0) return null;
    for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (casRetraite(m, o, age).ecartNet > 0) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  /** Contribution mensuelle sur le capital d'un retraité au-dessus du seuil avec K € de revenus du capital par an (statique). */
  function contributionCapitalCas(pn, K, o) { return contributionIndiv(pn, K, o).capital; }

  // ======================================================================================================================================
  // 3. Jeu combiné : transmissions + impôt de suite + crédit d'IS + économies + contribution, fonction des revenus au plus juste (dette stable, macro de référence)
  // ======================================================================================================================================
  /** o = { contrib: {seuil, taux, capital} | null, c: crédit d'IS (0,5 ou 1), eco: économies (défaut 0,4465) } */
  function jeu(o) {
    var eco = o.eco === undefined ? S.ecoFonct : o.eco, rc = o.contrib ? recette(o.contrib, 1).net : 0;
    var j = T.jeu({ cadre: 'equilibre', trans: S.transReco, c: o.c, nationalite: 'court', patrimoine: S.patrimoineNat + eco + rc });
    var cas = T.objet(j.cas);
    var ret = CAS.map(function (pn) { return casRetraite(pn, o.contrib); });
    return { o: o, a: j.a, revenus: j.revenus, transmissions: j.transmissions.netActuel, credit: j.credit, contribution: rc, eco: eco, patrimoineNat: S.patrimoineNat, effet: j.effet,
             manque0: j.manque0, manque: j.manque, cas: cas, retraites: ret, bareme: j.bareme };
  }

  // ======================================================================================================================================
  // 4. Trois scénarios (demande de l'auteur, 06/11/2026) : S1 réforme neutre ; S2 dette stable ; S3 neutre d'abord, dette stabilisée en dix ans
  // ======================================================================================================================================
  /** Droit actuel dans le modèle de dette (risques/stress.js, architecture ACTUEL : solde structurel de 2024, −169,1 Md€ de 2025, conservé) : ratio dette / PIB, années 2029 à 2070. */
  function trajActuel(m) {
    return DS.avecMacro(m || 'reference', function () {
      var E = ST.ECO, g = E.gNominal, Dt = E.dette0, ieff = E.interets0 / E.dette0, u, k, out = [], def = [];
      for (u = 1; u <= ST.PREROLL; u++) { ieff = ieff + (E.imarche - ieff) / E.dureeDette; Dt = Dt - ((-169.1 + E.interets0) * Math.pow(1 + g, u) - ieff * Dt); }
      var r0 = Dt / (E.pib0 * Math.pow(1 + g, ST.PREROLL));
      for (k = 1; k <= 42; k++) { var kk = Math.pow(1 + g, k + ST.PREROLL), prev = Dt; ieff = ieff + (E.imarche - ieff) / E.dureeDette; Dt = Dt - ((-169.1 + E.interets0) * kk - ieff * Dt); out.push(Dt / (E.pib0 * kk)); def.push((Dt - prev) / (E.pib0 * kk)); }
      return { ratio0: r0, ratio: out, deficit: def };
    });
  }
  var _T0 = null;
  function effetBase() { if (_T0 === null) _T0 = B.totaux().central; return _T0; }
  /** Trajectoire de la réforme : base de travail (corrections T65 + lignes BT) + leviers lev(s, an) (Md€ de 2025, + améliore). */
  function trajReforme(lev, m) { return A.trajectoire('central', m || 'reference', function (s, y) { return B.S.corrT65 + effetBase() + (lev ? lev(s, y) : 0); }); }
  /** Marge de neutralité : plus grand x (Md€/an constant dès 2029) qu'on peut retirer du solde en gardant la dette / PIB de la réforme sous celle du droit actuel chaque année pendant 30 ans. */
  function margeNeutre(lev, m) {
    var a = trajActuel(m), ok = function (x) { var t = trajReforme(function (s, y) { return (lev ? lev(s, y) : 0) - x; }, m); for (var i = 0; i < 30; i++) if (t.ratio[i] > a.ratio[i] + 1e-9) return false; return true; };
    var lo = -300, hi = 300; for (var k = 0; k < 50; k++) { var x = (lo + hi) / 2; if (ok(x)) lo = x; else hi = x; } return lo;
  }
  /** Barème de la fonction des revenus (a = m∞) qui rapporte `cible` Md€ par rapport à la base, crédit d'IS c compris (0 si c = 1). */
  function aPourRecette(cible, c) {
    var r0 = B.recetteRevenus(B.bareme0()), f = function (a) { var q = T.baremeA(a); return B.recetteRevenus(q) - r0 + (c < 1 ? T.credit(c, q).total : 0) - cible; };
    var lo = 0.40, hi = 0.95; for (var i = 0; i < 45; i++) { var m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; }
    var a = (lo + hi) / 2, q = T.baremeA(a); return { a: a, bareme: q, revenus: B.recetteRevenus(q) - r0, credit: c < 1 ? T.credit(c, q).total : 0 };
  }
  function po(prel) { var p = S.poBase + prel; return { md: p, pct: p / S.pib, elargisPct: (p + S.ecartElargis) / S.pib }; }
  function resume(cas, contrib, sansR1f) {
    var o = T.objet(cas);
    return { cas: o, retraites: CAS.map(function (pn) { return casRetraite(pn, contrib, null, sansR1f); }) };
  }
  /** S1 : aucun levier (base de travail, a = 0,65, crédit d'IS entier) ; marge de neutralité ; variante « au plus juste » : la marge rendue par la fonction des revenus. */
  function scenarioS1() {
    var marge = margeNeutre(null), cas0 = T.casTypesNets(B.bareme0(), 1), plus = aPourRecette(-marge, 1), casP = T.casTypesNets(plus.bareme, 1);
    var t0 = trajReforme(null), tP = trajReforme(function () { return -marge; });
    return { marge: marge, base: { a: B.bareme0().mInf, po: po(0), traj: t0, r: resume(cas0, null, true) },
             plusJuste: { a: plus.a, revenus: plus.revenus, po: po(plus.revenus), traj: tP, r: resume(casP, null, true) }, actuel: trajActuel() };
  }
  /** S2 : dette stable en macro de référence (jeu recommandé : contribution 2 500 €, 20 %, avec capital ; transmissions ; impôt de suite ; crédit 50 % ; économies de niveau 1). */
  function scenarioS2(o) {
    o = o || { contrib: { seuil: 2500, taux: 0.2, capital: true }, c: 0.5 };
    var j = jeu(o), lc = Y.leviers(A.HYP.combinaison), tr = trajReforme(function (s, y) { return lc(s, y) + j.effet; });
    var prel = j.revenus + j.transmissions + j.credit + j.patrimoineNat + j.contribution;
    return { j: j, traj: tr, po: po(prel), prel: prel, r: resume(j.cas ? (function () { return T.casTypesNets(j.bareme, o.c); })() : [], o.contrib, false) };
  }
  /**
   * S3 : la base seule à la bascule (neutre, S1), puis des leviers montés de 0 % en 2029 à 100 % en 2038 : non-remplacement d'un départ sur deux (M1f au lieu de M1m), R1f, M2m, M3 (dès 2029, comme la base),
   * économies de niveau 2 (1,9), contribution des retraités aisés, transmissions et impôt de suite, crédit d'IS c, économies de niveau 1, et la fonction des revenus pour le reste.
   * Condition : dette / PIB stable à partir de 2038 (aucune année de 2038 à 2058 au-dessus de 2038). F = effet total en régime des leviers montés en rampe.
   */
  function scenarioS3(o) {
    o = o || { contrib: { seuil: 2500, taux: 0.2, capital: true }, c: 0.5 };
    var lc = Y.leviers(['R1f', 'M1f', 'M2m', 'M3']), r = S.rampe, ramp = function (y) { return Math.max(0, Math.min(1, (y - r[0]) / (r[1] - r[0]))); }, i0 = r[1] - 2029;
    var traj = function (F) { return trajReforme(function (s, y) { return lc(s, y) + ramp(y) * F; }); };
    var ok = function (F) { var t = traj(F); for (var i = i0 + 1; i < 30; i++) if (t.ratio[i] > t.ratio[i0] + 1e-9) return false; return true; };
    var lo = -50, hi = 300; for (var k = 0; k < 50; k++) { var x = (lo + hi) / 2; if (ok(x)) hi = x; else lo = x; } var F = hi;
    var tr = T.recette({ A: S.transReco.A, K: S.transReco.K, top: true, k: 1, nationalite: 'court' }).netActuel, rc = o.contrib ? recette(o.contrib, 1).net : 0, eco = S.ecoFonct + S.eco2[1];
    var autres = tr + S.patrimoineNat + rc + eco, f = aPourRecette(F - autres, o.c), t = traj(F), pic = 0, picAn = 0;
    t.ratio.forEach(function (x, i) { if (i < 30 && x > pic) { pic = x; picAn = 2029 + i; } });
    var prel = f.revenus + f.credit + tr + S.patrimoineNat + rc;
    return { F: F, a: f.a, revenus: f.revenus, credit: f.credit, transmissions: tr, contribution: rc, eco: eco, patrimoineNat: S.patrimoineNat, traj: t, pic: pic, picAn: picAn,
             m1fEnPlus: Y.leviers(['M1f'])('central', 2040) - Y.leviers(['M1m'])('central', 2040), po: po(prel), prel: prel, r: resume(T.casTypesNets(f.bareme, o.c), o.contrib, false), neutreBascule: margeNeutre(function (s, y) { return lc(s, y) + ramp(y) * F; }) };
  }

  var API = { S: S, HYP: HYP, SCN: SCN, CAS: CAS, trajActuel: trajActuel, trajReforme: trajReforme, margeNeutre: margeNeutre, aPourRecette: aPourRecette, scenarioS1: scenarioS1, scenarioS2: scenarioS2, scenarioS3: scenarioS3, points: points, contributionIndiv: contributionIndiv, marginalCapital: marginalCapital, recette: recette, trois: trois, variantes: variantes,
              partSous: partSous, pensionMoyenne: pensionMoyenne, casRetraite: casRetraite, pensionBascule: pensionBascule, contributionCapitalCas: contributionCapitalCas, jeu: jeu };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.RetraitesAisees0611 = API;
})(this);
