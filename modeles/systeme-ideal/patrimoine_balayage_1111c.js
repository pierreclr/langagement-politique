/*
 * modeles/systeme-ideal/patrimoine_balayage_1111c.js — BALAYAGE du taux marginal maximal de la fonction du patrimoine (11/11/2026). NE REMPLACE RIEN : lecture seule de decisions_0611_v75.js et decisions_0611_v74.js.
 *
 * Contrainte fixée par l'auteur (11/11/2026) : un taux non confiscatoire, qui ne fasse pas délocaliser les patrimoines. Pour chaque taux t∞ (taux marginal maximal) :
 *   - mêmes réglages que la variante C de sources/impot-patrimoine-constitutionnel.md : régime RP (résidence principale à 0,25 % jusqu'à 1 M€, puis fonction), K = 700 000 €, payeProrata, plancherPro ;
 *   - recette brute = dû statique (RP + fonction) ; recette nette = chaîne de la v7.4 (érosion du capital mobile, exil, gestion, perte du différé) calée comme `Decisions0611V75.recette` (rapport nette / statique de la
 *     chaîne v7.4 au même t∞), mais ici pour les trois scénarios de comportement (favorable / central / défavorable = érosion du top 1 % de 20 / 40 / 74 % pour 1 % de taxe) ;
 *   - plafonnement à 75 % du revenu (Conseil constitutionnel, 2012-662 DC § 93) : NON simulé par le modèle ; réduction de 15 % de la fonction (bornes 5 % et 30 %), hypothèse HB1 reprise du dossier juridique (⚠️ V-PAT5) ;
 *   - départs : deux méthodes indépendantes, l'une à partir de l'exil du modèle (HB2), l'autre calée sur l'ISF observé (HB3) ; ordres de grandeur, jamais des prédictions ;
 *   - score M/J/E de la grille commune (modeles/banc-programmes/faisabilite.py, recopié ici : pas de pont Python) : M = 1 ; J = 1 si t∞ ≤ 1,5 % (taux validé en 2012, avec plafonnement), 0 au-delà ; E = 1 (HB4).
 * Hypothèses :
 *   HB1 : plafonnement à 75 % du revenu : −15 % [−5 % ; −30 %] sur la fonction (pas sur la part RP).
 *   HB2 : capital parti = exil / externalité (le modèle fait exil = partExil × capital érodé × externalité, partExil = 20/74, CAE Focus 118) ; l'érosion est un stock atteint en croisière, étalé sur 10 ans ;
 *         un parti emporte 3,5 M€ d'actif net en moyenne (DGFiP via France Stratégie 2023 : 3,5 M€ en 2021 ; 3,8 à 7 M€ en 2011-2016 : l'hypothèse majore donc le nombre de départs aux taux élevés).
 *   HB3 : ISF 2011-2016 : 950 départs par an pour un produit d'environ 5 Md€ (⚠️ V-PAT2 : produit en seconde main) = 190 départs par Md€ dû, proportionnel au dû de la fonction (la fuite est proportionnelle au taux effectif).
 *   HB4 : E = 1 pour tous les taux de la grille (précédent suisse : 1,2 % du PIB) ; avec l'ISF seul comme précédent (≈ 5 Md€), E serait 0 dès que l'attendu dépasse 10 Md€ : voir le dossier.
 * Euros 2024-2026, Md€/an en croisière, hors montée en charge. Charger (jsc) : la liste de ponts.py (jusqu'à decisions_1111b.js), puis ce fichier, puis test_patrimoine_balayage_1111c.js.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var V = root.Decisions0611V75 || (req ? req('./decisions_0611_v75.js') : null), A = root.Decisions0611V74 || (req ? req('./decisions_0611_v74.js') : null),
      TP = root.TaxePatrimoine || (req ? req('./taxe_patrimoine.js') : null);
  var NM = 30.9e6;
  var HYP = {
    K: 7e5, X: 1e6, taux: [0.005, 0.0075, 0.01, 0.0125, 0.015, 0.02], tauxRef: 0.03, KRef: 4e5,
    plafonnement: { favorable: 0.05, central: 0.15, defavorable: 0.30 },        // HB1
    horizonErosion: 10, actifParti: 3.5e6,                                          // HB2
    departsParMdISF: 950 / 5.0,                                                     // HB3
    isf: { departsAn: 950, departsPic: 1150, redevables2017: 358000, departsIFI: 260, produitMd: 5.0 },
    seuilContribuable: 1000,                                                        // €/an de dû moyen par ménage de la tranche
    grille: { 3: [0.80, 1.00, 1.00], 2: [0.40, 0.70, 1.00], 1: [0.10, 0.35, 0.80], 0: [0.00, 0.10, 0.50] },   // faisabilite.py, GRILLE
    scenarios: { favorable: 'bas', central: 'central', defavorable: 'haut' }      // noms de decisions_0611_v74.js (croisés : voir SC_TP)
  };
  function conf(t) { return { regime: 'RP', X: HYP.X, tInf: t, K: HYP.K, payeProrata: true, plancherPro: true }; }
  /** Score M/J/E d'un taux (recopié de la règle de faisabilite.py). */
  function score(t) { var m = 1, j = t <= 0.015 + 1e-12 ? 1 : 0, e = 1; return { M: m, J: j, E: e, s: Math.max(0, Math.min(3, m + j + e)) }; }
  function retenu(nette, s) { var g = HYP.grille[s]; return { bas: nette * g[0], central: nette * g[1], haut: nette * g[2] }; }
  var _stat = null;
  /** Poids statique de la chaîne v7.4 (w) : même calcul que Decisions0611V75.calage. */
  function poidsChaine() { if (_stat === null) { var r = A.HYP.patrimoine.recalage, pop = TP.population('pierreNet'), nH = NM / pop.length, w = 0; pop.forEach(function (h) { w += r * (h.immo + h.mobile) * nH; }); _stat = w; } return _stat; }
  /** Chaîne v7.4 au taux t pour un scénario de comportement (nom v7.4) : nette, exil, rapport à son dû statique. */
  function chaine(t, scv4) {
    var old = A.HYP.patrimoine.tInf; A.HYP.patrimoine.tInf = t;
    try { var rc = A.recettePatrimoine(scv4), stat = rc.tauxEffectif * poidsChaine() / 1e9; return { rc: rc, stat: stat, ratio: stat > 0 ? rc.nette / stat : 0, partExilStat: stat > 0 ? rc.exil / stat : 0 }; }
    finally { A.HYP.patrimoine.tInf = old; }
  }
  /** Départs annuels estimés par la méthode A (exil du modèle) : stock parti / actif moyen / horizon. fStat = dû statique de la fonction (v7.5), après plafonnement. */
  function departsModele(t, scv4, fStat) {
    var c = chaine(t, scv4), mult = c.stat > 0 ? fStat / c.stat : 0, capitalParti = c.rc.exil / A_EXT() * mult;      // Md€
    return { capitalPartiMd: capitalParti, departsAn: capitalParti * 1e9 / HYP.actifParti / HYP.horizonErosion };
  }
  function A_EXT() { return TP.COMMUN.externalite; }
  /** Une ligne du balayage : t = taux marginal maximal (0,015 = 1,5 %). */
  function ligne(t, opts) {
    opts = opts || {}; var c = opts.conf || conf(t), r = V.recette(c), ag = V.agreger(c), out = { t: t, score: score(t), rpNette: r.rpNette, fonctionStatique: r.fonctionStatique, brute: r.rpStatique * 1 + r.fonctionStatique, sc: {} };
    var NOMSC = ['favorable', 'central', 'defavorable'];
    NOMSC.forEach(function (n) {
      var p = HYP.plafonnement[n], fS = r.fonctionStatique * (1 - p), ch = chaine(t, HYP.scenarios[n]), mult = ch.stat > 0 ? fS / ch.stat : 0, fNet = fS * ch.ratio;
      var d = departsModele(t, HYP.scenarios[n], fS), dB = HYP.departsParMdISF * fS, nette = r.rpNette + fNet, ret = retenu(nette, out.score.s);
      out.sc[n] = { plafonnement: p, fonctionStatiquePlafonnee: fS, fonctionNette: fNet, ratio: ch.ratio, nette: nette, perteComportement: fS - fNet, capitalPartiMd: d.capitalPartiMd, departsModele: d.departsAn, departsISF: dB, retenu: ret, mult: mult };
    });
    // contribuables : ménages des tranches de patrimoine net dont le dû moyen (fonction, avant plafonnement) dépasse le seuil
    var nb = 0, nb2 = 0, nb5 = 0; ag.total && ag.tranches.forEach(function (a, j) { if (a.n > 0 && a.Pp / a.n >= HYP.seuilContribuable) nb += a.n; if (V.BORNES[j] >= 2e6) nb2 += a.n; if (V.BORNES[j] >= 5e6) nb5 += a.n; });
    out.contribuables = nb; out.menagesPlus2M = nb2; out.menagesPlus5M = nb5;
    out.tauxMoyenSurDeuxM = function () { return 0; };
    return out;
  }
  /** Référence : la variante recommandée de la v7.5 (3 %, K = 400 k€), sans plafonnement ni scénario (centrale, valeur actuelle du modèle). */
  function reference() {
    var c = { regime: 'RP', X: 1e6, tInf: HYP.tauxRef, K: HYP.KRef, payeProrata: true, plancherPro: true }, r = V.recette(c), nette = r.totale;
    return { t: HYP.tauxRef, K: HYP.KRef, nette: nette, rpNette: r.rpNette, fonctionNette: r.fonctionNette, fonctionStatique: r.fonctionStatique, departsISF: HYP.departsParMdISF * r.fonctionStatique, departsModele: departsModele(HYP.tauxRef, 'central', r.fonctionStatique).departsAn };
  }
  var _ref = null, _lignes = {};
  function lignePourTaux(t) { var k = Math.round(t * 1e6); if (!_lignes[k]) _lignes[k] = ligne(t); return _lignes[k]; }
  function balayage(taux) { return (taux || HYP.taux).map(lignePourTaux); }
  function refer() { if (!_ref) _ref = reference(); return _ref; }
  /** Écart de recette nette (Md€/an, central, croisière) entre le taux t et la v7.5 recommandée à 3 % : paramètre du système, NON appliqué par défaut. */
  function ecart(t) { return lignePourTaux(t).sc.central.nette - refer().nette; }
  /** Recommandation : parmi une grille fine, le taux qui maximise la recette retenue (central) sous la contrainte « départs du scénario central (méthode du modèle ET méthode ISF) ≤ niveau de l'ancien ISF ». */
  function recommander(options) {
    options = options || {}; var plafondDeparts = options.departsMax === undefined ? HYP.isf.departsAn : options.departsMax, best = null, tous = [], t;
    for (t = 0.005; t <= 0.0200001; t += 0.0005) { var l = lignePourTaux(Math.round(t * 1e4) / 1e4), c = l.sc.central, dm = Math.max(c.departsModele, c.departsISF), ok = dm <= plafondDeparts;
      tous.push({ t: l.t, retenu: c.retenu.central, nette: c.nette, departsMax: dm, ok: ok, s: l.score.s });
      if (ok && (best === null || c.retenu.central > best.retenu + 1e-9)) best = { t: l.t, retenu: c.retenu.central, nette: c.nette, departsMax: dm, s: l.score.s }; }
    return { best: best, tous: tous, plafondDeparts: plafondDeparts };
  }
  var API = { HYP: HYP, conf: conf, score: score, retenu: retenu, chaine: chaine, ligne: lignePourTaux, balayage: balayage, reference: refer, ecart: ecart, recommander: recommander };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.PatrimoineBalayage1111C = API;
})(this);
