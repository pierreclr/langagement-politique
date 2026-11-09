// Palier 1 recalculé : tableaux de resultats.md § 13. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js rapport_palier1.js
var P1 = this.Palier1, M = this.SystemeIdeal, O = this.Optimisation, R2 = this.Retraites2, D = M.DONNEES, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
function r0(x) { return Math.round(x).toString(); }
function pc(x) { return r1(100 * x) + ' %'; }
function sg(x) { return (x >= 0 ? '+' : '−') + r0(Math.abs(x)); }
function trip(o, f) { return ['bas', 'central', 'haut'].map(function (s) { return (f || r1)(o[s]); }).join(' / '); }

var P = P1.palier1(), st = P.st;
log('## A. Palier 1 : taux plat et soldes');
log('taux plat exact (Δ central = 0, santé comprise) : ' + pc(P.tPlatExact) + ' ; retenu (demi-point supérieur) : ' + pc(P.tPlat));
log('soldes au taux exact bas / central / haut : ' + trip(P.soldesAuTauxExact));
log('soldes au taux retenu bas / central / haut : ' + trip(P.soldes) + ' ; écart au déficit actuel (Δ) : ' + ['bas', 'central', 'haut'].map(function (s) { return r1(P.soldes[s] - D.deficitActuel); }).join(' / '));
var sans = [
  ['voie R seule à 25 % du capital aux retraités (§ 11.2, jeu historique)', function () { return O.platNecessaireR({ socle: 500, tMax: 0.3 }, D.deficitActuel).t; }],
  ['voie R seule au jeu recalé (20 %, H176 : socle 500, sans chômage dégressif ni plancher RSA, sans hautes pensions)', function () { return O.platNecessaireR({ socle: 500, tMax: 0.3, jeuCapital: 'recherche' }, D.deficitActuel).t; }],
  ['+ plancher RSA 877 €', function () { return P1.platNecessaire(P1.stFor({ chomage: 'remplace' }), undefined, { hp: false, parentIsole: false }); }],
  ['+ chômage dégressif deg2', function () { return P1.platNecessaire(P1.stFor({}), undefined, { hp: false, parentIsole: false }); }],
  ['+ plancher parents isolés (1 300 €)', function () { return P1.platNecessaire(P1.stFor({}), undefined, { hp: false }); }],
  ['+ hautes pensions 2 500 €, 20 %, capital sans majoration (= palier 1)', function () { return P1.platNecessaire(P1.stFor({})); }],
  ['palier 1 avec pension seule (6 Md€, chiffre solide)', function () { return P1.platNecessaire(P1.stFor({}), undefined, { hpOpt: { base: 'pension' } }); }],
  ['palier 1 avec capital et majoration de 10 points (14,8 Md€ nets)', function () { return P1.platNecessaire(P1.stFor({}), undefined, { hpOpt: { majCapital: 0.10 } }); }],
  ['palier 1 avec la fraude nette (1,4 Md€)', function () { return P1.platNecessaire(P1.stFor({}), undefined, { fraude: true }); }],
  ['palier 1 sans plancher parents isolés', function () { return P1.platNecessaire(P1.stFor({}), undefined, { parentIsole: false }); }]
];
log('\n## B. Cascade du taux plat nécessaire (Δ central = 0)');
sans.forEach(function (x) { log('| ' + x[0] + ' | ' + pc(x[1]()) + ' |'); });
log('\nrecettes de la contribution (bas / central / haut, Md€ net) : pension seule ' + ['bas', 'central', 'haut'].map(function (s) { return r1(R2.contribution(F(P1.HP, { base: 'pension' }), s).netMd); }).join(' / ') + ' ; capital sans majoration ' + ['bas', 'central', 'haut'].map(function (s) { return r1(R2.contribution(P1.HP, s).netMd); }).join(' / '));
log('plancher parents isolés (1 300 €, 0,5 M) : ' + r1(P1.parentIsoleCout(st, 'central', P1.opts())) + ' Md€ ; à 1 100 : ' + r1(P1.parentIsoleCout(st, 'central', P1.opts({ plancherParentIsole: 1100 }))) + ' ; à 1 650 (niveau actuel) : ' + r1(P1.parentIsoleCout(st, 'central', P1.opts({ plancherParentIsole: 1650 }))));
log('Md€ par point de taux plat : ' + r1(P1.solde(F(st, { tPlat: st.tPlat + 0.005 }), 'central') - P1.solde(F(st, { tPlat: st.tPlat - 0.005 }), 'central')));

