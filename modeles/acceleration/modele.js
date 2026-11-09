/*
 * modeles/acceleration/modele.js
 * Fonctions pures, sans dépendance, pour mesurer « ce qui accélère » :
 *  - ajustement exponentiel (régression log-linéaire) et logistique (grille sur le plafond) ;
 *  - temps de doublement, et test d'accélération (doublement par fenêtre glissante) ;
 *  - intervalles entre générations de produits (robotique) ;
 *  - projection d'une « fourchette de bascule » à partir d'hypothèses paramétrables.
 * Ce sont des outils d'extrapolation : ils produisent des hypothèses et des ordres de
 * grandeur, jamais des prédictions. Voir methode.md (hypothèses H1 à H8).
 * Compatible navigateur, Node (module.exports) et JavaScriptCore (jsc).
 */
(function (root) {
  'use strict';

  // ---------- Utilitaires de date ----------

  /** "2024-05-13" | "2024-05" | "2024" -> année décimale (2024.36). */
  function anneeDecimale(s) {
    var str = String(s).trim();
    var m = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/.exec(str);
    if (!m) return NaN;
    var y = +m[1];
    var mo = m[2] ? +m[2] : 7; // année seule -> milieu d'année
    var d = m[3] ? +m[3] : (m[2] ? 15 : 1);
    var bissextile = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    var cumul = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var jour = cumul[mo - 1] + d - 1 + (bissextile && mo > 2 ? 1 : 0);
    return y + jour / (bissextile ? 366 : 365);
  }

  /** Différence en mois entre deux dates texte. */
  function moisEntre(a, b) {
    return (anneeDecimale(b) - anneeDecimale(a)) * 12;
  }

  // ---------- Régressions ----------

  /** Moindres carrés ordinaires y = a + b x. Renvoie {a, b, r2, n, seB}. */
  function regressionLineaire(xs, ys) {
    var n = xs.length;
    if (n < 2) return { a: NaN, b: NaN, r2: NaN, n: n, seB: NaN };
    var mx = 0, my = 0, i;
    for (i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; }
    mx /= n; my /= n;
    var sxx = 0, sxy = 0, syy = 0;
    for (i = 0; i < n; i++) {
      sxx += (xs[i] - mx) * (xs[i] - mx);
      sxy += (xs[i] - mx) * (ys[i] - my);
      syy += (ys[i] - my) * (ys[i] - my);
    }
    var b = sxy / sxx, a = my - b * mx;
    var sse = 0;
    for (i = 0; i < n; i++) { var e = ys[i] - (a + b * xs[i]); sse += e * e; }
    var r2 = syy > 0 ? 1 - sse / syy : 1;
    var seB = n > 2 ? Math.sqrt(sse / (n - 2) / sxx) : NaN;
    return { a: a, b: b, r2: r2, n: n, seB: seB };
  }

  /**
   * Ajustement exponentiel y = y0 * exp(k (t - t0)) par régression de ln(y) sur t.
   * points : [{t: annéeDécimale, y: valeur > 0}]
   * Renvoie k (taux continu par an), facteurAnnuel = e^k, doublementMois, r2,
   * et un intervalle approximatif (±1,96 erreur-type) sur le doublement.
   */
  function ajusterExponentielle(points) {
    var pts = points.filter(function (p) { return p.y > 0 && isFinite(p.t); });
    var xs = pts.map(function (p) { return p.t; });
    var ys = pts.map(function (p) { return Math.log(p.y); });
    var r = regressionLineaire(xs, ys);
    var k = r.b;
    var kBas = k - 1.96 * r.seB, kHaut = k + 1.96 * r.seB;
    return {
      k: k,
      facteurAnnuel: Math.exp(k),
      doublementMois: tempsDoublementMois(k),
      doublementMoisIC: [tempsDoublementMois(kHaut), tempsDoublementMois(kBas)],
      r2: r.r2,
      n: r.n,
      lnA: r.a,
      predire: function (t) { return Math.exp(r.a + k * t); }
    };
  }

  /** Temps de doublement (mois) pour un taux continu annuel k. */
  function tempsDoublementMois(k) {
    return k > 0 ? (Math.LN2 / k) * 12 : Infinity;
  }

  /** Taux continu annuel à partir d'un facteur multiplicatif sur une durée (années). */
  function tauxDepuisFacteur(facteur, dureeAnnees) {
    return Math.log(facteur) / dureeAnnees;
  }

  /**
   * Ajustement logistique y = K / (1 + exp(-r (t - tm))).
   * On teste une grille de plafonds K (> max observé) et on garde celui qui maximise
   * le R² de la linéarisation ln(K/y - 1) = -r t + r tm. Sans dépendance, robuste.
   * options : {plafonds: [..]} ; par défaut de 1,001x à 50x le maximum observé (pas de 1 %).
   * Attention : avant le point d'inflexion, K est très mal identifié (cf. methode.md H6).
   */
  function ajusterLogistique(points, options) {
    var pts = points.filter(function (p) { return p.y > 0 && isFinite(p.t); });
    var max = Math.max.apply(null, pts.map(function (p) { return p.y; }));
    var plafonds = (options && options.plafonds) || (function () {
      var g = [], f;
      for (f = 1.001; f <= 50; f *= 1.01) g.push(max * f);
      return g;
    })();
    var meilleur = null;
    plafonds.forEach(function (K) {
      if (K <= max) return;
      var xs = pts.map(function (p) { return p.t; });
      var ys = pts.map(function (p) { return Math.log(K / p.y - 1); });
      var r = regressionLineaire(xs, ys);
      var rr = -r.b, tm = r.a / rr;
      if (!(rr > 0)) return;
      // R² calculé dans l'espace d'origine (log) pour comparer les K entre eux
      var sse = 0, my = 0, syy = 0;
      pts.forEach(function (p) { my += Math.log(p.y); }); my /= pts.length;
      pts.forEach(function (p) {
        var pred = K / (1 + Math.exp(-rr * (p.t - tm)));
        var e = Math.log(p.y) - Math.log(pred); sse += e * e;
        syy += (Math.log(p.y) - my) * (Math.log(p.y) - my);
      });
      var r2 = 1 - sse / syy;
      if (!meilleur || r2 > meilleur.r2) meilleur = { K: K, r: rr, tm: tm, r2: r2 };
    });
    if (meilleur) {
      var m = meilleur;
      m.predire = function (t) { return m.K / (1 + Math.exp(-m.r * (t - m.tm))); };
      m.plafondSurMax = m.K / max;
    }
    return meilleur;
  }

  /**
   * Test d'accélération : temps de doublement estimé sur des fenêtres glissantes.
   * Si le doublement raccourcit d'une fenêtre à l'autre, la croissance est
   * plus qu'exponentielle ; s'il s'allonge, elle ralentit (signe possible de sigmoïde).
   */
  function doublementParFenetre(points, largeurAnnees, pasAnnees) {
    var pts = points.slice().sort(function (a, b) { return a.t - b.t; });
    var t0 = pts[0].t, tFin = pts[pts.length - 1].t, out = [];
    for (var debut = t0; debut + largeurAnnees <= tFin + 1e-9; debut += pasAnnees) {
      var fen = pts.filter(function (p) { return p.t >= debut && p.t <= debut + largeurAnnees; });
      if (fen.length >= 3) {
        var f = ajusterExponentielle(fen);
        out.push({ debut: debut, fin: debut + largeurAnnees, n: fen.length, doublementMois: f.doublementMois });
      }
    }
    return out;
  }

  /** Record glissant : ne garde que les points qui battent le maximum précédent. */
  function recordGlissant(points) {
    var pts = points.slice().sort(function (a, b) { return a.t - b.t; }), max = -Infinity, out = [];
    pts.forEach(function (p) { if (p.y > max) { max = p.y; out.push(p); } });
    return out;
  }

  // ---------- Robotique : générations de produits ----------

  /**
   * generations : [{entreprise, produit, date_annonce, date_livraison_client}]
   * Renvoie, par entreprise, les intervalles (mois) entre annonces successives,
   * les délais annonce -> livraison réelle, et la pente des intervalles
   * (négative = le cycle raccourcit).
   */
  function intervallesGenerations(generations) {
    var parE = {};
    generations.forEach(function (g) {
      if (!g.date_annonce) return;
      (parE[g.entreprise] = parE[g.entreprise] || []).push(g);
    });
    var res = {};
    Object.keys(parE).forEach(function (e) {
      var gs = parE[e].slice().sort(function (a, b) { return anneeDecimale(a.date_annonce) - anneeDecimale(b.date_annonce); });
      var inter = [], delais = [];
      for (var i = 1; i < gs.length; i++) {
        inter.push({ de: gs[i - 1].produit, a: gs[i].produit, mois: moisEntre(gs[i - 1].date_annonce, gs[i].date_annonce) });
      }
      gs.forEach(function (g) {
        delais.push({
          produit: g.produit,
          moisAnnonceLivraison: g.date_livraison_client ? moisEntre(g.date_annonce, g.date_livraison_client) : null
        });
      });
      var pente = inter.length >= 2
        ? regressionLineaire(inter.map(function (x, i) { return i; }), inter.map(function (x) { return x.mois; })).b
        : NaN;
      res[e] = { intervalles: inter, delaisLivraison: delais, penteMoisParGeneration: pente };
    });
    return res;
  }

  // ---------- Fourchette de bascule ----------

  /**
   * Quand l'horizon des agents (METR, minutes de travail d'expert à 50 % de réussite)
   * atteint-il un seuil donné ?
   * params : {
   *   dateDepart (année décimale), horizonDepartMin,
   *   seuilMin (ex. 1 mois de travail = 167 h * 60),
   *   doublementMois (rythme initial),
   *   variationDoublementParAn (0 = exponentielle pure ; > 0 = ralentissement :
   *       le doublement s'allonge de ce facteur relatif chaque année ; < 0 = accélération),
   *   ecartFiabilite (facteur pour passer de 50 % à 80 % de réussite, ex. 5)
   * }
   * Intégration pas à pas (mensuelle). Renvoie l'année décimale d'atteinte (ou Infinity si > 2100).
   */
  function dateAtteinteSeuil(params) {
    var t = params.dateDepart, h = params.horizonDepartMin;
    var cible = params.seuilMin * (params.ecartFiabilite || 1);
    var d = params.doublementMois, v = params.variationDoublementParAn || 0;
    var pas = 1 / 12;
    while (h < cible) {
      h *= Math.pow(2, 1 / d); // un mois écoulé
      t += pas;
      d *= Math.pow(1 + v, pas);
      if (t > 2100 || !(d > 0) || d > 1200) return Infinity;
    }
    return t;
  }

  /**
   * Scénarios bas / central / haut (paramètres exposés, voir methode.md).
   * scenarios : {nom: params} -> {nom: année d'atteinte}
   */
  function fourchetteBascule(scenarios) {
    var out = {};
    Object.keys(scenarios).forEach(function (k) { out[k] = dateAtteinteSeuil(scenarios[k]); });
    return out;
  }

  /**
   * Agrégation de prévisions publiées (médianes) : renvoie min, quartiles, médiane, max
   * des médianes, éventuellement pondérées. previsions : [{mediane, poids}]
   */
  function agregerPrevisions(previsions) {
    var v = previsions.filter(function (p) { return isFinite(p.mediane); })
      .map(function (p) { return { x: p.mediane, w: p.poids == null ? 1 : p.poids }; })
      .sort(function (a, b) { return a.x - b.x; });
    var tot = v.reduce(function (s, p) { return s + p.w; }, 0);
    function q(f) {
      var c = 0;
      for (var i = 0; i < v.length; i++) { c += v[i].w; if (c >= f * tot - 1e-9) return v[i].x; }
      return v[v.length - 1].x;
    }
    return { n: v.length, min: v[0].x, q1: q(0.25), mediane: q(0.5), q3: q(0.75), max: v[v.length - 1].x };
  }

  /**
   * Délai « l'IA ne sait pas faire » -> « niveau expert humain » en fonction de la
   * date de création de la tâche / du benchmark : pente < 0 = le délai raccourcit.
   * lignes : [{date_incapable, delai_annees}]
   */
  function tendanceDelais(lignes) {
    var xs = [], ys = [];
    lignes.forEach(function (l) {
      var t = anneeDecimale(l.date_incapable), d = +l.delai_annees;
      if (isFinite(t) && isFinite(d)) { xs.push(t); ys.push(d); }
    });
    return regressionLineaire(xs, ys);
  }

  // ---------- Lecture CSV minimale (pour le site et les tests) ----------

  /** Parse un CSV (virgules, guillemets doubles), ignore les lignes commençant par #. */
  function parseCSV(texte) {
    var lignes = [], champ = '', ligne = [], q = false, i, c;
    var txt = texte.split(/\r?\n/).filter(function (l) { return l.charAt(0) !== '#'; }).join('\n');
    for (i = 0; i < txt.length; i++) {
      c = txt.charAt(i);
      if (q) {
        if (c === '"' && txt.charAt(i + 1) === '"') { champ += '"'; i++; }
        else if (c === '"') q = false;
        else champ += c;
      } else if (c === '"') q = true;
      else if (c === ',') { ligne.push(champ); champ = ''; }
      else if (c === '\n') { ligne.push(champ); lignes.push(ligne); ligne = []; champ = ''; }
      else champ += c;
    }
    if (champ !== '' || ligne.length) { ligne.push(champ); lignes.push(ligne); }
    var tete = lignes.shift();
    return lignes.filter(function (l) { return l.length > 1; }).map(function (l) {
      var o = {}; tete.forEach(function (h, j) { o[h] = l[j]; }); return o;
    });
  }

  /** Extrait une série {t, y} d'un tableau d'objets de series_courbes.csv. */
  function serie(lignes, nom, natures) {
    return lignes.filter(function (l) {
      return l.serie === nom && (!natures || natures.indexOf(l.nature) >= 0);
    }).map(function (l) { return { t: anneeDecimale(l.date), y: +l.valeur, date: l.date }; })
      .filter(function (p) { return isFinite(p.t) && isFinite(p.y); });
  }

  var api = {
    anneeDecimale: anneeDecimale, moisEntre: moisEntre,
    regressionLineaire: regressionLineaire,
    ajusterExponentielle: ajusterExponentielle, ajusterLogistique: ajusterLogistique,
    tempsDoublementMois: tempsDoublementMois, tauxDepuisFacteur: tauxDepuisFacteur,
    doublementParFenetre: doublementParFenetre, recordGlissant: recordGlissant,
    intervallesGenerations: intervallesGenerations,
    dateAtteinteSeuil: dateAtteinteSeuil, fourchetteBascule: fourchetteBascule,
    agregerPrevisions: agregerPrevisions, tendanceDelais: tendanceDelais,
    parseCSV: parseCSV, serie: serie
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Acceleration = api;
})(this);
