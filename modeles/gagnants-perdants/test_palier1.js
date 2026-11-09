// Tests du recalage du 03/11/2026 (palier1.js). Depuis modeles/gagnants-perdants/ :
//   jsc ../systeme-ideal/modele.js ../systeme-ideal/fiscalite_actuelle.js ../systeme-ideal/voies.js ../systeme-ideal/sante.js ../systeme-ideal/optimisation.js ../systeme-ideal/retraites2.js \
//       ../systeme-ideal/palier1.js ../systeme-ideal/patrimoine_financier.js ../systeme-ideal/deces_realisation.js ../systeme-ideal/options_financement.js \
//       cas_types_donnees.js droit_actuel.js modele.js palier1.js test_palier1.js
var P = this.GagnantsPerdantsPalier1 || require('./palier1.js');
var M = this.SystemeIdeal || require('../systeme-ideal/modele.js');
var P1 = this.Palier1 || require('../systeme-ideal/palier1.js');
var G = this.GagnantsPerdants || require('./modele.js');
var log = (typeof print === 'function') ? print : console.log;
var nbOk = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); nbOk++; log('ok  ' + m); }
function proche(a, b, tol) { return Math.abs(a - b) <= tol; }
var D = M.DONNEES;

// ---------- 1. Paramètres repris de systeme-ideal (aucun défaut modifié)
var c0 = P.config('palier1'), c4 = P.config('c4'), c2 = P.config('c2'), c1a = P.config('c1', 1), c1z = P.config('c1', 10), c1m = P.config('c1', 5);
ok(c0.st.socle === 500 && proche(c0.st.tPlat, 0.35, 1e-12) && c0.st.tMax === 0.30 && c0.st.R0 === 24000, 'palier 1 : socle 500 €, taux plat 35 %, impôt continu 30 % dès 24 000 € (systeme-ideal)');
ok(c0.p.complRsa === true && c0.p.retraitesSanctuarises === true, 'palier 1 : plancher RSA actif et retraités sanctuarisés');
ok(c4.st.socle === 400 && proche(c4.st.tPlat, 0.45, 1e-12), 'chemin 4 : 45 %, socle 400 €');
ok(c2.st.socle === 400 && proche(c2.st.tPlat, 0.415, 1e-12), 'chemins 2 et 3 : 41,5 %, socle 400 €');
ok(c1a.st.socle === 250 && c1z.st.socle === 500 && proche(c1m.st.socle, 250 + 250 * 4 / 9, 1e-9) && proche(c1a.st.tPlat, 0.38, 1e-12), 'chemin 1 : 38 %, socle de 250 € (année 1) à 500 € (année 10)');
ok(M.DEFAUT.socle === 1000 && M.DEFAUT.tPlat === 0.5, 'défauts de systeme-ideal/modele.js inchangés (1 000 €, 50 %)');
ok(G.DEFAUT.socle === 1000 && G.DEFAUT.taux === 0.5, 'ancien modele.js de gagnants-perdants conservé pour l\'historique (1 000 €, 50 %)');

