// Sensibilité du solde 2040 du dispositif retraites complet (mesure 16, option retraitesV6 = 'complet') aux paramètres de COMPORTEMENT,
// avec les valeurs proposées par sources/retraites-comportements.md (04/11/2026). NE CHANGE AUCUN DÉFAUT : age_libre.js n'est pas modifié ;
// ce script recompose le bilan de bilanReference() avec d'autres valeurs de paramètres (SCENARIOS_REF intact).
// Lancer depuis modeles/retraites/ :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc modele.js age_libre.js sensibilite_comportements.js
// Unités : Md€ de 2025 par an ; + améliore le solde public. Ordres de grandeur, jamais des prédictions.
var A = this.AgeLibre || (typeof require !== 'undefined' ? require('./age_libre.js') : null);
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return Math.round(x * 10) / 10; }

// MISE À JOUR 04/11/2026 (V12840-V12859) : les valeurs proposées ci-dessous (sauf passageLibre et partEmploiDeparts) sont devenues les défauts de SCENARIOS_REF. ACTUEL désigne désormais les ANCIENS défauts (avant le 04/11), gardés pour la comparaison ;
// le contrôle 0 reproduit donc l'ancien modèle (28,5 ; -5,6 ; -26,5) et non plus les défauts courants.
// Valeurs anciennes du modèle (ex-SCENARIOS_REF) et valeurs proposées. Ordre : [favorable, central, défavorable] pour les finances publiques.
var ACTUEL = {
  passage:        [1.0, 0.8, 0.6],
  contrepartie:   [0.0, 0.25, 0.5],
  partEnEmploi:   [0.75, 0.65, 0.5],
  subst:          [0, 0, 0],            // absent du modèle actuel
  passageLibre:   [0.2, 0.35, 0.5],
  partPenibilite: [0.10, 0.20, 0.30],
  partEmploiDeparts: [0.5, 0.5, 0.5]    // défaut de effetAgeLibre (0,5), non lié au scénario
};
var PROPOSE = {
  passage:        [0.8, 0.5, 0.33],     // Seibold 0,33 ; Manoli-Weber 0,4 ; Pays-Bas 0,6 (âge de liquidation) ; Bozio 0,4 (F) à 0,8 (H)
  contrepartie:   [0.0, 0.25, 0.5],     // inchangé : surcote 1,25 %/trimestre mais seulement 13-15 % des liquidants
  partEnEmploi:   [0.75, 0.50, 0.35],   // Rabaté-Rochut 0,40 ; Pays-Bas 0,32 ; Danemark 0,74
  subst:          [0.10, 0.20, 0.30],   // Rabaté-Rochut : 20 % des gains perdus en chômage, invalidité, maladie
  passageLibre:   [0.2, 0.35, 0.5],     // inchangé : Seibold 0,33 et Manoli-Weber 0,4 (symétrie supposée)
  partPenibilite: [0.05, 0.10, 0.20],   // part NETTE du droit actuel (carrière longue déjà ≈ 1 départ sur 5)
  partEmploiDeparts: [0.40, 0.45, 0.55] // Rabaté-Rochut 0,40 (emploi) ; COR : 55,5 % en emploi à 61 ans
};
var NOMS = ['favorable', 'central', 'défavorable'], SC = ['favorable', 'central', 'defavorable'];
var CLES = Object.keys(ACTUEL);

function vals(tab, i) { var o = {}; CLES.forEach(function (k) { o[k] = tab[k][i]; }); return o; }

/** Bilan complet (Md€/an) à l'année an pour des paramètres p ; sc = scénario de base pour les paramètres non variés ici (variante d'espérance de vie, indexation, seuil...). */
function bilan(p, sc, an, opt) {
  opt = opt || {};
  var s = A.SCENARIOS_REF[sc], annees = [an];
  var ref = A.effetAgeReference({ scenario: sc, annees: annees, passage: p.passage, contrepartie: p.contrepartie, partEnEmploi: p.partEnEmploi }).annees[an];
  var libre = A.effetAgeLibre({ delta: p.passageLibre * (64 - 60), coef: 'neutre', r: s.r, annees: annees, partEnEmploi: p.partEmploiDeparts }).annees[an];
  var pen = A.penibiliteIndexee({ scenario: sc, annees: annees, part: p.partPenibilite, passage: p.passage, partEnEmploi: p.partEmploiDeparts }).annees[an];
  var idx = A.indexationNiveau({ seuil: s.seuilIndexation, ecart: s.ecartIndexation, annees: annees }).annees[an];
  var hp = A.contributionHautes({}).recetteMdE;
  var b = { agRef: ref.economieMdE + ref.recettesMdE, agLibre: -libre.depenseMdE - libre.recettesPerduesMdE, pen: -pen.surcoutDispenseMdE, idx: idx.economieMdE, hp: hp };
  // Extension (non présente dans le modèle) : coût de substitution vers chômage, invalidité, maladie = part s des gains de l'âge de référence (Rabaté-Rochut : 20 %)
  b.subst = -(p.subst || 0) * b.agRef;
  // Variante symétrique (hypothèse non étudiée) : l'âge libre évite ce coût de substitution pour la part s de ses pertes
  b.substLibre = opt.symetrique ? (p.subst || 0) * (-b.agLibre) : 0;
  b.total = b.agRef + b.agLibre + b.pen + b.idx + b.hp + b.subst + b.substLibre;
  return b;
}

