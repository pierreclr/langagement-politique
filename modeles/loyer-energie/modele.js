// Loyer « énergie comprise » : fonctions pures. Données : donnees.js (généré par preparer_donnees.py).
// Lancer : /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc donnees.js modele.js test_modele.js
var LoyerEnergie = (function () {
  var D = (typeof DONNEES_ADEME !== 'undefined') ? DONNEES_ADEME : require('./donnees.js');
  var CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  function idx(c) { return CLASSES.indexOf(c); }

  // H1 : seuils du DPE en énergie primaire (kWh/m²/an) ⚠️ V10201 (le critère GES peut classer plus bas)
  var SEUILS_EP = { A: 70, B: 110, C: 180, D: 250, E: 330, F: 420 };
  function classeEP(ep) { for (var i = 0; i < 6; i++) if (ep <= SEUILS_EP[CLASSES[i]]) return CLASSES[i]; return 'G'; }

  // H2 : prix TTC de l'énergie finale, €/kWh, hors abonnement ⚠️ V10202
  var PRIX = { elec: 0.20, gaz: 0.13, chaleur: 0.11, autre: 0.13, bois: 0.09 };
  function famille(e) {
    if (/^Électricité/.test(e)) return 'elec';
    if (/^Gaz/.test(e)) return 'gaz';
    if (/Chauffage urbain/.test(e)) return 'chaleur';
    if (/^Bois/.test(e)) return 'bois';
    return 'autre';
  }
  function prixMoyen(zone, facteur) {
    var m = D.mix[zone], s = 0, k;
    for (k in m) s += m[k] * PRIX[famille(k)];
    return s * (facteur === undefined ? 1 : facteur);
  }

  // H3 : écart de loyer de marché par classe, par rapport au loyer moyen de la commune ⚠️ V10203
  var PRIME = { A: 0.04, B: 0.03, C: 0.01, D: 0, E: -0.02, F: -0.04, G: -0.06 };

  // H4 : scénarios. protegee = dernière classe que le plafond ne doit pas faire baisser.
  var SCENARIOS = {
    bas:     { libelle: 'peu mordant (protège E)', protegee: 'E', prixFacteur: 0.85, coutSaut: 80,  aide: 0.35, sortie: 0.05, horizon: 15, poidsBesoin: 0.3 },
    central: { libelle: 'central (protège D)',     protegee: 'D', prixFacteur: 1.00, coutSaut: 120, aide: 0.25, sortie: 0.15, horizon: 12, poidsBesoin: 0.5 },
    haut:    { libelle: 'très mordant (protège C)', protegee: 'C', prixFacteur: 1.25, coutSaut: 180, aide: 0.00, sortie: 0.25, horizon: 8,  poidsBesoin: 0.7 }
  };

  // H5 : parc. Résidences principales au 01/01/2025 (SDES) et parc locatif privé (F+G = 13,8 %, G = 453 000 sur ~7,97 M).
  var PARC_RP = { A: 0.033, B: 0.053, C: 0.272, D: 0.337, E: 0.178, F: 0.079, G: 0.048 };
  var PARC_LOCATIF = { n: 1.1e6 / 0.138, fg: 0.138, g: 453000 / (1.1e6 / 0.138) };
  function partsParcLocatifPrive() {
    var o = {}, f = (1 - PARC_LOCATIF.fg) / (1 - PARC_RP.F - PARC_RP.G);
    CLASSES.forEach(function (c) { o[c] = (c === 'F') ? PARC_LOCATIF.fg - PARC_LOCATIF.g : (c === 'G') ? PARC_LOCATIF.g : PARC_RP[c] * f; });
    return o;
  }
  function partsLocales(zone) {
    if (zone === 'fr') return partsParcLocatifPrive();
    var t = 0, o = {}; CLASSES.forEach(function (c) { t += D.dpe[zone][c].n; });
    CLASSES.forEach(function (c) { o[c] = D.dpe[zone][c].n / t; });
    return o;
  }

  // Loyer de marché de référence d'un logement de classe c (€/mois), surface S.
  function loyerMarche(zone, c, S) { return D.loyer[zone] * (1 + PRIME[c]) * S; }

  // Déduction mensuelle (€/mois) : kWh d'énergie finale/m²/an × S × prix / 12
  function deduction(efM2, S, prix) { return efM2 * S * prix / 12; }

  // k minimal pour que le plafond ne morde pas sur les classes A à `protegee`
  function calibrerK(zone, scen, S) {
    S = S || 50; var p = prixMoyen(zone, scen.prixFacteur), kmax = 0;
    for (var i = 0; i <= idx(scen.protegee); i++) {
      var c = CLASSES[i];
      var k = (loyerMarche(zone, c, S) + deduction(D.dpe[zone][c].ef, S, p)) / (D.loyer[zone] * S);
      if (k > kmax) kmax = k;
    }
    return kmax;
  }

  // Tableau par classe pour un coefficient k (plafond A = k × loyer moyen de la commune, par m²)
  function tableauClasses(zone, scen, S, k) {
    S = S || 50; var p = prixMoyen(zone, scen.prixFacteur);
    if (k === undefined) k = calibrerK(zone, scen, S);
    var plafondA = k * D.loyer[zone] * S, parts = partsLocales(zone), out = {};
    CLASSES.forEach(function (c) {
      var ef = D.dpe[zone][c].ef, ded = deduction(ef, S, p), plaf = plafondA - ded, marche = loyerMarche(zone, c, S);
      var baisse = Math.max(0, marche - plaf), apres = Math.min(marche, plaf);
      out[c] = { part: parts[c], efM2: ef, deduction: ded, plafond: plaf, marche: marche, mord: baisse > 1e-9, baisse: baisse, loyerApres: apres,
                 coutTotalLocataire: apres + ded };
    });
    return { zone: zone, S: S, k: k, prixKwh: p, plafondA: plafondA, plafondA_m2: plafondA / S, classes: out };
  }

  // Agrégats d'un tableau
  function agregats(t) {
    var part = 0, baisse = 0, baisseAff = 0, perteRelative = 0;
    CLASSES.forEach(function (c) {
      var x = t.classes[c];
      if (x.mord) { part += x.part; baisseAff += x.part * x.baisse; }
      baisse += x.part * x.baisse;
    });
    return { partMord: part, baisseMoyenneTous: baisse, baisseMoyenneConcernes: part > 0 ? baisseAff / part : 0 };
  }

  // Rénovation de la classe x vers la classe y : coût net (€) et gain annuel de loyer (€) pour le bailleur
  function renovation(t, scen, x, y) {
    var sauts = idx(x) - idx(y); if (sauts <= 0) return null;
    var cout = scen.coutSaut * sauts * t.S * (1 - scen.aide);
    var gain = 12 * (t.classes[y].loyerApres - t.classes[x].loyerApres);
    return { sauts: sauts, coutNet: cout, gainAnnuel: gain, retour: gain > 1e-9 ? cout / gain : Infinity };
  }
  // Meilleure cible (retour le plus court) pour chaque classe de départ
  function meilleuresRenovations(t, scen) {
    var o = {};
    CLASSES.forEach(function (x) {
      var best = null;
      CLASSES.forEach(function (y) {
        var r = renovation(t, scen, x, y); if (!r) return;
        if (!best || r.retour < best.retour) { best = r; best.cible = y; }
      });
      o[x] = best; if (best) best.rentable = best.retour <= scen.horizon;
    });
    return o;
  }

  // Comparaison avec l'interdiction : pour 100 000 logements locatifs privés
  function compareInterdiction(zone, scen, S, N) {
    S = S || 50; N = N || 100000;
    var t = tableauClasses(zone, scen, S), best = meilleuresRenovations(t, scen), parts = partsLocales(zone);
    var sch = { renoves: 0, coutReno: 0, restants: 0, perteLoyer: 0, retires: 0 };
    var ban = { renoves: 0, coutReno: 0, retires: 0 };
    CLASSES.forEach(function (c) {
      var n = parts[c] * N, x = t.classes[c];
      if (best[c] && x.mord) {
        if (best[c].rentable) { sch.renoves += n; sch.coutReno += n * best[c].coutNet; }
        else { var r = n * (1 - scen.sortie); sch.restants += r; sch.retires += n * scen.sortie; sch.perteLoyer += r * x.baisse * 12; }
      }
      if (idx(c) >= idx('E')) {   // interdiction de louer à terme (2034) : rénovation obligatoire jusqu'en D
        var sauts = idx(c) - idx('D'), r2 = n * (1 - scen.sortie);
        ban.renoves += r2; ban.coutReno += r2 * scen.coutSaut * sauts * S * (1 - scen.aide); ban.retires += n * scen.sortie;
      }
    });
    return { N: N, schema: sch, interdiction: ban };
  }

  // ---- Deux cas types : isoler par l'intérieur ou poser une pompe à chaleur dans un G de 50 m² ----
  var CAS = {
    S: 50,
    initial: { gazChauffage: 340, gazEcs: 60, elec: 30, elecChauffage: 0, elecFroid: 0, besoinChaud: 289, besoinFroid: 10 },
    iti:  { libelle: 'Isolation par l\'intérieur (murs + combles)', baisseBesoin: 0.45, cout: 8000, surfacePerdue: 2, eligibleAide: true },
    pac:  { libelle: 'Pompe à chaleur air/air réversible', scop: 3.5, eer: 3.5, besoinFroidApres: 25, cout: 4500, surfacePerdue: 0, eligibleAide: false },
    rendementChaudiere: 0.85, prixRefBesoin: 0.15, valeurM2: 2800
  };
  function etatApres(opt) {
    var i = CAS.initial, e = {};
    if (opt === 'initial') return JSON.parse(JSON.stringify(i));
    if (opt === 'iti') {
      e = JSON.parse(JSON.stringify(i));
      e.gazChauffage = i.gazChauffage * (1 - CAS.iti.baisseBesoin);
      e.besoinChaud = i.besoinChaud * (1 - CAS.iti.baisseBesoin);
      e.besoinFroid = i.besoinFroid * 0.8;
      return e;
    }
    e = JSON.parse(JSON.stringify(i));
    e.gazChauffage = 0; e.elecChauffage = i.besoinChaud / CAS.pac.scop;
    e.elecFroid = CAS.pac.besoinFroidApres / CAS.pac.eer; e.besoinFroid = CAS.pac.besoinFroidApres;
    return e;
  }
  function efTotal(e) { return e.gazChauffage + e.gazEcs + e.elec + e.elecChauffage + e.elecFroid; }
  function epTotal(e, coefElec) { return e.gazChauffage + e.gazEcs + (e.elec + e.elecChauffage + e.elecFroid) * coefElec; }
  function eurosM2(e) { return (e.gazChauffage + e.gazEcs) * PRIX.gaz + (e.elec + e.elecChauffage + e.elecFroid) * PRIX.elec; }
  function dedCas(e, formule, w) {
    var eur = eurosM2(e);
    if (formule === 'euros') return eur * CAS.S / 12;
    return CAS.S * (w * (e.besoinChaud + e.besoinFroid) * CAS.prixRefBesoin + (1 - w) * eur) / 12;
  }
  // formule : 'actuel' | 'euros' | 'euros+besoin'. surfaceFigee : le plafond garde la surface d'avant travaux.
  function casTypes(zone, scen, formule, opts) {
    opts = opts || {}; var coef = opts.coefElec || 1.9, figee = !!opts.surfaceFigee, S0 = CAS.S;
    var k = calibrerK(zone, scen, S0), L = D.loyer[zone], res = {};
    ['initial', 'iti', 'pac'].forEach(function (o) {
      var e = etatApres(o), opt = CAS[o], perdue = (o === 'initial') ? 0 : opt.surfacePerdue;
      var Seff = figee ? S0 : S0 - perdue, cl = classeEP(epTotal(e, coef));
      var marche = L * (1 + PRIME[cl]) * Seff;
      var loyer, ded = dedCas(e, formule === 'actuel' ? 'euros' : formule, scen.poidsBesoin);
      if (formule === 'actuel') loyer = marche;
      else loyer = Math.min(marche, k * L * Seff - ded);
      var capex = o === 'initial' ? 0 : opt.cout * (opt.eligibleAide ? (1 - scen.aide) : 1);
      res[o] = { classe: cl, ep: epTotal(e, coef), ef: efTotal(e), facture: eurosM2(e) * S0 / 12, deduction: ded, loyer: loyer, capex: capex, Seff: Seff };
    });
    ['iti', 'pac'].forEach(function (o) {
      var r = res[o], gain = 12 * (r.loyer - res.initial.loyer);
      r.gainAnnuel = gain; r.retour = gain > 1e-9 ? r.capex / gain : Infinity;
      r.legal2028 = idx(r.classe) <= idx('E'); r.legal2034 = idx(r.classe) <= idx('D');
      r.perteValeur = (CAS[o].surfacePerdue && !figee ? CAS[o].surfacePerdue : (CAS[o].surfacePerdue || 0)) * CAS.valeurM2;
    });
    // choix du bailleur : en régime actuel, l'option la moins chère qui rend le logement louable en 2028 (classe ≤ E) ;
    // avec la formule, l'option au retour le plus court
    var opts2 = ['iti', 'pac'], choix;
    if (formule === 'actuel') {
      var legales = opts2.filter(function (o) { return res[o].legal2028; });
      choix = legales.length ? legales.sort(function (a, b) { return res[a].capex - res[b].capex; })[0] : null;
    } else {
      choix = opts2.sort(function (a, b) { return res[a].retour - res[b].retour; })[0];
    }
    return { formule: formule, k: k, options: res, choix: choix };
  }

  // ---- OPTION (désactivée par défaut) : seuil sanitaire mesuré, 04/11/2026 (méthode §10, sources/logement-sante.md) ----
  // Complément à la mesure 26 : un logement qui franchit un seuil sanitaire MESURÉ (température atteignable, humidité, moisissures)
  // est retiré de la location jusqu'à mise en conformité (interdiction ciblée, mesure 25), quel que soit son loyer.
  // Aucune valeur par défaut des autres fonctions n'en dépend : il faut passer { actif: true } ou mettre OPTIONS.sanitaire.actif à true.
  var OPTIONS = { sanitaire: { actif: false } };
  // S1 : risque relatif de franchir le seuil, par classe DPE (hypothèse ⚠️ V11996 : le DPE ne mesure pas le risque sanitaire, il le corrèle ; ne sert qu'à répartir un total calibré)
  var RR_SANITAIRE = { A: 0.2, B: 0.2, C: 0.5, D: 1, E: 2, F: 4, G: 8 };
  // S2 : part du parc locatif privé qui franchit le seuil, coût de mise en conformité par logement (€), bénéfice de santé évité par logement et par an (€).
  // bas : 313 logements pour 100 000 (froid extrême, Angleterre, Ormandy) ; haut : 600 000 logements inadaptés occupés par des ménages pauvres,
  // rapportés au parc locatif privé (borne haute : ce parc n'est pas que locatif privé) ; central : moyenne géométrique. ⚠️ V11993 à V11998
  var SANITAIRE = {
    bas:     { part: 313 / 100000,      coutTravaux: 5975,  beneficeAn: 20400 },
    central: { part: 0.027,             coutTravaux: 8000,  beneficeAn: 4100 },
    haut:    { part: 600000 / 8.0e6,    coutTravaux: 10833, beneficeAn: 833 }
  };
  // Dénombre les logements qui franchissent le seuil (pour N logements locatifs privés), par classe, puis chiffre trois mécanismes.
  function optionSanitaire(zone, scenNom, N, opts) {
    opts = opts || {};
    if (!(opts.actif || OPTIONS.sanitaire.actif)) return null;
    N = N || 100000;
    var scen = SCENARIOS[scenNom], sa = SANITAIRE[scenNom], t = tableauClasses(zone, scen, 50), parts = partsLocales(zone), poids = 0;
    CLASSES.forEach(function (c) { poids += parts[c] * RR_SANITAIRE[c]; });
    var o = { N: N, parClasse: {}, total: 0, dansPlafondMordant: 0, horsPlafond: 0 };
    CLASSES.forEach(function (c) {
      var n = N * sa.part * parts[c] * RR_SANITAIRE[c] / poids;
      o.parClasse[c] = { n: n, partDeLaClasse: n / (N * parts[c]) };
      o.total += n;
      if (t.classes[c].mord) o.dansPlafondMordant += n; else o.horsPlafond += n;
    });
    var loyerMoyen = D.loyer[zone] * 50;  // €/mois pour 50 m²
    // (a) interdiction ciblée : le bailleur répare (coût net) ou sort du marché (part « sortie » du scénario)
    var repare = o.total * (1 - scen.sortie);
    o.interdiction = { repares: repare, retires: o.total * scen.sortie, coutTravaux: repare * sa.coutTravaux, loyerPerduPendantTravaux: o.total * loyerMoyen * 6 };  // 6 mois de vacance (hypothèse S3 ⚠️)
    // (b) loyer plancher à zéro : perte de loyer du bailleur, aucun travaux garanti
    o.loyerZero = { loyerPerduAn: o.total * loyerMoyen * 12 };
    // (c) travaux d'office avec recouvrement : l'État avance ; défaut de recouvrement (hypothèse S4 ⚠️ : 30 %)
    o.travauxOffice = { avance: o.total * sa.coutTravaux, perteNette: o.total * sa.coutTravaux * 0.30 };
    o.beneficeSanteAn = o.total * sa.beneficeAn;
    o.retourSante = sa.coutTravaux / sa.beneficeAn;
    return o;
  }


  // ---- DPE mesuré : normalisation et base hybride ----
  // Consommation de chauffage normalisée : kWh mesurés × DJU de référence / DJU de l'année
  function consoNormalisee(kwhChauffage, djuAnnee, djuRef) { return kwhChauffage * djuRef / djuAnnee; }
  // Base de déduction hybride : par défaut le 3CL ; si une mesure normalisée sur ≥ 12 mois existe,
  // elle remplace le 3CL, bornée à [bas × 3CL ; haut × 3CL] pour que vivre au froid ou gaspiller ne change pas le loyer
  function baseHybride(efConventionnel, efMesure, bornes) {
    bornes = bornes || { bas: 0.5, haut: 1.5 };
    if (efMesure === null || efMesure === undefined) return efConventionnel;
    return Math.min(bornes.haut * efConventionnel, Math.max(bornes.bas * efConventionnel, efMesure));
  }
  // Part de l'écart de consommation entre deux classes effectivement observée (CAE 2024 : environ 1/6 entre A-B et G)
  function gainReelLocataire(efX, efY, realise) { return (efX - efY) * realise; }

  return { consoNormalisee: consoNormalisee, baseHybride: baseHybride, gainReelLocataire: gainReelLocataire, CLASSES: CLASSES, PRIX: PRIX, PRIME: PRIME, SCENARIOS: SCENARIOS, CAS: CAS, SEUILS_EP: SEUILS_EP,
    classeEP: classeEP, prixMoyen: prixMoyen, partsLocales: partsLocales, partsParcLocatifPrive: partsParcLocatifPrive, PARC_LOCATIF: PARC_LOCATIF,
    loyerMarche: loyerMarche, deduction: deduction, calibrerK: calibrerK, tableauClasses: tableauClasses, agregats: agregats,
    renovation: renovation, meilleuresRenovations: meilleuresRenovations, compareInterdiction: compareInterdiction, casTypes: casTypes,
    OPTIONS: OPTIONS, SANITAIRE: SANITAIRE, RR_SANITAIRE: RR_SANITAIRE, optionSanitaire: optionSanitaire };
})();
if (typeof module !== 'undefined') module.exports = LoyerEnergie;
