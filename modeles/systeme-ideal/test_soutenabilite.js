// Tests de soutenabilite.js. Depuis ce dossier :
//   jsc modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js croissance.js trajectoires_age_depart.js soutenabilite.js test_soutenabilite.js
var M = this.SystemeIdeal, P1 = this.Palier1, DG = this.DemographieSI, C = this.Croissance, R2 = this.Retraites2, S = this.Soutenabilite, TD = this.TrajectoiresAgeDepart, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var sv = S.solveur(), st0 = P1.palier1().st;

// 1. Le palier 1 sans levier retrouve croissance.chemin (même formule, soldes additionnés)
var ref = sv.evaluer({}), ch = C.chemin(st0, 'central', { prod: 'central', pensions: 'prix', taux: 'central' }, 2065);
proche(ref.r2065, ch[40].detteSurPib, 1e-9, 'dette/PIB 2065 identique à croissance.chemin (329 %)');
[2026, 2035, 2045, 2065].forEach(function (a) {
  proche(sv.ligneAn(ref, a).soldeTotal, ch[a - 2025].soldeTotal, 1e-8, 'solde total ' + a + ' identique à croissance.chemin');
  proche(sv.ligneAn(ref, a).dette, ch[a - 2025].dette, 1e-6, 'dette ' + a + ' identique à croissance.chemin');
});
proche(ref.r2065, 3.292, 0.01, 'palier 1 tel quel : dette/PIB 2065 de 329 % après correction du double compte des intérêts de 2024 (343 % avant ; resultats.md § 17.ter)');
ok(!ref.stable, 'le palier 1 tel quel n\'est pas soutenable');
var prixSeul = S.solveur({ taux: 'bas' }).evaluer({});
proche(prixSeul.r2065, C.chemin(st0, 'central', { prod: 'central', pensions: 'prix', taux: 'bas' }, 2065)[40].detteSurPib, 1e-9, 'taux de marché bas : identique à croissance.chemin');
var hautSv = S.solveur({ sc: 'haut', taux: 'haut' }).evaluer({});
proche(hautSv.r2065, C.chemin(st0, 'haut', { prod: 'central', pensions: 'prix', taux: 'haut' }, 2065)[40].detteSurPib, 1e-9, 'démographie et réactions « haut », taux haut : identique à croissance.chemin');
proche(sv.evaluer({ pensions: 'cor' }).r2065, C.chemin(st0, 'central', { prod: 'central', pensions: 'cor', taux: 'central' }, 2065)[40].detteSurPib, 1e-9, 'pensions sur le COR : identique à croissance.chemin');
proche(sv.evaluer({ pensions: 'salaires' }).r2065, C.chemin(st0, 'central', { prod: 'central', pensions: 'salaires', taux: 'central' }, 2065)[40].detteSurPib, 1e-9, 'pensions sur les salaires : identique à croissance.chemin');
proche(sv.evaluer({ prod: 'haut' }).r2065, C.chemin(st0, 'central', { prod: 'haut', pensions: 'prix', taux: 'central' }, 2065)[40].detteSurPib, 1e-9, 'productivité 1 % : identique à croissance.chemin');

// 2. Linéarité du solde en indexation (fonde l'option « mixte ») : (salaires − prix) / (F_sal − 1) = (cor − prix) / (F_cor − 1)
var g45 = C.gEffectif('central', 2045), fs = DG.facteurPensions('salaires', g45, 2045), fc = DG.facteurPensions('cor', g45, 2045);
var AS = this.AgeSante, o = function (r) { return C.options(2045, { prod: 'central', pensions: r }); };
var sp = AS.solde(st0, 'central', 2045, o('prix')).avec, ss = AS.solde(st0, 'central', 2045, o('salaires')).avec, sc_ = AS.solde(st0, 'central', 2045, o('cor')).avec;
proche((ss - sp) / (fs - 1), (sc_ - sp) / (fc - 1), 1e-6, 'le solde est linéaire dans le facteur d\'indexation des pensions');
var pm = S.partMasseSous(2500), mix = sv.evaluer({ pensions: 'mixte' }), cor = sv.evaluer({ pensions: 'cor' });
proche(sv.ligneAn(mix, 2045).soldeHorsInterets, pm * sv.ligneAn(cor, 2045).soldeHorsInterets + (1 - pm) * sv.ligneAn(ref, 2045).soldeHorsInterets, 1e-9, 'indexation « mixte » = combinaison linéaire prix / COR');
ok(pm > 0.5 && pm < 0.7, 'part de la masse des pensions sous 2 500 € nets : entre 50 et 70 % (' + pm + ')');
ok(S.partMasseSous(1e6) > 0.999 && S.partMasseSous(100) < 0.01 && S.partMasseSous(3000) > S.partMasseSous(2500), 'part de la masse : croissante, de 0 à 1');
ok(S.facteurPensions('mixte', 'central', 2045) > 1 && S.facteurPensions('mixte', 'central', 2045) < S.facteurPensions('cor', 'central', 2045), 'facteur « mixte » entre les prix et le COR en 2045');

// 3. Trajectoires de l'âge de départ : a0 = trajectoire du module démographie ; +1 et +2 an : moins de retraités, plus d'emploi
['bas', 'central', 'haut'].forEach(function (sc) {
  [2025, 2040, 2065].forEach(function (a) {
    var v = DG.volumes(sc, a), t0 = TD.scenarios[sc].a0[a - 2025];
    proche(t0[1], v.retraites, 1, sc + ' ' + a + ' : retraités de a0 = trajectoire de demographie.js');
    proche(t0[2], v.emploi, 1, sc + ' ' + a + ' : emploi de a0 = trajectoire de demographie.js');
    proche(t0[3], v.actifs, 1, sc + ' ' + a + ' : actifs de a0 = trajectoire de demographie.js');
  });
  ok(TD.scenarios[sc].a1[2065 - 2025][1] < TD.scenarios[sc].a0[2065 - 2025][1] && TD.scenarios[sc].a2[2065 - 2025][1] < TD.scenarios[sc].a1[2065 - 2025][1], sc + ' : retraités 2065 décroissants avec l\'âge de départ');
  ok(TD.scenarios[sc].a1[2065 - 2025][2] > TD.scenarios[sc].a0[2065 - 2025][2] && TD.scenarios[sc].a2[2065 - 2025][2] > TD.scenarios[sc].a1[2065 - 2025][2], sc + ' : emploi 2065 croissant avec l\'âge de départ');
  proche(TD.scenarios[sc].a1[0][1], TD.scenarios[sc].a0[0][1], 0.5, sc + ' : 2025 inchangée (la rampe commence en 2027)');
});
var emp1 = TD.scenarios.central.a1[2040 - 2025][2] - TD.scenarios.central.a0[2040 - 2025][2], ret1 = TD.scenarios.central.a0[2040 - 2025][1] - TD.scenarios.central.a1[2040 - 2025][1];
ok(emp1 > 0.5 * ret1 && emp1 < ret1, 'un an de départ en plus : 50 à 100 % des retraités en moins deviennent des emplois (' + (emp1 / ret1) + ')');

