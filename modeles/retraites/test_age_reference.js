// Tests et calculs de la section « Âge de référence indexé » de resultats.md. Lancer depuis modeles/retraites/ :
//   jsc modele.js age_libre.js test_age_reference.js
var A = this.AgeLibre || (typeof require !== 'undefined' ? require('./age_libre.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r(x, d) { var f = Math.pow(10, d === undefined ? 1 : d); return Math.round(x * f) / f; }
var AN = [2030, 2040, 2060, 2070];

log('== 1. Âge légal en vigueur au 03/11/2026 (loi n° 2025-1403, art. L161-17-2 du code de la sécurité sociale) ==');
ok(A.ageLegalEnVigueur(1963) === 62.75 && A.ageLegalEnVigueur(1964) === 62.75, 'générations 1963 et 1964 : 62 ans 9 mois (la suspension supprime les 63 ans de 2023 pour 1964)');
ok(A.ageLegalEnVigueur(1965, 2) === 62.75 && A.ageLegalEnVigueur(1965, 4) === 63, 'génération 1965 : 62 ans 9 mois jusqu\'au 31 mars, 63 ans ensuite');
ok(A.ageLegalEnVigueur(1966) === 63.25 && A.ageLegalEnVigueur(1967) === 63.5 && A.ageLegalEnVigueur(1968) === 63.75 && A.ageLegalEnVigueur(1969) === 64, 'générations 1966 à 1969 : 63 ans 3 mois, 6 mois, 9 mois, 64 ans');
ok(A.ageLegalEnVigueur(1961, 8) === 62 && A.ageLegalEnVigueur(1961, 9) === 62.25 && A.ageLegalEnVigueur(1962) === 62.5, 'générations 1961 et 1962 : 62 ans, 62 ans 3 mois, 62 ans 6 mois');
log('âge légal par génération : ' + [1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969].map(function (g) { return g + ' : ' + r(A.ageLegalEnVigueur(g), 2); }).join(' ; '));

log('\n== 2. Espérance de vie projetée (Insee 2026) ==');
ok(Math.abs(A.esperanceVieProjetee(65, 2025, 'centrale', 'T') - 21.8) < 0.2, 'e(65) en 2025 ≈ 21,8 (moyenne des sexes 23,6 et 20,0) : ' + r(A.esperanceVieProjetee(65, 2025, 'centrale', 'T'), 2));
var e70 = {}; ['centrale', 'haute', 'basse', 'constante'].forEach(function (v) { e70[v] = A.esperanceVieProjetee(65, 2070, v, 'T'); });
ok(Math.abs(e70.centrale - 25.35) < 0.3, 'e(65) en 2070, central ≈ 25,35 (26,3 femmes, 24,4 hommes) : ' + r(e70.centrale, 2));
ok(e70.haute > e70.centrale && e70.centrale > e70.basse && e70.basse > e70.constante - 0.01, 'haute > centrale > basse > constante : ' + r(e70.haute, 1) + ' > ' + r(e70.centrale, 1) + ' > ' + r(e70.basse, 1) + ' > ' + r(e70.constante, 1));
ok(Math.abs(A.esperanceVieProjetee(60, 2070, 'constante', 'T') - A.esperanceVieProjetee(60, 2025, 'constante', 'T')) < 1e-9, 'variante « constante » : e(60) figée');
log('e(60) central : ' + [2025, 2029, 2040, 2050, 2060, 2070].map(function (a) { return a + ' : ' + r(A.esperanceVieProjetee(60, a, 'centrale', 'T'), 2); }).join(' ; '));

log('\n== 3. Trajectoire de l\'âge de référence par génération ==');
var tr = {}; ['centrale', 'haute', 'basse', 'constante'].forEach(function (v) { tr[v] = A.trajectoireAgeReference({ variante: v }); });
function row(v, g) { return tr[v][g - 1955]; }
ok(row('centrale', 1969).ageRef === 64 && row('centrale', 1968).ageRef === 63.75, 'génération 1969 : 64 ans (loi), 1968 : 63 ans 9 mois');
var mono = true; for (var i = 1; i < tr.centrale.length; i++) if (tr.centrale[i].ageRef < tr.centrale[i - 1].ageRef) mono = false;
ok(mono, 'l\'âge de référence ne baisse jamais d\'une génération à l\'autre (cliquet)');
var ecartMax = 0; tr.haute.forEach(function (x) { if (x.generation >= 1969) ecartMax = Math.max(ecartMax, Math.abs((x.ageRef - 64) - 2 / 3 * x.gainE60)); });
ok(ecartMax <= 1 / 24 + 1e-9, 'à l\'arrondi près (1 mois), l\'âge de référence gagne 2/3 de chaque année d\'espérance de vie à 60 ans (écart max ' + r(ecartMax * 12, 2) + ' mois)');
ok(row('constante', 2010).ageRef === 64, 'espérance de vie constante : 64 ans pour toutes les générations');
ok(row('haute', 2010).ageRef > row('centrale', 2010).ageRef && row('centrale', 2010).ageRef > row('basse', 2010).ageRef, 'génération 2010 : haute > centrale > basse');
var t1 = A.trajectoireAgeReference({ part: 1 }), t12 = A.trajectoireAgeReference({ part: 0.5 });
ok(t1[2010 - 1955].ageRef > row('centrale', 2010).ageRef && row('centrale', 2010).ageRef > t12[2010 - 1955].ageRef, 'plus la fraction est grande (1, 2/3, 1/2), plus l\'âge de référence monte');
log('âge de référence (années) par génération, central / haute / basse : ');
[1969, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010].forEach(function (g) {
  log('  génération ' + g + ' (60 ans en ' + (g + 60) + ') : ' + r(row('centrale', g).ageRef, 2) + ' / ' + r(row('haute', g).ageRef, 2) + ' / ' + r(row('basse', g).ageRef, 2) + ' ; e(60) central +' + r(row('centrale', g).gainE60, 2) + ' an ; avec fraction 1 : ' + r(t1[g - 1955].ageRef, 2) + ', fraction 1/2 : ' + r(t12[g - 1955].ageRef, 2));
});

log('\n== 4. Effet de l\'âge de référence indexé (seul) ==');
var E = {}; ['favorable', 'central', 'defavorable'].forEach(function (n) { E[n] = A.effetAgeReference({ scenario: n, annees: AN }); });
ok(E.central.annees[2030].economieMdE === 0 && E.central.annees[2030].recettesMdE === 0, '2030 : aucun effet (les générations qui partent ont moins de 64 ans de référence : la règle ne mord pas avant ~2034)');
ok(E.central.annees[2040].economieMdE > 0 && E.central.annees[2060].economieMdE > E.central.annees[2040].economieMdE && E.central.annees[2070].economieMdE > E.central.annees[2060].economieMdE, 'l\'économie sur les pensions croît : 2040 < 2060 < 2070');
ok(E.favorable.annees[2040].soldeMdE > E.central.annees[2040].soldeMdE && E.central.annees[2040].soldeMdE > E.defavorable.annees[2040].soldeMdE, 'favorable > central > défavorable (solde 2040)');
ok(A.effetAgeReference({ passage: 0, annees: [2060] }).annees[2060].soldeMdE === 0, 'passage nul (personne ne retarde son départ) : aucun effet');
ok(A.effetAgeReference({ contrepartie: 1, r: 0, annees: [2060] }).annees[2060].economieMdE < E.central.annees[2060].economieMdE, 'une contrepartie plus grande (pension relevée du coefficient neutre) réduit l\'économie');
ok(A.effetAgeReference({ variante: 'constante', annees: [2060] }).annees[2060].soldeMdE === 0, 'espérance de vie constante : aucun effet');
ok(E.central.annees[2060].retraitesEnMoinsM > 0 && E.central.annees[2060].cotisantsEnPlusM > 0 && E.central.annees[2060].ratioReforme > E.central.annees[2060].ratioBase, 'moins de retraités, plus de cotisants, meilleur rapport cotisants/retraités');
['favorable', 'central', 'defavorable'].forEach(function (n) {
  AN.forEach(function (an) {
    var x = E[n].annees[an];
    log(n + ' ' + an + ' : report de l\'âge effectif ' + r(x.reportAgeEffectifAns, 2) + ' an (âge de référence de la cohorte ' + r(x.ageRefCohorte, 2) + ', âge effectif ' + r(x.ageEffectifCohorte, 2) + ') ; économie sur pensions ' + r(x.economieMdE) + ' Md€ (' + r(x.economiePts, 2) + ' pt) ; recettes ' + r(x.recettesMdE) + ' Md€ ; solde ' + r(x.soldeMdE) + ' Md€ (' + r(x.soldePts, 2) + ' pt) ; dépense ' + r(x.depenseBaseMdE, 0) + ' → ' + r(x.depenseReformeMdE, 0) + ' Md€ (' + r(x.depenseBasePts, 2) + ' → ' + r(x.depenseReformePts, 2) + ' % du PIB) ; retraités ' + r(x.retraitesBaseM, 2) + ' → ' + r(x.retraitesReformeM, 2) + ' M ; cotisants ' + r(x.cotisantsBaseM, 2) + ' → ' + r(x.cotisantsReformeM, 2) + ' M ; rapport ' + r(x.ratioBase, 2) + ' → ' + r(x.ratioReforme, 2) + ' ; part de l\'écart de 3,0 pts : ' + r(x.partEcartCOR * 100, 0) + ' % (3,6 pts : ' + r(x.partEcartCOFOG * 100, 0) + ' %)');
  });
});

log('\n== 5. Départ sans réduction (pénibilité, carrières longues) avec âge de référence indexé ==');
// 04/11/2026 (V12840-V12859) : part par défaut 20 % -> 10 % (net du droit actuel) ; P2 passe de 40 % à 20 % pour garder le rapport de 2 ; P20 = ancien défaut, pour les comparaisons avec la carrière longue.
var P = A.penibiliteIndexee({ annees: AN }), P20 = A.penibiliteIndexee({ part: 0.2, annees: AN }), P2 = A.penibiliteIndexee({ part: 0.2, annees: AN }), CL = A.penibiliteIndexee({ definition: 'carriereLongue', part: 0.15, annees: AN });
ok(Math.abs(P2.annees[2040].surcoutDispenseMdE / P.annees[2040].surcoutDispenseMdE - 2) < 0.05, 'le surcoût est proportionnel à la part');
ok(P.annees[2060].surcoutDispenseMdE > P.annees[2040].surcoutDispenseMdE, 'le surcoût de la dispense croît avec le temps (montée en charge puis report de l\'âge de référence)');
ok(P.annees[2040].coutTotalMdE > P.annees[2040].surcoutDispenseMdE, 'le coût total d\'un départ à 60 ans (pension versée plus tôt) dépasse la seule dispense de décote');
ok(CL.annees[2060].ageMinCohorte > 62 && CL.annees[2060].surcoutDispenseMdE < P20.annees[2060].surcoutDispenseMdE, 'carrière longue (âge de référence − 2 ans, 15 % des départs) coûte moins que la pénibilité à 60 ans (20 % des départs, ancien défaut)');
AN.forEach(function (an) { log('pénibilité (60 ans, 10 % des départs, net du droit actuel ; ancien défaut 20 %) ' + an + ' : dispense ' + r(P.annees[an].surcoutDispenseMdE) + ' Md€ (' + r(P.annees[an].surcoutDispensePts, 2) + ' pt) ; coût total ' + r(P.annees[an].coutTotalMdE) + ' Md€ (' + r(P.annees[an].coutTotalPts, 2) + ' pt) dont recettes perdues ' + r(P.annees[an].recettesPerduesMdE) + ' ; 10 % : dispense ' + r(P.annees[an].surcoutDispenseMdE / 2) + ' ; carrière longue (15 %, âge min ' + r(CL.annees[an].ageMinCohorte, 1) + ') : dispense ' + r(CL.annees[an].surcoutDispenseMdE) + ' Md€ (' + r(CL.annees[an].surcoutDispensePts, 2) + ' pt)'); });

log('\n== 6. Bilan du dispositif complet (solde public : + améliore) ==');
var B = {}; ['favorable', 'central', 'defavorable'].forEach(function (n) { B[n] = A.bilanReference(n, { annees: AN }); });
ok(B.favorable.annees[2040].soldeMdE > B.central.annees[2040].soldeMdE && B.central.annees[2040].soldeMdE > B.defavorable.annees[2040].soldeMdE, 'favorable > central > défavorable (solde 2040)');
ok(B.central.annees[2060].soldeMdE > B.central.annees[2040].soldeMdE && B.central.annees[2040].soldeMdE > B.central.annees[2030].soldeMdE, 'le bilan central s\'améliore avec le temps (transition coûteuse, puis report de l\'âge)');
ok(B.central.annees[2030].soldeMdE < 0, 'le dispositif coûte les premières années (âge libre, dispense de réduction)');
ok(B.central.annees[2070].economiePensionsPts < 3.0 && B.favorable.annees[2070].partEcartCOR > B.central.annees[2070].partEcartCOR, 'le central ne comble pas à lui seul l\'écart de 3 points avec l\'Allemagne');
['favorable', 'central', 'defavorable'].forEach(function (n) {
  AN.forEach(function (an) {
    var x = B[n].annees[an];
    log(n + ' ' + an + ' : âge de référence ' + r(x.ageReferenceMdE) + ' (+ recettes ' + r(x.ageReferenceRecettesMdE) + ') ; âge libre ' + r(x.ageLibreMdE) + ' (recettes ' + r(x.ageLibreRecettesMdE) + ') ; pénibilité ' + r(x.penibiliteMdE) + ' ; substitution (chômage, invalidité, maladie) ' + r(x.substitutionMdE) + ' ; indexation ' + r(x.indexationMdE) + ' ; hautes pensions ' + r(x.hautesPensionsMdE)
      + ' -> économie sur pensions ' + r(x.economiePensionsMdE) + ' Md€ (' + r(x.economiePensionsPts, 2) + ' pt) ; solde public ' + r(x.soldeMdE) + ' Md€ (' + r(x.soldePts, 2) + ' pt) ; dépense ' + r(x.depenseBaseMdE, 0) + ' -> ' + r(x.depenseReformeMdE, 0) + ' Md€ (' + r(x.depenseBasePts, 2) + ' -> ' + r(x.depenseReformePts, 2) + ' %) ; part de l\'écart (3,0 / 3,6 pts) ' + r(x.partEcartCOR * 100, 0) + ' % / ' + r(x.partEcartCOFOG * 100, 0) + ' % ; solde seul : ' + r(x.partEcartCORSolde * 100, 0) + ' %');
  });
});
log('  idem 2030 : âge de référence seul [0 ; 0 ; 0] ; dispositif complet [' + ['favorable', 'central', 'defavorable'].map(function (n) { return r(B[n].annees[2030].soldeMdE); }).join(' ; ') + ']');
log('MONTANTS POUR modeles/systeme-ideal/ (effet sur le solde public en 2040, Md€ de 2025, [favorable, central, défavorable]) :');
log('  âge de référence indexé seul, net de la substitution : [' + ['favorable', 'central', 'defavorable'].map(function (n) { return r(E[n].annees[2040].soldeMdE + B[n].annees[2040].substitutionMdE); }).join(' ; ') + '] ; brut : [' + ['favorable', 'central', 'defavorable'].map(function (n) { return r(E[n].annees[2040].soldeMdE); }).join(' ; ') + '] (pensions : [' + ['favorable', 'central', 'defavorable'].map(function (n) { return r(E[n].annees[2040].economieMdE); }).join(' ; ') + '])');
log('  dispositif complet (âge de référence + âge libre + pénibilité + niveau) : [' + ['favorable', 'central', 'defavorable'].map(function (n) { return r(B[n].annees[2040].soldeMdE); }).join(' ; ') + ']');
log('  idem 2060 : âge de référence seul (net de la substitution) [' + ['favorable', 'central', 'defavorable'].map(function (n) { return r(E[n].annees[2060].soldeMdE + B[n].annees[2060].substitutionMdE); }).join(' ; ') + '] ; dispositif complet [' + ['favorable', 'central', 'defavorable'].map(function (n) { return r(B[n].annees[2060].soldeMdE); }).join(' ; ') + ']');

log('\n== 7. Pauvreté et déciles ==');
var pv = A.pauvreteReference({ an: 2060 }), pv40 = A.pauvreteReference({ an: 2040 });
// 04/11/2026 : part en emploi du central 65 % -> 50 % (V12840-V12859) : autant en emploi que hors emploi, plus de strictement plus.
ok(pv.horsEmploiM > 0 && pv.enEmploiM >= pv.horsEmploiM - 1e-9, 'parmi ceux qui retardent leur départ, au moins autant sont en emploi (50 % ; ancien : 65 %) que hors emploi');
log('pauvreté (taux hypothétiques : retraités 13,3 %, hors emploi 30 %, en emploi 7 %) : 2040 : ' + r(pv40.horsEmploiM * 1000, 0) + ' 000 personnes hors emploi en plus, variation du nombre de pauvres ' + r(pv40.variationPauvresM * 1000, 1) + ' 000 ; 2060 : ' + r(pv.horsEmploiM * 1000, 0) + ' 000 hors emploi, ' + r(pv.variationPauvresM * 1000, 1) + ' 000 pauvres de plus (' + r(pv.variationPtsDesRetraites, 2) + ' pt de la population retraitée), dont ' + r(pv.horsEmploiSeulM * 1000, 1) + ' 000 pour les seuls hors emploi');
var dr = A.parDecileReference({ an: 2060 });
ok(dr.lignes[0].perteValeurViePct > dr.lignes[9].perteValeurViePct, 'à report égal, le décile 1 perd plus (en % de la valeur à vie de sa pension) que le décile 10 : espérance de vie plus courte');
// 04/11/2026 : passage 0,8 -> 0,5 (V12840-V12859) : report de 2060 plus faible ; seuils 1 an et 9 mois (anciens) abaissés à 0,5 an et 5 mois.
ok(dr.reportAns > 0.5 && dr.lignes[4].moisDeRetraiteEnMoins > 5, 'report de ' + r(dr.reportAns, 2) + ' an en 2060 : ' + r(dr.lignes[4].moisDeRetraiteEnMoins, 1) + ' mois de retraite en moins au décile 5');
dr.lignes.forEach(function (l) { log('décile ' + l.decile + ' : espérance de vie à 60 ans ' + r(l.e60, 1) + ' ; retraite attendue à ' + r(dr.reportAns > 0 ? 64.6 : 0, 1) + ' ans : ' + r(l.anneesRetraiteBase, 1) + ' ans ; pension moyenne ' + r(l.pensionMoyenne, 0) + ' €/mois ; perte de valeur à vie ' + r(l.perteValeurViePct, 1) + ' % ; ' + r(l.moisDeRetraiteEnMoins, 1) + ' mois de retraite en moins'); });

log('\n== 8. Pays qui lient l\'âge à l\'espérance de vie (OCDE, Pensions at a Glance 2025, tableaux 3.5 et 3.6) ==');
A.PAYS_LIEN.forEach(function (c) { log(c.pays + ' : âge normal 2024 ' + c.ageNormal2024 + ' -> futur (entrants 2024) ' + c.ageFutur + ' ; fraction ' + (c.fraction === null ? 'non vérifiée' : r(c.fraction, 2)) + ' ; préavis ' + (c.preavisAns === null ? 'n.d.' : c.preavisAns + ' ans') + ' ; ' + c.regle); });
log('\nTous les contrôles sont au vert.');
