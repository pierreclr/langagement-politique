// Rapport de la v7.4 PROPOSÉE (decisions_0611_v74.js) : produit la section 16 de sources/bareme-deux-fonctions-v7.md (Markdown). Même liste de chargement que test_decisions_0611_v74.js,
// en remplaçant le fichier de test par rapport_decisions_0611_v74.js.
var A = this.Decisions0611V74, Z = this.Decisions0611V73, Y = this.Decisions0611V72;
var log = (typeof print === 'function') ? print : console.log;
function f(x, n) { if (x === null || x === undefined || isNaN(x)) return '—'; var d = n === undefined ? 1 : n, s = Math.abs(x).toFixed(d).replace('.', ','); s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return (x < 0 && Math.abs(x) >= Math.pow(10, -d) / 2 ? '−' : '') + s; }
function sg(x, n) { return (x > 0.0000001 ? '+' : '') + f(x, n); }
function pc(x, n) { return x === null ? '—' : f(100 * x, n === undefined ? 1 : n) + ' %'; }
function eur(W) { return W >= 1e9 ? f(W / 1e9, 0) + ' Md€' : W >= 1e6 ? f(W / 1e6, 0) + ' M€' : f(W / 1e3, 0) + ' k€'; }
var SCN = { bas: 'favorable', central: 'central', haut: 'défavorable' };

// ---------- mesures, variante A d'abord (puis retour à B, recommandée)
A.variante('A');
var VA = { rc: A.recettePatrimoine('central'), gain: A.gainPatrimoineVsV73('central'), formule: A.formule(), ct: A.casTypesRevenus(), po: A.prelevementsObligatoires(), tr: A.tresorerie(),
           cas: A.casLimitesObjet(), marge: A.marge(), tme: A.tme().max.taux, sansPl: A.recettePatrimoine('central', { plancher: false }).nette, optRP: A.recettePatrimoine('central', { optRP: true }).nette };
A.variante('B');
var rc = A.recettePatrimoine('central'), R3 = { bas: A.recettePatrimoine('bas'), central: rc, haut: A.recettePatrimoine('haut') }, tr = A.tresorerie(), po = A.prelevementsObligatoires(), cb = A.combinaison();
var cas = A.casLimitesObjet(), ct = A.casTypesRevenus(), z3 = Z.recettePatrimoine('central'), ps3 = Z.plafondSommet('central');
var sansPl = A.recettePatrimoine('central', { plancher: false }).nette, optRP = A.recettePatrimoine('central', { optRP: true }).nette;

