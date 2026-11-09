// Rapport de l'optimisation (T47, § 8 de resultats.md). Depuis ce dossier, un plafond à la fois (une dizaine de secondes à deux minutes) :
//   JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc
//   $JSC modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js rapport_optimisation.js -- calcul 70 tous    > sortie-70-tous.json
//   $JSC modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js rapport_optimisation.js -- calcul 60 is25   > sortie-60-is25.json
//   $JSC modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js rapport_optimisation.js -- md sortie-*.json  > tableaux.md
//   variantes de calcul : tous | is25 | audit | audit-is25 (audit : correctifs de resultats.md § 9)
// Le premier mode écrit une ligne JSON ; le second assemble les tableaux Markdown à partir de ces lignes.
var O = this.Optimisation, M = this.SystemeIdeal;
var args = (typeof arguments !== 'undefined') ? Array.prototype.slice.call(arguments) : (typeof scriptArgs !== 'undefined' ? scriptArgs : []);
function r1(x) { return Math.round(x * 10) / 10; }
function pc(x) { return Math.round(x * 100) + ' %'; }

if (args[0] === 'calcul') {
  var plafond = +args[1] / 100, variante = args[2] || 'tous';
  var filtre = variante === 'is25' ? function (st) { return st.tIS === 0.25; } : null;
  var audit = variante === 'audit' || variante === 'audit-is25';
  if (variante === 'audit-is25') filtre = function (st) { return st.tIS === 0.25; };
  var res = O.balayer(null, plafond, filtre, { audit: audit }), b = res.meilleur, out = { plafond: plafond, variante: variante, nStructures: res.nStructures, nAdmissibles: res.nAdmissibles };
  if (b) {
    var P = O.perdants(b.p), c = b.contraintes, ms = O.sensibilite(b.st, plafond);
    out.st = b.st; out.bilan = b.bilan; out.description = O.decrire(b.st);
    out.marginalMax = c.marginalMax; out.RMarginalMax = c.RMarginalMax; out.ecartSmicard = c.ecartSmicard; out.ecartRetraiteModeste = c.ecartRetraiteModeste;
    out.combineDividende = 1 - (1 - b.st.tIS) * (1 - c.marginalAsymptotique);
    out.perdants = P;
    out.cas = c.cas.map(function (x) { return { libelle: x.libelle, avant: x.avantMois, apres: x.apresMois, ecart: x.ecartMois }; });
    out.sensibilite = ms.variantes;
  }
  print(JSON.stringify(out));
} else if (args[0] === 'md') {
  var lignes = [], i;
  for (i = 1; i < args.length; i++) read(args[i]).split('\n').forEach(function (l) { if (l.trim()) lignes.push(JSON.parse(l)); });
  var tous = lignes.filter(function (x) { return x.variante === 'tous'; }).sort(function (a, b) { return a.plafond - b.plafond; });
  var is25 = lignes.filter(function (x) { return x.variante === 'is25'; }).sort(function (a, b) { return a.plafond - b.plafond; });
  function ligneF(x) {
    if (!x.st) return '| ≤ ' + Math.round(x.plafond * 100) + ' % | aucune combinaison admissible | | | | | |';
    return '| ≤ ' + Math.round(x.plafond * 100) + ' % | ' + r1(x.bilan.soldeCentral) + ' (marge ' + r1(x.bilan.marge) + ') | ' + r1(x.bilan.soldeBas) + ' | ' + r1(x.bilan.soldeHaut) + ' | ' + Math.round(x.marginalMax * 100) + ' % | ' + x.description + ' | ' + x.nAdmissibles + ' / ' + x.nStructures + ' |';
  }
  print('| Plafond de taux marginal | Solde central avec santé (Md€/an) | Solde bas | Solde haut | Marginal atteint | Combinaison | Structures admissibles |');
  print('|---|---|---|---|---|---|---|');
  tous.forEach(function (x) { print(ligneF(x)); });
  print('\nIS conservé à 25 % seulement :');
  print('| Plafond | Solde central | Solde bas | Solde haut | Marginal atteint | Combinaison | Structures admissibles |'); print('|---|---|---|---|---|---|---|');
  is25.forEach(function (x) { print(ligneF(x)); });
  tous.concat(is25).filter(function (x) { return x.st && (x.plafond === 0.7 || x.plafond === 0.6); }).forEach(function (x) {
    print('\n#### Plafond ' + Math.round(x.plafond * 100) + ' %, ' + (x.variante === 'is25' ? 'IS 25 %' : 'IS 25 ou 30 %'));
    print(x.description);
    print('Solde public central : sans santé ' + r1(x.bilan.sansSante) + ', santé ' + r1(x.bilan.santeCentral) + ', total ' + r1(x.bilan.soldeCentral) + ' ; bas ' + r1(x.bilan.soldeBas) + ' ; haut ' + r1(x.bilan.soldeHaut) + ' (correction ASPA ' + r1(x.bilan.correctionASPA) + '). Taux marginal total maximal ' + pc(x.marginalMax) + ' (à ' + Math.round(x.RMarginalMax) + ' €/mois de revenu, impôt + sortie du socle) ; avec l\'IS, taux combiné sur un dividende ' + pc(x.combineDividende) + '.');
    print('Smicard à 35 h : ' + r1(x.ecartSmicard) + ' €/mois ; retraité modeste : ' + r1(x.ecartRetraiteModeste) + ' €/mois.');
    print('| Cas type | Aujourd\'hui | Après | Écart |'); print('|---|---|---|---|');
    x.cas.forEach(function (c) { print('| ' + c.libelle + ' | ' + Math.round(c.avant) + ' | ' + Math.round(c.apres) + ' | ' + (c.ecart >= 0 ? '+' : '') + Math.round(c.ecart) + ' |'); });
    print('Bandes où moins de la moitié des personnes gagnent : ' + (x.perdants.bandes.length ? x.perdants.bandes.map(function (b) { return b.id + ' (' + Math.round(b.partGagnants * 100) + ' % gagnent, ' + Math.round(b.ecartMois) + ' €/mois)'; }).join(', ') : 'aucune') + '.');
    print('Sensibilité (taux plat réoptimisé, variation du solde central, Md€/an) :');
    print('| Variante | Taux plat | Solde central | Écart |'); print('|---|---|---|---|');
    x.sensibilite.forEach(function (s) { print('| ' + s.libelle + ' | ' + (s.admissible ? pc(s.tPlat) : '-') + ' | ' + (s.admissible ? r1(s.soldeCentral) : 'aucun') + ' | ' + (s.admissible ? (s.ecart >= 0 ? '+' : '') + r1(s.ecart) : 'non admissible') + ' |'); });
  });
}
