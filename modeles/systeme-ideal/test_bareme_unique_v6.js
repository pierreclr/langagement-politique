// Tests de la v6 « une seule fonction » (bareme_unique_v6.js ; PROPOSITION, non adoptée). Depuis ce dossier, avec jsc (en zsh, liste en tableau) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js bareme_unique_v6.js test_bareme_unique_v6.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
var V = this.BaremeUniqueV6, J = this.Decisions0511j;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// ---------- 1. La fonction
var s43 = V.v6(0.43), s42 = V.v6(0.42);
proche(s43.m0, 0.17, 1e-12, 'm0 = t − 26 points = 17 % à 43 %'); proche(s43.mInf, 0.73, 1e-12, 'm∞ = t + 30 points = 73 % (asymptote de la v5.10)'); proche(s42.mInf, 0.72, 1e-12, '72 % à 42 %');
proche(V.B(0, 0.43), 350, 1e-9, 'B(0) = 350 €'); proche(V.B(2000, 0.43), 1470 - 1120 * Math.exp(-1) - 1460, 1e-9, 'forme fermée : B(R) = 1 470 − 1 120 e^(−R/2 000) − 0,73 R');
proche(V.B(1000, 0.43), 60.7, 0.1, 'B(1 000) = +61 €'); proche(V.B(3000, 0.43), -969.9, 0.1, 'B(3 000) = −970 €'); proche(V.pointNeutre(s43), 1150.7, 0.5, 'B s\'annule vers 1 151 €/mois');
var h = 1e-3; proche((s43.T(2500 + h) - s43.T(2500 - h)) / (2 * h), s43.m(2500), 1e-6, 'le taux marginal est la dérivée de T (continue, sans marche)');
var tb = V.table(s43); ok(tb.every(function (x, i) { return i === 0 || x.marginal > tb[i - 1].marginal; }), 'taux marginal croissant sur toute la table');
// ---------- 2. Fermeture de la méthode et effet sur le solde
proche(V.fermeture(0.42, 'central'), -0.321, 0.005, 'fermeture : la méthode retrouve le résidu officiel de la v5.10 à 0,3 Md€ près (corrigé)');
var e42 = V.effet(s42, 0.42, 'central');
proche(e42.effet, 2.30, 0.02, 'v6 − v5.10 à 42 % : +2,3 Md€ (central)'); proche(e42.haut, 9.58, 0.02, 'dont haut +9,6'); proche(e42.bas, 8.01, 0.02, 'dont bas (coût) 8,0'); proche(e42.plancher, -0.41, 0.02, 'plancher −0,4');
proche(V.effetV6(0.42, 'bas'), 10.61, 0.02, 'favorable +10,6'); proche(V.effetV6(0.42, 'haut'), -7.56, 0.02, 'défavorable −7,6'); proche(V.effetV6(0.43, 'central'), 1.65, 0.02, 'à 43 % : +1,6');
proche(V.solde('central', 2060), J.solde('central', 2060) + V.effetV6(0.42, 'central'), 1e-9, 'solde v6 = solde v5.10 + effet'); proche(V.solde('central', 2060), 14.80, 0.02, 'croisière 2060 : +14,8 (v5.10 : +12,5)');
// ---------- 3. Plan de taux et dette
var P = V.planTransition();
ok(P.b === 2040 && P.parcours.picAn === null, '43 % de 2029 à 2040 suffit (v5.10 : 2044), aucune dette supplémentaire hors intérêts');
proche(P.dette.central.r10, 1.013, 0.0005, 'dette / PIB à 10 ans : 101,3 % (v5.10 : 101,9)'); proche(P.dette.central.r20, 0.755, 0.0005, 'à 20 ans : 75,5 %'); proche(P.dette.central.r30, 0.437, 0.0005, 'à 30 ans : 43,7 % (v5.10 : 44,4)');
ok(P.dette.haut.r10 > 1.70, 'défavorable : 171 % à 10 ans (risque inchangé en nature)');
// ---------- 4. Cas types (écart au droit actuel et à la v5.10, €/mois, 43 %)
var c = V.casTypesObjet(s43, 0.43);
['couple_2smic_2enf', 'couple_2smic_0enf', 'parent_isole_smic', 'smic_seul', 'net_1500', 'net_1750', 'net_2000'].forEach(function (k) { ok(c[k].versV510 >= 0, 'cas modeste non perdant par rapport à la v5.10 : ' + k + ' (' + c[k].versV510.toFixed(1) + ')'); });
proche(c.smic_seul.versV510, 6.8, 0.2, 'célibataire au Smic : +6,8 € par rapport à la v5.10 (+102 € par rapport à aujourd\'hui)'); proche(c.couple_2smic_2enf.versV510, 18.2, 0.2, 'couple à deux Smic, 2 enfants : +18,2');
ok(c.sans_emploi.ecart === 0 && c.aah.ecart === 0, 'sans emploi (877 €) et AAH à taux plein inchangés');
proche(c.cadre_10000.versV510, -307.0, 0.5, 'cadre à 10 000 € brut : −307 € par rapport à la v5.10'); proche(c.cadre_20000.versV510, -721.9, 0.5, 'cadre à 20 000 € : −722'); ok(c.cadre_5000.versV510 < 0, 'cadre à 5 000 € : contribue plus');
proche(c.net_3000.versV510, -99.4, 0.5, 'salarié à 3 000 € net : −99 € par rapport à la v5.10 (mais +2 € par rapport à aujourd\'hui)');
// ---------- 5. Taux marginaux
var t = V.tme(s43);
ok(t.max.taux <= 0.75, 'taux marginal effectif maximal ≤ 75 % (' + t.max.taux.toFixed(3) + ' à ' + t.max.R + ' €, ' + t.max.cas + ')'); proche(t.smic, 0.652, 0.002, 'TME de 1 à 1,1 Smic : 65,2 % (v5.10 : 69,3 %)');
ok(t.participation.every(function (p) { return p.gainSeul > 0; }), 'personne seule : le travail paie dès 0,25 Smic');
ok(t.trappes.length === 1 && t.trappes[0].x === 0.25, 'seule « trappe » : le second adulte d\'un couple de 0 à 0,25 Smic (falaise du plancher, convention héritée de la v5.10)');
// ---------- 6. Dixièmes et bandes
var d = V.deciles(s42, 0.42);
ok(d[0].ecartMoisUC > 0 && d[1].ecartMoisUC > 0 && d[2].ecartMoisUC > 0, 'trois premiers dixièmes gagnants par rapport à la v5.10'); ok(d[9].ecartMoisUC < -100, 'dernier dixième contributeur (' + d[9].ecartMoisUC.toFixed(0) + ' €/UC)');
var b = V.bandes(s42, 0.42); ok(b[13].ecart < b[12].ecart && b[12].ecart < b[11].ecart, 'la contribution croît dans le haut (1 %, 0,1 %)');
// ---------- 7. Pensions
var p1 = V.pensions(s42, 2500, 1), p0 = V.pensions(s42, 2500, 0);
proche(p1.rendementMd, 0, 1e-6, 'regroupement à net constant : aucune pension ne change'); proche(p0.rendementMd, 12.38, 0.02, 'au-delà de 2 500 € brut sans regroupement : 12,4 Md€');
ok(p0.parDecile.slice(0, 8).every(function (x) { return Math.abs(x.ecart) < 1e-6; }), 'huit premiers dixièmes de pension protégés'); proche(p0.parDecile[9].ecartPct, -0.146, 0.002, 'dixième supérieur : −14,6 %');
log('\n' + n + ' vérifications passées (bareme_unique_v6.js)');
