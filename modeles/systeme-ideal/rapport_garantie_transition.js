// Rapport de la garantie de transition et des arrêts maladie (garantie_transition.js, 07/11/2026, NON ADOPTÉE). Depuis ce dossier :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc garantie_transition.js rapport_garantie_transition.js > resultats_garantie_transition.txt
// La dernière ligne (EXPORT) est recopiée dans sources/calculs/bilan_global.py (dictionnaire GT0711).
var G = this.GarantieTransition, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return x === null || x === undefined ? '—' : (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 1 : n).replace('.', ','); }
function sg(x, n) { return (x > 0 ? '+' : '') + f(x, n); }
function e0(x) { return f(x, 0); }

var cal = G.calibration(), B_AC = G.HYP.population.cout, B_MOD = G.HYP.complementModele.coutBilan;
log('# Garantie de transition : résultats (07/11/2026, non adoptée)');
log('');
log('## 1. Calibration sur l\'assurance chômage actuelle');
log('aléa mensuel de sortie h = ' + f(cal.h, 4) + ' ; durée potentielle moyenne ' + f(cal.dureePotentielle, 1) + ' mois ; mois indemnisés par entrant ' + f(cal.dureeMoyenne, 1) +
    ' (consommation ' + f(100 * cal.dureeMoyenne / cal.dureePotentielle, 0) + ' %) ; entrants ' + e0(cal.E) + ' par mois (' + f(cal.entrantsAn / 1e6, 2) + ' M par an) ; brut de référence médian ' + e0(cal.mediane) + ' € ; coût ARE simulé ' + f(cal.coutARE, 2) + ' Md€ (cible ' + f(B_AC, 1) + ')');
log('complément dégressif du modèle (deg2) recalculé dans cette population : ' + f(G.coutComplementModele(), 2) + ' Md€ (bilan : ' + f(B_MOD, 2) + ')');
log('');
log('## 2. Coût de la garantie selon la forme (supplément au-dessus du plancher, Md€/an, comportement central ; entre parenthèses : sans comportement ; effet sur les recettes et le plancher)');
log('| Départ | Durée | λ = −10 | λ = −3 | λ = 0 (droite) | λ = +3 | λ = +10 |'); log('|---|---|---|---|---|---|---|');
var grille = [];
[[1, 18], [1, 24], [0.9, 18], [0.9, 24], [0.8, 18], [0.8, 24]].forEach(function (x) {
  var cells = [-10, -3, 0, 3, 10].map(function (l) { var r = G.cout({ p0: x[0], T: x[1], lam: l }), r0 = G.cout({ p0: x[0], T: x[1], lam: l }, { sc: 'aucun' });
    grille.push({ p0: x[0], T: x[1], lam: l, sup: r.supplement, sup0: r0.supplement, rec: r.recettes }); return f(r.supplement, 1) + ' (' + f(r0.supplement, 1) + ' ; ' + sg(r.recettes, 1) + ')'; });
  log('| ' + f(100 * x[0], 0) + ' % | ' + x[1] + ' mois | ' + cells.join(' | ') + ' |');
});
log('');
log('## 3. Calibration à coût égal');
var CAL = { ac: [], modele: [], acOuvert: [], modeleOuvert: [] };
function ligneCal(t, c) {
  if (c.lam === null) { log('| ' + t + ' | ' + f(100 * c.p0, 0) + ' % | ' + c.T + ' | hors de portée | ' + c.horsPortee + ' | |'); return; }
  var r = c.cout; log('| ' + t + ' | ' + f(100 * c.p0, 0) + ' % | ' + c.T + ' | ' + f(c.lam, 2) + ' | ' + f(r.supplement, 2) + ' | ' + sg(r.recettes, 2) + ' |');
}
log('| Budget | Départ | Durée (mois) | λ | Supplément (Md€) | Recettes et plancher (Md€) |'); log('|---|---|---|---|---|---|');
[[1, 18], [1, 24], [0.9, 18], [0.9, 24], [0.8, 18], [0.8, 24]].forEach(function (x) { var c = G.calibrer(x[0], x[1], B_AC); CAL.ac.push(c); ligneCal('AC actuelle (37,1)', c); });
[[1, 18], [1, 24], [0.9, 18], [0.9, 24], [0.8, 18], [0.8, 24]].forEach(function (x) { var c = G.calibrer(x[0], x[1], B_MOD); CAL.modele.push(c); ligneCal('modèle actuel (12,56)', c); });
[[1, 18], [1, 24], [0.9, 18], [0.9, 24], [0.8, 18], [0.8, 24]].forEach(function (x) { var c = G.calibrer(x[0], x[1], B_AC, { dem: true, ind: true }); CAL.acOuvert.push(c); ligneCal('AC actuelle, ouverte (37,1)', c); });
[[1, 18], [1, 24], [0.9, 18], [0.9, 24], [0.8, 18], [0.8, 24]].forEach(function (x) { var c = G.calibrer(x[0], x[1], B_MOD, { dem: true, ind: true }); CAL.modeleOuvert.push(c); ligneCal('modèle actuel, ouverte (12,56)', c); });
log('');

