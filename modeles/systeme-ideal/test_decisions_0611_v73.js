// Tests de la v7.3 PROPOSÉE (decisions_0611_v73.js ; 06/11/2026, non adoptée). Depuis ce dossier, avec jsc (en zsh, liste en tableau) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js \
//     bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js decisions_0611_v73.js test_decisions_0611_v73.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
var Z = this.Decisions0611V73, Y = this.Decisions0611V72, TP = this.TaxePatrimoine, J = this.Decisions0511j;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- 1. La fonction du patrimoine : forme, repères de l'auteur, continuité
ok(Z.formulePatrimoine() === 'τ(W) = 2 % × W / (W + 1 M€) ; P(W) = τ(W) × W', 'formule en une ligne');
proche(Z.tauxMoyen(3e5), 0.0046, 0.0001, '300 000 € : 0,46 % (repère de l\'auteur ≈ 0,5 %)');
proche(Z.tauxMoyen(1e6), 0.01, 1e-12, '1 M€ : 1 % (repère de l\'auteur)');
proche(Z.tauxMoyen(1e8), 0.0198, 0.0001, '100 M€ : 1,98 % (≈ 2 %, sans seuil à 100 M€)');
ok(Z.tauxMoyen(5e4) < 0.001 && Z.Tp(0) === 0, 'petits patrimoines : taux moyen ≈ 0 (0,10 % à 50 000 €, 48 €/an)');
var tp = Z.tablePatrimoine(); ok(tp.length === 8 && tp[0].W === 5e4 && tp[7].W === 1e9, 'table à 50 k€, 100 k€, 300 k€, 1 M€, 3 M€, 10 M€, 100 M€, 1 Md€');
proche(tp[2].taxe, 1384.6, 0.1, '300 000 € : 1 385 €/an');
proche(tp[3].taxe, 10000, 1e-6, '1 M€ : 10 000 €/an');
var lastM = -1, lastT = -1, mono = true, maxM = 0, W0; for (W0 = 0; W0 <= 3e9; W0 += 5e5) { var mm = Z.mp(W0), tt = Z.tauxMoyen(W0); if (mm < lastM - 1e-15 || tt < lastT - 1e-15) mono = false; lastM = mm; lastT = tt; if (mm > maxM) maxM = mm; }
ok(mono, 'taux moyen et taux marginal croissants partout : ni seuil ni marche');
ok(maxM < 0.02 && Z.mp(1e10) > 0.01999, 'taux marginal maximal : 2 %, jamais atteint ni dépassé');
proche(Z.mp(0), 0, 1e-15, 'taux marginal nul au premier euro');
proche((Z.Tp(1e6 + 1) - Z.Tp(1e6 - 1)) / 2, Z.mp(1e6), 1e-6, 'dérivée continue : 1,5 % à 1 M€');
proche(Z.taxePatrimoine(5e5, 4e5), Z.Tp(9e5), 1e-9, 'une seule formule sur la valeur nette totale');

// ---------- 2. Recette (érosion ménage par ménage, exil, différé)
var flat = Z.recettePatrimoine('central', function () { return 0.01; }), ref = TP.recette('central', { assiette: 'pierreNet', taux: 0.01, differe: true, avecReformeImmo: true });
proche(flat.nette, ref.nette, 1e-9, 'contrôle : à taux plat de 1 %, on retrouve exactement taxe_patrimoine.js (72,9 Md€)');
var r = { f: Z.recettePatrimoine('bas'), c: Z.recettePatrimoine('central'), d: Z.recettePatrimoine('haut') };
proche(r.c.nette, 66.23, 0.02, 'recette nette centrale : 66,2 Md€');
ok(r.f.nette > r.c.nette && r.c.nette > r.d.nette, 'favorable 83,6 > central 66,2 > défavorable 47,8');
proche(r.c.tauxEffectif, 0.00991, 0.00002, 'taux effectif moyen 0,99 % (v7.2 : 0,30 %)');
ok(r.c.erosionTop > 0.55 && r.c.erosionTop < 0.62, 'érosion du capital mobile du 1 % : 59 % (loi exponentielle)');
ok(r.c.nette > Y.recettePatrimoine(Y.tau().K, 'central').nette + 39 && r.c.nette > Y.HYP.remplacees, 'plus que la v7.2 (26,3) et que les impôts remplacés (61,7)');
var ps = Z.plafondSommet('central');
ok(ps.excedent > 10 && ps.excedent < 16 && ps.menages > 4e5, 'plafond de 75 % : ≈ 13 Md€ d\'excédent, ≈ 540 000 ménages');
proche(Z.lignesPatrimoine('central').plafonds + this.BaremeDeuxFonctionsV7.NEUTRALITE.patrimoine510.N09_plafonds, -ps.perte, 1e-9, 'la perte du plafond au sommet remplace N09 au prorata (plus coûteuse)');
proche(Z.gainPatrimoineVsV72('central'), 35.47, 0.02, 'gain du volet patrimoine sur la v7.2 : +35,5 Md€');