// ---------- 2. Dixièmes : cohérences de population et de coût
var d0 = P.deciles('palier1'), d4 = P.deciles('c4'), d2 = P.deciles('c2');
var nonRet = d0.deciles.reduce(function (s, x) { return s + x.nonRetraitesM; }, 0);
ok(proche(nonRet, (D.adultes - D.retraites) / 1e6, 0.5), 'adultes non retraités : somme des dixièmes = 38,7 M (' + nonRet.toFixed(1) + ')');
ok(proche(d0.plancherCoutMd, D.rsa.n * (D.rsa.niveau - 500) * 12 / 1e9, 1e-6), 'coût du plancher RSA à 500 € = celui de systeme-ideal (' + d0.plancherCoutMd.toFixed(2) + ' Md€)');
ok(proche(d4.plancherCoutMd, D.rsa.n * (D.rsa.niveau - 400) * 12 / 1e9, 1e-6), 'coût du plancher RSA à 400 € = celui de systeme-ideal (' + d4.plancherCoutMd.toFixed(2) + ' Md€)');
ok(proche(P.deciles('c1', 1).plancherCoutMd, D.rsa.n * (D.rsa.niveau - 250) * 12 / 1e9, 1e-6), 'coût du plancher RSA à 250 € (année 1 du chemin 1)');
ok(proche(P.deciles('palier1', undefined, { rsaN: 0 }).plancherCoutMd, 0, 1e-9), 'sans bénéficiaires du plancher, aucun coût de plancher');
ok(d0.kChom > 0.2 && d0.kChom < 0.5, 'part de l\'assurance chômage conservée (dégressif) : ' + d0.kChom.toFixed(2));
d0.deciles.forEach(function (x, i) { ok(isFinite(x.ecartMoisUC) && x.uc > 0 && x.rdbMois > 0, x.decile + ' : valeurs définies (' + Math.round(x.ecartMoisUC) + ' €/mois par UC)'); });
ok(d0.deciles.slice(0, 9).every(function (x) { return x.ecartMoisUC > 0; }), 'palier 1 : D1 à D9 gagnent, en moyenne');
ok(d0.deciles[9].ecartMoisUC < 0, 'palier 1 : le dernier dixième perd en moyenne');
ok(d0.deciles[0].ecartMoisUC < 0.2 * d0.deciles[2].ecartMoisUC, 'palier 1 : D1 gagne beaucoup moins que D3 une fois le RSA et la prime d\'activité dans la référence');
// monotonie : plus de taux, moins de socle, moins de gain, à chaque dixième
var okMono = true;
d0.deciles.forEach(function (x, i) { if (!(d2.deciles[i].ecartMoisUC < x.ecartMoisUC && d4.deciles[i].ecartMoisUC < d2.deciles[i].ecartMoisUC)) okMono = false; });
ok(okMono, 'à chaque dixième : palier 1 > chemins 2-3 > chemin 4');
// une baisse de socle de 100 € retire moins de 100 € par UC aux plus pauvres (le plancher RSA protège les bénéficiaires) puis ~100 € × adultes non retraités par UC
var dS = P.deciles({ tPlat: 0.35, socleFacteur: 0.8 });
ok(d0.deciles.every(function (x, i) { var e = x.ecartMoisUC - dS.deciles[i].ecartMoisUC; return e > 0 && e <= 100 * x.nonRetraitesM / x.uc + 1e-6; }), 'socle −100 € : retire au plus 100 € × adultes non retraités par UC à chaque dixième');
// sensibilité : D1 reste le plus exposé au chemin 4
ok(P.deciles('c4', undefined, { dispersion: 0.3 }).deciles[0].ecartMoisUC < 0 && P.deciles('c4', undefined, { dispersion: 0.9 }).deciles[0].ecartMoisUC < 0, 'chemin 4 : D1 perd pour une dispersion de 0,3 comme de 0,9');
ok(P.deciles('c4', undefined, { rsaN: 2.85e6 }).deciles[0].ecartMoisUC < 0 && P.deciles('c4', undefined, { rsaN: 1e6 }).deciles[0].ecartMoisUC < P.deciles('c4').deciles[0].ecartMoisUC, 'chemin 4 : D1 perd même avec 2,85 M de bénéficiaires du plancher ; moins de bénéficiaires, plus de perte');
// verdict du constat « D1 à D3 perdent à 45 % et 400 € »
ok(d4.deciles[0].ecartMoisUC < 0 && d4.deciles[2].ecartMoisUC > 0, 'chemin 4 avec plancher RSA : D1 perd, D3 gagne (le constat « D1 à D3 perdent » ne tient que pour D1 et en partie D2)');
ok(d4.deciles[1].ecartMoisUC > -40 && d4.deciles[1].ecartMoisUC < 5, 'chemin 4 : D2 proche de zéro (' + Math.round(d4.deciles[1].ecartMoisUC) + ' €/mois par UC)');

// ---------- 3. Ancienne lecture reproductible (options-financement-palier1.md § 6) et hauts revenus
var s4 = P.decilesSalaries('c4'), s0 = P.decilesSalaries('palier1');
ok(proche(s0[0].ecartMois, 178, 1) && proche(s0[2].ecartMois, 381, 1), 'ancienne lecture, palier 1 : D1 = +178, D3 = +381 (§ 6 du document)');
ok(proche(s4[0].ecartMois, -118, 1) && proche(s4[1].ecartMois, -59, 1) && proche(s4[2].ecartMois, -6, 1), 'ancienne lecture, chemin 4 : D1 −118, D2 −59, D3 −6 (§ 6 du document)');
var h4 = P.hauts('c4');
ok(proche(h4.top1.ecartMois, -9571, 1) && proche(h4.top01.ecartMois, -66899, 1), 'chemin 4 : top 1 % −9 571 €/mois, top 0,1 % −66 899 € (§ 6 du document)');

