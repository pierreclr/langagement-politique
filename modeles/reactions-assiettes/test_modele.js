// Test de cohérence et calculs de resultats.md. Lancer depuis modeles/reactions-assiettes/ :
//   jsc modele.js test_modele.js
// (macOS : /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
var R = this.ReactionsAssiettes || (typeof require !== 'undefined' ? require('./modele.js') : null);
var lire = (typeof read === 'function') ? read : function (p) { return require('fs').readFileSync(p, 'utf8'); };
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
function r0(x) { return String(Math.round(x)); }
function pc(x) { return (Math.round(x * 1000) / 10).toFixed(1) + ' %'; }
function proche(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-9); }

// 1. Tests unitaires
ok(proche(R.facteurIntensif(0.3, 0.3, 1), 1), 'taux inchangé : aucune réaction');
ok(proche(R.facteurIntensif(0.3, 0.5, 1), 0.5 / 0.7), 'élasticité 1 : assiette proportionnelle au taux net');
ok(proche(R.variationGroupe(1, 0.3, 1, 0.1, 0), 0), 'pas de variation du taux net : pas de départ');
ok(R.variationGroupe(0.5, 0.3, 1, 0.1, 1) > R.variationGroupe(0.5, 0.3, 1, 0.1, 0), 'imposition selon la nationalité : moins de départs');
ok(proche(R.variationGroupe(0.5, 0.3, 1, 0, 1), 0), 'nationalité parfaitement appliquée, aucun étranger : aucun départ');
ok(proche(R.impotFortuneEquivalent(0.5, 1), 0.5), 'impôt-fortune équivalent sur 1 an = droit');

// 2. Les paramètres du CSV sont ceux du code
var csv = R.assiettesDepuisCSV(lire('donnees/parametres_assiettes.csv'));
ok(JSON.stringify(csv) === JSON.stringify(R.DEFAUTS.assiettes), 'parametres_assiettes.csv = DEFAUTS de modele.js');

// 3. Invariants
var c0 = R.calculer({ scenario: 'central' });
var somme = c0.totaux.perteEcart + c0.totaux.perteIntensive + c0.totaux.perteMigration + c0.perteEntreprise;
ok(proche(somme, c0.totaux.perte, 1e-6), 'décomposition de la perte = perte totale');
ok(proche(c0.totaux.statique, 0.5 * 2169, 1.5), 'recette statique ≈ 1 085 Md€ (simulateur)');
var tousZero = R.DEFAUTS.assiettes.map(function (a) {
  var b = JSON.parse(JSON.stringify(a)); b.eTop = [0, 0, 0]; b.eReste = [0, 0, 0]; b.ecart = [0, 0, 0]; return b;
});
var c00 = R.calculer({ assiettes: tousZero, eta: [0, 0, 0], etaEtrangers: [0, 0, 0], effetEntreprise: [0, 0, 0] });
ok(R.calculer({ chevauchement: [0, 0, 0] }).totaux.perteMigration < c0.totaux.perteMigration, 'les familles qui partent emportent leurs revenus');
ok(proche(c00.totaux.perte, 0, 1e-9), 'sans réaction, recette = recette statique');
var pertes = ['bas', 'central', 'haut'].map(function (s) { return R.calculer({ scenario: s }).totaux.perte; });
ok(pertes[0] < pertes[1] && pertes[1] < pertes[2], 'perte croissante de bas à haut');

