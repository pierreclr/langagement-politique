/*
 * modeles/rattrapage-robotique-ia/modele.js
 * Rattraper la Chine et les États-Unis en IA et en robotique : combien investir, sur quelle
 * durée, pour quels emplois, financé comment (fonds souverain alimenté par l'héritage payé
 * en parts, et emprunt d'investissement).
 * Fonctions pures, sans dépendance. Compatible navigateur, Node et JavaScriptCore (jsc).
 *
 * Postes d'investissement public (voir methode.md, section 3) :
 *   1. calcul : centres de données d'IA à capital public majoritaire (coûts Epoch AI 2026,
 *      serveurs renouvelés tous les 5 ans, bâtiment 14 ans) ;
 *   2. champions : prises de participation dans des entreprises d'IA et de robotique ;
 *   3. usines : capacité de production de robots (humanoïdes, service, agriculture) ;
 *   4. déploiement : aide à l'installation de robots dans les entreprises françaises ;
 *   5. formation : ingénieurs et techniciens supplémentaires ;
 *   6. matériel : participation aux projets européens (puces, PIIEC) ;
 *   7. recherche publique en IA et en robotique.
 * Financement : parts d'héritage versées au fonds (non liquides : seuls leurs dividendes et
 * des cessions progressives donnent du cash), le reste par emprunt.
 * Hypothèses H1 à H20 : voir methode.md. Ordres de grandeur, jamais des prédictions.
 */
