/*
 * modeles/systeme-ideal/decisions_1311.js — COUCHE DATÉE DECISIONS1311 (13/11/2026, après DECISIONS1111D) : FONCTION UNIQUE DES REVENUS ADOPTÉE (μ = 0,38). Aucun module existant n'est modifié.
 *
 * Décision de l'auteur (13/11/2026, fonction-unique-1311.md, « Décision de l'auteur ») : le minimum garanti est fondu dans la fonction des revenus (forme B de fonction_unique_1311.js), premier euro à 38 % :
 *     C(R) = a·R − P − (a − μ)·K_P·(1 − e^(−R/K_P)),   K_P = (S + (a − m0)·K − P) / (a − μ),   P = 877 € avec loyer, 627 € sans loyer ;   μ = 0,38.
 * Le filet retiré à 25 centimes par euro de gain net disparaît (il est inclus dans le taux sur l'euro suivant).
 *
 * Deux lignes, constantes dès la bascule (2029), comme les lignes PL01 et PL02 de la couche du 08/11 :
 *   FU01 — CORRECTION DE CONVENTION DE PL01 (part logement retirée aussi dans la zone de retrait). Le bilan (bareme_unique_v6.js plancher(), optimum.js massesPlancher) compte le complément de la zone de
 *          retrait au plancher de 877 € pour TOUS les adultes qui gagnent un peu ; la ligne PL01 (decisions_0811.js) ne retire la part logement (250 €) qu'aux 3,3 M de bénéficiaires à revenu nul. Or la règle
 *          (chapitre 4, § Le plancher ; decisions_0811.js HE6) retire la part logement de quiconque ne paie pas de loyer, revenu nul ou non : le bilan surestimait la dépense. Valeur : coût de la règle actuelle
 *          compté à 877 € partout − coût de la même règle avec la part sans loyer à 627 € (fonction_unique_1311.js recette().ecartConventionPL01).
 *   FU02 — DÉCISION : fonction unique à μ = 0,38 au lieu de la règle actuelle (fonction + filet à 25 centimes), part logement traitée de la même façon des deux côtés (recette().gainEtat, μ = 0,38).
 *   La somme FU01 + FU02 = coût du bilan tel qu'il était tenu − coût de la fonction unique (recette().gainEtatVsModele) : c'est ce qui s'ajoute au solde.
 * Hypothèses de la couche :
 *   HF1 chiffrage de fonction_unique_1311.js (H-FU1 à H-FU8) avec μ = 0,38 : même population, mêmes nœuds et même calage k que le plancher du moteur ; parts sans loyer 27 / 19 / 7 % (HE6) ;
 *       ⚠️ k calé pour l'ancienne règle et part sans loyer des allocataires du RSA appliquée à toute la zone de retrait (H-FU6, H-FU7) ; mécanique, sans réaction de l'emploi (H-FU8).
 *   HF2 scénarios : « bas » de fonction_unique_1311.js (dispersion 0,3, sans loyer 27 %) = favorable, « haut » (0,9 ; 7 %) = défavorable, comme PL01 (proprietaires[0] + heberges[0] = 27 %) ;
 *       les deux lignes viennent du même scénario, elles bougent ensemble.
 *   HF3 en croisière dès 2029, sans montée en charge (comme PL01, PL02) ; les prélèvements obligatoires ne changent pas (le plancher est une dépense, ligne N24 du bilan ; la fonction individuelle n'est pas modifiée).
 *   HF4 rien d'autre n'est ajusté : leviers F et coefficient a de DECISIONS1111B ; patrimoine à 1,25 % et grand ménage de DECISIONS1111D.
 * `s3` renvoie un objet de même forme que celui de DECISIONS1111D (traj, trajPrudente, po, F, a, lignes...), lignes FU01 et FU02 ajoutées ; `sansCouche` = trajectoire de DECISIONS1111D.
 * Tout est en Md€ de 2025 par an ; des hypothèses et des ordres de grandeur, jamais des prédictions.
 * Charger (jsc) : la liste de ponts.py jusqu'à decisions_1111d.js, puis fonction_unique_1311.js, ce fichier, puis test_decisions_1311.js.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var D = root.Decisions1111D || (req ? req('./decisions_1111d.js') : null), U = root.FonctionUnique1311 || (req ? req('./fonction_unique_1311.js') : null);
  var MU = 0.38, AN0 = 2029, SCS = ['bas', 'central', 'haut'];
  var _l = {};
  /** Chiffrage de la décision au taux du premier euro mu (défaut 0,38) : par scénario [bas = favorable, central, haut = défavorable], Md€/an, + = améliore le solde. */
  function chiffrage(mu) {
    var m = mu === undefined ? MU : mu, k = String(m); if (_l[k]) return _l[k];
    var r = SCS.map(function (sc) { return U.recette(sc, { mu: m }); });
    return (_l[k] = { mu: m, correctionPL01: r.map(function (x) { return x.ecartConventionPL01; }), decision: r.map(function (x) { return x.gainEtat; }),
                      net: r.map(function (x) { return x.gainEtatVsModele; }), coutModele: r.map(function (x) { return x.coutAncienModele; }),
                      coutRegleEcrite: r.map(function (x) { return x.coutAncien; }), coutFonctionUnique: r.map(function (x) { return x.coutNouveau; }), k: r.map(function (x) { return x.k; }),
                      partSansLoyer: r.map(function (x) { return x.partSansLoyer; }) });
  }
  /** Lignes de la couche (format des lignes de decisions_0811.js : v = [favorable, central, défavorable], sens 'dep', + = économie). */
  function lignes(mu) {
    var c = chiffrage(mu);
    return [{ id: 'FU01', poste: 'Part logement (250 €) retirée aussi dans la zone de retrait à qui ne paie pas de loyer : correction de convention de PL01 (le bilan comptait 877 € pour tous)', v: c.correctionPL01.slice(), sens: 'dep', cote: 'C' },
            { id: 'FU02', poste: 'Fonction unique des revenus (premier euro à ' + Math.round(100 * c.mu) + ' %) au lieu du filet retiré à 25 centimes par euro', v: c.decision.slice(), sens: 'dep', cote: 'C' }];
  }
  /** S3 avec la couche : options de DECISIONS1111D, plus opts.mu (défaut 0,38) et opts.fonctionUnique = false pour retirer la couche (retour à DECISIONS1111D). */
  function s3(v, opts) {
    var o = JSON.parse(JSON.stringify(opts || {})), mu = o.mu === undefined ? MU : o.mu, actif = o.fonctionUnique !== false; delete o.mu; delete o.fonctionUnique;
    var d = D.s3(v, o), s = {}, k;
    for (k in d) if (Object.prototype.hasOwnProperty.call(d, k)) s[k] = d[k];
    var oc = JSON.parse(JSON.stringify(o)); if (oc.tauxPatrimoine === undefined) oc.tauxPatrimoine = D.TAUX;   // même défaut que DECISIONS1111D
    var base = D.C.s3(v, oc).extra, net = actif ? chiffrage(mu).net[1] : 0;
    var extra = function (y) { return base(y) + (y >= AN0 ? net : 0); };
    s.traj = d._traj(d.F, o.macro, extra); s.trajPrudente = d._traj(d.F, 'prudente', extra);
    s.sansCouche = d.traj; s.sansCouchePrudente = d.trajPrudente;
    s.ecart1311 = net; s.mu = actif ? mu : null; s.extra = extra;
    s.lignes = actif ? d.lignes.concat(lignes(mu)) : d.lignes.slice();
    return s;
  }
  function deficit(s, an) { return { sans: s.sansCouche.deficit[an - 2029], avec: s.traj.deficit[an - 2029] }; }
  function dette(s, an) { return { sans: s.sansCouche.ratio[an - 2029], avec: s.traj.ratio[an - 2029] }; }
  function sous3(t) { return D.sous3(t); }
  var API = { MU: MU, AN0: AN0, chiffrage: chiffrage, lignes: lignes, s3: s3, deficit: deficit, dette: dette, sous3: sous3, D: D, U: U, C: D.C, B: D.B, TAUX: D.TAUX, ligne: D.ligne };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions1311 = API;
})(this);
