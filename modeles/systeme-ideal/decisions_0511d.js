/*
 * modeles/systeme-ideal/decisions_0511d.js — v5.5 (05/11/2026, matin) : décisions de l'auteur sur les grandes fortunes.
 *   - la taxe de 1 % sur le patrimoine est gardée pour tous (Zucman non retenu, héritage à 60 % non retenu) : rien ne change ;
 *   - AJOUT : taxe de 2 % sur les actifs non professionnels (« passifs ») des holdings patrimoniales (grandes_fortunes_0511.js, holdings(sc).taxeActifsPassifs) ;
 *   - AJOUT : traitement des trusts et des sociétés civiles patrimoniales (grandes_fortunes_0511.js, montages(sc), ligne g) ;
 *   - CORRECTION : immobilier détenu par des sociétés (SCI) : la taxe de 1 % les capte par la valeur des parts (aucun trou d'assiette, aucun double compte),
 *     mais les traite comme des actions non cotées (décote, érosion « mobile », paiement à la vente, nette des dettes) et non comme de l'immobilier. La correction
 *     est la transparence (« look-through » comme l'IFI, art. 965, 2° CGI) : même traitement que l'immobilier détenu en direct ;
 *   - OPTION CHIFFRÉE, NON ADOPTÉE : abattement sur l'assiette de la taxe de 1 % (100 000 € par adulte, variante 50 000 €) ; le solde « v5.5 » n'en contient pas.
 * Extension au-dessus de decisions_0511c.js : rien n'est modifié dans les modules existants (la v5.4 reste reproductible par C.archiV54()).
 * Fonctions pures, Md€/an en croisière ; ordre des scénarios du modèle [bas = favorable, central, haut = défavorable], comme la v5.4. Hypothèses H780 à H785 (methode.md § 39).
 * Des hypothèses et des ordres de grandeur, jamais des prédictions.
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511.js jusqu'à decisions_0511.js, puis decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var C = root.Decisions0511c || (req ? req('./decisions_0511c.js') : null);
  var G = root.GrandesFortunes0511 || (req ? req('./grandes_fortunes_0511.js') : null);
  var TP = root.TaxePatrimoine || (req ? req('./taxe_patrimoine.js') : null);
  var PF = root.PatrimoineFinancier || (req ? req('./patrimoine_financier.js') : null);
  var OF = root.OptionsFinancement || (req ? req('./options_financement.js') : null);
  var SCS = ['bas', 'central', 'haut'];
  var XS = OF.SC_PATRIMOINE;                      // scénario du palier 1 -> scénario des modules patrimoine (croisé, H420)
  function i(sc) { return SCS.indexOf(sc); }

  var HYP = {
    tPlat: 0.42,
    // H780 : abattement par ADULTE sur l'assiette de la taxe de 1 % (décision du 05/11 : à chiffrer) ; variante 50 000 €
    abattementAdulte: 100000, abattementAdulteVariante: 50000,
    // H781 : adultes par ménage (Insee : 67 M d'habitants moins ≈ 13,5 M de mineurs, pour 30,9 M de ménages ≈ 1,72 ; ⚠️ V13465). Le modèle applique l'abattement par ménage (A = n × montant par adulte) :
    // un ménage d'un adulte en a moins, un couple deux fois plus ; la moyenne surestime un peu le coût (min(T, A) est concave en A) : choix prudent pour le budget.
    adultesParMenage: 1.7, ménages: 30.9e6,
    // H782 : part des actions non cotées des ménages (comptes nationaux, 1 745 Md€ hors OPC, dont 85 % non cotées) qui représente des SCI et sociétés à prépondérance immobilière.
    // ⚠️ AUCUNE source primaire (V13463) : [favorable, central, défavorable]
    partSCI: [0.20, 0.15, 0.10],
    // H783 : dettes des SCI / valeur de leur immobilier (la taxe de 1 % taxe l'immobilier en brut, mais les parts en net) ; ⚠️ sans source (V13464)
    levierSCI: [0.30, 0.20, 0.10]
  };

  function F(a, o) { var r = {}, k; for (k in a) r[k] = a[k]; for (k in o) r[k] = o[k]; return r; }

  /** Architecture v5.5 : v5.4 au taux t (défaut 42 %), avec un abattement A par ménage sur l'assiette de la taxe de 1 % (0 par défaut : décision non prise). */
  function archiV55(t, A) {
    var a = C.archiV54(t === undefined ? HYP.tPlat : t);
    if (A === undefined || A === 0) return a;
    return F(a, { taxe: F(a.taxe, { abattement: A }) });
  }
  /** Abattement par ménage (€) pour un montant par adulte m : m × adultes par ménage (H781). */
  function parMenage(m) { return Math.round(m * HYP.adultesParMenage); }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 1. Holdings (2 % sur les actifs passifs) et trusts / sociétés civiles : lus dans grandes_fortunes_0511.js, sans double compte avec la v5.4
  // ------------------------------------------------------------------------------------------------------------------------------------------
  var _h = {}, _g = {};
  /**
   * Taxe de 2 % sur les actifs non professionnels des holdings patrimoniales (Md€/an), net de l'évitement et de la fuite (patrimoine_financier.js holdingsTaxe). Cumulée à la taxe de 1 % sur les parts :
   * la v5.4 ne taxe pas ces actifs au niveau de la holding (la transparence ne taxe que les bénéfices retenus, N02) ; les parts sont dans l'assiette de la taxe de 1 % (valeur d'actif net), et la taxe
   * de 2 % ne modifie pas la valeur d'actif net que l'administration retient : pas de retour sur l'assiette de la taxe de 1 %. Cumul = 3 % par an sur ces actifs pour l'associé (voir `avecCredit`).
   */
  function holdings(sc) {
    if (_h[sc] === undefined) {
      var r = PF.R150P[XS[sc]], op = Z.avecExil(C.archiV54().exil, function () { return PF.holdingsTaxe(XS[sc], {}); });
      var credit1pc = TP.COMMUN.taux * r.A * (1 - r.evite) * (1 - r.etaH);   // la taxe de 1 % déjà payée sur les mêmes actifs, si on la créditait contre celle de 2 %
      _h[sc] = { assiette: r.A, evite: r.evite, etaH: r.etaH, brut: op.recettesBrutes, net: op.recettesNettes, avecCredit: op.recettesNettes - credit1pc, credit1pc: credit1pc };
    }
    return _h[sc];
  }
  /** Trusts (art. 792-0 bis, 1649 AB) et sociétés civiles patrimoniales : gain net (Md€/an), ligne g de montages(sc) (coût non publié, estimation HG36, preuve C). */
  function trusts(sc) {
    if (_g[sc] === undefined) { var l = G.montages(sc).filter(function (x) { return x.id === 'g'; })[0]; _g[sc] = { cout: l.coutActuel, gain: l.gainNet }; }
    return _g[sc];
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 2. Immobilier détenu par des sociétés : transparence (look-through)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * Correction du traitement de l'immobilier détenu par les ménages via des SCI (Md€/an). Aujourd'hui (v5.4) : les parts sont dans les « actions et autres participations hors OPC »
   * (1 745 Md€) ; comme toute action non cotée : valeur × 0,80, érosion de l'assiette « mobile », paiement à la vente (taux de recouvrement des non-cotés), nette des dettes de la SCI.
   * Corrigé : le sous-jacent est taxé comme de l'immobilier détenu en direct : brut des dettes, × valImmo, effet de prix de l'immobilier, pas d'érosion (un immeuble situé en France ne
   * part pas), paiement annuel (le paiement différé des ménages modestes ne joue pas : ces ménages ne détiennent pas de SCI patrimoniale, H784), minoré de la part des plafonds existants (N09).
   * ⚠️ V13462 : on suppose (taxe_patrimoine.js, comptes de patrimoine Insee) que les parts de SCI sont dans les 1 745 Md€ d'actions et participations et non dans les 4 807 Md€ de logements des ménages ;
   * si elles étaient dans les logements, elles seraient DÉJÀ taxées comme de l'immobilier direct et la correction serait nulle (partSCI = 0 la donne). Ordre de grandeur : 1,4 M de logements détenus via SCI par des personnes physiques (Insee, fiche presse 2021).
   * `o.abattement` (€ par ménage) : retire de l'assiette la part de l'abattement imputée à l'immobilier, comme TaxePatrimoine.recette (pas de double compte avec l'option d'abattement).
   */
  function immoSocietes(sc, o) {
    o = o || {}; var A = o.abattement || 0, k = i(sc), s = XS[sc], a = archiV55(HYP.tPlat);
    return Z.avecExil(a.exil, function () {
      var p = TP.PARAM[s], c = TP.composantes('pierre'), taux = TP.COMMUN.taux, r = TP.recette(s, { assiette: 'pierre', abattement: A, differe: false, avecReformeImmo: true });
      var part = o.partSCI === undefined ? HYP.partSCI[k] : o.partSCI, lev = o.levierSCI === undefined ? HYP.levierSCI[k] : o.levierSCI;
      var S0 = c.actions * (1 - p.partCotees) * part;                                           // capitaux propres des SCI détenus par les ménages (Md€, comptes nationaux)
      // avant : traité comme des non-cotés (valeur, érosion, paiement à la vente, abattement mobile), moins l'externalité de l'exil qui lui est attribuée
      var valAvant = S0 * p.valNonCotees * (1 - r.erosionMobile) * (1 - r.partAbattement.mobile);
      var avant = taux * valAvant * Z.HYP.recouvrementNonCotes[s] * (1 - p.coutGestion) - TP.COMMUN.partExil * r.erosionMobile * S0 * p.valNonCotees * (1 - r.partAbattement.mobile) * TP.COMMUN.externalite;
      // après : immobilier (brut des dettes, avec l'effet de prix), paiement annuel, hors érosion
      var brut = S0 / (1 - lev), base = brut * p.valImmo * (1 + r.effetPrix) * (1 - r.partAbattement.immo);
      var tr = Z.taxe(sc, a);
      var pl = o.sansPlafonds ? 0 : plafonds(sc);
      var apres = taux * base * (1 - p.coutGestion) * (1 - pl);
      return { S0: S0, partSCI: part, levier: lev, brutSousJacent: brut, baseApres: base, avant: avant, apres: apres, gain: apres - avant, partPlafonds: pl, taxeBruteV54: tr.brute };
    });
  }
  /** Part de la recette de la taxe de 1 % perdue aux plafonds existants (ligne « plafonds » de la v5.4 / taxe brute), appliquée à la recette nouvelle sur les hauts patrimoines : évite de la compter deux fois (H785). */
  function plafonds(sc) {
    var a = C.archiV54(), L = Z.avecExil(a.exil, function () { return ligneDePlafonds(a, sc); });
    var tr = Z.taxe(sc, a); return Math.max(0, -L) / tr.brute;
  }
  function ligneDePlafonds(a, sc) {
    var D = root.Decisions0511 || (req ? req('./decisions_0511.js') : null), ln = D.lignes(a, sc).filter(function (l) { return l.id === 'plafonds'; })[0];
    return ln.v;
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 3. Abattement sur l'assiette de la taxe de 1 % (option chiffrée)
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * Coût de l'abattement (Md€/an, positif = perte de recette) = solde de la v5.4 sans abattement − solde avec abattement, par le modèle complet : la recette brute, le paiement différé
   * (les ménages exonérés ne sont plus différés), les plafonds et l'effort sont tous recalculés avec l'abattement (optimum.js taxeCalc, distributionTaxe) : aucun double compte.
   * m : abattement par adulte (€). Détail : variation de chaque composante de la taxe.
   */
  function abattement(sc, m) {
    var A = parMenage(m), a0 = archiV55(HYP.tPlat), a1 = archiV55(HYP.tPlat, A);
    var s0 = C.solde(a0, sc, false), s1 = C.solde(a1, sc, false);
    var d0 = Z.detail(a0, sc), d1 = Z.detail(a1, sc);
    return { parAdulte: m, parMenage: A, cout: s0 - s1, brute: d0.taxeDetail.brute - d1.taxeDetail.brute, differe: d0.taxeDetail.differe - d1.taxeDetail.differe,
             perteDiffere: d0.taxeDetail.perteDiffere - d1.taxeDetail.perteDiffere, nonCotes: d0.taxeDetail.nonCotes - d1.taxeDetail.nonCotes,
             netteTaxe: d0.taxe - d1.taxe, autresLignes: (s0 - s1) - (d0.taxe - d1.taxe) };
  }
  /** Ménages (HVP, 2 000 quantiles) : part qui ne paie rien avec l'abattement A (€ par ménage), part qui ne payait déjà rien, et effet moyen par décile de patrimoine brut. */
  function parDecile(A) {
    var P = TP.population('pierre'), n = P.length, d = [], k, j;
    for (k = 0; k < 10; k++) d.push({ decile: 'D' + (k + 1), n: 0, patrimoineBrut: 0, avant: 0, apres: 0, sansTaxe: 0, sansTaxeAvant: 0 });
    P.forEach(function (m) {
      var q = Math.min(9, Math.floor(m.p * 10)), x = d[q], T = m.immo + m.mobile;
      x.n++; x.patrimoineBrut += m.W; x.avant += Math.max(0, T) * TP.COMMUN.taux; x.apres += Math.max(0, T - A) * TP.COMMUN.taux;
      if (T - A <= 0) x.sansTaxe++; if (T <= 0) x.sansTaxeAvant++;
    });
    var gain = d.reduce(function (s, x) { return s + (x.avant - x.apres); }, 0);
    return d.map(function (x) { return { decile: x.decile, patrimoineBrutMoyen: x.patrimoineBrut / x.n, impotAvant: x.avant / x.n, impotApres: x.apres / x.n, gainMoyen: (x.avant - x.apres) / x.n,
      partDesGains: gain > 0 ? (x.avant - x.apres) / gain : 0, partSansTaxe: x.sansTaxe / x.n, partSansTaxeAvant: x.sansTaxeAvant / x.n }; });
  }
  /** Ménages exonérés (nombre) avec l'abattement A par ménage : { total, nouveaux (qui payaient avant) }. */
  function exoneres(A) {
    var P = TP.population('pierre'), n = P.length, t = 0, av = 0;
    P.forEach(function (m) { var T = m.immo + m.mobile; if (T - A <= 0) t++; if (T <= 0) av++; });
    return { total: t / n * HYP.ménages, nouveaux: (t - av) / n * HYP.ménages, partTotale: t / n, partNouveaux: (t - av) / n, ménagesTotal: HYP.ménages };
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  // 4. Solde v5.5, taux d'équilibre
  // ------------------------------------------------------------------------------------------------------------------------------------------
  /** Lignes ajoutées par la v5.5 (Md€/an, + améliore le solde) au scénario sc ; abattementAdulte : montant par adulte de l'option (0 : aucun, la décision n'est pas prise). */
  function lignes(sc, m) {
    var A = m ? parMenage(m) : 0, h = holdings(sc), t = trusts(sc), im = immoSocietes(sc, { abattement: A }), ab = m ? abattement(sc, m).cout : 0;
    return [
      { id: 'holdings2', poste: 'Taxe de 2 % sur les actifs passifs des holdings patrimoniales', v: h.net },
      { id: 'trusts', poste: 'Trusts et sociétés civiles patrimoniales', v: t.gain },
      { id: 'immoSocietes', poste: 'Immobilier détenu par des sociétés : transparence (correction)', v: im.gain },
      { id: 'abattement', poste: 'Abattement sur l\'assiette de la taxe de 1 % (option)', v: -ab }
    ].filter(function (l) { return l.id !== 'abattement' || m; });
  }
  function somme(sc, m) { return lignes(sc, m).reduce(function (s, l) { return s + l.v; }, 0); }
  /** Solde (Md€/an) v5.5 au scénario sc : solde v5.4 de l'architecture (avec abattement m par adulte s'il y en a un) + les lignes de la v5.5. Au taux t (défaut 42 %). */
  function solde(sc, m, t) {
    var A = m ? parMenage(m) : 0, a = archiV55(t, A);
    var im = immoSocietes(sc, { abattement: A });
    return C.solde(a, sc, false) + holdings(sc).net + trusts(sc).gain + im.gain;
  }
  /** Plus petit taux plat (précision 0,001 point) au solde central ≥ 0 ; bisection sur [0,38 ; 0,60]. */
  function tauxEquilibreFin(m) {
    var lo = 0.38, hi = 0.60, k;
    for (k = 0; k < 40; k++) { var mid = (lo + hi) / 2; if (solde('central', m, mid) >= 0) hi = mid; else lo = mid; }
    return hi;
  }
  /** Solde central à une grille de taux (pour export vers bilan_global.py). */
  function grille(m, taux) { var r = {}; taux.forEach(function (t) { r[t.toFixed(3)] = solde('central', m, t); }); return r; }

  var API = { HYP: HYP, SCS: SCS, archiV55: archiV55, parMenage: parMenage, holdings: holdings, trusts: trusts, immoSocietes: immoSocietes, plafonds: plafonds, abattement: abattement,
              parDecile: parDecile, exoneres: exoneres, lignes: lignes, somme: somme, solde: solde, tauxEquilibreFin: tauxEquilibreFin, grille: grille };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511d = API;
})(this);
