/*
 * modeles/systeme-ideal/bareme_v71.js — v7.1 du plan A (arbitrage 42 du 05/11/2026). PROPOSITION, NON ADOPTÉE.
 *   Part de la v7 (bareme_deux_fonctions_v7.js, A3 : κ = 0,6) et remplace le coefficient κ par la règle tranchée par l'auteur :
 *   (1) un seul régime des sociétés : fin du choix IR/IS et des régimes particuliers (taux réduit PME, taxation des brevets à 10 %, taxe au tonnage) ; IS à taux unique t_IS payé par tous ;
 *       reports de pertes maintenus ;
 *   (2) résidents : le capital compte à 100 % dans R ; le dividende entre dans R pour son montant AVANT IS (D / (1 − t_IS)) et l'IS déjà payé (D · t_IS / (1 − t_IS)) est déduit (avoir fiscal) ;
 *       charge totale sur le bénéfice = taux marginal de la fonction, comme le travail ;
 *   (3) non-résidents : IS, plus la retenue à la source au maximum permis par les conventions (0 % au sein de l'UE sous la directive mère-fille) ;
 *   (4) les revenus du capital des retraités entrent aussi dans la fonction (la v5.10 et la v7 les laissaient au droit actuel, ligne N01 du bilan) : ligne à part, H71.6.
 *   La fonction des revenus garde la forme de la v6/v7 : B(R) = S − T(R), T(R) = m∞·R − (m∞ − m0)·K·(1 − e^(−R/K)). Recalibrage (H71.8) : compter le capital à 100 % (crédit d'IS
 *   compris) prélève ≈ 61 Md€ de plus que κ = 0,6 ; aucun barème de cette forme ne tient alors ensemble des recettes égales au droit actuel, le ciblage validé par l'auteur
 *   (+20 à +80 €/mois en bas, −1 à −3 % en haut) et « le rentier ne gagne pas ». Deux calibrages : C (ciblage tenu, ≈ +71 Md€) et N (neutre, redistribution forte).
 * Méthode : moteur de bareme_unique_v6.js (comparaison à la v5.10, fermeture corrigée) ; la partie « haut » est réécrite ici pour séparer les dividendes (H71.2) et faire réagir
 *   le capital au nouveau taux (H71.4) ; neutralité par rapport au droit actuel comme la v7 (NEUTRALITE, 58,7 Md€), plus les lignes nouvelles (IS, retenue, capital des retraités).
 * Euros de 2025-2026 ; €/mois pour les cas types, Md€/an pour les masses. Des hypothèses et des ordres de grandeur, jamais des prédictions. Ne modifie AUCUN module existant.
 * Charger (depuis modeles/systeme-ideal/, jsc) : la liste de test_bareme_deux_fonctions_v7.js (jusqu'à bareme_deux_fonctions_v7.js), puis bareme_v71.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var W = root.BaremeDeuxFonctionsV7 || (req ? req('./bareme_deux_fonctions_v7.js') : null);
  var V = root.BaremeUniqueV6 || (req ? req('./bareme_unique_v6.js') : null);
  var J = root.Decisions0511j || (req ? req('./decisions_0511j.js') : null);
  var H = root.Decisions0511h || (req ? req('./decisions_0511h.js') : null);
  var I = root.Decisions0511i || (req ? req('./decisions_0511i.js') : null);
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var M = root.SystemeIdeal || (req ? req('./modele.js') : null);
  var GP = root.GagnantsPerdantsPalier1 || (req ? req('../gagnants-perdants/palier1.js') : null);
  var HR = root.HautsRevenus || (req ? req('./hauts_revenus.js') : null);
  var F = (root.Voies || (req ? req('./voies.js') : null)).fus;
  var DM = M.DONNEES, SCS = ['bas', 'central', 'haut'];
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };

  var HYP = {
    tRef: 0.42,
    // H71.1 : IS. Recette 2024 : 68,0 Md€ en comptabilité nationale (modele.js, Insee) ; 57,4 Md€ d'IS net au budget de l'État (PLF 2026, Voies et moyens t. I) ; 2025 : ≈ 62 Md€ net
    //   + 7,5 Md€ de contribution exceptionnelle des grandes entreprises (temporaire, non comptée). Taux normal 25 % (art. 219 I CGI) ; taux réduit 15 % jusqu'à 42 500 € de bénéfice
    //   pour un chiffre d'affaires ≤ 10 M€ (art. 219 I b, base LEGI, version en vigueur au 21/02/2026).
    tIS: 0.25, isMdCN: 68.0, isMdEtat2024: 57.4, isMdEtat2025: 62.0,
    // H71.1b : régimes particuliers supprimés (Md€/an, coût 2025 du tome II des Voies et moyens via sources/inventaire-niches-fiscales.csv, sauf PME) :
    //   taux réduit PME ≈ 2,8 (ordre de grandeur cité en commission des finances, ⚠️ V15003), brevets à 10 % (210326) 1,258, tonnage (320119) 0,620 (2026 ; 1,435 en 2025, volatil) ;
    //   perte de rendement (réorganisations, localisation des brevets à l'étranger) : 25 % au central (⚠️ V15004).
    regimes: { pme: 2.8, brevets: 1.258, tonnage: 0.620 }, perteRegimes: { bas: 0.10, central: 0.25, haut: 0.50 },
    // H71.3 : retenue à la source sur les dividendes des non-résidents. Droit actuel (art. 187 CGI, base LEGI) : 25 % pour les personnes morales, 12,8 % pour les personnes physiques,
    //   75 % vers un État non coopératif ; les conventions plafonnent en général à 15 % (portefeuille), 5 % ou 0 % (participations) ; 0 % dans l'UE (directive 2011/96/UE, art. 119 ter).
    //   « Au maximum conventionnel » ne change que le taux des personnes physiques (12,8 % → 15 % là où la convention le permet). Ordre de grandeur (⚠️ V15005 à V15007) :
    //   dividendes versés aux non-résidents ≈ 45 Md€/an, dont personnes physiques ≈ 5 %, dans un pays à plafond de 15 % : 70 %.
    divNonResidentsMd: 45, partPersonnesPhysiques: 0.05, partPlafond15: 0.70,
    tauxConventionnelMoyen: { portefeuille: 0.12, participationsHorsUE: 0.04, participationsUE: 0, partPortefeuille: 0.55, partUE: 0.30 },
    // H71.2 : part des dividendes dans les revenus du capital des bandes de salariés. Dividendes des actifs ≈ 80 % de 74,9 Md€ (comptes nationaux 2024, modele.js), ramenés à l'assiette
    //   après réactions des bandes ; répartition par bande calée sur la concentration : 62 % des dividendes déclarés vont aux 0,1 % des foyers (France Stratégie, 2022, sur 2020 ;
    //   Comité d'évaluation des réformes de la fiscalité du capital, 2021, sur 2019 : 62 %), part plafonnée à 80 % du capital d'une bande, l'excédent passe à la bande du 1 %.
    //   Les bénéfices retenus des holdings imputés aux associés (modele.js imputationHoldings, bande des 0,1 %) ont supporté l'IS : ils ouvrent le crédit.
    partDividendesActifs: 0.80, divMdCN: 74.9,
    repartitionDividendes: [0.0089, 0.0089, 0.0089, 0.0089, 0.0089, 0.0089, 0.0089, 0.0089, 0.0088, 0.05, 0.06, 0.05, 0.14, 0.62],   // dixièmes 1 à 9 : 8 % en tout, répartis au prorata du capital
    plafondPartDividendes: 0.80,
    // H71.4 : réaction du capital au nouveau taux, par rapport à la v5.10 (même règle que modele.js recettesCourants : élasticité eDiv au taux net, bornes 0,2 et 1,5, la perte est
    //   atténuée par la couverture des holdings et la part qui revient plus tard) ; option, active par défaut.
    reactionCapital: true,
    // H71.4b : couverture de la rétention par la transparence des holdings (null = valeur du scénario de modele.js : 0,9 / 0,7 / 0,5). Sans transparence (0), la rétention des bénéfices
    //   dans les sociétés à l'IS n'est plus rattrapée : sensibilité du dossier § 14.6.
    couverture: null,
    // H71.6 : capital des retraités (20 % du capital courant, clé par dixième de pension de modele.js) ; part des dividendes : 10 % (dixièmes 1 à 8), 15 % (9e), 30 % (10e) ⚠️ V15008 ;
    //   droit actuel : PFU de 30 % (convention de modele.js retraites) ; pension regroupée à net constant (bareme_unique_v6.js § 8).
    partDivRetraites: [0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.15, 0.30],
    // H71.8 : calibrage (recherche sur grille, calibrer()) : AUCUN barème de cette forme ne tient à la fois la neutralité, le ciblage et « le rentier ne gagne pas » (voir le dossier § 14).
    //   C (ciblage tenu) : le plus proche de la cible de l'auteur ; recettes ≈ +71 Md€ au-dessus du droit actuel (central). Barème par défaut des cas types.
    //   N (neutre) : recettes égales au droit actuel, le rentier ne gagne pas ; redistribution forte (bas +136 à +538 €/mois, cadres −4 à −6 %).
    C: { S: 412.5, mInf: 0.65, m0: 0.20, K: 1500, kappa: 1, enfant: 200, majParentIsole: 250 },
    N: { S: 825, mInf: 0.67, m0: 0.15, K: 750, kappa: 1, enfant: 200, majParentIsole: 250 },
    regle: null
  };
  HYP.regle = W.HYP.regle;

  // ======================================================================================================================================
  // 1. Barème et parts de dividendes
  // ======================================================================================================================================
  /** Barème v7.1 : forme de la v6, κ = 1, taux d'IS crédité t_IS. */
  function sched(q) { var p = typeof q === 'string' ? HYP[q] : (q || HYP.C), s = V.bareme(p); s.kappa = 1; s.tIS = p.tIS === undefined ? HYP.tIS : p.tIS; return s; }
  var _phi = null;
  /** Parts de dividendes (avant IS, nets d'IS = montants reçus) dans K de chaque bande de salariés, et masse imputée des holdings (Md€). */
  function partsDividendes() {
    if (_phi) return _phi;
    var P = P510(HYP.tRef, 'central'), rc = M.recettesCourants(P), Fh = P.holdings ? M.imputationHoldings(P) : 0, n = rc.parBande.length;
    var Kmd = rc.parBande.map(function (b) { return b.n * b.K / 1e9; }), Ktot = Kmd.reduce(function (a, x) { return a + x; }, 0);
    var K0 = DM.capitalCourant * (1 - P.partCapitalSeniors), pool = HYP.partDividendesActifs * HYP.divMdCN * (Ktot - Fh) / K0;   // dividendes ramenés à l'assiette après réactions
    var K9 = Kmd.slice(0, 9).reduce(function (a, x) { return a + x; }, 0), r9 = HYP.repartitionDividendes.slice(0, 9).reduce(function (a, x) { return a + x; }, 0);
    var div = HYP.repartitionDividendes.map(function (r, j) { return (j < 9 ? r9 * Kmd[j] / K9 : r) * pool; }), phi = [], i;   // dixièmes 1 à 9 : 8 % au prorata de leur capital
    for (i = n - 1; i >= 0; i--) {
      var base = Kmd[i] - (i === n - 1 ? Fh : 0), cap = HYP.plafondPartDividendes * base;
      if (div[i] > cap && i > 0) { div[i - 1] += div[i] - cap; div[i] = cap; }
      phi[i] = (div[i] + (i === n - 1 ? Fh : 0)) / Kmd[i];
    }
    return (_phi = { phi: phi, dividendesMd: div, holdingsMd: Fh, poolMd: pool, Kmd: Kmd, KtotMd: Ktot });
  }
  var _P = {};
  function P510(t, sc) { var k = t + '|' + sc; return _P[k] || (_P[k] = M.param(F(GP.config(Z.versOF(Z.archi(J.base(t)))).p, { scenario: sc }))); }
  /** Réaction d'un revenu du capital au passage du taux τ0 au taux τ1 (règle de modele.js, H71.4). */
  function niveauCapital(tau, Sc) {
    var rk = Math.max(0.2, Math.min(1.5, Math.pow((1 - Math.min(0.99, tau)) / (1 - DM.pfu), Sc.eDiv)));
    var cv = HYP.couverture === null ? Sc.couverture : HYP.couverture;
    return rk < 1 ? 1 - (1 - rk) * (1 - cv) * (1 - Sc.recup) : rk;
  }
  /** K observé au taux τ0 → K au taux τ1 : rapport des niveaux de modele.js, tous deux mesurés depuis le PFU (atténuation par les holdings et le retour différé comprise). */
  function reagir(K, tau0, tau1, Sc) { return K * niveauCapital(tau1, Sc) / niveauCapital(tau0, Sc); }

  // ======================================================================================================================================
  // 2. Moteur : haut (bandes de salariés, dividendes séparés), effet sur le solde par rapport à la v5.10
  // ======================================================================================================================================
  /**
   * Recette supplémentaire (barème − v5.10, Md€) sur les bandes au-dessus de la coupure, après réactions (travail : comme la v6 ; capital : H71.4 si o.reaction).
   * o.kappa (option) : reproduit la v7 (κ appliqué à tout K, pas de crédit), pour comparer à mesure égale.
   */
  function haut(s, t, sc, o) {
    o = o || {};
    var reac = o.reaction === undefined ? HYP.reactionCapital : o.reaction, P = P510(t, sc), Sc = M.SCENARIOS[sc], rc = M.recettesCourants(P), ph = partsDividendes().phi, tot = 0, tIS = s.tIS === undefined ? HYP.tIS : s.tIS;
    rc.parBande.forEach(function (b, i) {
      var top = i >= 9, rang = i - 9, sg = top ? 0.15 : P.dispersion, g;
      for (g = 0; g < 5; g++) {
        var mm = Math.exp(sg * GH.z[g] - sg * sg / 2), L = b.L * mm, K = b.K * mm, r = (L + K) / 12; if (r < V.HYP.coupure) continue;
        var t0 = Math.min(0.99, V.m510(r, t)), t1 = Math.min(0.99, s.m(r)), f = Math.pow((1 - t1) / (1 - t0), HR.etiBande(i, sc, {}));
        var base = 12 * V.N510(r, t), ex;
        if (o.kappa !== undefined) {
          var Kk = reac ? reagir(K, t0, o.kappa * t1, Sc) : K;
          ex = 12 * s.T((L * f + o.kappa * Kk) / 12) - base;
        } else {
          var Kd = ph[i] * K, Ko = K - Kd, tauD = (t1 - tIS) / (1 - tIS);
          if (reac) { Ko = reagir(Ko, t0, t1, Sc); Kd = reagir(Kd, t0, tauD, Sc); }
          var brutD = Kd / (1 - HYP.tIS);           // bénéfice avant IS (dividende mesuré au taux actuel de 25 %)
          ex = 12 * s.T((L * f + Ko + brutD) / 12) - brutD * tIS - base;
        }
        if (top && rang >= 3) {
          var q0 = (1 - t0) / (1 - DM.tmefActuel[9]), q1 = (1 - t1) / (1 - DM.tmefActuel[9]);
          var e0 = q0 < 1 ? 1 - 0.8 * (1 - Math.pow(q0, Sc.mobil)) : 1, e1 = q1 < 1 ? 1 - 0.8 * (1 - Math.pow(q1, Sc.mobil)) : 1, qq = e1 / e0;
          ex = qq * ex - (1 - qq) * base;
        }
        tot += GH.w[g] * b.n * ex;
      }
    });
    return tot / 1e9;
  }
  /** Effet sur le solde (Md€/an) par rapport à la v5.10, fonction des revenus seule (actifs), même décomposition que bareme_unique_v6.js effet. */
  function effetActifs(s, sc, o) {
    var t = HYP.tRef, ss = sc || 'central', h = haut(s, t, ss, o), b = V.bas(s, t, ss), p = V.plancher(s, t, ss), so = V.socle(s), en = V.enfants(s), fe = V.fermeture(t, ss);
    return { haut: h, bas: b, plancher: p, socle: so, enfants: en, fermeture: fe, effet: h - b - p - so - en - fe };
  }

  // ======================================================================================================================================
  // 3. Lignes nouvelles : capital des retraités, IS, retenue à la source
  // ======================================================================================================================================
  /** Capital des retraités dans la fonction (Md€/an, recette supplémentaire par rapport au droit actuel, PFU 30 %) ; o.kappa : variante v7 (κ, sans crédit). */
  function retraitesCapital(s, sc, o) {
    o = o || {};
    var reac = o.reaction === undefined ? HYP.reactionCapital : o.reaction, P = P510(HYP.tRef, sc || 'central'), Sc = M.SCENARIOS[sc || 'central'], Nr = DM.retraites / 10;
    var Kr = DM.capitalCourant * 1e9 * P.partCapitalSeniors, cle = P.jeuCapitalRetraites === 'recherche' ? DM.capitalRetraitesDecileRecherche : DM.capitalRetraitesDecile, tot = 0, out = [], d;
    var tIS = s.tIS === undefined ? HYP.tIS : s.tIS;
    for (d = 0; d < 10; d++) {
      var p = M.pensionDecile(d), x = V.regrouper(s, V.pensionNetteActuelle(p)), K = Kr * cle[d] / Nr / 12, avant = DM.pfu * K, apres;
      var t1 = s.m(x), Kd = HYP.partDivRetraites[d] * K, Ko = K - Kd;
      if (o.kappa !== undefined) { var Kk = reac ? reagir(K, DM.pfu, o.kappa * t1, Sc) : K; apres = s.T(x + o.kappa * Kk) - s.T(x); }
      else {
        if (reac) { Ko = reagir(Ko, DM.pfu, t1, Sc); Kd = reagir(Kd, DM.pfu, (t1 - tIS) / (1 - tIS), Sc); }
        var bD = Kd / (1 - HYP.tIS); apres = s.T(x + Ko + bD) - s.T(x) - bD * tIS;
      }
      tot += (apres - avant) * 12 * Nr / 1e9; out.push({ decile: d + 1, pension: p, capitalMois: K, avant: avant, apres: apres });
    }
    return { md: tot, parDecile: out };
  }
  /** IS en régime (Md€/an) : régime unique (suppression des régimes particuliers) et taux t ; écart au droit actuel. Déplacement des bénéfices : semi-élasticité de modele.js (0,4 / 0,8 / 1,2 % par point). */
  function recetteIS(t, sc) {
    var tt = t === undefined ? HYP.tIS : t, ss = sc || 'central', Sc = M.SCENARIOS[ss], base = HYP.isMdCN / 0.25, dt = tt - 0.25;
    var pert = Math.max(-0.5, Math.min(0.9, Sc.semiIS * 100 * dt)), reg = (HYP.regimes.pme + HYP.regimes.brevets + HYP.regimes.tonnage) * (1 - HYP.perteRegimes[ss]) * tt / 0.25;
    var total = base * tt * (1 - pert) + reg;
    return { total: total, ecart: total - HYP.isMdCN, regimes: reg, taux: tt, perteDeplacement: pert };
  }
  /** Retenue à la source au maximum conventionnel : gain (Md€/an) et taux conventionnel moyen pondéré (ordre de grandeur). */
  function retenue() {
    var c = HYP.tauxConventionnelMoyen, moy = c.partPortefeuille * c.portefeuille + c.partUE * c.participationsUE + (1 - c.partPortefeuille - c.partUE) * c.participationsHorsUE;
    var gain = HYP.divNonResidentsMd * HYP.partPersonnesPhysiques * HYP.partPlafond15 * (0.15 - 0.128);
    return { gainMd: gain, tauxMoyen: moy, recetteMd: HYP.divNonResidentsMd * moy };
  }

  // ======================================================================================================================================
  // 4. Bilan par rapport au droit actuel
  // ======================================================================================================================================
  /** Écart de recettes du plan A v7.1 au droit actuel (Md€/an, croisière) : > 0 = on prélève plus qu'aujourd'hui. */
  function bilan(q, sc, o) {
    var s = sched(q), ss = sc || 'central', a = effetActifs(s, ss, o), r = retraitesCapital(s, ss, o).md, is = recetteIS(s.tIS, ss).ecart, ws = retenue().gainMd;
    return { actifs: a.effet, surplusV510: W.surplusV510(), retraitesCapital: r, is: is, retenue: ws, ecart: W.surplusV510() + a.effet + r + is + ws, detail: a };
  }
  /** Comparaison demandée : capital à 100 % avec crédit d'IS contre κ = 0,6, sur le même barème (A3) et sur le barème v7.1 (Md€/an, central). */
  function comparaisonKappa(q, sc, reaction) {
    var s = sched(q), ss = sc || 'central', o = { reaction: reaction };
    var k06 = haut(s, HYP.tRef, ss, { kappa: 0.6, reaction: reaction }), k1 = haut(s, HYP.tRef, ss, { kappa: 1, reaction: reaction }), cr = haut(s, HYP.tRef, ss, o);
    var r06 = retraitesCapital(s, ss, { kappa: 0.6, reaction: reaction }).md, r1 = retraitesCapital(s, ss, { kappa: 1, reaction: reaction }).md, rc = retraitesCapital(s, ss, o).md;
    return { actifs: { kappa06: k06, kappa1: k1, credit: cr, creditMoinsKappa06: cr - k06, kappa1MoinsCredit: k1 - cr },
             retraites: { kappa06: r06, kappa1: r1, credit: rc, creditMoinsKappa06: rc - r06 }, total: cr - k06 + rc - r06 };
  }

  // ======================================================================================================================================
  // 5. Cas types (droit actuel OpenFisca 2026, comme la v7), rentiers, retraités, taux marginaux
  // ======================================================================================================================================
  function casTypes(q) {
    var s = sched(q), out = V.casTypes(s, HYP.tRef, HYP.regle).filter(function (c) { return c.id !== 'rentier_5000'; }), R = HYP.regle;
    var men = function (sp) { return V.menage(s, sp, R).revenu; }, tIS = s.tIS;
    // rentiers : 5 000 € nets d'IS de dividendes (crédit) ; 2 500 € de dividendes + 2 500 € d'intérêts ; actuel : PFU 31,4 %
    var avR = 5000 * (1 - 0.314), d1 = 5000 / (1 - HYP.tIS);
    var rd = men({ revenus: [0], capital: [d1] }) - d1 * (HYP.tIS - tIS);   // si t_IS ≠ 25 %, le dividende net baisse de d1·Δt et le crédit monte d'autant : neutre pour le résident
    var rm = men({ revenus: [0], capital: [2500 / (1 - HYP.tIS) + 2500] });
    out.push({ id: 'rentier_div_5000', libelle: 'Rentier, 5 000 € par mois de dividendes (actuel : PFU 31,4 %)', avant: avR, apres: rd, ecart: rd - avR });
    out.push({ id: 'rentier_mixte_5000', libelle: 'Rentier, 2 500 € de dividendes + 2 500 € d\'intérêts par mois (actuel : PFU 31,4 %)', avant: avR, apres: rm, ecart: rm - avR });
    // retraités : pension médiane (5e dixième) seule ; avec 500 € de dividendes ; 10e dixième avec 2 000 € de dividendes et d'intérêts (moitié-moitié)
    [[4, 0, 0], [4, 500, 0], [9, 1000, 1000]].forEach(function (c) {
      var p = M.pensionDecile(c[0]), net = V.pensionNetteActuelle(p), x = V.regrouper(s, net), kg = c[1] / (1 - HYP.tIS) + c[2];
      var av = net + (c[1] + c[2]) * (1 - 0.314), ap = x + kg + s.S - s.T(x + kg);
      out.push({ id: 'retraite_d' + (c[0] + 1) + '_' + (c[1] + c[2]), libelle: 'Retraité, pension du ' + (c[0] + 1) + 'e dixième (' + Math.round(p) + ' € brut)' + (c[1] + c[2] > 0 ? ' + ' + (c[1] + c[2]) + ' € de revenus du capital' : ''), avant: av, apres: ap, ecart: ap - av });
    });
    return out;
  }
  function casTypesObjet(q) { var o = {}; casTypes(q).forEach(function (c) { o[c.id] = c; }); return o; }
  function tme(q) { return V.tme(sched(q), HYP.regle); }
  /** Taux marginal total sur un euro de bénéfice distribué à un résident (IS + fonction, crédit déduit) et sur un euro de salaire (coût employeur), à R donné. */
  function tauxSurBenefice(q, r) { var s = sched(q), m = s.m(r); return { travail: m, benefice: s.tIS + (1 - s.tIS) * (m - s.tIS) / (1 - s.tIS), dividendeNet: (m - s.tIS) / (1 - s.tIS) }; }

  // ======================================================================================================================================
  // 6. Gros gains : lissage par quotient (comme la v7, κ = 1, sans crédit d'IS sur les plus-values)
  // ======================================================================================================================================
  function lissage(G, Rreg, n, q) {
    var s = sched(q), N = Math.max(1, Math.min(n, W.HYP.lissagePlafond));
    var T = function (an) { return 12 * s.T(an / 12); }, Pp = function (an) { return T(an) - s.mInf * an; };
    var sans = T(Rreg + G) - T(Rreg), avec = s.mInf * G + N * (Pp(Rreg + G / N) - Pp(Rreg));
    return { G: G, sans: sans, avec: avec, tauxSans: sans / G, tauxAvec: avec / G, N: N };
  }
  function casCessions(q) {
    var Rreg = 12 * I.coutMois(I.HYP.OF_CAS.smic_seul.brut[0]);
    return [1e6, 5e6, 50e6].map(function (G) { var l = lissage(G, Rreg, 20, q), d = W.droitActuelGain(G, Rreg); return { G: G, sansLissage: l.sans, avecLissage: l.avec, droitActuel: d.total, tauxSans: l.tauxSans, tauxAvec: l.tauxAvec, tauxActuel: d.taux }; });
  }

  // ======================================================================================================================================
  // 7. Solde et dette (même construction que la v7 : solde de la v5.10 à 42 % + écart du plan A)
  // ======================================================================================================================================
  /** Écart du plan A v7.1 à la v5.10 (Md€/an) : revenus (actifs + capital des retraités + IS + retenue) + patrimoine (v7) + capital de départ retiré. */
  function ecartPlanA(sc, q) {
    var s = sc || 'central', b = bilan(q, s), w = W.ecartPlanA(s), rev = b.actifs + b.retraitesCapital + b.is + b.retenue;
    return { revenus: rev, patrimoine: w.patrimoine, capitalDepart: w.capitalDepart, total: rev + w.patrimoine + w.capitalDepart };
  }
  function solde(sc, an, q) { return J.solde(sc, an, HYP.tRef) + (an < 2029 ? 0 : ecartPlanA(sc, q).total); }
  function dette(sc, q) {
    var e = {}; SCS.forEach(function (s) { e[s] = ecartPlanA(s, q).total; });
    return H.jalonsDette(sc, { taux: function () { return HYP.tRef; }, net: function (s, y) { return H.net(s, y) + (y < 2029 ? 0 : J.residu(HYP.tRef, s) + e[s]); } });
  }
  function economiesPourStabiliser(sc, q) {
    var s = sc || 'central', e = ecartPlanA(s, q).total, f = function () { return HYP.tRef; }, ratio0 = 1.2351;
    var ok = function (X) { var d = H.jalonsDette(s, { taux: f, net: function (ss, y) { return H.net(ss, y) + (y < 2029 ? 0 : J.residu(HYP.tRef, ss) + e + X); } }); return Math.max.apply(null, d.serie.slice(0, 30)) <= ratio0 + 1e-9; };
    var lo = 0, hi = 400, k; if (ok(0)) return 0;
    for (k = 0; k < 50; k++) { var m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    return hi;
  }

  // ======================================================================================================================================
  // 8. Ventilation travail / capital par dixième de salariés (bandes de modele.js après réactions, actifs)
  // ======================================================================================================================================
  function ventilation() {
    var P = P510(HYP.tRef, 'central'), rc = M.recettesCourants(P), pd = partsDividendes();
    return rc.parBande.map(function (b, i) { return { bande: b.id, adultesM: b.n / 1e6, travailMois: b.L / 12, capitalMois: b.K / 12, partCapital: b.K / (b.L + b.K), partDividendes: pd.phi[i], travailMd: b.n * b.L / 1e9, capitalMd: b.n * b.K / 1e9, dividendesMd: pd.phi[i] * b.n * b.K / 1e9 }; });
  }

  // ======================================================================================================================================
  // 9. Calibrage (H71.8) : recherche sur grille sous contraintes
  // ======================================================================================================================================
  /**
   * Contraintes (H71.8) : bas revenus (Smic seul, parent isolé, couple à deux Smic avec 2 enfants, salariés à 1 500 et 1 750 € net) ≥ +20 €/mois ; rentiers (dividendes ; dividendes + intérêts)
   * ≤ 0 ; TME ≤ 75 %. Mode « ciblage » : bas ≤ +80,5 €, cadres à 10 000 € brut entre −3,5 % et −0,5 %, à 20 000 € ≤ 0 ; on minimise l'écart de recettes. Mode « neutre » : écart de recettes
   * entre −2 et +0,5 Md€ ; on minimise la distance au ciblage (dépassements du bas, couple médian, cadres à −2 %). Renvoie null si une contrainte échoue.
   */
  function evaluer(q, mode) {
    var c = casTypesObjet(q), bas = ['smic_seul', 'parent_isole_smic', 'couple_2smic_2enf', 'net_1500', 'net_1750'].map(function (k) { return c[k].ecart; });
    if (!bas.every(function (e) { return e >= 20; }) || c.rentier_div_5000.ecart > 0 || c.rentier_mixte_5000.ecart > 0) return null;
    var h10 = c.cadre_10000.ecart / c.cadre_10000.avant, h20 = c.cadre_20000.ecart / c.cadre_20000.avant;
    if (mode === 'ciblage' && (!bas.every(function (e) { return e <= 80.5; }) || h10 > -0.005 || h10 < -0.035 || h20 > 0)) return null;
    var b = bilan(q, 'central');
    if (mode !== 'ciblage' && (b.ecart > 0.5 || b.ecart < -2)) return null;
    var tm = tme(q).max.taux; if (tm > 0.75) return null;
    var dist = bas.reduce(function (a, e) { return a + Math.max(0, e - 80) / 30; }, 0) + Math.abs(c.couple_median_2enf.ecart) / 300 + Math.abs(h10 + 0.02) / 0.01 + Math.abs(h20 + 0.02) / 0.01;
    return { score: mode === 'ciblage' ? b.ecart : dist, ecart: b.ecart, distance: dist, tme: tm };
  }
  function rng(a, b, st) { var r = [], x; for (x = a; x <= b + 1e-9; x += st) r.push(Math.round(x * 1000) / 1000); return r; }
  /** Recherche sur grille (enfant 200 €, majoration 250 €, comme la v7). */
  function calibrer(mode, grille) {
    var g = grille || (mode === 'ciblage' ? { S: rng(375, 550, 12.5), mInf: rng(0.50, 0.68, 0.01), m0: rng(0.05, 0.30, 0.025), K: [500, 750, 1000, 1250, 1500, 1750, 2000, 2500] }
                                          : { S: rng(600, 900, 25), mInf: rng(0.62, 0.72, 0.01), m0: rng(0.10, 0.40, 0.05), K: [750, 1000, 1250, 1500, 2000, 2500] });
    var best = null, n = 0;
    g.S.forEach(function (S) { g.mInf.forEach(function (mi) { g.m0.forEach(function (m0) { g.K.forEach(function (K) {
      var q = { S: S, mInf: mi, m0: m0, K: K, kappa: 1, enfant: 200, majParentIsole: 250 }, r = evaluer(q, mode);
      if (r) { n++; if (!best || r.score < best.score) best = { q: q, score: r.score, ecart: r.ecart, distance: r.distance, tme: r.tme }; }
    }); }); }); });
    if (best) best.admissibles = n;
    return best;
  }
  /** Surcroît de charge mécanique (sans réaction) de la v7.1 par rapport à la v7 A3 (κ = 0,6), au point moyen de chaque bande : €/mois par adulte et % du revenu disponible A3. */
  function chargeParBande(q) {
    var s = sched(q), a3 = V.bareme(W.HYP.A3), ph = partsDividendes().phi, rc = M.recettesCourants(P510(HYP.tRef, 'central'));
    return rc.parBande.map(function (b, i) {
      var L = b.L / 12, K = b.K / 12, Kd = ph[i] * K, bD = Kd / (1 - HYP.tIS), tA3 = a3.T(L + 0.6 * K), t71 = s.T(L + K - Kd + bD) - bD * s.tIS, rdA3 = L + K + a3.S - tA3;
      return { bande: b.id, R: L + K, surcroit: t71 - tA3 - (s.S - a3.S), partRevenuDisponible: -(t71 - tA3 - (s.S - a3.S)) / rdA3 };
    });
  }

  var API = { HYP: HYP, SCS: SCS, sched: sched, partsDividendes: partsDividendes, reagir: reagir, haut: haut, effetActifs: effetActifs, retraitesCapital: retraitesCapital, recetteIS: recetteIS,
              retenue: retenue, bilan: bilan, comparaisonKappa: comparaisonKappa, casTypes: casTypes, casTypesObjet: casTypesObjet, tme: tme, tauxSurBenefice: tauxSurBenefice, lissage: lissage,
              casCessions: casCessions, ecartPlanA: ecartPlanA, solde: solde, dette: dette, economiesPourStabiliser: economiesPourStabiliser, ventilation: ventilation, evaluer: evaluer, calibrer: calibrer, chargeParBande: chargeParBande };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.BaremeV71 = API;
})(this);
