// Tests du diagnostic du couple à deux Smic (diagnostic_couple_smic.js). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js \
//       optimum_options_0411.js ../risques/stress.js decisions_0511.js decisions_0511b.js diagnostic_couple_smic.js test_diagnostic_couple_smic.js
// (en zsh : passer la liste par un tableau)
var X = this.DiagnosticCoupleSmic, Z = this.Optimum, B = this.Decisions0511b, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var A = X.archiV53(), CT = Z.casTypes(A), SP = X.specs();

// 1. La v5.3 est intacte et le module la reproduit
ok(A.tPlat === 0.42 && A.majParentIsole === 340 && A.socle === 350, 'v5.3 : 42 %, majoration 340 €, socle 350 €');
proche(CT.couple_2smic_2enf.ecartMois, -117.48, 0.01, 'v5.3 : couple à deux Smic (2 enfants) −117,5 €/mois');
['smic_seul', 'couple_2smic_2enf', 'couple_1smic_2enf', 'cadre_2x', 'cadre_4x', 'parent_isole_smic'].forEach(function (id) {
  proche(X.foyer(A, SP[id]).apres - CT[id].avantMois, CT[id].ecartMois, 1e-6, 'foyer() reproduit optimum.js casTypes : ' + id);
});
proche(X.pSys(A).socle, 350, 0, 'paramètres du système lus dans le modèle (socle)');

// 2. Données du droit actuel : cohérence interne (revenu disponible = net + prime + prestations + aides − IR)
['smic_seul', 'couple_2smic_2enf', 'couple_2smic_0enf', 'couple_smic_15_2enf'].forEach(function (id) {
  var o = X.OF[id];
  proche(o.net + o.ppa + o.af + o.al - o.ir, o.rd, 0.05, 'OpenFisca ' + id + ' : revenu disponible = net + prime d\'activité + prestations + aides − IR');
  proche(o.brut - o.cotisSal - o.csg - o.crds, o.net, 0.05, 'OpenFisca ' + id + ' : net = brut − cotisations salariales − CSG − CRDS');
});
proche(X.OF_ATLAS_COUPLE.rd, 3523.28, 0.01, 'couple de l\'atlas du modèle : 3 523,28 € (conjoint à 1 823,07 €)');
proche(X.OF.couple_2smic_2enf.rd, 3549.20, 0.01, 'couple à deux Smic à 1 867,02 € : 3 549,20 €');
proche(X.COUT_SMIC, 1987.76, 0.01, 'coût employeur du Smic dans le modèle : 1 987,76 €');

// 3. Décomposition : la somme des lignes est l'écart total, au centime
['smic_seul', 'couple_2smic_2enf', 'couple_2smic_0enf', 'couple_smic_15_2enf'].forEach(function (id) {
  var d = X.decomposition(id);
  proche(d.ecart, d.ecartVerifie, 0.01, 'décomposition ' + id + ' : somme des lignes = écart total (' + d.ecart.toFixed(1) + ' €/mois)');
});
var dc = X.decomposition('couple_2smic_2enf'), cv = X.conventions(A);
proche(dc.ecart, -143.4, 0.05, 'couple à deux Smic à convention égale : −143,4 €/mois');
proche(cv.modele, -117.48, 0.01, 'couple à deux Smic, convention du modèle (conjoint à 1 823,07 €) : −117,5');
proche(cv.modele - cv.egale, 25.92, 0.01, 'la convention de l\'atlas favorise le système de 25,9 €/mois');
ok(dc.lignes[0].ecart < -640 && dc.lignes[0].ecart > -660, 'poste 1 : prélèvement −650 €/mois (42 % contre 25,6 % du coût employeur)');
proche(dc.lignes[1].ecart, -368.3, 0.05, 'poste 2 : prime d\'activité −368 €/mois');
proche(dc.lignes[2].ecart, 174.95, 0.05, 'allocation par enfant de 200 € contre AF + ARS de 225 € : +175');
proche(dc.lignes[4].ecart, 700, 1e-9, 'socle : +700 €/mois');
proche(dc.lignes[5].ecart, 0, 1e-9, 'aucun complément de plancher pour le couple à deux Smic (le plancher du ménage est dépassé)');
proche(dc.tauxActuelSurCout, 0.2565, 0.001, 'droit actuel : prélèvement de 25,6 % du coût employeur au niveau du Smic (allègements compris)');
var d0 = X.decomposition('couple_2smic_0enf'), ds = X.decomposition('smic_seul'), d15 = X.decomposition('couple_smic_15_2enf');
proche(d0.ecart, -82.5, 0.1, 'couple sans enfant, deux Smic : −82,5 €/mois');
proche(ds.ecart, 35.4, 0.1, 'salarié seul au Smic : +35,4 €/mois (+34,2 avec la référence du modèle)');
proche(ds.lignes[5].ecart, 238.8, 0.1, 'le seul au Smic reçoit 238,8 € de complément dégressif (remplace la prime d\'activité)');
ok(d15.ecart > 200, 'couple Smic + 1,5 Smic (2 enfants) : gagnant de ' + d15.ecart.toFixed(0) + ' €/mois');
proche(cv.superBrutOF, -197.6, 0.1, 'si le coût employeur est le super-brut d\'OpenFisca : −197,6 € (le système est favorisé de 54 € par la convention du modèle)');
proche(X.decomposition('smic_seul', A, [X.OF.smic_seul.superBrut]).ecart, 15.1, 0.1, 'salarié seul au Smic avec le super-brut d\'OpenFisca : +15,1 €');

