/*
 * modeles/retraites/capitalisation.js  (T48, 01/11/2026)
 * Variante « nouveau décompte + part capitalisée progressive ».
 * Fonctions pures, sans dépendance, compatibles navigateur, Node et JavaScriptCore.
 * Complète modele.js (T13) sans le modifier. Hypothèses H21-H40 : voir methode.md, § 9.
 * Unités : Md€ de 2025 (euros constants), €/an ou €/mois pour un salarié, années de calendrier,
 * t = 0 pour la première année de la réforme (2027). Ordres de grandeur, jamais des prédictions.
 *
 * Principe (cohortes, H27-H29). Chaque année t, une fraction φ(t) de points de cotisation (sur 27,8)
 * est versée au fonds au lieu du régime en répartition. La cotisation de l'année u se répartit à parts
 * égales sur les 40 générations d'actifs, qui partiront à la retraite 1 à 40 ans plus tard. Le capital
 * de la génération qui part l'année s est transformé en rente constante sur D ans.
 *  - Fonds : capital capitalisé au rendement r.
 *  - Équivalent répartition : les mêmes cotisations, revalorisées au rythme ρ de la masse salariale
 *    (condition d'Aaron), donneraient une pension « répartition » ; c'est l'économie de dépense publique.
 *  - Double charge(t) = cotisations détournées(t) − pensions de répartition évitées(t).
 *  - Le retraité reçoit la rente du fonds à la place de l'équivalent répartition : l'écart r − ρ lui
 *    revient (c'est le « gain » de Sinn, payé par la double charge).
 */