// Les trois courbes retenues pour le dossier (coût égal à l'AC actuelle) : 100 % sur 24 mois, 100 % sur 18 mois, 90 % sur 24 mois ; et leurs sœurs « coût du modèle »
function trouve(liste, p0, T) { return liste.filter(function (c) { return c.p0 === p0 && c.T === T; })[0]; }
var TROIS = [trouve(CAL.acOuvert, 1, 24), trouve(CAL.acOuvert, 1, 18), trouve(CAL.acOuvert, 0.9, 24)].filter(function (c) { return c && c.lam !== null; });
var TROIS_M = [trouve(CAL.modeleOuvert, 1, 18), trouve(CAL.modeleOuvert, 1, 24), trouve(CAL.modeleOuvert, 0.9, 18)];
var OUVERT = { dem: true, ind: true };
log('## 4. Part de l\'ouverture aux démissionnaires et aux indépendants dans les courbes retenues (calibrées ouverture comprise ; Md€/an : bas / central / haut)');
log('| Courbe | Démissionnaires : supplément | Indépendants : supplément | Recettes et plancher (les deux) |'); log('|---|---|---|---|');
var OUV = [];
TROIS.concat(TROIS_M).forEach(function (c) {
  var v = { p0: c.p0, T: c.T, lam: c.lam }, d = ['bas', 'central', 'haut'].map(function (s) { var r = G.cout(v, { base: false, dem: true, ind: true, sc: s }); return r; });
  OUV.push({ p0: c.p0, T: c.T, lam: c.lam, dem: d.map(function (r) { return r.groupes.dem.supplement; }), ind: d.map(function (r) { return r.groupes.ind.supplement; }), rec: d.map(function (r) { return r.recettes; }) });
  log('| ' + f(100 * c.p0, 0) + ' %, ' + c.T + ' mois, λ ' + f(c.lam, 2) + ' | ' + d.map(function (r) { return f(r.groupes.dem.supplement, 2); }).join(' / ') + ' | ' + d.map(function (r) { return f(r.groupes.ind.supplement, 2); }).join(' / ') + ' | ' + d.map(function (r) { return sg(r.recettes, 2); }).join(' / ') + ' |');
});
log('');
log('## 5. Comportement : générosité et réaction (courbes retenues)');
TROIS.concat(TROIS_M).forEach(function (c) { var v = { p0: c.p0, T: c.T, lam: c.lam };
  var rs = ['bas', 'central', 'haut'].map(function (s) { return G.cout(v, { sc: s, dem: true, ind: true }); });
  var g = G.generosite(v, cal);
  log('- ' + f(100 * c.p0, 0) + ' %, ' + c.T + ' mois, λ ' + f(c.lam, 2) + ' : remplacement moyen sur 12 mois ' + f(100 * g.garantie, 0) + ' % (ARE actuelle ' + f(100 * g.actuel, 0) + ' %), r = ' + f(g.r, 3) +
      ' ; facteur de durée q = ' + rs.map(function (r) { return f(r.reaction.q, 3); }).join(' / ') + ' ; supplément ' + rs.map(function (r) { return f(r.supplement, 2); }).join(' / ') + ' ; recettes et plancher ' + rs.map(function (r) { return sg(r.recettes, 2); }).join(' / ') + ' (bas / central / haut)'); });
