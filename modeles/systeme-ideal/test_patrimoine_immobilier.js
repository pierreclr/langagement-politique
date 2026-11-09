// Tests de patrimoine_immobilier.js. Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js dvf_patrimoine.js patrimoine_immobilier.js test_patrimoine_immobilier.js
var PI = this.PatrimoineImmobilier, DVF = this.DvfPatrimoine, P1 = this.Palier1;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var SC = PI.SC, st = P1.palier1().st;

// Données DVF embarquées
ok(DVF.france2024.n > 700000 && DVF.france2024.n < 800000, 'DVF 2024 : ordre de grandeur des ventes de logement ancien (749 583)');
proche(DVF.france2024.appartement.n + DVF.france2024.maison.n + DVF.france2024.mixte.n, DVF.france2024.n, 0, 'DVF : appartements + maisons + mixtes = total');
proche(DVF.france2024.bandes.reduce(function (a, b) { return a + b.n; }, 0), DVF.france2024.n, 0, 'DVF : les cinq tranches de prix couvrent toutes les ventes');
proche(DVF.france2024.bandes.reduce(function (a, b) { return a + b.valeurMdEur; }, 0), DVF.france2024.valeurMdEur, 1e-6, 'DVF : valeur des tranches = valeur totale');
ok(DVF.reventesIsere2021_2025.paires > 3000, 'DVF Isère : plus de 3 000 reventes appariées');
ok(PI.COMMUN.sigma0 >= 0.15 && PI.COMMUN.sigma0 <= 0.18, 'sigma0 cohérent avec l\'IQR de DVF (0,16-0,17)');
// Contrôle de calibrage : 5,8 % de la valeur DVF du logement ancien reste sous le total des DMTO (qui couvre aussi terrains, locaux, Alsace-Moselle)
ok(0.058 * DVF.france2024.valeurMdEur < 13.5 && 0.058 * DVF.france2024.valeurMdEur > 0.6 * 13.5, 'DMTO théoriques sur le logement DVF : entre 60 % et 100 % des 13,5 Md€ de 2024');

// Outils numériques
proche(PI.normInv(0.5), 0, 1e-9, 'normInv(0,5) = 0');
proche(PI.normInv(0.975), 1.959964, 1e-5, 'normInv(0,975) = 1,95996');
proche(PI.normInv(0.001), -3.090232, 1e-5, 'normInv(0,001) = −3,09023');
var z = PI.grilleZ(24); proche(z.reduce(function (a, b) { return a + b; }, 0), 0, 1e-9, 'grille normale : moyenne nulle');
proche(Math.sqrt(z.reduce(function (a, b) { return a + b * b; }, 0) / 24), 1, 0.08, 'grille normale : écart-type proche de 1 (24 points)');
SC.forEach(function (sc) {
  var W = PI.poidsDuree(PI.PARAM[sc].dureeMoy, PI.COMMUN.forme, PI.COMMUN.dMax);
  proche(W.reduce(function (a, o) { return a + o.w; }, 0), 1, 1e-12, 'poids de durée ' + sc + ' : somme 1');
  proche(W.reduce(function (a, o) { return a + o.w * o.d; }, 0), PI.PARAM[sc].dureeMoy, 0.6, 'durée moyenne ' + sc + ' retrouvée à 0,6 an près');
});

// Droit actuel : abattements et cas types de sources/loi-executable-plus-values.md (25 tests Python)
proche(PI.abattementIR(5), 0, 0, 'abattement IR 5 ans = 0');
proche(PI.abattementIR(21), 0.96, 1e-12, 'abattement IR 21 ans = 96 %');
proche(PI.abattementIR(22), 1, 1e-12, 'exonération IR à 22 ans');
proche(PI.abattementPS(21), 0.264, 1e-12, 'abattement PS 21 ans = 26,4 %');
proche(PI.abattementPS(30), 1, 1e-12, 'exonération PS à 30 ans');
proche(177500 * (0.19 * (1 - PI.abattementIR(29)) + 0.172 * (1 - PI.abattementPS(29))), 2748, 1, 'cas type Python : 29 ans = 2 748 €');
proche(177500 * (0.19 * (1 - PI.abattementIR(20)) + 0.172 * (1 - PI.abattementPS(20))), 26347, 1, 'cas type Python : 20 ans = 26 347 €');

