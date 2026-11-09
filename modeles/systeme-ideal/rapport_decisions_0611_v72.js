// Rapport de la v7.2 adoptée (decisions_0611_v72.js) : produit le § 30 de resultats-optimum.txt (Markdown). Même liste de chargement que test_decisions_0611_v72.js,
// en remplaçant le fichier de test par rapport_decisions_0611_v72.js.
var Y = this.Decisions0611V72, J = this.Decisions0511j;
var log = (typeof print === 'function') ? print : console.log;
function f(x, n) { if (x === null || x === undefined || isNaN(x)) return '—'; var s = Math.abs(x).toFixed(n === undefined ? 1 : n).replace('.', ','); s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return (x < 0 && Math.abs(x) >= Math.pow(10, -(n === undefined ? 1 : n)) / 2 ? '−' : '') + s; }
function sg(x, n) { return (x > 0 ? '+' : '') + f(x, n); }
function pc(x, n) { return f(100 * x, n === undefined ? 1 : n) + ' %'; }
var t0 = Date.now();

log('## 30. v7.2 ADOPTÉE (arbitrage 43, 06/11/2026) : le « mélange » (H72.1-H72.10)');
log('**Ce que ce paragraphe fait.** La v7.2 remplace la v5.10 comme modèle de référence : fonction des revenus de la v7.1 (calibrage C, capital à 100 % avec crédit d\'IS, IS unique à 25 %), moitié du surplus rendue par une fonction du patrimoine continue (sans seuil), moitié au déficit ; dette stabilisée par des économies chiffrées à part. Module `decisions_0611_v72.js`, test `test_decisions_0611_v72.js`. Construction : solde de la v5.10 à 42 % + écart de la v7.2, constant dès 2029. Euros de 2025 ; ordres de grandeur sous hypothèses.');
log('');
log('### 30.1 Les deux fonctions');
log('- **Revenus** (par adulte, €/mois) : **' + Y.formule().replace(/\./g, ',') + '** ; taux marginal de 20 % au premier euro à 65 %. R = revenu en coût employeur + revenus du capital à 100 % (dividendes pour leur montant avant IS, IS déduit) + pension regroupée à net constant.');
log('');
log('| R (€/mois) | dû (− = versé) | reste pour soi | taux moyen | taux marginal |'); log('|---|---|---|---|---|');
Y.table().forEach(function (l) { log('| ' + f(l.R, 0) + ' | ' + f(l.du, 0) + ' | ' + f(l.reste, 0) + ' | ' + (l.R > 0 ? pc(l.tauxMoyen) : '—') + ' | ' + pc(l.marginal) + ' |'); });
var ta = Y.tau();
log('');
log('- **Patrimoine** (par ménage, €/an, valeur nette W de l\'immobilier et des parts de sociétés, résidence principale comprise, une seule formule, sans seuil ni marche) : **' + Y.formulePatrimoine().replace(/\./g, ',') + '** ; taux marginal de 0,2 % au premier euro à 2 % (taux du projet Zucman) ; K calculé pour une recette de ' + f(ta.cible, 1) + ' Md€ (61,7 − ' + f(ta.baisse, 1) + ', moitié du surplus) ; taux effectif moyen ' + pc(ta.tauxEffectif, 3) + '.');
log('');
log('| W | taxe annuelle | taux moyen | taux marginal |'); log('|---|---|---|---|');
Y.tablePatrimoine().forEach(function (l) { log('| ' + (l.W >= 1e9 ? f(l.W / 1e9, 0) + ' Md€' : l.W >= 1e6 ? f(l.W / 1e6, 0) + ' M€' : f(l.W / 1e3, 0) + ' k€') + ' | ' + f(l.taxe, 0) + ' € | ' + pc(l.tauxMoyen, 2) + ' | ' + pc(l.marginal, 2) + ' |'); });
log('');
log('### 30.2 Écart à la v5.10 et solde (Md€/an, croisière ; favorable / central / défavorable)');
var E = {}; Y.SCS.forEach(function (s) { E[s] = Y.ecart(s); });
function ligne(lib, fn) { log('| ' + lib + ' | ' + Y.SCS.map(function (s) { return sg(fn(E[s], s), 2); }).join(' | ') + ' |'); }
log('| | favorable | central | défavorable |'); log('|---|---|---|---|');
ligne('surplus de la fonction des revenus au droit actuel', function (e, s) { return Y.surplus(s); });
ligne('fonction des revenus (actifs) / v5.10', function (e) { return e.actifs; });
ligne('capital des retraités dans la fonction', function (e) { return e.retraitesCapital; });
ligne('IS unique (+ retenue)', function (e) { return e.is + e.retenue; });
ligne('volet patrimoine / v5.10', function (e) { return e.patrimoine; });
ligne('capital de départ retiré (N26)', function (e) { return e.capitalDepart; });
ligne('contribution des hautes pensions retirée (N03)', function (e) { return e.n03; });
ligne('**écart total à la v5.10**', function (e) { return e.total; });
ligne('**solde de croisière (2060)**', function (e, s) { return Y.solde(s, 2060); });
var lp = E.central.lignesPatrimoine;
log('');
log('Volet patrimoine, central : taxe annuelle ' + sg(lp.taxeAnnuelle, 2) + ' (recette ' + f(lp.recetteTaxe, 2) + ' au lieu de 86,42 pour la taxe de 1 %) ; DMTG gardés à la place de la fonction de transmission ' + sg(lp.dmtgGardes, 2) + ' ; DMTO ' + sg(lp.dmto, 2) + ' ; réalisation des plus-values (non comptée) ' + sg(lp.realisation, 2) + ' ; plafonds ' + sg(lp.plafonds, 2) + ' ; holdings ' + sg(lp.holdings, 2) + ' ; trusts ' + sg(lp.trusts, 2) + ' ; SCI ' + sg(lp.sci, 2) + '.');
log('');
log('### 30.3 Solde année par année (central, Md€ de 2025 ; % du PIB de 2024)');
log('| année | v7.2 | % PIB | v5.10 à 42 % | favorable | défavorable |'); log('|---|---|---|---|---|---|');
[2029, 2030, 2032, 2035, 2038, 2041, 2045, 2050, 2055, 2060, 2065, 2070].forEach(function (y) { log('| ' + y + ' | ' + sg(Y.solde('central', y), 1) + ' | ' + pc(Y.solde('central', y) / 2935) + ' | ' + sg(J.solde('central', y, 0.42), 1) + ' | ' + sg(Y.solde('bas', y), 1) + ' | ' + sg(Y.solde('haut', y), 1) + ' |'); });
log('');
log('### 30.4 Dette / PIB à 10, 20, 30 ans, sans économies supplémentaires (comportements centraux)');
var D = Y.dette();
log('| macro | fin 2028 | 10 ans | 20 ans | 30 ans | déficit à 10 ans | économies pour une dette stable (Md€/an dès 2029) |'); log('|---|---|---|---|---|---|---|');
var ECO = {};
Y.MACROS.forEach(function (m) { var d = D[m].central; ECO[m] = Y.economiesPourStabiliser('central', m); log('| ' + m + ' | ' + pc(d.r0) + ' | ' + pc(d.r10) + ' | ' + pc(d.r20) + ' | ' + pc(d.r30) + ' | ' + pc(d.def10) + ' | **' + f(ECO[m], 1) + '** |'); });
log('Comportements favorables / défavorables (macro de référence) : 30 ans ' + pc(D.reference.bas.r30) + ' / ' + pc(D.reference.haut.r30) + ' ; économies ' + f(Y.economiesPourStabiliser('bas', 'reference'), 1) + ' / ' + f(Y.economiesPourStabiliser('haut', 'reference'), 1) + ' Md€.');
log('');
log('### 30.5 Leviers d\'économies (variante_dette_stable.js ; défense exclue) et combinaison recommandée');
var cat = Y.catalogueLeviers();
log('| levier | 2030 | 2040 | 2060 | nature |'); log('|---|---|---|---|---|');
Object.keys(cat).forEach(function (k) { log('| ' + k + ' : ' + cat[k].libelle + ' | ' + f(cat[k].y2030, 2) + ' | ' + f(cat[k].y2040, 2) + ' | ' + f(cat[k].y2060, 2) + ' | ' + (k === 'HP' ? 'prélèvement' : 'économie') + ' |'); });
[Y.HYP.combinaison, ['R1f', 'M1f', 'M2f', 'M3'], ['R1f', 'M1m', 'M2m', 'M3', 'HP'], ['R1f', 'M1f', 'M2m', 'M3', 'HP']].forEach(function (ids, i) {
  var c = Y.combinaison(ids);
  log('- ' + (i === 0 ? '**Recommandée** ' : '') + ids.join(' + ') + ' : ' + f(c.rendement[2030], 1) + ' / ' + f(c.rendement[2040], 1) + ' / ' + f(c.rendement[2060], 1) + ' Md€ (2030 / 2040 / 2060) ; dette à 30 ans ' + Y.MACROS.map(function (m) { return m + ' ' + pc(c.dette[m].r30); }).join(', ') + ' ; **il manque encore** ' + Y.MACROS.map(function (m) { return f(c.manque[m], 1); }).join(' / ') + ' Md€/an (prudente / référence / favorable).');
});
log('');
log('### 30.6 Prélèvements obligatoires (croisière, convention du bilan global)');
var po = Y.prelevementsObligatoires();
log('Bruts : **' + pc(po.pct) + '** du PIB (aujourd\'hui ' + pc(po.avantPct) + ', v5.10 ' + pc(po.v510Pct) + ') ; nets des transferts : ' + pc(po.pctNet) + '. Le brut compte le versement B > 0 (socle) en dépense et T(R) en prélèvement.');
log('');
log('### 30.7 Cas types (€/mois, écart au droit actuel ; reste à vivre = revenu disponible − dépenses pré-engagées, DREES ER 1055)');
log('| cas | aujourd\'hui | v7.2 | écart | % du revenu | reste à vivre | % du reste à vivre |'); log('|---|---|---|---|---|---|---|');
Y.casTypes().forEach(function (c) {
  if (c.avant === null) { log('| ' + c.libelle + ' | taxe ' + f(c.taxeAvant, 0) + ' | taxe ' + f(c.taxeApres, 0) + ' | ' + sg(c.ecartPatrimoine, 0) + ' | — | — | — (v7 : ' + f(c.taxeV7, 0) + ') |'); return; }
  log('| ' + c.libelle + ' | ' + f(c.avant, 0) + ' | ' + f(c.apres, 0) + ' | ' + sg(c.ecart, 0) + (c.avecEconomies ? ' (' + sg(c.ecart + c.avecEconomies, 0) + ' avec R1f)' : '') + ' | ' + sg(100 * c.ecartPct, 1) + ' % | ' + f(c.rav, 0) + ' (' + c.categorie + ') | ' + sg(100 * c.ecartPctRAV, 1) + ' % |');
});
log('');
log('### 30.8 Taux marginaux effectifs');
var tm = Y.tme();
log('Personne seule (plancher compris) : ' + tm.profil.map(function (p) { return f(p.R, 0) + ' € ' + pc(p.seul); }).join(' ; ') + '. Maximum ' + pc(tm.max.taux) + ' vers ' + f(tm.max.R, 0) + ' € (fin du plancher) ; 1 à 1,1 Smic ' + pc(tm.smic) + ' ; participation (0 → Smic) ' + pc(tm.participation[2].seul) + ' seul, ' + pc(tm.participation[2].secondAdulte) + ' second adulte ; trappes : ' + tm.trappes.length + '. Bénéfice distribué : IS + fonction = 65 % au sommet.');
log('');
log('### 30.9 Collectivités (bascule réexprimée)');
var bq = Y.bascule();
log('T(R) total ≈ ' + f(bq.T, 1) + ' Md€ ; taxe du patrimoine ' + f(bq.patrimoine, 1) + ' Md€. Bloc communal : 100 % de la taxe du patrimoine + ' + pc(bq.bloc.partT, 2) + ' de T(R) (' + f(bq.bloc.mdT, 1) + ' Md€) ; départements ' + pc(bq.departements.partT, 2) + ' ; régions ' + pc(bq.regions.partT, 3) + ' ; autorités de la mobilité ' + pc(bq.aom.partT, 2) + '. La TVA affectée reste inchangée ; effet nul sur le solde consolidé.');
log('');
log('Temps de calcul du § 30 : ≈ ' + Math.round((Date.now() - t0) / 1000) + ' s.');
