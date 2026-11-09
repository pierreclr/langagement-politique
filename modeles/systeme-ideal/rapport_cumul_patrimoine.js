// Rapport de cumul_patrimoine.js (04/11/2026). Depuis ce dossier :
//   jsc cumul_patrimoine.js rapport_cumul_patrimoine.js > resultats-cumul-patrimoine.txt
var C = this.CumulPatrimoine, log = (typeof print === 'function') ? print : console.log;
function pc(x) { return x === null || x === undefined ? '—' : (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',') + ' %'; }
function ke(x) { return Math.round(x / 1000).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' k€'; }
function x2(x) { return x === null || x === undefined ? '—' : (Math.round(x * 100) / 100).toFixed(2).replace('.', ','); }
var SC = C.SC;

log('# Cumul des prélèvements sur le patrimoine (cumul_patrimoine.js, euros constants, ordres de grandeur sous hypothèses)\n');
log('Prélèvement unique ' + pc(C.CONST.tPrelevement) + ' ; taxe ' + pc(C.CONST.taxe) + ' ; plafond ' + pc(C.CONST.plafondRevenu) + ' du revenu sous ' + C.CONST.medianNiveauVie + ' €/UC ; E\' : K = ' + C.CONST.K + ' € ; créance : intérêt réel ' + pc(C.CONST.interetCreance) + '.\n');

log('## 1. Rendements réels annuels (y = revenu courant net, g = plus-value réelle)');
log('| actif | bas (y + g) | central | haut |'); log('|---|---|---|---|');
Object.keys(C.RENDEMENTS).forEach(function (k) { log('| ' + k + ' | ' + SC.map(function (s) { var r = C.RENDEMENTS[k][s]; return pc(r.y) + ' + ' + pc(r.g) + ' = ' + pc(r.y + r.g); }).join(' | ') + ' |'); });

log('\n## 2. Cas types, scénario central : système proposé contre droit actuel');
log('| cas | prélevé par an / rendement (système → actuel) | cumul de détention / rendement (système → actuel) | tout compris, droits inclus (système → actuel) | prélevé au décès / valeur transmise (système → actuel) | dont droits E\' / gain / créance | revenu prélevé, max annuel (taxe payée + prélèvement) | années plafonnées | capital transmis net / valeur d\'entrée |');
log('|---|---|---|---|---|---|---|---|---|');
C.CAS.forEach(function (c) {
  var s = C.simuler(c, 'central'), a = C.simulerActuel(c, 'central');
  log('| ' + c.id + ' | ' + pc(s.fluxAnnuelDu) + ' → ' + pc(a.fluxAnnuelDu) + ' | ' + pc(s.cumulDetention) + ' → ' + pc(a.cumulDetention) + ' | ' + pc(s.cumulTout) + ' → ' + pc(a.cumulTout) + ' | ' +
    (c.fin === 'deces' ? pc(s.partTransmise) + ' → ' + pc(a.partTransmise) : 'vente : ' + pc(s.partVente)) + ' | ' + (c.fin === 'deces' ? pc(s.partDroits) + ' / ' + pc(s.partGainDeces) + ' / ' + pc(s.partCreance) : '—') + ' | ' + pc(s.ratioRevenuMax) + ' | ' + s.anneesPlafonnees + '/' + c.N + ' | ' + x2(s.netTransmisSurV0) + ' |');
});

log('\n## 3. Les trois scénarios de rendement : cumul de détention / rendement réel (système → actuel) et prélevé au décès / valeur transmise (système → actuel)');
log('| cas | bas | central | haut |'); log('|---|---|---|---|');
C.CAS.forEach(function (c) {
  log('| ' + c.id + ' | ' + SC.map(function (sc) { var s = C.simuler(c, sc), a = C.simulerActuel(c, sc); return pc(s.cumulDetention) + ' → ' + pc(a.cumulDetention) + (c.fin === 'deces' ? ' ; décès ' + pc(s.partTransmise) + ' → ' + pc(a.partTransmise) : ''); }).join(' | ') + ' |');
});

log('\n## 4. Franchissements (central) : plus de 50 % du rendement, plus de 100 %, plus de 50 % de la valeur transmise, plus de 75 % du revenu de l\'année (analogue du plafonnement de l\'ISF, 2012-662 DC cons. 93)');
log('| cas | cumul de détention > 50 % | > 100 % | tout compris > 100 % | transmission > 50 % | revenu > 75 % |'); log('|---|---|---|---|---|---|');
function oui(b) { return b ? 'OUI' : 'non'; }
C.CAS.forEach(function (c) { var s = C.simuler(c, 'central'); log('| ' + c.id + ' | ' + oui(s.depasse50) + ' | ' + oui(s.depasse100) + ' | ' + oui(s.cumulTout > 1) + ' | ' + (c.fin === 'deces' ? oui(s.depasse50Transmission) : 'sans objet (vente)') + ' | ' + oui(s.depasse75Revenu) + ' |'); });
log('\nSur les trois scénarios, nombre de franchissements par critère (sur ' + C.CAS.length * 3 + ' combinaisons cas × scénario) :');
var cnt = { d50: 0, d100: 0, t100: 0, tr: 0, r75: 0 };
C.CAS.forEach(function (c) { SC.forEach(function (sc) { var s = C.simuler(c, sc); if (s.depasse50) cnt.d50++; if (s.depasse100) cnt.d100++; if (s.cumulTout > 1) cnt.t100++; if (s.depasse50Transmission) cnt.tr++; if (s.depasse75Revenu) cnt.r75++; }); });
log('cumul de détention > 50 % : ' + cnt.d50 + ' ; > 100 % : ' + cnt.d100 + ' ; tout compris > 100 % : ' + cnt.t100 + ' ; transmission > 50 % : ' + cnt.tr + ' ; revenu > 75 % : ' + cnt.r75);

