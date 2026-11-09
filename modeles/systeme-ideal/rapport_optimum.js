// Recherche de l'architecture optimale (chantier 2 de la boucle « meilleur système », 03/11/2026 ; affinage du 03/11 au § 7). Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js optimum.js ../risques/stress.js rapport_optimum.js > resultats-optimum.txt
// (../risques/stress.js : seulement pour la dette à 10 ans du § 9.5 ; sans lui, le § 9.5 renvoie à modeles/risques/resultats-brut.txt)
var Z = this.Optimum, OF = this.OptionsFinancement, T = this.TaxePatrimoine, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r0(x) { return Math.round(x).toLocaleString('fr-FR').replace(/[  ,]/g, ' ').replace('-', '−'); }
function pc(x, d) { return (Math.round(x * 100 * (d ? 10 : 1)) / (d ? 10 : 1)).toString().replace('.', ',').replace('-', '−') + ' %'; }
function trip(o) { return r1(o.bas) + ' / ' + r1(o.central) + ' / ' + r1(o.haut); }
var SCS = ['bas', 'central', 'haut'];
var FIXE = { structurelles: 'A' };   // économies structurelles affichables du chantier 3 (sources/economies-depense-publique.md § 8)

function decrire(a) {
  var t = a.taxe, eco = { aucune: 'aucune', e1: 'e1 (agences, SNU)', e2: 'e2 (+ apprentissage)', e2e3: 'e2 + CIR recentré', e2e4: 'e2 + CIR supprimé' }[a.economies];
  return 'taux plat ' + pc(a.tPlat, 1) + ' ; socle ' + a.socle + ' € ; taxe à 1 % : ' + (t ? (t.assiette === 'pierreNet' ? 'nette de dettes' : 'brute') + (t.abattement ? ', abattement ' + r0(t.abattement) + ' €' : ', sans abattement')
    + (t.plafond ? ', plafonnée à ' + pc(t.plafond) + ' du revenu (reliquat différé)' : ', sans plafonnement') + (t.nonCotesVente ? ', non-cotés taxés à la vente' : '') : 'aucune')
    + ' ; héritage ' + pc(a.tHeritage) + ' plafonné à 50 % tous impôts confondus, conjoint exonéré ; fin du report 150-0 B ter : ' + (a.report150 ? 'oui' : 'non') + ' ; économies : ' + eco
    + ' ; économies structurelles : ' + a.structurelles + ' ; niches TVA et accises supprimées : ' + (a.nichesTVA ? 'oui' : 'non') + ' ; éducation : ' + (a.education === 'economie' ? 'variante « économie »' : 'redéploiement vers le tuteur (défaut tranché)')
    + (a.capitalDepart ? ' ; capital de départ C (40 000 € à 25 ans, dégressif)' : '') + (a.exemptionVie ? ' ; héritage « reçu à vie », exemption ' + r0(a.exemptionVie) + ' €' : ' ; héritage dès le premier euro')
    + ' ; majoration parent isolé ' + r0(a.majParentIsole) + ' €/enfant ; aide au logement des retraités locataires maintenue : ' + (a.alRetraites ? 'oui' : 'non')
    + (a.abattementActivite ? ' ; abattement de ' + r0(a.abattementActivite) + ' €/mois sur les revenus d\'activité' : '') + (a.bonusActivite ? ' ; bonus d\'activité de ' + r0(a.bonusActivite) + ' € (extinction à ' + String(a.bonusFin).replace('.', ',') + ' Smic)' : '')
    + (a.ppaMaintenue ? ' ; prime d\'activité maintenue à ' + pc(a.ppaMaintenue) + ' du barème actuel' : '') + (a.cleMajoration === 'cas' ? ' ; majoration répartie sur les dixièmes des parents isolés (H556)' : '');
}
function fiche(titre, e) {
  var a = e.a;
  log('\n### ' + titre);
  log('Architecture : ' + decrire(a) + '.');
  log('Solde (Md€/an, croisière, déficit actuel compris) bas / central / haut : **' + trip(e.soldes) + '**');
  var d = Z.detail(a, 'central');
  log('Décomposition au central : options (palier 1 au taux et au socle, réforme immobilière, décès, fin de purge AV, report, économies e1-e4) ' + r1(d.options) + ' ; écart d\'héritage ' + r1(d.heritage)
    + ' ; décès plafonné ' + r1(d.deces) + ' ; exception du conjoint ' + r1(d.conjoint) + ' ; taxe à 1 % ' + r1(d.taxe) + ' ; correctifs ' + r1(d.correctifs) + ' ; économies structurelles ' + r1(d.structurelles)
    + ' ; niches TVA ' + r1(d.nichesTVA) + ' ; éducation ' + r1(d.education) + ' ; exemption « reçu à vie » ' + r1(d.exemptionVie) + ' ; capital de départ ' + r1(d.capitalDepart) + ' = ' + r1(d.total));
  log('Contraintes : ' + e.contraintes.map(function (c, i) { return Z.NOMS[i] + ' : ' + (c ? 'TENUE' : 'NON TENUE (écart ' + r1(e.violations[i]) + ')'); }).join(' ; '));
  log('Taux marginal effectif à l\'infini : ' + pc(e.margMax, 1) + ' ; effort du retraité propriétaire modeste (maison 300 000 €, pension 1 400 €) : ' + pc(e.effort, 1) + ' du revenu ; fondateur (10 M€ de parts non cotées, 4 000 €/mois) : ' + pc(Z.effort(Z.HYP.fondateur, a), 1));
  log('Dixièmes de niveau de vie (€/UC/mois, central ; palier + correctifs − taxe à 1 % payée nette de la taxe foncière = écart ; « dû » : taxe due, créance différée comprise) :');
  log('| | ' + e.deciles.map(function (x) { return x.decile; }).join(' | ') + ' |');
  log('|---|' + e.deciles.map(function () { return '---'; }).join('|') + '|');
  log('| palier (taux, socle) | ' + e.deciles.map(function (x) { return r0(x.palier); }).join(' | ') + ' |');
  log('| correctifs (a) + (b) | ' + e.deciles.map(function (x) { return r0(x.correctifs); }).join(' | ') + ' |');
  log('| taxe à 1 % payée | ' + e.deciles.map(function (x) { return r0(x.taxe); }).join(' | ') + ' |');
  log('| **écart** | ' + e.deciles.map(function (x) { return '**' + r0(x.ecart) + '**'; }).join(' | ') + ' |');
  log('| écart, taxe due | ' + e.deciles.map(function (x) { return r0(x.economique); }).join(' | ') + ' |');
  var ct = e.cas; log('Cas types (€/mois, écart au droit actuel, central) : ' + Object.keys(ct).map(function (k) { return ct[k].libelle + ' ' + r0(ct[k].ecartMois); }).join(' ; '));
  var p = Z.prelevements(a, 'central');
  log('Prélèvements obligatoires (central) : ' + r0(p.total) + ' Md€ (' + pc(p.partPIB, 1) + ' du PIB) contre ' + r0(p.actuel) + ' aujourd\'hui (42,7 %), soit ' + r1(p.delta) + ' ; nets des transferts du socle (socle + enfants − prestations remplacées : ' + r1(p.transfertsNets) + ') : ' + r1(p.deltaNet) + ' Md€ ('
    + pc(p.deltaNet / 2935, 1) + ' du PIB). Objectif « au moins autant de recettes qu\'aujourd\'hui » : ' + (p.deltaNet >= 0 ? 'atteint' : 'non atteint') + '.');
  var cx = e.complexite; log('Simplicité : ' + cx.regles + ' règles, ' + cx.exceptions + ' exceptions (' + cx.liste.join(', ') + ' ; niches maintenues : ' + cx.niches + ') : total ' + cx.total + '.');
  var tx = d.taxeDetail;
  if (a.taxe) log('Taxe à 1 % : brute ' + r1(tx.brute) + ', part différée ' + pc(tx.partDifferee, 1) + ' (' + r1(tx.differe) + ' Md€/an), perte en croisière ' + r1(tx.perteDiffere) + ', nette ' + r1(tx.nette) + ' ; trésorerie des premières années : ' + r1(tx.tresorerieAn1) + ' Md€/an (créances non échues) ; stock de créances en régime : ' + r0(tx.stockCreances) + ' Md€.');
  var t1 = Z.transition(a, 1, 5, Math.min(250, a.socle)), t3 = Z.transition(a, 3, 5, Math.min(250, a.socle));
  log('Transition (montée du socle sur 5 ans depuis 250 €, taxe en trésorerie) : année 1 (socle ' + r0(t1.socle) + ' €) solde ' + trip(t1.soldes) + ', D1 ' + r0(t1.deciles[0].ecart) + ' €/UC/mois, smicard ' + r0(t1.cas.smic_seul.ecartMois)
    + ' ; année 3 (socle ' + r0(t3.socle) + ' €) solde ' + trip(t3.soldes) + ', D1 ' + r0(t3.deciles[0].ecart) + '.');
  var se = Z.sensibilites(a);
  log('Paramètres les plus fragiles (Δ solde central, Md€) : ' + se.liste.map(function (x, i) { return (i < 3 ? '**' : '') + x.nom + ' : ' + r1(x.delta) + (i < 3 ? '**' : ''); }).join(' ; '));
  var edu = F(a, { education: a.education === 'economie' ? 'tuteurRedeploye' : 'economie' });
  log('Écart éducation (pour la synthèse) : passer à « ' + (edu.education === 'economie' ? 'économie' : 'redéploiement vers le tuteur') + ' » change le solde de ' + trip({ bas: Z.solde(edu, 'bas') - e.soldes.bas, central: Z.solde(edu, 'central') - e.soldes.central, haut: Z.solde(edu, 'haut') - e.soldes.haut }) + ' Md€.');
}

