/*
 * modeles/bascule-existant/modele.js
 * Basculer l'existant : que deviennent les stocks constitués sous l'ancien système (réserves des
 * sociétés, plus-values latentes, assurance-vie, PEA, démembrements, réductions d'impôt en cours,
 * transmissions anticipées) quand on passe au prélèvement unique « 50 % de tout ce qui sort » ?
 * Fonctions pures, sans dépendance. Compatible navigateur, Node et JavaScriptCore (jsc).
 *
 * Principe (voir methode.md) : chaque stock « pré-réforme » se réalise peu à peu (vente,
 * distribution, rachat, transmission), à un rythme annuel rho. À chaque réalisation, la règle de
 * transition choisie fixe le taux :
 *   - « ancien » : le régime actuel (taux effectif moyen, abattements compris) ;
 *   - « nouveau » : 50 % (principe de l'auteur : la date de l'événement fixe le régime) ;
 *   - « historique » : l'ancien taux pour les gains acquis avant la réforme dans un régime
 *     conditionné à une durée de détention (Conseil constitutionnel 2013-682 DC) ;
 *   - « crédit d'IS » : 50 % du bénéfice avant IS, moins l'IS déjà payé, soit (0,5 − 0,25)/(1 − 0,25)
 *     = 1/3 de la somme distribuée.
 * Option de purge : une part u des plus-values latentes destinées à être vendues paie tout de suite
 * un taux réduit (à l'américaine : 15,5 % liquide, 8 % illiquide) et n'est plus imposée ensuite à la
 * vente (la transmission reste imposée).
 * Valeurs actualisées sur 30 ans (taux 3 %). Ordres de grandeur, jamais des prédictions.
 * Les montants ne s'ajoutent PAS au bilan du simulateur, qui suppose déjà la règle « nouveau »
 * pour tous les flux (voir methode.md, § 3).
 */
