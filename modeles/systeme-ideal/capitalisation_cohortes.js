/*
 * modeles/systeme-ideal/capitalisation_cohortes.js — T48, variante « cohortes réelles » de la capitalisation progressive (01/11/2026).
 * Remplace, EN OPTION, la démographie stylisée de modeles/retraites/capitalisation.js (40 générations égales, rente de 22 ans, masse salariale à g)
 * par les cohortes de modeles/prospective-demographie (Insee 2026 ; bas = population jeune, central, haut = population âgée, comme demographie.js) :
 * cotisants par âge simple (emploi.py, trajectoire du COR) et survie par âge et par année (moteur de cohortes), embarqués dans trajectoires_capi_cohortes.js
 * (généré par generer_capitalisation_cohortes.py). Ajoute l'effet sur l'épargne nationale et sur le taux d'intérêt de la dette (H221 à H240, methode.md § 22).
 * La variante stylisée (capitalisation.js) reste inchangée et reste la référence du simulateur.
 * Charger dans l'ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js trajectoires_demo.js demographie.js
 *   ../retraites/capitalisation.js capitalisation.js trajectoires_capi_cohortes.js capitalisation_cohortes.js
 * Unités : Md€ de 2025 (euros constants), années de calendrier ; t = 0 en 2027 (année de la réforme). Fonctions pures. Ordres de grandeur, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var RC = root.RetraitesCapi || (typeof require !== 'undefined' ? require('../retraites/capitalisation.js') : null);
  var TC = root.TrajectoiresCapiCohortes || (typeof require !== 'undefined' ? require('./trajectoires_capi_cohortes.js') : null);
  function K() { return root.CapitalisationSI || (typeof require !== 'undefined' ? require('./capitalisation.js') : null); }
  function P1() { return root.Palier1 || (typeof require !== 'undefined' ? require('./palier1.js') : null); }
  function DS() { return root.DemographieSI || (typeof require !== 'undefined' ? require('./demographie.js') : null); }

  var C = RC.CONSTANTES, AN0 = TC.annee0, AN_REF = C.anneeReforme, AN_FIN = AN0 + TC.scenarios.central.cot.length - 1;   // 2025, 2027, 2070
  var AGE_COT0 = TC.ageCot0, AGE_SV0 = TC.ageSv0, AGE_MAX_COT = AGE_COT0 + TC.scenarios.central.cot[0].length - 1;       // 15, 50, 74

  // H223 : âge de conversion du capital en rente (âge légal de la réforme de 2023 à terme ; le COR projette un âge effectif de 64,5 ans en 2040)
  var AGE_DEPART = 64;
  // H226 : profil de salaire relatif par âge (option 'age', ⚠️ hypothèse non sourcée ; défaut 'plat' : la cotisation suit le nombre de cotisants de chaque âge)
  var PROFIL_SALAIRE = [[15, 0.6], [25, 0.9], [35, 1.05], [45, 1.15], [55, 1.2]];
  // H231 : frais de gestion. Le rendement r de H24 (modeles/retraites) est lu comme net de frais d'un fonds public type Suède (0,21 %/an, Orange Report 2020, pdf p. 26,
  // cité dans sources/recherche-retraite-capitalisation.md) ; une autre hypothèse de frais déplace r d'autant : r_net = r + FRAIS_REF − frais (V2984).
  var FRAIS_REF = 0.0021;
  // H232-H237 : épargne et taux, convention du système idéal (bas = favorable, haut = défavorable).
  //  delta : part des versements au fonds compensée par une baisse de l'épargne volontaire des ménages (déplacement) — Chetty et al. 2014 : +0,80 d'épargne totale par unité
  //          de cotisation automatique (≈ 0,2 compensé) ; Attanasio-Rohwedder 2001 : élasticité de substitution proche de −1 pour le régime lié aux revenus (haut 0,75) ; bas 0.
  //  beta  : hausse du taux d'intérêt de marché (en fraction) par point de dette de transition / PIB — Laubach 2009 (version publiée, JEEA) : 3 à 4 pb par point de dette projetée (États-Unis ; la version de travail de 2003 disait 4 à 5, V2982) ;
  //          central 2 pb (Poghosyan 2012, Kinoshita 2006 ; en dessous des 3 à 7 pb de la zone euro prise dans son ensemble, H241), haut 4,5 pb (au-dessus de Laubach publié, dans la fourchette zone euro : stress), bas 0.
  //  frais : frais de gestion annuels — bas 0,05 % (NBIM), central 0,21 % (Suède), haut 1 % (frais de contrat d'assurance vie seuls : borne basse du détail ; une UC de détail coûte ≈ 2,5 %, H242, V2984).
  var EPARGNE = {
    bas: { delta: 0, beta: 0, frais: 0.0005 },
    central: { delta: 0.2, beta: 0.0002, frais: 0.0021 },
    haut: { delta: 0.75, beta: 0.00045, frais: 0.01 }
  };
  var M_EPARGNE = 0.118;   // H235 : épargne marginale sur un revenu d'activité (Chetty et al. 2014, 11,8 centimes par DKr) : part du prélèvement temporaire prise sur l'épargne
  // H237 : dette publique existante et maturité (croissance.js, DETTE : 3 460,5 Md€ fin 2025, Insee ; 8,5 ans, AFT, V2866) ; tenue constante en euros de 2025
  var DETTE_EXISTANTE = 3460.5, MATURITE = 8.5;
  var APPARIEMENT_CAPI = { bas: 'haut', central: 'central', haut: 'bas' };   // H117 (r, g, i de la variante retraites)

  function scDemo(sc) { var s = TC.scenarios[sc]; if (!s) throw new Error('scénario démographique inconnu : ' + sc); return s; }
  function idx(annee) { return Math.max(0, Math.min(AN_FIN, annee) - AN0); }
  /** Survie de l'âge x (1er janvier de l'année a) à x + 1 ; au-delà de 2070, table de 2070 (H224) ; âge ouvert 100. */
  function survie(sd, a, x) { return x < AGE_SV0 ? 1 : sd.sv[idx(a)][Math.min(x, 100) - AGE_SV0]; }
  function cotisantsTotal(sd, a) { return sd.cotisants[idx(a)]; }
  function poidsSalaire(x, profil) {
    if (profil !== 'age') return 1;
    var w = PROFIL_SALAIRE[0][1], k;
    for (k = 0; k < PROFIL_SALAIRE.length; k++) if (x >= PROFIL_SALAIRE[k][0]) w = PROFIL_SALAIRE[k][1];
    return w;
  }

  /** Facteur de rente due d'une cohorte qui atteint l'âge A l'année s : Σ_k S(k) (1+x)^−k, S = survie de cohorte (H224, H225). Renvoie aussi l'espérance de vie à A. */
  function facteurRenteCohorte(sd, s, A, x) {
    var S = 1, f = 0, e = 0, k;
    for (k = 0; k < 60 && S > 1e-7; k++) { f += S * Math.pow(1 + x, -k); e += S; S *= survie(sd, s + k, A + k); }
    return { facteur: f, esperance: e - 0.5 };
  }

  /** Paramètres de rendement, croissance et taux : ceux de la variante retraites (scénario scRet), frais et surcharges éventuels. */
  function parametres(p) {
    var s = RC.scenario(p.scRet || 'central'), ep = EPARGNE[p.scEpargne || 'central'];
    var frais = p.frais === undefined ? (p.avecFrais ? ep.frais : FRAIS_REF) : p.frais;
    var r = (p.r === undefined ? s.r : p.r) + FRAIS_REF - frais, g = p.g === undefined ? s.g : p.g, rho = p.rho === undefined ? g : p.rho;
    var i = p.i === undefined ? s.i : p.i;
    return { r: r, g: g, rho: rho, i: i, frais: frais, beta: p.beta === undefined ? (p.effetTaux ? ep.beta : 0) : p.beta,
      delta: p.delta === undefined ? ep.delta : p.delta, m: p.m === undefined ? M_EPARGNE : p.m };
  }

  /**
   * Double charge année par année avec les cohortes réelles, 2027-2070.
   * p : { phiMax (3), pas (3), demo ('bas' | 'central' | 'haut', convention du système idéal), scRet (scénario r, g, i de la variante retraites), scEpargne
   *   (delta, beta, frais), ageDepart (64), profil ('plat' | 'age'), r, g, rho, i, frais, avecFrais (frais du scénario d'épargne au lieu de FRAIS_REF), effetTaux (bool),
   *   beta, delta, m, financement ('dette' : dette de transition | 'prelevement' : pas de dette, points prélevés), jusqua (2070 ; au-delà, démographie figée) }
   * Lignes : annee, t, phi, cotisants, rapportCotisantsRetraites, verseFondsMdE, pensionsFondsMdE, economieRepartitionMdE, doubleChargeMdE, doubleChargePctPIB,
   *   fondsMdE, detteMdE, tauxDette, surcoutDetteExistanteMdE, impactDeficitMdE, pointsPreleves, epargne { fonds, publique, menages, nationale, pctPIB }, pibMdE.
   */
  function doubleCharge(p) {
    p = p || {};
    var sd = scDemo(p.demo || 'central'), q = parametres(p), A = p.ageDepart || AGE_DEPART, phiMax = p.phiMax === undefined ? 3 : p.phiMax;
    var phi = RC.profilPoints(phiMax, p.pas), fin = p.financement || 'dette', fin_ = p.jusqua || AN_FIN;   // au-delà de 2070 : démographie et survie figées à 2070 (H228)
    var KF = {}, KR = {}, conv = {}, lignes = [], fonds = 0, dette = 0, dIapp = 0, cot0 = cotisantsTotal(sd, AN_REF), cotN = cotisantsTotal(sd, AN0);
    var pic = -Infinity, anneePic = null, b, y, x;
    for (y = AN_REF; y <= fin_; y++) {
      var t = y - AN_REF, pib = C.pibMdE * Math.pow(1 + q.g, y - AN0) * cotisantsTotal(sd, y) / cotN;
      // 1. Conversion des cohortes qui atteignent A cette année (capital accumulé jusqu'à l'année précédente, comme la variante stylisée)
      b = y - A;
      if (KF[b] !== undefined && !conv[b]) {
        conv[b] = { s: y, KF: KF[b], KR: KR[b], aF: facteurRenteCohorte(sd, y, A, q.r).facteur, aR: facteurRenteCohorte(sd, y, A, q.rho).facteur, S: 1 };
      }
      // 2. Rentes versées par le fonds et pensions de répartition évitées (H225 : rente due, survivants de la cohorte)
      var pf = 0, er = 0, cb;
      for (cb in conv) {
        var c = conv[cb];
        if (c.s > y) continue;
        if (c.s < y) c.S *= survie(sd, y - 1, y - 1 - Number(cb));
        pf += c.KF * c.S / c.aF; er += c.KR * c.S / c.aR;
      }
      // 3. Cotisations détournées (H222) : φ(t) points × assiette d'un point × (1+g)^t × cotisants(y) / cotisants(2027), réparties sur les âges < A selon les cotisants (H226)
      var verse = phi(t) * C.assiettePointMdE * Math.pow(1 + q.g, t) * cotisantsTotal(sd, y) / cot0;
      var w = [], sw = 0, ligneCot = sd.cot[idx(y)];
      for (x = AGE_COT0; x <= Math.min(AGE_MAX_COT, A - 1); x++) { var wx = ligneCot[x - AGE_COT0] * poidsSalaire(x, p.profil); w.push([x, wx]); sw += wx; }
      w.forEach(function (e) { var bb = y - e[0], ct = verse * e[1] / sw; KF[bb] = (KF[bb] || 0) + ct; KR[bb] = (KR[bb] || 0) + ct; });
      // 4. Capitalisation de fin d'année (cohortes non converties)
      for (cb in KF) if (!conv[cb]) { KF[cb] *= 1 + q.r; KR[cb] *= 1 + q.rho; }
      // 5. Fonds, dette de transition, taux (H233-H234 : i_t = i + beta × dette de transition / PIB en points ; dette existante refinancée au rythme de la maturité)
      var net = verse - er, fondsAvant = fonds, detteAvant = dette, ratio = 100 * detteAvant / pib, dI = q.beta * Math.max(0, ratio), it = q.i + dI;
      fonds = (fonds + verse - pf) * (1 + q.r);
      if (fin === 'dette') dette = dette * (1 + it) + net;   // en prélèvement, pas de dette de transition (points prélevés)
      dIapp += (dI - dIapp) / MATURITE;
      var surcout = dIapp * DETTE_EXISTANTE;
      // 6. Épargne nationale (H236) : fonds + administrations + ménages ; le surcoût d'intérêts sur la dette existante est un transfert (non compté)
      var sFonds = fonds - fondsAvant, sPub = fin === 'dette' ? -(dette - detteAvant) : 0;
      var sMen = -q.delta * verse - (fin === 'prelevement' ? q.m * net : 0);
      var sNat = sFonds + sPub + sMen;
      if (net > pic) { pic = net; anneePic = y; }
      lignes.push({ annee: y, t: t, phi: phi(t), cotisants: cotisantsTotal(sd, y), rapportCotisantsRetraites: cotisantsTotal(sd, y) / sd.retraites[idx(y)],
        verseFondsMdE: verse, pensionsFondsMdE: pf, economieRepartitionMdE: er, doubleChargeMdE: net, doubleChargePctPIB: 100 * net / pib,
        fondsMdE: fonds, detteMdE: dette, dettePctPIB: 100 * dette / pib, tauxDette: it, surcoutDetteExistanteMdE: surcout,
        impactDeficitMdE: (dette - detteAvant) + surcout, gainRetraitesMdE: pf - er,
        pointsPreleves: net > 0 ? net / (C.assiettePointMdE * Math.pow(1 + q.g, t) * cotisantsTotal(sd, y) / cot0) : 0,
        epargne: { fonds: sFonds, publique: sPub, menages: sMen, nationale: sNat, pctPIB: 100 * sNat / pib }, pibMdE: pib });
    }
    var der = lignes[lignes.length - 1], negatif = null, k;
    for (k = 0; k < lignes.length; k++) if (lignes[k].annee > anneePic && lignes[k].doubleChargeMdE <= 1e-9) { negatif = lignes[k].annee; break; }
    var cum = lignes.reduce(function (s, l) { return s + l.epargne.nationale; }, 0);
    var premiere = facteurRenteCohorte(sd, AN_REF + 40, A, q.rho);
    return { parametres: { phiMax: phiMax, demo: p.demo || 'central', ageDepart: A, r: q.r, g: q.g, rho: q.rho, i: q.i, frais: q.frais, beta: q.beta, delta: q.delta, financement: fin },
      lignes: lignes,
      resume: { picMdE: pic, anneePic: anneePic, anneeDoubleChargeNegative: negatif, dureeDoublePaiement: negatif === null ? null : negatif - AN_REF,
        dette2070MdE: der.detteMdE, dette2070PctPIB: der.dettePctPIB, fonds2070MdE: der.fondsMdE, net2070MdE: der.fondsMdE - der.detteMdE,
        doubleCharge2070MdE: der.doubleChargeMdE, epargneCumuleeMdE: cum, epargne2070PctPIB: der.epargne.pctPIB,
        esperanceVieA_2067: premiere.esperance, taux2070: der.tauxDette, surcout2070MdE: der.surcoutDetteExistanteMdE } };
  }

  /**
   * Durée du double paiement : simulation prolongée jusqu'en 2150 (démographie figée à 2070, H228). Renvoie l'année où la double charge devient négative,
   * celle où elle passe durablement sous 0,1 % du PIB (comme anneeSurcoutNegligeable de la variante stylisée) et celle où le fonds dépasse la dette de transition.
   */
  function duree(p) {
    var q = {}, k; for (k in (p || {})) q[k] = p[k]; q.jusqua = 2150;
    var d = doubleCharge(q), L = d.lignes, neg = null, negl = null, actif = null, t;
    for (t = 0; t < L.length; t++) if (L[t].annee > d.resume.anneePic && L[t].doubleChargeMdE <= 1e-9) { neg = L[t].annee; break; }
    for (t = L.length - 1; t >= 0 && L[t].annee > d.resume.anneePic; t--) { if (L[t].doubleChargePctPIB > 0.1) break; negl = L[t].annee; }
    for (t = 0; t < L.length; t++) if (L[t].annee > AN_REF && L[t].fondsMdE >= L[t].detteMdE && (q.financement || 'dette') === 'dette') { actif = L[t].annee; break; }
    return { anneeDoubleChargeNegative: neg, dureeAns: neg === null ? null : neg - AN_REF, anneeNegligeable: negl, anneeFondsSuperieurDette: actif, lignes: L };
  }

  /** Même horizon avec la démographie stylisée (modeles/retraites/capitalisation.js), pour comparer. */
  function stylise(p) {
    p = p || {};
    var d = RC.doubleCharge({ phiMax: p.phiMax === undefined ? 3 : p.phiMax, pas: p.pas, scenario: p.scRet || 'central', annees: AN_FIN - AN_REF + 1 });
    return d;
  }

  /** Ligne de l'année (2027-2070) pour un scénario du système idéal : démographie, rendement (H117) et épargne appariés. */
  function ligne(annee, scModele, p) {
    p = p || {};
    var q = {}, k; for (k in p) q[k] = p[k];
    q.demo = p.demo || scModele; q.scRet = p.scRet || APPARIEMENT_CAPI[scModele]; q.scEpargne = p.scEpargne || scModele;
    var d = doubleCharge(q);
    return { ligne: d.lignes[annee - AN_REF], resume: d.resume, parametres: d.parametres };
  }

  /**
   * Effet sur le solde et le socle de l'année (2027-2070), financement par la dette (défaut) ou par prélèvement.
   * p : comme doubleCharge, plus base ('palier1' : soldeBase/socleBase de capitalisation.js, création de valeur extrapolée sans plafond, H119 ;
   *   'demographie' : demographie.js, solde et socle finançable avec création de valeur, volumes démographiques du même scénario), st, o.
   * Impact sur le déficit = variation de la dette de transition + surcoût d'intérêts sur la dette existante (si effetTaux) ; socle : − impact / pente (H120), plancher 0.
   */
  function effet(annee, scModele, p) {
    p = p || {};
    var P = P1(), st = p.st || P.palier1().st, base = p.base || 'palier1', fin = p.financement || 'dette', n = annee - AN_REF + 1;
    var L = ligne(annee, scModele, p), l = L.ligne, sb, kb, pente;
    if (base === 'demographie') {
      var D = DS(), s = D.solde(st, scModele, annee, { valeur: true, o: p.o });
      sb = s.solde; kb = D.socleFinancable(st, scModele, annee, { valeur: true, o: p.o }); pente = D.pente(st, annee, s, { o: p.o });
    } else {
      sb = K().soldeBase(st, scModele, n, p.o); kb = K().socleBase(st, scModele, n, p.o, p.tranche); pente = P.penteSocle(st, p.o);
    }
    var impact = fin === 'dette' ? l.impactDeficitMdE : 0;
    return { annee: annee, n: n, scenario: scModele, base: base, financement: fin, points: l.phi,
      soldeSans: sb, soldeAvec: sb - impact, impactSoldeMdE: -impact, socleSans: kb, socleAvec: Math.max(0, kb - impact / pente), perteSocle: kb - Math.max(0, kb - impact / pente),
      doubleChargeMdE: l.doubleChargeMdE, detteMdE: l.detteMdE, dettePctPIB: l.dettePctPIB, fondsMdE: l.fondsMdE, tauxDette: l.tauxDette, surcoutDetteExistanteMdE: l.surcoutDetteExistanteMdE,
      pointsPreleves: l.pointsPreleves, epargne: l.epargne, rapportCotisantsRetraites: l.rapportCotisantsRetraites, resume: L.resume, penteMdParEuro: pente };
  }

  /** Tableau aux années données (défaut 2030, 2035, 2040, 2050, 2060, 2070), trois scénarios. */
  function tableau(p, annees) {
    p = p || {}; annees = annees || [2030, 2035, 2040, 2050, 2060, 2070];
    var P = P1(), q = {}, k, out = {}; for (k in p) q[k] = p[k]; q.st = p.st || P.palier1().st;
    ['bas', 'central', 'haut'].forEach(function (sc) { out[sc] = annees.map(function (a) { return effet(a, sc, q); }); });
    return out;
  }

  var API = { AGE_DEPART: AGE_DEPART, EPARGNE: EPARGNE, M_EPARGNE: M_EPARGNE, FRAIS_REF: FRAIS_REF, DETTE_EXISTANTE: DETTE_EXISTANTE, MATURITE: MATURITE,
    PROFIL_SALAIRE: PROFIL_SALAIRE, APPARIEMENT_CAPI: APPARIEMENT_CAPI, AN_REF: AN_REF, AN_FIN: AN_FIN,
    survie: survie, facteurRenteCohorte: facteurRenteCohorte, parametres: parametres, doubleCharge: doubleCharge, duree: duree, stylise: stylise, ligne: ligne, effet: effet, tableau: tableau };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.CapitalisationCohortes = API;
})(this);
