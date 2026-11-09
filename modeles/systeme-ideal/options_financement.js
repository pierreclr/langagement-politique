/*
 * modeles/systeme-ideal/options_financement.js — grille d'options pour financer le palier 1 (03/11/2026). Fonctions pures au-dessus de palier1.js,
 * patrimoine_financier.js et deces_realisation.js (charger : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js
 * patrimoine_financier.js deces_realisation.js options_financement.js). AUCUN défaut des autres modules n'est modifié : le palier 1 reste le point de départ
 * (taux plat 35 %, socle 500 €, impôt de 50 % sur les transmissions) et chaque option est un écart à ce point de départ. H420 à H432 : methode.md § 30.
 *
 * Mission : préparer la décision de l'auteur. Rien ici ne décide ; ce sont des ordres de grandeur sous hypothèses, jamais des prédictions.
 *
 * Convention des scénarios. palier1.js : « bas » = réactions faibles (favorable au solde), « haut » = réactions fortes (défavorable).
 * patrimoine_financier.js et deces_realisation.js : « bas » = hypothèses les MOINS favorables au solde. Les deux conventions sont inverses :
 * `SC_PATRIMOINE` croise explicitement les scénarios (palier 1 bas -> patrimoine haut), comme patrimoine_immobilier.integration.
 *
 * Une option (objet `o`, champs absents = palier 1) :
 *   tPlat           taux plat (défaut 0,35)
 *   socleFacteur    1 = socle de 500 € ; 0,9 = −10 % ; 0,8 = −20 %
 *   rampe           null | { annees: N, depart: € } : socle linéaire de `depart` (année 1) à socle final (année N), puis constant
 *   heritage        'palier1' (50 % sur tout le flux, fuite du scénario) | 'ecart35' (écart de déclaration de 35 % au central, +4 points aux trois scénarios)
 *                   | 'ecart40' (+9 points) | 'taux40ecart35' (taux de 40 % ; fuite +4 points, proportionnelle au taux) | 'actuels' (DMTG 2024, 20,8 Md€)
 *   report150       true : fin du report d'imposition 150-0 B ter, flux futur imposé (le stock rétroactif n'est PAS compté : une fois, et risqué)
 *   deces           'aucun' | 'carryover' (prix d'acquisition reporté, valeur à 10 ans) | 'credit' (réalisation avec crédit sur les droits, borne basse)
 *                   | 'creditHaut' (idem, borne haute par classe) | 'cumul' (50 % en plus des droits, net de la déductibilité)
 *   finPurgeAV      true : fin de l'effacement des plus-values de l'assurance-vie au décès (décision de l'auteur du 03/11/2026, Q5 ; défaut du système idéal, mais NON inclus dans la référence du palier 1 pour garder ses soldes publiés)
 *   pfu50           true : revenus du capital et plus-values financières à 50 % (au lieu du taux plat)
 *   economies       'aucune' | 'prudentes' | 'volontaires' ; cir : 'inchange' | 'recentre' | 'supprime'
 *   immobilier      true : réforme immobilière en place (plus-value réelle à 50 %, fin des DMTO, report des pertes 10 ans) : + patrimoine_immobilier.bilan(sc croisé).soldeNet
 *                   (−14,1 Md€ au central) ; nécessite dvf_patrimoine.js et patrimoine_immobilier.js chargés (03/11/2026)
 *   taxePatrimoine  null | { assiette: 'pierre' | 'pierreNet' | 'pierreAV' | 'large' | 'largeNet', abattement: €, differe: bool } : taxe de 1 % sur le patrimoine
 *                   (taxe_patrimoine.js, H500-H529). Les DMTO ne sont déduits qu'une fois : par la réforme immobilière si `immobilier`, sinon par la taxe elle-même.
 *                   La taxe foncière et l'IFI sont déjà supprimés par le palier 1 (885,9 Md€) : rien à redéduire.
 */