log('\n## 5. Sensibilités (central) : prélevé au décès / valeur transmise, cas qui transmettent');
log('| variante | rp | entreprise | grand | heritier |'); log('|---|---|---|---|---|');
var VAR = [['référence (imputation, 40,7 %, intérêt 1 %)', {}], ['prélèvement unique à 50 % (modules patrimoine_*.js)', { t: 0.5 }], ['gain et droits cumulés (deces_realisation.js (i))', { mode: 'cumul' }], ['cumul et 50 %', { mode: 'cumul', t: 0.5 }],
  ['créance simplement indexée (intérêt réel 0)', { interet: 0 }], ['créance à 2 % réel', { interet: 0.02 }], ['sans plafond de 5 %', { sansPlafond5: true }]];
VAR.forEach(function (v) { log('| ' + v[0] + ' | ' + ['rp', 'entreprise', 'grand', 'heritier'].map(function (id) { return pc(C.simuler(C.cas(id), 'central', v[1]).partTransmise); }).join(' | ') + ' |'); });

log('\n## 6. Règle de plafonnement proposée (détention : taxe + prélèvement annuel ≤ 75 % du revenu ; transmission : créance + gain + droits ≤ 50 % de la valeur, excédent supprimé dans l\'ordre créance, gain, droits)');
log('| cas | revenu max avant → après | prélevé à la transmission ou à la vente avant → après | variation de la recette totale (taxe payée + prélèvements sur revenus + transmission ou vente), en € constants | taxe reportée plutôt que payée pendant la détention | capital transmis net / V0 avant → après |'); log('|---|---|---|---|---|---|');
C.CAS.forEach(function (c) {
  var s = C.simuler(c, 'central'), r = C.avecRegle(c, 'central'), av = c.fin === 'deces' ? s.partTransmise : s.partVente, ap = c.fin === 'deces' ? r.partTransmise : r.partVente, perdu = (r.taxePayee + r.impotRevenus + r.totalDeces) - (s.taxePayee + s.impotRevenus + s.totalDeces), diff = s.taxePayee - r.taxePayee;
  log('| ' + c.id + ' | ' + pc(s.ratioRevenuMax) + ' → ' + pc(r.ratioRevenuMax) + ' | ' + pc(av) + ' → ' + pc(ap) + ' | ' + (perdu > 0 ? '+' : '') + ke(perdu) + ' (' + pc(perdu / s.VN) + ' de la valeur) | ' + ke(diff) + ' | ' + x2(s.netTransmisSurV0) + ' → ' + x2(r.netTransmisSurV0) + ' |');
});
log('\nMême règle, mode « gain et droits cumulés » (deces_realisation.js (i)) :');
log('| cas | prélevé avant → après | variation de la recette (transmission) |'); log('|---|---|---|');
['entreprise', 'grand'].forEach(function (id) { var c = C.cas(id), s = C.simuler(c, 'central', { mode: 'cumul' }), r = C.avecRegle(c, 'central', { mode: 'cumul' }); log('| ' + id + ' | ' + pc(s.partTransmise) + ' → ' + pc(r.partTransmise) + ' | ' + ke(r.totalDeces - s.totalDeces) + ' (' + pc((r.totalDeces - s.totalDeces) / s.VN) + ' de la valeur) |'); });

log('\n## 7. Héritier modeste de 100 k€ : à la réception');
var h = C.simuler(C.cas('heritier'), 'central'), ha = C.simulerActuel(C.cas('heritier'), 'central');
log('droits E\' sur 100 000 € : ' + Math.round(h.droitsReception) + ' € (actuel : ' + Math.round(ha.droitsReception) + ' €) ; capital de départ : ' + Math.round(h.capitalDepart) + ' € ; solde : ' + Math.round(h.capitalDepart - h.droitsReception) + ' €.');

log('\n## 8. Rendement réel total à partir duquel le cumul de détention franchit 50 % ou 100 % (actions 1 M€, 20 ans, vendues ; 65 % du rendement en revenu courant, 35 % en plus-value)');
function cumulAuRendement(rt) { return C.simuler(C.cas('actions'), 'central', { rendement: { y: 0.65 * rt, g: 0.35 * rt } }).cumulDetention; }
function seuil(cible) { var lo = 0.002, hi = 0.20, m, i; for (i = 0; i < 60; i++) { m = (lo + hi) / 2; if (cumulAuRendement(m) > cible) lo = m; else hi = m; } return (lo + hi) / 2; }
log('| rendement réel total | 2 % | 3 % | 4,6 % | 6 % | 8 % | 10 % |'); log('|---|---|---|---|---|---|---|');
log('| cumul de détention | ' + [0.02, 0.03, 0.046, 0.06, 0.08, 0.10].map(function (r) { return pc(cumulAuRendement(r)); }).join(' | ') + ' |');
log('Le cumul franchit 100 % du rendement sous ' + pc(seuil(1)) + ' de rendement réel total, et reste au-dessus de 50 % tant que le rendement est sous ' + pc(seuil(0.5)) + '.');
