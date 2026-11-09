// Test de cohérence et calculs de resultats.md. Lancer depuis modeles/industrie-complexite/ :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc modele.js test_modele.js
// (ou avec node, en adaptant : global.IndustrieComplexite = require('./modele.js')).
var M = this.IndustrieComplexite || (typeof require !== 'undefined' ? require('./modele.js') : null);
var lire = (typeof read === 'function') ? read : function (p) { return require('fs').readFileSync(p, 'utf8'); };
var log = (typeof print === 'function') ? print : console.log;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); log('ok  ' + m); }
function r1(x) { return Math.round(x * 10) / 10; }
function k(x) { return Math.round(x / 1000) + ' k'; }
function proche(a, b, tol) { return Math.abs(a - b) <= tol; }

// 1. Tests unitaires
var seg = { id: 't', bloc: 'x', montant: 100, emplois: 1000, partComplexite: 0.5, partDisparait: 0.6, partTransforme: 0.3 };
var e = M.evaluerSegment(seg, 'central');
ok(proche(e.montantDisparait + e.montantTransforme + e.montantReste, e.montantComplexite, 1e-9), 'segment : disparaît + transforme + reste = complexité');
ok(proche(e.emploisDisparait, 300, 1e-9), 'segment : 1000 × 0,5 × 0,6 = 300 emplois');
var erreur = false; try { M.evaluerSegment({ id: 'z', montant: 1, emplois: 1, partComplexite: 0.5, partDisparait: 0.8, partTransforme: 0.5 }, 'bas'); } catch (x) { erreur = true; }
ok(erreur, 'parts incohérentes rejetées');
var f = M.fluxAnnuel(100, 10, 200, 0.02);
ok(proche(f.aReconvertirParAn, 6, 1e-9) && proche(f.aReconvertirTotal, 60, 1e-9), 'flux : 10/an dont 4 absorbés par la retraite');
var rec = M.reconversion(1000, [{ metier: 'a', part: 1 }, { metier: 'b', part: 3 }]);
ok(proche(rec[1].personnes, 750, 1e-9), 'reconversion : parts normalisées');

// 2. Cohérence des constantes avec les CSV
var C = M.parseCSV(lire('donnees/comptabilite_audit_droit.csv'));
function valeur(liste, debut) { var l = liste.filter(function (x) { return x.indicateur.indexOf(debut) === 0; })[0]; return l ? +l.valeur : NaN; }
ok(proche(valeur(C, 'Activités comptables 69.20 – chiffre d\'affaires') / 1000, M.D.ca6920, 0.001), 'CA 69.20 = CSV (28,04 Md€)');
ok(valeur(C, 'Activités comptables 69.20 – personnes occupées') === M.D.personnes6920, 'personnes occupées 69.20 = CSV');
ok(proche(valeur(C, 'Activités juridiques 69.10 – chiffre d\'affaires') / 1000, M.D.ca6910, 0.001), 'CA 69.10 = CSV');
ok(proche(valeur(C, 'Honoraires totaux de certification') / 1000, M.D.honorairesAuditLegal, 0.001), 'honoraires audit légal = CSV');
var P = M.parseCSV(lire('donnees/paie_editeurs_prestataires.csv'));
ok(P.length > 30 && M.parseCSV(lire('donnees/cir_cabinets_conseil.csv')).length > 15, 'CSV paie et CIR lus');
log('Constantes dérivées : coût/ETP ' + Math.round(M.D.coutParEmploi) + ' € ; VA/personne ' + Math.round(M.D.vaParEmploi) +
    ' € ; personnes/Md€ ' + Math.round(M.D.emploisParMdEur6920) + ' ; départs/an ' + r1(M.D.tauxDepartAnnuel * 100) + ' % ; CA éditeurs paie observés ' +
    r1(M.D.caEditeursPaie * 100) / 100 + ' Md€ ; CA cabinets CIR observés ' + r1(M.D.caCabinetsCIRObserves * 100) / 100 + ' Md€');

