// Tests de l'optimisation. Depuis ce dossier :
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js test_optimisation.js
var M = this.SystemeIdeal, V = this.Voies, S = this.Sante, O = this.Optimisation, F = V.fus;
var log = (typeof print === 'function') ? print : console.log;
var n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// Configuration : IS conservé, compléments ciblés, retraités imposés
var st = { socle: 650, forme: { mode: 'uniforme', R1: 0 }, tMax: 0.25, R0: 24000, prime: 0, sousIndexation: 0, tIS: 0.25, holdings: true, tPlat: 0.47 };
ok(O.config(st).R0 === 24000 && M.DEFAUT.R0 === 24000, 'R0 = 24 000 € comme le modèle');
var p = O.config(st), A = F(V.voieA(650, 0.75), { tPlat: 0.47, tMax: 0.25 });
['socle', 'prime', 'archi', 'isConserve', 'complAspa', 'complRsa', 'aahDifferentielle', 'sousIndexation', 'imposerComplements', 'holdings', 'tPlat', 'tMax', 'tIS'].forEach(function (k) { ok((p[k] || 0) === (A[k] || 0), 'config = voie A 650 : ' + k); });
ok(O.config(F(st, { prime: 100 })).prime === 'progressive' && O.config(F(st, { prime: 100 })).primeMontant === 100, 'prime 100 : progressive, montant 100');
ok(O.config(F(st, { forme: { mode: 'lineaire', R1: 2000 } })).socleMode === 'lineaire', 'forme linéaire transmise au modèle');

// Bilan avec santé = bilan de voies.js + santé (9,7 / 12,62 / 2,75), sans correction en socle universel
var b = O.bilan(p), vb = V.bilan(p);
proche(b.soldeCentral, vb.soldeCentral + 9.7, 1e-9, 'voie A : solde central avec santé = sans santé + 9,7');
proche(b.soldeBas, vb.soldeBas + 12.62, 1e-9, 'voie A : solde bas + 12,62');
proche(b.soldeHaut, vb.soldeHaut + 2.75, 1e-9, 'voie A : solde haut + 2,75');
ok(b.correctionASPA === 0, 'socle universel : aucune correction du plancher ASPA');
ok(b.marge === Math.max(0, b.soldeCentral), 'marge = max(0, solde central)');

// Correction ASPA en socle dégressif, calcul à la main : n × (max(0, 1043,59 − max(Sd, pm)) − max(0, 1043,59 − max(S, pm))) × 12
var pl = O.config(F(st, { forme: { mode: 'lineaire', R1: 2000 } })), pm = M.DONNEES.aspa.pensionMoy, Sd = 650 * (1 - pm / 2000);
proche(O.correctionASPA(pl), 0.75e6 * ((1043.59 - Math.max(Sd, pm)) - (1043.59 - 650)) * 12 / 1e9, 1e-6, 'correction ASPA socle linéaire R1 2 000 € (calcul à la main)');
ok(O.correctionASPA(pl) > 0 && O.correctionASPA(pl) < 2, 'correction ASPA positive et inférieure à 2 Md€');
ok(O.bilan(pl).soldeCentral === V.bilan(pl).soldeCentral + 9.7 - O.correctionASPA(pl), 'bilan dégressif : solde = voies + santé − correction');

// Contraintes de la voie A 650 (marginal asymptotique 72 %, smicard à −4 €, retraité modeste intact)
var c75 = O.contraintes(p, 0.75), c70 = O.contraintes(p, 0.70);
proche(c75.marginalAsymptotique, 0.72, 1e-9, 'voie A : marginal asymptotique 47 + 25 = 72 %');
ok(c75.okMarginal && !c70.okMarginal, 'voie A : respecte ≤ 75 %, viole ≤ 70 %');
ok(c75.okSmicard && c75.ecartSmicard > -10 && c75.ecartSmicard < 0, 'voie A : smicard à 35 h à −4 €/mois (resultats.md V4), toléré à −10');
ok(c75.okRetraite && Math.abs(c75.ecartRetraiteModeste) < 0.5, 'voie A : retraité modeste non perdant (plancher ASPA)');
ok(c75.okSocle, 'voie A : personne sous le socle : aucune');
ok(c75.ok && !c70.ok, 'contrainte globale : ok à 75 %, pas à 70 %');
// Une configuration qui fait perdre le smicard : taux plat 60 %
ok(!O.contraintes(F(p, { tPlat: 0.60 }), 0.95).okSmicard, 'taux plat 60 % : le smicard à 35 h perd plus de 10 €/mois');
// Un socle à 0 sans compléments serait sous le plancher : retirer les compléments casse la contrainte « socle »
ok(!O.contraintes(F(p, { complAspa: false, complRsa: false, socle: 500 }), 0.95).okSocle, 'sans compléments ASPA et RSA, le socle de 500 € laisse des personnes sous les planchers');

