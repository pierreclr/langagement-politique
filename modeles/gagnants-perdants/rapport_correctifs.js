/*
 * modeles/gagnants-perdants/rapport_correctifs.js — tableaux des correctifs « ne perdre personne » (03/11/2026). Depuis modeles/gagnants-perdants/ :
 *   jsc ../systeme-ideal/modele.js ../systeme-ideal/fiscalite_actuelle.js ../systeme-ideal/voies.js ../systeme-ideal/sante.js ../systeme-ideal/optimisation.js ../systeme-ideal/retraites2.js \
 *       ../systeme-ideal/palier1.js ../systeme-ideal/patrimoine_financier.js ../systeme-ideal/deces_realisation.js ../systeme-ideal/options_financement.js \
 *       cas_types_donnees.js droit_actuel.js modele.js palier1.js correctifs.js rapport_correctifs.js > resultats-correctifs.txt
 */
var C = this.Correctifs;
var log = (typeof print === 'function') ? print : console.log;
function n0(x) { var v = Math.round(x); return (v < 0 ? '−' : '') + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function n1(x) { var v = Math.round(x * 10) / 10; return (v < 0 ? '−' : '') + String(Math.abs(v).toFixed(1)).replace('.', ','); }
function sg(x) { return (x >= 0 ? '+' : '') + n0(x); }
function trip(o) { return n1(o.bas) + ' / ' + n1(o.central) + ' / ' + n1(o.haut); }
function M1(x) { return n1(x / 1e6) + ' M'; }
var CH = [['palier1', 'Palier 1'], ['c4', 'Chemin 4 (45 %, 400 €)']];
var B = C.HYP.bonusMax;
log('# Correctifs « ne perdre personne » (modeles/gagnants-perdants/correctifs.js, 03/11/2026)\n');
log('Coûts en Md€ par an (bas / central / haut), croisière statique. Bonus d\'activité (c) : ' + B + ' €/mois au plateau (de 0,5 à 1 Smic brut), éteint à 1,6 Smic. ⚠️ H450-H459.\n');

log('## 1. Coûts de chaque correctif seul\n');
var a = ['bas', 'central', 'haut'].map(C.coutA), b = ['bas', 'central', 'haut'].map(C.coutB);
log('| correctif | chemin | coût Md€/an (bas / central / haut) | ménages concernés (central) |'); log('|---|---|---|---|');
log('| (a) aides au logement des retraités | tous | ' + trip({ bas: a[0].md, central: a[1].md, haut: a[2].md }) + ' | ' + M1(a[1].menages) + ' (' + M1(a[0].menages) + ' à ' + M1(a[2].menages) + ') |');
log('| (b) majoration parent isolé (ASF 200,78 €/enfant ; haut : 300 €) | tous | ' + trip({ bas: b[0].md, central: b[1].md, haut: b[2].md }) + ' | ' + M1(b[1].menages) + ' familles (' + M1(b[0].menages) + ' en bas) |');
CH.forEach(function (c) {
  var x = C.coutC(c[0], undefined, B), y = C.coutC(c[0], undefined, 100), z = C.coutC(c[0], undefined, B, 1.3), bs = C.bonusNeutralisantSmicard(c[0]), w = C.coutC(c[0], undefined, bs || 1);
  log('| (c) bonus d\'activité 200 €, éteint à 1,6 Smic | ' + c[1] + ' | ' + trip(x) + ' | ' + M1(x.beneficiaires) + ' adultes |');
  log('| (c) variante : 100 €, éteint à 1,6 Smic | ' + c[1] + ' | ' + trip(y) + ' | ' + M1(y.beneficiaires) + ' adultes |');
  log('| (c) variante : 200 €, éteint à 1,3 Smic | ' + c[1] + ' | ' + trip(z) + ' | ' + M1(z.beneficiaires) + ' adultes |');
  log('| (c) variante : bonus qui annule la perte du smicard (' + n0(bs) + ' €) | ' + c[1] + ' | ' + (bs ? trip(w) : 'sans objet (le smicard gagne déjà)') + ' | ' + (bs ? M1(w.beneficiaires) + ' adultes' : '—') + ' |');
});
CH.slice(0, 1).forEach(function (c) {
  var q = C.coutC(c[0], undefined, B, undefined, 5);
  log('| (c) variante ciblée : 200 €, réservé aux cinq premiers dixièmes de niveau de vie (ressources du ménage) | tous | ' + trip(q) + ' | ' + M1(q.beneficiaires) + ' adultes |');
});
CH.forEach(function (c) {
  var d = C.coutDlignes(c[0], undefined, 'central'), dd = C.coutD(c[0]);
  log('| (d) plancher « pas moins qu\'aujourd\'hui », pendant la garantie | ' + c[1] + ' | ' + trip({ bas: dd.bas, central: dd.central, haut: dd.haut }) + ' | ' + M1(d.menages) + ' ménages |');
  [3, 5].forEach(function (N) { log('| (d) idem, moyenne annuelle sur 10 ans d\'une garantie de ' + N + ' ans | ' + c[1] + ' | ' + trip({ bas: C.moyenne10(dd.bas, N), central: C.moyenne10(dd.central, N), haut: C.moyenne10(dd.haut, N) }) + ' | ' + M1(d.menages) + ' ménages |'); });
});
CH.forEach(function (c) {
  var t = {}; C.SCS.forEach(function (sc) { t[sc] = C.coutDlignes(c[0], undefined, sc, { d: 1, dPlafond: 1.6 }).total; });
  var d = C.coutDlignes(c[0], undefined, 'central', { d: 1, dPlafond: 1.6 });
  log('| (d) variante ciblée : seuls les salaires jusqu\'à 1,6 Smic brut sont garantis, pendant la garantie | ' + c[1] + ' | ' + trip(t) + ' | ' + M1(d.menages) + ' ménages |');
});
log('\nDécomposition de (d), central, Md€/an : adultes seuls sans enfant / parents isolés / couples à un salaire avec enfants / retraités locataires\n');
log('| chemin | seuls | parents isolés | couples monoactifs | retraités | total |'); log('|---|---|---|---|---|---|');
CH.forEach(function (c) { var d = C.coutDlignes(c[0], undefined, 'central'); log('| ' + c[1] + ' | ' + n1(d.seuls) + ' | ' + n1(d.parents) + ' | ' + n1(d.couples) + ' | ' + n1(d.retraites) + ' | ' + n1(d.total) + ' |'); });

log('\n## 2. Combinaisons (coût en Md€/an, bas / central / haut)\n');
var COMB = [['(a)', { a: 1 }], ['(b)', { b: 1 }], ['(c) complet', { c: true }], ['(c) ciblé D1-D5', { c: true, ck: 5 }], ['(a) + (b)', { a: 1, b: 1 }], ['(a) + (b) + (c) ciblé', { a: 1, b: 1, c: true, ck: 5 }],
  ['(d) seul', { d: 1 }], ['(d) seul, jusqu\'à 1,6 Smic', { d: 1, dp: 1.6 }], ['(a) + (b) + (c) ciblé + (d) résiduel jusqu\'à 1,6 Smic', { a: 1, b: 1, c: true, ck: 5, d: 1, dp: 1.6 }],
  ['(a) + (b) + (c) complet + (d) résiduel (tout)', { a: 1, b: 1, c: true, d: 1 }]];
function coutComb(ch, k) {
  var s = {}; C.SCS.forEach(function (sc) {
    var v = 0;
    if (k.a) v += C.coutA(sc).md; if (k.b) v += C.coutB(sc).md;
    if (k.c) v += (k.ck ? C.coutC(ch, undefined, B, undefined, k.ck) : C.coutC(ch, undefined, B))[sc];
    if (k.d) v += C.coutDlignes(ch, undefined, sc, { a: k.a, b: k.b, c: k.c, cKmax: k.ck, d: 1, dPlafond: k.dp }).total;
    s[sc] = v;
  });
  return s;
}
log('| combinaison | palier 1 | chemin 4 |'); log('|---|---|---|');
COMB.forEach(function (c) { log('| ' + c[0] + ' | ' + trip(coutComb('palier1', c[1])) + ' | ' + trip(coutComb('c4', c[1])) + ' |'); });
log('\nPour (c) seul, bas et haut sont les extrêmes sur trois dispersions des revenus ; pour (d) les trois scénarios font varier la dispersion, la part de locataires, les pertes des parents isolés et la part de couples à un salaire (H454-H457).\n');

log('## 3. Ce qu\'il faut ajouter au trou de financement de chaque chemin (solde de croisière, Md€/an, bas / central / haut)\n');
log('Un solde négatif est un déficit à financer en plus. « Ciblé » : bonus (c) réservé aux cinq premiers dixièmes ; (d) limité aux salaires jusqu\'à 1,6 Smic brut. « Tout » : bonus (c) à tous, (d) sans plafond. Les coûts (c) et (d) sont calculés au taux et au socle du chemin.\n');
log('| chemin | solde sans correctif | + (a) + (b) | + (a) + (b) + (c) ciblé | + (a) + (b) + (c) ciblé + (d) jusqu\'à 1,6 Smic | tout (c complet, (d) sans plafond) | + (d) seul |'); log('|---|---|---|---|---|---|---|');
['palier1', 'c1', 'c2', 'c3', 'c4'].forEach(function (id) {
  var chm = id === 'c3' ? 'c2' : id, so = C.soldeChemin(id), f = function (k) { var c = coutComb(chm, k); return trip({ bas: so.bas - c.bas, central: so.central - c.central, haut: so.haut - c.haut }); };
  log('| ' + C.CHEMINS_SOLDE[id].libelle + ' | ' + trip(so) + ' | ' + f({ a: 1, b: 1 }) + ' | ' + f({ a: 1, b: 1, c: true, ck: 5 }) + ' | ' + f({ a: 1, b: 1, c: true, ck: 5, d: 1, dp: 1.6 }) + ' | ' + f({ a: 1, b: 1, c: true, d: 1 }) + ' | ' + f({ d: 1 }) + ' |');
});
log('\nLe chemin 3 emploie les paramètres du chemin 2 pour les gagnants et perdants (même taux plat et même socle : seul l\'héritage diffère).\n');

log('## 4. Cas types avec chaque correctif (€/mois, écart au droit actuel)\n');
CH.forEach(function (c) {
  log('### ' + c[1] + '\n');
  var cols = [['sans', {}], ['(a)', { a: 1 }], ['(b)', { b: 1 }], ['(c)', { c: true }], ['(a)+(b)+(c)', { a: 1, b: 1, c: true }], ['+ (d) sans plafond', { a: 1, b: 1, c: true, d: 1 }]];
  var t = cols.map(function (k) { return C.casTypes(c[0], undefined, k[1]); });
  log('| cas type | ' + cols.map(function (k) { return k[0]; }).join(' | ') + ' |'); log('|---|' + cols.map(function () { return '---'; }).join('|') + '|');
  t[0].forEach(function (x, i) { log('| ' + x.libelle + ' | ' + t.map(function (r) { return sg(r[i].ecartMois); }).join(' | ') + ' |'); });
  log('');
});

log('## 5. Dixièmes (€ par UC et par mois, central)\n');
CH.forEach(function (c) {
  log('### ' + c[1] + '\n');
  var cols = [['sans', {}], ['(a)', { a: 1 }], ['(b)', { b: 1 }], ['(c)', { c: true }], ['(a)+(b)+(c)', { a: 1, b: 1, c: true }], ['+ (d)', { a: 1, b: 1, c: true, d: 1 }]];
  var t = cols.map(function (k) { return C.decilesCorriges(c[0], undefined, k[1]); });
  log('| dixième | ' + cols.map(function (k) { return k[0]; }).join(' | ') + ' |'); log('|---|' + cols.map(function () { return '---'; }).join('|') + '|');
  for (var i = 0; i < 10; i++) log('| D' + (i + 1) + ' | ' + t.map(function (r) { return sg(r[i].ecart); }).join(' | ') + ' |');
  log('');
});
log('(a) est réparti comme les aides au logement actuelles, (b) comme les prestations familiales (proxy ⚠️ H458), (c) et (d) selon la quadrature de la dispersion (H441).\n');

log('## 6. Taux marginal effectif d\'un adulte seul sans enfant (%, par multiple du Smic brut)\n');
var XS = [0.25, 0.5, 0.75, 1, 1.3, 1.6, 2, 3];
log('| configuration | ' + XS.map(function (x) { return x + ' Smic'; }).join(' | ') + ' |'); log('|---|' + XS.map(function () { return '---'; }).join('|') + '|');
CH.forEach(function (c) {
  log('| ' + c[1] + ', sans correctif | ' + XS.map(function (x) { return n0(100 * C.tauxMarginal(c[0], undefined, 0, x)); }).join(' | ') + ' |');
  log('| ' + c[1] + ', avec (c) 200 € éteint à 1,6 Smic | ' + XS.map(function (x) { return n0(100 * C.tauxMarginal(c[0], undefined, B, x)); }).join(' | ') + ' |');
  log('| ' + c[1] + ', avec (c) 200 € éteint à 1,3 Smic | ' + XS.map(function (x) { return n0(100 * C.tauxMarginal(c[0], undefined, B, x, 1.3)); }).join(' | ') + ' |');
});
log('\n(a) et (b) sont forfaitaires : aucun effet sur le taux marginal (l\'aide au logement des retraités garde sa dégressivité actuelle ⚠️ non chiffrée). (d), s\'il est calculé « pas moins qu\'aujourd\'hui » sur le revenu courant, vaut 100 % de taux marginal sur toute la plage de perte ;');
log('plage de perte d\'un adulte seul sans enfant, locataire à 50 % (en multiples du Smic brut) :');
CH.forEach(function (c) { var z = C.zonePerte(c[0], undefined, 0.5); log('- ' + c[1] + ' : ' + (z.lo === null ? 'aucune' : 'de ' + n1(z.lo) + ' à ' + n1(z.hi) + ' Smic')); });
