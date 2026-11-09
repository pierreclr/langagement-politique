/*
 * modeles/systeme-ideal/bareme_deux_fonctions_v7.js — v7, « plan A » (arbitrage 41 du 05/11/2026 ; ciblage validé par l'auteur le 05/11). PROPOSITION, NON ADOPTÉE.
 *   Simplifier le système ACTUEL sans prélever plus : deux fonctions et un montant par enfant, à recettes à peu près constantes par rapport au DROIT ACTUEL (et non plus à la v5.10).
 *   (1) Fonction des revenus, par adulte : B(R) = S − T(R), T(R) = m∞·R − (m∞ − m0)·K·(1 − e^(−R/K)), R = revenu mensuel individuel en coût employeur + κ × revenus du capital
 *       (+ pensions regroupées, § 6) ; une règle de ménage : plancher de 877 € par adulte seul (1 316 € pour un couple, montants par enfant en plus), retiré à 25 % du revenu net gagné.
 *   (2) Fonction du patrimoine, par ménage : taxe annuelle sur la valeur nette de l'immobilier et des parts de sociétés (holdings comprises) : 0,5 % sur les 300 000 premiers euros
 *       de la résidence principale, τ sur le reste, τ + 0,5 point au-delà de 10 M€ ; paiement différé sous la médiane de niveau de vie ; plus de taxe foncière, d'IFI ni de droits de mutation.
 *   Calibrage (H7.1) : (a) neutralité : la fonction des revenus rend à la v5.10 ce que celle-ci prélève en plus du droit actuel sur le même périmètre (58,7 Md€, lignes du bilan global
 *   listées dans NEUTRALITE) ; (b) ciblage validé par l'auteur : +20 à +80 €/mois pour les bas revenus, −1 à −3 % du revenu disponible en haut ; (c) taux marginal effectif ≤ 75 %.
 *   Résultat (H7.2) : S = 400 €, m0 = 20 %, m∞ = 65 %, K = 1 500 €/mois, κ = 0,6, 200 € par enfant, majoration parent seul 250 € par enfant. LE TRILEMME : avec κ = 1 (capital compté
 *   comme le travail), la neutralité et le ciblage ne tiennent pas ensemble (variantes A1 et A2, § 2) ; voir sources/bareme-deux-fonctions-v7.md § 3.
 * Méthode : moteur de bareme_unique_v6.js (comparaison à la v5.10, même quadrature, mêmes réactions), complété par les lignes du bilan global pour passer au droit actuel.
 * Euros de 2025-2026 ; €/mois pour les cas types, Md€/an pour les masses. Des hypothèses et des ordres de grandeur, jamais des prédictions. Ne modifie AUCUN module existant.
 * Charger (depuis modeles/systeme-ideal/, jsc) : la liste de test_decisions_0511j.js (jusqu'à decisions_0511j.js), puis bareme_unique_v6.js bareme_deux_fonctions_v7.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var V = root.BaremeUniqueV6 || (req ? req('./bareme_unique_v6.js') : null);
  var J = root.Decisions0511j || (req ? req('./decisions_0511j.js') : null);
  var H = root.Decisions0511h || (req ? req('./decisions_0511h.js') : null);
  var I = root.Decisions0511i || (req ? req('./decisions_0511i.js') : null);
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var M = root.SystemeIdeal || (req ? req('./modele.js') : null);
  var TP = root.TaxePatrimoine || (req ? req('./taxe_patrimoine.js') : null);
  var DM = M.DONNEES, SCS = ['bas', 'central', 'haut'];

  // ======================================================================================================================================
  // 1. Neutralité : ce que la v5.10 prélève en plus du droit actuel, ligne par ligne (sources/calculs/bilan_global.py, exécuté le 05/11/2026, Md€/an, croisière, central)
  // ======================================================================================================================================
  var NEUTRALITE = {
    // fonction des revenus : recettes nouvelles − recettes supprimées
    recettes: { N01_retraites_maintenus: 66.02, N02_prelevement_unique_42: 887.16, P01_cotisations: -432.4, P02_csg: -153.1, P03_ir: -96.0, P04_prelevements_solidarite: -14.6, P05_crds: -9.1, P06_impots_production: -46.3 },
    // fonction des revenus : dépenses nouvelles − dépenses supprimées (prestations fusionnées)
    depenses: { N20_socle: 162.65, N21_enfants: 33.25, N22_majoration_parent_isole: 13.11, N23_al_retraites: 1.92, N24_plancher: 16.45, N25_plancher_parent_isole: 2.54, D34_bonus: 16.10, D35_reprise: -16.40,
                D02_chomage: -24.54, D03_rsa: -0.76, D04_ass: -1.70, D05_prime_activite: -10.70, D06_aides_logement: -16.00, D07_prestations_familiales: -27.20, D08_aah: -5.88, D09_arrondi: 0.10 },
    // fonction du patrimoine dans la v5.10 (recettes) et ce qu'elle remplace
    patrimoine510: { N05_realisation_pv: 5.56, N06_transmissions: 59.56, N07_taxe_1pc: 86.42, N09_plafonds: -2.31, N14_holdings_passifs: 0.77, N15_trusts_sci: 0.76, N16_sci: 1.30, N08_reforme_immo: -14.80 },
    remplacees: { P07_taxe_fonciere: 42.94, P08_ifi: 2.68, dmto: 16.10 },
    // H7.6b : les DMTG (20,8) ne sont PAS remplaçables par la taxe annuelle à recettes égales (recette maximale ≈ 66 Md€ vers 2 %, érosion du sommet) : conservés dans le solde du plan A
    // en attendant la décision (piste : héritage reçu compté comme revenu exceptionnel dans B, avec le lissage du § 5 ; non chiffrée).
    dmtgConserves: 20.80,
    capitalDepart510: 14.72,      // N26 : capital de départ (dépense) ; hors du plan A (deux fonctions et un montant par enfant)
    exclus: 'N03 (contribution des hautes pensions, 11,97) et N27 (retraites V6, −5,27) restent hors du périmètre : ils relèvent des retraites, levier d\'économies (arbitrage 40).'
  };
  function somme(o) { var s = 0, k; for (k in o) s += o[k]; return s; }
  /** Prélèvement net supplémentaire de la v5.10 sur le périmètre de la fonction des revenus (Md€) : la cible de l'effet de la v7 est son opposé. */
  function surplusV510() { return somme(NEUTRALITE.recettes) - somme(NEUTRALITE.depenses); }
  function cible() { return -surplusV510(); }

  // ======================================================================================================================================
  // 2. La fonction des revenus : paramètres, variantes du trilemme
  // ======================================================================================================================================
  var HYP = {
    // H7.2 : calibrage retenu (recherche sur grille : S 300-500, m∞ 50-70 %, m0 10-45 %, K 500-10 000, κ 0,55-1, enfant 150-200, majoration 200-345)
    A3: { S: 400, mInf: 0.65, m0: 0.20, K: 1500, kappa: 0.6, enfant: 200, majParentIsole: 250 },
    // A1 : capital compté comme le travail (κ = 1), neutre : il faut rendre l'écart par le socle (S relevé jusqu'à la neutralité)
    A1: { S: 550, mInf: 0.65, m0: 0.20, K: 1500, kappa: 1, enfant: 200, majParentIsole: 250 },
    // A2 : capital compté comme le travail (κ = 1), ciblage tenu : la neutralité ne tient pas
    A2: { S: 400, mInf: 0.65, m0: 0.20, K: 1500, kappa: 1, enfant: 200, majParentIsole: 250 },
    // H7.3 : règle de ménage : planchers hors montants par enfant (877 € seul ou parent seul, 1 316 € = 1,5 × 877 pour un couple, rapport du RSA couple / seul), retrait 25 % du gain net
    regle: { planchers: { seul: 877, parent: 877, couple: 1316 }, alpha: 0.25, conventionV510: false, horsEnfants: true },
    tRef: 0.42,
    // H7.6 : fonction du patrimoine
    patrimoine: { rpTaux: 0.005, rpPlafond: 300000, tauxHaut: 0.005, seuilHaut: 10e6, partRP: { bas: 1.0, haut: 0.6, quantile: 0.8 } },
    // H7.7 : lissage des gros gains (quotient, art. 163-0 A CGI comme modèle) : durée de détention plafonnée à 20 ans
    lissagePlafond: 20
  };
  function sched(v) { return V.bareme(HYP[v || 'A3']); }
  function effet(v, sc) { return V.effet(sched(v), HYP.tRef, sc || 'central'); }
  function table(v) { return V.table(sched(v)); }
  /** Socle universel finançable par les seules aides supprimées (RSA, prime d'activité, aides au logement, ASS), sans reprise par les taux : €/mois par adulte non retraité. */
  function socleSansReprise() { var aides = 12.4 + 10.7 + 16.0 + 1.7; return { aidesMd: aides, socle: aides * 1e9 / (12 * (DM.adultes - DM.retraites)) }; }

  // ======================================================================================================================================
  // 3. Cas types (droit actuel OpenFisca 2026), taux marginaux, dixièmes
  // ======================================================================================================================================
  function casTypes(v) { return V.casTypes(sched(v), HYP.tRef, HYP.regle); }
  function casTypesObjet(v) { return V.casTypesObjet(sched(v), HYP.tRef, HYP.regle); }
  function tme(v) { return V.tme(sched(v), HYP.regle); }
  /**
   * Dixièmes de niveau de vie, écart au droit actuel (€/UC/mois) : v5.10 (optimum.deciles, volet revenus : palier + correctifs + protection, sans la taxe de 1 %) + écart v7 − v5.10.
   * INDICATIF (H7.4) : la quadrature de palier 1 ne sépare pas travail et capital (κ non appliqué) et représente mal le sommet ; le haut est lu sur les cas types et les bandes.
   */
  function deciles(v) {
    var z = Z.deciles(J.archi(HYP.tRef)), d = V.deciles(sched(v), HYP.tRef, true);
    return d.map(function (x, i) { var e = z[i].palier + z[i].correctifs + z[i].protection + x.ecartMoisUC; return { decile: x.decile, ecart: e, ecartPct: e / x.rdbMoisUC, v510: z[i].palier + z[i].correctifs + z[i].protection, rdb: x.rdbMoisUC }; });
  }

  // ======================================================================================================================================
  // 4. La fonction du patrimoine
  // ======================================================================================================================================
  /** Taxe annuelle (€) d'un ménage : rp = valeur nette de la résidence principale, autre = autre immobilier et parts de sociétés nets, τ = taux général. */
  function taxePatrimoine(rp, autre, tau) {
    var P = HYP.patrimoine, t = tau === undefined ? tauNeutre().tau : tau, W = rp + autre, rpBas = Math.min(rp, P.rpPlafond);
    return P.rpTaux * rpBas + t * (W - rpBas) + P.tauxHaut * Math.max(0, W - P.seuilHaut);
  }
  var _pat = null;
  /** Parts de l'assiette (population HVP de taxe_patrimoine.js) : allègement de la résidence principale et surcroît au-delà de 10 M€, rapportés à l'impôt à 1 % sur tout. */
  function partsPatrimoine() {
    if (_pat) return _pat;
    var P = HYP.patrimoine, pop = TP.population('pierreNet'), base = 0, rp = 0, top = 0;
    pop.forEach(function (m) {
      var W = m.immo + m.mobile, partRP = m.p < P.partRP.quantile ? P.partRP.bas : P.partRP.haut, RP = partRP * m.immo;
      base += W; rp += Math.min(RP, P.rpPlafond); top += Math.max(0, W - P.seuilHaut);
    });
    return (_pat = { assietteAllegee: rp / base, assietteHaute: top / base });
  }
  // taxe_patrimoine.js : « bas » = le MOINS favorable au solde ; ici (comme le moteur) « bas » = favorable : on croise les noms
  var SC_TP = { bas: 'haut', central: 'central', haut: 'bas' };
  /** Recette nette (Md€/an) au taux général τ : taxe_patrimoine.js (assiette nette, paiement différé, exil, gestion) corrigée de l'allègement RP et du surcroît du sommet (sans érosion propre, ⚠️). */
  function recettePatrimoine(tau, sc) {
    var P = HYP.patrimoine, s = SC_TP[sc || 'central'], r = TP.recette(s, { assiette: 'pierreNet', taux: tau, differe: true, avecReformeImmo: true }), pp = partsPatrimoine();
    var facteur = 1 - pp.assietteAllegee * (tau - P.rpTaux) / tau + pp.assietteHaute * P.tauxHaut / tau;
    return { nette: r.nette * facteur, brute: r.brute * facteur, facteur: facteur, base: r };
  }
  /** Taux général qui remplace exactement la taxe foncière, l'IFI et les DMTO (61,7 Md€), au central. */
  function tauNeutre(sc) {
    var c = somme(NEUTRALITE.remplacees), lo = 0.002, hi = 0.03, k;
    for (k = 0; k < 50; k++) { var m = (lo + hi) / 2; if (recettePatrimoine(m, sc).nette < c) lo = m; else hi = m; }
    return { tau: hi, cible: c };
  }
  /** Incidence sur les loyers (ordre de grandeur, H7.8) : hausse de l'impôt annuel sur un logement loué, en points de valeur et en % du loyer, avant et après la suppression des DMTO. */
  function incidenceLoyers(tau) {
    var t = tau === undefined ? tauNeutre().tau : tau, tfMoy = TP.RECETTES.tfMenages / (TP.CN.logements + TP.CN.autresBatiments + TP.CN.terrainsBatis + TP.CN.autresNonProduits);
    var rendementBrut = 310.5 / 9900, dmtoAn = 0.075 / 10;   // loyers 310,5 Md€ / ≈ 9 900 Md€ de logements (Insee, taxe_patrimoine.js H508) ; DMTO ≈ 7,5 % du prix tous les ≈ 10 ans (⚠️ V14812)
    var hausse = t - tfMoy, nette = hausse - dmtoAn;
    return { tauxTF: tfMoy, hausseImpot: hausse, hausseNetteDMTO: nette, loyerSiTransmisTotal: hausse / rendementBrut, loyerNetSiTransmisTotal: nette / rendementBrut,
             fourchette: { basse: 0, centrale: 0.5 * Math.max(0, nette) / rendementBrut, haute: Math.max(0, nette) / rendementBrut } };
  }

  // ======================================================================================================================================
  // 5. Lissage des gros gains et exit tax au prorata temporis
  // ======================================================================================================================================
  /**
   * Impôt (€) sur un gain G réalisé une année où le revenu régulier est Rreg (€/an), détenu n années, sous le barème s : sans lissage, tout dans l'année ; avec lissage (quotient) :
   * la part linéaire (m∞ × G) est due en entier ; la part progressive P(R) = T(R) − m∞·R est calculée comme si G était perçu en N = min(n, 20) annuités (N × [P(Rreg + G/N) − P(Rreg)]).
   */
  function lissage(G, Rreg, n, v) {
    var s = sched(v), kap = s.kappa, N = Math.max(1, Math.min(n, HYP.lissagePlafond));
    var T = function (an) { return 12 * s.T(an / 12); }, P = function (an) { return T(an) - s.mInf * an; };
    var sans = T(Rreg + kap * G) - T(Rreg), avec = s.mInf * kap * G + N * (P(Rreg + kap * G / N) - P(Rreg));
    return { G: G, sans: sans, avec: avec, tauxSans: sans / G, tauxAvec: avec / G, N: N };
  }
  /** Droit actuel (simplifié, H7.9) : PFU 31,4 % (12,8 % d'IR + 18,6 % de prélèvements sociaux en 2026) + CEHR (3 % de 250 000 à 500 000 €, 4 % au-delà, célibataire ; lissage de l'art. 223 sexies II ignoré). */
  function droitActuelGain(G, Rreg) {
    var rfr = G + Rreg, cehr = 0.03 * Math.max(0, Math.min(rfr, 500000) - 250000) + 0.04 * Math.max(0, rfr - 500000);
    return { pfu: 0.314 * G, cehr: cehr, total: 0.314 * G + cehr, taux: (0.314 * G + cehr) / G };
  }
  /** Les trois cas demandés : revente d'une entreprise 1, 5 et 50 M€ après 20 ans, prix de revient négligeable, salaire modeste (Smic) pendant toute la période. */
  function casCessions(v) {
    var Rreg = 12 * I.coutMois(I.HYP.OF_CAS.smic_seul.brut[0]);
    return [1e6, 5e6, 50e6].map(function (G) { var l = lissage(G, Rreg, 20, v), d = droitActuelGain(G, Rreg); return { G: G, sansLissage: l.sans, avecLissage: l.avec, droitActuel: d.total, tauxSans: l.tauxSans, tauxAvec: l.tauxAvec, tauxActuel: d.taux }; });
  }
  /**
   * Exit tax au prorata temporis (proposition, H7.10) : un gain réalisé après un départ est imposé en France pour la part des années de détention passées en France,
   * au barème lissé ; paiement en sursis jusqu'à la vente effective, sans dégrèvement automatique. Exemple de l'auteur : 10 ans en France, vente 300 M€ un an après le départ.
   */
  function exitProrata(G, anneesFrance, anneesEtranger, v) {
    var n = anneesFrance + anneesEtranger, part = anneesFrance / n, l = lissage(G * part, 0, anneesFrance, v);
    return { G: G, partFrance: part, gainImposableFrance: G * part, impotFrance: l.avec, tauxSurGain: l.avec / G, droitActuel: 'art. 167 bis : imposition au départ des plus-values latentes (au taux du PFU), sursis automatique (UE et pays conventionnés), dégrèvement si les titres sont conservés 2 ans (5 ans au-delà de 2,57 M€)' };
  }

  // ======================================================================================================================================
  // 6. Retraités : pensions dans la fonction, transition protectrice (regroupement à net constant jusqu'à P*, voir bareme_unique_v6.js § 8)
  // ======================================================================================================================================
  function pensions(v, Pstar, rho) { return V.pensions(sched(v), Pstar, rho); }

  // ======================================================================================================================================
  // 7. Solde et dette du plan A
  // ======================================================================================================================================
  /** Écart du plan A à la v5.10 (Md€/an, croisière) : fonction des revenus + fonction du patrimoine (neutre) à la place du volet patrimoine de la v5.10 + capital de départ retiré. */
  function ecartPlanA(sc, v) {
    var s = sc || 'central', rev = effet(v, s).effet, tn = tauNeutre('central').tau, pat = recettePatrimoine(tn, s).nette + NEUTRALITE.dmtgConserves - NEUTRALITE.remplacees.dmto - somme(NEUTRALITE.patrimoine510);
    return { revenus: rev, patrimoine: pat, capitalDepart: NEUTRALITE.capitalDepart510, total: rev + pat + NEUTRALITE.capitalDepart510 };
  }
  /** Solde public (Md€/an) du plan A : solde de la v5.10 à 42 % + écart (constant en euros de 2025, appliqué dès 2029). */
  function solde(sc, an, v) { return J.solde(sc, an, HYP.tRef) + (an < 2029 ? 0 : ecartPlanA(sc, v).total); }
  /** Dette / PIB à 10, 20 et 30 ans (H.jalonsDette, 42 % constant + écart du plan A) et déficit stabilisant (variante_dette_stable.js s'il est chargé). */
  function dette(sc, v) {
    var e = {}; SCS.forEach(function (s) { e[s] = ecartPlanA(s, v).total; });
    var f = function () { return HYP.tRef; };
    return H.jalonsDette(sc, { taux: f, net: function (s, y) { return H.net(s, y) + (y < 2029 ? 0 : J.residu(HYP.tRef, s) + e[s]); } });
  }
  /** Économies annuelles supplémentaires (Md€ de 2025, constantes dès 2029) pour que la dette / PIB ne dépasse jamais, sur 30 ans, son niveau de départ (123,5 %, fin 2028). */
  function economiesPourStabiliser(sc, v) {
    var s = sc || 'central', e = ecartPlanA(s, v).total, f = function () { return HYP.tRef; }, ratio0 = 1.2351;
    var ok = function (X) { var d = H.jalonsDette(s, { taux: f, net: function (ss, y) { return H.net(ss, y) + (y < 2029 ? 0 : J.residu(HYP.tRef, ss) + e + X); } }); return Math.max.apply(null, d.serie.slice(0, 30)) <= ratio0 + 1e-9; };
    var lo = 0, hi = 400, k; if (ok(0)) return 0;
    for (k = 0; k < 50; k++) { var m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    return hi;
  }
  function stabilisation() {
    var DS = root.VarianteDetteStable || null, c = DS && DS.cibleStabilisation ? DS.cibleStabilisation('reference') : null;
    return { deficitStabilisantPct: c ? c.deficitPct : 0.036, deficitStabilisantMd: c ? c.deficitMd2025 : 107.6, source: c ? 'variante_dette_stable.js' : 'variante_dette_stable.js (valeur du test, module non chargé)',
             soldeCroisiere: solde('central', 2060), pib: DM.pib };
  }

  var API = { NEUTRALITE: NEUTRALITE, HYP: HYP, SCS: SCS, surplusV510: surplusV510, cible: cible, sched: sched, effet: effet, table: table, socleSansReprise: socleSansReprise,
              casTypes: casTypes, casTypesObjet: casTypesObjet, tme: tme, deciles: deciles, taxePatrimoine: taxePatrimoine, partsPatrimoine: partsPatrimoine, recettePatrimoine: recettePatrimoine,
              tauNeutre: tauNeutre, incidenceLoyers: incidenceLoyers, lissage: lissage, droitActuelGain: droitActuelGain, casCessions: casCessions, exitProrata: exitProrata, pensions: pensions,
              ecartPlanA: ecartPlanA, solde: solde, dette: dette, economiesPourStabiliser: economiesPourStabiliser, stabilisation: stabilisation };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.BaremeDeuxFonctionsV7 = API;
})(this);
