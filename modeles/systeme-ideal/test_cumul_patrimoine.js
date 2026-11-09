// Tests de cumul_patrimoine.js. Depuis ce dossier :
//   jsc ../capital-de-depart/modele.js ../capital-de-depart/continu.js cumul_patrimoine.js test_cumul_patrimoine.js
// (les deux premiers fichiers sont facultatifs : ils servent au recoupement de E' et du capital de départ avec continu.js.)
// Les valeurs de référence des plus-values immobilières actuelles viennent de outils/droit/loi_executable/plus_values.py (calculer, lu et lancé le 04/11/2026).
var C = this.CumulPatrimoine, CDC = this.CDC || null, PI = this.PatrimoineImmobilier || null;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var K = C.CONST, SC = C.SC;
function cp(o) { var r = {}, k; for (k in o) r[k] = o[k]; return r; }
function avec(c, ch) { var r = cp(c), k; for (k in ch) r[k] = ch[k]; return r; }

// Constantes
proche(K.taxe, 0.01, 0, 'taxe de 1 % (mesure 6)');
proche(K.plafondRevenu, 0.05, 0, 'plafond de 5 % du revenu (mesure 6)');
proche(K.tPrelevement, 0.414, 0, 'prélèvement unique 41,4 % (mesure 5 ; 40,7 % avant V12400-V12420)'); // 04/11/2026 : ancienne valeur 0.407, recalée après les corrections de données V12400-V12404
proche(K.tEMax, 0.5, 0, 'taux marginal maximal de E\' : 50 % (mesure 7)');
proche(K.K, 94000, 0, 'K de E\' : 94 000 € (H614)');
proche(K.capG, 40000, 0, 'capital de départ : 40 000 € au premier euro (mesure 10)');
proche(K.capK, 80000, 0, 'capital de départ : K = 80 000 € (mesure 10)');
ok(C.CAS.length === 8, 'huit cas types (six demandés, une variante aisée de la résidence principale, un cas extrême)');
ok(C.BAREME_SUCCESSION.length === 7 && C.BAREME_SUCCESSION[3][0] === 552324, 'barème de succession en ligne directe : 7 tranches, 20 % jusqu\'à 552 324 € (V11300)');

// E' : fonction continue, taux marginal ≤ 50 %, impôt = intégrale du taux marginal
var xs = [1000, 20000, 94000, 100000, 300000, 1e6, 5e6, 5e7], i;
xs.forEach(function (x) { ok(C.margE(x) <= 0.5 && C.margE(x) >= 0, 'taux marginal de E\' dans [0, 50 %] à x = ' + x); ok(C.impotE(x) / x < 0.5, 'taux moyen de E\' strictement sous 50 % à x = ' + x); });
function simpson(f, a, b, m) { var h = (b - a) / m, s = f(a) + f(b), j; for (j = 1; j < m; j++) s += f(a + j * h) * (j % 2 ? 4 : 2); return s * h / 3; }
[50000, 94000, 250000, 2e6].forEach(function (x) { proche(simpson(function (u) { return C.margE(u); }, 0, x, 20000), C.impotE(x), 1, 'E\'(' + x + ') = intégrale numérique du taux marginal'); });
proche(C.impotE(0), 0, 0, 'E\'(0) = 0');
for (i = 1; i < xs.length; i++) ok(C.impotE(xs[i]) > C.impotE(xs[i - 1]), 'E\' croissante');
proche(C.margE(94000), 0.25, 1e-12, 'taux marginal de E\' à x = K : 25 %');
proche(C.impotE(100000), 9295, 1, 'héritier de 100 k€ : droits E\' ≈ 9 295 € (9,3 %)');
proche(C.capitalDepart(100000), 40000 * Math.exp(-1.25), 1e-9, 'capital de départ de l\'héritier de 100 k€ : 40 000 × e^(−1,25) ≈ 11 460 €');
proche(C.capitalDepart(0), 40000, 1e-9, 'capital de départ : 40 000 € sans héritage');
if (CDC) {
  [1000, 94000, 100000, 1e6, 5e7].forEach(function (x) { proche(C.impotE(x), CDC.impot('marg3', 94000, x), 1e-6, 'recoupement avec continu.js : E\'(' + x + ')'); proche(C.margE(x), CDC.marginal('marg3', 94000, x), 1e-12, 'recoupement avec continu.js : marginal de E\' à ' + x); });
  proche(C.capitalDepart(100000), CDC.TRANSFERTS.exp.g(100000, 80000), 1e-9, 'recoupement avec continu.js : capital de départ exp, K = 80 000');
} else log('(continu.js non chargé : recoupements ignorés)');

