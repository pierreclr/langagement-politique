/*
 * modeles/systeme-ideal/taxe_patrimoine.js — taxe unique de 1 % sur le patrimoine, proposition de l'auteur (03/11/2026). Chiffrage du 03/11/2026. Fonctions pures. Ordres de grandeur, jamais des prédictions.
 *
 * La proposition : 1 % par an de la valeur de tout capital (immobilier, résidence principale comprise ; parts de sociétés, holdings, sociétés valorisées
 * par des investisseurs ; pas les auto-entrepreneurs sans patrimoine dans la société), remplaçant la taxe foncière et les droits de mutation (DMTO).
 * Valeur annuelle = prix d'achat indexé (indice local, travaux déclarés ; travaux non déclarés réputés faits au premier jour), régularisation à la vente.
 *
 * Articulation avec le modèle (H500) :
 *   - la taxe foncière (42,9 Md€ en 2024) et l'IFI (2,7) sont DÉJÀ supprimés par le palier 1 (ils font partie des 885,9 Md€ de prélèvements supprimés,
 *     sources/calculs/chapitre9_coeur_controle.py, liste SUPPR) : la recette de la taxe à 1 % est donc entièrement nouvelle par rapport au palier 1 ;
 *   - les DMTO sont supprimés par la réforme immobilière (patrimoine_immobilier.js, `bilan(...).soldeNet` les déduit) : si cette réforme est en place
 *     (`avecReformeImmo: true`, défaut), on ne les déduit pas une seconde fois ; sinon on les déduit ici (la taxe les remplace).
 *
 * Convention des scénarios (comme patrimoine_immobilier.js et patrimoine_financier.js) : « bas » = hypothèses les MOINS favorables au solde public.
 * Unités : Md€ de 2024 par an (régime de croisière), € par ménage et par an pour les cas types. Hypothèses H500 à H529 : taxe-patrimoine-1pc.md et methode.md § 32.
 * Charger seul (aucune dépendance) ; options_financement.js l'utilise s'il est chargé.
 */
