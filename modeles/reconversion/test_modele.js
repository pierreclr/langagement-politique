// Tests du modèle de reconversion. Lancer depuis modeles/reconversion/ :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc ../industrie-complexite/modele.js modele.js test_modele.js
var R = this.Reconversion || (typeof require !== 'undefined' ? require('./modele.js') : null);
var T6 = this.IndustrieComplexite || (typeof require !== 'undefined' ? require('../industrie-complexite/modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol) { return Math.abs(a - b) <= tol; }

// 1. Briques
ok(proche(R.trimestriel(0.75), 1 - Math.pow(0.25, 0.25), 1e-12), 'taux trimestriel équivalent');
ok(proche(1 - Math.pow(1 - R.trimestriel(0.6), 4), 0.6, 1e-12), '4 trimestres redonnent la probabilité annuelle');
ok(R.survie(0, 0.3, 0.2, 0.01) === 1, 'survie = 1 au départ');
ok(R.survie(8, 0.3, 0.2, 0.01) < R.survie(4, 0.3, 0.2, 0.01), 'survie décroissante');
ok(proche(R.survie(1000, 0.3, 0.2, 0), 0.3, 1e-9), 'type éloigné sans sortie : la survie tend vers pi');
ok(proche(R.perteSalaire(0, 0.15, 0.07, 3), 0.15, 1e-12) && R.perteSalaire(50, 0.15, 0.07, 3) < 0.0701, 'perte de salaire : de L0 vers Linf');
var a0 = R.allocationMensuelle(0, 2100, 1);
ok(proche(a0.deg2, 0.6 * 1750, 1e-9) && a0.plancher === 0, 'deg2 trimestre 1 : 60 % de (2 100 − 350), plancher non mobilisé');
var a2 = R.allocationMensuelle(2, 2100, 1);
ok(proche(a2.deg2, 350, 1e-9) && proche(a2.plancher, 877 - 350 - 350, 1e-9), 'trimestre 3 : deg2 350 €, plancher complète à 877 €');
var a9 = R.allocationMensuelle(9, 2100, 0.5);
ok(a9.deg2 === 0 && proche(a9.plancher, 0.5 * 527, 1e-9), 'après un an : plancher seul (527 € × éligibilité)');
ok(proche(R.allocationMensuelle(0, 5000, 0).deg2, 0.6 * (3000 - 350), 1e-9), 'net plafonné à 3 000 €');
var w = R.calendrier('rapide', 36); ok(proche(w.reduce(function (s, x) { return s + x; }, 0), 1, 1e-12) && w[3] > 0 && w[4] === 0, 'calendrier rapide : 2029-2032');
ok(R.calendrier('lent', 36)[9] > 0 && R.calendrier('lent', 36)[10] === 0, 'calendrier lent : 2029-2038');

// 2. Cohérence avec T6
['bas', 'central', 'haut'].forEach(function (t) {
  var p = R.postesT6(T6, t), c = R.D.postesT6[t];
  ok(proche(p.externe, c.externe, 1) && proche(p.interne, c.interne, 1), 'postes T6 (' + t + ') = constantes du modèle');
});
var F = R.flux({ externe: 79240, interne: 180442 }, R.calendrier('rapide', 36), 'central');
var tot = F.reduce(function (s, x) { return s + x.absorbes + x.redeployes + x.separations; }, 0);
ok(proche(tot, 259682, 1e-6), 'flux : absorbés + redéployés + séparations = postes');

// 3. Propriétés
var S = {};
[['bas', 'favorable'], ['central', 'central'], ['haut', 'defavorable']].forEach(function (c) {
  ['rapide', 'lent'].forEach(function (cal) { S[c[0] + '-' + c[1] + '-' + cal] = R.simuler({ taille: c[0], marche: c[1], calendrier: cal, T6: T6 }).synthese; });
});
var cr = S['central-central-rapide'], cl = S['central-central-lent'];
ok(cl.deplaces < cr.deplaces / 3, 'le choc lent divise au moins par trois le nombre de déplacés');
ok(cl.coutBudgetaireNetCumule < cr.coutBudgetaireNetCumule / 3, 'le choc lent divise au moins par trois le coût budgétaire');
ok(S['haut-defavorable-rapide'].coutBudgetaireNetCumule > cr.coutBudgetaireNetCumule, 'défavorable plus coûteux que central');
ok(cr.coutBudgetaireBrutCumule >= cr.coutBudgetaireNetCumule, 'brut ≥ net');
ok(cr.retourParAge[5].retraiteSansRetour > cr.retourParAge[2].retraiteSansRetour, 'les 60-63 ans finissent plus souvent en retraite sans retour');
ok(cr.retourParAge[0].r2 > cr.retourParAge[4].r2, 'retour à deux ans plus fréquent chez les jeunes');
var pol = R.simuler({ taille: 'central', marche: 'central', T6: T6, politique: 'toutes' }).synthese;
ok(pol.productionManquanteCumulee < cr.productionManquanteCumulee, 'les politiques réduisent la production manquante');
var cal = R.perteRevenuCohorte('central');
ok(cal.an5 > 0.08 && cal.an5 < 0.3, 'calibrage : perte de revenu à 5 ans entre 8 et 30 % (Bertheau et al. : 12 % à 25 % en France)');
ok(R.perteRevenuCohorte('favorable').va20 < cal.va20 && cal.va20 < R.perteRevenuCohorte('defavorable').va20, 'calibrage : VA20 croissante du favorable au défavorable');
var pub = R.publicNonRemplacement(33000, 14000, 10);
ok(pub.deplaces === 0 && proche(pub.partDesDeparts, 33000 / 140000, 1e-12), 'public : non-remplacement sans déplacé');
log(n + ' contrôles réussis');
