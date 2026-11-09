/*
 * modeles/systeme-ideal/decisions_0511g.js — v5.7 (05/11/2026, après-midi) : trois décisions de l'auteur intégrées à la v5.6 (decisions_0511e.js) :
 *   (1) ÂGE LIBRE OUVERT D'UN TRIMESTRE PAR AN (variante (a) de decisions_0511f.js, § 25 de resultats-optimum.txt) : l'âge minimal de départ baisse de 64 vers 60 ans d'un trimestre par an
 *       à partir de 2028 (60 ans atteints en 2043). Il REMPLACE l'ouverture en 3 ans de la v5.6. La pénibilité (60 ans sans réduction), le plancher de 1 300 € et le reste du V6 sont inchangés.
 *   (2) FISCALITÉ D'ORIENTATION COMPTÉE AU BAS DE SA FOURCHETTE (arbitrage 3 du 05/11) : viande, carburants, billets d'avion, voitures lourdes, TVA à 0 % sur la nécessité
 *       (alimentation hors viande et poisson, eau, médicaments). Chiffrage existant : modeles/fiscalite-orientation (modele.js, resultats.md, ligne H12 du bilan global), cadre européen,
 *       réactions de consommation FORTES (le bas des recettes : 11,9 Md€ avec le gaz et le fioul). Le chauffage au gaz et au fioul (+2,3 au bas) n'est PAS dans la liste décidée par l'auteur :
 *       il est écarté (H800) ; le compté est donc de 9,6 Md€ au central (≈ 10).
 *   (3) GRATUITÉ DES TRANSPORTS URBAINS SEULEMENT (arbitrage 2 du 05/11) : variante A de sources/chiffrage-gratuite-transports-urbains.md § 9 : +6,0 Md€ de dépense (4,5 à 10,5),
 *       en remplacement de la ligne H12 héritée « gratuité −10,4 » (T9). Le versement mobilité (12,2 Md€) est DÉJÀ supprimé dans P06 (impôts de production) : rien à ajouter.
 * DOUBLES COMPTES VÉRIFIÉS (H801) : (a) la fiscalité d'orientation est nette des recettes actuelles perdues sur les volumes qui baissent (TVA et accises déjà dans « TVA, accises... maintenus » P11) :
 *   elle ne s'ajoute donc pas aux accises actuelles ; (b) TVA 0 % sur l'alimentation à domicile, l'eau et les médicaments : aucune autre ligne du modèle ne touche ces taux (TVA réparation 5 % N13,
 *   TVA travaux N10-N11, niches ES2 : hôtels, spectacles, cantines, campings, bois de chauffage... : biens et services différents) ; (c) les niches d'accises énergie de N10 portent sur des usages
 *   professionnels, la base de la fiscalité d'orientation est la consommation des MÉNAGES (carburants 52,0 Md€ Insee CP0722) ; (d) l'avion (6,1) n'est pas recompté dans la taxe croisières (T10).
 * Tout est en Md€ de 2025 par an ; des hypothèses et des ordres de grandeur, jamais des prédictions. Hypothèses H799 à H806 (methode.md § 42).
 * Ce module ne modifie AUCUN module existant (decisions_0511f.js reçoit seulement une fonction de lecture en plus, ageLibreDetail). La v5.6 reste reproductible par decisions_0511e.js.
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511f.js (jusqu'à decisions_0511f.js), puis ../fiscalite-orientation/modele.js decisions_0511g.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var B = root.Decisions0511b || (req ? req('./decisions_0511b.js') : null);
  var C = root.Decisions0511c || (req ? req('./decisions_0511c.js') : null);
  var D = root.Decisions0511d || (req ? req('./decisions_0511d.js') : null);
  var E = root.Decisions0511e || (req ? req('./decisions_0511e.js') : null);
  var F = root.Decisions0511f || (req ? req('./decisions_0511f.js') : null);
  var ST = root.Stress || (req ? req('../risques/stress.js') : null);
  var FO = root.FiscaliteOrientation || (req ? req('../fiscalite-orientation/modele.js') : null);
  var SCS = ['bas', 'central', 'haut'];
  function i(sc) { return SCS.indexOf(sc); }
  function O(a, o) { var r = {}, k; for (k in a) r[k] = a[k]; for (k in o) r[k] = o[k]; return r; }

  var HYP = {
    tPlat: 0.42, annee1: 2029, anneeFin: 2070, variante: 'a',
    // H799 : variante (a) de decisions_0511f.js : un trimestre par an, 60 ans atteints après 16 ans (2043)
    // H800 : postes de la fiscalité d'orientation comptés = la liste de l'auteur (gaz et fioul exclus)
    postesFO: ['viande', 'carburants', 'aerien', 'voituresLourdes', 'tva0_alimentation', 'tva0_eau', 'tva0_medicaments'],
    // H802 : correspondance des scénarios du modèle (bas = favorable) avec les réactions de consommation : favorable = réactions centrales, central = réactions FORTES (bas de la fourchette décidée),
    //        défavorable = réactions fortes ET élasticités doublées sur les postes taxés (effet de long terme : érosion pleine)
    comportementFO: { bas: 'central', central: 'haut', haut: 'haut' },
    multElasticiteDefavorable: 2,
    // H803 : érosion de la recette dans le temps (sensibilité, NON comptée) : les élasticités des postes taxés passent linéairement de ×1 (2029) à ×multLongTerme (après anneesErosion)
    erosion: { mult: 2, annees: 15 },
    // H804 : gratuité urbaine (variante A), paramètres de sources/chiffrage-gratuite-transports-urbains.md § 4.2-4.3 : [hausse IDF urbain, hausse province, coefficient d'offre k, investissement i, économies de collecte b, supplément de capacité lourde]
    gratuite: { bas: [0.05, 0.20, 0.3, 0.10, 0.05, 0], central: [0.10, 0.35, 0.6, 0.20, 0.07, 0.3], haut: [0.20, 0.60, 1.0, 0.30, 0.10, 1.0] },
    recettesTarifaires: 2.97 + 1.3, exploitationIDF: 7.02, exploitationProvince: 4.9,
    // H805 : début de la fiscalité d'orientation et de la gratuité : année 1 du modèle (2029), pleine charge immédiate (prudent pour la gratuité, prudent pour la recette qui est au bas)
    anneeDebut: 2029
  };

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 1. Fiscalité d'orientation au bas de la fourchette
  // ------------------------------------------------------------------------------------------------------------------------------------------
  function copieDonnees(mult, postes) {
    var d = JSON.parse(JSON.stringify(FO.DONNEES)), k;
    if (mult !== 1) {
      ['viande', 'carburants', 'aerien', 'voituresLourdes'].forEach(function (p) { if (d.accises[p]) { var e = d.accises[p].e; for (k in e) e[k] = e[k] * mult; } });
    }
    return d;
  }
  var _fo = {};
  /** Recette nette (Md€/an, + améliore le solde) de la fiscalité d'orientation, postes de la liste de l'auteur, au scénario sc ; o.mult : multiplicateur d'élasticité (érosion) ; o.comportement : forcé. */
  function fiscaliteOrientation(sc, o) {
    o = o || {};
    var comp = o.comportement || HYP.comportementFO[sc], mult = o.mult !== undefined ? o.mult : (sc === 'haut' ? HYP.multElasticiteDefavorable : 1);
    var key = comp + '|' + mult;
    if (_fo[key] === undefined) {
      var r = FO.simuler({ comportement: comp }, copieDonnees(mult)), s = 0, p, detail = {}, pos;
      for (p = 0; p < HYP.postesFO.length; p++) { pos = r.postes[HYP.postesFO[p]]; detail[HYP.postesFO[p]] = pos.net; s += pos.net; }
      _fo[key] = { total: s, detail: detail, chauffage: r.postes.chauffage.net, totalAvecChauffage: r.recettesNettesMdE, emissionsNettesMt: r.emissionsNettesMt, postes: r.postes };
    }
    return _fo[key];
  }
  /** Effet de la fiscalité d'orientation à l'année an (Md€/an ; + améliore) : 0 avant 2029, valeur constante au bas ensuite. */
  function fo(sc, an) { return an < HYP.anneeDebut ? 0 : fiscaliteOrientation(sc).total; }
  /** Trajectoire d'érosion (sensibilité, NON comptée) : élasticités ×(1 + (m − 1) × min(1, (an − 2029) / annees)) sur les postes taxés, au central (réactions fortes). */
  function foErosion(an) {
    if (an < HYP.anneeDebut) return 0;
    var m = 1 + (HYP.erosion.mult - 1) * Math.min(1, (an - HYP.anneeDebut) / HYP.erosion.annees);
    return fiscaliteOrientation('central', { mult: m }).total;
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 2. Gratuité des transports urbains (variante A)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /** Coût net de la gratuité urbaine (Md€/an de dépense en plus) et sa décomposition, au scénario sc (formule de sources/chiffrage-gratuite-transports-urbains.md § 4.3). */
  function gratuiteDetail(sc) {
    var p = HYP.gratuite[sc], hI = p[0], hP = p[1], k = p[2], inv = p[3], b = p[4], sA = p[5], rec = HYP.recettesTarifaires;
    var oI = HYP.exploitationIDF * hI * k * (1 + inv), oP = HYP.exploitationProvince * hP * k * (1 + inv), eco = b * rec;
    return { recettesPerdues: rec, offreIDF: oI, offreProvince: oP, capacite: sA, economiesCollecte: -eco, net: rec + oI + oP + sA - eco };
  }
  function gratuite(sc) { return gratuiteDetail(sc).net; }
  function tu(sc, an) { return an < HYP.anneeDebut ? 0 : gratuite(sc); }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 3. Effet net ajouté à la v5.5 (Md€/an ; + améliore) : V6 avec âge libre d'un trimestre par an + fiscalité d'orientation − gratuité urbaine
  // ------------------------------------------------------------------------------------------------------------------------------------------
  function v6(sc, an) { return F.net(sc, HYP.variante, an); }
  function net(sc, an) { return an < HYP.annee1 ? 0 : v6(sc, an) + fo(sc, an) - tu(sc, an); }
  function solde(sc, an, t) { return D.solde(sc, 0, t === undefined ? HYP.tPlat : t) + net(sc, an); }
  function tauxEquilibre(an) { return E.tauxPourSolde(-net('central', an)); }
  /** Décomposition du V6 (variante a) à l'année an : pensions (économie, + améliore), recettes, substitution, plancher ; somme = v6(sc, an) (sauf hautes pensions, retirées). */
  function composantesV6(sc, an) {
    var c = E.composantes(sc, an), d0 = F.ageLibreDetail(sc, 'immediat', an), da = F.ageLibreDetail(sc, HYP.variante, an);
    var pensions = -c.depensePensions - (da.depenseMdE - d0.depenseMdE), recettes = c.recettes - (da.recettesPerduesMdE - d0.recettesPerduesMdE);
    var net = pensions + recettes + c.substitution + c.plancher;
    return { pensions: pensions, recettes: recettes, substitution: c.substitution, plancher: c.plancher, ageLibre: da.ageLibreMdE, net: net, hautesPensions: c.hautesPensions };
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 4. Indicateurs (central) : trajectoire, creux, croisière, déficits
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var JALONS = [2030, 2035, 2040, 2050, 2060];
  function trajectoire(fin) {
    var rows = [], y;
    for (y = HYP.annee1; y <= (fin || HYP.anneeFin); y++) rows.push({ an: y, v6: v6('central', y), fo: fo('central', y), tu: tu('central', y), net: net('central', y), solde: solde('central', y), taux: tauxEquilibre(y),
      soldeScenarios: { bas: solde('bas', y), central: solde('central', y), haut: solde('haut', y) } });
    return rows;
  }
  function creux() {
    var best = null, y;
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) { var t = tauxEquilibre(y); if (best === null || t > best.taux) best = { an: y, taux: t, net: net('central', y), solde: solde('central', y) }; }
    return best;
  }
  function croisiere() { return { an: 2060, net: net('central', 2060), solde: solde('central', 2060), taux: tauxEquilibre(2060) }; }
  /** Années de solde négatif à t (défaut 42 %), manque maximal, cumulé, pic du cumul, retour du cumul à zéro ; sc : scénario (défaut central) ; o.serie : fonction (sc, an, t) → solde (défaut solde). */
  function lissage(t, sc, o) {
    var tt = t === undefined ? HYP.tPlat : t, s = sc || 'central', f = (o && o.solde) || solde, y, n = 0, max = 0, maxAn = null, cum = 0, premiere = null, derniere = null, cumulSerie = 0, pic = 0, picAn = null, retour = null;
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) {
      var v = f(s, y, tt);
      cumulSerie += v;
      if (cumulSerie < pic) { pic = cumulSerie; picAn = y; }
      if (retour === null && picAn !== null && cumulSerie >= 0) retour = y;
      if (v < 0) { n++; cum += -v; if (premiere === null) premiere = y; derniere = y; if (-v > max) { max = -v; maxAn = y; } }
    }
    return { anneesDeficit: n, premiere: premiere, derniere: derniere, manqueMax: max, manqueMaxAn: maxAn, manqueCumule: cum, cumulSurPeriode: cumulSerie, picDuCumul: pic, picDuCumulAn: picAn, anneeRetourDuCumul: retour };
  }
  function pointDeTaux() { return E.pointDeTaux(); }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 5. Dette en % du PIB (récurrence de decisions_0511f.js ; taux plat ou taux variable dans le temps : o.taux = nombre ou fonction (année) → taux)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var _aj = {};
  function ajV(t) {
    var key = Math.round(t * 1e6);
    if (!_aj[key]) { var base = B.ajustement(C.archiV54(t), false), s = {}; SCS.forEach(function (sc) { s[sc] = D.somme(sc); }); _aj[key] = function (sc, n) { return base(sc, n) + s[sc]; }; }
    return _aj[key];
  }
  function dette(sc, o) {
    o = o || {};
    var N = o.n || 42, tt = o.taux === undefined ? HYP.tPlat : o.taux, ft = typeof tt === 'function' ? tt : function () { return tt; }, Eco = ST.ECO, g = Eco.gNominal, u, k;
    var netF = o.net || net;
    var aj = function (s, n) { return ajV(ft(2028 + n))(s, n) + netF(s, 2028 + n); };
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
  function jalonsDette(sc, o) {
    var r = dette(sc, O(o || {}, { n: 42 })), pic = 0, pa = 0, k;
    for (k = 0; k < r.ratio.length; k++) if (r.ratio[k] > pic) { pic = r.ratio[k]; pa = HYP.annee1 + k; }
    return { r10: r.ratio[9], r20: r.ratio[19], r30: r.ratio[29], pic: pic, picAn: pa, serie: r.ratio, dette: r.dette };
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 6. Deux options pour le reste du creux (NON adoptées)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /** Option (i) : taux constant de l'année a à l'année b (42 % hors de la fenêtre) pour lequel la somme des soldes centraux de a à b est nulle (aucune dette supplémentaire hors intérêts) ; bisection. */
  function tauxTransition(a, b, sc) {
    var lo = 0.38, hi = 0.52, k, s = sc || 'central';
    function cum(t) { var v = 0, y; for (y = a; y <= b; y++) v += solde(s, y, t); return v; }
    for (k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (cum(m) >= 0) hi = m; else lo = m; }
    return hi;
  }
  /** Taux de transition et ses conséquences : { taux, points, an0, an1, residuMdE (somme des soldes de la fenêtre à ce taux ; ≥ 0 si tout est couvert), lissage (au taux de transition dans la fenêtre), dette }. */
  function optionTransition(a, b, taux) {
    var t = taux === undefined ? tauxTransition(a, b) : taux, fT = function (an) { return an >= a && an <= b ? t : HYP.tPlat; };
    var soldeT = function (s, an) { return solde(s, an, fT(an)); }, y, cum = 0, pic = 0, picAn = null;
    for (y = HYP.annee1; y <= HYP.anneeFin; y++) { cum += soldeT('central', y); if (cum < pic) { pic = cum; picAn = y; } }
    var l = lissage(0.42, 'central', { solde: function (s, an) { return soldeT(s, an); } });
    var cumFenetre = 0; for (y = a; y <= b; y++) cumFenetre += soldeT('central', y);
    return { taux: t, points: (t - HYP.tPlat) * 100, an0: a, an1: b, cumulFenetreMdE: cumFenetre, picDuCumulMdE: pic, picAn: picAn, lissage: l, dette: jalonsDette('central', { taux: fT }), soldeAn: soldeT };
  }
  /** Option (ii) : 42 % constant, la dette absorbe le creux (= la référence v5.7). */
  function optionPlat() { return { taux: HYP.tPlat, lissage: lissage(), dette: jalonsDette('central') }; }

  var API = { HYP: HYP, SCS: SCS, JALONS: JALONS, fiscaliteOrientation: fiscaliteOrientation, fo: fo, foErosion: foErosion, gratuite: gratuite, gratuiteDetail: gratuiteDetail, tu: tu, v6: v6, net: net, solde: solde,
              tauxEquilibre: tauxEquilibre, composantesV6: composantesV6, trajectoire: trajectoire, creux: creux, croisiere: croisiere, lissage: lissage, pointDeTaux: pointDeTaux, dette: dette,
              jalonsDette: jalonsDette, tauxTransition: tauxTransition, optionTransition: optionTransition, optionPlat: optionPlat };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511g = API;
})(this);
