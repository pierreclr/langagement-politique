// § 18 de resultats-optimum.txt : « v5.1 recalculée (04/11) » : corrections de données établies aux sources primaires (V12400-V12420), sans choix politique. Reproduction, depuis ce dossier (sortie ajoutée à la suite du § 17) :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js \
//       optimum_options_0411.js ../risques/stress.js rapport_v51.js >> resultats-optimum.txt
// Les valeurs « avant » sont celles du § 15 de resultats-optimum.txt au commit 78031b1d (v5 du 03-04/11, avant corrections) ; le détail correction par correction vient de `pas_a_pas_v51.py`.
var Z = this.Optimum, ST = this.Stress;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function sg(x) { var v = Math.round(x); return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v); }
function pc(x, d) { var k = d === undefined ? 1 : d, m = Math.pow(10, k); return (Math.round(x * 100 * m) / m).toString().replace('.', ',').replace('-', '−') + ' %'; }
var SCS = ['bas', 'central', 'haut'];
var V5 = Z.archi(Z.ARCHITECTURE_V5), V5A = Z.archi(Z.ARCHITECTURE_V5_AMBITION);
var AV = { solde: [116.8, 0.8, -144.8], centralExact: 0.75, taux: 0.407, tauxA: 0.401, dette10: 1.001, smic: 54, parent: 138, couple1: 45, couple2: -66, cadre4: 28, soldeA: [128.3, 0.2, -146.9], gestion: [8.0, 4.2, 1.1], ia: [0.2, 0.2, -0.4], taxe: 92.6 };
var so = SCS.map(function (s) { return Z.solde(V5, s); }), ct = Z.casTypes(V5), dt = ST ? ST.test('V5', 'central', {}).ratio10 : null;
var soA = SCS.map(function (s) { return Z.solde(V5A, s); });
var soAvantTaux = SCS.map(function (s) { return Z.solde(Z.archi(Z.ARCHITECTURE_V5_AMBITION), s); });
log('## 18. v5.1 recalculée (04/11/2026) : corrections de données aux sources primaires (V12400-V12420)');
log('Ce paragraphe applique aux modèles les corrections de **faits sourcés** (pas de choix politique) établies la nuit du 04/11 : H506 (part de cotées 15 %, Banque de France T4 2025), H250 (bornes 0 / 0,136), H252 (Levy 2025 : 1,5 / 1,0), H45 (RSA 1,84 M), H23 (27,9 M à 15 h ou plus), mesures 20-21 (base CAF lue, plafond des départs, gains de temps de l\'IA mesurés) et H508 (rendement locatif net 1,7 / 2,0 / 2,7 %). Aucun taux, socle ni majoration n\'est choisi à nouveau : seul le **taux plat d\'équilibre** (recherche au dixième de point) est recalculé.');
log('');
log('### 18.1 Ancien → nouveau (architecture v5, majoration 400 €, central ≥ 0)');
log('| indicateur | v5 (avant) | **v5.1 (maintenant)** | écart |');
log('|---|---|---|---|');
log('| taux plat d\'équilibre | ' + pc(AV.taux) + ' | **' + pc(V5.tPlat) + '** | ' + r1((V5.tPlat - AV.taux) * 100) + ' point |');
log('| solde favorable / central / défavorable à ce taux (Md€/an) | ' + AV.solde.map(r1).join(' / ') + ' (central exact +' + String(AV.centralExact).replace('.', ',') + ') | **' + so.map(r1).join(' / ') + '** (central exact ' + (so[1] >= 0 ? '+' : '') + String(Math.round(so[1] * 100) / 100).replace('.', ',') + ') | ' + SCS.map(function (s, i) { return r1(so[i] - AV.solde[i]); }).join(' / ') + ' |');
var soAuVieuxTaux = SCS.map(function (s) { return Z.solde(Z.versOF ? V5 : V5, s); });
log('| dette / PIB à 10 ans, central (calendrier réel) | ' + pc(AV.dette10) + ' | **' + (dt === null ? 'n/d' : r1(dt * 100) + ' %') + '** | ' + (dt === null ? '' : r1((dt - AV.dette10) * 100) + ' point') + ' |');
log('| smicard seul (€/mois, écart au droit actuel, central) | +' + AV.smic + ' | **' + (ct.smic_seul.ecartMois >= 0 ? '+' : '') + Math.round(ct.smic_seul.ecartMois) + '** | ' + sg(ct.smic_seul.ecartMois - AV.smic) + ' |');
log('| parent isolé au Smic, 2 enfants | +' + AV.parent + ' | **' + (ct.parent_isole_smic.ecartMois >= 0 ? '+' : '') + Math.round(ct.parent_isole_smic.ecartMois) + '** | ' + sg(ct.parent_isole_smic.ecartMois - AV.parent) + ' |');
log('| couple avec un Smic, 2 enfants | +' + AV.couple1 + ' | **' + (ct.couple_1smic_2enf.ecartMois >= 0 ? '+' : '') + Math.round(ct.couple_1smic_2enf.ecartMois) + '** | ' + sg(ct.couple_1smic_2enf.ecartMois - AV.couple1) + ' |');
log('| couple avec deux Smic, 2 enfants | −66 | **' + sg(ct.couple_2smic_2enf.ecartMois) + '** | ' + sg(ct.couple_2smic_2enf.ecartMois - AV.couple2) + ' |');
log('| cadre à 4 Smic | +' + AV.cadre4 + ' | **' + (ct.cadre_4x.ecartMois >= 0 ? '+' : '') + Math.round(ct.cadre_4x.ecartMois) + '** | ' + sg(ct.cadre_4x.ecartMois - AV.cadre4) + ' |');
log('| gestion nette (favorable / central / défavorable) | ' + AV.gestion.map(r1).join(' / ') + ' | **' + SCS.map(function (s, i) { return r1(Z.gestionNette(V5, i)); }).join(' / ') + '** | |');
log('| effectifs et IA | ' + AV.ia.map(r1).join(' / ') + ' | **' + Z.EFFECTIFS_IA.central.map(r1).join(' / ') + '** | |');
log('| variante « IA ambitieuse » : taux d\'équilibre | ' + pc(AV.tauxA) + ' | **' + pc(V5A.tPlat) + '** | ' + r1((V5A.tPlat - AV.tauxA) * 100) + ' point |');
log('');
log('### 18.2 Correction par correction (effet sur la v5 au taux plat inchangé de 40,7 % ; `pas_a_pas_v51.py`, calcul sur une copie du commit 78031b1d)');
log('| correction (ordre cumulatif) | solde favorable / central / défavorable à 40,7 % | variation du central | taux d\'équilibre |');
log('|---|---|---|---|');
[
  ['départ (v5 du 04/11)', '116,8 / +0,75 / −144,8', '', '40,7 %'],
  ['H45 : RSA 1,84 M (V11770)', '117,1 / +1,11 / −144,4', '+0,35', '40,6 %'],
  ['H23 : 27,9 M à 15 h ou plus (V11772)', '117,1 / +1,11 / −144,4', '0,00 (n\'entre pas dans la v5)', '40,6 %'],
  ['H506 : cotées 15 % (V7304)', '116,8 / +0,76 / −144,6', '−0,35', '40,7 %'],
  ['H250 : 0 / 0,07 / 0,136 (V11556)', '118,7 / +0,76 / −144,2', '0,00 (borne du central inchangée)', '40,7 %'],
  ['H252 : 2,0 / 1,5 / 1,0 (V11550, Levy)', '116,0 / +0,28 / −144,2', '−0,48', '40,7 %'],
  ['gestion : base CAF, plafond des départs, coût du socle (V12410)', '113,4 / −0,82 / −144,6', '−1,10', '40,8 %'],
  ['IA : 2,5 / 6 / 15 % (V12411)', '113,1 / −1,13 / −144,6', '−0,31', '40,9 %'],
  ['H508 : rendement locatif 1,7 / 2,0 / 2,7 % (V12420)', '110,8 / −6,98 / −154,2', '−5,85', '41,4 %'],
  ['**Total**', '**−6,0 / −7,7 / −9,4 par rapport au départ**', '**−7,73**', '**+0,7 point**']
].forEach(function (l) { log('| ' + l.join(' | ') + ' |'); });
log('Lecture : **la correction qui pèse est le rendement locatif (H508), −5,9 Md€ sur la taxe de 1 %**, puis la gestion (−1,1) ; les autres sont sous 0,5 Md€. Ces valeurs sont des **faits sourcés** (le brut national de 3,0 % est mesuré), mais ⚠️ la part de charges du bailleur (15 / 25 / 35 %) est une hypothèse sans source primaire (V12533), et deux lignes de gestion (MSA, Agirc-Arrco, caisses ; France Travail) restent comptées sans base publiée (−1,56 Md€ au central si on les retire, V9952).');
log('');
log('### 18.3 Ce qui ne change pas');
log('Le choix des mesures, le socle (350 €), la majoration (400 €), la forme de l\'héritage et du capital de départ, l\'érosion de l\'assiette (H510 : 27,5 % au central, plus prudente que la littérature, V12535-V12538) et les élasticités sans étude (H289 et suivantes) ne sont pas modifiés. Le taux de 41,4 % n\'est pas un choix : c\'est le taux qui équilibre le central avec les données corrigées. **La dette à 10 ans ne baisse toujours pas** (§ 15.5).');
