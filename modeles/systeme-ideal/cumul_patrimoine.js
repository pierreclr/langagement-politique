/*
 * modeles/systeme-ideal/cumul_patrimoine.js — T56 (suite), taux effectif CUMULÉ sur le patrimoine, sur la vie d'un actif, et plafond de 50 % « tous impôts confondus » (04/11/2026).
 * Question : les mesures 5, 6, 7 et 10 de la liste des mesures du manifeste sont chiffrées une par une ; que prélèvent-elles ENSEMBLE sur un même bien, de l'achat à la vente ou au décès ?
 *   (1) taxe annuelle de 1 % de la valeur (mesure 6), plafonnée à 5 % du revenu du ménage sous le niveau de vie médian, le reste reporté (créance) et payé à la vente ou au décès ;
 *   (2) prélèvement unique (40,7 %, mesure 5) sur les revenus du bien et sur la plus-value RÉELLE à la vente ou au décès (le décès vaut vente) ; résidence principale exonérée de plus-value ;
 *   (3) droits de succession par la fonction continue E' (taux marginal 50 % × x³/(x³+K³), K = 94 000 €, mesure 7), par héritier, sur le cumul reçu à vie ;
 *   (4) capital de départ exp (K = 80 000 €, mesure 10), crédité à l'héritier modeste.
 * Mesures : part du rendement réel prélevée par an ; cumul sur la période ; part de la valeur transmise prélevée au décès (plafond de 50 %) ; part du revenu prélevée (analogue du plafonnement
 * de l'ISF, Conseil constitutionnel 2012-662 DC, cons. 93 : 75 % du revenu) ; comparaison avec le droit actuel sur les mêmes cas (taxe foncière, IFI, PFU, plus-values immobilières, DMTG).
 * Fonctions pures, euros CONSTANTS (réels), aucune dépendance (le test recoupe avec capital-de-depart/continu.js et plus_values.py si disponibles). AUCUN défaut des autres modules n'est modifié.
 * Des ordres de grandeur sous hypothèses, jamais des prédictions. Hypothèses H650-H679 : methode.md § 34 ; résultats : resultats.md § 30 ; note : sources/cumul-prelevements-patrimoine.md.
 * ⚠️ = non vérifié. Scénarios : « bas » = rendement le plus faible (cumul le plus lourd en part du rendement), « haut » = rendement le plus fort.
 */
