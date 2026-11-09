// Tests de deces_realisation.js. Depuis ce dossier :
//   jsc patrimoine_financier.js deces_realisation.js test_deces_realisation.js
// (patrimoine_financier.js est facultatif : il sert aux recoupements et à vérifier que ses défauts ne bougent pas.)
var D = this.DecesRealisation, PF = this.PatrimoineFinancier || null;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var SC = D.SC, C = D.CONST, P = D.PARAM;
var avant = PF ? SC.map(function (s) { return PF.bilan(s).soldeNet; }) : null;

// Constantes sourcées
proche(C.tauxPrelevement, 0.5, 0, 'prélèvement unique 50 %');
proche(C.fluxTransmis, 300, 0, 'flux transmis 300 Md€ (CAE n° 69, p. 5)');
proche(C.avDeces2024, 43.3, 0, 'assurance-vie : 43,3 Md€ de sinistres 2024 (ACPR)');
proche(C.dmtg2024, 20.819, 1e-9, 'DMTG 2024 : 15,907 + 4,912 Md€ (Insee t_3217)');
proche(C.dutreil.exoneration, 0.75, 0, 'Dutreil : 75 % (787 B)');
ok(C.dutreil.engagementCollectif === 2 && C.dutreil.engagementIndividuel === 6, 'Dutreil : 2 ans collectif et 6 ans individuel (787 B a, c)');
proche(C.dutreil.cout2024, 5.5, 0, 'Dutreil : coût 2024 réévalué à 5,5 Md€ (Cour des comptes via rapport AN p. 165)');
proche(C.dutreil.tauxEffectifDonation, 0.75 * 0 + 0.25 * 0.5 * 0.45, 1e-4, 'Dutreil : taux effectif de donation = (1 − 75 %) × 45 % × (1 − 50 %) = 5,625 % (IPP)');
proche(C.franchise200k, 12 / 19, 1e-12, 'franchise de 200 000 € : on conserve 12 / 19 de la base (CAE)');
proche(C.elasticiteVie.pwbm, 0.53 / 0.66, 1e-12, 'OCDE note 29 : élasticité −0,66 → −0,53 (PWBM)');
proche(C.elasticiteVie.tpc, 0.4 / 0.7, 1e-12, 'OCDE note 29 : élasticité −0,7 → −0,4 (TPC)');

// Valeurs transmises et droits de succession
SC.forEach(function (s) {
  var v = D.valeurs(s), tot = v.rp + v.imm + v.titres + v.ent + v.av + v.autres;
  proche(tot, P[s].flux, 1e-9, 'valeurs par classe : somme = flux (' + s + ')');
  ok(v.autres > 0, 'la classe « autres » (liquidités, meubles) reste positive (' + s + ')');
  var tx = D.tauxDmtg(s), sd = tx.rp * v.rp + tx.imm * v.imm + tx.titres * v.titres + tx.ent * v.ent + tx.av * v.av + tx.autres * v.autres;
  proche(sd, C.dmtg2024, 1e-9, 'taux de droits calibrés : Σ τ V = DMTG 2024 (' + s + ')');
  ok(tx.av < tx.ent && tx.ent < tx.imm, 'droits effectifs : assurance-vie < entreprises (Dutreil) < immobilier (' + s + ')');
  proche(v.av, C.avDeces2024, 0, 'assurance-vie transmise = 43,3 Md€ dans les trois scénarios (' + s + ')');
});
ok(P.bas.flux < P.central.flux && P.central.flux < P.haut.flux, 'flux : bas < central < haut');
proche(D.tauxDmtg('central').lambda, 0.0684, 0.001, 'taux moyen de droits ≈ 6,8 % du flux (20,8 / 300 = 6,9 %)');

// Base réelle et nominale
proche(D.gainReel(0.5, 22, 0), 0.5, 1e-12, 'sans inflation, gain réel = gain nominal');
proche(D.gainReel(0.5, 22), 1 - 0.5 * Math.pow(1.02, 22), 1e-12, 'gain réel : prix d\'achat réindexé de 2 % par an');
proche(D.gainReel(0.5, 22), 0.2271, 0.001, 'gain réel de 50 % nominal sur 22 ans ≈ 22,7 %');
ok(D.gainReel(0.1, 30) === 0, 'rendement sous l\'inflation : gain réel borné à 0');
SC.forEach(function (s) {
  ok(D.gUtilise(s, 'imm') < P[s].imm.g, 'immobilier : base réelle par défaut, g réel < g nominal (' + s + ')');
  ['titres', 'ent', 'av'].forEach(function (k) {
    ok(D.gUtilise(s, k) < P[s][k].g, k + ' : base réelle par défaut (décision du 03/11/2026), g réel < g nominal (' + s + ')');
    proche(D.gUtilise(s, k), D.gUtilise(s, k, { reel: true }), 0, k + ' : défaut = reel: true (' + s + ')');
    proche(D.gUtilise(s, k, { reel: false }), P[s][k].g, 0, k + ' : reel: false redonne le nominal (' + s + ')');
  });
  proche(D.gUtilise(s, 'imm', { reel: false }), P[s].imm.g, 0, 'option reel: false redonne le nominal (' + s + ')');
});

