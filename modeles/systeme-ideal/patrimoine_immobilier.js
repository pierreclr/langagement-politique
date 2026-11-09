/*
 * modeles/systeme-ideal/patrimoine_immobilier.js — T56, fiscalité du patrimoine immobilier du système idéal (02/11/2026).
 * Décisions de l'auteur (02/11/2026, volet logement) chiffrées ici :
 *   (1) prélèvement unique à 50 % sur la plus-value immobilière RÉELLE (inflation déduite), hors résidence principale (exonérée), sans abattement pour durée ;
 *   (2) suppression des droits de mutation à titre onéreux (DMTO) ;
 *   (3) moins-value réelle = crédit d'impôt de 50 % REPORTABLE sur l'impôt futur (pas de remboursement), durée de report bornée (5 ans, 10 ans, sans limite).
 * Volumes : DVF 2024 (dvf_patrimoine.js, généré par generer_dvf_patrimoine.py) ; la plus-value n'est PAS observée (DVF ne donne ni prix d'achat d'origine
 * ni qualité de résidence principale) : elle est estimée par quadrature sur une loi de durées de détention et une dispersion des rendements (methode.md § 23, H243 à H275).
 * Charger : dvf_patrimoine.js patrimoine_immobilier.js (+ modele.js … palier1.js pour l'intégration au solde du palier 1, facultatif).
 * Unités : Md€ de 2025 (euros constants) par an en régime de croisière ; ratios par euro de prix de vente. Fonctions pures. Ordres de grandeur, jamais des prédictions.
 * Scénarios : « bas » = hypothèses les MOINS favorables au solde public, « haut » = les plus favorables (pas toujours le sens naturel de chaque paramètre : voir PARAM).
 */
