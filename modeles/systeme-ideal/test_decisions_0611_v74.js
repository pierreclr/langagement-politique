// Tests de la v7.4 PROPOSÉE (decisions_0611_v74.js ; 06/11/2026, nuit, non adoptée). Depuis ce dossier, avec jsc (en zsh, liste en tableau) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js \
//     bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js decisions_0611_v73.js decisions_0611_v74.js test_decisions_0611_v74.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
var A = this.Decisions0611V74, Z = this.Decisions0611V73, Y = this.Decisions0611V72, TP = this.TaxePatrimoine, J = this.Decisions0511j;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- 0. Variante recommandée par défaut
ok(A.HYP.patrimoine.K === 7e5 && A.formulePatrimoineCourte() === 'τ(W) = 2 % × W / (W + 700 k€)', 'variante B par défaut : τ(W) = 2 % × W / (W + 700 k€)');
ok(A.formule() === Y.formule() || A.formule() === 'B(R) = 412.5 + 675 × (1 − e^(−R/1500)) − 0.65 × R', 'fonction des revenus de la variante B = celle de la v7.2');

// ---------- 1. Fonction du patrimoine, règle de paiement
proche(A.tauxMoyen(3e5), 0.006, 1e-12, '300 000 € : 0,60 %');
proche(A.Tp(1e6), 11764.7, 0.1, '1 M€ : 11 765 €/an (1,18 %)');
proche(A.tauxMoyen(1e8), 0.0199, 0.0001, '100 M€ : 1,99 %');
var lastM = -1, mono = true, W0; for (W0 = 0; W0 <= 3e9; W0 += 5e5) { var mm = A.mp(W0); if (mm < lastM - 1e-15) mono = false; lastM = mm; } ok(mono && A.mp(1e10) < 0.02, 'taux marginal croissant, jamais au-dessus de 2 %');
proche(A.Tp(A.Wtaxable(3e5, 0, true)), A.Tp(2e5), 1e-9, 'option RP : abattement de 100 000 € sur la résidence principale');
proche(A.xN(14400), 0.5 * 14400 / (14400 + 72000), 1e-12, 'x(N) = 50 % × N / (N + 72 000 €)');
ok(A.xN(0) === 0 && A.xN(1e9) < 0.5, 'x(N) nul sans revenu, jamais 50 %');
var pz = A.paiement(10000, 0, 0); ok(pz.paye === 0 && pz.differe === 10000, 'sans revenu ni actif mobilisable : tout est différé');
var pl = A.paiement(10000, 0, 1e6); ok(pl.paye === 10000, 'actifs mobilisables (2 % × 1 M€ = 20 000 €) : tout est payé');

// ---------- 2. Recette, plancher, différé
var flat = A.recettePatrimoine('central', { fTaux: function () { return 0.01; }, plancher: false, differeTP: true, terres: 1 });
var ref = TP.recette('central', { assiette: 'pierreNet', taux: 0.01, differe: true, avecReformeImmo: true });
proche(flat.nette, ref.nette, 1e-9, 'contrôle : à 1 % plat, sans plancher ni nouveautés, on retrouve taxe_patrimoine.js');
var sansP = A.recettePatrimoine('central', { fTaux: Z.tauxMoyen, plancher: false, terres: 1 }); ok(Math.abs(sansP.nette - Z.recettePatrimoine('central').nette) < 2, 'courbe v7.3 sans plancher : recette proche de la v7.3 (seul le différé change)');
var r = { f: A.recettePatrimoine('bas'), c: A.recettePatrimoine('central'), d: A.recettePatrimoine('haut') };
proche(r.c.nette, 54.52, 0.05, 'recette nette centrale : 54,5 Md€');
ok(r.f.nette > r.c.nette && r.c.nette > r.d.nette, 'favorable > central > défavorable');
ok(r.c.partDeduite > 0.3 && r.c.partDeduite < 0.4, 'l\'impôt plancher retire ≈ 35 % du dû brut (contribution déjà payée sur les revenus du capital)');
ok(r.c.effetPrix > -0.11 && r.c.effetPrix > Z.recettePatrimoine('central').effetPrix + 0.02, 'effet de prix sur l\'immobilier : −9,7 % (v7.3 : −13 %)');
var tr = A.tresorerie(); ok(tr.encours > 120 && tr.encours < 180 && tr.coutAnnuel === 0, 'différé : encours ≈ 150 Md€, coût nul pour l\'État (intérêts au taux de l\'État)');
ok(A.recettePatrimoine('central', { optRP: true }).nette < r.c.nette - 10, 'option RP (abattement de 100 000 €) : coûte plus de 10 Md€');

