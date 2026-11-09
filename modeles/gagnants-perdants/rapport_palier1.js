/*
 * modeles/gagnants-perdants/rapport_palier1.js — tableaux gagnants et perdants du palier 1 et de ses quatre chemins (03/11/2026).
 * Depuis modeles/gagnants-perdants/ (commande ci-dessous) :
 *   jsc ../systeme-ideal/modele.js ../systeme-ideal/fiscalite_actuelle.js ../systeme-ideal/voies.js ../systeme-ideal/sante.js ../systeme-ideal/optimisation.js ../systeme-ideal/retraites2.js \
 *       ../systeme-ideal/palier1.js ../systeme-ideal/patrimoine_financier.js ../systeme-ideal/deces_realisation.js ../systeme-ideal/options_financement.js \
 *       cas_types_donnees.js droit_actuel.js modele.js palier1.js rapport_palier1.js > resultats-palier1.txt
 */
var P = this.GagnantsPerdantsPalier1 || require('./palier1.js');
var log = (typeof print === 'function') ? print : console.log;
function n0(x) { var v = Math.round(x); return (v < 0 ? '−' : '') + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function n1(x) { var v = Math.round(x * 10) / 10; return (v < 0 ? '−' : '') + String(Math.abs(v).toFixed(1)).replace('.', ','); }
function pc(x) { return n1(100 * x) + ' %'; }
var LIGNES = [
  ['Palier 1 (35 %, socle 500 €)', 'palier1'],
  ['Chemin 1, année 1 (38 %, socle 250 €)', 'c1', 1],
  ['Chemin 1, année 5 (38 %, socle 361 €)', 'c1', 5],
  ['Chemin 1, année 10 (38 %, socle 500 €)', 'c1', 10],
  ['Chemins 2 et 3 (41,5 %, socle 400 €)', 'c2'],
  ['Chemin 4 (45 %, socle 400 €)', 'c4']
];
log('# Gagnants et perdants du palier 1 et de ses chemins (modeles/gagnants-perdants/palier1.js, 03/11/2026)\n');
log('Écart de revenu disponible par rapport au droit actuel (Insee, comptes distribués 2023, RSA, prime d\'activité et prestations familiales compris ; aides au logement perdues), central, par dixième de niveau de vie, € par unité de consommation et par mois. Plancher RSA : 877 € pour 1,9 million de personnes sans autre revenu. Dispersion 0,6. Statique : sans réaction de comportement, sans héritage, sans patrimoine.\n');
function ligneDeciles(titre, f) {
  log('### ' + titre + '\n');
  log('| configuration | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 (moyenne) | D10d (1 %) | D10e (0,1 %) | total ménages (Md€/an) |');
  log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  LIGNES.forEach(function (l) {
    var d = P.deciles(l[1], l[2]), h = P.hauts(l[1], l[2]);
    log('| ' + l[0] + ' | ' + d.deciles.map(function (x) { return f(x); }).join(' | ') + ' | ' + f({ ecartMoisUC: h.top1.ecartMois, ecartPct: h.top1.ecartMois / h.top1.avantMois }) + ' | ' + f({ ecartMoisUC: h.top01.ecartMois, ecartPct: h.top01.ecartMois / h.top01.avantMois }) + ' | ' + n0(d.ecartTotalMd) + ' |');
  });
  log('');
}
ligneDeciles('Par dixième, € par mois', function (x) { return n0(x.ecartMoisUC); });
ligneDeciles('Par dixième, en % du revenu disponible actuel', function (x) { return pc(x.ecartPct); });
log('Revenu disponible actuel par UC et par mois (Insee 2023) : ' + P.deciles('palier1').deciles.map(function (x) { return x.decile + ' ' + n0(x.rdbMois); }).join(' ; ') + '.\n');

log('### Part des adultes non retraités au plancher RSA et coût du plancher\n');
log('| configuration | D1 | D2 | D3 | coût du plancher (Md€/an) |'); log('|---|---|---|---|---|');
LIGNES.forEach(function (l) { var d = P.deciles(l[1], l[2]); log('| ' + l[0] + ' | ' + [0, 1, 2].map(function (i) { return pc(d.deciles[i].partSousPlancher); }).join(' | ') + ' | ' + n1(d.plancherCoutMd) + ' |'); });
log('\nLe coût du plancher retrouve celui de `palier1.solde` (1,9 M × (877 − socle) × 12) : 8,6 Md€ à 500 €, 10,9 à 400 €, 14,3 à 250 €.\n');

log('## Cas types, droit actuel OpenFisca 2026 contre palier 1 et chemins (€ par mois ; % du revenu actuel)\n');
var CH = [['palier1', undefined, 'palier 1'], ['c1', 1, 'ch. 1 an 1'], ['c1', 5, 'ch. 1 an 5'], ['c1', 10, 'ch. 1 an 10'], ['c2', undefined, 'ch. 2-3'], ['c4', undefined, 'ch. 4']];
var tab = CH.map(function (c) { return P.casTypes(c[0], c[1]); });
log('| cas type | avant (droit actuel) | ' + CH.map(function (c) { return c[2] + ' : après (écart, %)'; }).join(' | ') + ' |');
log('|---|---|' + CH.map(function () { return '---'; }).join('|') + '|');
tab[0].forEach(function (c, i) {
  log('| ' + c.libelle + ' | ' + n0(c.avantMois) + ' | ' + tab.map(function (t) { return n0(t[i].apresMois) + ' (' + (t[i].ecartMois >= 0 ? '+' : '') + n0(t[i].ecartMois) + ' ; ' + pc(t[i].ecartPct) + ')'; }).join(' | ') + ' |');
});
log('\nNotes des cas : ');
tab[0].forEach(function (c) { log('- ' + c.id + ' : ' + c.note); });

log('\n### Taux plat qui annule l\'écart (point mort), socle 500 € et socle 400 €\n');
log('| cas | socle 500 € | socle 400 € |'); log('|---|---|---|');
['smic_seul', 'couple_2smic_2enf', 'couple_1smic_2enf', 'cadre_2x', 'cadre_4x', 'parent_isole_smic'].forEach(function (id) {
  var a = P.tauxPointMort(id, 1), b = P.tauxPointMort(id, 0.8);
  log('| ' + id + ' | ' + (a === null ? '—' : pc(a)) + ' | ' + (b === null ? '—' : pc(b)) + ' |');
});

log('\n## Sensibilité de D1 à D3 (central, chemin 4 : 45 %, socle 400 €, et chemins 2-3, € par UC et par mois)\n');
log('| hypothèse | ch. 4 : D1 / D2 / D3 | ch. 2-3 : D1 / D2 / D3 | palier 1 : D1 / D2 / D3 |'); log('|---|---|---|---|');
[['dispersion 0,3', { dispersion: 0.3 }], ['dispersion 0,6 (défaut)', {}], ['dispersion 0,9', { dispersion: 0.9 }], ['plancher RSA : 1 M de personnes', { rsaN: 1e6 }], ['plancher RSA : 1,9 M (défaut)', {}], ['plancher RSA : 2,85 M de personnes', { rsaN: 2.85e6 }]].forEach(function (h) {
  var f = function (k) { return P.deciles(k, undefined, h[1]).deciles.slice(0, 3).map(function (x) { return n0(x.ecartMoisUC); }).join(' / '); };
  log('| ' + h[0] + ' | ' + f('c4') + ' | ' + f('c2') + ' | ' + f('palier1') + ' |');
});

log('\n## Comparaison avec l\'ancienne lecture (salariés par décile de SALAIRE, sans plancher RSA, options-financement-palier1.md § 6), € par mois\n');
log('| configuration | lecture | D1 | D2 | D3 | D4 | D5 | D8 | D9 |'); log('|---|---|---|---|---|---|---|---|---|');
[['Palier 1', 'palier1'], ['Chemins 2-3', 'c2'], ['Chemin 4', 'c4']].forEach(function (l) {
  var s = P.decilesSalaries(l[1]), d = P.deciles(l[1]).deciles, ids = [0, 1, 2, 3, 4, 7, 8];
  log('| ' + l[0] + ' | salariés par décile de salaire (ancienne) | ' + ids.map(function (i) { return n0(s[i].ecartMois); }).join(' | ') + ' |');
  log('| ' + l[0] + ' | tous les adultes par décile de niveau de vie (nouvelle) | ' + ids.map(function (i) { return n0(d[i].ecartMoisUC); }).join(' | ') + ' |');
});
