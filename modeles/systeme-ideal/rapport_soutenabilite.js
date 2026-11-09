// Soutenabilité du palier 1 : tableaux de resultats.md § 18. Reproduction, depuis ce dossier :
//   jsc modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js croissance.js trajectoires_age_depart.js soutenabilite.js rapport_soutenabilite.js
var S = this.Soutenabilite, C = this.Croissance;
var log = (typeof print === 'function') ? print : console.log;
function r0(x) { var v = Math.round(x); return (v < 0 ? '−' : '') + Math.abs(v); }
function r1(x) { var v = Math.round(x * 10) / 10; return (v < 0 ? '−' : '') + Math.abs(v).toString().replace('.', ','); }
function r2(x) { var v = Math.round(x * 100) / 100; return (v < 0 ? '−' : '') + Math.abs(v).toString().replace('.', ','); }
function sg(x) { return (x >= 0 ? '+' : '−') + r0(Math.abs(x)); }
function pc(x) { return r0(100 * x) + ' %'; }
function pc1(x) { return r1(100 * x) + ' %'; }
var sv = S.solveur(), AN = [2035, 2045, 2065];
var PENS = { prix: 'prix', mixte: 'COR sous 2 500 €, prix au-dessus', cor: 'COR', salaires: 'salaires' };
function lib(c, tMax) {
  return 'socle ' + c.socle + ' €, plat ' + r1(c.tPlat * 100) + ' % (t_max ' + r1(tMax * 100) + ' %), pensions ' + PENS[c.pensions] + ', âge +' + c.age + ', économies ' + c.economies + ' Md€, transmissions ' + (c.transmissions === 'cinquante' ? '50 %' : 'droits actuels') +
    ', hautes pensions ' + r0(S.HP[c.hp].taux * 100) + ' % > ' + S.HP[c.hp].seuil + ' €, valeur ' + (c.valeur === 'dix' ? 'oui' : 'non');
}

log('## 1. Le palier 1 tel quel, et le critère (central : démographie centrale, productivité 0,7 %, taux de marché 4,0 %, reste du budget indexé sur le PIB, santé et dépendance comptées)');
var ref = sv.evaluer({});
log('critère de soutenabilité : dette/PIB de 2065 ≤ celle de 2025 (' + pc1(ref.r2025) + ') et jamais au-dessus de ' + pc1(ref.r2025 + S.PARAM.tolerance) + ' entre 2026 et 2065 ; plafond de taux marginal ' + pc(S.PARAM.plafond) + ' ; zone à 100 % ≤ ' + S.PARAM.falaiseMax + ' € ; part de la masse des pensions sous 2 500 € : ' + pc1(S.partMasseSous(2500)));
log('palier 1 tel quel (35 %, 500 €, pensions et socle sur les prix) : ' + AN.map(function (a) { var l = sv.ligneAn(ref, a); return a + ' : solde primaire ' + r0(l.soldePrimaire) + ', intérêts ' + r0(l.interets) + ', solde total ' + r0(l.soldeTotal) + ', dette/PIB ' + pc(l.detteSurPib); }).join(' ; '));
log('même calcul par croissance.chemin : dette/PIB 2065 ' + pc1(C.chemin(S.solveur().evaluer({}).st, 'central', { prod: 'central', pensions: 'prix', taux: 'central' }, 2065)[40].detteSurPib));
log('productivité requise seule (palier 1 tel quel, avec le critère de maximum) : ' + r2(100 * sv.seuilProductivite({}, 0.30)) + ' % par an (1,66 % si l\'on ne regarde que 2065, § 17.ter)');
log('');

