// § 12 de resultats-optimum.txt : « Fonctions continues pour l'héritage et le capital de départ ; architecture v3 » (03/11/2026, H600-H609). Reproduction, depuis ce dossier (sortie ajoutée à la suite du § 11) :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js ../risques/stress.js rapport_continu.js
var Z = this.Optimum, F = this.Voies.fus, CD = this.CD, X = this.CDC, ST = this.Stress;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r0(x) { return Math.round(x).toLocaleString('fr-FR').replace(/[  ,]/g, ' ').replace('-', '−'); }
function s0(x) { var v = Math.round(x); return (v > 0 ? '+' : '') + r0(x); }
function pc(x, d) { var k = d === undefined ? 1 : d, m = Math.pow(10, k); return (Math.round(x * 100 * m) / m).toString().replace('.', ',').replace('-', '−') + ' %'; }
function trip(o) { return r1(o.bas) + ' / ' + r1(o.central) + ' / ' + r1(o.haut); }
var t0 = Date.now(), p = CD.params(), MONTANTS = [20000, 58000, 100000, 300000, 1e6, 1e7], FORMES = ['hyper', 'exp', 'marg'];
var NOM = { hyper: 'A. taux moyen 50 % × x/(x+K)', exp: 'B. taux moyen 50 % × (1 − e^(−x/K))', marg: 'C. taux marginal 50 % × x/(x+K)' };
function lib(m) { return m >= 1e6 ? (m / 1e6) + ' M€' : r0(m) + ' €'; }

log('## 12. Fonctions continues pour l\'héritage et le capital de départ ; architecture v3 (03/11 ; H600-H609)');
log('Principe de l\'auteur (03/11) : pas de seuils ni de tranches, des fonctions lisses. Ici : (a) l\'exemption de 100 000 € (ou 50 000 €) de l\'héritage « reçu à vie » est remplacée par un impôt qui est une fonction continue du cumul reçu x (donations + héritages) ; (b) le capital de départ C (« 40 000 € moins 50 % de l\'héritage », coude à 80 000 €) devient une fonction lisse de l\'héritage reçu ; (c) architecture v3 = v2 + allocation unique α = 25 % + socle 350 € + ces deux fonctions. Même loi des héritages reçus à vie que le chantier 4 (log-normale, médiane 70 000 €, P90 500 000 €, H2 ; l\'héritier « médian » de la demande, 58 000 €, est donné pour lire les tableaux). Ordres de grandeur sous hypothèses.');
log('Trois formes d\'impôt, une seule règle à retenir : plafond 50 % au loin, un paramètre K. **A** : taux moyen t(x) = 50 % × x/(x+K), impôt = x·t(x), taux marginal croissant de 0 vers 50 % (jamais au-dessus). **B** : t(x) = 50 % × (1 − e^(−x/K)). **C** (ajoutée par Claude) : on lisse le taux marginal, non le taux moyen, impôt = 50 % × (x − K·ln(1 + x/K)) : c\'est l\'analogue direct de l\'exemption (taux marginal 0 puis 50 %), sans marche.');

log('\n### 12.1 K calibré pour la même recette que l\'exemption (H600-H601)');
log('Recette = flux 300 Md€ × part conservée × 50 % × (1 − fuite). Part conservée : exemption 100 000 € = ' + pc(X.partExemption(100000), 2) + ' ; 50 000 € = ' + pc(X.partExemption(50000), 2) + ' (H548 : 70,5 / 97,5 et 1 − 16,5 / 97,5, retrouvés à 0,03 point près). K se calcule par bissection ; K « retenu » = arrondi lisible (écart de recette ≤ 1 %).');
log('| forme | même recette que… | K calibré (€) | taux marginal maximal | taux moyen à K |');
log('|---|---|---|---|---|');
var KC = {};
[100000, 50000].forEach(function (E) { FORMES.forEach(function (f) {
  var K = X.calibrer(f, E); KC[f + E] = K; log('| ' + NOM[f] + ' | exemption ' + r0(E) + ' € | ' + r0(K) + ' | ' + pc(X.margMax(f, K)) + (f === 'exp' ? ' (à x = 2K : dépasse le plafond de 50 %)' : f === 'marg' ? ' (jamais atteint)' : ' (jamais atteint)') + ' | ' + pc(X.impot(f, K, K) / K) + ' |'); }); });
