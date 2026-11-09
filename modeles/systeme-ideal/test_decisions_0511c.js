// Tests de la v5.4 (decisions_0511c.js) : majoration 345 €. Depuis ce dossier : la liste de test_decisions_0511.js jusqu'à decisions_0511.js, puis decisions_0511b.js decisions_0511c.js test_decisions_0511c.js
var B = this.Decisions0511b, C = this.Decisions0511c, Z = this.Optimum;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
ok(C.archiV54().majParentIsole === 345 && C.archiV54().tPlat === 0.42, 'v5.4 : majoration 345 €, taux 42 %');
ok(B.archiV53().majParentIsole === 340, 'la v5.3 à 340 € reste intacte');
var cout = C.coutSupplementaire(0.42);
proche(cout, 5 / 140 * (Z.solde(B.archiV53(0.42, 200), 'central') - Z.solde(B.archiV53(0.42, 340), 'central')) , 0.01, 'coût de 5 € de plus = 5/140 du coût de 340 vs 200 € (proportionnel)');
proche(C.solde(C.archiV54(), 'central', false), B.solde(B.archiV53(), 'central', false) - cout, 1e-9, 'solde v5.4 = solde v5.3 − coût');
ok(C.solde(C.archiV54(), 'bas') > C.solde(C.archiV54(), 'central') && C.solde(C.archiV54(), 'central') > C.solde(C.archiV54(), 'haut'), 'ordre des scénarios bas > central > haut');
var te = C.tauxEquilibre(false); ok(te >= B.tauxEquilibre(false), 'taux d\'équilibre v5.4 ≥ taux v5.3');
ok(C.solde(C.archiV54(te), 'central') >= 0 && C.solde(C.archiV54(te - 0.001), 'central') < 0, 'taux d\'équilibre : plus petit dixième de point au solde ≥ 0');
ok(C.casTypes().parent_isole_smic.ecartMois >= B.casTypes().parent_isole_smic.ecartMois, 'le parent isolé au Smic gagne ou égale à 345 € (seuil 344 €)');
log('Tests v5.4 : ' + n + ' contrôles passés.');