(function (root) {
  'use strict';

  // ---------- Données de départ (donnees/*.csv ; ⚠️ = non confirmé) ----------
  var DONNEES = {
    usdParEur: 1.13,          // H1 ⚠️ taux indicatif
    pibFranceMdE: 2920,       // H2 ⚠️ PIB 2024 (Insee), ordre de grandeur
    // Centre de données d'IA, Epoch AI (14/05/2026), Md USD par GW de puissance totale.
    dc: {
      capexLongueVieUsdParGw: 11.43 + 0.34,   // bâtiment + terrain + raccordement (14 ans)
      capexCourteVieUsdParGw: 21.19 + 4.93,   // serveurs + réseau (5 ans)
      dureeVieCourteAns: 5,
      opexUsdParGwAn: 0.907,
      utilisation: 0.71,
      emploisParMw: 0.25                      // Randstad via Banque des Territoires (0,2-0,3)
    },
    soldeExportateurTWh: 92,                  // RTE 2025
    demandesRaccordementDcGw: 18,             // presse citant RTE ⚠️
    diplomesIngenieurAn: 47700,               // MESR 2023
    comparaisons: {
      priveIaUsaMdUsd2025: 285.88, priveIaFranceMdUsd2025: 4.36, priveIaChineMdUsd2025: 12.41,
      fondsOrientationChineIaMdUsd: 184, capexHyperscalers2025MdUsd: 376
    }
  };

  // ---------- Scénarios d'investissement (H8 à H15 ; montants publics) ----------
  var SCENARIOS = {
    spectateur: {
      libelle: 'Rester spectateur : rythme actuel de France 2030, le calcul vient des investisseurs étrangers',
      gwPublics: 0, partPubliqueCalcul: 0,
      championsMdEAn: 0.2,
      usinesUnitesAn: 0, capexParUniteKE: 10, partPubliqueUsines: 0,
      robotsAidesAn: 0, coutRobotInstalleKE: 100, tauxAide: 0,
      ingenieursSupAn: 0, techniciensSupAn: 0,
      materielMdEAn: 0.2, rechercheMdEAn: 0.3
    },
    cible: {
      libelle: 'Rattrapage ciblé : niches (calcul bas carbone, robotique de service et agricole, logistique), 1 GW public',
      gwPublics: 1, partPubliqueCalcul: 0.5,
      championsMdEAn: 2,
      usinesUnitesAn: 20000, capexParUniteKE: 10, partPubliqueUsines: 0.3,
      robotsAidesAn: 10000, coutRobotInstalleKE: 100, tauxAide: 0.2,
      ingenieursSupAn: 15000, techniciensSupAn: 20000,
      materielMdEAn: 1, rechercheMdEAn: 1
    },
    leadership: {
      libelle: 'Ambition de leadership : 5 GW, filière humanoïde de masse, champions financés au niveau mondial',
      gwPublics: 5, partPubliqueCalcul: 0.5,
      championsMdEAn: 8,
      usinesUnitesAn: 200000, capexParUniteKE: 10, partPubliqueUsines: 0.5,
      robotsAidesAn: 30000, coutRobotInstalleKE: 100, tauxAide: 0.3,
      ingenieursSupAn: 30000, techniciensSupAn: 50000,
      materielMdEAn: 4, rechercheMdEAn: 3
    }
  };

  // ---------- Paramètres de financement, d'emploi et de formation (H16 à H20) ----------
  var PARAMETRES = {
    dureeAns: 10,
    // Héritage payé en parts : actifs professionnels transmis par an (Md€), taux 50 %, fuite (T5).
    actifsProTransmisMdE: [20, 40, 60],       // H16 : 20 = Dutreil 2024 observé ; 40 et 60 hypothèses ⚠️
    tauxHeritageEntreprise: 0.5,               // plan.md, chapitre 5
    fuite: [0.48, 0.31, 0.18],                 // T5 : fort, central, faible (ordre bas → haut)
    rendementDividendes: 0.03,                 // H17 ⚠️ dividendes des parts reçues
    tauxCessionAn: 0.03,                       // H17 ⚠️ part du stock revendue chaque année
    tauxEmprunt: 0.033,                        // H18 ⚠️ OAT 10 ans, ordre de grandeur
    // Emplois directs (H19, hypothèses de Claude ⚠️)
    coutEmploiChampionsKE: 300,                // dépense par emploi dans un laboratoire ou une start-up
    coutEmploiRechercheKE: 150,
    caParEmploiUsineKE: 250,
    prixRobotKE: 40,
    tauxUtilisationUsines: 0.5,
    // Coût de formation complet par diplômé supplémentaire (H20 ⚠️)
    coutIngenieurKE: 45, coutTechnicienKE: 24,
    partIngenieursDansEmplois: { champions: 0.7, recherche: 0.8, usines: 0.15, calcul: 0.3 }
  };

  function niveauIdx(n) { return n === 'bas' ? 0 : n === 'haut' ? 2 : 1; }

  /**
   * Coût du calcul public sur la durée (Md€), capacité montée linéairement, serveurs renouvelés.
   * Renvoie le capex total (public + privé) et la part publique.
   */
  function coutCalcul(gw, partPublique, dureeAns, d) {
    d = d || DONNEES;
    var dc = d.dc, parAn = gw / dureeAns, longue = 0, courte = 0;
    for (var t = 0; t < dureeAns; t++) {
      longue += parAn * dc.capexLongueVieUsdParGw;
      // tranche installée l'année t : achat initial puis renouvellements tant que t + k·L < durée
      for (var a = t; a < dureeAns; a += dc.dureeVieCourteAns) courte += parAn * dc.capexCourteVieUsdParGw;
    }
    var totalMdE = (longue + courte) / d.usdParEur;
    var energieTWh = gw * 8.76 * dc.utilisation;
    return {
      capexTotalMdE: totalMdE, capexPublicMdE: totalMdE * partPublique,
      opexFinAnMdE: gw * dc.opexUsdParGwAn / d.usdParEur,
      energieTWhAn: energieTWh, emploisExploitation: gw * 1000 * dc.emploisParMw
    };
  }

  /** Simule un scénario. options : { scenario, niveau ('bas'|'central'|'haut'), surcharges, parametres } */
  function simuler(options, donnees) {
    options = options || {};
    var d = donnees || DONNEES;
    var s = {}, k, base = SCENARIOS[options.scenario || 'cible'];
    for (k in base) s[k] = base[k];
    if (options.surcharges) for (k in options.surcharges) s[k] = options.surcharges[k];
    var p = {};
    for (k in PARAMETRES) p[k] = PARAMETRES[k];
    if (options.parametres) for (k in options.parametres) p[k] = options.parametres[k];
    var n = niveauIdx(options.niveau), N = p.dureeAns;

    // 1. Investissements publics sur la durée (Md€)
    var calcul = coutCalcul(s.gwPublics, s.partPubliqueCalcul, N, d);
    var postes = {
      calcul: calcul.capexPublicMdE,
      champions: s.championsMdEAn * N,
      usines: s.usinesUnitesAn * s.capexParUniteKE / 1e6 * s.partPubliqueUsines,
      deploiement: s.robotsAidesAn * s.coutRobotInstalleKE * s.tauxAide / 1e6 * N,
      // une promotion supplémentaire par an ; coût complet étalé (ordre de grandeur)
      formation: (s.ingenieursSupAn * p.coutIngenieurKE + s.techniciensSupAn * p.coutTechnicienKE) / 1e6 * N,
      materiel: s.materielMdEAn * N,
      recherche: s.rechercheMdEAn * N
    };
    var publicTotal = 0;
    for (k in postes) publicTotal += postes[k];
    var priveInduit = calcul.capexTotalMdE - calcul.capexPublicMdE +
      s.usinesUnitesAn * s.capexParUniteKE / 1e6 * (1 - s.partPubliqueUsines) +
      s.robotsAidesAn * s.coutRobotInstalleKE * (1 - s.tauxAide) / 1e6 * N;

    // 2. Emplois directs en régime (fin de période), hors emplois détruits par l'automatisation
    var emplois = {
      calcul: calcul.emploisExploitation,
      champions: s.championsMdEAn * 1e6 / p.coutEmploiChampionsKE,
      recherche: s.rechercheMdEAn * 1e6 / p.coutEmploiRechercheKE,
      usines: s.usinesUnitesAn * p.tauxUtilisationUsines * p.prixRobotKE / p.caParEmploiUsineKE
    };
    var emploisTotal = emplois.calcul + emplois.champions + emplois.recherche + emplois.usines;
    var pi = p.partIngenieursDansEmplois;
    var ingenieursRequis = emplois.calcul * pi.calcul + emplois.champions * pi.champions +
      emplois.recherche * pi.recherche + emplois.usines * pi.usines;

    // 3. Financement : parts d'héritage (non liquides) + emprunt
    var partsAn = p.actifsProTransmisMdE[n] * p.tauxHeritageEntreprise * (1 - p.fuite[n]);
    var besoinAn = publicTotal / N, stock = 0, dette = 0, cashFonds = 0, interets = 0;
    for (var t = 0; t < N; t++) {
      stock += partsAn;
      var cash = stock * (p.rendementDividendes + p.tauxCessionAn);
      stock -= stock * p.tauxCessionAn;
      var utilise = Math.min(cash, besoinAn);
      cashFonds += utilise;
      interets += dette * p.tauxEmprunt;
      dette += besoinAn - utilise;
    }

    return {
      scenario: options.scenario || 'cible', libelle: s.libelle, dureeAns: N,
      postesMdE: postes, publicTotalMdE: publicTotal, publicParAnMdE: publicTotal / N,
      publicParAnPctPib: publicTotal / N / d.pibFranceMdE * 100,
      priveInduitMdE: priveInduit, totalMdE: publicTotal + priveInduit,
      calcul: calcul,
      energieVsExportPct: calcul.energieTWhAn / d.soldeExportateurTWh * 100,
      emplois: emplois, emploisDirects: emploisTotal,
      ingenieursRequis: ingenieursRequis,
      ingenieursFormesSup: s.ingenieursSupAn,
      financement: {
        partsHeritageAnMdE: partsAn, stockPartsFinMdE: stock,
        cashFondsCumuleMdE: cashFonds, partCouverteParFonds: publicTotal > 0 ? cashFonds / publicTotal : 0,
        detteFinMdE: dette, interetsCumulesMdE: interets, chargeInteretsFinAnMdE: dette * p.tauxEmprunt
      }
    };
  }

  /** Valeur du portefeuille public au bout de la durée selon un rendement annuel r (sensibilité). */
  function valeurPortefeuille(resultat, r) {
    var N = resultat.dureeAns, parAn = resultat.publicParAnMdE, v = 0;
    var investissable = resultat.postesMdE.calcul + resultat.postesMdE.champions + resultat.postesMdE.usines;
    var part = resultat.publicTotalMdE > 0 ? investissable / resultat.publicTotalMdE : 0;
    for (var t = 0; t < N; t++) v = v * (1 + r) + parAn * part;
    return v;
  }

  function grille(donnees) {
    var r = {};
    for (var sc in SCENARIOS) {
      r[sc] = {};
      ['bas', 'central', 'haut'].forEach(function (niv) { r[sc][niv] = simuler({ scenario: sc, niveau: niv }, donnees); });
    }
    return r;
  }

  var API = {
    DONNEES: DONNEES, SCENARIOS: SCENARIOS, PARAMETRES: PARAMETRES,
    coutCalcul: coutCalcul, simuler: simuler, valeurPortefeuille: valeurPortefeuille, grille: grille
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.RattrapageRobotiqueIA = API;
})(this);
