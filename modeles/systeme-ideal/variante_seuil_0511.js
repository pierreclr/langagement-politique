/*
 * modeles/systeme-ideal/variante_seuil_0511.js — OPTIONS (05/11/2026) : seuil de l'impôt progressif exprimé en salaire NET d'aujourd'hui.
 *   L'auteur (05/11) : le seuil de 24 000 €/an (2 000 €/mois) fixé le 31/10 visait un salaire NET. Le modèle a retenu R0 = 24 000 € de COÛT EMPLOYEUR annuel (H2 de methode.md,
 *   « choix de Claude »), soit ≈ le coût d'un Smic. Ce module chiffre, sur la v5.10 adoptée (decisions_0511j.js), les variantes où R0 suit le net :
 *     ref : v5.10 (R0 = 24 000 €, t_max = 30 points) ;
 *     a   : R0 = coût employeur de 2 000 € net actuels (OpenFisca 2026, allègements généraux déduits : 12 × 3 152,76 = 37 833 €, arrondi à 38 000 €), t_max = 30 ;
 *     a2  : sensibilité : R0 = coût HORS allègements de 2 000 € net (12 × 3 574,19 = 42 890 €, arrondi à 43 000 €), t_max = 30 ;
 *     b   : R0 de (a), t_max relevé pour retrouver le solde de croisière de la v5.10 (même recette nette) ; b75 : t_max au plafond de 75 % ;
 *     c   : R0 de (a), t_max = 30, taux de base relevé de δ points sur tout le plan (43 + δ % de 2029 à 2044, puis 42 + δ %) pour qu'il ne crée aucune dette ;
 *     d   : R0 = coût de 1 500 € net (12 × 1 996,01 = 23 952 € : c'est déjà, à 0,2 % près, le R0 de la v5.10) ; d2 : 1 750 € net (12 × 2 593,30 = 31 120 €, arrondi à 31 000 € : intermédiaire réel).
 *   AUCUNE de ces variantes n'est adoptée ; la v5.10 reste la référence et n'est pas modifiée.
 *
 * Méthode (HS1-HS8, sources/chiffrage-seuil-impot-progressif.md § 3) :
 *   HS1 : R0 et t_max vivent dans Palier1.BASE (palier1.js), lu par toute la chaîne (options_financement → gagnants-perdants → optimum → decisions_*). Les modules gardent des caches
 *         internes non indexés par R0 : chaque variante est donc calculée dans un « monde » neuf, en RECHARGEANT toute la pile avec load() (jsc) après avoir posé R0 et t_max dans
 *         Palier1.BASE ; les objets globaux d'origine sont restaurés ensuite (la v5.10 chargée par l'appelant n'est pas touchée). Exige jsc (fonction load) et le dossier courant
 *         modeles/systeme-ideal/.
 *   HS2 : recette de l'impôt progressif = (i) MÉCANIQUE : Σ bandes n × E[I(R)] sur les assiettes après réactions (quadrature de modele.js), au central ;
 *         (ii) CONTRIBUTION NETTE au solde : solde de croisière (2060, central) de la variante − solde du même monde sans impôt progressif (t_max = 0).
 *   HS3 : (b) cible = solde de croisière central à 42 % de la v5.10 (+12,50 Md€) ; bisection sur t_max.
 *   HS4 : (c) le plan δ est jugé sur le solde EXACT de chaque année (J.solde au taux de l'année), pas sur la grille 38-43 % (extrapolée au-delà de 43 %, elle surestime le solde
 *         de 1 à 2 Md€ à +3 points) ; seul le résidu de la mesure de la v5.10 (≈ 0 à 43 %) reste extrapolé au-delà de 43 %. (c75) : δ et t_max ajustés ensemble sous le plafond de 75 %.
 *   HS5 : nouveaux cas types (salarié seul à 2 000, 2 500 et 3 000 € net) : même méthode que I.apres (coût employeur = Correctifs.coutDeBrut(brut), H453 ; reprise du socle de la v5.10) ;
 *         « avant » = revenu disponible OpenFisca 2026 (generer_variante_seuil_0511.py, locataire zone 2, comme generer_cas_types_0511i.py).
 *   HS6 : taux marginal près de 2 000 € net = 1 − Δ revenu disponible / Δ coût employeur entre le brut de 2 000 € net et 1,01 × ce brut (système et droit actuel).
 *   HS7 : plafond du taux marginal total : 75 % (H817), vérifié par I.marginalMax (grille de 10 000 € à 10^9 € par an).
 *   HS8 : effets de comportement : ceux du modèle (offre de travail D1-D9, élasticité du revenu D10, capital, exil), inchangés ; aucune réaction propre au changement de seuil n'est ajoutée.
 * Euros de 2025-2026 ; €/mois pour les cas types, Md€/an pour les recettes et les soldes. Des hypothèses et des ordres de grandeur, jamais des prédictions.
 * Charger (depuis modeles/systeme-ideal/, jsc) : la liste de test_decisions_0511j.js (jusqu'à decisions_0511j.js), puis variante_seuil_0511.js
 */
