// Tests des correctifs « ne perdre personne » (correctifs.js, 03/11/2026). Depuis modeles/gagnants-perdants/ :
//   jsc ../systeme-ideal/modele.js ../systeme-ideal/fiscalite_actuelle.js ../systeme-ideal/voies.js ../systeme-ideal/sante.js ../systeme-ideal/optimisation.js ../systeme-ideal/retraites2.js \
//       ../systeme-ideal/palier1.js ../systeme-ideal/patrimoine_financier.js ../systeme-ideal/deces_realisation.js ../systeme-ideal/options_financement.js \
//       cas_types_donnees.js droit_actuel.js modele.js palier1.js correctifs.js test_correctifs.js
var C = this.Correctifs || require('./correctifs.js');
var P = this.GagnantsPerdantsPalier1 || require('./palier1.js');
var M = this.SystemeIdeal || require('../systeme-ideal/modele.js');
var log = (typeof print === 'function') ? print : console.log;
var nbOk = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); nbOk++; log('ok  ' + m); }
function proche(a, b, tol) { return Math.abs(a - b) <= tol; }
function cas(ch, corr) { var o = {}; C.casTypes(ch, undefined, corr).forEach(function (c) { o[c.id] = c; }); return o; }

// ---------- 1. Rien d'autre ne bouge
ok(M.DEFAUT.socle === 1000 && M.DEFAUT.tPlat === 0.5, 'défauts de systeme-ideal inchangés');
var s0 = cas('palier1', {}), p0 = {}; P.casTypes('palier1').forEach(function (c) { p0[c.id] = c; });
ok(Object.keys(s0).every(function (k) { return proche(s0[k].ecartMois, p0[k].ecartMois, 1e-9); }), 'sans correctif, les cas types sont ceux de palier1.js');
ok(proche(C.soldeChemin('palier1').central, -163.05, 0.1) && proche(C.soldeChemin('c4').central, 11.6, 0.1) && proche(C.soldeChemin('c2').central, -18.3, 0.1) && proche(C.soldeChemin('c1').central, -122.3, 0.1) && proche(C.soldeChemin('c3').central, -24.3, 0.1), 'soldes des chemins : −163,05 ; −122,3 ; −18,3 ; −24,3 ; +11,6 (options-financement-palier1.md § 7 : −163,3 ; −122,5 ; −15,6 ; −21,6 ; +14,1 avant les corrections V11770 et V11772 du 04/11/2026)');

// ---------- 2. (a) aides au logement des retraités
var a = ['bas', 'central', 'haut'].map(C.coutA);
ok(a[0].md < a[1].md && a[1].md < a[2].md && proche(a[1].md, 0.12 * 16, 1e-9), '(a) : 1,3 / 1,9 / 2,6 Md€ (8, 12, 16 % des 16 Md€ d\'aides au logement)');
ok(proche(a[1].parMenageMois, 16e9 / 5.9e6 / 12, 1e-6), '(a) : aide moyenne par ménage = 16 Md€ / 5,9 M de foyers / 12 (226 €/mois)');
ok(proche(cas('palier1', { a: 1 }).retraite_aspa_loc.ecartMois, 0, 1e-6) && proche(cas('c4', { a: 1 }).retraite_aspa_loc.ecartMois, 0, 1e-6), '(a) : le retraité locataire est remis à zéro au palier 1 et au chemin 4');
ok(proche(cas('palier1', { a: 1 }).smic_seul.ecartMois, s0.smic_seul.ecartMois, 1e-9), '(a) : ne change aucun autre cas type');

