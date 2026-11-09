// Test de cohérence et calculs de resultats.md. Lancer depuis modeles/fiscalite-orientation/ :
//   jsc modele.js test_modele.js
//   (macOS : /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
//   ou : node test_modele.js
var M = this.FiscaliteOrientation || (typeof require !== 'undefined' ? require('./modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r(x, d) { var f = Math.pow(10, d === undefined ? 1 : d); return Math.round(x * f) / f; }
function copie(o) { return JSON.parse(JSON.stringify(o)); }
var D = M.DONNEES;

// 1. Tests de cohérence
var a0 = M.effetAccise({ conso: 10, t0: 0.2, e: { central: 0 }, i: { central: 1 }, cle: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }, 0.1, 'central', D, 0);
ok(Math.abs(a0.recetteNouvelle - 1) < 1e-12 && Math.abs(a0.emissions) < 1e-12, 'élasticité nulle : recette = τ × base, aucune émission évitée');
var a1 = M.effetAccise({ conso: 10, t0: 0, e: { central: 1 }, i: { central: 1 }, cle: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }, 0.1, 'central', D, 0);
ok(Math.abs(a1.volumePct - 100 * (Math.pow(1.1, -1) - 1)) < 1e-9, 'élasticité −1 : volume × 1/1,1');
ok(Math.abs(a1.recetteNouvelle + a1.effetBudget - a1.net) < 1e-12, 'net = nouvelles − anciennes perdues + effet budget');
var t0 = M.effetTvaZero({ conso: 105.5, r: 0.055, e: { central: 0 }, i: 0.4, cle: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }, 'central', D, 1);
ok(Math.abs(t0.tvaPerdue - 5.5) < 1e-9, 'TVA à 0 : 105,5 TTC à 5,5 % → 5,5 de TVA perdue');
var c = M.simuler({});
var s = c.deciles.reduce(function (a, x) { return a + x.chargeMdE; }, 0);
ok(Math.abs(s - c.recettesNettesMdE) < 1e-9, 'la somme des charges par décile = recettes nettes (répercussion complète)');
var sv = c.deciles.reduce(function (a, x) { return a + x.netApresVersementEgalMdE; }, 0);
ok(Math.abs(sv) < 1e-9, 'versement égal : somme des effets nets nulle');
ok(M.simuler({ comportement: 'haut' }).emissionsBrutesMt < M.simuler({ comportement: 'bas' }).emissionsBrutesMt, 'réactions fortes → plus d\'émissions évitées');
ok(M.simuler({ comportement: 'haut' }).recettesNettesMdE < M.simuler({ comportement: 'bas' }).recettesNettesMdE, 'réactions fortes → moins de recettes');
ok(M.simuler({ politique: 'horsRegles' }).recettesNettesMdE > c.recettesNettesMdE, 'le scénario hors règles ajoute des recettes');
ok(M.valeurCurseur({}) % 5 === 0 && M.valeurCurseur({}) >= 0 && M.valeurCurseur({}) <= 100, 'curseur : multiple de 5 entre 0 et 100');
ok(M.simuler({ niveau: 0 }).recettesNettesMdE < 0, 'sans accises, la TVA à 0 % seule coûte des recettes');

// 2. Résultats (pour resultats.md)
function ligne(nom, x) {
  log(nom + ' : recettes nettes ' + r(x.recettesNettesMdE) + ' Md€ | émissions brutes ' + r(x.emissionsBrutesMt) +
      ' Mt, rebond budget ' + (x.rebondBudgetMt >= 0 ? '+' : '') + r(x.rebondBudgetMt) + ', rebond recyclage +' + r(x.rebondRecyclageMt) +
      ' → nettes ' + r(x.emissionsNettesMt) + ' Mt (' + r(x.emissionsNettesPctEmpreinte) + ' % de l\'empreinte, ' +
      r(x.emissionsNettesPctMenages) + ' % de celle des ménages)');
}
log('\n--- Six combinaisons ---');
var sc = M.scenarios();
for (var n in sc) { ligne(n, sc[n]); log('   curseur : ' + M.valeurCurseur({ politique: n.split('_')[0], comportement: n.split('_')[1] })); }

log('\n--- Détail par poste (central) ---');
['conforme', 'horsRegles'].forEach(function (pol) {
  var x = M.simuler({ politique: pol });
  log('[' + pol + ']');
  for (var k in x.postes) {
    var p = x.postes[k];
    log('  ' + p.libelle + ' : base ' + r(p.base) + ' Md€, prix ' + r(p.prixPct) + ' %, volume ' + r(p.volumePct) +
        ' %, net ' + r(p.net, 2) + ' Md€, émissions ' + r(p.emissions, 2) + ' Mt' +
        (p.prixImpliciteTonne ? ', soit ≈ ' + r(p.prixImpliciteTonne, 0) + ' €/t' : ''));
  }
});

log('\n--- Par décile (central) : charge en % du RDN, € par ménage, net après versement égal (% du RDN) ---');
['conforme', 'horsRegles'].forEach(function (pol) {
  var x = M.simuler({ politique: pol });
  log('[' + pol + '] versement égal par décile : ' + r(x.recettesNettesMdE / 10, 2) + ' Md€');
  x.deciles.forEach(function (d) {
    log('  D' + d.decile + ' charge ' + r(d.chargeMdE, 2) + ' Md€ = ' + r(d.chargePctRDN, 2) + ' % du RDN, ' +
        r(d.chargeParMenageEuros, 0) + ' €/ménage/an | après versement : ' + r(d.netApresVersementEgalPctRDN, 2) + ' % du RDN');
  });
});
log('\nTVA à 0 % seule (niveau 0) : ' + r(M.simuler({ niveau: 0 }).recettesNettesMdE) + ' Md€');
M.simuler({ niveau: 0 }).deciles.forEach(function (d) { log('  D' + d.decile + ' ' + r(d.chargePctRDN, 2) + ' % du RDN'); });

log('\nTaxes seules, sans TVA à 0 % (conforme) : ' + r(M.simuler({ sansTvaZero: true }).recettesNettesMdE) + ' Md€');
M.simuler({ sansTvaZero: true }).deciles.forEach(function (d) { log('  D' + d.decile + ' ' + r(d.chargePctRDN, 2) + ' % du RDN, ' + r(d.chargeParMenageEuros, 0) + ' €/ménage'); });

log('\n--- Sensibilités (conforme, central sauf mention) ---');
ligne('niveau 0,5 (taux divisés par deux)', M.simuler({ niveau: 0.5 }));
ligne('niveau 1,5 (aérien +90 % ≈ doublement)', M.simuler({ niveau: 1.5 }));
ligne('intensités hautes (viande 1,4 ; aérien 1,8 avec traînées)', M.simuler({ intensites: 'haut' }));
ligne('intensités basses', M.simuler({ intensites: 'bas' }));
ligne('baisse de TVA répercutée à 50 %', M.simuler({ repercussion: 0.5 }));
ligne('hors règles, niveau 1,5', M.simuler({ politique: 'horsRegles', niveau: 1.5 }));
var dd = copie(D); dd.accises.voituresLourdes.part = 0.6;
ligne('voitures lourdes = 60 % des achats', M.simuler({}, dd));
// V313 (03/11/2026) : élasticité-prix française de la viande (Caillavet, Fadhuile et Nichèle, AAEA 2014 : ≈ −1,2, compensée)
// au lieu de −0,7 (central, Andreyeva et al. 2010, États-Unis). Sensibilité seulement : le central n'est pas modifié.
var dv = copie(D); dv.accises.viande.e.central = 1.2;
ligne('viande : élasticité française −1,2 au lieu de −0,7 (V313)', M.simuler({}, dv));
var pv0 = M.simuler({}).postes.viande, pv1 = M.simuler({}, dv).postes.viande;
ok(pv1.volumePct < pv0.volumePct && pv1.emissions < pv0.emissions, 'V313 : élasticité de la viande plus forte → volume et émissions plus bas, recette de la viande plus basse');
log('   poste viande : volume ' + r(pv0.volumePct) + ' % → ' + r(pv1.volumePct) + ' % ; net ' + r(pv0.net, 2) + ' → ' + r(pv1.net, 2) + ' Md€ ; émissions ' + r(pv0.emissions, 2) + ' → ' + r(pv1.emissions, 2) + ' Mt');
log('\nTous les tests passent.');
