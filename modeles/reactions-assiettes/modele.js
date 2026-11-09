/*
 * modeles/reactions-assiettes/modele.js
 * Réaction des assiettes du prélèvement unique : optimisation (élasticité du revenu imposable),
 * exil (élasticité de mobilité), écart de déclaration des transmissions, rétention des bénéfices
 * dans les sociétés (imposition à la distribution), et effet d'une imposition selon la nationalité.
 * Fonctions pures, sans dépendance. Ce sont des hypothèses et des ordres de grandeur, jamais
 * des prédictions. Voir methode.md (hypothèses H1 à H16).
 * Compatible navigateur, Node (module.exports) et JavaScriptCore (jsc).
 */
(function (root) {
  'use strict';

  var SCENARIOS = ['bas', 'central', 'haut']; // ampleur des réactions : faible / centrale / forte

  // ---------- Paramètres par défaut (miroir de donnees/parametres_assiettes.csv) ----------
  // base en Md€ 2024 ; partTop = part de l'assiette perçue par le « groupe mobile » (top 1 %) ;
  // tau0Top / tau0Reste = taux marginal actuel (haut / reste) ; tau0TopCharge = charge totale actuelle
  // du haut utilisée pour la décision de partir ; mobilite = part de la recette du haut perdue si
  // la personne part ; e = élasticités au taux net (1 − t) ; recup = part de l'assiette retenue
  // récupérée plus tard (plus-value, transmission) ; ecart = part du flux économique jamais déclarée.
  function A(id, nom, base, partTop, tau0Top, tau0TopCharge, tau0Reste, mobilite, eTop, eReste, recup, ecart, groupe) {
    return { id: id, nom: nom, base: base, partTop: partTop, tau0Top: tau0Top, tau0TopCharge: tau0TopCharge,
      tau0Reste: tau0Reste, mobilite: mobilite, eTop: eTop, eReste: eReste, recup: recup, ecart: ecart, groupe: groupe };
  }
  var Z = [0, 0, 0];
  var DEFAUTS = {
    taux: 0.5,
    assiettes: [
      A('salaires', 'Salaires au coût employeur', 1466.5, 0.07, 0.61, 0.61, 0.45, 1, [0.12, 0.25, 0.40], Z, Z, Z, 'A'),
      A('independants', 'Revenu des indépendants', 121.9, 0.15, 0.55, 0.55, 0.45, 1, [0.12, 0.25, 0.40], [0.05, 0.10, 0.20], Z, Z, 'A'),
      A('loyers', 'Loyers réels nets', 40.9, 0.20, 0.59, 0.59, 0.45, 0, [0.05, 0.10, 0.20], [0.05, 0.10, 0.20], Z, Z, 'A'),
      A('interets', 'Intérêts reçus', 71.7, 0.15, 0.34, 0.34, 0.15, 0.8, [0.20, 0.40, 0.80], [0.20, 0.40, 0.80], Z, Z, 'A'),
      A('dividendes', 'Dividendes reçus', 74.9, 0.85, 0.34, 0.505, 0.30, 0.75, [0.50, 1.00, 2.00], [0.50, 1.00, 2.00], [0.5, 0.3, 0.1], Z, 'A'),
      A('assurance_vie', "Revenus de l'assurance-vie", 67.5, 0.20, 0.30, 0.30, 0.247, 0.8, [0.20, 0.40, 0.80], [0.20, 0.40, 0.80], Z, Z, 'A'),
      A('plus_values', 'Plus-values réalisées', 25.6, 0.70, 0.34, 0.34, 0.30, 0.9, [0.30, 0.60, 1.00], [0.30, 0.60, 1.00], [0.5, 0.3, 0.1], Z, 'A'),
      A('transmissions', 'Transmissions (successions et donations)', 300, 0.25, 0.10, 0.10, 0.05, 0.8, [0.05, 0.10, 0.20], [0.05, 0.10, 0.20], Z, [0.15, 0.25, 0.375], 'B')
    ],
    // Mobilité (stock de long terme, ≈ 10 ans) : élasticité au taux net de la population du haut
    eta: [0.05, 0.15, 0.40],           // nationaux (H13)
    etaEtrangers: [0.5, 1.0, 1.5],     // résidents étrangers (H14)
    partEtrangers: 0.10,               // part des étrangers dans le groupe mobile (H14, hypothèse)
    chevauchement: [0.3, 0.5, 0.7],    // part des revenus du haut détenue par les familles qui partent à cause des transmissions (H13 bis)
    effetEntreprise: [0, 0.0002, 0.0005], // baisse de la masse salariale par point d'« impôt-fortune équivalent » (H15)
    horizonTransmission: 25,           // années pour convertir un droit de succession en impôt annuel équivalent
    nbTop1: 378333,                    // foyers du top 1 % (2016, Bach et al. 2025, simu_7)
    nbTop01: 37800,                    // foyers du top 0,1 % (2016, Note IPP n°92)
    nationalite: 0                     // k : part de l'impôt réellement perçue sur un national parti (H16)
  };

  function idx(scenario) {
    var i = SCENARIOS.indexOf(scenario);
    if (i < 0) throw new Error('scénario inconnu : ' + scenario);
    return i;
  }

  function fusionner(opts) {
    var p = {}, k;
    for (k in DEFAUTS) p[k] = DEFAUTS[k];
    if (opts) for (k in opts) if (opts[k] !== undefined) p[k] = opts[k];
    return p;
  }

  // ---------- Briques ----------

  /** Rapport des taux nets (1 − t1) / (1 − t0). */
  function rapportNet(t0, t1) { return (1 - t1) / (1 - t0); }

  /** Facteur de réponse intensive : rapport^e (élasticité du revenu imposable). */
  function facteurIntensif(t0, t1, e) { return Math.pow(rapportNet(t0, t1), e); }

  /** Élasticité de mobilité effective d'un groupe quand l'impôt suit la nationalité avec une efficacité k :
   *  les étrangers gardent leur élasticité ; celle des nationaux est réduite de (1 − k). */
  function etaEffectif(eta, etaEtr, partEtr, k) {
    return partEtr * etaEtr + (1 - partEtr) * eta * (1 - k);
  }

  /** Variation relative (stock) du groupe mobile pour un rapport de taux nets r.
   *  Sortie (r < 1) : étrangers à etaEtr, nationaux à eta (1 − k). Entrée (r > 1) : la nationalité ne joue pas. */
  function variationGroupe(r, eta, etaEtr, partEtr, k) {
    var kk = r < 1 ? k : 0;
    return partEtr * (Math.pow(r, etaEtr) - 1) + (1 - partEtr) * (Math.pow(r, eta * (1 - kk)) - 1);
  }

  /** Rapport de taux nets moyen d'un groupe de contribuables du haut, pondéré par leurs revenus. */
  function rapportGroupe(assiettes, groupe, taux) {
    var avant = 0, apres = 0;
    assiettes.forEach(function (a) {
      if (a.groupe !== groupe) return;
      var m = a.base * a.partTop;
      avant += m * (1 - a.tau0TopCharge);
      apres += m * (1 - taux);
    });
    return avant > 0 ? apres / avant : 1;
  }

  /** Taux annuel d'impôt sur le patrimoine équivalent à un droit de transmission t payé une fois après T ans. */
  function impotFortuneEquivalent(t, T) { return 1 - Math.pow(1 - t, 1 / T); }

  // ---------- Calcul d'une assiette ----------

  function calculerAssiette(a, s, taux, migration) {
    var i = idx(s);
    var base = a.base;
    var ecart = a.ecart[i];
    var declaree = base * (1 - ecart);
    var top = declaree * a.partTop, reste = declaree - top;
    var fTop = facteurIntensif(a.tau0Top, taux, a.eTop[i]);
    var fReste = facteurIntensif(a.tau0Reste, taux, a.eReste[i]);
    var topApresIntensif = top * fTop, resteApresIntensif = reste * fReste;
    var perteMigration = topApresIntensif * a.mobilite * (-migration); // migration < 0 = départs
    var finale = topApresIntensif + resteApresIntensif - perteMigration;
    var perteIntensive = (top - topApresIntensif) + (reste - resteApresIntensif);
    var recupere = Math.max(0, perteIntensive) * a.recup[i];
    var statique = taux * base;
    var recette = taux * (finale + recupere);
    return {
      id: a.id, nom: a.nom, base: base, statique: statique, recette: recette, perte: statique - recette,
      perteEcart: taux * base * ecart,
      perteIntensive: taux * (perteIntensive - recupere),
      perteMigration: taux * perteMigration,
      baseFinale: finale + recupere, coefficient: (finale + recupere) / base,
      revenuPartants: perteMigration
    };
  }

  // ---------- Calcul complet ----------

  /** opts : { taux, scenario, nationalite (k), assiettes, eta, ... } ; renvoie le détail par assiette et les totaux. */
  function calculer(opts) {
    var p = fusionner(opts);
    var s = p.scenario || 'central', i = idx(s), k = p.nationalite;
    var rA = rapportGroupe(p.assiettes, 'A', p.taux);
    var rB = rapportGroupe(p.assiettes, 'B', p.taux);
    var mA = variationGroupe(rA, p.eta[i], p.etaEtrangers[i], p.partEtrangers, k);
    var mB = variationGroupe(rB, p.eta[i], p.etaEtrangers[i], p.partEtrangers, k);
    var mB0 = variationGroupe(rB, p.eta[i], p.etaEtrangers[i], p.partEtrangers, 0);
    // Les familles qui partent à cause des transmissions emportent aussi leurs revenus (chevauchement h)
    var mAtotal = mA + p.chevauchement[i] * mB;
    var lignes = p.assiettes.map(function (a) {
      return calculerAssiette(a, s, p.taux, a.groupe === 'B' ? mB : mAtotal);
    });
    // Effet sur les entreprises des partants (H15) : baisse de la masse salariale, proportionnelle aux départs
    var trans = p.assiettes.filter(function (a) { return a.groupe === 'B'; })[0];
    var dPoints = trans ? 100 * (impotFortuneEquivalent(p.taux, p.horizonTransmission) -
      impotFortuneEquivalent(trans.tau0TopCharge, p.horizonTransmission)) : 0;
    var sal = p.assiettes.filter(function (a) { return a.id === 'salaires'; })[0];
    var echelle = mB0 !== 0 ? mB / mB0 : 0;
    var baseEntreprise = sal ? sal.base * p.effetEntreprise[i] * Math.max(0, dPoints) * echelle : 0;
    var perteEntreprise = p.taux * baseEntreprise;
    var tot = { statique: 0, recette: 0, perte: 0, perteEcart: 0, perteIntensive: 0, perteMigration: 0 };
    lignes.forEach(function (l) { for (var c in tot) tot[c] += l[c]; });
    tot.perte += perteEntreprise; tot.recette -= perteEntreprise;
    var lt = lignes.filter(function (l) { return l.id === 'transmissions'; })[0];
    return {
      scenario: s, taux: p.taux, nationalite: k, lignes: lignes, totaux: tot,
      perteEntreprise: perteEntreprise, pointsImpotFortuneEquivalent: dPoints,
      groupeA: { rapportNet: rA, variation: mA, variationAvecFamilles: mAtotal, partants: -mA * p.nbTop1, partantsTop01: -mA * p.nbTop01,
        revenuPartants: sumRevenu(lignes, 'A', p.assiettes) },
      groupeB: { rapportNet: rB, variation: mB, partants: -mB * p.nbTop1, partantsTop01: -mB * p.nbTop01,
        revenuPartants: sumRevenu(lignes, 'B', p.assiettes) },
      // Branchement simulateur : curseur « fuite des héritages » (0-1) et coefficients par assiette
      fuiteTransmissions: lt ? 1 - lt.coefficient : 0,
      coefficients: lignes.reduce(function (o, l) { o[l.id] = l.coefficient; return o; }, {})
    };
  }

  function sumRevenu(lignes, g, assiettes) {
    var t = 0;
    lignes.forEach(function (l, j) { if (assiettes[j].groupe === g) t += l.revenuPartants; });
    return t;
  }

  /** Tableau scénarios × efficacité de l'imposition selon la nationalité. */
  function grille(ks, opts) {
    var out = [];
    SCENARIOS.forEach(function (s) {
      ks.forEach(function (k) {
        var o = {}, c;
        if (opts) for (c in opts) o[c] = opts[c];
        o.scenario = s; o.nationalite = k;
        out.push(calculer(o));
      });
    });
    return out;
  }

  // ---------- CSV ----------

  function parseCSV(texte) {
    var lignes = texte.split(/\r?\n/).filter(function (l) { return l.trim() && l.charAt(0) !== '#'; });
    function couper(l) {
      var res = [], cur = '', q = false;
      for (var j = 0; j < l.length; j++) {
        var ch = l.charAt(j);
        if (q) { if (ch === '"') { if (l.charAt(j + 1) === '"') { cur += '"'; j++; } else q = false; } else cur += ch; }
        else if (ch === '"') q = true; else if (ch === ',') { res.push(cur); cur = ''; } else cur += ch;
      }
      res.push(cur); return res;
    }
    var tete = couper(lignes[0]);
    return lignes.slice(1).map(function (l) {
      var v = couper(l), o = {};
      tete.forEach(function (h, j) { o[h] = v[j]; });
      return o;
    });
  }

  /** Construit la liste d'assiettes à partir de donnees/parametres_assiettes.csv. */
  function assiettesDepuisCSV(texte) {
    return parseCSV(texte).map(function (r) {
      function t3(p) { return [+r[p + '_bas'], +r[p + '_central'], +r[p + '_haut']]; }
      return A(r.id, r.nom, +r.base, +r.partTop, +r.tau0Top, +r.tau0TopCharge, +r.tau0Reste, +r.mobilite,
        t3('eTop'), t3('eReste'), t3('recup'), t3('ecart'), r.groupe);
    });
  }

  var api = {
    SCENARIOS: SCENARIOS, DEFAUTS: DEFAUTS,
    rapportNet: rapportNet, facteurIntensif: facteurIntensif, etaEffectif: etaEffectif,
    variationGroupe: variationGroupe, rapportGroupe: rapportGroupe, impotFortuneEquivalent: impotFortuneEquivalent,
    calculerAssiette: calculerAssiette, calculer: calculer, grille: grille,
    parseCSV: parseCSV, assiettesDepuisCSV: assiettesDepuisCSV
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ReactionsAssiettes = api;
})(this);
