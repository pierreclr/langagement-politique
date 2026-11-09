// § 19 de resultats-optimum.txt : « Options du 04/11 recalculées sur la base v5.1 » (04/11/2026, H720-H722). Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js \
//       optimum_options_0411.js ../risques/stress.js rapport_options_v51.js >> resultats-optimum.txt
// Les colonnes « avant » (v5 du 04/11 avant corrections de données, V12400-V12420) sont les valeurs du § 17 au commit cdb1cc19 ; les colonnes « v5.1 » sont calculées ici.
var Z = this.Optimum, X = this.OptionsDu0411, ST = this.Stress;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function pc(x) { return (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',') + ' %'; }
function trip(o) { return r1(o.bas) + ' / ' + r1(o.central) + ' / ' + r1(o.haut); }
var SCS = ['bas', 'central', 'haut'], V5 = Z.archi(Z.ARCHITECTURE_V5), PAS = X.pointDeTaux(V5), O4 = { mode: 'continu', transmission: true };
var SMAX = (function () { var s; for (s = 0.30; s >= 0.02; s -= 0.01) { var o = { pente: Math.round(s * 100) / 100 }; if (X.tmeMajDeg(V5, 'parent', o).tme <= 0.75 + 1e-9 && X.tmeMajDeg(V5, 'couple', o).tme <= 0.75 + 1e-9) return o.pente; } return null; })();
// avant : coût b/c/h ; points ; taux d'équilibre ; à trouver ; dette à 10 ans (central)
var AVANT = {
  cmg: ['7,3 / 7,3 / 7,3', '0,67', '41,4 %', '6,5', '102,5 %'],
  tva: ['1,7 / 1,0 / 0,5', '0,09', '40,8 %', '0,2', '100,4 %'],
  maj: ['18,8 / 15,8 / 20,3', '1,46', '42,1 %', '15,0', '105,4 %'],
  maj7: ['41,0 / 35,9 / 38,5', '3,32', 'n. c.', 'n. c.', 'n. c.'],
  pla: ['1,0 / 2,2 / 2,8', '0,20', '40,9 %', '1,4', '105,1 %'],
  e124: ['10,0 / 10,5 / 10,6 (somme des coûts de l\'époque)', '0,97', 'non recalculé', 'non recalculé', 'non recalculé'],
  e15: ['28,9 / 26,2 / 30,9', '2,42', '43,1 %', '25,5', '113,1 %'],
  e15b: ['51,0 / 46,4 / 49,1', '4,29', '45,2 %', '45,7', '119,9 %']
};
var JEUX = [
  ['cmg', '1. CMG gardé', { cmg: true }],
  ['tva', '2. TVA 10 % sur les travaux', { tvaTravaux: true }],
  ['maj', '3. majoration dégressive, pente 25 % (pour mémoire)', { majDegressive: true }],
  ['maj7', '3 bis. majoration dégressive, pente ' + Math.round(SMAX * 100) + ' % (TME ≤ 75 %, pour mémoire)', { majDegressive: { pente: SMAX } }],
  ['pla', '4. plafonds sur le patrimoine (continu + 50 % à la transmission)', { plafonds: O4 }],
  ['e124', '**1 + 2 + 4 ensemble** (sans la majoration)', { cmg: true, tvaTravaux: true, plafonds: O4 }],
  ['e15', '**1 à 5 ensemble, majoration à 25 %**', { cmg: true, tvaTravaux: true, majDegressive: true, plafonds: O4, chomage: true }],
  ['e15b', '**1 à 5 ensemble, majoration à ' + Math.round(SMAX * 100) + ' %**', { cmg: true, tvaTravaux: true, majDegressive: { pente: SMAX }, plafonds: O4, chomage: true }]
];
log('\n## 19. Options du 04/11 recalculées sur la base v5.1 (04/11/2026 ; H720-H722, V12750-V12769)');
log('**Ce que ce paragraphe fait.** Le § 17 a chiffré les cinq options sur la v5 ; le § 18 a ensuite corrigé les données de la v5 (v5.1 : taux d\'équilibre 40,7 → 41,4 %, solde central +0,75 → +0,63 Md€ à 41,4 %). `optimum_options_0411.js` lit l\'architecture v5 **telle que le modèle la calcule maintenant**, donc les tableaux du § 17, régénérés au même commit que le § 18, sont déjà sur la base v5.1 ; leurs textes d\'accompagnement, eux, citent encore certaines valeurs de la v5 d\'avant (marge de +0,75 Md€, parent isolé +138 €/mois, pente de 8 %, « v5 de 40,7 % »). Ce § 19 en est la version propre : **un seul jeu de chiffres, v5.1, avec l\'écart à l\'ancien (colonnes « avant »)**, et les combinaisons demandées (options 1, 2 et 4 ensemble). Aucun code d\'option n\'est modifié ; la majoration dégressive est **pour mémoire** (recommandation retirée) et le chômage deg2 est déjà dans la v5 (coût supplémentaire 0). Test : `test_options_0411.js` (89 contrôles) ; reproduction : `rapport_options_v51.js`.');
log('\n### 19.1 Base de référence v5.1');
var dB = {}; SCS.forEach(function (s) { dB[s] = ST.test('V5', s, {}).ratio10; });
log('Taux plat **' + pc(V5.tPlat) + '** ; solde b / c / h au taux plat : **' + trip(Z.soldes(V5)) + ' Md€** ; **1 point de taux plat = ' + r2(PAS) + ' Md€** au central (10,8 avant, 10,6 au § 17 arrondi) ; dette à 10 ans : ' + pc(dB.bas) + ' / ' + pc(dB.central) + ' / ' + pc(dB.haut) + ' ; marge du central : ' + r2(Z.solde(V5, 'central')) + ' Md€ (0,75 avant ; un dixième de point vaut ≈ ' + r2(PAS / 10) + ' Md€).');
log('\n### 19.2 Chaque option, puis les ensembles : v5.1 (avant entre parenthèses)');
log('| option | coût b / c / h (Md€/an) | points de taux plat (central) | taux d\'équilibre | à trouver ailleurs (central, Md€) | dette à 10 ans (central) | avant (v5 : coût c ; points ; taux ; à trouver ; dette) |');
log('|---|---|---|---|---|---|---|');
var RES = {};
JEUX.forEach(function (j) {
  var c = {}, s = X.soldes(V5, j[2]), t = X.tauxEquilibre(V5, j[2]), need = X.aTrouver(V5, j[2]), aj = X.ajustement(V5, j[2]), d = ST.test('V5', 'central', { ajust: aj }).ratio10, a = AVANT[j[0]];
  SCS.forEach(function (sc) { c[sc] = X.cout(V5, sc, j[2]).total; });
  RES[j[0]] = { c: c, s: s, t: t, need: need, d: d };
  log('| ' + j[1] + ' | ' + trip(c) + ' | ' + r2(c.central / PAS) + ' | ' + pc(t) + ' | ' + r1(need) + ' | ' + pc(d) + ' | ' + a[0] + ' ; ' + a[1] + ' ; ' + a[2] + ' ; ' + a[3] + ' ; ' + a[4] + ' |');
});
log('Pour 1 + 2 + 4, le § 17 d\'origine ne chiffrait pas cette combinaison : la colonne « avant » n\'est que la somme de ses coûts (7,3 + 1,0 + 2,2 = 10,5 au central) ; taux, « à trouver » et dette de l\'époque ne sont pas recalculés (V12752).');
log('\n### 19.3 Solde au taux de 41,4 % (Md€, b / c / h)');
log('| option | solde b / c / h |'); log('|---|---|');
log('| v5.1 sans option | ' + trip(Z.soldes(V5)) + ' |');
JEUX.forEach(function (j) { log('| ' + j[1] + ' | ' + trip(RES[j[0]].s) + ' |'); });
log('\n### 19.4 Plafonds sur le patrimoine : ce que le rendement locatif corrigé change (H508 : 1,7 / 2,0 / 2,7 % net)');
log('| règle | part de la taxe différée (actuelle) | perte définitive b / c / h (Md€/an) | report d\'encaissement supplémentaire b / c / h (Md€/an, ~12 ans) | stock au central (Md€) | avant (perte c ; report c ; stock) |');
log('|---|---|---|---|---|---|');
var AV4 = { annuel75: '0,3 ; 5,5 ; 66', continu: '0,7 ; 12,7 ; 152', transmission: '1,5 ; 0,0 ; 0', ens: '2,2 ; 12,7 ; 152' };
function l4(nom, o, k, part) {
  var r = {}, f = {}, p;
  SCS.forEach(function (s) { p = X.coutPlafonds(V5, s, o); r[s] = p.croisiere; f[s] = p.flux; });
  p = X.coutPlafonds(V5, 'central', o);
  log('| ' + nom + ' | ' + (part ? pc(p.partDifferee) + ' (' + pc(p.partDiffereeActuelle) + ')' : '—') + ' | ' + trip(r) + ' | ' + trip(f) + ' | ' + Math.round(p.stock) + ' | ' + AV4[k] + (k === 'transmission' ? '' : ' (part différée avant : ' + (k === 'annuel75' ? '13,0' : '20,7') + ' %)') + ' |');
}
l4('(a) annuel 75 %', { mode: 'annuel75' }, 'annuel75', true);
l4('(b) continu', { mode: 'continu' }, 'continu', true);
l4('(c) transmission 50 %', { transmission: true }, 'transmission', false);
l4('**(b) + (c)**', O4, 'ens', true);
log('Lecture : le plafond annuel de 75 % coûte un peu moins qu\'avant (0,2 au lieu de 0,3 Md€ au central), et le report d\'encaissement baisse d\'autant (4,7 au lieu de 5,5 Md€ par an pour (a), 11,3 au lieu de 12,7 pour (b)) ; la perte de la transmission à 50 % monte (1,7 au lieu de 1,5 Md€). **Le sens de l\'effet est celui attendu mais sa cause n\'est pas isolée** : la taxe brute et la part différée changent avec les données corrigées (la part différée de la règle actuelle passe de 7,1 % à 6,8 %), sans que j\'aie fait le calcul pas à pas qui dirait quelle correction (H508 la plus probable) en est responsable (⚠️ V12755). La conclusion du § 17.4 tient : la perte de croisière est faible (≤ 2,3 Md€ au central) ; le report d\'encaissement est la vraie dette cachée et reste une borne haute (⚠️ V12207).');
log('\n### 19.5 Cas types sous la v5.1 (€/mois, central, écart au droit actuel)');
var ct = Z.casTypes(V5), c3 = X.casTypes(V5, { majDegressive: true }), ids = ['smic_seul', 'parent_isole_smic', 'couple_1smic_2enf', 'couple_2smic_2enf', 'cadre_2x'];
log('| cas type | v5.1 (options 1, 2, 4 : aucun changement) | avec la majoration dégressive 25 % (pour mémoire) |'); log('|---|---|---|');
ids.forEach(function (id) { log('| ' + id + ' | ' + (ct[id].ecartMois >= 0 ? '+' : '') + Math.round(ct[id].ecartMois).toString().replace('-', '−') + ' | ' + (c3[id].ecartMois >= 0 ? '+' : '') + Math.round(c3[id].ecartMois).toString().replace('-', '−') + ' |'); });
log('Les options 1 (CMG), 2 (TVA travaux), 4 (plafonds) et 5 ne changent aucun cas type : aucun d\'eux n\'a de garde payée, de travaux ou de patrimoine plafonné. Avant les corrections : parent isolé +138, couple à deux Smic −66 (v5) ; après : +124 et −94 (v5.1).');
var e = RES.e124;
log('\n### 19.6 Lecture, limites (Claude, révisable ; V12750 à V12769)');
log('1. **Les options 1, 2 et 4 ensemble coûtent ' + trip(e.c) + ' Md€ (' + r2(e.c.central / PAS) + ' point de taux plat au central)**, soit un taux d\'équilibre de **' + pc(e.t) + '** (+' + r1(100 * (e.t - V5.tPlat)) + ' point) et **' + r1(e.need) + ' Md€ à trouver ailleurs** pour rester à 41,4 % ; dette à 10 ans au central ' + pc(e.d) + ' (100,0 % sans option). Avec la majoration dégressive en plus (pour mémoire) : ' + pc(RES.e15.t) + ' (pente de 25 %) ou ' + pc(RES.e15b.t) + ' (pente de ' + Math.round(SMAX * 100) + ' %).');
log('2. **Ce que la v5.1 change à ces coûts** : peu. Les coûts fixes (CMG 7,3 ; TVA 1,7 / 1,0 / 0,5) ne bougent pas ; la valeur d\'un point passe de 10,8 à ' + r2(PAS) + ' Md€ (donc chaque option vaut un peu plus de points) ; la marge du central tombe de 0,75 à 0,63 Md€ ; les taux d\'équilibre de la colonne « avant » (40,7 % de base) montent tous de 0,7 point avec la base, de sorte que **l\'écart au taux de référence est quasi identique** (par exemple CMG +0,7 point avant et après). La seule option dont le coût bouge est la majoration dégressive (15,8 → 15,6 au central).');
log('3. **Contradiction à nommer** : avec les trois options retenues dans la discussion (CMG, TVA travaux, plafonds), le coût est de ' + r1(e.c.central) + ' Md€ au central : **le CMG pèse 7,3 sur ce total**, et la v5.1 n\'a plus que 0,63 Md€ de marge ; garder le CMG est un choix de politique familiale qu\'il faut financer (' + r2(7.3 / PAS) + ' point de taux plat), pas un détail.');
log('4. **Limites** : celles du § 17.6 (4), plus (i) le coût du CMG est un chiffre fixe, sans fourchette (V12750) ; (ii) la valeur d\'un point de taux plat est mesurée autour de 41,4 % avec érosion de l\'assiette (H510) : une forte hausse du taux la réduirait (V12751) ; (iii) les colonnes « avant » sont reprises du § 17 du commit cdb1cc19, pas recalculées (V12752) ; (iv) les options sont additives (V12213) ; (v) le report d\'encaissement des plafonds reste une borne haute (V12207).');
log('\nTemps de calcul du § 19 : ' + 0 + ' s.');