// ---------- 3. (b) parent isolé
var b = ['bas', 'central', 'haut'].map(C.coutB);
ok(proche(b[1].md, 200.78 * 3.166e6 * 12 / 1e9, 1e-6) && proche(b[1].md, 7.63, 0.01), '(b) central : 200,78 € × 3,166 M d\'enfants × 12 = 7,63 Md€ (synthese/fiabilite.md : 7,6)');
ok(b[0].md < b[1].md && b[1].md < b[2].md, '(b) : bas < central < haut (50 % ciblé ; 200,78 € ; 300 € par enfant)');
var pb = cas('palier1', { b: 1 }).parent_isole_smic;
ok(proche(pb.ajoutMois, 2 * 200.78, 1e-6) && Math.abs(pb.ecartMois) < 10, '(b) : 2 enfants = +401,56 €, le parent isolé au Smic revient à ' + Math.round(pb.ecartMois) + ' € au palier 1');
ok(cas('c4', { b: 1 }).parent_isole_smic.ecartMois < -250, '(b) : au chemin 4 le parent isolé au Smic perd encore ' + Math.round(-cas('c4', { b: 1 }).parent_isole_smic.ecartMois) + ' €');
ok(cas('c4', { b: 1 }).parent_isole_sans_emploi.ecartMois < -50 && cas('c4', { b: 1 }).smic_seul.ajoutMois === 0 && cas('c4', { b: 1 }).couple_1smic_2enf.ajoutMois === 0, '(b) : réservée aux familles monoparentales (aucun effet sur les couples)');

// ---------- 4. (c) bonus d'activité
ok(C.bonus(0, 200) === 0 && proche(C.bonus(0.25 * P.SMIC_BRUT, 200), 100, 1e-9) && C.bonus(0.75 * P.SMIC_BRUT, 200) === 200 && C.bonus(1.6 * P.SMIC_BRUT, 200) === 0 && proche(C.bonus(1.3 * P.SMIC_BRUT, 200), 100, 1e-9), '(c) : forme du bonus : montée jusqu\'à 0,5 Smic, plateau jusqu\'au Smic, extinction à 1,6 Smic');
ok(proche(C.brutDeCout(C.coutDeBrut(2500)), 2500, 1e-6) && proche(C.coutDeBrut(P.SMIC_BRUT), C.SMIC_COUT, 1e-6), 'conversion brut/coût employeur : bijective, Smic = 1 987,76 €');
var cc = C.coutC('palier1', undefined, 200), c100 = C.coutC('palier1', undefined, 100), cc4 = C.coutC('c4', undefined, 200), cci = C.coutC('palier1', undefined, 200, undefined, 5);
ok(cc.bas <= cc.central && cc.central <= cc.haut && cc.central > 30 && cc.central < 50, '(c) 200 € : ' + cc.bas.toFixed(1) + ' / ' + cc.central.toFixed(1) + ' / ' + cc.haut.toFixed(1) + ' Md€ (bas ≤ central ≤ haut)');
ok(proche(c100.central * 2, cc.central, 0.01), '(c) : le coût est proportionnel au montant (100 € = moitié)');
ok(proche(cc4.central, cc.central, 1e-9), '(c) : le coût du bonus ne dépend pas du chemin (taux et socle ne changent pas qui est dans la plage)');
ok(cci.central < cc.central && cci.central > 0.5 * cc.central, '(c) ciblé D1-D5 : moins cher que le bonus complet (' + cci.central.toFixed(1) + ' Md€)');
ok(C.coutC('palier1', undefined, 200, 1.3).central < cc.central, '(c) éteint à 1,3 Smic : moins cher qu\'à 1,6 Smic');
ok(cc.central > 3 * 10.7, '(c) : un bonus individuel de 200 € coûte plus de trois fois la prime d\'activité actuelle (10,7 Md€) : elle est ciblée sur le foyer');
var bs = C.bonusNeutralisantSmicard('c4');
ok(proche(bs, -P.casTypes('c4').filter(function (x) { return x.id === 'smic_seul'; })[0].ecartMois, 1e-9) && bs > 200 && bs < 230, '(c) : le bonus qui annule la perte du smicard au chemin 4 vaut ' + Math.round(bs) + ' €');
ok(C.bonusNeutralisantSmicard('palier1') === 0, '(c) : au palier 1 le smicard gagne déjà (bonus neutralisant = 0)');
ok(proche(cas('c4', { c: bs }).smic_seul.ecartMois, 0, 1e-6), '(c) : avec ce bonus le smicard seul revient à zéro');
ok(cas('c4', { c: true }).retraite_aspa_loc.ecartMois === s0.retraite_aspa_loc.ecartMois && cas('c4', { c: true }).parent_isole_sans_emploi.ecartMois === P.casTypes('c4')[9].ecartMois, '(c) : ne profite ni aux retraités ni aux personnes sans emploi');
ok(cas('c4', { c: true }).cadre_4x.ecartMois === P.casTypes('c4').filter(function (x) { return x.id === 'cadre_4x'; })[0].ecartMois, '(c) : aucun effet au-delà de 1,6 Smic');

