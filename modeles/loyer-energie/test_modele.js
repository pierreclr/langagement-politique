// Tests et calculs de resultats.md. Depuis modeles/loyer-energie/ :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc donnees.js modele.js test_modele.js
var M = LoyerEnergie, log = print, J = JSON.stringify;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r(x, d) { var f = Math.pow(10, d === undefined ? 0 : d); return Math.round(x * f) / f; }
var C = M.SCENARIOS.central;

// 1. Cohérence
ok(M.classeEP(70) === 'A' && M.classeEP(71) === 'B' && M.classeEP(250) === 'D' && M.classeEP(420) === 'F' && M.classeEP(421) === 'G', 'seuils du DPE en énergie primaire');
var p = M.partsParcLocatifPrive(), s = 0; M.CLASSES.forEach(function (c) { s += p[c]; });
ok(Math.abs(s - 1) < 1e-9 && Math.abs(p.F + p.G - 0.138) < 1e-9, 'parts du parc locatif privé : somme 1, F + G = 13,8 %');
['grenoble', 'angers', 'fr'].forEach(function (z) {
  ['bas', 'central', 'haut'].forEach(function (sc) {
    var t = M.tableauClasses(z, M.SCENARIOS[sc], 50);
    var i, prev = -1, protege = M.CLASSES.indexOf(M.SCENARIOS[sc].protegee);
    for (i = 0; i <= protege; i++) ok(!t.classes[M.CLASSES[i]].mord, z + ' ' + sc + ' : le plafond ne mord pas sur ' + M.CLASSES[i]);
    ok(t.classes.G.baisse >= t.classes.F.baisse && t.classes.F.baisse >= t.classes.E.baisse, z + ' ' + sc + ' : la baisse croît avec la classe');
  });
});
var tg = M.tableauClasses('grenoble', C, 50);
ok(Math.abs(tg.classes.G.plafond - (tg.plafondA - tg.classes.G.deduction)) < 1e-9, 'plafond(G) = plafond(A) - déduction(G)');
ok(Math.abs(tg.classes.G.coutTotalLocataire - tg.plafondA) < 1e-6, 'sous le plafond, loyer + énergie conventionnelle = plafond(A) : le locataire paie la même chose quelle que soit la classe');
var ag = {}; ['bas', 'central', 'haut'].forEach(function (sc) { ag[sc] = M.agregats(M.tableauClasses('grenoble', M.SCENARIOS[sc], 50)); });
ok(ag.bas.partMord < ag.central.partMord && ag.central.partMord < ag.haut.partMord, 'part des logements mordus croissante du bas au haut');
ok(ag.bas.baisseMoyenneTous < ag.central.baisseMoyenneTous && ag.central.baisseMoyenneTous < ag.haut.baisseMoyenneTous, 'baisse moyenne croissante du bas au haut');
ok(M.baseHybride(300, null) === 300 && M.baseHybride(300, 100) === 150 && M.baseHybride(300, 900) === 450 && M.baseHybride(300, 280) === 280, 'base hybride : bornes [50 %, 150 %] du 3CL');
ok(Math.abs(M.consoNormalisee(10000, 2000, 2400) - 12000) < 1e-9, 'normalisation par les degrés-jours');
var pl = M.casTypes('grenoble', C, 'actuel', { coefElec: 2.3 });
ok(pl.options.pac.classe === 'F' && pl.options.iti.classe === 'E', 'avec le coefficient 2,3, la PAC seule ne sort pas de F, l\'isolation sort en E');
var p19 = M.casTypes('grenoble', C, 'actuel', { coefElec: 1.9 });
ok(p19.options.pac.classe === 'E' && p19.choix === 'pac', 'avec 1,9, la PAC atteint E pour moins cher : le bailleur la choisit');
ok(M.casTypes('grenoble', C, 'euros+besoin', { surfaceFigee: true }).choix === 'iti', 'formule euros + besoin, surface figée : le bailleur isole');