log('\n## C. Année 1 (transition, création de valeur de l\'année 1) et année 10 (création de valeur affectée au déficit), Md€/an');
var H = P1.horizons(st);
log('régime de croisière (statique) bas / central / haut : ' + trip(H.regime));
log('transition (ponctuel + recettes perdues) : ' + ['bas', 'central', 'haut'].map(function (s) { return r1(H.an1[s + 'Transition']); }).join(' / '));
log('année 1 : ' + trip(H.an1) + ' (création de valeur ' + ['bas', 'central', 'haut'].map(function (s) { return r1(H.an1[s + 'Valeur']); }).join(' / ') + ')');
log('année 10 : ' + trip(H.an10) + ' (création de valeur ' + ['bas', 'central', 'haut'].map(function (s) { return r1(H.an10[s + 'Valeur']); }).join(' / ') + ')');
log('année 10 sans la ligne E (croissance IA) : ' + trip(H.an10sansE) + ' (création de valeur ' + ['bas', 'central', 'haut'].map(function (s) { return r1(H.an10sansE[s + 'Valeur']); }).join(' / ') + ')');
[5, 10].forEach(function (n) { ['bas', 'central', 'haut'].forEach(function (s) { var v = P1.valeur(n, s); log('valeur an ' + n + ' ' + s + ' : A ' + r1(v.A) + ' B ' + r1(v.B) + ' C ' + r1(v.C) + ' D ' + r1(v.D) + ' E ' + r1(v.E) + ' total ' + r1(v.total)); }); });

log('\n## D. Taux marginaux (central, par bande de revenu d\'activité ; impôt à plat + continu)');
P1.marginaux(st).forEach(function (b) { log('| ' + b.id + ' | ' + pc(b.tauxMoyen) + ' | ' + pc(b.tauxMarginal) + ' | ' + pc(b.avecIS) + ' | ' + sg(b.ecartMois) + ' | ' + r0(100 * b.partGagnants) + ' % |'); });
var mm = P1.marginalMax(st);
log('limite à l\'infini : personnel ' + pc(mm.personnel) + ', avec IS ' + pc(mm.combine) + ' ; fin du plancher RSA non progressif : ' + r0(mm.finPlancherRSA) + ' € de revenu d\'activité par mois');

log('\n## E. Cas types (€/mois, central, palier 1 sans correctif)');
function cas(l) { l.forEach(function (c) { log('| ' + c.libelle + ' | ' + r0(c.avantMois) + ' | ' + r0(c.apresMois) + ' | ' + sg(c.ecartMois) + ' |'); }); }
cas(P1.casActifs(st)); cas(P1.casAutres(st));
P1.casActifs(st).forEach(function (c) { if (c.avantEcoMois !== undefined) log('revenu économique (cash + bénéfices retenus après IS) de ' + c.id + ' : ' + r0(c.avantEcoMois) + ' → ' + r0(c.apresEcoMois) + ' (' + sg(c.ecartEcoMois) + ')'); });
log('chômeurs :');
P1.chomeurs(st).forEach(function (c) { log('| ' + c.libelle + ' | ' + c.mois.map(function (m) { return 'mois ' + m.m + ' : ' + r0(m.actuel) + ' → ' + r0(m.apres) + ' (' + sg(m.ecart) + ')'; }).join(' ; ') + ' |'); });

