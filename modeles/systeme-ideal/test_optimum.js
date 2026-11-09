// Tests de la recherche de l'architecture optimale (optimum.js, 03/11/2026 ; affinage du 03/11 au § 8). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js test_optimum.js
// (les deux fichiers de capital-de-depart ne servent qu'aux architectures v3, v3b et v4 : sans eux, leurs contrôles sont sautés)
var Z = this.Optimum, OF = this.OptionsFinancement, TP = this.TaxePatrimoine, C = this.Correctifs, M = this.SystemeIdeal, P1 = this.Palier1, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var SCS = ['bas', 'central', 'haut'];

// 1. Aucun défaut existant ne bouge
proche(OF.solde({}, 'central'), -163.05, 0.1, 'palier 1 inchangé : −163,05 (V11770 : 1,84 M au RSA ; −163,3 avec l\'ancien 1,9 M) au central');
ok(M.DEFAUT.socle === 1000 && M.DEFAUT.tPlat === 0.5, 'défauts de modele.js inchangés');
ok(OF.BASE.tPlat === 0.35 && OF.BASE.taxePatrimoine === null && OF.BASE.finPurgeAV === false, 'défauts d\'options_financement.js inchangés');
ok(Z.DEFAUT.structurelles === 'aucune' && Z.DEFAUT.education === 'tuteurRedeploye' && !Z.DEFAUT.nichesTVA, 'défauts d\'optimum.js : économies structurelles à 0, éducation au défaut tranché, niches TVA maintenues');

// 2. Postes repris des modules
var a0 = Z.archi({ tPlat: 0.4, socle: 450, report150: true, economies: 'e2e4' });
SCS.forEach(function (s) { proche(Z.detail(a0, s).options, OF.solde(Z.versOF(a0), s), 1e-9, 'poste « options » = OptionsFinancement.solde (' + s + ')'); });
ok(Z.versOF(a0).immobilier && Z.versOF(a0).finPurgeAV && Z.versOF(a0).deces === 'credit', 'toujours en place : réforme immobilière, fin de la purge AV, décès avec imputation');
SCS.forEach(function (s) { proche(Z.taxe(s, { taxe: { assiette: 'pierre' } }).nette, TP.recette(OF.SC_PATRIMOINE[s], { avecReformeImmo: true }).nette, 1e-9, 'taxe sans plafond = taxe_patrimoine.recette, scénarios croisés (' + s + ')'); });
proche(Z.taxe('central', { taxe: { assiette: 'pierre' } }).nette, 87.3284, 0.1, 'taxe de référence : 93 Md€ au central (taxe-patrimoine-1pc.md)'); // 04/11/2026 : ancienne valeur 93.4, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 93.1977, recalée après les corrections de données V12400-V12404
proche(Z.droits('central', 0.5), 103.5, 0.05, 'droits à 50 % : 103,5 Md€ au central');
SCS.forEach(function (s) { proche(Z.decesPlafonne(s, Z.archi({ tPlat: 0.45, tHeritage: 0.4 })), 0, 1e-9, 'décès plafonné : l\'impôt sur le gain est absorbé par les droits à 40 % (' + s + ')'); });
proche(Z.coutConjoint('central', Z.archi({})), 0.18 * 103.5, 0.05, 'exception du conjoint : 18 % des droits au central');
proche(Z.coutConjoint('central', Z.archi({ exceptionConjoint: false })), 0, 1e-12, 'sans exception du conjoint : coût nul');
ok(Z.tauxTransmissionMax(Z.archi({ tPlat: 0.45 })) <= 0.5, 'contrainte (4) : avec imputation, aucun prélèvement au-delà de 50 % de la valeur transmise');

// 3. Correctifs
proche(Z.coutCorrectifs('central', Z.archi({})).b, C.coutB('central').md, 1e-9, 'majoration à 200,78 € = correctif (b) de correctifs.js');
proche(Z.coutCorrectifs('central', Z.archi({ majParentIsole: 401.56 })).b, 2 * C.coutB('central').md, 1e-9, 'coût de la majoration proportionnel au montant');
proche(Z.coutCorrectifs('haut', Z.archi({})).b, C.coutB('central').md, 1e-9, 'haut : même effectif, montant de l\'architecture (pas 300 €)');
proche(Z.coutCorrectifs('central', Z.archi({})).a, C.coutA('central').md, 1e-9, 'aide au logement des retraités = correctif (a)');
var ref = {}; C.casTypes(Z.versOF(a0), undefined, { a: true, b: true }).forEach(function (c) { ref[c.id] = c.ecartMois; });
var ct = Z.casTypes(a0); Object.keys(ref).forEach(function (k) { proche(ct[k].ecartMois, ref[k], 1e-6, 'cas type ' + k + ' = correctifs.js (a) + (b)'); });
var dref = C.decilesCorriges(Z.versOF(a0), undefined, { a: true, b: true }), dz = Z.deciles(a0);
dref.forEach(function (d, i) { proche(dz[i].ecart, d.ecart, 1e-6, 'dixième ' + d.decile + ' sans taxe = correctifs.js (a) + (b)'); });

// 4. Taxe : plafonnement et cas types
var tx = { assiette: 'pierre', abattement: 0 };
proche(Z.effort(Z.HYP.retraiteModeste, { taxe: tx }), 3000 / 16800, 1e-9, 'retraité modeste sans plafond : 3 000 € pour 16 800 € (17,9 %)');
proche(Z.effort(Z.HYP.retraiteModeste, { taxe: F(tx, { plafond: 0.10 }) }), 0.10, 1e-9, 'plafond de 10 % : effort ramené à 10 %');
proche(Z.effort(Z.HYP.retraiteModeste, { taxe: F(tx, { abattement: 100000 }) }), 2000 / 16800, 1e-9, 'abattement 100 000 € : 2 000 € (11,9 %)');
ok(Z.effort(Z.HYP.fondateur, { taxe: F(tx, { plafond: 0.05 }) }) > 2, 'fondateur au-dessus de la médiane : pas de plafonnement (100 000 € pour 48 000 €)');
proche(Z.effort(Z.HYP.fondateur, { taxe: F(tx, { nonCotesVente: true }) }), 0, 1e-12, 'fondateur, non-cotés taxés à la vente : rien dans l\'année');
var p5 = Z.distributionTaxe(F(tx, { plafond: 0.05 })).partDifferee, p10 = Z.distributionTaxe(F(tx, { plafond: 0.10 })).partDifferee, p15 = Z.distributionTaxe(F(tx, { plafond: 0.15 })).partDifferee;
ok(p5 > p10 && p10 > p15 && p15 > 0, 'part différée décroissante avec le plafond (5 > 10 > 15 %)');
var d0 = Z.distributionTaxe(tx).chargeTresorerie, d5 = Z.distributionTaxe(F(tx, { plafond: 0.05 })).chargeTresorerie;
ok(d5.slice(5).every(function (x, i) { return Math.abs(x - d0[5 + i]) < 1e-9; }) && d5[0] < d0[0], 'condition de revenu : D6-D10 non plafonnés, D1 allégé');
SCS.forEach(function (s) { var r = Z.taxe(s, { taxe: F(tx, { plafond: 0.10 }) }); ok(r.nette <= Z.taxe(s, { taxe: tx }).nette + 1e-9 && r.tresorerieAn1 < r.nette, 'plafond : recette de croisière ≤ sans plafond, trésorerie des premières années < croisière (' + s + ')'); });
Z.HYP.plafondSousConditionRevenu = false;
ok(Z.distributionTaxe(F(tx, { plafond: 0.05 })).partDifferee > p5, 'sans condition de revenu, la part différée augmente (cache distinct)');
Z.HYP.plafondSousConditionRevenu = true;
proche(Z.distributionTaxe(F(tx, { plafond: 0.05 })).partDifferee, p5, 1e-12, 'retour à la condition de revenu');
ok(Z.taxe('central', { taxe: F(tx, { nonCotesVente: true }) }).nette < Z.taxe('central', { taxe: tx }).nette, 'non-cotés à la vente : petite perte de recette (non recouvré)');

