/*
 * modeles/systeme-ideal/decisions_0611_v75.js — v7.5 PROPOSÉE (06/11/2026), NON ADOPTÉE : fonction du patrimoine recadrée (position de l'auteur du 06/11/2026)
 * et compléments de l'auteur transmis le 06/11 (abattement unique à comparer ; effets de bord). Part de la v7.4 B adoptée (arbitrage 45 ; decisions_0611_v74.js).
 *
 * Deux régimes comparés, chacun testé pour X = 500 k€, 750 k€, 1 M€ et t∞ = 2 %, 2,5 %, 3 % :
 *   « RP » (régime propre à la résidence principale, demande de l'auteur) :
 *       (1) résidence principale : τRP × min(RP brute, X), τRP = taxe foncière moyenne des ménages rapportée à la valeur (calée dans la population, ≈ 0,25 %) ;
 *       (2) fonction du patrimoine sur Wf = (part de la RP au-delà de X) + locatif + résidences secondaires + parts, titres, biens professionnels − dettes,
 *           les dettes de la RP s'imputant d'abord sur sa part sous X (elles n'abritent pas le reste) ; Wf réduit de la franchise F (défaut 0).
 *   « AB » (abattement unique par ménage, variante demandée le 06/11) : même (1) ; fonction sur max(0, W net − X) : le propriétaire impute X sur sa RP,
 *       le locataire sur son épargne ; aucun avantage de statut.
 *   Fonction : P(Wf) = t∞ × Wf² / (Wf + K), K = 700 000 € (v7.4 B) ; impôt plancher P' = max(0, P − C_k) ; paiement : min(P', max(x(N) × N − charge RP, 2 % × A)),
 *   (option payeProrata, recommandée : la part de P' afférente aux actifs mobilisables est toujours payée, en titres au besoin), le reste différé (créance garantie, v7.4) ; les exonérations et le plafonnement actuels de la taxe foncière de la RP (CGI 1390, 1391, 1391 B, 1391 B ter) sont repris
 *   pour la part (1), plus un bouclier individuel de transition (jamais plus que la taxe foncière indexée de l'occupant actuel, tant qu'il garde le bien).
 *
 * Population : celle de l'étude « qui paie plus » (sources/calculs/patrimoine_qui_paie_plus.js, copiée ici en fonctions : 4 700 ménages-types pondérés, HVP 2023-2024 × 1,4,
 * queue de Pareto, loi jointe revenu × patrimoine de la v7.4) ; ancien système et revenus du capital : mêmes formules (HQ1 à HQ12 de l'étude), réécrites en fonctions pures.
 * Assiette chiffrée : immobilier + actions et fonds + biens professionnels (comme le bilan, assiette « pierreNet » de taxe_patrimoine.js) : dépôts et assurance-vie ne sont
 * PAS dans la recette chiffrée (H75.6, ⚠️ V16906), alors que le texte de la v7.4 les inclut : recette sous-estimée de ce côté.
 * Euros 2024-2026 ; €/an par ménage ; Md€/an pour les masses. Des hypothèses et des ordres de grandeur, jamais des prédictions. Ne modifie AUCUN module existant.
 * Charger (jsc) : la liste de test_decisions_0611_v74.js sans le test, puis ce fichier (ordre complet en tête de test_decisions_0611_v75.js).
 */
