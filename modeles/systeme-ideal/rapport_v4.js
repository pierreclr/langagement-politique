// § 14 de resultats-optimum.txt : « Architecture v4 (décisions de l'auteur du 03/11 sur les neuf dilemmes) » (03/11/2026, H620-H625). Reproduction, depuis ce dossier (sortie ajoutée à la suite du § 13) :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js ../risques/stress.js rapport_v4.js >> resultats-optimum.txt
var Z = this.Optimum, F = this.Voies.fus, ST = this.Stress;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r0(x) { return Math.round(x).toLocaleString('fr-FR').replace(/[  ,]/g, ' ').replace('-', '−'); }
function s0(x) { var v = Math.round(x); return (v > 0 ? '+' : '') + r0(x); }
function pc(x, d) { var k = d === undefined ? 1 : d, m = Math.pow(10, k); return (Math.round(x * 100 * m) / m).toString().replace('.', ',').replace('-', '−') + ' %'; }
function pt(x) { return (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',') + ' %'; }
function trip(o) { return r1(o.bas) + ' / ' + r1(o.central) + ' / ' + r1(o.haut); }
function nonTenues(e) { return e.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() || 'aucune'; }
var t0 = Date.now(), LP = Z.CAS_PROTEGES_AFFINAGE, SCS = ['bas', 'central', 'haut'];
var VB = Z.archi(Z.ARCHITECTURE_V3B), V4 = Z.archi(Z.ARCHITECTURE_V4), B4 = Z.archi(Z.BASE_V4);

log('\n## 14. Architecture v4 : décisions de l\'auteur du 03/11 sur les neuf dilemmes (03/11 ; H620-H625)');
log('Point de départ : la v3b (§ 13.6). L\'auteur a tranché les neuf dilemmes (03/11, dilemmes 1 à 9). Deux décisions changent le chiffrage : **dilemme 3** (éducation : bloquer le recrutement sur les postes libérés par la démographie, au lieu de les redéployer vers le tuteur IA) et **dilemme 9** (parent isolé : une marge plus grande, donc une majoration plus élevée). Les autres (capitalisation après l\'équilibre, règle de lancement, régularisation expérimentée, droit existant d\'abord, élections législatives seules remplacées) ne changent pas le solde de croisière : elles sont listées en 14.1. Tout est de l\'ordre de grandeur, sous hypothèses.');

log('\n### 14.1 Ce que chaque décision change dans le modèle');
log('| dilemme | décision de l\'auteur (03/11) | traduction dans le modèle |'); log('|---|---|---|');
[['1. prime d\'activité', 'allocation unique dégressive, α = 25 %', 'déjà dans la v3 (§ 11) ; inchangé'],
 ['2. héritage', 'fonction continue E\', K = 94 000 € ; capital de départ K = 80 000 €', 'déjà dans la v3b (§ 13) ; inchangé'],
 ['3. éducation', 'non-remplacement des postes libérés ; IA en moteur d\'accompagnement ; accompagnateurs formés, ratio à tester', '**poste éducation : +5,5 / +3,9 / +2,2 Md€ moins 36 M€ d\'expérimentation** (au lieu de −0,2 / −1,6 / −4,1) ; le tuteur généralisé n\'est pas compté (14.2)'],
 ['4. capitalisation', 'd\'abord l\'équilibre, fonds sur ressources nouvelles, au plus 10 % des cotisations ensuite', 'hors solde de croisière (aucun détournement de cotisations modélisé)'],
 ['5. haut ou bas', '« personne ne perd en bas » d\'abord, règle de lancement', 'ordre des contraintes inchangé ; (2) reste non tenue'],
 ['6. régularisation', 'expérimentée sur un cadre précis', 'non chiffrée (pas de base statistique des irréguliers)'],
 ['7. droit existant', 'appliquer d\'abord le CESEDA L. 631-2 ; non-refoulement dans le noyau', 'non chiffré'],
 ['8. élections', 'seules les élections législatives sont remplacées ; l\'exécutif reste élu', 'non chiffré'],
 ['9. parent isolé', 'marge plus grande (majoration plus élevée)', '**plus petite majoration (pas de 10 €) qui donne au parent isolé au Smic au moins +' + Z.GAIN_PARENT_ISOLE_V4 + ' €/mois, au taux d\'équilibre, sans perdant protégé** (14.3)']
].forEach(function (r) { log('| ' + r.join(' | ') + ' |'); });

