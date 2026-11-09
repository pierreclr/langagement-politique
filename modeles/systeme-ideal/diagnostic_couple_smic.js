/*
 * modeles/systeme-ideal/diagnostic_couple_smic.js — diagnostic du 05/11/2026 : pourquoi le couple à deux Smic (2 enfants) perd ≈ 117 €/mois dans la v5.3, et quels correctifs.
 * Module SÉPARÉ : AUCUN module existant n'est modifié ; les correctifs ne sont PAS ajoutés au modèle (arbitrages de l'auteur). Fonctions pures, euros de 2025-2026, €/mois par foyer ; Md€/an en croisière.
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511b.js (jusqu'à decisions_0511b.js), puis ce fichier (puis test_diagnostic_couple_smic.js).
 *
 * Données du droit actuel : OpenFisca-France 176.1.10, barème 2026, zone 2, produites par generer_diagnostic_couple_smic.py (ppa lue en premier sur simulation neuve : V13350, ordre d'évaluation).
 * Côté système : revenu = socle × adultes + allocation par enfant (+ majoration parent isolé) + Σ (coût employeur − impôt du modèle (M.impot : 42 % + impôt continu)) + complément de plancher dégressif
 * (α = 0,25) pour les ménages types seul / couple monoactif / parent isolé ; l'assiette est le COÛT EMPLOYEUR (super-brut du modèle : 1 987,76 € au Smic, H453).
 * Hypothèses H760 à H769 (⚠️ non confirmées) : voir le diagnostic du couple à deux Smic (document de travail non publié).
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var B = root.Decisions0511b || (req ? req('./decisions_0511b.js') : null);
  var M = root.SystemeIdeal || (req ? req('./modele.js') : null);
  var GP = root.GagnantsPerdantsPalier1 || (req ? req('../gagnants-perdants/palier1.js') : null);
  var G = root.GagnantsPerdants || (req ? req('../gagnants-perdants/modele.js') : null);
  var C = root.Correctifs || (req ? req('../gagnants-perdants/correctifs.js') : null);
  var F = (root.Voies || (req ? req('./voies.js') : null)).fus;
  var D = M.DONNEES, SCS = ['bas', 'central', 'haut'];

  // ---------- Droit actuel : OpenFisca-France 2026 (€/mois ; décomposition par poste)
  // Clés : brut, superBrut (OpenFisca), cotisSal (cotisations salariales hors CSG), csg (CSG déductible + imposable) et crds, allegement (réduction générale, déjà déduite des cotisations patronales),
  // net, ir, ppa (nette de CRDS), af (AF + ARS, nettes de CRDS), al, rd (revenu disponible OpenFisca). Deux salaires : les totaux du foyer.
  var OF = {
    smic_seul:        { libelle: 'Salarié seul au Smic', brut: 1867.02, superBrut: 1941.06, cotisSal: 211.16, csg: 168.76, crds: 9.17, allegement: 700.13, net: 1477.93, ir: 0, ppa: 228.37, af: 0, al: 0, rd: 1706.30 },
    couple_2smic_2enf: { libelle: 'Couple, 2 enfants, deux Smic', brut: 3734.04, superBrut: 3882.11, cotisSal: 422.32, csg: 337.52, crds: 18.34, allegement: 1400.26, net: 2955.86, ir: 0, ppa: 368.30, af: 225.05, al: 0, rd: 3549.20 },
    couple_2smic_0enf: { libelle: 'Couple sans enfant, deux Smic', brut: 3734.04, superBrut: 3882.11, cotisSal: 422.32, csg: 337.52, crds: 18.34, allegement: 1400.26, net: 2955.86, ir: 7.83, ppa: 140.25, af: 0, al: 0, rd: 3088.27 },
    couple_smic_15_2enf: { libelle: 'Couple, 2 enfants, Smic + 1,5 Smic', brut: 4667.55, superBrut: 5557.56, cotisSal: 527.90, csg: 421.90, crds: 22.93, allegement: 1045.44, net: 3694.82, ir: 0, ppa: 103.34, af: 151.94, al: 0, rd: 3950.11 }
  };
  // le couple à deux Smic de l'atlas du modèle (droit_actuel.js) a un conjoint à 1 823,07 € brut (Smic de janvier) : revenu disponible 3 523,28 € (OpenFisca, même calcul)
  var OF_ATLAS_COUPLE = { brut2: 1823.07, rd: 3523.28 };
  // couple avec deux enfants, premier adulte au Smic (1 867,02 € brut), second adulte à p2 € brut : [revenu disponible OpenFisca, prime d'activité nette]
  var OF_GRILLE_COUPLE = { 0: [2582.14, 584.92], 466.76: [2699.69, 442.72], 933.51: [2927.02, 412.58], 1400.27: [3239.65, 428.22], 1867.02: [3549.20, 368.30], 2800.53: [3950.11, 103.34] };
  // hypothèse alternative : coût employeur d'OpenFisca (super-brut) au lieu de celui du modèle
  var SMIC_BRUT = GP.SMIC_BRUT, COUT_SMIC = C.coutDeBrut(SMIC_BRUT);

  // ---------- Paramètres du système
  function pSys(a) { return M.param(GP.config(Z.versOF(Z.archi(a))).p); }
  function archiV53(t) { return t === undefined ? B.archiV53() : B.archiV53(t); }
  var TYPES = Z.TYPES_MENAGE;
  /**
   * Revenu mensuel du système pour un foyer. spec = { adultes, enfants, couts: [coût employeur mensuel de chaque actif], type: 'seul' | 'couple' | 'parent' | null (complément de plancher), isole: majoration, ppa: prime d'activité actuelle (pour ppaMaintenue) } ;
   * opt = { enfantDelta (€ par enfant en plus), lisseF (franchise lisse, € de coût par mois) }. Les leviers de l'architecture (abattementActivite, bonusActivite, ppaMaintenue, socle) sont lus dans a.
   */
  function foyer(a, spec, opt) {
    opt = opt || {}; a = Z.archi(a); var P = pSys(a), n = spec.adultes, e = spec.enfants || 0, ed = P.enfant + (opt.enfantDelta || 0), couts = spec.couts || [];
    var base0 = P.socle * n + ed * e + (spec.isole ? a.majParentIsole * e : 0), act = 0, lev = 0, i;
    var lines = { socle: P.socle * n, enfants: ed * e, majoration: spec.isole ? a.majParentIsole * e : 0, travail: 0, prelevement: 0, franchise: 0, ppaMaintenue: 0, complement: 0 };
    for (i = 0; i < couts.length; i++) {
      var c = couts[i], R = 12 * c, imp = M.impot(R, P) / 12, g = Z.gainIndividuel(a, c);
      if (opt.lisseF > 0) g += a.tPlat * opt.lisseF * (1 - Math.exp(-c / opt.lisseF));
      lines.travail += c; lines.prelevement += imp; lines.franchise += g;
    }
    lines.ppaMaintenue = a.ppaMaintenue > 0 && spec.ppa ? a.ppaMaintenue * spec.ppa : 0;
    var base = base0 + lines.travail - lines.prelevement + lines.franchise + lines.ppaMaintenue;
    // H591 de optimum.js : quand la prime d'activité est maintenue, le complément de plancher n'est plus versé au couple monoactif ni au parent isolé (la prime les protège)
    var sansCompl = a.ppaMaintenue > 0 && (spec.type === 'couple' || spec.type === 'parent');
    if (spec.type && !sansCompl && Z.alphaSortie(a) !== null) {
      var T = TYPES[spec.type], garantie = T.garantie, c0 = Math.max(0, garantie - base0), al = Z.alphaSortie(a);
      if (c0 > 0) lines.complement = lines.travail > 0 ? Math.max(0, c0 - al * (base - base0)) : c0;
    }
    lines.apres = base + lines.complement;
    return lines;
  }
  function specs() {
    var cs = COUT_SMIC, ct = {}, defs = GP.CAS_TYPES;
    function cout(id) { var d = defs.filter(function (x) { return x.id === id; })[0], s = typeof d.s === 'function' ? d.s() : d.s; return s.coutMensuelPlein || s.coutHoraire * 35 * 52 / 12; }
    ct.smic_seul = { adultes: 1, enfants: 0, couts: [cs], type: 'seul', ppa: GP.atlas('celib_locataire_z2', SMIC_BRUT, 2) };
    ct.couple_2smic_2enf = { adultes: 2, enfants: 2, couts: [cs, cs], ppa: OF_GRILLE_COUPLE[1867.02][1] };
    ct.couple_1smic_2enf = { adultes: 2, enfants: 2, couts: [cs], type: 'couple', ppa: GP.atlas('couple_monoactif_2_z2', SMIC_BRUT, 2) };
    ct.cadre_2x = { adultes: 1, enfants: 0, couts: [cout('cadre_2x')], ppa: 0 };
    ct.cadre_4x = { adultes: 1, enfants: 0, couts: [cout('cadre_4x')], ppa: 0 };
    ct.parent_isole_smic = { adultes: 1, enfants: 2, couts: [cs], type: 'parent', isole: true, ppa: GP.atlas('isole_2_z2', SMIC_BRUT, 2) };
    return ct;
  }

  // ======================================================================
  // 1. Décomposition poste par poste (droit actuel OpenFisca contre système)
  // ======================================================================
  var CAS_DECOMP = { smic_seul: { adultes: 1, enfants: 0, coutsBrut: [SMIC_BRUT] }, couple_2smic_2enf: { adultes: 2, enfants: 2, coutsBrut: [SMIC_BRUT, SMIC_BRUT] },
                     couple_2smic_0enf: { adultes: 2, enfants: 0, coutsBrut: [SMIC_BRUT, SMIC_BRUT] }, couple_smic_15_2enf: { adultes: 2, enfants: 2, coutsBrut: [SMIC_BRUT, 1.5 * SMIC_BRUT] } };
  /** Décomposition d'un cas (clé de OF). Lignes d'écart en €/mois (système − actuel) ; somme = écart total. `couts` facultatif : coûts employeur à utiliser (hypothèse alternative : super-brut OpenFisca). */
  function decomposition(id, a, couts) {
    a = a || archiV53(); var o = OF[id], d = CAS_DECOMP[id], cs = couts || d.coutsBrut.map(C.coutDeBrut);
    var sp = { adultes: d.adultes, enfants: d.enfants, couts: cs, type: d.adultes === 1 && !d.enfants ? 'seul' : null, ppa: o.ppa };
    var s = foyer(a, sp), coutTot = cs.reduce(function (x, y) { return x + y; }, 0);
    var prelActuel = coutTot - o.net + o.ir;                 // tout ce que le droit actuel retire au coût employeur du modèle : cotisations patronales (nettes d'allègement) et salariales, CSG, CRDS, IR
    var autresActuel = o.rd - (o.net + o.ppa + o.af + o.al - o.ir);   // prime de Noël (aefa) et divers
    var prelSys = s.prelevement + (a.tPlat * coutTot);
    var tauxPlat = a.tPlat * coutTot, continu = s.prelevement;   // s.prelevement = impôt du modèle (plat + continu)
    var lignes = [
      { poste: 'Prélèvement sur le travail (actuel : cotisations, CSG-CRDS, IR ; système : 42 % + impôt continu)', actuel: -prelActuel, systeme: -continu, ecart: prelActuel - continu },
      { poste: 'Prime d\'activité', actuel: o.ppa, systeme: 0, ecart: -o.ppa },
      { poste: 'Prestations familiales (AF, ARS) contre allocation par enfant de 200 €', actuel: o.af, systeme: s.enfants, ecart: s.enfants - o.af },
      { poste: 'Aides au logement', actuel: o.al, systeme: 0, ecart: -o.al },
      { poste: 'Allocation unique de base (350 € par adulte)', actuel: 0, systeme: s.socle, ecart: s.socle },
      { poste: 'Complément de plancher dégressif', actuel: 0, systeme: s.complement, ecart: s.complement },
      { poste: 'Autres (prime de Noël, etc.)', actuel: autresActuel, systeme: 0, ecart: -autresActuel }
    ];
    var ecart = lignes.reduce(function (x, l) { return x + l.ecart; }, 0);
    return { id: id, libelle: o.libelle, coutEmployeur: coutTot, assietteOpenFisca: o.superBrut, ecartConvention: coutTot - o.superBrut, tauxActuelSurCout: prelActuel / coutTot, tauxPlatSurCout: continu / coutTot,
             cotisationsPatronalesNettes: o.superBrut - o.brut, allegement: o.allegement, cotisationsSalariales: o.cotisSal, csgCrds: o.csg + o.crds, ir: o.ir,
             avant: o.rd, apres: s.apres, ecart: ecart, ecartVerifie: s.apres - o.rd, lignes: lignes, tauxPlat: tauxPlat };
  }
  /** Perte du couple à deux Smic avec la convention du modèle (conjoint à 1 823,07 € brut dans l'atlas) et à convention égale (deux Smic à 1 867,02 €), plus l'hypothèse « coût employeur = super-brut OpenFisca ». */
  function conventions(a) {
    a = a || archiV53(); var s = foyer(a, specs().couple_2smic_2enf).apres;
    return { modele: s - OF_ATLAS_COUPLE.rd, egale: s - OF.couple_2smic_2enf.rd, superBrutOF: decomposition('couple_2smic_2enf', a, [OF.couple_2smic_2enf.superBrut / 2, OF.couple_2smic_2enf.superBrut / 2]).ecart };
  }

  // ======================================================================
  // 2. Taux moyen effectif (personne seule), système contre droit actuel
  // ======================================================================
  /** Taux moyen effectif = (coût employeur − revenu disponible) / coût employeur. Négatif : le foyer reçoit plus qu'il ne verse. `actuel` : atlas OpenFisca (revenu disponible étendu, aides au logement comprises), jusqu'à 3 Smic brut. */
  function tauxMoyen(a, xSmicCout) {
    a = a || archiV53(); var c = xSmicCout * COUT_SMIC, s = foyer(a, { adultes: 1, enfants: 0, couts: [c], type: 'seul' }), brut = C.brutDeCout(c), out = { x: xSmicCout, cout: c, apres: s.apres, taux: (c - s.apres) / c };
    if (brut <= 3 * SMIC_BRUT) { var av = GP.atlas('celib_locataire_z2', brut, 6); out.actuelRevenu = av; out.actuel = (c - av) / c; }
    return out;
  }
  var NIVEAUX = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 10, 25, 100, 400];
  function courbeTauxMoyen(a) { return NIVEAUX.map(function (x) { return tauxMoyen(a, x); }); }
  /** Taux moyen effectif d'un couple avec deux enfants dont le premier travaille au Smic et le second à x Smic brut (x = 0 ; 0,5 ; 1 ; 1,5) ; droit actuel : grille OpenFisca. */
  function tauxMoyenCouple(a, x) {
    a = a || archiV53(); var c = COUT_SMIC + C.coutDeBrut(brutX(x)) * (x > 0 ? 1 : 0), apres = revenuCouple(a, x), av = actuelCouple(x);
    return { x: x, cout: c, apres: apres, taux: (c - apres) / c, actuelRevenu: av, actuel: (c - av) / c };
  }
  /** Revenu en dessous duquel le système verse plus qu'il ne prélève : socle / taux plat (sans complément). */
  function seuilNeutre(a) { a = a || archiV53(); var P = pSys(a); return P.socle / P.tPlat; }

  // ======================================================================
  // 3. Correctifs
  // ======================================================================
  var _gh = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };
  var DISP = { bas: C.SC.bas.disp, central: C.SC.central.disp, haut: C.SC.haut.disp };
  /** Masse annuelle (€) par dixième d'une franchise g(R) de la base du prélèvement, même quadrature que optimum.js (massesAbattement) ; g reçoit le revenu d'activité annuel d'un actif et rend le montant exonéré. */
  function massesFranchise(g, t, disp) {
    var d0 = GP.deciles(Z.versOF(Z.archi({})), undefined, { dispersion: disp }), DI = G.DINA, out = [], d, k;
    for (d = 0; d < 10; d++) {
      var x = d0.deciles[d], nb = x.nonRetraitesM * 1e6 * (1 - x.partSousPlancher), act = (DI.salairesSuperBruts[d] + DI.revenusMixtes[d]) / (DI.salairesSuperBruts[d] + DI.revenusMixtes[d] + DI.revenusFinanciers[d]), m = 0;
      for (k = 0; k < 5; k++) m += _gh.w[k] * t * g(act * x.detail.Rpers * Math.exp(disp * _gh.z[k] - disp * disp / 2));
      out.push(m * nb);
    }
    return out;
  }
  function somme(t) { return t.reduce(function (s, x) { return s + x; }, 0) / 1e9; }
  /** Coût (Md€/an) d'une franchise lisse t × F × (1 − exp(−c/F)) (F en € de coût employeur par mois), selon le scénario (règle de optimum.js : bas = dispersion la moins coûteuse, haut = la plus coûteuse). */
  function coutLisse(Fm, t, sc) {
    var g = function (R) { return Fm * (1 - Math.exp(-(R / 12) / Fm)) * 12 / t * t; };   // montant exonéré annuel (t appliqué dans massesFranchise)
    var v = SCS.map(function (s) { return somme(massesFranchise(g, t, DISP[s])); });
    return sc === 'bas' ? Math.min.apply(null, v) : sc === 'haut' ? Math.max.apply(null, v) : v[1];
  }
  /** Cas types de l'architecture a sous correctif : Z.casTypes (leviers de l'architecture) + écart de l'overlay (allocation par enfant, franchise lisse) recalculé par foyer. */
  function casTypes(a, opt) {
    a = Z.archi(a); opt = opt || {}; var base = Z.casTypes(a), sp = specs(), out = {}, id;
    for (id in base) {
      var e = base[id].ecartMois;
      if (opt.enfantDelta || opt.lisseF) {
        if (sp[id]) e += foyer(a, sp[id], opt).apres - foyer(a, sp[id], {}).apres;
        else if (id === 'parent_isole_sans_emploi') e += (opt.enfantDelta || 0) * 2;
      }
      out[id] = e;
    }
    return out;
  }
  /** Solde central (Md€/an) d'une architecture avec ou sans les pistes prudentes, moins le coût d'un overlay (coût en Md€, ou fonction du taux). */
  function soldeAvec(a, sc, avecPistes, coutOverlay) { var c = typeof coutOverlay === 'function' ? coutOverlay(a, sc) : (coutOverlay || 0); return B.solde(a, sc, avecPistes) - c; }
  /** Plus petit taux plat (dixième de point) au solde central ≥ 0. */
  function tauxEquilibre(a, avecPistes, coutOverlay) {
    var lo = 300, hi = 700, f = function (k) { return soldeAvec(F(Z.archi(a), { tPlat: k / 1000 }), 'central', avecPistes, coutOverlay) >= 0; };
    if (f(lo)) return lo / 1000; if (!f(hi)) return null;
    while (hi - lo > 1) { var m = Math.floor((lo + hi) / 2); if (f(m)) hi = m; else lo = m; }
    return hi / 1000;
  }
  /** Décomposition : un point de taux plat (Md€/an, central). */
  function pointDeTaux(a) { a = Z.archi(a || archiV53()); return B.solde(F(a, { tPlat: a.tPlat + 0.01 }), 'central', false) - B.solde(a, 'central', false); }

  // ---------- Incitation à l'emploi : gain et taux marginal effectif à la reprise (seul ; second adulte d'un couple avec deux enfants dont le premier travaille au Smic)
  var SEGMENTS = [{ id: '0 à mi-temps (0,5 Smic)', de: 0, a: 0.5 }, { id: 'mi-temps à temps plein (0,5 à 1 Smic)', de: 0.5, a: 1 }, { id: '1 à 1,5 Smic', de: 1, a: 1.5 }];
  function brutX(x) { return x * SMIC_BRUT; }
  function revenuSeul(a, x, opt) {
    var c = C.coutDeBrut(brutX(x)), sp = { adultes: 1, enfants: 0, couts: c > 0 ? [c] : [], type: 'seul', ppa: GP.atlas('celib_locataire_z2', brutX(x), 2) };
    return foyer(a, sp, opt).apres;
  }
  function grilleCle(x) { var k = (x * SMIC_BRUT).toFixed(2); var keys = Object.keys(OF_GRILLE_COUPLE), i; for (i = 0; i < keys.length; i++) if (Math.abs(+keys[i] - brutX(x)) < 0.02) return keys[i]; throw new Error('point hors grille : ' + k); }
  function revenuCouple(a, x, opt) {
    var cs = COUT_SMIC, c2 = C.coutDeBrut(brutX(x)), sp = { adultes: 2, enfants: 2, couts: c2 > 0 ? [cs, c2] : [cs], type: x === 0 ? 'couple' : null, ppa: OF_GRILLE_COUPLE[grilleCle(x)][1] };
    return foyer(a, sp, opt).apres;
  }
  function actuelSeul(x) { return GP.atlas('celib_locataire_z2', brutX(x), 6); }
  function actuelCouple(x) { return OF_GRILLE_COUPLE[grilleCle(x)][0]; }
  /** Gains et TME par segment, système contre droit actuel. gain = Δ revenu disponible ; tme = 1 − Δ revenu / Δ coût employeur. */
  function reprise(a, opt) {
    a = Z.archi(a || archiV53());
    function seg(rev, act, s) {
      var c0 = C.coutDeBrut(brutX(s.de)), c1 = C.coutDeBrut(brutX(s.a)) + (rev === revenuCouple ? 0 : 0), dc = c1 - c0, dr = rev(a, s.a, opt) - rev(a, s.de, opt), da = act(s.a) - act(s.de);
      return { segment: s.id, gain: dr, tme: 1 - dr / dc, gainActuel: da, tmeActuel: 1 - da / dc };
    }
    return { seul: SEGMENTS.map(function (s) { return seg(revenuSeul, actuelSeul, s); }), couple: SEGMENTS.map(function (s) { return seg(revenuCouple, actuelCouple, s); }) };
  }
  /** Trappe à inactivité : gain nul ou négatif à la reprise, ou taux marginal effectif de 90 % ou plus, sur un des segments. */
  function trappes(r) {
    var t = [];
    ['seul', 'couple'].forEach(function (k) { r[k].forEach(function (s) { if (s.gain <= 0 || s.tme >= 0.9) t.push(k + ' : ' + s.segment); }); });
    return t;
  }

  // ---------- Correctifs proposés (paramètre minimal qui fait gagner le couple à deux Smic, à convention égale, à 42 %)
  function gainCouple(a, opt) { return casTypes(a, opt).couple_2smic_2enf + (OF_ATLAS_COUPLE.rd - OF.couple_2smic_2enf.rd) * 0 - 0; }
  /** Écart du couple à deux Smic à convention égale (2 × 1 867,02 € brut) : écart du modèle + écart de convention. */
  function ecartCoupleEgal(a, opt) { return casTypes(a, opt).couple_2smic_2enf - (OF.couple_2smic_2enf.rd - OF_ATLAS_COUPLE.rd); }
  /** Écart du couple à deux Smic si le coût employeur est le super-brut d'OpenFisca (1 941,06 € par Smic) au lieu de celui du modèle (1 987,76 €) : hypothèse alternative, V13351. */
  function ecartCoupleSuperBrutOF(a, opt) {
    var sb = OF.couple_2smic_2enf.superBrut / 2, sp = { adultes: 2, enfants: 2, couts: [sb, sb], ppa: OF.couple_2smic_2enf.ppa };
    return foyer(a, sp, opt).apres - OF.couple_2smic_2enf.rd;
  }
  function ecartCouple0Enf(a, opt) { var s = { adultes: 2, enfants: 0, couts: [COUT_SMIC, COUT_SMIC], ppa: OF.couple_2smic_0enf.ppa }; return foyer(a, s, opt).apres - OF.couple_2smic_0enf.rd; }
  function minimal(fn, lo, hi, pas) { var v; for (v = lo; v <= hi; v += pas) if (fn(v) >= 0) return v; return null; }

  var CORRECTIFS = {
    K1: { nom: 'Franchise : les A premiers euros de salaire ne sont pas prélevés (abattement à la base)', param: 'abattementActivite (€ de coût employeur par mois et par actif)',
          archi: function (v, a) { return F(Z.archi(a || archiV53()), { abattementActivite: v }); } },
    K2: { nom: 'Taux réduit sur les premiers euros, fonction continue : impôt = t × [R − F (1 − e^(−R/F))]', param: 'F (€ de coût employeur par mois)',
          archi: function (v, a) { return Z.archi(a || archiV53()); }, opt: function (v) { return { lisseF: v }; }, cout: function (v) { return function (a, sc) { return coutLisse(v, a.tPlat, sc); }; } },
    K3: { nom: 'Allocation par enfant plus forte', param: 'supplément par enfant et par mois (€)',
          archi: function (v, a) { return Z.archi(a || archiV53()); }, opt: function (v) { return { enfantDelta: v }; }, cout: function (v) { return function () { return v * 12 * D.enfants / 1e9; }; } },
    K4: { nom: 'Allocation unique de base plus élevée', param: 'socle (€ par adulte et par mois)',
          archi: function (v, a) { return F(Z.archi(a || archiV53()), { socle: v }); } },
    K6: { nom: 'Bonus d\'activité individuel dégressif (extension du complément dégressif jusqu\'à 1,6 Smic)', param: 'bonusActivite (€ par mois et par actif au plateau)',
          archi: function (v, a) { return F(Z.archi(a || archiV53()), { bonusActivite: v }); } },
    K6b: { nom: 'Bonus d\'activité individuel, extinction rapide à 1,25 Smic', param: 'bonusActivite (€ par mois et par actif au plateau), bonusFin = 1,25',
          archi: function (v, a) { return F(Z.archi(a || archiV53()), { bonusActivite: v, bonusFin: 1.25 }); } },
    K5: { nom: 'Prime d\'activité maintenue en partie (part de la prime actuelle conservée)', param: 'ppaMaintenue (0 à 1)',
          archi: function (v, a) { return F(Z.archi(a || archiV53()), { ppaMaintenue: v }); } }
  };
  /** Évalue un correctif au paramètre v : coût (Md€/an, bas / central / haut), solde à 42 % avec pistes, taux d'équilibre, cas types, déciles, incitations. */
  function evaluer(id, v) {
    var k = CORRECTIFS[id], a0 = archiV53(), a = k.archi(v, a0), opt = k.opt ? k.opt(v) : {}, co = k.cout ? k.cout(v) : null, r = { id: id, v: v, nom: k.nom };
    r.cout = {};
    SCS.forEach(function (s) { r.cout[s] = co ? co(a, s) : B.solde(a0, s, false) - B.solde(a, s, false); });
    r.solde42 = { sans: soldeAvec(a, 'central', false, co), avec: soldeAvec(a, 'central', true, co) };
    r.tauxEq = { sans: tauxEquilibre(a, false, co), avec: tauxEquilibre(a, true, co) };
    r.excedentResiduel = r.solde42.avec; r.economiesNecessaires = Math.max(0, -r.solde42.avec);
    r.cas = casTypes(a, opt); r.casEgal = ecartCoupleEgal(a, opt); r.casEgal0 = ecartCouple0Enf(a, opt); r.casSuperBrutOF = ecartCoupleSuperBrutOF(a, opt);
    r.reprise = reprise(a, opt); r.trappes = trappes(r.reprise);
    return r;
  }
  /** Version financée par le taux : plus petit paramètre (pas `pas`) tel que le couple à deux Smic (convention égale) et le couple sans enfant ne perdent rien AU TAUX D'ÉQUILIBRE (avec pistes prudentes) ; renvoie { v, taux, ... }. */
  function jointe(id, lo, hi, pas) {
    var k = CORRECTIFS[id], v, a0 = archiV53();
    for (v = lo; v <= hi + 1e-9; v += pas) {
      var a = k.archi(v, a0), opt = k.opt ? k.opt(v) : {}, co = k.cout ? k.cout(v) : null, t = tauxEquilibre(a, true, co);
      if (t === null) continue;
      var at = F(a, { tPlat: t }), e = ecartCoupleEgal(at, opt), e0 = ecartCouple0Enf(at, opt);
      if (e >= 0 && (id === 'K3' || e0 >= 0)) return { v: v, taux: t, couple: e, couple0: e0, cas: casTypes(at, opt), cout: co ? co(at, 'central') : B.solde(a0, 'central', true) - B.solde(at, 'central', true) };
    }
    return null;
  }
  /** Déciles (€ par UC et par mois, central) : écart de base de la v5.3 plus l'effet du correctif ; l'effet du financement par le taux n'est pas inclus. */
  function deciles(id, v) {
    var k = CORRECTIFS[id], a0 = archiV53(), a = k.archi(v, a0), base = Z.deciles(a0), uc = G.ucParDecile(), out = [], d;
    if (id === 'K2' || id === 'K3') {
      var extra;
      if (id === 3 || id === 'K3') extra = Z.clePF().map(function (x) { return x * v * 12 * D.enfants; });
      else extra = massesFranchise(function (R) { return v * (1 - Math.exp(-(R / 12) / v)) * 12; }, a0.tPlat, DISP.central).map(function (m, i) { return m / (uc[i] * 1e6 * 12); });
      for (d = 0; d < 10; d++) out.push({ decile: base[d].decile, avant: base[d].ecart, apres: base[d].ecart + extra[d] });
      return out;
    }
    var nv = Z.deciles(a);
    for (d = 0; d < 10; d++) out.push({ decile: base[d].decile, avant: base[d].ecart, apres: nv[d].ecart });
    return out;
  }

  var API = { OF: OF, OF_GRILLE_COUPLE: OF_GRILLE_COUPLE, OF_ATLAS_COUPLE: OF_ATLAS_COUPLE, COUT_SMIC: COUT_SMIC, SMIC_BRUT: SMIC_BRUT, NIVEAUX: NIVEAUX, SEGMENTS: SEGMENTS, CORRECTIFS: CORRECTIFS,
              archiV53: archiV53, foyer: foyer, specs: specs, decomposition: decomposition, conventions: conventions, tauxMoyen: tauxMoyen, tauxMoyenCouple: tauxMoyenCouple, courbeTauxMoyen: courbeTauxMoyen, seuilNeutre: seuilNeutre,
              massesFranchise: massesFranchise, coutLisse: coutLisse, casTypes: casTypes, tauxEquilibre: tauxEquilibre, pointDeTaux: pointDeTaux, reprise: reprise, trappes: trappes,
              ecartCoupleEgal: ecartCoupleEgal, ecartCoupleSuperBrutOF: ecartCoupleSuperBrutOF, ecartCouple0Enf: ecartCouple0Enf, minimal: minimal, evaluer: evaluer, jointe: jointe, deciles: deciles, pSys: pSys };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.DiagnosticCoupleSmic = API;
})(this);