log('## 2. Chaque levier seul, à partir du palier 1 tel quel : écart de solde avec intérêts (Md€) en 2035 / 2045 / 2065 et dette/PIB de 2065');
log('| levier | écart 2035 | écart 2045 | écart 2065 | dont hors intérêts : 2035 / 2045 / 2065 | dette/PIB 2065 | stable ? | taux marginal combiné (IS + dividende) |');
var es = sv.effetsSeuls();
es.lignes.forEach(function (l) {
  log('| ' + l.nom + ' | ' + l.ecart.map(sg).join(' | ') + ' | ' + l.ecartHorsInterets.map(sg).join(' / ') + ' | ' + pc(l.r2065) + ' | ' + (l.stable ? 'oui' : 'non') + ' | ' + pc1(1 - 0.75 * (1 - l.c.tPlat - l.tMax)) + ' |');
});
log('');
log('Seuils d\'un levier seul (aucun plafond, hors grille) : socle ≤ ' + r0(sv.seuilLevier('socle')) + ' € (au lieu de 500) ; taux plat ≥ ' + pc1(sv.seuilLevier('tPlat')) + ' (au lieu de 35 %) ; économies de dépenses ≥ ' + r0(sv.seuilLevier('economies')) + ' Md€ à 10 ans (au lieu de 8 / 18 / 31).');
log('Même seuil avec les transmissions aux droits actuels : socle ' + (sv.seuilLevier('socle', { transmissions: 'actuels' }) === null ? 'aucun, même à 0 €' : '≤ ' + r0(sv.seuilLevier('socle', { transmissions: 'actuels' })) + ' €') + ' ; taux plat ≥ ' + (sv.seuilLevier('tPlat', { transmissions: 'actuels' }) === null ? 'aucun jusqu\'à 70 %' : pc1(sv.seuilLevier('tPlat', { transmissions: 'actuels' }))) + '.');
log('');

log('## 3. Combinaisons qui stabilisent la dette, par jeu de contraintes (grille fine : socle 500 à 300 € par pas de 5 €, plat 35 à 50 % par pas de 1 point, pensions × 4, âge 0 à 2, économies 0 à 31, transmissions × 2, hautes pensions × 5, valeur × 2)');
log('Stress de robustesse : productivité 0,4 % et taux de marché 4,5 %, le reste inchangé. Coût pour les ménages modestes (€/mois, 2025) : pertes du Smic à 35 h et du salarié médian par rapport au palier 1 tel quel + ' + S.PARAM.penaliteAge + ' € par an de départ en plus (H188) ; fragilité : nombre d\'hypothèses favorables mobilisées (H189).');
log('| jeu | combinaisons testées | admissibles | stables | stables au stress | plat minimal parmi les stables | socle minimal | coût minimal (€/mois) |');
var JEUX = ['smicSeul', 'juridique', 'combine', 'pierre', 'pierreSmic', 'pierreDroitsActuels', 'pierreAge'], res = {};
JEUX.forEach(function (j) {
  var x = sv.enumerer(j); res[j] = x;
  var pm = x.liste.reduce(function (m, s) { return Math.min(m, s.c.tPlat); }, 9), sm = x.liste.reduce(function (m, s) { return Math.min(m, s.c.socle); }, 9999);
  log('| ' + j + ' : ' + x.jeu.libelle + ' | ' + x.total + ' | ' + x.admissibles + ' | ' + x.stables + ' | ' + x.robustes + ' | ' + (x.stables ? pc1(pm) : 'aucune') + ' | ' + (x.stables ? sm + ' €' : 'aucun') + ' | ' + (x.stables ? r0(x.liste[0].cout) : 'sans objet') + ' |');
});
log('');
JEUX.forEach(function (j) {
  var x = res[j];
  log('### 3.' + (JEUX.indexOf(j) + 1) + ' ' + j + ' : les trois moins coûteuses pour les ménages modestes (distinctes par socle, taux plat et âge)');
  if (!x.stables) { log('Aucune combinaison de la grille ne stabilise la dette sous ces contraintes.'); log(''); return; }
  log('| # | combinaison | dette/PIB 2065 | maximum 2026-2065 | dette/PIB 2065 au stress | coût ménages modestes (€/mois) | fragilité | zone à 100 % (€) |');
  x.parmi3.forEach(function (s, i) { log('| ' + (i + 1) + ' | ' + lib(s.c, s.tMax) + ' | ' + pc(s.r2065) + ' | ' + pc(s.rMax) + ' | ' + pc(s.r2065Stress) + ' | ' + r0(s.cout) + ' | ' + r2(s.fragilite) + ' | ' + r0(s.zone100) + ' |'); });
  if (x.parmi3Robustes.length) {
    log('Les trois moins coûteuses parmi celles qui résistent aussi au stress :');
    x.parmi3Robustes.forEach(function (s, i) { log('| ' + (i + 1) + ' | ' + lib(s.c, s.tMax) + ' | ' + pc(s.r2065) + ' | ' + pc(s.rMax) + ' | ' + pc(s.r2065Stress) + ' | ' + r0(s.cout) + ' | ' + r2(s.fragilite) + ' | ' + r0(s.zone100) + ' |'); });
  } else log('Aucune ne résiste au stress (productivité 0,4 %, taux 4,5 %).');
  log('');
});

