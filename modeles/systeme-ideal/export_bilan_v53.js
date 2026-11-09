// Export des composantes de la v5.3 pour sources/calculs/bilan_global.py (valeurs au scénario central ; bas et haut pour le solde).
// Depuis ce dossier : jsc <liste de test_decisions_0511.js jusqu'à decisions_0511.js> decisions_0511b.js export_bilan_v53.js
var Z = this.Optimum, B = this.Decisions0511b, D = this.Decisions0511, M = this.SystemeIdeal, F = this.Voies.fus, OF = this.OptionsFinancement, O = this.Optimisation, S_ = this.Sante, R2 = this.Retraites2, P1 = this.Palier1;
var a = Z.archi(B.archiV53()), out = {};
function r(x) { return Math.round(x * 10000) / 10000; }
['bas', 'central', 'haut'].forEach(function (sc) {
  Z.avecExil(a.exil, function () {
    var o = OF.opt(Z.versOF(a)), st = OF.stOption(o), p = O.configR(st), ms = M.solde(F(p, { scenario: sc, droitsActuelsTransmissions: false }));
    var d = Z.detail(a, sc), od = OF.detail(o, sc), pr = Z.prelevements(a, sc), L = {};
    D.lignes(a, sc).forEach(function (l) { L[l.id] = r(l.v); });
    out[sc] = {
      solde_v53: r(B.solde(a, sc, false)), solde_avec_pistes: r(B.solde(a, sc, true)), pistes: r(B.pistes(sc)),
      recettes: { courants: r(ms.recettes.courants), transmissions: r(ms.recettes.transmissions), retraites: r(ms.recettes.retraites), is: r(ms.recettes.is) },
      postes: { socle: r(ms.postes.socleAdultes), enfants: r(ms.postes.enfants), remplacees: r(ms.postes.depensesRemplacees), chomage: r(ms.postes.assuranceChomage), creditHoldings: r(ms.postes.creditHoldings), complements: r(ms.postes.complements.total), aahBrut: r(ms.postes.complements.aahBrut), aahEconomie: r(ms.postes.complements.aahEconomie), rsa: r(ms.postes.complements.rsa) },
      sante: r(S_.economies(sc).total), hp: r(R2.contribution(P1.HP, sc).netMd), parentIsole: r(ms.soldePublic + S_.economies(sc).total + R2.contribution(P1.HP, sc).netMd - od.base), soldePublic: r(ms.soldePublic),
      of: { report150: r(od.report150), avDeces: r(od.avDeces), economies: r(od.economies), immobilier: r(od.immobilier), base: r(od.base), total: r(od.total) },
      detail: { options: r(d.options), conjoint: r(d.conjoint), exemptionVie: r(d.exemptionVie), capitalDepart: r(d.capitalDepart), taxe: r(d.taxe), correctifs: r(d.correctifs), correctifsA: r(d.correctifsDetail.a), correctifsB: r(d.correctifsDetail.b),
                structurelles: r(d.structurelles), nichesTVA: r(d.nichesTVA), education: r(d.education), gestion: r(d.gestion), effectifs: r(d.effectifs), protection: r(d.protection), total: r(d.total) },
      prelevements: { delta: r(pr.delta), transfertsNets: r(pr.transfertsNets) },
      lignes: L
    };
  });
});
out.pistes = {}; ['P1', 'P3', 'P4', 'P5', 'P6', 'R0'].forEach(function (k) { out.pistes[k] = D.PISTES[k].v; });
out.dette = { central_sans: r(B.dette('central', false).ratio10), central_avec: r(B.dette('central', true).ratio10) };
log = (typeof print === 'function') ? print : console.log; log(JSON.stringify(out, null, 1));
