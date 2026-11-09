/*
 * modeles/systeme-ideal/deces_realisation.js — T56 (suite), règle « le décès et la donation valent réalisation » pour tous les actifs (03/11/2026).
 * Règle de l'auteur (prélèvement unique) : la transmission, le décès ou le départ à l'étranger valent distribution.
 * Aujourd'hui (CGI 150-0 D, 150 VB) la plus-value latente est EFFACÉE à la transmission : l'héritier prend la valeur retenue pour les droits de mutation comme prix d'acquisition.
 * Trois options, toutes OPTIONNELLES (aucun défaut des modèles patrimoine_immobilier.js et patrimoine_financier.js n'est modifié ; le test le vérifie quand ils sont chargés) :
 *   (i)   réalisation au décès et à la donation, imposée à t = 50 %, en plus des droits de succession (l'impôt dû par le défunt est une dette déductible, CGI 768) ;
 *   (ii)  prix d'acquisition reporté chez l'héritier (carryover basis) : aucune recette immédiate, plus d'effacement ; recette différée jusqu'à la vente par l'héritier ;
 *   (iii) réalisation avec crédit d'impôt imputé sur les droits de succession, pour éviter le cumul (deux bornes : par classe d'actifs et par succession groupée).
 * + étalement du paiement et vente forcée (entreprises, pacte Dutreil), assiette par classe d'actifs, trajectoire de (ii).
 * Gabarit des autres modèles : fonctions pures, scénarios bas / central / haut, « bas » = hypothèses les MOINS favorables au solde public. Md€ par an en régime de croisière.
 * Aucune dépendance. Ordres de grandeur, jamais des prédictions. methode.md § 28 (H347 à H376), resultats.md § 26, dossier sources/deces-realisation-plus-values.md, V5880-V5909.
 */
