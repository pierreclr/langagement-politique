/*
 * modeles/systeme-ideal/palier1.js — T47, « palier 1 recalculé » (02/11/2026). Fonctions pures au-dessus de modele.js, voies.js, sante.js,
 * optimisation.js et retraites2.js (charger dans cet ordre). Hypothèses H107 à H116 : methode.md § 14 ; suites de l'audit du 01/11/2026 (jeu de capital, santé en montée, transmissions, holdings, levier C, « avant » du cadre à 60 k€) : H176 à H181, methode.md § 19. ⚠️ = non confirmé.
 *
 * Palier 1 recommandé (sources/systeme-ideal-v2.md § 3.1) : socle 500 € par adulte non retraité + 200 € par enfant, impôt continu R0 = 24 000 €, t_max 30 %,
 * IS 25 %, holdings en transparence (H21), audit actif (`configR` : audit:true), santé comptée, ASPA conservée, plancher RSA 877 €, chômage dégressif deg2
 * (60 / 40 / 20 % de la perte, plafonnée à 3 000 € nets), contribution des hautes pensions (2 500 € nets, 20 %, capital sans majoration), plancher ciblé pour les
 * parents isolés. Le taux plat est le plus petit qui ne détériore pas le déficit actuel (solde central avec santé ≥ −169,1 Md€).
 * « bas » / « haut » = convention du modèle (bas = réactions faibles, favorable ; haut = réactions fortes, défavorable). Les recettes de création de valeur
 * suivent la convention inverse (bas = faibles gains) : `valeurPourScenario` les apparie (scénario favorable du modèle ↔ gains élevés).
 * Des ordres de grandeur sous hypothèses, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var V = root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null);
  var S_ = root.Sante || (typeof require !== 'undefined' ? require('./sante.js') : null);
  var O = root.Optimisation || (typeof require !== 'undefined' ? require('./optimisation.js') : null);
  var FA = root.FiscaliteActuelle || (typeof require !== 'undefined' ? require('./fiscalite_actuelle.js') : null);
  var R2 = root.Retraites2 || (typeof require !== 'undefined' ? require('./retraites2.js') : null);
  var D = M.DONNEES, F = V.fus;

  // ---------- Configuration du palier 1
  var BASE = { socle: 500, tMax: 0.30, R0: 24000, tIS: 0.25, holdings: true, enfant: 200, aahDiff: true, complRsa: true, chomage: 'deg2', jeuCapital: 'recherche' };   // H134/H176 : 20 % du capital aux retraités dans le modèle de base ET dans la contribution des hautes pensions (même jeu partout)
  var HP = { seuil: 2500, taux: 0.20, base: 'total', majCapital: 0 };               // H108 : sans majoration du capital (recommandation du § 3.4)
  var PARENT_ISOLE = { n: 0.5e6, plancher: 1300 };                                  // H109 ⚠️ : effectif et niveau du plancher, hypothèses de Claude
  var OPT = { retroChomage: false, holdingsDifferes: false, transmissionsActuelles: false, anneeSante: null, hp: true, fraude: false, parentIsole: true, hpOpt: null, solidarite: null, franchise: 0, plancherParentIsole: PARENT_ISOLE.plancher };
  var L_PAR_NET = FA.coefficientCout(8000);                                         // H110 (revue le 01/11/2026) : coût employeur / net actuel, table T14 lue sur le brut (1,839 ; 1,825 « de mémoire » avant)
  function opts(o) { return F(OPT, o || {}); }
  function stFor(x) { return F(BASE, x || {}); }

  // ---------- Création de valeur (sources/recherche-creer-de-la-valeur.md § 5 ; sources/calculs/creer_valeur.py) : Md€/an de recettes l'année n
  var PIB = 2935, PO = 0.427;
  var VAL = {   // convention de la source : bas = faibles gains, haut = gains élevés
    A: { bas: 0, central: 0.019 * 209.1 - 2.47, haut: 0.031 * 209.1 - 2.47 },
    B: { bas: -0.01, central: 0.03, haut: 0.07 },
    C: { bas: 0, central: 4.1 * 0.40, haut: 5.5 * 0.40 },
    D: { bas: [3.5, 15], central: [15, 10], haut: [33, 5] },
    E: { bas: 0.001, central: 0.003, haut: 0.005 }
  };
  /** Recettes de création de valeur l'année n (Md€/an), convention de la source (bas/central/haut = faibles/moyens/forts gains). Retourne les leviers et le total ; sansE = total hors croissance IA. */
  function valeur(n, sc) {
    var A = n >= 2 ? VAL.A[sc] : 0;                                                  // délai 1-2 ans
    var B = VAL.B[sc] * 10 * Math.max(0, n - 1);                                     // stock détenu au début de l'année n : 10 × (n − 1)
    var C = C_ACTIF ? VAL.C[sc] * Math.min(1, n / 10) : 0;                           // rampe : 50 % à 5 ans, 100 % à 10 ans ; INACTIF dans le palier 1 (H180, audit B2)
    var d = VAL.D[sc], Dd = d[0] * Math.min(1, n / d[1]) * PO;
    var E = (Math.pow(1 + VAL.E[sc], n) - 1) * PIB * PO * 0.5;                       // net à 50 %
    return { A: A, B: B, C: C, D: Dd, E: E, total: A + B + C + Dd + E, sansE: A + B + C + Dd };
  }
  // H180 (audit B2) : le levier C (gain d'emploi de la convergence des allègements de cotisations, Bozio-Wasmer) suppose que des allègements existent encore ; le palier 1 les supprime avec toutes
  // les cotisations (ils sont dans les 885,9 Md€ supprimés) et le modèle compte déjà les réactions de l'offre de travail à la disparition des taux marginaux élevés (eti, eps de modele.js) : garder C = double compte.
  // La source (sources/recherche-creer-de-la-valeur.md § 2, « le prélèvement unique sans cotisations est un allègement généralisé ») le dit elle-même. C reste documenté (VAL.C) mais n'est plus compté.
  var C_ACTIF = false;
  var APPARIEMENT = { bas: 'haut', central: 'central', haut: 'bas' };                // scénario du modèle → scénario de la création de valeur
  function valeurPourScenario(n, scModele) { return valeur(n, APPARIEMENT[scModele]); }

  // ---------- Solde du palier 1
  /** Coût (Md€/an) du plancher ciblé pour les parents isolés : (plancher − revenu après) × effectif, si positif. ⚠️ H109. */
  function parentIsoleCout(st, sc, o) {
    if (!o.parentIsole) return 0;
    var p = O.configR(st), s = null, i;
    for (i = 0; i < O.CAS_R.length; i++) if (O.CAS_R[i].id === 'parentIsole') s = O.CAS_R[i].s;
    var x = M.situation(s, F(p, { scenario: sc }));
    return PARENT_ISOLE.n * Math.max(0, o.plancherParentIsole - Math.max(x.apresMois, D.rsa.niveau)) * 12 / 1e9;
  }

  // ---------- Correctifs pour les hauts revenus qui gagnent
  /**
   * Contribution de solidarité sur les revenus d'activité (coût employeur, base de l'impôt continu) au-delà de seuilNet × 1,839 € par mois (H110 : 8 000 € nets actuels ≈ 14 712 €),
   * au taux x sur la part au-delà. Recette nette (Md€/an) = recette brute après réaction du revenu imposable (élasticité du scénario, appliquée à tous les revenus de la tranche)
   * − perte d'assiette − exil du 1 % supérieur (même règle que modele.js). Masse de salaires : Pareto de retraites2.js (Insee 2023, ⚠️ extrapolation sous D9).
   */
  function solidarite(p, c, sc) {
    var s = M.SCENARIOS[sc], P = M.param(p), x = c.taux, k = L_PAR_NET;
    if (!(x > 0)) return { netMd: 0, brutMd: 0, perteAssietteMd: 0, exilMd: 0, effectifs: 0, tauxMarginal: 0 };
    var m = R2.masseSalaires(c.seuilNet);
    var Lmoy = m.masseNetteMd * 1e9 / m.effectifs / 12 * k;                          // revenu d'activité moyen (€/mois, coût employeur) au-dessus du seuil
    var tau = M.marginal(Lmoy * 12, P);
    var f = Math.pow((1 - tau - x) / (1 - tau), s.eti);
    var mf = R2.masseSalaires(c.seuilNet / f);
    var brut = x * f * mf.excedentMd * k;
    var Lmasse = m.masseNetteMd * k, perte = tau * (1 - f) * Lmasse;
    var top = R2.masseSalaires(R2.SALAIRES.top1), Ltop = top.masseNetteMd * k, tauTop = M.marginal(top.masseNetteMd * 1e9 / top.effectifs / 12 * k * 12, P);
    var part = function (xx) { var r = (1 - tauTop - xx) / (1 - D.tmefActuel[9]); return r < 1 ? 1 - 0.8 * (1 - Math.pow(r, s.mobil)) : 1; };
    var exil = (part(0) - part(x)) * tauTop * Ltop;
    return { netMd: brut - perte - exil, brutMd: brut, perteAssietteMd: perte, exilMd: exil, effectifs: m.effectifs, tauxMarginal: tau, masseMd: Lmasse, facteurRevenu: f };
  }

  var GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };
  /** Espérance de min(R, F) pour R log-normal de moyenne R et dispersion σ. */
  function minMoyen(R, sigma, Fr) {
    var i, s = 0;
    for (i = 0; i < 5; i++) s += GH.w[i] * Math.min(Fr, R * Math.exp(sigma * GH.z[i] - sigma * sigma / 2));
    return s;
  }
  /** Coût (Md€/an) d'une franchise Fr (€ par an et par adulte) sur le taux plat : tPlat × Σ n × E[min(R ; Fr)], sans réaction de l'offre de travail (H111 ⚠️, prudent). Retraités hors voie R : non concernés. */
  function franchiseCout(p, Fr, sc) {
    if (!(Fr > 0)) return 0;
    var P = M.param(F(p, { scenario: sc })), rc = M.recettesCourants(P), tot = 0;
    rc.parBande.forEach(function (b, i) { tot += b.n * minMoyen(b.R, i < 9 ? P.dispersion : 0.15, Fr); });
    return P.tPlat * tot / 1e9;
  }

  /**
   * Impôt net (Md€/an) sur les bénéfices retenus imputés aux associés des holdings (transparence, H21), net du crédit d'IS : recette de `recettesCourants` avec le flux imputé moins la même sans flux, moins le crédit.
   * Les cas types du modèle (`situation`) disent cet impôt DIFFÉRÉ jusqu'à la distribution ; le solde agrégé le compte comme encaissé dans l'année. H179 (audit B1) : on le compte en régime de croisière (les bénéfices
   * sont supposés distribués ou transmis à terme) mais PAS l'année 1 (option `holdingsDifferes`).
   */
  function holdingsDiffere(st, sc) {
    var p = F(O.configR(st), { scenario: sc }), a = M.recettesCourants(M.param(p)).total, b = M.recettesCourants(M.param(F(p, { stockHoldingsMd: 0 }))).total;
    return a - b - M.solde(p).postes.creditHoldings;
  }

  /** Solde public (Md€/an, déficit actuel compris) d'un scénario : voie R + santé + hautes pensions (+ fraude) − plancher parents isolés (+ correctifs). */
  function solde(st, sc, o) {
    o = opts(o);
    var p = O.configR(st);
    if (o.retroChomage) p = F(p, { retroactionChomage: o.retroChomage });   // H217 : rétroaction de la durée du chômage (option ; 'scenario' suit sc)
    var v = M.solde(F(p, { scenario: sc, droitsActuelsTransmissions: !!o.transmissionsActuelles })).soldePublic + S_.economies(sc, o.anneeSante ? { annee: o.anneeSante } : undefined).total;   // H177 : montée en charge de la santé si o.anneeSante
    if (o.hp) v += R2.contribution(F(HP, o.hpOpt || {}), sc).netMd;
    if (o.fraude) v += R2.fraude(sc);
    v -= parentIsoleCout(st, sc, o);
    if (o.holdingsDifferes) v -= holdingsDiffere(st, sc);
    if (o.solidarite) v += solidarite(p, o.solidarite, sc).netMd;
    if (o.franchise) v -= franchiseCout(p, o.franchise, sc);
    return v;
  }

  /** Plus petit taux plat t tel que le solde central ≥ cible (défaut : déficit actuel, « ne pas aggraver »). Balayage de 1 point puis dichotomie. null si aucun jusqu'à tmax. */
  function platNecessaire(st, cible, o, tmax) {
    cible = cible === undefined ? D.deficitActuel : cible; tmax = tmax || 0.80;
    var f = function (t) { return solde(F(st, { tPlat: t }), 'central', o) - cible; }, t, prev = 0, i;
    if (f(0) >= 0) return 0;
    for (t = 0.01; t <= tmax + 1e-9; t = Math.round((t + 0.01) * 100) / 100) {
      if (f(t) >= 0) { var a = prev, b = t; for (i = 0; i < 30; i++) { var m = (a + b) / 2; if (f(m) >= 0) b = m; else a = m; } return b; }
      prev = t;
    }
    return null;
  }

  /** Soldes bas / central / haut à un taux plat donné. */
  function soldes(st, o) { return { bas: solde(st, 'bas', o), central: solde(st, 'central', o), haut: solde(st, 'haut', o) }; }

  /** Palier 1 : taux plat nécessaire, taux retenu (arrondi au demi-point supérieur), soldes. */
  function palier1(x, o) {
    var st0 = stFor(x), t = platNecessaire(st0, undefined, o), tr = Math.ceil(t * 200 - 1e-9) / 200, st = F(st0, { tPlat: tr });
    return { st: st, tPlatExact: t, tPlat: tr, soldes: soldes(st, o), soldesAuTauxExact: soldes(F(st0, { tPlat: t }), o) };
  }

  /** Coût du socle : dérivée du solde central par €/mois de socle (Md€ par €/mois), au taux plat fixé, entre S et S + 100. */
  function penteSocle(st, o) {
    var a = solde(st, 'central', o), b = solde(F(st, { socle: st.socle + 100 }), 'central', o);
    return (a - b) / 100;
  }

  /** Plus haut socle (€/mois par adulte non retraité, au taux plat de st) tel que le solde central ≥ cible (défaut : déficit actuel) : dichotomie entre 0 et 2 000 € (H178 : socle finançable des variantes). */
  function socleFinancable(st, o, cible) {
    cible = cible === undefined ? D.deficitActuel : cible;
    var a = 0, b = 2000, i;
    if (solde(F(st, { socle: a }), 'central', o) < cible) return 0;
    for (i = 0; i < 30; i++) { var m = (a + b) / 2; if (solde(F(st, { socle: m }), 'central', o) >= cible) a = m; else b = m; }
    return a;
  }

  // ---------- Année 1 et année 10
  /** Transition (Md€) : coût ponctuel + recettes perdues pendant le chômage de la reconversion (modele.js coutTransition), par scénario du modèle. */
  function transition(st, sc) { var t = M.coutTransition(F(O.configR(st), { transition: true, scenario: sc })); return { ponctuel: t.ponctuel, recettesPerdues: t.recettes, total: t.ponctuel + t.recettes }; }
  /**
   * Année 1 (transition payée, création de valeur de l'année 1, santé en montée H177, impôt net des holdings non encaissé H179) et année 10 (régime de croisière, création de valeur de l'année 10, affectée au déficit).
   * Le régime de croisière du modèle est statique : aucune croissance de la base n'est comptée en dehors de la création de valeur. ⚠️ H112.
   */
  function horizons(st, o) {
    var out = { an1: {}, an10: {}, an10sansE: {}, regime: {} }, scs = ['bas', 'central', 'haut'];
    scs.forEach(function (sc) {
      var base = solde(st, sc, o), b1 = solde(st, sc, F(opts(o), { anneeSante: 1, holdingsDifferes: true })), b10 = solde(st, sc, F(opts(o), { anneeSante: 10 }));   // H177 : santé en montée (année 1 : 1/25 à 1/1 selon le levier)
      var tr = transition(st, sc), v1 = valeurPourScenario(1, sc), v10 = valeurPourScenario(10, sc);
      out.regime[sc] = base;
      out.an1[sc] = b1 - tr.total + v1.total;
      out.an10[sc] = b10 + v10.total;
      out.an10sansE[sc] = b10 + v10.sansE;
      out.an1[sc + 'Transition'] = tr.total; out.an1[sc + 'Valeur'] = v1.total; out.an10[sc + 'Valeur'] = v10.total; out.an10sansE[sc + 'Valeur'] = v10.sansE;
    });
    return out;
  }

  // ---------- Trajectoire des paliers suivants
  /**
   * Règle de montée : l'année t, le socle est celui de l'année t − 1 majoré des seules recettes de création de valeur CONSTATÉES l'année t − 1 (retard d'un an),
   * par tranches de `tranche` Md€ (défaut 10), converties au coût marginal du socle (pente du modèle, retours d'impôt compris). sansE : on ignore la croissance IA.
   */
  function trajectoire(st, o, scModele, opt) {
    opt = opt || {};
    var tranche = opt.tranche || 10, pente = penteSocle(st, o), out = [], t, rec, paliers, socle;
    for (t = 1; t <= 10; t++) {
      rec = t === 1 ? 0 : (opt.sansE ? valeurPourScenario(t - 1, scModele).sansE : valeurPourScenario(t - 1, scModele).total);
      paliers = Math.max(0, Math.floor(rec / tranche));
      socle = st.socle + paliers * tranche / pente;
      out.push({ annee: t, recettesConstatees: rec, paliers: paliers, socle: socle });
    }
    return { penteMdParEuro: pente, eurosParTranche: tranche / pente, annees: out };
  }

  // ---------- Taux marginaux par décile
  /** Taux marginaux personnels (impôt à plat + continu) par bande de revenu d'activité et taux combiné IS + dividende (central). Le plancher RSA et la sortie du chômage dégressif ne sont pas dans ces taux. */
  function marginaux(st, o) {
    var p = F(O.configR(st), { scenario: 'central' }), P = M.param(p);
    return M.effetsParDecile(p).map(function (b) {
      return { id: b.id, tauxMoyen: b.tauxMoyen, tauxMarginal: b.tauxMarginalEff, avecIS: 1 - (1 - P.tIS) * (1 - b.tauxMarginalEff), ecartMois: b.ecartMois, partGagnants: b.partGagnants };
    });
  }
  /** Taux marginal maximal (limite à l'infini) et combiné IS + dividende ; revenu mensuel (€) de fin du plancher RSA non progressif (sortie à 100 %). */
  function marginalMax(st) {
    var p = O.configR(st), m = O.marginalR(p);
    return { personnel: m.personnel, combine: m.combineDividende, finPlancherRSA: (D.rsa.niveau - st.socle) / (1 - st.tPlat) };
  }

  // ---------- Cas types
  var NET_PAR_REVENU = FA.netApresIR;   // « avant » d'un cadre : net moins IR (fiscalite_actuelle.js, H105)
  var CADRES = [
    { id: 'cadre10k', libelle: 'Cadre à 10 000 € nets par mois (coût employeur ≈ 18 390 €)', net: 10000 },
    { id: 'cadre15k', libelle: 'Cadre à 15 000 € nets par mois (coût employeur ≈ 27 584 €)', net: 15000 }
  ].map(function (c) {
    return { id: c.id, libelle: c.libelle, adultes: 1, enfants: 0, age: 45, heuresSemaine: 35, coutMensuelPlein: c.net * L_PAR_NET, actuel: NET_PAR_REVENU(c.net),
      actuelNote: '⚠️ « avant » = net moins IR 2025 estimé (H101), coût employeur lu dans la table T14 (H110)' };
  });

  /** Revenu mensuel d'un cas d'activité, avec les correctifs éventuels (franchise, contribution de solidarité) calculés à part. */
  function casActifSource(id) {
    var i, c = null;
    for (i = 0; i < M.CAS.length; i++) if (M.CAS[i].id === id) c = M.CAS[i];
    if (c) return c;
    for (i = 0; i < CADRES.length; i++) if (CADRES[i].id === id) return CADRES[i];
    return null;
  }
  // H181 (audit A9) : un seul « avant » pour le cadre à 60 k€ brut (3 900 € nets) : net moins IR calculé (`FA.netApresIR`, 3 383 €), comme dans hauts_revenus.js ; l'interpolation T14 de modele.js (3 423 €) n'est plus utilisée ici.
  var CAS_ACTIFS = ['smic15', 'smic35', 'couple2enfants', 'cadre60', 'cadre8k', 'cadre10k', 'cadre15k', 'dirigeantHolding'];
  var CADRE8K_SRC = { id: 'cadre8k', libelle: 'Cadre à 8 000 € nets par mois (coût employeur ≈ 14 712 €)', adultes: 1, enfants: 0, age: 45, heuresSemaine: 35, coutMensuelPlein: FA.coutEmployeurDepuisNet(8000), actuel: FA.netApresIR(8000), actuelNote: '« avant » = net moins IR (fiscalite_actuelle.js, H105)' };

  /** Cas types d'actifs : avant, après (palier 1 + correctifs de o), écart. Les correctifs s'ajoutent au calcul du modèle (franchise : crédit tPlat × min(R ; F) ; contribution : x × (L − seuil)). */
  function casActifs(st, o) {
    o = opts(o);
    var p = F(O.configR(st), { scenario: 'central' });
    return CAS_ACTIFS.map(function (id) {
      var s = id === 'cadre8k' ? CADRE8K_SRC : id === 'cadre60' ? F(casActifSource(id), { actuel: FA.netApresIR(3900) }) : casActifSource(id), x = M.situation(s, p), apres = x.apresMois, adultes = s.adultes || 1, emp = s.deuxEmplois ? 2 : 1;
      if (o.franchise) apres += p.tPlat * Math.min(x.R / adultes, o.franchise) * adultes / 12;
      if (o.solidarite) {
        var L = s.coutMensuelPlein || (s.coutHoraire * 35 * 52 / 12);
        apres -= o.solidarite.taux * Math.max(0, L - o.solidarite.seuilNet * L_PAR_NET) * emp;
      }
      var r = { id: id, libelle: s.libelle, avantMois: s.actuel, apresMois: apres, ecartMois: apres - s.actuel };
      if (s.actuelEco !== undefined) { r.avantEcoMois = s.actuelEco; r.apresEcoMois = x.apresEcoMois + (apres - x.apresMois); r.ecartEcoMois = r.apresEcoMois - s.actuelEco; }   // revenu économique : cash + bénéfices retenus (après IS)
      return r;
    });
  }

  /** Chômeurs (revenu mensuel, € : loi actuelle, palier 1 avec plancher RSA) aux mois 2, 5, 9, 15, pour un net antérieur au Smic et un cadre à 5 000 €. */
  function chomeurs(st) {
    var out = [];
    O.NETS_CHOMAGE.forEach(function (c) {
      if (c.id === 'median') return;
      out.push({ id: c.id, libelle: c.libelle, mois: [2, 5, 9, 15].map(function (m) {
        var r = O.revenuChomage(st.chomage, c.net, st.socle, m), v = st.complRsa ? Math.max(r.voieR, D.rsa.niveau) : r.voieR;
        return { m: m, actuel: r.actuel > 0 ? r.actuel : D.rsa.niveau, apres: v, ecart: v - (r.actuel > 0 ? r.actuel : D.rsa.niveau) };
      }) });
    });
    return out;
  }

  /** Autres cas types (voie R, plancher RSA, parent isolé avec plancher ciblé, retraités avec contribution des hautes pensions). */
  function casAutres(st, o) {
    o = opts(o);
    var p = F(O.configR(st), { scenario: 'central' }), ids = ['couple1smic2enf', 'parentIsole', 'aah', 'etudiant', 'rsa'], out = [];
    O.casR(p).forEach(function (c) {
      if (ids.indexOf(c.id) < 0) return;
      var apres = c.apresMois;
      if (c.id === 'parentIsole' && o.parentIsole) apres = Math.max(apres, o.plancherParentIsole);
      out.push({ id: c.id, libelle: c.libelle, avantMois: c.avantMois, apresMois: apres, ecartMois: apres - c.avantMois });
    });
    var hp = F(HP, o.hpOpt || {});
    R2.casRetraites(hp).forEach(function (c) { out.push({ id: c.id, libelle: c.libelle, avantMois: c.avantMois, apresMois: c.apresMois, ecartMois: c.ecartMois }); });
    return out;
  }

  var API = { BASE: BASE, HP: HP, PARENT_ISOLE: PARENT_ISOLE, OPT: OPT, L_PAR_NET: L_PAR_NET, VAL: VAL, APPARIEMENT: APPARIEMENT,
    valeur: valeur, valeurPourScenario: valeurPourScenario, parentIsoleCout: parentIsoleCout, solidarite: solidarite, franchiseCout: franchiseCout, minMoyen: minMoyen,
    solde: solde, soldes: soldes, socleFinancable: socleFinancable, holdingsDiffere: holdingsDiffere, platNecessaire: platNecessaire, palier1: palier1, penteSocle: penteSocle, transition: transition, horizons: horizons, trajectoire: trajectoire,
    marginaux: marginaux, marginalMax: marginalMax, casActifs: casActifs, chomeurs: chomeurs, casAutres: casAutres, stFor: stFor, opts: opts };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Palier1 = API;
})(this);
