// Tests de la v7.1 du plan A (bareme_v71.js ; arbitrage 42 ; PROPOSITION, non adoptée). Depuis ce dossier, avec jsc (en zsh, liste en tableau) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js bareme_unique_v6.js \
//     bareme_deux_fonctions_v7.js bareme_v71.js test_bareme_v71.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
var X = this.BaremeV71, W = this.BaremeDeuxFonctionsV7, V = this.BaremeUniqueV6;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- 1. Données : dividendes, IS, retenue
var pd = X.partsDividendes();
proche(pd.holdingsMd, 9.04, 0.01, 'bénéfices retenus des holdings imputés (modele.js) : 9,0 Md€, crédités');
proche(pd.dividendesMd.reduce(function (a, x) { return a + x; }, 0), pd.poolMd, 1e-9, 'la répartition par bande conserve la masse des dividendes');
ok(pd.phi[13] <= 0.85 && pd.phi[13] > pd.phi[12] && pd.phi[12] > pd.phi[9], 'part des dividendes croissante vers le sommet, plafonnée');
proche(pd.dividendesMd[13] / pd.poolMd, 0.53, 0.01, 'la bande des 0,1 % reçoit 53 % des dividendes (62 % visés, plafond de 80 % de son capital)');
proche(X.recetteIS(0.25, 'central').ecart, 3.51, 0.01, 'régime unique à 25 % : +3,5 Md€ (taux réduit PME, brevets, tonnage, perte de 25 %)');
proche(X.recetteIS(0.28, 'central').ecart, 10.26, 0.01, 'variante 28 % : +10,3 Md€ d\'IS (déplacement de bénéfices compris)');
ok(X.retenue().gainMd < 0.1, 'retenue au maximum conventionnel : gain négligeable (le droit actuel est déjà au plafond, sauf personnes physiques)');
proche(X.retenue().tauxMoyen, 0.072, 0.001, 'taux conventionnel moyen pondéré ≈ 7 % (ordre de grandeur)');
// ---------- 2. Mécanique du crédit
var tb = X.tauxSurBenefice('C', 1e6);
proche(tb.benefice, tb.travail, 1e-12, 'IS + fonction, crédit déduit = taux marginal du travail sur le bénéfice');
proche(tb.dividendeNet, (0.65 - 0.25) / 0.75, 1e-12, 'sur le dividende net : (m − t_IS) / (1 − t_IS) = 53,3 %');
var a3 = { S: 400, mInf: 0.65, m0: 0.20, K: 1500 };
proche(X.haut(X.sched(a3), 0.42, 'central', { kappa: 0.6, reaction: false }), V.haut(V.bareme(W.HYP.A3), 0.42, 'central'), 1e-9, 'option κ = 0,6 sans réaction : retrouve exactement le moteur de la v7');
// ---------- 3. Capital à 100 % avec crédit contre κ = 0,6 (barème A3)
var ck = X.comparaisonKappa(a3, 'central', true), cm = X.comparaisonKappa(a3, 'central', false);
proche(ck.total, 60.56, 0.05, 'capital à 100 % avec crédit : +60,6 Md€ par rapport à κ = 0,6 (central, avec réaction du capital)');
proche(ck.actifs.creditMoinsKappa06, 46.79, 0.05, 'dont actifs +46,8'); proche(ck.retraites.creditMoinsKappa06, 13.77, 0.05, 'dont capital des retraités +13,8');
proche(cm.total, 69.78, 0.05, 'mécanique (sans réaction) : +69,8');
proche(cm.actifs.kappa1MoinsCredit, 6.59, 0.05, 'le crédit d\'IS rend 6,6 Md€ par rapport à κ = 1 (l\'ordre de grandeur de 6 Md€ de la v7 est retrouvé)');
proche(X.comparaisonKappa(a3, 'bas', true).total, 78.81, 0.05, 'favorable +78,8'); proche(X.comparaisonKappa(a3, 'haut', true).total, 24.44, 0.05, 'défavorable +24,4');
// ---------- 4. Calibrage C (ciblage) et N (neutre)
var bC = X.bilan('C', 'central'), bN = X.bilan('N', 'central');
proche(bC.ecart, 70.89, 0.05, 'C : recettes +70,9 Md€ au-dessus du droit actuel (central)');
proche(bN.ecart, 0.32, 0.05, 'N : neutre (+0,3 Md€)');
proche(X.bilan('C', 'bas').ecart, 65.20, 0.05, 'C favorable +65,2'); proche(X.bilan('C', 'haut').ecart, 73.96, 0.05, 'C défavorable +74,0');
ok(X.evaluer('C', 'ciblage') !== null, 'C respecte le ciblage, les rentiers et le TME');
ok(X.evaluer('N', 'neutre') !== null, 'N respecte la neutralité, les rentiers et le TME');
ok(X.evaluer('N', 'ciblage') === null && X.evaluer('C', 'neutre') === null, 'le trilemme demeure : ni C ni N ne tient les deux');
var cC = X.casTypesObjet('C'), cN = X.casTypesObjet('N');
['smic_seul', 'parent_isole_smic', 'couple_2smic_2enf', 'net_1500', 'net_1750'].forEach(function (k) { ok(cC[k].ecart >= 20 && cC[k].ecart <= 80.5, 'C, bas revenus dans la cible : ' + k + ' ' + cC[k].ecart.toFixed(1)); });
proche(cC.cadre_10000.ecart / cC.cadre_10000.avant, -0.035, 0.001, 'C : cadre à 10 000 € brut −3,5 %'); proche(cC.cadre_20000.ecart / cC.cadre_20000.avant, -0.001, 0.001, 'C : à 20 000 € −0,1 %');
proche(cC.couple_median_2enf.ecart, 399.6, 0.5, 'C : couple médian +400 (hors cible, comme la v7)');
proche(cN.smic_seul.ecart, 136.9, 0.5, 'N : Smic seul +137'); proche(cN.couple_2smic_2enf.ecart, 538.0, 0.5, 'N : couple à deux Smic, 2 enfants +538'); proche(cN.couple_median_2enf.ecart, 648.8, 0.5, 'N : couple médian +649');
proche(cN.cadre_10000.ecart / cN.cadre_10000.avant, -0.060, 0.001, 'N : cadre à 10 000 € −6,0 %');
// ---------- 5. Rentier : il ne gagne plus
ok(cC.rentier_div_5000.ecart < 0 && cC.rentier_mixte_5000.ecart < 0 && cN.rentier_div_5000.ecart < 0, 'le rentier ne gagne plus (il gagnait +604 €, +18 %, avec κ = 0,6)');
proche(cC.rentier_div_5000.ecart, -17.1, 0.5, 'C : rentier en dividendes −17 €'); proche(cC.rentier_mixte_5000.ecart, -314.6, 0.5, 'C : dividendes + intérêts −315 € (−9 %)');
proche(cC.retraite_d5_0.ecart, 0, 0.01, 'retraité sans capital : pension inchangée (regroupement à net constant)');
ok(cC.retraite_d10_2000.ecart < -500, 'retraité aisé avec 2 000 € de capital : perd plus de 500 €');
// ---------- 6. Gros gains, TME, dette
var g = X.casCessions('C');
proche(g[0].tauxAvec, 0.610, 0.001, 'C : cession de 1 M€ après 20 ans : 61,0 % avec lissage (34,2 % aujourd\'hui)'); proche(g[2].tauxAvec, 0.649, 0.001, '50 M€ : 64,9 %');
var tC = X.tme('C'), tN = X.tme('N');
ok(tC.max.taux <= 0.75 && tN.max.taux <= 0.75, 'TME ≤ 75 % (C ' + tC.max.taux.toFixed(3) + ', N ' + tN.max.taux.toFixed(3) + ')'); ok(tC.trappes.length === 0 && tN.trappes.length === 0, 'aucune trappe à inactivité');
proche(X.economiesPourStabiliser('central', 'N'), 60.6, 0.2, 'N : ≈ 61 Md€ d\'économies de plus par an pour stabiliser la dette (comme la v7)');
proche(X.economiesPourStabiliser('central', 'C'), 0, 1e-9, 'C : le surcroît de recettes suffit à stabiliser la dette (central)');
proche(X.dette('central', 'C').r30, 0.964, 0.002, 'C : dette à 96 % du PIB à 30 ans'); proche(X.dette('central', 'N').r30, 1.707, 0.002, 'N : 171 % à 30 ans');
// ---------- 7. Sensibilité : rétention des bénéfices sans transparence des holdings
X.HYP.couverture = 0; proche(X.comparaisonKappa(a3, 'central', true).total, 30.8, 0.1, 'sans transparence des holdings, le surcroît tombe à ≈ 31 Md€'); X.HYP.couverture = null;
log('\n' + n + ' vérifications réussies (bareme_v71.js)');
