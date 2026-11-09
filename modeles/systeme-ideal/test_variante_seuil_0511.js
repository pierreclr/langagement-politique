// Tests des variantes du seuil de l'impôt progressif exprimé en salaire net (variante_seuil_0511.js ; OPTIONS, rien d'adopté). Depuis ce dossier, avec jsc (fonction load requise) :
//   LIST=(la liste de test_decisions_0511j.js, de modele.js à decisions_0511j.js, puis) variante_seuil_0511.js test_variante_seuil_0511.js
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//   ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_seuil_0511.js test_variante_seuil_0511.js
// (en zsh : passer la liste par un tableau). Durée : ≈ 40 s (chaque variante recharge toute la pile).
var V = this.VarianteSeuil0511, J0 = this.Decisions0511j, P10 = this.Palier1;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- 1. Conversion du net en coût employeur (OpenFisca 2026)
var c20 = V.r0DeNet(2000), c15 = V.r0DeNet(1500), c175 = V.r0DeNet(1750);
proche(c20.brut, 2526.55, 0.01, '2 000 € net = 2 526,55 € brut');
proche(c20.R0, 37833.1, 0.5, '2 000 € net = 37 833 € de coût employeur par an (allègements généraux 2026 déduits)');
proche(c20.R0horsAllegements, 42890.3, 0.5, 'hors allègements : 42 890 €/an (l\'« environ 42 000 € » attendu)');
proche(c20.allegementAn, 5057.2, 0.5, 'allègement général à 2 000 € net : 5 057 €/an');
proche(c20.coin, 1 - 2000 / 3152.76, 1e-9, 'coin socio-fiscal hors impôt sur le revenu à 2 000 € net : 36,6 % du coût');
proche(c15.R0, 23952.1, 0.5, '1 500 € net = 23 952 € : le R0 de la v5.10 (24 000 €) correspond DÉJÀ à 1 500 € net');
ok(Math.abs(c15.R0 - V.HYP.ref.R0) / V.HYP.ref.R0 < 0.003, 'écart entre 1 500 € net et le R0 de la v5.10 < 0,3 %');
proche(c175.R0, 31119.6, 0.5, '1 750 € net = 31 120 €/an');
ok(V.HYP.R0_2000 === 38000 && V.HYP.R0_2000_HA === 43000 && V.HYP.R0_1750 === 31000 && V.HYP.R0_1500 === 24000, 'R0 arrondis au millier : 38 000 / 43 000 / 31 000 / 24 000');
proche(V.NET_ACTUEL[1478].rd, 1706.30, 0.01, 'contrôle OpenFisca : célibataire au Smic, même revenu disponible que la v5.10 (1 706,30 €)');
proche(V.NET_ACTUEL[2000].ir, 68.75, 0.01, 'impôt sur le revenu actuel à 2 000 € net : 68,75 €/mois');

// ---------- 2. Le monde de référence redonne la v5.10, et l'appelant n'est pas touché
var Wr = V.monde(24000, 0.30), Jr = Wr.Decisions0511j;
ok(Jr !== J0 && Wr.Palier1 !== P10, 'monde neuf : objets distincts de ceux de l\'appelant');
ok(this.Decisions0511j === J0 && this.Palier1 === P10 && P10.BASE.R0 === 24000 && P10.BASE.tMax === 0.30, 'globaux de l\'appelant restaurés (R0 24 000, t_max 30)');
proche(Jr.solde('central', 2060), J0.solde('central', 2060), 1e-9, 'monde de référence : solde de croisière identique à la v5.10 (+12,50)');
var ct0 = J0.casTypes(0.43), ctr = V.casTypes(Wr, 0.43);
ok(Object.keys(ct0).every(function (k) { return Math.abs(ct0[k] - ctr[k]) < 1e-9; }), 'monde de référence : cas types identiques à la v5.10');
proche(Jr.marginalMax(0.43).taux, J0.marginalMax(0.43).taux, 1e-12, 'monde de référence : taux marginal maximal identique (74,0 %)');
proche(V.parcoursDelta(Wr, 0).cumulFinal, J0.parcours(J0.planTaux(2044)).cumulFinal, 0.01, 'parcours exact = parcours de la grille aux taux de la grille (cumul 2070 : +260,7)');
ok(V.parcoursDelta(Wr, 0).picAn === null, 'référence : 43 % de 2029 à 2044 tient');
proche(V.recetteMecanique(Wr, 0.42), 175.61, 0.01, 'recette mécanique de l\'impôt progressif de la v5.10 : 175,6 Md€');
proche(V.contributionNette(Wr, 0.42), 109.31, 0.01, 'contribution nette au solde de la v5.10 : 109,3 Md€ (le « ≈ 115 » cité)');

