// Tests du palier 1 recalculé (calculs à la main ou recoupements avec les modules existants). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js test_palier1.js
var M = this.SystemeIdeal, O = this.Optimisation, R2 = this.Retraites2, P1 = this.Palier1, D = M.DONNEES, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// Création de valeur : recoupement avec le tableau de sources/recherche-creer-de-la-valeur.md § 5 (calculs à la main, tolérance d'arrondi)
var v5 = P1.valeur(5, 'central'), v10 = P1.valeur(10, 'central');
proche(v5.A, 0.019 * 209.1 - 2.47, 1e-9, 'levier A central : 1,9 % de 209,1 Md€ moins 2,47 déjà versés = 1,5 Md€');
proche(v5.B, 1.2, 1e-9, 'levier B central à 5 ans : 40 Md€ de stock × 3 % = 1,2 Md€');
proche(v10.B, 2.7, 1e-9, 'levier B central à 10 ans : 90 Md€ × 3 % = 2,7 Md€');
proche(v5.C, 0, 1e-9, 'levier C inactif (H180) : double compte avec la suppression des allègements ; 4,1 × 40 % × 50 % = 0,8 Md€ si on le comptait');
proche(P1.VAL.C.central, 1.64, 1e-9, 'levier C documenté : 4,1 Md€ × 40 % = 1,64 Md€ à 10 ans (non compté)');
proche(v10.D, 6.4, 0.05, 'levier D central à 10 ans : 15 Md€ × 42,7 % = 6,4 Md€ (rampe de 10 ans)');
proche(v5.E, 9.5, 0.1, 'levier E central à 5 ans : ((1,003)^5 − 1) × 2 935 × 42,7 % × 50 % = 9,5 Md€');
proche(v5.total, 15.4, 0.1, 'total central à 5 ans : 15,4 Md€ (16 avec le levier C, retiré par H180)');
proche(v10.total, 29.7, 0.1, 'total central à 10 ans : 29,7 Md€ (31 avec le levier C)');
proche(P1.valeur(10, 'haut').total, 56.4, 0.1, 'total haut à 10 ans : 56,4 Md€ (59 avec le levier C)');
proche(P1.valeur(10, 'bas').total, 6, 0.5, 'total bas à 10 ans : 6 Md€');
proche(P1.valeur(5, 'haut').total, 36.7, 0.1, 'total haut à 5 ans : 36,7 Md€ (38 avec le levier C)');
proche(P1.valeur(5, 'bas').total, 3, 0.5, 'total bas à 5 ans : 3 Md€');
ok(P1.valeurPourScenario(10, 'bas').total > P1.valeurPourScenario(10, 'haut').total, 'appariement : le scénario favorable du modèle (bas) reçoit les gains élevés de la création de valeur');
ok(P1.valeur(1, 'central').A === 0 && P1.valeur(1, 'central').B === 0, 'année 1 : ni dividende supplémentaire ni rendement du fonds');

// Recoupement avec la voie R (resultats.md § 11.2) : sans les ajouts du palier 1, le taux plat de Δ = 0 à 500 € est celui de la voie R
var tR = O.platNecessaireR({ socle: 500, tMax: 0.30 }, D.deficitActuel).t;
proche(tR, 0.340, 0.002, 'voie R, 500 € : taux plat de Δ = 0 de 34,0 % (resultats.md § 11.2)');
var sansAjouts = P1.platNecessaire(F(P1.stFor({}), { complRsa: false, chomage: 'remplace', jeuCapital: 'ancien' }), undefined, { hp: false, parentIsole: false });   // jeu 'ancien' : celui de la voie R (H176)
proche(sansAjouts, tR, 1e-6, 'palier1.js sans plancher RSA, chômage dégressif, hautes pensions ni parents isolés redonne la voie R');
var tR2 = P1.platNecessaire(F(P1.stFor({}), { complRsa: false, chomage: 'remplace', jeuCapital: 'ancien' }), undefined, { hpOpt: { majCapital: 0.10 }, parentIsole: false, fraude: true });
proche(tR2, 0.328, 0.002, 'voie R2 (2 500 €, 20 %, capital majoré, fraude) : 32,8 % (resultats.md § 12.3 ; 32,4 % avant le recalage H134)');