log('# Recherche de l\'architecture optimale (chantier 2, 03/11/2026) : résultats (fait foi)');
log('Md€/an de 2024, régime de croisière statique, déficit actuel compris ; scénarios du palier 1 (bas = réactions faibles, favorable ; haut = défavorable), modules patrimoine croisés.');
log('Toujours en place : réforme immobilière (RP exonérée, base réelle, fin des DMTO), décès = réalisation avec imputation sur les droits, fin de la purge de l\'assurance-vie, correctif (a), économies structurelles A du chantier 3 (16,1 / 11,7 / 5,8).');
log('Grille : taux plat ' + Z.GRILLE.tPlat.length + ' valeurs (35 à 45 %, pas de 0,5 point) × socle ' + Z.GRILLE.socle.length + ' (350 à 600 €) × taxe ' + Z.GRILLE.taxe.length + ' variantes × héritage ' + Z.GRILLE.tHeritage.length + ' × report 2 × économies 5 × majoration parent isolé ' + Z.GRILLE.majParentIsole.length + ' × niches TVA 2 ; éducation fixée au redéploiement vers le tuteur (défaut tranché, Q10), écart affiché.');
log('Seuil de la contrainte (2) : ' + r1(Z.SEUIL_HAUT) + ' Md€ (3 % du PIB 2024).');

var t0 = Date.now();
var R = Z.rechercher({ fixe: FIXE });
log('\n## 1. Architecture retenue (ordre de priorité des contraintes ; « au mieux » = plus petite violation de la première contrainte non tenue ; puis taux plat le plus bas, socle le plus haut, moins de règles, meilleur solde au haut)');
log('Architectures évaluées : ' + r0(R.evalues) + ' ; nombre d\'architectures dont les contraintes tenues commencent par (1), (1)-(2), (1)-(3), … : '
  + R.prefixeTenu.map(function (n, k) { return k === 0 ? 'aucune tenue dès (1) : ' + r0(n) : 'tenues jusqu\'à (' + k + ') : ' + r0(n); }).join(' ; '));
fiche('Architecture retenue', R.meilleur);

// Alternatives
function prefSans2(x, y) {   // (2) ignorée, ordre (1), (3), (4), (5), (6)
  var X = { contraintes: x.contraintes.slice(), violations: x.violations.slice() }, Y = { contraintes: y.contraintes.slice(), violations: y.violations.slice() };
  X.contraintes[1] = Y.contraintes[1] = true;
  var c = Z.cmpViolations(X, Y); if (c) return c > 0;
  if (Math.abs(x.a.tPlat - y.a.tPlat) > 1e-9) return x.a.tPlat < y.a.tPlat;
  if (x.a.socle !== y.a.socle) return x.a.socle > y.a.socle;
  if (x.complexite.total !== y.complexite.total) return x.complexite.total < y.complexite.total;
  return x.soldes.haut > y.soldes.haut;
}
function prefSocle(x, y) {   // (2) ignorée ; socle le plus haut d'abord
  var X = { contraintes: x.contraintes.slice(), violations: x.violations.slice() }, Y = { contraintes: y.contraintes.slice(), violations: y.violations.slice() };
  X.contraintes[1] = Y.contraintes[1] = true;
  var c = Z.cmpViolations(X, Y); if (c) return c > 0;
  if (x.a.socle !== y.a.socle) return x.a.socle > y.a.socle;
  if (Math.abs(x.a.tPlat - y.a.tPlat) > 1e-9) return x.a.tPlat < y.a.tPlat;
  if (x.complexite.total !== y.complexite.total) return x.complexite.total < y.complexite.total;
  return x.soldes.haut > y.soldes.haut;
}
log('\n## 2. Architectures alternatives');
var B = Z.rechercher({ fixe: FIXE, pref: prefSans2 }).meilleur;
fiche('Alternative « ne perdre personne, taux bas » : contrainte (2) relâchée, puis taux plat le plus bas', B);
var Cs = Z.rechercher({ fixe: FIXE, pref: prefSocle }).meilleur;
fiche('Alternative « socle généreux » : contrainte (2) relâchée, socle le plus haut d\'abord', Cs);
var Dn = Z.rechercher({ fixe: FIXE, grille: { taxe: [null] } }).meilleur;
fiche('Contre-épreuve « sans taxe à 1 % » (même ordre que l\'architecture retenue)', Dn);

log('\n## 2 bis. Avec le paquet du chantier 4 imposé : capital de départ C + héritage « reçu à vie » à 100 000 € d\'exemption (recommandation de Claude)');
var FIXE4 = F(FIXE, { capitalDepart: true, exemptionVie: 100000 });
var R4 = Z.rechercher({ fixe: FIXE4 });
log('Architectures évaluées : ' + r0(R4.evalues) + ' ; tenues jusqu\'à (1) / (2) / (3) : ' + r0(R4.prefixeTenu[1]) + ' / ' + r0(R4.prefixeTenu[2]) + ' / ' + r0(R4.prefixeTenu[3]));
fiche('Architecture retenue avec (a) + (b) (même ordre de priorité)', R4.meilleur);
fiche('Avec (a) + (b), « ne perdre personne, taux bas » ((2) relâchée)', Z.rechercher({ fixe: FIXE4, pref: prefSans2 }).meilleur);
var FIXE5 = F(FIXE, { capitalDepart: true, exemptionVie: 50000 });
fiche('Variante moins chère : capital C + exemption de 50 000 €, « ne perdre personne, taux bas »', Z.rechercher({ fixe: FIXE5, pref: prefSans2 }).meilleur);

// Tables
var A = R.meilleur.a;
log('\n## 3. Valeur de chaque levier autour de l\'architecture retenue (Δ solde bas / central / haut, Md€ ; un levier à la fois)');
log('| levier | Δ solde | contraintes après |');
log('|---|---|---|');
function leve(nom, b) { var e = Z.evaluer(b); log('| ' + nom + ' | ' + trip({ bas: e.soldes.bas - R.meilleur.soldes.bas, central: e.soldes.central - R.meilleur.soldes.central, haut: e.soldes.haut - R.meilleur.soldes.haut }) + ' | ' + e.contraintes.map(function (c, i) { return c ? '(' + (i + 1) + ')' : '·'; }).join(' ') + ' |'); }
leve('taux plat +1 point', F(A, { tPlat: A.tPlat + 0.01 }));
leve('taux plat −1 point', F(A, { tPlat: A.tPlat - 0.01 }));
leve('socle +50 €', F(A, { socle: A.socle + 50 }));
leve('socle −50 €', F(A, { socle: Math.max(300, A.socle - 50) }));
leve('sans taxe à 1 %', F(A, { taxe: null }));
leve('taxe nette de dettes', F(A, { taxe: F(A.taxe || {}, { assiette: 'pierreNet' }) }));
leve('taxe : abattement de 100 000 €', F(A, { taxe: F(A.taxe || { assiette: 'pierre' }, { abattement: 100000 }) }));
leve('taxe : non-cotés taxés à la vente', F(A, { taxe: F(A.taxe || { assiette: 'pierre' }, { nonCotesVente: true }) }));
leve('héritage 45 %', F(A, { tHeritage: 0.45 }));
leve('héritage 40 %', F(A, { tHeritage: 0.40 }));
leve('sans exception du conjoint', F(A, { exceptionConjoint: false }));
leve('report 150-0 B ter maintenu', F(A, { report150: false }));
leve('aucune économie e1-e4', F(A, { economies: 'aucune' }));
leve('économies structurelles A + B (réserve)', F(A, { structurelles: 'AB' }));
leve('sans économies structurelles', F(A, { structurelles: 'aucune' }));
leve('niches TVA et accises : ' + (A.nichesTVA ? 'maintenues' : 'supprimées'), F(A, { nichesTVA: !A.nichesTVA }));
leve('majoration parent isolé à 200,78 € (ASF)', F(A, { majParentIsole: 200.78 }));
leve('sans aide au logement des retraités', F(A, { alRetraites: false }));
leve('éducation : variante « économie » au lieu du redéploiement', F(A, { education: 'economie' }));
leve('capital de départ C', F(A, { capitalDepart: true }));
leve('héritage « reçu à vie », exemption 100 000 €', F(A, { exemptionVie: 100000 }));
leve('héritage « reçu à vie », exemption 50 000 €', F(A, { exemptionVie: 50000 }));
leve('capital C + exemption 100 000 €', F(A, { capitalDepart: true, exemptionVie: 100000 }));

