// Tests de la v5.7 (decisions_0511g.js) : âge libre d'un trimestre par an, fiscalité d'orientation au bas de la fourchette, gratuité des transports urbains. Depuis ce dossier, avec jsc :
//   LIST=(la liste de test_decisions_0511f.js, de modele.js à decisions_0511f.js, puis) ../fiscalite-orientation/modele.js decisions_0511g.js test_decisions_0511g.js
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
// Ordre : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//   patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//   ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//   decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//   ../fiscalite-orientation/modele.js decisions_0511g.js test_decisions_0511g.js
// (attention : ../retraites/modele.js, ../fiscalite-orientation/modele.js et modele.js sont trois fichiers différents)
var G = this.Decisions0511g, F = this.Decisions0511f, E = this.Decisions0511e, D = this.Decisions0511d, FO = this.FiscaliteOrientation, TP = this.TaxePatrimoine;
var log = (typeof print === 'function') ? print : console.log;
var n = 0, SC = ['bas', 'central', 'haut'];
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var avantErosion = TP.PARAM.central.erosionTop, fo0 = FO.simuler({ comportement: 'central' }).recettesNettesMdE;
// 1. Fiscalité d'orientation : chiffrage existant, niveau bas, liste de l'auteur
var f = {}; SC.forEach(function (s) { f[s] = G.fiscaliteOrientation(s); });
proche(fo0, 14.906, 0.01, 'le chiffrage existant (modeles/fiscalite-orientation) donne 14,9 Md€ au central, avec le chauffage (resultats.md)');
proche(f.central.totalAvecChauffage, 11.901, 0.01, 'réactions fortes avec le gaz et le fioul : 11,9 Md€ = le bas du chiffrage existant');
proche(f.central.total + f.central.chauffage, f.central.totalAvecChauffage, 1e-9, 'compté = bas du chiffrage existant moins le chauffage gaz et fioul (hors de la liste décidée)');
proche(f.central.total, 9.589, 0.01, 'fiscalité d\'orientation comptée au central : 9,59 Md€ (≈ 10)');
ok(G.HYP.postesFO.indexOf('chauffage') < 0 && G.HYP.postesFO.length === 7, 'postes comptés : viande, carburants, avion, voitures lourdes et trois postes à TVA 0 % ; pas de chauffage');
ok(f.bas.total > f.central.total && f.central.total > f.haut.total, 'favorable > central > défavorable');
proche(f.bas.total, 12.360, 0.01, 'favorable : réactions centrales hors chauffage, 12,4');
proche(f.haut.total, 3.240, 0.01, 'défavorable : réactions fortes et élasticités doublées, 3,2');
ok(FO.simuler({ comportement: 'central' }).recettesNettesMdE === fo0, 'les données du module fiscalite-orientation ne sont pas modifiées par les copies');
// 1 bis. Doubles comptes
['viande', 'carburants', 'aerien', 'voituresLourdes'].forEach(function (p) {
  var x = f.central.postes[p];
  ok(x.perteAnciennes > 0 && x.net < x.recetteNouvelle, 'poste ' + p + ' : net des recettes actuelles perdues sur les volumes qui baissent (pas de double compte avec les accises actuelles de P11)');
  proche(x.net, x.recetteNouvelle - x.perteAnciennes + x.effetBudget, 1e-9, 'poste ' + p + ' : net = nouvelle − perdue + effet budget');
});
ok(f.central.postes.tva0_alimentation.net < 0 && f.central.postes.tva0_eau.net < 0 && f.central.postes.tva0_medicaments.net < 0, 'les trois TVA à 0 % coûtent de la recette (TVA perdue), déjà dans le total compté');
proche(f.central.detail.aerien, 5.158, 0.01, 'avion : 5,2 Md€ aux réactions fortes (6,1 au central ; non recompté avec la taxe croisières)');
// 2. Gratuité des transports urbains : variante A
var g = {}; SC.forEach(function (s) { g[s] = G.gratuiteDetail(s); });
proche(g.bas.net, 4.50, 0.01, 'gratuité urbaine, bas : 4,5'); proche(g.central.net, 6.01, 0.01, 'gratuité urbaine, central : 6,0'); proche(g.haut.net, 10.49, 0.01, 'gratuité urbaine, haut : 10,5');
SC.forEach(function (s) { var d = g[s]; proche(d.net, d.recettesPerdues + d.offreIDF + d.offreProvince + d.capacite + d.economiesCollecte, 1e-12, 'décomposition de la gratuité = somme des composantes (' + s + ')'); });
proche(g.central.recettesPerdues, 4.27, 0.001, 'recettes tarifaires perdues : 4,27 Md€'); proche(g.central.offreIDF, 0.51, 0.01, 'offre IDF urbain central : 0,51'); proche(g.central.offreProvince, 1.24, 0.01, 'offre province central : 1,24');
proche(g.central.net / 10.8, 0.56, 0.005, 'gratuité : 0,56 point de taux plat (sources/chiffrage-gratuite-transports-urbains.md)');
ok(G.gratuite('central') < 10.4, 'la gratuité urbaine coûte moins que l\'ancienne ligne H12 (gratuité hors TGV : 10,4)');
// 3. Âge libre d'un trimestre par an : le V6 est celui de la variante (a)
SC.forEach(function (s) { [2029, 2041, 2060].forEach(function (y) { proche(G.v6(s, y), F.net(s, 'a', y), 1e-12, 'V6 de la v5.7 = variante (a) de decisions_0511f.js (' + s + ', ' + y + ')'); }); });
ok(G.v6('central', 2035) > E.v6Net('central', 2035) - 30 && G.v6('central', 2029) > E.v6Net('central', 2029), 'la variante (a) allège 2029 par rapport à l\'ouverture en 3 ans de la v5.6');
proche(F.ageLibreDetail('central', 'immediat', 2040).ageLibreMdE, E.composantes('central', 2040).ageLibre, 1e-9, 'ageLibreDetail (ouverture en 3 ans) = composante âge libre de la v5.6');
var c60 = G.composantesV6('central', 2060);
proche(c60.net, G.v6('central', 2060), 1e-9, 'composantes du V6 (variante a) : somme = effet net (hautes pensions retirées)');
proche(c60.pensions, 19.718, 0.01, 'V6 variante (a) en 2060 : pensions en moins 19,7'); proche(c60.recettes, -5.266, 0.01, 'recettes : −5,27'); proche(c60.substitution + c60.plancher, -8.0114, 0.01, 'substitution et plancher : −8,0');
// 4. Effet net, solde, taux d'équilibre
ok(G.net('central', 2028) === 0 && G.fo('central', 2028) === 0 && G.tu('central', 2028) === 0, 'aucun effet avant 2029');
SC.forEach(function (s) { [2029, 2041, 2060, 2070].forEach(function (y) { proche(G.net(s, y), G.v6(s, y) + G.fo(s, y) - G.tu(s, y), 1e-12, 'net = V6 + fiscalité d\'orientation − gratuité (' + s + ', ' + y + ')'); }); });
proche(G.solde('central', 2060), D.solde('central') + G.net('central', 2060), 1e-12, 'solde 2060 = solde v5.5 + net');
[2031, 2041, 2060].forEach(function (y) { proche(D.solde('central', 0, G.tauxEquilibre(y)) + G.net('central', y), 0, 0.01, 'au taux d\'équilibre de ' + y + ' le solde est nul'); });
ok(G.net('central', 2060) - E.v6Net('central', 2060) > 0.5 && Math.abs(G.net('central', 2060) - F.net('central', 'a', 2060) - (G.fo('central', 2060) - G.tu('central', 2060))) < 1e-12, 'v5.7 = V6 variante (a) + fiscalité d\'orientation − gratuité');
// 5. Indicateurs
var cx = G.creux(), cr = G.croisiere(), l = G.lissage(), cxa = F.creux('a'), cxi = F.creux('immediat');
ok(cx.taux < cxa.taux && cxa.taux < cxi.taux, 'taux maximal : v5.7 < variante (a) seule < v5.6 (44,34 %)');
proche(cx.taux, 0.4312, 0.0005, 'taux maximal du creux : 43,12 % (2041)'); ok(cx.an >= 2038 && cx.an <= 2044, 'creux vers 2041');
proche(cr.taux, 0.4062, 0.0005, 'taux de croisière 2060 : 40,62 %'); ok(cr.taux < 0.42 && cr.taux < cx.taux, 'croisière < 42 % < creux');
ok(l.anneesDeficit >= 15 && l.anneesDeficit <= 22 && l.premiere >= 2029 && l.derniere <= 2052, 'années de déficit à 42 % entre 15 et 22, avant 2052 (obtenu ' + l.anneesDeficit + ' : ' + l.premiere + ' à ' + l.derniere + ')');
ok(l.manqueCumule < F.lissage('a', 0.42).manqueCumule, 'déficit cumulé inférieur à celui de la variante (a) seule');
ok(l.manqueMax > 8 && l.manqueMax < 16, 'manque maximal à 42 % entre 8 et 16 Md€ (obtenu ' + l.manqueMax + ')');
proche(G.pointDeTaux(), 10.3962, 0.001, 'un point de taux plat vaut 10,40 Md€');
// 6. Dette : même récurrence que decisions_0511f.js
var dv6 = G.dette('central', { net: function (s, y) { return G.v6(s, y); } }), df = F.dette('central', 'a');
var maxEcart = 0, k; for (k = 0; k < 42; k++) maxEcart = Math.max(maxEcart, Math.abs(dv6.ratio[k] - df.ratio[k]));
ok(maxEcart < 1e-9, 'la récurrence de dette reproduit decisions_0511f.js (variante a) à 1e-9 près (écart ' + maxEcart + ')');
var jd = G.jalonsDette('central'), ja = F.jalonsDette('central', 'a');
ok(jd.serie.length === 42, 'dette sur 42 années (2029-2070)'); ok(jd.r10 < ja.r10 && jd.r20 < ja.r20 && jd.r30 < ja.r30, 'dette plus basse que la variante (a) seule : la fiscalité d\'orientation dépasse la gratuité');
ok(ja.r10 - jd.r10 > 0.003 && ja.r10 - jd.r10 < 0.03, 'effet à 10 ans entre 0,3 et 3 points de PIB');
SC.forEach(function (s) { ok(G.jalonsDette(s).r10 > 0, 'dette à 10 ans calculée (' + s + ')'); });
ok(G.jalonsDette('bas').r10 < jd.r10 && jd.r10 < G.jalonsDette('haut').r10, 'dette à 10 ans : bas < central < haut');
// 7. Option (i) taux de transition ; option (ii) 42 % constant
var l0 = G.lissage(), t1 = G.tauxTransition(l0.premiere, l0.derniere), t2 = G.tauxTransition(2029, 2060);
ok(t1 > 0.42 && t1 < cx.taux + 0.02, 'taux de transition de la fenêtre de déficit : entre 42 % et le pic + 2 points (obtenu ' + t1 + ')');
ok(t2 > 0.42 && t2 < t1, 'sur 2029-2060 le taux de lissage est plus bas que sur la fenêtre de déficit seule');
var o1 = G.optionTransition(l0.premiere, l0.derniere), o2 = G.optionTransition(2029, 2060);
proche(o1.cumulFenetreMdE, 0, 1e-6, 'à ce taux, la somme des soldes de la fenêtre est nulle : aucune dette supplémentaire (hors intérêts)');
proche(o2.cumulFenetreMdE, 0, 1e-6, 'idem sur 2029-2060');
var o43 = G.optionTransition(2029, l0.derniere, 0.43), o43c = G.optionTransition(2029, 2035, 0.43), o42c = G.optionTransition(2029, 2035, 0.42);
ok(o43.cumulFenetreMdE > o1.cumulFenetreMdE && o43.cumulFenetreMdE > 0, 'à 43 % sur toute la fenêtre de déficit : la somme des soldes est positive (le creux est plus que couvert)');
ok(o43c.picDuCumulMdE > o42c.picDuCumulMdE, 'à 43 % jusqu\'en 2035 : dette résiduelle inférieure à celle à 42 % (pic du cumul ' + o43c.picDuCumulMdE + ' contre ' + o42c.picDuCumulMdE + ')');
ok(o43.lissage.anneesDeficit < l0.anneesDeficit && o43c.lissage.anneesDeficit < l0.anneesDeficit, '43 % raccourcit la durée de déficit');
ok(o1.dette.r30 < jd.r30 + 1e-9 && o1.dette.r10 > 0, 'dette à 30 ans avec le taux de transition inférieure ou égale à celle à 42 % constant');
var op = G.optionPlat();
proche(op.dette.r10, jd.r10, 1e-12, 'option (ii) = référence 42 % constant'); proche(op.lissage.manqueCumule, l0.manqueCumule, 1e-12, 'option (ii) : même déficit cumulé');
// 8. Érosion de la fiscalité d'orientation (sensibilité, non comptée)
proche(G.foErosion(2029), f.central.total, 1e-12, 'érosion : année 1 = valeur comptée');
var ok2 = true; for (k = 2029; k < 2060; k++) if (G.foErosion(k + 1) > G.foErosion(k) + 1e-9) ok2 = false;
ok(ok2, 'la recette érodée décroît avec le temps'); proche(G.foErosion(2060), f.haut.total, 1e-9, 'érosion pleine (×2) = scénario défavorable');
ok(G.foErosion(2035) < G.fo('central', 2035) && G.foErosion(2035) > G.foErosion(2060), 'érosion intermédiaire en 2035');
ok(TP.PARAM.central.erosionTop === avantErosion, 'les paramètres d\'exil sont restaurés (aucun effet de bord)');
log('Tests v5.7 : ' + n + ' contrôles passés.');
