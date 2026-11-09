// Fiscalité du patrimoine immobilier (T56) : tableaux de resultats.md § 21. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js dvf_patrimoine.js patrimoine_immobilier.js rapport_patrimoine_immobilier.js > resultats-patrimoine-immobilier.txt
var PI = this.PatrimoineImmobilier, P1 = this.Palier1, DVF = this.DvfPatrimoine;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ','); }
function r0(x) { return Math.round(x).toString(); }
function sg(x, f) { return (x >= 0 ? '+' : '−') + (f || r1)(Math.abs(x)); }
function pc(x) { return r1(x * 100) + ' %'; }
var SC = PI.SC, st = P1.palier1().st, Tn = { 5: '5 ans', 10: '10 ans', inf: 'sans limite' };

log('## A. Volumes (DVF 2024, hors Alsace-Moselle et Mayotte)');
log('| indicateur | valeur |'); log('|---|---|');
log('| ventes de logement ancien | ' + r0(DVF.france2024.n) + ' (appartements ' + r0(DVF.france2024.appartement.n) + ', maisons ' + r0(DVF.france2024.maison.n) + ') |');
log('| valeur | ' + r1(DVF.france2024.valeurMdEur) + ' Md€ ; prix moyen ' + r0(DVF.france2024.prixMoyen) + ' € |');
log('| DMTO théoriques à 5,81 % de cette valeur | ' + r1(0.0581 * DVF.france2024.valeurMdEur) + ' Md€ (total 2024 : 13,5 Md€ ; le reste = terrains, locaux, Alsace-Moselle) |');
DVF.france2024.bandes.forEach(function (b) { log('| tranche ' + (b.de / 1000) + ' à ' + (b.a >= 1e9 ? '∞' : b.a / 1000) + ' k€ | ' + r0(b.n) + ' ventes, ' + r1(b.valeurMdEur) + ' Md€ |'); });
var R = DVF.reventesIsere2021_2025;
log('| Isère 2024 | ' + r0(DVF.isere2024.n) + ' ventes (' + pc(DVF.isere2024.partNational) + ' du national) |');
log('| reventes appariées Isère 2021-2025 | ' + R.paires + ' paires, durée moyenne ' + r1(R.dureeMoyenne) + ' an, ' + pc(R.partPerteReelle) + ' à perte réelle ; dispersion IQR/1,349 : ' + R.dispersionParDuree.map(function (d) { return r2(d.sigmaIQR); }).join(' / ') + ' selon la durée (0,25-1, 1-2, 2-3, 3-4, 4-5 ans) |');

log('\n## B. Hypothèses par scénario (« bas » = le moins favorable au solde public)');
log('| paramètre | bas | central | haut |'); log('|---|---|---|---|');
[['dmto', 'DMTO perdus (Md€)'], ['partNonRP', 'part des ventes hors résidence principale'], ['dureeMoy', 'durée moyenne de détention (ans)'], ['derive', 'dérive réelle des prix (par an)'],
 ['fraisCession', 'frais de vente du vendeur'], ['travauxAn', 'travaux justifiés par an'], ['semiElDmto', 'hausse des ventes par point de DMTO supprimé'], ['capitalisation', 'part du DMTO capitalisée dans les prix'],
 ['elasticiteRealisation', 'élasticité de réalisation des plus-values'], ['absorption', 'part des crédits finalement imputable'], ['lambda', 'probabilité annuelle d\'imputation'], ['fraude', 'majoration des crédits (pertes fabriquées)']].forEach(function (q) {
  log('| ' + q[1] + ' | ' + SC.map(function (s) { return String(PI.PARAM[s][q[0]]).replace('.', ','); }).join(' | ') + ' |');
});

