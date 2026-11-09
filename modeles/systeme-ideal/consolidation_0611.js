// Consolidation du 06/11/2026 (soir), demandée par l'auteur avant toute décision finale. Couche NON ADOPTÉE, sauf la ligne Urssaf (arbitrage 44, tranché).
//   (1) V18700-V18702 (modeles/grand-livre/agents-publics.md § 8) : ETP de D18 (49 000 -> 47 600 concernés -> ≈ 38 200 absorbables) ; 4,90 -> 3,80 Md€ expliqué (base CAF −0,25, plafond des départs −0,85) ;
//       Urssaf supprimée comme collecteur (35 % de sa gestion de 1,85, soit 0,65 Md€ au lieu de 0,46 ; 5 200 ETP gardés ; N10 inclus, jamais additionné).
//   (2) Candidats de l'inventaire des suppressions (sources/inventaire-suppressions.md § 6), N10 retiré puisqu'il est dans (1) : présentés, non comptés.
//   (3) Recouvrements M1m / D23 / D18 / M3 (V18803) : D23 et D18 sont dans le solde de la base ; M1m (ou M1f dans S3) et M3 sont dans les leviers de la dette : le chevauchement est compté deux fois
//       dans le manque, pas dans le solde statique. Le module le retire année par année (il suit la montée de M1m ou M1f) et recalcule S1, S2, S3.
// Chargement : liste de test_retraites_aisees_0611.js, puis ce fichier, puis rapport_consolidation_0611.js (ou test_consolidation_0611.js).
(function (root) {
  'use strict';
  var R = root.RetraitesAisees0611, T = root.Transmissions0611, B = root.BaseTravail0611, A = root.Decisions0611V74, Y = root.Decisions0611V72;

  var C = {
    // (1) D18 : agents-publics.md § 8 ; gestion-effectifs-fiabilisation.md (scénario S4) ; bilan_global.py M['gestion_nette'] = 3,7986 − 0,05 − 0,64
    gestionL1L2: 4.90, baseCaf: 0.25, plafondDeparts: 0.85, gestionSupprimee: 3.7986,
    etp: { avant: 49000, douane: 1400, concernes: 47600, absorbables: 38200 },
    // Urssaf (L1b) : gestion brute 1,85 Md€, 15 098 ETP (inventaire-suppressions.md S02, N10) ; arbitrage 44 : fin de l'Urssaf comme organisme séparé
    urssafGestion: 1.85, urssafAvant: 0.46, urssafPart: 0.35, urssafEtp: 5200, n10Haut: 0.28,
    // (3) recouvrements : périmètre de M1m (chiffrage-dette-stable-retraites-masse-salariale.md : 2,95 M d'agents dont 69 % territoriaux) ; DGFiP 92 115 ETPT (DGAFP 2024) ;
    //     D23 = non-remplacement ciblé (Cour, « un peu plus de 100 000 » agents territoriaux, 4,1) + 1 607 h (1,3) − 0,9 ; D18 : part DGFiP (L1a, 1,24 brut avant plafond)
    perimetreM: 2950000, partTerritoriale: 0.69, dgfipEtpt: 92115, d23NonRemplacement: 4.1, d18Dgfip: 1.24,
    m3Recouvrement: [0.40, 0.40, 0.55],   // M3 (1 607 h) contre le reste de D23 (1 607 h des collectivités, 0,4 après déduction de 4,1) et M1 : favorable / central / défavorable
    // (2) candidats de l'inventaire (§ 6), nets de recouvrement, Md€/an : [favorable, central, défavorable] (favorable = plus d'économie)
    candidats: [
      { id: 'N19', poste: 'C2S : instruction (Sécurité sociale à 100 %)', v: [0.18, 0.10, 0.05], note: 'peut recouper BT06 (gestion supplémentaire de l\'assurance maladie)' },
      { id: 'N23', poste: 'Tarification individuelle des AT-MP (cotisations fondues)', v: [0.08, 0.05, 0.02], note: 'cote D' },
      { id: 'N31', poste: 'Contentieux fiscal et des aides (juridictions administratives)', v: [0.04, 0.02, 0.005], note: '' },
      { id: 'N11', poste: 'Départements : orientation, contrôle et contractualisation du RSA (net de D23)', v: [0.20, 0.10, 0.047], note: 'brut 0,07 / 0,15 / 0,30 × 2/3 ; libre administration (art. 72)' },
      { id: 'N13', poste: 'ASP : paiement des aides supprimées (net de D16)', v: [0.117, 0.07, 0.031], note: 'brut 0,04 / 0,09 / 0,15 × 7/9' },
      { id: 'N35', poste: 'Directions centrales (sécurité sociale, cohésion sociale, logement, emploi-formation, législation fiscale), nettes de M1m', v: [0.125, 0.06, 0.025], note: 'brut 0,05 / 0,12 / 0,25 × 1/2 ; effectifs non lus' },
      { id: 'N50', poste: 'MSA : guichet santé-famille-retraite regroupé', v: [0.21, 0.105, 0.05], note: '5 / 10 / 20 % de 1,05' }
    ],
    contrib: { seuil: 2500, taux: 0.2, capital: true }, credit: 0.5
  };

  function facteurPlafond() { return C.gestionSupprimee / (C.gestionL1L2 - C.baseCaf); }   // 3,7986 / 4,65 = 0,817
  /** Urssaf supprimée comme collecteur : écart à D18 (Md€/an, + améliore le solde), après le même plafond des départs que le reste de D18 (les 5 200 ETP ne changent pas : seul leur coût est corrigé). */
  function urssaf() {
    var brut = C.urssafPart * C.urssafGestion - C.urssafAvant, f = facteurPlafond();
    return { brut: brut, part: C.urssafPart * C.urssafGestion, v: [C.n10Haut * f, brut * f, 0], etp: C.urssafEtp, partEtp: C.urssafEtp / 15098 };
  }
  function candidats() { var t = [0, 0, 0]; C.candidats.forEach(function (c) { for (var k = 0; k < 3; k++) t[k] += c.v[k]; }); return { lignes: C.candidats, total: t }; }
  /** Recouvrement de l'année y (Md€, central), entre le levier de non-remplacement lv ('M1m' ou 'M1f') et D23, D18, M3 ; k = 0, 1, 2 (favorable, central, défavorable) pour M3. */
  function recouvrement(lv, y, k) {
    var L = Y.leviers([lv])('central', y), m3 = Y.leviers(['M3'])('central', y), m3p = Y.leviers(['M3'])('central', 2040);
    var d23 = Math.min(C.d23NonRemplacement, C.partTerritoriale * L);
    var d18 = Math.min(C.d18Dgfip * facteurPlafond(), C.dgfipEtpt / C.perimetreM * L);
    var r3 = C.m3Recouvrement[k === undefined ? 1 : k] * m3 / m3p;
    return { d23: d23, d18: d18, m3: r3, total: d23 + d18 + r3 };
  }
  function prel(f, j) { return f.revenus + f.credit + j.transmissions + j.patrimoineNat + j.contribution; }
  function po(p) { return { md: R.S.poBase + p, pct: (R.S.poBase + p) / R.S.pib, elargisPct: (R.S.poBase + p + R.S.ecartElargis) / R.S.pib }; }
  function cas(bareme, c, contrib, sansR1f) {
    var o = T.objet(T.casTypesNets(bareme, c)), ret = R.CAS.map(function (pn) { return R.casRetraite(pn, contrib, null, sansR1f); });
    return { cas: o, retraites: ret };
  }
  function pic(t) { var p = 0, a = 0; t.ratio.forEach(function (x, i) { if (i < 30 && x > p) { p = x; a = 2029 + i; } }); return { pic: p, an: a }; }

  /** S1 corrigé : aucun levier, donc aucun recouvrement ; seule la ligne Urssaf change le solde (marge de neutralité). */
  function s1(extra) {
    var e = extra || 0, u = urssaf().v[1] + e, marge = R.margeNeutre(function () { return u; }), t = R.trajReforme(function () { return u; });
    return { marge: marge, traj: t, po: po(0), r: cas(B.bareme0(), 1, null, true), a: B.bareme0().mInf };
  }
  /** S2 corrigé : jeu JRR, puis le manque rouvert par le recouvrement (moins l'Urssaf, plus les candidats si demandés) rendu par la fonction des revenus. */
  function s2(extra) {
    var e = extra || 0, j = R.jeu({ contrib: C.contrib, c: C.credit }), lc = Y.leviers(A.HYP.combinaison), u = urssaf().v[1] + e;
    var lev = function (s, y) { return lc(s, y) + j.effet - recouvrement('M1m', y).total + u; };
    var b0 = B.S.corrT65 + B.totaux().central, levB = function (s, y) { return b0 + lev(s, y); };   // A.besoin ne contient pas la base : on l'ajoute (comme base_0611.js dette)
    var E = A.besoin('central', 'reference', levB), Epru = A.besoin('central', 'prudente', levB);
    var f = R.aPourRecette(j.revenus + j.credit + E, C.credit), t = R.trajReforme(function (s, y) { return lev(s, y) + E; });
    return { E: E, Eprudente: Epru, a: f.a, aAvant: j.a, revenus: f.revenus, credit: f.credit, traj: t, po: po(prel(f, j)), r: cas(f.bareme, C.credit, C.contrib, false), effet: j.effet + E, j: j };
  }
  /** S3 corrigé : même construction que RetraitesAisees0611.scenarioS3, le recouvrement de M1f retiré de la combinaison chaque année, l'Urssaf ajoutée (constante dès 2029, convention de la base). */
  function s3(extra) {
    var e = extra || 0, lc0 = Y.leviers(['R1f', 'M1f', 'M2m', 'M3']), u = urssaf().v[1] + e, r = R.S.rampe, i0 = r[1] - 2029;
    var lc = function (s, y) { return lc0(s, y) - recouvrement('M1f', y).total + u; }, ramp = function (y) { return Math.max(0, Math.min(1, (y - r[0]) / (r[1] - r[0]))); };
    var traj = function (F) { return R.trajReforme(function (s, y) { return lc(s, y) + ramp(y) * F; }); };
    var ok = function (F) { var t = traj(F); for (var i = i0 + 1; i < 30; i++) if (t.ratio[i] > t.ratio[i0] + 1e-9) return false; return true; };
    var lo = -50, hi = 300; for (var k = 0; k < 50; k++) { var x = (lo + hi) / 2; if (ok(x)) hi = x; else lo = x; } var F = hi;
    var tr = T.recette({ A: R.S.transReco.A, K: R.S.transReco.K, top: true, k: 1, nationalite: 'court' }).netActuel, rc = R.recette(C.contrib, 1).net, eco = R.S.ecoFonct + R.S.eco2[1];
    var autres = tr + R.S.patrimoineNat + rc + eco, f = R.aPourRecette(F - autres, C.credit), t = traj(F), p = pic(t);
    var j = { transmissions: tr, patrimoineNat: R.S.patrimoineNat, contribution: rc };
    return { F: F, a: f.a, revenus: f.revenus, credit: f.credit, traj: t, pic: p.pic, picAn: p.an, po: po(prel(f, j)), r: cas(f.bareme, C.credit, C.contrib, false),
             neutre: R.margeNeutre(function (s, y) { return lc(s, y) + ramp(y) * F; }) };
  }

  /** Manque de la base de travail (avec la combinaison R1f + M1m + M2m + M3), recouvrement retiré et Urssaf ajoutée ; extra = autres économies constantes (candidats). */
  function manqueBase(extra, k) {
    var lc = Y.leviers(A.HYP.combinaison), b0 = B.S.corrT65 + B.totaux().central + urssaf().v[1] + (extra || 0), out = {};
    ['prudente', 'reference', 'favorable'].forEach(function (m) { out[m] = A.besoin('central', m, function (s, y) { return lc(s, y) + b0 - recouvrement('M1m', y, k).total; }); });
    return out;
  }
  var API = { C: C, manqueBase: manqueBase, facteurPlafond: facteurPlafond, urssaf: urssaf, candidats: candidats, recouvrement: recouvrement, s1: s1, s2: s2, s3: s3 };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Consolidation0611 = API;
})(this);
