/*
 * modeles/systeme-ideal/decisions_1111d.js — COUCHE DATÉE DECISIONS1111D (11/11/2026, après DECISIONS1111C) : IMPÔT SUR LE PATRIMOINE À 1,25 % (taux marginal maximal), avec plafonnement à 75 % du revenu. Aucun module existant n'est modifié.
 *
 * Décision de l'auteur (11/11/2026) : taux marginal maximal de la fonction du patrimoine fixé à 1,25 % (sources/impot-patrimoine-balayage.md, sources/impot-patrimoine-constitutionnel.md). On active le paramètre
 * `tauxPatrimoine` de DECISIONS1111C par défaut (0,0125) ; le grand ménage reste branché (central) ; leviers F et coefficient a de la fonction des revenus INCHANGÉS (les gains vont d'abord au déficit).
 * Hypothèses : HD1 recette nette centrale de la ligne 1,25 % (RP + fonction, K = 700 k€, plafonnement −15 % de la fonction) moins celle de la v7.5 à 3 % (62,5 Md€), en croisière dès 2029 sans montée en charge (⚠️ simplification
 * héritée de DECISIONS1111C) ; HD2 les prélèvements obligatoires baissent du même écart (/ PIB du modèle) ; HD3 rien d'autre n'est ajusté.
 * `s3` renvoie un objet de même forme que celui de DECISIONS1111B (traj, trajPrudente, po, F, a, lignes...), avec traj et trajPrudente = trajectoires AVEC grand ménage et patrimoine à 1,25 % ; `avant` = DECISIONS1111C sans taux (grand ménage seul) et
 * `sansCouche` = DECISIONS1111B.
 * Tout est en Md€ de 2025 par an ; des hypothèses et des ordres de grandeur, jamais des prédictions.
 * Charger (jsc) : la liste de ponts.py (jusqu'à decisions_1111b.js), patrimoine_balayage_1111c.js, decisions_1111c.js, puis ce fichier, puis test_decisions_1111d.js.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var C = root.Decisions1111C || (req ? req('./decisions_1111c.js') : null), RA = root.RetraitesAisees0611 || (req ? req('./retraites_aisees_0611.js') : null);
  var TAUX = 0.0125;
  /** Recette nette centrale du patrimoine au taux t (Md€/an) : v7.5 à 3 % + écart. */
  function recettePatrimoine(sc, t) { var l = C.PB.ligne(t === undefined ? TAUX : t), n = sc || 'central'; return l.sc[{ bas: 'favorable', central: 'central', haut: 'defavorable', favorable: 'favorable', defavorable: 'defavorable' }[n]].nette; }
  /** Les trois scénarios (favorable, central, défavorable) de la recette nette au taux t, plus la brute (dû statique RP + fonction, avant plafonnement et comportements). */
  function ligne(t) { var l = C.PB.ligne(t === undefined ? TAUX : t); return { t: l.t, brute: l.brute, favorable: l.sc.favorable.nette, central: l.sc.central.nette, defavorable: l.sc.defavorable.nette, ecart: C.PB.ecart(l.t), reference: C.PB.reference().nette, score: l.score }; }
  /** S3 avec la couche : taux du patrimoine 1,25 % par défaut (opts.tauxPatrimoine = null pour le retirer), grand ménage central par défaut. */
  function s3(v, opts) {
    opts = JSON.parse(JSON.stringify(opts || {})); if (opts.tauxPatrimoine === undefined) opts.tauxPatrimoine = TAUX;
    var r = C.s3(v, opts), b = r.base, s = {}, k;
    for (k in b) if (Object.prototype.hasOwnProperty.call(b, k)) s[k] = b[k];
    var pib = RA && RA.S ? RA.S.pib : null;
    s.traj = r.trajC; s.trajPrudente = b._traj(b.F, 'prudente', r.extra);
    s.sansCouche = b.traj; s.sansCouchePrudente = b.trajPrudente; s.ecartPatrimoine = r.ecartPatrimoine; s.grandMenage = r.grandMenage; s.tauxPatrimoine = opts.tauxPatrimoine;
    s.po = { md: b.po.md + r.ecartPatrimoine, pct: b.po.pct, elargisPct: b.po.elargisPct }; if (pib) { s.po.pct = s.po.md / pib; s.po.elargisPct = b.po.elargisPct + r.ecartPatrimoine / pib; }
    s.po.avantMd = b.po.md; s.po.avantPct = b.po.pct;
    return s;
  }
  function deficit(s, an) { return { sans: s.sansCouche.deficit[an - 2029], avec: s.traj.deficit[an - 2029] }; }
  function dette(s, an) { return { sans: s.sansCouche.ratio[an - 2029], avec: s.traj.ratio[an - 2029] }; }
  function sous3(t) { return C.B.sous3(t); }
  var API = { TAUX: TAUX, recettePatrimoine: recettePatrimoine, ligne: ligne, s3: s3, deficit: deficit, dette: dette, sous3: sous3, C: C, B: C.B };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions1111D = API;
})(this);
