/*
 * modeles/systeme-ideal/fonction_unique_1311.js — FONCTION UNIQUE (13/11/2026) : le minimum garanti fondu dans la fonction des revenus. PROPOSITION, NON ADOPTÉE.
 *
 * Problème (vu par l'auteur sur le calculateur du site) : la fonction des revenus C(R) = a·R − S − (a − m0)·K·(1 − e^(−R/K)) et le complément du plancher,
 * retiré à α = 25 % du gain net, s'additionnent : le taux sur l'euro suivant d'une personne seule locataire monte à ≈ 71 % vers R ≈ 3 560 € puis redescend à ≈ 61 %.
 * Option 1 de l'auteur : fondre le minimum garanti dans la fonction, pour une seule courbe sans bosse.
 *
 * Règle proposée (forme B, recommandée) : pour une personne seule, une seule exponentielle
 *     C(R) = a·R − P − (a − μ)·K_P·(1 − e^(−R/K_P)),   K_P = (S + (a − m0)·K − P) / (a − μ),   taux sur l'euro suivant m(R) = a − (a − μ)·e^(−R/K_P)
 *   P = plancher de la situation (627 € + part logement L = min(250 €, loyer)) ; μ = 40 % (taux du premier euro, celui des allocataires du plancher aujourd'hui : 20 % + 25 % × 80 %) ;
 *   a, S, m0, K = fonction actuelle (0,6515 ; 412,5 € ; 0,20 ; 1 500 €). À R = 0, revenu disponible = P ; le taux monte sans jamais redescendre, de μ vers a ; au-dessus de
 *   quelques milliers d'euros, la contribution rejoint exactement l'ancienne (même asymptote a·R − S − (a − m0)·K).
 * Ménages (H-FU4) : chaque adulte garde la fonction individuelle actuelle ; le ménage reçoit un terme de plancher F_h, fonction du revenu total R_h du ménage :
 *     F_h(R_h) = (a − m0)·K·e^(−R_h/K) − (a − μ)·K_h·e^(−R_h/K_h),   K_h = ((a − m0)·K − (P_h − n·S)) / (a − μ)
 *   (n adultes, P_h plancher du ménage hors enfants). Pour une personne seule, fonction individuelle + F_h = la courbe unique ci-dessus. Pour chaque adulte d'un ménage, le taux
 *   sur l'euro suivant est croissant et ≤ a quel que soit le revenu de l'autre (démonstration dans fonction-unique-1311.md § 3). Montants par enfant inchangés, hors plancher.
 * Forme A (variante) : même K pour tout : C(R) = a·R − P − (a − m0 − (P − S)/K)·K·(1 − e^(−R/K)) ; F_h = (P_h − n·S)·e^(−R_h/K) ; premier euro à 51 % pour un locataire.
 *
 * Recette (H-FU6) : seul le plancher change ; on réutilise le moteur de bareme_unique_v6.js (adultes non retraités des dixièmes de palier 1, quadrature à 5 points, dispersion
 * 0,3 / 0,6 / 0,9, calage k du plancher sur la dépense de la v5.10 : V.kPlancher) et les parts « sans loyer » de decisions_0811.js (HE6 : 27 / 19 / 7 %).
 * Euros de 2025-2026 ; €/mois pour les cas types, Md€/an pour les masses. Des hypothèses et des ordres de grandeur, jamais des prédictions. Ne modifie AUCUN module existant.
 * Charger : seul pour les fonctions du ménage ; pour la recette, la liste de test_bareme_unique_v6.js jusqu'à bareme_unique_v6.js, puis ce fichier (ordre en tête de
 * test_fonction_unique_1311.js).
 */
