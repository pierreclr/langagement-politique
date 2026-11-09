// Sensibilité du solde aux valeurs fiabilisées des mesures 20 (gestion) et 21 (effectifs et IA), 04/11/2026 : sources/gestion-effectifs-fiabilisation.md.
// Ne modifie AUCUN paramètre par défaut : GESTION et EFFECTIFS_IA sont remplacés le temps d'un calcul, puis rétablis. Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js \
//       optimum.js sensibilite_gestion_effectifs.js
// Ordre du modèle : [favorable, central, défavorable] (inverse des rapports sources). Md€/an en croisière.
var Z = this.Optimum;
var log = (typeof print === 'function') ? print : console.log;
function r2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−'); }
function sg(x) { return (x >= 0 ? '+' : '−') + r2(Math.abs(x)); }
function copie(o) { var c = {}; Object.keys(o).forEach(function (k) { c[k] = o[k].slice ? o[k].slice() : o[k]; }); return c; }

// ---- Lignes de gestion (rapport, Md€/an, ordre du modèle : ampleur haute / centrale / basse) ----
// L1a DGFiP, L1b Urssaf, L1c MSA-Agirc-Arrco-caisses (bases non publiées), L1d collectivités (déjà dans A1), L2a CAF, L2b France Travail (part non publiée), L2c Unédic
var DEF = { L1a: [2.39, 1.24, 0.44], L1b: [0.74, 0.46, 0.16], L1c: [1.19, 0.46, 0.11], L1d: [0.16, 0.05, 0.01], L2a: [2.18, 1.56, 1.04], L2b: [1.74, 1.10, 0.60], L2c: [0.04, 0.03, 0.01] };
// CAF recalculée sur la base lue (PLACSS 2023, annexe 6) : base 3,20 / 2,68 / 2,39 Md€ (comptes 2025 / FNGA brut 2023 / FNGA net 2023) × part remplacée 0,85 / 0,75 / 0,65 × part supprimée 0,80 / 0,65 / 0,50
var CAF = [3.20 * 0.85 * 0.80, 2.68 * 0.75 * 0.65, 2.39 * 0.65 * 0.50];
var PT = 70000, MS = 0.70;                              // € par poste ; part de masse salariale dans la gestion (G11)
function lignes(opt) {
  var L = copie(DEF);
  if (opt.caf) L.L2a = CAF;
  if (opt.defendable) { L.L1c = [0, 0, 0]; L.L2b = [0, 0, 0]; }
  return L;
}
function somme(L, i) { return L.L1a[i] + L.L1b[i] + L.L1c[i] + L.L1d[i] + L.L2a[i] + L.L2b[i] + L.L2c[i]; }
/** Gestion supprimée après plafond des départs : seules les lignes des organismes de sécurité sociale (hors DGFiP, collectivités) sont plafonnées, par `supply` départs en 10 ans ; 30 % de la gestion n'est pas de la masse salariale. */
function plafonnee(L, i, supply) {
  var secu = L.L1b[i] + L.L1c[i] + L.L2a[i] + L.L2b[i] + L.L2c[i];
  var demande = secu * MS * 1e9 / PT, r = demande > 0 ? Math.min(1, supply / demande) : 1;
  return { total: L.L1a[i] + L.L1d[i] + secu * ((1 - MS) + MS * r), r: r, demande: demande };
}
var DEPARTS_SECU = { retraites: 14849, avecSortiesHorsRetraite: 21452, bornehaute: 25891 };   // gestion_effectifs_fiabilisation_resultats.txt § 2

