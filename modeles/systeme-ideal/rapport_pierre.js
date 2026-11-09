// Optimisation sous les contraintes de l'auteur (T47, resultats.md § 10). Depuis ce dossier, une ligne JSON par jeu de contraintes :
//   JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc
//   $JSC modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js rapport_pierre.js -- <plafond %> <R0> <chomeur> <retraites> <minima> <falaise> <IS> [etiquette]
//   plafond : 70 | 60 ; R0 : 24000 | 18000 | libre (grille 12 000 à 30 000 €) ;
//   chomeur : aucun | t0 | t10 | t20 (transition de 2 ans, perte plafonnée à 0, 10 ou 20 % pendant la transition) | s0 | s10 | s20 (contrainte structurelle, de long terme) ;
//   retraites : aucun | 10 | 20 | 30 | 2000 (pensions < 2 000 € non perdantes) ; minima : 0 | 1 | parent | etudiant (parents isolés et étudiants boursiers non perdants, ou l'un des deux) ;
//   falaise : aucune (non vérifiée) | stricte | <tolérance en €/mois> ; IS : 0 | 1 (taux combiné IS + dividende ≤ plafond) ; suffixe p (0p, 1p) : aucun taux plat, impôt nul sous R0 (t_max de 20 à 70 %).
var O = this.Optimisation, M = this.SystemeIdeal, F = this.Voies.fus;
var a = (typeof arguments !== 'undefined') ? Array.prototype.slice.call(arguments) : (typeof scriptArgs !== 'undefined' ? scriptArgs : []);
var plafond = +a[0] / 100, R0 = a[1], ch = a[2], ret = a[3], minima = a[4] === '1' ? true : (a[4] === '0' ? false : a[4]), fal = a[5], isc = a[6].charAt(0) === '1', platNul = a[6].indexOf('p') >= 0, etiquette = a[7] || a.slice(0, 7).join('-');
var G = F(O.GRILLE_PIERRE, {});
G.R0 = R0 === 'libre' ? [12000, 18000, 24000, 30000] : [+R0];
var K = { inclureIS: isc, minima: minima };
if (platNul) { K.platNul = true; G.tMax = [0.20, 0.30, 0.40, 0.50, 0.60, 0.70]; }
if (ch.charAt(0) === 's') K.chomeurStructurel = +ch.slice(1) / 100;
if (ret !== 'aucun') K.perteMaxRetraites = ret === '2000' ? 0.005 : +ret / 100;
if (fal === 'stricte') K.sansFalaise = 0.5; else if (fal !== 'aucune') K.sansFalaise = +fal;
var xCh = ch.charAt(0) === 't' ? +ch.slice(1) / 100 : (ch.charAt(0) === 's' ? undefined : undefined);
var t0 = Date.now(), res = O.balayer(G, plafond, null, { audit: true, K: K }), b = res.meilleur;
var out = { etiquette: etiquette, plafond: plafond, R0: R0, chomeur: ch, retraites: ret, minima: minima, falaise: fal, IS: isc, nStructures: res.nStructures, nAdmissibles: res.nAdmissibles, secondes: Math.round((Date.now() - t0) / 1000) };
if (b) {
  var an = O.bilanAnnees(b.p, xCh), tr = { t0: O.transitionChomeurs(b.p, 0), t10: O.transitionChomeurs(b.p, 0.10), t20: O.transitionChomeurs(b.p, 0.20) }, g = O.groupes(b.p), fa = O.falaises(b.p), ve = O.verifier(b.p, plafond, K);
  out.st = b.st; out.description = O.decrire(b.st); out.bilan = b.bilan; out.annees = an; out.bords = O.bords(b.st, G); out.transitions = tr;
  out.marginalMax = ve.marginalMax; out.combineDividende = ve.combineDividende; out.falaiseMax = fa; out.ecartSmicard = ve.ecartSmicard;
  out.groupes = g.map(function (x) { return { id: x.id, avant: x.avantMois, apres: x.apresMois, ecart: x.ecartMois, partPerte: x.partPerte, perteMd: x.perteMd }; });
  out.perdants = O.perdants(b.p);
  out.cas = ve.cas.map(function (x) { return { libelle: x.libelle, avant: x.avantMois, apres: x.apresMois, ecart: x.ecartMois }; });
}
print(JSON.stringify(out));