log('== 0. Contrôle : reproduction du modèle actuel (défauts), 2040, [favorable ; central ; défavorable] ==');
var base = SC.map(function (sc, i) { return bilan(vals(ACTUEL, i), sc, 2040).total; });
log('reproduit : [' + base.map(r1).join(' ; ') + '] ; attendu (resultats-age-reference.txt) : [28.5 ; -5.6 ; -26.5]');
var att = [28.5, -5.6, -26.5];
base.forEach(function (v, i) { if (Math.abs(v - att[i]) > 0.15) throw new Error('ECHEC : le script ne reproduit pas le modèle (' + NOMS[i] + ' ' + r1(v) + ' au lieu de ' + att[i] + ')'); });
log('ok  reproduction à 0,15 Md€ près');

function ligne(titre, tab, opt) {
  [2030, 2040, 2060].forEach(function (an) {
    var out = SC.map(function (sc, i) { return bilan(vals(tab, i), sc, an, opt); });
    log(titre + ' ' + an + ' : total [' + out.map(function (b) { return r1(b.total); }).join(' ; ') + '] ; centre : âge de réf. ' + r1(out[1].agRef) + ' (subst. ' + r1(out[1].subst) + '), âge libre ' + r1(out[1].agLibre + out[1].substLibre) + ', pénibilité ' + r1(out[1].pen) + ', niveau ' + r1(out[1].idx + out[1].hp));
  });
}
log('\n== 1. Valeurs proposées, jointes (tous les paramètres au même rang), sans puis avec coût de substitution ==');
var SANS = JSON.parse(JSON.stringify(PROPOSE)); SANS.subst = [0, 0, 0];
ligne('proposé sans substitution', SANS);
ligne('proposé avec substitution ', PROPOSE);
ligne('proposé, substitution symétrique (hypothèse)', PROPOSE, { symetrique: true });

log('\n== 2. Un paramètre à la fois : le central actuel (solde 2040 = ' + r1(base[1]) + '), un seul paramètre déplacé aux bornes proposées ==');
CLES.forEach(function (k) {
  var res = [0, 1, 2].map(function (j) {
    var p = vals(ACTUEL, 1); p[k] = PROPOSE[k][j]; return r1(bilan(p, 'central', 2040).total);
  });
  log(k + ' : valeur centrale actuelle ' + ACTUEL[k][1] + ' -> bornes proposées ' + PROPOSE[k].join(' / ') + ' => solde 2040 [' + res.join(' ; ') + ']');
});

log('\n== 3. Tirage aléatoire (graine fixe) : paramètres tirés indépendamment dans [défavorable ; favorable] proposés (loi triangulaire de mode central) ==');
var seed = 20261104; function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
function tri(a, m, b) { if (a === b) return a; var u = rnd(), lo = Math.min(a, b), hi = Math.max(a, b), c = (m - lo) / (hi - lo); return u < c ? lo + Math.sqrt(u * (hi - lo) * (m - lo)) : hi - Math.sqrt((1 - u) * (hi - lo) * (hi - m)); }
function tirage(tab, n, opt) {
  var v = [];
  for (var i = 0; i < n; i++) {
    var p = {}; CLES.forEach(function (k) { p[k] = tri(tab[k][2], tab[k][1], tab[k][0]); });
    v.push(bilan(p, 'central', 2040, opt).total);   // scénario de base central pour variante d'espérance de vie, indexation et hautes pensions
  }
  v.sort(function (a, b) { return a - b; });
  var pos = v.filter(function (x) { return x > 0; }).length / n;
  return 'n=' + n + ' ; P5 ' + r1(v[Math.floor(0.05 * n)]) + ' ; P25 ' + r1(v[Math.floor(0.25 * n)]) + ' ; médiane ' + r1(v[Math.floor(0.5 * n)]) + ' ; P75 ' + r1(v[Math.floor(0.75 * n)]) + ' ; P95 ' + r1(v[Math.floor(0.95 * n)]) + ' ; part des tirages à solde > 0 : ' + Math.round(pos * 100) + ' %';
}
log('valeurs proposées, sans substitution : ' + tirage(SANS, 300));
log('valeurs proposées, avec substitution : ' + tirage(PROPOSE, 300));
log('valeurs ACTUELLES (rappel) : ' + tirage(ACTUEL, 300));
