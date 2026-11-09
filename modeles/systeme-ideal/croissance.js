/*
 * modeles/systeme-ideal/croissance.js — T47, croissance (productivité × emploi) branchée sur demographie.js et age_sante.js (01/11/2026). Fonctions pures.
 * Hypothèses H163 à H168 : methode.md § 18. Sources : sources/recherche-productivite.md.
 * Charger dans l'ordre : modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js croissance.js.
 *
 * Principe : PIB(t) = PIB 2025 × indice d'emploi (module emploi, calé sur le COR) × Π(1 + g_i) (productivité horaire, durée du travail et partage capital/travail stables, comme le COR).
 * L'indice de productivité est transmis à demographie.js comme un g effectif (moyenne géométrique 2025-t) : assiette × (1+g)^k, pensions et socle indexés sur les prix (défaut) ou sur les salaires.
 * Scénarios de productivité (croissance réelle annuelle de la productivité horaire) :
 *   bas 0,4 % (COR 2026 variante basse = rythme observé sur 15 ans), central 0,7 % (COR 2026 référence = rythme observé sur 25 ans), haut 1,0 % (COR 2026 variante haute = rythme sur 35 ans),
 *   ec : trajectoire de l'Ageing Report 2024 pour la France (0,3 % en 2030, 1,5 % en 2040, 1,2 % en 2070, interpolée),
 *   ia (variante HYPOTHÉTIQUE, non une prévision) : central + 0,7 point (médiane Banque de France / Aghion-Bunel) = 1,4 % ; ia_bas : central + 0,07 point (Acemoglu 2024) ; ia_haut : central + 1,3 point (Aghion-Bunel, haut).
 * Mise à jour du 02/11/2026 (audit adverse du 01/11, défauts A1, A2, A3 ; H171 à H175, methode.md § 18) :
 *   - le RESTE DU BUDGET (dépenses hors pensions et socle, TVA, IS, transmissions, autres recettes : net −384 Md€ au central) est indexé par défaut sur le PIB en euros constants (emploi × productivité) ;
 *     reste: 'fige' redonne l'ancien comportement (euros de 2025), reste: 'productivite' n'indexe que sur la productivité ; la dépense de santé et de dépendance liée à l'âge suit alors la productivité (coût unitaire des soins) ;
 *   - les INTÉRÊTS de la dette : option taux ('bas' | 'central' | 'haut') : la dette part de 3 460,5 Md€ (Insee, fin 2025), s'accumule année par année avec les soldes du modèle (solde primaire = solde du modèle + intérêts de 2024
 *     déjà inclus, 60,1 Md€, multipliés par l'indice du reste du budget : correction du 02/11/2026, voir indiceReste), au taux apparent qui converge vers le taux de marché avec la maturité moyenne de la dette ; sans option taux : ancien comportement (intérêts de 2024 figés) ;
 *   - option pensions: 'cor' : pensions sur les salaires avec le décrochage de pension relative du COR (54,6 % en 2025, 45,3 % en 2070).
 * Des ordres de grandeur sous hypothèses, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var DG = root.DemographieSI || (typeof require !== 'undefined' ? require('./demographie.js') : null);
  var P1 = root.Palier1 || (typeof require !== 'undefined' ? require('./palier1.js') : null);
  var AS = root.AgeSante || (typeof require !== 'undefined' ? require('./age_sante.js') : null);
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var D = M.DONNEES, AN0 = DG.AN0;

  // Croissance annuelle de la productivité horaire (fraction). Constantes à partir de 2026 (simplification nommée : le COR converge vers 0,7 % en 2040 depuis le court terme du RAA).
  var PRODUCTIVITE = {
    bas: { g: 0.004, libelle: 'COR 2026, variante basse (observé 2010-2025 : 0,4 %/an)', source: 'cor' },
    central: { g: 0.007, libelle: 'COR 2026, référence (observé sur 25 ans : 0,7 %/an)', source: 'cor' },
    haut: { g: 0.010, libelle: 'COR 2026, variante haute (observé sur 35 ans : 1,0 %/an)', source: 'cor' },
    ec: { g: null, libelle: 'Commission européenne, Ageing Report 2024, France (trajectoire)', source: 'ec' },
    ia_bas: { g: 0.0077, libelle: 'Variante IA hypothétique, bas : central + 0,07 point (Acemoglu 2024)', source: 'ia' },
    ia: { g: 0.014, libelle: 'Variante IA hypothétique, médiane : central + 0,7 point (Banque de France 2026, Aghion-Bunel 2024)', source: 'ia' },
    ia_haut: { g: 0.020, libelle: 'Variante IA hypothétique, haut : central + 1,3 point (Aghion-Bunel 2024, 1re approche)', source: 'ia' }
  };
  // Ageing Report 2024, France (fiche pays, p. 273) : productivité horaire, croissance annuelle (%) à des années repères ; interpolation linéaire entre les repères.
  var EC_NOEUDS = [[2022, 0.1], [2030, 0.3], [2040, 1.5], [2050, 1.4], [2060, 1.3], [2070, 1.2]];

  function interp(noeuds, a) {
    if (a <= noeuds[0][0]) return noeuds[0][1];
    for (var i = 1; i < noeuds.length; i++) if (a <= noeuds[i][0]) return noeuds[i - 1][1] + (noeuds[i][1] - noeuds[i - 1][1]) * (a - noeuds[i - 1][0]) / (noeuds[i][0] - noeuds[i - 1][0]);
    return noeuds[noeuds.length - 1][1];
  }

  /** Indice cumulé de productivité (2025 = 1) à l'année t pour un scénario (clé de PRODUCTIVITE) ou un nombre g (fraction). */
  function indiceProductivite(prod, annee) {
    var k = annee - AN0, i, c = 1;
    if (typeof prod === 'number') return Math.pow(1 + prod, k);
    var s = PRODUCTIVITE[prod];
    if (!s) throw new Error('scénario de productivité inconnu : ' + prod);
    if (s.g !== null) return Math.pow(1 + s.g, k);
    for (i = 1; i <= k; i++) c *= 1 + interp(EC_NOEUDS, AN0 + i) / 100;   // taux de l'année AN0+i appliqué pendant cette année
    return c;
  }

  /** g effectif (moyenne géométrique 2025-t), transmis à demographie.js : (1+g)^k = indice cumulé. 0 pour k = 0. */
  function gEffectif(prod, annee) {
    var k = annee - AN0;
    return k <= 0 ? 0 : Math.pow(indiceProductivite(prod, annee), 1 / k) - 1;
  }

  /** PIB (Md€ constants de 2025) = PIB 2025 × indice d'emploi × indice de productivité ; sc = scénario démographique. */
  function pib(sc, annee, prod) {
    var v = DG.volumes(sc, annee), ip = indiceProductivite(prod, annee);
    return { annee: annee, scenario: sc, indiceEmploi: v.idx.emploi, indiceProductivite: ip, indice: v.idx.emploi * ip, pib: D.pib * v.idx.emploi * ip,
      croissanceMoyenne: Math.pow(v.idx.emploi * ip, 1 / Math.max(1, annee - AN0)) - 1 };
  }

  /** Options de demographie.js / age_sante.js pour une combinaison : { prod, pensions: 'prix'|'salaires'|'cor', socle: 'prix'|'salaires', reste: 'pib' (défaut) | 'productivite' | 'fige' }. */
  function options(annee, c) {
    return { g: gEffectif(c.prod, annee), pensions: c.pensions || 'prix', socle: c.socle || 'prix', reste: c.reste || 'pib' };
  }

  // ---------- Dette et intérêts (H172 à H174)
  var DETTE = {
    dette2025: 3460.5,            // Md€, dette publique brute (Maastricht), fin 2025, Insee Première n° 2106 (29/05/2026), figure 5 (sources/donnees/simu_6_depenses_publiques.csv)
    detteSurPib2025: 1.157,       // 115,7 % du PIB, même source
    dette2024: 3306.1,            // Md€, fin 2024, même source
    interets2024: 60.131,         // Md€, D41 y c. SIFIM, 2024 (Insee, tableau 3.201 actualisé le 28/08/2026) : intérêts déjà inclus dans le déficit de départ du modèle (−169,1 Md€)
    interets2025: 65.721,         // Md€, D41 y c. SIFIM, 2025, même tableau
    maturite: 8.5,                // ans, durée de vie moyenne de la dette négociable de l'État, 31/12/2025 : 8,50 ans (AFT, rapport d'activité 2025 p. 32 et 79 : 3 104 jours = 8 ans et 184 jours ; vérifié, V2866)
    inflation: 0.02               // par an, hypothèse (cible de la BCE) : sert à passer des flux nominaux aux euros constants de 2025
  };
  DETTE.pibInsee2025 = DETTE.dette2025 / DETTE.detteSurPib2025;      // ≈ 2 991 Md€ (le PIB du modèle, 2 935, est un niveau 2024)
  DETTE.tauxApparent2025 = DETTE.interets2025 / DETTE.dette2024;     // ≈ 1,99 % (intérêts de 2025 / dette de fin 2024)
  // Taux d'intérêt de marché de long terme (nominal) vers lequel converge le taux apparent : Eurostat irt_lt_mcby_m, France (V2709) : 2024 2,97 %, 2025 3,37 %, janvier-septembre 2026 3,78 %, septembre 2026 4,44 %.
  var TAUX = {
    bas: { r: 0.034, libelle: 'moyenne 2025 (3,37 %, Eurostat)' },
    central: { r: 0.040, libelle: 'août 2026 (4,00 %, Eurostat) ; entre la moyenne de 2026 (3,78 %) et le dernier point (4,44 %)' },
    haut: { r: 0.045, libelle: 'dernier point publié, septembre 2026 (4,44 %, Eurostat), arrondi' }
  };

  /** Taux apparent nominal de l'année t : i(2025) = intérêts 2025 / dette fin 2024, puis i(t) = i(t−1) + (r − i(t−1)) / maturité ; r = taux de marché du scénario (clé de TAUX ou nombre). */
  function tauxApparent(taux, annee) {
    var r = typeof taux === 'number' ? taux : TAUX[taux].r, i = DETTE.tauxApparent2025, a;
    for (a = AN0 + 1; a <= annee; a++) i += (r - i) / DETTE.maturite;
    return i;
  }

  /** Indice du « reste du budget » à l'année t (2025 = 1) selon l'option reste de c : PIB (emploi × productivité, défaut), productivité seule, ou 1 (figé). Les intérêts de 2024 (60,1 Md€) sont inclus dans ce reste et croissent donc avec lui ; le solde primaire les rajoute à ce même indice (relecture du 01/11, D2). */
  function indiceReste(sc, annee, c, o) {
    var mode = (o && o.reste) || c.reste || 'pib';
    if (mode === 'pib') return pib(sc, annee, c.prod).indice;
    if (mode === 'productivite') return indiceProductivite(c.prod, annee);
    return 1;
  }

  /**
   * Chemin de la dette de 2026 à `jusqua` pour une combinaison c (avec c.taux) : par année, solde primaire (solde avec santé du modèle + intérêts de 2024 inclus dans le déficit de départ),
   * intérêts = taux apparent × dette de fin d'année précédente / (1 + inflation), solde total = primaire − intérêts, dette(t) = dette(t−1) / (1 + inflation) + déficit(t) (euros constants de 2025 ; flux nominaux = flux réels × prix).
   * Pas de rétroaction du socle sur la dette au-delà du solde de la combinaison (le socle de la combinaison est celui de st).
   */
  function chemin(st, sc, c, jusqua) {
    var taux = c.taux, pi = DETTE.inflation, dt = DETTE.dette2025, i = DETTE.tauxApparent2025, r = typeof taux === 'number' ? taux : TAUX[taux].r, out = [], a, o, s, prim, I, tot, P;
    out[0] = { annee: AN0, dette: dt, detteSurPib: DETTE.dette2025 / DETTE.pibInsee2025, interets: DETTE.interets2025, taux: i, soldeTotal: null, soldePrimaire: null };
    for (a = AN0 + 1; a <= jusqua; a++) {
      o = options(a, c); s = AS.solde(st, sc, a, o);
      i += (r - i) / DETTE.maturite;
      I = i * dt / (1 + pi);
      prim = s.avec + DETTE.interets2024 * indiceReste(sc, a, c, o);   // correction du 02/11/2026 (relecture D2) : les intérêts de 2024 sont dans le « reste du budget », qui croît avec son indice
      tot = prim - I;
      dt = dt / (1 + pi) - tot;
      P = pib(sc, a, c.prod).pib * DETTE.pibInsee2025 / D.pib;
      out.push({ annee: a, dette: dt, detteSurPib: dt / P, interets: I, taux: i, soldePrimaire: prim, soldeTotal: tot, soldeHorsInterets: s.avec, pib: P, demo: s.demo });
    }
    return out;
  }

  /** Une combinaison : PIB, solde sans et avec santé et dépendance, socle finançable (sans et avec), poids des pensions et du solde dans le PIB. */
  function combinaison(st, sc, annee, c) {
    var o = options(annee, c), a = AS.solde(st, sc, annee, o), P = pib(sc, annee, c.prod);
    var pens = a.demo.volumes.idx.retraites * DG.facteurPensions(c.pensions, o.g, annee) * D.massePensions;
    var r = { annee: annee, scenario: sc, prod: c.prod, pensions: c.pensions || 'prix', socle: c.socle || 'prix', reste: o.reste, g: o.g, pib: P.pib, indicePib: P.indice,
      solde: a.sans, soldeAvecSante: a.avec, soldeSurPib: a.avec / P.pib, massePensions: pens, pensionsSurPib: pens / P.pib,
      socleFinancable: DG.socleFinancable(st, sc, annee, o), socleFinancableAvecSante: AS.socleFinancable(st, sc, annee, o) };
    if (c.taux !== undefined && c.taux !== null && annee > AN0) {
      // avec intérêts de la dette : le solde et le socle finançable AVEC intérêts s'ajoutent aux champs ci-dessus (qui gardent les intérêts de 2024 figés)
      var ch = chemin(st, sc, c, annee), L = ch[ch.length - 1], pente = DG.pente(st, annee, a.demo, o);
      r.taux = c.taux; r.dette = L.dette; r.detteSurPib = L.detteSurPib; r.interets = L.interets; r.tauxApparent = L.taux; r.soldePrimaire = L.soldePrimaire;
      r.soldeTotal = L.soldeTotal; r.socleFinancableTotal = Math.max(0, st.socle + (L.soldeTotal - a.demo.base) / pente);
    } else if (c.taux !== undefined && c.taux !== null) {
      r.taux = c.taux; r.dette = DETTE.dette2025; r.detteSurPib = DETTE.detteSurPib2025; r.interets = DETTE.interets2025; r.soldeTotal = a.avec; r.socleFinancableTotal = r.socleFinancableAvecSante;
    }
    return r;
  }

  /**
   * Seuils de productivité (démographie sc, indexation c, hors c.prod) à l'année t : plus petite productivité g (fraction par an, constante) pour laquelle
   *  - 'solde' : le solde avec santé (intérêts de 2024 figés, ou intérêts de la dette si c.taux) égale le solde de 2025 du palier 1 ;
   *  - 'primaire' : le solde primaire (avec santé) égale celui de 2025 (solde 2025 + intérêts de 2024) ;
   *  - 'dette' : le ratio dette/PIB de l'année t retombe à celui de 2025 (c.taux requis).
   * Retourne null si le seuil dépasse 5 % par an.
   */
  function seuil(st, sc, annee, c, critere) {
    var lo = 0, hi = 0.05, i, x, cc = {}, k;
    for (k in c) cc[k] = c[k];
    function ecart(g) {
      cc.prod = g; var r = combinaison(st, sc, annee, cc);
      if (critere === 'solde') return (c.taux ? r.soldeTotal : r.soldeAvecSante) - P1.solde(st, sc);
      if (critere === 'primaire') return (c.taux ? r.soldePrimaire : r.soldeAvecSante + DETTE.interets2024 * indiceReste(sc, annee, cc, options(annee, cc))) - (P1.solde(st, sc) + DETTE.interets2024);
      return DETTE.detteSurPib2025 - r.detteSurPib;
    }
    if (ecart(hi) < 0) return null;
    if (ecart(lo) >= 0) return 0;
    for (i = 0; i < 40; i++) { x = (lo + hi) / 2; if (ecart(x) < 0) lo = x; else hi = x; }
    return hi;
  }

  /** Grille complète : démographie × productivité × indexation des pensions × indexation du socle, aux années demandées (défaut 2035, 2045, 2065). */
  function grille(st, annees, opt) {
    annees = annees || [2035, 2045, 2065]; opt = opt || {};
    var demos = opt.demos || ['bas', 'central', 'haut'], prods = opt.prods || Object.keys(PRODUCTIVITE), pens = opt.pensions || ['prix', 'salaires'], socs = opt.socles || ['prix', 'salaires'], out = [];
    demos.forEach(function (sc) { prods.forEach(function (pr) { pens.forEach(function (pe) { socs.forEach(function (so) { annees.forEach(function (a) {
      out.push(combinaison(st, sc, a, { prod: pr, pensions: pe, socle: so }));
    }); }); }); }); });
    return out;
  }

  var API = { indiceReste: indiceReste, DETTE: DETTE, TAUX: TAUX, tauxApparent: tauxApparent, chemin: chemin, seuil: seuil, PRODUCTIVITE: PRODUCTIVITE, EC_NOEUDS: EC_NOEUDS, indiceProductivite: indiceProductivite, gEffectif: gEffectif, pib: pib, options: options, combinaison: combinaison, grille: grille };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Croissance = API;
})(this);
