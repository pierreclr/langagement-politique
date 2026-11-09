/*
 * modeles/systeme-ideal/voies.js — T47, extension « Trois voies, IS conservé » + socles dégressifs D1 à D4.
 * Fonctions pures au-dessus de modele.js (charger modele.js avant). Hypothèses H36 à H50 : methode.md. ⚠️ = non confirmé.
 */
(function (root) {
  'use strict';
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var D = M.DONNEES;
  function fus(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  // ---------- Scénarios de productivité (H40) : COR, rapport annuel 2026 (référence +0,7 %/an ; sensibilités 0,4 et 1,0)
  var PRODUCTIVITE = { bas: 0.004, central: 0.007, haut: 0.010, hautIA: 0.020 };   // hautIA : ⚠️ hypothèse de Claude (IA et robotique), non sourcée

  var CIBLES_A = { complAspa: true, aahDifferentielle: true, complRsa: true };
  var BASE_IS = { isConserve: true, tIS: 0.25, holdings: true, imposerComplements: true, enfant: 200 };

  /** Solde statique et par scénario d'une configuration. */
  function bilan(p) {
    var o = { statique: M.solde(fus(p, { reactions: false })) };
    ['bas', 'central', 'haut'].forEach(function (s) { o[s] = M.solde(fus(p, { scenario: s })); });
    var c = o.central;
    return { p: p, statique: o.statique.delta, bas: o.bas.delta, central: c.delta, haut: o.haut.delta,
      soldeStatique: o.statique.soldePublic, soldeBas: o.bas.soldePublic, soldeCentral: c.soldePublic, soldeHaut: o.haut.soldePublic,
      marge: c.margeInvestissement, brut: c };
  }

  /** Profil du taux marginal effectif (impôt + sortie du socle) en fonction du revenu annuel R (travail seul). */
  function profilMarginal(p) {
    var P = M.param(p), best = { m: -1, R: 0 }, pts = [], R, step;
    for (R = 3000; R <= 3e6; R += step) {
      step = R < 60000 ? 1000 : R < 300000 ? 10000 : 100000;
      var m = M.marginal(R, P) + M.penteSocle(R, 0, P);
      pts.push({ R: R, m: m });
      if (m > best.m) best = { m: m, R: R };
    }
    return { max: best.m, RAnnuel: best.R, RMensuel: best.R / 12, points: pts, margTaxeMax: M.margMax(P) };
  }
  /** Taux marginal effectif pour un revenu annuel donné. */
  function margEff(R, p) { var P = M.param(p); return M.marginal(R, P) + M.penteSocle(R, 0, P); }

  /** Recherche des taux (plat, t_max) maximisant le Δ central, sous plafond du taux marginal total asymptotique. */
  function optimiser(base, plafond, tMaxFixe) {
    var best = null;
    [0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50].forEach(function (tp) {
      (tMaxFixe ? [tMaxFixe] : [0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.60]).forEach(function (tm) {
        if (tp + tm > plafond + 1e-9) return;
        var q = fus(base, { archi: 'c2', tPlat: tp, tMax: tm, scenario: 'central' }), r = M.solde(q);
        if (!best || r.delta > best.delta) best = { tPlat: tp, tMax: tm, delta: r.delta };
      });
    });
    return best;
  }

  // ---------- Voies
  function voieA(S, plafond) {
    var base = fus(BASE_IS, fus(CIBLES_A, { socle: S, prime: 'aucune' }));
    var o = optimiser(base, plafond || 0.75);
    return fus(base, { archi: 'c2', tPlat: o.tPlat, tMax: o.tMax });
  }
  function voieB(plafond) { return fus(voieA(650, plafond), { nom: 'B (année 1)' }); }
  function voieC(plafond, tMax) {
    var base = fus(BASE_IS, fus(CIBLES_A, { socle: 650, prime: 'progressive', sousIndexation: 0.01, surcoteSeule: 0.05, retraite60: false, R0: 24000 }));
    var o = optimiser(base, plafond || 0.75, tMax || 0.45);
    return fus(base, { archi: 'c2', tPlat: o.tPlat, tMax: o.tMax });
  }

  /** Part des revenus : élasticité des recettes au revenu réel (progressivité) = Σ recettes × (marg / moyen) / Σ recettes. */
  function elasticiteRecettes(p) {
    var r = M.solde(fus(p, { scenario: 'central' })).parBande, num = 0, den = 0;
    r.forEach(function (b) { if (b.tauxMoyen > 0) { num += b.recetteMd * (b.tauxMarginal / b.tauxMoyen); den += b.recetteMd; } });
    return den > 0 ? num / den : 1;
  }

  /**
   * Trajectoire de la voie B (H41 à H44). Année 1 : socle S1 = 650 € universel (niveau du RSA : remplacement des minima à niveau constant).
   * Chaque année, croissance réelle g (productivité) : recettes × (1+g)^(ε t) ; dépenses réelles fixes (pensions, aides remplacées).
   * mode 'productivite' : S_t = S1 (1+g)^(t−1). mode 'recettes' : S_t = S1 (1+g)^(ε (t−1)), ε = élasticité des recettes (progressivité).
   * Δ_t = Δ_1 + (recettes_1 − complément) × ((1+g)^(ε(t−1)) − 1) − (coût net du socle_t − coût net du socle_1) ; coût net du socle ≈ coût marginal × ΔS.
   */
  function trajectoire(pVoie, g, mode, nAnnees) {
    var S1 = pVoie.socle, b1 = M.solde(fus(pVoie, { scenario: 'central' })), eps = elasticiteRecettes(pVoie);
    var dS = 100, b2 = M.solde(fus(pVoie, { scenario: 'central', socle: S1 + dS }));
    var coutMarg = (b1.delta - b2.delta) / dS;                     // Md€ par € de socle (net des économies sur les pensions et des recettes induites)
    var rec1 = b1.recettes.total, out = [], S = S1, atteint = null, t;
    for (t = 1; t <= (nAnnees || 10); t++) {
      var recT = rec1 * (Math.pow(1 + g, eps * (t - 1)) - 1);
      S = mode === 'recettes' ? S1 * Math.pow(1 + g, eps * (t - 1)) : mode === 'surplus' ? S1 + (b1.soldePublic + recT) / coutMarg : S1 * Math.pow(1 + g, t - 1);
      var delta = b1.delta + recT - coutMarg * (S - S1);
      out.push({ annee: t, socle: S, delta: delta, solde: D.deficitActuel + delta });
    }
    var nLim = (nAnnees || 10);
    // année d'atteinte de 1 000 € (extrapolée au-delà de nAnnees)
    var rate = mode === 'recettes' ? eps * Math.log(1 + g) : Math.log(1 + g);
    var anneeMille = S1 >= 1000 ? 1 : (rate > 0 ? 1 + Math.log(1000 / S1) / rate : Infinity);
    if (mode === 'surplus') {
      var need = (1000 - S1) * coutMarg - b1.soldePublic;
      anneeMille = need <= 0 ? 1 : 1 + Math.log(1 + need / rec1) / (eps * Math.log(1 + g));
    }
    return { trajectoire: out, elasticite: eps, coutMarginalParEuro: coutMarg, anneeMille: anneeMille, g: g, mode: mode };
  }

  // ---------- Cas types adaptés aux compléments
  var CAS_RSA = { id: 'rsa', libelle: 'Personne seule sans emploi (RSA + aide au logement)', adultes: 1, enfants: 0, age: 40, heuresSemaine: 0, actuel: 877,
    actuelNote: 'T14 : 877 €' };
  function casTypes(p) {
    var P = M.param(p), out = M.casTypes(p);
    out.forEach(function (x, i) {
      if (M.CAS[i].id === 'retraiteModeste' && P.complAspa) { x.apresMois = Math.max(x.apresMois, D.aspa.plafond); x.ecartMois = x.apresMois - x.avantMois; }
    });
    var r = M.situation(CAS_RSA, p); if (P.complRsa) r.apresMois = Math.max(r.apresMois, 877);
    r.ecartMois = r.apresMois - r.avantMois;
    out.push(r);
    return out;
  }

  // ---------- Variantes de socle dégressif D1 à D4 (tous avec IS conservé)
  var REF_TAUX_D = { archi: 'c2', tPlat: 0.30, tMax: 0.40 };    // taux de comparaison commun (marginal asymptotique 70 %)
  function variantesD(S, R1, tauxRef) {
    var ref = fus(BASE_IS, fus(tauxRef || REF_TAUX_D, { socle: S, prime: 'aucune' }));
    return [
      { id: 'D1', nom: 'Socle universel récupéré par l\'impôt', p: fus(ref, { socleMode: 'uniforme' }) },
      { id: 'D2', nom: 'Sortie linéaire S × max(0, 1 − R/R1), R1 = ' + R1 + ' €/mois', p: fus(ref, { socleMode: 'lineaire', R1: R1 }) },
      { id: 'D3', nom: 'Sortie continue S × exp(−R/R1), R1 = ' + R1 + ' €/mois', p: fus(ref, { socleMode: 'exp', R1: R1 }) },
      { id: 'D4', nom: 'D2 + réduction du patrimoine net (hors résidence principale) au-delà de 500 k€', p: fus(ref, { socleMode: 'lineaire', R1: R1, patrimoine: true }) }
    ];
  }

  /** Plus petit taux plat (t_max fixé par la configuration) tel que le solde public central ≥ cible (0 par défaut). null si aucun jusqu'à 0,60. */
  function platEquilibre(p, cible) {
    cible = cible || 0;
    var f = function (x) { return M.solde(fus(p, { archi: 'c2', tPlat: x, scenario: 'central' })).soldePublic - cible; };
    if (f(0.05) >= 0) return 0.05;
    if (f(0.60) < 0) return null;
    var a = 0.05, b = 0.60, i;
    for (i = 0; i < 40; i++) { var m = (a + b) / 2; if (f(m) >= 0) b = m; else a = m; }
    return b;
  }
  /** Socle maximal (€/mois) finançable au central (solde public ≥ 0) avec les taux de la configuration. */
  function socleMaxFinancable(p) {
    var f = function (S) { return M.solde(fus(p, { socle: S, scenario: 'central' })).soldePublic; };
    var a = 300, b = 1500, i;
    if (f(a) < 0) return null;
    if (f(b) >= 0) return b;
    for (i = 0; i < 40; i++) { var m = (a + b) / 2; if (f(m) >= 0) a = m; else b = m; }
    return a;
  }
  /** Taux marginal effectif maximal dans la zone de sortie du socle (R ≤ 12 × k × R1), et celui du sommet. */
  function margZoneSortie(p) {
    var P = M.param(p), kmax = P.socleMode === 'exp' ? 5 : 1, best = { m: -1, R: 0 }, R, top = 0;
    if (P.socleMode === 'uniforme') return null;
    var Rmax = 12 * kmax * P.R1, lo = null, hi = null;
    for (R = 1000; R <= Rmax; R += 500) { var m = margEff(R, p); if (m > best.m) best = { m: m, R: R }; }
    for (R = 1000; R <= Rmax; R += 500) if (margEff(R, p) >= best.m - 0.005) { if (lo === null) lo = R; hi = R; }
    return { m: best.m, RMensuel: best.R / 12, debutMensuel: lo / 12, finMensuel: hi / 12, sommet: M.margMax(P) };
  }

  var API = { platEquilibre: platEquilibre, socleMaxFinancable: socleMaxFinancable, margZoneSortie: margZoneSortie, PRODUCTIVITE: PRODUCTIVITE, bilan: bilan, profilMarginal: profilMarginal, margEff: margEff, optimiser: optimiser,
    voieA: voieA, voieB: voieB, voieC: voieC, trajectoire: trajectoire, elasticiteRecettes: elasticiteRecettes, casTypes: casTypes,
    variantesD: variantesD, BASE_IS: BASE_IS, CIBLES_A: CIBLES_A, REF_TAUX_D: REF_TAUX_D, fus: fus };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Voies = API;
})(this);
