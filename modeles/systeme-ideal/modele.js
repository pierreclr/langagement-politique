/*
 * modeles/systeme-ideal/modele.js — Tâche T47 : le système idéal (socle, prime d'activité, impôt continu,
 * holdings, CIR, retraites, transition, exonérations seniors et heures supplémentaires, retraités aisés).
 * Fonctions pures, sans dépendance. Compatible navigateur, Node et JavaScriptCore (jsc).
 * Données réutilisées (copiées, avec renvoi) : modeles/gagnants-perdants, offre-de-travail, retraites,
 * reactions-assiettes, industrie-complexite, sources/recherche-donnees-simulateur.md.
 * Hypothèses H1 à H40 : voir methode.md. Des ordres de grandeur, jamais des prédictions. ⚠️ = non confirmé.
 */
(function (root) {
  'use strict';

  // ======================================================================
  // 1. Données (Md€ 2024 sauf mention)
  // ======================================================================
  var D = {
    adultes: 55.226e6, enfants: 13.855e6, salaries: 27.0211e6, retraites: 16.5e6, pib: 2935,
    deficitActuel: -169.1,                 // 2024, Insee (recherche-donnees-simulateur.md §1)
    salairesCout: 1466.5,                  // salaires bruts 1 137,2 + cotisations employeurs 329,3
    capitalCourant: 402.5,                 // mixte 121,9 + loyers 40,9 + intérêts 71,7 + dividendes 74,9 + AV 67,5 + PV 25,6
    transmissions: 300,                    // CAE 2021 (vers 2020)
    dmtgActuel: 20.8,                      // droits de mutation à titre gratuit (successions + donations) 2024, Insee tableaux 3.216-3.217 (V2860) ; variante `droitsActuelsTransmissions` (H178)
    prelevementsSupprimes: 885.9,
    depensesRemplacees: 117.6,             // logement 16,0 + RSA 12,4 + PA 10,7 + PF 35,2 + chômage 37,1 + ASS 1,7 + ASPA 4,6
    cir: 8.0,                              // 2026, Sénat PLF 2026
    massePensions: 392.5,                  // Md€ 2025, résidents (T13 : économie 185,5 + compléments 207)
    // T13 : économie sur les pensions (Md€/an) selon le socle, règle « pension − socle » sur le brut
    ecoRetraites: [[0, 0], [100, 20.2], [200, 40], [300, 59.4], [400, 78.5], [500, 97.2], [600, 115.6], [700, 133.7],
      [800, 151.4], [900, 168.8], [1000, 185.5], [1100, 201.6], [1200, 216.8], [1300, 231.4], [1400, 245.1],
      [1500, 258.1], [1600, 270.3], [1700, 281.6], [1800, 292], [1900, 301.6], [2000, 310.4]],
    // T4 (offre-de-travail) : salaire net EQTP au milieu de chaque décile, coût employeur selon le brut, etc.
    ratioNetBrut: 0.78,
    netMilieuDecile: [1400, 1620, 1750, 1950, 2100, 2300, 2600, 3010, 3600, 7000],
    coutSelonBrut: [[1867.02, 1987.76], [2240.42, 2699.23], [2800.53, 3676.54], [3734.04, 5171.33], [5601.06, 8034.02]],
    coinMoyenSelonBrut: [[1867.02, 0.268], [2240.42, 0.351], [2566.3, 0.412], [3830.3, 0.472], [6397.0, 0.541]],
    tmefActuel: [0.55, 0.55, 0.60, 0.63, 0.60, 0.60, 0.51, 0.55, 0.59, 0.63],
    tepeActuel: [0.40, 0.40, 0.40, 0.40, 0.40, 0.44, 0.44, 0.47, 0.50, 0.54],
    primeActiviteMd: 10.65, partPrimeActivite: [0.5, 0.3, 0.2, 0, 0, 0, 0, 0, 0, 0],
    profilParticipation: [0.4, 0.4, 0.3, 0.3, 0.2, 0.2, 0.1, 0.1, 0, 0],
    // décile 10 (T47, H12) : bornes de quantile des 5 sous-bandes, tête de Pareto du travail et du capital
    d10Bornes: [0, 0.5, 0.8, 0.9, 0.99, 1], paretoTravail: 2.5, paretoCapital: 1.5,
    // capital courant : part par décile (DINA Insee 2023 : revenus mixtes + financiers par décile de niveau de vie)
    capitalMixteFin: [300 + 400, 700 + 500, 900 + 600, 1100 + 800, 1100 + 900, 1300 + 1200, 1600 + 1600, 2500 + 2200, 3600 + 3700, 15700 + 16600],
    // capital des retraités : poids par décile de pension (H20, ⚠️ hypothèse non sourcée ; part des retraités 25 %). Reste le jeu du modèle de base (résultats.md § 1 à 11, 14 à 16).
    // Jeu recalé le 01/11/2026 sur la reconstruction pension × patrimoine (H134, central ; `sources/recherche-pensions-patrimoine.md` § 1 et 6) : part 20 %, clé ci-dessous.
    // Il est le défaut de la voie R2 et du palier 1 (retraites2.js) ; dans le modèle de base : option `jeuCapitalRetraites: 'recherche'`.
    capitalRetraitesDecile: [0.01, 0.02, 0.03, 0.04, 0.06, 0.08, 0.10, 0.14, 0.20, 0.32],
    capitalRetraitesDecileRecherche: [0.03, 0.05, 0.06, 0.06, 0.07, 0.09, 0.10, 0.12, 0.16, 0.26],
    partCapitalRetraites: 0.25, partCapitalRetraitesRecherche: 0.20,
    pensionMediane: 1750, pensionSigma: 0.50,   // EIR/COR : médiane ≈ 1 750 €, q90 ≈ 3 320 € → σ = ln(3320/1750)/1,2816
    // taux de prélèvement actuel sur les pensions brutes (CSG + IR), lu sur les cas types T14
    tauxPensionActuel: [[0, 0], [1200, 0], [2500, 0.119], [4000, 0.22], [8000, 0.35]],
    smicCoutHoraire: 1987.76 / (35 * 52 / 12), smicNetHoraire: 9.74,
    tauxMargActuelHaut: 0.63,              // TMEF du décile 10 (T4, H5) ; ≈ 61 % au sommet (T5)
    pfu: 0.30,                             // taux du PFU (T5, H9)
    // --- extension « trois voies, IS conservé » (H36 à H50) ---
    isMd: 68.0, isTaux: 0.25,              // IS 2024 comptabilité nationale (Insee, recherche-donnees-simulateur.md) ; taux normal 25 % depuis 2022
    aspa: { n: 0.75e6, plafond: 1043.59, pensionMoy: 1043.59 - 4.6e9 / 0.75e6 / 12 },   // DREES (H34) ; dépense 4,6 Md€
    aah: { n: 1.40e6, md: 13.84, moyen: 13.84e9 / 1.40e6 / 12 },                      // DREES 2024 (recherche-donnees-simulateur.md §3.2)
    rsa: { n: 1.84e6, niveau: 877 },       // H45 : 1,84 M de foyers au RSA fin 2025 (Drees, V11770 ✅, appliqué le 04/11/2026, V12402 ; ancien 1,9 M de mémoire) ; 877 € = RSA + aide au logement, personne seule (T14)
    minimaMd: 12.4 + 10.65 + 1.7 + 8.0,    // RSA + prime d'activité + ASS + moitié des aides au logement ⚠️ (voie B, année 1)
    // --- voie R (retraités sanctuarisés, H84 à H93) ---
    aspaMd: 4.6,                           // dépense d'ASPA comprise dans depensesRemplacees : conservée dans la voie R (minimum vieillesse inchangé)
    chomage: { md: 37.1, n: 2.62e6 },      // Unédic 2025 (recherche-donnees-simulateur.md § 3.3) : allocation moyenne = md / n / 12 = 1 180 €/mois
    noyauHorsRetraitesMd: 184              // DREES, comptes de la protection sociale 2024, classement de l'auteur (sources/calculs/cout_reel_socle.py) ⚠️ non revérifié ici
  };
  D.inactifs = D.adultes - D.salaries - D.retraites;

  // Scénarios : bas / central / haut = intensité des réactions (pas un jugement favorable ou non)
  var SC = {
    bas:     { eti: 0.12, eps: 0.05, facPart: 0.5, mpe: -0.05, eDiv: 0.5, mobil: 0.05, couverture: 0.9, fuiteTransm: 0.18, recup: 0.5,
               hsRequal: 0.2, semiIS: 0.004, capRequal: 0.05, emploiSeniors: 0.05, priseRetraite60: 0.6, holdPart: 0.15, dureeChomage: 0.5 },
    central: { eti: 0.25, eps: 0.10, facPart: 1.0, mpe: -0.15, eDiv: 1.0, mobil: 0.15, couverture: 0.7, fuiteTransm: 0.31, recup: 0.3,
               hsRequal: 0.5, semiIS: 0.008, capRequal: 0.10, emploiSeniors: 0.15, priseRetraite60: 0.75, holdPart: 0.25, dureeChomage: 1.0 },
    haut:    { eti: 0.40, eps: 0.30, facPart: 1.5, mpe: -0.30, eDiv: 2.0, mobil: 0.40, couverture: 0.5, fuiteTransm: 0.48, recup: 0.1,
               hsRequal: 1.0, semiIS: 0.012, capRequal: 0.20, emploiSeniors: 0.30, priseRetraite60: 0.9, holdPart: 0.35, dureeChomage: 1.5 }
  };
  var PARTEXT = 0.4, MU_EXIL = 0.8, PART_EXTENSIVE = 0.4;

  var DEFAUT = {
    socle: 1000, enfant: 200,
    prime: 'aucune', primeMontant: 200, primeSeuilH: 15,
    archi: 'plat',            // 'plat' (prélèvement unique) | 'c1' (impôt continu seul) | 'c2' (taux plat réduit + continu en surtaxe)
    tPlat: 0.5, tMax: 0.45, R0: 24000,
    tTransmissions: 0.5,
    holdings: false,
    cir: false, enveloppeRD: 4.0,
    retraites: 'integre', sousIndexation: 0, anneesIndexation: 10,
    imposerComplements: false,
    transition: false,
    retraite60: false, exoSeniors: 1, surcote: 0,
    hsExo: 0,
    isConserve: false, tIS: 0.25, cirDirect: false,
    socleMode: 'uniforme', R1: 2500, patrimoine: false, patrimoineSeuil: 500000, patrimoineEchelle: 500000, rendementPatrimoine: 0.03, partInactifsSocle: 1,
    complAspa: false, aahDifferentielle: false, complRsa: false, surcoteSeule: 0,
    // audit contradictoire (01/11/2026, methode.md H71 à H73) : correctifs désactivés par défaut pour que les résultats antérieurs restent reproductibles
    sousIndexationNette: false,   // la sous-indexation réduit aussi l'assiette imposée des compléments (sinon : double compte avec l'impôt sur les pensions)
    retraitesReactions: false,    // le capital des retraités réagit au taux net comme celui des actifs (sinon : aucune rétroaction sur 100 Md€ de capital)
    couvertureHoldings: 'tout',   // 'tout' : la transparence neutralise la réaction du capital de toutes les bandes ; 'sommet' : seulement le dixième supérieur (où se trouvent les holdings)
    
    // voie R (H84 à H93) : retraités sanctuarisés. Pensions, minimum vieillesse et impôt des retraités inchangés ; socle versé aux seuls adultes non retraités
    retraitesSanctuarises: false,
    autresRemplacees: 0,          // Md€/an de prestations en espèces supplémentaires remplacées par le socle (périmètre large, voir resultats.md § 11)
    chomage: 'remplace',          // voie R : 'remplace' (socle seul) | 'differentiel' (assurance chômage maintenue à hauteur de max(0, allocation − socle)) | 'cumul' (allocation en plus du socle)
    retroactionChomage: false,    // H204 à H220 : rétroaction de la durée du chômage dans le solde (voie R) ; false (défaut : aucun résultat existant ne change) | 'scenario' (suit P.scenario) | 'bas' | 'central' | 'haut' | objet { epsD, epsE, lambda, eviction, rPlancher }
    scenario: 'central', reactions: true, dispersion: 0.25,
    // paramètres de volume (⚠️ hypothèses, voir méthode.md)
    // H23 rendu cohérent le 04/11/2026 (V11772, V12403) : 29,4 M de personnes en emploi (Insee, enquête Emploi 2025) = 27,9 M à 15 h ou plus + 1,5 M de salariés sous 15 h (ancien : 29,0 + 1,5 = 30,5 M > 29,4 M). La ventilation exacte par durée n'est pas lue : ⚠️ partiel.
    actifs15h: 27.9e6, salariesMoins15h: 1.5e6, heuresMoyMoins15h: 8,
    cohorteRetraite: 0.8e6, anneesAvance: 4, facteurComplementPrecoce: 0.75,
    empSeniors: 4.35e6 * 0.38 + 3.9e6 * 0.07, partCapitalSeniors: 0.25,   // H7 ; 0.20 avec jeuCapitalRetraites: 'recherche' (H134)
    jeuCapitalRetraites: 'ancien',
    partHS: 0.015,
    stockHoldingsMd: 1507.4, partHoldingsPatri: 0.25, rendementRetenu: 0.03, partAuDessusSeuil: 0.8
  };

  function param(p) {
    var r = {}, k; for (k in DEFAUT) r[k] = DEFAUT[k]; if (p) for (k in p) r[k] = p[k];
    if (r.jeuCapitalRetraites === 'recherche' && !(p && p.partCapitalSeniors !== undefined)) r.partCapitalSeniors = D.partCapitalRetraitesRecherche;   // jeu recalé : 20 % (H134)
    return r;
  }
  /** Clé du capital des retraités par décile de pension : jeu de base (H20) ou jeu recalé (H134, `jeuCapitalRetraites: 'recherche'`). */
  function cleRetraites(P) { return P.jeuCapitalRetraites === 'recherche' ? D.capitalRetraitesDecileRecherche : D.capitalRetraitesDecile; }
  function sc(P) { return SC[P.scenario] || SC.central; }

  // ======================================================================
  // 2. Outils
  // ======================================================================
  function interp(pts, x, ratio) {
    var n = pts.length, i;
    if (x <= pts[0][0]) return ratio ? pts[0][1] * x / pts[0][0] : pts[0][1];
    if (x >= pts[n - 1][0]) return ratio ? pts[n - 1][1] * x / pts[n - 1][0] : pts[n - 1][1];
    for (i = 1; i < n; i++) if (x <= pts[i][0]) {
      var a = pts[i - 1], b = pts[i];
      return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    }
    return pts[n - 1][1];
  }
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };

  /** Impôt continu : I(R) = tmax × [(R − R0) − R0 ln(R/R0)] pour R > R0, 0 sinon. */
  function impotContinu(R, tmax, R0) {
    if (R <= R0) return 0;
    return tmax * ((R - R0) - R0 * Math.log(R / R0));
  }
  /** Taux marginal de l'impôt continu : tmax × (1 − R0/R). */
  function margContinu(R, tmax, R0) { return R <= R0 ? 0 : tmax * (1 - R0 / R); }

  /** Impôt total (hors transmissions) sur un revenu annuel R selon l'architecture. */
  function impot(R, P) {
    if (P.archi === 'plat') return P.tPlat * R;
    if (P.archi === 'c1') return impotContinu(R, P.tMax, P.R0);
    return P.tPlat * R + impotContinu(R, P.tMax, P.R0);
  }
  function marginal(R, P) {
    if (P.archi === 'plat') return P.tPlat;
    if (P.archi === 'c1') return margContinu(R, P.tMax, P.R0);
    return P.tPlat + margContinu(R, P.tMax, P.R0);
  }
  /** Taux marginal total maximal (atteint quand R → ∞). Doit rester < 1 (contrainte H15). */
  function margMax(P) { return P.archi === 'plat' ? P.tPlat : P.archi === 'c1' ? P.tMax : P.tPlat + P.tMax; }

  /** Espérance de l'impôt sur un revenu R dispersé log-normalement (σ) autour de sa moyenne. */
  function impotMoyen(R, sigma, P) {
    if (!(sigma > 0)) return impot(R, P);
    var s = 0;
    for (var i = 0; i < 5; i++) s += GH.w[i] * impot(R * Math.exp(sigma * GH.z[i] - sigma * sigma / 2), P);
    return s;
  }

  /** Socle (€/mois) d'un adulte de revenu annuel rAn (travail + capital + pension), capital annuel K. Modes : uniforme, lineaire (D2), exp (D3) ; patrimoine = D4. */
  function socleFn(rAn, K, P) {
    var S = P.socle;
    if (!P.socleMode || P.socleMode === 'uniforme') return S;
    var r = Math.max(0, rAn) / 12, f = 1;
    if (P.socleMode === 'lineaire') f = Math.max(0, 1 - r / P.R1);
    else if (P.socleMode === 'exp') f = Math.exp(-r / P.R1);
    if (P.patrimoine) f *= Math.max(0, 1 - Math.max(0, K / P.rendementPatrimoine - P.patrimoineSeuil) / P.patrimoineEchelle);
    return S * f;
  }
  /** Pente de sortie du socle : −dS/dR (annuel sur annuel), différence avant de 100 €. */
  function penteSocle(rAn, K, P) {
    if (!P.socleMode || P.socleMode === 'uniforme') return 0;
    var h = 100;
    return 12 * (socleFn(rAn, K, P) - socleFn(rAn + h, K, P)) / h;
  }
  /** Prime d'activité nouvelle (€/mois) pour h heures par semaine. */
  function primeMois(h, P) {
    if (P.prime === 'aucune' || h <= 0) return 0;
    if (P.prime === 'forfait') return h >= P.primeSeuilH ? P.primeMontant : 0;
    return Math.min(P.primeMontant, P.primeMontant / P.primeSeuilH * h);   // progressive
  }
  /** Coût annuel (Md€) de la prime. */
  function coutPrime(P) {
    if (P.prime === 'aucune') return 0;
    var c = P.actifs15h * P.primeMontant * 12 / 1e9;
    if (P.prime === 'progressive') c += P.salariesMoins15h * primeMois(P.heuresMoyMoins15h, P) * 12 / 1e9;
    return c;
  }

  function economieRetraites(S, P) {
    if (P.retraites === 'cumul') return 0;
    var eco = interp(D.ecoRetraites, S);
    if (S > 2000) eco = interp(D.ecoRetraites, 2000);
    return eco;
  }
  /** Masse des compléments restant à payer (Md€/an). */
  function masseComplements(S, P) { return D.massePensions - economieRetraites(S, P); }
  /** Gain de la sous-indexation (points par an sous les prix) après n années, Md€/an. */
  function gainIndexation(S, P) {
    if (!(P.sousIndexation > 0)) return 0;
    return masseComplements(S, P) * (1 - Math.pow(1 - P.sousIndexation, P.anneesIndexation));
  }

  // ======================================================================
  // 3. Bandes de population active (D1–D9 + 5 sous-bandes du D10)
  // ======================================================================
  function coutAnnuel(brutMensuel) { return interp(D.coutSelonBrut, brutMensuel, true) * 12; }

  function bandes() {
    var n = 10, E = D.salaries / n, i, W = [], somme = 0;
    for (i = 0; i < n; i++) { W[i] = coutAnnuel(D.netMilieuDecile[i] / D.ratioNetBrut); somme += W[i] * E; }
    var k = D.salairesCout * 1e9 / somme;
    var sCap = D.capitalMixteFin.reduce(function (s, x) { return s + x; }, 0);
    var out = [], j;
    for (i = 0; i < 9; i++) {
      out.push({ id: 'D' + (i + 1), dec: i, n: E, L: W[i] * k, K: 0,
                 capShare: D.capitalMixteFin[i] / sCap, tmOld: D.tmefActuel[i], tepeOld: D.tepeActuel[i], top: false });
    }
    var gL = 1 - 1 / D.paretoTravail, gK = 1 - 1 / D.paretoCapital, B = D.d10Bornes;
    var noms = ['D10a', 'D10b', 'D10c', 'D10d (1 %)', 'D10e (0,1 %)'];
    var L10 = W[9] * k * E, cs10 = D.capitalMixteFin[9] / sCap;
    for (j = 0; j < 5; j++) {
      var a = B[j], b = B[j + 1], f = b - a;
      var mL = Math.pow(1 - a, gL) - Math.pow(1 - b, gL), mK = Math.pow(1 - a, gK) - Math.pow(1 - b, gK);
      out.push({ id: noms[j], dec: 9, n: E * f, L: L10 * mL / (E * f), K: 0, capShare: cs10 * mK, capShareTotal: true,
                 tmOld: D.tmefActuel[9], tepeOld: D.tepeActuel[9], top: true, rang: j });
    }
    return { bandes: out, k: k };
  }

  /** Remplit K (capital par personne) : part `partActifs` du capital courant va aux actifs. */
  function bandesCapital(P) {
    var b = bandes(), partActifs = 1 - P.partCapitalSeniors, tot = D.capitalCourant * 1e9 * partActifs;
    b.bandes.forEach(function (x) {
      if (x.capShareTotal) x.K = tot * x.capShare / x.n; else x.K = tot * x.capShare / x.n;
    });
    return b;
  }

  // ======================================================================
  // 4. Retraités (10 déciles de pension, log-normale)
  // ======================================================================
  function phiInv(p) { // Acklam, précision ~1e-9
    var a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    var b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    var c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    var d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    var q, r;
    if (p < 0.02425) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - 0.02425) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  function phi(x) { // cdf normale (Abramowitz-Stegun 7.1.26)
    var t = 1 / (1 + 0.2316419 * Math.abs(x)), d = 0.3989423 * Math.exp(-x * x / 2);
    var p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  }
  /** Pension brute moyenne (€/mois) du décile d (0..9) : moyenne tronquée de la log-normale. */
  function pensionDecile(d) {
    var mu = Math.log(D.pensionMediane), s = D.pensionSigma, a = d / 10, b = (d + 1) / 10;
    var za = a === 0 ? -Infinity : phiInv(a), zb = b === 1 ? Infinity : phiInv(b);
    var pa = a === 0 ? 0 : phi(za - s), pb = b === 1 ? 1 : phi(zb - s);
    return Math.exp(mu + s * s / 2) * (pb - pa) / (b - a) * 1;
  }
  function tauxPensionActuel(p) { return interp(D.tauxPensionActuel, p); }

  /**
   * Contribution des retraités par décile de pension, avant / après (Md€/an).
   * Avant : (CSG + IR) lu sur les cas types + PFU sur le capital. Après : impôt sur R = 12 × complément + capital,
   * si imposerComplements ; sinon seulement l'impôt sur le capital.
   */
  function retraites(P) {
    P = param(P);
    var S = P.socle, N = D.retraites / 10, Kr = D.capitalCourant * 1e9 * P.partCapitalSeniors, out = [];
    var tot = { avant: 0, apres: 0, avantTop: 0, apresTop: 0 };
    for (var d = 0; d < 10; d++) {
      var p = pensionDecile(d), K = Kr * cleRetraites(P)[d] / N;
      var Sd = socleFn(12 * p + K, K, P), K0 = K;
      var compl = P.retraites === 'cumul' ? p : Math.max(p - Sd, 0);
      if (P.sousIndexationNette && P.sousIndexation > 0 && P.retraites !== 'cumul') compl *= Math.pow(1 - P.sousIndexation, P.anneesIndexation);   // complément après sous-indexation (régime de croisière)
      var R = (P.imposerComplements ? 12 * compl : 0) + K;
      if (P.reactions && P.retraitesReactions) {   // le capital des retraités réagit comme celui des actifs (même règle que recettesCourants)
        var sr = sc(P), tm0 = marginal(R, P) + penteSocle(R, K, P);
        var rk = Math.pow((1 - Math.min(0.99, tm0)) / (1 - D.pfu), sr.eDiv), Kn = K * Math.max(0.2, Math.min(1.5, rk));
        if (P.holdings && Kn < K && P.couvertureHoldings !== 'sommet') Kn = K - (K - Kn) * (1 - sr.couverture);
        if (Kn < K) Kn = K - (K - Kn) * (1 - sr.recup);
        K = Kn; R = (P.imposerComplements ? 12 * compl : 0) + K;
      }
      var avant = (tauxPensionActuel(p) * p * 12 + D.pfu * K0);
      var apres = impotMoyen(R, 0.15, P);
      tot.avant += avant * N / 1e9; tot.apres += apres * N / 1e9;
      if (d === 9) { tot.avantTop = avant * N / 1e9; tot.apresTop = apres * N / 1e9; }
      out.push({ decile: d + 1, pensionBrute: p, capital: K, R: R, avantAn: avant, apresAn: apres });
    }
    return { deciles: out, avantMd: tot.avant, apresMd: tot.apres, topAvantMd: tot.avantTop, topApresMd: tot.apresTop };
  }

  // ======================================================================
  // 5. Cœur : recettes sur les revenus courants avec rétroactions
  // ======================================================================
  function imputationHoldings(P) {
    var s = SC[P.scenario] || SC.central;
    var flux = P.stockHoldingsMd * s.holdPart * P.rendementRetenu;           // Md€/an de bénéfices retenus
    return flux * P.partAuDessusSeuil;
  }

  function recettesCourants(P) {
    var s = sc(P), B = bandCap(P), out = { parBande: [], total: 0, travail: 0, avecReaction: !!P.reactions };
    var F = P.holdings ? imputationHoldings(P) * 1e9 : 0;
    var nTop = B.bandes[B.bandes.length - 1].n;
    var gainsTot = 0;
    B.bandes.forEach(function (b, idx) {
      var L = b.L, K = b.K + ((P.holdings && idx === B.bandes.length - 1) ? F / nTop : 0);
      var n = b.n, retenue = 1;
      var R0 = L + K, tm0 = marginal(R0, P) + penteSocle(R0, K, P);
      if (P.reactions) {
        if (!b.top) {
          // offre de travail (T4) : substitution, participation, effet revenu
          var tmNew = Math.min(0.99, tm0), E = n;
          var dSub = L * s.eps * Math.log((1 - tmNew) / (1 - b.tmOld));
          var primeAn = 12 * primeMois(35, P);
          var sGain = 12 * (socleFn(R0, K, P) - socleFn(0, 0, P));
          var tepeNew = 1 - (R0 - impot(R0, P) + primeAn + sGain) / R0;              // retour à l'emploi : socle versé dans les deux états
          var eta = D.profilParticipation[b.dec] * s.facPart;
          var dPart = L * eta * Math.log((1 - tepeNew) / (1 - b.tepeOld));
          var coin = interp(D.coinMoyenSelonBrut, D.netMilieuDecile[b.dec] / D.ratioNetBrut);
          var paOld = D.primeActiviteMd * 1e9 * D.partPrimeActivite[b.dec] / E;
          var gain = 12 * socleFn(R0, K, P) + (L - impot(L, P)) + primeAn - (L * (1 - coin) + paOld);
          var dRev = s.mpe * gain;
          L = L * (1 + (dSub + dPart + dRev) / L);
        } else {
          var f = Math.pow((1 - Math.min(0.99, tm0)) / (1 - D.tmefActuel[9]), s.eti);
          L = L * f;
          if (b.rang >= 3) { // exil des très hauts revenus (T5, H13 et H17)
            var r = (1 - Math.min(0.99, tm0)) / (1 - D.tmefActuel[9]);
            if (r < 1) retenue = 1 - MU_EXIL * (1 - Math.pow(r, s.mobil));
          }
        }
        var rk = Math.pow((1 - Math.min(0.99, tm0)) / (1 - D.pfu), s.eDiv);
        var Kn = K * Math.max(0.2, Math.min(1.5, rk));
        if (P.holdings && Kn < K && (P.couvertureHoldings !== 'sommet' || b.top)) Kn = K - (K - Kn) * (1 - s.couverture);
        if (Kn < K) Kn = K - (K - Kn) * (1 - s.recup);   // part des bénéfices retenus qui revient plus tard (T5, H10)
        K = Kn;
      }
      var R = L + K;
      var t = impotMoyen(R, b.top ? 0.15 : P.dispersion, P);
      var rec = n * retenue * t / 1e9;
      out.parBande.push({ id: b.id, n: n * retenue, L: L, K: K, R: R, impotAn: t, tauxMoyen: R > 0 ? t / R : 0, tauxMarginal: marginal(R, P), tauxMarginalEff: marginal(R, P) + penteSocle(R, K, P), pente: penteSocle(R, K, P), recetteMd: rec });
      out.total += rec; out.travail += n * retenue * L / 1e9;
    });
    return out;
  }
  function bandCap(P) { return bandesCapital(P); }

  /**
   * Recettes sur les transmissions, après fuite (T5). Hypothèse H3/H178 ⚠️ : par défaut, impôt de 50 % (`tTransmissions`) sur TOUT le flux de 300 Md€ de successions et de donations (CAE 2021),
   * sans abattement ni exonération, après une fuite de 18 / 31 / 48 % (H17) : 103,5 Md€ au central, contre 20,8 Md€ de DMTG en 2024. Variante `droitsActuelsTransmissions: true` : les DMTG actuels
   * (20,8 Md€, déjà nets de toute optimisation) sont conservés tels quels.
   */
  function recettesTransmissions(P) {
    if (P.droitsActuelsTransmissions) return D.dmtgActuel;
    var s = sc(P), fuite = P.reactions ? s.fuiteTransm * Math.min(1.5, P.tTransmissions / 0.5) : 0;
    return D.transmissions * (1 - fuite) * P.tTransmissions;
  }

  // ----------------------------------------------------------------------
  // Postes de coût
  // ----------------------------------------------------------------------
  function coutRetraite60(P) {
    if (!P.retraite60) return { pensions: 0, impotPerdu: 0, exoneration: 0, niche: 0, total: 0 };
    var s = sc(P), S = P.socle;
    var complMoyen = masseComplements(S, P) * 1e9 / 12 / 17.4e6;                // €/mois
    var nExtra = P.cohorteRetraite * P.anneesAvance * s.priseRetraite60;
    var pensions = nExtra * complMoyen * P.facteurComplementPrecoce * 12 / 1e9;
    var tBar = taxeMoyenneActifs(P);
    var impotPerdu = nExtra * 0.5 * tBar / 1e9;                                  // la moitié aurait travaillé jusqu'à 64 ans
    var exo = P.exoSeniors * P.empSeniors * (1 + s.emploiSeniors) * tBar / 1e9;   // impôt non perçu sur les revenus d'activité 60-70 ans
    var capSen = D.capitalCourant * P.partCapitalSeniors;
    var niche = P.exoSeniors > 0 ? s.capRequal * capSen * tauxMargCapital(P) * P.exoSeniors : 0;
    return { pensions: pensions, impotPerdu: impotPerdu, exoneration: exo, niche: niche, total: pensions + impotPerdu + exo + niche, nExtra: nExtra };
  }
  /** Surcote : bonus sur le complément pour qui prolonge (variante moins coûteuse que l'exonération). */
  function coutSurcoteSeule(P) {
    var s = sc(P), complMoyen = masseComplements(P.socle, P) * 1e9 / 12 / 17.4e6;
    return P.empSeniors * (1 + s.emploiSeniors) * complMoyen * 12 * P.surcoteSeule * 5 / 1e9;
  }
  function coutSurcote(P) {
    if (!P.retraite60 || !(P.surcote > 0)) return 0;
    var s = sc(P), complMoyen = masseComplements(P.socle, P) * 1e9 / 12 / 17.4e6;
    return P.empSeniors * (1 + s.emploiSeniors) * complMoyen * 12 * P.surcote * 5 / 1e9;   // 5 ans de prolongation en moyenne
  }
  function taxeMoyenneActifs(P) {
    var R = recettesCourants(P).parBande, s = 0, n = 0;
    for (var i = 3; i <= 6; i++) { s += R[i].impotAn; n++; }
    return s / n;
  }
  function tauxMargCapital(P) {
    var R = recettesCourants(P).parBande, B = bandCap(P).bandes, num = 0, den = 0;
    R.forEach(function (r, i) { num += r.K * r.n * r.tauxMarginal; den += r.K * r.n; });
    return num / den;
  }
  function coutHS(P) {
    if (!(P.hsExo > 0)) return { cout: 0, niche: 0 };
    var s = sc(P), R = recettesCourants(P).parBande, num = 0, den = 0;
    for (var i = 1; i <= 7; i++) { num += R[i].tauxMarginal * R[i].L * R[i].n; den += R[i].L * R[i].n; }
    var tm = num / den, hs = P.partHS * D.salairesCout;
    return { cout: P.hsExo * hs * tm, niche: P.hsExo * hs * s.hsRequal * tm, tauxMarginal: tm, masseHS: hs };
  }
  function coutTransition(P) {
    if (!P.transition) return { annualise: 0, ponctuel: 0, recettes: 0 };
    var tab = { bas: [4.3, 2000], central: [6.5, 147000], haut: [7.2, 400000] }[P.scenario] || [6.5, 147000];
    var recettes = tab[1] * 25000 * sc(P).dureeChomage / 1e9;                    // ≈ 25 k€ de recettes par personne-année (T6)
    return { ponctuel: tab[0], recettes: recettes, annualise: (tab[0] + recettes) / 10 };
  }

  // ----------------------------------------------------------------------
  // Extension : IS conservé, socle dégressif, compléments ciblés
  // ----------------------------------------------------------------------
  /** Recette de l'IS (Md€/an) au taux tIS : base = 68,0 / 25 %, perte par déplacement des bénéfices = semi-élasticité × écart de taux (points). */
  function recetteIS(P) {
    if (!P.isConserve) return 0;
    var s = sc(P), base = D.isMd / D.isTaux, dt = P.tIS - D.isTaux;
    var pert = P.reactions ? Math.max(-0.5, Math.min(0.9, s.semiIS * 100 * dt)) : 0;
    return base * P.tIS * (1 - pert);
  }
  /** Crédit d'IS accordé aux associés sur les bénéfices imputés (transparence en complément de l'IS). */
  function creditHoldings(P) { return (P.holdings && P.isConserve) ? imputationHoldings(P) * P.tIS : 0; }

  /** Coût brut du socle dégressif (Md€/an) et économie sur les pensions, à partir des bandes (après réactions). */
  function socleDegressif(P, rc) {
    var cout = 0, eco = 0, i, g, Nr = D.retraites / 10, Kr = D.capitalCourant * 1e9 * P.partCapitalSeniors;
    rc.parBande.forEach(function (b) {
      for (g = 0; g < 5; g++) {
        var m = Math.exp(P.dispersion * GH.z[g] - P.dispersion * P.dispersion / 2);
        cout += b.n * GH.w[g] * 12 * socleFn(b.R * m, b.K * m, P);
      }
    });
    for (i = 0; i < 10; i++) {
      var p = pensionDecile(i), K = Kr * cleRetraites(P)[i] / Nr, Sd = socleFn(12 * p + K, K, P);
      cout += Nr * 12 * Sd; eco += Nr * 12 * Math.min(p, Sd);
    }
    cout += D.inactifs * P.partInactifsSocle * 12 * socleFn(0, 0, P);
    return { cout: cout / 1e9, eco: eco / 1e9 };
  }

  /** Compléments ciblés (Md€/an) : plancher ASPA, AAH différentielle (remplacée par socle + complément), maintien RSA + aide au logement. */
  function complements(P) {
    var S = P.socle, o = { aspa: 0, aahBrut: 0, aahEconomie: 0, rsa: 0, total: 0 };
    if (P.complAspa) o.aspa = D.aspa.n * Math.max(0, D.aspa.plafond - Math.max(S, D.aspa.pensionMoy)) * 12 / 1e9;
    if (P.aahDifferentielle) { o.aahBrut = D.aah.n * Math.max(0, D.aah.moyen - S) * 12 / 1e9; o.aahEconomie = D.aah.md; }
    if (P.complRsa) o.rsa = D.rsa.n * Math.max(0, D.rsa.niveau - S) * 12 / 1e9;
    o.total = o.aspa + o.aahBrut - o.aahEconomie + o.rsa;
    return o;
  }

  /**
   * Chômage, voie R. Variantes dégressives (précision de l'auteur, 31/10) : à la perte d'emploi, socle + complément = part de la perte de revenu net
   * (revenu net antérieur, plafonné ou non, moins le socle), décroissante avec les mois de chômage. paliers : [mois de fin, part].
   * Durées : sortie à taux constant, durée moyenne d'indemnisation τ = 10 mois ⚠️ hypothèse (le stock se répartit selon e^(−mois/τ), tronqué à 24 mois) ; revenu net antérieur
   * moyen = allocation moyenne / 0,72 ⚠️ (ARE ≈ 57 % du brut ≈ 72 % du net). Ordres de grandeur.
   */
  var CHOMAGE_DEG = {
    deg1: { nom: '60 % de la perte les mois 1-3, 40 % les mois 4-6, 20 % les mois 7-12, puis 0', paliers: [[3, 0.6], [6, 0.4], [12, 0.2]], plafondNet: Infinity },
    deg2: { nom: 'deg1 plafonné : perte calculée sur 3 000 € net par mois au plus', paliers: [[3, 0.6], [6, 0.4], [12, 0.2]], plafondNet: 3000 },
    deg3: { nom: 'plus généreuse : 70 % (1-3), 50 % (4-6), 30 % (7-12), 15 % (13-18), plafond 3 000 € net', paliers: [[3, 0.7], [6, 0.5], [12, 0.3], [18, 0.15]], plafondNet: 3000 }
  };
  var CHOMAGE_TAU = 10, CHOMAGE_TAUX_NET = 0.72, CHOMAGE_MAX_MOIS = 24;
  /** Part du stock d'indemnisés dans [a, b[ mois d'ancienneté. */
  function partStockChomage(a, b) {
    var t = CHOMAGE_TAU, z = 1 - Math.exp(-CHOMAGE_MAX_MOIS / t);
    return (Math.exp(-a / t) - Math.exp(-Math.min(b, CHOMAGE_MAX_MOIS) / t)) / z;
  }
  /** Part moyenne (pondérée par le stock) de la perte de revenu net compensée, et allocation moyenne (€/mois) rapportée à la perte. */
  function partMoyenneCompl(v) {
    var a = 0, s = 0;
    v.paliers.forEach(function (pl) { s += partStockChomage(a, pl[0]) * pl[1]; a = pl[0]; });
    return s;
  }
  /** Complément mensuel (€) à l'ancienneté m (mois, 1 = premier) pour un revenu net antérieur n et un socle S. */
  function complementChomage(v, netAvant, S, m) {
    var i, a = 0;
    for (i = 0; i < v.paliers.length; i++) { if (m <= v.paliers[i][0]) return v.paliers[i][1] * Math.max(0, Math.min(netAvant, v.plafondNet) - S); }
    return 0;
  }
  /** Allocation d'assurance chômage actuelle, équivalent net par mois (⚠️ simplifié : 72 % du net, plancher 960 €, 18 mois). */
  function areActuelle(netAvant, m) { return m > 18 ? 0 : Math.max(960, CHOMAGE_TAUX_NET * netAvant); }
  /** Voie R : coût (Md€/an) de l'assurance chômage maintenue en complément du socle (le socle seul = 0). */
  function coutChomage(P) {
    var a = D.chomage.md * 1e9 / D.chomage.n / 12;   // allocation moyenne, €/mois
    if (P.chomage === 'cumul') return D.chomage.md;
    if (P.chomage === 'differentiel') return D.chomage.n * Math.max(0, a - P.socle) * 12 / 1e9;
    var v = CHOMAGE_DEG[P.chomage];
    if (v) {   // complément moyen = part moyenne × perte de revenu nette ; revenu net antérieur moyen = a / 0,72 (plafond appliqué à ce revenu moyen : approximation ⚠️)
      var net = a / CHOMAGE_TAUX_NET, perte = Math.max(0, Math.min(net, v.plafondNet) - P.socle);
      return D.chomage.n * partMoyenneCompl(v) * perte * 12 / 1e9;
    }
    return 0;
  }

  // ---------- Rétroaction de la durée du chômage (H204 à H220 ; sources/recherche-chomage-durees-elasticites.md). Option : aucun effet par défaut.
  // bas = réactions faibles, haut = réactions fortes (même convention que les scénarios du modèle : le scénario « bas » a les réactions les plus faibles).
  var RETRO_CHOMAGE = {
    bas:     { epsD: 0.15, epsE: 0,    lambda: 0.8, eviction: 0.5,  rPlancher: 0.7 },   // H206 : bas de la fourchette (IPP 0,14 ; Lalive et al. 0,15) ; H208 ; H209 ; H210
    central: { epsD: 0.30, epsE: 0.10, lambda: 0.6, eviction: 0.25, rPlancher: 0.7 },   // H205 : CAE n° 90 (2026) ; H207 : entrées 0,1 (CAE, Jessen et al.) ; H208 : Chetty (2008) 60 % ; H209 ⚠️
    haut:    { epsD: 0.70, epsE: 0.10, lambda: 0.4, eviction: 0,    rPlancher: 0.7 }    // H206 : Unédic, réforme du SJR rapportée à l'allocation journalière (0,7)
  };
  /**
   * Rétroaction de la durée du chômage (voie R) : générosité conditionnelle effective B1 = complément moyen + λ × socle (le socle est versé en emploi comme au chômage : seul son effet de liquidité allonge la durée, H208),
   * rapportée à l'allocation actuelle moyenne B0 (1 180 €/mois) ; r = max(rPlancher, B1 / B0) (H211 : pas d'extrapolation au-delà de −30 %, la plus forte baisse de niveau observée en France) ; stock d'indemnisés × r^(εD + εE) (durée et entrées, H204-H207) ;
   * stock évité net de l'éviction (H209) ; gain = complément non versé + impôt du modèle sur le salaire retrouvé (net antérieur moyen 1 640 €, H212-H213). Md€/an, + = rapporte à l'État.
   */
  function retroactionChomage(P, niveau) {
    var k = (niveau === true || niveau === 'scenario') ? (P.scenario || 'central') : niveau;
    var c = (k && typeof k === 'object') ? k : RETRO_CHOMAGE[k];
    var z = { niveau: k, actif: false, r: 1, rBrut: 1, horsDomaine: false, ratioStock: 1, stockEvite: 0, stockEviteNet: 0, economieComplementMd: 0, recettesMd: 0, recetteParEmploi: 0, netMd: 0 };
    if (!c) return z;
    var n = D.chomage.n, a = D.chomage.md * 1e9 / n / 12, cout = coutChomage(P), comp = cout * 1e9 / n / 12;
    var B1 = comp + c.lambda * P.socle, rBrut = B1 / a, rp = c.rPlancher === undefined ? 0 : c.rPlancher, r = rp > 0 ? Math.min(1 / rp, Math.max(rp, rBrut)) : rBrut;   // H211 : bornes symétriques [0,7 ; 1/0,7]
    var ratioStock = Math.pow(r, c.epsD + c.epsE), dN = n * (1 - ratioStock), dNnet = dN * (1 - c.eviction);
    var netReprise = a / CHOMAGE_TAUX_NET, coin = interp(D.coinMoyenSelonBrut, netReprise / D.ratioNetBrut), L = netReprise / (1 - coin);
    var rec = impot(12 * L, P), eco = cout * (1 - ratioStock) * (1 - c.eviction), recMd = dNnet * rec / 1e9;
    return { niveau: k, actif: true, parametres: c, allocationActuelle: a, complementMoyen: comp, generositeEffective: B1, rBrut: rBrut, r: r, horsDomaine: r !== rBrut,
      ratioStock: ratioStock, stockEvite: dN, stockEviteNet: dNnet, coutTravailReprise: L, recetteParEmploi: rec, economieComplementMd: eco, recettesMd: recMd, netMd: eco + recMd };
  }

  // ======================================================================
  // 6. Solde public
  // ======================================================================
  function solde(p) {
    var P = param(p), rc = recettesCourants(P), s = sc(P);
    var rt = recettesTransmissions(P);
    var ret = retraites(P);
    // le capital des retraités est dans `retraites` : il est dans l'assiette du simulateur dans tous les cas
    var R = !!P.retraitesSanctuarises;                       // voie R : retraités hors du système (pensions, minimum vieillesse et impôt inchangés)
    var recettesRet = R ? ret.avantMd : ret.apresMd;
    var uni = !P.socleMode || P.socleMode === 'uniforme', degr = uni ? null : socleDegressif(P, rc);
    var socle = uni ? (R ? D.adultes - D.retraites : D.adultes) * P.socle * 12 / 1e9 : degr.cout, enf = D.enfants * P.enfant * 12 / 1e9;
    var eco = R ? 0 : (uni ? economieRetraites(P.socle, P) : degr.eco);
    var idx = (!R && P.sousIndexation > 0) ? (D.massePensions - eco) * (1 - Math.pow(1 - P.sousIndexation, P.anneesIndexation)) : 0;
    var remplacees = D.depensesRemplacees - (R ? D.aspaMd : 0) + (R ? P.autresRemplacees : 0);
    var chom = R ? coutChomage(P) : 0;
    var retroC = (R && P.retroactionChomage) ? retroactionChomage(P, P.retroactionChomage) : null, retroNet = retroC ? retroC.netMd : 0;   // H204-H220 (option)
    var isRec = recetteIS(P), credit = creditHoldings(P), comp = complements(P);
    var isRetire = 0;   // les 885,9 Md€ supprimés comptent déjà l'IS (68,0) : on le remet en recettes par isRec (pas de double compte)
    var prime = coutPrime(P), rd = P.cir ? P.enveloppeRD : 0;
    var r60 = coutRetraite60(P), sur = (P.surcoteSeule > 0 ? coutSurcoteSeule(P) : coutSurcote(P)), hs = coutHS(P), tr = coutTransition(P);
    var hold = P.holdings ? imputationHoldings(P) : 0;
    var recettes = rc.total + rt + recettesRet + isRec;
    var cirEco = (P.isConserve && P.cir) ? D.cir : 0;   // IS conservé : le CIR existe encore ; son remplacement par une enveloppe directe l'économise (⚠️ H22)   // le CIR disparaît avec l'IS dans le simulateur (H29) : pas d'économie supplémentaire comptée
    var delta = recettes - (D.prelevementsSupprimes - isRetire) - credit - comp.total - (socle + enf - remplacees - eco - idx)
      - chom - prime - rd - r60.total - sur - hs.cout - hs.niche - tr.annualise + cirEco + retroNet;
    var nDispositifs = 21 - (P.isConserve ? 1 : 0) - (P.prime !== 'aucune' ? 1 : 0);
    return {
      parametres: P, delta: delta, soldePublic: D.deficitActuel + delta, margeInvestissement: Math.max(0, D.deficitActuel + delta),
      recettes: { courants: rc.total, transmissions: rt, retraites: recettesRet, is: isRec, total: recettes },
      postes: { prelevementsSupprimes: D.prelevementsSupprimes, socleAdultes: socle, enfants: enf, depensesRemplacees: remplacees, assuranceChomage: chom,
        economieRetraites: eco, gainIndexation: idx, creditHoldings: credit, complements: comp, prime: prime, enveloppeRD: rd, retraite60: r60, surcote: sur, heuresSup: hs, transition: tr, holdingsImputes: hold, retroactionChomage: retroC },
      margMax: margMax(P), nDispositifsSupprimes: nDispositifs,
      parBande: rc.parBande
    };
  }

  /** t d'équilibre : plus petit x ∈ [0, cap] tel que Δ solde ≥ 0 (Δ solde de l'architecture, hors déficit actuel). */
  function equilibre(p, quoi, cap) {
    var P = param(p); cap = cap || 0.95;
    var f = function (x) { var q = param(P); q[quoi] = x; if (quoi === 'tMax' && q.archi === 'c2') { /* tPlat fixé par l'appelant */ } return solde(q).delta; };
    var pas = 40, i, x0 = 0, f0 = f(0), best = { x: 0, v: f0 }, trouve = -1;
    if (f0 >= 0) return { existe: true, x: 0, delta: f0 };
    for (i = 1; i <= pas; i++) {
      var x = cap * i / pas, v = f(x);
      if (v > best.v) best = { x: x, v: v };
      if (v >= 0) { trouve = i; break; }
    }
    if (trouve < 0) return { existe: false, xMaxRecette: best.x, deltaMax: best.v, delta: best.v };
    var a = cap * (trouve - 1) / pas, b = cap * trouve / pas;
    for (i = 0; i < 50; i++) { var m = (a + b) / 2; if (f(m) >= 0) b = m; else a = m; }
    return { existe: true, x: b, delta: f(b) };
  }

  // ======================================================================
  // 7. Par décile et gagnants / perdants
  // ======================================================================
  function effetsParDecile(p) {
    var P = param(p), rc = recettesCourants(P).parBande, B = bandCap(P).bandes, out = [];
    B.forEach(function (b, i) {
      var coin = interp(D.coinMoyenSelonBrut, D.netMilieuDecile[b.dec] / D.ratioNetBrut);
      var paOld = D.primeActiviteMd * 1e9 * D.partPrimeActivite[b.dec] / (D.salaries / 10);
      var avantTravail = b.L * (1 - coin) + paOld + (1 - D.pfu) * b.K;           // actuel (T4 H4 ; PFU sur le capital)
      var r = rc[i];
      var gagnants = 0;
      for (var g = 0; g < 5; g++) {
        var m = Math.exp(P.dispersion * GH.z[g] - P.dispersion * P.dispersion / 2);
        var Lg = b.L * m, Kg = b.K * m;
        var av = Lg * (1 - coin) + paOld + (1 - D.pfu) * Kg;
        var ap = 12 * socleFn(Lg + Kg, Kg, P) + 12 * primeMois(35, P) + Lg + Kg - impot(Lg + Kg, P);
        if (ap > av) gagnants += GH.w[g];
      }
      var apres = 12 * socleFn(b.L + b.K, b.K, P) + 12 * primeMois(35, P) + b.L + b.K - impot(b.L + b.K, P);
      out.push({ id: b.id, avantMois: avantTravail / 12, apresMois: apres / 12, ecartMois: (apres - avantTravail) / 12,
                 partGagnants: gagnants, tauxMoyen: r.tauxMoyen, tauxMarginal: r.tauxMarginal, tauxMarginalEff: r.tauxMarginalEff });
    });
    return out;
  }

  // ======================================================================
  // 8. Cas types et « situation → avant / après » (simulateur personnel)
  // ======================================================================
  var CAS = [
    { id: 'smic15', libelle: 'Smicard à 15 h par semaine', adultes: 1, enfants: 0, age: 40, heuresSemaine: 15, coutHoraire: D.smicCoutHoraire,
      actuel: 913, actuelNote: 'net 633 € (Smic net 9,74 €/h × 65 h) + prime d\'activité ≈ 280 € (interpolée des cas T14, ⚠️)' },
    { id: 'smic35', libelle: 'Smicard à 35 h', adultes: 1, enfants: 0, age: 40, heuresSemaine: 35, coutHoraire: D.smicCoutHoraire,
      actuel: 1707.45, actuelNote: 'cas type T14 « smic » (OpenFisca 2026)' },
    { id: 'cadre60', libelle: 'Cadre à 60 k€ brut par an', adultes: 1, enfants: 0, age: 40, heuresSemaine: 35, coutHoraire: 7113 / (35 * 52 / 12),
      actuel: 3423, actuelNote: 'interpolé entre « médian » (2 115,89 €) et « cadre_2x » (3 776,62 €) du T14 ; IR ≈ 547 €/mois (⚠️)' },
    { id: 'retraiteModeste', libelle: 'Retraité modeste (pension 800 € brut)', adultes: 1, enfants: 0, age: 75, retraite: true, pensionBruteMois: 800,
      actuel: 1043.6, actuelNote: 'cas type T14 « retraite_800 » (ASPA 1 043,59 €)' },
    { id: 'retraiteAise', libelle: 'Retraité aisé (4 000 € brut + 15 000 € de capital par an)', adultes: 1, enfants: 0, age: 75, retraite: true,
      pensionBruteMois: 4000, capitalAn: 15000, actuel: 3120.67 + 15000 * 0.7 / 12, actuelNote: 'cas type T14 « retraite_4000 » + capital net de PFU 30 % (capital ⚠️ hypothèse)' },
    { id: 'dirigeantHolding', libelle: 'Dirigeant avec holding (30 000 € brut/mois + 300 000 € de bénéfices retenus par an)', adultes: 1, enfants: 0, age: 50,
      heuresSemaine: 35, coutMensuelPlein: 42334.25, bndHoldingAn: 300000, actuel: 15220.68, actuelEco: 15220.68 + 225000 / 12,
      actuelNote: 'cas type T14 « très haut salaire » ; bénéfices retenus après IS 25 % (225 k€), non versés donc hors revenu disponible' },
    { id: 'retraite62mt', libelle: 'Retraité de 62 ans qui continue à mi-temps', adultes: 1, enfants: 0, age: 62, retraite: true, retraiteActive: true,
      pensionBruteMois: 1800, heuresSemaine: 17.5, coutHoraire: D.smicCoutHoraire, actuel: 1650 + 738.96, actuelNote: 'pension nette ≈ 1 650 € + salaire net mi-temps Smic 738,96 € (T14 « temps_partiel », ⚠️ cumul emploi-retraite)' },
    { id: 'salarie39h', libelle: 'Salarié médian à 39 h (4 h supplémentaires)', adultes: 1, enfants: 0, age: 40, heuresSemaine: 39, coutHoraire: 3676.54 / (35 * 52 / 12),
      actuel: 2115.89 + 360, actuelNote: 'cas « médian » T14 + 4 h sup. exonérées de cotisations salariales et d\'IR aujourd\'hui (≈ 90 % du brut, ⚠️)' },
    { id: 'couple2enfants', libelle: 'Couple, 2 enfants, deux Smic à 35 h', adultes: 2, enfants: 2, age: 40, heuresSemaine: 35, coutHoraire: D.smicCoutHoraire, deuxEmplois: true,
      actuel: 2 * 1477.93 + 230 + 150 + 400, actuelNote: 'deux salaires nets Smic + prime d\'activité + allocations familiales + aides au logement (ordre de grandeur ⚠️)' }
  ];

  /**
   * Situation d'une personne → revenu mensuel avant / après, taux marginal, alertes.
   * s = { adultes, enfants, age, heuresSemaine, coutHoraire | coutMensuelPlein, retraite, pensionBruteMois, capitalAn,
   *       bndHoldingAn, retraiteActive, actuel (€/mois, loi actuelle), actuelEco }
   */
  function situation(s, p) {
    var P = param(p), alertes = [], i;
    var adultes = s.adultes || 1, enfants = s.enfants || 0, h = s.heuresSemaine || 0;
    var ch = s.coutHoraire || (s.coutMensuelPlein ? s.coutMensuelPlein / (35 * 52 / 12) : D.smicCoutHoraire);
    var hBase = Math.min(h, 35), hSup = Math.max(h - 35, 0);
    var nEmp = s.deuxEmplois ? 2 : 1;
    var travailBase = nEmp * ch * hBase * 52, travailHS = nEmp * ch * 1.25 * hSup * 52;
    var senior = !!(s.retraiteActive || (s.age >= 60 && s.age < 70 && s.retraite && h > 0));
    var exoH = P.retraite60 && senior ? P.exoSeniors : 0;
    var pension = s.pensionBruteMois || 0;
    var rSoc = (travailBase + travailHS + (s.capitalAn || 0) + (P.holdings ? (s.bndHoldingAn || 0) : 0) + 12 * pension) / adultes;
    var socleMois = socleFn(rSoc, ((s.capitalAn || 0) + (P.holdings ? (s.bndHoldingAn || 0) : 0)) / adultes, P) * adultes + P.enfant * enfants;
    var sIndiv = socleMois / adultes - (P.enfant * enfants) / adultes;
    var compl = pension > 0 ? (P.retraites === 'cumul' ? pension : Math.max(pension - sIndiv, 0)) : 0;
    var capital = s.capitalAn || 0, bnd = P.holdings ? (s.bndHoldingAn || 0) : 0;
    var travailImposable = (travailBase + (1 - P.hsExo) * travailHS) * (1 - exoH);
    var R = travailImposable + capital + bnd + (P.imposerComplements ? 12 * compl : 0);
    var taxe = impot(R / adultes, P) * adultes, prime = primeMois(h, P) * (s.deuxEmplois ? 2 : 1) * (P.prime === 'aucune' ? 0 : 1);
    var revenusMois = (travailBase + travailHS + capital + 12 * compl) / 12;
    var differe = 0, credit = 0, bndNet = (s.bndHoldingAn || 0);
    if (P.isConserve && s.bndHoldingAn) {
      bndNet = s.bndHoldingAn * (1 - P.tIS);                 // bénéfices retenus après IS
      if (bnd > 0) {                                         // transparence en complément : crédit d'IS, solde dû à la distribution
        credit = P.tIS * bnd;
        var taxeSans = impot((R - bnd) / adultes, P) * adultes;
        differe = Math.max(0, taxe - taxeSans - credit);
        taxe = taxe - credit - differe;                       // impôt payé dans l'année ; le reste est différé
      }
    }
    var chomeMois = 0;   // voie R : assurance chômage maintenue (variante) pour un chômeur indemnisé (s.alloChomageMois)
    if (P.retraitesSanctuarises && s.alloChomageMois > 0) chomeMois = P.chomage === 'cumul' ? s.alloChomageMois : P.chomage === 'differentiel' ? Math.max(0, s.alloChomageMois - sIndiv) * adultes : CHOMAGE_DEG[P.chomage] ? complementChomage(CHOMAGE_DEG[P.chomage], s.netAvantMois || s.alloChomageMois / CHOMAGE_TAUX_NET, sIndiv, s.moisChomage || 1) : 0;
    var apres = socleMois + prime + revenusMois - taxe / 12 + chomeMois;
    if (P.retraitesSanctuarises && s.retraite && s.actuel !== undefined) {   // voie R : les retraités ne changent pas (pension, impôt, minimum vieillesse)
      apres = s.actuel; socleMois = 0; taxe = 0; alertes.push('voie R : pensions, minimum vieillesse et impôt des retraités inchangés par décision (aucun calcul de bascule)');
    }
    var apresEco = apres + (bndNet - differe) / 12;   // revenu économique : cash + bénéfices retenus (après IS et impôt différé)
    // taux marginal sur une heure supplémentaire (par semaine) : 1 − Δ revenu net / Δ coût employeur
    var q = JSON.parse(JSON.stringify(s)); q.heuresSemaine = h + 1;
    var apres1 = situationBrute(q, P);
    var base0 = situationBrute(s, P);
    var marg = 1 - (apres1 - base0) / (h >= 35 ? nEmp * ch * 1.25 * 52 / 12 : nEmp * ch * 52 / 12);
    if (P.prime === 'forfait' && h < P.primeSeuilH && h + 1 >= P.primeSeuilH) alertes.push('effet de seuil : +1 h fait gagner ' + P.primeMontant + ' €/mois (regroupement des contrats à ' + P.primeSeuilH + ' h, fausses heures)');
    if (P.prime === 'forfait' && h >= P.primeSeuilH && h - 1 < P.primeSeuilH) alertes.push('à ' + P.primeSeuilH + ' h : perdre une heure fait perdre ' + P.primeMontant + ' €/mois');
    if (marg >= 0.9) alertes.push('taux marginal sur l\'heure ≥ 90 %');
    if (hSup > 0 && P.hsExo > 0) alertes.push('niche : heures supplémentaires exonérées (risque de requalification du salaire en heures sup.)');
    if (exoH > 0) alertes.push('niche : revenus d\'activité exonérés de 60 à 70 ans (risque de requalification de revenus du capital en salaires)');
    if (bnd === 0 && s.bndHoldingAn) alertes.push('bénéfices retenus en holding non imposés tant qu\'ils ne sont pas distribués (⚠️ trou de l\'IS supprimé)');
    if (bnd > 0 && !P.isConserve) alertes.push('impôt dû sur des bénéfices non perçus : prévoir un paiement différé ou une distribution forcée (trésorerie)');
    if (differe > 0) alertes.push('impôt sur les bénéfices retenus (net du crédit d\'IS) différé jusqu\'à la distribution : ' + Math.round(differe) + ' €/an');
    var avant = s.actuel;
    return {
      libelle: s.libelle, avantMois: avant, apresMois: apres, ecartMois: avant === undefined ? undefined : apres - avant,
      avantEcoMois: s.actuelEco, apresEcoMois: apresEco, impotAn: taxe, impotDiffereAn: differe, creditISAn: credit, R: R, tauxMoyen: R > 0 ? taxe / R : 0,
      tauxMarginalHeure: marg, primeMois: prime, socleMois: socleMois, alertes: alertes,
      sousLeSocle: apres < socleMois - 1e-9
    };
  }
  function situationBrute(s, P) {
    var adultes = s.adultes || 1, h = s.heuresSemaine || 0, nEmp = s.deuxEmplois ? 2 : 1;
    var ch = s.coutHoraire || (s.coutMensuelPlein ? s.coutMensuelPlein / (35 * 52 / 12) : D.smicCoutHoraire);
    var tb = nEmp * ch * Math.min(h, 35) * 52, th = nEmp * ch * 1.25 * Math.max(h - 35, 0) * 52;
    var senior = !!(s.retraiteActive || (s.age >= 60 && s.age < 70 && s.retraite && h > 0));
    var exoH = P.retraite60 && senior ? P.exoSeniors : 0;
    var pension = s.pensionBruteMois || 0;
    var Kc = (s.capitalAn || 0) + (P.holdings ? (s.bndHoldingAn || 0) : 0);
    var sInd = socleFn((tb + th + Kc + 12 * pension) / adultes, Kc / adultes, P);
    var compl = pension > 0 ? (P.retraites === 'cumul' ? pension : Math.max(pension - sInd, 0)) : 0;
    var R = (tb + (1 - P.hsExo) * th) * (1 - exoH) + (s.capitalAn || 0) + (P.holdings ? (s.bndHoldingAn || 0) : 0) + (P.imposerComplements ? 12 * compl : 0);
    var Kb = (s.capitalAn || 0) + (P.holdings ? (s.bndHoldingAn || 0) : 0);
    var socleB = socleFn((tb + th + (s.capitalAn || 0) + Kb - (s.capitalAn || 0) + 12 * pension) / adultes, Kb / adultes, P) * adultes;
    return socleB + P.enfant * (s.enfants || 0) + primeMois(h, P) * nEmp * (P.prime === 'aucune' ? 0 : 1) + (tb + th + (s.capitalAn || 0) + 12 * compl) / 12 - impot(R / adultes, P) * adultes / 12;
  }

  function casTypes(p) { return CAS.map(function (c) { return situation(c, p); }); }

  // ======================================================================
  // 9. Combinaisons et marge d'investissement
  // ======================================================================
  var REF_C2 = { archi: 'c2', tPlat: 0.40, tMax: 0.50 };    // marginal total max 0,90
  var REF_C1 = { archi: 'c1', tMax: 0.90 };
  function fusion(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  var COMBINAISONS = [
    { id: 'K0', nom: 'Simulateur actuel : socle 1 000 €, prélèvement unique 50 %', p: { socle: 1000, archi: 'plat', tPlat: 0.5 } },
    { id: 'K1', nom: 'Socle 800 € + prime forfait 200 € (15 h), prélèvement unique 50 %', p: { socle: 800, prime: 'forfait', archi: 'plat', tPlat: 0.5 } },
    { id: 'K2', nom: 'K1 avec prime progressive', p: { socle: 800, prime: 'progressive', archi: 'plat', tPlat: 0.5 } },
    { id: 'K3', nom: 'Socle 800 € + prime progressive + c2 (40 % + continu 50 %) + holdings', p: fusion({ socle: 800, prime: 'progressive', holdings: true }, REF_C2) },
    { id: 'K4', nom: 'K3 + CIR remplacé par 4 Md€ + coût de transition', p: fusion({ socle: 800, prime: 'progressive', holdings: true, cir: true, transition: true }, REF_C2) },
    { id: 'K5', nom: 'K4 en c1 (impôt continu seul, t_max 90 %)', p: fusion({ socle: 800, prime: 'progressive', holdings: true, cir: true, transition: true }, REF_C1) },
    { id: 'K6', nom: 'K4 + retraite à 60 ans, activité exonérée jusqu\'à 70 ans', p: fusion({ socle: 800, prime: 'progressive', holdings: true, cir: true, transition: true, retraite60: true }, REF_C2) },
    { id: 'K7', nom: 'K4 + heures au-delà de 35 h exonérées', p: fusion({ socle: 800, prime: 'progressive', holdings: true, cir: true, transition: true, hsExo: 1 }, REF_C2) },
    { id: 'K8', nom: 'K4 + impôt sur pensions et capital des retraités (j)', p: fusion({ socle: 800, prime: 'progressive', holdings: true, cir: true, transition: true, imposerComplements: true }, REF_C2) },
    { id: 'K9', nom: 'K8 + sous-indexation d\'un point par an (retraites)', p: fusion({ socle: 800, prime: 'progressive', holdings: true, cir: true, transition: true, imposerComplements: true, sousIndexation: 0.01 }, REF_C2) }
  ];

  function tableauMarge(scenario) {
    return COMBINAISONS.map(function (c) {
      var p = fusion(c.p, { scenario: scenario || 'central' });
      var r = solde(p);
      return { id: c.id, nom: c.nom, delta: r.delta, soldePublic: r.soldePublic, marge: r.margeInvestissement, margMax: r.margMax, nDispositifs: r.nDispositifsSupprimes,
               sousLeSocle: false, parametres: p };
    });
  }

  /** Recherche exhaustive de la combinaison de marge maximale (taux de référence c2 ou c1), avec ou sans toucher à l'âge. */
  function meilleureCombinaison(toucherAge, scenario) {
    var best = null, tous = [];
    [800, 1000].forEach(function (S) {
      ['aucune', 'forfait', 'progressive'].forEach(function (pr) {
        [REF_C1, REF_C2].forEach(function (ref) {
          [false, true].forEach(function (hold) {
            [false, true].forEach(function (cir) {
              [0, 0.5, 1].forEach(function (hs) {
                [false, true].forEach(function (j) {
                  [0, 0.01].forEach(function (idx) {
                    var ages = toucherAge ? [false, true] : [false];
                    ages.forEach(function (a60) {
                      var p = fusion({ socle: S, prime: pr, holdings: hold, cir: cir, hsExo: hs, imposerComplements: j, sousIndexation: idx, retraite60: a60, transition: true, scenario: scenario || 'central' }, ref);
                      var r = solde(p);
                      var o = { p: p, delta: r.delta, soldePublic: r.soldePublic, nDispositifs: r.nDispositifsSupprimes };
                      tous.push(o);
                      if (!best || o.delta > best.delta) best = o;
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    return { meilleure: best, nCombinaisons: tous.length };
  }

  /** Meilleurs taux (plat, t_max) de l'architecture c2 sur une grille, sous plafond de taux marginal total (≤ 95 %). */
  function optimiserTaux(p) {
    var best = null;
    [0.2, 0.3, 0.35, 0.4, 0.45].forEach(function (tp) {
      [0.2, 0.3, 0.4, 0.5, 0.6].forEach(function (tm) {
        if (tp + tm > 0.95) return;
        var q = fusion(p, { archi: 'c2', tPlat: tp, tMax: tm }), r = solde(q);
        if (!best || r.delta > best.delta) best = { tPlat: tp, tMax: tm, delta: r.delta, soldePublic: r.soldePublic, margMax: tp + tm };
      });
    });
    return best;
  }

  var API = {
    DONNEES: D, SCENARIOS: SC, DEFAUT: DEFAUT, CAS: CAS, COMBINAISONS: COMBINAISONS,
    interp: interp, impotContinu: impotContinu, margContinu: margContinu, impot: impot, marginal: marginal, margMax: margMax,
    primeMois: primeMois, coutPrime: coutPrime, economieRetraites: economieRetraites, gainIndexation: gainIndexation,
    bandes: bandes, pensionDecile: pensionDecile, retraites: retraites, imputationHoldings: imputationHoldings,
    recettesCourants: recettesCourants, recettesTransmissions: recettesTransmissions,
    coutRetraite60: coutRetraite60, coutSurcote: coutSurcote, coutHS: coutHS, coutTransition: coutTransition,
    CHOMAGE_DEG: CHOMAGE_DEG, partStockChomage: partStockChomage, partMoyenneCompl: partMoyenneCompl, complementChomage: complementChomage, areActuelle: areActuelle, coutChomage: coutChomage, retroactionChomage: retroactionChomage, RETRO_CHOMAGE: RETRO_CHOMAGE, CHOMAGE_TAU: CHOMAGE_TAU, CHOMAGE_TAUX_NET: CHOMAGE_TAUX_NET,
    solde: solde, equilibre: equilibre, effetsParDecile: effetsParDecile,
    situation: situation, casTypes: casTypes, socleFn: socleFn, penteSocle: penteSocle, recetteIS: recetteIS, complements: complements, socleDegressif: socleDegressif, tableauMarge: tableauMarge, meilleureCombinaison: meilleureCombinaison, optimiserTaux: optimiserTaux, param: param
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.SystemeIdeal = API;
})(this);