// Droit actuel : successions (calcul à la main) et plus-values immobilières (plus_values.py)
proche(C.droitsActuel(100000), 0, 0, 'droit actuel : 100 000 € reçus, abattement de 100 000 €, aucun droit');
proche(C.droitsActuel(200000), 8072 * 0.05 + (12109 - 8072) * 0.10 + (15932 - 12109) * 0.15 + (100000 - 15932) * 0.20, 1e-6, 'droit actuel : 200 000 € reçus = 18 194 € (barème CGI 777)');
proche(C.droitsActuel(2000000), 0.20 * (552324 - 15932) + 0.30 * (902838 - 552324) + 0.40 * (1805677 - 902838) + 0.45 * (1900000 - 1805677) + 8072 * 0.05 + (12109 - 8072) * 0.10 + (15932 - 12109) * 0.15, 1e-6, 'droit actuel : 2 M€ reçus');
[[3, 700000, 65325], [10, 800000, 58465], [20, 1200000, 88316], [25, 1500000, 68693], [31, 2000000, 0], [20, 2400000, 272469]].forEach(function (v) {
  proche(C.pvImmoActuel(500000, v[1], v[0]).total, v[2], 1.5, 'plus-value immobilière actuelle : ' + v[0] + ' ans, vente à ' + v[1] + ' = ' + v[2] + ' € (plus_values.py)');
});
proche(C.pvImmoActuel(500000, 700000, 3).pv, 162500, 1e-6, 'plus-value brute : forfait de 7,5 % seul avant 5 ans');
proche(C.pvImmoActuel(500000, 800000, 10).pv, 187500, 1e-6, 'plus-value brute : forfaits de 7,5 % et 15 % au-delà de 5 ans');
proche(C.abIR(22), 1, 1e-12, 'abattement IR : exonération dès 22 ans'); proche(C.abPS(30), 1, 1e-12, 'abattement PS : exonération à 30 ans');
proche(C.ifiActuel(1000000), 0, 0, 'IFI : rien sous 1,3 M€'); proche(C.ifiActuel(2000000), 0.005 * 500000 + 0.007 * 700000, 1e-6, 'IFI : 2 M€ de patrimoine immobilier net');

