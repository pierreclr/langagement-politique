/*
 * modeles/systeme-ideal/decisions_0511c.js — v5.4 (05/11/2026) : décision de l'auteur : majoration parent isolé 345 € par enfant et par mois (au lieu de 340 €).
 * Extension au-dessus de decisions_0511b.js : rien n'est modifié dans les modules existants (la v5.3 à 340 € reste reproductible par B.archiV53()).
 * Fonctions pures, Md€/an en croisière ; ordre des scénarios du modèle [bas = favorable, central, haut = défavorable]. Hypothèse H754 (methode.md § 37).
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511.js jusqu'à decisions_0511.js, puis decisions_0511b.js, puis ce fichier.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var B = root.Decisions0511b || (req ? req('./decisions_0511b.js') : null);
  var D = root.Decisions0511 || (req ? req('./decisions_0511.js') : null);
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var HYP = { majoration: 345, tPlat: 0.42 };   // H754 : 345 € (décision de l'auteur) ; coût proportionnel, sans effet de comportement (H709-H712)

  function archiV54(t, m) { return B.archiV53(t === undefined ? HYP.tPlat : t, m === undefined ? HYP.majoration : m); }
  function solde(a, sc, avecPistes) { return B.solde(a || archiV54(), sc, avecPistes); }
  function tauxEquilibre(avecPistes) {
    var lo = 300, hi = 600, f = function (k) { return solde(archiV54(k / 1000), 'central', avecPistes) >= 0; };
    if (f(lo)) return lo / 1000; if (!f(hi)) return null;
    while (hi - lo > 1) { var m = Math.floor((lo + hi) / 2); if (f(m)) hi = m; else lo = m; }
    return hi / 1000;
  }
  /** Taux d'équilibre en centièmes de point (précision 0,01 point) par interpolation linéaire du solde central entre deux taux voisins. */
  function tauxEquilibreFin(avecPistes) {
    var t0 = 0.40, t1 = 0.44, s0 = solde(archiV54(t0), 'central', avecPistes), s1 = solde(archiV54(t1), 'central', avecPistes);
    var lo = t0, hi = t1; for (var k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (solde(archiV54(m), 'central', avecPistes) >= 0) hi = m; else lo = m; }
    return hi;
  }
  /** Coût supplémentaire (Md€/an, central) de 345 € par rapport à 340 € au taux t. */
  function coutSupplementaire(t) { return B.solde(B.archiV53(t, 340), 'central', false) - B.solde(B.archiV53(t, 345), 'central', false); }
  function casTypes(a) { return D.casTypes(a || archiV54()); }

  var API = { HYP: HYP, SCS: B.SCS, archiV54: archiV54, solde: solde, tauxEquilibre: tauxEquilibre, tauxEquilibreFin: tauxEquilibreFin, coutSupplementaire: coutSupplementaire, casTypes: casTypes };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511c = API;
})(this);
