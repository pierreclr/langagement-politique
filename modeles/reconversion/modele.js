/*
 * modeles/reconversion/modele.js
 * Que deviennent les personnes dont le métier disparaît avec la simplification fiscale et sociale ?
 * Combien cela coûte-t-il à la société et au budget, et à partir de quand le gain de conformité
 * l'emporte-t-il ?
 *
 * Fonctions pures, sans dépendance. Compatible navigateur, Node (module.exports) et JavaScriptCore (jsc).
 * Ce sont des hypothèses et des ordres de grandeur, jamais des prédictions (methode.md, H1 à H24).
 *
 * Chaîne de calcul (par trimestre, de 2029 à 2064) :
 *   1. postes à supprimer (modèle T6 « industrie de la complexité », par bloc) étalés selon un calendrier ;
 *   2. absorption par les départs non remplacés (retraites + mobilité volontaire) dans l'ensemble du métier ;
 *   3. le reste devient, en partie, des séparations (personnes déplacées), réparties par âge ;
 *   4. pour chaque cohorte de déplacés : fonction de survie dans le non-emploi (mélange de deux types,
 *      par classe d'âge), formation, aide à la mobilité, sortie en retraite à l'âge légal ;
 *   5. au retour : perte de salaire qui décroît avec le temps ;
 *   6. sorties : production manquante (PIB), coût budgétaire (impôt perdu au taux plat, complément
 *      dégressif, plancher de 877 €, formation), perte des personnes, gain net pour la société.
 */
