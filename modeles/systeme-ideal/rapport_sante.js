// Génère les tableaux de la section « Santé » de resultats.md :  jsc modele.js fiscalite_actuelle.js voies.js sante.js rapport_sante.js
var M = this.SystemeIdeal, V = this.Voies, S = this.Sante, F = V.fus;
var log = (typeof print === 'function') ? print : console.log;
function r(x, d) { d = d === undefined ? 0 : d; var f = Math.pow(10, d); return (Math.round(x * f) / f).toString().replace('.', ','); }
function pc(x, d) { return r(100 * x, d === undefined ? 0 : d) + ' %'; }
function sg(x, d) { return (x >= 0 ? '+' : '') + r(x, d); }

var A600 = F(V.voieA(600, 0.75), { tPlat: 0.45, tMax: 0.25 }), A650 = F(V.voieA(650, 0.75), { tPlat: 0.47, tMax: 0.25 }), A700 = F(V.voieA(700, 0.75), { tPlat: 0.49, tMax: 0.25 });
var C75 = F(V.voieC(0.75, 0.25), { tPlat: 0.50, tMax: 0.25 }), CSP = F(V.voieC(0.95, 0.40), { tPlat: 0.50, tMax: 0.40 });
var VOIES = [['A, socle 600 €', A600], ['A, socle 650 €', A650], ['A, socle 700 €', A700], ['B, année 1 (= A 650 €)', A650], ['C, t_max 25 %', C75], ['C, t_max 40 %', CSP]];

log('### S1. Leviers de santé (Md€/an, effet plein, par rapport à la trajectoire de référence)');
log('| Levier | Favorable (scénario bas) | Central | Défavorable (scénario haut) | Délai (années) |'); log('|---|---|---|---|---|');
var k, L; for (k in S.LEVIERS) { L = S.LEVIERS[k]; log('| (' + L.id + ') ' + L.libelle + (L.optionnel ? ' (non compté)' : '') + ' | ' + r(L.v[0], 2) + ' | ' + r(L.v[1], 2) + ' | ' + r(L.v[2], 2) + ' | ' + L.delaiAns + ' |'); }
log('| **Total compté** | **' + r(S.economies('bas').total, 2) + '** | **' + r(S.economies('central').total, 2) + '** | **' + r(S.economies('haut').total, 2) + '** | |');
log('| Total avec franchises optionnelles | ' + r(S.economies('bas', { franchises: true }).total, 2) + ' | ' + r(S.economies('central', { franchises: true }).total, 2) + ' | ' + r(S.economies('haut', { franchises: true }).total, 2) + ' | |');

log('\n### S2. Solde et marge d\'investissement des voies, sans et avec la santé (Md€/an, taux de la voie inchangés)');
log('| Voie | Taux plat / t_max | Solde central sans santé | avec santé | Marge sans → avec | Solde bas (sans → avec) | Solde haut (sans → avec) | Plat d\'équilibre sans → avec |'); log('|---|---|---|---|---|---|---|---|');
VOIES.forEach(function (v) {
  var p = v[1], x = S.avecSante(p), b = x.bilanSansSante, e0 = V.platEquilibre(F(p, { tMax: p.tMax })), e1 = S.platEquilibreAvecSante(F(p, { tMax: p.tMax }));
  log('| ' + v[0] + ' | ' + pc(p.tPlat) + ' / ' + pc(p.tMax) + ' | ' + r(b.soldeCentral) + ' | ' + r(x.soldeCentral) + ' | ' + r(x.margeSansSante) + ' → ' + r(x.margeCentral) + ' | ' + r(b.soldeBas) + ' → ' + r(x.soldeBas) + ' | ' + r(b.soldeHaut) + ' → ' + r(x.soldeHaut) + ' | ' + (e0 === null ? 'aucun' : pc(e0, 1)) + ' → ' + (e1 === null ? 'aucun' : pc(e1, 1)) + ' |');
});

log('\n### S3. Un levier à la fois sur la voie A 650 € (solde central, Md€/an)');
log('| Levier retiré | Économie retirée | Solde central |'); log('|---|---|---|');
var base = S.avecSante(A650); log('| aucun (les quatre leviers comptés) | 0 | ' + r(base.soldeCentral, 1) + ' |');
['pertinence', 'medicaments', 'hopital', 'prevention'].forEach(function (id) {
  var x = S.avecSante(A650, { sansLevier: [id] }); log('| (' + S.LEVIERS[id].id + ') ' + S.LEVIERS[id].libelle.split(' :')[0].split(' (')[0].split(',')[0] + ' | −' + r(S.LEVIERS[id].v[1], 2) + ' | ' + r(x.soldeCentral, 1) + ' |'); });
log('| aucun levier (sans santé) | −9,7 | ' + r(V.bilan(A650).soldeCentral, 1) + ' |');
log('| franchises optionnelles comptées en plus | +0,3 | ' + r(S.avecSante(A650, { franchises: true }).soldeCentral, 1) + ' |');
log('Un point de taux plat rapporte ≈ ' + r(S.mdParPointPlat(A650), 1) + ' Md€ (voie A 650 €) : l\'économie de santé centrale (9,7) vaut donc ≈ ' + r(9.7 / S.mdParPointPlat(A650), 2) + ' point de taux plat.');

log('\n### S4. Double guichet AMO/AMC (Md€/an)');
log('| Cas | Gain net des payeurs (gestion évitée) | Dépense publique nouvelle | TSA perdue | À financer | Solde public après financement à l\'euro près | Équivalent en points de taux plat (voie A 650 €) |'); log('|---|---|---|---|---|---|---|');
var par = S.mdParPointPlat(A650);
[['HCAAM 2022, sans désaffiliation induite', 'bas'], ['HCAAM 2022, scénario 3 (base 2017)', 'scenario3'], ['Borne haute : AMC supprimées (données 2024-2025)', 'borneHaute']].forEach(function (c) {
  var g = S.guichetUnique(c[1]); log('| ' + c[0] + ' | ' + r(g.gainPayeurs, 1) + ' | ' + r(g.depensePubliqueNouvelle, 1) + ' | ' + r(g.tsaPerdue, 1) + ' | ' + r(g.besoinFinancement, 1) + ' | 0 | ' + r(g.besoinFinancement / par, 1) + ' |'); });
var g3 = S.guichetUnique('scenario3'), gcap = S.guichetUnique('scenario3', { captureEtat: 1 });
log('Si le prélèvement n\'était PAS affecté et que l\'État gardait tout le gain (cas extrême, scénario 3) : solde public ' + sg(gcap.effetSoldeApresFinancement, 1) + ' Md€ ; sans financement du tout : ' + sg(g3.effetSoldeAvantFinancement, 1) + ' Md€.');
log('Frais de gestion des organismes complémentaires 2024 : ' + r(S.DONNEES.oc2024.fraisSinistres + S.DONNEES.oc2024.fraisAcquisition + S.DONNEES.oc2024.fraisAdmin, 2) + ' Md€, soit ' + pc((S.DONNEES.oc2024.fraisSinistres + S.DONNEES.oc2024.fraisAcquisition + S.DONNEES.oc2024.fraisAdmin) / S.DONNEES.oc2024.cotisations, 1) + ' des cotisations (' + r(S.DONNEES.oc2024.cotisations, 1) + ' Md€).');
