// Tests de la v5.10 (decisions_0511j.js) : arbitrage 38 ADOPTÉ (bonus d'activité de 100 € financé par la reprise du socle entre 4 700 et 9 400 €/mois) ; bascule des collectivités reprise. Depuis ce dossier, avec jsc :
//   LIST=(la liste de test_decisions_0511i.js, de modele.js à decisions_0511i.js, puis) decisions_0511j.js test_decisions_0511j.js
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//   ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js test_decisions_0511j.js
// (en zsh : passer la liste par un tableau ; ../retraites/modele.js, ../fiscalite-orientation/modele.js et modele.js sont trois fichiers différents)
var J = this.Decisions0511j, I = this.Decisions0511i, H = this.Decisions0511h;
var log = (typeof print === 'function') ? print : console.log;
var n = 0, SC = ['bas', 'central', 'haut'];
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- 1. La mesure adoptée
ok(J.HYP.bonus === 100 && J.HYP.bonusFin === 1.25 && J.HYP.ra === 4700 && J.HYP.rb === 9400, 'paramètres adoptés : bonus 100 €, éteint à 1,25 Smic ; reprise du socle de 4 700 à 9 400 €/mois');
var sa = I.solution('a');
ok(Math.abs(sa.c.ra - J.HYP.ra) < 5 && Math.abs(sa.c.rb - J.HYP.rb) < 10, 'bornes arrondies de la zone calée en v5.9 (' + sa.c.ra + ')');
var m43 = J.mesure(0.43, 'central'), m42 = J.mesure(0.42, 'central');
proche(m43.cout, 16.097, 0.005, 'coût brut du bonus : 16,1 Md€ (central)'); proche(J.mesure(0.43, 'bas').cout, 12.786, 0.005, 'favorable 12,8'); proche(J.mesure(0.43, 'haut').cout, 17.304, 0.005, 'défavorable 17,3');
proche(m43.cout, sa.cout.central, 1e-9, 'même coût que la solution (a) de la v5.9');
proche(m43.recette, 16.083, 0.005, 'recette de la reprise à 43 % : 16,08 (nette des réactions)'); proche(m43.residu, -0.014, 0.005, 'résidu à 43 % : −0,01 (arrondi des bornes)');
proche(m42.recette, 16.402, 0.005, 'recette à 42 % : 16,40'); proche(m42.residu, 0.305, 0.005, 'résidu à 42 % : +0,31');
proche(J.mesure(0.43, 'bas').residu, 8.516, 0.01, 'résidu favorable à 43 % : +8,5'); proche(J.mesure(0.43, 'haut').residu, -7.534, 0.01, 'résidu défavorable à 43 % : −7,5 (le financement est moins sûr que la dépense)');
proche(J.residu(0.425, 'central'), (m42.residu + m43.residu) / 2, 1e-9, 'résidu interpolé entre les points de la grille');
ok(J.mesure(0.40, 'central').residu > m42.residu, 'la reprise rapporte plus à taux plus bas (moins de réactions)');
// ---------- 2. Solde
proche(J.solde('central', 2060), 12.500, 0.001, 'solde v5.10 en croisière (2060, 42 %) : +12,50');
proche(J.solde('central', 2060) - I.solde('central', 2060), m42.residu, 1e-9, 'v5.10 = v5.9 + résidu de la mesure');
[2029, 2041, 2050].forEach(function (y) { SC.forEach(function (s) { proche(J.solde(s, y) - I.solde(s, y), J.mesure(0.42, s).residu, 1e-9, 'v5.10 − v5.9 = résidu en ' + y + ' (' + s + ')'); }); });
proche(J.solde('central', 2029, 0.43) - I.solde('central', 2029, 0.43), m43.residu, 1e-9, 'à 43 % : résidu à 43 %');
proche(J.solde('bas', 2060), 229.72, 0.01, 'croisière favorable +229,7'); proche(J.solde('haut', 2060), -198.39, 0.01, 'croisière défavorable −198,4');
var cr = J.croisiere(); proche(cr.taux, 0.4084, 0.0002, 'taux de croisière 40,84 % (v5.9 : 40,87 %)');
var cx = J.creux(); ok(cx.an === 2041, 'creux en 2041'); proche(cx.taux, 0.4335, 0.0002, 'taux maximal du creux 43,35 % (v5.9 : 43,38 %)');
// ---------- 3. Plan de taux
var P = J.planTransition();
ok(P.b === 2044 && P.ans === 16, 'plan de taux : 43 % de 2029 à 2044 tient encore (période minimale inchangée, 16 ans)');
ok(P.parcours.picAn === null, 'aucune dette supplémentaire hors intérêts avec le plan');
ok(J.parcours(J.planTaux(2043)).picAn !== null, 'une année de moins ne suffit pas (pic du cumul ' + J.parcours(J.planTaux(2043)).picDuCumul + ')');
proche(P.parcours.cumulFinal, 260.65, 0.05, 'marge cumulée en 2070 : +260,6 Md€ (v5.9 : +252,9)');
ok(P.descente.an === 2045, 'première baisse sous 42 % possible dès 2045 (v5.9 : 2047)'); proche(P.descente.taux, 0.4193, 0.0002, 'à 41,93 % (symbolique)');
// ---------- 4. Dette
proche(P.dette.central.r10, 1.019, 0.0005, 'dette / PIB à 10 ans (2038) : 101,9 %'); proche(P.dette.central.r20, 0.754, 0.0005, 'à 20 ans (2048) : 75,4 %'); proche(P.dette.central.r30, 0.444, 0.0005, 'à 30 ans (2058) : 44,4 %');
ok(P.dette.central.r30 < P.detteV59.central.r30, 'dette à 30 ans un peu plus basse qu\'en v5.9 (44,6 %)');
proche(P.dette.central.r10 - P.detteV59.central.r10, 0, 0.0005, 'dette à 10 ans inchangée au central');
ok(P.dette.haut.r10 > P.detteV59.haut.r10 + 0.02, 'au défavorable, la dette à 10 ans monte de ≈ 2,5 points (168,2 % contre 165,7 %)');
ok(P.dette.bas.r10 < P.detteV59.bas.r10, 'au favorable, elle baisse (45,8 % contre 48,7 %)');
proche(P.dette42.central.r10, 1.051, 0.0005, '42 % constant : 105,1 % à 10 ans');
// ---------- 5. Cas types (écart au droit actuel, €/mois)
var c43 = J.casTypes(0.43), c42 = J.casTypes(0.42), v43 = J.casTypesV59(0.43);
proche(c43.couple_2smic_2enf, 16.8, 0.1, 'couple à deux Smic, 2 enfants : +16,8 à 43 % (v5.9 : −183,2)'); proche(c42.couple_2smic_2enf, 56.6, 0.1, '+56,6 à 42 %');
proche(c43.couple_2smic_0enf, 77.8, 0.1, 'couple sans enfant : +77,8'); proche(c43.parent_isole_smic, 82.7, 0.1, 'parent isolé au Smic : +82,7'); proche(c43.smic_seul, 95.5, 0.1, 'célibataire au Smic : +95,5');
ok(c43.couple_median_2enf === v43.couple_median_2enf, 'couple médian (2 × 2 735 € brut) non touché : +358,3');
proche(c43.cadre_5000, -53.9, 0.1, 'cadre à 5 000 € brut (coût 6 974 €, dans la zone) : −53,9 (v5.9 : +105,5)');
proche(c43.cadre_10000 - v43.cadre_10000, -350, 1e-6, 'cadre à 10 000 € : socle entièrement repris (−350 €)'); proche(c43.cadre_20000, -1178.0, 0.1, 'cadre à 20 000 € : −1 178');
['couple_2smic_2enf', 'couple_2smic_0enf', 'parent_isole_smic', 'smic_seul'].forEach(function (k) { ok(c43[k] > 0 && c42[k] > 0, 'cas modeste gagnant à 43 % et à 42 % : ' + k); });
// ---------- 6. Taux marginal près du Smic, incitation
var t43 = J.tmeSmic(0.43), t42 = J.tmeSmic(0.42);
proche(t43.local, 0.693, 0.001, 'TME de 1 à 1,1 Smic : 69,3 % à 43 % (extinction du bonus)'); proche(t42.local, 0.686, 0.001, '68,6 % à 42 %');
proche(t43.localActuel, 0.731, 0.001, 'droit actuel : 73,1 %'); ok(t43.local < t43.localActuel, 'sous le droit actuel');
ok(t43.local > J.tmeSmicV59(0.43).local, 'plus haut que sans bonus (58,6 %) : c\'est le prix de l\'extinction');
ok(t43.trappes.length === 0 && t42.trappes.length === 0, 'aucune trappe à inactivité');
proche(t43.reprise.couple[0].tme, 0.677, 0.001, 'second adulte du couple, 0 à mi-temps : TME 67,7 % (v5.9 : 80,3 % ; actuel 65,3 %)');
proche(t43.reprise.seul[0].gain, 499.9, 0.1, 'personne seule, 0 à mi-temps : +500 €/mois (actuel +326)');
// ---------- 7. Personnes touchées, plafond
var to = J.touches(); proche(to.dessus, 3.03, 0.01, 'socle entièrement repris : 3,0 M d\'adultes'); proche(to.zone, 6.39, 0.01, 'en partie : 6,4 M'); proche(to.part, 0.349, 0.001, 'soit 35 % des adultes des bandes actives');
proche(J.marginalMax(0.43).taux, 0.7403, 0.0002, 'taux marginal maximal 74,0 % à 43 % (sous le plafond de 75 %)'); proche(J.marginalMax(0.42).taux, 0.7303, 0.0002, '73,0 % à 42 %');
// ---------- 8. Bascule des collectivités (inchangée)
var b = J.bascule(0.43); proche(b.pointsTotal, 4.158, 0.005, 'clé : 4,16 points des 43 (9,67 % du prélèvement unique)'); ok(b.effetSoldeConsolide === 0, 'bascule neutre');
log('\n' + n + ' vérifications passées (decisions_0511j.js)');
