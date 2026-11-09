// Test de cohérence et calculs de resultats.md. Lancer : jsc modele.js test_modele.js
// (macOS : /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
// ou : node -e "global.A=require('./modele.js')" ... (adapter). Lancer depuis modeles/acceleration/.
var A = this.Acceleration || (typeof require !== 'undefined' ? require('./modele.js') : null);
var lire = (typeof read === 'function') ? read : function (p) { return require('fs').readFileSync(p, 'utf8'); };
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r1(x) { return Math.round(x * 10) / 10; }

// 1. Tests unitaires sur données synthétiques
var synth = []; for (var i = 0; i < 10; i++) synth.push({ t: 2020 + i, y: 3 * Math.pow(2, i) });
var f = A.ajusterExponentielle(synth);
ok(Math.abs(f.doublementMois - 12) < 1e-6, 'doublement de 12 mois retrouvé');
ok(Math.abs(A.anneeDecimale('2024-07-01') - 2024.497) < 0.01, 'année décimale');
var logi = []; for (i = 0; i < 20; i++) logi.push({ t: 2000 + i, y: 100 / (1 + Math.exp(-0.8 * (i - 10))) });
var fl = A.ajusterLogistique(logi);
ok(fl && Math.abs(fl.K - 100) / 100 < 0.1 && fl.r2 > 0.99, 'logistique : plafond retrouvé à 10 % près');
ok(A.dateAtteinteSeuil({ dateDepart: 2026, horizonDepartMin: 60, seuilMin: 120, doublementMois: 6 }) - 2026.5 < 0.09, 'atteinte de seuil : 1 doublement = 6 mois');
ok(A.dateAtteinteSeuil({ dateDepart: 2026, horizonDepartMin: 60, seuilMin: 1e9, doublementMois: 6, variationDoublementParAn: 2 }) === Infinity, 'ralentissement fort : seuil jamais atteint');

// 2. Calculs sur les séries réelles
var S = A.parseCSV(lire('donnees/series_courbes.csv'));
function rapport(nom, natures, debut) {
  var p = A.serie(S, nom, natures).filter(function (x) { return !debut || x.t >= debut; });
  var e = A.ajusterExponentielle(p);
  log(nom + (debut ? ' (depuis ' + debut + ')' : '') + ' : n=' + e.n + ' facteur/an x' + r1(e.facteurAnnuel) +
      ' doublement ' + r1(e.doublementMois) + ' mois (IC ' + r1(e.doublementMoisIC[0]) + '-' + r1(e.doublementMoisIC[1]) + ') R2=' + r1(e.r2 * 100) / 100);
  return { p: p, e: e };
}
var metr = rapport('metr_horizon_50');
rapport('metr_horizon_50', null, 2023);
rapport('metr_horizon_50', null, 2024.5);
log('  fenêtres de 2 ans (METR) : ' + A.doublementParFenetre(metr.p, 2, 1).map(function (w) { return Math.floor(w.debut) + '-' + Math.floor(w.fin) + ': ' + r1(w.doublementMois) + ' mois'; }).join(' ; '));
var cal = rapport('calcul_entrainement_record');
rapport('calcul_entrainement_record', null, 2020);
log('  fenêtres de 3 ans (calcul) : ' + A.doublementParFenetre(cal.p, 3, 1).map(function (w) { return Math.floor(w.debut) + '-' + Math.floor(w.fin) + ': ' + r1(w.doublementMois); }).join(' ; '));
rapport('waymo_trajets_hebdo', ['declaration_entreprise']);
var ifr = rapport('robots_industriels_installations', null, 2018);
rapport('chatgpt_utilisateurs_hebdo');
rapport('adoption_ia_entreprises_EU27_2020', null, 2023);
rapport('adoption_ia_entreprises_FR', null, 2023);
var lg = A.ajusterLogistique(A.serie(S, 'chatgpt_utilisateurs_hebdo'));
log('ChatGPT logistique : plafond ' + Math.round(lg.K) + ' M (x' + r1(lg.plafondSurMax) + ' le max), R2=' + r1(lg.r2 * 100) / 100 + ' (exponentielle R2 ci-dessus)');
var lgm = A.ajusterLogistique(metr.p);
log('METR logistique : plafond x' + r1(lgm.plafondSurMax) + ' le max, R2=' + r1(lgm.r2 * 100) / 100 + ' -> plafond non identifiable si x50 (borne de grille)');

// 3. Fourchette de bascule (hypothèses : voir methode.md H1-H5)
var MOIS_TRAVAIL = 167 * 60; // 1 mois de travail à temps plein, en minutes
var dep = { dateDepart: A.anneeDecimale('2026-04-07'), horizonDepartMin: 1044.78 };
function sc(d, v, ef) { return { dateDepart: dep.dateDepart, horizonDepartMin: dep.horizonDepartMin, seuilMin: MOIS_TRAVAIL, doublementMois: d, variationDoublementParAn: v, ecartFiabilite: ef }; }
var fb = A.fourchetteBascule({
  haut_acceleration: sc(4.2, -0.15, 1),
  central_tendance2023: sc(4.2, 0, 1),
  central_80pct: sc(4.2, 0, 5),
  bas_tendance2019: sc(6.2, 0, 5),
  bas_ralentissement: sc(6.2, 0.5, 5)
});
Object.keys(fb).forEach(function (k) { log('  seuil 1 mois de travail [' + k + '] : ' + (isFinite(fb[k]) ? r1(fb[k]) : 'jamais avant 2100')); });

