// Rapport de la couche DECISIONS1111C : grand ménage branché + balayage du taux du patrimoine, 11/11/2026. Charger la liste de ponts.py, patrimoine_balayage_1111c.js, decisions_1111c.js et ce fichier ; sortie dans resultats_decisions_1111c.txt.
var C = this.Decisions1111C, P = this.PatrimoineBalayage1111C, log = (typeof print === 'function') ? print : console.log;
function f(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n === undefined ? 1 : n).replace('.', ','); }
function pc(x, n) { return f(100 * x, n === undefined ? 2 : n) + ' %'; }
log('# Couche DECISIONS1111C (11/11/2026) : A. grand ménage branché tel quel ; B. balayage du taux marginal maximal du patrimoine');
log('## A. Déficit et dette de notre système, avec et sans grand ménage (leviers F de DECISIONS1111B inchangés)');
['central', 'bas', 'haut'].forEach(function (g) { var r = C.s3(undefined, { grandMenage: g }); log(g + ' : ' + [2032, 2038].map(function (y) { var d = C.deficit(r, y), e = C.dette(r, y); return y + ' déficit ' + pc(d.sans, 3) + ' → ' + pc(d.avec, 3) + ' ; dette ' + pc(e.sans) + ' → ' + pc(e.avec); }).join(' | ') + ' | passage durable sous 3 % : ' + C.sous3(r) + ' (sans : ' + C.B.sous3(r.sans) + ')'); });
log('## B. Balayage (RP à 0,25 % jusqu\'à 1 M€, K = 700 k€, plafonnement 75 % du revenu = −15 % de la fonction) : Md€/an en croisière');
log('t∞ | M/J/E | RP | fonction dû statique | nette favorable / centrale / défavorable | retenue grille (central) | départs/an : modèle f/c/d | méthode ISF (central) | ménages ≥ 2 M€ ; ≥ 5 M€');
P.balayage().concat([P.ligne(0.03)]).forEach(function (l) { var s = l.sc; log(pc(l.t) + ' | ' + l.score.M + '/' + l.score.J + '/' + l.score.E + ' | ' + f(l.rpNette) + ' | ' + f(l.fonctionStatique) + ' | ' + f(s.favorable.nette) + ' / ' + f(s.central.nette) + ' / ' + f(s.defavorable.nette) + ' | ' + f(s.central.retenu.central) + ' | ' + Math.round(s.favorable.departsModele) + ' / ' + Math.round(s.central.departsModele) + ' / ' + Math.round(s.defavorable.departsModele) + ' | ' + Math.round(s.central.departsISF) + ' | ' + Math.round(l.menagesPlus2M / 1e3) + ' k ; ' + Math.round(l.menagesPlus5M / 1e3) + ' k'); });
var rf = P.reference(); log('référence v7.5 recommandée (3 %, K = 400 k€, sans plafonnement) : nette ' + f(rf.nette) + ' ; départs : modèle ' + Math.round(rf.departsModele) + ', méthode ISF ' + Math.round(rf.departsISF));
var r1 = P.recommander(), r2 = P.recommander({ departsMax: 1e9 }), r3 = P.recommander({ departsMax: 950 });
log('recommandation (départs ≤ 950/an selon la plus pessimiste des deux méthodes) : ' + pc(r1.best.t) + ' ; retenu ' + f(r1.best.retenu) + ' ; départs max ' + Math.round(r1.best.departsMax));
log('sans contrainte de départs : ' + pc(r2.best.t) + ' ; retenu ' + f(r2.best.retenu) + ' ; départs max ' + Math.round(r2.best.departsMax));
var best = null; r2.tous.forEach(function (x) { if (x.s === 3 && x.t <= 0.015 + 1e-9 && (best === null || x.retenu > best.retenu)) best = x; });
log('EXPORT ' + JSON.stringify({ recommande: r1.best.t, sansContrainte: r2.best.t, ecart125: P.ecart(0.0125), ecart150: P.ecart(0.015) }));
