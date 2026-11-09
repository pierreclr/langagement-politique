// Fiscalité du patrimoine financier (T56, suite) : tableaux de resultats.md § 24. Reproduction, depuis ce dossier :
//   jsc patrimoine_financier.js rapport_patrimoine_financier.js > resultats-patrimoine-financier.txt
var PF = this.PatrimoineFinancier;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function sg(x) { return (x >= 0 ? '+' : '−') + r2(Math.abs(x)); }
function pc(x) { return r1(x * 100) + ' %'; }
var SC = PF.SC;
var NOMS = { dividendes: 'Dividendes', portefeuille: 'Plus-values de portefeuille', assuranceVie: 'Assurance-vie (rachats)', pea: 'PEA', per: 'PER', entreprise: 'Cessions d\'entreprise (titres)', pro: 'Plus-values professionnelles', crypto: 'Crypto-actifs' };
var ORDRE = ['dividendes', 'portefeuille', 'assuranceVie', 'pea', 'per', 'entreprise', 'pro', 'crypto'];
var B = {}; SC.forEach(function (s) { B[s] = PF.bilan(s); });

log('## A. Solde net pour l\'État par actif (Md€/an, régime de croisière ; report des pertes 10 ans ; base réelle par défaut ; fin de la purge de l\'assurance-vie au décès par défaut)');
log('| actif | actuel | système idéal (net des crédits) | solde net bas | central | haut |'); log('|---|---|---|---|---|---|');
ORDRE.forEach(function (k) {
  log('| ' + NOMS[k] + ' | ' + SC.map(function (s) { return r2(B[s].parActif[k].recettesActuelles); }).join(' / ') + ' | ' + SC.map(function (s) { return r2(B[s].parActif[k].recettesNettes); }).join(' / ') + ' | ' + SC.map(function (s) { return sg(B[s].parActif[k].recettesNouvelles); }).join(' | ') + ' |');
});
log('| Assurance-vie au décès (fin de la purge, gains latents taxés) | ' + SC.map(function () { return r2(0); }).join(' / ') + ' | ' + SC.map(function (s) { return r2(B[s].parActif.assuranceVieDeces.recettesNouvelles); }).join(' / ') + ' | ' + SC.map(function (s) { return sg(B[s].parActif.assuranceVieDeces.recettesNouvelles); }).join(' | ') + ' |');
log('| **Total** | ' + SC.map(function (s) { return r2(ORDRE.reduce(function (a, k) { return a + B[s].parActif[k].recettesActuelles; }, 0)); }).join(' / ') + ' | ' + SC.map(function (s) { return r2(ORDRE.reduce(function (a, k) { return a + B[s].parActif[k].recettesNettes; }, 0) + B[s].parActif.assuranceVieDeces.recettesNouvelles); }).join(' / ') + ' | ' + SC.map(function (s) { return '**' + sg(B[s].soldeNet) + '**'; }).join(' | ') + ' |');

log('\n## B. Détail par scénario : gains bruts, base après comportement, recettes brutes, crédits créés, coût des crédits (Md€/an)');
SC.forEach(function (s) {
  log('\n### ' + s); log('| actif | assiette nette observée | gains bruts | taux actuel effectif | m (verrouillage) | fuite | base réformée | recettes brutes | crédits créés | coût des crédits | taux maximisant |'); log('|---|---|---|---|---|---|---|---|---|---|---|');
  ['dividendes', 'portefeuille', 'assuranceVie', 'pea', 'entreprise', 'pro', 'crypto'].forEach(function (k) {
    var x = B[s].parActif[k];
    log('| ' + NOMS[k] + ' | ' + r2(x.N) + ' | ' + r2(x.gainsBruts) + ' | ' + pc(x.tauA) + ' | ' + r2(x.multComportement) + ' | ' + pc(x.fuite) + ' | ' + r2(x.base) + ' | ' + r2(x.recettesBrutes) + ' | ' + r2(x.creditsCrees) + ' | ' + r2(x.coutCredits) + ' | ' + pc(x.tauxMaximisant) + ' |');
  });
  var p = B[s].parActif.per;
  log('\nPER : versements ' + r1(p.versements) + ' → ' + r1(p.versementsReforme) + ' Md€ ; sorties ' + r1(p.sorties) + ' ; solde actuel (sorties − déduction) ' + r2(p.soldeActuel) + ' ; solde système idéal ' + r2(p.soldeReforme) + ' ; avantage de taux actuel ' + pc(p.avantageNetActuel) + ' → 0.');
});

