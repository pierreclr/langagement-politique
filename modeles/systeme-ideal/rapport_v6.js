// § 16 de resultats-optimum.txt : « Option retraites_v6 : le dispositif retraites décidé le 03/11 » (H640). Reproduction, depuis ce dossier (sortie ajoutée à la suite du § 15) :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js ../risques/stress.js rapport_v6.js >> resultats-optimum.txt
var Z = this.Optimum, F = this.Voies.fus, ST = this.Stress;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function pc(x, d) { var k = d === undefined ? 1 : d, m = Math.pow(10, k); return (Math.round(x * 100 * m) / m).toString().replace('.', ',').replace('-', '−') + ' %'; }
function pt(x) { return (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',') + ' %'; }
function trip(o) { return r1(o.bas) + ' / ' + r1(o.central) + ' / ' + r1(o.haut); }
var SCS = ['bas', 'central', 'haut'], t0 = Date.now();
var V5 = Z.archi(Z.ARCHITECTURE_V5);
var MODES = [['aucune', 'v5 sans retraites (référence)'], ['ageReference', 'âge de référence indexé seul'], ['complet', 'dispositif complet']];

log('\n## 16. Option « retraites_v6 » : le dispositif retraites décidé le 03/11 au soir (H640)');
log('Les retraites étaient **hors du modèle** de l\'architecture (§ 15.7 point 2 : l\'écart avec l\'Allemagne, +106 Md€, est dans les pensions). Cette option branche les montants de `modeles/retraites/resultats.md` (§ « Âge de référence indexé », hypothèses H61 à H70, `modeles/retraites/resultats-age-reference.txt`) sur le solde public **sans changer aucun défaut** (`retraitesV6: \'aucune\'`) ni la v5. Ordre du modèle : favorable / central / défavorable. **Les montants sont ceux de 2040** (montée en charge), appliqués tels quels au solde d\'architecture : lecture « si le dispositif était à son niveau de 2040 ».');

log('\n### 16.1 Montants branchés (effet sur le solde public, Md€ de 2025 par an)');
log('| année | âge de référence seul | dispositif complet |'); log('|---|---|---|');
[['2030', 'm2030'], ['2040 (**valeur branchée**)', 'm2040'], ['2060', 'm2060']].forEach(function (p) { log('| ' + p[0] + ' | ' + trip({ bas: Z.RETRAITES_V6.ageReference[p[1]][0], central: Z.RETRAITES_V6.ageReference[p[1]][1], haut: Z.RETRAITES_V6.ageReference[p[1]][2] }) + ' | ' + trip({ bas: Z.RETRAITES_V6.complet[p[1]][0], central: Z.RETRAITES_V6.complet[p[1]][1], haut: Z.RETRAITES_V6.complet[p[1]][2] }) + ' |'); });
log('Le dispositif complet comprend : âge de référence lié à l\'espérance de vie (2/3 des années gagnées), âge libre à coefficient neutre, départ à 60 ans sans réduction pour la pénibilité (20 % des départs), plancher de 1 300 € nets, indexation de 0,5 point en dessous des prix au-dessus de 2 000 €, contribution de 20 % au-dessus de 2 500 € nets.');

log('\n### 16.2 Effet sur le solde et sur le taux d\'équilibre (v5, taux de 40,7 % ; recherche au dixième de point)');
log('| option | solde b / c / h au taux v5 (Md€) | taux plat d\'équilibre (central) | écart au taux v5 (points) |'); log('|---|---|---|---|');
var res = {};
MODES.forEach(function (m) {
  var a = F(Z.BASE_V5, { retraitesV6: m[0] }), s = Z.soldes(F(Z.ARCHITECTURE_V5, { retraitesV6: m[0] })), t = Z.tauxEquilibre(a);
  res[m[0]] = { s: s, t: t };
  log('| ' + m[1] + ' | ' + trip(s) + ' | ' + pt(t) + ' | ' + (m[0] === 'aucune' ? '0' : r1(100 * (t - res.aucune.t))) + ' |');
});
var pas = Z.solde(F(V5, { tPlat: Math.round((V5.tPlat + 0.01) * 1000) / 1000 }), 'central') - Z.solde(V5, 'central');
log('1 point de taux plat vaut ' + r1(pas) + ' Md€ au central. Lecture : l\'âge de référence seul vaut ≈ ' + r1(res.ageReference.s.central - res.aucune.s.central) + ' Md€ au central, soit ≈ ' + r1((res.aucune.t - res.ageReference.t) * 100) + ' point de taux plat ; le dispositif complet ' + (res.complet.s.central < res.aucune.s.central ? 'coûte' : 'rapporte') + ' ≈ ' + r1(Math.abs(res.complet.s.central - res.aucune.s.central)) + ' Md€ au central en 2040 (taux d\'équilibre ' + pt(res.complet.t) + ').');