log('## 3 bis. Seuil de taux plat hors grille, sous les contraintes de l\'auteur : une fourchette selon les leviers favorables et le taux d\'intérêt');
log('Méthode : pour chaque taux plat (balayage par 0,25 point, puis dichotomie), le plus petit socle admissible (zone à 100 % ≤ 800 €, plafond combiné 75 %), puis test de stabilité. Les leviers non listés sont au minimum (pensions sur les prix, âge inchangé, transmissions à 50 %). Socle de départ de la recherche : pas de 5 €, affiné au centime.');
var LEV = [['tous les leviers favorables au maximum (économies 31 Md€, hautes pensions 30 % > 2 500 €, création de valeur)', { pensions: 'prix', age: 0, economies: 31, transmissions: 'cinquante', hp: '30-2500', valeur: 'dix' }],
  ['leviers de A2 (économies 18 Md€, hautes pensions 25 % > 2 500 €, sans valeur)', { pensions: 'prix', age: 0, economies: 18, transmissions: 'cinquante', hp: '25-2500', valeur: 'aucune' }],
  ['aucun levier hors taux plat et socle', { pensions: 'prix', age: 0, economies: 0, transmissions: 'cinquante', hp: 'base', valeur: 'aucune' }]];
log('| leviers | taux de marché 3,4 % | 4,0 % (central) | 4,5 % | socle correspondant (central) |');
var seuils = {};
LEV.forEach(function (l, i) {
  var r = ['bas', 'central', 'haut'].map(function (tx) { return S.solveur({ taux: tx }).seuilPlat('pierre', l[1]); });
  seuils[i] = r;
  log('| ' + l[0] + ' | ' + r.map(function (x) { return x ? pc1(x.tPlat) : '> 65 %'; }).join(' | ') + ' | ' + (r[1] ? r0(r[1].socle) + ' € (t_max ' + pc1(r[1].tMax) + ')' : '—') + ' |');
});
log('Fourchette au central : ' + pc1(seuils[0][1].tPlat) + ' à ' + pc1(seuils[2][1].tPlat) + ' ; toutes hypothèses de taux confondues : ' + pc1(seuils[0][0].tPlat) + ' à ' + pc1(seuils[2][2].tPlat) + '.');
var MAXA = { pensions: 'prix', age: 0, economies: 31, transmissions: 'actuels', hp: '30-2500', valeur: 'dix' };
log('Droits de succession actuels (tous les autres leviers au maximum, taux plat jusqu\'à 70 %, socle de 300 à 500 €) : ' + ['bas', 'central', 'haut'].map(function (tx) { var r = S.solveur({ taux: tx }).seuilPlat('pierreDroitsActuels', MAXA, 0.70); return 'taux de marché ' + { bas: '3,4', central: '4,0', haut: '4,5' }[tx] + ' % : ' + (r ? 'taux plat ' + pc1(r.tPlat) : 'aucun taux plat'); }).join(' ; ') + ' (sous les contraintes de l\'auteur).');
log('Meilleure perte du smicard parmi les combinaisons stables sous les contraintes de l\'auteur (grille fine) : ' + ['bas', 'central', 'haut'].map(function (tx) { var best = -1e9; var sx = S.solveur({ taux: tx }); sx.enumerer('pierre').liste.forEach(function (s) { var e = sx.profils(s.c, s.tMax)[0].ecart; if (e > best) best = e; }); return 'taux ' + { bas: '3,4', central: '4,0', haut: '4,5' }[tx] + ' % : ' + sg(best) + ' €'; }).join(' ; ') + ' (profil du Smic à 35 h, écart à la loi actuelle).');
log('');

