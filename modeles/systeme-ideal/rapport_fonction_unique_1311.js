// Tableaux de fonction-unique-1311.md (fonction_unique_1311.js). Charger la liste de test_fonction_unique_1311.js puis ce fichier (jsc, depuis modeles/systeme-ideal).
var U = this.FonctionUnique1311, log = (typeof print === 'function') ? print : console.log;
function e(x, d) { var s = x.toFixed(d === undefined ? 0 : d).split('.'); s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return s.join(',').replace(/^-/, '−'); }
function sg(x) { var r = Math.round(x); return (r > 0 ? '+' : '') + e(r); }
function pc(x) { return e(100 * x, 1) + ' %'; }
log('## Tableau 1 : personne seule (R = coût employeur mensuel ; taux sur l\'euro suivant ; revenu disponible en €/mois)\n');
log('| R | taux actuel (loc.) | taux unique (loc.) | dispo actuel (loc.) | dispo unique (loc.) | écart (loc.) | taux actuel (sans loyer) | taux unique (sans loyer) | écart (sans loyer) |');
log('|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
U.tableau().forEach(function (l) { log('| ' + [e(l.R), pc(l.tAncLoc), pc(l.tNouvLoc), e(l.dAncLoc), e(l.dNouvLoc), sg(l.ecartLoc), pc(l.tAncSans), pc(l.tNouvSans), sg(l.ecartSans)].join(' | ') + ' |'); });
log('\n## Tableau 2 : cas types (€/mois)\n');
log('| Cas | actuel | unique | écart |'); log('|---|---:|---:|---:|');
U.casTypes().forEach(function (c) { log('| ' + [c.libelle, e(c.ancien), e(c.nouveau), sg(c.ecart)].join(' | ') + ' |'); });
log('\n## Recette (Md€/an, + = l\'État gagne)\n');
['bas', 'central', 'haut'].forEach(function (s) { var r = U.recette(s), a = U.recette(s, { forme: 'A' });
  log('- ' + s + ' : k = ' + e(r.k, 3) + ', sans loyer ' + e(100 * r.partSansLoyer) + ' % ; complément actuel ' + e(r.coutAncien, 2) + ' ; terme unique (B) ' + e(r.coutNouveau, 2) + ' ; écart B ' + e(r.gainEtat, 2) + ' ; écart A ' + e(a.gainEtat, 2) + ' ; convention du modèle (877 € partout dans la zone de retrait) ' + e(r.ecartConventionPL01, 2)); });
log('- μ neutre (central) : ' + e(U.muNeutre('central'), 4));
log('\nForme A (même K), cas types : ' + U.casTypes({ forme: 'A' }).map(function (c) { return c.id + ' ' + sg(c.ecart); }).join(' ; '));
var f = U.finComplementAncien(877), g = U.finComplementAncien(627);
log('\nFin du complément actuel : locataire R = ' + e(f.R) + ' € (dispo ' + e(f.net) + ' €), taux ' + pc(f.tauxAvant) + ' puis ' + pc(f.tauxApres) + ' ; sans loyer R = ' + e(g.R) + ' €, taux ' + pc(g.tauxAvant) + ' puis ' + pc(g.tauxApres));
var mins = [627, 877].map(function (P) { var mn = 0, at = 0; for (var R = 0; R <= 30000; R += 10) { var d = U.seul(R, P === 877 ? 250 : 0); if (d.nouveau - d.ancien < mn) { mn = d.nouveau - d.ancien; at = R; } } return [P, mn, at]; });
var maxs = [627, 877].map(function (P) { var mx = 0, at = 0; for (var R = 0; R <= 30000; R += 10) { var d = U.seul(R, P === 877 ? 250 : 0); if (d.nouveau - d.ancien > mx) { mx = d.nouveau - d.ancien; at = R; } } return [P, mx, at]; });
mins.forEach(function (m, i) { log('P = ' + m[0] + ' : plus forte perte ' + e(m[1], 1) + ' € à R = ' + e(m[2]) + ' ; plus fort gain ' + e(maxs[i][1], 1) + ' € à R = ' + e(maxs[i][2])); });
