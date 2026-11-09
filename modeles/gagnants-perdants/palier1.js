/*
 * modeles/gagnants-perdants/palier1.js — recalage du 03/11/2026 : gagnants et perdants du PALIER 1 de modeles/systeme-ideal/ (et de ses chemins de financement).
 * Fonctions pures. Charger (dans cet ordre) : ../systeme-ideal/{modele, fiscalite_actuelle, voies, sante, optimisation, retraites2, palier1,
 * patrimoine_financier, deces_realisation, options_financement}.js, puis cas_types_donnees.js, droit_actuel.js, modele.js (ANCIEN système, gardé pour l'historique
 * et pour ses données de répartition : DINA, FPS, ucParDecile, retraitesParDecile), puis ce fichier.
 *
 * Ce que ce fichier change par rapport à modele.js (socle 1 000 €, taux 50 %, tout remplacé, retraités au complément de carrière) :
 *  - les PARAMÈTRES viennent de systeme-ideal (`OptionsFinancement.stOption` : socle 500 €, taux plat 35 %, impôt continu R0 = 24 000 € et 30 %, retraités sanctuarisés) ;
 *    un « chemin » (objet `o` d'options_financement.js : tPlat, socleFacteur, rampe) les remplace sans toucher aucun défaut de systeme-ideal ;
 *  - le socle n'est versé qu'aux adultes NON RETRAITÉS (+ 200 € par enfant) ; les pensions, le minimum vieillesse et l'AAH sont inchangés ; l'impôt des retraités reste (CSG-CRDS-Casa + IR) ;
 *    le capital des retraités (20 % du capital courant, jeu « recherche ») reste au PFU ;
 *  - le PLANCHER RSA (877 € = RSA + aide au logement d'une personne seule) est versé aux 1,9 million de bénéficiaires sans autre revenu (répartis comme les minima sociaux : D1 d'abord), et l'assurance chômage
 *    dégressive (deg2) est conservée pour sa part non remplacée par le socle ;
 *  - la situation de RÉFÉRENCE (droit actuel) des dixièmes est le revenu disponible de l'Insee (RSA, prime d'activité, aides au logement hors RDB, prestations familiales
 *    inclus) ; celle des cas types est OpenFisca-France 2026 (droit_actuel.js : RSA 651,69 € moins forfait logement, prime d'activité, aides au logement, prestations familiales).
 * Hypothèses H440 à H449 (methode.md § 10). Des ordres de grandeur, jamais des prédictions. ⚠️ = non confirmé.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var M = root.SystemeIdeal || (req ? req('../systeme-ideal/modele.js') : null);
  var V = root.Voies || (req ? req('../systeme-ideal/voies.js') : null);
  var O = root.Optimisation || (req ? req('../systeme-ideal/optimisation.js') : null);
  var FA = root.FiscaliteActuelle || (req ? req('../systeme-ideal/fiscalite_actuelle.js') : null);
  var OF = root.OptionsFinancement || (req ? req('../systeme-ideal/options_financement.js') : null);
  var G = root.GagnantsPerdants || (req ? req('./modele.js') : null);
  var CAS = root.CAS_TYPES_DONNEES || (req ? req('./cas_types_donnees.js') : null);
  var DA = root.DROIT_ACTUEL || (req ? req('./droit_actuel.js') : null);
  var D = M.DONNEES, F = V.fus;

  // ---------- Chemins de financement (options_financement.js ; objets `o` passés à OptionsFinancement.stOption)
  // Seuls tPlat, socle et montée comptent pour les gagnants et perdants ; héritage, patrimoine et économies ne se répartissent pas par décile (options-financement-palier1.md § 2).
  var CHEMINS = {
    palier1: { libelle: 'Palier 1 (35 %, socle 500 €)', o: {} },
    c1: { libelle: 'Chemin 1 : 38 %, socle de 250 à 500 € sur 10 ans', o: { tPlat: 0.38, rampe: { annees: 10, depart: 250 } }, an: [1, 5, 10] },
    c2: { libelle: 'Chemins 2 et 3 : 41,5 %, socle 400 €', o: { tPlat: 0.415, socleFacteur: 0.8 } },
    c4: { libelle: 'Chemin 4 : 45 %, socle 400 €', o: { tPlat: 0.45, socleFacteur: 0.8 } }
  };
  var ORDRE = ['palier1', 'c1', 'c2', 'c4'];
  /** Configuration (st) et paramètres de modèle (p) d'un chemin à l'année n de la montée (n absent = régime). */
  function config(chemin, n) {
    var c = typeof chemin === 'string' ? CHEMINS[chemin] : { o: chemin };
    var o = OF.opt(c.o), st = OF.stOption(o, n);
    return { st: st, p: F(O.configR(st), { scenario: 'central' }), o: o };
  }

  // ---------- Dispersion (Gauss-Hermite à 5 points, moyenne conservée), même quadrature que modele.js de systeme-ideal
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };
  var HYP = {
    dispersion: 0.6,          // H441 ⚠️ : dispersion log-normale des revenus d'activité et du capital entre adultes non retraités d'un même dixième de niveau de vie (conjoints, temps partiels, inactifs) ; sensibilité 0,3 et 0,9 dans resultats.md
    plancherRsa: D.rsa.niveau, // 877 € par mois et par adulte non retraité : plancher du palier 1 (systeme-ideal, H134 ; RSA + aide au logement d'une personne seule, T14)
    rsaN: D.rsa.n             // 1,9 million de bénéficiaires du plancher RSA (systeme-ideal D.rsa ; DREES fiche 23 : 1,85 M de foyers fin 2023, 1,84 M fin 2024, 97 % sans emploi ou sous 500 €/mois : 1,9 M = arrondi haut de 3 %, V6850 ; répartition par dixième ⚠️)
  };

  // ======================================================================
  // 1. Par dixième de niveau de vie (comptes nationaux distribués, Insee 2023), palier 1
  // ======================================================================
  /** Impôt actuel des retraités d'un dixième (€ par an, total pour le dixième) : CSG-CRDS-Casa de 9,1 % sur la pension brute + IR calculé sur la pension moyenne (fiscalite_actuelle.js, H182). ⚠️ H443. */
  function impotRetraites(effectif, pensionBruteAn) {
    var netMois = pensionBruteAn / 12 * (1 - FA.PENSIONS.csgCrdsCasa);
    return effectif * (FA.PENSIONS.csgCrdsCasa * pensionBruteAn + FA.irRetraiteSeul(netMois));
  }

  /**
   * Gagnants et perdants du palier 1 (ou d'un chemin) par dixième de niveau de vie, € par UC et par an puis par mois.
   *   avant  = revenu disponible Insee (RDB, 2023) ; les aides au logement, hors RDB, sont comptées comme perdues (remplacées par le socle)
   *   après  = adultes non retraités : max( socle + R − impôt(R) ; plancher RSA ) en moyenne sur la dispersion (R = revenu d'activité et du capital des actifs, base coût employeur) ;
   *            + 200 € par enfant ; pensions, loyers imputés, minimum vieillesse et AAH inchangés ; − impôt des retraités ; capital des retraités au PFU ;
   *            + part conservée de l'assurance chômage ; + prestations non remplacées (prestations familiales, RSA et prime d'activité remplacés).
   * Les ménages entiers ne sont pas modélisés : le socle des adultes est réparti en proportion des unités de consommation (H440 ⚠️).
   */
  function deciles(chemin, n, hyp) {
    var cf = config(chemin, n), p = cf.p, P = M.param(p), h = F(HYP, hyp || {});
    var uc = G.ucParDecile(), ucTot = uc.reduce(function (s, x) { return s + x; }, 0), ret = G.retraitesParDecile(uc), DINA = G.DINA, FPS = G.FPS, POP = G.POP, VG = G.VINGTIEMES;
    var finTotal = 0, d, g;
    for (d = 0; d < 10; d++) finTotal += DINA.revenusFinanciers[d] * uc[d] * 1e6;
    // capital total (financiers + loyers réels) et part des retraités (H442 : 20 %, clé par dixième de pension de modele.js de systeme-ideal, jeu « recherche »)
    var capD = [], totCap = 0;
    for (d = 0; d < 10; d++) {
      var lr = Math.min(DINA.loyers[d], 40.9e9 * DINA.revenusFinanciers[d] / finTotal);   // loyers réels (H10 de modele.js : 40,9 Md€ au total, répartis comme les revenus financiers)
      capD.push({ fin: DINA.revenusFinanciers[d], lr: lr, loyersImputes: DINA.loyers[d] - lr });
      totCap += (DINA.revenusFinanciers[d] + lr) * uc[d] * 1e6;
    }
    var partRet = D.partCapitalRetraitesRecherche, cleCap = D.capitalRetraitesDecileRecherche;
    // part de l'assurance chômage conservée par le palier 1 (coût du complément dégressif / allocations actuelles)
    var kChom = Math.min(1, M.coutChomage(P) / D.chomage.md);
    var floor = P.complRsa ? 12 * h.plancherRsa : 0, out = [], total = 0, partRsa = [], sRsa = 0;
    for (d = 0; d < 10; d++) { partRsa.push(FPS.primeActiviteMinima[d] * uc[d]); sRsa += partRsa[d]; }      // H444 ⚠️ : bénéficiaires du plancher répartis comme les « prime d'activité et minima sociaux » (portrait social 2025)
    for (d = 0; d < 10; d++) partRsa[d] /= sRsa;
    for (d = 0; d < 10; d++) {
      var ucd = uc[d] * 1e6, adultesTous = POP.adultes * uc[d] / ucTot, enfants = POP.enfants * uc[d] / ucTot;
      var nonRet = Math.max(adultesTous - ret.effectifs[d], 0.1 * adultesTous);
      var capRet = Math.min(partRet * totCap * cleCap[d] / ucd, capD[d].fin + capD[d].lr);      // € par UC et par an : capital détenu par des retraités
      var base = DINA.salairesSuperBruts[d] + DINA.revenusMixtes[d] + (capD[d].fin + capD[d].lr - capRet);   // € par UC et par an, assiette des actifs
      var nR = Math.min(h.rsaN * partRsa[d], 0.9 * nonRet);                                      // bénéficiaires du plancher RSA : sans autre revenu (comme le coût du plancher dans systeme-ideal solde()), H444 ⚠️
      var Rpers = base * ucd / (nonRet - nR);                                                    // € par adulte non retraité hors plancher et par an
      var sig = h.dispersion, X = 0;
      for (g = 0; g < 5; g++) {
        var R = Rpers * Math.exp(sig * GH.z[g] - sig * sig / 2);
        X += GH.w[g] * (12 * P.socle + R - M.impot(R, P));
      }
      var topUp = floor ? Math.max(0, floor - 12 * P.socle) : 0;
      var xUC = (X * (nonRet - nR) + nR * (12 * P.socle + topUp)) / ucd, plancherUC = nR * topUp / ucd, nPlancher = nR / nonRet;
      var chomage = Math.max(0, (VG.pensionsChomageMd[2 * d] + VG.pensionsChomageMd[2 * d + 1]) * 1e9 / ucd - DINA.pensions[d]);
      var autresPrest = DINA.prestations[d] - DINA.pensions[d] - chomage;
      var remplacees = Math.min(FPS.prestationsFamiliales[d] + (1 - G.DEFAUT.partAAH) * FPS.primeActiviteMinima[d], autresPrest);
      var apl = FPS.aidesLogement[d];
      var impRet = impotRetraites(ret.effectifs[d], ret.pensionMoyenneAn[d]) / ucd;
      var propose = xUC + 12 * P.enfant * enfants / ucd + capD[d].loyersImputes + DINA.pensions[d] - impRet + capRet * (1 - D.pfu) + kChom * chomage + (autresPrest - remplacees) + DINA.autresTransferts[d];
      var ecart = propose - DINA.rdb[d] - apl;
      total += ecart * ucd;
      out.push({ decile: 'D' + (d + 1), uc: uc[d], rdbMois: DINA.rdb[d] / 12, ecartMoisUC: ecart / 12, ecartPct: ecart / DINA.rdb[d], proposeMois: (propose - apl) / 12,
                 partSousPlancher: nPlancher, plancherMoisUC: plancherUC / 12, nonRetraitesM: nonRet / 1e6,
                 detail: { Rpers: Rpers, socleMoisUC: 12 * P.socle * nonRet / ucd / 12, impotRetraitesMoisUC: impRet / 12, aplMoisUC: apl / 12, remplaceesMoisUC: remplacees / 12 } });
    }
    return { deciles: out, ecartTotalMd: total / 1e9, socle: P.socle, tPlat: P.tPlat, kChom: kChom, plancherCoutMd: out.reduce(function (s, x) { return s + x.plancherMoisUC * 12 * x.uc * 1e6; }, 0) / 1e9 };
  }

  /** Dernier dixième : top 1 % et 0,1 % (bandes D10d et D10e de systeme-ideal, revenu d'activité et du capital, plancher RSA sans effet à ce niveau). */
  function hauts(chemin, n) {
    var cf = config(chemin, n), r = M.effetsParDecile(cf.p), o = {};
    r.forEach(function (b) { o[b.id] = { ecartMois: b.ecartMois, avantMois: b.avantMois }; });
    return { top1: o['D10d (1 %)'], top01: o['D10e (0,1 %)'], d10a: o.D10a, d10b: o.D10b, d10c: o.D10c };
  }

  // ======================================================================
  // 2. Cas types, droit actuel OpenFisca 2026 (droit_actuel.js) contre palier 1
  // ======================================================================
  /** Interpolation linéaire d'une colonne de l'atlas OpenFisca (revenu disponible étendu : colonne 6) selon le salaire brut mensuel. */
  function atlas(cas, brut, col) {
    var t = DA.cas[cas].brut, c = col === undefined ? 6 : col, i;
    if (brut <= t[0][0]) return t[0][c];
    for (i = 1; i < t.length; i++) if (brut <= t[i][0]) return t[i - 1][c] + (t[i][c] - t[i - 1][c]) * (brut - t[i - 1][0]) / (t[i][0] - t[i - 1][0]);
    return t[t.length - 1][c];
  }
  function cdd(id) { for (var i = 0; i < CAS.length; i++) if (CAS[i].id === id) return CAS[i]; return null; }
  var SMIC_BRUT = 1867.02;   // Smic brut mensuel au 1/6/2026 (cas_types_donnees.js, service-public.gouv.fr) ; l'atlas date du 1/1/2026 (1 823,07 €) : barème 2026 identique, courbe lue au salaire de 1 867,02 €
  var PLANCHER_PARENT_ISOLE = 1300;   // palier1.js PARENT_ISOLE.plancher (H109 ⚠️)

  /**
   * Définition des cas types. `avant` : revenu disponible actuel (€/mois, OpenFisca 2026) ; `s` : source pour M.situation (salaires au coût employeur du Smic, T14) ;
   * `plancher` : 'rsa' (plancher RSA 877 €), 'parentIsole' (plancher ciblé 1 300 €), 'retraite' (sanctuarisé : revenu actuel hors aide au logement inchangé).
   */
  var CAS_TYPES = [
    { id: 'rsa_seul', libelle: 'Personne seule au RSA (locataire, zone 2)', avant: function () { return atlas('celib_locataire_z2', 0); }, s: { adultes: 1, enfants: 0, age: 40, heuresSemaine: 0 }, plancher: 'rsa',
      note: 'RSA de base 651,69 € moins le forfait logement : 572,35 € versés, aide au logement 304,84 €, prime de Noël et autres : 890 € au total (OpenFisca 2026)' },
    { id: 'smic_seul', libelle: 'Salarié seul au Smic à temps plein', avant: function () { return cdd('smic').actuel.revenu_disponible; }, s: { adultes: 1, enfants: 0, age: 40, heuresSemaine: 35, coutHoraire: D.smicCoutHoraire }, plancher: 'rsa',
      note: 'cas T14 (OpenFisca 2026) : net 1 477,93 € + prime d\'activité 229,52 €' },
    { id: 'couple_2smic_2enf', libelle: 'Couple, 2 enfants, deux Smic à temps plein', avant: function () { return atlas('couple_biactif_2_z2', SMIC_BRUT); }, s: { adultes: 2, enfants: 2, age: 40, heuresSemaine: 35, coutHoraire: D.smicCoutHoraire, deuxEmplois: true }, plancher: 'rsa',
      note: 'atlas OpenFisca 2026, zone 2, loyer 750 € ; 2 Smic, prime d\'activité, allocations familiales, aide au logement' },
    { id: 'couple_1smic_2enf', libelle: 'Couple, 2 enfants, un seul Smic', avant: function () { return atlas('couple_monoactif_2_z2', SMIC_BRUT); }, s: { adultes: 2, enfants: 2, age: 40, heuresSemaine: 35, coutHoraire: D.smicCoutHoraire }, plancher: 'rsa',
      note: 'atlas OpenFisca 2026, zone 2 : remplace l\'estimation grossière de 2 552 € de systeme-ideal (⚠️ H447)' },
    { id: 'retraite_aspa', libelle: 'Retraité au minimum vieillesse (ASPA, pension 800 € brut), sans aide au logement', avant: function () { return cdd('retraite_800').actuel.revenu_disponible; }, retraite: true,
      note: 'cas T14 : ASPA 1 043,59 € ; sanctuarisé par le palier 1 : inchangé' },
    { id: 'retraite_aspa_loc', libelle: 'Retraité au minimum vieillesse, locataire (avec aide au logement de 305 €)', avant: function () { return atlas('retraite_aspa_z2', 800); }, retraite: true, perdAL: true,
      note: '⚠️ H448 : le palier 1 compte les 16 Md€ d\'aides au logement comme remplacés (depensesRemplacees) et ne verse le socle qu\'aux non-retraités : l\'aide au logement du retraité locataire disparaît dans le modèle, sans compensation' },
    { id: 'cadre_2x', libelle: 'Cadre seul, 3 Smic brut (≈ 4 420 € nets)', avant: function () { return cdd('cadre_2x').actuel.revenu_disponible; }, s: function () { return { adultes: 1, enfants: 0, age: 45, heuresSemaine: 35, coutMensuelPlein: cdd('cadre_2x').couts_employeur[0] }; }, plancher: 'rsa',
      note: 'cas T14 (OpenFisca 2026) : 3 776,62 €' },
    { id: 'cadre_4x', libelle: 'Cadre seul, 6 Smic brut (≈ 8 300 € nets)', avant: function () { return cdd('cadre_4x').actuel.revenu_disponible; }, s: function () { return { adultes: 1, enfants: 0, age: 45, heuresSemaine: 35, coutMensuelPlein: cdd('cadre_4x').couts_employeur[0] }; }, plancher: 'rsa',
      note: 'cas T14 (OpenFisca 2026) : 6 871,88 €' },
    { id: 'parent_isole_smic', libelle: 'Parent isolé, 2 enfants, un Smic', avant: function () { return atlas('isole_2_z2', SMIC_BRUT); }, s: { adultes: 1, enfants: 2, age: 35, heuresSemaine: 35, coutHoraire: D.smicCoutHoraire }, plancher: 'parentIsole',
      note: 'atlas OpenFisca 2026, zone 2 : Smic, prime d\'activité, allocations familiales et ASF, aide au logement' },
    { id: 'parent_isole_sans_emploi', libelle: 'Parent isolé, 2 enfants, sans emploi (RSA majoré)', avant: function () { return atlas('isole_2_z2', 0); }, s: { adultes: 1, enfants: 2, age: 35, heuresSemaine: 0 }, plancher: 'parentIsole',
      note: 'atlas OpenFisca 2026 : RSA 610 €, aide au logement 494 €, prestations 626 € ; remplace l\'« avant » de 1 650 € estimé de mémoire dans systeme-ideal (⚠️ H447)' }
  ];

  /** Cas types d'un chemin : avant, après, écart en €/mois et en %. */
  function casTypes(chemin, n) {
    var cf = config(chemin, n), p = cf.p, P = M.param(p);
    return CAS_TYPES.map(function (c) {
      var avant = c.avant(), apres;
      if (c.retraite) apres = c.perdAL ? avant - atlas('retraite_aspa_z2', 800, 3) : avant;
      else {
        var s = typeof c.s === 'function' ? c.s() : c.s;
        apres = M.situation(s, p).apresMois;
        if (c.plancher === 'rsa' && P.complRsa && (s.heuresSemaine || 0) === 0) apres = Math.max(apres, D.rsa.niveau);
        if (c.plancher === 'parentIsole') apres = Math.max(apres, D.rsa.niveau, PLANCHER_PARENT_ISOLE);
      }
      return { id: c.id, libelle: c.libelle, avantMois: avant, apresMois: apres, ecartMois: apres - avant, ecartPct: (apres - avant) / avant, note: c.note };
    });
  }

  /** Taux de plat (point mort) en deçà duquel un cas type gagne, par dichotomie sur le taux plat à socle donné ; null si hors de [0 ; 0,8]. */
  function tauxPointMort(id, socleFacteur) {
    var f = function (t) { var r = casTypes({ tPlat: t, socleFacteur: socleFacteur === undefined ? 1 : socleFacteur }); return r.filter(function (x) { return x.id === id; })[0].ecartMois; };
    if (f(0) < 0 || f(0.8) > 0) return null;
    var a = 0, b = 0.8, i;
    for (i = 0; i < 40; i++) { var m = (a + b) / 2; if (f(m) > 0) a = m; else b = m; }
    return (a + b) / 2;
  }

  // ======================================================================
  // 3. Lecture « ancienne » (salariés par décile de salaire, systeme-ideal effetsParDecile) : gardée pour l'historique et la comparaison
  // ======================================================================
  /** Écart par décile de SALAIRE (salariés seulement, hors RSA, hors retraités ; options_financement.js deciles) : c'est le calcul qui a donné « D1 à D3 perdent à 45 % et 400 € ». */
  function decilesSalaries(chemin, n) {
    var cf = config(chemin, n);
    return OF.deciles(cf.o, n).parDecile.map(function (b) { return { id: b.id, ecartMois: b.ecartMois }; });
  }

  var API = { CHEMINS: CHEMINS, ORDRE: ORDRE, HYP: HYP, CAS_TYPES: CAS_TYPES, SMIC_BRUT: SMIC_BRUT, PLANCHER_PARENT_ISOLE: PLANCHER_PARENT_ISOLE, config: config, deciles: deciles, hauts: hauts,
    casTypes: casTypes, tauxPointMort: tauxPointMort, decilesSalaries: decilesSalaries, atlas: atlas, impotRetraites: impotRetraites };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.GagnantsPerdantsPalier1 = API;
})(this);
