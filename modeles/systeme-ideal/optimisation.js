/*
 * modeles/systeme-ideal/optimisation.js — T47, recherche systématique de la combinaison qui maximise la marge d'investissement
 * (scénario central, IS conservé, santé comprise) sous contraintes. Fonctions pures au-dessus de modele.js, voies.js et sante.js
 * (charger dans cet ordre). Hypothèses H65 à H70 : methode.md § 9. ⚠️ = non confirmé.
 *
 * Contraintes : (1) taux marginal effectif total (impôt personnel + sortie du socle, travail seul, R de 3 000 € à 3 M€ par an,
 * limite à l'infini comprise) ≤ plafond ; (2) personne sous le socle : aucun cas type sous son socle, retraité modeste au plancher ASPA,
 * personne au RSA au plancher de 877 € (les compléments ASPA, AAH différentielle et RSA sont toujours actifs) ; (3) smicard à 35 h non perdant
 * (écart ≥ −10 €/mois, soit 0,6 % de 1 707 €) ; (4) retraité modeste non perdant (écart ≥ −0,5 €/mois).
 * Objectif : solde public central (−169,1 + Δ + santé centrale) ; la marge d'investissement est max(0, solde).
 * Méthode : pour chaque structure (socle, forme, t_max, R0, prime, sous-indexation, IS, holdings), le taux plat est borné par le plafond
 * (borne exacte : plafond − taux marginal de la structure à taux plat nul) puis descendu par pas de 1 point jusqu'à la première valeur
 * qui satisfait la contrainte « smicard » ; on garde le meilleur des trois premiers taux admissibles (garde-fou contre un maximum de Laffer).
 *
 * AUDIT CONTRADICTOIRE (01/11/2026, resultats.md § 9, methode.md H71 à H75) : `st.audit = true` (ou `balayer(..., { audit: true })`) active trois correctifs
 * (sous-indexation nette de l'impôt sur les pensions, rétroaction du capital des retraités, neutralisation des holdings limitée au dixième supérieur) ;
 * `groupes(p)` chiffre les groupes que les contraintes ne couvrent pas (retraités de pension moyenne, chômeurs indemnisés, parents isolés, étudiants boursiers) ;
 * `opts.perteMaxRetraites` (fraction) ajoute la contrainte « un retraité de 1 200, 1 500 ou 1 750 € brut ne perd pas plus de x % ».
 */