(function (root) {
  'use strict';

  var MARCHES = ['favorable', 'central', 'defavorable'];
  // H17 : conventions de valorisation du gain. v1 = celle de T6 (la complexité ne produit rien,
  // le travail réalloué vaut la VA moyenne) ; v2 = T6 v2 central ; prudente = T6 v2 bas.
  var CONVENTIONS = [{ id: 'v1', ailleurs: 1, ici: 0 }, { id: 'v2', ailleurs: 0.85, ici: 0.25 }, { id: 'prudente', ailleurs: 0.7, ici: 0.5 }];
  var TAILLES = ['bas', 'central', 'haut'];             // scénarios de T6 (taille de ce qui disparaît)
  var AN0 = 2029, NB_ANS = 36;                          // 2029 à 2064

  /* ---------------- Données (sources : methode.md § 2 et donnees/*.csv) ---------------- */
  var D = {
    // T6 (modeles/industrie-complexite, resultats.md § 3) : postes qui disparaissent, en équivalents
    // temps plein, par bloc. Recalculés à partir du module T6 s'il est chargé (fonction postesT6).
    postesT6: {
      bas: { externe: 34492, interne: 72177 },
      central: { externe: 79240, interne: 180442 },
      haut: { externe: 141967, interne: 336825 }
    },
    gainT6: { // coût évité et gain réel net de T6 (Md€/an, régime de croisière)
      bas: { coutEvite: 10.0, gainReelNet: 3.46, tauxReemploi: 0.6, coutSysteme: 1.5 },
      central: { coutEvite: 24.32, gainReelNet: 15.10, tauxReemploi: 0.8, coutSysteme: 1.0 },
      haut: { coutEvite: 45.26, gainReelNet: 32.89, tauxReemploi: 0.9, coutSysteme: 0.5 }
    },
    vaParEmploi: 77488,           // € par personne occupée, NAF 69.20, 2024 (Eurostat SBS ; T6)
    baseMetier: 1424000,          // personnes dans les métiers de la comptabilité et de la gestion, 2019 (Métiers 2030 ; T6)
    tauxRetraite: 0.0259,         // départs en fin de carrière par an, 2019-2030 (406 000 / 1 424 000 / 11 ; Métiers 2030 ; T6)
    // structure par âge des déplacés (parts, somme 1) : 20-29, 30-39, 40-49, 50-54, 55-59, 60-63
    classesAge: [[20, 29], [30, 39], [40, 49], [50, 54], [55, 59], [60, 63]],
    partsAge: [0.16, 0.25, 0.26, 0.13, 0.13, 0.07],   // H7 ⚠️ : 33 % de 50 ans et plus
    netMensuel: 2100,             // € net par mois, salaire moyen des personnes déplacées (H8)
    ratioCoutNet: 1.47,           // coût du travail / net (2 410 / 1 639, systeme-ideal H214)
    // architecture v4 (modeles/systeme-ideal/optimum.md, 03/11/2026)
    tauxPlat: 0.41, socle: 350, plancher: 877, ageRetraite: 64,
    // complément dégressif « deg2 » (systeme-ideal H92, H107) : part de (net − socle) par trimestre
    // depuis la séparation : mois 1-3 60 %, 4-6 40 %, 7-12 20 %, puis 0 ; net plafonné à 3 000 €
    deg2: [0.6, 0.4, 0.2, 0.2], plafondNetDeg2: 3000
  };

  /* ---------------- Paramètres de marché du travail (favorable / central / défavorable) ---------------- */
  var P = {
    efficaciteAbsorption: { favorable: 0.7, central: 0.5, defavorable: 0.3 },   // H3
    mobiliteVolontaire: { favorable: 0.015, central: 0.01, defavorable: 0.005 },// H4 (part du métier qui part chaque année, hors retraite)
    separationInterne: { favorable: 0.4, central: 0.6, defavorable: 0.8 },      // H5 : part du non-absorbé qui devient séparation
    separationExterne: { favorable: 0.6, central: 0.75, defavorable: 0.9 },
    // H6 : retour à l'emploi par classe d'âge. pi = part « éloignée » (taux trimestriel hL) ;
    // r12 = probabilité de retour en un an du type « mobile ».
    pi: {
      favorable: [0.07, 0.08, 0.08, 0.13, 0.24, 0.50],
      central: [0.11, 0.12, 0.13, 0.20, 0.35, 0.70],
      defavorable: [0.15, 0.17, 0.18, 0.27, 0.47, 0.88]
    },
    r12: {
      favorable: [0.80, 0.78, 0.78, 0.68, 0.52, 0.32],
      central: [0.65, 0.62, 0.62, 0.53, 0.40, 0.22],
      defavorable: [0.50, 0.48, 0.48, 0.40, 0.28, 0.14]
    },
    hL: { favorable: 0.06, central: 0.035, defavorable: 0.02 },   // taux trimestriel de retour du type « éloigné »
    // H9 : perte de salaire au retour, L(y) = Linf + (L0 − Linf) e^(−y/kappa), y = années depuis la séparation
    L0: { favorable: 0.10, central: 0.15, defavorable: 0.20 },
    Linf: { favorable: 0.04, central: 0.07, defavorable: 0.10 },
    kappa: 3, facteurSenior: { favorable: 1.2, central: 1.3, defavorable: 1.5 },  // 50 ans et plus
    // H11 : formation
    partFormee: { favorable: 0.6, central: 0.5, defavorable: 0.4 },
    coutFormation: { favorable: 5000, central: 10000, defavorable: 29000 },
    effetFormation: { favorable: 0.30, central: 0.15, defavorable: 0.05 },  // hausse relative du taux de retour après l'enfermement
    enfermement: 2, facteurEnfermement: 0.6,                                 // 2 trimestres à 60 % du taux
    // H13 : plancher de 877 € : part des déplacés dont le ménage y a droit en entier
    eligiblesPlancher: { favorable: 0.30, central: 0.45, defavorable: 0.60 },
    // H15 : part de l'impôt perdu récupérée par l'impôt sur les économies des clients (profits, prix, revenus)
    recuperation: { favorable: 0.5, central: 0.3, defavorable: 0.0 },
    actualisation: 0.025
  };

  /* Politiques (H18) : appliquées par-dessus les paramètres. */
  var POLITIQUES = {
    aucune: {},
    formationCiblee: { partFormeeSenior: 0.9, effetFormationSenior: 0.25, coutFormationSenior: 12000 },
    mobilite: { effetMobilite: 0.10, coutMobilite: 1500, partMobilite: 0.3 },
    toutes: { partFormeeSenior: 0.9, effetFormationSenior: 0.25, coutFormationSenior: 12000,
      effetMobilite: 0.10, coutMobilite: 1500, partMobilite: 0.3 }
  };

  function val(p, sc) {
    if (p === null || p === undefined) return 0;
    if (typeof p === 'number') return p;
    if (Array.isArray(p)) return p;
    if (p[sc] === undefined) throw new Error('scénario absent : ' + sc);
    return p[sc];
  }

  /** Postes qui disparaissent par bloc, depuis le module T6 s'il est chargé, sinon les constantes. */
  function postesT6(T6, taille) {
    if (!T6) return D.postesT6[taille];
    var r = T6.evaluer(T6.SEGMENTS, taille);
    return { externe: r.parBloc['A. Marché externe'].emploisDisparait, interne: r.parBloc['B. Travail interne des employeurs'].emploisDisparait };
  }

  /** Calendrier : poids annuels des suppressions (somme 1). 'rapide' = 2029-2032 ; 'lent' = 2029-2038. */
  function calendrier(type, nbAns) {
    var n = type === 'rapide' ? 4 : type === 'lent' ? 10 : type === 'tres-lent' ? 15 : +type;
    var w = []; for (var i = 0; i < nbAns; i++) w.push(i < n ? 1 / n : 0);
    return w;
  }

  /** Taux trimestriel équivalent à une probabilité annuelle. */
  function trimestriel(pAn) { return 1 - Math.pow(1 - pAn, 0.25); }

  /** Fonction de survie dans le non-emploi après q trimestres (mélange de deux types). */
  function survie(q, pi, hMobile, hL) {
    return pi * Math.pow(1 - hL, q) + (1 - pi) * Math.pow(1 - hMobile, q);
  }

  /** Perte de salaire relative au retour, y années après la séparation. */
  function perteSalaire(y, L0, Linf, kappa) { return Linf + (L0 - Linf) * Math.exp(-y / kappa); }

  /** Allocation mensuelle d'un déplacé sans emploi au trimestre q depuis la séparation (€/mois), hors socle. */
  function allocationMensuelle(q, net, eligible) {
    var part = q < D.deg2.length ? D.deg2[q] : 0;
    var deg = part * Math.max(0, Math.min(net, D.plafondNetDeg2) - D.socle);
    var plancher = eligible * Math.max(0, D.plancher - D.socle - deg);
    return { deg2: deg, plancher: plancher, total: deg + plancher };
  }

  /** Absorption et séparations année par année. */
  function flux(postes, poids, m) {
    var base = D.baseMetier, res = [];
    var abs = val(P.efficaciteAbsorption, m) * (D.tauxRetraite + val(P.mobiliteVolontaire, m));
    var total = postes.externe + postes.interne;
    for (var t = 0; t < poids.length; t++) {
      var S = total * poids[t];
      var capacite = abs * base;
      var A = Math.min(S, capacite), R = S - A;
      var partExt = total > 0 ? postes.externe / total : 0;
      var sep = R * (partExt * val(P.separationExterne, m) + (1 - partExt) * val(P.separationInterne, m));
      res.push({ supprimes: S, absorbes: A, redeployes: R - sep, separations: sep });
      base -= S;
    }
    return res;
  }

  /**
   * Simulation complète pour une taille (T6), un marché, un calendrier et une politique.
   * Retourne des séries annuelles (personnes en moyenne annuelle, Md€).
   */
  function simuler(opts) {
    var taille = opts.taille || 'central', m = opts.marche || 'central';
    var pol = POLITIQUES[opts.politique || 'aucune'] || opts.politique || {};
    var postes = opts.postes || postesT6(opts.T6, taille);
    var poids = calendrier(opts.calendrier || 'rapide', NB_ANS);
    var F = flux(postes, poids, m);
    var nbQ = NB_ANS * 4;
    var tau = D.tauxPlat, net = opts.netMensuel || D.netMensuel, cout = net * D.ratioCoutNet * 12;
    var va = D.vaParEmploi, elig = val(P.eligiblesPlancher, m), rho = val(P.recuperation, m);
    var L0 = val(P.L0, m), Linf = val(P.Linf, m), fs = val(P.facteurSenior, m), hL = val(P.hL, m);
    var piA = val(P.pi, m), r12 = val(P.r12, m);
    var gainT6 = D.gainT6[taille];

    // séries trimestrielles
    var Z = function () { var a = []; for (var i = 0; i < nbQ; i++) a.push(0); return a; };
    var nonEmp = Z(), retour = Z(), perteEq = Z(), alloc = Z(), allocPlancher = Z(), perteNette = Z();
    var formation = Z(), mobiliteC = Z(), retraites = Z();
    // retours par âge et horizon (pour « combien se retournent »)
    var horizons = [4, 8, 20], parAge = piA.map(function () { return { d: 0, r: [0, 0, 0], ret: 0 }; });

    for (var t = 0; t < NB_ANS; t++) {
      var sepAn = F[t].separations;
      if (sepAn <= 0) continue;
      for (var qa = 0; qa < 4; qa++) {           // séparations réparties sur les 4 trimestres
        var q0 = t * 4 + qa, cohorte = sepAn / 4;
        for (var k = 0; k < D.classesAge.length; k++) {
          var a0 = D.classesAge[k][0], a1 = D.classesAge[k][1], nAges = a1 - a0 + 1;
          var senior = a0 >= 50;
          var partF = senior && pol.partFormeeSenior !== undefined ? pol.partFormeeSenior : val(P.partFormee, m);
          var effF = senior && pol.effetFormationSenior !== undefined ? pol.effetFormationSenior : val(P.effetFormation, m);
          var coutF = senior && pol.coutFormationSenior !== undefined ? pol.coutFormationSenior : val(P.coutFormation, m);
          var effM = pol.effetMobilite || 0, partM = pol.partMobilite || 0;
          var hBase = trimestriel(r12[k]);
          for (var age = a0; age <= a1; age++) {
            var n = cohorte * D.partsAge[k] / nAges;
            if (n <= 0) continue;
            var qRetraite = Math.max(0, Math.round((D.ageRetraite - age - 0.5) * 4));
            formation[q0] += n * partF * coutF;
            mobiliteC[q0] += n * partM * (pol.coutMobilite || 0);
            parAge[k].d += n;
            // deux sous-groupes : formés / non formés ; chacun mélange mobile / éloigné
            var groupes = [{ part: partF, forme: true }, { part: 1 - partF, forme: false }];
            for (var g = 0; g < groupes.length; g++) {
              var ng = n * groupes[g].part; if (ng <= 0) continue;
              var sMob = 1, sLoin = 1;           // survie de chaque type
              for (var q = 0; q < nbQ - q0; q++) {
                var Q = q0 + q;
                if (q >= qRetraite) { // retraite : le reste des non-employés sort, plus aucun coût imputé
                  if (q === qRetraite) { retraites[Q] += ng * (piA[k] * sLoin + (1 - piA[k]) * sMob); parAge[k].ret += ng * (piA[k] * sLoin + (1 - piA[k]) * sMob); }
                  break;
                }
                var s = piA[k] * sLoin + (1 - piA[k]) * sMob;
                var ne = ng * s, re = ng * (1 - s);
                nonEmp[Q] += ne; retour[Q] += re;
                var L = perteSalaire(q / 4, L0, Linf, P.kappa) * (senior ? fs : 1);
                perteEq[Q] += re * L;
                var al = allocationMensuelle(q, net, elig);
                alloc[Q] += ne * al.total * 3; allocPlancher[Q] += ne * al.plancher * 3;
                perteNette[Q] += ne * (net - al.total) * 3 + re * net * L * 3;
                // taux de retour du trimestre
                var hm = hMob(q);
                sMob *= (1 - hm);
                // la formation agit aussi sur le type « éloigné » (PIC : +16 points pour les seniors à deux ans, H11)
                var hl = hL * (1 + effM * partM) * (groupes[g].forme ? (q < P.enfermement ? P.facteurEnfermement : 1 + effF) : 1);
                sLoin *= (1 - Math.min(hl, 0.95));
                for (var hz = 0; hz < horizons.length; hz++) if (q + 1 === horizons[hz]) parAge[k].r[hz] += ng * (1 - (piA[k] * sLoin + (1 - piA[k]) * sMob));
              }
              function hMob(qq) {
                var h = hBase;
                if (groupes[g].forme) h *= qq < P.enfermement ? P.facteurEnfermement : (1 + effF);
                h *= (1 + effM * partM);
                return Math.min(h, 0.95);
              }
            }
          }
        }
      }
    }

    // agrégation annuelle
    var ans = [];
    var cumP = 0, cumAbs = 0, cumRed = 0, cumSep = 0;
    for (var y = 0; y < NB_ANS; y++) {
      var o = { annee: AN0 + y, supprimes: F[y].supprimes, absorbes: F[y].absorbes, redeployes: F[y].redeployes, separations: F[y].separations };
      cumP += F[y].supprimes; cumSep += F[y].separations;
      var s4 = function (arr) { var x = 0; for (var i = 0; i < 4; i++) x += arr[y * 4 + i]; return x; };
      o.nonEmploi = s4(nonEmp) / 4; o.retourEmploi = s4(retour) / 4; o.perteSalaireEq = s4(perteEq) / 4;
      o.retraites = s4(retraites);
      o.postesCumules = cumP; o.separationsCumulees = cumSep;
      // (a) production manquante par rapport à une réallocation complète (Md€)
      o.productionManquante = va * (o.nonEmploi + o.perteSalaireEq) / 1e9;
      // (b) budget (Md€ ; positif = coût)
      o.impotPerduBrut = tau * cout * (o.nonEmploi + o.perteSalaireEq) / 1e9;
      o.impotPerduNet = o.impotPerduBrut * (1 - rho);
      o.allocations = s4(alloc) / 1e9; o.dontPlancher = s4(allocPlancher) / 1e9;
      o.formation = s4(formation) / 1e9; o.mobilite = s4(mobiliteC) / 1e9;
      o.coutBudgetaireBrut = o.impotPerduBrut + o.allocations + o.formation + o.mobilite;
      o.coutBudgetaireNet = o.impotPerduNet + o.allocations + o.formation + o.mobilite;
      // perte des personnes (revenu net perdu moins transferts, Md€)
      o.pertePersonnes = s4(perteNette) / 1e9;
      // (c) gain pour la société, convention T6 v1 : le travail de pure complexité ne vaut rien,
      // le travail réalloué vaut la VA moyenne (Md€)
      var montee = Math.min(1, cumP / (postes.externe + postes.interne));
      o.gainBrutConformite = (va * cumP / 1e9) - gainT6.coutSysteme * montee;
      o.gainNet = va * (cumP - o.nonEmploi - o.perteSalaireEq) / 1e9 - gainT6.coutSysteme * montee - o.formation - o.mobilite;
      // conventions de valorisation (H17) : [productivité du travail réalloué, valeur sociale du travail de complexité]
      CONVENTIONS.forEach(function (c) {
        o['gainNet_' + c.id] = va * (c.ailleurs * (cumP - o.nonEmploi - o.perteSalaireEq) - c.ici * cumP) / 1e9 - gainT6.coutSysteme * montee - o.formation - o.mobilite;
      });
      o.gainNetV2 = o.gainNet_v2;
      ans.push(o);
    }

    // synthèses
    function somme(champ, a0, a1) { var x = 0; ans.forEach(function (o) { if (o.annee >= a0 && o.annee <= a1) x += o[champ]; }); return x; }
    function actualise(champ) { var x = 0; ans.forEach(function (o, i) { x += o[champ] / Math.pow(1 + P.actualisation, i); }); return x; }
    function premiereAnnee(test) { for (var i = 0; i < ans.length; i++) if (test(ans[i], i)) return ans[i].annee; return null; }
    var cumG = 0, cumGv2 = 0, anneeCumPos = null, anneeCumPosV2 = null;
    ans.forEach(function (o) { cumG += o.gainNet; cumGv2 += o.gainNetV2; if (anneeCumPos === null && cumG > 0) anneeCumPos = o.annee; if (anneeCumPosV2 === null && cumGv2 > 0) anneeCumPosV2 = o.annee; });
    var dep = parAge.reduce(function (s, x) { return s + x.d; }, 0);
    var tauxRetour = horizons.map(function (h, i) { return dep > 0 ? parAge.reduce(function (s, x) { return s + x.r[i]; }, 0) / dep : 0; });
    var retourParAge = parAge.map(function (x, k) { return { classe: D.classesAge[k].join('-'), deplaces: x.d, r1: x.d ? x.r[0] / x.d : 0, r2: x.d ? x.r[1] / x.d : 0, r5: x.d ? x.r[2] / x.d : 0, retraiteSansRetour: x.d ? x.ret / x.d : 0 }; });
    var picBudget = ans.reduce(function (b, o) { return o.coutBudgetaireNet > b.v ? { v: o.coutBudgetaireNet, a: o.annee } : b; }, { v: 0, a: null });
    return {
      opts: { taille: taille, marche: m, calendrier: opts.calendrier || 'rapide', politique: opts.politique || 'aucune' },
      postes: postes, annees: ans,
      synthese: {
        postesSupprimes: postes.externe + postes.interne,
        absorbes: somme('absorbes', 0, 9999), redeployes: somme('redeployes', 0, 9999), deplaces: somme('separations', 0, 9999),
        tauxRetour1an: tauxRetour[0], tauxRetour2ans: tauxRetour[1], tauxRetour5ans: tauxRetour[2],
        retourParAge: retourParAge,
        retraiteSansRetour: parAge.reduce(function (s, x) { return s + x.ret; }, 0),
        picNonEmploi: ans.reduce(function (b, o) { return Math.max(b, o.nonEmploi); }, 0),
        productionManquanteCumulee: somme('productionManquante', 0, 9999),
        productionManquanteActualisee: actualise('productionManquante'),
        coutBudgetaireNetCumule: somme('coutBudgetaireNet', 0, 9999),
        coutBudgetaireBrutCumule: somme('coutBudgetaireBrut', 0, 9999),
        coutBudgetaireNetMoyen2029_2035: somme('coutBudgetaireNet', 2029, 2035) / 7,
        coutBudgetaireBrutMoyen2029_2035: somme('coutBudgetaireBrut', 2029, 2035) / 7,
        coutBudgetaireNet2040: ans[2040 - AN0].coutBudgetaireNet,
        picBudgetNet: picBudget.v, anneePicBudget: picBudget.a,
        allocationsCumulees: somme('allocations', 0, 9999), dontPlancherCumule: somme('dontPlancher', 0, 9999),
        formationCumulee: somme('formation', 0, 9999),
        pertePersonnesCumulee: somme('pertePersonnes', 0, 9999),
        pertePersonnesAnneesDeSalaire: dep > 0 ? somme('pertePersonnes', 0, 9999) * 1e9 / dep / (net * 12) : 0,
        gainNetCumule2040: somme('gainNet', 2029, 2040), gainNetV2Cumule2040: somme('gainNetV2', 2029, 2040),
        gainNetCroisiere: ans[2045 - AN0].gainNet, gainNetV2Croisiere: ans[2045 - AN0].gainNetV2,
        anneeGainNetPositif: premiereAnnee(function (o) { return o.gainNet > 0; }),
        anneeGainNetV2Positif: premiereAnnee(function (o) { return o.gainNetV2 > 0; }),
        anneeCumulPositif: anneeCumPos, anneeCumulV2Positif: anneeCumPosV2,
        conventions: CONVENTIONS.map(function (c) {
          var champ = 'gainNet_' + c.id, cum = 0, aCum = null;
          ans.forEach(function (o) { cum += o[champ]; if (aCum === null && cum > 0) aCum = o.annee; });
          return { id: c.id, premiereAnneePositive: premiereAnnee(function (o) { return o[champ] > 0; }), anneeCumulPositif: aCum,
            cumule2040: somme(champ, 2029, 2040), croisiere: ans[2045 - AN0][champ], an2029: ans[0][champ] };
        }),
        gainT6: gainT6
      }
    };
  }

  /** Contrôle de calibrage : perte de revenu d'un déplacé de 30-49 ans, 1 et 5 ans après (Bertheau et al. : −20 % et −12 % en France). */
  function perteRevenuCohorte(m, classe) {
    var k = classe === undefined ? 2 : classe;
    var piA = val(P.pi, m)[k], h = trimestriel(val(P.r12, m)[k]), hL = val(P.hL, m);
    var L0 = val(P.L0, m), Linf = val(P.Linf, m);
    function annee(y) {
      var x = 0;
      for (var q = y * 4; q < y * 4 + 4; q++) {
        var s = survie(q, piA, h, hL);
        x += s + (1 - s) * perteSalaire(q / 4, L0, Linf, P.kappa);
      }
      return x / 4;
    }
    // valeur actuelle à 5 % sur 20 ans de la perte, en années de revenu antérieur (mesure de Davis et von Wachter 2011)
    var va20 = 0; for (var y = 0; y < 20; y++) va20 += annee(y) / Math.pow(1.05, y);
    return { an1: annee(0), an2: annee(1), an5: annee(4), an10: annee(9), nonEmploi5ans: survie(20, piA, h, hL), va20: va20 };
  }

  /** Le non-remplacement public (sources/economies-effectifs-publics-ia.md) : aucun déplacé par construction. */
  function publicNonRemplacement(postes, departsParAn, ans) {
    var cap = departsParAn * ans;
    return { postes: postes, departsDisponibles: cap, deplaces: Math.max(0, postes - cap), partDesDeparts: postes / cap };
  }

  var api = {
    MARCHES: MARCHES, CONVENTIONS: CONVENTIONS, TAILLES: TAILLES, AN0: AN0, NB_ANS: NB_ANS, D: D, P: P, POLITIQUES: POLITIQUES,
    val: val, postesT6: postesT6, calendrier: calendrier, trimestriel: trimestriel, survie: survie,
    perteSalaire: perteSalaire, allocationMensuelle: allocationMensuelle, flux: flux, simuler: simuler,
    perteRevenuCohorte: perteRevenuCohorte, publicNonRemplacement: publicNonRemplacement
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Reconversion = api;
})(this);