// ---------- 5. Taux marginal effectif : le bonus recrée une zone de taux élevé
var t0 = C.tauxMarginal('c4', undefined, 0, 1), t1 = C.tauxMarginal('c4', undefined, 200, 1), tm = C.tauxMarginal('c4', undefined, 200, 0.25), t13 = C.tauxMarginal('c4', undefined, 200, 1.3), t13r = C.tauxMarginal('c4', undefined, 200, 1.3, 1.3);
ok(proche(t0, 0.45, 0.005), 'chemin 4 sans bonus : taux marginal de 45 % au Smic (taux plat)');
ok(t1 > t0 + 0.08 && t1 < 0.65, 'avec bonus 200 € éteint à 1,6 Smic : le taux marginal passe de ' + Math.round(100 * t0) + ' % à ' + Math.round(100 * t1) + ' % juste au-dessus du Smic');
ok(tm < t0 - 0.15, 'dans la montée (0,25 Smic) le bonus baisse le taux marginal à ' + Math.round(100 * tm) + ' %');
ok(t13 > t0 + 0.15 && C.tauxMarginal('c4', undefined, 200, 1.3, 1.3) > C.tauxMarginal('c4', undefined, 200, 1.02, 1.3) - 1, 'à 1,3 Smic, éteint à 1,6 : ' + Math.round(100 * t13) + ' % (extinction progressive)');
ok(C.tauxMarginal('c4', undefined, 200, 1, 1.3) > t1, 'une extinction plus courte (1,3 Smic) donne un taux plus fort au Smic (' + Math.round(100 * C.tauxMarginal('c4', undefined, 200, 1, 1.3)) + ' %)');
ok(proche(C.tauxMarginal('c4', undefined, 200, 3), C.tauxMarginal('c4', undefined, 0, 3), 1e-9), 'au-delà de 1,6 Smic, aucun effet du bonus sur le taux marginal');
var z4 = C.zonePerte('c4'), z1 = C.zonePerte('palier1');
ok(z4.hi > 2 && z1.hi < 0.6, 'plage de perte d\'un adulte seul : jusqu\'à ' + z4.hi.toFixed(1) + ' Smic au chemin 4, ' + z1.hi.toFixed(2) + ' au palier 1 (un plancher calculé sur le revenu courant y vaut 100 % de taux marginal)');