// Assiette
SC.forEach(function (s) {
  var a = D.assiette(s), k, somme = 0;
  for (k in a.classes) somme += a.classes[k].gainNet;
  proche(a.totalGainNet, somme, 1e-9, 'assiette : total = somme des classes (' + s + ')');
  proche(a.totalHorsRP, a.totalGainNet - a.classes.rp.gainNet, 1e-9, 'assiette : hors RP = total − RP (' + s + ')');
  proche(a.classes.imm.gainBrut, P[s].imm.V * D.gUtilise(s, 'imm'), 1e-9, 'assiette : gain brut = V × g (' + s + ')');
  proche(a.classes.titres.moinsValues, a.classes.titres.gainBrut * P[s].titres.rho, 1e-9, 'assiette : moins-values latentes = ρ × gains (' + s + ')');
});
var A = {}; SC.forEach(function (s) { A[s] = D.assiette(s); });
ok(A.bas.totalGainNet < A.central.totalGainNet && A.central.totalGainNet < A.haut.totalGainNet, 'assiette : bas < central < haut');
ok(A.central.partDuFlux > C.usPartGainsSuccessions.petites && A.central.partDuFlux < C.usPartGainsSuccessions.grandes, 'part des gains latents dans le flux (central) entre les repères américains (13 % et 55 %)');
ok(A.central.totalGainNet > 40 && A.central.totalGainNet < 100, 'gains latents transmis par an, central : de l\'ordre de 70 Md€ (hors RP : 50 Md€)');

// Option (i)
var I = {}; SC.forEach(function (s) { I[s] = D.realisationDeces(s); });
SC.forEach(function (s) {
  var r = I[s];
  proche(r.statique, r.t * r.gainTaxable, 1e-9, '(i) statique = t × gain taxable (' + s + ')');
  proche(r.nettes, r.brutes - r.dmtgPerdus, 1e-9, '(i) net = brut − droits perdus (' + s + ')');
  ok(r.brutes < r.statique, '(i) le comportement réduit la recette (' + s + ')');
  proche(D.realisationDeces(s, { t: 0 }).nettes, 0, 1e-12, '(i) t = 0 : aucune recette (' + s + ')');
  proche(D.realisationDeces(s, { sansComportement: true }).statique, D.realisationDeces(s, { sansComportement: true, t: 0.25 }).statique * 2, 1e-9, '(i) la recette statique est linéaire en t (' + s + ')');
  ok(D.realisationDeces(s, { conjoint: false }).statique > r.statique, '(i) sans report au conjoint (règle de l\'auteur à la lettre), l\'assiette est plus large (' + s + ')');
  proche(D.realisationDeces(s, { franchise: true }).statique, r.statique * C.franchise200k, 1e-9, '(i) franchise de 200 000 € : × 12/19 (' + s + ')');
  ok(D.realisationDeces(s, { inclureRP: true }).statique > r.statique, '(i) inclure la résidence principale élargit l\'assiette (' + s + ')');
  proche(D.realisationDeces(s, { deductible: false }).nettes, r.brutes, 1e-12, '(i) sans déductibilité, net = brut (' + s + ')');
  ok(r.dmtgPerdus > 0 && r.dmtgPerdus < r.brutes * 0.35, '(i) les droits perdus par la déductibilité restent inférieurs à 35 % de la recette (' + s + ')');
});
ok(I.bas.nettes < I.central.nettes && I.central.nettes < I.haut.nettes, '(i) net : bas < central < haut');
// calcul indépendant de la classe « immobilier » au central
var imm = P.central.imm, gI = 1 - (1 - imm.g) * Math.pow(1.02, imm.d), baseI = imm.V * gI * (1 - imm.rho) * (1 - P.central.cj);
proche(I.central.parClasse.imm.gainTaxable, baseI, 1e-9, '(i) immobilier central : V g_réel (1 − ρ)(1 − conjoint), calcul indépendant');
proche(I.central.parClasse.imm.brutes, 0.5 * baseI * (1 - imm.eta), 1e-9, '(i) immobilier central : brut = 50 % × base × (1 − η)');
proche(I.central.parClasse.imm.dmtgPerdus, I.central.parClasse.imm.brutes * P.central.margDmtg, 1e-9, '(i) immobilier : droits perdus = brut × taux marginal');
proche(I.central.parClasse.ent.dmtgPerdus, I.central.parClasse.ent.brutes * P.central.margDmtg * 0.25, 1e-9, '(i) entreprises : seuls 25 % de la valeur supportent des droits (Dutreil), droits perdus × 0,25');
proche(I.central.parClasse.av.gainTaxable, P.central.av.V * D.gUtilise('central', 'av') * (1 - 0.15) * (1 - P.central.cj), 1e-9, '(i) assurance-vie : gain net de la part anticipée avant le décès (H300)');
ok(I.central.parClasse.rp === undefined && D.realisationDeces('central', { inclureRP: true }).parClasse.rp !== undefined, '(i) la résidence principale est exonérée par défaut (l\'auteur, 02/11)');
ok(I.central.nettes > 10 && I.central.nettes < 25, '(i) central : de l\'ordre de 16 Md€/an net');
ok(I.central.statique > 5 * C.usCout, '(i) l\'ordre de grandeur dépasse de loin le chiffrage américain transposé par le CAE (1,3 Md€) : écart de périmètre documenté (V5898)');