log('\n## C. Base réelle (défaut, inflation déduite, comme pour l\'immobilier) ou base nominale (variante) : solde net total (Md€/an)');
log('| base | bas | central | haut |'); log('|---|---|---|---|');
log('| réelle (défaut) | ' + SC.map(function (s) { return sg(PF.bilan(s).soldeNet); }).join(' | ') + ' |');
log('| nominale (variante) | ' + SC.map(function (s) { return sg(PF.bilan(s, { reel: false }).soldeNet); }).join(' | ') + ' |');
log('\nFacteur réel (gain réel / gain nominal, central) : ' + ['portefeuille', 'assuranceVie', 'pea', 'entreprise', 'pro', 'crypto'].map(function (k) { return NOMS[k] + ' ' + r2(PF.bilan('central', { reel: true }).parActif[k].facteurReel); }).join(' ; '));

log('\n## D. Durée de report des pertes : coût annuel des crédits (blocs d\'actifs, Md€) et solde net total');
log('| report | coût des crédits bas / central / haut | solde net bas / central / haut |'); log('|---|---|---|');
[[5, '5 ans'], [10, '10 ans'], [Infinity, 'sans limite']].forEach(function (x) {
  log('| ' + x[1] + ' | ' + SC.map(function (s) { return r2(PF.bilan(s, { T: x[0] }).coutCreditsBlocs); }).join(' / ') + ' | ' + SC.map(function (s) { return sg(PF.bilan(s, { T: x[0] }).soldeNet); }).join(' / ') + ' |');
});

log('\n## E. Assurance-vie au décès (Md€/an)');
log('| scénario | capitaux décès | gains latents | 990 I (2024, maintenu) | gains latents taxés à 50 % (net d\'anticipation et de fuite) |'); log('|---|---|---|---|---|');
SC.forEach(function (s) { var d = PF.assuranceVieDeces(s); log('| ' + s + ' | ' + r1(d.capitauxDeces) + ' | ' + r1(d.gainsLatents) + ' | ' + r2(d.prelevement990I) + ' | ' + sg(d.gainsLatentsTaxes.recettes) + ' |'); });
log('\nSolde net total au central : ' + sg(B.central.soldeNet) + ' avec la fin de la purge (défaut) ; ' + sg(PF.bilan('central', { deces: 'statuQuo' }).soldeNet) + ' en gardant la purge (statu quo) ; bas ' + sg(B.bas.soldeNet) + ' / ' + sg(PF.bilan('bas', { deces: 'statuQuo' }).soldeNet) + ', haut ' + sg(B.haut.soldeNet) + ' / ' + sg(PF.bilan('haut', { deces: 'statuQuo' }).soldeNet) + '.');

log('\n## F. Sensibilité à l\'élasticité de la base (central ; toutes les ε multipliées par k) : solde net total');
log('| k | ε dividendes | ε portefeuille | ε cession d\'entreprise | solde net |'); log('|---|---|---|---|---|');
var cop = JSON.parse(JSON.stringify(PF.PARAM.central));
[0, 0.5, 1, 1.5, 2, 3].forEach(function (k) {
  ['dividendes', 'portefeuille', 'av', 'pea', 'entreprise', 'pro', 'crypto'].forEach(function (a) { PF.PARAM.central[a].eps = cop[a].eps * k; });
  log('| ' + k + ' | ' + r1(PF.PARAM.central.dividendes.eps) + ' | ' + r1(PF.PARAM.central.portefeuille.eps) + ' | ' + r1(PF.PARAM.central.entreprise.eps) + ' | ' + sg(PF.bilan('central').soldeNet) + ' |');
});
['dividendes', 'portefeuille', 'av', 'pea', 'entreprise', 'pro', 'crypto'].forEach(function (a) { PF.PARAM.central[a].eps = cop[a].eps; });

log('\n## G. Taux de prélèvement : recette totale des blocs selon t (central ; ε inchangés)');
log('| t | recettes nettes des blocs | solde net total (avec PER) |'); log('|---|---|---|');
[0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6].forEach(function (t) {
  var b = PF.bilan('central', { t: t }); log('| ' + pc(t) + ' | ' + r2(b.recettesBrutesBlocs - b.coutCreditsBlocs) + ' | ' + sg(b.soldeNet) + ' |');
});

log('\n## H. Une année de krach (gains × 0,3, pertes × 3) : crédits créés en plus, recettes perdues, coût ultime (Md€)');
log('| scénario | crédits supplémentaires | recettes perdues | coût ultime (report 10 ans) |'); log('|---|---|---|---|');
SC.forEach(function (s) { var k = PF.krach(s); log('| ' + s + ' | ' + r2(k.total.creditsSupplementaires) + ' | ' + r2(k.total.recettesPerdues) + ' | ' + r2(k.total.coutUltime) + ' |'); });

log('\n## I. Report 150-0 B ter : gain unique à la suppression du report (50 % × stock × part devenant imposable ; Md€, une fois)');
log('| stock reporté S (Md€) | φ = 30 % | φ = 50 % | φ = 70 % |'); log('|---|---|---|---|');
[10, 20, 40].forEach(function (S) { log('| ' + S + ' | ' + [0.3, 0.5, 0.7].map(function (f) { return r1(PF.stockReport(S, f)); }).join(' | ') + ' |'); });