// 4. Leviers seuls
var es = sv.effetsSeuls(), L = {};
es.lignes.forEach(function (l) { L[l.nom] = l; });
function lev(nom) { if (!L[nom]) throw new Error('levier absent : ' + nom); return L[nom]; }
ok(es.lignes.every(function (l) { return !l.stable; }), 'aucun levier seul ne stabilise la dette dans la grille');
['Socle 450 €', 'Socle 400 €', 'Socle 350 €', 'Socle 300 €'].reduce(function (prev, nom) { ok(lev(nom).r2065 < prev, nom + ' : dette/PIB 2065 plus basse que le palier précédent'); return lev(nom).r2065; }, ref.r2065);
['Taux plat 36 %', 'Taux plat 38 %', 'Taux plat 40 %', 'Taux plat 42 %', 'Taux plat 45 %'].reduce(function (prev, nom) { ok(lev(nom).r2065 < prev, nom + ' : dette/PIB 2065 plus basse que le palier précédent'); return lev(nom).r2065; }, ref.r2065);
ok(lev('Taux plat 38 % avec plafond combiné 75 % (t_max réduit)').ecart[2] < lev('Taux plat 38 %').ecart[2], 'réduire t_max pour tenir 75 % coûte une partie de la recette du taux plat');
ok(lev('Pensions sur les salaires').ecart[2] < lev('Pensions sur la pension relative du COR').ecart[2] && lev('Pensions sur la pension relative du COR').ecart[2] < lev('Pensions sur le COR sous 2 500 €, les prix au-dessus').ecart[2] && lev('Pensions sur le COR sous 2 500 €, les prix au-dessus').ecart[2] < 0, 'indexation : salaires < COR < mixte < prix (prix = référence)');
proche(lev('Pensions sur la pension relative du COR').ecartHorsInterets[2], -48, 2, 'pensions sur le COR : −48 Md€ en 2065 hors intérêts (resultats.md § 17.ter : −157 contre −205)');
proche(lev('Pensions sur les salaires').ecartHorsInterets[2], -128, 3, 'pensions sur les salaires : −128 Md€ en 2065 hors intérêts (§ 17.ter)');
ok(lev('Âge effectif de départ +2 ans (rampe 2027-2040)').ecart[2] > lev('Âge effectif de départ +1 an (rampe 2027-2040)').ecart[2] && lev('Âge effectif de départ +1 an (rampe 2027-2040)').ecart[2] > 0, 'âge de départ : +2 ans > +1 an > 0');
proche(lev('Âge effectif de départ +2 ans (rampe 2027-2040)').ecartHorsInterets[1] / lev('Âge effectif de départ +1 an (rampe 2027-2040)').ecartHorsInterets[1], 2, 0.4, 'âge de départ : l\'effet de +2 ans vaut à peu près le double de celui de +1 an');
[8, 18, 31].forEach(function (e) {
  var l = lev('Économies de dépenses ' + e + ' Md€ à 10 ans');
  l.ecartHorsInterets.forEach(function (x, i) { proche(x, e, 1e-9, 'économies ' + e + ' Md€ : exactement ' + e + ' Md€ hors intérêts en ' + [2035, 2045, 2065][i] + ' (montée de 10 ans, euros de 2025)'); });
});
var s26 = sv.evaluer({ economies: 18 }), r26 = sv.evaluer({});
proche(sv.ligneAn(s26, 2026).soldeHorsInterets - sv.ligneAn(r26, 2026).soldeHorsInterets, 1.8, 1e-9, 'économies 18 Md€ : 1,8 Md€ la première année (un dixième)');
var tr = sv.evaluer({ transmissions: 'actuels' }), d26 = sv.ligneAn(tr, 2026).soldeHorsInterets - sv.ligneAn(r26, 2026).soldeHorsInterets;
ok(d26 < -78 && d26 > -88, 'transmissions aux droits actuels : environ −83 Md€ la première année (Rés. § 13.8 : 103,5 − 20,8) : ' + d26);
var hp30 = sv.evaluer({ hp: '30-2500' }), dh = sv.ligneAn(hp30, 2026).soldeHorsInterets - sv.ligneAn(r26, 2026).soldeHorsInterets;
var attendu = (R2.contribution(F(P1.HP, S.HP['30-2500']), 'central').netMd - R2.contribution(P1.HP, 'central').netMd) * DG.volumes('central', 2026).retraites / DG.volumes('central', 2025).retraites;
proche(dh, attendu, 1e-6, 'hautes pensions 30 % > 2 500 € : écart de contribution du module retraites2 × indice des retraités');
ok(dh > 0 && sv.ligneAn(sv.evaluer({ hp: '30-2000' }), 2026).soldeHorsInterets > sv.ligneAn(hp30, 2026).soldeHorsInterets, 'baisser le seuil des hautes pensions rapporte plus');
var v10 = sv.evaluer({ valeur: 'dix' }), v10b = sv.ligneAn(v10, 2045).soldeHorsInterets - sv.ligneAn(r26, 2045).soldeHorsInterets, v10c = sv.ligneAn(v10, 2065).soldeHorsInterets - sv.ligneAn(r26, 2065).soldeHorsInterets;
proche(v10b, v10c, 1e-9, 'création de valeur : gelée après 10 ans (même montant en 2045 et en 2065)');
proche(v10b, P1.valeurPourScenario(10, 'central').sansE, 1e-9, 'création de valeur : A + B + D de palier1.valeur à 10 ans, sans C ni E');
ok(P1.valeurPourScenario(10, 'central').C === 0, 'levier C inactif (H180)');

