/*
 * modeles/systeme-ideal/grandes_fortunes_0511.js — options sur les grandes fortunes, l'héritage, les holdings et les montages de transmission (05/11/2026).
 * OPTIONS À ARBITRER PAR PIERRE : rien n'est modifié dans la v5.4 ni dans le bilan global ; ce module lit la v5.4 (decisions_0511c.js) et calcule des écarts.
 * Fonctions pures, Md€/an en croisière. Ordre des scénarios : [bas = favorable, central, haut = défavorable], comme la v5.4 (solde bas > central > haut).
 * Exil « défendable » de la v5.4 (H571-H572) appliqué partout (Optimum.avecExil). Hypothèses HG01 à HG40 : sources/chiffrage-grandes-fortunes-holdings.md.
 * Des hypothèses et des ordres de grandeur, jamais des prédictions.
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511.js jusqu'à decisions_0511.js, puis decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var C = root.Decisions0511c || (req ? req('./decisions_0511c.js') : null);
  var TP = root.TaxePatrimoine || (req ? req('./taxe_patrimoine.js') : null);
  var PF = root.PatrimoineFinancier || (req ? req('./patrimoine_financier.js') : null);
  var DR = root.DecesRealisation || (req ? req('./deces_realisation.js') : null);
  var M = root.SystemeIdeal || (req ? req('./modele.js') : null);
  var OF = root.OptionsFinancement || (req ? req('./options_financement.js') : null);
  var O = root.Optimisation || (req ? req('./optimisation.js') : null);
  var V = root.Voies || (req ? req('./voies.js') : null);
  var SCS = ['bas', 'central', 'haut'];
  var XS = OF.SC_PATRIMOINE;                      // scénario du palier 1 -> scénario des modules patrimoine (croisé, H420)
  function i(sc) { return SCS.indexOf(sc); }
  function exil(fn) { return Z.avecExil('defendable', fn); }

  // ---------------------------------------------------------------------------------------------------------------------------------------------
  // Hypothèses (valeurs [favorable, central, défavorable] quand elles dépendent du scénario)
  // ---------------------------------------------------------------------------------------------------------------------------------------------
  var HYP = {
    // HG01-HG02 : ménages et adultes (ordre de grandeur, ⚠️ Insee à relire)
    menages: 30.9e6, adultesParMenage: 1.7,
    // HG03 : sommet de la distribution. Foyers au-dessus de 100 M€ : 1 800 (Zucman ; rapport AN sur la PPL n° 768) ; patrimoine total : classement Challenges 2025
    // (500 fortunes = 1 128 Md€, seuil d'entrée 245 M€) + 1 300 foyers entre 100 et 245 M€ à 150 M€ en moyenne (⚠️ hypothèse) = 1 323 Md€.
    foyers100: 1800, patrimoine100: 1128 + 1300 * 0.150,
    // HG04 : foyers entre 10 et 100 M€ (⚠️ interpolation entre le P99 de l'enquête Insee et les 1 800 foyers ; à confronter aux données ISF-IFI, V13457) : effectif et patrimoine moyen
    foyers10a100: 22000 - 1800, moyenne10a100: 28e6,
    // HG05 : part du sommet effectivement taxable en France (résidents, foyer fiscal et non famille, net de dettes) : Challenges mesure des familles, non-résidents inclus, patrimoine brut.
    // 1,00 = lecture de Zucman (favorable) ; 0,80 central ; 0,60 défavorable.
    partTaxable: [1.00, 0.80, 0.60],
    // HG06 : part du patrimoine total qui entre dans l'assiette de la taxe de 1 % (immobilier et parts de sociétés ; hors œuvres d'art, liquidités, assurance-vie, trusts)
    partAssiette1pc: 0.85,
    // HG07 : revenu fiscal imposable au prélèvement unique, en % du patrimoine, pour le sommet : IPP note n° 92 (revenu fiscal = 4 % du revenu économique des 75 foyers) + imputation des holdings (N04)
    // [favorable = 0,7 % : droit actuel ; central = 1,5 % ; défavorable = 2,5 %] ⚠️
    rendementImposable: [0.007, 0.015, 0.025], tPlat: 0.42,
    // HG08 : érosion de l'assiette (évasion, exil, sous-déclaration) à 1 point d'impôt sur la fortune : H572 (v5.4) = [20, 35, 55] % ; loi exponentielle e(τ) = 1 − (1 − e1)^τ (τ en points)
    erosion1pt: [0.20, 0.35, 0.55],
    // HG09 : part de l'érosion due aux départs (Scandinavie, CAE Focus 118 : 20 c sur 74 c) et autres impôts perdus par euro de patrimoine parti (H512-H513 : 2,2 %/an)
    partExil: 20 / 74,
    // HG10 : fuite des transmissions défendable (H571) et exil des flux (H571 : e)
    fuite: [0.18, 0.33, 0.52], exilFlux: [0.015, 0.04, 0.12],
    // HG11 : taux effectif conservé au sommet des transmissions (fonction continue : part conservée ≈ 95 % pour les grands héritages) et taux de la v5.4
    tHeritage: 0.50, partVieSommet: 0.95
  };
  HYP.externalite = TP.COMMUN.externalite;
  HYP.pointDeTauxPlat = null;   // calculé à la demande (≈ 10,8 Md€)

  /** Valeur d'un point de taux plat (Md€/an, central) : écart de solde entre 43 % et 42 % de la v5.4. */
  function pointDeTaux() {
    if (HYP.pointDeTauxPlat === null) HYP.pointDeTauxPlat = Math.abs(C.solde(C.archiV54(0.43), 'central', false) - C.solde(C.archiV54(0.42), 'central', false));
    return HYP.pointDeTauxPlat;
  }
  function v54(sc) { return Z.detail(C.archiV54(), sc); }

  // ---------------------------------------------------------------------------------------------------------------------------------------------
  // 1. Holdings : ce que rapporte la fin des écrans
  // ---------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * Ce que la v5.4 fait déjà des holdings, et ce qu'elle ne fait pas. Md€/an.
   *  - transparence : flux de bénéfices retenus des holdings patrimoniales imputé aux associés (H19) ; imputation brute = flux × taux plat ; crédit d'IS = flux × 25 % (N04) ;
   *    valeurTotale = recettes du modèle avec transparence − sans transparence (inclut la neutralisation de la réaction du capital, H21 : hypothèse, pas une recette directe) ;
   *  - report150 : fin du report 150-0 B ter pour le flux futur (N05, +3,7 central) ;
   *  - non comptés : stock imposé une fois, fin de la purge au décès (c), taxe de 2 % sur les actifs passifs (b1), plancher en revenu économique (b2), régime mère-fille.
   */
  function holdings(sc) {
    var s = XS[sc], t = HYP.tPlat, a = Z.archi(C.archiV54()), o = OF.opt(Z.versOF(a)), st = OF.stOption(o), cfg = O.configR(st), F = V.fus;
    return exil(function () {
      var P1 = F(cfg, { scenario: sc }), m1 = M.solde(P1), m0 = M.solde(F(cfg, { scenario: sc, holdings: false }));
      var sM = M.SCENARIOS[sc];
      var fluxImpute = 1507.4 * sM.holdPart * 0.03 * 0.8;   // H19 : stock 1 507,4 Md€ × part des holdings patrimoniales × 3 % retenus × 80 % au-dessus du seuil (modele.js imputationHoldings)
      var credit = m1.postes.creditHoldings;
      var imputationBrute = fluxImpute * t;
      var r150 = PF.report150Flux(s, { t: t }), op = PF.report150Options(s, { t: t });
      var D = 1507.4 * sM.holdPart * 0.03;                   // dividendes reçus par les holdings patrimoniales (⚠️ rendement de distribution = rendement retenu, 3 %, HG20)
      var mereFilleStatique = (0.25 - 0.0125) * D;           // IS plein de 25 % au lieu de la quote-part de 5 % (1,25 %)
      return {
        scenario: sc, fluxImpute: fluxImpute, imputationBrute: imputationBrute, creditN04: credit, imputationNette: imputationBrute - credit,
        valeurTotaleTransparence: m1.recettes.total - m0.recettes.total, netDuCredit: m1.recettes.total - m0.recettes.total - credit,
        protectionDeLaBase: (m1.recettes.total - m0.recettes.total) - imputationBrute,
        report150Flux: r150.recettesNouvelles, report150Brut: r150.recettesBrutes,
        compte: (m1.recettes.total - m0.recettes.total) - credit + r150.recettesNouvelles,
        stockUneFois: op.aStock.total, finPurge150: op.c.annuel, taxeActifsPassifs: op.b1.recettesNettes, plancherRevenu: op.b2.net, plancherStatique: op.b2.statique,
        mereFilleStatique: mereFilleStatique, dividendesRecus: D,
        mereFilleNetteDeLaTransparence: 0,                   // sous transparence, l'IS payé par la holding est imputé en crédit : le gain net est nul (double imposition, directive mère-fille)
        nonCompteAnnuel: op.c.annuel + op.b1.recettesNettes  // fin de purge (c) + taxe sur les actifs passifs (b1) ; (b2) est une voie fermée, le stock est une fois
      };
    });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------------
  // 2. Étage supérieur sur les grandes fortunes
  // ---------------------------------------------------------------------------------------------------------------------------------------------
  /** Érosion de l'assiette à τ points d'impôt sur la fortune (loi exponentielle calée sur e1 à 1 point), plafonnée à 90 %. */
  function erosion(sc, tauPts) { var e1 = HYP.erosion1pt[i(sc)]; return Math.min(0.9, 1 - Math.pow(1 - e1, Math.max(0, tauPts))); }

  /** Tranche T1 (P99 de l'enquête à 10 M€) : effectif et patrimoine moyen par intégration d'une queue de Pareto (α de l'enquête Insee, taxe_patrimoine.js) tronquée. */
  function tranche1() {
    var a = TP.HVP.alphaPareto, lo = TP.HVP.p99, hi = 10e6, n = 0.01 * HYP.menages - (HYP.foyers10a100 + HYP.foyers100), s = 0, k, N = 400, x0, x1, w;
    // part de l'effectif entre lo et hi suivant (lo/x)^α ; moyenne = ∫ x dF / ∫ dF
    var num = 0, den = 0;
    for (k = 0; k < N; k++) { x0 = lo * Math.pow(hi / lo, k / N); x1 = lo * Math.pow(hi / lo, (k + 1) / N); w = Math.pow(lo / x0, a) - Math.pow(lo / x1, a); num += w * Math.sqrt(x0 * x1); den += w; }
    return { n: n, moyenne: num / den };
  }
  /** Tranches du sommet pour le scénario sc : { n, W (patrimoine total moyen, €) } pour T1 (3 à 10 M€), T2 (10 à 100 M€), T3 (> 100 M€). Le facteur partTaxable porte sur T2 et T3. */
  function tranches(sc) {
    var f = HYP.partTaxable[i(sc)], t1 = tranche1();
    return {
      T1: { n: t1.n, W: t1.moyenne, libelle: '3 à 10 M€' },
      T2: { n: HYP.foyers10a100 * f, W: HYP.moyenne10a100, libelle: '10 à 100 M€' },
      T3: { n: HYP.foyers100 * f, W: HYP.patrimoine100 * 1e9 / HYP.foyers100, libelle: 'plus de 100 M€' }
    };
  }

  /**
   * (a) « Zucman fidèle » : impôt plancher de 2 % du patrimoine total des foyers de plus de 100 M€, net des impôts déjà payés (taxe de 1 % sur l'assiette et prélèvement unique).
   * Complément = max(0, 2 % − 1 % × partAssiette − t × rendement) × patrimoine. Érosion : l'impôt sur la fortune effectif passe de 0,85 point à 0,85 + complément (le prélèvement unique est hors érosion,
   * comme dans le module de la taxe de 1 %). Retour : brut (statique, sans érosion), net (avec érosion et exil), foyers concernés.
   * o : { plancher (0,02), seuil (100 M€ : fixe, tranche T3), sansComportement }.
   */
  function varianteA(sc, o) {
    o = o || {}; var k = i(sc), T = tranches(sc).T3, W = T.W, p = HYP.partAssiette1pc, plancher = o.plancher === undefined ? 0.02 : o.plancher;
    var y = HYP.rendementImposable[k], I = HYP.tPlat * y, tau1 = 0.01 * p;
    var topUp = Math.max(0, plancher - tau1 - I);                              // complément du plancher, en part du patrimoine
    var brut = T.n * W * topUp / 1e9;
    var eBase = erosion(sc, tau1 * 100), eVar = erosion(sc, (tau1 + topUp) * 100);
    // recette totale du sommet après la variante moins recette totale avant (taxe de 1 % + prélèvement unique, sur assiette érodée)
    var avant = T.n * W * (1 - eBase) * (tau1 + I) / 1e9;
    var apres = T.n * W * (1 - eVar) * Math.max(plancher, tau1 + I) / 1e9;
    var ext = T.n * W * HYP.partExil * (eVar - eBase) * HYP.externalite / 1e9;
    var net = o.sansComportement ? brut : apres - avant - ext;
    return { scenario: sc, foyers: T.n, patrimoineMoyen: W, patrimoineTotal: T.n * W / 1e9, complement: topUp, binding: topUp > 0, brut: brut, net: net, erosion: eVar, erosionBase: eBase,
             externalite: ext, paysDejaTotal: (tau1 + I), recetteNetteParPoint: net / pointDeTaux() };
  }

  /** Impôt du barème progressif (b) sur un patrimoine taxable W (€) : 0 sous S, τ1 de S à 10 M€, 2 % de 10 à 100 M€, 3 % au-delà. S est le seuil du ménage (€). */
  function impotBareme(W, S, o) {
    o = o || {}; var t1 = o.tauxMilieu === undefined ? 0.01 : o.tauxMilieu, t2 = o.taux2 === undefined ? 0.02 : o.taux2, t3 = o.taux3 === undefined ? 0.03 : o.taux3;
    return t1 * Math.max(0, Math.min(W, 10e6) - S) + t2 * Math.max(0, Math.min(W, 100e6) - 10e6) + t3 * Math.max(0, W - 100e6);
  }
  var _kPop = null;
  /** Facteur qui ramène la population de l'enquête (patrimoine brut non recalé) au niveau des comptes nationaux de l'assiette de la taxe de 1 %. */
  function kPop() {
    if (_kPop !== null) return _kPop;
    var P = TP.population('pierre'), s = 0, n = 0, j;
    for (j = 0; j < P.length; j++) { s += P[j].immo + P[j].mobile; n++; }
    _kPop = TP.composantes('pierre').total * 1e9 / (s / n * HYP.menages);
    return _kPop;
  }

  /**
   * (b) barème progressif et (c) à recette égale. o : { seuilAdulte (300 000 €), tauxMilieu (1 %), taux2 (2 %), taux3 (3 %), sansComportement, brut (dettes non déduites sous le P99) }.
   * Écart de recette par rapport à la taxe de 1 % de la v5.4 (N07), calculé sur le même appareil (population de l'enquête jusqu'au P99, trois tranches au-delà) :
   * delta = recette(barème) − recette(1 % à plat, sans seuil, sur l'assiette brute), à érosion comparable ; la recette de la variante = N07 net + delta.
   */
  function varianteB(sc, o) {
    o = o || {}; var k = i(sc), s = XS[sc], p = TP.PARAM[s];
    var S = (o.seuilAdulte === undefined ? 300000 : o.seuilAdulte) * HYP.adultesParMenage;
    var PB = TP.population('pierre'), PN = TP.population('pierreNet'), n = PB.length, kp = kPop();
    var ratioNet = (function () { var d = v54(sc).taxeDetail; return d.nette / d.brute; })();
    // --- sous le P99 : base de l'enquête (brut pour la taxe de 1 %, net de dettes pour le barème)
    var dBrut = 0, dNet = 0, payeurs = 0, exoneres = 0, j, wb, wn, tx, parT = [];
    var acc = TP.HVP.tranches.map(function (t, q) { return { n: 0, avant: 0, apres: 0, W: 0 }; });
    for (j = 0; j < n; j++) {
      if (PB[j].p >= 0.99) continue;
      wb = PB[j].immo + PB[j].mobile; wn = o.brut ? wb : PN[j].immo + PN[j].mobile;   // o.brut : assiette brute des dettes, pour isoler l'effet du seuil
      tx = impotBareme(wn, S, o);
      dBrut += 0.01 * wb; dNet += tx; if (tx > 0) payeurs++; else exoneres++;
      acc[PB[j].k].n++; acc[PB[j].k].avant += 0.01 * wb; acc[PB[j].k].apres += tx; acc[PB[j].k].W += PB[j].W;
    }
    var echelle = HYP.menages / n * kp / 1e9;
    var fT0 = p.valImmo * (1 - p.erosionReste * 0.5);       // valorisation administrative et érosion de la base ordinaire (la moitié de l'érosion du reste, H509)
    var deltaT0 = (dNet - dBrut) * echelle * fT0 * ratioNet;
    // --- au-dessus : trois tranches
    var TR = tranches(sc), pa = HYP.partAssiette1pc, delta = deltaT0, brutVar = dNet * echelle * fT0, brutAvant = dBrut * echelle * fT0, ext = 0, foyers = { T1: 0, T2: 0, T3: 0 }, det = { T0: deltaT0 }, bT = {};
    ['T1', 'T2', 'T3'].forEach(function (nom) {
      var T = TR[nom], W1 = T.W * pa, txVar = impotBareme(W1, S, o), txAvant = 0.01 * W1;
      var eA = erosion(sc, 1), eV = erosion(sc, txVar / W1 * 100);
      var statique = T.n * (txVar - txAvant) / 1e9;
      var net = o.sansComportement ? statique : (T.n * (txVar * (1 - eV) - txAvant * (1 - eA)) / 1e9 - T.n * W1 * HYP.partExil * (eV - eA) * HYP.externalite / 1e9);
      delta += net; det[nom] = net; brutVar += T.n * txVar / 1e9; brutAvant += T.n * txAvant / 1e9; foyers[nom] = txVar > 0 ? T.n : 0;
      bT[nom] = { n: T.n, W: T.W, impotMoyen: txVar, tauxEffectifSurPatrimoine: txVar / W1 * (pa), erosion: eV, statique: statique, net: net };
    });
    var d = v54(sc).taxeDetail, n07 = d.nette;
    var res = { scenario: sc, seuilMenage: S, delta: delta, deltaParTranche: det, recetteVariante: n07 + delta, n07: n07, n07Brute: d.brute,
                brutVariante: brutVar, brutAvantModele: brutAvant, foyersImposes: payeurs / n * HYP.menages + foyers.T1 + foyers.T2 + foyers.T3, menagesExoneres: 1 - (payeurs / n * HYP.menages + foyers.T1 + foyers.T2 + foyers.T3) / HYP.menages,
                foyersT1: foyers.T1, foyersT2: foyers.T2, foyersT3: foyers.T3, tranches: bT, pointsLiberables: delta / pointDeTaux(), parTrancheEnquete: acc.map(function (a, q) { return { n: a.n * HYP.menages / n, impotAvant: a.n ? a.avant / a.n : 0, impotApres: a.n ? a.apres / a.n : 0, W: a.n ? a.W / a.n : 0 }; }) };
    return res;
  }

  /** (c) : taux du milieu qui ramène la recette du barème à celle de la taxe de 1 % actuelle (delta = 0), à seuil et taux 2 / 3 % donnés ; dichotomie. */
  function tauxMilieuRecetteEgale(sc, o) {
    o = o || {}; var lo = 0.002, hi = 0.10, m, k;
    function f(x) { var q = {}; for (var key in o) q[key] = o[key]; q.tauxMilieu = x; return varianteB(sc, q).delta; }
    if (f(hi) < 0) return null;
    if (f(lo) > 0) return lo;
    for (k = 0; k < 40; k++) { m = (lo + hi) / 2; if (f(m) >= 0) hi = m; else lo = m; }
    return hi;
  }

  /** Sensibilité de (a) au multiple de l'érosion (0,5 ; 1 ; 2) : la conclusion dépend de l'élasticité plus que de la base. */
  function sensibiliteA(sc, mult) {
    var save = HYP.erosion1pt.slice(), k = i(sc), r;
    HYP.erosion1pt[k] = Math.min(0.95, save[k] * mult);
    try { r = varianteA(sc).net; } finally { HYP.erosion1pt[k] = save[k]; }
    return r;
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------------
  // 3. Héritage : relèvement du haut du barème des transmissions
  // ---------------------------------------------------------------------------------------------------------------------------------------------
  var HER = { moyenneTop01: 13e6, moyenneP90_95: 0.55e6, cohorte: 700e3, flux: 300 };   // CAE note n° 69 (graphique 2 : P99,9-100 ≈ 13 000 k€, P90-95 ≈ 550 k€) ; cohorte ≈ naissances annuelles (⚠️ HG30)
  var _pareto = null;
  /** Queue de Pareto de l'héritage reçu à vie par héritier, calée sur les deux moyennes du CAE : α par dichotomie, x_m tel que la moyenne du dernier millième soit 13 M€. */
  function paretoHeritage() {
    if (_pareto) return _pareto;
    function moyenneBande(a, alpha, b) { var e = 1 - 1 / alpha; return alpha / (alpha - 1) * (Math.pow(1 - a, e) - Math.pow(1 - b, e)) / (b - a); }
    function ratio(alpha) { return moyenneBande(0.999, alpha, 1) / moyenneBande(0.90, alpha, 0.95); }
    var lo = 1.05, hi = 6, m, k, cible = HER.moyenneTop01 / HER.moyenneP90_95;
    for (k = 0; k < 60; k++) { m = (lo + hi) / 2; if (ratio(m) > cible) lo = m; else hi = m; }   // le ratio décroît quand α augmente
    var alpha = (lo + hi) / 2, xm = HER.moyenneTop01 * (alpha - 1) / alpha * Math.pow(0.001, 1 / alpha);
    _pareto = { alpha: alpha, xm: xm, partTop01: 0.001 * HER.cohorte * HER.moyenneTop01 / (HER.flux * 1e9) };
    return _pareto;
  }
  /** Héritiers (par an) au-dessus de x € reçus à vie, et excédent total au-dessus de x (Md€/an). */
  function heritiersAuDessus(x) { var P = paretoHeritage(); return HER.cohorte * Math.pow(P.xm / x, P.alpha); }
  function excedentAuDessus(x) { var P = paretoHeritage(); return heritiersAuDessus(x) * x / (P.alpha - 1) / 1e9; }
  /**
   * Relèvement du taux marginal à `taux` (0,60) au-delà de `seuil` (héritage reçu à vie par héritier, €), sur la v5.4 (50 % partout au-dessus de la zone continue).
   * Net = taux × exc × (1 − f') − 0,50 × exc × (1 − f), avec f' = min(0,9 ; f × min(1,5 ; taux/0,5) × mobilité du sommet) et conjoint exonéré.
   */
  function heritage(sc, o) {
    o = o || {}; var k = i(sc), seuil = o.seuil === undefined ? 5e6 : o.seuil, taux = o.taux === undefined ? 0.60 : o.taux;
    var cj = DR.PARAM[XS[sc]].cj, exc = excedentAuDessus(seuil) * (1 - cj) * HYP.partVieSommet;
    var f = HYP.fuite[k], mob = [1.0, 1.25, 1.5][k], f2 = Math.min(0.9, f * Math.min(1.5, taux / 0.5) * mob);
    var statique = (taux - HYP.tHeritage) * exc;
    var net = taux * exc * (1 - f2) - HYP.tHeritage * exc * (1 - f);
    var nHeritiers = heritiersAuDessus(seuil);
    return { scenario: sc, seuil: seuil, taux: taux, excedent: exc, heritiers: nHeritiers, statique: statique, net: net, fuiteAvant: f, fuiteApres: f2,
             departsAttendus: nHeritiers * HYP.exilFlux[k], pointsLiberables: net / pointDeTaux() };
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------------
  // 4. Montages de transmission
  // ---------------------------------------------------------------------------------------------------------------------------------------------
  /** Taux marginal v5.4 au sommet des transmissions (50 % × part conservée) et fuite par scénario. */
  function tV54() { return HYP.tHeritage * HYP.partVieSommet; }
  /** gain = coût actuel × (taux v5.4 / taux marginal du droit actuel) × (1 − fuite) : un euro de base exonérée rapporte plus à 47,5 % qu'au taux du droit actuel. */
  function gainDepuisCout(cout, tActuel, sc) { return cout * (tV54() / tActuel) * (1 - HYP.fuite[i(sc)]); }

  var MONTAGES_COUT = {   // coût actuel par scénario [favorable, central, défavorable] (Md€/an, sans réponse de comportement), source, taux marginal du droit actuel sur la base exonérée
    demembrement: { cout: [2.8 * 2.5, 2.8 * 2.0, 2.8 * 1.5], t: 0.23, source: 'CAE n° 69 (2021) : 2,8 Md€ (nue-propriété donnée 18 Md€ en 2006, dernière année DGFiP) ; actualisation ×1,5 à ×2,5 des transmissions depuis 2006 ⚠️' },
    dutreil: { cout: [5.5, 4.0, 3.3], t: 0.40, source: 'Voies et moyens t. II PLF 2026, dépense fiscale 520110 : 5,0 Md€ (2024), 4,0 Md€ (2025 et 2026) ; Cour des comptes, nov. 2025 (via rapport AN n° 3056, p. 165) : 3,3 Md€ (2023), 5,5 Md€ (2024) ; CAE n° 69 : 2 à 3 Md€ (2018-2019)' },
    assuranceVie: { cout: [5.0, 4.5, 4.0], t: 0.40, source: 'CAE n° 69 (FICOVIE 2017-2018) : 4 à 5 Md€ à barème de droit commun pour les bénéficiaires de plus de 152 500 € ; 990 I rapporte 0,458 Md€ (Insee 2024)' },
    rappel15: { cout: [4.0, 3.0, 1.5], t: 0.30, source: 'CAE n° 69 : assiette 2 (tout le reçu à vie) 19 Md€ moins assiette 1 (réformes de niches) 9 Md€ = 10 Md€ ; part attribuable au non-rappel au-delà de 15 ans et aux abattements renouvelés : 40 / 30 / 15 % ⚠️ (non isolée par le CAE)' }
  };
  /** Trusts et sociétés civiles patrimoniales : coût non publié ; estimation = valeurs immobilières et titres transmis (H348 : 55 + 25 Md€) × part en société civile × décote × taux (⚠️ HG36). */
  function coutSci(sc) { var k = i(sc), s = [0.30, 0.20, 0.10][k], d = [0.25, 0.15, 0.10][k]; return (55 + 25) * s * d * 0.30; }

  function ligneMontage(id, nom, statut, cout, source, gainNet, compteDans, aAjouter, risque, steelman, note) {
    return { id: id, nom: nom, statut: statut, coutActuel: cout, source: source, gainNet: gainNet, compteDans: compteDans, aAjouter: aAjouter, risque: risque, steelman: steelman, note: note || '' };
  }
  /** Les sept dispositifs, au scénario sc. gainNet = gain de la suppression, net des comportements (v5.4) ; aAjouter = ce qui s'ajouterait au bilan global (0 si déjà compté). */
  function montages(sc) {
    var k = i(sc), s = XS[sc], h = holdings(sc), d = DR.realisationDeces(s, { t: HYP.tPlat, deductible: false }), out = [];
    function g(nom) { return gainDepuisCout(MONTAGES_COUT[nom].cout[k], MONTAGES_COUT[nom].t, sc); }
    out.push(ligneMontage('a', 'Démembrement de propriété (donation de la nue-propriété, art. 669 CGI ; extinction de l\'usufruit sans droits, art. 1133 CGI)', 'supprimé et compté (implicite)', MONTAGES_COUT.demembrement.cout[k], MONTAGES_COUT.demembrement.source, g('demembrement'),
      'N06 : le flux de 300 Md€ est à pleine valeur ; la nue-propriété n\'est pas modélisée (H373)', 0,
      'Constitutionnel : faible (le barème de 669 est une présomption légale, pas un principe) ; taxer l\'usufruit à la réunion rétablit l\'égalité (CAE). UE : aucun.',
      'Le démembrement organise une vraie transmission progressive et protège le conjoint et le donateur âgé, qui garde ses revenus.'));
    out.push(ligneMontage('b', 'Pacte Dutreil (exonération de 75 %, art. 787 B et 787 C CGI), holdings animatrices comprises', 'supprimé et compté (implicite)', MONTAGES_COUT.dutreil.cout[k], MONTAGES_COUT.dutreil.source, g('dutreil'),
      'N06 : aucune exonération dans le flux de 300 Md€ ; la fonction continue protège la petite entreprise (premiers euros)', 0,
      'UE : l\'aide d\'État n\'est pas en cause ; la recommandation de la Commission (1994) invite à faciliter la transmission d\'entreprises sans l\'imposer. Constitutionnel : faible ; le Conseil contrôle les exonérations par l\'égalité et l\'intérêt général.',
      'Sans le pacte, l\'héritier d\'une PME non cotée vend ou ouvre le capital : le risque de rachat par un fonds ou un groupe étranger est réel (Allemagne : Verschonungsabschlag de 85 à 100 % jugé en partie inconstitutionnel en 2014).'));
    out.push(ligneMontage('c', 'Assurance-vie : abattement de 152 500 € par bénéficiaire (art. 990 I) et primes versées après 70 ans (art. 757 B)', 'supprimé et compté (implicite)', MONTAGES_COUT.assuranceVie.cout[k], MONTAGES_COUT.assuranceVie.source, g('assuranceVie'),
      'N06 : assurance-vie dans le flux (43,3 Md€, H347) ; plus-values : N05 (fin de la purge, 1,85 Md€)', 0,
      'Constitutionnel : faible ; le relèvement de 2012 n\'a pas été censuré (CAE). UE : sans objet. Risque de rétroactivité sur des contrats anciens : droits acquis à examiner (art. 16 de 1789).',
      'L\'assurance-vie finance la dette publique et les entreprises ; le régime sert aussi les petits épargnants (capital décès modeste) : la fonction continue les protège sans seuil.'));
    out.push(ligneMontage('d', 'Purge des plus-values au décès et par donation avant cession (art. 150-0 A, 150-0 D)', 'supprimé mais non compté en recette (le crédit contre les droits absorbe tout)', d.brutes, 'modèle : deces_realisation.js (H347-H357) ; CAE n° 69 : « pas de chiffrage pour la France » ; États-Unis : 0,05 % du PIB (Tax Foundation) ; DLF : imposition des plus-values latentes « impossible en l\'état de la jurisprudence »', 0,
      'N06 et N09 : décès = réalisation avec crédit contre les droits ; recette comptée = 0 (decesPlafonne = 0)', 0,
      'Constitutionnel : élevé pour des plus-values latentes (capacité contributive, art. 13) : le crédit contre les droits est la forme la plus sûre ; carryover (report du prix d\'acquisition) plus sûr encore. UE : exit tax (art. 167 bis) et arrêts de Lasteyrie du Saillant (2004), N (2006).',
      'Taxer un gain jamais réalisé, à la mort, force des ventes en urgence et peut taxer deux fois (droits puis plus-value) : le crédit existe pour cela.',
      'recette de l\'option « cumul sans crédit » : ' + d.brutes.toFixed(1) + ' Md€ brut au scénario'));
    out.push(ligneMontage('e', 'Apport-cession 150-0 B ter (report d\'imposition et purge au décès)', 'supprimé pour le flux futur et compté (N05) ; stock et fin de purge non comptés', 4.0, 'CPO 2024 : « économie d\'impôt supérieure à 4 Md€/an » ; stock 173 Md€ (DGFiP via rapport AN n° 3056) ; partie 1 de ce dossier', h.report150Flux,
      'N05 : fin du report pour le flux futur (' + h.report150Flux.toFixed(1) + ' Md€)', 0,
      'Voir la partie 1 : ne pas compter une seconde fois. Constitutionnel : imposer le stock = rétroactivité (2019-775 QPC valide le transfert au donataire). UE : liberté d\'établissement (de Lasteyrie, N).',
      'L\'apport-cession finance le réinvestissement des entrepreneurs (CPO : 4 Md€/an de soutien contre 75 M€ pour la réduction d\'impôt PME).',
      'stock imposé une fois : ' + h.stockUneFois.toFixed(0) + ' Md€ (non compté) ; fin de purge ' + h.finPurge150.toFixed(1) + ' Md€/an (non comptée, recoupe d)'));
    out.push(ligneMontage('f', 'Donations répétées tous les 15 ans (rappel fiscal, art. 784 CGI ; abattements renouvelés, art. 779)', 'supprimé et compté (cumul à vie dans la fonction continue)', MONTAGES_COUT.rappel15.cout[k], MONTAGES_COUT.rappel15.source, g('rappel15'),
      'N06 : impôt sur l\'héritage reçu à vie (fonction continue du cumul reçu, H600-H603)', 0,
      'Constitutionnel : faible (le délai de 15 ans est un choix du législateur, non un principe) ; sécurité juridique pour les donations déjà faites : régime transitoire. UE : sans objet.',
      'Le délai de 15 ans encourage la transmission précoce, qui rajeunit le patrimoine des héritiers (CAE : donations avant 70 ans) ; le cumul à vie peut la décourager.'));
    out.push(ligneMontage('g', 'Trusts (art. 792-0 bis, 1649 AB) et sociétés civiles patrimoniales (décote, compte courant d\'associé)', 'maintenu (non modélisé) ; trusts déjà taxés à 45 % ou 60 % en droit actuel', coutSci(sc), 'coût non publié ; estimation HG36 (⚠️) ; trusts : art. 792-0 bis lu dans la base LEGI (taux de la dernière tranche des tableaux I et III de l\'art. 777)', gainDepuisCout(coutSci(sc), 0.30, sc),
      'non compté', gainDepuisCout(coutSci(sc), 0.30, sc),
      'Constitutionnel : faible (valeur vénale réelle, plafond de la décote). UE : trusts : libre circulation des capitaux, mais déclaration obligatoire licite (1649 AB).',
      'Une décote d\'illiquidité ou de minorité reflète une vraie moindre valeur ; interdire le compte courant d\'associé gêne le financement des sociétés familiales.'));
    return out;
  }
  /** Cohérence : somme des gains attribuables des dispositifs a, b, c, f, g (compris dans N06 sauf g) comparée à N06 net moins les droits actuels (+38,8 Md€ au central). */
  function sommeMontages(sc) {
    var m = montages(sc), s = 0; m.forEach(function (l) { if (l.id !== 'd' && l.id !== 'e') s += l.gainNet; });
    return { somme: s, n06Net: v54(sc).taxeDetail ? Z.partVie ? null : null : null };
  }

  /** Ce que perdrait N06 si l'auteur maintient le dispositif (Md€/an) : le gain attribuable des dispositifs déjà comptés (a, b, c, f) ; e est dans N05 ; d et g valent 0 ou ne sont pas dans N06. */
  function coutDuMaintien(sc) { var r = {}; montages(sc).forEach(function (l) { r[l.id] = (l.id === 'a' || l.id === 'b' || l.id === 'c' || l.id === 'f') ? l.gainNet : 0; }); return r; }
  /** Somme des gains attribuables compris dans N06 (a + b + c + f) : doit rester inférieure à N06 net moins les droits actuels (central : 59,6 − 20,8 = 38,8 Md€). */
  function sommeDansN06(sc) { var c = coutDuMaintien(sc); return c.a + c.b + c.c + c.f; }

  /** (a) de Zucman sur le droit actuel, sans la taxe de 1 % ni le prélèvement unique de la v5.4 : 2 % moins 0,5 % d'impôts déjà payés (IPP 2016 : revenu fiscal ≈ 4 % du revenu économique ; ISF effectif 0,43 % avant l'IFI) ; référence seule. */
  function zucmanSurDroitActuel(sc) {
    var T = tranches(sc).T3, e = erosion(sc, 1.5), statique = T.n * T.W * (0.02 - 0.005) / 1e9;
    return { statique: statique, net: T.n * T.W * (0.02 * (1 - e) - 0.005) / 1e9 };
  }
  /** Seuil par adulte (€) qui ramène le barème (1 % / 2 % / 3 %) à la recette de la taxe de 1 % ; null si même un seuil nul ne suffit pas. */
  function seuilRecetteEgale(sc, o) {
    o = o || {}; var lo = 0, hi = 300000, m, k;
    function f(x) { var q = {}; for (var key in o) q[key] = o[key]; q.seuilAdulte = x; return varianteB(sc, q).delta; }
    if (f(0) < 0) return null;
    if (f(hi) >= 0) return hi;
    for (k = 0; k < 30; k++) { m = (lo + hi) / 2; if (f(m) >= 0) lo = m; else hi = m; }
    return lo;
  }
  /** Qui gagne, qui perd : par tranche de patrimoine (dixièmes, P90-95, P95-99 de l'enquête ; trois tranches au-dessus), impôt de la taxe de 1 % puis du barème (€ par ménage et par an, avant comportement). */
  function gagnantsPerdants(sc, o) {
    var b = varianteB(sc, o), noms = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'P90-95', 'P95-99'], out = [], q, a, TR = tranches(sc), pa = HYP.partAssiette1pc, S = b.seuilMenage;
    for (q = 0; q < 11; q++) { a = b.parTrancheEnquete[q]; out.push({ tranche: noms[q], menages: a.n, patrimoineBrutMoyen: a.W, impotAvant: a.impotAvant, impotApres: a.impotApres, ecart: a.impotApres - a.impotAvant, ecartSurPatrimoine: a.W > 0 ? (a.impotApres - a.impotAvant) / a.W : 0 }); }
    ['T1', 'T2', 'T3'].forEach(function (nom) { var T = TR[nom], W1 = T.W * pa, ap = impotBareme(W1, S, o), av = 0.01 * W1; out.push({ tranche: nom + ' (' + T.libelle + ')', menages: T.n, patrimoineBrutMoyen: T.W, impotAvant: av, impotApres: ap, ecart: ap - av, ecartSurPatrimoine: (ap - av) / T.W }); });
    return out;
  }

  var API = { SCS: SCS, HYP: HYP, pointDeTaux: pointDeTaux, holdings: holdings, tranches: tranches, tranche1: tranche1, erosion: erosion, varianteA: varianteA, impotBareme: impotBareme, kPop: kPop,
              varianteB: varianteB, tauxMilieuRecetteEgale: tauxMilieuRecetteEgale, sensibiliteA: sensibiliteA, HER: HER, paretoHeritage: paretoHeritage, heritiersAuDessus: heritiersAuDessus,
              excedentAuDessus: excedentAuDessus, heritage: heritage, montages: montages, coutDuMaintien: coutDuMaintien, sommeDansN06: sommeDansN06, zucmanSurDroitActuel: zucmanSurDroitActuel, seuilRecetteEgale: seuilRecetteEgale, gagnantsPerdants: gagnantsPerdants, MONTAGES_COUT: MONTAGES_COUT, coutSci: coutSci, gainDepuisCout: gainDepuisCout };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.GrandesFortunes0511 = API;
})(this);