(function (root) {
  'use strict';

  var C = {
    assiettePointMdE: 1466.5 / 100,   // H21 : 1 point de cotisation = 1 % de l'assiette salariale 2024 (coût employeur), Md€
    tauxCotisation: 27.8,             // H22 : cotisation retraite obligatoire moyenne, % du salaire brut (OCDE, tableau 8.1)
    pensionsMdE: 422.2,               // H23 : dépenses de retraite 2025 (COR 2026), euros constants
    pibMdE: 422.2 / 0.141,            // H23 : PIB implicite 2025 ≈ 2 994 Md€
    W: 40, D: 22,                     // H27 : carrière de 40 ans, retraite de 22 ans (rente constante)
    ageRetraite: 65, anneeReforme: 2027
  };

  // H24 : scénarios (⚠️ rendement et croissance : hypothèses, comme SCENARIOS de modele.js).
  // r : rendement réel net de frais du fonds ; g : croissance réelle des salaires et de la masse salariale
  // (rythme ρ de revalorisation des droits en répartition) ; sigma : volatilité annuelle du fonds ;
  // i : taux réel de la dette de transition.
  var SCENARIOS = {
    bas: { r: 0.02, g: 0.0, sigma: 0.14, i: 0.02 },
    central: { r: 0.035, g: 0.006, sigma: 0.12, i: 0.015 },
    haut: { r: 0.05, g: 0.01, sigma: 0.11, i: 0.01 }
  };

  // H38 : cas types (€ bruts annuels 2025, au milieu de carrière, à 40 ans ; pente = croissance réelle individuelle annuelle de carrière, ⚠️ hypothèse H39 : 0 / 0,5 / 1,5 %). ⚠️ Smic ≈ 1 823 €/mois brut 2026 ; médiane = 2 190 € net / 0,78
  // (INSEE, H2-H3 de modeles/offre-de-travail) ; cadre = cas type 60 k€ de modeles/systeme-ideal (H31).
  var PROFILS = {
    smic: { nom: 'Smic', brut: 21876, pente: 0 },
    median: { nom: 'salaire médian', brut: 2190 / 0.78 * 12, pente: 0.005 },
    cadre: { nom: 'cadre (60 k€)', brut: 60000, pente: 0.015 }
  };

  function scenario(nom, surcharge) {
    var s = SCENARIOS[nom || 'central'], o = {}, k;
    for (k in s) o[k] = s[k];
    if (surcharge) for (k in surcharge) if (surcharge[k] !== undefined) o[k] = surcharge[k];
    return o;
  }

  /** Profil de montée en charge : φ(t) = min(phiMax, 1 + floor(t / pas)) points (H26). pas = 3 ans. */
  function profilPoints(phiMax, pas) {
    var p = pas || 3;
    return function (t) { return t < 0 ? 0 : Math.min(phiMax, 1 + Math.floor(t / p)); };
  }

  /** Facteur de rente-due : somme des (1+x)^-m pour m = 0..D-1. */
  function facteurRente(x, D) {
    var s = 0, m;
    for (m = 0; m < D; m++) s += Math.pow(1 + x, -m);
    return s;
  }

  // ---------- Compartiment « entreprises d'intérêt commun » (H34-H37) ----------
  /**
   * Rendement et volatilité du portefeuille avec un compartiment de poids q (≤ 15 %).
   * dRend : écart de rendement réel du compartiment au cœur indiciel (négatif = moins rentable) ;
   * sigmaC : volatilité du compartiment ; corr : corrélation avec le cœur.
   */
  function compartiment(p) {
    var s = scenario(p.scenario), q = p.q || 0, d = p.dRend === undefined ? 0 : p.dRend;
    var sc = p.sigmaC === undefined ? 0.2 : p.sigmaC, corr = p.corr === undefined ? 0.6 : p.corr;
    var r = p.r === undefined ? s.r : p.r, sg = p.sigma === undefined ? s.sigma : p.sigma;
    var rp = (1 - q) * r + q * (r + d);
    var v = Math.pow(1 - q, 2) * sg * sg + q * q * sc * sc + 2 * q * (1 - q) * corr * sg * sc;
    return { q: q, r: rp, sigma: Math.sqrt(v), ecartRendement: rp - r, ecartSigma: Math.sqrt(v) - sg };
  }

  // ---------- Double charge année par année (H25-H33) ----------
  /**
   * p : { phiMax, pas, scenario, r, g, rho, i, annees (horizon d'affichage, 90), q, dRend, sigmaC, corr }
   * Renvoie { lignes[], resume }. Chaque ligne : annee, t, phi, verseFondsMdE, pensionsFondsMdE,
   * economieRepartitionMdE, doubleChargeMdE, doubleChargePctPIB, cumulMdE, fondsMdE, fondsPctPIB, detteMdE,
   * pointsPreleves, partPensionsServieParFonds.
   */
  function doubleCharge(p) {
    var s = scenario(p.scenario), g = p.g === undefined ? s.g : p.g, rho = p.rho === undefined ? g : p.rho;
    var cp = compartiment({ scenario: p.scenario, q: p.q, dRend: p.dRend, sigmaC: p.sigmaC, corr: p.corr,
      r: p.r, sigma: p.sigma });
    var r = cp.r, i = p.i === undefined ? s.i : p.i, W = C.W, D = C.D, T = p.annees || 90;
    var phi = profilPoints(p.phiMax, p.pas), N = T + W + D;
    var contrib = [], u, t, sIdx;
    for (u = 0; u < N; u++) contrib[u] = (u < T + W ? phi(u) : phi(T + W)) * C.assiettePointMdE * Math.pow(1 + g, u);
    // Rentes annuelles par génération partant en s (s = 1..N-1), au fonds et en équivalent répartition.
    var renteF = [], renteR = [], aF = facteurRente(r, D), aR = facteurRente(rho, D);
    for (sIdx = 0; sIdx < N; sIdx++) {
      var KF = 0, KR = 0, a = Math.max(0, sIdx - W);
      for (u = a; u < sIdx; u++) { KF += contrib[u] / W * Math.pow(1 + r, sIdx - u); KR += contrib[u] / W * Math.pow(1 + rho, sIdx - u); }
      renteF[sIdx] = KF / aF; renteR[sIdx] = KR / aR;
    }
    var lignes = [], fonds = 0, dette = 0, cumul = 0, pic = -Infinity, anneePic = 0, anneeRetour = null,
      anneeSurcoutNul = null, fondsMax = 0;
    for (t = 0; t < T; t++) {
      var pf = 0, er = 0;
      for (sIdx = Math.max(1, t - D + 1); sIdx <= t; sIdx++) { pf += renteF[sIdx]; er += renteR[sIdx]; }
      var verse = contrib[t], net = verse - er, pib = C.pibMdE * Math.pow(1 + g, t + 2);
      fonds = (fonds + verse - pf) * (1 + r);
      dette = dette * (1 + i) + net; cumul += net;
      if (net > pic) { pic = net; anneePic = t; }
      if (fonds > fondsMax) fondsMax = fonds;
      lignes.push({ annee: C.anneeReforme + t, t: t, phi: phi(t), verseFondsMdE: verse, pensionsFondsMdE: pf,
        economieRepartitionMdE: er, doubleChargeMdE: net, doubleChargePctPIB: 100 * net / pib, cumulMdE: cumul,
        fondsMdE: fonds, fondsPctPIB: 100 * fonds / pib, detteMdE: dette, dettePctPIB: 100 * dette / pib, serviceDetteMdE: i * dette, gainRetraitesMdE: pf - er,
        pointsPreleves: net > 0 ? net / (C.assiettePointMdE * Math.pow(1 + g, t)) : 0,
        partPensionsServieParFonds: pf / (C.pensionsMdE * Math.pow(1 + g, t)) });
    }
    // Année à partir de laquelle la double charge reste inférieure à 0,1 % du PIB (≈ 3 Md€), après le pic.
    for (t = T - 1; t > anneePic; t--) { if (lignes[t].doubleChargePctPIB > 0.1) break; anneeSurcoutNul = t; }
    for (t = T - 1; t >= 1; t--) { if (lignes[t].fondsMdE - lignes[t].detteMdE <= 0) break; anneeRetour = t; }
    var l = function (k) { return lignes[Math.min(k, T - 1)]; };
    return { parametres: { phiMax: p.phiMax, pas: p.pas || 3, r: r, g: g, rho: rho, i: i, q: cp.q, sigma: cp.sigma },
      lignes: lignes,
      resume: { picMdE: pic, picPctPIB: l(anneePic).doubleChargePctPIB, anneePic: C.anneeReforme + anneePic,
        dette30MdE: l(29).detteMdE, dette60MdE: l(59).detteMdE, dette60PctPIB: l(59).dettePctPIB, service60MdE: l(59).serviceDetteMdE, gain60MdE: l(59).gainRetraitesMdE, gain60PctPIB: 100 * l(59).gainRetraitesMdE / (C.pibMdE * Math.pow(1 + g, 61)),
        anneeActifNetPositif: anneeRetour === null ? null : C.anneeReforme + anneeRetour,
        anneeSurcoutNegligeable: anneeSurcoutNul === null ? null : C.anneeReforme + anneeSurcoutNul,
        cumul30MdE: l(29).cumulMdE, cumul60MdE: l(59).cumulMdE, fonds30MdE: l(29).fondsMdE, fonds60MdE: l(59).fondsMdE,
        fonds30PctPIB: l(29).fondsPctPIB, fonds60PctPIB: l(59).fondsPctPIB,
        net30MdE: l(29).fondsMdE - l(29).detteMdE, net60MdE: l(59).fondsMdE - l(59).detteMdE,
        part60: l(59).partPensionsServieParFonds, pointsPrelevesPic: lignes.reduce(function (m, x) { return Math.max(m, x.pointsPreleves); }, 0) } };
  }

  // ---------- Pension d'un salarié né en 2000 (H38-H40) ----------
  /**
   * p : { brut (€/an 2025), phiMax, pas, scenario, r, g, rho, naissance (2000), rendements (tableau de
   *   rendements annuels réels sur les années de réforme, optionnel), q, dRend, sigmaC, corr }
   * Carrière : entrée à 22 ans (5 ans avant la réforme, droits acquis préservés en répartition), départ à 65 ans.
   * Renvoie les pensions (€/mois, euros 2025 mais salaires qui croissent à g) en répartition seule et mixte.
   */
  function pensionSalarie(p) {
    var s = scenario(p.scenario), g = p.g === undefined ? s.g : p.g, rho = p.rho === undefined ? g : p.rho;
    var cp = compartiment({ scenario: p.scenario, q: p.q, dRend: p.dRend, sigmaC: p.sigmaC, corr: p.corr, r: p.r, sigma: p.sigma });
    var naiss = p.naissance || 2000, tRet = naiss + C.ageRetraite - C.anneeReforme, yDebut = naiss + 22 - C.anneeReforme;
    var phi = profilPoints(p.phiMax, p.pas), tau = C.tauxCotisation / 100, Kpre = 0, Krep = 0, Kfonds = 0, y, dernier = 0;
    var ret = p.rendements;
    for (y = yDebut; y < tRet; y++) {
      var w = p.brut * Math.pow(1 + g, y + 2) * Math.pow(1 + (p.pente || 0), y + 27 - 40), c = tau * w, ph = y >= 0 ? phi(y) / C.tauxCotisation : 0;
      var facteurRep = Math.pow(1 + rho, tRet - y);
      if (y < 0) Kpre += c * facteurRep;
      else Krep += c * (1 - ph) * facteurRep;
      if (ph > 0) {
        var f = 1, k;
        for (k = y; k < tRet; k++) f *= 1 + (ret ? ret[k] : cp.r);
        Kfonds += c * ph * f;
      }
      dernier = w;
    }
    var aR = facteurRente(rho, C.D), aF = facteurRente(p.rConv === undefined ? cp.r : p.rConv, C.D); // rConv : taux technique de la rente (H40), par défaut le rendement attendu
    var repSeule = (Kpre + Krep + (function () { var x = 0, yy; for (yy = Math.max(0, yDebut); yy < tRet; yy++) x += tau * p.brut * Math.pow(1 + g, yy + 2) * Math.pow(1 + (p.pente || 0), yy + 27 - 40) * phi(yy) / C.tauxCotisation * Math.pow(1 + rho, tRet - yy); return x; })()) / aR;
    var mixte = (Kpre + Krep) / aR + Kfonds / aF;
    return { repartitionSeuleMois: repSeule / 12, mixteMois: mixte / 12, rapport: mixte / repSeule,
      tauxRemplacementRepartition: repSeule / dernier, tauxRemplacementMixte: mixte / dernier,
      partCapitaliseeDuCapital: Kfonds / (Kpre + Krep + Kfonds), dernierSalaire: dernier, anneeRetraite: naiss + C.ageRetraite };
  }

  // Générateur pseudo-aléatoire (mulberry32) et loi normale (Box-Muller) : reproductibles.
  function generateur(graine) {
    var a = graine >>> 0;
    function u() { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
    return { u: u, n: function () { var x = Math.max(u(), 1e-12), y = u(); return Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y); } };
  }

  function quantile(tab, q) {
    var t = tab.slice().sort(function (a, b) { return a - b; }), x = q * (t.length - 1), i = Math.floor(x);
    return i + 1 < t.length ? t[i] + (x - i) * (t[i + 1] - t[i]) : t[i];
  }

  /** Dispersion due au risque de marché : rendements annuels log-normaux d'espérance r et de volatilité σ. */
  function dispersionSalarie(p, tirages, graine) {
    var s = scenario(p.scenario), cp = compartiment({ scenario: p.scenario, q: p.q, dRend: p.dRend, sigmaC: p.sigmaC, corr: p.corr, r: p.r, sigma: p.sigma });
    var sg = cp.sigma, mu = Math.log(1 + cp.r) - sg * sg / 2, gen = generateur(graine || 12345), n = tirages || 4000;
    var rapports = [], mixtes = [], perdants = 0, k, t, naiss = p.naissance || 2000, tRet = naiss + C.ageRetraite - C.anneeReforme, rep;
    var base = pensionSalarie(p);
    for (k = 0; k < n; k++) {
      var rend = [];
      for (t = 0; t < tRet; t++) rend[t] = Math.exp(mu + sg * gen.n()) - 1;
      var res = pensionSalarie(copie(p, { rendements: rend }));
      rep = res.repartitionSeuleMois;
      rapports.push(res.rapport); mixtes.push(res.mixteMois);
      if (res.mixteMois < rep) perdants++;
    }
    return { base: base, tirages: n, sigma: sg, rendement: cp.r,
      mixteP5: quantile(mixtes, 0.05), mixteP50: quantile(mixtes, 0.5), mixteP95: quantile(mixtes, 0.95),
      rapportP5: quantile(rapports, 0.05), rapportP50: quantile(rapports, 0.5), rapportP95: quantile(rapports, 0.95),
      probaMoinsQueRepartition: perdants / n };
  }

  /** Stress : 'krach' (-40 % l'année avant le départ), 'japon' (rendement réel nul les 20 dernières années), 'zero' (rendement réel nul toute la carrière). */
  function stressSalarie(p, type) {
    var s = scenario(p.scenario), cp = compartiment({ scenario: p.scenario, q: p.q, dRend: p.dRend, sigmaC: p.sigmaC, corr: p.corr, r: p.r, sigma: p.sigma });
    var naiss = p.naissance || 2000, tRet = naiss + C.ageRetraite - C.anneeReforme, rend = [], t;
    for (t = 0; t < tRet; t++) {
      rend[t] = cp.r;
      if (type === 'krach' && t === tRet - 1) rend[t] = -0.4;
      if (type === 'japon' && t >= tRet - 20) rend[t] = 0;
      if (type === 'zero') rend[t] = 0;
    }
    return pensionSalarie(copie(p, { rendements: rend, rConv: (type === 'zero' || type === 'japon') ? 0 : undefined }));
  }

  // ---------- Étape 0-1 : nouveau décompte (H21b, H30-H32) ----------
  /**
   * Compte notionnel : capital = cotisations revalorisées à ρ ; pension = capital / facteur de rente
   * (coefficient de conversion fixé par l'espérance de vie de la génération, ici D ans).
   */
  function compteNotionnel(brut, rho, anneesCarriere, D) {
    var n = anneesCarriere || 43, K = 0, y;
    for (y = 0; y < n; y++) K += C.tauxCotisation / 100 * brut * Math.pow(1 + rho, n - y);
    var pension = K / facteurRente(rho, D || C.D);
    return { capital: K, pensionAn: pension, pensionMois: pension / 12, coefficientConversion: 1 / facteurRente(rho, D || C.D) };
  }

  /**
   * Effet redistributif de la conversion actuarielle : à capital égal, la rente est fixée sur l'espérance de
   * vie moyenne (Dmoy) ; la valeur viagère reçue dépend de la durée réelle (Dreelle). Rapport > 1 = gagnant.
   */
  function transfertLongevite(Dreelle, Dmoy, rho) {
    return facteurRente(rho, Dreelle) / facteurRente(rho, Dmoy);
  }

  function copie(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  var API = { CONSTANTES: C, SCENARIOS: SCENARIOS, PROFILS: PROFILS, scenario: scenario, profilPoints: profilPoints,
    facteurRente: facteurRente, compartiment: compartiment, doubleCharge: doubleCharge, pensionSalarie: pensionSalarie,
    dispersionSalarie: dispersionSalarie, stressSalarie: stressSalarie, compteNotionnel: compteNotionnel,
    transfertLongevite: transfertLongevite, generateur: generateur, quantile: quantile };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.RetraitesCapi = API;
})(this);
