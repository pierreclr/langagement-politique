// Rapport de la couche DECISIONS1111 (decisions_1111.js) : retraites de la loi de 2023 gardée (sans indexation sur l'espérance de vie, sans âge libre), entreprise d'État à 1 Md€ par an (11/11/2026).
// Charger : la liste de ponts.py (LISTE_SYSTEME, jusqu'à correction_0811.js), decisions_1111.js et ce fichier ; sortie dans resultats_decisions_1111.txt (qui fait foi).
var N = this.Decisions1111, C = this.Correction0811, G = this.Decisions0511g, ST = this.Stress, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 2 : n).replace('.', ','); }
function pc(x, n) { return f(100 * x, n === undefined ? 1 : n) + ' %'; }
var PIB = ST.ECO.pib0, AN = [2029, 2030, 2033, 2035, 2038, 2040, 2050, 2060];
log('# Décisions du 11/11/2026 (couche DECISIONS1111) : retraites de la loi de 2023 gardée, entreprise d\'État à 1 Md€ : résultats');
log('');
log('## 1. Dispositif retraites : avant (âge de référence indexé, âge libre au trimestre) et après (loi de 2023), Md€ de 2025 par an, central, + améliore le solde');
log('année | avant (net) | après (net) | dont pénibilité | dont indexation > 2 000 € | écart retraites | écart entreprise d\'État | écart total');
AN.forEach(function (y) { var c = N.composantes('central', y), d = N.deltaDetail('central', y); log(y + ' | ' + f(G.v6('central', y)) + ' | ' + f(N.v6('central', y)) + ' | ' + f(c.penibilite) + ' | ' + f(c.indexation) + ' | ' + f(d.retraites) + ' | ' + f(d.entrepriseEtat) + ' | ' + f(d.total)); });
log('aux trois scénarios en 2038 (favorable / central / défavorable) : avant ' + ['bas', 'central', 'haut'].map(function (sc) { return f(G.v6(sc, 2038), 1); }).join(' / ') + ' ; après ' + ['bas', 'central', 'haut'].map(function (sc) { return f(N.v6(sc, 2038), 1); }).join(' / '));
log('');
var a = C.s3(), b = N.s3(), p = N.prudente(), pa = C.prudente(), fx = N.s3(undefined, { F: a.F });
function jalon(s, y) { var i = y - 2029; return { dette: s.traj.ratio[i], deficit: s.traj.deficit[i], prim: s.traj.primaire[i] * PIB }; }
log('## 2. S3 recalibré (même règle : dette stable à partir de 2038, macro de référence, garantie à coût constant)');
log('leviers F : ' + f(b.F) + ' (avant : ' + f(a.F) + ') = fonction des revenus ' + f(b.revenus) + ' (avant ' + f(a.revenus) + ') + crédit d\'IS ' + f(b.credit) + ' (' + f(a.credit) + ') + transmissions ' + f(b.transmissions) + ' + patrimoine (suite) ' + f(b.patrimoineNat) + ' + courbe des pensions ' + f(b.pension) + ' + économies ' + f(b.eco));
log('coefficient a de la fonction des revenus : ' + f(b.a, 4) + ' (avant : ' + f(a.a, 4) + ')');
log('PO : ' + pc(b.po.pct) + ' (avant ' + pc(a.po.pct) + ') ; élargis ' + pc(b.po.elargisPct) + ' (avant ' + pc(a.po.elargisPct) + ')');
[2029, 2033, 2038, 2043, 2058].forEach(function (y) { var x = jalon(b, y), z = jalon(a, y); log('  ' + y + ' : dette ' + pc(x.dette) + ' (avant ' + pc(z.dette) + ') ; déficit ' + pc(x.deficit) + ' (avant ' + pc(z.deficit) + ') ; solde primaire ' + f(x.prim, 1) + ' Md€ (avant ' + f(z.prim, 1) + ')'); });
log('pic de dette : ' + pc(b.pic) + ' en ' + b.picAn + ' (avant ' + pc(a.pic) + ' en ' + a.picAn + ') ; déficit > 3 % jusqu\'en ' + b.dep3 + ' (avant ' + a.dep3 + ')');
log('macro prudente, mêmes leviers que la référence : dette 2038 ' + pc(b.trajPrudente.ratio[9]) + ' (avant ' + pc(a.trajPrudente.ratio[9]) + ') ; leviers à régler en prudente : F ' + f(p.F) + ' (avant ' + f(pa.F) + '), a ' + f(p.a, 4) + ' (avant ' + f(pa.a, 4) + ')');
log('');
log('## 3. Variante pour mémoire : leviers inchangés (F = ' + f(a.F) + ', non recalibré), c\'est-à-dire que l\'économie des retraites et de l\'entreprise d\'État améliore le solde au lieu de baisser les prélèvements');
[2029, 2033, 2038, 2043, 2058].forEach(function (y) { var x = jalon(fx, y), z = jalon(a, y); log('  ' + y + ' : dette ' + pc(x.dette) + ' (avant ' + pc(z.dette) + ') ; déficit ' + pc(x.deficit) + ' (avant ' + pc(z.deficit) + ') ; solde primaire ' + f(x.prim, 1) + ' Md€ (avant ' + f(z.prim, 1) + ')'); });
log('');
log('## 4. Saut de 2040-2041 (contrôle) : solde primaire de 2040 à 2041 : ' + f(N.saut(b, 2040).md) + ' Md€ (avant ' + f(C.saut(a, 2040).md) + ')');
var EX = { date: '2026-11-11', F: b.F, a: b.a, po: b.po.pct, avantF: a.F, avantA: a.a, avantPo: a.po.pct };
log('EXPORT ' + JSON.stringify(EX));