(function (root) {
  'use strict';
  var SC = ['bas', 'central', 'haut'];

  var CONST = {
    taxe: 0.01,                 // mesure 6 : 1 % de la valeur par an
    plafondRevenu: 0.05,        // mesure 6 : plafonnement à 5 % du revenu du ménage, sous le niveau de vie médian
    medianNiveauVie: 24000,     // € par unité de consommation et par an, ⚠️ ordre de grandeur (optimum.js lit la moyenne des 5e et 6e dixièmes de la DINA ; Insee : médiane ≈ 24 000 € en 2023, V12130)
    tPrelevement: 0.414,        // mesure 5 : taux du prélèvement unique (taux d'équilibre central, optimum.js V5_TAUX) ; les modules patrimoine_*.js utilisent 0,50 (décision du 02/11) : sensibilité en test // v5.1 (04/11/2026) : 40,9 % (40,7 % avant les corrections V12400-V12411)
    tPrelevement50: 0.50,
    tEMax: 0.5,                 // mesure 7 : le taux marginal de E' ne dépasse jamais 50 %
    K: 94000,                   // H614 : K de E' (optimum.js HERITAGE_V3B, forme 'marg3')
    capG: 40000, capK: 80000,   // mesure 10 : capital de départ G·e^(−H/K) (optimum.js CAPITAL_V3B)
    interetCreance: 0.01,       // H537 : la créance « porte intérêt au taux de la dette » ; en réel ≈ 1 % (OAT 10 ans ≈ 3,3 % nominal moins 2 % d'inflation, ⚠️ V12131) ; 0 = simplement indexée
    recouvrement: 1.0,          // part de la créance effectivement recouvrée à la vente ou au décès (optimum.js H538 retient 0,70 / 0,85 / 0,95 pour les non cotés)
    inflation: 0.02,            // plus_values.py INFLATION_HYP, pour passer des euros constants aux euros courants (droit actuel)
    // Droit actuel
    tauxTF: 0.0045,             // taxe foncière sur le bâti ≈ 0,45 % de la valeur vénale d'un logement de ménage, ⚠️ ordre de grandeur : 26,2 Md€ (ménages, 2024, Insee t_3217) / ≈ 5 800 Md€ (logements et terrains résidentiels, Insee Première 2081 : logements 4 807 + une part des terrains bâtis 4 043), V12132
    pfu: 0.314,                 // PFU 2026 (patrimoine_financier.js REPORT150.tPFU2026), 12,8 % IR + 18,6 % PS
    pfuCehr: 0.34,              // PFU + CEHR 4 % (CPO, patrimoine_financier.js tPFUCEHR)
    ps: 0.172,                  // prélèvements sociaux sur les revenus du patrimoine
    forfaitFraisAcq: 0.075, forfaitTravaux: 0.15, tIR: 0.19,   // plus_values.py REGLES
    ifiSeuil: 1300000, ifiAbattementRP: 0.30
  };
  /** Barème des droits de succession en ligne directe (CGI 777, tableau I ; abattement de 100 000 € par enfant, CGI 779) : V11300 ✅ le 04/11. */
  var BAREME_SUCCESSION = [[8072, 0.05], [12109, 0.10], [15932, 0.15], [552324, 0.20], [902838, 0.30], [1805677, 0.40], [Infinity, 0.45]];
  var ABATTEMENT_ENFANT = 100000;
  /** Barème de l'IFI (CGI 977) : 0,5 % de 800 000 € à 1,3 M€, 0,7 % à 2,57 M€, 1 % à 5 M€, 1,25 % à 10 M€, 1,5 % au-delà ; sans décote ; ⚠️ de mémoire, V12133. */
  var BAREME_IFI = [[800000, 0], [1300000, 0.005], [2570000, 0.007], [5000000, 0.01], [10000000, 0.0125], [Infinity, 0.015]];

  /**
   * Rendement réel annuel composé = rendement courant net y (loyer net, dividende) + plus-value réelle g (appréciation des prix, euros constants). Le TOTAL est sourcé (Jordà, Knoll, Kuvshinov,
   * Schularick et Taylor, « The Rate of Return on Everything, 1870-2015 », FRBSF WP 2017-25 / QJE 2019 ; `modeles/retraites/donnees/rendements_et_fonds.csv`) ; la répartition y / g est une hypothèse de Claude ⚠️.
   *   logement : central 6,5 % = France 1870-2015 (6,54) ; haut 8 % (France 1950-2015 : 10,4 ; 1980-2015 : 6,4) ; bas 4 % = hypothèse prudente, sous tout repère français lu.
   *   actions  : central 4,6 % = 16 pays 1870-2015, composé (4,64) ; bas 3,25 % = France 1870-2015 ; haut 6,4 % = France 1950-2015 (6,38).
   *   entreprise non cotée : bas 3,5 % / central 5 % / haut 7 % ⚠️ (hypothèse : plancher = actions ; aucune source lue sur le rendement des entreprises familiales, V12134).
   */
  var RENDEMENTS = {
    logement:   { bas: { y: 0.030, g: 0.010 }, central: { y: 0.035, g: 0.030 }, haut: { y: 0.040, g: 0.040 } },
    actions:    { bas: { y: 0.025, g: 0.0075 }, central: { y: 0.030, g: 0.016 }, haut: { y: 0.030, g: 0.034 } },
    entreprise: { bas: { y: 0.015, g: 0.020 }, central: { y: 0.020, g: 0.030 }, haut: { y: 0.030, g: 0.040 } }
  };

  // ---------- Fonctions de base -------------------------------------------------------------------------------------------------------------------
  function interp(a, b, k) { return a + (b - a) * k; }
  /** I3(u) = ∫0^u dt/(1+t³), primitive exacte (continu.js). */
  function I3(u) { return Math.log((u + 1) * (u + 1) / (u * u - u + 1)) / 6 + (Math.atan((2 * u - 1) / Math.sqrt(3)) + Math.PI / 6) / Math.sqrt(3); }
  /** Impôt E' (€) sur un cumul reçu à vie x : intégrale du taux marginal 50 % × x³/(x³+K³). */
  function impotE(x, K) { K = K || CONST.K; if (!(x > 0)) return 0; var u = x / K; return CONST.tEMax * K * (u - I3(u)); }
  function margE(x, K) { K = K || CONST.K; var a = x * x * x; return CONST.tEMax * a / (a + K * K * K); }
  /** Capital de départ (€) d'un jeune dont l'héritage reçu à vie vaut H. */
  function capitalDepart(H) { return CONST.capG * Math.exp(-(H || 0) / CONST.capK); }
  /** Droits actuels (€) sur un cumul reçu x par un enfant, en ligne directe : barème CGI 777 après abattement de 100 000 €. */
  function droitsActuel(x) {
    var base = Math.max(0, x - ABATTEMENT_ENFANT), imp = 0, prev = 0, i;
    for (i = 0; i < BAREME_SUCCESSION.length; i++) { if (base > prev) imp += (Math.min(base, BAREME_SUCCESSION[i][0]) - prev) * BAREME_SUCCESSION[i][1]; prev = BAREME_SUCCESSION[i][0]; }
    return imp;
  }
  function ifiActuel(patrimoineImmoNet) {
    var imp = 0, prev = 0, i, b = BAREME_IFI;
    if (patrimoineImmoNet <= CONST.ifiSeuil) return 0;
    for (i = 0; i < b.length; i++) { if (patrimoineImmoNet > prev) imp += (Math.min(patrimoineImmoNet, b[i][0]) - prev) * b[i][1]; prev = b[i][0]; }
    return imp;
  }
  // Plus-values immobilières actuelles (plus_values.py) : abattements pour durée et surtaxe
  function abIR(n) { if (n <= 5) return 0; var a = 0.06 * (Math.min(n, 21) - 5); if (n >= 22) a += 0.04; return Math.min(a, 1); }
  function abPS(n) { if (n <= 5) return 0; var a = 0.0165 * (Math.min(n, 21) - 5); if (n >= 22) a += 0.016; if (n > 22) a += 0.09 * (n - 22); return Math.min(a, 1); }
  var BANDES = [[50000, 60000, 0.02, 0.05], [60000, 100000, 0.02, null], [100000, 110000, 0.03, 0.10], [110000, 150000, 0.03, null], [150000, 160000, 0.04, 0.15], [160000, 200000, 0.04, null],
                [200000, 210000, 0.05, 0.20], [210000, 250000, 0.05, null], [250000, 260000, 0.06, 0.25]];
  function surtaxe(pv) {
    var i, b;
    if (pv <= 50000) return 0; if (pv > 260000) return 0.06 * pv;
    for (i = 0; i < BANDES.length; i++) { b = BANDES[i]; if (pv > b[0] && pv <= b[1]) return b[3] === null ? b[2] * pv : b[2] * pv - (b[1] - pv) * b[3]; }
    return 0;
  }
  /** Impôt actuel sur la plus-value d'un bien immobilier (hors RP) détenu n années : gain NOMINAL, forfaits de 7,5 % (frais) et de 15 % (travaux, au-delà de 5 ans) sur le prix d'achat, IR 19 %, PS 17,2 %, surtaxe. */
  function pvImmoActuel(prixAchat, prixVenteNominal, n) {
    var corrige = prixAchat * (1 + CONST.forfaitFraisAcq + (n > 5 ? CONST.forfaitTravaux : 0)), pv = prixVenteNominal - corrige;
    if (pv <= 0) return { ir: 0, ps: 0, surtaxe: 0, total: 0, pv: pv };
    var imp = pv * (1 - abIR(n)), ps = pv * (1 - abPS(n)), ir = imp * CONST.tIR, p = ps * CONST.ps, st = surtaxe(imp);
    return { ir: ir, ps: p, surtaxe: st, total: ir + p + st, pv: pv };
  }

  // ---------- Cas types -------------------------------------------------------------------------------------------------------------------------
  /**
   * Champs : classe (clé de RENDEMENTS), residence (pas de revenu en espèces, loyer imputé non imposé, plus-value exonérée), V0 (€ constants, prix d'achat ou valeur à l'entrée), N (années de détention),
   * fin ('vente' | 'deces'), heritiers (nombre, partage égal), dejaRecu (cumul déjà reçu par chaque héritier), recu (héritage reçu à l'entrée par le propriétaire, € : droits E' dus et capital de départ),
   * revenuAutre (€/an, revenu du ménage hors bien), uc, croissanceRevenu (réelle), partNonCotee (part dont la taxe n'est pas payée chaque année mais reportée : titres non cotés, optimum.js nonCotesVente),
   * partImmo (part régie par le droit immobilier actuel : taxe foncière, IFI, plus-value immobilière), dutreil (droit actuel : exonération de 75 % des droits, CGI 787 B), tmi (taux marginal IR actuel sur le revenu foncier).
   */
  var CAS = [
    { id: 'rp', nom: 'Résidence principale de 300 k€ détenue 30 ans (ménage sous la médiane : 30 000 €/an pour 1,5 UC)', classe: 'logement', residence: true, V0: 300000, N: 30, fin: 'deces', heritiers: 1, dejaRecu: 0,
      revenuAutre: 30000, uc: 1.5, croissanceRevenu: 0.01, partNonCotee: 0, partImmo: 1, tmi: 0.30, pfu: CONST.pfu },
    { id: 'rpAise', nom: 'Même résidence principale, ménage au-dessus de la médiane (90 000 €/an pour 2 UC) : pas de plafonnement', classe: 'logement', residence: true, V0: 300000, N: 30, fin: 'deces', heritiers: 1, dejaRecu: 0,
      revenuAutre: 90000, uc: 2, croissanceRevenu: 0.01, partNonCotee: 0, partImmo: 1, tmi: 0.30, pfu: CONST.pfu },
    { id: 'locatif', nom: 'Logement locatif de 500 k€, détenu 20 ans puis vendu', classe: 'logement', residence: false, V0: 500000, N: 20, fin: 'vente', heritiers: 0, dejaRecu: 0,
      revenuAutre: 60000, uc: 2, croissanceRevenu: 0.01, partNonCotee: 0, partImmo: 1, tmi: 0.30, pfu: CONST.pfu },
    { id: 'actions', nom: 'Portefeuille d\'actions de 1 M€, détenu 20 ans puis vendu', classe: 'actions', residence: false, V0: 1000000, N: 20, fin: 'vente', heritiers: 0, dejaRecu: 0,
      revenuAutre: 80000, uc: 2, croissanceRevenu: 0.01, partNonCotee: 0, partImmo: 0, tmi: 0.30, pfu: CONST.pfu },
    { id: 'entreprise', nom: 'Entreprise familiale de 5 M€ (non cotée), détenue 25 ans puis transmise à 2 enfants', classe: 'entreprise', residence: false, V0: 5000000, N: 25, fin: 'deces', heritiers: 2, dejaRecu: 0,
      revenuAutre: 120000, uc: 2, croissanceRevenu: 0.01, partNonCotee: 1, partImmo: 0, tmi: 0.41, pfu: CONST.pfuCehr, dutreil: true },
    { id: 'grand', nom: 'Patrimoine de 50 M€ (30 % immobilier locatif, 30 % actions, 40 % non coté), détenu 30 ans puis transmis à 3 enfants', classe: 'mixte', residence: false, V0: 50000000, N: 30, fin: 'deces', heritiers: 3, dejaRecu: 0,
      revenuAutre: 0, uc: 2, croissanceRevenu: 0.01, partNonCotee: 0.4, partImmo: 0.3, tmi: 0.45, pfu: CONST.pfuCehr,
      parts: { logement: 0.3, actions: 0.3, entreprise: 0.4 }, dutreil: true, partDutreil: 0.4 },
    { id: 'fondateur', nom: 'Cas extrême : fondateur d\'une société cotée sans dividende (10 M€ de titres, 15 ans, puis vente ; 100 000 €/an de salaire pour 2 UC)', classe: 'actions', residence: false, V0: 10000000, N: 15, fin: 'vente',
      heritiers: 0, dejaRecu: 0, revenuAutre: 100000, uc: 2, croissanceRevenu: 0.01, partNonCotee: 0, partImmo: 0, tmi: 0.41, pfu: CONST.pfuCehr,
      rendementPropre: { bas: { y: 0.003, g: 0.037 }, central: { y: 0.005, g: 0.055 }, haut: { y: 0.005, g: 0.075 } } },
    { id: 'heritier', nom: 'Héritier modeste : reçoit 100 k€ (petite maison, résidence principale), la garde 30 ans, la transmet à un enfant (revenu 22 000 €/an, 1 UC)', classe: 'logement', residence: true, V0: 100000, N: 30, fin: 'deces',
      heritiers: 1, dejaRecu: 0, recu: 100000, revenuAutre: 22000, uc: 1, croissanceRevenu: 0.01, partNonCotee: 0, partImmo: 1, tmi: 0.11, pfu: CONST.pfu }
  ];
  function cas(id) { var i; for (i = 0; i < CAS.length; i++) if (CAS[i].id === id) return CAS[i]; throw new Error('cas inconnu : ' + id); }

  /** Rendement { y, g } d'un cas à un scénario (moyenne pondérée par les parts initiales pour un patrimoine mixte ; simplification : parts fixes). */
  function rendement(c, sc) {
    if (c.rendementPropre) return c.rendementPropre[sc];
    if (!c.parts) return RENDEMENTS[c.classe][sc];
    var y = 0, g = 0, k;
    for (k in c.parts) { y += c.parts[k] * RENDEMENTS[k][sc].y; g += c.parts[k] * RENDEMENTS[k][sc].g; }
    return { y: y, g: g };
  }

  // ---------- Simulation du système proposé -------------------------------------------------------------------------------------------------------
  /**
   * Options o : t (prélèvement, 0,407), interet (créance), mode ('imputation' : l'impôt sur le gain au décès s'impute sur les droits, comme optimum.js `decesPlafonne` ; 'cumul' : gain + droits, deces_realisation.js (i)),
   * rendement ({y, g} pour remplacer RENDEMENTS), regle (null | { detention: part max du revenu pour taxe + prélèvement annuel, transmission: part max de la valeur transmise, ordre: [...] }), sansPlafond5 (true : pas de plafond de 5 %).
   * Renvoie tous les cumuls en € constants et les indicateurs.
   */
  function simuler(c, sc, o) {
    o = o || {}; sc = sc || 'central';
    var t = o.t === undefined ? CONST.tPrelevement : o.t, r = o.rendement || rendement(c, sc), interet = o.interet === undefined ? CONST.interetCreance : o.interet, mode = o.mode || 'imputation', regle = o.regle || null;
    var creance = 0, creanceBrute = 0, interets = 0, taxeDue = 0, taxePayee = 0, impRev = 0, rend = 0, revenuCash = 0, ratioRevMax = 0, ratioRevMaxAn = -1, anneesPlafonnees = 0, an, V, inc, imput, gainAn, rev, due, ctr, nc, cap, payee, report, imp, ratio;
    for (an = 0; an < c.N; an++) {
      V = c.V0 * Math.pow(1 + r.g, an);
      inc = c.residence ? 0 : r.y * V; imput = c.residence ? r.y * V : 0; gainAn = V * r.g;
      rend += inc + imput + gainAn; revenuCash += inc;
      rev = c.revenuAutre * Math.pow(1 + (c.croissanceRevenu || 0), an) + inc;
      due = CONST.taxe * V; nc = c.partNonCotee * due; ctr = due - nc;
      imp = t * inc;
      cap = (!o.sansPlafond5 && rev / c.uc < CONST.medianNiveauVie) ? CONST.plafondRevenu * rev : Infinity;
      if (regle && regle.detention !== undefined) cap = Math.min(cap, Math.max(0, regle.detention * rev - imp));
      payee = Math.min(ctr, cap); report = ctr - payee; if (report > 1e-9) anneesPlafonnees++;
      interets += creance * interet;
      creance = creance * (1 + interet) + report + nc; creanceBrute += report + nc;
      taxeDue += due; taxePayee += payee; impRev += imp;
      ratio = rev > 0 ? (payee + imp) / rev : 0; if (ratio > ratioRevMax) { ratioRevMax = ratio; ratioRevMaxAn = an; }
    }
    var VN = c.V0 * Math.pow(1 + r.g, c.N), gain = VN - c.V0, gainTax = c.residence ? 0 : t * Math.max(0, gain), creanceDue = creance * CONST.recouvrement;
    var out = { cas: c.id, scenario: sc, t: t, mode: mode, y: r.y, g: r.g, VN: VN, gain: gain, rendementCumule: rend, rendementAnnuelMoyen: rend / c.N, taxeDue: taxeDue, taxePayee: taxePayee, impotRevenus: impRev, creance: creanceDue,
                creanceBrute: creanceBrute, interetsCreance: interets, impotGain: gainTax, anneesPlafonnees: anneesPlafonnees, ratioRevenuMax: ratioRevMax, ratioRevenuMaxAn: ratioRevMaxAn,
                droits: 0, droitsReception: 0, capitalDepart: 0, reduction: { creance: 0, gain: 0, droits: 0 } };
    if (c.recu) { out.droitsReception = impotE(c.recu); out.capitalDepart = capitalDepart(c.recu); }
    if (c.fin === 'deces') {
      var n = c.heritiers || 1, base, droits, dr0 = impotE(c.dejaRecu || 0), total, exces, ordre = (regle && regle.ordre) || ['creance', 'gain', 'droits'], k, cut;
      base = VN - creanceDue - (mode === 'cumul' ? gainTax : 0);
      droits = n * (impotE(base / n + (c.dejaRecu || 0)) - dr0);
      out.droits = droits; out.baseDroits = base;
      total = (mode === 'cumul' ? droits + gainTax : Math.max(droits, gainTax)) + creanceDue;
      out.totalDecesAvantRegle = total;
      if (regle && regle.transmission !== undefined && total > regle.transmission * VN) {
        exces = total - regle.transmission * VN;
        for (k = 0; k < ordre.length && exces > 1e-9; k++) {
          if (ordre[k] === 'creance') { cut = Math.min(exces, creanceDue); creanceDue -= cut; out.reduction.creance += cut; }
          else if (ordre[k] === 'gain') { cut = Math.min(exces, mode === 'cumul' ? gainTax : Math.max(0, gainTax - droits)); gainTax -= cut; out.reduction.gain += cut; }
          else { cut = Math.min(exces, droits); droits -= cut; out.reduction.droits += cut; }
          exces -= cut;
        }
        out.creance = creanceDue; out.impotGain = gainTax; out.droits = droits;
      }
      out.totalDeces = (mode === 'cumul' ? out.droits + out.impotGain : Math.max(out.droits, out.impotGain)) + out.creance;
      out.partTransmise = out.totalDeces / VN;
      out.partDroits = out.droits / VN; out.partGainDeces = out.impotGain / VN; out.partCreance = out.creance / VN;
      out.depasse50Transmission = out.partTransmise > CONST.tEMax + 1e-9;
    } else {
      var totV = out.impotGain + out.creance, excV;
      out.totalDecesAvantRegle = totV;
      if (regle && regle.transmission !== undefined && totV > regle.transmission * VN) {
        excV = totV - regle.transmission * VN;
        var cutV = Math.min(excV, creanceDue); creanceDue -= cutV; out.reduction.creance += cutV; excV -= cutV;
        if (excV > 1e-9) { cutV = Math.min(excV, gainTax); gainTax -= cutV; out.reduction.gain += cutV; }
        out.creance = creanceDue; out.impotGain = gainTax;
      }
      out.totalDeces = out.impotGain + out.creance; out.partTransmise = null; out.partVente = out.totalDeces / VN; out.depasse50Transmission = out.partVente > CONST.tEMax + 1e-9;
    }
    // Cumul sur la période de détention : taxe (payée ou reportée, avec intérêts), impôt sur les revenus, impôt sur le gain, hors droits
    var impotGainEff = (c.fin === 'deces' && mode !== 'cumul') ? Math.max(0, out.impotGain - out.droits) : out.impotGain;   // en mode imputation, l'impôt sur le gain n'ajoute que son excédent sur les droits
    out.detention = taxePayee + out.creance + impRev + impotGainEff;
    out.cumulDetention = out.detention / rend;
    out.cumulTout = (out.detention + out.droits + out.droitsReception - out.capitalDepart) / rend;
    out.fluxAnnuelDu = (taxeDue + impRev) / rend;                       // part du rendement réel prélevée chaque année (taxe due, y compris reportée, + impôt sur les revenus)
    out.fluxAnnuelPaye = (taxePayee + impRev) / rend;
    out.taxeSurRendement = taxeDue / rend;
    out.depasse50 = out.cumulDetention > 0.5; out.depasse100 = out.cumulDetention > 1;
    out.depasse75Revenu = ratioRevMax > 0.75;
    out.netTransmisSurV0 = c.fin === 'deces' ? (VN - out.totalDeces) / c.V0 : null;   // < 1 : le capital transmis, net des prélèvements du décès, est inférieur à la valeur d'entrée (euros constants)
    out.netDetenteur = c.fin === 'vente' ? VN - out.impotGain - out.creance : null;
    return out;
  }

  // ---------- Simulation du droit actuel (mêmes cas, mêmes rendements) ---------------------------------------------------------------------------------
  /** Droit actuel : taxe foncière (bâti), IFI, impôt sur les revenus (IR + PS pour le foncier, PFU pour le financier), plus-value à la vente (immobilier : abattements ; financier : PFU sur le gain NOMINAL), effacement de la plus-value au décès, DMTG. */
  function simulerActuel(c, sc, o) {
    o = o || {}; sc = sc || 'central';
    var r = o.rendement || rendement(c, sc), pi = c.partImmo, an, V, inc, rend = 0, tf = 0, ifi = 0, impRev = 0, rev, ratio, ratioMax = 0, pay;
    for (an = 0; an < c.N; an++) {
      V = c.V0 * Math.pow(1 + r.g, an);
      inc = c.residence ? 0 : r.y * V; rend += (c.residence ? r.y * V : inc) + V * r.g;
      tf += CONST.tauxTF * V * pi;
      var immoNet = V * pi * (c.residence ? 1 - CONST.ifiAbattementRP : 1); ifi += ifiActuel(immoNet);
      impRev += inc * (pi * ((c.tmi || 0.30) + CONST.ps) + (1 - pi) * (c.pfu || CONST.pfu));
      rev = c.revenuAutre * Math.pow(1 + (c.croissanceRevenu || 0), an) + inc;
      pay = CONST.tauxTF * V * pi + ifiActuel(immoNet) + inc * (pi * ((c.tmi || 0.30) + CONST.ps) + (1 - pi) * (c.pfu || CONST.pfu));
      ratio = rev > 0 ? pay / rev : 0; if (ratio > ratioMax) ratioMax = ratio;
    }
    var VN = c.V0 * Math.pow(1 + r.g, c.N), VNnom = VN * Math.pow(1 + CONST.inflation, c.N), gainTax = 0, droits = 0, n = c.heritiers || 1, x, base = VN, nonImmo;
    if (c.fin === 'vente' && !c.residence) {
      // le gain financier est nominal (non déflaté) : taux plus élevé sur le gain réel
      gainTax = pvImmoActuel(c.V0 * pi, VNnom * pi, c.N).total + (1 - pi) * Math.max(0, VNnom - c.V0) * (c.pfu || CONST.pfu);
    }
    if (c.fin === 'deces') {
      nonImmo = c.dutreil ? (c.partDutreil === undefined ? 1 : c.partDutreil) : 0;
      base = VN * (1 - 0.75 * nonImmo);                             // Dutreil : 75 % de la valeur des titres exonérés (CGI 787 B)
      x = base / n + (c.dejaRecu || 0);
      droits = n * (droitsActuel(x) - droitsActuel(c.dejaRecu || 0));
    }
    var out = { cas: c.id, scenario: sc, VN: VN, rendementCumule: rend, taxeFonciere: tf, ifi: ifi, impotRevenus: impRev, impotGain: gainTax, droits: droits, droitsReception: c.recu ? droitsActuel(c.recu) : 0, capitalDepart: 0, ratioRevenuMax: ratioMax };
    out.detention = tf + ifi + impRev + gainTax;
    out.cumulDetention = out.detention / rend;
    out.cumulTout = (out.detention + droits + out.droitsReception) / rend;
    out.fluxAnnuelDu = (tf + ifi + impRev) / rend;
    out.partTransmise = c.fin === 'deces' ? droits / VN : null;
    out.depasse50 = out.cumulDetention > 0.5; out.depasse100 = out.cumulDetention > 1;
    return out;
  }

  /** Comparaison système / droit actuel sur un cas et un scénario. */
  function comparer(c, sc, o) { return { systeme: simuler(c, sc, o), actuel: simulerActuel(c, sc, o) }; }

  // ---------- Règle de plafonnement proposée (proposition, sans changer les défauts) ---------------------------------------------------------------
  /**
   * Règle simple : (a) pendant la détention, taxe de 1 % + prélèvement sur les revenus ≤ 75 % du revenu du ménage de l'année (analogue du plafonnement de l'ISF, 2012-662 DC cons. 93), l'excédent est reporté ;
   * (b) à la transmission, créance + impôt sur le gain + droits ≤ 50 % de la valeur transmise, l'excédent étant supprimé dans l'ordre créance, impôt sur le gain, droits.
   */
  var REGLE_PROPOSEE = { detention: 0.75, transmission: 0.5, ordre: ['creance', 'gain', 'droits'] };
  function avecRegle(c, sc, o) { var p = {}, k; for (k in (o || {})) p[k] = o[k]; p.regle = REGLE_PROPOSEE; return simuler(c, sc, p); }

  var API = { SC: SC, CONST: CONST, RENDEMENTS: RENDEMENTS, CAS: CAS, cas: cas, rendement: rendement, BAREME_SUCCESSION: BAREME_SUCCESSION, BAREME_IFI: BAREME_IFI, REGLE_PROPOSEE: REGLE_PROPOSEE,
    I3: I3, impotE: impotE, margE: margE, capitalDepart: capitalDepart, droitsActuel: droitsActuel, ifiActuel: ifiActuel, abIR: abIR, abPS: abPS, surtaxe: surtaxe, pvImmoActuel: pvImmoActuel,
    simuler: simuler, simulerActuel: simulerActuel, comparer: comparer, avecRegle: avecRegle };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.CumulPatrimoine = API;
})(this);