// 2. Résultats
var out = [];
function P(s) { out.push(s); log(s); }
P('=== Tableau par classe (appartement 50 m², loyer de marché 1-2 pièces, scénario central) ===');
['grenoble', 'angers', 'fr'].forEach(function (z) {
  var t = M.tableauClasses(z, C, 50), a = M.agregats(t), b = M.meilleuresRenovations(t, C);
  P('\n--- ' + z + ' : k = ' + r(t.k, 3) + ', plafond A = ' + r(t.plafondA) + ' €/mois (' + r(t.plafondA_m2, 2) + ' €/m²), prix moyen ' + r(t.prixKwh, 3) + ' €/kWh ---');
  P('classe | part | EF kWh/m²/an | déduction €/mois | plafond | marché | baisse | meilleure rénovation (cible, coût net, gain/an, retour ans)');
  M.CLASSES.forEach(function (c) { var x = t.classes[c], q = b[c];
    P(c + ' | ' + r(x.part * 100, 1) + ' % | ' + r(x.efM2) + ' | ' + r(x.deduction) + ' | ' + r(x.plafond) + ' | ' + r(x.marche) + ' | ' + r(x.baisse) + ' | ' + (q ? q.cible + ', ' + r(q.coutNet) + ', ' + r(q.gainAnnuel) + ', ' + r(q.retour, 1) : '-')); });
  P('part mordue ' + r(a.partMord * 100, 1) + ' % ; baisse moyenne (tous) ' + r(a.baisseMoyenneTous, 1) + ' €/mois ; (concernés) ' + r(a.baisseMoyenneConcernes, 1) + ' €/mois');
});
P('\n=== Trois scénarios ===');
['grenoble', 'angers', 'fr'].forEach(function (z) { ['bas', 'central', 'haut'].forEach(function (sc) {
  var S = M.SCENARIOS[sc], t = M.tableauClasses(z, S, 50), a = M.agregats(t);
  P(z + ' ' + sc + ' : k ' + r(t.k, 3) + ', plafond A ' + r(t.plafondA_m2, 2) + ' €/m², mordus ' + r(a.partMord * 100, 1) + ' %, baisse moyenne ' + r(a.baisseMoyenneTous, 1) + ' €/mois (concernés ' + r(a.baisseMoyenneConcernes, 1) + ')'); }); });
P('\n=== Plafond A proposé par l\'auteur : 1 000 € pour 50 m² (20 €/m²) à Grenoble ===');
var kP = 20 / 15.67, tp = M.tableauClasses('grenoble', C, 50, kP), ap = M.agregats(tp);
P('k = ' + r(kP, 3) + ' ; mordus ' + r(ap.partMord * 100, 1) + ' % ; baisse sur G ' + r(tp.classes.G.baisse) + ' €/mois ; plafond(G) ' + r(tp.classes.G.plafond) + ' contre marché ' + r(tp.classes.G.marche));
P('Avec l\'hypothèse de l\'auteur (G = 400 kWh/m²/an à 0,25 €/kWh) : déduction ' + r(M.deduction(400, 50, 0.25)) + ' €/mois, plafond(G) ' + r(1000 - M.deduction(400, 50, 0.25)));
P('\n=== Balayage de k, Grenoble central (plafond A en €/m²) ===');
[1.0, 1.05, 1.10, 1.132, 1.2, 1.28, 1.4].forEach(function (k) { var t = M.tableauClasses('grenoble', C, 50, k), a = M.agregats(t);
  P('k ' + k + ' (' + r(t.plafondA_m2, 2) + ' €/m²) : mordus ' + r(a.partMord * 100, 1) + ' %, baisse moyenne ' + r(a.baisseMoyenneTous, 1) + ' €/mois'); });
