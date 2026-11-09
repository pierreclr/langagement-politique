// Tests de patrimoine_financier.js. Depuis ce dossier :
//   jsc patrimoine_financier.js test_patrimoine_financier.js
var PF = this.PatrimoineFinancier;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var SC = PF.SC, C = PF.CONST, P = PF.PARAM, K = PF.COMMUN;
var ACTIFS = ['dividendes', 'portefeuille', 'assuranceVie', 'pea', 'cessionEntreprise', 'plusValuesPro', 'crypto'];

// Constantes sourcées
proche(C.tPFUir + C.tPS, 0.314, 1e-12, 'PFU 2026 = 12,8 % + 18,6 % = 31,4 % (V6000, CSS L136-8 I 2°)');
proche(C.tPSAV, 0.172, 0, 'assurance-vie : prélèvements sociaux maintenus à 17,2 % (V6000, CSS L136-8 IV 4°)');
proche(C.tauxPrelevement, 0.5, 0, 'prélèvement unique 50 %');
proche(C.depFiscale.abattementRetraiteDirigeants, 0.078, 0, 'dépense fiscale 150515 : 78 M€ (2025)');
proche(C.depFiscale.abattementPmeJeunes, 0.152, 0, 'dépense fiscale 150518 : 152 M€ (2025)');
proche(C.depFiscale.assuranceVie, 0.595, 0, 'dépense fiscale 140119 : 595 M€ (2025)');
proche(C.prelevement990I, 0.458, 0, '990 I : 458 M€ (Insee 2024)');
proche(C.assuranceVieCotisations2025 - C.assuranceViePrestations2025, 50.7, 0.2, 'cotisations − prestations ≈ collecte nette 50,6 Md€');
proche(C.cryptoDeclare[2024], 0.368, 0, 'crypto déclaré 2024 : 368 M€');
proche((C.depFiscale.peaDividendes) / C.tPFUir, 3.80, 0.01, 'PEA : 487 M€ / 12,8 % = 3,8 Md€ de dividendes capitalisés (≈ 3 % de 126,5 Md€)');
proche(C.dividendes2020 / C.peaEncoursTitres2025, 0.187, 0.001, 'rapport dividendes ménages / encours PEA (contrôle d\'échelle)');

// Outils
proche(PF.reelFactor(0.07, 8), 0.76, 0.02, 'facteur réel titres (7 %, 8 ans) ≈ 0,76');
ok(PF.reelFactor(0.026, 12.8) < PF.reelFactor(0.07, 12.8), 'facteur réel : fonds euros (2,6 %) < actions (7 %) : l\'inflation mange le gain des produits sûrs');
proche(PF.reelFactor(0.07, 8, 0), 1, 1e-12, 'sans inflation, facteur réel = 1');
ok(PF.reelFactor(0.01, 10) === 0, 'rendement sous l\'inflation : gain réel nul (borné à 0)');
proche(PF.tauxMaximisantRecette(1), 0.5, 1e-12, 't* = 50 % pour ε = 1');
proche(PF.tauxMaximisantRecette(2), 1 / 3, 1e-12, 't* = 33 % pour ε = 2');
proche(PF.tauxMaximisantRecette(0.5), 2 / 3, 1e-12, 't* = 67 % pour ε = 0,5');
// vérification numérique : t (1 − t)^ε est maximal en t*
[0.5, 1, 2].forEach(function (e) { var ts = PF.tauxMaximisantRecette(e), f = function (t) { return t * Math.pow(1 - t, e); }; ok(f(ts) >= f(ts - 0.05) && f(ts) >= f(ts + 0.05), 'maximum de t (1 − t)^ε en t* pour ε = ' + e); });
proche(PF.stockReport(10, 1), 5, 1e-12, 'stock reporté de 10 Md€ entièrement taxé à 50 % = 5 Md€');
proche(PF.stockReport(10, 0.4, 0.5), 2, 1e-12, 'stock reporté, 40 % devient imposable = 2 Md€');
SC.forEach(function (sc) {
  proche(PF.partImputee(sc, 0), 0, 1e-12, 'part imputée à 0 an = 0 (' + sc + ')');
  proche(PF.partImputee(sc, Infinity), K.absorption[sc], 1e-12, 'part imputée sans limite = absorption (' + sc + ')');
  ok(PF.partImputee(sc, 5) < PF.partImputee(sc, 10) && PF.partImputee(sc, 10) < PF.partImputee(sc, Infinity), 'part imputée croissante avec la durée de report (' + sc + ')');
});
ok(K.absorption.bas > K.absorption.central && K.absorption.central > K.absorption.haut, 'absorption : bas > central > haut (bas = coût de crédits maximal)');

