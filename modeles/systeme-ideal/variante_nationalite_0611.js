/*
 * modeles/systeme-ideal/variante_nationalite_0611.js — VARIANTE (06/11/2026), NON ADOPTÉE : impôt lié à la nationalité (impôt différentiel), taxe de sortie à la renonciation,
 * échange automatique d'informations, et fonction du patrimoine v7.5 recalculée avec une érosion « impôt bien conçu » (Advani et Tarrant, 2021).
 * Demande de l'auteur du 06/11/2026 ; texte : sources/impot-nationalite-et-erosion.md ; hypothèses HN1 à HN14 ; vérifications V18300 à V18399.
 *
 * Ce module ne modifie AUCUN module existant. Il change temporairement trois paramètres de la chaîne de comportement de la v7.4 (TaxePatrimoine.PARAM.central.erosionTop,
 * .erosionReste, TaxePatrimoine.COMMUN.partExil) le temps d'un calcul, dans un bloc try/finally qui les restaure, et contourne le cache de Decisions0611V74.composantes en
 * passant fTaux (même fonction de taux, sans mise en cache). Contrôle : avec les paramètres d'origine, on retrouve exactement Decisions0611V75.calage et la recette 62,52 Md€.
 *
 * Chaîne (identique à la v7.5) : recette = part RP nette + fonction statique × (nette / statique de la chaîne v7.4 au même t∞). Seule l'érosion du capital mobile change :
 *   e1 (érosion à 1 point, 1 % le mieux doté) = e1_ref × [ d × (1 − rDecl) + x × (1 − couv) + r ], avec d + x + r = 1 (décomposition en canaux, HN1) ;
 *   la part de l'exil dans l'érosion restante devient x × (1 − couv) / [ … ] (elle alimente le coût « autres impôts perdus » de la chaîne, H513).
 * Charger (jsc) : la liste de test_base_0611.js sans le test, puis ce fichier (ordre complet en tête de test_variante_nationalite_0611.js).
 * Euros 2024-2026, Md€/an (croisière). Des hypothèses et des ordres de grandeur, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var A = root.Decisions0611V74, V5 = root.Decisions0611V75, TP = root.TaxePatrimoine, B = root.BaseTravail0611;
  var NM = 30.9e6;

  // ======================================================================================================================================
  // 0. Données sourcées (cotes A-D dans sources/impot-nationalite-et-erosion.md)
  // ======================================================================================================================================
  var S = {
    // Français établis hors de France (registre consulaire, MEAE) : décret n° 2025-104 (population au 01/01/2025) ; rapport 2026 relayé par la presse (31/12/2025)
    inscrits20250101: 1741942, inscrits20251231: 1784975, estimationTotale: [2.8e6, 3.2e6],
    inscritsPays20251231: { suisse: 168881, etatsUnis: 168259, royaumeUni: 141242, belgique: 126452, canada: 119545 },
    // DGFiP via France Stratégie (2023), annexe 9 : départs de redevables ISF/IFI (milliers) et actif net imposable des partants (Md€), 2011-2021
    departs: { annees: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021], milliers: [0.53, 0.85, 1.14, 1.15, 0.98, 1.02, 0.76, 0.27, 0.29, 0.22, 0.27],
               actifMd: [3.8, 5.3, 5.5, 4.7, 3.6, 3.9, 2.3, 0.6, 1.1, 0.6, 1.0] },
    retoursMoyens: { isf2011_2016: 370, ifi2018_2021: 380 }, partSuisseDeparts: 0.19,
    // exit tax actuelle (art. 167 bis CGI) : réponse ministérielle, Sénat, QE n° 05844, 27/02/2020
    exitTaxEncaisse2012_2017: 0.138, exitTaxTheorique2017: 5.75,
    // États-Unis : seuils de la taxe de sortie (IRC § 877A ; instructions du formulaire 8854, 2025) ; renonciations 2025 (calcul : lignes des quatre listes trimestrielles du Federal Register)
    usPatrimoine: 2e6, usImpotMoyen2025: 206000, usExclusion2025: 890000, usRenonciations2025: 4745,
    // Base de travail du 06/11 (base_0611.js)
    manque: 52.1, v75: 62.52121796214634,
    // Advani et Tarrant (Fiscal Studies 42(3-4), 2021) : semi-élasticité 7 à 17 % par point pour un impôt bien conçu
    advaniTarrant: [0.17, 0.12, 0.07]
  };

  // ======================================================================================================================================
  // 1. Hypothèses
  // ======================================================================================================================================
  var HYP = {
    // HN1 : décomposition de l'érosion du capital mobile (chaîne v7.4) en trois canaux : exil x = 20/74 (H512, inchangé) ; réel (épargne, consommation, effet mécanique) r = 0,10
    //   (Brülhart et al. 2022 : ≤ 6 % d'épargne sur 79 % de réponse hors logement ≈ 8 % ; arrondi à 10 %) ; déclaratif d = 1 − x − r ≈ 0,63 (Brülhart : 49/79 ≈ 62 %).
    canaux: { exil: TP.COMMUN.partExil, reel: 0.10 },
    // HN2 : érosions de référence à 1 point (taxe_patrimoine.js, central) : 1 % le mieux doté 0,40 ; reste 0,15
    e1Ref: { top: 0.40, reste: 0.15 },
    // HN3 : leviers par scénario. rDecl = part du canal déclaratif supprimée (transparence des holdings, facturation électronique, données croisées, déclarations par des tiers) ;
    //   couv = part du canal des départs neutralisée (impôt différentiel lié à la nationalité + taxe de sortie à la renonciation).
    //   « seulNationalite » : l'impôt différentiel seul, sans gain déclaratif ; « courtTerme » : ce qu'on peut raisonnablement attendre avant renégociation des conventions.
    //   « AT » : leviers égaux (rDecl = couv) calculés pour atterrir sur 17 / 12 / 7 % (Advani et Tarrant) : ce sont les valeurs qu'il FAUT atteindre (hypothèse optimiste).
    scenarios: {
      reference:        { rDecl: 0,    couv: 0 },
      seulNationalite:  { rDecl: 0,    couv: 0.60 },
      courtTerme:       { rDecl: 0.30, couv: 0.30 }
    },
    // HN4 à HN9 : stock de Français déjà partis (recette hors modèle, qui ne recoupe pas l'érosion évitée) [bas, central, haut] (« bas » = recette la plus faible)
    //   HN4 ménages couverts par le volet patrimoine (patrimoine net ≥ 2 M€, ancien résident ≥ 6 ans sur 10 au départ, pays à fiscalité plus faible)
    menagesPatrimoine: [5000, 12000, 25000],
    //   HN5 forme de la queue : Pareto au-dessus de 2 M€ (α), tronquée à 5 Md€ ; α = 1,85 dans taxe_patrimoine.js (P95-P99) ; plus épais au sommet
    alpha: [1.9, 1.7, 1.5], wMin: 2e6, wMax: 5e9,
    //   HN6 part déjà taxée en France (immeubles situés en France des non-résidents, v7.4) ou crédit d'impôt étranger sur la fortune (Suisse surtout) : déduite
    creditFortune: [0.30, 0.20, 0.10],
    //   HN7 impôt plancher : part de P(W) couverte par la contribution sur les revenus du capital (v7.4 : 35 à 44 % ; on retient 40 % au central)
    plancher: [0.45, 0.40, 0.35],
    //   HN8 recouvrement effectif à l'étranger (actifs hors de France, absence d'assistance au recouvrement, contentieux) avant renégociation complète
    recouvrement: [0.30, 0.50, 0.70],
    //   HN9 volet revenus : ménages au-delà de 250 000 € de revenu par an, différentiel moyen d'impôt (€/an) après crédit des impôts et cotisations obligatoires étrangers
    menagesRevenus: [8000, 15000, 30000], differentielRevenu: [30000, 50000, 80000],
    // HN10 coût de gestion public : service dédié (ETP × coût complet) + systèmes, Md€/an
    gestion: { etp: [600, 400, 300], coutEtp: 0.00009, systemes: [0.03, 0.02, 0.01] },
    // HN11 taxe de sortie à la renonciation : renonciations de ménages couverts par an et impôt moyen (réalisation réputée des plus-values + soulte), €
    renonciations: [50, 150, 300], impotRenonciation: [300000, 600000, 1000000],
    // HN12 effet sur la recette du stock : réponse comportementale (renonciations, départs de non-nationaux, montages) déjà comprise dans le recouvrement (HN8)
    // HN13 externalité de l'exil (autres impôts perdus) : inchangée, 2,2 %/an (H513), appliquée à la seule part non couverte des départs (via partExil)
    // HN14 cas limites : statiques (charge en % du revenu), indépendants de l'érosion : repris de base_0611.js
    tInfs: [0.03, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06]
  };

  // ======================================================================================================================================
  // 2. Érosion par canaux
  // ======================================================================================================================================
  function facteur(lev) {
    var x = HYP.canaux.exil, r = HYP.canaux.reel, d = 1 - x - r;
    var reste = d * (1 - lev.rDecl) + x * (1 - lev.couv) + r;
    return { facteur: reste, partExil: reste > 0 ? x * (1 - lev.couv) / reste : 0, declaratif: d * (1 - lev.rDecl), exil: x * (1 - lev.couv), reel: r };
  }
  function erosions(lev) {
    var f = facteur(lev);
    return { top: HYP.e1Ref.top * f.facteur, reste: HYP.e1Ref.reste * f.facteur, partExil: f.partExil, canaux: f };
  }
  /** Leviers égaux (rDecl = couv = z) qui donnent une érosion à 1 point du 1 % égale à cible. */
  function leviersPour(cible) {
    var x = HYP.canaux.exil, r = HYP.canaux.reel, d = 1 - x - r, z = 1 - (cible / HYP.e1Ref.top - r) / (d + x);
    return { rDecl: z, couv: z };
  }
  function scenario(nom) {
    if (HYP.scenarios[nom]) return HYP.scenarios[nom];
    var m = /^AT(\d)$/.exec(nom); if (m) return leviersPour(S.advaniTarrant[+m[1]]);
    throw new Error('scénario inconnu : ' + nom);
  }
  var NOMS_SC = ['reference', 'seulNationalite', 'courtTerme', 'AT0', 'AT1', 'AT2'];
  var LIB_SC = { reference: 'référence (chaîne de la v7.4, e1 = 40 %)', seulNationalite: 'impôt différentiel seul (départs neutralisés à 60 %)',
                 courtTerme: 'court terme (30 % / 30 %)', AT0: 'bien conçu, bas (e1 = 17 %)', AT1: 'bien conçu, central (e1 = 12 %)', AT2: 'bien conçu, haut (e1 = 7 %)' };

  // ======================================================================================================================================
  // 3. Calage de la chaîne v7.4 sous une érosion donnée
  // ======================================================================================================================================
  var _cal = {};
  function calage(tInf, lev) {
    var e = erosions(lev), key = tInf + '|' + e.top + '|' + e.reste + '|' + e.partExil;
    if (_cal[key]) return _cal[key];
    var P = TP.PARAM.central, sv = { top: P.erosionTop, reste: P.erosionReste, exil: TP.COMMUN.partExil, t: A.HYP.patrimoine.tInf }, out;
    try {
      P.erosionTop = e.top; P.erosionReste = e.reste; TP.COMMUN.partExil = e.partExil; A.HYP.patrimoine.tInf = tInf;
      var r = A.HYP.patrimoine.recalage, pop = TP.population('pierreNet'), nH = NM / pop.length, w = 0;
      pop.forEach(function (h) { w += r * (h.immo + h.mobile) * nH; });
      var rc = A.recettePatrimoine('central', { fTaux: A.tauxMoyen }), stat = rc.tauxEffectif * w / 1e9;
      out = { ratio: rc.nette / stat, nette: rc.nette, statique: stat, erosionTop: rc.erosionTop, erosionReste: rc.erosionReste, exil: rc.exil, e1: e };
    } finally {
      P.erosionTop = sv.top; P.erosionReste = sv.reste; TP.COMMUN.partExil = sv.exil; A.HYP.patrimoine.tInf = sv.t;
    }
    return (_cal[key] = out);
  }
  /** Recette de la fonction du patrimoine v7.5 (configuration c) sous les leviers lev : même chaîne que V5.recette, ratio recalé. */
  function recette(c, lev) {
    var r = V5.recette(c), cal = calage(c.tInf, lev), fNet = r.fonctionStatique * cal.ratio, diff = r.differe / r.ratioCalage * cal.ratio, tot = r.rpNette + fNet;
    return { config: c, rpNette: r.rpNette, fonctionStatique: r.fonctionStatique, fonctionNette: fNet, differe: diff, encaisse: tot - diff, totale: tot,
             deltaV75: tot - S.v75, partManque: (tot - S.v75) / S.manque, erosionTop: cal.erosionTop, e1Top: cal.e1.top, partExil: cal.e1.partExil, exil: cal.exil, ratio: cal.ratio };
  }
  function configV75() { return JSON.parse(JSON.stringify(B.S.v75)); }
  /** Grille t∞ × K minimal (contrainte dure de la v7.5, statique, indépendante de l'érosion) sous les leviers lev. */
  var _K = {};
  function kMin(t) { if (_K[t] === undefined) _K[t] = B.kMinimal(t); return _K[t]; }
  function grille(lev) {
    return HYP.tInfs.map(function (t) { var K = kMin(t), c = { regime: 'RP', X: 1e6, tInf: t, K: K, payeProrata: true, plancherPro: true }; var r = recette(c, lev); r.K = K; return r; });
  }
  function meilleur(lev) { var g = grille(lev), b = g[0]; g.forEach(function (r) { if (r.totale > b.totale) b = r; }); return b; }
  /** Cas limites au-delà de 100 % du revenu (charge payée et charge due) pour une configuration. */
  function casAuDela(c) {
    return B.casLimites(c).filter(function (x) { return (x.charge !== null && x.charge > 1) || (x.chargeDue !== null && x.chargeDue > 1); });
  }

  // ======================================================================================================================================
  // 4. Impôt différentiel sur le stock des Français déjà partis (hors modèle domestique)
  // ======================================================================================================================================
  /** Moyenne de P(W) (fonction v7.5) sur une loi de Pareto (wMin, α) tronquée à wMax : intégration numérique en log. */
  function moyennePareto(alpha, c) {
    var a = Math.log(HYP.wMin), b = Math.log(HYP.wMax), n = 4000, h = (b - a) / n, num = 0, den = 0, mW = 0;
    for (var i = 0; i <= n; i++) {
      var lw = a + i * h, W = Math.exp(lw), f = alpha * Math.pow(HYP.wMin, alpha) * Math.pow(W, -alpha - 1) * W, k = (i === 0 || i === n) ? 0.5 : 1;
      num += k * f * V5.Pf(W, c); den += k * f; mW += k * f * W;
    }
    return { P: num / den, W: mW / den };
  }
  function differentiel(c) {
    c = c || configV75();
    var out = [0, 1, 2].map(function (k) {
      var m = moyennePareto(HYP.alpha[k], c);
      var pat = HYP.menagesPatrimoine[k] * m.P * (1 - HYP.creditFortune[k]) * (1 - HYP.plancher[k]) * HYP.recouvrement[k] / 1e9;
      var rev = HYP.menagesRevenus[k] * HYP.differentielRevenu[k] * HYP.recouvrement[k] / 1e9;
      var ren = HYP.renonciations[k] * HYP.impotRenonciation[k] / 1e9;
      var ges = HYP.gestion.etp[k] * HYP.gestion.coutEtp + HYP.gestion.systemes[k];
      return { patrimoineMoyen: m.W, impotMoyenDu: m.P, patrimoine: pat, revenus: rev, renonciation: ren, gestion: ges, net: pat + rev + ren - ges };
    });
    return { bas: out[0], central: out[1], haut: out[2] };
  }
  /** Stock net de redevables ISF/IFI partis (2011-2021), départs moins retours moyens (calcul) ; actif net moyen des partants (Md€ / milliers). */
  function stockDeparts() {
    var d = S.departs, dep = 0, act = 0, ret = 0;
    d.annees.forEach(function (y, i) { dep += d.milliers[i] * 1000; act += d.actifMd[i]; ret += y <= 2016 ? S.retoursMoyens.isf2011_2016 : (y === 2017 ? (S.retoursMoyens.isf2011_2016 + S.retoursMoyens.ifi2018_2021) / 2 : S.retoursMoyens.ifi2018_2021); });
    return { departs: dep, retours: ret, net: dep - ret, actifPartants: act, actifMoyen: act * 1e9 / dep };
  }

  var API = { S: S, HYP: HYP, facteur: facteur, erosions: erosions, leviersPour: leviersPour, scenario: scenario, NOMS_SC: NOMS_SC, LIB_SC: LIB_SC,
              calage: calage, recette: recette, configV75: configV75, grille: grille, meilleur: meilleur, kMin: kMin, casAuDela: casAuDela,
              moyennePareto: moyennePareto, differentiel: differentiel, stockDeparts: stockDeparts };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.VarianteNationalite0611 = API;
})(this);
