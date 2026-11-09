/*
 * modeles/gagnants-perdants/correctifs.js — correctifs « ne perdre personne » du palier 1 et de ses chemins (03/11/2026).
 * Fonctions pures. Charger les mêmes fichiers que palier1.js (voir test_palier1.js), puis palier1.js, puis ce fichier.
 * Aucun défaut de systeme-ideal ni de palier1.js n'est modifié : les correctifs s'ajoutent, ils ne remplacent rien.
 *
 * Quatre correctifs, seuls puis combinés :
 *  (a) maintien des aides au logement des retraités locataires sous plafond de ressources (le palier 1 les compte comme remplacées : 16 Md€) ;
 *  (b) majoration pour parent isolé : montant de l'ASF 2026 (200,78 €/mois et par enfant) × 3,166 M d'enfants de familles monoparentales ;
 *  (c) bonus d'activité : socle plus élevé sur les premiers revenus d'activité, en remplacement de la prime d'activité supprimée (montée, plateau, extinction) ;
 *  (d) plancher garanti par ménage « pas moins qu'aujourd'hui » pendant N ans (clause de transition).
 * Hypothèses H450 à H459 (methode.md § 11). Ordres de grandeur, jamais des prédictions. ⚠️ = non confirmé (verifications.md, V6900-V6919).
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var M = root.SystemeIdeal || (req ? req('../systeme-ideal/modele.js') : null);
  var OF = root.OptionsFinancement || (req ? req('../systeme-ideal/options_financement.js') : null);
  var P1 = root.GagnantsPerdantsPalier1 || (req ? req('./palier1.js') : null);
  var G = root.GagnantsPerdants || (req ? req('./modele.js') : null);
  var D = M.DONNEES;
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };
  var SCS = ['bas', 'central', 'haut'];

  // ---------- Hypothèses (bas = le moins coûteux, haut = le plus coûteux ; le « bas » n'est donc pas « favorable » au sens de systeme-ideal pour les soldes : voir troue())
  var HYP = {
    allocFoyersAL: 5.9e6,       // H450 ⚠️ V6900 : foyers allocataires d'une aide au logement fin 2023 (DREES, Minima sociaux et prestations de solidarité 2025, fiche 34), relu sur la fiche le 03/11/2026 : 5 871 200 foyers (tableau 2, p. 287) ; 5,8 M fin 2024 ✅ V6900
    alMd: 16.0,                 // dépense d'aides au logement comptée comme remplacée par le palier 1 (systeme-ideal D.depensesRemplacees : logement 16,0)
    asf: 200.78,                // H451 : ASF 2026 par enfant et par mois (V6320 confirmée)
    enfantsMonop: 3.166e6,      // H451 : enfants mineurs de familles monoparentales (Insee, RP2023)
    famillesMonop: 1.997e6,     // familles monoparentales avec enfants mineurs (Insee, RP2023)
    couplesAvecEnfants: 5.95e6, // H457 ⚠️ : couples avec enfants mineurs = 7,937 M familles avec mineurs (Insee 2022) − 1,985 M monoparentales
    bonusMax: 200,              // H452 : bonus d'activité maximal, € par mois (choix de calibrage : à comparer à la prime d'activité actuelle ≈ 230 € au Smic)
    bonusMontee: 0.5,           // H452 : montée de 0 à 100 % du bonus entre 0 et 0,5 Smic brut
    bonusPlateau: 1.0,          // plateau jusqu'au Smic brut
    bonusFin: 1.6,              // extinction linéaire jusqu'à 1,6 Smic brut (ordre de la prime d'activité actuelle : ⚠️ V4104)
    parentsEmploi: 0.7          // H456 ⚠️ : part des parents isolés qui travaillent
  };
  var SC = {
    bas:     { fAL: 0.08, partParent: 0.5, asfMontant: 200.78, disp: 0.3, locataires: 0.3, kParent: 0.5,  monoactifs: 0.15 },
    central: { fAL: 0.12, partParent: 1.0, asfMontant: 200.78, disp: 0.6, locataires: 0.5, kParent: 0.75, monoactifs: 0.25 },
    haut:    { fAL: 0.16, partParent: 1.0, asfMontant: 300,    disp: 0.9, locataires: 1.0, kParent: 1.0,  monoactifs: 0.35 }
  };

  // ---------- Coût employeur et salaire brut (H453 ⚠️ : approximation des cotisations patronales, allègements compris)
  var SMIC_COUT = D.smicCoutHoraire * 35 * 52 / 12;     // 1 987,76 € par mois
  var SMIC = P1.SMIC_BRUT;
  function tauxPatronal(brut) {
    var x = brut / SMIC;
    if (x <= 1) return SMIC_COUT / SMIC - 1;            // ≈ 6,5 % au Smic
    if (x <= 1.6) return (SMIC_COUT / SMIC - 1) + (0.30 - (SMIC_COUT / SMIC - 1)) * (x - 1) / 0.6;
    if (x <= 3.5) return 0.30 + 0.12 * (x - 1.6) / 1.9;
    return 0.42;
  }
  function coutDeBrut(brut) { return brut * (1 + tauxPatronal(brut)); }
  function brutDeCout(cout) { var a = 0, b = cout, i; for (i = 0; i < 60; i++) { var m = (a + b) / 2; if (coutDeBrut(m) > cout) b = m; else a = m; } return (a + b) / 2; }

  // ---------- (c) Bonus d'activité (€ par mois, par adulte), fonction du salaire brut mensuel
  function bonus(brut, B, fin) {
    B = B === undefined ? HYP.bonusMax : B; fin = fin || HYP.bonusFin;
    if (brut <= 0) return 0;
    var x = brut / SMIC;
    if (x < HYP.bonusMontee) return B * x / HYP.bonusMontee;
    if (x <= HYP.bonusPlateau) return B;
    if (x >= fin) return 0;
    return B * (fin - x) / (fin - HYP.bonusPlateau);
  }

  function ucTab() { return G.ucParDecile(); }

  // ---------- Coûts des correctifs a et b (indépendants du chemin)
  /** (a) Md€/an et nombre de ménages : f × 16 Md€ des aides au logement vont à des retraités ; l'aide est déjà sous conditions de ressources (le plafond est celui du droit actuel). */
  function coutA(sc) { var f = SC[sc].fAL; return { md: f * HYP.alMd, menages: f * HYP.allocFoyersAL, parMenageMois: f * HYP.alMd * 1e9 / (f * HYP.allocFoyersAL) / 12 }; }
  /** (b) Md€/an : montant × enfants × part ciblée × 12 ; nombre de familles concernées = familles monoparentales × part. */
  function coutB(sc) { var s = SC[sc]; return { md: s.asfMontant * HYP.enfantsMonop * s.partParent * 12 / 1e9, menages: HYP.famillesMonop * s.partParent }; }

  // ---------- Profil d'un adulte seul sans enfant, sans correctif et avec bonus (c) : après (apres) et avant (droit actuel, OpenFisca)
  function apresSeul(p, cout, B, fin) {
    var a = M.situation({ adultes: 1, enfants: 0, age: 40, heuresSemaine: 35, coutMensuelPlein: cout }, p).apresMois;
    return a + (B ? bonus(brutDeCout(cout), B, fin) : 0);
  }
  function avantSeul(cout, lambda) {
    var brut = brutDeCout(cout);
    return P1.atlas('celib_locataire_z2', brut, 6) - (1 - lambda) * P1.atlas('celib_locataire_z2', brut, 3);   // les non-locataires n'ont pas l'aide au logement
  }

  /**
   * Masses par dixième (€ par an, total) pour les adultes non retraités hors plancher RSA, par quadrature de la dispersion (comme palier1.deciles) :
   *   perte : somme des pertes individuelles (avant − après)+ d'un adulte seul sans enfant ; bonus : coût du bonus (c) ; perteResiduelle : perte après bonus.
   */
  function massesDeciles(chemin, n, sc, B, fin, plaf, kmax) {
    var cf = P1.config(chemin, n), p = cf.p, d0 = P1.deciles(chemin, n, { dispersion: SC[sc].disp }), out = [], d, g;
    for (d = 0; d < 10; d++) {
      var x = d0.deciles[d], nb = x.nonRetraitesM * 1e6 * (1 - x.partSousPlancher), perte = 0, bon = 0, res = 0, nPerd = 0, nBon = 0, nRes = 0;
      for (g = 0; g < 5; g++) {
        var R = x.detail.Rpers * Math.exp(SC[sc].disp * GH.z[g] - SC[sc].disp * SC[sc].disp / 2);
        var cout = R / 12, ok = !plaf || brutDeCout(cout) <= plaf * SMIC, av = avantSeul(cout, SC[sc].locataires), ap = apresSeul(p, cout, 0), apB = apresSeul(p, cout, B, fin);
        if (!ok) { av = ap; }
        perte += GH.w[g] * Math.max(0, av - ap) * 12 * nb;
        bon += (kmax && d >= kmax ? 0 : GH.w[g] * (apB - ap) * 12 * nb);
        res += GH.w[g] * Math.max(0, av - apB) * 12 * nb;
        if (av > ap) nPerd += GH.w[g] * nb; if (apB > ap && !(kmax && d >= kmax)) nBon += GH.w[g] * nb; if (av > apB) nRes += GH.w[g] * nb;
      }
      out.push({ decile: x.decile, uc: x.uc, perteAn: perte, bonusAn: bon, residuAn: res, adultes: nb, perdants: nPerd, beneficiaires: nBon, perdantsResiduels: nRes });
    }
    return out;
  }
  function somme(t, k) { return t.reduce(function (s, x) { return s + x[k]; }, 0) / 1e9; }

  /** (c) coût du bonus d'activité (Md€/an) pour un chemin, une dispersion donnée par le scénario ; « bas » et « haut » sont les extrêmes sur les trois dispersions (0,3, 0,6, 0,9). */
  function coutC(chemin, n, B, fin, kmax) {
    var v = SCS.map(function (s) { return somme(massesDeciles(chemin, n, s, B, fin, 0, kmax), 'bonusAn'); });
    var nb = SCS.map(function (s) { return somme(massesDeciles(chemin, n, s, B, fin, 0, kmax), 'beneficiaires') * 1e9; });
    var lo = Math.min.apply(null, v), hi = Math.max.apply(null, v);
    return { bas: lo, central: v[1], haut: hi, beneficiaires: nb[1] };
  }

  // ---------- Cas types avec correctifs
  /** Cas types corrigés. corr = { a:bool, b:bool, c:bool|montant, d:bool (plancher « pas moins qu'aujourd'hui » : ramène à 0 toute perte) }. */
  function casTypes(chemin, n, corr) {
    corr = corr || {};
    var B = corr.c === true ? HYP.bonusMax : (corr.c || 0), fin = corr.cFin;
    var cf = P1.config(chemin, n), p = cf.p;
    return P1.casTypes(chemin, n).map(function (c) {
      var ecart = c.ecartMois, add = 0, def = P1.CAS_TYPES.filter(function (x) { return x.id === c.id; })[0], s = typeof def.s === 'function' ? def.s() : def.s;
      if (corr.a && def.perdAL) add += P1.atlas('retraite_aspa_z2', 800, 3);
      if (corr.b && s && s.enfants > 0 && s.adultes === 1) add += HYP.asf * s.enfants;
      if (B && s && !def.retraite && (s.heuresSemaine || 0) > 0) {
        var cout = (s.coutHoraire || (s.coutMensuelPlein / (35 * 52 / 12))) * Math.min(s.heuresSemaine, 35) * 52 / 12 * (s.deuxEmplois ? 2 : 1);
        add += (s.deuxEmplois ? 2 : 1) * bonus(brutDeCout(cout / (s.deuxEmplois ? 2 : 1)), B, fin);
      }
      var e = ecart + add, apres = c.avantMois + e;
      if (corr.d && e < 0) { e = 0; apres = c.avantMois; }
      return { id: c.id, libelle: c.libelle, avantMois: c.avantMois, apresMois: apres, ecartMois: e, ecartInitialMois: ecart, ajoutMois: add };
    });
  }

  /** Bonus d'activité qui annule exactement la perte du smicard seul (€/mois), par chemin : B* = −écart du cas smic_seul (au plateau). */
  function bonusNeutralisantSmicard(chemin, n) {
    var e = P1.casTypes(chemin, n).filter(function (x) { return x.id === 'smic_seul'; })[0].ecartMois;
    return Math.max(0, -e);
  }

  // ---------- Taux marginal effectif d'un adulte seul sans enfant, en fonction du salaire (multiples du Smic brut), avec ou sans bonus
  function tauxMarginal(chemin, n, B, xSmic, fin) {
    var p = P1.config(chemin, n).p, brut = xSmic * SMIC, c0 = coutDeBrut(brut), c1 = coutDeBrut(brut * 1.01);
    return 1 - (apresSeul(p, c1, B, fin) - apresSeul(p, c0, B, fin)) / (c1 - c0);
  }

  /** Plage de salaires bruts (en multiples du Smic) où un adulte seul sans enfant perd par rapport au droit actuel (locataire ou non), sans correctif, au pas de 0,05 Smic. */
  function zonePerte(chemin, n, lambda) {
    var p = P1.config(chemin, n).p, x, lo = null, hi = null;
    for (x = 0.05; x <= 4; x += 0.05) {
      var c = coutDeBrut(x * SMIC);
      if (avantSeul(c, lambda === undefined ? 0.5 : lambda) - apresSeul(p, c, 0) > 0) { if (lo === null) lo = x; hi = x; }
    }
    return { lo: lo, hi: hi };
  }

  // ---------- (d) Plancher garanti : coût annuel pendant la garantie, et moyenne sur 10 ans pour une garantie de N ans
  function coutDlignes(chemin, n, sc, corr) {
    corr = corr || {};
    var s = SC[sc], B = corr.c === true ? HYP.bonusMax : (corr.c || 0);
    var m = massesDeciles(chemin, n, sc, B, corr.cFin, corr.dPlafond, corr.cKmax);
    var seuls = (B ? somme(m, 'residuAn') : somme(m, 'perteAn'));
    var sansD = fus(corr, { d: false }), ct = casTypes(chemin, n, sansD), ci = {}; ct.forEach(function (c) { ci[c.id] = c; });
    // parents isolés : actifs (perte du cas « Smic » × k) et sans emploi (perte du cas sans emploi)
    var pe = Math.max(0, -ci.parent_isole_smic.ecartMois) * s.kParent, ps = Math.max(0, -ci.parent_isole_sans_emploi.ecartMois);
    var parents = HYP.famillesMonop * (HYP.parentsEmploi * pe + (1 - HYP.parentsEmploi) * ps) * 12 / 1e9;
    // couples à un seul salaire avec enfants (⚠️ H457 : cas « un Smic » pris comme perte représentative)
    var couples = HYP.couplesAvecEnfants * s.monoactifs * Math.max(0, -ci.couple_1smic_2enf.ecartMois) * 12 / 1e9;
    var retraites = corr.a ? 0 : coutA(sc).md;
    var nSeuls = somme(m, B ? 'perdantsResiduels' : 'perdants') * 1e9;
    var menages = nSeuls + (pe > 0 || ps > 0 ? HYP.famillesMonop : 0) + (couples > 0 ? HYP.couplesAvecEnfants * s.monoactifs : 0) + (retraites > 0 ? coutA(sc).menages : 0);
    return { seuls: seuls, parents: parents, couples: couples, retraites: retraites, total: seuls + parents + couples + retraites, menages: menages };
  }
  function coutD(chemin, n, corr) {
    var r = {}; SCS.forEach(function (s) { r[s] = coutDlignes(chemin, n, s, corr).total; });
    return r;
  }
  /** Moyenne annuelle sur 10 ans d'une garantie de N ans (perte compensée à 100 % pendant N ans, puis plus rien). */
  function moyenne10(coutAn, N) { return coutAn * Math.min(N, 10) / 10; }

  // ---------- Trou de financement des chemins (soldes de options_financement.js, mêmes définitions que rapport_options_financement.js)
  var BASEC = { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime' };
  function fus(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  var CHEMINS_SOLDE = {
    palier1: { libelle: 'Palier 1 seul (35 %, socle 500 €, héritage à 50 %)', o: {}, cle: 'palier1' },
    c1: { libelle: 'Chemin 1 (38 %, montée du socle)', o: { tPlat: 0.38, rampe: { annees: 10, depart: 250 }, report150: true }, cle: 'c1' },
    c2: { libelle: 'Chemin 2 (41,5 %, 400 €)', o: BASEC, cle: 'c2' },
    c3: { libelle: 'Chemin 3 (chemin 2, héritage réaliste)', o: fus(BASEC, { heritage: 'ecart35' }), cle: 'c2' },
    c4: { libelle: 'Chemin 4 (45 %, 400 €)', o: { tPlat: 0.45, socleFacteur: 0.8, heritage: 'ecart35', report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime' }, cle: 'c4' }
  };
  /** Solde de croisière bas / central / haut (systeme-ideal, convention : « bas » = réactions faibles, favorable). */
  function soldeChemin(id) { var o = CHEMINS_SOLDE[id].o, r = {}; OF.SCS.forEach(function (s) { r[s] = OF.solde(o, s); }); return r; }

  // ---------- Effets sur les dixièmes (€ par UC et par mois)
  function decilesCorriges(chemin, n, corr) {
    corr = corr || {};
    var B = corr.c === true ? HYP.bonusMax : (corr.c || 0), sc = 'central';
    var base = P1.deciles(chemin, n), uc = ucTab(), FPS = G.FPS, i, out = [];
    var al = [], pf = [], sAl = 0, sPf = 0;
    for (i = 0; i < 10; i++) { al.push(FPS.aidesLogement[i] * uc[i]); pf.push(FPS.prestationsFamiliales[i] * uc[i]); sAl += al[i]; sPf += pf[i]; }
    var m = massesDeciles(chemin, n, sc, B, corr.cFin, corr.dPlafond, corr.cKmax), ct = coutDlignes(chemin, n, sc, corr);
    for (i = 0; i < 10; i++) {
      var ucd = uc[i] * 1e6 * 12, e0 = base.deciles[i].ecartMoisUC, ajout = 0;
      if (corr.a) ajout += coutA(sc).md * 1e9 * al[i] / sAl / ucd;
      if (corr.b) ajout += coutB(sc).md * 1e9 * pf[i] / sPf / ucd;
      if (B) ajout += m[i].bonusAn / ucd;
      if (corr.d) ajout += (m[i].residuAn * 0 + (B ? m[i].residuAn : m[i].perteAn)) / ucd + (ct.parents + ct.couples) * 1e9 * pf[i] / sPf / ucd + ct.retraites * 1e9 * al[i] / sAl / ucd;
      out.push({ decile: base.deciles[i].decile, ecartInitial: e0, ajout: ajout, ecart: e0 + ajout });
    }
    return out;
  }

  var API = { HYP: HYP, SC: SC, SCS: SCS, SMIC_COUT: SMIC_COUT, bonus: bonus, brutDeCout: brutDeCout, coutDeBrut: coutDeBrut, coutA: coutA, coutB: coutB, coutC: coutC, coutD: coutD, coutDlignes: coutDlignes,
    moyenne10: moyenne10, casTypes: casTypes, bonusNeutralisantSmicard: bonusNeutralisantSmicard, tauxMarginal: tauxMarginal, zonePerte: zonePerte, decilesCorriges: decilesCorriges, massesDeciles: massesDeciles,
    CHEMINS_SOLDE: CHEMINS_SOLDE, soldeChemin: soldeChemin, avantSeul: avantSeul, apresSeul: apresSeul };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Correctifs = API;
})(this);
