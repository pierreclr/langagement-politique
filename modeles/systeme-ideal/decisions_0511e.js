/*
 * modeles/systeme-ideal/decisions_0511e.js — v5.6 (05/11/2026, matin) : décision de l'auteur du 05/11/2026 :
 * le dispositif retraites V6 COMPLET est compté dans le taux, et sa trajectoire est affichée année par année.
 * Dispositif : âge de référence indexé (2/3 des années d'espérance de vie gagnées), âge libre à coefficient neutre, départ à 60 ans sans réduction (pénibilité),
 * plancher de 1 300 €, indexation (−0,5 point au-dessus de 2 000 €), contribution de 20 % au-dessus de 2 500 € nets (modeles/retraites/age_libre.js, bilanReference).
 *
 * Trois corrections de double compte ou d'omission, faites ici (rien n'est modifié dans les modules existants ; la v5.5 reste reproductible par D.solde()) :
 *   (1) CONTRIBUTION DES HAUTES PENSIONS : le V6 compte 6,61 Md€ de contribution de 20 % au-dessus de 2 500 € nets (pension seule, retraités résidents), mais la v5.5 la compte déjà
 *       (ligne N03, retraites2.js : 11,97 Md€ au central, pension + capital, nette de la fuite). La part de V6 est RETIRÉE de l'effet ajouté (H787).
 *   (2) PLANCHER DE 1 300 € : annoncé dans le dispositif, mais absent des montants de resultats.md (bilanReference n'additionne que âge de référence, âge libre, pénibilité, indexation,
 *       hautes pensions, substitution). Son coût est AJOUTÉ ici (age_libre.js pauvreteAnticipee, plancher 1 300 € : 2,7 / 4,8 / 6,8 Md€ en régime), avec une montée en charge (H788).
 *   (3) S04 ET S05 (régimes spéciaux, catégories actives ; ligne H21 du bilan) : NON COMPTÉS. Le V6 porte sur l'ensemble des départs (cohorte de 0,77 M par an, tous régimes) : l'âge de
 *       référence indexé et la pénibilité déplacent déjà l'âge de départ des actifs de ces régimes. Les ajouter compterait deux fois les mêmes départs (H789). Réserve plafonnée à +2,45 Md€.
 *
 * Trajectoire : l'effet est lu ANNÉE PAR ANNÉE (modèle de cohortes), non par interpolation entre 2030, 2040 et 2060 (Optimum.retraitesV6Annee) ; H786. L'année 1 du modèle est 2029
 * (stress.js) ; avant 2029, aucun effet. Md€ de 2025 par an, ordre des scénarios du modèle [bas = favorable, central, haut = défavorable].
 * Taux d'équilibre « de croisière » = taux à l'année 2060 (comme Optimum.retraitesV6Annee : constant après 2060) ; l'effet continue de croître jusqu'en 2070 (sensibilité fournie, H790).
 * Dette : chemin de stress.js prolongé à 30 ans et plus (H791 : création de valeur gelée à son niveau de l'année 10), avec et sans V6 ; correction du levier D chiffrée sans modifier palier1.js (H792).
 * Des hypothèses et des ordres de grandeur, jamais des prédictions. Hypothèses H786 à H792 (methode.md § 40).
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511d.js (jusqu'à decisions_0511d.js), puis ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var B = root.Decisions0511b || (req ? req('./decisions_0511b.js') : null);
  var C = root.Decisions0511c || (req ? req('./decisions_0511c.js') : null);
  var D = root.Decisions0511d || (req ? req('./decisions_0511d.js') : null);
  var ST = root.Stress || (req ? req('../risques/stress.js') : null);
  var P1 = root.Palier1 || (req ? req('./palier1.js') : null);
  var A = root.AgeLibre || (req ? req('../retraites/age_libre.js') : null);
  var SCS = ['bas', 'central', 'haut'];
  var REF = ['favorable', 'central', 'defavorable'];   // scénarios de modeles/retraites/age_libre.js (SCENARIOS_REF), appariés au modèle : bas = favorable
  function i(sc) { return SCS.indexOf(sc); }

  var HYP = {
    tPlat: 0.42,
    // H786 : première année de l'effet (année 1 du modèle de dette, stress.js) et dernière année de la trajectoire calculée
    annee1: 2029, anneeFin: 2070,
    // H788 : plancher de pension de 1 300 € (décision de l'auteur du 03/11) ; part de la pension brute, comme age_libre.js pauvreteAnticipee
    plancher: 1300, debutDispositif: 2028, rampeCohortes: 3,
    // H790 : année de croisière du dispositif (valeur de 2060 : constante au-delà dans Optimum.retraitesV6Annee) ; sensibilité en 2070
    anneeCroisiere: 2060,
    // H789 : S04 (régimes spéciaux, 0,45) et S05 (catégories actives, 2,0), chiffrage-statuts-regimes.md : pleine charge à ≈ 35 ans, 0 avant 10 ans ; NON comptés (recoupent V6)
    s04: 0.45, s05: 2.0, s04s05Zero: 10, s04s05Plein: 35,
    // H791 : création de valeur de palier1.js gelée à son niveau de l'année 10 au-delà (la croissance IA de +0,3 %/an du PIB du levier E s'extrapole à 59 Md€ à l'année 30 : non retenu)
    anneeGel: 10,
    // H792 : levier D de palier1.js (recettes de la réorientation de la complexité, Md€/an en plein régime) : actuel 1,5 / 6,4 / 14,1 ; corrigé proposé 1,5 / 4,1 / 8,4 (sources/chiffrage-reorientation-complexite.md)
    //        ordre [favorable, central, défavorable] du MODÈLE inversé : bas = gains forts. Rapport nouveau / ancien appliqué à D(n) ; palier1.js n'est PAS modifié (décision de l'auteur en attente).
    levierDNouveau: { bas: 8.4, central: 4.1, haut: 1.5 }
  };

  function F(a, o) { var r = {}, k; for (k in a) r[k] = a[k]; for (k in o) r[k] = o[k]; return r; }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 1. Effet du dispositif V6 année par année, net des doubles comptes
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var _bil = {}, _pl = {}, _hp = null, _surv = null;
  function bilan(sc) {
    if (!_bil[sc]) { var ys = [], y; for (y = HYP.debutDispositif; y <= HYP.anneeFin + 5; y++) ys.push(y); _bil[sc] = A.bilanReference(REF[i(sc)], { annees: ys }).annees; }
    return _bil[sc];
  }
  /** Contribution des hautes pensions comptée par le dispositif V6 (Md€/an, constante, pension seule des retraités résidents) : déjà comprise dans la ligne N03 de la v5.5. */
  function hautesPensionsV6() { if (_hp === null) _hp = A.contributionHautes({}).recetteMdE; return _hp; }
  /** Part de la contribution des hautes pensions déjà comptée dans la v5.5 (Md€/an, central ; retraites2.js, pension + capital, nette de la fuite). */
  function hautesPensionsV55(sc) { return root.Retraites2 ? root.Retraites2.contribution(F(P1.HP, {}), sc).netMd : (req ? req('./retraites2.js').contribution(F(P1.HP, {}), sc).netMd : null); }
  /** Coût du plancher de 1 300 € en régime (Md€/an) : age_libre.js pauvreteAnticipee, avec le décalage de l'âge libre du scénario (passageLibre × 4 ans). */
  function plancherRegime(sc) {
    if (_pl[sc] === undefined) _pl[sc] = A.pauvreteAnticipee({ plancher: HYP.plancher, delta: A.SCENARIOS_REF[REF[i(sc)]].passageLibre * (64 - 60) }).coutPlancherEnRegimeMdE;
    return _pl[sc];
  }
  /** Montée en charge du plancher à l'année an (0 à 1) : les cohortes qui partent à 60 ans depuis 2028 (montée en 3 ans, comme age_libre.js) s'accumulent, pondérées par leur survie ;
   *  1 = stock de régime (toutes les cohortes d'un âge de 60 à 110 ans). */
  function monteePlancher(an) {
    if (_surv === null) { _surv = []; var k; for (k = 0; k <= 50; k++) _surv.push(A.survie(60, 60 + k + 0.5)); }
    var plein = 0, s = 0, k2;
    for (k2 = 0; k2 < _surv.length; k2++) plein += _surv[k2];
    for (k2 = 0; k2 <= an - HYP.debutDispositif && k2 < _surv.length; k2++) {
      var age = an - (HYP.debutDispositif + k2), w = Math.min(1, (k2 + 1) / HYP.rampeCohortes);
      s += w * _surv[Math.min(_surv.length - 1, Math.max(0, age))];   // cohorte partie à l'année debut + k : ancienneté de départ = âge − 60, survie de 60 à cet âge
    }
    return Math.min(1, s / plein);
  }
  /** Coût du plancher à l'année an (Md€/an, positif = coût). */
  function plancher(sc, an) { return an < HYP.debutDispositif ? 0 : plancherRegime(sc) * monteePlancher(an); }
  /** Effet BRUT du dispositif V6 tel que chiffré par modeles/retraites (solde public, Md€/an ; + améliore) : celui de resultats.md (−20,8 en 2030, −5,9 en 2040, +20,1 en 2060 au central). */
  function v6Brut(sc, an) { return an < HYP.annee1 ? 0 : bilan(sc)[an].soldeMdE; }
  /** Effet NET ajouté au solde de la v5.5 (Md€/an ; + améliore) = brut − contribution des hautes pensions déjà comptée − coût du plancher de 1 300 €. */
  function v6Net(sc, an) { return an < HYP.annee1 ? 0 : v6Brut(sc, an) - hautesPensionsV6() - plancher(sc, an); }
  /** Composantes du dispositif à l'année an (Md€/an ; + améliore le solde) : âge de référence (pensions + recettes), âge libre (idem), pénibilité, niveau (indexation), substitution, plancher ;
   *  `hautesPensions` figure pour mémoire (déjà dans la v5.5, retirée du net). Somme des composantes sauf hautesPensions = net. */
  function composantes(sc, an) {
    var b = bilan(sc)[an];
    var r = { ageReference: b.ageReferenceMdE + b.ageReferenceRecettesMdE, ageLibre: b.ageLibreMdE + b.ageLibreRecettesMdE, penibilite: b.penibiliteMdE, indexation: b.indexationMdE,
              substitution: b.substitutionMdE, plancher: -plancher(sc, an), hautesPensions: b.hautesPensionsMdE };
    r.net = r.ageReference + r.ageLibre + r.penibilite + r.indexation + r.substitution + r.plancher;
    r.brut = b.soldeMdE; r.depensePensions = -(b.ageReferenceMdE + b.ageLibreMdE + b.penibiliteMdE + b.indexationMdE); r.recettes = b.recettesMdE;
    return r;
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 2. Solde et taux d'équilibre année par année
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /** Solde (Md€/an) de la v5.6 à l'année an, au scénario sc, au taux t (défaut 42 %) : solde de la v5.5 (croisière) + effet net du dispositif V6 de l'année. */
  function solde(sc, an, t) { return D.solde(sc, 0, t === undefined ? HYP.tPlat : t) + v6Net(sc, an); }
  var _g = null;
  function grille() {
    if (_g === null) { _g = []; var k; for (k = 0; k <= 24; k++) { var t = 0.38 + 0.005 * k; _g.push([t, D.solde('central', 0, t)]); } }
    return _g;
  }
  /** Taux plat (fraction) auquel le solde central de la v5.5 vaut v : la grille de 0,5 point encadre la racine, puis bisection sur le modèle complet (précision 0,0001 point) ; hors de [38 % ; 50 %] : extrapolation linéaire. */
  function tauxPourSolde(v) {
    var g = grille(), k, lo, hi, j;
    if (v <= g[0][1]) return g[0][0] + (g[1][0] - g[0][0]) * (v - g[0][1]) / (g[1][1] - g[0][1]);
    if (v >= g[g.length - 1][1]) { var m = g.length - 1; return g[m][0] + (g[m][0] - g[m - 1][0]) * (v - g[m][1]) / (g[m][1] - g[m - 1][1]); }
    for (k = 0; k < g.length - 1; k++) if (v >= g[k][1] && v <= g[k + 1][1]) break;
    lo = g[k][0]; hi = g[k + 1][0];
    for (j = 0; j < 22; j++) { var mid = (lo + hi) / 2; if (D.solde('central', 0, mid) >= v) hi = mid; else lo = mid; }
    return hi;
  }
  /** Taux d'équilibre central de l'année an (solde v5.6 ≥ 0) ; précision : 0,0001 point. */
  function tauxEquilibre(an) { return tauxPourSolde(-v6Net('central', an)); }
  /** Trajectoire de la première année du modèle à l'année fin (défaut 2070) : une ligne par année. */
  function trajectoire(fin) {
    var rows = [], y;
    for (y = HYP.annee1; y <= (fin || HYP.anneeFin); y++) {
      var c = composantes('central', y);
      rows.push({ an: y, brut: { bas: v6Brut('bas', y), central: v6Brut('central', y), haut: v6Brut('haut', y) }, net: { bas: v6Net('bas', y), central: v6Net('central', y), haut: v6Net('haut', y) },
        solde: { bas: solde('bas', y), central: solde('central', y), haut: solde('haut', y) }, taux: tauxEquilibre(y), composantes: c });
    }
    return rows;
  }
  var JALONS = [2030, 2035, 2040, 2050, 2060];
  /** Taux d'équilibre de croisière (année 2060 ; sensibilité à une autre année an), et taux maximal pendant le creux (année et valeur). */
  function croisiere(an) { var y = an || HYP.anneeCroisiere; return { an: y, net: v6Net('central', y), solde: solde('central', y), taux: tauxEquilibre(y) }; }
  function creux() {
    var best = null, y;
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) { var t = tauxEquilibre(y); if (best === null || t > best.taux) best = { an: y, taux: t, net: v6Net('central', y), solde: solde('central', y) }; }
    return best;
  }
  /** Marge à t (défaut 42 %) : le solde de la v5.5 est-il assez grand pour absorber le creux ? Années où le solde central de la v5.6 est négatif, manque maximal, manque cumulé (Md€ de 2025), puis première année de retour à l'équilibre. */
  function lissage(t) {
    var tt = t === undefined ? HYP.tPlat : t, y, n = 0, max = 0, maxAn = null, cum = 0, premiere = null, derniere = null, cumGlobal = 0, retour = null, cumulSerie = 0, pic = 0, picAn = null;
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) {
      var s = solde('central', y, tt);
      cumGlobal += s; cumulSerie += s;
      if (cumulSerie < pic) { pic = cumulSerie; picAn = y; }
      if (retour === null && picAn !== null && cumulSerie >= 0) retour = y;
      if (s < 0) { n++; cum += -s; if (premiere === null) premiere = y; derniere = y; if (-s > max) { max = -s; maxAn = y; } }
    }
    return { taux: tt, marge: D.solde('central', 0, tt), anneesDeficit: n, premiere: premiere, derniere: derniere, manqueMax: max, manqueMaxAn: maxAn, manqueCumule: cum,
             pointsManquants: max / pointDeTaux(), cumulSurPeriode: cumGlobal, picDuCumul: pic, picDuCumulAn: picAn, anneeRetourDuCumul: retour };
  }
  /** Md€ par point de taux plat (solde central de la v5.5 à 43 % moins à 42 %). */
  function pointDeTaux() { return D.solde('central', 0, 0.43) - D.solde('central', 0, 0.42); }
  /** Taux plat constant pour lequel la somme des soldes centraux de l'année a à l'année b est nulle (lissage par la dette, sans intérêts) ; bisection au millième de point. */
  function tauxLisse(a, b) {
    var lo = 0.38, hi = 0.50, k;
    function cum(t) { var s = 0, y; for (y = a; y <= b; y++) s += solde('central', y, t); return s; }
    for (k = 0; k < 30; k++) { var m = (lo + hi) / 2; if (cum(m) >= 0) hi = m; else lo = m; }
    return hi;
  }
  /** Réserve S04 + S05 (non comptée) à l'année an (Md€/an) : 0 avant 10 ans, montée linéaire jusqu'à la pleine charge à 35 ans (H789). */
  function reserveS04S05(an) {
    var n = an - HYP.annee1 + 1, plein = HYP.s04 + HYP.s05;
    if (n <= HYP.s04s05Zero) return 0;
    return plein * Math.min(1, (n - HYP.s04s05Zero) / (HYP.s04s05Plein - HYP.s04s05Zero));
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 3. Dette en % du PIB, prolongée à 30 ans et plus, avec et sans V6
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var _aj = {};
  /** Écart au solde du chemin « V5 » de stress.js (shocks.ajust) pour la v5.5 à t : écart de la v5.4 (plafonds, capital) + lignes de la v5.5 ; Md€/an de 2025. */
  function ajustementV55(t) {
    var key = Math.round(t * 1000);
    if (!_aj[key]) { var base = B.ajustement(C.archiV54(t), false), s = {}; SCS.forEach(function (sc) { s[sc] = D.somme(sc); }); _aj[key] = function (sc, n) { return base(sc, n) + s[sc]; }; }
    return _aj[key];
  }
  /** Création de valeur de l'année n (Md€/an), convention de palier1.js ; gel à l'année 10 (H791) ; levierD : 'actuel' (palier1.js) ou 'corrige' (H792). */
  function valeur(sc, n, o) {
    o = o || {};
    if (o.valeur === 'aucune') return 0;                                                  // sensibilité : aucune création de valeur (ni A, B, D, E) dans le chemin de dette
    var gel = o.gel === false ? n : Math.min(n, HYP.anneeGel), v = P1.valeurPourScenario(gel, sc), val = v.total;
    if (o.levierD === 'corrige') {
      var vsc = P1.APPARIEMENT[sc], dMax = P1.VAL.D[vsc][0] * 0.427;                    // D(n) = D_max × min(1, n / durée) ; rapport nouveau / ancien constant
      val = val - v.D + v.D * HYP.levierDNouveau[sc] / dMax;
    }
    return val;
  }
  /**
   * Dette / PIB année par année (année 1 = 2029) : même récurrence que ST.simuler sans choc (intérêts, croissance nominale de 3 %, 3 ans au droit actuel avant l'année 1), prolongée à o.n années (42 = 2070).
   * o : { n, taux (défaut 0,42), v6 (false | 'net' | 'brut'), gel (défaut true ; false = valeur extrapolée telle quelle), valeur ('aucune' = sans création de valeur), levierD ('actuel' | 'corrige') }. Retourne { ratio, dette, B, ratio0 }.
   */
  function dette(sc, o) {
    o = o || {};
    var N = o.n || 42, t = o.taux === undefined ? HYP.tPlat : o.taux, E = ST.ECO, g = E.gNominal, u, k;
    var aj0 = ajustementV55(t), v6 = o.v6;
    var aj = function (s, n) { return aj0(s, n) + (v6 === 'net' ? v6Net(s, 2028 + n) : v6 === 'brut' ? v6Brut(s, 2028 + n) : 0); };
    var Y0 = E.pib0, Dt = E.dette0, ieff = E.interets0 / E.dette0, out = { ratio: [], dette: [], B: [], pb: [] };
    for (u = 1; u <= ST.PREROLL; u++) { ieff = ieff + (E.imarche - ieff) / E.dureeDette; Dt = Dt - ((-169.1 + E.interets0) * Math.pow(1 + g, u) - ieff * Dt); }
    out.ratio0 = Dt / (Y0 * Math.pow(1 + g, ST.PREROLL));
    for (k = 1; k <= N; k++) {
      var kk = Math.pow(1 + g, k + ST.PREROLL), Y = Y0 * kk;
      ieff = ieff + (E.imarche - ieff) / E.dureeDette;
      var interets = ieff * Dt, pbs = ST.pbStruct('V5', sc, k, { ajust: aj, sansValeur: true }) + valeur(sc, k, o);
      var pb = (pbs + E.interets0) * kk, Bk = pb - interets;
      Dt = Dt - Bk; out.ratio.push(Dt / Y); out.dette.push(Dt); out.B.push(Bk); out.pb.push(pb);
    }
    return out;
  }
  /** Dette / PIB à 10, 20 et 30 ans (années 2038, 2048, 2058) : { r10, r20, r30, pic, picAn } pour une configuration. */
  function jalonsDette(sc, o) {
    var r = dette(sc, F(o || {}, { n: 42 })), pic = 0, pa = 0, k;
    for (k = 0; k < r.ratio.length; k++) if (r.ratio[k] > pic) { pic = r.ratio[k]; pa = HYP.annee1 + k; }
    return { r5: r.ratio[4], r10: r.ratio[9], r20: r.ratio[19], r30: r.ratio[29], r42: r.ratio[41], pic: pic, picAn: pa, serie: r.ratio };
  }

  var API = { HYP: HYP, SCS: SCS, JALONS: JALONS, hautesPensionsV6: hautesPensionsV6, hautesPensionsV55: hautesPensionsV55, plancherRegime: plancherRegime, monteePlancher: monteePlancher, plancher: plancher,
              v6Brut: v6Brut, v6Net: v6Net, composantes: composantes, solde: solde, tauxPourSolde: tauxPourSolde, tauxEquilibre: tauxEquilibre, trajectoire: trajectoire, croisiere: croisiere, creux: creux,
              lissage: lissage, pointDeTaux: pointDeTaux, tauxLisse: tauxLisse, reserveS04S05: reserveS04S05, ajustementV55: ajustementV55, valeur: valeur, dette: dette, jalonsDette: jalonsDette };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511e = API;
})(this);
