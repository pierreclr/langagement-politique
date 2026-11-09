// Tests de variante_nationalite_0611.js (06/11/2026 ; non adoptée). Depuis ce dossier, avec jsc (en zsh, liste en tableau) : la liste de test_base_0611.js
//   sans test_base_0611.js, puis variante_nationalite_0611.js test_variante_nationalite_0611.js
//   (résultats : remplacer le test par rapport_variante_nationalite_0611.js ; sortie dans resultats_variante_nationalite_0611.txt)
var N = this.VarianteNationalite0611, V5 = this.Decisions0611V75, TP = this.TaxePatrimoine, A = this.Decisions0611V74;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var c = N.configV75(), ref = N.scenario('reference');

// 1. Contrôles de cohérence avec les modules existants
proche(N.calage(0.03, ref).ratio, V5.calage(0.03).ratio, 1e-12, 'référence : le calage recalculé égale celui de la v7.5 à 3 %');
proche(N.calage(0.045, ref).ratio, V5.calage(0.045).ratio, 1e-12, 'référence : idem à 4,5 %');
proche(N.recette(c, ref).totale, 62.52121796214634, 1e-9, 'référence : recette de la v7.5 recommandée = 62,52 Md€');
var sauv = [TP.PARAM.central.erosionTop, TP.PARAM.central.erosionReste, TP.COMMUN.partExil, A.HYP.patrimoine.tInf];
N.recette(c, N.scenario('AT1'));
ok(TP.PARAM.central.erosionTop === sauv[0] && TP.PARAM.central.erosionReste === sauv[1] && TP.COMMUN.partExil === sauv[2] && A.HYP.patrimoine.tInf === sauv[3], 'paramètres des modules existants restaurés après calcul');
proche(V5.recette(c).totale, 62.52121796214634, 1e-9, 'la v7.5 elle-même est inchangée après les calculs de la variante');
var g = N.grille(ref);
proche(g[0].totale, 63.42, 0.01, 'grille de référence à 3 % (K 375 k€) = 63,42 (bilan § 000.6)');
proche(g[3].totale, 68.39, 0.01, 'grille de référence à 4,5 % (K 700 k€) = 68,39 (bilan § 000.6)');

// 2. Érosion par canaux
var f0 = N.facteur(ref); proche(f0.facteur, 1, 1e-12, 'sans levier, le facteur d\'érosion vaut 1');
proche(f0.partExil, 20 / 74, 1e-12, 'sans levier, la part de l\'exil reste H512 = 20/74');
[0, 1, 2].forEach(function (k) { proche(N.erosions(N.scenario('AT' + k)).top, N.S.advaniTarrant[k], 1e-12, 'scénario AT' + k + ' : e1 = ' + N.S.advaniTarrant[k]); });
ok(N.scenario('AT0').rDecl < N.scenario('AT1').rDecl && N.scenario('AT1').rDecl < N.scenario('AT2').rDecl, 'leviers requis croissants de 17 % à 7 %');
var fN = N.facteur(N.scenario('seulNationalite')); ok(fN.partExil < f0.partExil && fN.facteur < 1, 'l\'impôt différentiel seul réduit l\'érosion et la part de l\'exil');

// 3. Sens des résultats
var r = {}; N.NOMS_SC.forEach(function (s) { r[s] = N.recette(c, N.scenario(s)); });
ok(r.seulNationalite.totale > r.reference.totale, 'impôt différentiel seul : recette en hausse');
ok(r.AT0.totale < r.AT1.totale && r.AT1.totale < r.AT2.totale, 'recette croissante quand l\'érosion baisse (17 → 12 → 7 %)');
ok(r.AT1.erosionTop < r.reference.erosionTop, 'érosion effective du 1 % plus faible en variante bien conçue');
ok(r.AT2.exil < r.reference.exil, 'autres impôts perdus par l\'exil plus faibles');
var bR = N.meilleur(ref), b1 = N.meilleur(N.scenario('AT1'));
ok(b1.totale > bR.totale && b1.config.tInf >= bR.config.tInf, 'le meilleur réglage bien conçu rapporte plus et à un taux au moins aussi élevé');
ok(b1.deltaV75 < N.S.manque, 'même bien conçue, la fonction du patrimoine ne comble pas seule le manque de 52,1 Md€');

// 4. Stock déjà parti
var sd = N.stockDeparts(); proche(sd.departs, 7480, 1e-9, 'départs ISF/IFI 2011-2021 = 7 480');
proche(sd.actifPartants, 32.4, 1e-9, 'actif net imposable des partants 2011-2021 = 32,4 Md€');
var mp = N.moyennePareto(1.7, c); ok(mp.W > 2e6 && mp.P > 0 && mp.P < 0.03 * mp.W, 'moyenne Pareto : W > 2 M€, impôt moyen < 3 % de W');
var d = N.differentiel(c); ok(d.bas.net < d.central.net && d.central.net < d.haut.net, 'impôt différentiel : bas < central < haut');
ok(d.central.gestion > 0 && d.central.net > 0, 'impôt différentiel central net du coût de gestion positif');
log('Tests : ' + n + ' vérifications, tous passés.');