// Les ajouts coûtent du taux plat, les hautes pensions en rendent
var t1 = P1.platNecessaire(P1.stFor({}), undefined, { hp: false, parentIsole: false }), t2 = P1.platNecessaire(P1.stFor({}), undefined, { hp: false }), t3 = P1.platNecessaire(P1.stFor({}));
ok(t1 > tR, 'plancher RSA et chômage dégressif relèvent le taux plat');
ok(t2 > t1, 'le plancher des parents isolés relève le taux plat');
ok(t3 < t2, 'la contribution des hautes pensions abaisse le taux plat');

// Palier 1
var P = P1.palier1();
ok(P.tPlat >= P.tPlatExact && P.tPlat - P.tPlatExact < 0.005 + 1e-9, 'taux retenu = demi-point supérieur du taux exact');
proche(P1.solde(F(P.st, { tPlat: P.tPlatExact }), 'central'), D.deficitActuel, 0.01, 'au taux exact, le solde central vaut le déficit actuel (Δ = 0)');
ok(P.soldes.bas > P.soldes.central && P.soldes.central > P.soldes.haut, 'soldes ordonnés : bas (favorable) > central > haut');
ok(P.soldes.central >= D.deficitActuel, 'au taux retenu, le déficit n\'est pas aggravé au central');
proche(P1.parentIsoleCout(P.st, 'central', P1.opts()), 0.5e6 * (1300 - 900) * 12 / 1e9, 1e-6, 'plancher parents isolés : 0,5 M × (1 300 − 900 €) × 12 = 2,4 Md€ (socle 500 + 2 × 200 = 900 €)');
proche(P1.parentIsoleCout(P.st, 'central', P1.opts({ parentIsole: false })), 0, 1e-12, 'sans plancher : coût nul');

// Horizons
var H = P1.horizons(P.st);
proche(H.regime.central, P.soldes.central, 1e-9, 'régime de croisière = solde du palier 1');
proche(H.an10.central - P1.solde(P.st, 'central', { anneeSante: 10 }), P1.valeur(10, 'central').total, 1e-9, 'année 10 : solde de l\'année 10 (santé en montée) + création de valeur de l\'année 10');
ok(H.an10.central - H.regime.central - P1.valeur(10, 'central').total < 0, 'année 10 : la santé n\'est pas encore à plein effet (prévention 10 ans sur 25)');
ok(H.an10.central > H.regime.central && H.an10sansE.central < H.an10.central, 'la ligne E (croissance IA) pèse dans l\'année 10');
proche(H.an1.centralTransition, 6.5 + 147000 * 25000 / 1e9, 1e-6, 'année 1 : transition centrale = 6,5 Md€ ponctuels + 147 000 emplois × 25 k€ de recettes perdues');

// Trajectoire
var T = P1.trajectoire(P.st, undefined, 'central');
ok(T.penteMdParEuro > 0.40 && T.penteMdParEuro < 0.4647 + 1e-9, 'coût marginal du socle : entre 0,40 et 0,465 Md€ par €/mois (retours d\'impôt compris)');
proche(T.annees[0].socle, 500, 1e-9, 'année 1 : socle de 500 €');
ok(T.annees.every(function (a, i) { return i === 0 || a.socle >= T.annees[i - 1].socle; }), 'le socle ne baisse jamais (règle de montée)');
ok(T.annees[9].socle <= P1.trajectoire(P.st, undefined, 'bas').annees[9].socle, 'année 10 : le socle du scénario favorable est au moins celui du central');
proche(P1.trajectoire(P.st, undefined, 'haut').annees[9].socle, 500, 1e-9, 'scénario défavorable : aucune recette constatée suffisante, le socle reste à 500 €');
proche(T.eurosParTranche, 10 / T.penteMdParEuro, 1e-9, 'une tranche de 10 Md€ = 10 / pente €/mois');