log('\n### 14.2 Éducation : non-remplacement, et que faire du tuteur IA (H620)');
var pas = Z.solde(F(VB, { tPlat: VB.tPlat + 0.01 }), 'central') - Z.solde(VB, 'central');
log('| variante (sur la v3b, majoration 340 €) | poste éducation b / c / h (Md€) | solde à 41,4 % b / c / h | taux plat d\'équilibre |'); log('|---|---|---|---|');
[['v3b : postes redéployés vers le tuteur (défaut tranché par Claude, Q10)', VB], ['non-remplacement, tuteur compté au coût de l\'expérimentation (36 M€/an) : **retenu**', F(VB, { education: 'nonRemplacementExperimentation' })], ['non-remplacement, tuteur hors budget (rien de compté)', F(VB, { education: 'economie' })]].forEach(function (v) {
  var a = Z.archi(v[1]), te = Z.tauxEquilibre(a);
  log('| ' + v[0] + ' | ' + SCS.map(function (s) { return r1(Z.detail(a, s).education); }).join(' / ') + ' | ' + trip(Z.soldes(a)) + ' | ' + pt(te) + ' |'); });
log('Lecture : le non-remplacement rapporte **' + r1(Z.detail(B4, 'central').education - Z.detail(VB, 'central').education) + ' Md€/an au central** de plus que le redéploiement (3,9 d\'économie et 1,6 de tuteur évité ; 36 M€ d\'expérimentation déduits), soit environ 0,4 à 0,5 point de taux plat (1 point de taux plat vaut ' + r1(pas) + ' Md€ au central). **Choix documenté (H620)** : le tuteur IA n\'est **pas** compté comme économie. Trois options : (a) hors budget, rien de compté : flatteur, car il faudra le payer s\'il marche ; (b) généralisé avec des accompagnateurs formés à 1 pour 100 élèves : ≈ 5,7 Md€/an au central (`modeles/education/resultats.md`, tableau « Net » : non-remplacement + tuteur = −1,8 Md€), ce qui reviendrait presque à la v3b ; (c) **retenu : seulement le coût de l\'expérimentation à trois bras** (78 collèges par bras, 17,1 + 18,9 ≈ 36 M€/an, `modeles/education/methode.md` § 4.5 point 6), comptée chaque année et dans les trois scénarios (prudent : elle dure deux ans). La généralisation ne se décide qu\'après l\'expérimentation, avec ses règles de décision fixées d\'avance ; si elle a lieu, elle coûte ≈ 5,7 Md€/an à financer (≈ 0,5 point de taux plat) ⚠️ V9401.');

log('\n### 14.3 Majoration du parent isolé : grille au taux d\'équilibre (H621-H622)');
log('Base : v3b + éducation retenue (14.2). Chaque ligne : la majoration, le plus petit taux plat au dixième de point qui équilibre le central, puis les cas types (€/mois, central). Le parent isolé type a 2 enfants : chaque 10 € de majoration par enfant lui rapporte ≈ 20 €/mois, moins l\'effet du taux.');
log('| majoration (€/enfant/mois) | taux plat | solde b / c / h | smicard | couple avec un Smic | parent isolé au Smic | D1 / D2 / D3 | contraintes (3) |'); log('|---|---|---|---|---|---|---|---|');
var mm = Z.majorationMinimale(Z.BASE_V4, Z.GAIN_PARENT_ISOLE_V4);
[340, 350, 360, 370, 380, 390, 400, 420, 450, 500].forEach(function (m) {
  var a = F(B4, { majParentIsole: m }), t = Z.tauxEquilibre(a), b = Z.archi(F(a, { tPlat: t })), e = Z.evaluer(b, LP), c = e.cas;
  var g = m === mm.maj ? '**' : '';
  log('| ' + g + m + ' €' + g + ' | ' + pt(t) + ' | ' + trip(e.soldes) + ' | ' + s0(c.smic_seul.ecartMois) + ' | ' + s0(c.couple_1smic_2enf.ecartMois) + ' | ' + g + s0(c.parent_isole_smic.ecartMois) + g + ' | ' + [0, 1, 2].map(function (i) { return s0(e.deciles[i].ecart); }).join(' / ') + ' | ' + (e.contraintes[2] ? 'tenue' : 'non tenue') + ' |'); });
