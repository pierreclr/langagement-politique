// Tests de la voie R2 (calculs à la main). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js test_retraites2.js
var FA_ = this.FiscaliteActuelle, M = this.SystemeIdeal, O = this.Optimisation, R = this.Retraites2, D = M.DONNEES;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// Distribution
var tot = 0; R.EIR2020_NET.forEach(function (b) { tot += b[2]; });
proche(tot, 100, 0.05, 'EIR 2020, tableau 7 : les 46 tranches somment à 100 %');
var w = R.points().reduce(function (s, p) { return s + p.w; }, 0);
proche(w, 1, 1e-9, 'points d\'intégration : poids de 1');
proche(R.pensionMoyenne(), 1510 * R.REVAL, 15, 'pension moyenne nette 2025 = moyenne EIR 2020 (≈ 1 510 €, milieux de tranches) × revalorisation');
proche(R.exposantQueue(), 3.94, 0.01, 'exposant de la queue de Pareto (parts au-dessus de 3 500 et 4 500 €)');

// Contribution individuelle
proche(R.contributionIndiv(3500, 0, { seuil: 2500, taux: 0.2 }).pension, 12 * 0.2 * 1000, 1e-9, 'retraité à 3 500 € nets, seuil 2 500 €, taux 20 % : 200 €/mois = 2 400 €/an');
proche(R.contributionIndiv(2500, 0, { seuil: 2500, taux: 0.2 }).pension, 0, 1e-9, 'pension égale au seuil : aucune contribution');
proche(R.contributionIndiv(5000, 0, { seuil: 2500, taux: 0.15, tauxHaut: 0.30, seuilHaut: 4000 }).pension, 12 * (0.15 * 1500 + 0.30 * 1000), 1e-9, 'deux tranches : 15 % de 2 500 à 4 000 € puis 30 % au-delà (525 €/mois)');
var cc = R.contributionIndiv(2200, 15000, { seuil: 2500, taux: 0.2, base: 'total', majCapital: 0.1 });
proche(cc.pension, 0, 1e-9, '2 200 € de pension : sous le seuil, pas de contribution sur la pension');
proche(cc.capital, 12 * (0.2 * 950 + 0.1 * 950), 1e-9, '2 200 € + 15 000 €/an de capital : revenu total 3 450 €/mois, excédent 950 € au taux 20 % + majoration 10 pts (285 €/mois)');
proche(R.contributionIndiv(2200, 15000, { seuil: 2500, taux: 0.2, base: 'pension' }).capital, 0, 1e-9, 'base « pension seule » : le capital n\'entre pas dans l\'assiette');

// Contribution agrégée
var c1 = R.contribution({ seuil: 2500, taux: 0.2, base: 'pension' }, 'central'), c2 = R.contribution({ seuil: 2500, taux: 0.2, base: 'total', majCapital: 0.1 }, 'central');
ok(c2.brutMd > c1.brutMd, 'capital et majoration ajoutent des recettes');
proche(R.contribution({ seuil: 2500, taux: 0.4, base: 'pension' }, 'central').brutMd, 2 * c1.brutMd, 1e-6, 'recette brute proportionnelle au taux (2 × 20 % = 40 %)');
ok(R.contribution({ seuil: 2000, taux: 0.2 }, 'central').brutMd > R.contribution({ seuil: 3000, taux: 0.2 }, 'central').brutMd, 'seuil plus bas : plus de recettes');
var cb = R.contribution({ seuil: 2500, taux: 0.2 }, 'bas').netMd, cm = R.contribution({ seuil: 2500, taux: 0.2 }, 'central').netMd, ch = R.contribution({ seuil: 2500, taux: 0.2 }, 'haut').netMd;
ok(cb > cm && cm > ch, 'fuite croissante : net bas > central > haut');
ok(R.contribution({ seuil: 4000, taux: 0.3, base: 'pension' }, 'central').brutMd < 4, 'au-dessus de 4 000 € nets : moins de 4 Md€ par an à 30 %');

// Minimum garanti
proche(R.coutMinGaranti(D.aspa.plafond), D.aspaMd, 1e-9, 'minimum garanti au plafond de l\'ASPA : étalonné sur 4,6 Md€');
ok(R.coutMinGaranti(1200) > R.coutMinGaranti(1100) && R.surcoutMinGaranti(1000) === 0, 'coût croissant ; pas de surcoût sous l\'ASPA');
proche(R.surcoutMinGaranti(1200), R.coutMinGaranti(1200) - 4.6, 1e-9, 'surcoût = coût − ASPA actuelle');

