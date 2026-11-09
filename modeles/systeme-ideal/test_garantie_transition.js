// Tests de la garantie de transition et des arrêts maladie (garantie_transition.js ; 07/11/2026, NON ADOPTÉE). Depuis ce dossier :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc garantie_transition.js test_garantie_transition.js
var G = this.GarantieTransition, log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// 1. Fonction des revenus (base de travail) : retrouve la fiche « système en une lecture »
proche(G.contribution(0), -412.5, 1e-9, 'C(0) = −412,5 €');
proche(G.netNouveau(0), 877, 1e-9, 'N(0) = plancher de 877 €');
proche(G.coutEmployeur(3000), 3994.09, 0.01, 'coût employeur de 3 000 € brut, mutuelle reversée : 3 994,09 €');
proche(G.contribution(3994.09), 1555.74, 0.05, 'C(3 994,09) = 1 555,74 € (fiche, § 2)');
proche(G.refDeBrut(1867.02), 1771.8, 0.5, 'Smic : revenu net du nouveau système ≈ 1 772 € (fiche, § 2)');
proche(G.filet(G.coutEmployeur(1867.02)), 166.25, 0.5, 'Smic : filet de 166 € (fiche, § 2)');
ok(G.netNouveau(1000) > 877 && G.netNouveau(300) > 877, 'tout revenu d\'activité donne un revenu net au-dessus du plancher');

// 2. ARE : formule et paramètres du 01/07/2025
var s = G.sjr(1867.02);
proche(G.areJour(s), 0.404 * s + 13.18, 1e-9, 'Smic : 40,4 % du SJR + 13,18 €');
proche(G.areJour(G.sjr(2900)), 0.57 * G.sjr(2900), 1e-9, 'médian : 57 % du SJR');
proche(G.areJour(G.sjr(1000)), 0.75 * G.sjr(1000), 1e-9, 'bas salaire : plafond de 75 % du SJR');
proche(G.areJour(G.sjr(1e6)), 300.21, 1e-9, 'allocation maximale de 300,21 € par jour');
var s6 = G.sjr(6000); proche(G.areJourMois(s6, 7), Math.max(92.57, 0.7 * G.areJour(s6)), 1e-9, 'dégressivité de 30 % au 7e mois, plancher 92,57 €');
proche(G.areJourMois(s6, 6), G.areJour(s6), 1e-9, 'pas de dégressivité avant le 7e mois');
proche(G.areJourMois(s6, 9, 56), G.areJour(s6), 1e-9, 'pas de dégressivité à 55 ans et plus');
proche(G.areNetMois(1867.02, 1), 30 * (G.areJour(s) - 0.03 * s), 1e-9, 'Smic : ARE nette = brute − 3 % du SJR (pas de CSG sous 61 €)');
ok(G.areNetMois(1867.02, 19) === 0, 'plus d\'ARE après 18 mois (moins de 55 ans)');

// 3. La courbe
[-5, 0, 3].forEach(function (l) {
  proche(G.forme(0, l), 1, 1e-12, 'g(0) = 1 (λ = ' + l + ')'); proche(G.forme(1, l), 0, 1e-12, 'g(1) = 0 (λ = ' + l + ')');
  var num = 0, N = 20000; for (var i = 0; i < N; i++) num += G.forme((i + 0.5) / N * 0.3 + 0.2, l) * 0.3 / N;
  proche(G.integraleForme(0.2, 0.5, l), num, 1e-7, 'intégrale fermée = intégrale numérique (λ = ' + l + ')');
  var dec = true; for (var x = 0; x < 1; x += 0.01) if (G.forme(x + 0.01, l) > G.forme(x, l) + 1e-12) dec = false; ok(dec, 'g décroissante (λ = ' + l + ')');
});
proche(G.integraleForme(0, 1, 0), 0.5, 1e-12, 'droite : intégrale 1/2');
var v = { p0: 1, T: 24, lam: -1 }, ref = 2400;
ok(G.garantieMois(ref, 1, v) < ref && G.garantieMois(ref, 1, v) > 0.98 * ref, 'premier mois : un peu moins que le revenu (baisse journalière dès l\'arrêt)');
proche(G.garantieInstant(ref, 0, v), ref, 1e-9, 'au jour de l\'arrêt : 100 % du revenu de référence');
var croiss = true; for (var m = 1; m < 30; m++) if (G.garantieMois(ref, m + 1, v) > G.garantieMois(ref, m, v) + 1e-9) croiss = false; ok(croiss, 'montant mensuel décroissant');
proche(G.garantieMois(ref, 25, v), 877, 1e-9, 'plancher atteint après T mois');
proche(G.garantieMois(800, 1, v), 877, 1e-9, 'référence sous le plancher : plancher');
proche(G.garantieInstant(ref, 0, { p0: 0.9, T: 24, lam: 0 }), 0.9 * ref, 1e-9, 'variante 90 % : départ à 90 % du revenu');

