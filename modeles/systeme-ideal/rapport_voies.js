// Génère les tableaux de la section « Trois voies, IS conservé » de resultats.md :
//   jsc modele.js fiscalite_actuelle.js voies.js rapport_voies.js
var M = this.SystemeIdeal, V = this.Voies, F = V.fus;
var log = (typeof print === 'function') ? print : console.log;
function r(x, d) { d = d === undefined ? 0 : d; var f = Math.pow(10, d); return (Math.round(x * f) / f).toString().replace('.', ','); }
function pc(x, d) { return r(100 * x, d === undefined ? 0 : d) + ' %'; }

var A600 = F(V.voieA(600, 0.75), { tPlat: 0.45, tMax: 0.25 }), A650 = F(V.voieA(650, 0.75), { tPlat: 0.47, tMax: 0.25 }), A700 = F(V.voieA(700, 0.75), { tPlat: 0.49, tMax: 0.25 });
var C75 = F(V.voieC(0.75, 0.25), { tPlat: 0.50, tMax: 0.25 }), CSP = F(V.voieC(0.95, 0.40), { tPlat: 0.50, tMax: 0.40 });
var VOIES = [['A, socle 600 €', A600], ['A, socle 650 €', A650], ['A, socle 700 €', A700], ['B, année 1 (= A 650 €)', A650],
  ['C, t_max 25 % (marginal ≤ 75 %)', C75], ['C, t_max 40 % (spécification de l\'auteur, marginal ≤ 90 %)', CSP]];

log('### V1. Les voies à leur taux plat d\'équilibre arrondi (IS 25 %, c2 : plat + impôt continu R0 = 24 000 €)');
log('| Voie | Plat / t_max | Marginal asymptotique | Δ statique | Δ bas | Δ central | Δ haut | Solde public central | Marge d\'investissement (central) | Solde bas / haut |'); log('|---|---|---|---|---|---|---|---|---|---|');
VOIES.forEach(function (v) {
  var b = V.bilan(v[1]);
  log('| ' + v[0] + ' | ' + pc(v[1].tPlat) + ' / ' + pc(v[1].tMax) + ' | ' + pc(M.margMax(M.param(v[1]))) + ' | ' + r(b.statique) + ' | ' + r(b.bas) + ' | ' + r(b.central) + ' | ' + r(b.haut) + ' | ' + r(b.soldeCentral) + ' | ' + r(b.marge) + ' | ' + r(b.soldeBas) + ' / ' + r(b.soldeHaut) + ' |');
});
log('\nTaux plat d\'équilibre exact (solde central = 0), t_max fixé :');
log('| Voie | t_max | Plat d\'équilibre | Marginal asymptotique | Solde public à t plat = 50 % (marge max.) |'); log('|---|---|---|---|---|');
[['A 600', V.voieA(600, 0.75), 0.25], ['A 650 (= B année 1)', V.voieA(650, 0.75), 0.25], ['A 700', V.voieA(700, 0.75), 0.25], ['C', V.voieC(0.75, 0.25), 0.25], ['C (t_max 45 % : sommet > 100 % avant équilibre)', V.voieC(0.95, 0.45), 0.45], ['C', V.voieC(0.95, 0.40), 0.40]].forEach(function (x) {
  var p = F(x[1], { tMax: x[2] }), e = V.platEquilibre(p);
  log('| ' + x[0] + ' | ' + pc(x[2]) + ' | ' + (e === null ? 'aucun ≤ 60 %' : pc(e, 1)) + ' | ' + (e === null ? '-' : pc(e + x[2], 0)) + ' | ' + r(M.solde(F(p, { tPlat: 0.5, scenario: 'central' })).soldePublic) + ' |');
});

log('\n### V2. Compléments ciblés (Md€/an, central ; voie A au taux d\'équilibre arrondi)');
log('| Socle | Plancher ASPA (0,75 M) | AAH différentielle : complément brut | AAH : dépense actuelle remplacée | Maintien RSA + aide au logement (1,84 M, V11770) | Total net |'); log('|---|---|---|---|---|---|');
[A600, A650, A700].forEach(function (p) { var c = M.solde(p).postes.complements;
  log('| ' + p.socle + ' € | ' + r(c.aspa, 1) + ' | ' + r(c.aahBrut, 1) + ' | −' + r(c.aahEconomie, 1) + ' | ' + r(c.rsa, 1) + ' | ' + r(c.total, 1) + ' |'); });