log('## 16. v7.4 proposée (06/11/2026, nuit, NON ADOPTÉE) : impôt plancher, paiement plafonné au revenu, différé garanti');
log('');
log('**Ce que cette section fait.** Elle corrige les trois défauts de la v7.3 (15.8) en suivant les retours de l\'auteur du 06/11 au soir : (1) la résidence principale reste sur la courbe principale (« 10 000 €/an pour une résidence de 1 M€, c\'est acceptable ») ; un allègement léger jusqu\'à 300 000 € est chiffré en option seulement ; (2) **impôt plancher à la Zucman** : on déduit de la taxe du patrimoine la contribution déjà payée sur les revenus du capital ; (3) **garde-fous min/max** : ce qu\'on paie dans l\'année est plafonné par une fraction du revenu net, le reste est différé jusqu\'à la vente ou à la succession ; (4) **tous les cas limites** sont calculés avant de proposer la formule (16.6). Module `modeles/systeme-ideal/decisions_0611_v74.js`, test `test_decisions_0611_v74.js` (40 vérifications), ce texte par `rapport_decisions_0611_v74.js`. Tout le reste est la v7.3 (et donc la v7.2). Euros de 2025 ; ordres de grandeur sous hypothèses (H74.x), pas des prédictions.');
log('');
log('### 16.0 En une page');
log('- **La formule, en quatre lignes** [B/C] :');
log('  1. **P(W) = 2 % × W² / (W + 700 k€)**, soit un taux moyen τ(W) = 2 % × W / (W + 700 k€), sur la valeur nette, résidence principale comprise ; biens professionnels, terres exploitées et forêts gérées comptés à leur **valeur de rendement** ; jeunes entreprises à leur valeur substantielle jusqu\'à la première liquidité.');
log('  2. **Impôt plancher : P\' = max(0, P(W) − C_k)**, où C_k est la contribution personnelle déjà payée sur les revenus du capital. Pour un rentier, cela revient à payer **le plus élevé des deux** : la contribution sur ses revenus ou la taxe du patrimoine.');
log('  3. **Payé dans l\'année = min(P\', max(x(N) × N, 2 % × A))**, avec N le revenu net du foyer, **x(N) = 50 % × N / (N + 72 000 €)** (8 % à 1 200 €/mois, 12,5 % à 2 000 €, 25 % à 6 000 €) et A les actifs mobilisables : titres cotés, fonds, cryptoactifs, holdings passives.');
log('  4. **Le reste est différé** : c\'est une créance garantie sur le bien, qui porte intérêt au taux d\'emprunt de l\'État et devient exigible à la vente, à la donation ou à la succession (le conjoint survivant garde le report). Elle est sans recours au-delà de la valeur du bien. **Le plafond de 75 % de la v7.3 est supprimé.**');
log('- **Pourquoi K = 700 000 € et non 1 M€** [B, décision de Claude, à valider] : l\'impôt plancher coûte ≈ 15 Md€ par rapport à la v7.3 (il retire ' + pc(rc.partDeduite, 0) + ' du dû brut). Pour garder la dette stable, il faut les reprendre quelque part. Avec K = 700 000 €, on les reprend sur le patrimoine qui ne rapporte pas (surtout l\'immobilier) et **la fonction des revenus redevient exactement celle de la v7.2** (cadre à 10 000 € brut : −3,5 %). Avec K = 1 M€ (variante A), il faut resserrer la fonction des revenus : **' + VA.formule.replace(/\./g, ',') + '**, et le cadre à 10 000 € brut tombe à ' + pc(VA.ct.filter(function (c) { return c.id === 'cadre_10000'; })[0].ecartPct) + ', hors de la cible validée.');
log('- **Recette** [B] : **' + f(rc.nette) + ' Md€** au central (' + f(R3.bas.nette) + ' favorable, ' + f(R3.haut.nette) + ' défavorable) ; v7.3 ' + f(z3.nette) + ' Md€, mais celle-ci perdait encore ' + f(ps3.perte) + ' Md€ au plafond de 75 % ; volet patrimoine ' + sg(A.gainPatrimoineVsV73('central')) + ' Md€ par rapport à la v7.3, compensé par la fonction des revenus de la v7.2 (surplus ' + f(A.surplus('central')) + ' au lieu de ' + f(Z.surplus('central')) + ').');
log('- **Dépassement de 100 % du revenu** [B] : **il disparaît sans plafond** pour tout patrimoine qui rapporte : avec un rendement de 3 %, la charge totale est de ' + pc(A.chargeRentier(5e6, 0.03).part, 0) + ' à 5 M€ et de ' + pc(A.chargeRentier(1e8, 0.03).part, 0) + ' à 100 M€ (v7.3 sans plafond : 100 % et 120 %). Il ne subsiste que pour un patrimoine **mobilisable qui ne rapporte presque rien** (titres qui ne distribuent pas, cryptoactifs) : c\'est la cible voulue de l\'impôt plancher, car le rendement y prend la forme de plus-values latentes.');
log('- **Dette** [B] : avec la combinaison recommandée, **dette stable en macro de référence** (dette à 30 ans ' + pc(cb.dette.reference.r30) + ', marge ' + f(A.marge()) + ' Md€/an) ; il manque ' + f(cb.manque.prudente) + ' Md€/an en macro prudente (v7.3 : 28,3).');
log('- **Prélèvements obligatoires** [B] : ' + pc(po.pct) + ' du PIB (v7.3 ' + pc(po.v73Pct) + ', v7.2 ' + pc(po.v72Pct) + ', aujourd\'hui ' + pc(po.avantPct) + '). **Ils ne peuvent pas redescendre au niveau de la v7.2 sans rouvrir le manque de la dette** : stabiliser la dette coûte ≈ 30 Md€ de recettes, et le plancher ne fait que changer qui les paie.');
log('- **Différé** [B] : ' + f(tr.flux) + ' Md€/an de créances nouvelles, ' + f(tr.menages / 1e6, 2) + ' millions de ménages, **encours ≈ ' + f(tr.encours, 0) + ' Md€ (' + pc(tr.encoursPctPib) + ' du PIB)**. Le coût est nul pour l\'État puisque les intérêts sont facturés à son propre taux ; les pertes atteignent ' + f(tr.perte, 2) + ' Md€/an. En revanche, la dette brute (dette de Maastricht) porte cet encours, que compense une créance garantie : voir 16.5.');
log('- **Immobilier** [B] : effet de prix ' + pc(rc.effetPrix) + ' au central (v7.3 ' + pc(z3.effetPrix) + ').');
log('- **Recommandation** : **v7.4 variante B plutôt que v7.3.** Elle supprime le plafond de 75 % et son report incertain, elle ferme la brèche des holdings qui ne distribuent pas (la v7.3 faisait payer 10 500 € par an à une holding de 20 M€), elle protège le retraité dans sa grande maison sans vente forcée et elle laisse inchangée la fonction des revenus de la v7.2. Elle a un prix : la résidence de 1 M€ paie 11 765 € au lieu de 10 000, celle de 300 000 € paie 1 800 € au lieu de 1 385 (toujours moins que les 2 650 € de Grenoble aujourd\'hui), et la dette brute porte ≈ 5 points de créances garanties.');
log('');