log('\n## 4. Seuils de protection de la taxe à 1 % : plafonnement au revenu (modèle : CGI art. 1391 B ter, dégrèvement de la taxe foncière au-delà de 50 % des revenus sous condition de revenu fiscal)');
log('Le plafonnement ne vaut que sous la médiane du revenu disponible par UC (' + r0(Z.seuilPlafond()) + ' €/UC/an, DINA), comme le dégrèvement de 1391 B ter réservé aux revenus modestes (H539).');
log('Assiette de l\'architecture retenue (' + (A.taxe ? A.taxe.assiette : 'pierre') + ', abattement ' + r0(A.taxe ? A.taxe.abattement : 0) + ' €). Le reliquat est une créance récupérée à la vente ou à la succession (recouvrement 90 / 95 / 100 %, intérêt au taux de la dette).');
log('| plafond | part différée | différé (Md€/an, central) | trésorerie des premières années | perte en croisière (b / c / h) | recette nette (b / c / h) | effort du retraité modeste | stock de créances en régime |');
log('|---|---|---|---|---|---|---|---|');
[null, 0.05, 0.10, 0.15].forEach(function (pl) {
  var b = F(A, { taxe: F(A.taxe || { assiette: 'pierre', abattement: 0 }, { plafond: pl }) }), c = Z.taxe('central', b);
  log('| ' + (pl ? pc(pl) : 'aucun') + ' | ' + pc(c.partDifferee, 1) + ' | ' + r1(c.differe) + ' | ' + r1(c.tresorerieAn1) + ' | ' + SCS.map(function (s) { return r1(Z.taxe(s, b).perteDiffere || 0); }).join(' / ') + ' | ' + SCS.map(function (s) { return r1(Z.taxe(s, b).nette); }).join(' / ')
    + ' | ' + pc(Z.effort(Z.HYP.retraiteModeste, b), 1) + ' | ' + r0(c.stockCreances) + ' |');
});
Z.HYP.plafondSousConditionRevenu = false;
[0.05, 0.10, 0.15].forEach(function (pl) {
  var b = F(A, { taxe: F(A.taxe || { assiette: 'pierre', abattement: 0 }, { plafond: pl }) }), c = Z.taxe('central', b);
  log('| ' + pc(pl) + ' sans condition de revenu | ' + pc(c.partDifferee, 1) + ' | ' + r1(c.differe) + ' | ' + r1(c.tresorerieAn1) + ' | ' + SCS.map(function (s) { return r1(Z.taxe(s, b).perteDiffere || 0); }).join(' / ') + ' | ' + SCS.map(function (s) { return r1(Z.taxe(s, b).nette); }).join(' / ')
    + ' | ' + pc(Z.effort(Z.HYP.retraiteModeste, b), 1) + ' | ' + r0(c.stockCreances) + ' |');
});
Z.HYP.plafondSousConditionRevenu = true;
log('Charge de trésorerie de la taxe par dixième (€/UC/mois, nette de la taxe foncière supprimée), selon le plafond :');
[null, 0.05, 0.10, 0.15].forEach(function (pl) { var t = F(A.taxe || { assiette: 'pierre', abattement: 0 }, { plafond: pl }); log('- ' + (pl ? pc(pl) : 'aucun') + ' : ' + Z.distributionTaxe(t).chargeTresorerie.map(r0).join(' / ')); });

log('\n## 5. Frontière taux plat × socle (meilleure combinaison des autres leviers ; contraintes (1), (3)-(6) ; colonne « haut » : solde au haut de cette combinaison)');
log('| taux plat | socle le plus haut tenant (1) et (3)-(6) | solde central | solde haut | tient aussi (2) ? |');
log('|---|---|---|---|---|');
Z.GRILLE.tPlat.filter(function (t, i) { return i % 2 === 0; }).forEach(function (t) {
  var r = Z.rechercher({ fixe: FIXE, grille: { tPlat: [t] }, pref: prefSocle }).meilleur, ok = r.contraintes[0] && r.contraintes[2] && r.contraintes[3] && r.contraintes[4] && r.contraintes[5];
  log('| ' + pc(t, 1) + ' | ' + (ok ? r.socle === undefined ? r.a.socle + ' €' : r.a.socle + ' €' : 'aucun (meilleur : ' + r.a.socle + ' €, ' + r.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join('') + ' non tenues)') + ' | ' + r1(r.soldes.central) + ' | ' + r1(r.soldes.haut) + ' | ' + (r.contraintes[1] ? 'oui' : 'non') + ' |');
});

log('\n## 6. Héritage plafonné');
SCS.forEach(function (s) {
  var a = Z.archi(A);
  log('- ' + s + ' : droits à 50 % ' + r1(Z.droits(s, 0.5)) + ' Md€ ; impôt sur le gain au décès au-delà des droits (sous le plafond) : ' + r1(Z.decesPlafonne(s, a)) + ' ; coût de l\'exception du conjoint : ' + r1(Z.coutConjoint(s, a)) + ' ; taux maximal sur une transmission : ' + pc(Z.tauxTransmissionMax(a)));
});
log('Sans imputation (cumul de l\'impôt sur le gain et des droits), le taux sur une transmission dont la plus-value égale la valeur atteindrait ' + pc(A.tHeritage + A.tPlat * (1 - A.tHeritage), 1) + ' (contrainte (4) violée) ; avec le prix d\'acquisition reporté (carryover), l\'héritier paierait en plus le taux plat sur le gain à la revente.');

// ======================================================================
// 7. Affinage du 03/11 (H549-H560)
// ======================================================================
log('\n## 7. Affinage du 03/11 : protéger le smicard et le couple avec un Smic, stabiliser, mesurer la pression fiscale');
var REC = Z.archi(Z.RECOMMANDATION), LP = Z.CAS_PROTEGES_AFFINAGE;
log('Point de départ : la recommandation du § 2 bis, plus les titres non cotés taxés à la vente (ajoutés par défaut). Contrainte (3) élargie (H550) : D1-D3, parent isolé au Smic, retraité locataire, **salarié seul au Smic et couple avec un Smic** non perdants. La (2) reste relâchée, comme dans la recommandation.');
var e0 = Z.evaluer(REC, LP);
log('Recommandation + non-cotés à la vente : solde ' + trip(e0.soldes) + ' ; smicard ' + r0(e0.cas.smic_seul.ecartMois) + ' €/mois, couple avec un Smic ' + r0(e0.cas.couple_1smic_2enf.ecartMois) + ' ; contraintes non tenues : '
  + e0.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() + ' (écart (1) : ' + r1(e0.violations[0]) + ' Md€ ; écart (3) : ' + r0(e0.violations[2]) + ' €/mois).');