log('Résultat (`Optimum.majorationMinimale`, pas de 10 €) : **' + mm.maj + ' € par enfant**, taux plat d\'équilibre **' + pt(mm.tPlat) + '**. Au pas de 5 €, 385 € suffirait (+102 €/mois) ; 400 € (taux 41,1 %) donne +130 € avec une marge de solde un peu plus confortable au central. Le gain du parent isolé monte de ≈ 1,9 € par euro de majoration ; le smicard ne perd que ≈ 1 à 2 €/mois par dixième de point de taux. **Le relèvement est presque gratuit pour les autres cas types parce que l\'économie de l\'éducation le finance** : à 390 € le taux reste sous celui de la v3b (41,4 %).');

log('\n### 14.4 Architecture v4 (H623)');
var e4 = Z.evaluer(V4, LP), eb = Z.evaluer(VB, LP), te4 = Z.tauxEquilibre(V4), d4 = Z.detail(V4, 'central'), cx = Z.complexite(V4);
log('Paramètres : v3b (socle ' + V4.socle + ' €, allocation unique α = 25 %, pas de prime d\'activité, héritage forme E\' K = 94 000 €, capital de départ exp K = 80 000 €, taxe à 1 % plafonnée à 5 % du revenu sous la médiane, non-cotés à la vente, exil défendable) sauf : **éducation : non-remplacement des postes libérés, tuteur compté au coût de l\'expérimentation** ; **majoration parent isolé ' + V4.majParentIsole + ' €** par enfant ; taux plat **' + pt(V4.tPlat) + '** (taux d\'équilibre recalculé : ' + pt(te4) + ').');
log('**Solde (Md€/an, bas / central / haut) : ' + trip(e4.soldes) + '** (central exact : +' + e4.soldes.central.toFixed(2).replace('.', ',') + ') ; contraintes non tenues : ' + nonTenues(e4) + ' (écart au haut : ' + r1(e4.violations[1]) + ' Md€) ; règles + exceptions : ' + cx.total + ' ; taux marginal à l\'infini ' + pc(e4.margMax) + ' ; effort du retraité propriétaire modeste ' + pc(e4.effort, 0) + ' ; plafond des transmissions ' + pc(Z.tauxTransmissionMax(V4), 0) + '.');
log('Décomposition au central : options ' + r1(d4.options) + ' ; conjoint ' + r1(d4.conjoint) + ' ; perte due à la fonction d\'héritage ' + r1(d4.exemptionVie) + ' ; taxe à 1 % ' + r1(d4.taxe) + ' ; correctifs (parents isolés, retraités) ' + r1(d4.correctifs) + ' ; capital de départ ' + r1(d4.capitalDepart) + ' ; protection (allocation unique) ' + r1(d4.protection) + ' ; économies structurelles ' + r1(d4.structurelles) + ' ; niches de TVA ' + r1(d4.nichesTVA) + ' ; éducation ' + r1(d4.education) + '.');
log('\nCas types (€/mois, écart au droit actuel, central) :');
var CASN = [['smic_seul', 'smicard'], ['couple_1smic_2enf', 'couple avec un Smic'], ['couple_2smic_2enf', 'couple avec deux Smic'], ['parent_isole_smic', 'parent isolé au Smic'], ['rsa_seul', 'RSA seul'], ['retraite_aspa_loc', 'retraité locataire'], ['cadre_2x', 'cadre 2 Smic'], ['cadre_4x', 'cadre 4 Smic']];
log('| architecture | taux plat | solde b / c / h | ' + CASN.map(function (c) { return c[1]; }).join(' | ') + ' | règles + exc. | non tenues |'); log('|---|---|---|' + CASN.map(function () { return '---'; }).join('|') + '|---|---|');
[['v3b', VB, eb], ['**v4**', V4, e4]].forEach(function (v) { var e = v[2]; log('| ' + v[0] + ' | ' + pt(v[1].tPlat) + ' | ' + trip(e.soldes) + ' | ' + CASN.map(function (c) { return e.cas[c[0]] ? s0(e.cas[c[0]].ecartMois) : '—'; }).join(' | ') + ' | ' + e.complexite.total + ' | ' + nonTenues(e) + ' |'); });
log('\nDixièmes de niveau de vie (€/UC/mois, central) :');
log('| architecture | ' + e4.deciles.map(function (d) { return d.decile; }).join(' | ') + ' |'); log('|---|' + e4.deciles.map(function () { return '---'; }).join('|') + '|');
[['v3b', eb], ['**v4**', e4]].forEach(function (v) { log('| ' + v[0] + ' | ' + v[1].deciles.map(function (d) { return s0(d.ecart); }).join(' | ') + ' |'); });
var tm = { seul: Z.tmeMax(V4, 'seul'), parent: Z.tmeMax(V4, 'parent'), couple: Z.tmeMax(V4, 'couple') };
log('Taux marginal effectif maximal de 0 à 2 Smic : personne seule ' + pc(tm.seul.tme, 0) + ', parent isolé ' + pc(tm.parent.tme, 0) + ', couple à un salaire ' + pc(tm.couple.tme, 0) + ' (maximum ' + pc(Z.tmeMax3(V4), 0) + ' ; critère ≤ 75 % tenu).');
log('Personne seule (taux marginal effectif v4 / droit actuel ; gain en €/mois contre le droit actuel) : ' + Z.courbeTME(V4, 'seul', [0.25, 0.5, 1, 1.25]).map(function (k) { return String(k.x).replace('.', ',') + ' Smic : ' + pc(k.tme, 0) + ' / ' + pc(k.tmeActuel, 0) + ' (' + s0(k.revenu - k.actuel) + ')'; }).join(' ; ') + ' ; pic du droit actuel : ' + pc(tm.seul.actuel, 0) + ' vers ' + String(tm.seul.xActuel).replace('.', ',') + ' Smic.');
var tr = Z.transition(V4, 1, 5, 250);
log('Année 1 (socle à 250 €, montée linéaire sur 5 ans ; taxe en trésorerie) : solde ' + trip(tr.soldes) + ' ; D1 ' + s0(tr.deciles[0].ecart) + ' €/UC/mois ; smicard ' + s0(tr.cas.smic_seul.ecartMois) + ', parent isolé au Smic ' + s0(tr.cas.parent_isole_smic.ecartMois) + ' €/mois.');
var pn = Z.pressionNette(V4), pnb = Z.pressionNette(VB);
log('Pression fiscale : prélèvements obligatoires ' + pc(pn.poPartPIB, 1) + ' du PIB ; nets du socle **+' + r1(pn.deltaNet) + ' Md€ (' + r1(100 * pn.partPIB) + ' points de PIB)**, dont ' + r1(pn.deficitComble) + ' pour combler le déficit actuel et ' + r1(pn.depensesNettes) + ' de dépenses nouvelles nettes (v3b : +' + r1(pnb.deltaNet) + ', ' + r1(100 * pnb.partPIB) + ' points).');

