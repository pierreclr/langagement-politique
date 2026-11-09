// Tests de la taxe de 1 % sur le patrimoine. Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js test_taxe_patrimoine.js
var T = this.TaxePatrimoine, X = this.OptionsFinancement, PI = this.PatrimoineImmobilier, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var SCS = T.SCS;

// 1. Faits : comptes de patrimoine 2024 (Insee Première n° 2081)
var C = T.CN;
proche(C.logements + C.autresBatiments + C.terrainsBatis, 9084, 1, 'constructions et terrains des ménages : 9 084 Md€ (arrondis)');
proche(C.anf, C.logements + C.autresBatiments + C.terrainsBatis + C.machines + C.stocks + C.autresProduits + C.autresNonProduits, 2, 'actifs non financiers = somme des postes (9 967)');
proche(C.actifsFinanciers, C.depots + C.titresCreance + C.creditsActif + C.actionsHorsOpc + C.opc + C.assuranceVie + C.droitsPension + C.autresComptesRecevoir, 115, 'actifs financiers ≈ somme des postes listés (autres systèmes d\'assurance non listés : 105)');
proche(C.anf + C.actifsFinanciers - C.passifs, C.patrimoineNet, 2, 'patrimoine net = actifs − passifs = 14 953');
proche(T.composantes('largeNet').total, C.patrimoineNet - 1251, 2, 'largeNet : patrimoine net hors autres comptes et autres systèmes d\'assurance non listés');
proche(T.composantes('pierre').total, 11850, 1e-9, 'assiette de référence : 11 850 Md€');
proche(T.composantes('pierreNet').total, 11850 - 1768, 1e-9, 'assiette nette : moins les 1 768 Md€ de crédits');
proche(T.RECETTES.dejaSupprimeesParPalier1, 45.622, 1e-9, 'taxe foncière + IFI déjà supprimés par le palier 1 : 45,6 Md€');
proche(T.RECETTES.tfMenages + T.RECETTES.tfHorsMenages, T.RECETTES.taxeFonciere, 1e-9, 'taxe foncière = ménages + hors ménages');
SCS.forEach(function (s) { proche(T.RECETTES.dmto[s], PI.PARAM[s].dmto, 1e-12, 'DMTO identiques au module immobilier (' + s + ')'); });

// 2. Distribution reconstituée
var cd = T.controleDistribution();
proche(cd.moyenne, 374900, 0.05 * 374900, 'moyenne reconstituée à 5 % près de 374 900 €');
proche(cd.masse.top1, 0.15, 0.015, 'top 1 % : 15 % de la masse');
proche(cd.masse.top10, 0.48, 0.015, 'top 10 % : 48 %');
proche(cd.masse.top50, 0.93, 0.015, 'top 50 % : 93 %');
proche(T.brutQuantile(0.5), 205100, 1e-6, 'médiane : 205 100 €');
proche(T.brutQuantile(0.99), 3020900, 1, 'P99 : 3 020 900 € (Pareto calé)');
ok(T.brutQuantile(0.999) > T.brutQuantile(0.99), 'queue croissante');

// 3. Abattement
var a0 = T.partAbattement('pierre', 0), a1 = T.partAbattement('pierre', 100000), a3 = T.partAbattement('pierre', 300000);
proche(a0.total, 0, 1e-12, 'pas d\'abattement : rien de retiré');
ok(a3.total > a1.total && a1.total > 0, 'l\'abattement retire plus quand il monte');
ok(a1.immo > a1.mobile, 'l\'abattement retire surtout de l\'immobilier (le capital mobile est concentré en haut)');
ok(a1.ménagesExoneres > 0.35 && a1.ménagesExoneres < 0.5, 'abattement 100 000 € : 35 à 50 % de ménages exonérés');

// 4. Recette : ordre des scénarios, bornes, cohérence
var r = {}; SCS.forEach(function (s) { r[s] = T.recette(s, {}); });
ok(r.bas.nette < r.central.nette && r.central.nette < r.haut.nette, 'bas < central < haut (convention : bas = le moins favorable)');
SCS.forEach(function (s) { ok(r[s].nette < r[s].comptable, 'la recette nette est sous le 1 % mécanique (' + s + ')'); });
proche(r.central.comptable, 118.5, 1e-9, '1 % mécanique de la référence : 118,5 Md€');
proche(r.central.nette, r.central.brute - r.central.exil - r.central.gestion, 1e-9, 'nette = brute − exil − gestion (sans différé ni DMTO)');
proche(T.recette('central', { avecReformeImmo: false }).nette, r.central.nette - 16.1, 1e-9, 'sans réforme immobilière : DMTO déduits une fois (16,1)');
proche(T.recette('central', { taux: 0 }).nette, 0, 1e-9, 'taux nul : recette nulle');
ok(T.recette('central', { taux: 0.02 }).nette < 2 * r.central.nette, 'taux de 2 % : moins du double (capitalisation plus forte)');
ok(T.recette('central', { abattement: 100000 }).nette < r.central.nette, 'abattement : recette plus faible');
ok(T.recette('central', { assiette: 'pierreNet' }).nette < r.central.nette, 'base nette : recette plus faible');
ok(T.recette('central', { assiette: 'large' }).nette > T.recette('central', { assiette: 'pierreAV' }).nette, 'assiette large > pierreAV');
proche(T.effetPrix('central', 0.01), -0.5 * (0.01 - 26.202 / 9696) / (0.020 + 26.202 / 9696), 1e-12, 'effet prix = −cap × Δτ / (rendement + τ actuel), rendement central 2,0 % (3,5 % avant V12420)');
proche(T.COMMUN.externalite, 0.03 * 0.35 + 0.5 * 0.69 / 30, 1e-12, 'autres impôts perdus par euro parti : 2,2 %/an');

