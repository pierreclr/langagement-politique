var Q = (typeof CCR !== 'undefined') ? CCR : require('./modele.js');
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function proche(a, b, t) { return Math.abs(a - b) <= t; }
ok(proche(Q.facteurRente(0, 22), 22, 1e-12) && Q.facteurRente(0.03, 22) < 22, 'facteur de rente');
// s = 0 : rien ne bouge
var z0 = Q.doubleCharge({ smax: 0 });
ok(z0.lignes.every(function (l) { return Math.abs(l.D) < 1e-9 && Math.abs(l.fonds) < 1e-9; }), 's = 0 : double charge et fonds nuls');
ok(proche(Q.remplacement({ smax: 0 }, 2060).rapport, 1, 1e-12), 's = 0 : pension = répartition');
// taux nuls : régime permanent sans double charge, fonds = cumul
var zz = Q.doubleCharge({ smax: 0.1, r: 0, rho: 0, dette: 0, annees: 130 });
ok(proche(zz.lignes[129].D, 0, 1e-6), 'taux nuls : double charge nulle en régime permanent');
ok(proche(zz.lignes[129].fonds, zz.lignes[129].cumulD, 1e-6), 'taux nuls : fonds = cumul de la double charge (rien ne se crée)');
// première année : s(2027) = smax/montee, soit 1 % de F
var c = Q.doubleCharge({ smax: 0.1 });
ok(proche(c.lignes[0].verse, 0.01 * c.lignes[0].F, 1e-9), 'montée linéaire : 1 % la première année');
ok(proche(c.lignes[0].F, 432, 4), 'F(2027) ≈ 432 Md€ (14,2 % du PIB 2027)');
// ordres de grandeur T48 : 3 points ≈ 10,8 % -> pic ≈ 45 Md€
ok(c.resume.picMdE > 30 && c.resume.picMdE < 60, 'pic à 10 % : 30-60 Md€ (T48 : ≈ 45 pour 3 points)');
var c20 = Q.doubleCharge({ smax: 0.2 });
ok(c20.resume.picMdE > 1.8 * c.resume.picMdE && c20.resume.picMdE < 2.2 * c.resume.picMdE, '20 % ≈ double de 10 %');
// r = rho et rente sans prudence : pension identique
ok(proche(Q.remplacement({ smax: 0.1, r: 0.006, rho: 0.006, ecartRentePrudence: 0 }, 2060).rapport, 1, 1e-9), 'r = ρ : aucun gain ni perte de pension');
ok(Q.remplacement({ smax: 0.1, scenario: 'central' }, 2060).rapport > 1, 'central : pension mixte > répartition');
ok(Q.remplacement({ smax: 0.1, scenario: 'central' }, 2060, { krachPerte: 0.3 }).rapport < Q.remplacement({ smax: 0.1 }, 2060).rapport, 'un krach réduit la pension');
ok(Q.remplacement({ smax: 0.1, r: 0.0083 }, 2060).rapport < Q.remplacement({ smax: 0.1, r: 0.035 }, 2060).rapport, 'rendement : monotone');
// krach du fonds : le fonds baisse
var ck = Q.doubleCharge({ smax: 0.1, choc: { annee: 2045, perte: 0.3 } });
ok(ck.lignes[40].fonds < c.lignes[40].fonds, 'krach 2045 : fonds plus bas en 2067');
// démographie : plus de cotisants, plus de pension de répartition ; le mixte est moins sensible
var d1 = Q.demographie({ smax: 0.2 }, 1.1, 1.41), d2 = Q.demographie({ smax: 0.2 }, 1.8, 1.41);
ok(d2.repartition > d1.repartition && (d2.mixte - d1.mixte) < (d2.repartition - d1.repartition), 'le mixte dépend moins de la démographie');
// mérite : parts somment à 1 ; plancher = égalité
var m = Q.merite([1, 2, 3, 4], 0.4); ok(proche(m.reduce(function (a, b) { return a + b; }, 0), 1, 1e-12), 'mérite : somme = 1');
ok(Q.merite([1, 9], 1).every(function (x) { return proche(x, 0.5, 1e-12); }), 'plancher 100 % = égalité');
// TRI
ok(proche(Q.tri(0.6, 0, 2, 0), 0.1306, 2e-3) , 'TRI de 0,6 deux ans = 13,06 %');
ok(proche(Q.tri(1, 0, 1, 0), 0, 1e-9), 'TRI : EBITDA = capex en un an -> 0 %');
ok(Q.tri(0.25, 0.3, 6, 0) < Q.tri(0.25, 0, 6, 0), 'TRI baisse avec la baisse des prix');
ok(proche(Q.capitalPourDividende(100, 68.6, 0.04), 2058, 1), 'T51 : 100 €/mois à 4 % = 2 058 Md€');
var mc = Q.monteCarlo({ smax: 0.1 }, 2060, 800); ok(mc.p5 < mc.p50 && mc.p50 < mc.p95, 'Monte-Carlo ordonné');
log('tous les contrôles passent');