(function (root) {
  'use strict';
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var V = root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null);
  var O = root.Optimisation || (typeof require !== 'undefined' ? require('./optimisation.js') : null);
  var P1 = root.Palier1 || (typeof require !== 'undefined' ? require('./palier1.js') : null);
  var PF = root.PatrimoineFinancier || (typeof require !== 'undefined' ? require('./patrimoine_financier.js') : null);
  var DR = root.DecesRealisation || (typeof require !== 'undefined' ? require('./deces_realisation.js') : null);
  function PI() { return root.PatrimoineImmobilier || (typeof require !== 'undefined' ? require('./patrimoine_immobilier.js') : null); }   // facultatifs : chargés seulement si l'option est utilisée
  function TP() { return root.TaxePatrimoine || (typeof require !== 'undefined' ? require('./taxe_patrimoine.js') : null); }
  var D = M.DONNEES, F = V.fus;

  var SCS = ['bas', 'central', 'haut'];
  var SC_PATRIMOINE = { bas: 'haut', central: 'central', haut: 'bas' };            // H420 : conventions inverses, croisées explicitement
  var PIB = D.pib;

  var BASE = { tPlat: 0.35, socleFacteur: 1, rampe: null, heritage: 'palier1', report150: false, deces: 'aucun', pfu50: false, finPurgeAV: false, economies: 'aucune', cir: 'inchange', immobilier: false, taxePatrimoine: null };
  function opt(o) { return F(BASE, o || {}); }
  var SOCLE_DEFAUT = P1.BASE.socle;                                               // 500 €

  // ---------- Héritage
  /** Écart de déclaration central du modèle : fuite de 31 % ; la variante « 35 % » ajoute la différence (CAE n° 69 : 35 à 40 % observés, V6420). */
  var FUITE_CENTRALE = M.SCENARIOS.central.fuiteTransm;
  var HERITAGES = {
    palier1: { t: 0.5, ajout: 0, libelle: '50 % sur tout le flux de 300 Md€, fuite du scénario (18 / 31 / 48 %)' },
    ecart35: { t: 0.5, ajout: 0.35 - FUITE_CENTRALE, libelle: 'écart de déclaration de 35 % au central (+4 points aux trois scénarios)' },
    ecart40: { t: 0.5, ajout: 0.40 - FUITE_CENTRALE, libelle: 'écart de déclaration de 40 % au central (+9 points)' },
    taux40ecart35: { t: 0.4, ajout: 0.35 - FUITE_CENTRALE, libelle: 'impôt de 40 % (au lieu de 50 %), écart de 35 % au central' },
    actuels: { actuels: true, t: null, ajout: 0, libelle: 'droits de succession et de donation actuels (20,8 Md€, DMTG 2024)' }
  };
  /**
   * Recettes sur les transmissions (Md€/an) : même formule que `modele.js` (`recettesTransmissions`) : flux × (1 − fuite × min(1,5 ; t / 0,5)) × t, avec une fuite
   * majorée de `ajout`. Le test vérifie l'égalité avec `M.recettesTransmissions` pour `palier1`.
   */
  function transmissionsMd(sc, h) {
    h = typeof h === 'string' ? HERITAGES[h] : h;
    if (h.actuels) return D.dmtgActuel;
    var fuite = (M.SCENARIOS[sc].fuiteTransm + h.ajout) * Math.min(1.5, h.t / 0.5);
    return D.transmissions * (1 - fuite) * h.t;
  }

  // ---------- Socle
  /** Socle (€ par mois et par adulte non retraité) de l'année n : final si pas de rampe ; linéaire de depart (année 1) au final (année N) puis constant. */
  function socleAn(o, n) {
    var fin = SOCLE_DEFAUT * o.socleFacteur;
    if (!o.rampe) return fin;
    var N = o.rampe.annees, d = o.rampe.depart === undefined ? fin / 2 : o.rampe.depart;
    if (N <= 1) return fin;
    return d + (fin - d) * Math.min(1, Math.max(0, (n - 1) / (N - 1)));
  }
  function stOption(o, n) { return F(P1.stFor({}), { tPlat: o.tPlat, socle: socleAn(o, n === undefined ? 99 : n) }); }

  // ---------- Recettes patrimoniales (§ 24-26)
  /**
   * Recettes patrimoniales nouvelles (Md€/an) pour un scénario du palier 1. Le taux appliqué au capital est le taux plat (le modèle du palier 1 taxe déjà le capital courant au taux plat) ;
   * `pfu50` ne compte que le SURPLUS d'un taux de 50 % sur le taux plat (bilan(t = 0,5) − bilan(t = taux plat)). Pas de double compte avec l'héritage :
   * la réalisation au décès AVEC crédit sur les droits est nulle quand les droits sont au moins égaux à l'impôt sur le gain (héritage à 40-50 % : le crédit absorbe tout),
   * et ne compte que contre les droits actuels ; la réalisation SANS crédit (« cumul ») est donnée à part, nette des droits qu'elle fait baisser (taux marginal de droits = taux de l'héritage). H425-H428.
   */
  function patrimoine(o, sc) {
    var s = SC_PATRIMOINE[sc], h = HERITAGES[o.heritage], tK = o.pfu50 ? 0.5 : o.tPlat, out = { report150: 0, deces: 0, pfu50: 0, avDeces: 0, total: 0 };
    if (o.report150) out.report150 = PF.report150Flux(s, { t: tK }).recettesNouvelles;
    if (o.deces === 'carryover') out.deces = DR.carryover(s, { t: tK }).annee(10);
    else if (o.deces === 'credit' || o.deces === 'creditHaut') {
      if (h.actuels) { var c = DR.realisationCredit(s, { t: tK }); out.deces = o.deces === 'credit' ? c.recettesBasse : c.recettes; }
      else out.deces = 0;
    } else if (o.deces === 'cumul') {
      var r = DR.realisationDeces(s, { t: tK, deductible: false }), marg = h.actuels ? DR.PARAM[s].margDmtg : h.t * (1 - (M.SCENARIOS[sc].fuiteTransm + h.ajout));
      out.deces = r.brutes * (1 - marg);
    }
    if (o.pfu50 && o.tPlat < 0.5) out.pfu50 = PF.bilan(s, { t: 0.5, deces: 'statuQuo' }).soldeNet - PF.bilan(s, { t: o.tPlat, deces: 'statuQuo' }).soldeNet;
    if (o.finPurgeAV) out.avDeces = PF.assuranceVieDeces(s, { t: tK }).recettesNouvelles;   // Q5 : base réelle, taux du prélèvement sur le capital de l'option
    out.total = out.report150 + out.deces + out.pfu50 + out.avDeces;
    return out;
  }

  // ---------- Économies de dépenses de la synthèse (hors santé, déjà dans le palier 1)
  var ECO = {   // [favorable (palier 1 bas), central, défavorable] ; modeles/synthese/modele.js ECONOMIES, CIR
    aucune: [0, 0, 0],
    prudentes: [0.54 + 0.16, 0.54 + 0.16, 0.54 + 0.16],             // agences (Sénat 2025) 0,54 + SNU (Cour 2024) 0,16 ; le chèque énergie (0,76) est exclu : redondant avec le socle
    volontaires: [0.7 + 4.6, 0.7 + 4.6, 0.7 + 2.2]                  // + primes à l'apprentissage (IGF 2022) 4,6 ; 2,2 Md€ d'aide au PLF 2026 en défavorable (V6323)
  };
  var CIR = { inchange: 0, recentre: 3.4, supprime: 8.0 };           // T11 § 3 ; effet sur la R&D et l'innovation non chiffré
  function economies(o, sc) { return ECO[o.economies][SCS.indexOf(sc)] + CIR[o.cir]; }

  // ---------- Réforme immobilière et taxe de 1 % sur le patrimoine (03/11/2026)
  /** Solde net de la réforme immobilière (Md€/an, scénario croisé), 0 si l'option est absente. */
  function immobilier(o, sc) {
    if (!o.immobilier) return 0;
    var m = PI(); if (!m) throw new Error('option immobilier : charger dvf_patrimoine.js et patrimoine_immobilier.js');
    return m.bilan(SC_PATRIMOINE[sc]).soldeNet;
  }
  /** Recette nette de la taxe de 1 % (Md€/an, scénario croisé) ; DMTO déduits par la taxe seulement si la réforme immobilière n'est pas en place. */
  function taxePatrimoine(o, sc) {
    if (!o.taxePatrimoine) return 0;
    var m = TP(); if (!m) throw new Error('option taxePatrimoine : charger taxe_patrimoine.js');
    return m.recette(SC_PATRIMOINE[sc], F(o.taxePatrimoine, { avecReformeImmo: !!o.immobilier })).nette;
  }

  // ---------- Solde
  /** Décomposition du solde public (Md€/an, déficit actuel compris, santé comprise) de l'option, régime de croisière à l'année n (rampe) ou final. */
  function detail(o, sc, n) {
    o = opt(o);
    var st = stOption(o, n), base = P1.solde(st, sc), h = HERITAGES[o.heritage], p = patrimoine(o, sc);
    var dT = transmissionsMd(sc, h) - transmissionsMd(sc, 'palier1'), e = economies(o, sc), im = immobilier(o, sc), tp = taxePatrimoine(o, sc);
    return { base: base, transmissions: dT, report150: p.report150, deces: p.deces, pfu50: p.pfu50, avDeces: p.avDeces, economies: e, immobilier: im, taxePatrimoine: tp,
             total: base + dT + p.total + e + im + tp, socle: st.socle };
  }
  function solde(o, sc, n) { return detail(o, sc, n).total; }
  function soldes(o, n) { var r = {}; SCS.forEach(function (s) { r[s] = solde(o, s, n); }); return r; }
  /** Solde moyen des `annees` premières années (défaut 10) : la rampe du socle ne change que les premières années ; sans rampe = solde de croisière. Sans création de valeur ni transition. */
  function soldeMoyen(o, sc, annees) {
    annees = annees || 10; o = opt(o);
    if (!o.rampe) return solde(o, sc);
    var i, s = 0; for (i = 1; i <= annees; i++) s += solde(o, sc, i);
    return s / annees;
  }
  /** Solde l'année 10 avec la création de valeur affectée au déficit (palier1.valeurPourScenario ; `sansE` : sans la croissance par l'IA, la plus fragile). */
  function soldeAn10(o, sc, sansE) {
    var v = P1.valeurPourScenario(10, sc);
    return solde(o, sc, 10) + (sansE ? v.sansE : v.total);
  }
  /** Plus petit taux plat (balayage d'un point puis dichotomie) tel que le solde du scénario ≥ cible (défaut 0 = équilibre) ; null si aucun jusqu'à tmax (le solde n'est pas monotone en tPlat). */
  function platEquilibre(o, cible, sc, tmax) {
    o = opt(o); cible = cible === undefined ? 0 : cible; sc = sc || 'central'; tmax = tmax || 0.8;
    var f = function (t) { return solde(F(o, { tPlat: t }), sc) - cible; }, t, prev = 0.2, i;
    if (f(prev) >= 0) return prev;
    for (t = 0.21; t <= tmax + 1e-9; t = Math.round((t + 0.01) * 100) / 100) {
      if (f(t) >= 0) { var a = prev, b = t; for (i = 0; i < 30; i++) { var m = (a + b) / 2; if (f(m) >= 0) b = m; else a = m; } return b; }
      prev = t;
    }
    return null;
  }

  // ---------- Qui paie : déciles, taux marginaux, comportement
  /** Écart de revenu disponible par décile (€/mois, central, par rapport au droit actuel) et taux marginaux effectifs : réutilise `modele.js effetsParDecile` (le module gagnants-perdants/ est calé sur l'ancien système à 1 000 € et 50 %). */
  function deciles(o, n) {
    o = opt(o);
    var st = stOption(o, n), d = M.effetsParDecile(F(O.configR(st), { scenario: 'central' })), mm = P1.marginalMax(st);
    return { socle: st.socle, tPlat: st.tPlat, parDecile: d.map(function (b) { return { id: b.id, ecartMois: b.ecartMois, partGagnants: b.partGagnants, tauxMarginal: b.tauxMarginalEff }; }),
             marginalMax: mm.personnel, marginalMaxIS: mm.combine };
  }
  /**
   * Érosion par réaction de comportement des seuls leviers de taux plat et de socle (central) : Δ de `M.solde` (hors correctifs du palier 1) entre l'option et le palier 1, avec réactions (élasticités de T4, eti, eps, facPart…)
   * et sans réactions. part = 1 − Δ avec / Δ sans (part du gain statique perdue). null si Δ sans réaction nul.
   */
  function erosion(o, sc) {
    o = opt(o); sc = sc || 'central';
    var pv = function (st, reac) { return M.solde(F(O.configR(st), { scenario: sc, reactions: reac })).soldePublic; };
    var st0 = stOption(BASE), st1 = stOption(o);
    var dSans = pv(st1, false) - pv(st0, false), dAvec = pv(st1, true) - pv(st0, true);
    return { dStatique: dSans, dAvecReactions: dAvec, part: Math.abs(dSans) < 1e-9 ? null : 1 - dAvec / dSans };
  }

  var API = { SCS: SCS, SC_PATRIMOINE: SC_PATRIMOINE, BASE: BASE, HERITAGES: HERITAGES, ECO: ECO, CIR: CIR, SOCLE_DEFAUT: SOCLE_DEFAUT, opt: opt, transmissionsMd: transmissionsMd, socleAn: socleAn, stOption: stOption,
    patrimoine: patrimoine, economies: economies, immobilier: immobilier, taxePatrimoine: taxePatrimoine, detail: detail, solde: solde, soldes: soldes, soldeMoyen: soldeMoyen, soldeAn10: soldeAn10, platEquilibre: platEquilibre, deciles: deciles, erosion: erosion };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.OptionsFinancement = API;
})(this);