function poser(opt) {   // opt : { caf, defendable, supply, socle, ia }
  var L = lignes(opt), sup = [0, 1, 2].map(function (i) { return opt.supply ? plafonnee(L, i, opt.supply).total : somme(L, i); });
  Z.GESTION.supprimee = sup;
  Z.GESTION.coutSocle = opt.socle ? [0.32, 0.64, 1.46] : [0.32, 0.64, 1.27];
  if (opt.ia) { Z.EFFECTIFS_IA.central = opt.ia.central; Z.EFFECTIFS_IA.ambitieux = opt.ia.ambitieux; }
  return sup;
}
var SAUV = { g: { supprimee: Z.GESTION.supprimee.slice(), coutSocle: Z.GESTION.coutSocle.slice() }, e: { central: Z.EFFECTIFS_IA.central.slice(), ambitieux: Z.EFFECTIFS_IA.ambitieux.slice() } };
function rétablir() { Z.GESTION.supprimee = SAUV.g.supprimee; Z.GESTION.coutSocle = SAUV.g.coutSocle; Z.EFFECTIFS_IA.central = SAUV.e.central; Z.EFFECTIFS_IA.ambitieux = SAUV.e.ambitieux; }
var SCS = ['bas', 'central', 'haut'];
function mesure(opt) {
  try {
    var sup = poser(opt), res = { sup: sup }, nets = [0, 1, 2].map(function (i) { return Z.gestionNette(Z.BASE_V5, i); });
    res.gestion = nets; res.soldes = SCS.map(function (s) { return Z.solde(Z.BASE_V5, s); });
    res.eff = SCS.map(function (s) { return Z.detail(Z.BASE_V5, s).effectifs; });
    return res;
  } finally { rétablir(); }
}
var IA_NEUF = { central: [-0.11, -0.11, -0.40], ambitieux: [2.28, -0.11, -0.40] };   // gains de temps 2,5 / 6 / 15 % (mesures UK, Danemark, DITP), sources/calculs/gestion_effectifs_fiabilisation_resultats.txt § 1
var IA_DITP = { central: [0.08, 0.08, -0.40], ambitieux: [2.51, 0.08, -0.40] };      // variante : central = gain DITP sur tâches (12 %) appliqué à tout le temps
var CAS = [
  ['S0  défauts du modèle (v5)', {}],
  ['S1  base CAF lue (2,68 Md€ au central) et coût du socle défavorable 0,92 % (Cnav)', { caf: true, socle: true }],
  ['S2  S1 sans les lignes à base non publiée (L1c MSA/Agirc-Arrco, L2b France Travail)', { caf: true, socle: true, defendable: true }],
  ['S3a S2 + plafond des départs, retraites seules (14 849 départs en 10 ans dans les organismes)', { caf: true, socle: true, defendable: true, supply: DEPARTS_SECU.retraites }],
  ['S3b S2 + plafond des départs avec sorties hors retraite ×1,5 (21 452)', { caf: true, socle: true, defendable: true, supply: DEPARTS_SECU.avecSortiesHorsRetraite }],
  ['S4  S1 + plafond des départs (21 452), lignes non publiées conservées', { caf: true, socle: true, supply: DEPARTS_SECU.avecSortiesHorsRetraite }],
  ['S5  effectifs et IA : gains de temps mesurés (2,5 / 6 / 15 %)', { ia: IA_NEUF }],
  ['S6  effectifs et IA : central = gain DITP sur tâches (12 %) généralisé', { ia: IA_DITP }],
  ['S7  S3b + S5 (valeurs prudentes des deux mesures)', { caf: true, socle: true, defendable: true, supply: DEPARTS_SECU.avecSortiesHorsRetraite, ia: IA_NEUF }],
  ['S8  S3a + S5 (le plus bas)', { caf: true, socle: true, defendable: true, supply: DEPARTS_SECU.retraites, ia: IA_NEUF }]
];
log('## Sensibilité du solde (BASE_V5, taux plat inchangé) aux valeurs fiabilisées des mesures 20 et 21');
log('| cas | gestion nette fav / centr / défav | effectifs et IA fav / centr / défav | solde bas / central / haut | écart du solde central (Md€) | écart en points de taux plat |');
log('|---|---|---|---|---|---|');
var base = mesure({});
CAS.forEach(function (c) {
  var m = mesure(c[1]);
  log('| ' + c[0] + ' | ' + m.gestion.map(r2).join(' / ') + ' | ' + m.eff.map(r2).join(' / ') + ' | ' + m.soldes.map(r2).join(' / ') + ' | ' + sg(m.soldes[1] - base.soldes[1]) + ' | ' + sg((m.soldes[1] - base.soldes[1]) / 10.8) + ' |');
});
log('');
log('## Gestion supprimée brute (L1 + L2, ordre du modèle ampleur haute / centrale / basse) et part conservée par le plafond des départs');
[['défauts', {}], ['base CAF lue', { caf: true }], ['sans lignes non publiées', { caf: true, defendable: true }]].forEach(function (c) {
  var L = lignes(c[1]);
  log('| ' + c[0] + ' | brute ' + [0, 1, 2].map(function (i) { return r2(somme(L, i)); }).join(' / ') + ' | plafonnée (retraites seules) ' + [0, 1, 2].map(function (i) { return r2(plafonnee(L, i, DEPARTS_SECU.retraites).total) + ' (r ' + r2(plafonnee(L, i, DEPARTS_SECU.retraites).r) + ')'; }).join(' / ') + ' | plafonnée (×1,5) ' + [0, 1, 2].map(function (i) { return r2(plafonnee(L, i, DEPARTS_SECU.avecSortiesHorsRetraite).total) + ' (r ' + r2(plafonnee(L, i, DEPARTS_SECU.avecSortiesHorsRetraite).r) + ')'; }).join(' / ') + ' |');
});
log('');
log('## Vérification que les défauts sont rétablis : gestion ' + Z.GESTION.supprimee.join(' / ') + ' ; socle ' + Z.GESTION.coutSocle.join(' / ') + ' ; IA ' + Z.EFFECTIFS_IA.central.join(' / '));
