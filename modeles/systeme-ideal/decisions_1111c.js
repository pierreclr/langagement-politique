/*
 * modeles/systeme-ideal/decisions_1111c.js — COUCHE DATÉE DECISIONS1111C (11/11/2026, après DECISIONS1111B) : deux décisions de l'auteur du 11/11/2026. Aucun module existant n'est modifié.
 *
 *   1. GRAND MÉNAGE branché TEL QUEL : on ajoute au solde public, année par année, la série `net_additionnel` de modeles/grand-menage/donnees/serie_2028_2038.json (Md€ de 2024-2025, + = améliore le solde ;
 *      déjà nette du non-remplacement M1, de la gestion D18, de D16 et des regroupements d'organismes, transition comprise). Central par défaut ; bas et haut donnent l'incertitude (bas = économie prudente).
 *      Hypothèses de la couche : HG1 la série est recopiée ci-dessous (le test la compare au fichier JSON quand jsc peut le lire) ; HG2 avant 2028 : 0 ; HG3 APRÈS 2038 : on garde la valeur de 2038
 *      (la série s'arrête là ; ⚠️ à trancher : une économie qui continue à monter ou à retomber n'est pas modélisée) ; HG4 les leviers F et le coefficient a restent ceux de DECISIONS1111B (pas de recalibrage) :
 *      les gains vont donc au déficit, conformément à la décision du 11/11 (« gains d'abord au déficit »).
 *   2. IMPÔT SUR LE PATRIMOINE : seulement le PARAMÈTRE DE TAUX, préparé, NON appliqué par défaut. `opts.tauxPatrimoine` (ex. 0,0125) ajoute à la trajectoire l'écart de recette nette (central, croisière,
 *      avec plafonnement à 75 % du revenu) entre ce taux marginal maximal et la v7.5 recommandée (3 %, K = 400 k€ : 62,5 Md€), calculé par patrimoine_balayage_1111c.js. Sans l'option : aucun changement.
 *      Écart appliqué en croisière dès l'année `opts.anneePatrimoine` (défaut 2029), sans montée en charge (⚠️ simplification).
 * Tout est en Md€ de 2025 par an ; des hypothèses et des ordres de grandeur, jamais des prédictions.
 * Charger (jsc) : la liste de ponts.py (LISTE_SYSTEME, jusqu'à decisions_1111b.js), patrimoine_balayage_1111c.js, puis ce fichier, puis rapport_decisions_1111c.js ou test_decisions_1111c.js.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var B = root.Decisions1111B || (req ? req('./decisions_1111b.js') : null), PB = root.PatrimoineBalayage1111C || (req ? req('./patrimoine_balayage_1111c.js') : null);
  var ANNEES = [2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038];
  /** net_additionnel du grand ménage (Md€/an) : copie de serie_2028_2038.json (HG1). */
  var SERIE = {
    bas: [0.0, -0.406, -0.4, -0.395, -0.408, -0.445, -0.112, -0.164, -0.156, -0.073, 0.03],
    central: [0.0, -0.151, -0.32, -1.012, -1.004, -0.244, 1.113, 1.991, 1.992, 1.98, 1.92],
    haut: [0.0, -0.913, -2.191, -0.95, 0.11, 7.575, 9.588, 9.569, 9.495, 9.465, 9.42]
  };
  /** Grand ménage, année an, scénario sc : 0 avant 2028, valeur de 2038 après (HG2, HG3). */
  function grandMenage(sc, an) { var s = SERIE[sc || 'central']; if (an < ANNEES[0]) return 0; if (an > ANNEES[ANNEES.length - 1]) return s[s.length - 1]; return s[an - ANNEES[0]]; }
  /** Écart du paramètre de taux du patrimoine (Md€/an, + améliore) : 0 si aucun taux choisi. */
  function ecartPatrimoine(opts) { return opts && opts.tauxPatrimoine !== undefined && opts.tauxPatrimoine !== null ? PB.ecart(opts.tauxPatrimoine) : 0; }
  /**
   * S3 de DECISIONS1111B avec le grand ménage (scénario opts.grandMenage, défaut 'central') et, si opts.tauxPatrimoine est donné, l'écart du taux de patrimoine.
   * Renvoie la trajectoire de DECISIONS1111B inchangée (`traj`, `sans`) et la nouvelle (`trajC`), plus les valeurs de déficit et de dette en % du PIB.
   */
  function s3(v, opts) {
    opts = opts || {}; var gm = opts.grandMenage === undefined ? 'central' : opts.grandMenage, an0 = opts.anneePatrimoine || 2029, ep = ecartPatrimoine(opts), o = JSON.parse(JSON.stringify(opts));
    delete o.grandMenage; delete o.tauxPatrimoine; delete o.anneePatrimoine;
    var s = B.s3(v, o), extra = function (y) { return (gm === 'aucun' ? 0 : grandMenage(gm, y)) + (y >= an0 ? ep : 0); };
    var t = s._traj(s.F, opts.macro, extra);
    return { base: s, sans: s.traj, trajC: t, F: s.F, a: s.a, grandMenage: gm, ecartPatrimoine: ep, extra: extra };
  }
  /** Déficit (part du PIB, + = déficit) et rapport de dette de l'année an (2029 = indice 0). */
  function deficit(r, an) { return { sans: r.sans.deficit[an - 2029], avec: r.trajC.deficit[an - 2029] }; }
  function dette(r, an) { return { sans: r.sans.ratio[an - 2029], avec: r.trajC.ratio[an - 2029] }; }
  /** Première année du passage durable sous 3 % de déficit pour la trajectoire avec la couche. */
  function sous3(r) { return B.sous3(r.trajC); }
  var API = { ANNEES: ANNEES, SERIE: SERIE, grandMenage: grandMenage, ecartPatrimoine: ecartPatrimoine, s3: s3, deficit: deficit, dette: dette, sous3: sous3, B: B, PB: PB };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions1111C = API;
})(this);
