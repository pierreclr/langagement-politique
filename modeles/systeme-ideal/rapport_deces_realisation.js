// Décès et donation = réalisation : tableaux de resultats.md § 26. Reproduction, depuis ce dossier :
//   jsc deces_realisation.js rapport_deces_realisation.js > resultats-deces-realisation.txt
var D = this.DecesRealisation;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function pc(x) { return r1(x * 100) + ' %'; }
var SC = D.SC, P = D.PARAM, C = D.CONST;
var O = {}; SC.forEach(function (s) { O[s] = D.options(s); });
function row(nom, f, fmt) { log('| ' + nom + ' | ' + SC.map(function (s) { return (fmt || r1)(f(O[s])); }).join(' | ') + ' |'); }

log('## A. Assiette : plus-values latentes transmises chaque année (Md€/an ; flux de ' + C.fluxTransmis + ' Md€ au central, CAE n° 69)');
log('| classe | valeur transmise (bas / central / haut) | plus-value latente / valeur (g utilisé) | gain latent net (bas / central / haut) |'); log('|---|---|---|---|');
var noms = { rp: 'Résidence principale (exonérée par défaut)', imm: 'Immobilier hors résidence principale', titres: 'Titres (hors assurance-vie)', ent: 'Entreprises non cotées', av: 'Assurance-vie (capitaux décès)' };
D.CLASSES.forEach(function (k) {
  log('| ' + noms[k] + ' | ' + SC.map(function (s) { return r1(O[s].assiette.classes[k].valeur); }).join(' / ') + ' | ' + SC.map(function (s) { return pc(O[s].assiette.classes[k].g); }).join(' / ') + ' | ' + SC.map(function (s) { return r1(O[s].assiette.classes[k].gainNet); }).join(' / ') + ' |');
});
log('| Autres (liquidités, meubles) | ' + SC.map(function (s) { return r1(O[s].assiette.valeurs.autres); }).join(' / ') + ' | 0 | 0 |');
log('| **Total** | ' + SC.map(function (s) { return r1(O[s].assiette.valeurs.total); }).join(' / ') + ' | | **' + SC.map(function (s) { return r1(O[s].assiette.totalGainNet); }).join(' / ') + '** |');
log('| dont hors résidence principale | | | ' + SC.map(function (s) { return r1(O[s].assiette.totalHorsRP); }).join(' / ') + ' |');
log('| part des gains latents dans le flux | | | ' + SC.map(function (s) { return pc(O[s].assiette.partDuFlux); }).join(' / ') + ' |');
log('Repère : DMTG 2024 = ' + r1(C.dmtg2024) + ' Md€ (' + pc(C.dmtg2024 / C.fluxTransmis) + ' du flux) ; taux de droits par classe au central : ' + D.CLASSES.concat(['autres']).map(function (k) { return k + ' ' + pc(D.tauxDmtg('central')[k]); }).join(', ') + '.');
log('Base réelle (inflation 2 %) par défaut pour tous les actifs (décision du 03/11/2026) ; nominale = variante. En base nominale partout (central) : gain net total ' + r1(D.assiette('central', { reel: false }).totalGainNet) + ' Md€ ; en base réelle partout : ' + r1(D.assiette('central', { reel: true }).totalGainNet) + ' Md€.');

log('\n## B. Les trois options (Md€/an en régime de croisière ; hors résidence principale)');
log('| option | bas | central | haut |'); log('|---|---|---|---|');
row('(i) impôt de réalisation statique (50 %, report au conjoint)', function (o) { return o.i.statique; });
row('(i) après comportement (fuite η, anticipation)', function (o) { return o.i.brutes; });
row('(i) droits de succession perdus (dette déductible, CGI 768)', function (o) { return o.i.dmtgPerdus; });
row('**(i) recette nette**', function (o) { return o.i.nettes; });
row('(i) variante sans report au conjoint (règle à la lettre), nette', function (o) { return D.realisationDeces(o.scenario, { conjoint: false }).nettes; });
row('(i) variante avec franchise de 200 000 € (× 12/19), nette', function (o) { return D.realisationDeces(o.scenario, { franchise: true }).nettes; });
row('(i) variante avec résidence principale, nette', function (o) { return D.realisationDeces(o.scenario, { inclureRP: true }).nettes; });
row('(ii) recette immédiate', function (o) { return o.ii.immediat; });
row('(ii) année 5', function (o) { return o.ii.annee(5); });
row('(ii) année 10', function (o) { return o.ii.annee(10); });
row('(ii) année 20', function (o) { return o.ii.annee(20); });
row('**(ii) croisière (hors RP)**', function (o) { return o.ii.croisiereHorsRP; });
row('(ii) croisière avec résidence principale vendue par l\'héritier (50 %)', function (o) { return o.ii.croisiere; });
row('(ii) valeur actuelle de la croisière hors RP (λ / (λ + 3 %))', function (o) { return o.ii.croisiereHorsRP * o.ii.valeurActuelleRatio; });
row('(ii) cumul des dix premières années', function (o) { return D.trajectoireCarryover(o.scenario, 10, { rpVendue: 0 }).cumul; });
row('(iii) impôt brut', function (o) { return o.iii.impotBrut; });
row('(iii) crédit par classe (borne haute de la recette)', function (o) { return o.iii.creditParClasse; });
row('**(iii) recette, borne haute (par classe)**', function (o) { return o.iii.recettes; });
row('(iii) crédit groupé (borne basse)', function (o) { return o.iii.creditGroupe; });
row('**(iii) recette, borne basse (droits groupés)**', function (o) { return o.iii.recettesBasse; });
log('\nParamètres de (ii) : λ (vente annuelle par l\'héritier) ' + SC.map(function (s) { return pc(P[s].lambdaVie); }).join(' / ') + ' ; ω (gains jamais taxés) ' + SC.map(function (s) { return pc(P[s].omega); }).join(' / ') + ' ; années pour atteindre 63 % : ' + SC.map(function (s) { return r1(O[s].ii.ansPour63); }).join(' / ') + '.');
log('Comparaison : le CAE transpose à la France un coût de l\'effacement de ' + r1(C.usCout) + ' Md€/an (0,05 % du PIB américain, Tax Foundation). Rapport (i) central statique / CAE : ×' + r1(O.central.i.statique / C.usCout) + '.');

