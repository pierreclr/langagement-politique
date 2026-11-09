/*
 * modeles/systeme-ideal/age_sante.js — T47, effet de l'âge sur la dépense de santé et de dépendance (01/11/2026). Fonctions pures au-dessus de demographie.js, palier1.js,
 * trajectoires_age.js (généré par generer_age_sante.py : population par âge simple et espérance de vie à 65 ans, trois scénarios). Hypothèses H153 à H162 : methode.md § 18.
 * Charger dans l'ordre : modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js.
 *
 * Principe (méthode de l'Ageing Report 2024 de la Commission européenne, version « euros constants, sans croissance ») :
 *   dépense(t) = dépense 2025 × [ Σ_âge profil(âge − δ_t) × population(âge, t) ] / [ Σ_âge profil(âge) × population(âge, 2025) ],
 *   δ_t = part × (espérance de vie à 65 ans en t − en 2025) : décalage du profil quand une part des années de vie gagnées l'est en bonne santé
 *   (part = 1 « bonne santé », 0,5 central = base de l'Ageing Report, 0 « pas de bonne santé »).
 * Santé : profil = remboursement moyen de l'assurance maladie par classe d'âge (DREES, 2023) ; niveau 2025 = CSBM financée par la Sécurité sociale (201,6 Md€).
 * Dépendance : profil = taux de dépendance par âge (EU-SILC, Ageing Report 2024, table I.AIII.4, France) à coût public uniforme par personne dépendante (⚠️) ;
 *   niveau 2025 = 1,9 % du PIB (Ageing Report 2024, France) × PIB 2025 du modèle.
 * Ce que le module ne compte PAS (biais favorable) : élasticité-revenu et progrès technique (non démographiques), hausse du coût unitaire des soins, maladies de fin de vie au-delà du décalage.
 * Des ordres de grandeur, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var DG = root.DemographieSI || (typeof require !== 'undefined' ? require('./demographie.js') : null);
  var P1 = root.Palier1 || (typeof require !== 'undefined' ? require('./palier1.js') : null);
  var TA = root.TrajectoiresAge || (typeof require !== 'undefined' ? require('./trajectoires_age.js') : null);
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var S = root.Sante || (typeof require !== 'undefined' ? require('./sante.js') : null);
  var AN0 = 2025;

  // ---------- Données (sources : sources/recherche-sante-vieillissement.md)
  var DONNEES = {
    // DREES, jeu « depenses-de-sante-et-restes-a-charge », millésime 2023, poste _Total, tous régimes confondus : [âge min, âge max, remboursement AMO moyen €, dépenses totales moyennes €, personnes]
    classes: [[0, 10, 925, 1211, 8216128], [11, 20, 887, 1345, 8186259], [21, 30, 1134, 1503, 7938340], [31, 40, 1477, 1944, 8390307], [41, 50, 1713, 2328, 8488253],
      [51, 60, 2557, 3324, 8912890], [61, 70, 3822, 4684, 7991246], [71, 79, 5587, 6616, 6355648], [80, 100, 7858, 9009, 3975523]],
    ensemble: { amo: 2496, total: 3124, personnes: 68454594 },
    csbmSecu2025: S ? S.DONNEES.csbmSecu2025 : 201.64,   // Md€, DREES comptes de la santé 2025 (provisoire)
    // Ageing Report 2024 (Institutional Paper 279), France : taux de dépendance EU-SILC par âge (%), table I.AIII.4 ; âge central de chaque classe (milieu de classe ; 85+ : 89)
    dependance: [[2, 0.4], [7, 0.5], [13, 2.3], [20, 2.2], [29.5, 3.0], [39.5, 5.0], [49.5, 8.5], [59.5, 9.8], [69.5, 13.5], [79.5, 23.3], [89, 39.5]],
    ltcPibPct2025: 1.9,                                   // Ageing Report 2024, France, table II.1.114 : dépense publique de dépendance, % du PIB, 2022 et 2025 (baseline)
    pib2025: M.DONNEES.pib,                               // Md€, modèle (modele.js)
    // Ageing Report 2024, France, % du PIB (tables II.1.107 à II.1.111 et II.1.114 à II.1.120) : repères de comparaison, non utilisés dans le calcul
    arSante: { baseline: { 2025: 8.4, 2035: 8.7, 2045: 8.9, 2065: 9.0, 2070: 9.1 }, demographique: { 2025: 8.4, 2035: 8.6, 2045: 8.8, 2065: 8.9, 2070: 8.9 },
      bonneSante: { 2025: 8.4, 2035: 8.5, 2045: 8.6, 2065: 8.6, 2070: 8.6 }, pasBonneSante: { 2025: 8.4, 2035: 8.8, 2045: 9.1, 2065: 9.5, 2070: 9.6 } },
    arLtc: { baseline: { 2025: 1.9, 2035: 2.1, 2045: 2.3, 2065: 2.5, 2070: 2.6 }, bonneSante: { 2025: 1.9, 2035: 2.1, 2045: 2.3, 2065: 2.4, 2070: 2.5 },
      pasBonneSante: { 2025: 1.9, 2035: 2.2, 2045: 2.4, 2065: 2.7, 2070: 2.7 } },
    // Ageing Report 2024, fiche France (Trésor, 15/12/2023), tableau 3 (Eurostat EUROPOP2023) : population totale, milliers ; interpolée linéairement (repère de comparaison)
    popEurostat: { 2022: 68050, 2030: 69453, 2040: 70557, 2050: 70623, 2060: 70076, 2070: 69660 }
  };
  var PART = { bas: 1, central: 0.5, haut: 0 };   // part des années de vie gagnées passée en bonne santé, par scénario (H157)

  function pop(sc, annee) {
    var s = TA.scenarios[sc];
    if (!s) throw new Error('scénario inconnu : ' + sc);
    var l = s.pop[annee - AN0];
    if (!l) throw new Error('année hors trajectoire (2025-2070) : ' + annee);
    return l;
  }
  function e65(sc, annee) { return TA.scenarios[sc].e65[annee - AN0]; }

  /** Interpolation linéaire par morceaux sur des nœuds [[âge, valeur], ...] triés ; constante au-delà des extrémités. */
  function interp(noeuds, a) {
    if (a <= noeuds[0][0]) return noeuds[0][1];
    var n = noeuds.length;
    if (a >= noeuds[n - 1][0]) return noeuds[n - 1][1];
    for (var i = 1; i < n; i++) if (a <= noeuds[i][0]) return noeuds[i - 1][1] + (noeuds[i][1] - noeuds[i - 1][1]) * (a - noeuds[i - 1][0]) / (noeuds[i][0] - noeuds[i - 1][0]);
  }

  /** Nœuds du profil de santé : âge moyen de chaque classe en 2025 (central) pondéré par la population, valeur = remboursement AMO (ou dépenses totales si champ = 'total'). */
  var noeudsCache = {};
  function noeudsSante(champ) {
    champ = champ || 'amo';
    if (noeudsCache[champ]) return noeudsCache[champ];
    var p = pop('central', AN0), col = champ === 'total' ? 3 : 2;
    noeudsCache[champ] = DONNEES.classes.map(function (c) {
      var s = 0, w = 0;
      for (var x = c[0]; x <= c[1]; x++) { s += x * p[x]; w += p[x]; }
      return [s / w, c[col]];
    });
    return noeudsCache[champ];
  }

  function profilSante(age, champ) { return interp(noeudsSante(champ), age); }
  function profilDependance(age) { return interp(DONNEES.dependance, age); }

  /** Décalage du profil, en années, au scénario sc et à l'année t : part × (espérance de vie à 65 ans de t − celle de 2025). part : défaut selon le scénario (H157). */
  function decalage(sc, annee, part) {
    var pt = part === undefined ? PART[sc] : part;
    return pt * (e65(sc, annee) - e65(sc, AN0));
  }

  /** Somme pondérée Σ profil(âge − δ) × population(âge, t). */
  function masse(profil, sc, annee, delta, champ) {
    var p = pop(sc, annee), s = 0;
    for (var x = 0; x < p.length; x++) s += profil(x - delta, champ) * p[x];
    return s;
  }

  /** Indice de la population totale (2025 = 1) du scénario sc à l'année t. */
  function indicePop(sc, annee) {
    var p = pop(sc, annee), p0 = pop(sc, AN0), n = 0, n0 = 0;
    for (var x = 0; x < p.length; x++) { n += p[x]; n0 += p0[x]; }
    return n / n0;
  }

  /**
   * Indices (2025 = 1) de la dépense de santé et de dépendance : p = { part (défaut du scénario), champ ('amo' défaut | 'total'), lambda (défaut 1) }.
   * lambda = aplatissement du profil de santé : le profil devient m + lambda × (profil − m), m = moyenne 2025 ; seul l'effet de structure par âge est multiplié par lambda
   * (l'effet de volume de la population totale ne change pas) ; lambda = lambdaCommission() donne la variante « méthode Commission » (écart expliqué dans resultats.md § 17.bis, F).
   */
  function indices(sc, annee, p) {
    p = p || {};
    var d = decalage(sc, annee, p.part), lam = p.lambda === undefined ? 1 : p.lambda, iS = masse(profilSante, sc, annee, d, p.champ) / masse(profilSante, sc, AN0, 0, p.champ);
    if (lam !== 1) { var ip = indicePop(sc, annee); iS = ip + lam * (iS - ip); }
    return { delta: d,
      sante: iS,
      dependance: masse(profilDependance, sc, annee, d) / masse(profilDependance, sc, AN0, 0) };
  }

  /** Dépenses publiques en Md€ (euros constants de 2025) à l'année t : santé (niveau : CSBM Sécurité sociale 2025), dépendance (niveau : 1,9 % du PIB, ou p.baseDependance en Md€) et variations par rapport à 2025. */
  function depenses(sc, annee, p) {
    p = p || {};
    var i = indices(sc, annee, p), bS = DONNEES.csbmSecu2025, bD = p.baseDependance !== undefined ? p.baseDependance : DONNEES.ltcPibPct2025 / 100 * DONNEES.pib2025;
    return { annee: annee, scenario: sc, indices: i, baseSante: bS, baseDependance: bD, sante: bS * i.sante, dependance: bD * i.dependance,
      varSante: bS * (i.sante - 1), varDependance: bD * (i.dependance - 1), variation: bS * (i.sante - 1) + bD * (i.dependance - 1) };
  }


  /**
   * Repère de comparaison tiré de l'Ageing Report 2024 (France) : indice de dépense en euros constants déduit du ratio dépense/PIB de l'année t sur celui de 2025 (interpolé entre 2025, 2035, 2045, 2065, 2070),
   * multiplié par l'indice de population totale (le ratio dépense/PIB rapporte la dépense à un PIB qui, à productivité constante, suit la population totale ; les coûts par tête y sont exprimés en % du PIB par tête).
   * Santé : scénario « démographique » (moitié des années gagnées en bonne santé, sans élasticité-revenu). Dépendance : scénario de base, qui inclut des facteurs non démographiques (⚠️ pas un effet d'âge pur).
   */
  function repereAR(sc, annee) {
    function val(tab, a) {
      var ks = Object.keys(tab).map(Number).sort(function (x, y) { return x - y; });
      return interp(ks.map(function (k) { return [k, tab[k]]; }), a);
    }
    var ip = indicePop(sc, annee), A = DONNEES, rS = val(A.arSante.demographique, annee) / val(A.arSante.demographique, AN0);
    var pe = interp(Object.keys(A.popEurostat).map(Number).sort(function (x, y) { return x - y; }).map(function (k) { return [k, A.popEurostat[k]]; }), annee) /
      interp(Object.keys(A.popEurostat).map(Number).sort(function (x, y) { return x - y; }).map(function (k) { return [k, A.popEurostat[k]]; }), AN0);
    // parTete : indice du ratio dépense/PIB (= effet de structure par âge, indépendant du niveau de la population) ; santeEurostat : même repère avec la population Eurostat de la Commission (et non celle de l'Insee)
    return { sante: rS * ip, santeEurostat: rS * pe, parTete: rS, dependance: val(A.arLtc.baseline, annee) / val(A.arLtc.baseline, AN0) * ip, indicePopulation: ip, indicePopulationEurostat: pe };
  }

  /**
   * Aplatissement du profil de santé qui ramène notre effet de structure par âge (central, population Insee) à celui de la Commission (scénario démographique, France, ratio dépense/PIB),
   * moyenne des années 2035 et 2045 (la structure par âge de l'Insee 2026 et celle d'Eurostat 2023 y sont proches : 65 ans et plus / 20-64 ans 50,3 contre 50,1 en 2040). Au-delà, l'Insee vieillit plus vite.
   * ⚠️ résumé d'un écart, pas une explication : le profil par âge de la France de la Commission n'est pas publié sous forme de tableau.
   */
  function lambdaCommission() {
    var r = [2035, 2045].map(function (a) { return (repereAR('central', a).parTete - 1) / (indices('central', a).sante / indicePop('central', a) - 1); });
    return (r[0] + r[1]) / 2;
  }

  /** Variante « méthode Commission » : mêmes calculs avec le profil aplati de lambdaCommission() (santé seulement ; la dépendance reste celle de H155). */
  function depensesCommission(sc, annee, p) {
    var q = {}; for (var k in (p || {})) q[k] = p[k];
    if (q.lambda === undefined) q.lambda = lambdaCommission();
    return depenses(sc, annee, q);
  }

  /** Solde du palier 1 (demographie.js) à l'année t, puis avec la dépense de santé et de dépendance liée à l'âge : { sans, avec, effet, ... }. p : options de demographie.solde + de depenses. */
  function solde(st, sc, annee, p) {
    p = p || {};
    var s = DG.solde(st, sc, annee, p), d = depenses(sc, annee, p);
    // Si le reste du budget est indexé (p.reste 'pib' ou 'productivite'), le coût unitaire des soins suit la productivité, comme dans la méthode de la Commission (ratio dépense/PIB) : la variation liée à l'âge est multipliée par (1+g)^k.
    var f = (p.reste === 'pib' || p.reste === 'productivite') ? Math.pow(1 + (p.g || 0), annee - AN0) : 1, eff = d.variation * f;
    return { annee: annee, scenario: sc, sans: s.solde, avec: s.solde - eff, effet: -eff, depenses: d, demo: s, facteurUnitaire: f };
  }

  /** Socle finançable (€/mois par adulte non retraité) avec la dépense liée à l'âge : même définition que demographie.socleFinancable (H151). */
  function socleFinancable(st, sc, annee, p) {
    var s = solde(st, sc, annee, p), pente = DG.pente(st, annee, s.demo, p);
    return Math.max(0, st.socle + (s.avec - s.demo.base) / pente);
  }

  /** Tableau de synthèse : pour chaque scénario et chaque année, solde sans / avec et socle finançable sans / avec. */
  function resume(st, annees, p) {
    annees = annees || [2035, 2045, 2065];
    var out = {};
    ['bas', 'central', 'haut'].forEach(function (sc) {
      out[sc] = annees.map(function (a) { var s = solde(st, sc, a, p); s.socleSans = DG.socleFinancable(st, sc, a, p); s.socleAvec = socleFinancable(st, sc, a, p); return s; });
    });
    return out;
  }

  var API = { DONNEES: DONNEES, PART: PART, pop: pop, e65: e65, interp: interp, noeudsSante: noeudsSante, profilSante: profilSante, profilDependance: profilDependance, decalage: decalage,
    masse: masse, indicePop: indicePop, repereAR: repereAR, lambdaCommission: lambdaCommission, depensesCommission: depensesCommission, indices: indices, depenses: depenses, solde: solde, socleFinancable: socleFinancable, resume: resume };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.AgeSante = API;
})(this);
