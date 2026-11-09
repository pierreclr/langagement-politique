/*
 * modeles/systeme-ideal/decisions_0511h.js — v5.8 (05/11/2026, soir) : décisions de l'auteur du 05/11 (arbitrages 7, 34, 36, 37 et socle en détention) intégrées à la v5.7 (decisions_0511g.js) :
 *   (1) TAUX DE TRANSITION DE 43 % (arbitrage 37) : 43 % de 2029 à une année b, puis 42 % ; b = la plus courte période pour laquelle le cumul des soldes centraux ne passe JAMAIS sous zéro
 *       (aucune dette supplémentaire, hors intérêts). Ensuite, année à partir de laquelle un taux inférieur à 42 % est possible sans créer de dette, et taux minimal correspondant.
 *   (2) CIR : reste supprimé (8 Md€ déjà comptés) ; 3 Md€ par an sont réorientés vers l'entreprise d'État (calcul public, recherche publique) : DÉPENSE de 3,0 (arbitrage 7).
 *       Option NON adoptée : montée progressive vers 8 Md€ (+0,5 Md€ par an de 2030 à 2039).
 *   (3) FIOUL DE CHAUFFAGE TAXÉ FORT, gaz de ville non surtaxé (arbitrage 36) : part fioul de la ligne chauffage de la fiscalité d'orientation (sources/sortie-fioul-gaz.md § 8) : 0,36 Md€ à pleine charge,
 *       montée de 2027 à 2031, érosion du parc ; central = scénario « tendance » ; le gaz (1,95 Md€ au bas) reste NON compté.
 *   (4) RECETTES TARIFAIRES DES TRANSPORTS DE PROVINCE CORRIGÉES (V13481) : 1,5 / 1,6 / 1,7 Md€ au lieu de 1,3 ; ET précision de l'auteur du 05/11 (coordinateur) : toute la chaîne de billetterie s'arrête
 *       (systèmes, distribution, portiques, contrats) ; les contrôleurs sont REDÉPLOYÉS (agents de présence et de sécurité), sans perte d'emploi : leur coût ne se compte pas comme économie.
 *   (5) SOCLE SUSPENDU PENDANT LA DÉTENTION (positions L762, P-198) : économie estimée sur 90 020 détenus au 01/09/2026, selon la composition (condamnés, prévenus), les ressources et l'éligibilité ; adopté au central.
 * Tout est en Md€ de 2025 par an ; des hypothèses et des ordres de grandeur, jamais des prédictions. Hypothèses H807 à H816 (methode.md § 43).
 * Convention des scénarios : bas = favorable, haut = défavorable (comme tous les modules). Pour l'économie en détention, « bas/central/haut » de l'économie = défavorable/central/favorable : voir detention().
 * Ce module ne modifie AUCUN module existant. La v5.7 reste reproductible par decisions_0511g.js.
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511g.js (jusqu'à decisions_0511g.js), puis decisions_0511h.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var D = root.Decisions0511d || (req ? req('./decisions_0511d.js') : null);
  var E = root.Decisions0511e || (req ? req('./decisions_0511e.js') : null);
  var G = root.Decisions0511g || (req ? req('./decisions_0511g.js') : null);
  var SCS = ['bas', 'central', 'haut'];
  function i(sc) { return SCS.indexOf(sc); }

  var HYP = {
    tPlat: 0.42, tTransition: 0.43, annee1: 2029, anneeFin: 2070,
    // H807 : CIR réorienté : dépense constante de 3,0 Md€ par an à partir de l'année 1 (2029), tous scénarios ; option de montée vers 8 Md€ : +0,5 par an de 2030 à 2039 (NON adoptée)
    cirReoriente: 3.0, cirMax: 8.0, cirPasMontee: 0.5, cirAnneeMontee: 2030,
    // H808 : fioul (sources/sortie-fioul-gaz.md § 8) : recettes par année (Md€), élasticité 0,5, +15 % à pleine charge (2031) ; colonnes = scénarios du modèle : bas (favorable) = « démographie seule », central = « tendance », haut = « avec politique »
    fioulPoints: {
      bas:     { 2027: 0.07, 2028: 0.14, 2029: 0.20, 2030: 0.26, 2031: 0.31, 2035: 0.28, 2040: 0.25 },
      central: { 2027: 0.06, 2028: 0.12, 2029: 0.17, 2030: 0.21, 2031: 0.24, 2035: 0.19, 2040: 0.14 },
      haut:    { 2027: 0.06, 2028: 0.11, 2029: 0.15, 2030: 0.17, 2031: 0.18, 2035: 0.10, 2040: 0.05 }
    },
    fioulPleineCharge: 0.36, fioulGazAuBas: 2.31 - 0.36, fioulCredit: 0.58,
    // H809 : gratuité : recettes tarifaires de la province 1,5 / 1,6 / 1,7 (V13481) ; IDF urbain 2,97 inchangé
    recettesIDF: 2.97, recettesProvince: { bas: 1.5, central: 1.6, haut: 1.7 },
    // H810 : économie de collecte par scénario, en part des recettes perdues : systèmes billettiques et contrats (net de l'information voyageurs) ; distribution et encaissement ; renouvellement évité des équipements
    collecte: { bas: { systemes: 0.044, distribution: 0.030, equipements: 0.036 }, central: { systemes: 0.035, distribution: 0.020, equipements: 0.025 }, haut: { systemes: 0.025, distribution: 0.015, equipements: 0.010 } },
    // H811 : socle suspendu en détention
    detention: {
      detenus: 90020, condamnes0101: 62610, prevenus0101: 22131, detenus0101: 84741,
      // par scénario du modèle (bas = favorable = économie haute) : part des prévenus suspendus, part sans droit (étrangers hors droit, mineurs), montant mensuel suspendu (€)
      bas: { prevenus: 1.0, sansDroit: 0.05, mensuel: 350 + 487 }, central: { prevenus: 0.5, sansDroit: 0.10, mensuel: 350 + 0.5 * 487 }, haut: { prevenus: 0.0, sansDroit: 0.15, mensuel: 350 }
    },
    anneeDebutDetention: 2029
  };

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 1. Lignes ajoutées
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /** CIR réorienté vers l'entreprise d'État : dépense (Md€/an) à l'année an ; o.montee : option de montée progressive vers 8 Md€ (non adoptée). */
  function cir(an, o) {
    if (an < HYP.annee1) return 0;
    if (o && o.montee) return Math.min(HYP.cirMax, HYP.cirReoriente + HYP.cirPasMontee * Math.max(0, an - HYP.cirAnneeMontee + 1));
    return HYP.cirReoriente;
  }
  /** Recette de la taxe fioul (Md€/an) au scénario sc à l'année an : interpolation linéaire des points de § 8 ; après 2040, pente 2035-2040 prolongée, plancher 0 ; avant 2027 : 0. */
  function fioul(sc, an) {
    var p = HYP.fioulPoints[sc], ks = [2027, 2028, 2029, 2030, 2031, 2035, 2040], k;
    if (an < 2027) return 0;
    if (an >= 2040) return Math.max(0, p[2040] + (p[2040] - p[2035]) / 5 * (an - 2040));
    for (k = 0; k < ks.length - 1; k++) if (an >= ks[k] && an <= ks[k + 1]) return p[ks[k]] + (p[ks[k + 1]] - p[ks[k]]) * (an - ks[k]) / (ks[k + 1] - ks[k]);
    return 0;
  }
  function fioulCompte(sc, an) { return an < HYP.annee1 ? 0 : fioul(sc, an); }
  /** Coût net de la gratuité urbaine corrigée (Md€/an) et décomposition (formule de sources/chiffrage-gratuite-transports-urbains.md § 4.3, recettes de la province corrigées, collecte revue). */
  function gratuiteDetail(sc) {
    var p = G.HYP.gratuite[sc], hI = p[0], hP = p[1], k = p[2], inv = p[3], sA = p[5], c = HYP.collecte[sc];
    var rec = HYP.recettesIDF + HYP.recettesProvince[sc], oI = G.HYP.exploitationIDF * hI * k * (1 + inv), oP = G.HYP.exploitationProvince * hP * k * (1 + inv);
    var ecoSys = c.systemes * rec, ecoDis = c.distribution * rec, ecoEq = c.equipements * rec, eco = ecoSys + ecoDis + ecoEq;
    return { recettesPerdues: rec, recettesProvince: HYP.recettesProvince[sc], offreIDF: oI, offreProvince: oP, capacite: sA, economiesCollecte: -eco, collecteSystemes: ecoSys, collecteDistribution: ecoDis, collecteEquipements: ecoEq,
             partCollecte: c.systemes + c.distribution + c.equipements, net: rec + oI + oP + sA - eco };
  }
  function gratuite(sc) { return gratuiteDetail(sc).net; }
  function tu(sc, an) { return an < G.HYP.anneeDebut ? 0 : gratuite(sc); }
  /** Socle suspendu pendant la détention : économie (Md€/an, + améliore) et décomposition. */
  function detentionDetail(sc) {
    var d = HYP.detention, p = d[sc], pc = d.condamnes0101 / d.detenus0101, pp = d.prevenus0101 / d.detenus0101;
    var condamnes = d.detenus * pc, prevenus = d.detenus * pp, suspendus = condamnes + p.prevenus * prevenus, avecDroit = suspendus * (1 - p.sansDroit);
    return { detenus: d.detenus, condamnes: condamnes, prevenus: prevenus, suspendus: suspendus, avecDroit: avecDroit, mensuel: p.mensuel, economie: avecDroit * p.mensuel * 12 / 1e9,
             partPrevenusSuspendus: p.prevenus, sansDroit: p.sansDroit };
  }
  function detention(sc, an) { return an < HYP.anneeDebutDetention ? 0 : detentionDetail(sc).economie; }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 2. Effet net, solde, taux d'équilibre de la v5.8
  // ------------------------------------------------------------------------------------------------------------------------------------------
  function v6(sc, an) { return G.v6(sc, an); }
  function fo(sc, an) { return G.fo(sc, an); }
  /** Effet net ajouté à la v5.5 : V6 + fiscalité d'orientation + fioul − gratuité corrigée − CIR réorienté + socle suspendu en détention. o.montee : option CIR vers 8 Md€. */
  function net(sc, an, o) { return an < HYP.annee1 ? 0 : v6(sc, an) + fo(sc, an) + fioulCompte(sc, an) - tu(sc, an) - cir(an, o) + detention(sc, an); }
  function solde(sc, an, t, o) { return D.solde(sc, 0, t === undefined ? HYP.tPlat : t) + net(sc, an, o); }
  function tauxEquilibre(an, o) { return E.tauxPourSolde(-net('central', an, o)); }
  function pointDeTaux() { return E.pointDeTaux(); }
  function trajectoire() {
    var rows = [], y;
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) rows.push({ an: y, v6: v6('central', y), fo: fo('central', y), fioul: fioulCompte('central', y), tu: tu('central', y), cir: cir(y), detention: detention('central', y), net: net('central', y),
      solde: solde('central', y), taux: tauxEquilibre(y), soldeScenarios: { bas: solde('bas', y), central: solde('central', y), haut: solde('haut', y) } });
    return rows;
  }
  function creux() { var best = null, y; for (y = HYP.annee1; y <= HYP.anneeFin; y++) { var t = tauxEquilibre(y); if (best === null || t > best.taux) best = { an: y, taux: t, net: net('central', y), solde: solde('central', y) }; } return best; }
  function croisiere() { return { an: 2060, net: net('central', 2060), solde: solde('central', 2060), taux: tauxEquilibre(2060) }; }
  function lissage(t, sc, o) { return G.lissage(t, sc, { solde: (o && o.solde) || function (s, y, tt) { return solde(s, y, tt); } }); }
  function jalonsDette(sc, o) { o = o || {}; var oo = {}, k; for (k in o) oo[k] = o[k]; oo.net = o.net || function (s, y) { return net(s, y); }; return G.jalonsDette(sc, oo); }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 3. Taux de transition de 43 % : période minimale, descente sous 42 %
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var GRILLE = [0.38, 0.39, 0.40, 0.41, 0.42, 0.43], _sg = null;
  /** Soldes centraux année par année aux taux de la grille (cache). */
  function grille() {
    if (_sg) return _sg;
    _sg = {}; var y, g;
    for (g = 0; g < GRILLE.length; g++) { _sg[g] = {}; for (y = HYP.annee1; y <= HYP.anneeFin; y++) _sg[g][y] = solde('central', y, GRILLE[g]); }
    return _sg;
  }
  /** Solde central à l'année y au taux t (0,38 à 0,43) : interpolation linéaire entre les points de la grille (vérifiée contre le modèle dans le test). */
  function soldeGrille(y, t) {
    var s = grille(), g = Math.min(GRILLE.length - 2, Math.max(0, Math.floor((t - GRILLE[0]) / 0.01 + 1e-9))), w = (t - GRILLE[g]) / 0.01;
    return s[g][y] * (1 - w) + s[g + 1][y] * w;
  }
  /** Fonction taux (année → taux) du plan : 43 % de 2029 à b, 42 % de b + 1 à c − 1, puis tC à partir de c (c et tC optionnels). */
  function planTaux(b, c, tC) { return function (an) { return an <= b ? HYP.tTransition : (c !== undefined && an >= c ? tC : HYP.tPlat); }; }
  /** Parcours du cumul des soldes centraux (hors intérêts) sous un plan de taux (utilise la grille) : pic de dette (cumul minimal ≤ 0), année, cumul final, cumul par année. */
  function parcours(ft) {
    var y, cum = 0, pic = 0, picAn = null, serie = [];
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) { cum += soldeGrille(y, ft(y)); serie.push(cum); if (cum < pic - 1e-9) { pic = cum; picAn = y; } }
    return { picDuCumul: pic, picAn: picAn, cumulFinal: cum, serie: serie };
  }
  /** Plus petite année b telle que 43 % de 2029 à b puis 42 % ne laisse AUCUNE dette supplémentaire (cumul des soldes jamais négatif) ; null si aucune. */
  function periodeMinimale43() {
    var b;
    for (b = HYP.annee1; b <= HYP.anneeFin; b++) if (parcours(planTaux(b)).picAn === null) return b;
    return null;
  }
  /** Taux minimal tC (≥ 0,38) à partir de l'année c, après 43 % jusqu'en b et 42 % jusqu'en c − 1, sans cumul négatif ; bisection sur la grille. */
  function tauxMinimalDepuis(b, c) {
    var lo = GRILLE[0], hi = HYP.tPlat, k;
    if (parcours(planTaux(b, c, lo)).picAn === null) return lo;
    for (k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (parcours(planTaux(b, c, m)).picAn === null) hi = m; else lo = m; }
    return hi;
  }
  /** Première année c > b à partir de laquelle on peut descendre d'au moins `seuil` (défaut 0,05 point) sous 42 % sans créer de dette ; { an, taux, points }. */
  function descenteSous42(b, seuil) {
    var c, s = seuil === undefined ? 0.0005 : seuil;
    for (c = b + 1; c <= HYP.anneeFin; c++) { var t = tauxMinimalDepuis(b, c); if (t <= HYP.tPlat - s) return { an: c, taux: t, points: (HYP.tPlat - t) * 100 }; }
    return null;
  }
  /** Plan complet : 43 % jusqu'à b, 42 % ensuite (b = période minimale par défaut) ; lissage, dette à 10, 20, 30 ans, pic du cumul à 42 % constant pour comparaison. */
  function planTransition(b) {
    var bb = b === undefined ? periodeMinimale43() : b, ft = planTaux(bb), p = parcours(ft);
    return { b: bb, ans: bb - HYP.annee1 + 1, parcours: p, taux: ft, dette: jalonsDette('central', { taux: ft }) };
  }

  var JALONS = [2030, 2035, 2040, 2050, 2060];
  var API = { HYP: HYP, SCS: SCS, JALONS: JALONS, cir: cir, fioul: fioul, fioulCompte: fioulCompte, gratuite: gratuite, gratuiteDetail: gratuiteDetail, tu: tu, detention: detention, detentionDetail: detentionDetail,
              v6: v6, fo: fo, net: net, solde: solde, tauxEquilibre: tauxEquilibre, pointDeTaux: pointDeTaux, trajectoire: trajectoire, creux: creux, croisiere: croisiere, lissage: lissage, jalonsDette: jalonsDette,
              GRILLE: GRILLE, soldeGrille: soldeGrille, planTaux: planTaux, parcours: parcours, periodeMinimale43: periodeMinimale43, tauxMinimalDepuis: tauxMinimalDepuis, descenteSous42: descenteSous42, planTransition: planTransition };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511h = API;
})(this);
