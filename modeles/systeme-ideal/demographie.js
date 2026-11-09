/*
 * modeles/systeme-ideal/demographie.js — T47, démographie branchée sur le palier 1 (01/11/2026). Fonctions pures au-dessus de palier1.js et de trajectoires_demo.js
 * (généré par generer_demographie.py depuis ../prospective-demographie/trajectoires.csv et emploi.py). Hypothèses H145 à H152 : methode.md § 17.
 * Charger dans l'ordre : modele.js voies.js sante.js optimisation.js retraites2.js palier1.js trajectoires_demo.js demographie.js.
 *
 * Principe : le palier 1 est calculé à 2025 (solde central −167 Md€, taux plat 35 %) ; on fait varier les VOLUMES (retraités, adultes non retraités, emploi, enfants) comme les trajectoires
 * démographiques, à taux plat, socle (500 €), seuils et pensions par tête constants en euros constants. Le solde à l'année t = solde 2025 + Σ variations de lignes :
 *   assiette (recettes courantes) × indice d'emploi × (1+g)^k ; socle des adultes non retraités × indice ; enfants × indice des moins de 20 ans ;
 *   masse des pensions × indice des retraités (× (1+g)^k si pensions indexées sur les salaires) ; impôt des retraités et contribution des hautes pensions × indice des retraités.
 * Scénarios : bas = population jeune (favorable), central, haut = population âgée (défavorable), appariés aux scénarios de réactions du modèle (cumul des extrêmes : borne, pas probabilité).
 * Simplifications nommées : pas de dépense de santé ni de dépendance qui croît avec l'âge (non comptée), IS et transmissions constants (sauf option reste: 'pib', 02/11/2026 : tout le reste du budget suit alors le PIB), taux d'activité par âge du COR, pas de productivité (g = 0 par
 * défaut), pas d'effet de composition sur le revenu moyen (les actifs gardent le revenu moyen de 2025), pension moyenne constante par retraité. Des ordres de grandeur, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var P1 = root.Palier1 || (typeof require !== 'undefined' ? require('./palier1.js') : null);
  var T = root.TrajectoiresDemo || (typeof require !== 'undefined' ? require('./trajectoires_demo.js') : null);
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var O = root.Optimisation || (typeof require !== 'undefined' ? require('./optimisation.js') : null);
  var R2 = root.Retraites2 || (typeof require !== 'undefined' ? require('./retraites2.js') : null);
  var F = (root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null)).fus;
  var D = M.DONNEES;
  var AN0 = 2025, COL = {};
  T.colonnes.forEach(function (c, i) { COL[c] = i; });

  // Pension moyenne relative au revenu d'activité moyen (COR, rapport annuel juin 2026) : 54,6 % en 2025 et 45,3 % en 2070 (trajectoire de référence) ; interpolation linéaire, constante après 2070.
  // Option pensions: 'cor' : pension moyenne = pension 2025 × (1+g)^k × (relative(t) / relative(2025)) : les pensions suivent les salaires avec le décrochage relatif du COR (écart de l'audit du 01/11/2026, A3).
  var COR_PENSION_RELATIVE = { an0: 2025, v0: 0.546, an1: 2070, v1: 0.453 };
  function relativeCOR(annee) {
    var c = COR_PENSION_RELATIVE, t = Math.max(0, Math.min(1, (annee - c.an0) / (c.an1 - c.an0)));
    return (c.v0 + (c.v1 - c.v0) * t) / c.v0;
  }
  /** Facteur d'indexation de la pension moyenne à l'année t (2025 = 1) selon la règle : 'prix' (1), 'salaires' ((1+g)^k), 'cor' ((1+g)^k × pension relative du COR). */
  function facteurPensions(regle, g, annee) {
    var croiss = Math.pow(1 + (g || 0), annee - AN0);
    if (regle === 'salaires') return croiss;
    if (regle === 'cor') return croiss * relativeCOR(annee);
    return 1;
  }

  /** Ligne brute de l'année t pour un scénario ('bas' | 'central' | 'haut' du modèle). */
  function ligne(sc, annee) {
    var s = T.scenarios[sc];
    if (!s) throw new Error('scénario inconnu : ' + sc);
    var l = s.annees[annee - AN0];
    if (!l) throw new Error('année hors trajectoire (2025-2070) : ' + annee);
    return l;
  }

  /** Volumes (personnes) et indices (2025 = 1) : adultes non retraités = 20-64 + 65 et plus − retraités (H146). */
  function volumes(sc, annee) {
    var l = ligne(sc, annee), l0 = ligne(sc, AN0);
    function adn(x) { return x[COL.p20_64] + x[COL.p65plus] - x[COL.retraites]; }
    return { annee: annee, moins20: l[COL.moins20], adultesNonRetraites: adn(l), retraites: l[COL.retraites], emploi: l[COL.emploi], actifs: l[COL.actifs], p20_64: l[COL.p20_64],
      idx: { moins20: l[COL.moins20] / l0[COL.moins20], adultes: adn(l) / adn(l0), retraites: l[COL.retraites] / l0[COL.retraites], emploi: l[COL.emploi] / l0[COL.emploi] },
      actifsParRetraite: l[COL.actifs] / l[COL.retraites], emploiParRetraite: l[COL.emploi] / l[COL.retraites] };
  }

  /** Lignes du palier 1 en 2025 (Md€/an) pour un scénario de réactions : celles qui dépendent des volumes. */
  function lignes2025(st, sc) {
    var s = M.solde(F(O.configR(st), { scenario: sc }));
    return { assiette: s.recettes.courants, socle: s.postes.socleAdultes, enfants: s.postes.enfants, impotRetraites: s.recettes.retraites,
      pensions: D.massePensions, hautesPensions: R2.contribution(P1.HP, sc).netMd };
  }

  /**
   * Solde du palier 1 à l'année t, à taux constant. p : { reste ('fige' défaut | 'pib' | 'productivite', voir ci-dessous), g (croissance réelle annuelle du revenu moyen d'activité, 0), pensions ('prix' défaut | 'salaires' | 'cor'), valeur (false : ajoute la création de valeur
   * de l'année t − 2026, extrapolée sans plafond après 10 ans ⚠️), socle ('prix' défaut | 'salaires' : socle des adultes et des enfants × (1+g)^k, T47 croissance.js), o (options de palier1.solde) }.
   */
  function solde(st, sc, annee, p) {
    p = p || {};
    var g = p.g || 0, k = annee - AN0, croiss = Math.pow(1 + g, k), v = volumes(sc, annee), L = lignes2025(st, sc);
    var pensIdx = facteurPensions(p.pensions, g, annee), socIdx = p.socle === 'salaires' ? croiss : 1;
    var d = { assiette: L.assiette * (v.idx.emploi * croiss - 1), socle: -L.socle * (v.idx.adultes * socIdx - 1), enfants: -L.enfants * (v.idx.moins20 * socIdx - 1),
      pensions: -L.pensions * (v.idx.retraites * pensIdx - 1), impotRetraites: (L.impotRetraites + L.hautesPensions) * (v.idx.retraites * pensIdx - 1) };
    var base = P1.solde(st, sc, p.o), total = d.assiette + d.socle + d.enfants + d.pensions + d.impotRetraites;
    // Reste du budget (audit du 01/11/2026, A1) : solde 2025 moins les cinq lignes ci-dessus (dépenses hors pensions et socle, TVA, IS, transmissions, autres recettes), net ≈ −384 Md€.
    // p.reste : 'fige' (défaut ici : ancien comportement, euros de 2025) | 'pib' (indexé sur le PIB en euros constants = emploi × productivité) | 'productivite' (indexé sur (1+g)^k seulement).
    var mode = p.reste || 'fige', resteNiveau = base - (L.assiette - L.socle - L.enfants - L.pensions + L.impotRetraites + L.hautesPensions);
    var resteIdx = mode === 'pib' ? v.idx.emploi * croiss : mode === 'productivite' ? croiss : 1;
    if (mode !== 'fige' && mode !== 'pib' && mode !== 'productivite') throw new Error('option reste inconnue : ' + mode);
    d.reste = resteNiveau * (resteIdx - 1); total += d.reste;
    var val = p.valeur ? P1.valeurPourScenario(Math.max(0, annee - 2026), sc).total : 0;
    return { annee: annee, scenario: sc, base: base, variations: d, variationTotale: total, valeur: val, solde: base + total + val, volumes: v, resteNiveau: resteNiveau, reste: mode };
  }

  /**
   * Socle finançable (€/mois par adulte non retraité) à l'année t : celui pour lequel le solde de l'année t égale le solde 2025 du palier 1 (même scénario), au même taux plat.
   * Le coût d'un euro de socle suit l'indice des adultes non retraités (pente de palier1.penteSocle × indice) ; plancher 0. Sans création de valeur sauf p.valeur.
   */
  function pente(st, annee, s, p) { return P1.penteSocle(st, p && p.o) * s.volumes.idx.adultes * (p && p.socle === 'salaires' ? Math.pow(1 + ((p && p.g) || 0), annee - AN0) : 1); }

  function socleFinancable(st, sc, annee, p) {
    var s = solde(st, sc, annee, p), pente_ = pente(st, annee, s, p);
    return Math.max(0, st.socle + (s.solde - s.base) / pente_);
  }

  /** Tableau de synthèse : pour chaque scénario et chaque année (2035, 2045, 2065), volumes, solde et socle finançable. */
  function resume(st, annees, p) {
    annees = annees || [2035, 2045, 2065];
    var out = {};
    ['bas', 'central', 'haut'].forEach(function (sc) {
      out[sc] = annees.map(function (a) { var s = solde(st, sc, a, p); s.socleFinancable = socleFinancable(st, sc, a, p); return s; });
    });
    return out;
  }

  var API = { COR_PENSION_RELATIVE: COR_PENSION_RELATIVE, relativeCOR: relativeCOR, facteurPensions: facteurPensions, ligne: ligne, volumes: volumes, lignes2025: lignes2025, pente: pente, solde: solde, socleFinancable: socleFinancable, resume: resume, AN0: AN0 };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.DemographieSI = API;
})(this);
