/*
 * modeles/systeme-ideal/capitalisation.js — T47 x T48 (02/11/2026). Fonctions pures qui chargent la variante « part capitalisée progressive »
 * de modeles/retraites/capitalisation.js dans le palier 1. Charger dans l'ordre : modele.js voies.js sante.js optimisation.js retraites2.js palier1.js
 * ../retraites/capitalisation.js capitalisation.js. Hypothèses H117 à H122 : methode.md § 15 ; hypothèses de la variante : modeles/retraites/methode.md § 9 (H21-H40).
 * Convention : « bas / central / haut » = celle du système idéal (bas = réactions faibles, favorable ; haut = défavorable). Elle est inversée pour
 * la variante retraites (bas = rendement faible) : `APPARIEMENT_CAPI`. Année n = 1 pour 2027 (t = n − 1 dans capitalisation.js).
 * Deux financements de la double charge : 'dette' (le déficit augmente de la variation de la dette de transition, intérêts compris) ou 'prelevement'
 * (points de cotisation temporaires ; solde et socle inchangés, mais salaire net réduit). Des ordres de grandeur sous hypothèses, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var P1 = root.Palier1 || (typeof require !== 'undefined' ? require('./palier1.js') : null);
  var RC = root.RetraitesCapi || (typeof require !== 'undefined' ? require('../retraites/capitalisation.js') : null);
  var F = (root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null)).fus;

  // H117 : convention de scénarios inversée entre le système idéal (bas = favorable) et la variante retraites (bas = rendement faible)
  var APPARIEMENT_CAPI = { bas: 'haut', central: 'central', haut: 'bas' };
  var ANNEES_CALCUL = 45;   // horizon de la simulation année par année (la dette de transition est calculée sur 45 ans)

  /** Ligne de la double charge de l'année n (1 = 2027) pour un scénario du système idéal et un nombre de points φ_max (1, 3 ou 6). */
  function ligne(n, scModele, phiMax, pas) {
    var d = RC.doubleCharge({ phiMax: phiMax, pas: pas || 3, scenario: APPARIEMENT_CAPI[scModele], annees: ANNEES_CALCUL });
    var t = n - 1, prec = t > 0 ? d.lignes[t - 1] : { detteMdE: 0 }, l = d.lignes[t];
    // H118 : variation de la dette l'année n = double charge + intérêts de la dette accumulée = ce qui s'ajoute au déficit si financé par la dette
    return { annee: l.annee, phi: l.phi, doubleChargeMdE: l.doubleChargeMdE, impactDetteMdE: l.detteMdE - prec.detteMdE, detteMdE: l.detteMdE,
      fondsMdE: l.fondsMdE, pointsPreleves: l.pointsPreleves, gainRetraitesMdE: l.gainRetraitesMdE, serviceDetteMdE: prec.detteMdE * d.parametres.i };
  }

  /** Solde public de l'année n (Md€/an, déficit actuel compris) sans capitalisation : régime de croisière + création de valeur de l'année n (− transition l'année 1). */
  function soldeBase(st, scModele, n, o) {
    var base = P1.solde(st, scModele, F(P1.opts(o), { anneeSante: n })), v = P1.valeurPourScenario(n, scModele).total;
    return n === 1 ? base - P1.transition(st, scModele).total + v : base + v;
  }

  /** Socle de l'année n sans capitalisation : même règle que palier1.trajectoire (recettes constatées l'année n − 1, tranches de 10 Md€), prolongée au-delà de 10 ans (H119 ⚠️ : extrapolation de la création de valeur sans plafond). */
  function socleBase(st, scModele, n, o, tranche) {
    var pente = P1.penteSocle(st, o), tr = tranche || 10, rec = n === 1 ? 0 : P1.valeurPourScenario(n - 1, scModele).total;
    return st.socle + Math.max(0, Math.floor(rec / tr)) * tr / pente;
  }

  /**
   * Effet de la capitalisation l'année n sur le solde et le socle.
   * p : { phiMax (1, 3, 6), financement ('dette' défaut | 'prelevement'), pas (3), tranche (10), st, o }
   * Socle avec capitalisation (financement par la dette) : socle de base − impact / pente (H120 : le déficit supplémentaire est compensé par une baisse du socle au coût marginal du modèle ;
   * borne basse 0). Financement par prélèvement : solde et socle inchangés, points de cotisation temporaires en plus (pointsPreleves), net du salarié réduit d'autant (H121).
   */
  function effet(n, scModele, p) {
    p = p || {};
    var st = p.st || P1.palier1().st, o = p.o, phi = p.phiMax === undefined ? 3 : p.phiMax, fin = p.financement || 'dette';
    var l = ligne(n, scModele, phi, p.pas), pente = P1.penteSocle(st, o);
    var sb = soldeBase(st, scModele, n, o), kb = socleBase(st, scModele, n, o, p.tranche);
    var impact = fin === 'dette' ? l.impactDetteMdE : 0;
    return { n: n, annee: l.annee, scenario: scModele, phiMax: phi, financement: fin, points: l.phi,
      soldeSans: sb, soldeAvec: sb - impact, impactSoldeMdE: -impact,
      socleSans: kb, socleAvec: Math.max(0, kb - impact / pente), perteSocle: kb - Math.max(0, kb - impact / pente),
      doubleChargeMdE: l.doubleChargeMdE, detteMdE: l.detteMdE, fondsMdE: l.fondsMdE, serviceDetteMdE: l.serviceDetteMdE,
      pointsPreleves: l.pointsPreleves, gainRetraitesMdE: l.gainRetraitesMdE, penteMdParEuro: pente };
  }

  /** Tableau aux années 5, 10, 20 (ou celles données), pour les trois scénarios, φ_max et financement donnés. */
  function tableau(p, annees) {
    p = p || {}; annees = annees || [5, 10, 20];
    var st = p.st || P1.palier1().st, out = {}, q = F(p, { st: st });
    ['bas', 'central', 'haut'].forEach(function (sc) { out[sc] = annees.map(function (n) { return effet(n, sc, q); }); });
    return out;
  }

  var API = { APPARIEMENT_CAPI: APPARIEMENT_CAPI, ANNEES_CALCUL: ANNEES_CALCUL, ligne: ligne, soldeBase: soldeBase, socleBase: socleBase, effet: effet, tableau: tableau };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.CapitalisationSI = API;
})(this);
