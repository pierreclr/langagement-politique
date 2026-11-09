// Rapport de la couche DECISIONS0811 (decisions_0811.js) : décisions du 07/11 (soir) et du 08/11/2026. Liste de rapport_consolidation_0611.js sans le rapport, puis decisions_0711.js, decisions_0811.js et ce fichier ;
// sortie dans resultats_decisions_0811.txt (qui fait foi) ; la dernière ligne (EXPORT) est recopiée dans sources/calculs/bilan_global.py (dictionnaire DECISIONS0811).
var E = this.Decisions0811, D = this.Decisions0711, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 2 : n).replace('.', ','); }
function pc(x, n) { return f(100 * x, n === undefined ? 1 : n) + ' %'; }
var EX = { date: '2026-11-08' };
log('# Décisions du 07/11 (soir) et du 08/11/2026 (couche DECISIONS0811) : résultats');
log('');
// 1. Courbe des pensions
var c = E.courbe(), o = c.o;
EX.courbe = { o: o, ancien: c.ancien, k: c.k, cible: c.cible, r: c.r.map(function (r) { return { net: r.net, brute: r.brute, concernes: r.concernes, partConcernes: r.partConcernes }; }) };
log('## 1. Courbe des pensions relevée, R1f supprimée');
log('C_p(P) = ' + f(o.m, 4) + ' × [(P − ' + o.Pg + ') − ' + o.K + ' × (1 − e^(−(P − ' + o.Pg + ')/' + o.K + '))] au-dessus de ' + o.Pg + ' € nets par mois ; 0 en dessous ; la recette est linéaire en k : 0,2911 × 9 / 6,268 = ' + f(c.kProportion, 4) + ' (recalculé par dichotomie : ' + f(o.m, 4) + ')');
log('recette nette fav. / central / déf. : ' + c.r.map(function (r) { return f(r.net); }).join(' / ') + ' Md€ ; retraités concernés ' + f(c.r[1].concernes / 1e6, 2) + ' M (' + pc(c.r[1].partConcernes) + ')');
var r1 = E.r1f(); EX.r1f = r1;
log('recette de la sous-indexation R1f supprimée (central) : 2029 ' + f(r1.y2029) + ' ; 2038 ' + f(r1.y2038) + ' ; 2058 ' + f(r1.y2058) + ' Md€ (en régime : ' + f(r1.regime) + ')');
EX.pensions = [1200, 2000, 2500, 3000, 4000, 5000, 6000, 10000].map(function (P) { var r = E.casRetraite(P), a = D.casRetraite(P, D.courbe().o, false); return { P: P, courbe: r.courbe, ancienneCourbe: a.courbe, r1f: a.r1f, ecart: r.ecartNet, ecartAvant: a.ecartNet, pct: r.pctNet, marg: D.marginalP(P, o) }; });
log('| Pension nette (€/mois) | Courbe 0811 | Courbe 0711 | R1f supprimée | Écart revenu net santé 0811 | Écart 0711 (courbe + R1f) | Marginal |');
log('|---|---|---|---|---|---|---|');
EX.pensions.forEach(function (x) { log('| ' + x.P + ' | ' + f(x.courbe, 0) + ' | ' + f(x.ancienneCourbe, 0) + ' | ' + f(x.r1f, 0) + ' | ' + f(x.ecart, 0) + ' (' + pc(x.pct) + ') | ' + f(x.ecartAvant, 0) + ' | ' + pc(x.marg) + ' |'); });
EX.bascule = E.pensionBascule();
log('pension à partir de laquelle on perd (mutuelle comptée, R1f supprimée) : ' + f(EX.bascule, 0) + ' € (0711 : ' + f(D.pensionBascule(D.courbe().o), 0) + ')');
log('');
// 2. Grand âge et ligne vieillesse
var ga = E.grandAge(), v = E.vieillesse(); EX.grandAge = ga; EX.vieillesse = v;
log('## 2. Grand âge et ligne « vieillesse »');
log('surcoût net de l\'hébergement (fav. / central / déf.) : ' + ga.hebergement.map(function (x) { return f(x, 1); }).join(' / ') + ' ; aide à domicile : ' + f(ga.domicile[1], 1) + ' ; total ' + ga.total.map(function (x) { return f(x, 1); }).join(' / ') + ' Md€ (central sans reprise : ' + f(ga.sansReprise[1], 1) + ' + domicile)');
log('ligne vieillesse (central) : courbe 9,00 − courbe 0711 ' + f(v.ancienne) + ' = hausse ' + f(v.hausseCourbe) + ' ; à financer : R1f perdue ' + f(v.r1fPerdu) + ' + grand âge ' + f(v.grandAge) + ' = ' + f(v.besoin) + ' ; solde de la ligne ' + f(v.solde) + ' ; reste à financer ' + f(v.reste) + ' Md€ (pris sur la fonction des revenus par la règle de dette)');
log('');
// 3. TVA
var tv = E.tvaAutres(); EX.tva = tv; var tt = [0, 1, 2].map(function (k) { return tv.reduce(function (a, l) { return a + l.v[k]; }, 0); }); EX.tvaTotal = tt;
log('## 3. TVA : biens à 5,5 % et 2,1 % ramenés à 5 % (V20006)');
tv.forEach(function (l) { log('- ' + l.id + ' ' + l.lib + ' : ' + l.v.map(function (x) { return f(x, 3); }).join(' / ')); });
log('total (fav. / central / déf.) : ' + tt.map(function (x) { return f(x, 3); }).join(' / ') + ' Md€');
log('');
// 4. Conversion en salaire
var cv = E.conversion(); EX.conversion = cv;
log('## 4. Conversion en salaire, coût employeur inchangé');
log('assiettes (Md€/an) : mutuelle part patronale ' + f(cv.assietteMutuelle, 2) + ' ; transport ' + cv.assietteTransport.map(function (x) { return f(x, 1); }).join(' / ') + ' ; titres-restaurant ' + f(cv.assietteTitres, 1) + ' (déjà BT09) ; total ' + cv.assietteTotale.map(function (x) { return f(x, 1); }).join(' / '));
log('effet au solde : mutuelle (écart à BT08) ' + [0, cv.mutuelle[1], cv.mutuelle[2]].map(function (x) { return f(x, 2); }).join(' / ') + ' ; transport ' + cv.transport.map(function (x) { return f(x, 2); }).join(' / '));
log('');
// 5-6. Plancher et lieu
var pl = E.plancher(), li = E.lieu(); EX.plancher = pl; EX.lieu = li;
log('## 5. Plancher en deux parts');
log('socle ' + pl.parts[0] + ' + logement ' + pl.parts[1] + ' = ' + pl.total + ' € ; économie (fav. / central / déf.) : ' + pl.economie.map(function (x) { return f(x, 2); }).join(' / ') + ' Md€ (propriétaires ' + pl.propParmi.map(function (x) { return pc(x, 0); }).join(' / ') + ' ; hébergés sans loyer ' + pl.hebergesParmi.map(function (x) { return pc(x, 0); }).join(' / ') + ')');
log('## 6. Coefficient de lieu et outre-mer');
log('coefficient pondéré par la population : ' + f(li.coefMoyen, 3) + ' ; dépense de plancher outre-mer ' + li.depensePlancherOM.map(function (x) { return f(x, 2); }).join(' / ') + ' ; coût du coefficient ' + li.cout.map(function (x) { return f(x, 2); }).join(' / ') + ' Md€');
log('');
// 7. Lignes, S3
log('## 7. Lignes de la couche et scénario S3');
var L = E.lignesNouvelles(); EX.lignes = L.map(function (l) { return { id: l.id, poste: l.poste, v: l.v, sens: l.sens, cote: l.cote }; });
L.forEach(function (l) { log('- ' + l.id + ' ' + l.poste + ' : ' + l.v.map(function (x) { return f(x, 3); }).join(' / ')); });
var sn = D.somme(L); EX.effetNouvelles = sn;
log('effet des nouvelles lignes : ' + sn.map(function (x) { return f(x, 2); }).join(' / ') + ' Md€');
var IDS = ['smic_seul', 'parent_isole_smic', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000', 'rentier_div_5000'];
function resume(s) {
  var r = { F: s.F, a: s.a, effetCouche: s.effetCouche, revenus: s.revenus, credit: s.credit, transmissions: s.transmissions, patrimoineNat: s.patrimoineNat, pension: s.pension, eco: s.eco, po: s.po,
            traj: s.traj.ratio.slice(0, 31), def: s.traj.deficit.slice(0, 31), pic: s.pic, picAn: s.picAn, dep3: s.dep3, pru: s.trajPrudente.ratio.slice(0, 31), cas: {},
            retraites: s.retraites.map(function (x) { return { pn: x.pn, avant: x.avantNet, v: x.ecartNet, p: x.pctNet, courbe: x.courbe, r1f: x.r1f }; }) };
  IDS.forEach(function (id) { var x = s.cas[id]; r.cas[id] = { avant: x.avantNet, v: x.ecartNet, p: x.pctNet }; });
  return r;
}
var s = E.s3(), p = E.prudente(), o7 = D.s3();
EX.S3 = resume(s); EX.S3pru = { F: p.F, a: p.a, traj: p.traj.ratio.slice(0, 31), cadre10000: p.cas.cadre_10000.ecartNet, pct10000: p.cas.cadre_10000.pctNet, po: p.po }; EX.S3ancien = resume(o7);
var e = EX.S3, a = EX.S3ancien;
log('S3 : leviers F = ' + f(e.F) + ' (0711 : ' + f(a.F) + ') = fonction des revenus ' + f(e.revenus) + ' (0711 ' + f(a.revenus) + ') + crédit d\'IS ' + f(e.credit) + ' + transmissions ' + f(e.transmissions) + ' + patrimoine (suite) ' + f(e.patrimoineNat) + ' + courbe des pensions ' + f(e.pension) + ' (0711 ' + f(a.pension) + ') + économies ' + f(e.eco));
log('effet de la couche (0711 + 0811) ' + f(e.effetCouche) + ' (0711 seul : ' + f(a.effetCouche) + ') ; a = ' + f(e.a, 4) + ' (0711 : ' + f(a.a, 4) + ')');
log('PO ' + pc(e.po.pct) + ' (élargis ' + pc(e.po.elargisPct) + ') ; 0711 : ' + pc(a.po.pct) + ' (' + pc(a.po.elargisPct) + ') ; dette 2038 ' + pc(e.traj[9]) + ', 2058 ' + pc(e.traj[29]) + ' ; pic ' + pc(e.pic) + ' en ' + e.picAn + ' ; déficit > 3 % jusqu\'en ' + e.dep3 + ' (0711 : 2038 ' + pc(a.traj[9]) + ', 2058 ' + pc(a.traj[29]) + ')');
log('macro prudente, mêmes leviers : 2038 ' + pc(e.pru[9]) + ', 2058 ' + pc(e.pru[29]) + ' ; leviers à régler : F = ' + f(p.F) + ', a = ' + f(p.a, 4) + ', cadre 10 000 € ' + f(EX.S3pru.cadre10000, 0) + ' (' + pc(EX.S3pru.pct10000) + ')');
log('cas types (revenu net santé, €/mois ; 0711 entre parenthèses) : ' + IDS.map(function (id) { return id + ' ' + f(e.cas[id].v, 0) + ' (' + f(a.cas[id].v, 0) + ')'; }).join(' ; '));
log('retraités : ' + e.retraites.map(function (x, i) { return x.pn + ' € ' + f(x.v, 0) + ' (' + pc(x.p) + ' ; 0711 ' + f(a.retraites[i].v, 0) + ')'; }).join(' ; '));
// sensibilité : comportement compté
var cc = D.HYP.gt.gtc_droite.comportement, sc = E.s3(undefined, { extra: cc[1] }); EX.sensib = { F: sc.F, a: sc.a, po: sc.po, d2038: sc.traj.ratio[9] };
log('SENSIBILITÉ (comportement des sorties du chômage compté, ' + f(cc[1]) + ' Md€) : F = ' + f(sc.F) + ', a = ' + f(sc.a, 4) + ', dette 2038 ' + pc(sc.traj.ratio[9]));
// fourchettes favorable / défavorable des nouvelles lignes
var sf = E.s3(undefined, { extra: sn[0] - sn[1] }), sd = E.s3(undefined, { extra: sn[2] - sn[1] }); EX.bornes = { fav: { F: sf.F, a: sf.a }, def: { F: sd.F, a: sd.a } };
log('bornes des nouvelles lignes : favorable F = ' + f(sf.F) + ', a = ' + f(sf.a, 4) + ' ; défavorable F = ' + f(sd.F) + ', a = ' + f(sd.a, 4));
log('');
// 8. Clause
var cl = E.clause(s); EX.clause = { L: cl.L, voted: cl.voted, avec: cl.avec, sans: cl.sans, maxL: cl.maxL, L2038: cl.L2038, L2048: cl.L2048, L2058: cl.L2058, ecartMax: cl.ecartMax, ecartMin: Math.min.apply(null, cl.ecart), stable: cl.stable, pic: cl.pic, pensMax: cl.pensMax, partRetraites: cl.partRetraites, mCap: E.HYP.clause.mCap, seuil: cl.seuil, pas: cl.pas, kappa: E.HYP.clause.kappa };
log('## 8. Clause automatique (macro prudente, leviers de la référence)');
log('règle : écart à la trajectoire votée > ' + f(100 * cl.seuil, 0) + ' points de PIB → clause active ; levier cible = ' + f(E.HYP.clause.kappa, 1) + ' × PIB × écart ; variation annuelle ≤ ' + f(cl.pas, 0) + ' Md€ ; extinction quand l\'écart ≤ 0');
log('levier ajouté : 2038 ' + f(cl.L2038, 1) + ' ; 2048 ' + f(cl.L2048, 1) + ' ; 2058 ' + f(cl.L2058, 1) + ' Md€ (max ' + f(cl.maxL, 1) + ') ; part des retraités à proportion des recettes ' + pc(cl.partRetraites, 0) + ', plafonnée par un coefficient de courbe de ' + f(E.HYP.clause.mCap, 2) + ' (au plus +' + f(cl.pensMax, 2) + ' Md€ sur les pensions)');
[['niveau stable (2048)', cl.stable], ['pic', cl.pic]].forEach(function (x) { log(x[0] + ' : levier ' + f(x[1].levier, 1) + ' = actifs ' + f(x[1].actifs, 1) + ' + retraités ' + f(x[1].retraites, 2) + ' ; a = ' + f(x[1].a, 4) + ' ; coefficient de la courbe des pensions ' + f(x[1].m, 4) + ' ; cadre à 10 000 € brut ' + f(x[1].cadre10000, 0) + ' €/mois'); });
log('écart à la trajectoire votée : maximum ' + f(100 * cl.ecartMax, 1) + ' points ; en 2058 ' + f(100 * cl.ecart[29], 1) + ' ; dette 2038 ' + pc(cl.avec[9]) + ', 2058 ' + pc(cl.avec[29]) + ' (sans clause : ' + pc(cl.sans[9]) + ', ' + pc(cl.sans[29]) + ' ; votée : ' + pc(cl.voted[9]) + ', ' + pc(cl.voted[29]) + ')');
log('levier par année 2029-2058 : ' + cl.L.map(function (x) { return f(x, 0); }).join(' '));
log('EXPORT ' + JSON.stringify(EX));
