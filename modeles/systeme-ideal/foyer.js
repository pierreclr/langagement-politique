/*
 * modeles/systeme-ideal/foyer.js — T47, dimension « foyer » (couple, enfants) du palier 1 (02/11/2026). Fonctions pures au-dessus de modele.js
 * (palier1.js facultatif : sert aux tests et au prix du point de taux plat). Hypothèses H136 à H144 : methode.md § 16. ⚠️ = non confirmé.
 *
 * Le palier 1 de palier1.js est INDIVIDUEL pour le socle (500 € par adulte) et pour l'impôt à plat, mais `situation` (modele.js) calcule l'impôt continu
 * d'un couple sur le revenu moyen par adulte (conjugalisé, 2 parts) : le palier 1 « publié » est donc un régime mixte (socle individuel, impôt conjugalisé).
 * Ce module compare les régimes possibles, par adulte ou par foyer, sur des ménages types, et chiffre l'écart de solde public (ordre de grandeur).
 *
 * Régime = { socle: 'individuel' | 'familial', impot: 'individuel' | 'conjugal', enfants: 'supplement' | 'quotient' }
 *   socle  individuel : S par adulte ; familial : S × échelle (1,5 pour un couple : échelle de l'OCDE modifiée, H136) ; isolé : S dans les deux cas
 *   impot  individuel : chaque adulte paie t_plat × R + I_continu(R) ; conjugal : t_plat × R_foyer + parts × I_continu(R_foyer / parts), parts = adultes (2 pour un couple)
 *   enfants supplement : + 200 € par enfant et par mois, aucune part ; quotient : 0,5 part par enfant (rattachée au foyer, ou à l'adulte le mieux payé
 *           si l'impôt est individuel), aucun supplément ; plafonnement du quotient NON modélisé (⚠️ H139)
 * Revenus : R = coût employeur annuel (base de l'impôt continu, H2). Revenu disponible mensuel = socle + (R − impôt) / 12 (comme `situation`).
 * Des ordres de grandeur sous hypothèses, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var FA = root.FiscaliteActuelle || (typeof require !== 'undefined' ? require('./fiscalite_actuelle.js') : null);
  var D = M.DONNEES;

  var PAR = {
    socle: 500, enfant: 200, tPlat: 0.35, tMax: 0.30, R0: 24000,       // palier 1 (palier1.js : BASE et taux retenu 35 %)
    echelleCouple: 1.5,                                                 // H136 : unités de consommation de l'OCDE modifiée (couple = 1,5)
    partEnfant: 0.5,                                                    // H139 : demi-part par enfant (pas de part entière au 3e enfant dans cette première version)
    plancherParentIsole: 1300                                           // H109 de palier1.js, repris à l'identique
  };
  function par(o) { var r = {}, k; for (k in PAR) r[k] = PAR[k]; if (o) for (k in o) r[k] = o[k]; return r; }

  // ---------- Régimes
  var REGIMES = {
    individualise: { socle: 'individuel', impot: 'individuel', enfants: 'supplement' },   // tout par adulte, enfants en supplément de socle
    palier1: { socle: 'individuel', impot: 'conjugal', enfants: 'supplement' },           // le palier 1 tel que calculé par situation() : socle par adulte, impôt conjugalisé
    familial: { socle: 'familial', impot: 'conjugal', enfants: 'supplement' },            // tout par foyer
    familialIndiv: { socle: 'familial', impot: 'individuel', enfants: 'supplement' },     // socle du foyer, impôt par adulte
    quotient: { socle: 'individuel', impot: 'individuel', enfants: 'quotient' }           // enfants par parts (quotient) au lieu du supplément de socle
  };

  // ---------- Impôt du palier 1
  function plat(R, p) { return p.tPlat * R; }
  function continu(R, p) { return M.impotContinu(R, p.tMax, p.R0); }
  /** Impôt d'un adulte seul, sans enfant (à plat + continu). */
  function impotIndiv(R, p) { return plat(R, p) + continu(R, p); }

  /** Impôt annuel d'un foyer. f = { adultes (1 ou 2), R: [R1, R2] (€/an, coût employeur + capital), enfants }. */
  function impot(f, reg, p) {
    var R = f.R, n = f.enfants || 0, tot = R[0] + (f.adultes > 1 ? R[1] : 0), pe = reg.enfants === 'quotient' ? p.partEnfant * n : 0, tax;
    if (reg.impot === 'conjugal') {
      var parts = f.adultes + pe;
      return plat(tot, p) + parts * continu(tot / parts, p);
    }
    var hi = (f.adultes > 1 && R[1] > R[0]) ? 1 : 0;                     // les parts d'enfants vont à l'adulte le mieux payé
    tax = 0;
    for (var i = 0; i < f.adultes; i++) {
      var parts1 = 1 + (i === hi ? pe : 0);
      tax += plat(R[i], p) + parts1 * continu(R[i] / parts1, p);
    }
    return tax;
  }
  /** Socle mensuel du foyer (€). */
  function socle(f, reg, p) {
    var base = f.adultes > 1 ? (reg.socle === 'familial' ? p.socle * p.echelleCouple : 2 * p.socle) : p.socle;
    return base + (reg.enfants === 'supplement' ? p.enfant * (f.enfants || 0) : 0);
  }
  /** Revenu disponible mensuel (€) : socle + (R − impôt) / 12, avec le plancher des parents isolés (H109). */
  function net(f, reg, p) {
    var tot = f.R[0] + (f.adultes > 1 ? f.R[1] : 0), v = socle(f, reg, p) + (tot - impot(f, reg, p)) / 12;
    if (f.adultes === 1 && (f.enfants || 0) > 0 && p.plancherParentIsole) v = Math.max(v, p.plancherParentIsole);
    return v;
  }
  /**
   * Taux de participation du second apporteur : 1 − (revenu du foyer avec son emploi − sans) / son coût employeur. f.R[1] est son revenu s'il travaille.
   * C'est la quantité qui commande son entrée en emploi (extensive margin).
   */
  function tauxParticipation(f, reg, p) {
    var sans = { adultes: f.adultes, R: [f.R[0], 0], enfants: f.enfants };
    return 1 - (net(f, reg, p) - net(sans, reg, p)) * 12 / f.R[1];
  }

  // ---------- Loi actuelle : approximation déclarée (reprise de simulations/ma-situation.js ; ⚠️ pas OpenFisca, H137)
  // IR : fiscalite_actuelle.js (source unique avec le simulateur et le modèle, H105)
  var irActuel = FA.irAn;
  function primeActivite(netSalMois, ressourcesMois, adultes, enfants, nTravailleurs) {
    if (netSalMois <= 0) return 0;
    var forfait = 633.21 * (adultes > 1 ? 1.5 : 1) + 0.3 * 633.21 * enfants;
    var bonus = nTravailleurs * Math.max(0, Math.min(184, 184 * (netSalMois / nTravailleurs - 700) / 700));
    return Math.max(0, forfait + 0.61 * netSalMois + bonus - ressourcesMois);
  }
  function allocationsFamiliales(enfants) { return enfants < 2 ? 0 : 150 + (enfants >= 3 ? 189 : 0) + Math.max(enfants - 3, 0) * 190; }
  /** Revenu disponible mensuel (€) de la loi actuelle, estimation grossière : net des salaires, IR avec quotient plafonné, prime d'activité, allocations familiales, minima. */
  function actuel(m) {
    var netTot = 0, i;
    for (i = 0; i < m.emplois.length; i++) netTot += m.emplois[i].net;
    var base = 0; for (i = 0; i < m.emplois.length; i++) base += FA.baseImposableSalaire(m.emplois[i].net);
    var ir = irActuel(base, m.adultes, m.enfants) / 12;
    var pa = primeActivite(netTot, netTot, m.adultes, m.enfants, m.emplois.length);
    var total = netTot - ir + pa + allocationsFamiliales(m.enfants);
    return Math.max(total, D.rsa.niveau * (m.adultes > 1 ? 1.5 : 1));
  }

  // ---------- Ménages types (cout = coût employeur mensuel, net = net mensuel actuel ; sources des montants : modele.js, cas T14)
  var SMIC = { cout: D.coutSelonBrut[0][1], net: 1477.93 };         // 1 987,76 € ; net T14
  var MEDIAN = { cout: D.coutSelonBrut[2][1], net: 2115.89 };       // 3 676,54 € ; net T14 « médian »
  var CADRE8K = { cout: FA.coutEmployeurDepuisNet(8000), net: 8000 };   // H110 de palier1.js (table T14)
  var MENAGES = [
    { id: 'couple_smic_0', libelle: 'Couple, un Smic et un conjoint sans emploi', adultes: 2, enfants: 0, emplois: [SMIC] },
    { id: 'couple_smic_smic', libelle: 'Couple, deux Smic', adultes: 2, enfants: 0, emplois: [SMIC, SMIC] },
    { id: 'couple_cadre_0', libelle: 'Couple, un cadre à 8 000 € nets et un conjoint sans emploi', adultes: 2, enfants: 0, emplois: [CADRE8K] },
    { id: 'couple_cadre_smic', libelle: 'Couple, un cadre à 8 000 € nets et un Smic', adultes: 2, enfants: 0, emplois: [CADRE8K, SMIC] },
    { id: 'isole1', libelle: 'Parent isolé au Smic, 1 enfant', adultes: 1, enfants: 1, emplois: [SMIC] },
    { id: 'isole2', libelle: 'Parent isolé au Smic, 2 enfants', adultes: 1, enfants: 2, emplois: [SMIC] },
    { id: 'couple2enfants_median', libelle: 'Couple, 2 enfants, un salaire médian et un Smic', adultes: 2, enfants: 2, emplois: [MEDIAN, SMIC] }
  ];
  /** Foyer (entrée de `net`) d'un ménage type : R annuel de chaque adulte, 0 pour un adulte sans emploi. */
  function foyerDe(m) {
    var R = [], i;
    for (i = 0; i < m.adultes; i++) R.push(i < m.emplois.length ? m.emplois[i].cout * 12 : 0);
    return { adultes: m.adultes, R: R, enfants: m.enfants };
  }
  /** Tableau d'un ménage : loi actuelle et chaque régime (revenu disponible mensuel, écart à la loi actuelle). */
  function comparer(m, o) {
    var p = par(o), f = foyerDe(m), a = actuel(m), out = { id: m.id, libelle: m.libelle, actuel: a, regimes: {} };
    Object.keys(REGIMES).forEach(function (k) {
      var v = net(f, REGIMES[k], p);
      out.regimes[k] = { net: v, ecart: v - a, impotAn: impot(f, REGIMES[k], p), socleMois: socle(f, REGIMES[k], p) };
    });
    return out;
  }
  function tableau(o) { return MENAGES.map(function (m) { return comparer(m, o); }); }

  /** Taux de participation du second apporteur (entrée à un Smic) selon le régime, pour un premier apporteur de coût employeur R1 (€/mois) et n enfants. */
  function participationSecond(R1Mois, enfants, reg, o) {
    var p = par(o), f = { adultes: 2, R: [R1Mois * 12, SMIC.cout * 12], enfants: enfants || 0 };
    return tauxParticipation(f, reg, p);
  }

  // ---------- Effet sur le solde public (ordre de grandeur) : couples de la population du modèle
  var HYP = {
    nCouples: 12e6,        // H140 ⚠️ : couples dont les deux conjoints sont non retraités (≈ 65 % de 38,7 M d'adultes en couple, Insee FAM G3 : 65 à 70 %)
    partMonoactifs: 0.15,  // H140 ⚠️ : part des couples dont un seul conjoint a un revenu d'activité (non sourcée : à lire dans l'enquête Emploi)
    homogamie: 0.30,       // H141 ⚠️ : part des couples biactifs dont les deux conjoints sont dans la même bande de revenu (le reste : appariement indépendant)
    elasticite: 0.5,       // H142 : élasticité de participation du second apporteur au revenu net d'activité (0,2-0,6 : Bargain et al. 2014 ; 0,5-1 : Selin 2014 ; 1-2 : Carbonnier 2021)
    pointPlatMd: 13,       // H143 : valeur d'un point de taux plat (12 à 14,5 Md€, resultats.md § 11.2) ; palier1.js la recalcule
    enfants: D.enfants     // enfants à charge (modele.js, DREES)
  };
  function hyp(o) { var r = {}, k; for (k in HYP) r[k] = HYP[k]; if (o) for (k in o) r[k] = o[k]; return r; }
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };
  function disp(R, sigma) {
    return GH.z.map(function (z, i) { return { R: R * Math.exp(sigma * z - sigma * sigma / 2), w: GH.w[i] }; });
  }

  /** Bandes de revenu (n, R par adulte actif, dispersion) du modèle au palier 1, pondérées. */
  function bandes(o) {
    var p = par(o), P = M.param({ archi: 'c2', tPlat: p.tPlat, tMax: p.tMax, R0: p.R0, socle: p.socle, scenario: 'central' }), rc = M.recettesCourants(P), tot = 0, B;
    B = rc.parBande.map(function (b, i) { tot += b.n; return { n: b.n, R: b.R, sigma: i < 9 ? P.dispersion : 0.15 }; });
    B.forEach(function (b) { b.w = b.n / tot; });
    return B;
  }

  /**
   * Écarts de solde public (Md€ par an, + = le régime rapporte plus à l'État) par rapport au palier 1 individualisé (régime `individualise`),
   * calculés sur les couples (et sur les enfants pour le quotient) de la population du modèle. Sans retour de comportement sauf `participation`.
   *  - conjugalisation : l'impôt continu du couple calculé sur le revenu moyen (2 parts) rapporte MOINS que l'impôt individuel : valeur négative
   *  - socleFamilial : socle de 1,5 S au lieu de 2 S par couple : valeur positive (économie)
   *  - quotient : coût du quotient (0,5 part par enfant, sans plafond) : valeur négative ; supplementEconomise : le supplément de socle (200 €/enfant) n'est plus versé
   *  - participation : recettes des seconds apporteurs qui entrent en emploi quand l'impôt est individuel (mesurées par rapport au régime conjugalisé)
   */
  function effetSolde(o, h) {
    var p = par(o), H = hyp(h), B = bandes(p), i, j, a, b, pair = 0, indiv = 0, conj = 0, mono = 0, monoI = 0, monoC = 0, entrants = 0, recEntr = 0;
    var Rsmic = SMIC.cout * 12, rec = impotIndiv(Rsmic, p);
    var f = function (R1, R2) { return { adultes: 2, R: [R1, R2], enfants: 0 }; };
    for (i = 0; i < B.length; i++) {
      var di = disp(B[i].R, B[i].sigma);
      // couples biactifs : appariement (1 − h) indépendant + h dans la même bande
      for (j = 0; j < B.length; j++) {
        var wij = (1 - H.homogamie) * B[i].w * B[j].w + (i === j ? H.homogamie * B[i].w : 0);
        if (wij <= 0) continue;
        var dj = disp(B[j].R, B[j].sigma);
        for (a = 0; a < 5; a++) for (b = 0; b < 5; b++) {
          var w = wij * di[a].w * dj[b].w, ff = f(di[a].R, dj[b].R);
          indiv += w * impot(ff, REGIMES.individualise, p); conj += w * impot(ff, REGIMES.palier1, p); pair += w;
        }
      }
      // couples monoactifs
      for (a = 0; a < 5; a++) {
        var wm = B[i].w * di[a].w, fm = f(di[a].R, 0);
        monoI += wm * impot(fm, REGIMES.individualise, p); monoC += wm * impot(fm, REGIMES.palier1, p); mono += wm;
      }
      // entrée du conjoint à un Smic : le taux de participation baisse quand l'impôt est individuel
      var fe = f(B[i].R, Rsmic), ptrC = tauxParticipation(fe, REGIMES.palier1, p), ptrI = tauxParticipation(fe, REGIMES.individualise, p);
      var hausse = (ptrC - ptrI) / (1 - ptrC), e = H.nCouples * H.partMonoactifs * B[i].w * H.elasticite * Math.max(0, hausse);
      entrants += e; recEntr += e * rec;
    }
    var NB = H.nCouples * (1 - H.partMonoactifs), NM = H.nCouples * H.partMonoactifs;
    var gainBiactifs = NB * (indiv / pair - conj / pair), gainMono = NM * (monoI / mono - monoC / mono);
    // quotient : économie d'impôt moyenne d'un enfant (0,5 part), par adulte-décideur, sur les bandes (le foyer monoparental ou en couple est approché par un adulte seul)
    var parEnfant = 0;
    B.forEach(function (bd) {
      disp(bd.R, bd.sigma).forEach(function (x) {
        var sans = { adultes: 1, R: [x.R, 0], enfants: 0 }, avec = { adultes: 1, R: [x.R, 0], enfants: 2 };
        parEnfant += bd.w * x.w * (impot(sans, REGIMES.quotient, p) - impot(avec, REGIMES.quotient, p)) / 2;
      });
    });
    var quotientMd = H.enfants * parEnfant / 1e9, supplementMd = H.enfants * p.enfant * 12 / 1e9;
    var out = {
      conjugalisation: -(gainBiactifs + gainMono) / 1e9, conjugalisationBiactifs: -gainBiactifs / 1e9, conjugalisationMonoactifs: -gainMono / 1e9,
      socleFamilial: H.nCouples * p.socle * (2 - p.echelleCouple) * 12 / 1e9,
      quotientCout: -quotientMd, supplementEconomise: supplementMd, quotientNet: supplementMd - quotientMd,
      participation: recEntr / 1e9, entrants: entrants, parEnfantMoyen: parEnfant
    };
    out.individualiseVsPalier1 = -out.conjugalisation + out.participation;            // passer de l'impôt conjugalisé à l'impôt individuel (le palier 1 publié est conjugalisé)
    out.familialVsPalier1 = out.socleFamilial;                                        // socle de 1,5 S : économie par rapport au palier 1 publié (socle individuel, impôt conjugalisé)
    out.enPointsDePlat = {};
    ['conjugalisation', 'socleFamilial', 'quotientNet', 'participation', 'individualiseVsPalier1', 'familialVsPalier1'].forEach(function (k) { out.enPointsDePlat[k] = out[k] / H.pointPlatMd; });
    return out;
  }

  var API = { PAR: PAR, HYP: HYP, REGIMES: REGIMES, MENAGES: MENAGES, par: par, hyp: hyp, impot: impot, socle: socle, net: net, tauxParticipation: tauxParticipation,
    irActuel: irActuel, actuel: actuel, foyerDe: foyerDe, comparer: comparer, tableau: tableau, participationSecond: participationSecond, bandes: bandes, effetSolde: effetSolde,
    SMIC: SMIC, MEDIAN: MEDIAN, CADRE8K: CADRE8K };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Foyer = API;
})(this);