P('\n=== Comparaison avec l\'interdiction, pour 100 000 logements locatifs privés ===');
['grenoble', 'fr'].forEach(function (z) { ['bas', 'central', 'haut'].forEach(function (sc) {
  var c = M.compareInterdiction(z, M.SCENARIOS[sc], 50, 100000);
  P(z + ' ' + sc + ' | formule : rénovés ' + r(c.schema.renoves) + ', coût net ' + r(c.schema.coutReno / 1e6, 1) + ' M€, restants avec loyer réduit ' + r(c.schema.restants) + ', perte de loyer ' + r(c.schema.perteLoyer / 1e6, 2) + ' M€/an, retirés ' + r(c.schema.retires)
    + ' | interdiction E-F-G : rénovés ' + r(c.interdiction.renoves) + ', coût ' + r(c.interdiction.coutReno / 1e6, 1) + ' M€, retirés ' + r(c.interdiction.retires)); }); });
P('\n=== Deux cas types : G de 50 m² à Grenoble, besoin utile 299 kWh/m²/an, gaz 340 + ECS 60 + élec 30 kWh EF/m²/an ===');
[['actuel', {}], ['actuel', { coefElec: 2.3 }], ['euros', {}], ['euros', { surfaceFigee: true }], ['euros+besoin', {}], ['euros+besoin', { surfaceFigee: true }]].forEach(function (f) {
  var q = M.casTypes('grenoble', C, f[0], f[1]);
  P(f[0] + ' ' + J(f[1]) + ' : choix = ' + q.choix + ' | ' + ['initial', 'iti', 'pac'].map(function (o) { var x = q.options[o];
    return o + ' classe ' + x.classe + ' (EP ' + r(x.ep) + ', EF ' + r(x.ef) + ', facture ' + r(x.facture) + ' €/mois) loyer ' + r(x.loyer) + (o === 'initial' ? '' : ', capex ' + r(x.capex) + ', gain ' + r(x.gainAnnuel) + ' €/an, retour ' + (isFinite(x.retour) ? r(x.retour, 1) : '∞') + ' ans'); }).join(' | '));
});
P('\nPoids de la part « besoin » (w) qui fait basculer le choix, surface figée / non figée :');
[0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9].forEach(function (w) { var sc = JSON.parse(J(C)); sc.poidsBesoin = w;
  P('w ' + w + ' : surface réelle -> ' + M.casTypes('grenoble', sc, 'euros+besoin', {}).choix + ' ; surface figée -> ' + M.casTypes('grenoble', sc, 'euros+besoin', { surfaceFigee: true }).choix); });
P('Perte de valeur vénale de 2 m² d\'isolation intérieure à 2 800 €/m² : ' + r(2 * M.CAS.valeurM2) + ' € (hors loyer)');
P('\n=== Économie réelle du locataire si G -> D (écart conventionnel ' + r(M.deduction(160.9, 50, 0.154) * 0 + (340.5 - 162) * 50 * 0.154 / 12) + ' €/mois), avec 1/6 réalisé (CAE) ===');
P('réel ≈ ' + r(M.gainReelLocataire(340.5, 162, 1 / 6) * 50 * 0.154 / 12) + ' €/mois ; à 0,4 réalisé : ' + r(M.gainReelLocataire(340.5, 162, 0.4) * 50 * 0.154 / 12) + ' €/mois');
P('\nParc locatif privé estimé : ' + r(M.PARC_LOCATIF.n / 1e6, 2) + ' M de logements ; part G ' + r(M.PARC_LOCATIF.g * 100, 1) + ' %');
function P2(x) { log(x); }
// 9. Option sanitaire (04/11) : désactivée par défaut ; valeurs par défaut des autres fonctions inchangées
ok(M.optionSanitaire('fr', 'central', 100000) === null && M.OPTIONS.sanitaire.actif === false, 'option sanitaire : désactivée par défaut, renvoie null');
['grenoble', 'angers', 'fr'].forEach(function (z) { ['bas', 'central', 'haut'].forEach(function (sc) {
  var o = M.optionSanitaire(z, sc, 100000, { actif: true }), sa = M.SANITAIRE[sc], pl = M.partsLocales(z);
  ok(Math.abs(o.total - 100000 * sa.part) < 1e-6, z + ' ' + sc + ' sanitaire : le total des logements concernés est celui du paramètre');
  M.CLASSES.forEach(function (c) { if (o.parClasse[c].partDeLaClasse > 1 + 1e-9) throw new Error('ECHEC : part > 100 % dans la classe ' + c); });
  ok(o.parClasse.G.partDeLaClasse >= o.parClasse.F.partDeLaClasse && o.parClasse.F.partDeLaClasse >= o.parClasse.A.partDeLaClasse, z + ' ' + sc + ' sanitaire : la part concernée croît avec la classe');
  ok(Math.abs(o.dansPlafondMordant + o.horsPlafond - o.total) < 1e-6, z + ' ' + sc + ' sanitaire : mordus + non mordus = total');
  ok(Math.abs(o.interdiction.repares + o.interdiction.retires - o.total) < 1e-6, z + ' ' + sc + ' sanitaire : réparés + retirés = total'); }); });
