// Tests de la couche « revenu après dépenses contraintes de santé et avantages » (cas_types_nets_0611.js ; base de travail du 06/11/2026, non adoptée). Depuis ce dossier, avec jsc (zsh) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js \
//     bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js decisions_0611_v73.js decisions_0611_v74.js decisions_0611_v75.js base_0611.js \
//     cas_types_nets_0611.js test_cas_types_nets_0611.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST
//   (tableaux : remplacer le test par rapport_cas_types_nets_0611.js ; sortie recopiée dans sources/cas-types-nets-sante.md)
var N = this.CasTypesNets0611, B = this.BaseTravail0611;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }
function objet(cs) { var o = {}; cs.forEach(function (c) { o[c.id] = c; }); return o; }

// 1. Données
proche(N.primeCollective(1), 74 * 1.14, 1e-9, 'prime collective 2026 central : 74 € (DREES 2023) × 1,14');
proche(N.primeIndividuelle2023(20), 36, 1e-12, 'prime individuelle à 20 ans : 36 € (DREES, OC 2023)');
proche(N.primeIndividuelle2023(70), (104 + 127) / 2, 1e-9, 'prime individuelle à 70 ans : milieu de 65 ans (104 €) et 75 ans (127 €), 2021');
proche(N.primeIndividuelle2023(85), 142, 1e-12, 'prime individuelle à 85 ans : 142 € (OC 2023)');
proche(N.S.trEmployeur, 76.39, 0.01, 'titres-restaurant : 5,5 Md€ / 6 M de bénéficiaires / 12 = 76 €/mois');
proche(N.S.partHorsPanier, 1 - 18.8 * 255 / 208 / 33, 1e-12, 'part hors panier = 1 − 23,05 / 33 ≈ 30 %');
proche(N.S.primeOF[1], 84.36, 1e-9, 'prime collective des simulations OpenFisca (central) cohérente avec l\'indexation');
var m = N.mutuelleCollective('couple_2smic_2enf', 1);
proche(m.total, 84.36 * (2 + 2 * 0.4), 1e-9, 'couple avec deux enfants : deux primes adultes + 2 × 40 %');
proche(m.employeurTotal, 0.55 * m.total, 1e-9, 'part employeur 55 % au central');
ok(N.SALARIES.every(function (id) { return N.S.dRdOF[id][0] > N.S.dRdOF[id][1] && N.S.dRdOF[id][1] > N.S.dRdOF[id][2] && N.S.dRdOF[id][1] < 0; }), 'OpenFisca : la mutuelle réduit le revenu disponible, plus dans le scénario haut');

// 2. On retrouve les cas types publiés (base_0611.js, § 000.6)
var J = N.jeux(); proche(J.a.recette, J.manque, 0.01, 'jeu (a) : la fonction des revenus rapporte le manque'); proche(J.a.param, 0.7096, 0.0005, 'jeu (a) : a = 0,7096'); proche(J.c.param, 0.7028, 0.0005, 'jeu (c) : a = 0,7028');
var c0 = objet(N.casTypes()), pub = { smic_seul: [48, 10, 14], parent_isole_smic: [64, 26, 30], couple_2smic_0enf: [75, -26, -15], couple_2smic_2enf: [14, -87, -76],
  couple_median_2enf: [476, 219, 249], cadre_5000: [93, -235, -197], cadre_10000: [-232, -987, -900], cadre_20000: [-98, -1687, -1505] };
Object.keys(pub).forEach(function (id) { ['base', 'a', 'c'].forEach(function (j, i) { proche(c0[id][j].ecartRd, pub[id][i], 0.6, 'revenu disponible publié retrouvé : ' + id + ', ' + j); }); });

// 3. Revenu net santé
ok(N.SALARIES.every(function (id) { return c0[id].avantNet < c0[id].avant; }), 'droit actuel : la mutuelle réduit le revenu de chaque salarié');
ok(N.SALARIES.every(function (id) { return c0[id].base.ecartNet > c0[id].base.ecartRd; }), 'mode salaire : chaque salarié gagne à compter la mutuelle (base)');
proche(c0.retraite_1200.base.ecartNet, N.primeIndividuelle(70, 1), 1e-9, 'retraité à 1 200 € : gain = prime individuelle évitée (pension nette constante)');
proche(c0.retraite_aspa.base.ecartNet, 30, 1e-9, 'retraité au minimum vieillesse : gain = C2S participative (30 €)');
ok(c0.retraite_4000.a.ecartRd < 0 && c0.retraite_2000.a.ecartRd === 0, 'jeux : R1f touche la pension de 4 000 €, pas celle de 2 000 €');
proche(c0.independant.base.ecartNet - c0.independant.base.ecartRd, N.primeIndividuelle(40, 1), 1e-9, 'indépendant : + prime individuelle à 40 ans');
var cC = objet(N.casTypes({ mode: 'C' })), cS = objet(N.casTypes({ surcomplementaire: true }));
ok(N.SALARIES.every(function (id) { return cC[id].a.ecartNet < c0[id].a.ecartNet && cC[id].a.ecartNet > c0[id].a.ecartRd; }), 'mode contribution : entre le revenu disponible et le mode salaire');
ok(N.SALARIES.every(function (id) { return cS[id].a.ecartNet < c0[id].a.ecartNet; }), 'surcomplémentaire gardée : gain plus faible');

// 4. Cible (bas ≥ +20 € ; haut −1 à −3 %)
var ta = N.cible(N.casTypes(), 'a'), taRd = N.cible(N.casTypes(), 'a', 'Rd');
ok(!taRd.basOk && ta.basOk, 'jeu (a) : la cible du bas, manquée en revenu disponible, est tenue une fois la mutuelle comptée (central, mode salaire)');
ok(!ta.hautOk, 'jeu (a) : la cible du haut reste manquée (≈ −15 %)');
ok(!N.cible(N.casTypes({ surcomplementaire: true }), 'a').basOk, 'jeu (a) avec surcomplémentaire gardée : la cible du bas est de nouveau manquée');
ok(!N.cible(N.casTypes({ titres: true }), 'a').basOk, 'jeu (a) avec titres-restaurant : la cible du bas est manquée');

// 5. Macro
var M = N.manques();
proche(M.officiel.reference, 52.13, 0.01, 'manque officiel : 52,1 Md€');
proche(M.secuNette[1], 23.05 + 4.31 + 1.15 - 2.959, 0.01, 'Sécu à 100 % nette dans le solde : 25,5 Md€');
proche(M.poElargis.reference, M.officiel.reference - M.secuNette[1], 0.05, 'manque en PO élargis = manque − Sécu nette (linéarité de la dette)');
proche(M.contribution.reference, M.officiel.reference - 23.8 * 0.55, 0.05, 'contribution employeur santé : manque − 13,1');
proche(M.deltaPOelargisJeuA, J.a.recette - 46.5 * 0.75, 1e-9, 'jeu (a) : hausse des PO élargis = 52,1 − 34,9 (contrats collectifs disparus)');
ok(M.officielLignes[0] < M.officielLignes[1] && M.officielLignes[1] < M.officielLignes[2] && M.poElargisLignes[0] < M.poElargisLignes[2], 'fourchettes ordonnées');
log('Tests : ' + n + ' vérifications passées.');
