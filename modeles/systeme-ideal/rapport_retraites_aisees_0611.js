// Rapport de la couche « contribution des retraités aisés » (retraites_aisees_0611.js, 06/11/2026, NON ADOPTÉE). Même liste que test_retraites_aisees_0611.js, ce fichier à la place du test ;
// sortie dans resultats_retraites_aisees_0611.txt (qui fait foi) ; la dernière ligne (EXPORT) est recopiée dans sources/calculs/bilan_global.py (dictionnaire RA0611).
var R = this.RetraitesAisees0611, T = this.Transmissions0611, X = this.BaremeV71, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 1 : n).replace('.', ','); }
function sg(x, n) { return (x > 0 ? '+' : '') + f(x, n); }
function e0(x) { var s = Math.round(Math.abs(x)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return (x < 0 ? '−' : '') + s; }
function se(x) { return (x > 0 ? '+' : '') + e0(x); }
function pc(x, n) { return f(100 * x, n === undefined ? 1 : n) + ' %'; }
var EXPORT = {};

log('# Contribution des retraités aisés (couche du 06/11/2026, NON ADOPTÉE)');
log('Retraités : ' + (R.S.nRetraites / 1e6).toFixed(1).replace('.', ',') + ' M ; pension nette moyenne 2025 (EIR 2020 × 1,155) : ' + e0(R.pensionMoyenne()) + ' €/mois ; part sous 1 500 / 2 000 / 2 500 € : ' + [1500, 2000, 2500].map(function (s) { return pc(R.partSous(s)); }).join(' / '));
EXPORT.controle = { n: R.S.nRetraites, moyenne: R.pensionMoyenne(), sous: [1500, 2000, 2500].map(function (s) { return R.partSous(s); }) };

log('\n## 1. Variantes : recette (Md€/an, croisière, favorable / central / défavorable, nette des comportements) et retraités concernés');
log('| Seuil (€ nets/mois) | Taux | Capital | Recette fav. / **central** / déf. | Statique (central) | dont capital (net ; statique) | Retraités concernés | Part de la masse des pensions |');
log('|---|---|---|---|---|---|---|---|');
var VAR = R.variantes();
VAR.forEach(function (v) {
  var r = v.r;
  log('| ' + e0(v.o.seuil) + ' | ' + pc(v.o.taux, 0) + ' | ' + (v.o.capital ? 'oui' : 'non') + ' | ' + f(r[0].net, 2) + ' / **' + f(r[1].net, 2) + '** / ' + f(r[2].net, 2) + ' | ' + f(r[1].statique, 2) + ' | ' + (v.o.capital ? f(r[1].capitalNet, 2) + ' ; ' + f(r[1].capitalStatique, 2) : '—') + ' | ' + f(r[1].concernes / 1e6, 2) + ' M (' + pc(r[1].partConcernes) + ') | ' + pc(r[1].partMassePensions, 2) + ' |');
});
EXPORT.variantes = VAR.map(function (v) { return { seuil: v.o.seuil, taux: v.o.taux, capital: v.o.capital, net: v.r.map(function (x) { return x.net; }), pension: v.r.map(function (x) { return x.pensionNette; }), capitalNet: v.r.map(function (x) { return x.capitalNet; }), statique: v.r[1].statique, concernes: v.r[1].concernes, part: v.r[1].partConcernes }; });

log('\n## 2. Cas types retraités (seul, 70 ans, sans capital ; revenu net santé, mutuelle comptée : prime individuelle ' + e0(R.casRetraite(1200, null).prime) + ' €/mois ; R1f de la combinaison) : écart au droit actuel, €/mois (%)');
log('| Variante | 1 200 € | 2 000 € | 3 000 € | 4 000 € | Part du gain de la mutuelle reprise à 3 000 / 4 000 € | Pension à partir de laquelle le retraité perd |');
log('|---|---|---|---|---|---|---|');
function ligneCas(lib, o) {
  var c = R.CAS.map(function (pn) { return R.casRetraite(pn, o); }), b = o ? R.pensionBascule(o) : null;
  log('| ' + lib + ' | ' + c.map(function (x) { return se(x.ecartNet) + ' (' + f(100 * x.pctNet, 1) + ' %)'; }).join(' | ') + ' | ' + (o ? pc(c[2].partGainRepris, 0) + ' / ' + pc(c[3].partGainRepris, 0) : '—') + ' | ' + (b ? e0(b) + ' €' : '—') + ' |');
  return { cas: c.map(function (x) { return { pn: x.pn, ecart: x.ecartNet, pct: x.pctNet, contribution: x.contribution, r1f: x.r1f }; }), bascule: b };
}
EXPORT.cas = { sans: ligneCas('Sans contribution (base, JR)', null) };
R.HYP.seuils.forEach(function (s) { R.HYP.taux.forEach(function (t) { EXPORT.cas[s + '_' + t] = ligneCas(e0(s) + ' €, ' + pc(t, 0), { seuil: s, taux: t }); }); });
log('Garde-fou vérifié : sous le seuil, l\'écart est celui de la base (+' + e0(R.casRetraite(1200, null).ecartNet) + ' €), aucun retraité ne perd par rapport à aujourd\'hui (test).');

log('\n## 3. Option « avec capital » : retraité seul à 3 000 € de pension et 500 000 € de patrimoine financier (15 000 €/an de revenus du capital)');
var tm = R.marginalCapital(3000);
log('Marginal de la fonction des revenus sur son capital (base) : ' + pc(tm) + ' (PFU actuel : 31,4 %).');
log('| Seuil, taux | Contribution sur la pension | Contribution sur le capital | Marginal total sur un intérêt ou un loyer | Sur 1 € de bénéfice distribué : crédit d\'IS entier ; 50 % |');
log('|---|---|---|---|---|');
EXPORT.capitalCas = [];
[[2000, 0.2], [2500, 0.2], [2500, 0.3]].forEach(function (z) {
  var o = { seuil: z[0], taux: z[1], capital: true }, c = R.contributionIndiv(3000, R.HYP.capitalCas, o), mi = tm + z[1], d1 = 0.25 + tm - 0.25 + 0.75 * z[1], d5 = 0.25 + tm - 0.125 + 0.75 * z[1];
  log('| ' + e0(z[0]) + ' €, ' + pc(z[1], 0) + ' | ' + e0(c.pension) + ' €/mois | ' + e0(c.capital) + ' €/mois | ' + pc(mi) + ' | ' + pc(d1) + ' ; ' + pc(d5) + ' |');
  EXPORT.capitalCas.push({ seuil: z[0], taux: z[1], pension: c.pension, capital: c.capital, marginalInteret: mi, dividendeC1: d1, dividendeC50: d5 });
});

log('\n## 4. Jeux combinés (macro de référence, dette stable ; transmissions A = 300 000 €, impôt de suite « court terme », patrimoine +2,28, économies de fonctionnement 0,45)');
var JEUX = [
  { id: 'JR', lib: 'JR rejoué (sans contribution, sans économies)', o: { contrib: null, c: 0.5, eco: 0 } },
  { id: 'JRE', lib: 'JR + économies de fonctionnement (0,45)', o: { contrib: null, c: 0.5 } },
  { id: 'RA20', lib: 'contribution 2 500 €, 20 %, pension seule ; crédit 50 %', o: { contrib: { seuil: 2500, taux: 0.2, capital: false }, c: 0.5 } },
  { id: 'RA20c1', lib: 'contribution 2 500 €, 20 %, avec capital ; crédit d\'IS entier', o: { contrib: { seuil: 2500, taux: 0.2, capital: true }, c: 1 } },
  { id: 'RA2000', lib: 'contribution 2 000 €, 20 %, avec capital ; crédit 50 %', o: { contrib: { seuil: 2000, taux: 0.2, capital: true }, c: 0.5 } },
  { id: 'RA30', lib: 'contribution 2 500 €, 30 %, avec capital ; crédit 50 %', o: { contrib: { seuil: 2500, taux: 0.3, capital: true }, c: 0.5 } },
  { id: 'JRR', lib: '**recommandé : contribution 2 500 €, 20 %, avec capital ; crédit 50 %**', o: { contrib: { seuil: 2500, taux: 0.2, capital: true }, c: 0.5 } }
];
log('| Jeu | Réglage | a | Revenus | Transmissions | Crédit | Contribution | Effet total | Manque restant (réf. ; prudente) | Cadre 5 000 | Cadre 10 000 | Cadre 20 000 |');
log('|---|---|---|---|---|---|---|---|---|---|---|---|');
var JX = JEUX.map(function (z) {
  var j = R.jeu(z.o), c = j.cas;
  log('| ' + z.id + ' | ' + z.lib + ' | ' + f(j.a, 4) + ' | ' + f(j.revenus, 2) + ' | ' + f(j.transmissions, 2) + ' | ' + f(j.credit, 2) + ' | ' + f(j.contribution, 2) + ' | ' + f(j.effet + j.contribution * 0, 2) + ' | ' + f(j.manque.reference, 1) + ' ; ' + f(j.manque.prudente, 1)
      + ' | ' + se(c.cadre_5000.ecartNet) + ' (' + f(100 * c.cadre_5000.pctNet, 1) + ' %) | ' + se(c.cadre_10000.ecartNet) + ' (' + f(100 * c.cadre_10000.pctNet, 1) + ' %) | ' + se(c.cadre_20000.ecartNet) + ' (' + f(100 * c.cadre_20000.pctNet, 1) + ' %) |');
  return { id: z.id, j: j };
});
log('(« Effet total » = revenus + transmissions + crédit + patrimoine + économies + contribution, rendu par transmissions_0611.js ; il égale le manque de la base, ' + f(JX[0].j.manque0, 2) + ' Md€.)');

log('\n## 5. Cas types du jeu recommandé (revenu net santé, mutuelle comptée, mode salaire, central), écart au droit actuel, €/mois (%)');
var jr = JX[0].j, rr = JX[JX.length - 1].j, r1 = JX[3].j;
log('| Cas type | Aujourd\'hui (net santé) | JR | **Recommandé** | Variante crédit entier |');
log('|---|---|---|---|---|');
var IDS = ['smic_seul', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'rentier_div_5000'];
var TAB = [];
IDS.forEach(function (id) {
  var a = jr.cas[id], b = rr.cas[id], c = r1.cas[id];
  log('| ' + a.libelle + ' | ' + e0(a.avantNet) + ' | ' + se(a.ecartNet) + ' (' + f(100 * a.pctNet, 1) + ' %) | **' + se(b.ecartNet) + ' (' + f(100 * b.pctNet, 1) + ' %)** | ' + se(c.ecartNet) + ' (' + f(100 * c.pctNet, 1) + ' %) |');
  TAB.push({ id: id, avantNet: a.avantNet, jr: a.ecartNet, jrPct: a.pctNet, reco: b.ecartNet, recoPct: b.pctNet, c1: c.ecartNet, c1Pct: c.pctNet });
});
R.CAS.forEach(function (pn, i) {
  var a = jr.retraites[i], b = rr.retraites[i], c = r1.retraites[i];
  log('| Retraité seul, ' + e0(pn) + ' € nets, 70 ans | ' + e0(a.avantNet) + ' | ' + se(a.ecartNet) + ' (' + f(100 * a.pctNet, 1) + ' %) | **' + se(b.ecartNet) + ' (' + f(100 * b.pctNet, 1) + ' %)** | ' + se(c.ecartNet) + ' (' + f(100 * c.pctNet, 1) + ' %) |');
  TAB.push({ id: 'retraite_' + pn, avantNet: a.avantNet, jr: a.ecartNet, jrPct: a.pctNet, reco: b.ecartNet, recoPct: b.pctNet, c1: c.ecartNet, c1Pct: c.pctNet });
});
var cc = R.contributionIndiv(3000, R.HYP.capitalCas, { seuil: 2500, taux: 0.2, capital: true });
log('Retraité à 3 000 € avec 15 000 €/an de revenus du capital : contribution de ' + e0(cc.total) + ' €/mois (' + e0(cc.pension) + ' sur la pension, ' + e0(cc.capital) + ' sur le capital), en plus de la fonction des revenus et de la fonction du patrimoine.');

EXPORT.jeux = JX.map(function (x) { var j = x.j; return { id: x.id, a: j.a, revenus: j.revenus, transmissions: j.transmissions, credit: j.credit, contribution: j.contribution, eco: j.eco, effet: j.effet, manque: j.manque, manque0: j.manque0,
  cadre5000: j.cas.cadre_5000.ecartNet, cadre10000: j.cas.cadre_10000.ecartNet, pct10000: j.cas.cadre_10000.pctNet, cadre20000: j.cas.cadre_20000.ecartNet, pct20000: j.cas.cadre_20000.pctNet,
  smic: j.cas.smic_seul.ecartNet, c2s2e: j.cas.couple_2smic_2enf.ecartNet }; });
EXPORT.reco = { seuil: 2500, taux: 0.2, capital: true, c: 0.5, r: R.trois({ seuil: 2500, taux: 0.2, capital: true }).map(function (x) { return { net: x.net, pension: x.pensionNette, capital: x.capitalNet, concernes: x.concernes }; }) };
EXPORT.tableau = TAB;

log('\n## 6. Trois scénarios (demande de l\'auteur, 06/11/2026)');
var S1 = R.scenarioS1(), S2 = R.scenarioS2(), S3 = R.scenarioS3();
log('S1 : marge de neutralité de la base de travail par rapport au droit actuel (dette / PIB de la réforme jamais au-dessus de celle du droit actuel pendant 30 ans, macro de référence) : ' + f(S1.marge, 2) + ' Md€/an.');
log('S3 : effet en régime des leviers montés de 2029 à 2038 : ' + f(S3.F, 2) + ' Md€/an (S2 : ' + f(S2.j.effet, 2) + ') ; dont non-remplacement d\'un départ sur deux en plus de M1m : ' + f(S3.m1fEnPlus, 2) + ' Md€ en 2040 ; marge de neutralité à la bascule : ' + f(S3.neutreBascule, 2) + ' Md€ (≥ 0 : neutre) ; pic de la dette : ' + pc(S3.pic) + ' en ' + S3.picAn + '.');
log('\n### 6.1 Recette par levier (Md€/an en régime, central)');
log('| Levier | S1 (aucun levier) | S1 au plus juste | S2 dette stable | S3 neutre puis stable en 2038 |');
log('|---|---|---|---|---|');
function L(lib, a, b, c, d) { log('| ' + lib + ' | ' + a + ' | ' + b + ' | ' + c + ' | ' + d + ' |'); }
L('Base de travail (BT01-BT14, corrections T65)', 'incluse', 'incluse', 'incluse', 'incluse');
L('Économies R1f, M1m (S3 : M1f), M2m, M3', 'non', 'non', 'oui', 'oui (M1f : +' + f(S3.m1fEnPlus, 1) + ' en 2040)');
L('Fonction des revenus (a ; recette)', '0,65 ; 0', f(S1.plusJuste.a, 4) + ' ; ' + f(S1.plusJuste.revenus, 2), f(S2.j.a, 4) + ' ; ' + f(S2.j.revenus, 2), f(S3.a, 4) + ' ; ' + f(S3.revenus, 2));
L('Transmissions (A = 300 000 €) et impôt de suite', '0', '0', f(S2.j.transmissions, 2), f(S3.transmissions, 2));
L('Impôt de suite sur le patrimoine', '0', '0', f(S2.j.patrimoineNat, 2), f(S3.patrimoineNat, 2));
L('Crédit d\'IS à 50 %', '0', '0', f(S2.j.credit, 2), f(S3.credit, 2));
L('Contribution des retraités aisés (2 500 €, 20 %, avec capital)', '0', '0', f(S2.j.contribution, 2), f(S3.contribution, 2));
L('Économies de fonctionnement (niveau 1 ; S3 : + niveau 2)', '0', '0', f(S2.j.eco, 2), f(S3.eco, 2));
L('**Total des leviers ajoutés à la base**', '0', f(-S1.marge, 2), f(S2.j.effet, 2), f(S3.F, 2) + ' (en rampe)');
L('Prélèvements obligatoires officiels ; élargis (% du PIB)', pc(S1.base.po.pct) + ' ; ' + pc(S1.base.po.elargisPct), pc(S1.plusJuste.po.pct) + ' ; ' + pc(S1.plusJuste.po.elargisPct), pc(S2.po.pct) + ' ; ' + pc(S2.po.elargisPct), pc(S3.po.pct) + ' ; ' + pc(S3.po.elargisPct));
log('(Aujourd\'hui : 42,7 % ; 44,2 % élargis.)');
log('\n### 6.2 Cas types (revenu net santé, mutuelle comptée, central), écart au droit actuel, €/mois (%)');
log('| Cas type | Aujourd\'hui | S1 | S1 au plus juste | S2 | S3 (en régime, 2038) |');
log('|---|---|---|---|---|---|');
var SC = [S1.base.r, S1.plusJuste.r, S2.r, S3.r], TABS = [];
['smic_seul', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'rentier_div_5000'].forEach(function (id) {
  var a = S1.base.r.cas[id];
  log('| ' + a.libelle + ' | ' + e0(a.avantNet) + ' | ' + SC.map(function (z) { var c = z.cas[id]; return se(c.ecartNet) + ' (' + f(100 * c.pctNet, 1) + ' %)'; }).join(' | ') + ' |');
  TABS.push({ id: id, avant: a.avantNet, v: SC.map(function (z) { return z.cas[id].ecartNet; }), p: SC.map(function (z) { return z.cas[id].pctNet; }) });
});
R.CAS.forEach(function (pn, i) {
  log('| Retraité seul, ' + e0(pn) + ' € nets, 70 ans | ' + e0(S1.base.r.retraites[i].avantNet) + ' | ' + SC.map(function (z) { var c = z.retraites[i]; return se(c.ecartNet) + ' (' + f(100 * c.pctNet, 1) + ' %)'; }).join(' | ') + ' |');
  TABS.push({ id: 'retraite_' + pn, avant: S1.base.r.retraites[i].avantNet, v: SC.map(function (z) { return z.retraites[i].ecartNet; }), p: SC.map(function (z) { return z.retraites[i].pctNet; }) });
});
log('(S1 : pas de R1f, pas de contribution ; S2 et S3 : R1f et contribution des retraités aisés.)');
log('\n### 6.3 Trajectoire de la dette / PIB (macro de référence, central ; déficit public en % du PIB entre parenthèses)');
log('| Année | Droit actuel | S1 | S1 au plus juste | S2 | S3 |');
log('|---|---|---|---|---|---|');
var TJ = [S1.actuel, S1.base.traj, S1.plusJuste.traj, S2.traj, S3.traj], ANS = [];
for (var y = 2029; y <= 2058; y++) if (y <= 2045 || y % 5 === 3) ANS.push(y);
log('| fin 2028 | ' + pc(S1.actuel.ratio0) + ' | ' + TJ.slice(1).map(function (t) { return pc(t.ratio0); }).join(' | ') + ' |');
ANS.forEach(function (y) { var i = y - 2029; log('| ' + y + ' | ' + TJ.map(function (t) { return pc(t.ratio[i]) + ' (' + f(100 * t.deficit[i], 1) + ')'; }).join(' | ') + ' |'); });
EXPORT.scenarios = { S1: { marge: S1.marge, a: S1.base.a, po: S1.base.po, aPlus: S1.plusJuste.a, revenusPlus: S1.plusJuste.revenus, poPlus: S1.plusJuste.po },
  S2: { a: S2.j.a, effet: S2.j.effet, po: S2.po, prel: S2.prel }, S3: { F: S3.F, a: S3.a, revenus: S3.revenus, credit: S3.credit, transmissions: S3.transmissions, contribution: S3.contribution, eco: S3.eco, pic: S3.pic, picAn: S3.picAn, neutre: S3.neutreBascule, po: S3.po, m1f: S3.m1fEnPlus },
  cas: TABS, traj: { annees: ANS, actuel: S1.actuel.ratio, S1: S1.base.traj.ratio, S1p: S1.plusJuste.traj.ratio, S2: S2.traj.ratio, S3: S3.traj.ratio, defS3: S3.traj.deficit, defS2: S2.traj.deficit, r0: S2.traj.ratio0 } };
log('\nEXPORT ' + JSON.stringify(EXPORT));
