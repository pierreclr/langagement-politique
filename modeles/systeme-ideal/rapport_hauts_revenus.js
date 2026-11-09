// Hauts revenus et échappement fiscal : tableaux de resultats.md § 15. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js hauts_revenus.js rapport_hauts_revenus.js
var H = this.HautsRevenus, P1 = this.Palier1, M = this.SystemeIdeal, O = this.Optimisation, D = M.DONNEES, F = this.Voies.fus;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
function r0(x) { return Math.round(x).toString(); }
function pc(x) { return r1(100 * x) + ' %'; }
function sg(x) { return (x >= 0 ? '+' : '−') + r0(Math.abs(x)); }
var st = P1.palier1().st;
var pente = P1.penteSocle(st);
log('## A. Options (taux plat 35 % fixé ; solde bas / central / haut en Md€ ; recette nette des correctifs au central ; taux plat exact de Δ central = 0 ; socle finançable en plus à taux constant = Δ solde / pente ' + r1(1000 * pente) + ' M€ par €/mois)');
var base = H.soldes(st);
log('plafond retenu ' + pc(H.PLAFOND) + ' ; élasticités D6-D9 ' + ['bas','central','haut'].map(function (s) { return H.ELAST.milieu[s]; }).join(' / ') + ', D10 ' + ['bas','central','haut'].map(function (s) { return H.ELAST.d10[s]; }).join(' / '));
Object.keys(H.OPTIONS).forEach(function (k) {
  var o = H.OPTIONS[k], c = o.c, s = H.soldes(st, undefined, c), pl = H.palier({}, undefined, c);
  var mx = H.marginalMax(st, c);
  log('| ' + o.nom + ' | marginal limite ' + pc(35/100 + 0.30 + (c.t2 || 0)) + ', maximum ' + pc(mx.taux) + ' à ' + r0(mx.R) + ' € | ' + ['bas', 'central', 'haut'].map(function (x) { return r0(s[x]); }).join(' / ') + ' | ' + r1(H.extra(O.configR(st), 'central', c).netMd) + ' | ' + pc(pl.tPlatExact) + ' | Δ vs A : ' + ['bas', 'central', 'haut'].map(function (x) { return sg(s[x] - base[x]); }).join(' / ') +
    ' | socle en plus (€/mois, bas / central / haut) : ' + ['bas', 'central', 'haut'].map(function (x) { return sg((s[x] - base[x]) / pente); }).join(' / ') + ' |');
});
log('\n## B. Profils (€/mois ; écart de revenu disponible en espèces et en % du revenu avant ; central, taux plat 35 %)');
var cles = ['A', 'B', 'B2', 'E73', 'E', 'E70', 'E75', 'G', 'F'];
log('| Profil | avant | ' + cles.map(function (k) { return k; }).join(' | ') + ' |');
var tabs = cles.map(function (k) { return H.profils(st, H.OPTIONS[k].c); });
tabs[0].forEach(function (p, i) {
  log('| ' + p.libelle + ' | ' + r0(p.avantMois) + ' | ' + tabs.map(function (t) { return sg(t[i].ecartMois) + ' (' + sg(100 * t[i].ecartMois / (t[i].avantEcoMois || t[i].avantMois)) + ' %' + (t[i].avantEcoMois ? ' du revenu économique' : '') + ')'; }).join(' | ') + ' |');
});
log('\nrevenu économique du dirigeant (espèces + bénéfices retenus après IS et impôt différé) : ' + cles.map(function (k, j) { var d = tabs[j][5]; return k + ' ' + r0(d.avantEcoMois) + ' → ' + r0(d.apresEcoMois) + ' (' + sg(d.ecartEcoMois) + ')'; }).join(' ; '));
log('taux marginal total maximal (reprise comprise) : ' + cles.map(function (k) { var m = H.marginalMax(st, H.OPTIONS[k].c); return k + ' ' + pc(m.taux); }).join(' ; '));
log('t2 maximal compatible avec le plafond, B2 + C fixés : 75 % ' + r1(100 * H.t2Plafond(st, H.OPTIONS.E73.c, 0.75)) + ' % ; 73 % ' + r1(100 * H.t2Plafond(st, H.OPTIONS.E73.c, 0.73)) + ' % ; 70 % ' + r1(100 * H.t2Plafond(st, H.OPTIONS.E73.c, 0.70)) + ' %');
var tU = H.soldes(st, undefined, F(H.OPTIONS.E73.c, { etiUnique: true }));
log('E73 avec l\'ancienne élasticité unique (0,12 / 0,25 / 0,40) : soldes bas / central / haut ' + ["bas","central","haut"].map(function (x) { return r0(tU[x]); }).join(' / ') + ' ; Δ vs A ' + ["bas","central","haut"].map(function (x) { return sg(tU[x] - base[x]); }).join(' / '));
log('part passive du dirigeant (H133) 0 / 50 / 70 / 100 % : espèces ' + [0, 0.5, 0.7, 1].map(function (q) { return sg(H.profils(st, { differe: false, partPassive: q })[5].ecartMois); }).join(' / '));
log('taux marginal total à 175 k€ (cadre 8 k) / 328 k€ (cadre 15 k) / 808 k€ (dirigeant) : ' + cles.map(function (k, j) { return k + ' ' + [3, 4, 5].map(function (i) { return pc(tabs[j][i].tauxMarginal); }).join(' / '); }).join(' ; '));
var r = H.retraite3500();
log('retraité à 3 500 € nets (palier 1, hautes pensions, inchangé par les correctifs) : ' + (r ? r0(r.avantMois) + ' → ' + r0(r.apresMois) + ' (' + sg(r.ecartMois) + ')' : 'non trouvé'));
log('\n## C. Taux plat retenu et soldes à ce taux, option E73');
var pe = H.palier({}, undefined, H.OPTIONS.E73.c);
log('taux plat exact ' + pc(pe.tPlatExact) + ', retenu ' + pc(pe.tPlat) + ' ; soldes bas / central / haut ' + ['bas', 'central', 'haut'].map(function (x) { return r1(pe.soldes[x]); }).join(' / '));
log('\n## D. Recette nette de E73 par bande (central, Md€/an) et par scénario');
['bas', 'central', 'haut'].forEach(function (sc) { var e = H.extra(O.configR(st), sc, H.OPTIONS.E73.c); log(sc + ' : total ' + r1(e.netMd) + ' ; ' + e.parBande.filter(function (b) { return Math.abs(b.recetteMd) > 0.05; }).map(function (b) { return b.id + ' ' + r1(b.recetteMd); }).join(', ')); });
log('\n## E. Équation à deux coudes : impôt et taux marginal par revenu annuel R par adulte (option E73 ; plat 35 % + continu 30 % R0 = 24 000 + second coude)');
var P = M.param(F(O.configR(st), { scenario: 'central' }));
[24000, 40000, 60000, 80000, 120000, 175200, 300000, 600000, 1000000].forEach(function (R) {
  var tot = M.impot(R, P) + H.impot2(R, H.OPTIONS.E73.c);
  log('| ' + r0(R) + ' | impôt ' + r0(tot) + ' (' + pc(tot / R) + ') | marginal ' + pc(M.marginal(R, P) + H.marg2(R, H.OPTIONS.E73.c)) + ' |');
});