var KR = { hyper100000: 190000, hyper50000: 81000 };
log('Valeurs retenues pour la lecture : forme A, K = **190 000 €** (≈ exemption de 100 000 €) ou **81 000 €** (≈ exemption de 50 000 €) ; au point x = K, le taux moyen est de 25 % et le taux marginal de 37,5 %.');

log('\n### 12.2 Impôt payé selon le cumul reçu (€ ; taux moyen entre parenthèses)');
log('| régime | K | ' + MONTANTS.map(lib).join(' | ') + ' |');
log('|---|---|' + MONTANTS.map(function () { return '---'; }).join('|') + '|');
function ligneImpot(nom, K, fn) { log('| ' + nom + ' | ' + K + ' | ' + MONTANTS.map(function (x) { var v = fn(x); return r0(v) + ' (' + pc(v / x, 1) + ')'; }).join(' | ') + ' |'); }
[100000, 50000].forEach(function (E) {
  ligneImpot('exemption ' + r0(E) + ' €, 50 % au-dessus', '—', function (x) { return X.impotExemption(x, E); });
  FORMES.forEach(function (f) { var K = KC[f + E]; ligneImpot('forme ' + NOM[f].charAt(0) + ' (recette de l\'exemption ' + r0(E) + ' €)', r0(K), function (x) { return X.impot(f, K, x); }); });
});
log('Lecture : à recette égale, le lissage fait payer **un peu à presque tous** (le cumul de 20 000 € paie quelques centaines d\'euros au lieu de zéro) et **allège les plus gros** (à 1 M€ : −30 000 € ; à 10 M€ : −190 000 € pour la forme A à 190 000 €). La fonction ne crée aucune marche, mais elle déplace une partie de la charge du haut vers le milieu : c\'est le prix du principe (voir 12.3).');

log('\n### 12.3 Qui paie plus, qui paie moins ; exposition à la fuite');
log('Parts de la cohorte (loi H2) ; « paie plus » = impôt de la fonction supérieur de plus d\'un euro à celui de l\'exemption. x* = cumul au-dessus duquel la fonction taxe moins que l\'exemption. « Recette payée par les cumuls > 1 M€ » (avant fuite) : plus cette part est haute, plus la recette dépend de la fuite des gros patrimoines (18 / 33 / 52 %, H17-H178).');
log('| régime | paie plus | paie moins | x* | recette payée par cumuls > 300 000 € | > 1 M€ |');
log('|---|---|---|---|---|---|');
function partRecette(fn, seuil) { var tot = CD.esperance(fn, p), hi = CD.esperance(function (h) { return h > seuil ? fn(h) : 0; }, p); return hi / tot; }
[100000, 50000].forEach(function (E) {
  var fe = function (h) { return X.impotExemption(h, E); };
  log('| exemption ' + r0(E) + ' € | — | — | — | ' + pc(partRecette(fe, 3e5), 0) + ' | ' + pc(partRecette(fe, 1e6), 0) + ' |');
  FORMES.forEach(function (f) { var K = KC[f + E], c = X.comparaison(f, K, E, p), fn = function (h) { return X.impot(f, K, h); };
    log('| forme ' + NOM[f].charAt(0) + ', K = ' + r0(K) + ' (≈ ' + r0(E) + ' €) | ' + pc(c.plus, 0) + ' | ' + pc(c.moins, 0) + ' | ' + r0(c.croisement) + ' € | ' + pc(partRecette(fn, 3e5), 0) + ' | ' + pc(partRecette(fn, 1e6), 0) + ' |'); });
});
log('« Plus » et « moins » somment à 100 % (loi H2, tous les cumuls sont strictement positifs).');