log('## 4. Les combinaisons de référence : trajectoire, productivité requise, robustesse');
var CH = [];   // [étiquette, combinaison, jeu]
Object.keys(S.REFERENCES).forEach(function (id) {
  var r = S.REFERENCES[id], k = sv.contraintes(r.c, r.jeu), e = sv.evaluer(r.c, k.tMax);
  CH.push([id, { c: sv.contraintes(r.c, r.jeu).ok ? S.complet(r.c) : S.complet(r.c), tMax: k.tMax, fragilite: sv.fragilite(r.c), r2065: e.r2065, zone100: k.zone100 }, r.jeu]);
});
log('Étiquettes : combinaisons de référence figées (issues de la première recherche à grille de 50 €, restées stables après correction ; la recherche fine du § 3 en trouve d\'autres, moins coûteuses, souvent au bord de la zone à 100 %) : A1 à A3 admissibles sous les contraintes de l\'auteur ; B1 si l\'âge de départ et le seuil des hautes pensions sont lâchés ; R1 résiste aussi au stress. Indice de fragilité (nombre d\'hypothèses favorables, plus bas = moins fragile) : ' + CH.map(function (h) { return h[0] + ' ' + r2(h[1].fragilite); }).join(' ; ') + '.');
log('| étiquette | combinaison | solde total 2035 / 2045 / 2065 (Md€) | dette/PIB 2035 / 2045 / 2065 | productivité requise | dette/PIB 2065 : productivité 0,4 % | taux 4,5 % | taux 3,4 % | démographie et réactions « haut » | « bas » |');
function dp(c, tm, opt, prod) { var q = {}, k; for (k in c) q[k] = c[k]; if (prod !== undefined) q.prod = prod; return S.solveur(opt).evaluer(q, tm); }
CH.forEach(function (h) {
  var s = h[1], c = s.c, tm = s.tMax, e = sv.evaluer(c, tm);
  var pr = sv.seuilProductivite(c, tm);
  log('| ' + h[0] + ' | ' + lib(c, tm) + ' | ' + AN.map(function (a) { return r0(sv.ligneAn(e, a).soldeTotal); }).join(' / ') + ' | ' + AN.map(function (a) { return pc(sv.ligneAn(e, a).detteSurPib); }).join(' / ') + ' | ' + (pr === null ? '> 6 %' : r2(pr * 100) + ' %') +
    ' | ' + pc(dp(c, tm, {}, 'bas').r2065) + ' | ' + pc(dp(c, tm, { taux: 'haut' }).r2065) + ' | ' + pc(dp(c, tm, { taux: 'bas' }).r2065) + ' | ' + pc(dp(c, tm, { sc: 'haut', taux: 'haut' }).r2065) + ' | ' + pc(dp(c, tm, { sc: 'bas', taux: 'bas' }).r2065) + ' |');
});
log('productivité requise, avec deux décimales : ' + CH.map(function (h) { var p = sv.seuilProductivite(h[1].c, h[1].tMax); return h[0] + ' ' + (p === null ? '> 6' : r2(p * 100)) + ' %'; }).join(' ; '));
log('');

log('## 5. Qui gagne, qui perd (€ par mois, 2025, central) : écart à la loi actuelle (« avant » estimé ⚠️) pour le palier 1 tel quel et pour chaque combinaison');
log('| profil | avant | palier 1 tel quel (35 %, 500 €) | ' + CH.map(function (h) { return h[0]; }).join(' | ') + ' |');
var P0 = sv.profils({}, 0.30), PR = CH.map(function (h) { return sv.profils(h[1].c, h[1].tMax); });
P0.forEach(function (p, i) { log('| ' + p.libelle + ' | ' + r0(p.avantMois) + ' | ' + sg(p.ecart) + ' | ' + PR.map(function (x) { return sg(x[i].ecart); }).join(' | ') + ' |'); });
log('');
log('Retraité à 1 200 € : effet de l\'indexation de la pension en 2045 par rapport aux prix (€/mois) : ' + CH.map(function (h, i) { return h[0] + ' ' + sg(PR[i][4].indexation2045); }).join(' ; '));
log('Coût pour les ménages modestes (€/mois) : ' + CH.map(function (h) { return h[0] + ' ' + r0(sv.coutModestes(h[1].c, h[1].tMax).total); }).join(' ; '));
log('Smicard à 35 h : écart à la loi actuelle ' + CH.map(function (h, i) { return h[0] + ' ' + sg(PR[i][0].ecart); }).join(' ; ') + ' ; tolérance de optimisation.js (v2) : −10.');
log('');

