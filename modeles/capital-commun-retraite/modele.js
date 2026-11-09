// Capital commun et retraite (chantier 10, boucle « meilleur système », 03/11/2026).
// Fonctions pures, euros constants 2025, Md€. Lancer : jsc modele.js test.js  puis  jsc modele.js rapport.js
// Voir methode.md pour les hypothèses H1-H30.
var CCR = (function () {
  var BASE = {
    t0: 2027, pib2025: 2994, partRetraite2025: 0.141, partRetraite2070: 0.153, // COR 2026 (14,1 % -> 15,3 % du PIB)
    carriere: 40, retraite: 22, montee: 10,
    gw: 0.007,            // croissance du salaire individuel (productivité COR 0,7 %/an)
    rr2060: 0.474,        // pension moyenne / revenu d'activité 2060, interpolation COR (54,6 % en 2025, 45,3 % en 2070)
    tauxCotisation: 0.278, // OCDE, repris de T48
    dette: 0.015,         // taux réel de la dette de transition (H12, choix de Claude)
    ecartRentePrudence: 1.0, // points : le fonds sert la rente à r - 1 (H9)
    sigma: 0.12
  };
  var SCEN = {
    bas:     { r: 0.020,  rho: 0.012, sigma: 0.14, nom: 'bas (défavorable à la capitalisation)' },
    central: { r: 0.035,  rho: 0.006, sigma: 0.12, nom: 'central' },
    haut:    { r: 0.0434, rho: 0.003, sigma: 0.11, nom: 'haut (rendement NBIM, répartition faible)' }
  };
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function params(p) {
    p = p || {};
    var sc = SCEN[p.scenario || 'central'];
    return merge(merge(BASE, sc), p);
  }
  function facteurRente(x, D) { return Math.abs(x) < 1e-12 ? D : (1 - Math.pow(1 + x, -D)) / x; }
  function pib(y, q) { return q.pib2025 * Math.pow(1 + q.rho, y - 2025); }
  function partRet(y, q) { return q.partRetraite2025 + (q.partRetraite2070 - q.partRetraite2025) * Math.max(0, Math.min(1, (y - 2025) / 45)); }
  function pensions(y, q) { return pib(y, q) * partRet(y, q); }   // P(y) : dépenses de retraite (répartition pure)
  function flux(y, q) { return pensions(Math.max(y, 2025), q) * (y < 2025 ? Math.pow(1 + q.rho, y - 2025) : 1); } // F(y) = cotisations ≈ P (équilibre)
  function profilS(smax, q) { return function (y) { if (y < q.t0) return 0; return smax * Math.min(1, (y - q.t0 + 1) / q.montee); }; }
  // part des droits de la cohorte qui part à la retraite en v, issue des cotisations détournées (valeur notionnelle)
  function partCohorte(v, s, q) {
    var num = 0, den = 0, t;
    for (t = v - q.carriere; t < v; t++) { var w = flux(t, q) * Math.pow(1 + q.rho, v - t); num += s(t) * w; den += w; }
    return num / den;
  }
  function fPension(u, s, q) { var a = 0, v; for (v = u - q.retraite + 1; v <= u; v++) a += partCohorte(v, s, q); return a / q.retraite; }

  // Double charge, fonds, dette de transition. opts.choc = {annee, perte}
  function doubleCharge(p) {
    var q = params(p), s = profilS(q.smax, q), n = q.annees || 101, A = 0, B = 0, cumul = 0, lignes = [], i, y;
    for (i = 0; i < n; i++) {
      y = q.t0 + i;
      if (q.choc && q.choc.annee === y) A *= (1 - q.choc.perte);
      var F = flux(y, q), P = pensions(y, q), f = fPension(y, s, q), sF = s(y) * F, fP = f * P, D = sF - fP;
      A = A * (1 + q.r) + sF - fP;
      B = B * (1 + q.dette) + D;
      cumul += D;
      lignes.push({ an: y, s: s(y), F: F, P: P, f: f, verse: sF, servi: fP, D: D, fonds: A, dette: B, cumulD: cumul, pib: pib(y, q), interets: Math.max(B, 0) * q.dette });
    }
    var pic = 0, picAn = 0, dur = 0, k, premNeg = null;
    for (k = 0; k < lignes.length; k++) {
      if (lignes[k].D > pic) { pic = lignes[k].D; picAn = lignes[k].an; }
      if (lignes[k].D > 0.0005 * lignes[k].pib) dur = lignes[k].an - q.t0 + 1;
      if (premNeg === null && k > 5 && lignes[k].D < 0) premNeg = lignes[k].an;
    }
    var cumulMax = 0, detteMax = 0, intMax = 0, detteMaxAn = 0, detteMaxPib = 0;
    lignes.forEach(function (l) { if (l.cumulD > cumulMax) cumulMax = l.cumulD; if (l.dette > detteMax) { detteMax = l.dette; detteMaxAn = l.an; detteMaxPib = l.dette / l.pib; } if (l.interets > intMax) intMax = l.interets; });
    return { q: q, lignes: lignes, resume: { picMdE: pic, picAn: picAn, picPctPIB: pic / pib(picAn, q), anneesDoubleCharge: dur, premiereAnneeNegative: premNeg, cumulMaxMdE: cumulMax, detteMaxMdE: detteMax, detteMaxAn: detteMaxAn, detteMaxPctPIB: detteMaxPib, interetsMaxMdE: intMax } };
  }

  // Taux de remplacement de la cohorte qui part en v. Renvoie le rapport pension mixte / pension de répartition et le taux.
  // mode : 'det' (rendement constant r), 'krach' (perte krachPerte l'année v-1), 'perdu' (rendement nul sur les perdu dernières années), ou vecteur de rendements
  function remplacement(p, v, mode) {
    var q = params(p), s = profilS(q.smax, q), rp = q.r - q.ecartRentePrudence / 100;
    var t, K = 0, rep = 0, notionnelTot = 0;
    for (t = v - q.carriere; t < v; t++) {
      var w = Math.pow(1 + q.gw, t - (v - q.carriere));
      var R = q.r;
      if (mode && mode.perdu && t >= v - mode.perdu) R = 0;
      if (mode && mode.rendements) R = mode.rendements[t - (v - q.carriere)];
      K = (K + s(t) * w) * (1 + R);
      rep += (1 - s(t)) * w * Math.pow(1 + q.rho, v - t);
      notionnelTot += w * Math.pow(1 + q.rho, v - t);
    }
    if (mode && mode.krachPerte) K *= (1 - mode.krachPerte);
    var pRep = notionnelTot / facteurRente(q.rho, q.retraite);
    var pMix = rep / facteurRente(q.rho, q.retraite) + K / facteurRente(rp, q.retraite);
    var sEff = 1 - rep / notionnelTot;
    return { rapport: pMix / pRep, taux: q.rr2060 * pMix / pRep, sEff: sEff, capitalParUniteNotionnelle: sEff > 0 ? (K / facteurRente(rp, q.retraite)) / (sEff * pRep) : 1 };
  }

  // générateur déterministe
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function normal(rnd) { var u = 1 - rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function monteCarlo(p, v, tirages) {
    var q = params(p), rnd = mulberry(20261103), out = [], k, j, perd = 0;
    for (k = 0; k < tirages; k++) {
      var rs = [];
      for (j = 0; j < q.carriere; j++) rs.push(Math.exp(Math.log(1 + q.r) + q.sigma * normal(rnd)) - 1);
      var x = remplacement(p, v, { rendements: rs }).rapport;
      out.push(x); if (x < 1) perd++;
    }
    out.sort(function (a, b) { return a - b; });
    function pc(z) { return out[Math.min(out.length - 1, Math.floor(z * out.length))]; }
    return { p5: pc(0.05), p50: pc(0.5), p95: pc(0.95), probMoins: perd / tirages };
  }

  // Sensibilité démographique : à taux de cotisation fixe, la pension de répartition suit X/X0 (cotisants par retraité)
  function demographie(p, X, X0, v) {
    var q = params(p), r = remplacement(p, v || 2060), s = r.sEff, M = r.capitalParUniteNotionnelle;
    var rep = q.rr2060 * (X / X0);
    var mixte = q.rr2060 * ((1 - s) * (X / X0) + s * M);
    return { X: X, repartition: rep, mixte: mixte, cotisationPourTenir: q.tauxCotisation * X0 / X, expositionMixte: 1 - s };
  }

  // Mérite : parts attribuées au prorata des contributions, avec plancher universel phi (part répartie à égalité)
  function merite(revenus, phi) { var tot = revenus.reduce(function (a, b) { return a + b; }, 0), n = revenus.length; return revenus.map(function (y) { return phi / n + (1 - phi) * y / tot; }); }
  // Points par cohorte de naissance (actifs de 22 à 61 ans), cotisations au fonds 2027+, et charge nette de double charge
  function generations(p, naissances) {
    var q = params(p), dc = doubleCharge(merge(p || {}, { annees: 140 })), L = dc.lignes, out = [];
    naissances.forEach(function (b) {
      var pts = 0, charge = 0, ans = 0, t;
      for (t = b + 22; t < b + 62; t++) {
        if (t < q.t0 || t >= q.t0 + L.length) continue;
        var l = L[t - q.t0], N = 1; // effectif actif supposé constant (H27) : par tête et par an
        pts += l.verse / l.F * Math.pow(1 + q.rho, 0); // part de la masse cotisée détournée, par tête-année
        charge += l.D / l.F;
        ans++;
      }
      out.push({ naissance: b, anneesDansLeFonds: ans, pointsParTete: pts, chargeNetteParTete: charge });
    });
    return out;
  }

  // Colosse : TRI d'un investissement (capex 1, EBITDA e la première année, baisse delta par an, durée L, valeur résiduelle vr)
  function tri(e, delta, L, vr) {
    function vpn(x) { var s = -1, t; for (t = 1; t <= L; t++) s += e * Math.pow(1 - delta, t - 1) / Math.pow(1 + x, t); return s + (vr || 0) / Math.pow(1 + x, L); }
    var lo = -0.9, hi = 3, m, k;
    if (vpn(lo) < 0) return -1; if (vpn(hi) > 0) return hi;
    for (k = 0; k < 200; k++) { m = (lo + hi) / 2; if (vpn(m) > 0) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  // Capital à réunir pour qu'un portefeuille rapporte d €/mois par habitant
  function capitalPourDividende(dMois, N, r) { return dMois * 12 * N / r / 1000; } // N en millions -> Md€ : d*12*N(M)/r en M€ /1000

  return { BASE: BASE, SCEN: SCEN, params: params, facteurRente: facteurRente, pib: pib, pensions: pensions, flux: flux, profilS: profilS, partCohorte: partCohorte, fPension: fPension, doubleCharge: doubleCharge, remplacement: remplacement, monteCarlo: monteCarlo, demographie: demographie, merite: merite, generations: generations, tri: tri, capitalPourDividende: capitalPourDividende };
})();
if (typeof module !== 'undefined') module.exports = CCR;