// Option (ii)
var II = {}; SC.forEach(function (s) { II[s] = D.carryover(s); });
SC.forEach(function (s) {
  var c = II[s];
  proche(c.immediat, 0, 0, '(ii) aucune recette immédiate (' + s + ')');
  proche(c.annee(0), 0, 1e-12, '(ii) année 0 : zéro (' + s + ')');
  ok(c.annee(1) < c.annee(10) && c.annee(10) < c.annee(30) && c.annee(30) < c.croisiere, '(ii) la recette monte vers la croisière sans l\'atteindre (' + s + ')');
  proche(c.annee(1000), c.croisiere, 1e-6, '(ii) limite = croisière (' + s + ')');
  proche(c.valeurActuelleRatio, c.lambda / (c.lambda + 0.03), 1e-12, '(ii) valeur actuelle = λ / (λ + r) de la croisière (' + s + ')');
  ok(c.croisiereHorsRP < c.croisiere, '(ii) la résidence principale vendue par l\'héritier ajoute à la croisière (' + s + ')');
  proche(D.carryover(s, { rpVendue: 0 }).croisiere, c.croisiereHorsRP, 1e-9, '(ii) sans RP vendue, croisière = hors RP (' + s + ')');
  ok(D.carryover(s, { omega: 0 }).croisiere > c.croisiere, '(ii) sans gains jamais taxés (ω = 0), croisière plus grande (' + s + ')');
  // équivalence avec (i) : héritier qui vend aussitôt (λ = 1), rien n'échappe, pas de conjoint, pas de comportement
  proche(D.carryover(s, { lambda: 1, omega: 0, rpVendue: 0 }).croisiere, D.realisationDeces(s, { conjoint: false, sansComportement: true }).statique, 1e-9, '(ii) avec vente immédiate et sans fuite, (ii) = (i) statique sans conjoint (' + s + ')');
});
proche(II.central.annee(20), II.central.croisiere * (1 - Math.pow(0.95, 20)), 1e-9, '(ii) central : 64 % de la croisière après 20 ans (λ = 5 %)');
ok(II.central.annee(20) / II.central.croisiere > 0.6 && II.central.annee(20) / II.central.croisiere < 0.7, '(ii) central : environ 64 % après 20 ans');
ok(II.bas.annee(10) < II.central.annee(10) && II.central.annee(10) < II.haut.annee(10), '(ii) année 10 : bas < central < haut');
var tr = D.trajectoireCarryover('central', 10);
proche(tr.cumul, tr.serie.reduce(function (a, x) { return a + x; }, 0), 1e-9, '(ii) trajectoire : cumul = somme des années');
ok(tr.serie.length === 10 && tr.serie[0] < tr.serie[9], '(ii) trajectoire : 10 années croissantes');
ok(tr.cumul < 10 * II.central.croisiere * 0.5, '(ii) 10 premières années : moins de la moitié de dix années de croisière');
ok(II.central.annee(10) < I.central.nettes, '(ii) à dix ans, (ii) rapporte moins que (i)');