// Taux marginaux
var mg = P1.marginaux(P.st);
ok(mg.length === 14 && mg.every(function (b) { return b.tauxMarginal >= P.st.tPlat - 1e-9 && b.avecIS > b.tauxMarginal; }), 'taux marginaux : au moins le taux plat dans les 14 bandes, IS + dividende au-dessus du taux personnel');
ok(mg[0].tauxMarginal < mg[9].tauxMarginal, 'taux marginal croissant avec le revenu');
var mm = P1.marginalMax(P.st);
proche(mm.personnel, P.st.tPlat + 0.30, 1e-9, 'limite à l\'infini = taux plat + t_max');
proche(mm.combine, 1 - 0.75 * (1 - mm.personnel), 1e-9, 'taux combiné IS + dividende = 1 − 0,75 × (1 − taux personnel)');
proche(mm.finPlancherRSA, (877 - 500) / (1 - P.st.tPlat), 1e-6, 'plancher RSA non progressif : sortie à 100 % jusqu\'à (877 − 500) / (1 − plat)');

// Cas types
var ca = P1.casActifs(P.st), g = function (id) { return ca.filter(function (x) { return x.id === id; })[0]; };
ok(ca.length === 8 && g('smic35').ecartMois > 0 && g('cadre8k').ecartMois > g('smic35').ecartMois, 'cas d\'actifs : le cadre à 8 000 € gagne plus que le smicard (conséquence du taux plat)');
ok(g('dirigeantHolding').ecartEcoMois < 0 && g('dirigeantHolding').ecartMois > 0, 'dirigeant avec holding : gagnant en espèces, perdant en revenu économique (impôt différé sur les bénéfices retenus)');
var au = P1.casAutres(P.st), h = function (id) { return au.filter(function (x) { return x.id === id; })[0]; };
proche(h('parentIsole').apresMois, 1300, 1e-9, 'parent isolé : plancher ciblé à 1 300 €');
proche(h('rsa').ecartMois, 0, 1e-9, 'RSA avec aide au logement : plancher de 877 € maintenu');
proche(h('ret3500').ecartMois, -200, 1e-9, 'retraité à 3 500 € : −200 €/mois (contribution de 20 % au-delà de 2 500 €)');
proche(h('ret800').ecartMois, 0, 1e-9, 'retraité à 800 € : inchangé');
proche(h('ret2200cap').ecartMois, -190, 1e-9, 'retraité à 2 200 € + 15 000 € de capital, sans majoration : −190 €/mois (20 % de 950 €)');
var ch = P1.chomeurs(P.st);
proche(ch[0].mois[0].apres, 500 + 0.6 * (1478 - 500), 1e-6, 'chômeur au Smic, mois 2 : socle 500 + 60 % de la perte (1 478 − 500 €)');
proche(ch[0].mois[3].apres, 877, 1e-9, 'chômeur au Smic, mois 15 : plancher RSA 877 €');
proche(ch[1].mois[0].apres, 500 + 0.6 * (3000 - 500), 1e-6, 'chômeur cadre à 5 000 €, mois 2 : perte plafonnée à 3 000 € nets');

