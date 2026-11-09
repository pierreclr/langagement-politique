// Tests de la v7.2 adoptée (decisions_0611_v72.js ; arbitrage 43 du 06/11/2026). Depuis ce dossier, avec jsc (en zsh, liste en tableau) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js \
//     bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js test_decisions_0611_v72.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
var Y = this.Decisions0611V72, X = this.BaremeV71, J = this.Decisions0511j, H = this.Decisions0511h;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- 1. La fonction des revenus
var s = Y.sched(), tb = Y.table(), T = {}; tb.forEach(function (l) { T[l.R] = l; });
ok(Y.formule() === 'B(R) = 412.5 + 675 × (1 − e^(−R/1500)) − 0.65 × R', 'formule en une ligne : calibrage C de la v7.1');
proche(T[0].du, -412.5, 1e-9, 'R = 0 : 412,5 € versés');
proche(T[1000].du, -90.94, 0.01, 'R = 1 000 : 90,9 € versés');
proche(T[2000].du, 390.43, 0.01, 'R = 2 000 : 390,4 € dus');
proche(T[10000].reste, 4586.6, 0.1, 'R = 10 000 : 4 586,6 € pour soi');
proche(T[50000].tauxMoyen, 0.628, 0.001, 'R = 50 000 : taux moyen 62,8 %');
ok(tb.length === 8 && T[8000] && T[3000] && T[5000], 'table à 0, 1 000, 2 000, 3 000, 5 000, 8 000, 10 000 et 50 000 €');
proche(Y.surplus('central'), 70.89, 0.01, 'surplus de la fonction des revenus au droit actuel : +70,9 Md€ (central)');
ok(Y.surplus('bas') < Y.surplus('central') && Y.surplus('central') < Y.surplus('haut'), 'surplus 65,2 / 70,9 / 74,0 (le favorable réagit plus)');

// ---------- 2. La fonction du patrimoine (continue, sans seuil)
var ta = Y.tau();
proche(ta.baisse, Y.surplus('central') / 2, 1e-9, 'la baisse de la taxe du patrimoine vaut la moitié du surplus');
proche(ta.cible, 26.28, 0.01, 'recette de la taxe : 61,7 − 35,4 = 26,3 Md€');
proche(ta.K / 1e6, 19.05, 0.05, 'échelle K ≈ 19,0 M€');
proche(Y.recettePatrimoine(ta.K, 'central').nette, ta.cible, 0.01, 'K redonne la recette cible');
proche(Y.mp(0), 0.002, 1e-12, 'taux marginal de 0,2 % au premier euro');
ok(Y.mp(1e9) > 0.0199 && Y.mp(1e9) <= 0.02, 'taux marginal de 2 % pour les très grandes fortunes');
var lastM = 0, cont = true, W0; for (W0 = 0; W0 <= 2e9; W0 += 1e6) { var mm = Y.mp(W0); if (mm < lastM - 1e-15) cont = false; lastM = mm; }
ok(cont, 'taux marginal croissant partout, sans marche');
proche(Y.Tp(1e5 + 1) - Y.Tp(1e5), Y.mp(1e5), 1e-6, 'dérivée continue (pas de seuil)');
var tp = Y.tablePatrimoine(); ok(tp.length === 6 && tp[0].W === 1e5 && tp[5].W === 1e9, 'table à 100 k€, 300 k€, 1 M€, 10 M€, 100 M€, 1 Md€');
proche(tp[1].taxe, 642, 1, 'résidence de 300 000 € : 642 €/an (0,21 %)');
proche(tp[4].tauxMoyen, 0.0166, 0.0002, '100 M€ : 1,66 % par an');
proche(Y.taxePatrimoine(5e5, 4e5), Y.Tp(9e5), 1e-9, 'une seule formule sur la valeur nette totale');
var lp = Y.lignesPatrimoine('central');
proche(lp.holdings, 0, 0.01, 'holdings (2 % sur les actifs passifs, N14) gardées à l\'identique');
ok(lp.trusts < 0 && lp.sci < 0 && lp.plafonds > 0, 'trusts et SCI au prorata du taux ; plafonds réintroduits (coût plus faible qu\'à 1 %)');
proche(lp.dmtgGardes, 20.80 - 59.56, 1e-9, 'DMTG gardés au droit actuel à la place de la fonction de transmission de la v5.10');

// ---------- 3. Écart, solde, contrôles des décisions antérieures
var e = Y.ecart('central');
proche(e.total, e.revenus + e.patrimoine + e.capitalDepart + e.n03, 1e-9, 'l\'écart est la somme de ses parties');
proche(e.n03, -11.968, 0.001, 'contribution des hautes pensions retirée (−12,0) : pensions à net constant');
proche(e.total, -90.68, 0.02, 'écart à la v5.10 : −90,7 Md€ (central)');
var c = Y.controles();
proche(c.soldeV510_2060, 12.50, 0.01, 'la v5.10 de référence (avec fiscalité d\'orientation, gratuité, CIR, V6, détention) redonne +12,5 en 2060');
proche(Y.solde('central', 2060), -78.18, 0.02, 'solde de croisière 2060 : −78,2 Md€ (2,7 % du PIB)');
proche(Y.solde('central', 2028), J.solde('central', 2028, 0.42), 1e-9, 'avant 2029 : droit de la v5.10 (pas d\'écart)');
ok(Y.solde('central', 2041) < Y.solde('central', 2029) && Y.solde('central', 2060) > Y.solde('central', 2041), 'creux des retraites en 2041 (V6), puis remontée');
var P5 = this.BaremeDeuxFonctionsV7.NEUTRALITE.patrimoine510, rel = lp.plafonds + lp.trusts + lp.sci + lp.holdings + P5.N09_plafonds + P5.N14_holdings_passifs + P5.N15_trusts_sci + P5.N16_sci;
proche(X.solde('central', 2060, 'C') - Y.tau().baisse - 11.968 + rel - Y.solde('central', 2060), 0, 0.01, 'réconciliation avec la v7.1 C : − baisse du patrimoine − N03 ± lignes patrimoniales');
var pd = Y.prelevementsDepenses('central');
proche(pd.controle, 0, 1e-9, 'Δ prélèvements − Δ dépenses = écart (convention du bilan global)');
var po = Y.prelevementsObligatoires();
proche(po.pct, 0.4968, 0.0005, 'prélèvements obligatoires bruts : 49,7 % du PIB (42,7 % aujourd\'hui, 52,6 % en v5.10)');
ok(po.pctNet < po.pct && po.pctNet > 0.427, 'lecture nette des transferts : entre 42,7 % et le brut');

