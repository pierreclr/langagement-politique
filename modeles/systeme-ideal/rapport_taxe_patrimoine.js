// Taxe de 1 % sur le patrimoine (proposition de l'auteur, 03/11/2026) : tableaux de taxe-patrimoine-1pc.md. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js rapport_taxe_patrimoine.js > resultats-taxe-patrimoine.txt
var T = this.TaxePatrimoine, X = this.OptionsFinancement, F = this.Voies.fus, DVF = this.DvfPatrimoine;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r0(x) { return Math.round(x).toLocaleString('fr-FR').replace(/[  ,]/g, ' ').replace('-', '−'); }
function pc(x, d) { return x === null ? 'inaccessible (≤ 80 %)' : (Math.round(x * 100 * (d ? 10 : 1)) / (d ? 10 : 1)).toString().replace('.', ',').replace('-', '−') + ' %'; }
var SCS = T.SCS, ASS = ['pierre', 'pierreNet', 'pierreAV', 'large', 'largeNet'], AB = [0, 100000, 300000];
function trip(f) { return SCS.map(function (s) { return r1(f(s)); }).join(' / '); }
var V = DVF.france2024.valeurMdEur;

log('# Taxe de 1 % sur le patrimoine : résultats (Md€/an de 2024, régime de croisière ; scénarios du module : bas = le moins favorable au solde)');
var cd = T.controleDistribution();
log('\nContrôle de la distribution reconstituée (HVP 2023-2024) : moyenne ' + r0(cd.moyenne) + ' € (enquête : 374 900) ; masse détenue par le top 1 / 5 / 10 / 25 / 50 % : '
  + ['top1', 'top5', 'top10', 'top25', 'top50'].map(function (k) { return pc(cd.masse[k]); }).join(' / ') + ' (enquête : 15 / 34 / 48 / 72 / 93 %) ; α de Pareto au-delà de P95 : ' + (Math.round(T.HVP.alphaPareto * 100) / 100).toString().replace('.', ','));

log('\n## A. Assiettes (comptes de patrimoine 2024 des ménages, Md€)');
log('| assiette | immobilier | terres | actions hors OPC | OPC | autres actifs financiers | dettes déduites | total | 1 % mécanique |');
log('|---|---|---|---|---|---|---|---|---|');
ASS.forEach(function (a) { var c = T.composantes(a); log('| ' + a + ' : ' + T.ASSIETTES[a].libelle + ' | ' + r0(c.immo) + ' | ' + r0(c.terres) + ' | ' + r0(c.actions) + ' | ' + r0(c.opc) + ' | ' + r0(c.autresFin) + ' | ' + r0(c.dettes) + ' | ' + r0(c.total) + ' | ' + r1(c.total / 100) + ' |'); });
log('Déjà supprimés par le palier 1 (dans les 885,9 Md€) : taxe foncière ' + r1(T.RECETTES.taxeFonciere) + ' (ménages ' + r1(T.RECETTES.tfMenages) + ', hors ménages ' + r1(T.RECETTES.tfHorsMenages) + ') + IFI ' + r1(T.RECETTES.ifi) + ' = ' + r1(T.RECETTES.dejaSupprimeesParPalier1) + ' Md€.');
log('Immobilier détenu par les sociétés (non taxé dans la référence : la taxe porte sur les parts) : ' + r0(T.SOCIETES.immobilier) + ' Md€, soit ' + r1(T.SOCIETES.immobilier / 100) + ' Md€ à 1 %.');

log('\n## B. Décomposition de la référence (assiette « pierre », sans abattement, réforme immobilière en place)');
log('| scénario | 1 % mécanique | effet prix (capitalisation) | base immobilière retenue | érosion du capital mobile | base mobile retenue | recette brute | autres impôts perdus (exil) | coût de gestion | recette nette |');
log('|---|---|---|---|---|---|---|---|---|---|');
SCS.forEach(function (s) { var r = T.recette(s, {}); log('| ' + s + ' | ' + r1(r.comptable) + ' | ' + pc(r.effetPrix, 1) + ' | ' + r0(r.baseImmo) + ' | ' + pc(r.erosionMobile, 1) + ' | ' + r0(r.baseMobile) + ' | ' + r1(r.brute) + ' | −' + r1(r.exil) + ' | −' + r1(r.gestion) + ' | **' + r1(r.nette) + '** |'); });

