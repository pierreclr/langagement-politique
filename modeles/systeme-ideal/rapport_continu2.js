// § 13 de resultats-optimum.txt : « Formes plus convexes pour l'héritage, capital à pente 50 %, architecture v3b » (03/11/2026, H610-H615). Reproduction, depuis ce dossier (sortie ajoutée à la suite du § 12) :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//       patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js \
//       ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js ../risques/stress.js rapport_continu2.js
var Z = this.Optimum, F = this.Voies.fus, CD = this.CD, X = this.CDC, ST = this.Stress;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−'); }
function r0(x) { return Math.round(x).toLocaleString('fr-FR').replace(/[  ,]/g, ' ').replace('-', '−'); }
function s0(x) { var v = Math.round(x); return (v > 0 ? '+' : '') + r0(x); }
function pc(x, d) { var k = d === undefined ? 1 : d, m = Math.pow(10, k); return (Math.round(x * 100 * m) / m).toString().replace('.', ',').replace('-', '−') + ' %'; }
function trip(o) { return r1(o.bas) + ' / ' + r1(o.central) + ' / ' + r1(o.haut); }
var t0 = Date.now(), p = CD.params(), MONTANTS = [20000, 58000, 100000, 300000, 1e6, 1e7];
function lib(m) { return m >= 1e6 ? (m / 1e6) + ' M€' : r0(m) + ' €'; }
var FORMES = ['hyper', 'hyper2', 'hyper3', 'marg2', 'marg3'];
var NOM = { hyper: 'A. taux moyen 50 % × x/(x+K)', hyper2: 'D. taux moyen 50 % × x²/(x²+K²)', hyper3: 'E. taux moyen 50 % × x³/(x³+K³)', marg2: 'D\'. taux marginal 50 % × x²/(x²+K²)', marg3: 'E\'. taux marginal 50 % × x³/(x³+K³)' };
var COURT = { hyper: 'A', hyper2: 'D', hyper3: 'E', marg2: 'D\'', marg3: 'E\'' };
var E0 = 100000, KC = {};
FORMES.forEach(function (f) { KC[f] = X.calibrer(f, E0, p); });

log('## 13. Formes plus convexes pour l\'héritage, capital de départ à pente 50 %, architecture v3b (03/11 ; H610-H615)');
log('Point de départ : au § 12, la forme A (K = 190 000 €) fait payer l\'héritier médian (6 814 € sur 58 000 €) et fait payer **moins** les très gros héritages qu\'avec l\'exemption (−30 000 € à 1 M€, −190 000 € à 10 M€) : défaut politique et contraire au « non confiscatoire pour la classe moyenne ». On teste des formes **plus convexes**, toujours sans seuil : **D** t(x) = 50 % × x²/(x²+K²) et **E** t(x) = 50 % × x³/(x³+K³) (impôt = x·t(x)), puis, parce que D et E violent le plafond de 50 % (voir 13.1), **D\'** et **E\'** (Claude) : on lisse le **taux marginal** m(x) = 50 % × x^n/(x^n+K^n), n = 2 puis 3, et l\'impôt est son intégrale (D\' : 50 % × (x − K·arctan(x/K)) ; E\' : 50 % × K × (u − I₃(u)), u = x/K, I₃ primitive exacte de 1/(1+t³)). Plus n est grand, plus la fonction ressemble à l\'exemption (marginal 0 puis 50 %), sans marche. Même recette que l\'exemption de 100 000 € par construction (K par bissection).');

log('\n### 13.1 K calibré pour la même recette que l\'exemption de 100 000 € ; taux marginal maximal (H610-H611)');
log('| forme | K calibré (€) | taux marginal maximal | atteint à | verdict |'); log('|---|---|---|---|---|');
FORMES.forEach(function (f) { var K = KC[f], m = 0, hx = 0, x; for (x = 1000; x < 1e9; x *= 1.01) { var v = X.marginal(f, K, x); if (v > m) { m = v; hx = x; } }
  var ok = m <= 0.5 + 1e-9;
  log('| ' + NOM[f] + ' | ' + r0(K) + ' | ' + pc(m, 2) + (ok ? ' (jamais atteint)' : '') + ' | ' + (ok ? 'à l\'infini' : r0(hx) + ' € (≈ ' + (Math.round(hx / K * 100) / 100).toString().replace('.', ',') + ' K)') + ' | ' + (ok ? 'retenue au test' : '**écartée** : dépasse le plafond de 50 % (tous impôts confondus)') + ' |'); });