// ---------- 4. Droit actuel (OpenFisca 2026) dans la situation de référence
var DA = this.DROIT_ACTUEL || require('./droit_actuel.js');
ok(proche(P.atlas('celib_locataire_z2', 0, 1), 651.69 - 79.34, 0.01), 'OpenFisca 2026 : RSA de base 651,69 € moins le forfait logement (572,35 € versés)');
ok(proche(P.atlas('celib_locataire_z2', 0), 890, 1) && P.atlas('celib_locataire_z2', 0, 3) > 300, 'OpenFisca 2026 : personne seule locataire sans revenu : 890 €, dont aide au logement ' + Math.round(P.atlas('celib_locataire_z2', 0, 3)) + ' €');
// prime d'activité : revenus garantis = forfait 638,28 € + 61 % des revenus d'activité (+ bonification ≤ 184 €) − forfait logement ; contrôle de l'atlas à 300 et 600 € bruts
[300, 600].forEach(function (b) {
  var net = P.atlas('celib_locataire_z2', b, 5), rsa = P.atlas('celib_locataire_z2', b, 1), ppa = P.atlas('celib_locataire_z2', b, 2);
  var garanti = 638.28 + 0.61 * net - 79.34, ecart = net + rsa + ppa - garanti;
  ok(ecart > -5 && ecart < 20, 'prime d\'activité (forfait 638,28 €, 61 %) : à ' + b + ' € bruts, net + RSA + prime = garanti à ' + Math.round(ecart) + ' € près (bonification)');
});
ok(proche(P.atlas('celib_locataire_z2', 0, 2), 0, 1e-9) && P.atlas('celib_locataire_z2', 1800, 1) === 0, 'RSA et prime d\'activité ne se cumulent pas à zéro revenu ; plus de RSA à 1 800 € bruts');

// ---------- 5. Cas types
var ct = {}; P.casTypes('palier1').forEach(function (c) { ct[c.id] = c; });
var ct4 = {}; P.casTypes('c4').forEach(function (c) { ct4[c.id] = c; });
var casAct = {}; P1.casActifs(c0.st).forEach(function (c) { casAct[c.id] = c; });
ok(P.CAS_TYPES.length === 10 && Object.keys(ct).length === 10, '10 cas types');
ok(proche(ct.rsa_seul.apresMois, 877, 1e-9) && ct.rsa_seul.ecartMois > -20 && ct.rsa_seul.ecartMois < 0, 'personne seule au RSA : plancher de 877 €, −13 € par rapport à OpenFisca (890 €, prime de Noël et autres)');
ok(proche(ct4.rsa_seul.apresMois, 877, 1e-9), 'personne seule au RSA : le plancher tient aux quatre chemins (877 €)');
ok(proche(ct.smic_seul.ecartMois, casAct.smic35.ecartMois, 1e-6), 'smicard à 35 h : même résultat que palier1.casActifs (+85 €), même « avant » (T14)');
ok(proche(ct.retraite_aspa.ecartMois, 0, 1e-9) && proche(ct4.retraite_aspa.ecartMois, 0, 1e-9), 'retraité au minimum vieillesse : sanctuarisé, aucun écart, quel que soit le chemin');
ok(ct.retraite_aspa_loc.ecartMois < -150 && ct.retraite_aspa_loc.ecartMois > -250, 'retraité locataire au minimum vieillesse : perd son aide au logement (⚠️ H448, ' + Math.round(ct.retraite_aspa_loc.ecartMois) + ' €)');
ok(ct.parent_isole_sans_emploi.apresMois === 1300 && ct.parent_isole_sans_emploi.ecartMois < -400, 'parent isolé sans emploi : plancher ciblé de 1 300 €, perte de ' + Math.round(-ct.parent_isole_sans_emploi.ecartMois) + ' € par rapport à OpenFisca (1 796 €)');
ok(ct.parent_isole_smic.ecartMois < 0 && ct.couple_2smic_2enf.ecartMois > 0, 'palier 1 : le parent isolé au Smic perd, le couple à deux Smic avec 2 enfants gagne');
ok(ct.cadre_2x.ecartMois > 0 && ct.cadre_4x.ecartMois > 0 && ct.cadre_4x.ecartMois > ct.cadre_2x.ecartMois * 0.9, 'palier 1 : les cadres gagnent (contradiction avec l\'intention, systeme-ideal-v2.md § 4)');
ok(ct4.cadre_4x.ecartMois < 0 && ct4.cadre_2x.ecartMois > 0, 'chemin 4 : le cadre à 6 Smic perd, le cadre à 3 Smic gagne peu');
var chain = ['palier1', 'c2', 'c4'].map(function (k) { return P.casTypes(k).filter(function (c) { return c.id === 'smic_seul'; })[0].ecartMois; });
ok(chain[0] > chain[1] && chain[1] > chain[2], 'smicard : plus le taux plat est haut, moins il gagne (' + chain.map(Math.round).join(' > ') + ')');
var a1 = P.casTypes('c1', 1).filter(function (c) { return c.id === 'smic_seul'; })[0].ecartMois, a10 = P.casTypes('c1', 10).filter(function (c) { return c.id === 'smic_seul'; })[0].ecartMois;
ok(a1 < a10 && a1 < 0, 'montée du socle : le smicard perd en année 1 (socle 250 €) et récupère en année 10');
var pm = P.tauxPointMort('smic_seul', 1);
ok(pm > 0.37 && pm < 0.42, 'point mort du smicard à socle 500 € : ' + (100 * pm).toFixed(1) + ' %');
ok(P.tauxPointMort('smic_seul', 0.8) < pm, 'socle 400 € : le point mort du smicard baisse');
log('\n' + nbOk + ' contrôles au vert.');
