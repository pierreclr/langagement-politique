// Rapport de la couche transmissions + crédit d'IS partiel (transmissions_0611.js, 06/11/2026, NON ADOPTÉE). Même liste que test_transmissions_0611.js, ce fichier à la place du test ;
// sortie dans resultats_transmissions_0611.txt (qui fait foi) ; la dernière ligne (EXPORT) est recopiée dans sources/calculs/bilan_global.py (dictionnaire TRANS0611).
var T = this.Transmissions0611, B = this.BaseTravail0611, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 1 : n).replace('.', ','); }
function e0(x) { return Math.round(x).toLocaleString('fr-FR').replace(/,/g, ' '); }
function pc(x, n) { return f(100 * x, n === undefined ? 1 : n) + ' %'; }
var EXPORT = {};

log('# Transmissions et crédit d\'IS partiel (base de travail du 06/11/2026, couche NON ADOPTÉE)');
var g = T.grille();
log('Loi du cumul reçu (log-normale, médiane 70 000 €, P90 500 000 €, CAE 2006) : moyenne ' + e0(g.moyenne) + ' € ; moyenne du 1 % ' + e0(T.moyenneAuDela(0.99)) + ' € (CAE : > 4,2 M€) ; du 0,1 % ' + e0(T.moyenneAuDela(0.999)) + ' € (CAE : ≈ 13 M€)');
log('Échelle vers le flux économique hors conjoint (300 × (1 − cj) Md€) : ' + [0, 1, 2].map(function (k) { return f(T.echelle(k), 3); }).join(' / '));

log('\n## 1. Recette de la fonction des transmissions (Md€/an, croisière ; favorable / central / défavorable ; net = recette − 20,8 de droits actuels)');
log('| Abattement A | K | 60 % au-delà de 10 M€ | Recette statique (central) | Recette | Net par rapport aux droits actuels | Bénéficiaires qui ne paient rien (central ; statutaire) |');
log('|---|---|---|---|---|---|---|');
var GR = [];
[1e5, 3e5, 5e5].forEach(function (A) { [1e5, 5e5].forEach(function (K) { [false, true].forEach(function (top) {
  var r = T.trois({ A: A, K: K, top: top }); GR.push({ A: A, K: K, top: top, r: r.map(function (x) { return { recette: x.recette, net: x.netActuel, rien: x.partNePaientRien, rienStat: x.partNePaientRienStatut, statique: x.statique }; }) });
  log('| ' + e0(A) + ' € | ' + e0(K) + ' € | ' + (top ? 'oui' : 'non') + ' | ' + f(r[1].statique) + ' | ' + r.map(function (x) { return f(x.recette); }).join(' / ') + ' | ' + r.map(function (x) { return (x.netActuel >= 0 ? '+' : '') + f(x.netActuel); }).join(' / ') + ' | ' + pc(r[1].partNePaientRien) + ' ; ' + pc(r[1].partNePaientRienStatut) + ' |');
}); }); });
EXPORT.grille = GR;
var RECO = { A: 3e5, K: 1e5, top: true };
log('\nRéconciliations : 50 % au-delà de 100 000 €, sans fractionnement ni différé (v5.10 : 59,6) : ' + f(T.recette({ A: 1e5, plat: 0.5, k: 1, sansFractionnement: true, sansDiffere: true }).recette)
  + ' ; 50 % dès le premier euro (v5.10 avant conjoint et exemption : 100,5 ; ici conjoint déjà retiré) : ' + f(T.recette({ A: 0, plat: 0.5, k: 1, sansFractionnement: true, sansDiffere: true }).recette));
var act = T.trois({ A: 2e5, actuel: true, sansDiffere: true });
log('Contrôle sur le droit actuel (barème en ligne directe, deux abattements de 100 000 €, sans niches) passé dans la même chaîne de comportements : ' + act.map(function (x) { return f(x.recette); }).join(' / ') + ' Md€, contre 20,8 encaissés ; écart central ' + f(act[1].recette - 20.8) + ' ≈ coût des niches (assurance-vie 4-5, Dutreil 2-3, démembrement 2-3 : CAE n° 69) ; bénéficiaires sans droits (modèle) ' + pc(act[1].partNePaientRien) + ' (observé : 85-90 %)');
EXPORT.controleActuel = act.map(function (x) { return x.recette; });