log('');
log('## 6. Cas types (€/mois, plancher compris ; ARE nette de CSG, CRDS et retraite, avant impôt ; après la fin des droits : plancher 877 €)');
var CASOUT = {};
TROIS.concat(TROIS_M.slice(0, 1)).forEach(function (c, ic) {
  var v = { p0: c.p0, T: c.T, lam: c.lam }, tag = (ic < TROIS.length ? 'AC ' : 'modèle ') + f(100 * c.p0, 0) + ' % ' + c.T + ' mois λ ' + f(c.lam, 2);
  log(''); log('### Courbe ' + tag);
  G.CAS.forEach(function (k) {
    var t = G.casType(k, v), sel = [1, 2, 3, 4, 6, 7, 9, 12, 15, 18, 19, 21, 24];
    CASOUT[tag + '|' + k.id] = t;
    log(''); log('**' + k.lib + '** : R = ' + e0(t.R) + ' €, revenu net de référence ' + e0(t.ref) + ' €' + (t.netActuel ? ' (net actuel ≈ ' + e0(t.netActuel) + ' €)' : ''));
    log('| Mois | ' + sel.join(' | ') + ' | Cumul 24 mois |'); log('|---|' + sel.map(function () { return '---'; }).join('|') + '|---|');
    log('| Garantie | ' + sel.map(function (m) { return e0(t.lignes[m - 1].garantie); }).join(' | ') + ' | ' + e0(t.cumul.garantie) + ' |');
    if (!k.independant) log('| ARE actuelle | ' + sel.map(function (m) { return e0(t.lignes[m - 1].are); }).join(' | ') + ' | ' + e0(t.cumul.are) + ' |');
    else log('| ATI (si liquidation) puis plancher | ' + sel.map(function (m) { return e0(t.lignes[m - 1].ati); }).join(' | ') + ' | ' + e0(t.lignes.reduce(function (a, l) { return a + l.ati; }, 0)) + ' |');
    log('| Complément du modèle | ' + sel.map(function (m) { return e0(t.lignes[m - 1].modele); }).join(' | ') + ' | ' + e0(t.cumul.modele) + ' |');
  });
});
log('');
log('## 7. Intérim de deux mois (salarié médian, intérim aux mois 7 et 8 à 2 000 € brut)');
var INT = {};
TROIS.slice(0, 1).concat(TROIS_M.slice(0, 1)).forEach(function (c) {
  var v = { p0: c.p0, T: c.T, lam: c.lam }, r = G.casInterim(v); INT[f(100 * c.p0, 0) + '-' + c.T] = r;
  log(''); log('Courbe ' + f(100 * c.p0, 0) + ' %, ' + c.T + ' mois, λ ' + f(c.lam, 2));
  log('| Mois | ' + r.garantie.map(function (l) { return l.mois; }).join(' | ') + ' |'); log('|---|' + r.garantie.map(function () { return '---'; }).join('|') + '|');
  log('| Garantie avec intérim | ' + r.garantie.map(function (l) { return e0(l.total); }).join(' | ') + ' |');
  log('| Horloge (mois de courbe) | ' + r.garantie.map(function (l) { return f(l.horloge, 1); }).join(' | ') + ' |');
  log('| Garantie sans intérim | ' + r.sansInterim.map(function (l) { return e0(l.total); }).join(' | ') + ' |');
  log('| ARE actuelle avec intérim | ' + r.are.map(function (l) { return e0(l.total); }).join(' | ') + ' |');
  log('référence après l\'intérim : ' + e0(r.garantie[8].ref) + ' € (avant : ' + e0(r.garantie[0].ref) + ' €)');
});
log('');
log('## 8. Arrêts maladie dans le même système (Md€/an, + = coûte ; bas / central / haut)');
var AMs = ['bas', 'central', 'haut'].map(function (s) { return G.arretsMaladie(s); }), AMs0 = ['bas', 'central', 'haut'].map(function (s) { return G.arretsMaladie(s, { reprise: false }); });
['carencePrive', 'carenceFP', 'comportementPrive', 'comportementFP', 'economies', 'reprise', 'retourSalaires', 'net'].forEach(function (k) { log('- ' + k + ' : ' + AMs.map(function (a) { return f(a[k], 2); }).join(' / ') + ' (sans reprise des compléments : ' + AMs0.map(function (a) { return f(a[k], 2); }).join(' / ') + ')'); });
log('');

