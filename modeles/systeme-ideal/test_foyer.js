// Tests de la dimension « foyer » (calculs à la main ou recoupements avec les modules existants). Depuis ce dossier :
//   jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js foyer.js test_foyer.js
var M = this.SystemeIdeal, O = this.Optimisation, P1 = this.Palier1, Fy = this.Foyer, D = M.DONNEES, F = this.Voies.fus, RG = Fy.REGIMES;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
var p = Fy.par();

// Calculs à la main
var Rs = Fy.SMIC.cout * 12;
proche(Rs, 23853.12, 0.01, 'coût employeur annuel du Smic : 1 987,76 × 12');
var seul = { adultes: 1, R: [Rs, 0], enfants: 0 };
proche(Fy.net(seul, RG.individualise, p), 500 + 0.65 * Rs / 12, 1e-9, 'Smic seul : 500 € + 65 % du coût (sous R0, aucun impôt continu) = 1 792,04 €');
var C = function (R1, R2, e) { return { adultes: 2, R: [R1, R2], enfants: e || 0 }; };
proche(Fy.impot(C(Rs, Rs), RG.individualise, p), 2 * Fy.impot(seul, RG.individualise, p), 1e-9, 'deux Smic : impôt individuel = deux fois celui d\'un Smic');
proche(Fy.impot(C(60000, 60000), RG.palier1, p), Fy.impot(C(60000, 60000), RG.individualise, p), 1e-6, 'revenus égaux : impôt conjugal = impôt individuel (le quotient ne joue pas)');
// Couple monoactif à 175 200 € (cadre à 8 000 € nets) : I(R) = 0,3 × [(R − R0) − R0 ln(R/R0)]
var I = function (R) { return 0.3 * ((R - 24000) - 24000 * Math.log(R / 24000)); };
proche(Fy.impot(C(175200, 0), RG.individualise, p), 0.35 * 175200 + I(175200), 1e-6, 'monoactif, impôt individuel : 35 % + continu = 92 342 €');
proche(Fy.impot(C(175200, 0), RG.palier1, p), 0.35 * 175200 + 2 * I(87600), 1e-6, 'monoactif, impôt conjugal : 35 % + 2 × continu sur 87 600 €');
proche(Fy.impot(C(175200, 0), RG.individualise, p) - Fy.impot(C(175200, 0), RG.palier1, p), I(175200) - 2 * I(87600), 1e-6, 'avantage du quotient conjugal du cadre monoactif = 11 531 €/an (≈ 961 €/mois)');
ok(I(175200) - 2 * I(87600) > 11500 && I(175200) - 2 * I(87600) < 11600, 'valeur à la main de cet avantage : entre 11 500 et 11 600 €');
// Socle
proche(Fy.socle(C(Rs, Rs), RG.familial, p), 750, 1e-9, 'socle familial d\'un couple sans enfant : 1,5 × 500 = 750 €');
proche(Fy.socle(C(Rs, Rs), RG.individualise, p), 1000, 1e-9, 'socle individuel d\'un couple : 1 000 €');
proche(Fy.socle(seul, RG.familial, p), 500, 1e-9, 'adulte seul : même socle dans les deux régimes');
proche(Fy.socle(C(Rs, Rs, 2), RG.individualise, p), 1400, 1e-9, 'couple, 2 enfants, supplément : 1 000 + 400 = 1 400 €');
proche(Fy.socle(C(Rs, Rs, 2), RG.quotient, p), 1000, 1e-9, 'quotient : aucun supplément de socle pour les enfants');
// Quotient d'enfants : sans enfant, identique ; avec enfants, l'impôt baisse seulement au-dessus de R0 par part
proche(Fy.impot(C(Rs, Rs, 0), RG.quotient, p), Fy.impot(C(Rs, Rs, 0), RG.individualise, p), 1e-9, 'quotient sans enfant : aucun effet');
proche(Fy.impot(C(Rs, 0, 2), RG.quotient, p), Fy.impot(C(Rs, 0, 2), RG.individualise, p), 1e-9, 'sous R0 par part, le quotient d\'enfants ne baisse rien (foyer non concerné)');
ok(Fy.impot(C(175200, 0, 2), RG.quotient, p) < Fy.impot(C(175200, 0, 2), RG.individualise, p), 'au-dessus de R0, le quotient d\'enfants baisse l\'impôt');
proche(Fy.impot(C(175200, 0, 2), RG.quotient, p), 0.35 * 175200 + 2 * I(175200 / 2), 1e-6, 'quotient, 2 enfants confiés à l\'adulte le mieux payé : 2 parts, continu = 2 × I(R / 2)');
// Plancher des parents isolés
proche(Fy.net({ adultes: 1, R: [0, 0], enfants: 2 }, RG.individualise, p), 1300, 1e-9, 'parent isolé sans emploi, 2 enfants : plancher de 1 300 € (H109 de palier1.js)');
// Participation du second apporteur
proche(Fy.participationSecond(0, 0, RG.palier1), 0.35, 1e-9, 'second apporteur d\'un conjoint sans emploi : taux de participation = taux plat (35 %)');
proche(Fy.participationSecond(this.FiscaliteActuelle.coutEmployeurDepuisNet(8000), 0, RG.individualise), 0.35, 1e-9, 'impôt individuel : taux de participation de 35 % quel que soit le revenu du premier apporteur (le Smic reste sous R0)');
ok(Fy.participationSecond(this.FiscaliteActuelle.coutEmployeurDepuisNet(8000), 0, RG.palier1) > 0.50, 'impôt conjugalisé : le conjoint d\'un cadre à 8 000 € entre à plus de 50 % de taux de participation');
ok(Fy.participationSecond(3000, 0, RG.palier1) > Fy.participationSecond(0, 0, RG.palier1), 'le taux de participation croît avec le revenu du premier apporteur');
// Loi actuelle : approximation déclarée
proche(Fy.actuel({ adultes: 2, enfants: 2, emplois: [Fy.SMIC] }), 2552, 40, 'loi actuelle, famille à un Smic : ≈ 2 552 € (ma-situation.js, cas couple1smic2enf)');
proche(Fy.actuel({ adultes: 2, enfants: 2, emplois: [Fy.SMIC, Fy.SMIC] }), 2 * 1477.93 + 230 + 150 + 400, 200, 'loi actuelle, deux Smic et 2 enfants : même ordre que le cas T14 (3 736 €)');
var irA = Fy.irActuel(200000, 2, 0), irB = Fy.irActuel(200000, 2, 2);
proche(irA - irB, 2 * 1807, 1, 'plafonnement : 2 enfants (2 demi-parts) font gagner au plus 2 × 1 807 € à 200 000 € de revenu');
ok(Fy.irActuel(100000, 1, 0) - Fy.irActuel(100000, 1, 1) <= 4262 + 1e-6, 'parent isolé, 1 enfant : avantage plafonné à 4 262 € (BOFiP, revenus 2025)');
proche(Fy.irActuel(20000, 2, 0), 0, 0.5, 'couple à 20 000 € de revenu net imposable : impôt nul (décote)');