log('\n## F. Trajectoire des paliers suivants (socle en €/mois ; recettes constatées l\'année t − 1, tranches de 10 Md€)');
['bas', 'central', 'haut'].forEach(function (s) {
  var T = P1.trajectoire(st, undefined, s), T2 = P1.trajectoire(st, undefined, s, { sansE: true });
  log(s + ' (modèle ; création de valeur ' + P1.APPARIEMENT[s] + ') : pente ' + r1(1000 * T.penteMdParEuro) + ' M€ par €/mois, ' + r1(T.eurosParTranche) + ' €/mois par tranche de 10 Md€');
  log('  avec E : ' + T.annees.map(function (a) { return 'a' + a.annee + ' ' + r0(a.socle); }).join(' ; '));
  log('  sans E : ' + T2.annees.map(function (a) { return 'a' + a.annee + ' ' + r0(a.socle); }).join(' ; '));
});

log('\n## G. Correctif 1 : contribution de solidarité sur les revenus d\'activité (au-delà de seuil nets actuels équivalents)');
var b0 = P.soldes;
[[8000, 0.05], [8000, 0.10], [6000, 0.05], [6000, 0.10]].forEach(function (c) {
  var o = { solidarite: { seuilNet: c[0], taux: c[1] } };
  var s = {}; ['bas', 'central', 'haut'].forEach(function (sc) { s[sc] = P1.solidarite(O.configR(st), o.solidarite, sc); });
  log('seuil ' + c[0] + ' €, taux ' + pc(c[1]) + ' : effectifs ' + r0(s.central.effectifs / 1000) + ' k ; taux marginal de la tranche avant ' + pc(s.central.tauxMarginal) + ' ; recette nette bas / central / haut ' + trip({ bas: s.bas.netMd, central: s.central.netMd, haut: s.haut.netMd }) + ' (central : brut ' + r1(s.central.brutMd) + ', perte d\'assiette ' + r1(s.central.perteAssietteMd) + ', exil ' + r1(s.central.exilMd) + ') ; solde bas / central / haut ' + trip(P1.soldes(st, o)));
  var cs = P1.casActifs(st, o); log('  cas : ' + cs.filter(function (x) { return ['smic35', 'cadre8k', 'cadre10k', 'cadre15k', 'dirigeantHolding'].indexOf(x.id) >= 0; }).map(function (x) { return x.id + ' ' + sg(x.ecartMois); }).join(' ; '));
});
log('\n## H. Correctif 2 : franchise sur le taux plat (les F premiers euros par an et par adulte exonérés), taux plat relevé pour Δ central = 0');
[3000, 6000, 9000, 12000].forEach(function (Fr) {
  var o = { franchise: Fr }, t = P1.platNecessaire(P1.stFor({}), undefined, o);
  if (t === null) { log('franchise ' + Fr + ' € : aucun taux plat jusqu\'à 80 % ne ramène le solde central au déficit actuel'); return; }
  var tr = Math.ceil(t * 200 - 1e-9) / 200, st2 = F(st, { tPlat: tr });
  log('franchise ' + Fr + ' € : taux plat exact ' + pc(t) + ', retenu ' + pc(tr) + ' (palier 1 : ' + pc(st.tPlat) + ') ; coût de la franchise ' + r1(P1.franchiseCout(O.configR(st2), Fr, 'central')) + ' Md€ ; soldes bas / central / haut ' + trip(P1.soldes(st2, o)));
  var cs = P1.casActifs(st2, o); log('  cas : ' + cs.map(function (x) { return x.id + ' ' + sg(x.ecartMois); }).join(' ; '));
  var ca = P1.casAutres(st2, o).filter(function (x) { return ['parentIsole', 'rsa', 'etudiant', 'couple1smic2enf'].indexOf(x.id) >= 0; }); log('  autres : ' + ca.map(function (x) { return x.id + ' ' + sg(x.ecartMois); }).join(' ; '));
});
log('\n## I. Combinaison : franchise 6 000 € + contribution de solidarité 8 000 € nets à 10 %');
(function () {
  var o = { franchise: 6000, solidarite: { seuilNet: 8000, taux: 0.10 } }, t = P1.platNecessaire(P1.stFor({}), undefined, o), tr = Math.ceil(t * 200 - 1e-9) / 200, st2 = F(st, { tPlat: tr });
  log('taux plat exact ' + pc(t) + ', retenu ' + pc(tr) + ' ; soldes ' + trip(P1.soldes(st2, o)));
  log('  cas : ' + P1.casActifs(st2, o).map(function (x) { return x.id + ' ' + sg(x.ecartMois); }).join(' ; '));
})();