log('\n## C. Détail par classe au central (Md€/an)');
log('| classe | gain taxable | (i) brut | droits perdus | (i) net | (iii) impôt | (iii) droits de la classe | (iii) crédit |'); log('|---|---|---|---|---|---|---|---|');
['imm', 'titres', 'ent', 'av'].forEach(function (k) {
  var a = O.central.i.parClasse[k], b = O.central.iii.parClasse[k];
  log('| ' + noms[k] + ' | ' + r1(a.gainTaxable) + ' | ' + r2(a.brutes) + ' | ' + r2(a.dmtgPerdus) + ' | ' + r2(a.nettes) + ' | ' + r2(b.impot) + ' | ' + r2(b.droits) + ' | ' + r2(b.credit) + ' |');
});

log('\n## D. Entreprises : liquidité, vente forcée, pacte Dutreil (Md€/an ; impôt de (i) sur les entreprises, hors comportement)');
log('| étalement | grandeur | bas | central | haut |'); log('|---|---|---|---|---|');
[0, 5, 10].forEach(function (n) {
  var v = {}; SC.forEach(function (s) { v[s] = D.venteForcee(s, { annees: n }); });
  log('| ' + n + ' an(s) | part de l\'impôt payable sans vendre | ' + SC.map(function (s) { return pc(v[s].couvert); }).join(' | ') + ' |');
  log('| ' + n + ' an(s) | valeur d\'entreprise à céder | ' + SC.map(function (s) { return r2(v[s].valeurCedee); }).join(' | ') + ' |');
  log('| ' + n + ' an(s) | part du capital transmis à céder | ' + SC.map(function (s) { return pc(v[s].partDuCapitalCedee); }).join(' | ') + ' |');
  log('| ' + n + ' an(s) | droits Dutreil rappelés (vente pendant l\'engagement) | ' + SC.map(function (s) { return r2(v[s].droitsRappeles); }).join(' | ') + ' |');
});
var v0 = D.venteForcee('central', { annees: 0 });
log('Impôt effectif sur la valeur des entreprises transmises (central) : ' + pc(v0.tauxEffectifSurValeur) + ' ; paiement en titres : part du capital remise = ' + pc(v0.partCapitalEnTitres) + ' ; part Dutreil (' + P.central.partDutreil + ' Md€ sur ' + P.central.ent.V + ') : ' + pc(v0.partDutreil) + '.');
var e10 = D.etalement(100, 10, 0.03, 0.03), e10b = D.etalement(100, 10, 0.01, 0.03), e5 = D.etalement(100, 5, 0.02, 0.03);
log('Étalement de 100 M€ sur 10 ans à 3 % actualisé à 3 % : annuité ' + r2(e10.annuite) + ' ; valeur actuelle ' + r2(e10.valeurActuelle) + '. À 1 % : ' + r2(e10b.valeurActuelle) + ' (perte ' + r2(e10b.perte) + '). Sur 5 ans à 2 % : ' + r2(e5.valeurActuelle) + '.');
var ct = D.casType();
log('Cas type (entreprise de 100 M€, prix de revient 5 M€, donation avant 70 ans, Dutreil) : droits actuels ' + r2(ct.droits) + ' M€ ; impôt de réalisation à 50 % ' + r2(ct.impotRealisation) + ' M€ (' + pc(ct.impotSurValeur) + ' de la valeur ; ' + r1(ct.anneesDeDividendes) + ' années de dividendes à 3 %) ; total ' + r2(ct.totalAvec) + ' M€. Avec le prix d\'acquisition reporté : 0 à la transmission, ' + r2(ct.carryover.impotALaVente) + ' M€ à la vente.');

log('\n## E. Interaction avec la fiscalité pendant la vie');
log('Facteur sur l\'élasticité de réalisation (OCDE TWP 72, note 29) si l\'effacement disparaît : ' + SC.map(function (s) { return s + ' ' + r2(D.EPS_VIE[s]); }).join(', ') + ' (non intégré aux soldes des § 23-26).');
log('Le défaut des modèles reste la purge au décès : ces options s\'ajouteraient au solde net des § 23-26 si elles étaient retenues. À ne pas cumuler avec la variante décès de l\'assurance-vie du § 26 (deces: \'gainsLatents\') ni avec la fin de la purge du 150-0 B ter du § 27 (report150Deces) : ce sont des parties du même mécanisme (voir methode.md § 28).');