log('\n## C. Plus-values immobilières (Md€/an ; frais d\'acquisition : régime de transition 7,5 %, puis croisière 2,5 %)');
log('| scénario | recettes actuelles estimées | recettes à 50 % (transition) | recettes nouvelles | recettes à 50 % (croisière) | taux effectif sur gain réel | part de ventes gagnantes | gain réel / vente | perte réelle / vente |'); log('|---|---|---|---|---|---|---|---|---|');
SC.forEach(function (s) {
  var a = PI.plusValues(s), c = PI.plusValues(s, { fraisAcq: PI.COMMUN.fraisAcqCroisiere });
  log('| ' + s + ' | ' + r2(a.recettesActuelles) + ' | ' + r2(a.recettesReforme) + ' | ' + sg(a.recettesNouvelles, r2) + ' | ' + r2(c.recettesReforme) + ' | ' + pc(a.tauxEffectifReforme) + ' | ' + pc(a.partGagnantes) + ' | ' + pc(a.gainReelParEuro) + ' | ' + pc(a.perteReelleParEuro) + ' |');
});
log('Contrôle : le droit actuel central donne ' + r2(PI.plusValues('central').recettesActuelles) + ' Md€ pour 3,6 Md€ observés en 2023 (' + pc(PI.plusValues('central').recettesActuelles / 3.6) + ').');

log('\n## D. Perte des droits de mutation et compensation (T = 10 ans, transition)');
log('| scénario | DMTO perdus | dont départements | dont communes | dont État (frais d\'assiette) | recettes nouvelles de plus-values | coût du report | solde net | couverture des DMTO par les plus-values | taxe foncière : hausse pour tout compenser | hausse pour les seuls DMTO |'); log('|---|---|---|---|---|---|---|---|---|---|---|');
SC.forEach(function (s) {
  var b = PI.bilan(s);
  log('| ' + s + ' | ' + r1(b.dmto.total) + ' | ' + r1(b.dmto.departements) + ' | ' + r1(b.dmto.communes) + ' | ' + r2(b.dmto.etat) + ' | ' + sg(b.plusValues.recettesNouvelles) + ' | −' + r2(b.report.coutAnnuel) + ' | ' + sg(b.soldeNet) + ' | ' + pc(b.couvertureDmtoParPv) + ' | +' + r0(b.tfpbHausseEquivalentePct) + ' % | +' + r0(b.tfpbHausseDmtoSeulPct) + ' % |');
});
log('\nSolde « brut » (si le modèle a déjà retiré les recettes actuelles de plus-values avec l\'IR et les prélèvements sociaux) : ' + SC.map(function (s) { return s + ' ' + sg(PI.bilan(s).soldeBrut); }).join(', ') + ' Md€/an.');
log('Solde en régime de croisière (frais d\'acquisition 2,5 %) : ' + SC.map(function (s) { return s + ' ' + sg(PI.bilan(s, { fraisAcq: PI.COMMUN.fraisAcqCroisiere }).soldeNet); }).join(', ') + ' Md€/an.');

log('\n## E. Report des pertes : coût annuel en régime de croisière (Md€/an)');
log('| scénario | crédits créés par an | coût à 5 ans | coût à 10 ans | coût sans limite | coût sans limite si crédit aussi sur la résidence principale |'); log('|---|---|---|---|---|---|');
SC.forEach(function (s) {
  var a = PI.reportPertes(s, 5), b = PI.reportPertes(s, 10), c = PI.reportPertes(s, Infinity);
  log('| ' + s + ' | ' + r2(c.creditsCreesAn) + ' | ' + r2(a.coutAnnuel) + ' | ' + r2(b.coutAnnuel) + ' | ' + r2(c.coutAnnuel) + ' | ' + r2(c.coutAnnuelAvecRP) + ' |');
});

