// Tests de capitalisation.js (T48). Lancer depuis modeles/retraites/ :
//   jsc capitalisation.js test_capitalisation.js
//   (macOS : /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc) ou : node test_capitalisation.js
// N'altère pas test_modele.js (qui teste modele.js, T13).
var Q = this.RetraitesCapi || (typeof require !== 'undefined' ? require('./capitalisation.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function proche(a, b, tol) { return Math.abs(a - b) <= tol; }

ok(proche(Q.facteurRente(0, 22), 22, 1e-12), 'facteur de rente à taux nul = D');
ok(Q.facteurRente(0.02, 22) < 22 && Q.facteurRente(0.02, 22) > Q.facteurRente(0.05, 22), 'facteur de rente décroît avec le taux');

// Profil de points
var ph = Q.profilPoints(6, 3);
ok(ph(0) === 1 && ph(2) === 1 && ph(3) === 2 && ph(15) === 6 && ph(60) === 6 && ph(-1) === 0, 'profil : +1 point tous les 3 ans, plafonné à phiMax');
ok(Q.profilPoints(1, 3)(40) === 1, 'profil à 1 point : constant');

// Double charge : régime permanent à taux nuls (cohortes complètes) → double charge nulle
var z = Q.doubleCharge({ phiMax: 3, scenario: 'central', r: 0, g: 0, rho: 0, i: 0, annees: 100 });
ok(proche(z.lignes[99].doubleChargeMdE, 0, 1e-9), 'taux nuls : double charge nulle en régime permanent (t ≥ 6 + 40 + 22)');
ok(proche(z.lignes[0].doubleChargeMdE, 14.665, 1e-9), 'première année : 1 point = 14,665 Md€');
var cumulFinal = z.lignes[99].cumulMdE;
ok(cumulFinal > 0 && proche(z.lignes[99].fondsMdE, cumulFinal, 1e-6), 'à taux nuls : fonds = cumul de la double charge (rien ne se crée)');

// Fonds jamais négatif ; part des pensions servies par le fonds croissante
var c3 = Q.doubleCharge({ phiMax: 3, scenario: 'central', annees: 90 });
ok(c3.lignes.every(function (l) { return l.fondsMdE >= -1e-9; }), 'le fonds n\'est jamais négatif');
ok(c3.lignes[89].partPensionsServieParFonds > c3.lignes[40].partPensionsServieParFonds && c3.lignes[40].partPensionsServieParFonds > c3.lignes[10].partPensionsServieParFonds, 'part des pensions servie par le fonds : croissante');
ok(c3.lignes[89].partPensionsServieParFonds > 3 / 27.8 && c3.lignes[89].partPensionsServieParFonds < 0.3, 'en croisière, 3 points servent plus que 3/27,8 = 10,8 % des pensions (r > ρ), mais moins de 30 %');
var zc = Q.doubleCharge({ phiMax: 3, r: 0, g: 0, rho: 0, i: 0, annees: 100 });
ok(proche(zc.lignes[99].partPensionsServieParFonds, 3 * 14.665 / 422.2, 0.003), 'à taux nuls : 3 points servent 3 × 14,665 / 422,2 = 10,4 % des pensions')
var c1 = Q.doubleCharge({ phiMax: 1, scenario: 'central' }).resume, c6 = Q.doubleCharge({ phiMax: 6, scenario: 'central' }).resume;
ok(c1.picMdE < c3.resume.picMdE && c3.resume.picMdE < c6.picMdE, 'plus de points → pic de double charge plus haut');
ok(proche(c3.resume.picMdE, 45, 3) && proche(c6.picMdE, 91, 5), 'ordres de grandeur du calcul T48 (44-45 et 83-91 Md€/an)');
ok(c6.fonds30MdE > c3.resume.fonds30MdE && c3.resume.fonds30MdE > c1.fonds30MdE, 'fonds à 30 ans croissant avec les points');
var hi = Q.doubleCharge({ phiMax: 3, scenario: 'haut' }).resume, lo = Q.doubleCharge({ phiMax: 3, scenario: 'bas' }).resume;
ok(hi.fonds60MdE > c3.resume.fonds60MdE && c3.resume.fonds60MdE > lo.fonds60MdE, 'fonds à 60 ans : haut > central > bas');
ok(lo.net60MdE < 0 && hi.net60MdE > 0, 'actif net (fonds − dette) à 60 ans : négatif au bas, positif au haut');

// Identité de Sinn : si r = ρ, la valeur actualisée de la double charge est nulle ; si r > ρ, elle est égale au gain des retraités
var T = 400, sn = Q.doubleCharge({ phiMax: 3, r: 0.01, g: 0, rho: 0.01, i: 0.01, annees: T }), pv = 0, pvVerse = 0, k;
for (k = 0; k < T; k++) { pv += sn.lignes[k].doubleChargeMdE / Math.pow(1.01, k); pvVerse += sn.lignes[k].verseFondsMdE / Math.pow(1.01, k); }
ok(Math.abs(pv) < 0.02 * pvVerse, 'identité de Sinn : r = ρ → valeur actualisée de la double charge ≈ 0 (' + (100 * pv / pvVerse).toFixed(2) + ' % des versements)');
var sn2 = Q.doubleCharge({ phiMax: 3, r: 0.035, g: 0, rho: 0.006, i: 0.035, annees: T }), pv2 = 0, pvG = 0;
for (k = 0; k < T; k++) { pv2 += sn2.lignes[k].doubleChargeMdE / Math.pow(1.035, k); pvG += sn2.lignes[k].gainRetraitesMdE / Math.pow(1.035, k); }
ok(pv2 > 0 && Math.abs(pv2 - pvG) < 0.02 * pvG, 'r > ρ : valeur actualisée de la double charge = gain actualisé des retraités (écart ' + (100 * Math.abs(pv2 - pvG) / pvG).toFixed(2) + ' %)');

// Salarié né en 2000
var P = Q.PROFILS.median, base = { brut: P.brut, pente: P.pente };
var zero = Q.pensionSalarie({ brut: P.brut, pente: P.pente, phiMax: 0 });
ok(proche(zero.rapport, 1, 1e-9), 'aucun point basculé : pension mixte = répartition seule');
var egal = Q.pensionSalarie({ brut: P.brut, pente: P.pente, phiMax: 3, r: 0.006, g: 0.006 });
ok(proche(egal.rapport, 1, 1e-9), 'r = ρ : pension mixte = répartition seule (aucun gain)');
var m1 = Q.pensionSalarie({ brut: P.brut, pente: P.pente, phiMax: 1 }), m3 = Q.pensionSalarie({ brut: P.brut, pente: P.pente, phiMax: 3 }), m6 = Q.pensionSalarie({ brut: P.brut, pente: P.pente, phiMax: 6 });
ok(m1.rapport > 1 && m1.rapport < m3.rapport && m3.rapport < m6.rapport, 'au rendement central, plus de points → pension mixte plus haute (en espérance)');
ok(m3.repartitionSeuleMois > 1000 && m3.tauxRemplacementRepartition > 0.4 && m3.tauxRemplacementRepartition < 0.7, 'taux de remplacement répartition seule dans une fourchette plausible (COR : 54,6 % de pension moyenne relative)');
var sm = Q.pensionSalarie({ brut: Q.PROFILS.smic.brut, pente: 0, phiMax: 3 }), cd = Q.pensionSalarie({ brut: Q.PROFILS.cadre.brut, pente: Q.PROFILS.cadre.pente, phiMax: 3 });
ok(sm.repartitionSeuleMois < m3.repartitionSeuleMois && m3.repartitionSeuleMois < cd.repartitionSeuleMois, 'pension : Smic < médian < cadre');
ok(proche(sm.rapport, Q.pensionSalarie({ brut: 2 * Q.PROFILS.smic.brut, pente: 0, phiMax: 3 }).rapport, 1e-9), 'à profil de carrière égal, le rapport mixte/répartition ne dépend pas du niveau de salaire (proportionnalité)');

// Dispersion
var d0 = Q.dispersionSalarie({ brut: P.brut, pente: P.pente, phiMax: 3, sigma: 1e-9 }, 20, 7);
ok(proche(d0.rapportP5, d0.rapportP95, 1e-4) && proche(d0.rapportP50, d0.base.rapport, 1e-4), 'volatilité nulle : pas de dispersion');
var da = Q.dispersionSalarie({ brut: P.brut, pente: P.pente, phiMax: 3 }, 500, 99), db = Q.dispersionSalarie({ brut: P.brut, pente: P.pente, phiMax: 3 }, 500, 99);
ok(da.rapportP50 === db.rapportP50, 'simulation reproductible à graine égale');
ok(da.rapportP5 <= da.rapportP50 && da.rapportP50 <= da.rapportP95 && da.rapportP95 > da.rapportP5, 'quantiles ordonnés');
var d6 = Q.dispersionSalarie({ brut: P.brut, pente: P.pente, phiMax: 6 }, 500, 99);
ok((d6.rapportP95 - d6.rapportP5) > (da.rapportP95 - da.rapportP5), 'plus de points → dispersion plus large');
var sz = Q.stressSalarie({ brut: P.brut, pente: P.pente, phiMax: 3 }, 'zero'), sk = Q.stressSalarie({ brut: P.brut, pente: P.pente, phiMax: 3 }, 'krach');
ok(sz.rapport < 1 && sk.rapport > sz.rapport, 'rendement réel nul toute la carrière : pension mixte < répartition seule ; un krach isolé fait moins mal');

// Compartiment
var c0 = Q.compartiment({ q: 0 }), cq = Q.compartiment({ q: 0.15, dRend: -0.01, sigmaC: 0.2, corr: 0.6, sigma: 0.12, r: 0.035 });
ok(c0.r === 0.035 && proche(c0.sigma, 0.12, 1e-12), 'q = 0 : rendement et volatilité du cœur');
ok(proche(cq.r, 0.035 - 0.15 * 0.01, 1e-12), 'rendement du portefeuille = (1-q) r + q (r + Δ)');
ok(proche(cq.sigma, Math.sqrt(0.85 * 0.85 * 0.0144 + 0.0225 * 0.04 + 2 * 0.15 * 0.85 * 0.6 * 0.12 * 0.2), 1e-12), 'volatilité du portefeuille : formule à deux actifs');
ok(Q.compartiment({ q: 0.15, corr: 1, sigmaC: 0.12, sigma: 0.12 }).sigma > 0.1199 && Q.compartiment({ q: 0.15, corr: 0.5, sigmaC: 0.12, sigma: 0.12 }).sigma < 0.12, 'diversification : corrélation < 1 à volatilité égale réduit le risque');

// Nouveau décompte
var cn = Q.compteNotionnel(33700, 0.006, 43);
ok(proche(cn.capital * cn.coefficientConversion, cn.pensionAn, 1e-6), 'compte notionnel : pension = capital × coefficient de conversion');
ok(Q.compteNotionnel(33700, 0.006, 43, 25).pensionAn < Q.compteNotionnel(33700, 0.006, 43).pensionAn, 'plus l\'espérance de vie est longue, plus la rente annuelle est basse');
ok(proche(Q.transfertLongevite(22, 22, 0.006), 1, 1e-12) && Q.transfertLongevite(19, 22, 0.006) < 1 && Q.transfertLongevite(25, 22, 0.006) > 1, 'conversion à espérance de vie moyenne : perd qui vit moins longtemps, gagne qui vit plus longtemps');
log('Tous les tests de capitalisation.js passent.');
