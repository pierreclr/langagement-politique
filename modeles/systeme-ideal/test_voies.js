// Tests de l'extension « trois voies, IS conservé » (calculs à la main). Depuis ce dossier :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc modele.js fiscalite_actuelle.js voies.js test_voies.js
var M = this.SystemeIdeal, V = this.Voies, F = V.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// IS : base 68,0 / 25 % = 272 Md€ ; à 30 % statique 272 × 0,30 = 81,6 ; central : perte = 0,008 × 5 points = 4 % → 78,336
proche(M.recetteIS({ isConserve: true, tIS: 0.25, reactions: true, scenario: 'haut' }), 68, 1e-9, 'IS à 25 % = 68,0 Md€ quel que soit le scénario');
proche(M.recetteIS({ isConserve: true, tIS: 0.30, reactions: false }), 81.6, 1e-9, 'IS à 30 % statique = 81,6 Md€');
proche(M.recetteIS({ isConserve: true, tIS: 0.30, reactions: true, scenario: 'central' }), 272 * 0.30 * 0.96, 1e-9, 'IS à 30 % central = 78,3 Md€ (semi-élasticité 0,8 %/point × 5 points)');
ok(M.recetteIS({ isConserve: false }) === 0, 'IS non conservé : recette nulle (modèle v1 inchangé)');
// IS conservé, tout le reste égal : le Δ statique gagne exactement 68,0 Md€ (pas de double compte)
var s0 = M.solde({ reactions: false }), s1 = M.solde({ reactions: false, isConserve: true });
proche(s1.delta - s0.delta, 68.0, 1e-6, 'IS conservé : Δ statique +68,0 Md€ exactement');
// Socles
var Pl = M.param({ socle: 800, socleMode: 'lineaire', R1: 2500 }), Pe = M.param({ socle: 800, socleMode: 'exp', R1: 2500 });
proche(M.socleFn(15000, 0, Pl), 400, 1e-9, 'D2 : S × (1 − 1 250/2 500) = 400 €');
proche(M.socleFn(30000, 0, Pl), 0, 1e-9, 'D2 : socle nul à R = R1');
proche(M.socleFn(30000, 0, Pe), 800 * Math.exp(-1), 1e-9, 'D3 : S × exp(−1) = 294,3 €');
proche(M.penteSocle(10000, 0, Pl), 0.32, 1e-9, 'D2 : pente de sortie S/R1 = 800/2 500 = 32 %');
ok(M.penteSocle(10000, 0, M.param({})) === 0, 'socle uniforme : aucune pente de sortie');
var P4 = M.param({ socle: 800, socleMode: 'lineaire', R1: 2500, patrimoine: true });
proche(M.socleFn(12000, 12000, P4), 480, 1e-9, 'D4 : patrimoine proxy 400 k€ < 500 k€ : socle dégressif seul (800 × 0,6 = 480 €)');
proche(M.socleFn(12000, 22500, P4), 240, 1e-9, 'D4 : patrimoine proxy 750 k€ : le socle dégressif (480 €) est réduit de moitié = 240 €');
// Coût : R1 immense = socle universel pour tous (530,2 Md€ à 800 €)
var cu = M.solde({ socle: 800, reactions: false }).postes.socleAdultes, cd = M.solde({ socle: 800, socleMode: 'lineaire', R1: 1e9, reactions: false }).postes.socleAdultes;
proche(cd, cu, 0.5, 'D2 avec R1 → ∞ redonne le coût du socle universel (530 Md€)');
ok(M.solde({ socle: 800, socleMode: 'lineaire', R1: 2500, reactions: false }).postes.socleAdultes < cu / 2, 'D2 coûte moins de la moitié du socle universel');
// Compléments
var c6 = M.complements({ socle: 600, complAspa: true, aahDifferentielle: true, complRsa: true });
proche(c6.aspa, 0.75e6 * (1043.59 - 600) * 12 / 1e9, 1e-9, 'plancher ASPA à 600 € : 0,75 M × 443,59 € × 12 = 3,99 Md€');
proche(c6.aahBrut, 1.40e6 * (13.84e9 / 1.40e6 / 12 - 600) * 12 / 1e9, 1e-9, 'complément AAH différentiel à 600 € = 3,76 Md€');
proche(c6.rsa, 1.84e6 * (877 - 600) * 12 / 1e9, 1e-9, 'maintien RSA + logement à 600 € = 6,1 Md€ (1,84 M de foyers, V11770 ; ancien 1,9 M : 6,3)');
proche(M.complements({ socle: 1000, complAspa: true }).aspa, 0.75e6 * 43.59 * 12 / 1e9, 1e-9, 'à 1 000 € il reste 0,39 Md€ de plancher ASPA (1 043,59 − 1 000)');
// Dirigeant avec holding : crédit d'IS et impôt différé (A 650)
var A = V.voieA(650, 0.75), dir = M.situation(M.CAS[5], F(A, { tPlat: 0.47, tMax: 0.25 }));
proche(dir.creditISAn, 75000, 1e-6, 'dirigeant : crédit d\'IS = 25 % × 300 k€ = 75 000 €');
ok(dir.impotDiffereAn > 0 && dir.apresMois > 0, 'dirigeant : une part de l\'impôt est différée, le revenu versé reste positif');
var dirSans = M.situation(M.CAS[5], F(A, { tPlat: 0.47, tMax: 0.25, holdings: false, isConserve: true }));
ok(dir.impotAn + dir.impotDiffereAn > dirSans.impotAn, 'dirigeant : la transparence ajoute de l\'impôt (hors crédit) par rapport à l\'IS seul');
// Trajectoire : année d'atteinte de 1 000 € à 0,7 %/an indexé sur la productivité = 1 + ln(1000/650)/ln(1,007) = 62,75
var tr = V.trajectoire(F(A, { tPlat: 0.47, tMax: 0.25 }), 0.007, 'productivite', 10);
proche(tr.anneeMille, 1 + Math.log(1000 / 650) / Math.log(1.007), 1e-9, 'année du socle de 1 000 € à 0,7 %/an (productivité) ≈ 62,8');
ok(tr.trajectoire[0].socle === 650 && tr.trajectoire[9].socle < 700, 'dix ans à 0,7 %/an : 650 € → < 700 €');
ok(V.trajectoire(F(A, { tPlat: 0.47, tMax: 0.25 }), 0.007, 'surplus', 10).anneeMille < tr.anneeMille, 'affecter le surplus de recettes au socle atteint 1 000 € bien avant l\'indexation seule');
// Équilibre du solde central et contraintes
var eq = V.platEquilibre(F(A, { tMax: 0.25 }));
proche(M.solde(F(A, { archi: 'c2', tPlat: eq, tMax: 0.25 })).soldePublic, 0, 0.5, 'plat d\'équilibre de la voie A : solde public central = 0 (≈ ' + Math.round(eq * 1000) / 10 + ' %)');
[600, 650, 700].forEach(function (S) {
  var p = F(V.voieA(S, 0.75), { tPlat: 0.50, tMax: 0.25 });
  ok(M.solde(p).soldePublic > 0, 'voie A ' + S + ' € à 50 % : solde public central positif');
  M.solde(p).parBande.forEach(function (b) { if (b.tauxMarginal >= 1) throw new Error('marginal ≥ 100 %'); });
});
ok(V.bilan(F(V.voieC(0.95, 0.45), { tPlat: 0.30, tMax: 0.45 })).soldeCentral < -100, 'voie C à plat 30 % + t_max 45 % (marginal 75 %) : ne boucle pas (écart > 100 Md€)');
ok(V.bilan(F(V.voieA(650, 0.75), { tPlat: 0.47, tMax: 0.25 })).soldeHaut < 0, 'au scénario haut (réactions fortes), aucune voie n\'équilibre');
// Marginal effectif : zone de sortie (D2, S = 800, R1 = 2 500, plat 30 %, continu 40 %) à 29 500 €/an
var pm = { archi: 'c2', tPlat: 0.30, tMax: 0.40, socle: 800, socleMode: 'lineaire', R1: 2500 };
proche(V.margEff(29500, pm), 0.30 + 0.40 * (1 - 24000 / 29500) + 0.32, 1e-3, 'D2 : marginal effectif à 29 500 € = plat + continu + pente = 69,5 %');
ok(V.margEff(31000, pm) < V.margEff(29500, pm) - 0.2, 'D2 : le marginal tombe de plus de 20 points juste après R1 (falaise du taux, pas de la prestation)');
ok(V.margZoneSortie(pm).m < 1, 'D2 : marginal effectif maximal < 100 %');
log('\n' + n + ' contrôles au vert (voies)');