log('\n### V3. Taux marginaux effectifs par bande (central, impôt + sortie du socle ; travail + capital de la bande)');
log('| Bande | A 650 | C t_max 25 % | C t_max 40 % |'); log('|---|---|---|---|');
var pa = M.solde(A650).parBande, pcc = M.solde(C75).parBande, pcs = M.solde(CSP).parBande;
pa.forEach(function (b, i) { log('| ' + b.id + ' | ' + pc(b.tauxMarginal) + ' (moyen ' + pc(b.tauxMoyen) + ') | ' + pc(pcc[i].tauxMarginal) + ' | ' + pc(pcs[i].tauxMarginal) + ' |'); });
log('Taux combiné IS 25 % + impôt personnel sur un dividende au sommet : A = ' + pc(1 - 0.75 * (1 - M.margMax(M.param(A650)))) + ', C 25 % = ' + pc(1 - 0.75 * (1 - M.margMax(M.param(C75)))) + ', C 40 % = ' + pc(1 - 0.75 * (1 - M.margMax(M.param(CSP)))) + ' (jamais ≥ 100 %).');

log('\n### V4. Cas types (€/mois, loi actuelle → voie)');
var ct = { A: V.casTypes(A650), C: V.casTypes(C75), S: V.casTypes(CSP) };
log('| Cas | Aujourd\'hui | A 650 | Écart | C 25 % | Écart | C 40 % | Écart | Taux marginal sur l\'heure (A / C 25 %) |'); log('|---|---|---|---|---|---|---|---|---|');
ct.A.forEach(function (x, i) {
  var c = ct.C[i], s = ct.S[i];
  log('| ' + x.libelle + ' | ' + r(x.avantMois) + ' | ' + r(x.apresMois) + ' | ' + (x.ecartMois >= 0 ? '+' : '') + r(x.ecartMois) + ' | ' + r(c.apresMois) + ' | ' + (c.ecartMois >= 0 ? '+' : '') + r(c.ecartMois) + ' | ' + r(s.apresMois) + ' | ' + (s.ecartMois >= 0 ? '+' : '') + r(s.ecartMois) + ' | ' + pc(x.tauxMarginalHeure) + ' / ' + pc(c.tauxMarginalHeure) + ' |');
});
log('Dirigeant avec holding (A 650) : impôt payé dans l\'année ' + r(ct.A[5].impotAn) + ' €, impôt différé ' + r(ct.A[5].impotDiffereAn) + ' €, crédit d\'IS ' + r(ct.A[5].creditISAn) + ' € ; revenu économique ' + r(ct.A[5].apresEcoMois) + ' €/mois contre ' + r(ct.A[5].avantEcoMois) + ' aujourd\'hui.');

log('\n### V5. Gagnants et perdants par bande (part des personnes qui gagnent ; écart moyen €/mois, central, travail + capital)');
log('| Bande | A 650 : part gagnants | écart | C 25 % : part gagnants | écart |'); log('|---|---|---|---|---|');
var ea = M.effetsParDecile(A650), ec = M.effetsParDecile(C75);
ea.forEach(function (x, i) { log('| ' + x.id + ' | ' + pc(x.partGagnants) + ' | ' + (x.ecartMois >= 0 ? '+' : '') + r(x.ecartMois) + ' | ' + pc(ec[i].partGagnants) + ' | ' + (ec[i].ecartMois >= 0 ? '+' : '') + r(ec[i].ecartMois) + ' |'); });

log('\n### V6. Voie C sous contrainte « marginal asymptotique ≤ 75 % » (plat 30 %, t_max 45 %) : écart restant et leviers (Δ central, Md€/an, un levier à la fois)');
var C0 = F(V.voieC(0.75, 0.45), { tPlat: 0.30, tMax: 0.45 }), b0 = V.bilan(C0);
log('Écart : solde public central = ' + r(b0.soldeCentral) + ' Md€ (Δ = ' + r(b0.central) + ' ; statique ' + r(b0.statique) + ').');
var LEV = [['plat + 5 points (35 %)', { tPlat: 0.35 }], ['plat + 10 points (40 %)', { tPlat: 0.40 }], ['t_max 45 → 60 %', { tMax: 0.60 }], ['sans prime d\'activité', { prime: 'aucune' }],
  ['socle 650 → 600 €', { socle: 600 }], ['socle 650 → 550 €', { socle: 550 }], ['IS à 30 %', { tIS: 0.30 }], ['CIR remplacé par 4 Md€', { cir: true }], ['sous-indexation de 2 points', { sousIndexation: 0.02 }],
  ['sans compléments ciblés (ASPA, AAH, RSA)', { complAspa: false, aahDifferentielle: false, complRsa: false }], ['socle dégressif D2 (800 → 650 €, R1 = 2 500 €)', { socleMode: 'lineaire', R1: 2500, socle: 650 }],
  ['D2 avec S = 650 et R1 = 2 000 €', { socleMode: 'lineaire', R1: 2000, socle: 650 }]];