// Meilleur taux d'une structure : respecte les contraintes, décroît quand le plafond baisse
var s0 = { socle: 650, forme: { mode: 'uniforme', R1: 0 }, tMax: 0.25, R0: 24000, prime: 0, sousIndexation: 0, tIS: 0.25, holdings: true };
var m75 = O.meilleurTaux(s0, 0.75), m80 = O.meilleurTaux(s0, 0.80), m70 = O.meilleurTaux(s0, 0.70);
ok(m75 && m75.contraintes.ok && m75.contraintes.marginalMax <= 0.75 + 1e-9, 'meilleur taux sous 75 % : admissible, marginal ≤ 75 %');
ok(m75.st.tPlat <= 0.50 + 1e-9 && m75.st.tPlat >= 0.47 - 1e-9, 'sous 75 % avec t_max 25 % : taux plat de 47 à 50 % (resultats.md V1)');
ok(m80.bilan.soldeCentral >= m75.bilan.soldeCentral - 1e-9 && m75.bilan.soldeCentral >= m70.bilan.soldeCentral - 1e-9, 'plus le plafond est large, meilleur le solde central');
ok(O.meilleurTaux(F(s0, { tMax: 0.40 }), 0.45) === null, 'plafond 45 % avec t_max 40 % : aucun taux plat de 10 % ou plus ne convient');

// Balayage sur une petite grille
var G = { socle: [500, 650], formes: [{ mode: 'uniforme', R1: 0 }, { mode: 'lineaire', R1: 2000 }], tMax: [0, 0.25], R0: [24000], prime: [0, 200], sousIndexation: [0, 0.015], tIS: [0.25, 0.30], holdings: [true] };
var r70 = O.balayer(G, 0.70), r60 = O.balayer(G, 0.60), r90 = O.balayer(G, 0.90);
ok(r70.nStructures === 2 * 2 * 2 * 1 * 2 * 2 * 2 * 1, 'petite grille : 64 structures');
ok(r70.meilleur && r70.meilleur.contraintes.ok, 'balayage ≤ 70 % : un meilleur admissible');
ok(r70.meilleur.contraintes.marginalMax <= 0.70 + 1e-9 && r60.meilleur.contraintes.marginalMax <= 0.60 + 1e-9, 'plafonds respectés (70 % et 60 %)');
ok(r90.meilleur.bilan.soldeCentral >= r70.meilleur.bilan.soldeCentral - 1e-9 && r70.meilleur.bilan.soldeCentral >= r60.meilleur.bilan.soldeCentral - 1e-9, 'frontière monotone : 90 % ≥ 70 % ≥ 60 %');
ok(r70.meilleur.st.tIS === 0.30 && r70.meilleur.st.sousIndexation === 0.015, 'le meilleur prend l\'IS à 30 % et la sous-indexation maximale de la grille');
var rIS = O.balayer(G, 0.70, function (s) { return s.tIS === 0.25; });
ok(rIS.nStructures === 32 && rIS.meilleur.st.tIS === 0.25 && rIS.meilleur.bilan.soldeCentral < r70.meilleur.bilan.soldeCentral, 'filtre IS 25 % : 32 structures, solde inférieur à IS libre');
ok(O.balayer(G, 0.05).meilleur === null, 'plafond 5 % : aucune combinaison');
// Recalcul indépendant du meilleur : solde central = voies + santé − correction
var mb = r70.meilleur, chk = V.bilan(mb.p).soldeCentral + 9.7 - O.correctionASPA(mb.p);
proche(mb.bilan.soldeCentral, chk, 1e-9, 'meilleur : solde recalculé indépendamment');
// Frontière
var fr = O.frontiere([0.60, 0.70, 0.90], G);
ok(fr.length === 3 && fr[0].plafond === 0.60 && fr[2].meilleur.bilan.soldeCentral >= fr[0].meilleur.bilan.soldeCentral, 'frontière : trois lignes, marge croissante avec le plafond');
// Perdants : le retraité aisé et le dirigeant perdent toujours ; sensibilité cohérente
var pe = O.perdants(mb.p);
ok(pe.cas.some(function (x) { return x.libelle.indexOf('aisé') >= 0; }), 'perdants : le retraité aisé figure parmi les perdants');
var sens = O.sensibilite(s0, 0.75);
ok(sens.variantes.length === 11 && sens.reference.bilan.soldeCentral === m75.bilan.soldeCentral, 'sensibilité : 11 variantes autour de la référence');
var vIS = sens.variantes.filter(function (x) { return x.libelle === 'IS 25 %'; })[0];
proche(vIS.ecart, 0, 1e-9, 'sensibilité : IS 25 % sur une référence à IS 25 % : écart nul');
ok(O.decrire(F(s0, { tPlat: 0.47 })).indexOf('plat 47 %') > 0, 'description lisible');

