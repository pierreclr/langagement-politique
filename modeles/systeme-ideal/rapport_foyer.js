// Dimension « foyer » : tableaux de resultats.md § 16. Reproduction, depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js foyer.js rapport_foyer.js
var Fy = this.Foyer, P1 = this.Palier1, F = this.Voies.fus, RG = Fy.REGIMES;
var log = (typeof print === 'function') ? print : console.log;
function r1(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
function r0(x) { return Math.round(x).toString(); }
function sg(x) { return (x >= 0 ? '+' : '−') + r0(Math.abs(x)); }
var pt = P1.solde(F(P1.palier1().st, { tPlat: 0.36 }), 'central') - P1.solde(F(P1.palier1().st, { tPlat: 0.35 }), 'central');
log('## A. Ménages types (€/mois : loi actuelle approchée, puis écart de chaque régime du palier 1 à la loi actuelle)');
log('| Ménage | Loi actuelle | Individualisé | Palier 1 publié | Familial | Socle familial + impôt individuel | Quotient d\'enfants |');
Fy.tableau().forEach(function (t) {
  var r = t.regimes, k = ['individualise', 'palier1', 'familial', 'familialIndiv', 'quotient'];
  log('| ' + t.libelle + ' | ' + r0(t.actuel) + ' | ' + k.map(function (x) { return r0(r[x].net) + ' (' + sg(r[x].ecart) + ')'; }).join(' | ') + ' |');
});
log('\n## B. Taux de participation du conjoint qui entre à un Smic (coût employeur du premier apporteur, €/mois ; 0 enfant)');
[0, 1988, 3677, 8000, 14600, 27400].forEach(function (R) {
  log('| ' + r0(R) + ' | conjugalisé ' + r1(100 * Fy.participationSecond(R, 0, RG.palier1)) + ' % | individuel ' + r1(100 * Fy.participationSecond(R, 0, RG.individualise)) + ' % |');
});
function E(o, h) { return Fy.effetSolde(o, h); }
function ligne(nom, e) { return '| ' + nom + ' | ' + r1(e.conjugalisation) + ' | ' + r1(e.socleFamilial) + ' | ' + r1(e.quotientCout) + ' / ' + r1(e.supplementEconomise) + ' | ' + r1(e.participation) + ' | ' + r1(e.individualiseVsPalier1) + ' |'; }
log('\n## C. Effet sur le solde public (Md€/an ; + = rapporte à l\'État ; un point de taux plat = ' + r1(pt) + ' Md€ au palier 1, 13 retenu)');
log('| Cas | Conjugalisation (par rapport à l\'impôt individuel) | Socle familial | Quotient : coût / supplément économisé | Participation | Individualiser l\'impôt (net) |');
var c = E();
log(ligne('central (12 M couples, 15 % monoactifs, homogamie 30 %, élasticité 0,5)', c));
log(ligne('10 M de couples', E({}, { nCouples: 10e6 })));
log(ligne('13 M de couples', E({}, { nCouples: 13e6 })));
log(ligne('monoactifs 10 %', E({}, { partMonoactifs: 0.10 })));
log(ligne('monoactifs 25 %', E({}, { partMonoactifs: 0.25 })));
log(ligne('homogamie 0 % (appariement indépendant)', E({}, { homogamie: 0 })));
log(ligne('homogamie 60 %', E({}, { homogamie: 0.6 })));
log(ligne('élasticité 0,2', E({}, { elasticite: 0.2 })));
log(ligne('élasticité 1', E({}, { elasticite: 1 })));
log(ligne('élasticité 2 (borne haute de Carbonnier)', E({}, { elasticite: 2 })));
log(ligne('t_max 15 %', E({ tMax: 0.15 })));
log('\ndétail central : conjugalisation biactifs ' + r1(c.conjugalisationBiactifs) + ', monoactifs ' + r1(c.conjugalisationMonoactifs) + ' ; entrants ' + r0(c.entrants) + ' ; coût moyen du quotient par enfant ' + r0(c.parEnfantMoyen) + ' €/an ; quotient net ' + r1(c.quotientNet));
log('en points de taux plat (13 Md€) : ' + Object.keys(c.enPointsDePlat).map(function (k) { return k + ' ' + r1(c.enPointsDePlat[k]); }).join(' ; '));
