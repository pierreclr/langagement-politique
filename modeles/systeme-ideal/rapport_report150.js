// Report d'imposition de l'apport-cession (art. 150-0 B ter) : tableaux de resultats.md § 25. Reproduction, depuis ce dossier :
//   jsc patrimoine_financier.js rapport_report150.js > resultats-report150.txt
var PF = this.PatrimoineFinancier;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function pc(x) { return r1(x * 100) + ' %'; }
var SC = PF.SC, R = PF.REPORT150, P = PF.R150P;

log('## A. Séries DGFiP (Md€ ; rapport AN n° 3056, p. 178 ; stock = majorant)');
log('| revenus | nouvelles plus-values en report | report ayant pris fin | stock | stock(n−1) + flux − sorties − stock(n) |'); log('|---|---|---|---|---|');
var ec = PF.ecartStock();
R.annees.forEach(function (a, i) { log('| ' + a + ' | ' + r1(R.flux[i]) + ' | ' + r2(R.sorties[i]) + ' | ' + r1(R.stock[i]) + ' | ' + (i ? r2(ec[i - 1]) : '—') + ' |'); });
var sf = R.flux.reduce(function (a, x) { return a + x; }, 0), ss = R.sorties.reduce(function (a, x) { return a + x; }, 0);
log('\nCumul 2020-2024 : entrées ' + r1(sf) + ' Md€, sorties ' + r2(ss) + ' Md€ (' + pc(ss / sf) + ' des entrées). Stock fin 2024 × 31,4 % = ' + r1(PF.stockReport(R.stock[4], 1, R.tPFU2026)) + ' Md€ d\'impôt latent ; × 34 % (PFU + CEHR) = ' + r1(PF.stockReport(R.stock[4], 1, R.tPFUCEHR)) + ' ; × 50 % = ' + r1(PF.stockReport(R.stock[4], 1, 0.5)) + '.');
log('Concentration 2023 : ' + R.foyers2023 + ' foyers bénéficiaires ; ' + R.foyersTop2023 + ' foyers = ' + r1(R.fluxTop2023) + ' Md€ (' + pc(R.fluxTop2023 / R.flux[3]) + ' du flux) ; dernier décile de RFR = ' + pc(R.partDernierDecile2023) + '.');
log('Flux 2024 par foyer (8 400 foyers, ordre de grandeur) : ' + r1(R.flux[4] / R.foyers2023 * 1000) + ' M€ ; 2023 : ' + r1(R.flux[3] / R.foyers2023 * 1000) + ' M€ ; les 84 foyers du sommet en 2023 : ' + r1(R.fluxTop2023 / R.foyersTop2023 * 1000) + ' M€ chacun.');

log('\n## B. Les options, par scénario (Md€)');
log('| option | bas | central | haut |'); log('|---|---|---|---|');
var O = {}; SC.forEach(function (s) { O[s] = PF.report150Options(s); });
function row(nom, f) { log('| ' + nom + ' | ' + SC.map(function (s) { return r2(f(O[s])); }).join(' | ') + ' |'); }
row('(a) flux de croisière : recette brute (Md€/an)', function (o) { return o.a.recettesBrutes; });
row('(a) coût des crédits de perte (Md€/an)', function (o) { return o.a.coutCredits; });
row('(a) recettes actuelles du flux (Md€/an)', function (o) { return o.a.recettesActuelles; });
row('**(a) flux : recette nouvelle nette (Md€/an)**', function (o) { return o.a.recettesNouvelles; });
log('| (a) m (part de la base qui reste) | ' + SC.map(function (s) { return r2(O[s].a.multComportement); }).join(' | ') + ' |');
row('(a) stock : impôt latent t × S × κ (une fois)', function (o) { return o.aStock.impotLatent; });
row('**(a) stock : recouvrement unique (Md€, une fois)**', function (o) { return o.aStock.total; });
row('(a) stock : par an sur 10 ans', function (o) { return o.aStock.parAnSur10; });
row('(b1) taxe de 2 % sur les actifs non professionnels : brut (Md€/an)', function (o) { return o.b1.recettesBrutes; });
row('**(b1) net de l\'évitement et du départ (Md€/an)**', function (o) { return o.b1.recettesNettes; });
row('(b2) plancher à 40 % du revenu économique, 75 foyers : statique (Md€/an)', function (o) { return o.b2.statique; });
row('**(b2) net de la fuite (Md€/an)**', function (o) { return o.b2.net; });
row('**(c) fin de la purge : recette annuelle sur le stock 2024 (Md€/an)**', function (o) { return o.c.annuel; });
log('| (c) idem après 10 ans (stock augmenté du flux net) | ' + SC.map(function (s) { return r2(PF.report150Deces(s, { annees: 10 }).annuel); }).join(' | ') + ' |');
row('(c) impôt à 31,4 % qui s\'éteint en 20 ans sur le stock 2024', function (o) { return o.c.echappeSurVingtAns; });
row('**(a) flux + (c) stock existant (Md€/an)**', function (o) { return o.ac; });

