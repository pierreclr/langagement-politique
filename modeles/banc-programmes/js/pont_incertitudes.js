/*
 * modeles/banc-programmes/js/pont_incertitudes.js : bornes favorable / défavorable de chaque module de notre système (S3 du 08/11/2026), une par une, « module seul ».
 * Lancé par ponts.py avec jsc, depuis modeles/systeme-ideal/, après la liste de chargement de decisions_0811.js. Sortie : une ligne JSON. Aucune écriture de fichier.
 *
 * Méthode (voir modeles/banc-programmes/README.md § « Notre système dans le banc ») :
 *   - le niveau des leviers votés (F, calé au central pour une dette stable à partir de 2038) reste FIXE : c'est la loi qu'on voterait ; ce que chaque module rapporte vraiment varie ;
 *   - pour chaque module, on rejoue la fonction du modèle qui le calcule au scénario favorable puis défavorable, tout le reste étant au central, et on retient l'écart
 *     (favorable - central, défavorable - central) en Md€ de 2025 par année 2029-2058 ; la trajectoire du solde primaire est linéaire dans ces écarts (decisions_0811.js : lev(s, y) s'ajoute au net) ;
 *   - convention des modules : [favorable, central, défavorable] ; pour les fonctions des modèles notées « bas / central / haut », l'ordre de l'effet sur le solde est relevé et le plus favorable est
 *     retenu comme favorable (aucune hypothèse sur ce que « bas » veut dire).
 * Ce qui n'est PAS propagé (socle hérité de l'architecture v5, corrections du grand livre, impôt de suite sur la fonction du patrimoine, TR03) est listé dans `fixe`.
 */
var E = this.Decisions0811, D = this.Decisions0711, A = this.Decisions0611V74, G = this.Decisions0511g, H = this.Decisions0511h, J = this.Decisions0511j,
    Bt = this.BaseTravail0611, Y = this.Decisions0611V72, K = this.Consolidation0611, T = this.Transmissions0611, R = this.RetraitesAisees0611, V5 = this.Decisions0611V75, ST = this.Stress;
var AN = []; for (var yy = 2029; yy <= 2058; yy++) AN.push(yy);
var SCN = ['bas', 'central', 'haut'];
function ramp(y) { return Math.max(0, Math.min(1, (y - R.S.rampe[0]) / (R.S.rampe[1] - R.S.rampe[0]))); }
function cst(x) { return AN.map(function () { return x; }); }
function rmp(x) { return AN.map(function (y) { return x * ramp(y); }); }
function add(a, b) { return a.map(function (x, i) { return x + b[i]; }); }
function sub(a, b) { return a.map(function (x, i) { return x - b[i]; }); }
function zero() { return cst(0); }
function fav(a, b) { var s = a.reduce(function (p, x) { return p + x; }, 0) >= b.reduce(function (p, x) { return p + x; }, 0); return s ? [a, b] : [b, a]; }   // [plus favorable, moins favorable]

var CO = this.Correction0811, N1 = this.Decisions1111, N1B = this.Decisions1111B, N1D = this.Decisions1111D, N13 = this.Decisions1311, s = N13.s3(), mods = [], fixe = [];   // S3 avec la fonction unique des revenus (DECISIONS1311, 13/11/2026 : lignes FU01, FU02 rattachées à M-PL) ;   // S3 après correction du double compte du différé (CORRECTION0811) et décisions du 11/11 (DECISIONS1111 : retraites de la loi de 2023, entreprise d'État à 1 Md€)
function mod(id, lib, source, cote, facteur, lam, sens, profil, dFav, dDef, c) {
  mods.push({ id: id, libelle: lib, source: source, cote: cote, facteur: facteur, lambda: lam, sens: sens, profil: profil, central: c === undefined ? null : c, d_fav: dFav, d_def: dDef });
}
function maxAbs(a) { return a.reduce(function (p, x) { return Math.max(p, Math.abs(x)); }, 0); }

