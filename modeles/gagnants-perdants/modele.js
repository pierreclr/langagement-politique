/*
 * modeles/gagnants-perdants/modele.js — Tâche T14 : qui gagne, qui perd ?
 * Fonctions pures, sans dépendance. Compatible navigateur, Node et JavaScriptCore (jsc).
 *
 * Système proposé (paramétrable) : socle S par adulte + majoration E par enfant, non imposés ;
 * prélèvement unique au taux t sur tous les revenus (salaires : t × coût total employeur) ;
 * suppression de l'IR, de la CSG-CRDS, des cotisations, des aides remplacées (aides au logement,
 * RSA, prime d'activité, prestations familiales, chômage, minimum vieillesse) ; AAH maintenue ;
 * retraites : socle + complément de carrière (trois règles possibles) ; TVA et accises inchangées.
 *
 * Deux usages :
 *   1. revenuPropose(cas, p) / comparer(cas, p) : un foyer (cas types, futur onglet « mon foyer »).
 *      Le revenu disponible ACTUEL vient de cas_types_donnees.js (API OpenFisca + Urssaf, voir
 *      donnees/collecte.py) ; le revenu PROPOSÉ est calculé ici.
 *   2. deciles(p) et hautsRevenus(p) : estimation par dixième de niveau de vie (comptes nationaux
 *      distribués de l'Insee, 2023) et pour le top 1 % / 0,1 % (Filosofi 2021).
 * Statique : coût employeur, salaires, prix et comportements inchangés. Hypothèses H1 à H20 :
 * voir methode.md. Des ordres de grandeur, jamais des prédictions.
 */