log('\n### Variante recommandée (A = 300 000 €, K = 100 000 €, rampe 50 → 60 % entre 10 et 20 M€) : décomposition (central)');
var c0 = T.recette({ A: 3e5, K: 1e5, top: true, k: 1, sansComportement: true }), cF = T.recette({ A: 3e5, K: 1e5, top: true, k: 1, sansFractionnement: true }), cD = T.recette({ A: 3e5, K: 1e5, top: true, k: 1, sansDiffere: true }), cR = T.recette({ A: 3e5, K: 1e5, top: true, k: 1 }), c50 = T.recette({ A: 3e5, K: 1e5, top: false, k: 1 }), cM = T.recette({ A: 3e5, K: 1e5, top: true, k: 1, indexMoyen: true });
var natC = T.trois({ A: 3e5, K: 1e5, top: true, nationalite: 'court' }), natB = T.trois({ A: 3e5, K: 1e5, top: true, nationalite: 'bienConcu' });
log('- statutaire (sans comportement, différé de la v7.5 déduit) : ' + f(T.recette({ A: 3e5, K: 1e5, top: true, k: 1, sansComportement: true }).statique) + ' ; avec différé déduit : ' + f(c0.recette));
log('- avec comportements : ' + f(cR.recette) + ' (dont exil perdu ' + f(cR.perteExil, 2) + ') ; sans fractionnement : ' + f(cF.recette) + ' ; sans dette différée : ' + f(cD.recette) + ' ; fuite indexée sur le taux moyen : ' + f(cM.recette));
log('- sans la rampe à 60 % : ' + f(c50.recette) + ' (la rampe rapporte ' + f(cR.recette - c50.recette, 2) + ')');
log('- option impôt de suite et transparence, « court terme » (HN3 : 30 % / 30 %) : ' + natC.map(function (x) { return f(x.recette); }).join(' / ') + ' ; « bien conçu central » (78 % / 78 %, cible de fin de mandat) : ' + natB.map(function (x) { return f(x.recette); }).join(' / '));
EXPORT.reco = { statique: c0.statique, avecDiffere: c0.recette, recette: T.trois(RECO).map(function (x) { return x.recette; }), net: T.trois(RECO).map(function (x) { return x.netActuel; }), rien: cR.partNePaientRien, rienStat: cR.partNePaientRienStatut,
  sansFract: cF.recette, sansDiffere: cD.recette, indexMoyen: cM.recette, sans60: c50.recette, perteExil: cR.perteExil, natCourt: natC.map(function (x) { return x.recette; }), natBien: natB.map(function (x) { return x.recette; }), payants: cR.beneficiairesPayants };

log('\n### Barème (variante recommandée) et droit actuel théorique');
log('| Cumul reçu | Impôt nouveau | Taux moyen | Taux marginal | Droit actuel théorique (deux parents) | Taux moyen actuel |');
log('|---|---|---|---|---|---|');
var TB = T.tableBareme(RECO, [1e5, 3e5, 5e5, 1e6, 2e6, 5e6, 1e7, 2e7, 5e7, 1e8]);
TB.forEach(function (x) { log('| ' + e0(x.H) + ' € | ' + e0(x.impot) + ' € | ' + pc(x.moyen) + ' | ' + pc(x.marginal, 0) + ' | ' + e0(x.actuel) + ' € | ' + pc(x.actuel / x.H) + ' |'); });
EXPORT.bareme = TB;

log('\n### Distribution par tranche de cumul reçu (variante recommandée, central ; montants du flux économique)');
log('| Tranche de cumul reçu | Bénéficiaires par génération | Part des bénéficiaires | Part de la masse | Taux moyen actuel théorique | Taux moyen nouveau (statutaire) | Taux moyen nouveau (net des comportements) | Recette (Md€) | Part de la recette |');
log('|---|---|---|---|---|---|---|---|---|');
var DI = T.distribution(RECO);
DI.forEach(function (t) { log('| ' + e0(t.lo) + (t.hi === Infinity ? ' € et plus' : ' à ' + e0(t.hi) + ' €') + ' | ' + e0(t.beneficiaires) + ' | ' + pc(t.partBenef, 2) + ' | ' + pc(t.partMasse) + ' | ' + pc(t.tauxActuelTheo) + ' | ' + pc(t.tauxStatut) + ' | ' + pc(t.tauxNet) + ' | ' + f(t.recetteMd, 2) + ' | ' + pc(t.partRecette) + ' |'); });
EXPORT.distribution = DI.map(function (t) { return { lo: t.lo, hi: t.hi === Infinity ? null : t.hi, partBenef: t.partBenef, partMasse: t.partMasse, tauxActuelTheo: t.tauxActuelTheo, tauxStatut: t.tauxStatut, tauxNet: t.tauxNet, recetteMd: t.recetteMd, partRecette: t.partRecette, beneficiaires: t.beneficiaires }; });