// Recoupement avec situation() du palier 1 : le régime « palier1 » est celui du modèle (socle individuel, impôt conjugalisé)
var Pal = P1.palier1(), pc = F(O.configR(Pal.st), { scenario: 'central' }), pp = Fy.par({ tPlat: Pal.tPlat });
proche(Pal.tPlat, 0.35, 1e-9, 'taux plat retenu du palier 1 : 35 % (valeur par défaut de foyer.js)');
var casDeux = null, i;
for (i = 0; i < M.CAS.length; i++) if (M.CAS[i].id === 'couple2enfants') casDeux = M.CAS[i];
proche(Fy.net(C(Rs, Rs, 2), RG.palier1, pp), M.situation(casDeux, pc).apresMois, 0.5, 'couple, deux Smic, 2 enfants : foyer.js (régime palier 1) = situation() de modele.js');
var cadre = null; P1.casActifs(Pal.st).forEach(function (c) { if (c.id === 'cadre8k') cadre = c; });
proche(Fy.net({ adultes: 1, R: [this.FiscaliteActuelle.coutEmployeurDepuisNet(8000) * 12, 0], enfants: 0 }, RG.palier1, pp), cadre.apresMois, 0.5, 'cadre à 8 000 € nets : foyer.js = palier1.js casActifs (coût employeur 14 712 €, table T14)');
// Les ménages types : écarts de la table
var T = Fy.tableau(), by = {}; T.forEach(function (t) { by[t.id] = t; });
ok(T.length === 7, 'sept ménages types');
ok(by.couple_cadre_0.regimes.palier1.net > by.couple_cadre_0.regimes.individualise.net + 900, 'cadre monoactif : l\'individualisation lui retire environ 960 €/mois par rapport au palier 1 conjugalisé');
proche(by.couple_smic_smic.regimes.palier1.net, by.couple_smic_smic.regimes.individualise.net, 1e-9, 'deux Smic : conjugalisé ou non, même revenu');
proche(by.couple_smic_smic.regimes.individualise.net - by.couple_smic_smic.regimes.familial.net, 250, 1e-9, 'deux Smic : le socle familial retire 250 € par mois (1,5 S au lieu de 2 S)');
ok(by.isole1.regimes.quotient.net < by.isole1.regimes.individualise.net - 150, 'parent isolé au Smic : le quotient d\'enfants le prive du supplément de 200 € sans lui rien rendre (non imposable)');
ok(by.couple_cadre_smic.regimes.familialIndiv.net < by.couple_cadre_smic.regimes.familial.net, 'impôt individuel avec socle familial : le couple cadre + Smic paie plus qu\'avec un impôt conjugalisé');
ok(by.couple_smic_0.actuel > 1900 && by.couple_smic_0.actuel < 2200, 'loi actuelle : couple Smic + 0 autour de 2 035 € (prime d\'activité de couple, impôt nul)');