// Option (iii)
var III = {}; SC.forEach(function (s) { III[s] = D.realisationCredit(s); });
SC.forEach(function (s) {
  var c = III[s];
  ok(c.recettes >= c.recettesBasse, '(iii) borne haute ≥ borne basse (' + s + ')');
  ok(c.creditParClasse <= c.creditGroupe + 1e-9, '(iii) crédit par classe ≤ crédit groupé (' + s + ')');
  ok(c.recettes <= c.impotBrut + 1e-12 && c.recettesBasse >= 0, '(iii) 0 ≤ recette ≤ impôt brut (' + s + ')');
  proche(c.recettes, c.impotBrut - c.creditParClasse, 1e-9, '(iii) recette = impôt − crédit (' + s + ')');
  proche(D.realisationCredit(s, { hetero: 0 }).recettes, c.impotBrut, 1e-9, '(iii) h = 0 : aucun crédit (' + s + ')');
  ok(c.creditGroupe <= D.CONST.dmtg2024 + 1e-9, '(iii) le crédit ne dépasse jamais les droits dus (' + s + ')');
  proche(c.impotBrut, I[s].brutes, 1e-9, '(iii) même impôt brut que (i) (' + s + ')');
  ok(c.recettes < c.impotBrut, '(iii) le crédit réduit la recette (' + s + ')');
});
ok(III.bas.recettes < III.central.recettes && III.central.recettes < III.haut.recettes, '(iii) recette : bas < central < haut');
ok(III.central.parClasse.ent.credit < III.central.parClasse.ent.impot * 0.35, '(iii) entreprises : droits faibles (Dutreil), le crédit absorbe moins de 35 % de l\'impôt (30 % en base nominale ; base réelle par défaut depuis le 03/11)');
ok(III.central.parClasse.av.credit < III.central.parClasse.av.impot * 0.25, '(iii) assurance-vie : droits très faibles (990 I), le crédit absorbe moins de 25 % de l\'impôt (15 % en base nominale)');
ok(III.central.parClasse.imm.credit > III.central.parClasse.imm.impot * 0.3, '(iii) immobilier : le crédit absorbe plus de 30 % de l\'impôt');
ok(III.central.recettes > 0 && III.central.recettes < I.central.brutes, '(iii) central : recette positive, inférieure à (i) brut');

// Liquidité : étalement
proche(D.etalement(100, 10, 0.03, 0.03).valeurActuelle, 100, 1e-9, 'étalement au taux d\'actualisation : valeur actuelle = créance');
ok(D.etalement(100, 10, 0.01, 0.03).valeurActuelle < 100, 'étalement à 1 % actualisé à 3 % : perte de valeur actuelle');
ok(D.etalement(100, 10, 0.05, 0.03).valeurActuelle > 100, 'étalement à 5 % actualisé à 3 % : gain pour l\'État');
proche(D.etalement(100, 10, 0, 0).annuite, 10, 1e-12, 'étalement sans intérêt : 10 annuités de 10');
proche(D.etalement(100, 0, 0.03, 0.03).valeurActuelle, 100, 1e-12, 'étalement sur 0 an = paiement immédiat');
proche(D.etalement(100, 5, 0.03, 0.03).paiements.reduce(function (a, x) { return a + x; }, 0), 5 * D.etalement(100, 5, 0.03, 0.03).annuite, 1e-9, 'étalement : somme des paiements = n annuités');
proche(D.annuite(1, 0.05), 1 / 1.05, 1e-12, 'annuité actualisée sur 1 an');
proche(D.annuite(7, 0), 7, 1e-12, 'annuité actualisée sans intérêt = n');
ok(D.annuite(10, 0.03) < D.annuite(10, 0.01), 'annuité actualisée décroissante en i');