log('\n## C. Recette nette par assiette et abattement par ménage (bas / central / haut)');
log('| assiette | sans abattement | abattement 100 000 € | abattement 300 000 € | ménages exonérés (100 000 / 300 000 €) |');
log('|---|---|---|---|---|');
ASS.forEach(function (a) {
  log('| ' + a + ' | ' + AB.map(function (A) { return trip(function (s) { return T.recette(s, { assiette: a, abattement: A }).nette; }); }).join(' | ')
    + ' | ' + pc(T.partAbattement(a, 100000).ménagesExoneres) + ' / ' + pc(T.partAbattement(a, 300000).ménagesExoneres) + ' |');
});
log('Part de l\'assiette « pierre » retirée par l\'abattement (immobilier / capital mobile) : 100 000 € : ' + pc(T.partAbattement('pierre', 100000).immo) + ' / ' + pc(T.partAbattement('pierre', 100000).mobile)
  + ' ; 300 000 € : ' + pc(T.partAbattement('pierre', 300000).immo) + ' / ' + pc(T.partAbattement('pierre', 300000).mobile));

log('\n## D. Paiement différé (ménages sous la médiane de niveau de vie, ' + pc(T.COMMUN.eligibleDiffere) + ' du patrimoine brut ; créance récupérée à la vente ou à la succession)');
log('| variante | recette reportée chaque année | perte en croisière | perte les premières années (avant tout recouvrement) | recette nette croisière |');
log('|---|---|---|---|---|');
[['pierre', 0], ['pierre', 100000]].forEach(function (v) {
  var o = { assiette: v[0], abattement: v[1], differe: true };
  log('| ' + v[0] + ', abattement ' + r0(v[1]) + ' € | ' + trip(function (s) { return T.recette(s, o).differe; }) + ' | ' + trip(function (s) { return T.recette(s, o).perteDiffere; }) + ' | '
    + trip(function (s) { return T.recette(s, F(o, { annee1: true })).perteDiffere; }) + ' | ' + trip(function (s) { return T.recette(s, o).nette; }) + ' |');
});

log('\n## E. Sans la réforme immobilière : la taxe remplace elle-même les DMTO (déduits : 20,1 / 16,1 / 13,5)');
log('Référence « pierre » : ' + trip(function (s) { return T.recette(s, { avecReformeImmo: false }).nette; }) + ' ; abattement 100 000 € : ' + trip(function (s) { return T.recette(s, { abattement: 100000, avecReformeImmo: false }).nette; }));

log('\n## F. Volatilité : krach immobilier (−20 %, trois années) et régularisation à la vente (volume DVF 2024 : ' + r1(V) + ' Md€/an)');
log('| scénario | perte annuelle, indice local | sur trois ans (réserve conseillée) | part de la recette brute | remboursements par année de krach, indice IPC (borne haute) |');
log('|---|---|---|---|---|');
SCS.forEach(function (s) { var k = T.krach(s, {}, V); log('| ' + s + ' | ' + r1(k.indiceLocalParAn) + ' | ' + r1(k.indiceLocalTotal) + ' | ' + pc(k.partRecette) + ' | ' + r1(k.indiceIpcRemboursementsParAn) + ' |'); });
var rg = T.regularisation(V); log('Régularisation en temps normal (indice local, centrée) : compléments ≈ ' + r1(rg.complements) + ' Md€/an, remboursements ≈ ' + r1(rg.remboursements) + ', net ≈ 0.');

