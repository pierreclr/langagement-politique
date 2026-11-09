// Tests de la v7, plan A « deux fonctions » (bareme_deux_fonctions_v7.js ; PROPOSITION, non adoptée). Depuis ce dossier, avec jsc (en zsh, liste en tableau) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js bareme_unique_v6.js bareme_deux_fonctions_v7.js test_bareme_deux_fonctions_v7.js)
var W = this.BaremeDeuxFonctionsV7, V = this.BaremeUniqueV6, J = this.Decisions0511j;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- 1. Neutralité par rapport au droit actuel
proche(W.surplusV510(), 58.74, 0.005, 'la v5.10 prélève 58,7 Md€ de plus que le droit actuel sur le périmètre de la fonction des revenus (lignes du bilan global)');
proche(W.socleSansReprise().socle, 87.8, 0.1, 'sans reprise par les taux, les aides supprimées (40,8 Md€) ne financent qu\'un socle de 88 € par adulte non retraité');
var a3 = W.effet('A3', 'central');
proche(a3.effet, -59.60, 0.02, 'A3 : la fonction rend 59,6 Md€ à la v5.10 (neutre à 0,9 Md€ près, recettes un peu sous le droit actuel)'); ok(a3.effet <= W.cible(), 'recettes ≤ droit actuel');
proche(W.effet('A3', 'bas').effet, -76.88, 0.02, 'favorable −76,9'); proche(W.effet('A3', 'haut').effet, -32.20, 0.02, 'défavorable −32,2 (les réactions du haut jouent dans les deux sens)');
proche(W.effet('A2', 'central').effet, -0.33, 0.02, 'A2 (capital compté comme le travail, même barème) : ne rend presque rien, prélève ≈ 58 Md€ de plus que le droit actuel');
proche(W.effet('A1', 'central').effet, -59.23, 0.02, 'A1 (capital comme le travail, socle relevé à 550 €) : neutre');
// ---------- 2. La fonction
var s = W.sched('A3'); proche(s.S - s.T(0), 400, 1e-9, 'B(0) = 400 €'); proche(s.S - s.T(2000), 400 - (0.65 * 2000 - 0.45 * 1500 * (1 - Math.exp(-4 / 3))), 1e-9, 'B(R) = 400 − 0,65 R + 675 (1 − e^(−R/1 500))');
proche(s.m(0), 0.20, 1e-12, 'taux marginal au premier euro 20 %'); proche(s.m(1e6), 0.65, 1e-9, 'taux marginal maximal 65 %');
// ---------- 3. Cas types (écart au droit actuel, €/mois) : ciblage validé (+20 à +80 en bas, −1 à −3 % en haut)
var c = W.casTypesObjet('A3');
['smic_seul', 'parent_isole_smic', 'couple_2smic_2enf', 'net_1500', 'net_1750'].forEach(function (k) { ok(c[k].ecart >= 20 && c[k].ecart <= 80.5, 'bas revenus dans la cible : ' + k + ' ' + c[k].ecart.toFixed(1)); });
proche(c.smic_seul.ecart, 64.2, 0.2, 'célibataire au Smic : +64'); proche(c.couple_2smic_2enf.ecart, 33.5, 0.2, 'couple à deux Smic, 2 enfants : +34'); proche(c.couple_2smic_0enf.ecart, 94.4, 0.2, 'sans enfant : +94 (un peu au-dessus)');
proche(c.net_2000.ecart, 138.0, 0.3, 'salarié à 2 000 € net : +138'); proche(c.net_3000.ecart, 76.5, 0.3, 'à 3 000 € net : +77');
proche(c.couple_median_2enf.ecart, 374.6, 0.5, 'couple médian, 2 enfants : +375 (hors cible : 200 € par enfant contre les allocations et le quotient familial)');
proche(c.cadre_10000.ecart / c.cadre_10000.avant, -0.037, 0.001, 'cadre à 10 000 € brut : −3,7 %'); proche(c.cadre_20000.ecart / c.cadre_20000.avant, -0.002, 0.001, 'à 20 000 € : −0,2 %'); proche(c.cadre_5000.ecart / c.cadre_5000.avant, 0.010, 0.001, 'à 5 000 € : +1,0 %');
proche(c.rentier_5000.ecart, 603.6, 0.5, 'rentier à 5 000 €/mois : +604 € (κ = 0,6 : le capital compte pour 60 %) : la limite d\'A3');
ok(c.sans_emploi.ecart === 0 && c.aah.ecart === 0, 'sans emploi et AAH : inchangés');
var c1 = W.casTypesObjet('A1'); proche(c1.rentier_5000.ecart / c1.rentier_5000.avant, -0.140, 0.002, 'A1 : rentier −14 %'); proche(c1.couple_median_2enf.ecart, 674.6, 0.5, 'A1 : couple médian +675 (la neutralité rend l\'argent du capital à la classe moyenne)');
// ---------- 4. Taux marginaux
var t = W.tme('A3'); ok(t.max.taux <= 0.75, 'TME maximal ' + t.max.taux.toFixed(3) + ' ≤ 75 %'); proche(t.max.taux, 0.708, 0.002, 'atteint vers 3 675 € (fin du plancher d\'une personne seule)'); ok(t.trappes.length === 0, 'aucune trappe');
// ---------- 5. Fonction du patrimoine
var tn = W.tauNeutre(); proche(tn.tau, 0.01343, 0.00005, 'taux général neutre : 1,34 % (remplace taxe foncière, IFI et DMTO : 61,7 Md€)');
ok(W.recettePatrimoine(0.02).nette < 70 && W.recettePatrimoine(0.025).nette < W.recettePatrimoine(0.02).nette, 'recette maximale ≈ 66 Md€ vers 2 % : les DMTG (20,8) ne peuvent pas être remplacés en plus');
proche(W.taxePatrimoine(250000, 0), 1250, 1e-9, 'résidence principale de 250 000 € : 1 250 €/an'); proche(W.taxePatrimoine(1e6, 49e6), 0.005 * 300000 + tn.tau * 49.7e6 + 0.005 * 40e6, 1e-6, '50 M€ : 0,5 % + τ + 0,5 point au-delà de 10 M€');
var li = W.incidenceLoyers(); proche(li.loyerNetSiTransmisTotal, 0.103, 0.002, 'loyers : au plus +10 % si la hausse nette (DMTO déduits) était entièrement répercutée');
// ---------- 6. Lissage, exit tax
var cs = W.casCessions('A3'); ok(cs[0].avecLissage < cs[0].sansLissage, 'le lissage réduit l\'impôt sur une cession de 1 M€'); proche(cs[0].tauxAvec, 0.355, 0.002, '1 M€ après 20 ans : 35,5 % avec lissage (38,8 % sans ; droit actuel 34,2 %)');
proche(cs[2].tauxAvec, 0.389, 0.002, '50 M€ : 38,9 % (droit actuel 35,4 %)');
var ex = W.exitProrata(300e6, 10, 1); proche(ex.partFrance, 10 / 11, 1e-12, 'exit tax : 10/11 du gain imposé en France'); proche(ex.impotFrance / 1e6, 106.3, 0.2, '106 M€ sur une vente de 300 M€');
// ---------- 7. Pensions
proche(W.pensions('A3', 2500, 1).rendementMd, 0, 1e-6, 'pensions regroupées à net constant : aucun perdant'); proche(W.pensions('A3', 2500, 0).rendementMd, 11.22, 0.02, 'option : 11,2 Md€ au-delà de 2 500 € brut');
// ---------- 8. Solde et dette du plan A
var e = W.ecartPlanA('central'); proche(e.total, -115.72, 0.05, 'plan A − v5.10 : −115,7 Md€ (revenus −59,6 ; patrimoine −70,8 ; capital de départ +14,7)');
proche(W.solde('central', 2060), -103.2, 0.1, 'solde de croisière du plan A : −103 Md€ (≈ 3,5 % du PIB, proche du déficit stabilisant de 3,6 %)');
var d = W.dette('central'); proche(d.r10, 1.439, 0.001, 'mais la dette monte pendant la transition : 143,9 % à 10 ans'); proche(d.r30, 1.719, 0.001, '171,9 % à 30 ans');
proche(W.economiesPourStabiliser('central'), 61.7, 0.2, 'économies supplémentaires pour ne jamais dépasser 123,5 % : ≈ 62 Md€ par an');
log('\n' + n + ' vérifications passées (bareme_deux_fonctions_v7.js)');
