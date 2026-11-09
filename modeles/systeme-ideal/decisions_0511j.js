/*
 * modeles/systeme-ideal/decisions_0511j.js — v5.10 (05/11/2026, nuit) : décision de l'auteur du 05/11 (arbitrage 38) intégrée à la v5.9 (decisions_0511i.js) :
 *   LE COUPLE À DEUX SMIC : solution (a) du chantier A de la v5.9, ADOPTÉE :
 *     - bonus d'activité individuel de 100 € par mois et par actif (forme de C.bonus : montée de 0 à 0,5 Smic brut, plein de 0,5 à 1 Smic, extinction linéaire jusqu'à 1,25 Smic) ;
 *     - financé par la reprise progressive du socle (350 €) entre 4 700 et 9 400 € de revenu mensuel individuel (coût employeur + revenus du capital) : socle entier en dessous de 4 700 €,
 *       repris linéairement dans la zone, plus versé du tout au-dessus de 9 400 €.
 *   Les bornes sont ARRONDIES (4 700 / 9 400) : la v5.9 calait la zone au central à 43 % (4 697,7 / 9 395,5) ; l'arrondi coûte 0,01 Md€ par an (résidu central à 43 % : −0,01).
 *   La bascule neutre des collectivités (partie B de la v5.9) est reprise sans changement (transfert interne aux administrations publiques, effet nul sur le solde).
 * Le module sort : le solde (année par année, trois scénarios), le plan de taux (43 % de 2029 à b, puis 42 % : b recalculé), la dette à 10, 20 et 30 ans, les cas types et le taux marginal près du Smic.
 * Euros de 2025-2026 ; €/mois par foyer pour les cas types, Md€/an pour les coûts. Des hypothèses et des ordres de grandeur, jamais des prédictions. Hypothèses H835 à H840 (methode.md § 45).
 * Convention des scénarios : bas = favorable, haut = défavorable (comme tous les modules). Ce module ne modifie AUCUN module existant ; la v5.9 reste reproductible par decisions_0511i.js.
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511i.js (jusqu'à decisions_0511i.js), puis decisions_0511j.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var C = root.Decisions0511c || (req ? req('./decisions_0511c.js') : null);
  var E = root.Decisions0511e || (req ? req('./decisions_0511e.js') : null);
  var H = root.Decisions0511h || (req ? req('./decisions_0511h.js') : null);
  var I = root.Decisions0511i || (req ? req('./decisions_0511i.js') : null);
  var F = (root.Voies || (req ? req('./voies.js') : null)).fus;
  var SCS = ['bas', 'central', 'haut'];

  var HYP = {
    t43: 0.43, t42: 0.42, annee1: 2029, anneeFin: 2070,
    // H835 : bonus d'activité adopté : 100 € par actif et par mois, plein jusqu'au Smic, éteint à 1,25 Smic (H819 de la v5.9, forme H763)
    bonus: 100, bonusFin: 1.25,
    // H836 : reprise du socle adoptée : zone [4 700 ; 9 400] € de revenu mensuel individuel, bornes arrondies de la zone calée en v5.9 (H820)
    ra: 4700, rb: 9400,
    // H837 : grille de taux du plan (celle de decisions_0511h.js) : le résidu de la mesure (recette − coût) est calculé à chaque point et interpolé linéairement
    grille: [0.38, 0.39, 0.40, 0.41, 0.42, 0.43]
  };
  var CORR = { ra: HYP.ra, rb: HYP.rb };

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 1. La mesure : architecture, coût, recette, résidu
  // ------------------------------------------------------------------------------------------------------------------------------------------
  function base(t) { return I.archiBase(t === undefined ? HYP.t42 : t); }
  /** Architecture v5.10 au taux t : v5.8 + bonus d'activité (la reprise du socle est un correctif du haut, CORR, appliqué par I.recetteHaut et I.apres). */
  function archi(t) { return F(base(t), { bonusActivite: HYP.bonus, bonusFin: HYP.bonusFin }); }
  var _m = {};
  /** Coût brut du bonus, recette nette de la reprise (après réactions) et résidu (Md€/an, croisière) au taux t et au scénario sc. */
  function mesure(t, sc) {
    var tt = t === undefined ? HYP.t42 : t, s = sc || 'central', k = tt + '|' + s;
    if (_m[k]) return _m[k];
    var b = base(tt), a = archi(tt), cout = C.solde(b, s, false) - C.solde(a, s, false), recette = I.recetteHaut(a, s, CORR).netMd;
    return (_m[k] = { t: tt, sc: s, cout: cout, recette: recette, residu: recette - cout });
  }
  /** Résidu (Md€/an) au taux t quelconque : interpolation linéaire entre les points de la grille (extrapolation au-delà). */
  function residu(t, sc) {
    var g = HYP.grille, n = g.length, j = Math.min(n - 2, Math.max(0, Math.floor((t - g[0]) / 0.01 + 1e-9))), w = (t - g[j]) / (g[j + 1] - g[j]);
    return mesure(g[j], sc).residu * (1 - w) + mesure(g[j + 1], sc).residu * w;
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 2. Solde, plan de taux, dette
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /** Effet net ajouté à la v5.5 (comme H.net) + résidu de la mesure au taux t (défaut 42 %). */
  function net(sc, an, t) { return an < HYP.annee1 ? 0 : H.net(sc, an) + residu(t === undefined ? HYP.t42 : t, sc); }
  /** Solde v5.10 = solde v5.9 (= v5.8, bascule neutre) + résidu de la mesure au même taux. */
  function solde(sc, an, t) { var tt = t === undefined ? HYP.t42 : t; return I.solde(sc, an, tt) + (an < HYP.annee1 ? 0 : residu(tt, sc)); }
  function soldeGrille(y, t) { return H.soldeGrille(y, t) + residu(t, 'central'); }
  function planTaux(b, c, tC) { return H.planTaux(b, c, tC); }
  function parcours(ft) {
    var y, cum = 0, pic = 0, picAn = null, serie = [];
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) { cum += soldeGrille(y, ft(y)); serie.push(cum); if (cum < pic - 1e-9) { pic = cum; picAn = y; } }
    return { picDuCumul: pic, picAn: picAn, cumulFinal: cum, serie: serie };
  }
  /** Plus petite année b telle que 43 % de 2029 à b puis 42 % ne crée aucune dette supplémentaire (cumul central hors intérêts jamais négatif). */
  function periodeMinimale43() { var b; for (b = HYP.annee1; b <= HYP.anneeFin; b++) if (parcours(planTaux(b)).picAn === null) return b; return null; }
  function tauxMinimalDepuis(b, c) {
    var lo = HYP.grille[0], hi = HYP.t42, k;
    if (parcours(planTaux(b, c, lo)).picAn === null) return lo;
    for (k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (parcours(planTaux(b, c, m)).picAn === null) hi = m; else lo = m; }
    return hi;
  }
  function descenteSous42(b, seuil) {
    var c, s = seuil === undefined ? 0.0005 : seuil;
    for (c = b + 1; c <= HYP.anneeFin; c++) { var t = tauxMinimalDepuis(b, c); if (t <= HYP.t42 - s) return { an: c, taux: t, points: (HYP.t42 - t) * 100 }; }
    return null;
  }
  /** Taux d'équilibre central de l'année an (solde ≥ 0), le résidu de la mesure étant pris à 42 % (variation < 0,01 Md€ par point : H838). */
  function tauxEquilibre(an) { return E.tauxPourSolde(-net('central', an)); }
  function creux() { var best = null, y; for (y = HYP.annee1; y <= HYP.anneeFin; y++) { var t = tauxEquilibre(y); if (best === null || t > best.taux) best = { an: y, taux: t, solde: solde('central', y) }; } return best; }
  function croisiere() { return { an: 2060, solde: solde('central', 2060), soldeV59: I.solde('central', 2060), taux: tauxEquilibre(2060) }; }
  /** Dette / PIB (10, 20, 30 ans) sous le plan de taux ft (défaut : 43 % jusqu'à la période minimale, puis 42 %), par scénario ; le résidu suit le taux de chaque année. */
  function dette(sc, ft) {
    var f = ft || planTaux(periodeMinimale43());
    return H.jalonsDette(sc, { taux: f, net: function (s, y) { return H.net(s, y) + (y < HYP.annee1 ? 0 : residu(f(y), s)); } });
  }
  function dette42(sc) { var f = function () { return HYP.t42; }; return dette(sc, f); }
  function planTransition() {
    var b = periodeMinimale43(), ft = planTaux(b), p = parcours(ft), out = { b: b, ans: b - HYP.annee1 + 1, parcours: p, dette: {}, dette42: {}, detteV59: {} };
    SCS.forEach(function (s) { out.dette[s] = dette(s, ft); out.dette42[s] = dette42(s); out.detteV59[s] = H.jalonsDette(s, { taux: H.planTaux(2044) }); });
    out.plan2044 = parcours(planTaux(2044));
    out.descente = descenteSous42(b);
    return out;
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 3. Ménages : cas types, taux marginal près du Smic, personnes touchées, plafond
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /** Écart au droit actuel (€/mois) des cas types de la v5.9 au taux t, avec la mesure (et sans : v5.9). */
  function casTypes(t) { return I.casTypes(archi(t), {}, CORR); }
  function casTypesV59(t) { return I.casTypes(base(t)); }
  /** Revenu disponible mensuel (€) avant / après d'un cas type au taux t. */
  function revenu(id, t) { return { avant: I.avant(id, archi(t)), apres: I.apres(archi(t), id, {}, CORR) }; }
  function tmeSmic(t) { return I.tmeSmic(archi(t), {}, CORR); }
  function tmeSmicV59(t) { return I.tmeSmic(base(t)); }
  function touches() { return I.touches(archi(HYP.t43), CORR); }
  function marginalMax(t) { return I.marginalMax(archi(t), CORR); }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 4. Bascule des collectivités : reprise de la v5.9 (clé en points de taux inchangée)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  function bascule(t) { return I.bascule(t); }

  var API = { HYP: HYP, CORR: CORR, SCS: SCS, base: base, archi: archi, mesure: mesure, residu: residu, net: net, solde: solde, soldeGrille: soldeGrille, planTaux: planTaux, parcours: parcours,
              periodeMinimale43: periodeMinimale43, tauxMinimalDepuis: tauxMinimalDepuis, descenteSous42: descenteSous42, tauxEquilibre: tauxEquilibre, creux: creux, croisiere: croisiere,
              dette: dette, dette42: dette42, planTransition: planTransition, casTypes: casTypes, casTypesV59: casTypesV59, revenu: revenu, tmeSmic: tmeSmic, tmeSmicV59: tmeSmicV59,
              touches: touches, marginalMax: marginalMax, bascule: bascule };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511j = API;
})(this);