log('\n## F. Frontière sous plafond (garde-fous : aucun des deux cadres ne perd, le cadre à 4 k perd au plus 60 € de plus, médian intact ; objectif : minimiser le plus grand des gains des cadres à 8 k et 15 k)');
var med = H.profils(st, {}).filter(function (p) { return p.id === 'median'; })[0].ecartMois;
log('gain du salarié médian (palier 1, taux plat 35 %) : ' + sg(med) + ' ; gains sans correctif (cadre 8 k / 15 k) : ' + sg(H.profils(st, {})[3].ecartMois) + ' / ' + sg(H.profils(st, {})[4].ecartMois));
[0.70, 0.71, 0.72, 0.73, 0.74, 0.75].forEach(function (pl) {
  var b = H.frontiere(st, pl);
  log('| plafond ' + pc(pl) + ' | R1 ' + r0(b.R1) + ', zone ' + r0(b.ra) + '-' + r0(b.rb) + ', t2 ' + r1(100 * b.t2) + ' % | maximum ' + pc(b.maximumMarginal) + ' | cadre 4 k ' + sg(b.cadre4k) + ' | cadre 8 k ' + sg(b.cadre8k) + ' | cadre 15 k ' + sg(b.cadre15k) + ' | sous le médian : ' + (b.max < med ? 'oui' : 'NON') + ' |');
});