// 4. Moyenne glissante et parcours
var h = []; for (var i = 0; i < 30; i++) h.push({ y: 2000, transition: false });
proche(G.referenceGlissante(h), 2000, 1e-9, 'revenu constant : référence = revenu');
proche(G.referenceGlissante(h.concat([{ y: 0, transition: true }, { y: 0, transition: true }])), 2000, 1e-9, 'mois en garantie neutralisés');
ok(G.referenceGlissante(h.concat([{ y: 0, transition: false }])) < 2000, 'mois sans activité ni garantie : la référence baisse');
ok(G.referenceGlissante(h.slice(0, 2)) < 400, 'deux mois d\'activité seulement : référence faible (pas de droits pleins sur un mois isolé)');
var passe = []; for (i = 0; i < 24; i++) passe.push(3000);
var p0 = G.parcours(passe, [0, 0, 0, 0, 0, 0], v), rN = G.netNouveau(3000);
for (m = 1; m <= 6; m++) proche(p0[m - 1].total, G.garantieMois(rN, m, v), 1e-6, 'parcours sans activité = courbe, mois ' + m);
var ci = G.casInterim(v), sans = ci.sansInterim;
ok(ci.garantie[6].total > sans[6].total && ci.garantie[7].total > sans[7].total, 'intérim : travailler rapporte plus que rester sans activité');
ok(ci.garantie[8].ref >= ci.garantie[0].ref, 'intérim moins payé : la référence ne baisse pas');
ok(ci.garantie[8].horloge < sans[8].horloge, 'intérim : l\'horloge a reculé (droits remontés)');
ok(ci.garantie[12].total > sans[12].total, 'après l\'intérim : montant supérieur à celui du parcours sans intérim');
var p2 = G.parcours(passe, [0, 0, 3000, 3000, 3000, 3000, 0], v); ok(p2[5].horloge === 0 && p2[5].ref === null && p2[6].total > p0[1].total - 1e-6, 'épisode refermé après une reprise suffisante : nouveau départ en haut de courbe');