// ======================================================================
// AUDIT CONTRADICTOIRE (01/11/2026, resultats.md § 9) : bogues corrigés, verrouillés ici
// ======================================================================
var D = M.DONNEES;
var O70 = { socle: 550, forme: { mode: 'uniforme', R1: 0 }, tMax: 0.20, R0: 12000, prime: 200, sousIndexation: 0.015, tIS: 0.30, holdings: true, tPlat: 0.49 };
var pPub = O.config(O70), pAud = O.config(F(O70, { audit: true }));
// (0) rétrocompatibilité : les correctifs sont désactivés par défaut
ok(M.DEFAUT.sousIndexationNette === false && M.DEFAUT.retraitesReactions === false && M.DEFAUT.couvertureHoldings === 'tout', 'audit : correctifs désactivés par défaut dans modele.js');
ok(!pPub.sousIndexationNette && !pPub.retraitesReactions && pPub.couvertureHoldings === 'tout', 'config sans audit : comportement publié');
ok(pAud.sousIndexationNette && pAud.retraitesReactions && pAud.couvertureHoldings === 'sommet', 'config avec audit : trois correctifs actifs');
proche(O.bilan(pPub).soldeCentral, 138.1, 0.1, 'audit : le résultat publié (135,2 Md€) se reproduit sans le drapeau, à 138,1 après V11770 (RSA 1,84 M) et V11772 (prime sur 27,9 M)');
// (1) arithmétique indépendante des leviers (à la main)
proche(D.adultes * 100 * 12 / 1e9, 66.27, 0.01, 'socle 650 → 550 : 55,226 M × 100 € × 12 = 66,3 Md€ de coût évité (avant économie sur pensions et recettes)');
var s70 = M.solde(F(pPub, { scenario: 'central' }));
proche(s70.postes.gainIndexation, (392.5 - M.economieRetraites(550, pPub)) * (1 - Math.pow(0.985, 10)), 1e-9, 'sous-indexation brute = (392,5 − 106,4) × (1 − 0,985^10) = 40,1 Md€ (régime de croisière à 10 ans, pas année 1)');
proche(s70.postes.prime, 27.9e6 * 2400 / 1e9 + 1.5e6 * (200 / 15 * 8) * 12 / 1e9, 1e-9, 'prime 200 € progressive : 67,0 + 1,9 = 68,9 Md€ (H23 corrigé : 27,9 M à 15 h ou plus, V11772 ; ancien 29,0 M : 71,5)');
proche(s70.recettes.is, 272 * 0.30 * (1 - 0.008 * 100 * 0.05), 1e-9, 'IS 30 % : 272 × 30 % × (1 − 4 %) = 78,3 Md€');
// (2) double compte sous-indexation / impôt sur les pensions : le gain net est inférieur au gain brut
var dPub = M.solde(pPub).delta, dNet = M.solde(F(pPub, { sousIndexationNette: true })).delta;
ok(dPub - dNet > 15 && dPub - dNet < s70.postes.gainIndexation, 'sous-indexation nette : le solde baisse de 15 Md€ ou plus (impôt perdu sur les compléments) mais de moins que le gain brut (' + (dPub - dNet).toFixed(1) + ')');
var A0 = O.config({ socle: 650, forme: { mode: 'uniforme', R1: 0 }, tMax: 0.25, R0: 24000, prime: 0, sousIndexation: 0, tIS: 0.25, holdings: true, tPlat: 0.47 });
proche(M.solde(F(A0, { sousIndexationNette: true })).delta, M.solde(A0).delta, 1e-9, 'sous-indexation nette sans sous-indexation : aucun effet (voie A)');
ok(M.retraites(F(pPub, { sousIndexationNette: true })).apresMd < M.retraites(pPub).apresMd, 'sous-indexation nette : les retraités paient moins d\'impôt (assiette réduite)');
// (3) rétroaction du capital des retraités
ok(M.retraites(F(pPub, { retraitesReactions: true })).apresMd < M.retraites(pPub).apresMd - 1, 'capital des retraités : la rétroaction réduit l\'impôt perçu (de plus de 1 Md€)');
proche(M.retraites(F(pPub, { retraitesReactions: true, reactions: false })).apresMd, M.retraites(F(pPub, { reactions: false })).apresMd, 1e-9, 'capital des retraités : pas de rétroaction si reactions = false');
// (4) neutralisation des holdings : portée
var cT = M.solde(pPub).delta, cS = M.solde(F(pPub, { couvertureHoldings: 'sommet' })).delta;
ok(cT - cS > 10, 'holdings : limiter la neutralisation au dixième supérieur retire plus de 10 Md€ (' + (cT - cS).toFixed(1) + ')');
proche(M.solde(F(pPub, { holdings: false })).delta, M.solde(F(pPub, { holdings: false, couvertureHoldings: 'sommet' })).delta, 1e-9, 'holdings absentes : la portée de la neutralisation est sans effet');
// la part « imputation » des holdings est faible : presque tout le levier tient à la neutralisation des réactions
var sc0 = M.SCENARIOS.central.couverture; M.SCENARIOS.central.couverture = 0;
var dSansCouv = M.solde(pPub).delta; M.SCENARIOS.central.couverture = sc0;
var dSansHold = M.solde(F(pPub, { holdings: false })).delta;
ok(Math.abs(dCentralNote(dSansCouv, dSansHold, cT)) < 0.05, 'holdings : ≥ 95 % du levier (' + (cT - dSansHold).toFixed(1) + ' Md€) vient de la neutralisation des réactions, pas du flux imputé (' + (dSansCouv - dSansHold).toFixed(1) + ' Md€)');
function dCentralNote(sansCouv, sansHold, tot) { return (sansCouv - sansHold) / (tot - sansHold); }
// (5) résultat révisé
var bA = O.bilan(pAud);
ok(bA.soldeCentral < 80 && bA.soldeCentral > 65, 'O70 corrigé : solde central de 65 à 80 Md€ (obtenu ' + bA.soldeCentral.toFixed(1) + ' contre 135,2)');
ok(bA.soldeHaut < 0, 'O70 corrigé : le scénario haut est négatif (' + bA.soldeHaut.toFixed(1) + ')');
ok(O.bilan(F(A0, { sousIndexationNette: true, retraitesReactions: true, couvertureHoldings: 'sommet' })).soldeCentral < 0, 'voie A 650 corrigée : solde central négatif (la « marge » de 15 Md€ disparaît)');
// (6) groupes hors contraintes
var g = O.groupes(pPub), gg = {}; g.forEach(function (x) { gg[x.id] = x; });
proche(gg.chomeur.avantMois, 37.1e9 / 2.62e6 / 12, 1e-6, 'chômeur indemnisé : allocation moyenne 1 180 € (37,1 Md€ / 2,62 M / 12)');
proche(gg.chomeur.apresMois, 550, 1e-6, 'chômeur indemnisé : le socle seul (550 €)');
proche(gg.chomeur.perteMd, 2.62e6 * (37.1e9 / 2.62e6 / 12 - 550) * 12 / 1e9, 1e-6, 'chômeurs indemnisés : perte = 2,62 M × 630 € × 12 = 19,8 Md€ (calcul à la main)');
proche(gg.parentIsole.apresMois, 550 + 2 * 200, 1e-6, 'parent isolé sans emploi, 2 enfants : 550 + 2 × 200 = 950 €');
ok(gg.ret1200.ecartMois < -200 && gg.ret1500.ecartMois < -300 && gg.ret1750.ecartMois < -400, 'retraités de 1 200 à 1 750 € brut : perdent plus de 200 / 300 / 400 €/mois en O70 (hors sous-indexation)');
ok(g.reduce(function (s, x) { return s + x.perteMd; }, 0) > 40, 'groupes hors contraintes : plus de 40 Md€ de pouvoir d\'achat perdu (O70, ordre de grandeur)');
// le plancher ASPA ne protège que la pension moyenne des bénéficiaires : un retraité à 1 100 € perd plus qu'un retraité à 1 000 €
var s1100 = M.situation({ adultes: 1, enfants: 0, age: 75, retraite: true, pensionBruteMois: 1100, actuel: 1100 }, pPub).apresMois;
ok(s1100 < D.aspa.plafond - 100, 'effet de falaise : une pension de 1 100 € (au-dessus du plafond de l\'ASPA) tombe à ' + s1100.toFixed(0) + ' €, sous le plancher de 1 043,59 € garanti aux voisins');
// (7) contrainte élargie sur les retraités
ok(!O.contraintes(A0, 0.95, { perteMaxRetraites: 0.10 }).ok && O.contraintes(A0, 0.95, { perteMaxRetraites: 0.50 }).okRetraitesElargi, 'contrainte « retraités ne perdent pas plus de x % » : voie A viole 10 %, respecte 50 %');
ok(O.contraintes(A0, 0.95).okRetraitesElargi === true && O.contraintes(A0, 0.95).ok === O.contraintes(A0, 0.95, {}).ok, 'sans option, la contrainte élargie ne change rien');
// (8) balayage audité plus bas que le balayage publié ; optimum aux bords : l'extension de la grille fait monter le résultat sans limite
var rPub = O.balayer(G, 0.70), rAud = O.balayer(G, 0.70, null, { audit: true });
ok(rAud.meilleur.bilan.soldeCentral < rPub.meilleur.bilan.soldeCentral - 20, 'balayage audité (petite grille) : plus de 20 Md€ sous le balayage publié');
var GE = { socle: [300, 400, 500, 550], formes: [{ mode: 'uniforme', R1: 0 }], tMax: [0.2, 0.3], R0: [6000, 12000], prime: [200, 300, 400], sousIndexation: [0.015, 0.03, 0.05], tIS: [0.30, 0.40], holdings: [true] };
var rE = O.balayer(GE, 0.70);
ok(rE.meilleur.st.socle === 300 && rE.meilleur.st.R0 === 6000 && rE.meilleur.st.prime === 400 && rE.meilleur.st.sousIndexation === 0.05 && rE.meilleur.st.tIS === 0.40, 'grille étendue : l\'optimum se déplace aux NOUVEAUX bords (socle 300, R0 6 000, prime 400, sous-indexation 5 pts, IS 40 %) : artefact, pas un optimum');
ok(rE.meilleur.bilan.soldeCentral > 250, 'grille étendue : le solde dépasse 250 Md€ (' + rE.meilleur.bilan.soldeCentral.toFixed(0) + ') sans qu\'aucune contrainte ne mord');
// (9) R0 = 12 000 € : l'impôt continu touche les revenus modestes (contradiction avec la position de l'auteur : aucun impôt sous 24 000 € par an)
proche(M.impotContinu(23853, 0.20, 12000), 0.20 * (23853 - 12000 - 12000 * Math.log(23853 / 12000)), 1e-9, 'impôt continu du smicard (R = 23 853 €), R0 12 000 €, t_max 20 % : formule à la main');
ok(M.impotContinu(23853, 0.20, 12000) > 700 && M.impotContinu(23853, 0.20, 24000) === 0, 'R0 12 000 € : le smicard paie ≈ 722 €/an d\'impôt continu ; à R0 24 000 €, zéro');
var seuilNet = (function (P) { var lo = 1000, hi = 60000, i; for (i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (M.impot(m, P) >= 12 * P.socle + 12 * P.primeMontant) hi = m; else lo = m; } return hi; })(M.param(pPub));
ok(seuilNet < 24000 * 0.8, 'contributeur net dès ' + Math.round(seuilNet) + ' € de coût employeur par an (< 24 000 €) : le taux plat prend dès le premier euro');

