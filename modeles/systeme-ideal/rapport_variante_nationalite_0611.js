// Résultats de la variante « nationalité et impôt bien conçu » (variante_nationalite_0611.js ; 06/11/2026, NON ADOPTÉE). Charger comme test_variante_nationalite_0611.js
// en remplaçant le test par ce fichier ; sortie : modeles/systeme-ideal/resultats_variante_nationalite_0611.txt (fait foi pour sources/impot-nationalite-et-erosion.md).
(function () {
  var N = this.VarianteNationalite0611, B = this.BaseTravail0611, log = (typeof print === 'function') ? print : console.log;
  function f1(v) { return v.toFixed(1).replace('.', ','); }
  function f2(v) { return v.toFixed(2).replace('.', ','); }
  function pc(v, d) { return v === null || v === undefined ? 'n.d.' : (100 * v).toFixed(d === undefined ? 0 : d).replace('.', ',') + ' %'; }
  function f0(v) { return Math.round(v).toLocaleString('fr-FR'); }

  log('=== A. ÉROSION PAR CANAUX (1 % le mieux doté, érosion à 1 point ; référence 40 %) ===');
  log('scénario | rDecl | couv | déclaratif | exil | réel | e1 (1 %) | e1 (reste) | part de l\'exil dans l\'érosion restante');
  N.NOMS_SC.forEach(function (s) { var l = N.scenario(s), e = N.erosions(l);
    log(N.LIB_SC[s] + ' | ' + pc(l.rDecl) + ' | ' + pc(l.couv) + ' | ' + pc(e.canaux.declaratif * 0.4, 1) + ' | ' + pc(e.canaux.exil * 0.4, 1) + ' | ' + pc(e.canaux.reel * 0.4, 1) + ' | ' + pc(e.top, 1) + ' | ' + pc(e.reste, 1) + ' | ' + pc(e.partExil, 1)); });

  var c = N.configV75();
  log('\n=== B. FONCTION v7.5 RECOMMANDÉE (RP 0,25 % jusqu\'à 1 M€ ; 3 % × W²/(W + 400 000 €)) SOUS CHAQUE SCÉNARIO ; Md€/an ; manque de la base : ' + f1(N.S.manque) + ' ===');
  log('scénario | recette | Δ v7.5 (62,52) | part du manque | érosion effective du capital mobile du 1 % | autres impôts perdus par l\'exil | différé | encaissé dans l\'année');
  N.NOMS_SC.forEach(function (s) { var r = N.recette(c, N.scenario(s));
    log(N.LIB_SC[s] + ' | ' + f2(r.totale) + ' | ' + (r.deltaV75 >= 0 ? '+' : '') + f2(r.deltaV75) + ' | ' + pc(r.partManque) + ' | ' + pc(r.erosionTop) + ' | ' + f2(r.exil) + ' | ' + f1(r.differe) + ' | ' + f1(r.encaisse)); });

  log('\n=== C. GRILLE t∞ (K minimal sous la contrainte dure de la v7.5, statique) PAR SCÉNARIO ; Md€/an ===');
  N.NOMS_SC.forEach(function (s) {
    log('-- ' + N.LIB_SC[s]);
    log('t∞ | K minimal | recette | Δ v7.5 | part du manque | érosion effective du 1 % | différé');
    N.grille(N.scenario(s)).forEach(function (r) { log(pc(r.config.tInf, 1) + ' | ' + r.K / 1e3 + ' k€ | ' + f2(r.totale) + ' | ' + (r.deltaV75 >= 0 ? '+' : '') + f2(r.deltaV75) + ' | ' + pc(r.partManque) + ' | ' + pc(r.erosionTop) + ' | ' + f1(r.differe)); });
    var b = N.meilleur(N.scenario(s)); log('meilleur : t∞ = ' + pc(b.config.tInf, 1) + ', K = ' + b.K / 1e3 + ' k€ : ' + f2(b.totale) + ' (' + (b.deltaV75 >= 0 ? '+' : '') + f2(b.deltaV75) + ', ' + pc(b.partManque) + ' du manque)');
  });

  log('\n=== D. CAS LIMITES AU-DELÀ DE 100 % DU REVENU (statiques, indépendants de l\'érosion) ===');
  [c, { regime: 'RP', X: 1e6, tInf: 0.045, K: N.kMin(0.045), payeProrata: true, plancherPro: true }, { regime: 'RP', X: 1e6, tInf: 0.05, K: N.kMin(0.05), payeProrata: true, plancherPro: true },
   { regime: 'RP', X: 1e6, tInf: 0.055, K: N.kMin(0.055), payeProrata: true, plancherPro: true }].forEach(function (cc) {
    var L = B.casLimites(cc), au = N.casAuDela(cc);
    log('-- t∞ = ' + pc(cc.tInf, 1) + ', K = ' + cc.K / 1e3 + ' k€ : ' + au.length + ' cas sur ' + L.length + ' au-delà de 100 % (payé ou dû)');
    au.forEach(function (x) { log('   ' + x.lib.slice(0, 110) + ' | payé ' + pc(x.charge) + ' | dû ' + pc(x.chargeDue)); });
  });

  log('\n=== E. IMPÔT DIFFÉRENTIEL SUR LE STOCK DES FRANÇAIS DÉJÀ PARTIS (hors modèle) ; Md€/an ===');
  var sd = N.stockDeparts();
  log('Redevables ISF/IFI partis 2011-2021 : ' + f0(sd.departs) + ' ; retours (moyennes) ≈ ' + f0(sd.retours) + ' ; solde ≈ ' + f0(sd.net) + ' ; actif net imposable moyen des partants ' + f2(sd.actifMoyen / 1e6) + ' M€ (assiette ISF : hors biens professionnels)');
  var d = N.differentiel(c);
  log('scénario | ménages patrimoine | patrimoine moyen (Pareto) | impôt dû moyen | volet patrimoine | volet revenus | taxe de sortie à la renonciation | gestion | net');
  ['bas', 'central', 'haut'].forEach(function (k, i) { var x = d[k];
    log(k + ' | ' + f0(N.HYP.menagesPatrimoine[i]) + ' | ' + f2(x.patrimoineMoyen / 1e6) + ' M€ | ' + f0(x.impotMoyenDu) + ' € | ' + f2(x.patrimoine) + ' | ' + f2(x.revenus) + ' | ' + f2(x.renonciation) + ' | −' + f2(x.gestion) + ' | ' + f2(x.net)); });

  log('\n=== F. SYNTHÈSE ===');
  var r1 = N.recette(c, N.scenario('seulNationalite')), b1 = N.meilleur(N.scenario('AT1')), b0 = N.meilleur(N.scenario('AT0')), b2 = N.meilleur(N.scenario('AT2')), br = N.meilleur(N.scenario('reference'));
  log('Impôt différentiel seul, v7.5 : ' + (r1.deltaV75 >= 0 ? '+' : '') + f2(r1.deltaV75) + ' Md€ (érosion évitée) + ' + f2(d.central.net) + ' (stock déjà parti, central) = ' + f2(r1.deltaV75 + d.central.net));
  log('Meilleur réglage, référence : +' + f2(br.deltaV75) + ' ; bien conçu bas / central / haut : +' + f2(b0.deltaV75) + ' / +' + f2(b1.deltaV75) + ' / +' + f2(b2.deltaV75) + ' Md€ (' + pc(b0.partManque) + ' / ' + pc(b1.partManque) + ' / ' + pc(b2.partManque) + ' du manque)');
  log('Avec le stock déjà parti (central) : bien conçu central ' + f2(b1.deltaV75 + d.central.net) + ' Md€, soit ' + pc((b1.deltaV75 + d.central.net) / N.S.manque) + ' du manque');
})();
