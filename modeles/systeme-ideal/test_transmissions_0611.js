// Tests de la couche transmissions + crédit d'IS partiel (transmissions_0611.js ; base de travail du 06/11/2026, NON ADOPTÉE). Depuis ce dossier, avec jsc (zsh) :
//   LIST=(… liste de test_cas_types_nets_0611.js sans le test … variante_nationalite_0611.js transmissions_0611.js test_transmissions_0611.js)
//   (modele.js … base_0611.js cas_types_nets_0611.js variante_nationalite_0611.js transmissions_0611.js test_transmissions_0611.js ; ../capital-de-depart/modele.js est déjà dans la liste)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
//   (tableaux : remplacer le test par rapport_transmissions_0611.js > resultats_transmissions_0611.txt)
var T = this.Transmissions0611, B = this.BaseTravail0611, X = this.BaremeV71, N = this.CasTypesNets0611;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// 1. Loi et échelle
var g = T.grille(); proche(g.poids, 1, 1e-6, 'grille : poids total ≈ 1');
proche(g.moyenne, 70000 * Math.exp(Math.pow(Math.log(500000 / 70000) / 1.2815516, 2) / 2), 1500, 'moyenne de la log-normale (médiane 70 000, P90 500 000)');
ok(T.moyenneAuDela(0.99) > 4.2e6, 'queue : moyenne du 1 % > 4,2 M€ (CAE)'); proche(T.moyenneAuDela(0.999), 13e6, 1.5e6, 'queue : moyenne du 0,1 % ≈ 13 M€ (CAE)');
proche(T.echelle(1) * g.moyenne * 830000 / 1e9, 300 * 0.82, 1e-6, 'échelle : cohorte × E[H] = flux hors conjoint (300 × 0,82)');
// 2. Fonction
var p = { A: 3e5, K: 1e5, top: true };
ok(T.impot(3e5, p) === 0 && T.marginal(2e5, p) === 0, 'rien sous l\'abattement');
proche((T.impot(2e6 + 1, p) - T.impot(2e6, p)), T.marginal(2e6, p), 1e-4, 'impôt = intégrale du marginal (2 M€)');
proche((T.impot(1.5e7 + 1, p) - T.impot(1.5e7, p)), T.marginal(1.5e7, p), 1e-4, 'impôt = intégrale du marginal dans la rampe (15 M€)');
proche(T.marginal(3e7, p), 0.6, 0.002, 'marginal ≈ 60 % au-delà de 20 M€ (50 % × x/(x + K) + 10 points)'); ok(T.marginal(9.9e6, p) < 0.5, 'marginal < 50 % sous 10 M€');
ok(T.impot(1e8, p) / 1e8 < 0.6, 'taux moyen < 60 % à 100 M€');
proche(T.impotActuelTheorique(2e5), 0, 1e-9, 'droit actuel : deux abattements de 100 000 €'); proche(T.impotActuelTheorique(3e5), 2 * (8072 * 0.05 + 4037 * 0.10 + 3823 * 0.15 + 34068 * 0.20), 0.01, 'droit actuel : barème de l\'article 777 sur 50 000 € par parent');
// 3. Recettes
var r = T.recette({ A: 3e5, K: 1e5, top: true, k: 1 }), rs = T.recette({ A: 3e5, K: 1e5, top: true, k: 1, sansComportement: true });
ok(r.recette < rs.recette && rs.recette < rs.statique, 'comportements et dette différée réduisent la recette');
var tr = T.trois(p); ok(tr[0].recette > tr[1].recette && tr[1].recette > tr[2].recette, 'favorable > central > défavorable');
ok(T.recette({ A: 1e5, K: 1e5, top: true, k: 1 }).recette > r.recette && r.recette > T.recette({ A: 5e5, K: 1e5, top: true, k: 1 }).recette, 'la recette baisse quand l\'abattement monte');
ok(T.recette({ A: 3e5, K: 5e5, top: true, k: 1 }).recette < r.recette, 'la recette baisse quand K monte (moins progressif)');
proche(r.partNePaientRien, 0.855, 0.01, 'A = 300 000 € : ≈ 85 % des bénéficiaires ne paient rien (central)');
proche(T.recette({ A: 1e5, plat: 0.5, k: 1, sansFractionnement: true, sansDiffere: true }).recette, 59.6, 4, 'réconciliation v5.10 : 50 % au-delà de 100 000 € ≈ 59,6 (écart de méthode < 4)');
var act = T.recette({ A: 2e5, actuel: true, sansDiffere: true, k: 1 }); ok(act.recette > 20.8 && act.recette - 20.8 < 12, 'droit actuel dans la chaîne : au-dessus des 20,8 encaissés, écart de l\'ordre des niches (8-11)');
ok(T.recette({ A: 3e5, K: 1e5, top: true, k: 1, nationalite: 'court' }).recette > r.recette, 'impôt de suite « court terme » : recette plus haute');
var D = T.distribution(p), sD = D.reduce(function (a, t) { return a + t.recetteMd; }, 0); proche(sD, r.recette, 1e-6, 'distribution : somme des tranches = recette');
proche(D.reduce(function (a, t) { return a + t.partBenef; }, 0), 1, 1e-9, 'distribution : parts des bénéficiaires = 1');
// 4. Crédit d'IS partiel
var s0 = X.sched(B.bareme0()); proche(T.hautCredit(s0, 1, 'central'), X.haut(s0, X.HYP.tRef, 'central'), 1e-9, 'crédit 100 % : réplique exacte de BaremeV71.haut');
proche(T.retraitesCredit(s0, 1, 'central'), X.retraitesCapital(s0, 'central').md, 1e-9, 'crédit 100 % : réplique exacte de BaremeV71.retraitesCapital');
var c75 = T.credit(0.75), c50 = T.credit(0.5), c0 = T.credit(0); ok(0 < c75.total && c75.total < c50.total && c50.total < c0.total, 'recette croissante quand le crédit baisse');
ok(c50.total < c50.statique, 'réaction des dividendes : recette < statique');
proche(T.chargeDividende(null, 1, 10000).ecart, 0, 1e-12, 'crédit entier : dividende taxé comme le salaire'); proche(T.chargeDividende(null, 0.5, 10000).ecart, 0.125, 1e-12, 'crédit 50 % : +12,5 points sur le dividende');
// 5. Jeux et cas types
var base = T.objet(T.casTypesNets(B.bareme0(), 1)), pub = T.objet(N.casTypes());
['smic_seul', 'couple_2smic_2enf', 'cadre_10000', 'cadre_20000'].forEach(function (id) { proche(base[id].ecartNet, pub[id].base.ecartNet, 1e-6, 'cas types nets de la base retrouvés : ' + id); });
proche(base.rentier_div_5000.ecartNet, -17, 2, 'rentier, crédit entier : ne gagne pas (≈ −17 €/mois)');
proche(T.objet(T.casTypesNets(T.baremeA(T.aPourCadre(-0.05)), 1)).cadre_10000.pctNet, -0.05, 1e-4, 'calage : cadre à 10 000 € brut à −5 %');
var jr = T.jeu({ cadre: 'equilibre', trans: p, c: 0.5, nationalite: 'court', patrimoine: 2.28 }); proche(jr.manque.reference, 0, 0.05, 'jeu recommandé : dette stable en macro de référence');
var o = T.objet(jr.cas); ok(['smic_seul', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf'].every(function (id) { return o[id].ecartNet >= 20; }), 'jeu recommandé : bas revenus ≥ +20 €/mois (net santé)');
var j5 = T.jeu({ cadre: -0.05, trans: p, c: 0.5 }); ok(j5.manque.reference > 20, 'cadres à −5 % avec les leviers du capital recommandés : il reste plus de 20 Md€ de manque');
log('Tests : ' + n + ' vérifications passées.');