// Recommandation de Claude : budget de 25 Md€ au-dessus du plancher, 18 mois, ouverture comprise
var RECO = G.calibrer(1, 18, 25, { dem: true, ind: true });
log('## 8 bis. Variante recommandée par Claude (25 Md€, 100 %, 18 mois, ouverture comprise)');
log('λ = ' + f(RECO.lam, 2) + ' ; recettes et plancher ' + sg(RECO.cout.recettes, 2) + ' ; démissionnaires ' + f(RECO.cout.groupes.dem.supplement, 2) + ' ; indépendants ' + f(RECO.cout.groupes.ind.supplement, 2));
G.CAS.forEach(function (k) { var t = G.casType(k, { p0: 1, T: 18, lam: RECO.lam }); log('- ' + k.lib + ' : ' + [1, 3, 6, 9, 12, 15, 18].map(function (m) { return 'm' + m + ' ' + e0(t.lignes[m - 1].garantie); }).join(', ') + ' ; cumul 24 mois ' + e0(t.cumul.garantie)); });
log('');

// Modulation par l'âge : pont vers la retraite (décision de l'auteur du 07/11/2026)
log('## 9. Pont vers la retraite (garantie modulée par l\'âge, à partir de 50 ans)');
var vA = { p0: 1, T: 24, lam: trouve(CAL.acOuvert, 1, 24).lam }, vR = { p0: 1, T: 18, lam: RECO.lam }, vM = { p0: 1, T: 18, lam: trouve(CAL.modeleOuvert, 1, 18).lam };
var PONT = {};
log('| Courbe de la garantie | Âge du taux plein | κ (surcoût 1 Md€) | Surcoût du pont : bas / central / haut (Md€) | Recettes et plancher (Md€) | Entrants de 50 ans et plus par an | Choisissent le pont |'); log('|---|---|---|---|---|---|---|');
[['A', vA], ['R', vR], ['M', vM]].forEach(function (x) { [60, 62, 64].forEach(function (A) {
  var c = G.calibrerPont(x[1], 1, { Atp: A }), sc = ['bas', 'central', 'haut'].map(function (s) { return G.coutPont(x[1], { Atp: A, kappa: c.kappa, sc: s }); });
  PONT[x[0] + A] = { kappa: c.kappa, surcout: sc.map(function (r) { return r.surcout; }), recettes: sc.map(function (r) { return r.recettes; }), entrants: c.cout.entrantsAn, choix: c.cout.choisissentAn };
  log('| ' + x[0] + ' | ' + A + ' ans | ' + f(c.kappa, 2) + ' | ' + sc.map(function (r) { return f(r.surcout, 2); }).join(' / ') + ' | ' + sc.map(function (r) { return sg(r.recettes, 2); }).join(' / ') + ' | ' + e0(c.cout.entrantsAn) + ' | ' + e0(c.cout.choisissentAn) + ' |'); }); });