log('\n### 14.5 Dette à 10 ans (modeles/risques/stress.js, chemin « V4 » ; année 1 = 2029 ; H624)');
if (ST && ST.ARCHS.V4) {
  log('| trajectoire | solde an 1 / an 5 / an 10 (Md€) | dette/PIB an 5 / an 10 |'); log('|---|---|---|');
  SCS.forEach(function (sc) { var r = ST.test('V4', sc, {}); log('| sans choc, ' + sc + ' | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5, 0) + ' / ' + pc(r.ratio10, 0) + ' |'); });
  log('\nChocs au central (dette/PIB à 10 ans, sans garde-fous ; entre parenthèses : v3b) :');
  log('| choc | v4 | v3b |'); log('|---|---|---|');
  [['aucun', {}], ['IA à zéro (sans la ligne E)', { sansE: true }], ['récession type 2009', { recession: true }], ['taux +100 pb', { taux: 100 }], ['krach immobilier −20 % (3 ans)', { krachImmo: -0.2 }], ['exil au haut de la fourchette défendable', { exilHaut: true }]].forEach(function (c) {
    log('| ' + c[0] + ' | ' + pc(ST.test('V4', 'central', c[1]).ratio10, 0) + ' | ' + pc(ST.test('V3B', 'central', c[1]).ratio10, 0) + ' |'); });
  var ex = ST.perteExilHaut('V4', 'central');
  log('Exil au haut de la fourchette posé au central : ' + r1(ex.total) + ' Md€/an (revenus ' + r1(ex.revenus) + ', transmissions ' + r1(ex.transmissions) + ', taxe ' + r1(ex.taxe) + ').');
} else log('stress.js non chargé : dette non recalculée.');

log('\n### 14.6 Lecture, steelman et limites (Claude, révisable ; points non confirmés V9400 à V9404)');
log('1. **La v4 est la v3b avec deux décisions de l\'auteur**, et elles se financent l\'une l\'autre : le non-remplacement rapporte ≈ 5,5 Md€/an au central par rapport au redéploiement ; la majoration à ' + V4.majParentIsole + ' € en coûte ' + r1(Z.detail(VB, 'central').correctifs - d4.correctifs) + ' (correctifs de ' + r1(Z.detail(VB, 'central').correctifs) + ' à ' + r1(d4.correctifs) + ' Md€) ; le taux plat d\'équilibre baisse de 41,4 % à ' + pt(V4.tPlat) + '. Le parent isolé au Smic passe de +4 à ' + s0(e4.cas.parent_isole_smic.ecartMois) + ' €/mois, le smicard de +43 à ' + s0(e4.cas.smic_seul.ecartMois) + ', D1 de +40 à ' + s0(e4.deciles[0].ecart) + '.');
log('2. **Le prix de l\'éducation** : le ratio d\'élèves par ETP remonterait de 15,6 à 16,6 (modèle éducation), le tuteur n\'existe qu\'en expérimentation, et la baisse démographique n\'est pas uniforme (rural, premier degré) : un non-remplacement « national » peut fermer des classes là où il n\'y a pas d\'excédent ⚠️ V9400. **Objection (steelman)** : « vous économisez sur les enfants pour baisser l\'impôt ». Réponse : l\'économie suit la baisse du nombre d\'élèves (≈ 1,7 million en dix ans ⚠️), sans licenciement (4,8 ans de départs à 3 %/an), et le tuteur est testé avant d\'être payé ; mais si l\'expérimentation réussit, il faudra trouver ≈ 5,7 Md€/an, soit l\'essentiel de l\'économie (V9401).');
log('3. **Le prix du parent isolé** : la majoration est une exception ciblée (« D1 tient grâce à une rustine », § 7.4) et plus elle monte, plus le saut entre « parent isolé » et « couple » grandit (incitation à déclarer une séparation fictive : non modélisée ⚠️ V9402). Le seuil de +100 €/mois est une traduction par Claude de la demande d\'une marge plus grande (H621), pas un chiffre de l\'auteur.');
log('4. **Rien ne change au haut** : la contrainte (2) reste non tenue (' + r1(e4.soldes.haut) + ' Md€ au haut, écart de ' + r1(e4.violations[1]) + ' à la limite de 3 % du PIB) ; la règle de lancement (dilemme 5) s\'applique telle quelle. Le solde central à l\'équilibre est mince par construction (taux au dixième de point) ⚠️ V9403.');
log('5. **Limites** : celles des §§ 11 à 13 (coût de l\'allocation calé sur la personne seule, V8201 ; loi des héritages, V8600 ; fuite identique à tout montant, V8601) ; l\'économie de l\'éducation est une estimation à 10 ans (1,2 Md€ à 3 ans, `sources/economies-depense-publique.md`) traitée comme un régime de croisière ⚠️ V9404.');
log('\nTemps de calcul du § 14 : ' + Math.round((Date.now() - t0) / 1000) + ' s.');
