// Tests de la couche DECISIONS0711 (decisions_0711.js, système arrêté du 07/11/2026). Liste de rapport_consolidation_0611.js sans le rapport, puis decisions_0711.js et ce fichier (jsc).
var D = this.Decisions0711, K = this.Consolidation0611, R = this.RetraitesAisees0611;
var log = (typeof print === 'function') ? print : console.log, n = 0;
function ok(c, m) { if (!c) throw new Error('ECHEC : ' + m); n++; log('ok  ' + m); }
function proche(a, b, tol, m) { ok(Math.abs(a - b) <= tol, m + ' (obtenu ' + a + ', attendu ' + b + ' ± ' + tol + ')'); }

// 1. Courbe des pensions
var o = D.courbe().o;
ok(D.Cp(o.Pg, o) === 0 && D.Cp(1200, o) === 0 && D.Cp(o.Pg - 1, o) === 0, 'garantie de non-perte : rien au seuil ni en dessous');
proche(D.marginalP(o.Pg + 1e-6, o), 0, 1e-6, 'marginal nul au seuil (pas de marche)');
ok(D.marginalP(1e6, o) < o.m + 1e-12 && D.marginalP(1e6, o) > o.m - 1e-6, 'marginal borné par m_p (asymptote)');
var croissant = true; for (var P = o.Pg; P < 20000; P += 250) if (D.marginalP(P + 250, o) < D.marginalP(P, o)) croissant = false; ok(croissant, 'marginal croissant (forme de la fonction des revenus)');
proche(D.recettePension(o, 1).net, R.recette({ seuil: 2500, taux: 0.2, capital: false }, 1).net, 1e-6, 'calibrage : même recette que la contribution de 20 % sur la pension seule');
ok(D.recettePension(o, 0).net >= D.recettePension(o, 1).net && D.recettePension(o, 1).net >= D.recettePension(o, 2).net, 'courbe : favorable >= central >= défavorable');
proche(D.recettePension(o, 1).partConcernes, 1 - R.partSous(o.Pg), 1e-9, 'concernés = retraités au-dessus du seuil de garantie');
[1200, 1500, 2000].forEach(function (p) { ok(D.casRetraite(p, o).ecartNet === D.casRetraite(p, null).ecartNet && D.casRetraite(p, o).ecartNet > 0, 'retraité à ' + p + ' € : ne perd rien à cause de la courbe et gagne en revenu net santé'); });
ok(D.casRetraite(4000, o).courbe < D.casRetraite(4000, o).contribution20, 'à 4 000 €, la courbe prend moins que la contribution forfaitaire');
ok(D.casRetraite(10000, o).courbe > D.casRetraite(10000, o).contribution20, 'à 10 000 €, la courbe prend plus que la contribution forfaitaire');
ok(D.marginalCapitalRetraite(10000) <= 0.66, 'capital d\'un retraité aisé : marginal de la fonction des revenus seulement (pas de prélèvement confiscatoire)');
ok(D.pensionBascule(o) > 3000 && D.pensionBascule(o) < 3500, 'on ne commence à perdre (R1f et mutuelle comptés) qu\'au-dessus de 3 000 €');
// 2. TVA
var t = D.tva();
ok(t.lignes.every(function (l) { return l.v[0] >= l.v[1] - 1e-12 && l.v[1] >= l.v[2] - 1e-12; }), 'TVA : favorable >= central >= défavorable');
proche(t.lignes[0].zero[1], -6.6, 0.2, 'le 0 % sur l\'alimentation recalculé ≈ −6,6 Md€ (resultats.md de la fiscalité d\'orientation, réactions centrales) ; ici réactions fortes');
ok(t.total[1] > 6 && t.total[1] < 8, 'recette de la grille 5 % par rapport au 0 % entre 6 et 8 Md€ (estimée ≈ 7)');
ok(t.totalActuel[1] < 0 && t.totalActuel[1] > -1.5, 'par rapport au droit actuel, la grille rend un peu (5 % < 5,5 %)');
proche(D.changementTva(100, 0.055, 0.055, 0.5).net, 0, 1e-12, 'TVA : taux inchangé = effet nul');
D.tvaCasTypes().forEach(function (c) { ok(c.vsActuel < 0 && c.vsZero > 0 && c.vsZero < 30, 'TVA ' + c.id + ' : paie moins qu\'aujourd\'hui, un peu plus qu\'avec le 0 % (moins de 30 €/mois)'); });
// 3. Lignes et S3
['gtc_droite', 'a', 'b', 'c'].forEach(function (v) { var s = D.somme(D.lignes(v)); ok(s[0] >= s[1] && s[1] >= s[2], 'couche ' + v + ' : favorable >= central >= défavorable'); });
var g = D.HYP.gt;
proche(D.somme(D.gtLignes('c', true))[1], -(37.1 - 12.5605) - 7.762246690511726 - 7.771734999999999 - (1 + 0.3289786564478636), 1e-4, 'garantie (c), avec reprise : la couche GT0711 (−41,4) est retrouvée');
proche(D.gtLignes('a')[0].v[1], 0, 1e-6, 'garantie (a) : supplément = budget du modèle');
proche(D.gtLignes('b')[0].v[1], 12.5605 - 25, 1e-9, 'garantie (b) : 25 Md€');
proche(D.gtLignes('a')[3].v[1], -1.329, 0.001, 'pont : ≈ 1,3 Md€ dans les trois');
ok(D.HYP.defaut === 'gtc_droite' && D.s3().v === 'gtc_droite', 'valeur par défaut : variante coût constant en ligne droite (arbitrage 68)');
var G = D.gtLignes('gtc_droite');
proche(G[0].v[1], -2.96, 0.01, 'gtc_droite : garantie −2,96 Md€ au central');
proche(G[3].v[1], -1.27, 0.01, 'gtc_droite : pont −1,27 Md€');
proche(G[2].v[1], -0.07, 0.01, 'gtc_droite : arrêts maladie −0,07 Md€');
ok(G[1].v.every(function (x) { return x === 0; }), 'gtc_droite : comportement non compté dans le chiffrage de référence');
proche(D.somme(G)[1], -2.96 - 1.27 - 0.07, 0.01, 'gtc_droite : effet total −4,30 Md€ au central, sans comportement');
ok(G[0].v[0] >= G[0].v[1] && G[0].v[1] >= G[0].v[2], 'gtc_droite : favorable >= central >= défavorable');
var sg = D.s3('gtc_droite'), sgs = D.s3('gtc_droite', { extra: D.HYP.gt.gtc_droite.comportement[1] });
ok(sg.F < D.s3('c').F && sg.F > D.s3('a').F && sgs.F < sg.F, 'gtc_droite : moins de leviers que (c), plus que (a) ; le comportement compté en demande moins');
var sa = D.s3('a'), sb = D.s3('b'), sc = D.s3('c');
ok(sa.F < sb.F && sb.F < sc.F && sa.a < sb.a && sb.a < sc.a, 'plus la garantie coûte, plus il faut de leviers');
[sg, sa, sb, sc].forEach(function (s) { var i0 = 9, okS = true; for (var i = i0 + 1; i < 30; i++) if (s.traj.ratio[i] > s.traj.ratio[i0] + 1e-6) okS = false; ok(okS && s.picAn <= 2038, 'S3 ' + s.v + ' : dette stable à partir de 2038 (macro de référence)'); });
proche(sa.F - sa.revenus - sa.credit - sa.transmissions - sa.patrimoineNat - sa.pension - sa.eco, 0, 1e-6, 'F = somme des leviers');
var old = K.s3(); proche(sa.F - old.F, -sa.effetCouche, 0.3, 'S3 (a) : les leviers totaux ne dépendent que de la base et de la couche (F du 06/11 + effet de la couche)');
ok(sg.cas.smic_seul.ecartNet > 0 && sg.cas.couple_2smic_2enf.ecartNet > 0, 'gtc_droite : Smic et couple à deux Smic avec deux enfants gagnent');
ok(sa.cas.smic_seul.ecartNet > 0 && sb.cas.smic_seul.ecartNet > 0 && sc.cas.smic_seul.ecartNet > 0, 'le Smic gagne dans les trois budgets');
ok(sa.cas.couple_2smic_2enf.ecartNet > 0 && sb.cas.couple_2smic_2enf.ecartNet > 0 && sc.cas.couple_2smic_2enf.ecartNet > 0, 'le couple à deux Smic avec deux enfants gagne dans les trois budgets');
log('Tests : ' + n + ' vérifications passées.');
