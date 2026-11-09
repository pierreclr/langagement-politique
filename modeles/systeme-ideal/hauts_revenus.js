/*
 * modeles/systeme-ideal/hauts_revenus.js — T47, « hauts revenus et échappement fiscal » (02/11/2026). Fonctions pures au-dessus de modele.js, voies.js, sante.js,
 * optimisation.js, retraites2.js et palier1.js (charger dans cet ordre). Hypothèses H123 à H133 : methode.md § 16 (H131 à H133 : plafond 75 %, élasticités par bande, holdings passifs). ⚠️ = non confirmé.
 *
 * Problème : dans le palier 1 (et la voie R2), le cadre à 8 000 € nets gagne +1 019 €/mois et le dirigeant avec holding +2 528 € en espèces, alors que l'auteur
 * demande la même logique pour les hauts salaires et l'évasion fiscale. Trois leviers, tous continus (aucun seuil), tous à taux marginal total ≤ 75 % (plafond H131, jurisprudence ; avant : < 80 %) :
 *   (1) second coude de l'équation d'impôt : I2(R) = t2 × [(R − R1) − R1 ln(R/R1)] pour R > R1, en plus du coude R0 (taux marginal t2 (1 − R1/R)) ;
 *   (2) reprise dégressive du socle entre deux niveaux de revenu mensuel (coût employeur + capital) ra et rb : socle × clamp((rb − r)/(rb − ra), 0, 1) ;
 *   (3) holdings : impôt sur la quote-part des bénéfices retenus exigible dans l'année (pas de différé), au lieu du report jusqu'à la distribution (modele.js `situation`).
 * Les effets sont calculés tranche par tranche (bandes de recettesCourants, dispersion log-normale à 5 points) avec les mêmes réactions que modele.js : élasticité du revenu
 * imposable du scénario (eti) appliquée au revenu d'activité des bandes touchées, et exil des 0,1 % et 1 % supérieurs (MU_EXIL 0,8 × mobil). Capital et holdings : la transparence
 * (H21) est supposée neutraliser la réaction du capital, comme dans le palier 1 (⚠️ H127). Des ordres de grandeur sous hypothèses, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var V = root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null);
  var O = root.Optimisation || (typeof require !== 'undefined' ? require('./optimisation.js') : null);
  var R2 = root.Retraites2 || (typeof require !== 'undefined' ? require('./retraites2.js') : null);
  var FA = root.FiscaliteActuelle || (typeof require !== 'undefined' ? require('./fiscalite_actuelle.js') : null);
  var P1 = root.Palier1 || (typeof require !== 'undefined' ? require('./palier1.js') : null);
  var D = M.DONNEES, F = V.fus;
  var MU_EXIL = 0.8;                                                             // modele.js (H17)
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };

  /** Correctif nul (équivaut au palier 1) et correctifs testés. R1 : € par an et par adulte ; ra, rb : € par mois et par adulte ; differe : false = pas de différé sur les holdings. */
  var AUCUN = { t2: 0, R1: 100000, ra: 0, rb: 0, differe: true, partPassive: 1, etiUnique: false };
  /** Plafond du taux marginal total retenu (H131) : 75 % (Conseil constitutionnel : 75 % admis en 2013, 75,04 % et 82 % censurés). */
  var PLAFOND = 0.75;
  /** Élasticités par bande (H132) : D1-D9 (bandes touchées : D6-D9) et D10 (D10a à D10e), par scénario bas / central / haut ; Cabannes-Houdré-Landais 2014 pour D10 (0,31 [0,15 ; 0,45]) ; D6-D9 : borne 0 (mesure 0,00) à 0,10, central 0,05 ⚠️. */
  var ELAST = { milieu: { bas: 0, central: 0.05, haut: 0.10 }, d10: { bas: 0.15, central: 0.31, haut: 0.45 } };
  function etiBande(i, sc, c) { c = corr(c); return c.etiUnique ? M.SCENARIOS[sc].eti : (i >= 9 ? ELAST.d10[sc] : ELAST.milieu[sc]); }
  function corr(c) { return F(AUCUN, c || {}); }

  // ---------- Équation d'impôt à deux coudes
  /** Second coude : t2 × [(R − R1) − R1 ln(R/R1)] pour R > R1. Continu, de dérivée nulle en R1. */
  function impot2(R, c) { c = corr(c); return (c.t2 > 0 && R > c.R1) ? c.t2 * ((R - c.R1) - c.R1 * Math.log(R / c.R1)) : 0; }
  function marg2(R, c) { c = corr(c); return (c.t2 > 0 && R > c.R1) ? c.t2 * (1 - c.R1 / R) : 0; }
  /** Part du socle conservée à un revenu mensuel r (coût employeur + capital) : 1 sous ra, 0 au-dessus de rb, linéaire entre les deux. */
  function partSocle(r, c) {
    c = corr(c);
    if (!(c.rb > c.ra)) return 1;
    return Math.max(0, Math.min(1, (c.rb - r) / (c.rb - c.ra)));
  }
  /** Taux marginal total maximal (borne supérieure sur une grille de revenus annuels par adulte de 10 000 € à 10^10 €, reprise du socle comprise) et revenu où il est atteint. */
  function marginalMax(st, c) {
    var best = { taux: 0, R: 0 }, R, t;
    for (R = 10000; R <= 1e10; R *= 1.02) { t = marginalTotal(R, st, c); if (t > best.taux) best = { taux: t, R: R }; }
    return best;
  }
  /** Plus grand t2 (au pas de 0,0001) tel que le taux marginal total maximal reste ≤ plafond, les autres correctifs de c étant fixés (dichotomie ; 0 si même t2 = 0 dépasse). */
  function t2Plafond(st, c, plafond) {
    plafond = plafond === undefined ? PLAFOND : plafond;
    var a = 0, b = 0.5, i, m;
    if (marginalMax(st, F(c, { t2: 0 })).taux > plafond) return 0;
    for (i = 0; i < 14; i++) { m = (a + b) / 2; if (marginalMax(st, F(c, { t2: m })).taux <= plafond) a = m; else b = m; }
    return Math.floor(a * 1e4) / 1e4;
  }
  /** Pente de la reprise (€ de socle par € de revenu) dans la zone ra-rb. */
  function penteReprise(S, c) { c = corr(c); return c.rb > c.ra ? S / (c.rb - c.ra) : 0; }
  /** Taux marginal total (impôt à plat + continu + second coude + reprise) à un revenu annuel R par adulte, dans la zone de reprise s'il y en a une. */
  function marginalTotal(R, st, c) {
    c = corr(c);
    var P = M.param(F(O.configR(st), { scenario: 'central' })), r = R / 12;
    return M.marginal(R, P) + marg2(R, c) + ((c.rb > c.ra && r > c.ra && r < c.rb) ? penteReprise(st.socle, c) : 0);
  }

  // ---------- Recette nette des correctifs 1 et 2 (tranche par tranche, avec réactions)
  /**
   * Recette supplémentaire nette (Md€/an) du second coude et de la reprise du socle : par bande et par point de dispersion, recette mécanique (I2 + socle repris),
   * après réaction du revenu d'activité à la hausse du taux marginal (élasticité eti : L × ((1 − τ − dτ)/(1 − τ))^eti) et exil (rang ≥ 3, comme modele.js).
   * Les exilés ne paient plus rien : on retire leur impôt de base (impotAn) de la recette.
   */
  function extra(p, sc, c) {
    c = corr(c);
    if (!(c.t2 > 0) && !(c.rb > c.ra)) return { netMd: 0, parBande: [] };
    var P = M.param(F(p, { scenario: sc })), s = M.SCENARIOS[sc], rc = M.recettesCourants(P), S = P.socle, tot = 0, out = [];
    rc.parBande.forEach(function (b, i) {
      var top = i >= 9, rang = i - 9, sigma = top ? 0.15 : P.dispersion, g, ret = 1, delta = 0, meca = 0;
      for (g = 0; g < 5; g++) {
        var m = Math.exp(sigma * GH.z[g] - sigma * sigma / 2), L = b.L * m, K = b.K * m, R = L + K, tm = Math.min(0.99, M.marginal(R, P));
        var dtau = marg2(R, c) + ((c.rb > c.ra && R / 12 > c.ra && R / 12 < c.rb) ? penteReprise(S, c) : 0);
        var f = dtau > 0 ? Math.pow(Math.max(0.01, 1 - tm - dtau) / (1 - tm), etiBande(i, sc, c)) : 1;
        var R1n = L * f + K, base = M.impot(R, P);
        var extraTax = M.impot(R1n, P) - base + impot2(R1n, c) + 12 * S * (1 - partSocle(R1n / 12, c));
        if (top && rang >= 3 && dtau > 0) {                                             // exil : part des personnes qui partent (même règle que modele.js)
          var r0 = (1 - tm) / (1 - D.tmefActuel[9]), r1 = (1 - tm - dtau) / (1 - D.tmefActuel[9]);
          var q0 = r0 < 1 ? 1 - MU_EXIL * (1 - Math.pow(r0, s.mobil)) : 1, q1 = r1 < 1 ? 1 - MU_EXIL * (1 - Math.pow(r1, s.mobil)) : 1;
          var qq = q1 / q0;
          extraTax = qq * extraTax - (1 - qq) * (base + 0);                                // les partants ne paient plus l'impôt de base
        }
        delta += GH.w[g] * extraTax;
      }
      var rec = b.n * delta / 1e9; tot += rec; out.push({ id: b.id, recetteMd: rec });
    });
    return { netMd: tot, parBande: out };
  }

  // ---------- Solde et taux plat
  /** Solde public central/bas/haut (Md€/an) avec correctifs : palier 1 + recette nette du second coude et de la reprise. Les holdings sans différé ne changent pas le solde (impôt déjà dû, seulement plus tôt). */
  function solde(st, sc, o, c) { return P1.solde(st, sc, o) + extra(O.configR(st), sc, c).netMd; }
  function soldes(st, o, c) { return { bas: solde(st, 'bas', o, c), central: solde(st, 'central', o, c), haut: solde(st, 'haut', o, c) }; }
  /** Plus petit taux plat tel que le solde central ≥ cible (défaut : déficit actuel). */
  function platNecessaire(st, cible, o, c) {
    cible = cible === undefined ? D.deficitActuel : cible;
    var f = function (t) { return solde(F(st, { tPlat: t }), 'central', o, c) - cible; }, t, prev = 0, i;
    for (t = 0.01; t <= 0.8 + 1e-9; t = Math.round((t + 0.01) * 100) / 100) {
      if (f(t) >= 0) { var a = prev, b = t; for (i = 0; i < 25; i++) { var m = (a + b) / 2; if (f(m) >= 0) b = m; else a = m; } return b; }
      prev = t;
    }
    return null;
  }
  /** Palier 1 corrigé : taux plat exact, retenu (demi-point supérieur), soldes. */
  function palier(x, o, c) {
    var st0 = P1.stFor(x), t = platNecessaire(st0, undefined, o, c), tr = Math.ceil(t * 200 - 1e-9) / 200, st = F(st0, { tPlat: tr });
    return { st: st, tPlatExact: t, tPlat: tr, soldes: soldes(st, o, c), extraCentralMd: extra(O.configR(st), 'central', c).netMd };
  }

  // ---------- Profils
  var L = P1.L_PAR_NET;
  var NET = FA.netApresIR;
  /** Sources des profils d'actifs. « Avant » : loi actuelle (cas T14 du modèle, ou net moins IR 2025 estimé pour les cadres, ⚠️ H101 et H110). */
  var PROFILS = [
    { id: 'smic35', libelle: 'Smic à 35 h', src: function () { return M.CAS.filter(function (x) { return x.id === 'smic35'; })[0]; } },
    { id: 'median', libelle: 'Salarié médian (2 116 € nets)', src: function () { return { id: 'median', adultes: 1, enfants: 0, age: 40, heuresSemaine: 35, coutMensuelPlein: 3676.54, actuel: 2115.89 }; } },
    { id: 'cadre4k', libelle: 'Cadre à 60 k€ brut (≈ 4 000 € nets)', src: function () { var c = M.CAS.filter(function (x) { return x.id === 'cadre60'; })[0]; return Object.assign({}, c, { actuel: NET(3900), actuelNote: '« avant » = 3 900 € nets (5 000 € bruts × 0,78) moins l\'IR calculé (fiscalite_actuelle.js, H105) ; 3 423 € dans modele.js (interpolation T14, ⚠️)' }); } },
    { id: 'cadre8k', libelle: 'Cadre à 8 000 € nets (coût employeur 14 712 €)', src: function () { return { id: 'cadre8k', adultes: 1, enfants: 0, age: 45, heuresSemaine: 35, coutMensuelPlein: FA.coutEmployeurDepuisNet(8000), actuel: NET(8000) }; } },
    { id: 'cadre15k', libelle: 'Cadre à 15 000 € nets (coût employeur 27 584 €)', src: function () { return { id: 'cadre15k', adultes: 1, enfants: 0, age: 45, heuresSemaine: 35, coutMensuelPlein: 15000 * L, actuel: NET(15000) }; } },
    { id: 'dirigeantHolding', libelle: 'Dirigeant avec holding (30 000 € brut + 300 000 € retenus par an)', src: function () { return M.CAS.filter(function (x) { return x.id === 'dirigeantHolding'; })[0]; } }
  ];
  /**
   * Revenu mensuel avant / après de chaque profil d'actif avec les correctifs c. Espèces : on retire le second coude, la reprise du socle et, sans différé, l'impôt sur la quote-part des holdings.
   * Revenu économique (dirigeant) : espèces + bénéfices retenus après IS et impôt différé ; il ne dépend pas de la règle de différé.
   */
  function profils(st, c) {
    c = corr(c);
    var p = F(O.configR(st), { scenario: 'central' });
    return PROFILS.map(function (pr) {
      var s = pr.src(), x = M.situation(s, p), ad = s.adultes || 1, R = x.R / ad;
      var i2 = impot2(R, c) * ad / 12, rep = p.socle * (1 - partSocle(x.R / ad / 12, c)) * ad;
      var sansDiffere = (!c.differe) ? c.partPassive * x.impotDiffereAn / 12 : 0;      // H133 : seule la part passive de l'assiette (holdings de gestion de patrimoine) est imposée sans différé
      var apres = x.apresMois - i2 - rep - sansDiffere;
      var o = { id: pr.id, libelle: pr.libelle, avantMois: s.actuel, apresMois: apres, ecartMois: apres - s.actuel, R: x.R, tauxMarginal: marginalTotal(R, st, c) };
      if (s.actuelEco !== undefined) { o.avantEcoMois = s.actuelEco; o.apresEcoMois = x.apresEcoMois - i2 - rep; o.ecartEcoMois = o.apresEcoMois - s.actuelEco; }
      return o;
    });
  }
  /** Retraité à 3 500 € nets (pension seule, hors contribution des hautes pensions déjà dans le palier 1) : écart du palier 1 inchangé par les correctifs de ce module. */
  function retraite3500() {
    var r = P1.casAutres(P1.stFor({})).filter(function (x) { return x.id.indexOf('3500') >= 0 || /3 500/.test(x.libelle); })[0];
    return r || null;
  }

  // ---------- Options nommées
  var OPTIONS = {
    A: { nom: 'A. Palier 1 sans correctif', c: {} },
    B: { nom: 'B. Holdings sans différé (impôt sur la quote-part exigible dans l\'année)', c: { differe: false } },
    C: { nom: 'C. Reprise du socle entre 8 000 et 14 000 € de revenu mensuel', c: { ra: 8000, rb: 14000 } },
    D: { nom: 'D. Second coude : 8 % au-delà de 60 000 € par an et par adulte', c: { t2: 0.08, R1: 60000 } },
    B2: { nom: 'B2. Holdings passifs sans différé (preuve contraire ouverte ; 70 % de l\'assiette, ⚠️ H133)', c: { differe: false, partPassive: 0.7 } },
    E73: { nom: 'E73 (RECOMMANDÉE depuis le 01/11/2026 : limite 73 %, maximum 73,0 % reprise comprise). B2 + reprise du socle entre 7 500 et 15 000 € + second coude 8 % au-delà de 60 000 €', c: { differe: false, partPassive: 0.7, ra: 7500, rb: 15000, t2: 0.08, R1: 60000 } },
    E: { nom: 'E (ancienne recommandation : limite 73 %, mais maximum 74,1 % dans la zone de reprise, qui commence à 8 000 €). B2 + C + D', c: { differe: false, partPassive: 0.7, ra: 8000, rb: 14000, t2: 0.08, R1: 60000 } },
    E75: { nom: 'E75 (la plus dure admissible : maximum 75,0 %). B2 + C + second coude 9,36 % au-delà de 60 000 €', c: { differe: false, partPassive: 0.7, ra: 8000, rb: 14000, t2: 0.0936, R1: 60000 } },
    E70: { nom: 'E70 (variante : limite 70 %, maximum 72,2 %). B2 + C + second coude 5 % au-delà de 60 000 €', c: { differe: false, partPassive: 0.7, ra: 8000, rb: 14000, t2: 0.05, R1: 60000 } },
    F: { nom: 'F (ÉCARTÉE : limite 77 % > 75 %). B + C + second coude 12 % au-delà de 60 000 €', ecartee: true, c: { differe: false, ra: 8000, rb: 14000, t2: 0.12, R1: 60000 } },
    G: { nom: 'G (plus légère : limite 71 %, maximum 72,1 %). B2 + C + second coude 6 % au-delà de 80 000 €', c: { differe: false, partPassive: 0.7, ra: 8000, rb: 14000, t2: 0.06, R1: 80000 } }
  };

  /**
   * Frontière sous un plafond de taux marginal total (01/11/2026) : parmi une grille de (R1, ra, rb), avec le plus grand t2 compatible avec le plafond (reprise comprise),
   * la combinaison qui minimise le plus grand des gains des cadres à 8 k et 15 k (en €/mois), sous deux garde-fous : aucun des deux cadres ne perd, et le cadre à 4 k perd au plus 60 € de plus qu'avec A.
   * Le salarié médian reste intact (R1 ≥ 60 000 € et ra ≥ 7 000 € sont au-dessus de son coût employeur de 44 k€ par an). Holdings : B2, comme E.
   */
  function frontiere(st, plafond) {
    var base = profils(st, {}), g4 = pick(base, 'cadre4k').ecartMois, best = null;
    function pick(l, id) { return l.filter(function (x) { return x.id === id; })[0]; }
    [60000, 65000, 70000, 80000].forEach(function (R1) { [7000, 7500, 8000, 8500, 9000].forEach(function (ra) { [12000, 13000, 14000, 15000, 16000, 18000, 20000].forEach(function (rb) {
      if (rb <= ra + 3000) return;
      var c = { differe: false, partPassive: 0.7, ra: ra, rb: rb, R1: R1 }, t = t2Plafond(st, c, plafond);
      if (t <= 0) return;
      c.t2 = t;
      var p = profils(st, c), c4 = pick(p, 'cadre4k').ecartMois, c8 = pick(p, 'cadre8k').ecartMois, c15 = pick(p, 'cadre15k').ecartMois, m = Math.max(c8, c15);
      if (c4 < g4 - 60 || c8 < 0 || c15 < 0) return;
      if (!best || m < best.max) best = { c: c, R1: R1, ra: ra, rb: rb, t2: t, cadre4k: c4, cadre8k: c8, cadre15k: c15, max: m, maximumMarginal: marginalMax(st, c).taux };
    }); }); });
    return best;
  }

  var API = { frontiere: frontiere, AUCUN: AUCUN, corr: corr, impot2: impot2, marg2: marg2, partSocle: partSocle, penteReprise: penteReprise, marginalTotal: marginalTotal, marginalMax: marginalMax, t2Plafond: t2Plafond, PLAFOND: PLAFOND, ELAST: ELAST, etiBande: etiBande, extra: extra,
    solde: solde, soldes: soldes, platNecessaire: platNecessaire, palier: palier, profils: profils, PROFILS: PROFILS, retraite3500: retraite3500, OPTIONS: OPTIONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.HautsRevenus = API;
})(this);
