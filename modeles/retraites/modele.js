/*
 * modeles/retraites/modele.js
 * Retraites : socle universel + complément de carrière + capitalisation dans un fonds souverain.
 * Fonctions pures, sans dépendance. Compatible navigateur, Node et JavaScriptCore (jsc).
 *
 * Trois blocs (voir methode.md) :
 *   1. Économie statique sur les pensions selon le montant du socle et la règle de complément,
 *      calculée sur la DISTRIBUTION SOURCÉE des pensions (DREES, EIR 2020, tranches de 100 €)
 *      ramenée en 2025. Remplace l'hypothèse des « trois groupes » du simulateur
 *      (fonction economiePourSimulateur).
 *   2. Transition : les droits cessent de s'acquérir en répartition l'année t0 ; les droits acquis
 *      sont honorés (part « héritée » du complément, payée par le budget), les droits acquis après
 *      t0 sont servis par le fonds (part « capitalisée »). Double charge = ce que le budget paie en
 *      plus de ce qu'aurait coûté la répartition.
 *   3. Fonds souverain : dynamique A(t+1) = A(t)(1+r) + I − P(t), apport constant minimal I*,
 *      taille du fonds, chocs de marché (krach, scénario japonais) et tirages aléatoires.
 * Hypothèses H1 à H20 : voir methode.md. Ordres de grandeur, jamais des prédictions.
 * Unités : Md€ de 2025 (euros constants), millions de personnes, €/mois.
 */
