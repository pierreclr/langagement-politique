/*
 * modeles/retraites/age_libre.js
 * « Âge libre avec pension ajustée » : départ possible dès 60 ans, pension multipliée par un coefficient
 * actuariel, plancher, départ anticipé sans réduction pour carrières longues ou pénibles, levier « niveau »
 * (indexation des pensions au-dessus d'un seuil sur les prix moins un écart ; contribution des hautes pensions).
 * Fonctions pures, sans dépendance externe, compatibles navigateur, Node et JavaScriptCore (jsc).
 * S'appuie sur modele.js (distribution des pensions) sans le modifier : charger modele.js avant ce fichier.
 *   jsc modele.js age_libre.js test_age_libre.js
 * Hypothèses H44 à H60 : voir methode.md § 11 ; H61 à H70 (âge de référence indexé) : § 12. Ordres de grandeur, jamais des prédictions.
 * Unités : Md€ de 2025 (euros constants), millions de personnes, €/mois, âges en années.
 */
(function (root) {
  'use strict';
  var R = root.Retraites || (typeof require !== 'undefined' ? require('./modele.js') : null);

  // ---------- Données ----------
  // Espérance de vie restante à l'âge x (années), France 2023, de 55 à 90 ans (Eurostat demo_mlexpec, tables Insee).
  // Voir donnees/esperance_vie_FR_2023_eurostat.csv.
  var EV = {
    T: [30.2, 29.3, 28.5, 27.6, 26.7, 25.9, 25.0, 24.2, 23.4, 22.6, 21.8, 21.0, 20.2, 19.4, 18.6, 17.8, 17.1, 16.3, 15.6, 14.8, 14.1, 13.4, 12.7, 12.0, 11.3, 10.6, 10.0, 9.3, 8.7, 8.1, 7.5, 7.0, 6.5, 6.0, 5.5, 5.1],
    M: [27.8, 27.0, 26.1, 25.3, 24.5, 23.7, 22.9, 22.1, 21.3, 20.5, 19.7, 19.0, 18.3, 17.5, 16.8, 16.1, 15.4, 14.7, 14.0, 13.3, 12.6, 12.0, 11.3, 10.7, 10.1, 9.4, 8.8, 8.3, 7.7, 7.1, 6.6, 6.1, 5.7, 5.2, 4.8, 4.4],
    F: [32.4, 31.5, 30.6, 29.7, 28.8, 27.9, 27.0, 26.1, 25.2, 24.4, 23.5, 22.7, 21.8, 21.0, 20.1, 19.3, 18.5, 17.7, 16.9, 16.0, 15.2, 14.5, 13.7, 12.9, 12.2, 11.4, 10.7, 10.0, 9.3, 8.7, 8.1, 7.5, 6.9, 6.4, 5.9, 5.4]
  };
  var AGE0 = 55;

  var D = {
    // Trajectoire COR (RA 2026, scénario de référence). Points 2025/2030/2045/2070 sourcés ; 2040 et 2060 interpolés (V10009).
    depensePctPIB: { 2025: 14.1, 2030: 14.1, 2040: 14.15, 2045: 14.2, 2060: 14.86, 2070: 15.3 },
    retraites: { 2025: 17.4, 2030: 18.9, 2040: 20.6, 2060: 21.7, 2070: 22.1 },   // M ; 2025 et 2070 sourcés, le reste interpolé
    cotisants: { 2025: 30.6, 2030: 31.4, 2040: 31.0, 2060: 29.6, 2070: 28.9 },   // M ; 2025 et 2070 sourcés, le reste interpolé
    croissancePIB: 0.008,        // H44 : croissance réelle du PIB (productivité 0,7 %/h du COR + emploi), hypothèse
    croissancePensionNeuve: 0.005, // H45 : croissance réelle de la pension des nouveaux retraités
    pib2025: 422.2 / 0.141,
    pensionMoyenne2025: 361e3 / 17.4 / 12 * 12 / 1e3,  // k€/an de droit direct : 361 Md€ / 17,4 M = 20,7 k€
    revenuActiviteMoyen2025: 361e3 / 17.4 / 0.546 / 1e3, // k€/an : pension moyenne / 54,6 % (COR) ≈ 38 k€
    tauxPrelevementTravail: 0.42, // H46 : cotisations + CSG + impôts + TVA induits par un euro de revenu d'activité, ≈ taux de PO
    ageLegalActuel: 62.75,        // H47 : âge d'ouverture des droits, réforme de 2023 suspendue
    ageMoyen2025: 63.1,           // COR : âge conjoncturel de départ 2025
    ageMoyen2045: 64.6,           // COR : stabilisé à 64,6 ans à partir de 2040
    cohorteAnnuelle: 17.4 / 22.6, // H48 : M de départs par an ≈ stock / espérance de vie à 63 ans
    aspa: 1044,                   // €/mois, plancher de référence du système (methode.md H9)
    seuilPauvrete60: 1216         // H49 : seuil à 60 % du niveau de vie médian, personne seule, €/mois (Insee 2022, à actualiser) ⚠️
  };

  // ---------- 1. Mortalité reconstruite à partir de l'espérance de vie ----------
  // La table donne e(x) ; on en tire une force de mortalité ln μ(x) = a + b·u + c·u² (u = x − 70) ajustée par moindres carrés
  // (la dérivée numérique d'une table arrondie à 0,1 an serait trop bruitée). Au-delà de 90 ans, même loi.
  var _fit = {};

  function mu(f, x) { var u = x - 70; return Math.exp(f.a + f.b * u + f.c * u * u); }
  function eModele(f, x0, pas) {
    // e(x0) = ∫ S(t) dt avec S = exp(-∫ μ), intégrale par trapèzes
    var h = pas || 0.25, s = 1, e = 0, x = x0, m0, m1;
    for (var i = 0; i < 800 && s > 1e-7; i++) {
      m0 = mu(f, x); m1 = mu(f, x + h);
      var s1 = s * Math.exp(-(m0 + m1) / 2 * h);
      e += (s + s1) / 2 * h; s = s1; x += h;
    }
    return e;
  }
  function ajuste(sexe) {
    if (_fit[sexe]) return _fit[sexe];
    var tab = EV[sexe];
    function perte(f) {
      var s = 0;
      for (var i = 0; i < tab.length; i += 1) { var d = eModele(f, AGE0 + i, 0.5) - tab[i]; s += d * d; }
      return s;
    }
    var f = { a: -4.9, b: 0.09, c: 0.0002 }, best = perte(f), st = { a: 0.3, b: 0.01, c: 0.0005 };
    for (var it = 0; it < 120; it++) {
      var imp = false;
      ['a', 'b', 'c'].forEach(function (k) {
        [1, -1].forEach(function (sg) {
          var g = { a: f.a, b: f.b, c: f.c }; g[k] += sg * st[k];
          var p = perte(g);
          if (p < best) { best = p; f = g; imp = true; }
        });
      });
      if (!imp) { st.a /= 2; st.b /= 2; st.c /= 2; }
    }
    f.perte = best; f.rmse = Math.sqrt(best / tab.length);
    _fit[sexe] = f;
    return f;
  }
  function sexeOk(s) { return s === 'M' || s === 'F' ? s : 'T'; }

  /** Espérance de vie restante à l'âge x, lue dans la table (interpolation linéaire, 55-90 ans). */
  function esperanceVie(age, sexe) {
    var t = EV[sexeOk(sexe)], i = Math.min(Math.max(age - AGE0, 0), t.length - 1), lo = Math.floor(i), hi = Math.min(lo + 1, t.length - 1);
    return t[lo] + (t[hi] - t[lo]) * (i - lo);
  }
  /** Force de mortalité (par an) à l'âge x, loi de Gompertz ajustée sur la table. */
  function hasard(age, sexe) { return mu(ajuste(sexeOk(sexe)), age); }
  /** Probabilité de survie de l'âge x0 à l'âge x1 (≥ x0). */
  function survie(x0, x1, sexe) {
    var f = ajuste(sexeOk(sexe));
    var n = Math.max(1, Math.ceil((x1 - x0) / 0.25)), h = (x1 - x0) / n, I = 0;   // ∫ μ par trapèzes
    for (var i = 0; i < n; i++) I += (mu(f, x0 + i * h) + mu(f, x0 + (i + 1) * h)) / 2 * h;
    return Math.exp(-I);
  }
  /** Espérance de vie restante recalculée par le modèle (contrôle d'ajustement). */
  function esperanceVieModele(age, sexe) { return eModele(ajuste(sexeOk(sexe)), age, 0.1); }

  // ---------- 2. Annuité et coefficient actuariel ----------
  /**
   * Valeur à l'âge `age` de 1 € par an versé à vie, indexé de g (réel) et actualisé à r (réel), annuité payée en cours d'année.
   * r = 0, g = 0 : c'est l'espérance de vie (≈ e(age)).
   */
  function annuite(age, r, g, sexe) {
    var h = 0.1, v = (1 + (g || 0)) / (1 + (r || 0)), s = 0, x = age, S = 1, i;
    for (i = 0; i < 700; i++) {
      var Sn = survie(age, x + h, sexe);
      s += (S + Sn) / 2 * h * Math.pow(v, x - age + h / 2);
      S = Sn; x += h; if (S < 1e-8) break;
    }
    return s;
  }
  /** Valeur actuelle à l'âge 60 d'une pension de 1 €/an commençant à l'âge a, pour une personne vivante à 60 ans. */
  var _vd = {};
  function valeurDepart(a, r, g, sexe) {
    var key = (Math.round(a * 400) / 400) + '|' + r + '|' + g + '|' + sexeOk(sexe);   // mémoïsation à 1/400 d'an près (les âges sont des mois ou des fractions)
    if (_vd[key] === undefined) { var a2 = Math.round(a * 400) / 400; _vd[key] = survie(60, a2, sexe) * Math.pow(1 + r, -(a2 - 60)) * annuite(a2, r, g, sexe); }
    return _vd[key];
  }

  /**
   * Coefficient de neutralité actuarielle : pension à l'âge a rapportée à la pension à l'âge de référence aRef,
   * pour les mêmes droits acquis, de sorte que la valeur actuelle des pensions à vie soit identique.
   * r = taux d'actualisation réel, g = indexation réelle des pensions (0 = indexation sur les prix).
   */
  function coefNeutre(a, aRef, r, g, sexe) { return valeurDepart(aRef, r || 0, g || 0, sexe) / valeurDepart(a, r || 0, g || 0, sexe); }

  /** Taux annuel de réduction (ou de bonus) neutre autour de l'âge a : 1 − c(a)/c(a+1) vers le haut. */
  function tauxAnnuelNeutre(a, r, g, sexe) { var c0 = coefNeutre(a, 64, r, g, sexe), c1 = coefNeutre(a + 1, 64, r, g, sexe); return c1 / c0 - 1; }

  /** Coefficient linéaire de la décote/surcote française : 5 % par an (régime général : 1,25 % par trimestre). */
  function coefFrancais(a, aRef, tauxAn) { return 1 + (tauxAn === undefined ? 0.05 : tauxAn) * (a - aRef); }
  /** Coefficient « à la suédoise » : neutralité avec une indexation inférieure de 1,6 point (norme du système suédois). */
  function coefSuedois(a, aRef, sexe) { return coefNeutre(a, aRef, 0.016, 0, sexe); }

  /** Tableau comparatif des coefficients, âges 60 à 70, référence aRef. */
  function comparerCoefficients(aRef, sexe) {
    aRef = aRef || 64;
    var out = [];
    for (var a = 60; a <= 70; a++) {
      out.push({ age: a, neutre0: coefNeutre(a, aRef, 0, 0, sexe), neutre16: coefNeutre(a, aRef, 0.016, 0, sexe), neutre3: coefNeutre(a, aRef, 0.03, 0, sexe),
        francais: coefFrancais(a, aRef, 0.05) });
    }
    return out;
  }

  /** Pension ajustée avec plancher : jamais en dessous de min(pension d'origine, plancher). */
  function pensionAjustee(p, coef, plancher) { return Math.max(p * coef, Math.min(p, plancher === undefined ? D.aspa : plancher)); }

  // ---------- 3. Cohortes : effet de l'âge libre sur les dépenses ----------
  function interp(tab, an) {
    var ys = Object.keys(tab).map(Number).sort(function (a, b) { return a - b; });
    if (an <= ys[0]) return tab[ys[0]];
    if (an >= ys[ys.length - 1]) return tab[ys[ys.length - 1]];
    for (var i = 0; i < ys.length - 1; i++) if (an >= ys[i] && an <= ys[i + 1]) return tab[ys[i]] + (tab[ys[i + 1]] - tab[ys[i]]) * (an - ys[i]) / (ys[i + 1] - ys[i]);
  }
  function pib(an) { return D.pib2025 * Math.pow(1 + D.croissancePIB, an - 2025); }
  function ageBase(an) { return an <= 2025 ? D.ageMoyen2025 : an >= 2040 ? D.ageMoyen2045 : D.ageMoyen2025 + (D.ageMoyen2045 - D.ageMoyen2025) * (an - 2025) / 15; }

  /**
   * Effet d'un décalage Δ (années, positif = départ plus tôt) de l'âge moyen de départ à partir de `debut`.
   * type de coefficient : 'neutre' (r), 'francais' (5 %/an), 'suedois', 'aucun' (pas de réduction : carrières longues).
   * Calcul par cohortes annuelles de départ (H48) : dépense réforme − dépense de base, en Md€ et en points de PIB ;
   * recettes perdues = Δ × part en emploi × revenu d'activité × taux de prélèvement.
   * Retour : { annees: { an: { depenseMdE, recettesPerduesMdE, pibPerduMdE, depensePts, netPts } }, vieVieMdE par départ }
   */
  /** Part de l'année an (intervalle [an, an+1[) comprise dans [d0, d1[. */
  function recouvre(d0, d1, an) { return Math.max(0, Math.min(d1, an + 1) - Math.max(d0, an)); }

  function effetAgeLibre(p) {
    p = p || {};
    var delta = p.delta === undefined ? 1.0 : p.delta, type = p.coef || 'neutre', r = p.r === undefined ? 0.007 : p.r,
      debut = p.debut || 2028, rampe = p.rampe || 3, part = p.part === undefined ? 1 : p.part,
      enEmploi = p.partEnEmploi === undefined ? 0.5 : p.partEnEmploi, sexe = p.sexe, annees = p.annees || [2030, 2040, 2060],
      N = D.cohorteAnnuelle * part, res = { annees: {}, params: { delta: delta, coef: type, r: r, part: part } };
    annees.forEach(function (an) {
      var depense = 0, rec = 0;
      for (var s0 = debut; s0 <= an + 45; s0++) {           // cohorte dont le départ de base est l'année s0
        var d = delta * Math.min(1, (s0 - debut + 1) / rampe), a0 = ageBase(s0), a1 = Math.max(60, a0 - d);
        var dReel = a0 - a1, s1 = Math.max(debut, s0 - dReel);
        var pens0 = D.pensionMoyenne2025 * Math.pow(1 + D.croissancePensionNeuve, s0 - 2025);
        var c = type === 'aucun' ? 1 : type === 'francais' ? coefFrancais(a1, a0, 0.05) : type === 'suedois' ? coefSuedois(a1, a0, sexe) : coefNeutre(a1, a0, r, 0, sexe);
        var pens1 = pens0 * c, mid = an + 0.5;
        depense -= N * pens0 * recouvre(s0, 1e9, an) * survie(a0, a0 + Math.max(mid - s0, 0), sexe);   // dépense de base de cette cohorte
        depense += N * pens1 * recouvre(s1, 1e9, an) * survie(a1, a1 + Math.max(mid - s1, 0), sexe);   // dépense avec réforme
        // recettes perdues : la cohorte aurait travaillé de s1 à s0 (dReel années) ; part en emploi
        rec += N * enEmploi * D.revenuActiviteMoyen2025 * Math.pow(1.007, an - 2025) * D.tauxPrelevementTravail * recouvre(s1, s0, an) * survie(a1, a1 + Math.max(mid - s1, 0), sexe);
      }
      var depMdE = depense, recMdE = rec;                    // k€ × M = Md€
      var PIB = pib(an);
      res.annees[an] = { depenseMdE: depMdE, recettesPerduesMdE: recMdE, depensePts: depMdE / PIB * 100, netPts: (depMdE + recMdE) / PIB * 100,
        pibPerduMdE: N * enEmploi * D.revenuActiviteMoyen2025 * dReel0(delta, an, debut, rampe) };
    });
    return res;
  }
  function dReel0(delta, an, debut, rampe) { return delta * Math.min(1, (an - debut + 1) / rampe); } // années de travail perdues par cohorte à l'année an

  /** Coût total à vie (non actualisé et actualisé à r) d'un départ à a1 plutôt que a0, pour une personne de pension 1 en a0. */
  function coutVieParDepart(a0, a1, type, r, sexe) {
    var c = type === 'aucun' ? 1 : type === 'francais' ? coefFrancais(a1, a0, 0.05) : type === 'suedois' ? coefSuedois(a1, a0, sexe) : coefNeutre(a1, a0, r, 0, sexe);
    var rr = r || 0;
    return { coef: c, brut: c * valeurDepart(a1, 0, 0, sexe) / valeurDepart(a0, 0, 0, sexe) - 1,
      actualise: c * valeurDepart(a1, rr, 0, sexe) / valeurDepart(a0, rr, 0, sexe) - 1 };
  }

  // ---------- 4. Carrières longues et pénibilité ----------
  /**
   * Surcoût du départ à `age` sans réduction pour une part `part` des départs (carrières longues ou pénibles),
   * par rapport à la même sortie avec coefficient neutre. Part = hypothèse (H53) ; le surcoût est un maximum
   * si une partie de ces départs existe déjà (dispositif « carrières longues » actuel).
   */
  function penibilite(p) {
    p = p || {};
    var part = p.part === undefined ? 0.2 : p.part, age = p.age || 60, r = p.r === undefined ? 0.007 : p.r, annees = p.annees || [2030, 2040, 2060];
    var delta = ageBase(2035) - age;
    var sans = effetAgeLibre({ delta: delta, coef: 'aucun', part: part, annees: annees, r: r });
    var neutre = effetAgeLibre({ delta: delta, coef: 'neutre', part: part, annees: annees, r: r });
    var out = { part: part, age: age, deltaAns: delta, annees: {} };
    annees.forEach(function (an) {
      out.annees[an] = { surcoutMdE: sans.annees[an].depenseMdE - neutre.annees[an].depenseMdE, surcoutPts: sans.annees[an].depensePts - neutre.annees[an].depensePts,
        total: sans.annees[an].depenseMdE, totalPts: sans.annees[an].depensePts };
    });
    return out;
  }

  // ---------- 5. Niveau : indexation au-dessus d'un seuil, contribution des hautes pensions ----------
  /** Masse annuelle (Md€ 2025) des pensions au-dessus de `seuil` (€/mois brut), retraités de droit direct, distribution brute totale. */
  function masseAuDessus(seuil, an, code) {
    var dist = R.distribution2025(code || 'brute_totale');
    var e = R.moyenneDist(dist) - R.esperanceMin(dist, seuil);          // E[max(p − S, 0)] €/mois
    return e * 12 * interp(D.retraites, an || 2025) / 1000;
  }
  /**
   * Indexation sur les prix − `ecart` (point/an) de la part des pensions au-dessus de `seuil` à partir de `debut` ;
   * le seuil lui-même suit les prix. Économie = masse × (1 − (1 − ecart)^(an − debut + 1)).
   */
  function indexationNiveau(p) {
    p = p || {};
    var seuil = p.seuil || 2000, ecart = p.ecart === undefined ? 0.005 : p.ecart, debut = p.debut || 2028, annees = p.annees || [2030, 2040, 2060], out = { seuil: seuil, ecart: ecart, annees: {} };
    annees.forEach(function (an) {
      var m = masseAuDessus(seuil, an), facteur = 1 - Math.pow(1 - ecart, Math.max(0, an - debut + 1)), eco = m * facteur;
      out.annees[an] = { masseMdE: m, facteur: facteur, economieMdE: eco, economiePts: eco / pib(an) * 100, partDepenseBase: eco / (interp(D.depensePctPIB, an) / 100 * pib(an)) };
    });
    return out;
  }
  /** Contribution des hautes pensions (modele.js) : recette en Md€ constants, convertie en points de PIB. */
  function contributionHautes(p) {
    var c = R.contributionHautesPensions(p || {});
    return { recetteMdE: c.recetteMdE, pts2025: c.recetteMdE / D.pib2025 * 100, partTouchee: c.partTouchee, seuil: c.seuil, taux: c.taux };
  }

  /** Moyenne et part d'une tranche de pensions (€/mois) : { part, moyenne } pour p dans [lo, hi[. */
  function tranchePensions(dist, lo, hi) {
    var part = 0, masse = 0;
    dist.tranches.forEach(function (t) {
      if (t.haut === null) { if (t.moyenne >= lo && t.moyenne < hi) { part += t.part; masse += t.part * t.moyenne; } return; }
      var b = Math.max(t.bas, lo), h = Math.min(t.haut, hi);
      if (h > b) { var f = (h - b) / (t.haut - t.bas); part += t.part * f; masse += t.part * f * (b + h) / 2; }
    });
    return { part: part, moyenne: part > 0 ? masse / part : 0 };
  }

  /**
   * Perdants par décile de pension (distribution brute totale, 2025) : perte en % de la pension en 2040 de l'indexation
   * (seuil, écart) et de la contribution (seuil net, taux), et pension d'un départ à 60 ans (coefficient neutre) pour mémoire.
   */
  function parDecile(p) {
    p = p || {};
    var seuilIdx = p.seuil || 2000, ecart = p.ecart === undefined ? 0.005 : p.ecart, an = p.an || 2040, debut = p.debut || 2028,
      seuilC = p.seuilContribution || 2500, tauxC = p.tauxContribution === undefined ? 0.2 : p.tauxContribution, nu = 0.927;
    var dist = R.distribution2025('brute_totale'), f = 1 - Math.pow(1 - ecart, Math.max(0, an - debut + 1)), lignes = [];
    for (var k = 0; k < 10; k++) {
      var lo = R.quantile(dist, k / 10), hi = k === 9 ? 1e9 : R.quantile(dist, (k + 1) / 10), t = tranchePensions(dist, lo, hi), m = t.moyenne;
      // moyenne de max(p − S, 0) dans le décile : approximation par tranches
      var sup = 0, supC = 0, part = 0;
      dist.tranches.forEach(function (tr) {
        var b = Math.max(tr.bas, lo), h = tr.haut === null ? tr.moyenne : Math.min(tr.haut, hi);
        if (tr.haut === null) { if (tr.moyenne >= lo && tr.moyenne < hi) { sup += tr.part * Math.max(tr.moyenne - seuilIdx, 0); supC += tr.part * Math.max(nu * tr.moyenne - seuilC, 0); part += tr.part; } return; }
        if (h > b) {
          var fr = (h - b) / (tr.haut - tr.bas), n = 20;
          for (var j = 0; j < n; j++) { var x = b + (h - b) * (j + 0.5) / n; sup += tr.part * fr / n * Math.max(x - seuilIdx, 0); supC += tr.part * fr / n * Math.max(nu * x - seuilC, 0); }
          part += tr.part * fr;
        }
      });
      var perteIdx = part > 0 ? sup / part * f : 0, perteC = part > 0 ? supC / part * tauxC / nu : 0;
      lignes.push({ decile: k + 1, bas: lo, pensionMoyenne: m, perteIndexation: perteIdx, perteIndexationPct: m > 0 ? perteIdx / m * 100 : 0,
        perteContribution: perteC, perteContributionPct: m > 0 ? perteC / m * 100 : 0, perteTotalPct: m > 0 ? (perteIdx + perteC) / m * 100 : 0 });
    }
    return lignes;
  }

  // ---------- 6. Pauvreté des retraités ----------
  /**
   * Effet de la réduction de pension d'un départ anticipé sur la pauvreté : parmi les retraités qui partent plus tôt
   * (distribution de la pension de base), part dont la pension ajustée (avec plancher) passe sous le seuil de pauvreté
   * alors que la pension de base était au-dessus. Sans plancher, la part est plus grande.
   */
  function pauvreteAnticipee(p) {
    p = p || {};
    var c = p.coef === undefined ? coefNeutre(60, 64, 0.007, 0, p.sexe) : p.coef, seuil = p.seuil || D.seuilPauvrete60, plancher = p.plancher === undefined ? D.aspa : p.plancher;
    var dist = R.distribution2025('brute_dd_residents'), nu = 0.927; // pension nette = ν × brute (H41)
    function net(x) { return nu * x; }
    var base = R.partSous(dist, seuil / nu);                         // part déjà sous le seuil (pension nette)
    var sans = R.partSous(dist, seuil / (nu * c));                   // sous le seuil après réduction, sans plancher
    // avec plancher (net) : personne ne descend sous min(p, plancher) ; si plancher ≥ seuil la part n'augmente pas, sinon elle est celle de « sans »
    var avec = plancher >= seuil ? base : sans;
    var coutPlancher = 0, e = 0;
    // coût du plancher : Σ part × max(min(p, plancher) − p × c, 0), pension brute, ×12, effectif des départs anticipés (N)
    dist.tranches.forEach(function (t) {
      var n = 20, lo = t.bas, hi = t.haut === null ? t.moyenne : t.haut;
      if (t.haut === null) { e += t.part * Math.max(Math.min(t.moyenne, plancher) - t.moyenne * c, 0); return; }
      for (var j = 0; j < n; j++) { var x = lo + (hi - lo) * (j + 0.5) / n; e += t.part / n * Math.max(Math.min(x, plancher) - x * c, 0); }
    });
    coutPlancher = e * 12 * D.cohorteAnnuelle * 1e6 / 1e9;            // Md€ par cohorte de départ, par an, tous partants
    var delta = p.delta === undefined ? 0.35 * (D.ageLegalActuel - 60) : p.delta;   // décalage central (H50)
    var partPartants = Math.min(1, delta / (ageBase(2035) - 60));                                       // part d'une cohorte qui part à 60 ans
    var coutRegime = coutPlancher * partPartants * esperanceVie(60, p.sexe);                           // Md€/an en régime, toutes cohortes
    return { coef: c, delta: delta, partPartants: partPartants, coutPlancherEnRegimeMdE: coutRegime, seuil: seuil, plancher: plancher, partSousSeuilBase: base, partSousSeuilSansPlancher: sans, partSousSeuilAvecPlancher: avec,
      hausseSansPlancher: sans - base, hausseAvecPlancher: avec - base, coutPlancherParCohorteMdE: coutPlancher };
  }

  // ---------- 7. Bilan et comblement de l'écart avec l'Allemagne ----------
  var SCENARIOS = {
    // comportement : décalage de l'âge moyen de départ (années) = passage × (âge légal − 60) ; H50
    bas: { passage: 0.5, ecartIndexation: 0.0025, seuilIndexation: 2500, r: 0.0, partPenibilite: 0.30 },
    central: { passage: 0.35, ecartIndexation: 0.005, seuilIndexation: 2000, r: 0.007, partPenibilite: 0.20 },
    haut: { passage: 0.2, ecartIndexation: 0.01, seuilIndexation: 1500, r: 0.016, partPenibilite: 0.10 }
  };
  /**
   * Bilan d'un scénario : économie (+) ou surcoût (−) en Md€ et en points de PIB à 2030, 2040, 2060 pour chaque bloc, et
   * part de l'écart avec l'Allemagne comblé (écart de référence : 3,0 points, COR 2019 ; 3,6 points COFOG 2023).
   */
  function bilan(nom, options) {
    var sc = SCENARIOS[nom || 'central'], o = options || {}, annees = o.annees || [2030, 2040, 2060], delta = sc.passage * (D.ageLegalActuel - 60);
    var libre = effetAgeLibre({ delta: delta, coef: 'neutre', r: sc.r, annees: annees });
    var pen = penibilite({ part: sc.partPenibilite, annees: annees, r: sc.r });
    var idx = indexationNiveau({ seuil: sc.seuilIndexation, ecart: sc.ecartIndexation, annees: annees });
    var hp = contributionHautes({});
    var out = { scenario: nom || 'central', deltaAns: delta, annees: {}, params: sc };
    annees.forEach(function (an) {
      var PIB = pib(an), partFin = {
        ageLibreMdE: -libre.annees[an].depenseMdE, ageLibrePts: -libre.annees[an].depensePts,
        recettesPerduesMdE: -libre.annees[an].recettesPerduesMdE,
        penibiliteMdE: -pen.annees[an].surcoutMdE,
        indexationMdE: idx.annees[an].economieMdE,
        hautesPensionsMdE: hp.recetteMdE
      };
      partFin.penibilitePts = partFin.penibiliteMdE / PIB * 100;
      partFin.indexationPts = partFin.indexationMdE / PIB * 100;
      partFin.hautesPensionsPts = partFin.hautesPensionsMdE / PIB * 100;
      partFin.recettesPerduesPts = partFin.recettesPerduesMdE / PIB * 100;
      partFin.niveauMdE = partFin.indexationMdE + partFin.hautesPensionsMdE;
      partFin.niveauPts = partFin.niveauMdE / PIB * 100;
      partFin.depenseMdE = partFin.ageLibreMdE + partFin.penibiliteMdE + partFin.niveauMdE;     // économie sur les pensions
      partFin.depensePts = partFin.depenseMdE / PIB * 100;
      partFin.netMdE = partFin.depenseMdE + partFin.recettesPerduesMdE;                          // après recettes perdues
      partFin.netPts = partFin.netMdE / PIB * 100;
      partFin.partEcartCoreCOR = partFin.depensePts / 3.0;
      partFin.partEcartCOFOG = partFin.depensePts / 3.6;
      partFin.ratioCotisantsRetraites = interp(D.cotisants, an) / interp(D.retraites, an);
      partFin.pibMdE = PIB;
      out.annees[an] = partFin;
    });
    return out;
  }

  // ---------- 8. Âge de référence indexé sur l'espérance de vie ----------
  // Règle : à partir de la génération 1969 (64 ans, loi du 14 avril 2023 maintenue), chaque année d'espérance de vie à 60 ans gagnée
  // reporte l'âge de référence de `part` (2/3) d'année : 2/3 de chaque année gagnée au travail, 1/3 à la retraite (décision de l'auteur, 03/11/2026).
  // Hypothèses H61 à H70 : voir methode.md § 12. Ordres de grandeur, jamais des prédictions.

  /**
   * Âge légal d'ouverture des droits en vigueur au 03/11/2026 (loi n° 2025-1403 du 30 décembre 2025 de financement de la sécurité
   * sociale pour 2026, art. L161-17-2 du code de la sécurité sociale, version en vigueur à la date du 31/12/2025 ; Légifrance via codes.droit.org).
   * Né en `gen` (mois 1-12 ; sans mois : moyenne de l'année). Avant 1955 : null (régime transitoire de 2010, hors champ).
   */
  function ageLegalMois(gen, mois) {
    if (gen < 1955) return null;
    if (gen <= 1960) return 62;
    if (gen === 1961) return mois <= 8 ? 62 : 62.25;
    if (gen === 1962) return 62.5;
    if (gen <= 1964) return 62.75;
    if (gen === 1965) return mois <= 3 ? 62.75 : 63;
    if (gen === 1966) return 63.25;
    if (gen === 1967) return 63.5;
    if (gen === 1968) return 63.75;
    return 64;
  }
  function ageLegalEnVigueur(gen, mois) {
    if (mois) return ageLegalMois(gen, mois);
    if (gen < 1955) return null;
    var s = 0; for (var m = 1; m <= 12; m++) s += ageLegalMois(gen, m);
    return s / 12;
  }

  // Espérance de vie à 65 ans (Insee, projections de population 2026, hypothèses ; COR, séance d'avril 2026, diapositive 12) :
  // 2025 : femmes 23,6 ; hommes 20,0. 2070 : central 26,3 / 24,4 ; haute 28,8 / 26,8 ; basse 24,0 / 22,2 (écarts de ± 3,0 ans à la naissance).
  var E65 = {
    F: { base: 23.6, centrale: 26.3, haute: 28.8, basse: 24.0, constante: 23.6 },
    M: { base: 20.0, centrale: 24.4, haute: 26.8, basse: 22.2, constante: 20.0 }
  };
  function e65Cible(an, variante, sexe) {
    var v = variante || 'centrale';
    function un(s) { var t = E65[s]; return t.base + (t[v] - t.base) * (an - 2025) / 45; }   // trajectoire linéaire 2025-2070 (H62)
    return sexeOk(sexe) === 'T' ? (un('F') + un('M')) / 2 : un(sexe);
  }
  function decale(f, k) { return { a: f.a - k, b: f.b, c: f.c }; }
  var _dec = {}, _e60 = {};
  /** Décalage k de ln μ (mortalité × e^−k) pour que l'espérance de vie à 65 ans gagne `gain` années. */
  function decalageMortalite(gain, sexe, age) {
    var s = sexeOk(sexe), key = s + '|' + (age || 65) + '|' + gain.toFixed(5);
    if (_dec[key] !== undefined) return _dec[key];
    var f = ajuste(s), x = age || 65, e0 = eModele(f, x, 0.5), lo = -1.5, hi = 2.5, mid, i;
    for (i = 0; i < 40; i++) { mid = (lo + hi) / 2; if (eModele(decale(f, mid), x, 0.5) - e0 < gain) lo = mid; else hi = mid; }
    return (_dec[key] = (lo + hi) / 2);
  }
  /**
   * Espérance de vie restante à `age` l'année `an` (période), projetée : niveau de la table 2023 ; progrès obtenu en décalant la
   * mortalité de façon uniforme pour reproduire le gain d'espérance de vie à 65 ans des projections Insee 2026 (H62).
   * variante : 'centrale', 'haute', 'basse', 'constante' (espérance de vie figée à 2025).
   */
  function esperanceVieProjetee(age, an, variante, sexe) {
    var s = sexeOk(sexe), v = variante || 'centrale', key = s + '|' + age + '|' + an + '|' + v;
    if (_e60[key] !== undefined) return _e60[key];
    var gain = e65Cible(an, v, s) - e65Cible(2025, v, s), k = decalageMortalite(gain, s, 65), f = ajuste(s);
    return (_e60[key] = esperanceVie(age, s) + eModele(decale(f, k), age, 0.5) - eModele(f, age, 0.5));
  }

  /**
   * Trajectoire de l'âge de référence par génération (nés en `generation`, qui ont 60 ans en generation + 60).
   * Jusqu'à 1968 : âge légal en vigueur (loi). À partir de gen0 (1969) : age0 (64) + part × (e60(année des 60 ans) − e60(gen0 + 60)),
   * arrondi au pas (1 mois), jamais en baisse si `cliquet` (défaut : oui).
   */
  var _traj = {};
  function trajectoireAgeReference(p) {
    p = p || {};
    var v = p.variante || 'centrale', sx = sexeOk(p.sexe), part = p.part === undefined ? 2 / 3 : p.part, age0 = p.age0 || 64, gen0 = p.gen0 || 1969,
      pas = p.pas || 1 / 12, genFin = p.genFin || 2012, cliquet = p.cliquet !== false, key = [v, sx, part, age0, gen0, pas, genFin, cliquet].join('|');
    if (_traj[key]) return _traj[key];
    var rows = [], e0 = esperanceVieProjetee(60, gen0 + 60, v, sx), prev = age0;
    for (var g = 1955; g <= genFin; g++) {
      var an60 = g + 60, e = esperanceVieProjetee(60, an60, v, sx), legal = ageLegalEnVigueur(g), ref;
      if (g < gen0) ref = legal;
      else {
        ref = age0 + part * (e - e0); ref = Math.round(ref / pas) / (1 / pas);
        if (cliquet && ref < prev) ref = prev;
        prev = ref;
      }
      rows.push({ generation: g, annee60: an60, e60: e, ageLegal: legal, ageRef: ref, gainE60: e - e0 });
    }
    return (_traj[key] = rows);
  }
  /** Âge de référence d'une génération (réelle, interpolation linéaire entre générations). */
  function ageRefGen(rows, g) {
    var i = Math.floor(g) - rows[0].generation;
    if (i <= 0) return rows[0].ageRef;
    if (i >= rows.length - 1) return rows[rows.length - 1].ageRef;
    return rows[i].ageRef + (rows[i + 1].ageRef - rows[i].ageRef) * (g - Math.floor(g));
  }

  var SCENARIOS_REF = {
    // favorable / défavorable : pour les finances publiques. La variante d'espérance de vie « haute » augmente l'effet de la règle
    // (davantage d'années gagnées donc report plus grand), elle ne mesure pas le coût de la longévité (voir methode.md H62).
    // Valeurs de comportement sourcées le 04/11/2026 (sources/retraites-comportements.md ; V12430 et suivantes ; appliquées par V12840-V12859).
    // Ancien -> nouveau : passage 1,0 / 0,8 / 0,6 -> 0,8 / 0,5 / 0,33 (Seibold 2021 : 0,33 ; Manoli-Weber : 0,4 ; Bozio 0,4 à 0,8) ;
    // partEnEmploi 0,75 / 0,65 / 0,5 -> 0,75 / 0,50 / 0,35 (Rabaté-Rochut 0,40 ; Pays-Bas 0,32 ; Danemark 0,74) ;
    // partPenibilite 10 / 20 / 30 % -> 5 / 10 / 20 % (part NETTE du droit actuel : la carrière longue, ~1 départ sur 5, est déjà dans la trajectoire du COR ; Drees 2025) ;
    // substitution (nouveau, 0 avant) 0,10 / 0,20 / 0,30 : part des gains de l'âge de référence perdue en chômage, invalidité, maladie (Rabaté-Rochut : 20 % ; Pays-Bas : 47 % des économies de pensions).
    // contrepartie inchangée (0 / 0,25 / 0,5). passageLibre INCHANGÉ (0,2 / 0,35 / 0,5) : aucune étude d'un départ libre à 60 ans à coefficient neutre ;
    // hypothèse ASSUMÉE (symétrie relèvement / abaissement, non testée), premier levier du signe du solde 2040 (±0,15 = ±7,6 Md€).
    favorable: { variante: 'haute', passage: 0.8, contrepartie: 0.0, partEnEmploi: 0.75, substitution: 0.10, r: 0.007, passageLibre: 0.2, partPenibilite: 0.05, ecartIndexation: 0.01, seuilIndexation: 1500 },
    central: { variante: 'centrale', passage: 0.5, contrepartie: 0.25, partEnEmploi: 0.50, substitution: 0.20, r: 0.007, passageLibre: 0.35, partPenibilite: 0.10, ecartIndexation: 0.005, seuilIndexation: 2000 },
    defavorable: { variante: 'basse', passage: 0.33, contrepartie: 0.5, partEnEmploi: 0.35, substitution: 0.30, r: 0.007, passageLibre: 0.5, partPenibilite: 0.20, ecartIndexation: 0.0025, seuilIndexation: 2500 }
  };

  /**
   * Effet de l'âge de référence indexé (seul, sans âge libre ni niveau) par cohortes annuelles de départ (H48, H52).
   * Chaque cohorte de départ de l'année s0 voit son âge de départ repoussé de d = passage × (âge de référence de sa génération − 64) (H63) ;
   * pension multipliée par 1 + contrepartie × (coefficient neutre − 1) (H64) ; recettes : part en emploi × revenu × 42 % (H46, H65).
   * Retour par année : économie sur les pensions (Md€, +), recettes gagnées, solde, points de PIB, retraités en moins, cotisants en plus, personnes hors emploi.
   */
  function effetAgeReference(p) {
    p = p || {};
    var sc = SCENARIOS_REF[p.scenario || 'central'], q = {};
    Object.keys(sc).forEach(function (k) { q[k] = p[k] === undefined ? sc[k] : p[k]; });
    var sexe = p.sexe, annees = p.annees || [2030, 2040, 2060, 2070], age0 = p.age0 || 64, N = D.cohorteAnnuelle, res = { params: q, annees: {} },
      rows = trajectoireAgeReference({ variante: q.variante, sexe: sexe, part: p.part, age0: age0 });
    annees.forEach(function (an) {
      var dep = 0, rec = 0, ret = 0, cot = 0, hors = 0, pibG = 0, mid = an + 0.5, dAn = 0, aRefAn = 0;
      for (var s0 = 2026; s0 <= an; s0++) {
        var a0 = ageBase(s0), g = s0 - a0, d = Math.max(0, q.passage * (ageRefGen(rows, g) - age0));
        if (s0 === an) { dAn = d; aRefAn = ageRefGen(rows, g); }
        if (d <= 0) continue;
        var a1 = a0 + d, s1 = s0 + d, pens0 = D.pensionMoyenne2025 * Math.pow(1 + D.croissancePensionNeuve, s0 - 2025),
          c = 1 + q.contrepartie * (coefNeutre(a1, a0, q.r, 0, sexe) - 1), S = survie(a0, a0 + Math.max(mid - s0, 0), sexe), w = recouvre(s0, s1, an);
        dep += N * S * pens0 * (c * recouvre(s1, 1e9, an) - recouvre(s0, 1e9, an));
        var rev = D.revenuActiviteMoyen2025 * Math.pow(1.007, an - 2025);
        rec += N * S * q.partEnEmploi * rev * D.tauxPrelevementTravail * w;
        pibG += N * S * q.partEnEmploi * rev * w;
        ret += N * S * w; cot += N * S * q.partEnEmploi * w; hors += N * S * (1 - q.partEnEmploi) * w;
      }
      var PIB = pib(an), baseDep = interp(D.depensePctPIB, an) / 100 * PIB, baseRet = interp(D.retraites, an), baseCot = interp(D.cotisants, an);
      res.annees[an] = {
        economieMdE: -dep, economiePts: -dep / PIB * 100, recettesMdE: rec, recettesPts: rec / PIB * 100, soldeMdE: -dep + rec, soldePts: (-dep + rec) / PIB * 100,
        pibGagneMdE: pibG, retraitesEnMoinsM: ret, cotisantsEnPlusM: cot, horsEmploiEnPlusM: hors,
        depenseBaseMdE: baseDep, depenseBasePts: baseDep / PIB * 100, depenseReformeMdE: baseDep + dep, depenseReformePts: (baseDep + dep) / PIB * 100,
        retraitesBaseM: baseRet, retraitesReformeM: baseRet - ret, cotisantsBaseM: baseCot, cotisantsReformeM: baseCot + cot,
        ratioBase: baseCot / baseRet, ratioReforme: (baseCot + cot) / (baseRet - ret),
        ageRefCohorte: aRefAn, reportAgeEffectifAns: dAn, ageEffectifCohorte: ageBase(an) + dAn,
        partEcartCOR: -dep / PIB * 100 / 3.0, partEcartCOFOG: -dep / PIB * 100 / 3.6, pibMdE: PIB
      };
    });
    return res;
  }

  /**
   * Départ sans réduction (pénibilité ou carrière longue) avec âge de référence indexé : pour une part `part` des départs, départ à
   * l'âge amin sans réduction. definition : 'penibilite' (amin = 60) ou 'carriereLongue' (amin = âge de référence − 2, plancher 60).
   * surcoutDispense = pension non réduite − pension au coefficient neutre (la dispense de décote seule) ;
   * coutTotal = dépense en plus par rapport au départ à l'âge de base, recettes perdues comprises (borne haute, H66).
   */
  function penibiliteIndexee(p) {
    p = p || {};
    var sc = SCENARIOS_REF[p.scenario || 'central'], part = p.part === undefined ? sc.partPenibilite : p.part, def = p.definition || 'penibilite',
      variante = p.variante || sc.variante, passage = p.passage === undefined ? sc.passage : p.passage, r = p.r === undefined ? sc.r : p.r,
      emp = p.partEnEmploi === undefined ? 0.5 : p.partEnEmploi, annees = p.annees || [2030, 2040, 2060, 2070], debut = p.debut || 2028, sexe = p.sexe,
      rows = trajectoireAgeReference({ variante: variante, sexe: sexe }), N = D.cohorteAnnuelle * part, out = { part: part, definition: def, annees: {} };
    annees.forEach(function (an) {
      var sur = 0, tot = 0, rec = 0, mid = an + 0.5, ageMin = 0;
      for (var s0 = debut; s0 <= an + 9; s0++) {            // les cohortes de base qui partent après an mais ont déjà quitté (dispense) comptent
        var a0 = ageBase(s0), g = s0 - a0, aref = ageRefGen(rows, g), d = Math.max(0, passage * (aref - 64)), a0e = a0 + d,
          amin = def === 'carriereLongue' ? Math.max(60, aref - 2) : 60;
        if (s0 === an) ageMin = amin;
        if (amin >= a0e) continue;
        var s1 = s0 + (amin - a0), montee = Math.min(1, Math.max(0, (s1 - debut + 1) / (p.rampe || 3)));   // montée en charge sur 3 ans à partir du début
        if (montee <= 0 || s1 > an + 1) continue;
        var pens0 = D.pensionMoyenne2025 * Math.pow(1 + D.croissancePensionNeuve, s0 - 2025), Nm = N * montee,
          cN = coefNeutre(amin, aref, r, 0, sexe), S = survie(amin, amin + Math.max(mid - s1, 0), sexe);
        sur += Nm * S * pens0 * (1 - cN) * recouvre(s1, 1e9, an);
        var Sb = survie(a0e, a0e + Math.max(mid - (s0 + d), 0), sexe);
        tot += Nm * (S * pens0 * recouvre(s1, 1e9, an) - Sb * pens0 * recouvre(s0 + d, 1e9, an));
        rec += Nm * S * emp * D.revenuActiviteMoyen2025 * Math.pow(1.007, an - 2025) * D.tauxPrelevementTravail * recouvre(s1, s0 + d, an);
      }
      var PIB = pib(an);
      out.annees[an] = { surcoutDispenseMdE: sur, surcoutDispensePts: sur / PIB * 100, coutTotalMdE: tot, coutTotalPts: tot / PIB * 100, recettesPerduesMdE: rec, ageMinCohorte: ageMin };
    });
    return out;
  }

  /**
   * Bilan complet du dispositif décidé le 03/11/2026 (âge de référence indexé + âge libre à coefficient neutre + départ sans réduction
   * pour pénibilité + indexation au-dessus du seuil + contribution des hautes pensions + plancher), par scénario favorable / central / défavorable.
   * Les blocs sont additionnés sans interaction (H67) ; solde = économie sur pensions + recettes gagnées − recettes perdues (+ : améliore le solde public).
   */
  function bilanReference(nom, options) {
    var sc = SCENARIOS_REF[nom || 'central'], o = options || {}, annees = o.annees || [2030, 2040, 2060, 2070];
    var ref = effetAgeReference({ scenario: nom, annees: annees });
    var libre = effetAgeLibre({ delta: sc.passageLibre * (64 - 60), coef: 'neutre', r: sc.r, annees: annees });
    var pen = penibiliteIndexee({ scenario: nom, annees: annees });
    var idx = indexationNiveau({ seuil: sc.seuilIndexation, ecart: sc.ecartIndexation, annees: annees });
    var hp = contributionHautes({}), out = { scenario: nom || 'central', params: sc, annees: {} };
    annees.forEach(function (an) {
      var PIB = pib(an), x = ref.annees[an], b = {
        ageReferenceMdE: x.economieMdE, ageReferenceRecettesMdE: x.recettesMdE,
        ageLibreMdE: -libre.annees[an].depenseMdE, ageLibreRecettesMdE: -libre.annees[an].recettesPerduesMdE,
        penibiliteMdE: -pen.annees[an].surcoutDispenseMdE, indexationMdE: idx.annees[an].economieMdE, hautesPensionsMdE: hp.recetteMdE
      };
      // Coût de substitution (V12430 et suivantes) : part `substitution` des gains de l'âge de référence (économie + recettes) perdue en dépenses de chômage, d'invalidité et de maladie.
      b.substitutionMdE = -(sc.substitution || 0) * (x.economieMdE + x.recettesMdE);
      b.economiePensionsMdE = b.ageReferenceMdE + b.ageLibreMdE + b.penibiliteMdE + b.indexationMdE + b.hautesPensionsMdE;
      b.recettesMdE = b.ageReferenceRecettesMdE + b.ageLibreRecettesMdE;
      b.soldeMdE = b.economiePensionsMdE + b.recettesMdE + b.substitutionMdE;
      b.economiePensionsPts = b.economiePensionsMdE / PIB * 100; b.soldePts = b.soldeMdE / PIB * 100;
      b.depenseBasePts = interp(D.depensePctPIB, an); b.depenseReformePts = b.depenseBasePts - b.economiePensionsPts;
      b.depenseBaseMdE = b.depenseBasePts / 100 * PIB; b.depenseReformeMdE = b.depenseBaseMdE - b.economiePensionsMdE;
      b.partEcartCOR = b.economiePensionsPts / 3.0; b.partEcartCOFOG = b.economiePensionsPts / 3.6;
      b.partEcartCORSolde = b.soldePts / 3.0;
      b.niveauMdE = b.indexationMdE + b.hautesPensionsMdE;
      out.annees[an] = b;
    });
    return out;
  }

  /**
   * Pauvreté : personnes (M) hors emploi entre l'ancien et le nouvel âge de départ, et variation du nombre de pauvres, avec des taux
   * de pauvreté hypothétiques par situation (H68, ⚠️) : retraités 13,3 % (seuil de 60 %, 2020, COR), hors emploi 30 %, en emploi 7 %.
   */
  function pauvreteReference(p) {
    p = p || {};
    var an = p.an || 2060, x = effetAgeReference({ scenario: p.scenario, annees: [an] }).annees[an], tr = p.tauxRetraites === undefined ? 0.133 : p.tauxRetraites,
      th = p.tauxHorsEmploi === undefined ? 0.30 : p.tauxHorsEmploi, te = p.tauxEmploi === undefined ? 0.07 : p.tauxEmploi;
    var emp = x.cotisantsEnPlusM, hors = x.horsEmploiEnPlusM;
    var dPauvres = hors * (th - tr) + emp * (te - tr);
    return { an: an, horsEmploiM: hors, enEmploiM: emp, variationPauvresM: dPauvres, horsEmploiSeulM: hors * (th - tr), variationPtsDesRetraites: dPauvres / x.retraitesReformeM * 100,
      tauxHorsEmploi: th };
  }

  /**
   * Qui paie, par décile de pension : perte, en % de la valeur à vie de la pension, d'un report d de l'âge de départ (cohorte de l'année an),
   * avec la mortalité du décile (H69 : écart d'espérance de vie à 60 ans de −2,75 an au décile 1 à +2,75 an au décile 10, d'après un écart
   * de 5,4 à 7,6 ans entre les 5 % les plus modestes et les plus aisés, Insee 2012-2016 ⚠️).
   */
  function parDecileReference(p) {
    p = p || {};
    var an = p.an || 2060, sc = SCENARIOS_REF[p.scenario || 'central'], x = effetAgeReference({ scenario: p.scenario, annees: [an] }).annees[an],
      d = x.reportAgeEffectifAns, a0 = ageBase(an), a1 = a0 + d, c = 1 + sc.contrepartie * (coefNeutre(a1, a0, sc.r, 0, p.sexe) - 1),
      ecart = p.ecartDeciles === undefined ? 2.75 : p.ecartDeciles, f0 = ajuste(sexeOk(p.sexe)), dec = parDecile({}), lignes = [];
    function eShift(k, age, shiftK) { return eModele(decale(f0, shiftK), age, 0.25); }
    for (var k = 0; k < 10; k++) {
      var g = -ecart + 2 * ecart * k / 9, lo = -1.5, hi = 2.5, m, i, base60 = eModele(f0, 60, 0.25);
      for (i = 0; i < 30; i++) { m = (lo + hi) / 2; if (eShift(0, 60, m) - base60 < g) lo = m; else hi = m; }
      var sk = (lo + hi) / 2, fk = decale(f0, sk);
      // survie de a0 à a1 avec la mortalité du décile
      var h = 0.1, I = 0, n = Math.max(1, Math.ceil(d / h)), hh = d / n;
      for (i = 0; i < n; i++) I += (mu(fk, a0 + i * hh) + mu(fk, a0 + (i + 1) * hh)) / 2 * hh;
      var S = Math.exp(-I), e0 = eModele(fk, a0, 0.25), e1 = eModele(fk, a1, 0.25), perte = 1 - c * S * e1 / e0;
      lignes.push({ decile: k + 1, e60: esperanceVie(60, p.sexe) + g, pensionMoyenne: dec[k].pensionMoyenne, anneesRetraiteBase: e0, perteValeurViePct: perte * 100,
        moisDeRetraiteEnMoins: (e0 - c * S * e1) * 12 });
    }
    return { an: an, reportAns: d, coef: c, lignes: lignes };
  }

  /** Comparaison avec les pays qui lient l'âge de la retraite à l'espérance de vie (OCDE, Pensions at a Glance 2025, tableaux 3.5 et 3.6 ; règles nationales). */
  var PAYS_LIEN = [
    { pays: 'Danemark', ageNormal2024: 67, ageFutur: 74, regle: '1 pour 1 ; relevé par paliers de 5 ans, annoncé 15 ans à l\'avance ; 70 ans en 2040 voté le 22/05/2025 (le lien pourrait être assoupli)', fraction: 1, preavisAns: 15, sourceOCDE: true, verifieSourcePrimaire: false },
    { pays: 'Finlande', ageNormal2024: 65, ageFutur: 68, regle: 'âge de retraite lié à l\'espérance de vie depuis la réforme de 2017 (générations nées à partir de 1965) ; coefficient d\'espérance de vie sur le montant (cohorte à 62 ans)', fraction: null, preavisAns: null, sourceOCDE: true, verifieSourcePrimaire: false },
    { pays: 'Pays-Bas', ageNormal2024: 67, ageFutur: 70, regle: '2/3 de la hausse de l\'espérance de vie à 65 ans (loi de 2020, Staatsblad 2020, 503), âge annoncé 5 ans à l\'avance', fraction: 2 / 3, preavisAns: 5, sourceOCDE: true, verifieSourcePrimaire: false },
    { pays: 'Portugal', ageNormal2024: 65.3, ageFutur: 68, regle: 'âge normal ajusté chaque année selon la hausse de l\'espérance de vie à 65 ans (Portaria 358/2024 : 66 ans 9 mois en 2026 ; Portaria 476/2025 : 66 ans 11 mois en 2027) ; fraction de 2/3 mentionnée par l\'OCDE en 2021', fraction: 2 / 3, preavisAns: 1, sourceOCDE: true, verifieSourcePrimaire: false },
    { pays: 'Suède', ageNormal2024: 66, ageFutur: 70, regle: 'âge de référence (« riktålder ») fixé 6 ans à l\'avance selon l\'espérance de vie moyenne : 67 ans de 2026 à 2031 ; âge minimal d\'accès 64 ans', fraction: null, preavisAns: 6, sourceOCDE: true, verifieSourcePrimaire: false },
    { pays: 'Norvège', ageNormal2024: 67, ageFutur: 67, regle: 'lien en préparation : 2/3 des gains d\'espérance de vie (OCDE 2025)', fraction: 2 / 3, preavisAns: null, sourceOCDE: true, verifieSourcePrimaire: false },
    { pays: 'France (loi 2025)', ageNormal2024: 64.3, ageFutur: 65, regle: 'aucun lien : 64 ans pour la génération 1969 et suivantes ; durée d\'assurance de 172 trimestres', fraction: 0, preavisAns: null, sourceOCDE: true, verifieSourcePrimaire: true }
  ];

  var API = {
    DONNEES: D, EV: EV, SCENARIOS: SCENARIOS,
    esperanceVie: esperanceVie, esperanceVieModele: esperanceVieModele, hasard: hasard, survie: survie, ajusteMortalite: ajuste,
    annuite: annuite, valeurDepart: valeurDepart, coefNeutre: coefNeutre, tauxAnnuelNeutre: tauxAnnuelNeutre, coefFrancais: coefFrancais,
    coefSuedois: coefSuedois, comparerCoefficients: comparerCoefficients, pensionAjustee: pensionAjustee,
    effetAgeLibre: effetAgeLibre, coutVieParDepart: coutVieParDepart, penibilite: penibilite,
    masseAuDessus: masseAuDessus, indexationNiveau: indexationNiveau, contributionHautes: contributionHautes, parDecile: parDecile,
    pauvreteAnticipee: pauvreteAnticipee, bilan: bilan, ageBase: ageBase, pib: pib, interp: interp,
    ageLegalEnVigueur: ageLegalEnVigueur, esperanceVieProjetee: esperanceVieProjetee, trajectoireAgeReference: trajectoireAgeReference, ageRefGen: ageRefGen,
    effetAgeReference: effetAgeReference, penibiliteIndexee: penibiliteIndexee, bilanReference: bilanReference, pauvreteReference: pauvreteReference,
    parDecileReference: parDecileReference, SCENARIOS_REF: SCENARIOS_REF, PAYS_LIEN: PAYS_LIEN, E65: E65
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.AgeLibre = API;
})(this);
