/*
 * modeles/risques/stress.js : tests de résistance du système (chantier 5 de la boucle « meilleur système », 03/11/2026).
 * Fonctions pures AU-DESSUS des modules de modeles/systeme-ideal/ (jamais modifiés ; le seul état temporaire touché est restauré dans un `finally`).
 * Charger (depuis modeles/systeme-ideal/, `jsc` charge les fichiers dans l'ordre) :
 *   modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js
 *   dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../risques/stress.js
 * Architecture finale v2 (R31-R34, 03/11) : chargée seulement si optimum.js l'est (liste complète : celle de rapport_optimum.js, puis ../risques/stress.js) ; sinon ARCHS n'a que P1N, C40, C40N, ACTUEL.
 * Hypothèses numérotées R1 à R34 : methode.md. Des ordres de grandeur sous hypothèses, jamais des prédictions.
 *
 * Convention : Md€ ; l'année 1 est la première année de plein régime ; scénarios « bas / central / haut » = ceux de options_financement.js
 * (bas = réactions faibles, favorable ; haut = réactions fortes, défavorable). Solde = solde public total, intérêts compris.
 */
(function (root) {
  'use strict';
  var req = function (n, f) { return root[n] || (typeof require !== 'undefined' ? require(f) : null); };
  var M = req('SystemeIdeal', '../systeme-ideal/modele.js'), V = req('Voies', '../systeme-ideal/voies.js'), O = req('Optimisation', '../systeme-ideal/optimisation.js');
  var P1 = req('Palier1', '../systeme-ideal/palier1.js'), X = req('OptionsFinancement', '../systeme-ideal/options_financement.js'), T = req('TaxePatrimoine', '../systeme-ideal/taxe_patrimoine.js');
  var Z = root.Optimum || null;   // facultatif (R31)
  var F = V.fus, N = 10;

  // ---------- Paramètres communs (R1 à R12)
  var ECO = {
    dette0: 3460.5,                 // R1 : dette Maastricht fin 2025, Insee (115,7 % du PIB) ; sources/calculs/cout_sortie_ue.py
    pib0: 3460.5 / 1.157,           // R1 : PIB 2025 déduit (2 991 Md€)
    interets0: 65.7,                // R2 : charge d'intérêts 2025 (Insee, plan-de-bascule § 3.4), déjà comprise dans le déficit du modèle (−169,1 en 2024)
    imarche: 0.0345,                // R3 : OAT 10 ans, début 2026 (recherche-creer-de-la-valeur.md) ; le taux moyen de la dette (2,2 %) y converge
    dureeDette: 8,                  // R4 : durée de vie moyenne de la dette, hypothèse (cout_sortie_ue.py) : année 1 = dette / 8 × choc ; plein régime = dette × choc
    gNominal: 0.03,                 // R5 : croissance nominale (1,2 réel + 1,8 inflation), hypothèse (plan-de-bascule § 3.4 : « ≈ 3 % »)
    ecartPIB: [-0.041, -0.034, -0.024, -0.012, 0, 0, 0, 0, 0, 0]   // R6 : écart de PIB après une récession type 2009 (−3 % la 1re année, puis rebond 2010-2011), cf. methode.md
  };
  // R7 : semi-élasticité du solde au PIB (point de PIB de solde par point d'écart de production)
  var SEMI = {
    actuel: { bas: 0.63, central: 0.63, haut: 0.50 },   // France 0,63 (Commission via Intereconomics 2019) ; moyenne UE 0,5 (OCDE, Girouard-André 2005) ⚠️
    nouveau: { bas: 0.60, central: 0.53, haut: 0.46 }   // R8 : estimation de Claude, décomposition dans methode.md ⚠️
  };
  var SOCLE_COUPE_MAX = 150;        // R9 : coupe maximale du socle par la clause de sauvegarde (plan-de-bascule R2 : ≈ 146 €)
  var MARGE_PTS = 2;                // R10 : marge de ± 2 points de taux plat (plan-de-bascule R3)
  var PROVISION_SI = { bas: 5, central: 5, haut: 13 };   // R11 : provision du système d'information (R5 de plan-de-bascule, ⚠️ V7936)

  // ---------- Architectures
  var PAT = { report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime' };
  var ARCHS = {
    P1N:   { nom: 'Palier 1 + réforme immobilière + taxe 1 % nette de dettes, paiement différé', o: { immobilier: true, taxePatrimoine: { assiette: 'pierreNet', differe: true } } },
    C40:   { nom: 'Chemin documenté 40 % / 500 € (T5 : taxe 1 % brute, patrimoine, économies, CIR supprimé)', o: F(F(PAT, { immobilier: true }), { tPlat: 0.40, taxePatrimoine: { assiette: 'pierre' } }) },
    C40N:  { nom: 'Chemin 40 % / 500 € avec taxe nette de dettes et paiement différé (recommandation)', o: F(PAT, { tPlat: 0.40, immobilier: true, taxePatrimoine: { assiette: 'pierreNet', differe: true } }) },
    ACTUEL: { nom: 'Droit actuel (référence : déficit 2024 conservé, sans réforme)', o: null }
  };
  // R31 : architecture finale v2 (optimum.js, ARCHITECTURE_V2) : son solde de croisière est celui d'Optimum.solde (correctifs, capital de départ, protection, sortie « plat », exil défendable compris) ;
  // `o` (forme options_financement) ne sert qu'aux leviers de socle, à la transition et aux krachs (taxe brute sur la même assiette).
  if (Z && Z.ARCHITECTURE_V2) {
    var V2A = Z.archi(Z.ARCHITECTURE_V2);
    ARCHS.V2 = { nom: 'Architecture finale v2 (' + Math.round(V2A.tPlat * 1000) / 10 + ' %, socle ' + V2A.socle + ' €, taxe 1 % plafonnée, héritage reçu à vie, capital C, PPA ' + Math.round(V2A.ppaMaintenue * 100) + ' %, sortie « plat », exil défendable)',
                 v2: V2A, o: F(Z.versOF(V2A), { taxePatrimoine: { assiette: 'pierre' } }) };
  }
  // H609 : architecture v3 (optimum.js, ARCHITECTURE_V3) : même traitement que la v2 (héritage et capital par fonctions continues : Optimum.partVie, coutCapital) ; nécessite capital-de-depart/modele.js et continu.js
  if (Z && Z.ARCHITECTURE_V3 && root.CDC) {
    var V3A = Z.archi(Z.ARCHITECTURE_V3);
    ARCHS.V3 = { nom: 'Architecture v3 (' + Math.round(V3A.tPlat * 1000) / 10 + ' %, socle ' + V3A.socle + ' €, allocation unique α ' + Math.round(V3A.alphaPlancher * 100) + ' %, taxe 1 % plafonnée, héritage reçu à vie par fonction continue, capital de départ continu, exil défendable)',
                 v2: V3A, o: F(Z.versOF(V3A), { taxePatrimoine: { assiette: 'pierre' } }) };
  }
  // H615 : architecture v3b (impôt d'héritage de forme E', capital exp K = 80 000 €) : même traitement que la v3
  if (Z && Z.ARCHITECTURE_V3B && root.CDC) {
    var V3BA = Z.archi(Z.ARCHITECTURE_V3B);
    ARCHS.V3B = { nom: 'Architecture v3b (' + Math.round(V3BA.tPlat * 1000) / 10 + ' %, socle ' + V3BA.socle + ' €, allocation unique α ' + Math.round(V3BA.alphaPlancher * 100) + ' %, héritage par fonction E\', capital exp K = 80 000 €, exil défendable)',
                  v2: V3BA, o: F(Z.versOF(V3BA), { taxePatrimoine: { assiette: 'pierre' } }) };
  }
  // H624 : architecture v4 (décisions de l'auteur du 03/11 : v3b + non-remplacement dans l'éducation + majoration parent isolé relevée) : même traitement que la v3
  if (Z && Z.ARCHITECTURE_V4 && root.CDC) {
    var V4A = Z.archi(Z.ARCHITECTURE_V4);
    ARCHS.V4 = { nom: 'Architecture v4 (' + Math.round(V4A.tPlat * 1000) / 10 + ' %, socle ' + V4A.socle + ' €, allocation unique α ' + Math.round(V4A.alphaPlancher * 100) + ' %, majoration parent isolé ' + V4A.majParentIsole + ' €, héritage E\', capital exp K = 80 000 €, éducation : non-remplacement, exil défendable)',
                 v2: V4A, o: F(Z.versOF(V4A), { taxePatrimoine: { assiette: 'pierre' } }) };
  }
  // H634 : architecture v5 (v4 + gestion, effectifs, benchmark) : même traitement que la v4, avec deux corrections propres au chemin de dette (calendrier de la gestion, déduction de T6)
  if (Z && Z.ARCHITECTURE_V5 && root.CDC) {
    [['V5', Z.ARCHITECTURE_V5, 'v5'], ['V5A', Z.ARCHITECTURE_V5_AMBITION, 'v5, variante « IA ambitieuse + réserves »']].forEach(function (d) {
      var A5 = Z.archi(d[1]);
      ARCHS[d[0]] = { nom: 'Architecture ' + d[2] + ' (' + Math.round(A5.tPlat * 1000) / 10 + ' %, socle ' + A5.socle + ' €, allocation unique α ' + Math.round(A5.alphaPlancher * 100) + ' %, majoration parent isolé ' + A5.majParentIsole + ' €, gestion, effectifs, benchmark, exil défendable)',
                      v2: A5, o: F(Z.versOF(A5), { taxePatrimoine: { assiette: 'pierre' } }), calendrier: true };
    });
  }
  /** Part réalisée de la gestion supprimée à l'année t (1 = 2029) : rien avant la fermeture de l'ancien système (année 2), puis montée linéaire ; plafonnée par les départs non remplacés (4,15 sur 4,90 au central à l'année 10). sources/economies-gestion-simplification.md § 4. */
  function partGestion(t) { return t <= 2 ? 0 : Math.min(1, 0.167 + 0.138 * (t - 3)); }   // 04/11/2026 (V12410) : plafond de 84,7 % retiré du calendrier (0,847 avant) ; le plafond des départs est désormais appliqué à la somme (GESTION.supprimee d'optimum.js, cas S4 de gestion-effectifs-fiabilisation.md) : le garder ici le compterait deux fois }
  /** Part réalisée du nouveau coût de paiement du socle (le socle monte sur cinq ans, l'ancien système est fermé vers l'année 4). */
  function partCout(t) { return t <= 2 ? 0 : Math.min(1, 0.17 + 0.165 * (t - 3)); }
  /** Part réalisée de l'économie informatique (de l'année 2 à l'année 10, transition de T7). */
  function partInfo(t) { return t <= 1 ? 0 : Math.min(1, (t - 1) / 9); }
  /** Déduction de 1,0 Md€ (1,5 bas / 0,5 haut) de « coût du système public » dans le gain net de T6 (H12) : retirée quand le coût du système est compté au solde (H634) ; gain net de T6 de la ligne D (3,5 / 15 / 33). */
  var RETRAIT_T6 = { bas: { ded: 0.5, gain: 33 }, central: { ded: 1.0, gain: 15 }, haut: { ded: 1.5, gain: 3.5 } };   // scénario du modèle (bas = gains élevés de T6)
  /** Écart (Md€) entre le solde de l'année t et la croisière pour la v5 : calendrier de la gestion, de son coût et de l'informatique ; plus la déduction de T6 retirée (recettes de la ligne D, rampe de T6). */
  function ecartCalendrier(a, sc, t) {
    var ar = ARCHS[a]; if (!ar.calendrier) return 0;
    var G = Z.GESTION, i = ['bas', 'central', 'haut'].indexOf(sc), v = ar.v2;
    var full = Z.gestionNette(v, i), avecInfo = v.gestion === 'avecInformatique';
    var reel = (G.supprimee[i] - G.collectivites[i]) * partGestion(t) - G.coutSocle[i] * partCout(t) + (avecInfo ? G.informatique[i] * partInfo(t) : 0);
    var rt = RETRAIT_T6[sc], vd = P1.valeurPourScenario(t, sc).D;
    return (reel - full) + (vd > 0 ? vd * rt.ded / rt.gain : 0);
  }
  function estV2(a) { return !!(ARCHS[a] && ARCHS[a].v2); }
  /** fn() exécutée avec les paramètres d'exil de l'architecture (v2 : fourchette défendable ; autres : modules tels quels). */
  function dansExil(a, fn) { return estV2(a) ? Z.avecExil(ARCHS[a].v2.exil, fn) : fn(); }
  /** Solde de croisière (Md€) au scénario sc. */
  function croisiere(a, sc) { return estV2(a) ? Z.solde(ARCHS[a].v2, sc) : X.solde(ARCHS[a].o, sc); }
  /** Droits sur les transmissions effectivement perçus (Md€/an) : palier 1 ; v2 : après exemption « reçu à vie » et exception du conjoint (R32). */
  function droitsTransmis(a, sc) {
    if (!estV2(a)) return X.transmissionsMd(sc, 'palier1');
    var v = ARCHS[a].v2; return dansExil(a, function () { return Z.droits(sc, v.tHeritage) * Z.partVie(v) - Z.coutConjoint(sc, v); });
  }

  // ---------- Briques d'un solde annuel
  function nouveau(a) { return !!ARCHS[a].o; }
  function pbStruct(a, sc, t, opt) {
    // solde structurel de l'année t (Md€ de 2025, intérêts actuels compris) : croisière + création de valeur − transition (an 1) − report du paiement différé
    if (!nouveau(a)) return -169.1;
    var o = ARCHS[a].o, s = croisiere(a, sc), v = P1.valeurPourScenario(t, sc), val = opt.sansValeur ? 0 : (opt.sansE ? v.sansE : v.total);
    var tr = t === 1 ? P1.transition(X.stOption(X.opt(o)), sc).total : 0;
    var diff = 0;
    if (estV2(a)) {   // R33 : la taxe plafonnée diffère une partie de la créance : trésorerie des premières années (créances non échues) jusqu'à la durée moyenne de la créance (H537 : 12 ans)
      var td = Z.detail(ARCHS[a].v2, sc).taxeDetail;
      diff = t <= Z.HYP.dureeCreance ? td.nette - td.tresorerieAn1 : 0;
    } else if (o.taxePatrimoine && o.taxePatrimoine.differe && t <= 15) {
      var tp = o.taxePatrimoine, mod = X.SC_PATRIMOINE[sc], r1 = T.recette(mod, F(tp, { avecReformeImmo: !!o.immobilier, annee1: true })), r0 = T.recette(mod, F(tp, { avecReformeImmo: !!o.immobilier }));
      diff = r1.perteDiffere - r0.perteDiffere;   // R12 : 9,1 Md€/an non encaissés jusqu'aux premiers recouvrements (horizon 15 ans)
    }
    var ret = opt.retraitesV6 ? Z.retraitesV6Annee(opt.retraitesV6, ['bas', 'central', 'haut'].indexOf(sc), 2028 + t) : 0;   // H640 : dispositif retraites v6 (valeurs de modeles/retraites, interpolées 2030-2040), hors des architectures par défaut
    var aj = opt.ajust ? opt.ajust(sc, t) : 0;   // options du 04/11 (optimum_options_0411.js) : écart au solde (Md€/an de 2025) par scénario et par année, nul par défaut
    return s + val - tr - diff + ret + aj + (opt.sansCalendrier ? 0 : ecartCalendrier(a, sc, t));   // sansCalendrier : économies de la v5 au régime de croisière dès l'année 1 (comme l'éducation de la v4, V9404)
  }
  var PREROLL = 3;   // R13 : les années 2026-2028 se déroulent au droit actuel ; l'année 1 du modèle est 2029 (premier bloc réel, plan-de-bascule § 2)
  function croissance(t) { return Math.pow(1 + ECO.gNominal, t + PREROLL); }
  /** Marge de ± 2 points de taux plat et pente du socle de l'architecture (Md€ par point, Md€ par € de socle par mois), au scénario sc. */
  function leviers(a, sc) {
    if (!nouveau(a)) return { parPoint: 0, parEuroSocle: 0 };
    var o = ARCHS[a].o, up = estV2(a) ? Z.solde(F(ARCHS[a].v2, { tPlat: Math.round((ARCHS[a].v2.tPlat + 0.01) * 1000) / 1000 }), sc) - Z.solde(ARCHS[a].v2, sc) : X.solde(F(o, { tPlat: (o.tPlat || 0.35) + 0.01 }), sc) - X.solde(o, sc);
    var st = X.stOption(X.opt(o)), pente = P1.penteSocle(st, 'central');
    return { parPoint: up, parEuroSocle: pente };
  }
  /** Solde actuel d'un choc sur l'assiette de la taxe (krach immobilier), Md€/an pour un choc s (négatif), au niveau de 2025. */
  function perteKrachImmo(a, sc, s) { return dansExil(a, function () { return perteKrachImmoBrut(a, sc, s); }); }
  function perteKrachImmoBrut(a, sc, s) {
    var o = ARCHS[a].o, mod = X.SC_PATRIMOINE[sc], tp = F(o.taxePatrimoine || { assiette: 'pierre' }, { avecReformeImmo: !!o.immobilier });
    var out = { taxe: 0, transmissions: 0 };
    if (o.taxePatrimoine) {
      var c = T.composantes(tp.assiette), p = T.PARAM[mod], dp = T.effetPrix(mod, T.COMMUN.taux), ab = T.partAbattement(tp.assiette, tp.abattement || 0);
      out.taxe = -T.COMMUN.taux * Math.abs(s) * (c.immo * p.valImmo + c.terres * p.valTerres) * (1 + dp) * (1 - ab.immo);   // la dette ne baisse pas : la perte porte sur la valeur brute
    }
    var cl = T.composantes('large'), partImmo = (cl.immo + cl.terres) / cl.total;
    out.transmissions = -droitsTransmis(a, sc) * partImmo * Math.abs(s);                                                     // R17 : l'héritage suit le patrimoine immobilier
    out.partImmo = partImmo;
    return out;
  }
  function perteKrachBourse(a, sc, s) { return dansExil(a, function () { return perteKrachBourseBrut(a, sc, s); }); }
  function perteKrachBourseBrut(a, sc, s) {
    var o = ARCHS[a].o, mod = X.SC_PATRIMOINE[sc], out = { taxe: 0, transmissions: 0 };
    if (o.taxePatrimoine) {
      var tp = o.taxePatrimoine, c = T.composantes(tp.assiette), p = T.PARAM[mod], ab = T.partAbattement(tp.assiette, tp.abattement || 0), e = T.COMMUN.taux / 0.01;
      var cotees = c.actions * p.partCotees * Math.abs(s), nonCotees = c.actions * (1 - p.partCotees) * p.valNonCotees * Math.abs(s) * 0.5, opc = c.opc * 0.8 * Math.abs(s);   // R18 : non cotées −50 % du choc ; OPC 80 % actions
      var r = T.recette(mod, F(tp, { avecReformeImmo: !!o.immobilier }));
      out.taxe = -T.COMMUN.taux * (cotees + nonCotees + opc) * (1 - r.erosionMobile) * (1 - ab.mobile);
    }
    var cl = T.composantes('large');
    out.transmissions = -droitsTransmis(a, sc) * ((cl.actions + cl.opc) / cl.total) * Math.abs(s);
    return out;
  }
  /** Exil doublé par rapport au haut : Md€/an de perte supplémentaire (revenus du haut, fuite des transmissions, érosion de la taxe) au scénario sc. */
  function perteExil2(a, sc) { return dansExil(a, function () { return perteExil2Brut(a, sc); }); }
  function perteExil2Brut(a, sc) {
    var o = ARCHS[a].o, st = X.stOption(X.opt(o)), p = F(O.configR(st), {}), SC = M.SCENARIOS, out = { revenus: 0, transmissions: 0, taxe: 0 }, saveSC = {}, k;
    var sol = function (scen) { return M.solde(F(p, { scenario: scen })).soldePublic; };
    try {
      // 1. exil des hauts revenus : on cherche mobil tel que la perte soit le double de celle du scénario haut (haut = 0,40)
      SC.__h0 = F(SC.haut, { mobil: 0 });
      var Lhaut = sol('__h0') - sol('haut'), lo = 0.4, hi = 8, i;
      var perte = function (m) { SC.__x = F(SC.haut, { mobil: m }); return sol('__h0') - sol('__x'); };
      for (i = 0; i < 40; i++) { var m = (lo + hi) / 2; if (perte(m) < 2 * Lhaut) lo = m; else hi = m; }
      var mFit = (lo + hi) / 2;
      SC.__c = F(SC[sc], { mobil: mFit, fuiteTransm: Math.min(0.9, 2 * SC.haut.fuiteTransm - SC.central.fuiteTransm) });   // R19 : fuite des transmissions : 0,65 = écart du haut au central doublé (doubler la fuite elle-même donnerait 0,96, borne absurde)
      var rev = sol('__c') - sol(sc);
      // séparer revenus et transmissions : même scénario sans la fuite supplémentaire
      SC.__d = F(SC[sc], { mobil: mFit });
      out.revenus = sol('__d') - sol(sc);
      out.transmissions = (rev - out.revenus) * (estV2(a) ? droitsTransmis(a, sc) / X.transmissionsMd(sc, 'palier1') : 1);   // v2 : la fuite ne porte que sur les droits perçus (R32)
      out.mFit = mFit; out.perteHaut = Lhaut;
    } finally { delete SC.__h0; delete SC.__x; delete SC.__c; delete SC.__d; }
    if (o.taxePatrimoine) {
      var mod = X.SC_PATRIMOINE[sc], P = T.PARAM[mod], save = F(P, {}), tp = F(o.taxePatrimoine, { avecReformeImmo: !!o.immobilier });
      var avant = T.recette(mod, tp).nette;
      try {
        P.erosionTop = Math.min(1, Math.max(P.erosionTop, T.PARAM.bas.erosionTop) * 2); P.erosionReste = Math.min(1, Math.max(P.erosionReste, T.PARAM.bas.erosionReste) * 2); P.erosionFin = Math.min(1, Math.max(P.erosionFin, T.PARAM.bas.erosionFin) * 2);
        out.taxe = T.recette(mod, tp).nette - avant;
      } finally { for (k in save) P[k] = save[k]; }
    }
    out.total = out.revenus + out.transmissions + out.taxe;
    return out;
  }

  /**
   * R34 : exil au HAUT de la fourchette défendable (sources/exil-patrimoines-preuves.md § 6.2-6.3), posé au scénario sc : fuite des transmissions 52 %, érosion du capital mobile du top 1 % 55 %,
   * mobilité des très hauts revenus du scénario haut (0,40, H16). Perte (Md€/an, négative) par rapport au solde de croisière de l'architecture, décomposée dans l'ordre revenus → transmissions → taxe.
   * v2 : à partir de la fourchette défendable (central 33 % / 35 % / 0,15) ; autres architectures : à partir des valeurs des modules (31 % / 40 %). Nul au haut pour la v2 (déjà au haut de la fourchette).
   */
  var EXIL_HAUT = { fuite: 0.52, erosionTop: 0.55, mobil: M.SCENARIOS.haut.mobil };
  function perteExilHaut(a, sc) {
    var XS = X.SC_PATRIMOINE, S0 = M.SCENARIOS[sc], P0 = T.PARAM[XS[sc]];
    var base = estV2(a) ? Z.EXIL[ARCHS[a].v2.exil] || Z.EXIL.modele : { fuite: { bas: 0.18, central: 0.31, haut: 0.48 }, erosionTop: { bas: 0.20, central: 0.40, haut: 0.74 } };
    function variante(f, e, m) { var v = { fuite: {}, erosionTop: {}, mobil: {} }; ['bas', 'central', 'haut'].forEach(function (s) { v.fuite[s] = base.fuite[s]; v.erosionTop[s] = base.erosionTop[s]; v.mobil[s] = M.SCENARIOS[s].mobil; }); if (f !== null) v.fuite[sc] = f; if (e !== null) v.erosionTop[sc] = e; if (m !== null) v.mobil[sc] = m; return v; }
    function sol(v) {
      if (estV2(a)) return Z.solde(F(ARCHS[a].v2, { exil: v }), sc);
      var save = [S0.fuiteTransm, P0.erosionTop, S0.mobil];
      try { S0.fuiteTransm = v.fuite[sc]; P0.erosionTop = v.erosionTop[sc]; S0.mobil = v.mobil[sc]; return X.solde(ARCHS[a].o, sc); }
      finally { S0.fuiteTransm = save[0]; P0.erosionTop = save[1]; S0.mobil = save[2]; }
    }
    var s0 = sol(variante(null, null, null)), s1 = sol(variante(null, null, EXIL_HAUT.mobil)), s2 = sol(variante(EXIL_HAUT.fuite, null, EXIL_HAUT.mobil)), s3 = sol(variante(EXIL_HAUT.fuite, EXIL_HAUT.erosionTop, EXIL_HAUT.mobil));
    return { revenus: s1 - s0, transmissions: s2 - s1, taxe: s3 - s2, total: s3 - s0 };
  }

  /** Le plus gros bloc de la bascule : recettes annuelles du taux plat sur les revenus d'activité (bloc 1, salariés ; R20 : 90 % de la base de travail). */
  function bloc1(a) {
    var o = ARCHS[a].o, st = X.stOption(X.opt(o)), p = F(O.configR(st), { scenario: 'central' }), rc = M.recettesCourants(M.param(p));
    return 0.9 * st.tPlat * rc.travail;   // base de travail en Md€ (D.salairesCout agrégé par bandes)
  }

  // ---------- Simulation
  /**
   * shocks : { sansE, sansValeur, recession, taux (points de base), krachImmo, krachBourse, exil2, siEchec: {part, definitif}, demo: {ratio2060} }
   * garde : true applique la marge de taux (± 2 points) puis la clause de sauvegarde (coupe du socle), avec un an de retard, et la provision du système d'information.
   */
  function simuler(a, sc, shocks, garde, dep) {
    shocks = shocks || {}; dep = dep || {};
    var ar = ARCHS[a], lev = leviers(a, sc), eps = (nouveau(a) ? SEMI.nouveau : SEMI.actuel)[sc];
    var Y0 = ECO.pib0, D = dep.dette0 || ECO.dette0, ieff = ECO.interets0 / ECO.dette0, imarche = ECO.imarche + (shocks.taux || 0) / 1e4;
    var out = { cyc: [], B: [], D: [], ratio: [], ieff: [], resp: [], marge: [], margePts: [], socleCoupe: [], pb: [], interets: [], choc: [] }, resp = 0, pertePrec = 0;
    var exil = shocks.exil2 && nouveau(a) ? perteExil2(a, sc) : null, exilH = shocks.exilHaut && nouveau(a) ? perteExilHaut(a, sc) : null;
    var immo = shocks.krachImmo && nouveau(a) ? perteKrachImmo(a, sc, shocks.krachImmo) : null, bourse = shocks.krachBourse && nouveau(a) ? perteKrachBourse(a, sc, shocks.krachBourse) : null;
    var pathImmo = [1, 1, 1, 2 / 3, 1 / 3, 0, 0, 0, 0, 0], pathBourse = [1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0];
    var bl = shocks.siEchec && nouveau(a) ? bloc1(a) : 0;
    var base = shocks.__base, t, u;
    if (!dep.sansPreroll) for (u = 1; u <= PREROLL; u++) {          // 2026-2028 au droit actuel : dette et taux moyen de départ de 2029
      ieff = ieff + (ECO.imarche - ieff) / ECO.dureeDette;
      D = D - ((-169.1 + ECO.interets0) * Math.pow(1 + ECO.gNominal, u) - ieff * D);
    }
    out.dette0 = D; out.ratio0 = D / (Y0 * Math.pow(1 + ECO.gNominal, PREROLL));
    for (t = 1; t <= N; t++) {
      var k = croissance(t), Y = Y0 * k, gap = shocks.recession ? ECO.ecartPIB[t - 1] : 0;
      // intérêts : le taux moyen de la dette converge vers le taux de marché (1/durée par an) ; l'écart de taux agit dès l'année 1 (4,3 Md€ par +100 pb)
      ieff = ieff + (imarche - ieff) / ECO.dureeDette;
      var interets = ieff * D;
      var pb = (pbStruct(a, sc, t, shocks) + ECO.interets0) * k;                 // solde primaire (hors intérêts), à l'échelle du PIB
      var choc = 0;
      var cyc = shocks.recession ? eps * gap * Y : 0;                                // R7 : gap négatif -> solde dégradé
      choc += cyc; out.cyc.push(cyc);
      if (immo) choc += (immo.taxe + immo.transmissions) * pathImmo[t - 1] * k;
      if (bourse) choc += (bourse.taxe + bourse.transmissions) * pathBourse[t - 1] * k;
      if (exil) choc += exil.total * k;
      if (exilH) choc += exilH.total * k;
      if (shocks.siEchec && nouveau(a)) {
        var f = shocks.siEchec.part === undefined ? 1 : shocks.siEchec.part, lam = shocks.siEchec.definitif === undefined ? 0.1 : shocks.siEchec.definitif;
        if (garde) { if (t === 1) choc -= PROVISION_SI[sc] * k; }                    // shadow mode + double système : on ne perd que la provision
        else { if (t === 1) choc -= f * bl * k; if (t === 2 || t === 3) choc += (1 - lam) * f * bl * k / 2; }   // R21 : année perdue, recouvrée à 90 % sur deux ans
      }
      if (shocks.demo) {
        var Xr = 1.8 + (1.41 - 1.8) * Math.min(1, (t + PREROLL) / 35), Xs = 1.8 + (shocks.demo.ratio2060 - 1.8) * Math.min(1, (t + PREROLL) / 35);   // R22 : COR 1,8 (2025) -> 1,41 (2060) ; choc : -> 1,1 ; 2025 + 3 ans de réforme
        choc -= (M.DONNEES.massePensions / M.DONNEES.pib) * Y * (Xr / Xs - 1);
      }
      var gardeT = 0;
      if (garde && shocks.__base && t >= 2) {
        var need = base.B[t - 2] - (out.B[t - 2] - (garde === 'structurelle' ? out.cyc[t - 2] : 0));   // 'structurelle' : le manque dû au cycle seul (récession) ne déclenche pas la clause                                      // R23 : un an de retard, contrôle intégral (on corrige le manque constaté)
        var cap = (MARGE_PTS * lev.parPoint + SOCLE_COUPE_MAX * lev.parEuroSocle) * k;
        resp = Math.max(0, Math.min(cap, resp + need));
        gardeT = resp;
      } else if (garde) resp = 0;
      var mg = Math.min(resp, MARGE_PTS * lev.parPoint * k), sc_ = resp - mg;
      var B = pb - interets + choc + gardeT;
      D = D - B;
      var Yreel = Y * (1 + gap);
      out.B.push(B); out.D.push(D); out.ratio.push(D / Yreel); out.ieff.push(ieff); out.resp.push(resp); out.marge.push(mg); out.margePts.push(lev.parPoint > 0 ? mg / (lev.parPoint * k) : 0); out.socleCoupe.push(lev.parEuroSocle > 0 ? sc_ / (lev.parEuroSocle * k) : 0);
      out.pb.push(pb); out.interets.push(interets); out.choc.push(choc);
    }
    out.exil = exil; out.exilHaut = exilH; out.immo = immo; out.bourse = bourse; out.leviers = lev; out.bloc1 = bl;
    return out;
  }
  /** Simule avec et sans choc ; renvoie le résumé (solde 1/5/10, dette/PIB 5/10, manque cumulé, réserve de lissage = pic du manque cumulé). */
  function test(a, sc, shocks, garde, dep) {
    var b = simuler(a, sc, {}, false, dep);
    var s = simuler(a, sc, F(shocks, { __base: b }), garde || false, dep), cum = 0, pic = 0, i, maxPerte = 0, cum3 = 0;
    for (i = 0; i < N; i++) { cum += b.B[i] - s.B[i]; if (i < 3) cum3 = cum; if (cum > pic) pic = cum; if (b.B[i] - s.B[i] > maxPerte) maxPerte = b.B[i] - s.B[i]; }
    var pic = 0; for (i = 0; i < N; i++) if (s.ratio[i] > pic) pic = s.ratio[i];
    return { base: b, choc: s, ratioPic: pic, reserve3: cum3, soldeAn1: s.B[0], soldeAn5: s.B[4], soldeAn10: s.B[9], ratio5: s.ratio[4], ratio10: s.ratio[9], ratio5base: b.ratio[4], ratio10base: b.ratio[9],
             manqueCumule10: cum, reserve: pic, pireAn: maxPerte, soldeAn1base: b.B[0], soldeAn5base: b.B[4], soldeAn10base: b.B[9] };
  }

  // ---------- Sensibilités spécifiques
  /** Intérêts supplémentaires par rapport au taux de marché de base (année 1 et plein régime) : vérification de cout_sortie_ue.py. */
  function surcoutInterets(dette, pb, duree) { return { an1: dette / duree * pb / 1e4, plein: dette * pb / 1e4 }; }
  /** Part de la recette de la taxe qui disparaît pour un choc d'indice de s (indice local) et avec un indice lissé sur w années (moyenne mobile : même perte cumulée, pic réduit). */
  function lissage(niveaux, w) {
    var out = [], i, j, s, c;
    for (i = 0; i < niveaux.length; i++) { s = 0; c = 0; for (j = Math.max(0, i - w + 1); j <= i; j++) { s += niveaux[j]; c++; } out.push(s / w); }
    return out;
  }

  var API = { ECO: ECO, SEMI: SEMI, ARCHS: ARCHS, PROVISION_SI: PROVISION_SI, SOCLE_COUPE_MAX: SOCLE_COUPE_MAX, MARGE_PTS: MARGE_PTS, N: N,
    PREROLL: PREROLL, ecartCalendrier: ecartCalendrier, partGestion: partGestion, partCout: partCout, partInfo: partInfo, RETRAIT_T6: RETRAIT_T6, pbStruct: pbStruct, leviers: leviers, perteKrachImmo: perteKrachImmo, perteKrachBourse: perteKrachBourse, perteExil2: perteExil2, perteExilHaut: perteExilHaut, EXIL_HAUT: EXIL_HAUT, estV2: estV2, croisiere: croisiere, droitsTransmis: droitsTransmis, bloc1: bloc1, simuler: simuler, test: test, surcoutInterets: surcoutInterets, lissage: lissage };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Stress = API;
})(this);