function ligneCas(e) { var c = e.cas; return [c.smic_seul, c.couple_1smic_2enf, c.couple_2smic_2enf, c.parent_isole_smic, c.retraite_aspa_loc, c.cadre_4x].map(function (x) { return r0(x.ecartMois); }).join(' / '); }
function incit(a, x) { var i = Z.incitations(a, [x])[0]; return i; }
// 7.1 À protection égale, au taux de 40 % (sans refinancement)
log('\n### 7.1 Les leviers à protection égale (taux plat 40 %, socle 350 €, majoration 500 €, sans refinancement : coût brut de la protection)');
log('Montant minimal pour que le smicard ne perde plus, puis pour que le couple avec un Smic ne perde plus non plus. Cas types en €/mois : smicard / couple un Smic / couple deux Smic / parent isolé Smic / retraité locataire / cadre 6 Smic. TME : taux marginal effectif d\'un adulte seul locataire (+1 % de salaire) ; TP : taux de participation (part du coût employeur perdue en passant de 0 au Smic, plancher RSA de 877 € sans revenu) ; actuel (OpenFisca 2026) entre parenthèses.');
log('| levier | montant | coût b / c / h (Md€/an) | cas types | gain D1 / D5 / D10 (€/UC/mois) | TME à 0,5 / 1 / 1,25 Smic | TP au Smic | paramètres |');
log('|---|---|---|---|---|---|---|---|');
function minimal(fa, lo, hi, test) { var i, a = lo, b = hi; if (!test(fa(hi))) return null; for (i = 0; i < 40; i++) { var m = (a + b) / 2; if (test(fa(m))) b = m; else a = m; } return b; }
var smicOK = function (e) { return e.cas.smic_seul.ecartMois >= -0.5; }, coupleOK = function (e) { return smicOK(e) && e.cas.couple_1smic_2enf.ecartMois >= -0.5; };
var LEV = [
  { nom: '(1) abattement sur les premiers revenus d\'activité (€/mois)', f: function (v) { return F(REC, { abattementActivite: Math.ceil(v) }); }, lo: 0, hi: 1500, par: 1 },
  { nom: '(2) bonus d\'activité, extinction à 1,3 Smic (€/mois)', f: function (v) { return F(REC, { bonusActivite: Math.ceil(v), bonusFin: 1.3 }); }, lo: 0, hi: 600, par: 3 },
  { nom: '(2) bonus d\'activité, extinction à 1,6 Smic (€/mois)', f: function (v) { return F(REC, { bonusActivite: Math.ceil(v), bonusFin: 1.6 }); }, lo: 0, hi: 600, par: 3 },
  { nom: '(4) prime d\'activité maintenue (part du barème)', f: function (v) { return F(REC, { ppaMaintenue: Math.ceil(v * 100) / 100 }); }, lo: 0, hi: 1, par: Z.PPA_PARAMETRES, pct: true }
];
var i0 = Z.incitations(REC, [0.5, 1, 1.25]);
log('| aucun | — | 0 | ' + ligneCas(e0) + ' | 0 / 0 / 0 | ' + i0.map(function (x) { return pc(x.tmeApres) + ' (' + pc(x.tmeAvant) + ')'; }).join(' / ') + ' | ' + pc(i0[1].tpApres) + ' (' + pc(i0[1].tpAvant) + ') | 0 |');
LEV.forEach(function (L) {
  [['smicard', smicOK], ['smicard et couple', coupleOK]].forEach(function (cible) {
    var v = minimal(function (x) { return Z.evaluer(L.f(x), LP); }, L.lo, L.hi, cible[1]);
    if (v === null) { log('| ' + L.nom + ' | ' + cible[0] + ' : hors plage | | | | | | |'); return; }
    var a = Z.archi(L.f(v)), e = Z.evaluer(a, LP), pd = Z.protectionDeciles(a), inc = Z.incitations(a, [0.5, 1, 1.25]);
    log('| ' + L.nom + ' — ' + cible[0] + ' | ' + (L.pct ? pc(a.ppaMaintenue) : r0(a.abattementActivite || a.bonusActivite) + ' €') + ' | ' + SCS.map(function (s) { return r1(Z.coutProtection(a, s).total); }).join(' / ') + ' | ' + ligneCas(e)
      + ' | ' + [0, 4, 9].map(function (k) { return r0(pd[k]); }).join(' / ') + ' | ' + inc.map(function (x) { return pc(x.tmeApres); }).join(' / ') + ' | ' + pc(inc[1].tpApres) + ' | ' + L.par + ' |');
  });
});
log('(3) Socle plus haut financé par le taux (sans autre levier, majoration 400 €, clé corrigée) : taux plat minimal pour l\'équilibre central, et cas types :');
log('| socle | taux plat minimal (solde central ≥ 0) | solde haut | smicard | couple un Smic | D1 |');
log('|---|---|---|---|---|---|');
[350, 400, 450, 500, 550, 600].forEach(function (so) {
  var t = null, k;
  for (k = 350; k <= 500; k += 5) { var b = F(REC, { socle: so, tPlat: k / 1000, majParentIsole: 400, cleMajoration: 'cas' }); if (Z.solde(b, 'central') >= 0) { t = k / 1000; break; } }
  if (t === null) { log('| ' + so + ' € | > 50 % | | | | |'); return; }
  var e = Z.evaluer(F(REC, { socle: so, tPlat: t, majParentIsole: 400, cleMajoration: 'cas' }), LP);
  log('| ' + so + ' € | ' + pc(t, 1) + ' | ' + r1(e.soldes.haut) + ' | ' + r0(e.cas.smic_seul.ecartMois) + ' | ' + r0(e.cas.couple_1smic_2enf.ecartMois) + ' | ' + r0(e.deciles[0].ecart) + ' |');
});

// 7.2 Variantes financées
log('\n### 7.2 Variantes financées : recherche ciblée (taux 36 à 45 % × socle 350 à 600 € × majoration 200,78 à 500 € × levier), contrainte (3) élargie, clé de majoration corrigée (H556)');
log('Ordre : (1), (3) élargie, (4), (5), (6) ; puis taux plat le plus bas, le moins de règles, le moins de paramètres, le socle le plus haut, le meilleur solde au haut (H559).');
log('| famille de levier | architecture | solde b / c / h | coût de la protection (c) | contraintes non tenues | cas types | D1 / D2 / D3 / D10 | règles + exceptions |');
log('|---|---|---|---|---|---|---|---|');
var FAM = { aucun: 'aucun levier (socle et taux seuls)', abattement: '(1) abattement', bonus: '(2) bonus d\'activité', ppa: '(4) prime d\'activité maintenue' }, FIN = null;
Object.keys(FAM).forEach(function (nm) {
  var x = Z.affiner({ base: { cleMajoration: 'cas' }, filtre: function (l) { return l.nom === nm; } }), e = x.meilleur, a = e.a;
  if (nm === 'ppa') FIN = e;
  log('| ' + FAM[nm] + ' | ' + pc(a.tPlat, 1) + ', socle ' + a.socle + ' €, majoration ' + r0(a.majParentIsole) + ' €' + (a.abattementActivite ? ', abattement ' + a.abattementActivite + ' €' : '') + (a.bonusActivite ? ', bonus ' + a.bonusActivite + ' € (fin ' + String(a.bonusFin).replace('.', ',') + ' Smic)' : '') + (a.ppaMaintenue ? ', PPA ' + pc(a.ppaMaintenue) : '')
    + ' | ' + trip(e.soldes) + ' | ' + r1(Z.coutProtection(a, 'central').total) + ' | ' + (e.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() || 'aucune') + (e.contraintes[2] ? '' : ' (écart (3) : ' + r0(e.violations[2]) + ' €)')
    + ' | ' + ligneCas(e) + ' | ' + [0, 1, 2, 9].map(function (k) { return r0(e.deciles[k].ecart); }).join(' / ') + ' | ' + e.complexite.regles + ' + ' + e.complexite.exceptions + ' |');
});
var Xpf = Z.affiner({ filtre: function (l) { return l.nom === 'ppa'; } }).meilleur;
log('Avec l\'ancienne clé de majoration (prestations familiales, H540) : ' + pc(Xpf.a.tPlat, 1) + ', majoration ' + r0(Xpf.a.majParentIsole) + ' €, PPA ' + pc(Xpf.a.ppaMaintenue) + ' → ' + trip(Xpf.soldes) + '.');

// 7.3 Architecture finale
log('\n### 7.3 Architecture finale recommandée (affinage du 03/11)');
log('Contrainte (3) élargie au smicard et au couple avec un Smic dans la ligne « Contraintes » ci-dessous (le libellé (3) reste celui du § 1).');
fiche('Architecture finale', FIN);
log('Incitation au travail (adulte seul locataire ; système proposé contre droit actuel) :');
log('| salaire (Smic brut) | coût employeur | revenu disponible proposé / actuel | TME proposé / actuel | TP proposé / actuel |');
log('|---|---|---|---|---|');
Z.incitations(FIN.a).forEach(function (x) { log('| ' + String(x.x).replace('.', ',') + ' | ' + r0(x.cout) + ' | ' + r0(x.apres) + ' / ' + r0(x.avant) + ' | ' + pc(x.tmeApres) + ' / ' + pc(x.tmeAvant) + ' | ' + pc(x.tpApres) + ' / ' + pc(x.tpAvant) + ' |'); });
var npa = Z.evaluer(F(FIN.a, { ppaMaintenue: 0 }), LP);
log('Sensibilité au non-recours (H554) : la dépense observée de 10,65 Md€ intègre le non-recours actuel ; un versement automatique (sans demande) au taux de recours de 100 % coûterait davantage (+' + r1(FIN.a.ppaMaintenue * 10.65 * (1 / 0.66 - 1)) + ' Md€ si le recours actuel est de 66 %, ⚠️ V7874). Un smicard qui ne demande pas la prime perd ' + r0(npa.cas.smic_seul.ecartMois) + ' €/mois.');

