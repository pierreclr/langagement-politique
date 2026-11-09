// Tableaux de sources/cas-types-nets-sante.md (couche cas_types_nets_0611.js). Même liste de chargement que test_cas_types_nets_0611.js, ce fichier à la place du test.
var N = this.CasTypesNets0611;
function e(x) { var v = Math.round(x); return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v); }
function eu(x) { return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function pc(x) { return (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(100 * x).toFixed(1).replace('.', ',') + ' %'; }
function f(x, d) { return x.toFixed(d === undefined ? 1 : d).replace('.', ','); }
function table(titre, opts) {
  var cs = N.casTypes(opts);
  print('\n#### ' + titre + '\n');
  print('| Cas type | Revenu disponible aujourd\'hui | Mutuelle payée aujourd\'hui (€/mois) | Revenu net santé aujourd\'hui | Base : Δ rd | Base : Δ net santé | Jeu (a) : Δ rd | Jeu (a) : Δ net santé | Jeu (c) : Δ rd | Jeu (c) : Δ net santé |');
  print('|---|---|---|---|---|---|---|---|---|---|');
  cs.forEach(function (c) {
    print('| ' + c.libelle + ' | ' + eu(c.avant) + ' | ' + eu(c.coutMutuelle) + ' | ' + eu(c.avantNet) + ' | ' + e(c.base.ecartRd) + ' | ' + e(c.base.ecartNet) + ' (' + pc(c.base.pctNet) + ') | ' + e(c.a.ecartRd) + ' | **' + e(c.a.ecartNet) + '** (' + pc(c.a.pctNet) + ') | ' + e(c.c.ecartRd) + ' | **' + e(c.c.ecartNet) + '** (' + pc(c.c.pctNet) + ') |');
  });
  ['base', 'a', 'c'].forEach(function (j) { var r = N.cible(cs, j), rr = N.cible(cs, j, 'Rd');
    print('\nCible (' + j + ') : bas ≥ +20 € : revenu disponible ' + (rr.basOk ? 'tenue' : 'manquée') + ', net santé ' + (r.basOk ? 'tenue' : 'manquée') + ' (' + r.bas.map(function (b) { return e(b.ecart); }).join(' / ') + ') ; haut −1 à −3 % : ' + (r.hautOk ? 'tenue' : 'manquée') + ' (' + r.haut.map(function (h) { return pc(h.pct); }).join(' / ') + ').'); });
  return cs;
}
var J = N.jeux();
print('Jeu (a) : a = ' + f(J.a.param, 4) + ', recette ' + f(J.a.recette, 2) + ' ; jeu (c) : a = ' + f(J.c.param, 4) + ', recette ' + f(J.c.recette, 2));
var c = table('Central, mode salaire (S), sans surcomplémentaire, sans titres-restaurant', {});
c.filter(function (x) { return x.type === 'retraite'; }).forEach(function (x) { print('- ' + x.libelle + ' : R1f ' + e(-x.perteR1f) + ' €/mois ; si la caisse versait un brut fixe : jeu (a) ' + e(x.siCaisseFixe.a) + ', jeu (c) ' + e(x.siCaisseFixe.c)); });
table('Variante : le ménage garde une surcomplémentaire hors panier (30 % de la prime actuelle)', { surcomplementaire: true });
table('Variante : contribution employeur santé au budget commun (C), la part employeur ne va pas au salaire', { mode: 'C' });
table('Variante : chaque salarié a des titres-restaurant aujourd\'hui (76 €/mois de part employeur, convertis en salaire)', { titres: true });
table('Scénario bas (prime 2023 non indexée, part employeur 60 %, sans forfait social)', { k: 0 });
table('Scénario haut (prime +20 %, part employeur 50 %)', { k: 2 });
var M = N.manques();
print('\n#### Manque à financer (Md€/an, macro de référence ; prudente ; favorable)\n');
print('| Convention | Référence | Prudente | Favorable |'); print('|---|---|---|---|');
[['Officiel (base de travail)', M.officiel], ['(S) part employeur hors de D121, convertie en salaire taxé à 0,50', M.salaireHorsD121], ['(C) contribution employeur santé (13,1 Md€) au budget commun', M.contribution],
 ['PO élargis : la Sécu à 100 % nette (' + f(M.secuNette[1]) + ') ne compte pas comme prélèvement nouveau', M.poElargis], ['PO élargis + contribution employeur', M.poElargisEtContribution]]
  .forEach(function (r) { print('| ' + r[0] + ' | ' + f(r[1].reference) + ' | ' + f(r[1].prudente) + ' | ' + f(r[1].favorable) + ' |'); });
print('\nSelon les lignes (favorable / central / défavorable) : officiel ' + M.officielLignes.map(function (x) { return f(x); }).join(' / ') + ' ; PO élargis ' + M.poElargisLignes.map(function (x) { return f(x); }).join(' / '));
print('Part employeur macro : ' + M.partEmployeur.map(function (x) { return f(x, 2); }).join(' / ') + ' ; Sécu nette : ' + M.secuNette.map(function (x) { return f(x, 2); }).join(' / ') + ' ; contrats collectifs disparus : ' + M.collectifsDisparus.map(function (x) { return f(x, 2); }).join(' / ') + ' ; primes du panier : ' + f(M.primesPanier, 2) + ' ; Δ PO élargis jeu (a) : ' + f(M.deltaPOelargisJeuA, 2));