log('Lecture : D (pic à √3·K, 56,25 %) et E (pic de 66,7 % à x = ∛2·K) dépassent 50 % dès qu\'on convexifie le **taux moyen** : un taux moyen qui monte vite entre K/2 et 2K impose un taux marginal supérieur au plafond (preuve pour D : marginal = 50 % × (x⁴+3x²K²)/(x²+K²)², supérieur à 50 % dès que x > K). Impossible à « ajuster » sans coude : on les écarte et on passe aux formes sur le taux marginal, D\' et E\', qui respectent le plafond par construction. Valeurs retenues pour la lecture : D\' K = 87 000 €, E\' K = **94 000 €** (calibré : ' + r0(KC.marg3) + '), au point x = K le taux marginal vaut 25 % (D\' : 25 %, E\' : 25 %).');

log('\n### 13.2 Impôt payé selon le cumul reçu (€ ; taux moyen entre parenthèses ; même recette que l\'exemption de 100 000 €)');
log('| régime | K | ' + MONTANTS.map(lib).join(' | ') + ' |'); log('|---|---|' + MONTANTS.map(function () { return '---'; }).join('|') + '|');
function ligne(nom, K, fn) { log('| ' + nom + ' | ' + K + ' | ' + MONTANTS.map(function (x) { var v = fn(x); return r0(v) + ' (' + pc(v / x, 1) + ')'; }).join(' | ') + ' |'); }
ligne('exemption 100 000 €, 50 % au-dessus', '—', function (x) { return X.impotExemption(x, E0); });
FORMES.forEach(function (f) { ligne('forme ' + NOM[f].split('.')[0] + (f === 'hyper2' || f === 'hyper3' ? ' (écartée)' : ''), r0(KC[f]), function (x) { return X.impot(f, KC[f], x); }); });
log('Écart à l\'exemption (€, impôt de la fonction − impôt de l\'exemption) :');
log('| forme | ' + MONTANTS.map(lib).join(' | ') + ' |'); log('|---|' + MONTANTS.map(function () { return '---'; }).join('|') + '|');
FORMES.forEach(function (f) { log('| ' + NOM[f].split('.')[0] + ' | ' + MONTANTS.map(function (x) { return s0(X.impot(f, KC[f], x) - X.impotExemption(x, E0)); }).join(' | ') + ' |'); });
log('Lecture : **E\' corrige l\'essentiel** : l\'héritier médian (58 000 €) paie 1 520 € (2,6 %) au lieu de 6 814 € avec A ; à 1 M€ l\'écart à l\'exemption est de −6 400 € (A : −30 000 €) ; à 10 M€ de −6 600 € (A : −42 700 €). **Correction du § 12.2** : sa ligne « Lecture » écrit −190 000 € à 10 M€ pour la forme A ; le tableau du même paragraphe donne 4 907 328 € contre 4 950 000 € pour l\'exemption, soit −42 700 € (le −190 000 € est une erreur de lecture, non reportée ici). Reste un défaut, plus petit : **personne ne paie zéro** (20 000 € paient 24 €) et les cumuls au-dessus de ≈ 170 000 € paient un peu moins qu\'avec l\'exemption (−4 400 € à 300 000 €, −6 400 € à 1 M€, soit 1,4 % de l\'impôt de l\'exemption à 1 M€).');