// ---------- 3. Variante (a) : R0 = 2 000 € net (38 000 €), t_max 30
var ra = V.evaluer({ R0: 38000, tMax: 0.30 }, true);
proche(ra.ecartSolde, -38.54, 0.01, '(a) perte de solde en croisière : −38,5 Md€/an (central, 42 %)');
proche(ra.solde42.central, -26.04, 0.01, '(a) solde de croisière : −26,0 Md€');
proche(ra.recetteMecanique, 120.21, 0.01, '(a) recette mécanique : 120,2 Md€ (−55,4)');
proche(ra.contributionNette, 70.77, 0.01, '(a) contribution nette : 70,8 Md€');
ok(ra.periodeMinimale43 === null, '(a) le plan 43 % puis 42 % ne tient plus, quelle que soit la durée');
proche(ra.tauxCroisiere, 0.44279, 0.0001, '(a) taux d\'équilibre de croisière : 44,28 % (v5.10 : 40,84 %)');
['couple_2smic_2enf', 'couple_2smic_0enf', 'parent_isole_smic', 'smic_seul'].forEach(function (k) { proche(ra.cas43[k], ct0[k], 1e-9, '(a) ' + k + ' inchangé (sous les deux seuils)'); });
proche(ra.cas43.net_2000 - ctr.net_2000, 45.58, 0.05, '(a) salarié à 2 000 € net : +45,6 €/mois (impôt progressif de 60,8 € supprimé, moins 25 % de complément de plancher)');
proche(ra.cas43.cadre_20000 - ct0.cadre_20000, 842.08, 0.05, '(a) cadre à 20 000 € brut : +842 €/mois : la baisse croît avec le revenu');
ok(ra.cas43.cadre_10000 - ct0.cadre_10000 > ra.cas43.net_3000 - ctr.net_3000 && ra.cas43.net_3000 - ctr.net_3000 > ra.cas43.net_2000 - ctr.net_2000, '(a) gain croissant : 2 000 € net < 3 000 € net < cadre 10 000 €');
proche(ra.marginalMax43.taux, 0.73, 0.0001, '(a) taux marginal maximal : 73,0 % (asymptote 43 + 30)');
proche(ra.net2000.tme, 0.5725, 0.0001, '(a) taux marginal à 2 000 € net : 57,3 % (v5.10 : 65,1 % ; actuel : 73,2 %)');

// ---------- 4. Variante (b) : t_max relevé pour la même recette : impossible
var rb = V.tMaxMemeRecette(38000);
ok(rb.tMax === null, '(b) aucun t_max ≤ 60 points ne redonne le solde de la v5.10 (courbe de Laffer du haut)');
proche(rb.tMaxMeilleur, 0.37, 1e-9, '(b) meilleur t_max : 37 points'); proche(rb.meilleurSolde, -22.76, 0.01, '(b) meilleur solde : −22,8 Md€ (manque 35,3)');
ok(V.tMaxPlafond(38000) === 0.32, '(b75) t_max maximal sous le plafond de 75 % à 43 % : 32 points');
proche(V.soldeCroisiere(V.monde(38000, 0.32), 'central'), -24.49, 0.01, '(b75) solde à t_max 32 : −24,5 Md€ (1,5 de mieux que (a))');

// ---------- 5. Variante (c) : taux de base relevé pour l'équilibre
var W38 = V.monde(38000, 0.30), d = V.deltaMinimal(W38);
proche(d, 0.0349, 1e-9, '(c) δ minimal : +3,49 points (46,49 % de 2029 à 2044, puis 45,49 %)');
ok(V.parcoursDelta(W38, d).picAn === null && V.parcoursDelta(W38, d - 0.0001).picAn !== null, '(c) δ est bien le plus petit au centième de point');
ok(W38.Decisions0511j.marginalMax(0.43 + d).taux > 0.75, '(c) à t_max 30, le taux marginal maximal dépasse 75 % (76,5 %)');
var J38 = W38.Decisions0511j;
ok(J38.soldeGrille(2060, 0.463) - J38.solde('central', 2060, 0.463) > 2, 'HS4 : au-delà de 43 %, la grille extrapolée surestime le solde de plus de 2 Md€ à 46,3 % : le plan est jugé sur le solde exact');
var c75 = V.equilibrePlafond(38000);
ok(c75.tMax === 0.28 && Math.abs(c75.delta - 0.0356) < 1e-9, '(c75) sous le plafond : t_max 28 points et δ +3,56 points');
var rc = V.evaluer({ R0: 38000, tMax: 0.30, delta: d }, true);
proche(rc.cas43.couple_2smic_2enf, -121.89, 0.05, '(c) couple à deux Smic : −121,9 €/mois face au droit actuel (v5.10 : +16,8)');
ok(rc.cas43.smic_seul < ct0.smic_seul && rc.cas43.parent_isole_smic < ct0.parent_isole_smic, '(c) le Smic seul et le parent isolé perdent par rapport à la v5.10');
ok(rc.cas43.net_2000 < ctr.net_2000, '(c) le salarié à 2 000 € net lui-même perd par rapport à la v5.10 (le point de taux coûte plus que l\'impôt progressif évité)');
ok(rc.cas43.net_3000 > ctr.net_3000 && rc.cas43.cadre_5000 > ct0.cadre_5000, '(c) gagnants : de 3 000 € net à 5 000 € brut et au-delà');

// ---------- 6. Variante (d) : 1 500 € net = v5.10 ; (d2) 1 750 € net
ok(V.monde(V.HYP.R0_1500, 0.30) === Wr, '(d) 1 500 € net : même monde que la v5.10');
var W31 = V.monde(31000, 0.30);
proche(V.soldeCroisiere(W31, 'central') - V.soldeCroisiere(Wr, 'central'), -22.59, 0.01, '(d2) 1 750 € net : −22,6 Md€/an');
proche(V.deltaMinimal(W31), 0.0211, 1e-9, '(d2) δ minimal : +2,11 points');

log(n + ' vérifications réussies');