log('## 6. Ce que coûte chaque contrainte : coût minimal pour les ménages modestes (€/mois) parmi les combinaisons stables');
log('| jeu | stables | coût minimal | plat minimal |');
JEUX.forEach(function (j) { var x = res[j]; log('| ' + j + ' | ' + x.stables + ' | ' + (x.stables ? r0(x.liste[0].cout) : 'aucune combinaison') + ' | ' + (x.stables ? pc1(x.liste.reduce(function (m, s) { return Math.min(m, s.c.tPlat); }, 9)) : '—') + ' |'); });
var best = null, g = S.GRILLE;
g.socle.forEach(function (so) { g.tPlat.forEach(function (tp) { g.pensions.forEach(function (pe) { g.age.forEach(function (ag) { g.economies.forEach(function (ec) { g.hp.forEach(function (h) {
  var c = { socle: so, tPlat: tp, pensions: pe, age: ag, economies: ec, transmissions: 'cinquante', hp: h, valeur: 'dix' }, k = sv.contraintes(c, 'smicSeul');
  if (!k.ok) return; var e = sv.evaluer(c, k.tMax); if (!best || e.r2065 < best.e.r2065) best = { c: c, tMax: k.tMax, e: e };
}); }); }); }); }); });
log('');
log('Meilleure combinaison qui garde le smicard à moins de 10 € de perte, tous les leviers favorables au maximum (transmissions à 50 %, économies 31 Md€, valeur, hautes pensions, âge +2) : ' + lib(best.c, best.tMax) + ' : dette/PIB 2065 ' + pc(best.e.r2065) + ' (maximum ' + pc(best.e.rMax) + ') ; productivité requise ' + (function () { var p = sv.seuilProductivite(best.c, best.tMax); return p === null ? '> 6 %' : r2(p * 100) + ' %'; })() + '.');

log('');
log('## 7. Stress isolés : un seul aléa à la fois (les autres au central), dette/PIB de 2065 et maximum 2026-2065 ; « stable » si le critère H183 est tenu');
log('| combinaison | ' + S.STRESS_ISOLES.map(function (z) { return z.libelle; }).join(' | ') + ' |');
CH.forEach(function (h) {
  var x = sv.stressIsoles(h[1].c, h[1].tMax);
  log('| ' + h[0] + ' | ' + x.map(function (z) { return pc(z.r2065) + ' (max ' + pc(z.rMax) + ')' + (z.stable ? ' stable' : ''); }).join(' | ') + ' |');
});
log('Réactions de comportement hautes seules : écart statique du solde du palier 1 (réactions « haut » moins centrales), indexé sur le PIB. Socle sur les salaires : le socle suit (1+g)^k au lieu des prix.');