log('\n## G. Qui paie : impôt moyen par ménage et par dixième de patrimoine brut (HVP, valeurs de l\'enquête, avant comportements, assiette « pierre »)');
log('| tranche | patrimoine brut moyen (€) | impôt sans abattement (€/an) | part du total | abattement 100 000 € | part | abattement 300 000 € | part |');
log('|---|---|---|---|---|---|---|---|');
var g0 = T.parTranche({}), g1 = T.parTranche({ abattement: 100000 }), g3 = T.parTranche({ abattement: 300000 });
g0.forEach(function (g, i) { log('| ' + g.tranche + ' | ' + r0(g.patrimoineBrutMoyen) + ' | ' + r0(g.impotMoyen) + ' | ' + pc(g.partDuTotal, 1) + ' | ' + r0(g1[i].impotMoyen) + ' | ' + pc(g1[i].partDuTotal, 1) + ' | ' + r0(g3[i].impotMoyen) + ' | ' + pc(g3[i].partDuTotal, 1) + ' |'); });

log('\n## H. Cas types (€/an ; « TF équivalente » = taux moyen actuel des ménages appliqué au bien, estimation)');
var CAS = [
  ['Retraité propriétaire d\'une maison de 300 000 €, pension 1 400 €/mois', { valeurImmo: 300000, revenuMensuel: 1400 }],
  ['Jeune locataire, 15 000 € sur un livret, 1 900 €/mois', { depots: 15000, revenuMensuel: 1900 }],
  ['Cadre propriétaire : appartement 450 000 €, crédit restant 250 000 €, PEA 50 000 €, 5 000 €/mois', { valeurImmo: 450000, dettes: 250000, actions: 50000, revenuMensuel: 5000 }],
  ['Fondateur : 50 % d\'une start-up valorisée 20 M€ (10 M€), salaire 4 000 €/mois, pas de liquidités', { actions: 10000000, revenuMensuel: 4000 }]
];
log('| cas | brut, sans abattement | part du revenu | brut, abattement 100 000 € | part | net de dettes, sans abattement | tout le patrimoine (large) | TF équivalente aujourd\'hui | multiple |');
log('|---|---|---|---|---|---|---|---|---|');
CAS.forEach(function (c) {
  var a = T.casType(c[1]), b = T.casType(c[1], { abattement: 100000 }), n = T.casType(c[1], { assiette: 'pierreNet' }), l = T.casType(c[1], { assiette: 'large' });
  log('| ' + c[0] + ' | ' + r0(a.impot) + ' | ' + (a.partRevenu === null ? '—' : pc(a.partRevenu, 1)) + ' | ' + r0(b.impot) + ' | ' + (b.partRevenu === null ? '—' : pc(b.partRevenu, 1)) + ' | ' + r0(n.impot) + ' | ' + r0(l.impot) + ' | ' + r0(a.tfEquivalente) + ' | ' + (a.multipleTf === null ? '—' : r1(a.multipleTf)) + ' |');
});

