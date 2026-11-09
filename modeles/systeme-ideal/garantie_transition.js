/*
 * modeles/systeme-ideal/garantie_transition.js — GARANTIE DE TRANSITION et ARRÊTS MALADIE (proposition de l'auteur du 07/11/2026, arbitrage 56 ; NON ADOPTÉE).
 * Dossier : sources/garantie-transition.md (hypothèses HGT1 à HGT30, vérifications V19800 à V19899). Module autonome (aucune dépendance) ; fonctions pures.
 *
 * La garantie remplace l'assurance chômage (ARE, ASP-CSP, ATI, aides associées), la rupture conventionnelle et le licenciement économique :
 *   - au jour où le revenu d'activité s'arrête, la personne garde 100 % de son revenu de référence (net du nouveau système), puis le montant baisse
 *     un peu chaque jour (courbe continue, pas de palier) jusqu'au plancher du système (877 €/mois pour une personne seule), atteint en T mois ;
 *     G(t) = P + (p0 × Ref − P) × g(t / T),  g(x) = (e^(−λx) − e^(−λ)) / (1 − e^(−λ))  (λ → 0 : droite ; λ > 0 : baisse rapide au début ; λ < 0 : baisse lente au début) ;
 *   - Ref = moyenne glissante pondérée des revenus nets d'activité des 24 derniers mois hors mois passés en garantie (poids linéaires, le plus récent pèse 24, le plus ancien 1) ;
 *   - « horloge » k : chaque mois en garantie avance k d'un mois ; chaque mois d'activité la recule de ρ (droits qui remontent avec l'intérim et les petits boulots) ;
 *   - en activité pendant la garantie : la personne touche son revenu net plus la moitié de l'écart éventuel avec G (travailler rapporte toujours).
 * Le coût budgétaire de la garantie est la part versée AU-DESSUS du plancher (le plancher est déjà compté dans le bilan, lignes du socle et du filet).
 *
 * Arrêts maladie (précision de l'auteur du 07/11/2026) : même circuit ; arrêts courts sur simple déclaration de la personne, sans jour de carence ni subrogation par l'employeur ;
 * le médecin ne déclare (directement au système) que les arrêts longs et les affections de longue durée.
 *
 * Charger (jsc) depuis ce dossier :
 *   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc garantie_transition.js test_garantie_transition.js
 *   (tableaux : rapport_garantie_transition.js à la place du test, sortie dans resultats_garantie_transition.txt ; la dernière ligne EXPORT va dans bilan_global.py)
 */
