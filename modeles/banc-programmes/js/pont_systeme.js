/*
 * modeles/banc-programmes/js/pont_systeme.js : pont vers nos modèles JS (patrimoine, transmissions, trajectoire de notre système).
 * Lancé par ponts.py avec jsc, depuis modeles/systeme-ideal/, après la liste de chargement de decisions_0811.js (voir ponts.py).
 * Sortie : une ligne JSON. Aucune écriture de fichier. Fonctions pures au-dessus des modules existants, qui ne sont pas modifiés.
 * Convention des scénarios des modules : bas = favorable, central, haut = défavorable.
 */
var G = this.GrandesFortunes0511, T = this.Transmissions0611, E = this.Decisions0811, R = this.RetraitesAisees0611, ST = this.Stress, DS = this.VarianteDetteStable;
var SCS = ['bas', 'central', 'haut'], out = {};

// --- 1. Impôt sur la fortune rétabli (barème 3 taux du module grandes_fortunes_0511.varianteB, seuil de 1,3 M€ par foyer) ---
var ADULTES = G.HYP.adultesParMenage;
var SEUIL_ISF_FOYER = 1.3e6;   // seuil de l'ISF jusqu'en 2017 (patrimoine net taxable du foyer)
var VARIANTES_ISF = { sobre: { tauxMilieu: 0.008, taux2: 0.015, taux3: 0.015 }, renforce: { tauxMilieu: 0.01, taux2: 0.02, taux3: 0.03 } };
out.isf = {};
Object.keys(VARIANTES_ISF).forEach(function (nom) {
  var v = VARIANTES_ISF[nom];
  out.isf[nom] = SCS.map(function (sc) {
    var o = { seuilAdulte: SEUIL_ISF_FOYER / ADULTES, tauxMilieu: v.tauxMilieu, taux2: v.taux2, taux3: v.taux3 };
    var r = G.varianteB(sc, o);
    return { recette: r.recetteVariante, foyers: r.foyersImposes, statiqueBrut: r.brutVariante };
  });
});
out.isf_params = { seuilFoyer: SEUIL_ISF_FOYER, variantes: VARIANTES_ISF, adultesParMenage: ADULTES };

// --- 2. Impôt plancher de 2 % au-dessus de 100 M€ (type Zucman), net de ce que l'ISF et le prélèvement unique font déjà payer au sommet ---
out.plancher = {};
Object.keys(VARIANTES_ISF).forEach(function (nom) {
  out.plancher[nom] = SCS.map(function (sc, k) {
    var Tt = G.tranches(sc).T3, W = Tt.W, p = G.HYP.partAssiette1pc, y = G.HYP.rendementImposable[k], I = G.HYP.tPlat * y;
    var tauISF = VARIANTES_ISF[nom].taux3 * p, plancher = 0.02, complement = Math.max(0, plancher - tauISF - I);
    var brut = Tt.n * W * complement / 1e9;
    var eBase = G.erosion(sc, tauISF * 100), eVar = G.erosion(sc, (tauISF + complement) * 100);
    var apres = Tt.n * W * (1 - eVar) * Math.max(plancher, tauISF + I) / 1e9, avant = Tt.n * W * (1 - eBase) * (tauISF + I) / 1e9;
    var ext = Tt.n * W * G.HYP.partExil * (eVar - eBase) * G.HYP.externalite / 1e9;
    return { foyers: Tt.n, patrimoineMoyen: W, complement: complement, brut: brut, net: apres - avant - ext, erosion: eVar };
  });
});
// Zucman « fidèle » sur le droit actuel (sans ISF), pour mémoire : module zucmanSurDroitActuel
out.zucman_droit_actuel = SCS.map(function (sc) { return G.zucmanSurDroitActuel(sc); });

