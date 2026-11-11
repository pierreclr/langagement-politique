/*
 * modeles/systeme-ideal/decisions_1111b.js — COUCHE DATÉE DECISIONS1111B (11/11/2026, après DECISIONS1111) : « les gains d'abord au déficit, pas aux baisses d'impôts ».
 *
 * Décision de l'auteur (11/11/2026) : la règle héritée « dette stable dès 2038 », qui recalibrait les leviers votés F (33,3 → 9,5 Md€) et le coefficient a de la fonction des revenus (0,65 → 0,63)
 * et rendait donc les gains (retraites loi de 2023, entreprise d'État à 1 Md€) aux prélèvements, est SUPPRIMÉE. Les économies et gains servent d'abord à réduire le déficit jusqu'à moins de 3 % du PIB ;
 * aucune baisse de prélèvement avant.
 * Mise en oeuvre : S3 de DECISIONS1111 (mêmes dispositifs retraites et entreprise d'État) avec les leviers F imposés à leur valeur d'avant le recalibrage (celle de CORRECTION0811 : le coefficient a en découle
 * exactement, il n'est pas réglé à la main). Aucun module existant n'est modifié ; DECISIONS1111 et CORRECTION0811 restent reproductibles.
 *
 * Règle explicite « baisse des prélèvements seulement une fois le déficit sous 3 % » : NON implémentée. Elle demanderait de choisir une règle de restitution (quelle baisse, de quel montant, étalée comment) qui est
 * une décision de conception, pas un simple réglage : on garde F constant et on RAPPORTE l'année de passage sous 3 % (`sous3`), qui dit à partir de quand une baisse deviendrait possible (⚠️ à trancher par l'auteur).
 * Tout est en Md€ de 2025 par an ; des hypothèses et des ordres de grandeur, jamais des prédictions.
 * Charger (jsc) : la liste de ponts.py (LISTE_SYSTEME, jusqu'à decisions_1111.js), puis ce fichier, puis rapport_decisions_1111b.js ou test_decisions_1111b.js.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var N = root.Decisions1111 || (req ? req('./decisions_1111.js') : null), C = root.Correction0811 || (req ? req('./correction_0811.js') : null);
  var _F = null;
  /** Leviers F d'avant le recalibrage (CORRECTION0811), Md€/an : gardés fixes. */
  function leviersGardes() { if (_F === null) _F = C.s3().F; return _F; }
  /** S3 sans recalibrage des leviers : mêmes dispositifs que DECISIONS1111, F = leviers de CORRECTION0811. */
  function s3(v, opts) { var o = JSON.parse(JSON.stringify(opts || {})); if (o.F === undefined) o.F = leviersGardes(); return N.s3(v, o); }
  /** Variante macro prudente aux mêmes leviers (aucun recalibrage non plus). */
  function prudente(v, opts) { var o = JSON.parse(JSON.stringify(opts || {})); o.macro = 'prudente'; return s3(v, o); }
  /** Première année à partir de laquelle le déficit (central de la trajectoire) reste sous 3 % du PIB jusqu'à 2058 ; null si jamais, 2029 si toujours. */
  function sous3(t) { var n = Math.min(30, t.deficit.length), a = null, k; for (k = 0; k < n; k++) if (t.deficit[k] > 0.03) a = k; if (a === null) return 2029; return a === n - 1 ? null : 2029 + a + 1; }
  var API = { leviersGardes: leviersGardes, s3: s3, prudente: prudente, sous3: sous3, delta: N.delta, deltaDetail: N.deltaDetail, v6: N.v6, cir: N.cir, composantes: N.composantes, saut: N.saut, clause: N.clause };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions1111B = API;
})(this);
