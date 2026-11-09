/*
 * modeles/fiscalite-orientation/modele.js
 * Fiscalité d'orientation : TVA à 0 % sur la nécessité, accises sur le carboné,
 * taxe carbone sur les importations (scénario « règles européennes dépassées »).
 * Fonctions pures, sans dépendance. Compatible navigateur, Node et JavaScriptCore (jsc).
 *
 * Pour chaque poste de consommation des ménages (Insee, comptes nationaux 2024) :
 *   - une hausse de prix τ (accise, en part du prix TTC actuel) ou une baisse de TVA ;
 *   - une réponse de la quantité q = (1 + Δprix)^ε (élasticité-prix constante) ;
 *   - des recettes nouvelles, des recettes anciennes perdues, un effet « budget » (ce qui
 *     est dépensé en plus ou en moins sur le poste l'est en moins ou en plus ailleurs) ;
 *   - des émissions évitées = intensité (kg CO2e par € de dépense initiale) × baisse de volume ;
 *   - un effet rebond : les recettes nettes, rendues aux ménages, sont dépensées.
 * La charge de chaque poste est répartie entre déciles de niveau de vie selon l'enquête
 * Budget de famille 2017 (Insee, TF106). Hypothèses H1 à H20 : voir methode.md.
 * Ordres de grandeur, jamais des prédictions.
 */