// 5. Calibration et coûts
var cal = G.calibration();
proche(cal.coutARE, 37.1, 1e-3, 'calibration : ARE simulée = 37,1 Md€');
proche(cal.dureeMoyenne / cal.dureePotentielle, 0.64, 1e-4, 'calibration : 64 % des droits consommés');
proche(cal.E * cal.dureeMoyenne, 2.62e6, 1, 'calibration : stock de 2,62 M');
ok(cal.mediane > 1500 && cal.mediane < 2300, 'brut de référence médian plausible (1 500-2 300 €) : ' + cal.mediane.toFixed(0));
proche(G.coutComplementModele(), 12.56, 2.5, 'complément du modèle recalculé proche de la ligne D02 (12,56 ± 2,5)');
var c1 = G.cout({ p0: 1, T: 24, lam: 3 }), c2 = G.cout({ p0: 1, T: 24, lam: 0 }), c3 = G.cout({ p0: 1, T: 24, lam: -3 });
ok(c1.supplement < c2.supplement && c2.supplement < c3.supplement, 'le coût baisse quand λ monte (baisse plus rapide)');
ok(G.cout({ p0: 1, T: 18, lam: 0 }).supplement < c2.supplement, '18 mois coûtent moins que 24');
ok(G.cout({ p0: 0.8, T: 24, lam: 0 }).supplement < G.cout({ p0: 0.9, T: 24, lam: 0 }).supplement && G.cout({ p0: 0.9, T: 24, lam: 0 }).supplement < c2.supplement, 'départ 80 % < 90 % < 100 %');
var o = G.cout({ p0: 1, T: 24, lam: 0 }, { dem: true, ind: true });
ok(o.supplement > c2.supplement && o.groupes.dem.supplement > 0 && o.groupes.ind.supplement > 0, 'l\'ouverture aux démissionnaires et aux indépendants coûte');
var sc = ['bas', 'central', 'haut'].map(function (k) { return G.cout({ p0: 1, T: 24, lam: 0 }, { dem: true, ind: true, sc: k }); });
ok(sc[0].supplement <= sc[1].supplement && sc[1].supplement <= sc[2].supplement, 'supplément : bas ≤ central ≤ haut');
ok(sc[0].recettes >= sc[1].recettes && sc[1].recettes >= sc[2].recettes, 'recettes : bas ≥ central ≥ haut');
var k1 = G.calibrer(1, 24, 37.1, { dem: true, ind: true }); proche(k1.cout.supplement, 37.1, 1e-4, 'calibrage : supplément = budget de l\'AC (37,1)');
var k2 = G.calibrer(1, 18, 12.5605, { dem: true, ind: true }); proche(k2.cout.supplement, 12.5605, 1e-4, 'calibrage : supplément = budget du modèle (12,56)');
ok(k2.lam > 0 && k1.lam < 0, 'coût du modèle : baisse rapide au début ; coût de l\'AC : baisse lente au début');
ok(G.calibrer(0.8, 24, 37.1, { dem: true, ind: true }).lam === null, 'départ à 80 % : le budget de l\'AC est hors de portée (même la courbe la plus lente coûte moins)');
var r0 = G.reaction({ p0: 1, T: 24, lam: k1.lam }, cal, 'central'); ok(r0.q <= 1 / 0.7 + 1e-12 && r0.q >= 0.7 - 1e-12, 'réaction bornée à ±30 %');

// 6. Arrêts maladie
var am = ['bas', 'central', 'haut'].map(function (k) { return G.arretsMaladie(k); });
ok(am[0].net <= am[1].net && am[1].net <= am[2].net && am[0].net > 0, 'arrêts maladie : coût net bas ≤ central ≤ haut, positif');
ok(G.arretsMaladie('central', { reprise: false }).net < am[1].net, 'sans reprise des compléments, le coût public est plus faible');
proche(G.AM.ijMaladieBase + G.AM.ijAtmp + G.AM.ijMaternite, 21.3, 1e-9, 'IJ des régimes de base 2024 : 21,3 Md€ (Drees)');

// 7. Pont vers la retraite (modulation par l'âge)
var vA = { p0: 1, T: 24, lam: -1.12 }, refM = G.refDeBrut(2900);
proche(G.poidsAge(50, { kappa: 1.5 }), 0, 1e-12, 'à 50 ans, poids nul : le pont est la garantie standard');
for (m = 1; m <= 30; m++) proche(G.pontMois(refM, 50, m, vA, { kappa: 1.5 }), G.garantieMois(refM, m, vA), 1e-9, 'pont à 50 ans = garantie standard, mois ' + m);
ok(G.poidsAge(55, { kappa: 1.5 }) < G.poidsAge(58, { kappa: 1.5 }) && G.poidsAge(58, { kappa: 1.5 }) < G.poidsAge(61, { kappa: 1.5 }), 'le poids croît avec l\'âge (formule continue)');
ok(G.niveauPont(refM, 61.99, { kappa: 1.5 }) <= 0.75 * refM + 1e-9 && G.niveauPont(refM, 61.99, { kappa: 1.5 }) > 0.95 * 0.75 * refM, 'juste avant le taux plein, le niveau tenu approche la pension estimée');
ok(G.pontMois(refM, 55, 85, vA, { kappa: 1.5 }) === 0, 'le pont s\'arrête au taux plein (62 ans) : la pension prend le relais');
var cp1 = G.coutPont(vA, { kappa: 1 }), cp4 = G.coutPont(vA, { kappa: 4 });
ok(cp1.surcout > cp4.surcout && cp4.surcout > 0, 'le surcoût du pont baisse quand κ monte');
var kp = G.calibrerPont(vA, 1, { Atp: 62 }); proche(kp.cout.surcout, 1, 1e-4, 'κ calibré : surcoût du pont = 1 Md€ par an');
ok(kp.cout.entrantsAn > 3e5 && kp.cout.entrantsAn < 7e5, 'entrants de 50 ans et plus : entre 300 000 et 700 000 par an');
var c55 = G.casPont(2900, 55, vA, { kappa: kp.kappa }); ok(c55.cumul.pont > c55.cumul.standard && c55.mois.length === 84, 'cas 55 ans : 84 mois jusqu\'à 62 ans, pont plus généreux que la garantie standard');

