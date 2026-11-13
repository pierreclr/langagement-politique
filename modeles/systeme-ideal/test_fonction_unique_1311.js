// Tests de la fonction unique du 13/11/2026 (fonction_unique_1311.js ; PROPOSITION, non adoptée). Depuis ce dossier, avec jsc (en zsh, liste en tableau) :
//   JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js \
//     bareme_unique_v6.js fonction_unique_1311.js)
//   $JSC $LIST test_fonction_unique_1311.js           # tests
//   $JSC $LIST rapport_fonction_unique_1311.js        # tableaux de fonction-unique-1311.md
var U = this.FonctionUnique1311, log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var H = U.HYP, smic = H.smic;

// 1. Plancher à R = 0
proche(U.nouveau({ revenus: [0], loyer: 250 }).revenu, 877, 1e-9, 'seul locataire, R = 0 : 877 €');
proche(U.nouveau({ revenus: [0], loyer: 0 }).revenu, 627, 1e-9, 'seul sans loyer, R = 0 : 627 €');
proche(U.nouveau({ revenus: [0], loyer: 150 }).revenu, 777, 1e-9, 'seul, loyer de 150 € : part logement plafonnée au loyer (777 €)');
proche(U.nouveau({ revenus: [0, 0], loyer: 250 }).revenu, 1316, 1e-9, 'couple locataire sans revenu : 1 316 €');
proche(U.nouveau({ revenus: [0, 0], loyer: 0 }).revenu, 1066, 1e-9, 'couple sans loyer sans revenu : 1 066 €');
proche(U.nouveau({ revenus: [0], enfants: 2, situation: 'parent', loyer: 250 }).revenu, 877 + 2 * 450, 1e-9, 'parent seul, 2 enfants : 877 + 2 × 450 €');
[0, 500, 2000, 5000].forEach(function (R) { proche(U.ancien({ revenus: [R], loyer: 250 }).revenu, U.seul(R, 250).ancien, 1e-9, 'règle actuelle cohérente ' + R); });

// 2. Formule en une ligne = fonction individuelle + terme de plancher
[0, 300, 1941.06, 3560, 8000, 15000].forEach(function (R) {
  [877, 627].forEach(function (P) { proche(U.seul(R, P === 877 ? 250 : 0).nouveau, R - U.contribution(R, P), 1e-8, 'une ligne, R = ' + R + ', P = ' + P); });
});
proche(U.kH(877, 1), 845.9, 0.5, 'K_P locataire ≈ 846 €'); proche(U.kH(627, 1), 1840.0, 0.5, 'K_P sans loyer ≈ 1 840 €');
proche(U.taux(0, 877), 0.40, 1e-12, 'premier euro à 40 % (locataire)'); proche(U.taux(0, 627), 0.40, 1e-12, 'premier euro à 40 % (sans loyer)');

// 3. Règle actuelle : la bosse que l'on supprime
var f = U.finComplementAncien(877);
proche(f.R, 3560, 15, 'fin du complément actuel (locataire) vers 3 560 €'); proche(f.tauxAvant, 0.707, 0.005, 'taux actuel juste avant ≈ 71 %'); proche(f.tauxApres, 0.609, 0.005, 'puis ≈ 61 %');

// 4. Monotonie et plafond (dérivée numérique, R de 0 à 50 000 € par pas de 10 €)
var cas = [['seul locataire', { revenus: [0], loyer: 250 }, 0], ['seul sans loyer', { revenus: [0], loyer: 0 }, 0], ['seul, loyer 100 €', { revenus: [0], loyer: 100 }, 0],
  ['couple locataire, conjoint sans revenu', { revenus: [0, 0], loyer: 250 }, 0], ['couple locataire, conjoint au Smic', { revenus: [0, smic], loyer: 250 }, 0],
  ['couple sans loyer, conjoint sans revenu', { revenus: [0, 0], loyer: 0 }, 0], ['couple, conjoint à 5 000 €', { revenus: [0, 5000], loyer: 250 }, 0],
  ['parent seul, 2 enfants', { revenus: [0], enfants: 2, situation: 'parent', loyer: 250 }, 0]];
['B', 'A'].forEach(function (forme) {
  cas.forEach(function (c) {
    var pr = U.profil(c[1], c[2], { forme: forme }, 50000, 10);
    ok(pr.plusForteBaisse < 1e-6, 'forme ' + forme + ', ' + c[0] + ' : taux jamais décroissant (plus forte baisse ' + pr.plusForteBaisse.toExponential(1) + ')');
    ok(pr.max <= H.a + 1e-6 && pr.max <= 0.73, 'forme ' + forme + ', ' + c[0] + ' : taux maximal ' + (100 * pr.max).toFixed(2) + ' % ≤ a = 65,15 % ≤ 73 %');
  });
});
var prA = U.profil({ revenus: [0], loyer: 250 }, 0, { forme: 'A' }, 1000, 10); proche(prA.min, 0.5097, 0.001, 'forme A : premier euro à 51 % pour un locataire');

// 5. Le haut ne change pas
[10000, 15000, 50000].forEach(function (R) { ok(Math.abs(U.seul(R, 250).nouveau - U.seul(R, 250).ancien) < 3, 'seul à ' + R + ' € : écart < 3 €/mois'); });
ok(Math.abs(U.nouveau({ revenus: [8000, 8000], loyer: 250 }).revenu - U.ancien({ revenus: [8000, 8000], loyer: 250 }).revenu) < 1, 'couple 2 × 8 000 € : écart < 1 €');

// 6. Recette (moteur de bareme_unique_v6.js)
var r = { bas: U.recette('bas'), central: U.recette('central'), haut: U.recette('haut') };
proche(r.central.gainEtat, -0.74, 0.05, 'recette centrale ≈ −0,7 Md€/an (coût pour l\'État)');
ok(r.bas.gainEtat < 0 && r.haut.gainEtat < 0 && r.bas.gainEtat > -1.5 && r.haut.gainEtat > -1.5, 'bas et haut entre −1,5 et 0 Md€ : ' + r.bas.gainEtat.toFixed(2) + ' / ' + r.haut.gainEtat.toFixed(2));
proche(r.central.coutAncien, 10.34, 0.05, 'coût du complément actuel (zone de retrait, central) ≈ 10,3 Md€');
proche(U.recette('central', { forme: 'A' }).gainEtat, 0.61, 0.05, 'forme A : ≈ +0,6 Md€/an');
proche(r.central.ecartConventionPL01, 1.95, 0.05, 'écart de convention du modèle (zone de retrait sans loyer comptée à 877 €) ≈ 2 Md€');
var mn = U.muNeutre('central'); ok(mn > 0.42 && mn < 0.46, 'μ exactement neutre ≈ ' + mn.toFixed(4));
log('Tests : ' + n + ' vérifications passées.');