// 5. t_max et plafond
proche(S.tMaxPour(0.35, 'combine'), 0.30, 1e-12, 'plat 35 % : t_max 30 % tient le plafond combiné de 75 %');
proche(S.tMaxPour(0.38, 'combine'), 0.2866, 1e-4, 'plat 38 % : t_max 28,66 %');
proche(S.tMaxPour(0.50, 'combine'), 0.1666, 1e-4, 'plat 50 % : t_max 16,66 %');
proche(S.tMaxPour(0.45, 'personnel'), 0.30, 1e-12, 'plafond personnel : 45 % + 30 % = 75 %');
proche(S.tMaxPour(0.50, 'personnel'), 0.25, 1e-4, 'plafond personnel : plat 50 %, t_max 25 %');
ok(S.tMaxPour(0.72, 'combine') === null, 'plat 72 % : aucun t_max compatible (impôt continu vidé de sens)');
[0.35, 0.38, 0.40, 0.45, 0.50].forEach(function (t) {
  var m = P1.marginalMax(F(P1.stFor({}), { tPlat: t, tMax: S.tMaxPour(t, 'combine') }));
  ok(m.combine <= 0.75 + 1e-6, 'plat ' + t + ' avec t_max réduit : taux combiné ' + m.combine + ' ≤ 75 %');
});
ok(P1.marginalMax(F(P1.stFor({}), { tPlat: 0.38 })).combine > 0.75, 'plat 38 % avec t_max 30 % dépasse 75 % (combiné 76 %)');

// 6. Contraintes
var base = { socle: 500, tPlat: 0.35 };
ok(sv.contraintes(base, 'pierre').ok, 'le palier 1 de base respecte les contraintes de l\'auteur');
ok(sv.contraintes({ age: 1 }, 'pierre').violations.indexOf('âge') >= 0, 'âge +1 : contraire aux contraintes de l\'auteur');
ok(sv.contraintes({ age: 1 }, 'pierreAge').ok, 'âge +1 : autorisé dans pierreAge');
ok(sv.contraintes({ hp: '25-2000' }, 'pierre').violations.indexOf('hautes pensions') >= 0, 'seuil à 2 000 € : retraités modestes touchés, refusé');
ok(sv.contraintes({ socle: 300, tPlat: 0.35 }, 'pierre').violations.indexOf('zone à 100 %') >= 0, 'socle 300 € : zone à 100 % de 888 € > 800 €');
proche(sv.contraintes({ socle: 300, tPlat: 0.35 }, 'pierre').zone100, (877 - 300) / 0.65, 1e-6, 'zone à 100 % = (plancher RSA − socle) / (1 − plat)');
proche(sv.contraintes(base, 'pierre').zone100, (877 - 500) / 0.65, 1e-6, 'zone à 100 % du palier 1 de base : 580 €');
ok(sv.contraintes({ transmissions: 'cinquante' }, 'pierreDroitsActuels').violations.indexOf('transmissions') >= 0, 'pierreDroitsActuels impose les droits actuels');
ok(sv.contraintes({ tPlat: 0.45 }, 'pierreSmic').violations.indexOf('smicard') >= 0, 'plat 45 % : le smicard perd plus de 10 €');
ok(sv.contraintes({}, 'pierreSmic').ok, 'palier 1 de base : le smicard gagne (85 €)');
ok(sv.contraintes({ pensions: 'prix' }, 'pierre').ok && S.JEUX.pierre.pensionsAutorisees.indexOf('prix') >= 0, 'pensions sur les prix : position de l\'auteur (minimum garanti indexé sur l\'inflation)');

// 7. Profils
var pb = sv.profils({}, 0.30), ca = P1.casActifs(st0);
proche(pb[0].ecart, ca.filter(function (x) { return x.id === 'smic35'; })[0].ecartMois, 1e-6, 'profil Smic = palier1.casActifs');
proche(pb[2].ecart, ca.filter(function (x) { return x.id === 'cadre60'; })[0].ecartMois, 1e-6, 'profil cadre 4 k = palier1.casActifs (cadre à 60 k€ brut)');
proche(pb[3].ecart, ca.filter(function (x) { return x.id === 'cadre8k'; })[0].ecartMois, 1e-6, 'profil cadre 8 k = palier1.casActifs');
proche(pb[0].ecart, 85, 1.5, 'Smic à 35 h : +85 € au palier 1 (v3)');
proche(pb[1].ecart, 636, 1.5, 'salarié médian : +636 € au palier 1 (v3)');
proche(pb[5].ecart, -200, 0.5, 'retraité à 3 500 € : −200 € au palier 1 (v3)');
proche(pb[4].ecart, 0, 1e-9, 'retraité à 1 200 € : 0 au palier 1');
pb.forEach(function (x) { proche(x.deltaRef, 0, 1e-9, 'palier 1 de base : écart à lui-même nul (' + x.id + ')'); });
var p45 = sv.profils({ tPlat: 0.45, hp: '30-2000' }, S.tMaxPour(0.45, 'combine'));
ok(p45[0].ecart < pb[0].ecart && p45[1].ecart < pb[1].ecart && p45[5].ecart < pb[5].ecart, 'plat 45 % et hautes pensions plus lourdes : le Smic, le médian et le retraité à 3 500 € perdent par rapport au palier 1');
proche(p45[5].ecart, -450, 1, 'retraité à 3 500 € avec 30 % au-dessus de 2 000 € : −450 € (1 500 × 30 %)');
proche(p45[4].ecart, 0, 1e-9, 'retraité à 1 200 € : jamais touché');
ok(sv.profils({ pensions: 'cor' }, 0.30)[4].indexation2045 > 0 && sv.profils({}, 0.30)[4].indexation2045 === 0, 'indexation du retraité à 1 200 € : COR > prix en 2045');
proche(sv.coutModestes({}, 0.30).total, 0, 1e-9, 'palier 1 de base : coût nul pour les ménages modestes');
ok(sv.coutModestes({ socle: 400 }, 0.30).total > 0 && sv.coutModestes({ socle: 300 }, 0.30).total > sv.coutModestes({ socle: 400 }, 0.30).total, 'coût des ménages modestes croissant quand le socle baisse');
proche(sv.coutModestes({ age: 2 }, 0.30).total, 2 * S.PARAM.penaliteAge * 2, 1e-9, 'âge +2 : 4 × pénalité (deux profils, deux ans)');
proche(sv.coutModestes({ economies: 31, hp: '30-2000', valeur: 'dix' }, 0.30).total, 0, 1e-9, 'économies, hautes pensions et valeur : aucun coût monétaire pour le Smic et le médian');

