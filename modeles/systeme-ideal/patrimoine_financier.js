/*
 * modeles/systeme-ideal/patrimoine_financier.js — T56 (suite), fiscalité du patrimoine FINANCIER du système idéal (03/11/2026).
 * Règle de l'auteur (positions des 25/10 et 02/11/2026 sur les plus-values et le prélèvement unique) chiffrée ici pour les autres actifs :
 *   (1) toutes les plus-values et tous les revenus du capital sont taxés comme un revenu normal, dans le prélèvement unique, au taux de 50 % ;
 *   (2) une perte ouvre un crédit d'impôt de 50 % REPORTABLE sur l'impôt futur, jamais remboursé (durée de report bornée ou non).
 * Actifs : dividendes et plus-values de portefeuille (PFU 31,4 % depuis 2026), assurance-vie (produits au rachat ; capitaux décès en variante), PEA, PER, cession d'entreprise
 * (150-0 B ter, abattements 150-0 D ter), plus-values professionnelles, crypto-actifs. Gabarit de patrimoine_immobilier.js : fonctions pures, scénarios bas / central / haut,
 * « bas » = hypothèses les MOINS favorables au solde public. Unités : Md€ par an en régime de croisière (euros 2024-2025 selon la source), ratios sans unité.
 * Aucune dépendance (ni DVF ni palier 1). Ordres de grandeur, jamais des prédictions. methode.md § 26 (H288 à H330), resultats.md § 24, V5510-V5549.
 * Choix de modèle important (décision de l'auteur du 03/11/2026, Q4) : base RÉELLE par défaut (prix d'achat indexé sur l'inflation, comme pour l'immobilier) ; la base NOMINALE reste une variante de comparaison, `reel: false`.
 */
