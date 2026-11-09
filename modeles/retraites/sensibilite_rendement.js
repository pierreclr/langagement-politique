// Sensibilité du rendement réel net du fonds (T13, 03/11/2026). Le défaut du modèle (3,5 %) n'est pas modifié.
// Lancer depuis modeles/retraites/ : jsc modele.js sensibilite_rendement.js
var M = this.Retraites || require('./modele.js');
var log = (typeof print === 'function') ? print : console.log;
function f(x, d) { return x.toFixed(d || 0); }
log('r % | apport Md/an | % PIB | duree ans | fin | cumul Md | fonds 2100 Md | fonds final % PIB | double charge moyenne 2027-2036 Md/an | gain actualise a 1 % Md | part couverte heritage % | economie permanente Md/an');
[4.34, 3.96, 3.5, 2.5, 2.0].forEach(function (rp) {
  var o = M.transition({ socle: 1000, regle: 'integral', scenario: 'central', r: rp / 100 });
  var lg = o.lignes.filter(function (l) { return l.annee >= 2027 && l.annee <= 2036; });
  var moy = lg.reduce(function (s, l) { return s + l.doubleCharge; }, 0) / lg.length;
  log([rp, f(o.apportMinimalMdE), f(o.apportMinimalPctPIB, 2), o.doubleCharge.dureeAns, o.doubleCharge.finAnnee, f(o.doubleCharge.cumulMdE),
    f(o.fonds.actif2100MdE), f(o.fonds.actifFinalPctPIB), f(moy, 1), f(-o.vaDoubleChargeAuTaux(0.01)), f(o.partCouverteParHeritage * 100),
    f(o.regimePermanent.economieAnnuelleVsRepartitionMdE)].join(' | '));
});