// 8. Énumération
var tot = 1; Object.keys(S.GRILLE).forEach(function (k) { tot *= S.GRILLE[k].length; });
var E = {}; ['smicSeul', 'combine', 'pierre', 'pierreSmic', 'pierreDroitsActuels', 'pierreAge'].forEach(function (j) { E[j] = sv.enumerer(j); });
Object.keys(E).forEach(function (j) {
  proche(E[j].total, tot, 0, j + ' : toute la grille est parcourue (' + tot + ')');
  ok(E[j].stables <= E[j].admissibles && E[j].admissibles <= E[j].total, j + ' : stables ≤ admissibles ≤ testées');
  ok(E[j].liste.every(function (s) { return s.r2065 <= ref.r2025 + 1e-9 && s.rMax <= ref.r2025 + S.PARAM.tolerance + 1e-9; }), j + ' : toutes les stables respectent le critère (≤ 115,7 % en 2065, ≤ 120,7 % avant)');
  ok(E[j].liste.every(function (s, i) { return i === 0 || E[j].liste[i - 1].cout <= s.cout + 1e-9; }), j + ' : liste triée par coût croissant pour les ménages modestes');
  ok(E[j].liste.every(function (s) { return sv.contraintes(s.c, j).ok; }), j + ' : toutes les stables respectent les contraintes du jeu');
  var cles = E[j].parmi3.map(function (s) { return [s.c.socle, s.c.tPlat, s.c.age].join('|'); });
  ok(cles.length <= 3 && cles.every(function (c, i) { return cles.indexOf(c) === i; }), j + ' : les trois moins coûteuses sont distinctes par (socle, plat, âge)');
});
// Relecture D3 : la grille fine (socle par 5 €, plat par point) trouve des combinaisons qui gardent le smicard à −10 € ou mieux, toutes avec l'âge de départ +2 ans, hors des contraintes de l'auteur
ok(E.smicSeul.stables > 0 && E.smicSeul.stables < 50, 'smicSeul : quelques combinaisons seulement stabilisent la dette en gardant le smicard à moins de 10 € de perte (' + E.smicSeul.stables + ')');
ok(E.smicSeul.liste.every(function (s) { return s.c.age === 2 && s.c.economies === 31 && s.c.hp.indexOf('2000') > 0; }), 'smicSeul : toutes demandent l\'âge +2, 31 Md€ d\'économies et la contribution des pensions dès 2 000 €');
ok(E.smicSeul.liste.every(function (s) { return sv.profils(s.c, s.tMax)[0].ecart >= -10 - 1e-6; }), 'smicSeul : le smicard perd au plus 10 €');
proche(E.pierreSmic.stables, 0, 0, 'idem avec les contraintes de l\'auteur');
proche(E.pierreDroitsActuels.stables, 0, 0, 'aucune combinaison ne stabilise la dette avec les transmissions aux droits actuels et les contraintes de l\'auteur');
ok(E.pierre.stables > 0 && E.pierre.stables < E.combine.stables && E.combine.stables < E.pierreAge.admissibles * 2, 'contraintes de l\'auteur : peu de combinaisons stables, bien moins que sous le seul plafond');
ok(E.pierre.liste.every(function (s) { return s.c.age === 0 && s.c.pensions !== undefined && s.c.transmissions === 'cinquante'; }), 'contraintes de l\'auteur : toutes les stables gardent l\'âge de départ et supposent 50 % sur les transmissions');
ok(E.pierre.liste.every(function (s) { return s.c.tPlat >= 0.40 - 1e-9; }), 'contraintes de l\'auteur : taux plat de 40 % ou plus (grille à 1 point ; « ≥ 45 % » était un effet de la grille à 50 €, relecture D1)');
ok(E.pierre.liste.some(function (s) { return s.c.tPlat < 0.45 - 1e-9; }), 'contraintes de l\'auteur : des combinaisons stables existent sous 45 %');
ok(E.pierre.liste[0].cout >= E.combine.liste[0].cout, 'chaque contrainte ajoutée ne peut que coûter : coût minimal sous l\'auteur ≥ sous le plafond seul');
ok(E.pierre.liste.every(function (s) { return s.stableStress === (S.solveur({ sc: 'central', taux: 'haut' }).evaluer(F(s.c, { prod: 'bas' }), s.tMax).stable); }), 'indicateur de stress cohérent avec un recalcul direct (productivité 0,4 %, taux 4,5 %)');
ok(E.pierre.robustes <= E.pierre.stables && E.pierre.parmi3Robustes.every(function (s) { return s.stableStress; }), 'robustes ⊂ stables');
// la robustesse coûte
if (E.pierre.parmi3Robustes.length) ok(E.pierre.parmi3Robustes[0].cout > E.pierre.parmi3[0].cout, 'la marge de sécurité (stress) coûte plus aux ménages modestes que la combinaison la moins coûteuse');
// fragilité
proche(sv.fragilite({}), 1, 1e-12, 'fragilité du palier 1 tel quel : 1 (transmissions à 50 %)');
proche(sv.fragilite({ transmissions: 'actuels' }), 0, 1e-12, 'fragilité sans hypothèse favorable : 0');
ok(sv.fragilite({ economies: 31, valeur: 'dix', age: 2 }) > sv.fragilite({ economies: 8 }), 'fragilité croissante avec les hypothèses favorables mobilisées');