log('### 16.1 La fonction du patrimoine [B]');
log('');
log('| W (valeur nette) | taux moyen | taxe annuelle (dû brut P) | taux marginal | option RP (−100 k€) | v7.3 | droit actuel (repère) |'); log('|---|---|---|---|---|---|---|');
var rep = { 1e5: 'TF ≈ 270 €', 3e5: 'TF ≈ 810 € (Grenoble 2 650 €)', 1e6: 'TF ≈ 2 700 € (montant rapporté, non vérifié : ≈ 5 000 € à Paris)', 3e6: 'TF + IFI ≈ 8 100 + 9 600 €', 1e7: 'IFI ≈ 87 000 € (hors biens professionnels)', 1e8: 'IFI ≈ 1,4 M€ si tout immobilier', 1e9: '—' };
A.tablePatrimoine().forEach(function (l) { log('| ' + eur(l.W) + ' | ' + pc(l.tauxMoyen, 2) + ' | ' + f(l.taxe, 0) + ' € | ' + pc(l.marginal, 2) + ' | ' + f(l.rpOption, 0) + ' € (' + pc(l.rpOptionTaux, 2) + ') | ' + f(Z.Tp(l.W), 0) + ' € | ' + rep[l.W] + ' |'); });
log('');
log('Lecture : la colonne « dû brut » vaut pour un patrimoine qui ne rapporte rien, une résidence principale par exemple, ou une holding qui ne distribue pas. Pour un patrimoine qui rapporte, on en retire la contribution déjà payée sur ses revenus (16.2). La « RP » et l\'« autre patrimoine » suivent la même courbe, comme l\'auteur l\'a demandé ; ils ne diffèrent que sur deux points : seule la RP peut recevoir l\'option, et seul l\'autre patrimoine ouvre l\'imputation (une RP ne verse pas de revenu). **Option RP** (abattement de 100 000 € sur la résidence principale : 0,30 % au lieu de 0,60 % à 300 000 €) : recette ' + f(optRP) + ' Md€ au lieu de ' + f(rc.nette) + ', soit **' + f(rc.nette - optRP) + ' Md€ à retrouver** ailleurs ; non recommandée. Aux repères de l\'auteur (≈ 0,5 % à 300 000 €, 1 % à 1 M€), la variante B ajoute 0,1 et 0,18 point.');
log('');

log('### 16.2 Impôt plancher : effet sur la recette, le report et l\'exil [B]');
log('Même chaîne que la v7.3 : population HVP recalée × 1,4, érosion ménage par ménage selon la loi exponentielle, exil (20 / 74 de l\'érosion, 2,2 %/an d\'autres impôts), gestion. Trois nouveautés : (a) le dû de chaque ménage est P\' et non plus P. Les loyers de l\'immobilier hors résidence principale y sont comptés au rendement net de `taxe_patrimoine.js`, les distributions des parts à 1,5 / 2 / 3 % (H74.2) ; la contribution est imputée au prorata des revenus du capital, d\'après une loi jointe revenu × patrimoine reconstituée (H74.4) ; (b) la règle de paiement (c) remplace le différé forfaitaire et le plafond de 75 % ; (c) les terres sont comptées à leur valeur de rendement (× 0,5, H74.7). Contrôle : à 1 % plat, sans les nouveautés, on retrouve exactement `taxe_patrimoine.js`.');
log('');
log('| Md€/an | favorable | central | défavorable |'); log('|---|---|---|---|');
function l3(lib, fn) { log('| ' + lib + ' | ' + ['bas', 'central', 'haut'].map(function (s) { return fn(s); }).join(' | ') + ' |'); }
l3('taux moyen avant plancher → après', function (s) { return pc(R3[s].tauxAvantPlancher, 2) + ' → ' + pc(R3[s].tauxEffectif, 2); });
l3('part du dû retirée par le plancher', function (s) { return pc(R3[s].partDeduite, 0); });
l3('taux effectif sur l\'immobilier ; effet de prix', function (s) { return pc(R3[s].tauxImmo, 2) + ' ; ' + pc(R3[s].effetPrix); });
l3('érosion du capital mobile : 1 % / reste (v7.3 central 59 % / 15 %)', function (s) { return pc(R3[s].erosionTop, 0) + ' / ' + pc(R3[s].erosionReste, 0); });
l3('recette brute', function (s) { return f(R3[s].brute); });
l3('exil (autres impôts perdus ; v7.3 central −4,1)', function (s) { return '−' + f(R3[s].exil, 2); });
l3('gestion ; différé non recouvré', function (s) { return '−' + f(R3[s].gestion, 2) + ' ; −' + f(R3[s].perteDiffere, 2); });
l3('**recette nette**', function (s) { return '**' + f(R3[s].nette) + '**'; });
l3('différé de l\'année (recouvré plus tard)', function (s) { return f(R3[s].differe); });
log('');
log('Comparaisons (central) : même courbe sans plancher ' + f(sansPl) + ' Md€ ; variante A (K = 1 M€) ' + f(VA.rc.nette) + ' Md€ (plancher ' + pc(VA.rc.partDeduite, 0) + ', sans plancher ' + f(VA.sansPl) + ') ; v7.3 ' + f(z3.nette) + ' Md€, dont ' + f(ps3.perte) + ' perdus au plafond de 75 % ; impôts remplacés 61,7 Md€. **Report** : le plafond de 75 % et ses ' + f(ps3.excedent) + ' Md€ d\'excédent reporté chaque année (dont la moitié supposée perdue) disparaissent ; le différé de la règle (c) le remplace, porte intérêt et est garanti par le bien. **Exil** : l\'érosion du capital mobile du 1 % passe de 59 % à ' + pc(rc.erosionTop, 0) + ' au central et les impôts perdus par l\'exil de 4,1 à ' + f(rc.exil, 1) + ' Md€/an, car le plancher baisse le taux effectif sur le patrimoine qui rapporte, le plus mobile.');
log('');

