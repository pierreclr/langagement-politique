// Rapport de la v7.3 PROPOSÉE (decisions_0611_v73.js) : produit la section 15 de sources/bareme-deux-fonctions-v7.md (Markdown). Même liste de chargement que test_decisions_0611_v73.js,
// en remplaçant le fichier de test par rapport_decisions_0611_v73.js.
var Z = this.Decisions0611V73, Y = this.Decisions0611V72;
var log = (typeof print === 'function') ? print : console.log;
function f(x, n) { if (x === null || x === undefined || isNaN(x)) return '—'; var d = n === undefined ? 1 : n, s = Math.abs(x).toFixed(d).replace('.', ','); s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return (x < 0 && Math.abs(x) >= Math.pow(10, -d) / 2 ? '−' : '') + s; }
function sg(x, n) { return (x > 0.0000001 ? '+' : '') + f(x, n); }
function pc(x, n) { return f(100 * x, n === undefined ? 1 : n) + ' %'; }
function eur(W) { return W >= 1e9 ? f(W / 1e9, 0) + ' Md€' : W >= 1e6 ? f(W / 1e6, 0) + ' M€' : f(W / 1e3, 0) + ' k€'; }
var SCN = { bas: 'favorable', central: 'central', haut: 'défavorable' };

log('## 15. v7.3 proposée (06/11/2026, NON ADOPTÉE) : une fonction du patrimoine lisible et cohérente, la dette d\'abord');
log('');
log('**Ce que cette section fait.** L\'auteur demande une courbe du patrimoine lisible : taux moyen ≈ 0 pour les petits patrimoines, ≈ 0,5 % vers 300 000 € (le niveau d\'une taxe foncière de résidence principale), 1 % vers 1 M€, 2 % pour les très grandes fortunes, continue, sans seuil à 100 M€. La recette monte ; le surplus comble d\'abord le manque de la dette de la v7.2, puis allège la fonction des revenus. Module `modeles/systeme-ideal/decisions_0611_v73.js`, test `test_decisions_0611_v73.js` (57 vérifications), ce texte par `rapport_decisions_0611_v73.js`. Tout le reste est la v7.2. Euros de 2025 ; ordres de grandeur sous hypothèses (H73.x), pas des prédictions.');
log('');
log('### 15.0 En une page');
var rc = Z.recettePatrimoine('central'), rp = Z.repartition(), po = Z.prelevementsObligatoires(), cb = Z.combinaison(), ps = Z.plafondSommet('central');
log('- **Patrimoine, une phrase** : « on paie chaque année 2 % × W / (W + 1 M€) de son patrimoine net » : la moitié de 2 % à 1 M€, presque rien en dessous de 100 000 €, presque 2 % au-delà de 10 M€.');
log('- **Formule** [B] : **τ(W) = 2 % × W / (W + 1 M€)** ; taxe annuelle **P(W) = 2 % × W² / (W + 1 M€)** ; taux marginal 2 % × (1 − (1 M€ / (W + 1 M€))²), de 0 au premier euro à 2 %, sans jamais le dépasser : ni seuil ni marche.');
log('- **Recette** [B] : **' + f(rc.nette) + ' Md€** au central (' + f(Z.recettePatrimoine('bas').nette) + ' favorable, ' + f(Z.recettePatrimoine('haut').nette) + ' défavorable), contre 26,3 en v7.2 et 61,7 pour les impôts remplacés (taxe foncière, IFI, DMTO) ; après le plafond de 75 % au sommet (−' + f(ps.perte) + '), le gain sur la v7.2 est de **+' + f(rp.gainPatrimoine) + ' Md€**.');
log('- **Usage** [C, règle de l\'auteur] : ' + f(rp.manqueDette) + ' Md€ comblent le manque de la dette de la v7.2 ; ' + f(rp.allegementRevenus) + ' Md€ allègent la fonction des revenus : **' + Z.formule().replace(/\./g, ',') + '**.');
log('- **Dette** [B] : avec la combinaison recommandée (R1f, M1m, M2m, M3), **plus aucun manque en macro de référence** (dette à 30 ans ' + pc(cb.dette.reference.r30) + ') ; il manque encore ' + f(cb.manque.prudente) + ' Md€/an en macro prudente.');
log('- **Prélèvements obligatoires** [B] : ' + pc(po.pct) + ' du PIB (v7.2 ' + pc(po.v72Pct) + ', aujourd\'hui ' + pc(po.avantPct) + ') ; nets des transferts ' + pc(po.pctNet) + '. **On prélève ≈ 30 Md€ de plus que la v7.2 : c\'est le prix de la dette stabilisée.**');
log('- **Qui paie** [B] : la résidence de 300 000 € paie moins qu\'aujourd\'hui (Grenoble : 1 385 €/an au lieu de 2 650) ; la résidence de 1 M€ paie 10 000 €/an au lieu de ≈ 2 700 ; le rentier à 2 M€ paie 75 % de son revenu ; au-delà de quelques millions, revenus et patrimoine réunis dépassent 100 % du revenu et **c\'est le plafond de 75 % qui fait la loi** (voir 15.6).');
log('');
log('### 15.1 La fonction du patrimoine [B]');
log('');
log('| W (valeur nette) | taux moyen | taxe annuelle | taux marginal | v7.2 : taxe annuelle |'); log('|---|---|---|---|---|');
Z.tablePatrimoine().forEach(function (l) { log('| ' + eur(l.W) + ' | ' + pc(l.tauxMoyen, 2) + ' | ' + f(l.taxe, 0) + ' € | ' + pc(l.marginal, 2) + ' | ' + f(Y.Tp(l.W), 0) + ' € |'); });
log('');
log('Repères de l\'auteur : 0,46 % à 300 000 € (cible ≈ 0,5 %), 1,00 % à 1 M€ (cible ≈ 1 %), 1,98 % à 100 M€ (cible 2 %). Variante K = 900 000 € : 0,50 % à 300 000 €, 1,05 % à 1 M€ (+2,4 Md€ de recette nette avant plafond ; non retenue : la phrase « la moitié de 2 % à 1 M€ » est plus simple). Vérifications (test) : taux moyen et marginal croissants partout de 0 à 3 Md€, marginal maximal 2 % jamais atteint, dérivée continue.');
log('');
log('### 15.2 Recette, exil, érosion [B]');
log('Même chaîne que `taxe_patrimoine.js` (assiette nette, valorisations, effet de prix, paiement différé, gestion), mais **taux par composante** et **érosion ménage par ménage** : chaque ménage de l\'enquête HVP (recalée × 1,4 sur les comptes nationaux) a son taux τ(W) ; son capital mobile s\'érode selon e(τ) = 1 − (1 − e1)^(τ / 1 %) (loi exponentielle de `grandes_fortunes_0511.js`, égale à la loi linéaire de `taxe_patrimoine.js` à 1 %) ; l\'exil emporte 20 / 74 de l\'érosion (CAE, Focus n° 118) et 2,2 %/an d\'autres impôts par euro parti. Contrôle : à taux plat de 1 %, on retrouve exactement la recette de `taxe_patrimoine.js` (72,9 Md€).');
log('');
log('| Md€/an | favorable | central | défavorable |'); log('|---|---|---|---|');
var R3 = { bas: Z.recettePatrimoine('bas'), central: rc, haut: Z.recettePatrimoine('haut') }, P3 = { bas: Z.plafondSommet('bas'), central: ps, haut: Z.plafondSommet('haut') };
function l3(lib, fn, n) { log('| ' + lib + ' | ' + ['bas', 'central', 'haut'].map(function (s) { return fn(s); }).join(' | ') + ' |'); }
l3('taux effectif moyen (immobilier)', function (s) { return pc(R3[s].tauxEffectif, 2) + ' (' + pc(R3[s].tauxImmo, 2) + ')'; });
l3('effet de prix sur l\'immobilier', function (s) { return pc(R3[s].effetPrix); });
l3('érosion du capital mobile : 1 % le mieux doté / reste', function (s) { return pc(R3[s].erosionTop, 0) + ' / ' + pc(R3[s].erosionReste, 0); });
l3('recette brute (immobilier + mobile)', function (s) { return f(R3[s].brute) + ' (' + f(R3[s].bruteImmo) + ' + ' + f(R3[s].bruteMobile) + ')'; });
l3('exil (autres impôts perdus)', function (s) { return '−' + f(R3[s].exil, 2); });
l3('gestion ; différé non recouvré', function (s) { return '−' + f(R3[s].gestion, 2) + ' ; −' + f(R3[s].perteDiffere, 2); });
l3('**recette nette**', function (s) { return '**' + f(R3[s].nette) + '**'; });
l3('plafond de 75 % au sommet : excédent ; perdu après report (H73.7)', function (s) { return f(P3[s].excedent) + ' ; −' + f(P3[s].perte); });
l3('gain du volet patrimoine sur la v7.2', function (s) { return sg(Z.gainPatrimoineVsV72(s)); });
log('');
log('Comparaisons (central) : v7.2 26,3 Md€ ; impôts remplacés 61,7 (taxe foncière 42,9, IFI 2,7, DMTO 16,1) ; taxe plate de 1 % de la v5.10 86,4. La v7.3 prélève donc ≈ ' + f(rc.nette - 61.72) + ' Md€ de plus sur le patrimoine qu\'aujourd\'hui, en échange des droits de mutation (DMTO) supprimés.');
log('');
log('### 15.3 La fonction des revenus allégée [B]');
log('**' + Z.formule().replace(/\./g, ',') + '** (v7.2 : B(R) = 412,5 + 675 × (1 − e^(−R/1 500)) − 0,65 × R). Taux marginal de 26,25 % au premier euro à 65,5 %. Recherche sur grille (H73.4) ; tous les bas revenus dans la cible +20 à +80 € ; cadre à 10 000 € brut dans la cible ; cadre à 20 000 € à −0,4 % (la forme ne permet toujours pas de tenir les deux cadres à la fois). Le surplus au-dessus du droit actuel passe de 70,9 à ' + f(Z.surplus('central')) + ' Md€.');
log('');
log('| R (€/mois) | dû (− = versé) | reste pour soi | taux moyen | taux marginal | v7.2 : dû |'); log('|---|---|---|---|---|---|');
var t72 = {}; Y.table().forEach(function (l) { t72[l.R] = l; });
Z.table().forEach(function (l) { log('| ' + f(l.R, 0) + ' | ' + f(l.du, 0) + ' | ' + f(l.reste, 0) + ' | ' + (l.R > 0 ? pc(l.tauxMoyen) : '—') + ' | ' + pc(l.marginal) + ' | ' + f(t72[l.R].du, 0) + ' |'); });
log('');
log('### 15.4 Écart, solde, prélèvements (Md€/an, croisière)');
log('| | favorable | central | défavorable |'); log('|---|---|---|---|');
l3('surplus de la fonction des revenus au droit actuel', function (s) { return sg(Z.surplus(s), 2); });
l3('volet patrimoine / v5.10', function (s) { return sg(Z.ecart(s).patrimoine, 2); });
l3('**écart total à la v5.10** (v7.2)', function (s) { return '**' + sg(Z.ecart(s).total, 2) + '** (' + sg(Y.ecart(s).total, 2) + ')'; });
l3('**solde de croisière 2060** (v7.2)', function (s) { return '**' + sg(Z.solde(s, 2060), 1) + '** (' + sg(Y.solde(s, 2060), 1) + ')'; });
log('');
log('Solde année par année (central) : ' + [2029, 2030, 2035, 2041, 2050, 2060, 2070].map(function (y) { return y + ' ' + f(Z.solde('central', y)) + ' (' + pc(Z.solde('central', y) / 2935) + ')'; }).join(' ; ') + '. Prélèvements obligatoires bruts ' + pc(po.pct) + ' du PIB, nets des transferts ' + pc(po.pctNet) + ' (v7.2 : 49,7 % et 46,1 % ; aujourd\'hui 42,7 % ; convention du bilan global : B(0) en dépense, T(R) en prélèvement).');
log('');
log('### 15.5 Dette / PIB (comportements centraux) et économies [B]');
log('| macro | fin 2028 | 10 ans | 20 ans | 30 ans | économies pour une dette stable (v7.2) | avec R1f + M1m + M2m + M3 : 10 / 20 / 30 ans ; manque (v7.2) |'); log('|---|---|---|---|---|---|---|');
var D = Z.dette(), cb72 = Y.combinaison();
['prudente', 'reference', 'favorable'].forEach(function (m) { var j = D[m].central, c = cb.dette[m]; log('| ' + m + ' | ' + pc(j.r0) + ' | ' + pc(j.r10) + ' | ' + pc(j.r20) + ' | ' + pc(j.r30) + ' | **' + f(Z.economiesPourStabiliser('central', m)) + '** (' + f(Y.economiesPourStabiliser('central', m)) + ') | ' + pc(c.r10) + ' / ' + pc(c.r20) + ' / ' + pc(c.r30) + ' ; **' + f(cb.manque[m]) + '** (' + f(cb72.manque[m]) + ') |'); });
log('Comportements favorables / défavorables (macro de référence) : dette à 30 ans ' + pc(Z.jalons('bas', 'reference').r30, 0) + ' / ' + pc(Z.jalons('haut', 'reference').r30, 0) + ' ; économies ' + f(Z.economiesPourStabiliser('bas', 'reference')) + ' / ' + f(Z.economiesPourStabiliser('haut', 'reference')) + ' Md€/an. L\'écart vient toujours des réactions des hauts revenus et du capital.');
log('');
log('### 15.6 Cas types (€/mois, écart au droit actuel ; v7.2 pour comparer)');
log('| cas | aujourd\'hui | v7.3 | écart | % | v7.2 : écart |'); log('|---|---|---|---|---|---|');
var K = Z.casTypesObjet(), k72 = Y.casTypesObjet();
Z.casTypes().forEach(function (c) {
  if (c.id === 'proprio_grenoble_300k' || c.id === 'proprio_1M') { log('| ' + c.libelle + ' | taxe ' + f(c.taxeAvant, 0) + ' | taxe ' + f(c.taxeApres, 0) + ' | ' + sg(c.ecart, 0) + ' | — | taxe v7.2 ' + f(c.taxeV72, 0) + ' : ' + sg(c.taxeAvant - c.taxeV72, 0) + ' |'); return; }
  var x = '';
  if (c.id === 'retraite_proprio_500k') x = ' (paie 5 % de sa pension ; ' + f(c.differeAn, 0) + ' €/an différés ; charge économique ' + sg(c.ecartEconomique, 0) + ')';
  if (c.id === 'rentier') x = ' (plafond de 75 % atteint)';
  if (c.id === 'fortune_20M') x = ' (dû : ' + pc(c.tauxGlobalAvantPlafond, 0) + ' du revenu ; plafonné à 75 %, ' + f(c.reporteAn / 1000, 0) + ' k€/an reportés)';
  if (c.avecEconomies) x += ' (' + sg(c.ecart + c.avecEconomies, 0) + ' avec R1f)';
  var v72 = c.id === 'retraite_proprio_500k' ? sg(c.ecartV72Patrimoine, 0) + ' (charge économique)' : c.id === 'famille_proprio_400k' ? sg(k72.couple_median_2enf.ecart + c.taxeAvant - c.taxeV72, 0) : c.id === 'fortune_20M' ? sg(c.ecartV72, 0) + ' (' + f(c.reporteAnV72 / 1000, 0) + ' k€/an reportés)' : sg(c.ecartV72, 0);
  log('| ' + c.libelle + ' | ' + f(c.avant, 0) + ' | ' + f(c.apres, 0) + ' | ' + sg(c.ecart, 0) + x + ' | ' + (c.ecartPct === null ? '—' : sg(100 * c.ecartPct, 1) + ' %') + ' | ' + v72 + ' |');
});
log('');
log('**Non confiscatoire ?** Charge totale (fonction des revenus + patrimoine) d\'un rentier pur, sans plafond, en % de son revenu : ' + [[1e6, 0.03], [2e6, 0.03], [3e6, 0.03], [5e6, 0.03], [1e7, 0.03], [1e8, 0.03], [1e7, 0.05], [1e8, 0.05]].map(function (a) { return eur(a[0]) + ' à ' + pc(a[1], 0) + ' : ' + pc(Z.chargeRentier(a[0], a[1]).part, 0); }).join(' ; ') + '. **Sans plafond, la combinaison dépasse 100 % du revenu dès ≈ 5 M€ pour un patrimoine qui rapporte 3 %.** Le plafond annuel de 75 % (avec report) est donc indispensable, et il mord sur ≈ ' + f(ps.menages / 1000, 0) + ' 000 ménages (' + f(ps.excedent) + ' Md€ d\'excédent après érosion, dont la moitié supposée jamais recouvrée, H73.7). Les petits revenus restent protégés par le plafond de 5 % du revenu sous la médiane (paiement différé : ' + f(rc.differe) + ' Md€/an de créances nouvelles, stock ≈ ' + f(12 * rc.differe, 0) + ' Md€ à 12 ans de durée moyenne).');
log('');
log('### 15.7 Taux marginaux effectifs');
var tm = Z.tme();
log('Personne seule (plancher compris) : ' + tm.profil.map(function (p) { return f(p.R, 0) + ' € ' + pc(p.seul); }).join(' ; ') + '. Maximum ' + pc(tm.max.taux) + ' vers ' + f(tm.max.R, 0) + ' € (v7.2 : 70,5 %) ; trappes : ' + tm.trappes.length + '. Sommet : 65,5 % (v7.2 : 65 %) ; bénéfice distribué : IS + fonction = 65,5 %. Patrimoine : taux marginal maximal 2 % par an de la valeur.');
log('');
log('### 15.8 Ce qui reste fragile (à ne pas masquer)');
log('(1) **Le plafond fait la loi au sommet** : avec 65,5 % sur les revenus du capital et jusqu\'à 2 % par an sur la valeur, un patrimoine qui rapporte 3 % paie plus que son revenu dès ≈ 5 M€ ; la « taxe Zucman » continue n\'est tenable qu\'avec le plafond de 75 % et un report dont on ne sait pas quelle part sera recouvrée (H73.7 ⚠️ V15202, V15203). Piste à trancher : imputer sur P(W) l\'impôt déjà payé sur les revenus du capital (logique d\'impôt plancher du projet Zucman) ; non chiffrée. (2) **Les propriétaires d\'un bien de 0,5 à 3 M€ paient beaucoup plus** : 1 M€ → 10 000 €/an (≈ 3,7 fois la taxe foncière moyenne) ; retraités riches en patrimoine et pauvres en revenu : le différé devient massif (stock ≈ ' + f(12 * rc.differe, 0) + ' Md€). (3) **Effet de prix** : le taux effectif sur l\'immobilier passe de 0,27 % à ' + pc(rc.tauxImmo, 2) + ' ; le modèle capitalise ' + pc(rc.effetPrix, 0) + ' sur les prix (central), ce qui pèse sur les ménages endettés et sur les banques ⚠️ V15206. (4) **Recalage × 1,4** : appliqué proportionnellement, il pousse les ménages moyens vers le haut d\'une courbe progressive (recette probablement surestimée au milieu, sous-estimée en haut ; queue au-delà de ≈ 30 M€ absente) ⚠️ V15205, V15106. (5) **Érosion à 2 %** : la loi exponentielle donne 59 % d\'érosion du capital mobile du 1 % au central (90 % au défavorable) ; les preuves (Danemark, Suisse : ≈ 30 % pour un point) disent que le 40 % à 1 % est déjà un peu pessimiste ⚠️ V15200. (6) **« Ne pas taxer plus au global »** : la v7.3 prélève ≈ 1 point de PIB de plus que la v7.2 ; c\'est le montant qui stabilise la dette (règle de l\'auteur : la dette d\'abord), pas une hausse cachée.');
log('');
log('### 15.9 Si l\'auteur adopte : lignes à changer dans le bilan global (document de travail non publié, section 0), sans rien toucher avant sa décision');
var e2 = Y.ecart('central'), e3 = Z.ecart('central'), p2 = Y.prelevementsDepenses('central'), p3 = Z.prelevementsDepenses('central'), l2 = e2.lignesPatrimoine, l3b = e3.lignesPatrimoine;
log('| N° | Poste (écart à la v5.10, Md€, central) | v7.2 | v7.3 |'); log('|---|---|---|---|');
[['F01', 'Fonction des revenus (T(R), capital des retraités compris)', p2.dT + e2.retraitesCapital, p3.dT + e3.retraitesCapital],
 ['F02', 'IS unique à 25 %', e2.is, e3.is], ['F03', 'Retenue à la source', e2.retenue, e3.retenue],
 ['F05', 'Fonction du patrimoine (recette ' + f(l2.recetteTaxe, 2) + ' → ' + f(l3b.recetteTaxe, 2) + ')', l2.taxeAnnuelle, l3b.taxeAnnuelle],
 ['F09', 'Plafonds (v7.3 : plafond de 75 % au sommet, H73.7)', l2.plafonds, l3b.plafonds], ['F11', 'Trusts', l2.trusts, l3b.trusts], ['F12', 'SCI', l2.sci, l3b.sci],
 ['F20', 'Versement B(0) = 412,5 €', p2.socle, p3.socle], ['F21', 'Majoration par enfant', p2.enfants, p3.enfants], ['F22', 'Plancher', p2.plancher, p3.plancher],
 ['', '**Effet sur le solde**', e2.total, e3.total], ['', '**Solde de croisière 2060**', Y.solde('central', 2060), Z.solde('central', 2060)]].forEach(function (r) { log('| ' + r[0] + ' | ' + r[1] + ' | ' + sg(r[2], 2) + ' | ' + sg(r[3], 2) + ' |'); });
log('');
log('À reprendre aussi : l\'« En une minute » (deux formules, recette, solde, prélèvements obligatoires ' + pc(po.pct) + ' / nets ' + pc(po.pctNet) + ', dette et économies) ; le tableau 0.2 (15.5 ci-dessus) ; le tableau 0.3 (solde année par année : 15.4) ; le tableau 0.4 (collectivités : la fonction du patrimoine, ' + f(rc.nette) + ' Md€, couvre désormais toutes les ressources supprimées du bloc communal, 55,4 Md€, et laisse ' + f(rc.nette - 55.37) + ' Md€ à l\'État ; départements 1,01 %, régions 0,016 %, autorités de la mobilité 1,25 % de T(R)) ; la ligne N07/F05 du registre des propositions ; `sources/calculs/bilan_global.py` (dictionnaire V72 → V73, export à écrire sur le modèle de `export_bilan_v72.js`) ; la présentation du système en une page (document de travail non publié).');