(function (root) {
  'use strict';
  var SC = ['bas', 'central', 'haut'];

  // ---- Constantes sourcées -------------------------------------------------------------------------------------------------------------------
  var CONST = {
    tauxPrelevement: 0.50,           // décision de l'auteur
    tPFUir: 0.128, tPS: 0.186,       // PFU 2026 : 12,8 % d'impôt + 18,6 % de prélèvements sociaux = 31,4 % (CSS L136-8 I 2° : CSG 10,6 % ; V6000, V6005, V6006). Dividendes, intérêts, plus-values mobilières et de cession d'entreprise, crypto, gains de PEA et de PER.
    tPSAV: 0.172,                    // assurance-vie : CSG maintenue à 9,2 % (L136-8 IV 4° renvoie au 3° du II de L136-7), donc 17,2 % ; idem épargne logement, PEP, plus-values immobilières (IV 1°-5°) ; avant : 17,2 % partout (V6000)
    // Dépenses fiscales 2025 (Md€), Voies et moyens tome II, PLF 2026 (PDF lu, $DONNEES/sources/depenses_fiscales/VM-T2-2026.pdf)
    depFiscale: {
      abattementRetraiteDirigeants: 0.078,   // 150515 (150-0 D ter), 2024 : 84 M€, 2025 : 78 M€, 2026 : 75 M€ ; 3 578 bénéficiaires
      abattementPmeJeunes: 0.152,            // 150518 (150-0 D 1 quater), 2025 : 152 M€ ; 7 473 ménages
      exoPvPro: 0.085,                       // 190208 (151 septies A), 85 M€ ; 3 190 entreprises
      assuranceVie: 0.595,                   // 140119 (125-0 A), 2025 : 595 M€ (norme : barème de l'IR), ordre de grandeur
      peaDividendes: 0.487,                  // 140117, 2025 : 487 M€ (norme : barème), ordre de grandeur
      peaPlusValues: 0.101,                  // 150708, 2025 : 101 M€ (norme : absence d'exonération), ordre de grandeur
      sortieCapitalRetraite: 0.379           // 120508 (PFU 12,8 % ou 7,5 % sur sorties en capital), 2026 : 379 M€ ; 78 156 ménages
    },
    dividendes2020: 23.6, dividendes2019: 24.2,   // France Stratégie, via moteur de recherche (V5511 : non lu dans le rapport)
    pvMobilieres2020: 15,                         // plus-values mobilières déclarées 2020, comité d'évaluation (3e rapport), via moteur (V5511)
    assuranceVieEncours2025: 2107,                // France Assureurs, fin 2025 (V5512 : via presse)
    assuranceVieCotisations2025: 192.1, assuranceVieCollecteNette2025: 50.6, assuranceViePrestations2025: 141.4, // idem
    assuranceVieDuree: 12.8,                      // durée moyenne de détention (années), France Assureurs, via presse
    prelevement990I: 0.458,                       // Md€ 2024, Insee (sources/donnees/impots_inventaire.csv, ligne 21)
    peaEncoursTitres2025: 126.5, peaEncoursEspeces2025: 14.2,   // Banque de France (titres) ; espèces : source secondaire (V5513)
    perEncours2025: 150.4,                        // Bercy, 17/05/2026, via presse (V5512)
    cryptoDeclare: { 2021: 0.400, 2023: 0.1508, 2024: 0.368 }, // plus-values nettes déclarées, Md€ (DGFiP via presse, V5514) ; 24 000 déclarants en 2024
    cryptoChainalysis2021: 3.5,                   // gains nets estimés 2021 en France, Chainalysis (inclut les échanges crypto-crypto ; V5514)
    inflation: 0.02                               // même hypothèse que patrimoine_immobilier.js (H249)
  };

  // ---- Hypothèses par scénario (methode.md § 26) ---------------------------------------------------------------------------------------------
  // Chaque actif porte : N (assiette nette observée ou reconstituée, Md€/an), ρ (pertes / gains bruts), ε (élasticité de la base à la part nette 1 − t), η (fuite : non-résidence, enveloppes étrangères).
  var PARAM = {
    bas: {
      dividendes: { N: 23.6, eps: 1.5, eta: 0.05 },                        // H288-H289
      portefeuille: { N: 15, rho: 0.35, eps: 2.0, eta: 0.05, recolte: 0.30, partEntreprise: 0.55 },   // H290-H294
      av: { prestations: 141.4, partDeces: 0.20, gain: 0.20, tauxIR: 0.09, eps: 1.0, eta: 0.10 },      // H295-H299
      avDeces: { gainLatent: 0.30, anticipation: 0.30 },                   // H300
      pea: { N: 2.0, eps: 1.0, eta: 0.05 },                                // H301-H302
      per: { versements: 14, sorties: 4, tauxEntree: 0.28, tauxSortie: 0.22, baisseVersements: 0.25 },  // H303-H306
      entreprise: { rho: 0.05, eps: 2.5, eta: 0.15 },                      // H307-H309
      pro: { N: 2, rho: 0.05, eps: 2.5, eta: 0.10 },                       // H310
      crypto: { N: 0.368, rho: 0.60, eps: 2.0, eta: 0.40, recolte: 0.40, fraude: 0.50 }               // H311-H314
    },
    central: {
      dividendes: { N: 24.2, eps: 1.0, eta: 0.03 },
      portefeuille: { N: 20, rho: 0.25, eps: 1.0, eta: 0.03, recolte: 0.15, partEntreprise: 0.55 },
      av: { prestations: 141.4, partDeces: 0.20, gain: 0.25, tauxIR: 0.07, eps: 0.5, eta: 0.06 },
      avDeces: { gainLatent: 0.35, anticipation: 0.15 },
      pea: { N: 3.0, eps: 0.5, eta: 0.03 },
      per: { versements: 12, sorties: 5, tauxEntree: 0.32, tauxSortie: 0.18, baisseVersements: 0.50 },
      entreprise: { rho: 0.03, eps: 1.5, eta: 0.08 },
      pro: { N: 3, rho: 0.03, eps: 1.5, eta: 0.05 },
      crypto: { N: 1.0, rho: 0.40, eps: 1.0, eta: 0.25, recolte: 0.20, fraude: 0.25 }
    },
    haut: {
      dividendes: { N: 28, eps: 0.5, eta: 0.01 },
      portefeuille: { N: 25, rho: 0.15, eps: 0.5, eta: 0.01, recolte: 0.0, partEntreprise: 0.55 },
      av: { prestations: 141.4, partDeces: 0.20, gain: 0.30, tauxIR: 0.05, eps: 0.3, eta: 0.02 },
      avDeces: { gainLatent: 0.40, anticipation: 0.05 },
      pea: { N: 4.6, eps: 0.3, eta: 0.01 },
      per: { versements: 10, sorties: 6, tauxEntree: 0.35, tauxSortie: 0.14, baisseVersements: 0.75 },
      entreprise: { rho: 0.02, eps: 0.8, eta: 0.03 },
      pro: { N: 4, rho: 0.02, eps: 0.8, eta: 0.02 },
      crypto: { N: 3.5, rho: 0.25, eps: 0.5, eta: 0.10, recolte: 0.0, fraude: 0.10 }
    }
  };
  // Paramètres communs aux trois scénarios
  var COMMUN = {
    uActuel: 0.85,            // H315 : part des moins-values aujourd'hui imputée (PFU : report 10 ans, sur plus-values seulement ; assiette observée = gains NETS)
    // Imputation des crédits dans le système idéal (le crédit s'impute sur TOUT impôt futur : plus de capacité qu'aujourd'hui) ; même forme que H255-H256 de l'immobilier
    absorption: { bas: 0.95, central: 0.85, haut: 0.70 },   // H316
    lambda: { bas: 0.25, central: 0.18, haut: 0.10 },       // H317 : probabilité annuelle d'imputation
    fraude: { bas: 0.15, central: 0.05, haut: 0.0 },        // H318 : pertes fabriquées (hors crypto)
    T: 10,                    // H319 : durée de report par défaut (années), comme l'immobilier
    // Base réelle (DÉFAUT depuis le 03/11/2026 ; `reel: false` = variante nominale) : rendement nominal r et durée de détention d de la classe d'actifs
    reel: { portefeuille: { r: 0.07, d: 8 }, av: { r: 0.04, d: 12.8 }, pea: { r: 0.07, d: 8 }, entreprise: { r: 0.10, d: 10 }, pro: { r: 0.08, d: 12 }, crypto: { r: 0.30, d: 2 } },  // H320
    // Krach (option) : gains × 0,3, pertes × 3 une année de baisse des marchés de 30 %
    krach: { gains: 0.3, pertes: 3 },                       // H321
    // Retraites : inflation de la base de la sortie PER sans objet (revenu normal)
    nominalParDefaut: false   // depuis le 03/11/2026 (décision de l'auteur, Q4) : base réelle par défaut
  };

  // ---- Outils --------------------------------------------------------------------------------------------------------------------------------
  /** Rapport gain réel / gain nominal pour une détention de d années à rendement nominal r et inflation pi : (1 − ((1+pi)/(1+r))^d) / (1 − (1+r)^−d). */
  function reelFactor(r, d, pi) {
    pi = pi === undefined ? CONST.inflation : pi;
    var nom = 1 - Math.pow(1 + r, -d), reel = 1 - Math.pow((1 + pi) / (1 + r), d);
    return nom > 0 ? Math.max(0, reel / nom) : 1;
  }
  /** Part des crédits finalement imputée en fonction de la durée de report T (Infinity = sans limite) : absorption × (1 − e^(−λT)). */
  function partImputee(sc, T) { var a = COMMUN.absorption[sc]; return T === Infinity ? a : a * (1 - Math.exp(-COMMUN.lambda[sc] * T)); }
  /** Taux qui maximise la recette t (1 − t)^ε d'une assiette de forme B0 (1 − t)^ε : t* = 1 / (1 + ε). */
  function tauxMaximisantRecette(eps) { return 1 / (1 + eps); }
  /** Valeur actuelle d'un stock de gains reportés S (Md€), taxé une fois à t si la part φ du stock devient imposable à la fin du report. */
  function stockReport(S, phi, t) { return (t === undefined ? CONST.tauxPrelevement : t) * S * phi; }

  /**
   * Bloc générique d'un actif dont l'assiette est une plus-value ou un revenu réalisé.
   * s : { N, rho, tauA, eps, f, eta, recolte, fraude, titre } ; N = assiette nette observée aujourd'hui (gains − pertes imputées), taxée au taux effectif actuel tauA.
   * Actuel : tauA × N. Système idéal : gains bruts G = N / (1 − ρ uA) ; base réformée = G × f × m × (1 − η) avec m = ((1 − t)/(1 − tauA))^ε (m ≤ 1) ;
   *   recette brute = t × base ; crédits créés = t × L × (1 + récolte) × (1 + fraude) avec L = ρ G ; coût = crédits × part imputée (T) ; recette nette = brute − coût.
   * o : { T, t, reel (défaut true : f calculé ; false : base nominale), sansComportement }.
   */
  function bloc(sc, s, o) {
    o = o || {};
    var t = o.t === undefined ? CONST.tauxPrelevement : o.t, T = o.T === undefined ? COMMUN.T : o.T, rho = s.rho || 0, f = s.f === undefined ? 1 : s.f;
    var G = s.N / (1 - rho * COMMUN.uActuel), L = rho * G;
    var m = o.sansComportement ? 1 : Math.min(1, Math.pow((1 - t) / (1 - s.tauA), s.eps));
    var eta = o.sansComportement ? 0 : s.eta || 0, base = G * f * m * (1 - eta);
    var brute = t * base, fraude = s.fraude === undefined ? COMMUN.fraude[sc] : s.fraude, recolte = o.sansComportement ? 0 : s.recolte || 0;
    var credits = t * L * (1 + recolte) * (1 + fraude), u = partImputee(sc, T), cout = credits * u, nette = brute - cout, actuel = s.actuel !== undefined ? s.actuel : s.tauA * s.N;
    return { titre: s.titre || '', N: s.N, tauA: s.tauA, gainsBruts: G, pertes: L, facteurReel: f, multComportement: m, fuite: eta, base: base, recettesActuelles: actuel, recettesBrutes: brute,
             creditsCrees: credits, partImputee: u, coutCredits: cout, recettesNettes: nette, recettesNouvelles: nette - actuel, tauxEffectifNouveau: s.N > 0 ? nette / s.N : 0,
             recetteMaxAuTaux: t, tauxMaximisant: tauxMaximisantRecette(s.eps) };
  }
  function fR(cle, o) { return !o || o.reel !== false ? reelFactor(COMMUN.reel[cle].r, COMMUN.reel[cle].d) : 1; }

  // ---- Actifs --------------------------------------------------------------------------------------------------------------------------------
  /** Dividendes perçus par les ménages (PFU 31,4 % aujourd'hui, 50 % demain). Revenu, pas plus-value : base nominale. L'IS n'est pas traité ici (voir limites). */
  function dividendes(sc, o) {
    var p = PARAM[sc].dividendes;
    return bloc(sc, { titre: 'Dividendes', N: p.N, rho: 0, tauA: CONST.tPFUir + CONST.tPS, eps: p.eps, eta: p.eta }, o);
  }
  /** Part des plus-values mobilières (assiette nette totale) issue des cessions d'entreprise ; le reste est le portefeuille. */
  function partEntreprise(sc) { return PARAM[sc].portefeuille.partEntreprise; }
  /** Plus-values de portefeuille (titres cotés, hors PEA et assurance-vie, hors cessions d'entreprise). */
  function portefeuille(sc, o) {
    var p = PARAM[sc].portefeuille;
    return bloc(sc, { titre: 'Plus-values de portefeuille', N: p.N * (1 - p.partEntreprise), rho: p.rho, tauA: CONST.tPFUir + CONST.tPS, eps: p.eps, eta: p.eta, recolte: p.recolte, f: fR('portefeuille', o) }, o);
  }
  /** Cessions d'entreprise (titres de sociétés par leurs dirigeants et fondateurs). Taux actuel effectif : 31,4 % moins les abattements 150-0 D ter et 150-0 D 1 quater. */
  function cessionEntreprise(sc, o) {
    var pp = PARAM[sc].portefeuille, p = PARAM[sc].entreprise, N = pp.N * pp.partEntreprise;
    var tauA = CONST.tPFUir + CONST.tPS - (CONST.depFiscale.abattementRetraiteDirigeants + CONST.depFiscale.abattementPmeJeunes) / N;
    var r = bloc(sc, { titre: 'Cessions d\'entreprise (titres)', N: N, rho: p.rho, tauA: tauA, eps: p.eps, eta: p.eta, recolte: 0, f: fR('entreprise', o) }, o);
    r.reportSupprime = 'Effet de croisière nul (entrées ≈ sorties du report) ; gain unique sur le stock : voir stockReport(S, φ).';
    return r;
  }
  /** Plus-values professionnelles hors titres (actifs de l'entreprise individuelle ; exonération 151 septies A conservée dans l'assiette observée). */
  function plusValuesPro(sc, o) {
    var p = PARAM[sc].pro;
    return bloc(sc, { titre: 'Plus-values professionnelles', N: p.N, rho: p.rho, tauA: CONST.tPFUir + CONST.tPS, eps: p.eps, eta: p.eta, f: fR('pro', o) }, o);
  }
  /** Assurance-vie : produits réalisés au rachat. Assiette = prestations hors décès × part de gains ; taux actuel = PS 17,2 % (CONST.tPSAV) + IR moyen (7,5 % après 8 ans, abattement annuel). */
  function assuranceVie(sc, o) {
    var p = PARAM[sc].av, rachats = p.prestations * (1 - p.partDeces), N = rachats * p.gain;
    var r = bloc(sc, { titre: 'Assurance-vie (rachats)', N: N, rho: 0, tauA: CONST.tPSAV + p.tauxIR, eps: p.eps, eta: p.eta, f: fR('av', o) }, o);
    r.rachats = rachats; r.depenseFiscaleRef = CONST.depFiscale.assuranceVie;
    return r;
  }
  /**
   * Assurance-vie au décès. Défaut depuis le 03/11/2026 (décision de l'auteur, Q5) : fin de la purge, les gains latents des capitaux décès sont taxés (variante « gains latents ») ; variante `deces: 'statuQuo'` : 990 I (0,458 Md€ en 2024, Insee) et 757 B conservés, purge maintenue (nouvelles recettes = 0). Gains latents
   * taxés à 50 % (plus de purge des plus-values par le décès), net de l'anticipation (rachat ou donation avant le décès) ; 990 I conservé.
   */
  function assuranceVieDeces(sc, o) {
    o = o || {};
    var p = PARAM[sc].av, d = PARAM[sc].avDeces, t = o.t === undefined ? CONST.tauxPrelevement : o.t, capitaux = p.prestations * p.partDeces;
    var f = fR('av', o), gains = capitaux * d.gainLatent, base = gains * f * (1 - d.anticipation) * (1 - p.eta);   // f : base réelle par défaut (03/11/2026) ; reel: false = gain nominal
    return { capitauxDeces: capitaux, gainsLatents: gains, prelevement990I: CONST.prelevement990I, statuQuo: { recettesNouvelles: 0 },
             gainsLatentsTaxes: { base: base, recettes: t * base, recettesNouvelles: t * base }, recettesNouvelles: o.deces === 'statuQuo' ? 0 : t * base };
  }
  /** PEA : gains imposés aujourd'hui aux PS seulement (18,6 % en 2026, L136-8 I 2° ; IV n'exclut pas le 5° du II de L136-7 ; V6005) à la sortie après 5 ans ; demain 50 % à la sortie. Assiette : gains de sortie (⚠️ reconstituée). */
  function pea(sc, o) {
    var p = PARAM[sc].pea;
    var r = bloc(sc, { titre: 'PEA', N: p.N, rho: 0, tauA: CONST.tPS, eps: p.eps, eta: p.eta, f: fR('pea', o) }, o);
    r.avantageEnveloppe = { depenseDividendes: CONST.depFiscale.peaDividendes, depensePlusValues: CONST.depFiscale.peaPlusValues, baseImpliciteIR: (CONST.depFiscale.peaDividendes + CONST.depFiscale.peaPlusValues) / CONST.tPFUir };
    return r;
  }
  /**
   * PER : déduction à l'entrée au taux marginal moyen des déducteurs, imposition à la sortie. Flux annuel à stock donné (le régime de croisière « jeune » : versements > sorties).
   * Actuel : solde = tauxSortie × S − tauxEntree × V. Système idéal : déduction à 50 % des versements restants V' = V (1 − baisse), sortie taxée à 50 % : solde = 50 % × S − 50 % × V'.
   * Les sorties S ne bougent pas à court terme (stock) ; la baisse des versements vient de la disparition de l'avantage de taux (déduit à 50 %, repris à 50 %).
   */
  function per(sc, o) {
    o = o || {};
    var p = PARAM[sc].per, t = o.t === undefined ? CONST.tauxPrelevement : o.t, V = p.versements, S = p.sorties, V2 = V * (1 - p.baisseVersements);
    var actuel = p.tauxSortie * S - p.tauxEntree * V, reforme = t * S - t * V2;
    return { titre: 'PER', versements: V, sorties: S, versementsReforme: V2, coutDeductionActuel: p.tauxEntree * V, recetteSortieActuelle: p.tauxSortie * S,
             soldeActuel: actuel, coutDeductionReforme: t * V2, recetteSortieReforme: t * S, soldeReforme: reforme, recettesNouvelles: reforme - actuel,
             avantageNetActuel: p.tauxEntree - p.tauxSortie, avantageNetReforme: 0, recettesActuelles: actuel, recettesNettes: reforme };
  }
  /** Crypto-actifs : assiette nette observée (DGFiP) ou élargie (échanges crypto-crypto, DAC8) ; fuite très forte (actif portable) ; pertes à forte part de fraude (portefeuilles croisés). */
  function crypto(sc, o) {
    var p = PARAM[sc].crypto;
    // La recette actuelle est celle de l'assiette DÉCLARÉE (2024 : 0,368 Md€, taux de 31,4 % appliqué au modèle, 30 % avant 2026), pas de l'assiette élargie : la hausse de conformité (échanges crypto-crypto, DAC8) est donc comptée dans les recettes nouvelles.
    var actuel = (CONST.tPFUir + CONST.tPS) * Math.min(p.N, CONST.cryptoDeclare[2024]);
    return bloc(sc, { titre: 'Crypto-actifs', N: p.N, rho: p.rho, tauA: CONST.tPFUir + CONST.tPS, eps: p.eps, eta: p.eta, recolte: p.recolte, fraude: p.fraude, f: fR('crypto', o), actuel: actuel }, o);
  }

  // ---- Bilan ---------------------------------------------------------------------------------------------------------------------------------
  /** Bilan par scénario : recettes nouvelles par actif (net des crédits) et au total. o : { T, reel (défaut true ; false = nominale), deces ('statuQuo' pour garder la purge ; défaut : fin de la purge), t }. */
  function bilan(sc, o) {
    o = o || {};
    var fn = [['dividendes', dividendes], ['portefeuille', portefeuille], ['assuranceVie', assuranceVie], ['pea', pea], ['entreprise', cessionEntreprise], ['pro', plusValuesPro], ['crypto', crypto]];
    var parActif = {}, total = 0, actuel = 0, i, r;
    for (i = 0; i < fn.length; i++) { r = fn[i][1](sc, o); parActif[fn[i][0]] = r; total += r.recettesNouvelles; actuel += r.recettesActuelles; }
    parActif.per = per(sc, o); total += parActif.per.recettesNouvelles;
    parActif.assuranceVieDeces = assuranceVieDeces(sc, o); total += parActif.assuranceVieDeces.recettesNouvelles;
    var credits = 0, cout = 0, brutes = 0; ['dividendes', 'portefeuille', 'assuranceVie', 'pea', 'entreprise', 'pro', 'crypto'].forEach(function (k) { credits += parActif[k].creditsCrees; cout += parActif[k].coutCredits; brutes += parActif[k].recettesBrutes; });
    return { scenario: sc, T: o.T === undefined ? COMMUN.T : o.T, reel: o.reel !== false, parActif: parActif, soldeNet: total, recettesActuellesBlocs: actuel, recettesBrutesBlocs: brutes, creditsCreesBlocs: credits, coutCreditsBlocs: cout };
  }

  /** Krach (option) : une année où les gains tombent à 30 % et les pertes sont multipliées par 3 (portefeuille, entreprise, crypto). Crédits créés en plus, recettes perdues. */
  function krach(sc, o) {
    var out = {}, tot = { creditsSupplementaires: 0, recettesPerdues: 0, coutUltime: 0 }, u = partImputee(sc, (o && o.T) || COMMUN.T);
    [['portefeuille', portefeuille], ['crypto', crypto], ['entreprise', cessionEntreprise]].forEach(function (x) {
      var b = x[1](sc, o), t = (o && o.t) || CONST.tauxPrelevement, base = b.recettesBrutes, creditsN = b.creditsCrees;
      var recettes = base * COMMUN.krach.gains, credits = creditsN * COMMUN.krach.pertes;
      out[x[0]] = { recettesDeLAnnee: recettes, recettesPerdues: base - recettes, creditsCrees: credits, creditsSupplementaires: credits - creditsN, coutUltime: (credits - creditsN) * u };
      tot.creditsSupplementaires += credits - creditsN; tot.recettesPerdues += base - recettes; tot.coutUltime += (credits - creditsN) * u;
    });
    return { parActif: out, total: tot };
  }

  // ---- Report d'imposition de l'apport-cession (art. 150-0 B ter) : dossier sources/report-150-0-b-ter-holdings.md ; methode.md § 27 ; H331 à H346 ; V5690-V5719 ----
  // Fonctions OPTIONNELLES : ni `bilan`, ni aucune valeur par défaut des autres fonctions n'est modifiée.
  var REPORT150 = {
    annees: [2020, 2021, 2022, 2023, 2024],
    // DGFiP, via rapport AN n° 3056 (08/07/2026), p. 178 ; Md€ ; le stock est un MAJORANT (case 8UT de la 2042)
    stock: [78.787, 96.640, 117.130, 152.869, 173.268],
    flux: [10.841, 16.358, 18.366, 33.636, 22.172],          // nouvelles plus-values placées en report, avant abattements
    sorties: [0.313, 0.494, 0.635, 0.418, 1.514],            // plus-values dont le report a pris fin
    foyers2023: 8400, foyersTop2023: 84, fluxTop2023: 23.5,  // CPO, via rapport AN p. 176-177 (revenu moyen hors plus-values : 700 k€ ; 21,9 M€ pour les 84)
    partDernierDecile2023: 31.3 / 33.636,                    // rapport AN p. 177 : 31,3 Md€ sur 33,6
    tPFU2026: 0.314,                                         // 12,8 % + 18,6 % (rapport AN p. 14 ; V5610)
    tPFUCEHR: 0.34,                                          // taux maximal PFU + CEHR retenu par le CPO (2024, note 161)
    qpfcPlusValues: 0.12, tauxIS: 0.25,                      // CGI 219 I a quinquies : QPFC de 12 % sur les plus-values de titres de participation ; IS 25 %
    ipp: { foyers: 75, revenuEco: 0.634504 * 75, revenuFiscal: 0.026827 * 75, tauxGlobal: 0.262, tauxGlobal50: 0.21, tauxTop01: 0.46 }  // IPP note n° 92 (2016) : tableau 1 ; Md€
  };
  var R150P = {
    //          F : flux annuel entrant (Md€) ; pi : part du flux finalement imposée aujourd'hui ; eps, eta, rho : comme le bloc « entreprise » ;
    //          kappa : part du stock réellement sous 150-0 B ter (le stock 8UT est un majorant) ; psiStock : part du stock effectivement recouvrée en cas d'imposition ;
    //          mu : part du stock transmise chaque année (décès ou donation) ; psiDeces : part recouvrée à la transmission (liquidité, restructurations, départs)
    bas:     { F: 18.4, pi: 0.15, eps: 2.5, eta: 0.15, rho: 0.05, kappa: 0.70, psiStock: 0.30, mu: 0.015, psiDeces: 0.50, A: 50.0, evite: 0.60, etaH: 0.10, fuitePlancher: 0.70 },
    central: { F: 24.7, pi: 0.07, eps: 1.5, eta: 0.08, rho: 0.03, kappa: 0.85, psiStock: 0.50, mu: 0.025, psiDeces: 0.75, A: 62.5, evite: 0.35, etaH: 0.05, fuitePlancher: 0.50 },
    haut:    { F: 33.6, pi: 0.03, eps: 0.8, eta: 0.03, rho: 0.02, kappa: 1.00, psiStock: 0.70, mu: 0.040, psiDeces: 0.90, A: 75.0, evite: 0.20, etaH: 0.02, fuitePlancher: 0.30 }
  };
  /** Cohérence des séries : stock(n−1) + flux(n) − sorties(n) − stock(n) (Md€) ; le stock n'est pas la somme des flux (8UT majorant, abattements). */
  function ecartStock() {
    var R = REPORT150, out = [], i;
    for (i = 1; i < R.annees.length; i++) out.push(R.stock[i - 1] + R.flux[i] - R.sorties[i] - R.stock[i]);
    return out;
  }
  /** (a) Supprimer le report : plus-value d'apport imposée à t (50 %) l'année de l'apport. Flux annuel de croisière (Md€/an), net du coût des crédits de perte. */
  function report150Flux(sc, o) {
    o = o || {};
    var p = R150P[sc], t = o.t === undefined ? CONST.tauxPrelevement : o.t, F = o.F === undefined ? p.F : o.F;
    var tauA = o.tauA === undefined ? p.pi * REPORT150.tPFU2026 : o.tauA;   // taux effectif actuel : seule la part π du flux est jamais imposée ; o.tauA = 30 % redonne l'ancienne convention (avant V6000)
    var r = bloc(sc, { titre: 'Report 150-0 B ter supprimé : flux', N: F, rho: p.rho, tauA: tauA, eps: p.eps, eta: p.eta, recolte: 0, fraude: 0 }, { t: t, T: o.T, sansComportement: o.sansComportement });
    r.tauxEffectifActuel = tauA;
    return r;
  }
  /** (a) suite : imposition unique du STOCK au taux t (rétroactif ; une fois, Md€). Hors solde annuel. */
  function report150Stock(sc, o) {
    o = o || {};
    var p = R150P[sc], t = o.t === undefined ? CONST.tauxPrelevement : o.t, S = o.S === undefined ? REPORT150.stock[REPORT150.stock.length - 1] : o.S;
    var brut = t * S * p.kappa, total = brut * p.psiStock;
    return { stock: S, kappa: p.kappa, psi: p.psiStock, impotLatent: brut, total: total, parAnSur10: total / 10 };
  }
  /** (c) Fin de la purge : le report prend fin à toute transmission à titre gratuit (décès, donation), recommandation n° 11 du rapport AN, amendement I-CF1687.
   *  Recette annuelle sur un stock S (Md€/an) = t × S × κ × μ × ψ. `annees` : stock S + n (F − sorties), le flux continuant au rythme du scénario. */
  function report150Deces(sc, o) {
    o = o || {};
    var p = R150P[sc], t = o.t === undefined ? CONST.tauxPrelevement : o.t, n = o.annees || 0;
    var S0 = o.S === undefined ? REPORT150.stock[REPORT150.stock.length - 1] : o.S;
    var S = S0 + n * (p.F - REPORT150.sorties[REPORT150.sorties.length - 1]);
    var annuel = t * S * p.kappa * p.mu * p.psiDeces;
    return { stock: S, annuel: annuel, echappeSurVingtAns: S0 * p.kappa * (1 - Math.pow(1 - p.mu, 20)) * REPORT150.tPFU2026 };
  }
  /** (b1) Taxe sur les actifs non professionnels des holdings patrimoniales (version initiale du PLF 2026 : 2 %). Assiette A calibrée sur le rendement annoncé (1 à 1,5 Md€ à 2 %). */
  function holdingsTaxe(sc, o) {
    o = o || {};
    var p = R150P[sc], r = o.taux === undefined ? 0.02 : o.taux;
    var brut = r * p.A, net = o.sansComportement ? brut : brut * (1 - p.evite) * (1 - p.etaH);
    return { assiette: p.A, taux: r, recettesBrutes: brut, recettesNettes: net };
  }
  /** (b2) Plancher d'imposition en REVENU économique (transparence) pour les 75 foyers du sommet (IPP, 2016) : (plancher − taux global actuel) × revenu économique, net de la fuite. */
  function plancherRevenu(sc, o) {
    o = o || {};
    var p = R150P[sc], I = REPORT150.ipp, plancher = o.plancher === undefined ? 0.40 : o.plancher;
    var statique = Math.max(0, plancher - I.tauxGlobal) * I.revenuEco;
    return { foyers: I.foyers, revenuEconomique: I.revenuEco, tauxActuel: I.tauxGlobal, plancher: plancher, statique: statique, net: statique * (1 - p.fuitePlancher) };
  }
  /** Les trois options pour un scénario ; (a) et (c) sont cumulables (a = flux futur, c = stock existant), (b) ne l'est pas avec (a) (mêmes liquidités). */
  function report150Options(sc, o) {
    var a = report150Flux(sc, o), as = report150Stock(sc, o), c = report150Deces(sc, o), b1 = holdingsTaxe(sc, o), b2 = plancherRevenu(sc, o);
    return { scenario: sc, a: a, aStock: as, b1: b1, b2: b2, c: c, ac: a.recettesNouvelles + c.annuel };
  }

  var API = { SC: SC, CONST: CONST, PARAM: PARAM, COMMUN: COMMUN, reelFactor: reelFactor, partImputee: partImputee, tauxMaximisantRecette: tauxMaximisantRecette, stockReport: stockReport, bloc: bloc,
              REPORT150: REPORT150, R150P: R150P, ecartStock: ecartStock, report150Flux: report150Flux, report150Stock: report150Stock, report150Deces: report150Deces, holdingsTaxe: holdingsTaxe, plancherRevenu: plancherRevenu, report150Options: report150Options,
              dividendes: dividendes, portefeuille: portefeuille, cessionEntreprise: cessionEntreprise, plusValuesPro: plusValuesPro, assuranceVie: assuranceVie, assuranceVieDeces: assuranceVieDeces,
              pea: pea, per: per, crypto: crypto, partEntreprise: partEntreprise, bilan: bilan, krach: krach };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.PatrimoineFinancier = API;
})(this);