// ------------------------------------------------------------------------------------------------ 1. Lignes de la couche (lignes de D.lignes et de decisions_0811.js), écart constant dès 2029
var GROUPES = [
  { id: 'M-GT', lib: 'Garantie de transition, arrêts maladie, pont vers la retraite (DG01-DG04)', ids: ['DG01', 'DG02', 'DG03', 'DG04'], f: 'cout', l: 0.5, src: 'decisions_0711.js gtLignes (budget « coût constant en ligne droite »), garantie_transition.js' },
  { id: 'M-TVA', lib: 'TVA à 5 % / 10 % / 20 % (TV01-TV10)', ids: ['TV01', 'TV02', 'TV03', 'TV04', 'TV05', 'TV06', 'TV07', 'TV08', 'TV09', 'TV10'], f: 'comportement', l: 0.5, src: 'decisions_0711.js tva() (élasticités), decisions_0811.js tvaAutres() (± 50 % d\'assiette)' },
  { id: 'M-CAP', lib: 'Capitaux mobiliers : prélèvements des résidents fondus dans la fonction des revenus (DC01)', ids: ['DC01'], f: 'comportement', l: 0.5, src: 'decisions_0711.js HYP.rcm' },
  { id: 'M-FRP', lib: 'Frais professionnels au réel (DC03)', ids: ['DC03'], f: 'cout', l: 0.3, src: 'decisions_0711.js HYP.fraisReels' },
  { id: 'M-GA', lib: 'Grand âge : hébergement et aide à domicile (GA01, GA02)', ids: ['GA01', 'GA02'], f: 'cout', l: 0.5, src: 'modeles/grand-age/ (central, abattement 100 000 €), decisions_0811.js HE1-HE2' },
  { id: 'M-CS', lib: 'Conversions en salaire à coût employeur inchangé : mutuelle, transport (CS01, CS02)', ids: ['CS01', 'CS02'], f: 'comportement', l: 0.3, src: 'decisions_0811.js HE5' },
  { id: 'M-PL', lib: 'Plancher en deux parts (627 + 250 €) fondu dans la fonction unique des revenus (premier euro à 38 %) et coefficient de lieu (PL01, PL02, FU01, FU02)', ids: ['PL01', 'PL02', 'FU01', 'FU02'], f: 'cout', l: 0.3, src: 'decisions_0811.js HE6-HE7 (DREES) ; decisions_1311.js (fonction_unique_1311.js recette, μ = 0,38)' },
  { id: 'M-OM', lib: 'Outre-mer : sur-rémunérations, prix alimentaires (OM01, OM02)', ids: ['OM01', 'OM02'], f: 'cout', l: 0.3, src: 'decisions_0811.js HE8 (Cour des comptes 2020, Insee)' },
  { id: 'M-08', lib: 'Chiffrage du 08/11 : collectivités, justice, protection de l\'enfance, imprévus, retenue victimes, artificialisation (CL01, JU01, EN01, IM01, VI01, ZA01, ZA02)', ids: ['CL01', 'JU01', 'EN01', 'IM01', 'VI01', 'ZA01', 'ZA02'], f: 'cout', l: 0.5, src: 'sources/chiffrage-decisions-0811.md via decisions_0811.js HE9' }
];
var dejaGroupe = {};
GROUPES.forEach(function (g) {
  var dF = 0, dD = 0, c = 0, sens = null, n = 0;
  s.lignes.forEach(function (l) {
    if (g.ids.indexOf(l.id) < 0) return;
    dejaGroupe[l.id] = true; dF += l.v[0] - l.v[1]; dD += l.v[2] - l.v[1]; c += l.v[1]; n++; sens = sens || l.sens;
  });
  var sensG = (g.id === 'M-TVA' || g.id === 'M-CAP' || g.id === 'M-CS' || g.id === 'M-FRP') ? 'po' : 'dep';
  if (Math.abs(dF) + Math.abs(dD) > 1e-9) mod(g.id, g.lib, g.src, 'B-D (selon la ligne)', g.f, g.l, sensG, 'const', cst(dF), cst(dD), c);
  else fixe.push({ id: g.id, libelle: g.lib, raison: 'bornes identiques au central dans le modèle' });
});
s.lignes.forEach(function (l) { if (!dejaGroupe[l.id] && (l.v[0] !== l.v[1] || l.v[2] !== l.v[1])) fixe.push({ id: l.id, libelle: l.poste, raison: 'ligne non rattachée à un module du banc' }); });