(function (root) {
  'use strict';

  var DEFAUT = {
    socle: 1000,            // € par adulte et par mois
    enfant: 200,            // € par enfant et par mois (hypothèse de départ du simulateur)
    taux: 0.5,              // prélèvement unique
    retraite: 'brut',       // 'brut' : complément = pension brute − socle, non imposé (simulateur, T13)
                            // 'net'  : complément = pension nette actuelle − socle (T13, « sur le net »)
                            // 'impose' : complément = pension brute − socle, imposé au taux t
    isRepercute: false,     // true : la suppression de l'IS (25 %) est reversée en dividendes
    tauxIS: 0.25,           // taux normal de l'IS (art. 219 CGI)
    abattementHeritage: 0,  // € exonérés par héritier dans le système proposé (0 = « comme un revenu »)
    partAAH: 0.334          // part de l'AAH dans « prime d'activité et minima sociaux » (H12)
  };

  function param(p) {
    var r = {}, k;
    for (k in DEFAUT) r[k] = DEFAUT[k];
    if (p) for (k in p) r[k] = p[k];
    return r;
  }

  // ======================================================================
  // 1. Un foyer
  // ======================================================================

  /** Revenu disponible mensuel dans le système proposé (hors héritage ponctuel). */
  function revenuPropose(cas, p) {
    p = param(p);
    var t = p.taux, d = {};
    d.socle = p.socle * cas.adultes + p.enfant * cas.enfants;
    d.salaires = (1 - t) * (cas.couts_employeur || []).reduce(function (s, x) { return s + x; }, 0);
    d.independant = cas.micro_ca ? (1 - t) * cas.micro_ca * (1 - cas.charges_reelles_part) : 0;
    var div = (cas.dividendes_annuels || 0) / 12 * (p.isRepercute ? 1 / (1 - p.tauxIS) : 1);
    d.capital = (1 - t) * (div + (cas.foncier_annuel || 0) / 12);
    d.complementRetraite = 0;
    var pensions = cas.pensions || [], brutTotal = pensions.reduce(function (s, x) { return s + x; }, 0);
    pensions.forEach(function (pb) {
      if (p.retraite === 'net') {
        // pension nette actuelle de l'intéressé : part de la pension nette totale du foyer
        var pn = cas.actuel.pensions_nettes * pb / brutTotal;
        d.complementRetraite += Math.max(0, pn - p.socle);
      } else if (p.retraite === 'impose') {
        d.complementRetraite += (1 - t) * Math.max(0, pb - p.socle);
      } else {
        d.complementRetraite += Math.max(0, pb - p.socle);
      }
    });
    d.chomage = 0;     // supprimé (remplacé par le socle)
    d.total = d.socle + d.salaires + d.independant + d.capital + d.complementRetraite;
    return d;
  }

  /** Droits de succession actuels en ligne directe (art. 777 et 779 du CGI). */
  function droitsSuccession(montant) {
    var base = Math.max(0, montant - 100000), impot = 0, bas = 0;
    var tr = [[8072, 0.05], [12109, 0.10], [15932, 0.15], [552324, 0.20], [902838, 0.30], [1805677, 0.40], [Infinity, 0.45]];
    for (var i = 0; i < tr.length; i++) {
      if (base > bas) impot += (Math.min(base, tr[i][0]) - bas) * tr[i][1];
      bas = tr[i][0];
    }
    return impot;
  }

  /** Héritage : ce que garde l'héritier aujourd'hui et demain (montant ponctuel). */
  function heritage(montant, p) {
    p = param(p);
    var actuel = montant - droitsSuccession(montant);
    var propose = montant - p.taux * Math.max(0, montant - p.abattementHeritage);
    return { montant: montant, actuel: actuel, propose: propose, ecart: propose - actuel,
             tauxActuel: droitsSuccession(montant) / montant, tauxPropose: (montant - propose) / montant };
  }

  /** Comparaison complète d'un cas type : actuel, proposé, écart mensuel et annuel. */
  function comparer(cas, p) {
    var prop = revenuPropose(cas, p), act = cas.actuel.revenu_disponible;
    var r = { id: cas.id, libelle: cas.libelle, actuel: act, propose: prop.total, detail: prop,
              ecartMois: prop.total - act, ecartAn: 12 * (prop.total - act), ecartPct: (prop.total - act) / act };
    if (cas.heritage) {
      r.heritage = [100000, cas.heritage, 1000000].map(function (m) { return heritage(m, p); });
    }
    return r;
  }

  /** Taux qui annule l'écart d'un foyer (point mort), par dichotomie ; null si hors [0 ; 1]. */
  function tauxPointMort(cas, p) {
    p = param(p);
    var f = function (t) { var q = param(p); q.taux = t; return revenuPropose(cas, q).total - cas.actuel.revenu_disponible; };
    if (f(0) < 0 || f(1) > 0) return null;
    var a = 0, b = 1;
    for (var i = 0; i < 60; i++) { var m = (a + b) / 2; if (f(m) > 0) a = m; else b = m; }
    return (a + b) / 2;
  }

  // ======================================================================
  // 2. Par dixième de niveau de vie (comptes nationaux distribués, Insee 2023)
  // ======================================================================

  // Insee Analyses n° 119 (avril 2026), figure 1a, € par UC et par an, 2023, D1 à D10.
  var DINA = {
    salairesSuperBruts: [3500, 9400, 14200, 19500, 24200, 28200, 34200, 41400, 52200, 87900],
    revenusMixtes:      [300, 700, 900, 1100, 1100, 1300, 1600, 2500, 3600, 15700],
    revenusFinanciers:  [400, 500, 600, 800, 900, 1200, 1600, 2200, 3700, 16600],
    loyers:             [2400, 2500, 3700, 4100, 4700, 5400, 6100, 6900, 8200, 11400], // réels + imputés
    impots:             [1000, 900, 1500, 2200, 2900, 3700, 4700, 6300, 9200, 25900],
    cotisations:        [1300, 3200, 4700, 6500, 8300, 9600, 12100, 15100, 19800, 34900],
    prestations:        [8000, 10600, 11700, 11500, 12000, 12600, 12800, 13400, 14600, 18500],
    pensions:           [2300, 4900, 7200, 7600, 8300, 9300, 9500, 10100, 11200, 14200],
    autresTransferts:   [0, -100, -100, -100, -200, -200, -200, -300, -400, -800],
    rdb:                [12400, 19600, 24800, 28200, 31600, 35300, 39200, 44800, 53000, 88400]
  };
  // Même publication, par vingtième : figure 2a (Md€) et figure 3b (RDB en € par UC).
  var VINGTIEMES = {
    rdbMd: [21.4, 36.2, 43.1, 48.5, 55.5, 61.7, 66, 69.2, 73, 76.3, 80.1, 85.7, 90, 95.2, 101.6, 109.4, 117.1, 129.6, 152.6, 263.6],
    pensionsChomageMd: [4.9, 11.5, 13.5, 15, 18.2, 21.1, 21.1, 20, 21.5, 22.1, 21.8, 25.3, 22.9, 25.6, 25, 26.3, 26.3, 29.8, 33.1, 39],
    rdbParUC: [9060, 15840, 18510, 20700, 23630, 25920, 27450, 29010, 30810, 32460, 34280, 36230, 38130, 40370, 43110, 46430, 50710, 55300, 64710, 112200]
  };
  // France, portrait social 2025, fiche « Redistribution monétaire », figure 1 (2024, € par UC et
  // par an, par niveau de vie AVANT redistribution) ramenée aux dixièmes (H11) :
  // D2 = 2 × (<Q1) − (<D1) ; D3 = D4 = (Q1-Q2) ; ... ; D9 = 2 × (>Q4) − (>D9).
  var FPS = {
    prestationsFamiliales: [2000, 1400, 860, 860, 510, 510, 300, 300, 180, 120],
    aidesLogement:         [1920, 720, 150, 150, 40, 40, 30, 30, 20, 20],
    primeActiviteMinima:   [3650, 1510, 710, 710, 270, 270, 170, 170, 110, 70]
  };
  var POP = { adultes: 55.226e6, enfants: 13.855e6, retraitesResidents: 16.5e6 }; // H9, H13
  var LOYERS_REELS_MD = 40.9; // loyers réels nets déclarés par les particuliers (sources/recherche-donnees-simulateur.md)
  // T13 (modeles/retraites/resultats.md) : économie sur les pensions (Md€/an) selon le socle.
  var ECONOMIE_RETRAITES_BRUT = [[0, 0], [500, 97.2], [800, 151.4], [1000, 185.5], [1200, 216.8], [1500, 258.1], [2000, 310.4]];
  var ECONOMIE_RETRAITES_NET = [[0, 0], [500, 126], [800, 180], [1000, 214], [1200, 244], [1500, 284], [2000, 331]];

  function interp(pts, x) {
    if (x <= pts[0][0]) return pts[0][1];
    for (var i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
      var a = pts[i - 1], b = pts[i];
      return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    }
    var n = pts.length - 1;
    return pts[n][1] + (pts[n][1] - pts[n - 1][1]) * (x - pts[n][0]) / (pts[n][0] - pts[n - 1][0]);
  }

  /** Unités de consommation par dixième (millions), déduites des vingtièmes. */
  function ucParDecile() {
    var uc = [];
    for (var d = 0; d < 10; d++) {
      var a = 2 * d, b = 2 * d + 1;
      uc.push((VINGTIEMES.rdbMd[a] * 1e9 / VINGTIEMES.rdbParUC[a] + VINGTIEMES.rdbMd[b] * 1e9 / VINGTIEMES.rdbParUC[b]) / 1e6);
    }
    return uc;
  }

  /** Nombre de retraités par dixième : N_d = pensions_d / (κ × RDB par UC_d), κ calé sur le total (H13). */
  function retraitesParDecile(uc) {
    var f = function (k) {
      var s = 0;
      for (var d = 0; d < 10; d++) s += DINA.pensions[d] * uc[d] * 1e6 / (k * DINA.rdb[d]);
      return s;
    };
    var a = 0.05, b = 5;
    for (var i = 0; i < 80; i++) { var m = (a + b) / 2; if (f(m) > POP.retraitesResidents) a = m; else b = m; }
    var k = (a + b) / 2, n = [], pbar = [];
    for (var d = 0; d < 10; d++) { pbar.push(k * DINA.rdb[d]); n.push(DINA.pensions[d] * uc[d] * 1e6 / pbar[d]); }
    return { kappa: k, effectifs: n, pensionMoyenneAn: pbar };
  }

  /**
   * Estimation par dixième. Pour chaque dixième d (€ par UC et par an) :
   *   actuel  = RDB_d (Insee)                       [les aides au logement sont hors RDB : transfert en nature]
   *   proposé = socle par UC + (1 − t) × (salaires super-bruts + revenus mixtes + revenus financiers
   *             + loyers réels) + loyers imputés + pensions nouvelles + prestations conservées
   *             + autres transferts
   *   écart   = proposé − actuel − aides au logement perdues
   * Puis répartition gagnants / perdants : trois groupes (actifs, retraités, chômeurs indemnisés)
   * et une dispersion uniforme des revenus dans le dixième (H16 à H18).
   */
  function deciles(p) {
    p = param(p);
    var t = p.taux, uc = ucParDecile();
    var ucTotal = uc.reduce(function (s, x) { return s + x; }, 0);
    var socleUC = 12 * (p.socle * POP.adultes + p.enfant * POP.enfants) / (ucTotal * 1e6);
    var ret = retraitesParDecile(uc);
    // économie sur les pensions : clé min(pension moyenne, socle annuel) × effectif, calée sur T13
    var cle = [], sCle = 0;
    for (var d = 0; d < 10; d++) { cle.push(ret.effectifs[d] * Math.min(ret.pensionMoyenneAn[d], 12 * p.socle)); sCle += cle[d]; }
    var ecoTotale = interp(p.retraite === 'net' ? ECONOMIE_RETRAITES_NET : ECONOMIE_RETRAITES_BRUT, p.socle) * 1e9;
    var finTotal = 0;
    for (d = 0; d < 10; d++) finTotal += DINA.revenusFinanciers[d] * uc[d] * 1e6;
    var res = [], aggr = 0;
    for (d = 0; d < 10; d++) {
      var D = {}, k;
      for (k in DINA) D[k] = DINA[k][d];
      var chomage = Math.max(0, (VINGTIEMES.pensionsChomageMd[2 * d] + VINGTIEMES.pensionsChomageMd[2 * d + 1]) * 1e9 / (uc[d] * 1e6) - D.pensions);
      var autresPrest = D.prestations - D.pensions - chomage;
      var remplacees = FPS.prestationsFamiliales[d] + (1 - p.partAAH) * FPS.primeActiviteMinima[d];
      remplacees = Math.min(remplacees, autresPrest);
      var apl = FPS.aidesLogement[d];
      var loyersReels = Math.min(D.loyers, LOYERS_REELS_MD * 1e9 * D.revenusFinanciers / finTotal); // H10
      var loyersImputes = D.loyers - loyersReels;
      var eco = ecoTotale * cle[d] / sCle / (uc[d] * 1e6); // € par UC
      var pensionsNouvelles = D.pensions - eco;
      if (p.retraite === 'impose') pensionsNouvelles = (1 - t) * pensionsNouvelles;
      var propose = socleUC + (1 - t) * (D.salairesSuperBruts + D.revenusMixtes + D.revenusFinanciers + loyersReels)
        + loyersImputes + pensionsNouvelles + (autresPrest - remplacees) + D.autresTransferts;
      var ecart = propose - D.rdb - apl;
      // --- groupes ---
      var salNet = D.salairesSuperBruts - D.cotisations;
      var act = salNet + D.revenusMixtes, src = act + D.pensions + chomage;
      var w = { actifs: act / src, retraites: D.pensions / src, chomeurs: chomage / src };
      var capital = D.revenusFinanciers + loyersReels;
      var impotsParUC = D.impots; // tous les groupes du dixième ont le même revenu par UC (H16)
      var commun = -t * capital + impotsParUC - remplacees - apl; // variation commune, hors socle et revenu propre
      var grossissement = (D.salairesSuperBruts + D.revenusMixtes) / act;
      var dg = {
        actifs: socleUC + commun + src * ((1 - t) * grossissement - 1),
        retraites: socleUC + commun + src * (pensionsNouvelles / D.pensions - 1),
        chomeurs: socleUC + commun - src
      };
      // dispersion : revenu × m, m uniforme sur [lo ; hi] (bornes tirées des vingtièmes)
      var v1 = VINGTIEMES.rdbParUC[2 * d], v2 = VINGTIEMES.rdbParUC[2 * d + 1], demi = (v2 - v1) / 2;
      var lo = Math.max(0, v1 - demi) / D.rdb, hi = (v2 + demi) / D.rdb;
      var partGagnants = 0;
      for (var g in dg) {
        var L = socleUC - dg[g]; // part de l'écart proportionnelle au revenu
        var pg;
        if (L <= 0) pg = 1;
        else { var mStar = socleUC / L; pg = Math.max(0, Math.min(1, (mStar - lo) / (hi - lo))); }
        partGagnants += w[g] * pg;
      }
      aggr += ecart * uc[d] * 1e6;
      res.push({
        decile: 'D' + (d + 1), uc: uc[d], rdbActuel: D.rdb, propose: propose - apl, ecartAnUC: ecart,
        ecartMoisUC: ecart / 12, ecartPct: ecart / D.rdb, partGagnants: partGagnants, partPerdants: 1 - partGagnants,
        groupes: { poids: w, ecartMoisUC: { actifs: dg.actifs / 12, retraites: dg.retraites / 12, chomeurs: dg.chomeurs / 12 } },
        detail: { socleUC: socleUC, chomage: chomage, remplacees: remplacees, aidesLogement: apl, loyersReels: loyersReels,
                  economieRetraites: eco, impotsSupprimes: D.impots, cotisationsSupprimees: D.cotisations }
      });
    }
    return { deciles: res, ecartTotalMd: aggr / 1e9, socleParUC: socleUC, ucTotal: ucTotal, retraites: ret };
  }

  // ======================================================================
  // 3. Top 1 % et 0,1 % (Insee, Revenus et patrimoine des ménages 2024, fiche « Très hauts revenus »,
  //    Filosofi 2021) : composition du niveau de vie en % ; seuil du revenu avant redistribution.
  // ======================================================================
  var HAUTS = {
    top1:   { seuil: 121370, salaires: 60.2, independants: 20.0, pensions: 11.9, mobilier: 34.6, foncier: 9.1, financiersImputes: 5.3, impotsPrestations: -41.2 },
    top01:  { seuil: 332420, salaires: 42.6, independants: 14.7, pensions: 6.6, mobilier: 68.1, foncier: 6.0, financiersImputes: 2.8, impotsPrestations: -40.8 }
  };
  var HYP_HAUTS = {
    pareto: 2.0,            // revenu moyen du groupe / seuil (H19) ; 1,8 à 2,1
    coutEmployeurSurNet: 1.6, // calculé sur les cas types cadre_4x et très haut salaire (1,60 et 1,58)
    independantBrutSurNet: 1.3, // ⚠️ hypothèse : bénéfice avant cotisations / revenu déclaré
    adultesParUC: 1.25,     // ⚠️ couples majoritaires (Insee : 66 % de couples dans le top 1 %)
    ucParMenage: 1.6,       // ⚠️
    economieRetraitesPart: 0.3, // ⚠️ part de la pension reprise par le socle chez ces retraités aisés
    partDividendesDansMobilier: 0.8 // ⚠️ pour la variante « IS répercuté »
  };

  function hautsRevenus(p, hyp) {
    p = param(p);
    var h = {}, k;
    for (k in HYP_HAUTS) h[k] = HYP_HAUTS[k];
    if (hyp) for (k in hyp) h[k] = hyp[k];
    var out = {};
    for (var g in HAUTS) {
      var c = HAUTS[g];
      var positif = c.salaires + c.independants + c.pensions + c.mobilier + c.foncier + c.financiersImputes;
      var revenuAvant = h.pareto * c.seuil;           // € par UC et par an
      var nv = revenuAvant / (positif / 100);         // niveau de vie moyen estimé
      var u = nv / 100;                               // 1 point de niveau de vie
      var mob = c.mobilier * (1 + (p.isRepercute ? h.partDividendesDansMobilier * (1 / (1 - p.tauxIS) - 1) : 0));
      var base = c.salaires * h.coutEmployeurSurNet + c.independants * h.independantBrutSurNet + mob + c.foncier + c.financiersImputes;
      var pensions = c.pensions * (1 - h.economieRetraitesPart) * (p.retraite === 'impose' ? 1 - p.taux : 1);
      var socle = 12 * p.socle * h.adultesParUC;
      var propose = socle + u * ((1 - p.taux) * base + pensions);
      out[g] = { niveauDeVieAn: nv, proposeAn: propose, ecartAnUC: propose - nv, ecartMoisUC: (propose - nv) / 12,
                 ecartMoisMenage: (propose - nv) / 12 * h.ucParMenage, ecartPct: (propose - nv) / nv };
    }
    return out;
  }

  var API = {
    DEFAUT: DEFAUT, DINA: DINA, VINGTIEMES: VINGTIEMES, FPS: FPS, POP: POP, HAUTS: HAUTS, HYP_HAUTS: HYP_HAUTS,
    revenuPropose: revenuPropose, comparer: comparer, droitsSuccession: droitsSuccession, heritage: heritage,
    tauxPointMort: tauxPointMort, ucParDecile: ucParDecile, retraitesParDecile: retraitesParDecile,
    deciles: deciles, hautsRevenus: hautsRevenus, interp: interp
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.GagnantsPerdants = API;
})(this);
