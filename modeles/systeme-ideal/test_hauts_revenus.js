// Tests de hauts_revenus.js (calculs à la main ou recoupements avec palier1.js). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js hauts_revenus.js test_hauts_revenus.js
var M = this.SystemeIdeal, O = this.Optimisation, P1 = this.Palier1, H = this.HautsRevenus, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var st = P1.palier1().st, E = H.OPTIONS.E73.c, E0 = H.OPTIONS.E.c;   // E = recommandée (E73) ; E0 = ancienne recommandation (zone de reprise dès 8 000 €, maximum 74,1 %)

// Équation à deux coudes : calcul à la main
var c = { t2: 0.08, R1: 60000 };
proche(H.impot2(120000, c), 0.08 * (60000 - 60000 * Math.log(2)), 1e-6, 'I2(120 k) = 8 % × [60 000 − 60 000 ln 2] = 1 473 €');
proche(H.impot2(60000, c), 0, 1e-9, 'I2 nul au second coude');
ok(H.impot2(60001, c) < 1e-3, 'continuité : I2(R1 + 1) < 0,001 € (dérivée nulle au coude)');
proche(H.marg2(120000, c), 0.04, 1e-9, 'taux marginal du second coude à 120 k : 8 % × (1 − 60/120) = 4 %');
proche(H.marg2(1e12, c), 0.08, 1e-6, 'limite à l\'infini : t2');
ok(H.impot2(1e5, { t2: 0 }) === 0 && H.marg2(1e5, {}) === 0, 'sans t2 : aucun impôt supplémentaire');
// Reprise du socle
var r = { ra: 8000, rb: 14000 };
ok(H.partSocle(7999, r) === 1 && H.partSocle(14000, r) === 0 && H.partSocle(20000, r) === 0, 'reprise : socle entier sous 8 000 €, nul à 14 000 € et au-delà');
proche(H.partSocle(11000, r), 0.5, 1e-9, 'reprise : moitié à 11 000 €');
proche(H.penteReprise(500, r), 500 / 6000, 1e-12, 'pente de la reprise : 500 € sur 6 000 € = 8,3 points');
ok(H.partSocle(50000, {}) === 1, 'sans reprise : socle entier');

// Correctif nul = palier 1
var A = H.profils(st, {}), C0 = P1.casActifs(st);
function par(l, id) { return l.filter(function (x) { return x.id === id; })[0]; }
proche(par(A, 'cadre8k').ecartMois, par(C0, 'cadre8k').ecartMois, 1e-6, 'sans correctif : cadre à 8 000 € = palier 1 (+1 156 €)');
proche(par(A, 'dirigeantHolding').ecartMois, par(C0, 'dirigeantHolding').ecartMois, 1e-6, 'sans correctif : dirigeant = palier 1 (+2 528 € en espèces)');
proche(par(A, 'cadre15k').ecartMois, par(C0, 'cadre15k').ecartMois, 1e-6, 'sans correctif : cadre à 15 000 € = palier 1');
proche(par(A, 'smic35').ecartMois, par(C0, 'smic35').ecartMois, 1e-6, 'sans correctif : Smic = palier 1 (+85 €)');
proche(H.extra(O.configR(st), 'central', {}).netMd, 0, 1e-12, 'sans correctif : recette nulle');
proche(H.solde(st, 'central', undefined, {}), P1.solde(st, 'central'), 1e-9, 'sans correctif : solde = palier 1');
proche(H.platNecessaire(P1.stFor({}), undefined, undefined, {}), P1.platNecessaire(P1.stFor({})), 1e-6, 'sans correctif : taux plat nécessaire = palier 1 (34,5 %)');

// Holdings sans différé
var B = H.profils(st, H.OPTIONS.B.c), d = par(B, 'dirigeantHolding');
proche(d.ecartMois, d.ecartEcoMois, 1e-6, 'sans différé : le gain en espèces du dirigeant = sa variation de revenu économique');
proche(d.ecartMois, -7194, 1, 'sans différé : le dirigeant perd 7 194 €/mois (revenu économique du § 13)');
proche(H.solde(st, 'central', undefined, H.OPTIONS.B.c), P1.solde(st, 'central'), 1e-9, 'sans différé : le solde annuel ne change pas (impôt déjà dû, seulement exigible plus tôt)');

