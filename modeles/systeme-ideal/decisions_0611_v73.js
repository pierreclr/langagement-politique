/*
 * modeles/systeme-ideal/decisions_0611_v73.js — v7.3 PROPOSÉE (06/11/2026), NON ADOPTÉE : à valider par l'auteur. Part de la v7.2 adoptée (decisions_0611_v72.js) et ne change que deux choses.
 *   (1) Fonction du patrimoine lisible et cohérente (demande de l'auteur du 06/11) : un TAUX MOYEN continu, nul au premier euro, ≈ 0,5 % vers 300 000 € (niveau d'une taxe foncière de
 *       résidence principale), 1 % à 1 M€, 2 % pour les très grandes fortunes (l'équivalent d'une « taxe Zucman », continue, sans seuil à 100 M€) :
 *         τ(W) = 2 % × W / (W + 1 M€)   ;   P(W) = τ(W) × W = 2 % × W² / (W + 1 M€)   (€/an, par ménage, valeur nette W de l'immobilier et des parts de sociétés, résidence principale comprise).
 *       Taux marginal : 2 % × (1 − (1 M€ / (W + 1 M€))²), de 0 au premier euro à 2 % à l'infini, jamais au-dessus : ni seuil ni marche.
 *       Recette calculée par composante (immobilier, capital mobile du 1 % le mieux doté, reste), avec l'érosion de taxe_patrimoine.js ménage par ménage (loi exponentielle de
 *       grandes_fortunes_0511.js HG08, égale à la loi linéaire de taxe_patrimoine.js à 1 %) et l'exil (part 20 / 74, CAE Focus n° 118 ; externalité 2,2 %/an, H512-H513).
 *   (2) Usage du surplus de recette par rapport à la v7.2 : d'abord le manque de la dette (économies constantes encore nécessaires après la combinaison recommandée, macro de référence),
 *       ensuite un allègement de la fonction des revenus (même forme, paramètres recalibrés, H73.4).
 *   Tout le reste est la v7.2 : DMTG au droit actuel, DMTO supprimés, holdings (N14), trusts (N15) et SCI (N16) au prorata, plafonds (N09) au prorata, N03 retirée, N05 non comptée,
 *   paiement différé (5 % du revenu sous la médiane), construction du solde (v5.10 à 42 % + écart constant dès 2029), dette, leviers.
 * Euros de 2025-2026 ; €/mois pour les cas types, Md€/an pour les masses. Des hypothèses et des ordres de grandeur, jamais des prédictions. Ne modifie AUCUN module existant.
 * Charger (depuis modeles/systeme-ideal/, jsc) : la liste de test_decisions_0611_v72.js jusqu'à decisions_0611_v72.js, puis decisions_0611_v73.js (ordre complet en tête de test_decisions_0611_v73.js).
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  function need(n, f) { return root[n] || (req ? req(f) : null); }
  var Y = need('Decisions0611V72', './decisions_0611_v72.js'), X = need('BaremeV71', './bareme_v71.js'), W7 = need('BaremeDeuxFonctionsV7', './bareme_deux_fonctions_v7.js');
  var V = need('BaremeUniqueV6', './bareme_unique_v6.js'), J = need('Decisions0511j', './decisions_0511j.js'), H = need('Decisions0511h', './decisions_0511h.js');
  var DS = need('VarianteDetteStable', './variante_dette_stable.js'), TP = need('TaxePatrimoine', './taxe_patrimoine.js'), M = need('SystemeIdeal', './modele.js');
  var CT = root.CAS_TYPES_DONNEES || (req ? req('../gagnants-perdants/cas_types_donnees.js') : null);
  var SCS = ['bas', 'central', 'haut'], MACROS = ['prudente', 'reference', 'favorable'];

  var HYP = {
    tRef: 0.42, annee1: 2029, anneeFin: 2070,
    // H73.1 : fonction du patrimoine. Taux moyen τ(W) = tInf × W / (W + K) : une seule échelle K, choisie pour les repères de l'auteur (0,46 % à 300 000 €, 1 % à 1 M€, 1,98 % à 100 M€) ;
    //   K = 900 000 € donnerait 0,50 % à 300 000 € et 1,05 % à 1 M€ (variante). tInf = 2 % (taux du projet Zucman). Recalage HVP sur les comptes nationaux × 1,4 (taxe_patrimoine.js H505) ⚠️ V15106
    patrimoine: { tInf: 0.02, K: 1e6, recalage: 1.4 },   // ⚠️ V15205 : le recalage proportionnel pousse les ménages moyens vers le haut d'une courbe progressive
    // H73.2 : érosion du capital mobile ménage par ménage, e(τ) = 1 − (1 − e1)^(τ / 1 %), e1 = érosion de taxe_patrimoine.js à 1 % (top 1 % : 74 / 40 / 20 % ; reste : 30 / 15 / 5 %) ;
    //   loi exponentielle de grandes_fortunes_0511.js (HG08) : égale à la loi linéaire à 1 %, plus faible au-delà (la loi linéaire atteindrait 80 % au central à 2 %). ⚠️ V15200
    //   Immobilier : pas d'érosion (immobile), effet de prix de taxe_patrimoine.js au taux effectif immobilier. Part du capital mobile détenue par le 1 % : 50 % (H509).
    loiErosion: 'exponentielle',
    // H73.3 : usage du surplus par rapport à la v7.2 : d'abord le manque de la dette (combinaison recommandée R1f + M1m + M2m + M3, macro de référence, comportements centraux),
    //   le reste en allègement de la fonction des revenus
    // H73.4 : fonction des revenus recalibrée (même forme ; recherche sur grille, calibrer()) : bas revenus entre +20 et +80 €/mois, rentiers perdants (revenus ET patrimoine), TME ≤ 75 %,
    //   recette de la fonction ≥ surplus de la v7.2 − (gain du patrimoine − manque de la dette) ; parmi les admissibles, le plus proche de −2 % pour les cadres à 10 000 et 20 000 € brut.
    //   Retenu : S = 412,5 €, m∞ = 65,5 %, m0 = 26,25 %, K = 2 000 €/mois (tous les bas revenus dans la cible ; cadre à 10 000 € −2,9 % ; à 20 000 € −0,4 %, hors cible comme en v7.2)
    bareme: { S: 412.5, mInf: 0.655, m0: 0.2625, K: 2000, kappa: 1, enfant: 200, majParentIsole: 250 },
    remplacees: 42.94 + 2.68 + 16.10,     // taxe foncière + IFI + DMTO (bilan global)
    // H73.5 : cas types patrimoniaux nouveaux (⚠️ V15201, V15204) : Grenoble : taxe foncière actuelle de 2 650 €/an (montant rapporté, non vérifié ; le modèle de la v7.2 en estime 1 836 pour 90 m²) ;
    //   retraité propriétaire : maison de 500 000 €, pension de 1 200 € nets, taxe foncière actuelle au taux moyen de 0,27 % ; famille : couple médian avec 2 enfants, bien de 400 000 €,
    //   140 000 € de capital restant dû (prêt de 320 000 € sur 25 ans, 10 ans remboursés) ; 20 M€ : résidence 2 M€, immobilier locatif 3 M€, parts de sociétés 15 M€, dividendes 3 % des parts,
    //   loyers nets 2 % du locatif (taxe_patrimoine.js H508), IFI au barème de l'art. 977 du CGI (résidence abattue de 30 %), taxe foncière 0,27 %
    grenobleTF: 2650, tfMoyen: 0.0027,
    retraiteProprio: { maison: 5e5, pension: 1200 },
    familleProprio: { bien: 4e5, crd: 1.4e5 },
    fortune20: { rp: 2e6, locatif: 3e6, parts: 15e6, rendementParts: 0.03, rendementLocatif: 0.02 },
    // H73.6 : plafonds de la v7.2 conservés : 5 % du revenu sous la médiane (paiement différé) ; au-dessus, total des prélèvements de l'année ≤ 75 % du revenu, excédent reporté (N09)
    plafondAnnuel: 0.75, plafondBas: 0.05,
    // H73.7 : le plafond de 75 % mord beaucoup plus qu'en v7.2 (taux de 2 % + fonction des revenus jusqu'à 66 % sur le capital). Excédent calculé ménage par ménage sur la population HVP
    //   recalée : revenu imposable = r × W (r = 5 / 4 / 3 % : revenus du capital, travail et bénéfices imputés des holdings ; ⚠️ V15202), partagé entre 1,7 adulte (grandes_fortunes_0511.js HG02),
    //   prélevé par la fonction des revenus ; excédent ramené à l'assiette après valorisation et érosion (rapport brute / comptable) ; part du report recouvrée à la vente ou à la transmission
    //   75 / 50 / 25 % (le plafond de 50 % tous impôts confondus à la transmission en limite la récupération ; ⚠️ V15203). Remplace la ligne N09 au prorata quand il est plus coûteux.
    plafondSommet: { r: { bas: 0.05, central: 0.04, haut: 0.03 }, recouvrement: { bas: 0.75, central: 0.50, haut: 0.25 }, adultes: 1.7, menages: 30.9e6 },
    combinaison: ['R1f', 'M1m', 'M2m', 'M3']
  };
  var SC_TP = { bas: 'haut', central: 'central', haut: 'bas' };   // taxe_patrimoine.js nomme « bas » le moins favorable : on croise (comme la v7.2)

  // ======================================================================================================================================
  // 1. Fonction du patrimoine v7.3
  // ======================================================================================================================================
  function tauxMoyen(W) { var P = HYP.patrimoine; return W <= 0 ? 0 : P.tInf * W / (W + P.K); }
  function Tp(W) { return W <= 0 ? 0 : tauxMoyen(W) * W; }
  function mp(W) { var P = HYP.patrimoine; if (W <= 0) return 0; var q = P.K / (W + P.K); return P.tInf * (1 - q * q); }
  function taxePatrimoine(rp, autre) { return Tp(rp + (autre || 0)); }
  function formulePatrimoine() { var P = HYP.patrimoine; return 'τ(W) = ' + (100 * P.tInf) + ' % × W / (W + ' + (P.K / 1e6) + ' M€) ; P(W) = τ(W) × W'; }
  function tablePatrimoine(pts) { return (pts || [5e4, 1e5, 3e5, 1e6, 3e6, 1e7, 1e8, 1e9]).map(function (W) { var t = Tp(W); return { W: W, taxe: t, tauxMoyen: t / W, marginal: mp(W) }; }); }
  function erosion(tau, e1) { return HYP.loiErosion === 'lineaire' ? Math.min(1, e1 * tau / 0.01) : 1 - Math.pow(1 - e1, tau / 0.01); }

  var _comp = {};
  /** Taux effectifs par composante sur la population HVP recalée (2 000 quantiles, assiette nette) et facteurs d'érosion du capital mobile (scénario de taxe_patrimoine.js s). */
  function composantes(s) {
    if (_comp[s]) return _comp[s];
    var pop = TP.population('pierreNet'), r = HYP.patrimoine.recalage, p = TP.PARAM[s], o = { im: 0, imT: 0, w: 0, wT: 0 }, g = { top: { m: 0, mT: 0, mTe: 0, mE: 0 }, reste: { m: 0, mT: 0, mTe: 0, mE: 0 } };
    pop.forEach(function (h) {
      var w = r * (h.immo + h.mobile), t = tauxMoyen(w), im = r * h.immo, mo = r * h.mobile, G = h.p >= 0.99 ? g.top : g.reste, e = erosion(t, h.p >= 0.99 ? p.erosionTop : p.erosionReste);
      o.im += im; o.imT += t * im; o.w += w; o.wT += t * w;
      G.m += mo; G.mT += t * mo; G.mTe += t * mo * (1 - e); G.mE += mo * e;
    });
    var out = { tauxEffectif: o.wT / o.w, tauxImmo: o.imT / o.im,
                top: { taux: g.top.mT / g.top.m, rendement: g.top.mTe / g.top.m, erosion: g.top.mE / g.top.m },
                reste: { taux: g.reste.mT / g.reste.m, rendement: g.reste.mTe / g.reste.m, erosion: g.reste.mE / g.reste.m } };
    return (_comp[s] = out);
  }
  /**
   * Recette nette (Md€/an, croisière) : même chaîne que taxe_patrimoine.js recette() (assiette nette, valorisations, effet de prix, érosion, exil, gestion, paiement différé, DMTO déjà déduits),
   * avec les taux par composante. Contrôle : avec un taux plat de 1 %, on retrouve taxe_patrimoine.js (test).
   */
  function recettePatrimoine(sc, fTaux) {
    var s = SC_TP[sc || 'central'], p = TP.PARAM[s], C = TP.COMMUN, c = TP.composantes('pierreNet'), k = fTaux ? composantesTaux(s, fTaux) : composantes(s);
    var dp = TP.effetPrix(s, k.tauxImmo), immoNet = c.immo - c.dettes;
    var baseImmo = Math.max(0, immoNet) * p.valImmo * (1 + dp) + c.terres * p.valTerres * (1 + dp);
    var mobileAvant = c.actions * p.partCotees + c.opc + c.actions * (1 - p.partCotees) * p.valNonCotees + Math.min(0, immoNet), f = C.partTop1Mobile;
    var bruteImmo = k.tauxImmo * baseImmo, bruteMob = mobileAvant * (f * k.top.rendement + (1 - f) * k.reste.rendement), brute = bruteImmo + bruteMob;
    var erode = mobileAvant * (f * k.top.erosion + (1 - f) * k.reste.erosion), exil = C.partExil * erode * C.externalite, gestion = p.coutGestion * brute;
    var differe = brute * C.eligibleDiffere * p.recours, perteDiffere = differe * (1 - p.recouvrement);
    return { brute: brute, bruteImmo: bruteImmo, bruteMobile: bruteMob, exil: exil, gestion: gestion, differe: differe, perteDiffere: perteDiffere, nette: brute - exil - gestion - perteDiffere,
             tauxEffectif: k.tauxEffectif, tauxImmo: k.tauxImmo, erosionTop: k.top.erosion, erosionReste: k.reste.erosion, effetPrix: dp, mobileAvant: mobileAvant, baseImmo: baseImmo };
  }
  /** Variante de composantes() pour une fonction de taux quelconque (contrôles et sensibilités ; sans cache). */
  function composantesTaux(s, fTaux) {
    var keep = tauxMoyen, kc = _comp; tauxMoyen = fTaux; _comp = {};
    try { return composantes(s); } finally { tauxMoyen = keep; _comp = kc; }
  }
  var _pl = {};
  /** Plafond de 75 % au sommet (H73.7) : excédent mécanique (Md€/an), ménages concernés, part perdue après report (Md€/an, > 0 = recette perdue). */
  function plafondSommet(sc) {
    var s = sc || 'central'; if (_pl[s]) return _pl[s];
    var P = HYP.plafondSommet, pop = TP.population('pierreNet'), nH = P.menages / pop.length, b = sched(), r = P.r[s], ex = 0, comptable = 0, nb = 0;
    pop.forEach(function (h) {
      var w = HYP.patrimoine.recalage * (h.immo + h.mobile), y = r * w, t = P.adultes * 12 * (b.T(y / 12 / P.adultes) - b.S), p = Tp(w), e = Math.max(0, t + p - HYP.plafondAnnuel * y);
      ex += e * nH; comptable += p * nH; if (e > 0) nb += nH;
    });
    var rp = recettePatrimoine(s), apresAssiette = ex / 1e9 * rp.brute / (comptable / 1e9);
    return (_pl[s] = { excedentMecanique: ex / 1e9, menages: nb, excedent: apresAssiette, perte: apresAssiette * (1 - P.recouvrement[s]), report: apresAssiette * P.recouvrement[s] });
  }
  function k1pc() { return recettePatrimoine('central').tauxEffectif / 0.01; }
  /** Volet patrimoine (Md€/an) par rapport à la v5.10, ligne par ligne (mêmes lignes que la v7.2 ; seule la taxe annuelle et les prorata changent). */
  function lignesPatrimoine(sc) {
    var p510 = W7.NEUTRALITE.patrimoine510, k = k1pc(), rp = recettePatrimoine(sc).nette, H72 = Y.HYP;
    var l = {
      taxeAnnuelle: rp - p510.N07_taxe_1pc,
      dmtgGardes: W7.NEUTRALITE.dmtgConserves - p510.N06_transmissions,
      dmto: -W7.NEUTRALITE.remplacees.dmto - p510.N08_reforme_immo,
      realisation: -p510.N05_realisation_pv,
      plafonds: Math.min(H72.n09 * k, -plafondSommet(sc).perte) - p510.N09_plafonds,   // H73.7
      holdings: H72.n14 - p510.N14_holdings_passifs,
      trusts: H72.n15 * k - p510.N15_trusts_sci,
      sci: H72.n16 * k - p510.N16_sci
    };
    var tot = 0, x; for (x in l) tot += l[x]; l.total = tot; l.recetteTaxe = rp;
    return l;
  }
  /** Gain de solde du volet patrimoine par rapport à la v7.2 (Md€/an). */
  function gainPatrimoineVsV72(sc) { return lignesPatrimoine(sc).total - Y.lignesPatrimoine(sc).total; }

  // ======================================================================================================================================
  // 2. Fonction des revenus recalibrée
  // ======================================================================================================================================
  function sched() { return X.sched(HYP.bareme); }
  function formule() { var C = HYP.bareme; return 'B(R) = ' + C.S + ' + ' + Math.round((C.mInf - C.m0) * C.K) + ' × (1 − e^(−R/' + C.K + ')) − ' + C.mInf + ' × R'; }
  function table(pts) { return V.table(sched(), pts || [0, 1000, 2000, 3000, 5000, 8000, 10000, 50000]).map(function (l) { return { R: l.R, du: -l.B, reste: l.net, tauxMoyen: l.R > 0 ? -l.B / l.R : null, marginal: l.marginal }; }); }
  var _b = {};
  function bilanRevenus(sc) { var s = sc || 'central'; return _b[s] || (_b[s] = X.bilan(HYP.bareme, s)); }
  function surplus(sc) { return bilanRevenus(sc).ecart; }
  /** Manque de la dette de la v7.2 (économies constantes encore nécessaires après la combinaison recommandée, macro de référence). */
  var _m72 = null;
  function manqueV72() { return _m72 === null ? (_m72 = Y.combinaison(HYP.combinaison).manque.reference) : _m72; }
  /** Répartition du surplus de recette par rapport à la v7.2 (central) : dette d'abord, puis allègement de la fonction des revenus. */
  function repartition() {
    var g = gainPatrimoineVsV72('central'), m = manqueV72(), allege = Y.surplus('central') - surplus('central');
    return { gainPatrimoine: g, manqueDette: m, disponiblePourRevenus: g - m, allegementRevenus: allege, resteAuDeficit: g - allege };
  }
  /**
   * Recherche sur grille de la fonction des revenus (H73.4) : contraintes de bareme_v71.js (bas ≥ +20 €, rentiers ≤ 0, TME ≤ 75 %), recette de la fonction (écart au droit actuel)
   * ≥ cible ; score = distance au ciblage validé (bas ≤ +80 €, cadres à 10 000 et 20 000 € brut à −2 %) + pénalité sur la recette au-dessus de la cible.
   */
  function calibrer(cible, grille) {
    var g = grille || { S: [400, 412.5, 425], mInf: [0.60, 0.61, 0.62, 0.63, 0.64], m0: [0.15, 0.175, 0.20, 0.225, 0.25], K: [1000, 1250, 1500, 1750, 2000] }, best = null, n = 0;
    g.S.forEach(function (S) { g.mInf.forEach(function (mi) { g.m0.forEach(function (m0) { g.K.forEach(function (K) {
      var q = { S: S, mInf: mi, m0: m0, K: K, kappa: 1, enfant: 200, majParentIsole: 250 }, r = evaluer(q, cible);
      if (r) { n++; if (!best || r.score < best.score) { best = r; best.q = q; } }
    }); }); }); });
    if (best) best.admissibles = n;
    return best;
  }
  function evaluer(q, cible) {
    var c = X.casTypesObjet(q), bas = ['smic_seul', 'parent_isole_smic', 'couple_2smic_2enf', 'net_1500', 'net_1750'].map(function (k) { return c[k].ecart; });
    // rentiers : « le rentier ne gagne pas », revenus ET patrimoine (la v7.1 ne regardait que les revenus) : 2 M€ de parts pour 5 000 € de dividendes, 1 M€ pour 2 500 € (rendement 3 %)
    var rd = c.rentier_div_5000.ecart - Tp(2e6) / 12, rm = c.rentier_mixte_5000.ecart - Tp(1e6) / 12;
    if (!bas.every(function (e) { return e >= 20; }) || rd > 0 || rm > 0) return null;
    var b = X.bilan(q, 'central').ecart; if (b < cible - 0.5) return null;
    var tm = X.tme(q).max.taux; if (tm > 0.75) return null;
    var h10 = c.cadre_10000.ecart / c.cadre_10000.avant, h20 = c.cadre_20000.ecart / c.cadre_20000.avant;
    var dist = bas.reduce(function (a, e) { return a + Math.max(0, e - 80) / 30; }, 0) + Math.max(0, Math.abs(h10 + 0.02) - 0.01) / 0.01 + Math.max(0, Math.abs(h20 + 0.02) - 0.01) / 0.01;
    return { score: dist + Math.max(0, b - cible) / 5, distance: dist, ecart: b, tme: tm, h10: h10, h20: h20, bas: bas };
  }

  // ======================================================================================================================================
  // 3. Écart à la v5.10, solde, prélèvements obligatoires (même construction que la v7.2)
  // ======================================================================================================================================
  var _e = {};
  function ecart(sc) {
    var s = sc || 'central'; if (_e[s]) return _e[s];
    var b = bilanRevenus(s), lp = lignesPatrimoine(s), cd = W7.NEUTRALITE.capitalDepart510, h = Y.n03(s), rev = b.actifs + b.retraitesCapital + b.is + b.retenue;
    return (_e[s] = { revenus: rev, actifs: b.actifs, retraitesCapital: b.retraitesCapital, is: b.is, retenue: b.retenue, patrimoine: lp.total, lignesPatrimoine: lp,
                      capitalDepart: cd, n03: -h, total: rev + lp.total + cd - h, detail: b.detail });
  }
  function solde(sc, an) { return J.solde(sc, an, HYP.tRef) + (an < HYP.annee1 ? 0 : ecart(sc).total); }
  function prelevementsDepenses(sc) {
    var s = sc || 'central', e = ecart(s), d = e.detail, mj = J.mesure(HYP.tRef, s), bonus = mj.cout, reprise = mj.recette;
    var dT = d.haut - d.bas - d.fermeture + reprise - bonus, dPO = dT + e.retraitesCapital + e.is + e.retenue + e.n03 + e.patrimoine, dDep = d.socle + d.enfants + d.plancher - bonus + reprise - e.capitalDepart;
    return { dT: dT, dPO: dPO, dDep: dDep, socle: d.socle, enfants: d.enfants, plancher: d.plancher, bonus: bonus, reprise: reprise, controle: dPO - dDep - e.total };
  }
  function prelevementsObligatoires() {
    var B = Y.BILAN510, pd = prelevementsDepenses('central'), po = B.po + pd.dPO, tr = pd.socle + pd.enfants + pd.plancher - pd.bonus + pd.reprise - W7.NEUTRALITE.capitalDepart510;
    return { avantPct: B.poAvant / B.pib, v510Pct: B.po / B.pib, v72Pct: Y.prelevementsObligatoires().pct, po: po, pct: po / B.pib, poNet: B.poNet + pd.dPO - tr, pctNet: (B.poNet + pd.dPO - tr) / B.pib, dPO: pd.dPO };
  }

  // ======================================================================================================================================
  // 4. Dette, économies, combinaison (variante_dette_stable.js, comme la v7.2)
  // ======================================================================================================================================
  function net(lev) { return function (s, y) { return H.net(s, y) + (y < HYP.annee1 ? 0 : J.residu(HYP.tRef, s) + ecart(s).total + (lev ? lev(s, y) : 0)); }; }
  function trajectoire(sc, macro, lev) { return DS.trajectoire(sc || 'central', { taux: HYP.tRef, macro: macro, net: net(lev) }); }
  function jalons(sc, macro, lev) { return DS.jalons(trajectoire(sc, macro, lev)); }
  function dette() { var o = {}; MACROS.forEach(function (m) { o[m] = {}; SCS.forEach(function (s) { o[m][s] = jalons(s, m); }); }); return o; }
  function besoin(sc, macro, lev) {
    var ok = function (x) { var tr = trajectoire(sc, macro, function (s, y) { return (lev ? lev(s, y) : 0) + x; }); return Math.max.apply(null, tr.ratio.slice(0, 30)) <= tr.ratio0 + 1e-9; };
    if (ok(0)) return 0; var lo = 0, hi = 500, k; if (!ok(hi)) return null;
    for (k = 0; k < 50; k++) { var m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    return hi;
  }
  function economiesPourStabiliser(sc, macro) { return besoin(sc, macro, null); }
  function combinaison(ids) {
    var lv = Y.leviers(ids || HYP.combinaison), out = { ids: ids || HYP.combinaison, rendement: {}, dette: {}, manque: {} };
    [2030, 2035, 2040, 2060].forEach(function (y) { out.rendement[y] = lv('central', y); });
    MACROS.forEach(function (m) { out.dette[m] = jalons('central', m, lv); out.manque[m] = besoin('central', m, lv); });
    return out;
  }

  // ======================================================================================================================================
  // 5. Cas types (écart au droit actuel, €/mois) : ceux de la v7.2 + quatre cas patrimoniaux
  // ======================================================================================================================================
  /** IFI (€/an) au barème de l'art. 977 du CGI (2025) : 0,5 % de 0,8 à 1,3 M€, 0,7 % jusqu'à 2,57 M€, 1 % jusqu'à 5 M€, 1,25 % jusqu'à 10 M€, 1,5 % au-delà ; seuil 1,3 M€ (décote ignorée au-delà de 1,4 M€). */
  function ifi(base) {
    if (base < 1.3e6) return 0;
    var tr = [[8e5, 1.3e6, 0.005], [1.3e6, 2.57e6, 0.007], [2.57e6, 5e6, 0.01], [5e6, 1e7, 0.0125], [1e7, Infinity, 0.015]], t = 0;
    tr.forEach(function (x) { if (base > x[0]) t += (Math.min(base, x[1]) - x[0]) * x[2]; });
    if (base < 1.4e6) t -= 17500 - 0.0125 * base;
    return t;
  }
  function casTypes() {
    var s = sched(), base = X.casTypesObjet(HYP.bareme), out = [], v72 = Y.casTypesObjet();
    function push(id, lib, av, ap, extra) {
      var e = av === null ? null : ap - av, o = { id: id, libelle: lib, avant: av, apres: ap, ecart: e, ecartPct: av ? e / av : null, ecartV72: v72[id] ? v72[id].ecart : null };
      var k; for (k in (extra || {})) o[k] = extra[k]; out.push(o); return o;
    }
    ['smic_seul', 'net_1500', 'net_2000', 'net_3000', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'sans_emploi', 'aah']
      .forEach(function (id) { var c = base[id]; push(id, c.libelle, c.avant, c.apres); });
    var ind = CT.filter(function (c) { return c.id === 'independant'; })[0], Ri = ind.micro_ca * (1 - ind.charges_reelles_part);
    push('independant', 'Indépendant (micro-entrepreneur libéral, 3 000 € de chiffre d\'affaires, R = ' + Ri + ' €)', ind.actuel.revenu_disponible, V.menage(s, { revenus: [Ri] }, X.HYP.regle).revenu);
    // rentier : plafond de 75 % du revenu reçu (5 000 €), excédent reporté (H73.6)
    var rd = base.rentier_div_5000, partsR = 5000 * 12 / Y.HYP.rendementActions, taxeR = taxePatrimoine(0, partsR) / 12, chR = 5000 - rd.apres + taxeR, payeR0 = Math.min(chR, HYP.plafondAnnuel * 5000);
    push('rentier', 'Rentier, 5 000 €/mois de dividendes (2 M€ de parts), revenus et patrimoine', rd.avant, 5000 - payeR0,
         { voletRevenus: rd.apres - rd.avant, taxePatrimoineMois: taxeR, chargeAvantPlafond: chR / 5000, reporteMois: chR - payeR0 });
    [1200, 2000, 4000].forEach(function (pn) {
      var x = V.regrouper(s, pn), ap = x + s.S - s.T(x), r1 = DS.perteIndiv('R1f', pn, 0);
      push('retraite_' + pn, 'Retraité, ' + pn + ' € nets de pension (versé par la caisse : ' + Math.round(x) + ' €)', pn, ap, { avecEconomies: -r1 });
    });
    var ra = base.retraite_d10_2000, tfR = HYP.tfMoyen * 500000 / 12, taxeRA = taxePatrimoine(500000, 400000) / 12;
    push('retraite_aise', 'Retraité aisé : pension du 10e dixième + 2 000 €/mois de capital, 400 000 € de parts, résidence principale de 500 000 €', ra.avant - tfR, ra.apres - taxeRA,
         { voletRevenus: ra.apres - ra.avant, voletPatrimoine: tfR - taxeRA, avecEconomies: -DS.perteIndiv('R1f', V.pensionNetteActuelle(M.pensionDecile(9)), 0) });
    // --- cas patrimoniaux (H73.5)
    var tG = taxePatrimoine(300000) / 12, tfG = HYP.grenobleTF / 12;
    push('proprio_grenoble_300k', 'Propriétaire de sa résidence principale de 300 000 € à Grenoble, sans crédit (volet patrimoine seul ; taxe foncière actuelle 2 650 €/an)', -tfG, -tG,
         { taxeAvant: tfG, taxeApres: tG, taxeV72: Y.taxePatrimoine(300000, 0) / 12 });
    var tf1 = HYP.tfMoyen * 1e6 / 12, t1 = taxePatrimoine(1e6) / 12;
    push('proprio_1M', 'Propriétaire de sa résidence principale de 1 M€, sans crédit (volet patrimoine seul ; taxe foncière moyenne 0,27 %)', -tf1, -t1, { taxeAvant: tf1, taxeApres: t1, taxeV72: Y.taxePatrimoine(1e6, 0) / 12 });
    var rp = HYP.retraiteProprio, dueR = taxePatrimoine(rp.maison), payeR = Math.min(dueR, HYP.plafondBas * 12 * rp.pension), tfRP = HYP.tfMoyen * rp.maison;
    push('retraite_proprio_500k', 'Retraité, ' + rp.pension + ' € nets de pension, propriétaire d\'une maison de 500 000 € (taxe foncière actuelle ≈ 0,27 % : ' + Math.round(tfRP) + ' €/an)',
         rp.pension - tfRP / 12, rp.pension - payeR / 12,
         { taxeAvant: tfRP / 12, taxeDue: dueR / 12, taxePayee: payeR / 12, differeAn: dueR - payeR, ecartEconomique: (tfRP - dueR) / 12, taxeV72: Y.taxePatrimoine(rp.maison, 0) / 12, ecartV72Patrimoine: (tfRP - Y.taxePatrimoine(rp.maison, 0)) / 12 });
    var fp = HYP.familleProprio, cm = base.couple_median_2enf, tfF = HYP.tfMoyen * fp.bien, tF = taxePatrimoine(fp.bien - fp.crd);
    push('famille_proprio_400k', 'Couple médian, 2 enfants, propriétaire d\'un bien de 400 000 € avec 140 000 € de crédit restant (revenus et patrimoine)', cm.avant - tfF / 12, cm.apres - tF / 12,
         { voletRevenus: cm.apres - cm.avant, taxeAvant: tfF / 12, taxeApres: tF / 12, taxeV72: Y.taxePatrimoine(fp.bien - fp.crd, 0) / 12 });
    var f20 = fortune20(), y72f = fortune20(true);
    push('fortune_20M', 'Patrimoine de 20 M€ (résidence 2 M€, locatif 3 M€, parts 15 M€ ; dividendes 3 %, loyers nets 2 %)', f20.avant, f20.apres,
         { revenuMois: f20.revenu, taxeDue: f20.taxeDue / 12, payeApresPlafond: f20.apres, reporteAn: f20.reporte, tauxGlobalAvantPlafond: f20.tauxGlobal, apresV72: y72f.apres, ecartV72: y72f.apres - f20.avant, tauxGlobalV72: y72f.tauxGlobal, reporteAnV72: y72f.reporte, ifiActuel: f20.ifiActuel, tfActuelle: f20.tfActuelle });
    return out;
  }
  /** Cas du patrimoine de 20 M€ (€/mois ; v72 : true = barème et fonction du patrimoine de la v7.2). Plafond annuel de 75 % du revenu, excédent reporté. */
  function fortune20(v72) {
    var f = HYP.fortune20, div = f.parts * f.rendementParts / 12, loy = f.locatif * f.rendementLocatif / 12, s = v72 ? Y.sched() : sched(), tIS = 0.25;
    var brutD = div / (1 - tIS), revenuEco = div + loy;      // revenu reçu (dividende net d'IS + loyers) ; bénéfice avant IS = brutD
    var tfAct = HYP.tfMoyen * (f.rp + f.locatif) / 12, ifiAct = ifi(0.7 * f.rp + f.locatif) / 12;
    // droit actuel : dividendes au PFU de 31,4 % ; loyers à la tranche de 45 % + prélèvements sociaux de 17,2 % (CSG déductible de 6,8 points) ; taxe foncière 0,27 % ; IFI ⚠️ V15204
    var avant = div * (1 - 0.314) + loy * (1 - 0.45 - 0.172 + 0.068 * 0.45) - tfAct - ifiAct;
    var revFn = V.menage(s, { revenus: [0], capital: [brutD + loy] }, X.HYP.regle).revenu - brutD * (0.25 - (s.tIS === undefined ? 0.25 : s.tIS));
    var impotRev = revenuEco - revFn, taxe = v72 ? Y.taxePatrimoine(f.rp, f.locatif + f.parts) : taxePatrimoine(f.rp, f.locatif + f.parts);
    var total = impotRev + taxe / 12, plafond = HYP.plafondAnnuel * revenuEco, paye = Math.min(total, plafond);
    return { revenu: revenuEco, avant: avant, impotRevenus: impotRev, taxeDue: taxe, tauxGlobal: total / revenuEco, apres: revenuEco - paye, reporte: 12 * (total - paye), ifiActuel: 12 * ifiAct, tfActuelle: 12 * tfAct };
  }
  function casTypesObjet() { var o = {}; casTypes().forEach(function (c) { o[c.id] = c; }); return o; }
  function tme() { return X.tme(HYP.bareme); }
  /** Charge maximale (fonction des revenus + patrimoine) d'un rentier pur dont le patrimoine rapporte r par an, en % de son revenu, sans plafond : W = 12 × revenu / r. */
  function chargeRentier(W, r) {
    var s = sched(), revMois = W * r / 12, brut = revMois / (1 - 0.25), rf = V.menage(s, { revenus: [0], capital: [brut] }, X.HYP.regle).revenu;
    return { revenuMois: revMois, impotRevenus: revMois - rf, taxeMois: Tp(W) / 12, part: (revMois - rf + Tp(W) / 12) / revMois };
  }

  // ======================================================================================================================================
  // 6. Collectivités (bascule réexprimée, comme la v7.2)
  // ======================================================================================================================================
  var BASCULE = { bloc: { tot: 43.26 + 8.03 + 4.08 }, departements: { tot: 9.86 }, regions: { tot: 0.16 }, aom: { tot: 12.2 } };
  function bascule() {
    var pd = prelevementsDepenses('central'), T = 887.1594 + 66.0162 + pd.dT + ecart('central').retraitesCapital, pat = recettePatrimoine('central').nette, out = {}, k;
    for (k in BASCULE) { var tot = BASCULE[k].tot, dePat = k === 'bloc' ? Math.min(pat, tot) : 0; out[k] = { total: tot, patrimoine: dePat, partPatrimoine: dePat / pat, partT: (tot - dePat) / T, mdT: tot - dePat }; }
    out.T = T; out.patrimoine = pat; out.excedentPatrimoine = Math.max(0, pat - BASCULE.bloc.tot); return out;
  }

  var API = { HYP: HYP, SCS: SCS, MACROS: MACROS, tauxMoyen: tauxMoyen, Tp: Tp, mp: mp, taxePatrimoine: taxePatrimoine, formulePatrimoine: formulePatrimoine, tablePatrimoine: tablePatrimoine,
              erosion: erosion, composantes: composantes, plafondSommet: plafondSommet, recettePatrimoine: recettePatrimoine, k1pc: k1pc, lignesPatrimoine: lignesPatrimoine, gainPatrimoineVsV72: gainPatrimoineVsV72,
              sched: sched, formule: formule, table: table, bilanRevenus: bilanRevenus, surplus: surplus, manqueV72: manqueV72, repartition: repartition, calibrer: calibrer, evaluer: evaluer,
              ecart: ecart, solde: solde, prelevementsDepenses: prelevementsDepenses, prelevementsObligatoires: prelevementsObligatoires, trajectoire: trajectoire, jalons: jalons, dette: dette,
              economiesPourStabiliser: economiesPourStabiliser, combinaison: combinaison, ifi: ifi, casTypes: casTypes, casTypesObjet: casTypesObjet, fortune20: fortune20, tme: tme,
              chargeRentier: chargeRentier, bascule: bascule };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0611V73 = API;
})(this);