var KA = PONT.A62.kappa;
log(''); log('Poids de l\'âge w(a) et niveau tenu L(a) (courbe A, taux plein 62 ans, κ = ' + f(KA, 2) + ', salarié médian, pension estimée ' + e0(0.75 * G.refDeBrut(2900)) + ' €) : ' + [50, 52, 55, 57, 58, 59, 60, 61].map(function (a) { return a + ' ans : w ' + f(G.poidsAge(a, { kappa: KA }), 2) + ', L ' + e0(G.niveauPont(G.refDeBrut(2900), a, { kappa: KA })) + ' €'; }).join(' ; '));
log('');
var CASP = {};
[[1867.02, 'Smic'], [2900, 'médian']].forEach(function (b) { [50, 55, 60].forEach(function (a) {
  var t = G.casPont(b[0], a, vA, { kappa: KA }), n = t.mois.length; CASP[b[1] + a] = t;
  var sel = [1, 3, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144].filter(function (m) { return m <= n; }); if (sel[sel.length - 1] !== n) sel.push(n);
  log('**' + b[1] + ', perte à ' + a + ' ans** (référence ' + e0(t.ref) + ' €, pension estimée ' + e0(t.pension) + ' €, niveau tenu ' + e0(t.niveau) + ' €, ' + n + ' mois jusqu\'à 62 ans)');
  log('| Mois | ' + sel.join(' | ') + ' | Cumul |'); log('|---|' + sel.map(function () { return '---'; }).join('|') + '|---|');
  log('| Pont | ' + sel.map(function (m) { return e0(t.mois[m - 1].pont); }).join(' | ') + ' | ' + e0(t.cumul.pont) + ' |');
  log('| Garantie standard | ' + sel.map(function (m) { return e0(t.mois[m - 1].standard); }).join(' | ') + ' | ' + e0(t.cumul.standard) + ' |');
  log('| ARE actuelle puis plancher | ' + sel.map(function (m) { return e0(t.mois[m - 1].are); }).join(' | ') + ' | ' + e0(t.cumul.are) + ' |');
  log('');
}); });

// Variante « coût constant » (consignes de l'auteur du 07/11/2026, soir)
log('## 10. Variante « coût constant » : 12 mois, droits proportionnels au travail, arrêts maladie 0 / 10 / 20 % puis 60 % dès le 4e jour (règle de l\'auteur)');
var MIX = G.mixProportionnel(12), AUJ = G.HYP.population.cout + G.AM2.ijActuelles, BASE = G.HYP.complementModele.coutBilan + G.AM2.ijActuelles;
log('Durées de droits (1 mois pour 2 mois travaillés, 12 au plus) : ' + MIX.map(function (d) { return d[0] + ' mois ' + f(100 * d[1], 0) + ' %'; }).join(' ; ') + ' ; aujourd\'hui ' + f(AUJ, 1) + ' Md€ (AC 37,1 + IJ 12,1) ; base ' + f(BASE, 2) + ' Md€ (complément 12,56 + IJ 12,1)');
log('');
log('| λ (12 mois) | Garantie versée (dont démissionnaires ; indépendants) | Pont (surcoût ; κ) | Arrêts maladie | **Total versé** | vs aujourd\'hui | vs base | Comportement (recettes ; pont) | Total avec comportement | vs aujourd\'hui | vs base |'); log('|---|---|---|---|---|---|---|---|---|---|---|');
var CC = {};
[-40, -10, -3, 0, 3, 10].forEach(function (l) {
  var t = G.coutTotal({ p0: 1, T: 12, lam: l, mix: MIX }, { schema: 'pierre' }), verse = t.garantie.supplement + t.pont.surcout + t.maladie.net, avec = verse - t.garantie.recettes - t.pont.recettes; CC[l] = t;
  log('| ' + l + ' | ' + f(t.garantie.supplement, 2) + ' (' + f(t.garantie.groupes.dem.supplement, 2) + ' ; ' + f(t.garantie.groupes.ind.supplement, 2) + ') | ' + f(t.pont.surcout, 2) + ' ; ' + f(t.kappa, 2) + ' | ' + f(t.maladie.net, 2) + ' | **' + f(verse, 2) + '** | ' + sg(verse - AUJ, 2) + ' | ' + sg(verse - BASE, 2) + ' | ' + sg(t.garantie.recettes, 2) + ' ; ' + sg(t.pont.recettes, 2) + ' | ' + f(avec, 2) + ' | ' + sg(avec - AUJ, 2) + ' | ' + sg(avec - BASE, 2) + ' |');
});
var C0 = ['bas', 'central', 'haut'].map(function (sc) { return G.coutTotal({ p0: 1, T: 12, lam: 0, mix: MIX }, { sc: sc, schema: 'pierre' }); });
log(''); log('Courbe centrale (λ = 0, droite) selon les réactions faibles / centrales / fortes : garantie ' + C0.map(function (t) { return f(t.garantie.supplement, 2); }).join(' / ') + ' ; recettes ' + C0.map(function (t) { return sg(t.garantie.recettes, 2); }).join(' / ') + ' ; pont ' + C0.map(function (t) { return f(t.pont.surcout, 2) + ' (' + sg(t.pont.recettes, 2) + ')'; }).join(' / ') + ' ; maladie ' + C0.map(function (t) { return f(t.maladie.net, 2); }).join(' / ') + ' ; facteur de durée q ' + C0.map(function (t) { return f(t.garantie.reaction.q, 3); }).join(' / '));
log('');
log('### Arrêts maladie : schémas comparés (Md€/an, IJ maladie actuelles 12,1)');
log('| Schéma | Taux plein | Jour du taux plein | Coût | Écart aux IJ actuelles | Jours 2-3 payés | Consultations évitées (millions) | Économie Assurance maladie | Coût net |'); log('|---|---|---|---|---|---|---|---|---|');
var AMV = {};
[['pierre', 'règle de l\'auteur : 0 / 10 / 20 %, puis 60 % dès le 4e jour (médecin), montée au taux plein au 8e jour'], ['principal', 'jour 1 : 0 ; jour 2 : 10 % ; jour 3 : 20 % ; puis +10 points/jour'], ['progressif', '10 / 20 / 30 % ; puis +10 points/jour'], ['sansPaie', 'jours 1-3 non payés ; 30 % au 4e jour, puis +10 points/jour']].forEach(function (x) { [0.64, 0.8].forEach(function (tp) {
  var a = G.arretsMaladie2({ schema: x[0], tp: tp }); AMV[x[0] + tp] = a;
  log('| ' + x[1] + ' | ' + f(100 * tp, 0) + ' % | ' + a.dPlein + ' | ' + f(a.cout, 2) + ' | ' + sg(a.ecart, 2) + ' | ' + f(a.joursCourtsPayes, 3) + ' | ' + f(a.consultationsEvitees / 1e6, 1) + ' | ' + f(a.economieAssuranceMaladie, 3) + ' (' + f(a.economieConsultations, 3) + ' toutes parts) | ' + f(a.net, 2) + ' |'); }); });