// Option E : effets sur les profils
var Ep = H.profils(st, E);
['smic35', 'median'].forEach(function (id) { proche(par(Ep, id).ecartMois, par(A, id).ecartMois, 1e-6, 'E ne touche pas ' + id); });
ok(par(Ep, 'cadre4k').ecartMois > par(A, 'cadre4k').ecartMois - 60, 'E : le cadre à 4 000 € perd moins de 60 €/mois');
// Seuils stricts (01/11/2026) : l'objectif de l'auteur est qu'un cadre ne gagne pas plus qu'un salarié médian en euros, sans être puni. Le gain du médian est de +636 €/mois (palier 1, taux plat 35 %).
var gMed = par(Ep, 'median').ecartMois;
ok(par(Ep, 'cadre8k').ecartMois < 0.6 * gMed, 'E : le cadre à 8 000 € gagne moins de 60 % du gain du salarié médian (+330 sur +636 € : ' + Math.round(par(Ep, 'cadre8k').ecartMois) + ')');
ok(par(Ep, 'cadre15k').ecartMois < 0.6 * gMed, 'E : le cadre à 15 000 € gagne moins de 60 % du gain du salarié médian (+233 sur +636 €)');
ok(par(Ep, 'cadre8k').ecartMois < 0.30 * par(A, 'cadre8k').ecartMois, 'E : le cadre à 8 000 € garde moins de 30 % de son gain du palier 1 (28,6 % : +330 sur +1 156 €, IR calculé le 01/11/2026)');
ok(par(Ep, 'cadre15k').ecartMois < 0.15 * par(A, 'cadre15k').ecartMois, 'E : le cadre à 15 000 € garde moins de 15 % de son gain (12,5 % : +233 sur +1 856 €)');
ok(par(Ep, 'cadre8k').ecartMois > 0 && par(Ep, 'cadre15k').ecartMois > 0, 'E : ni l\'un ni l\'autre ne perd (pas de punition : gains positifs)');
ok(par(Ep, 'cadre4k').ecartMois > par(A, 'cadre4k').ecartMois - 60, 'E : le cadre à 4 000 € perd moins de 60 €/mois par rapport au palier 1 (−28)');
ok(par(Ep, 'dirigeantHolding').ecartEcoMois < par(A, 'dirigeantHolding').ecartEcoMois, 'E : le dirigeant perd plus en revenu économique');
// jamais tout prendre : taux marginal < 80 % partout, pour toutes les options
Object.keys(H.OPTIONS).forEach(function (k) {
  ok(H.profils(st, H.OPTIONS[k].c).every(function (p) { return p.tauxMarginal < 0.80; }), 'option ' + k + ' : taux marginal total < 80 % pour tous les profils');
  ok(H.marginalTotal(1e9, st, H.OPTIONS[k].c) < 0.80, 'option ' + k + ' : taux marginal total limite < 80 %');
});
proche(H.marginalTotal(1e9, st, E), 0.35 + 0.30 + 0.08, 1e-3, 'limite à l\'infini de E : 35 + 30 + 8 = 73 %');
proche(H.marginalTotal(175200, st, {}), 0.35 + 0.30 * (1 - 24000 / 175200), 1e-9, 'taux marginal à 175 k€ sans correctif : 35 % + 30 % × (1 − 24/175,2)');

