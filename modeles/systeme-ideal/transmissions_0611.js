/*
 * modeles/systeme-ideal/transmissions_0611.js — COUCHE posée sur la base de travail du 06/11/2026 (base_0611.js, cas_types_nets_0611.js), NON ADOPTÉE : Claude propose, l'auteur tranche.
 *
 * Arbitrage 53 (06/11/2026) : les cadres doivent contribuer davantage, avec mesure ; l'effort doit surtout porter sur le capital, en particulier les grandes fortunes.
 * Contenu (fonctions pures ; ne modifie AUCUN module existant ; hypothèses HT1 à HT16 dans sources/transmissions-credit-is-0611.md ; vérifications V18400 à V18499) :
 *   (1) fonction des transmissions sur le cumul reçu au cours d'une vie, par bénéficiaire : abattement A (100 000 / 300 000 / 500 000 €), puis taux MARGINAL lisse
 *       τ(x) = 50 % × x / (x + K), x = reçu − A (forme « marg » de capital-de-depart/continu.js, jamais au-dessus de 50 %), plus une rampe de +10 points entre 10 et 20 M€ reçus
 *       (marginal 60 % au-delà de 20 M€, variante « 60 % au-delà de 10 M€ » sans seuil) ; conjoint exonéré (report au second décès) ; assurance-vie dans l'assiette ; fin du Dutreil
 *       et du démembrement (déjà dans l'assiette « flux économique de 300 Md€ » de la v5.10, vérifié : H178, H72.12) ; entreprises : paiement étalé (10 ans) ou en titres (sans effet en croisière) ;
 *       comportements : déclaration et planification d (réponse au taux marginal), exil e des patrimoines mobiles, fractionnement entre bénéficiaires (abattements multipliés),
 *       dettes de la fonction du patrimoine différées (v7.5) déduites de l'actif successoral ; option « impôt de suite / différentiel » (variante_nationalite_0611.js, HN3).
 *   (2) crédit d'impôt sur les sociétés partiel (v7.1 : IS unique 25 %, crédit c × IS payé) : recette, réactions des dividendes, charge totale dividende / salaire.
 *   (3) jeux de réglages (transmissions + crédit partiel + fonction des revenus) pour une dette stable en macro de référence, cadres à −3 % puis −5 % (revenu net santé).
 * Charger (jsc) : la liste de test_cas_types_nets_0611.js sans le test, puis ../capital-de-depart/modele.js, variante_nationalite_0611.js et ce fichier (ordre complet en tête de test_transmissions_0611.js).
 */