// ---------- 4. Dette et économies
var d = Y.dette();
proche(d.reference.central.r0, 1.2351, 0.0001, 'dette fin 2028 : 123,5 % (macro de référence)');
proche(Y.jalons('central', 'reference').r30, DS30 = H.jalonsDette('central', { taux: function () { return 0.42; }, net: function (sc, y) { return H.net(sc, y) + (y < 2029 ? 0 : J.residu(0.42, sc) + Y.ecart(sc).total); } }).r30, 1e-9, 'la trajectoire de variante_dette_stable.js (macro de référence) = H.jalonsDette');
proche(d.reference.central.r30, 1.456, 0.002, 'sans économies, dette à 146 % du PIB à 30 ans (référence, central)');
ok(d.prudente.central.r30 > d.reference.central.r30 && d.reference.central.r30 > d.favorable.central.r30, 'prudente > référence > favorable');
var eco = { p: Y.economiesPourStabiliser('central', 'prudente'), r: Y.economiesPourStabiliser('central', 'reference'), f: Y.economiesPourStabiliser('central', 'favorable') };
proche(eco.r, 36.7, 0.2, 'économies pour une dette stable : ≈ 37 Md€/an (référence)');
ok(eco.p > eco.r && eco.r > eco.f && eco.f > 0, 'prudente 67 > référence 37 > favorable 8');
var cb = Y.combinaison();
proche(cb.rendement[2040], 12.32, 0.05, 'combinaison recommandée (R1f, M1m, M2m, M3) : 12,3 Md€ en 2040');
ok(cb.manque.reference > 25 && cb.manque.reference < 35, 'elle ne suffit pas : il manque ≈ 30 Md€/an (référence)');
proche(Y.hautesPensions(), 11.19, 0.01, 'option hautes pensions non regroupées (prélèvement) : 11,2 Md€');

// ---------- 5. Cas types, ciblage, reste à vivre
var k = Y.casTypesObjet();
['smic_seul', 'net_1500', 'parent_isole_smic', 'couple_2smic_2enf'].forEach(function (id) { ok(k[id].ecart >= 20 && k[id].ecart <= 80.5, 'ciblage bas : ' + id + ' ' + k[id].ecart.toFixed(1) + ' €'); });
['sans_emploi', 'aah', 'retraite_1200', 'retraite_2000', 'retraite_4000'].forEach(function (id) { proche(k[id].ecart, 0, 0.01, 'aucun perdant : ' + id); });
proche(k.cadre_10000.ecartPct, -0.0348, 0.001, 'cadre à 10 000 € brut : −3,5 % (cible −1 à −3 % dépassée de 0,5 point)');
proche(k.cadre_20000.ecartPct, -0.001, 0.001, 'cadre à 20 000 € brut : −0,1 % (hors cible, limite de la forme)');
ok(k.rentier.ecart < -500 && k.retraite_aise.ecart < -500, 'le capital paie : rentier et retraité aisé perdent plus de 500 €/mois');
proche(k.smic_seul.ecartPctRAV, 64.2 / (1706.3 * 0.61), 0.002, 'Smic : +6,2 % du reste à vivre (catégorie « modestes », 39 % de dépenses pré-engagées)');
ok(k.sans_emploi.categorie === 'pauvres' && k.cadre_10000.categorie === 'aises', 'catégories de niveau de vie DREES');
ok(Math.abs(k.smic_seul.ecartPctRAV) > Math.abs(k.cadre_10000.ecartPctRAV) / 1, 'le gain du Smic pèse plus dans son reste à vivre que la perte du cadre dans le sien');
proche(Y.tfGrenoble(), 1836, 1e-9, 'taxe foncière d\'un 90 m² à Grenoble : 1 836 €/an (hypothèse de valeur locative)');
ok(k.proprio_grenoble_300k.ecartPatrimoine > 90 && k.proprio_1M.ecartPatrimoine > 0, 'propriétaires gagnants : Grenoble 300 000 € (≈ +99 €/mois), 1 M€ (≈ +20 €/mois)');
var tm = Y.tme();
ok(tm.max.taux <= 0.75 && tm.trappes.length === 0, 'TME ≤ 75 % (' + tm.max.taux.toFixed(3) + ') et aucune trappe');

// ---------- 6. Collectivités
var bq = Y.bascule();
proche(bq.bloc.partPatrimoine, 1, 1e-9, 'bloc communal : toute la taxe du patrimoine');
ok(bq.bloc.mdT > 25 && bq.bloc.mdT < 32, 'et ≈ 29 Md€ de T(R) pour compléter (3 % de T)');
proche(bq.departements.partT + bq.regions.partT + bq.aom.partT + bq.bloc.partT, (55.37 + 9.86 + 0.16 + 12.2 - bq.patrimoine) / bq.T, 1e-9, 'parts de T cohérentes');

log('\n' + n + ' vérifications réussies (decisions_0611_v72.js)');