// 9. Seuils
var sp0 = sv.seuilProductivite({}, 0.30);
ok(sp0 > 0.018 && sp0 < 0.022, 'productivité requise seule : ≈ 2 % (1,66 % pour la seule année 2065 : § 17.ter ; le critère de maximum ajoute des exigences) : ' + sp0);
ok(sv.evaluer({ prod: sp0 + 1e-6 }, 0.30).stable && !sv.evaluer({ prod: sp0 - 1e-4 }, 0.30).stable, 'la dichotomie encadre bien le seuil');
var A1 = E.pierre.parmi3[0], spA = sv.seuilProductivite(A1.c, A1.tMax);
ok(spA > 0.005 && spA < 0.0071, 'combinaison la moins coûteuse sous l\'auteur : productivité requise juste sous 0,7 % (au bord) : ' + spA);
proche(sv.seuilLevier('socle'), 177.5, 1, 'socle seul : ≤ 178 € pour stabiliser (176 € avant V11770 ; 154 € avant la correction des intérêts)');
proche(sv.seuilLevier('tPlat'), 0.458, 0.001, 'taux plat seul : ≥ 45,8 % pour stabiliser (46,6 % avant la correction)');
ok(sv.seuilLevier('economies') > 200 && sv.seuilLevier('economies') < 240, 'économies seules : ≈ 217 Md€ à 10 ans');
ok(sv.seuilLevier('socle', { transmissions: 'actuels' }) === null, 'avec les droits actuels, aucun socle (même 0 €) ne suffit seul');
var err = false; try { sv.seuilLevier('inconnu'); } catch (e) { err = true; }
ok(err, 'levier continu inconnu : erreur');
ok(S.solveur({ sc: 'haut' }).evaluer({}).r2065 > ref.r2065 && S.solveur({ sc: 'bas' }).evaluer({}).r2065 < ref.r2065, 'démographie haute : plus de dette ; basse : moins');
ok(S.solveur({ taux: 'haut' }).evaluer({}).r2065 > ref.r2065 && S.solveur({ taux: 'bas' }).evaluer({}).r2065 < ref.r2065, 'taux de marché haut : plus de dette ; bas : moins');
ok(sv.evaluer({ socle: 400 }).r2065 === sv.evaluer({ socle: 400 }).r2065, 'déterminisme');

// 10. Relecture du 01/11/2026 : intérêts de 2024 comptés une fois (D2)
var I24 = C.DETTE.interets2024, chA = C.chemin(st0, 'central', { prod: 'central', pensions: 'prix', taux: 'central' }, 2065), AS2 = this.AgeSante;
[2026, 2045, 2065].forEach(function (a) {
  var o2 = C.options(a, { prod: 'central', pensions: 'prix' }), avec = AS2.solde(st0, 'central', a, o2).avec, idx = C.pib('central', a, 'central').indice;
  proche(chA[a - 2025].soldePrimaire, avec + I24 * idx, 1e-9, 'solde primaire ' + a + ' = solde du modèle + intérêts de 2024 × indice du PIB (' + idx.toFixed(3) + ')');
});
// intérêt fantôme nul : les intérêts de 2024 contenus dans le reste du budget (−60,1 × indice) sont exactement compensés par le terme ajouté au solde primaire (+60,1 × indice), à toutes les dates ci-dessus
proche(C.indiceReste('central', 2065, { prod: 'central', reste: 'fige' }), 1, 1e-12, 'indice du reste figé = 1 (euros de 2025)');
proche(C.indiceReste('central', 2065, { prod: 'central', reste: 'productivite' }), C.indiceProductivite('central', 2065), 1e-12, 'indice du reste « productivité » = (1+g)^k');
var chF = C.chemin(st0, 'central', { prod: 'central', pensions: 'prix', taux: 'central', reste: 'fige' }, 2065);
proche(chF[40].soldePrimaire - chF[40].soldeHorsInterets, I24, 1e-9, 'reste figé : solde primaire = solde + intérêts de 2024 (ancien comportement conservé)');
ok(chA[40].detteSurPib < 3.43 - 0.1 && chA[40].detteSurPib > 3.2, 'la correction abaisse la dette/PIB 2065 du palier 1 de 343 à 329 %');
var pibIdx = function (a, ag) { return sv.ligneAn(sv.evaluer({ age: ag }), a); };
proche(sv.ligneAn(sv.evaluer({ age: 2 }), 2065).soldePrimaire - sv.ligneAn(sv.evaluer({ age: 2 }), 2065).soldeHorsInterets, I24 * sv.ligneAn(sv.evaluer({ age: 2 }), 2065).pib / C.DETTE.pibInsee2025, 1e-9, 'âge +2 : les intérêts de 2024 suivent l\'indice du PIB avec l\'emploi relevé');

// 11. Recherche fine du seuil de taux plat (D1, D6)
var LVM = { pensions: 'prix', age: 0, economies: 31, transmissions: 'cinquante', hp: '30-2500', valeur: 'dix' }, LVA2 = { pensions: 'prix', age: 0, economies: 18, transmissions: 'cinquante', hp: '25-2500', valeur: 'aucune' }, LV0 = { pensions: 'prix', age: 0, economies: 0, transmissions: 'cinquante', hp: 'base', valeur: 'aucune' };
var s1 = sv.seuilPlat('pierre', LVM), s2 = sv.seuilPlat('pierre', LVA2), s3 = sv.seuilPlat('pierre', LV0);
ok(s1.stable && s2.stable && s3.stable, 'seuilPlat : le résultat est stable');
ok(s1.tPlat < s2.tPlat && s2.tPlat < s3.tPlat, 'seuilPlat : plus de leviers favorables, seuil plus bas (' + [s1.tPlat, s2.tPlat, s3.tPlat].join(' < ') + ')');
ok(s1.tPlat > 0.385 && s1.tPlat < 0.40 && s2.tPlat > 0.41 && s2.tPlat < 0.43 && s3.tPlat > 0.44 && s3.tPlat < 0.46, 'seuilPlat au central : environ 39 % (leviers au maximum), 42 % (leviers de A2), 45 % (aucun levier)');
ok(s3.tPlat < 0.45, 'le seuil sans levier est sous 45 % : « ≥ 45 % » était un effet de grille');
var sOk = sv.contraintes(F(LV0, { socle: s3.socle, tPlat: s3.tPlat }), 'pierre');
ok(sOk.ok && sOk.zone100 <= 800 + 1e-6 && sOk.zone100 > 799, 'seuilPlat : le socle trouvé est à la limite de la zone à 100 % (800 €) : ' + sOk.zone100);
ok(!sv.evaluer(F(LV0, { socle: s3.socle, tPlat: s3.tPlat - 0.003 }), S.tMaxPour(s3.tPlat - 0.003, 'combine')).stable || !sv.contraintes(F(LV0, { socle: s3.socle, tPlat: s3.tPlat - 0.003 }), 'pierre').ok, 'seuilPlat : 0,3 point de moins, avec le même socle, n\'est plus stable ou plus admissible');
var sb = S.solveur({ taux: 'bas' }).seuilPlat('pierre', LV0), sh = S.solveur({ taux: 'haut' }).seuilPlat('pierre', LV0);
ok(sb.tPlat < s3.tPlat && s3.tPlat < sh.tPlat, 'seuilPlat : croissant avec le taux d\'intérêt (3,4 % < 4,0 % < 4,5 %)');
ok(sh.tPlat - sb.tPlat > 0.03 && sh.tPlat - sb.tPlat < 0.08, 'seuilPlat : le taux d\'intérêt déplace le seuil de 3 à 8 points');
ok(S.solveur().seuilPlat('pierreDroitsActuels', F(LVM, { transmissions: 'actuels' }), 0.70) === null, 'droits de succession actuels, taux central, contraintes de l\'auteur : aucun taux plat jusqu\'à 70 %');
ok(S.solveur({ taux: 'bas' }).seuilPlat('pierreDroitsActuels', F(LVM, { transmissions: 'actuels' }), 0.50) === null, 'droits actuels, taux 3,4 %, leviers au maximum : aucune combinaison à taux plat ≤ 50 % (la grille)');
ok(S.solveur().seuilPlat('pierreSmic', LVM, 0.70) === null, 'smicard à −10 € sous les contraintes de l\'auteur : aucun taux plat, socle de 300 à 500 €');
var bestSmic = -1e9; E.pierre.liste.forEach(function (s) { var e = sv.profils(s.c, s.tMax)[0].ecart; if (e > bestSmic) bestSmic = e; });
ok(bestSmic < -80 && bestSmic > -110, 'sous les contraintes de l\'auteur, le smicard perd au moins ~94 € (grille fine) : ' + bestSmic);
ok(S.GRILLE.socle.length === 41 && S.GRILLE.socle[1] === 495 && S.GRILLE.tPlat.length === 16, 'grille fine : socle par 5 € (41 valeurs), plat par point (16 valeurs)');