// Fraude
proche(R.fraude('central'), 2000 * (0.80 - 0.10) / 1000, 1e-9, 'fraude centrale : 2 000 postes × (0,8 − 0,1) M€ = 1,4 Md€');
ok(R.fraude('bas') > R.fraude('central') && R.fraude('central') > R.fraude('haut'), 'fraude : bas (réactions faibles) > central > haut');
proche(R.fraude('central', 0), 0, 1e-12, 'aucun poste : aucune recette');

// Hauts salaires
var m1 = R.masseSalaires(R.SALAIRES.top1), m01 = R.masseSalaires(R.SALAIRES.top01);
proche(m1.part, 0.01, 1e-9, 'au seuil du top 1 % (10 219 €) : 1 % des salariés');
proche(m01.part, 0.001, 1e-9, 'au seuil du top 0,1 % (27 066 €) : 0,1 % des salariés');
proche(R.masseSalaires(R.SALAIRES.d9).part, 0.10, 1e-9, 'au D9 (4 300 €) : 10 % des salariés');
ok(R.masseSalaires(4000).masseNetteMd > R.masseSalaires(6000).masseNetteMd && R.masseSalaires(6000).masseNetteMd > R.masseSalaires(10000).masseNetteMd, 'masse décroissante avec le seuil');
proche(m1.effectifs, 0.01 * R.SALAIRES.salaries, 1, 'effectifs du top 1 % = 1 % de 27,02 M de salariés');

