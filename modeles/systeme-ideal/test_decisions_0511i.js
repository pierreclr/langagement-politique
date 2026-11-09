// Tests de la v5.9 (decisions_0511i.js) : A. couple à deux Smic (diagnostic v5.8 et solutions financées par le haut, RIEN d'adopté) ; B. bascule neutre des collectivités (ADOPTÉE). Depuis ce dossier, avec jsc :
//   LIST=(la liste de test_decisions_0511h.js, de modele.js à decisions_0511h.js, puis) diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js test_decisions_0511i.js
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//   ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js test_decisions_0511i.js
// (en zsh : passer la liste par un tableau ; ../retraites/modele.js, ../fiscalite-orientation/modele.js et modele.js sont trois fichiers différents)
var I = this.Decisions0511i, H = this.Decisions0511h, C = this.Decisions0511c, X = this.DiagnosticCoupleSmic, Z = this.Optimum, HR = this.HautsRevenus, CO = this.Correctifs, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0, SC = ['bas', 'central', 'haut'];
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- A.1 Diagnostic du couple à deux Smic en v5.8
var d43 = I.diagnosticCouple(0.43), d42 = I.diagnosticCouple(0.42);
ok(I.archiBase(0.43).majParentIsole === 345 && I.archiBase(0.43).socle === 350 && X.pSys(I.archiBase(0.43)).enfant === 200, 'v5.8 : majoration 345 €, socle 350 €, 200 € par enfant');
proche(d42.ecart, -143.4, 0.05, 'à 42 % : le couple à deux Smic (2 enfants, convention égale) perd 143,4 €/mois');
proche(d43.ecart, -183.2, 0.05, 'à 43 % (2029-2044) : il perd 183,2 €/mois');
proche(d42.prelevement, -650.1, 0.1, 'à 42 % : prélèvement −650'); proche(d43.prelevement, -689.8, 0.1, 'à 43 % : prélèvement −690');
proche(d43.prelevement - d42.prelevement, -0.01 * d43.coutEmployeur, 0.01, 'un point de taux coûte au couple 1 % de son coût employeur (39,8 €)');
proche(d42.ppa, -368.3, 0.05, 'prime d\'activité perdue −368'); proche(d42.prestationsFamilialesPerdues, 225.05, 0.01, 'allocations familiales et ARS perdues 225');
ok(d42.socle === 700 && d42.enfants === 400 && d42.complement === 0, 'socle +700, enfants +400, complément dégressif 0 (le plancher du ménage est dépassé)');
proche(d42.tauxActuel, 0.2565, 0.001, 'prélèvement actuel ≈ 25,6 % du coût employeur (allègements généraux)');
proche(d42.prelevement + d42.ppa - d42.prestationsFamilialesPerdues + d42.enfants + d42.socle + d42.complement, d42.ecart, 0.02, 'la décomposition somme à l\'écart (à la ligne « autres » près, 0,01 €)');
var base43 = I.casTypes(I.archiBase(0.43)), base42 = I.casTypes(I.archiBase(0.42));
proche(base42.couple_2smic_2enf, d42.ecart, 1e-6, 'casTypes() reproduit le diagnostic');
proche(base42.couple_2smic_0enf, -82.5, 0.1, 'couple sans enfant à 42 % : −82,5 (inchangé depuis la v5.3)');
proche(base42.parent_isole_smic, 2.5, 0.2, 'parent isolé au Smic à 42 % : +2,5 (majoration 345 €)'); ok(base43.parent_isole_smic < 0, 'parent isolé au Smic à 43 % : perd (' + base43.parent_isole_smic + ')');
proche(I.avant('parent_isole_smic', I.archiBase(0.42)), 2590.35, 0.01, 'parent isolé : avant de l\'atlas du modèle 2 590,35 € (OpenFisca direct 2 579,61, écart 10,7 €, ⚠️)');
ok(base42.couple_median_2enf > 300 && base42.cadre_5000 > 0 && base42.cadre_10000 < 0 && base42.cadre_20000 < base42.cadre_10000, 'sans correctif : le couple médian et le cadre à 5 000 € gagnent, les cadres à 10 000 et 20 000 € perdent');
proche(I.coutMois(1867.02), X.COUT_SMIC, 1e-9, 'coût employeur du Smic = convention du modèle (1 987,76 €)');
// ---------- A.2 Le haut de la distribution
var a43 = I.archiBase(0.43), a42 = I.archiBase(0.42);
proche(I.marginalMax(a42, {}).taux, 0.72, 0.001, 'taux marginal maximal de la v5.8 à 42 % : 72 % (42 + 30)'); proche(I.marginalMax(a43, {}).taux, 0.73, 0.001, 'à 43 % : 73 %');
var p = HR.corr({ t2: 0.05, R1: 60000 }); proche(I.recetteHaut(a42, 'central', p).netMd, HR.extra(this.GagnantsPerdantsPalier1.config(Z.versOF(Z.archi(a42))).p, 'central', p).netMd, 1e-9, 'recetteHaut reproduit hauts_revenus.js extra() pour un second coude');
proche(I.impotHaut(150000, { tH: 0.02, S: 100000 }, 350), 1000, 1e-9, 'tranche haute : 2 % de la part au-dessus de 100 000 €');
proche(I.impotHaut(12 * 6000, { ra: 4000, rb: 8000 }, 350), 12 * 350 * 0.5, 1e-9, 'reprise du socle : moitié reprise au milieu de la zone');
var th100 = I.trancheHaute(a43, 1, 100000), th60 = I.trancheHaute(a43, 100, 60000);
ok(th100.maxRecette <= 0.01, 'CONSTAT : une tranche haute au-delà de 100 000 € ne rapporte rien au central (taux marginal déjà au-delà du maximum de recette, élasticité D10 0,31)');
ok(th60.maxRecette < 6 && th60.tHMax > th60.tHPlafond, 'au-delà de 60 000 € : au plus ≈ 5 Md€, à un taux qui dépasse le plafond de 75 %');
proche(th60.tHPlafond, 0.02, 0.0005, 'marge sous le plafond de 75 % à 43 % : 2 points');
// ---------- A.3 Solutions
var sa = I.solution('a'), sb = I.solution('b'), sbR = I.solution('bR'), sc = I.solution('c'), sd = I.solution('d'), s0 = I.solution('a0'), sT = I.solution('aT');
proche(sa.cout.central, 16.10, 0.01, '(a) bonus de 100 € : 16,1 Md€ (12,8 à 17,3)'); proche(sa.cout.bas, 12.79, 0.01, '(a) coût favorable'); proche(sa.cout.haut, 17.30, 0.01, '(a) coût défavorable');
ok(sa.finance && Math.abs(sa.residu.central) < 0.05, '(a) financé au central par la reprise du socle (solde inchangé)');
ok(sa.c.ra > 4500 && sa.c.ra < 4900 && sa.c.rb === 2 * sa.c.ra, '(a) zone de reprise ≈ 4 700 à 9 400 € de revenu mensuel individuel (obtenu ' + sa.c.ra + ')');
ok(I.marginalMax(sa.a, sa.c).taux <= 0.75, '(a) sous le plafond de 75 % (' + I.marginalMax(sa.a, sa.c).taux + ')');
var ta = I.touches(sa.a, sa.c); ok(ta.dessus > 2.5 && ta.dessus < 3.5 && ta.part > 0.3 && ta.part < 0.4, '(a) socle entièrement repris pour ≈ 3,0 M d\'adultes actifs, partiellement pour ≈ 6,4 M');
ok(!sb.finance && sb.cout.central > 38, '(b) franchise à 0 % : 38,9 Md€, NON finançable par une tranche haute');
ok(sbR.finance && sbR.c.ra < 3200, '(b bis) franchise financée par la reprise : la zone descend sous 3 200 € par mois (classes moyennes)');
ok(!sc.faitGagner && sc.taux > 0.445, '(c) aucun socle relevé ne fait gagner le couple : la hausse de taux reprend l\'essentiel');
ok(sd.finance && sd.opt.enfantDelta === 92, '(d) allocation par enfant à 292 € (+92 €)');
ok(s0.taux > 0.445 && s0.taux < 0.448, '(référence) bonus financé par le taux plat : 44,6 %'); ok(!sT.finance, '(référence) bonus financé par une tranche haute seule : impossible');
var ea = I.evaluer('a'), eb = I.evaluer('b'), ec = I.evaluer('c'), ed = I.evaluer('d'), e0 = I.evaluer('a0');
ok(ea.cas43.couple_2smic_2enf > 0 && ea.cas42.couple_2smic_2enf > 50, '(a) le couple à deux Smic gagne : +16,8 à 43 %, +56,6 à 42 %');
ok(ea.cas43.couple_2smic_0enf > 0 && ea.cas43.parent_isole_smic > 50 && ea.cas43.smic_seul > 50, '(a) couple sans enfant, parent isolé et célibataire au Smic gagnent');
ok(ea.cas43.cadre_10000 < base43.cadre_10000 - 300 && ea.cas43.cadre_20000 < base43.cadre_20000 - 300, '(a) les cadres à 10 000 et 20 000 € paient (−350 € de socle)');
ok(ea.cas43.couple_median_2enf === base43.couple_median_2enf, '(a) le couple médian n\'est pas touché');
ok(e0.cas43.couple_2smic_2enf < 0, '(référence) financé par le taux plat, le couple perd encore à 43 % : le taux reprend le bonus');
ok(ed.cas43.couple_2smic_0enf < -100, '(d) le couple sans enfant perd toujours');
ok(ec.cas43.couple_2smic_2enf < -100, '(c) variante socle 400 € : le couple perd encore');
[ea, eb, ec, ed, e0].forEach(function (e) { ok(e.tme.trappes.length === 0, 'aucune trappe à inactivité (' + e.id + ')'); ok(e.tme.local < 0.731, 'TME local au Smic sous le droit actuel (73,1 %) : ' + e.id + ' ' + e.tme.local); });
proche(ea.tme.localActuel, 0.731, 0.001, 'TME actuel de 1 à 1,1 Smic (OpenFisca) : 73,1 %');
ok(ea.tme.reprise.couple[0].tme < I.tmeSmic(a43).reprise.couple[0].tme - 0.1, '(a) second adulte du couple, 0 à mi-temps : TME de 80 % à 68 %');
ok(Math.abs(ea.dette.central.ecart10) < 0.001 && ea.dette.haut.ecart10 > 0, '(a) dette inchangée au central ; plus haute au défavorable (financement moins sûr que la dépense)');
ok(eb.dette.central.ecart10 > 0.12, '(b) non financé : +13 points de dette à 10 ans');
ok(Math.abs(ea.residu42.central) < 1, '(a) calé à 43 %, le résidu à 42 % reste < 1 Md€ (' + ea.residu42.central + ')');

