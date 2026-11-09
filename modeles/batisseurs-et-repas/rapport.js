// Génère resultats.txt. Lancer depuis modeles/batisseurs-et-repas/ :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc modele.js rapport.js > resultats.txt
var M = this.BatisseursRepas || (typeof require !== 'undefined' ? require('./modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function sep(x, d) { var s = (Math.round(x * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toFixed(d || 0); var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return p.join(','); }
function k(x) { return sep(x / 1000) + ' k'; }
function md(x) { return sep(x / 1e9, 2) + ' Md€'; }
function eur(x) { return sep(x, 2) + ' €'; }
var S = M.SCENARIOS;

log('# Bâtisseurs et repas — généré par rapport.js. Hypothèses et ordres de grandeur, jamais des prédictions.\n');

log('## A. Passoires : stock, rythme, main-d\'œuvre (résidences principales, SDES 01/01/2025)');
S.forEach(function (s) {
  log('### scénario ' + s + ' (ETP par rénovation : ' + sep(M.val(M.P.etpParRenovation, s), 2) + ')');
  log('périmètre | horizon | logements | rénovations/an | × rythme 2024 | ETP nécessaires | ETP actuels (rythme 2024) | manque | formés/an pour combler en ≤ 10 ans | document de travail de l'atelier, non publié);
  M.besoinsRenovation(s).forEach(function (b) {
    log(b.perimetre + ' | ' + b.horizon + ' ans | ' + sep(b.stock / 1e6, 2) + ' M | ' + k(b.renovAn) + ' | ' + sep(b.multipleRythme2024, 1) + ' | ' + k(b.etp) + ' | ' + k(b.etpActuels) + ' | ' + k(b.manque) + ' | ' + k(b.formesParAn) + ' | ' + md(b.coutTravauxAnMd * 1e9));
  });
});
log('repère : Ademe-BUS2 et France Stratégie-Dares, +170 k à +250 k ETP entre 2019 et 2030 pour toute la rénovation énergétique\n');

log('## B. Coût d\'une formation payée sur chantier-école (par personne formée)');
log('scénario | durée | coût par an | coût brut | dont rémunération | valeur des travaux réalisés | coût net | rénovations-équivalentes réalisées');
S.forEach(function (s) {
  var c = M.coutFormationBatisseur(s);
  log(s + ' | ' + sep(c.annees, 1) + ' an | ' + sep(c.parAn) + ' € | ' + sep(c.brut) + ' € | ' + sep(c.remunPart * 100) + ' % | ' + sep(c.valeurTravaux) + ' € | ' + sep(c.net) + ' € | ' + sep(c.renovEquivalentes, 2));
});
log('repère : aide au poste ACI 2026 = ' + sep(M.D.aideAuPosteACI2026) + ' € par ETP et par an\n');

log('## C. Programme : N jeunes formés par an (régime de croisière)');
log('scénario | N | coût brut/an | valeur des document de travail de l'atelier, non publié | coût net/an | stagiaires en formation | encadrants | pros en poste à 10 ans | rénovations/an qu\'ils font | économie réelle par rénovation');
S.forEach(function (s) {
  [10000, 30000, 50000].forEach(function (N) {
    var p = M.programmeBatisseurs(N, s);
    log(s + ' | ' + k(N) + ' | ' + md(p.coutBrutAn) + ' | ' + md(p.valeurTravauxAn) + ' | ' + md(p.coutNetAn) + ' | ' + k(p.stagiairesEnFormation) + ' | ' + sep(p.encadrants) + ' | ' + k(p.pros10ans) + ' | ' + k(p.renovAnParLesPros10ans) + ' | ' + sep(p.economieParRenovAn) + ' €/an');
  });
});
log('');

log('## D. Agriculture');
S.forEach(function (s) {
  var c = M.coutInstallationAgricole(s);
  log(s + ' : coût par formé ' + sep(c.parForme) + ' € ; par installé ' + sep(c.parInstalle) + ' € (+ DJA ' + sep(c.dja) + ' € = ' + sep(c.parInstalleAvecDja) + ' €)');
  [5000, 8000].forEach(function (n) {
    var p = M.programmeAgricole(n, s);
    log('   ' + k(n) + ' installations en plus/an : ' + k(p.formesParAn) + ' formés ; ' + md(p.coutAnHorsDja) + ' hors DJA ; ' + md(p.coutAnAvecDja) + ' avec DJA');
  });
});
log('écart départs (≈ 21 000, 2022) − installations (12 661, 2024) : ' + sep(M.programmeAgricole(0, 'central').ecartDepartsInstallations) + ' par an\n');

log('## E. Repas : coût de revient d\'un repas entrée-plat-dessert bio, à emporter (cuisine de 3 000 repas/jour)');
log('scénario | denrées | personnel | vente | énergie | emballage | amortissement | coût HT | aide au poste/repas | prix TTC (10 %) | prix TTC sans aide | prix TTC à 5,5 %');
S.forEach(function (s) {
  var r = M.coutRevientRepas(3000, s), r55 = M.coutRevientRepas(3000, s, { tva: 0.055 }), p = r.postes;
  log(s + ' | ' + eur(p.denrees) + ' | ' + eur(p.personnel) + ' | ' + eur(p.vente) + ' | ' + eur(p.energie) + ' | ' + eur(p.emballage) + ' | ' + eur(p.amortissement) + ' | ' + eur(r.coutHT) + ' | ' + eur(r.aideAuPosteParRepas) + ' | ' + eur(r.prixTTC) + ' | ' + eur(r.prixTTCsansAide) + ' | ' + eur(r55.prixTTC));
});
log('');
log('capacité | coût HT (central)');
[500, 1000, 2000, 3000, 6000].forEach(function (c) { log(c + ' repas/jour | ' + eur(M.coutRevientRepas(c, 'central').coutHT)); });
S.forEach(function (s) {
  var cm = M.capaciteMinPourPrix(8, s), a = M.repasPourAmortir(3000, M.D.coutRepasCrous2025 / 1.1, s);
  log(s + ' : capacité minimale pour un prix TTC ≤ 8 € : ' + (cm === null ? 'jamais (≤ 20 000)' : cm + ' repas/jour') + ' ; repas pour amortir la cuisine si vendus 7,89 € TTC : ' + (a ? k(a.repas) + ' (' + sep(a.annees, 1) + ' ans)' : 'jamais'));
});
log('');

log('## F. Réseau de 100 cuisines de 3 000 repas/jour : emplois et coût public net (par an)');
log('scénario | repas/an | ETP insertion | encadrants | investissement | aide au poste | RSA évité | net hors TVA | TVA collectée | net avec TVA');
S.forEach(function (s) {
  var c = M.coutPublicRepas(100, 3000, s);
  log(s + ' | ' + sep(c.repasAn / 1e6, 1) + ' M | ' + sep(c.insertion) + ' | ' + sep(c.encadrants) + ' | ' + md(c.invest) + ' | ' + sep(c.aideAuPoste/1e6,1) + ' M€ | ' + sep(c.rsaEvite/1e6,1) + ' M€ | ' + sep(c.netHorsTva/1e6,1) + ' M€ | ' + sep(c.tvaCollectee/1e6,1) + ' M€ | ' + sep(c.netAvecTva/1e6,1) + ' M€');
});
log('');

log('## G. Comparaison avec l\'existant (subvention publique par repas)');
S.forEach(function (s) {
  var c = M.comparaisonRepas(s);
  log(s + ' : Crous à 1 € ' + eur(c.crous1) + ' ; Crous à 3,30 € ' + eur(c.crous330) + ' ; mesure ' + eur(c.mesure) + ' (prix ' + eur(c.prixMesure) + ' TTC) ; coût Crous ' + eur(c.coutCrous) + ' ; cantine AMF 2020 ' + eur(c.coutCantine));
});
log('Restos du cœur 2024-2025 : 161 M repas gratuits, 1,3 M personnes (budget non lu)');