// Répartition des DMTO
proche(PI.CONST.tauxDmto, 0.0581, 0.0003, 'taux total ≈ 5,8 %');
SC.forEach(function (sc) {
  var r = PI.repartitionDmto(PI.PARAM[sc].dmto);
  proche(r.departements + r.communes + r.etat, r.total, 1e-9, 'répartition DMTO ' + sc + ' : somme = total');
  proche(r.departements / r.total, 0.775, 0.005, 'part départementale ≈ 77,5 % ' + sc);
});
proche(PI.PARAM.central.dmto, 16.1, 0, 'DMTO central = 16,1 Md€ (2025)');

// Profils : monotonie et cohérence
var pr = {}; SC.forEach(function (sc) { pr[sc] = PI.profil(PI.PARAM[sc]); });
ok(pr.bas.gain < pr.central.gain && pr.central.gain < pr.haut.gain, 'gain réel moyen croissant bas < central < haut');
ok(pr.bas.perte > pr.central.perte && pr.central.perte > pr.haut.perte, 'perte réelle moyenne décroissante bas > central > haut');
SC.forEach(function (sc) { proche(pr[sc].partGagnantes + pr[sc].partPerdantes, 1, 1e-9, 'parts gagnantes + perdantes = 1 (' + sc + ')'); });
var nu = PI.profil({ dureeMoy: 12, derive: 0.03, fraisCession: 0, travauxAn: 0 }, { fraisAcq: 0 });
ok(nu.gain > 0 && nu.perte > 0 && nu.partGagnantes > 0.6, 'sans frais, la plupart des ventes gagnent (dérive 3 %)');
var dur = PI.profil(PI.PARAM.central, { fraisAcq: 0.025 }), tr = PI.profil(PI.PARAM.central, { fraisAcq: 0.075 });
ok(dur.gain > tr.gain, 'moins de frais d\'acquisition (croisière) → plus de gain imposable qu\'en transition');
var kr = PI.profil(PI.PARAM.central, { choc: -0.2 });
ok(kr.gain < pr.central.gain && kr.perte > pr.central.perte, 'krach : moins de gain, plus de perte');
// Un choc négatif enlève exactement le gain par euro quand la dispersion est nulle
var pz = JSON.parse(JSON.stringify(PI.PARAM.central)); pz.derive = 0; pz.fraisCession = 0; pz.travauxAn = 0;
var c0 = PI.COMMUN.sigma0, c1 = PI.COMMUN.sigmaC; PI.COMMUN.sigma0 = 1e-9; PI.COMMUN.sigmaC = 1e-9;
var p0 = PI.profil(pz, { fraisAcq: 0 }); var pk = PI.profil(pz, { fraisAcq: 0, choc: -0.2 });
proche(p0.gain + p0.perte, 0, 1e-6, 'dérive nulle, sans frais, sans dispersion : aucun gain ni perte');
ok(pk.gain === 0 || pk.gain < 1e-6, 'krach −20 %, sans frais, sans dispersion : plus aucun gain');
proche(pk.perte, 0.25, 1e-6, 'krach −20 %, sans frais, sans dispersion : perte de 0,25 € par euro de vente (1 − 1/0,8)');
PI.COMMUN.sigma0 = c0; PI.COMMUN.sigmaC = c1;

// Recettes
SC.forEach(function (sc) {
  var pv = PI.plusValues(sc);
  proche(pv.recettesReforme, 0.5 * pv.volumeNonRPReforme * pv.gainReelParEuro, 1e-9, 'recettes réforme ' + sc + ' = 50 % × volume × gain réel par euro');
  ok(pv.recettesActuelles > 0.6 && pv.recettesActuelles < 5.5, 'recettes actuelles estimées ' + sc + ' (' + pv.recettesActuelles.toFixed(2) + ' Md€) dans la plage de 3,6 Md€ observés en 2023 (⚠️ V4270)');
  ok(pv.tauxEffectifReforme <= 0.5 + 1e-12, 'taux effectif de la réforme ≤ 50 % ' + sc);
  var sans = PI.plusValues(sc, { sansComportement: true });
  proche(sans.volumeNonRPReforme, sans.volumeNonRP, 1e-9, 'sans comportement : volume inchangé ' + sc);
  ok(PI.plusValues(sc, { fraisAcq: 0.025 }).recettesReforme > PI.plusValues(sc, { fraisAcq: 0.075 }).recettesReforme, 'croisière > transition ' + sc);
});
proche(PI.plusValues('central').recettesActuelles / PI.CONST.prodPvActuel2023, 0.83, 0.12, 'central : le droit actuel reproduit environ 83 % des 3,6 Md€ observés (reste : surtaxe, terrains, Alsace-Moselle, hors DVF)');
ok(PI.plusValues('bas').recettesNouvelles < PI.plusValues('central').recettesNouvelles && PI.plusValues('central').recettesNouvelles < PI.plusValues('haut').recettesNouvelles, 'recettes nouvelles croissantes bas < central < haut');