// 7.4 Clé de la majoration
log('\n### 7.4 Artefact H540 : clé de répartition de la majoration parent isolé');
var kpf = Z.clePF(), kc = Z.cleCas(), ucs = this.GagnantsPerdants.ucParDecile();
log('Part de la majoration reçue par chaque dixième, clé des prestations familiales (H540) : ' + kpf.map(function (x, i) { return pc(x * ucs[i] * 1e6 * 12); }).join(' / '));
log('Part, clé des parents isolés (H556 : 70 % au travail au dixième du parent isolé au Smic, 30 % au dixième du parent isolé au RSA majoré) : ' + kc.map(function (x, i) { return pc(x * ucs[i] * 1e6 * 12); }).join(' / '));
var dpf = Z.deciles(F(FIN.a, { cleMajoration: 'pf' })), dc = Z.deciles(FIN.a);
log('Architecture finale, écart par dixième (€/UC/mois) : clé PF ' + dpf.map(function (x) { return r0(x.ecart); }).join(' / ') + ' ; clé parents isolés ' + dc.map(function (x) { return r0(x.ecart); }).join(' / ') + '.');
var dsm = Z.deciles(F(FIN.a, { majParentIsole: 0 }));
log('Sans aucune majoration (même architecture) : ' + dsm.map(function (x) { return r0(x.ecart); }).join(' / ') + '.');

// 7.5 Stabilisateur
log('\n### 7.5 Règle de stabilisation automatique (H560) : si le solde constaté s\'écarte de plus de 15 Md€ (0,5 % du PIB) de l\'équilibre, le levier bouge d\'un cran l\'année suivante');
log('Taux : ±0,5 point par an, dans ±2 points autour du taux voté. Socle : ∓25 € par an, dans ±100 €. Scénario supposé réalisé dès l\'an 1 (croisière statique), 10 ans.');
log('| scénario | levier | trajectoire du solde (an 1 → an 5 → an 10) | taux / socle à l\'an 10 | gain (Md€) | smicard à l\'an 10 | D1 à l\'an 10 | (2) tenue à l\'an 10 ? |');
log('|---|---|---|---|---|---|---|---|');
SCS.forEach(function (sc) { [['taux', 'taux plat'], ['socle', 'socle'], ['les deux', 'taux et socle']].forEach(function (lv) {
  var st = Z.stabilisateur(FIN.a, sc, { levier: lv[0] }), tj = st.trajectoire;
  log('| ' + sc + ' | ' + lv[1] + ' | ' + r1(tj[0].solde) + ' → ' + r1(tj[4].solde) + ' → ' + r1(tj[9].solde) + ' | ' + pc(st.final.tPlat, 1) + ' / ' + st.final.socle + ' € | ' + r1(st.gain) + ' | ' + r0(st.casFinal.smic_seul.ecartMois) + ' | ' + r0(st.decilesFinal[0].ecart) + ' | ' + (sc === 'haut' ? (st.final.solde >= Z.SEUIL_HAUT ? 'oui' : 'non') : '—') + ' |');
}); });
var st4 = Z.stabilisateur(FIN.a, 'haut', { levier: 'taux', marge: 0.045 });
log('Taux seul avec une marge portée à 4,5 points (jusqu\'au plafond de 75 % du taux marginal à l\'infini) : solde au haut à l\'an 10 ' + r1(st4.final.solde) + ' (taux ' + pc(st4.final.tPlat, 1) + ', smicard ' + r0(st4.casFinal.smic_seul.ecartMois) + ').');
var pt = [0.385, 0.405, 0.425, 0.445].map(function (t) { return pc(t, 1) + ' : ' + r1(Z.solde(F(FIN.a, { tPlat: t }), 'haut')) + ' (central ' + r1(Z.solde(F(FIN.a, { tPlat: t }), 'central')) + ')'; });
log('Solde au haut selon le taux plat (architecture finale) : ' + pt.join(' ; ') + '.');

// 7.6 Pression fiscale
log('\n### 7.6 Pression fiscale nette du socle (H557) : variation des prélèvements obligatoires nets des transferts du socle (socle + enfants + bonus ou prime d\'activité − prestations remplacées), central');
log('Identité : variation nette = (solde − déficit actuel de ' + r1(-169.1) + ' Md€) + dépenses nettes nouvelles hors socle (correctifs, capital de départ, assurance chômage conservée, éducation… moins les économies).');
log('| architecture | taux plat | solde central | variation nette (Md€) | en points de PIB | dont combler le déficit actuel | dont dépenses nettes nouvelles | PO bruts (% du PIB) |');
log('|---|---|---|---|---|---|---|---|');
function lignePO(nom, a) { var p = Z.pressionNette(a); log('| ' + nom + ' | ' + pc(a.tPlat, 1) + ' | ' + r1(p.solde) + ' | ' + r1(p.deltaNet) + ' | ' + r1(100 * p.partPIB) + ' | ' + r1(p.deficitComble) + ' | ' + r1(p.depensesNettes) + ' | ' + pc(p.poPartPIB, 1) + ' |'); }
lignePO('recommandation du chantier 2 (§ 2 bis)', Z.archi(F(Z.RECOMMANDATION, { taxe: F(Z.RECOMMANDATION.taxe, { nonCotesVente: false }) })));
lignePO('architecture « assurance » (§ 1)', R.meilleur.a);
lignePO('architecture finale (§ 7.3)', FIN.a);
var POV = [['+ économies structurelles A + B', { structurelles: 'AB' }], ['+ éducation « économie »', { education: 'economie' }], ['+ A + B et éducation « économie »', { structurelles: 'AB', education: 'economie' }]], MINPO = null;
POV.forEach(function (v) { var x = Z.affiner({ base: F(v[1], { cleMajoration: 'cas' }) }).meilleur; if (!MINPO || Z.pressionNette(x.a).deltaNet < Z.pressionNette(MINPO.a).deltaNet) MINPO = x;
  lignePO('finale ' + v[0] + ' (PPA ' + pc(x.a.ppaMaintenue) + ', majoration ' + r0(x.a.majParentIsole) + ' €, contraintes ' + (x.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() || 'toutes') + ' non tenues)', x.a); });
log('Variante qui réduit le plus la pression fiscale en tenant l\'équilibre central : ' + pc(MINPO.a.tPlat, 1) + ', solde ' + trip(MINPO.soldes) + ', smicard ' + r0(MINPO.cas.smic_seul.ecartMois) + ', couple un Smic ' + r0(MINPO.cas.couple_1smic_2enf.ecartMois) + ', D1 ' + r0(MINPO.deciles[0].ecart) + '.');
log('Pour que la pression nette ne monte pas, il faudrait ' + r1(Z.pressionNette(MINPO.a).deltaNet) + ' Md€ d\'économies de plus (à solde nul), ou accepter un déficit de cet ordre (' + pc(Z.pressionNette(MINPO.a).deltaNet / 2935, 1) + ' du PIB).');