log('\n## J. Hypothèse H3/H178 : impôt de 50 % sur toutes les transmissions, et variante à droits actuels (DMTG 2024 : 20,8 Md€)');
(function () {
  var sc3 = ['bas', 'central', 'haut'], a = {}, b = {};
  sc3.forEach(function (s) { a[s] = M.solde(F(O.configR(st), { scenario: s })).recettes.transmissions; b[s] = M.solde(F(O.configR(st), { scenario: s, droitsActuelsTransmissions: true })).recettes.transmissions; });
  log('recettes de transmissions bas / central / haut (Md€) : palier 1 ' + trip(a) + ' ; droits actuels ' + trip(b) + ' ; écart central ' + r1(a.central - b.central));
  log('calcul central : ' + D.transmissions + ' Md€ de flux (CAE 2021, vers 2020) × (1 − fuite 31 %) × 50 % = ' + r1(a.central) + ' Md€ ; points de taux plat équivalents (12,7 Md€ par point) : ' + r1((a.central - b.central) / 12.7));
  var o = { transmissionsActuelles: true }, t = P1.platNecessaire(st, undefined, o), tr = Math.ceil(t * 200 - 1e-9) / 200;
  log('à 35 % : solde bas / central / haut ' + trip(P1.soldes(st, o)) + ' (palier 1 : ' + trip(P.soldes) + ')');
  log('taux plat exact ' + pc(t) + ', retenu ' + pc(tr) + ' (palier 1 : ' + pc(P.tPlatExact) + ' / ' + pc(P.tPlat) + ') ; soldes au taux retenu ' + trip(P1.soldes(F(st, { tPlat: tr }), o)));
  log('socle finançable à 35 % sans aggraver le déficit actuel (central) : palier 1 ' + r0(P1.socleFinancable(st)) + ' € ; droits actuels ' + r0(P1.socleFinancable(st, o)) + ' €');
})();

log('\n## K. Montée en charge des économies de santé (H177 : linéaire de 0 à 100 % sur `plein` années par levier), Md€/an');
['bas', 'central', 'haut'].forEach(function (s) {
  log(s + ' : ' + [1, 2, 3, 5, 10, 25].map(function (n) { return 'année ' + n + ' ' + r1(this.Sante.economies(s, { annee: n }).total); }, this).join(' ; ') + ' ; effet plein ' + r1(this.Sante.economies(s).total));
}, this);

log('\n## L. Impôt net des holdings sur bénéfices retenus (H179), Md€/an : compté en régime de croisière, retiré l\'année 1');
log('bas / central / haut : ' + ['bas', 'central', 'haut'].map(function (s) { return r1(P1.holdingsDiffere(st, s)); }).join(' / '));
log('année 1 sans ce correctif (santé en montée) : ' + trip(['bas', 'central', 'haut'].reduce(function (o, s) { o[s] = P1.solde(st, s, { anneeSante: 1 }) - P1.transition(st, s).total + P1.valeurPourScenario(1, s).total; return o; }, {})));

log('\n## M. Jeu de capital des retraités (H134, H176) : même jeu dans le modèle de base et dans la contribution');
log('palier 1 (20 % partout) : taux plat exact ' + pc(P.tPlatExact) + ', solde central à 35 % ' + r1(P.soldes.central));
(function () { var st0 = P1.stFor({ jeuCapital: 'ancien' }), t = P1.platNecessaire(st0), s = F(st0, { tPlat: 0.35 }); log('modèle de base à 25 % (ancien, contribution à 20 %) : taux plat exact ' + pc(t) + ', solde central à 35 % ' + r1(P1.solde(s, 'central'))); })();