log('### 16.3 Fonction des revenus [B]');
log('Variante B : **B(R) = 412,5 + 675 × (1 − e^(−R/1 500)) − 0,65 × R**, la fonction de la v7.2. La recherche sur grille (`calibrer()`, mêmes contraintes que la v7.3 : bas revenus +20 à +80 €, rentier perdant revenus et patrimoine compris, TME ≤ 75 %, recette au plus près du besoin de la dette) la retrouve d\'elle-même. Taux marginal de 20 % au premier euro à 65 % au sommet ; TME maximal ' + pc(A.tme().max.taux) + ' ; aucune trappe. Variante A : ' + VA.formule.replace(/\./g, ',') + ' ; TME maximal ' + pc(VA.tme) + '.');
log('');
log('| cas (€/mois) | aujourd\'hui | v7.4 B | écart | % | v7.3 : écart | v7.4 A : écart |'); log('|---|---|---|---|---|---|---|');
ct.forEach(function (c, i) { var a = VA.ct[i]; log('| ' + c.libelle + ' | ' + f(c.avant, 0) + ' | ' + f(c.apres, 0) + ' | ' + sg(c.ecart, 0) + ' | ' + sg(100 * c.ecartPct, 1) + ' % | ' + sg(c.ecartV73, 0) + ' | ' + sg(a.ecart, 0) + ' (' + sg(100 * a.ecartPct, 1) + ' %) |'); });
log('');

log('### 16.4 Cas types demandés (volet patrimoine, €/an)');
log('« Payé » = ce qui sort dans l\'année ; « différé » = créance garantie, exigible à la vente ou à la succession. v7.3 : dû P(W), payé après le plafond de 5 % sous la médiane ou de 75 % au-dessus. Droit actuel : taxe foncière (0,27 % de la valeur sauf mention) et IFI.');
log('');
log('| cas | dû brut P | déduit (plancher) | payé | différé | payé / revenu net | v7.3 : payé (reporté) | v7.4 A : payé (différé) | aujourd\'hui |'); log('|---|---|---|---|---|---|---|---|---|');
function ligneCas(id, avecA) { var c = cas[id], v = c.v74, a = VA.cas[id] ? VA.cas[id].v74 : null;
  log('| ' + c.libelle + ' | ' + f(v.P, 0) + ' | ' + f(v.P - v.Pprime, 0) + ' | **' + f(v.paye, 0) + '** | ' + f(v.differe, 0) + ' | ' + (v.partRevenu === null ? '—' : v.partRevenu > 10 ? '≫ 100 % (distribution ou titres)' : pc(v.partRevenu, 0)) + ' | ' + f(c.v73.paye, 0) + ' (' + f(c.v73.differe, 0) + ') | ' + (avecA && a ? f(a.paye, 0) + ' (' + f(a.differe, 0) + ')' : '—') + ' | ' + f(c.aujourdhui, 0) + ' |'); }
['grenoble_300k', 'rp_1M', 'actions_5M', 'holding_20M_cotee', 'rentier_2M', 'retraite_proprio_500k'].forEach(function (id) { ligneCas(id, true); });
log('');
log('Lecture : le rentier à 2 M€ (5 000 €/mois de dividendes) paie ' + f(cas.rentier_2M.v74.Ck, 0) + ' €/an sur ses revenus, que le plancher déduit de son dû de ' + f(cas.rentier_2M.v74.P, 0) + ' € ; il lui reste ' + f(cas.rentier_2M.v74.Pprime, 0) + ' €/an de taxe, soit une charge totale de ' + pc(cas.rentier_2M.v74.chargeTotalePct, 0) + ' de son revenu (v7.3 : 75 %, plafond atteint). Il perd encore ' + f((cas.rentier_2M.v74.chargeTotalePct * cas.rentier_2M.v74.revenuRecu - 0.314 * 60000) / 12, 0) + ' €/mois par rapport au PFU actuel : « le rentier ne gagne pas » reste vrai. Le retraité à 1 200 €/mois dans une maison de 500 000 € paie ' + f(cas.retraite_proprio_500k.v74.paye, 0) + ' €/an, soit ' + pc(cas.retraite_proprio_500k.v74.x, 1) + ' de son revenu net (taxe foncière actuelle : 1 350 €) ; il diffère ' + f(cas.retraite_proprio_500k.v74.differe, 0) + ' €/an, et au bout de 20 ans sa créance représente ' + pc(cas.retraite_proprio_500k.v74.creance20Pct, 0) + ' de la valeur de sa maison.');
log('');

