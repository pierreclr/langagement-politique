// Tests de la grille d'options de financement du palier 1. Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js options_financement.js test_options_financement.js
var X = this.OptionsFinancement, M = this.SystemeIdeal, P1 = this.Palier1, PF = this.PatrimoineFinancier, DR = this.DecesRealisation, D = M.DONNEES, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var SCS = X.SCS, st0 = P1.stFor({ tPlat: 0.35 });

// 1. Le point de départ est le palier 1, sans rien changer
SCS.forEach(function (s) { proche(X.solde({}, s), P1.solde(st0, s), 1e-9, 'option vide = palier 1 (' + s + ')'); });
proche(X.solde({}, 'central'), -163.05, 0.1, 'palier 1 : −163,05 (V11770 : 1,84 M au RSA ; −163,3 avec l\'ancien 1,9 M) Md€ au central (resultats.md § 13.0)');
proche(X.solde({}, 'bas'), -119.5102, 0.1, 'palier 1 : −119,8 Md€ au bas'); // 04/11/2026 : ancienne valeur -119.8, recalée après les corrections de données V12400-V12404
proche(X.solde({}, 'haut'), -235.4382, 0.1, 'palier 1 : −235,7 Md€ au haut'); // 04/11/2026 : ancienne valeur -235.7, recalée après les corrections de données V12400-V12404

// 2. Héritage : même formule que modele.js
SCS.forEach(function (s) { proche(X.transmissionsMd(s, 'palier1'), M.recettesTransmissions(M.param({ scenario: s })), 1e-9, 'transmissions du palier 1 = modele.js (' + s + ')'); });
proche(X.transmissionsMd('central', 'palier1'), 103.5, 0.01, '103,5 Md€ de droits au central');
proche(X.transmissionsMd('central', 'actuels'), 20.8, 1e-9, 'droits actuels : 20,8 Md€');
proche(X.transmissionsMd('central', 'palier1') - X.transmissionsMd('central', 'actuels'), 82.7, 0.01, '82,7 Md€ de plus qu\'aujourd\'hui');
proche(X.solde({ heritage: 'actuels' }, 'central'), P1.solde(st0, 'central', { transmissionsActuelles: true }), 1e-9, 'droits actuels = option transmissionsActuelles de palier1.solde');
proche(X.solde({ heritage: 'actuels' }, 'central'), -245.751, 0.1, 'droits actuels : −246,0 au central (resultats.md § 13.8)'); // 04/11/2026 : ancienne valeur -246.0, recalée après les corrections de données V12400-V12404
proche(X.transmissionsMd('central', 'ecart35'), 300 * (1 - 0.35) * 0.5, 1e-9, 'écart de 35 % : 97,5 Md€ au central');
proche(X.transmissionsMd('central', 'ecart40'), 300 * (1 - 0.40) * 0.5, 1e-9, 'écart de 40 % : 90 Md€ au central');
proche(X.transmissionsMd('central', 'taux40ecart35'), 300 * (1 - 0.35 * 0.8) * 0.4, 1e-9, 'impôt de 40 % : fuite proportionnelle au taux (0,8)');
ok(X.solde({ heritage: 'ecart35' }, 'central') < X.solde({}, 'central'), 'un héritage moins ambitieux dégrade le solde');
ok(X.solde({ heritage: 'ecart40' }, 'central') < X.solde({ heritage: 'ecart35' }, 'central'), 'plus l\'écart est grand, plus le solde baisse');