log('\n### 13.3 Qui paie plus, qui paie moins ; exposition à la fuite');
log('| régime | paie plus | paie moins | x* | recette payée par cumuls > 300 000 € | > 1 M€ |'); log('|---|---|---|---|---|---|');
function partRecette(fn, seuil) { var tot = CD.esperance(fn, p), hi = CD.esperance(function (h) { return h > seuil ? fn(h) : 0; }, p); return hi / tot; }
var fe = function (h) { return X.impotExemption(h, E0); };
log('| exemption 100 000 € | — | — | — | ' + pc(partRecette(fe, 3e5), 0) + ' | ' + pc(partRecette(fe, 1e6), 0) + ' |');
FORMES.forEach(function (f) { var K = KC[f], c = X.comparaison(f, K, E0, p), fn = function (h) { return X.impot(f, K, h); };
  log('| forme ' + COURT[f] + ', K = ' + r0(K) + (f === 'hyper2' || f === 'hyper3' ? ' (écartée)' : '') + ' | ' + pc(c.plus, 0) + ' | ' + pc(c.moins, 0) + ' | ' + r0(c.croisement) + ' € | ' + pc(partRecette(fn, 3e5), 0) + ' | ' + pc(partRecette(fn, 1e6), 0) + ' |'); });
log('« Plus » + « moins » + « égal à 1 € près » = 100 %. Le « paie plus » est mécaniquement majoritaire : la fonction n\'exempte personne, donc tous les cumuls inférieurs à 100 000 € paient quelque chose ; la question est de combien (13.2).');
log('Part des héritiers qui paient **plus de 1 000 €** de plus qu\'avec l\'exemption : ' + FORMES.map(function (f) { var K = KC[f]; return COURT[f] + ' ' + pc(CD.esperance(function (h) { return (X.impot(f, K, h) - X.impotExemption(h, E0)) > 1000 ? 1 : 0; }, p), 0); }).join(' ; ') + '. Médiane de l\'impôt payé (héritier à 70 000 €, loi H2) : ' + FORMES.map(function (f) { return COURT[f] + ' ' + r0(X.impot(f, KC[f], 70000)) + ' €'; }).join(' ; ') + ' (exemption : 0).');

log('\n### 13.4 Capital de départ continu à pente initiale 50 % (K = 80 000 €) et taux marginal cumulé capital + impôt (H612-H613)');
log('Capital g(H) = 40 000 € × e^(−H/80 000) : pente initiale 50 % (comme la variante C, mais lisse), coût central ' + r1(X.coutCapital({ forme: 'exp', K: 80000 })[1]) + ' Md€ contre 11,5 pour C (**+' + r1(X.coutCapital({ forme: 'exp', K: 80000 })[1] - CD.montants('C').central) + ' Md€**) ; coût b / c / h : ' + trip({ bas: X.coutCapital({ forme: 'exp', K: 80000 })[0], central: X.coutCapital({ forme: 'exp', K: 80000 })[1], haut: X.coutCapital({ forme: 'exp', K: 80000 })[2] }) + '.');
log('| capital | impôt | taux marginal cumulé max (pente du capital + marginal de l\'impôt) | atteint à H = | objectif ≤ 75 % |'); log('|---|---|---|---|---|');
var CAPS = [['exp K = 47 000 (§ 12 : v3)', { forme: 'exp', K: 47000 }], ['exp K = 80 000', { forme: 'exp', K: 80000 }]];
var IMPS = [['A, K = 190 000', { forme: 'hyper', K: 190000 }], ['E\', K = 94 000', { forme: 'marg3', K: 94000 }], ['D\', K = ' + r0(KC.marg2), { forme: 'marg2', K: KC.marg2 }]];
CAPS.forEach(function (c) { IMPS.forEach(function (i) { var m = X.margCumuleMax(c[1], i[1]); log('| ' + c[0] + ' | ' + i[0] + ' | ' + pc(m.taux, 1) + ' | ' + r0(m.h) + ' € | ' + (m.taux <= 0.75 + 1e-9 ? 'oui' : 'non') + ' |'); }); });
log('Profil du taux marginal cumulé avec K = 80 000 € et E\' (K = 94 000 €) :');
var Hs = [0, 20000, 50000, 80000, 100000, 150000, 200000, 300000, 500000];
log('| héritage reçu H | ' + Hs.map(lib).join(' | ') + ' |'); log('|---|' + Hs.map(function () { return '---'; }).join('|') + '|');
log('| pente du capital | ' + Hs.map(function (h) { return pc(X.TRANSFERTS.exp.pente(h, 80000), 1); }).join(' | ') + ' |');
log('| marginal de l\'impôt E\' | ' + Hs.map(function (h) { return pc(X.marginal('marg3', 94000, h), 1); }).join(' | ') + ' |');
log('| **cumulé** | ' + Hs.map(function (h) { return pc(X.TRANSFERTS.exp.pente(h, 80000) + X.marginal('marg3', 94000, h), 1); }).join(' | ') + ' |');
log('| capital reçu g(H) (€) | ' + Hs.map(function (h) { return r0(X.transfert({ forme: 'exp', K: 80000 }, h)); }).join(' | ') + ' |');
log('Lecture : avec K = 80 000 €, **le taux marginal cumulé maximal est de ' + pc(X.margCumuleMax({ forme: 'exp', K: 80000 }, { forme: 'marg3', K: 94000 }).taux, 1) + '** au premier euro, quelle que soit la forme d\'impôt (A, D\', E\') : objectif ≤ 75 % tenu, et le cumulé reste ≤ 50 % partout (profil ci-dessus). Cause : la pente du capital est maximale (50 %) quand l\'impôt marginal est encore nul, et elle est tombée à 18 % quand l\'impôt marginal atteint 19 % (H = 80 000 €) ; les deux ne se superposent jamais à plein. Avec le K = 47 000 € de la v3, la pente initiale de 85 % donnait 85 % (le § 12 écrivait 86 %, avec K calibré 46 778).');

