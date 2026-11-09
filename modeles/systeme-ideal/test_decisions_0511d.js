// Tests de la v5.5 (decisions_0511d.js) : holdings 2 %, trusts, immobilier des sociétés, abattement chiffré. Depuis ce dossier, avec jsc :
//   LIST=(la liste de test_decisions_0511.js jusqu'à decisions_0511.js, puis) decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js test_decisions_0511d.js
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js test_decisions_0511d.js
var C = this.Decisions0511c, D = this.Decisions0511d, G = this.GrandesFortunes0511, TP = this.TaxePatrimoine, Z = this.Optimum;
var log = (typeof print === 'function') ? print : console.log;
var n = 0, SC = ['bas', 'central', 'haut'];
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var avantErosion = TP.PARAM.central.erosionTop;
// architecture : la v5.5 sans abattement est la v5.4
ok(D.archiV55().tPlat === 0.42 && D.archiV55().majParentIsole === 345 && D.archiV55().taxe.abattement === 0, 'v5.5 : 42 %, majoration 345 €, pas d\'abattement (décision non prise)');
ok(D.archiV55(0.42, 170000).taxe.abattement === 170000 && C.archiV54().taxe.abattement === 0, 'l\'option d\'abattement ne modifie pas l\'architecture v5.4');
ok(D.parMenage(100000) === 170000 && D.parMenage(50000) === 85000, 'abattement par ménage = montant par adulte × 1,7 adulte');
// holdings : 2 % lus dans le dossier (+0,8 au central ; 1,2 / 0,8 / 0,4)
proche(D.holdings('central').net, G.holdings('central').taxeActifsPassifs, 1e-9, 'holdings : taxe de 2 % identique au dossier (central)');
proche(D.holdings('bas').net, 1.176, 0.001, 'holdings favorable 1,2'); proche(D.holdings('haut').net, 0.36, 0.001, 'holdings défavorable 0,4');
ok(D.holdings('bas').net > D.holdings('central').net && D.holdings('central').net > D.holdings('haut').net, 'holdings : ordre favorable > central > défavorable');
proche(D.holdings('central').brut, 0.02 * 62.5, 1e-9, 'holdings : brut = 2 % de l\'assiette (62,5 Md€ au central)');
ok(D.holdings('central').avecCredit < D.holdings('central').net && D.holdings('central').avecCredit > 0, 'holdings : le crédit de la taxe de 1 % réduit mais n\'annule pas le gain');
// trusts et sociétés civiles
proche(D.trusts('central').gain, 0.764, 0.001, 'trusts et sociétés civiles : +0,8 au central');
ok(D.trusts('bas').gain > D.trusts('central').gain && D.trusts('central').gain > D.trusts('haut').gain, 'trusts : ordre favorable > central > défavorable');
// immobilier des sociétés
SC.forEach(function (s) { ok(D.immoSocietes(s).gain > 0, 'immobilier des sociétés : correction positive (' + s + ')'); });
ok(Math.abs(D.immoSocietes('central', { partSCI: 0 }).gain) < 1e-9, 'sans SCI, la correction est nulle (si les parts de SCI étaient déjà dans les logements : rien à corriger)');
proche(D.immoSocietes('central', { partSCI: 0.30 }).gain, 2 * D.immoSocietes('central', { partSCI: 0.15 }).gain, 1e-9, 'la correction est proportionnelle à la part des SCI');
ok(D.immoSocietes('central', { sansPlafonds: true }).gain > D.immoSocietes('central').gain, 'les plafonds existants réduisent la correction (pas de double compte)');
ok(D.plafonds('central') > 0 && D.plafonds('central') < 0.06, 'part des plafonds : 0 à 6 % de la taxe brute');
ok(D.immoSocietes('central', { abattement: 170000 }).gain < D.immoSocietes('central').gain, 'avec l\'abattement, la correction diminue (même retrait que la taxe, pas de double compte)');
var im = D.immoSocietes('central');
proche(im.S0, 1745 * 0.85 * 0.15, 1e-6, 'capitaux propres des SCI = 15 % des non-cotés des ménages'); proche(im.brutSousJacent, im.S0 / 0.8, 1e-6, 'immobilier brut = capitaux propres / (1 − dettes)');
ok(im.apres > im.avant, 'la transparence rapporte plus que le traitement en non-cotés (valeur 0,96 contre 0,80, pas d\'érosion, paiement annuel)');
// abattement
var a100 = D.abattement('central', 100000), a50 = D.abattement('central', 50000);
ok(a100.cout > a50.cout && a50.cout > 0, 'coût de l\'abattement croissant avec le montant');
proche(a100.cout, C.solde(D.archiV55(0.42, 0), 'central', false) - C.solde(D.archiV55(0.42, 170000), 'central', false), 1e-9, 'coût = écart de solde du modèle complet (différé et plafonds recalculés)');
ok(a100.differe > 0 && a100.cout < a100.brute + a100.differe + 1, 'le paiement différé diminue avec l\'abattement et n\'est pas compté deux fois');
ok(a100.cout < TP.recette('central', { assiette: 'pierre', differe: false, avecReformeImmo: true }).brute, 'coût < recette brute de la taxe');
ok(D.abattement('bas', 100000).cout > a100.cout && a100.cout > D.abattement('haut', 100000).cout, 'coût : ordre favorable > central > défavorable (assiette plus grande au favorable)');
ok(D.solde('central', 0, 0.42) === D.solde('central'), 'abattement 0 = absence d\'abattement');
var e1 = D.exoneres(170000), e50 = D.exoneres(85000), e0 = D.exoneres(0);
ok(e1.total > e50.total && e50.total > e0.total, 'ménages exonérés croissants avec l\'abattement'); ok(e1.partTotale > 0.4 && e1.partTotale < 0.7, 'à 170 000 € par ménage : 40 à 70 % des ménages ne paient plus rien');
var P = D.parDecile(170000), s = 0; P.forEach(function (x) { s += x.partDesGains; ok(x.gainMoyen >= 0 && x.gainMoyen <= 0.01 * 170000 + 1e-6, 'gain du ' + x.decile + ' entre 0 et 1 % de l\'abattement'); });
proche(s, 1, 1e-9, 'parts des gains par décile : somme = 1'); ok(P[0].gainMoyen < 1 && P[9].gainMoyen > 1600, 'le décile le plus bas gagne moins de 1 € ; le plus haut, l\'abattement plein (1 700 €)');
// solde et taux d'équilibre
SC.forEach(function (sc) { proche(D.solde(sc), C.solde(null, sc, false) + D.somme(sc), 1e-9, 'solde v5.5 = v5.4 + lignes (' + sc + ')'); });
ok(D.solde('bas') > D.solde('central') && D.solde('central') > D.solde('haut'), 'ordre des scénarios bas > central > haut');
ok(D.solde('central') > C.solde(null, 'central', false), 'le solde v5.5 dépasse celui de la v5.4');
proche(D.somme('central'), D.holdings('central').net + D.trusts('central').gain + D.immoSocietes('central').gain, 1e-9, 'somme des lignes v5.5');
proche(D.solde('central', 100000), D.solde('central') - a100.cout + (D.immoSocietes('central', { abattement: 170000 }).gain - D.immoSocietes('central').gain), 1e-9, 'solde avec abattement = solde v5.5 − coût, à la correction des SCI près');
var te = D.tauxEquilibreFin();
ok(te < C.tauxEquilibreFin(false), 'taux d\'équilibre v5.5 < v5.4');
ok(D.solde('central', 0, te) >= -1e-6 && D.solde('central', 0, te - 0.001) < 0, 'taux d\'équilibre : solde ≥ 0, et < 0 un dixième de point plus bas');
ok(D.tauxEquilibreFin(100000) > D.tauxEquilibreFin(50000) && D.tauxEquilibreFin(50000) > te, 'le taux d\'équilibre monte avec l\'abattement');
ok(TP.PARAM.central.erosionTop === avantErosion, 'les paramètres d\'exil sont restaurés (aucun effet de bord)');
log('Tests v5.5 : ' + n + ' contrôles passés.');
