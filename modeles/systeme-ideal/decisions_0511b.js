/*
 * modeles/systeme-ideal/decisions_0511b.js — v5.3 (05/11/2026, nuit) : décisions de l'auteur sur la v5.2 : majoration parent isolé remontée à 340 € par enfant et par mois,
 * taux plat UNIQUE à 42 % (au lieu du taux d'équilibre), excédent AFFECTÉ À LA DETTE, pistes d'économies « prudentes » de sources/economies-10-milliards.md ajoutées (recomposées en v5.2).
 * Module séparé au-dessus de decisions_0511.js : rien n'est modifié dans optimum.js ni dans la v5.2. Fonctions pures, euros de 2025, Md€/an en croisière,
 * ordre des scénarios du modèle [bas = favorable, central, haut = défavorable]. Hypothèses H750 à H753 (methode.md § 37). Points à vérifier V13020 et suivants.
 * Charger (depuis modeles/systeme-ideal/) : la liste de test_decisions_0511.js jusqu'à decisions_0511.js, puis ce fichier.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var D = root.Decisions0511 || (req ? req('./decisions_0511.js') : null);
  var ST = root.Stress || (req ? req('../risques/stress.js') : null);
  var F = (root.Voies || (req ? req('./voies.js') : null)).fus;
  var SCS = D.SCS;
  function i(sc) { return SCS.indexOf(sc); }

  var HYP = {
    // H750 : majoration parent isolé 340 € par enfant et par mois (décision de l'auteur, 05/11 nuit) ; le seuil de non-perte du parent isolé au Smic est ≈ 337 € à 41,3 %, ≈ 344 € à 42 % (calculé ci-dessous)
    majoration: 340,
    // H751 : taux plat unique 42 % (décision de l'auteur) ; l'excédent (solde positif) n'est PAS redistribué : il est affecté à la dette
    tPlat: 0.42,
    // H752 ⚠️ V13020 : pistes d'économies prudentes (Md€/an) comptées PLEINEMENT dès l'année 1 de la trajectoire de dette (hypothèse haute : en réalité une montée en charge de 3 à 5 ans)
    //      ordre des pistes du dossier = (prudent, central, ample) ; ordre du modèle = (bas favorable, central, haut défavorable) : la combinaison « prudente » est la valeur « prudente » de chaque piste
    //      sous le scénario défavorable, « centrale » au central, « ample » au favorable (inversion)
    pistesNom: 'prudente'
  };

  function archiV53(t, m) { return F(D.archiV52(t === undefined ? HYP.tPlat : t), { majParentIsole: m === undefined ? HYP.majoration : m }); }
  /** Économies des pistes (Md€/an) au scénario du modèle sc : combinaison du dossier (prudent / central / ample) lue à l'envers. */
  function pistes(sc, nom) { var c = D.combinaison(nom || HYP.pistesNom); return c[2 - i(sc)]; }
  /** Solde (Md€/an) de l'architecture v5.3 au scénario sc, sans ou avec les pistes d'économies. */
  function solde(a, sc, avecPistes) { return D.solde(a || archiV53(), sc) + (avecPistes ? pistes(sc) : 0); }
  function soldes(a, avecPistes) { var r = {}; SCS.forEach(function (s) { r[s] = solde(a, s, avecPistes); }); return r; }
  /** Plus petit taux plat (dixième de point) au solde ≥ 0 du scénario central, majoration de 340 €, sans ou avec pistes. */
  function tauxEquilibre(avecPistes) {
    var lo = 300, hi = 600, f = function (k) { return solde(archiV53(k / 1000), 'central', avecPistes) >= 0; };
    if (f(lo)) return lo / 1000; if (!f(hi)) return null;
    while (hi - lo > 1) { var m = Math.floor((lo + hi) / 2); if (f(m)) hi = m; else lo = m; }
    return hi / 1000;
  }
  /** Excédent (solde si positif ; sinon le solde négatif tel quel) à 42 %, au scénario sc. L'excédent est affecté à la dette : aucune redistribution. */
  function excedent(sc, avecPistes) { return solde(archiV53(), sc, avecPistes); }
  /** Écart au solde de la v5.1 (shocks.ajust de stress.js) : celui de decisions_0511.js (délai des plafonds, étalement du capital) ; avec pistes : + pistes dès l'année 1 (hypothèse haute). */
  function ajustement(a, avecPistes) {
    var base = D.ajustement(a || archiV53());
    return function (sc, t) { return base(sc, t) + (avecPistes ? pistes(sc) : 0); };
  }
  /** Dette / PIB à l'année n (1 à 10 ; défaut 10) au scénario sc ; trajectoire complète dans .ratio. */
  function dette(sc, avecPistes, a) { var r = ST.test('V5', sc, { ajust: ajustement(a || archiV53(), avecPistes) }); return { ratio10: r.ratio10, ratio5: r.ratio5, ratio: r.choc.ratio, dette: r.choc.D, solde: r.choc.B, ratio0: r.choc.ratio0 }; }
  function casTypes(a) { return D.casTypes(a || archiV53()); }
  /** Plus petite majoration (€ par enfant et par mois, pas de 1 €) pour laquelle le parent isolé au Smic ne perd rien, au taux t. */
  function seuilMajoration(t) { var m; for (m = 200; m <= 600; m++) { if (Z.casTypes(archiV53(t, m)).parent_isole_smic.ecartMois >= 0) return m; } return null; }
  /** Coût (Md€/an, central) de la majoration m par rapport à 200 € au taux t. */
  function coutMajoration(m, t) { return Z.solde(archiV53(t, 200), 'central') - Z.solde(archiV53(t, m), 'central'); }

  var API = { HYP: HYP, SCS: SCS, archiV53: archiV53, pistes: pistes, solde: solde, soldes: soldes, tauxEquilibre: tauxEquilibre, excedent: excedent, ajustement: ajustement, dette: dette, casTypes: casTypes, seuilMajoration: seuilMajoration, coutMajoration: coutMajoration };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0511b = API;
})(this);