var o1 = M.optionSanitaire('fr', 'bas', 100000, { actif: true }), o2 = M.optionSanitaire('fr', 'central', 100000, { actif: true }), o3 = M.optionSanitaire('fr', 'haut', 100000, { actif: true });
ok(o1.total < o2.total && o2.total < o3.total && o1.interdiction.coutTravaux < o2.interdiction.coutTravaux && o2.interdiction.coutTravaux < o3.interdiction.coutTravaux, 'sanitaire : logements et coût croissent du bas au haut');
ok(o1.retourSante < o2.retourSante && o2.retourSante < o3.retourSante, 'sanitaire : retour sanitaire de plus en plus long quand le périmètre s\'élargit');
M.OPTIONS.sanitaire.actif = true; ok(M.optionSanitaire('fr', 'central', 1000) !== null, 'sanitaire : activable par OPTIONS.sanitaire.actif'); M.OPTIONS.sanitaire.actif = false;
var t2 = M.tableauClasses('grenoble', C, 50); ok(Math.abs(t2.k - M.calibrerK('grenoble', C, 50)) < 1e-12, 'sanitaire : le calibrage du plafond est inchangé par l\'option');
P2('\n=== Option sanitaire (04/11) : parc locatif privé français, ' + r(M.PARC_LOCATIF.n / 1e6, 2) + ' M de logements ===');
['bas', 'central', 'haut'].forEach(function (sc) {
  var o = M.optionSanitaire('fr', sc, M.PARC_LOCATIF.n, { actif: true });
  P2(sc + ' : ' + r(o.total) + ' logements (' + r(o.total / M.PARC_LOCATIF.n * 100, 2) + ' % du parc) dont ' + r(o.dansPlafondMordant) + ' déjà touchés par le plafond du scénario ; G : ' + r(o.parClasse.G.partDeLaClasse * 100, 1) + ' % des G, F : ' + r(o.parClasse.F.partDeLaClasse * 100, 1) + ' % des F, D : ' + r(o.parClasse.D.partDeLaClasse * 100, 1) + ' %'
    + ' | interdiction ciblée : travaux ' + r(o.interdiction.coutTravaux / 1e9, 2) + ' Md€, retirés ' + r(o.interdiction.retires) + ', loyers perdus pendant travaux ' + r(o.interdiction.loyerPerduPendantTravaux / 1e9, 2) + ' Md€'
    + ' | loyer zéro : ' + r(o.loyerZero.loyerPerduAn / 1e9, 2) + ' Md€/an | travaux d\'office : avance ' + r(o.travauxOffice.avance / 1e9, 2) + ' Md€, perte ' + r(o.travauxOffice.perteNette / 1e9, 2) + ' Md€'
    + ' | santé évitée ' + r(o.beneficeSanteAn / 1e9, 2) + ' Md€/an, retour ' + r(o.retourSante, 1) + ' ans'); });
if (typeof writeFile === 'function') { }