log('\n### 12.4 Recette selon la fuite, et effet sur le solde et sur le taux plat d\'équilibre');
log('Recette annuelle de l\'impôt « reçu à vie » (Md€, flux 300 Md€ × part conservée × 50 % × (1 − fuite)), fuite défendable 18 / 33 / 52 % : identique par construction pour la fonction et son exemption (la fuite est la même pour tous les montants dans le modèle : limite, voir 12.8).');
log('| régime | recette fuite 18 % | 33 % | 52 % |'); log('|---|---|---|---|');
[100000, 50000].forEach(function (E) {
  log('| exemption ' + r0(E) + ' € | ' + [0.18, 0.33, 0.52].map(function (f) { return r1(CD.recette(p, E, 0.5, f)); }).join(' | ') + ' |');
  FORMES.forEach(function (f) { log('| forme ' + NOM[f].charAt(0) + ', K = ' + r0(KC[f + E]) + ' | ' + [0.18, 0.33, 0.52].map(function (u) { return r1(X.recette(f, KC[f + E], u, p)); }).join(' | ') + ' |'); });
});
var BASE3 = F(Z.ARCHITECTURE_V3, { tPlat: 0.411 });
function var3(h) { return F(BASE3, h); }
var VAR = [
  ['exemption 100 000 € (v2)', { exemptionVie: 100000, heritageFonction: null }],
  ['forme A, K = 188 845 (recette de 100 000 €)', { exemptionVie: 0, heritageFonction: { forme: 'hyper', K: KC.hyper100000 } }],
  ['forme A, K = 190 000 (retenue)', { exemptionVie: 0, heritageFonction: { forme: 'hyper', K: 190000 } }],
  ['forme B, K = ' + r0(KC.exp100000), { exemptionVie: 0, heritageFonction: { forme: 'exp', K: KC.exp100000 } }],
  ['forme C, K = ' + r0(KC.marg100000), { exemptionVie: 0, heritageFonction: { forme: 'marg', K: KC.marg100000 } }],
  ['exemption 50 000 €', { exemptionVie: 50000, heritageFonction: null }],
  ['forme A, K = ' + r0(KC.hyper50000) + ' (recette de 50 000 €)', { exemptionVie: 0, heritageFonction: { forme: 'hyper', K: KC.hyper50000 } }],
  ['forme B, K = ' + r0(KC.exp50000), { exemptionVie: 0, heritageFonction: { forme: 'exp', K: KC.exp50000 } }],
  ['forme C, K = ' + r0(KC.marg50000), { exemptionVie: 0, heritageFonction: { forme: 'marg', K: KC.marg50000 } }]
];
log('\nSolde et taux plat d\'équilibre (autres paramètres de la v3 : allocation α 25 %, majoration 340 €, socle 350 €, capital continu du 12.5 ; exil défendable ; taux plat de la ligne 41,1 % pour les soldes) :');
log('| héritage | solde bas / central / haut (Md€) | Δ central vs exemption 100 000 € | taux plat d\'équilibre | écart d\'héritage (central, Md€) |');
log('|---|---|---|---|---|');
var ref = null;
VAR.forEach(function (v) { var a = var3(v[1]), s = Z.soldes(a), te = Z.tauxEquilibre(a), d = Z.detail(a, 'central'); if (ref === null) ref = s.central;
  log('| ' + v[0] + ' | ' + trip(s) + ' | ' + (r1(s.central - ref)) + ' | ' + (te === null ? '> 60 %' : pc(te)) + ' | ' + r1(d.exemptionVie) + ' |'); });
log('Lecture : à recette égale, le solde bouge de moins de 0,1 Md€ (la fonction et son exemption ont la même part conservée ; l\'écart vient de l\'arrondi de K et de la quadrature). Le taux plat d\'équilibre ne change pas : le choix de la forme est affaire de justice et de lisibilité, non de budget.');

