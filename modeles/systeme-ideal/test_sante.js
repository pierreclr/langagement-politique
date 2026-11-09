// Tests de la brique santé (calculs à la main). Depuis ce dossier :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc modele.js fiscalite_actuelle.js voies.js sante.js test_sante.js
var M = this.SystemeIdeal, V = this.Voies, S = this.Sante, F = V.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// Totaux par scénario : a + c + d + e (f optionnel, g nul)
proche(S.economies('bas').total, 4.5 + 5.3 + 2.6 + 0.22, 1e-9, 'cas favorable (bas) : 4,5 + 5,3 + 2,6 + 0,22 = 12,62 Md€');
proche(S.economies('central').total, 4.0 + 3.4 + 2.2 + 0.10, 1e-9, 'central : 4,0 + 3,4 + 2,2 + 0,10 = 9,7 Md€');
proche(S.economies('haut').total, 0.85 + 1.3 + 0.6 + 0, 1e-9, 'cas défavorable (haut) : 0,85 + 1,3 + 0,6 = 2,75 Md€');
proche(S.economies('central', { franchises: true }).total - S.economies('central').total, 0.3, 1e-9, 'franchises : levier optionnel, +0,3 Md€ au central quand il est activé');
ok(S.economies('central').parLevier.franchises === 0 && S.economies('central').parLevier.numerique === 0, 'franchises désactivées par défaut ; numérique non chiffré (0)');
proche(S.economies('central', { sansLevier: ['medicaments'] }).total, 9.7 - 3.4, 1e-9, 'exclure le levier médicaments retire 3,4 Md€');
var lancee = false; try { S.economies('inconnu'); } catch (e) { lancee = true; }
ok(lancee, 'scénario inconnu : erreur explicite');
ok(S.economies('bas').total > S.economies('central').total && S.economies('central').total > S.economies('haut').total, 'ordre favorable > central > défavorable');
// Cohérence avec les sources : sous la somme des 15 propositions de la Cour des comptes (19,4 à 21,4 Md€, avril 2025) et sous l'effort CNAM 2030 (22,5)
ok(S.economies('bas').total < 19.4 && S.economies('bas').total < 22.5, 'même le cas favorable reste sous la somme des propositions de la Cour (19,4) et l\'effort CNAM 2030 (22,5)');
proche(S.economies('central').total / S.DONNEES.ondamPressionCNAM2030.regulation, 9.7 / 44, 1e-9, 'central = 22 % de la hausse de dépense 2024-2030 (44 Md€, scénario CNAM avec régulation)');
// Double guichet (HCAAM, scénario 3)
var g = S.guichetUnique('scenario3');
proche(g.gainPayeurs, 5.4, 1e-9, 'HCAAM : 5,4 Md€ de charges de gestion évitées');
proche(g.tsaPerdue, S.DONNEES.hcaam2022.tauxTSA * S.DONNEES.hcaam2022.baissePrimes, 0.05, 'TSA perdue = 13,27 % × 26,9 Md€ de baisse de primes ≈ 3,6 Md€');
proche(g.besoinFinancement, 22.5 + 3.6, 1e-9, 'besoin de financement = 22,5 + 3,6 = 26,1 Md€');
ok(g.effetSoldeApresFinancement === 0, 'financé à l\'euro près : le solde public ne bouge pas, seul gagne le payeur');
proche(S.guichetUnique('scenario3', { captureEtat: 0.5 }).effetSoldeApresFinancement, 2.7, 1e-9, 'si l\'État garde la moitié du gain : +2,7 Md€');
proche(S.guichetUnique('scenario3', { echelle: 1.2 }).gainPayeurs, 6.48, 1e-9, 'mise à l\'échelle ×1,2 : 6,48 Md€');
proche(S.guichetUnique('bas').gainPayeurs, 3.2, 1e-9, 'HCAAM sans désaffiliation induite : 3,2 Md€');
var bh = S.guichetUnique('borneHaute'), o = S.DONNEES.oc2024;
proche(bh.gainPayeurs, (1.814 + 3.566 + 3.372) - (7.0 / 196.55) * 36.775, 1e-9, 'borne haute : 8,752 − 3,56 % × 36,775 = 7,44 Md€');
ok(bh.gainPayeurs > g.gainPayeurs && bh.gainPayeurs < o.fraisSinistres + o.fraisAcquisition + o.fraisAdmin, 'borne haute > HCAAM et < toute la gestion des OC (8,75)');
proche((o.fraisSinistres + o.fraisAcquisition + o.fraisAdmin) / o.cotisations, 0.1883, 5e-4, 'frais de gestion des OC 2024 = 18,8 % des cotisations (DREES)');
proche(S.DONNEES.gestion2025.secu + S.DONNEES.gestion2025.apuCentrales + S.DONNEES.gestion2025.oc, S.DONNEES.gestion2025.total, 0.01, 'gestion du système de santé 2025 : 7,23 + 1,21 + 9,18 = 17,62 Md€');
proche(S.DONNEES.csbmSecu2025 + S.DONNEES.csbmOC2025 + S.DONNEES.csbmMenages2025, S.DONNEES.csbm2025 - 1.66, 0.01, 'CSBM 2025 : Sécurité sociale + OC + ménages = 256,45 moins 1,66 Md€ des administrations centrales et locales');
// Avec la santé : voie A 650 (plat 47 %, t_max 25 %)
var A = F(V.voieA(650, 0.75), { tPlat: 0.47, tMax: 0.25 }), r = S.avecSante(A), b = V.bilan(A);
proche(r.soldeCentral, b.soldeCentral + 9.7, 1e-9, 'voie A : solde central avec santé = solde sans santé + 9,7');
proche(r.soldeBas, b.soldeBas + 12.62, 1e-9, 'voie A : solde bas + 12,62');
proche(r.soldeHaut, b.soldeHaut + 2.75, 1e-9, 'voie A : solde haut + 2,75');
ok(r.margeCentral === Math.max(0, r.soldeCentral) && r.margeSansSante === b.marge, 'marge = max(0, solde) ; marge sans santé conservée');
ok(r.soldeHaut < 0, 'voie A : au scénario haut, la santé ne suffit pas à équilibrer');
var eq0 = V.platEquilibre(A), eq1 = S.platEquilibreAvecSante(A);
ok(eq1 < eq0 && eq0 - eq1 < 0.02, 'la santé baisse le taux plat d\'équilibre de moins de 2 points');
proche(M.solde(F(A, { tPlat: eq1, scenario: 'central' })).soldePublic + 9.7, 0, 0.5, 'au taux plat d\'équilibre avec santé, solde central + santé = 0');
var par = S.mdParPointPlat(A);
ok(par > 10 && par < 20, 'un point de taux plat rapporte entre 10 et 20 Md€ (obtenu ' + par + ')');
log('\n' + n + ' contrôles au vert (santé)');
