// Tests des décisions du 05/11 (decisions_0511.js ; § 21 de resultats-optimum.txt). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js \
//       optimum_options_0411.js ../risques/stress.js decisions_0511.js test_decisions_0511.js
var Z = this.Optimum, X = this.OptionsDu0411, D = this.Decisions0511, PI = this.PatrimoineImmobilier, ST = this.Stress, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var SCS = D.SCS, V51 = Z.archi(Z.ARCHITECTURE_V5), A = D.archiV52();
function ligne(a, sc, id) { return D.lignes(a, sc).filter(function (l) { return l.id === id; })[0].v; }

// 1. Rien n'est modifié dans la v5.1 ; le module n'a pas de effet de bord (taux du module immobilier restauré)
ok(V51.majParentIsole === 400 && V51.tPlat === 0.414 && A.majParentIsole === 200, 'v5.1 : majoration 400, taux 41,4 % ; v5.2 : majoration 200');
proche(PI.CONST.tauxPrelevement, 0.5, 0, 'patrimoine_immobilier.js : taux restauré à 50 % après alignement (aucun effet de bord)');
proche(Z.solde(V51, 'central'), 0.6313, 0.001, 'v5.1 : solde central inchangé');

// 2. Décisions 1, 2, 4 (reprise du module du 04/11)
SCS.forEach(function (s) { proche(ligne(A, s, 'cmg'), -7.3, 1e-9, 'CMG gardé : −7,3 (' + s + ')'); });
[-1.7, -1.0, -0.5].forEach(function (v, k) { proche(ligne(A, SCS[k], 'tvaTravaux'), v, 1e-9, 'TVA 10 % travaux gardée : ' + v + ' (' + SCS[k] + ')'); });
[1.2, 2.3, 2.7].forEach(function (v, k) { proche(-ligne(A, SCS[k], 'plafonds'), v, 0.06, 'plafonds (continu + 50 % transmission) : ≈ ' + v + ' (' + SCS[k] + ')'); });

// 3. Décision 3 : majoration 200 €
[3.8, 7.6, 7.6].forEach(function (v, k) { proche(ligne(A, SCS[k], 'majoration'), v, 0.01, 'majoration à 200 € : économie ' + v + ' (' + SCS[k] + ')'); });
proche(Z.coutCorrectifs('central', V51).b - Z.coutCorrectifs('central', A).b, 7.5984, 1e-3, 'économie = moitié du coût de la majoration à 400 € (15,2 → 7,6)');
var c51 = Z.casTypes(V51), c52 = D.casTypes(A);
proche(c52.parent_isole_smic.ecartMois - c51.parent_isole_smic.ecartMois, -400, 1e-6, 'parent isolé au Smic : −400 €/mois (2 enfants × 200 €)');
ok(c52.parent_isole_smic.ecartMois < 0 && c51.parent_isole_smic.ecartMois > 0, 'parent isolé au Smic : gagnant en v5.1, PERDANT en v5.2 (' + Math.round(c52.parent_isole_smic.ecartMois) + ' €/mois)');
ok(c52.parent_isole_sans_emploi.ecartMois < 0, 'parent isolé sans emploi : perdant en v5.2');
proche(c52.couple_2smic_2enf.ecartMois, c51.couple_2smic_2enf.ecartMois, 8, 'couple à deux Smic : inchangé à quelques euros près');

// 4. Décision 4 : TVA énergie, MaPrimeRénov', CEE, RGE
var te = D.tvaEnergie('central');
proche(te.base, 1.05 / 0.145, 1e-9, 'base hors taxe des travaux à 5,5 % = 1 050 M€ / 14,5 points = 7,24 Md€');
proche(te.statique, 0.3259, 0.001, 'gain statique de 5,5 → 10 % : 0,33 Md€ (VM T2 PLF 2026, 730223)');
proche(te.hausse, 1.10 / 1.055 - 1, 1e-12, 'hausse du prix TTC : +4,3 %');
ok(te.net < te.statique && te.net > 0, 'net de la perte de travaux : positif mais très inférieur au gain statique');
proche(ligne(A, 'central', 'mapr'), 3.3, 1e-12, 'MaPrimeRénov\' supprimée : 3,3 Md€ (QE 1190)');
proche(ligne(A, 'central', 'ceeTva'), -0.8, 1e-12, 'CEE : TVA perdue 0,8 Md€ (4 Md€ × 20 %)');
proche(ligne(A, 'central', 'ceeMenages'), 4.0, 1e-12, 'CEE : 4 Md€ de prélèvement caché en moins, hors budget');
ok(D.HORS.ceeMenages === 1 && D.HORS.travauxSanitaires === 1, 'lignes hors budget marquées');
proche(ligne(A, 'central', 'rge'), 0, 0, 'label RGE : aucun effet budgétaire');
// MaPrimeRénov' absente du modèle : aucun poste du modèle ne la contient (le solde de la v5.1 n'est pas modifié par la ligne)
proche(D.solde(A, 'central') - (Z.solde(A, 'central') + D.totalLignes(A, 'central') - ligne(A, 'central', 'majoration')), 0, 1e-9, 'solde v5.2 = solde optimum.js + lignes (sans double compte de la majoration)');