// Bloc générique : cas d'école
var b0 = PF.bloc('central', { N: 10, rho: 0, tauA: 0.30, eps: 1, eta: 0 });
proche(b0.recettesActuelles, 3, 1e-12, 'bloc : actuel = 30 % de 10');
proche(b0.multComportement, 0.5 / 0.7, 1e-12, 'bloc : m = (0,5/0,7)^1');
proche(b0.recettesNettes, 0.5 * 10 * 0.5 / 0.7, 1e-12, 'bloc : sans pertes, recette = 50 % × base × m');
var b1 = PF.bloc('central', { N: 10, rho: 0, tauA: 0.30, eps: 1, eta: 0 }, { sansComportement: true });
proche(b1.recettesNettes, 5, 1e-12, 'bloc sans comportement : 50 % de 10 = 5');
var b2 = PF.bloc('central', { N: 10, rho: 0, tauA: 0.30, eps: 0, eta: 0 });
proche(b2.multComportement, 1, 1e-12, 'bloc : ε = 0, aucun verrouillage');
var b3 = PF.bloc('central', { N: 10, rho: 0.5, tauA: 0.30, eps: 0, eta: 0, fraude: 0 });
proche(b3.gainsBruts, 10 / (1 - 0.5 * K.uActuel), 1e-9, 'bloc : gains bruts = N / (1 − ρ u)');
proche(b3.pertes, 0.5 * b3.gainsBruts, 1e-9, 'bloc : pertes = ρ × gains bruts');
proche(b3.creditsCrees, 0.5 * b3.pertes, 1e-9, 'bloc : crédits = 50 % des pertes (sans fraude ni récolte)');
proche(b3.coutCredits, b3.creditsCrees * PF.partImputee('central', 10), 1e-9, 'bloc : coût = crédits × part imputée à 10 ans');
proche(b3.recettesNettes, b3.recettesBrutes - b3.coutCredits, 1e-9, 'bloc : net = brut − coût des crédits');
var b4 = PF.bloc('central', { N: 10, rho: 0.5, tauA: 0.30, eps: 0, eta: 0, fraude: 0 }, { T: Infinity });
ok(b4.coutCredits > b3.coutCredits, 'bloc : sans limite de report, coût plus élevé');
var b5 = PF.bloc('central', { N: 10, rho: 0.5, tauA: 0.30, eps: 0, eta: 0, fraude: 0 }, { T: 5 });
ok(b5.coutCredits < b3.coutCredits, 'bloc : report de 5 ans, coût plus faible qu\'à 10 ans');
var b6 = PF.bloc('central', { N: 10, rho: 0, tauA: 0.30, eps: 1, eta: 0, f: 0.8 });
proche(b6.recettesNettes, 0.8 * b0.recettesNettes, 1e-12, 'bloc : base réelle (f = 0,8) réduit la recette dans la même proportion');
var b7 = PF.bloc('central', { N: 10, rho: 0, tauA: 0.60, eps: 1, eta: 0 });
proche(b7.multComportement, 1, 1e-12, 'bloc : si le taux actuel dépasse 50 %, pas de verrouillage (m plafonné à 1)');
var b8 = PF.bloc('central', { N: 10, rho: 0, tauA: 0.30, eps: 1, eta: 0.1 });
proche(b8.recettesNettes, 0.9 * b0.recettesNettes, 1e-12, 'bloc : fuite de 10 % = recette × 0,9');
var b9 = PF.bloc('central', { N: 10, rho: 0, tauA: 0.30, eps: 1, eta: 0, actuel: 1 });
proche(b9.recettesNouvelles, b9.recettesNettes - 1, 1e-12, 'bloc : recette actuelle imposée = valeur donnée');
var bt = PF.bloc('central', { N: 10, rho: 0, tauA: 0.30, eps: 1, eta: 0 }, { t: 0.4 });
ok(bt.recettesNettes < b0.recettesNettes + 1e-9, 'bloc : à ε = 1, le taux de 40 % ne rapporte pas plus que 50 % (sommet en 50 %)');
proche(PF.bloc('central', { N: 10, rho: 0, tauA: 0.30, eps: 1, eta: 0 }, { t: 0.5 }).recettesNettes, PF.bloc('central', { N: 10, rho: 0, tauA: 0.30, eps: 1, eta: 0 }, { t: 0.4 }).recettesNettes * (0.5 * (0.5 / 0.7)) / (0.4 * (0.6 / 0.7)), 1e-9, 'bloc : rapport des recettes = rapport t (1 − t)^ε');