// ---------- 8. Piste du socle élevé (§ 18.8)
log('');
log('## 8. Piste du socle élevé : frontière socle / taux plat (socle de 300 à 1 000 € par 5 €, taux plat de 35 à 60 % par 0,5 point ; plafond combiné 75 % IS compris ; minimum garanti ; zone à 100 % ≤ 800 € ; smicard à 0 € ou mieux ; médian gagnant ; pensions sur les prix ; transmissions à 50 %)');
var MAXL = { economies: [31], valeur: ['dix'] }, A2L = { economies: [18], valeur: ['aucune'] };
function fr(solv, jeu, opt) { return solv.frontiereSocle(jeu, opt); }
function maxSocle(L, plat, f) { var b = null; L.forEach(function (r) { if (Math.abs(r.plat - plat) < 1e-9 && f(r) && (!b || r.socle > b.socle)) b = r; }); return b; }
var LH = fr(sv, 'socleHaut'), LHmax = fr(sv, 'socleHaut', MAXL), LHa2 = fr(sv, 'socleHaut', A2L), LS = fr(sv, 'socleHautStrict'), L0 = fr(sv, 'socleHautSansSmic', { age: [0] });
log('combinaisons stables et admissibles (un point par taux plat et par combinaison de leviers : le plus grand socle) : ' + LH.length + ' (zone à 100 % ≤ 800 €), ' + LS.length + ' (aucune zone à 100 %) ; à âge inchangé et sans contrainte sur le smicard : ' + L0.length);
var classes = { '0': 0, A: 0, H: 0, AH: 0 }; LH.forEach(function (r) { classes[r.classe]++; });
log('par classe de relâchement des contraintes de l\'auteur (0 : aucune ; A : âge ; H : seuil des hautes pensions sous 2 500 € ; AH : les deux) : ' + JSON.stringify(classes) + ' ; avec le smicard à 0 € et l\'âge inchangé : aucune combinaison stable (jusqu\'à 60 % ; au-delà de 61 %, t_max tombe sous 5 % : plafond)');
log('');
log('### 8.1 Plus grand socle stable (€/mois) selon le taux plat ; « min » = plus petit socle qui garde le smicard à 0 € (le socle minimal est le même pour toutes les colonnes)');
log('| taux plat | socle min (smicard ≥ 0) | âge +2, 30 % > 2 500 €, leviers au max | âge +2, 30 % > 2 000 €, leviers au max | âge +2, 30 % > 2 000 €, leviers de A2 (18 Md€, sans valeur) | âge +1, 30 % > 2 000 €, leviers au max | âge +2, aucune zone à 100 %, leviers au max | âge inchangé, 30 % > 2 000 €, leviers au max (smicard non contraint) : socle max / écart du smicard |');
log('|---|---|---|---|---|---|---|---|');
function cel(L, plat, f) { var b = maxSocle(L, plat, f); return b ? r0(b.socle) + ' (' + pc(b.r2065) + ')' : '—'; }
var pl; for (pl = 0.38; pl <= 0.6001; pl += 0.02) {
  var pp = Math.round(pl * 1000) / 1000, mn = sv.socleMinAdmissible('socleHaut', pp), b0 = maxSocle(L0, pp, function (r) { return r.c.hp === '30-2000'; }), s0 = b0 ? sv.profils(b0.c, b0.tMax)[0].ecart : null;
  log('| ' + pc1(pp) + ' | ' + (mn === null ? '—' : r0(mn)) + ' | ' + cel(LHmax, pp, function (r) { return r.c.age === 2 && r.c.hp === '30-2500'; }) + ' | ' + cel(LHmax, pp, function (r) { return r.c.age === 2 && r.c.hp === '30-2000'; }) + ' | ' +
    cel(LHa2, pp, function (r) { return r.c.age === 2 && r.c.hp === '30-2000'; }) + ' | ' + cel(LHmax, pp, function (r) { return r.c.age === 1 && r.c.hp === '30-2000'; }) + ' | ' + cel(LS, pp, function (r) { return r.c.age === 2 && r.c.hp === '30-2500' && r.c.economies === 31; }) + ' | ' +
    (b0 ? r0(b0.socle) + ' / ' + sg(s0) + ' €' : '—') + ' |');
}
log('(entre parenthèses : dette/PIB de 2065, central ; « — » : aucune combinaison stable et admissible.) Taux plat minimal par famille (plus petit taux plat à socle admissible et stable) :');
function platMin(L, f) { var m = null; L.forEach(function (r) { if (f(r) && (m === null || r.plat < m.plat)) m = r; }); return m; }
[['âge +2, 30 % > 2 000 €, leviers au max', LHmax, function (r) { return r.c.age === 2 && r.c.hp === '30-2000'; }], ['âge +2, 30 % > 2 500 €, leviers au max', LHmax, function (r) { return r.c.age === 2 && r.c.hp === '30-2500'; }],
 ['âge +2, 25 % > 2 500 €, leviers au max', LHmax, function (r) { return r.c.age === 2 && r.c.hp === '25-2500'; }], ['âge +2, 20 % > 2 500 € (palier 1 de base), leviers au max', LHmax, function (r) { return r.c.age === 2 && r.c.hp === 'base'; }],
 ['âge +1, 30 % > 2 000 €, leviers au max', LHmax, function (r) { return r.c.age === 1 && r.c.hp === '30-2000'; }], ['âge +1, 30 % > 2 500 €, leviers au max', LHmax, function (r) { return r.c.age === 1 && r.c.hp === '30-2500'; }],
 ['âge +2, 30 % > 2 500 €, leviers de A2', LHa2, function (r) { return r.c.age === 2 && r.c.hp === '30-2500'; }], ['âge +2, 30 % > 2 000 €, leviers de A2', LHa2, function (r) { return r.c.age === 2 && r.c.hp === '30-2000'; }],
 ['strict (aucune zone à 100 %), âge +2, 30 % > 2 500 €', LS, function (r) { return r.c.age === 2 && r.c.hp === '30-2500'; }], ['âge inchangé (n\'importe quel levier)', LH, function (r) { return r.c.age === 0; }]].forEach(function (a) {
  var m = platMin(a[1], a[2]); log('- ' + a[0] + ' : ' + (m ? 'taux plat ' + pc1(m.plat) + ', socle ' + r0(m.socle) + ' € (t_max ' + pc1(m.tMax) + ')' : 'aucune combinaison'));
});
log('Âge inchangé, smicard non contraint : meilleur écart du smicard parmi les combinaisons stables (jeu socleHautSansSmic, âge 0) :');
var bestS = null; L0.forEach(function (r) { var e = sv.profils(r.c, r.tMax)[0].ecart; if (!bestS || e > bestS.e) bestS = { e: e, r: r }; });
log('- ' + sg(bestS.e) + ' € par mois (taux plat ' + pc1(bestS.r.plat) + ', socle ' + r0(bestS.r.socle) + ' €, hautes pensions ' + r0(S.HP[bestS.r.c.hp].taux * 100) + ' % > ' + S.HP[bestS.r.c.hp].seuil + ' €), contre −94 € sous toutes les contraintes de l\'auteur (§ 18.1 point 4)');
log('Droits de succession actuels : ' + fr(sv, 'socleHaut', { transmissions: ['actuels'] }).length + ' combinaison(s) stable(s) jusqu\'à 60 % de taux plat et 1 000 € de socle.');
log('');

