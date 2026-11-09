// Export de la v5.4 (majoration 345 €) pour sources/calculs/bilan_global.py. Depuis ce dossier : la liste de test_decisions_0511.js jusqu'à decisions_0511.js, puis decisions_0511b.js decisions_0511c.js rapport_decisions_0511c.js
var B = this.Decisions0511b, C = this.Decisions0511c, log = (typeof print === 'function') ? print : console.log;
function r(x) { return Math.round(x * 10000) / 10000; }
var out = { cout_345_vs_340: r(C.coutSupplementaire(0.42)), solde_v53: r(B.solde(B.archiV53(), 'central', false)), solde_v54: r(C.solde(C.archiV54(), 'central', false)),
  solde_v54_bas: r(C.solde(C.archiV54(), 'bas', false)), solde_v54_haut: r(C.solde(C.archiV54(), 'haut', false)),
  solde_v54_pistes: r(C.solde(C.archiV54(), 'central', true)), taux_eq: C.tauxEquilibre(false), taux_eq_pistes: C.tauxEquilibre(true),
  taux_eq_fin: r(C.tauxEquilibreFin(false)), taux_eq_fin_v53: r((function () { var lo = 0.40, hi = 0.44; for (var k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (B.solde(B.archiV53(m), 'central', false) >= 0) hi = m; else lo = m; } return hi; })()),
  point_de_taux: r(C.solde(C.archiV54(0.43), 'central', false) - C.solde(C.archiV54(0.42), 'central', false)),
  maj_340: B.archiV53().majParentIsole, maj_345: C.archiV54().majParentIsole, cas_pi_345: C.casTypes().parent_isole_smic ? C.casTypes().parent_isole_smic.ecartMois : null };
out.grille = {}; for (var k = 400; k <= 440; k += 4) out.grille[k / 1000] = r(C.solde(C.archiV54(k / 1000), 'central', false));
out.cout_exact = C.coutSupplementaire(0.42);
log(JSON.stringify(out, null, 1));