(function (root) {
  'use strict';
  var DVF = root.DvfPatrimoine || (typeof require !== 'undefined' ? require('./dvf_patrimoine.js') : null);
  function P1() { return root.Palier1 || (typeof require !== 'undefined' ? require('./palier1.js') : null); }

  var SC = ['bas', 'central', 'haut'];

  // ---- Constantes sourcées -------------------------------------------------------------------------------------------------------------------
  var CONST = {
    // DMTO tous niveaux, Md€ : Cour des comptes, note du 21/09/2026, via presse (V3930 : note non lue). Autre série, CPO déc. 2025 (comptes nationaux, lue) : 21,6 (2022), 16,8 (2023), 14,7 (2024) ; écart de 7-8 %, paramètres inchangés
    dmtoSerie: { 2021: 19.7, 2022: 20.1, 2024: 13.5, 2025: 16.1 },
    // Taux d'un achat dans l'ancien (V3931 confirmée : 4,5 % jusqu'au 31/03/2025 ; 5 % pour les non-primo-accédants du 01/04/2025 au 31/03/2028, art. 11 LF 2025 ; 6,32 % au total à 5 %) : part départementale 4,5 %, taxe communale 1,2 %, frais d'assiette 2,37 % de la part départementale (≈ 0,107 point)
    tauxDep: 0.045, tauxCom: 0.012, tauxFraisAssiette: 0.045 * 0.0237,
    tfpb: 41.96,                       // taxe foncière sur les propriétés bâties 2024, Md€ (INSEE t_3217, sources/donnees/impots_inventaire.csv)
    prodPvActuel2023: 3.6,             // Md€ : impôt sur les plus-values immobilières des ménages 2023 (IR + CSG/CRDS/solidarité), Cour des comptes, nov. 2025, PDF lu (V4270 confirmée, p. 7 et 39)
    // Régime actuel (outils/droit/loi_executable/plus_values.py, lu le 02/11/2026)
    tIR: 0.19, tPS: 0.172, forfaitFraisAcq: 0.075, forfaitTravaux: 0.15,
    tauxPrelevement: 0.50              // décision de l'auteur du 02/11/2026
  };
  CONST.tauxDmto = CONST.tauxDep + CONST.tauxCom + CONST.tauxFraisAssiette;   // ≈ 0,0581, cohérent avec « environ 5,8 % du prix » (CPO 2018, ⚠️ V3932)

  // ---- Hypothèses par scénario (methode.md § 23) -------------------------------------------------------------------------------------------
  var PARAM = {
    bas: {
      dmto: 20.1,                      // H243 : DMTO perdus, Md€ (pic 2022) : la perte la plus forte
      partNonRP: 0.25,                 // H244 : part des ventes de logement ancien faites par un vendeur hors résidence principale (⚠️ non mesurée)
      dureeMoy: 9, derive: 0.010,      // H245-H246 : durée moyenne de détention des biens hors RP vendus (années) ; dérive réelle annuelle des prix
      fraisCession: 0.05,              // H247 : frais de vente à la charge du vendeur (agence), part du prix
      travauxAn: 0.006,                // H248 : travaux justifiés par an, part du prix d'achat réévalué
      semiElDmto: 0.0,                 // H250 : hausse relative des ventes par point de DMTO supprimé (Allemagne ≈ 0,06-0,07 ; Toronto ≈ 0,136). Borne basse corrigée le 04/11/2026 (V11556, V12401) : 0 au lieu de 0,03, car Bérard et Trannoy (2018) ne trouvent aucun effet à moyen ou long terme en France
      capitalisation: 0.2,             // H251 : part du DMTO supprimé qui se capitalise dans les prix
      elasticiteRealisation: 2.0,      // H252 : élasticité de la réalisation des plus-values par rapport à la part nette (1 − taux) ; fourchette 0,5 / 1,0 / 2,0 adoptée le 03/11/2026, voir sources/elasticite-plus-values.md § 5 (Agersnap et Zidar : 1,87 sur 0-10 ans)
      absorption: 0.90, lambda: 0.15,  // H255-H256 : part des crédits finalement imputable ; probabilité annuelle d'imputation
      fraude: 0.15                     // H257 : majoration des crédits par des pertes fabriquées
    },
    central: {
      dmto: 16.1, partNonRP: 0.33, dureeMoy: 12, derive: 0.030, fraisCession: 0.04, travauxAn: 0.004,
      semiElDmto: 0.07, capitalisation: 0.5, elasticiteRealisation: 1.5, absorption: 0.75, lambda: 0.10, fraude: 0.05
    },
    // H252 corrigé le 04/11/2026 (V11550 ✅, Levy 2025, données françaises de ventes de logements 2012-2013 : élasticité de l'assiette 1 à 1,5 à moyen terme, 1,2 à 1,7 au tableau 3 ; V12404) : central 1,5 (au lieu de 1,0), haut 1,0 (au lieu de 0,5), bas 2,0 inchangé (Agersnap et Zidar 1,87).
    // haut : semiElDmto 0,136 (corrigé le 04/11/2026, V11556, V12401 : Toronto, Dachis, Duranton et Turner, 15 % pour 1,1 point ; l'ancien 0,10 était sous cette étude)
    haut: {
      dmto: 13.5, partNonRP: 0.38, dureeMoy: 15, derive: 0.040, fraisCession: 0.03, travauxAn: 0.002,
      semiElDmto: 0.136, capitalisation: 0.8, elasticiteRealisation: 1.0, absorption: 0.60, lambda: 0.06, fraude: 0.0
    }
  };
  // Paramètres communs aux trois scénarios
  var COMMUN = {
    inflation: 0.02,          // H249 : hypothèse de l'outil loi exécutable (plus_values.py INFLATION_HYP)
    sigma0: 0.17,             // H253 : dispersion constante du log du rendement réel (DVF, reventes dans l'Isère 2021-2025 : IQR/1,349 de 0,16 à 0,17 pour 2 à 5 ans)
    sigmaC: 0.05,             // H254 : dispersion qui s'accumule avec la racine du temps, par √an (⚠️ hypothèse, non mesurable sur 5 ans de DVF)
    forme: 2,                 // H245 : loi Gamma de forme 2 pour la durée de détention (mode avant la moyenne, queue longue)
    fraisAcqTransition: 0.075,// H258 : frais d'acquisition des biens achetés AVANT la réforme (DMTO compris, ≈ forfait légal de 7,5 %)
    fraisAcqCroisiere: 0.025, // H259 : frais d'acquisition sans DMTO (émoluments, contribution de sécurité immobilière, débours) ⚠️ ordre de grandeur
    choc: -0.20,              // H260 : krach : prix −20 % (demande de l'auteur)
    volumeKrach: 0.75,        // H261 : volume de ventes pendant le krach par rapport au niveau normal (V4280 confirmée : −27 % en deux ans, 802 000 → 590 000 ventes, Notaires de France, avril 2010)
    nGrille: 24, dMax: 60
  };

  // ---- Outils numériques ---------------------------------------------------------------------------------------------------------------------
  /** Inverse de la loi normale (Acklam, erreur relative < 1,2e-9). */
  function normInv(p) {
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00],
        b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01],
        c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00],
        d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00], q, r;
    if (p <= 0 || p >= 1) throw new Error('normInv : p hors de ]0 ; 1[');
    if (p < 0.02425) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - 0.02425) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  var _grilleZ = {};
  /** n quantiles centrés de la loi normale réduite (quadrature déterministe, moyenne 0 à 1e-12 près par symétrie). */
  function grilleZ(n) {
    if (!_grilleZ[n]) { var z = []; for (var i = 0; i < n; i++) z.push(normInv((i + 0.5) / n)); _grilleZ[n] = z; }
    return _grilleZ[n];
  }
  /** Poids de la durée de détention : Gamma(forme, moyenne D) discrétisée par années complètes j (durée j + 0,5), j = 1 … dMax. Somme = 1. */
  function poidsDuree(D, forme, dMax) {
    var k = forme, th = D / k, w = [], s = 0, j, d, x;
    for (j = 1; j <= dMax; j++) { d = j + 0.5; x = Math.pow(d, k - 1) * Math.exp(-d / th); w.push({ an: j, d: d, w: x }); s += x; }
    w.forEach(function (o) { o.w /= s; });
    return w;
  }
  /** Abattements du droit actuel (CGI 150 VC I ; CSS L136-7 II 2°), pour `an` années complètes de détention. */
  function abattementIR(an) { if (an <= 5) return 0; var a = 0.06 * (Math.min(an, 21) - 5); if (an >= 22) a += 0.04; return Math.min(a, 1); }
  function abattementPS(an) { if (an <= 5) return 0; var a = 0.0165 * (Math.min(an, 21) - 5); if (an >= 22) a += 0.016; if (an > 22) a += 0.09 * (an - 22); return Math.min(a, 1); }

  // ---- Profil de gain par euro de prix de vente --------------------------------------------------------------------------------------------
  /**
   * Intègre sur (durée, z0, zc) le gain réel par euro de prix de vente. R = rapport réel prix de vente / prix d'achat réévalué de l'inflation :
   *   R = (1 + derive)^d · exp(−½(σc² d + σ0²) + σc √d zc + σ0 z0) · (1 + choc)   (l'espérance de R hors choc est (1 + derive)^d)
   * gain réel par euro de vente = (1 − fraisCession) − ((1 + fraisAcq) + travauxAn · d) / R     (base d'acquisition réévalué : « inflation déduite »)
   * impôt actuel par euro de vente : plus-value brute nominale = (1 − fraisCession) − (1 + max(7,5 %, fraisAcq)) / Rn − forfait travaux (15 % si > 5 ans) / Rn, Rn = R (1 + inflation)^d ;
   *   IR 19 % × (1 − abattement IR) + 17,2 % × (1 − abattement PS) ; surtaxe de l'art. 1609 nonies G NON modélisée (H262).
   * Renvoie des espérances par euro de vente : plus-value réelle positive, moins-value réelle (positive), impôt actuel, part de ventes gagnantes, part perdantes.
   */
  function profil(p, o) {
    o = o || {};
    var fa = o.fraisAcq === undefined ? COMMUN.fraisAcqTransition : o.fraisAcq, choc = o.choc || 0, n = COMMUN.nGrille, z = grilleZ(n), W = poidsDuree(p.dureeMoy, COMMUN.forme, COMMUN.dMax);
    var s0 = COMMUN.sigma0, sc = COMMUN.sigmaC, lnd = Math.log(1 + p.derive), pi = COMMUN.inflation;
    var eG = 0, eL = 0, eA = 0, pG = 0, pL = 0, i, j, k, w, d, R, g, Rn, pvb, ir, ps;
    for (k = 0; k < W.length; k++) {
      w = W[k].w; d = W[k].d;
      for (i = 0; i < n; i++) for (j = 0; j < n; j++) {
        R = Math.exp(lnd * d - 0.5 * (sc * sc * d + s0 * s0) + sc * Math.sqrt(d) * z[i] + s0 * z[j]) * (1 + choc);
        g = (1 - p.fraisCession) - ((1 + fa) + p.travauxAn * d) / (o.base === 'nominale' ? R * Math.pow(1 + pi, d) : R);   // base nominale = variante de comparaison (le défaut est réel depuis la décision du 03/11/2026, Q4)
        var wt = w / (n * n);
        if (g > 0) { eG += wt * g; pG += wt; } else { eL += wt * (-g); pL += wt; }
        Rn = R * Math.pow(1 + pi, d);
        pvb = (1 - p.fraisCession) - (1 + Math.max(CONST.forfaitFraisAcq, fa)) / Rn - (d > 5 ? CONST.forfaitTravaux / Rn : 0);
        if (pvb > 0) eA += wt * pvb * (CONST.tIR * (1 - abattementIR(W[k].an)) + CONST.tPS * (1 - abattementPS(W[k].an)));
      }
    }
    return { gain: eG, perte: eL, impotActuel: eA, partGagnantes: pG, partPerdantes: pL };
  }

  // ---- Volumes -------------------------------------------------------------------------------------------------------------------------------
  /** Valeur annuelle des ventes de logement ancien (Md€) : DVF 2024 France hors Alsace-Moselle et Mayotte. */
  function volumeAncien() { return DVF.france2024.valeurMdEur; }

  /** Part DMTO : départements / communes / État (frais d'assiette), tirée des taux légaux ; `total` en Md€. */
  function repartitionDmto(total) {
    var t = CONST.tauxDmto;
    return { total: total, departements: total * CONST.tauxDep / t, communes: total * CONST.tauxCom / t, etat: total * CONST.tauxFraisAssiette / t };
  }

  // ---- Plus-values : recettes ----------------------------------------------------------------------------------------------------------------
  /** Facteurs de comportement à la suppression des DMTO et à la taxation à 50 % du gain réel. */
  function comportement(sc, o) {
    o = o || {};
    var p = PARAM[sc], pts = CONST.tauxDmto * 100, pr = profil(p, { fraisAcq: o.fraisAcq });
    var mVol = 1 + p.semiElDmto * pts;                                              // ventes totales, toutes catégories (linéaire, cf. limites)
    var tauxActuelReel = pr.gain > 0 ? pr.impotActuel / pr.gain : 0;                 // taux d'imposition actuel moyen rapporté au gain réel positif
    var rapportNet = Math.min(1, (1 - CONST.tauxPrelevement) / Math.max(1 - tauxActuelReel, 0.05));
    var mLock = Math.pow(rapportNet, p.elasticiteRealisation);                       // verrouillage des ventes gagnantes hors RP
    var mPrix = 1 + p.capitalisation * CONST.tauxDmto;                               // niveau des prix
    return { points: pts, mVolume: mVol, ventesSupplementaires: DVF.france2024.n * (mVol - 1), tauxActuelReel: tauxActuelReel, mVerrouillage: mLock,
             mPrix: mPrix, variationPrixPct: (mPrix - 1) * 100, coutAcquisitionPct: ((mPrix) / (1 + CONST.tauxDmto) - 1) * 100, partGagnantes: pr.partGagnantes };
  }

  /** Recettes de plus-values (Md€/an) : droit actuel (volumes inchangés) et réforme (volume, verrouillage et prix modifiés). o : { fraisAcq, sansComportement }. */
  function plusValues(sc, o) {
    o = o || {};
    var p = PARAM[sc], V = volumeAncien(), Vnr = V * p.partNonRP, pr = profil(p, o), c = comportement(sc, o);
    var actuel = Vnr * pr.impotActuel;
    var mult = o.sansComportement ? 1 : c.mVolume * c.mPrix * ((1 - c.partGagnantes) + c.partGagnantes * c.mVerrouillage);
    var Vref = Vnr * mult;
    var reforme = CONST.tauxPrelevement * Vref * pr.gain;
    return { volumeNonRP: Vnr, volumeNonRPReforme: Vref, gainReelParEuro: pr.gain, perteReelleParEuro: pr.perte, partGagnantes: pr.partGagnantes, partPerdantes: pr.partPerdantes,
             recettesActuelles: actuel, recettesReforme: reforme, recettesNouvelles: reforme - actuel, tauxEffectifReforme: pr.gain > 0 ? reforme / (Vref * pr.gain) : 0 };
  }

  // ---- Report des pertes ---------------------------------------------------------------------------------------------------------------------
  /** Part des crédits finalement imputée, en fonction de la durée de report T (années, Infinity = sans limite) : absorption × (1 − e^(−λT)) / sans limite : absorption. */
  function partImputee(p, T) { return T === Infinity ? p.absorption : p.absorption * (1 - Math.exp(-p.lambda * T)); }

  /**
   * Coût du report des pertes (Md€/an en régime de croisière) pour une durée T. Crédit = 50 % de la moins-value réelle, créé à la vente, imputé plus tard.
   * Régime de croisière : crédits annuels créés = 50 % × V_hors RP × perte réelle par euro × (1 + fraude) ; coût annuel = crédits × part imputée.
   * Variante `residencePrincipale` : même crédit pour la perte sur la résidence principale (dont le gain est exonéré : asymétrie).
   */
  function reportPertes(sc, T, o) {
    o = o || {};
    var p = PARAM[sc], pv = plusValues(sc, o), tx = CONST.tauxPrelevement;
    var credits = tx * pv.volumeNonRPReforme * pv.perteReelleParEuro * (1 + p.fraude);
    var u = partImputee(p, T);
    var out = { T: T, creditsCreesAn: credits, partImputee: u, coutAnnuel: credits * u };
    // variante : crédit aussi sur la résidence principale (volume RP = ventes hors RP complémentaires)
    var c = comportement(sc, o), Vrp = volumeAncien() * (1 - p.partNonRP) * c.mVolume * c.mPrix;
    var prRP = profil({ dureeMoy: 12, derive: p.derive, fraisCession: p.fraisCession, travauxAn: p.travauxAn }, o);
    var creditsRP = tx * Vrp * prRP.perte * (1 + p.fraude);
    out.creditsRPCreesAn = creditsRP; out.coutAnnuelAvecRP = (credits + creditsRP) * u;
    return out;
  }

  /**
   * Krach : prix −20 % (choc), volumes × volumeKrach. Crédits créés pendant UNE année de krach, surcroît par rapport au régime normal, recettes de plus-values perdues,
   * et coût ultime selon T, borné par la capacité d'imputation (T années de recettes normales de plus-values hors RP) : un crédit ne peut pas excéder l'impôt futur.
   */
  function krach(sc, o) {
    o = o || {};
    var p = PARAM[sc], pv = plusValues(sc, o), tx = CONST.tauxPrelevement;
    var prK = profil(p, { fraisAcq: o.fraisAcq, choc: COMMUN.choc });
    var Vk = pv.volumeNonRPReforme * COMMUN.volumeKrach;
    var credits = tx * Vk * prK.perte * (1 + p.fraude), recettes = tx * Vk * prK.gain;
    var normal = reportPertes(sc, Infinity, o).creditsCreesAn;
    var res = { creditsCrees: credits, creditsSupplementaires: credits - normal, recettesDeLAnnee: recettes, recettesPerduesAnnee: pv.recettesReforme - recettes,
                partPerdantes: prK.partPerdantes, anneesDeRecettesNormales: credits / Math.max(pv.recettesReforme, 1e-9), coutUltime: {} };
    [5, 10, Infinity].forEach(function (T) {
      var capacite = (T === Infinity ? 1e9 : T) * pv.recettesReforme;
      res.coutUltime[T === Infinity ? 'illimite' : String(T)] = Math.min(res.creditsSupplementaires * partImputee(p, T), capacite);
    });
    // krach plus rude et durable : trois années de suite (pas de reprise)
    res.troisAnnees = { creditsSupplementaires: 3 * res.creditsSupplementaires, recettesPerdues: 3 * res.recettesPerduesAnnee };
    return res;
  }

  // ---- Compensation de la perte des DMTO -------------------------------------------------------------------------------------------------
  /** Bilan par scénario : recettes nouvelles de plus-values, perte de DMTO, coût du report, solde, options de compensation. o : { T (défaut 10), fraisAcq (défaut transition) }. */
  function bilan(sc, o) {
    o = o || {};
    var T = o.T === undefined ? 10 : o.T, p = PARAM[sc], pv = plusValues(sc, o), rp = reportPertes(sc, T, o), dm = repartitionDmto(p.dmto);
    var net = pv.recettesNouvelles - dm.total - rp.coutAnnuel;                 // base : droit actuel conservé hors scénario (conservateur)
    var brut = pv.recettesReforme - dm.total - rp.coutAnnuel;                  // si les recettes actuelles de plus-values sont déjà « supprimées » par le modèle (voir integration)
    var aCompenser = dm.total - pv.recettesNouvelles + rp.coutAnnuel;
    return {
      scenario: sc, T: T, plusValues: pv, dmto: dm, report: rp, soldeNet: net, soldeBrut: brut, aCompenser: aCompenser,
      couvertureDmtoParPv: pv.recettesNouvelles / dm.total,
      tfpbHausseEquivalentePct: 100 * aCompenser / CONST.tfpb,                 // option A : hausse de taxe foncière bâtie pour tout compenser (tous redevables)
      tfpbHausseDmtoSeulPct: 100 * dm.total / CONST.tfpb,                      // option A pure : sans les plus-values
      departements: { perte: dm.departements, compensationEtat: dm.departements, partDuTotal: dm.departements / dm.total },
      comportement: comportement(sc, o)
    };
  }

  /**
   * Option B : intégration au système idéal (palier 1). Ajoute le solde patrimoine immobilier au solde public du palier 1 (déficit actuel compris) et cherche le taux plat
   * qui garde le déficit actuel (−169,1 Md€). `pvDejaSupprimees` = true : le modèle a déjà retiré les recettes actuelles de plus-values avec l'IR et les prélèvements sociaux
   * (on ajoute alors les recettes brutes de la réforme) ; défaut false (conservateur : on n'ajoute que les recettes nouvelles).
   * Nécessite modele.js … palier1.js chargés ; renvoie null sinon.
   */
  function integration(st, sc, o) {
    var P = P1(); if (!P) return null;
    o = o || {};
    var V = root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null), M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
    var sc1 = o.scenarioPalier1 || 'central';        // les noms de scénarios du palier 1 (bas = coûts faibles) et de ce module (bas = solde défavorable) ne se correspondent pas : on les croise explicitement
    var b = bilan(sc, o), delta = o.pvDejaSupprimees ? b.soldeBrut : b.soldeNet;
    var s0 = P.solde(st, sc1), cible = M.DONNEES.deficitActuel - delta;   // solde du palier 1 requis pour que (solde palier 1 + delta) ≥ déficit actuel
    var f = function (t) { return P.solde(V.fus(st, { tPlat: t }), sc1) - cible; }, a = 0.2, t, i, m, hi, lo, tReq = null;
    if (f(a) >= 0) tReq = a;
    else for (t = 0.21; t <= 0.80 + 1e-9; t = Math.round((t + 0.01) * 100) / 100) {      // balayage d'un point (le solde n'est pas monotone en tPlat), puis dichotomie
      if (f(t) >= 0) { lo = Math.round((t - 0.01) * 100) / 100; hi = t; for (i = 0; i < 40; i++) { m = (lo + hi) / 2; if (f(m) >= 0) hi = m; else lo = m; } tReq = hi; break; }
    }
    return { scenarioPalier1: sc1, delta: delta, soldePalier1: s0, soldeAvecPatrimoine: s0 + delta, deficitActuel: M.DONNEES.deficitActuel, tauxPlatPalier1: st.tPlat, tauxPlatRequis: tReq,
             pointsDePlatSupplementaires: tReq === null ? null : 100 * (tReq - st.tPlat) };
  }

  // ---- Variantes contre le verrouillage (T56, 03/11/2026 ; methode.md § 25, H279 à H287) -----------------------------------------------------
  // Options de COMPARAISON : le défaut reste 50 % du gain réel sans abattement (variante « aucune »). Elles ne décident rien.
  var ROLLOVER = {            // H283 : part du gain réinvestie en immobilier (ρ) et part finalement taxée à la sortie (φ ; le reste disparaît : décès, fin de réinvestissement non taxée, évasion)
    bas: { reinvest: 0.7, partTaxee: 0.3 }, central: { reinvest: 0.5, partTaxee: 0.5 }, haut: { reinvest: 0.3, partTaxee: 0.7 },
    delaiRecouvrement: 15,    // années avant la sortie
    actualisation: 0.02       // taux réel
  };
  var VARIANTES_DEFAUT = {
    aucune: { type: 'aucune' },
    degressif: { type: 'degressif', seuil: 5, pente: 0.04, plafond: 0.70 },     // H280 : réduction du taux de 4 % de sa valeur par année au-delà de 5 ans, plafond 70 % (Berne : −2 %/an, plafond −70 %, ⚠️ V5191)
    exoLocatif: { type: 'exoLocatif', N: 10, partLocatif: 0.6 },                // H281 : exonération du bien locatif après N années complètes ; 60 % du hors-RP supposé locatif (⚠️)
    rollover: { type: 'rollover' }                                              // H282-H283
  };
  /** Complète une variante donnée par son nom ou par un objet (les champs absents prennent la valeur par défaut). */
  function variante(v) {
    if (v === undefined || v === null) return VARIANTES_DEFAUT.aucune;
    var t = typeof v === 'string' ? v : v.type, base = VARIANTES_DEFAUT[t], o = {}, k;
    if (!base) throw new Error('variante inconnue : ' + t);
    for (k in base) o[k] = base[k];
    if (typeof v === 'object') for (k in v) o[k] = v[k];
    return o;
  }
  /** Sous-populations d'une cellule (durée an) : part, taux de recette à régime stable, taux « de valeur actuelle » qui pilote le verrouillage. */
  function sousPopulations(v, an, sc) {
    var t = CONST.tauxPrelevement, r, ab, s;
    if (v.type === 'degressif') {
      ab = Math.min(v.plafond, Math.max(0, an - v.seuil) * v.pente);
      return [{ part: 1, tauxRecette: t * (1 - ab), tauxLock: t * (1 - ab) }];
    }
    if (v.type === 'exoLocatif') {
      s = v.partLocatif; var exo = an >= v.N;
      return [{ part: 1 - s, tauxRecette: t, tauxLock: t }, { part: s, tauxRecette: exo ? 0 : t, tauxLock: exo ? 0 : t }];
    }
    if (v.type === 'rollover') {
      r = ROLLOVER[sc];
      var d = Math.pow(1 + ROLLOVER.actualisation, -ROLLOVER.delaiRecouvrement);
      return [{ part: 1, tauxRecette: t * ((1 - r.reinvest) + r.reinvest * r.partTaxee), tauxLock: t * ((1 - r.reinvest) + r.reinvest * r.partTaxee * d), tauxPremiereAnnee: t * (1 - r.reinvest) }];
    }
    return [{ part: 1, tauxRecette: t, tauxLock: t }];
  }
  /**
   * Plus-values avec variante : mêmes volumes, mêmes prix et même verrouillage que `plusValues`, mais le taux dépend de la durée (et du type de bien) et le verrouillage est calculé
   * cellule par cellule : ventes maintenues = min(1, (1 − taux) / (1 − taux actuel moyen sur le gain réel))^élasticité. Pour la variante « aucune », résultat identique à `plusValues` (testé).
   * o : { fraisAcq, elasticite (remplace H252), sansComportement }. Renvoie aussi les recettes SANS verrouillage, pour isoler le coût du verrouillage.
   */
  function plusValuesVariante(sc, vIn, o) {
    o = o || {};
    var v = variante(vIn), p = PARAM[sc], V = volumeAncien(), Vnr = V * p.partNonRP, c = comportement(sc, o), eps = o.elasticite === undefined ? p.elasticiteRealisation : o.elasticite;
    var fa = o.fraisAcq === undefined ? COMMUN.fraisAcqTransition : o.fraisAcq, n = COMMUN.nGrille, z = grilleZ(n), W = poidsDuree(p.dureeMoy, COMMUN.forme, COMMUN.dMax);
    var s0 = COMMUN.sigma0, sc2 = COMMUN.sigmaC, lnd = Math.log(1 + p.derive), den = Math.max(1 - c.tauxActuelReel, 0.05);
    var sG = 0, sT = 0, sTm = 0, sT1 = 0, sGw = 0, sWm = 0, pG = 0, k, i, j, a, w, d, R, g, wt, pops, q, m;
    for (k = 0; k < W.length; k++) {
      w = W[k].w; d = W[k].d; pops = sousPopulations(v, W[k].an, sc);
      for (i = 0; i < n; i++) for (j = 0; j < n; j++) {
        R = Math.exp(lnd * d - 0.5 * (sc2 * sc2 * d + s0 * s0) + sc2 * Math.sqrt(d) * z[i] + s0 * z[j]);
        g = (1 - p.fraisCession) - ((1 + fa) + p.travauxAn * d) / (o.base === 'nominale' ? R * Math.pow(1 + pi, d) : R);   // base nominale = variante de comparaison (le défaut est réel depuis la décision du 03/11/2026, Q4)
        if (g <= 0) continue;
        wt = w / (n * n); pG += wt; sG += wt * g;
        for (a = 0; a < pops.length; a++) {
          q = pops[a]; m = o.sansComportement ? 1 : Math.min(1, (1 - q.tauxLock) / den); m = Math.pow(m, eps);
          sT += wt * q.part * q.tauxRecette * g; sTm += wt * q.part * q.tauxRecette * g * m;
          sT1 += wt * q.part * (q.tauxPremiereAnnee === undefined ? q.tauxRecette : q.tauxPremiereAnnee) * g * m;
          sGw += wt * q.part; sWm += wt * q.part * m;
        }
      }
    }
    var lockRecette = sT > 0 ? sTm / sT : 1, ventesMaintenues = pG > 0 ? sWm / pG : 1;
    var mult = o.sansComportement ? 1 : c.mVolume * c.mPrix * ((1 - pG) + pG * lockRecette);
    var multSans = o.sansComportement ? 1 : c.mVolume * c.mPrix;
    var reforme = Vnr * mult * sT, actuel = plusValues(sc, o).recettesActuelles;
    return { variante: v, volumeNonRPReforme: Vnr * mult, gainReelParEuro: sG, partGagnantes: pG, tauxEffectifMoyen: sG > 0 ? sT / sG : 0,
             ventesGagnantesMaintenues: ventesMaintenues, verrouillagePct: 100 * (1 - ventesMaintenues),
             recettesReforme: reforme, recettesActuelles: actuel, recettesNouvelles: reforme - actuel,
             recettesSansVerrouillage: Vnr * multSans * sT, coutVerrouillage: Vnr * multSans * sT - reforme,
             recettesPremiereAnnee: sTm > 0 ? reforme * sT1 / sTm : 0 };   // première année du report : seule la part non réinvestie est taxée
  }
  /** Bilan d'une variante : mêmes DMTO perdus et même coût de report des pertes que le défaut (H284), seules les recettes de plus-values changent. */
  function bilanVariante(sc, vIn, o) {
    o = o || {};
    var T = o.T === undefined ? 10 : o.T, p = PARAM[sc], pv = plusValuesVariante(sc, vIn, o), rp = reportPertes(sc, T, o), dm = repartitionDmto(p.dmto);
    return { scenario: sc, variante: pv.variante, plusValues: pv, soldeNet: pv.recettesNouvelles - dm.total - rp.coutAnnuel, dmto: dm.total, coutReport: rp.coutAnnuel };
  }
  /** Tableau de comparaison, par scénario : défaut, dégressif (pentes 2, 4, 6 %), exonération du locatif après 5, 10, 22 ans, report en cas de réinvestissement. */
  function comparerVariantes(sc, o) {
    var liste = [['aucune', 'Défaut : 50 % du gain réel, sans abattement', 'aucune'],
      ['degressif2', 'Dégressif, −2 % du taux par an dès 5 ans (plafond 70 %)', { type: 'degressif', pente: 0.02 }],
      ['degressif4', 'Dégressif, −4 % du taux par an dès 5 ans (plafond 70 %)', 'degressif'],
      ['degressif6', 'Dégressif, −6 % du taux par an dès 5 ans (plafond 70 %)', { type: 'degressif', pente: 0.06 }],
      ['exo5', 'Locatif exonéré après 5 ans', { type: 'exoLocatif', N: 5 }],
      ['exo10', 'Locatif exonéré après 10 ans', { type: 'exoLocatif', N: 10 }],
      ['exo22', 'Locatif exonéré après 22 ans', { type: 'exoLocatif', N: 22 }],
      ['rollover', 'Report en cas de réinvestissement', 'rollover']];
    var base = bilanVariante(sc, 'aucune', o);
    return liste.map(function (x) {
      var b = bilanVariante(sc, x[2], o);
      return { cle: x[0], libelle: x[1], bilan: b, soldeNet: b.soldeNet, ecartAuDefaut: b.soldeNet - base.soldeNet, recettesPV: b.plusValues.recettesReforme, verrouillagePct: b.plusValues.verrouillagePct,
               coutVerrouillage: b.plusValues.coutVerrouillage, tauxEffectifMoyen: b.plusValues.tauxEffectifMoyen };
    });
  }
  /** Taux appliqué au gain réel d'UNE vente individuelle (cas types) : défaut 50 % ; estLocatif pour l'exonération ; pour le report, renvoie le taux « à la vente » avec reinvestit. */
  function tauxIndividuel(vIn, annees, estLocatif, reinvestit) {
    var v = variante(vIn), t = CONST.tauxPrelevement;
    if (v.type === 'degressif') return t * (1 - Math.min(v.plafond, Math.max(0, annees - v.seuil) * v.pente));
    if (v.type === 'exoLocatif') return estLocatif && annees >= v.N ? 0 : t;
    if (v.type === 'rollover') return reinvestit ? 0 : t;
    return t;
  }

  var API = { SC: SC, CONST: CONST, PARAM: PARAM, COMMUN: COMMUN, normInv: normInv, grilleZ: grilleZ, poidsDuree: poidsDuree, abattementIR: abattementIR, abattementPS: abattementPS,
              profil: profil, volumeAncien: volumeAncien, repartitionDmto: repartitionDmto, comportement: comportement, plusValues: plusValues,
              ROLLOVER: ROLLOVER, VARIANTES_DEFAUT: VARIANTES_DEFAUT, variante: variante, plusValuesVariante: plusValuesVariante, bilanVariante: bilanVariante, comparerVariantes: comparerVariantes, tauxIndividuel: tauxIndividuel,
              partImputee: partImputee, reportPertes: reportPertes, krach: krach, bilan: bilan, integration: integration };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.PatrimoineImmobilier = API;
})(this);
