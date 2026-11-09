// Tests de la couche « contribution des retraités aisés » et des trois scénarios (retraites_aisees_0611.js ; 06/11/2026, NON ADOPTÉE). Depuis ce dossier, avec jsc (zsh) :
//   LIST=(… liste de test_transmissions_0611.js sans le test … transmissions_0611.js retraites_aisees_0611.js test_retraites_aisees_0611.js)
//   (modele.js … base_0611.js cas_types_nets_0611.js variante_nationalite_0611.js transmissions_0611.js retraites_aisees_0611.js test_retraites_aisees_0611.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
//   (tableaux : remplacer le test par rapport_retraites_aisees_0611.js > resultats_retraites_aisees_0611.txt)
var R = this.RetraitesAisees0611, T = this.Transmissions0611, B = this.BaseTravail0611, R2 = this.Retraites2;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// 1. Distribution
var w = R.points().reduce(function (a, p) { return a + p.w; }, 0); proche(w, 1, 1e-9, 'poids de la distribution = 1');
proche(R.partSous(2500), 0.82, 0.01, '≈ 82 % des retraités sous 2 500 € nets (HDS6, arbitrage 10)');
proche(R.pensionMoyenne(), R2.pensionMoyenne(), 1e-9, 'pension moyenne = retraites2.js');
// 2. Contribution individuelle et garde-fou
var o = { seuil: 2500, taux: 0.2, capital: true };
ok(R.contributionIndiv(2500, 50000, o).total === 0 && R.contributionIndiv(1800, 1e6, o).total === 0, 'garde-fou : rien au seuil ni en dessous, même avec du capital');
proche(R.contributionIndiv(3000, 0, o).total, 100, 1e-9, '20 % de 500 € au-dessus du seuil = 100 €/mois');
proche(R.contributionIndiv(3000, 15000, o).capital, 250, 1e-9, 'avec capital : 20 % de 1 250 €/mois de revenus du capital');
R.HYP.seuils.forEach(function (s) { R.HYP.taux.forEach(function (t) { var c = R.casRetraite(s - 1, { seuil: s, taux: t }), b = R.casRetraite(s - 1, null);
  ok(c.ecartNet === b.ecartNet && c.ecartNet > 0, 'garde-fou ' + s + ' € / ' + t + ' : un retraité juste sous le seuil gagne autant que sans contribution'); }); });
// 3. Recettes
var r = R.trois(o); ok(r[0].net >= r[1].net && r[1].net >= r[2].net, 'favorable ≥ central ≥ défavorable');
ok(r[1].net < r[1].statique, 'comportements : net < statique');
ok(R.recette({ seuil: 2000, taux: 0.2 }).net > R.recette({ seuil: 2500, taux: 0.2 }).net, 'la recette baisse quand le seuil monte');
ok(R.recette({ seuil: 2500, taux: 0.3 }).net > R.recette({ seuil: 2500, taux: 0.2 }).net, 'la recette monte avec le taux');
ok(R.recette(o).net > R.recette({ seuil: 2500, taux: 0.2, capital: false }).net, 'l\'option capital ajoute de la recette');
proche(R.recette({ seuil: 2500, taux: 0.2 }).pensionNette, R.recette({ seuil: 2500, taux: 0.2 }).pensionBrute * 0.92, 1e-9, 'fuite de 8 % sur la part pension (central, H98)');
proche(R.recette({ seuil: 2500, taux: 0.2 }).concernes / 16.5e6, 1 - R.partSous(2500), 1e-9, 'concernés = retraités au-dessus du seuil');
// ancienne N03 (20 % au-dessus de 2 500 €, base totale) : 11-12 Md€ ; la variante avec capital en est proche
proche(R.recette(o).net, 11.5, 1.5, 'ordre de grandeur de l\'ancienne contribution N03 (11-12 Md€)');
// 4. Cas types
proche(R.casRetraite(4000, null).ecartNet, 132 - 43, 1.5, 'retraité à 4 000 € sans contribution : +89 (cas-types-nets-sante.md)');
var bsc = R.pensionBascule({ seuil: 2500, taux: 0.2 }); proche(R.casRetraite(bsc, { seuil: 2500, taux: 0.2 }).ecartNet, 0, 0.01, 'pension de bascule : gain nul');
// 5. Jeux
var jr = R.jeu({ contrib: null, c: 0.5, eco: 0 }); proche(jr.a, 0.6857, 0.0002, 'JR rejoué : a = 0,6857'); proche(jr.cas.cadre_10000.ecartNet, -622, 1, 'JR rejoué : cadre à 10 000 € brut −622 €/mois');
var jj = R.jeu({ contrib: o, c: 0.5 }); proche(jj.manque.reference, 0, 0.05, 'jeu recommandé : dette stable en macro de référence');
proche(jj.effet, jj.manque0, 0.05, 'jeu recommandé : l\'effet comble le manque de la base');
ok(jj.cas.cadre_10000.ecartNet > jr.cas.cadre_10000.ecartNet, 'la contribution allège la perte des cadres');
['smic_seul', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf'].forEach(function (id) { ok(jj.cas[id].ecartNet >= 20, 'jeu recommandé : bas revenus ≥ +20 € (' + id + ')'); });
// 6. Scénarios
var a = R.trajActuel(); proche(a.ratio0, R.trajReforme(null).ratio0, 1e-9, 'droit actuel et réforme partent de la même dette fin 2028');
var s1 = R.scenarioS1(); ok(s1.marge > 0, 'S1 : la base de travail est déjà meilleure que le droit actuel (marge > 0)');
for (var i = 0; i < 30; i++) ok(s1.plusJuste.traj.ratio[i] <= a.ratio[i] + 1e-6, 'S1 au plus juste : dette sous le droit actuel en ' + (2029 + i));
var s3 = R.scenarioS3(); ok(s3.neutreBascule >= -1e-6, 'S3 : neutre à la bascule');
for (var k = 10; k < 30; k++) ok(s3.traj.ratio[k] <= s3.traj.ratio[9] + 1e-6, 'S3 : dette stable à partir de 2038 (' + (2029 + k) + ')');
ok(s3.picAn <= 2038, 'S3 : pic de la dette au plus tard en 2038');
log('Tests : ' + n + ' vérifications, tous passés.');