// Correctif 1 : contribution de solidarité
var p0 = O.configR(P.st), s0 = P1.solidarite(p0, { seuilNet: 8000, taux: 0 }, 'central');
proche(s0.netMd, 0, 1e-12, 'taux nul : recette nulle');
var s5 = P1.solidarite(p0, { seuilNet: 8000, taux: 0.05 }, 'central'), s10 = P1.solidarite(p0, { seuilNet: 8000, taux: 0.10 }, 'central');
ok(s10.brutMd > s5.brutMd && s10.perteAssietteMd > s5.perteAssietteMd, 'recette brute et perte d\'assiette croissent avec le taux');
proche(s5.netMd, s5.brutMd - s5.perteAssietteMd - s5.exilMd, 1e-9, 'recette nette = brute − perte d\'assiette − exil');
ok(P1.solidarite(p0, { seuilNet: 8000, taux: 0.10 }, 'bas').netMd > P1.solidarite(p0, { seuilNet: 8000, taux: 0.10 }, 'haut').netMd, 'la recette nette baisse quand l\'élasticité monte');
var cs = P1.casActifs(P.st, { solidarite: { seuilNet: 8000, taux: 0.10 } }), c = function (id) { return cs.filter(function (x) { return x.id === id; })[0]; };
proche(c('smic35').ecartMois, g('smic35').ecartMois, 1e-9, 'contribution de solidarité : le smicard n\'est pas touché');
proche(c('cadre8k').ecartMois, g('cadre8k').ecartMois, 1e-9, 'contribution de solidarité à 8 000 € nets : le cadre à 8 000 € pile ne paie rien');
proche(g('dirigeantHolding').ecartMois - c('dirigeantHolding').ecartMois, 0.10 * (42334.25 - 8000 * P1.L_PAR_NET), 0.01, 'dirigeant : 10 % de (42 334 € − 8 000 × 1,839 = 14 712 €) = 2 762 €/mois');
proche(g('cadre10k').ecartMois - c('cadre10k').ecartMois, 0.10 * (10000 * P1.L_PAR_NET - 8000 * P1.L_PAR_NET), 0.01, 'cadre à 10 000 € nets : 10 % de (18 390 − 14 712 €) = 368 €/mois');

// Correctif 2 : franchise sur le taux plat
proche(P1.franchiseCout(p0, 0, 'central'), 0, 1e-12, 'franchise nulle : coût nul');
ok(P1.franchiseCout(p0, 6000, 'central') > P1.franchiseCout(p0, 3000, 'central') * 1.5, 'coût de la franchise croissant avec son montant');
proche(P1.minMoyen(1000, 0.25, 1e12), 1000, 1, 'E[min(R ; F)] avec F très grand = R (moyenne conservée)');
proche(P1.minMoyen(1000, 0.25, 0), 0, 1e-12, 'E[min(R ; 0)] = 0');
var tF = P1.platNecessaire(P1.stFor({}), undefined, { franchise: 6000 });
ok(tF > P.tPlatExact, 'la franchise de 6 000 € exige un taux plat plus haut (' + Math.round(tF * 1000) / 10 + ' % contre ' + Math.round(P.tPlatExact * 1000) / 10 + ' %)');
var stF = F(P.st, { tPlat: Math.ceil(tF * 200) / 200 }), cF = P1.casActifs(stF, { franchise: 6000 }), f = function (id) { return cF.filter(function (x) { return x.id === id; })[0]; };
ok(f('smic35').ecartMois > g('smic35').ecartMois, 'franchise de 6 000 € : le smicard à 35 h gagne plus qu\'au palier 1 simple');
ok(f('cadre8k').ecartMois < g('cadre8k').ecartMois, 'franchise de 6 000 € : le cadre à 8 000 € gagne moins qu\'au palier 1 simple');
ok(f('dirigeantHolding').ecartMois < g('dirigeantHolding').ecartMois, 'franchise de 6 000 € : le dirigeant gagne moins');
proche(P1.platNecessaire(P1.stFor({}), undefined, { franchise: 18000 }) === null ? 1 : 0, 1, 0, 'franchise de 18 000 € : aucun taux plat jusqu\'à 80 % ne tient le déficit actuel');