// ---------- 3. Répartition : dette d'abord, puis la fonction des revenus
var rp = Z.repartition();
proche(rp.manqueDette, 29.51, 0.02, 'manque de la dette de la v7.2 : 29,5 Md€/an (macro de référence, avec la combinaison)');
ok(rp.allegementRevenus > 0 && rp.allegementRevenus <= rp.disponiblePourRevenus, 'allègement de la fonction des revenus (5,3) ≤ disponible (6,0)');
ok(Z.formule() === 'B(R) = 412.5 + 785 × (1 − e^(−R/2000)) − 0.655 × R', 'fonction des revenus recalibrée, même forme');
proche(Z.surplus('central'), 65.61, 0.02, 'surplus de la fonction des revenus : 65,6 Md€ (v7.2 : 70,9)');
var cb = Z.combinaison();
proche(cb.manque.reference, 0, 1e-9, 'avec la combinaison recommandée, plus aucun manque en macro de référence');
ok(cb.manque.prudente > 25 && cb.manque.favorable === 0, 'prudente : il manque encore ≈ 28 Md€ ; favorable : 0');
var d = Z.dette();
ok(d.reference.central.r30 < d.reference.central.r0 && d.reference.central.r30 > 1.10, 'sans économies, dette à 114 % à 30 ans (référence) contre 146 % en v7.2');
proche(Z.economiesPourStabiliser('central', 'reference'), 6.5, 0.2, 'économies pour une dette stable : 6,5 Md€/an (v7.2 : 36,7)');

// ---------- 4. Cas types : ciblage, propriétaires, non confiscatoire
var k = Z.casTypesObjet();
['smic_seul', 'net_1500', 'parent_isole_smic', 'couple_2smic_2enf'].forEach(function (id) { ok(k[id].ecart >= 20 && k[id].ecart <= 80.5, 'ciblage bas : ' + id + ' ' + k[id].ecart.toFixed(1) + ' €'); });
['sans_emploi', 'aah', 'retraite_1200', 'retraite_2000', 'retraite_4000'].forEach(function (id) { proche(k[id].ecart, 0, 0.01, 'aucun perdant : ' + id); });
ok(k.cadre_10000.ecartPct <= -0.01 && k.cadre_10000.ecartPct >= -0.03, 'cadre à 10 000 € brut : −2,9 % (dans la cible, v7.2 : −3,5 %)');
proche(k.cadre_20000.ecartPct, -0.0038, 0.001, 'cadre à 20 000 € brut : −0,4 % (hors cible, limite de la forme)');
proche(k.proprio_grenoble_300k.ecart, (2650 - 1384.615) / 12, 0.01, 'Grenoble, 300 000 € : 1 385 €/an au lieu de 2 650, +105 €/mois');
proche(k.proprio_1M.ecart, -(10000 - 2700) / 12, 0.01, 'résidence de 1 M€ : 10 000 €/an au lieu de ≈ 2 700, −608 €/mois');
proche(k.retraite_proprio_500k.taxePayee, 60, 1e-9, 'retraité modeste propriétaire : paie 5 % de sa pension (60 €/mois), le reste est différé');
proche(k.retraite_proprio_500k.differeAn, 2613.33, 0.01, 'différé : 2 613 €/an, récupéré à la vente ou à la succession');
ok(k.famille_proprio_400k.ecart > 400, 'famille propriétaire à crédit : gagnante (+440 €/mois)');
ok(k.rentier.chargeAvantPlafond > 0.74 && k.rentier.apres === 1250, 'rentier à 2 M€ : 75 % de son revenu (plafond atteint)');
ok(k.fortune_20M.tauxGlobalAvantPlafond > 1, '20 M€ à 3 % : plus de 100 % du revenu sans plafond (127 %)');
proche(k.fortune_20M.apres, 0.25 * k.fortune_20M.revenuMois, 1e-9, '20 M€ : le plafond de 75 % s\'applique, l\'excédent est reporté');
ok(Z.chargeRentier(4.5e6, 0.03).part < 1 && Z.chargeRentier(5.5e6, 0.03).part > 1 && Z.chargeRentier(1e8, 0.05).part < 1, 'sans plafond, plus de 100 % du revenu dès ≈ 5 M€ à 3 % de rendement ; pas à 5 % pour 100 M€');
var tm = Z.tme();
ok(tm.max.taux <= 0.75 && tm.trappes.length === 0, 'TME ≤ 75 % (' + tm.max.taux.toFixed(3) + ') et aucune trappe');

// ---------- 5. Solde, prélèvements, cohérence avec la v7.2
var e = Z.ecart('central');
proche(e.total, e.revenus + e.patrimoine + e.capitalDepart + e.n03, 1e-9, 'l\'écart est la somme de ses parties');
proche(e.total - Y.ecart('central').total, rp.resteAuDeficit, 1e-6, 'écart à la v7.2 = gain du patrimoine − allègement des revenus');
proche(Z.solde('central', 2028), J.solde('central', 2028, 0.42), 1e-9, 'avant 2029 : droit de la v5.10');
proche(Z.prelevementsDepenses('central').controle, 0, 1e-9, 'Δ prélèvements − Δ dépenses = écart');
var po = Z.prelevementsObligatoires();
proche(po.pct, 0.5072, 0.0005, 'prélèvements obligatoires bruts : 50,7 % du PIB (v7.2 49,7 %, aujourd\'hui 42,7 %)');
var bq = Z.bascule();
proche(bq.bloc.partPatrimoine * bq.patrimoine, 55.37, 1e-9, 'bloc communal entièrement financé par la fonction du patrimoine');

log('\n' + n + ' vérifications réussies (decisions_0611_v73.js)');