// ---------- 6. (d) plancher garanti
var d1 = C.coutDlignes('palier1', undefined, 'central'), d4 = C.coutDlignes('c4', undefined, 'central');
ok(proche(d1.total, d1.seuls + d1.parents + d1.couples + d1.retraites, 1e-9), '(d) : total = seuls + parents isolés + couples monoactifs + retraités');
ok(d4.total > 2 * d1.total, '(d) : au chemin 4 (' + d4.total.toFixed(1) + ' Md€) il coûte plus de deux fois le palier 1 (' + d1.total.toFixed(1) + ' Md€)');
var dd = C.coutD('c4');
ok(dd.bas < dd.central && dd.central < dd.haut, '(d) chemin 4 : bas < central < haut (' + dd.bas.toFixed(0) + ' / ' + dd.central.toFixed(0) + ' / ' + dd.haut.toFixed(0) + ')');
ok(proche(C.moyenne10(dd.central, 3), dd.central * 0.3, 1e-9) && proche(C.moyenne10(dd.central, 5), dd.central * 0.5, 1e-9) && proche(C.moyenne10(dd.central, 20), dd.central, 1e-9), '(d) : moyenne sur 10 ans d\'une garantie de 3 ans = 30 %, de 5 ans = 50 %, plafonnée à 100 %'); // 04/11/2026 : égalité exacte remplacée par une tolérance de 1e-9 (arrondi flottant de c × 10 / 10 avec la nouvelle valeur)
var cd = cas('c4', { d: 1 });
ok(Object.keys(cd).every(function (k) { return cd[k].ecartMois >= 0; }), '(d) : aucun cas type ne perd (c\'est la définition)');
ok(proche(cd.cadre_2x.ecartMois, P.casTypes('c4')[6].ecartMois, 1e-9), '(d) : ne retire rien à ceux qui gagnent');
var rc = C.coutDlignes('c4', undefined, 'central', { a: 1, b: 1, c: true, d: 1 });
ok(rc.parents < d4.parents && rc.retraites === 0 && rc.seuls < d4.seuls, '(d) résiduel : moins cher une fois (a), (b) et (c) en place (retraités à 0, parents ' + rc.parents.toFixed(1) + ' contre ' + d4.parents.toFixed(1) + ')');
var plaf = C.coutDlignes('c4', undefined, 'central', { d: 1, dPlafond: 1.6 }).seuls;
ok(plaf <= d4.seuls + 1e-9 && plaf > 0.8 * d4.seuls, '(d) plafonné à 1,6 Smic : presque rien d\'économisé (' + plaf.toFixed(1) + ' contre ' + d4.seuls.toFixed(1) + ' Md€) : la masse des perdants est sous 1,6 Smic');
ok(d4.menages > 5e6 && d1.menages > 1e6 && d1.menages < d4.menages, '(d) : ménages concernés ' + (d1.menages / 1e6).toFixed(1) + ' M au palier 1, ' + (d4.menages / 1e6).toFixed(1) + ' M au chemin 4');

// ---------- 7. Dixièmes
['palier1', 'c4'].forEach(function (ch) {
  var base = P.deciles(ch).deciles, dc = C.decilesCorriges(ch, undefined, {});
  ok(dc.every(function (x, i) { return proche(x.ecart, base[i].ecartMoisUC, 1e-9) && x.ajout === 0; }), ch + ' : sans correctif, dixièmes identiques à palier1.js');
  var all = C.decilesCorriges(ch, undefined, { a: 1, b: 1, c: true });
  ok(all.every(function (x) { return x.ajout >= 0; }), ch + ' : (a) + (b) + (c) ne retirent rien à aucun dixième');
  var tout = C.decilesCorriges(ch, undefined, { a: 1, b: 1, c: true, d: 1 });
  ok(tout.every(function (x, i) { return x.ecart >= all[i].ecart - 1e-9; }), ch + ' : (d) s\'ajoute à (a) + (b) + (c)');
});
var dq = C.decilesCorriges('c4', undefined, { a: 1, b: 1, c: true });
ok(dq[0].ecart > 0 && dq[0].ecartInitial < 0, 'chemin 4 : D1 passe de ' + Math.round(dq[0].ecartInitial) + ' à ' + Math.round(dq[0].ecart) + ' €/mois par UC avec (a) + (b) + (c)');
ok(dq[7].ecart < 0 && dq[8].ecart < 0, 'chemin 4 : D8 et D9 perdent encore avec (a) + (b) + (c) (le financement du chemin les touche) : ' + Math.round(dq[7].ecart) + ' et ' + Math.round(dq[8].ecart));
ok(Math.abs(C.decilesCorriges('c4', undefined, { a: 1 }).reduce(function (s, x, i) { return s + x.ajout * P.deciles('c4').deciles[i].uc * 12; }, 0) - 1.92e3) < 5, '(a) réparti entre dixièmes : le total retrouve 1,92 Md€ (' + 'à 5 M€ près)');

// ---------- 8. Trou de financement
var so = C.soldeChemin('c4');
ok(so.central - C.coutA('central').md - C.coutB('central').md > 0, 'chemin 4 : (a) + (b) seuls laissent le solde central positif (' + (so.central - C.coutA('central').md - C.coutB('central').md).toFixed(1) + ' Md€)');
ok(so.central - cc.central - C.coutA('central').md - C.coutB('central').md < 0, 'chemin 4 : avec le bonus complet, le solde central devient négatif');
log('\n' + nbOk + ' contrôles au vert.');