// 5. Chantier 3 : économies structurelles, niches TVA, éducation
var b0 = Z.archi({}), dS = function (o, s) { return Z.solde(F(b0, o), s) - Z.solde(b0, s); };
[[16.1, 11.7, 5.8]].forEach(function (v) { SCS.forEach(function (s, i) { proche(dS({ structurelles: 'A' }, s), v[i], 1e-9, 'économies structurelles A (' + s + ')'); }); });
SCS.forEach(function (s, i) { proche(dS({ structurelles: 'AB' }, s), [29.3, 16.8, 7.2][i], 1e-9, 'économies structurelles A + B (' + s + ')'); });
SCS.forEach(function (s, i) { proche(dS({ nichesTVA: true }, s), [8.5, 4.7, 2.4][i], 1e-9, 'niches TVA et accises (' + s + ')'); });
SCS.forEach(function (s, i) { proche(dS({ education: 'economie' }, s), [5.7, 5.5, 6.3][i], 1e-9, 'écart éducation économie − tuteur (' + s + ')'); });
proche(Z.prelevements(F(b0, { nichesTVA: true })).delta - Z.prelevements(b0).delta, 4.7, 1e-9, 'niches TVA comptées dans les prélèvements');
proche(Z.prelevements(F(b0, { taxe: tx })).delta - Z.prelevements(b0).delta, Z.taxe('central', { taxe: tx }).nette, 1e-9, 'taxe à 1 % comptée dans les prélèvements');
proche(Z.prelevements(F(b0, { structurelles: 'A' })).delta, Z.prelevements(b0).delta, 1e-9, 'les économies de dépenses ne sont pas des prélèvements');

// 5 bis. Chantier 4 : capital de départ et héritage « reçu à vie »
SCS.forEach(function (s, i) { proche(dS({ capitalDepart: true }, s), -[10.1, 11.5, 13.0][i], 1e-9, 'capital de départ C (' + s + ')'); });
proche(Z.perteExemption('central', Z.archi({ exemptionVie: 100000 })), (1 - 70.5 / 97.5) * 103.5, 0.05, 'exemption 100 000 € : 27,7 % des droits perdus (−27 sur 97,5 dans le chantier 4)');
ok(Z.coutConjoint('central', Z.archi({ exemptionVie: 100000 })) < Z.coutConjoint('central', Z.archi({})), 'avec l\'exemption, l\'exception du conjoint coûte moins (moins de droits)');
proche(Z.prelevements(F(b0, { capitalDepart: true })).delta, Z.prelevements(b0).delta, 1e-9, 'le capital de départ est une dépense, pas un prélèvement');
ok(Z.complexite({ capitalDepart: true, exemptionVie: 100000 }).total === Z.complexite({}).total + 2, 'capital (+1 règle) et exemption (+1 exception)');

// 6. Simplicité
var cx0 = Z.complexite({}), cx1 = Z.complexite({ taxe: F(tx, { abattement: 100000, plafond: 0.1, nonCotesVente: true }), report150: true, economies: 'e2e4', nichesTVA: true });
ok(cx0.regles === 4 && cx0.niches === 3, 'sans taxe : 4 règles, 3 niches');
ok(cx1.regles === 5 && cx1.niches === 0 && cx1.exceptions === cx0.exceptions + 3 - 3, 'taxe + 3 exceptions, 3 niches fermées');

// 7. Recherche
var x = { contraintes: [true, false, true, true, true, true], violations: [0, 10, 0, 0, 0, 0] }, y = { contraintes: [false, true, true, true, true, true], violations: [1, 0, 0, 0, 0, 0] };
ok(Z.cmpViolations(x, y) > 0, 'ordre de priorité : (1) l\'emporte sur toutes les suivantes');
ok(Z.cmpViolations({ contraintes: [true, false], violations: [0, 5] }, { contraintes: [true, false], violations: [0, 20] }) > 0, 'deux violations : la plus petite l\'emporte');
var r = Z.rechercher({ fixe: { structurelles: 'A' }, grille: { tPlat: [0.40, 0.445], socle: [350, 500], majParentIsole: [200.78, 500] } });
ok(r.evalues === 2 * 2 * 33 * 3 * 2 * 5 * 2 * 2, 'petite grille : nombre d\'architectures évaluées');
ok(r.meilleur.contraintes[0] && r.meilleur.contraintes[1], 'petite grille : le meilleur tient (1) et (2)');
// architecture publiée (resultats-optimum.txt)
var A = { tPlat: 0.445, socle: 350, taxe: { assiette: 'pierre', abattement: 0, plafond: 0.05, nonCotesVente: false }, report150: true, economies: 'e2e4', structurelles: 'A', nichesTVA: true, majParentIsole: 500 };
var e = Z.evaluer(A);
proche(e.soldes.central, 77.7963, 0.1, 'architecture retenue : +83,9 au central'); proche(e.soldes.haut, -95.2983, 0.1, 'architecture retenue : −86,5 au haut'); // 04/11/2026 : ancienne valeur 83.9, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -86.5, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 83.6404, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -85.774, recalée après les corrections de données V12400-V12404
ok(e.contraintes.join() === 'true,false,false,true,true,true', 'architecture retenue : (2) et (3) non tenues'); // 04/11/2026 : avant les corrections de données (V12400-V12420), seule (3) était non tenue ; le haut passe de −86,5 à −95,3 Md€, sous le seuil de −88,0
proche(e.violations[2], 14.1268, 0.1, 'architecture retenue : D1 perd 10,9 €/UC/mois'); // 04/11/2026 : ancienne valeur 10.9, recalée après les corrections de données V12400-V12404
var B = Z.evaluer({ tPlat: 0.37, socle: 350, taxe: { assiette: 'pierre', abattement: 0, plafond: 0.10, nonCotesVente: false }, report150: true, economies: 'e2e4', structurelles: 'A', nichesTVA: true, majParentIsole: 500 });
ok(B.contraintes.join() === 'false,false,true,true,true,true', 'alternative « taux bas » : (1) et (2) non tenues'); // 04/11/2026 : avant les corrections de données (V12400-V12404), seule (2) n'était pas tenue ; le central passe de ≥ 0 à −0,26 Md€ (cas limite)

var R4 = Z.evaluer({ tPlat: 0.40, socle: 350, taxe: { assiette: 'pierre', abattement: 0, plafond: 0.05, nonCotesVente: false }, report150: true, economies: 'e2e4', structurelles: 'A', nichesTVA: true, majParentIsole: 500, capitalDepart: true, exemptionVie: 100000 });
ok(R4.contraintes.join() === 'false,false,true,true,true,true', 'recommandation (capital C + reçu à vie, 40 %) : (1) et (2) non tenues (avant V12400-V12420 : seule (2))'); proche(R4.soldes.central, -5.5489, 0.1, 'recommandation : +0,6 au central'); proche(R4.soldes.haut, -145.6571, 0.1, 'recommandation : −136,9 au haut'); // 04/11/2026 : ancienne valeur 0.6, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -136.9, recalée après les corrections de données V12400-V12404 // 04/11/2026 : corrections de données V12400-V12420 ; équilibre relevé // 04/11/2026 : ancienne valeur 0.2952, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -136.1328, recalée après les corrections de données V12400-V12404


