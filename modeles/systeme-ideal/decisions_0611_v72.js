/*
 * modeles/systeme-ideal/decisions_0611_v72.js — v7.2 ADOPTÉE (décision du 06/11/2026 : le « mélange »). Remplace la v5.10 comme modèle de référence.
 *   (1) Fonction des revenus de la v7.1 (bareme_v71.js), calibrage C (ciblage tenu) : B(R) = 412,5 + 675 × (1 − e^(−R/1 500)) − 0,65 × R (€/mois, par adulte) ; capital compté à 100 %,
 *       dividendes avec crédit de l'IS déjà payé (résidents) ; IS unique à 25 % ; 200 € par enfant, + 250 € par enfant pour un parent seul ; plancher 877 € (seul) / 1 316 € (couple), retiré à 25 % ;
 *       lissage des gros gains par quotient (20 ans au plus) ; exit tax au prorata (bareme_deux_fonctions_v7.js § 6) ; pensions regroupées à net constant (bareme_unique_v6.js § 8).
 *   (2) Usage du surplus (écart des recettes de la fonction des revenus au droit actuel, ≈ 71 Md€ au central) : une MOITIÉ baisse la taxe annuelle sur le patrimoine (H72.3), l'autre réduit
 *       le déficit. Fonction du patrimoine v7.2, continue et sans seuil (précision de l'auteur) :
 *       P(W) = 2 % × W − 1,8 % × K × (1 − e^(−W/K)) sur la valeur nette W (résidence principale comprise), taux marginal de 0,2 % au premier euro à 2 % pour les très grandes fortunes ;
 *       paiement différé ; plafonds conservés ; droits de succession et de donation (DMTG) gardés au droit actuel.
 *   (3) Corrections de cohérence (H72.4 à H72.6) : contribution des hautes pensions (N03) retirée, car les pensions entrent dans la fonction à net constant et le capital des retraités y entre aussi
 *       (la v7 et la v7.1 la gardaient dans le solde : double compte) ; holdings (2 % sur les actifs passifs, N14), trusts (N15) et SCI (N16) gardés, N15 et N16 au prorata du nouveau taux ;
 *       plafonds (N09) réintroduits au prorata du taux.
 *   (4) Dette : stabilisée, pas remboursée ; économies nécessaires et combinaison recommandée (variante_dette_stable.js : retraites R1, masse salariale M1 à M3 ; défense exclue).
 *   Décisions antérieures conservées (comptées dans J.solde de la v5.10, vérifiées par le test) : fiscalité d'orientation (N17, N18), gratuité urbaine (D31), CIR supprimé et 3 Md€ réorientés
 *   (D14, D32), retraites V6 avec âge libre au trimestre (D01, D29, D30, N27), socle suspendu en détention (D33), crédit des holdings (N04).
 * Construction : solde de la v5.10 à 42 % (decisions_0511j.js) + écart de la v7.2, constant en euros de 2025 dès 2029 (même méthode que la v7 et la v7.1).
 * Euros de 2025-2026 ; €/mois pour les cas types, Md€/an pour les masses. Des hypothèses et des ordres de grandeur, jamais des prédictions. Ne modifie AUCUN module existant.
 * Charger (depuis modeles/systeme-ideal/, jsc) : la liste de test_bareme_v71.js jusqu'à bareme_v71.js, en insérant variante_dette_stable.js après decisions_0511j.js, puis decisions_0611_v72.js
 *   (ordre complet en tête de test_decisions_0611_v72.js).
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  function need(n, f) { return root[n] || (req ? req(f) : null); }
  var X = need('BaremeV71', './bareme_v71.js'), W = need('BaremeDeuxFonctionsV7', './bareme_deux_fonctions_v7.js'), V = need('BaremeUniqueV6', './bareme_unique_v6.js');
  var J = need('Decisions0511j', './decisions_0511j.js'), H = need('Decisions0511h', './decisions_0511h.js'), I = need('Decisions0511i', './decisions_0511i.js');
  var DS = need('VarianteDetteStable', './variante_dette_stable.js'), R2 = need('Retraites2', './retraites2.js'), P1 = need('Palier1', './palier1.js');
  var TP = need('TaxePatrimoine', './taxe_patrimoine.js'), M = need('SystemeIdeal', './modele.js');
  var CT = root.CAS_TYPES_DONNEES || (req ? req('../gagnants-perdants/cas_types_donnees.js') : null);
  var DM = M.DONNEES, SCS = ['bas', 'central', 'haut'], MACROS = ['prudente', 'reference', 'favorable'];

  var HYP = {
    tRef: 0.42, annee1: 2029, anneeFin: 2070,
    // H72.1 : fonction des revenus = calibrage C de la v7.1 (le plus proche du ciblage validé ; recherche sur grille de la v7.1 refaite le 06/11 sans contrainte de neutralité : aucun barème de
    //   cette forme ne met à la fois le cadre à 10 000 € et celui à 20 000 € brut entre −1 et −3 % avec les bas revenus entre +20 et +80 € ; C reste le meilleur compromis)
    bareme: 'C',
    // H72.2 : part du surplus affectée à la baisse de la taxe du patrimoine (arbitrage 43 : la moitié) ; l'autre moitié reste dans le solde
    partSurplusPatrimoine: 0.5,
    // H72.3 : fonction du patrimoine v7.2 (forme proposée par Claude) ; l'échelle K est calculée pour que la recette
    //   (taxe_patrimoine.js au taux effectif moyen : assiette nette, paiement différé, exil, gestion) vaille 61,72 − surplus / 2 au central (K ≈ 19,0 M€)
    //   Précision de l'auteur (06/11) : fonction CONTINUE et progressive de la valeur nette, sans seuil ni marche (« une taxe Zucman qui ne commence pas à 100 M€ »), allègement de la résidence
    //   principale intégré à la même formule (taux marginal faible en bas) : P(W) = t∞·W − (t∞ − t0)·K·(1 − e^(−W/K)), t0 = 0,2 %, t∞ = 2 % (taux du projet Zucman), K calculé ;
    //   recalage de la distribution HVP sur les comptes nationaux (× 1,4, taxe_patrimoine.js H505) ⚠️ V15106 ; la queue au-delà de 22 M€ n'est pas dans la population (recette sous-estimée)
    patrimoine: { t0: 0.002, tInf: 0.02, recalage: 1.4 },
    remplacees: 42.94 + 2.68 + 16.10,     // taxe foncière + IFI + DMTO (bilan global) : recette de la fonction neutre de la v7
    // H72.4 : contribution des hautes pensions (N03, retraites2.js H108) retirée du solde : pensions regroupées à net constant (consigne de l'auteur) et capital des retraités dans la fonction
    retirerN03: true,
    // H72.5 : lignes patrimoniales de la v5.10 conservées (décisions du 05/11, question 35) : N14 (2 % sur les actifs passifs des holdings, taux propre, inchangé), N15 (trusts) et N16 (SCI) :
    //   corrections d'assiette chiffrées à 1 %, ramenées au prorata τ / 1 % ⚠️ V15100
    n14: 0.7719, n15: 0.7638, n16: 1.3038,
    // H72.6 : plafonds (75 % annuel ; N09 = −2,31 à 1 % avec la fonction de transmission de la v5.10) : réintroduits au prorata τ / 1 % (prudent : le plafond mord moins à un taux plus bas) ⚠️ V15101
    n09: -2.3067,
    // H72.7 : N05 (fin du report 150-0 B ter, assurance vie au décès, 5,56) reste hors du solde comme dans la v7 (les gains passent par la fonction avec lissage) ; réserve, non comptée
    // H72.8 : reste à vivre : dépenses pré-engagées en part du revenu disponible (DREES, Études et Résultats n° 1055, mars 2018, tableau 1, enquête Budget de famille 2011 de l'Insee) :
    //   pauvres 61 %, modestes non pauvres 39 %, classes moyennes 31 %, aisés 23 % ; propriétaires (non accédants) 19 %. Catégories par niveau de vie mensuel par UC : seuil de pauvreté 1 288 €
    //   (Insee Première n° 2063, 2023) ; 4e décile ≈ 1 940 € et 3e quartile ≈ 2 850 € (≈ 0,9 et 1,33 fois la médiane de 2 147 €) ⚠️ V15102 ; parts de 2011 appliquées aux revenus de 2026 ⚠️ V15103
    preEngagees: { pauvres: 0.61, modestes: 0.39, moyennes: 0.31, aises: 0.23, proprietaires: 0.19 },
    seuilsNiveauVie: { pauvrete: 1288, d4: 1940, q3: 2850 },
    // H72.9 : cas patrimoniaux (⚠️ V15104) : rendement des actions 3 % (rentier : 5 000 €/mois de dividendes ⇒ 2 M€ de parts) ; retraité aisé : 400 000 € de parts + résidence principale de
    //   500 000 € ; taxe foncière actuelle = 0,27 % de la valeur (taxe foncière des ménages / valeur du parc, taxe_patrimoine.js, comme la v7) sauf Grenoble : 90 m² à ≈ 3 300 €/m², valeur
    //   locative cadastrale 60 €/m², base 50 %, taux global 68,00 % (REI 2025, sources/taxe-fonciere-grenoble.md), TEOM 8,8 % non comptée (elle reste une redevance de service)
    rendementActions: 0.03, tfMoyen: 0.0027, grenoble: { m2: 90, vlcM2: 60, taux: 0.68 },
    // H72.10 : combinaison d'économies recommandée (variante_dette_stable.js) ; HP = pensions non regroupées au-delà de 2 500 € brut (v7 § 7, ρ = 0) : prélèvement, pas une économie
    combinaison: ['R1f', 'M1m', 'M2m', 'M3']
  };
  var C = X.HYP[HYP.bareme];
  function sched() { return X.sched(HYP.bareme); }

  // ======================================================================================================================================
  // 1. Fonction des revenus : formule, table, surplus
  // ======================================================================================================================================
  function formule() { return 'B(R) = ' + C.S + ' + ' + Math.round((C.mInf - C.m0) * C.K) + ' × (1 − e^(−R/' + C.K + ')) − ' + C.mInf + ' × R'; }
  function table(pts) { return V.table(sched(), pts || [0, 1000, 2000, 3000, 5000, 8000, 10000, 50000]).map(function (l) { return { R: l.R, du: -l.B, reste: l.net, tauxMoyen: l.R > 0 ? -l.B / l.R : null, marginal: l.marginal }; }); }
  var _b = {};
  function bilanRevenus(sc) { var s = sc || 'central'; return _b[s] || (_b[s] = X.bilan(HYP.bareme, s)); }
  /** Surplus : écart des recettes de la fonction des revenus (actifs, capital des retraités, IS, retenue) au droit actuel (Md€/an, > 0 = on prélève plus qu'aujourd'hui). */
  function surplus(sc) { return bilanRevenus(sc).ecart; }

  // ======================================================================================================================================
  // 2. Fonction du patrimoine v7.2
  // ======================================================================================================================================
  var SC_TP = { bas: 'haut', central: 'central', haut: 'bas' };   // taxe_patrimoine.js nomme « bas » le moins favorable : on croise (comme la v7)
  /** Fonction du patrimoine (€/an) d'une valeur nette W (immobilier et parts de sociétés, résidence principale comprise, dettes déduites) : même forme que la fonction des revenus. */
  function Tp(W, K) { var P = HYP.patrimoine, k = K === undefined ? tau().K : K; return W <= 0 ? 0 : P.tInf * W - (P.tInf - P.t0) * k * (1 - Math.exp(-W / k)); }
  function mp(W, K) { var P = HYP.patrimoine, k = K === undefined ? tau().K : K; return P.tInf - (P.tInf - P.t0) * Math.exp(-W / k); }
  /** Taux moyen effectif sur la population HVP (taxe_patrimoine.js, assiette nette, 2 000 quantiles) recalée sur les comptes nationaux (× 1,4, H72.3). */
  function tauxEffectif(K) {
    var pop = TP.population('pierreNet'), s = HYP.patrimoine.recalage, a = 0, b = 0;
    pop.forEach(function (m) { var w = s * (m.immo + m.mobile); a += Tp(w, K); b += w; });
    return a / b;
  }
  /** Recette nette (Md€/an) : taxe_patrimoine.js au taux effectif (paiement différé, exil, gestion, effet prix ; érosion proportionnelle au taux effectif ⚠️ V15105). */
  function recettePatrimoine(K, sc) {
    var te = tauxEffectif(K), r = TP.recette(SC_TP[sc || 'central'], { assiette: 'pierreNet', taux: te, differe: true, avecReformeImmo: true });
    return { nette: r.nette, brute: r.brute, tauxEffectif: te };
  }
  var _tau = null;
  /** Échelle K de la fonction du patrimoine : recette = taxe foncière + IFI + DMTO (61,72) − part du surplus central (H72.2, H72.3). */
  function tau() {
    if (_tau) return _tau;
    var cible = HYP.remplacees - HYP.partSurplusPatrimoine * surplus('central'), lo = 1e5, hi = 1e9, k;
    for (k = 0; k < 80; k++) { var m = Math.sqrt(lo * hi); if (recettePatrimoine(m, 'central').nette > cible) lo = m; else hi = m; }
    var K = Math.sqrt(lo * hi);
    return (_tau = { K: K, cible: cible, baisse: HYP.remplacees - cible, tauxEffectif: tauxEffectif(K), tau: tauxEffectif(K) });
  }
  /** Taxe annuelle (€) d'un ménage : rp = résidence principale nette, autre = autre immobilier et parts de sociétés nets (même formule pour tout). */
  function taxePatrimoine(rp, autre) { return Tp(rp + (autre || 0)); }
  function formulePatrimoine() { var P = HYP.patrimoine, K = tau().K; return 'P(W) = ' + (100 * P.tInf) + ' % × W − ' + (100 * (P.tInf - P.t0)).toFixed(1) + ' % × ' + (K / 1e6).toFixed(1) + ' M€ × (1 − e^(−W/' + (K / 1e6).toFixed(1) + ' M€))'; }
  function tablePatrimoine(pts) { return (pts || [1e5, 3e5, 1e6, 1e7, 1e8, 1e9]).map(function (W) { var t = Tp(W); return { W: W, taxe: t, tauxMoyen: t / W, marginal: mp(W) }; }); }
  function k1pc() { return tau().tau / 0.01; }
  /** Volet patrimoine (Md€/an) par rapport à la v5.10, ligne par ligne (convention bilan : écart des recettes). */
  function lignesPatrimoine(sc) {
    var p510 = W.NEUTRALITE.patrimoine510, k = k1pc(), rp = recettePatrimoine(tau().K, sc).nette;
    var l = {
      taxeAnnuelle: rp - p510.N07_taxe_1pc,                       // remplace N07 (taxe de 1 %)
      dmtgGardes: W.NEUTRALITE.dmtgConserves - p510.N06_transmissions,   // P09 rétabli au droit actuel, N06 (fonction de transmission) retirée
      dmto: -W.NEUTRALITE.remplacees.dmto - p510.N08_reforme_immo,      // DMTO supprimés (16,1) à la place de la réforme immobilière de la v5.10 (−14,8)
      realisation: -p510.N05_realisation_pv,                       // H72.7
      plafonds: HYP.n09 * k - p510.N09_plafonds,                   // H72.6
      holdings: HYP.n14 - p510.N14_holdings_passifs,               // H72.5 : 0
      trusts: HYP.n15 * k - p510.N15_trusts_sci,
      sci: HYP.n16 * k - p510.N16_sci
    };
    var tot = 0, x; for (x in l) tot += l[x]; l.total = tot; l.recetteTaxe = rp;
    return l;
  }

  // ======================================================================================================================================
  // 3. Écart à la v5.10, solde, prélèvements obligatoires
  // ======================================================================================================================================
  function n03(sc) { return HYP.retirerN03 ? R2.contribution(P1.HP, sc || 'central').netMd : 0; }
  var _e = {};
  /** Écart de la v7.2 à la v5.10 (Md€/an, croisière, + améliore le solde), décomposé. */
  function ecart(sc) {
    var s = sc || 'central'; if (_e[s]) return _e[s];
    var b = bilanRevenus(s), lp = lignesPatrimoine(s), cd = W.NEUTRALITE.capitalDepart510, h = n03(s);
    var rev = b.actifs + b.retraitesCapital + b.is + b.retenue;
    return (_e[s] = { revenus: rev, actifs: b.actifs, retraitesCapital: b.retraitesCapital, is: b.is, retenue: b.retenue, patrimoine: lp.total, lignesPatrimoine: lp,
                      capitalDepart: cd, n03: -h, total: rev + lp.total + cd - h, detail: b.detail });
  }
  function solde(sc, an) { return J.solde(sc, an, HYP.tRef) + (an < HYP.annee1 ? 0 : ecart(sc).total); }
  function trajectoireSolde(sc) { var out = [], y; for (y = HYP.annee1; y <= HYP.anneeFin; y++) out.push({ an: y, solde: solde(sc || 'central', y), soldeV510a42: J.solde(sc || 'central', y, HYP.tRef) }); return out; }
  /** Décomposition prélèvements / dépenses de l'écart (Md€, central) : convention du bilan global (socle, enfants, plancher = dépenses ; T(R), IS, patrimoine = prélèvements). */
  function prelevementsDepenses(sc) {
    var s = sc || 'central', e = ecart(s), d = e.detail;
    var mj = J.mesure(HYP.tRef, s), bonus = mj.cout, reprise = mj.recette;
    var dT = d.haut - d.bas - d.fermeture + reprise - bonus;
    var dPO = dT + e.retraitesCapital + e.is + e.retenue + e.n03 + e.patrimoine;
    var dDep = d.socle + d.enfants + d.plancher - bonus + reprise - e.capitalDepart;
    return { dT: dT, dPO: dPO, dDep: dDep, socle: d.socle, enfants: d.enfants, plancher: d.plancher, bonus: bonus, reprise: reprise, controle: dPO - dDep - e.total };
  }
  var BILAN510 = { po: 1542.642, poNet: 1542.642 - 99.050, dep: 1780.397, pib: 2935, poAvant: 1253.245, transfertsNets: 99.050 };   // bilan global v5.10 (bilan_global.py : PO_V510, DEP_V510, TRANSFERTS_NETS_V510), Md€
  function prelevementsObligatoires(base) {
    var B = base || BILAN510, pd = prelevementsDepenses('central'), po = B.po + pd.dPO, tr = pd.socle + pd.enfants + pd.plancher - pd.bonus + pd.reprise - W.NEUTRALITE.capitalDepart510;
    return { avantPct: B.poAvant / B.pib, v510Pct: B.po / B.pib, po: po, pct: po / B.pib, poNet: B.poNet + pd.dPO - tr, pctNet: (B.poNet + pd.dPO - tr) / B.pib, dPO: pd.dPO };
  }

  // ======================================================================================================================================
  // 4. Dette (trois hypothèses macro), économies nécessaires, combinaison
  // ======================================================================================================================================
  function net(lev) { return function (s, y) { return H.net(s, y) + (y < HYP.annee1 ? 0 : J.residu(HYP.tRef, s) + ecart(s).total + (lev ? lev(s, y) : 0)); }; }
  function trajectoire(sc, macro, lev) { return DS.trajectoire(sc || 'central', { taux: HYP.tRef, macro: macro, net: net(lev) }); }
  function jalons(sc, macro, lev) { return DS.jalons(trajectoire(sc, macro, lev)); }
  function dette() { var o = {}; MACROS.forEach(function (m) { o[m] = {}; SCS.forEach(function (s) { o[m][s] = jalons(s, m); }); }); return o; }
  /** Économies constantes (Md€ de 2025 par an dès 2029) pour que la dette / PIB ne dépasse aucune année, sur 30 ans, son niveau de fin 2028 (macro et scénario donnés). */
  function economiesPourStabiliser(sc, macro) {
    var ok = function (x) { var tr = trajectoire(sc, macro, function () { return x; }); return Math.max.apply(null, tr.ratio.slice(0, 30)) <= tr.ratio0 + 1e-9; };
    if (ok(0)) return 0; var lo = 0, hi = 500, k; if (!ok(hi)) return null;
    for (k = 0; k < 50; k++) { var m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    return hi;
  }
  /** Rendement de l'option « hautes pensions non regroupées au-delà de 2 500 € brut » (v7 § 7, ρ = 0) : prélèvement, Md€/an. */
  function hautesPensions() { return V.pensions(sched(), 2500, 0).rendementMd; }
  function leviers(ids) {
    var ds = ids.filter(function (i) { return i !== 'HP'; }), f = ds.length ? DS.leviers(ds) : null, hp = ids.indexOf('HP') >= 0 ? hautesPensions() : 0;
    return function (s, y) { return (f ? f(s, y) : 0) + (y >= HYP.annee1 ? hp : 0); };
  }
  /** Combinaison : rendement en 2030, 2035, 2040, 2060 ; dette avec la combinaison ; manque à combler (économies constantes encore nécessaires en plus). */
  function combinaison(ids) {
    var lv = leviers(ids || HYP.combinaison), out = { ids: ids || HYP.combinaison, rendement: {}, dette: {}, manque: {} };
    [2030, 2035, 2040, 2060].forEach(function (y) { out.rendement[y] = lv('central', y); });
    MACROS.forEach(function (m) {
      out.dette[m] = jalons('central', m, lv);
      var ok = function (x) { var tr = trajectoire('central', m, function (s, y) { return lv(s, y) + x; }); return Math.max.apply(null, tr.ratio.slice(0, 30)) <= tr.ratio0 + 1e-9; };
      if (ok(0)) out.manque[m] = 0; else { var lo = 0, hi = 500, k; for (k = 0; k < 50; k++) { var mm = (lo + hi) / 2; if (ok(mm)) hi = mm; else lo = mm; } out.manque[m] = hi; }
    });
    return out;
  }
  function catalogueLeviers() {
    var ids = ['R1m', 'R1f', 'M1m', 'M1f', 'M2m', 'M2f', 'M3'], o = {};
    ids.forEach(function (id) { o[id] = { y2030: DS.leviers([id])('central', 2030), y2040: DS.leviers([id])('central', 2040), y2060: DS.leviers([id])('central', 2060), libelle: (DS.OPTIONS_RETRAITES[id] || DS.OPTIONS_MASSE[id]) }; });
    var hp = hautesPensions(); o.HP = { y2030: hp, y2040: hp, y2060: hp, libelle: 'pensions non regroupées au-delà de 2 500 € brut (prélèvement, pas une économie ; touche les 9e et 10e dixièmes de pension)' };
    return o;
  }

  // ======================================================================================================================================
  // 5. Cas types (écart au droit actuel, €/mois) et reste à vivre
  // ======================================================================================================================================
  function categorie(nv) { var S = HYP.seuilsNiveauVie; return nv < S.pauvrete ? 'pauvres' : nv < S.d4 ? 'modestes' : nv < S.q3 ? 'moyennes' : 'aises'; }
  /** Reste à vivre (€/mois) avant réforme : revenu disponible × (1 − part des dépenses pré-engagées de la catégorie de niveau de vie) ; statut 'proprietaire' : 19 %. */
  function resteAVivre(rd, uc, statut) { var cat = statut === 'proprietaire' ? 'proprietaires' : categorie(rd / uc); return { categorie: cat, part: HYP.preEngagees[cat], rav: rd * (1 - HYP.preEngagees[cat]) }; }
  var UC = { smic_seul: 1, parent_isole_smic: 1.6, couple_2smic_2enf: 2.1, couple_2smic_0enf: 1.5, couple_median_2enf: 2.1, cadre_5000: 1, cadre_10000: 1, cadre_20000: 1,
             net_1500: 1, net_1750: 1, net_2000: 1, net_2500: 1, net_3000: 1, sans_emploi: 1, aah: 1, rentier_div_5000: 1, rentier_mixte_5000: 1 };
  function tfGrenoble() { var g = HYP.grenoble; return g.m2 * g.vlcM2 * 0.5 * g.taux; }
  function casTypes() {
    var s = sched(), base = X.casTypesObjet(HYP.bareme), out = [];
    function push(id, lib, av, ap, uc, statut, extra) {
      var r = av === null ? null : resteAVivre(av, uc, statut), e = av === null ? null : ap - av;
      var o = { id: id, libelle: lib, avant: av, apres: ap, ecart: e, ecartPct: av ? e / av : null, rav: r ? r.rav : null, categorie: r ? r.categorie : null, ecartPctRAV: r ? e / r.rav : null };
      var k; for (k in (extra || {})) o[k] = extra[k]; out.push(o); return o;
    }
    ['smic_seul', 'net_1500', 'net_2000', 'net_3000', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'sans_emploi', 'aah']
      .forEach(function (id) { var c = base[id]; push(id, c.libelle, c.avant, c.apres, UC[id], null); });
    // indépendant : micro-entrepreneur libéral, 3 000 € de chiffre d'affaires par mois, 15 % de charges réelles (cas_types_donnees.js, droit actuel OpenFisca-France 175.0.45 + Urssaf) : R = 2 550 €
    var ind = CT.filter(function (c) { return c.id === 'independant'; })[0], Ri = ind.micro_ca * (1 - ind.charges_reelles_part);
    push('independant', 'Indépendant (micro-entrepreneur libéral, 3 000 € de chiffre d\'affaires, R = ' + Ri + ' €)', ind.actuel.revenu_disponible, V.menage(s, { revenus: [Ri] }, X.HYP.regle).revenu, 1, null);
    // rentier : revenus (v7.1) + taxe du patrimoine sur 2 M€ de parts (aujourd'hui : pas d'IFI sur les parts)
    var rd = base.rentier_div_5000, partsR = 5000 * 12 / HYP.rendementActions, taxeR = taxePatrimoine(0, partsR) / 12;
    push('rentier', 'Rentier, 5 000 €/mois de dividendes (2 M€ de parts), revenus et patrimoine', rd.avant, rd.apres - taxeR, 1, null, { voletRevenus: rd.apres - rd.avant, taxePatrimoineMois: taxeR });
    // retraités à pension nette constante (1 200, 2 000, 4 000 € nets) ; avec la combinaison recommandée (R1f : sous-indexation au-dessus de 2 500 € nets)
    [1200, 2000, 4000].forEach(function (pn) {
      var x = V.regrouper(s, pn), ap = x + s.S - s.T(x), r1 = HYP.combinaison.indexOf('R1f') >= 0 ? DS.perteIndiv('R1f', pn, 0) : 0;
      push('retraite_' + pn, 'Retraité, ' + pn + ' € nets de pension (versé par la caisse : ' + Math.round(x) + ' €)', pn, ap, 1, null, { avecEconomies: -r1 });
    });
    // retraité aisé : 10e dixième de pension + 2 000 € de capital (v7.1), + 400 000 € de parts et résidence principale de 500 000 €
    var ra = base.retraite_d10_2000, tfR = HYP.tfMoyen * 500000 / 12, taxeRA = taxePatrimoine(500000, 400000) / 12;
    push('retraite_aise', 'Retraité aisé : pension du 10e dixième + 2 000 €/mois de capital, 400 000 € de parts, résidence principale de 500 000 €', ra.avant - tfR, ra.apres - taxeRA, 1, 'proprietaire',
         { voletRevenus: ra.apres - ra.avant, voletPatrimoine: tfR - taxeRA, avecEconomies: -DS.perteIndiv('R1f', V.pensionNetteActuelle(M.pensionDecile(9)), 0) });
    // propriétaires (volet patrimoine seul, €/mois) : taxe foncière actuelle → taxe v7.2 (et v7 à 1,34 % pour mémoire)
    var tfG = tfGrenoble() / 12, tG = taxePatrimoine(300000, 0) / 12, tf1 = HYP.tfMoyen * 1e6 / 12, t1 = taxePatrimoine(1e6, 0) / 12;
    push('proprio_grenoble_300k', 'Propriétaire de sa résidence principale de 300 000 € à Grenoble (volet patrimoine seul)', null, null, 1, null,
         { taxeAvant: tfG, taxeApres: tG, ecartPatrimoine: tfG - tG, taxeV7: W.taxePatrimoine(300000, 0) / 12 });
    push('proprio_1M', 'Propriétaire de sa résidence principale de 1 M€ (volet patrimoine seul, taxe foncière moyenne 0,27 %)', null, null, 1, null,
         { taxeAvant: tf1, taxeApres: t1, ecartPatrimoine: tf1 - t1, taxeV7: W.taxePatrimoine(1e6, 0) / 12 });
    return out;
  }
  function casTypesObjet() { var o = {}; casTypes().forEach(function (c) { o[c.id] = c; }); return o; }
  function tme() { return X.tme(HYP.bareme); }

  // ======================================================================================================================================
  // 6. Collectivités : la bascule réexprimée en parts (fonction du patrimoine pour le bloc communal, parts de T(R) pour le reste)
  // ======================================================================================================================================
  // Ressources 2024 des impôts supprimés (DGCL 2025, t. 5.1 ; bilan_global.py BASCULE) : taxe foncière, CFE, DMTO, versement mobilité (la TVA reste perçue telle quelle)
  var BASCULE = { bloc: { tf: 43.26, cfe: 8.03, dmto: 4.08, vm: 0 }, departements: { tf: 0, cfe: 0, dmto: 9.86, vm: 0 }, regions: { tf: 0, cfe: 0, dmto: 0.16, vm: 0 }, aom: { tf: 0, cfe: 0, dmto: 0, vm: 12.2 } };
  function bascule() {
    var pd = prelevementsDepenses('central'), T = 887.1594 + 66.0162 + pd.dT + ecart('central').retraitesCapital, pat = recettePatrimoine(tau().K, 'central').nette, out = {}, k;
    for (k in BASCULE) {
      var b = BASCULE[k], tot = b.tf + b.cfe + b.dmto + b.vm, dePat = k === 'bloc' ? Math.min(pat, tot) : 0, reste = tot - dePat;
      out[k] = { total: tot, partPatrimoine: dePat / pat, partT: reste / T, mdT: reste };
    }
    out.T = T; out.patrimoine = pat; return out;
  }

  // ======================================================================================================================================
  // 7. Contrôles : décisions antérieures toujours comptées dans J.solde
  // ======================================================================================================================================
  function controles() {
    return { soldeV510_2060: J.solde('central', 2060, HYP.tRef), ecartTotal: ecart('central').total, solde2060: solde('central', 2060) };
  }

  var API = { HYP: HYP, SCS: SCS, MACROS: MACROS, sched: sched, formule: formule, table: table, bilanRevenus: bilanRevenus, surplus: surplus, recettePatrimoine: recettePatrimoine, tau: tau,
              taxePatrimoine: taxePatrimoine, Tp: Tp, mp: mp, tauxEffectif: tauxEffectif, formulePatrimoine: formulePatrimoine, tablePatrimoine: tablePatrimoine, lignesPatrimoine: lignesPatrimoine, n03: n03, ecart: ecart, solde: solde, trajectoireSolde: trajectoireSolde, prelevementsDepenses: prelevementsDepenses,
              BILAN510: BILAN510, prelevementsObligatoires: prelevementsObligatoires, trajectoire: trajectoire, jalons: jalons, dette: dette, economiesPourStabiliser: economiesPourStabiliser,
              hautesPensions: hautesPensions, leviers: leviers, combinaison: combinaison, catalogueLeviers: catalogueLeviers, categorie: categorie, resteAVivre: resteAVivre, casTypes: casTypes,
              casTypesObjet: casTypesObjet, tme: tme, tfGrenoble: tfGrenoble, bascule: bascule, controles: controles };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0611V72 = API;
})(this);