// ---------- (10) Contraintes de l'auteur (resultats.md § 10) : minima, falaises, transition des chômeurs, taux combiné IS + dividende, grille bornée
var GP = O.GRILLE_PIERRE;
ok(Math.min.apply(null, GP.socle) === 600 && Math.max.apply(null, GP.socle) === 900 && GP.R0.length === 1 && GP.R0[0] === 24000 && Math.max.apply(null, GP.sousIndexation) === 0.01 && Math.min.apply(null, GP.tIS) === 0.25 && Math.max.apply(null, GP.tIS) === 0.30, 'grille de l\'auteur : socle 600-900 €, R0 = 24 000 €, sous-indexation ≤ 1 point, IS 25-30 %');
var sP = { socle: 800, forme: { mode: 'uniforme', R1: 0 }, tMax: 0.2, R0: 24000, prime: 200, sousIndexation: 0, tIS: 0.25, holdings: true, tPlat: 0.40, enfant: 200, audit: true }, pP = O.config(sP);
ok(O.config(F(sP, { enfant: 300 })).enfant === 300 && O.config(F(sP, { audit: false })).enfant === 200, 'config : la majoration enfant est transmise (200 € par défaut)');
// falaise de l'ASPA : à 1 050 € de pension, juste au-dessus du plafond (1 043,59 €), le retraité tombe sous le plancher de son voisin
var fa = O.falaises(pP), a1000 = Math.max(M.situation({ adultes: 1, enfants: 0, age: 75, retraite: true, pensionBruteMois: 1000, actuel: 0 }, pP).apresMois, D.aspa.plafond), a1050 = M.situation({ adultes: 1, enfants: 0, age: 75, retraite: true, pensionBruteMois: 1050, actuel: 0 }, pP).apresMois;
proche(fa.pension, D.aspa.plafond - a1050 > 0 ? Math.max(fa.pension, 0) : 0, 1e-9, 'falaises : cohérence interne');
ok(fa.pension > 50 && fa.pensionA === 1050 && Math.abs(fa.pension - (D.aspa.plafond - a1050)) < 1e-6, 'falaise de l\'ASPA : socle 800 €, plat 40 % : la pension de 1 050 € a ' + fa.pension.toFixed(0) + ' €/mois de moins que celle de 1 000 € (' + a1000.toFixed(0) + ' €), calcul à la main');
ok(fa.salaire < 1e-9, 'aucune falaise du côté du salaire (0 à 35 h, puis jusqu\'à 10 fois le Smic) : revenu disponible croissant');
ok(!O.verifier(pP, 0.95, { sansFalaise: 0.5 }).ok && O.verifier(pP, 0.95, { sansFalaise: 0.5 }).raison === 'falaisePension' && O.verifier(pP, 0.95, { sansFalaise: 200 }).raison !== 'falaisePension', 'verifier : la falaise de pension est détectée à 0,5 €/mois, tolérée à 200 €');
// minima : parents isolés et étudiants (« avant » ⚠️ estimés)
var vm = O.verifier(F(pP, { socle: 650 }), 0.95, { minima: true });
ok(!vm.ok && (vm.raison === 'parentIsole' || vm.raison === 'etudiant'), 'minima : un socle de 650 € fait perdre les parents isolés ou les étudiants boursiers (raison : ' + vm.raison + ')');
var gE = {}; O.groupes(O.config(F(sP, { socle: 750 }))).forEach(function (x) { gE[x.id] = x; });
ok(gE.etudiant.ecartMois >= O.TOL_MINIMA && O.groupes(O.config(F(sP, { socle: 700 }))).filter(function (x) { return x.id === 'etudiant'; })[0].ecartMois < O.TOL_MINIMA, 'minima : l\'étudiant boursier (730 €) ne perd plus à partir d\'un socle de 750 €, il perd à 700 €');
var gPI = O.groupes(O.config(F(sP, { socle: 900, enfant: 400 }))).filter(function (x) { return x.id === 'parentIsole'; })[0];
proche(gPI.apresMois, 900 + 2 * 400, 1e-6, 'minima : parent isolé, 2 enfants : socle 900 + 2 × 400 = 1 700 € (≥ 1 650 €, non perdant)');
ok(gPI.ecartMois >= O.TOL_MINIMA, 'minima : le parent isolé n\'est plus perdant avec 900 € + 400 € par enfant');
var vm2 = O.verifier(O.config(F(sP, { socle: 900, enfant: 400 })), 0.95, { minima: 'etudiant' });
ok(vm2.raison !== 'parentIsole' && vm2.raison !== 'etudiant', 'minima = \'etudiant\' ne vérifie que les étudiants');
// pensions < 2 000 € : groupe ajouté
ok(O.groupes(pP).some(function (x) { return x.id === 'ret2000'; }) && O.GROUPES.length === 7, 'groupe « retraité à 2 000 € brut » ajouté (pensions < 2 000 € non perdantes : perteMaxRetraites 0,5 %)');
// chômeurs indemnisés : transition de 2 ans, calcul à la main
var chom = O.groupes(pP).filter(function (x) { return x.id === 'chomeur'; })[0];
proche(O.transitionChomeurs(pP, 0), 2.62e6 * (chom.avantMois - 800) * 12 / 1e9, 1e-9, 'transition chômeurs, perte 0 % : 2,62 M × (1 180 − 800) € × 12 (calcul à la main)');
ok(O.transitionChomeurs(pP, 0.10) < O.transitionChomeurs(pP, 0) && O.transitionChomeurs(pP, 0.20) < O.transitionChomeurs(pP, 0.10) && O.transitionChomeurs(pP, 0.40) === 0, 'transition chômeurs : coût décroissant avec la perte tolérée (0, 10, 20 %), nul quand la perte tolérée couvre l\'écart (40 %)');
proche(O.transitionChomeurs(pP, 0.10), 2.62e6 * (0.9 * chom.avantMois - 800) * 12 / 1e9, 1e-9, 'transition chômeurs, perte 10 % : calcul à la main');
ok(!O.verifier(pP, 0.95, { chomeurStructurel: 0.20 }).ok && O.verifier(pP, 0.95, { chomeurStructurel: 0.20 }).raison === 'chomeur', 'chômeur structurel : à 800 € il perd 32 % : la contrainte de 20 % est violée (il faudrait un socle ≥ 944 €)');
// année 1 et à 10 ans
var an = O.bilanAnnees(F(pP, { sousIndexation: 0.01 }), 0.10), an0 = O.bilanAnnees(F(pP, { sousIndexation: 0 }));
proche(an0.an1.central, an0.an10.central, 1e-9, 'année 1 = année 10 sans sous-indexation');
ok(an.an1.central < an.an10.central - an.transition + 1e-9 && an.transition > 0, 'année 1 : la sous-indexation n\'a pas encore produit son effet de 10 ans, et la transition des chômeurs (' + an.transition.toFixed(1) + ' Md€) est déduite');
// taux combiné IS + dividende ≤ plafond
var GM = { socle: [900], formes: [{ mode: 'uniforme', R1: 0 }], tMax: [0.1, 0.2], R0: [24000], prime: [0], sousIndexation: [0], tIS: [0.25, 0.30], holdings: [true], enfant: [200] };
var rI = O.balayer(GM, 0.70, null, { audit: true, K: { inclureIS: true } }), vI = O.verifier(rI.meilleur.p, 0.70, { inclureIS: true });
ok(vI.combineDividende <= 0.70 + 1e-9 && vI.marginalMax <= 0.60 + 1e-9, 'IS + dividende ≤ 70 % : le taux marginal personnel est ≤ 60 % (IS 25 %) : combiné ' + (100 * vI.combineDividende).toFixed(1) + ' %');
proche(vI.combineDividende, 1 - (1 - rI.meilleur.st.tIS) * (1 - vI.marginalAsymptotique), 1e-12, 'taux combiné = 1 − (1 − t_IS)(1 − marginal) (calcul à la main)');
var rN = O.balayer(GM, 0.70, null, { audit: true, K: {} });
ok(rN.meilleur.bilan.soldeCentral > rI.meilleur.bilan.soldeCentral, 'inclure l\'IS dans le plafond coûte du solde (' + rN.meilleur.bilan.soldeCentral.toFixed(1) + ' → ' + rI.meilleur.bilan.soldeCentral.toFixed(1) + ' Md€)');
// grille de l'auteur : rien d'admissible avec la falaise stricte, admissible avec une grande tolérance ; bords signalés
var rS = O.balayer(GM, 0.70, null, { audit: true, K: { sansFalaise: 0.5 } });
ok(rS.meilleur === null && rS.nAdmissibles === 0, 'falaise stricte (0,5 €/mois) : aucune structure admissible dans la grille (socle 900 € au plus : l\'ASPA ne peut pas être sans falaise)');
ok(O.bords({ socle: 900, tMax: 0.2, R0: 24000, prime: 0, sousIndexation: 0, tIS: 0.25, enfant: 200 }, GP).indexOf('socle maximum (900)') >= 0 && O.bords({ socle: 900, tMax: 0.2, R0: 24000, prime: 0, sousIndexation: 0, tIS: 0.25, enfant: 200 }, GP).join('|').indexOf('R0') < 0, 'bords : le socle de 900 € est signalé comme bord de la grille, R0 (une seule valeur) ne l\'est pas');
// contraintes de l'auteur : le balayage ne trouve pas de solde central positif (petite grille, résultat complet : resultats.md § 10)
var GQ = { socle: [800, 900], formes: [{ mode: 'uniforme', R1: 0 }, { mode: 'exp', R1: 3000 }], tMax: [0.1, 0.3], R0: [24000], prime: [0, 200], sousIndexation: [0, 0.01], tIS: [0.25, 0.30], holdings: [true], enfant: [200, 400] };
var rP = O.balayer(GQ, 0.70, null, { audit: true, K: { inclureIS: true, minima: true, perteMaxRetraites: 0.30, sansFalaise: 200 } });
ok(rP.meilleur && rP.meilleur.bilan.soldeCentral < 0, 'contraintes de l\'auteur (petite grille) : le meilleur solde central est négatif (' + (rP.meilleur ? rP.meilleur.bilan.soldeCentral.toFixed(0) : 'aucun') + ' Md€)');