// Actifs : cohérence interne dans les trois scénarios
SC.forEach(function (sc) {
  ACTIFS.forEach(function (a) {
    var r = PF[a](sc);
    ok(isFinite(r.recettesNouvelles) && isFinite(r.recettesActuelles), a + ' ' + sc + ' : résultats finis');
    proche(r.recettesNettes - r.recettesActuelles, r.recettesNouvelles, 1e-9, a + ' ' + sc + ' : nouvelles = nettes − actuelles');
    ok(r.recettesBrutes >= 0 && r.coutCredits >= 0 && r.base >= 0, a + ' ' + sc + ' : brutes, coût et base positifs');
    ok(r.multComportement > 0 && r.multComportement <= 1, a + ' ' + sc + ' : m dans ]0 ; 1]');
  });
  var d = PF.dividendes(sc);
  proche(d.recettesActuelles, 0.314 * P[sc].dividendes.N, 1e-9, 'dividendes ' + sc + ' : actuel = 31,4 % de la base (V6000 ; 30 % avant)');
  proche(d.coutCredits, 0, 1e-12, 'dividendes ' + sc + ' : pas de pertes, pas de crédit');
  var pf = PF.portefeuille(sc), en = PF.cessionEntreprise(sc);
  proche(pf.N + en.N, P[sc].portefeuille.N, 1e-9, 'portefeuille + entreprise = plus-values mobilières totales (' + sc + ')');
  ok(en.tauA < 0.314 && en.tauA > 0.25, 'cession d\'entreprise ' + sc + ' : taux effectif actuel un peu sous 31,4 % (abattements ; V6000)');
  var av = PF.assuranceVie(sc);
  proche(av.tauA, C.tPSAV + P[sc].av.tauxIR, 1e-12, 'assurance-vie ' + sc + ' : taux actuel = PS à 17,2 % + IR moyen (V6000)');
  proche(av.rachats + P[sc].av.prestations * P[sc].av.partDeces, P[sc].av.prestations, 1e-9, 'assurance-vie ' + sc + ' : rachats + décès = prestations');
  var pe = PF.pea(sc);
  proche(pe.tauA, 0.186, 1e-12, 'PEA ' + sc + ' : seuls les PS sont dus aujourd\'hui, à 18,6 % en 2026 (V6000, V6005)');
  var cr = PF.crypto(sc);
  proche(cr.recettesActuelles, 0.314 * Math.min(P[sc].crypto.N, C.cryptoDeclare[2024]), 1e-9, 'crypto ' + sc + ' : recette actuelle = assiette déclarée × 31,4 % (V6000)');
  var pr = PF.per(sc);
  proche(pr.soldeActuel, pr.recetteSortieActuelle - pr.coutDeductionActuel, 1e-9, 'PER ' + sc + ' : solde actuel = sorties − déduction');
  proche(pr.soldeReforme, pr.recetteSortieReforme - pr.coutDeductionReforme, 1e-9, 'PER ' + sc + ' : solde réformé = sorties − déduction');
  ok(pr.avantageNetActuel > 0 && pr.avantageNetReforme === 0, 'PER ' + sc + ' : l\'avantage de taux disparaît (déduit à 50 %, repris à 50 %)');
  var dc = PF.assuranceVieDeces(sc);
  proche(dc.capitauxDeces, P[sc].av.prestations * P[sc].av.partDeces, 1e-9, 'décès ' + sc + ' : capitaux décès = prestations × part décès');
  ok(dc.recettesNouvelles > 0, 'décès ' + sc + ' : fin de la purge par défaut (décision du 03/11, Q5), rapporte');
  proche(PF.assuranceVieDeces(sc, { deces: 'statuQuo' }).recettesNouvelles, 0, 0, 'décès ' + sc + ' : variante statu quo (purge maintenue) = aucune recette nouvelle');
  proche(dc.recettesNouvelles, PF.assuranceVieDeces(sc, { deces: 'gainsLatents' }).recettesNouvelles, 0, 'décès ' + sc + ' : défaut = gains latents');
  ok(dc.gainsLatentsTaxes.recettes < 0.5 * dc.gainsLatents, 'décès ' + sc + ' : anticipation et fuite réduisent la base');
});

