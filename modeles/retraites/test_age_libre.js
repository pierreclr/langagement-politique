// Tests et calculs de la section « Âge libre et niveau » de resultats.md. Lancer depuis modeles/retraites/ :
//   jsc modele.js age_libre.js test_age_libre.js
//   ou : node test_age_libre.js
var A = this.AgeLibre || (typeof require !== 'undefined' ? require('./age_libre.js') : null);
var R = this.Retraites || (typeof require !== 'undefined' ? require('./modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r(x, d) { var f = Math.pow(10, d === undefined ? 1 : d); return Math.round(x * f) / f; }

log('== 1. Mortalité et annuités ==');
['T', 'M', 'F'].forEach(function (s) {
  var f = A.ajusteMortalite(s);
  ok(f.rmse < 0.15, 'sexe ' + s + ' : la loi ajustée reproduit la table d\'espérance de vie à 0,15 an près (rmse ' + r(f.rmse, 3) + ')');
});
ok(Math.abs(A.esperanceVieModele(65, 'T') - 21.8) < 0.2, 'e(65) modèle ≈ 21,8 (Eurostat/Insee 2023)');
ok(A.esperanceVie(65, 'F') - A.esperanceVie(65, 'M') > 3, 'les femmes vivent plus de 3 ans de plus à 65 ans');
ok(Math.abs(A.annuite(65, 0, 0, 'T') - A.esperanceVieModele(65, 'T')) < 0.3, 'annuité sans actualisation ni indexation ≈ espérance de vie (avec demi-année : écart < 0,3)');
ok(A.annuite(65, 0.016, 0, 'T') < A.annuite(65, 0, 0, 'T'), 'actualiser réduit l\'annuité');
ok(A.survie(60, 90, 'T') < A.survie(60, 75, 'T') && A.survie(60, 60, 'T') === 1, 'la survie décroît avec l\'âge');

log('\n== 2. Coefficients ==');
ok(Math.abs(A.coefNeutre(64, 64, 0.007, 0, 'T') - 1) < 1e-9, 'coefficient = 1 à l\'âge de référence');
var prev = 0, mono = true;
for (var a = 60; a <= 70; a++) { var c = A.coefNeutre(a, 64, 0.007, 0, 'T'); if (c <= prev) mono = false; prev = c; }
ok(mono, 'le coefficient neutre croît avec l\'âge de départ');
var cv = A.coutVieParDepart(64, 60, 'neutre', 0.007, 'T');
ok(Math.abs(cv.actualise) < 1e-6, 'neutralité : valeur actuelle des pensions inchangée au taux r (écart ' + r(cv.actualise, 8) + ')');
ok(cv.brut < 0, 'neutre à r > 0 : le total des pensions non actualisées baisse pour un départ anticipé (' + r(cv.brut * 100, 1) + ' %)');
ok(Math.abs(A.coutVieParDepart(64, 60, 'neutre', 0, 'T').brut) < 1e-6, 'neutre à r = 0 : total non actualisé inchangé');
var t0 = A.tauxAnnuelNeutre(64, 0, 0, 'T'), t1 = A.tauxAnnuelNeutre(64, 0.016, 0, 'T');
ok(t0 > 0.04 && t0 < 0.055, 'taux annuel neutre à 64 ans, r = 0 : ' + r(t0 * 100, 1) + ' % (OCDE : 4,8 % en moyenne)');
ok(0.05 > t0 && 0.05 < t1, 'la décote/surcote française (5 %/an) est comprise entre le neutre à r = 0 (' + r(t0 * 100, 1) + ' %) et à r = 1,6 % (' + r(t1 * 100, 1) + ' %)');
ok(A.coefNeutre(60, 64, 0.016, 0, 'M') < A.coefNeutre(60, 64, 0.016, 0, 'F'), 'à 60 ans le coefficient neutre des hommes est plus bas que celui des femmes (moins d\'années à vivre : chaque année pèse plus, réduction plus forte)');
ok(A.pensionAjustee(900, 0.8, 1044) === 900 && A.pensionAjustee(2000, 0.8, 1044) === 1600 && A.pensionAjustee(1200, 0.8, 1044) === 1044, 'plancher : jamais sous min(pension, plancher)');
log('coefficients (réf. 64 ans) : âge | neutre r=0 | neutre r=0,7 % | neutre r=1,6 % (suédois) | neutre r=3 % | français 5 %/an');
for (var ag = 60; ag <= 70; ag += 1) log('  ' + ag + ' | ' + r(A.coefNeutre(ag, 64, 0, 0, 'T'), 3) + ' | ' + r(A.coefNeutre(ag, 64, 0.007, 0, 'T'), 3) + ' | ' + r(A.coefSuedois(ag, 64, 'T'), 3)
  + ' | ' + r(A.coefNeutre(ag, 64, 0.03, 0, 'T'), 3) + ' | ' + r(A.coefFrancais(ag, 64, 0.05), 3));
['M', 'F'].forEach(function (s) { log('départ à 60 ans (réf. 64, r = 0,7 %), sexe ' + s + ' : coefficient ' + r(A.coefNeutre(60, 64, 0.007, 0, s), 3)); });
log('annuités à 65 ans (€ de pension annuelle valant) : r=0 ' + r(A.annuite(65, 0, 0, 'T'), 1) + ' ; r=1,6 % ' + r(A.annuite(65, 0.016, 0, 'T'), 1));

log('\n== 3. Effet de l\'âge libre (cohortes) ==');
var z = A.effetAgeLibre({ delta: 0, annees: [2030, 2060] });
ok(Math.abs(z.annees[2030].depenseMdE) < 1e-6 && Math.abs(z.annees[2060].depenseMdE) < 1e-6, 'Δ = 0 : aucun effet sur la dépense');
ok(Math.abs(A.effetAgeLibre({ delta: 1, r: 0, annees: [2090] }).annees[2090].depensePts) < 0.06, 'neutre à r = 0 : effet quasi nul en régime stationnaire (2090 ; résidu < 0,06 pt dû à la croissance de la pension des nouvelles cohortes)');
var e1 = A.effetAgeLibre({ delta: 1, r: 0, annees: [2030] }).annees[2030];
ok(e1.depenseMdE > 0, 'à r = 0 la transition coûte d\'abord (pensions versées plus tôt) : ' + r(e1.depenseMdE) + ' Md€ en 2030');
ok(A.effetAgeLibre({ delta: 1, r: 0.016, annees: [2060] }).annees[2060].depenseMdE < A.effetAgeLibre({ delta: 1, r: 0, annees: [2060] }).annees[2060].depenseMdE, 'un r plus élevé donne une dépense plus basse en 2060');
ok(e1.recettesPerduesMdE > 0, 'partir plus tôt fait perdre des recettes (travail en moins) : ' + r(e1.recettesPerduesMdE) + ' Md€ en 2030');
var pe = A.penibilite({ part: 0.2, age: 60 });
ok(pe.annees[2040].surcoutMdE > 0, 'départ à 60 ans sans réduction pour 20 % des départs : surcoût ' + r(pe.annees[2040].surcoutMdE) + ' Md€ en 2040 (' + r(pe.annees[2040].surcoutPts, 2) + ' pt)');
ok(A.penibilite({ part: 0.4, age: 60 }).annees[2040].surcoutMdE > 1.9 * pe.annees[2040].surcoutMdE, 'le surcoût est proportionnel à la part');

log('\n== 4. Niveau : indexation et contribution ==');
var i0 = A.indexationNiveau({ seuil: 2000, ecart: 0.005 });
ok(A.masseAuDessus(2000, 2025) > 60 && A.masseAuDessus(2000, 2025) < 110, 'masse des pensions brutes au-dessus de 2 000 € : ' + r(A.masseAuDessus(2000, 2025), 0) + ' Md€ (2025)');
ok(i0.annees[2060].economieMdE > i0.annees[2040].economieMdE && i0.annees[2040].economieMdE > i0.annees[2030].economieMdE, 'l\'économie de l\'indexation croît avec le temps');
ok(A.indexationNiveau({ seuil: 1500, ecart: 0.005 }).annees[2040].economieMdE > i0.annees[2040].economieMdE, 'plus le seuil est bas, plus l\'économie est grande');
ok(A.indexationNiveau({ seuil: 2000, ecart: 0 }).annees[2060].economieMdE === 0, 'écart nul : aucune économie');
var hp = A.contributionHautes({});
ok(Math.abs(hp.recetteMdE - 6.6) < 0.1, 'contribution des hautes pensions : ' + r(hp.recetteMdE) + ' Md€ (recoupe resultats.md : 6,6)');
var dec = A.parDecile({});
ok(dec.length === 10 && dec[0].perteTotalPct === 0 && dec[4].perteTotalPct === 0, 'les cinq premiers déciles ne perdent rien (seuil 2 000 € brut, 2 500 € net)');
ok(dec[9].perteTotalPct > dec[8].perteTotalPct && dec[8].perteTotalPct > dec[7].perteTotalPct, 'la perte croît avec le décile');

log('\n== 5. Pauvreté et plancher ==');
var pv = A.pauvreteAnticipee({}), pv2 = A.pauvreteAnticipee({ plancher: 1300 });
ok(pv.hausseSansPlancher > 0, 'sans plancher au niveau du seuil, la part des partants anticipés sous le seuil augmente de ' + r(pv.hausseSansPlancher * 100, 1) + ' points');
ok(pv2.hausseAvecPlancher === 0, 'avec un plancher ≥ seuil de pauvreté, la hausse est nulle');
ok(pv2.coutPlancherEnRegimeMdE > pv.coutPlancherEnRegimeMdE, 'un plancher plus haut coûte plus');

log('\n== 6. Bilans par scénario (économie sur les pensions + ; surcoût −) ==');
var S = {};
['bas', 'central', 'haut'].forEach(function (n) {
  S[n] = A.bilan(n);
  [2030, 2040, 2060].forEach(function (an) {
    var x = S[n].annees[an];
    log(n + ' ' + an + ' : âge libre ' + r(x.ageLibreMdE) + ' ; pénibilité ' + r(x.penibiliteMdE) + ' ; indexation ' + r(x.indexationMdE) + ' ; hautes pensions ' + r(x.hautesPensionsMdE)
      + ' → économie ' + r(x.depenseMdE) + ' Md€ = ' + r(x.depensePts, 2) + ' pt de PIB ; recettes perdues ' + r(x.recettesPerduesMdE) + ' ; net ' + r(x.netMdE) + ' Md€ = ' + r(x.netPts, 2) + ' pt ; part de l\'écart (3,0 pts) ' + r(x.partEcartCoreCOR * 100, 0) + ' % ; cotisants/retraités ' + r(x.ratioCotisantsRetraites, 2));
  });
});
ok(S.bas.annees[2060].depensePts < S.central.annees[2060].depensePts && S.central.annees[2060].depensePts < S.haut.annees[2060].depensePts, 'bas < central < haut en 2060 (économie en points de PIB)');
ok(S.haut.annees[2060].depensePts < 3.0, 'même le scénario haut ne comble pas à lui seul l\'écart de 3 points avec l\'Allemagne');
ok(S.central.annees[2030].netPts < S.central.annees[2060].netPts, 'le bilan net s\'améliore avec le temps (transition coûteuse)');
log('niveau seul (indexation + hautes pensions), central, 2040 : ' + r(S.central.annees[2040].niveauMdE) + ' Md€ = ' + r(S.central.annees[2040].niveauPts, 2) + ' pt ; 2060 : ' + r(S.central.annees[2060].niveauMdE) + ' Md€ = ' + r(S.central.annees[2060].niveauPts, 2) + ' pt');

log('\n== 7. Qui perd, par décile de pension (2040, seuil 2 000 € brut, écart 0,5 pt/an ; contribution 20 % au-dessus de 2 500 € nets) ==');
dec.forEach(function (l) { log('décile ' + l.decile + ' : pension moyenne ' + r(l.pensionMoyenne, 0) + ' €/mois ; indexation −' + r(l.perteIndexationPct, 1) + ' % ; contribution −' + r(l.perteContributionPct, 1) + ' % ; total −' + r(l.perteTotalPct, 1) + ' %'); });
log('pauvreté (départ à 60 ans, coefficient ' + r(pv.coef, 3) + ') : part des partants anticipés (pension individuelle nette < ' + pv.seuil + ' €) ' + r(pv.partSousSeuilBase * 100, 0) + ' % → ' + r(pv.partSousSeuilSansPlancher * 100, 0) + ' % sans plancher (+' + r(pv.hausseSansPlancher * 100, 1) + ' points) ; plancher 1 044 € : même chose (il est sous le seuil) ; plancher 1 300 € : +0 ; part d\'une cohorte qui part à 60 ans ' + r(pv.partPartants * 100, 0) + ' % ; coût du plancher en régime : 1 044 € ' + r(pv.coutPlancherEnRegimeMdE, 1) + ' Md€/an, 1 300 € ' + r(pv2.coutPlancherEnRegimeMdE, 1) + ' Md€/an');
log('\nTous les contrôles sont au vert.');