if (typeof I.bascule === 'function') {
// ---------- B. Bascule des collectivités
var b43 = I.bascule(0.43), b42 = I.bascule(0.42), N = b43.niveaux;
proche(b43.total, 130.08, 1e-9, 'ressources supprimées à compenser (2024) : 130,08 Md€');
proche(N.bloc.perceAujourdhui, 70.76, 1e-9, 'bloc communal 70,76 (TF 43,26 ; CFE 8,03 ; DMTO 4,08 ; TVA 15,39)'); proche(N.departements.perceAujourdhui, 30.55, 1e-9, 'départements 30,55 (DMTO 9,86 ; TVA 20,69)');
proche(N.regions.perceAujourdhui, 16.57, 1e-9, 'régions 16,57 (DMTO 0,16 ; TVA 16,41)'); proche(N.aom.perceAujourdhui, 12.2, 1e-9, 'AOM 12,2 (versement mobilité, Insee)');
I.BASCULE.ORDRE.forEach(function (k) { proche(N[k].recu, N[k].perceAujourdhui, 1e-9, 'neutralité du niveau en 2029 : ' + k); proche(N[k].montantPU, N[k].partPU * b43.prelevementUnique, 1e-9, 'part du prélèvement unique cohérente : ' + k); });
proche(b42.prelevementUnique, 887.1594, 0.001, 'prélèvement unique à 42 % = 887,16 (bilan, ligne N02)'); ok(b43.prelevementUnique > b42.prelevementUnique, 'à 43 % il rapporte plus (897,8)');
proche(N.bloc.part1pcNette, 0.5006, 0.0005, 'bloc : 50,1 % du produit net de la taxe de 1 %'); proche(N.bloc.part1pcImmo, 0.556, 0.0005, 'soit 55,6 % de la taxe sur l\'immobilier (0,56 point du 1 %)');
proche(b43.partPUTotale, 0.0967, 0.0005, 'en 2029 : 9,67 % du prélèvement unique'); proche(b43.pointsTotal, 4.158, 0.005, 'soit 4,16 points des 43');
proche(N.bloc.partPU, 0.0306, 0.0002, 'bloc 3,06 %'); proche(N.departements.partPU, 0.0340, 0.0002, 'départements 3,40 %'); proche(N.regions.partPU, 0.0185, 0.0002, 'régions 1,85 %'); proche(N.aom.partPU, 0.0136, 0.0002, 'AOM 1,36 %');
ok(b43.effetSoldeConsolide === 0, 'bascule neutre sur le solde consolidé des APU (transfert interne)');
proche(b43.ecarts.tf, 0.36, 1e-9, 'écart TF DGCL 43,26 / Insee 42,9 = 0,36 : dégrèvements payés par l\'État, neutre');
proche(I.solde('central', 2060), H.solde('central', 2060), 1e-12, 'solde v5.9 = solde v5.8 en 2060 (+12,20)'); proche(I.solde('central', 2060), 12.195, 0.001, 'solde v5.9 croisière : +12,195');
[2029, 2041, 2050].forEach(function (y) { proche(I.solde('central', y), H.solde('central', y), 1e-12, 'solde v5.9 = v5.8 en ' + y); });
ok(H.periodeMinimale43() === 2044, 'plan de taux inchangé : 43 % de 2029 à 2044');
proche(I.BASCULE.vmChampDGCL + 6.73, 12.2, 1e-9, 'versement mobilité : 5,47 dans le champ DGCL + 6,73 hors champ (IDFM, ⚠️)');
}
log('\n' + n + ' vérifications passées (decisions_0511i.js)');