(function (root) {
  'use strict';
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var V = root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null);
  var S = root.Sante || (typeof require !== 'undefined' ? require('./sante.js') : null);
  var D = M.DONNEES, F = V.fus;

  var TOL_SMIC = -10, TOL_RETRAITE = -0.5;
  var GRILLE = {
    socle: [500, 550, 600, 650, 700, 800, 900, 1000],
    formes: [{ mode: 'uniforme', R1: 0 }, { mode: 'lineaire', R1: 1500 }, { mode: 'lineaire', R1: 2000 }, { mode: 'lineaire', R1: 2500 }, { mode: 'lineaire', R1: 3000 }, { mode: 'lineaire', R1: 4000 },
      { mode: 'exp', R1: 1000 }, { mode: 'exp', R1: 1500 }, { mode: 'exp', R1: 2000 }, { mode: 'exp', R1: 3000 }],
    tMax: [0, 0.05, 0.10, 0.20, 0.25, 0.30, 0.40],
    R0: [12000, 18000, 24000, 30000],
    prime: [0, 100, 200],                 // montant plein de la prime progressive (€/mois à 15 h), 0 = aucune
    sousIndexation: [0, 0.005, 0.01, 0.015],
    tIS: [0.25, 0.30],
    holdings: [false, true]
  };

  /** Grille bornée par des valeurs défendables (resultats.md § 10) : R0 fixé à 24 000 € (la variante 18 000 € la remplace), socle 600-900 €, sous-indexation 0-1 point, IS 25-30 %, majoration enfant 200-400 €. */
  var GRILLE_PIERRE = {
    socle: [600, 650, 700, 750, 800, 900],
    formes: [{ mode: 'uniforme', R1: 0 }, { mode: 'lineaire', R1: 2000 }, { mode: 'lineaire', R1: 3000 }, { mode: 'exp', R1: 1500 }, { mode: 'exp', R1: 2000 }, { mode: 'exp', R1: 3000 }],
    tMax: [0, 0.10, 0.20, 0.30, 0.40], R0: [24000], prime: [0, 100, 200], sousIndexation: [0, 0.005, 0.01], tIS: [0.25, 0.30], holdings: [false, true], enfant: [200, 300, 400]
  };

  /** Configuration complète du modèle pour une structure. */
  function config(st) {
    var f = st.forme || { mode: 'uniforme', R1: 0 };
    return F(V.BASE_IS, F(V.CIBLES_A, {
      socle: st.socle, socleMode: f.mode, R1: f.R1 || 2500, archi: 'c2', tPlat: st.tPlat === undefined ? 0 : st.tPlat, tMax: st.tMax, R0: st.R0,
      prime: st.prime > 0 ? 'progressive' : 'aucune', primeMontant: st.prime > 0 ? st.prime : 200,
      sousIndexation: st.sousIndexation || 0, isConserve: true, tIS: st.tIS, holdings: !!st.holdings, surcoteSeule: 0, imposerComplements: true,
      enfant: st.enfant || 200, anneesIndexation: st.anneesIndexation || 10, sousIndexationNette: !!st.audit, retraitesReactions: !!st.audit, couvertureHoldings: st.audit ? 'sommet' : 'tout'
    }));
  }

  /** Surcoût du plancher ASPA que le modèle sous-estime en socle dégressif (le retraité de pension moyenne ASPA reçoit alors max(pension, socle dégressif) et non max(pension, S)), Md€/an. */
  function correctionASPA(p) {
    var P = M.param(p);
    if (!P.complAspa || !P.socleMode || P.socleMode === 'uniforme') return 0;
    var pm = D.aspa.pensionMoy, Sd = M.socleFn(12 * pm, 0, P);
    var modele = Math.max(0, D.aspa.plafond - Math.max(P.socle, pm)), vrai = Math.max(0, D.aspa.plafond - Math.max(Sd, pm));
    return D.aspa.n * (vrai - modele) * 12 / 1e9;
  }

  /** Bilan avec santé et correction : solde par scénario (Md€/an) et marge d'investissement = max(0, solde central). */
  function bilan(p) {
    var b = V.bilan(p), c = correctionASPA(p);
    var eb = S.economies('bas').total, ec = S.economies('central').total, eh = S.economies('haut').total;
    var sb = b.soldeBas + eb - c, sc = b.soldeCentral + ec - c, sh = b.soldeHaut + eh - c;
    return { soldeBas: sb, soldeCentral: sc, soldeHaut: sh, marge: Math.max(0, sc), margeBas: Math.max(0, sb), margeHaut: Math.max(0, sh), correctionASPA: c,
      sansSante: b.soldeCentral - c, santeCentral: ec };
  }

  // ---------- Audit : groupes que les contraintes publiées ne couvrent pas (⚠️ « avant » et effectifs : ordres de grandeur, voir resultats.md § 9.4)
  function netPension(p) { return p - M.interp(D.tauxPensionActuel, p) * p; }
  var GROUPES = [
    { id: 'ret1200', libelle: 'Retraité, pension 1 200 € brut', n: D.retraites / 10, s: { adultes: 1, enfants: 0, age: 75, retraite: true, pensionBruteMois: 1200, actuel: netPension(1200) }, note: 'D3 des pensions (≈ 1,65 M de personnes par décile)' },
    { id: 'ret1500', libelle: 'Retraité, pension 1 500 € brut', n: D.retraites / 10, s: { adultes: 1, enfants: 0, age: 75, retraite: true, pensionBruteMois: 1500, actuel: netPension(1500) }, note: 'D4-D5' },
    { id: 'ret1750', libelle: 'Retraité, pension 1 750 € brut (médiane)', n: D.retraites / 10, s: { adultes: 1, enfants: 0, age: 75, retraite: true, pensionBruteMois: 1750, actuel: netPension(1750) }, note: 'D5-D6' },
    { id: 'ret2000', libelle: 'Retraité, pension 2 000 € brut', n: D.retraites / 10, s: { adultes: 1, enfants: 0, age: 75, retraite: true, pensionBruteMois: 2000, actuel: netPension(2000) }, note: 'D6-D7 (ajouté le 01/11 pour la contrainte « pensions < 2 000 € non perdantes »)' },
    { id: 'chomeur', libelle: 'Chômeur indemnisé (allocation moyenne 37,1 Md€ / 2,62 M / 12 = 1 180 €)', n: 2.62e6, s: { adultes: 1, enfants: 0, age: 40, heuresSemaine: 0, actuel: 37.1e9 / 2.62e6 / 12 }, note: 'Unédic, 2025 (recherche-donnees-simulateur.md § 3.3)' },
    { id: 'parentIsole', libelle: 'Parent isolé sans emploi, 2 enfants (RSA majoré + aide au logement + allocations ≈ 1 650 €)', n: 0.5e6, s: { adultes: 1, enfants: 2, age: 35, heuresSemaine: 0, actuel: 1650 }, note: '⚠️ « avant » et effectif (≈ 0,5 M) estimés de mémoire ; 2,00 M de familles monoparentales au total (RP2023)' },
    { id: 'etudiant', libelle: 'Étudiant boursier (bourse + aide au logement ≈ 730 €)', n: 0.75e6, s: { adultes: 1, enfants: 0, age: 21, heuresSemaine: 0, actuel: 730 }, note: '⚠️ « avant » et effectif (≈ 0,75 M de boursiers) estimés de mémoire' }
  ];
  /** Groupes hors contraintes : € par mois avant / après, écart, effectif, perte annuelle totale (Md€, perte positive). */
  function groupes(p) {
    return GROUPES.map(function (g) {
      var x = M.situation(g.s, p), P = M.param(p);
      var apres = x.apresMois;
      if (g.id === 'parentIsole' && P.complRsa) apres = Math.max(apres, D.rsa.niveau);
      var e = apres - x.avantMois;
      return { id: g.id, libelle: g.libelle, avantMois: x.avantMois, apresMois: apres, ecartMois: e, partPerte: x.avantMois > 0 ? -e / x.avantMois : 0, n: g.n, perteMd: Math.max(0, -e) * 12 * g.n / 1e9, note: g.note };
    });
  }

  function indexCas(id) { for (var i = 0; i < M.CAS.length; i++) if (M.CAS[i].id === id) return i; return -1; }
  /** Contraintes d'un jeu de paramètres (taux plat compris) pour un plafond de taux marginal. */
  function contraintes(p, plafond, opts) {
    opts = opts || {};
    var cas = V.casTypes(p), iS = indexCas('smic35'), iR = indexCas('retraiteModeste'), iA = indexCas('retraiteAise');
    var pm = V.profilMarginal(p), asympt = M.margMax(M.param(p)), marg = Math.max(pm.max, asympt);   // sup à l'infini = t_plat + t_max
    var sousSocle = cas.some(function (x) { return x.sousLeSocle; });
    var rsa = cas[cas.length - 1];
    var floors = cas[iR].apresMois >= D.aspa.plafond - 0.01 && rsa.apresMois >= D.rsa.niveau - 0.01;
    var okRetr = true, perteRetr = 0;
    if (opts.perteMaxRetraites !== undefined) groupes(p).forEach(function (g) { if (g.id.indexOf('ret') === 0) { perteRetr = Math.max(perteRetr, g.partPerte); if (g.partPerte > opts.perteMaxRetraites + 1e-9) okRetr = false; } });
    return {
      okRetraitesElargi: okRetr, perteMaxRetraites: perteRetr,
      marginalMax: marg, marginalAsymptotique: asympt, RMarginalMax: pm.RMensuel,
      okMarginal: marg <= plafond + 1e-9, okSocle: !sousSocle && floors,
      okSmicard: cas[iS].ecartMois >= TOL_SMIC, ecartSmicard: cas[iS].ecartMois,
      okRetraite: cas[iR].ecartMois >= TOL_RETRAITE, ecartRetraiteModeste: cas[iR].ecartMois,
      ok: marg <= plafond + 1e-9 && !sousSocle && floors && cas[iS].ecartMois >= TOL_SMIC && cas[iR].ecartMois >= TOL_RETRAITE && okRetr,
      cas: cas
    };
  }


  // ---------- Contraintes de l'auteur (31/10/2026, resultats.md § 10) : R0 fixé par la grille, minima, chômeurs, retraités, aucune falaise, taux combiné avec l'IS
  var TOL_MINIMA = -5;   // €/mois : « avant » des parents isolés et étudiants estimés à ± 5 % près (⚠️)
  /** Plus forte baisse du revenu disponible quand la pension (0 à 4 000 € brut par mois, pas de 50 €) ou le salaire (0 à 35 h, puis 1 à 10 fois le coût du Smic à 35 h) augmente.
   *  Le plancher ASPA est appliqué comme la loi : différentiel, pour les pensions inférieures au plafond. €/mois, positif = falaise. */
  function falaises(p) {
    var P = M.param(p), prev = null, a, pire = { pension: 0, pensionA: 0, salaire: 0, salaireA: 0 }, pens, h, m;
    for (pens = 0; pens <= 4000; pens += 50) {
      a = M.situation({ adultes: 1, enfants: 0, age: 75, retraite: true, pensionBruteMois: pens, actuel: 0 }, p).apresMois;
      if (P.complAspa && pens < D.aspa.plafond) a = Math.max(a, D.aspa.plafond);
      if (prev !== null && prev - a > pire.pension) { pire.pension = prev - a; pire.pensionA = pens; }
      prev = a;
    }
    prev = null;
    function pas(x) { if (P.complRsa) x = Math.max(x, D.rsa.niveau); return x; }
    for (h = 0; h <= 35; h += 1) {
      a = pas(M.situation({ adultes: 1, enfants: 0, age: 40, heuresSemaine: h, coutHoraire: D.smicCoutHoraire, actuel: 0 }, p).apresMois);
      if (prev !== null && prev - a > pire.salaire) { pire.salaire = prev - a; pire.salaireA = h; }
      prev = a;
    }
    for (m = 1.25; m <= 10; m += 0.25) {
      a = pas(M.situation({ adultes: 1, enfants: 0, age: 40, heuresSemaine: 35, coutHoraire: D.smicCoutHoraire * m, actuel: 0 }, p).apresMois);
      if (prev - a > pire.salaire) { pire.salaire = prev - a; pire.salaireA = 35 * 1000 + m; }
      prev = a;
    }
    pire.max = Math.max(pire.pension, pire.salaire);
    return pire;
  }
  /** Coût annuel (Md€) pendant la transition d'un maintien du revenu des chômeurs indemnisés à (1 − x) de leur allocation actuelle : n × max(0 ; (1 − x) × avant − après) × 12. */
  function transitionChomeurs(p, x) {
    var g = groupes(p).filter(function (y) { return y.id === 'chomeur'; })[0];
    return 2.62e6 * Math.max(0, (1 - x) * g.avantMois - g.apresMois) * 12 / 1e9;
  }
  /**
   * K = { platNul (aucun taux plat : impôt nul sous R0), inclureIS, minima (true, 'parent' ou 'etudiant'), chomeurStructurel (perte max, fraction), perteMaxRetraites (fraction), sansFalaise (tolérance €/mois, undefined = non vérifié), planchers (défaut true) }.
   * Évaluation paresseuse : les contrôles bon marché d'abord. Retourne ok et, si échec, la première contrainte violée (clé raison).
   */
  function verifier(p, plafond, K) {
    K = K || {};
    var cas = V.casTypes(p), iS = indexCas('smic35'), iR = indexCas('retraiteModeste'), r = { ok: false, raison: null, cas: cas };
    if (cas.some(function (x) { return x.sousLeSocle; })) { r.raison = 'sousSocle'; return r; }
    var rsa = cas[cas.length - 1];
    if (!(cas[iR].apresMois >= D.aspa.plafond - 0.01 && rsa.apresMois >= D.rsa.niveau - 0.01)) { r.raison = 'planchers'; return r; }
    if (cas[iS].ecartMois < TOL_SMIC) { r.raison = 'smicard'; return r; }
    if (cas[iR].ecartMois < TOL_RETRAITE) { r.raison = 'retraiteModeste'; return r; }
    var pm = V.profilMarginal(p), asympt = M.margMax(M.param(p)), marg = Math.max(pm.max, asympt), P = M.param(p);
    r.marginalMax = marg; r.marginalAsymptotique = asympt; r.RMarginalMax = pm.RMensuel; r.ecartSmicard = cas[iS].ecartMois; r.ecartRetraiteModeste = cas[iR].ecartMois;
    r.combineDividende = 1 - (1 - P.tIS) * (1 - asympt);
    if (marg > plafond + 1e-9) { r.raison = 'marginal'; return r; }
    if (K.inclureIS && r.combineDividende > plafond + 1e-9) { r.raison = 'dividende'; return r; }
    if (K.minima || K.chomeurStructurel !== undefined || K.perteMaxRetraites !== undefined) {
      var g = groupes(p), perteRetr = 0;
      for (var i = 0; i < g.length; i++) {
        var x = g[i];
        if (K.minima && (x.id === 'parentIsole' || x.id === 'etudiant') && (K.minima === true || K.minima === (x.id === 'parentIsole' ? 'parent' : 'etudiant')) && x.ecartMois < TOL_MINIMA) { r.raison = x.id; return r; }
        if (K.chomeurStructurel !== undefined && x.id === 'chomeur' && x.partPerte > K.chomeurStructurel + 1e-9) { r.raison = 'chomeur'; return r; }
        if (K.perteMaxRetraites !== undefined && x.id.indexOf('ret') === 0) { perteRetr = Math.max(perteRetr, x.partPerte); if (x.partPerte > K.perteMaxRetraites + 1e-9) { r.raison = 'retraites'; return r; } }
      }
      r.perteMaxRetraites = perteRetr;
    }
    if (K.sansFalaise !== undefined) { var f = falaises(p); r.falaise = f; if (f.max > K.sansFalaise + 1e-9) { r.raison = f.pension >= f.salaire ? 'falaisePension' : 'falaiseSalaire'; return r; } }
    r.ok = true;
    return r;
  }
  /** Dimensions de la grille où la structure touche un bord (minimum ou maximum d'une liste de plus d'une valeur). */
  function bords(st, G) {
    var out = [];
    function test(nom, v, liste) { if (liste && liste.length > 1 && (v === liste[0] || v === liste[liste.length - 1])) out.push(nom + ' ' + (v === liste[0] ? 'minimum' : 'maximum') + ' (' + (typeof v === 'object' ? v.mode + ' ' + v.R1 : v) + ')'); }
    test('socle', st.socle, G.socle); test('t_max', st.tMax, G.tMax); test('R0', st.R0, G.R0); test('prime', st.prime, G.prime); test('sous-indexation', st.sousIndexation, G.sousIndexation);
    test('IS', st.tIS, G.tIS); test('majoration enfant', st.enfant, G.enfant);
    return out;
  }
  /** Bilan à l'année 1 (sous-indexation d'un an seulement) et à 10 ans (régime de croisière), avec la transition des chômeurs en année 1 si x est donné. */
  function bilanAnnees(p, xChomeur) {
    var b10 = bilan(p), b1 = bilan(F(p, { anneesIndexation: 1 })), t = xChomeur === undefined ? 0 : transitionChomeurs(p, xChomeur);
    return { an1: { central: b1.soldeCentral - t, bas: b1.soldeBas - t, haut: b1.soldeHaut - t }, an10: { central: b10.soldeCentral, bas: b10.soldeBas, haut: b10.soldeHaut }, transition: t };
  }

  /** Meilleur taux plat d'une structure sous plafond ; null si aucun taux plat admissible (≥ 10 %). */
  function meilleurTaux(st, plafond, opts) {
    var K = opts && opts.K;
    if (K && K.inclureIS) plafond = Math.min(plafond, 1 - (1 - plafond) / (1 - st.tIS));   // taux combiné IS + dividende ≤ plafond : 1 − (1 − tIS)(1 − m) ≤ plafond
    if (K && K.platNul) {   // « personne ne paie sous R0 » : aucun taux plat, seul l'impôt continu (nul sous R0) existe
      var pz = config(F(st, { tPlat: 0 })), cz = verifier(pz, plafond, K);
      return cz.ok ? { st: F(st, { tPlat: 0 }), p: pz, bilan: bilan(pz), contraintes: cz } : null;
    }
    var p0 = config(F(st, { tPlat: 0 })), pm = V.profilMarginal(p0), ms = Math.max(pm.max, st.tMax);
    var tMaxPlat = Math.floor((plafond - ms + 1e-9) * 100) / 100, best = null, trouves = 0, t;
    for (t = Math.min(tMaxPlat, 0.70); t >= 0.10 - 1e-9 && trouves < 3; t = Math.round((t - 0.01) * 100) / 100) {
      var p = config(F(st, { tPlat: t })), c = K ? verifier(p, plafond, K) : contraintes(p, plafond, opts);
      if (!c.ok) continue;
      trouves++;
      var b = bilan(p);
      if (!best || b.soldeCentral > best.bilan.soldeCentral) best = { st: F(st, { tPlat: t }), p: p, bilan: b, contraintes: c };
    }
    return best;
  }

  /** Balayage d'une grille ; filtre(st) optionnel pour restreindre (ex. IS 25 % seulement). Retourne le meilleur, le nombre de structures et de structures admissibles. */
  function balayer(grille, plafond, filtre, opts) {
    opts = opts || {};
    var G = grille || GRILLE, best = null, nStruct = 0, nAdm = 0, tous = [];
    G.socle.forEach(function (s) { G.formes.forEach(function (f) { G.tMax.forEach(function (tm) { G.R0.forEach(function (r0) {
      G.prime.forEach(function (pr) { G.sousIndexation.forEach(function (si) { G.tIS.forEach(function (is) { G.holdings.forEach(function (h) { (G.enfant || [200]).forEach(function (en) {
        var st = { socle: s, forme: f, tMax: tm, R0: r0, prime: pr, sousIndexation: si, tIS: is, holdings: h, enfant: en, audit: !!opts.audit };
        if (filtre && !filtre(st)) return;
        nStruct++;
        var r = meilleurTaux(st, plafond, opts);
        if (!r) return;
        nAdm++;
        if (!best || r.bilan.soldeCentral > best.bilan.soldeCentral) best = r;
      }); }); }); }); }); }); }); }); });
    return { meilleur: best, nStructures: nStruct, nAdmissibles: nAdm };
  }

  /** Frontière marge / taux marginal maximal : une ligne par plafond. */
  function frontiere(plafonds, grille, filtre, opts) {
    return plafonds.map(function (pl) { var r = balayer(grille, pl, filtre, opts); return { plafond: pl, meilleur: r.meilleur, nStructures: r.nStructures, nAdmissibles: r.nAdmissibles }; });
  }

  /** Perdants d'une configuration : cas types qui perdent plus de 5 €/mois, et bandes dont moins de la moitié des personnes gagnent (central). */
  function perdants(p) {
    var cas = V.casTypes(p).filter(function (x) { return x.ecartMois < -5; }).map(function (x) { return { libelle: x.libelle, ecartMois: x.ecartMois }; });
    var bandes = M.effetsParDecile(F(p, { scenario: 'central' })).filter(function (b) { return b.partGagnants < 0.5; }).map(function (b) { return { id: b.id, partGagnants: b.partGagnants, ecartMois: b.ecartMois }; });
    return { cas: cas, bandes: bandes };
  }

  /** Sensibilité : pour chaque paramètre, la meilleure valeur alternative (taux plat réoptimisé) et la perte de solde central (Md€/an) par rapport à la structure donnée. */
  function sensibilite(st, plafond) {
    var ref = meilleurTaux(st, plafond), alt = [
      ['socle 650 € au lieu de ' + st.socle, { socle: 650 }], ['socle 800 €', { socle: 800 }], ['socle 1 000 €', { socle: 1000 }],
      ['IS 25 %', { tIS: 0.25 }], ['holdings non transparentes', { holdings: false }], ['sans prime d\'activité', { prime: 0 }], ['sans sous-indexation des pensions', { sousIndexation: 0 }],
      ['R0 = 24 000 €', { R0: 24000 }], ['t_max = 0 (pas d\'impôt continu)', { tMax: 0 }], ['socle universel', { forme: { mode: 'uniforme', R1: 0 } }],
      ['socle linéaire R1 2 000 €', { forme: { mode: 'lineaire', R1: 2000 } }]
    ];
    return { reference: ref, variantes: alt.map(function (a) {
      var r = meilleurTaux(F(st, a[1]), plafond);
      return { libelle: a[0], admissible: !!r, soldeCentral: r ? r.bilan.soldeCentral : null, ecart: r && ref ? r.bilan.soldeCentral - ref.bilan.soldeCentral : null, tPlat: r ? r.st.tPlat : null };
    }) };
  }

  /** Description courte d'une structure. */
  function decrire(st) {
    var f = st.forme.mode === 'uniforme' ? 'universel' : st.forme.mode === 'lineaire' ? 'linéaire R1 ' + st.forme.R1 : 'exponentiel R1 ' + st.forme.R1;
    return 'socle ' + st.socle + ' € ' + f + ', plat ' + Math.round(st.tPlat * 100) + ' %, t_max ' + Math.round(st.tMax * 100) + ' %, R0 ' + st.R0 + ' €, prime ' + (st.prime > 0 ? st.prime + ' €' : 'aucune') +
      ', sous-indexation ' + (st.sousIndexation * 100) + ' pt, IS ' + Math.round(st.tIS * 100) + ' %, holdings ' + (st.holdings ? 'transparentes' : 'non');
  }

  // ======================================================================
  // Voie R : retraités sanctuarisés (02/11/2026, resultats.md § 11, hypothèses H84 à H93 : methode.md § 12)
  // Pensions, minimum vieillesse et impôt des retraités inchangés ; socle versé aux adultes non retraités (38,7 M) ; il remplace les prestations
  // en espèces hors retraites (périmètre du simulateur, 113,0 Md€ hors ASPA, ou périmètre large). Correctifs de l'audit actifs.
  // ======================================================================
  var BASE_R = { socle: 650, tMax: 0.30, R0: 24000, tIS: 0.25, holdings: true, enfant: 200, aahDiff: true, complRsa: false, chomage: 'remplace', autresRemplacees: 0, jeuCapital: 'ancien' };   // jeuCapital (H134, H176) : 'ancien' = 25 % du capital aux retraités (voie R, resultats.md § 11-12, publiés avant le recalage) ; 'recherche' = 20 % (palier 1 et suivants)
  /** Configuration complète de la voie R pour une structure st (champs de BASE_R + tPlat). */
  function configR(st) {
    var s = F(BASE_R, st || {});
    var p = config({ socle: s.socle, forme: { mode: 'uniforme', R1: 0 }, tPlat: s.tPlat === undefined ? 0 : s.tPlat, tMax: s.tMax, R0: s.R0, prime: 0, sousIndexation: 0,
      tIS: s.tIS, holdings: s.holdings, enfant: s.enfant, audit: true });
    return F(p, { retraitesSanctuarises: true, complAspa: false, aahDifferentielle: !!s.aahDiff, complRsa: !!s.complRsa, imposerComplements: false, sousIndexation: 0,
      chomage: s.chomage, autresRemplacees: s.autresRemplacees, retraite60: false, surcoteSeule: 0, jeuCapitalRetraites: s.jeuCapital });
  }
  /** Solde public central avec santé centrale (Md€/an), sans calcul des autres scénarios (rapide). */
  function soldeCentralR(p) { return M.solde(F(p, { scenario: 'central' })).soldePublic + S.economies('central').total; }
  /** Socle neutre (€/mois par adulte non retraité) : coût brut du socle + majoration enfants = prestations remplacées (statique, avant impôt et réactions). */
  function socleNeutreR(opts) {
    opts = opts || {};
    var rem = D.depensesRemplacees - D.aspaMd + (opts.autresRemplacees || 0), enf = D.enfants * (opts.enfant === undefined ? 200 : opts.enfant) * 12 / 1e9;
    return { prestationsRemplaceesMd: rem, enfantsMd: enf, socle: (rem - enf) * 1e9 / ((D.adultes - D.retraites) * 12) };
  }
  /** Plus petit taux plat t tel que le solde central avec santé ≥ cible (Md€/an) : balayage de 1 point puis dichotomie. null si aucun jusqu'à tmax ; best = meilleur solde trouvé. */
  function platNecessaireR(st, cible, tmax) {
    cible = cible || 0; tmax = tmax || 0.80;
    var f = function (t) { return soldeCentralR(configR(F(st, { tPlat: t }))) - cible; }, t, prev = 0, best = { t: 0, v: f(0) };
    if (best.v >= 0) return { t: 0, best: best };
    for (t = 0.01; t <= tmax + 1e-9; t = Math.round((t + 0.01) * 100) / 100) {
      var v = f(t);
      if (v > best.v) best = { t: t, v: v };
      if (v >= 0) {
        var a = prev, b = t, i;
        for (i = 0; i < 30; i++) { var m = (a + b) / 2; if (f(m) >= 0) b = m; else a = m; }
        return { t: b, best: best };
      }
      prev = t;
    }
    return { t: null, best: best };
  }
  /** Taux marginal effectif maximal d'une configuration : impôt personnel (profil et limite à l'infini) et taux combiné IS + dividende. */
  function marginalR(p) {
    var pm = V.profilMarginal(p), asympt = M.margMax(M.param(p)), P = M.param(p);
    return { personnel: Math.max(pm.max, asympt), RMarginalMax: pm.RMensuel, asymptotique: asympt, combineDividende: 1 - (1 - P.tIS) * (1 - asympt) };
  }
  var AAH_AVANT = D.aah.moyen;
  /** Cas types de la voie R : avant (loi actuelle, ⚠️ ordres de grandeur) ; les autres viennent de M.CAS et optimisation.GROUPES. */
  var CAS_R = [
    { id: 'chomeur', libelle: 'Chômeur indemnisé (allocation moyenne 1 180 €)', s: { adultes: 1, enfants: 0, age: 40, heuresSemaine: 0, actuel: D.chomage.md * 1e9 / D.chomage.n / 12, alloChomageMois: D.chomage.md * 1e9 / D.chomage.n / 12 }, note: 'Unédic 2025' },
    { id: 'couple2enf', libelle: 'Famille : couple, 2 enfants, deux Smic à 35 h', cas: 'couple2enfants' },
    { id: 'couple1smic2enf', libelle: 'Famille : couple, 2 enfants, un seul Smic à 35 h', s: { adultes: 2, enfants: 2, age: 40, heuresSemaine: 35, coutHoraire: D.smicCoutHoraire, actuel: 2552 }, note: '⚠️ « avant » = estimation grossière du simulateur (ma-situation.js, avantActuel : Smic net, prime d\'activité, allocations familiales) ; à recalculer avec OpenFisca ; revenu mis en commun (imposition du foyer)' },
    { id: 'parentIsole', libelle: 'Parent isolé sans emploi, 2 enfants', s: { adultes: 1, enfants: 2, age: 35, heuresSemaine: 0, actuel: 1650 }, rsa: true, note: '⚠️ « avant » estimé de mémoire' },
    { id: 'aah', libelle: 'Allocataire de l\'AAH (moyenne 824 €)', s: { adultes: 1, enfants: 0, age: 45, heuresSemaine: 0, actuel: AAH_AVANT }, aah: true, note: 'DREES 2024 : 13,84 Md€ / 1,40 M / 12' },
    { id: 'etudiant', libelle: 'Étudiant boursier (bourse + aide au logement ≈ 730 €)', s: { adultes: 1, enfants: 0, age: 21, heuresSemaine: 0, actuel: 730 }, note: '⚠️ « avant » estimé de mémoire' },
    { id: 'rsa', libelle: 'Personne seule sans emploi (RSA + aide au logement)', s: { adultes: 1, enfants: 0, age: 40, heuresSemaine: 0, actuel: D.rsa.niveau }, rsa: true, note: 'T14 : 877 €' },
    { id: 'smic15', cas: 'smic15' }, { id: 'smic35', cas: 'smic35' }, { id: 'cadre60', cas: 'cadre60' }, { id: 'dirigeantHolding', cas: 'dirigeantHolding' },
    { id: 'retraiteModeste', cas: 'retraiteModeste' }, { id: 'retraiteAise', cas: 'retraiteAise' }
  ];
  /** Gagnants et perdants de la voie R pour une configuration p : € par mois avant, après, écart (le plancher RSA s'applique si complRsa). */
  function casR(p) {
    var P = M.param(p);
    return CAS_R.map(function (g) {
      var src = g.cas ? M.CAS[indexCas(g.cas)] : g.s, x = M.situation(src, p), apres = x.apresMois;
      if (g.aah && P.aahDifferentielle) apres += Math.max(0, AAH_AVANT - P.socle);
      if (g.rsa && P.complRsa) apres = Math.max(apres, D.rsa.niveau * (g.id === 'parentIsole' ? 1 : 1));
      var avant = src.actuel, e = apres - avant;
      return { id: g.id, libelle: g.libelle || src.libelle, avantMois: avant, apresMois: apres, ecartMois: e, partEcart: avant > 0 ? e / avant : 0, note: g.note || src.actuelNote };
    });
  }
  /** Évaluation complète d'une structure de la voie R : soldes par scénario (santé comprise), taux marginaux, cas types. */
  function evaluerR(st) {
    var p = configR(st), b = bilan(p), m = marginalR(p), c = casR(p);
    return { st: st, p: p, bilan: b, marginal: m, cas: c, delta: M.solde(F(p, { scenario: 'central' })).delta };
  }
  /**
   * Plus haut socle finançable (€/mois) au central. cible : 'equilibre' (solde public central avec santé ≥ 0) ou 'neutre' (Δ ≥ 0 : pas pire qu'aujourd'hui, déficit actuel conservé).
   * Taux : tMax dans `tMaxListe`, taux plat t ∈ [0 ; plafond − tMax] par pas de 1 point ; plafond sur le taux personnel (maximal à l'infini) et, si `inclureIS`, sur le taux combiné IS + dividende.
   * Retourne { socle, structure } ; socle = null si même 0 € ne tient pas, 1 500 si le socle de 1 500 € tient.
   */
  function socleMaxR(base, plafond, cible, inclureIS, tMaxListe) {
    var cap = plafond, st0 = F(BASE_R, base || {}), lst = tMaxListe || [0.20, 0.25, 0.30, 0.35, 0.40, 0.45];
    if (inclureIS) cap = Math.min(cap, 1 - (1 - plafond) / (1 - st0.tIS));
    var seuil = cible === 'neutre' ? D.deficitActuel : 0;   // équilibre : solde central avec santé ≥ 0 ; neutre : Δ ≥ 0 (solde ≥ −169,1 Md€, hors santé comptée en plus)
    function meilleur(S) {
      var best = null, t;
      lst.forEach(function (tm) {
        if (tm > cap + 1e-9) return;
        for (t = 0; t <= cap - tm + 1e-9; t = Math.round((t + 0.01) * 100) / 100) {
          var v = soldeCentralR(configR(F(st0, { socle: S, tMax: tm, tPlat: t })));
          if (!best || v > best.v) best = { v: v, tPlat: t, tMax: tm };
        }
      });
      return best;
    }
    var ok = function (S) { var b = meilleur(S); return { ok: b.v >= seuil, b: b }; };
    var lo = 0, hi = 1500, r0 = ok(lo), i;
    if (!r0.ok) return { socle: null, structure: null };
    if (ok(hi).ok) return { socle: hi, structure: F(st0, { socle: hi, tMax: ok(hi).b.tMax, tPlat: ok(hi).b.tPlat }) };
    for (i = 0; i < 14; i++) { var m = (lo + hi) / 2; if (ok(m).ok) lo = m; else hi = m; }
    var b = ok(lo).b;
    return { socle: lo, structure: F(st0, { socle: lo, tMax: b.tMax, tPlat: b.tPlat }), solde: b.v };
  }

  // ---------- Chômage dans la voie R : variantes dégressives (H91 à H93)
  var NETS_CHOMAGE = [{ id: 'smic', libelle: 'Chômeur au Smic (net antérieur 1 478 €)', net: 1478 }, { id: 'median', libelle: 'Chômeur au salaire médian (net antérieur 2 116 €)', net: 2116 }, { id: 'cadre5000', libelle: 'Chômeur cadre à 5 000 € net', net: 5000 }];
  var ELASTICITES_DUREE = { bas: 0.3, central: 0.5, haut: 0.8 };   // ⚠️ élasticité de la durée du chômage au niveau de l'allocation : ordre de grandeur de la littérature (Schmieder et von Wachter, 2016), non collecté dans le dépôt
  /** Revenu mensuel (€) d'un chômeur de revenu net antérieur `net` au mois m : loi actuelle (ARE simplifiée) et voie R (socle + complément). */
  function revenuChomage(variante, net, S, m) {
    var v = M.CHOMAGE_DEG[variante];
    return { actuel: M.areActuelle(net, m), voieR: S + (v ? M.complementChomage(v, net, S, m) : variante === 'cumul' ? M.areActuelle(net, m) : variante === 'differentiel' ? Math.max(0, M.areActuelle(net, m) - S) : 0) };
  }
  /**
   * Comparaison des variantes de chômage pour un socle S (€/mois) : coût annuel (Md€) et écart avec l'assurance actuelle (37,1 Md€),
   * revenu et perte aux mois 2, 5, 9, 15 pour trois chômeurs, et rétroaction sur la durée (gain de recettes, Md€/an, ⚠️, hors solde).
   * Rétroaction : durée × (allocation moyenne voie R / actuelle)^ε sur le stock ; chaque personne en moins au chômage rapporte 25 k€ de recettes par an (T6, ⚠️).
   */
  function chomageR(S, eps) {
    eps = eps === undefined ? ELASTICITES_DUREE.central : eps;
    var ids = ['remplace', 'deg1', 'deg2', 'deg3', 'differentiel', 'cumul'], a = D.chomage.md * 1e9 / D.chomage.n / 12;
    return ids.map(function (id) {
      var P = M.param({ retraitesSanctuarises: true, socle: S, chomage: id }), cout = M.coutChomage(P);
      var moyen = (cout * 1e9 / D.chomage.n / 12) + S, ratio = Math.min(1, moyen / a);   // revenu moyen d'un indemnisé : socle + complément
      var stockEvite = D.chomage.n * (1 - Math.pow(ratio, eps));
      var cas = NETS_CHOMAGE.map(function (c) {
        return { id: c.id, libelle: c.libelle, mois: [2, 5, 9, 15].map(function (m) { var r = revenuChomage(id, c.net, S, m); return { m: m, actuel: r.actuel, voieR: r.voieR, ecart: r.voieR - r.actuel }; }) };
      });
      return { id: id, nom: id === 'remplace' ? 'socle seul (assurance chômage remplacée)' : id === 'differentiel' ? 'allocation actuelle moyenne maintenue à hauteur de max(0 ; allocation − socle)' : id === 'cumul' ? 'allocation actuelle en plus du socle' : M.CHOMAGE_DEG[id].nom,
        coutMd: cout, economieVsActuelMd: D.chomage.md - cout, partMoyenneCompl: M.CHOMAGE_DEG[id] ? M.partMoyenneCompl(M.CHOMAGE_DEG[id]) : null, revenuMoyenIndemnise: moyen,
        stockEviteMilliers: stockEvite / 1e3, gainRecettesRetroactionMd: stockEvite * 25000 / 1e9, cas: cas };
    });
  }

  var API = { GRILLE: GRILLE, GRILLE_PIERRE: GRILLE_PIERRE, TOL_SMIC: TOL_SMIC, TOL_RETRAITE: TOL_RETRAITE, config: config, correctionASPA: correctionASPA, bilan: bilan, contraintes: contraintes,
    meilleurTaux: meilleurTaux, groupes: groupes, GROUPES: GROUPES, balayer: balayer, frontiere: frontiere, perdants: perdants, falaises: falaises, transitionChomeurs: transitionChomeurs, verifier: verifier, bords: bords, bilanAnnees: bilanAnnees, TOL_MINIMA: TOL_MINIMA, sensibilite: sensibilite, decrire: decrire,
    BASE_R: BASE_R, configR: configR, soldeCentralR: soldeCentralR, socleNeutreR: socleNeutreR, platNecessaireR: platNecessaireR, marginalR: marginalR, CAS_R: CAS_R, casR: casR, evaluerR: evaluerR, socleMaxR: socleMaxR, chomageR: chomageR, revenuChomage: revenuChomage, NETS_CHOMAGE: NETS_CHOMAGE, ELASTICITES_DUREE: ELASTICITES_DUREE };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Optimisation = API;
})(this);