// Ordre des scénarios : bas < central < haut sur le solde et sur la plupart des blocs
var B = {}; SC.forEach(function (sc) { B[sc] = PF.bilan(sc); });
ok(B.bas.soldeNet < B.central.soldeNet && B.central.soldeNet < B.haut.soldeNet, 'solde net total : bas < central < haut');
['dividendes', 'portefeuille', 'assuranceVie', 'pea', 'per', 'crypto'].forEach(function (a) {
  ok(B.bas.parActif[a].recettesNouvelles < B.haut.parActif[a].recettesNouvelles, a + ' : bas < haut');
});
SC.forEach(function (sc) {
  var s = 0, k; for (k in B[sc].parActif) s += B[sc].parActif[k].recettesNouvelles;
  proche(s, B[sc].soldeNet, 1e-9, 'solde net ' + sc + ' = somme des actifs');
  proche(B[sc].parActif.assuranceVieDeces.recettesNouvelles, PF.assuranceVieDeces(sc).recettesNouvelles, 1e-12, 'bilan ' + sc + ' : la fin de la purge est comptée par défaut');
});
var Bd = PF.bilan('central', { deces: 'statuQuo' });
proche(B.central.soldeNet - Bd.soldeNet, PF.assuranceVieDeces('central').recettesNouvelles, 1e-9, 'bilan par défaut = bilan avec purge maintenue + fin de la purge');

// Base réelle (DÉFAUT depuis le 03/11/2026) : toujours moins de recettes que la base nominale (variante reel: false), sauf PER (sans objet) et dividendes (revenu)
SC.forEach(function (sc) {
  var N = PF.bilan(sc, { reel: false }), R = PF.bilan(sc);
  proche(R.soldeNet, PF.bilan(sc, { reel: true }).soldeNet, 0, 'défaut = base réelle (' + sc + ')');
  ok(R.reel === true && N.reel === false, 'le bilan indique la base utilisée (' + sc + ')');
  ok(PF.portefeuille(sc).facteurReel < 1 && PF.portefeuille(sc, { reel: false }).facteurReel === 1, 'portefeuille : facteur réel < 1 par défaut, = 1 en nominal (' + sc + ')');
  ok(R.soldeNet < N.soldeNet, 'base réelle : solde plus faible que la base nominale (' + sc + ')');
  proche(R.parActif.dividendes.recettesNouvelles, N.parActif.dividendes.recettesNouvelles, 1e-12, 'base réelle : dividendes inchangés (' + sc + ')');
  proche(R.parActif.per.recettesNouvelles, N.parActif.per.recettesNouvelles, 1e-12, 'base réelle : PER inchangé (' + sc + ')');
  ok(R.parActif.assuranceVie.base < N.parActif.assuranceVie.base, 'base réelle : l\'assurance-vie perd plus que les actions (' + sc + ')');
});
var Rr = PF.bilan('central');
ok(Rr.parActif.assuranceVie.facteurReel < Rr.parActif.portefeuille.facteurReel, 'facteur réel : assurance-vie < portefeuille');