(function (root) {
  'use strict';
  var SCS = ['bas', 'central', 'haut'];

  // ---- Faits sourcés ---------------------------------------------------------------------------------------------------------------------------
  /** Comptes de patrimoine 2024, ménages (y c. entrepreneurs individuels et ISBLSM), Md€ fin 2024 : Insee Première n° 2081, nov. 2025, figure 2. */
  var CN = {
    logements: 4807, autresBatiments: 233, terrainsBatis: 4043,       // constructions et terrains : 9 084 (arrondis)
    autresNonProduits: 613,                                            // terres agricoles surtout (⚠️ composition non détaillée dans l'IP, V7301)
    machines: 39, stocks: 18, autresProduits: 213,                     // actifs des entrepreneurs individuels et autres actifs produits
    depots: 2108, titresCreance: 56, creditsActif: 11,
    actionsHorsOpc: 1745,                                              // actions cotées, non cotées et autres participations (y c. parts de SCI)
    opc: 409, assuranceVie: 1856, droitsPension: 234, autresComptesRecevoir: 571,
    anf: 9967, actifsFinanciers: 7096, actifTotal: 17063,
    credits: 1768, autresComptesPayer: 342, passifs: 2112,
    patrimoineNet: 14953
  };
  /** Sociétés (non financières + financières), même figure : immobilier détenu, Md€ (logements 1 026 + 57 ; autres bâtiments 1 044 + 110 ; terrains bâtis 1 596 + 186). */
  var SOCIETES = { immobilier: 1026 + 57 + 1044 + 110 + 1596 + 186, actifsTotaux: 21170 + 19936 };
  /** Recettes 2024 (Insee, tableau 3.217 des comptes nationaux, lu par sources/calculs/chapitre9_coeur_controle.py le 03/11/2026), Md€. */
  var RECETTES = {
    taxeFonciere: 42.94, tfMenages: 26.202, tfHorsMenages: 16.738, ifi: 2.682,
    droitsEnregistrement: 17.199,                                      // y c. DMTO ; le modèle immobilier retient 16,1 au central (patrimoine_immobilier.js H243)
    dmto: { bas: 20.1, central: 16.1, haut: 13.5 },                    // patrimoine_immobilier.js PARAM.dmto (mêmes scénarios)
    dejaSupprimeesParPalier1: 42.94 + 2.682                            // taxe foncière + IFI : dans les 885,9 Md€ du palier 1 (H500)
  };
  /**
   * Distribution du patrimoine brut des ménages, enquête Histoire de vie et Patrimoine 2023-2024 (Insee Focus n° 371, fichier IF371.xlsx, figure 1 et
   * tableau complémentaire 4) : seuils (€) et composition par tranche (% du patrimoine brut : immobilier, financier, professionnel, résiduel, emprunts).
   */
  var HVP = {
    moyenneBrut: 374900,
    seuils: [[0, 0], [0.1, 6200], [0.2, 16500], [0.3, 40100], [0.4, 112100], [0.5, 205100], [0.6, 283200], [0.7, 381800], [0.8, 530000], [0.9, 857700], [0.95, 1268200]],
    p99: 3020900,
    tranches: [   // [borne haute en quantile, immo, fin, pro, résiduel, emprunts]
      [0.10, 0, 32, 0, 68, 29], [0.20, 1, 38, 1, 61, 18], [0.30, 2, 47, 2, 49, 15], [0.40, 27, 48, 3, 22, 10], [0.50, 67, 21, 2, 10, 18],
      [0.60, 75, 15, 1, 9, 21], [0.70, 75, 15, 2, 8, 18], [0.80, 73, 18, 3, 7, 14], [0.90, 69, 20, 5, 6, 14],
      [0.95, 69, 19, 7, 5, 12], [0.99, 58, 25, 14, 4, 10], [1.00, 34, 27, 36, 3, 10]
    ],
    // part de la masse de patrimoine brut détenue (tableau complémentaire 5) : contrôle de la reconstitution
    masseTop: { top1: 0.15, top5: 0.34, top10: 0.48, top25: 0.72, top50: 0.93 },
    // patrimoine brut moyen par quartile de niveau de vie (figure 3b) : sert à la part de l'assiette éligible au paiement différé
    quartilesNiveauVie: [118000, 192200, 312800, 874600]
  };
  HVP.alphaPareto = Math.log(5) / Math.log(HVP.p99 / HVP.seuils[10][1]);   // ≈ 1,85 : queue de Pareto au-delà de P95, calée sur P95 et P99

  // ---- Hypothèses ------------------------------------------------------------------------------------------------------------------------------
  /** φ : part des actions et parts de fonds dans le patrimoine financier, par tranche (H504 ; moyenne nationale (1 745 + 409) / 7 096 = 30 %). */
  var PHI = [0.03, 0.03, 0.03, 0.05, 0.08, 0.10, 0.10, 0.12, 0.15, 0.25, 0.40, 0.55];
  // H506 corrigé le 04/11/2026 (V7304 ✅ ; relevé V12400) : part des actions cotées dans les « actions et autres participations hors OPC » des ménages = 14,9 % (Banque de France, « Épargne des ménages » T4 2025 : 263,3 / 1 770,7 Md€) ; l'ancienne plage 20 / 25 / 30 % était au-dessus du réel. 0,15 aux trois scénarios (fait mesuré, pas une fourchette ; T4 2024 : 18,2 %).
  // H508 corrigé le 04/11/2026 (V7305, V12530-V12533 ; sources/taxe-1pc-fiabilisation.md § 1.3 ; V12420) : rendement locatif NET DE CHARGES ET DE TAXE FONCIÈRE 1,7 / 2,0 / 2,7 % (ancien 3,0 / 3,5 / 4,5 %, supérieur au rendement BRUT national mesuré : loyers 310,5 Md€ pour ≈ 9 900 Md€ de logements ≈ 3,0-3,1 %, Insee). ⚠️ la part de charges hors taxe foncière (15 / 25 / 35 %) est une hypothèse sans source primaire (V12533). Érosion (H510) inchangée.
  var PARAM = {
    bas:     { valImmo: 0.92, valTerres: 0.85, partCotees: 0.15, valNonCotees: 0.65, capitalisation: 0.75, rendementLocatif: 0.017,
               erosionTop: 0.74, erosionReste: 0.30, erosionFin: 0.15, coutGestion: 0.020, recours: 0.60, recouvrement: 0.90 },
    central: { valImmo: 0.96, valTerres: 0.90, partCotees: 0.15, valNonCotees: 0.80, capitalisation: 0.50, rendementLocatif: 0.020,
               erosionTop: 0.40, erosionReste: 0.15, erosionFin: 0.08, coutGestion: 0.010, recours: 0.45, recouvrement: 0.95 },
    haut:    { valImmo: 1.00, valTerres: 0.95, partCotees: 0.15, valNonCotees: 0.90, capitalisation: 0.25, rendementLocatif: 0.027,
               erosionTop: 0.20, erosionReste: 0.05, erosionFin: 0.03, coutGestion: 0.005, recours: 0.30, recouvrement: 1.00 }
  };
  var COMMUN = {
    taux: 0.01,                 // proposition de l'auteur
    partTop1Mobile: 0.50,       // H509 : part des actions et parts de fonds des ménages détenue par le 1 % le mieux doté (68 % du professionnel, 25 % du financier : IF371)
    partExil: 20 / 74,          // H512 : part de l'érosion due aux départs (Scandinavie, cité par le CAE, Focus 118 : 20 c d'exil sur 74 c de perte)
    rK: 0.03, tPlat: 0.35, tH: 0.5, fuiteH: 0.31, horizonH: 30,   // H513 : autres impôts perdus par euro de patrimoine parti
    eligibleDiffere: null,      // calculé : part du patrimoine brut des ménages sous la médiane de niveau de vie (H516)
    nQuantiles: 2000,
    chocKrach: -0.20, anneesKrach: 3, dureeDetention: 10, ecartAbsMoyen: 0.25   // H520-H522
  };
  COMMUN.externalite = COMMUN.rK * COMMUN.tPlat + COMMUN.tH * (1 - COMMUN.fuiteH) / COMMUN.horizonH;   // ≈ 2,2 % par an
  COMMUN.eligibleDiffere = (HVP.quartilesNiveauVie[0] + HVP.quartilesNiveauVie[1]) / (HVP.quartilesNiveauVie[0] + HVP.quartilesNiveauVie[1] + HVP.quartilesNiveauVie[2] + HVP.quartilesNiveauVie[3]);

  // ---- Assiettes (comptes nationaux, Md€) ------------------------------------------------------------------------------------------------------
  /**
   * Composantes d'une assiette : immo (logements, autres bâtiments, terrains bâtis), terres (autres actifs non produits), actions (hors OPC), opc,
   * autresFin (assurance-vie, dépôts… selon la variante), dettes (déduites de l'immobilier pour les variantes nettes). H501-H502.
   */
  var ASSIETTES = {
    pierre:    { libelle: 'immobilier + terres + actions et parts de fonds, brut (proposition de l\'auteur, référence)', av: false, depots: false, net: false },
    pierreNet: { libelle: 'idem, net des crédits des ménages (1 768 Md€)', av: false, depots: false, net: true },
    pierreAV:  { libelle: 'idem + assurance-vie et droits à pension, brut', av: true, depots: false, net: false },
    large:     { libelle: 'tout le patrimoine brut (dépôts et livrets compris, hors autres comptes à recevoir)', av: true, depots: true, net: false },
    largeNet:  { libelle: 'tout le patrimoine net (14 953 Md€)', av: true, depots: true, net: true }
  };
  function composantes(nom) {
    var a = ASSIETTES[nom]; if (!a) throw new Error('assiette inconnue : ' + nom);
    var c = { immo: CN.logements + CN.autresBatiments + CN.terrainsBatis, terres: CN.autresNonProduits, actions: CN.actionsHorsOpc, opc: CN.opc, autresFin: 0, dettes: 0 };
    if (a.av) c.autresFin += CN.assuranceVie + CN.droitsPension;
    if (a.depots) c.autresFin += CN.depots + CN.titresCreance + CN.creditsActif + CN.machines + CN.stocks + CN.autresProduits;
    if (a.net) c.dettes = a.depots ? CN.passifs + CN.autresComptesRecevoir : CN.credits;   // largeNet : on retrouve 14 953 (autres comptes à recevoir retirés de l'actif)
    c.total = c.immo + c.terres + c.actions + c.opc + c.autresFin - c.dettes;
    return c;
  }

  // ---- Distribution (enquête HVP) --------------------------------------------------------------------------------------------------------------
  /** Patrimoine brut au quantile p : interpolation linéaire des seuils jusqu'à P95, Pareto au-delà (α calé sur P95 et P99). */
  function brutQuantile(p) {
    var s = HVP.seuils, i;
    if (p >= 0.95) return s[10][1] * Math.pow(0.05 / (1 - p), 1 / HVP.alphaPareto);
    for (i = 1; i < s.length; i++) if (p <= s[i][0]) return s[i - 1][1] + (s[i][1] - s[i - 1][1]) * (p - s[i - 1][0]) / (s[i][0] - s[i - 1][0]);
    return s[10][1];
  }
  function tranche(p) { for (var i = 0; i < HVP.tranches.length; i++) if (p < HVP.tranches[i][0]) return i; return HVP.tranches.length - 1; }
  var _pop = {};
  /**
   * Population discrétisée en n quantiles : pour chaque ménage type, patrimoine brut W, part taxable immobilière et « mobile » selon l'assiette.
   * immo = immobilier (HVP) ; mobile = professionnel + φ × financier (pierre) ou professionnel + financier (variantes avec assurance-vie / dépôts, H503) ; dettes = emprunts.
   */
  function population(nom) {
    if (_pop[nom]) return _pop[nom];
    var a = ASSIETTES[nom], n = COMMUN.nQuantiles, out = [], i, p, W, t, k;
    for (i = 0; i < n; i++) {
      p = (i + 0.5) / n; W = brutQuantile(p); k = tranche(p); t = HVP.tranches[k];
      var fin = t[2] / 100, finTax = a.depots ? fin : (a.av ? Math.min(fin, PHI[k] + 0.30 * fin) : PHI[k] * fin);   // assurance-vie ≈ 30 % du financier en plus (2 090 / 7 096, H503)
      var im = W * t[1] / 100, mob = W * (t[3] / 100 + finTax) + (a.depots ? W * t[4] / 100 : 0), det = a.net ? W * t[5] / 100 : 0;
      var exces = Math.min(0, im - det);                                   // dettes supérieures à l'immobilier : imputées sur le reste
      out.push({ p: p, k: k, W: W, immo: Math.max(0, im - det), mobile: Math.max(0, mob + exces), dettes: det });
    }
    _pop[nom] = out; return out;
  }
  /** Moyenne reconstituée du patrimoine brut (contrôle : 374 900 €) et part de la masse détenue par le haut de la distribution. */
  function controleDistribution() {
    var P = population('pierre'), s = 0, top = { top1: 0, top5: 0, top10: 0, top25: 0, top50: 0 };
    P.forEach(function (m) { s += m.W; if (m.p >= 0.99) top.top1 += m.W; if (m.p >= 0.95) top.top5 += m.W; if (m.p >= 0.9) top.top10 += m.W; if (m.p >= 0.75) top.top25 += m.W; if (m.p >= 0.5) top.top50 += m.W; });
    Object.keys(top).forEach(function (k) { top[k] /= s; });
    return { moyenne: s / P.length, masse: top };
  }
  /**
   * Part de l'assiette immobilière et mobile retirée par un abattement A (€ par ménage, sur la valeur taxable). Calculée sur la distribution HVP NON recalée :
   * on suppose que le patrimoine manquant dans l'enquête (comptes nationaux 1,4 fois plus élevés) se répartit comme le patrimoine observé ; il est en réalité
   * plus concentré en haut, donc l'abattement retire en vrai un peu moins (choix prudent, H505). L'abattement est imputé au prorata de la composition du ménage.
   */
  function partAbattement(nom, A) {
    var P = population(nom), sI = 0, sM = 0, rI = 0, rM = 0;
    P.forEach(function (m) {
      var T = m.immo + m.mobile; sI += m.immo; sM += m.mobile;
      if (T > 0 && A > 0) { var r = Math.min(T, A); rI += r * m.immo / T; rM += r * m.mobile / T; }
    });
    return { immo: sI > 0 ? rI / sI : 0, mobile: sM > 0 ? rM / sM : 0, total: (rI + rM) / (sI + sM), ménagesExoneres: P.filter(function (m) { return m.immo + m.mobile <= A; }).length / P.length };
  }

  // ---- Recette --------------------------------------------------------------------------------------------------------------------------------
  /**
   * Effet de prix (capitalisation) : la hausse de l'impôt annuel sur l'immobilier par rapport à aujourd'hui (1 % − taxe foncière moyenne des ménages,
   * 26,2 / 9 696 ≈ 0,27 %) se capitalise en partie dans les prix : Δprix = −cap × Δτ / (rendement locatif + τ actuel) (modèle d'actualisation, H507-H508).
   */
  function effetPrix(sc, taux) {
    var p = PARAM[sc], base = CN.logements + CN.autresBatiments + CN.terrainsBatis + CN.autresNonProduits, tf = RECETTES.tfMenages / base;
    return -p.capitalisation * Math.max(0, taux - tf) / (p.rendementLocatif + tf);
  }
  /**
   * Recette nette (Md€/an, croisière) d'une variante o = { assiette ('pierre'), abattement (€ par ménage, 0), differe (false : paiement différé des ménages
   * sous la médiane de niveau de vie), avecReformeImmo (true : DMTO déjà déduits par la réforme immobilière), taux (0,01), annee1 (false : recouvrement du différé pas encore commencé) }.
   */
  function recette(sc, o) {
    o = o || {};
    var p = PARAM[sc], C = COMMUN, taux = o.taux === undefined ? C.taux : o.taux, nom = o.assiette || 'pierre', c = composantes(nom), A = o.abattement || 0;
    var dp = effetPrix(sc, taux), ab = partAbattement(nom, A);
    var immoNet = c.immo - c.dettes, immo = Math.max(0, immoNet) * p.valImmo * (1 + dp), terres = c.terres * p.valTerres * (1 + dp);
    var mobileAvant = c.actions * p.partCotees + c.opc + c.actions * (1 - p.partCotees) * p.valNonCotees + Math.min(0, immoNet);
    var echelle = taux / 0.01;                                                            // érosions calibrées pour 1 %, proportionnelles au taux (H510)
    var eros = Math.min(1, echelle * (C.partTop1Mobile * p.erosionTop + (1 - C.partTop1Mobile) * p.erosionReste)), erosFin = Math.min(1, echelle * p.erosionFin);
    var mobile = mobileAvant * (1 - eros), autres = c.autresFin * (1 - erosFin);
    var baseImmo = (immo + terres) * (1 - ab.immo), baseMob = (mobile + autres) * (1 - ab.mobile);
    var brute = taux * (baseImmo + baseMob);
    var exil = C.partExil * (eros * mobileAvant + erosFin * c.autresFin) * (1 - ab.mobile) * C.externalite;   // autres impôts perdus sur le patrimoine parti
    var gestion = p.coutGestion * brute;
    var differe = o.differe ? brute * C.eligibleDiffere * p.recours : 0;                  // recettes reportées chaque année
    var perteDiffere = o.differe ? differe * (o.annee1 ? 1 : 1 - p.recouvrement) : 0;    // croisière : seule la part non recouvrée est perdue
    var dmto = o.avecReformeImmo === false ? RECETTES.dmto[sc] : 0;
    var nette = brute - exil - gestion - perteDiffere - dmto;
    return { scenario: sc, assiette: nom, abattement: A, comptable: taux * c.total, effetPrix: dp, partAbattement: ab, baseImmo: baseImmo, baseMobile: baseMob,
             erosionMobile: eros, brute: brute, exil: exil, gestion: gestion, differe: differe, perteDiffere: perteDiffere, dmto: dmto, nette: nette };
  }
  function recettes(o) { var r = {}; SCS.forEach(function (s) { r[s] = recette(s, o).nette; }); return r; }

  // ---- Volatilité : krach et régularisation à la vente -----------------------------------------------------------------------------------------
  /**
   * Krach immobilier (choc −20 % par défaut, trois années) : avec un indice LOCAL (recommandation du dossier reventes), la valeur annuelle suit le marché :
   * perte = taux × base immobilière × |choc| par année ; avec un indice IPC, la valeur annuelle ne baisse pas mais chaque vente pendant le krach est remboursée :
   * borne haute = volume des ventes × 0,75 × taux × |choc| × durée de détention (surestimation appliquée à toute la détention). volumeVentes : Md€/an (DVF 2024 : 185).
   */
  function krach(sc, o, volumeVentes) {
    o = o || {}; var r = recette(sc, o), C = COMMUN, taux = o.taux === undefined ? C.taux : o.taux, choc = Math.abs(o.choc === undefined ? C.chocKrach : o.choc);
    var V = volumeVentes || 185.2, local = taux * r.baseImmo * choc, ipc = V * 0.75 * taux * choc * C.dureeDetention;
    return { indiceLocalParAn: local, indiceLocalTotal: local * C.anneesKrach, indiceIpcRemboursementsParAn: ipc, reserveConseillee: local * C.anneesKrach,
             partRecette: local / r.brute };
  }
  /** Flux bruts de régularisation en temps normal (indice local, centrés) : chaque sens ≈ volume × taux × E|écart| / 2 × durée de détention (H521-H522). */
  function regularisation(volumeVentes, taux) {
    var V = volumeVentes || 185.2, t = taux === undefined ? COMMUN.taux : taux, f = V * t * COMMUN.ecartAbsMoyen / 2 * COMMUN.dureeDetention;
    return { complements: f, remboursements: f, net: 0 };
  }

  // ---- Qui paie --------------------------------------------------------------------------------------------------------------------------------
  /** Impôt moyen par ménage (€/an) par dixième de patrimoine brut (HVP, valeurs de l'enquête non recalées, sans comportement) et part du total. */
  function parTranche(o) {
    o = o || {}; var nom = o.assiette || 'pierre', A = o.abattement || 0, taux = o.taux === undefined ? COMMUN.taux : o.taux, P = population(nom);
    var noms = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'P90-95', 'P95-99', 'top 1 %'], acc = noms.map(function (n) { return { tranche: n, n: 0, impot: 0, brut: 0 }; }), tot = 0;
    P.forEach(function (m) { var T = Math.max(0, m.immo + m.mobile - A) * taux; acc[m.k].n++; acc[m.k].impot += T; acc[m.k].brut += m.W; tot += T; });
    return acc.map(function (a) { return { tranche: a.tranche, patrimoineBrutMoyen: a.brut / a.n, impotMoyen: a.impot / a.n, partDuTotal: tot > 0 ? a.impot / tot : 0, tauxSurBrut: a.brut > 0 ? a.impot / a.brut : 0 }; });
  }
  /**
   * Cas type : { valeurImmo, dettes, actions, depots, revenuMensuel } → impôt annuel (€), part du revenu, taxe foncière moyenne équivalente actuelle
   * (taux moyen des ménages : 26,2 Md€ / 9 696 Md€ d'immobilier et terres ≈ 0,27 %, estimation, pas la taxe réelle du bien).
   */
  function casType(m, o) {
    o = o || {}; var a = ASSIETTES[o.assiette || 'pierre'], taux = o.taux === undefined ? COMMUN.taux : o.taux, A = o.abattement || 0;
    var base = (m.valeurImmo || 0) + (m.actions || 0) + (a.depots ? (m.depots || 0) : 0) + (a.av ? (m.assuranceVie || 0) : 0) - (a.net ? (m.dettes || 0) : 0);
    var impot = Math.max(0, base - A) * taux, rev = 12 * (m.revenuMensuel || 0);
    var tf = (m.valeurImmo || 0) * RECETTES.tfMenages / (CN.logements + CN.autresBatiments + CN.terrainsBatis + CN.autresNonProduits);
    return { base: base, impot: impot, partRevenu: rev > 0 ? impot / rev : null, tfEquivalente: tf, multipleTf: tf > 0 ? impot / tf : null };
  }

  var API = { SCS: SCS, CN: CN, SOCIETES: SOCIETES, RECETTES: RECETTES, HVP: HVP, PHI: PHI, PARAM: PARAM, COMMUN: COMMUN, ASSIETTES: ASSIETTES,
    composantes: composantes, brutQuantile: brutQuantile, population: population, controleDistribution: controleDistribution, partAbattement: partAbattement,
    effetPrix: effetPrix, recette: recette, recettes: recettes, krach: krach, regularisation: regularisation, parTranche: parTranche, casType: casType };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.TaxePatrimoine = API;
})(this);