// Effet sur le solde public
var E = Fy.effetSolde();
ok(E.conjugalisation < 0, 'le quotient conjugal du palier 1 coûte à l\'État par rapport à l\'impôt individuel');
ok(E.conjugalisation > -25 && E.conjugalisation < -8, 'ordre de grandeur de la conjugalisation : 8 à 25 Md€ (individualisation actuelle de l\'IR : 7 Md€ avec option, 10 Md€ sans, Allègre, Périvier et Pucci 2021, à taux bien plus bas)');
proche(E.conjugalisation, E.conjugalisationBiactifs + E.conjugalisationMonoactifs, 1e-9, 'conjugalisation = biactifs + monoactifs');
ok(E.conjugalisationMonoactifs / 0.15 < E.conjugalisationBiactifs / 0.85, 'coût par couple du quotient : monoactif > biactif');
proche(E.socleFamilial, 12e6 * 250 * 12 / 1e9, 1e-9, 'socle familial : 12 M de couples × 250 € × 12 = 36 Md€ d\'économie');
proche(E.supplementEconomise, D.enfants * 2400 / 1e9, 1e-9, 'supplément de socle pour les enfants : D.enfants × 200 € × 12');
ok(E.quotientCout < 0 && -E.quotientCout < E.supplementEconomise, 'le quotient d\'enfants coûte moins que le supplément de 200 € : il ne profite qu\'aux foyers au-dessus de R0 par part');
proche(E.quotientNet, E.supplementEconomise + E.quotientCout, 1e-9, 'quotient net = supplément économisé − coût du quotient');
ok(E.participation > 0 && E.participation < 3, 'retour de la participation : positif et inférieur à 3 Md€ (≈ 125 000 entrants)');
ok(E.entrants > 5e4 && E.entrants < 3e5, 'entrants : de 50 000 à 300 000 seconds apporteurs');
proche(E.individualiseVsPalier1, -E.conjugalisation + E.participation, 1e-9, 'individualiser l\'impôt = fin de la conjugalisation + participation');
proche(E.enPointsDePlat.socleFamilial, 36 / 13, 1e-9, 'socle familial : 2,8 points de taux plat à 13 Md€ le point');
// Prix du point de taux plat recalculé avec le palier 1 complet (palier1.js) : doit rester dans la fourchette de H143
var pt = P1.solde(F(Pal.st, { tPlat: 0.36 }), 'central') - P1.solde(F(Pal.st, { tPlat: 0.35 }), 'central');
ok(pt > 10 && pt < 16, 'un point de taux plat vaut ' + pt.toFixed(1) + ' Md€ au palier 1 (fourchette de H143 : 12 à 14,5, large : 10 à 16)');
// Sensibilités : linéarité et monotonie
var E2 = Fy.effetSolde({}, { nCouples: 24e6 });
proche(E2.conjugalisation, 2 * E.conjugalisation, 1e-6, 'nombre de couples ×2 : conjugalisation ×2');
proche(Fy.effetSolde({}, { elasticite: 0 }).participation, 0, 1e-12, 'élasticité nulle : aucun entrant');
proche(Fy.effetSolde({}, { elasticite: 1 }).participation, 2 * E.participation, 1e-6, 'élasticité ×2 : participation ×2');
ok(Fy.effetSolde({}, { partMonoactifs: 0.30 }).conjugalisation < E.conjugalisation, 'plus de couples monoactifs : la conjugalisation coûte plus');
ok(Fy.effetSolde({ tMax: 0.15 }).conjugalisation > E.conjugalisation, 't_max plus bas : la conjugalisation coûte moins');
ok(Fy.effetSolde({ tMax: 0 }).conjugalisation > -1e-9 && Fy.effetSolde({ tMax: 0 }).conjugalisation < 1e-9, 'sans impôt continu (taux plat seul), aucune différence entre conjugal et individuel');
log('\n' + n + ' contrôles passés');