// 3. Résultats par scénario
var resultats = {};
M.SCENARIOS.forEach(function (sc) {
  var r = M.evaluer(M.SEGMENTS, sc), t = r.total, p = M.PARAMS_GAIN[sc];
  var g = M.gainEconomie(r, p);
  var flux = M.fluxAnnuel(t.emploisDisparait, p.dureeTransition, t.emploisComplexite, M.D.tauxDepartAnnuel);
  resultats[sc] = { r: r, g: g, flux: flux };
  log('\n=== Scénario ' + sc + ' ===');
  r.detail.forEach(function (d) {
    log('  ' + d.nom + ' : base ' + r1(d.montant) + ' Md€ / ' + k(d.emplois) + ' ; complexité ' + r1(d.montantComplexite) + ' Md€ / ' + k(d.emploisComplexite) +
        ' ; disparaît ' + r1(d.montantDisparait) + ' Md€ / ' + k(d.emploisDisparait) + ' ; se transforme ' + r1(d.montantTransforme) + ' Md€ / ' + k(d.emploisTransforme));
  });
  Object.keys(r.parBloc).forEach(function (b) {
    var x = r.parBloc[b];
    log('  [' + b + '] complexité ' + r1(x.montantComplexite) + ' Md€ / ' + k(x.emploisComplexite) + ' ; disparaît ' + r1(x.montantDisparait) + ' Md€ / ' + k(x.emploisDisparait));
  });
  log('  TOTAL complexité ' + r1(t.montantComplexite) + ' Md€ (' + r1(t.montantComplexite / M.D.pib * 100) + ' % du PIB) / ' + k(t.emploisComplexite) + ' emplois');
  log('  disparaît ' + r1(t.montantDisparait) + ' Md€ (' + Math.round(t.montantDisparait / t.montantComplexite * 100) + ' %) / ' + k(t.emploisDisparait) +
      ' ; se transforme ' + r1(t.montantTransforme) + ' Md€ / ' + k(t.emploisTransforme) + ' ; reste ' + r1(t.montantReste) + ' Md€ / ' + k(t.emploisReste));
  log('  gain : coût évité ' + r1(g.coutEvite) + ' Md€/an ; gain réel (réemploi ' + p.tauxReemploi + ') ' + r1(g.gainReel) + ' Md€/an ; net du système public ' +
      r1(g.gainReelNet) + ' Md€/an (' + Math.round(g.pctPIB * 100) / 100 + ' % du PIB) ; coût de reconversion ponctuel ' + r1(g.coutTransitionPonctuel) + ' Md€ (amorti en ' + r1(g.anneesPourAmortir) + ' an)');
  log('  transition sur ' + p.dureeTransition + ' ans : ' + k(flux.brutParAn) + '/an supprimés, ' + k(flux.departsRetraiteParAn) + '/an départs en retraite, ' +
      k(flux.aReconvertirParAn) + '/an à reconvertir, soit ' + k(flux.aReconvertirTotal) + ' personnes au total');
  M.reconversion(flux.aReconvertirTotal, M.DESTINATIONS).forEach(function (d) { log('    -> ' + d.metier + ' : ' + k(d.personnes)); });
});

// 4. Contrôles d'ordre de grandeur
var b = resultats.bas.r.total, c = resultats.central.r.total, h = resultats.haut.r.total;
ok(b.montantComplexite < c.montantComplexite && c.montantComplexite < h.montantComplexite, 'taille croissante bas < central < haut');
ok(b.emploisDisparait < c.emploisDisparait && c.emploisDisparait < h.emploisDisparait, 'emplois disparus croissants');
var marchandEtInterne = resultats.haut.r.parBloc['A. Marché externe'].montantComplexite + resultats.haut.r.parBloc['B. Travail interne des employeurs'].montantComplexite;
ok(marchandEtInterne < 70, 'scénario haut (marché + interne) sous la charge administrative totale de 70 Md€ (toutes normes)');
// Recoupement Doing Business (SOURCE ARRÊTÉE en 2021, conservée pour comparaison) : 139 h/an × 1,57 M d'employeurs / 1 607 h
var etpDB = M.etpConformite(139, 1566209, 1607);
ok(proche(etpDB, 135000, 1000), 'fonction etpConformite : ≈ 135 000 ETP');
log('Recoupement Doing Business (source arrêtée) : ' + k(etpDB) + ' ETP (139 h × 1,57 M employeurs) contre ' + k(resultats.bas.r.parBloc['B. Travail interne des employeurs'].emploisComplexite) +
    ' (bas) à ' + k(resultats.haut.r.parBloc['B. Travail interne des employeurs'].emploisComplexite) + ' (haut) dans le bloc B');
ok(etpDB < resultats.haut.r.parBloc['B. Travail interne des employeurs'].emploisComplexite, 'bloc B (haut) au-dessus du plancher Doing Business');
// V6652 : contrôle VVA/KPMG 2022 (1,3 % du PIB UE-28 ; PME) appliqué à la France (PIB 2024), brut et ajusté 139/170
var vvaBrut = M.coutConformiteVVA(M.D.pib, 0.013), vvaAjuste = M.coutConformiteVVA(M.D.pib, 0.013, 139 / 170);
ok(proche(vvaBrut, 38.2, 0.1) && proche(vvaAjuste, 31.2, 0.1), 'VVA : 38,2 Md€ brut, 31,2 Md€ ajusté sur les heures');
log('Contrôle VVA/KPMG (PME, impôts et cotisations) : ' + r1(vvaAjuste) + ' à ' + r1(vvaBrut) + ' Md€ ; T6 central (A + B hors CIR, patrimoine, ménages) : ' +
    r1(c.montantComplexite - resultats.central.r.detail.filter(function (d) { return ['cir', 'patrimoine', 'menages'].indexOf(d.id) > -1; }).reduce(function (a, d) { return a + d.montantComplexite; }, 0)) + ' Md€');