log('### 16.5 Différé : ce qu\'il coûte en trésorerie [B]');
log('| | central | variante A |'); log('|---|---|---|');
log('| créances nouvelles (Md€/an) | ' + f(tr.flux) + ' | ' + f(VA.tr.flux) + ' |');
log('| ménages qui diffèrent une partie | ' + f(tr.menages / 1e6, 2) + ' millions | ' + f(VA.tr.menages / 1e6, 2) + ' millions |');
log('| encours en croisière (durée moyenne 12 ans) | ' + f(tr.encours, 0) + ' Md€ (' + pc(tr.encoursPctPib) + ' du PIB) | ' + f(VA.tr.encours, 0) + ' Md€ (' + pc(VA.tr.encoursPctPib) + ') |');
log('| coût annuel pour l\'État (intérêts au taux de l\'État) | 0 | 0 |');
log('| coût si aucun intérêt sous la médiane (non retenu) | ' + f(tr.coutSiSansInteretSousMediane, 2) + ' Md€/an | ' + f(VA.tr.coutSiSansInteretSousMediane, 2) + ' Md€/an |');
log('| pertes (5 % non recouvrés, déjà retirées de la recette) | ' + f(tr.perte, 2) + ' Md€/an | ' + f(VA.tr.perte, 2) + ' Md€/an |');
log('');
log('**Ce qu\'il faut dire sans détour.** La recette compte le différé au moment où il est dû, comme la v7.3 le faisait pour son propre différé (6,7 Md€/an, encours ≈ 80 Md€). En caisse, l\'État avance cet encours pendant la montée en charge, qui dure à peu près douze ans : la dette brute au sens de Maastricht monte alors d\'environ ' + f(100 * tr.encoursPctPib, 0) + ' points de PIB. En face, l\'État détient une créance garantie par une hypothèque légale ou un nantissement et rémunérée à son propre taux d\'emprunt, si bien que sa dette nette ne bouge pas ⚠️ V15308 (traitement en comptabilité nationale à confirmer). Réduire l\'encours coûte cher aux ménages modestes : avec x(N) = 30 % × N / (N + 48 000 €), les créances nouvelles montent à ≈ 17 Md€/an ; il faudrait monter x pour les faire baisser, et le retraité paierait alors davantage. **Recommandation** : garder 50 % / 72 000 €, et réserver le différé aux résidents, à leurs biens non mobilisables (logement, terres, biens professionnels, œuvres d\'art).');
log('');

log('### 16.6 Cas limites (liste de l\'auteur), avant la formule finale (€/an)');
log('Hypothèses de chaque cas dans son libellé (illustratives ⚠️ V15306). « Créance à 20 ans » : différé cumulé avec intérêts réels de 1,3 %, en % de la valeur retenue.');
log('');
log('| cas | dû brut | déduit | payé | différé | payé / revenu net | créance à 20 ans | v7.3 : payé (reporté) | aujourd\'hui | aberration ? |'); log('|---|---|---|---|---|---|---|---|---|---|');
var VERDICT = {
  retraite_grande_maison: 'Non : il paie à peu près sa taxe foncière actuelle et garde sa maison ; la créance est réglée à la succession.',
  heritier_sans_revenu: 'Tension : sans revenu, il diffère presque tout ; après 40 ans, la créance approcherait 80 % du bien. Garde-fou : alerte à 50 % de la valeur, puis vente ou viager hypothécaire proposés, sans vente forcée.',
  agriculteur: 'Non avec la valeur de rendement ; oui sans elle (31 000 €/an dus sur 30 000 € de revenu).',
  viticulteur: 'Limite : même à la valeur de rendement, la créance atteint 29 % de cette valeur au bout de 20 ans (12 % de la valeur vénale), réglée à la transmission. Piste : retirer de la valeur de rendement la rémunération du travail de l\'exploitant (⚠️ V15307).',
  chef_entreprise: 'Tension voulue : le plancher mord sur l\'outil de travail qui distribue peu (155 000 €/an dus). Sorties : distribuer (chaque euro distribué réduit le plancher) ou payer en titres ; sinon la créance atteint 29 % de la société à 20 ans.',
  startup: 'Oui à la valeur du dernier tour (586 000 €/an dus sans un euro de liquidité) ; non à la valeur substantielle, jusqu\'à la première liquidité.',
  jeune_endette: 'Non (valeur nette). À l\'inverse, il paie moins qu\'aujourd\'hui ; dettes déductibles seulement si elles financent des biens taxés (règle de l\'art. 974 du CGI).',
  coproprietaire: 'Non : chacun est imposé sur sa quote-part.',
  indivisaire: 'Tension : il paie sur une part qui ne lui rapporte rien. Correctif : l\'indemnité d\'occupation due par l\'occupant (art. 815-9 du Code civil) devient un revenu, que le plancher impute.',
  etranger: 'Non : l\'impôt étranger est imputé. Le contrôle des biens immobiliers à l\'étranger, sans échange automatique, reste le point faible.',
  crypto: 'Voulu, mais lourd : mobilisable, donc tout est payé (144 % du revenu net) en vendant ≈ 1,6 %/an des cryptoactifs. Garde-fou : évaluation sur la valeur moyenne de l\'année, pas au 1er janvier.',
  art: 'Non, sans être idéal : le différé porte intérêt et se règle à la succession, la dation en œuvres étant possible (art. 1716 bis du CGI). Valeur déclarée sous droit de préemption de l\'État.',
  foret: 'Non avec la valeur de rendement ; à la valeur vénale, 3 600 €/an pour 5 000 € de revenu.',
  non_resident: 'Non sur le calcul. Le risque est juridique : réserver le différé aux résidents peut heurter la libre circulation des capitaux (art. 63 du TFUE) ⚠️ V15309.',
  fractionnement_parent: 'Non : voir la ligne suivante.',
  fractionnement_enfant: 'Non : la donation baisse la taxe annuelle totale de 52 000 à 3 × 12 900 €, mais coûte des droits de donation de l\'ordre du million par enfant. Enfants mineurs rattachés au foyer, usufruitier imposé sur la pleine propriété.',
  grenoble_300k: 'Non.', rp_1M: 'Non (jugé acceptable par l\'auteur).', actions_5M: 'Non : plus de dépassement.', holding_20M_cotee: 'Non : elle paie le plancher, en distribuant ou en titres.',
  holding_20M_familiale: 'Comme la précédente : parts non cotées où le foyer n\'exerce pas, donc mobilisables (paiement en titres).', rentier_2M: 'Non.', retraite_proprio_500k: 'Non.'
};
['retraite_grande_maison', 'heritier_sans_revenu', 'agriculteur', 'viticulteur', 'chef_entreprise', 'startup', 'holding_20M_familiale', 'jeune_endette', 'coproprietaire', 'indivisaire', 'etranger', 'crypto', 'art', 'foret', 'non_resident', 'fractionnement_parent', 'fractionnement_enfant'].forEach(function (id) {
  var c = cas[id], v = c.v74, sr = c.sansRendement;
  log('| ' + c.libelle + ' | ' + f(v.P, 0) + ' | ' + f(v.P - v.Pprime, 0) + ' | **' + f(v.paye, 0) + '** | ' + f(v.differe, 0) + (sr ? ' (sans valeur de rendement : ' + f(sr.paye, 0) + ' payé, ' + f(sr.differe, 0) + ' différé)' : '') + ' | ' + (v.partRevenu === null ? '—' : v.partRevenu > 10 ? '≫ 100 % (distribution ou titres)' : pc(v.partRevenu, 0)) + ' | ' + pc(v.creance20Pct, 0) + ' | ' + f(c.v73.paye, 0) + ' (' + f(c.v73.differe, 0) + ') | ' + f(c.aujourdhui, 0) + ' | ' + VERDICT[id] + ' |');
});
log('');
log('**Bilan des cas limites.** Les aberrations franches viennent toutes de l\'**évaluation**, pas de la courbe : une start-up comptée à la valeur de son dernier tour, des terres ou des forêts comptées à leur valeur vénale. La valeur de rendement et la valeur substantielle les suppriment ; c\'est la pratique suisse ⚠️ V15304. Les cas de liquidité (retraité dans une grande maison, héritier sans revenu, agriculteur) sont réglés par la règle (c) et le différé garanti, sans vente forcée. Restent trois **tensions assumées**, à trancher par l\'auteur : (1) le chef d\'entreprise qui distribue peu paie le plancher sur sa société (c\'est le sens même d\'un impôt à la Zucman, mais l\'IFI exonère aujourd\'hui les biens professionnels) ; (2) l\'héritier sans revenu dont la créance grossit pendant des décennies ; (3) les cryptoactifs et titres qui ne distribuent pas, imposés au-delà du revenu déclaré.');
log('');