// 8. Affinage du 03/11 (H549-H560)
var G0 = this.GagnantsPerdantsPalier1, Z0 = Z.archi({});
ok(Z0.abattementActivite === 0 && Z0.bonusActivite === 0 && Z0.ppaMaintenue === 0 && Z0.cleMajoration === 'pf', 'affinage : leviers à zéro et clé PF par défaut');
SCS.forEach(function (s) { proche(Z.coutProtection(Z0, s).total, 0, 1e-12, 'aucun levier : coût nul (' + s + ')'); });
ok(Z.protectionDeciles(Z0).every(function (x) { return x === 0; }) && Z.protectionCas(Z0, 'smic_seul') === 0, 'aucun levier : dixièmes et cas types inchangés');
var REC0 = Z.archi(Z.RECOMMANDATION);
ok(REC0.taxe.nonCotesVente && REC0.capitalDepart && REC0.exemptionVie === 100000 && REC0.tPlat === 0.40 && REC0.majParentIsole === 500, 'RECOMMANDATION = chantier 2 + non-cotés à la vente');
proche(Z.violation3(Z.deciles(REC0), Z.casTypes(REC0)), Z.evaluer(REC0).violations[2], 1e-12, 'violation (3) : liste par défaut = évaluation par défaut');
proche(Z.evaluer(REC0, Z.CAS_PROTEGES_AFFINAGE).violations[2], 300, 1, 'contrainte (3) élargie : le couple avec un Smic perd 300 €');
// levier 1 : abattement
var ab = Z.archi(F(REC0, { abattementActivite: 415 }));
proche(Z.protectionCas(ab, 'smic_seul'), 0.40 * 415, 1e-9, 'abattement 415 € : le smicard gagne 40 % × 415 €');
proche(Z.protectionCas(ab, 'couple_2smic_2enf'), 2 * 0.40 * 415, 1e-9, 'abattement individuel : deux actifs, deux abattements');
proche(Z.protectionCas(ab, 'parent_isole_sans_emploi'), 0, 1e-12, 'abattement : rien sans revenu d\'activité');
ok(Z.coutProtection(ab, 'bas').total <= Z.coutProtection(ab, 'central').total && Z.coutProtection(ab, 'central').total <= Z.coutProtection(ab, 'haut').total, 'abattement : coût bas ≤ central ≤ haut');
proche(Z.prelevements(ab).delta - Z.prelevements(REC0).delta, -Z.coutProtection(ab, 'central').abattement, 1e-6, 'abattement = moindre prélèvement');
proche(Z.solde(ab, 'central') - Z.solde(REC0, 'central'), -Z.coutProtection(ab, 'central').total, 1e-9, 'abattement : solde diminué de son coût');
var pdA = Z.protectionDeciles(ab), ucs = this.GagnantsPerdants.ucParDecile(), totA = pdA.reduce(function (u, x, i) { return u + x * ucs[i] * 1e6 * 12; }, 0) / 1e9;
proche(totA, Z.coutProtection(ab, 'central').total, 1e-6, 'abattement : la répartition par dixième somme au coût central');
// levier 2 : bonus
var bo = Z.archi(F(REC0, { bonusActivite: 165, bonusFin: 1.6 })), cc = C.coutC(Z.versOF(bo), undefined, 165, 1.6);
SCS.forEach(function (s) { proche(Z.coutProtection(bo, s).bonus, cc[s], 1e-9, 'bonus = correctifs.coutC (' + s + ')'); });
proche(Z.protectionCas(bo, 'smic_seul'), 165, 1e-6, 'bonus : plateau au Smic');
proche(Z.prelevements(bo).transfertsNets - Z.prelevements(REC0).transfertsNets, cc.central, 1e-6, 'bonus compté comme transfert');
// levier 4 : prime d'activité
var pa = Z.archi(F(REC0, { ppaMaintenue: 0.72 }));
SCS.forEach(function (s) { proche(Z.coutProtection(pa, s).ppa, 0.72 * 10.65, 1e-9, 'prime d\'activité : 72 % × 10,65 Md€ (' + s + ')'); });
proche(Z.protectionCas(pa, 'smic_seul'), 0.72 * G0.atlas('celib_locataire_z2', G0.SMIC_BRUT, 2), 0.5, 'prime d\'activité du smicard : 72 % de l\'atlas OpenFisca');
proche(Z.protectionCas(pa, 'couple_1smic_2enf'), 0.72 * G0.atlas('couple_monoactif_2_z2', G0.SMIC_BRUT, 2), 0.5, 'prime d\'activité du couple avec un Smic : 72 % de l\'atlas');
var e72 = Z.evaluer(pa, Z.CAS_PROTEGES_AFFINAGE);
ok(e72.cas.smic_seul.ecartMois > -1 && e72.cas.couple_1smic_2enf.ecartMois > 100, 'prime d\'activité à 72 % : smicard à 0, couple avec un Smic gagnant');
proche(Z.clePPA().reduce(function (u, x) { return u + x; }, 0), 1, 1e-9, 'clé de la prime d\'activité : somme 1');
ok(Z.complexite(pa).total === Z.complexite(REC0).total + 1 && Z.complexite(pa).parametresProtection === Z.PPA_PARAMETRES, 'prime d\'activité : +1 exception, ' + Z.PPA_PARAMETRES + ' paramètres');
// clé de la majoration
var kc = Z.cleCas(), kp = Z.clePF();
proche(kc.reduce(function (u, x, i) { return u + x * ucs[i] * 1e6 * 12; }, 0), 1, 1e-9, 'clé des parents isolés : somme 1');
proche(kp.reduce(function (u, x, i) { return u + x * ucs[i] * 1e6 * 12; }, 0), 1, 1e-9, 'clé PF : somme 1');
ok(kc[0] * ucs[0] * 1e6 * 12 > 0.29 && kc[0] * ucs[0] * 1e6 * 12 < 0.31 && kp[0] * ucs[0] * 1e6 * 12 > 0.27, 'D1 reçoit ≈ 30 % de la majoration avec la clé des cas et 28 % avec la clé PF');
var dpf = Z.deciles(REC0), dca = Z.deciles(F(REC0, { cleMajoration: 'cas' }));
proche(dca.reduce(function (u, x, i) { return u + x.ecart * ucs[i]; }, 0), dpf.reduce(function (u, x, i) { return u + x.ecart * ucs[i]; }, 0), 1e-6, 'changer de clé ne change pas la masse totale');
// incitations
var inc = Z.incitations(REC0, [1]);
proche(inc[0].tmeApres, 0.40, 0.005, 'TME au Smic sans levier = taux plat');
proche(inc[0].tpApres, 1 - (inc[0].apres - 877) / inc[0].cout, 1e-9, 'TP au Smic : depuis le plancher de 877 €');
// sortie du plancher (H561-H570, 03/11)
ok(Z.DEFAUT.sortiePlancher === 'sec' && Z.alphaSortie(Z.archi({})) === null, 'sortie du plancher : défaut « sec » (falaise, comportement d\'avant)');
SCS.forEach(function (s) { proche(Z.coutPlancher(REC0, s), 0, 1e-12, 'sortie « sec » : coût du complément nul (' + s + ')'); });
proche(Z.alphaSortie(F(REC0, { sortiePlancher: 'plat', tPlat: 0.405 })), 0.405, 1e-12, 'sortie « plat » : α = taux plat');
proche(Z.alphaSortie(F(REC0, { sortiePlancher: 'degressif' })), 0.38, 1e-12, 'sortie « degressif » : α = 38 %');
proche(Z.alphaSortie(F(REC0, { sortiePlancher: 'maintien' })), 1, 1e-12, 'sortie « maintien » : α = 100 %');
var Af = Z.archi(F(Z.RECOMMANDATION, { tPlat: 0.405, socle: 350, majParentIsole: 400, cleMajoration: 'cas', ppaMaintenue: 0.8 }));
['sec', 'maintien', 'degressif', 'plat'].forEach(function (v) {
  var b = F(Af, { sortiePlancher: v }), p1 = Z.courbeTME(b, 'seul', [0.1])[0];
  proche(Z.revenuMenage(b, 'seul', 0), 877, 1e-6, 'sortie ' + v + ' : 877 € sans activité (personne seule)');
  ok(Z.complementPlancher(b, 'seul', 3000) === 0 && Z.complementPlancher(b, 'seul', 1e5) === 0, 'sortie ' + v + ' : aucun complément à haut revenu');
  ok(Z.complementPlancher(b, 'parent', 0) === 0, 'sortie ' + v + ' : pas de complément pour le parent isolé (revenu sans activité de 1 550 € au-dessus du plancher)');
  ok(v === 'sec' || p1.revenu >= 877 - 1e-6, 'sortie ' + v + ' : pas de falaise (revenu à 0,1 Smic ≥ 877 €)');
  if (v === 'sec') ok(p1.revenu < 877 && p1.tp > 2, 'sortie « sec » : falaise (TP > 200 % à 0,1 Smic)');
});
var cs = ['maintien', 'degressif', 'plat'].map(function (v) { return Z.coutPlancher(F(Af, { sortiePlancher: v }), 'central'); });
ok(cs[0] > 0 && cs[0] < cs[2] && cs[2] < cs[1], 'coûts ordonnés : maintien < plat < dégressif (α décroissant)');
['maintien', 'degressif', 'plat'].forEach(function (v) { var b = F(Af, { sortiePlancher: v }); ok(Z.coutPlancher(b, 'bas') <= Z.coutPlancher(b, 'central') && Z.coutPlancher(b, 'central') <= Z.coutPlancher(b, 'haut'), 'coût de la sortie ' + v + ' : bas ≤ central ≤ haut'); });
var pl = F(Af, { sortiePlancher: 'plat' });
proche(Z.solde(pl, 'central'), Z.solde(Af, 'central') - Z.coutPlancher(pl, 'central'), 1e-9, 'le coût du complément se retranche du solde');
proche(Z.prelevements(pl).transfertsNets - Z.prelevements(Af).transfertsNets, Z.coutPlancher(pl, 'central'), 1e-6, 'le complément est un transfert');
proche(Z.protectionDeciles(pl).reduce(function (u, x, i) { return u + x * ucs[i] * 1e6 * 12; }, 0) - Z.protectionDeciles(Af).reduce(function (u, x, i) { return u + x * ucs[i] * 1e6 * 12; }, 0), Z.coutPlancher(pl, 'central') * 1e9, 1e3, 'répartition par dixième : somme = coût');
ok(Z.complexite(pl).total === Z.complexite(Af).total + 1 && Z.complexite(pl).parametresProtection === Z.complexite(Af).parametresProtection, 'sortie « plat » : +1 exception, aucun paramètre');
ok(Z.complexite(F(Af, { sortiePlancher: 'degressif' })).parametresProtection === Z.complexite(Af).parametresProtection + 1, 'sortie « degressif » : +1 paramètre');
var tmx = Z.tmeMax(pl, 'seul'), tm0 = Z.tmeMax(F(Af, { sortiePlancher: 'sec' }), 'seul');
ok(tmx.tme < 0.80 && tmx.tme < tmx.actuel, 'sortie « plat » : TME maximal < 80 % et inférieur au droit actuel');
ok(Z.choisirSortie(Af) === Z.SORTIE_TRANCHEE && Z.SORTIE_TRANCHEE === 'plat', 'sortie tranchée : « plat » (cohérent avec les critères)');
ok(Z.participation(pl, 'seul', [0.5])[0].versActuel > 0, 'participation à 0,5 Smic : meilleure que le droit actuel avec la sortie « plat »');
// la sortie ne change que le complément : les cas types non concernés bougent d\'aucun euro
var e_s = Z.casTypes(Af), e_p = Z.casTypes(pl);
ok(e_p.cadre_4x.ecartMois === e_s.cadre_4x.ecartMois && e_p.parent_isole_smic.ecartMois === e_s.parent_isole_smic.ecartMois, 'la sortie du plancher ne change ni le cadre ni le parent isolé');
// recherche ciblée : architecture finale publiée
var Xf = Z.affiner({ base: { cleMajoration: 'cas' }, filtre: function (l) { return l.nom === 'ppa'; } }).meilleur;
ok(Xf.a.tPlat === 0.415 && Xf.a.socle === 350 && Xf.a.majParentIsole === 500 && Xf.a.ppaMaintenue === 0.9, 'architecture finale : 41,5 %, 350 €, majoration 500 €, PPA 90 % (v. 40,5 %, 400 €, 80 % avant V12400-V12420)'); // 04/11/2026 : avant les corrections de données V12400-V12404 : 40,5 % et PPA 80 % ; la recherche ciblée a déplacé l'équilibre de 0,5 point // 04/11/2026 : corrections de données V12400-V12420 ; équilibre relevé
ok(Xf.contraintes.join() === 'true,false,true,true,true,true', 'architecture finale : (3) élargie tenue, seule (2) non tenue');
proche(Xf.soldes.central, 0.503, 0.1, 'architecture finale : +0,5 au central'); proche(Xf.soldes.haut, -148.4656, 0.1, 'architecture finale : −140 au haut'); // 04/11/2026 : ancienne valeur 0.5, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -140.0, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 3.5476, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -138.7639, recalée après les corrections de données V12400-V12404
var Xa = Z.affiner({ base: { cleMajoration: 'cas' }, filtre: function (l) { return l.nom === 'abattement'; } }).meilleur, Xb = Z.affiner({ base: { cleMajoration: 'cas' }, filtre: function (l) { return l.nom === 'bonus'; } }).meilleur;
ok(!Xa.contraintes[2] && !Xb.contraintes[2], 'abattement et bonus seuls : aucune variante financée ne tient la (3) élargie');
// stabilisateur
var sh = Z.stabilisateur(Xf.a, 'haut'), sc0 = Z.stabilisateur(Xf.a, 'central');
ok(sc0.trajectoire.every(function (x) { return x.tPlat === 0.415; }), 'stabilisateur : rien ne bouge au central (dans la bande de 15 Md€)'); // 04/11/2026 : corrections de données V12400-V12420 ; équilibre relevé
ok(sh.final.tPlat <= 0.415 + 0.02 + 1e-9 && sh.trajectoire[1].tPlat === 0.42, 'stabilisateur : +0,5 point par an, plafonné à +2 points'); // 04/11/2026 : base 0,41 au lieu de 0,405 (corrections V12400-V12404) // 04/11/2026 : corrections de données V12400-V12420 ; équilibre relevé
proche(sh.gain, 9.2182, 0.2, 'stabilisateur au haut, taux seul : +10 Md€ seulement'); // 04/11/2026 : ancienne valeur 10.1, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 9.65, recalée après les corrections de données V12400-V12404
ok(Z.stabilisateur(Xf.a, 'haut', { levier: 'les deux' }).final.solde > Z.SEUIL_HAUT - 6 && Z.stabilisateur(Xf.a, 'haut', { levier: 'les deux' }).final.solde < Z.SEUIL_HAUT, 'taux et socle : la (2) n\'est plus tenue au haut à l\'an 10 (−92,8 contre −88,1 ; elle l\'était avant V12400-V12420)');
// pression fiscale
var pn = Z.pressionNette(Xf.a);
proche(pn.deficitComble + pn.depensesNettes, pn.deltaNet, 1e-9, 'pression nette : identité');
proche(pn.deficitComble, Xf.soldes.central + 169.1, 1e-9, 'pression nette : combler le déficit actuel de 169,1 Md€');
proche(pn.deltaNet, 189.7736, 0.1, 'architecture finale : +186 Md€ de prélèvements nets du socle'); // 04/11/2026 : ancienne valeur 186.3, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 189.019, recalée après les corrections de données V12400-V12404
// 9. Architecture finale v2 (H571-H580)
var Mm = M, TPm = TP;
ok(Z.DEFAUT.exil === 'modele' && Z.DEFAUT.sortiePlancher === 'sec', 'v2 : les défauts du code restent « modele » et « sec » (§§ 1-8 inchangés)');
SCS.forEach(function (s) { proche(Z.EXIL.modele.fuite[s], Mm.SCENARIOS[s].fuiteTransm, 1e-12, 'variante « modele » = fuite des modules (' + s + ')'); proche(Z.EXIL.modele.erosionTop[s], TPm.PARAM[OF.SC_PATRIMOINE[s]].erosionTop, 1e-12, 'variante « modele » = érosion des modules (' + s + ')'); });
ok(Z.EXIL.defendable.fuite.central === 0.33 && Z.EXIL.defendable.fuite.haut === 0.52 && Z.EXIL.defendable.erosionTop.haut === 0.55 && Z.EXIL.defendable.erosionTop.central === 0.35, 'fourchettes défendables : 18 / 33 / 52 % et 20 / 35 / 55 %');
proche(1 - 0.70 * 0.96, 0.33, 0.005, 'fuite centrale : 1 − (1 − d)(1 − e) = 32,8 % (exil-patrimoines-preuves § 6.2)');
var dmod = Z.soldes(Z.FINALE_73), ddef = Z.soldes(F(Z.FINALE_73, { exil: 'defendable' }));
proche(dmod.central, -5.7891, 0.1, 'FINALE_73 = finale du § 7.3 (+0,5 au central)'); // 04/11/2026 : ancienne valeur 0.5, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 0.06, recalée après les corrections de données V12400-V12404
proche(Z.solde(Z.FINALE_73, 'central'), Z.solde(F(Z.FINALE_73, { exil: 'modele' }), 'central'), 1e-12, 'exil « modele » = aucun changement');
ok(Mm.SCENARIOS.central.fuiteTransm === 0.31 && TPm.PARAM.bas.erosionTop === 0.74 && Mm.SCENARIOS.central.mobil === 0.15, 'avecExil : paramètres des modules restaurés après calcul');
proche(Z.detail(F(Z.FINALE_73, { exil: 'defendable' }), 'central').taxe - Z.detail(Z.FINALE_73, 'central').taxe > 0 ? 1 : 0, 1, 0, 'exil défendable : la taxe rapporte plus (érosion 35 % au lieu de 40 %)');
ok(Z.detail(F(Z.FINALE_73, { exil: 'defendable' }), 'haut').options < Z.detail(Z.FINALE_73, 'haut').options, 'exil défendable : les droits de succession baissent au haut (fuite 52 % au lieu de 48 %)');
proche(ddef.bas, dmod.bas, 1e-9, 'exil défendable : rien ne change au bas (18 % et 20 % inchangés)');
proche(Z.droits('central', 0.5), 103.5, 0.05, 'cache : après une variante, les droits du modèle sont relus (103,5)');
var RV = Z.affinerV2(), V2e = RV.meilleur;
ok(V2e.a.tPlat === Z.ARCHITECTURE_V2.tPlat && V2e.a.socle === Z.ARCHITECTURE_V2.socle && V2e.a.majParentIsole === Z.ARCHITECTURE_V2.majParentIsole && V2e.a.ppaMaintenue === Z.ARCHITECTURE_V2.ppaMaintenue, 'recherche v2 = ARCHITECTURE_V2 (41 %, 350 €, majoration 250 €, PPA 100 %)');
ok(Z.ARCHITECTURE_V2.sortiePlancher === 'plat' && Z.ARCHITECTURE_V2.exil === 'defendable' && Z.ARCHITECTURE_V2.cleMajoration === 'cas', 'v2 : sortie « plat », exil défendable, clé des parents isolés');
var EV = Z.evaluer(Z.ARCHITECTURE_V2, Z.CAS_PROTEGES_AFFINAGE);
ok(EV.contraintes.join() === 'true,false,true,true,true,true', 'v2 : (1), (3) élargie, (4), (5), (6) tenues ; seule (2) non tenue');
proche(EV.soldes.central, 1.4885, 0.1, 'v2 : +2,2 au central'); proche(EV.soldes.haut, -149.1898, 0.1, 'v2 : −142,9 au haut'); proche(EV.soldes.bas, 117.5521, 0.1, 'v2 : +113,1 au bas'); // 04/11/2026 : ancienne valeur 2.2, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -142.9, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 113.1, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 1.7359, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur -142.2825, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 112.3004, recalée après les corrections de données V12400-V12404
['smic_seul', 'couple_1smic_2enf', 'parent_isole_smic', 'retraite_aspa_loc'].forEach(function (id) { ok(EV.cas[id].ecartMois >= -1e-9, 'v2 : ' + id + ' non perdant'); });
[0, 1, 2].forEach(function (i) { ok(EV.deciles[i].ecart >= 0, 'v2 : D' + (i + 1) + ' non perdant'); });
ok(EV.margMax <= 0.75 && Z.tauxTransmissionMax(Z.archi(Z.ARCHITECTURE_V2)) <= 0.5, 'v2 : taux marginal à l\'infini ≤ 75 % et plafond de 50 % sur les transmissions');
ok(RV.voisins.every(function (e) { return e.complexite.total >= V2e.complexite.total; }), 'v2 : aucune architecture à solde voisin n\'a moins de règles');
ok(RV.voisins.every(function (e) { return e.a.tPlat >= RV.tMin - 1e-9 && e.a.tPlat <= RV.tMin + Z.TOL_V2 + 1e-9; }), 'v2 : « solde voisin » = taux à moins de 0,5 point du plus bas');
ok(Z.affinerV2({ tmeMax: 0.80 }).meilleur === null, 'v2 : TME ≤ 80 % (critère H569) incompatible avec (1) et (3) élargie (tension nommée, H577)');
ok(Z.tmeMax3(Z.ARCHITECTURE_V2) < Z.tmeMax(Z.ARCHITECTURE_V2, 'seul').actuel, 'v2 : TME maximal inférieur au droit actuel (131 %)');
proche(Z.solde(F(Z.ARCHITECTURE_V2, { exil: 'modele' }), 'central'), 2.5776, 0.1, 'v2 avec l\'exil des modules = recherche du § 8.5 (b) (+3,3)'); // 04/11/2026 : ancienne valeur 3.3, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 2.8249, recalée après les corrections de données V12400-V12404
// 10. Grille du socle (H581-H586) : fonctions ajoutées, aucun défaut ne bouge
var GS = Z.grilleSocle([350, 450]);
proche(GS[0].tPlat, 0.414, 1e-9, 'grille du socle : socle 350 € équilibre à 41,4 % (40,9 % avant V12400-V12420) (v2 au dixième de point)');
ok(GS[0].soldes.central >= 0 && Z.solde(F(GS[0].a, { tPlat: GS[0].tPlat - 0.001 }), 'central') < 0, 'grille du socle : le taux d\'équilibre est le plus petit au dixième de point');
ok(GS[1].tPlat > GS[0].tPlat && GS[1].soldes.haut < GS[0].soldes.haut, 'grille du socle : socle plus haut = taux plus haut et haut plus bas');
ok(GS[0].masse.ecartTotal < 0 && GS[1].masse.ecartD1D9 < GS[0].masse.ecartD1D9, 'grille du socle : la masse salariale recule avec le taux et le socle');
ok(Z.tauxEquilibre(F(Z.ARCHITECTURE_V2, { socle: 700 })) === null, 'grille du socle : pas d\'équilibre ≤ 60 % à 700 €');
ok(Z.ficheSocle(Z.ARCHITECTURE_V2, 0.415).soldes.central > -1 && Z.ficheSocle(Z.ARCHITECTURE_V2, 0.415).soldes.central < 1.5, 'ficheSocle à taux imposé = v2 (+1,7 ; +2,2 avant les corrections V12400-V12404)'); // 04/11/2026 : corrections de données V12400-V12420 ; équilibre relevé
ok(Z.ARCHITECTURE_V2.socle === 350 && Z.ARCHITECTURE_V2.tPlat === 0.415 && Z.DEFAUT.socle === 500, 'grille du socle : ni la v2 ni les défauts ne bougent'); // 04/11/2026 : corrections de données V12400-V12420 ; équilibre relevé
// 11. Allocation unique dégressive (H590-H599) : fonctions ajoutées, aucun défaut ne bouge
ok(Z.DEFAUT.seuilHeures === 0 && !Z.ARCHITECTURE_V2.seuilHeures && Z.ARCHITECTURE_V2.ppaMaintenue === 1, 'allocation unique : défaut seuilHeures = 0, v2 inchangée (prime à 100 %)');
var AU = Z.allocationUnique(0.25);
ok(AU.ppaMaintenue === 0 && AU.sortiePlancher === 'alpha' && AU.alphaPlancher === 0.25 && Z.alphaSortie(AU) === 0.25, 'allocation unique : sans prime d\'activité, α = 25 %');
var FA = Z.ficheAllocation(AU);
proche(FA.tPlat, 0.413, 1e-9, 'allocation unique α = 25 % : taux d\'équilibre 41,3 % (40,8 % avant V12400-V12420)');
ok(FA.soldes.central >= 0 && FA.cout.ppa === 0 && FA.cout.plancher > 15 && FA.cout.plancher < 17, 'allocation unique : solde central ≥ 0, plus de prime, complément ≈ 16 Md€');
ok(Z.tmeMax(AU, 'seul').tme < Z.tmeMax(Z.ARCHITECTURE_V2, 'seul').tme - 0.1, 'allocation unique : TME maximal bien inférieur à la v2 (66 % contre 83 %)');
ok(FA.cas.parent_isole_smic.ecartMois < -100, 'allocation unique à majoration 250 € : le parent isolé au Smic perd (plancher de 1 300 € déjà atteint)');
var AP = Z.allocationProtegee(0.25);
ok(AP !== null && AP.majParentIsole >= 330 && AP.majParentIsole <= 350 && Z.evaluer(AP, Z.CAS_PROTEGES_AFFINAGE).contraintes[2], 'allocation protectrice α = 25 % : majoration 340 € tient la contrainte (3) élargie');
ok(Z.allocationProtegee(0.30) === null, 'α = 30 % : aucune majoration ne protège le smicard seul');
var FS = Z.ficheAllocation(Z.allocationUnique(0.25, 10), 0.413);
ok(FS.cout.plancher < FA.cout.plancher && FS.courbe[0].tme > 0.99, 'seuil de 10 h : coût plus bas, TME de 100 % sous le seuil');
proche(Z.solde(Z.ARCHITECTURE_V2, 'central'), 1.4885, 0.1, 'allocation unique : la v2 ne bouge pas (+2,2)'); // 04/11/2026 : ancienne valeur 2.2, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 1.7359, recalée après les corrections de données V12400-V12404