// 12. Stress isolés (D4, D7) et combinaisons de référence
Object.keys(S.REFERENCES).forEach(function (id) {
  var r = S.REFERENCES[id], k = sv.contraintes(r.c, r.jeu);
  ok(k.ok, 'référence ' + id + ' : admissible sous le jeu ' + r.jeu);
  ok(sv.evaluer(r.c, k.tMax).stable, 'référence ' + id + ' : stable au central après correction');
});
ok(sv.evaluer(S.REFERENCES.A2.c, S.tMaxPour(0.45, 'combine')).r2065 > 0.93 && sv.evaluer(S.REFERENCES.A2.c, S.tMaxPour(0.45, 'combine')).r2065 < 0.95, 'A2 : dette/PIB 2065 ≈ 94 % (108 % avant la correction)');
var iso = sv.stressIsoles(S.REFERENCES.A2.c, S.tMaxPour(0.45, 'combine')), I = {}; iso.forEach(function (z) { I[z.id] = z; });
ok(I.reactionsHautes.r2065 > 2.4 && I.reactionsHautes.r2065 < 2.9 && !I.reactionsHautes.stable, 'A2 sous les seules réactions hautes (démographie centrale) : ≈ 262 %, non stable');
ok(I.socleSalaires.r2065 > 1.3 && I.socleSalaires.r2065 < 1.6 && !I.socleSalaires.stable, 'A2 avec le socle sur les salaires : ≈ 144 %, non stable');
ok(I.cumul.r2065 === S.solveur({ taux: 'haut' }).evaluer(F(S.REFERENCES.A2.c, { prod: 'bas' }), S.tMaxPour(0.45, 'combine')).r2065, 'stress « cumul » = stress de H190');
ok(I.reactionsHautes.r2065 > I.prod.r2065 && I.reactionsHautes.r2065 > I.taux.r2065 && I.reactionsHautes.r2065 > I.socleSalaires.r2065, 'les réactions de comportement hautes sont le plus gros aléa isolé (plus que productivité, taux et socle)');
var svR = S.solveur({ reactions: 'haut' }), dReac = P1.solde(st0, 'haut') - P1.solde(st0, 'central');
proche(svR.ligneAn(svR.evaluer({}), 2026).soldeHorsInterets - sv.ligneAn(ref, 2026).soldeHorsInterets, dReac * sv.ligneAn(ref, 2026).pib / C.DETTE.pibInsee2025, 1e-6, 'réactions hautes : écart statique du palier 1 indexé sur le PIB');
proche(S.solveur({ reactions: 'central' }).evaluer({}).r2065, ref.r2065, 1e-12, 'réactions centrales avec démographie centrale = central');
proche(S.solveur({ socle: 'salaires' }).evaluer({}).r2065, C.chemin(st0, 'central', { prod: 'central', pensions: 'prix', socle: 'salaires', taux: 'central' }, 2065)[40].detteSurPib, 1e-9, 'socle sur les salaires : identique à croissance.chemin');

