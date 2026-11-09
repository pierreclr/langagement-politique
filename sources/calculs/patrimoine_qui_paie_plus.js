// sources/calculs/patrimoine_qui_paie_plus.js — qui paie plus, qui paie moins, par tranche de patrimoine net (06/11/2026).
// Réutilise le modèle v7.4 B (decisions_0611_v74.js, taxe_patrimoine.js). Lancer depuis modeles/systeme-ideal/ avec jsc (en zsh, liste en tableau) :
//   LIST=(modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js deces_realisation.js dvf_patrimoine.js \
//     patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js \
//     ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js ../capital-de-depart/modele.js ../capital-de-depart/continu.js optimum.js optimum_options_0411.js ../risques/stress.js \
//     decisions_0511.js decisions_0511b.js decisions_0511c.js grandes_fortunes_0511.js decisions_0511d.js ../retraites/modele.js ../retraites/age_libre.js decisions_0511e.js decisions_0511f.js \
//     ../fiscalite-orientation/modele.js decisions_0511g.js decisions_0511h.js diagnostic_couple_smic.js hauts_revenus.js decisions_0511i.js decisions_0511j.js variante_dette_stable.js \
//     bareme_unique_v6.js bareme_deux_fonctions_v7.js bareme_v71.js decisions_0611_v72.js decisions_0611_v73.js decisions_0611_v74.js ../../sources/calculs/patrimoine_qui_paie_plus.js)
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc $LIST > ../../sources/calculs/patrimoine_qui_paie_plus_resultats.txt
// Ne modifie aucun module. Hypothèses numérotées HQ1 à HQ12 (voir sources/patrimoine-qui-paie-plus.md). Euros 2024-2026, Md€/an pour les masses, €/an par ménage.
(function () {
  var A = this.Decisions0611V74, TP = this.TaxePatrimoine, Z = this.Decisions0611V73;
  var log = (typeof print === 'function') ? print : console.log;
  var r = A.HYP.patrimoine.recalage, NM = 30.9e6, ad = A.HYP.adultes, b = A.sched(), PHI = TP.PHI, H = TP.HVP, PAR = TP.PARAM.central;
  // ---------- données sourcées (Md€, 2024) et hypothèses
  var S = { tfMen: 26.202, tfEnt: 16.738, dmto: 17.199, dmtg: 20.819, ifi: 2.682,                    // Insee 3.217 (recettes.csv) ; DMTO : 17,199 « droits d'enregistrement » (dont DMTO 14,742)
            csgCap: 17.6, psCap: 14.991,                                                              // CSG capital : DREES 2024 ; prélèvement de solidarité : PLF 2026 V&M ligne 1427
            loyers: 40.9, interets: 71.7, dividendes: 74.9, av: 67.5, pv: 25.6, actifsFin: 7096, patNet: 14953 };
  var HQ = { rendFinNat: (S.interets + S.dividendes + S.av) / S.actifsFin, rendFin: 0,
             partDiv: S.dividendes / (S.interets + S.dividendes + S.av),       // HQ2 : 35 % du revenu financier = dividendes (crédit d'IS 25 % dans le nouveau système)
             partAV: S.av / (S.interets + S.dividendes + S.av),                // HQ3 : 31,5 % = assurance-vie (IR seulement au rachat : non compté dans l'IR annuel de l'ancien système)
             rendLoc: PAR.rendementLocatif,                                    // HQ4 : loyers nets de charges et de taxe foncière : 2,0 %
             ps: 0.172, ir: 0.128, crdsPart: 0.5 / 9.2 };
  var PS_CIBLE = S.csgCap + S.psCap + S.csgCap * HQ.crdsPart;                // CSG + prélèvement de solidarité + CRDS (estimée au prorata des taux 0,5/9,2)
  function tmi(yAn) { return yAn <= 11600 ? 0 : yAn <= 29579 ? 0.11 : yAn <= 84577 ? 0.30 : yAn <= 181917 ? 0.41 : 0.45; }   // CGI 197 (barème 2026, chapitre9-etat-des-preuves.md)
  // ---------- loi jointe revenu × patrimoine (copie de decisions_0611_v74.js § 2 : non exportée)
  function brutQ(p) { var s = H.seuils, i; if (p >= 0.95) return s[10][1] * Math.pow(0.05 / (1 - p), 1 / H.alphaPareto);
    for (i = 1; i < s.length; i++) if (p <= s[i][0]) return s[i - 1][1] + (s[i][1] - s[i - 1][1]) * (p - s[i - 1][0]) / (s[i][0] - s[i - 1][0]); return s[10][1]; }
  function Fbrut(x) { if (x <= 0) return 0; var lo = 0, hi = 1 - 1e-12, k; for (k = 0; k < 60; k++) { var m = (lo + hi) / 2; if (brutQ(m) < x) lo = m; else hi = m; } return (lo + hi) / 2; }
  function densite(x) { if (x <= 0) return 0; var e = 0.01; return (Fbrut(x * (1 + e)) - Fbrut(x * (1 - e))) / (2 * e * x); }
  var qm = H.quartilesNiveauVie, moy = (qm[0] + qm[1] + qm[2] + qm[3]) / 4;
  function poids(W) { var w = qm.map(function (m) { var c = m / moy; return densite(W / c) / c; }), s = w[0] + w[1] + w[2] + w[3]; return s > 0 ? w.map(function (x) { return x / s; }) : [0.25, 0.25, 0.25, 0.25]; }
  function tr(p) { for (var i = 0; i < H.tranches.length; i++) if (p < H.tranches[i][0]) return i; return H.tranches.length - 1; }
  // ---------- grille de quantiles : 4 000 cellules jusqu'à P99, puis 700 cellules à pas géométrique jusqu'à 1 − 1e-6 (queue de Pareto)
  var cells = [], i, n1 = 4000, n2 = 700;
  for (i = 0; i < n1; i++) cells.push({ p: 0.99 * (i + 0.5) / n1, dp: 0.99 / n1 });
  var q0 = 0.01, q1 = 1e-6, lg = Math.log(q0 / q1);
  for (i = 0; i < n2; i++) { var a = q0 * Math.exp(-lg * i / n2), c = q0 * Math.exp(-lg * (i + 1) / n2); cells.push({ p: 1 - Math.sqrt(a * c), dp: a - c }); }
  var dpTot = cells.reduce(function (s, x) { return s + x.dp; }, 0); cells.forEach(function (x) { x.dp /= dpTot; });   // masse résiduelle (queue au-delà de 1 − 1e-6) répartie : < 1e-6
  cells.forEach(function (x) {
    var W = brutQ(x.p), k = tr(x.p), t = H.tranches[k];
    x.k = k; x.W = W; x.immoG = r * W * t[1] / 100; x.fin = r * W * t[2] / 100; x.pro = r * W * t[3] / 100; x.emp = r * W * t[5] / 100;
    x.net = r * W * (1 - t[5] / 100); x.wq = poids(W);
  });
  // PV réalisées (25,6 Md€) réparties au prorata des actions + biens professionnels (HQ5)
  var baseActions = 0; cells.forEach(function (x) { x.act = x.pro + PHI[x.k] * x.fin; baseActions += x.act * x.dp * NM; });
  var cPV = S.pv * 1e9 / baseActions;
  // HQ1 corrigé : l'enquête HVP (×1,4) ne reconstitue que 3 683 Md€ d'actifs financiers contre 7 096 aux comptes nationaux ; les 214,1 Md€ de revenus financiers (intérêts + dividendes + assurance-vie) sont donc répartis au prorata du patrimoine financier de l'enquête
  var fT0 = 0; cells.forEach(function (x) { fT0 += x.fin * x.dp * NM; }); HQ.rendFin = (S.interets + S.dividendes + S.av) * 1e9 / fT0;
  // ---------- évaluation d'un ménage : ancien et nouveau système (€/an). wq : poids des quartiles de revenu d'activité.
  function evalHH(h, E) {
    var im = Math.max(0, h.immoG - h.emp), mo = Math.max(0, h.pro + PHI[h.k] * h.fin + Math.min(0, h.immoG - h.emp)), rp = (h.rp !== undefined ? h.rp : A.HYP.partRP[h.k] * im), loc = im - rp;
    if (h.rp !== undefined) { im = h.rp + h.loc; mo = h.mo; loc = h.loc; }
    var Wt = im + mo, Amob = (h.Amob !== undefined ? h.Amob : PHI[h.k] * h.fin);
    var rF = h.finRate || HQ.rendFin, finInc = rF * h.fin, loy = HQ.rendLoc * loc, pv = (h.pv !== undefined ? h.pv : cPV * h.act), wqs = h.wq || [1], revs = h.rev || A.HYP.revenusQuartiles;
    if (h.finInc !== undefined) finInc = h.finInc;
    var out = { W: Wt, net: h.net, tf: 0, dmto: 0, ifi: 0, dmtg: 0, psir: 0, P: 0, Pp: 0, paye: 0, differe: 0, levy: 0, ck: 0 };
    // ----- ancien système : stock et transmissions (HQ6 : TF et DMTO au prorata de l'immobilier brut, calés sur les totaux)
    out.tf = E.tfRate * (h.immoGtf !== undefined ? h.immoGtf : h.immoG); out.dmto = E.dmtoRate * (h.immoGtf !== undefined ? h.immoGtf : h.immoG);
    out.ifi = (h.ifiBase !== undefined ? h.ifiBase : (im - 0.3 * rp)) > 1.3e6 ? Z.ifi(h.ifiBase !== undefined ? h.ifiBase : (im - 0.3 * rp)) : 0;
    if (!h.exactIfi) out.ifi *= E.ifiScale;
    out.dmtg = E.dmtgRate * Math.max(0, h.net - E.dmtgSeuil);
    // ----- ancien système : revenus du capital (PS 17,2 % ; IR 12,8 % hors assurance-vie ; foncier au barème ; PV à 30 %)
    var finImp = rF * Math.max(0, h.fin - E.exempt);
    if (h.finInc !== undefined) finImp = h.finInc;   // dividendes distribués fixés (chef d'entreprise) : tout imposé
    var tmiLab = 0; wqs.forEach(function (w, q) { tmiLab += w * tmi(12 * (revs[q] + (finInc + loy + pv) / 12) / ad); });
    out.psir = HQ.ps * (finImp + loy + pv) + HQ.ir * (finImp * (1 - (h.noAV ? 0 : HQ.partAV)) + pv) + tmiLab * loy;
    // ----- nouveau système : taxe du patrimoine v7.4 B (impôt plancher, paiement plafonné, différé) et revenus du capital dans la fonction des revenus
    var P = A.Tp(Wt), dMob = A.HYP.plancher.dMob.central, ycapM = (PAR.rendementLocatif * loc + dMob * mo) / 12;
    var div = (h.divShare !== undefined ? h.divShare : HQ.partDiv) * finInc, autres = loy + (finInc - div) + pv, brutD = div / 0.75;
    wqs.forEach(function (w, q) {
      if (w <= 0) return;
      var yl = revs[q], y = yl + ycapM, t = ad * (b.T(y / ad) - b.S), ck = A.HYP.plancher.alpha * 12 * Math.max(0, t) * ycapM / y, N = y - t;
      var Pp = Math.max(0, P - ck), pay = A.paiement(Pp, 12 * N, Amob);
      out.P += w * P; out.Pp += w * Pp; out.paye += w * pay.paye; out.differe += w * pay.differe; out.ck += w * ck;
      var yc = (autres + brutD) / 12, inc = ad * (b.T((yl + yc) / ad) - b.T(yl / ad)) * 12 - (brutD - div);   // prélèvement attribuable au capital, net du crédit d'IS
      out.levy += w * inc;
    });
    return out;
  }
  // ---------- calibrages : TF, DMTO, DMTG au prorata ; seuil d'exemption de l'épargne réglementée E (HQ7) pour retrouver CSG + PS capital
  var sumImmoG = 0, sumNetAbove = 0; cells.forEach(function (x) { sumImmoG += x.immoG * x.dp * NM; });
  var E = { tfRate: S.tfMen * 1e9 / sumImmoG, dmtoRate: S.dmto * 1e9 / sumImmoG, dmtgSeuil: 100000, dmtgRate: 0, exempt: 0 };
  cells.forEach(function (x) { sumNetAbove += Math.max(0, x.net - E.dmtgSeuil) * x.dp * NM; }); E.dmtgRate = S.dmtg * 1e9 / sumNetAbove;
  function psTotal(ex) { var s = 0; cells.forEach(function (x) { var finImp = HQ.rendFin * Math.max(0, x.fin - ex), im = Math.max(0, x.immoG - x.emp), loc = im - A.HYP.partRP[x.k] * im;
      s += x.dp * NM * HQ.ps * (finImp + HQ.rendLoc * loc + cPV * x.act); }); return s / 1e9; }
  var ifiRaw = 0; cells.forEach(function (x) { var im = Math.max(0, x.immoG - x.emp), bs = im - 0.3 * A.HYP.partRP[x.k] * im; ifiRaw += x.dp * NM * (bs > 1.3e6 ? Z.ifi(bs) : 0); }); E.ifiScale = S.ifi * 1e9 / ifiRaw;   // HQ8 : le modèle surestime l'IFI (holdings, abattements, dettes) : calé sur 2,682 Md€
  var lo = 0, hi = 5e6, it; for (it = 0; it < 50; it++) { var mid = (lo + hi) / 2; if (psTotal(mid) > PS_CIBLE) lo = mid; else hi = mid; } E.exempt = (lo + hi) / 2;
  // ---------- passe sur la population : tranches de patrimoine net
  var BORNES = [0, 1e4, 1e5, 3e5, 1e6, 5e6, 2e7, 1e8, 1e18], NOMS = ['< 10 k€', '10-100 k€', '100-300 k€', '300 k€-1 M€', '1-5 M€', '5-20 M€', '20-100 M€', '> 100 M€'];
  var T = NOMS.map(function () { return { n: 0, net: 0, tf: 0, dmto: 0, ifi: 0, dmtg: 0, psir: 0, P: 0, Pp: 0, paye: 0, differe: 0, levy: 0, W: 0 }; }), TOT = { n: 0, net: 0, tf: 0, dmto: 0, ifi: 0, dmtg: 0, psir: 0, P: 0, Pp: 0, paye: 0, differe: 0, levy: 0, W: 0 };
  cells.forEach(function (x) {
    var e = evalHH(x, E), j = 0; while (x.net >= BORNES[j + 1]) j++;
    var w = x.dp * NM;
    [T[j], TOT].forEach(function (a) { a.n += w; a.net += w * x.net; a.W += w * e.W; ['tf', 'dmto', 'ifi', 'dmtg', 'psir', 'P', 'Pp', 'paye', 'differe', 'levy'].forEach(function (k) { a[k] += w * e[k]; }); });
  });
  function f0(v) { return Math.round(v).toLocaleString('fr-FR'); }
  function md(v) { return (v / 1e9).toFixed(2); }
  function pct(v) { return (100 * v).toFixed(2) + ' %'; }
  log('=== CALAGES ===');
  log('Ménages : ' + (NM / 1e6) + ' M ; recalage HVP → comptes nationaux ×' + r + ' ; patrimoine net reconstitué ' + md(TOT.net) + ' Md€ (Insee 2024 : ' + S.patNet + ')');
  log('Taux TF ménages (calé) ' + pct(E.tfRate) + ' de l\'immobilier brut ; DMTO ' + pct(E.dmtoRate) + ' ; DMTG ' + pct(E.dmtgRate) + ' au-dessus de 100 k€ de patrimoine net');
  log('Seuil d\'exemption d\'épargne (calé, HQ7) E = ' + f0(E.exempt) + ' € de patrimoine financier par ménage ; cible PS = ' + PS_CIBLE.toFixed(2) + ' Md€');
  var fT=0,lT=0,pT=0; cells.forEach(function(x){var im=Math.max(0,x.immoG-x.emp),loc=im-A.HYP.partRP[x.k]*im;fT+=x.fin*x.dp*NM;lT+=loc*x.dp*NM;pT+=cPV*x.act*x.dp*NM;});
  log('Bases : actifs financiers ' + md(fT) + ' Md€ ; revenus financiers ' + md(HQ.rendFin*fT) + ' ; locatif hors RP ' + md(lT) + ' Md€ ; loyers nets ' + md(HQ.rendLoc*lT) + ' ; PV ' + md(pT) + ' ; PS à E=0 : ' + psTotal(0).toFixed(2));
  log('Total modèle ancien : TF ' + md(TOT.tf) + ' ; DMTO ' + md(TOT.dmto) + ' ; IFI ' + md(TOT.ifi) + ' (Insee ' + S.ifi + ') ; DMTG ' + md(TOT.dmtg));
  log('Taxe du patrimoine v7.4 B, statique, sans comportement : dû brut avant plancher ' + md(TOT.P) + ' ; après plancher ' + md(TOT.Pp) + ' ; payé ' + md(TOT.paye) + ' ; différé ' + md(TOT.differe) + ' (bilan : 54,52 net dont 12,43 différés)');
  log('Revenus du capital, nouveau : prélèvement attribuable ' + md(TOT.levy) + ' ; ancien (PS + IR estimés) ' + md(TOT.psir));
  log('\n=== TRANCHES (€ par ménage et par an ; % du patrimoine net moyen de la tranche) ===');
  log('tranche | ménages (M) | part ménages | patrimoine net moyen | ANCIEN stock (TF+DMTO+IFI) | ANCIEN transmissions DMTG | ANCIEN revenus capital | ANCIEN total | NOUVEAU taxe patrimoine (dû P\') dont différé | NOUVEAU revenus capital | NOUVEAU total | écart € | écart % patrimoine');
  var rows = [];
  T.concat([TOT]).forEach(function (a, j) {
    var nm = j < NOMS.length ? NOMS[j] : 'ENSEMBLE', m = function (k) { return a[k] / a.n; }, netM = a.net / a.n;
    var oldStock = m('tf') + m('dmto') + m('ifi'), oldAll = oldStock + m('dmtg') + m('psir'), newAll = m('Pp') + m('levy') + m('dmtg'), ecart = newAll - oldAll;
    rows.push({ nm: nm, n: a.n, netM: netM, oldStock: oldStock, dmtg: m('dmtg'), oldCap: m('psir'), oldAll: oldAll, newP: m('Pp'), diff: m('differe'), newCap: m('levy'), newAll: newAll, ecart: ecart });
    log(nm + ' | ' + (a.n / 1e6).toFixed(3) + ' | ' + pct(a.n / NM) + ' | ' + f0(netM) + ' | ' + f0(oldStock) + ' | ' + f0(m('dmtg')) + ' | ' + f0(m('psir')) + ' | ' + f0(oldAll) + ' (' + pct(oldAll / netM) + ') | ' + f0(m('Pp')) + ' dont différé ' + f0(m('differe')) + ' | ' + f0(m('levy')) + ' | ' + f0(newAll) + ' (' + pct(newAll / netM) + ') | ' + f0(ecart) + ' | ' + (100 * ecart / netM).toFixed(2) + ' pt');
  });
  var K = 54.52 / TOT.Pp * 1e9, KD = 12.43 / TOT.differe * 1e9;   // HQ9 : calage uniforme du dû P' statique sur la recette nette du bilan (54,52 Md€) ; différé sur 12,43
  log('\n=== NOUVEAU « CALÉ » : dû P\' × ' + (54.52 * 1e9 / TOT.Pp / 1e0 * 1).toFixed(3) + ' (recette nette 54,52 ; comportement, effet de prix, exil, gestion) ===');
  log('tranche | taxe patrimoine calée € | dont différé € | nouveau total calé € | % patrimoine | écart avec ancien € | écart % patrimoine');
  T.concat([TOT]).forEach(function (a, j) {
    var nm = j < NOMS.length ? NOMS[j] : 'ENSEMBLE', m = function (k) { return a[k] / a.n; }, netM = a.net / a.n, kk = 54.52e9 / TOT.Pp, kd = 12.43e9 / TOT.differe;
    var oldAll = m('tf') + m('dmto') + m('ifi') + m('dmtg') + m('psir'), newAll = kk * m('Pp') + m('levy') + m('dmtg');
    log(nm + ' | ' + f0(kk * m('Pp')) + ' | ' + f0(kd * m('differe')) + ' | ' + f0(newAll) + ' | ' + pct(newAll / netM) + ' | ' + f0(newAll - oldAll) + ' | ' + (100 * (newAll - oldAll) / netM).toFixed(2) + ' pt');
  });
  log('\n=== MASSES (Md€/an) PAR TRANCHE ===');
  log('tranche | ancien stock | ancien DMTG | ancien capital | ancien total | nouveau taxe patrimoine | nouveau capital | nouveau total | écart');
  T.concat([TOT]).forEach(function (a, j) {
    var nm = j < NOMS.length ? NOMS[j] : 'ENSEMBLE', os = a.tf + a.dmto + a.ifi, oa = os + a.dmtg + a.psir, na = a.Pp + a.levy + a.dmtg;
    log(nm + ' | ' + md(os) + ' | ' + md(a.dmtg) + ' | ' + md(a.psir) + ' | ' + md(oa) + ' | ' + md(a.Pp) + ' | ' + md(a.levy) + ' | ' + md(na) + ' | ' + md(na - oa));
  });
  // ---------- cas types
  log('\n=== CAS TYPES (€/an) ===');
  var CAS = [
    { id: 'locataire sans patrimoine (2 700 €/mois, 5 000 € d\'épargne)', h: { k: 0, immoG: 0, emp: 0, fin: 5000, pro: 0, net: 5000, act: 0, pv: 0, rev: [2700] , wq: [1] }, },
    { id: 'propriétaire de sa RP de 300 k€ (3 700 €/mois, 30 k€ d\'épargne)', h: { k: 6, immoG: 3e5, emp: 0, fin: 30000, pro: 0, net: 3.3e5, act: 0, pv: 0, rev: [3700], wq: [1], rp: 3e5, loc: 0, mo: 0, Amob: 0 } },
    { id: 'cadre avec 1 M€ (6 500 €/mois ; RP 500 k€, AV et actions 500 k€)', h: { k: 9, immoG: 5e5, emp: 0, fin: 5e5, pro: 0, net: 1e6, act: 1.25e5, pv: 0.01 * 1.25e5, rev: [6500], wq: [1], rp: 5e5, loc: 0, mo: 1.25e5, Amob: 1.25e5 } },
    { id: 'héritier avec 20 M€ (2 000 €/mois d\'activité ; RP 2 M€, locatif 6 M€, titres 12 M€)', h: { k: 11, immoG: 8e6, emp: 0, fin: 1.2e7, pro: 0, net: 2e7, act: 1.2e7, pv: 0.01 * 1.2e7, rev: [2000], wq: [1], rp: 2e6, loc: 6e6, mo: 1.2e7, Amob: 1.2e7 } },
    { id: 'chef d\'entreprise avec 100 M€ de titres (10 000 €/mois ; RP 2 M€ ; société à valeur de rendement 93,75 M€ ; dividendes nets 1,5 M€/an ; pas d\'IFI : biens professionnels)', h: { k: 11, immoG: 2e6, emp: 0, fin: 0, pro: 1e8, net: 1.02e8, act: 0, pv: 0, rev: [10000], wq: [1], rp: 2e6, loc: 0, mo: 9.375e7, Amob: 0, finInc: 1.5e6, divShare: 1, noAV: true, ifiBase: 0.7 * 2e6 } }
  ];
  CAS.forEach(function (c) {
    c.h.act = c.h.act || 0; var h = c.h; h.exactIfi = true; if (h.finInc === undefined) h.finRate = HQ.rendFinNat; h.immoGtf = h.immoG;
    var e = evalHH(h, E), oldS = e.tf + e.dmto + e.ifi, oldAll = oldS + e.psir, newAll = e.Pp + e.levy;
    log(c.id + '\n   ANCIEN : TF ' + f0(e.tf) + ' + DMTO ' + f0(e.dmto) + ' + IFI ' + f0(e.ifi) + ' = stock ' + f0(oldS) + ' ; revenus du capital (PS+IR) ' + f0(e.psir) + ' ; total ' + f0(oldAll) + ' (' + pct(oldAll / h.net) + ' du patrimoine net)'
      + '\n   NOUVEAU : dû brut ' + f0(e.P) + ', déduit par le plancher ' + f0(e.ck) + ', dû ' + f0(e.Pp) + ' (payé ' + f0(e.paye) + ', différé ' + f0(e.differe) + ') ; revenus du capital dans la fonction ' + f0(e.levy) + ' ; total ' + f0(newAll) + ' (' + pct(newAll / h.net) + ') ; écart ' + f0(newAll - oldAll));
  });
}).call(this);
