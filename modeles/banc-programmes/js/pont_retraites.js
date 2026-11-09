/*
 * modeles/banc-programmes/js/pont_retraites.js : pont vers modeles/retraites/age_libre.js (effetAgeLibre).
 * Lancer depuis modeles/retraites/ : jsc modele.js age_libre.js ../banc-programmes/js/pont_retraites.js
 * Sortie : une ligne JSON : coût (Md€ de 2025) d'un départ avancé de delta années, sans décote (coefficient 'aucun'), pour une réforme qui démarre en 2028 (montée en 3 ans), par an de régime.
 */
var A = this.AgeLibre, grille = [], d;
for (d = 0; d <= 5.0001; d += 0.5) {
  var r = A.effetAgeLibre({ delta: d, coef: 'aucun', annees: [2032, 2038, 2058], debut: 2028, rampe: 3 }), o = { delta: d };
  [2032, 2038, 2058].forEach(function (an) { var x = r.annees[an]; o['depense' + an] = x.depenseMdE; o['recettes' + an] = x.recettesPerduesMdE; o['pib' + an] = A.pib(an); });
  grille.push(o);
}
print(JSON.stringify({ grille: grille, ageBase2032: A.ageBase(2032), ageLegalActuel: A.DONNEES.ageLegalActuel, pib2025: A.DONNEES.pib2025, debut: 2028, rampe: 3 }));