log('');
log('### Arrêts types : revenu reçu sur l\'arrêt, aujourd\'hui → règle de l\'auteur (taux plein 64 %), € et part du salaire net ; entre crochets : part payée par l\'employeur');
log('| Salarié | Maintien employeur | 3 jours | 5 jours | 10 jours | 30 jours |'); log('|---|---|---|---|---|---|');
var ART = {};
[[1867.02, 'Smic'], [2900, 'médian']].forEach(function (b) { [['aucun', 'aucun'], ['legal', 'légal (dès le 8e jour, 90 %)'], ['conventionnel', 'conventionnel (100 % dès le 1er jour)']].forEach(function (m) {
  log('| ' + b[1] + ' | ' + m[1] + ' | ' + [3, 5, 10, 30].map(function (n) { var r = G.arretType(b[0], n, 'pierre', 0.64, m[0]); ART[b[1] + m[0] + n] = r;
    return e0(r.aujourdhui) + ' → ' + e0(r.nouveau) + ' (' + f(100 * r.partAujourdhui, 0) + ' → ' + f(100 * r.partNouveau, 0) + ' %)' + (m[0] !== 'aucun' ? ' [' + e0(r.employeurAujourdhui) + ' → ' + e0(r.employeurNouveau) + ']' : ''); }).join(' | ') + ' |'); }); });
