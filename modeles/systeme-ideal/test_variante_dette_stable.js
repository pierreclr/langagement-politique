// Tests de la variante « dette stabilisée » (variante_dette_stable.js, arbitrage 40 du 05/11/2026) sur la v5.10. Depuis ce dossier, avec jsc :
//   LIST=(la liste de test_decisions_0511j.js, de modele.js à decisions_0511j.js, puis) variante_dette_stable.js test_variante_dette_stable.js
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//   ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js test_variante_dette_stable.js
// (en zsh : passer la liste par un tableau ; ../retraites/modele.js, ../fiscalite-orientation/modele.js et modele.js sont trois fichiers différents)
var V = this.VarianteDetteStable, J = this.Decisions0511j, ST = this.Stress;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- 1. Raccord avec la v5.10 (aucun module modifié)
var P = J.planTransition(), v = V.jalons(V.trajectoire('central', {}));
proche(v.r10, P.dette.central.r10, 1e-12, 'même dette que la v5.10 à 10 ans (101,9 %)'); proche(v.r30, P.dette.central.r30, 1e-12, 'et à 30 ans (44,4 %)');
['bas', 'haut'].forEach(function (s) { proche(V.jalons(V.trajectoire(s, {})).r20, P.dette[s].r20, 1e-12, 'même dette à 20 ans au scénario ' + s); });
proche(V.trajectoire('central', { taux: 0.42 }).ratio[9], P.dette42.central.r10, 1e-12, '42 % constant : 105,1 % à 10 ans');
var g0 = ST.ECO.gNominal, r0 = ST.ECO.imarche; V.trajectoire('central', { macro: 'prudente' });
ok(ST.ECO.gNominal === g0 && ST.ECO.imarche === r0, 'la macro provisoire est restaurée');
proche(V.trajectoire('central', {}).ratio[9], v.r10, 1e-12, 'résultat identique après un calcul sous une autre macro');
// ---------- 2. Cible : déficit stabilisant
var c = V.cibleStabilisation('reference');
proche(c.ratio0, 1.2351, 0.0005, 'dette / PIB de fin 2028 (départ du système) : 123,5 %');
proche(c.deficitPct, 0.0360, 0.0005, 'déficit stabilisant : 3,6 % du PIB (d × g / (1 + g))'); proche(c.deficitMd2025, 107.6, 0.5, 'soit ≈ 108 Md€ de 2025');
proche(c.primaireRequisPct, 0.0054, 0.0005, 'r > g : excédent primaire requis 0,5 % du PIB');
proche(V.cibleStabilisation('prudente').deficitPct, 0.0306, 0.0005, 'macro prudente : 3,1 %'); proche(V.cibleStabilisation('favorable').deficitPct, 0.0411, 0.0005, 'favorable : 4,1 %');
proche(V.deficitStabilisant(1, 0.03).total, 0.03 / 1.03, 1e-12, 'formule');
var tr = V.trajectoire('central', { taux: 0.42 }), k;
for (k = 1; k < 5; k++) proche(tr.ratio[k] - tr.ratio[k - 1] * (1 / 1.03), tr.deficit[k], 1e-9, 'récurrence : Δ dette = déficit − effet de la croissance, ' + tr.annees[k]);
// ---------- 3. Taux qui garde la dette stable (v5.10 sans levier)
var t10 = V.tauxStable('central', 10, 'horizon'), t20 = V.tauxStable('central', 20, 'horizon'), t30 = V.tauxStable('central', 30, 'horizon'), tc = V.tauxStable('central', 20, 'chaque');
proche(t10, 0.3693, 0.0003, 'dette stable à 10 ans : 36,9 %'); proche(t20, 0.3634, 0.0003, 'à 20 ans : 36,3 %'); proche(t30, 0.3575, 0.0003, 'à 30 ans : 35,7 %');
proche(tc, 0.3701, 0.0003, 'aucune année au-dessus du niveau de 2028 sur 20 ans (et 30) : 37,0 %'); proche(V.tauxStable('central', 30, 'chaque'), tc, 0.0002, 'la contrainte lie dans les années 2030');
proche(V.tauxPlanStable('central', 30), 0.3601, 0.0003, 'plan à deux paliers : 37,0 % jusqu\'en 2044, puis 36,0 %');
proche(V.tauxStable('central', 20, 'chaque', { valeur: 'aucune' }), 0.3867, 0.0003, 'sans création de valeur : 38,7 %');
proche(V.tauxStable('central', 20, 'chaque', { macro: 'prudente' }), 0.3975, 0.0003, 'macro prudente : 39,7 %'); proche(V.tauxStable('central', 20, 'chaque', { macro: 'favorable' }), 0.3464, 0.0003, 'favorable : 34,6 %');
ok(V.tauxStable('haut', 20, 'chaque') === null, 'scénario défavorable : aucun taux jusqu\'à 55 % ne stabilise la dette (la v5.10 y monte déjà à 168 % en 10 ans)');
proche(V.mdParPoint(0.37), 11.86, 0.02, '1 point de taux vers 37 % : 11,9 Md€ de solde'); proche(V.mdParPoint(0.42), 10.23, 0.02, 'vers 42 % : 10,2');
proche(V.baissePrelevement(0.37).baisseVs42, 57.83, 0.02, 'à 37 % : prélèvement unique −57,8 Md€ par rapport à 42 %'); proche(V.baissePrelevement(0.37).baisseVs43, 68.47, 0.02, '−68,5 par rapport à 43 %');
// ---------- 4. Risques : taux d'intérêt, règles européennes
var s = V.sensibiliteTaux(0.37);
proche(s.interets10ansMd2025, 38.6, 0.2, '+1 point d\'OAT : +38,6 Md€ d\'intérêts à 10 ans (Md€ de 2025)'); proche(s.pointsEquivalents10ans, 3.25, 0.02, 'soit ≈ 3,3 points de taux');
proche(s.tauxStableChoc, 0.3919, 0.0003, 'taux stable avec le choc : 39,2 % (au lieu de 37,0 %)'); proche(s.avec.r30, 1.4378, 0.0005, 'à 37 % avec le choc, la dette atteint 144 % à 30 ans');
var u0 = V.conformiteUE(V.trajectoire('central', {})); ok(u0.conforme, 'la v5.10 respecte les trois critères européens');
var u37 = V.conformiteUE(V.trajectoire('central', { taux: 0.37 }));
ok(!u37.conforme && !u37.deficit3 && !u37.sauvegardeDette && u37.anneesDeficitAuDessus3.length >= 13 && u37.anneesDeficitAuDessus3[0] === 2029, 'dette stable à 37 % : déficit > 3 % de 2029 à 2041, pas de baisse de 1 point par an : NON conforme');
proche(V.tauxUE('central'), 0.3950, 0.0003, 'taux constant minimal conforme aux règles européennes : 39,5 %');
// ---------- 5. Retraites
proche(V.retraite('R2m', 'central'), 2.992, 0.005, 'R2m (25 % au-dessus de 2 500 €) : +3,0 Md€'); proche(V.retraite('R2f', 'central'), 3.896, 0.005, 'R2f : +3,9');
proche(V.retraite('R4', 'central'), 2.850, 0.005, 'R4 (majoration capital) : +2,85'); proche(V.retraite('R3', 'central'), 0.92, 0.01, 'R3 (alignement CSG et abattement) : +0,9');
proche(V.retraite('R1m', 'central', 2031), 0.47, 0.01, 'R1m : pic 0,47 en 2031'); proche(V.retraite('R1f', 'central', 2034), 0.87, 0.01, 'R1f : pic 0,87 en 2034'); proche(V.retraite('R1f', 'central', 2060), 0.30, 0.01, 'puis 0,30 en 2060 (décès)');
ok(V.retraite('R1m', 'central', 2028) === 0, 'rien avant 2029');
['R1m', 'R1f', 'R2m', 'R2f', 'R3', 'R4'].forEach(function (id) {
  var r = V.respectSeuil(id); ok(r.perteMaxSousSeuilSansCapital === 0, id + ' : aucune perte pour une pension sous 2 500 € nets sans capital (82 % des retraités ; arbitrage 10)');
  var d = V.parDecile(id); ok(d.pension.slice(0, 7).every(function (x) { return x.perteMois === 0; }), id + ' : déciles de pension 1 à 7 non touchés');
});
var dr = V.parDecile('R2m'); proche(dr.pension[9].perteMois, 130.4, 0.1, 'R2m : −130 €/mois en moyenne au 10e décile de pension (3,2 % de la pension)'); proche(dr.patrimoine[9].perteMois, 93.7, 0.2, 'et −94 au 10e décile de patrimoine');
ok(dr.patrimoine[9].perteMois > 5 * dr.patrimoine[4].perteMois, 'la charge croît avec le patrimoine (copule)');
var tx = V.taxe1pcRetraites('central'); proche(tx.payeeParRetraites, 30.68, 0.05, 'taxe de 1 % déjà payée par les ménages retraités : ≈ 30,7 Md€'); proche(tx.netNouveau, 21.38, 0.05, 'nette de leur taxe foncière : ≈ 21,4');
proche(tx.partPatrimoine60plus, 0.478, 0.002, 'les ménages de 60 ans et plus : ≈ 48 % du patrimoine brut (pas une majorité nette)');
proche(V.cumulCapital(0.42, true).total, 1.0533, 1e-4, 'R4 : revenu du capital d\'un retraité aisé prélevé à 72 % + taxe de 1 % = plus de 100 % du rendement à 3 %');
// ---------- 6. Masse salariale
proche(V.perimetreM1(), 2950800, 1, 'périmètre du non-remplacement : 2,95 M d\'agents (hors défense, sécurité, justice, soins, éducation)');
proche(V.coutMoyen(), 61769, 1, 'coût moyen par agent : 61 769 €');
proche(V.masse('M1m', 'central', 2040), 7.05, 0.01, 'M1m : 7,0 Md€ en régime (central)'); proche(V.masse('M1f', 'central', 2040), 15.02, 0.01, 'M1f : 15,0');
proche(V.masse('M2m', 'central', 2040), 3.75, 0.01, 'M2m : 3,8'); proche(V.masse('M2f', 'central', 2040), 6.74, 0.01, 'M2f : 6,7'); proche(V.masse('M3', 'central', 2040), 0.83, 0.01, 'M3 : 0,8');
ok(V.masse('M1m', 'haut', 2040) < V.masse('M1m', 'central', 2040), 'réalisation plus faible au défavorable');
// ---------- 7. Combinaison recommandée
var cb = V.combinaison(V.RECOMMANDE);
ok(V.RECOMMANDE.join() === 'R1f,R2m,M1m,M2m', 'combinaison : R1f + R2m + M1m + M2m');
proche(cb.leviers2040, 14.47, 0.02, 'leviers : 14,5 Md€ en 2040'); proche(cb.taux, 0.3616, 0.0003, 'dette stable stricte : 36,2 %'); proche(cb.tauxUE, 0.3865, 0.0003, 'conforme aux règles européennes : 38,6 %');
var u39 = V.conformiteUE(V.trajectoire('central', { taux: 0.39, leviers: V.leviers(V.RECOMMANDE) })); ok(u39.conforme, 'recommandation à 39 % : conforme');
var j39 = V.jalons(V.trajectoire('central', { taux: 0.39, leviers: V.leviers(V.RECOMMANDE) }));
proche(j39.r10, 1.121, 0.001, 'dette à 39 % + leviers : 112,1 % à 10 ans'); proche(j39.r20, 0.940, 0.001, '94,0 % à 20 ans'); proche(j39.r30, 0.700, 0.001, '70,0 % à 30 ans');
var po = V.prelevementsObligatoires(0.39, V.RECOMMANDE); proche(po.apresPct, 0.5151, 0.0005, 'PO à 39 % : 51,5 % du PIB (v5.10 : 52,6 % ; avant : 42,7 %)'); proche(po.apresNetPct, 0.4813, 0.0005, 'lecture nette : 48,1 % (v5.10 : 49,2 %)');
var ct = V.casTypes(0.39);
['couple_2smic_2enf', 'couple_2smic_0enf', 'parent_isole_smic', 'smic_seul', 'couple_median_2enf'].forEach(function (k2) { ok(ct[k2].vsV510a42 > 0 && ct[k2].vsV510a43 > 0, 'ménage modeste ou médian gagnant par rapport à la v5.10 : ' + k2); });
proche(ct.smic_seul.vsV510a42, 44.7, 0.1, 'célibataire au Smic : +44,7 €/mois par rapport à la v5.10 à 42 %'); proche(ct.couple_2smic_2enf.vsV510a43, 159.0, 0.1, 'couple à deux Smic : +159 par rapport à 43 %');
var rt = V.retraitesTypes(V.RECOMMANDE); ok(rt[2].perteMois === 0 && rt[3].perteMois === 0, 'retraités à 1 750 € et 800 € : non touchés'); proche(rt[0].perteMois, 80.5, 0.1, 'retraité à 3 500 € : −80,5 €/mois');
var ag = V.agentType(1.1 * 1801.8, 0.39, 'M2m'); ok(ag.bilanVs42 > 0, 'agent de catégorie C à 1,1 Smic : la baisse du taux compense la modération du point');
log('\n' + n + ' vérifications passées (variante_dette_stable.js)');