// V6653 : part de temps supprimable observée (Estonie 50 h contre France 139 h, DB 2020, source arrêtée)
var supObs = M.partSupprimableObservee(139, 50);
ok(proche(supObs, 0.64, 0.005), 'part supprimable observée Estonie/France ≈ 64 %');
log('Part de temps de conformité supprimable observée (Estonie/France, DB 2020) : ' + Math.round(supObs * 100) + ' % ; disparition haut retenue 80 %');
// V6655 : le CA des éditeurs de paie vendu aux cabinets est retiré (pas de double compte avec le CA des cabinets)
var paieC = resultats.central.r.detail.filter(function (d) { return d.id === 'paie'; })[0];
ok(proche(paieC.montant, M.D.caEditeursPaie * 0.6, 1e-9), 'éditeurs de paie : 60 % du CA retenu au central');
// Contrôle de remplacement : OCDE PMR (France et six comparateurs européens + États-Unis)
var PMR = M.parseCSV(lire('donnees/pmr_ocde.csv'));
var PAYS = ['FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'GBR', 'SWE', 'USA'];
var pu = M.positionPMR(PMR, 'PMR', 2023, 'FRA', PAYS);
var pa = M.positionPMR(PMR, 'ADREG_BURDEN', 2023, 'FRA', PAYS);
var pc = M.positionPMR(PMR, 'ACCOUNTANTS', 2023, 'FRA', PAYS);
var pl = M.positionPMR(PMR, 'LAWYERS', 2023, 'FRA', PAYS);
log('OCDE PMR 2023, France (moyenne des 7 comparateurs, rang sur 8, 1 = moins restrictif) : global ' + r1(pu.valeur * 100) / 100 + ' (' + r1(pu.moyenneComparateurs * 100) / 100 + ', ' + pu.rang + '/8) ; charge administrative ' + pa.valeur.toFixed(2) + ' (' + pa.moyenneComparateurs.toFixed(2) + ', ' + pa.rang + '/8) ; comptables ' + pc.valeur.toFixed(2) + ' (' + pc.moyenneComparateurs.toFixed(2) + ', ' + pc.rang + '/8) ; avocats ' + pl.valeur.toFixed(2) + ' (' + pl.moyenneComparateurs.toFixed(2) + ', ' + pl.rang + '/8)');
ok(pa.rang >= 2 && pa.rang <= 7, 'PMR : la charge administrative française n\'est pas un extrême du groupe (cohérent avec Doing Business : 139 h contre 159 h)');
ok(pc.ecart > 0 && pl.ecart > 0, 'PMR : professions comptable et d\'avocat plus réglementées en France que la moyenne des comparateurs');
var erreurPMR = false; try { M.positionPMR(PMR, 'PMR', 2023, 'JPN', PAYS); } catch (x) { erreurPMR = true; }
ok(erreurPMR, 'PMR : pays absent rejeté');
// Sensibilité : part « complexité » de l'expertise comptable à ±0,1
var sens = M.SEGMENTS.map(function (s) { if (s.id !== 'expertise') return s; var o = {}; for (var x in s) o[x] = s[x]; o.partComplexite = 0.6; return o; });
var rs = M.evaluer(sens, 'central').total;
log('Sensibilité : part complexité de l\'expertise comptable 0,5 -> 0,6 : emplois disparus ' + k(c.emploisDisparait) + ' -> ' + k(rs.emploisDisparait));
var sens2 = M.SEGMENTS.map(function (s) { if (s.id !== 'interne') return s; var o = {}; for (var x in s) o[x] = s[x]; o.partComplexite = 0.35; return o; });
log('Sensibilité : part complexité du travail interne 0,25 -> 0,35 : emplois disparus ' + k(c.emploisDisparait) + ' -> ' + k(M.evaluer(sens2, 'central').total.emploisDisparait));

// 4. v2 : optimisation patrimoniale et successorale (T6 v2, 02/11/2026)
log('--- v2 : optimisation patrimoniale ---');
var OP = M.parseCSV(lire('donnees/optimisation_patrimoniale.csv'));
function lig(debut) { return OP.filter(function (l) { return l.indicateur.indexOf(debut) === 0; })[0]; }
ok(+lig('Pacte Dutreil – dépense fiscale').valeur === 5000, 'v2 : Dutreil 5 000 M€ (V&M t.2 2026, réalisation 2024) dans le CSV');
ok(proche(+lig('Autres exonérations').valeur, 100 + 50 + 12 + 120, 1e-9), 'v2 : autres exonérations classées = 100 + 50 + 12 + 120 = 282 M€');
ok(proche(+lig('VA par personne').valeur, 22107 / 190026 * 1000, 0.5), 'v2 : VA par personne 69.10 = 116 k€');
ok(proche(+lig('Ratio VA').valeur, 22107 / 31892 * 100, 0.5), 'v2 : ratio VA/CA 69.10 = 69 %');
ok(proche(+lig('Notariat – chiffre d\'affaires (calcul)').valeur, 10000 * 0.89 * 0.96, 100), 'v2 : CA du notariat 2024 ≈ 10 000 × 0,89 × 0,96');
ok(proche(+lig('Juristes hors notariat').valeur, 31892 - 8500, 10), 'v2 : juristes hors notariat = 69.10 − notariat');
var rb = M.recettesEnJeu(M.POSTES_RECETTES, 'central');
ok(proche(rb.total, 5.0 + 4.5 + 2.5 + 0.3, 1e-9), 'v2 : recettes en jeu central = 12,3 Md€');
ok(M.recettesEnJeu(M.POSTES_RECETTES, 'bas').total < rb.total && rb.total < M.recettesEnJeu(M.POSTES_RECETTES, 'haut').total, 'v2 : bas < central < haut');
ok(proche(M.rendementReforme(10, 0.5, 0.2), 4, 1e-9), 'v2 : rendement = brut × part récupérée × (1 − fuite)');
var e2 = false; try { M.rendementReforme(10, 1.5, 0); } catch (x) { e2 = true; }
ok(e2, 'v2 : part hors de [0,1] rejetée');
var BP = {}; M.SCENARIOS.forEach(function (sc) { BP[sc] = M.bilanPatrimoine(sc); });
ok(BP.bas.recettesNettes < BP.central.recettesNettes && BP.central.recettesNettes < BP.haut.recettesNettes, 'v2 : recettes nettes croissantes bas < central < haut');
ok(BP.central.recettesNettes < 0.6 * M.val(20.9), 'v2 : le rendement net reste inférieur à 60 % des 20,9 Md€ de DMTG perçus (plausibilité)');
ok(BP.bas.recettesNettes > 2 && BP.haut.recettesNettes < 19, 'v2 : fourchette compatible avec le CAE (+9 Md€ réforme d\'assiette, +19 Md€ maximum)');
M.SCENARIOS.forEach(function (sc) {
  var t = BP[sc].patrimoine.total;
  ok(proche(t.emploisDisparait + t.emploisTransforme + t.emploisReste, t.emploisComplexite, 1e-6), 'v2 : ' + sc + ' : disparaît + transforme + reste = complexité (emplois)');
});
var oc = M.coutOpportunite(1000, 100000, 0, 1, 0.5, 10000);
ok(proche(oc.gainAnnuel, 0.05, 1e-12) && proche(oc.coutPonctuel, 0.01, 1e-12) && proche(oc.anneesPourAmortir, 0.2, 1e-9), 'v2 : coût d\'opportunité : 1000 × 0,5 × 100 k€ = 50 M€/an, coût 10 M€');
ok(M.coutOpportunite(1000, 100000, 0.9, 0.5, 1, 0).gainAnnuel < 0, 'v2 : gain négatif si le produit social ailleurs est inférieur');
ok(BP.haut.opportunite.gainAnnuel < BP.haut.recettesNettes, 'v2 : le gain de la matière grise est inférieur aux recettes (ordre de grandeur)');
M.SCENARIOS.forEach(function (sc) {
  var b = BP[sc];
  log('v2 ' + sc + ' : recettes brutes ' + r1(b.recettesBrutes.total) + ' Md€ ; nettes ' + r1(b.recettesNettes) + ' Md€ ; emplois liés à la complexité patrimoniale ' + k(b.patrimoine.total.emploisComplexite) + ', qui disparaissent ' + k(b.patrimoine.total.emploisDisparait) + ' ; CA ' + b.patrimoine.total.montantComplexite.toFixed(2) + ' Md€ ; VA ' + b.patrimoine.vaComplexite.toFixed(2) + ' Md€ ; gain annuel de réallocation ' + b.opportunite.gainAnnuel.toFixed(2) + ' Md€ ; coût ponctuel ' + b.opportunite.coutPonctuel.toFixed(2) + ' Md€');
});
// Sensibilités
var pr = M.POSTES_RECETTES.filter(function (p) { return p.id !== 'dutreil'; });
log('Sensibilité : sans le Dutreil, recettes brutes centrales ' + r1(M.recettesEnJeu(pr, 'central').total) + ' Md€');
log('Sensibilité : fuite 30 % au lieu de 10 % (central) : ' + r1(M.rendementReforme(rb.total, 0.6, 0.3)) + ' Md€ contre ' + r1(BP.central.recettesNettes));
log('fini');