log('\n## I. Effet sur le solde du palier 1 (scénarios du palier 1 : bas = favorable ; la taxe reçoit le scénario croisé)');
var REF = { immobilier: true, taxePatrimoine: { assiette: 'pierre' } }, PAT = { report150: true, deces: 'carryover', pfu50: true, economies: 'volontaires', cir: 'supprime' };
var CH = [
  ['Palier 1 (35 %, 500 €, héritage 50 %)', {}],
  ['Palier 1 + réforme immobilière (référence de cette note)', { immobilier: true }],
  ['+ taxe 1 % « pierre », sans abattement', REF],
  ['+ taxe 1 %, abattement 100 000 €', { immobilier: true, taxePatrimoine: { assiette: 'pierre', abattement: 100000 } }],
  ['+ taxe 1 %, abattement 300 000 €', { immobilier: true, taxePatrimoine: { assiette: 'pierre', abattement: 300000 } }],
  ['+ taxe 1 %, net de dettes', { immobilier: true, taxePatrimoine: { assiette: 'pierreNet' } }],
  ['+ taxe 1 %, sans abattement, paiement différé', { immobilier: true, taxePatrimoine: { assiette: 'pierre', differe: true } }],
  ['T1 : taxe sans abattement + patrimoine + économies volontaires + CIR supprimé, taux 35 %, socle 500 €', F(REF, PAT)],
  ['T2 : T1 avec abattement 100 000 € et paiement différé', F(PAT, { immobilier: true, taxePatrimoine: { assiette: 'pierre', abattement: 100000, differe: true } })],
  ['T3 : chemin 2 (41,5 %, 400 €, patrimoine, économies) + réforme immobilière + taxe sans abattement', F(F(REF, PAT), { tPlat: 0.415, socleFacteur: 0.8 })],
  ['T4 : chemin 2 + réforme immobilière + taxe, abattement 100 000 €, différé', F(PAT, { tPlat: 0.415, socleFacteur: 0.8, immobilier: true, taxePatrimoine: { assiette: 'pierre', abattement: 100000, differe: true } })],
  ['T5 : T1 au taux plat de 40 %', F(F(REF, PAT), { tPlat: 0.40 })],
  ['Contre-épreuve : chemin 2 + réforme immobilière, sans taxe', F(PAT, { tPlat: 0.415, socleFacteur: 0.8, immobilier: true })]
];
log('| chemin | solde bas / central / haut | taxe (bas / central / haut) | taux plat d\'équilibre (bas / central / haut) |');
log('|---|---|---|---|');
CH.forEach(function (c) {
  log('| ' + c[0] + ' | ' + trip(function (s) { return X.solde(c[1], s); }) + ' | ' + trip(function (s) { return X.detail(c[1], s).taxePatrimoine; }) + ' | '
    + SCS.map(function (s) { return pc(X.platEquilibre(c[1], 0, s), 1); }).join(' / ') + ' |');
});
log('Taux plat pour garder le déficit actuel (−169,1) au haut, référence + taxe : ' + pc(X.platEquilibre(REF, -169.1, 'haut'), 1) + ' ; T1 : ' + pc(X.platEquilibre(F(REF, PAT), -169.1, 'haut'), 1)
  + ' ; pour −88 Md€ (3 % du PIB) au haut, T1 : ' + pc(X.platEquilibre(F(REF, PAT), -88, 'haut'), 1));
// socle d'équilibre au central à 35 % avec T1
var fs = function (f) { return X.solde(F(F(REF, PAT), { socleFacteur: f }), 'central'); }, lo = 0.5, hi = 1, i, m;
if (fs(hi) >= 0) lo = hi; else { for (i = 0; i < 40; i++) { m = (lo + hi) / 2; if (fs(m) >= 0) lo = m; else hi = m; } }
log('Socle d\'équilibre au central, T1 au taux plat de 35 % : ' + r0(500 * lo) + ' € (facteur ' + r1(lo * 100) + ' %)');

log('\n## J. Sensibilité de la recette nette centrale (référence), un paramètre à la fois');
function sens(nom, cle, vals) {
  var p0 = T.PARAM.central[cle], out = vals.map(function (v) { T.PARAM.central[cle] = v; var r = T.recette('central', {}).nette; T.PARAM.central[cle] = p0; return r1(v * (v < 1.5 ? 100 : 1)) + (v < 1.5 ? ' %' : '') + ' → ' + r1(r); });
  log('| ' + nom + ' | ' + out.join(' | ') + ' |');
}
log('| paramètre | valeur basse → recette | valeur haute → recette |'); log('|---|---|---|');
sens('érosion du capital mobile du top 1 %', 'erosionTop', [0.74, 0.20]);
sens('érosion du capital mobile du reste', 'erosionReste', [0.30, 0.05]);
sens('capitalisation dans les prix', 'capitalisation', [0.75, 0.25]);
sens('rendement locatif', 'rendementLocatif', [0.030, 0.045]);
sens('valorisation de l\'immobilier', 'valImmo', [0.92, 1.0]);
sens('valorisation des non cotées', 'valNonCotees', [0.65, 0.90]);
log('Recette nette centrale de la référence : ' + r1(T.recette('central', {}).nette) + ' Md€.');