// Gestion de l'Urssaf (CS01 de la consolidation) : v = [favorable, central, 0]
var uv = K.urssaf().v;
mod('M-URSSAF', 'Gestion de l\'Urssaf : économie de fonctionnement (consolidation_0611.js urssaf())', 'consolidation_0611.js', 'C', 'cout', 0.3, 'dep', 'const', cst(uv[0] - uv[1]), cst(uv[2] - uv[1]), uv[1]);

// ------------------------------------------------------------------------------------------------ 2. Lignes de la base de travail (BT02 à BT14), constantes dès 2029 ; BT01 (patrimoine v7.5) traité à part
var BT = Bt.lignes(), GBT = [
  { id: 'M-SECU', lib: 'Sécurité sociale à 100 % sur le socle : dépense publique, TSA perdue, gestion, C2S (BT04-BT07)', ids: ['BT04', 'BT05', 'BT06', 'BT07'], f: 'cout', l: 0.5, sens: 'dep', src: 'base_0611.js HB4-HB5 (HCAAM, CSBM)' },
  { id: 'M-EPAR', lib: 'Épargne réglementée exonérée (BT02)', ids: ['BT02'], f: 'comportement', l: 0.3, sens: 'po', src: 'base_0611.js HB1-HB2' },
  { id: 'M-TH', lib: 'Taxe d\'habitation des résidences secondaires fondue dans la v7.5 (BT03)', ids: ['BT03'], f: 'cout', l: 0.3, sens: 'po', src: 'base_0611.js HB3' },
  { id: 'M-TITRES', lib: 'Fin des titres-restaurant et assimilés ; conversion en salaire de la mutuelle patronale déjà comptée (BT08, BT09)', ids: ['BT08', 'BT09'], f: 'comportement', l: 0.3, sens: 'po', src: 'base_0611.js HB6, HB8 (PLFSS 2026 annexe 4)' },
  { id: 'M-RESTO', lib: 'TVA de la restauration à 5 % (BT10, BT11)', ids: ['BT10', 'BT11'], f: 'comportement', l: 0.5, sens: 'po', src: 'base_0611.js HB9' },
  { id: 'M-FORM', lib: 'Formation professionnelle : un seul organisme (BT12)', ids: ['BT12'], f: 'cout', l: 0.5, sens: 'dep', src: 'base_0611.js, arbitrage 48' },
  { id: 'M-FANT', lib: 'Fantômes : GEMAPI et taxes spéciales d\'équipement, chambres consulaires (BT13, BT14)', ids: ['BT13', 'BT14'], f: 'cout', l: 0.3, sens: 'po', src: 'base_0611.js HB11-HB12' }
];
GBT.forEach(function (g) {
  var dF = 0, dD = 0, c = 0;
  BT.forEach(function (l) { if (g.ids.indexOf(l.id) < 0) return; var o = fav([l.v[0]], [l.v[2]]); dF += o[0][0] - l.v[1]; dD += o[1][0] - l.v[1]; c += l.v[1]; });
  mod(g.id, g.lib, g.src, 'B-C', g.f, g.l, g.sens, 'const', cst(dF), cst(dD), c);
});
// Interaction BT08 / CS01 : les deux lignes décrivent la même mutuelle. Les bornes de M-TITRES (BT08 favorable = +7,59) et de M-CS (CS01 favorable = 0, central = +3,80) restent indépendantes dans le banc ; voir README.

// ------------------------------------------------------------------------------------------------ 3. Patrimoine v7.5 et ses comportements (BT01) : érosion, exil, rendement, au scénario de la chaîne de la v7.4
var v75 = Bt.v75(), LP = N1D.ligne();   // patrimoine à 1,25 % (DECISIONS1111D) : recette nette RP + fonction aux trois scénarios de comportement et de plafonnement de la grille de patrimoine_balayage_1111c.js
mod('M-PAT', 'Fonction du patrimoine à 1,25 % (taux marginal maximal, K = 700 k€, plafonnement à 75 % du revenu) : comportements (érosion, exil, rendement) et plafonnement (−5 % / −15 % / −30 % de la fonction) au scénario favorable / défavorable',
    'patrimoine_balayage_1111c.js ligne(0,0125) ; decisions_0611_v74.js recettePatrimoine(sc) ; decisions_1111d.js', 'B', 'comportement', 0.8, 'po', 'const', cst(LP.favorable - LP.central), cst(LP.defavorable - LP.central), LP.central);