// 8. Sortie du plancher de 877 € (H561 à H570)
log('\n## 8. Règle de sortie du plancher de 877 € (03/11, défaut révélé par l\'affinage : V7875)');
log('Constat : le solde ne verse le plancher qu\'aux 1,84 M de bénéficiaires SANS AUCUN autre revenu. Au premier euro gagné, le complément (877 − 350 = 527 € pour une personne seule) disparaît : c\'est une falaise (variante « sec », le défaut, inchangé). Les variantes prolongent le plancher en complément retiré à raison de α par euro de revenu net d\'activité et de prime d\'activité (H561) : complément = max(0 ; plancher du ménage − revenu sans activité − α × gain de revenu d\'activité et de prime). Plancher du ménage : 877 € par adulte, 1 300 € pour le parent isolé (palier1.js H109) ; le parent isolé à 2 enfants (revenu sans activité de 1 550 € avec la majoration de 400 €) n\'a pas de complément. Ménages types : locataires zone 2, atlas OpenFisca 2026 ; couple : un seul salaire (H563). Architecture : la finale du § 7.3.');
var SV = [['sec', 'sec (défaut : falaise)'], ['maintien', 'maintien (α = 100 %)'], ['degressif', 'dégressif (α = 38 %)'], ['plat', 'plat (α = taux plat)']];
log('\n### 8.1 Coût, solde et complexité (architecture finale du § 7.3, sortie variable)');
log('| sortie | α | coût du complément b / c / h (Md€/an) | solde b / c / h | contraintes non tenues | règles + exceptions (total) | paramètres de protection |');
log('|---|---|---|---|---|---|---|');
var EVS = {};
SV.forEach(function (v) {
  var b = F(FIN.a, { sortiePlancher: v[0] }), e = Z.evaluer(b, LP), al = Z.alphaSortie(b); EVS[v[0]] = e;
  log('| ' + v[1] + ' | ' + (al === null ? '—' : pc(al, 1)) + ' | ' + SCS.map(function (s) { return r1(Z.coutPlancher(b, s)); }).join(' / ') + ' | ' + trip(e.soldes) + ' | ' + (e.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() || 'aucune')
    + ' | ' + e.complexite.regles + ' + ' + e.complexite.exceptions + ' (' + e.complexite.total + ') | ' + e.complexite.parametresProtection + ' |');
});
log('Coût : complément de la personne seule sur les adultes non retraités (quadrature des dispersions 0,3 / 0,6 / 0,9), multiplié par k = 10,65 Md€ (prime d\'activité observée) / même somme calculée par adulte avec l\'atlas (≈ 0,2 : oubli du conjoint, du non-recours et des plafonds de ressources, H565-H566 ⚠️ V8201). Sans cette calibration, le coût brut serait environ cinq fois plus élevé (borne haute absolue).');
log('\n### 8.2 Taux marginal effectif (TME, +1 % de salaire) et taux de participation (TP) de 0 à 2 Smic brut ; entre parenthèses, droit actuel (atlas OpenFisca 2026)');
var XS8 = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
['seul', 'parent', 'couple'].forEach(function (t) {
  log('\n**' + Z.TYPES_MENAGE[t].libelle + '**');
  log('| sortie | ' + XS8.map(function (x) { return String(x).replace('.', ',') + ' Smic'; }).join(' | ') + ' | TME maximal (à x Smic) |');
  log('|---|' + XS8.map(function () { return '---|'; }).join('') + '---|');
  SV.forEach(function (v) {
    var b = F(FIN.a, { sortiePlancher: v[0] }), cv = Z.courbeTME(b, t, XS8), m = Z.tmeMax(b, t);
    log('| ' + v[0] + ' TME | ' + cv.map(function (k) { return pc(k.tme) + ' (' + pc(k.tmeActuel) + ')'; }).join(' | ') + ' | ' + pc(m.tme) + ' à ' + String(m.x).replace('.', ',') + ' (actuel : ' + pc(m.actuel) + ' à ' + String(m.xActuel).replace('.', ',') + ') |');
    log('| ' + v[0] + ' TP | ' + cv.map(function (k) { return pc(k.tp) + ' (' + pc(k.tpActuel) + ')'; }).join(' | ') + ' | |');
  });
});
log('Lecture : « sec » a un TME apparent de 5 % à 0,1 et 0,25 Smic parce que la falaise est avant (de 0 à un euro) : le TP de 270 % à 0,1 Smic en est la mesure (passer de 0 à 0,1 Smic fait perdre 2,7 fois le salaire). Le droit actuel lui-même monte à 131 % de TME vers 0,4 Smic pour la personne seule (retrait de l\'aide au logement et de la prime) : le système proposé, quelle que soit la sortie, ne fait jamais pire que lui sur ce maximum.');
log('\n### 8.3 Effet sur la participation (H567) : variation relative de l\'emploi à x Smic, η × ln(part du coût conservée / part de référence), η = 0,4 × facteur du scénario (0,5 / 1 / 1,5), personne seule');
log('| sortie | scénario | vs « sec » à 0,25 / 0,5 / 1 Smic | vs droit actuel à 0,25 / 0,5 / 1 Smic |');
log('|---|---|---|---|');
['maintien', 'degressif', 'plat'].forEach(function (v) { SCS.forEach(function (sc) {
  var q = Z.participation(F(FIN.a, { sortiePlancher: v }), 'seul', [0.25, 0.5, 1], sc);
  log('| ' + v + ' | ' + sc + ' | ' + q.map(function (k) { return (k.versSec >= 0 ? '+' : '') + pc(k.versSec).replace('-', '−'); }).join(' / ') + ' | ' + q.map(function (k) { return (k.versActuel >= 0 ? '+' : '') + pc(k.versActuel).replace('-', '−'); }).join(' / ') + ' |');
}); });
log('Limite : modèle logarithmique du module offre-de-travail, part conservée bornée à 5 % (au-delà de 100 % de TP le travail ne paie plus) ; la colonne « vs sec » à 0,25 Smic est saturée par cette borne (on passe d\'un travail qui ne paie pas à un travail qui paie) : lire plutôt la colonne « vs droit actuel », et jamais comme une prévision ; pour « maintien », la valeur négative vs droit actuel à 0,25 Smic vient de la même borne (100 % de TP contre 56 % aujourd\'hui). Le temps partiel très court n\'est pas modélisé en heures.');
log('\n### 8.4 Balayage de α (personne seule ; coût central ; TME à 0,25 / 0,5 / 1 Smic ; TP à 0,25 / 0,5 / 1 Smic)');
log('| α | coût (Md€) | TME maximal (à x Smic) | TME 0,25 / 0,5 / 1 | TP 0,25 / 0,5 / 1 |');
log('|---|---|---|---|---|');
Z.balayageAlpha(FIN.a, [0.3, 0.38, 0.405, 0.5, 0.62, 0.8, 1]).forEach(function (k) {
  log('| ' + pc(k.alpha, 1) + ' | ' + r1(k.cout) + ' | ' + pc(k.tmeMax) + ' à ' + String(k.xTmeMax).replace('.', ',') + ' | ' + k.tme.map(function (x) { return pc(x); }).join(' / ') + ' | ' + k.tp.map(function (x) { return pc(x); }).join(' / ') + ' |');
});
log('\n### 8.5 Choix (tranché par Claude, révisable)');
var CHcrit = Z.choisirSortie(FIN.a), CH = CHcrit || Z.SORTIE_TRANCHEE;   // 04/11/2026 : après les corrections de données (V12400-V12404), l'équilibre de cette finale monte à 41,0 % et aucune sortie ne tient plus le critère « TME ≤ 80 % » (plat : 83 %) ; on garde alors la sortie tranchée « plat » et on le dit
if (!CHcrit) log('**Note du 04/11/2026 (v5.1 recalculée)** : avec les corrections de données (H506, H250, H252, H45), l\'équilibre de cette finale d\'avril passe de 40,5 à 41,0 % ; « dégressif » (82 %) et « plat » (83 %) dépassent alors le seuil de 80 % de TME (choix de Claude, H569) et aucune sortie ne tient tous les critères. **La sortie « plat » tranchée le 03/11 est conservée** (le seuil de 80 % est un choix, pas une donnée ; la v5 n\'est pas concernée, voir § 18).');
log('Critères (H569) : le travail à très temps partiel paie (TP à 0,25 Smic ≤ 50 %) ; aucun TME au-dessus de 80 % de 0 à 2 Smic pour les trois ménages ; puis le moins cher ; puis le moins de paramètres. « maintien » échoue au premier critère (TME de 100 % jusqu\'à 0,27 Smic) ; « dégressif » et « plat » passaient avant les corrections de données du 04/11 (voir la note ci-dessus). **Sortie retenue : « ' + CH + ' » (tranchée par Claude)** : le complément de plancher fond au rythme du taux plat, aucun paramètre de plus, 1 exception de plus, coût central ' + r1(Z.coutPlancher(F(FIN.a, { sortiePlancher: CH }), 'central')) + ' Md€.');
var bch = F(FIN.a, { sortiePlancher: CH }), ech = EVS[CH];
log('Sans autre changement, la finale du § 7.3 avec cette sortie donne ' + trip(ech.soldes) + ' : l\'équilibre central (contrainte (1)) n\'est plus tenu. **Le défaut de l\'architecture n\'est donc PAS basculé** (code : `sortiePlancher: \'sec\'` ; `Optimum.SORTIE_TRANCHEE = \'' + Z.SORTIE_TRANCHEE + '\'`) : le faire changerait les §§ 1 à 7 et les tests de la finale. Deux manières de rétablir l\'équilibre :');
var t1 = null, k1;
for (k1 = 405; k1 <= 500; k1 += 5) { if (Z.solde(F(bch, { tPlat: k1 / 1000 }), 'central') >= 0) { t1 = k1 / 1000; break; } }
var e1 = t1 === null ? null : Z.evaluer(F(bch, { tPlat: t1 }), LP);
log('(a) toutes choses égales, taux plat relevé à ' + (t1 === null ? '> 50 %' : pc(t1, 1)) + (e1 ? ' : ' + trip(e1.soldes) + ', smicard ' + r0(e1.cas.smic_seul.ecartMois) + ', couple un Smic ' + r0(e1.cas.couple_1smic_2enf.ecartMois) + ', contraintes non tenues : ' + (e1.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() || 'aucune') : '') + ' ;');
var Xs = Z.affiner({ base: { cleMajoration: 'cas', sortiePlancher: CH }, filtre: function (l) { return l.nom === 'ppa'; } }).meilleur, as = Xs.a;
log('(b) recherche ciblée refaite avec la sortie (même grille, même ordre de contraintes) : ' + pc(as.tPlat, 1) + ', socle ' + as.socle + ' €, majoration ' + r0(as.majParentIsole) + ' €, PPA ' + pc(as.ppaMaintenue) + ' → ' + trip(Xs.soldes) + ', smicard ' + r0(Xs.cas.smic_seul.ecartMois) + ', couple un Smic ' + r0(Xs.cas.couple_1smic_2enf.ecartMois) + ', D1 ' + r0(Xs.deciles[0].ecart) + ', contraintes non tenues : ' + (Xs.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() || 'aucune') + ', règles + exceptions ' + Xs.complexite.regles + ' + ' + Xs.complexite.exceptions + ' (' + Xs.complexite.total + ').');
log('Vérité à nommer : la sortie du plancher ajoute une règle (13 à 15 → ' + ech.complexite.total + ' règles et exceptions pour la finale du § 7.3) et son coût réel dépend du ménage (calibration par la prime d\'activité observée, ⚠️ V8201).');