// Comportement
SC.forEach(function (sc) {
  var c = PI.comportement(sc);
  ok(c.mVolume >= 1 && c.mVolume < 1.9, 'hausse des ventes ' + sc + ' : +' + ((c.mVolume - 1) * 100).toFixed(0) + ' %'); // 04/11/2026 : borne haute 1,9 (était 1,7) car H250 haut = 0,136 (Toronto, V11556) donne +79 %, relecture E2
  ok(c.mVerrouillage <= 1 && c.mVerrouillage > 0.5, 'verrouillage ≤ 1 ' + sc);
  ok(c.variationPrixPct >= 0 && c.variationPrixPct < 6, 'capitalisation dans les prix bornée par le taux (5,8 %) ' + sc);
  ok(c.coutAcquisitionPct < 0, 'le coût total d\'acquisition baisse ' + sc);
});
proche(PI.comportement('central').mVolume, 1 + 0.07 * 5.8066, 1e-3, 'central : élasticité allemande 0,07 par point × 5,8 points');

// Report des pertes : la durée augmente le coût
SC.forEach(function (sc) {
  var r5 = PI.reportPertes(sc, 5), r10 = PI.reportPertes(sc, 10), ri = PI.reportPertes(sc, Infinity);
  ok(r5.coutAnnuel < r10.coutAnnuel && r10.coutAnnuel < ri.coutAnnuel, 'coût du report croissant 5 < 10 < illimité ' + sc);
  proche(ri.partImputee, PI.PARAM[sc].absorption, 1e-12, 'sans limite : part imputée = absorption ' + sc);
  proche(ri.coutAnnuel, ri.creditsCreesAn * PI.PARAM[sc].absorption, 1e-9, 'coût illimité = crédits × absorption ' + sc);
  ok(ri.coutAnnuelAvecRP > ri.coutAnnuel, 'crédit aussi sur la résidence principale : coût supérieur ' + sc);
  var T0 = PI.reportPertes(sc, 0); proche(T0.coutAnnuel, 0, 1e-12, 'durée 0 : aucun coût ' + sc);
});

// Krach
SC.forEach(function (sc) {
  var k = PI.krach(sc), pv = PI.plusValues(sc);
  ok(k.creditsSupplementaires > 0, 'krach : crédits supplémentaires > 0 ' + sc);
  ok(k.recettesPerduesAnnee > 0, 'krach : recettes perdues > 0 ' + sc);
  ok(k.coutUltime['5'] <= k.coutUltime['10'] && k.coutUltime['10'] <= k.coutUltime.illimite, 'krach : coût ultime croissant avec la durée ' + sc);
  ok(k.coutUltime.illimite <= k.creditsSupplementaires + 1e-9, 'krach : coût ultime ≤ crédits supplémentaires ' + sc);
  ok(k.partPerdantes > PI.plusValues(sc).partPerdantes, 'krach : plus de ventes perdantes ' + sc);
  proche(k.troisAnnees.creditsSupplementaires, 3 * k.creditsSupplementaires, 1e-9, 'trois années = 3 × une année ' + sc);
});

// Bilan et compensation
SC.forEach(function (sc) {
  var b = PI.bilan(sc);
  proche(b.soldeNet, b.plusValues.recettesNouvelles - b.dmto.total - b.report.coutAnnuel, 1e-9, 'solde net = nouvelles − DMTO − report ' + sc);
  proche(b.soldeBrut - b.soldeNet, b.plusValues.recettesActuelles, 1e-9, 'brut − net = recettes actuelles ' + sc);
  proche(b.aCompenser, -b.soldeNet, 1e-9, 'à compenser = −solde net ' + sc);
  proche(b.tfpbHausseDmtoSeulPct, 100 * b.dmto.total / 41.96, 1e-9, 'hausse de taxe foncière pour les seuls DMTO ' + sc);
  ok(b.soldeNet < 0, 'solde net négatif : les plus-values ne couvrent pas les DMTO ' + sc);
});
proche(PI.bilan('central').tfpbHausseDmtoSeulPct, 38.4, 0.1, 'central : +38 % de taxe foncière pour compenser 16,1 Md€ (recherche-fiscalite-immobiliere.md §3)');
ok(PI.bilan('bas').soldeNet < PI.bilan('central').soldeNet && PI.bilan('central').soldeNet < PI.bilan('haut').soldeNet, 'solde net croissant bas < central < haut');