// Durée de report
SC.forEach(function (sc) {
  var c5 = PF.bilan(sc, { T: 5 }), c10 = PF.bilan(sc, { T: 10 }), ci = PF.bilan(sc, { T: Infinity });
  ok(c5.coutCreditsBlocs < c10.coutCreditsBlocs && c10.coutCreditsBlocs < ci.coutCreditsBlocs, 'coût des crédits : 5 ans < 10 ans < sans limite (' + sc + ')');
  ok(ci.soldeNet < c10.soldeNet, 'solde sans limite de report plus faible qu\'à 10 ans (' + sc + ')');
});
// Sans comportement : la recette brute vaut 50 % de la base (gains bruts) et dépasse la recette avec comportement
SC.forEach(function (sc) {
  var a = PF.dividendes(sc), s = PF.dividendes(sc, { sansComportement: true });
  proche(s.recettesBrutes, 0.5 * P[sc].dividendes.N, 1e-9, 'dividendes sans comportement : 50 % de la base (' + sc + ')');
  ok(s.recettesBrutes > a.recettesBrutes, 'dividendes : le comportement réduit la recette (' + sc + ')');
});

// Krach
SC.forEach(function (sc) {
  var k = PF.krach(sc);
  ok(k.total.creditsSupplementaires > 0 && k.total.recettesPerdues > 0, 'krach ' + sc + ' : crédits supplémentaires et recettes perdues positifs');
  ok(k.total.coutUltime < k.total.creditsSupplementaires, 'krach ' + sc + ' : coût ultime < crédits créés (imputation partielle)');
  proche(k.total.coutUltime, k.parActif.portefeuille.coutUltime + k.parActif.crypto.coutUltime + k.parActif.entreprise.coutUltime, 1e-9, 'krach ' + sc + ' : total = somme');
});

// Résultats centraux : bornes de plausibilité (pas des prédictions)
ok(B.central.parActif.assuranceVie.recettesActuelles > 4 && B.central.parActif.assuranceVie.recettesActuelles < 10, 'assurance-vie : recettes actuelles de l\'ordre de 5 à 10 Md€ (PS + IR)');
ok(B.central.parActif.dividendes.recettesActuelles > 6 && B.central.parActif.dividendes.recettesActuelles < 9, 'dividendes : recettes actuelles 6 à 9 Md€ (31,4 % de 24 Md€, V6000)');
ok(B.central.parActif.per.soldeActuel < 0, 'PER : aujourd\'hui, la déduction coûte plus que les sorties ne rapportent (régime jeune)');
ok(PF.cessionEntreprise('central').recettesNouvelles < 0.5 && PF.cessionEntreprise('central').recettesNouvelles > -1, 'cession d\'entreprise : à ε = 1,5, passer de 28 % à 50 % ne rapporte presque rien (taux maximisant 40 %)');
proche(PF.cessionEntreprise('central').tauxMaximisant, 0.4, 1e-12, 'cession d\'entreprise central : taux maximisant la recette = 40 %');
ok(PF.crypto('bas').recettesNouvelles < 0.2, 'crypto bas : pas de gain sur l\'assiette déclarée seule');