// Identités comptables du système
var c, s, r;
SC.forEach(function (sc) {
  C.CAS.forEach(function (cs) {
    s = C.simuler(cs, sc);
    var re = C.rendement(cs, sc);
    proche(s.VN, cs.V0 * Math.pow(1 + re.g, cs.N), 1e-4, cs.id + ' ' + sc + ' : valeur finale = V0 (1 + g)^N');
    var cumulY = 0, a; for (a = 0; a < cs.N; a++) cumulY += re.y * cs.V0 * Math.pow(1 + re.g, a);
    proche(s.rendementCumule, cumulY + (s.VN - cs.V0), 1e-3 * Math.max(1, cumulY), cs.id + ' ' + sc + ' : rendement cumulé = revenus courants + plus-value réelle');
    ok(s.cumulDetention >= 0 && s.cumulTout >= s.cumulDetention - 1e-9 - (cs.recu ? 1 : 0), cs.id + ' ' + sc + ' : cumul tout compris ≥ cumul de détention (hors capital de départ)');
  });
});
// Sans plafond, sans plus-value, sans intérêt : la taxe payée + créance = taxe due ; taxe due = 1 % × Σ V
c = avec(C.cas('locatif'), { fin: 'vente' });
s = C.simuler(c, 'central', { sansPlafond5: true, interet: 0, t: 0 });
(function () { var re = C.rendement(c, 'central'), sum = 0, a; for (a = 0; a < c.N; a++) sum += 0.01 * c.V0 * Math.pow(1 + re.g, a); proche(s.taxeDue, sum, 1e-6, 'taxe due = 1 % de la somme des valeurs annuelles'); })();
proche(s.taxePayee + s.creance, s.taxeDue, 1e-6, 'taxe payée + créance = taxe due (intérêt nul, recouvrement total)');
proche(s.impotRevenus, 0, 0, 'prélèvement de 0 % : aucun impôt sur les revenus');
proche(s.impotGain, 0, 0, 'prélèvement de 0 % : aucun impôt sur le gain');
// Prélèvement sur le gain réel
s = C.simuler(C.cas('locatif'), 'central');
proche(s.impotGain, 0.414 * (s.VN - 500000), 1e-6, 'locatif : 41,4 % de la plus-value RÉELLE à la vente');
proche(s.impotRevenus, 0.414 * (s.rendementCumule - (s.VN - 500000)), 1e-3, 'locatif : 40,7 % des revenus courants');
proche(C.simuler(C.cas('rp'), 'central').impotGain, 0, 0, 'résidence principale : plus-value exonérée');
proche(C.simuler(C.cas('rp'), 'central').impotRevenus, 0, 0, 'résidence principale : loyer imputé non imposé');
ok(C.simuler(C.cas('locatif'), 'central', { t: 0.5 }).impotGain > s.impotGain, 'un prélèvement de 50 % rapporte plus qu\'un prélèvement de 40,7 %');
ok(C.simuler(C.cas('locatif'), 'central', { t: 0.5 }).cumulDetention > s.cumulDetention, 'le cumul croît avec le taux du prélèvement');
// Plafond de 5 % du revenu sous la médiane
s = C.simuler(C.cas('rp'), 'central');
(function () {
  var cs = C.cas('rp'), re = C.rendement(cs, 'central'), a, tot = 0, due = 0, bornes = true, cr = 0, plaf = 0;
  for (a = 0; a < cs.N; a++) { var V = cs.V0 * Math.pow(1 + re.g, a), rev = cs.revenuAutre * Math.pow(1.01, a), d = 0.01 * V, elig = rev / cs.uc < 24000, p = elig ? Math.min(d, 0.05 * rev) : d; tot += p; due += d; if (d > p) plaf++; if (elig && p > 0.05 * rev + 1e-9) bornes = false; }
  proche(s.taxePayee, tot, 1e-6, 'résidence principale : taxe payée = min(1 % de la valeur, 5 % du revenu) tant que le niveau de vie est sous la médiane, 1 % ensuite');
  proche(s.anneesPlafonnees, plaf, 0, 'résidence principale : nombre d\'années plafonnées');
  ok(bornes, 'jamais plus de 5 % du revenu payé tant que le ménage est sous la médiane');
  ok(s.taxePayee < s.taxeDue && s.creance > 0, 'le reste est reporté en créance, payée au décès');
})();
ok(s.creance > s.taxeDue - s.taxePayee - 1e-6, 'la créance dépasse le simple report (elle porte intérêt, H537)');
proche(C.simuler(C.cas('rp'), 'central', { interet: 0 }).creance, s.taxeDue - s.taxePayee, 1e-6, 'sans intérêt, la créance = taxe due moins taxe payée');
proche(C.simuler(C.cas('rpAise'), 'central').anneesPlafonnees, 0, 0, 'ménage au-dessus de la médiane : pas de plafonnement');
proche(C.simuler(C.cas('rpAise'), 'central').creance, 0, 0, 'ménage au-dessus de la médiane : pas de créance');
ok(C.simuler(C.cas('rp'), 'central', { sansPlafond5: true }).creance === 0, 'sans plafond de 5 %, pas de créance (taxe payée chaque année)');
// Titres non cotés : taxe reportée à la vente ou au décès
s = C.simuler(C.cas('entreprise'), 'central');
proche(s.taxePayee, 0, 0, 'entreprise non cotée : aucune taxe payée pendant la détention (optimum.js nonCotesVente)');
ok(s.creance > s.taxeDue, 'entreprise non cotée : la créance reportée (avec intérêts) dépasse la taxe due');
// Décès : modes d'imputation
SC.forEach(function (sc) { ['entreprise', 'grand', 'rp'].forEach(function (id) {
  var a = C.simuler(C.cas(id), sc), b = C.simuler(C.cas(id), sc, { mode: 'cumul' });
  ok(b.totalDeces >= a.totalDeces - 1e-6, id + ' ' + sc + ' : le cumul gain + droits prélève au moins autant que l\'imputation');
}); });
s = C.simuler(C.cas('entreprise'), 'central');
proche(s.totalDeces, Math.max(s.droits, s.impotGain) + s.creance, 1e-6, 'imputation : max(droits, gain) + créance');
ok(s.impotGain < s.droits, 'entreprise : l\'impôt sur le gain est absorbé par les droits (imputation)');
proche(s.droits, 2 * (C.impotE((s.VN - s.creance) / 2)), 1e-3, 'entreprise : droits par héritier sur la base nette de créance, 2 héritiers');
// Plafond de 50 % « tous impôts confondus »
s = C.simuler(C.cas('entreprise'), 'central');
ok(s.partTransmise > 0.5 && s.depasse50Transmission, 'ENTREPRISE (central) : le plafond de 50 % tous impôts confondus est dépassé (créance de taxe non comptée)');
ok(s.partDroits < 0.5, 'entreprise : les droits E\' seuls restent sous 50 % (la construction de E\' tient)');
ok(C.simuler(C.cas('grand'), 'central').depasse50Transmission, 'patrimoine de 50 M€ (central) : plafond de 50 % dépassé');
ok(!C.simuler(C.cas('rp'), 'central').depasse50Transmission, 'résidence principale (central) : plafond respecté');
ok(!C.simuler(C.cas('heritier'), 'central').depasse50Transmission, 'héritier modeste : plafond respecté');
SC.forEach(function (sc) { C.CAS.forEach(function (cs) { var a = C.simuler(cs, sc, { sansPlafond5: false }); ok(a.partDroits === undefined || a.partDroits <= 0.5 + 1e-9, cs.id + ' ' + sc + ' : les droits E\' seuls ne dépassent jamais 50 % de la valeur'); }); });
ok(C.simuler(C.cas('entreprise'), 'central', { mode: 'cumul' }).partTransmise > 0.65, 'entreprise, gain et droits cumulés : > 65 % (deces_realisation.js (i) sans imputation)');
// Cumul sur la période
ok(C.simuler(C.cas('actions'), 'central').depasse50, 'actions (central) : plus de 50 % du rendement réel prélevé sur la période');
ok(C.simuler(C.cas('locatif'), 'central').depasse50, 'locatif (central) : plus de 50 % du rendement réel prélevé sur la période');
ok(!C.simuler(C.cas('rp'), 'central').depasse50, 'résidence principale : moins de 50 % du rendement réel');
ok(SC.every(function (sc) { return C.CAS.every(function (cs) { return !C.simuler(cs, sc).depasse100; }); }), 'aucun cas ne dépasse 100 % du rendement réel sur la période de détention (hors droits)');
ok(C.simuler(C.cas('entreprise'), 'bas').cumulTout > 1 && C.simuler(C.cas('grand'), 'bas').cumulTout > 1, 'tout compris (droits inclus) : plus de 100 % du rendement réel dans le scénario bas');
ok(C.simuler(C.cas('entreprise'), 'central').netTransmisSurV0 < 1, 'entreprise : le capital transmis net est inférieur à la valeur d\'entrée (euros constants)');
// Plus le rendement est faible, plus la part prélevée est grande
['rp', 'locatif', 'actions', 'entreprise', 'grand'].forEach(function (id) { var b = C.simuler(C.cas(id), 'bas').cumulDetention, ce = C.simuler(C.cas(id), 'central').cumulDetention, h = C.simuler(C.cas(id), 'haut').cumulDetention; ok(b > ce && ce > h, id + ' : cumul de détention décroissant du scénario bas au haut'); });
// Cas extrême : revenu de l'année
s = C.simuler(C.cas('fondateur'), 'central');
ok(s.depasse75Revenu && s.ratioRevenuMax > 1, 'FONDATEUR sans dividende : taxe + prélèvement dépassent 100 % du revenu de l\'année (au-dessus de la médiane, pas de plafond de 5 %)');
ok(!C.simuler(C.cas('rp'), 'central').depasse75Revenu && !C.simuler(C.cas('grand'), 'central').depasse75Revenu, 'les autres cas restent sous 75 % du revenu de l\'année (central)');
// Règle proposée
SC.forEach(function (sc) { ['standard', 'cumul'].forEach(function (mode) { C.CAS.forEach(function (cs) {
  var rr = C.avecRegle(cs, sc, mode === 'cumul' ? { mode: 'cumul' } : {});
  ok(rr.ratioRevenuMax <= 0.75 + 1e-9, cs.id + ' ' + sc + ' ' + mode + ' : avec la règle, taxe + prélèvement ≤ 75 % du revenu');
  var part = cs.fin === 'deces' ? rr.partTransmise : rr.partVente; ok(part <= 0.5 + 1e-9, cs.id + ' ' + sc + ' ' + mode + ' : avec la règle, prélevé à la transmission ou à la vente ≤ 50 %');
}); }); });
ok(C.avecRegle(C.cas('rp'), 'central').totalDeces === C.simuler(C.cas('rp'), 'central').totalDeces, 'la règle ne change rien pour la résidence principale (cas ordinaire)');
ok(C.avecRegle(C.cas('heritier'), 'central').totalDeces === C.simuler(C.cas('heritier'), 'central').totalDeces, 'la règle ne change rien pour l\'héritier modeste');
r = C.avecRegle(C.cas('entreprise'), 'central'); s = C.simuler(C.cas('entreprise'), 'central');
proche(r.droits, s.droits, 1e-6, 'la règle ne touche pas aux droits E\' quand la créance suffit à rentrer sous 50 %');
ok(r.creance < s.creance && r.creance > 0, 'entreprise : la règle supprime une partie de la créance, pas toute');
proche(s.totalDeces - r.totalDeces, s.reduction.creance + r.reduction.creance, 1e-6, 'entreprise : la recette perdue = la part de créance supprimée');
r = C.avecRegle(C.cas('fondateur'), 'central'); s = C.simuler(C.cas('fondateur'), 'central');
ok(r.taxePayee < s.taxePayee && r.creance > s.creance, 'fondateur : la règle reporte la taxe au lieu de la prélever (créance plus grande)');
proche(r.taxePayee + r.impotRevenus + r.totalDeces, s.taxePayee + s.impotRevenus + s.totalDeces, 0.01 * (s.taxePayee + s.impotRevenus + s.totalDeces), 'fondateur : la règle déplace la recette dans le temps (écart < 1 %)');
// Droit actuel : ordres de grandeur sur les mêmes cas
SC.forEach(function (sc) { C.CAS.forEach(function (cs) { var a = C.simulerActuel(cs, sc); ok(a.cumulDetention >= 0 && a.rendementCumule > 0, cs.id + ' ' + sc + ' : droit actuel calculé'); }); });
s = C.simulerActuel(C.cas('rp'), 'central'); proche(s.impotGain, 0, 0, 'droit actuel : résidence principale exonérée de plus-value'); proche(s.impotRevenus, 0, 0, 'droit actuel : pas d\'impôt sur le loyer imputé');
ok(s.taxeFonciere > 0, 'droit actuel : taxe foncière positive');
s = C.simulerActuel(C.cas('entreprise'), 'central'); proche(s.impotGain, 0, 0, 'droit actuel : plus-value effacée au décès');
proche(s.droits, 2 * C.droitsActuel(0.25 * s.VN / 2), 1e-3, 'droit actuel : Dutreil (75 % exonérés), 2 enfants, abattement de 100 000 € chacun');
ok(s.partTransmise < 0.1, 'droit actuel : l\'entreprise transmise sous Dutreil paie moins de 10 % de sa valeur');
ok(C.simuler(C.cas('entreprise'), 'central').partTransmise > 5 * s.partTransmise, 'le système prélève plus de cinq fois plus que le droit actuel sur l\'entreprise transmise (sans équivalent de Dutreil)');
SC.forEach(function (sc) { ['rp', 'rpAise', 'locatif', 'actions', 'entreprise', 'fondateur', 'heritier'].forEach(function (id) { ok(C.simuler(C.cas(id), sc).cumulDetention > C.simulerActuel(C.cas(id), sc).cumulDetention, id + ' ' + sc + ' : le cumul de détention du système dépasse celui du droit actuel'); }); });
ok(C.simuler(C.cas('actions'), 'central').fluxAnnuelDu > 2 * C.simulerActuel(C.cas('actions'), 'central').fluxAnnuelDu, 'actions : part du rendement prélevée chaque année plus de deux fois supérieure au droit actuel');
// Héritier modeste
s = C.simuler(C.cas('heritier'), 'central');
proche(s.droitsReception, C.impotE(100000), 1e-9, 'héritier : droits E\' à la réception'); proche(s.capitalDepart, C.capitalDepart(100000), 1e-9, 'héritier : capital de départ crédité');
ok(s.capitalDepart > s.droitsReception, 'héritier de 100 k€ : le capital de départ couvre les droits E\' (mesure 10 contre mesure 7)');
ok(C.simulerActuel(C.cas('heritier'), 'central').droitsReception === 0, 'héritier : droit actuel, abattement de 100 000 €, rien à payer');
// Défauts des autres modules inchangés
if (PI) { proche(PI.CONST.tauxPrelevement, 0.5, 0, 'défaut inchangé : patrimoine_immobilier.js tauxPrelevement = 0,50'); }
ok(this.CumulPatrimoine && typeof C.simuler === 'function', 'module chargé sans effet de bord');
log('\n' + n + ' contrôles au vert');
