// Génère resultats.txt. Lancer depuis modeles/reconversion/ :
//   jsc ../industrie-complexite/modele.js modele.js rapport.js > resultats.txt
var R = this.Reconversion, T6 = this.IndustrieComplexite, log = print;
function f1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ','); }
function f2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ','); }
function k(x) { return Math.round(x / 1000) + ' k'; }
function pc(x) { return Math.round(x * 100) + ' %'; }
log('# Modèle de reconversion — généré par rapport.js (Md€ de 2024 non actualisés sauf mention ; personnes)');
log('# Hypothèses et ordres de grandeur, jamais des prédictions.\n');
log('## A. Calibrage (cohorte de 40-49 ans) : perte de revenu du travail par rapport à avant la séparation');
log('marché | année 1 | année 2 | année 5 | année 10 | non-emploi à 5 ans | VA 20 ans à 5 % (années de revenu)');
R.MARCHES.forEach(function (m) { var c = R.perteRevenuCohorte(m); log(m + ' | ' + pc(c.an1) + ' | ' + pc(c.an2) + ' | ' + pc(c.an5) + ' | ' + pc(c.an10) + ' | ' + pc(c.nonEmploi5ans) + ' | ' + f1(c.va20)); });
log('repères : Bertheau et al. (2023), France : −20 % (t+1), −12 % (t+5), non-emploi ≈ 10 % à 5 ans ; contre témoins toujours employés −25 % / −25,5 % ; Davis et von Wachter (2011), États-Unis : 1,4 an (chômage < 6 %), 2,8 ans (> 8 %)\n');

var principaux = [['bas', 'favorable', 'favorable'], ['central', 'central', 'central'], ['haut', 'defavorable', 'défavorable']];
['rapide', 'lent'].forEach(function (cal) {
  log('## B. Scénarios principaux, calendrier ' + cal + (cal === 'rapide' ? ' (bascule 2029-2032)' : ' (2029-2038, non-remplacement et attrition)'));
  log('scénario (taille T6 × marché) | postes | absorbés | redéployés | déplacés | retour 1 / 2 / 5 ans | retraite sans retour | pic non-emploi | production manquante cumulée (actualisée 2,5 %) | budget net moyen 2029-2035 | pic (année) | cumul brut / net | dont allocations (plancher) | formation | perte des personnes (années de salaire par déplacé)');
  principaux.forEach(function (c) {
    var s = R.simuler({ taille: c[0], marche: c[1], calendrier: cal, T6: T6 }).synthese;
    log(c[2] + ' (' + c[0] + ' × ' + c[1] + ') | ' + k(s.postesSupprimes) + ' | ' + k(s.absorbes) + ' | ' + k(s.redeployes) + ' | ' + k(s.deplaces) + ' | ' +
      pc(s.tauxRetour1an) + ' / ' + pc(s.tauxRetour2ans) + ' / ' + pc(s.tauxRetour5ans) + ' | ' + k(s.retraiteSansRetour) + ' | ' + k(s.picNonEmploi) + ' | ' +
      f1(s.productionManquanteCumulee) + ' (' + f1(s.productionManquanteActualisee) + ') | ' + f2(s.coutBudgetaireNetMoyen2029_2035) + ' | ' + f2(s.picBudgetNet) + ' (' + s.anneePicBudget + ') | ' +
      f1(s.coutBudgetaireBrutCumule) + ' / ' + f1(s.coutBudgetaireNetCumule) + ' | ' + f1(s.allocationsCumulees) + ' (' + f1(s.dontPlancherCumule) + ') | ' + f1(s.formationCumulee) + ' | ' +
      f1(s.pertePersonnesCumulee) + ' Md€ (' + f1(s.pertePersonnesAnneesDeSalaire) + ')');
  });
  log('');
  log('Retour par âge (scénario central, ' + cal + ') : classe | déplacés | en emploi à 1 / 2 / 5 ans | retraite sans retour');
  var sc = R.simuler({ taille: 'central', marche: 'central', calendrier: cal, T6: T6 }).synthese;
  sc.retourParAge.forEach(function (a) { log(a.classe + ' | ' + k(a.deplaces) + ' | ' + pc(a.r1) + ' / ' + pc(a.r2) + ' / ' + pc(a.r5) + ' | ' + pc(a.retraiteSansRetour)); });
  log('');
  log('Gain net pour la société (Md€) selon la convention de valorisation : convention | 2029 | première année positive | cumul positif dès | cumul 2029-2040 | croisière (2045) | T6 gain réel net');
  principaux.forEach(function (c) {
    var s = R.simuler({ taille: c[0], marche: c[1], calendrier: cal, T6: T6 }).synthese;
    s.conventions.forEach(function (v) { log(c[2] + ' | ' + v.id + ' | ' + f1(v.an2029) + ' | ' + v.premiereAnneePositive + ' | ' + v.anneeCumulPositif + ' | ' + f1(v.cumule2040) + ' | ' + f1(v.croisiere) + ' | ' + f1(s.gainT6.gainReelNet)); });
  });
  log('');
});