// 4. Progressivité : taux moyen effectif
var cb = X.courbeTauxMoyen(A), prev = -1e9, mono = true;
cb.forEach(function (r) { if (r.taux < prev) mono = false; prev = r.taux; });
ok(mono, 'taux moyen effectif (personne seule) strictement croissant du quart de Smic à 400 Smic');
proche(X.seuilNeutre(A), 833.33, 0.01, 'seuil neutre : 350 / 0,42 = 833 €/mois de coût employeur');
ok(cb[0].taux < -1 && cb[1].taux < 0 && cb[2].taux < 0 && cb[3].taux > 0.10, 'taux moyen négatif sous 0,75 Smic, positif au Smic (12 %)');
ok(cb[cb.length - 1].taux > 0.70 && cb[cb.length - 1].taux < 0.72, 'taux moyen au sommet : 71 % (42 % + impôt continu, plafond 72 %)');
ok(cb.filter(function (r) { return r.actuel !== undefined && r.x >= 0.5; }).every(function (r) { return r.taux < r.actuel; }), 'personne seule : taux moyen du système inférieur au droit actuel de 0,5 à 3 Smic (le seul gagne)');
ok(cb[0].taux > cb[0].actuel, 'personne seule à un quart de Smic : le système verse un peu moins que le droit actuel (aide au logement remplacée)');
var cp = [0, 0.5, 1, 1.5].map(function (x) { return X.tauxMoyenCouple(A, x); });
ok(cp[2].taux > cp[2].actuel && cp[1].taux > cp[1].actuel && cp[3].taux < cp[3].actuel, 'couple 2 enfants : le système prélève plus que le droit actuel à (Smic ; 0,5 et 1 Smic), moins à (Smic ; 1,5 Smic)');