// Grand ménage (DECISIONS1111C) : net_additionnel année par année, bas = économie prudente (défavorable), haut = favorable ; avant 2028 : 0 ; après 2038 : valeur de 2038 (HG2, HG3)
(function () { var G = this.Decisions1111C, c = [], f = [], d = [];
  AN.forEach(function (y) { var cc = G.grandMenage('central', y); c.push(cc); var h = G.grandMenage('haut', y), l = G.grandMenage('bas', y); f.push(Math.max(0, Math.max(h, l) - cc)); d.push(Math.min(0, Math.min(h, l) - cc)); });   // écarts bornés par le central (en transition 2029-2030, bas et haut sont tous deux sous le central)   // comme les autres modules à profil « serie » : au sein d'une année, le plus favorable des deux scénarios
  mod('M-GM', 'Grand ménage (non-remplacement, gestion, regroupements d\'organismes) : économie nette additionnelle, transition comprise, année par année, scénarios bas / central / haut du modèle du grand ménage',
      'modeles/grand-menage/donnees/serie_2028_2038.json via decisions_1111c.js grandMenage(sc, an)', 'C', 'cout', 0.5, 'dep', 'serie', f, d, c[9]); }).call(this);

// ------------------------------------------------------------------------------------------------ 4. Leviers votés : rendement réel au scénario, niveau voté fixé
var cfgT = { A: R.S.transReco.A, K: R.S.transReco.K, top: true, k: 1, nationalite: 'court' };
var tr3 = T.trois(cfgT).map(function (x) { return x.netActuel; });
mod('M-TRANS', 'Transmissions : abattement de 300 000 €, taux, exil et déclaration au scénario (transmissions_0611.js trois())', 'transmissions_0611.js', 'B', 'comportement', 0.7, 'po', 'ramp', rmp(tr3[0] - tr3[1]), rmp(tr3[2] - tr3[1]), tr3[1]);
var co = D.courbe().o, co2 = E.courbe().o, pen = [0, 1, 2].map(function (k) { return D.recettePension(co2, k).net; });
mod('M-PENS', 'Courbe des pensions relevée à 9 Md€ : fuite sur les pensions 3 / 8 / 15 % (expatriation, cumul emploi-retraite ; retraites2.js)', 'decisions_0811.js courbe() ; decisions_0711.js recettePension(o, k)', 'B', 'comportement', 0.5, 'po', 'ramp', rmp(pen[0] - pen[1]), rmp(pen[2] - pen[1]), pen[1]);
var eco2 = R.S.eco2;
mod('M-ECO', 'Économies de fonctionnement de niveau 2 : 0,9 / 1,9 / 4,9 Md€ (le niveau 1 de 0,4465 est fixe)', 'sources/economies-fonctionnement.md § 1 via retraites_aisees_0611.js S.eco2', 'C', 'cout', 0.5, 'dep', 'ramp', rmp(eco2[2] - eco2[1]), rmp(eco2[0] - eco2[1]), eco2[1]);
// Fonction des revenus et crédit d'IS : le barème (a = 0,6733) est voté ; on recalcule son rendement et celui du crédit aux scénarios
function ecartAt(sc, q) { var o = A.VARIANTES.B.bareme; A.VARIANTES.B.bareme = q; A.variante('B'); try { return A.ecart(sc).total; } finally { A.VARIANTES.B.bareme = o; A.variante('B'); } }
function revSc(sc) { return ecartAt(sc, s.bareme) - ecartAt(sc, Bt.bareme0()); }
var rv = SCN.map(revSc), cr = SCN.map(function (sc) { return T.credit(D.HYP.credit, s.bareme, sc).total; });
var rvF = fav([rv[0]], [rv[2]]), crF = fav([cr[0]], [cr[2]]);
mod('M-REV', 'Fonction des revenus (a = 0,6733) : comportement des actifs, des retraités à capital, de l\'IS et de la retenue (bareme_v71.js bilan(q, sc)) au scénario', 'bareme_v71.js, decisions_0611_v74.js ecart(sc), base_0611.js recetteRevenus', 'B', 'comportement', 0.8, 'po', 'ramp',
    rmp(rvF[0][0] - rv[1]), rmp(rvF[1][0] - rv[1]), s.revenus);