// 4. Résultats (taux 50 %)
log('\n=== Perte de recettes par assiette (Md€/an, taux 50 %, sans imposition selon la nationalité) ===');
var S = ['bas', 'central', 'haut'];
var res = S.map(function (s) { return R.calculer({ scenario: s }); });
log('assiette | statique | perte bas | perte central | perte haut | coef. central');
res[0].lignes.forEach(function (l, j) {
  log(l.nom + ' | ' + r1(l.statique) + ' | ' + r1(res[0].lignes[j].perte) + ' | ' + r1(res[1].lignes[j].perte) + ' | ' +
    r1(res[2].lignes[j].perte) + ' | ' + r1(res[1].lignes[j].coefficient * 100) + ' %');
});
log('Entreprises des partants (masse salariale) | — | ' + res.map(function (r) { return r1(r.perteEntreprise); }).join(' | '));
log('TOTAL | ' + r1(res[0].totaux.statique) + ' | ' + res.map(function (r) { return r1(r.totaux.perte); }).join(' | '));
res.forEach(function (r) {
  log('  ' + r.scenario + ' : recette ' + r0(r.totaux.recette) + ' Md€ (perte ' + pc(r.totaux.perte / r.totaux.statique) +
    ') ; écart de déclaration ' + r1(r.totaux.perteEcart) + ', optimisation ' + r1(r.totaux.perteIntensive) +
    ', exil ' + r1(r.totaux.perteMigration) + ', entreprises ' + r1(r.perteEntreprise) +
    ' ; fuite des héritages ' + pc(r.fuiteTransmissions));
});

log('\n=== Groupes mobiles (stock de long terme, ≈ 10 ans) ===');
res.forEach(function (r) {
  log(r.scenario + ' : revenus (A) rapport net ' + r1(r.groupeA.rapportNet * 100) + ' % → variation ' + pc(r.groupeA.variation) +
    ' soit ' + r0(-r.groupeA.partants) + ' foyers (top 1 %), revenus du haut avec départs des familles ' + pc(r.groupeA.variationAvecFamilles) +
    ', assiette de revenus perdue ' + r1(r.groupeA.revenuPartants) + ' Md€ ; patrimoines (B) rapport ' + r1(r.groupeB.rapportNet * 100) +
    ' % → ' + pc(r.groupeB.variation) + ' soit ' + r0(r.groupeB.partants) + ' foyers du top 1 % (' + r0(r.groupeB.partantsTop01) +
    ' du top 0,1 %) ; transmissions perdues par l\'exil ' + r1(r.groupeB.revenuPartants) + ' Md€ d\'assiette');
});
log('impôt-fortune équivalent du passage de 10 % à 50 % sur 25 ans : +' + r1(res[1].pointsImpotFortuneEquivalent) + ' point/an');

log('\n=== Imposition selon la nationalité : perte totale (Md€) selon son efficacité k ===');
var ks = [0, 0.05, 0.25, 0.6];
log('scénario | ' + ks.map(function (k) { return 'k=' + k; }).join(' | ') + ' | exil seul k=0 → k=0,6 | départs B k=0 → k=0,6');
S.forEach(function (s) {
  var g = ks.map(function (k) { return R.calculer({ scenario: s, nationalite: k }); });
  log(s + ' | ' + g.map(function (r) { return r1(r.totaux.perte); }).join(' | ') + ' | ' +
    r1(g[0].totaux.perteMigration + g[0].perteEntreprise) + ' → ' + r1(g[3].totaux.perteMigration + g[3].perteEntreprise) + ' | ' +
    r0(g[0].groupeB.partants) + ' → ' + r0(g[3].groupeB.partants));
});

log('\n=== Sensibilité au taux (central, k = 0) ===');
[0.4, 0.45, 0.5, 0.55, 0.6].forEach(function (t) {
  var r = R.calculer({ scenario: 'central', taux: t });
  log('taux ' + r0(t * 100) + ' % : statique ' + r0(r.totaux.statique) + ', après réactions ' + r0(r.totaux.recette) +
    ' (perte ' + pc(r.totaux.perte / r.totaux.statique) + ') ; fuite héritages ' + pc(r.fuiteTransmissions));
});

log('\n=== Branchement simulateur (central) : coefficients d\'assiette ===');
var co = res[1].coefficients;
for (var id in co) log('  ' + id + ' : ' + co[id].toFixed(3));
log('  curseur fuite (bas/central/haut) : ' + res.map(function (r) { return r0(r.fuiteTransmissions * 100); }).join(' / ') + ' %');
