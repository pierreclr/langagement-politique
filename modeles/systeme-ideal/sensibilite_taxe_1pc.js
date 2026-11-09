// Sensibilité de la taxe de 1 % (mesure 6) aux valeurs fiabilisées du rendement locatif et de l'érosion de l'assiette mobile, 04/11/2026 : sources/taxe-1pc-fiabilisation.md.
// Ne modifie AUCUN paramètre par défaut : PARAM est remplacé le temps d'un calcul, puis rétabli. Depuis ce dossier :
//   jsc taxe_patrimoine.js sensibilite_taxe_1pc.js          (taxe_patrimoine.js se charge seul)
// Ordre d'affichage : bas (le moins favorable au solde) / central / haut. Md€/an de 2024, croisière, sans abattement, sans paiement différé sauf mention.
var T = this.TaxePatrimoine;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r3(x) { return (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',').replace('-', '−') + ' %'; }
function sg(x) { return (x >= 0 ? '+' : '−') + r1(Math.abs(x)); }
var SC = T.SCS;

// Valeurs proposées (sources/taxe-1pc-fiabilisation.md § 4). rendementLocatif = rendement net des charges ET de la taxe foncière actuelle (la formule du modèle y ajoute tf ≈ 0,27 %).
var RENDEMENT_LITTERATURE = { bas: 0.017, central: 0.020, haut: 0.027 };
var EROSION_LITTERATURE = { bas: [0.55, 0.43], central: [0.30, 0.12], haut: [0.12, 0.04] };   // [top 1 %, reste]
var EROSION_STRESS_CAE = [0.74, 0.30];                                                         // valeur actuelle du bas (CAE Focus 118)

function avec(sc, patch, f) {            // remplace des paramètres le temps de f, puis les rétablit
  var p = T.PARAM[sc], old = {}, k;
  for (k in patch) { old[k] = p[k]; p[k] = patch[k]; }
  try { return f(); } finally { for (k in old) p[k] = old[k]; }
}
function nette(sc, patch, o) { return avec(sc, patch || {}, function () { return T.recette(sc, o).nette; }); }
function detail(sc, patch, o) { return avec(sc, patch || {}, function () { return T.recette(sc, o); }); }
function triplet(fn) { return SC.map(fn); }
function fmt(t) { return t.map(r1).join(' / '); }

log('=== A. Valeurs par défaut du modèle (rappel, inchangées) ===');
var def = triplet(function (s) { return nette(s); });
log('recette nette (bas / central / haut) : ' + fmt(def));
var defDiff = triplet(function (s) { return nette(s, null, { differe: true }); });
log('avec paiement différé (croisière) : ' + fmt(defDiff));
SC.forEach(function (s) { var p = T.PARAM[s]; log('  ' + s + ' : rendement ' + r3(p.rendementLocatif) + ', érosion top 1 % / reste ' + r3(p.erosionTop) + ' / ' + r3(p.erosionReste) + ', capitalisation ' + p.capitalisation); });

log('');
log('=== B. Rendement locatif : un paramètre à la fois (les autres au défaut du même scénario) ===');
log('défaut 3,0 / 3,5 / 4,5 % ; valeurs littérature 1,7 / 2,0 / 2,7 % (net des charges et de la taxe foncière)');
var rB = triplet(function (s) { return nette(s, { rendementLocatif: RENDEMENT_LITTERATURE[s] }); });
log('recette nette avec rendement de la littérature : ' + fmt(rB) + '   écart : ' + triplet(function (s, i) { return sg(rB[i] - def[i]); }).join(' / '));
log('effet prix (bas / central / haut), défaut : ' + triplet(function (s) { return r3(detail(s).effetPrix); }).join(' / ') + ' ; littérature : ' + triplet(function (s) { return r3(detail(s, { rendementLocatif: RENDEMENT_LITTERATURE[s] }).effetPrix); }).join(' / '));
log('grille au scénario central, autres paramètres inchangés :');
[0.017, 0.020, 0.027, 0.030, 0.035, 0.045].forEach(function (r) { log('  rendement ' + r3(r) + ' : recette ' + r1(nette('central', { rendementLocatif: r })) + ' Md€, effet prix ' + r3(detail('central', { rendementLocatif: r }).effetPrix)); });
var rVar = triplet(function (s) { return nette(s, { rendementLocatif: RENDEMENT_LITTERATURE[s] + 0.01 - 0.0027 }); });
log('variante de formule (dénominateur au NOUVEAU taux : rendement + 1 % au lieu de rendement + 0,27 %, équivalent à r + 0,73 point) : ' + fmt(rVar));