log('\n## F. Krach : prix −20 %, ventes × 0,75, une année (Md€)');
log('| scénario | part de ventes à perte | crédits créés | surcroît vs année normale | recettes de plus-values perdues | coût ultime à 5 ans | à 10 ans | sans limite | crédits en années de recettes normales | surcroît sur trois années |'); log('|---|---|---|---|---|---|---|---|---|---|');
SC.forEach(function (s) {
  var k = PI.krach(s);
  log('| ' + s + ' | ' + pc(k.partPerdantes) + ' | ' + r1(k.creditsCrees) + ' | ' + r1(k.creditsSupplementaires) + ' | ' + r1(k.recettesPerduesAnnee) + ' | ' + r1(k.coutUltime['5']) + ' | ' + r1(k.coutUltime['10']) + ' | ' + r1(k.coutUltime.illimite) + ' | ' + r1(k.anneesDeRecettesNormales) + ' | ' + r1(k.troisAnnees.creditsSupplementaires) + ' |');
});

log('\n## G. Effets de comportement');
log('| scénario | hausse du volume de ventes | ventes supplémentaires par an | élasticité de réalisation → ventes gagnantes hors RP | prix | coût total d\'acquisition |'); log('|---|---|---|---|---|---|');
SC.forEach(function (s) {
  var c = PI.comportement(s);
  log('| ' + s + ' | ' + sg((c.mVolume - 1) * 100) + ' % | ' + r0(c.ventesSupplementaires) + ' | ×' + r2(c.mVerrouillage) + ' (taux actuel moyen sur le gain réel ' + pc(c.tauxActuelReel) + ' → 50 %) | ' + sg(c.variationPrixPct) + ' % | ' + sg(c.coutAcquisitionPct) + ' % |');
});

log('\n## H. Intégration au système idéal (palier 1 central : solde −163,3 Md€, taux plat 35 %, déficit actuel −169,1 Md€)');
log('| scénario patrimoine | delta (net) | solde avec patrimoine | taux plat requis | points de plus | delta (brut) | taux plat requis (brut) | points de plus (brut) |'); log('|---|---|---|---|---|---|---|---|');
SC.forEach(function (s) {
  var a = PI.integration(st, s), b = PI.integration(st, s, { pvDejaSupprimees: true });
  log('| ' + s + ' | ' + sg(a.delta) + ' | ' + r1(a.soldeAvecPatrimoine) + ' | ' + pc(a.tauxPlatRequis) + ' | ' + sg(a.pointsDePlatSupplementaires, r2) + ' | ' + sg(b.delta) + ' | ' + pc(b.tauxPlatRequis) + ' | ' + sg(b.pointsDePlatSupplementaires, r2) + ' |');
});

log('\n## I. Sensibilité du scénario central (solde net, Md€/an, T = 10 ans), un paramètre à la fois');
log('| paramètre | valeur basse → solde | valeur haute → solde |'); log('|---|---|---|');
function sens(cle, vb, vh, nom) {
  var orig = PI.PARAM.central[cle];
  PI.PARAM.central[cle] = vb; var a = PI.bilan('central').soldeNet; PI.PARAM.central[cle] = vh; var b = PI.bilan('central').soldeNet; PI.PARAM.central[cle] = orig;
  log('| ' + nom + ' | ' + String(vb).replace('.', ',') + ' → ' + sg(a) + ' | ' + String(vh).replace('.', ',') + ' → ' + sg(b) + ' |');
}
sens('derive', 0.01, 0.04, 'dérive réelle des prix'); sens('partNonRP', 0.25, 0.40, 'part hors résidence principale'); sens('dureeMoy', 8, 16, 'durée de détention');
sens('semiElDmto', 0.03, 0.136, 'élasticité aux DMTO'); sens('elasticiteRealisation', 0.0, 1.0, 'élasticité de réalisation'); sens('absorption', 0.5, 1.0, 'absorption des crédits');
sens('fraisCession', 0.02, 0.06, 'frais de vente'); sens('travauxAn', 0.0, 0.01, 'travaux justifiés par an');
var c0 = PI.COMMUN.sigma0; PI.COMMUN.sigma0 = 0.10; var s1 = PI.bilan('central').soldeNet; PI.COMMUN.sigma0 = 0.25; var s2 = PI.bilan('central').soldeNet; PI.COMMUN.sigma0 = c0;
log('| dispersion sigma0 | 0,10 → ' + sg(s1) + ' | 0,25 → ' + sg(s2) + ' |');