log('\n## C. (a) Sensibilité du flux de croisière (central ; Md€/an, net)');
log('| taux t | recette nouvelle nette |'); log('|---|---|');
[0.3, 0.4, 0.5, 0.6].forEach(function (t) { log('| ' + pc(t) + ' | ' + r2(PF.report150Flux('central', { t: t }).recettesNouvelles) + ' |'); });
log('\nConvention du § 26 (m calculé avec un taux actuel de 30 % au lieu du taux effectif réel) : recette brute ' + r2(PF.report150Flux('central', { tauA: 0.30 }).recettesBrutes) + ' Md€/an contre ' + r2(PF.report150Flux('central').recettesBrutes) + ' avec le taux effectif de ' + pc(PF.report150Flux('central').tauxEffectifActuel) + '.');
log('\n| flux F (Md€/an) | recette nouvelle nette (central) |'); log('|---|---|');
[18.4, 22.2, 24.7, 33.6].forEach(function (F) { log('| ' + r1(F) + ' | ' + r2(PF.report150Flux('central', { F: F }).recettesNouvelles) + ' |'); });
var cop = JSON.parse(JSON.stringify(P.central));
log('\n| ε × k (central) | recette nouvelle nette (Md€/an) |'); log('|---|---|');
[0, 0.5, 1, 2, 3].forEach(function (k) { P.central.eps = cop.eps * k; log('| ' + k + ' (ε = ' + r1(P.central.eps) + ') | ' + r2(PF.report150Flux('central').recettesNouvelles) + ' |'); });
P.central.eps = cop.eps;

log('\n## D. (c) Fin de la purge : recette annuelle selon l\'horizon (Md€/an, t = 50 %)');
log('| horizon | bas | central | haut |'); log('|---|---|---|---|');
[0, 5, 10, 20].forEach(function (n) { log('| ' + n + ' ans | ' + SC.map(function (s) { return r2(PF.report150Deces(s, { annees: n }).annuel); }).join(' | ') + ' |'); });
log('\nAvec t = 31,4 % (PFU) : ' + SC.map(function (s) { return s + ' ' + r2(PF.report150Deces(s, { t: 0.314 }).annuel); }).join(' ; ') + ' Md€/an.');

log('\n## E. (b) Variantes de taux (central)');
log('| taux de la taxe sur les actifs de holdings | brut | net |'); log('|---|---|---|'); 
[0.02, 0.03, 0.05].forEach(function (t) { var h = PF.holdingsTaxe('central', { taux: t }); log('| ' + pc(t) + ' | ' + r2(h.recettesBrutes) + ' | ' + r2(h.recettesNettes) + ' |'); });
log('\n| plancher en revenu économique (75 foyers) | statique | net (central) |'); log('|---|---|---|'); 
[0.3, 0.4, 0.5].forEach(function (t) { var h = PF.plancherRevenu('central', { plancher: t }); log('| ' + pc(t) + ' | ' + r2(h.statique) + ' | ' + r2(h.net) + ' |'); });
log('\nIPP (2016) : 75 foyers ; revenu économique moyen ' + r1(R.ipp.revenuEco / 75 * 1000) + ' M€ ; revenu fiscal moyen ' + r1(R.ipp.revenuFiscal / 75 * 1000) + ' M€ ; taux global ' + pc(R.ipp.tauxGlobal) + ' (' + pc(R.ipp.tauxGlobal50) + ' avec 50 % de détention) ; impôt acquitté ≈ ' + r1(R.ipp.tauxGlobal * R.ipp.revenuEco) + ' Md€.');
