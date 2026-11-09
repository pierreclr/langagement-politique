// Test de cohérence et calculs de resultats.md. Lancer depuis modeles/retraites/ :
//   jsc modele.js test_modele.js
//   (macOS : /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
//   ou : node test_modele.js
var M = this.Retraites || (typeof require !== 'undefined' ? require('./modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r(x, d) { var f = Math.pow(10, d === undefined ? 1 : d); return Math.round(x * f) / f; }
var D = M.DONNEES;

// ---------- 1. Tests de cohérence ----------
['brute_totale', 'nette_totale', 'brute_dd_residents'].forEach(function (code) {
  var dist = M.distribution2025(code), s = 0;
  dist.tranches.forEach(function (t) { s += t.part; });
  ok(Math.abs(s - 1) < 1e-12, code + ' : les parts somment à 1');
  ok(Math.abs(M.moyenneDist(dist) - dist.moyenne) < 1e-6, code + ' : la moyenne recalculée égale la moyenne cible 2025');
  ok(dist.moyenneTop > dist.tranches[dist.tranches.length - 1].bas, code + ' : la moyenne de la tranche ouverte dépasse son seuil');
});
ok(Math.abs(M.partSous(M.distribution2025('brute_totale'), 1000 * M.distribution2025('brute_totale').k) - 0.2749) < 1e-3,
  'part des pensions brutes totales < 1 000 € en 2020 = 27,49 % (EIR, tableau 5)');
ok(M.economieRetraites({ socle: 0 }).economieMdE === 0, 'socle nul → aucune économie');
var prec = -1, monotone = true;
for (var S = 0; S <= 3000; S += 100) { var e = M.economieRetraites({ socle: S }).economieMdE; if (e < prec) monotone = false; prec = e; }
ok(monotone, 'l\'économie croît avec le socle');
var e1 = M.economieRetraites({ socle: 1000 });
var massesRes = e1.massePensionsMdE - M.sousPopulations().nEtranger * 12 * M.sousPopulations().moyEtranger / 1000
  + M.sousPopulations().nDeriveSeul * 12 * M.sousPopulations().moyDeriveSeul / 1000;
ok(Math.abs(e1.economieMdE + e1.masseComplementsMdE - massesRes) < 1e-6, 'économie + compléments = pensions des résidents (identité)');
ok(Math.abs(M.economieRetraites({ socle: 1000, regle: 'reduit', alpha: 1 }).economieMdE - e1.economieMdE) < 1e-9, 'complément réduit à 100 % = complément intégral');
ok(Math.abs(M.economieRetraites({ socle: 1000, regle: 'reduit', alpha: 0 }).economieMdE - massesRes) < 1e-6, 'complément réduit à 0 % = toutes les pensions des résidents');
ok(M.economieRetraites({ socle: 1000, regle: 'cumul' }).economieMdE === 0, 'cumul socle + pension → aucune économie');
ok(M.economieRetraites({ socle: 1000, base: 'nette' }).economieMdE > e1.economieMdE, 'complément calculé sur le net → économie plus forte');
ok(Math.abs(M.economieTroisGroupes(1000) - 184.24) < 0.01, 'réplique du simulateur actuel : 184,2 Md€ pour 1 000 €');
ok(M.partCapitalisee(2027, 2027, 41, 25) === 0 && M.partCapitalisee(2027 + 41 + 25, 2027, 41, 25) === 1, 'part capitalisée : 0 à la réforme, 1 après W + D ans');
var t = M.transition({ socle: 1000 });
var identite = t.lignes.every(function (l) { return Math.abs(l.herite + l.fonds - l.complementTotal) < 1e-9; });
ok(identite, 'chaque année : part héritée + part du fonds = complément total');
ok(t.lignes.every(function (l) { return l.actif >= -1e-6; }), 'avec l\'apport minimal, le fonds n\'est jamais négatif');
ok(Math.abs(t.vaDoubleChargeAuTauxDuFondsMdE) < 0.02 * t.doubleCharge.cumulMdE,
  'identité de Sinn : au taux du fonds, la valeur actualisée de la double charge est ≈ 0');
ok(M.transition({ scenario: 'haut' }).apportMinimalMdE < t.apportMinimalMdE && t.apportMinimalMdE < M.transition({ scenario: 'bas' }).apportMinimalMdE,
  'rendement plus élevé → apport plus faible');
var mc1 = M.monteCarlo({}, 300, 42), mc2 = M.monteCarlo({}, 300, 42);
ok(mc1.probaEpuisement === mc2.probaEpuisement, 'Monte-Carlo reproductible avec la même graine');
ok(M.stress({}, 'krach').apportAvecChocMdE > t.apportMinimalMdE, 'un krach augmente l\'apport nécessaire');
ok(Math.abs(M.ratioActifsVersements(0, 41, 25).cotisationSurVersements - 1) < 1e-12, 'rendement nul : on cotise exactement ce qu\'on touche');


// ---------- 1 bis. Paramétrage (taux plat, socle) : ajout du 03/11/2026 ----------
(function () {
  var a = M.bilanRevenuRetraites({ socle: 500, taux: 0.35, imposition: 'net' }), b = M.bilanRevenuRetraites({ socle: 500, taux: 0.35, imposition: 'brut' }),
    c = M.bilanRevenuRetraites({ socle: 500, taux: 0.35, imposition: 'taux_plat' });
  ok(a.partPerdants < 0.001, 'complément sur le net : aucun retraité ne perd');
  ok(b.variationTotaleMdE > a.variationTotaleMdE, 'complément brut non imposé : les retraités gagnent plus que sur le net (CSG supprimée)');
  ok(c.variationTotaleMdE < 0 && c.partPerdants > 0.5, 'complément imposé au taux plat : la majorité des retraités perdent (signe inversé)');
  ok(M.bilanRevenuRetraites({ socle: 350, taux: 0.4, imposition: 'taux_plat' }).variationTotaleMdE < c.variationTotaleMdE, 'plus le taux est haut et le socle bas, plus la perte est forte (350 / 40 % contre 500 / 35 %)');
  ok(Math.abs(M.esperanceFonction(M.distribution2025('brute_totale'), function (x) { return Math.min(x, 800); }) - M.esperanceMin(M.distribution2025('brute_totale'), 800)) < 0.5, 'intégration numérique = formule exacte de E[min(p, S)]');
  var h = M.contributionHautesPensions({ seuil: 2500, taux: 0.2 });
  ok(h.recetteMdE > 5.8 && h.recetteMdE < 7, 'contribution des hautes pensions à 2 500 € et 20 % ≈ 6,3 Md€ (recoupe Rés. § 12.2)');
})();

// ---------- 2. Résultats (pour resultats.md) ----------
log('\n== Économie statique sur les pensions (Md€ 2025/an) selon le socle et la règle ==');
log('socle | intégral (brut) | intégral (net) | réduit 80 % | sans réversion (borne basse) | 3 groupes (simulateur) | compléments restants | % retraités sous le socle');
[500, 800, 1000, 1200, 1500, 2000].forEach(function (S) {
  var a = M.economieRetraites({ socle: S }), n = M.economieRetraites({ socle: S, base: 'nette' }),
    rd = M.economieRetraites({ socle: S, regle: 'reduit', alpha: 0.8 }), dd = M.economieRetraites({ socle: S, distribution: 'brute_dd_residents' });
  log(S + ' | ' + r(a.economieMdE) + ' | ' + r(n.economieMdE) + ' | ' + r(rd.economieMdE) + ' | ' + r(dd.economieMdE) + ' | '
    + r(M.economieTroisGroupes(S)) + ' | ' + r(a.masseComplementsMdE) + ' | ' + r(a.partSousSocle * 100));
});
var dec = e1.decomposition;
log('décomposition à 1 000 € : principal ' + r(dec.principalMdE) + ' ; retraités à l\'étranger ' + r(dec.residentsEtrangerMdE)
  + ' ; droits dérivés seuls ' + r(dec.droitsDerivesSeulsMdE) + ' ; masse des pensions (EIR, 2025) ' + r(e1.massePensionsMdE));
var dist = M.distribution2025('brute_totale');
log('pension brute totale 2025 (€/mois) : moyenne ' + r(dist.moyenne, 0) + ' ; D1 ' + r(M.quantile(dist, 0.1), 0) + ' ; Q1 ' + r(M.quantile(dist, 0.25), 0)
  + ' ; médiane ' + r(M.quantile(dist, 0.5), 0) + ' ; Q3 ' + r(M.quantile(dist, 0.75), 0) + ' ; D9 ' + r(M.quantile(dist, 0.9), 0) + ' ; facteur 2020→2025 ' + r(dist.k, 3));
log('table pour le simulateur (socle → Md€) : ' + JSON.stringify(M.tableSimulateur(0, 2000, 100)));
log('\n== Transition progressive du socle sur 10 ans (socle 1 000 €) ==');
var tot = 0;
for (var y = 2027; y < 2037; y++) tot += M.economieProgressive(1000, 10, y, 2027).surcoutVsIntegralMdE;
log('manque à gagner cumulé par rapport au complément intégral immédiat : ' + r(tot, 0) + ' Md€');

log('\n== Transition vers la capitalisation (réforme 2027, droits acquis honorés) ==');
log('socle | scénario | compléments 2025 | apport minimal I* (Md€/an ; % PIB) | double charge : durée, fin, cumul, pic | fonds 2100 (Md€ ; % PIB 2025) | dette implicite des compléments (% PIB) | part de I* couverte par l\'héritage');
[800, 1000, 1200, 1500].forEach(function (S) {
  ['bas', 'central', 'haut'].forEach(function (sc) {
    var x = M.transition({ socle: S, scenario: sc });
    log(S + ' | ' + sc + ' | ' + r(x.complement2025MdE, 0) + ' | ' + r(x.apportMinimalMdE, 0) + ' ; ' + r(x.apportMinimalPctPIB) + ' | '
      + x.doubleCharge.dureeAns + ' ans, ' + x.doubleCharge.finAnnee + ', ' + r(x.doubleCharge.cumulMdE, 0) + ', ' + r(x.doubleCharge.picMdE, 0) + ' | '
      + r(x.fonds.actif2100MdE, 0) + ' ; ' + r(x.fonds.actif2100MdE / D.pib2025 * 100, 0) + ' | ' + r(x.detteImpliciteComplementsPctPIB, 0) + ' | ' + r(x.partCouverteParHeritage * 100, 0) + ' %');
  });
});
log('trajectoire centrale (socle 1 000 €) : année | complément total | part héritée (budget) | part du fonds | actif du fonds | double charge');
[2027, 2035, 2045, 2055, 2065, 2075, 2090].forEach(function (an) {
  var l = t.lignes[an - 2027];
  log(an + ' | ' + r(l.complementTotal, 0) + ' | ' + r(l.herite, 0) + ' | ' + r(l.fonds, 0) + ' | ' + r(l.actif, 0) + ' | ' + r(l.doubleCharge, 0));
});
log('régime permanent : complément ' + r(t.regimePermanent.complementMdE, 0) + ' Md€/an, apport ' + r(t.regimePermanent.apportMdE, 0)
  + ' → économie ' + r(t.regimePermanent.economieAnnuelleVsRepartitionMdE, 0) + ' Md€/an par rapport à la répartition');
log('valeur actualisée de la double charge : au taux du fonds (3,5 %) ' + r(t.vaDoubleChargeAuTauxDuFondsMdE, 0) + ' Md€ ; à 1 % ' + r(t.vaDoubleChargeAuTaux(0.01), 0) + ' Md€ (négatif = gain net)');
var cu = M.transition({ regle: 'cumul' });
log('variante « cumul » (droits acquis absolus, socle en plus) : compléments ' + r(cu.complement2025MdE, 0) + ' Md€, apport ' + r(cu.apportMinimalMdE, 0)
  + ' Md€/an, fonds 2100 ' + r(cu.fonds.actif2100MdE, 0) + ' Md€, dette implicite ' + r(cu.detteImpliciteComplementsPctPIB, 0) + ' % du PIB');
var ra = M.ratioActifsVersements(0.035, 41, 25);
log('capitalisation par comptes, régime permanent sans croissance (r = 3,5 %) : actifs = ' + r(ra.actifsSurVersements) + ' années de versements ; cotisations = '
  + r(ra.cotisationSurVersements * 100, 0) + ' % des versements');

log('\n== Risque de marché (socle 1 000 €, scénario central) ==');
var mc = M.monteCarlo({}, 2000, 2026);
log('apport I* fixe, rendements aléatoires (σ = 12 %) : probabilité d\'épuisement avant 2100 = ' + r(mc.probaEpuisement * 100, 0) + ' % ; actif 2070 p5/p50/p95 = '
  + r(mc.actif2070.p5, 0) + ' / ' + r(mc.actif2070.p50, 0) + ' / ' + r(mc.actif2070.p95, 0) + ' Md€');
log('apport pour 90 % de réussite : ' + r(M.apportPrudent({}, 0.9, 600, 2026), 0) + ' Md€/an ; pour 95 % : ' + r(M.apportPrudent({}, 0.95, 600, 2026), 0) + ' Md€/an');
var k1 = M.stress({ annee: 2060, choc: 0.4 }, 'krach'), k2 = M.stress({ annee: 2060, duree: 34 }, 'japon');
log('krach de 40 % en 2060 : apport ' + r(k1.apportAvecChocMdE, 0) + ' Md€/an (+' + r(k1.surcoutAnnuelMdE, 0) + ') ; sans hausse d\'apport, fonds épuisé en ' + k1.apportFixeEpuisement);
log('34 ans de rendement nul à partir de 2060 (« Nikkei ») : apport ' + r(k2.apportAvecChocMdE, 0) + ' Md€/an (+' + r(k2.surcoutAnnuelMdE, 0) + ') ; sans hausse, épuisé en ' + k2.apportFixeEpuisement);
[1000, 1500].forEach(function (S) {
  var a = M.assuranceSocle(S, 0.4);
  log('socle ' + S + ' € : complément −40 % → revenu du retraité médian (' + r(a.pensionMediane, 0) + ' €) −' + r(a.baisseMediane * 100, 0)
    + ' % (−40 % sans socle) ; part des pensions exposée au marché ' + r(a.partRevenuExposee * 100, 0) + ' %');
});

log('\n== Trois jeux de paramètres (03/11/2026) : ancien 1 000 € / 50 %, palier 1 500 € / 35 %, architecture retenue 350 € / 40 % ==');
[[1000, 0.5, 'ancien'], [500, 0.35, 'palier 1'], [350, 0.4, 'architecture retenue']].forEach(function (j) {
  var e = M.economieRetraites({ socle: j[0] }), n = M.economieRetraites({ socle: j[0], base: 'nette' }), tr = M.transition({ socle: j[0] });
  log(j[2] + ' (' + j[0] + ' € / ' + j[1] * 100 + ' %) : économie brute ' + r(e.economieMdE) + ' ; sur le net ' + r(n.economieMdE) + ' ; sous le socle ' + r(e.partSousSocle * 100) + ' % ; compléments ' + r(e.masseComplementsMdE, 0)
    + ' ; capitalisation : double charge ' + r(tr.apportMinimalMdE, 0) + ' Md€/an, ' + tr.doubleCharge.dureeAns + ' ans, cumul ' + r(tr.doubleCharge.cumulMdE, 0) + ', fonds 2100 ' + r(tr.fonds.actif2100MdE, 0));
  ['brut', 'net', 'taux_plat'].forEach(function (i) {
    var b = M.bilanRevenuRetraites({ socle: j[0], taux: j[1], imposition: i });
    log('   imposition ' + i + ' : Δ revenu moyen ' + r(b.variationMoyenneMensuelle, 0) + ' €/mois ; total ' + r(b.variationTotaleMdE) + ' Md€ ; perdants ' + r(b.partPerdants * 100, 0) + ' % ; cas 800/1200/1753/2500/3500 : '
      + [800, 1200, 1753, 2500, 3500].map(function (p) { return r(b.casTypes[p], 0); }).join(' / '));
  });
});
var hp = M.contributionHautesPensions({}), hp3 = M.contributionHautesPensions({ seuil: 3000 });
log('règle retenue par la v2 (retraités protégés, 20 % au-dessus de 2 500 € nets) : recette ' + r(hp.recetteMdE) + ' Md€ (' + r(hp.partTouchee * 100) + ' % touchés) ; à 3 000 € : ' + r(hp3.recetteMdE) + ' Md€ (' + r(hp3.partTouchee * 100) + ' %)');