log('| Levier | Δ central | Gain sur l\'écart |'); log('|---|---|---|');
LEV.forEach(function (l) { var b = V.bilan(F(C0, l[1])); log('| ' + l[0] + ' | ' + r(b.central) + ' | ' + (b.central - b0.central >= 0 ? '+' : '') + r(b.central - b0.central) + ' |'); });

var COMBI = [['D2 (S = 650, R1 = 2 000 €) + sans prime d\'activité', { socleMode: 'lineaire', R1: 2000, socle: 650, prime: 'aucune' }],
  ['D2 (S = 650, R1 = 2 000 €), prime conservée', { socleMode: 'lineaire', R1: 2000, socle: 650 }],
  ['D2 (S = 800, R1 = 2 500 €), plat 35 %', { socleMode: 'lineaire', R1: 2500, socle: 800, tPlat: 0.35 }],
  ['plat 40 % + sans prime + socle 600 €', { tPlat: 0.40, prime: 'aucune', socle: 600 }]];
log('\nCombinaisons de leviers sur C (t_max 45 %) :'); log('| Combinaison | Δ central | Solde public central | Marginal asymptotique |'); log('|---|---|---|---|');
COMBI.forEach(function (l) { var p = F(C0, l[1]), b = V.bilan(p); log('| ' + l[0] + ' | ' + r(b.central) + ' | ' + r(b.soldeCentral) + ' | ' + pc(M.margMax(M.param(p))) + ' |'); });
log('\n### V7. IS conservé : recette, taux 25 % et 30 % (Md€/an, base 68,0 en 2024)');
log('| Taux | Statique | Bas | Central | Haut |'); log('|---|---|---|---|---|');
[0.25, 0.30].forEach(function (t) { var o = {}; ['bas', 'central', 'haut'].forEach(function (s) { o[s] = M.recetteIS({ isConserve: true, tIS: t, scenario: s, reactions: true }); });
  log('| ' + pc(t) + ' | ' + r(M.recetteIS({ isConserve: true, tIS: t, reactions: false }), 1) + ' | ' + r(o.bas, 1) + ' | ' + r(o.central, 1) + ' | ' + r(o.haut, 1) + ' |'); });
log('Δ central de la voie A 650 si l\'IS passe de 25 à 30 % : ' + r(V.bilan(F(A650, { tIS: 0.30 })).central - V.bilan(A650).central, 1) + ' Md€. Si le rendement de l\'IS est celui du budget de l\'État (57,4) au lieu de 68,0 : ≈ ' + r((57.4 - 68.0), 1) + ' Md€ sur toutes les voies.');
var h1 = V.bilan(F(A650, { holdings: true })).central - V.bilan(F(A650, { holdings: false })).central;
log('Transparence des holdings en complément de l\'IS (A 650, central) : ' + r(h1, 1) + ' Md€ (flux imputé central ' + r(M.imputationHoldings(M.param({})), 1) + ' Md€ avant crédit d\'IS de 25 % = ' + r(0.25 * M.imputationHoldings(M.param({})), 1) + ' Md€). Sans IS (modèle v1) : +25,4 Md€. Part directe (statique) : ' + r(V.bilan(F(A650, { holdings: true })).statique - V.bilan(F(A650, { holdings: false })).statique, 1) + ' Md€ ; le reste est la neutralisation du report en holding (couverture H21, ⚠️).');