mod('M-CRED', 'Crédit d\'IS à 50 % : rendement au scénario (transmissions_0611.js credit(c, q, sc))', 'transmissions_0611.js credit()', 'B', 'comportement', 0.8, 'po', 'ramp', rmp(crF[0][0] - cr[1]), rmp(crF[1][0] - cr[1]), s.credit);
fixe.push({ id: 'TR03', libelle: 'Impôt de suite « court terme » sur la fonction du patrimoine (2,28 Md€)', raison: 'une seule valeur dans le modèle (R.S.patrimoineNat)', valeur: s.patrimoineNat });

// ------------------------------------------------------------------------------------------------ 5. Leviers de non-remplacement, point d'indice, temps de travail (variante_dette_stable.js, option 'masse'), année par année
function levSc(id) { return AN.map(function (y) { return [Y.leviers([id])('bas', y), Y.leviers([id])('central', y), Y.leviers([id])('haut', y)]; }); }
[['M1f', 'M-M1', 'Non-remplacement d\'un départ sur deux ou fonctionnaires (M1f) : part réalisée 90 / 70 / 45 %', 0.5], ['M2m', 'M-M2', 'Point d\'indice : prix − 0,5 point pendant 4 ans (M2m)', 0.3], ['M3', 'M-M3', 'Temps de travail dans la fonction publique : 27 000 ETP, réalisation 80 / 50 / 25 % (M3)', 0.5]].forEach(function (m) {
  var L = levSc(m[0]), dF = [], dD = [], cc = [];
  L.forEach(function (t, i) {
    var y = AN[i], v = [t[0], t[1], t[2]];
    if (m[0] === 'M3') v = [t[0] - K.recouvrement('M1f', y, 0).m3, t[1] - K.recouvrement('M1f', y, 1).m3, t[2] - K.recouvrement('M1f', y, 2).m3];   // recouvrement de M3 (D23, D18) par scénario k = 0, 1, 2
    dF.push(Math.max(v[0], v[2]) - v[1]); dD.push(Math.min(v[0], v[2]) - v[1]); cc.push(v[1]);
  });
  mod(m[1], m[2], 'variante_dette_stable.js leviers([\'' + m[0] + '\']) ; consolidation_0611.js recouvrement', 'C', 'cout', m[3], 'dep', 'serie', dF, dD, cc[9]);
});

// ------------------------------------------------------------------------------------------------ 6. Effets nets hérités de la v5.8 (H.net) dont le modèle publie un scénario par poste ; résidu de la v5.10
function netSc(f) { return AN.map(function (y) { return [f('bas', y), f('central', y), f('haut', y)]; }); }
function ecartsDe(f) { var L = netSc(f), dF = [], dD = [], cc = []; L.forEach(function (t) { dF.push(Math.max(t[0], t[2]) - t[1]); dD.push(Math.min(t[0], t[2]) - t[1]); cc.push(t[1]); }); return { dF: dF, dD: dD, c: cc }; }
var POSTES = [
  ['M-V6', 'Dispositif retraites (loi de 2023 gardée ; pénibilité, sous-indexation des hautes pensions) : effet net par année au scénario', function (sc, y) { return N1.v6(sc, y); }, 'cout', 0.5, 'dep', 'decisions_1111.js v6(sc, an) (loi de 2023 : pénibilité et indexation au-dessus de 2 000 €, sans âge libre ni indexation sur l\'espérance de vie), modeles/retraites/'],
  ['M-FO', 'Fiscalité d\'orientation (9,59 Md€ au bas de sa fourchette) : réactions des assiettes', function (sc, y) { return G.fo(sc, y); }, 'comportement', 0.8, 'po', 'decisions_0511g.js fo(sc, an), modeles/fiscalite-orientation/'],
  ['M-FIOUL', 'Taxe sur le fioul de chauffage : érosion du parc, au scénario', function (sc, y) { return H.fioulCompte(sc, y); }, 'comportement', 0.5, 'po', 'decisions_0511h.js fioul(sc, an)'],
  ['M-GRAT', 'Gratuité des transports urbains : coût net (recettes perdues, offre, collecte)', function (sc, y) { return -H.tu(sc, y); }, 'cout', 0.3, 'dep', 'decisions_0511h.js gratuite(sc)'],
  ['M-DET', 'Socle suspendu en détention : économie', function (sc, y) { return H.detention(sc, y); }, 'cout', 0.3, 'dep', 'decisions_0511h.js detentionDetail(sc)'],
  ['M-RESID', 'Résidu de la mesure de la v5.10 (bonus d\'activité de 100 €, reprise du socle entre 4 700 et 9 400 €)', function (sc, y) { return y < 2029 ? 0 : J.residu(A.HYP.tRef, sc); }, 'cout', 0.3, 'po', 'decisions_0511j.js residu(t, sc)']
];
POSTES.forEach(function (p) {
  var e = ecartsDe(p[2]);
  if (maxAbs(e.dF) + maxAbs(e.dD) > 1e-9) mod(p[0], p[1], p[6], 'B-C', p[3], p[4], p[5], 'serie', e.dF, e.dD, e.c[9]);
  else fixe.push({ id: p[0], libelle: p[1], raison: 'scénarios identiques dans le modèle' });
});