(function (root) {
  'use strict';
  var G = root;
  if (typeof load !== 'function') throw new Error('variante_seuil_0511.js : jsc requis (fonction load) ; lancer depuis modeles/systeme-ideal/');

  var FICHIERS = ['modele.js', 'fiscalite_actuelle.js', 'voies.js', 'sante.js', 'optimisation.js', 'retraites2.js', 'palier1.js', 'patrimoine_financier.js', 'deces_realisation.js',
    'dvf_patrimoine.js', 'patrimoine_immobilier.js', 'taxe_patrimoine.js', 'options_financement.js', '../gagnants-perdants/cas_types_donnees.js', '../gagnants-perdants/droit_actuel.js',
    '../gagnants-perdants/modele.js', '../gagnants-perdants/palier1.js', '../gagnants-perdants/correctifs.js', '../capital-de-depart/modele.js', '../capital-de-depart/continu.js',
    'optimum.js', 'optimum_options_0411.js', '../risques/stress.js', 'decisions_0511.js', 'decisions_0511b.js', 'decisions_0511c.js', 'grandes_fortunes_0511.js', 'decisions_0511d.js',
    '../retraites/modele.js', '../retraites/age_libre.js', 'decisions_0511e.js', 'decisions_0511f.js', '../fiscalite-orientation/modele.js', 'decisions_0511g.js', 'decisions_0511h.js',
    'diagnostic_couple_smic.js', 'hauts_revenus.js', 'decisions_0511i.js', 'decisions_0511j.js'];

  // Droit actuel d'un salarié seul selon son salaire NET mensuel (OpenFisca-France, barème 2026, zone 2 ; generer_variante_seuil_0511.py, 05/11/2026). € par mois.
  // brut : salaire de base ; cout : super-brut (allègements généraux déduits) ; coutHA : super-brut hors allègements ; allegement : allègement général ;
  // rd : revenu disponible (prime d'activité comprise) ; ppa : prime d'activité ; ir : impôt sur le revenu ; tme : taux marginal effectif actuel local (+1 % de brut).
  var NET_ACTUEL = {
    1478: { net: 1477.93, brut: 1867.03, cout: 1941.07, coutHA: 2641.21, allegement: 700.14, rd: 1706.30, ppa: 228.37, ir: 0, tme: 0.7004 },
    1500: { net: 1500, brut: 1894.91, cout: 1996.01, coutHA: 2680.64, allegement: 684.63, rd: 1722.75, ppa: 222.75, ir: 0, tme: 0.6996 },
    1750: { net: 1750, brut: 2210.72, cout: 2593.30, coutHA: 3127.41, allegement: 534.11, rd: 1868.44, ppa: 149.94, ir: 31.50, tme: 0.8030 },
    2000: { net: 2000, brut: 2526.55, cout: 3152.76, coutHA: 3574.19, allegement: 421.43, rd: 1976.51, ppa: 45.26, ir: 68.75, tme: 0.7318 },
    2500: { net: 2500, brut: 3158.16, cout: 4198.98, coutHA: 4467.74, allegement: 268.76, rd: 2356.75, ppa: 0, ir: 143.25, tme: 0.5801 },
    3000: { net: 3000, brut: 3790.30, cout: 5184.49, coutHA: 5362.64, allegement: 178.14, rd: 2735.50, ppa: 0, ir: 264.50, tme: 0.6246 }
  };

  var HYP = {
    ref: { R0: 24000, tMax: 0.30 },
    t43: 0.43, t42: 0.42, finPlan: 2044, anCroisiere: 2060, plafond: 0.75,
    // R0 équivalents (coût employeur annuel = 12 × coût mensuel OpenFisca), arrondis au millier
    R0_1500: 24000, R0_1750: 31000, R0_2000: 38000, R0_2000_HA: 43000,
    NOUVEAUX_CAS: ['net_2000', 'net_2500', 'net_3000']
  };

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 1. Conversion net → coût employeur
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /** R0 équivalent (€/an) d'un salaire net mensuel actuel tabulé : avec allègements (règle en vigueur) et hors allègements. */
  function r0DeNet(net) {
    var o = NET_ACTUEL[net]; if (!o) return null;
    return { net: o.net, brut: o.brut, coutMois: o.cout, R0: 12 * o.cout, R0horsAllegements: 12 * o.coutHA, allegementAn: 12 * o.allegement,
             cotisationsEtCsgSalarie: o.brut - o.net, chargesPatronalesNettes: o.cout - o.brut, coin: 1 - o.net / o.cout, ratioCoutNet: o.cout / o.net };
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 2. Mondes : la pile v5.10 rechargée avec R0 et t_max donnés (HS1)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var _mondes = {};
  function monde(R0, tMax) {
    var k = R0 + '|' + tMax; if (_mondes[k]) return _mondes[k];
    var saved = {}, out = {}, n;
    for (n in G) saved[n] = G[n];
    try {
      FICHIERS.forEach(function (f) { load(f); if (f === 'palier1.js') { G.Palier1.BASE.R0 = R0; G.Palier1.BASE.tMax = tMax; } });
      for (n in G) if (G[n] !== saved[n]) out[n] = G[n];
    } finally {
      for (n in G) if (!(n in saved)) delete G[n];
      for (n in saved) G[n] = saved[n];
    }
    out.R0 = R0; out.tMax = tMax;
    return (_mondes[k] = out);
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 3. Mesures dans un monde
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };
  function pModele(W, t, sc) {
    var Z = W.Optimum, J = W.Decisions0511j;
    return W.SystemeIdeal.param(W.Voies.fus(W.GagnantsPerdantsPalier1.config(Z.versOF(Z.archi(J.archi(t)))).p, { scenario: sc || 'central' }));
  }
  /** Recette mécanique de l'impôt progressif (Md€/an) sur les assiettes après réactions, au taux de base t (HS2 i). */
  function recetteMecanique(W, t, sc) {
    var M = W.SystemeIdeal, P = pModele(W, t, sc), rc = M.recettesCourants(P), tot = 0;
    rc.parBande.forEach(function (b, i) {
      var s = i >= 9 ? 0.15 : P.dispersion, v = 0, g;
      for (g = 0; g < 5; g++) v += GH.w[g] * M.impotContinu(b.R * Math.exp(s * GH.z[g] - s * s / 2), P.tMax, P.R0);
      tot += b.n * v / 1e9;
    });
    return tot;
  }
  function soldeCroisiere(W, sc, t) { return W.Decisions0511j.solde(sc || 'central', HYP.anCroisiere, t === undefined ? HYP.t42 : t); }
  /** Contribution nette de l'impôt progressif au solde de croisière (HS2 ii). */
  function contributionNette(W, t) { return soldeCroisiere(W, 'central', t) - soldeCroisiere(monde(HYP.ref.R0, 0), 'central', t); }

  /** Plan « 43 + δ % jusqu'en 2044, puis 42 + δ % ». */
  function planDelta(d) { return function (an) { return an <= HYP.finPlan ? HYP.t43 + d : HYP.t42 + d; }; }
  /**
   * Parcours du cumul des soldes centraux (hors intérêts) sous le plan δ, avec le solde EXACT de chaque année (J.solde au taux de l'année) et non la grille 38-43 %
   * (HS4 : au-delà de 43 %, la grille extrapolée surestime le solde de 1 à 2 Md€ à +3 points). Même règle que J.parcours : pic du cumul, année, cumul final.
   */
  var _pc = {};
  function parcoursDelta(W, d) {
    var dd = d || 0, k = W.R0 + '|' + W.tMax + '|' + dd; if (_pc[k]) return _pc[k];
    var J = W.Decisions0511j, ft = planDelta(dd), y, cum = 0, pic = 0, picAn = null, serie = [];
    for (y = J.HYP.annee1; y <= J.HYP.anneeFin; y++) { cum += J.solde('central', y, ft(y)); serie.push(cum); if (cum < pic - 1e-9) { pic = cum; picAn = y; } }
    return (_pc[k] = { picDuCumul: pic, picAn: picAn, cumulFinal: cum, serie: serie });
  }
  /** Plus petit δ (points de taux, arrondi au centième de point supérieur) tel que le plan δ ne crée aucune dette supplémentaire (HS4). */
  function deltaMinimal(W) {
    if (parcoursDelta(W, 0).picAn === null) return 0;
    var lo = 0, hi = 0.01, k;
    while (parcoursDelta(W, hi).picAn !== null && hi < 0.10) hi = Math.round((hi + 0.01) * 100) / 100;
    for (k = 0; k < 10; k++) { var m = Math.round((lo + hi) / 2 * 10000) / 10000; if (parcoursDelta(W, m).picAn === null) hi = m; else lo = m; if (hi - lo <= 0.0001) break; }
    return hi;
  }
  /** (c75) : δ et t_max ensemble : plus grand t_max (pas de 0,5 point, en partant de 30) dont le δ minimal garde le taux marginal maximal sous 75 % à 43 + δ %. */
  function equilibrePlafond(R0) {
    var tm;
    for (tm = HYP.ref.tMax; tm > 0.0049; tm = Math.round((tm - 0.005) * 1000) / 1000) {
      var W = monde(R0, tm), d = deltaMinimal(W);
      if (W.Decisions0511j.marginalMax(HYP.t43 + d).taux <= HYP.plafond + 1e-9) return { tMax: tm, delta: d };
    }
    return null;
  }

  /** Nouveaux cas types : salarié seul à n € net (HS5). */
  function casNet(W, n, t) {
    var I = W.Decisions0511i, J = W.Decisions0511j, X = W.DiagnosticCoupleSmic, HR = W.HautsRevenus, o = NET_ACTUEL[n], a = J.archi(t);
    function apres(brut) {
      var c = I.coutMois(brut), sp = { adultes: 1, enfants: 0, couts: [c], type: 'seul', isole: false, ppa: o.ppa };
      return X.foyer(a, sp, {}).apres - I.impotHaut(12 * c, HR.corr(J.CORR), X.pSys(a).socle) / 12;
    }
    var r0 = apres(o.brut), r1 = apres(1.01 * o.brut), c0 = I.coutMois(o.brut), c1 = I.coutMois(1.01 * o.brut);
    return { avant: o.rd, apres: r0, ecart: r0 - o.rd, tme: 1 - (r1 - r0) / (c1 - c0), tmeActuel: o.tme, coutModele: c0, coutOpenFisca: o.cout };
  }
  function casTypes(W, t) {
    var r = W.Decisions0511j.casTypes(t);
    r.net_2000 = casNet(W, 2000, t).ecart; r.net_2500 = casNet(W, 2500, t).ecart; r.net_3000 = casNet(W, 3000, t).ecart;
    return r;
  }

  /** Bilan complet d'une configuration { R0, tMax, delta (points de taux ajoutés au plan, défaut 0) } ; leger : sans le creux (≈ 9 s de moins). */
  function evaluer(cfg, leger) {
    var W = monde(cfg.R0, cfg.tMax), J = W.Decisions0511j, d = cfg.delta || 0, t43 = HYP.t43 + d, t42 = HYP.t42 + d;
    var r = { R0: cfg.R0, tMax: cfg.tMax, delta: d, t43: t43, t42: t42 };
    r.recetteMecanique = recetteMecanique(W, t42);
    r.contributionNette = contributionNette(W, HYP.t42);
    r.solde42 = { bas: soldeCroisiere(W, 'bas'), central: soldeCroisiere(W, 'central'), haut: soldeCroisiere(W, 'haut') };
    r.soldePlan = soldeCroisiere(W, 'central', t42);
    r.ecartSolde = r.solde42.central - soldeCroisiere(monde(HYP.ref.R0, HYP.ref.tMax), 'central');
    r.tauxCroisiere = J.tauxEquilibre(HYP.anCroisiere);
    if (!leger) r.creux = J.creux();
    r.periodeMinimale43 = J.periodeMinimale43();
    r.plan = parcoursDelta(W, d);
    r.cas43 = casTypes(W, t43); r.cas42 = casTypes(W, t42);
    r.tmeSmic43 = J.tmeSmic(t43).local; r.tmeSmic42 = J.tmeSmic(t42).local;
    r.net2000 = casNet(W, 2000, t43);
    r.marginalMax43 = J.marginalMax(t43); r.marginalMax42 = J.marginalMax(t42);
    r.sousPlafond = r.marginalMax43.taux <= HYP.plafond + 1e-9;
    return r;
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 4. Recherches : t_max qui rend la même recette (b), t_max au plafond (b75), δ d'équilibre (c)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * (b) t_max qui redonne le solde de croisière central à 42 % de la v5.10 avec le seuil R0 (HS3). Le solde n'est PAS monotone en t_max (courbe de Laffer du haut de la distribution) :
   * balayage de 30 à 60 points par pas de 1 point, puis bisection sur le premier franchissement. Renvoie aussi le meilleur solde atteignable et son t_max (tMax : null si la cible est hors d'atteinte).
   */
  function tMaxMemeRecette(R0) {
    var cible = soldeCroisiere(monde(HYP.ref.R0, HYP.ref.tMax), 'central'), f = function (tm) { return soldeCroisiere(monde(R0, tm), 'central'); };
    var best = { tMax: null, solde: -Infinity }, prev = HYP.ref.tMax, tm, k, sol = null;
    for (tm = HYP.ref.tMax; tm <= 0.60 + 1e-9; tm = Math.round((tm + 0.01) * 100) / 100) {
      var v = f(tm); if (v > best.solde) best = { tMax: tm, solde: v };
      if (v >= cible) { var lo = prev, hi = tm; for (k = 0; k < 8; k++) { var m = Math.round((lo + hi) / 2 * 10000) / 10000; if (f(m) >= cible) hi = m; else lo = m; } sol = hi; break; }
      prev = tm;
    }
    return { cible: cible, tMax: sol, meilleurSolde: best.solde, tMaxMeilleur: best.tMax, manque: cible - best.solde };
  }
  /** Plus grand t_max (pas 0,1 point) qui garde le taux marginal total maximal sous 75 % à 43 % avec le seuil R0 (HS7). */
  function tMaxPlafond(R0) {
    var tm = Math.floor((HYP.plafond - HYP.t43) * 1000 + 1e-6) / 1000;
    while (tm > 0 && monde(R0, tm).Decisions0511j.marginalMax(HYP.t43).taux > HYP.plafond + 1e-9) tm = Math.round((tm - 0.001) * 1000) / 1000;
    return tm;
  }

  var API = { HYP: HYP, NET_ACTUEL: NET_ACTUEL, FICHIERS: FICHIERS, r0DeNet: r0DeNet, monde: monde, pModele: pModele, recetteMecanique: recetteMecanique, soldeCroisiere: soldeCroisiere,
              contributionNette: contributionNette, planDelta: planDelta, parcoursDelta: parcoursDelta, deltaMinimal: deltaMinimal, equilibrePlafond: equilibrePlafond, casNet: casNet, casTypes: casTypes, evaluer: evaluer,
              tMaxMemeRecette: tMaxMemeRecette, tMaxPlafond: tMaxPlafond };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.VarianteSeuil0511 = API;
})(this);