log('### 8.2 Points de la frontière (leviers au maximum : économies 31 Md€ à 10 ans, création de valeur sauf P8) : contraintes de l\'auteur relâchées, dette, ménages');
var PK = Object.keys(S.PISTE_SOCLE).sort(function (a, b) { return S.PISTE_SOCLE[a].c.tPlat - S.PISTE_SOCLE[b].c.tPlat || a.localeCompare(b); });
function relaches(c) {
  var out = []; if (c.age > 0) out.push('âge de départ +' + c.age + ' an' + (c.age > 1 ? 's' : ''));
  if (S.HP[c.hp].seuil < 2500) out.push('retraités entre 2 000 et 2 500 € touchés'); return out.length ? out.join(' ; ') : 'aucune';
}
log('| # | taux plat | socle | t_max | zone à 100 % (€) | contraintes de l\'auteur relâchées | autres hypothèses favorables | dette/PIB 2065 (max) | productivité requise | smicard | médian | cadre 4 000 € | cadre 8 000 € |');
log('|---|---|---|---|---|---|---|---|---|---|---|---|---|');
var PD = {};
PK.forEach(function (id) {
  var pr = S.PISTE_SOCLE[id], k = sv.contraintes(pr.c, pr.jeu), e = sv.evaluer(pr.c, k.tMax), pf = sv.profils(pr.c, k.tMax), c = pr.c; PD[id] = { pr: pr, k: k, e: e, pf: pf };
  log('| ' + id + ' | ' + pc1(c.tPlat) + ' | ' + c.socle + ' € | ' + pc1(k.tMax) + ' | ' + (k.zone100 > 0 ? r0(k.zone100) : 'aucune') + ' | ' + relaches(c) + ' | économies ' + c.economies + ' Md€, transmissions 50 %, hautes pensions ' + r0(S.HP[c.hp].taux * 100) + ' % > ' + S.HP[c.hp].seuil + ' €' +
    (c.valeur === 'dix' ? ', création de valeur' : '') + ' (fragilité ' + r2(sv.fragilite(c)) + ') | ' + pc1(e.r2065) + ' (' + pc1(e.rMax) + ')' + (k.ok && e.stable ? '' : ' ⚠ NON STABLE OU NON ADMISSIBLE') + ' | ' + r2(100 * sv.seuilProductivite(c, k.tMax)) + ' % | ' + pf.slice(0, 4).map(function (x) { return sg(x.ecart); }).join(' | ') + ' |');
});
log('');
log('### 8.3 Retraités (€/mois, 2025, central, pension nette) : écart à la loi actuelle ; entre parenthèses l\'écart déjà présent au palier 1 de base (20 % > 2 500 €)');
log('| # | contraintes relâchées | 1 200 € | 2 000 € | 2 500 € | 3 000 € | 3 500 € | manque de la pension sur les prix par rapport au COR en 2045 (1 200 / 2 000 / 3 500 €) |');
log('|---|---|---|---|---|---|---|---|');
PK.forEach(function (id) {
  var c = S.PISTE_SOCLE[id].c, rt = sv.retraites(c), m = {}; rt.forEach(function (x) { m[x.pn] = x; });
  log('| ' + id + ' | ' + relaches(c) + ' | ' + [1200, 2000, 2500, 3000, 3500].map(function (pn) { return sg(m[pn].ecart) + ' (' + sg(m[pn].ecartRef) + ')'; }).join(' | ') + ' | ' + sg(m[1200].manqueCor2045) + ' / ' + sg(m[2000].manqueCor2045) + ' / ' + sg(m[3500].manqueCor2045) + ' |');
});
log('Lecture : le seuil de 2 500 € est la contrainte de l\'auteur ; les retraités à 1 200 et à 2 000 € ne perdent rien en euros courants dans toutes les combinaisons ; ceux à 2 500 € perdent 150 € quand la contribution commence à 2 000 €, rien quand elle commence à 2 500 €. Le « manque » vs COR est l\'indexation sur les prix (hypothèse de base du § 18, H186), pas une perte supplémentaire.');
log('');

