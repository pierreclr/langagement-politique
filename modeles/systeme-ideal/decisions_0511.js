/*
 * modeles/systeme-ideal/decisions_0511.js — « Décisions du 05/11 » (v5.2) : recalcul du système chiffré avec les décisions de l'auteur de la nuit du 04 au 05/11/2026
 * Module SÉPARÉ au-dessus de optimum.js et de optimum_options_0411.js :
 * AUCUN défaut d'optimum.js n'est modifié ; les suites existantes ne bougent pas. Fonctions pures, euros de 2025, Md€/an en croisière, ordre des scénarios du modèle
 * [bas = favorable, central, haut = défavorable]. Hypothèses H730 à H745 (methode.md § 36). Points à vérifier V13000 à V13030 (verifications.md).
 *
 * Charger (depuis modeles/systeme-ideal/) : la liste d'optimum.js, puis optimum_options_0411.js, ../risques/stress.js, decisions_0511.js.
 *
 * Convention de signe des LIGNES : gain (+) = améliore le solde du budget ; dépense (−) = le dégrade. Les lignes « horsBudget » (CEE, travaux sanitaires des bailleurs)
 * ne comptent PAS dans le solde : elles sont montrées à part. Les lignes « une fois » ne comptent pas non plus dans le solde de croisière.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var X = root.OptionsDu0411 || (req ? req('./optimum_options_0411.js') : null);
  var PI = root.PatrimoineImmobilier || (req ? req('./patrimoine_immobilier.js') : null);
  var OF = root.OptionsFinancement || (req ? req('./options_financement.js') : null);
  var M = root.SystemeIdeal || (req ? req('./modele.js') : null);
  var CDC = root.CDC || (req ? (function () { try { return req('../capital-de-depart/continu.js'); } catch (e) { return null; } })() : null);
  var F = (root.Voies || (req ? req('./voies.js') : null)).fus;
  var SCS = ['bas', 'central', 'haut'];

  var HYP = {
    // H730 : majoration parent isolé 200 € par enfant et par mois (décision 3) ; le coût se lit dans optimum.js (coutCorrectifs.b proportionnel à la majoration)
    majoration: 200,
    // H731 ⚠️ V13001 : TVA à 10 % sur les travaux gardée : coût de X.HYP.tvaTravaux (1,7 / 1,0 / 0,5), repris tel quel
    // H732 ⚠️ V13002 : taux de 5,5 % sur la rénovation énergétique (CGI 278-0 bis A) → 10 % ; dépense fiscale 730223 (norme : taux normal de 20 %), VM T2 PLF 2026 p. 168 : 935 (2024) / 940 (2025) / 1 050 (2026) M€
    tvaEnergie: { depenseFiscale: [1.050, 1.050, 0.935], tauxActuel: 0.055, tauxNouveau: 0.10, tauxNormal: 0.20 },
    // H733 ⚠️ V13003 : élasticité de la demande de travaux énergétiques au prix TTC : 0,5 / 1 / 2 (hypothèse de Claude ; aucune étude lue)
    elasticiteTravaux: [0.5, 1, 2],
    // H734 ⚠️ V13004 : part de la base de TVA à 5,5 % qui disparaît quand MaPrimeRénov' et les CEE disparaissent (travaux qu'ils finançaient et qui ne se feraient pas sans eux) : 15 / 30 / 50 % (hypothèse de Claude, sans étude lue)
    partTravauxPerdus: [0.15, 0.30, 0.50],
    // H735 V13005 : MaPrimeRénov' supprimée : 3,3 Md€ engagés en 2024 (réponse à la QE n° 1190, JO 18/02/2025), absente du modèle (vérifié : ni dans les 117,6 de prestations remplacées, ni dans les économies structurelles A, ni dans le benchmark, ni dans le dossier des 10 Md€)
    mapr: [3.3, 3.3, 3.3],
    // H736 ⚠️ V13006 : CEE résidentiels supprimés : ≈ 4 Md€ en 2024 (même réponse), payés par les fournisseurs d'énergie et répercutés sur les prix : PAS une économie budgétaire.
    // Effet budgétaire : le coût du CEE sort du prix hors taxe de l'énergie, donc la TVA (20 %) sur ce prix baisse ; part répercutée dans le prix : 75 / 100 / 100 % (hypothèse de Claude)
    cee: { md: 4.0, repercussion: [0.75, 1, 1], tva: 0.20 },
    // H737 V13007 : PreParE gardée hors de l'allocation unique : 0,7 Md€ (Drees, 2024, V11773) ; AEEH, AJPP : non comptées parmi les 35,2 Md€ remplacées (V12042) : aucun changement
    prepare: [0.7, 0.7, 0.7],
    // H738 V13008 : supplément familial de traitement supprimé : 1,34 Md€ (Cour des comptes, Sécurité sociale 2024, chap. XIII ; dérivé : 0,60 État + 0,74 autres fonctions publiques) ; défavorable : moitié (acquis, négociation)
    sft: [1.34, 1.34, 0.67],
    // H739 ⚠️ V13009 : TVA réparation à 5 % (minimum européen) : assiette TTC 1,0 / 1,4 / 2,0 Md€ (sources/tva-reparation-occasion.md) ; coût = assiette × (20/120 − 5/105)
    reparation: { assietteTTC: [1.0, 1.4, 2.0], taux: 0.05 },
    // H740 ⚠️ V13010 : volet sanitaire (variante A) : travaux 0,14 / 1,46 / 4,86 Md€ une fois, à la charge des bailleurs (logement-sante.md) ; santé évitée 0,51 / 0,88 / 0,50 Md€/an ; part publique : 78,7 % Sécurité sociale (Drees, CSBM 2024) → 79,4 % avec l'État
    sante: { travaux: [0.14, 1.46, 4.86], evitee: [0.51, 0.88, 0.50], partPublique: 0.787 },
    // H741 ⚠️ V13011 : capital de départ en cinq versements annuels de 8 000 € de 25 à 29 ans ; déblocage anticipé du solde pour un projet : part des jeunes qui le demandent 10 / 20 / 30 %, solde versé en une fois un an après le premier versement (hypothèses de Claude)
    capital: { versements: 5, partDeblocage: [0.10, 0.20, 0.30], delaiDeblocage: 1 },
    dureeFlux: 12                                    // H537
  };

  function i(sc) { return SCS.indexOf(sc); }
  function exil(a, fn) { return Z.avecExil(Z.archi(a).exil, fn); }

  // ---------- Plus-values : alignement du module immobilier (décision 10)
  /** patrimoine_immobilier.js taxe les plus-values à 50 % (CONST.tauxPrelevement, décision du 02/11) sans paramètre ; optimum.js l'appelle via options_financement.immobilier.
   *  Écart de solde (Md€/an) quand ce taux vaut le taux plat de l'architecture : bilan(tPlat) − bilan(50 %). Les modules deces_realisation, patrimoine_financier reçoivent déjà le taux plat d'optimum.js ;
   *  cumul_patrimoine.js utilise déjà 0,414 (CONST.tPrelevement). */
  function bilanImmo(sc, t) { var c = PI.CONST, t0 = c.tauxPrelevement, r; c.tauxPrelevement = t; try { r = PI.bilan(OF.SC_PATRIMOINE[sc]).soldeNet; } finally { c.tauxPrelevement = t0; } return r; }
  function correctionPlusValues(a, sc) { a = Z.archi(a); return bilanImmo(sc, a.tPlat) - bilanImmo(sc, 0.50); }

  // ---------- Lignes
  function coutReparation(sc) { var k = i(sc), t = HYP.reparation.taux; return HYP.reparation.assietteTTC[k] * (0.20 / 1.20 - t / (1 + t)); }
  /** TVA sur la rénovation énergétique : { statique : gain de passer 5,5 → 10 % sur la base actuelle, net : avec la perte de travaux due à la fin de MaPrimeRénov' et des CEE et la hausse du prix TTC, base : base hors taxe } (Md€/an). */
  function tvaEnergie(sc) {
    var k = i(sc), T = HYP.tvaEnergie, base = T.depenseFiscale[k] / (T.tauxNormal - T.tauxActuel);
    var hausse = (1 + T.tauxNouveau) / (1 + T.tauxActuel) - 1;
    var statique = base * (T.tauxNouveau - T.tauxActuel);
    var apres = base * (1 - HYP.partTravauxPerdus[k]) * (1 - HYP.elasticiteTravaux[k] * hausse);
    return { base: base, hausse: hausse, statique: statique, apresBase: apres, net: apres * T.tauxNouveau - base * T.tauxActuel };
  }
  function ceeTva(sc) { return HYP.cee.md * HYP.cee.repercussion[i(sc)] * HYP.cee.tva; }
  function santePublique(sc) { return HYP.sante.evitee[i(sc)] * HYP.sante.partPublique; }

  /** Architecture v5.2 sans les lignes de budget extérieures : v5.1 + majoration de 200 €, au taux plat t (défaut : celui de la v5.1). */
  function archiV52(t) { var a = F(Z.archi(Z.ARCHITECTURE_V5), { majParentIsole: HYP.majoration }); return t === undefined ? a : F(a, { tPlat: t }); }
  var O_PLAFONDS = { mode: 'continu', transmission: true };

  /** Lignes de budget et hors budget au scénario sc, pour l'architecture a (v5.2 par défaut, au taux a.tPlat). Valeurs en Md€/an, gain (+) ou dépense (−). */
  function lignes(a, sc) {
    a = Z.archi(a || archiV52()); var base51 = Z.archi(F(a, { majParentIsole: 400 })), pl = X.coutPlafonds(a, sc, O_PLAFONDS), te = tvaEnergie(sc), L = [];
    function add(id, poste, v, nature, reinvesti, source) { L.push({ id: id, poste: poste, v: v, nature: nature, reinvesti: reinvesti, source: source }); }
    add('cmg', 'Complément de mode de garde gardé (remboursement de service, formule continue)', -X.coutCmg(sc), 'Sécurité sociale (Cnaf)', 'CMG', 'Drees 2024 : 7,3 Md€ (V11773, V12200)');
    add('plafonds', 'Plafonds sur le patrimoine (annuel 75 % + taxe continue + 50 % à la transmission) : perte définitive', -pl.croisiere, 'budget de l\'État (taxe de 1 %, droits)', 'plafonds', 'resultats-optimum.txt § 19.4 (V12207 à V12210)');
    add('majoration', 'Majoration parent isolé ramenée de 400 à 200 € par enfant', Z.solde(a, sc) - Z.solde(base51, sc), 'Sécurité sociale (prestations)', 'baisse du taux unique', 'optimum.js : coût proportionnel à la majoration (H709-H712), 15,2 → 7,6 Md€');
    add('tvaTravaux', 'TVA à 10 % sur les travaux gardée (hors périmètre de la mesure 23)', -X.coutTvaTravaux(sc), 'budget de l\'État (TVA)', 'TVA travaux', 'VM T2 PLF 2026 : 2 465 M€ (V11830), prorata (V12051)');
    add('tvaEnergie', 'TVA 5,5 % → 10 % sur la rénovation énergétique, nette de la baisse des travaux', te.net, 'budget de l\'État (TVA)', 'baisse du taux unique', 'VM T2 PLF 2026 p. 168 (730223) : 1 050 M€ ; élasticité et perte de travaux : hypothèses (V13002-V13004)');
    add('mapr', 'MaPrimeRénov\' supprimée', HYP.mapr[i(sc)], 'budget de l\'État (Anah, programme 135)', 'baisse du taux unique', 'QE n° 1190, 18/02/2025 : 3,3 Md€ engagés en 2024 (V11831)');
    add('ceeTva', 'CEE supprimés : TVA perdue sur la baisse du prix de l\'énergie', -ceeTva(sc), 'budget de l\'État (TVA)', '—', 'hypothèse : coût répercuté hors taxe, TVA 20 % (V13006)');
    add('prepare', 'PreParE gardée hors de l\'allocation unique', -HYP.prepare[i(sc)], 'Sécurité sociale (Cnaf)', 'prestations gardées', 'Drees 2024 : 0,7 Md€ (V11773) ; AEEH, AJPP : hors des 35,2 remplacés, 0 (V12042)');
    add('sft', 'Supplément familial de traitement supprimé', HYP.sft[i(sc)], 'budget de l\'État et des collectivités, hôpitaux', 'baisse du taux unique (compensé par les 200 € par enfant, déjà comptés)', 'Cour des comptes, Sécurité sociale 2024, chap. XIII (V12860)');
    add('reparation', 'TVA réparation à 5 % (minimum européen)', -coutReparation(sc), 'budget de l\'État (TVA)', 'réparation', 'sources/tva-reparation-occasion.md (V12350)');
    add('pvImmo', 'Plus-values au taux unique : module immobilier aligné (50 % → taux plat)', correctionPlusValues(a, sc), 'budget de l\'État (plus-values)', '—', 'patrimoine_immobilier.js à 41,4 % au lieu de 50 % (V13012)');
    add('sante', 'Volet sanitaire du logement : santé évitée, part publique', santePublique(sc), 'Sécurité sociale (Assurance maladie)', 'baisse du taux unique', 'logement-sante.md ; Drees, CSBM 2024 : 78,7 % (V13010)');
    add('chomage', 'Assurance chômage absorbée par l\'allocation unique, complément dégressif 60 / 40 / 20 %', 0, 'Sécurité sociale (Unédic)', 'déjà dans la v5.1', 'resultats-optimum.txt § 17.5 : 12,6 Md€ compté contre 37,1 remplacés');
    add('rge', 'Label RGE supprimé', 0, '—', '—', 'aucun effet budgétaire direct');
    add('capital', 'Capital de départ en 5 × 8 000 € : coût de croisière', 0, 'budget de l\'État', 'inchangé (14,7 Md€ déjà dans la v5.1)', 'flux annuel d\'une cohorte inchangé par le calendrier');
    // Hors budget
    add('ceeMenages', 'CEE supprimés : prélèvement caché en moins sur les consommateurs d\'énergie (hors taxe)', HYP.cee.md * HYP.cee.repercussion[i(sc)], 'prélèvement caché sur les ménages (hors budget)', 'baisse des prix de l\'énergie', 'QE n° 1190 : ≈ 4 Md€ (V13006)');
    add('travauxSanitaires', 'Volet sanitaire : travaux (une fois)', -HYP.sante.travaux[i(sc)], 'une fois, à la charge des bailleurs (hors budget)', '—', 'logement-sante.md (V13010)');
    return L;
  }
  var HORS = { ceeMenages: 1, travauxSanitaires: 1 };
  /** Somme des lignes qui comptent au budget (Md€/an). */
  function totalLignes(a, sc) { return lignes(a, sc).filter(function (l) { return !HORS[l.id]; }).reduce(function (s, l) { return s + l.v; }, 0); }

  // ---------- Capital de départ en cinq versements : calendrier de trésorerie
  /** Part du coût de croisière décaissée l'année t (t = 1, 2, …) après le lancement, si seules les cohortes qui atteignent 25 ans après le lancement sont servies.
   *  u : part des jeunes qui débloquent le solde (une fois, d années après le premier versement). En régime stable le flux vaut 1. */
  function capitalFraction(t, u, d) {
    var n = HYP.capital.versements, s = 0, c, k;
    for (c = 1; c <= t; c++) {   // cohorte c : première année c
      k = t - c;                 // 0 à n-1
      var plein = k < n ? 1 / n : 0;
      var debloque = (k === 0 ? 1 / n : 0) + (k === d ? (n - 1) / n : 0);
      s += (1 - u) * plein + u * debloque;
    }
    return s;
  }
  /** Économie de trésorerie (Md€, sur les n premières années) par rapport à un versement unique de 40 000 € (modèle de la v5.1 : coût plein dès l'année 1), au scénario sc. */
  function capitalTresorerie(a, sc, n) {
    a = Z.archi(a || archiV52()); var cout = CDC.coutCapital(a.capitalFonction)[i(sc)], u = HYP.capital.partDeblocage[i(sc)], d = HYP.capital.delaiDeblocage, t, s = 0, an = [];
    for (t = 1; t <= (n || 6); t++) { var f = capitalFraction(t, u, d); an.push(cout * (1 - f)); s += cout * (1 - f); }
    return { coutCroisiere: cout, annees: an, total: s };
  }

  // ---------- Solde, taux d'équilibre, dette
  /** Solde (Md€/an) de l'architecture a au scénario sc : solde d'optimum.js (majoration incluse dans a) + lignes de décisions sans la majoration (déjà dans a) ni les lignes de coût nul. */
  function solde(a, sc) {
    a = Z.archi(a); var s = Z.solde(a, sc);
    lignes(a, sc).forEach(function (l) { if (!HORS[l.id] && l.id !== 'majoration') s += l.v; });
    return s;
  }
  function soldes(a) { var r = {}; SCS.forEach(function (s) { r[s] = solde(a, s); }); return r; }
  /** Plus petit taux plat (dixième de point) au solde ≥ 0 du scénario sc (défaut : central), majoration à 200 € ; null si aucun entre 30 et 60 % (bornes lo, hi en ‰ modifiables : 100 à 900 pour bas et haut). */
  function tauxEquilibre(a, sc, lo, hi) {
    sc = sc || 'central'; lo = lo || 300; hi = hi || 600;
    var f = function (k) { return solde(F(Z.archi(a || archiV52()), { tPlat: k / 1000 }), sc) >= 0; };
    if (!f(hi)) return null; if (f(lo)) return lo / 1000;
    while (hi - lo > 1) { var m = Math.floor((lo + hi) / 2); if (f(m)) hi = m; else lo = m; }
    return hi / 1000;
  }
  function pointDeTaux(a) { a = Z.archi(a || archiV52()); return solde(F(a, { tPlat: Math.round((a.tPlat + 0.01) * 1000) / 1000 }), 'central') - solde(a, 'central'); }
  /** Écart au solde de la v5.1 (architecture de base à 41,4 %), année par année, pour stress.js (shocks.ajust) : écart de croisière dès l'année 1, moins le report d'encaissement des plafonds pendant 12 ans,
   *  plus l'étalement du capital de départ. À utiliser avec ST.test('V5', sc, { ajust: ... }) : la base est l'architecture v5.1. */
  function ajustement(a) {
    a = Z.archi(a || archiV52()); var base = Z.archi(Z.ARCHITECTURE_V5), memo = {};
    SCS.forEach(function (sc) {
      var pl = X.coutPlafonds(a, sc, O_PLAFONDS), cap = capitalTresorerie(a, sc, 40);
      memo[sc] = { delta: solde(a, sc) - Z.solde(base, sc), flux: pl.flux, cap: cap.annees };
    });
    return function (sc, t) { var m = memo[sc]; return m.delta - (t <= HYP.dureeFlux ? m.flux : 0) + (m.cap[t - 1] || 0); };
  }
  /** Cas types de l'architecture a (écart au droit actuel, €/mois). */
  function casTypes(a) { return Z.casTypes(Z.archi(a || archiV52())); }

  // ---------- Combinaison d'économies de sources/economies-10-milliards.md recomposée (décision 16)
  // Pistes (Md€/an, bas = prudent / central / haut = ample, ordre du dossier) ; le dossier donne l'AMPLEUR de l'économie : l'ordre est inversé par rapport au modèle.
  var PISTES = {
    P1: { nom: 'achats et immobilier de l\'État', v: [0.64, 1.46, 2.91] },
    P3: { nom: 'santé au-delà du central', v: [0, 0.95, 2.9] },
    P4: { nom: 'niches de l\'IS sans évaluation', v: [0.56, 1.13, 1.69] },
    P5: { nom: 'dépenses de l\'État qui interrogent', v: [0.62, 1.35, 2.23] },
    P6: { nom: 'fraude sociale (recouvrement supplémentaire)', v: [0.13, 0.37, 1.47] },
    P8: { nom: 'logement et équipements collectifs (classe C)', v: [0, 0.9, 3.8] },
    P10: { nom: 'aides aux entreprises (pistes IGF)', v: [0.6, 1.0, 1.3] },
    R0: { nom: 'correction du périmètre des accises', v: [-0.2, -0.4, -0.7] }
  };
  // Retirées (devenues incohérentes ou comptées ailleurs) : P2 SFT (décision 12, ligne propre), R1 renoncer à la TVA 10 % (décision 4 : gardée), P7 recentrer le CMG (décision 1 : formule unique gardée),
  // P9 gazole (réserve, risque 5, jamais décidée), P0 retraites (hors v5).
  var COMBINAISONS = {
    large: ['P1', 'P5', 'P3', 'P4', 'P10', 'P6', 'P8', 'R0'],
    prudente: ['P1', 'P5', 'P3', 'P4', 'P6', 'R0']
  };
  function combinaison(nom) {
    var r = [0, 0, 0]; COMBINAISONS[nom].forEach(function (id) { PISTES[id].v.forEach(function (x, k) { r[k] += x; }); }); return r;
  }

  var API = { HYP: HYP, PISTES: PISTES, COMBINAISONS: COMBINAISONS, SCS: SCS, HORS: HORS, archiV52: archiV52, O_PLAFONDS: O_PLAFONDS, bilanImmo: bilanImmo, correctionPlusValues: correctionPlusValues, coutReparation: coutReparation,
              tvaEnergie: tvaEnergie, ceeTva: ceeTva, santePublique: santePublique, lignes: lignes, totalLignes: totalLignes, capitalFraction: capitalFraction, capitalTresorerie: capitalTresorerie,
              solde: solde, soldes: soldes, tauxEquilibre: tauxEquilibre, pointDeTaux: pointDeTaux, ajustement: ajustement, casTypes: casTypes, combinaison: combinaison };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511 = API;
})(this);
