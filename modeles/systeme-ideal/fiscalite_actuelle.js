/*
 * modeles/systeme-ideal/fiscalite_actuelle.js — « avant » du modèle et du simulateur : une seule source de vérité (H105, remplacée le 01/11/2026).
 * Fonctions pures : impôt sur le revenu actuel (IR) à partir d'un revenu net mensuel de salarié, et coût employeur à partir du net.
 * Charger après modele.js (la table du coût employeur T14 y est lue, `DONNEES.coutSelonBrut`). Utilisé par palier1.js, hauts_revenus.js, foyer.js
 * et simulations/ma-situation.js. Des ordres de grandeur, jamais des prédictions. ⚠️ = non confirmé.
 *
 * Sources (consultées le 01/11/2026) :
 *  - barème des revenus 2025 (impôt 2026) : service-public.gouv.fr/particuliers/vosdroits/F1419 et F34328 (11 600 / 29 579 / 84 577 / 181 917 € ; 0 / 11 / 30 / 41 / 45 %) ;
 *  - décote : « célibataire, impôt brut ≤ 1 982 € ; couple ≤ 3 277 € » (F34328) ⇒ décote = 897 € (seul) ou 1 483 € (couple) − 45,25 % de l'impôt brut
 *    (897 / 0,4525 = 1 982 ; 1 483 / 0,4525 = 3 277) ; ⚠️ 897 et 1 483 déduits des seuils publiés, art. 197 CGI non relu ;
 *  - plafond de l'avantage du quotient familial : 1 807 € par demi-part (F34328) ; 4 262 € pour les premières demi-parts du parent isolé (BOFiP, V2805) ;
 *  - abattement de 10 % pour frais professionnels : minimum 509 €, maximum 14 555 € par personne (service-public.gouv.fr/particuliers/vosdroits/F1989, revenus 2025) ;
 *  - coût employeur : table T14 de modele.js (API Urssaf mon-entreprise, 5 points brut → coût), ratio constant au-delà de 5 601 € de brut.
 * Simplifications déclarées : net = 78 % du brut (ratio de modele.js) ; CSG-CRDS non déductible = 2,9 % de 98,25 % du brut, ajoutée au net pour retrouver le net imposable
 * (le 98,25 % s'applique au-delà de 4 plafonds de la sécurité sociale en réalité : écart ≤ 0,05 % du revenu) ; ni frais réels, ni déductions, ni CEHR (contribution
 * exceptionnelle sur les hauts revenus : 3 % au-delà de 250 000 € de revenu fiscal de référence, 4 % au-delà de 500 000 €), ni crédits d'impôt.
 */
