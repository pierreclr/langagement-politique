// § 21 de resultats-optimum.txt : « v5.2 (décisions du 05/11) » (05/11/2026, H730-H741, V13000-V13030). Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js \
//       optimum_options_0411.js ../risques/stress.js decisions_0511.js rapport_decisions_0511.js >> resultats-optimum.txt
var Z = this.Optimum, D = this.Decisions0511, ST = this.Stress, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function pc(x) { return (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',') + ' %'; }
function sg(x) { return (x > 0 ? '+' : '') + r1(x); }
function trip(f) { return SCS.map(function (s) { return f(s); }).join(' / '); }
var SCS = D.SCS, V51 = Z.archi(Z.ARCHITECTURE_V5), A = D.archiV52(), PAS = D.pointDeTaux(A), T = D.tauxEquilibre(), B = F(A, { tPlat: T });
var dette51 = {}, dette52 = {}; SCS.forEach(function (s) { dette51[s] = ST.test('V5', s, {}).ratio10; dette52[s] = ST.test('V5', s, { ajust: D.ajustement(B) }).ratio10; });
var sol51 = Z.soldes(V51), sol52 = D.soldes(A), sol52B = D.soldes(B);
log('\n## 21. v5.2 (décisions du 05/11) : le système recalculé (05/11/2026 ; H730-H741, V13000-V13030)');
log('**Ce que ce paragraphe fait.** Les décisions de l\'auteur de la nuit du 04 au 05/11 sont chiffrées sur la v5.1 (§ 18-19) par `decisions_0511.js` (module séparé, aucun défaut d\'`optimum.js` modifié) ; test : `test_decisions_0511.js` ; reproduction : `rapport_decisions_0511.js`. Hypothèses : `methode.md` § 36.');
log('\n### 21.1 Équilibre (Md€/an, croisière ; bas / central / haut = scénarios du modèle)');
log('| | v5.1 (41,4 %) | v5.2 à 41,4 % | v5.2 à son taux d\'équilibre |');
log('|---|---|---|---|');
log('| taux plat | 41,4 % | 41,4 % | **' + pc(T) + '** (' + r1(100 * (T - V51.tPlat)) + ' point) |');
log('| solde b / c / h | ' + trip(function (s) { return r1(sol51[s]); }) + ' | ' + trip(function (s) { return r1(sol52[s]); }) + ' | ' + trip(function (s) { return r1(sol52B[s]); }) + ' |');
log('| dette à 10 ans (central ; b / c / h) | ' + trip(function (s) { return pc(dette51[s]); }) + ' | — | ' + trip(function (s) { return pc(dette52[s]); }) + ' |');
log('Un point de taux plat vaut ' + r2(PAS) + ' Md€ (v5.1 : 10,58). **Taux d\'équilibre central : ' + pc(T) + ' contre 41,4 %** : les décisions se compensent presque exactement, parce que deux lignes pèsent ≈ 7,5 Md€ en sens inverse (CMG gardé −7,3 ; majoration ramenée à 200 € +7,6). Au bas et au haut, le solde n\'est pas fonction monotone du taux dans la plage utile (érosion de l\'assiette, H510) : je ne donne pas de taux d\'équilibre pour ces deux scénarios ; l\'ordre de grandeur est le solde divisé par la valeur d\'un point (bas : ' + r1(sol52B.bas / PAS) + ' points de marge ; haut : ' + r1(sol52B.haut / PAS) + ' points à trouver, linéaire donc approximatif).');
log('\n### 21.2 Lignes (Md€/an ; gain + / dépense −)');
log('| ligne | b / c / h | nature |'); log('|---|---|---|');
D.lignes(A, 'central').forEach(function (l, k) { var v = SCS.map(function (s) { return D.lignes(A, s)[k].v; }); log('| ' + l.poste + ' | ' + v.map(function (x) { return sg(x).replace('+0,0', '0,0'); }).join(' / ') + ' | ' + l.nature + ' |'); });
var tot = {}; SCS.forEach(function (s) { tot[s] = D.totalLignes(A, s); });
log('| **Solde des décisions (lignes au budget, majoration comprise)** | ' + trip(function (s) { return sg(tot[s]); }) + ' | |');
log('Les deux lignes hors budget (CEE pour les consommateurs, travaux sanitaires des bailleurs) ne sont pas dans ce total. Report d\'encaissement des plafonds (§ 19.4) : 14,1 / 11,3 / 8,6 Md€/an pendant ≈ 12 ans, borne haute, compté dans la dette ci-dessus mais pas dans le solde de croisière.');
var mBE = (function () { var m; for (m = 200; m <= 500; m += 1) { if (Z.casTypes(F(B, { majParentIsole: m })).parent_isole_smic.ecartMois >= 0) return m; } return null; })();
var costBE = mBE ? (Z.solde(F(B, { majParentIsole: 200 }), 'central') - Z.solde(F(B, { majParentIsole: mBE }), 'central')) : null;
var breakeven = 'Pour que le parent isolé au Smic ne perde rien, la majoration devrait être d\'environ ' + mBE + ' € par enfant (coût supplémentaire ≈ ' + r1(costBE) + ' Md€/an au central, soit ' + r1(costBE / PAS * 10) + ' dixièmes de point).';
log('\n### 21.3 Cas types à 41,3 % (€/mois, central, écart au droit actuel ; v5.1 entre parenthèses)');
var c51 = Z.casTypes(V51), c52 = D.casTypes(B), ids = [['smic_seul', 'Salarié au Smic'], ['parent_isole_smic', 'Parent isolé, 2 enfants, Smic'], ['parent_isole_sans_emploi', 'Parent isolé, 2 enfants, sans emploi'], ['couple_2smic_2enf', 'Couple, 2 enfants, deux Smic'], ['couple_1smic_2enf', 'Couple, 2 enfants, un Smic'], ['retraite_aspa_loc', 'Retraité modeste (minimum vieillesse, locataire)'], ['cadre_2x', 'Cadre 3 Smic']];
log('| cas type | v5.2 | v5.1 |'); log('|---|---|---|');
ids.forEach(function (d) { log('| ' + d[1] + ' | ' + sg(c52[d[0]].ecartMois) + ' | ' + sg(c51[d[0]].ecartMois) + ' |'); });
log('**Le parent isolé au Smic devient perdant** : ' + sg(c52.parent_isole_smic.ecartMois) + ' €/mois contre le droit actuel (+' + r1(c51.parent_isole_smic.ecartMois) + ' en v5.1), soit −400 € de majoration (2 enfants × 200) ; le parent isolé sans emploi passe de +' + r1(c51.parent_isole_sans_emploi.ecartMois) + ' à ' + sg(c52.parent_isole_sans_emploi.ecartMois) + '. '+ breakeven +' C\'est la contradiction avec « ne perdre personne » à nommer (V13013). Les autres cas types bougent de moins de 5 €/mois (effet du taux).');
log('\n### 21.4 Capital de départ en 5 × 8 000 € (décision 7)');
var K = SCS.map(function (s) { return D.capitalTresorerie(A, s, 6); });
log('Coût de croisière **inchangé** (' + trip(function (s) { return r1(D.capitalTresorerie(A, s, 6).coutCroisiere); }) + ' Md€/an) : le flux annuel d\'une cohorte ne dépend pas du calendrier de ses versements. Le **démarrage** coûte moins : si seules les cohortes qui atteignent 25 ans après le lancement sont servies, on décaisse 1/5, puis 2/5... du régime (déblocage anticipé pour un projet : ' + trip(function (s) { return pc(D.HYP.capital.partDeblocage[SCS.indexOf(s)]); }) + ' des jeunes, solde versé un an après le premier versement, H741). **Trésorerie économisée sur les quatre premières années, par rapport à un versement unique : ' + trip(function (s) { return r1(D.capitalTresorerie(A, s, 6).total); }) + ' Md€** (une fois, pas une économie : un décalage). Si l\'État décide de servir aussi les 26-29 ans déjà en place au lancement, cet avantage disparaît (V13011).');
log('\n### 21.5 Combinaison d\'économies recomposée (décision 16 ; `sources/economies-10-milliards.md`)');
var L = D.combinaison('large'), P = D.combinaison('prudente');
log('Pistes retirées : P2 (SFT, devenu la ligne propre de la décision 12 : sinon double compte), R1 (renoncer à la TVA 10 % : elle est gardée), P7 (recentrer le CMG : la formule unique est gardée) ; P9 (gazole) reste en réserve. Vérification des doubles comptes : MaPrimeRénov\' et les CEE ne figurent dans aucune des pistes P1 à P10 ni dans les lignes du modèle (recherche dans le code et le dossier) ; la TVA à 5,5 % sur la rénovation énergétique n\'était pas dans les niches de la mesure 23 (hors périmètre). Reste un recouvrement non isolé : P3 (santé) et la santé évitée du volet sanitaire (≈ 0,7 au central, effet très différent).');
log('| combinaison (Md€/an, ampleur : prudent / central / ample) | total | points de taux plat (central) | écart au besoin |'); log('|---|---|---|---|');
log('| large : P1 + P3 + P4 + P5 + P6 + P8 + P10 + R0 | ' + L.map(r1).join(' / ') + ' | ' + r2(L[1] / PAS) + ' | ' + 'aucun besoin chiffré : le solde de la v5.2 est déjà équilibré au central |');
log('| prudente : P1 + P3 + P4 + P5 + P6 + R0 | ' + P.map(r1).join(' / ') + ' | ' + r2(P[1] / PAS) + ' | idem |');
log('Lecture : ces pistes ne sont plus nécessaires pour **tenir** 41,4 % au central (les décisions se compensent) ; elles servent de **marge** (le scénario haut, ' + r1(sol52.haut) + ' Md€, n\'est couvert par aucune des deux) ou à **baisser le taux** : au central, la combinaison large vaut ' + r1(L[1] / PAS * 10) + ' dixièmes de point, la prudente ' + r1(P[1] / PAS * 10) + '.');
log('\n### 21.6 Limites (Claude, révisable ; V13000 à V13030)');
log('1. **Le taux de ' + pc(T) + ' est un équilibre central au dixième de point** : la marge du central (' + r1(sol52.central) + ' Md€ à 41,4 %) est dans le bruit du modèle. 2. Les deux lignes qui s\'annulent (CMG −7,3 ; majoration +7,6) n\'ont pas la même solidité : le CMG est un chiffre fixe de la Drees, la majoration est un coût déduit proportionnellement de la majoration actuelle (H709-H712) et sans effet de comportement. 3. TVA rénovation énergétique, élasticité, perte de travaux, répercussion des CEE, santé publique, déblocage du capital : hypothèses de Claude sans étude lue (V13002-V13004, V13006, V13010, V13011). 4. MaPrimeRénov\' : 3,3 Md€ sont des **engagements 2024**, pas des paiements ; le gain budgétaire de la suppression est supposé égal. 5. Le SFT est compté **brut** comme les autres économies de personnel du modèle ; la part qui retournerait à l\'État par le prélèvement unique (≈ 41 %) n\'est pas déduite (V12862). 6. Le report d\'encaissement des plafonds (borne haute) et les effets de bord (offre de travail, mise en couple) ne sont pas modélisés. 7. Les options sont additives (V12213).');
log('\nTemps de calcul du § 21 : 0 s.');