log('');
log('### Cas types, courbe centrale (λ = 0) et courbe généreuse (λ = −3), €/mois');
var CT = {};
[[0, 'centrale'], [-3, 'généreuse']].forEach(function (x) {
  var v = { p0: 1, T: 12, lam: x[0] };
  var head = '| Mois |'; for (var m = 1; m <= 24; m++) head += ' ' + m + ' |'; log(''); log('Courbe ' + x[1] + ' (λ = ' + x[0] + ')'); log(head + ' Cumul |'); var sep = '|---|'; for (m = 1; m <= 24; m++) sep += '---|'; log(sep + '---|');
  G.CAS.slice(0, 3).forEach(function (k) { var t = G.casType(k, v); CT[x[0] + k.id] = t;
    log('| ' + k.id + ' : garantie | ' + t.lignes.map(function (l) { return e0(l.garantie); }).join(' | ') + ' | ' + e0(t.cumul.garantie) + ' |');
    log('| ' + k.id + ' : ARE | ' + t.lignes.map(function (l) { return e0(l.are); }).join(' | ') + ' | ' + e0(t.cumul.are) + ' |'); });
  var j = G.casJeune(1867.02, 12, v); CT[x[0] + 'jeune'] = j;
  log('| jeune 25 ans, 12 mois au Smic : garantie (droits ' + j.droits + ' mois) | ' + j.lignes.map(function (l) { return e0(l.garantie); }).join(' | ') + ' | ' + e0(j.lignes.reduce(function (a, l) { return a + l.garantie; }, 0)) + ' |');
  log('| jeune : ARE (' + f(j.dureeARE, 1) + ' mois) | ' + j.lignes.map(function (l) { return e0(l.are); }).join(' | ') + ' | ' + e0(j.lignes.reduce(function (a, l) { return a + l.are; }, 0)) + ' |');
});
log('');

// EXPORT : courbe centrale de la couche du bilan = 100 %, 24 mois, coût égal à l'AC actuelle ouverture comprise ; population actuelle, ouverture, recettes et arrêts maladie en lignes séparées
var C1 = trouve(CAL.acOuvert, 1, 24), v1 = { p0: 1, T: 24, lam: C1.lam }, sc3 = ['bas', 'central', 'haut'];
var base3 = sc3.map(function (s) { return G.cout(v1, { sc: s }); }), ouv3 = sc3.map(function (s) { return G.cout(v1, { base: false, dem: true, ind: true, sc: s }); });
var EXPORT = { date: '2026-11-07', calibration: { h: cal.h, E: cal.E, mediane: cal.mediane, coutARE: cal.coutARE, complementModele: G.coutComplementModele() },
  courbe: v1, supplement: base3.map(function (r) { return r.supplement; }), recettes: base3.map(function (r) { return r.recettes; }),
  demissionnaires: ouv3.map(function (r) { return r.groupes.dem.supplement; }), independants: ouv3.map(function (r) { return r.groupes.ind.supplement; }), recettesOuverture: ouv3.map(function (r) { return r.recettes; }),
  maladie: AMs.map(function (a) { return a.net; }), maladieSansReprise: AMs0.map(function (a) { return a.net; }),
  trois: TROIS.map(function (c) { return { p0: c.p0, T: c.T, lam: c.lam, sup: c.cout.supplement, rec: c.cout.recettes }; }),
  troisModele: TROIS_M.map(function (c) { return { p0: c.p0, T: c.T, lam: c.lam, sup: c.cout ? c.cout.supplement : null, rec: c.cout ? c.cout.recettes : null }; }),
  budgetAC: B_AC, budgetModele: B_MOD,
  reco: { lam: RECO.lam, T: 18, budget: 25, rec: RECO.cout.recettes },
  coutConstant: { lam: 0, T: 12, mix: MIX, aujourdhui: AUJ, base: BASE, garantie: C0.map(function (t) { return t.garantie.supplement; }), recettes: C0.map(function (t) { return t.garantie.recettes; }),
    pont: C0.map(function (t) { return t.pont.surcout; }), pontRecettes: C0.map(function (t) { return t.pont.recettes; }), kappa: C0[1].kappa, maladie: C0.map(function (t) { return t.maladie.net; }),
    maladiePrincipal: AMV['principal0.64'].net, maladieSansPaie: AMV['sansPaie0.64'].net, maladieProgressif: AMV['progressif0.64'].net, maladie80: AMV['pierre0.8'].net, consultations: AMV['pierre0.64'].consultationsEvitees, ecoConsult: AMV['pierre0.64'].economieAssuranceMaladie, jours23: AMV['pierre0.64'].joursCourtsPayes,
    genereuse: { garantie: CC[-3].garantie.supplement, recettes: CC[-3].garantie.recettes } },
  pont: { kappa: KA, Atp: 62, surcout: PONT.A62.surcout, recettes: PONT.A62.recettes, entrants: PONT.A62.entrants, choix: PONT.A62.choix, kappa60: PONT.A60.kappa, kappa64: PONT.A64.kappa } };
log('EXPORT ' + JSON.stringify(EXPORT));
