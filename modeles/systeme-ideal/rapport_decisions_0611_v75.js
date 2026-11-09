// Résultats de la v7.5 PROPOSÉE (decisions_0611_v75.js ; 06/11/2026). Charger comme test_decisions_0611_v75.js en remplaçant le test par ce fichier ; sortie :
//   modeles/systeme-ideal/resultats_decisions_0611_v75.txt (fait foi pour sources/fonction-patrimoine-v75.md).
(function () {
  var V = this.Decisions0611V75, A = this.Decisions0611V74, log = (typeof print === 'function') ? print : console.log;
  function f0(v) { return Math.round(v).toLocaleString('fr-FR'); }
  function f1(v) { return v.toFixed(1); }
  function pc(v, d) { return v === null || v === undefined ? 'n.d. (aucun revenu)' : (100 * v).toFixed(d === undefined ? 2 : d) + ' %'; }
  V.init(); var E = V.calages();
  var REC = { regime: 'RP', X: 1e6, tInf: 0.03, K: 4e5, payeProrata: true, plancherPro: true };
  var AB = { regime: 'AB', X: 1e6, tInf: 0.03, K: 4e5, payeProrata: true, plancherPro: true };

  log('=== A. CALAGES ===');
  log('τRP aux sources (taxe foncière des ménages 26,202 Md€ / immobilier des ménages 9 696 Md€, 2024) = ' + pc(V.HYP.tauRPsource, 3));
  log('τRP calé dans la population (reproduit 26,202 Md€ sur l\'immobilier brut reconstitué) = ' + pc(V.HYP.tauRP, 3) + ' ; DMTO annualisés ' + pc(E.dmtoRate, 3) + ' ; TH RS ' + pc(E.thrsRate, 3) + ' de l\'immobilier hors RP');
  log('Bouclier de transition (σ = ' + V.HYP.boucliersigma + ') : part de la charge RP au-dessus de la taxe foncière actuelle = ' + pc(V.partBouclier(V.HYP.boucliersigma), 1) + ' (σ 0,3 : ' + pc(V.partBouclier(0.3), 1) + ' ; σ 0,7 : ' + pc(V.partBouclier(0.7), 1) + ')');
  [0.02, 0.025, 0.03].forEach(function (t) { var c = V.calage(t); log('Calage du comportement (chaîne v7.4, K = 700 k€), t∞ = ' + pc(t, 1) + ' : nette / statique = ' + c.ratio.toFixed(3) + ' ; érosion du capital mobile du 1 % ' + pc(c.erosionTop, 0)); });

  log('\n=== B. GRILLE (K = 700 k€, plancher, sans option) : Md€/an ; Δ = recette − 54,52 (v7.4 B) ; manque 18,7 (référence) et 29,1 (avec décisions en attente) ===');
  log('régime | X | t∞ | part RP nette | fonction nette (statique) | dont différé | total | Δ v7.4 | comble 18,7 | comble 29,1 | contrainte ≤ 1 M€');
  V.grille().forEach(function (g) { var r = g.recette;
    log(g.regime + ' | ' + g.X / 1e3 + ' k€ | ' + pc(g.tInf, 1) + ' | ' + f1(r.rpNette) + ' | ' + f1(r.fonctionNette) + ' (' + f1(r.fonctionStatique) + ') | ' + f1(r.differe) + ' | ' + f1(r.totale) + ' | ' + f1(r.deltaV74) + ' | ' + pc(Math.max(0, r.combleRef), 0) + ' | ' + pc(Math.max(0, r.combleTout), 0) + ' | ' + (g.contrainteOk ? 'oui' : 'NON')); });

  log('\n=== C. K le plus bas qui respecte la contrainte dure (tranches ≤ 1 M€), par variante ===');
  log('régime | X | t∞ | K minimal | total | Δ v7.4 | différé | encaissé dans l\'année');
  ['RP', 'AB'].forEach(function (rg) { [5e5, 7.5e5, 1e6].forEach(function (X) { [0.02, 0.025, 0.03].forEach(function (t) {
    var best = null; [7e5, 6e5, 5e5, 4.5e5, 4e5, 3.5e5, 3e5, 2.5e5, 2e5, 1.5e5, 1e5].forEach(function (K) { var c = { regime: rg, X: X, tInf: t, K: K }; if (V.contrainte(c).ok) best = { K: K, r: V.recette(c) }; });
    if (best) log(rg + ' | ' + X / 1e3 + ' k€ | ' + pc(t, 1) + ' | ' + best.K / 1e3 + ' k€' + (best.K === 1e5 ? ' (borne de la grille)' : '') + ' | ' + f1(best.r.totale) + ' | ' + f1(best.r.deltaV74) + ' | ' + f1(best.r.differe) + ' | ' + f1(best.r.totale - best.r.differe));
  }); }); });

  function bloc(nom, c) {
    var r = V.recette(c);
    log('\n=== ' + nom + ' : ' + JSON.stringify(c) + ' ===');
    log('Part RP : statique ' + f1(r.rpStatique) + ', nette ' + f1(r.rpNette) + ' (bouclier de transition, année 1 : −' + f1(r.bouclierAn1) + ', décroît avec la rotation des RP ≈ 5 %/an)');
    log('Fonction : statique ' + f1(r.fonctionStatique) + ', nette ' + f1(r.fonctionNette) + ' (calage ' + r.ratioCalage.toFixed(3) + '), dont différé ' + f1(r.differe) + ' (' + pc(r.partDiffere, 0) + ')');
    log('Total ' + f1(r.totale) + ' Md€ (année 1 avec bouclier : ' + f1(r.totaleAn1) + ') ; encaissé dans l\'année ' + f1(r.totale - r.differe) + ' (v7.4 B : 54,52 dont 12,43 différés, 42,09 encaissés) ; Δ v7.4 ' + f1(r.deltaV74) + ' ; comble ' + pc(r.combleRef, 0) + ' de 18,7 et ' + pc(r.combleTout, 0) + ' de 29,1');
    var g = V.agreger(c);
    log('tranche | ménages (M) | patrimoine net moyen | ANCIEN stock (TF+DMTO+IFI+TH RS) | v7.4 B dû | NOUVEAU stock dû (part RP + fonction) | dont différé | écart stock | ANCIEN revenus du capital | NOUVEAU revenus du capital | DMTG (identiques) | ANCIEN total | NOUVEAU total | écart total | écart en pt de patrimoine');
    g.tranches.concat([g.total]).forEach(function (t, j) { if (t.n <= 0) return; var m = function (k) { return t[k] / t.n; }, net = m('net');
      var at = m('ancienStock') + m('psir') + m('dmtg'), nt = m('nouveauStock') + m('levy') + m('dmtg');
      log((j < V.NOMS.length ? V.NOMS[j] : 'ENSEMBLE') + ' | ' + (t.n / 1e6).toFixed(2) + ' | ' + f0(net) + ' | ' + f0(m('ancienStock')) + ' | ' + f0(m('v74')) + ' | ' + f0(m('nouveauStock')) + ' (RP ' + f0(m('chargeRP')) + ' ; fonction ' + f0(m('Pp')) + ') | ' + f0(m('differe')) + ' | ' + f0(m('nouveauStock') - m('ancienStock'))
        + ' | ' + f0(m('psir')) + ' | ' + f0(m('levy')) + ' | ' + f0(m('dmtg')) + ' | ' + f0(at) + ' (' + pc(at / net) + ') | ' + f0(nt) + ' (' + pc(nt / net) + ') | ' + f0(nt - at) + ' | ' + (100 * (nt - at) / net).toFixed(2)); });
    log('Contrainte dure (stock, tranches ≤ 1 M€) : ' + (V.contrainte(c).ok ? 'respectée' : 'VIOLÉE'));
    log('Cas types (€/an) | ancien stock (TF + DMTO annualisés + TH RS + IFI) | v7.4 B | nouveau : part RP + fonction (dont différé) | écart stock | ancien revenus du capital | nouveau revenus du capital');
    V.casTypes(c).forEach(function (x) { log(x.lib + ' | ' + f0(x.ancienStock) + ' (TF ' + f0(x.tf) + ' ; DMTO ' + f0(x.dmto) + ' ; TH RS ' + f0(x.thrs) + ') | ' + f0(x.v74) + ' | ' + f0(x.chargeRP) + ' + ' + f0(x.fonction) + ' (' + f0(x.differe) + ') | ' + f0(x.ecartStock) + ' | ' + f0(x.psir) + ' | ' + f0(x.levy)); });
    return r;
  }
  var rRec = bloc('D. VARIANTE RECOMMANDÉE (régime RP)', REC);
  var rAB = bloc('E. MÊME RÉGLAGE, ABATTEMENT UNIQUE (AB)', AB);
  bloc('E bis. RÉGIME RP, X = 1 M€, t∞ = 2 % (v7.4 B sans la RP)', { regime: 'RP', X: 1e6, tInf: 0.02, K: 7e5 });
  bloc('E ter. REPLI PRUDENT : RÉGIME RP, X = 1 M€, t∞ = 2,5 %, K = 300 k€', { regime: 'RP', X: 1e6, tInf: 0.025, K: 3e5, payeProrata: true, plancherPro: true });
  bloc('E quater. ABATTEMENT UNIQUE LE PLUS RENTABLE SOUS LA CONTRAINTE : X = 500 k€, t∞ = 3 %, K = 100 k€', { regime: 'AB', X: 5e5, tInf: 0.03, K: 1e5, payeProrata: true, plancherPro: true });

  log('\n=== F. CAS LIMITES DE LA v7.4 avec la variante recommandée (€/an ; charge = fonction des revenus + part RP + fonction payée, en % du revenu reçu) ===');
  log('cas | base fonction | part RP | P | déduit (plancher) | payé | différé | charge payée | charge due | v7.4 charge payée | alerte > 100 %');
  V.casLimites(REC).forEach(function (x) { var f = x.v75;
    log(x.lib + ' | ' + f0(f.wf) + ' | ' + f0(f.chargeRP) + ' | ' + f0(f.P) + ' | ' + f0(f.Ck) + ' | ' + f0(f.paye) + ' | ' + f0(f.differe) + ' | ' + pc(f.chargePct, 0) + ' | ' + pc(f.chargeDuePct, 0) + ' | ' + pc(x.v74charge, 0) + ' | ' + (f.chargeDuePct !== null && f.chargeDuePct > 1 ? (f.chargePct > 1 ? 'OUI (payé)' : 'dû seulement (différé)') : '')); });
  var sansPro = V.casLimites({ regime: 'RP', X: 1e6, tInf: 0.03, K: 4e5, payeProrata: true });
  ['agriculteur', 'viticulteur', 'chef_entreprise'].forEach(function (id) { var x = sansPro.filter(function (y) { return y.id === id; })[0]; log('sans l\'option plancherPro : ' + id + ' : charge due ' + pc(x.v75.chargeDuePct, 0) + ', déduit ' + f0(x.v75.Ck)); });

  log('\n=== G. FONCTION RECOMMANDÉE : taux moyen et marginal (base hors RP sous X) ===');
  [1e5, 3e5, 5e5, 1e6, 2e6, 5e6, 1e7, 1e8].forEach(function (W) { log(f0(W) + ' € | dû ' + f0(V.Pf(W, REC)) + ' | moyen ' + pc(V.tauxMoyenF(W, REC)) + ' | marginal ' + pc(V.marginalF(W, REC)) + ' | v7.4 : moyen ' + pc(A.tauxMoyen(W)) + ' (RP comprise)'); });

  log('\n=== H. EFFETS DE BORD ===');
  log('H1. Loyers : hausse de charge annuelle sur un logement loué (stock seul), répercutée pour une part ρ ; valeur = loyer × 12 / rendement brut ; logement de 60 m²');
  var ZONES = [['Paris', 24.2 * 60, 0.030], ['Grenoble', 10.8 * 60, 0.052], ['ville moyenne (loyer médian des communes, 10,00 €/m²)', 10.0 * 60, 0.050]];
  // Δ charge (en % de la valeur) : petit bailleur (le plancher couvre presque tout : taux effectif sur le studio du cas type) ; bailleur aisé (marginal de la fonction − plancher ≈ 65 % × 2 % de loyer net)
  var ct = V.casTypes(REC).filter(function (x) { return x.id === 'petit_bailleur'; })[0], tPetit = ct.fonction / 1.5e5;
  var tAise = V.marginalF(2e6, REC) - 0.65 * 0.02;
  log('taux de charge sur le logement loué : petit bailleur ' + pc(tPetit) + ' (cas type) ; bailleur aisé (base 2 M€) ' + pc(tAise) + ' (marginal ' + pc(V.marginalF(2e6, REC)) + ' − plancher ≈ 65 % × 2 % de loyer net) ; ancien : TF ' + pc(V.HYP.tauRPsource) + ' + DMTO annualisés ' + pc(E.dmtoRate));
  ZONES.forEach(function (z) { [[tPetit, 'petit bailleur'], [tAise, 'bailleur aisé']].forEach(function (tt) { [0.15, 0.5, 1].forEach(function (rho) {
    var e = V.effetLoyer(z[1], z[2], tt[0], rho, V.HYP.tauRPsource, E.dmtoRate); log(z[0] + ' (loyer ' + f0(z[1]) + ' €/mois, valeur ' + f0(e.valeur) + ' €) | ' + tt[1] + ' | ρ = ' + rho + ' | ' + (e.deltaMois >= 0 ? '+' : '') + f0(e.deltaMois) + ' €/mois (' + pc(e.pctLoyer, 1) + ')'); }); }); });
  var abP = V.casTypes(AB).filter(function (x) { return x.id === 'petit_bailleur'; })[0];
  log('Abattement unique : le petit bailleur paie ' + f0(abP.fonction) + ' €/an de fonction (régime RP : ' + f0(ct.fonction) + ') : pas de hausse à répercuter.');
  log('H2. Capitalisation de l\'avantage RP (Δprix ≈ κ × a / (r + τ), r = 2 % loyer net, τ = 0,27 %) : avantage annuel a = (fonction évitée − part RP) / valeur, pour un acheteur qui aurait sinon placé la même somme');
  [[1e5, 'acheteur sans autre patrimoine, RP 300 k€'], [5e5, 'acheteur avec 500 k€ d\'autres actifs, RP 500 k€'], [1e6, 'acheteur avec 1 M€ d\'autres actifs, RP 1 M€']].forEach(function (x, i) {
    var rp = [3e5, 5e5, 1e6][i], autre = [0, 5e5, 1e6][i], gain = V.Pf(autre + rp, REC) - V.Pf(autre, REC) - V.chargeRP(rp, REC), a = gain / rp;
    log(x[1] + ' : fonction évitée − part RP = ' + f0(gain) + ' €/an (a = ' + pc(a) + ') ; Δprix si κ = 0,25 / 0,5 / 0,75 : ' + [0.25, 0.5, 0.75].map(function (k) { return pc(V.capitalisation(a, k, 0.02, 0.0027), 0); }).join(' / ') + ' (borne haute : tout le marché aurait ce profil)');
  });
  log('Fin des droits de mutation (≈ 5,8 % du prix, une fois) : 300 000 € → 17 400 € ; la part RP (0,25 %) contre la TF (≈ 0,25 %) ne change rien en moyenne.');
  log('H3. Offre locative : base de la fonction pour 2 412 Md€ de locatif hors RP (étude) ; sans réaction, charge supplémentaire des bailleurs aisés ≈ ' + pc(tAise - V.HYP.tauRPsource - E.dmtoRate) + ' de la valeur par an.');
  log('\n=== I. FORÊT (variante recommandée ; autre patrimoine 0 ou 1 M€) ===');
  [[5000, 5e5, 0], [5000, 5e5, 1e6], [30000, 3e6, 2e6]].forEach(function (x) { var f = V.foret(x[0], x[1], x[2], REC);
    log('revenu net ' + f0(x[0]) + ' €/an, valeur vénale ' + f0(x[1]) + ' €, autre patrimoine ' + f0(x[2]) + ' € : valeur de rendement ' + f0(f.valeurRendement) + ' ; fonction due au titre de la forêt ' + f0(f.duRendement) + ' €/an (' + pc(f.partRevenuRendement, 0) + ' du revenu forestier) ; à la valeur vénale ' + f0(f.duVenale)); });
  log('\n=== J. PRÉLÈVEMENT EN AVANCE SUR UNE ENTREPRISE VALORISÉE (fondateur, 30 M€ au dernier tour) ===');
  [0.02, 0.025, 0.03].forEach(function (t) { var c = { regime: 'RP', X: 1e6, tInf: t, K: 4e5 }, d = V.Pf(3e7, c); log('t∞ ' + pc(t, 1) + ' : dû ' + f0(d) + ' €/an, soit ' + pc(d / 3e7) + ' des parts par an, payé en titres (dilution), aucun différé ; à la valeur substantielle (1 M€) : ' + f0(V.Pf(1e6, c)) + ' €/an, dont l\'essentiel différé'); });
})();