log('\n## 2. Crédit d\'IS partiel (barème de la base de travail ; Md€/an, central)');
log('| Crédit | Recette (avec réaction des dividendes) | dont actifs | dont retraités | Statique | Érosion |');
log('|---|---|---|---|---|---|');
var CR = [0.75, 0.5, 0].map(function (c) { var x = T.credit(c); log('| ' + pc(c, 0) + ' | ' + f(x.total, 2) + ' | ' + f(x.actifs, 2) + ' | ' + f(x.retraites, 2) + ' | ' + f(x.statique, 2) + ' | ' + pc(x.erosion, 0) + ' |'); return x; });
EXPORT.credit = CR;
log('\nCharge totale sur 1 € de bénéfice distribué (IS 25 % + fonction des revenus au marginal − crédit) contre 1 € de coût employeur versé en salaire, barème de la base :');
log('| Coût employeur R (€/mois) | Marginal | Salaire | Dividende, crédit 100 % | 75 % | 50 % | 0 % |');
log('|---|---|---|---|---|---|---|');
var CH = [3000, 5000, 10000, 20000, 50000].map(function (R) { var a = [1, 0.75, 0.5, 0].map(function (c) { return T.chargeDividende(null, c, R); }); log('| ' + e0(R) + ' | ' + pc(a[0].marginal) + ' | ' + pc(a[0].salaire) + ' | ' + a.map(function (x) { return pc(x.dividende); }).join(' | ') + ' |'); return { R: R, marginal: a[0].marginal, div: a.map(function (x) { return x.dividende; }) }; });
EXPORT.charge = CH;

log('\n## 3. Jeux de réglages (macro de référence, combinaison R1f + M1m + M2m + M3 ; manque de la base : ' + f(B.dette(B.totaux().central).manque.reference) + ' Md€)');
var JEUX = [
  { id: 'J3', lib: 'Cadres −3 % ; transmissions recommandées ; crédit 50 %', o: { cadre: -0.03, trans: RECO, c: 0.5 } },
  { id: 'J5', lib: 'Cadres −5 % ; transmissions recommandées ; crédit 50 %', o: { cadre: -0.05, trans: RECO, c: 0.5 } },
  { id: 'J5S', lib: 'Cadres −5 % ; transmissions recommandées ; crédit 50 % ; impôt de suite « court terme » (transmissions et patrimoine du haut +2,28)', o: { cadre: -0.05, trans: RECO, c: 0.5, nationalite: 'court', patrimoine: 2.28 } },
  { id: 'J5C', lib: 'Cadres −5 % ; transmissions A = 100 000 € ; crédit 0 % ; impôt de suite « court terme » ; patrimoine du haut au mieux (+9,4 : t∞ = 4,5 %, K = 700 k€)', o: { cadre: -0.05, trans: { A: 1e5, K: 1e5, top: true }, c: 0, nationalite: 'court', patrimoine: 9.4 } },
  { id: 'JA', lib: 'Équilibre : transmissions A = 100 000 € ; crédit 50 % ; impôt de suite « court terme » (+2,28) ; fonction des revenus pour le reste', o: { cadre: 'equilibre', trans: { A: 1e5, K: 1e5, top: true }, c: 0.5, nationalite: 'court', patrimoine: 2.28 } },
  { id: 'JR', lib: 'RECOMMANDÉ, équilibre : transmissions recommandées (A = 300 000 €) ; crédit 50 % ; impôt de suite « court terme » (+2,28) ; fonction des revenus pour le reste', o: { cadre: 'equilibre', trans: RECO, c: 0.5, nationalite: 'court', patrimoine: 2.28 } }
];
log('| Jeu | Réglage | a (m∞) | Fonction des revenus | Transmissions (net) | Crédit partiel | Patrimoine du haut | Total | Manque restant (référence ; prudente) |');
log('|---|---|---|---|---|---|---|---|---|');
var JX = JEUX.map(function (z) { var j = T.jeu(z.o); log('| ' + z.id + ' | ' + z.lib + ' | ' + f(j.a, 4) + ' | ' + f(j.revenus) + ' | ' + f(j.transmissions.netActuel) + ' | ' + f(j.credit) + ' | ' + f(j.patrimoine) + ' | ' + f(j.effet) + ' | ' + f(j.manque.reference) + ' ; ' + f(j.manque.prudente) + ' |'); j.id = z.id; j.lib = z.lib; return j; });
var ids = ['smic_seul', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'retraite_1200', 'retraite_4000', 'rentier_div_5000'];
log('\n### Cas types, revenu net santé (mutuelle comptée, mode salaire, central) : écart au droit actuel, €/mois (%)');
log('| Cas type | Aujourd\'hui (net santé) | Base | ' + JX.map(function (j) { return j.id; }).join(' | ') + ' |');
log('|---|---|---|' + JX.map(function () { return '---|'; }).join(''));
var base = T.objet(T.casTypesNets(B.bareme0(), 1));
ids.forEach(function (id) { log('| ' + base[id].libelle + ' | ' + e0(base[id].avantNet) + ' | ' + (base[id].ecartNet >= 0 ? '+' : '') + e0(base[id].ecartNet) + ' (' + pc(base[id].pctNet) + ') | ' + JX.map(function (j) { var c = T.objet(j.cas)[id]; return (c.ecartNet >= 0 ? '+' : '') + e0(c.ecartNet) + ' (' + pc(c.pctNet) + ')'; }).join(' | ') + ' |'); });
log('(Retraités : R1f compris dans toutes les colonnes de ce tableau, base comprise (la base publiée sans R1f donne +132 au retraité à 4 000 €). Rentier : droit actuel PFU 31,4 %, pas de mutuelle comptée.)');