(function (root) {
  'use strict';
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var BAREME = [[11600, 0], [29579, 0.11], [84577, 0.30], [181917, 0.41], [Infinity, 0.45]];   // revenus 2025
  var DECOTE = { seul: 897, couple: 1483, taux: 0.4525 };
  var PLAFOND_DEMI_PART = 1807, PLAFOND_PREMIERES_PARENT_ISOLE = 4262;
  var ABATTEMENT = { taux: 0.10, min: 509, max: 14555 };
  var CSG_NON_DEDUCTIBLE = 0.029 * 0.9825;                                                       // part du brut : CSG 2,4 % + CRDS 0,5 % non déductibles

  function irBareme(base, parts) {
    var q = base / parts, ir = 0, prev = 0, i;
    for (i = 0; i < BAREME.length; i++) { if (q > prev) ir += (Math.min(q, BAREME[i][0]) - prev) * BAREME[i][1]; prev = BAREME[i][0]; }
    return ir * parts;
  }
  /** IR annuel (€) d'un foyer de revenu net imposable `base` (€/an) : quotient conjugal et familial plafonné, puis décote. */
  function irAn(base, adultes, enfants) {
    var isole = adultes === 1 && enfants > 0, partsBase = adultes, partsPlein, demis, plafond;
    if (isole) { partsPlein = 1 + 1 + 0.5 * (Math.min(enfants, 2) - 1) + Math.max(enfants - 2, 0); demis = (partsPlein - 1) * 2; plafond = PLAFOND_PREMIERES_PARENT_ISOLE + PLAFOND_DEMI_PART * (demis - 2); }
    else { partsPlein = adultes + 0.5 * Math.min(enfants, 2) + Math.max(enfants - 2, 0); demis = (partsPlein - adultes) * 2; plafond = PLAFOND_DEMI_PART * demis; }
    var ir = Math.max(irBareme(base, partsPlein), irBareme(base, partsBase) - plafond);
    var dec = adultes > 1 ? DECOTE.couple : DECOTE.seul;
    return Math.max(0, ir - Math.max(0, dec - DECOTE.taux * ir));
  }
  /** Revenu net imposable annuel (€) d'un salarié de net mensuel `netMois` : net + CSG non déductible, moins l'abattement de 10 % (plancher 509 €, plafond 14 555 €). */
  function baseImposableSalaire(netMois) {
    if (!(netMois > 0)) return 0;
    var imposable = 12 * netMois * (1 + CSG_NON_DEDUCTIBLE / M.DONNEES.ratioNetBrut);
    return imposable - Math.min(ABATTEMENT.max, Math.max(ABATTEMENT.min, ABATTEMENT.taux * imposable));
  }
  /** IR annuel (€) d'une personne seule, sans enfant, salariée au net mensuel `netMois`. */
  function irSalarieSeul(netMois) { return irAn(baseImposableSalaire(netMois), 1, 0); }
  /**
   * IR annuel (€) d'un retraité seul de pension NETTE mensuelle `pensionNetMois` (H182, audit B4) : brut = net / (1 − 9,1 %) (CSG 8,3 % + CRDS 0,5 % + Casa 0,3 %, taux normal) ; base = brut moins la CSG
   * déductible (5,9 %), moins l'abattement de 10 % (minimum 454 €, plafond 4 439 € par foyer, revenus 2025 ; vérifié sur impots.gouv.fr et service-public.gouv.fr F415, V2865), puis barème et décote comme pour un salarié seul.
   */
  var PENSIONS = { csgCrdsCasa: 0.091, csgDeductible: 0.059, abattement: { taux: 0.10, min: 454, max: 4439 } };
  function irRetraiteSeul(pensionNetMois) {
    if (!(pensionNetMois > 0)) return 0;
    var brut = 12 * pensionNetMois / (1 - PENSIONS.csgCrdsCasa), avant = brut * (1 - PENSIONS.csgDeductible), a = PENSIONS.abattement;
    return irAn(avant - Math.min(a.max, Math.max(a.min, a.taux * avant)), 1, 0);
  }
  /** Revenu disponible mensuel (€) « avant » d'un salarié seul : net moins IR/12 (sans prestations, cas des cadres). */
  function netApresIR(netMois) { return netMois - irSalarieSeul(netMois) / 12; }
  /** Coût employeur mensuel (€) d'un temps plein de net mensuel `netMois` : table T14 lue sur le brut (net / 0,78), ratio constant au-delà de la table. */
  function coutEmployeurDepuisNet(netMois) { return M.interp(M.DONNEES.coutSelonBrut, netMois / M.DONNEES.ratioNetBrut, true); }
  /** Rapport coût employeur / net : 1,839 au-delà de 5 601 € de brut (1,825 « de mémoire » avant le 01/11/2026). */
  function coefficientCout(netMois) { return coutEmployeurDepuisNet(netMois) / netMois; }

  var API = { BAREME: BAREME, DECOTE: DECOTE, ABATTEMENT: ABATTEMENT, irBareme: irBareme, irAn: irAn, baseImposableSalaire: baseImposableSalaire, irSalarieSeul: irSalarieSeul, irRetraiteSeul: irRetraiteSeul, PENSIONS: PENSIONS,
    netApresIR: netApresIR, coutEmployeurDepuisNet: coutEmployeurDepuisNet, coefficientCout: coefficientCout };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.FiscaliteActuelle = API;
})(this);