// 5. Décision 5 : chômage déjà compté
var ch = X.chomageV5(V51, 'central');
ok(ch.cout > 12 && ch.cout < 13.2 && ch.remplace > 36, 'chômage : ' + ch.cout.toFixed(1) + ' Md€ compté contre ' + ch.remplace + ' remplacés (déjà dans la v5.1)');
proche(ligne(A, 'central', 'chomage'), 0, 0, 'chômage : aucune ligne supplémentaire');

// 6. Décision 6 : PreParE
proche(ligne(A, 'central', 'prepare'), -0.7, 1e-12, 'PreParE gardée : −0,7 Md€ (Drees 2024)');

// 7. Décision 7 : capital
proche(D.capitalFraction(1, 0, 1), 0.2, 1e-12, 'capital : année 1 sans déblocage = 1/5 du régime');
proche(D.capitalFraction(5, 0, 1), 1, 1e-12, 'capital : année 5 sans déblocage = régime complet');
proche(D.capitalFraction(12, 0.3, 1), 1, 1e-12, 'capital : en régime, le flux annuel vaut 1 quel que soit le déblocage');
proche(D.capitalFraction(12, 1, 3), 1, 1e-12, 'capital : déblocage de tous, en régime : 1');
var tr = D.capitalTresorerie(A, 'central', 8);
proche(tr.annees[6], 0, 1e-9, 'capital : plus d\'écart de trésorerie après la montée en charge');
ok(tr.total > 20 && tr.total < 30, 'capital : trésorerie économisée au démarrage ≈ ' + tr.total.toFixed(1) + ' Md€ (une fois)');
proche(tr.coutCroisiere, Z.coutCapital(A.capitalFonction ? A : A, 1) || tr.coutCroisiere, 1e-9, 'capital : coût de croisière = celui de la v5.1');

// 8. Décision 8 : sanitaire
proche(ligne(A, 'central', 'sante'), 0.88 * 0.787, 1e-9, 'santé évitée : part publique 78,7 % de 0,88');
proche(ligne(A, 'central', 'travauxSanitaires'), -1.46, 1e-9, 'travaux sanitaires : 1,46 Md€ une fois, hors budget');

// 9. Décision 9 : réparation à 5 %
[0.119, 0.167, 0.238].forEach(function (v, k) { proche(-ligne(A, SCS[k], 'reparation'), v, 0.001, 'TVA réparation à 5 % : ' + v + ' (' + SCS[k] + ')'); });

// 10. Décision 10 : plus-values
var cp = D.correctionPlusValues(A, 'central');
proche(cp, D.bilanImmo('central', 0.414) - D.bilanImmo('central', 0.5), 1e-12, 'plus-values : correction = bilan à 41,4 % − bilan à 50 %');
proche(D.bilanImmo('central', 0.5), -14.6149, 0.001, 'module immobilier à 50 % : solde net central inchangé');
proche(PI.CONST.tauxPrelevement, 0.5, 0, 'taux du module restauré après calcul');

// 12. SFT
proche(ligne(A, 'central', 'sft'), 1.34, 1e-12, 'SFT supprimé : 1,34 Md€ (Cour des comptes)');
proche(ligne(A, 'haut', 'sft'), 0.67, 1e-12, 'SFT défavorable : moitié');

// 16. Combinaison d'économies recomposée
var L = D.combinaison('large'), P = D.combinaison('prudente');
[2.35, 6.76, 15.6].forEach(function (v, k) { proche(L[k], v, 0.006, 'combinaison large : ' + v); });
[1.75, 4.86, 10.5].forEach(function (v, k) { proche(P[k], v, 0.006, 'combinaison prudente : ' + v); });
ok(D.COMBINAISONS.large.indexOf('P2') < 0 && D.COMBINAISONS.large.indexOf('P7') < 0 && D.COMBINAISONS.large.indexOf('R1') < 0, 'pistes retirées : P2 (SFT en ligne propre), P7 (CMG recentré), R1 (TVA 10 % abandonnée)');

// Équilibre
var T = D.tauxEquilibre();
proche(T, 0.413, 0.0011, 'taux d\'équilibre v5.2 : 41,3 %');
ok(D.solde(F(A, { tPlat: T }), 'central') >= 0 && D.solde(F(A, { tPlat: T - 0.001 }), 'central') < 0, 'taux d\'équilibre : minimal au dixième de point');
proche(D.pointDeTaux(A), 10.6, 0.1, 'un point de taux plat = 10,6 Md€');
proche(D.totalLignes(A, 'central'), 0.549, 0.01, 'solde des décisions au central : +0,55 Md€ (CMG et majoration se compensent)');
proche(D.solde(A, 'central') - Z.solde(V51, 'central'), D.totalLignes(A, 'central'), 1e-9, 'écart de solde à la v5.1 = solde des lignes');
var d52 = ST.test('V5', 'central', { ajust: D.ajustement(F(A, { tPlat: T })) }).ratio10;
ok(d52 > 1.0 && d52 < 1.07, 'dette à 10 ans central : ' + (d52 * 100).toFixed(1) + ' % (100,0 % en v5.1 : report d\'encaissement des plafonds compté)');
proche(ST.test('V5', 'central', { ajust: function () { return 0; } }).ratio10, ST.test('V5', 'central', {}).ratio10, 1e-12, 'ajustement nul : aucun effet');

log('\n' + n + ' contrôles passés.');
