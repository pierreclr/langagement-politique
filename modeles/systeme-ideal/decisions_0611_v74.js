/*
 * modeles/systeme-ideal/decisions_0611_v74.js — v7.4 PROPOSÉE (06/11/2026, nuit), NON ADOPTÉE : à valider par l'auteur. Part de la v7.3 proposée (decisions_0611_v73.js).
 * Retours de l'auteur (06/11, nuit) : (1) résidence principale sur la courbe principale (10 000 €/an pour 1 M€ jugés acceptables) ; allègement léger jusqu'à 300 k€ en OPTION seulement ;
 * (2) impôt plancher « à la Zucman » retenu ; (3) garde-fous min/max contre les aberrations (celui qui a épargné, vit dans une grande maison, voit ses revenus baisser) ;
 * (4) tous les cas limites calculés avant la formule finale.
 *
 * Formule v7.4 (quatre lignes) :
 *   (a) P(W) = 2 % × W² / (W + K), K = 700 000 € (variante B, recommandée ; variante A : K = 1 M€ de la v7.3) ; taux moyen τ(W) = 2 % × W / (W + K), résidence principale comprise.
 *       W = valeur nette ; biens professionnels, terres exploitées et forêts gérées à la VALEUR DE RENDEMENT (revenu net moyen / 4 %, plafonnée à la valeur vénale) ;
 *       jeunes entreprises sans liquidité à la valeur substantielle (fonds propres) jusqu'au premier événement de liquidité ; usufruitier imposé sur la pleine propriété ;
 *       enfants mineurs rattachés au foyer ; résidents sur leurs biens du monde entier (impôt étranger sur le patrimoine imputé) ; non-résidents sur leurs immeubles en France.
 *   (b) Impôt plancher : P'(W) = max(0, P(W) − C_k)            C_k = part de la contribution personnelle (fonction des revenus) due sur les revenus du capital, au prorata.
 *       Pour un rentier : on paie le plus élevé des deux, contribution sur ses revenus du capital ou taxe du patrimoine. L'IS n'est pas imputé (H74.2).
 *   (c) Payé dans l'année : min(P', max(x(N) × N, 2 % × A))     N = revenu net annuel du foyer (après la fonction des revenus) ; x(N) = 50 % × N / (N + 72 000 €) ;
 *       A = actifs mobilisables (titres cotés, fonds, cryptoactifs, parts de holdings passives et de sociétés non cotées où le foyer n'exerce pas : payables en titres).
 *   (d) Le reste est DIFFÉRÉ : créance garantie sur le bien (hypothèque légale ou nantissement), intérêts au taux d'emprunt de l'État pour tous (coût nul pour l'État hors pertes),
 *       exigible à la vente, à la donation ou à la succession (le conjoint survivant qui reste dans le logement garde le report), sans recours au-delà de la valeur nette du bien.
 *   Le plafond de 75 % du revenu de la v7.3 est SUPPRIMÉ : l'impôt plancher et la règle (c) le remplacent.
 *
 * Population : enquête HVP recalée × 1,4 (taxe_patrimoine.js), à laquelle la v7.4 ajoute une loi jointe revenu × patrimoine reconstituée (H74.4 ⚠️ V15302) pour le plancher et le différé.
 *       Non-résidents : pas de règle (c), ils paient P' (⚠️ V15309). Jeunes entreprises : valeur substantielle. Œuvres d'art : différé, dation possible à la succession (art. 1716 bis CGI).
 * Fonction des revenus : même forme, recalée pour que la dette reste stable en macro de référence avec la combinaison recommandée (H74.6) : en variante B, c'est celle de la v7.2.
 * Euros de 2025-2026 ; €/mois pour les cas types sauf mention, Md€/an pour les masses. Des hypothèses et des ordres de grandeur, jamais des prédictions. Ne modifie AUCUN module existant.
 * Charger (depuis modeles/systeme-ideal/, jsc) : la liste de test_decisions_0611_v73.js sans le test, puis decisions_0611_v74.js (ordre complet en tête de test_decisions_0611_v74.js).
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  function need(n, f) { return root[n] || (req ? req(f) : null); }
  var Z = need('Decisions0611V73', './decisions_0611_v73.js'), Y = need('Decisions0611V72', './decisions_0611_v72.js'), X = need('BaremeV71', './bareme_v71.js');
  var W7 = need('BaremeDeuxFonctionsV7', './bareme_deux_fonctions_v7.js'), V = need('BaremeUniqueV6', './bareme_unique_v6.js'), J = need('Decisions0511j', './decisions_0511j.js');
  var H = need('Decisions0511h', './decisions_0511h.js'), DS = need('VarianteDetteStable', './variante_dette_stable.js'), TP = need('TaxePatrimoine', './taxe_patrimoine.js');
  var M = need('SystemeIdeal', './modele.js');
  var CT = root.CAS_TYPES_DONNEES || (req ? req('../gagnants-perdants/cas_types_donnees.js') : null);
  var SCS = ['bas', 'central', 'haut'], MACROS = ['prudente', 'reference', 'favorable'];
  var SC_TP = { bas: 'haut', central: 'central', haut: 'bas' };   // taxe_patrimoine.js nomme « bas » le moins favorable : on croise (comme la v7.2 et la v7.3)

  var HYP = {
    tRef: 0.42, annee1: 2029,
    // H74.1 : fonction du patrimoine de la v7.3, résidence principale comprise (retour de l'auteur : 10 000 €/an pour une résidence de 1 M€ acceptables). Option : abattement sur la RP.
    //   RECOMMANDÉ (variante B) : K = 700 000 € au lieu de 1 M€ (0,60 % à 300 000 €, 1,18 % à 1 M€) : l'impôt plancher coûte ≈ 15 Md€ ; K = 700 000 € les reprend sur l'immobilier
    //   qui ne rapporte pas et garde la fonction des revenus de la v7.2. Variante A : K = 1 M€ (courbe de la v7.3) et fonction des revenus resserrée (cadre à 10 000 € brut à −5,5 %).
    patrimoine: { tInf: 0.02, K: 7e5, recalage: 1.4 },
    optionRP: { abattement: 1e5 },   // option testée, non retenue par défaut : la RP compte pour sa valeur moins 100 000 € (0,22 % à 300 000 € au lieu de 0,46 %)
    // H74.2 : impôt plancher : C_k = contribution personnelle × part des revenus du capital dans le revenu (prorata). L'IS de la société n'est pas imputé (logique de la proposition
    //   de loi « Zucman » adoptée par l'Assemblée nationale le 20/02/2025, qui impute les impôts personnels ⚠️ V15300). Revenus du capital distribués dans la population :
    //   loyers nets au rendement locatif de taxe_patrimoine.js (H508) sur l'immobilier hors résidence principale ; dividendes et intérêts sur les parts : 1,5 / 2 / 3 % (⚠️ V15301 ;
    //   « bas » = favorable à la recette = peu de distribution, donc peu d'imputation).
    plancher: { dMob: { bas: 0.015, central: 0.02, haut: 0.03 }, alpha: 1 },   // alpha : part de C_k imputée (1 = plancher complet ; variante 0,5)
    // H74.3 : part de la résidence principale dans l'immobilier net, par tranche HVP (12 tranches de taxe_patrimoine.js) ⚠️ V15303 : utile seulement pour l'option RP et pour les loyers.
    partRP: [1, 1, 1, 0.95, 0.95, 0.92, 0.9, 0.85, 0.75, 0.65, 0.5, 0.3],
    // H74.4 : loi jointe revenu × patrimoine : quatre quartiles de niveau de vie, patrimoine brut moyen 118 000 / 192 200 / 312 800 / 874 600 € (Insee Focus n° 371, figure 3b, déjà dans
    //   taxe_patrimoine.js HVP.quartilesNiveauVie) ; dans chaque quartile, le patrimoine suit la forme de la distribution HVP, mise à l'échelle de sa moyenne (approximation ⚠️ V15302) ;
    //   revenu du foyer avant la fonction, hors revenus du patrimoine : 1 700 / 2 700 / 3 700 / 6 500 €/mois (≈ niveau de vie moyen du quartile × 1,5 UC ⚠️ V15302) ; 1,7 adulte.
    revenusQuartiles: [1700, 2700, 3700, 6500], adultes: 1.7,
    // H74.5 : règle de paiement : x(N) = xInf × N / (N + KN), xInf = 50 %, KN = 72 000 €/an (6 000 €/mois) : 8,1 % à 1 200 €/mois, 12,5 % à 2 000 €, 25 % à 6 000 € ;
    //   (essai à 30 % / 48 000 € écarté : la résidence de 1 M€ d'un couple à 2 × 3 500 € aurait été différée). Plancher de paiement : 2 % des actifs mobilisables.
    //   Différé : intérêts au taux d'emprunt de l'État pour tous (coût nul pour l'État, hors pertes ; sans intérêts sous la médiane, l'héritier sans revenu d'un bien de 2 M€ aurait un prêt gratuit) ;
    //   taux réel de l'État 1,3 % ⚠️ V15305 ; durée moyenne du différé 12 ans (comme la v7.2) ; pertes : part non recouvrée de taxe_patrimoine.js (5 % au central).
    paiement: { xInf: 0.50, KN: 72000, partMobilisable: 0.02, tauxReel: 0.013, duree: 12, sansInteretSousMediane: false },
    // H74.7 : terres agricoles à la valeur de rendement (pratique suisse : valeur de rendement agricole, LDFR art. 10 ⚠️ V15304) : base des terres × 0,5 (⚠️ V15304)
    terresRendement: 0.5,
    // H74.6 : fonction des revenus recalibrée (même forme ; calibrer()) : dette stable en macro de référence avec la combinaison recommandée, bas revenus +20 à +80 €/mois,
    //   rentiers perdants revenus ET patrimoine, TME ≤ 75 %, recette au plus près du besoin (prélèvements au plus près de la v7.2).
    //   Variante B retenue : S = 412,5 €, m∞ = 65 %, m0 = 20 %, K = 1 500 €/mois : c'est exactement la fonction de la v7.2 (la grille la retrouve d'elle-même).
    //   Variante A : S = 412,5 €, m∞ = 66 %, m0 = 20 %, K = 1 500 €/mois.
    bareme: { S: 412.5, mInf: 0.65, m0: 0.20, K: 1500, kappa: 1, enfant: 200, majParentIsole: 250 },
    tfMoyen: 0.0027, grenobleTF: 2650,
    combinaison: ['R1f', 'M1m', 'M2m', 'M3']
  };

  // ======================================================================================================================================
  // 1. Fonctions de base
  // ======================================================================================================================================
  function tauxMoyen(W) { var P = HYP.patrimoine; return W <= 0 ? 0 : P.tInf * W / (W + P.K); }
  function Tp(W) { return W <= 0 ? 0 : tauxMoyen(W) * W; }
  function mp(W) { var P = HYP.patrimoine; if (W <= 0) return 0; var q = P.K / (W + P.K); return P.tInf * (1 - q * q); }
  /** Option RP : la résidence principale compte pour sa valeur moins l'abattement (borné à sa valeur). */
  function Wtaxable(rp, autre, optRP) { return Math.max(0, rp + (autre || 0) - (optRP ? Math.min(rp, HYP.optionRP.abattement) : 0)); }
  function xN(Nan) { var P = HYP.paiement; return Nan <= 0 ? 0 : P.xInf * Nan / (Nan + P.KN); }
  /** Règle (c) : payé dans l'année, différé (€/an). */
  function paiement(Pprime, Nan, A) { var paye = Math.min(Pprime, Math.max(xN(Nan) * Nan, HYP.paiement.partMobilisable * (A || 0))); return { paye: paye, differe: Pprime - paye }; }
  function sched(q) { return X.sched(q || HYP.bareme); }
  function erosion(tau, e1) { return 1 - Math.pow(1 - e1, tau / 0.01); }
  function formulePatrimoine() { return 'P(W) = 2 % × W² / (W + ' + (HYP.patrimoine.K / 1e3) + ' k€) ; P\'(W) = max(0, P(W) − C_k) ; payé = min(P\', max(x(N) × N, 2 % × A)) ; x(N) = 50 % × N / (N + 72 000 €)'; }
  function tablePatrimoine(pts) {
    return (pts || [1e5, 3e5, 1e6, 3e6, 1e7, 1e8, 1e9]).map(function (W) {
      var rpO = Tp(Wtaxable(W, 0, true));
      return { W: W, taxe: Tp(W), tauxMoyen: tauxMoyen(W), marginal: mp(W), rpOption: rpO, rpOptionTaux: rpO / W };
    });
  }

  // ======================================================================================================================================
  // 2. Loi jointe revenu × patrimoine (H74.4) : P(quartile q | patrimoine brut W) ∝ densité HVP en W / c_q, c_q = moyenne du quartile / moyenne
  // ======================================================================================================================================
  function brutQ(p) { var s = TP.HVP.seuils, i; if (p >= 0.95) return s[10][1] * Math.pow(0.05 / (1 - p), 1 / TP.HVP.alphaPareto);
    for (i = 1; i < s.length; i++) if (p <= s[i][0]) return s[i - 1][1] + (s[i][1] - s[i - 1][1]) * (p - s[i - 1][0]) / (s[i][0] - s[i - 1][0]); return s[10][1]; }
  function Fbrut(x) { if (x <= 0) return 0; var lo = 0, hi = 1 - 1e-12, k; for (k = 0; k < 60; k++) { var m = (lo + hi) / 2; if (brutQ(m) < x) lo = m; else hi = m; } return (lo + hi) / 2; }
  function densite(x) { if (x <= 0) return 0; var e = 0.01; return (Fbrut(x * (1 + e)) - Fbrut(x * (1 - e))) / (2 * e * x); }
  var _poids = null;
  function poidsQuartiles() {
    if (_poids) return _poids;
    var pop = TP.population('pierreNet'), qm = TP.HVP.quartilesNiveauVie, moy = (qm[0] + qm[1] + qm[2] + qm[3]) / 4;
    _poids = pop.map(function (h) {
      var w = qm.map(function (m) { var c = m / moy; return densite(h.W / c) / c; }), s = w[0] + w[1] + w[2] + w[3];
      return s > 0 ? w.map(function (x) { return x / s; }) : [0.25, 0.25, 0.25, 0.25];
    });
    return _poids;
  }

  // ======================================================================================================================================
  // 3. Population : plancher, paiement, différé, taux effectifs par composante
  // ======================================================================================================================================
  var _comp = {};
  /**
   * o = { fTaux (fonction de taux moyen, défaut τ), plancher (true), optRP (false), q (barème, défaut HYP.bareme) } ; s = scénario de taxe_patrimoine.js.
   * Pour chaque ménage HVP recalé et chaque quartile de revenu (pondéré) : P, C_k, P', payé, différé. Taux effectifs (dû = P') par composante pour la chaîne de recette.
   */
  function composantes(s, o) {
    o = o || {}; var al = o.alpha === undefined ? HYP.plancher.alpha : o.alpha, key = s + '|' + al + '|' + HYP.patrimoine.tInf + '|' + HYP.patrimoine.K + '|' + HYP.paiement.xInf + '|' + HYP.paiement.KN + '|' + (o.plancher === false ? 0 : 1) + (o.optRP ? 1 : 0) + (o.fTaux ? 'f' : '') + (o.q ? JSON.stringify(o.q) : '');
    if (!o.fTaux && _comp[key]) return _comp[key];
    var pop = TP.population('pierreNet'), pw = poidsQuartiles(), r = HYP.patrimoine.recalage, p = TP.PARAM[s], ad = HYP.adultes, b = sched(o.q), tm = o.fTaux || tauxMoyen;
    var dMob = HYP.plancher.dMob[{ haut: 'bas', central: 'central', bas: 'haut' }[s]], dLoc = p.rendementLocatif, med = 0;
    var A = { im: 0, imT: 0, w: 0, wP: 0, wPp: 0, D: 0, Dsm: 0, nbDiff: 0, ded: 0 }, g = { top: { m: 0, mT: 0, mTe: 0, mE: 0 }, reste: { m: 0, mT: 0, mTe: 0, mE: 0 } }, nH = 30.9e6 / pop.length;
    pop.forEach(function (h, i) {
      var im = r * h.immo, mo = r * h.mobile, rp = HYP.partRP[h.k] * im, loc = im - rp, w = im + mo;
      var wt = Math.max(0, w - (o.optRP ? Math.min(rp, HYP.optionRP.abattement) : 0)), P = wt * tm(wt);
      var fin = TP.HVP.tranches[h.k][2] / 100, Amob = r * h.W * TP.PHI[h.k] * fin;      // actifs mobilisables : actions et fonds du patrimoine financier (le professionnel est différable)
      var Pp = 0, D = 0, Dsm = 0, nd = 0;
      for (var q = 0; q < 4; q++) {
        var wq = pw[i][q]; if (wq <= 0) continue;
        var ycap = (dLoc * loc + dMob * mo) / 12, y = HYP.revenusQuartiles[q] + ycap, t = ad * (b.T(y / ad) - b.S), N = y - t;
        var ck = o.plancher === false ? 0 : al * 12 * Math.max(0, t) * ycap / y, pq = Math.max(0, P - ck), pay = paiement(pq, 12 * N, Amob);
        Pp += wq * pq; D += wq * pay.differe; if (q <= 1) Dsm += wq * pay.differe; if (pay.differe > 0) nd += wq;
      }
      var tE = w > 0 ? Pp / w : 0, G = h.p >= 0.99 ? g.top : g.reste, e = erosion(tE, h.p >= 0.99 ? p.erosionTop : p.erosionReste);
      A.im += im; A.imT += tE * im; A.w += w; A.wP += P; A.wPp += Pp; A.D += D; A.Dsm += Dsm; A.nbDiff += nd * nH; A.ded += P - Pp;
      G.m += mo; G.mT += tE * mo; G.mTe += tE * mo * (1 - e); G.mE += mo * e;
    });
    var out = { tauxEffectif: A.wPp / A.w, tauxAvantPlancher: A.wP / A.w, tauxImmo: A.imT / A.im, partDeduite: A.ded / A.wP, partDifferee: A.D / A.wPp, partDiffereeSousMediane: A.Dsm / Math.max(1e-9, A.D),
                menagesDifferes: A.nbDiff,
                top: { taux: g.top.mT / g.top.m, rendement: g.top.mTe / g.top.m, erosion: g.top.mE / g.top.m },
                reste: { taux: g.reste.mT / g.reste.m, rendement: g.reste.mTe / g.reste.m, erosion: g.reste.mE / g.reste.m } };
    if (!o.fTaux) _comp[key] = out;
    return out;
  }
  /**
   * Recette nette (Md€/an, croisière) : chaîne de la v7.3 (assiette nette, valorisations, effet de prix, érosion ménage par ménage, exil, gestion), avec le dû P' (plancher), les terres à la
   * valeur de rendement (H74.7) et le différé de la règle (c) : seule sa part non recouvrée est perdue en croisière ; encours et coût de trésorerie à part (tresorerie()).
   * Contrôle : o = { fTaux: 1 %, plancher: false, differeTP: true, terres: 1 } redonne exactement taxe_patrimoine.js.
   */
  function recettePatrimoine(sc, o) {
    o = o || {}; var s = SC_TP[sc || 'central'], p = TP.PARAM[s], C = TP.COMMUN, c = TP.composantes('pierreNet'), k = composantes(s, o);
    var fT = o.terres === undefined ? HYP.terresRendement : o.terres;
    var dp = TP.effetPrix(s, k.tauxImmo), immoNet = c.immo - c.dettes;
    var baseImmo = Math.max(0, immoNet) * p.valImmo * (1 + dp) + c.terres * p.valTerres * fT * (1 + dp);
    var mobileAvant = c.actions * p.partCotees + c.opc + c.actions * (1 - p.partCotees) * p.valNonCotees + Math.min(0, immoNet), f = C.partTop1Mobile;
    var bruteImmo = k.tauxImmo * baseImmo, bruteMob = mobileAvant * (f * k.top.rendement + (1 - f) * k.reste.rendement), brute = bruteImmo + bruteMob;
    var erode = mobileAvant * (f * k.top.erosion + (1 - f) * k.reste.erosion), exil = C.partExil * erode * C.externalite, gestion = p.coutGestion * brute;
    var differe = o.differeTP ? brute * C.eligibleDiffere * p.recours : brute * k.partDifferee, perteDiffere = differe * (1 - p.recouvrement);
    var terresPerte = c.terres * p.valTerres * (1 - fT) * (1 + dp) * k.tauxImmo;
    return { brute: brute, bruteImmo: bruteImmo, bruteMobile: bruteMob, exil: exil, gestion: gestion, differe: differe, perteDiffere: perteDiffere, nette: brute - exil - gestion - perteDiffere,
             tauxEffectif: k.tauxEffectif, tauxAvantPlancher: k.tauxAvantPlancher, tauxImmo: k.tauxImmo, partDeduite: k.partDeduite, partDifferee: k.partDifferee,
             erosionTop: k.top.erosion, erosionReste: k.reste.erosion, effetPrix: dp, mobileAvant: mobileAvant, baseImmo: baseImmo, terresRendement: terresPerte, menagesDifferes: k.menagesDifferes,
             partDiffereeSousMediane: k.partDiffereeSousMediane };
  }
  /** Trésorerie du différé (central) : flux annuel, encours en croisière (flux × durée), en % du PIB, coût annuel (intérêts non facturés sous la médiane). */
  function tresorerie(sc) {
    var r = recettePatrimoine(sc || 'central'), P = HYP.paiement, enc = r.differe * P.duree, pib = Y.BILAN510.pib;
    return { flux: r.differe, encours: enc, encoursPctPib: enc / pib, coutAnnuel: P.sansInteretSousMediane ? P.tauxReel * enc * r.partDiffereeSousMediane : 0, coutSiSansInteretSousMediane: P.tauxReel * enc * r.partDiffereeSousMediane, perte: r.perteDiffere, menages: r.menagesDifferes };
  }

  // ======================================================================================================================================
  // 4. Lignes du volet patrimoine (par rapport à la v5.10), gain sur la v7.2 et la v7.3
  // ======================================================================================================================================
  function k1pc() { return recettePatrimoine('central').tauxEffectif / 0.01; }
  function lignesPatrimoine(sc, o) {
    var p510 = W7.NEUTRALITE.patrimoine510, k = recettePatrimoine('central', o).tauxEffectif / 0.01, rp = recettePatrimoine(sc, o).nette, H72 = Y.HYP;
    var l = {
      taxeAnnuelle: rp - p510.N07_taxe_1pc,
      dmtgGardes: W7.NEUTRALITE.dmtgConserves - p510.N06_transmissions,
      dmto: -W7.NEUTRALITE.remplacees.dmto - p510.N08_reforme_immo,
      realisation: -p510.N05_realisation_pv,
      plafonds: 0 - p510.N09_plafonds,            // H74.5 : plus de plafond de 75 % ; le différé de la règle (c) est dans la recette (part non recouvrée)
      holdings: H72.n14 - p510.N14_holdings_passifs,
      trusts: H72.n15 * k - p510.N15_trusts_sci,
      sci: H72.n16 * k - p510.N16_sci
    };
    var tot = 0, x; for (x in l) tot += l[x]; l.total = tot; l.recetteTaxe = rp;
    return l;
  }
  function gainPatrimoineVsV73(sc) { return lignesPatrimoine(sc).total - Z.lignesPatrimoine(sc).total; }

  // ======================================================================================================================================
  // 5. Fonction des revenus, écart, solde, prélèvements, dette (construction de la v7.3)
  // ======================================================================================================================================
  function formule(q) { var C = q || HYP.bareme; return 'B(R) = ' + C.S + ' + ' + Math.round((C.mInf - C.m0) * C.K) + ' × (1 − e^(−R/' + C.K + ')) − ' + C.mInf + ' × R'; }
  function table(pts) { return V.table(sched(), pts || [0, 1000, 2000, 3000, 5000, 8000, 10000, 50000]).map(function (l) { return { R: l.R, du: -l.B, reste: l.net, tauxMoyen: l.R > 0 ? -l.B / l.R : null, marginal: l.marginal }; }); }
  var _b = {};
  function bilanRevenus(sc) { var s = sc || 'central'; return _b[s] || (_b[s] = X.bilan(HYP.bareme, s)); }
  function surplus(sc) { return bilanRevenus(sc).ecart; }
  var _e = {};
  function ecart(sc) {
    var s = sc || 'central'; if (_e[s]) return _e[s];
    var b = bilanRevenus(s), lp = lignesPatrimoine(s), cd = W7.NEUTRALITE.capitalDepart510, h = Y.n03(s), rev = b.actifs + b.retraitesCapital + b.is + b.retenue;
    return (_e[s] = { revenus: rev, patrimoine: lp.total, lignesPatrimoine: lp, capitalDepart: cd, n03: -h, total: rev + lp.total + cd - h, detail: b.detail, retraitesCapital: b.retraitesCapital, is: b.is, retenue: b.retenue });
  }
  function solde(sc, an) { return J.solde(sc, an, HYP.tRef) + (an < HYP.annee1 ? 0 : ecart(sc).total); }
  function prelevementsDepenses(sc) {
    var s = sc || 'central', e = ecart(s), d = e.detail, mj = J.mesure(HYP.tRef, s), bonus = mj.cout, reprise = mj.recette;
    var dT = d.haut - d.bas - d.fermeture + reprise - bonus, dPO = dT + e.retraitesCapital + e.is + e.retenue + e.n03 + e.patrimoine, dDep = d.socle + d.enfants + d.plancher - bonus + reprise - e.capitalDepart;
    return { dT: dT, dPO: dPO, dDep: dDep, socle: d.socle, enfants: d.enfants, plancher: d.plancher, bonus: bonus, reprise: reprise, controle: dPO - dDep - e.total };
  }
  function prelevementsObligatoires() {
    var B = Y.BILAN510, pd = prelevementsDepenses('central'), po = B.po + pd.dPO, tr = pd.socle + pd.enfants + pd.plancher - pd.bonus + pd.reprise - W7.NEUTRALITE.capitalDepart510;
    return { avantPct: B.poAvant / B.pib, v72Pct: Y.prelevementsObligatoires().pct, v73Pct: Z.prelevementsObligatoires().pct, po: po, pct: po / B.pib, pctNet: (B.poNet + pd.dPO - tr) / B.pib, dPO: pd.dPO };
  }
  function net(lev, add) { return function (s, y) { return H.net(s, y) + (y < HYP.annee1 ? 0 : J.residu(HYP.tRef, s) + ecart(s).total + (add || 0) + (lev ? lev(s, y) : 0)); }; }
  function trajectoire(sc, macro, lev) { return DS.trajectoire(sc || 'central', { taux: HYP.tRef, macro: macro, net: net(lev) }); }
  function jalons(sc, macro, lev) { return DS.jalons(trajectoire(sc, macro, lev)); }
  function dette() { var o = {}; MACROS.forEach(function (m) { o[m] = {}; SCS.forEach(function (s) { o[m][s] = jalons(s, m); }); }); return o; }
  function besoin(sc, macro, lev) {
    var ok = function (x) { var tr = trajectoire(sc, macro, function (s, y) { return (lev ? lev(s, y) : 0) + x; }); return Math.max.apply(null, tr.ratio.slice(0, 30)) <= tr.ratio0 + 1e-9; };
    if (ok(0)) return 0; var lo = 0, hi = 500, k; if (!ok(hi)) return null;
    for (k = 0; k < 50; k++) { var m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    return hi;
  }
  /** Marge (Md€/an, > 0) avant qu'un manque réapparaisse en macro de référence avec la combinaison : plus grande réduction constante du solde qui garde la dette stable. */
  function marge(macro) {
    var lv = Y.leviers(HYP.combinaison), m = macro || 'reference';
    var ok = function (x) { var tr = trajectoire('central', m, function (s, y) { return lv(s, y) - x; }); return Math.max.apply(null, tr.ratio.slice(0, 30)) <= tr.ratio0 + 1e-9; };
    if (!ok(0)) return -besoin('central', m, lv);
    var lo = 0, hi = 200, k; for (k = 0; k < 50; k++) { var x = (lo + hi) / 2; if (ok(x)) lo = x; else hi = x; } return lo;
  }
  function economiesPourStabiliser(sc, macro) { return besoin(sc, macro, null); }
  function combinaison(ids) {
    var lv = Y.leviers(ids || HYP.combinaison), out = { ids: ids || HYP.combinaison, dette: {}, manque: {} };
    MACROS.forEach(function (m) { out.dette[m] = jalons('central', m, lv); out.manque[m] = besoin('central', m, lv); });
    return out;
  }
  /**
   * Recalibrage de la fonction des revenus (H74.6) : contraintes de la v7.3 (bas ≥ +20 €, rentiers perdants revenus ET patrimoine v7.4, TME ≤ 75 %) et recette ≥ cible ;
   * score : bas ≤ +80 €, cadres à 10 000 et 20 000 € brut proches de −2 %, recette au plus près de la cible (prélèvements au plus près de la v7.2).
   */
  function evaluer(q, cible) {
    var c = X.casTypesObjet(q), bas = ['smic_seul', 'parent_isole_smic', 'couple_2smic_2enf', 'net_1500', 'net_1750'].map(function (k) { return c[k].ecart; });
    var ckD = 12 * (5000 - c.rentier_div_5000.apres), rd = c.rentier_div_5000.ecart - Math.max(0, Tp(2e6) - ckD) / 12;
    var ckM = 12 * (5000 - c.rentier_mixte_5000.apres) * 0.5, rm = c.rentier_mixte_5000.ecart - Math.max(0, Tp(1e6) - ckM) / 12;
    if (!bas.every(function (e) { return e >= 20; }) || rd > 0 || rm > 0) return null;
    var b = X.bilan(q, 'central').ecart; if (b < cible - 0.05) return null;
    var tm = X.tme(q).max.taux; if (tm > 0.75) return null;
    var h10 = c.cadre_10000.ecart / c.cadre_10000.avant, h20 = c.cadre_20000.ecart / c.cadre_20000.avant;
    var dist = bas.reduce(function (a, e) { return a + Math.max(0, e - 80) / 30; }, 0) + Math.max(0, Math.abs(h10 + 0.02) - 0.01) / 0.01 + Math.max(0, Math.abs(h20 + 0.02) - 0.01) / 0.01;
    return { score: dist + Math.max(0, b - cible) / 2, distance: dist, ecart: b, tme: tm, h10: h10, h20: h20, bas: bas, rentier: rd, rentierMixte: rm };
  }
  function calibrer(cible, grille) {
    var g = grille, best = null, n = 0;
    g.S.forEach(function (S) { g.mInf.forEach(function (mi) { g.m0.forEach(function (m0) { g.K.forEach(function (K) {
      var q = { S: S, mInf: mi, m0: m0, K: K, kappa: 1, enfant: 200, majParentIsole: 250 }, r = evaluer(q, cible);
      if (r) { n++; if (!best || r.score < best.score) { best = r; best.q = q; } }
    }); }); }); });
    if (best) best.admissibles = n;
    return best;
  }

  // ======================================================================================================================================
  // 6. Un foyer : impôt plancher, paiement, différé (cas types et cas limites)
  // ======================================================================================================================================
  /**
   * f = { nom, R: [revenus d'activité ou pensions €/mois par adulte], div (dividendes nets d'IS €/mois), loyers (loyers nets €/mois), rp, locatif, cotes (titres cotés, fonds, crypto),
   *       nonCotePassif (holdings passives : mobilisable), nonCotePro (société où le foyer exerce, valeur retenue), terres, foret, art, etranger, dettes, impotEtranger (€/an imputé),
   *       optRP, avant: { tf, ifi, revenu } (droit actuel, €/an pour tf et ifi), sousMediane (pour les intérêts du différé), part (quote-part, défaut 1) }.
   * Rend €/an : W, P, Ck, P', payé, différé, N (revenu net), part du revenu net payée, créance au bout de 20 ans (intérêts réels 0 sous la médiane, 1,3 % au-dessus).
   */
  function foyer(f, q) {
    var s = sched(q), tIS = 0.25, brutD = (f.div || 0) / (1 - tIS), R = f.R || [0];
    var revFn = V.menage(s, { revenus: R, capital: [brutD + (f.loyers || 0)] }, X.HYP.regle).revenu;
    var recu = R.reduce(function (a, x) { return a + x; }, 0) + (f.div || 0) + (f.loyers || 0), impot = recu - revFn, cap = (f.div || 0) + (f.loyers || 0);
    var Ck = (f.alpha === undefined ? HYP.plancher.alpha : f.alpha) * 12 * Math.max(0, impot) * (recu > 0 ? cap / recu : 0);
    var autre = (f.locatif || 0) + (f.cotes || 0) + (f.nonCotePassif || 0) + (f.nonCotePro || 0) + (f.terres || 0) + (f.foret || 0) + (f.art || 0) + (f.etranger || 0);
    var W = Math.max(0, (f.rp || 0) + autre - (f.dettes || 0)), Wt = Wtaxable(f.rp || 0, autre - (f.dettes || 0), f.optRP);
    var P = Tp(Wt), Pp = Math.max(0, P - Ck - (f.impotEtranger || 0)), A = (f.cotes || 0) + (f.nonCotePassif || 0), N = 12 * revFn, pay = f.nonResident ? { paye: Pp, differe: 0 } : paiement(Pp, N, A);
    var r = f.sousMediane && HYP.paiement.sansInteretSousMediane ? 0 : HYP.paiement.tauxReel, cr20 = r > 0 ? pay.differe * (Math.pow(1 + r, 20) - 1) / r : 20 * pay.differe;
    return { W: W, P: P, Ck: Ck, Pprime: Pp, paye: pay.paye, differe: pay.differe, N: N, x: xN(N), partRevenu: N > 0 ? pay.paye / N : null, creance20: cr20, creance20Pct: W > 0 ? cr20 / W : 0,
             impotRevenus: 12 * impot, revenuRecu: 12 * recu, chargeTotale: 12 * impot + pay.paye, chargeTotalePct: recu > 0 ? (12 * impot + pay.paye) / (12 * recu) : null };
  }
  /** Ce que la v7.3 aurait fait payer au même foyer (€/an) : P(W) sans plancher ; 5 % du revenu sous la médiane (différé) ; au-dessus, plafond de 75 % du revenu, excédent reporté. */
  function foyerV73(f) {
    var s = Z.sched(), brutD = (f.div || 0) / 0.75, R = f.R || [0], revFn = V.menage(s, { revenus: R, capital: [brutD + (f.loyers || 0)] }, X.HYP.regle).revenu;
    var recu = R.reduce(function (a, x) { return a + x; }, 0) + (f.div || 0) + (f.loyers || 0), impot = 12 * (recu - revFn);
    var autre = (f.locatif || 0) + (f.cotes || 0) + (f.nonCotePassif || 0) + (f.nonCotePro || 0) + (f.terres || 0) + (f.foret || 0) + (f.art || 0) + (f.etranger || 0), W = Math.max(0, (f.rp || 0) + autre - (f.dettes || 0));
    var P = Z.Tp(W), paye = f.sousMediane ? Math.min(P, 0.05 * 12 * recu) : Math.max(0, Math.min(P, 0.75 * 12 * recu - impot));
    return { P: P, paye: paye, differe: P - paye };
  }

  // ======================================================================================================================================
  // 7. Cas types (ceux demandés le 06/11) et cas limites (liste de l'auteur, 06/11 nuit) — hypothèses de chaque cas dans son libellé (⚠️ V15306, illustratifs)
  // ======================================================================================================================================
  function ifi(base) { return Z.ifi(base); }
  var CAS = [
    // --- cas types demandés
    { id: 'grenoble_300k', lib: 'Résidence principale de 300 000 € à Grenoble, couple au revenu médian (2 × 2 000 €/mois), sans crédit', R: [2000, 2000], rp: 3e5, avant: { tf: 2650 } },
    { id: 'rp_1M', lib: 'Résidence principale de 1 M€, couple à 2 × 3 500 €/mois, sans crédit', R: [3500, 3500], rp: 1e6, avant: { tf: 2700 } },
    { id: 'actions_5M', lib: '5 M€ d\'actions cotées qui rapportent 3 % (12 500 €/mois de dividendes nets), sans autre revenu, pas de résidence', div: 12500, cotes: 5e6, avant: { ifi: 0 } },
    { id: 'holding_20M_cotee', lib: '20 M€ dans une holding passive (titres cotés) qui ne distribue rien, aucun autre revenu', nonCotePassif: 2e7, avant: { ifi: 0 } },
    { id: 'holding_20M_familiale', lib: '20 M€ de parts d\'une société familiale (le foyer n\'y travaille pas), via une holding qui ne distribue rien', nonCotePassif: 2e7, avant: { ifi: 0 } },
    { id: 'rentier_2M', lib: 'Rentier : 2 M€ d\'actions cotées, 5 000 €/mois de dividendes nets, sans résidence', div: 5000, cotes: 2e6, avant: { ifi: 0 } },
    { id: 'retraite_proprio_500k', lib: 'Retraité, 1 200 €/mois de pension, maison de 500 000 €', R: [1200], rp: 5e5, sousMediane: true, avant: { tf: 1350 } },
    // --- cas limites de l'auteur
    { id: 'retraite_grande_maison', lib: 'Retraité modeste (couple, 2 × 900 €/mois) dans la grande maison payée par une vie d\'épargne (1,2 M€)', R: [900, 900], rp: 1.2e6, sousMediane: true, avant: { tf: 3240 } },
    { id: 'heritier_sans_revenu', lib: 'Héritier sans revenu d\'activité (revenu minimum, 877 €/mois) d\'un appartement de 2 M€ qu\'il occupe', R: [0], rp: 2e6, sousMediane: true, avant: { tf: 5400, ifi: ifi(0.7 * 2e6) } },
    { id: 'agriculteur', lib: 'Agriculteur : terres d\'une valeur vénale de 2 M€, revenu 2 500 €/mois (valeur de rendement : 30 000 €/an / 4 % = 750 000 €), maison 250 000 €', R: [2500], rp: 2.5e5, terres: 7.5e5, terresVenale: 2e6, avant: { tf: 675 + 2000 } },
    { id: 'viticulteur', lib: 'Viticulteur en appellation prestigieuse : vignes de 6 M€ de valeur vénale, revenu 8 000 €/mois (valeur de rendement 96 000 € / 4 % = 2,4 M€), maison 500 000 €', R: [8000], rp: 5e5, terres: 2.4e6, terresVenale: 6e6, avant: { tf: 1350 + 6000 } },
    { id: 'chef_entreprise', lib: 'Chef d\'entreprise : société de 10 M€ où il travaille (bénéfice 500 000 €, après IS 375 000 € : valeur de rendement 9,4 M€ ; distribue 100 000 €/an ; salaire 8 000 €/mois), maison 1 M€', R: [8000], div: 100000 * 0.75 / 12, nonCotePro: 9.375e6, nonCoteVenale: 1e7, rp: 1e6, avant: { tf: 2700, ifi: ifi(0.7e6) } },
    { id: 'startup', lib: 'Fondateur de start-up : parts valorisées 30 M€ au dernier tour, aucune liquidité, salaire 4 000 €/mois ; valeur substantielle de ses parts 1 M€', R: [4000], nonCotePro: 1e6, nonCoteVenale: 3e7, avant: { ifi: 0 } },
    { id: 'jeune_endette', lib: 'Jeune ménage : appartement de 400 000 € acheté avec 380 000 € de crédit, 2 × 2 200 €/mois', R: [2200, 2200], rp: 4e5, dettes: 3.8e5, avant: { tf: 1080 } },
    { id: 'coproprietaire', lib: 'Copropriétaire à 50 % d\'un appartement de 600 000 € (l\'autre moitié à un tiers), 3 000 €/mois', R: [3000], rp: 3e5, avant: { tf: 810 } },
    { id: 'indivisaire', lib: 'Indivisaire non occupant : 1/3 d\'une maison héritée de 900 000 € (occupée par un frère, sans indemnité), RP de 400 000 €, 4 000 €/mois', R: [4000], rp: 4e5, locatif: 3e5, avant: { tf: 1080 + 810 } },
    { id: 'etranger', lib: 'Résident, villa de 800 000 € au Portugal (impôt foncier local IMI 0,3 % : 2 400 €/an, imputé) et RP de 500 000 € à Lyon, 6 000 €/mois', R: [6000], rp: 5e5, etranger: 8e5, impotEtranger: 2400, avant: { tf: 1350, ifi: 0 } },
    { id: 'crypto', lib: '3 M€ en cryptoactifs (valeur moyenne de l\'année), salaire 5 000 €/mois, locataire', R: [5000], cotes: 3e6, avant: { ifi: 0 } },
    { id: 'art', lib: 'Collectionneur : 5 M€ d\'œuvres d\'art, RP de 2 M€, 15 000 €/mois', R: [15000], rp: 2e6, art: 5e6, avant: { tf: 5400, ifi: ifi(1.4e6) } },
    { id: 'foret', lib: 'Forêt gérée de 100 ha (valeur vénale 500 000 €, revenu 5 000 €/an : valeur de rendement 125 000 €), RP de 300 000 €, 3 000 €/mois', R: [3000], rp: 3e5, foret: 1.25e5, foretVenale: 5e5, loyers: 5000 / 12, avant: { tf: 810 + 500 } },
    { id: 'non_resident', lib: 'Non-résident : appartement de 1 M€ à Paris loué 2 500 €/mois nets (imposé en France sur ce bien seul, sans différé)', nonResident: true, loyers: 2500, locatif: 1e6, avant: { tf: 2700, ifi: 0 } },
    { id: 'fractionnement_parent', lib: 'Fractionnement : parent seul avec 10 M€ (locatif 4 M€ à 2 %, titres 6 M€ à 3 %), avant donation', loyers: 4e6 * 0.02 / 12, div: 6e6 * 0.03 / 12, locatif: 4e6, cotes: 6e6, avant: { ifi: ifi(4e6) } },
    { id: 'fractionnement_enfant', lib: 'Fractionnement : chacun des trois enfants majeurs après donation (1/3 de tout, 3 000 €/mois de salaire chacun)', R: [3000], loyers: 4e6 * 0.02 / 36, div: 6e6 * 0.03 / 36, locatif: 4e6 / 3, cotes: 2e6, avant: { ifi: ifi(4e6 / 3) } }
  ];
  function casLimites(q) {
    return CAS.map(function (c) {
      var r = foyer(c, q), r3 = foyerV73(c), venal = null;
      if (c.terresVenale) venal = foyer(Object.assign({}, c, { terres: c.terresVenale }), q);
      if (c.nonCoteVenale) venal = foyer(Object.assign({}, c, { nonCotePro: c.nonCoteVenale }), q);
      if (c.foretVenale) venal = foyer(Object.assign({}, c, { foret: c.foretVenale }), q);
      var av = (c.avant.tf || 0) + (c.avant.ifi || 0);
      return { id: c.id, libelle: c.lib, v74: r, v73: r3, aujourdhui: av, sansRendement: venal };
    });
  }
  function casLimitesObjet(q) { var o = {}; casLimites(q).forEach(function (c) { o[c.id] = c; }); return o; }
  /** Charge (revenus + patrimoine payé) d'un rentier pur en % de son revenu (titres cotés : tout est payé). W en €, rendement r. */
  function chargeRentier(W, r) { var f = foyer({ div: W * r / 12, cotes: W }); return { part: f.chargeTotalePct, P: f.P, Pprime: f.Pprime, paye: f.paye }; }
  /** Cas types de la v7.3 (revenus) avec la fonction recalibrée. */
  function casTypesRevenus() { var base = X.casTypesObjet(HYP.bareme), v73 = X.casTypesObjet(Z.HYP.bareme), out = [];
    ['smic_seul', 'net_1500', 'net_2000', 'net_3000', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'sans_emploi', 'aah']
      .forEach(function (id) { var c = base[id]; out.push({ id: id, libelle: c.libelle, avant: c.avant, apres: c.apres, ecart: c.ecart, ecartPct: c.ecart / c.avant, ecartV73: v73[id].ecart }); });
    return out; }
  function tme() { return X.tme(HYP.bareme); }

  var VARIANTES = {
    A: { K: 1e6, bareme: { S: 412.5, mInf: 0.66, m0: 0.20, K: 1500, kappa: 1, enfant: 200, majParentIsole: 250 } },
    B: { K: 7e5, bareme: { S: 412.5, mInf: 0.65, m0: 0.20, K: 1500, kappa: 1, enfant: 200, majParentIsole: 250 } }
  };
  /** Bascule entre variantes (A : K = 1 M€ ; B : K = 700 000 €, recommandée) et vide les caches. */
  function variante(nom) { var v = VARIANTES[nom]; HYP.patrimoine.K = v.K; HYP.bareme = JSON.parse(JSON.stringify(v.bareme)); _b = {}; _e = {}; _comp = {}; return nom; }
  function formulePatrimoineCourte() { return 'τ(W) = 2 % × W / (W + ' + (HYP.patrimoine.K >= 1e6 ? (HYP.patrimoine.K / 1e6) + ' M€' : (HYP.patrimoine.K / 1e3) + ' k€') + ')'; }

  var API = { VARIANTES: VARIANTES, variante: variante, formulePatrimoineCourte: formulePatrimoineCourte, HYP: HYP, SCS: SCS, MACROS: MACROS, tauxMoyen: tauxMoyen, Tp: Tp, mp: mp, Wtaxable: Wtaxable, xN: xN, paiement: paiement, formulePatrimoine: formulePatrimoine, tablePatrimoine: tablePatrimoine,
              poidsQuartiles: poidsQuartiles, composantes: composantes, recettePatrimoine: recettePatrimoine, tresorerie: tresorerie, k1pc: k1pc, lignesPatrimoine: lignesPatrimoine,
              gainPatrimoineVsV73: gainPatrimoineVsV73, sched: sched, formule: formule, table: table, bilanRevenus: bilanRevenus, surplus: surplus, ecart: ecart, solde: solde,
              prelevementsDepenses: prelevementsDepenses, prelevementsObligatoires: prelevementsObligatoires, trajectoire: trajectoire, jalons: jalons, dette: dette, besoin: besoin, marge: marge,
              economiesPourStabiliser: economiesPourStabiliser, combinaison: combinaison, evaluer: evaluer, calibrer: calibrer, foyer: foyer, foyerV73: foyerV73, CAS: CAS, casLimites: casLimites,
              casLimitesObjet: casLimitesObjet, chargeRentier: chargeRentier, casTypesRevenus: casTypesRevenus, tme: tme };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0611V74 = API;
})(this);