// 3. Taux plat et socle : monotones, et pente de 12,7 Md€ par point au voisinage du palier 1
var s35 = X.solde({}, 'central'), s36 = X.solde({ tPlat: 0.36 }, 'central');
proche(s36 - s35, 12.6, 0.3, 'un point de taux plat vaut ≈ 12,6 Md€ (resultats.md § 13.1 : 12,7)');
ok(X.solde({ tPlat: 0.38 }, 'central') > s36 && X.solde({ tPlat: 0.40 }, 'central') > X.solde({ tPlat: 0.38 }, 'central'), 'le solde central monte avec le taux plat de 35 à 40 %');
proche(X.solde({ socleFacteur: 0.9 }, 'central') - s35, 50 * P1.penteSocle(st0), 1.5, 'socle −10 % = −50 € × coût marginal du socle (0,43 Md€ par €/mois)');
proche(X.solde({ socleFacteur: 0.8 }, 'central') - s35, 100 * P1.penteSocle(st0), 2, 'socle −20 % = −100 € × coût marginal du socle');
proche(X.socleAn(X.opt({ socleFacteur: 0.8 }), 1), 400, 1e-9, 'socle −20 % : 400 €');

// 4. Rampe du socle
var R10 = { rampe: { annees: 10, depart: 250 } }, R5 = { rampe: { annees: 5, depart: 250 } };
proche(X.socleAn(X.opt(R10), 1), 250, 1e-9, 'rampe : année 1 = départ');
proche(X.socleAn(X.opt(R10), 10), 500, 1e-9, 'rampe : année 10 = socle final');
proche(X.socleAn(X.opt(R5), 3), 375, 1e-9, 'rampe sur 5 ans : année 3 = 375 €');
proche(X.socleAn(X.opt(R5), 8), 500, 1e-9, 'rampe : constant après la montée');
SCS.forEach(function (s) { proche(X.solde(R10, s), P1.solde(st0, s), 1e-9, 'rampe : le régime de croisière est celui du palier 1 (' + s + ')'); });
ok(X.soldeMoyen(R10, 'central') > X.soldeMoyen(R5, 'central') && X.soldeMoyen(R5, 'central') > s35, 'la montée sur 10 ans améliore plus la moyenne que sur 5 ans, qui améliore plus que rien');
proche(X.soldeMoyen({}, 'central'), s35, 1e-9, 'sans rampe, la moyenne sur 10 ans est le solde de croisière');
ok(X.solde(R10, 'central', 1) > X.solde(R10, 'central', 5) && X.solde(R10, 'central', 5) > X.solde(R10, 'central', 10), 'le solde se dégrade au fil de la montée');
// la moyenne est bien la moyenne arithmétique des années
var somme = 0, i; for (i = 1; i <= 10; i++) somme += X.solde(R10, 'central', i);
proche(X.soldeMoyen(R10, 'central'), somme / 10, 1e-9, 'moyenne sur 10 ans = moyenne des 10 soldes annuels');

// 5. Scénarios croisés (palier 1 bas = favorable ; patrimoine bas = défavorable)
ok(X.SC_PATRIMOINE.bas === 'haut' && X.SC_PATRIMOINE.haut === 'bas' && X.SC_PATRIMOINE.central === 'central', 'scénarios patrimoine croisés');
proche(X.patrimoine({ tPlat: 0.35, heritage: 'palier1', report150: true, deces: 'aucun', pfu50: false }, 'bas').report150, PF.report150Flux('haut', { t: 0.35 }).recettesNouvelles, 1e-12, 'report 150-0 B ter : le « bas » du palier 1 reçoit le « haut » du module');
ok(X.patrimoine(F(X.BASE, { report150: true }), 'bas').report150 > X.patrimoine(F(X.BASE, { report150: true }), 'haut').report150, 'le scénario favorable du palier 1 reçoit les recettes patrimoniales les plus élevées');
proche(X.patrimoine(F(X.BASE, { report150: true }), 'central').report150, PF.report150Flux('central', { t: 0.35 }).recettesNouvelles, 1e-12, 'report 150-0 B ter au central au taux plat');