log('');
log('=== C. Érosion de l\'assiette mobile : un paramètre à la fois ===');
var rC = triplet(function (s) { var e = EROSION_LITTERATURE[s]; return nette(s, { erosionTop: e[0], erosionReste: e[1] }); });
log('défaut (top 1 % / reste) : 74/30 ; 40/15 ; 20/5 ; littérature : 55/43 ; 30/12 ; 12/4');
log('recette nette avec érosion de la littérature : ' + fmt(rC) + '   écart : ' + triplet(function (s, i) { return sg(rC[i] - def[i]); }).join(' / '));
log('érosion pondérée de la base mobile (part du top 1 % = 50 %), défaut : ' + triplet(function (s) { return r3(detail(s).erosionMobile); }).join(' / ') + ' ; littérature : ' + triplet(function (s) { var e = EROSION_LITTERATURE[s]; return r3(detail(s, { erosionTop: e[0], erosionReste: e[1] }).erosionMobile); }).join(' / '));
log('grille au scénario central (top 1 % / reste) :');
[[0.10, 0.04], [0.20, 0.08], [0.30, 0.12], [0.40, 0.15], [0.55, 0.43], [0.74, 0.30], [1.00, 1.00]].forEach(function (e) { log('  ' + r3(e[0]) + ' / ' + r3(e[1]) + ' : recette ' + r1(nette('central', { erosionTop: e[0], erosionReste: e[1] })) + ' Md€'); });
var mobile0 = T.composantes('pierre'); var mobAvant = mobile0.actions * 0.15 + mobile0.opc + mobile0.actions * 0.85 * 0.8;
log('base mobile avant érosion au central : ' + r1(mobAvant) + ' Md€ → recette théorique de ce seul canal à 1 % : ' + r1(mobAvant * 0.01) + ' Md€ ; chaque point d\'érosion pondérée = ' + r1(mobAvant * 0.0001) + ' Md€');

log('');
log('=== D. Les deux ensemble (littérature) : bas / central / haut ===');
var rD = triplet(function (s) { var e = EROSION_LITTERATURE[s]; return nette(s, { rendementLocatif: RENDEMENT_LITTERATURE[s], erosionTop: e[0], erosionReste: e[1] }); });
log('recette nette : ' + fmt(rD) + '   écart au défaut : ' + triplet(function (s, i) { return sg(rD[i] - def[i]); }).join(' / '));
var rDd = triplet(function (s) { var e = EROSION_LITTERATURE[s]; return nette(s, { rendementLocatif: RENDEMENT_LITTERATURE[s], erosionTop: e[0], erosionReste: e[1] }, { differe: true }); });
log('avec paiement différé : ' + fmt(rDd));
log('croisement au scénario central (lignes : rendement bas/central/haut littérature ; colonnes : érosion bas/central/haut littérature) :');
SC.forEach(function (sr) {
  log('  rendement ' + r3(RENDEMENT_LITTERATURE[sr]) + ' : ' + SC.map(function (se) { var e = EROSION_LITTERATURE[se]; return r1(nette('central', { rendementLocatif: RENDEMENT_LITTERATURE[sr], erosionTop: e[0], erosionReste: e[1] })); }).join(' / '));
});
log('stress : rendement bas littérature + érosion 74/30 au central : ' + r1(nette('central', { rendementLocatif: RENDEMENT_LITTERATURE.bas, erosionTop: EROSION_STRESS_CAE[0], erosionReste: EROSION_STRESS_CAE[1] })));

log('');
log('=== E. Charge de la taxe pour un propriétaire bailleur (rendement brut observé, hors modèle) ===');
// rendement brut = loyer médian OLL 2024 des 3 pièces × 12 / prix médian DVF 2024 des appartements (sources/calculs/rendement_locatif_dvf_oll.py) ; part de charges hors taxe foncière : 25 % (hypothèse)
var Z = [['Paris', 0.0303], ['Lyon', 0.0319], ['Bordeaux', 0.0326], ['Lille', 0.0368], ['Toulouse', 0.0411], ['Marseille', 0.0472], ['Grenoble', 0.0518], ['France, loyers / valeur des comptes nationaux', 0.030]];
log('zone ; rendement brut ; taxe de 1 % en part du loyer brut ; en part du loyer net de 25 % de charges ; taxe foncière actuelle (0,3 %) en part du loyer brut');
Z.forEach(function (z) { log('  ' + z[0] + ' ; ' + r3(z[1]) + ' ; ' + r3(0.01 / z[1]) + ' ; ' + r3(0.01 / (z[1] * 0.75)) + ' ; ' + r3(0.003 / z[1])); });
log('');
log('Reproduction : jsc taxe_patrimoine.js sensibilite_taxe_1pc.js ; le script ne modifie ni optimum.js ni les défauts.');