// ---- Report 150-0 B ter : données DGFiP, options (a) (b) (c) (methode.md § 27, resultats.md § 25) ----
var R = PF.REPORT150, RP = PF.R150P;
proche(R.stock[4], 173.268, 0, 'report 150-0 B ter : stock fin 2024 = 173,268 Md€ (DGFiP, rapport AN n° 3056 p. 178)');
proche(R.stock[4] / R.stock[0] - 1, 1.20, 0.01, 'stock : +120 % en 4 ans (78,8 à 173,3), chiffre du rapport');
proche(R.flux.slice(2).reduce(function (a, x) { return a + x; }, 0) / 3, 24.7, 0.05, 'flux moyen 2022-2024 = 24,7 Md€');
proche(R.flux[3] + R.flux[2] + R.flux[1] + R.flux[0] + R.flux[4], 101.4, 0.1, 'flux cumulé 2020-2024 = 101,4 Md€');
proche(R.sorties.reduce(function (a, x) { return a + x; }, 0), 3.374, 1e-9, 'sorties cumulées 2020-2024 = 3,374 Md€ (3,3 % des entrées)');
proche(R.sorties.reduce(function (a, x) { return a + x; }, 0) / R.flux.reduce(function (a, x) { return a + x; }, 0), 0.033, 0.001, 'part des entrées 2020-2024 sortie du report : 3,3 %');
ok(PF.ecartStock().every(function (e) { return Math.abs(e) < 3; }), 'stock(n−1) + flux − sorties diffère du stock de moins de 3 Md€ chaque année (8UT : majorant, abattements)');
ok(R.partDernierDecile2023 > 0.92 && R.partDernierDecile2023 < 0.94, 'flux 2023 : 93 % dans le dernier décile de RFR');
proche(R.fluxTop2023 / R.flux[3], 0.70, 0.01, '84 foyers = 23,5 Md€ = 70 % du flux 2023 (« plus des deux tiers »)');
proche(R.ipp.revenuEco, 47.588, 0.001, 'IPP : 75 foyers × 634,5 M€ de revenu économique moyen = 47,6 Md€');
proche(R.ipp.revenuFiscal, 2.012, 0.001, 'IPP : 75 foyers × 26,8 M€ de revenu fiscal moyen = 2,0 Md€ (4 % du revenu économique)');
proche(R.qpfcPlusValues * R.tauxIS, 0.03, 1e-12, 'holding : cession de titres de participation = QPFC 12 % × IS 25 % = 3 % effectif');
SC.forEach(function (sc) {
  var o = PF.report150Options(sc), p = RP[sc];
  proche(o.a.tauxEffectifActuel, p.pi * 0.314, 1e-12, '(a) taux effectif actuel = π × 31,4 % (' + sc + ')');
  ok(o.a.recettesNouvelles > 0 && o.a.recettesNouvelles < 0.5 * p.F, '(a) flux : recette positive et inférieure à 50 % du flux (' + sc + ')');
  var sc0 = PF.report150Flux(sc, { sansComportement: true });
  ok(sc0.recettesBrutes > o.a.recettesBrutes, '(a) le comportement réduit la recette brute (' + sc + ')');
  proche(sc0.recettesBrutes, 0.5 * p.F / (1 - p.rho * K.uActuel), 1e-9, '(a) sans comportement : 50 % des gains bruts, soit le flux majoré des pertes (' + sc + ')');
  proche(PF.report150Flux(sc, { t: 0.3 }).recettesBrutes / PF.report150Flux(sc, { t: 0.3 }).base, 0.3, 1e-12, '(a) recette brute = t × base (' + sc + ')');
  var st = PF.report150Stock(sc);
  proche(st.total, 0.5 * 173.268 * p.kappa * p.psiStock, 1e-9, '(a) stock : t × S × κ × ψ (' + sc + ')');
  ok(st.total < PF.stockReport(173.268, 1), '(a) stock : recouvrement inférieur à l\'impôt latent maximal 86,6 Md€ (' + sc + ')');
  proche(PF.report150Stock(sc, { S: 100, t: 0.4 }).impotLatent, 0.4 * 100 * p.kappa, 1e-9, '(a) stock : impôt latent = t × S × κ (' + sc + ')');
  var c = PF.report150Deces(sc);
  proche(c.annuel, 0.5 * 173.268 * p.kappa * p.mu * p.psiDeces, 1e-9, '(c) recette annuelle = t × S × κ × μ × ψ (' + sc + ')');
  ok(PF.report150Deces(sc, { annees: 10 }).annuel > c.annuel, '(c) le stock croît : la recette annuelle augmente avec l\'horizon (' + sc + ')');
  ok(c.annuel < o.aStock.total, '(c) la recette annuelle est une fraction du recouvrement unique du stock (' + sc + ')');
  ok(c.echappeSurVingtAns > 0 && c.echappeSurVingtAns < 0.314 * 173.268, '(c) impôt échappant en 20 ans : positif et inférieur à l\'impôt latent à 31,4 % (' + sc + ')');
  proche(o.ac, o.a.recettesNouvelles + c.annuel, 1e-12, '(a)+(c) cumulables : somme du flux et du stock (' + sc + ')');
  proche(o.b1.recettesBrutes, 0.02 * p.A, 1e-12, '(b1) 2 % de l\'assiette (' + sc + ')');
  ok(o.b1.recettesNettes < o.b1.recettesBrutes, '(b1) l\'évitement et le départ réduisent la recette (' + sc + ')');
  ok(PF.holdingsTaxe(sc, { sansComportement: true }).recettesNettes === o.b1.recettesBrutes, '(b1) sans comportement = brut (' + sc + ')');
  proche(o.b2.statique, (0.40 - 0.262) * 47.588, 1e-3, '(b2) plancher à 40 % : (40 % − 26,2 %) × 47,6 Md€ = 6,6 Md€ (' + sc + ')');
  proche(o.b2.net, o.b2.statique * (1 - p.fuitePlancher), 1e-12, '(b2) net = statique × (1 − fuite) (' + sc + ')');
  ok(PF.plancherRevenu(sc, { plancher: 0.2 }).statique === 0, '(b2) plancher sous le taux actuel : rien (' + sc + ')');
});
// Ordre des scénarios : « bas » défavorable au solde public
['recettesNouvelles'].forEach(function () {
  var a = SC.map(function (s) { return PF.report150Flux(s).recettesNouvelles; });
  ok(a[0] < a[1] && a[1] < a[2], '(a) flux : bas < central < haut');
  var b = SC.map(function (s) { return PF.report150Stock(s).total; });
  ok(b[0] < b[1] && b[1] < b[2], '(a) stock : bas < central < haut');
  var c2 = SC.map(function (s) { return PF.report150Deces(s).annuel; });
  ok(c2[0] < c2[1] && c2[1] < c2[2], '(c) : bas < central < haut');
  var d = SC.map(function (s) { return PF.holdingsTaxe(s).recettesNettes; });
  ok(d[0] < d[1] && d[1] < d[2], '(b1) : bas < central < haut');
});
// Convention du § 26 (taux actuel 30 %, ε 1,5, η 8 %, F = 24,7) : l'ordre de grandeur de 6,6 Md€ est retrouvé
proche(PF.report150Flux('central', { tauA: 0.30 }).recettesBrutes, 6.8, 0.3, '(a) convention du § 26 (m calculé avec un taux actuel de 30 %) : recette brute de l\'ordre de 7 Md€/an (§ 26 : +6,6, sans le gross-up des pertes)');
ok(PF.report150Flux('central').recettesBrutes < PF.report150Flux('central', { tauA: 0.30 }).recettesBrutes, '(a) le taux actuel effectif de 2 % (et non 30 %) réduit la recette brute : le verrouillage est plus fort');
// Taux maximisant : à ε = 1,5 le sommet de la courbe est à 40 % : à 50 % la recette du flux est inférieure à celle à 40 %
ok(PF.report150Flux('central', { t: 0.4 }).recettesNouvelles > PF.report150Flux('central', { t: 0.5 }).recettesNouvelles, '(a) central : 40 % rapporte plus que 50 % (ε = 1,5)');
// Les fonctions du report ne modifient pas le bilan par défaut
proche(PF.bilan('central').soldeNet, B.central.soldeNet, 1e-12, 'le bilan par défaut est inchangé par les fonctions du report 150-0 B ter');

log('\n' + n + ' contrôles au vert');
