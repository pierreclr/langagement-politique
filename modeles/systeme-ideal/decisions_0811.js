/*
 * modeles/systeme-ideal/decisions_0811.js — COUCHE DATÉE DECISIONS0811 : décisions de l'auteur du 07/11/2026 (soir, après 17 h) et du 08/11/2026.
 * Posée sur la couche DECISIONS0711 (variante par défaut : garantie à coût constant en ligne droite), sans modifier aucun module existant.
 *
 *   1. Grand âge (modeles/grand-age/, central, abattement de reprise 100 000 €, aide à domicile +20 % de volume sans reprise) : surcoût public intégré à la ligne « vieillesse » ;
 *   2. sous-indexation R1f des hautes pensions SUPPRIMÉE ; courbe des pensions C_p(P) = k × [(P − 2 000) − 1 500 × (1 − e^(−(P − 2 000)/1 500))] relevée pour rapporter 9 Md€ (k recalculé exactement) ;
 *   3. TVA : les autres biens à 5,5 % et 2,1 % passent à 5 % (V20006, chiffré ici, assiettes ⚠️) ;
 *   4. conversion en salaire à coût employeur inchangé : part patronale de la mutuelle (BT08), 50 % de l'abonnement de transport ; titres-restaurant déjà comptés (BT09) ;
 *   5. plancher en deux parts : socle 627 € + part logement 250 € versée à qui n'occupe pas un logement dont il est propriétaire, plafonnée au loyer payé ;
 *   6. coefficient de lieu sur le plancher (1 en métropole, 1,09 à 1,16 outre-mer) ; extinction des sur-rémunérations publiques outre-mer ; compensation des prix alimentaires outre-mer ;
 *   7. clause automatique de la loi de bascule : si la dette dépasse la trajectoire votée de plus de 2 points de PIB, la fonction des revenus et la courbe des pensions montent ;
 *   8. lignes de sources/chiffrage-decisions-0811.md (collectivités, justice, protection de l'enfance, artificialisation, imprévus, retenue victimes).
 * Hypothèses HE1 à HE16 : bilan global (document de travail non publié), § 000000 ; vérifications V30000 et suivantes. Fonctions pures.
 * Charger (jsc) : la liste de rapport_consolidation_0611.js (sans le rapport), puis decisions_0711.js, ce fichier, puis rapport_decisions_0811.js ou test_decisions_0811.js.
 */