(function (root) {
  'use strict';
  var SC = ['bas', 'central', 'haut'];
  var CLASSES = ['rp', 'imm', 'titres', 'ent', 'av'];   // résidence principale, immobilier hors RP, titres (hors assurance-vie), entreprises non cotées, assurance-vie ; + « autres » (liquidités, meubles) sans gain

  // ---- Constantes sourcées (dossier § 1) -----------------------------------------------------------------------------------------------------
  var CONST = {
    tauxPrelevement: 0.50,           // décision de l'auteur
    fluxTransmis: 300,               // Md€/an, CAE note n° 69 (déc. 2021), p. 5 : « plus de 15 % du PIB, soit 300 milliards », estimation macro vers 2020 (successions, donations, assurance-vie)
    declareManque: [0.35, 0.40],     // CAE p. 5 : le patrimoine déclaré à l'administration est 35 à 40 % plus faible que le flux économique (enquêtes DMTG 1994, 2001, 2006)
    avDeces2024: 43.3,               // Md€, sinistres de l'assurance-vie 2024, ACPR (méthode.md § 26, ligne « part des décès », PDF lu) ; 44 Md€ en 2019 (FFA via CAE p. 7)
    avDeces2019: 44,
    dmtg2024: 15.907 + 4.912,        // Md€ : DMTG successions 15,907 + donations 4,912, 2024 (Insee t_3217, sources/donnees/impots_inventaire.csv, lignes 19-20) ; 990 I : 0,458 (hors total)
    dutreil: { valeur2018: 8, cout2018: [2, 3], cout2023: 3.3, cout2024: 5.5, voiesMoyens2024: 5, voiesMoyens2025: 4, exoneration: 0.75, engagementCollectif: 2, engagementIndividuel: 6, tauxEffectifDonation: 0.05625 },
    //   valeur 2018-2019 et coût 2018-2019 : CAE p. 7 ; coût 2023-2024 : Cour des comptes (nov. 2025) via rapport AN n° 3056 p. 165 ; 787 B lu (75 %, 2 ans collectifs, 6 ans individuels) ; 5,625 % : IPP note n° 92
    usCout: 1.3,                     // Md€/an : coût de l'effacement transposé à la France par le CAE (0,05 % du PIB, Tax Foundation, États-Unis), note n° 69 p. 7 note g
    usPartGainsSuccessions: { petites: 0.13, grandes: 0.55 },  // Avery, Grodzicki, Moore (2013, 2015) via OCDE TWP 72, p. 28-29 : 13 % des estates < 2 M$, > 55 % au-delà de 100 M$ (46 % projetés > 50 M$ ; 6 % < 2 M$)
    franchise200k: 12 / 19,          // CAE p. 8-10, via sources/elasticite-plus-values.md : réforme d'assiette +19 Md€, version à exemption de 200 000 € +12 Md€ : part conservée (analogie)
    elasticiteVie: { pwbm: 0.53 / 0.66, tpc: 0.40 / 0.70 },     // OCDE TWP 72, note 29 : supprimer le step-up réduit l'élasticité de réalisation de −0,66 à −0,53 (PWBM) ou de −0,7 à −0,4 (TPC)
    inflation: 0.02
  };

  // ---- Hypothèses par scénario (methode.md § 28) ---------------------------------------------------------------------------------------------
  // V : valeur transmise par an (Md€) ; g : plus-value latente / valeur au décès (nominale) ; d : durée moyenne de détention jusqu'au décès (ans, pour la base réelle) ; rho : moins-values latentes / gains ;
  // eta : fuite (départ avant le décès, sous-évaluation, démembrement, fondation) ; forme : poids relatif du taux effectif de droits de succession (calibré pour que Σ = DMTG 2024).
  var PARAM = {
    bas: {
      cj: 0.25, margDmtg: 0.30, partDutreil: 10, lambdaVie: 0.03, omega: 0.35, hetero: 1.00, liquidite: 0.15, capacite: 0.02, tauxRappel: 0.30, ancienneteReport: 0,
      rp:     { V: 75, g: 0.40, d: 22, rho: 0.05 },
      imm:    { V: 45, g: 0.40, d: 22, rho: 0.05, eta: 0.10, forme: 2.0, multDeductible: 1.0 },
      titres: { V: 20, g: 0.25, d: 10, rho: 0.15, eta: 0.20, forme: 2.0, multDeductible: 1.0 },
      ent:    { V: 20, g: 0.45, d: 20, rho: 0.05, eta: 0.25, forme: 1.0, multDeductible: 0.25 },
      av:     { V: 43.3, g: 0.30, d: 12.8, rho: 0, anticipation: 0.30, forme: 0.3, multDeductible: 0.5 },
      autres: { forme: 1.0 }, rpForme: 1.0, flux: 250
    },
    central: {
      cj: 0.18, margDmtg: 0.20, partDutreil: 16, lambdaVie: 0.05, omega: 0.25, hetero: 0.85, liquidite: 0.30, capacite: 0.03, tauxRappel: 0.20, ancienneteReport: 0,
      rp:     { V: 80, g: 0.50, d: 22, rho: 0.05 },
      imm:    { V: 55, g: 0.50, d: 22, rho: 0.05, eta: 0.05, forme: 1.6, multDeductible: 1.0 },
      titres: { V: 25, g: 0.35, d: 10, rho: 0.15, eta: 0.10, forme: 1.6, multDeductible: 1.0 },
      ent:    { V: 30, g: 0.60, d: 20, rho: 0.05, eta: 0.15, forme: 0.7, multDeductible: 0.25 },
      av:     { V: 43.3, g: 0.35, d: 12.8, rho: 0, anticipation: 0.15, forme: 0.2, multDeductible: 0.5 },
      autres: { forme: 1.0 }, rpForme: 1.0, flux: 300
    },
    haut: {
      cj: 0.10, margDmtg: 0.12, partDutreil: 22, lambdaVie: 0.08, omega: 0.15, hetero: 0.70, liquidite: 0.45, capacite: 0.04, tauxRappel: 0.12, ancienneteReport: 0,
      rp:     { V: 85, g: 0.60, d: 22, rho: 0.05 },
      imm:    { V: 65, g: 0.60, d: 22, rho: 0.05, eta: 0.02, forme: 1.2, multDeductible: 1.0 },
      titres: { V: 30, g: 0.45, d: 10, rho: 0.15, eta: 0.05, forme: 1.2, multDeductible: 1.0 },
      ent:    { V: 40, g: 0.75, d: 20, rho: 0.05, eta: 0.08, forme: 0.4, multDeductible: 0.25 },
      av:     { V: 43.3, g: 0.40, d: 12.8, rho: 0, anticipation: 0.05, forme: 0.1, multDeductible: 0.5 },
      autres: { forme: 1.0 }, rpForme: 1.0, flux: 330
    }
  };
  // Base par défaut : RÉELLE pour tous les actifs (immobilier : décision du 02/11 ; titres, entreprises, assurance-vie : décision de l'auteur du 03/11, Q4, comme patrimoine_financier.js) ; `reel: false` = variante nominale
  var BASE_REELLE = { rp: true, imm: true, titres: true, ent: true, av: true };

  // ---- Outils --------------------------------------------------------------------------------------------------------------------------------
  /** Plus-value réelle / valeur : le prix d'achat nominal (1 − g) V est réindexé de l'inflation sur d années ; borné à 0. */
  function gainReel(g, d, pi) { return Math.max(0, 1 - (1 - g) * Math.pow(1 + (pi === undefined ? CONST.inflation : pi), d)); }
  function gUtilise(sc, k, o) {
    var p = PARAM[sc][k], reel = (o && o.reel !== undefined) ? !!o.reel : BASE_REELLE[k];
    return reel ? gainReel(p.g, p.d) : p.g;
  }
  function valeurs(sc) {
    var P = PARAM[sc], v = {}, s = 0, k;
    for (k = 0; k < CLASSES.length; k++) { v[CLASSES[k]] = P[CLASSES[k]].V; s += P[CLASSES[k]].V; }
    v.autres = P.flux - s; v.total = P.flux;
    return v;
  }
  /** Taux effectif de droits de succession par classe : forme × λ, avec λ calibré pour que Σ τ V = DMTG 2024 (20,8 Md€, successions + donations). */
  function tauxDmtg(sc) {
    var P = PARAM[sc], v = valeurs(sc), tot = 0, out = {}, k, lam;
    var forme = { rp: P.rpForme, imm: P.imm.forme, titres: P.titres.forme, ent: P.ent.forme, av: P.av.forme, autres: P.autres.forme };
    for (k in forme) tot += forme[k] * v[k];
    lam = CONST.dmtg2024 / tot;
    for (k in forme) out[k] = forme[k] * lam;
    out.lambda = lam;
    return out;
  }
  function retention(o) { return o && o.franchise ? (typeof o.franchise === 'number' ? o.franchise : CONST.franchise200k) : 1; }

  // ---- 1. Assiette : plus-values latentes transmises chaque année ----------------------------------------------------------------------------
  /** Par classe : valeur transmise, taux de plus-value latente, gain latent brut (V g), moins-values latentes, gain net. Gains hors résidence principale = base de l'option (i). */
  function assiette(sc, o) {
    o = o || {};
    var P = PARAM[sc], v = valeurs(sc), out = { scenario: sc, valeurs: v, classes: {}, totalGainNet: 0, totalHorsRP: 0, partDuFlux: 0 }, k, c, g, brut, net;
    for (k = 0; k < CLASSES.length; k++) {
      c = CLASSES[k]; g = gUtilise(sc, c, o); brut = v[c] * g; net = brut * (1 - P[c].rho);
      out.classes[c] = { valeur: v[c], g: g, gainBrut: brut, moinsValues: brut * P[c].rho, gainNet: net };
      out.totalGainNet += net; if (c !== 'rp') out.totalHorsRP += net;
    }
    out.partDuFlux = out.totalGainNet / v.total;
    return out;
  }

  // ---- 2. Option (i) : réalisation au décès (et à la donation), imposée à t, cumulée aux droits de succession --------------------------------------
  /**
   * o : { t (0,5), conjoint (true : transmission au conjoint sans réalisation, reportée au second décès, comme Canada et États-Unis ; false : règle de l'auteur à la lettre),
   *       inclureRP (false), reel, franchise (true ou part conservée), deductible (true : l'impôt du défunt est une dette déductible, CGI 768), sansComportement }.
   * Recette brute = t × V g (1 − ρ) (1 − cj) (1 − η) [assurance-vie : × (1 − part anticipée)] ; coût = droits de succession perdus (marginal × multiplicateur) ; net = brut − coût.
   */
  function realisationDeces(sc, o) {
    o = o || {};
    var P = PARAM[sc], t = o.t === undefined ? CONST.tauxPrelevement : o.t, cj = o.conjoint === false ? 0 : P.cj, ret = retention(o), v = valeurs(sc);
    var cl = o.inclureRP ? CLASSES : ['imm', 'titres', 'ent', 'av'], out = { scenario: sc, t: t, parClasse: {}, statique: 0, brutes: 0, dmtgPerdus: 0, nettes: 0, gainTaxable: 0 }, i, c, g, base, stat, fuite, brut, perdu;
    for (i = 0; i < cl.length; i++) {
      c = cl[i]; g = gUtilise(sc, c, o);
      base = v[c] * g * (1 - P[c].rho) * (1 - cj) * ret;
      if (c === 'av') base *= (1 - (o.sansComportement ? 0 : P.av.anticipation));
      stat = t * base; fuite = (o.sansComportement || c === 'av' || c === 'rp') ? 0 : P[c].eta;
      brut = stat * (1 - fuite);
      perdu = (o.deductible === false) ? 0 : brut * P.margDmtg * (P[c].multDeductible === undefined ? 1 : P[c].multDeductible);
      out.parClasse[c] = { gainTaxable: base, statique: stat, brutes: brut, dmtgPerdus: perdu, nettes: brut - perdu };
      out.gainTaxable += base; out.statique += stat; out.brutes += brut; out.dmtgPerdus += perdu; out.nettes += brut - perdu;
    }
    return out;
  }

  // ---- 3. Option (ii) : prix d'acquisition reporté chez l'héritier (carryover basis) -------------------------------------------------------------
  /**
   * Recette de croisière = t × Σ gains transmis (1 − ρ) × (1 − ω), où ω = part des gains jamais taxée (don à une fondation, héritier non résident, détention perpétuelle) ;
   * la recette de l'année n après la réforme = croisière × (1 − (1 − λ)^n), λ = probabilité annuelle de vente par l'héritier (plus faible que sans report : verrouillage) ;
   * valeur actuelle rapportée à la croisière = λ / (λ + r). Le conjoint n'enlève rien : le report passe de conjoint en conjoint.
   * La résidence principale du défunt devient un bien ordinaire pour l'héritier qui ne l'habite pas : option o.rpVendue (part vendue, 0,5 par défaut) l'inclut.
   */
  function carryover(sc, o) {
    o = o || {};
    var P = PARAM[sc], t = o.t === undefined ? CONST.tauxPrelevement : o.t, ret = retention(o), v = valeurs(sc), lam = o.lambda === undefined ? P.lambdaVie : o.lambda, om = o.omega === undefined ? P.omega : o.omega;
    var r = o.actualisation === undefined ? 0.03 : o.actualisation, rpVendue = o.rpVendue === undefined ? 0.5 : o.rpVendue, base = 0, baseHorsRP = 0, parClasse = {}, i, c, g, b;
    for (i = 0; i < CLASSES.length; i++) {
      c = CLASSES[i]; g = gUtilise(sc, c, o); b = v[c] * g * (1 - P[c].rho) * ret;
      if (c === 'rp') b *= rpVendue;
      parClasse[c] = b * t * (1 - om); base += b; if (c !== 'rp') baseHorsRP += b;
    }
    var croisiere = t * base * (1 - om), horsRP = t * baseHorsRP * (1 - om);
    return { scenario: sc, t: t, lambda: lam, omega: om, gainTransmis: base, parClasse: parClasse, croisiere: croisiere, croisiereHorsRP: horsRP, immediat: 0, valeurActuelleRatio: lam / (lam + r),
             valeurActuelle: croisiere * lam / (lam + r), annee: function (n) { return croisiere * (1 - Math.pow(1 - lam, n)); },
             ansPour63: 1 / lam };
  }
  /** Trajectoire annuelle de (ii) sur n années (recette de l'année j = 1..n) et cumul. */
  function trajectoireCarryover(sc, n, o) {
    var c = carryover(sc, o), serie = [], cumul = 0, j;
    for (j = 1; j <= n; j++) { serie.push(c.annee(j)); cumul += c.annee(j); }
    return { serie: serie, cumul: cumul, croisiere: c.croisiere };
  }

  // ---- 4. Option (iii) : réalisation avec crédit contre les droits de succession -------------------------------------------------------------------
  /**
   * Impôt sur la plus-value du défunt imputé sur les droits de succession (non déductible ; crédit plafonné aux droits dus). Deux bornes :
   *  - par classe : crédit_k = h × min(T_k, droits_k) (borne HAUTE de la recette : ne compte pas la mise en commun des droits sur d'autres actifs de la même succession) ;
   *  - groupée : crédit = h × min(Σ T, Σ droits) (borne BASSE : tous les droits de toutes les classes imputables).
   * h < 1 corrige la concavité du minimum (min d'une somme ≥ somme des minima) quand les successions sont hétérogènes.
   */
  function realisationCredit(sc, o) {
    o = o || {};
    var P = PARAM[sc], r = realisationDeces(sc, { t: o.t, conjoint: o.conjoint, inclureRP: o.inclureRP, reel: o.reel, franchise: o.franchise, deductible: false, sansComportement: o.sansComportement });
    var tx = tauxDmtg(sc), v = valeurs(sc), h = o.hetero === undefined ? P.hetero : o.hetero, parClasse = {}, creditClasse = 0, T = 0, D = 0, c, droits;
    for (c in r.parClasse) {
      droits = tx[c] * v[c];
      parClasse[c] = { impot: r.parClasse[c].brutes, droits: droits, credit: h * Math.min(r.parClasse[c].brutes, droits) };
      creditClasse += parClasse[c].credit; T += r.parClasse[c].brutes;
    }
    D = CONST.dmtg2024;   // tous les droits de succession et de donation (borne basse : toute la masse est imputable)
    var creditGroupe = h * Math.min(T, D);
    return { scenario: sc, impotBrut: T, parClasse: parClasse, creditParClasse: creditClasse, creditGroupe: creditGroupe, recettes: T - creditClasse, recettesBasse: T - creditGroupe, droitsTotaux: D };
  }

  // ---- 5. Liquidité : étalement, vente forcée, pacte Dutreil ---------------------------------------------------------------------------------------
  /** Étalement d'une créance M sur n annuités constantes au taux d'intérêt i, actualisée à r : valeur actuelle des paiements. i = r : aucune perte (VA = M). */
  function etalement(M, n, i, r) {
    var k, s = 0, pay;
    if (n === 0) return { annuite: M, valeurActuelle: M, perte: 0, paiements: [M] };
    if (i === 0) pay = M / n; else pay = M * i / (1 - Math.pow(1 + i, -n));
    var paiements = []; for (k = 1; k <= n; k++) { paiements.push(pay); s += pay / Math.pow(1 + r, k); }
    return { annuite: pay, valeurActuelle: s, perte: M - s, paiements: paiements };
  }
  /** Annuité actualisée : Σ_{j=1..n} (1 + i)^−j. */
  function annuite(n, i) { var s = 0, j; for (j = 1; j <= n; j++) s += Math.pow(1 + i, -j); return s; }
  /**
   * Vente forcée d'entreprises sous (i) : impôt effectif sur la valeur τe = T_ent / V_ent ; part payable sans vendre = λliq + capacité de distribution × annuité(n, i) / τe (plafonnée à 1) ;
   * le reste est vendu (plus-value déjà réalisée par le décès : pas de seconde imposition). Pacte Dutreil : la vente pendant l'engagement (6 ans individuel, 787 B c) fait perdre l'exonération de 75 % :
   * droits rappelés = valeur vendue × part Dutreil × 75 % × taux marginal de rappel. Paiement en titres : part du capital remise = τe.
   */
  function venteForcee(sc, o) {
    o = o || {};
    var P = PARAM[sc], n = o.annees === undefined ? 0 : o.annees, i = o.interet === undefined ? 0.03 : o.interet, r = realisationDeces(sc, { t: o.t, conjoint: o.conjoint, reel: o.reel, franchise: o.franchise, sansComportement: true, deductible: false });
    var V = valeurs(sc).ent, T = r.parClasse.ent.statique, tauE = T / V, couvert = Math.min(1, P.liquidite + P.capacite * annuite(n, i) / tauE);
    var vendu = (1 - couvert) * T, partDut = Math.min(1, P.partDutreil / V), rappel = vendu * partDut * CONST.dutreil.exoneration * P.tauxRappel;
    // vendu (Md€ d'impôt non couvert) est aussi la valeur d'entreprise à céder, la plus-value étant déjà imposée
    return { scenario: sc, annees: n, interet: i, valeurEntreprises: V, impot: T, tauxEffectifSurValeur: tauE, couvert: couvert, valeurCedee: vendu, partDuCapitalCedee: vendu / V,
             partDutreil: partDut, droitsRappeles: rappel, partCapitalEnTitres: tauE };
  }
  /** Cas type d'une entreprise de 100 M€ (prix de revient de 5 M€) transmise en donation avant 70 ans avec Dutreil : droits actuels (5,625 %, IPP) contre impôt de réalisation à t. */
  function casType(o) {
    o = o || {};
    var V = o.valeur === undefined ? 100 : o.valeur, c = o.prix === undefined ? 5 : o.prix, t = o.t === undefined ? CONST.tauxPrelevement : o.t, tauD = CONST.dutreil.tauxEffectifDonation;
    var droits = V * tauD, impot = t * (V - c);
    return { valeur: V, prixRevient: c, droits: droits, impotRealisation: impot, impotSurValeur: impot / V, totalAvec: droits + impot, partDuCapitalPourPayer: impot / V,
             anneesDeDividendes: impot / (V * (o.rendement === undefined ? 0.03 : o.rendement)), carryover: { immediat: 0, impotALaVente: impot } };
  }

  // ---- 6. Interaction avec les modèles de patrimoine : élasticité de réalisation pendant la vie --------------------------------------------------------------
  /** Supprimer l'effacement réduit le verrouillage : facteur à appliquer aux ε de patrimoine_immobilier.js (§ 23-25) et patrimoine_financier.js (§ 26) si la règle est adoptée (non intégré aux soldes). */
  var EPS_VIE = { bas: 1.0, central: CONST.elasticiteVie.pwbm, haut: CONST.elasticiteVie.tpc };

  // ---- Les trois options, par scénario -------------------------------------------------------------------------------------------------------------------
  function options(sc, o) {
    var a = assiette(sc, o), i1 = realisationDeces(sc, o), i2 = carryover(sc, o), i3 = realisationCredit(sc, o), vf = venteForcee(sc, o);
    return { scenario: sc, assiette: a, i: i1, ii: i2, iii: i3, venteForcee: vf };
  }

  var API = { SC: SC, CLASSES: CLASSES, CONST: CONST, PARAM: PARAM, BASE_REELLE: BASE_REELLE, EPS_VIE: EPS_VIE, gainReel: gainReel, gUtilise: gUtilise, valeurs: valeurs, tauxDmtg: tauxDmtg,
              assiette: assiette, realisationDeces: realisationDeces, carryover: carryover, trajectoireCarryover: trajectoireCarryover, realisationCredit: realisationCredit,
              etalement: etalement, annuite: annuite, venteForcee: venteForcee, casType: casType, options: options };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.DecesRealisation = API;
})(this);