log('### 16.7 Écart, solde, dette, prélèvements (variante B)');
log('| Md€/an | favorable | central | défavorable |'); log('|---|---|---|---|');
l3('surplus de la fonction des revenus au droit actuel', function (s) { return sg(A.surplus(s), 2); });
l3('volet patrimoine / v5.10', function (s) { return sg(A.lignesPatrimoine(s).total, 2); });
l3('**écart total à la v5.10** (v7.3)', function (s) { return '**' + sg(A.ecart(s).total, 2) + '** (' + sg(Z.ecart(s).total, 2) + ')'; });
l3('**solde de croisière 2060** (v7.3)', function (s) { return '**' + sg(A.solde(s, 2060)) + '** (' + sg(Z.solde(s, 2060)) + ')'; });
log('');
log('Solde année par année (central) : ' + [2029, 2030, 2035, 2041, 2050, 2060, 2070].map(function (y) { return y + ' ' + f(A.solde('central', y)); }).join(' ; ') + '. Prélèvements obligatoires bruts ' + pc(po.pct) + ' du PIB, nets des transferts ' + pc(po.pctNet) + ' (variante A : ' + pc(VA.po.pct) + ').');
log('');
var d = A.dette();
log('| macro | fin 2028 | 10 ans | 20 ans | 30 ans | économies pour une dette stable | avec R1f + M1m + M2m + M3 : 10 / 20 / 30 ans ; manque |'); log('|---|---|---|---|---|---|---|');
A.MACROS.forEach(function (m) { var j = d[m].central, c = cb.dette[m];
  log('| ' + m + ' | ' + pc(j.r0) + ' | ' + pc(j.r10) + ' | ' + pc(j.r20) + ' | ' + pc(j.r30) + ' | ' + f(A.economiesPourStabiliser('central', m)) + ' | ' + pc(c.r10) + ' / ' + pc(c.r20) + ' / ' + pc(c.r30) + ' ; **' + f(cb.manque[m]) + '** |'); });
log('');

log('### 16.8 Taux marginaux');
log('Fonction des revenus : ceux de la v7.2 (maximum ' + pc(A.tme().max.taux) + ' vers ' + f(A.tme().max.R, 0) + ' €, sommet 65 %, aucune trappe). Patrimoine : taux marginal de 0 au premier euro à 2 %, sans jamais l\'atteindre (' + pc(A.mp(3e5), 2) + ' à 300 000 €, ' + pc(A.mp(1e6), 2) + ' à 1 M€). Le plancher crée un **taux marginal implicite sur les revenus du capital** : tant qu\'un patrimoine paie le plancher (P > C_k), chaque euro de dividende supplémentaire réduit d\'autant la taxe du patrimoine. Distribuer ne coûte alors rien de plus, ce qui est voulu : l\'impôt plancher pousse à distribuer ou à vendre ce qui dort. Règle de paiement : x(N) monte doucement, de ' + pc(A.xN(12 * 1200), 1) + ' à 1 200 €/mois à ' + pc(A.xN(12 * 6000), 1) + ' à 6 000 € ; elle ne crée aucune marche.');
log('');