(function (root) {
  'use strict';
  var R = root.RetraitesAisees0611, K = root.Consolidation0611, T = root.Transmissions0611, Y = root.Decisions0611V72, N = root.CasTypesNets0611, D = root.Decisions0711;

  var HYP = {
    // HE1 : grand âge, résidents de 2023, euros 2026 (modeles/grand-age/resultats.txt § 3, abattement 100 000 €) : écart « dépense nette après droits − actuel » bas / central / haut
    //       (central : dépense nette 21,9 contre 18,7 aujourd'hui ; reprises 1,3 déjà déduites) ; HE2 : aide à domicile +20 % de volume, sans reprise (§ 6) : 0,9 dans les trois
    grandAge: { surcout: [1.0, 3.2, 6.5], reprises: [1.0, 1.3, 1.1], domicile: [0.9, 0.9, 0.9], depenseNette: 21.9, actuel: 18.7, abattement: 100000 },
    // HE3 : courbe des pensions relevée : cible 9 Md€ (décision du 08/11), même seuil (2 000 €) et même K (1 500 €) ; R1f supprimée
    cibleCourbe: 9.0,
    // HE4 : TVA, autres postes, assiettes en Md€ TTC 2024 ⚠️ ordres de grandeur NON Insee (le fichier consommation_menages_2024.csv n'a pas ces fonctions COICOP) ; élasticité 0,5
    tva: [
      { id: 'TV06', lib: 'Livres (5,5 % → 5 %)', conso: 4.0, r0: 0.055, e: 0.5 },
      { id: 'TV07', lib: 'Presse (2,1 % → 5 %)', conso: 2.5, r0: 0.021, e: 0.5 },
      { id: 'TV08', lib: 'Billetterie : cinéma 1,5 à 5,5 % ; spectacle vivant 0,5 à 2,1 % (→ 5 %)', conso: [[1.5, 0.055], [0.5, 0.021]], e: 0.5 },
      { id: 'TV09', lib: 'Rénovation énergétique : retour de 10 % (N11 de la base, +0,087) à 5 % ; assiette travaux 12 Md€ HT ⚠️', special: 'renovation' },
      { id: 'TV10', lib: 'Divers à 5,5 % (hygiène, équipements pour personnes handicapées, chaleur de réseau, cantines) → 5 % ; assiette 2 Md€', conso: 2.0, r0: 0.055, e: 0.3 }
    ],
    renovation: { assiette: 12.0, n11: 0.087, e: 0.5 },
    // HE5 : conversion en salaire (coût employeur inchangé) : assiette exemptée de la part employeur de la mutuelle 23,8 × 55 % (PLFSS 2026 annexe 4, BT08) ; transport : ≈ 5 M de salariés × 560 € × 50 % ⚠️ ;
    //       titres-restaurant : assiette 6,8 déjà dans BT09 (non recomptée) ; taux marginal moyen 0,58 (HB6) ; part déjà dans R : inconnue (V16515) → central = moitié, défavorable = 0
    conversion: { mutuelle: 23.8 * 0.55, transport: [2.0, 1.4, 0.8], titres: 6.8, marginal: 0.58, partNouvelle: [1, 0.5, 0] },
    // HE6 : plancher en deux parts : socle 627 + logement 250 (loyer payé, plafonné) ; bénéficiaires : RSA ≈ 1,9 M de foyers + AAH 1,4 M ⚠️ ; propriétaires 7 à 22 % (DREES, ER 1370 : 9 % des foyers au RSA ; 12 % des
    //       bénéficiaires de minima) ; hébergés sans loyer 0 / 10 / 15 % ⚠️ (« plus de 20 % n'ont pas leur propre logement », DREES, hébergés payants compris)
    plancher: { socle: 627, logement: 250, beneficiaires: 3.3e6, proprietaires: [0.12, 0.09, 0.07], heberges: [0.15, 0.10, 0.0] },
    // HE7 : coefficient de lieu : écart Insee 2022 hors loyers (Guadeloupe 15,8 ; Martinique 13,8 ; Guyane 13,7 ; Réunion 8,9 ; Mayotte 10,3), pondéré par la population ⚠️ (résidents 2022 de mémoire) ;
    //       dépense de plancher outre-mer = filet métropolitain 16,4539 (bilan M['plancher_alpha']) × part de population 3,2 % × multiplicateur de pauvreté 2 / 3 / 4 ⚠️
    lieu: { pop: [376, 350, 290, 865, 321], ecart: [15.8, 13.8, 13.7, 8.9, 10.3], filet: 16.4539, partPop: 0.032, pauvrete: [2, 3, 4], coef: [1.09, 1.117, 1.16] },
    // HE8 : outre-mer : sur-rémunérations publiques 1,5 Md€ (2020, Cour des comptes) éteintes (central : tout ; défavorable : la moitié, droits acquis) ; prix alimentaires 1,13 / 1,34 / 1,85
    outreMer: { surRemun: [1.5, 1.5, 0.75], alimentaire: [1.13, 1.34, 1.85] },
    // HE9 : sources/chiffrage-decisions-0811.md (premier jet du 08/11/2026) : [favorable, central, défavorable] ; artificialisation : recette brute fléchée vers la renaturation, net 0
    chiffrage0811: {
      collectivites: [3.0, 1.5, 0.5], justice: [-0.74, -1.09, -1.35], enfance: [-1.3, -2.5, -3.8], artificialisation: [3.1, 6.5, 10.3], imprevus: [-0.3, -0.8, -1.8], retenue: [0.2, 0.1, 0.05],
      enAttente: false
    },
    // HE10 : clause : écart de déclenchement 2 points de PIB ; levier cible = 0,5 × PIB × écart tant que la clause est active ; variation annuelle plafonnée à 8 Md€ (≈ 0,27 point de PIB) ; PIB constant 2 935 Md€ (R.S.pib) ; extinction quand la dette repasse sous la trajectoire votée
    clause: { seuil: 0.02, pas: 8.0, kappa: 0.5, mCap: 0.5 }
  };

  // --- 1. Courbe des pensions relevée (R1f supprimée) ---
  var _c = null;
  function courbe() {
    if (_c) return _c;
    var Pg = D.HYP.pension.Pg, Kp = D.HYP.pension.K, m = D.calibrerM(Pg, Kp, HYP.cibleCourbe), o = { Pg: Pg, K: Kp, m: m }, o0 = D.courbe().o;
    _c = { o: o, ancien: o0, k: m / o0.m, kProportion: o0.m * HYP.cibleCourbe / D.courbe().cible, cible: HYP.cibleCourbe, r: [0, 1, 2].map(function (k) { return D.recettePension(o, k); }) };
    return _c;
  }
  /** Recette de la sous-indexation R1f (Md€/an, central) : années 2029, 2038, 2058 ; en régime = 2038 (maximum). */
  function r1f() { var f = Y.leviers(['R1f']); return { y2029: f('central', 2029), y2038: f('central', 2038), y2058: f('central', 2058), regime: f('central', 2038) }; }

  // --- 2. Grand âge ---
  function grandAge() {
    var g = HYP.grandAge, tot = [0, 1, 2].map(function (k) { return g.surcout[k] + g.domicile[k]; });
    return { hebergement: g.surcout, domicile: g.domicile, total: tot, sansReprise: [0, 1, 2].map(function (k) { return g.surcout[k] + g.reprises[k]; }) };
  }

  // --- 3. TVA : autres postes ---
  function tvaAutres() {
    var out = HYP.tva.map(function (p) {
      var v;
      if (p.special === 'renovation') {
        var q = HYP.renovation, a5 = D.changementTva(q.assiette * 1.055, 0.055, 0.05, q.e).net;   // 5,5 % → 5 % sur les travaux TTC au droit actuel
        v = -q.n11 + a5;   // on retire N11 de la base (+0,087) puis on applique 5 % au lieu de 5,5 %
        v = [v, v, v];
      } else if (p.conso instanceof Array) {
        var s = p.conso.reduce(function (a, c) { return a + D.changementTva(c[0], c[1], 0.05, p.e).net; }, 0); v = [s, s, s];
      } else { var x = D.changementTva(p.conso, p.r0, 0.05, p.e).net; v = [x, x, x]; }
      return { id: p.id, lib: p.lib, v: v };
    });
    // bornes : ± 50 % de l'assiette ⚠️ (ordres de grandeur) autour du central
    out.forEach(function (l) { var c = l.v[1]; l.v = [c + 0.5 * Math.abs(c), c, c - 0.5 * Math.abs(c)]; });
    return out;
  }

  // --- 4. Conversion en salaire ---
  function conversion() {
    var c = HYP.conversion, mu = [0, 1, 2].map(function (k) { return c.mutuelle * c.marginal * c.partNouvelle[k]; }),
        tr = [0, 1, 2].map(function (k) { return c.transport[k] * c.marginal * c.partNouvelle[k]; });
    return { assietteMutuelle: c.mutuelle, assietteTransport: c.transport, assietteTitres: c.titres, mutuelle: mu, transport: tr,
             assietteTotale: [c.mutuelle + c.transport[0] + c.titres, c.mutuelle + c.transport[1] + c.titres, c.mutuelle + c.transport[2] + c.titres] };
  }

  // --- 5. Plancher en deux parts ---
  function plancher() {
    var p = HYP.plancher, eco = [0, 1, 2].map(function (k) { return p.beneficiaires * (p.proprietaires[k] + p.heberges[k]) * p.logement * 12 / 1e9; });
    return { economie: eco, propParmi: p.proprietaires, hebergesParmi: p.heberges, parts: [p.socle, p.logement], total: p.socle + p.logement,
             cas: { locataire: { avant: 877, apres: 877, ecart: 0 }, proprietaire: { avant: 877, apres: p.socle, ecart: -p.logement }, heberge: { avant: 877, apres: p.socle, ecart: -p.logement },
                    loyerFaible150: { avant: 877, apres: p.socle + 150, ecart: -(p.logement - 150) } } };
  }

  // --- 6. Lieu et outre-mer ---
  function lieu() {
    var l = HYP.lieu, popTot = l.pop.reduce(function (a, x) { return a + x; }, 0), moy = l.pop.reduce(function (a, x, i) { return a + x * l.ecart[i]; }, 0) / popTot / 100;
    var dep = [0, 1, 2].map(function (k) { return l.filet * l.partPop * l.pauvrete[k]; });          // dépense de plancher outre-mer (Md€) : bas / central / haut
    var coef = [l.coef[0], 1 + moy, l.coef[2]];
    var cout = [coef[0] - 1, coef[1] - 1, coef[2] - 1].map(function (x, k) { return x * dep[[0, 1, 2][k]]; });
    return { coefMoyen: 1 + moy, depensePlancherOM: dep, cout: cout, coef: coef };
  }

  // --- Lignes de la couche (écart au solde ; [favorable, central, défavorable], + améliore) ---
  function lignesNouvelles() {
    var L = [], ga = grandAge(), cv = conversion(), pl = plancher(), li = lieu(), om = HYP.outreMer, c = HYP.chiffrage0811, tv = tvaAutres();
    L.push({ id: 'GA01', poste: 'Grand âge : prix public unique, participation à 90 %, avance reprise sur la succession au-delà de 100 000 € (modeles/grand-age, résidents de 2023) : surcoût net des reprises et des droits perdus', v: ga.hebergement.map(function (x) { return -x; }), sens: 'dep', cote: 'C' });
    L.push({ id: 'GA02', poste: 'Aide à domicile financée en priorité : +20 % de volume, sans reprise sur la succession', v: ga.domicile.map(function (x) { return -x; }), sens: 'dep', cote: 'C' });
    tv.forEach(function (t) { L.push({ id: t.id, poste: 'TVA à 5 % : ' + t.lib, v: t.v, sens: 'po', cote: 'D' }); });
    L.push({ id: 'CS01', poste: 'Part patronale de la mutuelle convertie en salaire (coût employeur inchangé) : écart à BT08 de la base (favorable déjà compté à 7,59 ; central : la moitié est supposée hors de R)', v: [0, cv.mutuelle[1], cv.mutuelle[2]], sens: 'po', cote: 'C' });
    L.push({ id: 'CS02', poste: '50 % de l\'abonnement de transport converti en salaire (coût employeur inchangé) ; titres-restaurant : déjà BT09 (3,4)', v: cv.transport, sens: 'po', cote: 'D' });
    L.push({ id: 'PL01', poste: 'Plancher en deux parts : la part logement (250 €) n\'est versée qu\'à qui paie un loyer (plafonnée au loyer payé) : propriétaires et hébergés sans loyer perdent la part', v: pl.economie, sens: 'dep', cote: 'C' });
    L.push({ id: 'PL02', poste: 'Coefficient de lieu sur le plancher outre-mer (1,09 à 1,16 ; moyenne pondérée ≈ ' + li.coefMoyen.toFixed(3).replace('.', ',') + ')', v: [-li.cout[0], -li.cout[1], -li.cout[2]], sens: 'dep', cote: 'C' });
    L.push({ id: 'OM01', poste: 'Extinction progressive des sur-rémunérations publiques outre-mer (≈ 1,5 Md€ en 2020, Cour des comptes)', v: om.surRemun.slice(), sens: 'dep', cote: 'C' });
    L.push({ id: 'OM02', poste: 'Compensation des prix alimentaires outre-mer (écart de 30 à 42 %, sources/outre-mer-vie-chere.md (c))', v: om.alimentaire.map(function (x) { return -x; }), sens: 'dep', cote: 'C' });
    L.push({ id: 'CL01', poste: 'Collectivités : un seul niveau élu (départements et régions supprimés), doublons et élus', v: c.collectivites.slice(), sens: 'dep', cote: 'C' });
    L.push({ id: 'JU01', poste: 'Justice : vers la médiane européenne (juges et personnel)', v: c.justice.slice(), sens: 'dep', cote: 'C' });
    L.push({ id: 'EN01', poste: 'Protection de l\'enfance : +10 / +20 / +30 % de moyens, suivi à 21 ans', v: c.enfance.slice(), sens: 'dep', cote: 'C' });
    L.push({ id: 'ZA01', poste: 'Taxe d\'artificialisation (20 / 50 / 100 €/m²) : recette brute', v: c.artificialisation.slice(), sens: 'po', cote: 'C' });
    L.push({ id: 'ZA02', poste: 'Taxe d\'artificialisation : recette entièrement fléchée vers la renaturation de friches (net nul)', v: c.artificialisation.map(function (x) { return -x; }), sens: 'dep', cote: 'C' });
    L.push({ id: 'IM01', poste: 'Enveloppe d\'État pour imprévus et cas particuliers (nette de l\'existant)', v: c.imprevus.slice(), sens: 'dep', cote: 'C' });
    L.push({ id: 'VI01', poste: 'Retenue sur les détenus pour indemniser les victimes : recouvrement additionnel', v: c.retenue.slice(), sens: 'dep', cote: 'D' });
    return L;
  }
  function lignes(v) { return D.lignes(v || D.HYP.defaut).concat(lignesNouvelles()); }

  // --- Ligne « vieillesse » (central) ---
  function vieillesse() {
    var c = courbe(), ga = grandAge(), f = r1f(), pens = c.r[1].net, ancien = D.courbe().cible;
    var besoin = f.regime + ga.total[1];
    return { courbe: pens, ancienne: ancien, hausseCourbe: pens - ancien, r1fPerdu: f.regime, grandAge: ga.total[1], besoin: besoin, solde: pens - ancien - besoin, reste: besoin - (pens - ancien),
             couverture9: pens - ancien >= besoin };
  }

  // --- S3 ---
  function pic(t) { var p = 0, a = 0; t.ratio.forEach(function (x, i) { if (i < 30 && x > p) { p = x; a = 2029 + i; } }); return { pic: p, an: a }; }
  function dep3(t) { var a = null; t.deficit.forEach(function (d, i) { if (i < 30 && d > 0.03) a = 2029 + i; }); return a; }
  function s3(v, opts) {
    opts = opts || {}; v = v || D.HYP.defaut;
    var m = opts.macro || 'reference', L = lignes(v), e = D.somme(L)[1] + (opts.extra || 0);
    var lc0 = Y.leviers(['M1f', 'M2m', 'M3']), u = K.urssaf().v[1] + e, r = R.S.rampe, i0 = r[1] - 2029;   // R1f supprimée (décision du 07/11)
    var lc = function (s, y) { return lc0(s, y) - K.recouvrement('M1f', y).total + u; }, ramp = function (y) { return Math.max(0, Math.min(1, (y - r[0]) / (r[1] - r[0]))); };
    var traj = function (F, mm, extraFn) { return R.trajReforme(function (s, y) { return lc(s, y) + ramp(y) * F + (extraFn ? extraFn(y) : 0); }, mm || m); };
    var ok = function (F) { var t = traj(F); for (var i = i0 + 1; i < 30; i++) if (t.ratio[i] > t.ratio[i0] + 1e-9) return false; return true; };
    var lo = -100, hi = 400; for (var k = 0; k < 55; k++) { var x = (lo + hi) / 2; if (ok(x)) hi = x; else lo = x; } var F = hi;
    var cc = courbe(), co = cc.o, tr = T.recette({ A: R.S.transReco.A, K: R.S.transReco.K, top: true, k: 1, nationalite: 'court' }).netActuel, rp = D.recettePension(co, 1).net, eco = R.S.ecoFonct + R.S.eco2[1];
    var autres = tr + R.S.patrimoineNat + rp + eco, f = R.aPourRecette(F - autres, D.HYP.credit), t = traj(F), p = pic(t);
    var prel = f.revenus + f.credit + tr + R.S.patrimoineNat + rp + D.poCouche(L), poMd = R.S.poBase + prel;
    var cas = T.objet(T.casTypesNets(f.bareme, D.HYP.credit)), ret = R.CAS.map(function (pn) { return D.casRetraite(pn, co, true); });
    return { v: v, macro: m, effetCouche: e, lignes: L, F: F, a: f.a, revenus: f.revenus, credit: f.credit, transmissions: tr, patrimoineNat: R.S.patrimoineNat, pension: rp, eco: eco, autres: autres,
             traj: t, pic: p.pic, picAn: p.an, dep3: dep3(t), po: { md: poMd, pct: poMd / R.S.pib, elargisPct: (poMd + R.S.ecartElargis) / R.S.pib }, cas: cas, retraites: ret, bareme: f.bareme,
             trajPrudente: traj(F, 'prudente'), fn: function (y) { return lc({}, y) + ramp(y) * F; }, _traj: traj };
  }
  function prudente(v, opts) { var o = JSON.parse(JSON.stringify(opts || {})); o.macro = 'prudente'; return s3(v, o); }

  /** Clause automatique (HE10) : en macro prudente, avec les leviers de la référence. Déclenchement : la dette dépasse la trajectoire votée de plus de `seuil` ; tant que la clause est active,
   *  le levier cible vaut kappa × PIB × écart (en euros constants) ; il bouge d'au plus `pas` Md€ par an, dans les deux sens (effet dès l'année suivante) ; la clause s'éteint quand la dette
   *  repasse sous la trajectoire votée (écart ≤ 0). Retourne les trajectoires et le levier ajouté. */
  function clause(s, opts) {
    opts = opts || {}; var seuil = opts.seuil === undefined ? HYP.clause.seuil : opts.seuil, pas = opts.pas === undefined ? HYP.clause.pas : opts.pas, kappa = opts.kappa === undefined ? HYP.clause.kappa : opts.kappa;
    var voted = s.traj.ratio.slice(0, 30), Lv = [], actif = false; for (var i = 0; i < 30; i++) Lv.push(0);
    var fnL = function (y) { var j = Math.max(0, Math.min(29, y - 2029)); return Lv[j]; };
    for (var i2 = 0; i2 < 29; i2++) {
      var t = s._traj(s.F, 'prudente', fnL), gap = t.ratio[i2] - voted[i2];
      if (gap > seuil) actif = true; else if (gap <= 0) actif = false;
      var cible = actif ? kappa * R.S.pib * gap : 0, nxt = Lv[i2] + Math.max(-pas, Math.min(pas, cible - Lv[i2]));
      for (var j = i2 + 1; j < 30; j++) Lv[j] = Math.max(0, nxt);
    }
    var fin = s._traj(s.F, 'prudente', fnL), sans = s.trajPrudente;
    // répartition : la courbe des pensions ne peut absorber que jusqu'à un coefficient plafonné (mCap, marginal ≤ 50 % : au-delà, risque confiscatoire, 08/11) ; le reste va à la fonction des revenus
    var mCap = HYP.clause.mCap, ancM = courbe().o.m, pensMax = s.pension * (mCap / ancM - 1);
    function repartir(Lx) { var rp = Math.min(Lx * s.pension / (s.revenus + s.pension), pensMax), ra = Lx - rp, f2 = R.aPourRecette(s.F + ra - s.autres, D.HYP.credit);
      return { levier: Lx, retraites: rp, actifs: ra, a: f2.a, m: ancM * (1 + rp / s.pension), cadre10000: T.objet(T.casTypesNets(f2.bareme, D.HYP.credit)).cadre_10000.ecartNet }; }
    var maxL = Math.max.apply(null, Lv), stable = repartir(Lv[19]), pic = repartir(maxL), shareR = s.pension / (s.revenus + s.pension);
    var ecart = []; for (var q = 0; q < 30; q++) ecart.push(fin.ratio[q] - voted[q]);
    return { L: Lv, voted: voted, avec: fin.ratio.slice(0, 30), sans: sans.ratio.slice(0, 30), maxL: maxL, L2038: Lv[9], L2048: Lv[19], L2058: Lv[29], ecartMax: Math.max.apply(null, ecart), seuil: seuil, pas: pas,
             partRetraites: shareR, stable: stable, pic: pic, pensMax: pensMax, annesActives: Lv.filter(function (x) { return x > 0; }).length, ecart: ecart };
  }

  function casRetraite(pn) { return D.casRetraite(pn, courbe().o, true); }
  function pensionBascule() {
    var o = courbe().o, lo = 1000, hi = 50000; for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (D.casRetraite(m, o, true).ecartNet > 0) lo = m; else hi = m; } return (lo + hi) / 2;
  }
  var API = { casRetraite: casRetraite, pensionBascule: pensionBascule, HYP: HYP, courbe: courbe, r1f: r1f, grandAge: grandAge, tvaAutres: tvaAutres, conversion: conversion, plancher: plancher, lieu: lieu, lignesNouvelles: lignesNouvelles, lignes: lignes,
              vieillesse: vieillesse, s3: s3, prudente: prudente, clause: clause };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0811 = API;
})(this);