(function (root) {
  'use strict';

  // ======================================================================
  // 0. Paramètres (sources : sources/garantie-transition.md)
  // ======================================================================
  var HYP = {
    // Fonction des revenus de la base de travail du 06/11/2026 (decisions_0611_v74.js)
    bareme: { S: 412.5, mInf: 0.65, m0: 0.20, K: 1500, P: 877, alpha: 0.25 },
    // Coût employeur (nouveau R) selon le brut actuel : cas OpenFisca du dépôt (systeme-en-une-page.md § 2), hors mutuelle ; + part employeur de mutuelle reversée (46,40 × 1,08)
    coutEmployeur: { points: [[1867.02, 1940.99], [3000, 3943.98], [10000, 14161.89]], mutuelle: 50.11 },   // HGT3 ⚠️ V19805
    netSurBrutActuel: 0.78,   // HGT4 : salaire net actuel ≈ 78 % du brut (ordre de grandeur, non-cadre ; sert aux taux de remplacement actuels) ⚠️ V19806
    // ARE (Unédic, Paramètres utiles, juillet 2026 : montants du 01/07/2025, non revalorisés au 01/07/2026)
    are: { fixe: 13.18, taux1: 0.404, taux2: 0.57, plafondTaux: 0.75, mini: 32.13, maxJour: 300.21, degSeuil: 92.57, degCoef: 0.7, degMois: 7,
           retraite: 0.03, csg: 0.062, crds: 0.005, abattement: 0.9825, seuilCsg: 61, jours: 30, dureeMax: 18 },
    // Complément dégressif du modèle (modele.js, CHOMAGE_DEG.deg2 ; ligne D02 du bilan : 12,5605 Md€)
    complementModele: { paliers: [[3, 0.6], [6, 0.4], [12, 0.2]], plafondNet: 3000, coutBilan: 12.5605 },
    // Calibration de la population actuelle (HGT6 à HGT10)
    population: {
      stock: 2.62e6,            // allocataires indemnisés, moyenne 2025 (Unédic, prévisions d'octobre 2026, tableau 3 : 2 624 000)
      cout: 37.1,               // allocations brutes et aides 2024 (Unédic, tableau 4 ; 37,2 en 2025) = ligne D02
      consommation: 0.64,       // part des droits consommée : 60 % (droits interrompus 2023), deux tiers après la réforme de 2023 (Unédic, juin et décembre 2025) ; HGT7
      dureesPotentielles: [[6, 0.12], [12, 0.23], [18, 0.55], [22.5, 0.05], [27, 0.05]],   // moyenne 15,9 mois ≈ 16 mois (Unédic, déc. 2025 : 476 jours) ; 40 % à 18 mois ; HGT8 ⚠️ V19807
      phi: 0.95,                // part de l'allocation pleine réellement versée (cumul avec une activité) : 1 048 € moyens contre ≈ 1 105 € hors cumul (Unédic, indicateurs mars 2026) ; HGT9
      sigma: 0.5,               // dispersion (log) du salaire brut de référence ; HGT10 ⚠️ V19808
      n: 60                     // points de quantile
    },
    // Ouverture (HGT14 à HGT17), entrants par mois : [bas, central, haut] du coût (bas = coût le plus faible)
    demissionnaires: { entrants: [20000, 33000, 60000], h: 0.08, facteurRef: 1.1 },   // ⚠️ V19815-V19816
    independants: { entrants: [4000, 8300, 16700], h: 0.06, medianeR: 2500, sigma: 0.7 },   // ⚠️ V19817-V19818
    // Comportement (HGT18 à HGT22) : [bas, central, haut] des réactions ; bas = réactions faibles
    comportement: {
      epsD: [0.15, 0.30, 0.70],     // durée / niveau (Le Barbanchon-Rathelot-Roulet ; CAE n° 90 : 0,3 ; comité d'évaluation 2019-2021 : 0,4-0,7 imputé au montant)
      epsPD: [0.15, 0.27, 0.40],    // durée / durée potentielle (CAE n° 90 : 0,27 ; Schmieder et von Wachter : médiane 0,37)
      epsE: [0, 0.10, 0.10],        // entrées / niveau (CAE n° 90)
      eviction: [0.5, 0.25, 0],     // part du retour à l'emploi prise à d'autres chômeurs (Lalive, Landais, Zweimüller 2015 ; Crépon et al. 2013) ⚠️ V19820
      borne: 0.7,                   // pas d'extrapolation au-delà de ±30 % (modele.js, H211)
      horizon: 36                   // mois de non-emploi comptés pour l'effet sur les recettes et le plancher
    },
    rho: 0.5,        // HGT12 : un mois d'activité rend un demi-mois de courbe ⚠️ V19811
    cumul: 0.5,      // HGT13 : en activité pendant la garantie, chaque euro net gagné au-dessus du plancher retire 50 centimes de supplément
    fenetre: 24      // HGT11 : fenêtre de la moyenne glissante (mois)
  };

  // ======================================================================
  // 1. Fonction des revenus du nouveau système (personne seule)
  // ======================================================================
  function contribution(R, b) { b = b || HYP.bareme; return b.mInf * R - b.S - (b.mInf - b.m0) * b.K * (1 - Math.exp(-R / b.K)); }
  function filet(R, b) { b = b || HYP.bareme; var c0 = b.P - b.S; if (R <= 0) return c0; return Math.max(0, c0 - b.alpha * (R - (contribution(R, b) + b.S))); }
  /** Revenu net (€/mois) d'une personne seule de revenu R (coût employeur ou revenu total d'indépendant) : R − C(R) + filet. N(0) = P. */
  function netNouveau(R, b) { return R - contribution(R, b) + filet(R, b); }
  /** Coût employeur (R du nouveau système) d'un salaire brut actuel, part employeur de mutuelle reversée comprise (HGT3). */
  function coutEmployeur(brut) {
    var p = HYP.coutEmployeur.points, r;
    if (brut <= p[0][0]) r = p[0][1] / p[0][0];
    else if (brut >= p[p.length - 1][0]) r = p[p.length - 1][1] / p[p.length - 1][0];
    else { for (var i = 1; i < p.length; i++) if (brut <= p[i][0]) { var a = p[i - 1], c = p[i], u = (brut - a[0]) / (c[0] - a[0]); r = (1 - u) * a[1] / a[0] + u * c[1] / c[0]; break; } }
    return brut * r + HYP.coutEmployeur.mutuelle;
  }
  function refDeBrut(brut) { return netNouveau(coutEmployeur(brut)); }

  // ======================================================================
  // 2. Règles actuelles : ARE (montants du 01/07/2025)
  // ======================================================================
  function sjr(brutMensuel) { return brutMensuel * 12 / 365; }
  /** Allocation journalière brute (€) : le plus favorable de 40,4 % SJR + 13,18 € et 57 % SJR, au moins 32,13 €, au plus 75 % du SJR et 300,21 €. */
  function areJour(s) { var a = HYP.are; return Math.min(a.maxJour, Math.min(a.plafondTaux * s, Math.max(a.taux1 * s + a.fixe, a.taux2 * s, a.mini))); }
  /** Brut journalier au mois m (dégressivité de 30 % au 7e mois si AJ > 92,57 €, moins de 55 ans, sans descendre sous 92,57 €). */
  function areJourMois(s, m, age) { var a = HYP.are, aj = areJour(s); if ((age || 40) < 55 && m >= a.degMois && aj > a.degSeuil) aj = Math.max(a.degSeuil, a.degCoef * aj); return aj; }
  /** Net journalier : retenue retraite de 3 % du SJR (sans descendre sous 32,13 €), CSG 6,2 % et CRDS 0,5 % sur 98,25 % (sans descendre sous 61 €, rien sous 61 €). */
  function areNetJour(s, aj) {
    var a = HYP.are, x = aj, ret = Math.min(a.retraite * s, Math.max(0, x - a.mini)); x -= ret;
    if (aj > a.seuilCsg) x -= Math.min((a.csg + a.crds) * a.abattement * aj, Math.max(0, x - a.seuilCsg));
    return x;
  }
  /** ARE nette du mois m (€/mois, 30 jours), 0 au-delà de la durée de droits. */
  function areNetMois(brutMensuel, m, duree, age) { var s = sjr(brutMensuel); if (m > (duree || HYP.are.dureeMax)) return 0; return HYP.are.jours * areNetJour(s, areJourMois(s, m, age)); }
  function areBrutMois(brutMensuel, m, duree, age) { var s = sjr(brutMensuel); if (m > (duree || HYP.are.dureeMax)) return 0; return HYP.are.jours * areJourMois(s, m, age); }

  /** Complément dégressif du modèle actuel (deg2) au mois m : plancher + part × (min(net, 3 000) − socle). */
  function complementModele(ref, m) {
    var c = HYP.complementModele, b = HYP.bareme, i;
    for (i = 0; i < c.paliers.length; i++) if (m <= c.paliers[i][0]) return c.paliers[i][1] * Math.max(0, Math.min(ref, c.plafondNet) - b.S);
    return 0;
  }

  // ======================================================================
  // 3. La courbe de la garantie
  // ======================================================================
  /** Forme g(x) sur [0, 1] : g(0) = 1, g(1) = 0 ; 0 au-delà. */
  function forme(x, lam) {
    if (x >= 1) return 0; if (x <= 0) return 1;
    if (Math.abs(lam) < 1e-9) return 1 - x;
    return (Math.exp(-lam * x) - Math.exp(-lam)) / (1 - Math.exp(-lam));
  }
  /** Intégrale de g entre a et b (a < b, en unités de x). */
  function integraleForme(a, b, lam) {
    a = Math.max(0, Math.min(1, a)); b = Math.max(0, Math.min(1, b)); if (b <= a) return 0;
    if (Math.abs(lam) < 1e-9) return (b - a) - (b * b - a * a) / 2;
    return ((Math.exp(-lam * a) - Math.exp(-lam * b)) / lam - (b - a) * Math.exp(-lam)) / (1 - Math.exp(-lam));
  }
  /** Montant journalier (taux mensuel) au temps t (mois, continu) depuis l'arrêt du revenu. v = { p0, T, lam }. */
  function garantieInstant(ref, t, v) { var P = HYP.bareme.P, base = Math.max(0, v.p0 * ref - P); return P + base * forme(t / v.T, v.lam); }
  /** Supplément au-dessus du plancher, moyenne du mois qui va de k à k + 1 (horloge en mois). */
  function supplementMois(ref, k, v) { var P = HYP.bareme.P, base = Math.max(0, v.p0 * ref - P); return base * integraleForme(k / v.T, (k + 1) / v.T, v.lam) * v.T; }
  /** Total versé (plancher compris) au mois m = 1, 2, … d'une garantie ininterrompue. */
  function garantieMois(ref, m, v) { return HYP.bareme.P + supplementMois(ref, m - 1, v); }

  // ======================================================================
  // 4. Moyenne glissante et parcours mois par mois
  // ======================================================================
  /**
   * Revenu de référence : hist = [{ y: revenu net du mois, transition: bool }], du plus ancien au plus récent. On garde les `fenetre` derniers mois hors mois en garantie ;
   * poids linéaires (le plus récent pèse `fenetre`, le plus ancien 1) ; un mois sans activité et sans garantie compte pour 0 ; s'il manque des mois, ils comptent pour 0.
   */
  function referenceGlissante(hist, fenetre) {
    var W = fenetre || HYP.fenetre, mois = [], i;
    for (i = hist.length - 1; i >= 0 && mois.length < W; i--) if (!hist[i].transition) mois.push(hist[i].y);
    var s = 0, sw = 0; for (i = 0; i < W; i++) { var w = W - i; sw += w; s += w * (i < mois.length ? mois[i] : 0); }
    return s / sw;
  }
  /**
   * Parcours : passe = revenus R (coût employeur) des mois précédant la perte (au moins 24) ; futur = R mois par mois après la perte (0 = sans activité).
   * Règles (HGT11 à HGT13) :
   *   - mois sans activité : supplément de la courbe entre k et k + 1, puis k avance d'un mois ;
   *   - mois d'activité pendant un épisode : la courbe est figée en k ; supplément = max(0, X(k) − c × (revenu net − P)) (c = 0,5 : chaque euro net gagné au-dessus du plancher
   *     ne retire que 50 centimes, travailler rapporte toujours plus que rester sans activité) ; l'horloge recule de ρ × (revenu net − P) / (Ref − P), au plus ρ ;
   *   - au retour sans activité, Ref = max(Ref de l'épisode, moyenne glissante recalculée) : les petits boulots peuvent faire remonter la référence, jamais la baisser ;
   *   - l'épisode se ferme quand l'horloge revient à 0 (la référence suivante repart de la moyenne glissante seule).
   * Renvoie, par mois : revenu total, supplément versé, horloge, référence.
   */
  function parcours(passe, futur, v, o) {
    o = o || {}; var rho = o.rho === undefined ? HYP.rho : o.rho, c = o.cumul === undefined ? HYP.cumul : o.cumul, P = HYP.bareme.P;
    var hist = passe.map(function (R) { return { y: R > 0 ? netNouveau(R) : 0, transition: false }; }), k = 0, ref = null, out = [];
    futur.forEach(function (R, i) {
      if (R > 0) {
        var n = netNouveau(R), sup = 0;
        if (ref !== null) {
          sup = Math.max(0, supplementMois(ref, k, v) - c * Math.max(0, n - P));
          k = Math.max(0, k - rho * Math.min(1, Math.max(0, (n - P) / Math.max(1, ref - P))));
          if (k === 0) ref = null;
        }
        hist.push({ y: n, transition: false });
        out.push({ mois: i + 1, activite: R, total: n + sup, supplement: sup, horloge: k, ref: ref });
      } else {
        var nouvelle = referenceGlissante(hist); ref = ref === null ? nouvelle : Math.max(ref, nouvelle);
        var s2 = supplementMois(ref, k, v); k += 1;
        hist.push({ y: 0, transition: true });
        out.push({ mois: i + 1, activite: 0, total: P + s2, supplement: s2, horloge: k, ref: ref });
      }
    });
    return out;
  }
  /** ARE actuelle sur le même parcours (brut actuel), avec cumul ARE-salaire (ARE − 70 % du brut repris ; jours non versés reportés), puis plancher (RSA + aide au logement ≈ 877 €, HGT5). */
  function parcoursARE(brutRef, futurBrut, o) {
    o = o || {}; var s = sjr(brutRef), droits = (o.duree || HYP.are.dureeMax) * 30, consommes = 0, P = HYP.bareme.P, out = [];
    futurBrut.forEach(function (b, i) {
      var mIndem = Math.floor(consommes / 30) + 1, aj = areJourMois(s, mIndem, o.age), net = areNetJour(s, aj) / aj;   // ratio net / brut du jour
      if (droits - consommes <= 0) { out.push({ mois: i + 1, total: b > 0 ? b * HYP.netSurBrutActuel : P, are: 0 }); return; }
      if (b > 0) {
        var verse = Math.max(0, Math.min(30 * aj, 30 * aj - 0.7 * b)), j = Math.min(verse / aj, droits - consommes);
        consommes += j; out.push({ mois: i + 1, total: b * HYP.netSurBrutActuel + j * aj * net, are: j * aj * net });
      } else {
        var j2 = Math.min(30, droits - consommes); consommes += j2;
        var a2 = j2 * aj * net + (30 - j2) / 30 * P; out.push({ mois: i + 1, total: Math.max(a2, j2 < 30 ? P : 0), are: j2 * aj * net });
      }
    });
    return out;
  }

  // ======================================================================
  // 5. Population : calibration sur l'assurance chômage actuelle
  // ======================================================================
  function invNorm(p) {   // Acklam
    var a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239],
        b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572],
        c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783],
        d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416], q, r;
    if (p < 0.02425) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - 0.02425) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  function quantiles(mediane, sigma, n) { var out = []; for (var i = 0; i < n; i++) out.push({ x: mediane * Math.exp(sigma * invNorm((i + 0.5) / n)), w: 1 / n }); return out; }
  function survie(h, m) { return Math.pow(1 - h, m - 1); }
  function moisConsommes(h, D) { var s = 0, m; for (m = 1; m <= Math.ceil(D); m++) s += survie(h, m) * Math.min(1, D - (m - 1)); return s; }
  function bisect(f, a, b, tol) { var fa = f(a); for (var i = 0; i < 200; i++) { var c = (a + b) / 2, fc = f(c); if ((fc > 0) === (fa > 0)) { a = c; fa = fc; } else b = c; if (b - a < tol) break; } return (a + b) / 2; }

  /** Coût annuel (Md€) de l'ARE brute pour une population donnée (entrants par mois E, aléa de sortie h, quantiles de brut). */
  function coutARE(E, h, pts, Dmix, phi) {
    var tot = 0;
    pts.forEach(function (p) { Dmix.forEach(function (d) { var s = 0, m; for (m = 1; m <= Math.ceil(d[0]); m++) s += survie(h, m) * Math.min(1, d[0] - (m - 1)) * areBrutMois(p.x, m, 99); tot += p.w * d[1] * s; }); });
    return 12 * E * phi * tot / 1e9;
  }
  var _cal = null;
  /** Calibration : h (consommation des droits), E (stock), médiane du brut de référence (coût). */
  function calibration() {
    if (_cal) return _cal;
    var Pp = HYP.population, Dmix = Pp.dureesPotentielles, Dm = Dmix.reduce(function (a, d) { return a + d[0] * d[1]; }, 0);
    var conso = function (h) { return Dmix.reduce(function (a, d) { return a + d[1] * moisConsommes(h, d[0]); }, 0) / Dm; };
    var h = bisect(function (x) { return conso(x) - Pp.consommation; }, 1e-4, 0.5, 1e-9);
    var dMoy = Dmix.reduce(function (a, d) { return a + d[1] * moisConsommes(h, d[0]); }, 0), E = Pp.stock / dMoy;
    var med = bisect(function (x) { return coutARE(E, h, quantiles(x, Pp.sigma, Pp.n), Dmix, Pp.phi) - Pp.cout; }, 500, 6000, 1e-6);
    var pts = quantiles(med, Pp.sigma, Pp.n);
    _cal = { h: h, E: E, entrantsAn: 12 * E, dureeMoyenne: dMoy, dureePotentielle: Dm, mediane: med, pts: pts, coutARE: coutARE(E, h, pts, Dmix, Pp.phi),
             areMoyenneBrute: Pp.cout * 1e9 / Pp.stock / 12 };
    return _cal;
  }

  // ======================================================================
  // 6. Coût de la garantie (supplément au-dessus du plancher), avec comportement
  // ======================================================================
  /** Taux de remplacement moyen sur les 12 premiers mois (pondéré par la survie de référence) : actuel (ARE nette / net actuel) et garantie (G / Ref). */
  function generosite(v, cal) {
    var Dmix = HYP.population.dureesPotentielles, a = 0, b = 0, w = 0;
    cal.pts.forEach(function (p) {
      var ref = refDeBrut(p.x), netA = p.x * HYP.netSurBrutActuel;
      for (var m = 1; m <= 12; m++) {
        var s = survie(cal.h, m), ar = 0; Dmix.forEach(function (d) { ar += d[1] * (m <= d[0] ? areNetMois(p.x, m, 99) : HYP.bareme.P); });
        var gm = 0; variantes(v).forEach(function (x) { gm += x[1] * garantieMois(ref, m, x[0]); });
        a += p.w * s * ar / netA; b += p.w * s * gm / ref; w += p.w * s;
      }
    });
    return { actuel: a / w, garantie: b / w, r: (b / w) / (a / w) };
  }
  function niveau(sc) { return { bas: 0, central: 1, haut: 2 }[sc === undefined ? 'central' : sc]; }
  /** Facteur de durée q et d'entrées e de la réaction de comportement. */
  function reaction(v, cal, sc) {
    var C = HYP.comportement, i = niveau(sc);
    if (sc === 'aucun') return { q: 1, e: 1, r: 1, eviction: 0 };
    var Tm = variantes(v).reduce(function (a, x) { return a + x[1] * x[0].T; }, 0);
    var g = generosite(v, cal), q = Math.pow(g.r, C.epsD[i]) * Math.pow(Tm / cal.dureePotentielle, C.epsPD[i]), qb = Math.min(1 / C.borne, Math.max(C.borne, q));
    return { q: qb, qBrut: q, e: Math.pow(Math.min(1 / C.borne, Math.max(C.borne, g.r)), C.epsE[i]), r: g.r, rr: g, eviction: C.eviction[i] };
  }
  /** Supplément cumulé par entrant (€) pour une liste de références nettes, aléa h. */
  function supplementParEntrant(refs, h, v) {
    var tot = 0;
    variantes(v).forEach(function (x) { var u = x[0]; refs.forEach(function (p) { for (var m = 1; m <= Math.ceil(u.T); m++) tot += x[1] * p.w * survie(h, m) * supplementMois(p.ref, m - 1, u); }); });
    return tot;
  }
  /**
   * Droits proportionnels au travail (consigne de l'auteur du 07/11/2026, soir) : un mois de droits pour deux mois travaillés, au plus T mois ; la courbe est ramenée
   * sur la durée des droits (elle part du revenu et rejoint le plancher en D mois). v.mix = [[D, poids], …] ; sans mix, une seule durée v.T.
   */
  function variantes(v) { if (!v.mix) return [[v, 1]]; return v.mix.map(function (d) { return [{ p0: v.p0, T: d[0], lam: v.lam }, d[1]]; }); }
  /** Répartition des durées de droits nouvelles : mois travaillés ≈ durée potentielle actuelle / 0,75 (24 mois au plus, 36 après 55 ans), droits = min(T, ratio × travaillés). */
  function mixProportionnel(T, ratio) {
    var acc = {}; HYP.population.dureesPotentielles.forEach(function (d) { var trav = Math.min(d[0] > 18 ? 36 : 24, d[0] / 0.75), D = Math.min(T, (ratio || 0.5) * trav); acc[D] = (acc[D] || 0) + d[1]; });
    return Object.keys(acc).map(function (k) { return [Number(k), acc[k]]; }).sort(function (a, b) { return a[0] - b[0]; });
  }
  function refsBase(cal) { return cal.pts.map(function (p) { return { ref: refDeBrut(p.x), R: coutEmployeur(p.x), w: p.w }; }); }
  function refsDemissionnaires(cal) { var f = HYP.demissionnaires.facteurRef; return cal.pts.map(function (p) { return { ref: refDeBrut(p.x * f), R: coutEmployeur(p.x * f), w: p.w }; }); }
  function refsIndependants() { var I = HYP.independants; return quantiles(I.medianeR, I.sigma, HYP.population.n).map(function (p) { return { ref: netNouveau(p.x), R: p.x, w: p.w }; }); }
  /** Perte pour les finances publiques par mois de non-emploi supplémentaire : plancher versé + contribution nette perdue (R − N(R)). */
  function perteParMois(refs) { return refs.reduce(function (a, p) { return a + p.w * (HYP.bareme.P + p.R - netNouveau(p.R)); }, 0); }
  function moisNonEmploi(h, H) { var s = 0; for (var m = 1; m <= H; m++) s += survie(h, m); return s; }

  /**
   * Coût annuel (Md€) de la garantie v = { p0, T, lam } : population actuelle (o.base, défaut oui), démissionnaires (o.dem), indépendants (o.ind) ; scénario sc ('bas'|'central'|'haut'|'aucun').
   * Renvoie le supplément versé (budget de la garantie) et, à part, l'effet du comportement sur les recettes et le plancher.
   */
  function cout(v, o) {
    o = o || {}; var cal = calibration(), sc = o.sc || 'central', i = niveau(sc === 'aucun' ? 'central' : sc), R = reaction(v, cal, sc), C = HYP.comportement;
    var groupes = [];
    if (o.base !== false) groupes.push({ id: 'base', E: cal.E, h: cal.h, refs: refsBase(cal) });
    if (o.dem) groupes.push({ id: 'dem', E: HYP.demissionnaires.entrants[i], h: HYP.demissionnaires.h, refs: refsDemissionnaires(cal) });
    if (o.ind) groupes.push({ id: 'ind', E: HYP.independants.entrants[i], h: HYP.independants.h, refs: refsIndependants() });
    var res = { v: v, sc: sc, reaction: R, groupes: {}, supplement: 0, recettes: 0 };
    groupes.forEach(function (g) {
      var h1 = 1 - Math.pow(1 - g.h, 1 / R.q), E1 = g.E * R.e;   // durée × q (survie (1 − h)^(m/q)) ; entrées × e
      var sup = 12 * E1 * supplementParEntrant(g.refs, h1, v) / 1e9, sup0 = 12 * g.E * supplementParEntrant(g.refs, g.h, v) / 1e9;
      var dMois = E1 * moisNonEmploi(h1, C.horizon) - g.E * moisNonEmploi(g.h, C.horizon);   // stock supplémentaire (personnes)
      var rec = -dMois * (1 - R.eviction) * perteParMois(g.refs) * 12 / 1e9;
      res.groupes[g.id] = { supplement: sup, supplementSansComportement: sup0, stockSupplementaire: dMois, recettes: rec, entrantsAn: 12 * E1, h: h1 };
      res.supplement += sup; res.recettes += rec;
    });
    return res;
  }
  /** λ tel que le supplément versé égale le budget (Md€/an). Renvoie null si le budget est hors de portée de la famille (λ ∈ [−40, 40]). */
  function calibrer(p0, T, budget, o) {
    o = o || {}; var f = function (lam) { return cout({ p0: p0, T: T, lam: lam, mix: o.mix }, o).supplement - budget; };
    var lo = -40, hi = 40, flo = f(lo), fhi = f(hi);
    if (flo < 0) return { p0: p0, T: T, lam: null, horsPortee: 'budget trop élevé : même la courbe la plus lente coûte ' + (flo + budget).toFixed(2), max: flo + budget, min: fhi + budget };
    if (fhi > 0) return { p0: p0, T: T, lam: null, horsPortee: 'budget trop faible : même la courbe la plus rapide coûte ' + (fhi + budget).toFixed(2), max: flo + budget, min: fhi + budget };
    var lam = bisect(f, lo, hi, 1e-7);
    return { p0: p0, T: T, lam: lam, max: flo + budget, min: fhi + budget, cout: cout({ p0: p0, T: T, lam: lam, mix: o.mix }, o) };
  }
  /** Coût du complément dégressif actuel du modèle (deg2) dans la même population, sans comportement (contrôle : 12,56 Md€ dans le bilan). */
  function coutComplementModele() {
    var cal = calibration(), refs = refsBase(cal), tot = 0;
    refs.forEach(function (p) { for (var m = 1; m <= 12; m++) tot += p.w * survie(cal.h, m) * complementModele(p.ref, m); });
    return 12 * cal.E * HYP.population.phi * tot / 1e9;
  }

  // ======================================================================
  // 7. Cas types
  // ======================================================================
  var CAS = [
    { id: 'smic', lib: 'Salarié au Smic (1 867 € brut, temps plein)', brut: 1867.02 },
    { id: 'median', lib: 'Salarié médian (≈ 2 900 € brut, 2 238 € net en 2025)', brut: 2900 },
    { id: 'cadre', lib: 'Cadre à 4 000 € net (≈ 5 200 € brut)', brut: 5200 },
    { id: 'independant', lib: 'Indépendant (R = 3 000 €/mois de revenu avant contribution)', R: 3000, independant: true }
  ];
  /** Tableau mois par mois sur 24 mois : garantie (variante v), ARE actuelle, complément du modèle (plancher compris). */
  function casType(c, v, nMois) {
    nMois = nMois || 24; var R = c.independant ? c.R : coutEmployeur(c.brut), ref = netNouveau(R), lignes = [];
    for (var m = 1; m <= nMois; m++) {
      var are = c.independant ? null : areNetMois(c.brut, m, HYP.are.dureeMax);
      lignes.push({ mois: m, garantie: garantieMois(ref, m, v), are: c.independant ? null : (are > 0 ? are : HYP.bareme.P), modele: HYP.bareme.P + complementModele(ref, m),
                    ati: c.independant ? (m <= 6 ? 26.30 * 30 : HYP.bareme.P) : null });
    }
    return { cas: c, R: R, ref: ref, netActuel: c.independant ? null : c.brut * HYP.netSurBrutActuel, lignes: lignes,
             cumul: { garantie: lignes.reduce(function (a, l) { return a + l.garantie; }, 0), are: c.independant ? null : lignes.reduce(function (a, l) { return a + l.are; }, 0), modele: lignes.reduce(function (a, l) { return a + l.modele; }, 0) } };
  }
  /** Cas de l'intérim : salarié médian, perte au mois 0, intérim de deux mois (mois 7 et 8) à 2 000 € brut, puis de nouveau sans activité. */
  function casInterim(v, o) {
    o = o || {}; var brut = o.brut || 2900, brutI = o.brutInterim || 2000, debut = o.debut || 7, n = o.nMois || 24, passe = [], futur = [], futurB = [], i;
    for (i = 0; i < 24; i++) passe.push(coutEmployeur(brut));
    for (i = 1; i <= n; i++) { var act = (i >= debut && i < debut + 2); futur.push(act ? coutEmployeur(brutI) : 0); futurB.push(act ? brutI : 0); }
    return { garantie: parcours(passe, futur, v, o), sansInterim: parcours(passe, futur.map(function () { return 0; }), v, o), are: parcoursARE(brut, futurB) };
  }

  // ======================================================================
  // 8. Arrêts maladie dans le même système
  // ======================================================================
  var AM = {
    // Coûts actuels (Md€, 2024) ; [bas, central, haut] quand incertain
    ijMaladieBase: 12.1,              // IJ maladie des régimes de base (Drees, comptes de la santé 2025, fiche 25, tableau 1) — A
    ijAtmp: 5.3, ijMaternite: 3.9,    // hors champ (inchangés) — A
    complementsOrganismes: 7.4,       // compléments d'IJ des organismes complémentaires (même fiche) — A ; CPS : 5,6 au titre du « maintien de salaire » du risque maladie
    maintienEmployeurs: [2.0, 4.0, 6.3],   // maintien direct par les employeurs privés (art. L1226-1, conventions), non publié ; borne haute = « autres sociétés » du risque maladie (CPS 2025) ⚠️ V19840
    maintienFonctionPublique: [6.0, 7.9, 9.5],   // salaire maintenu des fonctionnaires malades (non identifié par la Drees) : 5,7 M d'agents × ≈ 12 jours × ≈ 115 € ⚠️ V19841
    // Carence : jours aujourd'hui non indemnisés par la Sécurité sociale
    arretsPrivesIndemnises: 7.5e6,    // ≈ 28 % des 21 M de salariés du régime général ont un arrêt indemnisé (Drees, ER 2024) × 1,3 arrêt ⚠️ V19842
    arretsCourtsNonIndemnises: 4.0e6, // arrêts de 3 jours ou moins (hors données, carence) ⚠️ V19843
    joursCarencePrive: 3, partCarenceCouverte: 2 / 3,   // 2/3 des salariés couverts par leur employeur pendant la carence (Pollak, 2015, relayé) ⚠️ V19844
    salaireNetJour: 85,               // ≈ 2 600 € nets / 30,4 jours ⚠️
    episodesFonctionPublique: 4.0e6, salaireJourFP: 100,   // ⚠️ V19845
    tauxIndemnite: 0.9,               // HGT25 : 90 % du revenu net de référence les 30 premiers jours (comparable au maintien de 90 % du brut)
    // Comportement (HGT26-HGT27)
    joursArretsCourts: 45e6,          // jours des arrêts de 7 jours ou moins (13 M de jours indemnisés : 4 % des IJ du RG ; + jours de carence)
    hausseCourts: [0.10, 0.25, 0.45], // effet de l'auto-déclaration et de la fin de la carence sur les jours des arrêts courts ⚠️ V19846
    hausseFP: [0.02, 0.054, 0.08],    // fin du jour de carence : −5,1 % de jours avec carence (Insee Analyses n° 95, 2024) ⇒ +5,4 % sans
    joursFP: 5.7e6 * 12,
    economies: [0.30, 0.20, 0.10],    // consultations pour certificat (≈ 0,1) et gestion de la subrogation et des attestations ⚠️ V19847
    tauxRetourSalaire: [0.55, 0.45, 0.35], chargementPrevoyance: 1.2   // primes de prévoyance et maintien libérés, reversés en salaire et repris par la fonction des revenus ⚠️ V19848
  };
  /** Coût net pour les finances publiques (Md€/an, + = coûte) de l'intégration des arrêts maladie ; option o.reprise (défaut vrai) : le système reprend aussi compléments et maintien. */
  function arretsMaladie(sc, o) {
    o = o || {}; var i = niveau(sc);   // i : bas = coût faible ; les tableaux [bas, central, haut] sont ordonnés du coût faible au coût fort, sauf economies et tauxRetour (ordre inverse)
    var carencePrive = (AM.arretsPrivesIndemnises * AM.joursCarencePrive + AM.arretsCourtsNonIndemnises * 2) * AM.salaireNetJour * AM.tauxIndemnite / 1e9;
    var carenceFP = AM.episodesFonctionPublique * 1 * AM.salaireJourFP * AM.tauxIndemnite / 1e9;
    var comportementPrive = AM.joursArretsCourts * AM.hausseCourts[i] * AM.salaireNetJour * AM.tauxIndemnite / 1e9;
    var comportementFP = AM.joursFP * AM.hausseFP[i] * AM.salaireJourFP / 1e9;
    var eco = AM.economies[i];
    var reprise = o.reprise === false ? 0 : AM.complementsOrganismes + AM.maintienEmployeurs[i] - carencePrive * AM.partCarenceCouverte;   // la part de carence déjà payée par l'employeur est comptée une fois
    var retour = o.reprise === false ? carencePrive * AM.partCarenceCouverte * AM.tauxRetourSalaire[i]
                                     : (AM.complementsOrganismes * AM.chargementPrevoyance + AM.maintienEmployeurs[i]) * AM.tauxRetourSalaire[i];
    var net = carencePrive + carenceFP + comportementPrive + comportementFP - eco + Math.max(0, reprise) - retour;
    return { carencePrive: carencePrive, carenceFP: carenceFP, comportementPrive: comportementPrive, comportementFP: comportementFP, economies: eco, reprise: Math.max(0, reprise), retourSalaires: retour, net: net,
             actuelPublic: AM.ijMaladieBase + AM.maintienFonctionPublique[i], actuelPrive: AM.complementsOrganismes + AM.maintienEmployeurs[i] };
  }


  // ======================================================================
  // 9. Modulation par l'âge : « pont vers la retraite » (décision de l'auteur du 07/11/2026, au lieu d'une retraite anticipée)
  // ======================================================================
  /*
   * Règle universelle (toute perte d'activité, quel qu'en soit le motif) : avant 50 ans, garantie standard + formation de son choix ; à partir de 50 ans, la personne choisit
   * la reconversion (garantie standard + formation financée) ou le PONT : la courbe descend du revenu de référence non plus jusqu'au plancher P mais jusqu'à un niveau
   *   L(a) = P + w(a) × (Pen − P),   w(a) = min(1, max(0, (a − 50) / (Atp − 50)))^κ,
   * atteint en T mois (même forme g que la garantie), puis tenu jusqu'à l'âge du taux plein Atp, où la pension prend le relais. Pen = pension future estimée
   * (taux de remplacement net HGT31). À 50 ans, w = 0 : le pont est la garantie standard (aucun cadeau de 12 ans) ; à l'approche de Atp, le pont est court et proche de la pension.
   * κ est calibré pour que le surcoût du pont au-delà de la garantie standard soit d'environ 1 Md€ par an (contrainte indicative de l'auteur). Cumul avec de petits revenus : mêmes règles
   * que la garantie (parcours, § 4), la moyenne glissante en tient compte.
   */
  HYP.pont = {
    Atp: 62,                    // âge du taux plein retenu au central (l'auteur évoque 60 ans, à discuter ; variantes 60 et 64) HGT32
    tauxPension: 0.75,          // pension nette ≈ 75 % du revenu net de référence (carrière complète ; COR, taux de remplacement net médian de l'ordre de 75 %) ⚠️ V19831
    partEntrants50: 0.15,       // part des entrants de 50 ans et plus dans les entrants indemnisés ⚠️ V19830
    facteurH: 0.71,             // sortie vers l'emploi plus lente après 50 ans : 37,7 % d'accès à l'emploi en 6 mois contre 48,6 % (France Travail, juillet 2026) ⇒ ln(0,623)/ln(0,514)
    verrou: 0.8,                // en pont, aléa de sortie × 0,8 (moindre recherche) ⚠️ V19832
    choix: [0.3, 0.9],          // part qui choisit le pont : de 30 % à 50 ans à 90 % juste avant Atp (linéaire) ⚠️ V19833
    facteurRef: 1.1,            // revenus des seniors 10 % au-dessus de la moyenne des entrants
    kappa: 2                    // valeur par défaut, recalibrée par calibrerPont
  };
  function poidsAge(a, o) { var p = HYP.pont, Atp = (o && o.Atp) || p.Atp, k = (o && o.kappa !== undefined) ? o.kappa : p.kappa; return Math.pow(Math.min(1, Math.max(0, (a - 50) / (Atp - 50))), k); }
  function niveauPont(ref, a, o) { var P = HYP.bareme.P, pen = Math.max(P, HYP.pont.tauxPension * ref); return P + poidsAge(a, o) * (pen - P); }
  /** Montant du pont au mois m (1 = premier) pour une personne d'âge a à la perte ; 0 = retraite (au-delà de Atp, la pension prend le relais). */
  function pontMois(ref, a, m, v, o) {
    var Atp = (o && o.Atp) || HYP.pont.Atp, P = HYP.bareme.P; if (a + (m - 1) / 12 >= Atp) return 0;
    var L = niveauPont(ref, a, o), base = Math.max(0, v.p0 * ref - L);
    return L + base * integraleForme((m - 1) / v.T, m / v.T, v.lam) * v.T;
  }
  /** Surcoût annuel (Md€) du pont au-delà de la garantie standard, pour les entrants de 50 ans et plus (âges 50 à Atp, uniformes), réaction centrale de la garantie comprise. */
  function coutPont(v, o) {
    o = o || {}; var p = HYP.pont, cal = calibration(), Atp = o.Atp || p.Atp, R = reaction(v, cal, o.sc || 'central'), C = HYP.comportement, i = niveau(o.sc || 'central');
    var E50 = cal.E * p.partEntrants50 * R.e, h = 1 - Math.pow(1 - cal.h * p.facteurH, 1 / R.q);
    var refs = cal.pts.map(function (q) { var b = q.x * p.facteurRef; return { ref: refDeBrut(b), R: coutEmployeur(b), w: q.w }; }), perte = perteParMois(refs);
    var tot = 0, n = 0, pers = 0, mois = 0;
    for (var a = 50; a < Atp - 1e-9; a += 0.5) {   // âges à la perte, pas de 6 mois, de 50 ans à Atp
      n++; var w = poidsAge(a, o), choix = p.choix[0] + (p.choix[1] - p.choix[0]) * Math.min(1, (a - 50) / (Atp - 50));
      var hp = 1 - Math.pow(1 - h, 1 - (1 - p.verrou) * w), sAge = 0, mAge = 0;   // le verrou croît avec la générosité du pont (w)
      refs.forEach(function (q) {
        var s1 = 0, m1 = 0; for (var m = 1; a + (m - 1) / 12 < Atp && m <= 240; m++) {
          var sp = Math.pow(1 - hp, m - 1), ss = Math.pow(1 - h, m - 1);
          s1 += sp * pontMois(q.ref, a, m, v, o) - ss * garantieMois(q.ref, m, v); m1 += sp - ss;
        }
        sAge += q.w * s1; mAge += q.w * m1;
      });
      tot += choix * sAge; mois += choix * mAge; pers += choix;
    }
    var parAn = 12 * E50 * HYP.population.phi * tot / n / 1e9, rec = -12 * E50 * mois / n * (1 - C.eviction[i]) * perte / 1e9;
    return { surcout: parAn, recettes: rec, entrantsAn: 12 * E50, choisissentAn: 12 * E50 * pers / n, kappa: (o.kappa !== undefined ? o.kappa : p.kappa), Atp: Atp };
  }
  /** κ tel que le surcoût du pont égale la cible (Md€/an). */
  function calibrerPont(v, cible, o) {
    o = o || {}; var f = function (k) { var oo = {}; for (var x in o) oo[x] = o[x]; oo.kappa = k; return coutPont(v, oo).surcout - cible; };
    if (f(30) > 0) return { kappa: null, horsPortee: true };
    var k = bisect(f, 0.01, 30, 1e-7), oo = {}; for (var x in o) oo[x] = o[x]; oo.kappa = k; return { kappa: k, cout: coutPont(v, oo) };
  }
  /** Cas type : âge a, brut actuel, mois par mois jusqu'au taux plein : pont, garantie standard, ARE actuelle (durée selon l'âge), puis pension. */
  function casPont(brut, a, v, o) {
    var ref = refDeBrut(brut), Atp = (o && o.Atp) || HYP.pont.Atp, n = Math.max(0, Math.round((Atp - a) * 12)), duree = a >= 57 ? 27 : (a >= 55 ? 22.5 : 18), out = [];
    for (var m = 1; m <= n; m++) out.push({ mois: m, age: a + (m - 1) / 12, pont: pontMois(ref, a, m, v, o), standard: garantieMois(ref, m, v), are: (function () { var x = areNetMois(brut, m, duree, a); return x > 0 ? x : HYP.bareme.P; })() });
    return { ref: ref, pension: Math.max(HYP.bareme.P, HYP.pont.tauxPension * ref), niveau: niveauPont(ref, a, o), mois: out,
             cumul: { pont: out.reduce(function (s, l) { return s + l.pont; }, 0), standard: out.reduce(function (s, l) { return s + l.standard; }, 0), are: out.reduce(function (s, l) { return s + l.are; }, 0) } };
  }

  // ======================================================================
  // 10. Variante « coût constant » (consignes de l'auteur du 07/11/2026, soir) : pas plus cher qu'aujourd'hui (AC 37,1 + IJ maladie 12,1 = 49,2 Md€)
  // ======================================================================
  /*
   * Arrêts maladie, variante principale : jour 1 non payé (carence) ; jours 2 et 3 sur simple déclaration, payés 10 % et 20 % du revenu net de référence ;
   * à partir du 4e jour, arrêt prescrit par un médecin, indemnisation qui monte de 10 points par jour jusqu'au taux plein (64 % du net ≈ IJ actuelle de 50 % du brut ;
   * variante 80 %), atteint vers le 8e jour (10e à 80 %). Les compléments des employeurs et de la prévoyance ne sont PAS repris par le système.
   * Le coût est rapporté aux IJ maladie des régimes de base (12,1 Md€ en 2024) en reconstituant les jours indemnisés par rang de jour dans l'arrêt.
   */
  var AM2 = {
    ijActuelles: 12.1,            // Drees, CNS 2025, fiche 25 (A)
    ijJour: 37,                   // IJ moyenne par jour (Drees, ER décembre 2024 : 36-37 €) (A)
    tauxActuel: 0.64,             // 50 % du brut ≈ 64 % du net (net ≈ 78 % du brut) ; IJ peu prélevées (CSG 6,2 % + CRDS) : ordre de grandeur ⚠️ V19850
    arretsLongs: 8.0e6,           // arrêts de 4 jours et plus indemnisés par an, tous régimes de base (7,5 M au régime général, V19842) ⚠️
    arretsCourts: 4.0e6,          // arrêts de 1 à 3 jours (non indemnisés aujourd'hui) ⚠️ V19843
    repartCourts: [0.40, 0.35, 0.25],              // 1, 2, 3 jours ⚠️
    repart4a7: 0.5, survie8: { 9: 0.92, 10: 0.85, 11: 0.79, 12: 0.74 },   // la moitié des arrêts indemnisés font moins de 8 jours (Drees) ; au-delà : hypothèse ⚠️
    hausseCourts: [0.05, 0.15, 0.30],              // arrêts courts supplémentaires déclarés (bas / central / haut) ⚠️ V19851
    consultation: 30, partAM: 0.7, participation: 2, partEvitable: [0.9, 0.8, 0.6]   // G = 30 € (convention médicale 2024) ; 70 % − 2 € remboursés par l'Assurance maladie ⚠️ V19852
  };
  /** Taux d'indemnisation au jour d (1 = premier jour). Schémas : 'principal' (0, 10, 20 %, puis +10 points/jour) ; 'progressif' (10, 20, 30 %…) ; 'sansPaie' (0, 0, 0, puis 30 %…). */
  function tauxArret(d, schema, tp) {
    tp = tp || AM2.tauxActuel;
    if (schema === 'progressif') return Math.min(tp, 0.1 * d);
    if (schema === 'sansPaie') return d <= 3 ? 0 : Math.min(tp, 0.1 * (d - 1));
    if (schema === 'pierre') return d === 1 ? 0 : d === 2 ? 0.1 : d === 3 ? 0.2 : (tp <= 0.6 ? tp : Math.min(tp, 0.6 + (d - 4) * (tp - 0.6) / 4));   // 0 / 10 / 20 %, puis 60 % dès le 4e jour, montée vers le taux plein au 8e
    return Math.min(tp, 0.1 * (d - 1));   // principal : 0 ; 0,1 ; 0,2 ; 0,3…
  }
  /** Coût (Md€/an) du nouveau régime des arrêts maladie, comparé aux IJ actuelles (12,1). o = { schema, tp, sc }. */
  function arretsMaladie2(o) {
    o = o || {}; var i = niveau(o.sc || 'central'), schema = o.schema || 'principal', tp = o.tp || AM2.tauxActuel, w = AM2.ijJour / AM2.tauxActuel;   // revenu net journalier moyen
    var joursAct = AM2.ijActuelles * 1e9 / AM2.ijJour;   // jours indemnisés aujourd'hui (rang ≥ 4)
    var D = function (d) {   // nombre d'arrêts qui atteignent le jour d
      var longs = AM2.arretsLongs, courts = AM2.arretsCourts * (1 + AM2.hausseCourts[i]), r = AM2.repartCourts;
      if (d <= 3) { var c = 0; for (var k = d; k <= 3; k++) c += courts * r[k - 1]; return longs + c; }
      if (d <= 7) return longs * (AM2.repart4a7 * (8 - d) / 4 + (1 - AM2.repart4a7));
      return longs * (1 - AM2.repart4a7) * (d === 8 ? 1 : (AM2.survie8[d] || AM2.survie8[12]));
    };
    var dPlein = 1; while (tauxArret(dPlein, schema, tp) < tp - 1e-12 && dPlein < 60) dPlein++;
    var cout = 0, joursAvant = 0, detail = [];
    for (var d = 1; d < dPlein; d++) { var c1 = tauxArret(d, schema, tp) * D(d) * w; cout += c1; if (d >= 4) joursAvant += D(d); detail.push({ jour: d, taux: tauxArret(d, schema, tp), arrets: D(d), cout: c1 / 1e9 }); }
    var reste = (joursAct - joursAvant) * tp * w; cout += reste;
    var j23 = (tauxArret(2, schema, tp) * D(2) + tauxArret(3, schema, tp) * D(3)) * w / 1e9;
    var consEvitees = AM2.arretsCourts * AM2.partEvitable[i], ecoAM = consEvitees * (AM2.consultation * AM2.partAM - AM2.participation) / 1e9, ecoTot = consEvitees * AM2.consultation / 1e9;
    return { schema: schema, tp: tp, dPlein: dPlein, cout: cout / 1e9, actuel: AM2.ijActuelles, ecart: cout / 1e9 - AM2.ijActuelles, joursCourtsPayes: j23,
             consultationsEvitees: consEvitees, economieAssuranceMaladie: ecoAM, economieConsultations: ecoTot, net: cout / 1e9 - ecoAM, detail: detail };
  }

  /**
   * Arrêts types (consigne de l'auteur) : revenu reçu sur un arrêt de n jours, aujourd'hui et dans le schéma `schema`, pour un salarié de brut b,
   * sans maintien employeur, avec le maintien légal (art. L1226-1 : à partir du 8e jour, 90 % du brut IJ comprises, un an d'ancienneté) ou avec un maintien conventionnel
   * à 100 % du net dès le 1er jour. IJ actuelle : 50 % du salaire journalier de base (brut × 3 / 91,25), plafonné à 1,4 Smic, nette de CSG-CRDS (6,7 %) ⚠️ V19850.
   * Nouveau système : taux × revenu net de référence / 30 ; le maintien employeur reste dû au-dessus (non repris).
   */
  function arretType(brut, n, schema, tp, maintien) {
    var sjb = brut * 3 / 91.25, smic = 1867.02, ijBrute = Math.min(0.5 * sjb, 0.5 * 1.4 * smic * 3 / 91.25), ij = ijBrute * (1 - 0.067);
    var ijMax = 0.5 * 1.4 * smic * 3 / 91.25 * (1 - 0.067), plaf = ijMax / AM2.tauxActuel;   // même plafond qu'aujourd'hui : la référence journalière est plafonnée là où l'IJ actuelle l'est
    var netA = brut * HYP.netSurBrutActuel / 30, netN = refDeBrut(brut) / 30, netNp = Math.min(netN, plaf), a = 0, nv = 0, empA = 0, empN = 0;
    for (var d = 1; d <= n; d++) {
      var sa = d >= 4 ? ij : 0, sn = tauxArret(d, schema, tp) * netNp, ca = 0, cn = 0;
      if (maintien === 'legal' && d >= 8 && d <= 37) { ca = Math.max(0, 0.9 * netA - sa); cn = Math.max(0, 0.9 * netN - sn); }   // 90 % du brut ≈ 90 % du net (ordre de grandeur)
      if (maintien === 'conventionnel') { ca = Math.max(0, netA - sa); cn = Math.max(0, netN - sn); }
      a += sa + ca; nv += sn + cn; empA += ca; empN += cn;
    }
    return { jours: n, aujourdhui: a, nouveau: nv, partAujourdhui: a / (n * netA), partNouveau: nv / (n * netN), employeurAujourdhui: empA, employeurNouveau: empN,
             systemeAujourdhui: a - empA, systemeNouveau: nv - empN, ijJour: ij, netJourActuel: netA, netJourNouveau: netN, referencePlafonnee: netNp };
  }
  /** Coût total « chômage + maladie + pont » (Md€/an) pour une garantie v (mix des droits proportionnels), un pont calibré à `pontCible` et un régime d'arrêts. */
  function coutTotal(v, o) {
    o = o || {}; var sc = o.sc || 'central', g = cout(v, { dem: true, ind: true, sc: sc }), vp = { p0: v.p0, T: v.T, lam: v.lam };
    var kp = o.kappa !== undefined ? o.kappa : calibrerPont(vp, o.pontCible || 1, { Atp: o.Atp || HYP.pont.Atp }).kappa, pt = coutPont(vp, { kappa: kp, Atp: o.Atp || HYP.pont.Atp, sc: sc });
    var am = arretsMaladie2({ schema: o.schema, tp: o.tp, sc: sc });
    var chom = g.supplement - g.recettes, pont = pt.surcout - pt.recettes;
    return { garantie: g, pont: pt, kappa: kp, maladie: am, chomage: chom, pontTotal: pont, total: chom + pont + am.net, aujourdhui: AM2.ijActuelles + HYP.population.cout,
             base: HYP.complementModele.coutBilan + AM2.ijActuelles };
  }
  /** λ tel que le coût total (chômage avec comportement + pont + maladie) égale la cible (Md€/an). */
  function calibrerTotal(p0, T, cible, o) {
    o = o || {}; var mix = mixProportionnel(T, o.ratio), base = coutTotal({ p0: p0, T: T, lam: 0, mix: mix }, o), kp = base.kappa;
    var f = function (lam) { var oo = {}; for (var x in o) oo[x] = o[x]; oo.kappa = kp; return coutTotal({ p0: p0, T: T, lam: lam, mix: mix }, oo).total - cible; };
    var flo = f(-40), fhi = f(40);
    if (flo < 0) return { lam: null, horsPortee: 'même la courbe la plus lente coûte ' + (flo + cible).toFixed(2), max: flo + cible, mix: mix };
    if (fhi > 0) return { lam: null, horsPortee: 'même la courbe la plus rapide coûte ' + (fhi + cible).toFixed(2), min: fhi + cible, mix: mix };
    var lam = bisect(f, -40, 40, 1e-7), oo = {}; for (var x in o) oo[x] = o[x]; oo.kappa = kp;
    return { lam: lam, mix: mix, kappa: kp, total: coutTotal({ p0: p0, T: T, lam: lam, mix: mix }, oo) };
  }
  /** Cas type d'un jeune : 12 mois travaillés au brut b, 25 ans : droits de 6 mois, référence = moyenne des mois travaillés (mois antérieurs à l'entrée dans la vie active exclus). */
  function casJeune(brut, moisTravailles, v) {
    var ref = refDeBrut(brut), D = Math.min(v.T, 0.5 * moisTravailles), u = { p0: v.p0, T: D, lam: v.lam }, out = [], areD = Math.round(moisTravailles * 30.42 * 0.75) / 30;
    for (var m = 1; m <= 24; m++) { var a = areNetMois(brut, m, areD); out.push({ mois: m, garantie: garantieMois(ref, m, u), are: a > 0 ? a : HYP.bareme.P }); }
    return { ref: ref, droits: D, dureeARE: areD, lignes: out };
  }

  var API = { HYP: HYP, AM: AM, CAS: CAS, contribution: contribution, filet: filet, netNouveau: netNouveau, coutEmployeur: coutEmployeur, refDeBrut: refDeBrut,
    sjr: sjr, areJour: areJour, areJourMois: areJourMois, areNetJour: areNetJour, areNetMois: areNetMois, areBrutMois: areBrutMois, complementModele: complementModele,
    forme: forme, integraleForme: integraleForme, garantieInstant: garantieInstant, supplementMois: supplementMois, garantieMois: garantieMois,
    referenceGlissante: referenceGlissante, parcours: parcours, parcoursARE: parcoursARE, quantiles: quantiles, invNorm: invNorm, calibration: calibration, coutARE: coutARE,
    generosite: generosite, reaction: reaction, cout: cout, calibrer: calibrer, coutComplementModele: coutComplementModele, casType: casType, casInterim: casInterim, arretsMaladie: arretsMaladie,
    poidsAge: poidsAge, niveauPont: niveauPont, pontMois: pontMois, coutPont: coutPont, calibrerPont: calibrerPont, casPont: casPont,
    variantes: variantes, mixProportionnel: mixProportionnel, AM2: AM2, tauxArret: tauxArret, arretsMaladie2: arretsMaladie2, coutTotal: coutTotal, calibrerTotal: calibrerTotal, casJeune: casJeune, arretType: arretType };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.GarantieTransition = API;
})(this);
