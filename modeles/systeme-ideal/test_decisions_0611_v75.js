// Tests de la v7.5 PROPOSÉE (decisions_0611_v75.js ; 06/11/2026, non adoptée). Depuis ce dossier, avec jsc (en zsh, liste en tableau) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js \
//     bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js decisions_0611_v73.js decisions_0611_v74.js decisions_0611_v75.js test_decisions_0611_v75.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
//   (résultats : remplacer le test par rapport_decisions_0611_v75.js, sortie dans resultats_decisions_0611_v75.txt)
var V = this.Decisions0611V75, A = this.Decisions0611V74;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var REC = { regime: 'RP', X: 1e6, tInf: 0.03, K: 4e5, payeProrata: true, plancherPro: true }, AB = { regime: 'AB', X: 1e6, tInf: 0.03, K: 4e5, payeProrata: true, plancherPro: true };
V.init(); var E = V.calages();

// 1. Fonction et bases
proche(V.Pf(1e6, { tInf: 0.03, K: 4e5 }), 0.03 * 1e12 / 1.4e6, 1e-6, 'P(W) = t∞ × W² / (W + K)');
ok(V.Pf(0, REC) === 0 && V.Pf(-5, REC) === 0, 'P nul pour W ≤ 0');
var mono = true, last = -1; for (var W = 0; W <= 1e9; W += 1e6) { var m = V.marginalF(W, REC); if (m < last - 1e-15) mono = false; last = m; } ok(mono && V.marginalF(1e12, REC) <= 0.03, 'marginal croissant, jamais au-dessus de t∞');
proche(V.Pf(2e6, { tInf: 0.02, K: 7e5 }), A.Tp(2e6), 1e-6, 'à t∞ = 2 % et K = 700 k€, même courbe que la v7.4 B');
var b1 = V.bases(4e5, 3.8e5, 0, 0, REC); ok(b1.rp === 4e5 && b1.wf === 0, 'primo-accédant : RP entière dans la part RP, rien dans la fonction');
var b2 = V.bases(4e5, 3.8e5, 3e5, 0, REC); ok(b2.wf === 3e5, 'la dette de la RP n\'abrite pas les autres actifs');
var b3 = V.bases(1.5e6, 0, 2e5, 0, REC); ok(b3.rp === 1e6 && b3.wf === 7e5, 'RP de 1,5 M€ : 1 M€ dans la part RP, 500 k€ + autres dans la fonction');
var b4 = V.bases(0, 0, 8e5, 0, AB), b5 = V.bases(8e5, 0, 0, 0, AB); ok(b4.wf === 0 && b5.wf === 0, 'abattement unique : locataire (épargne 800 k€) et propriétaire (RP 800 k€) à égalité dans la fonction');
var b6 = V.bases(0, 0, 8e5, 0, REC); ok(b6.wf === 8e5, 'régime RP : le locataire n\'a pas d\'abattement sur son épargne');
// 2. Calages
proche(V.HYP.tauRPsource, 26.202 / 9696, 1e-12, 'τRP aux sources = 26,202 / 9 696 (0,270 %)');
ok(V.HYP.tauRP > 0.0024 && V.HYP.tauRP < 0.0027, 'τRP calé dans la population ≈ 0,25 %');
proche(V.calage(0.02).nette, 54.52, 0.05, 'chaîne v7.4 retrouvée à t∞ = 2 % (54,52 Md€)');
ok(V.calage(0.03).ratio < V.calage(0.02).ratio, 'comportement : le rapport net / statique baisse quand t∞ monte');
proche(V.partBouclier(0.5), 0.197, 0.002, 'bouclier : 19,7 % de la charge RP à σ = 0,5');
// 3. Population, contrainte, recette
var g = V.agreger({ regime: 'RP', X: 1e6, tInf: 0.02, K: 7e5 }).total;
proche(g.tf / 1e9, 26.202, 0.01, 'ancien : taxe foncière des ménages 26,20 Md€');
proche(g.v74 / 1e9, 81.05, 0.1, 'v7.4 B statique retrouvée (81,05 Md€, étude par tranche)');
ok(V.contrainte(REC).ok, 'variante recommandée : contrainte dure respectée dans toutes les tranches ≤ 1 M€');
ok(!V.contrainte({ regime: 'RP', X: 1e6, tInf: 0.03, K: 3.5e5 }).ok, 'K = 350 k€ à 3 % viole la contrainte (750 k€-1 M€)');
var r = V.recette(REC); proche(r.totale, 62.5, 0.2, 'recette recommandée ≈ 62,5 Md€'); proche(r.deltaV74, 8.0, 0.2, 'Δ v7.4 ≈ +8,0 Md€');
ok(r.totale - r.differe < 42.09, 'encaissé dans l\'année inférieur à celui de la v7.4 B (à dire)');
ok(V.recette(AB).totale < r.totale - 20, 'abattement unique de 1 M€ : plus de 20 Md€ de moins que le régime RP');
// 4. Cas types : aucun ménage modeste ne paie plus sur son stock
var ct = {}; V.casTypes(REC).forEach(function (x) { ct[x.id] = x; });
['retraite_proprio', 'retraite_proprio_500', 'retraite_grande_maison', 'primo_accedant', 'locataire_livrets', 'proprio_300k', 'petit_bailleur', 'rs_famille'].forEach(function (id) { ok(ct[id].ecartStock <= 0.5, 'cas type ' + id + ' : stock nouveau ≤ ancien (' + Math.round(ct[id].nouveauStock) + ' ≤ ' + Math.round(ct[id].ancienStock) + ')'); });
ok(ct.locataire_300k.ecartStock > 0, 'régime RP : le locataire à 300 k€ paie plus qu\'aujourd\'hui sur son stock (asymétrie à dire)');
var cta = {}; V.casTypes(AB).forEach(function (x) { cta[x.id] = x; }); ok(cta.locataire_300k.nouveauStock === 0, 'abattement unique : le même locataire ne paie rien');
// 5. Cas limites
var cl = {}; V.casLimites(REC).forEach(function (x) { cl[x.id] = x; });
ok(cl.viticulteur.v75.chargeDuePct < 1 && cl.agriculteur.v75.chargeDuePct < 1, 'option plancherPro : agriculteur et viticulteur sous 100 % de charge due');
ok(cl.holding_20M_cotee.v75.differe === 0, 'payeProrata : la holding passive paie tout (en titres)');
ok(cl.chateau_holding.v75.differe === 0, 'château en holding patrimoniale : mobilisable, tout est payé');
var f = V.foret(5000, 5e5, 0, REC); proche(f.valeurRendement, 125000, 1e-6, 'forêt : valeur de rendement = revenu / 4 %, plafonnée à la valeur vénale');
log('\n' + n + ' vérifications passées');
