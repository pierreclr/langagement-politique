// Exporte la loi des héritages reçus à vie de modeles/capital-de-depart/ (modele.js, continu.js, non modifiés) vers donnees/heritages.json.
// Écrit par Claude (IA d'Anthropic) pour l'auteur, 09/11/2026. Lancer depuis la racine de l'atelier :
//   node modeles/capital-de-depart-options/code/exporter_heritages.js
var path = require('path'), fs = require('fs');
var CD = require(path.join(__dirname, '..', '..', 'capital-de-depart', 'modele.js'));
var CDC = require(path.join(__dirname, '..', '..', 'capital-de-depart', 'continu.js'));
var N = 200, out = { note: 'Héritage reçu à vie (€) au rang u = (i + 0,5) / ' + N + ' ; loi log-normale H2 de modeles/capital-de-depart (médiane 70 000 €, P90 500 000 €) ; p0 = part sans héritage (H3).', n: N, quantiles: {}, reference: {} };
[0, 0.1, 0.2].forEach(function (p0) {
  var p = CD.params({ p0: p0 }), q = [], i;
  for (i = 0; i < N; i++) q.push(CD.quantileH(p, (i + 0.5) / N));
  out.quantiles[String(p0)] = q;
});
// Coût de référence du chapitre 3 : 40 000 € × e^(−H / 80 000 €), [favorable, central, défavorable], Md€ par an
out.reference.cout_exp_K80000 = CDC.coutCapital({ forme: 'exp', K: 80000 });
out.reference.cohorte = CD.BASE.cohorte;
fs.writeFileSync(path.join(__dirname, '..', 'donnees', 'heritages.json'), JSON.stringify(out));
console.log('donnees/heritages.json écrit ; coût de référence (Md€) : ' + out.reference.cout_exp_K80000.map(function (x) { return x.toFixed(2); }).join(' / '));