// 6. Patrimoine : pas de double compte avec l'héritage
proche(X.patrimoine(F(X.BASE, { deces: 'credit' }), 'central').deces, 0, 1e-12, 'décès avec crédit : nul quand les droits sont à 50 %');
proche(X.patrimoine(F(X.BASE, { deces: 'creditHaut', heritage: 'ecart35' }), 'central').deces, 0, 1e-12, 'décès avec crédit : nul avec un héritage à 50 % même moins déclaré');
proche(X.patrimoine(F(X.BASE, { deces: 'creditHaut', heritage: 'taux40ecart35' }), 'central').deces, 0, 1e-12, 'décès avec crédit : nul avec un héritage à 40 %');
ok(X.patrimoine(F(X.BASE, { deces: 'credit', heritage: 'actuels' }), 'central').deces > 0, 'décès avec crédit : positif contre les droits actuels');
ok(X.patrimoine(F(X.BASE, { deces: 'creditHaut', heritage: 'actuels' }), 'central').deces >= X.patrimoine(F(X.BASE, { deces: 'credit', heritage: 'actuels' }), 'central').deces, 'borne haute ≥ borne basse');
proche(X.patrimoine(F(X.BASE, { deces: 'carryover' }), 'central').deces, DR.carryover('central', { t: 0.35 }).annee(10), 1e-12, 'prix d\'acquisition reporté : valeur à 10 ans, au taux plat');
ok(X.patrimoine(F(X.BASE, { deces: 'cumul' }), 'central').deces < DR.realisationDeces('central', { t: 0.35, deductible: false }).brutes, 'cumul : net de la déductibilité, inférieur au brut');
var pf = X.patrimoine(F(X.BASE, { pfu50: true }), 'central').pfu50;
proche(pf, PF.bilan('central', { t: 0.5, deces: 'statuQuo' }).soldeNet - PF.bilan('central', { t: 0.35, deces: 'statuQuo' }).soldeNet, 1e-12, 'PFU à 50 % : surplus sur le taux plat (base réelle par défaut, hors fin de la purge, comptée à part)');
proche(X.patrimoine(F(X.BASE, { finPurgeAV: true }), 'central').avDeces, PF.assuranceVieDeces('central', { t: 0.35 }).recettesNouvelles, 1e-12, 'fin de la purge de l\'assurance-vie (Q5, 03/11) : option comptée au taux plat');
ok(X.patrimoine(F(X.BASE, { finPurgeAV: true }), 'central').total > 0 && X.patrimoine(X.BASE, 'central').avDeces === 0, 'fin de la purge : hors référence du palier 1 par défaut, positive quand activée');
proche(X.patrimoine(F(X.BASE, { pfu50: true, tPlat: 0.5 }), 'central').pfu50, 0, 1e-12, 'PFU à 50 % : rien si le taux plat est déjà à 50 %');
proche(X.patrimoine(X.BASE, 'central').total, 0, 1e-12, 'sans option patrimoniale : zéro');

// 7. Économies
proche(X.economies(X.opt({ economies: 'prudentes' }), 'central'), 0.7, 1e-9, 'économies prudentes : 0,7 Md€ (le chèque énergie est redondant avec le socle)');
proche(X.economies(X.opt({ economies: 'volontaires' }), 'central'), 5.3, 1e-9, 'économies volontaires : 5,3 Md€');
ok(X.economies(X.opt({ economies: 'volontaires' }), 'haut') < X.economies(X.opt({ economies: 'volontaires' }), 'central'), 'économies volontaires plus faibles au défavorable (2,2 Md€ d\'aide à l\'apprentissage, V6323)');
proche(X.economies(X.opt({ cir: 'supprime' }), 'central'), 8.0, 1e-9, 'CIR supprimé : 8,0 Md€');
proche(X.economies(X.opt({ cir: 'recentre' }), 'central'), 3.4, 1e-9, 'CIR recentré : 3,4 Md€');
proche(X.solde({ economies: 'volontaires', cir: 'supprime' }, 'central') - s35, 13.3, 1e-9, 'économies et CIR s\'ajoutent au solde sans autre effet');

