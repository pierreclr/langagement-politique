// Tests de la BASE DE TRAVAIL du 06/11/2026 (base_0611.js ; non adoptée). Depuis ce dossier, avec jsc (en zsh, liste en tableau) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js \
//     bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js decisions_0611_v73.js decisions_0611_v74.js decisions_0611_v75.js base_0611.js test_base_0611.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
//   (export : remplacer le test par export_bilan_base0611.js ; sortie recopiée dans sources/calculs/bilan_global.py, dictionnaire BASE0611)
var B = this.BaseTravail0611, A = this.Decisions0611V74, V5 = this.Decisions0611V75;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
function ligne(L, id) { return L.filter(function (l) { return l.id === id; })[0]; }

// 1. Lignes
var L = B.lignes(), T = B.totaux(L);
ok(L.length === 14 && L.every(function (l) { return l.v.length === 3; }), '14 lignes BT01-BT14, trois valeurs chacune');
proche(B.v75().recette, 62.5, 0.15, 'v7.5 recommandée : recette ≈ 62,5 Md€ (fonction-patrimoine-v75.md § 4.3)');
proche(ligne(L, 'BT01').central, B.v75().recette - 54.516184765378696, 1e-9, 'BT01 = recette v7.5 − G05 (54,52)');
var e = B.epargne(); ok(e.interets[0] < e.interets[1] && e.interets[1] < e.interets[2], 'intérêts de l\'épargne réglementée : taux 2026 < milieu < taux 2024');
proche(e.interets[2], 603.1 * 0.03 + 80.9 * 0.04, 1e-9, 'intérêts au taux de 2024 : 603,1 × 3 % + 80,9 × 4 % = 21,3 Md€');
ok(ligne(L, 'BT02').v.every(function (x) { return x < 0; }), 'exonération de l\'épargne réglementée : coût dans les trois scénarios');
proche(ligne(L, 'BT03').central, -3.153 * 3.723 / (3.723 + 0.426), 1e-9, 'C09 : part « résidences secondaires » de 3,153 (partage SDES), vacants gardés');
proche(ligne(L, 'BT04').central, -18.8 * 255 / 208, 1e-9, 'Sécu à 100 % : HCAAM 18,8 indexé sur la CSBM = 23,05');
proche(ligne(L, 'BT05').central, -6.170 * (18.8 * 255 / 208) / 33, 1e-9, 'TSA perdue au prorata des prestations transférées');
proche(ligne(L, 'BT07').central, 2.959, 1e-12, 'C2S redéployée : 2,959');
proche(ligne(L, 'BT08').central, 0, 1e-12, 'participation des employeurs à la complémentaire : 0 au central (à vérifier)');
proche(ligne(L, 'BT09').central, 6.8 * 0.5, 1e-9, 'titres spéciaux : 6,8 Md€ d\'assiette × 0,5');
proche(ligne(L, 'BT11').central, -2.28 * 4.7 / 4.75, 1e-9, 'part « restauration » de N10 retirée : 2,256');
var r = B.restauration(); ok(r.parPointInsee > r.parPointDF, 'V17109 : la base Insee donne plus par point que la dépense fiscale');
proche(r.cout[0], 0.2275 * 5, 1e-9, 'TVA restauration 10 → 5 %, bas : 5 points × 0,2275');
proche(ligne(L, 'BT12').central, -2.334, 1e-12, 'formation variante B = C24 (2,334)');
proche(T.central, L.reduce(function (a, l) { return a + l.central; }, 0), 1e-9, 'total = somme des lignes');
ok(T.bas > T.central && T.central > T.haut, 'favorable > central > défavorable');
proche(T.d_po - T.d_dep, T.central, 1e-9, 'identité : effet = Δ prélèvements − Δ dépenses');
ok(B.FANTOMES_DANS_LE_SOLDE.length === 6, 'six fantômes déjà dans le solde, listés');

// 2. Dette
var d = B.dette(T.central);
ok(d.manque.reference > 18.7, 'base de travail : le manque en macro de référence dépasse les 18,7 Md€ du bilan corrigé');
ok(d.manque.prudente > d.manque.reference && d.manque.reference > d.manque.favorable, 'manque : prudente > référence > favorable');
var d0 = B.dette(0); proche(d0.manque.reference, 18.65219519843464, 0.01, 'effet nul : on retrouve le manque du bilan corrigé (18,65)');

// 3. Cas types corrigés (anomalie du cadre)
var ct = B.casTypesCorriges(), cto = {}; ct.forEach(function (c) { cto[c.id] = c; });
var ref = {}; A.casTypesRevenus().forEach(function (c) { ref[c.id] = c.ecart; });
['smic_seul', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000'].forEach(function (id) { proche(cto[id].ecartH453, ref[id], 0.01, 'coût H453 : on retrouve le cas type du modèle (' + id + ')'); });
proche(cto.cadre_20000.ecartH453, -10.5, 0.1, 'anomalie reproduite : cadre à 20 000 € brut à −10 €/mois avec le coût H453');
proche(cto.cadre_20000.coutH453 - cto.cadre_20000.coutOF, 250.12, 0.01, 'cause : coût employeur H453 (28 400) − super-brut OpenFisca (28 149,88) = 250 €/mois');
proche(cto.cadre_20000.ecartOF, -98.0, 0.1, 'corrigé : cadre à 20 000 € brut à −98 €/mois');
proche(cto.cadre_10000.ecartOF, -231.9, 0.1, 'corrigé : cadre à 10 000 € brut à −232 €/mois');
ok(B.marginalActuel('cadre_10000', 'cadre_20000') > 0.65, 'non-monotonie restante réelle : le droit actuel prélève plus de 65 % à la marge entre 10 000 et 20 000 € brut');
proche(cto.smic_seul.ecartOF, 47.7, 0.1, 'effet de bord de la correction : Smic seul à +48 €/mois (64 avec le coût H453)');

// 4. Jeux de réglages
var m = d.manque.reference;
var ja = B.jeuRevenus(m); proche(ja.recette, m, 0.01, '(a) la fonction des revenus rapporte le manque'); ok(ja.param > 0.65 && ja.param < 0.75, '(a) a relevé entre 0,65 et 0,75');
proche(B.dette(T.central + ja.recette).manque.reference, 0, 0.05, '(a) dette stable en macro de référence');
ok(B.kMinimal(0.03) <= 4e5, 'K minimal à 3 % ≤ 400 000 € (contrainte dure, tranches ≤ 1 M€)');
var best = -1e9; [0.03, 0.04, 0.045, 0.05, 0.06].forEach(function (t) { best = Math.max(best, B.jeuPatrimoine(t).delta); });
ok(best < m / 4, '(b) la fonction du patrimoine seule ne comble pas le quart du manque (sommet de la courbe de recette)');
log('Tests : ' + n + ' vérifications passées.');