log('\nTemps de calcul : ' + Math.round((Date.now() - t0) / 1000) + ' s.');

// 9. Architecture finale v2 (03/11, H571 à H580) : sortie « plat » active, fourchettes d'exil défendables, recherche refaite, dette à 10 ans (modeles/risques/stress.js, si chargé)
var t9 = Date.now();
function nonTenues(e) { return e.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() || 'aucune'; }
log('\n## 9. Architecture finale v2 (03/11) : sortie du plancher « plat » active, fourchettes d\'exil défendables, recherche ciblée refaite, dette à 10 ans');
log('Les §§ 1 à 8 sont inchangés (exil des modules, sortie « sec » par défaut dans le code). Ici : la sortie « plat » (tranchée au § 8.5) est active, et les fourchettes d\'exil de sources/exil-patrimoines-preuves.md §§ 6.2-6.3 remplacent celles des modules (option `exil: \'defendable\'`, H571-H573 ; les anciennes restent la variante `exil: \'modele\'`).');
log('\n### 9.1 Fourchettes d\'exil [favorable (bas), central, défavorable (haut)]');
log('| paramètre | modules (variante « modele ») | défendable (défaut v2) | source |');
log('|---|---|---|---|');
log('| fuite totale des transmissions (H17 / H178) | ' + SCS.map(function (s) { return pc(Z.EXIL.modele.fuite[s]); }).join(' / ') + ' | ' + SCS.map(function (s) { return pc(Z.EXIL.defendable.fuite[s]); }).join(' / ') + ' | exil-patrimoines-preuves.md § 6.2 : f = 1 − (1 − d)(1 − e) |');
log('| érosion du capital mobile du top 1 % pour la taxe à 1 % (H510) | ' + SCS.map(function (s) { return pc(Z.EXIL.modele.erosionTop[s]); }).join(' / ') + ' | ' + SCS.map(function (s) { return pc(Z.EXIL.defendable.erosionTop[s]); }).join(' / ') + ' | § 6.3 : Danemark ≈ 30 %, Suisse ≈ 30 % ; 74 % gardé comme stress |');
log('Effet sur les architectures (solde b / c / h, Md€) :');
log('| architecture | exil des modules | exil défendable | écart b / c / h |');
log('|---|---|---|---|');
function ligneExil(nom, a) { var m = Z.soldes(F(a, { exil: 'modele' })), d = Z.soldes(F(a, { exil: 'defendable' })); log('| ' + nom + ' | ' + trip(m) + ' | ' + trip(d) + ' | ' + trip({ bas: d.bas - m.bas, central: d.central - m.central, haut: d.haut - m.haut }) + ' |'); }
ligneExil('finale du § 7.3 (sortie « sec »)', Z.FINALE_73);
ligneExil('finale du § 7.3, sortie « plat »', F(Z.FINALE_73, { sortiePlancher: 'plat' }));
ligneExil('architecture finale v2', F(Z.ARCHITECTURE_V2, { exil: 'modele' }));
var dm = Z.detail(F(Z.ARCHITECTURE_V2, { exil: 'modele' }), 'haut'), dd = Z.detail(Z.ARCHITECTURE_V2, 'haut');
log('Décomposition de l\'écart au haut (v2) : droits de succession (options) ' + r1(dd.options - dm.options) + ', exception du conjoint ' + r1(dd.conjoint - dm.conjoint) + ', exemption « reçu à vie » ' + r1(dd.exemptionVie - dm.exemptionVie) + ', taxe à 1 % ' + r1(dd.taxe - dm.taxe) + ' ; total ' + r1(dd.total - dm.total) + '. Lecture : la fuite plus forte des transmissions coûte presque autant que l\'érosion plus faible de la taxe rapporte ; les deux fourchettes ne changent presque pas le solde.');

log('\n### 9.2 Recherche ciblée v2 (H574-H576)');
var RV = Z.affinerV2(), V2 = RV.meilleur;
log('Base : recommandation du § 2 bis (non-cotés à la vente), majoration sur les dixièmes des parents isolés, sortie « plat », exil défendable. Grille : taux ' + Z.GRILLE_AFFINAGE.tPlat.length + ' valeurs (36 à 45 %) × socle ' + Z.GRILLE_AFFINAGE.socle.length + ' × majoration ' + Z.GRILLE_AFFINAGE.majParentIsole.length + ' × levier ' + Z.GRILLE_AFFINAGE.levier.length + ' = ' + r0(RV.evalues) + ' architectures.');
log('Contraintes, dans l\'ordre : (1) solde central ≥ 0 ; (3) élargie : D1-D3, smicard, couple avec un Smic, parent isolé au Smic, retraité locataire non perdants ; (4) plafond de 50 % sur les transmissions ; (5) taux marginal à l\'infini ≤ 75 % ; (6) effort du retraité modeste ≤ 10 %. La (2) (−3 % du PIB au haut) reste relâchée : aucune architecture ne la tient (§§ 2, 7).');
log('Architectures qui tiennent (1), (3) élargie, (4), (5) et (6) : ' + r0(RV.faisables) + ' ; taux plat le plus bas : ' + pc(RV.tMin, 1) + ' ; « à solde voisin » (taux à moins de ' + pc(Z.TOL_V2, 1) + ' du plus bas) : ' + RV.voisins.length + ' architectures, départagées par le moins de règles et d\'exceptions, puis de paramètres.');
var cxMin = Math.min.apply(null, RV.voisins.map(function (e) { return e.complexite.total; })), cxMax = Math.max.apply(null, RV.voisins.map(function (e) { return e.complexite.total; }));
log('Règles + exceptions parmi elles : de ' + cxMin + ' à ' + cxMax + ' ; toutes gardent la prime d\'activité (levier (4)) : ' + (RV.voisins.every(function (e) { return e.a.ppaMaintenue > 0; }) ? 'oui' : 'non') + '. Préférence de l\'affinage (taux d\'abord) : ' + (RV.plusBas.a === V2.a || (RV.plusBas.a.tPlat === V2.a.tPlat && RV.plusBas.a.majParentIsole === V2.a.majParentIsole && RV.plusBas.a.ppaMaintenue === V2.a.ppaMaintenue && RV.plusBas.a.socle === V2.a.socle) ? 'même architecture' : 'autre architecture : ' + pc(RV.plusBas.a.tPlat, 1)) + '.');
var sansPPA = Z.affinerV2({ filtre: function (l) { return l.nom !== 'ppa'; } }).meilleur;
log('Sans prime d\'activité (abattement, bonus ou aucun levier, même recherche) : meilleure ' + pc(sansPPA.a.tPlat, 1) + ', socle ' + sansPPA.a.socle + ' €, solde ' + trip(sansPPA.soldes) + ', contraintes non tenues : ' + nonTenues(sansPPA) + ' (écart (3) : ' + r0(sansPPA.violations[2]) + ' €/mois), règles + exceptions ' + sansPPA.complexite.total + '.');
var R80 = Z.affinerV2({ tmeMax: 0.80 }), sv = ['degressif', 'plat'].map(function (v) { var b = F(V2.a, { sortiePlancher: v }); return v + ' ' + pc(Z.tmeMax3(b), 1) + ' (coût ' + r1(Z.coutPlancher(b, 'central')) + ' Md€)'; });
log('**Tension à nommer (H577)** : avec la prime d\'activité à 90-100 %, le critère (ii) qui avait fait choisir la sortie (aucun TME au-dessus de 80 % de 0 à 2 Smic, H569) n\'est plus tenu : TME maximal de l\'architecture v2 ' + pc(Z.tmeMax3(V2.a), 1) + ' (personne seule vers 0,42 Smic ; droit actuel : 131 %). Imposé comme contrainte, il ne laisse ' + (R80.meilleur ? 'que ' + pc(R80.meilleur.a.tPlat, 1) : 'aucune architecture qui tienne (1) et (3) élargie') + ' : avec 80 % de prime, le smicard repasse perdant à 41 % et plus. Sorties sur la v2 (TME maximal des trois ménages) : ' + sv.join(' ; ') + ' : aucune ne tient 80 % ; « plat » reste la moins chère des deux et sans paramètre (le critère (i), TP à 0,25 Smic ≤ 50 %, est tenu : ' + pc(Z.courbeTME(V2.a, 'seul', [0.25])[0].tp) + ').');
log('Les architectures « à solde voisin », dans l\'ordre de préférence :');
log('| taux | socle | majoration | levier | solde b / c / h | smicard / couple un Smic / D1 | règles + exceptions | paramètres |');
log('|---|---|---|---|---|---|---|---|');
RV.voisins.forEach(function (e) { var a = e.a; log('| ' + pc(a.tPlat, 1) + ' | ' + a.socle + ' € | ' + r0(a.majParentIsole) + ' € | ' + (a.ppaMaintenue ? 'PPA ' + pc(a.ppaMaintenue) : a.abattementActivite ? 'abattement ' + a.abattementActivite + ' €' : a.bonusActivite ? 'bonus ' + a.bonusActivite + ' €' : 'aucun') + ' | ' + trip(e.soldes) + ' | ' + r0(e.cas.smic_seul.ecartMois) + ' / ' + r0(e.cas.couple_1smic_2enf.ecartMois) + ' / ' + r0(e.deciles[0].ecart) + ' | ' + e.complexite.total + ' | ' + e.complexite.parametresProtection + ' |'); });
log('Identique à `Optimum.ARCHITECTURE_V2` : ' + (V2.a.tPlat === Z.ARCHITECTURE_V2.tPlat && V2.a.socle === Z.ARCHITECTURE_V2.socle && V2.a.majParentIsole === Z.ARCHITECTURE_V2.majParentIsole && V2.a.ppaMaintenue === Z.ARCHITECTURE_V2.ppaMaintenue ? 'oui' : 'NON') + '.');