// Solde : ordre des scénarios, monotonie
var s0 = H.soldes(st, undefined, {}), sE = H.soldes(st, undefined, E);
ok(sE.bas > sE.central && sE.central > sE.haut, 'E : bas > central > haut');
ok(sE.bas > s0.bas && sE.central > s0.central && sE.haut < s0.haut, 'E : améliore le bas et le central, détériore le haut (élasticités fortes et exil)');
ok(H.platNecessaire(P1.stFor({}), undefined, undefined, E) < H.platNecessaire(P1.stFor({}), undefined, undefined, {}), 'E : abaisse le taux plat nécessaire');
var cF = H.OPTIONS.F.c, cG = H.OPTIONS.G.c;
ok(par(H.profils(st, cF), 'cadre8k').ecartMois < par(Ep, 'cadre8k').ecartMois && par(Ep, 'cadre8k').ecartMois < par(H.profils(st, cG), 'cadre8k').ecartMois, 'F < E < G pour le cadre à 8 000 €');
ok(H.soldes(st, undefined, cF).haut < sE.haut && sE.haut < H.soldes(st, undefined, cG).haut + 1e-9, 'F plus dure : plus mauvais au haut que E, E au moins aussi mauvais que G');

// --- Extension T47 bis (H131-H133) : plafond 75 %, élasticités par bande, holdings passifs
Object.keys(H.OPTIONS).forEach(function (k) {
  var o = H.OPTIONS[k], mx = H.marginalMax(st, o.c).taux;
  if (o.ecartee) ok(mx > H.PLAFOND, 'option ' + k + ' écartée : maximum ' + mx.toFixed(4) + ' > 75 %');
  else ok(mx <= H.PLAFOND + 1e-9, 'option ' + k + ' : taux marginal total maximal (reprise du socle comprise) ' + mx.toFixed(4) + ' ≤ 75 %');
});
ok(H.marginalMax(st, E0).taux > 0.73 && H.marginalMax(st, E0).taux < H.PLAFOND, 'ancienne E : le maximum (zone de reprise dès 8 000 €, 166 k€) dépasse 73 % (74,1 %) : la reprise compte');
ok(H.marginalMax(st, E).taux <= 0.73 + 1e-9, 'E73 (recommandée) : maximum reprise comprise ≤ 73 % (zone de reprise élargie à 7 500-15 000 €)');
var t2m = H.t2Plafond(st, { differe: false, ra: 8000, rb: 14000, R1: 60000 });
ok(t2m > 0.08 && t2m < 0.10, 'plus grand t2 compatible avec 75 % (reprise comprise) : ' + t2m + ' (entre 8 et 10 %)');
ok(H.marginalMax(st, { ra: 8000, rb: 14000, R1: 60000, t2: t2m }).taux <= 0.75 && H.marginalMax(st, { ra: 8000, rb: 14000, R1: 60000, t2: t2m + 0.002 }).taux > 0.75, 't2 admissible : maximum ≤ 75 %, et 0,2 point de plus dépasse');
ok(H.t2Plafond(st, { ra: 8000, rb: 14000, R1: 60000 }, 0.70) < H.t2Plafond(st, { ra: 8000, rb: 14000, R1: 60000 }, 0.73), 'plafond 70 % : t2 admissible plus faible que pour 73 %');
// élasticités par bande
ok(H.etiBande(5, 'central', {}) === 0.05 && H.etiBande(8, 'bas', {}) === 0 && H.etiBande(8, 'haut', {}) === 0.10, 'D6-D9 : 0 / 0,05 / 0,10');
ok(H.etiBande(9, 'bas', {}) === 0.15 && H.etiBande(12, 'central', {}) === 0.31 && H.etiBande(10, 'haut', {}) === 0.45, 'D10 : 0,15 / 0,31 / 0,45 (Cabannes-Houdré-Landais 2014)');
ok(H.etiBande(5, 'central', { etiUnique: true }) === M.SCENARIOS.central.eti, 'etiUnique : retour à l\'élasticité unique du scénario');
var eU = H.extra(O.configR(st), 'central', F(E, { etiUnique: true })), eB = H.extra(O.configR(st), 'central', E);
function bande(e, id) { return e.parBande.filter(function (b) { return b.id === id; })[0].recetteMd; }
ok(eB.parBande.length === eU.parBande.length, 'mêmes bandes avec ou sans élasticité par bande');
var milieu = ['D6', 'D7', 'D8', 'D9'].filter(function (id) { return eB.parBande.some(function (b) { return b.id === id; }); });
ok(milieu.length > 0 && milieu.every(function (id) { return bande(eB, id) > bande(eU, id) - 1e-9; }), 'élasticité par bande : les bandes D6-D9 perdent moins que sous l\'élasticité unique de 0,25');
ok(H.extra(O.configR(st), 'central', {}).netMd === 0, 'élasticité par bande : toujours aucune recette sans correctif');
// holdings passifs : part de l'assiette
var dB = par(H.profils(st, H.OPTIONS.B.c), 'dirigeantHolding'), dB2 = par(H.profils(st, H.OPTIONS.B2.c), 'dirigeantHolding'), dA = par(A, 'dirigeantHolding');
proche(dB2.ecartMois, dA.ecartMois + 0.7 * (dB.ecartMois - dA.ecartMois), 1e-6, 'B2 : le dirigeant supporte 70 % de l\'impôt différé en espèces (0,7 × 9 722 €)');
proche(dB2.ecartEcoMois, dB.ecartEcoMois, 1e-6, 'B2 : le revenu économique ne dépend pas de la part passive');
ok(dB2.ecartMois > dB.ecartMois && dB2.ecartMois < dA.ecartMois, 'B2 : entre le palier 1 (aucun impôt exigible) et B (assiette entière)');
proche(par(H.profils(st, { differe: false, partPassive: 0 }), 'dirigeantHolding').ecartMois, dA.ecartMois, 1e-6, 'part passive nulle : aucun effet');
proche(H.solde(st, 'central', undefined, H.OPTIONS.B2.c), P1.solde(st, 'central'), 1e-9, 'B2 : le solde annuel ne change pas non plus');
// Frontière sous plafond (§ 15.F) : plus le plafond est bas, plus les cadres gardent de gain ; à 73 % et au-delà ils passent sous le médian, à 70 % non
var fr = [0.70, 0.73, 0.75].map(function (pl) { return H.frontiere(st, pl); });
ok(fr[0].cadre15k > fr[1].cadre15k && fr[1].cadre15k > fr[2].cadre15k, 'frontière : le gain du cadre à 15 000 € baisse quand le plafond monte (70 : +' + Math.round(fr[0].cadre15k) + ', 73 : +' + Math.round(fr[1].cadre15k) + ', 75 : +' + Math.round(fr[2].cadre15k) + ')');
ok(fr[0].max > gMed && fr[1].max < gMed && fr[2].max < gMed, 'frontière : sous 70 % un cadre garde plus que le médian (+655 > +636) ; à 73 % et 75 % les deux sont sous le médian');
ok(fr.every(function (f, i) { return f.maximumMarginal <= [0.70, 0.73, 0.75][i] + 1e-9; }), 'frontière : chaque combinaison respecte son plafond, reprise comprise');
ok(fr[2].cadre15k > 0 && fr[2].cadre8k > 100, 'frontière : même à 75 %, avec les garde-fous (cadre à 4 k presque intact, médian intact), les deux cadres gardent un gain positif (+' + Math.round(fr[2].cadre8k) + ' / +' + Math.round(fr[2].cadre15k) + ') : l\'écart à zéro est de ' + Math.round(fr[2].cadre8k) + ' € pour le cadre à 8 k');
ok(par(Ep, 'cadre8k').ecartMois - fr[1].cadre8k < 25 && par(Ep, 'cadre8k').ecartMois >= fr[1].cadre8k - 1e-9, 'frontière à 73 % : E73 est à moins de 25 €/mois de la frontière pour le cadre à 8 k (+' + Math.round(par(Ep, 'cadre8k').ecartMois) + ' contre +' + Math.round(fr[1].cadre8k) + '), et laisse le cadre à 4 k net de 4 000 € intact');
proche(par(Ep, 'cadre15k').ecartMois, fr[1].cadre15k, 3, 'frontière à 73 % : E73 est sur la frontière pour le cadre à 15 k');
log('\n' + n + ' contrôles passés');