(function (root) {
  'use strict';

  // ======================================================================================================================================
  // 0. Paramètres (H-FU1 à H-FU5)
  // ======================================================================================================================================
  var HYP = {
    // H-FU1 : fonction des revenus actuelle (correction_0811.js : a = 0,6515 ; v7.4 B : S = 412,5 €, m0 = 20 %, K = 1 500 €) et règle de plancher actuelle (α = 25 % du gain net)
    a: 0.6515, S: 412.5, m0: 0.20, K: 1500, alpha: 0.25,
    // H-FU2 : taux du premier euro de la courbe unique : 40 % = 20 % + 25 % × (1 − 20 %), celui d'un allocataire du plancher aujourd'hui (choix de Claude, voir § 5 du rapport) ; K_P = 846 € (locataire), 1 840 € (sans loyer)
    mu: 0.40,
    // H-FU3 : planchers hors enfants (bareme_deux_fonctions_v7.js H7.3 ; decisions_0811.js HE6) : socle 627 € (seul ou parent seul), 1 066 € pour un couple (1 316 − 250),
    //         plus la part logement du ménage, 250 € plafonnés au loyer payé (0 pour un propriétaire ou un hébergé sans loyer)
    socle: { seul: 627, parent: 627, couple: 1066 }, logement: 250,
    // montants par enfant (inchangés, hors plancher) : 200 € par enfant, majoration parent seul 250 € par enfant
    enfant: 200, majParentIsole: 250,
    // H-FU6 : part des bénéficiaires du plancher sans loyer (propriétaires + hébergés sans loyer), decisions_0811.js HE6 : bas 27 %, central 19 %, haut 7 %
    sansLoyer: { bas: 0.27, central: 0.19, haut: 0.07 },
    // cas types (coût employeur mensuel) : Smic = super-brut OpenFisca 2026 du célibataire au Smic (decisions_0511i.js OF_CAS.smic_seul) ;
    // médian = 2 735 € brut, super-brut OpenFisca du couple médian divisé par deux (OF_CAS.couple_median_2enf : 7 013,97 / 2)
    smic: 1941.06, median: 7013.97 / 2
  };
  function prm(o) { var p = {}, k; for (k in HYP) p[k] = HYP[k]; if (o) for (k in o) p[k] = o[k]; return p; }

  // ======================================================================================================================================
  // 1. Fonction individuelle actuelle et plancher actuel
  // ======================================================================================================================================
  /** Contribution individuelle actuelle C(R) (€/mois ; négative = l'État verse). */
  function cInd(R, o) { var p = prm(o); return p.a * R - p.S - (p.a - p.m0) * p.K * (1 - Math.exp(-R / p.K)); }
  /** Taux sur l'euro suivant de la fonction individuelle seule. */
  function mInd(R, o) { var p = prm(o); return p.a - (p.a - p.m0) * Math.exp(-R / p.K); }
  /** Plancher du ménage hors enfants (€/mois) : socle de la situation + part logement plafonnée au loyer. */
  function plancher(sit, loyer, o) { var p = prm(o); return p.socle[sit || 'seul'] + Math.min(p.logement, Math.max(0, loyer === undefined ? p.logement : loyer)); }
  function situation(spec) { var n = spec.revenus.length; return spec.situation || (n === 2 ? 'couple' : ((spec.enfants || 0) > 0 ? 'parent' : 'seul')); }
  function montantEnfants(spec, o) { var p = prm(o), e = spec.enfants || 0; return p.enfant * e + (situation(spec) === 'parent' ? p.majParentIsole * e : 0); }

  // ======================================================================================================================================
  // 2. Règle actuelle et règle unique, ménage par ménage
  // ======================================================================================================================================
  /** Règle actuelle : fonction individuelle + complément max(0, P_h − n·S − α × gain net du ménage) + montants par enfant. spec = { revenus: [R], enfants, situation, loyer }. */
  function ancien(spec, o) {
    var p = prm(o), n = spec.revenus.length, gain = 0, ind = 0;
    spec.revenus.forEach(function (R) { ind += R - cInd(R, p); gain += R - (cInd(R, p) + p.S); });
    var c0 = Math.max(0, plancher(situation(spec), spec.loyer, p) - n * p.S), compl = c0 > 0 ? Math.max(0, c0 - p.alpha * gain) : 0, enf = montantEnfants(spec, p);
    return { revenu: ind + compl + enf, individuel: ind, plancher: compl, enfants: enf };
  }
  /** Constante de courbure du terme de plancher, forme B : K_h = ((a − m0)·K − (P_h − n·S)) / (a − μ). */
  function kH(Ph, n, o) { var p = prm(o); return ((p.a - p.m0) * p.K - (Ph - n * p.S)) / (p.a - p.mu); }
  /** Terme de plancher du ménage (€/mois), fonction du revenu total R_h ; forme 'B' (défaut) ou 'A'. */
  function termePlancher(Rh, Ph, n, o) {
    var p = prm(o);
    if (p.forme === 'A') return (Ph - n * p.S) * Math.exp(-Rh / p.K);
    var Kh = kH(Ph, n, p);
    return (p.a - p.m0) * p.K * Math.exp(-Rh / p.K) - (p.a - p.mu) * Kh * Math.exp(-Rh / Kh);
  }
  /** Règle unique : fonction individuelle + terme de plancher F_h(R_h) + montants par enfant. */
  function nouveau(spec, o) {
    var p = prm(o), n = spec.revenus.length, Rh = 0, ind = 0;
    spec.revenus.forEach(function (R) { ind += R - cInd(R, p); Rh += R; });
    var F = termePlancher(Rh, plancher(situation(spec), spec.loyer, p), n, p), enf = montantEnfants(spec, p);
    return { revenu: ind + F + enf, individuel: ind, plancher: F, enfants: enf };
  }

  // ======================================================================================================================================
  // 3. Personne seule : la courbe unique en une ligne, taux sur l'euro suivant
  // ======================================================================================================================================
  /** Contribution de la personne seule (forme B) : C(R) = a·R − P − (a − μ)·K_P·(1 − e^(−R/K_P)). */
  function contribution(R, P, o) {
    var p = prm(o);
    if (p.forme === 'A') { var mu = p.m0 + (P - p.S) / p.K; return p.a * R - P - (p.a - mu) * p.K * (1 - Math.exp(-R / p.K)); }
    var Kp = kH(P, 1, p); return p.a * R - P - (p.a - p.mu) * Kp * (1 - Math.exp(-R / Kp));
  }
  /** Taux sur l'euro suivant de la courbe unique (personne seule). */
  function taux(R, P, o) {
    var p = prm(o);
    if (p.forme === 'A') return p.a - (p.a - p.m0 - (P - p.S) / p.K) * Math.exp(-R / p.K);
    var Kp = kH(P, 1, p); return p.a - (p.a - p.mu) * Math.exp(-R / Kp);
  }
  /** Taux sur l'euro suivant de la règle actuelle (personne seule) : m(R) + α·(1 − m(R)) tant que le complément est versé. */
  function tauxAncien(R, P, o) {
    var p = prm(o), m = mInd(R, p), c0 = Math.max(0, P - p.S), compl = c0 > 0 ? c0 - p.alpha * (R - (cInd(R, p) + p.S)) : 0;
    return compl > 0 ? m + p.alpha * (1 - m) : m;
  }
  /** Revenu disponible d'une personne seule (€/mois), règle actuelle et règle unique ; loyer ≥ 250 € par défaut. */
  function seul(R, loyer, o) { var sp = { revenus: [R], loyer: loyer }; return { ancien: ancien(sp, o).revenu, nouveau: nouveau(sp, o).revenu }; }
  /** Fin du complément actuel (R où il s'annule) et taux maximal de la règle actuelle juste avant. */
  function finComplementAncien(P, o) {
    var p = prm(o), lo = 0, hi = 20000, k, c0 = P - p.S;
    for (k = 0; k < 80; k++) { var m = (lo + hi) / 2; if (c0 - p.alpha * (m - (cInd(m, p) + p.S)) > 0) lo = m; else hi = m; }
    return { R: lo, net: seul(lo, P > p.socle.seul ? p.logement : 0, p).ancien, tauxAvant: tauxAncien(lo - 1e-6, P, p), tauxApres: tauxAncien(lo + 1e-6, P, p) };
  }

  // ======================================================================================================================================
  // 4. Contrôles : monotonie, plafond, plancher à R = 0
  // ======================================================================================================================================
  /** Taux sur l'euro suivant d'un adulte d'un ménage (dérivée numérique, pas h) : 1 − Δrevenu / ΔR. */
  function tauxMenage(spec, i, h, o) {
    var hh = h || 1, a = nouveau(spec, o).revenu, s2 = JSON.parse(JSON.stringify(spec)); s2.revenus[i] += hh;
    return 1 - (nouveau(s2, o).revenu - a) / hh;
  }
  /** Parcourt R de 0 à Rmax (pas `pas`) pour l'adulte i du ménage spec (son revenu varie, les autres fixes) : taux minimal, maximal, plus forte baisse. */
  function profil(spec, i, o, Rmax, pas) {
    var mx = -1, mn = 2, baisse = 0, prev = null, R, arg = 0;
    for (R = 0; R <= (Rmax || 50000); R += (pas || 10)) {
      var s = JSON.parse(JSON.stringify(spec)); s.revenus[i] = R; var t = tauxMenage(s, i, 0.5, o);
      if (t > mx) { mx = t; arg = R; } if (t < mn) mn = t; if (prev !== null && prev - t > baisse) baisse = prev - t; prev = t;
    }
    return { min: mn, max: mx, argmax: arg, plusForteBaisse: baisse };
  }

  // ======================================================================================================================================
  // 5. Tableaux comparatifs
  // ======================================================================================================================================
  function points() { var pts = [], R; for (R = 0; R <= 6000; R += 250) pts.push(R); return pts.concat([8000, 10000, 15000]); }
  /** Tableau personne seule : taux et revenu disponible, ancien et nouveau, locataire (loyer ≥ 250 €) et sans loyer. */
  function tableau(o) {
    var p = prm(o), PL = p.socle.seul + p.logement, PS = p.socle.seul;
    return points().map(function (R) {
      var l = seul(R, p.logement, p), s = seul(R, 0, p);
      return { R: R, tAncLoc: tauxAncien(R, PL, p), tNouvLoc: taux(R, PL, p), dAncLoc: l.ancien, dNouvLoc: l.nouveau, ecartLoc: l.nouveau - l.ancien,
               tAncSans: tauxAncien(R, PS, p), tNouvSans: taux(R, PS, p), dAncSans: s.ancien, dNouvSans: s.nouveau, ecartSans: s.nouveau - s.ancien };
    });
  }
  /** Cas types (€/mois) : personnes seules (locataire, sans loyer) et ménages du modèle. */
  function casTypes(o) {
    var p = prm(o), out = [];
    [['sans_revenu', 'Sans revenu', 0], ['smic', 'Smic (coût employeur 1 941 €)', p.smic], ['median', 'Salaire médian (2 735 € brut, coût employeur 3 507 €)', p.median],
     ['r4000', 'Coût employeur 4 000 €', 4000], ['r8000', 'Coût employeur 8 000 €', 8000]].forEach(function (c) {
      [['loc', p.logement], ['sans', 0]].forEach(function (l) {
        var sp = { revenus: [c[2]], loyer: l[1] }, an = ancien(sp, p).revenu, nv = nouveau(sp, p).revenu;
        out.push({ id: c[0] + '_' + l[0], libelle: 'Seul, ' + c[1] + (l[1] ? ', locataire' : ', sans loyer'), ancien: an, nouveau: nv, ecart: nv - an });
      });
    });
    [['couple_0_0', 'Couple sans revenu, locataire', { revenus: [0, 0], loyer: 250 }],
     ['couple_smic_0', 'Couple, un Smic et un sans revenu, locataire', { revenus: [p.smic, 0], loyer: 250 }],
     ['couple_2smic', 'Couple, deux Smic, sans enfant, locataire', { revenus: [p.smic, p.smic], loyer: 250 }],
     ['couple_2smic_2enf', 'Couple, deux Smic, deux enfants, locataire', { revenus: [p.smic, p.smic], enfants: 2, loyer: 250 }],
     ['couple_median_2enf', 'Couple médian, deux enfants, locataire', { revenus: [p.median, p.median], enfants: 2, loyer: 250 }],
     ['parent_smic_2enf', 'Parent seul au Smic, deux enfants, locataire', { revenus: [p.smic], enfants: 2, situation: 'parent', loyer: 250 }]].forEach(function (c) {
      var an = ancien(c[2], p).revenu, nv = nouveau(c[2], p).revenu; out.push({ id: c[0], libelle: c[1], ancien: an, nouveau: nv, ecart: nv - an });
    });
    return out;
  }

  // ======================================================================================================================================
  // 6. Recette : moteur de bareme_unique_v6.js (population et calage du plancher), seul le plancher change
  // ======================================================================================================================================
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };   // nœuds de bareme_unique_v6.js
  var _dc = {};
  function moteur() {
    var V = root.BaremeUniqueV6, GP = root.GagnantsPerdantsPalier1, Z = root.Optimum;
    if (!V || !GP || !Z) throw new Error('recette : charger la liste du moteur (voir l\'en-tête de test_fonction_unique_1311.js)');
    return { V: V, GP: GP, Z: Z };
  }
  /** Masse annuelle (Md€) d'un terme fn(R) €/mois sur les adultes non retraités des dixièmes (hors bénéficiaires sans revenu), à la dispersion du scénario : copie de massePlancher. */
  function masse(fn, sc) {
    var E = moteur(), d = E.V.HYP.DISP[sc], dc = _dc[d] || (_dc[d] = E.GP.deciles(E.Z.versOF(E.Z.archi({})), undefined, { dispersion: d })), tot = 0;
    dc.deciles.forEach(function (x) {
      var nb = x.nonRetraitesM * 1e6 * (1 - x.partSousPlancher), g;
      for (g = 0; g < 5; g++) { var r = x.detail.Rpers * Math.exp(d * GH.z[g] - d * d / 2) / 12; tot += GH.w[g] * nb * 12 * fn(r); }
    });
    return tot / 1e9;
  }
  /**
   * Recette de la règle unique par rapport à la règle actuelle (Md€/an ; > 0 = l'État gagne) au scénario sc :
   * k × Σ_{loyer, sans loyer} part × [masse(complément actuel) − masse(terme unique)], k = V.kPlancher(0,42, dispersion) (calage du moteur, H6.4).
   * Les bénéficiaires sans revenu reçoivent P dans les deux règles (écart nul). Mécanique : sans réaction de l'emploi (comme le plancher du moteur).
   */
  function recette(sc, o) {
    var p = prm(o), s = sc || 'central', E = moteur(), k = E.V.kPlancher(0.42, E.V.HYP.DISP[s]), q = p.sansLoyer[s];
    var anc = function (P) { return function (r) { var c0 = Math.max(0, P - p.S); return Math.max(0, c0 - p.alpha * (r - (cInd(r, p) + p.S))); }; };
    var nou = function (P) { return function (r) { return termePlancher(r, P, 1, p); }; };
    var PL = p.socle.seul + p.logement, PS = p.socle.seul;
    var mA = { loc: masse(anc(PL), s), sans: masse(anc(PS), s) }, mN = { loc: masse(nou(PL), s), sans: masse(nou(PS), s) };
    var coutAncien = k * ((1 - q) * mA.loc + q * mA.sans), coutNouveau = k * ((1 - q) * mN.loc + q * mN.sans);
    // le modèle actuel (bareme_unique_v6.js + ligne PL01 de decisions_0811.js) compte le complément de la zone de retrait à 877 € pour tous : écart de convention
    var coutModele = k * mA.loc;
    return { sc: s, k: k, partSansLoyer: q, coutAncien: coutAncien, coutNouveau: coutNouveau, gainEtat: coutAncien - coutNouveau,
             coutAncienModele: coutModele, ecartConventionPL01: coutModele - coutAncien, gainEtatVsModele: coutModele - coutNouveau };
  }
  /** μ qui rend la règle unique exactement neutre au scénario sc (bissection). */
  function muNeutre(sc, o) {
    var lo = 0.30, hi = 0.50, k;
    for (k = 0; k < 40; k++) { var m = (lo + hi) / 2, oo = prm(o); oo.mu = m; if (recette(sc, oo).gainEtat < 0) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  var API = { HYP: HYP, prm: prm, cInd: cInd, mInd: mInd, plancher: plancher, ancien: ancien, kH: kH, termePlancher: termePlancher, nouveau: nouveau, contribution: contribution,
              taux: taux, tauxAncien: tauxAncien, seul: seul, finComplementAncien: finComplementAncien, tauxMenage: tauxMenage, profil: profil, points: points, tableau: tableau,
              casTypes: casTypes, masse: masse, recette: recette, muNeutre: muNeutre };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.FonctionUnique1311 = API;
})(this);
