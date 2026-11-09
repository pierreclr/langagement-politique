/*
 * modeles/systeme-ideal/variante_dette_stable.js — variante « dette stabilisée » (arbitrage 40 du 05/11/2026) sur la v5.10 adoptée (decisions_0511j.js).
 *   Décision de l'auteur : la dette ne doit pas grossir (en part du PIB), sans être remboursée à marche forcée ; leviers pour baisser les prélèvements : retraites (baisse légère)
 *   et masse salariale publique ; défense exclue de toute économie.
 *   (1) CIBLE : déficit stabilisant (d × g / (1 + g)) ; taux de prélèvement de base constant (ou plan à deux paliers) qui garde la dette / PIB au niveau de fin 2028 à 10, 20 et 30 ans ;
 *       sensibilité à la croissance et aux taux d'intérêt (macro : référence / prudente / favorable ; choc de +1 point) ; conformité aux règles budgétaires européennes de 2024.
 *   (2) LEVIER RETRAITES : quatre familles d'options graduées (sous-indexation temporaire au-dessus d'un seuil, contribution des hautes pensions relevée, alignement CSG / abattement,
 *       prise en compte du capital), rendement par scénario et effets par décile de pension et par décile de patrimoine (copule gaussienne de t47_pensions_patrimoine.py).
 *   (3) LEVIER MASSE SALARIALE : non-remplacement ciblé (hors régalien, soins, éducation déjà comptée), modération du point d'indice, temps de travail ; défense exclue partout.
 *   (4) COMBINAISON : stabilisation + levier retraites modéré + levier masse salariale modéré : taux, prélèvements obligatoires, cas types, dette.
 * MODULE PARAMÉTRABLE : les leviers sont des fonctions (scénario, année) → Md€ de 2025 (+ améliore le solde) ; la cible de dette ne dépend que d'une fonction de taux et d'un effet net :
 *   on peut la rebrancher sur la v6 (bareme_unique_v6.js) en passant o.net (effet net annuel) et o.taux.
 * Euros de 2025 ; Md€/an ; €/mois par personne pour les effets individuels. Des hypothèses et des ordres de grandeur, jamais des prédictions. Hypothèses HDS1 à HDS30
 * (sources/chiffrage-dette-stable-retraites-masse-salariale.md § 7). Convention des scénarios : bas = favorable, haut = défavorable (comme tous les modules).
 * Ce module ne modifie AUCUN module existant (ST.ECO est modifié temporairement pour la macro, puis restauré dans un `finally`, comme dans risques/stress.js).
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511j.js (jusqu'à decisions_0511j.js), puis variante_dette_stable.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  function need(n, f) { return root[n] || (req ? req(f) : null); }
  var D = need('Decisions0511d', './decisions_0511d.js'), G = need('Decisions0511g', './decisions_0511g.js'), H = need('Decisions0511h', './decisions_0511h.js');
  var I = need('Decisions0511i', './decisions_0511i.js'), J = need('Decisions0511j', './decisions_0511j.js'), ST = need('Stress', '../risques/stress.js');
  var R2 = need('Retraites2', './retraites2.js'), P1 = need('Palier1', './palier1.js'), FA = need('FiscaliteActuelle', './fiscalite_actuelle.js'), M = need('SystemeIdeal', './modele.js');
  var SCS = ['bas', 'central', 'haut'];
  function idx(sc) { return SCS.indexOf(sc); }

  var HYP = {
    annee1: 2029, anneeFin: 2070, horizons: [10, 20, 30],
    // HDS1 : macro. Référence = paramètres du modèle (risques/stress.js R3, R5 : g nominal 3 % = 1,2 réel + 1,8 inflation ; OAT 10 ans 3,45 %).
    //        Prudente : croissance nominale 2,5 % (≈ 0,9 réel + 1,6) et OAT 3,95 % (r − g = 1,45 point) ; favorable : 3,5 % et 3,0 % (r < g). Ce sont des hypothèses de Claude, encadrées dans le § 2 du chiffrage.
    macro: { reference: { g: 0.03, r: 0.0345 }, prudente: { g: 0.025, r: 0.0395 }, favorable: { g: 0.035, r: 0.030 } },
    chocTaux: 0.01,                         // HDS2 : choc de taux de marché de +1 point (OAT), permanent dès 2029, transmis au taux moyen au rythme du renouvellement (durée 8 ans, R4)
    tBas: 0.25, tHaut: 0.55,                // bornes de recherche du taux (le modèle calcule le solde à tout taux ; résidu de la v5.10 extrapolé hors de 38-43 %, HDS3)
    ecartPaliers: 0.01,                     // HDS4 : plan à deux paliers de même forme que la v5.10 (taux de transition = taux de croisière + 1 point jusqu'en 2044)
    finTransition: 2044,
    // HDS5 : règles européennes (règlement (UE) 2024/1263, art. 6 et 7 ; règlement 1467/97 modifié par 2024/1264) : déficit ≤ 3 % ; dette > 90 % : baisse moyenne ≥ 1 point de PIB par an
    //        sur la période d'ajustement (7 ans pour la France, plan 2025-2031 ; ici 2029-2035 pour un plan nouveau) ; ensuite, dette sur une pente « plausiblement décroissante » (10 ans après).
    ue: { plafondDeficit: 0.03, baisseMin: 0.01, seuilDette: 0.90, ansAjustement: 7, ansApres: 10 },
    // ---------- Retraites (distribution : retraites2.js, DREES EIR 2020 nette × 1,155 ; 16,5 M de retraités)
    seuilRetraites: 2500,                   // HDS6 : seuil commun de toutes les options : 2 500 € nets par mois (2025), celui de la contribution N03 : 82 % des retraités sous le seuil (arbitrage 10)
    N03: P1 ? P1.HP : { seuil: 2500, taux: 0.20, base: 'total', majCapital: 0 },
    // HDS7 : sous-indexation temporaire (option R1) : prix − écart sur la part de pension au-dessus du seuil, pendant `ans` années à partir de 2029, EN PLUS du dispositif V6
    //        (qui sous-indexe déjà de 0,5 point la part au-dessus de 2 000 € bruts, central) ; le stock de pensions touchées s'éteint ensuite au rythme des décès (4 % par an, HDS8).
    sousIndexation: { modere: { ecart: 0.01, ans: 3 }, fort: { ecart: 0.01, ans: 6 } },
    deces: 0.04,
    // HDS9 : contribution des hautes pensions relevée (R2) : modéré = 25 % au lieu de 20 % au-dessus de 2 500 € ; fort = 25 % puis 30 % au-dessus de 4 000 €
    hautesPensions: { modere: { taux: 0.25 }, fort: { taux: 0.25, tauxHaut: 0.30, seuilHaut: 4000 } },
    // HDS10 : alignement (R3) : sur la part de pension au-dessus du seuil seulement (pas d'effet de seuil) : CSG de 9,2 % (actifs) au lieu de 8,3 % et abattement de 10 % de l'impôt
    //         sur le revenu limité à la part sous le seuil ; impôt calculé pour un retraité seul (fiscalite_actuelle.js) : un couple paie autrement (⚠️ V14907)
    alignement: { csgActifs: 0.092, csgRetraites: 0.083 },
    // HDS11 : capital (R4) : majoration de 10 % sur la part du capital dans l'assiette de N03 (option `majCapital` de retraites2.js, écartée par H108)
    capital: { majCapital: 0.10 },
    // HDS12 : patrimoine des ménages retraités et taxe de 1 % : part des ménages retraités dans le patrimoine brut (9,9 M de ménages × 416 153 € / 31 M × 374 900 €, HVP 2024,
    //         t47_pensions_patrimoine_resultats.txt § 1 et § 5) ; part des 60 ans et plus : ménages 60-69 et 70+ (patrimoine moyen HVP 2024) pondérés par leur part des ménages ⚠️ V14903
    patrimoine: { menagesRetraites: 9.9e6, menages: 31e6, moyenRetraites: 416153, moyenEnsemble: 374900, partRetraitesSc: { bas: 0.30, central: 0.355, haut: 0.40 },
                  moyen6069: 462500, moyen70: 420300, part6069: 0.165, part70: 0.245, tfMenages: 26.202,
                  // copule (t47_pensions_patrimoine.py) : rho(pension, patrimoine) = 0,768 × 0,65 ; patrimoine brut des ménages retraités log-normal (médiane 246 438 €, D9 909 902 €)
                  rho: 0.499, medianeW: 246438, d9W: 909902 },
    // ---------- Masse salariale publique (Insee, comptes nationaux 3.201 ; Insee Première n° 2094 : 5 876 700 agents fin 2024 ; economies-effectifs-publics-ia.md)
    masse: {
      remuneration2024: 363.0, remuneration2025: 370.0, agents: 5876700,
      // HDS13 : périmètre du non-remplacement (M1) : hors défense, sécurité intérieure, justice, fonction publique hospitalière (soins) et éducation nationale (déjà comptée en D20) ⚠️ V14904
      exclus: { defense: 270000, securite: 254000, justice: 92000, hospitaliere: 1249900, education: 1060000 },
      territoriale: 2039400,
      tauxDepart: 0.025,                    // HDS14 : départs à la retraite par an, en part des effectifs ⚠️ V14904
      deja: { gestion: 21452 },             // HDS15 : départs non remplacés déjà comptés (gestion supprimée, optimum.js GESTION ; D19 nul au central ; D20 hors périmètre)
      nonRemplacement: { modere: { part: 1 / 4, ans: 10 }, fort: { part: 1 / 2, ans: 10 } },
      realisation: { bas: 0.9, central: 0.7, haut: 0.45 },   // HDS16 : part réalisée (les collectivités ne sont pas tenues ; besoins nouveaux ; contrats de Cahors 2018-2019 comme précédent)
      // HDS17 : point d'indice (M2) : coût d'une hausse de 1 % du point pour les trois versants (1,85 à 2,07 Md€ selon la presse spécialisée, non lu en primaire) ; défense retirée (5,5 % de la masse) ⚠️ V14905 ;
      //         le point est gelé depuis le 01/07/2023 (4,92278 €) et le PLF 2027 prolonge le gel (avis HCFP 2026-5, p. 2 et 28) : l'option porte sur 2029 et après, EN PLUS
      coutPoint1pc: 2.0, partDefense: 0.055, inflation: 0.018,
      point: { modere: { ecart: 0.005, ans: 4 }, fort: { ecart: 0.018, ans: 2 } },   // modéré : prix − 0,5 point pendant 4 ans ; fort : gel 2 ans (inflation de 1,8 %)
      // HDS18 : temps de travail (M3) : 27 000 ETP (ordre de grandeur attribué au rapport Laurent de 2016 par la presse, non lu en primaire) dans le périmètre hors soins et hors défense,
      //         convertis en postes non remplacés sur 5 ans ⚠️ V14906
      tempsTravail: { gainHeures: 27000 / (5876700 - 270000 - 1249900), ans: 5, perimetre: 5876700 - 270000 - 1249900, realisation: { bas: 0.8, central: 0.5, haut: 0.25 } }
    },
    pibModele: 2935                         // PIB 2024 du bilan global (bilan_global.py), pour les parts de prélèvements obligatoires
  };

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 1. Dette : récurrence de decisions_0511g.js, avec une fonction de taux, un effet net et des leviers ; macro paramétrable
  // ------------------------------------------------------------------------------------------------------------------------------------------
  function macro(m) { return typeof m === 'string' ? HYP.macro[m] : (m || null); }
  /** Exécute fn() avec une croissance nominale g et un taux de marché r provisoires (ST.ECO), restaurés ensuite. */
  function avecMacro(m, fn) {
    var E = ST.ECO, g0 = E.gNominal, r0 = E.imarche, mm = macro(m);
    try { if (mm) { if (mm.g !== undefined) E.gNominal = mm.g; if (mm.r !== undefined) E.imarche = mm.r + (mm.choc || 0); } return fn(); }
    finally { E.gNominal = g0; E.imarche = r0; }
  }
  function cst(t) { return function () { return t; }; }
  function plan510() { return J.planTaux(HYP.finTransition); }
  function fTaux(t) { return typeof t === 'function' ? t : (t === undefined ? plan510() : cst(t)); }
  /** Effet net de la v5.10 ajouté au modèle de base (H.net + résidu de la mesure au taux de l'année). Rebranchable : o.net remplace cette fonction (ex. v6). */
  function net510(ft) { return function (s, y) { return H.net(s, y) + (y < HYP.annee1 ? 0 : J.residu(ft(y), s)); }; }
  /**
   * Trajectoire de dette (année 1 = 2029, 42 ans) : o = { taux (nombre | fonction an → taux ; défaut : plan v5.10 43 % jusqu'en 2044), leviers (fonction (sc, an) → Md€ de 2025, + améliore),
   * net (fonction (sc, an) → Md€, remplace l'effet net v5.10), valeur ('aucune' : sans création de valeur), macro ('reference' | 'prudente' | 'favorable' | { g, r, choc }) }.
   * Retourne { ratio0 (fin 2028), ratio[], deficit[] (% PIB, + = déficit), interets[] (% PIB), primaire[] (% PIB, + = excédent), annees[] }.
   */
  function trajectoire(sc, o) {
    o = o || {};
    var ft = fTaux(o.taux), lev = o.leviers || null, nf = o.net || net510(ft);
    return avecMacro(o.macro, function () {
      var r = G.dette(sc, { n: 42, taux: ft, valeur: o.valeur, net: function (s, y) { return nf(s, y) + (lev && y >= HYP.annee1 ? lev(s, y) : 0); } });
      var E = ST.ECO, g = E.gNominal, Y0 = E.pib0, Dt = E.dette0, ieff = E.interets0 / E.dette0, u, k;
      for (u = 1; u <= ST.PREROLL; u++) { ieff = ieff + (E.imarche - ieff) / E.dureeDette; Dt = Dt - ((-169.1 + E.interets0) * Math.pow(1 + g, u) - ieff * Dt); }
      var out = { ratio0: Dt / (Y0 * Math.pow(1 + g, ST.PREROLL)), dette0: Dt, ratio: r.ratio, dette: r.dette, deficit: [], interets: [], primaire: [], annees: [] }, prev = Dt;
      for (k = 1; k <= 42; k++) {
        var Y = Y0 * Math.pow(1 + g, k + ST.PREROLL); ieff = ieff + (E.imarche - ieff) / E.dureeDette;
        var it = ieff * prev, Dk = r.dette[k - 1];
        out.deficit.push((Dk - prev) / Y); out.interets.push(it / Y); out.primaire.push((prev - Dk + it) / Y); out.annees.push(2028 + k); prev = Dk;
      }
      return out;
    });
  }
  function jalons(tr) { return { r0: tr.ratio0, r10: tr.ratio[9], r20: tr.ratio[19], r30: tr.ratio[29], max30: Math.max.apply(null, tr.ratio.slice(0, 30)), def10: tr.deficit[9], def30: tr.deficit[29] }; }
  /** Déficit public (toutes administrations, intérêts compris) qui stabilise une dette d (part du PIB) avec une croissance nominale g : d × g / (1 + g) ; solde primaire requis avec un taux apparent r. */
  function deficitStabilisant(d, g, r) { var rr = r === undefined ? g : r; return { total: d * g / (1 + g), primaireRequis: d * (rr - g) / (1 + g), interets: d * rr / (1 + g) }; }
  /** Déficit stabilisant à la dette de fin 2028 du modèle, en % du PIB et en Md€ de 2025 (PIB 2025 du modèle), sous une macro, avec le taux apparent de long terme (= taux de marché). */
  function cibleStabilisation(m) {
    return avecMacro(m, function () {
      var E = ST.ECO, tr = trajectoire('central', { taux: 0.42, macro: m }), d = tr.ratio0, s = deficitStabilisant(d, E.gNominal, E.imarche);
      return { macro: macro(m) || HYP.macro.reference, ratio0: d, deficitPct: s.total, deficitMd2025: s.total * E.pib0, primaireRequisPct: s.primaireRequis, interetsLongTermePct: s.interets,
               interetsLongTermeMd2025: s.interets * E.pib0, interets2025Md: E.interets0 };
    });
  }
  /**
   * Taux constant (dès 2029) qui garde la dette / PIB au plus au niveau de fin 2028 : mode 'horizon' (à l'année h seulement) ou 'chaque' (aucune année de 1 à h au-dessus).
   * o : mêmes options que trajectoire (leviers, net, valeur, macro) ; o.cible : ratio cible (défaut : ratio de fin 2028). Bisection ; null si hors des bornes.
   */
  function tauxStable(sc, h, mode, o) {
    o = o || {};
    function ok(t) {
      var oo = {}, k; for (k in o) oo[k] = o[k]; oo.taux = t;
      var tr = trajectoire(sc, oo), c = o.cible === undefined ? tr.ratio0 : o.cible;
      return mode === 'chaque' ? Math.max.apply(null, tr.ratio.slice(0, h)) <= c : tr.ratio[h - 1] <= c;
    }
    var lo = HYP.tBas, hi = HYP.tHaut, k;
    if (!ok(hi)) return null; if (ok(lo)) return lo;
    for (k = 0; k < 30; k++) { var m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    return hi;
  }
  /** Plan à deux paliers de la forme de la v5.10 : t + écart (2029 à finTransition), puis t ; t minimal pour qu'aucune année de 1 à h ne dépasse la dette de fin 2028. */
  function planDeuxPaliers(t, ecart, fin) { var e = ecart === undefined ? HYP.ecartPaliers : ecart, f = fin || HYP.finTransition; return function (an) { return an <= f ? t + e : t; }; }
  function tauxPlanStable(sc, h, o) {
    o = o || {};
    function ok(t) { var oo = {}, k; for (k in o) oo[k] = o[k]; oo.taux = planDeuxPaliers(t, o.ecart, o.fin); var tr = trajectoire(sc, oo); return Math.max.apply(null, tr.ratio.slice(0, h)) <= tr.ratio0; }
    var lo = HYP.tBas, hi = HYP.tHaut, k;
    if (!ok(hi)) return null;
    for (k = 0; k < 30; k++) { var m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    return hi;
  }
  /** Conformité aux règles européennes d'une trajectoire : années de déficit > 3 %, baisse moyenne de la dette sur les 7 premières années, pente sur les 10 suivantes. */
  function conformiteUE(tr) {
    var u = HYP.ue, au = [], k;
    for (k = 0; k < 30; k++) if (tr.deficit[k] > u.plafondDeficit + 1e-9) au.push(tr.annees[k]);
    var baisse = (tr.ratio0 - tr.ratio[u.ansAjustement - 1]) / u.ansAjustement, apres = tr.ratio[u.ansAjustement + u.ansApres - 1] - tr.ratio[u.ansAjustement - 1];
    var okDette = tr.ratio0 <= u.seuilDette || baisse >= u.baisseMin - 1e-9;
    return { anneesDeficitAuDessus3: au, baisseMoyenne7ans: baisse, variation10ansApres: apres, sauvegardeDette: okDette, deficit3: au.length === 0, plausiblementDecroissante: apres < 0,
             conforme: au.length === 0 && okDette && apres < 0 };
  }
  /** Taux constant minimal conforme aux trois critères européens (tous s'améliorent avec le taux) ; o : options de trajectoire. */
  function tauxUE(sc, o) {
    o = o || {};
    function ok(t) { var oo = {}, k; for (k in o) oo[k] = o[k]; oo.taux = t; return conformiteUE(trajectoire(sc, oo)).conforme; }
    var lo = HYP.tBas, hi = HYP.tHaut, k;
    if (!ok(hi)) return null;
    for (k = 0; k < 30; k++) { var m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    return hi;
  }
  /** Solde central (Md€ de 2025, intérêts de 2025 figés, comme le modèle) à l'année an au taux t, avec leviers éventuels. */
  function solde(sc, an, t, lev) { return D.solde(sc, 0, t) + H.net(sc, an) + J.residu(t, sc) + (lev ? lev(sc, an) : 0); }
  /** Md€ de solde par point de taux autour de t (croisière 2060, central, réactions comprises). */
  function mdParPoint(t, sc) { var s = sc || 'central'; return (solde(s, 2060, t + 0.005) - solde(s, 2060, t - 0.005)); }
  /** Prélèvement unique (Md€) au taux t (decisions_0511i.js) et baisse mécanique par rapport à 42 % et 43 %. */
  function baissePrelevement(t) { var pu = I.prelevementUnique(t); return { pu: pu, baisseVs42: I.prelevementUnique(0.42) - pu, baisseVs43: I.prelevementUnique(0.43) - pu }; }
  /** Sensibilité aux taux d'intérêt : dette (v5.10 et taux t) avec +1 point d'OAT ; taux stable recalculé ; surcroît d'intérêts à 10 ans (Md€ de 2025). */
  function sensibiliteTaux(t, h) {
    var hh = h || 20, chocM = { g: HYP.macro.reference.g, r: HYP.macro.reference.r, choc: HYP.chocTaux };
    var a = trajectoire('central', { taux: t }), b = trajectoire('central', { taux: t, macro: chocM });
    var v = trajectoire('central', {}), vb = trajectoire('central', { macro: chocM });
    var surcout10 = (b.interets[9] - a.interets[9]) * ST.ECO.pib0;
    return { taux: t, sans: jalons(a), avec: jalons(b), v510: jalons(v), v510choc: jalons(vb), interets10ansMd2025: surcout10, pointsEquivalents10ans: surcout10 / mdParPoint(t),
             tauxStableChoc: tauxStable('central', hh, 'chaque', { macro: chocM }), tauxStableRef: tauxStable('central', hh, 'chaque') };
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 2. Retraites : options graduées (distribution des pensions de retraites2.js ; capital par décile de pension, jeu « recherche »)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var NRET = M.DONNEES.retraites, CSG_TOT = FA.PENSIONS.csgCrdsCasa, CSG_DED = FA.PENSIONS.csgDeductible, AB = FA.PENSIONS.abattement;
  function pointsRetraites() { return R2.points().map(function (p) { return { pn: p.x * R2.REVAL, w: p.w, decile: p.decile, K: R2.capitalDecile(p.decile, 'recherche') }; }); }
  function n03Pension(pn) { var h = HYP.N03; return h.taux * Math.max(0, pn - h.seuil); }
  /** R1 : perte nette mensuelle d'un retraité de pension nette pn quand la part au-dessus du seuil baisse du facteur f (impôt sur le revenu et N03 recalculés). */
  function perteSousIndexation(pn, f, S) {
    var s = S === undefined ? HYP.seuilRetraites : S, d = f * Math.max(0, pn - s); if (d <= 0) return 0;
    return d - (FA.irRetraiteSeul(pn) - FA.irRetraiteSeul(pn - d)) / 12 - (n03Pension(pn) - n03Pension(pn - d));
  }
  /** R3 : hausse mensuelle de prélèvement d'un retraité seul (CSG au taux des actifs et abattement limité, sur la part au-dessus du seuil). */
  function hausseAlignement(pn, S) {
    var s = S === undefined ? HYP.seuilRetraites : S; if (pn <= s) return 0;
    var a = HYP.alignement, brut = 12 * pn / (1 - CSG_TOT), brutS = 12 * s / (1 - CSG_TOT), avant = brut * (1 - CSG_DED), avantS = brutS * (1 - CSG_DED);
    var csg = (a.csgActifs - a.csgRetraites) * (brut - brutS);
    var irNouveau = FA.irAn(avant - Math.min(AB.max, Math.max(AB.min, AB.taux * Math.min(avant, avantS))), 1, 0);
    return (csg + irNouveau - FA.irRetraiteSeul(pn)) / 12;
  }
  /** Facteur effectif de sous-indexation à l'année an (stock de pensions de 2029-2033 touché, éteint au rythme des décès). */
  function facteurSousIndexation(an, p) {
    var e = p.ecart, a0 = HYP.annee1, a1 = a0 + p.ans - 1, j, f = 0;
    for (j = a0; j <= Math.min(an, a1); j++) f += e * Math.pow(1 - e, j - a0) * Math.pow(1 - HYP.deces, an - j);
    return f;
  }
  var _ru = null;
  /** Perte nette totale (Md€/an) pour un facteur unitaire de sous-indexation (linéarisée à f = 3 %) : budget = perte nette des ménages (sans réaction). */
  function rendementUnitaireR1() {
    if (_ru !== null) return _ru;
    var f = 0.03, s = 0; pointsRetraites().forEach(function (p) { s += p.w * perteSousIndexation(p.pn, f); });
    return (_ru = s * 12 * NRET / 1e9 / f);
  }
  function n03(o, sc) { return R2.contribution(o, sc).netMd; }
  function optN03(x) { var o = {}, k; for (k in HYP.N03) o[k] = HYP.N03[k]; for (k in x) o[k] = x[k]; return o; }
  var _r = {};
  /** Rendement (Md€/an, + améliore le solde) d'une option retraites à l'année an, au scénario sc : id ∈ R1m, R1f, R2m, R2f, R3, R4. */
  function retraite(id, sc, an) {
    var s = sc || 'central', y = an === undefined ? 2040 : an; if (y < HYP.annee1) return 0;
    if (id === 'R1m' || id === 'R1f') return rendementUnitaireR1() * facteurSousIndexation(y, HYP.sousIndexation[id === 'R1m' ? 'modere' : 'fort']);
    var k = id + '|' + s; if (_r[k] !== undefined) return _r[k];
    var base = n03(HYP.N03, s), v;
    if (id === 'R2m') v = n03(optN03(HYP.hautesPensions.modere), s) - base;
    else if (id === 'R2f') v = n03(optN03(HYP.hautesPensions.fort), s) - base;
    else if (id === 'R4') v = n03(optN03(HYP.capital), s) - base;
    else if (id === 'R3') { var t = 0; pointsRetraites().forEach(function (p) { t += p.w * hausseAlignement(p.pn); }); v = t * 12 * NRET / 1e9 * (1 - R2.SCEN[s].fuitePension); }
    else throw new Error('option retraites inconnue : ' + id);
    return (_r[k] = v);
  }
  var OPTIONS_RETRAITES = {
    R1m: 'sous-indexation temporaire : prix − 1 point pendant 3 ans (2029-2031) sur la part au-dessus de 2 500 € nets',
    R1f: 'sous-indexation temporaire : prix − 1 point pendant 6 ans (2029-2034) sur la part au-dessus de 2 500 € nets',
    R2m: 'contribution des hautes pensions à 25 % (au lieu de 20 %) au-dessus de 2 500 € nets',
    R2f: 'contribution à 25 % de 2 500 à 4 000 € nets, puis 30 % au-dessus',
    R3: 'alignement sur les actifs au-dessus de 2 500 € nets : CSG 9,2 % au lieu de 8,3 %, abattement de 10 % limité à la part sous le seuil',
    R4: 'majoration de 10 % sur la part du capital dans l\'assiette de la contribution (prise en compte du patrimoine par ses revenus)'
  };
  /** Perte individuelle (€/mois) d'un retraité (pn, K) pour l'option id (en régime : R1 au facteur maximal, avant décès). */
  function perteIndiv(id, pn, K) {
    if (id === 'R1m' || id === 'R1f') { var p = HYP.sousIndexation[id === 'R1m' ? 'modere' : 'fort']; return perteSousIndexation(pn, 1 - Math.pow(1 - p.ecart, p.ans)); }
    if (id === 'R3') return hausseAlignement(pn);
    var o = id === 'R2m' ? HYP.hautesPensions.modere : id === 'R2f' ? HYP.hautesPensions.fort : HYP.capital;
    var a = R2.contributionIndiv(pn, K, optN03(o)), b = R2.contributionIndiv(pn, K, HYP.N03);
    return (a.pension + a.capital - b.pension - b.capital) / 12;
  }
  // Loi normale : densité, répartition (Abramowitz-Stegun 7.1.26 via erf), quantile (Acklam)
  function Phi(x) { var t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2); return x >= 0 ? (1 + y) / 2 : (1 - y) / 2; }
  function PhiInv(p) {
    var a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.3577518672690, -30.66479806614716, 2.506628277459239], b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572],
        c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783], d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416], q, r;
    if (p < 0.02425) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - 0.02425) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  var _grille = null;
  /** Grille pension × patrimoine (copule gaussienne, rho de t47) : nœuds { pn, w, decileP, decileW, W, K } ; K proportionnel au patrimoine, calé sur le capital moyen des retraités du modèle. */
  function grilleRetraites() {
    if (_grille) return _grille;
    var P = HYP.patrimoine, rho = P.rho, s = Math.sqrt(1 - rho * rho), sig = Math.log(P.d9W / P.medianeW) / 1.2815516, mu = Math.log(P.medianeW), nW = 20, cum = 0, out = [], kMoy = 0, wMoy = 0;
    pointsRetraites().forEach(function (p) {
      var zp = PhiInv(Math.min(1 - 1e-9, Math.max(1e-9, cum + p.w / 2))); cum += p.w; kMoy += p.w * p.K;
      for (var j = 0; j < nW; j++) {
        var zw = rho * zp + s * PhiInv((j + 0.5) / nW), W = Math.exp(mu + sig * zw);
        out.push({ pn: p.pn, w: p.w / nW, decileP: p.decile, decileW: Math.min(9, Math.floor(Phi(zw) * 10)), W: W, K0: p.K }); wMoy += p.w / nW * W;
      }
    });
    out.forEach(function (n) { n.K = n.W * kMoy / wMoy; });
    _grille = out; return out;
  }
  /** Effet par décile de pension et par décile de patrimoine (€/mois en moyenne par retraité du décile, part de la pension, part touchée). Capital : clé de retraites2.js (pension) ou grille (patrimoine). */
  function parDecile(id) {
    var P = [], W = [], k;
    for (k = 0; k < 10; k++) { P.push({ decile: k + 1, w: 0, perte: 0, pension: 0, touches: 0 }); W.push({ decile: k + 1, w: 0, perte: 0, pension: 0, touches: 0 }); }
    pointsRetraites().forEach(function (p) { var l = perteIndiv(id, p.pn, p.K), d = P[p.decile]; d.w += p.w; d.perte += p.w * l; d.pension += p.w * p.pn; if (l > 0.005) d.touches += p.w; });
    grilleRetraites().forEach(function (n) { var l = perteIndiv(id, n.pn, n.K), d = W[n.decileW]; d.w += n.w; d.perte += n.w * l; d.pension += n.w * n.pn; if (l > 0.005) d.touches += n.w; });
    function fin(a) { return a.map(function (d) { return { decile: d.decile, perteMois: d.perte / d.w, pensionMoyenne: d.pension / d.w, partPension: d.perte / d.pension, partTouchee: d.touches / d.w }; }); }
    return { pension: fin(P), patrimoine: fin(W) };
  }
  /** Part des retraités touchés et perte maximale observée sous le seuil (doit être nulle : arbitrage 10). */
  function respectSeuil(id) {
    var sous = 0, touches = 0, maxSous = 0;
    pointsRetraites().forEach(function (p) { var l = perteIndiv(id, p.pn, p.K); if (l > 0.005) touches += p.w; if (p.pn <= HYP.seuilRetraites) { maxSous = Math.max(maxSous, id === 'R2m' || id === 'R2f' || id === 'R4' ? perteIndiv(id, p.pn, 0) : l); sous += p.w; } });
    return { partSousSeuil: sous, partTouchee: touches, perteMaxSousSeuilSansCapital: maxSous };
  }
  /** Taxe de 1 % déjà payée par les ménages retraités (Md€/an), nette de la taxe foncière qu'ils payaient ; part des 60 ans et plus dans le patrimoine brut (contrôle de la prémisse). */
  function taxe1pcRetraites(sc) {
    var P = HYP.patrimoine, s = sc || 'central', part = P.partRetraitesSc[s], tx = I.taxe1pc().nette;
    var partCalc = P.menagesRetraites * P.moyenRetraites / (P.menages * P.moyenEnsemble), part60 = (P.part6069 * P.moyen6069 + P.part70 * P.moyen70) / P.moyenEnsemble;
    return { partPatrimoineRetraites: part, partCalculee: partCalc, partPatrimoine60plus: part60, taxe1pcTotale: tx, payeeParRetraites: tx * part, tfQuIlsPayaient: P.tfMenages * part,
             netNouveau: tx * part - P.tfMenages * part, parMenageAn: tx * part * 1e9 / P.menagesRetraites };
  }
  /** Taux marginal total sur 1 € de revenu du capital d'un retraité au-dessus du seuil (prélèvement unique au taux t + N03 + R4 éventuel) et équivalent de la taxe de 1 % pour un rendement r. */
  function cumulCapital(t, avecR4, rendement) { var r = rendement || 0.03, base = t + HYP.N03.taux + (avecR4 ? HYP.capital.majCapital : 0); return { surRevenu: base, taxe1pcEnPartDuRendement: 0.01 / r, total: base + 0.01 / r }; }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 3. Masse salariale publique (défense exclue)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var MS = HYP.masse;
  function coutMoyen() { return MS.remuneration2024 * 1e9 / MS.agents; }
  function perimetreM1() { var e = MS.exclus; return MS.agents - e.defense - e.securite - e.justice - e.hospitaliere - e.education; }
  /** Postes non remplacés cumulés à l'année an (option M1), déjà comptés retirés. */
  function postesM1(an, niveau) {
    var p = MS.nonRemplacement[niveau || 'modere'], n = Math.max(0, Math.min(p.ans, an - HYP.annee1 + 1)), brut = perimetreM1() * MS.tauxDepart * p.part * n;
    var deja = MS.deja.gestion * Math.min(1, n / 10);
    return Math.max(0, brut - deja);
  }
  function masse(id, sc, an) {
    var s = sc || 'central', y = an === undefined ? 2040 : an; if (y < HYP.annee1) return 0;
    if (id === 'M1m' || id === 'M1f') return postesM1(y, id === 'M1m' ? 'modere' : 'fort') * coutMoyen() / 1e9 * MS.realisation[s];
    if (id === 'M2m' || id === 'M2f') {
      var p = MS.point[id === 'M2m' ? 'modere' : 'fort'], n = Math.max(0, Math.min(p.ans, y - HYP.annee1 + 1)), pts = 100 * (1 - Math.pow(1 - p.ecart, n));
      return pts * MS.coutPoint1pc * (1 - MS.partDefense);
    }
    if (id === 'M3') { var t = MS.tempsTravail, k = Math.max(0, Math.min(t.ans, y - HYP.annee1 + 1)) / t.ans; return t.perimetre * t.gainHeures * k * coutMoyen() / 1e9 * t.realisation[s]; }
    throw new Error('option masse salariale inconnue : ' + id);
  }
  var OPTIONS_MASSE = {
    M1m: 'non-remplacement d\'un départ à la retraite sur quatre pendant 10 ans, hors défense, sécurité, justice, soins et éducation',
    M1f: 'non-remplacement d\'un départ sur deux pendant 10 ans, même périmètre',
    M2m: 'point d\'indice indexé sur les prix moins 0,5 point pendant 4 ans (bas de grille protégé par le minimum de traitement)',
    M2f: 'gel du point d\'indice pendant 2 ans',
    M3: 'alignement effectif sur 1 607 h (≈ 27 000 ETP hors soins et défense), converti en postes non remplacés sur 5 ans'
  };

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 4. Combinaisons, cas types, prélèvements obligatoires
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /** Fonction leviers (sc, an) → Md€ pour une liste d'options (ex. ['R1m', 'M1m']). */
  function leviers(ids) { return function (sc, an) { var s = 0; ids.forEach(function (id) { s += id.charAt(0) === 'R' ? retraite(id, sc, an) : masse(id, sc, an); }); return s; }; }
  var RECOMMANDE = ['R1f', 'R2m', 'M1m', 'M2m'];
  /** Prélèvements obligatoires (Md€, % du PIB 2024 du bilan) en croisière : v5.10 à 42 % (bilan global : 1 542,6 ; net des transferts : 1 443,3), puis au taux t avec les recettes retraites. */
  function prelevementsObligatoires(t, ids) {
    var base = 1542.6, baseNet = 1443.3, avant = 1253.2, d = I.prelevementUnique(0.42) - I.prelevementUnique(t), rec = 0;
    (ids || []).forEach(function (id) { if (id === 'R2m' || id === 'R2f' || id === 'R3' || id === 'R4') rec += retraite(id, 'central', 2060); });
    var po = base - d + rec, poNet = baseNet - d + rec;
    return { avantMd: avant, avantPct: avant / HYP.pibModele, v510Md: base, v510Pct: base / HYP.pibModele, apresMd: po, apresPct: po / HYP.pibModele, v510NetPct: baseNet / HYP.pibModele, apresNetPct: poNet / HYP.pibModele, baissePU: d, recettesRetraites: rec };
  }
  /** Cas types (écart au droit actuel, €/mois) de la v5.10 au taux t (I.casTypes de decisions_0511j.js) ; écart à la v5.10 à 43 % et à 42 %. */
  function casTypes(t) { var c = J.casTypes(t), c43 = J.casTypes(0.43), c42 = J.casTypes(0.42), out = {}, k; for (k in c) out[k] = { ecart: c[k], vsV510a43: c[k] - c43[k], vsV510a42: c[k] - c42[k] }; return out; }
  /** Retraités types (retraites2.js) : perte mensuelle de la combinaison (options R) en régime. */
  function retraitesTypes(ids) {
    return R2.CAS_RETRAITES.map(function (c) { var l = 0; (ids || []).forEach(function (id) { if (id.charAt(0) === 'R') l += perteIndiv(id, c.pn, c.K); }); return { id: c.id, libelle: c.libelle, pension: c.pn, capitalAn: c.K, perteMois: l }; });
  }
  /** Agent public type (catégorie C à 1,1 Smic, cadre A à 3 500 € brut) : perte de pouvoir d'achat de la modération du point (M2) contre le gain de la baisse du taux. ⚠️ approximation par le brut. */
  function agentType(brutMois, t, idPoint) {
    var p = MS.point[idPoint === 'M2f' ? 'fort' : 'modere'], perte = brutMois * 0.78 * (1 - Math.pow(1 - p.ecart, p.ans));
    var cout = FA.coutEmployeurDepuisNet(brutMois * 0.78), gain43 = cout * (0.43 - t), gain42 = cout * (0.42 - t);
    return { brut: brutMois, pertePointNetMois: perte, gainTauxVs43: gain43, gainTauxVs42: gain42, bilanVs43: gain43 - perte, bilanVs42: gain42 - perte };
  }
  /** Synthèse d'une combinaison : taux stable (constant, 'chaque' sur h ans, défaut 20), plan à deux paliers, dette par scénario, conformité UE, PO. */
  function combinaison(ids, o) {
    o = o || {}; var h = o.h || 20, lev = ids && ids.length ? leviers(ids) : null, oo = { leviers: lev, valeur: o.valeur };
    var t = tauxStable('central', h, 'chaque', oo), tp = tauxPlanStable('central', h, oo), tu = tauxUE('central', oo), dette = {}, detteUE = {};
    SCS.forEach(function (s) { dette[s] = jalons(trajectoire(s, { taux: t, leviers: lev, valeur: o.valeur })); detteUE[s] = jalons(trajectoire(s, { taux: tu, leviers: lev, valeur: o.valeur })); });
    var trc = trajectoire('central', { taux: t, leviers: lev, valeur: o.valeur });
    return { ids: ids || [], taux: t, tauxPlan: tp, tauxUE: tu, dette: dette, detteUE: detteUE, ue: conformiteUE(trc), po: prelevementsObligatoires(t, ids), poUE: prelevementsObligatoires(tu, ids), leviers2040: lev ? lev('central', 2040) : 0, leviers2060: lev ? lev('central', 2060) : 0 };
  }

  var API = { HYP: HYP, SCS: SCS, avecMacro: avecMacro, plan510: plan510, planDeuxPaliers: planDeuxPaliers, net510: net510, trajectoire: trajectoire, jalons: jalons, deficitStabilisant: deficitStabilisant,
              cibleStabilisation: cibleStabilisation, tauxStable: tauxStable, tauxPlanStable: tauxPlanStable, conformiteUE: conformiteUE, tauxUE: tauxUE, solde: solde, mdParPoint: mdParPoint,
              baissePrelevement: baissePrelevement, sensibiliteTaux: sensibiliteTaux,
              OPTIONS_RETRAITES: OPTIONS_RETRAITES, pointsRetraites: pointsRetraites, perteSousIndexation: perteSousIndexation, hausseAlignement: hausseAlignement, facteurSousIndexation: facteurSousIndexation,
              rendementUnitaireR1: rendementUnitaireR1, retraite: retraite, perteIndiv: perteIndiv, Phi: Phi, PhiInv: PhiInv, grilleRetraites: grilleRetraites, parDecile: parDecile, respectSeuil: respectSeuil,
              taxe1pcRetraites: taxe1pcRetraites, cumulCapital: cumulCapital,
              OPTIONS_MASSE: OPTIONS_MASSE, coutMoyen: coutMoyen, perimetreM1: perimetreM1, postesM1: postesM1, masse: masse,
              leviers: leviers, RECOMMANDE: RECOMMANDE, prelevementsObligatoires: prelevementsObligatoires, casTypes: casTypes, retraitesTypes: retraitesTypes, agentType: agentType, combinaison: combinaison };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.VarianteDetteStable = API;
})(this);
