// Rapport de la couche DECISIONS0711 (decisions_0711.js) : le système arrêté du 07/11/2026. Liste de rapport_consolidation_0611.js sans le rapport, puis decisions_0711.js et ce fichier ;
// sortie dans resultats_decisions_0711.txt (qui fait foi) ; la dernière ligne (EXPORT) est recopiée dans sources/calculs/bilan_global.py (dictionnaire DECISIONS0711).
var D = this.Decisions0711, K = this.Consolidation0611, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 2 : n).replace('.', ','); }
function pc(x, n) { return f(100 * x, n === undefined ? 1 : n) + ' %'; }
var EX = { date: '2026-11-07' };

log('# Système arrêté du 07/11/2026 (couche DECISIONS0711) : résultats');
log('');
// 1. Courbe des pensions
var c = D.courbe(), o = c.o;
EX.courbe = { o: o, cible: c.cible, r: [0, 1, 2].map(function (k) { return D.recettePension(o, k); }) };
log('## 1. Courbe des pensions (arbitrage 59)');
log('C_p(P) = ' + f(o.m, 4) + ' × [(P − ' + o.Pg + ') − ' + o.K + ' × (1 − e^(−(P − ' + o.Pg + ')/' + o.K + '))] au-dessus de ' + o.Pg + ' € nets par mois ; 0 en dessous');
log('recette nette fav. / central / déf. : ' + EX.courbe.r.map(function (r) { return f(r.net); }).join(' / ') + ' Md€ (cible = contribution de 20 % au-dessus de 2 500 €, pension seule : ' + f(c.cible) + ') ; retraités concernés ' + f(EX.courbe.r[1].concernes / 1e6, 2) + ' M (' + pc(EX.courbe.r[1].partConcernes) + ') ; part de la masse des pensions ' + pc(EX.courbe.r[1].partMasse, 2));
EX.variantesPension = D.variantesPension().map(function (x) { return { o: x.o, net: x.r[1].net, part: x.r[1].partConcernes }; });
log('variantes à recette égale : ' + EX.variantesPension.map(function (x) { return 'seuil ' + x.o.Pg + ' € → m_p = ' + f(x.o.m, 3) + ' (' + pc(x.part) + ' concernés)'; }).join(' ; '));
EX.pensions = [1200, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 10000].map(function (P) { var r = D.casRetraite(P, o); return { P: P, courbe: r.courbe, c20: r.contribution20, r1f: r.r1f, ecart: r.ecartNet, pct: r.pctNet, marg: D.marginalP(P, o), margCap: D.marginalCapitalRetraite(P) }; });
log('| Pension nette (€/mois) | Courbe C_p | Contribution 20 % > 2 500 € | Marginal de la courbe | R1f | Écart revenu net santé (courbe + R1f) | Marginal sur un euro de capital (fonction des revenus) |');
log('|---|---|---|---|---|---|---|');
EX.pensions.forEach(function (x) { log('| ' + x.P + ' | ' + f(x.courbe, 0) + ' | ' + f(x.c20, 0) + ' | ' + pc(x.marg) + ' | ' + f(x.r1f, 0) + ' | ' + f(x.ecart, 0) + ' (' + pc(x.pct) + ') | ' + pc(x.margCap) + ' |'); });
EX.bascule = D.pensionBascule(o);
log('pension à partir de laquelle on perd (R1f compris, mutuelle comptée) : ' + f(EX.bascule, 0) + ' €');
log('');
// 2. TVA
var t = D.tva();
EX.tva = { lignes: t.lignes.map(function (l) { return { id: l.id, v: l.v, actuel: l.actuel, zero: l.zero[1] }; }), total: t.total, totalActuel: t.totalActuel, cas: D.tvaCasTypes() };
log('## 2. TVA 5 / 10 / 20 % (arbitrage 62)');
log('| N° | Poste | Écart au solde de la base (qui comptait le 0 %) fav. / central / déf. | Écart au droit actuel (central) | Coût du 0 % (N17, central) |');
log('|---|---|---|---|---|');
t.lignes.forEach(function (l) { log('| ' + l.id + ' | ' + l.lib + ' | ' + l.v.map(function (x) { return f(x, 3); }).join(' / ') + ' | ' + f(l.actuel[1], 3) + ' | ' + f(l.zero[1], 3) + ' |'); });
log('| | Total | ' + t.total.map(function (x) { return f(x, 3); }).join(' / ') + ' | ' + f(t.totalActuel[1], 3) + ' | |');
log('cas types (dépense d\'alimentation hors viande et poisson, €/mois ; coût du 5 % par rapport au 0 % ; par rapport au droit actuel) : ' + EX.tva.cas.map(function (x) { return x.id + ' ' + f(x.depense, 0) + ' € ; ' + f(x.vsZero, 1) + ' ; ' + f(x.vsActuel, 1); }).join(' | '));
log('');
// 3. Lignes et S3
log('## 3. Lignes de la couche et scénario S3 selon le budget de la garantie de transition');
EX.lignes = {}; EX.S3 = {}; EX.S3pru = {}; EX.reprise = {}; EX.sensib = null; EX.defaut = D.HYP.defaut;
var IDS = ['smic_seul', 'parent_isole_smic', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'rentier_div_5000'];
function resume(s) {
  var r = { F: s.F, a: s.a, effetCouche: s.effetCouche, revenus: s.revenus, credit: s.credit, transmissions: s.transmissions, patrimoineNat: s.patrimoineNat, pension: s.pension, eco: s.eco,
            po: s.po, traj: s.traj.ratio.slice(0, 31), def: s.traj.deficit.slice(0, 31), pic: s.pic, picAn: s.picAn, dep3: s.dep3, neutre: s.neutre,
            pru: s.trajPrudente.ratio.slice(0, 31), cas: {}, retraites: s.retraites.map(function (x) { return { pn: x.pn, avant: x.avantNet, v: x.ecartNet, p: x.pctNet, courbe: x.courbe, r1f: x.r1f }; }) };
  IDS.forEach(function (id) { var x = s.cas[id]; r.cas[id] = { avant: x.avantNet, v: x.ecartNet, p: x.pctNet }; });
  return r;
}
['gtc_droite', 'a', 'b', 'c'].forEach(function (v) {
  var s = D.s3(v), p = D.prudente(v), q = D.s3(v, { avecReprise: v !== 'gtc_droite' });
  EX.lignes[v] = s.lignes.map(function (l) { return { id: l.id, poste: l.poste, v: l.v, sens: l.sens, cote: l.cote }; });
  EX.S3[v] = resume(s); EX.S3pru[v] = { F: p.F, a: p.a, traj: p.traj.ratio.slice(0, 31), cadre10000: p.cas.cadre_10000.ecartNet, pct10000: p.cas.cadre_10000.pctNet, po: p.po };
  EX.reprise[v] = { F: q.F, a: q.a, cadre10000: q.cas.cadre_10000.ecartNet, pct10000: q.cas.cadre_10000.pctNet };
  var e = EX.S3[v];
  log('### Garantie ' + v);
  s.lignes.forEach(function (l) { log('- ' + l.id + ' ' + l.poste + ' : ' + l.v.map(function (x) { return f(x, 3); }).join(' / ')); });
  log('effet de la couche (central) ' + f(e.effetCouche) + ' ; leviers S3 en régime F = ' + f(e.F) + ' (fonction des revenus ' + f(e.revenus) + ', crédit d\'IS ' + f(e.credit) + ', transmissions et impôt de suite ' + f(e.transmissions) + ', impôt de suite sur le patrimoine ' + f(e.patrimoineNat) + ', courbe des pensions ' + f(e.pension) + ', économies ' + f(e.eco) + ') ; a = ' + f(e.a, 4));
  log('PO ' + pc(e.po.pct) + ' (élargis ' + pc(e.po.elargisPct) + ') ; dette 2038 ' + pc(e.traj[9]) + ', 2058 ' + pc(e.traj[29]) + ' ; pic ' + pc(e.pic) + ' en ' + e.picAn + ' ; déficit > 3 % jusqu\'en ' + e.dep3 + ' ; macro prudente, mêmes leviers : 2038 ' + pc(e.pru[9]) + ', 2058 ' + pc(e.pru[29]));
  log('macro prudente, leviers réglés pour la même règle : F = ' + f(EX.S3pru[v].F) + ', a = ' + f(EX.S3pru[v].a, 4) + ', cadre 10 000 € ' + f(EX.S3pru[v].cadre10000, 0) + ' (' + pc(EX.S3pru[v].pct10000) + ')');
  if (v !== 'gtc_droite') log('arrêts maladie avec reprise des compléments (option) : F = ' + f(EX.reprise[v].F) + ', a = ' + f(EX.reprise[v].a, 4) + ', cadre 10 000 € ' + f(EX.reprise[v].cadre10000, 0) + ' (' + pc(EX.reprise[v].pct10000) + ')');
  if (v === 'gtc_droite') {
    var cc = D.HYP.gt.gtc_droite.comportement, sn = D.s3(v, { extra: cc[1] }), sp = D.s3(v, { extra: cc[0] });
    EX.sensib = { comportement: cc, central: { F: sn.F, a: sn.a, po: sn.po, traj: sn.traj.ratio.slice(0, 31), cadre10000: sn.cas.cadre_10000.ecartNet }, faible: { F: sp.F, a: sp.a } };
    log('SENSIBILITÉ (défaut, comportement compté : sorties plus rapides, ' + cc.map(function (x) { return f(x); }).join(' / ') + ' Md€) : F = ' + f(sn.F) + ' (au lieu de ' + f(e.F) + '), a = ' + f(sn.a, 4) + ', PO ' + pc(sn.po.pct) + ', dette 2038 ' + pc(sn.traj.ratio[9]) + ', cadre 10 000 € ' + f(sn.cas.cadre_10000.ecartNet, 0));
  }
  log('cas types (revenu net santé, €/mois) : ' + IDS.map(function (id) { return id + ' ' + f(e.cas[id].v, 0) + ' (' + pc(e.cas[id].p) + ')'; }).join(' ; ') + ' ; retraités ' + e.retraites.map(function (x) { return x.pn + ' € ' + f(x.v, 0) + ' (' + pc(x.p) + ')'; }).join(' ; '));
  log('');
});
var old = K.s3(); EX.S3ancien = { F: old.F, a: old.a, cadre10000: old.r.cas.cadre_10000.ecartNet };
log('Pour mémoire, S3 consolidé du 06/11 (contribution 20 % avec capital, sans la couche) : F = ' + f(old.F) + ', a = ' + f(old.a, 4) + ', cadre 10 000 € ' + f(old.r.cas.cadre_10000.ecartNet, 0));
log('EXPORT ' + JSON.stringify(EX));