log('\n### 13.5 Effet sur le solde (v3 avec chaque combinaison)');
var BASE3 = F(Z.ARCHITECTURE_V3, { tPlat: 0.411 });
var VAR = [['v3 : A K = 190 000 + capital exp K = 47 000', { heritageFonction: { forme: 'hyper', K: 190000 }, capitalFonction: { forme: 'exp', K: 47000 } }],
  ['E\' K = 94 000 + capital exp K = 47 000', { heritageFonction: { forme: 'marg3', K: 94000 }, capitalFonction: { forme: 'exp', K: 47000 } }],
  ['D\' K = ' + r0(KC.marg2) + ' + capital exp K = 47 000', { heritageFonction: { forme: 'marg2', K: KC.marg2 }, capitalFonction: { forme: 'exp', K: 47000 } }],
  ['A K = 190 000 + capital exp K = 80 000', { heritageFonction: { forme: 'hyper', K: 190000 }, capitalFonction: { forme: 'exp', K: 80000 } }],
  ['**E\' K = 94 000 + capital exp K = 80 000 (v3b)**', { heritageFonction: { forme: 'marg3', K: 94000 }, capitalFonction: { forme: 'exp', K: 80000 } }]];
log('| combinaison | solde bas / central / haut (Md€) à 41,1 % | taux plat d\'équilibre |'); log('|---|---|---|');
VAR.forEach(function (v) { var a = F(BASE3, v[1]); var te = Z.tauxEquilibre(a); log('| ' + v[0] + ' | ' + trip(Z.soldes(a)) + ' | ' + (te === null ? '> 60 %' : pc(te)) + ' |'); });
log('Lecture : le changement de forme d\'impôt ne coûte rien (même recette) ; tout le coût de la v3b vient du capital à pente 50 % (+3,2 Md€ au central, soit +0,3 point de taux plat).');