// 13. Économies et création de valeur : le levier D est retiré quand des économies sont comptées (D10)
var vE = sv.ligneAn(sv.evaluer({ valeur: 'dix', economies: 31 }), 2045).soldeHorsInterets - sv.ligneAn(sv.evaluer({ economies: 31 }), 2045).soldeHorsInterets, vS = sv.ligneAn(sv.evaluer({ valeur: 'dix' }), 2045).soldeHorsInterets - sv.ligneAn(r26, 2045).soldeHorsInterets;
proche(vS - vE, P1.valeurPourScenario(10, 'central').D, 1e-9, 'valeur + économies : le levier D (simplification) est retiré (pas de double compte)');
ok(sv.fragilite(S.REFERENCES.A3.c) < sv.fragilite(S.REFERENCES.A2.c), 'indice de fragilité : A3 (1,25) < A2 (1,5) : A2 n\'est pas « la moins fragile »');
// 14. Piste du socle élevé (§ 18.8) : frontière socle / taux plat
var FS = sv.frontiereSocle('socleHaut'), FSs = sv.frontiereSocle('socleHautStrict');
ok(FS.length > 400 && FS.length < 650, 'frontière socleHaut : ~523 combinaisons (taux plat par 0,5 point jusqu\'à 60 %, socle jusqu\'à 1 000 €) : ' + FS.length);
var cl = { '0': 0, A: 0, H: 0, AH: 0 }; FS.forEach(function (r) { cl[r.classe]++; });
ok(cl['0'] === 0 && cl.H === 0 && cl.A > 100 && cl.AH > 200, 'aucune combinaison stable sans relâcher l\'âge (smicard à 0 €, médian gagnant) : classes ' + JSON.stringify(cl));
var tousOk = FS.every(function (r) { var k = sv.contraintes(r.c, 'socleHaut'); return k.ok && k.combine <= 0.75 + 1e-9 && sv.evaluer(r.c, k.tMax).stable && r.c.age > 0 && r.c.transmissions === 'cinquante'; });
ok(tousOk, 'chaque point : admissible (plafond combiné ≤ 75 %, minimum garanti, zone à 100 % ≤ 800 €, smicard ≥ 0, médian > 0), stable, âge relevé, transmissions à 50 %');
var smicOk = FS.filter(function (r, i) { return i % 40 === 0; }).every(function (r) { var p = sv.profils(r.c, r.tMax); return p[0].ecart >= -1e-6 && p[1].ecart > 0; });
ok(smicOk, 'échantillon : smicard ≥ 0 € et médian gagnant à chaque point de la frontière');
// monotonie : l'ensemble des socles stables est un début de la liste des socles admissibles (la dichotomie est exacte)
var monoOk = true, jH = S.JEUX.socleHaut;
[[0.46, 2, '30-2000', 31, 'dix'], [0.52, 2, '30-2500', 31, 'dix'], [0.52, 2, '25-2000', 18, 'aucune'], [0.56, 1, '30-2000', 31, 'dix'], [0.60, 2, 'base', 31, 'dix']].forEach(function (a) {
  var vu = false, instable = false, x, best = null, c, k;
  for (x = 300; x <= 1000; x += 5) {
    c = { socle: x, tPlat: a[0], pensions: 'prix', age: a[1], economies: a[3], transmissions: 'cinquante', hp: a[2], valeur: a[4], prod: 'central' }; k = sv.contraintes(c, jH);
    if (!k.ok) continue;
    var st = sv.evaluer(c, k.tMax).stable;
    if (st) { best = x; if (instable) monoOk = false; } else instable = true;
  }
  var r = FS.filter(function (q) { return Math.abs(q.plat - a[0]) < 1e-9 && q.c.age === a[1] && q.c.hp === a[2] && q.c.economies === a[3] && q.c.valeur === a[4]; })[0];
  if ((best === null) !== !r || (r && r.socle !== best)) monoOk = false;
});
ok(monoOk, 'la stabilité est monotone en le socle (balayage complet = dichotomie) sur 5 familles de leviers');
ok(sv.socleMinAdmissible('socleHaut', 0.52) === 755 && sv.socleMinAdmissible('socleHaut', 0.60) === 915, 'socle minimal pour que le smicard ne perde rien : 755 € à 52 %, 915 € à 60 %');
// relecture D3 : socle 750-800, plat 52-54 %, âge +2, contribution dès 2 000 € : stable, smicard −3 à +7 €
var d3 = sv.contraintes(S.PISTE_SOCLE.P1.c, 'socleHaut');
var c750 = { socle: 750, tPlat: 0.52, pensions: 'prix', age: 2, economies: 31, transmissions: 'cinquante', hp: '30-2000', valeur: 'dix' }, k750 = sv.contraintes(c750, 'smicSeul');
ok(sv.evaluer(c750, k750.tMax).stable && Math.abs(sv.profils(c750, k750.tMax)[0].ecart + 3) < 1, 'reproduction de la relecture : socle 750 €, plat 52 %, âge +2, 30 % > 2 000 € : stable, smicard −3 €');
var c800 = F(c750, { socle: 800, tPlat: 0.54 }), k800 = sv.contraintes(c800, 'smicSeul');
ok(sv.evaluer(c800, k800.tMax).stable && Math.abs(sv.profils(c800, k800.tMax)[0].ecart - 7) < 1, 'socle 800 €, plat 54 % : stable, smicard +7 €');
// frontières : taux plat minimal par famille
function platMinF(L, f) { var m = 9; L.forEach(function (r) { if (f(r) && r.plat < m) m = r.plat; }); return m; }
ok(Math.abs(platMinF(FS, function (r) { return r.c.age === 2 && r.c.hp === '30-2000'; }) - 0.39) < 1e-9, 'âge +2 et contribution dès 2 000 € : taux plat minimal 39 % (socle 495 €)');
ok(Math.abs(platMinF(FS, function (r) { return r.c.age === 2 && r.c.hp === '30-2500'; }) - 0.44) < 1e-9, 'âge +2 seul (contribution à 30 % au-dessus de 2 500 € : retraités sous 2 500 € non touchés) : taux plat minimal 44 %');
ok(Math.abs(platMinF(FS, function (r) { return r.c.age === 2 && r.c.hp === 'base'; }) - 0.48) < 1e-9, 'âge +2 avec le palier 1 de base pour les hautes pensions : taux plat minimal 48 %');
ok(platMinF(FS, function (r) { return r.c.age === 1 && r.c.hp === '30-2500'; }) === 9 && Math.abs(platMinF(FS, function (r) { return r.c.age === 1 && r.c.hp === '30-2000'; }) - 0.50) < 1e-9, 'âge +1 : il faut la contribution dès 2 000 € et 50 % de taux plat');
ok(sv.frontiereSocle('socleHaut', { transmissions: ['actuels'] }).length === 0, 'droits de succession actuels : aucune combinaison stable jusqu\'à 60 % et 1 000 €');
// strict : aucune zone à 100 %
ok(FSs.length > 80 && FSs.length < 140 && FSs.every(function (r) { return r.socle >= 877 && r.zone100 <= 1e-9; }), 'variante stricte (jamais tout prendre) : aucune zone à 100 %, socle ≥ 877 € : ' + FSs.length + ' combinaisons');
ok(Math.abs(platMinF(FSs, function () { return true; }) - 0.56) < 1e-9, 'variante stricte : taux plat minimal 56 %');
// âge inchangé : perte minimale du smicard
var F0 = sv.frontiereSocle('socleHautSansSmic', { age: [0] }), best0 = -1e9; F0.forEach(function (r) { var e = sv.profils(r.c, r.tMax)[0].ecart; if (e > best0) best0 = e; });
ok(best0 < -25 && best0 > -45, 'âge inchangé, smicard non contraint : le smicard perd au mieux ~33 € (contre 94 € sous les contraintes complètes de l\'auteur) : ' + best0);
// points de référence
Object.keys(S.PISTE_SOCLE).forEach(function (id) {
  var pr = S.PISTE_SOCLE[id], k = sv.contraintes(pr.c, pr.jeu), e = sv.evaluer(pr.c, k.tMax), p = sv.profils(pr.c, k.tMax);
  ok(k.ok && e.stable && p[0].ecart >= -1e-6 && p[1].ecart > 0 && k.combine <= 0.75 + 1e-9, 'point ' + id + ' : admissible, stable, smicard ≥ 0, médian gagnant, plafond combiné ≤ 75 %');
  var pas5 = sv.evaluer(F(pr.c, { socle: pr.c.socle + 5 }), S.tMaxPour(pr.c.tPlat, 'combine'));
  ok(!pas5.stable || !sv.contraintes(F(pr.c, { socle: pr.c.socle + 5 }), pr.jeu).ok, 'point ' + id + ' : c\'est la frontière (5 € de socle en plus : non stable ou non admissible)');
});
ok(S.PISTE_SOCLE.P4.c.age === 2 && S.PISTE_SOCLE.P4.c.hp === '30-2500', 'P4 (plat 52 %, socle 780 €) ne relâche que l\'âge de départ');
ok(sv.contraintes(S.PISTE_SOCLE.P7.c, 'socleHautStrict').zone100 <= 0, 'P7 : aucune zone à 100 %');
// retraités
var rt = sv.retraites(S.PISTE_SOCLE.P1.c), rm = {}; rt.forEach(function (x) { rm[x.pn] = x; });
ok(rm[1200].ecart === 0 && rm[2000].ecart === 0 && rm[2500].ecart === -150 && rm[3500].ecart === -450 && rm[3500].ecartRef === -200, 'P1 (30 % > 2 000 €) : retraités à 1 200 € et 2 000 € : 0 ; à 2 500 € : −150 ; à 3 500 € : −450 (−200 au palier 1 de base)');
var rt2 = sv.retraites(S.PISTE_SOCLE.P4.c), rm2 = {}; rt2.forEach(function (x) { rm2[x.pn] = x; });
ok(rm2[2500].ecart === 0 && rm2[3500].ecart === -300, 'P4 (30 % > 2 500 €) : retraités à 2 500 € non touchés ; à 3 500 € : −300');
ok(rm[1200].manqueCor2045 < -60 && rm[1200].manqueCor2045 > -90, 'manque de l\'indexation sur les prix par rapport au COR en 2045 : ~−75 € pour 1 200 €');
// robustesse
proche(S.solveur({ ageEffet: 1 }).evaluer(S.PISTE_SOCLE.P4.c, 0.1466).r2065, sv.evaluer(S.PISTE_SOCLE.P4.c, 0.1466).r2065, 1e-12, 'ageEffet = 1 : identique au module emploi');
var a9 = S.solveur({ ageEffet: 0.9 }).evaluer(S.PISTE_SOCLE.P4.c, 0.1466), a7 = S.solveur({ ageEffet: 0.7 }).evaluer(S.PISTE_SOCLE.P4.c, 0.1466);
ok(a9.r2065 > sv.evaluer(S.PISTE_SOCLE.P4.c, 0.1466).r2065 && a7.r2065 > a9.r2065 && !a9.stable, 'P4 : si l\'effet de l\'âge est surestimé de 10 %, elle n\'est plus stable (120 %) ; de 30 %, 130 %');
var iP = sv.stressIsoles(S.PISTE_SOCLE.P4.c, 0.1466), IP = {}; iP.forEach(function (z) { IP[z.id] = z; });
ok(!IP.prod.stable && !IP.taux.stable && !IP.reactionsHautes.stable && !IP.socleSalaires.stable && IP.reactionsHautes.r2065 > 3, 'P4 : aucune des quatre épreuves isolées n\'est passée ; réactions hautes > 300 %');
ok(Math.abs(platMinF(S.solveur({ taux: 'haut' }).frontiereSocle('socleHaut'), function () { return true; }) - 0.47) < 1e-9, 'taux de marché 4,5 % : taux plat minimal 47,0 % (47,5 % avant V11770 ; 39 % au départ)');
ok(S.solveur({ reactions: 'haut' }).frontiereSocle('socleHaut').length === 0, 'réactions de comportement hautes seules : aucune combinaison stable jusqu\'à 60 % et 1 000 €');
ok(S.solveur().frontiereSocle('socleHaut', { prod: 'bas' }).length === 0, 'productivité 0,4 % : aucune combinaison stable jusqu\'à 60 % et 1 000 €');
ok(Math.abs(platMinF(S.solveur({ ageEffet: 0.8 }).frontiereSocle('socleHaut'), function () { return true; }) - 0.42) < 1e-9, 'effet de l\'âge ×0,8 : taux plat minimal 42,0 % (42,5 % avant V11770)');