// 8. Décomposition et additivité des options indépendantes
var o = { tPlat: 0.415, socleFacteur: 0.8, report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime', heritage: 'ecart35' };
var d = X.detail(o, 'central');
proche(d.base + d.transmissions + d.report150 + d.deces + d.pfu50 + d.economies, d.total, 1e-9, 'la décomposition somme au total');
proche(d.transmissions, X.transmissionsMd('central', 'ecart35') - X.transmissionsMd('central', 'palier1'), 1e-12, 'écart de l\'héritage dans la décomposition');
proche(d.base, P1.solde(F(P1.stFor({}), { tPlat: 0.415, socle: 400 }), 'central'), 1e-9, 'base de la décomposition = palier 1 au taux et au socle de l\'option');
proche(X.solde({ economies: 'volontaires', heritage: 'ecart35' }, 'central'), s35 + 5.3 - 6.0, 0.05, 'économies et héritage : écarts indépendants qui s\'additionnent');

// 9. Taux plat d'équilibre
var teq = X.platEquilibre({}, 0, 'central');
ok(teq > 0.45 && teq < 0.55, 'taux d\'équilibre du palier 1 seul au central : entre 45 et 55 % (obtenu ' + teq + ')');
proche(X.solde({ tPlat: teq }, 'central'), 0, 0.01, 'au taux d\'équilibre le solde est nul');
ok(X.platEquilibre({ socleFacteur: 0.8 }, 0, 'central') < teq, 'un socle plus bas abaisse le taux d\'équilibre');
ok(X.platEquilibre({ heritage: 'actuels' }, 0, 'central') === null, 'à droits actuels, aucun taux plat jusqu\'à 80 % n\'équilibre au central');
ok(X.platEquilibre({}, 0, 'haut') === null, 'au haut, aucun taux plat jusqu\'à 80 % n\'équilibre : le solde plafonne');
ok(X.platEquilibre({}, -169.1, 'central') < teq, 'garder le déficit actuel demande un taux plus bas que l\'équilibre');

// 10. Déciles, taux marginaux, érosion
var dc = X.deciles({}), dc2 = X.deciles({ tPlat: 0.415, socleFacteur: 0.8 });
ok(dc.parDecile.length === 14 && dc.parDecile[0].id === 'D1', '14 bandes : 9 déciles et 5 sous-bandes du dernier');
proche(dc.parDecile[0].ecartMois, 178.4, 0.5, 'palier 1 : D1 gagne +178 €/mois');
var i2, tousMoins = true; for (i2 = 0; i2 < 14; i2++) if (dc2.parDecile[i2].ecartMois >= dc.parDecile[i2].ecartMois) tousMoins = false;
ok(tousMoins, 'taux 41,5 % + socle 400 € : chaque décile gagne moins que dans le palier 1');
ok(dc2.marginalMax > dc.marginalMax, 'le taux marginal limite monte avec le taux plat');
proche(X.deciles(R10, 1).socle, 250, 1e-9, 'déciles de l\'année 1 de la rampe : socle de 250 €');
var e = X.erosion({ tPlat: 0.40 });
ok(e.part > 0 && e.part < 1 && e.dStatique > e.dAvecReactions, 'les réactions rongent une partie du gain du taux plat (' + Math.round(100 * e.part) + ' %)');
ok(X.erosion({}).part === null, 'érosion nulle de l\'option vide');
proche(X.erosion({ tPlat: 0.40 }, 'haut').dAvecReactions, 32.4, 0.5, 'taux 40 % au haut : +32,4 Md€ (A2 du rapport)');

log('\n' + n + ' contrôles au vert');// 11. Options immobilier et taxe de 1 % (03/11/2026) : absentes par défaut ; testées en détail dans test_taxe_patrimoine.js (modules facultatifs)
var d0 = X.detail({}, 'central');
proche(d0.immobilier, 0, 1e-12, 'par défaut : pas de réforme immobilière dans le solde');
proche(d0.taxePatrimoine, 0, 1e-12, 'par défaut : pas de taxe sur le patrimoine');
ok(X.BASE.immobilier === false && X.BASE.taxePatrimoine === null, 'BASE : immobilier false, taxePatrimoine null');


