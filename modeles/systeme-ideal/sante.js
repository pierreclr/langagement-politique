/*
 * modeles/systeme-ideal/sante.js — T47, brique « santé » (31/10/2026). Fonctions pures au-dessus de modele.js et voies.js
 * (charger modele.js, voies.js puis ce fichier). Hypothèses H53 à H64 : methode.md § 8. ⚠️ = non confirmé.
 *
 * Convention : économies en Md€ par an, à effet plein, en euros courants 2024-2026, MESURÉES PAR RAPPORT À LA TRAJECTOIRE DE RÉFÉRENCE
 * (et non par rapport à la dépense de 2024) : la dépense de santé continue d'augmenter. Les trois cas se rattachent aux scénarios du
 * modèle : « bas » (réactions faibles) = cas favorable, « central », « haut » (réactions fortes) = cas défavorable (économies faibles).
 * Aucun effet sur la santé des personnes n'est monétisé ici : voir sources/recherche-sante-leviers.md.
 */
(function (root) {
  'use strict';
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var V = root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null);
  function fus(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  // ---------- Données de cadrage (sources : sources/recherche-sante-leviers.md)
  var DONNEES = {
    csbm2025: 256.45,          // DREES, comptes de la santé (data.drees, cns_financement), CSBM 2025 provisoire, Md€
    csbmSecu2025: 201.64, csbmOC2025: 33.46, csbmMenages2025: 19.69,
    gestion2025: { secu: 7.23, apuCentrales: 1.21, oc: 9.18, total: 17.62 },   // « gestion du système de santé », DREES, Md€ 2025
    oc2024: { cotisations: 46.484, fraisSinistres: 1.814, fraisAcquisition: 3.566, fraisAdmin: 3.372, prestations: 36.775 },   // DREES, comptes détaillés des OC 2024
    hcaam2022: { gestionEvitee: 5.4, dontDirect: 3.2, dontDesaffiliation: 2.2, transfertPublic: 22.5, tsaPerdue: 3.6, baissePrimes: 26.9, tauxTSA: 0.1327, autresNet: 0.13 },   // HCAAM, janvier 2022, scénario 3, base 2017 ⚠️
    ratioGestionAMO: 7.0 / 196.55,     // gestion Sécu 2024 / CSBM Sécu 2024 : 3,56 %
    ondamPressionCNAM2030: { sansAction: 57, regulation: 44, regulationPlusPrevention: 35 }   // CNAM, Charges et produits 2027 : hausse de dépense 2024-2030 (Md€)
  };

  // ---------- Leviers : [favorable, central, défavorable], Md€/an à effet plein (H53 à H60)
  var LEVIERS = {
    pertinence: { id: 'a', libelle: 'Pertinence des soins, maîtrise médicalisée, qualité (hors fraude)', v: [4.5, 4.0, 0.85], delaiAns: '3 à 5', plein: 5 },
    medicaments: { id: 'c', libelle: 'Prix, génériques, biosimilaires, dispositifs médicaux', v: [5.3, 3.4, 1.3], delaiAns: '1 à 4', plein: 4 },
    hopital: { id: 'd', libelle: 'Hôpital : achats, virage ambulatoire, restructuration des services à risque', v: [2.6, 2.2, 0.6], delaiAns: '3 à 6', plein: 6 },
    prevention: { id: 'e', libelle: 'Prévention (Nutri-Score, activité physique, programmes ciblés) : dépense de soins évitée', v: [0.22, 0.10, 0], delaiAns: '10 à 25', plein: 25 },
    franchises: { id: 'f', libelle: 'Franchises et reste à charge (optionnel, désactivé par défaut)', v: [0.5, 0.3, 0.3], delaiAns: '1', plein: 1, optionnel: true },
    numerique: { id: 'g', libelle: 'Numérique (DMP, Mon espace santé) : examens redondants évités', v: [0, 0, 0], delaiAns: 'inconnu', plein: 1 }
  };
  var INDEX = { bas: 0, central: 1, haut: 2 };   // scénario du modèle → colonne de v

  /**
   * Économies par levier et total, pour un scénario du modèle ('bas' | 'central' | 'haut'). opts.franchises : true pour compter le levier (f). opts.sansLevier : liste d'identifiants à exclure.
   * opts.annee (H177, montée en charge, audit A5) : année n de la réforme (1 = première année) ; chaque levier atteint son plein effet au bout de `plein` années (borne haute de `delaiAns` : 5, 4, 6, 25, 1),
   * montée LINÉAIRE de 0 à 100 % : part de l'année n = min(1, n / plein). Sans `annee` : effet plein (régime de croisière, comportement historique).
   */
  function economies(scenario, opts) {
    opts = opts || {};
    var i = INDEX[scenario], out = { parLevier: {}, total: 0 }, k;
    if (i === undefined) throw new Error('scénario inconnu : ' + scenario);
    for (k in LEVIERS) {
      var L = LEVIERS[k], skip = (L.optionnel && !opts.franchises) || (opts.sansLevier && opts.sansLevier.indexOf(k) >= 0);
      var x = skip ? 0 : L.v[i] * (opts.annee ? Math.min(1, opts.annee / L.plein) : 1);
      out.parLevier[k] = x; out.total += x;
    }
    return out;
  }

  /**
   * Double guichet AMO/AMC, scénario 3 du HCAAM (l'assurance maladie obligatoire prend en charge les tickets modérateurs ; l'AMC reste pour le reste).
   * Chiffres HCAAM (base 2017) mis à l'échelle par `echelle` (1 = tels quels). Retourne :
   *  - gainPayeurs : gain net des assurés et employeurs (= charges de gestion évitées) si le surcroît de dépense publique est intégralement financé ;
   *  - besoinFinancement : dépense publique nouvelle + recette de TSA perdue, à financer par prélèvement (cotisation affectée ou taux plat) ;
   *  - effetSoldeAvantFinancement : − besoinFinancement ; après financement à l'euro près, le solde public ne bouge pas ;
   *  - captureEtat : part du gain gardée par l'État (défaut 0) ; effetSoldeApresFinancement = captureEtat × gain.
   */
  function guichetUnique(cas, opts) {
    opts = opts || {};
    var H = DONNEES.hcaam2022, e = opts.echelle === undefined ? 1 : opts.echelle, gain, depense = H.transfertPublic * e, tsa = H.tsaPerdue * e;
    if (cas === 'scenario3') gain = H.gestionEvitee * e;
    else if (cas === 'bas') gain = H.dontDirect * e;                     // sans désaffiliation induite
    else if (cas === 'borneHaute') {                                     // suppression de toute la gestion des OC, moins la gestion supplémentaire de l'AMO
      var o = DONNEES.oc2024, fraisOC = o.fraisSinistres + o.fraisAcquisition + o.fraisAdmin;
      gain = fraisOC - DONNEES.ratioGestionAMO * o.prestations;
      depense = DONNEES.csbmOC2025; tsa = H.tauxTSA * o.cotisations;
    } else throw new Error('cas inconnu : ' + cas);
    var capture = opts.captureEtat || 0;
    return { gainPayeurs: gain, depensePubliqueNouvelle: depense, tsaPerdue: tsa, besoinFinancement: depense + tsa,
      effetSoldeAvantFinancement: -(depense + tsa), effetSoldeApresFinancement: capture * gain, captureEtat: capture };
  }

  /** Bilan d'une voie avec la santé : ajoute les économies au Δ et au solde de chaque scénario. */
  function avecSante(p, opts) {
    var b = V.bilan(p), eb = economies('bas', opts).total, ec = economies('central', opts).total, eh = economies('haut', opts).total;
    var soldeCentral = b.soldeCentral + ec;
    return { p: p, sante: { bas: eb, central: ec, haut: eh },
      deltaCentral: b.central + ec, soldeBas: b.soldeBas + eb, soldeCentral: soldeCentral, soldeHaut: b.soldeHaut + eh,
      margeCentral: Math.max(0, soldeCentral), margeSansSante: b.marge, bilanSansSante: b };
  }

  /** Taux plat d'équilibre (solde central ≥ 0) une fois les économies de santé comptées ; null si aucun jusqu'à 60 %. */
  function platEquilibreAvecSante(p, opts) { return V.platEquilibre(p, -economies('central', opts).total); }

  /** Md€ de recettes par point de taux plat (dérivée numérique du solde central autour de p.tPlat). */
  function mdParPointPlat(p) {
    var t = p.tPlat, a = M.solde(fus(p, { tPlat: t - 0.005, scenario: 'central' })).soldePublic, b = M.solde(fus(p, { tPlat: t + 0.005, scenario: 'central' })).soldePublic;
    return (b - a) / 1.0;   // l'écart de 1 point (de t−0,5 à t+0,5)
  }

  var API = { DONNEES: DONNEES, LEVIERS: LEVIERS, economies: economies, guichetUnique: guichetUnique, avecSante: avecSante,
    platEquilibreAvecSante: platEquilibreAvecSante, mdParPointPlat: mdParPointPlat };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Sante = API;
})(this);