log('\n### V8. Voie B : trajectoire sur 10 ans (A 650 €, plat 47 %, t_max 25 % ; central)');
var tp = [['bas (COR 0,4 %)', 0.004], ['central (COR 0,7 %)', 0.007], ['haut (COR 1,0 %)', 0.010], ['IA ⚠️ (2,0 %)', 0.020]];
log('| Productivité | Indexation | S année 1 | S année 5 | S année 10 | Solde public année 10 | Année d\'atteinte de 1 000 € |'); log('|---|---|---|---|---|---|---|');
tp.forEach(function (g) { ['productivite', 'recettes', 'surplus'].forEach(function (m) { var t = V.trajectoire(A650, g[1], m, 10);
  log('| ' + g[0] + ' | ' + (m === 'recettes' ? 'recettes (ε = ' + r(t.elasticite, 2) + ')' : m === 'surplus' ? 'surplus de recettes affecté au socle' : 'productivité') + ' | ' + r(t.trajectoire[0].socle) + ' | ' + r(t.trajectoire[4].socle) + ' | ' + r(t.trajectoire[9].socle) + ' | ' + r(t.trajectoire[9].solde) + ' | ' + (isFinite(t.anneeMille) ? r(t.anneeMille) : 'jamais') + ' |'); }); });
log('Socle maximal finançable au central avec les taux de A 650 (solde public ≥ 0) : ' + r(V.socleMaxFinancable(A650)) + ' €/mois ; avec plat 50 % : ' + r(V.socleMaxFinancable(F(A650, { tPlat: 0.5 }))) + ' €/mois.');

log('\n### V9. Socles dégressifs D1 à D4 (IS 25 %, c2 plat 30 % + continu 40 %, retraités imposés, holdings en transparence ; central)');
log('| Variante | Socle S | R1 (€/mois) | Coût brut du socle (Md€) | Δ statique | Δ central | Solde public statique | Solde public central | Marginal effectif max. dans la zone de sortie (revenu mensuel où il se trouve) | Marginal au sommet |'); log('|---|---|---|---|---|---|---|---|---|---|');
[800, 1000].forEach(function (S) { [2000, 2500, 3000].forEach(function (R1) { V.variantesD(S, R1).forEach(function (v) {
  if (v.id === 'D1' && R1 !== 2000) return;
  var b = V.bilan(v.p), z = V.margZoneSortie(v.p);
  log('| ' + v.id + (v.id === 'D1' ? '' : '') + ' | ' + S + ' | ' + (v.id === 'D1' ? '-' : R1) + ' | ' + r(b.brut.postes.socleAdultes) + ' | ' + r(b.statique) + ' | ' + r(b.central) + ' | ' + r(b.soldeStatique) + ' | ' + r(b.soldeCentral) + ' | ' + (z ? pc(z.m) + ' (de ' + r(z.debutMensuel) + ' à ' + r(z.finMensuel) + ' €/mois)' : '-') + ' | ' + pc(M.margMax(M.param(v.p))) + ' |');
}); }); });
log('\nMême comparaison avec la moitié des adultes hors emploi et retraite supposés sans ressources de foyer (partInactifsSocle = 0,5), S = 800, R1 = 2 500 :');
V.variantesD(800, 2500).forEach(function (v) { var b = V.bilan(F(v.p, { partInactifsSocle: 0.5 })); log('- ' + v.id + ' : coût brut ' + r(b.brut.postes.socleAdultes) + ' Md€, solde central ' + r(b.soldeCentral) + ' Md€'); });

log('\n### V10. Taux marginal effectif total selon le revenu (D2, S = 800, R1 = 2 500 ; D1 pour comparaison), revenu mensuel de travail');
log('| Revenu mensuel (coût employeur) | D1 | D2 | D3 (R1 = 2 500) | D2 R1 = 2 000 | D2 R1 = 3 000 |'); log('|---|---|---|---|---|---|');
var DD = V.variantesD(800, 2500), D2a = V.variantesD(800, 2000)[1].p, D2c = V.variantesD(800, 3000)[1].p;
[1500, 2000, 2500, 3000, 4000, 6000, 10000, 20000, 100000].forEach(function (m) { var R = 12 * m;
  log('| ' + m + ' € | ' + pc(V.margEff(R, DD[0].p)) + ' | ' + pc(V.margEff(R, DD[1].p)) + ' | ' + pc(V.margEff(R, DD[2].p)) + ' | ' + pc(V.margEff(R, D2a)) + ' | ' + pc(V.margEff(R, D2c)) + ' |'); });
log('\nCas types sous D2 (S = 800, R1 = 2 500, plat 30 % + continu 40 %) :');
var cD = V.casTypes(DD[1].p);
cD.forEach(function (x) { log('- ' + x.libelle + ' : ' + r(x.apresMois) + ' €/mois (aujourd\'hui ' + r(x.avantMois) + '), taux marginal sur l\'heure ' + pc(x.tauxMarginalHeure) + ', socle perçu ' + r(x.socleMois) + ' €'); });
