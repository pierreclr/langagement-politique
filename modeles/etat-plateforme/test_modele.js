// Test de cohérence et calculs de resultats.md. Lancer depuis modeles/etat-plateforme/ :
//   jsc modele.js test_modele.js
//   (macOS : /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
//   ou : node test_modele.js
var M = this.EtatPlateforme || (typeof require !== 'undefined' ? require('./modele.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r(x, d) { var f = Math.pow(10, d === undefined ? 1 : d); return Math.round(x * f) / f; }

// 1. Tests de cohérence
var D = M.DONNEES;
ok(Math.abs(D.partInfra + D.partApplicatif + D.partLicences - 1) < 1e-12, 'les parts de la dépense somment à 1');
ok(Math.abs(M.productiviteEffective(1, 0.6) - 1) < 1e-12, 'm = 1 → aucun gain');
ok(Math.abs(M.productiviteEffective(1e12, 0.6) - 2.5) < 1e-6, 'Amdahl : m infini, p = 0,6 → plafond ×2,5');
ok(Math.abs(M.productiviteEffective(5, 1) - 5) < 1e-12, 'p = 1 → m_eff = m');
var c = M.coutActuel(1);
ok(c.totalMdE > 0, 'coût actuel central positif');
var neutre = M.simuler({ m: 1, surcharges: { r: 0, g: 0, surcoutSecurite: 0, calculIaKE: 0 } });
ok(neutre.decomposition.mutualisationMdE === 0 && neutre.decomposition.iaMdE === 0, 'sans mutualisation ni IA : ces leviers valent 0');
var ref = M.simuler({ m: 1, surcharges: { r: 0, g: 0, surcoutSecurite: 0, calculIaKE: 0, e: 0, coutIngenieurKE: M.DONNEES.coutEtpInterneActuelKE } }, { depenseMdE: M.DONNEES.depenseMdE, partInfra: 0.45, partApplicatif: 0.55, partLicences: 0, coutEtpInterneActuelKE: 80, coutEtpExterneKE: 184 });
ok(Math.abs(ref.economieMdE) < 1e-9, 'aucun levier, tout interne au même coût → aucune économie');
var s = M.simuler({ productivite: 'x2' });
var dec = s.decomposition;
ok(Math.abs(dec.mutualisationMdE + dec.internalisationMdE + dec.iaMdE + dec.infraMdE + dec.securiteMdE - s.economieMdE) < 1e-9,
  'la décomposition somme à l\'économie totale');
var e1 = M.simuler({ productivite: 'x1.2' }).economieMdE, e2 = M.simuler({ productivite: 'x5' }).economieMdE;
ok(e2 > e1, 'plus de productivité → plus d\'économie');
ok(M.simuler({ productivite: 'x100' }).economieMdE < c.totalMdE, 'l\'économie reste inférieure au coût actuel');

// 2. Résultats (pour resultats.md)
var niveaux = ['bas', 'central', 'haut'];
[0, 1, 2].forEach(function (n) {
  var c0 = M.coutActuel(n);
  log('\n=== Coût actuel ' + niveaux[n] + ' : ' + r(c0.totalMdE) + ' Md€/an (infra ' + r(c0.infraMdE) + ', applicatif ' +
    r(c0.applicatifMdE) + ', licences ' + r(c0.licencesMdE) + ') ===');
  var g = M.grille(undefined, n);
  for (var o in g) for (var k in g[o]) {
    var x = g[o][k];
    log(o + ' ' + k + ' : m_eff ' + r(x.mEff, 2) + ' | cible ' + r(x.coutCibleMdE) + ' Md€ | économie ' + r(x.economieMdE) +
      ' Md€ (' + r(x.economiePct, 0) + ' %) [mut ' + r(x.decomposition.mutualisationMdE) + ', int ' +
      r(x.decomposition.internalisationMdE) + ', IA ' + r(x.decomposition.iaMdE) + ', infra ' + r(x.decomposition.infraMdE) +
      ', sécu ' + r(x.decomposition.securiteMdE) + '] | ETP actuels ' + r((x.effectifs.agentsActuelsEtp + x.effectifs.prestatairesActuelsEtp + x.effectifs.travailLicencesEtp) / 1e3, 0) + ' k (agents ' + r(x.effectifs.agentsActuelsEtp/1e3,0) + ', presta ' + r(x.effectifs.prestatairesActuelsEtp/1e3,0) + ', licences ' + r(x.effectifs.travailLicencesEtp/1e3,0) + ')' +
      ' k → ingénieurs ' + r(x.effectifs.ingenieursCibleEtp / 1e3, 0) + ' k | transition ' + r(x.transition.totalMdE) +
      ' Md€ (constr. ' + r(x.transition.constructionMdE) + ', double fonct. ' + r(x.transition.doubleFonctionnementMdE) + ', migration ' + r(x.transition.migrationMdE) +
      ') sur ' + x.transition.dureeAns + ' ans | retour ' + r(x.transition.retourAns) + ' ans');
  }
});
log('\n--- Plafond d\'Amdahl (m infini) ---');
[0.4, 0.6, 0.8, 0.9].forEach(function (p) { log('p = ' + p + ' → ×' + r(M.productiviteEffective(1e9, p), 2) + ' ; ×100 → ×' + r(M.productiviteEffective(100, p), 2)); });

log('\n--- Vision de l\'auteur : m = 100, p = 0,95, organisation haute, coût central ---');
var v = M.simuler({ m: 100, organisation: 'haut', surcharges: { p: 0.95 } });
log('m_eff ' + r(v.mEff, 1) + ' | cible ' + r(v.coutCibleMdE) + ' Md€ | économie ' + r(v.economieMdE) + ' Md€ (' + r(v.economiePct, 0) + ' %) | ingénieurs ' + r(v.effectifs.ingenieursCibleEtp / 1e3, 1) + ' k | transition ' + r(v.transition.totalMdE) + ' Md€');
log('\n--- Sensibilités (central, ×2) ---');
function sens(nom, sur) { var x = M.simuler({ productivite: 'x2', surcharges: sur }); log(nom + ' : économie ' + r(x.economieMdE) + ' Md€ ; transition ' + r(x.transition.totalMdE) + ' Md€ ; retour ' + r(x.transition.retourAns) + ' ans'); }
sens('référence', {});
var sansIa = M.simuler({ m: 1, surcharges: { calculIaKE: 0 } });
log('sans IA (m = 1) : économie ' + r(sansIa.economieMdE) + ' Md€ ; transition ' + r(sansIa.transition.totalMdE) + ' Md€ ; retour ' + r(sansIa.transition.retourAns) + ' ans');
sens('dépassement « cygne noir » +200 %', { depassement: 2.0 });
sens('sans mutualisation (r = 0)', { r: 0 });
sens('ingénieurs à 130 k€', { coutIngenieurKE: 130 });
sens('calcul d\'IA 50 k€/ingénieur', { calculIaKE: 50 });
sens('peu de sous-traitance actuelle (e = 0,2)', { e: 0.2 });
sens('sous-traitance des grands projets de l\'État (e = 0,68 : 32 % de ressources internes, Cour 2020 p. 68)', { e: 0.68 });
sens('sécurité à 15 %', { surcoutSecurite: 0.15 });
