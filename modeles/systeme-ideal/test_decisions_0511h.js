// Tests de la v5.8 (decisions_0511h.js) : taux de transition de 43 %, CIR réorienté (3 Md€), fioul, gratuité corrigée (recettes de la province, collecte), socle suspendu en détention. Depuis ce dossier, avec jsc :
//   LIST=(la liste de test_decisions_0511g.js, de modele.js à decisions_0511g.js, puis) decisions_0511h.js test_decisions_0511h.js
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//   ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js test_decisions_0511h.js
// (attention : ../retraites/modele.js, ../fiscalite-orientation/modele.js et modele.js sont trois fichiers différents)
var H = this.Decisions0511h, G = this.Decisions0511g, D = this.Decisions0511d, E = this.Decisions0511e;
var log = (typeof print === 'function') ? print : console.log;
var n = 0, SC = ['bas', 'central', 'haut'];
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
// 1. CIR réorienté
ok(H.cir(2028) === 0 && H.cir(2029) === 3 && H.cir(2060) === 3, 'CIR réorienté : 3,0 Md€ par an à partir de 2029');
ok(H.cir(2029, { montee: true }) === 3.5 || H.cir(2029, { montee: true }) === 3, 'option de montée : démarre à 3 (ou 3,5)');
ok(H.cir(2040, { montee: true }) === 8 && H.cir(2060, { montee: true }) === 8, 'option de montée : plafonnée à 8 Md€');
ok(H.net('central', 2060, { montee: true }) < H.net('central', 2060) - 4.9, 'l\'option de montée coûte 5 Md€ de plus en régime (NON adoptée)');
proche(H.cir(2060) / H.pointDeTaux(), 0.2886, 0.001, '3 Md€ = 0,29 point de taux plat');
// 2. Fioul
proche(H.HYP.fioulPleineCharge, 0.36, 1e-9, 'fioul à pleine charge : 0,36 Md€');
proche(H.fioul('central', 2031), 0.24, 1e-9, 'tendance 2031 : 0,24'); proche(H.fioul('central', 2035), 0.19, 1e-9, 'tendance 2035 : 0,19'); proche(H.fioul('central', 2040), 0.14, 1e-9, 'tendance 2040 : 0,14');
proche(H.fioul('central', 2033), 0.215, 1e-9, 'interpolation linéaire 2033');
ok(H.fioulCompte('central', 2028) === 0 && H.fioulCompte('central', 2029) === 0.17, 'compté à partir de 2029 (2027-2028 avant l\'année 1 du modèle, non compté)');
SC.forEach(function (s) { var ok2 = true, y; for (y = 2031; y < 2070; y++) if (H.fioul(s, y + 1) > H.fioul(s, y) + 1e-12) ok2 = false; ok(ok2, 'le fioul s\'érode après 2031 (' + s + ')'); });
ok(H.fioul('bas', 2040) > H.fioul('central', 2040) && H.fioul('central', 2040) > H.fioul('haut', 2040), 'fioul : démographie seule > tendance > avec politique');
ok(H.fioul('central', 2060) === 0 && H.fioul('haut', 2060) === 0, 'plancher à 0 après érosion');
proche(H.HYP.fioulGazAuBas, 1.95, 1e-9, 'le gaz de ville (1,95 Md€ au bas) reste non compté');
var f57 = G.fiscaliteOrientation('central');
proche(f57.chauffage, 2.3115814354647135, 1e-9, 'la ligne chauffage de la fiscalité d\'orientation (2,31 gaz + fioul) n\'est toujours pas comptée dans N17');
ok(H.HYP.fioulPleineCharge < H.HYP.fioulCredit, 'la taxe fioul (0,36) ne couvre pas le dispositif de crédit (0,58, non compté) : coût net de transition');
// 3. Gratuité corrigée
var g = {}; SC.forEach(function (s) { g[s] = H.gratuiteDetail(s); });
ok(g.central.net >= 6.2 && g.central.net <= 6.4, 'gratuité urbaine corrigée au central entre 6,2 et 6,4 (obtenu ' + g.central.net + ')');
proche(g.central.recettesProvince, 1.6, 1e-9, 'recettes tarifaires de la province : 1,6 au central'); ok(g.bas.recettesProvince === 1.5 && g.haut.recettesProvince === 1.7, 'province 1,5 à 1,7 (V13481)');
proche(g.central.recettesPerdues, 4.57, 1e-9, 'recettes tarifaires perdues : 2,97 + 1,6 = 4,57');
SC.forEach(function (s) { var d = g[s]; proche(d.net, d.recettesPerdues + d.offreIDF + d.offreProvince + d.capacite + d.economiesCollecte, 1e-12, 'décomposition = somme (' + s + ')'); proche(-d.economiesCollecte, d.collecteSystemes + d.collecteDistribution + d.collecteEquipements, 1e-12, 'collecte = systèmes + distribution + équipements (' + s + ')'); });
ok(g.bas.net < g.central.net && g.central.net < g.haut.net, 'gratuité : favorable < central < défavorable');
ok(-g.central.economiesCollecte > 0.2989 && -g.central.economiesCollecte < 0.45, 'économie de collecte centrale revue : entre 0,30 et 0,45 (obtenu ' + (-g.central.economiesCollecte) + ')');
proche(g.central.partCollecte, 0.08, 1e-12, 'collecte centrale = 8 % des recettes perdues'); ok(g.bas.partCollecte > g.central.partCollecte && g.central.partCollecte > g.haut.partCollecte, 'collecte : plus forte au favorable');
ok(G.gratuite('central') < H.gratuite('central') && H.gratuite('central') - G.gratuite('central') < 0.4, 'la correction ajoute moins de 0,4 Md€ à la v5.7 (6,01)');
proche(g.central.offreProvince, 1.2348, 1e-9, 'offre province inchangée (base de dépenses 4,9 de 2019 non corrigée, ⚠️)');
// 4. Socle suspendu en détention
var dt = {}; SC.forEach(function (s) { dt[s] = H.detentionDetail(s); });
proche(dt.central.economie, 0.5021, 0.01, 'socle suspendu en détention : 0,50 Md€ au central'); proche(dt.bas.economie, 0.859, 0.01, 'favorable (économie haute) : 0,86'); proche(dt.haut.economie, 0.237, 0.01, 'défavorable (économie basse) : 0,24');
ok(dt.bas.economie > dt.central.economie && dt.central.economie > dt.haut.economie, 'économie : favorable > central > défavorable');
proche(dt.central.condamnes + dt.central.prevenus, 90020, 1e-6, 'condamnés + prévenus = 90 020 détenus');
proche(dt.central.prevenus / 90020, 22131 / 84741, 1e-9, 'part des prévenus au 01/01/2026 (26,1 %) appliquée à 90 020');
ok(dt.central.economie > 0.4 && dt.central.economie < 0.9 && dt.bas.economie < 0.9 + 0.01, 'dans la fourchette 0,5 à 0,9 de l\'ordre de grandeur des positions (⚠️)');
ok(H.detention('central', 2028) === 0 && H.detention('central', 2029) === dt.central.economie, 'effet à partir de 2029');
// 5. Effet net, solde, taux d'équilibre
SC.forEach(function (s) { [2029, 2041, 2060, 2070].forEach(function (y) { proche(H.net(s, y), G.v6(s, y) + G.fo(s, y) + H.fioulCompte(s, y) - H.tu(s, y) - 3 + H.detention(s, y), 1e-12, 'net v5.8 = V6 + fiscalité + fioul − gratuité corrigée − CIR + détention (' + s + ', ' + y + ')'); }); });
ok(H.net('central', 2028) === 0, 'aucun effet avant 2029');
proche(H.net('central', 2060) - G.net('central', 2060), H.fioul('central', 2060) - (H.gratuite('central') - G.gratuite('central')) - 3 + dt.central.economie, 1e-9, 'écart v5.8 − v5.7 en 2060 = fioul − correction gratuité − CIR + détention');
[2031, 2041, 2060].forEach(function (y) { proche(D.solde('central', 0, H.tauxEquilibre(y)) + H.net('central', y), 0, 0.01, 'au taux d\'équilibre de ' + y + ' le solde est nul'); });
var cx = H.creux(), cr = H.croisiere();
ok(cx.an >= 2038 && cx.an <= 2044 && cx.taux > G.creux().taux && cx.taux < 0.44, 'creux v5.8 vers 2041, plus haut que la v5.7 (CIR) : ' + cx.taux);
proche(cx.taux, 0.4338, 0.0005, 'taux maximal du creux : 43,38 % (2041)'); proche(cr.taux, 0.4087, 0.0005, 'taux de croisière 2060 : 40,87 %');
// 6. Taux de transition de 43 %
var b = H.periodeMinimale43(), s43 = H.parcours(H.planTaux(b)), s43m = H.parcours(H.planTaux(b - 1));
ok(b === 2044, 'période minimale à 43 % : de 2029 à 2044 inclus (16 ans) ; obtenu ' + b);
ok(s43.picAn === null && s43m.picAn !== null, 'à 43 % jusqu\'en b le cumul ne passe jamais sous zéro ; une année de moins : il y passe');
ok(s43m.picDuCumul > -10, 'avec une année de moins, la dette résiduelle reste faible (' + s43m.picDuCumul + ' Md€)');
proche(H.soldeGrille(2040, 0.42), H.solde('central', 2040, 0.42), 1e-9, 'grille : exacte aux points'); proche(H.soldeGrille(2050, 0.415), H.solde('central', 2050, 0.415), 0.05, 'grille : interpolation à 0,05 Md€ près (0,415, 2050)');
proche(H.soldeGrille(2035, 0.435 - 0.0049), H.solde('central', 2035, 0.4301), 0.05, 'grille : interpolation à 0,43 (2035)');
var ds = H.descenteSous42(b);
ok(ds !== null && ds.an > b && ds.taux < 0.42 && ds.taux >= 0.38, 'une descente sous 42 % existe après la période : ' + (ds && ds.an) + ' à ' + (ds && ds.taux));
var tmin = H.tauxMinimalDepuis(b, ds.an), pl = H.parcours(H.planTaux(b, ds.an, tmin));
ok(pl.picAn === null && Math.abs(tmin - ds.taux) < 1e-12, 'au taux minimal le cumul reste ≥ 0 (aucune dette)');
ok(H.parcours(H.planTaux(b, ds.an, tmin - 0.0005)).picAn !== null, 'un demi-dixième de point en dessous : dette créée');
ok(H.tauxMinimalDepuis(b, 2055) < H.tauxMinimalDepuis(b, 2047) && H.tauxMinimalDepuis(b, 2060) <= cr.taux + 0.005, 'plus la descente est tardive, plus le taux possible est bas, et il rejoint le taux de croisière');
var pt = H.planTransition(b), dp = H.jalonsDette('central'), d42 = H.jalonsDette('central', { taux: 0.42 });
ok(pt.dette.r10 < dp.r10 && pt.dette.r20 < dp.r20 && pt.dette.r30 < dp.r30, 'la dette est plus basse avec le taux de transition qu\'à 42 % constant (10, 20, 30 ans)');
ok(dp.r10 === d42.r10, 'référence à 42 % = taux par défaut');
ok(pt.dette.r10 > 0.9 && pt.dette.r30 < 0.6 && pt.dette.r30 < pt.dette.r20 && pt.dette.r20 < pt.dette.r10, 'dette en baisse à 10, 20, 30 ans avec le plan');
// 7. Indicateurs à 42 % constant
var l = H.lissage();
ok(l.anneesDeficit >= 19 && l.anneesDeficit <= 24, 'années de solde négatif à 42 % : 21 (obtenu ' + l.anneesDeficit + ')'); proche(l.manqueMax, 14.26, 0.1, 'manque maximal 14,3 Md€ (2041)');
var tr = H.trajectoire(); ok(tr.length === 42 && tr[0].an === 2029 && tr[41].an === 2070, 'trajectoire de 2029 à 2070');
proche(tr[31].solde, H.solde('central', 2060), 1e-12, 'trajectoire cohérente avec solde (2060)');
log('Tests v5.8 : ' + n + ' contrôles passés.');
