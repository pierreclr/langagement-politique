// Fonctions continues pour l'héritage reçu à vie et le capital de départ (03/11/2026, H600-H609). Principe de l'auteur (03/11) :
// pas de seuils ni de tranches, des fonctions lisses du montant. Fonctions pures au-dessus de modele.js (même loi log-normale des héritages reçus à vie, H2).
// Lancer (depuis ce dossier) : jsc modele.js continu.js test_continu.js  puis  jsc modele.js continu.js rapport_continu.js
var CDC = (function (root) {
  var CD = root.CD || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var PLAFOND = 0.5;          // taux maximal (tous impôts confondus) sur la transmission (H600)
  var G = 40000;              // garantie du capital de départ au premier euro (variante C de modele.js)

  // ---------- Impôt sur l'héritage reçu à vie x (euros) : impot(x), taux marginal impot'(x) ----------
  // hyper : taux moyen t(x) = 50 % × x/(x + K) ; impôt = x·t(x) ; taux marginal croissant de 0 vers 50 % (jamais au-dessus).
  // exp   : taux moyen t(x) = 50 % × (1 − e^(−x/K)) ; le taux marginal dépasse 50 % (jusqu'à 56,8 % à x = 2K) : défaut à nommer.
  // marg  : taux MARGINAL lisse 50 % × x/(x + K) ; impôt = 50 % × (x − K·ln(1 + x/K)) : analogue lisse de l'exemption (marginal 0 puis 50 %), jamais au-dessus de 50 %.
  /** I3(u) = ∫0^u dt/(1+t³) (primitive exacte). */
  function I3(u) { return Math.log((u + 1) * (u + 1) / (u * u - u + 1)) / 6 + (Math.atan((2 * u - 1) / Math.sqrt(3)) + Math.PI / 6) / Math.sqrt(3); }
  var FORMES = {
    hyper: { nom: 'taux moyen 50 % × x/(x+K)', impot: function (x, K) { return PLAFOND * x * x / (x + K); },
             marginal: function (x, K) { return PLAFOND * (x * x + 2 * x * K) / ((x + K) * (x + K)); } },
    exp:   { nom: 'taux moyen 50 % × (1 − e^(−x/K))', impot: function (x, K) { return PLAFOND * x * (1 - Math.exp(-x / K)); },
             marginal: function (x, K) { var u = x / K; return PLAFOND * (1 + Math.exp(-u) * (u - 1)); } },
    marg:  { nom: 'taux marginal 50 % × x/(x+K)', impot: function (x, K) { return PLAFOND * (x - K * Math.log(1 + x / K)); },
             marginal: function (x, K) { return PLAFOND * x / (x + K); } },
    // H610 : formes plus convexes. D, E : taux moyen 50 % × x^n/(x^n+K^n) (n = 2, 3) ; le taux marginal DÉPASSE 50 % (pic de 56,25 % pour D à x = √3·K) : écartées.
    hyper2: { nom: 'taux moyen 50 % × x²/(x²+K²)', impot: function (x, K) { return PLAFOND * x * x * x / (x * x + K * K); },
              marginal: function (x, K) { var a = x * x, b = K * K; return PLAFOND * (a * a + 3 * a * b) / ((a + b) * (a + b)); } },
    hyper3: { nom: 'taux moyen 50 % × x³/(x³+K³)', impot: function (x, K) { return PLAFOND * x * x * x * x / (x * x * x + K * K * K); },
              marginal: function (x, K) { var a = x * x * x, b = K * K * K; return PLAFOND * (a * a + 4 * a * b) / ((a + b) * (a + b)); } },
    // H611 : formes ajustées D', E' = taux MARGINAL 50 % × x^n/(x^n+K^n), impôt = intégrale : jamais au-dessus de 50 %, de plus en plus proche de l'exemption quand n croît.
    marg2:  { nom: 'taux marginal 50 % × x²/(x²+K²)', impot: function (x, K) { return PLAFOND * (x - K * Math.atan(x / K)); },
              marginal: function (x, K) { return PLAFOND * x * x / (x * x + K * K); } },
    marg3:  { nom: 'taux marginal 50 % × x³/(x³+K³)', impot: function (x, K) { var u = x / K; return PLAFOND * K * (u - I3(u)); },
              marginal: function (x, K) { var a = x * x * x; return PLAFOND * a / (a + K * K * K); } }
  };
  /** Exemption par héritier (régime de la v2) : 50 % au-dessus de E. */
  function impotExemption(x, E) { return PLAFOND * Math.max(0, x - E); }
  function impot(forme, K, x) { return FORMES[forme].impot(x, K); }
  function marginal(forme, K, x) { return FORMES[forme].marginal(x, K); }

  var _m = null;
  function moyenne(p) { return CD.esperance(function (h) { return h; }, p); }
  /** Part de la recette « 50 % dès le premier euro » conservée par l'impôt-fonction : E[impôt(H)] / (50 % E[H]) (loi H2, sans part sans héritage). */
  var _pc = {};
  function partConservee(forme, K, p) {
    p = p || CD.params(); var k = forme + '|' + K + '|' + p.p0 + '|' + p.echelle; if (_pc[k] !== undefined) return _pc[k];
    var f = FORMES[forme].impot; if (!_m || _m.p0 !== p.p0 || _m.e !== p.echelle) _m = { p0: p.p0, e: p.echelle, v: moyenne(p) };
    return (_pc[k] = CD.esperance(function (h) { return f(h, K); }, p) / (PLAFOND * _m.v));
  }
  /** Part conservée de l'exemption E (modele.js : partImposable). */
  function partExemption(E, p) { return CD.partImposable(p || CD.params(), E); }
  /** K tel que la recette de la fonction égale celle de l'exemption E (bissection : la part conservée croît quand K décroît). */
  function calibrer(forme, E, p) {
    var cible = partExemption(E, p), lo = 1, hi = 1e9, i, m;
    for (i = 0; i < 70; i++) { m = Math.sqrt(lo * hi); if (partConservee(forme, m, p) > cible) lo = m; else hi = m; }
    return Math.sqrt(lo * hi);
  }
  /** Sup du taux marginal sur [1 000 €, 1 Md€] (grille géométrique, pas de 1 %). */
  function margMax(forme, K) { var m = 0, x; for (x = 1000; x < 1e9; x *= 1.01) m = Math.max(m, marginal(forme, K, x)); return m; }
  /** Parts de la cohorte qui paient plus / moins / autant (à 1 € près) avec la fonction qu'avec l'exemption E ; point de croisement x* (impôt égal, au-dessus de E). */
  function comparaison(forme, K, E, p) {
    p = p || CD.params();
    var f = function (sgn) { return CD.esperance(function (h) { var d = impot(forme, K, h) - impotExemption(h, E); return (sgn > 0 ? d > 1 : sgn < 0 ? d < -1 : Math.abs(d) <= 1) ? 1 : 0; }, p); };
    var x = E + 1, d0;
    for (; x < 1e9; x *= 1.001) { d0 = impot(forme, K, x) - impotExemption(x, E); if (d0 < 0) break; }
    return { plus: f(1), moins: f(-1), egal: f(0), croisement: x };
  }
  /** Recette annuelle (Md€) de la fonction : flux × part conservée × 50 % × (1 − fuite). */
  function recette(forme, K, fuite, p) { p = p || CD.params(); return p.flux * partConservee(forme, K, p) * PLAFOND * (1 - fuite); }

  // ---------- Capital de départ : transfert g(H) reçu par un jeune dont l'héritage reçu (ou attendu) vaut H ----------
  // exp : g = G·e^(−H/K) ; hyper : g = G·K/(K + H) ; gauss : g = G·e^(−(H/K)²). Référence : variante C de modele.js, max(0, 40 000 − 50 % H) (coude à 80 000 €).
  var TRANSFERTS = {
    exp:   { nom: 'G·e^(−H/K)', g: function (h, K) { return G * Math.exp(-h / K); }, pente: function (h, K) { return G / K * Math.exp(-h / K); } },
    hyper: { nom: 'G·K/(K+H)', g: function (h, K) { return G * K / (K + h); }, pente: function (h, K) { return G * K / ((K + h) * (K + h)); } },
    gauss: { nom: 'G·e^(−(H/K)²)', g: function (h, K) { return G * Math.exp(-(h / K) * (h / K)); }, pente: function (h, K) { return 2 * G * h / (K * K) * Math.exp(-(h / K) * (h / K)); } }
  };
  var SC = [['favorable', 'bas', 0], ['central', 'central', 0.1], ['defavorable', 'haut', 0.2]];
  /** Coût annuel (Md€) [favorable, central, défavorable] du transfert {forme, K} (cohorte 780 000 / 830 000 / 870 000 ; part sans héritage 0 / 10 / 20 %, comme CD.montants). */
  var _cc = {};
  function coutCapital(c) {
    var k = c.forme + '|' + c.K; if (_cc[k]) return _cc[k];
    var g = TRANSFERTS[c.forme].g;
    return (_cc[k] = SC.map(function (s) { return CD.BASE.cohorte[s[1]] * CD.esperance(function (h) { return g(h, c.K); }, CD.params({ p0: s[2] })) / 1e9; }));
  }
  /** K tel que le coût central égale celui de la variante C (11,5 Md€) ou `cible` (Md€). */
  function calibrerCapital(forme, cible) {
    var t = cible === undefined ? CD.montants('C').central : cible, lo = 1e3, hi = 1e8, i, m;
    for (i = 0; i < 60; i++) { m = Math.sqrt(lo * hi); if (coutCapital({ forme: forme, K: m })[1] > t) hi = m; else lo = m; }
    return Math.sqrt(lo * hi);
  }
  function transfert(c, h) { return TRANSFERTS[c.forme].g(h, c.K); }
  /** Pente maximale de la décroissance (taux marginal implicite du capital) et héritage où elle est atteinte. */
  function penteMax(c) { var m = 0, hx = 0, h; for (h = 0; h < 3e6; h += 100) { var s = TRANSFERTS[c.forme].pente(h, c.K); if (s > m) { m = s; hx = h; } } return { pente: m, h: hx }; }
  /** Taux marginal cumulé maximal (pente du capital + taux marginal de l'impôt-fonction) sur [0, 3 M€], pour un impôt {forme, K}. */
  function margCumuleMax(c, fi) { var m = 0, hx = 0, h; for (h = 0; h < 3e6; h += 100) { var s = TRANSFERTS[c.forme].pente(h, c.K) + marginal(fi.forme, fi.K, h); if (s > m) { m = s; hx = h; } } return { taux: m, h: hx }; }
  return { PLAFOND: PLAFOND, G: G, FORMES: FORMES, TRANSFERTS: TRANSFERTS, impot: impot, impotExemption: impotExemption, marginal: marginal, partConservee: partConservee, partExemption: partExemption,
    calibrer: calibrer, margMax: margMax, comparaison: comparaison, recette: recette, coutCapital: coutCapital, calibrerCapital: calibrerCapital, transfert: transfert, penteMax: penteMax, margCumuleMax: margCumuleMax };
})(this);
if (typeof module !== 'undefined' && module.exports) module.exports = CDC;