log('## C. Grille taille T6 × marché (calendrier rapide) : déplacés ; budget net moyen 2029-2035 (Md€/an) ; production manquante cumulée (Md€) ; gain net cumulé 2029-2040, convention prudente (Md€)');
log('taille \\ marché | ' + R.MARCHES.join(' | '));
R.TAILLES.forEach(function (t) {
  log(t + ' | ' + R.MARCHES.map(function (m) { var s = R.simuler({ taille: t, marche: m, T6: T6 }).synthese; return k(s.deplaces) + ' ; ' + f2(s.coutBudgetaireNetMoyen2029_2035) + ' ; ' + f1(s.productionManquanteCumulee) + ' ; ' + f1(s.conventions[2].cumule2040); }).join(' | '));
});
log('');

log('## D. Politiques (taille et marché centraux, calendrier rapide sauf « étalement »)');
log('politique | déplacés | production manquante cumulée | budget net cumulé (dont coût de la politique) | perte des personnes | retraite sans retour');
var base = R.simuler({ taille: 'central', marche: 'central', T6: T6 }).synthese;
[['aucune', 'rapide'], ['formationCiblee', 'rapide'], ['mobilite', 'rapide'], ['toutes', 'rapide'], ['aucune', 'lent'], ['aucune', 'tres-lent'], ['toutes', 'lent']].forEach(function (p) {
  var r = R.simuler({ taille: 'central', marche: 'central', calendrier: p[1], politique: p[0], T6: T6 }), s = r.synthese;
  var coutPol = s.formationCumulee + r.annees.reduce(function (x, o) { return x + o.mobilite; }, 0);
  log(p[0] + ' / ' + p[1] + ' | ' + k(s.deplaces) + ' | ' + f1(s.productionManquanteCumulee) + ' (' + f1(s.productionManquanteCumulee - base.productionManquanteCumulee) + ') | ' +
    f1(s.coutBudgetaireNetCumule) + ' (' + f1(coutPol) + ') | ' + f1(s.pertePersonnesCumulee) + ' | ' + k(s.retraiteSansRetour));
});
log('');

log('## E. Montants à intégrer dans systeme-ideal [favorable, central, défavorable] (Md€/an, coût budgétaire net, + = coût ; calendrier de la bascule)');
var I = principaux.map(function (c) { return R.simuler({ taille: c[0], marche: c[1], T6: T6 }); });
log('coût net moyen 2029-2035 : [' + I.map(function (r) { return f2(r.synthese.coutBudgetaireNetMoyen2029_2035); }).join(' ; ') + ']');
log('coût brut moyen 2029-2035 (sans récupération sur les économies des clients) : [' + I.map(function (r) { return f2(r.synthese.coutBudgetaireBrutMoyen2029_2035); }).join(' ; ') + ']');
log('pic annuel net : [' + I.map(function (r) { return f2(r.synthese.picBudgetNet) + ' (' + r.synthese.anneePicBudget + ')'; }).join(' ; ') + ']');
log('coût net en 2040 (traîne) : [' + I.map(function (r) { return f2(r.synthese.coutBudgetaireNet2040); }).join(' ; ') + ']');
log('série annuelle nette 2029-2040 :');
I.forEach(function (r, i) { log('  ' + principaux[i][2] + ' : ' + r.annees.slice(0, 12).map(function (o) { return f2(o.coutBudgetaireNet); }).join(' ; ')); });
var L = principaux.map(function (c) { return R.simuler({ taille: c[0], marche: c[1], T6: T6, calendrier: 'lent' }); });
log('variante choc lent, coût net moyen 2029-2035 : [' + L.map(function (r) { return f2(r.synthese.coutBudgetaireNetMoyen2029_2035); }).join(' ; ') + '] ; pic : [' + L.map(function (r) { return f2(r.synthese.picBudgetNet); }).join(' ; ') + ']');
log('');
log('## F. Agents publics (sources/economies-effectifs-publics-ia.md) : non-remplacement, aucun licenciement');
[['bas', 3500, 0.03], ['central', 33000, 0.25], ['haut', 197000, 0.84]].forEach(function (p) { var dep = p[1] / p[2]; var x = R.publicNonRemplacement(p[1], dep / 10, 10); log(p[0] + ' : ' + k(p[1]) + ' postes non remplacés sur 10 ans = ' + pc(x.partDesDeparts) + ' des départs du vivier (source) ; déplacés : ' + x.deplaces); });
log('note : la source écrit aussi « ≈ 14 000 départs par an dans le vivier » (140 k sur 10 ans), incompatible avec 197 k = 84 % des départs (≈ 235 k) : à éclaircir (V9912).');