// ---- Variantes contre le verrouillage (H279-H287, methode.md § 25)
log('\n## L. Variantes contre le verrouillage (Md€/an, régime de transition ; solde net = recettes nouvelles de plus-values − DMTO perdus − coût du report 10 ans)');
SC.forEach(function (sc) {
  log('\n### Scénario ' + sc + ' (élasticité de réalisation H252 = ' + String(PI.PARAM[sc].elasticiteRealisation).replace('.', ',') + ')');
  log('| Variante | Recettes de plus-values | Solde net | Écart au défaut | Ventes gagnantes verrouillées | Coût du verrouillage | Taux effectif moyen sur le gain |');
  log('|---|---|---|---|---|---|---|');
  PI.comparerVariantes(sc).forEach(function (r) {
    log('| ' + r.libelle + ' | ' + r1(r.recettesPV) + ' | ' + sg(r.soldeNet) + ' | ' + (r.cle === 'aucune' ? '—' : sg(r.ecartAuDefaut)) + ' | ' + r1(r.verrouillagePct) + ' % | ' + r2(r.coutVerrouillage) + ' | ' + pc(r.tauxEffectifMoyen) + ' |');
  });
});
log('\n### Report : première année contre régime de croisière (Md€ de recettes de plus-values)');
log('| Scénario | Première année | Croisière | Défaut |');
log('|---|---|---|---|');
SC.forEach(function (sc) { var v = PI.plusValuesVariante(sc, 'rollover'); log('| ' + sc + ' | ' + r1(v.recettesPremiereAnnee) + ' | ' + r1(v.recettesReforme) + ' | ' + r1(PI.plusValuesVariante(sc, 'aucune').recettesReforme) + ' |'); });
log('\n### Sensibilité à l\'élasticité de réalisation (central ; écart de solde net d\'une variante au défaut, les deux calculés avec la même élasticité)');
log('| Élasticité | Défaut : solde | Dégressif −4 % | Locatif exonéré 10 ans | Report |');
log('|---|---|---|---|---|');
[0, 0.3, 0.5, 0.8, 1.0, 1.5, 2.5].forEach(function (e) {
  var d = PI.bilanVariante('central', 'aucune', { elasticite: e }).soldeNet;
  function ec(v) { return sg(PI.bilanVariante('central', v, { elasticite: e }).soldeNet - d); }
  log('| ' + String(e).replace('.', ',') + ' | ' + sg(d) + ' | ' + ec('degressif') + ' | ' + ec({ type: 'exoLocatif', N: 10 }) + ' | ' + ec('rollover') + ' |');
});
function seuilElasticite(v) {
  var f = function (e) { return PI.bilanVariante('central', v, { elasticite: e }).soldeNet - PI.bilanVariante('central', 'aucune', { elasticite: e }).soldeNet; };
  for (var e = 0; e <= 10 + 1e-9; e += 0.05) if (f(e) >= 0) return e;   // premier pas de 0,05 où la variante rapporte au moins autant que le défaut
  return null;
}
log('\nÉlasticité à partir de laquelle la variante rapporte plus que le défaut (central, balayage de 0 à 10 par pas de 0,05 ; « aucune » = jamais dans cette plage) :');
[['dégressif −4 % du taux par an', 'degressif'], ['locatif exonéré après 10 ans', { type: 'exoLocatif', N: 10 }], ['locatif exonéré après 22 ans', { type: 'exoLocatif', N: 22 }], ['report', 'rollover']].forEach(function (x) { var e = seuilElasticite(x[1]); log('- ' + x[0] + ' : ' + (e === null ? 'aucune' : r2(e))); });
