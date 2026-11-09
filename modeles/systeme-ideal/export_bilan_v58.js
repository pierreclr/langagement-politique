// Export des montants de la v5.8 vers sources/calculs/bilan_global.py (constantes MODELE et TRAJ_V58). Depuis ce dossier, avec jsc :
//   jsc <liste de test_decisions_0511h.js, de modele.js à decisions_0511h.js (sans le test)> export_bilan_v58.js
var H = this.Decisions0511h, G = this.Decisions0511g, F = this.Decisions0511f, E = this.Decisions0511e;
var log = (typeof print === 'function') ? print : console.log;
function q(x) { return String(x); }
var gc = H.gratuiteDetail('central'), dt = H.detentionDetail('central'), cx = H.creux(), cr = H.croisiere(), l = H.lissage(), d = H.jalonsDette('central'), b = H.periodeMinimale43(), pl = H.planTransition(b), ds = H.descenteSous42(b);
log('MODELE_V58 = {');
log("    'tu58_central': " + q(gc.net) + ", 'tu58_bas': " + q(H.gratuite('bas')) + ", 'tu58_haut': " + q(H.gratuite('haut')) + ", 'tu58_recettes': " + q(gc.recettesPerdues) + ", 'tu58_offre_idf': " + q(gc.offreIDF) + ", 'tu58_offre_province': " + q(gc.offreProvince) + ", 'tu58_capacite': " + q(gc.capacite) + ", 'tu58_collecte': " + q(gc.economiesCollecte) + ",");
log("    'cir_reoriente': " + q(H.HYP.cirReoriente) + ", 'fioul_2029': " + q(H.fioulCompte('central', 2029)) + ", 'fioul_2060': " + q(H.fioulCompte('central', 2060)) + ", 'detention_central': " + q(dt.economie) + ", 'detention_bas': " + q(H.detentionDetail('bas').economie) + ", 'detention_haut': " + q(H.detentionDetail('haut').economie) + ",");
log("    'solde_v58': " + q(H.solde('central', 2060)) + ", 'te_v58_croisiere': " + q(cr.taux) + ", 'te_v58_creux': " + q(cx.taux) + ", 'creux_an': " + cx.an + ", 'annees_deficit': " + l.anneesDeficit + ", 'deficit_premiere': " + l.premiere + ", 'deficit_derniere': " + l.derniere + ", 'deficit_cumule': " + q(l.manqueCumule) + ",");
log("    'dette_v58': (" + q(d.r10) + ", " + q(d.r20) + ", " + q(d.r30) + "), 'dette_v58_plan': (" + q(pl.dette.r10) + ", " + q(pl.dette.r20) + ", " + q(pl.dette.r30) + "), 'periode_43_fin': " + b + ", 'descente_an': " + ds.an + ", 'descente_taux': " + q(ds.taux) + ", 'point_taux': " + q(H.pointDeTaux()) + ",");
log('}');
var rows = H.trajectoire(), s = [];
rows.forEach(function (x) { var brut = E.v6Brut('central', x.an) + (F.ageLibre('central', 'a', x.an) - E.composantes('central', x.an).ageLibre); s.push('(' + x.an + ',' + q(brut) + ',' + q(x.v6) + ',' + q(x.fo) + ',' + q(x.fioul) + ',' + q(x.tu) + ',' + q(x.cir) + ',' + q(x.detention) + ',' + q(x.net) + ',' + q(x.solde) + ',' + q(x.taux) + ')'); });
log('TRAJ_V58 = [' + s.join(',') + ']');