// 5. Correctifs : paramètres minimaux et coûts
var ev = {};
['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K6b'].forEach(function (id) { ev[id] = X.evaluer(id, { K1: 180, K2: 180, K3: 72, K4: 422, K5: 0.39, K6: 75, K6b: 75 }[id]); });
proche(X.pointDeTaux(A), 10.40, 0.01, 'un point de taux plat vaut 10,40 Md€/an');
// validation de la copie de la quadrature : franchise à plafond = abattement d'optimum.js
var a180 = F(A, { abattementActivite: 180 });
proche(X.massesFranchise(function (R) { return Math.min(R, 12 * 180); }, A.tPlat, 0.6).reduce(function (s, x) { return s + x; }, 0) / 1e9, Z.coutProtection(a180, 'central').abattement, 1e-6, 'quadrature copiée = coût de l\'abattement d\'optimum.js (central)');
ok(X.minimal(function (v) { return X.ecartCoupleEgal(X.CORRECTIFS.K3.archi(v), { enfantDelta: v }); }, 0, 300, 1) === 72, 'K3 : +72 € par enfant (272 €) fait juste gagner le couple (convention égale)');
ok(X.minimal(function (v) { return X.ecartCoupleEgal(X.CORRECTIFS.K4.archi(v)); }, 350, 600, 1) === 422, 'K4 : socle de 422 €');
ok(X.minimal(function (v) { return X.ecartCoupleEgal(X.CORRECTIFS.K1.archi(v)); }, 0, 600, 10) === 180, 'K1 : franchise de 180 € de coût employeur par mois');
ok(X.minimal(function (v) { return X.ecartCoupleEgal(X.CORRECTIFS.K6b.archi(v)); }, 0, 400, 5) === 75, 'K6b : bonus de 75 € par mois');
ok(ev.K6b.cout.central > 11.5 && ev.K6b.cout.central < 12.6 && ev.K6b.cout.bas < ev.K6b.cout.central && ev.K6b.cout.haut > ev.K6b.cout.central, 'K6b : coût central 12,1 Md€ (9,6 à 13,0)');
ok(ev.K6b.cout.central < ev.K6.cout.central, 'extinction à 1,25 Smic moins chère qu\'à 1,6 Smic');
ok(ev.K1.cout.central > 30 && ev.K4.cout.central > 26 && ev.K3.cout.central > 11.9 && ev.K5.cout.central < 3.2, 'ordres de grandeur : K1 32 ; K4 28 ; K3 12 ; K5 3,1 Md€');
proche(ev.K3.cout.central, 72 * 12 * 13.855e6 / 1e9, 1e-9, 'K3 : coût = supplément × 12 × 13,855 M d\'enfants');
ok(ev.K6b.tauxEq.avec > 0.424 && ev.K6b.tauxEq.avec < 0.427, 'K6b : taux d\'équilibre 42,5 % avec les pistes prudentes (41,4 % avant)');
proche(ev.K6b.solde42.avec, B.solde(A, 'central', true) - ev.K6b.cout.central, 1e-9, 'solde à 42 % = solde v5.3 avec pistes (+7,12) − coût');
// effets sur les cas types
ok(ev.K6b.casEgal > 0 && ev.K6b.casEgal0 > 0 && ev.K6b.cas.parent_isole_smic > 0 && ev.K6b.cas.smic_seul > CT.smic_seul.ecartMois, 'K6b : couples (avec et sans enfant) et parent isolé gagnent, le smicard gagne davantage');
var perdantsBase = Object.keys(CT).filter(function (k) { return CT[k].ecartMois < -0.5; }), perdantsK6b = Object.keys(ev.K6b.cas).filter(function (k) { return ev.K6b.cas[k] < -0.5; });
ok(perdantsK6b.every(function (k) { return perdantsBase.indexOf(k) >= 0; }) && perdantsK6b.length === 2, 'K6b : aucun nouveau perdant ; restent rsa_seul (−13) et cadre à 6 Smic (voulu)');
ok(ev.K3.casEgal0 < -80, 'K3 : le couple sans enfant à deux Smic continue de perdre (−82 €)');
ok(ev.K5.cas.couple_1smic_2enf < -100, 'K5 : la prime d\'activité partielle CRÉE un perdant (couple monoactif −112 €, règle H591 : plus de complément de plancher) : écarté');
ok(ev.K1.cas.cadre_2x > CT.cadre_2x.ecartMois + 50 && ev.K1.cas.cadre_4x > CT.cadre_4x.ecartMois + 60, 'K1 : la franchise profite aussi aux cadres (+75 €/mois à chaque actif) : peu ciblée');
proche(ev.K6b.casSuperBrutOF, -197.6 + 2 * 75 * 1, 0.5, 'K6b avec le super-brut OpenFisca : couple à −47,6 €/mois (75 € ne suffisent pas)');
var e100 = X.evaluer('K6b', 100);
ok(e100.casSuperBrutOF > 0 && e100.casEgal > 50, 'K6b à 100 € : le couple gagne aussi avec le super-brut OpenFisca (+' + e100.casSuperBrutOF.toFixed(1) + ')');
// déciles : le correctif ne dégrade aucun dixième
['K6b', 'K3', 'K5'].forEach(function (id) {
  var d = X.deciles(id, { K6b: 75, K3: 72, K5: 0.39 }[id]);
  ok(d.length === 10 && d.every(function (x) { return x.apres >= x.avant - 1e-6; }), id + ' : aucun dixième ne perd (déciles)');
});
// 6. Incitation à l'emploi
var r0 = X.reprise(A), r6 = ev.K6b.reprise;
ok(X.trappes(r0).length === 0 && X.trappes(r6).length === 0 && ev.K3.trappes.length === 0, 'aucune trappe à inactivité (gain > 0 et TME < 90 %) ni dans la v5.3 ni avec K6b et K3');
ok(r0.couple[0].tme > r0.couple[0].tmeActuel + 0.1, 'v5.3 : le second adulte du couple qui reprend à mi-temps a un TME de 79 % contre 65 % aujourd\'hui');
ok(r6.couple[0].tme < r0.couple[0].tme && r6.seul[0].tme < r0.seul[0].tme && r6.couple[0].gain > r0.couple[0].gain, 'K6b réduit le TME à la reprise (couple 79 → 69 %, seul 56 → 51 %) et augmente le gain');
ok(r6.seul[1].gain === r0.seul[1].gain || Math.abs(r6.seul[1].gain - r0.seul[1].gain) < 1e-6, 'K6b ne change pas le gain de mi-temps à temps plein (plateau)');
// 7. Version financée par le taux
var j = X.jointe('K6b', 0, 300, 5);
ok(j && j.v === 90 && Math.abs(j.taux - 0.428) < 1e-9 && j.couple >= 0 && j.couple0 >= 0, 'financé par le taux : bonus de 90 € à 42,8 % (le couple gagne encore)');
log('Tous les tests passent : ' + n);