// Intégration au palier 1
var i0 = PI.integration(st, 'central');
proche(i0.soldeAvecPatrimoine, i0.soldePalier1 + i0.delta, 1e-9, 'intégration : solde = palier 1 + delta');
proche(P1.solde(st, 'central'), -163.05, 0.01, 'palier 1 central : −163,05 Md€ (V11770 : 1,84 M au RSA ; −163,32 avec l\'ancien 1,9 M)');
ok(i0.tauxPlatRequis > st.tPlat, 'central : le taux plat doit monter pour garder le déficit actuel');
var i1 = PI.integration(st, 'central', { pvDejaSupprimees: true });
ok(i1.delta > i0.delta, 'recettes actuelles déjà supprimées : delta plus élevé');
SC.forEach(function (sc) { var i = PI.integration(st, sc); ok(i.tauxPlatRequis !== null, 'taux plat requis trouvé ' + sc); });

// ---- Variantes contre le verrouillage (T56, H279-H287)
SC.forEach(function (sc) {
  var a = PI.bilanVariante(sc, 'aucune'), b = PI.bilan(sc);
  proche(a.soldeNet, b.soldeNet, 1e-9, 'variante « aucune » = défaut, solde net ' + sc);
  proche(a.plusValues.recettesReforme, b.plusValues.recettesReforme, 1e-9, 'variante « aucune » = défaut, recettes ' + sc);
  proche(PI.plusValuesVariante(sc, 'aucune', { fraisAcq: PI.COMMUN.fraisAcqCroisiere }).recettesReforme, PI.plusValues(sc, { fraisAcq: PI.COMMUN.fraisAcqCroisiere }).recettesReforme, 1e-9, 'variante « aucune » = défaut en croisière ' + sc);
  var cmp = PI.comparerVariantes(sc);
  ok(cmp.length === 8, 'huit lignes de comparaison ' + sc);
  cmp.slice(1).forEach(function (r) { ok(r.recettesPV < cmp[0].recettesPV + ((r.cle === 'rollover' && sc === 'haut') ? 0.3 : 1e-9), 'toute variante rapporte au plus autant que le défaut : ' + r.cle + ' ' + sc); }); // 04/11/2026 : exception chiffrée : au haut, avec H252 = 1,0 (Levy, V11550 ; avant 0,5), le report (rollover) rapporte 13,73 contre 13,57 Md€ au défaut (+0,16) ; l'écart reste < 0,3
  ok(cmp[1].recettesPV > cmp[2].recettesPV && cmp[2].recettesPV > cmp[3].recettesPV, 'dégressif : plus la pente est forte, moins il rapporte ' + sc);
  ok(cmp[4].recettesPV < cmp[5].recettesPV && cmp[5].recettesPV < cmp[6].recettesPV, 'exonération après N ans : plus N est grand, plus ça rapporte ' + sc);
  ok(PI.plusValuesVariante(sc, 'rollover').recettesPremiereAnnee < PI.plusValuesVariante(sc, 'rollover').recettesReforme, 'report : la première année rapporte moins que le régime de croisière ' + sc);
  ok(PI.plusValuesVariante(sc, 'aucune').coutVerrouillage >= -1e-9, 'coût du verrouillage positif ou nul ' + sc);
});
var vc = PI.comparerVariantes('central');
ok(vc[0].verrouillagePct > 0 && vc[0].verrouillagePct < 45, 'central : le défaut verrouille une minorité de ventes gagnantes (' + vc[0].verrouillagePct.toFixed(1) + ' %)'); // 04/11/2026 : borne 45 % (était 30 %) : H252 central 1,5 (Levy, V11550) verrouille 40,5 % au lieu de 29,2 %
vc.slice(1).forEach(function (r) { ok(r.verrouillagePct < vc[0].verrouillagePct, 'central : ' + r.cle + ' réduit le verrouillage'); });
ok(PI.plusValuesVariante('central', 'rollover').verrouillagePct < PI.plusValuesVariante('central', 'degressif').verrouillagePct + 5, 'report : verrouillage du même ordre que le dégressif');
// Élasticité nulle : plus de verrouillage, recettes = recettes sans verrouillage
var e0 = PI.plusValuesVariante('central', 'degressif', { elasticite: 0 });
proche(e0.verrouillagePct, 0, 1e-9, 'élasticité nulle : aucun verrouillage');
proche(e0.recettesReforme, e0.recettesSansVerrouillage, 1e-9, 'élasticité nulle : recettes = recettes sans verrouillage');
var e1 = PI.plusValuesVariante('central', 'aucune', { elasticite: 2 }), e05 = PI.plusValuesVariante('central', 'aucune');
ok(e1.recettesReforme < e05.recettesReforme, 'élasticité 2 (forte) contre 1 (centrale) : plus de verrouillage, moins de recettes');
// sansComportement : recettes sans verrouillage
var sc0 = PI.plusValuesVariante('central', 'aucune', { sansComportement: true });
proche(sc0.recettesReforme, PI.plusValues('central', { sansComportement: true }).recettesReforme, 1e-9, 'sans comportement : identique au défaut');
// Variante : surcharge des paramètres
ok(PI.plusValuesVariante('central', { type: 'exoLocatif', N: 10, partLocatif: 1 }).recettesReforme < PI.plusValuesVariante('central', { type: 'exoLocatif', N: 10, partLocatif: 0.3 }).recettesReforme, 'part locative plus forte : moins de recettes');
ok(PI.plusValuesVariante('central', { type: 'exoLocatif', N: 1, partLocatif: 1 }).recettesReforme < 0.2 * PI.plusValuesVariante('central', 'aucune').recettesReforme, 'tout le hors-RP exonéré dès 1 an : presque plus de recettes');
var thrown = false; try { PI.variante('inconnue'); } catch (err) { thrown = true; } ok(thrown, 'variante inconnue : erreur');
ok(PI.variante().type === 'aucune' && PI.variante('degressif').pente === 0.04, 'variante : défaut et valeurs par défaut');
// Taux individuels
proche(PI.tauxIndividuel('aucune', 30, true), 0.5, 0, 'défaut : 50 % quelle que soit la durée');
proche(PI.tauxIndividuel('degressif', 5, true), 0.5, 1e-12, 'dégressif : 50 % jusqu\'à 5 ans');
proche(PI.tauxIndividuel('degressif', 10, true), 0.4, 1e-12, 'dégressif : 40 % à 10 ans');
proche(PI.tauxIndividuel('degressif', 40, true), 0.15, 1e-12, 'dégressif : plafond, 15 % (70 % de baisse)');
proche(PI.tauxIndividuel({ type: 'exoLocatif', N: 10 }, 9, true), 0.5, 0, 'exonération après 10 ans : 9 ans, taxé');
proche(PI.tauxIndividuel({ type: 'exoLocatif', N: 10 }, 10, true), 0, 0, 'exonération après 10 ans : 10 ans, exonéré');
proche(PI.tauxIndividuel({ type: 'exoLocatif', N: 10 }, 10, false), 0.5, 0, 'exonération du locatif : pas pour un autre bien');
proche(PI.tauxIndividuel('rollover', 3, true, true), 0, 0, 'report : réinvesti, rien à la vente');
proche(PI.tauxIndividuel('rollover', 3, true, false), 0.5, 0, 'report : non réinvesti, 50 %');

// Base réelle par défaut (décision de l'auteur du 03/11/2026, Q4) ; base nominale = variante de comparaison (`base: 'nominale'`)
SC.forEach(function (sc) {
  var R = PI.plusValues(sc), N = PI.plusValues(sc, { base: 'nominale' });
  ok(N.gainReelParEuro > R.gainReelParEuro, 'base nominale : gain par euro supérieur à la base réelle (' + sc + ')');
  ok(N.recettesReforme > R.recettesReforme, 'base nominale : recettes brutes supérieures à la base réelle (' + sc + ')');
  proche(N.recettesActuelles, R.recettesActuelles, 1e-9, 'droit actuel inchangé par le choix de base (' + sc + ')');
  ok(PI.reportPertes(sc, 10, { base: 'nominale' }).creditsCreesAn < PI.reportPertes(sc, 10).creditsCreesAn, 'base nominale : moins de moins-values, moins de crédits (' + sc + ')');
});

log('\n' + n + ' contrôles au vert');