log('\n### 9.3 Architecture finale v2 (tranchée par Claude, révisable)');
fiche('Architecture finale v2', V2);
log('Sortie du plancher : « plat » (α = taux plat = ' + pc(V2.a.tPlat, 1) + '), coût b / c / h ' + SCS.map(function (s) { return r1(Z.coutPlancher(V2.a, s)); }).join(' / ') + ' Md€ ; prime d\'activité ' + pc(V2.a.ppaMaintenue) + ' : ' + r1(Z.coutProtection(V2.a, 'central').ppa) + ' Md€.');
var dv2 = Z.detail(V2.a, 'central');
log('Poste absent de la ligne « Décomposition » ci-dessus (la fonction `fiche` ne l\'affiche pas, aux §§ 1 à 8 non plus) : protection (prime d\'activité ' + r1(-dv2.protectionDetail.ppa) + ' ; sortie du plancher ' + r1(-dv2.protectionDetail.plancher) + ') = ' + r1(dv2.protection) + ' ; avec lui, la somme donne bien ' + r1(dv2.total) + '. Au § 7.3, le poste omis vaut ' + r1(Z.detail(Z.FINALE_73, 'central').protection) + ' (prime d\'activité à 80 %).');
log('Incitation au travail (TME / TP, système proposé, droit actuel entre parenthèses) :');
log('| ménage | 0,25 Smic | 0,5 Smic | 1 Smic | 1,25 Smic | TME maximal de 0 à 2 Smic |'); log('|---|---|---|---|---|---|');
['seul', 'parent', 'couple'].forEach(function (t) { var cv = Z.courbeTME(V2.a, t, [0.25, 0.5, 1, 1.25]), m = Z.tmeMax(V2.a, t);
  log('| ' + Z.TYPES_MENAGE[t].libelle + ' | ' + cv.map(function (k) { return pc(k.tme) + ' / ' + pc(k.tp) + ' (' + pc(k.tmeActuel) + ' / ' + pc(k.tpActuel) + ')'; }).join(' | ') + ' | ' + pc(m.tme) + ' à ' + String(m.x).replace('.', ',') + ' Smic (actuel ' + pc(m.actuel) + ') |'); });
var stv = Z.stabilisateur(V2.a, 'haut'), stv2 = Z.stabilisateur(V2.a, 'haut', { levier: 'les deux' });
log('Stabilisateur (H560) au haut : taux seul ' + r1(stv.trajectoire[0].solde) + ' → ' + r1(stv.final.solde) + ' (' + pc(stv.final.tPlat, 1) + ') ; taux et socle → ' + r1(stv2.final.solde) + ' (smicard ' + r0(stv2.casFinal.smic_seul.ecartMois) + ', D1 ' + r0(stv2.decilesFinal[0].ecart) + ').');
var pnv = Z.pressionNette(V2.a);
log('Pression fiscale nette du socle (H557) : ' + r1(pnv.deltaNet) + ' Md€ (' + r1(100 * pnv.partPIB) + ' points de PIB), dont ' + r1(pnv.deficitComble) + ' pour combler le déficit actuel et ' + r1(pnv.depensesNettes) + ' de dépenses nettes nouvelles ; PO bruts ' + pc(pnv.poPartPIB, 1) + ' du PIB.');

log('\n### 9.4 Comparaison (central sauf mention)');
log('| architecture | taux / socle / majoration / PPA | sortie | exil | solde b / c / h | smicard / couple un Smic / parent isolé Smic / RSA / retraité loc. | D1 / D2 / D3 / D5 / D10 | TME à l\'infini | règles + exc. | contraintes non tenues |');
log('|---|---|---|---|---|---|---|---|---|---|');
function ligneCmp(nom, a) { var e = Z.evaluer(a, LP), c = e.cas, d = e.deciles;
  log('| ' + nom + ' | ' + pc(a.tPlat, 1) + ' / ' + a.socle + ' € / ' + r0(a.majParentIsole) + ' € / ' + pc(a.ppaMaintenue) + ' | ' + a.sortiePlancher + ' | ' + a.exil + ' | ' + trip(e.soldes) + ' | ' + [c.smic_seul, c.couple_1smic_2enf, c.parent_isole_smic, c.rsa_seul, c.retraite_aspa_loc].map(function (x) { return x ? r0(x.ecartMois) : '—'; }).join(' / ') + ' | '
    + [0, 1, 2, 4, 9].map(function (i) { return r0(d[i].ecart); }).join(' / ') + ' | ' + pc(e.margMax, 1) + ' | ' + e.complexite.total + ' | ' + nonTenues(e) + ' |'); }
ligneCmp('finale du § 7.3', Z.archi(Z.FINALE_73));
ligneCmp('finale du § 7.3 + sortie « plat »', Z.archi(F(Z.FINALE_73, { sortiePlancher: 'plat' })));
ligneCmp('finale du § 7.3 + « plat » + exil défendable', Z.archi(F(Z.FINALE_73, { sortiePlancher: 'plat', exil: 'defendable' })));
ligneCmp('v2 avec l\'exil des modules (variante)', Z.archi(F(Z.ARCHITECTURE_V2, { exil: 'modele' })));
ligneCmp('**architecture finale v2**', Z.archi(Z.ARCHITECTURE_V2));

log('\n### 9.5 Dette à 10 ans (modeles/risques/stress.js, chemin « V2 » ; année 1 = 2029, dette de départ ≈ 123,5 % du PIB)');
var ST = this.Stress;
if (ST && ST.ARCHS.V2) {
  log('| trajectoire | solde an 1 / an 5 / an 10 (Md€) | dette/PIB an 5 / an 10 | écart à 10 ans vs sans choc |'); log('|---|---|---|---|');
  var ref10 = {};
  ['bas', 'central', 'haut'].forEach(function (sc) { var r = ST.test('V2', sc, {}); ref10[sc] = r.ratio10; log('| sans choc, ' + sc + ' | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5) + ' / ' + pc(r.ratio10) + ' | — |'); });
  [['IA à zéro (ligne E)', { sansE: true }], ['récession type 2009', { recession: true }], ['taux +100 pb', { taux: 100 }], ['krach immobilier −20 %', { krachImmo: -0.2 }], ['exil au haut de la fourchette défendable', { exilHaut: true }], ['exil doublé (ancien stress, comparaison)', { exil2: true }]].forEach(function (c) {
    var r = ST.test('V2', 'central', c[1]); log('| ' + c[0] + ', central | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5) + ' / ' + pc(r.ratio10) + ' | ' + (r.ratio10 >= r.ratio10base ? '+' : '') + r1(100 * (r.ratio10 - r.ratio10base)).replace('-', '−') + ' pts |'); });
  var ex = ST.perteExilHaut('V2', 'central');
  log('Exil au haut de la fourchette (central, Md€/an de croisière) : revenus ' + r1(ex.revenus) + ', transmissions ' + r1(ex.transmissions) + ', taxe ' + r1(ex.taxe) + ', total ' + r1(ex.total) + '. Comparaison : chemins du chantier 5 sans choc, central, 95 % (C40), 103 % (C40N), 131 % (P1N), 157 % (droit actuel). Détail et garde-fous : modeles/risques/resultats-brut.txt (section « Architecture finale v2 »).');
} else log('stress.js non chargé : voir modeles/risques/resultats-brut.txt (section « Architecture finale v2 »).');
log('\nTemps de calcul du § 9 : ' + Math.round((Date.now() - t9) / 1000) + ' s.');