log('\n### PO officiels et élargis');
var PO_BASE = 1467.9, PIB = 2935, REG = 9.8 + 0.2245 + 0.193 - 0.5;
log('| Jeu | PO officiels | PO élargis |'); log('|---|---|---|');
JX.forEach(function (j) { log('| ' + j.id + ' | ' + pc((PO_BASE + j.effet) / PIB) + ' | ' + pc((PO_BASE + j.effet + REG) / PIB) + ' |'); });
log('(Base de travail : 50,0 % et 50,3 % ; aujourd\'hui 42,7 % et 44,2 %. PO de la base arrondis à 1 467,9 Md€ ; le bilan recalcule à partir de ses lignes.)');

log('\n### Cas limites (charge payée en % du revenu reçu ; fonction du patrimoine v7.5 inchangée ; crédit perdu ajouté)');
var LB = T.casLimites(B.bareme0(), 1), LJ = JX.map(function (j) { return T.casLimites(j.bareme, j.o.c); });
log('| Cas | Base | ' + JX.map(function (j) { return j.id; }).join(' | ') + ' |'); log('|---|---|' + JX.map(function () { return '---|'; }).join(''));
LB.forEach(function (x, i) { var p = function (v) { return v === null ? '—' : pc(v, 0) + (v > 1 ? ' ⚠️' : ''); }; log('| ' + x.lib.slice(0, 80) + ' | ' + p(x.charge) + ' | ' + LJ.map(function (L) { return p(L[i].charge); }).join(' | ') + ' |'); });
var nb = function (L) { return L.filter(function (x) { return x.alerte && x.id !== 'startup_valorisee'; }).length; };
log('Cas au-delà de 100 % (charge payée) : base ' + nb(LB) + ' ; ' + JX.map(function (j, i) { return j.id + ' ' + nb(LJ[i]); }).join(' ; ') + ' (sur ' + (LB.length - 1) + ' cas ; le fondateur de start-up paie en titres : hors décompte). Le patrimoine du haut « au mieux » (J5C, t∞ = 4,5 %) n\'est pas recalculé ici : voir § 000.6 (rentiers à 111 et 132 %).');

EXPORT.jeux = JX.map(function (j, i) { return { id: j.id, lib: j.lib, a: j.a, revenus: j.revenus, transmissions: j.transmissions.netActuel, transRecette: j.transmissions.recette, rien: j.transmissions.partNePaientRien, credit: j.credit, patrimoine: j.patrimoine, effet: j.effet,
  manque: j.manque, c: j.o.c, cas: T.objet(j.cas), limites: nb(LJ[i]) }; });
var jr = JX.filter(function (j) { return j.id === 'JR'; })[0], recoTr = T.trois(RECO), natTr = T.trois({ A: 3e5, K: 1e5, top: true, nationalite: 'court' });
EXPORT.jr = { a: jr.a, revenus: jr.revenus, transReco: recoTr.map(function (x) { return x.netActuel; }), transNat: natTr.map(function (x, k) { return x.recette - recoTr[k].recette; }),
  credit: ['bas', 'central', 'haut'].map(function (sc) { return T.credit(0.5, jr.bareme, sc).total; }), patrimoine: 2.28, effet: jr.effet, manque: jr.manque };
EXPORT.casBase = base; EXPORT.limitesBase = nb(LB); EXPORT.manque0 = B.dette(B.totaux().central).manque;
log('\nEXPORT ' + JSON.stringify(EXPORT));
