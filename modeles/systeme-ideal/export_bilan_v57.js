// Export des montants de la v5.7 vers sources/calculs/bilan_global.py (constantes MODELE et TRAJ_V57). Depuis ce dossier, avec jsc :
//   jsc <liste de test_decisions_0511g.js, de modele.js à decisions_0511g.js (sans le test)> export_bilan_v57.js
var G = this.Decisions0511g, F = this.Decisions0511f, E = this.Decisions0511e, D = this.Decisions0511d;
var log = (typeof print === 'function') ? print : console.log;
function q(x) { return String(x); }
var c = G.composantesV6('central', 2060), fo = G.fiscaliteOrientation('central'), tu = G.gratuiteDetail('central'), cx = G.creux(), cr = G.croisiere(), l = G.lissage(), d = G.jalonsDette('central');
log('MODELE_V57 = {');
log("    'v57_pensions_2060': " + q(c.pensions) + ", 'v57_recettes_2060': " + q(c.recettes) + ", 'v57_substitution_2060': " + q(-c.substitution) + ", 'v57_plancher_2060': " + q(-c.plancher) + ",");
log("    'v57_v6_net_2060': " + q(c.net) + ", 'v57_age_libre_2060': " + q(c.ageLibre) + ", 'v57_age_libre_v56_2060': " + q(E.composantes('central', 2060).ageLibre) + ",");
log("    'fo_central': " + q(fo.total) + ", 'fo_bas': " + q(G.fiscaliteOrientation('bas').total) + ", 'fo_haut': " + q(G.fiscaliteOrientation('haut').total) + ", 'fo_chauffage': " + q(fo.chauffage) + ", 'fo_avec_chauffage': " + q(fo.totalAvecChauffage) + ",");
['viande', 'carburants', 'aerien', 'voituresLourdes', 'tva0_alimentation', 'tva0_eau', 'tva0_medicaments'].forEach(function (p) { log("    'fo_" + p + "': " + q(fo.detail[p]) + ","); });
log("    'tu_central': " + q(tu.net) + ", 'tu_bas': " + q(G.gratuite('bas')) + ", 'tu_haut': " + q(G.gratuite('haut')) + ", 'tu_recettes': " + q(tu.recettesPerdues) + ", 'tu_offre_idf': " + q(tu.offreIDF) + ", 'tu_offre_province': " + q(tu.offreProvince) + ", 'tu_capacite': " + q(tu.capacite) + ", 'tu_collecte': " + q(tu.economiesCollecte) + ",");
log("    'solde_v57': " + q(G.solde('central', 2060)) + ", 'te_v57_croisiere': " + q(cr.taux) + ", 'te_v57_creux': " + q(cx.taux) + ", 'creux_an': " + cx.an + ", 'annees_deficit': " + l.anneesDeficit + ", 'deficit_premiere': " + l.premiere + ", 'deficit_derniere': " + l.derniere + ", 'deficit_cumule': " + q(l.manqueCumule) + ",");
log("    'dette_v57': (" + q(d.r10) + ", " + q(d.r20) + ", " + q(d.r30) + "), 'point_taux': " + q(G.pointDeTaux()) + ",");
log('}');
var rows = G.trajectoire(), s = [];
rows.forEach(function (x) { var brut = E.v6Brut('central', x.an) + (F.ageLibre('central', 'a', x.an) - E.composantes('central', x.an).ageLibre); s.push('(' + x.an + ',' + q(brut) + ',' + q(x.v6) + ',' + q(x.fo) + ',' + q(x.tu) + ',' + q(x.net) + ',' + q(x.solde) + ',' + q(x.taux) + ')'); });
log('TRAJ_V57 = [' + s.join(',') + ']');
