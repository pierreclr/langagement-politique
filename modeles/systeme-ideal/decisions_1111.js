/*
 * modeles/systeme-ideal/decisions_1111.js — COUCHE DATÉE DECISIONS1111 : deux décisions de l'auteur du 11/11/2026, posées sur la couche CORRECTION0811 sans modifier aucun module existant.
 *
 *   1. RETRAITES (T87, 11/11/2026) : on garde la loi de 2023. Âge de référence de 64 ans (générations 1969 et suivantes ; calendrier de la loi avant), SANS indexation sur l'espérance de vie
 *      (la règle des 2/3 du 03/11 est retirée) et SANS âge libre (le départ anticipé avec pension réduite est reporté en phase 2 et n'est pas chiffré : décision du 05/11 retirée).
 *      Restent : pénibilité (départ à 60 ans sans réduction, part nette du droit actuel 5 / 10 / 20 %), indexation moindre au-dessus de 2 000 € bruts (prix − 0,5 point), contribution des hautes pensions
 *      (déjà comptée dans la ligne N03 : retirée du net comme avant). Disparaissent avec les deux blocs retirés : le coût de substitution (H71, appliqué au seul bloc « âge de référence »)
 *      et le plancher de 1 300 € tel que le modèle le chiffre (HC3 ci-dessous).
 *   2. ENTREPRISE D'ÉTAT (11/11/2026) : 1 Md€ par an au départ, pris sur le crédit d'impôt recherche supprimé (ligne D32 : 3,0 → 1,0 Md€ réorientés). Le CIR reste supprimé (D14 : −8,0 inchangé).
 *
 * Hypothèses de la couche (⚠️ à relire par l'auteur) :
 *   HC1 : la pénibilité est recalculée avec l'âge de référence de la LOI DE 2023 (trajectoireAgeReference avec part = 0 : 62,75 → 64 ans selon la génération avant 1969, 64 ans ensuite), à la place de la règle
 *         indexée ; le comportement de report (passage × (âge de référence − 64)) est nul. La fonction `penibiliteLoi` reproduit exactement `AgeLibre.penibiliteIndexee` quand on lui redonne part = 2/3 (testé).
 *   HC2 : l'indexation moindre au-dessus de 2 000 € (H54), la contribution des hautes pensions (H55) et les parts de pénibilité (H66) sont reprises SANS changement (decisions_0511e.js composantes).
 *   HC3 : le plancher de 1 300 € du modèle (H56, H788 : `AgeLibre.pauvreteAnticipee`) ne protège que les pensions RÉDUITES par un départ anticipé (coût = Σ part × max(min(p, 1 300) − p × coefficient, 0)).
 *         Sans âge libre, personne ne part avec une pension réduite par le coefficient neutre : son coût dans le modèle est nul. « Inchangé sauf impossibilité » : il est impossible tel que modélisé ;
 *         si l'auteur l'entend comme un minimum de pension relevé à 1 300 € pour tous les retraités, c'est un coût NON chiffré (voir le rapport, « à trancher »).
 *   HC4 : la montée en charge du CIR réorienté est constante dès 2029 (comme H807) ; l'option de montée vers 8 Md€ (non adoptée) est sans objet.
 * Tout est en Md€ de 2025 par an ; des hypothèses et des ordres de grandeur, jamais des prédictions.
 * S3 est recalibré avec la même règle de dette que les couches précédentes (dette stable à partir de 2038, macro de référence, garantie à coût constant) : les leviers F et le coefficient a sont RECALCULÉS,
 * rien n'est ajusté à la main.
 * Charger (jsc) : la liste de ponts.py (LISTE_SYSTEME, jusqu'à correction_0811.js), puis ce fichier, puis rapport_decisions_1111.js ou test_decisions_1111.js.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var AL = root.AgeLibre || (req ? req('../retraites/age_libre.js') : null), E5 = root.Decisions0511e || (req ? req('./decisions_0511e.js') : null), G = root.Decisions0511g || (req ? req('./decisions_0511g.js') : null),
      H = root.Decisions0511h || (req ? req('./decisions_0511h.js') : null), C = root.Correction0811 || (req ? req('./correction_0811.js') : null), ED = root.Decisions0811, D = root.Decisions0711,
      R = root.RetraitesAisees0611, K = root.Consolidation0611, T = root.Transmissions0611, Y = root.Decisions0611V72;
  var SCS = ['bas', 'central', 'haut'], REF = ['favorable', 'central', 'defavorable'];
  function i(sc) { return SCS.indexOf(sc); }

  var HYP = { annee1: 2029, anneeFin: 2070, entrepriseEtat: 1.0, ageReference: 64 };

  function recouvre(d0, d1, an) { return Math.max(0, Math.min(d1, an + 1) - Math.max(d0, an)); }

  /** Départ sans réduction à 60 ans (pénibilité) avec l'âge de référence de la loi de 2023 : copie de AgeLibre.penibiliteIndexee, `part` de la règle indexée = 0 par défaut (loi de 2023) ;
   *  avec o.partIndexation = 2/3 on retrouve la règle du 03/11 (test d'égalité exacte avec AgeLibre.penibiliteIndexee). Retourne { an: { surcoutDispenseMdE } }. */
  function penibiliteLoi(sc, annees, o) {
    o = o || {};
    var s = AL.SCENARIOS_REF[REF[i(sc)]], part = s.partPenibilite, variante = s.variante, passage = s.passage, r = s.r, emp = 0.5, debut = 2028, D0 = AL.DONNEES,
        rows = AL.trajectoireAgeReference({ variante: variante, part: o.partIndexation === undefined ? 0 : o.partIndexation }), N = D0.cohorteAnnuelle * part, out = {};
    annees.forEach(function (an) {
      var sur = 0, mid = an + 0.5;
      for (var s0 = debut; s0 <= an + 9; s0++) {
        var a0 = AL.ageBase(s0), g = s0 - a0, aref = AL.ageRefGen(rows, g), d = Math.max(0, passage * (aref - 64)), a0e = a0 + d, amin = 60;
        if (amin >= a0e) continue;
        var s1 = s0 + (amin - a0), montee = Math.min(1, Math.max(0, (s1 - debut + 1) / 3));
        if (montee <= 0 || s1 > an + 1) continue;
        var pens0 = D0.pensionMoyenne2025 * Math.pow(1 + D0.croissancePensionNeuve, s0 - 2025), Nm = N * montee, cN = AL.coefNeutre(amin, aref, r, 0), S = AL.survie(amin, amin + Math.max(mid - s1, 0));
        sur += Nm * S * pens0 * (1 - cN) * recouvre(s1, 1e9, an);
      }
      out[an] = { surcoutDispenseMdE: sur };
    });
    return out;
  }
  var _pen = {};
  function penibilite(sc, an) {
    if (!_pen[sc]) { var ys = [], y; for (y = HYP.annee1; y <= HYP.anneeFin + 5; y++) ys.push(y); _pen[sc] = penibiliteLoi(sc, ys); }
    return -_pen[sc][an].surcoutDispenseMdE;
  }
  /** Composantes du dispositif retraites de la couche (Md€/an ; + améliore) : pénibilité à l'âge de référence de la loi de 2023, indexation moindre au-dessus de 2 000 €. Pas d'âge de référence indexé,
   *  pas d'âge libre, pas de substitution, plancher nul (HC3). `hautesPensions` : pour mémoire, déjà dans N03. */
  function composantes(sc, an) {
    if (an < HYP.annee1) return { penibilite: 0, indexation: 0, ageReference: 0, ageLibre: 0, substitution: 0, plancher: 0, net: 0 };
    var c = E5.composantes(sc, an), r = { penibilite: penibilite(sc, an), indexation: c.indexation, ageReference: 0, ageLibre: 0, substitution: 0, plancher: 0, hautesPensions: c.hautesPensions };
    r.net = r.penibilite + r.indexation;
    return r;
  }
  /** Effet net du dispositif retraites de la couche (remplace Decisions0511g.v6) : Md€/an, + améliore le solde. */
  function v6(sc, an) { return composantes(sc, an).net; }
  /** CIR réorienté vers l'entreprise d'État : dépense (Md€/an), 1,0 au lieu de 3,0. */
  function cir(an) { return an < HYP.annee1 ? 0 : HYP.entrepriseEtat; }
  /** Écart de la couche au solde (Md€/an, + améliore), scénario sc, année an : retraites (nouveau − ancien V6 au trimestre) + entreprise d'État (3,0 − 1,0). */
  function delta(sc, an) { return an < HYP.annee1 ? 0 : (v6(sc, an) - G.v6(sc, an)) + (H.cir(an) - cir(an)); }
  function deltaDetail(sc, an) { return { retraites: v6(sc, an) - G.v6(sc, an), entrepriseEtat: H.cir(an) - cir(an), total: delta(sc, an) }; }

  // --- S3 recalibré : copie de Correction0811.s3 avec l'écart de la couche dans toutes les trajectoires ---
  function pic(t) { var p = 0, a = 0; t.ratio.forEach(function (x, k) { if (k < 30 && x > p) { p = x; a = 2029 + k; } }); return { pic: p, an: a }; }
  function dep3(t) { var a = null; t.deficit.forEach(function (d, k) { if (k < 30 && d > 0.03) a = 2029 + k; }); return a; }
  function s3(v, opts) {
    opts = opts || {}; v = v || D.HYP.defaut;
    var m = opts.macro || 'reference', L = ED.lignes(v), e = D.somme(L)[1] + (opts.extra || 0), sans = !!opts.sansCouche, top = opts.top === undefined ? C.HYP.topTransmissions : opts.top;
    var corr = function (s, y) { return C.correction(y, {}) + (sans ? 0 : delta(s, y)); };
    var lc0 = Y.leviers(['M1f', 'M2m', 'M3']), u = K.urssaf().v[1] + e, r = R.S.rampe, i0 = r[1] - 2029;
    var lc = function (s, y) { return lc0(s, y) - K.recouvrement('M1f', y).total + u; }, ramp = function (y) { return Math.max(0, Math.min(1, (y - r[0]) / (r[1] - r[0]))); };
    var traj = function (F, mm, extraFn) { return R.trajReforme(function (s, y) { return lc(s, y) + ramp(y) * F + corr(s, y) + (extraFn ? extraFn(y) : 0); }, mm || m); };
    var ok = function (F) { var t = traj(F); for (var k = i0 + 1; k < 30; k++) if (t.ratio[k] > t.ratio[i0] + 1e-9) return false; return true; };
    var lo = -100, hi = 400; for (var k2 = 0; k2 < 55; k2++) { var x = (lo + hi) / 2; if (ok(x)) hi = x; else lo = x; } var F = opts.F === undefined ? hi : opts.F;   // opts.F : leviers imposés (variante « leviers inchangés », sans recalibrage)
    var cc = ED.courbe(), co = cc.o, tr = T.recette({ A: R.S.transReco.A, K: R.S.transReco.K, top: top, k: 1, nationalite: 'court' }).netActuel, rp = D.recettePension(co, 1).net, eco = R.S.ecoFonct + R.S.eco2[1];
    var autres = tr + R.S.patrimoineNat + rp + eco, f = R.aPourRecette(F - autres, D.HYP.credit), t = traj(F), p = pic(t);
    var prel = f.revenus + f.credit + tr + R.S.patrimoineNat + rp + D.poCouche(L), poMd = R.S.poBase + prel;
    var cas = T.objet(T.casTypesNets(f.bareme, D.HYP.credit)), ret = R.CAS.map(function (pn) { return D.casRetraite(pn, co, true); });
    return { v: v, macro: m, effetCouche: e, lignes: L, F: F, a: f.a, revenus: f.revenus, credit: f.credit, transmissions: tr, patrimoineNat: R.S.patrimoineNat, pension: rp, eco: eco, autres: autres,
             traj: t, pic: p.pic, picAn: p.an, dep3: dep3(t), po: { md: poMd, pct: poMd / R.S.pib, elargisPct: (poMd + R.S.ecartElargis) / R.S.pib }, cas: cas, retraites: ret, bareme: f.bareme,
             trajPrudente: traj(F, 'prudente'), fn: function (s, y) { return lc(s, y) + ramp(y) * F + corr(s, y); }, _traj: traj };
  }
  function prudente(v, opts) { var o = JSON.parse(JSON.stringify(opts || {})); o.macro = 'prudente'; return s3(v, o); }
  function saut(s, an) { return C.saut(s, an); }
  function clause(s, opts) { return ED.clause(s, opts); }

  var API = { HYP: HYP, penibiliteLoi: penibiliteLoi, penibilite: penibilite, composantes: composantes, v6: v6, cir: cir, delta: delta, deltaDetail: deltaDetail, s3: s3, prudente: prudente, saut: saut, clause: clause };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions1111 = API;
})(this);
