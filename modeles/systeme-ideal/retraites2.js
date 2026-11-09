/*
 * modeles/systeme-ideal/retraites2.js — T47, voie R2 : « retraités à pension comparable, minimum garanti, contribution des hautes pensions ».
 * Fonctions pures au-dessus de modele.js, voies.js, sante.js et optimisation.js (charger dans cet ordre). Hypothèses H95 à H106 : methode.md § 13.
 * Décision de l'auteur (01/11/2026) : pas de sanctuarisation totale ; minimum garanti pour tous les retraités, pensions inchangées pour la plupart,
 * contribution des hautes pensions (surtout avec du capital), même logique pour les hauts salaires et l'évasion fiscale. ⚠️ = non confirmé.
 *
 * Base : la voie R (optimisation.js, `configR`) + (a) contribution sur la part des pensions au-dessus d'un seuil S (€ nets par mois, 2025),
 * (b) minimum garanti éventuellement relevé au-dessus de l'ASPA, (c) fraude fiscale : recettes nettes du coût des contrôles, (d) santé (déjà dans soldeCentralR).
 */
(function (root) {
  'use strict';
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var FA = root.FiscaliteActuelle || (typeof require !== 'undefined' ? require('./fiscalite_actuelle.js') : null);
  var O = root.Optimisation || (typeof require !== 'undefined' ? require('./optimisation.js') : null);
  var S_ = root.Sante || (typeof require !== 'undefined' ? require('./sante.js') : null);
  var V = root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null);
  var D = M.DONNEES, F = V.fus;

  // ---------- Données
  /** Distribution de la pension mensuelle NETTE totale (droit direct + réversion + majoration pour enfants, régimes de base et complémentaires) des retraités, fin 2020 :
   *  [borne basse, borne haute (null = ouvert), % des retraités]. DREES, EIR 2020, tableau 7, `sources/t47-r2/drees-eir2020-distribution.xlsx`. */
  var EIR2020_NET = [[0,100,2.47],[100,200,2.57],[200,300,2.46],[300,400,2.24],[400,500,2.08],[500,600,2.17],[600,700,2.51],[700,800,3.61],[800,900,4.74],[900,1000,4.51],[1000,1100,4.6],[1100,1200,4.91],[1200,1300,5.56],[1300,1400,5.6],[1400,1500,5.54],[1500,1600,5.07],[1600,1700,4.63],[1700,1800,4.43],[1800,1900,4.36],[1900,2000,3.51],[2000,2100,3.03],[2100,2200,2.67],[2200,2300,2.24],[2300,2400,1.85],[2400,2500,1.63],[2500,2600,1.39],[2600,2700,1.21],[2700,2800,1.02],[2800,2900,0.87],[2900,3000,0.74],[3000,3100,0.63],[3100,3200,0.57],[3200,3300,0.49],[3300,3400,0.43],[3400,3500,0.38],[3500,3600,0.34],[3600,3700,0.3],[3700,3800,0.25],[3800,3900,0.23],[3900,4000,0.21],[4000,4100,0.19],[4100,4200,0.17],[4200,4300,0.15],[4300,4400,0.12],[4400,4500,0.12],[4500,null,1.23]];
  // Revalorisation 2020 → 2025 des pensions (⚠️ H96 : inflation cumulée ≈ 15,5 % de mémoire, Insee IPC ; les pensions du régime de base ont suivi l'inflation avec retard)
  var REVAL = 1.155;
  // Salaires du secteur privé 2023, EQTP, € nets par mois : médiane, D9, top 1 %, top 0,1 % (Insee, France portrait social 2025 ; Insee Première 2020 pour D9 et la moyenne)
  var SALAIRES = { mediane: 2183, d9: 4300, top1: 10219, top01: 27066, moyenne: 2735, salaries: 27.0211e6 };
  var N_RETRAITES = D.retraites;
  // Scénarios : fuite (part de la contribution non perçue : expatriation, cumul emploi-retraite en moins, optimisation) ⚠️ H98 ; fraude H103
  var SCEN = {
    bas:     { fuitePension: 0.03, fuiteCapital: 0.10, fraudeRend: 1.50, fraudeCout: 0.10 },
    central: { fuitePension: 0.08, fuiteCapital: 0.25, fraudeRend: 0.80, fraudeCout: 0.10 },
    haut:    { fuitePension: 0.15, fuiteCapital: 0.40, fraudeRend: 0.35, fraudeCout: 0.10 }
  };
  var FRAUDE_ETP = 2000;   // postes de contrôle supplémentaires (⚠️ H103 : ordre de grandeur évoqué par la commission des finances de l'Assemblée, rapport relayé, non relu)

  // ---------- Distribution : points d'intégration (10 points par tranche, 60 quantiles de Pareto pour la tranche ouverte)
  var _pts = null;
  function exposantQueue() {
    var ab = function (t) { var s = 0; EIR2020_NET.forEach(function (b) { if (b[1] === null || b[0] >= t) s += b[2]; }); return s; };
    return Math.log(ab(3500) / ab(4500)) / Math.log(4500 / 3500);
  }
  /** Points (pension nette 2020, poids en part des retraités, décile de pension). */
  function points() {
    if (_pts) return _pts;
    var tot = 0, i, k, out = [], cum = 0;
    EIR2020_NET.forEach(function (b) { tot += b[2]; });
    var a = exposantQueue();
    EIR2020_NET.forEach(function (b) {
      var w = b[2] / tot;
      if (b[1] !== null) { for (k = 0; k < 10; k++) out.push({ x: b[0] + (k + 0.5) * (b[1] - b[0]) / 10, w: w / 10 }); }
      else { for (k = 0; k < 60; k++) { var u = (k + 0.5) / 60; out.push({ x: b[0] * Math.pow(1 - u, -1 / a), w: w / 60 }); } }
    });
    out.forEach(function (p) { p.decile = Math.min(9, Math.floor((cum + p.w / 2) * 10)); cum += p.w; });
    _pts = out;
    return out;
  }
  /** Pension moyenne nette 2025 (€/mois) de la distribution revalorisée. */
  function pensionMoyenne() { return points().reduce(function (s, p) { return s + p.w * p.x * REVAL; }, 0); }
  /** Capital moyen (revenus du capital imposables par an, €) d'un retraité du décile d. Jeu recalé (H134, par défaut de la voie R2) : 20 % du capital courant (≈ 80 Md€), clé 3-5-6-6-7-9-10-12-16-26 % ;
   *  jeu `'ancien'` (H20) : 25 %, clé 1-2-3-4-6-8-10-14-20-32 %, conservé pour comparaison. */
  function capitalDecile(d, jeu) {
    var ancien = jeu === 'ancien';
    return D.capitalCourant * 1e9 * (ancien ? D.partCapitalRetraites : D.partCapitalRetraitesRecherche) * (ancien ? D.capitalRetraitesDecile : D.capitalRetraitesDecileRecherche)[d] / (N_RETRAITES / 10);
  }
  /** Variante « seuil de patrimoine hors résidence principale 300 k€ » (H135) : par décile de pension, part q des retraités dont le patrimoine hors RP dépasse 300 k€ et part kq de leurs revenus du capital
   *  détenue par ces retraités (central de `sources/calculs/t47_pensions_patrimoine.py`, 300 000 tirages, graine 2026 ; bas et haut par scénario). Seuls ces retraités paient sur le capital. */
  var PATRI300 = {
    bas:     { q: [0.061, 0.09, 0.11, 0.131, 0.147, 0.165, 0.192, 0.211, 0.253, 0.334], kq: [0.387, 0.488, 0.56, 0.613, 0.654, 0.686, 0.727, 0.754, 0.805, 0.869] },
    central: { q: [0.027, 0.059, 0.09, 0.113, 0.149, 0.182, 0.222, 0.279, 0.354, 0.515], kq: [0.178, 0.306, 0.408, 0.47, 0.55, 0.613, 0.67, 0.742, 0.804, 0.903] },
    haut:    { q: [0.006, 0.023, 0.048, 0.086, 0.129, 0.185, 0.257, 0.35, 0.493, 0.732], kq: [0.038, 0.118, 0.211, 0.319, 0.412, 0.513, 0.616, 0.718, 0.828, 0.948] }
  };

  // ---------- Contribution des hautes pensions
  var DEFAUT = { seuil: 2500, taux: 0.20, tauxHaut: null, seuilHaut: 4000, base: 'total', majCapital: 0.10, minGaranti: D.aspa.plafond, jeuCapital: 'recherche', seuilPatri: null };   // seuilPatri : null | 300000 (H135)
  function opt(o) { return F(DEFAUT, o || {}); }
  /** Contribution d'un retraité (€ par an) de pension nette pn (€/mois 2025) et de revenus du capital K (€/an). Brute : avant fuite. Retourne { pension, capital }. */
  function contributionIndiv(pn, K, o) {
    o = opt(o);
    var S = o.seuil, th = o.tauxHaut === null ? o.taux : o.tauxHaut, SH = Math.max(o.seuilHaut, S);
    function tranche(x) { return o.taux * Math.max(0, Math.min(x, SH) - S) + th * Math.max(0, x - SH); }   // € par mois, deux tranches
    var cp = tranche(pn);
    var cc = 0;
    if (o.base === 'total' && K > 0) {
      var T = pn + K / 12, ct = tranche(T) - cp;                                   // part de l'excédent de revenu total due au capital
      cc = ct + o.majCapital * Math.max(0, Math.min(K / 12, Math.max(0, T - S)));   // majoration sur la part du capital au-dessus du seuil
    }
    return { pension: 12 * cp, capital: 12 * cc };
  }
  /** Contribution totale (Md€/an) par scénario : brute, nette de la fuite, effectifs concernés. */
  function contribution(o, scenario) {
    o = opt(o);
    var sc = SCEN[scenario || 'central'], brutP = 0, brutC = 0, concernes = 0, i, pts = points();
    for (i = 0; i < pts.length; i++) {
      var p = pts[i], pn = p.x * REVAL, K = capitalDecile(p.decile, o.jeuCapital), c, cp;
      if (o.seuilPatri) {   // H135 : le capital n'est taxé que chez les retraités patrimonialisés (q), qui en détiennent la part kq
        var t = PATRI300[scenario || 'central'], q = t.q[p.decile], kq = t.kq[p.decile];
        cp = contributionIndiv(pn, 0, o).pension;
        c = contributionIndiv(pn, K * kq / q, o);
        brutP += p.w * cp; brutC += p.w * q * c.capital;
        if (cp > 0) concernes += p.w; else if (c.capital > 0) concernes += p.w * q;
        continue;
      }
      c = contributionIndiv(pn, K, o);
      brutP += p.w * c.pension; brutC += p.w * c.capital;
      if (c.pension + c.capital > 0) concernes += p.w;
    }
    var f = 1e-9 * N_RETRAITES;
    return { pensionBruteMd: brutP * f, capitalBruteMd: brutC * f, brutMd: (brutP + brutC) * f,
      netMd: (brutP * (1 - sc.fuitePension) + brutC * (1 - sc.fuiteCapital)) * f, concernes: concernes * N_RETRAITES, partConcernes: concernes };
  }

  // ---------- Minimum garanti
  /** Manque moyen par retraité (€/mois) sous un minimum m : E[max(0 ; m − pension nette 2025)]. */
  function manque(m) { return points().reduce(function (s, p) { return s + p.w * Math.max(0, m - p.x * REVAL); }, 0); }
  /** Coût du minimum garanti m (Md€/an), ASPA comprise. Étalonné sur l'ASPA actuelle (4,6 Md€ au plafond de 1 043,59 €/mois) : le coût est proportionnel
   *  au manque (même ciblage : un retraité n'a droit qu'en l'absence d'autres ressources du foyer ⚠️ H100). */
  function coutMinGaranti(m) { return D.aspaMd * manque(m) / manque(D.aspa.plafond); }
  /** Surcoût par rapport à la voie R (qui conserve l'ASPA actuelle déjà comptée hors du solde). */
  function surcoutMinGaranti(m) { return Math.max(0, coutMinGaranti(m) - D.aspaMd); }

  // ---------- Fraude : recettes nettes
  /** Recettes nettes de la lutte contre la fraude (Md€/an) : ETP supplémentaires × (rendement marginal encaissé − coût complet), en M€ par poste. */
  function fraude(scenario, etp) {
    var s = SCEN[scenario || 'central'];
    return (etp === undefined ? FRAUDE_ETP : etp) * (s.fraudeRend - s.fraudeCout) / 1000;
  }

  // ---------- Hauts salaires : masse au-dessus de seuils (queue de Pareto ajustée entre D9 et top 1 %, puis top 1 % et top 0,1 %)
  function masseSalaires(seuil) {
    var s = SALAIRES, a1 = Math.log(10) / Math.log(s.top1 / s.d9), a2 = Math.log(10) / Math.log(s.top01 / s.top1);
    var n = s.salaries, frac, mean, a, x0, f0;
    // sous D9 (4 300 €) : extrapolation de la même queue ⚠️
    if (seuil <= s.top1) { a = a1; x0 = s.d9; f0 = 0.10; } else { a = a2; x0 = s.top1; f0 = 0.01; }
    frac = f0 * Math.pow(seuil / x0, -a);
    mean = seuil * a / (a - 1);
    return { seuil: seuil, part: frac, effectifs: frac * n, masseNetteMd: frac * n * mean * 12 / 1e9, excedentMd: frac * n * (mean - seuil) * 12 / 1e9, exposant: a };
  }

  // ---------- Bilan d'une variante R2
  /** Solde public central (ou autre scénario) de la voie R2 = voie R avec santé + contribution nette + fraude − surcoût du minimum garanti. */
  function soldeR2(st, o, scenario) {
    var sc = scenario || 'central', p = O.configR(st);
    var base = M.solde(F(p, { scenario: sc })).soldePublic + S_.economies(sc).total;
    return base + contribution(o, sc).netMd + fraude(sc) - surcoutMinGaranti(opt(o).minGaranti);
  }
  /** Recettes nouvelles de R2 par rapport à R (Md€/an), par scénario. */
  function recettesR2(o) {
    var out = {};
    ['bas', 'central', 'haut'].forEach(function (sc) { var c = contribution(o, sc); out[sc] = { contribution: c.netMd, fraude: fraude(sc), minGaranti: -surcoutMinGaranti(opt(o).minGaranti), total: c.netMd + fraude(sc) - surcoutMinGaranti(opt(o).minGaranti) }; });
    return out;
  }

  /** Plus haut socle finançable (€/mois, non retraités) pour la variante o : même recherche que `Optimisation.socleMaxR`, décalée de la recette R2.
   *  Le meilleur solde de la voie R en fonction du socle est interpolé sur une grille (pas 100 €) : il ne dépend pas de la variante. */
  var _cache = {};
  function meilleurR(S, cap, base, tMaxListe) {
    var key = [S, cap, JSON.stringify(base), tMaxListe.join()].join('|');
    if (_cache[key]) return _cache[key];
    var best = null, st0 = F(O.BASE_R, base || {}), t;
    tMaxListe.forEach(function (tm) {
      if (tm > cap + 1e-9) return;
      for (t = 0; t <= cap - tm + 1e-9; t = Math.round((t + 0.02) * 100) / 100) {
        var v = O.soldeCentralR(O.configR(F(st0, { socle: S, tMax: tm, tPlat: t })));
        if (!best || v > best.v) best = { v: v, tPlat: t, tMax: tm };
      }
    });
    _cache[key] = best;
    return best;
  }
  function socleMaxR2(o, plafond, cible, inclureIS, base, tMaxListe) {
    var st0 = F(O.BASE_R, base || {}), cap = plafond, lst = tMaxListe || [0.20, 0.30, 0.40];
    if (inclureIS) cap = Math.min(cap, 1 - (1 - plafond) / (1 - st0.tIS));
    var shift = contribution(o, 'central').netMd + fraude('central') - surcoutMinGaranti(opt(o).minGaranti);
    var seuil = cible === 'neutre' ? D.deficitActuel : 0;
    var grille = [], S, v;
    for (S = 0; S <= 1500; S += 100) grille.push({ S: S, b: meilleurR(S, cap, base, lst) });
    function vAt(x) { var i = Math.min(grille.length - 2, Math.floor(x / 100)), a = grille[i], b = grille[i + 1]; return a.b.v + (b.b.v - a.b.v) * (x - a.S) / 100; }
    if (grille[0].b.v + shift < seuil) return { socle: null, structure: null, shift: shift };
    if (grille[grille.length - 1].b.v + shift >= seuil) return { socle: 1500, structure: null, shift: shift };
    var lo = 0, hi = 1500, i;
    for (i = 0; i < 40; i++) { var m = (lo + hi) / 2; if (vAt(m) + shift >= seuil) lo = m; else hi = m; }
    var b = meilleurR(Math.round(lo / 50) * 50, cap, base, lst);   // structure de taux au socle arrondi (indicatif)
    return { socle: lo, structure: F(st0, { socle: lo, tMax: b.tMax, tPlat: b.tPlat }), shift: shift };
  }


  /** Plus petit taux plat t (pas de 1 point, puis dichotomie) tel que le solde central de R2 ≥ cible (Md€/an) pour une structure st (socle, tMax…) et une variante o. null si aucun jusqu'à tmax. */
  function platNecessaireR2(st, o, cible, tmax) {
    cible = cible || 0; tmax = tmax || 0.80;
    var f = function (t) { return soldeR2(F(st, { tPlat: t }), o, 'central') - cible; }, t, prev = 0;
    if (f(0) >= 0) return 0;
    for (t = 0.01; t <= tmax + 1e-9; t = Math.round((t + 0.01) * 100) / 100) {
      if (f(t) >= 0) { var a = prev, b = t, i; for (i = 0; i < 30; i++) { var m = (a + b) / 2; if (f(m) >= 0) b = m; else a = m; } return b; }
      prev = t;
    }
    return null;
  }

  // ---------- Perdants : retraités (impôt actuel : taux moyen CSG + IR de H9 du modèle ; ici contribution supplémentaire seule, avant fuite)
  /** Retraité type : pension nette pn (€/mois), capital K (€/an) → revenu net mensuel « avant » (pension − IR estimé + capital net de PFU), contribution, « après ». */
  function casRetraite(pn, K, o, libelle) {
    var avant = pn - impotRetraite(pn, K) / 12 + K * (1 - D.pfu) / 12, c = contributionIndiv(pn, K, o);
    if (K === 0) avant = Math.max(avant, D.aspa.plafond);                     // loi actuelle : l'ASPA relève une pension modeste à 1 043,59 € (sans autre ressource)
    var apres = avant - (c.pension + c.capital) / 12;
    if (K === 0) apres = Math.max(apres, opt(o).minGaranti);                  // R2 : le minimum garanti (au moins l'ASPA actuelle)
    return { libelle: libelle, pensionNette: pn, capitalAn: K, avantMois: avant, contributionMois: (c.pension + c.capital) / 12, apresMois: apres, ecartMois: apres - avant, partEcart: (apres - avant) / avant };
  }
  /** Impôt sur le revenu d'un retraité seul (€/an) : appelle `fiscalite_actuelle.js` (barème 2025, décote, CSG non déductible, abattement de 10 % plafonné ; audit B4, H182). Le capital est au PFU (K : non utilisé ici). */
  function impotRetraite(pn, K) { return FA.irRetraiteSeul(pn); }
  /** Taux marginal total d'un retraité seul de pension nette pn : IR marginal + CSG (8,3 %) + contribution R2. ⚠️ H101. */
  function margRetraite(pn, o) {
    var tm = (FA.irRetraiteSeul(pn + 1) - FA.irRetraiteSeul(pn)) / 12;   // taux marginal d'IR par différence finie (+1 € de pension nette par mois), décote et plafond de l'abattement compris
    var th = opt(o).tauxHaut === null ? opt(o).taux : opt(o).tauxHaut;
    var c = pn <= opt(o).seuil ? 0 : pn <= Math.max(opt(o).seuilHaut, opt(o).seuil) ? opt(o).taux : th;
    return tm + 0.083 + c;
  }
  var CAS_RETRAITES = [
    { id: 'ret3500', libelle: 'Retraité à 3 500 € nets par mois, sans capital', pn: 3500, K: 0 },
    { id: 'ret2200cap', libelle: 'Retraité à 2 200 € nets par mois avec 15 000 € de revenus du capital par an', pn: 2200, K: 15000 },
    { id: 'ret1750', libelle: 'Retraité à 1 750 € nets par mois (pension médiane)', pn: 1750, K: 0 },
    { id: 'ret800', libelle: 'Retraité à 800 € nets par mois (minimum garanti)', pn: 800, K: 0 }
  ];
  function casRetraites(o) { return CAS_RETRAITES.map(function (c) { var r = casRetraite(c.pn, c.K, o, c.libelle); r.id = c.id; r.margTotal = margRetraite(c.pn, o); return r; }); }

  /** Actifs de la voie R (cadre à 8 000 € nets par mois, dirigeant avec holding) pour une structure st : revenu « avant » (⚠️ estimation) et « après » (modèle). */
  var CADRE8K = { id: 'cadre8k', libelle: 'Cadre à 8 000 € nets par mois (coût employeur ≈ 14 712 €)', adultes: 1, enfants: 0, age: 45, heuresSemaine: 35, coutMensuelPlein: FA ? FA.coutEmployeurDepuisNet(8000) : 14712,
    actuel: FA ? FA.netApresIR(8000) : 8000 - 20519 / 12, actuelNote: '« avant » = 8 000 € nets moins l\'IR calculé (fiscalite_actuelle.js, H105)' };
  function casActifs(st) {
    var p = O.configR(st), idx = function (id) { for (var i = 0; i < M.CAS.length; i++) if (M.CAS[i].id === id) return M.CAS[i]; };
    return [CADRE8K, idx('cadre60'), idx('dirigeantHolding')].map(function (c) {
      var x = M.situation(c, F(p, { scenario: 'central' }));
      return { id: c.id, libelle: c.libelle, avantMois: c.actuel, apresMois: x.apresMois, ecartMois: x.apresMois - c.actuel, partEcart: (x.apresMois - c.actuel) / c.actuel, impotAn: x.impotAn, tauxMoyen: x.tauxMoyen };
    });
  }

  var API = { EIR2020_NET: EIR2020_NET, REVAL: REVAL, SALAIRES: SALAIRES, SCEN: SCEN, FRAUDE_ETP: FRAUDE_ETP, DEFAUT: DEFAUT, opt: opt, points: points, exposantQueue: exposantQueue,
    pensionMoyenne: pensionMoyenne, capitalDecile: capitalDecile, PATRI300: PATRI300, contributionIndiv: contributionIndiv, contribution: contribution, manque: manque, coutMinGaranti: coutMinGaranti,
    surcoutMinGaranti: surcoutMinGaranti, fraude: fraude, masseSalaires: masseSalaires, soldeR2: soldeR2, recettesR2: recettesR2, socleMaxR2: socleMaxR2, platNecessaireR2: platNecessaireR2, casRetraite: casRetraite,
    casRetraites: casRetraites, casActifs: casActifs, impotRetraite: impotRetraite, margRetraite: margRetraite, CAS_RETRAITES: CAS_RETRAITES };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Retraites2 = API;
})(this);
