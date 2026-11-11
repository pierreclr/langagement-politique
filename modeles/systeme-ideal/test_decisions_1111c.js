// Tests de la couche DECISIONS1111C (decisions_1111c.js). Charger la liste de ponts.py (jusqu'à decisions_1111b.js), patrimoine_balayage_1111c.js, decisions_1111c.js puis ce fichier (jsc, lancé depuis modeles/systeme-ideal).
var C = this.Decisions1111C, B = this.Decisions1111B, log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
// 1. la série recopiée est celle du fichier du grand ménage (jsc sait lire ; sinon le contrôle est signalé)
if (typeof read === 'function') {
  var J = JSON.parse(read('../grand-menage/donnees/serie_2028_2038.json'));
  ['bas', 'central', 'haut'].forEach(function (s) { C.SERIE[s].forEach(function (v, i) { proche(v, J.scenarios[s].net_additionnel[i], 1e-12, 'série ' + s + ' ' + (2028 + i) + ' identique au JSON'); }); });
  ok(JSON.stringify(J.annees) === JSON.stringify(C.ANNEES), 'mêmes années que le JSON');
} else log('(lecture du JSON indisponible : comparaison de la série non faite)');
proche(C.grandMenage('central', 2027), 0, 1e-12, 'avant 2028 : 0'); proche(C.grandMenage('central', 2032), -1.004, 1e-12, 'central 2032'); proche(C.grandMenage('central', 2038), 1.92, 1e-12, 'central 2038');
proche(C.grandMenage('haut', 2045), 9.42, 1e-12, 'après 2038 : valeur de 2038 gardée (HG3)');
// 2. branchement : même s3 de DECISIONS1111B, plus la série
var r = C.s3(), b = B.s3(), z = C.s3(undefined, { grandMenage: 'aucun' });
proche(r.F, b.F, 1e-9, 'leviers F inchangés (pas de recalibrage)'); proche(r.a, b.a, 1e-12, 'coefficient a inchangé');
for (var y = 2029; y <= 2038; y++) { proche(z.trajC.deficit[y - 2029], b.traj.deficit[y - 2029], 1e-12, 'sans grand ménage : trajectoire de DECISIONS1111B identique ' + y); }
ok(r.sans.deficit[3] === b.traj.deficit[3], 'trajectoire de référence conservée telle quelle');
// 3. effet sur le déficit : signe de la série (central : −1,0 Md€ en 2032, +1,9 Md€ en 2038) ; haut plus favorable que central en 2038, bas moins
var d32 = C.deficit(r, 2032), d38 = C.deficit(r, 2038); ok(d32.avec > d32.sans, 'central 2032 : déficit un peu plus haut (coût de transition) : ' + (100 * d32.avec).toFixed(3) + ' % contre ' + (100 * d32.sans).toFixed(3) + ' %');
ok(d38.avec < d38.sans, 'central 2038 : déficit plus bas : ' + (100 * d38.avec).toFixed(3) + ' % contre ' + (100 * d38.sans).toFixed(3) + ' %');
var rh = C.s3(undefined, { grandMenage: 'haut' }), rb = C.s3(undefined, { grandMenage: 'bas' });
ok(C.deficit(rh, 2038).avec < d38.avec && d38.avec < C.deficit(rb, 2038).avec + 1e-12, 'déficit 2038 : haut < central ≤ bas');
// ordre de grandeur : Md€ → part du PIB (≈ 3 000 Md€) : 1,92 Md€ ≈ 0,06 point
var dpt = (d38.sans - d38.avec) * 100; ok(dpt > 0.04 && dpt < 0.09, 'gain 2038 central ≈ 0,06 point de PIB : ' + dpt.toFixed(3));
// 4. paramètre de taux du patrimoine : sans effet par défaut, avec effet seulement si choisi
ok(C.ecartPatrimoine({}) === 0 && C.ecartPatrimoine({ tauxPatrimoine: null }) === 0, 'sans taux choisi : écart nul');
var p = C.s3(undefined, { grandMenage: 'aucun', tauxPatrimoine: 0.0125 }); ok(p.ecartPatrimoine < -30, 'taux 1,25 % : écart de recette nette négatif vs v7.5 à 3 % : ' + p.ecartPatrimoine.toFixed(1) + ' Md€');
ok(p.trajC.deficit[3] > z.trajC.deficit[3] + 0.01, 'taux 1,25 % : déficit 2032 plus haut (les leviers F ne sont pas recalibrés)');
var p0 = C.s3(undefined, { grandMenage: 'aucun', tauxPatrimoine: 0.0125, anneePatrimoine: 2035 }); proche(p0.trajC.deficit[3], z.trajC.deficit[3], 1e-12, 'écart patrimoine appliqué seulement à partir de l\'année choisie');
ok(C.sous3(r) === null || (C.sous3(r) >= 2029 && C.sous3(r) <= 2058), 'année de passage sous 3 % : ' + C.sous3(r));
log('Tests : ' + n + ' vérifications passées.');