log('\n### 13.6 Architecture v3b (03/11 ; H614-H615)');
var V3 = Z.archi(Z.ARCHITECTURE_V3), V3B = Z.archi(Z.ARCHITECTURE_V3B), LP = Z.CAS_PROTEGES_AFFINAGE, e3 = Z.evaluer(V3, LP), eb = Z.evaluer(V3B, LP), teb = Z.tauxEquilibre(V3B);
function nonTenues(e) { return e.contraintes.map(function (c, i) { return c ? '' : '(' + (i + 1) + ')'; }).join(' ').trim() || 'aucune'; }
log('Paramètres : identiques à la v3 (socle ' + V3B.socle + ' €, allocation unique α = 25 %, majoration parent isolé ' + V3B.majParentIsole + ' €, pas de prime d\'activité, taxe à 1 % plafonnée, exil défendable) sauf : héritage **forme E\'** (taux marginal 50 % × x³/(x³+K³), K = **94 000 €**, aucun seuil) ; capital de départ **exp K = 80 000 €** (pente initiale 50 %) ; taux plat **' + pc(V3B.tPlat) + '** (taux d\'équilibre recalculé : ' + pc(teb) + ').');
log('**Solde (Md€/an, bas / central / haut) : ' + trip(eb.soldes) + '** ; contraintes non tenues : ' + nonTenues(eb) + ' ; règles + exceptions : ' + eb.complexite.total + ' ; taux marginal à l\'infini ' + pc(eb.margMax || 0) + '.');
var dd = Z.detail(V3B, 'central');
log('Décomposition au central : options ' + r1(dd.options) + ' ; écart d\'héritage ' + r1(dd.heritage) + ' ; décès plafonné ' + r1(dd.deces) + ' ; conjoint ' + r1(dd.conjoint) + ' ; perte due à la fonction ' + r1(dd.exemptionVie) + ' ; taxe à 1 % ' + r1(dd.taxe) + ' ; correctifs ' + r1(dd.correctifs) + ' ; capital de départ ' + r1(dd.capitalDepart) + ' ; protection ' + r1(dd.protection) + '.');
log('\nCas types (€/mois, écart au droit actuel, central) :');
var CASN = [['smic_seul', 'smicard'], ['couple_1smic_2enf', 'couple avec un Smic'], ['parent_isole_smic', 'parent isolé au Smic'], ['rsa_seul', 'RSA seul'], ['retraite_aspa_loc', 'retraité locataire']];
var VX = [['v3 (A K = 190 000, capital K = 47 000)', V3], ['**v3b (E\' K = 94 000, capital K = 80 000)**', V3B]];
log('| architecture | taux plat | solde b / c / h | ' + CASN.map(function (c) { return c[1]; }).join(' | ') + ' | D1 / D5 / D10 | règles + exc. | non tenues |'); log('|---|---|---|' + CASN.map(function () { return '---'; }).join('|') + '|---|---|---|');
VX.forEach(function (v) { var e = Z.evaluer(v[1], LP); log('| ' + v[0] + ' | ' + pc(v[1].tPlat) + ' | ' + trip(e.soldes) + ' | ' + CASN.map(function (c) { return e.cas[c[0]] ? s0(e.cas[c[0]].ecartMois) : '—'; }).join(' | ') + ' | ' + s0(e.deciles[0].ecart) + ' / ' + s0(e.deciles[4].ecart) + ' / ' + s0(e.deciles[9].ecart) + ' | ' + e.complexite.total + ' | ' + nonTenues(e) + ' |'); });
log('\nDixièmes de niveau de vie, v3b (€/UC/mois, central) : ' + eb.deciles.map(function (d) { return d.decile + ' ' + s0(d.ecart); }).join(' ; ') + '. v3 : ' + e3.deciles.map(function (d) { return d.decile + ' ' + s0(d.ecart); }).join(' ; ') + '.');
log('Cadres (central) : v3b : cadre à 2 Smic ' + s0(eb.cas.cadre_2x.ecartMois) + ', cadre à 4 Smic ' + s0(eb.cas.cadre_4x.ecartMois) + ' ; v3 : ' + s0(e3.cas.cadre_2x.ecartMois) + ' / ' + s0(e3.cas.cadre_4x.ecartMois) + '.');
log('\n### 13.7 Dette à 10 ans (modeles/risques/stress.js, chemin « V3B » ; année 1 = 2029)');
if (ST && ST.ARCHS.V3B) {
  log('| trajectoire | solde an 1 / an 5 / an 10 (Md€) | dette/PIB an 5 / an 10 |'); log('|---|---|---|');
  ['bas', 'central', 'haut'].forEach(function (sc) { var r = ST.test('V3B', sc, {}); log('| sans choc, ' + sc + ' | ' + r1(r.soldeAn1) + ' / ' + r1(r.soldeAn5) + ' / ' + r1(r.soldeAn10) + ' | ' + pc(r.ratio5, 0) + ' / ' + pc(r.ratio10, 0) + ' |'); });
  var r3 = ST.test('V3', 'central', {}), rb = ST.test('V3B', 'central', {});
  log('Comparaison au central sans choc : v3 ' + pc(r3.ratio10, 0) + ', v3b ' + pc(rb.ratio10, 0) + '.');
} else log('stress.js non chargé : dette non recalculée.');
log('\n### 13.8 Lecture, steelman et limites (Claude, révisable ; points non confirmés V8700 à V8702)');
log('1. **D et E (taux moyen convexe) sont écartées** : leur taux marginal dépasse 50 % (56,25 % et 66,7 %). La convexité du taux moyen et le plafond de 50 % sur le taux marginal sont incompatibles : pour garder un taux moyen faible jusqu\'à K puis proche de 50 %, il faut que le marginal soit **supérieur** à 50 % entre les deux. On passe à la convexité du taux **marginal**.');
log('2. **Forme retenue : E\' (n = 3), K = 94 000 €.** Elle donne : héritier médian 1 520 € (A : 6 814 €), cumul de 20 000 € : 24 € ; plafond jamais dépassé ; très gros héritages à 1,4 % (1 M€) et 0,1 % (10 M€) près de l\'exemption. D\' (n = 2) est plus lisible mais fait payer davantage les petits cumuls (3 414 € à 58 000 €) et allège davantage les gros. Au-delà (n = 4, 5, …) on se rapprocherait de l\'exemption, avec pente de plus en plus raide autour de K : n = 3 est un compromis, pas un optimum démontré.');
log('3. **Objection (steelman)** : « E\' est une exemption déguisée : K = 94 000 € est un seuil qui ne dit pas son nom, et la formule est illisible. » Réponse possible : il n\'y a aucune marche (le taux marginal monte de 0 à 50 % de façon continue, 25 % à K), donc pas d\'effet de bord ni d\'optimisation « juste sous le seuil » ; mais la lisibilité est réellement moindre que « 50 % au-dessus de 100 000 € ». Contre-objection de principe de l\'auteur (pas de seuils) : à trancher par lui (V8700).');
log('4. **Capital K = 80 000 €** : la pente initiale redevient 50 % (comme C) et le taux marginal cumulé maximal tombe à ' + pc(X.margCumuleMax({ forme: 'exp', K: 80000 }, { forme: 'marg3', K: 94000 }).taux, 1) + ' avec E\' (objectif ≤ 75 % tenu ; v3 : 85 %). Prix : +3,2 Md€/an au central et +0,3 point de taux plat (41,4 % contre 41,1 %). Défaut persistant : toute fonction lisse a une queue (un héritier de 300 000 € touche encore ≈ 940 €, 82 % de la cohorte touche plus de 1 000 €) : le capital est moins ciblé que la variante C.');
log('5. **La v3b est meilleure que la v3** sur la justice (médian −5 300 €, gros héritages non allégés, marginal cumulé 85 % → ' + pc(X.margCumuleMax({ forme: 'exp', K: 80000 }, { forme: 'marg3', K: 94000 }).taux, 0) + ') ; elle coûte 0,3 point de taux plat (≈ 3 Md€). Prix pour les cas types : smicard +43 (v3 : +48), parent isolé au Smic +4 (+10), D10 −1 126 (−1 095) : c\'est l\'effet des 0,3 point de taux plat, à décider par l\'auteur (V8701 : faut-il payer 3,2 Md€ pour la pente de 50 % ?).');
log('6. **Limites** : (i) fuite supposée identique à tout montant (H604) : E\' concentre la recette sur les gros cumuls (voir 13.3), donc plus exposée que A à l\'exil patrimonial ; (ii) mêmes limites que le § 12.8 (pas d\'effet de substitution des parents, loi log-normale H2) ; (iii) E\' dépend d\'un K calibré sur l\'exemption de 100 000 € : changer d\'exemption de référence change K.');
log('\nTemps de calcul du § 13 : ' + Math.round((Date.now() - t0) / 1000) + ' s.');
