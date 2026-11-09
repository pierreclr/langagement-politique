// Tests de la v5.3 (decisions_0511b.js ; § 22 de resultats-optimum.txt). Depuis ce dossier : la liste de test_decisions_0511.js jusqu'à decisions_0511.js, puis
//   decisions_0511b.js test_decisions_0511b.js
var Z = this.Optimum, D = this.Decisions0511, B = this.Decisions0511b, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var A = B.archiV53(), SC = B.SCS;

// 1. Architecture : majoration 340 €, taux 42 %, rien d'autre de modifié par rapport à la v5.2
ok(A.majParentIsole === 340 && A.tPlat === 0.42, 'v5.3 : majoration 340 €, taux plat 42 %');
var A2 = D.archiV52();
ok(A2.majParentIsole === 200 && A2.tPlat === 0.414, 'v5.2 inchangée (majoration 200, taux 41,4 %)');
['socle', 'tHeritage'].forEach(function (k) { if (A2[k] !== undefined) ok(A[k] === A2[k], 'paramètre ' + k + ' identique à la v5.2'); });

// 2. Taux d'équilibre, majoration 340 : 41,8 % sans pistes, 41,4 % avec les pistes prudentes
var T = B.tauxEquilibre(false), T2 = B.tauxEquilibre(true);
proche(T, 0.418, 0.0011, 'taux d\'équilibre v5.3 sans pistes : 41,8 %');
proche(T2, 0.414, 0.0011, 'taux d\'équilibre v5.3 avec les pistes prudentes : 41,4 %');
ok(Z.solde(F(A, { tPlat: T }), 'central') + 0 !== undefined && B.solde(B.archiV53(T), 'central', false) >= 0 && B.solde(B.archiV53(T - 0.001), 'central', false) < 0, 'taux d\'équilibre minimal au dixième de point');

// 3. Excédent à 42 % : au central +2,3 Md€ sans pistes, +7,1 avec
proche(B.excedent('central', false), 2.26, 0.02, 'excédent central à 42 % sans pistes : +2,3 Md€/an');
proche(B.excedent('central', true), 7.12, 0.02, 'excédent central à 42 % avec pistes prudentes : +7,1 Md€/an');
proche(B.excedent('bas', false), 123.6, 0.3, 'excédent bas : +123,6 Md€/an (scénario favorable du modèle)');
proche(B.excedent('haut', false), -153.1, 0.3, 'solde haut : −153,1 Md€/an (scénario défavorable : pas un excédent)');
proche(B.pistes('central') - 4.86, 0, 0.006, 'pistes prudentes au central : 4,86');
proche(B.pistes('bas'), 10.5, 0.006, 'pistes prudentes, favorable : 10,5 (ordre inversé)');
proche(B.pistes('haut'), 1.75, 0.006, 'pistes prudentes, défavorable : 1,75');
proche(B.solde(A, 'central', false) - D.solde(F(A2, { tPlat: 0.42 }), 'central'), -(Z.solde(F(A2, { tPlat: 0.42 }), 'central') - Z.solde(A, 'central')), 1e-9, 'écart à la v5.2 à 42 % = coût de la majoration entre 200 et 340 €');
proche(B.coutMajoration(340, 0.42), 5.32, 0.02, 'coût de la majoration de 340 € (par rapport à 200) : 5,3 Md€/an');

// 4. Dette à 10 ans (report d'encaissement des plafonds compté ; excédent affecté à la dette)
var d0 = B.dette('central', false), d1 = B.dette('central', true);
proche(d0.ratio10, 1.024, 0.005, 'dette à 10 ans, central, sans pistes : 102,4 % du PIB');
proche(d1.ratio10, 1.008, 0.005, 'dette à 10 ans, central, avec pistes : 100,8 %');
ok(d1.ratio10 < d0.ratio10, 'les pistes réduisent la dette');
ok(B.dette('bas', true).ratio10 < 0.6 && B.dette('haut', true).ratio10 > 1.5, 'bas : dette qui baisse nettement ; haut : dette qui explose (le système ne se rattrape pas seul au scénario défavorable)');
ok(d0.ratio.length === 10 && d0.ratio[9] === d0.ratio10, 'trajectoire de dix années');

// 5. Cas types à 42 % : les cinq demandés
var C = B.casTypes(), C51 = Z.casTypes(Z.archi(Z.ARCHITECTURE_V5));
ok(C.smic_seul.ecartMois > 0, 'Smic seul : gagnant (' + Math.round(C.smic_seul.ecartMois) + ' €/mois)');
ok(C.parent_isole_sans_emploi.ecartMois > 0, 'parent isolé sans emploi : gagnant (' + Math.round(C.parent_isole_sans_emploi.ecartMois) + ' €/mois)');
ok(C.retraite_aspa_loc.ecartMois >= 0, 'retraité modeste : ne perd rien');
// Constat honnête, pas un vœu : à 42 % et 340 €, le parent isolé au Smic PERD un peu ; le seuil de non-perte est 344 €
ok(C.parent_isole_smic.ecartMois < 0 && C.parent_isole_smic.ecartMois > -10, 'parent isolé au Smic : PERDANT de ' + Math.round(C.parent_isole_smic.ecartMois * 10) / 10 + ' €/mois à 42 % et 340 € (limite de la décision)');
ok(B.seuilMajoration(0.413) === 337 && B.seuilMajoration(0.42) === 344, 'seuil de non-perte du parent isolé au Smic : 337 € à 41,3 %, 344 € à 42 %');
ok(C.couple_2smic_2enf.ecartMois < 0 && C51.couple_2smic_2enf.ecartMois < 0, 'couple deux Smic : perdant déjà en v5.1 (' + Math.round(C51.couple_2smic_2enf.ecartMois) + ') et en v5.3 (' + Math.round(C.couple_2smic_2enf.ecartMois) + ') : non nouveau, mais aggravé par le taux');

log('\n' + n + ' contrôles passés.');