log('### 8.4 Robustesse : un seul aléa à la fois, dette/PIB de 2065 ; âge : part de l\'effet net de l\'âge de départ retenue (H191 : assiette ajoutée probablement surestimée de 10 à 30 %)');
log('| # | ' + S.STRESS_ISOLES.map(function (z) { return z.libelle; }).join(' | ') + ' | effet de l\'âge ×0,9 | ×0,8 | ×0,7 |');
log('|---|' + S.STRESS_ISOLES.map(function () { return '---|'; }).join('') + '---|---|---|');
PK.forEach(function (id) {
  var d = PD[id], x = sv.stressIsoles(d.pr.c, d.k.tMax);
  log('| ' + id + ' | ' + x.map(function (z) { return pc(z.r2065) + (z.stable ? ' stable' : ''); }).join(' | ') + ' | ' + [0.9, 0.8, 0.7].map(function (f) { var q = S.solveur({ ageEffet: f }).evaluer(d.pr.c, d.k.tMax); return pc(q.r2065) + (q.stable ? ' stable' : ''); }).join(' | ') + ' |');
});
log('');
log('Frontière sous chaque aléa (plus petit taux plat et plus grand socle parmi les combinaisons stables et admissibles du jeu socleHaut, toute la grille de leviers) :');
[['central', {}, {}], ['taux de marché 4,5 %', { taux: 'haut' }, {}], ['productivité 0,4 %', {}, { prod: 'bas' }], ['réactions de comportement hautes seules', { reactions: 'haut' }, {}], ['socle indexé sur les salaires', { socle: 'salaires' }, {}], ['effet de l\'âge ×0,8', { ageEffet: 0.8 }, {}], ['effet de l\'âge ×0,7', { ageEffet: 0.7 }, {}]].forEach(function (z) {
  var Lz = S.solveur(z[1]).frontiereSocle('socleHaut', z[2]), mn = platMin(Lz, function () { return true; }), mx = null; Lz.forEach(function (r) { if (!mx || r.socle > mx.socle) mx = r; });
  log('- ' + z[0] + ' : ' + (mn ? 'taux plat minimal ' + pc1(mn.plat) + ' (socle ' + r0(mn.socle) + ' €) ; socle maximal ' + r0(mx.socle) + ' € à ' + pc1(mx.plat) : 'aucune combinaison stable jusqu\'à 60 % de taux plat et 1 000 € de socle'));
});