// ------------------------------------------------------------------------------------------------ 7. Contrôle d'ensemble : écart du solde primaire 2038 aux scénarios d'ensemble du modèle (non utilisé dans le tirage : il mêle des postes remplacés par des couches)
function trajSc(sc) {
  var lc0 = Y.leviers(['M1f', 'M2m', 'M3']), u = K.urssaf().v[1] + s.effetCouche, r = R.S.rampe;
  var lc = function (ss, y) { return lc0(ss, y) - K.recouvrement('M1f', y).total + u; };
  var fn = function (ss, y) { return Bt.S.corrT65 + Bt.totaux().central + lc(ss, y) + ramp(y) * s.F + CO.correction(y) + N1.delta(ss, y); };
  var t = A.trajectoire(sc, 'reference', fn);
  return t.primaire[9] * ST.ECO.pib0;
}
var ens = { bas: trajSc('bas'), central: trajSc('central'), haut: trajSc('haut') };

// ------------------------------------------------------------------------------------------------ 8. Composition du central (pour la répartition entre recettes et dépenses et pour le rapport)
var cmp = { F: s.F, revenus: s.revenus, credit: s.credit, transmissions: s.transmissions, patrimoineNat: s.patrimoineNat, pension: s.pension, eco: s.eco, effetCouche: s.effetCouche, ecartBase: A.ecart('central').total,
            corrT65: Bt.S.corrT65, effetBT: Bt.totaux().central, po_pct: s.po.pct, po_md: s.po.md, a: s.a };
// Fusion : BT08 (mutuelle patronale, favorable +7,59 déjà dans la base) et CS01 (même mutuelle, central +3,80) décrivent un seul fait ; les titres-restaurant (BT09) et le transport (CS02) en sont voisins.
(function () {
  var a = mods.filter(function (m) { return m.id === 'M-CS'; })[0], b = mods.filter(function (m) { return m.id === 'M-TITRES'; })[0];
  if (a && b) {
    b.id = 'M-CONV'; b.libelle = 'Conversions en salaire à coût employeur inchangé : part patronale de la mutuelle (BT08 + CS01), transport (CS02), titres-restaurant et assimilés (BT09)';
    b.source = 'base_0611.js HB6, HB8 (PLFSS 2026 annexe 4) ; decisions_0811.js HE5'; b.d_fav = add(a.d_fav, b.d_fav); b.d_def = add(a.d_def, b.d_def); b.central = a.central + b.central;
    mods.splice(mods.indexOf(a), 1);
  }
  mods = mods.filter(function (m) { if (maxAbs(m.d_fav) + maxAbs(m.d_def) < 1e-9) { fixe.push({ id: m.id, libelle: m.libelle, raison: 'scénarios identiques dans le modèle', valeur: m.central }); return false; } return true; });
})();
print(JSON.stringify({ annees: AN, modules: mods, fixe: fixe, ensemble2038: ens, composition: cmp }));