// Vente forcée et Dutreil
SC.forEach(function (s) {
  var v0 = D.venteForcee(s, { annees: 0 }), v5 = D.venteForcee(s, { annees: 5 }), v10 = D.venteForcee(s, { annees: 10 });
  ok(v0.couvert <= v5.couvert && v5.couvert <= v10.couvert, 'vente forcée : la part couverte croît avec la durée d\'étalement (' + s + ')');
  ok(v0.valeurCedee >= v5.valeurCedee && v5.valeurCedee >= v10.valeurCedee, 'vente forcée : la valeur cédée décroît avec l\'étalement (' + s + ')');
  proche(v0.couvert, P[s].liquidite, 1e-12, 'vente forcée sans étalement : seule la liquidité disponible couvre l\'impôt (' + s + ')');
  proche(v0.tauxEffectifSurValeur, D.realisationDeces(s, { sansComportement: true, deductible: false }).parClasse.ent.statique / D.valeurs(s).ent, 1e-9, 'vente forcée : taux effectif = impôt / valeur des entreprises (' + s + ')');
  ok(v0.partDutreil > 0 && v0.partDutreil <= 1, 'vente forcée : part Dutreil entre 0 et 1 (' + s + ')');
  ok(v0.droitsRappeles >= v5.droitsRappeles && v5.droitsRappeles >= v10.droitsRappeles, 'Dutreil : les droits rappelés décroissent avec l\'étalement (' + s + ')');
  proche(v0.partCapitalEnTitres, v0.tauxEffectifSurValeur, 0, 'paiement en titres : part du capital remise = taux effectif (' + s + ')');
});
ok(D.venteForcee('bas', { annees: 5 }).couvert <= D.venteForcee('haut', { annees: 5 }).couvert, 'vente forcée à 5 ans : bas couvre au plus autant que haut (en base réelle, par défaut depuis le 03/11, l\'impôt est plus faible et la couverture peut saturer à 100 %)');
ok(D.venteForcee('central', { annees: 10 }).valeurCedee < 1e-9, 'central : étalement sur 10 ans à 3 % : plus aucune vente forcée en moyenne');
ok(D.venteForcee('central', { annees: 0 }).partDuCapitalCedee > 0.1, 'central : sans étalement, plus de 10 % de la valeur des entreprises transmises à céder');
ok(D.venteForcee('central', { annees: 0, conjoint: false }).impot > D.venteForcee('central', { annees: 0 }).impot, 'vente forcée : sans report au conjoint, l\'impôt sur les entreprises augmente');

// Cas type : 100 M€, prix de revient 5 M€
var ct = D.casType();
proche(ct.droits, 5.625, 1e-9, 'cas type : droits actuels 5,625 M€ (Dutreil + réduction de 50 %)');
proche(ct.impotRealisation, 47.5, 1e-9, 'cas type : impôt de réalisation 50 % × 95 = 47,5 M€');
proche(ct.totalAvec, 53.125, 1e-9, 'cas type : 53,1 M€ au total');
proche(ct.anneesDeDividendes, 47.5 / 3, 1e-9, 'cas type : 15,8 années de dividendes à 3 % pour payer');
proche(ct.carryover.immediat, 0, 0, 'cas type : report du prix d\'acquisition, aucun impôt à la transmission');
proche(D.casType({ t: 0.3 }).impotRealisation, 28.5, 1e-9, 'cas type à 30 % : 28,5 M€');
ok(ct.impotRealisation > 8 * ct.droits, 'cas type : l\'impôt de réalisation vaut plus de huit fois les droits actuels');

// Élasticité pendant la vie
ok(D.EPS_VIE.bas === 1 && D.EPS_VIE.central < 1 && D.EPS_VIE.haut < D.EPS_VIE.central, 'élasticité de réalisation pendant la vie : réduite si l\'effacement disparaît (1 / 0,80 / 0,57)');

// Options regroupées
var O = D.options('central');
proche(O.i.nettes, I.central.nettes, 1e-12, 'options : (i) identique');
proche(O.ii.croisiere, II.central.croisiere, 1e-12, 'options : (ii) identique');
proche(O.iii.recettes, III.central.recettes, 1e-12, 'options : (iii) identique');

// Les défauts des autres modèles ne bougent pas
if (PF) {
  SC.forEach(function (s, i) { proche(PF.bilan(s).soldeNet, avant[i], 1e-12, 'le bilan par défaut de patrimoine_financier.js est inchangé (' + s + ')'); });
  var pfav = PF.assuranceVieDeces('central', { reel: false }).gainsLatentsTaxes.recettes, etaAv = PF.PARAM.central.av.eta;
  proche(D.realisationDeces('central', { conjoint: false, reel: false }).parClasse.av.brutes, pfav * (C.avDeces2024 / (PF.PARAM.central.av.prestations * PF.PARAM.central.av.partDeces)) / (1 - etaAv), 1e-9,
    'recoupement avec la variante décès du § 26 : même moteur (base nominale des deux côtés), capitaux 43,3 Md€ (ACPR) au lieu de 28,3, sans la fuite η');
} else { log('(patrimoine_financier.js non chargé : recoupements ignorés)'); }

log('\n' + n + ' contrôles au vert');