log('\n### 12.5 Capital de départ rendu continu (H606-H608)');
log('Variante C du chantier 4 : transfert = max(0, 40 000 € − 50 % × héritage reçu), coude à 80 000 €, taux marginal implicite constant de 50 %. Remplacée par g(H) lisse : **exp** g = 40 000 × e^(−H/K) ; **hyper** g = 40 000 × K/(K+H) ; **gauss** g = 40 000 × e^(−(H/K)²). K calibré pour le même coût central que C (11,53 Md€). Pente = taux marginal implicite : un euro de plus d\'héritage retire « pente » euro de capital.');
var Hs = [0, 20000, 58000, 100000, 300000, 1e6];
var CAPS = [['C actuelle (coude à 80 000 €)', null]]; ['exp', 'hyper', 'gauss'].forEach(function (f) { CAPS.push(['g ' + f + ', même coût (K = ' + r0(X.calibrerCapital(f)) + ')', { forme: f, K: X.calibrerCapital(f) }]); });
CAPS.push(['g exp, K = 60 000 (pente initiale 67 %)', { forme: 'exp', K: 60000 }]); CAPS.push(['g exp, K = 80 000 (pente initiale 50 %, comme C)', { forme: 'exp', K: 80000 }]);
var htax = { forme: 'hyper', K: 190000 };
log('| capital | ' + Hs.map(function (h) { return 'à H = ' + lib(h); }).join(' | ') + ' | coût b / c / h (Md€) | pente maximale | reçoit plus de 1 000 € | marginal cumulé max avec l\'impôt A |');
log('|---|' + Hs.map(function () { return '---'; }).join('|') + '|---|---|---|---|');
CAPS.forEach(function (c) { var cf = c[1], g = cf ? function (h) { return X.transfert(cf, h); } : CD.VARIANTES.C.transfert, cout = cf ? X.coutCapital(cf) : CD.montants('C'), pm;
  var cm = cf ? null : { pente: 0.5, h: 0 };
  if (cf) { pm = X.penteMax(cf); } else { pm = cm; }
  var cum = cf ? X.margCumuleMax(cf, htax).taux : (function () { var m = 0, h; for (h = 0; h < 3e6; h += 100) { var d = h < 80000 ? 0.5 : 0; m = Math.max(m, d + X.marginal('hyper', 190000, h)); } return m; })();
  log('| ' + c[0] + ' | ' + Hs.map(function (h) { return r0(g(h)); }).join(' | ') + ' | ' + (cf ? trip({ bas: cout[0], central: cout[1], haut: cout[2] }) : trip({ bas: cout.favorable, central: cout.central, haut: cout.defavorable })) + ' | ' + pc(pm.pente, 0) + (cf && pm.h > 0 ? ' (à ' + r0(pm.h) + ' €)' : '') + ' | ' + pc(CD.esperance(function (h) { return g(h) > 1000 ? 1 : 0; }, CD.params({ p0: 0.1 })), 0) + ' | ' + pc(cum, 0) + ' |'); });
log('Lecture : **à coût égal, le lissage creuse la pente** : la variante C est la plus économe (50 % de pente constante jusqu\'à 80 000 € puis zéro) ; toute fonction lisse a une queue (les gros héritiers reçoivent encore quelque chose) ou une pente plus forte au début. Avec la forme hyper à coût égal, la pente initiale dépasse 100 % : H + g(H) diminue quand H augmente, ce qui est inacceptable (celui qui reçoit 1 € de plus de ses parents recevrait 1,77 € de moins de l\'État). La forme **exp** à K = 47 000 € a une pente initiale de 85 % (< 100 %) et un coût égal : retenue pour la v3, ⚠️ V8602 ; la forme gauss concentre la chute vers 30 000 € (pente 78 %). **Pour garder la pente de C (50 %), il faut K = 80 000 € : +3,2 Md€/an (taux plat d\'équilibre 41,4 % au lieu de 41,1 %) ; K = 60 000 € (pente 67 %) coûte +1,4 Md€ (41,2 %)**. C\'est le vrai arbitrage de l\'auteur : un capital sans coude coûte soit une pente plus raide aux petits héritages, soit environ 3 Md€.');
log('Effet sur le solde et le taux d\'équilibre (v3, impôt A K = 190 000) :');
log('| capital | solde bas / central / haut | taux plat d\'équilibre |'); log('|---|---|---|');
CAPS.forEach(function (c) { var a = var3({ capitalFonction: c[1] }), te = Z.tauxEquilibre(a); log('| ' + c[0] + ' | ' + trip(Z.soldes(a)) + ' | ' + (te === null ? '> 60 %' : pc(te)) + ' |'); });