// Cohérence avec la voie R
var st = { socle: 650, tPlat: 0.40, tMax: 0.30 }, nul = { seuil: 1e6, taux: 0, base: 'pension', minGaranti: D.aspa.plafond };
proche(R.soldeR2(st, nul, 'central') - R.fraude('central'), O.soldeCentralR(O.configR(st)), 1e-6, 'sans contribution ni minimum relevé, R2 = voie R + fraude');
var r = R.socleMaxR2({ seuil: 2500, taux: 0.2, base: 'total', majCapital: 0.1 }, 0.70, 'equilibre', false);
ok(r.socle > 400 && r.socle < 700, 'socle maximal à l\'équilibre (plafond 70 %) entre 400 et 700 € (obtenu ' + Math.round(r.socle) + ')');
var r0 = R.socleMaxR2(nul, 0.70, 'equilibre', false);
ok(r.socle > r0.socle, 'la contribution des hautes pensions relève le socle finançable (+' + Math.round(r.socle - r0.socle) + ' €)');
var chk = R.soldeR2(F(r.structure, { tPlat: r.structure.tPlat }), { seuil: 2500, taux: 0.2, base: 'total', majCapital: 0.1 }, 'central');
ok(Math.abs(chk) < 8, 'solde de R2 au socle maximal proche de 0 (interpolation sur grille de 100 €, taux au pas de 2 points) : ' + Math.round(chk * 10) / 10 + ' Md€');
function F(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

// Cas types
var c = R.casRetraites({ seuil: 2500, taux: 0.2, base: 'total', majCapital: 0.1 });
proche(c[0].ecartMois, -200, 1e-9, 'retraité à 3 500 € : −200 €/mois');
proche(c[1].ecartMois, -285, 1e-9, 'retraité à 2 200 € avec capital : −285 €/mois');
proche(c[2].ecartMois, 0, 1e-9, 'retraité à 1 750 € : inchangé');
proche(c[3].ecartMois, 0, 1e-9, 'retraité à 800 € : ASPA actuelle conservée (minimum garanti = ASPA)');
var c12 = R.casRetraites({ seuil: 2500, taux: 0.2, minGaranti: 1200 });
proche(c12[3].apresMois, 1200, 1e-9, 'minimum garanti relevé à 1 200 € : le retraité à 800 € reçoit 1 200 €');
ok(c[0].margTotal > 0.5 && c[0].margTotal < 0.6, 'retraité à 3 500 € : taux marginal total (IR 30 % × 0,9 + CSG 8,3 % + 20 %) ≈ 55 %');
// B4 : l'IR du retraité appelle fiscalite_actuelle.js : brut = net / 0,909, base = brut × 0,941 moins l'abattement de 10 % plafonné à 4 439 €
var br35 = 12 * 3500 / 0.909, ba35 = br35 * 0.941, bi35 = ba35 - Math.min(4439, 0.10 * ba35);
proche(R.impotRetraite(3500, 0), (bi35 - 29579) * 0.30 + (29579 - 11600) * 0.11, 1e-6, 'IR retraité à 3 500 € nets : barème 2025, CSG non déductible dans la base, abattement plafonné (4 843 €, contre 4 444 € avec l\'ancienne copie du barème)');
ok(R.impotRetraite(3500, 0) === FA_.irRetraiteSeul(3500), 'impotRetraite appelle fiscalite_actuelle.js (plus de barème recopié)');
var a = R.casActifs({ socle: 650, tPlat: 0.40, tMax: 0.30 });
ok(a.length === 3 && a[0].id === 'cadre8k' && a[2].id === 'dirigeantHolding', 'cas actifs : cadre 8 k€, cadre 60 k€, dirigeant avec holding');
ok(a.every(function (x) { return isFinite(x.apresMois) && x.apresMois > 0; }), 'cas actifs : revenus après finis et positifs');
var pn = R.platNecessaireR2({ socle: 650, tMax: 0.30 }, { seuil: 2500, taux: 0.2, base: 'total', majCapital: 0.1 }, D.deficitActuel), p0 = O.platNecessaireR({ socle: 650, tMax: 0.30 }, D.deficitActuel).t;
ok(pn < p0 && pn > 0, 'R2 réduit le taux plat nécessaire au socle de 650 € (Δ ≥ 0) : ' + Math.round(pn * 1000) / 10 + ' % contre ' + Math.round(p0 * 1000) / 10 + ' % pour la voie R');
proche(R.soldeR2({ socle: 650, tMax: 0.30, tPlat: pn }, { seuil: 2500, taux: 0.2, base: 'total', majCapital: 0.1 }, 'central'), D.deficitActuel, 0.01, 'au taux plat nécessaire, le solde central de R2 vaut le déficit actuel (Δ = 0)');
// Recalage H134 / variante H135 (01/11/2026) : jeu recalé par défaut, ancien jeu accessible, seuil de patrimoine
var oJ = { seuil: 2500, taux: 0.2, base: 'total', majCapital: 0 };
var cNew = R.contribution(oJ, 'central'), cOld = R.contribution(F(oJ, { jeuCapital: 'ancien' }), 'central'), cPat = R.contribution(F(oJ, { seuilPatri: 300000 }), 'central');
proche(cOld.netMd, 15.46, 0.02, 'ancien jeu (H20) : 15,5 Md€ nets au central (valeur de H108 avant recalage)');
proche(cNew.netMd, 11.97, 0.02, 'jeu recalé (H134) : ≈ 12,0 Md€ nets au central (13,3 dans la recherche, individus simulés)');
ok(cNew.netMd < cOld.netMd && cNew.concernes < cOld.concernes, 'le recalage réduit la recette et le nombre de contributeurs');
proche(R.capitalDecile(0, 'ancien') * 1, D.capitalCourant * 1e9 * 0.25 * 0.01 / (D.retraites / 10), 1e-3, 'capitalDecile ancien : 25 % × clé 1 %');
proche(R.capitalDecile(9), D.capitalCourant * 1e9 * 0.20 * 0.26 / (D.retraites / 10), 1e-3, 'capitalDecile recalé : 20 % × clé 26 %');
proche([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(function (s, d) { return s + R.capitalDecile(d); }, 0) * (D.retraites / 10) / 1e9, 0.20 * D.capitalCourant, 1e-6, 'jeu recalé : le capital des retraités fait 20 % du capital courant (la clé somme à 1)');
proche([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(function (s, d) { return s + R.capitalDecile(d, 'ancien'); }, 0) * (D.retraites / 10) / 1e9, 0.25 * D.capitalCourant, 1e-6, 'ancien jeu : 25 % du capital courant');
proche(cPat.pensionBruteMd, cNew.pensionBruteMd, 1e-9, 'seuil de patrimoine : la part pension ne change pas');
ok(cPat.concernes < cNew.concernes && cPat.capitalBruteMd > 0, 'seuil de patrimoine 300 k€ : moins de contributeurs que sans seuil, capital encore taxé');
ok(R.PATRI300.central.q.every(function (x, i, a) { return i === 0 || x > a[i - 1]; }), 'part des retraités à patrimoine hors RP > 300 k€ croissante avec la pension');
proche(M.param({}).partCapitalSeniors, 0.25, 1e-12, 'modèle de base inchangé : 25 % du capital aux retraités (H7)');
proche(M.param({ jeuCapitalRetraites: 'recherche' }).partCapitalSeniors, 0.20, 1e-12, 'option jeuCapitalRetraites recherche : 20 % (H134)');
log('\n' + n + ' contrôles passés.');