(function (root) {
  'use strict';
  var B = root.BaseTravail0611, N = root.CasTypesNets0611, A = root.Decisions0611V74, V = root.BaremeUniqueV6, X = root.BaremeV71, CD = root.CD, M = root.SystemeIdeal,
      V5 = root.Decisions0611V75, NAT = root.VarianteNationalite0611, DS = root.VarianteDetteStable, I = root.Decisions0511i;
  var SC = ['favorable', 'central', 'defavorable'];

  // ======================================================================================================================================
  // 0. Données sourcées et hypothèses
  // ======================================================================================================================================
  var S = {
    flux: 300,               // Md€/an, successions et donations, flux économique vers 2020 (CAE, note n° 69, 2021), assurance-vie comprise (H178) ⚠️ V18400
    dmtg: 20.8,              // Md€, droits de mutation à titre gratuit 2024 (Insee 3.216-3.217) : ligne F06 de la base (droits gardés)
    cohorte: 830000,         // bénéficiaires par génération (capital-de-depart/modele.js, Eurostat demo_pjan 2024)
    medianeH: 70000, p90H: 500000,   // CAE n° 69 : la moitié d'une génération hérite de moins de 70 000 €, moins de 10 % de plus de 500 000 € (DMTG 2006) ; loi log-normale (H2 du capital de départ)
    top1Moy: 4.2e6, top01Moy: 13e6,  // CAE n° 69 : centile supérieur > 4,2 M€, 0,1 % ≈ 13 M€ (contrôle de la queue, euros de 2006 nets de droits)
    differeV75: 26.0,        // Md€/an de fonction du patrimoine différée (BT01), encaissée à la vente ou à la succession
    partExonereesActuel: [0.85, 0.90],  // part des successions en ligne directe sans droits aujourd'hui (CAE, via presse) ⚠️ V18402
    // barème actuel en ligne directe (CGI art. 777 et 779 I) : abattement 100 000 € par parent et par enfant
    bareme777: [[8072, 0.05], [12109, 0.10], [15932, 0.15], [552324, 0.20], [902838, 0.30], [1805677, 0.40], [Infinity, 0.45]], abatDirect: 100000
  };
  var HYP = {
    cj: [0.10, 0.18, 0.25],          // HT2 : part du flux qui va au conjoint survivant (deces_realisation.js PARAM.cj), exonérée
    d: [0.17, 0.30, 0.45],           // HT5 : déclaration et planification à un taux marginal de 50 % (exil-patrimoines-preuves.md § 6.2), proportionnelle au marginal, plafond × 1,5
    eMobile: [0.05, 0.12, 0.27],     // HT6 : départs des patrimoines mobiles à 50 % (1,5 % = 30 % × 5 % ; 4 % = 35 % × 12 % ; 12 % = 45 % × 27 % du flux)
    seuilMobile: 1.3e6,              // HT6 : patrimoines mobiles au-delà de ≈ 1,3 M€ (exil-patrimoines-preuves.md § 6.1, V8110)
    m: [0.25, 0.5, 1.0],             // HT7 : fractionnement : abattements supplémentaires obtenus par les bénéficiaires imposables (petits-enfants, saut de génération)
    partDiffereSuccession: [0.25, 0.5, 0.75],  // HT8 : part du différé de la v7.5 réglée sur l'actif successoral (dette déductible)
    K: 500000,                       // HT3 : paramètre de progressivité (marginal 25 % à A + 500 000 €, 40 % à A + 2 M€, 45 % à A + 4,5 M€)
    topDebut: 10e6, topFin: 20e6, topAjout: 0.10   // HT4 : rampe du marginal de +10 points entre 10 et 20 M€ reçus
  };
  var VARIANTES_A = [100000, 300000, 500000];

  // ======================================================================================================================================
  // 1. Loi du cumul reçu au cours d'une vie et intégration (grille en −log10(1 − u), précise dans la queue)
  // ======================================================================================================================================
  var _G = null;
  function grille() {
    if (_G) return _G;
    var p = CD.params({ p0: 0, medianeH: S.medianeH, p90H: S.p90H, echelle: 1 }), n = 16000, vmax = 7, nodes = [], i, s = 0, sh = 0;
    for (i = 0; i < n; i++) { var v = vmax * (i + 0.5) / n, u = 1 - Math.pow(10, -v), w = (1 - u) * Math.LN10 * vmax / n, h = CD.quantileH(p, u); nodes.push({ u: u, w: w, h: h }); s += w; sh += w * h; }
    _G = { nodes: nodes, poids: s, moyenne: sh / s };
    return _G;
  }
  /** Moyenne conditionnelle du cumul reçu au-dessus du rang u0 (contrôle de la queue CAE). */
  function moyenneAuDela(u0) { var g = grille(), a = 0, b = 0; g.nodes.forEach(function (x) { if (x.u >= u0) { a += x.w * x.h; b += x.w; } }); return a / b; }
  /** Échelle : du cumul « fiscal 2006 » au flux économique hors conjoint (cohorte × E[H] = flux × (1 − cj)). */
  function echelle(k) { return S.flux * (1 - HYP.cj[k]) * 1e9 / (S.cohorte * grille().moyenne); }

  // ======================================================================================================================================
  // 2. La fonction : impôt et taux marginal (statutaires)
  // ======================================================================================================================================
  /** p = { A, K, top (bool : rampe 50 → 60 %), plat (option : taux plat au-delà de A, pour la réconciliation v5.10) } */
  function marginal(H, p) {
    if (p.actuel) { var e = 1; return (impotActuelTheorique(H + e) - impotActuelTheorique(H)) / e; }
    if (H <= p.A) return 0;
    if (p.plat !== undefined) return p.plat;
    var x = H - p.A, t = 0.5 * x / (x + p.K);
    if (p.top) t += HYP.topAjout * Math.max(0, Math.min(1, (H - HYP.topDebut) / (HYP.topFin - HYP.topDebut)));
    return t;
  }
  function impot(H, p) {
    if (p.actuel) return impotActuelTheorique(H);
    if (H <= p.A) return 0;
    var x = H - p.A;
    if (p.plat !== undefined) return p.plat * x;
    var t = 0.5 * (x - p.K * Math.log(1 + x / p.K));
    if (p.top) { var a = HYP.topDebut, b = HYP.topFin, D = HYP.topAjout; t += H <= a ? 0 : (H <= b ? D * (H - a) * (H - a) / (2 * (b - a)) : D * ((b - a) / 2 + (H - b))); }
    return t;
  }
  /** Droit actuel théorique en ligne directe (deux parents, un abattement par parent, sans niches ni renouvellement des donations) : illustration de la distribution. */
  function impotActuelTheorique(H) {
    var demi = H / 2, x = Math.max(0, demi - S.abatDirect), t = 0, prev = 0;
    for (var i = 0; i < S.bareme777.length && x > prev; i++) { var hi = S.bareme777[i][0]; t += (Math.min(x, hi) - prev) * S.bareme777[i][1]; prev = hi; }
    return 2 * t;
  }

  // ======================================================================================================================================
  // 3. Comportements et recette nette
  // ======================================================================================================================================
  /**
   * o = { A, K, top, plat, k (0 favorable | 1 central | 2 défavorable), nationalite: null | 'court' | 'bienConcu' (leviers HN3 de variante_nationalite_0611.js),
   *       sansComportement (statique), sansFractionnement, sansDiffere }
   * Pour un bénéficiaire au cumul statutaire H (euros du flux économique) : H1 = H moins la dette de la fonction du patrimoine différée ; A_eff = A (1 + m) pour ceux qui paieraient ;
   * base imposable (H1 − A_eff) × (1 − d) × (1 − e), avec d = d50 × min(1,5 ; τ/0,5) × (1 − rDecl) et e = e50 × mobile(H) × min(1,5 ; τ/0,5) × (1 − couv), τ = marginal statutaire en H.
   */
  function leviersNat(o) {
    if (!o.nationalite) return { rDecl: 0, couv: 0 };
    var nom = o.nationalite === 'court' ? 'court' : 'bienConcu';
    // valeurs de HN3 (sources/impot-nationalite-et-erosion.md § 5) : court terme 30 % / 30 % ; bien conçu central 78 % / 78 %
    return nom === 'court' ? { rDecl: 0.30, couv: 0.30 } : { rDecl: 0.78, couv: 0.78 };
  }
  function prep(o) {
    var k = o.k === undefined ? 1 : o.k, E = echelle(k), g = grille(), ln = leviersNat(o);
    // dette différée de la v7.5 réglée sur l'actif : poids w(H) = H / (H + 2 M€), k0 tel que cohorte × E[k0 w(H) H] = différé × part
    var Dsucc = o.sansDiffere ? 0 : B.v75().differe * HYP.partDiffereSuccession[k], sw = 0;
    g.nodes.forEach(function (x) { var H = x.h * E; sw += x.w * H * H / (H + 2e6); });
    var k0 = Dsucc * 1e9 / (S.cohorte * sw);
    return { k: k, E: E, k0: k0, ln: ln };
  }
  function parBeneficiaire(H, o, P) {
    var k = P.k, H1 = H * (1 - P.k0 * H / (H + 2e6)), t0 = impot(H1, o);
    if (o.sansComportement) return { statut: impot(H, o), net: t0, H1: H1, paye: t0 > 0 };
    var Aeff = o.sansFractionnement ? o.A : o.A * (1 + HYP.m[k]), q = Object.create(o); q.A = Aeff;
    if (H1 <= Aeff) return { statut: impot(H, o), net: 0, H1: H1, paye: false };
    var tau = o.indexMoyen ? impot(H1, o) / H1 : marginal(H1, o), r = Math.min(1.5, tau / 0.5), d = HYP.d[k] * r * (1 - P.ln.rDecl), mob = H1 * H1 / (H1 * H1 + HYP.seuilMobile * HYP.seuilMobile), e = HYP.eMobile[k] * mob * r * (1 - P.ln.couv);
    var base = Aeff + (H1 - Aeff) * (1 - d) * (1 - e), net = impot(base, q);
    return { statut: impot(H, o), net: net, H1: H1, paye: net > 0, d: d, e: e, perteExil: impot(Aeff + (H1 - Aeff) * (1 - d), q) - net };
  }
  var _R = {};
  /** Recette (Md€/an, croisière) et indicateurs : part des bénéficiaires qui ne paient rien, recette nette par rapport aux droits actuels (20,8). */
  function recette(o) {
    var key = JSON.stringify(o); if (_R[key]) return _R[key];
    var P = prep(o), g = grille(), tot = 0, stat = 0, exil = 0, nPaye = 0, nPayeStat = 0;
    g.nodes.forEach(function (x) { var H = x.h * P.E, r = parBeneficiaire(H, o, P); tot += x.w * r.net; stat += x.w * r.statut; exil += x.w * (r.perteExil || 0); if (r.paye) nPaye += x.w; if (r.statut > 0) nPayeStat += x.w; });
    var f = S.cohorte / 1e9 / g.poids;
    return (_R[key] = { recette: tot * f, statique: stat * f, perteExil: exil * f, netActuel: tot * f - S.dmtg, partNePaientRien: 1 - nPaye / g.poids, partNePaientRienStatut: 1 - nPayeStat / g.poids,
                       beneficiairesPayants: nPaye / g.poids * S.cohorte, echelle: P.E });
  }
  /** Les trois scénarios [favorable, central, défavorable]. */
  function trois(o) { return [0, 1, 2].map(function (k) { var q = JSON.parse(JSON.stringify(o)); q.k = k; return recette(q); }); }
  /** Distribution par tranche de cumul reçu (statutaire), central : parts des bénéficiaires, de la masse, impôt actuel théorique, impôt nouveau (net des comportements), taux moyens. */
  var TRANCHES = [0, 1e5, 3e5, 5e5, 1e6, 2e6, 5e6, 1e7, 5e7, Infinity];
  function distribution(o) {
    var P = prep(o), g = grille(), T = TRANCHES.slice(0, -1).map(function (lo, i) { return { lo: lo, hi: TRANCHES[i + 1], n: 0, masse: 0, actuel: 0, statut: 0, net: 0 }; }), tot = { n: 0, masse: 0, actuel: 0, net: 0 };
    g.nodes.forEach(function (x) {
      var H = x.h * P.E, r = parBeneficiaire(H, o, P), j = 0; while (H >= T[j].hi) j++;
      var t = T[j]; t.n += x.w; t.masse += x.w * H; t.actuel += x.w * impotActuelTheorique(H); t.statut += x.w * r.statut; t.net += x.w * r.net;
      tot.n += x.w; tot.masse += x.w * H; tot.actuel += x.w * impotActuelTheorique(H); tot.net += x.w * r.net;
    });
    return T.map(function (t) { return { lo: t.lo, hi: t.hi, partBenef: t.n / tot.n, partMasse: t.masse / tot.masse, moyenRecu: t.n > 0 ? t.masse / t.n : 0, tauxActuelTheo: t.masse > 0 ? t.actuel / t.masse : 0,
      tauxStatut: t.masse > 0 ? t.statut / t.masse : 0, tauxNet: t.masse > 0 ? t.net / t.masse : 0, partRecette: t.net / tot.net, recetteMd: t.net * S.cohorte / 1e9 / g.poids, beneficiaires: t.n / g.poids * S.cohorte }; });
  }
  /** Impôt statutaire et taux moyen pour quelques cumuls reçus (barème lisible). */
  function tableBareme(o, Hs) { return Hs.map(function (H) { var t = impot(H, o); return { H: H, impot: t, moyen: H > 0 ? t / H : 0, marginal: marginal(H, o), actuel: impotActuelTheorique(H) }; }); }

  // ======================================================================================================================================
  // 4. Crédit d'IS partiel (v7.1 : IS 25 % payé par tous ; le dividende entre dans R pour son montant avant IS, crédit c × IS)
  // ======================================================================================================================================
  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };
  var _P = {};
  function P510(t, sc) {
    var k = t + '|' + sc, F = root.Voies.fus, Z = root.Optimum, J = root.Decisions0511j, GP = root.GagnantsPerdantsPalier1;
    return _P[k] || (_P[k] = M.param(F(GP.config(Z.versOF(Z.archi(J.base(t)))).p, { scenario: sc })));
  }
  /**
   * Réplique de BaremeV71.haut avec un crédit partiel c : crédit = c × IS payé ; taux marginal sur le dividende reçu (réaction) = (t1 − c × 0,25) / 0,75.
   * À c = 1, redonne exactement X.haut (test).
   */
  function hautCredit(s, c, sc) {
    var t = X.HYP.tRef, P = P510(t, sc), Sc = M.SCENARIOS[sc], rc = M.recettesCourants(P), ph = X.partsDividendes().phi, tot = 0, tIS = X.HYP.tIS, DM = M.DONNEES, HR = root.HautsRevenus;
    rc.parBande.forEach(function (b, i) {
      var top = i >= 9, rang = i - 9, sg = top ? 0.15 : P.dispersion, g;
      for (g = 0; g < 5; g++) {
        var mm = Math.exp(sg * GH.z[g] - sg * sg / 2), L = b.L * mm, K = b.K * mm, r = (L + K) / 12; if (r < V.HYP.coupure) continue;
        var t0 = Math.min(0.99, V.m510(r, t)), t1 = Math.min(0.99, s.m(r)), f = Math.pow((1 - t1) / (1 - t0), HR.etiBande(i, sc, {}));
        var base = 12 * V.N510(r, t), Kd = ph[i] * K, Ko = K - Kd, tauD = c === 1 ? (t1 - tIS) / (1 - tIS) : (t1 - c * tIS) / (1 - tIS);
        if (X.HYP.reactionCapital) { Ko = X.reagir(Ko, t0, t1, Sc); Kd = X.reagir(Kd, t0, Math.min(0.99, tauD), Sc); }
        var brutD = Kd / (1 - tIS), ex = 12 * s.T((L * f + Ko + brutD) / 12) - brutD * tIS * c - base;
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
  /** Réplique de BaremeV71.retraitesCapital avec un crédit partiel c (redonne X.retraitesCapital à c = 1). */
  function retraitesCredit(s, c, sc) {
    var P = P510(X.HYP.tRef, sc), Sc = M.SCENARIOS[sc], DM = M.DONNEES, Nr = DM.retraites / 10, tIS = X.HYP.tIS;
    var Kr = DM.capitalCourant * 1e9 * P.partCapitalSeniors, cle = P.jeuCapitalRetraites === 'recherche' ? DM.capitalRetraitesDecileRecherche : DM.capitalRetraitesDecile, tot = 0, d;
    for (d = 0; d < 10; d++) {
      var p = M.pensionDecile(d), x = V.regrouper(s, V.pensionNetteActuelle(p)), K = Kr * cle[d] / Nr / 12, avant = DM.pfu * K, t1 = s.m(x), Kd = X.HYP.partDivRetraites[d] * K, Ko = K - Kd;
      if (X.HYP.reactionCapital) { Ko = X.reagir(Ko, DM.pfu, t1, Sc); Kd = X.reagir(Kd, DM.pfu, Math.min(0.99, c === 1 ? (t1 - tIS) / (1 - tIS) : (t1 - c * tIS) / (1 - tIS)), Sc); }
      var bD = Kd / (1 - tIS), apres = s.T(x + Ko + bD) - s.T(x) - bD * tIS * c;
      tot += (apres - avant) * 12 * Nr / 1e9;
    }
    return tot;
  }
  /** Gain de recette (Md€/an) d'un crédit c au lieu du crédit entier, pour le barème q (défaut : base de travail). Statique : sans réaction des dividendes. */
  function credit(c, q, sc) {
    var s = X.sched(q || B.bareme0()), ss = sc || 'central';
    var h = hautCredit(s, c, ss) - hautCredit(s, 1, ss), r = retraitesCredit(s, c, ss) - retraitesCredit(s, 1, ss);
    var old = X.HYP.reactionCapital; X.HYP.reactionCapital = false;
    var hs = hautCredit(s, c, ss) - hautCredit(s, 1, ss), rs = retraitesCredit(s, c, ss) - retraitesCredit(s, 1, ss); X.HYP.reactionCapital = old;
    return { c: c, actifs: h, retraites: r, total: h + r, statique: hs + rs, erosion: 1 - (h + r) / (hs + rs) };
  }
  /** Charge totale (IS + impôt personnel − crédit) sur 100 € de bénéfice distribué, comparée à 100 € de coût employeur versés en salaire, au revenu R (€/mois de coût employeur). */
  function chargeDividende(q, c, R) {
    var s = A.sched(q || B.bareme0()), tm = s.m(R), tIS = X.HYP.tIS;
    var dividende = tIS + tm - c * tIS;   // sur 1 € de bénéfice : IS 0,25 ; le bénéfice avant IS (1 €) entre dans R au marginal tm ; crédit c × 0,25
    return { R: R, marginal: tm, salaire: tm, dividende: dividende, ecart: dividende - tm };
  }

  // ======================================================================================================================================
  // 5. Jeux de réglages : transmissions + crédit + fonction des revenus (a = m∞ relevé, forme du jeu (a) de base_0611.js), dette stable en macro de référence
  // ======================================================================================================================================
  /** Cas types « mutuelle comptée » (mode salaire, central, sans surcomplémentaire) pour un barème q ; retraités avec R1f (combinaison) ; rentier à 5 000 €/mois de dividendes avec crédit c. */
  function casTypesNets(q, c) {
    var ref = {}; B.casTypesCorriges().forEach(function (x) { ref[x.id] = x; }); var out = [], k = 1;
    N.SALARIES.forEach(function (id) {
      var m = N.mutuelleCollective(id, k), av = ref[id].avant, avantNet = av - N.coutMutuelleActuel(id, k), extra = m.employeur.map(function (e) { return e * (1 + N.S.forfaitSocial[k]); });
      var rd = N.revenu(q, N.specSalarie(id)), net = N.revenu(q, N.specSalarie(id, extra));
      out.push({ id: id, libelle: I.HYP.OF_CAS[id].libelle, avant: av, avantNet: avantNet, ecartRd: rd - av, ecartNet: net - avantNet, pctNet: (net - avantNet) / avantNet });
    });
    N.RETRAITES.forEach(function (r) {
      var p = r.c2s ? N.S.c2s70 : N.primeIndividuelle(r.age, k), r1 = DS.perteIndiv('R1f', r.pn, 0), avantNet = r.pn - p;
      out.push({ id: r.id, libelle: r.libelle, avant: r.pn, avantNet: avantNet, ecartRd: -r1, ecartNet: r.pn - r1 - avantNet, pctNet: (r.pn - r1 - avantNet) / avantNet });
    });
    // rentier : 5 000 € nets d'IS de dividendes par mois (X.casTypes : droit actuel PFU 31,4 %), crédit c
    var d1 = 5000, avR = d1 * (1 - 0.314), brut = d1 / 0.75, rdR = V.menage(A.sched(q), { revenus: [0], capital: [brut] }, X.HYP.regle).revenu - brut + d1 + c * 0.25 * brut;
    out.push({ id: 'rentier_div_5000', libelle: 'Rentier, 5 000 €/mois de dividendes nets d\'IS (actuel : PFU 31,4 %)', avant: avR, avantNet: avR, ecartRd: rdR - avR, ecartNet: rdR - avR, pctNet: (rdR - avR) / avR });
    return out;
  }
  function objet(cs) { var o = {}; cs.forEach(function (x) { o[x.id] = x; }); return o; }
  function bisect(f, lo, hi) { for (var i = 0; i < 50; i++) { var m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; } return (lo + hi) / 2; }
  function baremeA(a) { var q = JSON.parse(JSON.stringify(B.bareme0())); q.mInf = a; return q; }
  /** m∞ tel que la perte du cadre à 10 000 € brut (revenu net santé) vaille `cible` (−0,03 ou −0,05) ; jamais sous le barème de la base. */
  function aPourCadre(cible) {
    var a0 = B.bareme0().mInf, p0 = objet(casTypesNets(B.bareme0(), 1)).cadre_10000.pctNet;
    if (p0 <= cible) return a0;
    return bisect(function (a) { return cible - objet(casTypesNets(baremeA(a), 1)).cadre_10000.pctNet; }, a0, 0.9);
  }
  /**
   * Jeu : o = { cadre: −0,03 | −0,05, trans: { A, K, top }, c (crédit), nationalite } :
   *   fonction des revenus calée sur la perte des cadres ; transmissions (net des 20,8 de droits actuels gardés en F06) ; crédit partiel (sur le barème du jeu) ;
   *   manque restant en macro de référence (combinaison R1f + M1m + M2m + M3, base_0611.js dette) ; PO officiels et élargis ; cas types ; cas limites.
   */
  function jeu(o) {
    var T = B.totaux().central, manque0 = B.dette(T).manque.reference, r0 = B.recetteRevenus(B.bareme0());
    var tr = recette({ A: o.trans.A, K: o.trans.K || HYP.K, top: !!o.trans.top, k: 1, nationalite: o.nationalite || null }), pat = o.patrimoine || 0;
    var reste = function (a) { var q = baremeA(a); return B.dette(T + (B.recetteRevenus(q) - r0) + tr.netActuel + credit(o.c, q).total + pat).manque.reference; };
    var a = o.cadre === 'equilibre' ? (reste(B.bareme0().mInf) <= 0 ? B.bareme0().mInf : bisect(function (x) { return -reste(x); }, B.bareme0().mInf, 0.95)) : aPourCadre(o.cadre);
    var q = baremeA(a), rev = B.recetteRevenus(q) - r0, cr = credit(o.c, q).total, effet = rev + tr.netActuel + cr + pat, dt = B.dette(T + effet).manque;
    return { o: o, a: a, bareme: q, revenus: rev, transmissions: tr, credit: cr, patrimoine: pat, effet: effet, manque0: manque0, manque: dt, cas: casTypesNets(q, o.c) };
  }
  /** Cas limites (charge payée en % du revenu reçu) de la v7.5 sous le barème q, avec le crédit partiel c (le crédit perdu s'ajoute à l'impôt sur les dividendes). */
  function casLimites(q, c) {
    var old = JSON.parse(JSON.stringify(A.VARIANTES.B.bareme)); A.VARIANTES.B.bareme = q; A.variante('B');
    var cfg = JSON.parse(JSON.stringify(B.S.v75)), out = A.CAS.concat([]).map(function (x) { return x; });
    var res = V5.casLimites(cfg).map(function (x) {
      var cas = A.CAS.filter(function (y) { return y.id === x.id; })[0] || {}, brutD = (cas.div || 0) / 0.75, extra = 12 * (1 - c) * 0.25 * brutD, recu = x.v75.revenuRecu;
      var ch = recu > 0 ? (x.v75.charge + extra) / recu : null, chd = recu > 0 && x.v75.chargeDuePct !== null ? x.v75.chargeDuePct + extra / recu : null;
      return { id: x.id, lib: x.lib, charge: ch, chargeDue: chd, alerte: ch !== null && ch > 1, alerteDue: chd !== null && chd > 1 };
    });
    A.VARIANTES.B.bareme = old; A.variante('B');
    return res;
  }

  var API = { S: S, HYP: HYP, VARIANTES_A: VARIANTES_A, SC: SC, grille: grille, moyenneAuDela: moyenneAuDela, echelle: echelle, marginal: marginal, impot: impot, impotActuelTheorique: impotActuelTheorique,
              parBeneficiaire: parBeneficiaire, recette: recette, trois: trois, distribution: distribution, tableBareme: tableBareme, TRANCHES: TRANCHES,
              hautCredit: hautCredit, retraitesCredit: retraitesCredit, credit: credit, chargeDividende: chargeDividende, casTypesNets: casTypesNets, aPourCadre: aPourCadre, baremeA: baremeA,
              jeu: jeu, casLimites: casLimites, objet: objet };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Transmissions0611 = API;
})(this);