(function (root) {
  'use strict';

  // ---------- Données (voir donnees/*.csv ; ⚠️ = non confirmé) ----------
  var DONNEES = {
    // Parts (%) par tranche de 100 € de 0 à 4 500 €, puis tranche ouverte > 4 500 €, fin 2020.
    distributions: {
      // EIR 2020, tableau 5 : pension BRUTE TOTALE (droit direct + réversion + majoration),
      // retraités de droit direct d'un régime de base, résidents en France OU à l'étranger.
      brute_totale: {
        parts: [2.43, 2.46, 2.35, 2.17, 2, 2.06, 2.28, 2.94, 4.36, 4.44, 4.2, 4.4, 4.59, 4.82, 4.9, 4.75, 4.47,
          4.23, 4, 3.76, 3.63, 2.99, 2.6, 2.3, 1.99, 1.73, 1.53, 1.33, 1.17, 1.01, 0.9, 0.76, 0.67, 0.57, 0.51,
          0.46, 0.4, 0.38, 0.31, 0.29, 0.26, 0.22, 0.2, 0.19, 0.18, 1.82],
        moyenne2020: 1614, moyenne2023: 1763, // DREES fiche 05, tab. 1 compl. bis (résidents France ou étranger)
        champ: 'tous'
      },
      // EIR 2020, tableau 7 : pension NETTE TOTALE, même champ.
      nette_totale: {
        parts: [2.47, 2.57, 2.46, 2.24, 2.08, 2.17, 2.51, 3.61, 4.74, 4.51, 4.6, 4.91, 5.56, 5.6, 5.54, 5.07, 4.63,
          4.43, 4.36, 3.51, 3.03, 2.67, 2.24, 1.85, 1.63, 1.39, 1.21, 1.02, 0.87, 0.74, 0.63, 0.57, 0.49, 0.43,
          0.38, 0.34, 0.3, 0.25, 0.23, 0.21, 0.19, 0.17, 0.15, 0.12, 0.12, 1.23],
        moyenne2020: 1496, moyenne2023: 1634,
        champ: 'tous'
      },
      // DREES « Les retraités et les retraites » 2025, fiche 05, graphique 4a : pension BRUTE de
      // DROIT DIRECT seul (sans réversion), résidents en France uniquement, fin 2020.
      brute_dd_residents: {
        parts: [1.2, 2.5, 3.1, 3.1, 2.9, 3, 3.1, 3.9, 5.4, 5.1, 4.3, 4.3, 4.4, 4.6, 4.6, 4.4, 4, 3.7, 3.4, 3.3,
          3.3, 2.7, 2.4, 2.1, 1.8, 1.6, 1.4, 1.2, 1.1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.4, 0.3, 0.3, 0.3, 0.3,
          0.2, 0.2, 0.2, 0.2, 0.1, 1.7],
        moyenne2020: 1532, moyenne2023: 1666,
        champ: 'residents'
      }
    },
    largeurTranche: 100,
    // Revalorisation fin 2023 → 2025 (H3, ⚠️) : pension de droit direct moyenne COR 2025
    // (361 Md€ / 17,4 M / 12 = 1 729 €) rapportée à la moyenne DREES fin 2023 (1 607 €).
    facteur2023_2025: 361e3 / 17.4 / 12 / 1607,
    retraitesDroitDirect2025: 17.4,       // M (COR RA 2026, y compris résidents à l'étranger)
    partResidents: 16.061968 / 16.974753, // DREES 2022, tab. 1.1-a et 1.1-b (H5)
    moyenneTotaleResidents2023: 1827,     // €/mois brut, DREES fiche 05 tab. 1
    deriveSeulResidents: 0.480024,        // M, DREES 2022, tab. 1.1-b
    moyenneDeriveSeulResidents2022: 712,  // €/mois, DREES tab. 2.4-a
    moyenneTotaleTous2022: 1719,          // €/mois, DREES tab. 2.1-a (pour revaloriser 2022 → 2023)
    pib2025: 422.2 / 0.141,               // ≈ 2 994 Md€ (COR : 422,2 Md€ = 14,1 % du PIB)
    depensesRetraite2025: 422.2,
    pensionsBaseCompl2025: 401,           // hors ASPA
    retraites2070: 22.1,                  // COR, scénario de référence
    // Simulateur actuel (simulations/simulateur.html) : trois groupes non sourcés.
    troisGroupes: [[0.294, 600], [0.262, 1250], [0.444, 2000]]
  };

  // ---------- 1. Distribution ramenée en 2025 ----------

  /** Distribution en euros 2025 : tranches [bas, haut, part], la dernière ouverte avec une moyenne calibrée. */
  function distribution2025(code, donnees) {
    var d = donnees || DONNEES, src = d.distributions[code], L = d.largeurTranche;
    var tot = 0, somme = 0, n = src.parts.length, i;
    for (i = 0; i < n; i++) tot += src.parts[i];
    for (i = 0; i < n - 1; i++) somme += src.parts[i] / tot * (i + 0.5) * L;
    var pTop = src.parts[n - 1] / tot;
    var moyenneTop2020 = (src.moyenne2020 - somme) / pTop; // H2 : calée sur la moyenne DREES 2020
    var k = src.moyenne2023 / src.moyenne2020 * d.facteur2023_2025; // H3 : homothétie
    var tr = [];
    for (i = 0; i < n - 1; i++) tr.push({ bas: k * i * L, haut: k * (i + 1) * L, part: src.parts[i] / tot });
    tr.push({ bas: k * (n - 1) * L, haut: null, moyenne: k * moyenneTop2020, part: pTop });
    return { tranches: tr, k: k, moyenne: src.moyenne2023 * d.facteur2023_2025, moyenneTop: k * moyenneTop2020, champ: src.champ };
  }

  /** E[min(p, S)] par retraité (€/mois), p uniforme dans chaque tranche ; tranche ouverte au-dessus de S. */
  function esperanceMin(dist, S) {
    var e = 0;
    for (var i = 0; i < dist.tranches.length; i++) {
      var t = dist.tranches[i], m;
      if (t.haut === null) m = Math.min(t.moyenne, S); // H2 : toute la tranche ≥ 4 500 € (×k)
      else if (S >= t.haut) m = (t.bas + t.haut) / 2;
      else if (S <= t.bas) m = S;
      else m = ((S - t.bas) * (S + t.bas) / 2 + (t.haut - S) * S) / (t.haut - t.bas);
      e += t.part * m;
    }
    return e;
  }
  function moyenneDist(dist) { return esperanceMin(dist, Infinity); }

  /** Part des retraités sous un montant (€/mois 2025). */
  function partSous(dist, x) {
    var s = 0;
    for (var i = 0; i < dist.tranches.length; i++) {
      var t = dist.tranches[i];
      if (t.haut === null) { if (x > t.bas) s += t.part; continue; }
      if (x >= t.haut) s += t.part; else if (x > t.bas) s += t.part * (x - t.bas) / (t.haut - t.bas);
    }
    return s;
  }
  /** Quantile (€/mois 2025). */
  function quantile(dist, q) {
    var lo = 0, hi = 20000;
    for (var it = 0; it < 60; it++) { var mid = (lo + hi) / 2; if (partSous(dist, mid) < q) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }

  /** E[min(X, S)] pour X exponentielle de moyenne m (H6 : retraités à l'étranger, droits dérivés seuls). */
  function minExpo(m, S) { return m * (1 - Math.exp(-S / m)); }

  /** Moyennes 2025 des sous-populations corrigées (H5, H6). */
  function sousPopulations(donnees) {
    var d = donnees || DONNEES, f = d.facteur2023_2025, pr = d.partResidents;
    var moyTous = d.distributions.brute_totale.moyenne2023;
    var moyEtranger2023 = (moyTous - pr * d.moyenneTotaleResidents2023) / (1 - pr);
    var revalo2022 = moyTous / d.moyenneTotaleTous2022 * f;
    return {
      nEtranger: d.retraitesDroitDirect2025 * (1 - pr),
      moyEtranger: moyEtranger2023 * f,
      nDeriveSeul: d.deriveSeulResidents,
      moyDeriveSeul: d.moyenneDeriveSeulResidents2022 * revalo2022
    };
  }

  /**
   * Économie annuelle sur les pensions (Md€ 2025) pour un socle S (€/mois) et une règle :
   *   regle 'integral'    : complément = max(p − S, 0) → économie Σ min(p, S) ;
   *   regle 'reduit'      : complément = alpha × max(p − S, 0) → + (1 − alpha) Σ max(p − S, 0) ;
   *   regle 'cumul'       : socle en plus de la pension (droits acquis absolus) → 0 ;
   *   base 'brute' (défaut) ou 'nette' : le complément se calcule sur la pension nette de CSG.
   *   distribution : 'brute_totale' (défaut, corrigée des résidents à l'étranger et complétée des
   *   droits dérivés seuls) ou 'brute_dd_residents' (sans réversion, borne basse).
   */
  function economieRetraites(p, donnees) {
    p = p || {};
    var d = donnees || DONNEES, S = p.socle === undefined ? 1000 : p.socle;
    var regle = p.regle || 'integral', alpha = p.alpha === undefined ? 0.8 : p.alpha;
    var code = p.distribution || 'brute_totale', base = p.base || 'brute';
    var dist = distribution2025(code, d), sp = sousPopulations(d);
    var N = dist.champ === 'tous' ? d.retraitesDroitDirect2025 : d.retraitesDroitDirect2025 * d.partResidents;
    var moy = moyenneDist(dist), emin, masseBrute = N * 12 * moy / 1000;
    if (base === 'nette') {
      var dn = distribution2025('nette_totale', d);
      emin = (moy - moyenneDist(dn)) + esperanceMin(dn, S); // brut − net + min(net, S)
    } else emin = esperanceMin(dist, S);
    var principal = N * 12 * emin / 1000;
    var excesPrincipal = masseBrute - principal;
    var etranger = 0, excesEtranger = 0;
    if (dist.champ === 'tous' && p.corrigerEtranger !== false) {
      etranger = sp.nEtranger * 12 * minExpo(sp.moyEtranger, S) / 1000;          // H5-H6 : pas de socle
      excesEtranger = sp.nEtranger * 12 * (sp.moyEtranger - minExpo(sp.moyEtranger, S)) / 1000;
    }
    var derive = 0, excesDerive = 0;
    if (p.ajouterDeriveSeul !== false) {
      derive = sp.nDeriveSeul * 12 * minExpo(sp.moyDeriveSeul, S) / 1000;
      excesDerive = sp.nDeriveSeul * 12 * (sp.moyDeriveSeul - minExpo(sp.moyDeriveSeul, S)) / 1000;
    }
    var integral = principal - etranger + derive;
    var complements = excesPrincipal - excesEtranger + excesDerive; // Σ max(p − S, 0) des résidents
    var economie;
    if (regle === 'cumul') economie = 0;
    else if (regle === 'reduit') economie = integral + (1 - alpha) * complements;
    else economie = integral;
    var masseComplements = regle === 'cumul' ? masseBrute - (dist.champ === 'tous' ? sp.nEtranger * 12 * sp.moyEtranger / 1000 : 0) + sp.nDeriveSeul * 12 * sp.moyDeriveSeul / 1000
      : (regle === 'reduit' ? alpha * complements : complements);
    return {
      socle: S, regle: regle, economieMdE: economie, economiePctPIB: economie / d.pib2025 * 100,
      masseComplementsMdE: masseComplements, massePensionsMdE: masseBrute,
      decomposition: { principalMdE: principal, residentsEtrangerMdE: -etranger, droitsDerivesSeulsMdE: derive,
        complementReduitMdE: regle === 'reduit' ? (1 - alpha) * complements : 0 },
      partSousSocle: partSous(dist, S), k: dist.k
    };
  }

  // ---------- 1 bis. Bilan de revenu des retraités selon le parametrage (taux plat, socle) ----------
  // Ajout du 03/11/2026 : le socle S et le taux plat t du système idéal (ancien 1 000 € / 50 %,
  // palier 1 500 € / 35 %, architecture retenue 350 € / 40 %). Ne modifie aucune fonction existante.

  /** Espérance de f(p) (p en €/mois 2025), p uniforme dans chaque tranche (20 points), tranche ouverte à sa moyenne. */
  function esperanceFonction(dist, f) {
    var e = 0, i, j, m;
    for (i = 0; i < dist.tranches.length; i++) {
      var t = dist.tranches[i];
      if (t.haut === null) { e += t.part * f(t.moyenne); continue; }
      m = 0;
      for (j = 0; j < 20; j++) m += f(t.bas + (t.haut - t.bas) * (j + 0.5) / 20);
      e += t.part * m / 20;
    }
    return e;
  }

  /** Revenu mensuel d'un retraité de pension brute p sous une règle d'imposition du complément (H8, H42). */
  function revenuRetraite(p, S, t, imposition, nuBrutNet) {
    var net = p * nuBrutNet;
    if (imposition === 'brut') return S + Math.max(p - S, 0);              // complément non imposé, CSG supprimée
    if (imposition === 'net') return Math.max(net, S);                       // complément sur le net : pension nette garantie
    return S + (1 - t) * Math.max(p - S, 0);                                 // 'taux_plat' : complément imposé au taux plat t
  }

  /**
   * Bilan de revenu des retraités RÉSIDENTS (pension de droit direct, brute totale) quand la règle
   * « pension − socle » est appliquée avec un socle S et un taux plat t, selon l'imposition du complément :
   *   'brut' : non imposé (hypothèse H8 d'origine) ; 'net' : calculé sur la pension nette ;
   *   'taux_plat' : complément imposé au taux plat t (règle des actifs : socle + (1 − t) × revenu).
   * Renvoie : variation moyenne du revenu net, variation totale (Md€/an), part de perdants,
   * et effet budgétaire de l'État (= − variation des revenus, statique, avant effets de comportement).
   */
  function bilanRevenuRetraites(p, donnees) {
    p = p || {};
    var d = donnees || DONNEES, S = p.socle === undefined ? 500 : p.socle, t = p.taux === undefined ? 0.35 : p.taux;
    var imposition = p.imposition || 'net';
    var dist = distribution2025('brute_totale', d), dn = distribution2025('nette_totale', d);
    var nu = moyenneDist(dn) / moyenneDist(dist);              // H41 : net / brut moyen (≈ 0,927)
    var N = d.retraitesDroitDirect2025 * d.partResidents;      // M de résidents
    var dm = esperanceFonction(dist, function (x) { return revenuRetraite(x, S, t, imposition, nu) - x * nu; });
    var perdants = esperanceFonction(dist, function (x) { return revenuRetraite(x, S, t, imposition, nu) < x * nu - 0.5 ? 1 : 0; });
    function cas(pension) { return revenuRetraite(pension, S, t, imposition, nu) - pension * nu; }
    return {
      socle: S, taux: t, imposition: imposition, nuBrutNet: nu,
      variationMoyenneMensuelle: dm, variationTotaleMdE: N * 12 * dm / 1000,
      partPerdants: perdants, effetBudgetEtatMdE: -N * 12 * dm / 1000,
      casTypes: { 800: cas(800), 1200: cas(1200), 1753: cas(1753), 2500: cas(2500), 3500: cas(3500) }
    };
  }

  /**
   * Contribution des hautes pensions de la v2 du système : taux τ sur la part de la pension NETTE au-dessus
   * de `seuil` (€/mois), pension seule, retraités résidents (sans capital). Recoupe « 6,3 Md€ » (Rés. § 12.2).
   */
  function contributionHautesPensions(p, donnees) {
    p = p || {};
    var d = donnees || DONNEES, seuil = p.seuil === undefined ? 2500 : p.seuil, tau = p.taux === undefined ? 0.2 : p.taux;
    var dn = distribution2025('nette_totale', d), N = d.retraitesDroitDirect2025 * d.partResidents;
    var e = esperanceFonction(dn, function (x) { return Math.max(x - seuil, 0); });
    return { seuil: seuil, taux: tau, recetteMdE: N * 12 * tau * e / 1000, partTouchee: 1 - partSous(dn, seuil) };
  }

  /** Réplique de l'hypothèse actuelle du simulateur (trois groupes non sourcés). */
  function economieTroisGroupes(S, donnees) {
    var d = donnees || DONNEES;
    return d.retraitesDroitDirect2025 * 12 / 1000 * d.troisGroupes.reduce(function (s, g) { return s + g[0] * Math.min(g[1], S); }, 0);
  }

  /**
   * Remplacement pour le simulateur : économie (Md€) en fonction du socle, distribution sourcée,
   * règle « complément intégral » sur la pension brute. À multiplier par le coefficient de règle
   * du curseur (1 / 0,5 / 0) comme aujourd'hui.
   */
  function economiePourSimulateur(S) { return economieRetraites({ socle: S, regle: 'integral' }).economieMdE; }

  /** Table socle → économie (pas de 100 €), à coller dans le simulateur si l'on préfère une table. */
  function tableSimulateur(min, max, pas) {
    var t = []; for (var S = min; S <= max; S += pas) t.push([S, Math.round(economiePourSimulateur(S) * 10) / 10]);
    return t;
  }

  // ---------- 2. Transition ----------

  /**
   * Part moyenne des droits acquis APRÈS la réforme parmi les retraités de l'année t (H11-H12) :
   * carrière de W ans finissant au départ, retraite de D ans, effectifs égaux par âge.
   */
  function partCapitalisee(t, t0, W, D) {
    var s = 0;
    for (var j = 0; j < D; j++) {
      var depart = t - j; // année de départ du retraité qui a j années de retraite
      s += Math.max(0, Math.min(1, (depart - t0) / W));
    }
    return s / D;
  }

  /** Effectif relatif de retraités (2025 = 1), interpolation linéaire COR 2025 → 2070 puis plat (H13). */
  function effectifRelatif(t, donnees) {
    var d = donnees || DONNEES, a = d.retraitesDroitDirect2025, b = d.retraites2070;
    var x = t <= 2025 ? a : (t >= 2070 ? b : a + (b - a) * (t - 2025) / 45);
    return x / a;
  }

  var SCENARIOS = {
    // r : rendement réel net du fonds ; sigma : volatilité annuelle ; apportsHeritage : Md€/an de parts
    // reçues au titre de l'héritage (⚠️ hypothèses de Claude, H15-H17) ; W, D : carrière et retraite.
    bas: { r: 0.02, sigma: 0.14, apportsHeritage: 10 },
    central: { r: 0.035, sigma: 0.12, apportsHeritage: 20 },
    haut: { r: 0.05, sigma: 0.11, apportsHeritage: 35 }
  };

  /** Simulation déterministe du fonds pour un apport annuel constant I (Md€) ; renvoie la trajectoire. */
  function trajectoireFonds(I, cfg) {
    var A = cfg.actifInitial || 0, traj = [], minA = Infinity, anneeEpuisement = null;
    for (var t = cfg.t0; t <= cfg.fin; t++) {
      var P = cfg.versements(t);
      var r = cfg.rendement ? cfg.rendement(t) : cfg.r;
      A = A * (1 + r) + I - P;
      if (A < minA) minA = A;
      if (A < 0 && anneeEpuisement === null) anneeEpuisement = t;
      traj.push({ annee: t, actif: A, versements: P });
    }
    return { traj: traj, minimum: minA, anneeEpuisement: anneeEpuisement, final: A };
  }

  /** Apport constant minimal I* (Md€/an) : fonds jamais négatif et soutenable à perpétuité au-delà de cfg.fin. */
  function apportMinimal(cfg) {
    var lo = 0, hi = 2000;
    for (var it = 0; it < 80; it++) {
      var mid = (lo + hi) / 2;
      var tr = trajectoireFonds(mid, cfg), rFin = cfg.rendement ? cfg.r : cfg.r;
      // jamais négatif ET soutenable à perpétuité à la fin : I + r·A ≥ versements de la dernière année
      if (tr.minimum >= 0 && mid + rFin * tr.final >= cfg.versements(cfg.fin) - 1e-9) hi = mid; else lo = mid;
    }
    return hi;
  }

  /**
   * Transition complète. Paramètres : socle, regle, alpha, scenario ('bas'|'central'|'haut'), t0,
   * W (41), D (25), horizon (fin du calcul, 2200 pour approcher la perpétuité), apportHeritage.
   * Renvoie : coût hérité (budget), versements du fonds, apport minimal, double charge, taille du fonds.
   */
  function transition(p, donnees) {
    p = p || {};
    var d = donnees || DONNEES, sc = SCENARIOS[p.scenario || 'central'];
    var t0 = p.t0 || 2027, W = p.W || 41, D = p.D || 25, fin = p.horizon || 2200;
    var r = p.r === undefined ? sc.r : p.r;
    var stat = economieRetraites({ socle: p.socle, regle: p.regle, alpha: p.alpha }, d);
    var C0 = stat.masseComplementsMdE; // complément annuel total 2025 (Md€), à remplacer à terme par le fonds
    var C = function (t) { return C0 * effectifRelatif(t, d); };
    var f = function (t) { return partCapitalisee(t, t0, W, D); };
    var heritage = p.apportHeritage === undefined ? sc.apportsHeritage : p.apportHeritage;
    var cfg = { t0: t0, fin: fin, r: r, versements: function (t) { return C(t) * f(t); },
      rendement: p.rendement, actifInitial: p.actifInitial || 0 };
    var Istar = apportMinimal(cfg);
    var res = trajectoireFonds(Istar, cfg);
    var lignes = [], dureeDouble = 0, cumulDouble = 0, picDouble = 0, anneePic = t0, finDouble = null;
    for (var i = 0; i < res.traj.length; i++) {
      var t = res.traj[i].annee, herite = C(t) * (1 - f(t));
      var charge = herite + Istar;            // ce que le budget (et l'héritage détourné) consacre aux compléments
      var dbl = charge - C(t);                // au-delà de ce qu'aurait coûté la répartition
      if (dbl > 0) { dureeDouble++; cumulDouble += dbl; if (dbl > picDouble) { picDouble = dbl; anneePic = t; } }
      else if (finDouble === null) finDouble = t;
      lignes.push({ annee: t, complementTotal: C(t), herite: herite, fonds: res.traj[i].versements,
        actif: res.traj[i].actif, partCapitalisee: f(t), doubleCharge: dbl });
    }
    var get = function (an) { for (var j = 0; j < lignes.length; j++) if (lignes[j].annee === an) return lignes[j]; return null; };
    // dette implicite des compléments hérités : valeur actualisée au taux r du coût hérité
    var vaHerite = 0;
    for (var j = 0; j < lignes.length; j++) vaHerite += lignes[j].herite / Math.pow(1 + r, lignes[j].annee - t0);
    var Css = C(fin);
    // Valeur actualisée de (charge − répartition) : nulle au taux r (identité de Sinn), positive à un taux plus bas.
    var va = function (taux) { var v = 0; for (var q = 0; q < lignes.length; q++) v += lignes[q].doubleCharge / Math.pow(1 + taux, lignes[q].annee - t0);
      return v; };
    return {
      parametres: { socle: stat.socle, regle: stat.regle, r: r, t0: t0, W: W, D: D, apportHeritage: heritage },
      economieStatiqueMdE: stat.economieMdE, complement2025MdE: C0,
      apportMinimalMdE: Istar, apportMinimalPctPIB: Istar / d.pib2025 * 100,
      partCouverteParHeritage: Math.min(1, heritage / Istar),
      apportBudgetaireRestantMdE: Math.max(0, Istar - heritage),
      doubleCharge: { dureeAns: dureeDouble, finAnnee: finDouble, cumulMdE: cumulDouble, picMdE: picDouble, anneePic: anneePic,
        picPctPIB: picDouble / d.pib2025 * 100 },
      fonds: { actif2070MdE: get(2070) ? get(2070).actif : null, actif2100MdE: get(2100) ? get(2100).actif : null,
        actifMaxMdE: lignes.reduce(function (m, l) { return Math.max(m, l.actif); }, 0),
        actifFinalMdE: res.final, actifFinalPctPIB: res.final / d.pib2025 * 100 },
      regimePermanent: { complementMdE: Css, apportMdE: Istar, economieAnnuelleVsRepartitionMdE: Css - Istar },
      vaDoubleChargeAuTauxDuFondsMdE: va(r), vaDoubleChargeAuTaux: va,
      detteImpliciteComplementsMdE: vaHerite, detteImpliciteComplementsPctPIB: vaHerite / d.pib2025 * 100,
      herite2030: get(2030) ? get(2030).herite : null, herite2050: get(2050) ? get(2050).herite : null,
      herite2070: get(2070) ? get(2070).herite : null, herite2090: get(2090) ? get(2090).herite : null,
      lignes: lignes
    };
  }

  /** Transition « progressive » du socle : le socle déduit des pensions monte linéairement sur n ans (H10). */
  function economieProgressive(socle, n, annee, t0) {
    var lambda = Math.max(0, Math.min(1, (annee - t0 + 1) / n));
    return { lambda: lambda, economieMdE: economieRetraites({ socle: lambda * socle, regle: 'integral' }).economieMdE,
      surcoutVsIntegralMdE: economieRetraites({ socle: socle, regle: 'integral' }).economieMdE - economieRetraites({ socle: lambda * socle, regle: 'integral' }).economieMdE };
  }

  /** Actifs/versements en régime permanent d'une capitalisation par comptes (sans croissance, H18). */
  function ratioActifsVersements(r, W, D) {
    // Cotisation c par an pendant W ans, rente B pendant D ans, capital au départ K = B × a(D, r).
    var aD = r === 0 ? D : (1 - Math.pow(1 + r, -D)) / r;
    var sW = r === 0 ? W : (Math.pow(1 + r, W) - 1) / r;
    var B = 1, K = B * aD, c = K / sW, actifs = 0, bal = 0, k;
    for (k = 0; k < W; k++) { bal = bal * (1 + r) + c; actifs += bal; }
    for (k = 0; k < D; k++) { bal = bal * (1 + r) - B; actifs += Math.max(bal, 0); }
    return { actifsSurVersements: actifs / D, cotisationSurVersements: c * W / D };
  }

  // ---------- 3. Risque de marché ----------

  /** Générateur pseudo-aléatoire reproductible (LCG) et loi normale (Box-Muller). */
  function generateur(graine) {
    var s = graine >>> 0 || 1;
    var u = function () { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return (s + 0.5) / 4294967296; };
    return function () { return Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u()); };
  }

  /**
   * Monte-Carlo : apport fixé à I* du scénario déterministe, rendements annuels ~ N(r, sigma) (H19).
   * Renvoie la probabilité d'épuisement du fonds avant `jusqua` et les quantiles de l'actif en 2070.
   */
  function monteCarlo(p, tirages, graine) {
    p = p || {};
    var base = transition(p), sc = SCENARIOS[p.scenario || 'central'];
    var sigma = p.sigma === undefined ? sc.sigma : p.sigma, r = base.parametres.r, jusqua = p.jusqua || 2100;
    var g = generateur(graine || 12345), n = tirages || 2000, epuise = 0, a2070 = [];
    var apport = p.apport === undefined ? base.apportMinimalMdE : p.apport;
    var C0 = base.complement2025MdE, t0 = base.parametres.t0, W = base.parametres.W, D = base.parametres.D;
    for (var k = 0; k < n; k++) {
      var A = 0, mort = false, v2070 = 0;
      for (var t = t0; t <= jusqua; t++) {
        var P = C0 * effectifRelatif(t) * partCapitalisee(t, t0, W, D);
        A = A * (1 + r + sigma * sigma / 2 + sigma * g()) + apport - P;
        if (A < 0) mort = true;
        if (t === 2070) v2070 = A;
      }
      if (mort) epuise++;
      a2070.push(v2070);
    }
    a2070.sort(function (x, y) { return x - y; });
    var q = function (x) { return a2070[Math.floor(x * (n - 1))]; };
    return { probaEpuisement: epuise / n, actif2070: { p5: q(0.05), p50: q(0.5), p95: q(0.95) }, apportMdE: apport,
      apportDeterministeMdE: base.apportMinimalMdE };
  }

  /** Apport constant (Md€/an) pour que le fonds ne s'épuise pas avant `jusqua` dans une proportion `succes` des tirages. */
  function apportPrudent(p, succes, tirages, graine) {
    var lo = 0, hi = 1000;
    for (var it = 0; it < 30; it++) {
      var mid = (lo + hi) / 2, mc = monteCarlo(copie(p || {}, { apport: mid }), tirages, graine);
      if (1 - mc.probaEpuisement >= succes) hi = mid; else lo = mid;
    }
    return hi;
  }

  /** Choc ponctuel (−choc en `annee`) ou décennies perdues (rendement nul pendant `duree` ans). */
  function stress(p, type) {
    p = p || {};
    var base = transition(p), r = base.parametres.r;
    var annee = p.annee || 2060, choc = p.choc === undefined ? 0.4 : p.choc, duree = p.duree || 34;
    var rend = type === 'japon'
      ? function (t) { return (t >= annee && t < annee + duree) ? 0 : r; }
      : function (t) { return t === annee ? (1 + r) * (1 - choc) - 1 : r; };
    var avecChoc = transition(Object.assign ? Object.assign({}, p, { rendement: rend }) : copie(p, { rendement: rend }));
    return { apportSansChocMdE: base.apportMinimalMdE, apportAvecChocMdE: avecChoc.apportMinimalMdE,
      surcoutAnnuelMdE: avecChoc.apportMinimalMdE - base.apportMinimalMdE,
      apportFixeEpuisement: trajectoireFonds(base.apportMinimalMdE, { t0: base.parametres.t0, fin: p.horizon || 2200, r: r, rendement: rend,
        versements: function (t) { return base.complement2025MdE * effectifRelatif(t) * partCapitalisee(t, base.parametres.t0, base.parametres.W, base.parametres.D); } }).anneeEpuisement };
  }
  function copie(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  /** Rôle d'assurance du socle : baisse du revenu d'un retraité si le complément baisse de `choc`. */
  function assuranceSocle(S, choc) {
    var dist = distribution2025('brute_totale'), med = quantile(dist, 0.5);
    var moy = moyenneDist(dist), exces = moy - esperanceMin(dist, S);
    return { pensionMediane: med, baisseMediane: choc * Math.max(med - S, 0) / Math.max(med, S),
      baisseSansSocle: choc, partRevenuExposee: exces / Math.max(moy, 1e-9) };
  }

  var API = {
    DONNEES: DONNEES, SCENARIOS: SCENARIOS,
    distribution2025: distribution2025, esperanceMin: esperanceMin, moyenneDist: moyenneDist, partSous: partSous,
    quantile: quantile, sousPopulations: sousPopulations,
    economieRetraites: economieRetraites, bilanRevenuRetraites: bilanRevenuRetraites, contributionHautesPensions: contributionHautesPensions, esperanceFonction: esperanceFonction, economieTroisGroupes: economieTroisGroupes,
    economiePourSimulateur: economiePourSimulateur, tableSimulateur: tableSimulateur,
    partCapitalisee: partCapitalisee, effectifRelatif: effectifRelatif, trajectoireFonds: trajectoireFonds,
    apportMinimal: apportMinimal, transition: transition, economieProgressive: economieProgressive,
    ratioActifsVersements: ratioActifsVersements, monteCarlo: monteCarlo, apportPrudent: apportPrudent, stress: stress, assuranceSocle: assuranceSocle
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.Retraites = API;
})(this);