log('### 16.9 v7.3 ou v7.4 ? Recommandation');
log('| critère | v7.3 | v7.4 A (K = 1 M€) | **v7.4 B (K = 700 k€)** |'); log('|---|---|---|---|');
log('| dépassement de 100 % du revenu | oui dès ≈ 5 M€ (plafond de 75 % + report) | non pour un patrimoine qui rapporte | non pour un patrimoine qui rapporte |');
log('| holding de 20 M€ qui ne distribue rien | paie 10 500 €/an, reporte 370 000 € | paie 380 952 € | paie ' + f(cas.holding_20M_cotee.v74.paye, 0) + ' € |');
log('| retraité modeste, grande maison (1,2 M€) | paie 1 080 €, diffère 12 011 € | paie ' + f(VA.cas.retraite_grande_maison.v74.paye, 0) + ' €, diffère ' + f(VA.cas.retraite_grande_maison.v74.differe, 0) + ' € | paie ' + f(cas.retraite_grande_maison.v74.paye, 0) + ' €, diffère ' + f(cas.retraite_grande_maison.v74.differe, 0) + ' € |');
log('| résidence de 300 000 € / 1 M€ | 1 385 / 10 000 € | 1 385 / 10 000 € | 1 800 / 11 765 € |');
log('| recette du patrimoine (central) | ' + f(z3.nette) + ' (− ' + f(ps3.perte) + ' au plafond) | ' + f(VA.rc.nette) + ' | ' + f(rc.nette) + ' |');
log('| fonction des revenus ; cadre à 10 000 € brut | v7.3 allégée ; −2,9 % | resserrée ; ' + pc(VA.ct.filter(function (c) { return c.id === 'cadre_10000'; })[0].ecartPct) + ' | v7.2 ; −3,5 % |');
log('| dette stable (référence, combinaison) | oui | oui | oui |');
log('| prélèvements obligatoires | ' + pc(po.v73Pct) + ' | ' + pc(VA.po.pct) + ' | ' + pc(po.pct) + ' |');
log('| effet de prix immobilier (central) | ' + pc(z3.effetPrix) + ' | ' + pc(VA.rc.effetPrix) + ' | ' + pc(rc.effetPrix) + ' |');
log('| encours de différé | ≈ 80 Md€ | ' + f(VA.tr.encours, 0) + ' Md€ | ' + f(tr.encours, 0) + ' Md€ |');
log('');
log('**Recommandation de Claude : la v7.4 B.** Trois raisons. (1) Elle remplace un plafond de 75 % dont on ne sait pas quelle part serait recouvrée par une règle qui se lit en une ligne : on paie le plus élevé des deux, contribution sur ses revenus ou taxe sur son patrimoine. (2) Elle ferme la brèche que la v7.3 laissait au sommet, la holding qui ne distribue pas. (3) Elle garde intacte la fonction des revenus de la v7.2, que l\'auteur a déjà validée. **Ce qu\'elle coûte, à ne pas masquer** : la classe moyenne propriétaire paie un peu plus que dans la v7.3 (+415 €/an à 300 000 €, +1 765 €/an à 1 M€), parce que le plancher allège le capital qui rapporte et que la dette impose de reprendre ces milliards ailleurs ; c\'est l\'arbitrage plancher contre rente immobilière. Si l\'auteur tient à « 1 % à 1 M€ », la variante A fait payer la même somme aux cadres (−5,5 % à 10 000 € brut).');
log('');

log('### 16.10 Ce qui reste fragile');
log('(1) **Loi jointe revenu × patrimoine reconstituée** (H74.4) : le plancher et le différé dépendent de qui a quels revenus. La forme HVP mise à l\'échelle par quartile de niveau de vie est une approximation, et les revenus par quartile sont des ordres de grandeur ⚠️ V15302. (2) **Taux de distribution du capital** (1,5 / 2 / 3 %) : il décide de la part que le plancher retire (35 à 44 %) ⚠️ V15301. (3) **Encours du différé** (≈ 5 points de PIB de dette brute) et son traitement en comptabilité nationale ⚠️ V15308. (4) **Valeur de rendement** : elle évite les aberrations, mais crée une frontière entre biens professionnels et biens passifs, qu\'il faut garder contre l\'optimisation (c\'est le contentieux classique des biens professionnels à l\'IFI) ⚠️ V15304. (5) **Non-résidents** (droit de l\'UE) ⚠️ V15309. (6) **Imputation de l\'IS** : non retenue, comme dans la proposition de loi « Zucman » ⚠️ V15300 ; l\'imputer ferait nettement baisser la recette (non chiffré dans le module). (7) Toutes les fragilités de la v7.3 sur le recalage × 1,4 et l\'érosion (15.8, points 4 et 5) restent.');
log('');

