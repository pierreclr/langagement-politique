// Export de la BASE DE TRAVAIL du 06/11/2026 (base_0611.js) pour sources/calculs/bilan_global.py (dictionnaire BASE0611) et le bilan global (document de travail non publié, § 000).
// Même liste de chargement que test_base_0611.js, ce fichier à la place du test. Rien n'est adopté : les jeux de réglages sont présentés à l'auteur.
var B = this.BaseTravail0611, V5 = this.Decisions0611V75, A = this.Decisions0611V74;
var L = B.lignes(), T = B.totaux(L), out = { lignes: L.map(function (l) { return { id: l.id, groupe: l.groupe, poste: l.poste, v: l.v, sens: l.sens, cote: l.cote, nature: l.nature, statut: l.statut, note: l.note }; }) };
out.totaux = T; out.v75 = B.v75(); out.epargne = B.epargne(); out.restauration = B.restauration(); out.fantomes = B.FANTOMES_DANS_LE_SOLDE;
out.dette = B.dette(T.central);
out.detteBas = B.dette(T.bas).manque; out.detteHaut = B.dette(T.haut).manque;
var manque = out.dette.manque.reference;
out.casTypesBase = B.casTypesCorriges();
out.marginalActuel = { m5_10: B.marginalActuel('cadre_5000', 'cadre_10000'), m10_20: B.marginalActuel('cadre_10000', 'cadre_20000') };
var PTS = [0, 1000, 1500, 2000, 3000, 5000, 7000, 10000, 14162.18, 20000, 28149.88], WS = [0, 1e5, 3e5, 5e5, 1e6, 2e6, 5e6, 1e7, 2e7, 5e7, 1e8];
var ECO = B.S.solideo + B.S.cojo;
// (a) fonction des revenus seule
var ja = B.jeuRevenus(manque);
out.jeuA = { param: ja.param, recette: ja.recette, deltaB: B.deltaB(ja.bareme, PTS), casTypes: B.casTypesCorriges(ja.bareme), dette: B.dette(T.central + ja.recette).manque };
// (b) fonction du patrimoine en haut seule : grille de t∞, K minimal sous la contrainte dure
out.grilleB = [0.03, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06].map(function (t) { var j = B.jeuPatrimoine(t); return { tInf: t, K: j.c.K, recette: j.recette, delta: j.delta, differe: j.differe, encaisse: j.encaisse, erosion: j.erosion }; });
var best = out.grilleB.reduce(function (a, b) { return b.delta > a.delta ? b : a; });
var cb = { regime: 'RP', X: 1e6, tInf: best.tInf, K: best.K, payeProrata: true, plancherPro: true };
out.jeuB = { tInf: best.tInf, K: best.K, recette: best.recette, delta: best.delta, differe: best.differe, erosion: best.erosion, reste: manque - best.delta,
             table: B.tablePatrimoine(cb, WS), tableBase: B.tablePatrimoine(B.S.v75, WS), casLimites: B.casLimites(cb), casLimitesBase: B.casLimites(B.S.v75), dette: B.dette(T.central + best.delta).manque };
// (c) mix : patrimoine à t∞ = 4 % (K minimal), économies publiques chiffrées (missions terminées), fonction des revenus pour le reste
var jp = B.jeuPatrimoine(0.04), cc = jp.c, resteC = manque - jp.delta - ECO, jc = B.jeuRevenus(resteC);
out.jeuC = { tInf: 0.04, K: cc.K, patrimoine: jp.delta, differe: jp.differe, erosion: jp.erosion, economies: ECO, revenus: jc.recette, param: jc.param, deltaB: B.deltaB(jc.bareme, PTS), casTypes: B.casTypesCorriges(jc.bareme),
             table: B.tablePatrimoine(cc, WS), casLimites: B.casLimites(cc), dette: B.dette(T.central + jp.delta + ECO + jc.recette).manque };
out.PTS = PTS; out.WS = WS;
print(JSON.stringify(out));