// ---------- Audit du 01/11/2026, suites (défauts 4 à 8) : H176 à H182
var S_ = this.Sante, stP = P1.palier1().st, Pb = M.param(O.configR(stP));
// H176 : même part du capital des retraités dans le modèle de base et dans la contribution des hautes pensions
proche(Pb.partCapitalSeniors, D.partCapitalRetraitesRecherche, 1e-12, 'palier 1 : le modèle de base garde 20 % du capital aux retraités (jeu recalé H134)');
proche(Pb.partCapitalSeniors, R2.capitalDecile(0, 'recherche') * (D.retraites / 10) / (D.capitalCourant * 1e9) / D.capitalRetraitesDecileRecherche[0], 1e-9, 'même part que la contribution des hautes pensions (retraites2.js)');
proche(M.param(O.configR(F(P1.BASE, { jeuCapital: 'ancien' }))).partCapitalSeniors, 0.25, 1e-12, 'voie R (§ 11-12) : 25 % conservés pour les tableaux publiés avant le recalage');
proche(P1.solde(stP, 'central'), -163.05, 0.1, 'palier 1 à 35 % : solde central −163,05 (V11770 : 1,84 M au RSA ; −163,3 avec l\'ancien 1,9 M) Md€ (−166,8 avec 25 % dans le modèle de base)');
proche(P1.palier1().tPlatExact, 0.3455, 0.0005, 'taux plat exact 34,55 % (34,8 % avec le jeu à moitié appliqué)');
// H177 : montée en charge de la santé
proche(S_.economies('central', { annee: 1 }).total, 4.0 / 5 + 3.4 / 4 + 2.2 / 6 + 0.10 / 25, 1e-9, 'santé année 1, central : chaque levier à 1 / plein (0,8 + 0,85 + 0,37 + 0,004 = 2,02 Md€)');
proche(S_.economies('central', { annee: 6 }).total, 4.0 + 3.4 + 2.2 + 0.10 * 6 / 25, 1e-9, 'santé année 6 : trois leviers à plein effet, prévention à 6 / 25');
proche(S_.economies('central', { annee: 25 }).total, S_.economies('central').total, 1e-9, 'santé année 25 = effet plein');
proche(S_.economies('central').total, 9.7, 0.05, 'sans année : effet plein 9,7 Md€ (comportement historique)');
ok(P1.horizons(stP).an1.central < P1.solde(stP, 'central') - P1.transition(stP, 'central').total + P1.valeurPourScenario(1, 'central').total, 'année 1 : plus mauvaise qu\'avec la santé à plein effet et les holdings encaissés');
// H178 : transmissions à 50 % (hypothèse) et variante à droits actuels
proche(M.solde(F(O.configR(stP), { scenario: 'central' })).recettes.transmissions, 103.5, 0.1, 'transmissions du palier 1 : 300 × 50 % × (1 − 31 %) = 103,5 Md€ au central (hypothèse H3)');
proche(M.solde(F(O.configR(stP), { scenario: 'central', droitsActuelsTransmissions: true })).recettes.transmissions, 20.8, 1e-9, 'variante droits actuels : 20,8 Md€ (DMTG 2024)');
proche(P1.solde(stP, 'central', { transmissionsActuelles: true }) - P1.solde(stP, 'central'), -82.7, 0.1, 'variante droits actuels : −82,7 Md€ de solde au central');
ok(P1.platNecessaire(stP, undefined, { transmissionsActuelles: true }) > 0.41 && P1.platNecessaire(stP, undefined, { transmissionsActuelles: true }) < 0.42, 'variante droits actuels : taux plat nécessaire ≈ 41,5 %');
ok(P1.socleFinancable(stP, { transmissionsActuelles: true }) < 350, 'variante droits actuels : socle finançable au taux de 35 % inférieur à 350 €');
// H179 : holdings différés
ok(P1.holdingsDiffere(stP, 'central') > 2 && P1.holdingsDiffere(stP, 'central') < 4, 'impôt net des holdings sur bénéfices retenus ≈ 3 Md€ au central');
proche(P1.solde(stP, 'central', { holdingsDifferes: true }), P1.solde(stP, 'central') - P1.holdingsDiffere(stP, 'central'), 1e-9, 'option holdingsDifferes retire exactement cet impôt');
// H180 : levier C inactif (voir plus haut) ; H182 : IR du retraité sans barème recopié (test_retraites2.js)
log('\n' + n + ' contrôles passés.');