log('### 16.11 Si l\'auteur adopte : lignes à changer dans le bilan global (document de travail non publié, section 0), sans rien toucher avant sa décision');
var l = A.lignesPatrimoine('central'), lz = Z.lignesPatrimoine('central'), e = A.ecart('central'), ez = Z.ecart('central');
log('| N° | Poste (écart à la v5.10, Md€, central) | v7.2 | v7.3 | v7.4 B |'); log('|---|---|---|---|---|');
log('| F01 | Fonction des revenus (T(R), capital des retraités compris) | +29,66 | +24,54 | +29,66 (fonction de la v7.2) |');
log('| F05 | Fonction du patrimoine (recette 26,28 → 66,23 → ' + f(rc.nette, 2) + ') | −60,14 | ' + sg(lz.taxeAnnuelle, 2) + ' | ' + sg(l.taxeAnnuelle, 2) + ' |');
log('| F09 | Plafonds (v7.4 : plus de plafond de 75 % ; différé dans F05) | +1,62 | ' + sg(lz.plafonds, 2) + ' | ' + sg(l.plafonds, 2) + ' |');
log('| F11 | Trusts | −0,53 | ' + sg(lz.trusts, 2) + ' | ' + sg(l.trusts, 2) + ' |');
log('| F12 | SCI | −0,91 | ' + sg(lz.sci, 2) + ' | ' + sg(l.sci, 2) + ' |');
log('| F22 | Plancher | −4,68 | −4,53 | −4,68 |');
log('|  | **Effet sur le solde** | −90,68 | ' + sg(ez.total, 2) + ' | ' + sg(e.total, 2) + ' |');
log('|  | **Solde de croisière 2060** | −78,18 | ' + sg(Z.solde('central', 2060), 2) + ' | ' + sg(A.solde('central', 2060), 2) + ' |');
log('');
log('Les autres lignes (F02 IS, F03 retenue, F20 versement, F21 enfants) sont inchangées. Contrôle : v7.2 (−90,68) + écarts de F05, F09, F11 et F12 = ' + sg(Y.ecart('central').total + (l.taxeAnnuelle - Y.lignesPatrimoine('central').taxeAnnuelle) + (l.plafonds - Y.lignesPatrimoine('central').plafonds) + (l.trusts - Y.lignesPatrimoine('central').trusts) + (l.sci - Y.lignesPatrimoine('central').sci), 2) + ' Md€, l\'effet calculé. À reprendre aussi : l\'« En une minute », les tableaux 0.2 à 0.4, le registre des propositions (N07/F05 : impôt plancher, règle de paiement, différé garanti, valeur de rendement), `sources/calculs/bilan_global.py` et la présentation du système en une page (document de travail non publié).');
log('');

log('### 16.12 Hypothèses (H74.x) et sources');
log('- **H74.1** : τ(W) = 2 % × W / (W + 700 k€), résidence principale comprise (variante A : K = 1 M€) ; option RP : abattement de 100 000 €, non retenue.');
log('- **H74.2** : impôt plancher : on impute la contribution personnelle due sur les revenus du capital, au prorata des revenus ; l\'IS n\'est pas imputé. Distributions : loyers au rendement net de `taxe_patrimoine.js` (H508) ; parts à 1,5 / 2 / 3 % ⚠️ V15300, V15301.');
log('- **H74.3** : part de la résidence principale dans l\'immobilier net, par tranche HVP (100 % en bas, 30 % pour le 1 % le mieux doté ; 70 % en moyenne) ⚠️ V15303.');
log('- **H74.4** : loi jointe revenu × patrimoine : patrimoine moyen par quartile de niveau de vie (Insee Focus n° 371, figure 3b), forme HVP par quartile ; revenus 1 700 / 2 700 / 3 700 / 6 500 €/mois ; 1,7 adulte ⚠️ V15302.');
log('- **H74.5** : règle de paiement x(N) = 50 % × N / (N + 72 000 €), avec un minimum de 2 % des actifs mobilisables ; différé portant intérêt au taux de l\'État (1,3 % réel), durée 12 ans, 5 % de pertes ⚠️ V15305, V15308.');
log('- **H74.6** : fonction des revenus recalibrée sur grille, avec la dette stable en macro de référence pour contrainte : variante B = v7.2, variante A = 412,5 / 66 % / 20 % / 1 500 €.');
log('- **H74.7** : terres exploitées et forêts gérées à la valeur de rendement (assiette des terres × 0,5) ; biens professionnels : revenu net / 4 %, plafonné à la valeur vénale ; jeunes entreprises : valeur substantielle ⚠️ V15304, V15307.');
log('- **Cas** : hypothèses dans les libellés (16.6) ⚠️ V15306.');
log('- Sources : celles de la v7.3 ; Code général des impôts, art. 968 (usufruit), 974 (dettes déductibles), 976 (bois et forêts), 977 (barème de l\'IFI) et 1716 bis (dation) ; Code civil, art. 815-9 (indemnité d\'occupation) ; TFUE, art. 63 ; proposition de loi instaurant un impôt plancher de 2 % sur les très hauts patrimoines, adoptée par l\'Assemblée nationale le 20/02/2025 ⚠️ V15300 ; pratique suisse de la valeur de rendement (LDFR, art. 10 ; circulaire n° 28 de la Conférence suisse des impôts) ⚠️ V15304. **Aucune de ces sources n\'a été relue pour cette section** : les références sont à vérifier (registre V15300 à V15309).');