(function (root) {
  'use strict';

  // ---------- Données (voir donnees/*.csv ; ⚠️ = non confirmé) ----------

  // Clés de répartition entre déciles : dépense annuelle moyenne par ménage, Budget de famille 2017.
  var BDF = {
    c011: [2531, 3061, 3148, 3672, 3590, 3888, 3987, 4571, 4784, 5735],
    c0112: [605, 772, 784, 970, 901, 1001, 1008, 1090, 1138, 1302],
    c0113: [162, 184, 198, 251, 240, 296, 282, 357, 421, 583],
    c03: [902, 993, 1018, 1043, 1087, 1279, 1422, 1625, 2020, 2344],
    c044: [728, 834, 775, 757, 689, 771, 793, 844, 932, 1216],
    c0451: [592, 635, 640, 683, 714, 759, 814, 808, 855, 957],
    c0452: [159, 209, 251, 237, 245, 250, 270, 259, 266, 386],
    c0453: [73, 110, 102, 157, 129, 132, 132, 133, 109, 129],
    c05: [593, 773, 1013, 997, 1102, 1331, 1599, 2015, 2254, 3889],
    c061: [139, 180, 187, 209, 246, 234, 255, 283, 400, 410],
    c0711: [617, 771, 960, 1363, 1441, 1815, 2202, 2527, 2317, 4055],
    c0722: [622, 754, 868, 1006, 1174, 1196, 1333, 1288, 1462, 1375],
    c091: [167, 154, 162, 177, 211, 228, 318, 298, 368, 482],
    c096: [89, 93, 107, 174, 227, 276, 340, 474, 677, 1171],
    total: [16123, 18322, 20071, 22638, 23787, 27081, 29059, 32645, 35867, 48353]
  };
  function somme(a, b) { return a.map(function (x, i) { return x + b[i]; }); }
  function diff(a, b) { return a.map(function (x, i) { return x - b[i]; }); }

  var DONNEES = {
    annee: 2024,
    consoMenagesMdE: 1527.1,          // P3 S14 2024 (Insee)
    empreinteTotaleMt: 574.7,         // empreinte GES 2024 (Insee-SDES)
    empreinteMenagesMt: 405.7,        // consommation des ménages 304,4 + émissions directes 101,3
    rdnParDecileMdE: [53.19, 86.94, 110.49, 127.61, 140.93, 156.18, 174.5, 198.54, 232.42, 385.4], // DINA 2023
    menages: 30.907e6,                // RP 2022
    tauxTaxeReste: 0.09,              // H14 ⚠️ : part des taxes dans le prix du reste de la consommation
    intensiteReste: 0.2,              // H15 : kg CO2e/€ de la consommation qui absorbe les reports de budget
    intensiteRecyclage: 0.263,        // H16 : kg CO2e/€ moyen de la consommation des ménages (y c. directes)
    propensionDepenser: 0.9,          // H16 ⚠️
    // Postes soumis à une accise (τ en part du prix TTC actuel). Conso en Md€ TTC 2024 (Insee).
    // e = élasticité-prix (valeur absolue) selon le scénario de comportement ; i = kg CO2e / € ;
    // t0 = part des taxes actuelles dans le prix TTC ; cle = répartition entre déciles.
    accises: {
      viande:          { libelle: 'Viande (consommation à domicile)', conso: 33.338, t0: 0.052,
                         e: { bas: 0.4, central: 0.7, haut: 1.0 }, i: { bas: 0.6, central: 1.0, haut: 1.4 }, cle: BDF.c0112 },
      carburants:      { libelle: 'Carburants', conso: 51.955, t0: 0.5,
                         e: { bas: 0.2, central: 0.45, haut: 0.7 }, i: { bas: 1.6, central: 1.68, haut: 1.75 }, cle: BDF.c0722 },
      chauffage:       { libelle: 'Chauffage au gaz et au fioul', conso: 19.844, t0: 0.25,
                         e: { bas: 0.1, central: 0.2, haut: 0.5 }, i: { bas: 1.7, central: 2.2, haut: 2.4 }, cle: somme(BDF.c0452, BDF.c0453) },
      aerien:          { libelle: 'Transport aérien de voyageurs', conso: 15.733, t0: 0.05,
                         e: { bas: 0.5, central: 0.8, haut: 1.2 }, i: { bas: 1.0, central: 1.0, haut: 1.8 }, cle: BDF.c096 },
      voituresLourdes: { libelle: 'Voitures neuves lourdes (part de CP0711)', conso: 35.882, part: 0.4, t0: 0.2,
                         e: { bas: 0.5, central: 1.0, haut: 1.5 }, i: { bas: 0.23, central: 0.23, haut: 0.23 }, cle: BDF.c0711 }
    },
    // Postes passés à 0 % de TVA. r = taux actuel équivalent.
    tvaZero: {
      alimentation: { libelle: 'Alimentation hors viande et poisson', conso: 131.252, r: 0.055,
                      e: { bas: 0.3, central: 0.59, haut: 0.8 }, i: 0.4, cle: diff(diff(BDF.c011, BDF.c0112), BDF.c0113) },
      eau:          { libelle: 'Eau (réseau et bouteille)', conso: 7.760, r: 0.055,
                      e: { bas: 0.05, central: 0.1, haut: 0.3 }, i: 0.1, cle: BDF.c044 },
      medicaments:  { libelle: 'Médicaments et produits de santé', conso: 21.610, r: 0.059,
                      e: { bas: 0.05, central: 0.1, haut: 0.3 }, i: 0.3, cle: BDF.c061 }
    },
    // Importations des ménages (scénario hors règles) : valeur Md€, intensités importé / français.
    importations: {
      manufactures:          { libelle: 'Biens manufacturés importés', valeur: 196.5, iImp: 0.268, iFr: 0.177,
                               cle: somme(somme(somme(BDF.c03, BDF.c05), BDF.c0711), BDF.c091) },
      alimentationImportee:  { libelle: 'Produits alimentaires importés', valeur: 58.1, iImp: 0.386, iFr: 0.402, cle: BDF.c011 }
    },
    substitutionImport: { bas: 0.75, central: 1.5, haut: 3.0 },
    fuiteAerien: { bas: 0, central: 0.1, haut: 0.2 },   // H12 ⚠️ : part des vols évités reportés sur des aéroports étrangers
    repercussionBaisseTVA: 1.0                           // H9 ⚠️
  };

  // ---------- Scénarios politiques ----------
  var POLITIQUES = {
    // (1) Conforme au droit de l'UE : TVA 0 % sur les besoins fondamentaux (directive 2022/542),
    // accises nationales (directive 2020/262 art. 1 § 3), taxe par billet d'avion.
    conforme: {
      libelle: 'Conforme au droit européen',
      tvaZero: ['alimentation', 'eau', 'medicaments'],
      accises: { viande: 0.25, carburants: 0.15, chauffage: 0.15, aerien: 0.6, voituresLourdes: 0.25 },
      prixFrontiere: 0
    },
    // (2) Règles européennes dépassées : en plus, taxe carbone sur TOUTES les importations de
    // biens de consommation (y c. intra-UE), selon le contenu en GES.
    horsRegles: {
      libelle: 'Règles européennes dépassées',
      tvaZero: ['alimentation', 'eau', 'medicaments'],
      accises: { viande: 0.25, carburants: 0.15, chauffage: 0.15, aerien: 0.6, voituresLourdes: 0.25 },
      prixFrontiere: 200, // €/t CO2e sur le contenu des importations
      champFrontiere: ['manufactures', 'alimentationImportee']
    }
  };

  function zeros() { return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; }
  function repartir(montant, cle) {
    var s = cle.reduce(function (a, b) { return a + b; }, 0);
    return cle.map(function (x) { return montant * x / s; });
  }
  function ajouter(a, b) { for (var k = 0; k < a.length; k++) a[k] += b[k]; }

  /** Un poste soumis à une accise τ (part du prix TTC). Montants en Md€, émissions en Mt. */
  function effetAccise(poste, tau, comportement, d, fuite) {
    var C = poste.conso * (poste.part || 1);
    var e = -poste.e[comportement], I = poste.i.central;
    var q = Math.pow(1 + tau, e);
    var recetteNouvelle = tau * C * q;
    var perteAnciennes = poste.t0 * C * (1 - q);
    var deltaDepense = C * ((1 + tau) * q - 1);
    var effetBudget = -d.tauxTaxeReste * deltaDepense;
    var net = recetteNouvelle - perteAnciennes + effetBudget;
    var emissionsPoste = I * C * (q - 1) * (1 - (fuite || 0));
    var rebondBudget = -deltaDepense * d.intensiteReste;
    return { base: C, prixPct: tau * 100, volumePct: (q - 1) * 100, recetteNouvelle: recetteNouvelle,
             perteAnciennes: perteAnciennes, effetBudget: effetBudget, net: net,
             emissions: emissionsPoste, rebondBudget: rebondBudget,
             prixImpliciteTonne: I > 0 ? tau * 1000 / I : 0, parDecile: repartir(net, poste.cle) };
  }

  /** Un poste passé à 0 % de TVA. */
  function effetTvaZero(poste, comportement, d, repercussion) {
    var C = poste.conso, r = poste.r, p = repercussion;
    var tvaPerdue = C * r / (1 + r);
    var dPrix = -p * r / (1 + r);
    var q = Math.pow(1 + dPrix, -poste.e[comportement]);
    var deltaDepense = C * ((1 + dPrix) * q - 1);
    var effetBudget = -d.tauxTaxeReste * deltaDepense;
    var net = -tvaPerdue + effetBudget;
    // Les ménages ne gagnent que la part répercutée ; le reste va aux marges des entreprises.
    var gainMenages = p * tvaPerdue;
    return { base: C, prixPct: dPrix * 100, volumePct: (q - 1) * 100, tvaPerdue: tvaPerdue,
             effetBudget: effetBudget, net: net, emissions: poste.i * C * (q - 1),
             rebondBudget: -deltaDepense * d.intensiteReste,
             parDecile: repartir(-gainMenages + effetBudget, poste.cle), margesEntreprises: (1 - p) * tvaPerdue };
  }

  /** Taxe carbone sur les importations (substitution vers la production française). */
  function effetFrontiere(imp, prix, comportement, d) {
    var tau = prix * imp.iImp / 1000;
    var q = Math.pow(1 + tau, -d.substitutionImport[comportement]);
    var recette = tau * imp.valeur * q;
    var volumeSubstitue = imp.valeur * (1 - q);
    return { base: imp.valeur, prixPct: tau * 100, volumePct: (q - 1) * 100, net: recette,
             emissions: volumeSubstitue * (imp.iFr - imp.iImp), rebondBudget: 0,
             parDecile: repartir(recette, imp.cle) };
  }

  /**
   * Simule un scénario.
   * p.politique : 'conforme' | 'horsRegles' (défaut conforme)
   * p.comportement : 'bas' | 'central' | 'haut' (élasticités faibles, centrales, fortes)
   * p.niveau : multiplicateur des taux d'accise et du prix frontière (défaut 1)
   * p.intensites : 'central' | 'haut' | 'bas' (intensités carbone des postes taxés)
   * p.repercussion : part de la baisse de TVA répercutée dans les prix (défaut 1)
   * p.sansTvaZero : true pour ne simuler que les taxes (sans le 0 % sur la nécessité)
   */
  function simuler(p, donnees) {
    p = p || {};
    var d = donnees || DONNEES;
    var pol = POLITIQUES[p.politique || 'conforme'];
    var comp = p.comportement || 'central';
    var niveau = p.niveau === undefined ? 1 : p.niveau;
    var intens = p.intensites || 'central';
    var rep = p.repercussion === undefined ? d.repercussionBaisseTVA : p.repercussion;
    var postes = {}, net = 0, emis = 0, rebondBudget = 0, parDecile = zeros(), k;

    for (k in pol.accises) {
      var poste = d.accises[k];
      var copie = { conso: poste.conso, part: poste.part, t0: poste.t0, e: poste.e, cle: poste.cle,
                    i: { central: poste.i[intens] } };
      var r = effetAccise(copie, pol.accises[k] * niveau, comp, d, k === 'aerien' ? d.fuiteAerien[comp] : 0);
      r.libelle = poste.libelle; postes[k] = r;
      net += r.net; emis += r.emissions; rebondBudget += r.rebondBudget; ajouter(parDecile, r.parDecile);
    }
    (p.sansTvaZero ? [] : pol.tvaZero).forEach(function (k) {
      var r = effetTvaZero(d.tvaZero[k], comp, d, rep);
      r.libelle = d.tvaZero[k].libelle; postes['tva0_' + k] = r;
      net += r.net; emis += r.emissions; rebondBudget += r.rebondBudget; ajouter(parDecile, r.parDecile);
    });
    if (pol.prixFrontiere) {
      pol.champFrontiere.forEach(function (k) {
        var r = effetFrontiere(d.importations[k], pol.prixFrontiere * niveau, comp, d);
        r.libelle = d.importations[k].libelle; postes['frontiere_' + k] = r;
        net += r.net; emis += r.emissions; ajouter(parDecile, r.parDecile);
      });
    }
    var rebondRecyclage = Math.max(net, 0) * d.propensionDepenser * d.intensiteRecyclage;
    var emisNettes = emis + rebondBudget + rebondRecyclage;

    // Effet par décile : charge (Md€ et % du RDN) puis compensation par un versement égal.
    var cheque = net / 10;
    var deciles = parDecile.map(function (c, i) {
      return { decile: i + 1, chargeMdE: c, chargePctRDN: 100 * c / d.rdnParDecileMdE[i],
               chargeParMenageEuros: c * 1e9 / (d.menages / 10),
               netApresVersementEgalMdE: c - cheque,
               netApresVersementEgalPctRDN: 100 * (c - cheque) / d.rdnParDecileMdE[i] };
    });
    return {
      politique: pol.libelle, comportement: comp, niveau: niveau,
      recettesNettesMdE: net, emissionsBrutesMt: emis, rebondBudgetMt: rebondBudget,
      rebondRecyclageMt: rebondRecyclage, emissionsNettesMt: emisNettes,
      emissionsNettesPctEmpreinte: 100 * emisNettes / d.empreinteTotaleMt,
      emissionsNettesPctMenages: 100 * emisNettes / d.empreinteMenagesMt,
      postes: postes, deciles: deciles
    };
  }

  /** Valeur pour le curseur « Fiscalité d'orientation en plus » (0 à 100 Md€, pas de 5). */
  function valeurCurseur(p, donnees) {
    var v = Math.round(simuler(p, donnees).recettesNettesMdE / 5) * 5;
    return Math.max(0, Math.min(100, v));
  }

  /** Les six combinaisons politique × comportement. */
  function scenarios(p, donnees) {
    var r = {};
    ['conforme', 'horsRegles'].forEach(function (pol) {
      ['bas', 'central', 'haut'].forEach(function (c) {
        var q = {}; for (var k in (p || {})) q[k] = p[k];
        q.politique = pol; q.comportement = c;
        r[pol + '_' + c] = simuler(q, donnees);
      });
    });
    return r;
  }

  var API = {
    DONNEES: DONNEES, POLITIQUES: POLITIQUES, BDF: BDF,
    effetAccise: effetAccise, effetTvaZero: effetTvaZero, effetFrontiere: effetFrontiere,
    simuler: simuler, valeurCurseur: valeurCurseur, scenarios: scenarios
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.FiscaliteOrientation = API;
})(this);