// ---------- 3. Neutralité, dette
proche(A.marge(), 0.32, 0.1, 'avec la combinaison recommandée, dette stable en macro de référence (marge ≈ 0,3 Md€)');
var cb = A.combinaison(); ok(cb.manque.reference === 0 && cb.manque.prudente > 25, 'manque nul en macro de référence ; ≈ 29 Md€ en macro prudente');
var po = A.prelevementsObligatoires(); ok(Math.abs(po.pct - po.v73Pct) < 0.001, 'prélèvements obligatoires 50,7 % du PIB (comme la v7.3 ; v7.2 49,7 %)');
proche(A.prelevementsDepenses('central').controle, 0, 1e-9, 'Δ prélèvements − Δ dépenses = écart');
proche(A.solde('central', 2028), J.solde('central', 2028, 0.42), 1e-9, 'avant 2029 : droit de la v5.10');
var ev = A.evaluer(A.HYP.bareme, A.surplus('central') - 0.01); ok(ev && ev.rentier < 0 && ev.tme <= 0.75, 'fonction des revenus admissible : bas dans la cible, rentier perdant, TME ≤ 75 %');

// ---------- 4. Cas types et cas limites (variante B)
var k = A.casLimitesObjet();
proche(k.grenoble_300k.v74.paye, 1800, 0.5, 'Grenoble, 300 000 € : 1 800 €/an au lieu de 2 650');
ok(k.rp_1M.v74.paye > 11000 && k.rp_1M.v74.differe < 500, 'résidence de 1 M€ (couple à 2 × 3 500 €) : ≈ 11 550 €/an payés, différé négligeable');
ok(k.actions_5M.v74.chargeTotalePct < 0.6 && k.actions_5M.v73.differe > 30000, '5 M€ d\'actions à 3 % : charge totale 58 % du revenu, plus de report (v7.3 : 37 000 €/an reportés)');
ok(k.holding_20M_cotee.v74.paye > 380000 && k.holding_20M_cotee.v73.paye < 11000, 'holding de 20 M€ qui ne distribue rien : paie le plancher (386 000 €/an) ; la v7.3 ne faisait payer que 10 500 €');
ok(k.rentier_2M.v74.Pprime < k.rentier_2M.v74.P / 2 && k.rentier_2M.v74.chargeTotalePct < 0.5, 'rentier à 2 M€ : le plancher retire les deux tiers de la taxe ; charge 49 %');
ok(k.retraite_grande_maison.v74.paye < 4000 && k.retraite_grande_maison.v74.creance20Pct < 0.25, 'retraité modeste dans une grande maison : ≈ 3 700 €/an payés, créance à 20 ans < 25 % de la valeur, pas de vente forcée');
ok(k.startup.sansRendement.differe > 5e5 && k.startup.v74.P < 12000, 'start-up : à la valeur du dernier tour, 586 000 €/an dus (aberration) ; à la valeur substantielle, 11 765 €');
ok(k.non_resident.v74.differe === 0, 'non-résident : pas de différé');
ok(k.crypto.v74.chargeTotalePct > 1, 'cryptoactifs (mobilisables) sans revenu : plus de 100 % du revenu, voulu (plus-values latentes)');
ok(k.fractionnement_enfant.v74.paye * 3 < k.fractionnement_parent.v74.paye, 'fractionnement entre trois enfants : la taxe annuelle baisse (au prix des droits de donation)');
ok(A.chargeRentier(1e8, 0.03).part < 0.7 && A.chargeRentier(1e7, 0.03).part < 0.7, 'plus jamais 100 % du revenu à 3 % de rendement, sans plafond (66 % à 100 M€)');
ok(A.chargeRentier(1e8, 0.02).part < 1, 'à 2 % de rendement : moins de 100 %');

// ---------- 5. Variante A
A.variante('A');
ok(A.formulePatrimoineCourte() === 'τ(W) = 2 % × W / (W + 1 M€)' && A.marge() >= 0, 'variante A (K = 1 M€) : dette stable aussi');
var ka = A.casTypesRevenus().filter(function (c) { return c.id === 'cadre_10000'; })[0]; ok(ka.ecartPct < -0.05, 'variante A : cadre à 10 000 € brut à −5,5 % (hors cible)');
A.variante('B');
ok(A.HYP.patrimoine.K === 7e5 && Math.abs(A.recettePatrimoine('central').nette - 54.52) < 0.05, 'retour à la variante B');

log('\n' + n + ' vérifications réussies (decisions_0611_v74.js)');