log('\n### 12.6 Architecture v3 (03/11 ; H609)');
var V3 = Z.archi(Z.ARCHITECTURE_V3), LP = Z.CAS_PROTEGES_AFFINAGE, e3 = Z.evaluer(V3, LP), te3 = Z.tauxEquilibre(V3);
function nonTenues(e) { return e.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() || 'aucune'; }
log('Paramètres : taux plat **' + pc(V3.tPlat) + '** (taux d\'équilibre recalculé : ' + pc(te3) + ') ; socle **' + V3.socle + ' €** (« 877 € garantis, dont 350 € versés à tous ») ; allocation unique dégressive (complément = plancher − socle − α × revenu d\'activité net), **α = ' + pc(V3.alphaPlancher, 0) + '**, majoration parent isolé **' + V3.majParentIsole + ' €**, **pas de prime d\'activité** ; héritage « reçu à vie » : impôt = 50 % × x²/(x+K), **K = ' + r0(V3.heritageFonction.K) + ' €**, plafond de 50 % tous impôts confondus, conjoint exonéré, **aucune exemption ni tranche** ; capital de départ g(H) = 40 000 € × e^(−H/K), **K = ' + r0(V3.capitalFonction.K) + ' €** ; taxe à 1 % plafonnée à 5 % du revenu sous la médiane (non-cotés taxés à la vente) ; fuite des transmissions 18 / 33 / 52 % et érosion du top 1 % 20 / 35 / 55 % ; fin du report 150-0 B ter, e2 + CIR supprimé, économies A, niches de TVA supprimées (inchangés de la v2).');
log('**Solde (Md€/an, bas / central / haut) : ' + trip(e3.soldes) + '** (4,9 % du PIB au haut) ; contraintes non tenues : ' + nonTenues(e3) + ' ; règles + exceptions : ' + e3.complexite.total + ' (v2 : 16) ; taux marginal à l\'infini ' + pc(e3.margMax, 1) + '.');
var dd = Z.detail(V3, 'central');
log('Décomposition au central : options ' + r1(dd.options) + ' ; écart d\'héritage ' + r1(dd.heritage) + ' ; décès plafonné ' + r1(dd.deces) + ' ; conjoint ' + r1(dd.conjoint) + ' ; perte due à la fonction (au lieu de 50 % dès le 1er euro) ' + r1(dd.exemptionVie) + ' ; taxe à 1 % ' + r1(dd.taxe) + ' ; correctifs ' + r1(dd.correctifs) + ' ; capital de départ ' + r1(dd.capitalDepart) + ' ; protection ' + r1(dd.protection) + ' = ' + r1(dd.total) + '.');
log('\nCas types (€/mois, écart au droit actuel, central) :');
var CASN = [['smic_seul', 'smicard'], ['couple_1smic_2enf', 'couple avec un Smic'], ['parent_isole_smic', 'parent isolé au Smic'], ['rsa_seul', 'RSA seul'], ['retraite_aspa_loc', 'retraité locataire']];
var VX = [['v2 (prime d\'activité, exemption 100 000 €)', Z.archi(Z.ARCHITECTURE_V2)], ['§ 11 : allocation α 25 %, majoration 340 €, exemption 100 000 €, capital C', Z.archi(F(Z.allocationUnique(0.25), { majParentIsole: 340, tPlat: 0.411 }))], ['**v3**', V3]];
log('| architecture | taux plat | solde b / c / h | ' + CASN.map(function (c) { return c[1]; }).join(' | ') + ' | D1 / D5 / D10 | règles + exc. | non tenues |'); log('|---|---|---|' + CASN.map(function () { return '---'; }).join('|') + '|---|---|---|');
var cache = {};
VX.forEach(function (v) { var e = Z.evaluer(v[1], LP); cache[v[0]] = e; log('| ' + v[0] + ' | ' + pc(v[1].tPlat) + ' | ' + trip(e.soldes) + ' | ' + CASN.map(function (c) { return e.cas[c[0]] ? s0(e.cas[c[0]].ecartMois) : '—'; }).join(' | ') + ' | ' + [0, 4, 9].map(function (i) { return s0(e.deciles[i].ecart); }).join(' / ') + ' | ' + e.complexite.total + ' | ' + nonTenues(e) + ' |'); });
log('\nDixièmes de niveau de vie, v3 (€/UC/mois, central) : ' + e3.deciles.map(function (d) { return d.decile + ' ' + s0(d.ecart); }).join(' ; ') + '.');
log('Cadres (central) : cadre à 2 Smic ' + s0(e3.cas.cadre_2x.ecartMois) + ', cadre à 4 Smic ' + s0(e3.cas.cadre_4x.ecartMois) + ' ; v2 : ' + s0(cache[VX[0][0]].cas.cadre_2x.ecartMois) + ' / ' + s0(cache[VX[0][0]].cas.cadre_4x.ecartMois) + '.');
log('Incitation au travail (personne seule ; TME / TP) : ' + [0.25, 0.5, 1].map(function (x) { var k = Z.courbeTME(V3, 'seul', [x])[0]; return String(x).replace('.', ',') + ' Smic ' + pc(k.tme, 0) + ' / ' + pc(k.tp, 0); }).join(' ; ') + ' ; TME maximal des trois ménages ' + pc(Z.tmeMax3(V3), 0) + '.');
log('\n### 12.7 Dette à 10 ans (modeles/risques/stress.js, chemin « V3 » ; année 1 = 2029)');
if (ST && ST.ARCHS.V3) {
  log('| trajectoire | solde an 1 / an 5 / an 10 (Md€) | dette/PIB an 5 / an 10 |'); log('|---|---|---|');
  ['bas', 'central', 'haut'].forEach(function (sc) { var r = ST.test('V3', sc, {}); log('| sans choc, ' + sc + ' | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5, 0) + ' / ' + pc(r.ratio10, 0) + ' |'); });
  [['IA à zéro (ligne E)', { sansE: true }], ['récession type 2009', { recession: true }], ['taux +100 pb', { taux: 100 }], ['krach immobilier −20 %', { krachImmo: -0.2 }], ['exil au haut de la fourchette', { exilHaut: true }]].forEach(function (c) {
    var r = ST.test('V3', 'central', c[1]); log('| ' + c[0] + ', central | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5, 0) + ' / ' + pc(r.ratio10, 0) + ' |'); });
  var r2 = ST.test('V2', 'central', {}), r3 = ST.test('V3', 'central', {});
  log('Comparaison au central sans choc : v2 ' + pc(r2.ratio10, 0) + ', v3 ' + pc(r3.ratio10, 0) + '. Détail : modeles/risques/resultats-brut.txt (section « Architecture v3 »).');
} else log('stress.js non chargé : voir modeles/risques/resultats-brut.txt (section « Architecture v3 »).');
log('\n### 12.8 Lecture, steelman et limites (Claude, révisable ; points non confirmés V8600 à V8604)');
log('1. **Le lissage est budgétairement neutre, pas socialement neutre.** À recette égale, aucune forme ne change le solde (écart < 0,1 Md€) ni le taux plat d\'équilibre (41,1 %). Mais la charge se déplace : avec la forme A à K = 190 000 €, **76 % des héritiers paient plus qu\'avec l\'exemption de 100 000 €** (l\'héritier médian de 58 000 € paie 6 800 € au lieu de 0 ; 100 000 € : 17 300 €) et **23 % paient moins** (au-dessus de 213 000 € ; −30 000 € à 1 M€, −190 000 € à 10 M€ soit −4 %). C\'est le prix du principe « pas de seuil » : pour qu\'il n\'y ait pas de marche, il faut que le taux marginal soit positif dès le premier euro, donc que le milieu paie.');
log('2. **Objection (steelman)** : « votre fonction taxe la petite succession de la famille modeste pour alléger le milliardaire ; l\'exemption, elle, protège le premier héritage. » Réponse possible : le taux moyen à 20 000 € est de 4,8 % (958 €), à 58 000 € de 11,7 %, et le plafond de 50 % est le même ; mais l\'objection est juste sur le sens de la redistribution (le haut gagne 4 % de son impôt). **Option si l\'auteur veut éviter cela : la forme C** (lisser le taux marginal) se rapproche le plus de l\'exemption (le cumul de 20 000 € paie 1 300 € à K = 64 000 €, 79 % paient plus, x* = 241 000 €), mais déplace encore plus de charge vers le milieu à recette égale ; ou un K plus petit avec une recette plus haute (K = 81 000 € ≈ exemption de 50 000 € : +8,9 Md€ au central, taux d\'équilibre 40,3 %).');
log('3. **Forme à retenir : A** (K = 190 000 €). Le taux marginal monte de 0 vers 50 % sans jamais dépasser le plafond ; un seul paramètre qui se lit : « à K euros reçus, on paie 25 % en moyenne ». **La forme B est écartée** : son taux marginal atteint 56,8 % à x = 2K (780 000 € pour K = 390 000 €), au-dessus du plafond de 50 % « tous impôts confondus » : une fonction à taux moyen concave n\'est pas toujours compatible avec un plafond marginal ; A et C le sont. La forme C est la plus proche de l\'exemption mais exige K = 64 000 € et déplace plus de charge vers le milieu (79 % paient plus).');
log('4. **Capital de départ** : rendu continu à **coût égal**, il a une pente initiale de 86 % (forme exp, K = 47 000 €) au lieu de 50 % : un jeune dont les parents lui donnent 10 000 € de plus reçoit 8 600 € de moins du capital de départ. La forme hyper est rejetée (pente de 177 % : H + g(H) décroît). Pour garder 50 % de pente, il faut K = 80 000 € : +3,2 Md€/an (+0,3 point de taux plat). **Le taux marginal cumulé maximal (capital + impôt) passe de 50 % (C + exemption) à 75 % (C + forme A) et 86 % (v3)** : jamais au-dessus de 100 %, mais ⚠️ V8603 : c\'est une hausse du taux marginal implicite que le principe « fonctions lisses » produit à coût égal, et que la v2 n\'avait pas. Décision de l\'auteur : même coût et pente de 86 %, ou K = 60 000 € (67 %, +1,4 Md€) ou 80 000 € (50 %, +3,2 Md€).');
log('5. **Architecture v3** : taux plat **41,1 %** (équilibre central, comme le § 11), socle 350 €, allocation α = 25 % et majoration 340 €, héritage forme A K = 190 000 €, capital exp K = 47 000 €. Solde **' + trip(e3.soldes) + '**, dette à 10 ans **' + pc(ST.test('V3', 'bas', {}).ratio10, 0) + ' / ' + pc(ST.test('V3', 'central', {}).ratio10, 0) + ' / ' + pc(ST.test('V3', 'haut', {}).ratio10, 0) + '** du PIB (v2 : 57 / 99 / 151 %), cas types identiques au § 11 (smicard +48, couple avec un Smic +39, parent isolé +10, retraité locataire 0, RSA −13), D1 +41 et D10 −1 095. 15 règles et exceptions. **Il ne reste aucun seuil** ni dans l\'héritage ni dans le capital ; les falaises restantes sont ailleurs (nuance de l\'auteur du 03/11 : 30e année des plus-values, seuil de 50 salariés, seuil de patrimoine des APL, sortie du RSA) et dans la condition de revenu du plafonnement de la taxe à 1 % (5 % du revenu sous la médiane) : non traitées ici.');
log('6. **Limites** : (i) la fuite est supposée identique pour tous les montants (H17-H178) : la fonction fait payer plus de monde sur de petits montants, plus difficiles à déplacer, donc elle devrait fuir un peu moins que l\'exemption, mais la recette des cumuls supérieurs à 1 M€ reste de 53 à 57 % du total ⚠️ V8601 ; (ii) la loi des héritages (log-normale, médiane 70 000 €, P90 500 000 €, H2) est calée sur des données de la CAE de 2021, la queue (ce qui fixe la différence entre A, B et C) est la partie la moins bien connue ⚠️ V8600 ; (iii) l\'interaction avec le plafond « tous impôts confondus » (imputation de l\'impôt sur le gain latent au décès) est traitée comme pour l\'exemption : seule la part conservée change (H602) ; (iv) le coût du capital ne tient pas compte d\'un effet de substitution (les parents qui donnent moins parce que l\'État compense : H607) ; (v) K est un paramètre que personne ne devine : « à 190 000 € reçus, 25 % en moyenne » doit être expliqué dans la liseuse (niveau « essentiel » : une courbe).');
log('\nTemps de calcul du § 12 : ' + Math.round((Date.now() - t0) / 1000) + ' s.');