log('\n### 16.3 Dette à 10 ans (modeles/risques/stress.js, chemin « V5 » + effet retraites interpolé entre 2030, 2040 et 2060 ; année 1 = 2029)');
if (ST && ST.ARCHS.V5) {
  log('Le chemin de dette reçoit l\'effet retraites **année par année** (pas la valeur de 2040 dès l\'année 1) : 2030 → 2040 par interpolation linéaire. Le taux plat reste celui de la v5 (' + pt(V5.tPlat) + '). Une année de montée en charge sans effet de retraites sur le solde de départ n\'est pas modélisée (2029 = valeur de 2030).');
  log('| trajectoire | solde an 1 / an 5 / an 10 (Md€) | dette/PIB an 5 / an 10 |'); log('|---|---|---|');
  var d = {};
  MODES.forEach(function (m) { SCS.forEach(function (sc) { var r = ST.test('V5', sc, m[0] === 'aucune' ? {} : { retraitesV6: m[0] }); if (sc === 'central') d[m[0]] = r.ratio10; log('| ' + m[1] + ', ' + sc + ' | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5) + ' / ' + pc(r.ratio10) + ' |'); }); });
  log('Lecture : dette à 10 ans au central **' + pc(d.aucune, 1) + '** (v5) → **' + pc(d.ageReference, 1) + '** avec l\'âge de référence seul → **' + pc(d.complet, 1) + '** avec le dispositif complet. ' + (d.complet > d.aucune ? 'Le dispositif complet **aggrave** la dette à dix ans : la liberté de partir à 60 ans coûte avant 2040, avant que l\'âge de référence ne mord (2034).' : 'Le dispositif complet améliore la dette.'));
} else log('stress.js non chargé : dette non recalculée.');

log('\n### 16.4 Lecture, steelman et limites (Claude, révisable ; V10730 à V10732)');
log('1. **Ce qui rapporte, ce qui coûte** : l\'âge de référence indexé (+7,4 Md€ au central en 2040) et le niveau (indexation et hautes pensions, ≈ 13 Md€) rapportent ; la liberté de partir à 60 ans sans réduction (pénibilité : 7,4 Md€ de dispense en 2040) et l\'âge libre coûtent. **Le dispositif complet est déficitaire avant 2040 au central (−21 Md€ en 2030, −6 en 2040)** : l\'auteur a choisi cela pour des raisons d\'équité (pénibilité, écart entre ceux qui commandent le travail et ceux qui l\'exécutent), pas de solde.');
log('2. **Fourchette de 2040 : de +28,5 à −26,5 Md€** : le signe du dispositif complet dépend de paramètres sans source (part des départs concernés par la pénibilité, passage de l\'âge légal à l\'âge réel) ⚠️ V10109.');
log('3. **Objection (steelman)** : « vous ne comblez pas l\'écart avec l\'Allemagne (≈ 3 points de PIB) : le dispositif complet en comble 1 % en 2040, 22 % en 2060 au central ». Réponse : exact, c\'est un stabilisateur, pas un rattrapage ; l\'écart demande de l\'emploi des seniors ou un niveau plus bas (`modeles/retraites/resultats.md`).');
log('4. **Limites de l\'intégration** : (i) valeur de 2040 posée ⚠️ V10730 sur un solde « de croisière à 10 ans » (mélange de deux horizons : le § 16.3 corrige par l\'interpolation) ; (ii) ⚠️ V10731 : l\'option n\'est pas dans la v5 ni dans ses variantes : les cas types et les dixièmes ne sont pas recalculés (le plancher de 1 300 € et les pensions ne passent pas par `gagnants-perdants`) ; (iii) aucun effet sur l\'offre de travail du modèle des cotisants ; (iv) ⚠️ V10732 : les trois paramètres de comportement du dispositif (0,6 / 0,8 / 1,0 ; 50 / 65 / 75 % ; 0 / 25 / 50 %) sont hypothétiques.');
log('\nTemps de calcul du § 16 : ' + Math.round((Date.now() - t0) / 1000) + ' s.');