// 5. Paiement différé
var d = T.recette('central', { differe: true }), d1 = T.recette('central', { differe: true, annee1: true });
proche(d.differe, r.central.brute * T.COMMUN.eligibleDiffere * T.PARAM.central.recours, 1e-9, 'recette reportée = brute × éligibles × recours');
proche(d.perteDiffere, d.differe * 0.05, 1e-9, 'croisière : 5 % non recouvrés au central');
proche(d1.perteDiffere, d1.differe, 1e-9, 'premières années : tout le report manque');
proche(T.recette('haut', { differe: true }).perteDiffere, 0, 1e-12, 'haut : recouvrement complet');

// 6. Cas types
var ct = T.casType({ valeurImmo: 300000, revenuMensuel: 1400 });
proche(ct.impot, 3000, 1e-9, 'retraité : 3 000 €/an');
proche(ct.partRevenu, 3000 / 16800, 1e-12, 'retraité : 17,9 % de sa pension');
proche(T.casType({ valeurImmo: 300000, revenuMensuel: 1400 }, { abattement: 300000 }).impot, 0, 1e-12, 'retraité exonéré avec un abattement de 300 000 €');
proche(T.casType({ depots: 15000 }).impot, 0, 1e-12, 'jeune locataire : livret hors de l\'assiette de référence');
proche(T.casType({ depots: 15000 }, { assiette: 'large' }).impot, 150, 1e-9, 'jeune locataire : 150 € avec l\'assiette large');
proche(T.casType({ valeurImmo: 450000, dettes: 250000, actions: 50000 }, { assiette: 'pierreNet' }).impot, 2500, 1e-9, 'cadre : 2 500 € net de dettes');
proche(T.casType({ actions: 1e7, revenuMensuel: 4000 }).partRevenu, 100000 / 48000, 1e-12, 'fondateur : 208 % de son salaire');

// 7. Qui paie
var pt = T.parTranche({}), som = 0; pt.forEach(function (g) { som += g.partDuTotal; });
proche(som, 1, 1e-9, 'parts par tranche : somme 1');
ok(pt[11].impotMoyen > pt[10].impotMoyen && pt[10].impotMoyen > pt[5].impotMoyen, 'l\'impôt moyen croît avec le patrimoine');
ok(pt[0].partDuTotal + pt[1].partDuTotal + pt[2].partDuTotal < 0.01, 'D1 à D3 : moins de 1 % du total');

// 8. Volatilité
var k = T.krach('central', {}, 185.2);
proche(k.indiceLocalParAn, 0.01 * r.central.baseImmo * 0.2, 1e-9, 'krach, indice local : 1 % × base immobilière × 20 %');
proche(k.reserveConseillee, 3 * k.indiceLocalParAn, 1e-9, 'réserve = trois années de krach');
proche(T.regularisation(185.2).net, 0, 1e-12, 'régularisation centrée avec un indice local');

// 9. Intégration dans options_financement : défaut inchangé, pas de double compte des DMTO
SCS.forEach(function (s) { proche(X.solde({}, s), X.solde({ immobilier: false, taxePatrimoine: null }, s), 1e-12, 'défaut inchangé (' + s + ')'); });
proche(X.solde({}, 'central'), -163.05, 0.1, 'palier 1 central : −163,05 (V11770 : 1,84 M au RSA ; −163,3 avec l\'ancien 1,9 M)');
proche(X.solde({ immobilier: true }, 'central'), -177.6659, 0.1, 'avec la réforme immobilière : −177,5'); // 04/11/2026 : ancienne valeur -177.5, recalée après les corrections de données V12400-V12404
proche(X.detail({ immobilier: true }, 'central').immobilier, PI.bilan('central').soldeNet, 1e-12, 'réforme immobilière = bilan(...).soldeNet');
proche(X.detail({ immobilier: true }, 'bas').immobilier, PI.bilan('haut').soldeNet, 1e-12, 'scénarios croisés pour la réforme immobilière');
var avec = X.detail({ immobilier: true, taxePatrimoine: { assiette: 'pierre' } }, 'central'), sans = X.detail({ taxePatrimoine: { assiette: 'pierre' } }, 'central');
proche(avec.taxePatrimoine, T.recette('central', { avecReformeImmo: true }).nette, 1e-12, 'avec la réforme : la taxe ne redéduit pas les DMTO');
proche(sans.taxePatrimoine, T.recette('central', { avecReformeImmo: false }).nette, 1e-12, 'sans la réforme : la taxe déduit les DMTO');
proche(avec.total - sans.total, PI.bilan('central').soldeNet + 16.1, 1e-9, 'DMTO comptés une seule fois : écart = recettes de plus-values − report');
proche(X.detail({ immobilier: true, taxePatrimoine: { assiette: 'pierre' } }, 'bas').taxePatrimoine, T.recette('haut', {}).nette, 1e-12, 'palier 1 bas → taxe haut (croisement)');
ok(X.solde({ immobilier: true, taxePatrimoine: { assiette: 'pierre' } }, 'central') > X.solde({ immobilier: true }, 'central') + 70, 'la taxe améliore le solde central de plus de 70 Md€');

log(n + ' contrôles au vert');
