// § 23 de resultats-optimum.txt : « v5.5 (décisions du 05/11 matin sur les grandes fortunes) ». Reproduction, depuis ce dossier :
//   jsc <liste de test_decisions_0511.js jusqu'à decisions_0511.js> decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js rapport_decisions_0511d.js
//   (la ligne finale JSON alimente sources/calculs/bilan_global.py)
var C = this.Decisions0511c, D = this.Decisions0511d, TP = this.TaxePatrimoine, Z = this.Optimum, SCS = D.SCS, log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function pc(x) { return (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',') + ' %'; }
function pc2(x) { return (Math.round(x * 10000) / 100).toFixed(2).replace('.', ',') + ' %'; }
function sg(x) { return (x > 0 ? '+' : '') + r2(x); }
function trip(f) { return SCS.map(f).join(' / '); }
function r(x) { return Math.round(x * 10000) / 10000; }
log('\n## 23. v5.5 (décisions du 05/11 au matin sur les grandes fortunes) : holdings, trusts, immobilier des sociétés, abattement chiffré (H780-H785, V13462-V13466)');
log('\n### 23.1 Ce que la v5.5 ajoute à la v5.4 (Md€/an, croisière ; bas = favorable / central / haut = défavorable ; + améliore le solde)');
log('| ligne | ' + 'favorable / central / défavorable | preuve |');
log('|---|---|---|');
log('| Taxe de 2 % sur les actifs passifs des holdings (assiette 75 / 62,5 / 50 Md€, évitement 20 / 35 / 60 %, fuite 2 / 5 / 10 %) | ' + trip(function (s) { return sg(D.holdings(s).net); }) + ' | C |');
log('| Trusts et sociétés civiles patrimoniales (coût non publié, estimation HG36) | ' + trip(function (s) { return sg(D.trusts(s).gain); }) + ' | C |');
log('| Immobilier détenu par sociétés : transparence (part des SCI 20 / 15 / 10 % des non-cotés ; dettes 30 / 20 / 10 %) | ' + trip(function (s) { return sg(D.immoSocietes(s).gain); }) + ' | C |');
log('| **Total** | **' + trip(function (s) { return sg(D.somme(s)); }) + '** | |');
log('| *Variante holdings avec crédit de la taxe de 1 % déjà payée sur ces actifs* | ' + trip(function (s) { return sg(D.holdings(s).avecCredit); }) + ' | |');
log('\n### 23.2 Solde et taux d\'équilibre');
log('| | v5.4 | v5.5 (sans abattement) | v5.5 + abattement 50 000 € par adulte | v5.5 + abattement 100 000 € par adulte |');
log('|---|---|---|---|---|');
log('| solde à 42 % (favorable / central / défavorable) | ' + trip(function (s) { return sg(C.solde(null, s, false)); }) + ' | ' + trip(function (s) { return sg(D.solde(s)); }) + ' | ' + trip(function (s) { return sg(D.solde(s, 50000)); }) + ' | ' + trip(function (s) { return sg(D.solde(s, 100000)); }) + ' |');
var te54 = C.tauxEquilibreFin(false), te55 = D.tauxEquilibreFin(), te50 = D.tauxEquilibreFin(50000), te100 = D.tauxEquilibreFin(100000);
log('| taux d\'équilibre central (centième de point) | ' + pc2(te54) + ' | **' + pc2(te55) + '** | ' + pc2(te50) + ' | ' + pc2(te100) + ' |');
log('Un point de taux plat vaut 10,40 Md€. **Le solde v5.5 ne contient PAS d\'abattement** : la décision du 05/11 est de le chiffrer, pas de l\'adopter.');
log('\n### 23.3 Immobilier détenu par des sociétés : décomposition (Md€/an, central)');
var im = D.immoSocietes('central');
log('Capitaux propres des SCI détenues par les ménages : ' + r1(im.S0) + ' Md€ (15 % des 1 483 Md€ de non-cotés) ; immobilier sous-jacent brut des dettes : ' + r1(im.brutSousJacent) + ' Md€. Recette aujourd\'hui (traité comme des non-cotés) : ' + r2(im.avant) + ' ; recette corrigée (transparence) : ' + r2(im.apres) + ' ; **gain ' + sg(im.gain) + '** ; part des plafonds existants déduite : ' + pc(im.partPlafonds) + '.');
var sens = [0, 0.05, 0.10, 0.15, 0.20, 0.30].map(function (p) { return 'SCI ' + pc(p) + ' : ' + sg(D.immoSocietes('central', { partSCI: p }).gain); }).join(' ; ');
log('Sensibilité à la part des SCI (central) : ' + sens + '.');
log('\n### 23.4 Abattement sur l\'assiette de la taxe de 1 % (coût par le modèle complet, Md€/an ; favorable / central / défavorable)');
log('| abattement | par ménage (1,7 adulte) | coût | dont recette brute | dont paiement différé en moins | autres lignes (plafonds, etc.) | ménages qui ne paient plus rien |');
log('|---|---|---|---|---|---|---|');
[50000, 100000].forEach(function (m) {
  var c = D.abattement('central', m), ex = D.exoneres(c.parMenage), exS = D.exoneres(m), exC = D.exoneres(2 * m);
  log('| ' + m + ' € par adulte | ' + c.parMenage + ' € | ' + trip(function (s) { return r1(D.abattement(s, m).cout); }) + ' | ' + r1(c.brute) + ' | ' + r2(c.differe) + ' | ' + r2(c.autresLignes) + ' | ' + r1(ex.total / 1e6) + ' M (' + pc(ex.partTotale) + ') ; personne seule ' + r1(exS.total / 1e6) + ' M ; couple ' + r1(exC.total / 1e6) + ' M |');
});
var P = D.parDecile(D.parMenage(100000)), P5 = D.parDecile(D.parMenage(50000));
log('\n### 23.5 Effet par décile de patrimoine brut (€ par ménage et par an, taxe de 1 % statique sur l\'enquête HVP, avant comportements ; abattement 100 000 € par adulte = 170 000 € par ménage ; variante 50 000 € entre parenthèses)');
log('| décile | patrimoine brut moyen | taxe avant | taxe après | gain | part des gains | part exonérée |');
log('|---|---|---|---|---|---|---|');
P.forEach(function (x, k) { log('| ' + x.decile + ' | ' + Math.round(x.patrimoineBrutMoyen) + ' € | ' + Math.round(x.impotAvant) + ' € | ' + Math.round(x.impotApres) + ' € | ' + Math.round(x.gainMoyen) + ' € (' + Math.round(P5[k].gainMoyen) + ' €) | ' + pc(x.partDesGains) + ' (' + pc(P5[k].partDesGains) + ') | ' + pc(x.partSansTaxe) + ' (' + pc(P5[k].partSansTaxe) + ') |'); });
var out = { holdings: {}, trusts: {}, immo: {}, abattement: {}, solde55: {}, solde54: {}, te54: r(te54), te55: r(te55), te50: r(te50), te100: r(te100), cout100: r(D.abattement('central', 100000).cout), cout50: r(D.abattement('central', 50000).cout) };
SCS.forEach(function (s) { out.holdings[s] = r(D.holdings(s).net); out.trusts[s] = r(D.trusts(s).gain); out.immo[s] = r(D.immoSocietes(s).gain); out.solde55[s] = r(D.solde(s)); out.solde54[s] = r(C.solde(null, s, false)); });
var taux = []; for (var k = 400; k <= 440; k += 4) taux.push(k / 1000);
out.grille_v55 = D.grille(0, taux);
log('\nJSON ' + JSON.stringify(out));
