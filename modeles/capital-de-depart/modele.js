// Capital de départ pour chaque jeune (chantier 4, boucle « meilleur système », 03/11/2026).
// Fonctions pures, euros constants, montants en € par personne et Md€ par an. Lancer : jsc modele.js test.js  puis  jsc modele.js rapport.js
// Voir methode.md pour les hypothèses H1-H16.
var CD = (function () {
  var BASE = {
    // H1 taille de cohorte (Eurostat demo_pjan, population au 1er janvier 2024, France, avec DOM) : 18 ans 827 859 ; moyenne 18-25 ans 797 790 ; 13-17 ans 859 000 à 873 000
    cohorte: { bas: 780000, central: 830000, haut: 870000 },
    // H2 héritages reçus à vie, loi log-normale calée sur CAE 2021 : médiane 70 000 €, 90e centile 500 000 € (« moins de 10 % reçoivent plus de 500 000 € »)
    medianeH: 70000, p90H: 500000,
    p0: 0,                 // H3 part de la cohorte qui ne reçoit rien (0 = borne favorable au coût des garanties)
    echelle: 1,            // H4 multiplicateur des montants (1 = calage CAE sur données fiscales ; 1,63 = flux macroéconomique de 300 Md€)
    flux: 300,             // H5 flux annuel de successions et donations, Md€ (CAE 2021, ordre de grandeur macro)
    fuite: { favorable: 0.31, central: 0.35, defavorable: 0.40 }, // H6 écart de déclaration (palier 1 : 31 % ; CAE : 35-40 %)
    tTrans: 0.5,           // plafond de 50 % tous impôts confondus (tranché par Claude, 03/11)
    recettePalier1: 103.5, // Md€ : 300 × 50 % × (1 − 31 %), palier 1 du modèle systeme-ideal
    recetteDMTG: 20.8,     // Md€ : droits de succession et de donation actuels
    taxe1pc: { bas: 75, central: 93, haut: 109 }, // Md€ : taxe à 1 % sans abattement (taxe-patrimoine-1pc.md)
    pointTauxPlat: 12.7,   // Md€ par point de taux plat (options-financement-palier1.md)
    valeurVentesAnciens: 185.2, // Md€ : 749 583 ventes, DVF 2024 (résultats dvf-patrimoine)
    partLogement: { favorable: 0.15, central: 0.30, defavorable: 0.50 }, // H12 part du capital fléché qui finit en apport immobilier
    levierApport: { favorable: 1, central: 2, defavorable: 3 },          // H13 demande immobilière créée par euro d'apport
    elasticitePrix: { favorable: 2.0, central: 1.0, defavorable: 0.5 }   // H14 réponse de l'offre (même éventail que le modèle immobilier)
  };

  // --- loi normale ---
  function erf(x) { var s = x < 0 ? -1 : 1; x = Math.abs(x); var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
  function cdf(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }
  function invcdf(p) { // Acklam
    var a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239],
      b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572],
      c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783],
      d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416], pl = 0.02425, q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }

  function params(o) { var p = {}; var k; for (k in BASE) p[k] = BASE[k]; if (o) for (k in o) p[k] = o[k]; return p; }

  // Calage log-normal sur (médiane, P90) de l'ensemble de la cohorte, avec une part p0 qui ne reçoit rien.
  function calage(p) {
    var q = function (x) { return invcdf((x - p.p0) / (1 - p.p0)); };
    var z5 = q(0.5), z9 = q(0.9);
    var s = (Math.log(p.p90H) - Math.log(p.medianeH)) / (z9 - z5);
    return { mu: Math.log(p.medianeH) - s * z5, s: s };
  }
  // Héritage reçu à vie au rang p (0 à 1) dans la cohorte, en euros.
  function quantileH(p, u) { var c = calage(p); if (u <= p.p0) return 0; return p.echelle * Math.exp(c.mu + c.s * invcdf((u - p.p0) / (1 - p.p0))); }

  // Espérance de g(H) sur le rang u dans [lo, hi], par quadrature du point milieu (n points).
  function esperance(g, p, lo, hi, n) {
    lo = lo === undefined ? 0 : lo; hi = hi === undefined ? 1 : hi; n = n || 20000;
    var s = 0, i; for (i = 0; i < n; i++) { var u = lo + (hi - lo) * (i + 0.5) / n; s += g(quantileH(p, u)); } return s / n;
  }

  // Variantes. transfert(H) : euros reçus par un jeune dont l'héritage (reçu ou attendu) vaut H.
  var VARIANTES = {
    A: { nom: 'A. 10 000 € à 18 ans, universel, libre', age: 18, fleche: false, transfert: function () { return 10000; } },
    B: { nom: 'B. 25 000 € à 25 ans, universel, fléché (études, création, apport)', age: 25, fleche: true, transfert: function () { return 25000; } },
    C: { nom: 'C. garantie de 40 000 € à 25 ans, dégressive à 50 % de l\'héritage, libre', age: 25, fleche: false, transfert: function (h) { return Math.max(0, 40000 - 0.5 * h); } },
    C100: { nom: 'C\'. garantie de 40 000 € à 25 ans, dégressive à 100 % (CAE « garantie 1 »)', age: 25, fleche: false, transfert: function (h) { return Math.max(0, 40000 - h); } }
  };

  function transfertMoyen(v, p) { return esperance(VARIANTES[v].transfert, p); }
  function partBeneficiaires(v, p) { return esperance(function (h) { return VARIANTES[v].transfert(h) > 0 ? 1 : 0; }, p); }
  // Coût annuel en croisière, Md€.
  function cout(v, p, tailleCohorte) { return tailleCohorte * transfertMoyen(v, p) / 1e9; }
  // Taux marginal implicite sur l'héritage (part du premier euro récupérée par la dégressivité).
  function tauxImplicite(v) { var t = VARIANTES[v].transfert; return (t(0) - t(1)) ; }

  // --- Financement : impôt sur les transmissions ---
  // Part de la masse transmise qui est imposable : régime « flat dès le premier euro » (exemption 0) ou « reçu à vie » (exemption E par héritier).
  function partImposable(p, exemption) { return esperance(function (h) { return Math.max(0, h - exemption); }, p) / esperance(function (h) { return h; }, p); }
  // Recette annuelle de l'impôt (Md€) : flux × part imposable × taux × (1 − fuite).
  function recette(p, exemption, taux, fuite) { return p.flux * partImposable(p, exemption) * (taux === undefined ? p.tTrans : taux) * (1 - fuite); }
  // Impôt payé par un héritier d'un héritage H avec exemption E : taux × max(0, H − E) (barème marginal ; plafond 50 % du total garanti par construction).
  function impot(h, exemption, taux) { return taux * Math.max(0, h - exemption); }

  // --- Effet par décile de patrimoine des parents (rang des héritages = rang du patrimoine des parents : borne de concentration) ---
  // regime : { exemption, taux, variante } ; retourne par décile : héritage brut moyen, impôt, capital reçu, net = H − impôt + capital.
  function parDecile(p, regime) {
    var out = [], d, v = regime.variante, ex = regime.exemption || 0, tx = regime.taux === undefined ? p.tTrans : regime.taux;
    for (d = 0; d < 10; d++) {
      var lo = d / 10, hi = (d + 1) / 10, n = 4000 * (d === 9 ? 6 : 1);
      var H = esperance(function (h) { return h; }, p, lo, hi, n);
      var T = esperance(function (h) { return impot(h, ex, tx); }, p, lo, hi, n);
      var K = v ? esperance(VARIANTES[v].transfert, p, lo, hi, n) : 0;
      out.push({ decile: d + 1, heritage: H, impot: T, capital: K, net: H - T + K });
    }
    return out;
  }
  // Part de la cohorte qui est gagnante nette (capital reçu > impôt payé) dans un régime.
  function partGagnants(p, regime) {
    var ex = regime.exemption || 0, tx = regime.taux === undefined ? p.tTrans : regime.taux, v = regime.variante;
    return esperance(function (h) { return (v ? VARIANTES[v].transfert(h) : 0) > impot(h, ex, tx) ? 1 : 0; }, p);
  }

  // --- Risque immobilier si fléché logement : hausse de prix en % (ordre de grandeur, effet de niveau) ---
  function risqueImmobilier(coutMd, scen) {
    var p = BASE, demande = coutMd * p.partLogement[scen] * p.levierApport[scen];
    var partMarche = demande / p.valeurVentesAnciens;
    return { demandeMd: demande, partMarche: partMarche, hausse: partMarche / p.elasticitePrix[scen] };
  }

  // --- Montants [favorable, central, défavorable] à intégrer comme option dans systeme-ideal ---
  // coût : cohorte bas/central/haut ET héritages (p0 : 0 / 0,10 / 0,20) pour les variantes dépendantes de l'héritage.
  function montants(v) {
    var sc = [['favorable', 'bas', 0], ['central', 'central', 0.1], ['defavorable', 'haut', 0.2]], r = {};
    sc.forEach(function (s) { var p = params({ p0: s[2] }); r[s[0]] = cout(v, p, BASE.cohorte[s[1]]); });
    return r;
  }

  return { BASE: BASE, VARIANTES: VARIANTES, cdf: cdf, invcdf: invcdf, params: params, calage: calage, quantileH: quantileH, esperance: esperance,
    transfertMoyen: transfertMoyen, partBeneficiaires: partBeneficiaires, cout: cout, tauxImplicite: tauxImplicite, partImposable: partImposable,
    recette: recette, impot: impot, parDecile: parDecile, partGagnants: partGagnants, risqueImmobilier: risqueImmobilier, montants: montants };
})();
if (typeof module !== 'undefined') module.exports = CD;