var SEMAINE = 40 * 60;
var fb2 = A.fourchetteBascule({
  haut: { dateDepart: dep.dateDepart, horizonDepartMin: dep.horizonDepartMin, seuilMin: SEMAINE, doublementMois: 4.2, variationDoublementParAn: 0, ecartFiabilite: 1 },
  central_80pct: { dateDepart: dep.dateDepart, horizonDepartMin: dep.horizonDepartMin, seuilMin: SEMAINE, doublementMois: 4.2, variationDoublementParAn: 0, ecartFiabilite: 5 },
  bas: { dateDepart: dep.dateDepart, horizonDepartMin: dep.horizonDepartMin, seuilMin: SEMAINE, doublementMois: 6.2, variationDoublementParAn: 0.3, ecartFiabilite: 5 }
});
Object.keys(fb2).forEach(function (k) { log('  seuil 1 semaine de travail [' + k + '] : ' + (isFinite(fb2[k]) ? r1(fb2[k]) : 'jamais avant 2100')); });
var fb3 = A.dateAtteinteSeuil({ dateDepart: dep.dateDepart, horizonDepartMin: dep.horizonDepartMin, seuilMin: MOIS_TRAVAIL, doublementMois: 6.2, variationDoublementParAn: 0.3, ecartFiabilite: 5 });
log('  seuil 1 mois [bas, ralentissement +30 %/an] : ' + (isFinite(fb3) ? r1(fb3) : 'jamais avant 2100'));

// 4. Robotique : intervalles entre générations
var G = A.parseCSV(lire('donnees/robotique_generations_produits.csv'));
var ig = A.intervallesGenerations(G);
Object.keys(ig).forEach(function (e) {
  log(e + ' : ' + ig[e].intervalles.map(function (x) { return x.de + '->' + x.a + ' ' + Math.round(x.mois) + ' mois'; }).join(' ; ') +
      ' | pente ' + r1(ig[e].penteMoisParGeneration) + ' mois/génération | annonce->livraison : ' +
      ig[e].delaisLivraison.filter(function (d) { return d.moisAnnonceLivraison != null; }).map(function (d) { return d.produit + ' ' + Math.round(d.moisAnnonceLivraison); }).join(', '));
});

// 5. Délai « incapable -> niveau expert » selon la date de départ
var D = A.parseCSV(lire('donnees/delai_incapable_a_surhumain.csv'));
var td = A.tendanceDelais(D);
log('Délais incapable->expert : n=' + td.n + ' pente ' + r1(td.b) + ' an de délai par an calendaire, R2=' + r1(td.r2 * 100) / 100);
var tdSansEchecs = A.tendanceDelais(D.filter(function (l) { return l.tache !== 'échecs'; }));
log('  sans les échecs : n=' + tdSansEchecs.n + ' pente ' + r1(tdSansEchecs.b) + ', R2=' + r1(tdSansEchecs.r2 * 100) / 100);

// 6. Agrégation des prévisions (médianes, hypothèse H7 : poids égaux par famille de source)
var familles = {
  enquete_chercheurs_ESPAI2024_HLMI: [{ mediane: 2042 }],
  superprevisionnistes_XPT2022: [{ mediane: 2060 }],
  experts_XPT2022: [{ mediane: 2046 }],
  metaculus_2022_via_Epoch: [{ mediane: 2039 }],
  revue_Epoch_2023: [{ mediane: 2045 }],
  AI_Futures_codeur_automatise: [{ mediane: 2027.9 }, { mediane: 2030.1 }],
  dirigeants: [{ mediane: 2026 }, { mediane: 2032.5 }, { mediane: 2028 }]
};
var toutes = [];
Object.keys(familles).forEach(function (k) {
  var n = familles[k].length;
  familles[k].forEach(function (p) { toutes.push({ mediane: p.mediane, poids: 1 / n }); });
});
var ag = A.agregerPrevisions(toutes);
log('Prévisions (médianes, une voix par famille) : min ' + ag.min + ' q1 ' + ag.q1 + ' médiane ' + ag.mediane + ' q3 ' + ag.q3 + ' max ' + ag.max);
var sansDir = toutes.filter(function (p, i) { return i < toutes.length - 3; });
var ag2 = A.agregerPrevisions(sansDir);
log('  sans les dirigeants : q1 ' + ag2.q1 + ' médiane ' + ag2.mediane + ' q3 ' + ag2.q3);
log('fini');