(function (root) {
  'use strict';
  var A = root.Decisions0611V74, TP = root.TaxePatrimoine, Z = root.Decisions0611V73;
  var NM = 30.9e6;

  // ======================================================================================================================================
  // 0. Données sourcées et hypothèses
  // ======================================================================================================================================
  var S = { tfMen: 26.202, tfEnt: 16.738, dmto: 17.199, dmtg: 20.819, ifi: 2.682, thrs: 3.153,     // Insee 3.217 via recettes.csv ; TH RS + vacants : GL-REC-063 (C09)
            csgCap: 17.6, psCap: 14.991, loyers: 40.9, interets: 71.7, dividendes: 74.9, av: 67.5, pv: 25.6, actifsFin: 7096, patNet: 14953,
            immoMenagesCN: 4807 + 233 + 4043 + 613,                                                       // Insee IP 2081, fig. 2 : 9 696 Md€ (logements, autres bâtiments, terrains bâtis, autres non produits)
            g05v74: 54.52, g05differe: 12.43, staticV74: 81.05,                                            // bilan global (document de travail non publié, § 00.1) ; étude par tranche
            manqueRef: 18.7, manqueTout: 29.1,                                                             // modeles/grand-livre/corrections-bilan.md (trous à financer)
            livretA: 22950, ldds: 12000 };                                                                 // CMF R221-2, D221-103 (plafonds par personne)
  var HYP = {
    K: 7e5, tInfs: [0.02, 0.025, 0.03], plafonds: [5e5, 7.5e5, 1e6],
    tauRPsource: S.tfMen / S.immoMenagesCN,       // H75.1 : 0,270 % (taxe foncière des ménages / immobilier des ménages, comptes nationaux 2024)
    tauRP: null,                                  // H75.1 : valeur calée dans la population (taux qui reproduit 26,202 Md€ sur l'immobilier brut reconstitué) : fixée à l'initialisation
    F: 0,                                         // franchise générale de la fonction (testée : 0 ; 100 000 €)
    epargneReglementee: 1.7 * (22950 + 12000),    // H75.2 : livret A + LDDS par adulte × 1,7 adulte : exonération plafonnée (hors assiette chiffrée de toute façon, H75.6)
    calageRP: 0.96 * (1 - 0.01),                  // H75.3 : part (1) : valorisation (valImmo central 0,96) × (1 − gestion 1 %) ; pas d'érosion (assiette immobile, taux de taxe foncière)
    boucliersigma: 0.5,                           // H75.4 : dispersion (écart-type du log) du rapport taxe foncière / valeur entre logements ⚠️ V16904 (aucune source lue)
    rotationRP: 1 / 20,                           // H75.5 : part des résidences principales qui changent de propriétaire chaque année (≈ 5 %) ⚠️ V16905
    trimestre: 1
  };

  // ======================================================================================================================================
  // 1. Fonctions de base
  // ======================================================================================================================================
  function Pf(W, c) { var t = c && c.tInf !== undefined ? c.tInf : 0.02, K = c && c.K ? c.K : HYP.K; return W <= 0 ? 0 : t * W * W / (W + K); }
  function tauxMoyenF(W, c) { return W > 0 ? Pf(W, c) / W : 0; }
  function marginalF(W, c) { var t = c && c.tInf !== undefined ? c.tInf : 0.02, K = c && c.K ? c.K : HYP.K; if (W <= 0) return 0; var q = K / (W + K); return t * (1 - q * q); }
  /** Partage d'un patrimoine selon le régime : rpG (RP brute), dRP (dette de la RP), autres (brut hors RP), dAutres (autres dettes). Rend {rp: base de la part (1), wf: base de la fonction}. */
  function bases(rpG, dRP, autres, dAutres, c) {
    var X = c.X, rpBase = Math.min(rpG, X), F = c.F !== undefined ? c.F : HYP.F, wf;
    if (c.regime === 'AB') {
      var net = rpG + autres - dRP - dAutres;
      wf = Math.max(0, net - X - F);
    } else {
      var exces = Math.max(0, rpG - X) - Math.max(0, dRP - Math.min(rpG, X));
      wf = Math.max(0, exces + autres - dAutres - F);
    }
    return { rp: rpBase, wf: wf };
  }
  function chargeRP(rpBase, c) { return (c.tauRP !== undefined ? c.tauRP : HYP.tauRP) * rpBase; }
  /** Bouclier de transition (H75.4) : part de la charge RP au-dessus de la taxe foncière actuelle, si le rapport TF/valeur suit une loi log-normale de moyenne τ et d'écart-type σ. */
  function partBouclier(sigma) {
    // E[max(0, 1 − Y)] avec Y log-normale de moyenne 1 : intégration numérique
    var s = sigma, mu = -s * s / 2, n = 4000, tot = 0, i;
    for (i = 0; i < n; i++) { var z = -6 + 12 * (i + 0.5) / n, y = Math.exp(mu + s * z), d = Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI) * 12 / n; if (y < 1) tot += (1 - y) * d; }
    return tot;
  }

  // ======================================================================================================================================
  // 2. Population de l'étude « qui paie plus » (copie des fonctions de sources/calculs/patrimoine_qui_paie_plus.js)
  // ======================================================================================================================================
  var r = A.HYP.patrimoine.recalage, ad = A.HYP.adultes, PHI = TP.PHI, H = TP.HVP, PAR = TP.PARAM.central, b = A.sched();
  var HQ = { rendFinNat: (S.interets + S.dividendes + S.av) / S.actifsFin, rendFin: 0, partDiv: S.dividendes / (S.interets + S.dividendes + S.av),
             partAV: S.av / (S.interets + S.dividendes + S.av), rendLoc: PAR.rendementLocatif, ps: 0.172, ir: 0.128, crdsPart: 0.5 / 9.2 };
  var PS_CIBLE = S.csgCap + S.psCap + S.csgCap * HQ.crdsPart;
  function tmi(yAn) { return yAn <= 11600 ? 0 : yAn <= 29579 ? 0.11 : yAn <= 84577 ? 0.30 : yAn <= 181917 ? 0.41 : 0.45; }
  function brutQ(p) { var s = H.seuils, i; if (p >= 0.95) return s[10][1] * Math.pow(0.05 / (1 - p), 1 / H.alphaPareto);
    for (i = 1; i < s.length; i++) if (p <= s[i][0]) return s[i - 1][1] + (s[i][1] - s[i - 1][1]) * (p - s[i - 1][0]) / (s[i][0] - s[i - 1][0]); return s[10][1]; }
  function Fbrut(x) { if (x <= 0) return 0; var lo = 0, hi = 1 - 1e-12, k; for (k = 0; k < 60; k++) { var m = (lo + hi) / 2; if (brutQ(m) < x) lo = m; else hi = m; } return (lo + hi) / 2; }
  function densite(x) { if (x <= 0) return 0; var e = 0.01; return (Fbrut(x * (1 + e)) - Fbrut(x * (1 - e))) / (2 * e * x); }
  var qm = H.quartilesNiveauVie, moy = (qm[0] + qm[1] + qm[2] + qm[3]) / 4;
  function poids(W) { var w = qm.map(function (m) { var c = m / moy; return densite(W / c) / c; }), s = w[0] + w[1] + w[2] + w[3]; return s > 0 ? w.map(function (x) { return x / s; }) : [0.25, 0.25, 0.25, 0.25]; }
  function tr(p) { for (var i = 0; i < H.tranches.length; i++) if (p < H.tranches[i][0]) return i; return H.tranches.length - 1; }
  var cells = null, E = null;
  function init() {
    if (cells) return;
    cells = []; var i, n1 = 4000, n2 = 700;
    for (i = 0; i < n1; i++) cells.push({ p: 0.99 * (i + 0.5) / n1, dp: 0.99 / n1 });
    var q0 = 0.01, q1 = 1e-6, lg = Math.log(q0 / q1);
    for (i = 0; i < n2; i++) { var a = q0 * Math.exp(-lg * i / n2), c = q0 * Math.exp(-lg * (i + 1) / n2); cells.push({ p: 1 - Math.sqrt(a * c), dp: a - c }); }
    var dpTot = cells.reduce(function (s, x) { return s + x.dp; }, 0); cells.forEach(function (x) { x.dp /= dpTot; });
    cells.forEach(function (x) {
      var W = brutQ(x.p), k = tr(x.p), t = H.tranches[k];
      x.k = k; x.W = W; x.immoG = r * W * t[1] / 100; x.fin = r * W * t[2] / 100; x.pro = r * W * t[3] / 100; x.emp = r * W * t[5] / 100;
      x.net = r * W * (1 - t[5] / 100); x.wq = poids(W);
    });
    var baseActions = 0; cells.forEach(function (x) { x.act = x.pro + PHI[x.k] * x.fin; baseActions += x.act * x.dp * NM; });
    var cPV = S.pv * 1e9 / baseActions; cells.forEach(function (x) { x.pv = cPV * x.act; });
    var fT0 = 0; cells.forEach(function (x) { fT0 += x.fin * x.dp * NM; }); HQ.rendFin = (S.interets + S.dividendes + S.av) * 1e9 / fT0;
    var sumImmoG = 0, sumNetAbove = 0, sumLoc = 0; cells.forEach(function (x) { var w = x.dp * NM; sumImmoG += x.immoG * w; sumLoc += (1 - A.HYP.partRP[x.k]) * x.immoG * w; });
    E = { tfRate: S.tfMen * 1e9 / sumImmoG, dmtoRate: S.dmto * 1e9 / sumImmoG, thrsRate: S.thrs * 1e9 / sumLoc, dmtgSeuil: 100000, dmtgRate: 0, exempt: 0, ifiScale: 1 };
    cells.forEach(function (x) { sumNetAbove += Math.max(0, x.net - E.dmtgSeuil) * x.dp * NM; }); E.dmtgRate = S.dmtg * 1e9 / sumNetAbove;
    var psTotal = function (ex) { var s = 0; cells.forEach(function (x) { var finImp = HQ.rendFin * Math.max(0, x.fin - ex), im = Math.max(0, x.immoG - x.emp), loc = im - A.HYP.partRP[x.k] * im;
      s += x.dp * NM * HQ.ps * (finImp + HQ.rendLoc * loc + x.pv); }); return s / 1e9; };
    var ifiRaw = 0; cells.forEach(function (x) { var im = Math.max(0, x.immoG - x.emp), bs = im - 0.3 * A.HYP.partRP[x.k] * im; ifiRaw += x.dp * NM * (bs > 1.3e6 ? Z.ifi(bs) : 0); }); E.ifiScale = S.ifi * 1e9 / ifiRaw;
    var lo = 0, hi = 5e6, it; for (it = 0; it < 50; it++) { var mid = (lo + hi) / 2; if (psTotal(mid) > PS_CIBLE) lo = mid; else hi = mid; } E.exempt = (lo + hi) / 2;
    if (HYP.tauRP === null) HYP.tauRP = E.tfRate;
  }

  // ======================================================================================================================================
  // 3. Un ménage : ancien système, v7.4 B, v7.5 (€/an)
  //    h = { k, immoG, emp, fin, pro, net, act, pv, wq, rev } (cellule) ou cas type avec rp (RP brute), loc (locatif brut), mo (parts et titres taxables), dRP, dAutres, Amob, finInc...
  // ======================================================================================================================================
  function decompose(h) {
    if (h.rp !== undefined) {
      var dRP = h.dRP || 0, dA = h.dAutres || 0;
      return { rpG: h.rp, locG: h.loc || 0, mo: h.mo || 0, dRP: dRP, dA: dA, im: h.rp + (h.loc || 0) - dRP - dA, rpNet: h.rp - dRP, locNet: h.loc || 0 };
    }
    var rpG = A.HYP.partRP[h.k] * h.immoG, locG = h.immoG - rpG, dRP = Math.min(h.emp, rpG), dA = h.emp - dRP;   // H75.7 : les emprunts financent d'abord la RP
    var im = Math.max(0, h.immoG - h.emp), mo = Math.max(0, h.pro + PHI[h.k] * h.fin + Math.min(0, h.immoG - h.emp));
    var rpS = A.HYP.partRP[h.k] * im;                                                                                   // partage de l'étude (pour les loyers et l'IFI)
    return { rpG: rpG, locG: locG, mo: mo, dRP: dRP, dA: dA, im: im, rpNet: rpS, locNet: im - rpS };
  }
  /** c : { regime, X, tInf, K, tauRP, F, plancher (true) } ; renvoie toutes les composantes ancien / v7.4 / v7.5. */
  function evalHH(h, c) {
    init();
    var d = decompose(h), rp = d.rpNet, loc = d.locNet, mo = d.mo, Wt = d.im + mo, Amob = (h.Amob !== undefined ? h.Amob : PHI[h.k] * h.fin);
    var rF = h.finRate || HQ.rendFin, finInc = h.finInc !== undefined ? h.finInc : rF * (h.fin || 0), loy = h.noLoyer ? 0 : HQ.rendLoc * loc, pv = h.pv || 0, wqs = h.wq || [1], revs = h.rev || A.HYP.revenusQuartiles;
    var immoTF = d.rpG + d.locG, o = { W: Wt, net: h.net };
    // ----- ancien : stock (TF, DMTO annualisés, IFI, TH des résidences secondaires), DMTG, revenus du capital
    o.tf = E.tfRate * immoTF; o.dmto = E.dmtoRate * immoTF; o.thrs = (h.thrs !== undefined && h.thrs !== null ? h.thrs : E.thrsRate * d.locG);
    var ifiB = h.ifiBase !== undefined ? h.ifiBase : (d.im - 0.3 * rp); o.ifi = ifiB > 1.3e6 ? Z.ifi(ifiB) * (h.exactIfi ? 1 : E.ifiScale) : 0;
    o.dmtg = E.dmtgRate * Math.max(0, (h.net || Wt) - E.dmtgSeuil);
    var finImp = h.finInc !== undefined ? h.finInc : rF * Math.max(0, (h.fin || 0) - E.exempt), tmiLab = 0;
    wqs.forEach(function (w, q) { tmiLab += w * tmi(12 * (revs[q] + (finInc + loy + pv) / 12) / ad); });
    o.psir = HQ.ps * (finImp + loy + pv) + HQ.ir * (finImp * (1 - (h.noAV ? 0 : HQ.partAV)) + pv) + tmiLab * loy;
    o.ancienStock = o.tf + o.dmto + o.ifi + o.thrs;
    // ----- nouveau : revenus du capital (fonction des revenus v7.2) et impôt plancher ; v7.4 B et v7.5
    var dMob = A.HYP.plancher.dMob.central, ycapM = ((h.noLoyer ? 0 : PAR.rendementLocatif * loc) + dMob * mo) / 12;
    var div = (h.divShare !== undefined ? h.divShare : HQ.partDiv) * finInc, autresR = loy + (finInc - div) + pv, brutD = div / 0.75;
    var bs = bases(d.rpG, d.dRP, d.locG + mo, d.dA, c), cRP = chargeRP(bs.rp, c), Pv5 = Pf(bs.wf, c), Pv4 = A.Tp(Wt);
    o.rpBase = bs.rp; o.wf = bs.wf; o.chargeRP = cRP; o.P = 0; o.Pp = 0; o.paye = 0; o.differe = 0; o.ck = 0; o.levy = 0; o.v74 = 0; o.v74differe = 0;
    wqs.forEach(function (w, q) {
      if (w <= 0) return;
      var yl = revs[q], y = yl + ycapM, t = ad * (b.T(y / ad) - b.S), ck = (c.plancher === false ? 0 : A.HYP.plancher.alpha) * 12 * Math.max(0, t) * ycapM / Math.max(1e-9, y), N = y - t;
      var Pp = Math.max(0, Pv5 - ck), cap = Math.max(Math.max(0, A.xN(12 * N) * 12 * N - cRP), A.HYP.paiement.partMobilisable * Amob, c.payeProrata ? Pp * Math.min(1, Amob / Math.max(1, bs.wf)) : 0), paye = Math.min(Pp, cap);
      o.P += w * Pv5; o.Pp += w * Pp; o.paye += w * paye; o.differe += w * (Pp - paye); o.ck += w * ck;
      var P4 = Math.max(0, Pv4 - A.HYP.plancher.alpha * 12 * Math.max(0, t) * ycapM / Math.max(1e-9, y)), pay4 = A.paiement(P4, 12 * N, Amob);
      o.v74 += w * P4; o.v74differe += w * pay4.differe;
      var yc = (autresR + brutD) / 12; o.levy += w * (ad * (b.T((yl + yc) / ad) - b.T(yl / ad)) * 12 - (brutD - div));
    });
    o.nouveauStock = o.chargeRP + o.Pp;            // dû (payé + différé)
    return o;
  }

  // ======================================================================================================================================
  // 4. Agrégats : tranches de patrimoine net, recette, contrainte dure
  // ======================================================================================================================================
  var BORNES = [0, 1e4, 1e5, 2e5, 3e5, 5e5, 7.5e5, 1e6, 2e6, 5e6, 2e7, 1e8, 1e18];
  var NOMS = ['< 10 k€', '10-100 k€', '100-200 k€', '200-300 k€', '300-500 k€', '500-750 k€', '750 k€-1 M€', '1-2 M€', '2-5 M€', '5-20 M€', '20-100 M€', '> 100 M€'];
  var CLES = ['tf', 'dmto', 'ifi', 'thrs', 'dmtg', 'psir', 'chargeRP', 'P', 'Pp', 'paye', 'differe', 'levy', 'v74', 'v74differe', 'ancienStock', 'nouveauStock'];
  var _agg = {};
  function cle(c) { return [c.regime, c.X, c.tInf, c.K || HYP.K, c.tauRP !== undefined ? c.tauRP : HYP.tauRP, c.F !== undefined ? c.F : HYP.F, c.plancher === false ? 0 : 1, c.payeProrata ? 1 : 0, c.plancherPro ? 1 : 0].join('|'); }
  function agreger(c) {
    init(); var key = cle(c); if (_agg[key]) return _agg[key];
    var T = NOMS.map(function () { var a = { n: 0, net: 0 }; CLES.forEach(function (k) { a[k] = 0; }); return a; }), TOT = { n: 0, net: 0 }; CLES.forEach(function (k) { TOT[k] = 0; });
    cells.forEach(function (x) {
      var e = evalHH(x, c), j = 0; while (x.net >= BORNES[j + 1]) j++;
      var w = x.dp * NM; [T[j], TOT].forEach(function (a) { a.n += w; a.net += w * x.net; CLES.forEach(function (k) { a[k] += w * e[k]; }); });
    });
    return (_agg[key] = { tranches: T, total: TOT });
  }
  /** Calage du comportement de la fonction (H75.3) : rapport recette nette / dû statique de la chaîne de la v7.4 à t∞ donné (K = 700 k€), puis rapport différé calé / statique. */
  var _cal = {};
  function calage(tInf) {
    if (_cal[tInf]) return _cal[tInf];
    var old = A.HYP.patrimoine.tInf; A.HYP.patrimoine.tInf = tInf;
    var pop = TP.population('pierreNet'), nH = NM / pop.length, w = 0; pop.forEach(function (h) { w += r * (h.immo + h.mobile) * nH; });
    var rc = A.recettePatrimoine('central'), stat = rc.tauxEffectif * w / 1e9;
    A.HYP.patrimoine.tInf = old;
    return (_cal[tInf] = { ratio: rc.nette / stat, ratioDiffere: rc.differe / (rc.partDifferee * stat), nette: rc.nette, statique: stat, erosionTop: rc.erosionTop });
  }
  function recette(c) {
    var g = agreger(c).total, cal = calage(c.tInf), md = function (v) { return v / 1e9; };
    var rpStat = md(g.chargeRP), fStat = md(g.Pp), rpNet = rpStat * HYP.calageRP, bouc = rpNet * partBouclier(HYP.boucliersigma);
    var fNet = fStat * cal.ratio, diff = md(g.differe) * cal.ratio;          // différé calé comme le dû (même comportement)
    var tot = rpNet + fNet, delta = tot - S.g05v74;
    return { rpStatique: rpStat, rpNette: rpNet, bouclierAn1: bouc, fonctionStatique: fStat, fonctionNette: fNet, differe: diff, partDiffere: fNet > 0 ? diff / fNet : 0,
             totale: tot, totaleAn1: tot - bouc, deltaV74: delta, combleRef: delta / S.manqueRef, combleTout: delta / S.manqueTout, ratioCalage: cal.ratio,
             v74Statique: md(g.v74), dejaRemplaceThrs: true };
  }
  /** Contrainte dure : dans chaque tranche jusqu'à 1 M€ de patrimoine net, stock nouveau (dû, statique) ≤ stock ancien (TF + DMTO annualisés + IFI + TH RS). */
  function contrainte(c, borne) {
    var T = agreger(c).tranches, out = [], ok = true;
    T.forEach(function (a, j) { if (BORNES[j + 1] > (borne || 1e6) + 1) return; if (a.n <= 0) return;
      var o = a.ancienStock / a.n, nv = a.nouveauStock / a.n; out.push({ tranche: NOMS[j], ancien: o, nouveau: nv, ok: nv <= o + 0.5 }); if (nv > o + 0.5) ok = false; });
    return { ok: ok, detail: out };
  }

  // ======================================================================================================================================
  // 5. Cas types (contrainte individuelle) et cas limites de la v7.4 (charge cumulée en % du revenu)
  // ======================================================================================================================================
  // Revenus : €/mois du ménage avant la fonction ; rp, loc, mo en € (mo = parts, titres, biens professionnels taxables) ; fin = patrimoine financier (pour les revenus du capital).
  var CAS_TYPES = [
    { id: 'retraite_proprio', lib: 'Retraité seul, pension 1 200 €/mois, propriétaire de sa maison de 250 000 € (10 000 € de livrets)', h: { rp: 2.5e5, loc: 0, mo: 0, fin: 1e4, rev: [1200], Amob: 0, net: 2.6e5, finRate: 0.024 } },
    { id: 'retraite_proprio_500', lib: 'Retraité seul, pension 1 200 €/mois, maison de 500 000 € (cas v7.4), 20 000 € de livrets', h: { rp: 5e5, loc: 0, mo: 0, fin: 2e4, rev: [1200], Amob: 0, net: 5.2e5, finRate: 0.024 } },
    { id: 'retraite_grande_maison', lib: 'Couple retraité, 2 × 900 €/mois, grande maison de 1,2 M€ (cas limite v7.4)', h: { rp: 1.2e6, loc: 0, mo: 0, fin: 0, rev: [1800], Amob: 0, net: 1.2e6 } },
    { id: 'primo_accedant', lib: 'Jeune ménage primo-accédant, 2 × 2 200 €/mois, appartement de 400 000 € avec 380 000 € de crédit', h: { rp: 4e5, dRP: 3.8e5, loc: 0, mo: 0, fin: 1e4, rev: [4400], Amob: 0, net: 3e4, finRate: 0.024 } },
    { id: 'locataire_livrets', lib: 'Locataire, 2 000 €/mois, livret A et LDDS pleins (34 950 €)', h: { rp: 0, loc: 0, mo: 0, fin: 34950, rev: [2000], Amob: 0, net: 34950, finRate: 0.024 } },
    { id: 'locataire_300k', lib: 'Locataire, 3 700 €/mois, 300 000 € d\'épargne (assurance-vie et comptes-titres : 150 000 € en actions et fonds)', h: { rp: 0, loc: 0, mo: 1.5e5, fin: 3e5, rev: [3700], Amob: 1.5e5, net: 3e5 } },
    { id: 'proprio_300k', lib: 'Propriétaire, 3 700 €/mois, résidence principale de 300 000 € sans crédit', h: { rp: 3e5, loc: 0, mo: 0, fin: 0, rev: [3700], Amob: 0, net: 3e5 } },
    { id: 'locataire_1M', lib: 'Locataire, 6 500 €/mois, 1 M€ d\'épargne dont 600 000 € en actions et fonds', h: { rp: 0, loc: 0, mo: 6e5, fin: 1e6, rev: [6500], Amob: 6e5, net: 1e6 } },
    { id: 'proprio_1M', lib: 'Propriétaire, 6 500 €/mois, résidence principale de 1 M€ sans crédit', h: { rp: 1e6, loc: 0, mo: 0, fin: 0, rev: [6500], Amob: 0, net: 1e6 } },
    { id: 'petit_bailleur', lib: 'Petit bailleur, 3 000 €/mois, RP 250 000 € + studio loué 150 000 €', h: { rp: 2.5e5, loc: 1.5e5, mo: 0, fin: 0, rev: [3000], Amob: 0, net: 4e5, thrs: 0 } },
    { id: 'rs_famille', lib: 'Ménage modeste, 2 500 €/mois, RP 200 000 € + maison de famille héritée (résidence secondaire) 150 000 €', h: { rp: 2e5, loc: 1.5e5, mo: 0, fin: 0, rev: [2500], Amob: 0, net: 3.5e5, noLoyer: true, thrs: 996 } }
  ];
  function casTypes(c) {
    return CAS_TYPES.map(function (x) {
      var h = JSON.parse(JSON.stringify(x.h)); h.exactIfi = true; h.wq = [1]; if (h.finInc === undefined && h.finRate === undefined) h.finRate = HQ.rendFinNat;
      var e = evalHH(h, c);
      return { id: x.id, lib: x.lib, ancienStock: e.ancienStock, tf: e.tf, dmto: e.dmto, thrs: e.thrs, ifi: e.ifi, v74: e.v74, chargeRP: e.chargeRP, fonction: e.Pp, differe: e.differe,
               nouveauStock: e.nouveauStock, ecartStock: e.nouveauStock - e.ancienStock, psir: e.psir, levy: e.levy, ecartTotal: e.nouveauStock + e.levy - e.ancienStock - e.psir };
    });
  }
  /** Cas limites de la v7.4 (A.CAS) : charge cumulée (fonction des revenus + charge RP + fonction payée) en % du revenu reçu ; signale > 100 %. */
  function foyer75(f, c) {
    var s = A.sched(), V = root.BaremeUniqueV6, X = root.BaremeV71, brutD = (f.div || 0) / 0.75, R = f.R || [0];
    var revFn = V.menage(s, { revenus: R, capital: [brutD + (f.loyers || 0)] }, X.HYP.regle).revenu;
    var recu = R.reduce(function (a, x) { return a + x; }, 0) + (f.div || 0) + (f.loyers || 0), impot = recu - revFn, cap = (f.div || 0) + (f.loyers || 0);
    var Ck = A.HYP.plancher.alpha * 12 * Math.max(0, impot) * (recu > 0 ? cap / recu : 0);
    // option plancherPro (H75.8) : pour les biens professionnels exploités par le foyer (terres, vignes, forêt, société où il travaille), la part de la contribution sur le revenu
    // d'activité attribuable au capital (4 % de la valeur de rendement, plafonnée au revenu d'activité) est aussi imputée
    var Rs = R.reduce(function (a, x) { return a + x; }, 0), proV = (f.terres || 0) + (f.nonCotePro || 0) + (f.foret || 0);
    if (c.plancherPro && Rs > 0 && proV > 0) Ck += 12 * Math.max(0, impot) * (Rs / recu) * Math.min(1, 0.04 * proV / (12 * Rs));
    var autres = (f.locatif || 0) + (f.cotes || 0) + (f.nonCotePassif || 0) + (f.nonCotePro || 0) + (f.terres || 0) + (f.foret || 0) + (f.art || 0) + (f.etranger || 0) + (f.chateau || 0);
    var rpG = f.nonResident ? 0 : (f.rp || 0), dRP = Math.min(f.dettes || 0, rpG), dA = (f.dettes || 0) - dRP;
    var bs = bases(rpG, dRP, autres, dA, c), cRP = chargeRP(bs.rp, c), P = Pf(bs.wf, c), Pp = Math.max(0, P - Ck - (f.impotEtranger || 0));
    var Am = (f.cotes || 0) + (f.nonCotePassif || 0) + (f.chateau || 0), N = 12 * revFn;
    var capP = f.nonResident ? Infinity : Math.max(Math.max(0, A.xN(N) * N - cRP), A.HYP.paiement.partMobilisable * Am, c.payeProrata ? Pp * Math.min(1, Am / Math.max(1, bs.wf)) : 0), paye = Math.min(Pp, capP);
    var charge = 12 * impot + cRP + paye;
    return { wf: bs.wf, rpBase: bs.rp, chargeRP: cRP, P: P, Ck: Ck, Pprime: Pp, paye: paye, differe: Pp - paye, impotRevenus: 12 * impot, revenuRecu: 12 * recu,
             charge: charge, chargePct: recu > 0 ? charge / (12 * recu) : null, chargeDuePct: recu > 0 ? (12 * impot + cRP + Pp) / (12 * recu) : null };
  }
  var CAS_SUPPL = [
    { id: 'chateau_holding', lib: 'Château de 3 M€ détenu par une holding patrimoniale, exploitation déficitaire, aucun revenu versé, salaire 3 000 €/mois (RP ailleurs, 400 000 €)', R: [3000], rp: 4e5, chateau: 3e6, avant: { tf: 1080 + 8100, ifi: 0 } },
    { id: 'startup_valorisee', lib: 'Fondateur : parts valorisées 30 M€ au dernier tour, prélèvement en avance payé en titres (valeur du tour), salaire 4 000 €/mois', R: [4000], nonCotePassif: 3e7, avant: { ifi: 0 } }
  ];
  function casLimites(c) {
    return A.CAS.concat(CAS_SUPPL).map(function (x) { var f = foyer75(x, c), v4 = A.foyer(x); return { id: x.id, lib: x.lib, v75: f, v74paye: v4.paye, v74charge: v4.chargeTotalePct, aujourdhui: (x.avant.tf || 0) + (x.avant.ifi || 0), alerte: f.chargePct !== null && f.chargePct > 1 }; });
  }

  // ======================================================================================================================================
  // 6. Grille des variantes, effets de bord (calculs simples), forêt
  // ======================================================================================================================================
  function grille() {
    var out = [];
    ['RP', 'AB'].forEach(function (rg) { HYP.plafonds.forEach(function (X) { HYP.tInfs.forEach(function (t) {
      var c = { regime: rg, X: X, tInf: t }, rc = recette(c), ct = contrainte(c);
      out.push({ regime: rg, X: X, tInf: t, recette: rc, contrainteOk: ct.ok });
    }); }); });
    return out;
  }
  /**
   * Effet sur les loyers (€/mois) d'une hausse de la charge annuelle sur un logement loué : Δcharge = (fonction marginale − taxe foncière actuelle − DMTO annualisés) × valeur,
   * répercutée pour une part ρ (fourchette de la littérature). valeur = loyer mensuel × 12 / rendement brut.
   */
  function effetLoyer(loyerMensuel, rendementBrut, tauxCharge, rho, tfActuel, dmtoAn) {
    var V = loyerMensuel * 12 / rendementBrut, d = (tauxCharge - (tfActuel === undefined ? HYP.tauRPsource : tfActuel) - (dmtoAn || 0)) * V;
    return { valeur: V, deltaAn: d, deltaMois: rho * d / 12, pctLoyer: rho * d / (loyerMensuel * 12) };
  }
  /** Capitalisation dans les prix d'un avantage fiscal annuel a (en % de la valeur) : Δprix ≈ −κ × a / (rendement + τ) (même forme que taxe_patrimoine.effetPrix). */
  function capitalisation(a, kappa, rendement, tau) { return kappa * a / (rendement + tau); }
  /** Forêt : dû annuel à la valeur de rendement (revenu net moyen / 4 %) et à la valeur vénale, pour un patrimoine par ailleurs donné. */
  function foret(revenuNetAn, venale, autre, c) {
    var vr = Math.min(venale, revenuNetAn / 0.04), base = function (v) { return Math.max(0, autre + v); };
    return { valeurRendement: vr, duRendement: Pf(base(vr), c) - Pf(base(0), c), duVenale: Pf(base(venale), c) - Pf(base(0), c), partRevenuRendement: (Pf(base(vr), c) - Pf(base(0), c)) / Math.max(1, revenuNetAn) };
  }

  var API = { HYP: HYP, S: S, BORNES: BORNES, NOMS: NOMS, Pf: Pf, tauxMoyenF: tauxMoyenF, marginalF: marginalF, bases: bases, chargeRP: chargeRP, partBouclier: partBouclier,
              init: init, calages: function () { init(); return E; }, evalHH: evalHH, agreger: agreger, calage: calage, recette: recette, contrainte: contrainte,
              CAS_TYPES: CAS_TYPES, casTypes: casTypes, foyer75: foyer75, CAS_SUPPL: CAS_SUPPL, casLimites: casLimites, grille: grille, effetLoyer: effetLoyer,
              capitalisation: capitalisation, foret: foret, HQ: HQ };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0611V75 = API;
})(this);