// --- 3. Transmissions : fonction du module transmissions_0611.recette (exonération A, forme progressive ou plate), puis plafond d'héritage ---
var CONF = { progressif150: { A: 150000, K: 500000 }, plat20: { A: 150000, plat: 0.20 }, plat35: { A: 150000, plat: 0.35 }, plat45: { A: 150000, plat: 0.45 },
             actuel_ref: { A: 100000, K: 500000, top: true, nationalite: 'court' } };
out.succession = {};
Object.keys(CONF).forEach(function (nom) {
  var tr = T.trois(CONF[nom]);   // [favorable, central, défavorable]
  out.succession[nom] = tr.map(function (r) { return { recette: r.recette, netActuel: r.netActuel, partNePaientRien: r.partNePaientRien }; });
});
// Plafond d'héritage : part du cumul reçu au-dessus de P, ramenée à 100 % de prélèvement ; l'excédent, net du marginal déjà compté (55 %) et des comportements du module (déclaration d, exil e, taux marginal 100 % : r = 1,5)
out.plafond = {};
[8e6, 12e6, 20e6].forEach(function (P) {
  out.plafond[String(P)] = [0, 1, 2].map(function (k) {
    var g = T.grille(), E0 = T.echelle(k), s = 0;
    g.nodes.forEach(function (x) { var H = x.h * E0; if (H > P) s += x.w * (H - P); });
    var exces = s * T.S.cohorte / 1e9 / g.poids;     // Md€/an, statique, au-dessus du plafond
    var r = 1.5, d = Math.min(0.9, T.HYP.d[k] * r), e = Math.min(0.9, T.HYP.eMobile[k] * r * 1);   // eMobile au sommet : mobilité maximale (facteur mob = 1)
    var retention = (1 - d) * (1 - e), dejaCompte = 0.55;
    return { exces: exces, retention: retention, net: exces * (1 - dejaCompte) * retention };
  });
});
out.succession_params = { dmtg: T.S.dmtg, flux: T.S.flux, cohorte: T.S.cohorte };

// --- 4. Trajectoire de notre système (S3, macro de référence et prudente) et droit actuel ---
function serie(t, n) { return { ratio: t.ratio.slice(0, n), primaire: t.primaire ? t.primaire.slice(0, n) : null, deficit: t.deficit.slice(0, n), interets: t.interets ? t.interets.slice(0, n) : null }; }
var s3 = this.Correction0811.s3();   // S3 après correction du double compte du différé (V32012, V32018), couche CORRECTION0811
out.systeme = { F: s3.F, a: s3.a, revenus: s3.revenus, credit: s3.credit, transmissions: s3.transmissions, patrimoineNat: s3.patrimoineNat, pension: s3.pension, eco: s3.eco,
                effetCouche: s3.effetCouche, po_md: s3.po.md, po_pct: s3.po.pct, po_elargi: s3.po.elargisPct, picAn: s3.picAn, pic: s3.pic,
                reference: serie(s3.traj, 30), prudente: serie(s3.trajPrudente, 30), annee1: 2029 };
var ECO = ST.ECO;
out.eco = { dette0: ECO.dette0, pib0: ECO.pib0, interets0: ECO.interets0, imarche: ECO.imarche, dureeDette: ECO.dureeDette, gNominal: ECO.gNominal, preroll: ST.PREROLL,
            macro: DS.HYP.macro, deficit2024: 169.1 };
out.actuel = { reference: R.trajActuel('reference'), prudente: R.trajActuel('prudente') };
out.actuel.reference.ratio = out.actuel.reference.ratio.slice(0, 30); out.actuel.reference.deficit = out.actuel.reference.deficit.slice(0, 30);
out.actuel.prudente.ratio = out.actuel.prudente.ratio.slice(0, 30); out.actuel.prudente.deficit = out.actuel.prudente.deficit.slice(0, 30);

// --- 5. Paramètres de coût du modèle réutilisés par le banc ---
out.parametres = { coutPoint1pc: DS.HYP.masse.coutPoint1pc, remuneration2025: DS.HYP.masse.remuneration2025, agents: DS.HYP.masse.agents, pibModele: DS.HYP.pibModele };
print(JSON.stringify(out));