// option offreTravail (H202) : baisse supplémentaire des revenus d'activité D1-D9, proportionnelle au socle
var c4 = S.PISTE_SOCLE.P4.c, F4 = function (l) { return sv.evaluer(F(c4, { offreTravail: l }), 0.1466); };
proche(F4('aucune').r2065, sv.evaluer(c4, 0.1466).r2065, 1e-12, 'offreTravail « aucune » (défaut) : identique à l\'absence de l\'option');
ok(F4('bas').r2065 < F4('aucune').r2065 && F4('central').r2065 > F4('aucune').r2065 && F4('haut').r2065 > F4('central').r2065, 'offreTravail : bas < aucune < central < haut (dette 2065)');
ok(F4('bas').stable && !F4('central').stable && !F4('haut').stable, 'P4 reste stable avec offreTravail bas (+2 points de revenus D1-D9) mais plus au central (−1 point : 125 %) ni au haut (−3 points : 146 %)');
proche(F4(0.01).r2065, F4('central').r2065, 1e-12, 'offreTravail numérique 0,01 = « central »');
var dSol = function (so) { return sv.evaluer(F(c4, { socle: so, offreTravail: 'central' }), 0.1466).rows[0].soldeHorsInterets - sv.evaluer(F(c4, { socle: so }), 0.1466).rows[0].soldeHorsInterets; };
ok(dSol(780) < 0 && Math.abs(dSol(390) / dSol(780) - 0.5) < 0.03, 'offreTravail : l\'effet est proportionnel au socle (à 390 € la moitié de celui de 780 €, à la variation des recettes D1-D9 près)');
ok(platMinF(sv.frontiereSocle('socleHaut', { offreTravail: 'central' }), function () { return true; }) > platMinF(sv.frontiereSocle('socleHaut'), function () { return true; }), 'offreTravail central : le taux plat minimal de la frontière monte (41 % contre 39 %)');
ok(platMinF(sv.frontiereSocle('socleHaut', { offreTravail: 'haut' }), function () { return true; }) >= 0.485 - 1e-9, 'offreTravail haut : taux plat minimal de la frontière ≥ 48,5 % (49 % avant V11770, RSA à 1,84 M)');

log('\n' + n + ' contrôles au vert');