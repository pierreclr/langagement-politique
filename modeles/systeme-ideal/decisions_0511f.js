/*
 * modeles/systeme-ideal/decisions_0511f.js — v5.6b (05/11/2026) : décision de l'auteur : l'âge libre du dispositif retraites V6 est OUVERT PROGRESSIVEMENT
 * (l'âge minimal de départ baisse par paliers au lieu de s'ouvrir d'un coup) ; la pénibilité (départ à 60 ans sans réduction) reste en vigueur dès le départ.
 * But : réduire le creux de 2029 à 2047 de la v5.6 (âge libre : −29,1 Md€ en 2029 ; taux d'équilibre jusqu'à 44,34 %).
 * Ce module CHIFFRE des options ; il ne change ni le solde adopté de la v5.6 (decisions_0511e.js) ni aucun module existant.
 *
 * Trois variantes (calendrier d'ouverture de l'âge minimal, de 64 ans vers 60 ans) :
 *   (a) l'âge minimal baisse d'un trimestre par an (complet après 16 ans) ;
 *   (b) il baisse d'un semestre par an (complet après 8 ans) ;
 *   (c) deux temps : mi-chemin (62 ans) à 5 ans, complet (60 ans) à 10 ans, rien avant.
 * Le comportement de départ du modèle (age_libre.js, effetAgeLibre) est conservé : la cohorte annuelle de 0,77 M se décale en moyenne de d = passageLibre × (64 − âge minimal ouvert)
 * (central : 0,35 ; favorable 0,2 ; défavorable 0,5), à coefficient neutre (r = 0,7 %), avec les recettes de travail perdues à 42 %. Ouverture complète : d = passageLibre × 4,
 * identique à bilanReference. La part d'ouverture de la cohorte s0 (année de départ de référence) est f(s0) ; la référence « ouverture en 3 ans » du modèle est f = min(1, k/3), k = s0 − 2027.
 * Hypothèses H793 à H798 (methode.md § 41). Tout ce qui suit est une hypothèse ou un ordre de grandeur, jamais une prédiction.
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511e.js (jusqu'à decisions_0511e.js), puis decisions_0511f.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var D = root.Decisions0511d || (req ? req('./decisions_0511d.js') : null);
  var E = root.Decisions0511e || (req ? req('./decisions_0511e.js') : null);
  var ST = root.Stress || (req ? req('../risques/stress.js') : null);
  var A = root.AgeLibre || (req ? req('../retraites/age_libre.js') : null);
  var SCS = ['bas', 'central', 'haut'];
  var REF = ['favorable', 'central', 'defavorable'];
  function i(sc) { return SCS.indexOf(sc); }
  function F(a, o) { var r = {}, k; for (k in a) r[k] = a[k]; for (k in o) r[k] = o[k]; return r; }

  var HYP = {
    tPlat: 0.42, debut: 2028, annee1: 2029, anneeFin: 2070, ageRef0: 64, ageMin: 60,
    // H793 : part d'ouverture f(s0), k = s0 − 2027 (1 en 2028)
    // H794 : stock 'immediat' = ouverture en 3 ans du modèle (référence v5.6 adoptée)
    rampeReference: 3
  };
  var VARIANTES = {
    immediat: { nom: 'v5.6 adoptée (ouverture en 3 ans)', f: function (k) { return Math.min(1, k / HYP.rampeReference); } },
    a: { nom: '(a) un trimestre par an', f: function (k) { return Math.min(1, 0.25 * k / (HYP.ageRef0 - HYP.ageMin)); } },
    b: { nom: '(b) un semestre par an', f: function (k) { return Math.min(1, 0.5 * k / (HYP.ageRef0 - HYP.ageMin)); } },
    c: { nom: '(c) deux temps (mi-chemin à 5 ans, complet à 10 ans)', f: function (k) { return k < 5 ? 0 : k < 10 ? 0.5 : 1; } }
  };
  var CLES = ['immediat', 'a', 'b', 'c'];

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 1. Effet de l'âge libre avec un calendrier d'ouverture (copie de age_libre.js effetAgeLibre, avec f(s0) à la place de la montée en 3 ans)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  function recouvre(d0, d1, an) { return Math.max(0, Math.min(d1, an + 1) - Math.max(d0, an)); }
  /** Âge libre à l'année an, pour le scénario sc et la variante cle : { depenseMdE, recettesPerduesMdE, ageLibreMdE (+ améliore) }. */
  function ageLibreAnnee(sc, cle, an) {
    var s = A.SCENARIOS_REF[REF[i(sc)]], delta = s.passageLibre * (HYP.ageRef0 - HYP.ageMin), r = s.r, Dn = A.DONNEES, debut = HYP.debut, f = VARIANTES[cle].f,
      N = Dn.cohorteAnnuelle, enEmploi = 0.5, depense = 0, rec = 0, s0;
    for (s0 = debut; s0 <= an + 45; s0++) {
      var d = delta * f(s0 - debut + 1), a0 = A.ageBase(s0), a1 = Math.max(60, a0 - d), dReel = a0 - a1, s1 = Math.max(debut, s0 - dReel);
      var pens0 = Dn.pensionMoyenne2025 * Math.pow(1 + Dn.croissancePensionNeuve, s0 - 2025), c = A.coefNeutre(a1, a0, r, 0), pens1 = pens0 * c, mid = an + 0.5;
      depense -= N * pens0 * recouvre(s0, 1e9, an) * A.survie(a0, a0 + Math.max(mid - s0, 0));
      depense += N * pens1 * recouvre(s1, 1e9, an) * A.survie(a1, a1 + Math.max(mid - s1, 0));
      rec += N * enEmploi * Dn.revenuActiviteMoyen2025 * Math.pow(1.007, an - 2025) * Dn.tauxPrelevementTravail * recouvre(s1, s0, an) * A.survie(a1, a1 + Math.max(mid - s1, 0));
    }
    return { depenseMdE: depense, recettesPerduesMdE: rec, ageLibreMdE: -depense - rec };
  }
  var _al = {};
  function ageLibre(sc, cle, an) {
    var k = sc + '|' + cle + '|' + an;
    if (_al[k] === undefined) _al[k] = ageLibreAnnee(sc, cle, an);
    return _al[k].ageLibreMdE;
  }
  /** Détail de l'âge libre (v5.7, ajout sans effet sur le reste) : { depenseMdE (variation de la dépense de pensions, + = coût), recettesPerduesMdE, ageLibreMdE }. */
  function ageLibreDetail(sc, cle, an) { ageLibre(sc, cle, an); return _al[sc + '|' + cle + '|' + an]; }
  /** Effet net ajouté à la v5.5 (Md€/an ; + améliore) pour la variante : net de la v5.6 adoptée − âge libre adopté + âge libre de la variante. La pénibilité, le plancher et le reste sont inchangés. */
  function net(sc, cle, an) {
    if (an < HYP.annee1) return 0;
    if (cle === 'immediat') return E.v6Net(sc, an);
    return E.v6Net(sc, an) - E.composantes(sc, an).ageLibre + ageLibre(sc, cle, an);
  }
  function solde(sc, cle, an, t) { return D.solde(sc, 0, t === undefined ? HYP.tPlat : t) + net(sc, cle, an); }
  function tauxEquilibre(cle, an) { return E.tauxPourSolde(-net('central', cle, an)); }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 2. Indicateurs de la variante (central)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var JALONS = [2030, 2035, 2040, 2050, 2060];
  function creux(cle) {
    var best = null, y;
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) { var t = tauxEquilibre(cle, y); if (best === null || t > best.taux) best = { an: y, taux: t, net: net('central', cle, y), solde: solde('central', cle, y) }; }
    return best;
  }
  /** Années de solde négatif à t (défaut 42 %), manque maximal, manque cumulé (Md€ de 2025, hors intérêts), cumul sur la période, retour du cumul à zéro ; sc : scénario (défaut central). */
  function lissage(cle, t, sc) {
    var tt = t === undefined ? HYP.tPlat : t, s = sc || 'central', y, n = 0, max = 0, maxAn = null, cum = 0, premiere = null, derniere = null, cumulSerie = 0, pic = 0, picAn = null, retour = null;
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) {
      var v = solde(s, cle, y, tt);
      cumulSerie += v;
      if (cumulSerie < pic) { pic = cumulSerie; picAn = y; }
      if (retour === null && picAn !== null && cumulSerie >= 0) retour = y;
      if (v < 0) { n++; cum += -v; if (premiere === null) premiere = y; derniere = y; if (-v > max) { max = -v; maxAn = y; } }
    }
    return { anneesDeficit: n, premiere: premiere, derniere: derniere, manqueMax: max, manqueMaxAn: maxAn, manqueCumule: cum, cumulSurPeriode: cumulSerie, picDuCumul: pic, picDuCumulAn: picAn, anneeRetourDuCumul: retour };
  }
  function croisiere(cle) { return { an: 2060, net: net('central', cle, 2060), taux: tauxEquilibre(cle, 2060) }; }
  /** Taux plat constant qui annule la somme des soldes centraux de a à b (lissage par la dette, sans intérêts). */
  function tauxLisse(cle, a, b) {
    var lo = 0.38, hi = 0.50, k;
    function cum(t) { var s = 0, y; for (y = a; y <= b; y++) s += solde('central', cle, y, t); return s; }
    for (k = 0; k < 30; k++) { var m = (lo + hi) / 2; if (cum(m) >= 0) hi = m; else lo = m; }
    return hi;
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 3. Dette en % du PIB (récurrence de decisions_0511e.js, avec l'effet net de la variante)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  function dette(sc, cle, o) {
    o = o || {};
    var N = o.n || 42, t = o.taux === undefined ? HYP.tPlat : o.taux, Eco = ST.ECO, g = Eco.gNominal, u, k, aj0 = E.ajustementV55(t);
    var aj = function (s, n) { return aj0(s, n) + net(s, cle, 2028 + n); };
    var Y0 = Eco.pib0, Dt = Eco.dette0, ieff = Eco.interets0 / Eco.dette0, out = { ratio: [], dette: [] };
    for (u = 1; u <= ST.PREROLL; u++) { ieff = ieff + (Eco.imarche - ieff) / Eco.dureeDette; Dt = Dt - ((-169.1 + Eco.interets0) * Math.pow(1 + g, u) - ieff * Dt); }
    for (k = 1; k <= N; k++) {
      var kk = Math.pow(1 + g, k + ST.PREROLL), Y = Y0 * kk;
      ieff = ieff + (Eco.imarche - ieff) / Eco.dureeDette;
      var interets = ieff * Dt, pbs = ST.pbStruct('V5', sc, k, { ajust: aj, sansValeur: true }) + E.valeur(sc, k, o);
      var pb = (pbs + Eco.interets0) * kk, Bk = pb - interets;
      Dt = Dt - Bk; out.ratio.push(Dt / Y); out.dette.push(Dt);
    }
    return out;
  }
  function jalonsDette(sc, cle, o) {
    var r = dette(sc, cle, F(o || {}, { n: 42 })), pic = 0, pa = 0, k;
    for (k = 0; k < r.ratio.length; k++) if (r.ratio[k] > pic) { pic = r.ratio[k]; pa = HYP.annee1 + k; }
    return { r10: r.ratio[9], r20: r.ratio[19], r30: r.ratio[29], pic: pic, picAn: pa, serie: r.ratio };
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 4. Qui attend : personnes par cohorte dont le départ anticipé est reporté, et de combien (H797)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * Cohorte dont le départ de référence est l'année s0 : le modèle donne un décalage MOYEN d = passageLibre × 4 × f ; on le lit comme une part passageLibre de la cohorte
   * (0,77 M par an) qui partirait à l'âge minimal si l'âge libre était complet (60 ans), les autres partant à l'âge de référence (H797). Avec l'ouverture partielle, cette part ne
   * peut partir qu'à l'âge minimal ouvert (64 − 4 f) : elle attend (4 − 4 f) ans de plus qu'à l'ouverture complète. Retour : { personnesM, attenteAns, ageMinimalOuvert }.
   */
  function quiAttend(sc, cle, s0) {
    var s = A.SCENARIOS_REF[REF[i(sc)]], f = VARIANTES[cle].f(s0 - HYP.debut + 1), c = A.DONNEES.cohorteAnnuelle;
    return { personnesM: s.passageLibre * c * (f < 1 ? 1 : 0), attenteAns: (HYP.ageRef0 - HYP.ageMin) * (1 - f), ageMinimalOuvert: HYP.ageRef0 - (HYP.ageRef0 - HYP.ageMin) * f, ouverture: f };
  }
  /** Total sur les cohortes concernées (f < 1) : personnes touchées (M) et années d'attente-personnes (M × an) ; attente moyenne pondérée (ans). */
  function quiAttendTotal(sc, cle) {
    var s0, p = 0, pa = 0, n = 0, maxA = 0;
    for (s0 = HYP.debut; s0 <= HYP.debut + 40; s0++) {
      var q = quiAttend(sc, cle, s0);
      if (q.personnesM > 0) { p += q.personnesM; pa += q.personnesM * q.attenteAns; n++; if (q.attenteAns > maxA) maxA = q.attenteAns; }
    }
    return { cohortes: n, personnesM: p, anneesPersonnesM: pa, attenteMoyenneAns: p > 0 ? pa / p : 0, attenteMaxAns: maxA };
  }
  /** Pénibilité : la composante est celle de la v5.6 (inchangée par le calendrier d'ouverture) ; âge minimal de la cohorte de l'année an (60 ans). */
  function penibilite(sc, an) { return { coutMdE: E.composantes(sc, an).penibilite, ageMin: A.penibiliteIndexee({ scenario: REF[i(sc)], annees: [an] }).annees[an].ageMinCohorte }; }

  var API = { HYP: HYP, VARIANTES: VARIANTES, CLES: CLES, JALONS: JALONS, ageLibre: ageLibre, ageLibreDetail: ageLibreDetail, net: net, solde: solde, tauxEquilibre: tauxEquilibre, creux: creux, lissage: lissage, croisiere: croisiere,
              tauxLisse: tauxLisse, dette: dette, jalonsDette: jalonsDette, quiAttend: quiAttend, quiAttendTotal: quiAttendTotal, penibilite: penibilite };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511f = API;
})(this);