// 8. Variante « coût constant » (07/11/2026, soir)
var mix12 = G.mixProportionnel(12);
proche(mix12.reduce(function (a, d) { return a + d[1]; }, 0), 1, 1e-9, 'droits proportionnels : poids = 1');
ok(mix12.every(function (d) { return d[0] <= 12; }) && mix12[mix12.length - 1][0] === 12, 'droits proportionnels : 12 mois au plus (24 mois travaillés)');
var cu = G.cout({ p0: 1, T: 12, lam: 0, mix: mix12 }, { dem: true, ind: true }), c12 = G.cout({ p0: 1, T: 12, lam: 0 }, { dem: true, ind: true });
ok(cu.supplement < c12.supplement, 'droits proportionnels : moins cher que 12 mois pour tous');
ok(G.tauxArret(1, 'pierre') === 0 && Math.abs(G.tauxArret(2, 'pierre') - 0.1) < 1e-12 && Math.abs(G.tauxArret(3, 'pierre') - 0.2) < 1e-12 && Math.abs(G.tauxArret(4, 'pierre') - 0.6) < 1e-12 && Math.abs(G.tauxArret(8, 'pierre') - 0.64) < 1e-12, 'règle de l\'auteur : 0 / 10 / 20 %, 60 % au 4e jour, 64 % au 8e');
proche(G.arretsMaladie2({ schema: 'sansPaie', tp: 0.64 }).cout + 0, G.arretsMaladie2({ schema: 'sansPaie', tp: 0.64 }).cout, 0, 'cohérence');
var amP = G.arretsMaladie2({ schema: 'pierre' }); ok(Math.abs(amP.ecart) < 0.5, 'règle de l\'auteur : coût à ±0,5 Md€ des IJ actuelles (' + amP.ecart.toFixed(2) + ')');
ok(G.arretsMaladie2({ schema: 'sansPaie' }).cout < amP.cout && G.arretsMaladie2({ schema: 'pierre', tp: 0.8 }).cout > amP.cout + 2, 'jours 1-3 non payés moins chers ; taux plein de 80 % : +2 Md€ au moins');
ok(amP.consultationsEvitees > 1e6 && amP.economieAssuranceMaladie < amP.joursCourtsPayes, 'consultations évitées : économie inférieure au coût des jours 2-3');
[3, 5, 10, 30].forEach(function (n) { [1867.02, 2900].forEach(function (b) { var r = G.arretType(b, n, 'pierre', 0.64, 'aucun'); ok(r.nouveau >= r.aujourdhui - 1e-9, 'arrêt de ' + n + ' jours, brut ' + b + ', sans maintien : la règle de l\'auteur paie au moins autant qu\'aujourd\'hui'); }); });
var t0 = G.coutTotal({ p0: 1, T: 12, lam: 0, mix: mix12 }, { schema: 'pierre' });
ok(t0.garantie.supplement + t0.pont.surcout + t0.maladie.net < 49.2, 'coût constant : total versé sous les 49,2 Md€ d\'aujourd\'hui');
proche(t0.pont.surcout, 1, 1e-3, 'coût constant : pont recalibré à 1 Md€');
var tl = G.coutTotal({ p0: 1, T: 12, lam: -40, mix: mix12 }, { schema: 'pierre' }); ok(tl.garantie.supplement + tl.pont.surcout + tl.maladie.net < 49.2, 'même la courbe la plus lente reste sous 49,2 Md€');
var jn = G.casJeune(1867.02, 12, { p0: 1, T: 12, lam: 0 }); ok(jn.droits === 6 && jn.lignes[0].garantie > jn.lignes[0].are && jn.lignes[6].garantie === 877, 'jeune : 6 mois de droits, mieux indemnisé au début, plancher au 7e mois');

log('Tests : ' + n + ' passés.');
