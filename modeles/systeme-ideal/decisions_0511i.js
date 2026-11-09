/*
 * modeles/systeme-ideal/decisions_0511i.js — v5.9 (05/11/2026, nuit) : deux chantiers ajoutés à la v5.8 (decisions_0511h.js) :
 *   A. LE COUPLE À DEUX SMIC (décision attendue de l'auteur ; RIEN n'est adopté) : diagnostic refait en v5.8 à 43 % puis à 42 % (majorations 200 € par enfant, 345 € par enfant pour les parents isolés),
 *      et quatre familles de solutions financées par le HAUT de la distribution, à solde inchangé : (a) bonus d'activité individuel de 100 € financé par une reprise du socle au-dessus d'un haut revenu ;
 *      (b) première tranche à 0 % (franchise) compensée par une tranche haute ; (c) socle relevé et taux plat plus haut ; (d) allocation par enfant relevée financée par la reprise du socle ;
 *      plus deux références (bonus financé par le taux plat ; tranche haute seule). Chaque solution : coût brut, paramètre de financement, cas types, taux marginal effectif près du Smic, dette.
 *   B. LA BASCULE NEUTRE DES COLLECTIVITÉS (décision de l'auteur : ADOPTÉE) : chaque niveau (bloc communal, départements, régions, autorités organisatrices de la mobilité) reçoit d'abord ce qu'il
 *      perçoit aujourd'hui des impôts supprimés, par une clé : part du prélèvement unique + part de la taxe de 1 % (communes) + péréquation. Transfert INTERNE aux administrations publiques :
 *      neutre sur le solde consolidé (le modèle compte déjà la suppression des impôts locaux en P06, P07 et N08) ; voir sources/bascule-collectivites.md.
 * Euros de 2025-2026 ; €/mois par foyer pour les cas types, Md€/an en croisière pour les coûts. Des hypothèses et des ordres de grandeur, jamais des prédictions. Hypothèses H817 à H834 (methode.md § 44).
 * Convention des scénarios : bas = favorable, haut = défavorable (comme tous les modules). Ce module ne modifie AUCUN module existant ; la v5.8 reste reproductible par decisions_0511h.js.
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511h.js (jusqu'à decisions_0511h.js), puis diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var C = root.Decisions0511c || (req ? req('./decisions_0511c.js') : null);
  var H = root.Decisions0511h || (req ? req('./decisions_0511h.js') : null);
  var X = root.DiagnosticCoupleSmic || (req ? req('./diagnostic_couple_smic.js') : null);
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var HR = root.HautsRevenus || (req ? req('./hauts_revenus.js') : null);
  var M = root.SystemeIdeal || (req ? req('./modele.js') : null);
  var GP = root.GagnantsPerdantsPalier1 || (req ? req('../gagnants-perdants/palier1.js') : null);
  var CO = root.Correctifs || (req ? req('../gagnants-perdants/correctifs.js') : null);
  var F = (root.Voies || (req ? req('./voies.js') : null)).fus;
  var SCS = ['bas', 'central', 'haut'], DM = M.DONNEES;
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };

  var HYP = {
    t43: 0.43, t42: 0.42,
    // H817 : plafond du taux marginal total (hauts_revenus.js H131 : 75 %, Conseil constitutionnel 2012-662 DC) ; toute solution qui le dépasse est signalée « hors plafond »
    plafond: 0.75,
    // H818 : droit actuel des cas types : OpenFisca-France 2026, zone 2 (generer_cas_types_0511i.py ; couple à deux Smic : generer_diagnostic_couple_smic.py, convention égale 2 × 1 867,02 €)
    OF_CAS: {
      smic_seul: { libelle: 'Célibataire au Smic', brut: [1867.02], enfants: 0, rd: 1706.30, ppa: 228.37, superBrut: 1941.06 },
      smic_seul_1_1: { libelle: 'Célibataire à 1,1 Smic', brut: [2053.72], enfants: 0, rd: 1803.43, ppa: 190.70, superBrut: 2301.93 },
      couple_2smic_2enf: { libelle: 'Couple, 2 enfants, deux Smic', brut: [1867.02, 1867.02], enfants: 2, rd: 3549.20, ppa: 368.30, superBrut: 3882.11 },
      couple_2smic_0enf: { libelle: 'Couple sans enfant, deux Smic', brut: [1867.02, 1867.02], enfants: 0, rd: 3088.27, ppa: 140.25, superBrut: 3882.11 },
      parent_isole_smic: { libelle: 'Parent isolé, 2 enfants, au Smic', brut: [1867.02], enfants: 2, rd: 2579.61, ppa: 181.63, superBrut: 1941.06, asf: 402.77, al: 294.25 },
      couple_median_2enf: { libelle: 'Couple médian, 2 enfants (2 × 2 735 € brut)', brut: [2735, 2735], enfants: 2, rd: 4423.90, ppa: 0, superBrut: 7013.97 },
      cadre_5000: { libelle: 'Cadre seul à 5 000 € brut', brut: [5000], enfants: 0, rd: 3429.25, ppa: 0, superBrut: 6973.88 },
      cadre_10000: { libelle: 'Cadre seul à 10 000 € brut', brut: [10000], enfants: 0, rd: 6276.15, ppa: 0, superBrut: 14162.18 },
      cadre_20000: { libelle: 'Cadre seul à 20 000 € brut', brut: [20000], enfants: 0, rd: 11037.97, ppa: 0, superBrut: 28149.88 }
    },
    CAS: ['couple_2smic_2enf', 'couple_2smic_0enf', 'parent_isole_smic', 'smic_seul', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000'],
    // H819 : bonus d'activité individuel (K6b de diagnostic_couple_smic.js) : 100 € par actif, plein de 0,5 à 1 Smic brut, éteint à 1,25 Smic
    bonus: 100, bonusFin: 1.25,
    // H820 : reprise du socle au-dessus d'un haut revenu : zone [ra ; 2 ra] de revenu mensuel individuel (coût employeur + capital), socle repris linéairement (hauts_revenus.js, correctif 2)
    rapportZone: 2,
    // H821 : tranche haute (« deuxième taux ») : + tH sur la part du revenu annuel individuel au-dessus de S ; seuil de référence 100 000 € par an (≈ 8 300 € par mois de coût employeur, ≈ 1er centile des salariés à 5 %)
    seuilHaut: 100000
  };

  // ======================================================================================================================================
  // A.1 Le haut de la distribution : tranche haute, second coude, reprise du socle (recette nette avec réactions)
  // ======================================================================================================================================
  function archiBase(t) { return C.archiV54(t === undefined ? HYP.t42 : t); }
  function pModele(a) { return GP.config(Z.versOF(Z.archi(a))).p; }
  /** Impôt supplémentaire annuel (€) d'un adulte de revenu annuel R (coût employeur + capital) sous le correctif du haut c = { tH, S, t2, R1, ra, rb } ; socle mensuel S0 (reprise). */
  function impotHaut(R, c, S0) {
    var i = 0;
    if (c.tH > 0 && R > c.S) i += c.tH * (R - c.S);
    i += HR.impot2(R, c);
    if (c.rb > c.ra) i += 12 * S0 * (1 - HR.partSocle(R / 12, c));
    return i;
  }
  /** Hausse du taux marginal due au correctif du haut au revenu annuel R. */
  function margHaut(R, c, S0) {
    var d = (c.tH > 0 && R > c.S) ? c.tH : 0;
    d += HR.marg2(R, c);
    if (c.rb > c.ra && R / 12 > c.ra && R / 12 < c.rb) d += HR.penteReprise(S0, c);
    return d;
  }
  /**
   * Recette nette (Md€/an) du correctif du haut c pour l'architecture a au scénario sc : généralisation de hauts_revenus.js extra() à une tranche haute en marche (tH au-dessus de S).
   * Même méthode : par bande de recettesCourants (après réactions au taux de l'architecture), 5 points de dispersion, réaction du revenu d'activité à la hausse du taux marginal
   * (élasticité par bande, hauts_revenus.js H132 : D6-D9 0 / 0,05 / 0,10, D10 0,15 / 0,31 / 0,45), exil des 1 % et 0,1 % supérieurs (règle de modele.js).
   */
  function recetteHaut(a, sc, c) {
    c = HR.corr(c);
    if (!(c.tH > 0) && !(c.t2 > 0) && !(c.rb > c.ra)) return { netMd: 0, parBande: [] };
    var P = M.param(F(pModele(a), { scenario: sc })), s = M.SCENARIOS[sc], rc = M.recettesCourants(P), S0 = P.socle, tot = 0, out = [];
    rc.parBande.forEach(function (b, i) {
      var top = i >= 9, rang = i - 9, sigma = top ? 0.15 : P.dispersion, g, delta = 0;
      for (g = 0; g < 5; g++) {
        var m = Math.exp(sigma * GH.z[g] - sigma * sigma / 2), L = b.L * m, K = b.K * m, R = L + K, tm = Math.min(0.99, M.marginal(R, P));
        var dtau = margHaut(R, c, S0);
        var f = dtau > 0 ? Math.pow(Math.max(0.01, 1 - tm - dtau) / (1 - tm), HR.etiBande(i, sc, c)) : 1;
        var R1n = L * f + K, base = M.impot(R, P);
        var extraTax = M.impot(R1n, P) - base + impotHaut(R1n, c, S0);
        if (top && rang >= 3 && dtau > 0) {
          var r0 = (1 - tm) / (1 - DM.tmefActuel[9]), r1 = (1 - tm - dtau) / (1 - DM.tmefActuel[9]);
          var q0 = r0 < 1 ? 1 - 0.8 * (1 - Math.pow(r0, s.mobil)) : 1, q1 = r1 < 1 ? 1 - 0.8 * (1 - Math.pow(r1, s.mobil)) : 1, qq = q1 / q0;
          extraTax = qq * extraTax - (1 - qq) * base;
        }
        delta += GH.w[g] * extraTax;
      }
      var rec = b.n * delta / 1e9; tot += rec; out.push({ id: b.id, recetteMd: rec, mecaniqueMd: b.n * impotHautMoyen(b, sigma, c, S0) / 1e9 });
    });
    return { netMd: tot, parBande: out };
  }
  function impotHautMoyen(b, sigma, c, S0) { var g, v = 0; for (g = 0; g < 5; g++) { var m = Math.exp(sigma * GH.z[g] - sigma * sigma / 2); v += GH.w[g] * impotHaut((b.L + b.K) * m, c, S0); } return v; }
  /** Adultes (millions, bandes actives du modèle) touchés par la reprise du socle c : dans la zone (reprise partielle) et au-dessus (socle entièrement repris) ; même quadrature que recetteHaut. */
  function touches(a, c) {
    var P = M.param(F(pModele(a), { scenario: 'central' })), rc = M.recettesCourants(P), zone = 0, dessus = 0, total = 0;
    rc.parBande.forEach(function (b, i) {
      var sigma = i >= 9 ? 0.15 : P.dispersion, g;
      for (g = 0; g < 5; g++) { var r = (b.L + b.K) * Math.exp(sigma * GH.z[g] - sigma * sigma / 2) / 12, w = GH.w[g] * b.n / 1e6; total += w; if (r >= c.rb) dessus += w; else if (r > c.ra) zone += w; }
    });
    return { zone: zone, dessus: dessus, total: total, part: (zone + dessus) / total };
  }
  /** Taux marginal total maximal (grille de 10 000 € à 10^9 € par an) de l'architecture a avec le correctif c, et revenu où il est atteint. */
  function marginalMax(a, c) {
    var P = M.param(F(pModele(a), { scenario: 'central' })), best = { taux: 0, R: 0 }, R;
    c = HR.corr(c);
    for (R = 10000; R <= 1e9; R *= 1.01) { var t = M.marginal(R, P) + margHaut(R, c, P.socle); if (t > best.taux + 1e-12) best = { taux: t, R: R }; }
    return best;
  }
  /** Zone de reprise [ra ; 2 ra] (€/mois) qui rapporte `cible` Md€ au scénario central (bisection ; la recette décroît avec ra). null si même ra = 2 000 € ne suffit pas. */
  function zoneReprise(a, cible) {
    var lo = 2000, hi = 40000, k, f = function (ra) { return recetteHaut(a, 'central', { ra: ra, rb: HYP.rapportZone * ra }).netMd; };
    if (f(lo) < cible) return null;
    for (k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (f(m) >= cible) lo = m; else hi = m; }
    return { ra: lo, rb: HYP.rapportZone * lo };
  }
  /** Taux de la tranche haute au-dessus de S qui rapporte `cible` Md€ (central) ; renvoie aussi la recette maximale atteignable (courbe de Laffer de la tranche) et le taux qui la donne. */
  function trancheHaute(a, cible, S) {
    var SS = S === undefined ? HYP.seuilHaut : S, best = { tH: 0, netMd: 0 }, tH, sol = null;
    for (tH = 0.0025; tH <= 0.30 + 1e-9; tH += 0.0025) {
      var r = recetteHaut(a, 'central', { tH: tH, S: SS }).netMd;
      if (r > best.netMd) best = { tH: tH, netMd: r };
      if (sol === null && r >= cible) sol = tH;
    }
    var tPlafond = Math.max(0, HYP.plafond - marginalMax(a, {}).taux);
    return { S: SS, tH: sol, maxRecette: best.netMd, tHMax: best.tH, tHPlafond: tPlafond, recetteAuPlafond: tPlafond > 0 ? recetteHaut(a, 'central', { tH: tPlafond, S: SS }).netMd : 0 };
  }

  // ======================================================================================================================================
  // A.2 Les ménages : revenu du système (v5.8 au taux t) et écart au droit actuel
  // ======================================================================================================================================
  function coutMois(brut) { return CO.coutDeBrut(brut); }
  /** Spécification d'un cas type pour X.foyer (diagnostic_couple_smic.js). */
  function spec(id) {
    var o = HYP.OF_CAS[id], couts = o.brut.map(coutMois), type = null, isole = false;
    if (id === 'smic_seul' || id === 'smic_seul_1_1' || /^cadre/.test(id)) type = 'seul';
    if (id === 'parent_isole_smic') { type = 'parent'; isole = true; }
    return { adultes: id === 'parent_isole_smic' || id === 'smic_seul' || id === 'smic_seul_1_1' || /^cadre/.test(id) ? 1 : 2, enfants: o.enfants, couts: couts, type: type, isole: isole, ppa: o.ppa };
  }
  /** « Avant » d'un cas type : OpenFisca 2026 ; pour le parent isolé, l'atlas du modèle (optimum.js casTypes) pour rester comparable aux publications (OpenFisca direct : 2 579,61 €, voir test). */
  function avant(id, a) { if (id === 'parent_isole_smic') return Z.casTypes(a).parent_isole_smic.avantMois; return HYP.OF_CAS[id].rd; }
  /** Revenu mensuel du système (€) d'un cas type, architecture a, surcouche opt (enfantDelta), correctif du haut c. */
  function apres(a, id, opt, c) {
    var sp = spec(id), r = X.foyer(a, sp, opt || {}).apres, S0 = X.pSys(a).socle, i;
    if (c) for (i = 0; i < sp.couts.length; i++) r -= impotHaut(12 * sp.couts[i], HR.corr(c), S0) / 12;
    return r;
  }
  function ecart(a, id, opt, c) { return apres(a, id, opt, c) - avant(id, a); }
  function casTypes(a, opt, c) { var r = {}; HYP.CAS.forEach(function (id) { r[id] = ecart(a, id, opt, c); }); return r; }

  /** Diagnostic poste par poste du couple à deux Smic (2 enfants), convention égale, au taux t (v5.8 : majoration 345 €, 200 € par enfant). */
  function diagnosticCouple(t) {
    var a = archiBase(t), d = X.decomposition('couple_2smic_2enf', a), L = {};
    d.lignes.forEach(function (l) { L[l.poste.split(' ')[0]] = l.ecart; });
    var prel = d.lignes[0].ecart, ppa = d.lignes[1].ecart, pf = d.lignes[2];
    return { t: t, ecart: d.ecart, apres: d.apres, avant: d.avant, prelevement: prel, ppa: ppa, prestationsFamilialesPerdues: pf.actuel, enfants: pf.systeme, socle: d.lignes[4].ecart, complement: d.lignes[5].ecart,
             tauxActuel: d.tauxActuelSurCout, tauxSysteme: d.tauxPlatSurCout, coutEmployeur: d.coutEmployeur, lignes: d.lignes };
  }

  // ---------- Taux marginal effectif près du Smic
  /** TME local du célibataire au Smic (de 1 à 1,1 Smic brut) et segments de reprise (diagnostic_couple_smic.js reprise()) ; « actuel » : OpenFisca. */
  function tmeSmic(a, opt, c) {
    var b0 = HYP.OF_CAS.smic_seul.brut[0], b1 = HYP.OF_CAS.smic_seul_1_1.brut[0], c0 = coutMois(b0), c1 = coutMois(b1);
    var r0 = apres(a, 'smic_seul', opt, c), r1 = apres(a, 'smic_seul_1_1', opt, c);
    var rep = X.reprise(a, opt || {});
    return { local: 1 - (r1 - r0) / (c1 - c0), localActuel: 1 - (HYP.OF_CAS.smic_seul_1_1.rd - HYP.OF_CAS.smic_seul.rd) / (HYP.OF_CAS.smic_seul_1_1.superBrut - HYP.OF_CAS.smic_seul.superBrut),
             reprise: rep, trappes: X.trappes(rep) };
  }

  // ======================================================================================================================================
  // A.3 Les solutions, à solde inchangé (calées au central à 43 %, la période 2029-2044 ; résidu à 42 % donné)
  // ======================================================================================================================================
  function coutBas(a0, a1, sc) { return C.solde(a0, sc, false) - C.solde(a1, sc, false); }
  /** Plus petit paramètre v (pas `pas`) tel que fn(v) ≥ 0. */
  function minimal(fn, lo, hi, pas) { var v; for (v = lo; v <= hi + 1e-9; v += pas) if (fn(v) >= 0) return v; return null; }
  var _sol = {};
  /**
   * Construit une solution au taux t. id : 'a' (bonus + reprise du socle), 'a0' (bonus + taux plat, référence), 'aT' (bonus + tranche haute seule, référence), 'b' (franchise + tranche haute),
   * 'bR' (franchise + reprise du socle), 'c' (socle relevé + taux plat), 'd' (allocation par enfant relevée + reprise du socle).
   * Renvoie { a: architecture, opt, c: correctif du haut, cout: {bas, central, haut} (Md€/an, brut de la mesure du bas), recette: {...}, residu: {...} (recette − coût ; 0 au central par construction si finançable),
   *           finance: booléen, parametre: description }.
   */
  function solution(id, t) {
    var tt = t === undefined ? HYP.t43 : t, key = id + '|' + tt; if (_sol[key]) return _sol[key];
    var a0 = archiBase(tt), a1 = a0, opt = {}, c = null, cout = {}, desc = '', finance = true, couple0 = function (a, o) { return ecart(a, 'couple_2smic_2enf', o, null); };
    if (id === 'a' || id === 'a0' || id === 'aT') a1 = F(a0, { bonusActivite: HYP.bonus, bonusFin: HYP.bonusFin });
    if (id === 'b' || id === 'bR') {
      var A = minimal(function (v) { return couple0(F(a0, { abattementActivite: v }), {}); }, 0, 600, 1);
      a1 = F(a0, { abattementActivite: A }); desc = 'franchise de ' + A + ' € de coût employeur par mois et par actif (taux 0 %)';
    }
    if (id === 'd') {
      var e = minimal(function (v) { return couple0(a0, { enfantDelta: v }); }, 0, 400, 1);
      opt = { enfantDelta: e }; desc = 'allocation par enfant portée à ' + (200 + e) + ' € (+' + e + ' €)';
    }
    SCS.forEach(function (s) { cout[s] = id === 'd' ? opt.enfantDelta * 12 * DM.enfants / 1e9 : coutBas(a0, a1, s); });
    if (id === 'c') {
      // socle s et taux plat t' tels que le solde central ne bouge pas ; s = plus petit socle (pas de 5 €) qui fait gagner le couple, borné à 800 €
      var s0 = C.solde(a0, 'central', false), tauxPour = function (soc) {
        var lo = tt, hi = 0.75, k; for (k = 0; k < 30; k++) { var m = (lo + hi) / 2; if (C.solde(F(a0, { socle: soc, tPlat: m }), 'central', false) >= s0) hi = m; else lo = m; } return hi; };
      var soc = null, tp = null, v;
      for (v = 355; v <= 800; v += 5) { var tv = tauxPour(v); if (tv >= 0.749) break; if (couple0(F(a0, { socle: v, tPlat: tv }), {}) >= 0) { soc = v; tp = tv; break; } }
      var soc400 = 400, tp400 = tauxPour(400);
      a1 = soc ? F(a0, { socle: soc, tPlat: tp }) : F(a0, { socle: soc400, tPlat: tp400 }); finance = true;
      SCS.forEach(function (s) { cout[s] = coutBas(a0, F(a0, { socle: a1.socle }), s); });
      var res = { a: a1, opt: opt, c: null, cout: cout, recette: {}, residu: {}, finance: true, socle: a1.socle, taux: a1.tPlat, faitGagner: !!soc,
                  variante400: { socle: 400, taux: tp400, a: F(a0, { socle: 400, tPlat: tp400 }) },
                  parametre: soc ? ('socle ' + soc + ' €, taux plat ' + (100 * tp).toFixed(2) + ' %') : ('aucun socle ≤ 800 € ne fait gagner le couple sous 75 % ; variante : socle 400 €, taux ' + (100 * tp400).toFixed(2) + ' %') };
      SCS.forEach(function (s) { res.recette[s] = C.solde(a1, s, false) - C.solde(F(a0, { socle: a1.socle }), s, false); res.residu[s] = C.solde(a1, s, false) - C.solde(a0, s, false); });
      return (_sol[key] = res);
    }
    var recette = {}, residu = {}, par = '';
    if (id === 'a0') {
      var lo = tt, hi = 0.6, k, s00 = C.solde(a0, 'central', false);
      for (k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (C.solde(F(a1, { tPlat: m }), 'central', false) >= s00) hi = m; else lo = m; }
      var aT = F(a1, { tPlat: hi });
      SCS.forEach(function (s) { recette[s] = C.solde(aT, s, false) - C.solde(a1, s, false); residu[s] = C.solde(aT, s, false) - C.solde(a0, s, false); });
      return (_sol[key] = { a: aT, opt: opt, c: null, cout: cout, recette: recette, residu: residu, finance: true, taux: hi, parametre: 'bonus de 100 € ; taux plat ' + (100 * hi).toFixed(2) + ' %' });
    }
    if (id === 'a' || id === 'bR' || id === 'd') {
      var z = zoneReprise(a1, cout.central);
      if (z) { c = { ra: z.ra, rb: z.rb }; par = 'reprise du socle entre ' + Math.round(z.ra) + ' et ' + Math.round(z.rb) + ' € de revenu mensuel individuel'; }
      else { c = { ra: 2000, rb: 4000 }; finance = false; par = 'reprise du socle insuffisante même dès 2 000 € par mois'; }
    }
    if (id === 'aT' || id === 'b') {
      var th = trancheHaute(a1, cout.central);
      if (th.tH !== null) { c = { tH: th.tH, S: th.S }; par = 'tranche haute de +' + (100 * th.tH).toFixed(2) + ' points au-delà de ' + th.S + ' € par an'; }
      else { c = { tH: th.tHMax, S: th.S }; finance = false; par = 'IMPOSSIBLE : la tranche haute au-delà de ' + th.S + ' € rapporte au plus ' + th.maxRecette.toFixed(1) + ' Md€ (à +' + (100 * th.tHMax).toFixed(1) + ' points) ; au plafond de 75 % : +' + (100 * th.tHPlafond).toFixed(1) + ' points, ' + th.recetteAuPlafond.toFixed(1) + ' Md€'; }
      var resT = th;
    }
    SCS.forEach(function (s) { recette[s] = recetteHaut(a1, s, c).netMd; residu[s] = recette[s] - cout[s]; });
    var out = { a: a1, opt: opt, c: c, cout: cout, recette: recette, residu: residu, finance: finance, parametre: (desc ? desc + ' ; ' : '') + par, marginalMax: marginalMax(a1, c) };
    if (resT) out.tranche = resT;
    return (_sol[key] = out);
  }
  var SOLUTIONS = ['a', 'b', 'bR', 'c', 'd', 'a0', 'aT'];
  /** Évaluation complète d'une solution : cas types à 43 % et à 42 % (paramètres calés à 43 %), TME, marginal maximal, dette. */
  function evaluer(id) {
    var s = solution(id, HYP.t43), a42 = F(s.a, { tPlat: s.a.tPlat - 0.01 }), base42 = archiBase(HYP.t42), r = { id: id, solution: s };
    r.cas43 = casTypes(s.a, s.opt, s.c); r.cas42 = casTypes(a42, s.opt, s.c);
    r.residu42 = evaluerResidu42(id);
    r.tme = tmeSmic(s.a, s.opt, s.c); r.tme42 = tmeSmic(a42, s.opt, s.c);
    r.marginalMax = marginalMax(s.a, s.c || {});
    r.dette = detteAvec(id);
    return r;
  }
  /** Dette / PIB (10, 20, 30 ans) avec le plan de taux de la v5.8 (43 % jusqu'en 2044) et le résidu de la solution (résidu à 43 % jusqu'en 2044, à 42 % ensuite), par scénario. */
  var _de = {};
  function detteAvec(id) {
    if (_de[id]) return _de[id];
    var s43 = solution(id, HYP.t43), out = {}, r42 = null;
    SCS.forEach(function (sc) {
      var d43 = s43.residu[sc];
      if (r42 === null) r42 = evaluerResidu42(id);
      var d42 = r42[sc];
      var j = H.jalonsDette(sc, { taux: H.planTaux(2044), net: function (s, y) { return H.net(s, y) + (y < 2029 ? 0 : (y <= 2044 ? d43 : d42)); } });
      var j0 = H.jalonsDette(sc, { taux: H.planTaux(2044) });
      out[sc] = { r10: j.r10, r20: j.r20, r30: j.r30, ecart10: j.r10 - j0.r10, ecart30: j.r30 - j0.r30 };
    });
    return (_de[id] = out);
  }
  function evaluerResidu42(id) {
    var s = solution(id, HYP.t43), a42 = F(s.a, { tPlat: s.a.tPlat - 0.01 }), base42 = archiBase(HYP.t42), r = {};
    SCS.forEach(function (sc) {
      var cb, rec;
      if (id === 'd') { cb = s.cout[sc]; rec = recetteHaut(a42, sc, s.c).netMd; }
      else if (id === 'c') { cb = C.solde(base42, sc, false) - C.solde(F(base42, { socle: s.a.socle }), sc, false); rec = C.solde(a42, sc, false) - C.solde(F(base42, { socle: s.a.socle }), sc, false); }
      else if (id === 'a0') { cb = coutBas(base42, F(s.a, { tPlat: HYP.t42 }), sc); rec = C.solde(a42, sc, false) - C.solde(F(s.a, { tPlat: HYP.t42 }), sc, false); }
      else { cb = coutBas(base42, a42, sc); rec = recetteHaut(a42, sc, s.c).netMd; }
      r[sc] = rec - cb;
    });
    return r;
  }

  // ======================================================================================================================================
  // B. Bascule neutre des collectivités (ADOPTÉE) : état des ressources supprimées par niveau, parts de la clé, neutralité consolidée
  // ======================================================================================================================================
  var OF_ = root.OptionsFinancement || (req ? req('./options_financement.js') : null), O_ = root.Optimisation || (req ? req('./optimisation.js') : null), TP = root.TaxePatrimoine || (req ? req('./taxe_patrimoine.js') : null);
  // H824 : ressources 2024 des impôts supprimés par le modèle, par niveau (Md€) : DGCL, « Les collectivités locales en chiffres 2025 », tableau 5.1 (2024) ; recoupé avec l'OFGL (REI, bases consolidées) ;
  // versement mobilité : 12,2 (Insee, ligne P06 du bilan), dont 5,47 dans le champ DGCL (EPCI 4,36 ; syndicats 1,11 ; communes 0,007) et 6,73 hors champ (Île-de-France Mobilités et autres, ⚠️ V13806).
  var BASCULE = {
    niveaux: {
      bloc: { libelle: 'Communes et intercommunalités', tf: 41.95 + 1.31, cfe: 8.03, dmto: 3.80 + 0.28, tva: 1.42 + 13.97, vm: 0 },
      departements: { libelle: 'Départements', tf: 0, cfe: 0, dmto: 9.86, tva: 20.69, vm: 0 },
      regions: { libelle: 'Régions', tf: 0, cfe: 0, dmto: 0.16, tva: 16.41, vm: 0 },
      aom: { libelle: 'Autorités organisatrices de la mobilité (dont Île-de-France Mobilités)', tf: 0, cfe: 0, dmto: 0, tva: 0, vm: 12.2 }
    },
    ORDRE: ['bloc', 'departements', 'regions', 'aom'],
    // ce que le modèle supprime déjà (bilan : P06 versement mobilité 12,2 et CFE ; P07 taxe foncière 42,9 ; N08 DMTO, 16,1 en 2025 au central ; la fraction de TVA reste dans la TVA, P11)
    modele: { tf: 42.9, vm: 12.2, dmto: 16.1 },
    // H825 : impôts locaux MAINTENUS (non supprimés par le modèle, pouvoir de taux conservé) : DGCL 2024
    maintenus: { thrs: 3.72, thlv: 0.18, teom: 8.99, ifer: 1.89, tascom: 1.04, gemapiTasa: 0.62, amenagement: 0.41 + 0.95, ticpe: 11.70, tsca: 9.73, tcfe: 2.74, cartesGrises: 2.36 },
    vmChampDGCL: 5.47
  };
  /** Prélèvement unique (Md€/an, central, croisière) au taux t : recettes « courants » du modèle (comme export_bilan_v53.js). */
  var _pu = {};
  function prelevementUnique(t, sc) {
    var s = sc || 'central', k = t + '|' + s; if (_pu[k] !== undefined) return _pu[k];
    var a = Z.archi(archiBase(t));
    return (_pu[k] = Z.avecExil(a.exil, function () { var o = OF_.opt(Z.versOF(a)), st = OF_.stOption(o), pp = O_.configR(st); return M.solde(F(pp, { scenario: s, droitsActuelsTransmissions: false })).recettes.courants; }));
  }
  /** Taxe de 1 % : produit net (Md€, central, modèle) et base immobilière (Md€, valeur de marché retenue par taxe_patrimoine.js). */
  function taxe1pc() { var r = TP.recette('central', { assiette: 'pierre', avecReformeImmo: true }); return { nette: Z.detail(archiBase(0.42), 'central').taxe, immoBrute: 0.01 * r.baseImmo, baseImmo: r.baseImmo }; }
  /**
   * Clé de la bascule au taux t (défaut 43 %, l'année 2029) : chaque niveau reçoit exactement ses ressources supprimées de 2024.
   * Bloc communal : la taxe foncière par une part de la taxe de 1 % ; le reste (CFE, DMTO, fraction de TVA) par une part du prélèvement unique. Départements, régions, AOM : part du prélèvement unique.
   */
  function bascule(t) {
    var tt = t === undefined ? HYP.t43 : t, pu = prelevementUnique(tt), tx = taxe1pc(), N = BASCULE.niveaux, out = { t: tt, prelevementUnique: pu, taxe1pcNette: tx.nette, taxe1pcImmo: tx.immoBrute, niveaux: {}, total: 0, totalPU: 0, total1pc: 0 };
    BASCULE.ORDRE.forEach(function (k) {
      var n = N[k], tot = n.tf + n.cfe + n.dmto + n.tva + n.vm, du1pc = n.tf, duPU = tot - du1pc;
      out.niveaux[k] = { libelle: n.libelle, perceAujourdhui: tot, detail: n, part1pcNette: du1pc / tx.nette, part1pcImmo: du1pc / tx.immoBrute, partPU: duPU / pu, pointsDeTaux: 100 * tt * duPU / pu, montant1pc: du1pc, montantPU: duPU, recu: du1pc + duPU };
      out.total += tot; out.totalPU += duPU; out.total1pc += du1pc;
    });
    out.partPUTotale = out.totalPU / pu; out.pointsTotal = 100 * tt * out.totalPU / pu;
    // neutralité consolidée : la bascule est un transfert entre l'État (qui perçoit le prélèvement unique et la taxe de 1 %) et les collectivités : effet nul sur le solde des APU
    out.effetSoldeConsolide = 0;
    // écarts d'imputation avec le modèle (aucun ne change le solde, voir sources/bascule-collectivites.md § 5)
    out.ecarts = { tf: N.bloc.tf - BASCULE.modele.tf, dmto: (N.bloc.dmto + N.departements.dmto + N.regions.dmto) - BASCULE.modele.dmto, vm: N.aom.vm - BASCULE.modele.vm };
    return out;
  }
  /** v5.9 : solde = solde de la v5.8 + bascule (0) + chantier A (0 : aucune solution adoptée). */
  function solde(sc, an, t) { return H.solde(sc, an, t) + bascule().effetSoldeConsolide; }
  function net(sc, an) { return H.net(sc, an); }

  var API = { HYP: HYP, SCS: SCS, archiBase: archiBase, touches: touches, impotHaut: impotHaut, margHaut: margHaut, recetteHaut: recetteHaut, marginalMax: marginalMax, zoneReprise: zoneReprise, trancheHaute: trancheHaute,
              spec: spec, avant: avant, apres: apres, ecart: ecart, casTypes: casTypes, diagnosticCouple: diagnosticCouple, tmeSmic: tmeSmic, solution: solution, SOLUTIONS: SOLUTIONS, evaluer: evaluer,
              detteAvec: detteAvec, residu42: evaluerResidu42, coutMois: coutMois,
              BASCULE: BASCULE, prelevementUnique: prelevementUnique, taxe1pc: taxe1pc, bascule: bascule, solde: solde, net: net };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511i = API;
})(this);