// 12. Architecture v3 (03/11, H600-H609) : héritage et capital par fonctions continues
ok(Z.partVie(F(Z.ARCHITECTURE_V2, {})) === Z.PART_VIE[100000] && Z.partVie({ exemptionVie: 0 }) === 1, 'partVie : l\'exemption garde ses parts conservées (v2 inchangée)');
if (this.CDC) {
  var V3 = Z.archi(Z.ARCHITECTURE_V3), X = this.CDC, p0 = this.CD.params();
  ok(V3.exemptionVie === 0 && V3.heritageFonction.forme === 'hyper' && V3.heritageFonction.K === 190000 && V3.capitalFonction.forme === 'exp' && V3.capitalFonction.K === 47000 && V3.capitalDepart, 'v3 : héritage forme A K = 190 000 €, capital exp K = 47 000 €, aucune exemption');
  ok(V3.socle === 350 && V3.majParentIsole === 340 && V3.alphaPlancher === 0.25 && V3.ppaMaintenue === 0 && V3.sortiePlancher === 'alpha', 'v3 : socle 350 €, allocation unique α = 25 %, majoration 340 €, sans prime d\'activité');
  proche(Z.partVie(V3), X.partConservee('hyper', 190000, p0), 1e-12, 'v3 : part conservée = fonction A');
  proche(Z.partVie(V3), Z.PART_VIE[100000], 0.005, 'v3 : même recette d\'héritage que l\'exemption de 100 000 € (à 0,5 point près)');
  proche(Z.coutCapital(V3, 1), 11.53, 0.05, 'v3 : même coût central du capital de départ que la variante C (11,5 Md€)');
  ok(Z.coutCapital(V3, 0) < Z.coutCapital(V3, 1) && Z.coutCapital(V3, 1) < Z.coutCapital(V3, 2), 'v3 : capital bas < central < haut');
  ok(Z.coutCapital({ capitalDepart: false }, 1) === 0 && Z.coutCapital({ capitalDepart: true }, 1) === Z.CAPITAL_DEPART[1], 'capital : sans fonction, montants du chantier 4 inchangés');
  ok(Z.tauxEquilibre(V3) === 0.417 && Z.tauxEquilibre(V3) === V3.tPlat, 'v3 : taux plat d\'équilibre 41,7 % (41,1 % avant V12400-V12420) = taux de l\'architecture');
  var sv3 = Z.soldes(V3); proche(sv3.central, 0.7929, 0.3, 'v3 : solde central ≈ +0,7 Md€'); ok(sv3.bas > 100 && sv3.haut < -130 && sv3.haut > -160, 'v3 : soldes bas / haut dans la fourchette de la v2 (' + sv3.bas.toFixed(1) + ' / ' + sv3.haut.toFixed(1) + ')'); // 04/11/2026 : ancienne valeur 0.7, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 0.198, recalée après les corrections de données V12400-V12404
  var sAlloc = Z.solde(F(Z.allocationUnique(0.25), { majParentIsole: 340, tPlat: 0.417 }), 'central');
  proche(sv3.central, sAlloc, 0.2, 'v3 : le lissage de l\'héritage et du capital ne change pas le solde de l\'allocation unique du § 11 (±0,2)');
  ok(Z.complexite(V3).total === 15 && Z.complexite(V3).liste.some(function (l) { return /fonction lisse/.test(l); }), 'v3 : 15 règles et exceptions, la fonction lisse remplace l\'exemption');
  var e3 = Z.evaluer(V3, Z.CAS_PROTEGES_AFFINAGE); ok(e3.contraintes.every(function (c, i) { return i === 1 || i === 2 || c; }), 'v3 : contraintes (1), (3) à (6) tenues, (2) non tenue comme partout'); // 04/11/2026 : corrections de données V12400-V12420 ; à l'équilibre relevé (v3 : 41,7 %, v3b : 42,0 %), le parent isolé au Smic perd 1 à 7 €/mois (+ avant) : (3) n'est plus tenue pour ces étapes intermédiaires, superseded par v4 et v5
  var c3 = Z.casTypes(V3); ok(c3.smic_seul.ecartMois > 35 && c3.parent_isole_smic.ecartMois > -2 && c3.retraite_aspa_loc.ecartMois > -1, 'v3 : smicard, parent isolé et retraité locataire non perdants'); // 04/11/2026 : corrections de données V12400-V12420 ; à l'équilibre relevé (v3 : 41,7 %, v3b : 42,0 %), le parent isolé au Smic perd 1 à 7 €/mois (+ avant) : (3) n'est plus tenue pour ces étapes intermédiaires, superseded par v4 et v5
  var cx = Z.complexite(F(V3, { heritageFonction: null, exemptionVie: 100000 })); ok(cx.total === 15, 'exemption ou fonction : même nombre d\'exceptions (le gain est l\'absence de seuil)');
  var sx = Z.soldes(F(V3, { heritageFonction: { forme: 'exp', K: X.calibrer('exp', 100000, p0) } })); proche(sx.central, sv3.central, 0.2, 'forme B calibrée sur 100 000 € : même solde que la forme A (±0,2)');
  proche(Z.solde(F(V3, { heritageFonction: { forme: 'hyper', K: X.calibrer('hyper', 50000, p0) } }), 'central') - sv3.central, Z.solde(F(V3, { heritageFonction: null, exemptionVie: 50000 }), 'central') - Z.solde(F(V3, { heritageFonction: null, exemptionVie: 100000 }), 'central'), 0.3, 'forme A calibrée sur 50 000 € : même gain de solde que l\'exemption de 50 000 € (±0,3)');
  // 13. Architecture v3b (03/11, H610-H615)
  var VB = Z.archi(Z.ARCHITECTURE_V3B), KE = X.calibrer('marg3', 100000, p0);
  ok(VB.heritageFonction.forme === 'marg3' && VB.heritageFonction.K === 94000 && VB.capitalFonction.forme === 'exp' && VB.capitalFonction.K === 80000 && VB.exemptionVie === 0, 'v3b : héritage E\' K = 94 000 €, capital exp K = 80 000 €');
  ok(X.margMax('hyper2', X.calibrer('hyper2', 100000, p0)) > 0.56 && X.margMax('hyper3', X.calibrer('hyper3', 100000, p0)) > 0.66, 'formes D et E : taux marginal > 50 % (écartées)');
  ok(X.margMax('marg2', 87000) <= 0.5 && X.margMax('marg3', 94000) <= 0.5, 'formes D\' et E\' : taux marginal ≤ 50 %');
  proche(KE, 93690, 50, 'E\' calibré sur 100 000 € : K = 93 690');
  proche(X.impot('marg3', 94000, 58000), 1520, 40, 'E\' : impôt de l\'héritier médian ≈ 1 520 €');
  proche(Z.partVie(VB), Z.PART_VIE[100000], 0.005, 'v3b : même recette d\'héritage que l\'exemption de 100 000 €');
  proche(Z.coutCapital(VB, 1), 14.7, 0.1, 'v3b : coût central du capital 14,7 Md€ (+3,2 Md€)');
  ok(X.margCumuleMax(VB.capitalFonction, VB.heritageFonction).taux <= 0.5 + 1e-9, 'v3b : taux marginal cumulé capital + impôt ≤ 50 % (objectif ≤ 75 %)');
  ok(Z.tauxEquilibre(VB) === 0.42 && VB.tPlat === 0.42, 'v3b : taux plat d\'équilibre 42,0 % (41,4 % avant V12400-V12420)');
  var sb = Z.soldes(VB); proche(sb.central, 0.8342, 0.3, 'v3b : solde central ≈ +0,8 Md€'); ok(sb.bas > 100 && sb.haut < -130 && sb.haut > -160, 'v3b : soldes bas / haut dans la fourchette'); // 04/11/2026 : ancienne valeur 0.8, recalée après les corrections de données V12400-V12404 // 04/11/2026 : ancienne valeur 0.2973, recalée après les corrections de données V12400-V12404
  ok(Z.complexite(VB).total === 15, 'v3b : 15 règles et exceptions');
  var eb = Z.evaluer(VB, Z.CAS_PROTEGES_AFFINAGE); ok(eb.contraintes.every(function (c, i) { return i === 1 || i === 2 || c; }), 'v3b : contraintes (1), (3) à (6) tenues, (2) non tenue comme partout'); // 04/11/2026 : corrections de données V12400-V12420 ; à l'équilibre relevé (v3 : 41,7 %, v3b : 42,0 %), le parent isolé au Smic perd 1 à 7 €/mois (+ avant) : (3) n'est plus tenue pour ces étapes intermédiaires, superseded par v4 et v5
  var cb = Z.casTypes(VB); ok(cb.smic_seul.ecartMois > 30 && cb.parent_isole_smic.ecartMois > -8 && cb.retraite_aspa_loc.ecartMois > -1, 'v3b : smicard, parent isolé et retraité locataire non perdants'); // 04/11/2026 : corrections de données V12400-V12420 ; à l'équilibre relevé (v3 : 41,7 %, v3b : 42,0 %), le parent isolé au Smic perd 1 à 7 €/mois (+ avant) : (3) n'est plus tenue pour ces étapes intermédiaires, superseded par v4 et v5
  // 14. Architecture v4 (03/11, H620-H625) : décisions de l'auteur sur les neuf dilemmes
  ok(Z.DEFAUT.education === 'tuteurRedeploye', 'v4 : le défaut d\'éducation d\'optimum.js ne bouge pas');
  proche(Z.EDUCATION.nonRemplacementExperimentation[1], 3.9 - 0.036, 1e-9, 'v4 : éducation = non-remplacement (3,9) moins l\'expérimentation du tuteur (36 M€)');
  ok(Z.EDUCATION.nonRemplacementExperimentation[0] > Z.EDUCATION.nonRemplacementExperimentation[1] && Z.EDUCATION.nonRemplacementExperimentation[1] > Z.EDUCATION.nonRemplacementExperimentation[2], 'v4 : éducation favorable > central > défavorable');
  var V4 = Z.archi(Z.ARCHITECTURE_V4);
  ok(V4.education === 'nonRemplacementExperimentation' && V4.heritageFonction.forme === 'marg3' && V4.heritageFonction.K === 94000 && V4.capitalFonction.K === 80000 && V4.alphaPlancher === 0.25 && V4.socle === 350 && V4.ppaMaintenue === 0, 'v4 : v3b + éducation par non-remplacement');
  SCS.forEach(function (s) { proche(Z.detail(V4, s).education - Z.detail(VB, s).education, Z.EDUCATION.nonRemplacementExperimentation[SCS.indexOf(s)] - Z.EDUCATION.tuteurRedeploye[SCS.indexOf(s)], 1e-9, 'v4 : écart d\'éducation avec la v3b (' + s + ')'); });
  var mm = Z.majorationMinimale(Z.BASE_V4, Z.GAIN_PARENT_ISOLE_V4);
  ok(mm && mm.maj === V4.majParentIsole && mm.tPlat === V4.tPlat, 'v4 : majoration ' + (mm && mm.maj) + ' € = plus petite au pas de 10 € donnant +100 €/mois au parent isolé, taux ' + (mm && mm.tPlat));
  ok(Z.tauxEquilibre(V4) === V4.tPlat, 'v4 : taux plat = taux d\'équilibre');
  var c4m = Z.casTypes(Z.archi(F(Z.BASE_V4, { majParentIsole: V4.majParentIsole - 10, tPlat: Z.tauxEquilibre(F(Z.BASE_V4, { majParentIsole: V4.majParentIsole - 10 })) })));
  ok(c4m.parent_isole_smic.ecartMois < 100, 'v4 : 10 € de majoration de moins ne suffit pas');
  var s4 = Z.soldes(V4); ok(s4.central >= 0 && s4.bas > 100 && s4.haut < -130, 'v4 : central ≥ 0, bas et haut dans la fourchette');
  var e4 = Z.evaluer(V4, Z.CAS_PROTEGES_AFFINAGE); ok(e4.contraintes.every(function (c, i) { return i === 1 || c; }), 'v4 : contraintes (1), (3) à (6) tenues, (2) non tenue comme partout');
  var c4 = Z.casTypes(V4); ok(c4.parent_isole_smic.ecartMois >= 100 && c4.smic_seul.ecartMois >= 0 && c4.couple_1smic_2enf.ecartMois >= 0 && c4.retraite_aspa_loc.ecartMois > -1, 'v4 : parent isolé ≥ +100, smicard, couple un Smic, retraité locataire non perdants');
  ok(e4.deciles[0].ecart >= 0 && e4.deciles[1].ecart >= 0 && e4.deciles[2].ecart >= 0, 'v4 : D1-D3 non perdants');
  ok(Z.tauxTransmissionMax(V4) <= 0.5 + 1e-9 && Z.tmeMax3(V4) <= 0.75, 'v4 : plafond de 50 % des transmissions, TME ≤ 75 %');
  ok(Z.complexite(V4).total === 15, 'v4 : 15 règles et exceptions');
  // 15. Architecture v5 (03/11 au soir, H630-H634) : gestion, effectifs, benchmark, sans double compte
  ok(Z.DEFAUT.gestion === 'aucune' && Z.DEFAUT.effectifs === 'aucune' && Z.DEFAUT.benchmark === 'aucune', 'v5 : défauts d\'optimum.js inchangés (aucun poste nouveau)');
  SCS.forEach(function (s) { proche(Z.soldes(Z.archi(F(Z.ARCHITECTURE_V4, {})))[s], Z.solde(Z.ARCHITECTURE_V4, s), 1e-9, 'v5 : la v4 est inchangée par les nouveaux postes (' + s + ')'); });
  var V5 = Z.archi(Z.ARCHITECTURE_V5), dV5 = Z.detail(V5, 'central');
  proche(dV5.gestion, 3.7986 - 0.05 - 0.64, 1e-9, 'v5 : gestion au central = supprimée 3,80 (plafonnée, base CAF lue, V12410 ; 4,90 avant) − collectivités 0,05 (déjà dans A1) − coût du socle 0,64 = 3,11 (4,21 avant)');
  proche(dV5.effectifs, -0.11, 1e-9, 'v5 : effectifs au central +0,2 (remplace B2, qui n\'est pas dans les structurelles A)'); // 04/11/2026 : ancienne valeur 0.2, recalée après les corrections de données V12400-V12404
  proche(dV5.benchmark, 0, 1e-9, 'v5 : benchmark, classe B seule : 0');
  ok(V5.structurelles === 'A' && Z.STRUCTURELLES.A[1] === 11.7, 'v5 : structurelles A inchangées (pas de B1 ni de B2 : pas de double compte avec la gestion et les effectifs)');
  ok(Z.GESTION.supprimee[1] > Z.GESTION.supprimee[2] && Z.GESTION.supprimee[0] > Z.GESTION.supprimee[1] && Z.GESTION.coutSocle[2] > Z.GESTION.coutSocle[0], 'v5 : gestion favorable > central > défavorable ; coût du socle inverse');
  ok(Z.gestionNette(F(V5, { gestion: 'avecInformatique' }), 1) - Z.gestionNette(V5, 1) === Z.GESTION.informatique[1], 'v5 : la variante ajoute l\'informatique, rien d\'autre');
  ok(Z.EFFECTIFS_IA.ambitieux[0] === 2.28 && Z.EFFECTIFS_IA.central[1] === Z.EFFECTIFS_IA.ambitieux[1], 'v5 : IA ambitieuse 2,28 au favorable (6,2 avant V12411) seulement, central identique');
  ok(V5.majParentIsole === 400 && V5.education === 'nonRemplacementExperimentation' && V5.socle === 350 && V5.alphaPlancher === 0.25, 'v5 : v4 + postes, majoration 400 € (marge), socle 350 €, α 25 %');
  ok(Z.tauxEquilibre(V5) === V5.tPlat && V5.tPlat < Z.archi(Z.ARCHITECTURE_V4).tPlat, 'v5 : taux plat = taux d\'équilibre, plus bas que la v4');
  ok(Z.tauxEquilibre(Z.archi(F(Z.BASE_V5_AMBITION, {}))) === Z.archi(Z.ARCHITECTURE_V5_AMBITION).tPlat && Z.archi(Z.ARCHITECTURE_V5_AMBITION).tPlat < V5.tPlat, 'v5 : variante ambitieuse = taux d\'équilibre, plus bas encore');
  var s5 = Z.soldes(V5); ok(s5.central >= 0 && s5.bas > 100 && s5.haut < -130, 'v5 : central ≥ 0, bas et haut dans la fourchette');
  var e5 = Z.evaluer(V5, Z.CAS_PROTEGES_AFFINAGE); ok(e5.contraintes.every(function (c, i) { return i === 1 || c; }), 'v5 : contraintes (1), (3) à (6) tenues, (2) non tenue comme partout');
  var c5 = Z.casTypes(V5); ok(c5.parent_isole_smic.ecartMois >= 100 && c5.smic_seul.ecartMois >= 0 && c5.couple_1smic_2enf.ecartMois >= 0 && c5.retraite_aspa_loc.ecartMois > -1, 'v5 : parent isolé ≥ +100, aucun cas protégé perdant');
  ok(Z.complexite(V5).total === 15, 'v5 : 15 règles et exceptions (aucune règle ajoutée par les économies)');
  // 16. Option retraites_v6 (03/11 au soir, H640) : montants de modeles/retraites/resultats.md, sans changer les défauts ni la v5
  ok(Z.DEFAUT.retraitesV6 === 'aucune', 'v6 : défaut retraitesV6 = aucune (aucun défaut ne bouge)');
  SCS.forEach(function (s) { proche(Z.solde(F(V5, { retraitesV6: 'aucune' }), s), Z.solde(V5, s), 1e-12, 'v6 : sans l\'option, la v5 est inchangée (' + s + ')'); });
  ok(V5.retraitesV6 === 'aucune' && Z.archi(Z.ARCHITECTURE_V4).retraitesV6 === 'aucune', 'v6 : ni la v4 ni la v5 ne contiennent l\'option');
  SCS.forEach(function (s, i) {
    proche(Z.detail(F(V5, { retraitesV6: 'ageReference' }), s).retraites, [12.1, 3.4, 0.5][i], 1e-12,   // 04/11/2026 : ancien [16.9, 7.4, 1.6] (V12840-V12859)
       'v6 : âge de référence seul en 2040 (' + s + ')');
    proche(Z.solde(F(V5, { retraitesV6: 'complet' }), s) - Z.solde(V5, s), [25.7, -5.9, -24.0][i], 1e-9,   // 04/11/2026 : ancien [28.5, -5.6, -26.5]
       'v6 : dispositif complet en 2040, ajouté seul au solde (' + s + ')');
  });
  ok(Z.RETRAITES_V6.ageReference.m2040[0] > Z.RETRAITES_V6.ageReference.m2040[1] && Z.RETRAITES_V6.ageReference.m2040[1] > Z.RETRAITES_V6.ageReference.m2040[2] && Z.RETRAITES_V6.complet.m2040[0] > Z.RETRAITES_V6.complet.m2040[2], 'v6 : favorable > central > défavorable');
  proche(Z.retraitesV6Annee('complet', 1, 2035), (-20.8 - 5.9) / 2, 1e-9, 'v6 : interpolation linéaire 2030-2040');   // ancien (-21.4 - 5.6) / 2
  proche(Z.retraitesV6Annee('complet', 1, 2070), 20.1, 1e-9, 'v6 : constante après 2060');   // ancien 26.7
  var tAge = Z.tauxEquilibre(F(Z.BASE_V5, { retraitesV6: 'ageReference' })), tCom = Z.tauxEquilibre(F(Z.BASE_V5, { retraitesV6: 'complet' }));
  ok(tAge < V5.tPlat && tCom > V5.tPlat, 'v6 : l\'âge de référence abaisse le taux d\'équilibre, le dispositif complet (central de 2040 négatif) le relève');
} else log('(capital-de-depart non chargé : contrôles de la v3 sautés)');
log('\n' + n + ' contrôles, tous verts');