(function (root) {
  'use strict';

  // ---------- Données et hypothèses (donnees/*.csv ; H1-H20 de methode.md ; ⚠️ = non confirmé) ----------
  var DONNEES = {
    tauxNouveau: 0.50,        // H1 : prélèvement unique (plan.md, ch. 9)
    tauxIS: 0.25,             // H1 : IS de droit commun déjà payé sur les réserves
    actualisation: 0.03,      // H17 : hypothèse de Claude (cf. V421, 3,3 % dans T12)
    horizonAns: 30,           // H17
    // Stocks pré-réforme. valeur, partGain et realisation : [bas, central, haut] (« enjeux » croissants).
    // partTransmission : part des réalisations qui passent par une transmission (le reste : vente,
    // distribution, rachat). ancien : taux effectifs du régime actuel (vente : sur la plus-value ;
    // transmission : sur la valeur entière). regleRecommandee : règle de vente proposée par Claude.
    stocks: {
      titres_non_cotes: {
        libelle: 'Titres non cotés et holdings (réserves non distribuées)',
        valeur: [1507.4, 1507.4, 1507.4],        // BdF, fin 2025
        partGain: [0.35, 0.50, 0.65],            // H2 ⚠️
        realisation: [0.03, 0.04, 0.06],         // H3 ⚠️
        partTransmission: 0.4,                   // H4 ⚠️
        ancien: { vente: 0.30, transmission: 0.07 }, // H6, H7
        regleRecommandee: 'credit_is',
        tauxPurge: 0.08, purgeable: true          // illiquide (§ 965 : 8 %)
      },
      titres_cotes_opc: {
        libelle: 'Actions cotées et OPC détenus en direct',
        valeur: [621.6, 621.6, 621.6],           // BdF : 263,3 + 358,3
        partGain: [0.20, 0.30, 0.40],
        realisation: [0.06, 0.08, 0.10],
        partTransmission: 0.3,
        ancien: { vente: 0.30, transmission: 0.07 },
        regleRecommandee: 'nouveau',             // pas de régime à durée depuis 2018 (PFU)
        tauxPurge: 0.155, purgeable: true
      },
      immobilier_hors_rp: {
        libelle: 'Immobilier hors résidence principale',
        valeur: [2655, 3098, 3540],              // 8 850 Md€ (Insee) × 30 / 35 / 40 % (H5 ⚠️)
        partGain: [0.30, 0.40, 0.50],
        realisation: [0.03, 0.035, 0.045],
        partTransmission: 0.5,
        ancien: { vente: 0.15, transmission: 0.07 }, // abattements pour durée (H6 ⚠️)
        regleRecommandee: 'historique',
        tauxPurge: 0.08, purgeable: true
      },
      assurance_vie: {
        libelle: 'Assurance-vie et épargne retraite',
        valeur: [2177.3, 2177.3, 2177.3],        // BdF, fin 2025 (euros + UC)
        partGain: [0.15, 0.25, 0.35],
        realisation: [0.05, 0.07, 0.09],
        partTransmission: 0.35,
        ancien: { vente: 0.20, transmission: 0.02 }, // art. 990 I : ≈ 1-2 % des capitaux décès (H7)
        regleRecommandee: 'historique',
        tauxPurge: 0.155, purgeable: true
      },
      pea: {
        libelle: 'PEA et PEA-PME',
        valeur: [145.1, 145.1, 145.1],           // BdF, fin 2025
        partGain: [0.20, 0.30, 0.40],
        realisation: [0.06, 0.08, 0.10],
        partTransmission: 0.2,
        ancien: { vente: 0.186, transmission: 0.07 }, // prélèvements sociaux 2026 (⚠️ V514)
        regleRecommandee: 'historique',
        tauxPurge: 0.155, purgeable: true
      }
    },
    // Démembrements existants (donations avec réserve d'usufruit) : H10-H11.
    demembrements: {
      fluxDonations: 150,                        // ≈ moitié des 300 Md€ (CAE)
      partReserveUsufruit: [0.15, 0.30, 0.45],   // ⚠️ hypothèse de Claude
      partUsufruit: 0.40,                        // barème art. 669 CGI, donateur de 61-70 ans (relu, V2529)
      dureeRestante: [10, 15, 20],               // années de donations encore démembrées = vie restante moyenne
      tauxAncien: 0                              // art. 1133 CGI : extinction de l'usufruit non taxée
    },
    // Réductions d'impôt en cours (Pinel et autres) : H9.
    credits: {
      pinelRestant: [4.0, 5.1, 6.5],             // Md€ restant dus après 2028 (calcul de Claude, V506)
      multiplicateurAutres: [1.2, 1.5, 2.0],     // Girardin, Malraux, Denormandie, FIP/FCPI… ⚠️
      dureeAns: 9
    },
    // Transmissions anticipées entre l'annonce et l'entrée en vigueur : H12-H14.
    anticipation: {
      fluxAnticipable: 75,                       // ≈ 25 % des 300 Md€ : grands patrimoines ⚠️
      anneesAnticipees: [1, 2, 4],               // années de flux avancées
      tauxAncien: 0.10,                          // taux effectif des grandes transmissions (T5 : 5-10 %)
      fuiteAvecAntiAbus: 0.2                     // part qui échappe malgré la règle datée de l'annonce
    },
    purge: {
      adhesion: [0.10, 0.25, 0.40],              // H15 ⚠️
      echeancier: [1 / 3, 1 / 3, 1 / 3],         // H16 : 3 annuités (Italie) ; § 965 : 8 ans
      selection: 2                               // les adhérents réalisent deux fois plus vite (H15)
    },
    // Risque contentieux (H18-H19, hypothèse de Claude ; ce n'est pas un avis juridique).
    probaNiveau: { tres_faible: 0.01, faible: 0.05, moyen: 0.25, eleve: 0.6 }
  };

  // Règles par politique de transition.
  var POLITIQUES = {
    strict: {
      libelle: 'Principe strict de l\'auteur : tout au nouveau régime à la date de l\'événement',
      vente: 'nouveau', transmission: 'nouveau', purge: false, credits: 'supprimes',
      demembrements: 'taxes', antiAbus: true
    },
    recommandee: {
      libelle: 'Principe de l\'événement + protections exigées par la jurisprudence + option de purge',
      vente: 'recommandee', transmission: 'nouveau', purge: true, credits: 'honores',
      demembrements: 'grand_pere', antiAbus: true
    },
    recommandee_sans_purge: {
      libelle: 'Idem, sans option de purge',
      vente: 'recommandee', transmission: 'nouveau', purge: false, credits: 'honores',
      demembrements: 'grand_pere', antiAbus: true
    },
    grand_pere: {
      libelle: 'Grand-père large : l\'existant garde l\'ancien régime jusqu\'à son terme',
      vente: 'ancien', transmission: 'ancien', purge: false, credits: 'honores',
      demembrements: 'grand_pere', antiAbus: false
    }
  };

  // Mesures exposées au contentieux : niveau sous la Constitution actuelle / sous une nouvelle
  // Constitution (la CEDH et le droit de l'UE continuent de s'appliquer). Voir methode.md § 6.
  var MESURES = {
    gains_duree: { libelle: 'Taxer à 50 % les gains acquis sous un régime à durée (AV, PEA, abattements immobiliers)', actuel: 'eleve', nouvelle: 'moyen', fondement: '2013-682 DC cons. 14-19 ; CEDH P1-1 (attentes légitimes)' },
    reserves_sans_credit: { libelle: 'Taxer à 50 % les réserves anciennes sans crédit d\'IS', actuel: 'faible', nouvelle: 'faible', fondement: 'fait générateur futur ; charge cumulée 62,5 % (2012-662 DC, R.Sz.)' },
    av_deces: { libelle: 'Capitaux décès d\'assurance-vie au nouveau régime (pas de grand-père 990 I)', actuel: 'faible', nouvelle: 'faible', fondement: 'fait générateur = décès ; pas de condition de durée' },
    credits_supprimes: { libelle: 'Supprimer les réductions Pinel et autres restant dues', actuel: 'eleve', nouvelle: 'moyen', fondement: 'avantage lié à un engagement de durée (2013-682 DC) ; P1-1' },
    demembrements_taxes: { libelle: 'Taxer l\'extinction de l\'usufruit des démembrements existants', actuel: 'moyen', nouvelle: 'moyen', fondement: 'donation soldée (2014-435 QPC) vs nouveau fait générateur' },
    anti_abus_annonce: { libelle: 'Appliquer le nouveau régime aux transmissions et départs postérieurs à l\'annonce', actuel: 'moyen', nouvelle: 'faible', fondement: '2013-682 DC cons. 15 ; National & Provincial ; Huitson ; Plaisier' }
  };

  // ---------- Outils ----------
  function choisir(v, n) { return (v instanceof Array) ? v[n] : v; }
  function fusion(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; if (b) for (k in b) o[k] = b[k]; return o; }

  // Part du stock réalisée l'année y (1..H) : rho (1 − rho)^(y−1).
  function profil(rho, H) { var p = [], y; for (y = 1; y <= H; y++) p.push(rho * Math.pow(1 - rho, y - 1)); return p; }
  // Facteur actualisé : Σ rho (1 − rho)^(y−1) / (1 + r)^y.
  function facteurActualise(rho, r, H) {
    var s = 0, y; for (y = 1; y <= H; y++) s += rho * Math.pow(1 - rho, y - 1) / Math.pow(1 + r, y); return s;
  }
  // Années pour que 90 % du stock pré-réforme soit réalisé.
  function duree90(rho) { return Math.log(0.1) / Math.log(1 - rho); }
  // Seuil de la purge : au-delà de n années de détention, payer tPurge maintenant coûte moins que tPlein plus tard.
  function seuilPurgeAns(tPurge, tPlein, r) { return Math.log(tPlein / tPurge) / Math.log(1 + r); }

  function tauxVente(stock, regle, D) {
    if (regle === 'ancien') return stock.ancien.vente;
    if (regle === 'nouveau') return D.tauxNouveau;
    if (regle === 'recommandee') {
      if (stock.regleRecommandee === 'historique') return stock.ancien.vente;
      if (stock.regleRecommandee === 'credit_is') return (D.tauxNouveau - D.tauxIS) / (1 - D.tauxIS);
      return D.tauxNouveau;
    }
    throw new Error('règle de vente inconnue : ' + regle);
  }
  function tauxTransmission(stock, regle, D) {
    return regle === 'ancien' ? stock.ancien.transmission : D.tauxNouveau;
  }

  // ---------- Un stock sous une politique ----------
  function evaluerStock(cle, politique, n, D) {
    D = D || DONNEES;
    var s = D.stocks[cle], P = POLITIQUES[politique];
    if (!s) throw new Error('stock inconnu : ' + cle);
    if (!P) throw new Error('politique inconnue : ' + politique);
    var r = D.actualisation, H = D.horizonAns;
    var V = choisir(s.valeur, n), g = choisir(s.partGain, n), rho = choisir(s.realisation, n), sig = s.partTransmission;
    var G = g * V;                                   // plus-value latente pré-réforme
    var tv = tauxVente(s, P.vente, D), tt = tauxTransmission(s, P.transmission, D);
    var u = (P.purge && s.purgeable) ? choisir(D.purge.adhesion, n) : 0;
    var rhoSel = Math.min(1, rho * D.purge.selection);
    var F = facteurActualise(rho, r, H), Fsel = facteurActualise(rhoSel, r, H);
    // Valeurs actualisées (Md€)
    var venteNonAdh = (1 - u) * (1 - sig) * G * tv * F;
    var transmission = sig * V * tt * F;            // les adhérents à la purge restent imposés à la transmission
    // La purge porte sur la part u de la plus-value du canal « vente » (la transmission reste imposée).
    var basePurge = u * (1 - sig) * G;
    var ech = D.purge.echeancier, pvPurge = 0, y;
    for (y = 0; y < ech.length; y++) pvPurge += basePurge * s.tauxPurge * ech[y] / Math.pow(1 + r, y + 1);
    var manqueAGagnerPurge = basePurge * tv * F;          // ce que ces adhérents auraient payé plus tard
    var manqueSiSelection = basePurge * tv * Fsel;        // idem si les adhérents sont ceux qui allaient vendre vite (H15)
    var pv = venteNonAdh + transmission + pvPurge;
    var pvAncienVente = (1 - sig) * G * s.ancien.vente * F, pvAncienTransmission = sig * V * s.ancien.transmission * F;
    var pvAncien = pvAncienVente + pvAncienTransmission;
    var pvStrict = (1 - sig) * G * D.tauxNouveau * F + sig * V * D.tauxNouveau * F;
    // Profil annuel nominal (Md€/an)
    var pr = profil(rho, H), prS = profil(rhoSel, H), annuel = [];
    for (y = 0; y < H; y++) {
      var a = (1 - u) * (1 - sig) * G * tv * pr[y] + sig * V * tt * pr[y];
      if (y < ech.length) a += basePurge * s.tauxPurge * ech[y];
      annuel.push(a);
    }
    var annuelAncien = pr.map(function (p) { return ((1 - sig) * G * s.ancien.vente + sig * V * s.ancien.transmission) * p; });
    return {
      cle: cle, libelle: s.libelle, valeurMdE: V, plusValueLatenteMdE: G, tauxVente: tv, tauxTransmission: tt,
      adhesionPurge: u, pvMdE: pv, pvAncienMdE: pvAncien, pvStrictMdE: pvStrict,
      pvVenteMdE: venteNonAdh, pvTransmissionMdE: transmission, pvAncienVenteMdE: pvAncienVente, pvAncienTransmissionMdE: pvAncienTransmission, pvPurgeMdE: pvPurge, manqueAGagnerPurgeMdE: manqueAGagnerPurge,
      bilanPurgeMdE: pvPurge - manqueAGagnerPurge, manqueSiSelectionMdE: manqueSiSelection,
      seuilPurgeAns: seuilPurgeAns(s.tauxPurge, tauxVente(s, 'recommandee', D), r),
      duree90Ans: duree90(rho), annuel: annuel, annuelAncien: annuelAncien
    };
  }

  // ---------- Postes hors stocks ----------
  function demembrements(politique, n, D) {
    D = D || DONNEES; var d = D.demembrements, P = POLITIQUES[politique];
    var duree = choisir(d.dureeRestante, n), rho = 1 / duree;
    var U = d.fluxDonations * choisir(d.partReserveUsufruit, n) * d.partUsufruit * duree; // valeur d'usufruit en cours
    var F = facteurActualise(rho, D.actualisation, D.horizonAns);
    var t = P.demembrements === 'taxes' ? D.tauxNouveau : d.tauxAncien;
    return { usufruitEnCoursMdE: U, pvMdE: U * t * F, pvStrictMdE: U * D.tauxNouveau * F, pvAncienMdE: U * d.tauxAncien * F,
      annuel: profil(rho, D.horizonAns).map(function (p) { return U * t * p; }) };
  }
  function credits(politique, n, D) {
    D = D || DONNEES; var c = D.credits, P = POLITIQUES[politique];
    var total = choisir(c.pinelRestant, n) * choisir(c.multiplicateurAutres, n), pv = 0, y, annuel = [];
    for (y = 1; y <= D.horizonAns; y++) {
      var a = (y <= c.dureeAns && P.credits === 'honores') ? -total / c.dureeAns : 0;
      annuel.push(a); pv += a / Math.pow(1 + D.actualisation, y);
    }
    var pvHonores = 0; for (y = 1; y <= c.dureeAns; y++) pvHonores -= total / c.dureeAns / Math.pow(1 + D.actualisation, y);
    return { restantMdE: total, pvMdE: pv, pvStrictMdE: 0, pvAncienMdE: pvHonores, annuel: annuel };
  }
  // Perte (négative) due aux transmissions avancées sous l'ancien régime, par rapport au nouveau régime.
  function anticipation(politique, n, D) {
    D = D || DONNEES; var a = D.anticipation, P = POLITIQUES[politique];
    var vol = a.fluxAnticipable * choisir(a.anneesAnticipees, n);
    var ecart = vol * (D.tauxNouveau - a.tauxAncien);
    if (P.transmission === 'ancien') return { volumeMdE: vol, perteMdE: 0, perteSansAntiAbusMdE: ecart, evitableMdE: 0 };
    var perte = P.antiAbus ? ecart * a.fuiteAvecAntiAbus : ecart;
    return { volumeMdE: vol, perteMdE: -perte, perteSansAntiAbusMdE: ecart, evitableMdE: ecart - perte };
  }

  // ---------- Risque contentieux ----------
  function risques(politique, n, D, parStock) {
    D = D || DONNEES; var P = POLITIQUES[politique], p = D.probaNiveau, out = [], k;
    function stockDiff(cles, champ) {
      var s = 0; cles.forEach(function (c) { var x = parStock[c]; s += champ(x, D.stocks[c]); }); return s;
    }
    var F = function (c) { var s = D.stocks[c]; return facteurActualise(choisir(s.realisation, n), D.actualisation, D.horizonAns); };
    var expose = {};
    if (P.vente === 'nouveau') {
      expose.gains_duree = ['immobilier_hors_rp', 'assurance_vie', 'pea'].reduce(function (acc, c) {
        var s = D.stocks[c], G = choisir(s.partGain, n) * choisir(s.valeur, n);
        return acc + (1 - s.partTransmission) * G * (D.tauxNouveau - s.ancien.vente) * F(c);
      }, 0);
      var s1 = D.stocks.titres_non_cotes, G1 = choisir(s1.partGain, n) * choisir(s1.valeur, n);
      expose.reserves_sans_credit = (1 - s1.partTransmission) * G1 * (D.tauxNouveau - tauxVente(s1, 'recommandee', D)) * F('titres_non_cotes');
    }
    if (P.transmission === 'nouveau') {
      var av = D.stocks.assurance_vie;
      expose.av_deces = av.partTransmission * choisir(av.valeur, n) * (D.tauxNouveau - av.ancien.transmission) * F('assurance_vie');
    }
    if (P.credits === 'supprimes') expose.credits_supprimes = -credits('recommandee', n, D).pvMdE;
    if (P.demembrements === 'taxes') { var dm = demembrements(politique, n, D); expose.demembrements_taxes = dm.pvMdE - dm.pvAncienMdE; }
    if (P.antiAbus && P.transmission === 'nouveau') expose.anti_abus_annonce = anticipation(politique, n, D).evitableMdE;
    var totA = 0, totN = 0;
    for (k in expose) {
      var m = MESURES[k], eA = p[m.actuel] * expose[k], eN = p[m.nouvelle] * expose[k];
      totA += eA; totN += eN;
      out.push({ mesure: k, libelle: m.libelle, exposeMdE: expose[k], niveauActuel: m.actuel, niveauNouvelle: m.nouvelle,
        esperanceActuelleMdE: eA, esperanceNouvelleMdE: eN, fondement: m.fondement });
    }
    return { detail: out, esperanceActuelleMdE: totA, esperanceNouvelleMdE: totN };
  }

  // ---------- Politique complète ----------
  function simuler(options) {
    options = options || {};
    var politique = options.politique || 'recommandee';
    var n = options.scenario === undefined ? 1 : options.scenario;
    var D = options.donnees || DONNEES;
    if (options.surcharges) D = fusion(D, options.surcharges);
    var H = D.horizonAns, parStock = {}, tot = { pv: 0, pvAncien: 0, pvStrict: 0, pvPurge: 0, manquePurge: 0, manqueSel: 0 }, annuel = [], annuelAncien = [], y, k;
    for (y = 0; y < H; y++) { annuel.push(0); annuelAncien.push(0); }
    for (k in D.stocks) {
      var e = evaluerStock(k, politique, n, D); parStock[k] = e;
      tot.pv += e.pvMdE; tot.pvAncien += e.pvAncienMdE; tot.pvStrict += e.pvStrictMdE; tot.pvPurge += e.pvPurgeMdE; tot.manquePurge += e.manqueAGagnerPurgeMdE; tot.manqueSel += e.manqueSiSelectionMdE;
      for (y = 0; y < H; y++) { annuel[y] += e.annuel[y]; annuelAncien[y] += e.annuelAncien[y]; }
    }
    var dm = demembrements(politique, n, D), cr = credits(politique, n, D), an = anticipation(politique, n, D);
    var dmA = demembrements('grand_pere', n, D);
    for (y = 0; y < H; y++) { annuel[y] += dm.annuel[y] + cr.annuel[y]; annuelAncien[y] += dmA.annuel[y] + credits('grand_pere', n, D).annuel[y]; }
    annuel[0] += an.perteMdE; // perte d'anticipation imputée à la première année
    var pv = tot.pv + dm.pvMdE + cr.pvMdE + an.perteMdE / (1 + D.actualisation);
    var pvAncien = tot.pvAncien + dm.pvAncienMdE + cr.pvAncienMdE;
    var anS = anticipation('strict', n, D);
    var pvStrict = tot.pvStrict + dm.pvStrictMdE + 0 + anS.perteMdE / (1 + D.actualisation);
    var cumul = function (arr, m) { var s = 0; for (var i = 0; i < m; i++) s += arr[i]; return s; };
    var rq = risques(politique, n, D, parStock);
    return {
      politique: politique, libelle: POLITIQUES[politique].libelle, scenario: n,
      parStock: parStock, demembrements: dm, credits: cr, anticipation: an, risques: rq,
      pvMdE: pv, pvAncienMdE: pvAncien, pvStrictMdE: pvStrict,
      gainSurAncienMdE: pv - pvAncien,          // recettes de transition en plus du régime actuel (valeur actualisée)
      coutSurStrictMdE: pvStrict - pv,          // ce que coûtent les protections par rapport au principe strict
      purge: { recetteMdE: tot.pvPurge, manqueAGagnerMdE: tot.manquePurge, manqueSiSelectionMdE: tot.manqueSel },
      annuel: annuel, annuelAncien: annuelAncien,
      gainCumule5ansMdE: cumul(annuel, 5) - cumul(annuelAncien, 5),
      gainCumule10ansMdE: cumul(annuel, 10) - cumul(annuelAncien, 10),
      pvNetteDuRisqueActuelleMdE: pv - rq.esperanceActuelleMdE,
      pvNetteDuRisqueNouvelleMdE: pv - rq.esperanceNouvelleMdE
    };
  }

  function grille(D) {
    var g = {}, p, n;
    for (p in POLITIQUES) { g[p] = []; for (n = 0; n < 3; n++) g[p].push(simuler({ politique: p, scenario: n, donnees: D })); }
    return g;
  }

  var api = {
    DONNEES: DONNEES, POLITIQUES: POLITIQUES, MESURES: MESURES,
    profil: profil, facteurActualise: facteurActualise, duree90: duree90, seuilPurgeAns: seuilPurgeAns,
    tauxVente: tauxVente, evaluerStock: evaluerStock, demembrements: demembrements, credits: credits,
    anticipation: anticipation, risques: risques, simuler: simuler, grille: grille
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BasculeExistant = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