// sans taux plat : « personne ne paie sous R0 » au pied de la lettre : aucune taxe sous R0, solde très négatif
var GZ = { socle: [600], formes: [{ mode: 'lineaire', R1: 2000 }], tMax: [0.4, 0.7], R0: [24000], prime: [0], sousIndexation: [0.01], tIS: [0.30], holdings: [true], enfant: [200] };
var rZ = O.balayer(GZ, 0.70, null, { audit: true, K: { platNul: true } });
ok(rZ.meilleur && rZ.meilleur.st.tPlat === 0 && rZ.meilleur.bilan.soldeCentral < -250, 'sans taux plat (impôt continu seul, R0 = 24 000 €) : taux plat nul, solde central < −250 Md€ (' + rZ.meilleur.bilan.soldeCentral.toFixed(0) + ')');
ok(M.impotContinu(23853, 0.40, 24000) === 0 && M.impot(23853, M.param(rZ.meilleur.p)) === 0, 'sans taux plat : le smicard à 35 h (R = 23 853 € < R0) ne paie aucun impôt');

// ====================== Voie R : retraités sanctuarisés (resultats.md § 11) ======================
var DR = M.DONNEES, NR = DR.adultes - DR.retraites;
var nR = O.socleNeutreR();
proche(nR.prestationsRemplaceesMd, 117.6 - 4.6, 1e-9, 'voie R : prestations remplacées = 117,6 − 4,6 (ASPA conservée) = 113,0 Md€');
proche(nR.socle, (113.0 - 13.855e6 * 200 * 12 / 1e9) * 1e9 / (NR * 12), 1e-6, 'voie R : socle neutre = (113,0 − 33,25) Md€ / (38,726 M × 12) (calcul à la main) ≈ 172 €/mois');
proche(O.socleNeutreR({ enfant: 0 }).socle, 113.0e9 / (NR * 12), 1e-6, 'voie R : socle neutre sans majoration enfant ≈ 243 €/mois');
var pR = O.configR({ socle: 650, tMax: 0.30, tPlat: 0.40 }), sR = M.solde(F(pR, { scenario: 'central' }));
ok(pR.retraitesSanctuarises && !pR.complAspa && !pR.imposerComplements && pR.sousIndexation === 0 && pR.sousIndexationNette && pR.couvertureHoldings === 'sommet', 'voie R : drapeaux (retraités sanctuarisés, pas d\'ASPA nouveau, pas de sous-indexation, correctifs de l\'audit actifs)');
proche(sR.postes.socleAdultes, NR * 650 * 12 / 1e9, 1e-9, 'voie R : socle versé aux 38,726 M d\'adultes non retraités (302,1 Md€ à 650 €)');
ok(sR.postes.economieRetraites === 0 && sR.postes.gainIndexation === 0, 'voie R : aucune économie sur les pensions, aucune sous-indexation');
proche(sR.recettes.retraites, M.retraites(F(pR, { scenario: 'central' })).avantMd, 1e-9, 'voie R : l\'impôt des retraités est celui d\'aujourd\'hui (avantMd)');
proche(sR.postes.depensesRemplacees, 113.0, 1e-9, 'voie R : dépenses remplacées 113,0 Md€');
var sOff = M.solde(F(pR, { retraitesSanctuarises: false, scenario: 'central' }));
ok(sOff.postes.depensesRemplacees === 117.6 && Math.abs(sOff.postes.economieRetraites) > 50, 'drapeau désactivé : le modèle antérieur est inchangé (117,6 Md€ remplacés, économie sur les pensions)');
// cas types
var cR = {}; O.casR(pR).forEach(function (x) { cR[x.id] = x; });
proche(cR.retraiteModeste.ecartMois, 0, 1e-9, 'voie R : retraité modeste inchangé'); proche(cR.retraiteAise.ecartMois, 0, 1e-9, 'voie R : retraité aisé inchangé (pension et capital)');
proche(cR.chomeur.apresMois, 650, 1e-6, 'voie R : chômeur indemnisé sans complément : socle 650 € (perte de 530 € sur 1 180 €)');
proche(cR.parentIsole.apresMois, 650 + 2 * 200, 1e-6, 'voie R : parent isolé, 2 enfants : socle 650 + 2 × 200 = 1 050 € (contre 1 650 €)');
proche(cR.etudiant.apresMois, 650, 1e-6, 'voie R : étudiant : 650 € (contre 730 €)');
proche(cR.aah.ecartMois, 0, 1e-6, 'voie R : AAH maintenue (socle + complément) : écart nul');
proche(cR.rsa.apresMois, 650, 1e-6, 'voie R : personne au RSA sans plancher : 650 € (contre 877 €)');
proche(O.casR(O.configR({ socle: 650, tMax: 0.3, tPlat: 0.4, complRsa: true })).filter(function (x) { return x.id === 'rsa'; })[0].apresMois, 877, 1e-6, 'voie R avec plancher RSA : 877 €');
ok(cR.smic35.ecartMois > 0 && cR.smic15.ecartMois > 0, 'voie R : smicards à 15 h et 35 h gagnent à S = 650 €, plat 40 %');
// taux plat nécessaire
var pn = O.platNecessaireR({ socle: 650, tMax: 0.30 }, M.DONNEES.deficitActuel);
proche(O.soldeCentralR(O.configR({ socle: 650, tMax: 0.30, tPlat: pn.t })), M.DONNEES.deficitActuel, 0.01, 'voie R : au taux plat nécessaire, le solde central est égal au solde actuel (Δ = 0)');
var pn5 = O.platNecessaireR({ socle: 500, tMax: 0.30 }, M.DONNEES.deficitActuel), pn8 = O.platNecessaireR({ socle: 800, tMax: 0.30 }, M.DONNEES.deficitActuel);
ok(pn5.t < pn.t && pn.t < pn8.t, 'voie R : le taux plat nécessaire croît avec le socle (' + pn5.t.toFixed(3) + ' < ' + pn.t.toFixed(3) + ' < ' + pn8.t.toFixed(3) + ')');
var mR = O.marginalR(O.configR({ socle: 650, tMax: 0.30, tPlat: 0.40 }));
proche(mR.asymptotique, 0.70, 1e-12, 'voie R : taux marginal asymptotique = plat + t_max'); proche(mR.combineDividende, 1 - 0.75 * 0.30, 1e-12, 'voie R : taux combiné IS + dividende = 1 − 0,75 × 0,30 = 77,5 % (calcul à la main)');
// socle maximal finançable
var mxE = O.socleMaxR({}, 0.70, 'equilibre', false), mxEi = O.socleMaxR({}, 0.70, 'equilibre', true), mxN = O.socleMaxR({}, 0.70, 'neutre', false);
ok(mxE.socle > 300 && mxE.socle < 700 && mxEi.socle < mxE.socle && mxN.socle > mxE.socle, 'voie R : socle maximal : équilibre ' + Math.round(mxE.socle) + ' €, avec IS + dividende ≤ 70 % ' + Math.round(mxEi.socle) + ' €, Δ ≥ 0 ' + Math.round(mxN.socle) + ' €');
ok(O.soldeCentralR(O.configR(mxE.structure)) >= -0.5 && O.marginalR(O.configR(mxE.structure)).personnel <= 0.70 + 1e-9, 'voie R : à l\'équilibre, le solde central est ≥ 0 et le taux marginal ≤ 70 %');
ok(O.marginalR(O.configR(mxEi.structure)).combineDividende <= 0.70 + 1e-9, 'voie R : avec le plafond IS + dividende, le taux combiné est ≤ 70 %');
// chômage dégressif, calcul à la main
var dg = M.CHOMAGE_DEG.deg1;
proche(M.complementChomage(dg, 1478, 650, 2), 0.6 * (1478 - 650), 1e-9, 'chômage deg1 : mois 2, Smic : 60 % de la perte (1 478 − 650) = 496,8 €');
proche(M.complementChomage(dg, 1478, 650, 5), 0.4 * (1478 - 650), 1e-9, 'chômage deg1 : mois 5 : 40 % de la perte'); proche(M.complementChomage(dg, 1478, 650, 9), 0.2 * (1478 - 650), 1e-9, 'chômage deg1 : mois 9 : 20 %');
proche(M.complementChomage(dg, 1478, 650, 13), 0, 1e-12, 'chômage deg1 : mois 13 : 0'); proche(M.complementChomage(M.CHOMAGE_DEG.deg2, 5000, 650, 2), 0.6 * (3000 - 650), 1e-9, 'chômage deg2 : cadre à 5 000 € : perte plafonnée à 3 000 € net');
proche(M.partStockChomage(0, 24), 1, 1e-12, 'chômage : les parts du stock somment à 1');
var cc = function (id) { return M.coutChomage(M.param({ retraitesSanctuarises: true, socle: 650, chomage: id })); };
proche(cc('remplace'), 0, 1e-12, 'chômage remplacé : coût 0'); proche(cc('cumul'), 37.1, 1e-12, 'chômage en cumul : 37,1 Md€');
proche(cc('differentiel'), 2.62e6 * (37.1e9 / 2.62e6 / 12 - 650) * 12 / 1e9, 1e-9, 'chômage différentiel : 2,62 M × (1 180,2 − 650) × 12 = 16,7 Md€ (calcul à la main)');
ok(cc('remplace') < cc('deg1') && cc('deg1') < cc('deg3') && cc('deg3') < cc('differentiel') && cc('differentiel') < cc('cumul'), 'chômage : coût croissant remplacé < deg1 < deg3 < différentiel < cumul (' + [cc('deg1'), cc('deg3'), cc('differentiel')].map(function (x) { return x.toFixed(1); }).join(' ; ') + ' Md€)');
proche(cc('deg1'), 2.62e6 * (0.6 * M.partStockChomage(0, 3) + 0.4 * M.partStockChomage(3, 6) + 0.2 * M.partStockChomage(6, 12)) * (37.1e9 / 2.62e6 / 12 / 0.72 - 650) * 12 / 1e9, 1e-9, 'chômage deg1 : coût = n × part moyenne × perte moyenne × 12 (calcul à la main)');
var chR = O.chomageR(650);
ok(chR.length === 6 && chR[0].gainRecettesRetroactionMd > chR[1].gainRecettesRetroactionMd && chR[4].gainRecettesRetroactionMd === 0, 'chômage : la rétroaction sur la durée est la plus forte pour le socle seul, nulle quand l\'allocation actuelle est maintenue');
var dcost = O.evaluerR({ socle: 650, tMax: 0.30, tPlat: 0.40, chomage: 'deg1' }).bilan.soldeCentral - O.evaluerR({ socle: 650, tMax: 0.30, tPlat: 0.40, chomage: 'remplace' }).bilan.soldeCentral;
proche(dcost, -cc('deg1'), 1e-9, 'chômage deg1 : le coût se retranche exactement du solde public');
// pas d'effet sur les voies existantes : solde de la voie A inchangé
proche(O.bilan(F(V.voieA(650, 0.75), { tPlat: 0.47, tMax: 0.25 })).soldeCentral, b.soldeCentral, 1e-9, 'voie A : solde central inchangé par l\'ajout de la voie R');

log('\n' + n + ' contrôles au vert (optimisation)');
